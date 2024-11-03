<?php

// Enable CORS
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, PATCH, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

// Handle preflight (OPTIONS) request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

session_start();

// Initialize session storage for users and next_id
if (!isset($_SESSION['users'])) $_SESSION['users'] = [];
if (!isset($_SESSION['next_id'])) $_SESSION['next_id'] = 1;

// Helper function to send JSON responses
function send_response($data, $status = 200) {
    http_response_code($status);
    echo json_encode($data);
    exit();
}

// Get the current request URI path
$request_uri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);

// Debugging function to log data
function log_debug($message) {
    error_log($message);
}

// Check if session data is being initialized correctly
log_debug("Current session data at start: " . json_encode($_SESSION));

// Get all users
if ($_SERVER['REQUEST_METHOD'] === 'GET' && $request_uri === '/users') {
    log_debug("GET /users - Retrieving all users");
    send_response($_SESSION['users']);
}

// Get a user by ID
if ($_SERVER['REQUEST_METHOD'] === 'GET' && preg_match('/\/users\/(\d+)/', $request_uri, $matches)) {
    $user_id = (int)$matches[1];
    log_debug("GET /users/$user_id - Fetching user by ID");
    $user = current(array_filter($_SESSION['users'], fn($u) => $u['id'] === $user_id));
    if ($user) send_response($user);
    send_response("User not found", 404);
}

// Add a new user
if ($_SERVER['REQUEST_METHOD'] === 'POST' && $request_uri === '/users') {
    $input = json_decode(file_get_contents('php://input'), true);
    log_debug("POST /users - Adding a new user: " . json_encode($input));
    if (!isset($input['name']) || !is_string($input['name']) || !trim($input['name'])) {
        send_response("Name is required and must be a non-empty string", 400);
    }
    $new_user = ['id' => $_SESSION['next_id']++, 'name' => trim($input['name']), 'hoursWorked' => 0];
    $_SESSION['users'][] = $new_user;
    log_debug("POST /users - User added: " . json_encode($new_user));
    log_debug("Session data after adding user: " . json_encode($_SESSION['users']));
    send_response($new_user, 201);
}

// Delete all users
if ($_SERVER['REQUEST_METHOD'] === 'DELETE' && $request_uri === '/users') {
    log_debug("DELETE /users - Deleting all users");
    $_SESSION['users'] = [];
    $_SESSION['next_id'] = 1;
    log_debug("Session data after deleting all users: " . json_encode($_SESSION['users']));
    send_response([]);
}

// Update a user by ID
if ($_SERVER['REQUEST_METHOD'] === 'PUT' && preg_match('/\/users\/(\d+)/', $request_uri, $matches)) {
    $user_id = (int)$matches[1];
    $user_index = array_search($user_id, array_column($_SESSION['users'], 'id'));
    log_debug("PUT /users/$user_id - Attempting to update user with ID $user_id");

    if ($user_index !== false) {
        $input = json_decode(file_get_contents('php://input'), true);
        log_debug("PUT /users/$user_id - Received payload: " . json_encode($input));
        
        if (isset($input['name']) && is_string($input['name']) && trim($input['name'])) {
            $_SESSION['users'][$user_index]['name'] = trim($input['name']);
            log_debug("PUT /users/$user_id - User updated: " . json_encode($_SESSION['users'][$user_index]));
            log_debug("Session data after updating user: " . json_encode($_SESSION['users']));
            send_response($_SESSION['users'][$user_index]);
        } else {
            send_response("Invalid name provided", 400);
        }
    }
    send_response("User not found", 404);
}

// Update hours worked by user ID
if ($_SERVER['REQUEST_METHOD'] === 'PATCH' && preg_match('/\/users\/(\d+)/', $request_uri, $matches)) {
    $user_id = (int)$matches[1];
    $user_index = array_search($user_id, array_column($_SESSION['users'], 'id'));
    log_debug("PATCH /users/$user_id - Attempting to update hours for user ID $user_id");

    if ($user_index !== false) {
        $input = json_decode(file_get_contents('php://input'), true);
        log_debug("PATCH /users/$user_id - Received payload: " . json_encode($input));
        
        if (isset($input['hoursToAdd']) && is_numeric($input['hoursToAdd'])) {
            $_SESSION['users'][$user_index]['hoursWorked'] += $input['hoursToAdd'];
            log_debug("PATCH /users/$user_id - Hours updated: " . json_encode($_SESSION['users'][$user_index]));
            log_debug("Session data after updating hours: " . json_encode($_SESSION['users']));
            send_response($_SESSION['users'][$user_index]);
        } else {
            send_response("Invalid hoursToAdd value", 400);
        }
    }
    send_response("User not found", 404);
}

// Delete a user by ID
if ($_SERVER['REQUEST_METHOD'] === 'DELETE' && preg_match('/\/users\/(\d+)/', $request_uri, $matches)) {
    $user_id = (int)$matches[1];
    $user_index = array_search($user_id, array_column($_SESSION['users'], 'id'));
    log_debug("DELETE /users/$user_id - Attempting to delete user with ID $user_id");

    if ($user_index !== false) {
        $deleted_user = array_splice($_SESSION['users'], $user_index, 1);
        log_debug("DELETE /users/$user_id - User deleted: " . json_encode($deleted_user[0]));
        log_debug("Session data after deleting user: " . json_encode($_SESSION['users']));
        send_response($deleted_user[0]);
    }
    send_response("User not found", 404);
}

?>
