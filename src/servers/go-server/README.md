# Go Server Setup
## Prerequisites
- Go 1.x (Latest stable version recommended)
- Download and install from official Go website
- Verify installation by running `go version` in your terminal
## Setup Instructions
### 1. Project Structure
Ensure you have the following files in your project directory:
```
.
├── main.go
└── go.mod
```
### 2. Install Dependencies
Go will automatically download and install dependencies listed in your `go.mod` file when you run the server. You can manually install them using:
```
go mod download
```
### 3. Run the Server
```
go run main.go
```
## Additional Notes
- The server runs on port 5003. Please do not modify this port number as it's configured to work with other services.
- Ensure no other service is using port 5003 before starting the server.
- To stop the server, press Ctrl+C in the terminal.
## Troubleshooting
- If you see permission errors, ensure you have the necessary rights to run the server on port 5003
- If the port is already in use, check for other services that might be using port 5003