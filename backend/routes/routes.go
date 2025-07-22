package routes

import (
	"net/http"

	"github.com/Raj28Mall/TubeBridge/backend/db"
	"github.com/Raj28Mall/TubeBridge/backend/models"
	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
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
	// Team routes
	// teams := r.Group("/teams")
	// {
	// 	teams.GET("/", getTeams)
	// 	teams.POST("/", createTeam)
	// 	teams.GET("/:id", getTeam)
	// 	teams.PUT("/:id", updateTeam)
	// 	teams.DELETE("/:id", deleteTeam)
	// }

	// User routes
	// users := r.Group("/users")
	// {
	// 	users.GET("/", getUsers)
	// 	users.POST("/", createUser)
	// 	users.GET("/:id", getUser)
	// 	users.PUT("/:id", updateUser)
	// 	users.DELETE("/:id", deleteUser)
	// }

	// Video routes
	// videos := r.Group("/videos")
	// {
	// 	videos.GET("/", getVideos)
	// 	videos.POST("/", createVideo)
	// 	videos.GET("/:id", getVideo)
	// 	videos.PUT("/:id", updateVideo)
	// 	videos.DELETE("/:id", deleteVideo)
	// }

	// Legacy managers routes (keeping for compatibility)
	managers := r.Group("/managers")
	{
		managers.GET("/", getManagers)
		managers.GET("/:id", getManager)
		managers.POST("/", createManager)
		managers.PUT("/:id", updateManager)
		managers.DELETE("/:id", deleteManager)
	}
}

func welcome(c *gin.Context) {
	c.JSON(http.StatusOK, gin.H{
		"message": "Welcome to TubeBridge API",
	})
}

// ==================== TEAM HANDLERS ====================

// func getTeams(c *gin.Context) {
// 	var teams []models.Team
// 	result := database.Preload("Users").Find(&teams)
// 	if result.Error != nil {
// 		c.JSON(http.StatusInternalServerError, gin.H{"error": result.Error.Error()})
// 		return
// 	}
// 	c.JSON(http.StatusOK, teams)
// }

// func createTeam(c *gin.Context) {
// 	var team models.Team
// 	if err := c.ShouldBindJSON(&team); err != nil {
// 		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
// 		return
// 	}

// 	result := database.Create(&team)
// 	if result.Error != nil {
// 		c.JSON(http.StatusInternalServerError, gin.H{"error": result.Error.Error()})
// 		return
// 	}
// 	c.JSON(http.StatusCreated, team)
// }

// func getTeam(c *gin.Context) {
// 	id := c.Param("id")
// 	teamID, err := uuid.Parse(id)
// 	if err != nil {
// 		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid team ID"})
// 		return
// 	}

// 	var team models.Team
// 	result := database.Preload("Users").Preload("Videos").First(&team, teamID)
// 	if result.Error != nil {
// 		c.JSON(http.StatusNotFound, gin.H{"error": "Team not found"})
// 		return
// 	}
// 	c.JSON(http.StatusOK, team)
// }

// func updateTeam(c *gin.Context) {
// 	id := c.Param("id")
// 	teamID, err := uuid.Parse(id)
// 	if err != nil {
// 		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid team ID"})
// 		return
// 	}

// 	var team models.Team
// 	if err := database.First(&team, teamID).Error; err != nil {
// 		c.JSON(http.StatusNotFound, gin.H{"error": "Team not found"})
// 		return
// 	}

// 	if err := c.ShouldBindJSON(&team); err != nil {
// 		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
// 		return
// 	}

// 	if err := database.Save(&team).Error; err != nil {
// 		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
// 		return
// 	}
// 	c.JSON(http.StatusOK, team)
// }

// func deleteTeam(c *gin.Context) {
// 	id := c.Param("id")
// 	teamID, err := uuid.Parse(id)
// 	if err != nil {
// 		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid team ID"})
// 		return
// 	}

// 	result := database.Delete(&models.Team{}, teamID)
// 	if result.Error != nil {
// 		c.JSON(http.StatusInternalServerError, gin.H{"error": result.Error.Error()})
// 		return
// 	}
// 	if result.RowsAffected == 0 {
// 		c.JSON(http.StatusNotFound, gin.H{"error": "Team not found"})
// 		return
// 	}
// 	c.JSON(http.StatusOK, gin.H{"message": "Team deleted successfully"})
// }

// ==================== MANAGER HANDLERS ====================

// Get all managers (I think we are not filtering by role for now)
func getManagers(c *gin.Context) {
	var users []models.User
	teamID := c.Query("team_id")
	query := database
	if teamID != "" {
		if _, err := uuid.Parse(teamID); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid team ID"})
			return
		}
		query = query.Where("team_id = ?", teamID)
	} else {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Team ID is required"})
		return
	}

	result := query.Find(&users) //have to filter by role now
	if result.Error != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": result.Error.Error()})
		return
	}
	c.JSON(http.StatusOK, users)
}

