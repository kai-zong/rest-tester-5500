# Ruby Server Setup

## Prerequisites

### Windows
1. Download and install Ruby+Devkit 3.3.5-1 (x64) from [RubyInstaller](https://rubyinstaller.org/downloads/)
   - During installation, check "Add Ruby executables to your PATH"
   - When the installer finishes, let it run the MSYS2 installation
   - In the MSYS2 prompt, press ENTER to install all default components

### macOS/Linux
1. Install Ruby using system package manager:
   
   **macOS:**
   ```bash
   brew install ruby
   ```
   
   **Ubuntu/Debian:**
   ```bash
   sudo apt-get update
   sudo apt-get install ruby-full
   ```

   **Fedora:**
   ```bash
   sudo dnf install ruby
   ```

## Verify Installation
Open a new terminal/command prompt and verify Ruby is installed:
```bash
ruby -v
```
You should see output indicating Ruby version 3.x.x

## Project Setup

### 1. Create Project Directory
```bash
mkdir ruby-server
cd ruby-server
```

### 3. Run the Server

#### Windows
```bash
ruby server.rb
```

#### macOS/Linux
```bash
ruby server.rb
```

The server will start on port 5004. You should see output indicating the server is running.

## Testing the Server
You can test if the server is running by opening a web browser and navigating to:
```
http://localhost:5004/users
```

## Additional Notes
- The server runs on port 5004. Please ensure this port is not in use by another application
- CORS is enabled for all origins to allow access from frontend applications
- To stop the server, press `Ctrl+C` in the terminal
- The server uses in-memory storage, so all data will be lost when the server is stopped

## Troubleshooting

### Common Issues

#### Port Already in Use
If you see an error about the port being in use:
1. Either choose a different port by modifying the `set :port` line in server.rb
2. Or find and stop the process using port 5004

#### Gem Installation Errors on Windows
If you encounter gem installation errors:
1. Make sure you installed Ruby+Devkit version, not just Ruby
2. Try running Command Prompt as Administrator

#### CORS Issues
If you're experiencing CORS issues when connecting from a frontend application:
1. Verify the server is running
2. Check that the CORS headers in server.rb match your needs
3. Ensure you're using the correct port (5004) in your frontend application

## API Endpoints

The server provides the following endpoints:
- `GET /users` - Get all users
- `GET /users/:id` - Get user by ID
- `POST /users` - Create a new user
- `PUT /users/:id` - Update user name
- `PATCH /users/:id` - Update user hours
- `DELETE /users/:id` - Delete a specific user
- `DELETE /users` - Delete all users
