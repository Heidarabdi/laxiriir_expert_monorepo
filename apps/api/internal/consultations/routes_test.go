package consultations

import (
	"bytes"
	"database/sql"
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"testing"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/uptrace/bun"
	"github.com/uptrace/bun/dialect/sqlitedialect"
	_ "modernc.org/sqlite"
)

func TestExpertDiscoveryReturnsPersistedExperts(t *testing.T) {
	service := newTestService(t)
	now := futureTestTime()

	if err := service.SeedDemoData(t.Context(), now); err != nil {
		t.Fatalf("seed demo data: %v", err)
	}

	router := gin.New()
	RegisterRoutes(router.Group("/api/v1"), service, nil)

	request := httptest.NewRequest(http.MethodGet, "/api/v1/experts", nil)
	recorder := httptest.NewRecorder()
	router.ServeHTTP(recorder, request)

	if recorder.Code != http.StatusOK {
		t.Fatalf("expected status %d, got %d: %s", http.StatusOK, recorder.Code, recorder.Body.String())
	}

	var response ExpertListResponse
	if err := json.Unmarshal(recorder.Body.Bytes(), &response); err != nil {
		t.Fatalf("decode response: %v", err)
	}

	if len(response.Experts) != 3 {
		t.Fatalf("expected 3 experts, got %d", len(response.Experts))
	}
	if response.Experts[0].ID == "" || response.Experts[0].DisplayName == "" {
		t.Fatalf("expected expert identity fields, got %#v", response.Experts[0])
	}
}

func TestExpertAvailabilityReturnsFutureOpenSlots(t *testing.T) {
	service := newTestService(t)
	now := futureTestTime()

	if err := service.SeedDemoData(t.Context(), now); err != nil {
		t.Fatalf("seed demo data: %v", err)
	}

	router := gin.New()
	RegisterRoutes(router.Group("/api/v1"), service, nil)

	request := httptest.NewRequest(
		http.MethodGet,
		"/api/v1/experts/marcus-thorne/availability",
		nil,
	)
	recorder := httptest.NewRecorder()
	router.ServeHTTP(recorder, request)

	if recorder.Code != http.StatusOK {
		t.Fatalf("expected status %d, got %d: %s", http.StatusOK, recorder.Code, recorder.Body.String())
	}

	var response AvailabilityListResponse
	if err := json.Unmarshal(recorder.Body.Bytes(), &response); err != nil {
		t.Fatalf("decode response: %v", err)
	}

	if len(response.Slots) != 3 {
		t.Fatalf("expected 3 open slots, got %d", len(response.Slots))
	}
	for _, slot := range response.Slots {
		if slot.ExpertID != "marcus-thorne" {
			t.Fatalf("expected Marcus slot, got %#v", slot)
		}
		if !slot.StartsAt.After(now) || slot.Booked {
			t.Fatalf("expected future open slot, got %#v", slot)
		}
	}
}

func TestClientCanCreateBookingForOpenSlot(t *testing.T) {
	service := newTestService(t)
	now := futureTestTime()

	if err := service.SeedDemoData(t.Context(), now); err != nil {
		t.Fatalf("seed demo data: %v", err)
	}
	slots, err := service.ListAvailability(t.Context(), "marcus-thorne", now)
	if err != nil {
		t.Fatalf("list availability: %v", err)
	}

	router := gin.New()
	clientGuard := func(c *gin.Context) {
		SetClientUserID(c, "client-123")
		c.Next()
	}
	RegisterRoutes(router.Group("/api/v1"), service, clientGuard)

	body, err := json.Marshal(CreateBookingInput{AvailabilitySlotID: slots[0].ID})
	if err != nil {
		t.Fatalf("encode request: %v", err)
	}
	request := httptest.NewRequest(
		http.MethodPost,
		"/api/v1/client/bookings",
		bytes.NewReader(body),
	)
	request.Header.Set("Content-Type", "application/json")
	recorder := httptest.NewRecorder()
	router.ServeHTTP(recorder, request)

	if recorder.Code != http.StatusCreated {
		t.Fatalf("expected status %d, got %d: %s", http.StatusCreated, recorder.Code, recorder.Body.String())
	}

	var response BookingResponse
	if err := json.Unmarshal(recorder.Body.Bytes(), &response); err != nil {
		t.Fatalf("decode response: %v", err)
	}

	if response.Booking.ClientUserID != "client-123" {
		t.Fatalf("expected client identity to be persisted, got %#v", response.Booking)
	}
	if response.Booking.Expert.ID != "marcus-thorne" {
		t.Fatalf("expected Marcus booking, got %#v", response.Booking)
	}
	if response.Booking.Status != BookingStatusConfirmed {
		t.Fatalf("expected confirmed booking, got %#v", response.Booking)
	}
}

