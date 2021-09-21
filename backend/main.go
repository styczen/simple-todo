package main

import (
	"context"
	"database/sql"
	"encoding/json"
	"errors"
	"fmt"
	"log"
	"net/http"
	"os"
	"os/signal"
	"strconv"
	"strings"
	"time"

	"github.com/go-sql-driver/mysql"
)

// Task represents data about one task user provided
type Task struct {
	ID          int       `json:"id"`
	Description string    `json:"description"`
	DueDate     time.Time `json:"due_date"`
}

type Tasks struct {
	l *log.Logger
	t []*Task
}

var ErrTaskNotFound = fmt.Errorf("Task not found")

func NewTasksHandler(l *log.Logger) *Tasks {
	return &Tasks{l: l, t: []*Task{
		&Task{ID: 1, Description: "Read a book", DueDate: time.Now()},
		&Task{ID: 2, Description: "Do one Duolingo", DueDate: time.Now().AddDate(0, 0, 2)},
		&Task{ID: 3, Description: "Ride a bike"},
	}}
}

func (t *Tasks) getNewId() int {
	last_task := t.t[len(t.t)-1]
	return last_task.ID + 1
}

func (t *Tasks) getTask(id int) (*Task, error) {
	for _, task := range t.t {
		if task.ID == id {
			return task, nil
		}
	}
	return nil, ErrTaskNotFound
}

func getRequestId(path string) (int, error) {
	parts := strings.Split(path, "/")
	if len(parts) != 3 {
		return -1, errors.New("invalid number of parsed elements")
	}
	id_str := parts[len(parts)-1]
	id, err := strconv.Atoi(id_str)
	if err != nil {
		return -1, errors.New("cannot parse ID from URL to number")
	}
	if id < 0 {
		return -1, errors.New("requested ID cannot be negative")
	}
	return id, nil
}

func (t *Tasks) deleteTask(id int) error {
	id_to_delete := -1
	for i, task := range t.t {
		if task.ID == id {
			id_to_delete = i
			break
		}
	}
	if id_to_delete == -1 {
		return fmt.Errorf("ID %v was not found", id)
	}
	t.t = append(t.t[:id_to_delete], t.t[id_to_delete+1:]...)
	return nil
}

func (t *Tasks) GetAndAddTask(rw http.ResponseWriter, r *http.Request) {
	t.l.Println("Handling all tasks GET or POST")

	if r.Method == http.MethodGet {
		t.l.Println("GET method")
		json.NewEncoder(rw).Encode(t.t)
		return
	}

	if r.Method == http.MethodPost {
		t.l.Println("POST method")
		defer r.Body.Close()
		task := &Task{}
		if err := json.NewDecoder(r.Body).Decode(task); err != nil {
			http.Error(rw, err.Error(), http.StatusBadRequest)
			return
		}
		task.ID = t.getNewId()
		t.t = append(t.t, task)
		return
	}

	http.Error(rw, "Invalid HTTP request method", http.StatusBadRequest)
}

func (t *Tasks) HandleSingleTask(rw http.ResponseWriter, r *http.Request) {
	t.l.Println("Handling single task request")
	id, err := getRequestId(r.URL.Path)
	if err != nil {
		t.l.Println("Error occured while parsing ID. Error:", err)
		http.Error(rw, "Cannot parse requested ID", http.StatusBadRequest)
		return
	}

	if r.Method == http.MethodGet {
		t.l.Println("GET method")
		task, err := t.getTask(id)
		if err != nil {
			http.Error(rw, err.Error(), http.StatusBadRequest)
			return
		}
		if err := json.NewEncoder(rw).Encode(task); err != nil {
			http.Error(rw, fmt.Sprintf("Cannot serialize task with ID: %v", id), http.StatusInternalServerError)
			return
		}

		return
	}

	if r.Method == http.MethodPut {
		t.l.Println("PUT method")
		task, err := t.getTask(id)
		if err != nil {
			http.Error(rw, err.Error(), http.StatusBadRequest)
			return
		}
		if err := json.NewDecoder(r.Body).Decode(task); err != nil {
			http.Error(rw, fmt.Sprintf("Cannot deserialize task with ID: %v", id), http.StatusInternalServerError)
			return
		}
		return
	}

	if r.Method == http.MethodDelete {
		t.l.Println("DELETE method")
		if err := t.deleteTask(id); err != nil {
			http.Error(rw, fmt.Sprintf("Cannot delete task with ID: %v", id), http.StatusBadRequest)
			return
		}
		return
	}

	http.Error(rw, "Invalid HTTP request method", http.StatusBadRequest)
}

var db *sql.DB
var port int = 9090

func main() {
	l := log.New(os.Stdout, "simple-todo-api ", log.LstdFlags)
	
	l.Println("Starting TODO server in port", port)
	// Capture connection properties
	// TODO: This probably needs some updating but not now
	cfg := mysql.Config{
		User:   os.Getenv("DBUSER"),
		Passwd: os.Getenv("DBPASS"),
		Net:    "tcp",
		Addr:   "127.0.0.1:3306",
		DBName: "simple_todo",
		AllowNativePasswords: true,
	}
	// Get a database handle
	var err error
	db, err = sql.Open("mysql", cfg.FormatDSN())
	if err != nil {
		l.Fatal(err)
	}
	defer db.Close()
	
	pingErr := db.Ping()
	if pingErr != nil {
		l.Fatal("Ping: ", pingErr)
	}


	// Handler for TODO tasks
	th := NewTasksHandler(l)

	// Request paths multiplexer
	mux := http.NewServeMux()

	mux.HandleFunc("/tasks", th.GetAndAddTask)
	mux.HandleFunc("/tasks/", th.HandleSingleTask)

	srv := &http.Server{
		Addr:     ":" + strconv.Itoa(port),
		Handler:  mux,
		ErrorLog: l,
		// TODO Read about timeouts
	}

	idleConnsClosed := make(chan struct{})
	go func() {
		sigint := make(chan os.Signal, 1)
		signal.Notify(sigint, os.Interrupt)
		<-sigint

		// We received an interrupt signal, shut down
		if err := srv.Shutdown(context.Background()); err != nil {
			// Error from closing listeners, or context timeout
			l.Println("HTTP server shutdown:", err)
		}
		close(idleConnsClosed)
	}()

	if err := srv.ListenAndServe(); err != http.ErrServerClosed {
		// Error starting or closing listener
		l.Fatalln("HTTP server ListenAndServe:", err)
	}
}
