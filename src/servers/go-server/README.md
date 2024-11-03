# Go Server Setup
## Prerequisites
### Windows Installation

Download Go installer (Latest version, e.g., go1.22.x) from [official Go website](https://go.dev/dl/)

Select the Windows MSI installer for your system (e.g., `go1.22.x.windows-amd64.msi`)


Run the MSI installer

Check the option to add Go to your PATH environment variable


Verify installation by opening Command Prompt and running:
```bash
go version
```

### macOS Installation

Install Homebrew if not already installed:
```bash
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
```
Install Go using Homebrew:
```bash
brew install go
```
Verify installation:
```bash
go version
```

## Setup Instructions
### 1. Install Dependencies
Go will automatically download and install dependencies listed in your `go.mod` file when you run the server. You can manually install them using:
```bash
go mod download
```
### 2. Run the Server
```bash
go run main.go
```
## Additional Notes

The server runs on port 5003. Please do not modify this port number as it's configured to work with other services.
Ensure no other service is using port 5003 before starting the server.
To stop the server, press Ctrl+C in the terminal.

## Troubleshooting

If you see permission errors, ensure you have the necessary rights to run the server on port 5003
If the port is already in use, check for other services that might be using port 5003