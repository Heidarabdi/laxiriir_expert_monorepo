package config

import (
	"log"
	"net/url"
	"os"
	"strings"

	"github.com/joho/godotenv"
)

type Config struct {
	Port                     string
	DatabaseURL              string
	APIBaseURL               string
	SuperTokensConnectionURI string
	SuperTokensAPIKey        string
	WebAppOrigin             string
	TrustedOrigins           []string
	Environment              string
	AuthBootstrapAdminEmails []string
	EmailFromAddress         string
	SMTPHost                 string
	SMTPPort                 string
	SMTPUser                 string
	SMTPPass                 string
	ResendAPIKey             string
}

func Load() *Config {
	// Try the API-local env file first, then the repo-root-relative path used when
	// commands are launched from the monorepo root.
	_ = godotenv.Load(".env.local", "apps/api/.env.local")

	databaseURL := getEnv("DATABASE_URL", "")
	port := getEnv("PORT", "8080")
	webAppOrigin := getEnv("WEB_APP_ORIGIN", "http://localhost:3000")
	apiBaseURL := getEnv("API_BASE_URL", "http://localhost:"+port)

	cfg := &Config{
		Port:                     port,
		DatabaseURL:              databaseURL,
		APIBaseURL:               apiBaseURL,
		SuperTokensConnectionURI: getEnv("SUPERTOKENS_CONNECTION_URI", "http://localhost:3567"),
		SuperTokensAPIKey:        getEnv("SUPERTOKENS_API_KEY", ""),
		WebAppOrigin:             webAppOrigin,
		TrustedOrigins:           splitCSV(getEnv("TRUSTED_ORIGINS", webAppOrigin)),
		Environment:              getEnv("GO_ENV", "development"),
		AuthBootstrapAdminEmails: splitCSV(getEnv("AUTH_BOOTSTRAP_ADMIN_EMAILS", "")),
		EmailFromAddress:         getEnv("EMAIL_FROM", ""),
		SMTPHost:                 getEnv("SMTP_HOST", ""),
		SMTPPort:                 getEnv("SMTP_PORT", ""),
		SMTPUser:                 getEnv("SMTP_USER", ""),
		SMTPPass:                 getEnv("SMTP_PASS", ""),
		ResendAPIKey:             getEnv("RESEND_API_KEY", ""),
	}

	if cfg.DatabaseURL == "" {
		log.Println("Warning: DATABASE_URL is not set")
	}

	cfg.TrustedOrigins = expandLocalOrigins(cfg.TrustedOrigins)

	return cfg
}

func getEnv(key, fallback string) string {
	if value, exists := os.LookupEnv(key); exists {
		return value
	}
	return fallback
}

func splitCSV(value string) []string {
	if strings.TrimSpace(value) == "" {
		return nil
	}

	parts := strings.Split(value, ",")
	result := make([]string, 0, len(parts))
	for _, part := range parts {
		trimmed := strings.TrimSpace(part)
		if trimmed != "" {
			result = append(result, trimmed)
		}
	}

	return result
}

func expandLocalOrigins(origins []string) []string {
	if len(origins) == 0 {
		return origins
	}

	seen := make(map[string]struct{}, len(origins)*2)
	result := make([]string, 0, len(origins)*2)

	addOrigin := func(origin string) {
		if _, ok := seen[origin]; ok {
			return
		}
		seen[origin] = struct{}{}
		result = append(result, origin)
	}

	for _, origin := range origins {
		addOrigin(origin)

		parsed, err := url.Parse(origin)
		if err != nil {
			continue
		}

		hostname := parsed.Hostname()
		port := parsed.Port()

		switch hostname {
		case "localhost":
			parsed.Host = "127.0.0.1"
			if port != "" {
				parsed.Host += ":" + port
			}
			addOrigin(parsed.String())
		case "127.0.0.1":
			parsed.Host = "localhost"
			if port != "" {
				parsed.Host += ":" + port
			}
			addOrigin(parsed.String())
		}
	}

	return result
}
