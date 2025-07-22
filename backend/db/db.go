package db

import (
	"fmt"
	"log"

	"github.com/Raj28Mall/TubeBridge/backend/config"
	"github.com/Raj28Mall/TubeBridge/backend/models"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

var DB *gorm.DB

func Connect() {
	cfg := config.Load()

	dsn := fmt.Sprintf("host=%s user=%s password=%s dbname=%s port=%s sslmode=disable",
		cfg.DB_HOST, cfg.DB_USER, cfg.DB_PASSWORD, cfg.DB_NAME, cfg.DB_PORT)

	db, err := gorm.Open(postgres.Open(dsn), &gorm.Config{})
	if err != nil {
		log.Fatal("Failed to connect to database:", err)
	}

	DB = db
	postgresDB, err := db.DB()
	if err != nil {
		log.Fatal("Failed to get database instance:", err)
	}

	if err := postgresDB.Ping(); err != nil {
		log.Fatal("Failed to ping database:", err)
	}
	log.Println("Database connected successfully")

	createEnumTypes(db)
	// Auto-migrate the models
	err = db.AutoMigrate(
		&models.Team{},
		&models.User{},
		&models.Invitation{},
		&models.Video{},
		&models.Review{},
		&models.ActivityLog{},
	)
	if err != nil {
		log.Fatal("Failed to migrate database:", err)
	}
	log.Println("Database migration completed successfully")
}

func createEnumTypes(db *gorm.DB) {
	enumDefinitions := map[string]string{
		"user_role":            "('admin', 'editor')",
		"invitation_status":    "('pending', 'accepted')",
		"video_status":         "('draft', 'pending_review', 'approved', 'rejected', 'published')",
		"review_decision":      "('approved', 'rejected')",
		"activity_action_type": "('team.created', 'user.invited', 'user.joined', 'user.removed', 'video.created', 'video.submitted', 'video.edited', 'video.approved', 'video.rejected', 'video.published')",
	}

	for typeName, typeValues := range enumDefinitions {
		query := fmt.Sprintf(`
            DO $$
            BEGIN
                IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = '%s') THEN
                    CREATE TYPE %s AS ENUM %s;
                END IF;
            END$$;
        `, typeName, typeName, typeValues)

		if err := db.Exec(query).Error; err != nil {
			log.Fatalf("Failed to create enum type '%s': %v", typeName, err)
		}
	}

	log.Println("Finished ensuring ENUM types exist.")
}

func GetDB() *gorm.DB {
	return DB
}