func TestBookingAnAlreadyClaimedSlotReturnsConflict(t *testing.T) {
	service := newTestService(t)
	now := futureTestTime()

	if err := service.SeedDemoData(t.Context(), now); err != nil {
		t.Fatalf("seed demo data: %v", err)
	}
	slots, err := service.ListAvailability(t.Context(), "marcus-thorne", now)
	if err != nil {
		t.Fatalf("list availability: %v", err)
	}

	router := gin.New()
	clientGuard := func(c *gin.Context) {
		SetClientUserID(c, "client-123")
		c.Next()
	}
	RegisterRoutes(router.Group("/api/v1"), service, clientGuard)

	body, err := json.Marshal(CreateBookingInput{AvailabilitySlotID: slots[0].ID})
	if err != nil {
		t.Fatalf("encode request: %v", err)
	}

	firstRequest := httptest.NewRequest(
		http.MethodPost,
		"/api/v1/client/bookings",
		bytes.NewReader(body),
	)
	firstRequest.Header.Set("Content-Type", "application/json")
	firstRecorder := httptest.NewRecorder()
	router.ServeHTTP(firstRecorder, firstRequest)
	if firstRecorder.Code != http.StatusCreated {
		t.Fatalf("expected first booking to succeed, got %d: %s", firstRecorder.Code, firstRecorder.Body.String())
	}

	secondRequest := httptest.NewRequest(
		http.MethodPost,
		"/api/v1/client/bookings",
		bytes.NewReader(body),
	)
	secondRequest.Header.Set("Content-Type", "application/json")
	secondRecorder := httptest.NewRecorder()
	router.ServeHTTP(secondRecorder, secondRequest)

	if secondRecorder.Code != http.StatusConflict {
		t.Fatalf(
			"expected duplicate booking status %d, got %d: %s",
			http.StatusConflict,
			secondRecorder.Code,
			secondRecorder.Body.String(),
		)
	}
}

func TestClientCannotBookPastAvailability(t *testing.T) {
	service := newTestService(t)
	now := time.Now().UTC()

	if err := service.SeedDemoData(t.Context(), now); err != nil {
		t.Fatalf("seed demo data: %v", err)
	}

	pastSlot := AvailabilitySlot{
		ExpertID:  "marcus-thorne",
		StartsAt:  now.Add(-2 * time.Hour),
		EndsAt:    now.Add(-time.Hour),
		Booked:    false,
		CreatedAt: now,
	}
	if _, err := service.db.NewInsert().Model(&pastSlot).Exec(t.Context()); err != nil {
		t.Fatalf("insert past availability: %v", err)
	}

	router := gin.New()
	clientGuard := func(c *gin.Context) {
		SetClientUserID(c, "client-123")
		c.Next()
	}
	RegisterRoutes(router.Group("/api/v1"), service, clientGuard)

	body, err := json.Marshal(CreateBookingInput{AvailabilitySlotID: pastSlot.ID})
	if err != nil {
		t.Fatalf("encode request: %v", err)
	}
	request := httptest.NewRequest(
		http.MethodPost,
		"/api/v1/client/bookings",
		bytes.NewReader(body),
	)
	request.Header.Set("Content-Type", "application/json")
	recorder := httptest.NewRecorder()
	router.ServeHTTP(recorder, request)

	if recorder.Code != http.StatusConflict {
		t.Fatalf(
			"expected past booking status %d, got %d: %s",
			http.StatusConflict,
			recorder.Code,
			recorder.Body.String(),
		)
	}
}

func TestClientBookingListOnlyReturnsTheirBookings(t *testing.T) {
	service := newTestService(t)
	now := futureTestTime()

	if err := service.SeedDemoData(t.Context(), now); err != nil {
		t.Fatalf("seed demo data: %v", err)
	}
	slots, err := service.ListAvailability(t.Context(), "marcus-thorne", now)
	if err != nil {
		t.Fatalf("list availability: %v", err)
	}
	if _, err := service.CreateBooking(
		t.Context(),
		"client-123",
		CreateBookingInput{AvailabilitySlotID: slots[0].ID},
	); err != nil {
		t.Fatalf("create booking: %v", err)
	}
	if _, err := service.CreateBooking(
		t.Context(),
		"another-client",
		CreateBookingInput{AvailabilitySlotID: slots[1].ID},
	); err != nil {
		t.Fatalf("create second client booking: %v", err)
	}

	router := gin.New()
	clientGuard := func(c *gin.Context) {
		SetClientUserID(c, "client-123")
		c.Next()
	}
	RegisterRoutes(router.Group("/api/v1"), service, clientGuard)

	request := httptest.NewRequest(http.MethodGet, "/api/v1/client/bookings", nil)
	recorder := httptest.NewRecorder()
	router.ServeHTTP(recorder, request)

	if recorder.Code != http.StatusOK {
		t.Fatalf("expected status %d, got %d: %s", http.StatusOK, recorder.Code, recorder.Body.String())
	}

	var response BookingListResponse
	if err := json.Unmarshal(recorder.Body.Bytes(), &response); err != nil {
		t.Fatalf("decode response: %v", err)
	}
	if len(response.Bookings) != 1 {
		t.Fatalf("expected one client booking, got %d", len(response.Bookings))
	}
	if response.Bookings[0].ClientUserID != "client-123" {
		t.Fatalf("expected only authenticated client's booking, got %#v", response.Bookings[0])
	}
}

func newTestService(t *testing.T) *Service {
	t.Helper()

	sqlDB, err := sql.Open("sqlite", "file:"+t.Name()+"?mode=memory&cache=shared")
	if err != nil {
		t.Fatalf("open sqlite database: %v", err)
	}

	db := bun.NewDB(sqlDB, sqlitedialect.New())
	t.Cleanup(func() {
		_ = db.Close()
	})

	service := NewService(db)
	if err := service.EnsureSchema(t.Context()); err != nil {
		t.Fatalf("ensure consultation schema: %v", err)
	}

	return service
}

func futureTestTime() time.Time {
	return time.Date(2100, time.January, 1, 9, 0, 0, 0, time.UTC)
}
