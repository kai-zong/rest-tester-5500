require 'sinatra'
require 'json'
require 'webrick'

set :server, :webrick
set :port, 5004
set :bind, '0.0.0.0'

# Configure CORS
configure do
  set :protection, :except => [:json_csrf]
  
  before do
    response.headers['Access-Control-Allow-Origin'] = '*'
    response.headers['Access-Control-Allow-Methods'] = 'GET, POST, PUT, DELETE, PATCH, OPTIONS'
    response.headers['Access-Control-Allow-Headers'] = 'Authorization, Content-Type, Accept, X-User-Email, X-Auth-Token'
  end

  options "*" do
    response.headers["Allow"] = "GET, POST, PUT, DELETE, PATCH, OPTIONS"
    response.headers["Access-Control-Allow-Headers"] = "Authorization, Content-Type, Accept, X-User-Email, X-Auth-Token"
    response.headers["Access-Control-Allow-Origin"] = "*"
    200
  end
end

before do
  content_type :json
end

# Rest of your existing code remains the same
$users = []
$next_id = 1

# Get all users
get '/users' do
  $users.to_json
end

# Get user by ID
get '/users/:id' do |id|
  user = $users.find { |u| u[:id] == id.to_i }
  if user
    user.to_json
  else
    status 404
    { error: "User not found" }.to_json
  end
end

# Delete all users
delete '/users' do
  $users = []
  $next_id = 1
  $users.to_json
end

# Add new user
post '/users' do
  request_body = JSON.parse(request.body.read, symbolize_names: true)
  name = request_body[:name]

  if !name || !name.is_a?(String) || name.strip.empty?
    status 400
    return { error: "Name is required and must be a non-empty string" }.to_json
  end

  new_user = {
    id: $next_id,
    name: name.strip,
    hoursWorked: 0
  }
  
  $users << new_user
  $next_id += 1
  
  status 201
  new_user.to_json
end

# Update user name
put '/users/:id' do |id|
  request_body = JSON.parse(request.body.read, symbolize_names: true)
  user = $users.find { |u| u[:id] == id.to_i }

  if user
    name = request_body[:name]
    if name && name.is_a?(String) && !name.strip.empty?
      user[:name] = name.strip
    end
    user.to_json
  else
    status 404
    { error: "User not found" }.to_json
  end
end

# Update user hours
patch '/users/:id' do |id|
  request_body = JSON.parse(request.body.read, symbolize_names: true)
  user = $users.find { |u| u[:id] == id.to_i }

  if user
    hours_to_add = request_body[:hoursToAdd]
    if hours_to_add.is_a?(Numeric)
      user[:hoursWorked] += hours_to_add
      user.to_json
    else
      status 400
      { error: "Invalid hoursToAdd value" }.to_json
    end
  else
    status 404
    { error: "User not found" }.to_json
  end
end

# Delete user by ID
delete '/users/:id' do |id|
  user_index = $users.find_index { |u| u[:id] == id.to_i }
  
  if user_index
    deleted_user = $users.delete_at(user_index)
    deleted_user.to_json
  else
    status 404
    { error: "User not found" }.to_json
  end
end