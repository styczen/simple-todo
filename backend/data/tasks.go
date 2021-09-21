package data

import (
	"database/sql"
	"time"
)

// Task represents data about one task user provided
type Task struct {
	ID          int       `json:"id"`
	Description string    `json:"description"`
	DueDate     time.Time `json:"due_date"`
}

var db *sql.DB

func NewData