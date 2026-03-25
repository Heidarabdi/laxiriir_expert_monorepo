package auth

import (
	"time"

	"github.com/uptrace/bun"
)

type PrimaryRole string

const (
	PrimaryRoleClient PrimaryRole = "client"
	PrimaryRoleExpert PrimaryRole = "expert"
	PrimaryRoleAdmin  PrimaryRole = "admin"
)

type ExpertStatus string

const (
	ExpertStatusNotApplicable ExpertStatus = "not_applicable"
	ExpertStatusPendingReview ExpertStatus = "pending_review"
	ExpertStatusApproved      ExpertStatus = "approved"
	ExpertStatusRejected      ExpertStatus = "rejected"
	ExpertStatusSuspended     ExpertStatus = "suspended"
)

type AccountProfile struct {
	bun.BaseModel  `bun:"table:account_profiles"`
	IdentityUserID string       `bun:"column:auth_user_id,pk" json:"identityUserId"`
	Email          string       `bun:"column:email,notnull,unique" json:"email"`
	DisplayName    string       `bun:"column:display_name,notnull" json:"displayName"`
	PrimaryRole    PrimaryRole  `bun:"column:primary_role,notnull" json:"primaryRole"`
	ExpertStatus   ExpertStatus `bun:"column:expert_status,notnull" json:"expertStatus"`
	CreatedAt      time.Time    `bun:"column:created_at,notnull,default:current_timestamp" json:"createdAt"`
	UpdatedAt      time.Time    `bun:"column:updated_at,notnull,default:current_timestamp" json:"updatedAt"`
}

type CurrentUserResponse struct {
	UserID        string       `json:"userId"`
	Email         string       `json:"email"`
	DisplayName   string       `json:"displayName"`
	PrimaryRole   PrimaryRole  `json:"primaryRole"`
	EmailVerified bool         `json:"emailVerified"`
	ExpertStatus  ExpertStatus `json:"expertStatus"`
	AllowedAreas  []string     `json:"allowedAreas"`
}

type ExpertStatusUpdateResponse struct {
	Message string         `json:"message"`
	Profile AccountProfile `json:"profile"`
}

type authMethod string

const (
	authMethodSession authMethod = "session"
	authMethodBearer  authMethod = "bearer"
)
