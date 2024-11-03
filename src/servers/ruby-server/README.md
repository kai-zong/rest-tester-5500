# Ruby Server Setup

## Prerequisites

### Windows
1. Download and install Ruby+Devkit 3.3.5-1 (x64) from [RubyInstaller](https://rubyinstaller.org/downloads/)
   - During installation, check "Add Ruby executables to your PATH"
   - When the installer finishes, let it run the MSYS2 installation
   - In the MSYS2 prompt, press ENTER to install all default components

### macOS Setup
1. Install Homebrew if you haven't already:
```bash
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
```

2. Install Ruby through Homebrew:
```bash
brew install ruby
```

3. Add Ruby to your PATH by adding these lines to your `~/.zshrc`:
```bash
echo 'export PATH="/opt/homebrew/opt/ruby/bin:$PATH"' >> ~/.zshrc
echo 'export PATH="/opt/homebrew/lib/ruby/gems/3.3.0/bin:$PATH"' >> ~/.zshrc
echo 'export LDFLAGS="-L/opt/homebrew/opt/ruby/lib"' >> ~/.zshrc
echo 'export CPPFLAGS="-I/opt/homebrew/opt/ruby/include"' >> ~/.zshrc
```

4. Load the new configuration:
```bash
source ~/.zshrc
```

5. Verify the correct Ruby version is installed:
```bash
ruby -v    # Should show Ruby 3.3.x
which ruby # Should show /opt/homebrew/opt/ruby/bin/ruby
```

### 1. Install Required Gems
```bash
gem install sinatra
gem install json
gem install webrick
gem install rackup
```


### 2. Run the Server

#### Windows/macOS/Linux
```bash
ruby server.rb
```

The server will start on port 5004. You should see output indicating the server is running.

## Additional Notes
- The server runs on port 5004. Please ensure this port is not in use by another application
- CORS is enabled for all origins to allow access from frontend applications
- To stop the server, press `Ctrl+C` in the terminal
- The server uses in-memory storage, so all data will be lost when the server is stopped

## Troubleshooting

### Common Issues

#### macOS Specific Issues
1. If `ruby -v` shows version 2.6.x, you're using the system Ruby instead of Homebrew's Ruby
   - Make sure you've added all the PATH exports to ~/.zshrc
   - Open a new terminal window
   - Run `which ruby` to verify it points to the Homebrew path

2. If gem installation fails:
   - Verify you're using Homebrew's Ruby with `which ruby`
   - Make sure all PATH and compiler flags are set correctly

#### Port Already in Use
If you see an error about the port being in use:
1. Either choose a different port by modifying the `set :port` line in server.rb
2. Or find and stop the process using port 5004

#### Windows-Specific Issues
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
