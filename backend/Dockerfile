FROM mysql
FROM golang

# Setup code
WORKDIR /app
COPY . ./
RUN go mod download
RUN go build -o /simple_todo_app
