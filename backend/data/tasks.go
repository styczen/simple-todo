package data

import (
	"database/sql"
	"encoding/json"
	"fmt"
	"io"
	"os"
	"time"

	"github.com/go-sql-driver/mysql"
)

// Task represents data about one task user provided
type Task struct {
	ID          int       `json:"id"`
	Description string    `json:"description"`
	DueDate     time.Time `json:"due_date"`
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

func GetAllTasks() (*Tasks, error) {
	db, err := setupDb()
	if err != nil {
		return nil, err
	}
	rows, err := db.Query("SELECT * FROM tasks")
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var tasks Tasks
	for rows.Next() {
		var task Task
		if err := rows.Scan(&task.ID, &task.Description, &task.DueDate); err != nil {
			return nil, err
		}
		tasks = append(tasks, &task)
	}
	return &tasks, nil
}

func AddNewTask(task *Task) (int64, error) {
	db, err := setupDb()
	if err != nil {
		return -1, err
	}
	result, err := db.Exec("INSERT tasks(description, due_date) VALUES (?, ?)", task.Description, task.DueDate)
	if err != nil {
		return -1, err
	}
	last_id, err := result.LastInsertId()
	if err != nil {
		return -1, err
	}
	return last_id, nil
}

func GetTask(id int) (*Task, error) {
	db, err := setupDb()
	if err != nil {
		return nil, err
	}
	var task Task
	row := db.QueryRow("SELECT * FROM tasks WHERE id = ?", id)
	if err := row.Scan(&task.ID, &task.Description, &task.DueDate); err != nil {
		return nil, err
	}
	return &task, nil
}

func DeleteTask(id int) error {
	db, err := setupDb()
	if err != nil {
		return err
	}
	_, err = db.Exec("DELETE FROM tasks WHERE id = ?", id)
	if err != nil {
		return err
	}
	return nil
}

func DeleteAllTasks() error {
	db, err := setupDb()
	if err != nil {
		return err
	}
	_, err = db.Exec("DELETE FROM tasks")
	if err != nil {
		return err
	}
	return nil
}

func UpdateTask(task *Task, id int) error {
	db, err := setupDb()
	if err != nil {
		return err
	}
	_, err = db.Exec("UPDATE tasks SET description = ?, due_date = ? WHERE id = ?", task.Description, task.DueDate, id)
	return err
}

func setupDb() (*sql.DB, error) {
	cfg := mysql.Config{
		User:                 os.Getenv("DBUSER"),
		Passwd:               os.Getenv("DBPASS"),
		Net:                  "tcp",
		Addr:                 "127.0.0.1:3306",
		DBName:               "simple_todo",
		AllowNativePasswords: true,
		ParseTime:            true,
	}
	// Get a database handle
	db, err := sql.Open("mysql", cfg.FormatDSN())
	if err != nil {
		return nil, err
	}
	pingErr := db.Ping()
	if pingErr != nil {
		return nil, pingErr
	}
	return db, nil
}

// func (t *Tasks) deleteTask(id int) error {
// 	id_to_delete := -1
// 	for i, task := range t.t {
// 		if task.ID == id {
// 			id_to_delete = i
// 			break
// 		}
// 	}
// 	if id_to_delete == -1 {
// 		return fmt.Errorf("ID %v was not found", id)
// 	}
// 	t.t = append(t.t[:id_to_delete], t.t[id_to_delete+1:]...)
// 	return nil
// }

// func NewData
