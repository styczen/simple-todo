package main

import (
	"context"
	"log"
	"net/http"
	"os"
	"os/signal"
	"strconv"

	"github.com/styczen/simple_todo/handlers"
)

var port int = 9090

func main() {
	l := log.New(os.Stdout, "simple-todo-api ", log.LstdFlags)

	l.Println("Starting TODO server in port", port)

	// Handler for TODO tasks
	th := handlers.NewTasksHandler(l)

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
