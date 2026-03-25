package auth

import (
	"context"
	"database/sql"
	"errors"
	"fmt"
	"net/http"
	"strconv"
	"strings"
	"sync"
	"time"

	"github.com/gin-gonic/gin"
	_ "github.com/lib/pq"
	"github.com/supertokens/supertokens-golang/ingredients/emaildelivery"
	"github.com/supertokens/supertokens-golang/recipe/emailpassword"
	"github.com/supertokens/supertokens-golang/recipe/emailpassword/epmodels"
	"github.com/supertokens/supertokens-golang/recipe/emailverification"
	"github.com/supertokens/supertokens-golang/recipe/emailverification/evmodels"
	"github.com/supertokens/supertokens-golang/recipe/session"
	"github.com/supertokens/supertokens-golang/recipe/session/sessmodels"
	"github.com/supertokens/supertokens-golang/supertokens"
	"github.com/uptrace/bun"
	"github.com/uptrace/bun/dialect/pgdialect"
	"github.com/uptrace/bun/dialect/sqlitedialect"
	"github.com/uptrace/bun/schema"
	gomail "gopkg.in/gomail.v2"
	"laxiriir-expert-monorepo/apps/api/internal/config"
	_ "modernc.org/sqlite"
)

const (
	appName             = "Laxiriir Expert"
	nameFormFieldID     = "name"
	roleFormFieldID     = "role"
	supertokensBasePath = "/api/auth"
)

var (
	supertokensInitOnce sync.Once
	supertokensInitErr  error

	activeServiceMu sync.RWMutex
	activeService   *Service
)

type requestAuthContext struct {
	EmailVerified bool
	Profile       *AccountProfile
	Session       sessmodels.SessionContainer
}

type GuardOptions struct {
	AllowedRoles          []PrimaryRole
	RequireVerified       bool
	RequireExpertApproved bool
}

type Service struct {
	authHandler          http.Handler
	bootstrapAdminEmails map[string]struct{}
	config               *config.Config
	db                   *bun.DB
	emailSink            *EmailSink
}

func NewService(cfg *config.Config) (*Service, error) {
	if strings.TrimSpace(cfg.DatabaseURL) == "" {
		return nil, errors.New("database url is required")
	}

	db, err := openDatabase(cfg.DatabaseURL)
	if err != nil {
		return nil, err
	}

	svc := &Service{
		bootstrapAdminEmails: make(map[string]struct{}),
		config:               cfg,
		db:                   db,
		emailSink:            NewEmailSink(),
	}

	for _, email := range cfg.AuthBootstrapAdminEmails {
		normalized := strings.ToLower(strings.TrimSpace(email))
		if normalized != "" {
			svc.bootstrapAdminEmails[normalized] = struct{}{}
		}
	}

	setActiveService(svc)

	supertokensInitOnce.Do(func() {
		supertokensInitErr = initSuperTokens(cfg)
	})
	if supertokensInitErr != nil {
		return nil, fmt.Errorf("initialize supertokens: %w", supertokensInitErr)
	}

	svc.authHandler = supertokens.Middleware(http.HandlerFunc(notFoundAuthHandler))

	if err := svc.ensureAppTables(context.Background()); err != nil {
		return nil, err
	}

	return svc, nil
}

func (s *Service) AuthHandler() http.Handler {
	return s.authHandler
}

func (s *Service) EmailSink() *EmailSink {
	return s.emailSink
}

