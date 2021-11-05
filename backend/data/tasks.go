package data

import (
	"database/sql"
	"encoding/json"
	"fmt"
	"io"
	"log"
	"os"
	"time"

	"github.com/go-sql-driver/mysql"
)

type TasksDb struct {
	db *sql.DB
	l  *log.Logger
}

func NewTasksDb(l *log.Logger) *TasksDb {
	db, err := setupDb(l)
	if err != nil {
		l.Fatal(err)
		return nil
	}
	return &TasksDb{db: db, l: l}
}

func (tDb *TasksDb) CloseDbConn() {
	if err := tDb.db.Close(); err != nil {
		tDb.l.Print(err)
	}
	tDb.l.Print("Closed database connection successfully")
}

// Task represents data about one task user provided
type Task struct {
	ID          int       `json:"id"`
	Description string    `json:"description"`
	DueDate     time.Time `json:"due_date"`
	Completed   bool      `json:"completed"`
}

func (t *Task) ToJSON(w io.Writer) error {
	encoder := json.NewEncoder(w)
	return encoder.Encode(t)
}

func (t *Task) FromJSON(r io.Reader) error {
	decoder := json.NewDecoder(r)
	return decoder.Decode(t)
}

type Tasks []*Task

func (t *Tasks) ToJSON(w io.Writer) error {
	encoder := json.NewEncoder(w)
	return encoder.Encode(t)
}

var ErrTaskNotFound = fmt.Errorf("Task not found")

func (tDb *TasksDb) GetAllTasks() (*Tasks, error) {
	rows, err := tDb.db.Query("SELECT * FROM tasks")
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var tasks Tasks
	for rows.Next() {
		var task Task
		if err := rows.Scan(&task.ID, &task.Description, &task.DueDate, &task.Completed); err != nil {
			return nil, err
		}
		tasks = append(tasks, &task)
	}
	return &tasks, nil
}

func (tDb *TasksDb) AddNewTask(task *Task) (int, error) {
	result, err := tDb.db.Exec("INSERT tasks(description, due_date) VALUES (?, ?)", task.Description, task.DueDate)
	if err != nil {
		return -1, err
	}
	last_id, err := result.LastInsertId()
	if err != nil {
		return -1, err
	}
	return int(last_id), nil
}

func (tDb *TasksDb) GetTask(id int) (*Task, error) {
	var task Task
	row := tDb.db.QueryRow("SELECT * FROM tasks WHERE id = ?", id)
	if err := row.Scan(&task.ID, &task.Description, &task.DueDate, &task.Completed); err != nil {
		return nil, err
	}
	return &task, nil
}

func (tDb *TasksDb) DeleteTask(id int) error {
	_, err := tDb.db.Exec("DELETE FROM tasks WHERE id = ?", id)
	if err != nil {
		return err
	}
	return nil
}

func (tDb *TasksDb) DeleteAllTasks() error {
	_, err := tDb.db.Exec("DELETE FROM tasks")
	if err != nil {
		return err
	}
	return nil
}

func (tDb *TasksDb) UpdateTask(task *Task, id int) error {
	_, err := tDb.db.Exec(
		"UPDATE tasks SET description = ?, due_date = ?, completed = ? WHERE id = ?",
		task.Description, task.DueDate, task.Completed, id)
	return err
}

func setupDb(l *log.Logger) (*sql.DB, error) {
	cfg := mysql.Config{
		User:                 os.Getenv("DBUSER"),
		Passwd:               os.Getenv("DBPASS"),
		Net:                  "tcp",
		Addr:                 "db:3306",
		DBName:               "simple_todo",
		AllowNativePasswords: true,
		ParseTime:            true,
	}
	// Get a database handle
	ticker := time.NewTicker(1 * time.Second)
	defer ticker.Stop()

	timeout := 30 * time.Second
	timeoutExceeded := time.After(timeout)
	for {
		select {
		case <-timeoutExceeded:
			return nil, fmt.Errorf("cannot connect to database after %s seconds", timeout)
		case <-ticker.C:
			db, err := sql.Open("mysql", cfg.FormatDSN())
			if err == nil {
				err := db.Ping()
				if err == nil {
					return db, nil
				}
				l.Println("Cannot ping to server with error:", err)
				continue
			}
			l.Println("Failed to connect to server with error:", err, "Trying again...")
		}
	}
}
