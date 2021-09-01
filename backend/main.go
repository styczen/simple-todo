package main

import (
	"context"
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"os"
	"os/signal"
	"strconv"
	"strings"
	"time"
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
	}}
}

func (t *Tasks) getNewId() int {
	last_task := t.t[len(t.t) - 1]
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
		json.NewDecoder(r.Body).Decode(task)
		
		new_id := t.getNewId()
		task.ID = new_id
		t.t = append(t.t, task)
		return
	}
	
	http.Error(rw, "Invalid HTTP request method", http.StatusBadRequest)
}

func (t *Tasks) HandleSingleTask(rw http.ResponseWriter, r *http.Request) {
	t.l.Println("Handling single task request")
	
	if r.Method == http.MethodGet {
		t.l.Println("GET method")
		parts := strings.Split(r.URL.Path, "/")
		if len(parts) != 3 {
			http.Error(rw, "Invalid number of parsed elements", http.StatusBadRequest)
			return
		}
		id_str := parts[len(parts) - 1]
		id, err := strconv.Atoi(id_str)
		if err != nil {
			http.Error(rw, "Cannot parse ID from URL to number", http.StatusBadRequest)
			return
		}
		task, err := t.getTask(id)
		if err != nil {
			http.Error(rw, err.Error(), http.StatusBadRequest)
			return
		}
		json.NewEncoder(rw).Encode(task)
		return
	}
	
	if r.Method == http.MethodPut {
		t.l.Println("PUT method")
		// TODO: Implement
		return
	}

	if r.Method == http.MethodDelete {
		t.l.Println("DELETE method")
		// TODO: Implement
		return
	}

	http.Error(rw, "Invalid HTTP request method", http.StatusBadRequest)
}

func main() {
	l := log.New(os.Stdout, "simple-todo-api ", log.LstdFlags)
	l.Println("Starting TODO server")

	// Handler for TODO tasks
	th := NewTasksHandler(l)

	// Request paths multiplexer
	mux := http.NewServeMux()

	mux.HandleFunc("/tasks", th.GetAndAddTask)
	mux.HandleFunc("/tasks/", th.HandleSingleTask)

	srv := &http.Server{
		Addr:     ":9090",
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