func (s *Service) RequireAuth(options GuardOptions) gin.HandlerFunc {
	return func(c *gin.Context) {
		sessionContainer, err := session.GetSession(
			c.Request,
			c.Writer,
			&sessmodels.VerifySessionOptions{
				CheckDatabase:   boolPtr(true),
				SessionRequired: boolPtr(true),
			},
		)
		if err != nil || sessionContainer == nil {
			c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"message": "unauthorized"})
			return
		}

		authCtx, err := s.buildRequestAuthContext(c.Request.Context(), sessionContainer)
		if err != nil {
			c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"message": "unauthorized"})
			return
		}

		if options.RequireVerified && !authCtx.EmailVerified {
			c.AbortWithStatusJSON(http.StatusForbidden, gin.H{"message": "email verification required"})
			return
		}

		if len(options.AllowedRoles) > 0 && !containsRole(options.AllowedRoles, authCtx.Profile.PrimaryRole) {
			c.AbortWithStatusJSON(http.StatusForbidden, gin.H{"message": "forbidden"})
			return
		}

		if options.RequireExpertApproved {
			if authCtx.Profile.PrimaryRole != PrimaryRoleExpert || authCtx.Profile.ExpertStatus != ExpertStatusApproved {
				c.AbortWithStatusJSON(http.StatusForbidden, gin.H{"message": "expert approval required"})
				return
			}
		}

		c.Set("auth", authCtx)
		c.Next()
	}
}

func (s *Service) CurrentUserHandler(c *gin.Context) {
	authCtx, ok := c.MustGet("auth").(*requestAuthContext)
	if !ok || authCtx == nil {
		c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"message": "unauthorized"})
		return
	}

	c.JSON(http.StatusOK, CurrentUserResponse{
		UserID:        authCtx.Session.GetUserID(),
		Email:         authCtx.Profile.Email,
		DisplayName:   authCtx.Profile.DisplayName,
		PrimaryRole:   authCtx.Profile.PrimaryRole,
		EmailVerified: authCtx.EmailVerified,
		ExpertStatus:  authCtx.Profile.ExpertStatus,
		AllowedAreas:  buildAllowedAreas(authCtx.Profile),
	})
}

func (s *Service) UpdateExpertStatusHandler(status ExpertStatus, message string) gin.HandlerFunc {
	return func(c *gin.Context) {
		identityUserID := strings.TrimSpace(c.Param("id"))
		if identityUserID == "" {
			c.AbortWithStatusJSON(http.StatusBadRequest, gin.H{"message": "expert id is required"})
			return
		}

		profile, err := s.updateExpertStatus(c.Request.Context(), identityUserID, status)
		if err != nil {
			if errors.Is(err, sql.ErrNoRows) {
				c.AbortWithStatusJSON(http.StatusNotFound, gin.H{"message": "expert profile not found"})
				return
			}
			c.AbortWithStatusJSON(http.StatusBadRequest, gin.H{"message": err.Error()})
			return
		}

		c.JSON(http.StatusOK, ExpertStatusUpdateResponse{
			Message: message,
			Profile: *profile,
		})
	}
}

func (s *Service) buildRequestAuthContext(
	ctx context.Context,
	sessionContainer sessmodels.SessionContainer,
) (*requestAuthContext, error) {
	userID := sessionContainer.GetUserID()
	identity, err := getEmailPasswordUserByID(userID)
	if err != nil {
		return nil, err
	}

	profile, err := s.ensureProfileForIdentity(ctx, identity.ID, identity.Email, "", nil)
	if err != nil {
		return nil, err
	}

	emailVerified, err := emailverification.IsEmailVerified(userID, &identity.Email)
	if err != nil {
		return nil, err
	}

	return &requestAuthContext{
		EmailVerified: emailVerified,
		Profile:       profile,
		Session:       sessionContainer,
	}, nil
}

func (s *Service) ensureAppTables(ctx context.Context) error {
	if _, err := s.db.NewCreateTable().Model((*AccountProfile)(nil)).IfNotExists().Exec(ctx); err != nil {
		return fmt.Errorf("create account_profiles table: %w", err)
	}
	return nil
}

func (s *Service) persistProfileForSignUp(
	ctx context.Context,
	user epmodels.User,
	formFields []epmodels.TypeFormField,
) error {
	displayName := strings.TrimSpace(getFormFieldValue(formFields, nameFormFieldID))
	requestedRole, err := parseRequestedRole(getFormFieldValue(formFields, roleFormFieldID))
	if err != nil {
		return err
	}

	_, err = s.ensureProfileForIdentity(ctx, user.ID, user.Email, displayName, &requestedRole)
	return err
}

