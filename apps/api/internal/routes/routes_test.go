package routes

import (
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"testing"

	"laxiriir-expert-monorepo/apps/api/internal/config"
)

func TestHealthRoute(t *testing.T) {
	router, err := SetupRouter(&config.Config{
		Environment:              "test",
		DatabaseURL:              "file::memory:?cache=shared",
		APIBaseURL:               "http://localhost:8080",
		SuperTokensConnectionURI: "http://localhost:3567",
		TrustedOrigins:           []string{"http://localhost:3000"},
		WebAppOrigin:             "http://localhost:3000",
	})
	if err != nil {
		t.Fatalf("failed to set up router: %v", err)
	}
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
	router, err := SetupRouter(&config.Config{
		Environment:              "test",
		DatabaseURL:              "file::memory:?cache=shared",
		APIBaseURL:               "http://localhost:8080",
		SuperTokensConnectionURI: "http://localhost:3567",
		TrustedOrigins:           []string{"http://localhost:3000"},
		WebAppOrigin:             "http://localhost:3000",
	})
	if err != nil {
		t.Fatalf("failed to set up router: %v", err)
	}
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

func TestCurrentUserRouteRequiresAuthentication(t *testing.T) {
	router, err := SetupRouter(&config.Config{
		Environment:              "test",
		DatabaseURL:              "file::memory:?cache=shared",
		APIBaseURL:               "http://localhost:8080",
		SuperTokensConnectionURI: "http://localhost:3567",
		TrustedOrigins:           []string{"http://localhost:3000"},
		WebAppOrigin:             "http://localhost:3000",
	})
	if err != nil {
		t.Fatalf("failed to set up router: %v", err)
	}

	request := httptest.NewRequest(http.MethodGet, "/api/v1/me", nil)
	recorder := httptest.NewRecorder()

	router.ServeHTTP(recorder, request)

	if recorder.Code != http.StatusUnauthorized {
		t.Fatalf("expected status %d, got %d", http.StatusUnauthorized, recorder.Code)
	}
}
