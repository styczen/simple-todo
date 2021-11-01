FROM golang

# Setup backend code
WORKDIR /app
COPY . ./
RUN go mod download
RUN go build -o /simple_todo_app

# Setup database 

ENTRYPOINT "/simple_todo_app"
