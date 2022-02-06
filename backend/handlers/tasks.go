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
	l   *log.Logger
	tDb *data.TasksDb
}

func NewTasksHandler(tDb *data.TasksDb, l *log.Logger) *Tasks {
	return &Tasks{tDb: tDb, l: l}
}

func (t *Tasks) HandleAllTasks(rw http.ResponseWriter, r *http.Request) {
	t.l.Println("Handling all tasks GET or POST")

	if r.Method == http.MethodGet {
		t.l.Println("All GET method")
		tasks, err := t.tDb.GetAllTasks()
		if err != nil {
			http.Error(rw, fmt.Sprintf("Cannot get all tasks. Reason: %v", err), http.StatusInternalServerError)
			return
		}
		if len(*tasks) == 0 {
			t.l.Print("There are no tasks")
			rw.WriteHeader(http.StatusOK)
			fmt.Fprintln(rw, "There are not tasks")
			return
		}

		if err := data.ToJSON(tasks, rw); err != nil {
			http.Error(rw, fmt.Sprintf("Cannot serializer all tasks. Reason: %v", err), http.StatusInternalServerError)
			return
		}
		return
	}

	if r.Method == http.MethodPost {
		t.l.Println("All POST method")
		defer r.Body.Close()
		var task data.Task
		if err := data.FromJSON(task, r.Body); err != nil {
			http.Error(rw, fmt.Sprintf("Cannot deserialize new task. Reason: %v", err), http.StatusBadRequest)
			return
		}
		last_id, err := t.tDb.AddNewTask(&task)
		if err != nil {
			http.Error(rw, fmt.Sprintf("Cannot add new task. Reason: %v", err), http.StatusBadRequest)
			return
		}
		t.l.Println("Last ID:", last_id)
		task.ID = last_id
		rw.WriteHeader(http.StatusCreated)
		// What happens when there is some problem when serializing to JSON?
		// There will be status 201 (created) but bad JSON...
		if err := data.ToJSON(task, rw); err != nil {
			http.Error(rw, fmt.Sprintf(
				"Cannot serialize new task. Reason: %v. But it should not happen :-)", err),
				http.StatusBadRequest)
			return
		}
		return
	}

	if r.Method == http.MethodDelete {
		t.l.Println("All DELETE method")
		if err := t.tDb.DeleteAllTasks(); err != nil {
			http.Error(rw, fmt.Sprintf("Cannot remove all tasks. Reason: %v", err), http.StatusInternalServerError)
			return
		}
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
		task, err := t.tDb.GetTask(id)
		if err != nil {
			error_msg := fmt.Sprint("Cannot get task with ID: ", id, ". Error: ", err)
			t.l.Println(error_msg)
			rw.WriteHeader(http.StatusNotFound)
			fmt.Fprintln(rw, error_msg)
			return
		}

		if err := data.ToJSON(task, rw); err != nil {
			error_msg := fmt.Sprint("Cannot serialize task with ID: ", id, ". Error: ", err)
			t.l.Println(error_msg)
			http.Error(rw, error_msg, http.StatusBadRequest)
			return
		}

		return
	}

	if r.Method == http.MethodPut {
		t.l.Println("PUT method")
		var updated_task data.Task
		defer r.Body.Close()
		if err := data.FromJSON(updated_task, r.Body); err != nil {
			http.Error(rw, fmt.Sprintf("Cannot deserialize new task. Reason: %v", err), http.StatusBadRequest)
			return
		}
		if err := t.tDb.UpdateTask(&updated_task, id); err != nil {
			http.Error(rw, fmt.Sprint("Cannot update task with ID; ", id, ". Reason: ", err), http.StatusBadRequest)
			return
		}
		return
	}

	if r.Method == http.MethodDelete {
		t.l.Println("DELETE method")
		if err := t.tDb.DeleteTask(id); err != nil {
			error_msg := fmt.Sprint("Cannot delete task with ID: ", id, ". Error: ", err)
			t.l.Println(error_msg)
			http.Error(rw, error_msg, http.StatusBadRequest)
			return
		}
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