func (s *Service) ensureProfileForIdentity(
	ctx context.Context,
	identityUserID string,
	email string,
	displayName string,
	requestedRole *PrimaryRole,
) (*AccountProfile, error) {
	var profile AccountProfile
	err := s.db.NewSelect().
		Model(&profile).
		Where("auth_user_id = ?", identityUserID).
		Scan(ctx)

	resolvedRole, resolvedStatus := s.resolveRoleForIdentity(email, requestedRole)
	displayName = normalizeDisplayName(displayName, email)
	now := time.Now().UTC()

	if err == nil {
		profile.Email = email
		profile.UpdatedAt = now

		if displayName != "" {
			profile.DisplayName = displayName
		}

		if resolvedRole == PrimaryRoleAdmin {
			profile.PrimaryRole = PrimaryRoleAdmin
			profile.ExpertStatus = ExpertStatusNotApplicable
		}

		if _, updateErr := s.db.NewUpdate().
			Model(&profile).
			Column("email", "display_name", "primary_role", "expert_status", "updated_at").
			WherePK().
			Exec(ctx); updateErr != nil {
			return nil, updateErr
		}

		return &profile, nil
	}
	if !errors.Is(err, sql.ErrNoRows) {
		return nil, err
	}

	profile = AccountProfile{
		IdentityUserID: identityUserID,
		Email:          email,
		DisplayName:    displayName,
		PrimaryRole:    resolvedRole,
		ExpertStatus:   resolvedStatus,
		CreatedAt:      now,
		UpdatedAt:      now,
	}

	if _, err := s.db.NewInsert().Model(&profile).Exec(ctx); err != nil {
		return nil, err
	}

	return &profile, nil
}

func (s *Service) resolveRoleForIdentity(email string, requestedRole *PrimaryRole) (PrimaryRole, ExpertStatus) {
	if _, ok := s.bootstrapAdminEmails[strings.ToLower(strings.TrimSpace(email))]; ok {
		return PrimaryRoleAdmin, ExpertStatusNotApplicable
	}

	if requestedRole != nil && *requestedRole == PrimaryRoleExpert {
		return PrimaryRoleExpert, ExpertStatusPendingReview
	}

	return PrimaryRoleClient, ExpertStatusNotApplicable
}

func (s *Service) updateExpertStatus(
	ctx context.Context,
	identityUserID string,
	status ExpertStatus,
) (*AccountProfile, error) {
	var profile AccountProfile
	if err := s.db.NewSelect().
		Model(&profile).
		Where("auth_user_id = ?", identityUserID).
		Scan(ctx); err != nil {
		return nil, err
	}

	if profile.PrimaryRole != PrimaryRoleExpert {
		return nil, errors.New("user is not an expert")
	}

	profile.ExpertStatus = status
	profile.UpdatedAt = time.Now().UTC()

	if _, err := s.db.NewUpdate().
		Model(&profile).
		Column("expert_status", "updated_at").
		WherePK().
		Exec(ctx); err != nil {
		return nil, err
	}

	return &profile, nil
}

