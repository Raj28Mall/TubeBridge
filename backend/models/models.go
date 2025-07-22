package models

import (
	"time"

	"github.com/google/uuid"
	"github.com/lib/pq" // For handling PostgreSQL array types like TEXT[]
	"gorm.io/datatypes" // For handling JSONB
)

// --- ENUM Type Definitions ---
// By defining these as custom types, we can ensure type safety in our Go code.

type UserRole string

const (
	RoleAdmin  UserRole = "admin"
	RoleEditor UserRole = "editor"
)

type InvitationStatus string

const (
	InvitePending  InvitationStatus = "pending"
	InviteAccepted InvitationStatus = "accepted"
)

type VideoStatus string

const (
	VideoDraft         VideoStatus = "draft"
	VideoPendingReview VideoStatus = "pending_review"
	VideoApproved      VideoStatus = "approved"
	VideoRejected      VideoStatus = "rejected"
	VideoPublished     VideoStatus = "published"
)

type ReviewDecision string

const (
	ReviewApproved ReviewDecision = "approved"
	ReviewRejected ReviewDecision = "rejected"
)

type ActivityActionType string

const (
	ActionTeamCreated    ActivityActionType = "team.created"
	ActionUserInvited    ActivityActionType = "user.invited"
	ActionUserJoined     ActivityActionType = "user.joined"
	ActionUserRemoved    ActivityActionType = "user.removed"
	ActionVideoCreated   ActivityActionType = "video.created"
	ActionVideoSubmitted ActivityActionType = "video.submitted"
	ActionVideoEdited    ActivityActionType = "video.edited"
	ActionVideoApproved  ActivityActionType = "video.approved"
	ActionVideoRejected  ActivityActionType = "video.rejected"
	ActionVideoPublished ActivityActionType = "video.published"
)

// --- Model Struct Definitions ---

// Team represents a workspace, owned by a single user (the admin).
type Team struct {
	ID        uuid.UUID `gorm:"type:uuid;primary_key;default:gen_random_uuid()"`
	OwnerID   uuid.UUID `gorm:"type:uuid;not null"`
	Name      string    `gorm:"type:varchar(255);not null"`
	CreatedAt time.Time `gorm:"not null;default:now()"`
	UpdatedAt time.Time `gorm:"not null;default:now()"`

	// --- Associations ---
	// A Team has many Users.
	Users []User `gorm:"foreignKey:TeamID"`
	// A Team has many Invitations.
	Invitations []Invitation `gorm:"foreignKey:TeamID"`
	// A Team has many Videos.
	Videos []Video `gorm:"foreignKey:TeamID"`
	// A Team has many ActivityLogs.
	ActivityLogs []ActivityLog `gorm:"foreignKey:TeamID"`
}

// User represents an admin or editor within a team.
type User struct {
	ID                  uuid.UUID `gorm:"type:uuid;primary_key;default:gen_random_uuid()"`
	TeamID              uuid.UUID `gorm:"type:uuid;not null;index:idx_users_team_id"`
	Email               string    `gorm:"type:varchar(255);not null;unique"`
	Name                string    `gorm:"type:varchar(255);not null"`
	Role                UserRole  `gorm:"type:user_role;not null"`
	YoutubeOAuthToken   string    `gorm:"type:text"`
	YoutubeRefreshToken string    `gorm:"type:text"`
	CreatedAt           time.Time `gorm:"not null;default:now()"`
	UpdatedAt           time.Time `gorm:"not null;default:now()"`

	// --- Associations ---
	// A User can send many invitations.
	SentInvitations []Invitation `gorm:"foreignKey:InviterID"`
	// A User can upload many videos.
	UploadedVideos []Video `gorm:"foreignKey:UploaderID"`
	// A User can perform many reviews.
	Reviews []Review `gorm:"foreignKey:ReviewerID"`
	// A User can be the actor in many activity logs.
	Activities []ActivityLog `gorm:"foreignKey:ActorID"`
}

