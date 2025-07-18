package main

import (
	"log"

	"github.com/Raj28Mall/TubeBridge/backend/config"
	"github.com/Raj28Mall/TubeBridge/backend/db"
	"github.com/Raj28Mall/TubeBridge/backend/routes"
	"github.com/gin-gonic/gin"
)

func main() {
	log.Println("Hello, World!")

	cfg := config.Load()

	db.Connect()

	r := gin.Default()
	r.Use(gin.Logger())
	r.Use(gin.Recovery())
	routes.SetupRoutes(r)
	log.Printf("Server starting on port %s", cfg.PORT)
	if err := r.Run(":" + cfg.PORT); err != nil {
		log.Fatal("Failed to start server:", err)
	}
}
