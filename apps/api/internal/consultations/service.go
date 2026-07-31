package consultations

import (
	"context"
	"crypto/rand"
	"encoding/hex"
	"errors"
	"fmt"
	"time"

	"github.com/uptrace/bun"
)

type Service struct {
	db *bun.DB
}

var ErrSlotUnavailable = errors.New("availability slot is no longer available")

func NewService(db *bun.DB) *Service {
	return &Service{db: db}
}

func (s *Service) EnsureSchema(ctx context.Context) error {
	if _, err := s.db.NewCreateTable().Model((*Expert)(nil)).IfNotExists().Exec(ctx); err != nil {
		return fmt.Errorf("create experts table: %w", err)
	}
	if _, err := s.db.NewCreateTable().Model((*AvailabilitySlot)(nil)).IfNotExists().Exec(ctx); err != nil {
		return fmt.Errorf("create availability slots table: %w", err)
	}
	if _, err := s.db.NewCreateTable().Model((*Booking)(nil)).IfNotExists().Exec(ctx); err != nil {
		return fmt.Errorf("create bookings table: %w", err)
	}

	return nil
}

func (s *Service) SeedDemoData(ctx context.Context, now time.Time) error {
	count, err := s.db.NewSelect().Model((*Expert)(nil)).Count(ctx)
	if err != nil {
		return fmt.Errorf("count experts: %w", err)
	}
	if count > 0 {
		return nil
	}

	experts := []Expert{
		{
			ID:              "marcus-thorne",
			DisplayName:     "Marcus Thorne",
			Title:           "Strategy Consultant",
			Category:        "Strategy",
			Bio:             "Former McKinsey partner helping teams turn difficult growth decisions into focused execution.",
			HourlyRateCents: 35000,
			AvatarURL:       "https://api.dicebear.com/7.x/avataaars/svg?seed=Marcus",
			CreatedAt:       now,
			UpdatedAt:       now,
		},
		{
			ID:              "sarah-jenkins",
			DisplayName:     "Sarah Jenkins",
			Title:           "Financial Advisor",
			Category:        "Finance",
			Bio:             "CFA charterholder specializing in startup finance, fundraising, and practical financial planning.",
			HourlyRateCents: 27500,
			AvatarURL:       "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah",
			CreatedAt:       now,
			UpdatedAt:       now,
		},
		{
			ID:              "elena-rodriguez",
			DisplayName:     "Elena Rodriguez",
			Title:           "Operations Expert",
			Category:        "Operations",
			Bio:             "Operations leader helping growing companies improve delivery, systems, and team execution.",
			HourlyRateCents: 30000,
			AvatarURL:       "https://api.dicebear.com/7.x/avataaars/svg?seed=Elena",
			CreatedAt:       now,
			UpdatedAt:       now,
		},
	}

	if _, err := s.db.NewInsert().Model(&experts).Exec(ctx); err != nil {
		return fmt.Errorf("seed experts: %w", err)
	}

	slots := make([]AvailabilitySlot, 0, len(experts)*3)
	for expertIndex, expert := range experts {
		for dayOffset := 1; dayOffset <= 3; dayOffset++ {
			startsAt := now.
				AddDate(0, 0, dayOffset).
				Add(time.Duration(expertIndex) * time.Hour)
			slots = append(slots, AvailabilitySlot{
				ExpertID:  expert.ID,
				StartsAt:  startsAt,
				EndsAt:    startsAt.Add(time.Hour),
				Booked:    false,
				CreatedAt: now,
			})
		}
	}

	if _, err := s.db.NewInsert().Model(&slots).Exec(ctx); err != nil {
		return fmt.Errorf("seed availability: %w", err)
	}

	return nil
}

func (s *Service) ListExperts(ctx context.Context) ([]Expert, error) {
	experts := make([]Expert, 0)
	if err := s.db.NewSelect().
		Model(&experts).
		OrderExpr("display_name ASC").
		Scan(ctx); err != nil {
		return nil, fmt.Errorf("list experts: %w", err)
	}

	return experts, nil
}

