package config

import (
	"log"
	"os"

	"github.com/joho/godotenv"
)

type Config struct {
	Port        string
	DatabaseURL string
	Environment string
}

func Load() *Config {
	// Attempt to load .env file; it's okay if it doesn't exist in production
	_ = godotenv.Load("../../.env.local")

	cfg := &Config{
		Port:        getEnv("PORT", "8080"),
		DatabaseURL: getEnv("DATABASE_URL", ""),
		Environment: getEnv("GO_ENV", "development"),
	}

	if cfg.DatabaseURL == "" {
		log.Println("Warning: DATABASE_URL is not set")
	}

	return cfg
}

func getEnv(key, fallback string) string {
	if value, exists := os.LookupEnv(key); exists {
		return value
	}
	return fallback
}
