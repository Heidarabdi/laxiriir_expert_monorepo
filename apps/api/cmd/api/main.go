package main

import (
	"log"

	"laxiriir-expert-monorepo/apps/api/internal/config"
	"laxiriir-expert-monorepo/apps/api/internal/routes"
)

func main() {
	// Load configuration
	cfg := config.Load()

	// Initialize router
	router, err := routes.SetupRouter(cfg)
	if err != nil {
		log.Fatalf("Failed to initialize router: %v", err)
	}

	log.Printf("Starting Laxiriir Expert API on port %s", cfg.Port)
	if err := router.Run(":" + cfg.Port); err != nil {
		log.Fatalf("Failed to start server: %v", err)
	}
}
