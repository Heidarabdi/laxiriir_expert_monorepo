package routes

import (
	"context"
	"net/http"
	"time"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"github.com/supertokens/supertokens-golang/supertokens"
	"laxiriir-expert-monorepo/apps/api/internal/auth"
	"laxiriir-expert-monorepo/apps/api/internal/config"
	"laxiriir-expert-monorepo/apps/api/internal/consultations"
)

func SetupRouter(cfg *config.Config) (*gin.Engine, error) {
	router, _, err := SetupRouterWithServices(cfg)
	return router, err
}

func SetupRouterWithServices(cfg *config.Config) (*gin.Engine, *auth.Service, error) {
	if cfg.Environment == "production" {
		gin.SetMode(gin.ReleaseMode)
	}

	authService, err := auth.NewService(cfg)
	if err != nil {
		return nil, nil, err
	}
	consultationService := consultations.NewService(authService.Database())
	if err := consultationService.EnsureSchema(context.Background()); err != nil {
		return nil, nil, err
	}
	if cfg.Environment == "development" {
		if err := consultationService.SeedDemoData(context.Background(), time.Now().UTC()); err != nil {
			return nil, nil, err
		}
	}

	r := gin.Default()

	allowHeaders := append(
		[]string{"Origin", "Content-Type", "Accept", "Authorization"},
		supertokens.GetAllCORSHeaders()...,
	)
	exposeHeaders := append([]string{"Content-Length"}, supertokens.GetAllCORSHeaders()...)

	r.Use(cors.New(cors.Config{
		AllowOrigins:     cfg.TrustedOrigins,
		AllowMethods:     []string{"GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"},
		AllowHeaders:     dedupeStrings(allowHeaders),
		ExposeHeaders:    dedupeStrings(exposeHeaders),
		AllowCredentials: true,
	}))

	// Health check endpoint
	r.GET("/health", func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{
			"status": "ok",
			"env":    cfg.Environment,
		})
	})

	// API v1 group
	v1 := r.Group("/api/v1")
	{
		v1.GET("/ping", func(c *gin.Context) {
			c.JSON(http.StatusOK, gin.H{"message": "pong"})
		})
		v1.GET(
			"/me",
			authService.RequireAuth(auth.GuardOptions{RequireVerified: false}),
			authService.CurrentUserHandler,
		)
		v1.PATCH(
			"/admin/experts/:id/approve",
			authService.RequireAuth(auth.GuardOptions{
				AllowedRoles:    []auth.PrimaryRole{auth.PrimaryRoleAdmin},
				RequireVerified: true,
			}),
			authService.UpdateExpertStatusHandler(auth.ExpertStatusApproved, "expert approved"),
		)
		v1.PATCH(
			"/admin/experts/:id/reject",
			authService.RequireAuth(auth.GuardOptions{
				AllowedRoles:    []auth.PrimaryRole{auth.PrimaryRoleAdmin},
				RequireVerified: true,
			}),
			authService.UpdateExpertStatusHandler(auth.ExpertStatusRejected, "expert rejected"),
		)
		v1.PATCH(
			"/admin/experts/:id/suspend",
			authService.RequireAuth(auth.GuardOptions{
				AllowedRoles:    []auth.PrimaryRole{auth.PrimaryRoleAdmin},
				RequireVerified: true,
			}),
			authService.UpdateExpertStatusHandler(auth.ExpertStatusSuspended, "expert suspended"),
		)
		consultations.RegisterRoutes(
			v1,
			consultationService,
			authService.RequireAuth(auth.GuardOptions{
				AllowedRoles:    []auth.PrimaryRole{auth.PrimaryRoleClient},
				RequireVerified: true,
			}),
			func(c *gin.Context) {
				principal, ok := auth.PrincipalFromContext(c)
				if !ok {
					c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"message": "unauthorized"})
					return
				}
				consultations.SetClientUserID(c, principal.UserID)
				c.Next()
			},
		)
	}

	r.Any("/api/auth/*path", gin.WrapH(authService.AuthHandler()))

	return r, authService, nil
}

func dedupeStrings(values []string) []string {
	seen := make(map[string]struct{}, len(values))
	result := make([]string, 0, len(values))

	for _, value := range values {
		if _, ok := seen[value]; ok {
			continue
		}
		seen[value] = struct{}{}
		result = append(result, value)
	}

	return result
}
