package handlers

import (
	"errors"
	"fmt"
	"log"
	"net/http"
	"strconv"
	"strings"

	"github.com/styczen/simple_todo/data"
)

type Tasks struct {
	l *log.Logger
}

func NewTasksHandler(l *log.Logger) *Tasks {
	return &Tasks{l: l}
}

func (t *Tasks) GetAndAddTask(rw http.ResponseWriter, r *http.Request) {
	t.l.Println("Handling all tasks GET or POST")

	if r.Method == http.MethodGet {
		t.l.Println("GET method")
		tasks, err := data.GetAllTasks()
		if err != nil {
			http.Error(rw, fmt.Sprintf("Cannot get all tasks. Reason: %v", err), http.StatusInternalServerError)
			return
		}
		if err := tasks.ToJSON(rw); err != nil {
			http.Error(rw, fmt.Sprintf("Cannot serializer all tasks. Reason: %v", err), http.StatusInternalServerError)
			return
		}
		return
	}

	if r.Method == http.MethodPost {
		t.l.Println("POST method")
		defer r.Body.Close()
		var task data.Task
		if err := task.FromJSON(r.Body); err != nil {
			http.Error(rw, fmt.Sprintf("Cannot deserializ new task. Reason: %v", err), http.StatusBadRequest)
			return
		}
		last_id, err := data.AddNewTask(task)
		if err != nil {
			http.Error(rw, fmt.Sprintf("Cannot add new task. Reason: %v", err), http.StatusBadRequest)
			return
		}
		t.l.Println("Last ID:", last_id)
		return
	}

	http.Error(rw, "Invalid HTTP request method", http.StatusBadRequest)
}

func (t *Tasks) HandleSingleTask(rw http.ResponseWriter, r *http.Request) {
	t.l.Println("Handling single task request")
	_, err := getRequestId(r.URL.Path)
	if err != nil {
		t.l.Println("Error occured while parsing ID. Error:", err)
		http.Error(rw, "Cannot parse requested ID", http.StatusBadRequest)
		return
	}

	if r.Method == http.MethodGet {
		t.l.Println("GET method")
		// TODO: Use data package to connect to DB and get data
		// task, err := t.getTask(id)
		// if err != nil {
		// 	http.Error(rw, err.Error(), http.StatusBadRequest)
		// 	return
		// }
		// if err := json.NewEncoder(rw).Encode(task); err != nil {
		// 	http.Error(rw, fmt.Sprintf("Cannot serialize task with ID: %v", id), http.StatusInternalServerError)
		// 	return
		// }
		return
	}

	if r.Method == http.MethodPut {
		t.l.Println("PUT method")
		// TODO: Use data package to connect with DB and update task

		// task, err := t.getTask(id)
		// if err != nil {
		// 	http.Error(rw, err.Error(), http.StatusBadRequest)
		// 	return
		// }
		// if err := json.NewDecoder(r.Body).Decode(task); err != nil {
		// 	http.Error(rw, fmt.Sprintf("Cannot deserialize task with ID: %v", id), http.StatusInternalServerError)
		// 	return
		// }
		return
	}

	if r.Method == http.MethodDelete {
		t.l.Println("DELETE method")
		// TODO: Use data package to connect with DB and delete task

		// if err := t.deleteTask(id); err != nil {
		// 	http.Error(rw, fmt.Sprintf("Cannot delete task with ID: %v", id), http.StatusBadRequest)
		// 	return
		// }
		return
	}

	http.Error(rw, "Invalid HTTP request method", http.StatusBadRequest)
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