func createManager(c *gin.Context) {
	var user models.User
	if err := c.ShouldBindJSON(&user); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	result := database.Create(&user)
	if result.Error != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": result.Error.Error()})
		return
	}
	c.JSON(http.StatusCreated, user)
}

func getManager(c *gin.Context) {
	id := c.Param("id")
	userID, err := uuid.Parse(id)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid user ID"})
		return
	}

	var user models.User
	result := database.Preload("UploadedVideos").First(&user, userID)
	if result.Error != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "User not found"})
		return
	}
	c.JSON(http.StatusOK, user)
}

func updateManager(c *gin.Context) {
	id := c.Param("id")
	userID, err := uuid.Parse(id)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid user ID"})
		return
	}

	var user models.User
	if err := database.First(&user, userID).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "User not found"})
		return
	}

	if err := c.ShouldBindJSON(&user); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if err := database.Save(&user).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, user)
}

// I think it is deleting the user itself when I just want to delete the manager role
func deleteManager(c *gin.Context) {
	id := c.Param("id")
	userID, err := uuid.Parse(id)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid user ID"})
		return
	}

	result := database.Delete(&models.User{}, userID)
	if result.Error != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": result.Error.Error()})
		return
	}
	if result.RowsAffected == 0 {
		c.JSON(http.StatusNotFound, gin.H{"error": "User not found"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "User deleted successfully"})
}

// ==================== VIDEO HANDLERS ====================

// func getVideos(c *gin.Context) {
// 	var videos []models.Video
// 	teamID := c.Query("team_id")
// 	status := c.Query("status")

// 	query := database.Preload("Uploader")
// 	if teamID != "" {
// 		if _, err := uuid.Parse(teamID); err != nil {
// 			c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid team ID"})
// 			return
// 		}
// 		query = query.Where("team_id = ?", teamID)
// 	}
// 	if status != "" {
// 		query = query.Where("status = ?", status)
// 	}

// 	result := query.Find(&videos)
// 	if result.Error != nil {
// 		c.JSON(http.StatusInternalServerError, gin.H{"error": result.Error.Error()})
// 		return
// 	}
// 	c.JSON(http.StatusOK, videos)
// }

// func createVideo(c *gin.Context) {
// 	var video models.Video
// 	if err := c.ShouldBindJSON(&video); err != nil {
// 		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
// 		return
// 	}

// 	result := database.Create(&video)
// 	if result.Error != nil {
// 		c.JSON(http.StatusInternalServerError, gin.H{"error": result.Error.Error()})
// 		return
// 	}
// 	c.JSON(http.StatusCreated, video)
// }

// func getVideo(c *gin.Context) {
// 	id := c.Param("id")
// 	videoID, err := uuid.Parse(id)
// 	if err != nil {
// 		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid video ID"})
// 		return
// 	}

// 	var video models.Video
// 	result := database.Preload("Uploader").Preload("Reviews").First(&video, videoID)
// 	if result.Error != nil {
// 		c.JSON(http.StatusNotFound, gin.H{"error": "Video not found"})
// 		return
// 	}
// 	c.JSON(http.StatusOK, video)
// }

// func updateVideo(c *gin.Context) {
// 	id := c.Param("id")
// 	videoID, err := uuid.Parse(id)
// 	if err != nil {
// 		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid video ID"})
// 		return
// 	}

// 	var video models.Video
// 	if err := database.First(&video, videoID).Error; err != nil {
// 		c.JSON(http.StatusNotFound, gin.H{"error": "Video not found"})
// 		return
// 	}

// 	if err := c.ShouldBindJSON(&video); err != nil {
// 		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
// 		return
// 	}

// 	if err := database.Save(&video).Error; err != nil {
// 		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
// 		return
// 	}
// 	c.JSON(http.StatusOK, video)
// }

// func deleteVideo(c *gin.Context) {
// 	id := c.Param("id")
// 	videoID, err := uuid.Parse(id)
// 	if err != nil {
// 		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid video ID"})
// 		return
// 	}

// 	result := database.Delete(&models.Video{}, videoID)
// 	if result.Error != nil {
// 		c.JSON(http.StatusInternalServerError, gin.H{"error": result.Error.Error()})
// 		return
// 	}
// 	if result.RowsAffected == 0 {
// 		c.JSON(http.StatusNotFound, gin.H{"error": "Video not found"})
// 		return
// 	}
// 	c.JSON(http.StatusOK, gin.H{"message": "Video deleted successfully"})
// }
