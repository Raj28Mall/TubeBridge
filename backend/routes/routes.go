package routes

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

func SetupRoutes(r *gin.Engine) {
	r.GET("/", welcome)

	managers := r.Group("/managers")
	{
		managers.GET("/", getManagers)
		managers.POST("/", postManagers)
		managers.DELETE("/", deleteManagers)
	}

}

func welcome(c *gin.Context) {
	c.JSON(http.StatusOK, gin.H{
		"message": "Welcome to TubeBridge API",
	})
}

func getManagers(c *gin.Context) {

}

func postManagers(c *gin.Context) {

}

func deleteManagers(c *gin.Context) {

}
