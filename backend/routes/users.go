package routes

import (
	"net/http"

	"github.com/Raj28Mall/TubeBridge/backend/models"
	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
	"gorm.io/gorm" // Import gorm for database access
)

// GetUsers retrieves all users, optionally filtered by TeamID.
func GetUsers(c *gin.Context) {
	var users []models.User
	teamIDStr := c.Query("team_id") // Allow filtering by team_id

	query := database.Preload("SentInvitations").Preload("UploadedVideos").Preload("Reviews").Preload("Activities")

	if teamIDStr != "" {
		teamID, err := uuid.Parse(teamIDStr)
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid team ID format"})
			return
		}
		query = query.Where("team_id = ?", teamID)
	}

	result := query.Find(&users)
	if result.Error != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": result.Error.Error()})
		return
	}
	c.JSON(http.StatusOK, users)
}

// CreateUser creates a new user.
func CreateUser(c *gin.Context) {
	var user models.User
	if err := c.ShouldBindJSON(&user); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Basic validation for required fields if not handled by GORM tags directly
	if user.Email == "" || user.Name == "" || user.TeamID == uuid.Nil || user.Role == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Email, Name, TeamID, and Role are required"})
		return
	}

	result := database.Create(&user)
	if result.Error != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": result.Error.Error()})
		return
	}
	c.JSON(http.StatusCreated, user)
}

// GetUser retrieves a single user by ID.
func GetUser(c *gin.Context) {
	id := c.Param("id")
	userID, err := uuid.Parse(id)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid user ID"})
		return
	}

	var user models.User
	result := database.Preload("SentInvitations").Preload("UploadedVideos").Preload("Reviews").Preload("Activities").First(&user, userID)
	if result.Error != nil {
		if result.Error == gorm.ErrRecordNotFound {
			c.JSON(http.StatusNotFound, gin.H{"error": "User not found"})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{"error": result.Error.Error()})
		return
	}
	c.JSON(http.StatusOK, user)
}

// UpdateUser updates an existing user by ID.
func UpdateUser(c *gin.Context) {
	id := c.Param("id")
	userID, err := uuid.Parse(id)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid user ID"})
		return
	}

	var user models.User
	if err := database.First(&user, userID).Error; err != nil {
		if err == gorm.ErrRecordNotFound {
			c.JSON(http.StatusNotFound, gin.H{"error": "User not found"})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	// Bind only the fields that are allowed to be updated.
	// For security, avoid directly binding the entire `user` struct if sensitive fields exist.
	// For simplicity, this example binds the whole struct, but in production,
	// you might use a separate DTO for updates or manually assign fields.
	var updatedUser models.User
	if err := c.ShouldBindJSON(&updatedUser); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Only update specific fields allowed to be changed by the API consumer.
	// For example, you might not want to allow changing TeamID or ID via this endpoint.
	user.Name = updatedUser.Name
	user.Email = updatedUser.Email
	user.Role = updatedUser.Role
	user.YoutubeOAuthToken = updatedUser.YoutubeOAuthToken
	user.YoutubeRefreshToken = updatedUser.YoutubeRefreshToken
	// Do not update CreatedAt or ID

	if err := database.Save(&user).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, user)
}

// DeleteUser deletes a user by ID.
func DeleteUser(c *gin.Context) {
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
