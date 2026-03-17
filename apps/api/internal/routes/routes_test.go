package routes

import (
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"testing"

	"laxiriir-expert-monorepo/apps/api/internal/config"
)

func TestHealthRoute(t *testing.T) {
	router := SetupRouter(&config.Config{Environment: "test"})
	request := httptest.NewRequest(http.MethodGet, "/health", nil)
	recorder := httptest.NewRecorder()

	router.ServeHTTP(recorder, request)

	if recorder.Code != http.StatusOK {
		t.Fatalf("expected status %d, got %d", http.StatusOK, recorder.Code)
	}

	var response map[string]string
	if err := json.Unmarshal(recorder.Body.Bytes(), &response); err != nil {
		t.Fatalf("failed to decode response: %v", err)
	}

	if response["status"] != "ok" {
		t.Fatalf("expected status body to be ok, got %q", response["status"])
	}

	if response["env"] != "test" {
		t.Fatalf("expected env body to be test, got %q", response["env"])
	}
}

func TestPingRoute(t *testing.T) {
	router := SetupRouter(&config.Config{Environment: "test"})
	request := httptest.NewRequest(http.MethodGet, "/api/v1/ping", nil)
	recorder := httptest.NewRecorder()

	router.ServeHTTP(recorder, request)

	if recorder.Code != http.StatusOK {
		t.Fatalf("expected status %d, got %d", http.StatusOK, recorder.Code)
	}

	var response map[string]string
	if err := json.Unmarshal(recorder.Body.Bytes(), &response); err != nil {
		t.Fatalf("failed to decode response: %v", err)
	}

	if response["message"] != "pong" {
		t.Fatalf("expected message body to be pong, got %q", response["message"])
	}
}