func (s *Service) ListAvailability(
	ctx context.Context,
	expertID string,
	after time.Time,
) ([]AvailabilitySlot, error) {
	slots := make([]AvailabilitySlot, 0)
	if err := s.db.NewSelect().
		Model(&slots).
		Where("expert_id = ?", expertID).
		Where("starts_at > ?", after).
		Where("booked = ?", false).
		OrderExpr("starts_at ASC").
		Scan(ctx); err != nil {
		return nil, fmt.Errorf("list availability: %w", err)
	}

	return slots, nil
}

func (s *Service) CreateBooking(
	ctx context.Context,
	clientUserID string,
	input CreateBookingInput,
) (*BookingDetail, error) {
	var detail BookingDetail
	now := time.Now().UTC()

	err := s.db.RunInTx(ctx, nil, func(ctx context.Context, tx bun.Tx) error {
		var slot AvailabilitySlot
		if err := tx.NewSelect().
			Model(&slot).
			Where("id = ?", input.AvailabilitySlotID).
			Scan(ctx); err != nil {
			return ErrSlotUnavailable
		}

		result, err := tx.NewUpdate().
			Model((*AvailabilitySlot)(nil)).
			Set("booked = ?", true).
			Where("id = ?", slot.ID).
			Where("booked = ?", false).
			Where("starts_at > ?", now).
			Exec(ctx)
		if err != nil {
			return fmt.Errorf("claim availability slot: %w", err)
		}

		rowsAffected, err := result.RowsAffected()
		if err != nil {
			return fmt.Errorf("read availability update result: %w", err)
		}
		if rowsAffected != 1 {
			return ErrSlotUnavailable
		}

		var expert Expert
		if err := tx.NewSelect().
			Model(&expert).
			Where("id = ?", slot.ExpertID).
			Scan(ctx); err != nil {
			return fmt.Errorf("load booking expert: %w", err)
		}

		booking := Booking{
			ID:                 newBookingID(),
			ClientUserID:       clientUserID,
			ExpertID:           slot.ExpertID,
			AvailabilitySlotID: slot.ID,
			StartsAt:           slot.StartsAt,
			EndsAt:             slot.EndsAt,
			Status:             BookingStatusConfirmed,
			CreatedAt:          now,
		}
		if _, err := tx.NewInsert().Model(&booking).Exec(ctx); err != nil {
			return fmt.Errorf("create booking: %w", err)
		}

		detail = bookingDetail(booking, expert)
		return nil
	})
	if err != nil {
		return nil, err
	}

	return &detail, nil
}

func (s *Service) ListClientBookings(
	ctx context.Context,
	clientUserID string,
) ([]BookingDetail, error) {
	bookings := make([]Booking, 0)
	if err := s.db.NewSelect().
		Model(&bookings).
		Where("client_user_id = ?", clientUserID).
		OrderExpr("starts_at ASC").
		Scan(ctx); err != nil {
		return nil, fmt.Errorf("list client bookings: %w", err)
	}

	details := make([]BookingDetail, 0, len(bookings))
	for _, booking := range bookings {
		var expert Expert
		if err := s.db.NewSelect().
			Model(&expert).
			Where("id = ?", booking.ExpertID).
			Scan(ctx); err != nil {
			return nil, fmt.Errorf("load booking expert: %w", err)
		}
		details = append(details, bookingDetail(booking, expert))
	}

	return details, nil
}

func bookingDetail(booking Booking, expert Expert) BookingDetail {
	return BookingDetail{
		ID:                 booking.ID,
		ClientUserID:       booking.ClientUserID,
		AvailabilitySlotID: booking.AvailabilitySlotID,
		StartsAt:           booking.StartsAt,
		EndsAt:             booking.EndsAt,
		Status:             booking.Status,
		CreatedAt:          booking.CreatedAt,
		Expert:             expert,
	}
}

func newBookingID() string {
	var value [16]byte
	if _, err := rand.Read(value[:]); err != nil {
		return fmt.Sprintf("booking-%d", time.Now().UnixNano())
	}

	return hex.EncodeToString(value[:])
}
