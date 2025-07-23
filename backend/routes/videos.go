package routes

import (
	"net/http"

	"github.com/Raj28Mall/TubeBridge/backend/models"
	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
)

func GetVideos(c *gin.Context) {
	var videos []models.Video
	teamID := c.Query("team_id")
	status := c.Query("status")

	query := database.Preload("Uploader")
	if teamID != "" {
		if _, err := uuid.Parse(teamID); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid team ID"})
			return
		}
		query = query.Where("team_id = ?", teamID)
	}
	if status != "" {
		query = query.Where("status = ?", status)
	}

	result := query.Find(&videos)
	if result.Error != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": result.Error.Error()})
		return
	}
	c.JSON(http.StatusOK, videos)
}

func CreateVideo(c *gin.Context) {
	var video models.Video
	if err := c.ShouldBindJSON(&video); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	result := database.Create(&video)
	if result.Error != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": result.Error.Error()})
		return
	}
	c.JSON(http.StatusCreated, video)
}

func GetVideo(c *gin.Context) {
	id := c.Param("id")
	videoID, err := uuid.Parse(id)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid video ID"})
		return
	}

	var video models.Video
	result := database.Preload("Uploader").Preload("Reviews").First(&video, videoID)
	if result.Error != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Video not found"})
		return
	}
	c.JSON(http.StatusOK, video)
}

func UpdateVideo(c *gin.Context) {
	id := c.Param("id")
	videoID, err := uuid.Parse(id)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid video ID"})
		return
	}

	var video models.Video
	if err := database.First(&video, videoID).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Video not found"})
		return
	}

	if err := c.ShouldBindJSON(&video); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if err := database.Save(&video).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, video)
}

func DeleteVideo(c *gin.Context) {
	id := c.Param("id")
	videoID, err := uuid.Parse(id)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid video ID"})
		return
	}

	result := database.Delete(&models.Video{}, videoID)
	if result.Error != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": result.Error.Error()})
		return
	}
	if result.RowsAffected == 0 {
		c.JSON(http.StatusNotFound, gin.H{"error": "Video not found"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "Video deleted successfully"})
}