func initSuperTokens(cfg *config.Config) error {
	apiDomain := strings.TrimRight(cfg.APIBaseURL, "/")
	apiBasePath := supertokensBasePath
	antiCSRF := "VIA_TOKEN"
	cookieSameSite := "lax"
	cookieSecure := cfg.Environment == "production"

	sendAuthEmail := func(input emaildelivery.EmailType, userContext supertokens.UserContext) error {
		svc := getActiveService()
		if svc == nil {
			return nil
		}

		switch {
		case input.EmailVerification != nil:
			link := normalizeVerificationLink(input.EmailVerification.EmailVerifyLink)
			if err := svc.deliverEmail(
				input.EmailVerification.User.Email,
				"Verify your Laxiriir Expert account",
				buildVerificationEmailBody(link),
			); err != nil {
				return err
			}
			svc.emailSink.RecordVerification(input.EmailVerification.User.Email, link)
		case input.PasswordReset != nil:
			link := normalizePasswordResetLink(input.PasswordReset.PasswordResetLink)
			if err := svc.deliverEmail(
				input.PasswordReset.User.Email,
				"Reset your Laxiriir Expert password",
				buildPasswordResetEmailBody(link),
			); err != nil {
				return err
			}
			svc.emailSink.RecordPasswordReset(input.PasswordReset.User.Email, link)
		}

		return nil
	}

	return supertokens.Init(supertokens.TypeInput{
		AppInfo: supertokens.AppInfo{
			AppName:       appName,
			APIDomain:     apiDomain,
			APIBasePath:   &apiBasePath,
			WebsiteDomain: cfg.WebAppOrigin,
		},
		Supertokens: &supertokens.ConnectionInfo{
			ConnectionURI: cfg.SuperTokensConnectionURI,
			APIKey:        cfg.SuperTokensAPIKey,
		},
		RecipeList: []supertokens.Recipe{
			session.Init(&sessmodels.TypeInput{
				AntiCsrf:       &antiCSRF,
				CookieSameSite: &cookieSameSite,
				CookieSecure:   &cookieSecure,
			}),
			emailverification.Init(evmodels.TypeInput{
				Mode: evmodels.ModeOptional,
				EmailDelivery: &emaildelivery.TypeInput{
					Service: &emaildelivery.EmailDeliveryInterface{
						SendEmail: &sendAuthEmail,
					},
				},
			}),
			emailpassword.Init(&epmodels.TypeInput{
				EmailDelivery: &emaildelivery.TypeInput{
					Service: &emaildelivery.EmailDeliveryInterface{
						SendEmail: &sendAuthEmail,
					},
				},
				Override: &epmodels.OverrideStruct{
					APIs: func(originalImplementation epmodels.APIInterface) epmodels.APIInterface {
						if originalImplementation.SignUpPOST == nil || *originalImplementation.SignUpPOST == nil {
							return originalImplementation
						}

						originalSignUp := *originalImplementation.SignUpPOST
						*originalImplementation.SignUpPOST = func(
							formFields []epmodels.TypeFormField,
							tenantID string,
							options epmodels.APIOptions,
							userContext supertokens.UserContext,
						) (epmodels.SignUpPOSTResponse, error) {
							response, err := originalSignUp(formFields, tenantID, options, userContext)
							if err != nil || response.OK == nil {
								return response, err
							}

							svc := getActiveService()
							if svc == nil {
								return epmodels.SignUpPOSTResponse{
									GeneralError: &supertokens.GeneralErrorResponse{
										Message: "auth service unavailable",
									},
								}, nil
							}

							if err := svc.persistProfileForSignUp(options.Req.Context(), response.OK.User, formFields); err != nil {
								if response.OK.Session != nil {
									_ = response.OK.Session.RevokeSession()
								}
								return epmodels.SignUpPOSTResponse{
									GeneralError: &supertokens.GeneralErrorResponse{
										Message: err.Error(),
									},
								}, nil
							}

							return response, nil
						}

						return originalImplementation
					},
				},
				SignUpFeature: &epmodels.TypeInputSignUp{
					FormFields: []epmodels.TypeInputFormField{
						{
							ID: nameFormFieldID,
							Validate: func(value interface{}, tenantID string) *string {
								name := strings.TrimSpace(fmt.Sprint(value))
								if name != "" {
									return nil
								}
								err := "Full name is required."
								return &err
							},
						},
						{
							ID: roleFormFieldID,
							Validate: func(value interface{}, tenantID string) *string {
								_, err := parseRequestedRole(fmt.Sprint(value))
								if err == nil {
									return nil
								}
								message := err.Error()
								return &message
							},
						},
					},
				},
			}),
		},
	})
}

func getEmailPasswordUserByID(userID string) (*epmodels.User, error) {
	user, err := emailpassword.GetUserByID(userID)
	if err != nil {
		return nil, err
	}
	if user == nil {
		return nil, sql.ErrNoRows
	}
	return user, nil
}

