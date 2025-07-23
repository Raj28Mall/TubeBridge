package routes

import (
	"net/http"

	"github.com/Raj28Mall/TubeBridge/backend/db"
	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

var database *gorm.DB

func init() {
	db.Connect()
	database = db.GetDB()
}

func SetupRoutes(r *gin.Engine) {

	r.GET("/", welcome)

	r.GET("/favicon.ico", func(c *gin.Context) {
		c.Status(http.StatusNoContent)
	})

	teams := r.Group("/teams")
	{
		teams.GET("/", GetTeams)
		teams.GET("/:id", GetTeam)
		teams.POST("/", CreateTeam)
		teams.PUT("/:id", UpdateTeam)
		teams.DELETE("/:id", DeleteTeam)
	}

	users := r.Group("/users")
	{
		users.GET("/", GetUsers)
		users.POST("/", CreateUser)
		users.GET("/:id", GetUser)
		users.PUT("/:id", UpdateUser)
		users.DELETE("/:id", DeleteUser)
	}

	editors := r.Group("/editors")
	{
		editors.GET("/", GetEditors)
		editors.GET("/:id", GetEditor)
		editors.POST("/", CreateEditor)
		editors.PUT("/:id", UpdateEditor)
		editors.DELETE("/:id", DeleteEditor)
	}

	videos := r.Group("/videos")
	{
		videos.GET("/", GetVideos)
		videos.GET("/:id", GetVideo)
		videos.POST("/", CreateVideo)
		videos.PUT("/:id", UpdateVideo)
		videos.DELETE("/:id", DeleteVideo)
	}

}

func welcome(c *gin.Context) {
	c.JSON(http.StatusOK, gin.H{
		"message": "Welcome to TubeBridge API",
	})
}