// Invitation tracks invites sent to new editors.
type Invitation struct {
	ID           uuid.UUID        `gorm:"type:uuid;primary_key;default:gen_random_uuid()"`
	TeamID       uuid.UUID        `gorm:"type:uuid;not null;uniqueIndex:uq_team_invitee"` // Part of composite unique key
	InviterID    uuid.UUID        `gorm:"type:uuid;not null"`
	InviteeEmail string           `gorm:"type:varchar(255);not null;uniqueIndex:uq_team_invitee"` // Part of composite unique key
	Token        string           `gorm:"type:text;not null;unique"`
	Status       InvitationStatus `gorm:"type:invitation_status;not null;default:'pending'"`
	ExpiresAt    time.Time        `gorm:"not null;default:now() + interval '3 days'"`
	CreatedAt    time.Time        `gorm:"not null;default:now()"`

	// --- Associations ---
	// An Invitation belongs to one Team.
	Team Team `gorm:"foreignKey:TeamID"`
	// An Invitation is sent by one User.
	Inviter User `gorm:"foreignKey:InviterID"`
}

// Video is the core model for video uploads and their metadata.
type Video struct {
	ID                 uuid.UUID      `gorm:"type:uuid;primary_key;default:gen_random_uuid()"`
	TeamID             uuid.UUID      `gorm:"type:uuid;not null;index:idx_videos_team_id"`
	UploaderID         uuid.UUID      `gorm:"type:uuid;index:idx_videos_uploader_id"` // Nullable on user deletion
	Title              string         `gorm:"type:varchar(255);not null"`
	Description        string         `gorm:"type:text"`
	Tags               pq.StringArray `gorm:"type:text[]"` // Specific to PostgreSQL
	ThumbnailURL       string         `gorm:"type:text"`
	VideoFileURL       string         `gorm:"type:text"`
	Status             VideoStatus    `gorm:"type:video_status;not null;default:'draft';index:idx_videos_status"`
	ScheduledPublishAt *time.Time     // Pointer to allow NULL values
	YoutubeVideoID     string         `gorm:"type:varchar(255)"`
	CreatedAt          time.Time      `gorm:"not null;default:now()"`
	UpdatedAt          time.Time      `gorm:"not null;default:now()"`

	// --- Associations ---
	// A Video belongs to one Team.
	Team Team `gorm:"foreignKey:TeamID"`
	// A Video is uploaded by one User.
	Uploader User `gorm:"foreignKey:UploaderID;constraint:OnDelete:SET NULL"`
	// A Video can have many Reviews.
	Reviews []Review `gorm:"foreignKey:VideoID"`
}

// Review logs an admin's decision on a video submission.
type Review struct {
	ID              uuid.UUID      `gorm:"type:uuid;primary_key;default:gen_random_uuid()"`
	VideoID         uuid.UUID      `gorm:"type:uuid;not null;index:idx_reviews_video_id"`
	ReviewerID      uuid.UUID      `gorm:"type:uuid;not null;index:idx_reviews_reviewer_id"`
	Decision        ReviewDecision `gorm:"type:review_decision;not null"`
	FeedbackMessage string         `gorm:"type:text"`
	CreatedAt       time.Time      `gorm:"not null;default:now()"`

	// --- Associations ---
	// A Review belongs to one Video.
	Video Video `gorm:"foreignKey:VideoID"`
	// A Review is performed by one User.
	Reviewer User `gorm:"foreignKey:ReviewerID"`
}

// ActivityLog tracks significant actions performed by users.
type ActivityLog struct {
	ID         uuid.UUID          `gorm:"type:uuid;primary_key;default:gen_random_uuid()"`
	TeamID     uuid.UUID          `gorm:"type:uuid;not null;index:idx_activity_logs_team_id"`
	ActorID    uuid.UUID          `gorm:"type:uuid;not null;index:idx_activity_logs_actor_id"`
	ActionType ActivityActionType `gorm:"type:activity_action_type;not null"`
	TargetID   uuid.UUID          `gorm:"type:uuid;not null;index:idx_activity_logs_target,priority:1"`         // For polymorphic association
	TargetType string             `gorm:"type:varchar(255);not null;index:idx_activity_logs_target,priority:2"` // E.g., 'videos', 'users'
	Details    datatypes.JSON     `gorm:"type:jsonb"`                                                           // Stores extra context
	CreatedAt  time.Time          `gorm:"not null;default:now()"`

	// --- Associations ---
	// An ActivityLog belongs to one Team.
	Team Team `gorm:"foreignKey:TeamID"`
	// An ActivityLog is performed by one User (the Actor).
	Actor User `gorm:"foreignKey:ActorID"`

	// Note: The "Target" is a polymorphic association. It can point to a Video, User, etc.
	// This is typically handled in your application logic by checking TargetType and querying
	// the appropriate table with TargetID, rather than a direct GORM association struct field.
}
