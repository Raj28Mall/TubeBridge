package main

import (
	"log"

	"github.com/Raj28Mall/TubeBridge/backend/config"
	"github.com/Raj28Mall/TubeBridge/backend/routes"
	"github.com/gin-gonic/gin"
)

func init() {

}

func main() {
	cfg := config.Load()

	r := gin.Default()

	// Middleware
	// r.Use(gin.Logger()) //These are already added by the gin.Default() function
	// r.Use(gin.Recovery())

	routes.SetupRoutes(r)

	log.Printf("Server starting on port %s", cfg.PORT)

	err := r.Run(":" + cfg.PORT)
	if err != nil {
		log.Fatal("Failed to start server:", err)
	}
}