func openDatabase(databaseURL string) (*bun.DB, error) {
	var (
		dialect schema.Dialect
		driver  string
	)

	switch {
	case strings.HasPrefix(databaseURL, "postgres://"), strings.HasPrefix(databaseURL, "postgresql://"):
		driver = "postgres"
		dialect = pgdialect.New()
	case strings.HasPrefix(databaseURL, "file:"), strings.Contains(databaseURL, ":memory:"), strings.HasSuffix(databaseURL, ".db"):
		driver = "sqlite"
		dialect = sqlitedialect.New()
	default:
		return nil, fmt.Errorf("unsupported database url: %s", databaseURL)
	}

	sqlDB, err := sql.Open(driver, databaseURL)
	if err != nil {
		return nil, fmt.Errorf("open app database: %w", err)
	}

	return bun.NewDB(sqlDB, dialect), nil
}

func parseRequestedRole(raw string) (PrimaryRole, error) {
	switch PrimaryRole(strings.TrimSpace(raw)) {
	case PrimaryRoleClient:
		return PrimaryRoleClient, nil
	case PrimaryRoleExpert:
		return PrimaryRoleExpert, nil
	default:
		return "", errors.New("Account type must be client or expert.")
	}
}

func normalizeDisplayName(displayName string, email string) string {
	displayName = strings.TrimSpace(displayName)
	if displayName != "" {
		return displayName
	}
	return strings.TrimSpace(email)
}

func getFormFieldValue(formFields []epmodels.TypeFormField, id string) string {
	for _, field := range formFields {
		if field.ID == id {
			return fmt.Sprint(field.Value)
		}
	}
	return ""
}

func buildAllowedAreas(profile *AccountProfile) []string {
	switch profile.PrimaryRole {
	case PrimaryRoleAdmin:
		return []string{"admin"}
	case PrimaryRoleExpert:
		if profile.ExpertStatus == ExpertStatusApproved {
			return []string{"expert"}
		}
		return []string{"expert_pending"}
	default:
		return []string{"client"}
	}
}

func containsRole(roles []PrimaryRole, role PrimaryRole) bool {
	for _, candidate := range roles {
		if candidate == role {
			return true
		}
	}
	return false
}

func setActiveService(svc *Service) {
	activeServiceMu.Lock()
	defer activeServiceMu.Unlock()
	activeService = svc
}

func getActiveService() *Service {
	activeServiceMu.RLock()
	defer activeServiceMu.RUnlock()
	return activeService
}

func boolPtr(value bool) *bool {
	return &value
}

func normalizeVerificationLink(raw string) string {
	return strings.Replace(raw, "/auth/verify-email", "/verify-email", 1)
}

func normalizePasswordResetLink(raw string) string {
	return strings.Replace(raw, "/auth/reset-password", "/reset-password", 1)
}

func buildVerificationEmailBody(link string) string {
	return strings.Join([]string{
		"Welcome to Laxiriir Expert.",
		"",
		"Verify your email by opening the link below:",
		link,
		"",
		"If you did not create this account, you can ignore this email.",
	}, "\n")
}

func buildPasswordResetEmailBody(link string) string {
	return strings.Join([]string{
		"You requested a password reset for Laxiriir Expert.",
		"",
		"Open the link below to choose a new password:",
		link,
		"",
		"If you did not request this, you can ignore this email.",
	}, "\n")
}

func (s *Service) deliverEmail(to string, subject string, body string) error {
	if strings.TrimSpace(s.config.SMTPHost) == "" || strings.TrimSpace(s.config.EmailFromAddress) == "" {
		return nil
	}

	port, err := strconv.Atoi(strings.TrimSpace(s.config.SMTPPort))
	if err != nil || port <= 0 {
		return fmt.Errorf("invalid smtp port: %q", s.config.SMTPPort)
	}

	message := gomail.NewMessage()
	message.SetHeader("From", s.config.EmailFromAddress)
	message.SetHeader("To", to)
	message.SetHeader("Subject", subject)
	message.SetBody("text/plain", body)

	dialer := gomail.NewDialer(
		strings.TrimSpace(s.config.SMTPHost),
		port,
		strings.TrimSpace(s.config.SMTPUser),
		s.config.SMTPPass,
	)

	if err := dialer.DialAndSend(message); err != nil {
		return fmt.Errorf("send smtp email: %w", err)
	}

	return nil
}

func notFoundAuthHandler(res http.ResponseWriter, req *http.Request) {
	http.NotFound(res, req)
}
