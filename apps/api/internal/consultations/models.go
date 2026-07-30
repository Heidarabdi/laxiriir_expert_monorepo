package consultations

import (
	"time"

	"github.com/uptrace/bun"
)

type Expert struct {
	bun.BaseModel   `bun:"table:experts"`
	ID              string    `bun:"id,pk" json:"id"`
	DisplayName     string    `bun:"display_name,notnull" json:"displayName"`
	Title           string    `bun:"title,notnull" json:"title"`
	Category        string    `bun:"category,notnull" json:"category"`
	Bio             string    `bun:"bio,notnull" json:"bio"`
	HourlyRateCents int       `bun:"hourly_rate_cents,notnull" json:"hourlyRateCents"`
	AvatarURL       string    `bun:"avatar_url,notnull" json:"avatarUrl"`
	CreatedAt       time.Time `bun:"created_at,notnull" json:"createdAt"`
	UpdatedAt       time.Time `bun:"updated_at,notnull" json:"updatedAt"`
}

type ExpertListResponse struct {
	Experts []Expert `json:"experts"`
}

type AvailabilitySlot struct {
	bun.BaseModel `bun:"table:availability_slots"`
	ID            int64     `bun:"id,pk,autoincrement" json:"id"`
	ExpertID      string    `bun:"expert_id,notnull" json:"expertId"`
	StartsAt      time.Time `bun:"starts_at,notnull" json:"startsAt"`
	EndsAt        time.Time `bun:"ends_at,notnull" json:"endsAt"`
	Booked        bool      `bun:"booked,notnull,default:false" json:"booked"`
	CreatedAt     time.Time `bun:"created_at,notnull" json:"createdAt"`
}

type AvailabilityListResponse struct {
	Slots []AvailabilitySlot `json:"slots"`
}

type BookingStatus string

const (
	BookingStatusConfirmed BookingStatus = "confirmed"
)

type Booking struct {
	bun.BaseModel      `bun:"table:bookings"`
	ID                 string        `bun:"id,pk" json:"id"`
	ClientUserID       string        `bun:"client_user_id,notnull" json:"clientUserId"`
	ExpertID           string        `bun:"expert_id,notnull" json:"expertId"`
	AvailabilitySlotID int64         `bun:"availability_slot_id,notnull,unique" json:"availabilitySlotId"`
	StartsAt           time.Time     `bun:"starts_at,notnull" json:"startsAt"`
	EndsAt             time.Time     `bun:"ends_at,notnull" json:"endsAt"`
	Status             BookingStatus `bun:"status,notnull" json:"status"`
	CreatedAt          time.Time     `bun:"created_at,notnull" json:"createdAt"`
}

type CreateBookingInput struct {
	AvailabilitySlotID int64 `json:"availabilitySlotId"`
}

type BookingDetail struct {
	ID                 string        `json:"id"`
	ClientUserID       string        `json:"clientUserId"`
	AvailabilitySlotID int64         `json:"availabilitySlotId"`
	StartsAt           time.Time     `json:"startsAt"`
	EndsAt             time.Time     `json:"endsAt"`
	Status             BookingStatus `json:"status"`
	CreatedAt          time.Time     `json:"createdAt"`
	Expert             Expert        `json:"expert"`
}

type BookingResponse struct {
	Booking BookingDetail `json:"booking"`
}

type BookingListResponse struct {
	Bookings []BookingDetail `json:"bookings"`
}
