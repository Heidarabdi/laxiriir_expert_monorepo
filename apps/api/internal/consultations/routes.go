package consultations

import (
	"errors"
	"net/http"
	"strings"
	"time"

	"github.com/gin-gonic/gin"
)

const clientUserIDContextKey = "consultations.clientUserID"

func RegisterRoutes(group *gin.RouterGroup, service *Service, clientGuards ...gin.HandlerFunc) {
	group.GET("/experts", service.ListExpertsHandler)
	group.GET("/experts/:id/availability", service.ListAvailabilityHandler)

	client := group.Group("/client")
	if len(clientGuards) > 0 {
		client.Use(clientGuards...)
	}
	client.GET("/bookings", service.ListClientBookingsHandler)
	client.POST("/bookings", service.CreateBookingHandler)
}

func (s *Service) ListExpertsHandler(c *gin.Context) {
	experts, err := s.ListExperts(c.Request.Context())
	if err != nil {
		c.AbortWithStatusJSON(http.StatusInternalServerError, gin.H{"message": "unable to list experts"})
		return
	}

	c.JSON(http.StatusOK, ExpertListResponse{Experts: experts})
}

func (s *Service) ListAvailabilityHandler(c *gin.Context) {
	expertID := strings.TrimSpace(c.Param("id"))
	if expertID == "" {
		c.AbortWithStatusJSON(http.StatusBadRequest, gin.H{"message": "expert id is required"})
		return
	}

	slots, err := s.ListAvailability(c.Request.Context(), expertID, time.Now().UTC())
	if err != nil {
		c.AbortWithStatusJSON(http.StatusInternalServerError, gin.H{"message": "unable to list availability"})
		return
	}

	c.JSON(http.StatusOK, AvailabilityListResponse{Slots: slots})
}

func SetClientUserID(c *gin.Context, userID string) {
	c.Set(clientUserIDContextKey, strings.TrimSpace(userID))
}

func (s *Service) CreateBookingHandler(c *gin.Context) {
	clientUserID := c.GetString(clientUserIDContextKey)
	if clientUserID == "" {
		c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"message": "unauthorized"})
		return
	}

	var input CreateBookingInput
	if err := c.ShouldBindJSON(&input); err != nil || input.AvailabilitySlotID <= 0 {
		c.AbortWithStatusJSON(http.StatusBadRequest, gin.H{"message": "availabilitySlotId is required"})
		return
	}

	booking, err := s.CreateBooking(c.Request.Context(), clientUserID, input)
	if errors.Is(err, ErrSlotUnavailable) {
		c.AbortWithStatusJSON(http.StatusConflict, gin.H{"message": ErrSlotUnavailable.Error()})
		return
	}
	if err != nil {
		c.AbortWithStatusJSON(http.StatusInternalServerError, gin.H{"message": "unable to create booking"})
		return
	}

	c.JSON(http.StatusCreated, BookingResponse{Booking: *booking})
}

func (s *Service) ListClientBookingsHandler(c *gin.Context) {
	clientUserID := c.GetString(clientUserIDContextKey)
	if clientUserID == "" {
		c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"message": "unauthorized"})
		return
	}

	bookings, err := s.ListClientBookings(c.Request.Context(), clientUserID)
	if err != nil {
		c.AbortWithStatusJSON(http.StatusInternalServerError, gin.H{"message": "unable to list bookings"})
		return
	}

	c.JSON(http.StatusOK, BookingListResponse{Bookings: bookings})
}
