package main

import (
    "encoding/json"
    "fmt"
    "net/http"
    "strconv"
    "sync"
)

type User struct {
    ID          int     `json:"id"`
    Name        string  `json:"name"`
    HoursWorked float64 `json:"hoursWorked"`
}

var (
    users   []User
    nextID  int = 1
    usersMu sync.Mutex
)

func main() {
    http.HandleFunc("/users", corsMiddleware(usersHandler))
    http.HandleFunc("/users/", corsMiddleware(userHandler))
    fmt.Println("Server running on port 5003")
    http.ListenAndServe(":5003", nil)
}

// CORS middleware function
func corsMiddleware(next http.HandlerFunc) http.HandlerFunc {
    return func(w http.ResponseWriter, r *http.Request) {
        w.Header().Set("Access-Control-Allow-Origin", "*")
        w.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, DELETE, OPTIONS")
        w.Header().Set("Access-Control-Allow-Headers", "Content-Type")

        // Handle preflight request
        if r.Method == http.MethodOptions {
            w.WriteHeader(http.StatusOK)
            return
        }

        next.ServeHTTP(w, r)
    }
}

func usersHandler(w http.ResponseWriter, r *http.Request) {
    usersMu.Lock()
    defer usersMu.Unlock()

    switch r.Method {
    case http.MethodGet:
        json.NewEncoder(w).Encode(users)

    case http.MethodPost:
        var newUser User
        if err := json.NewDecoder(r.Body).Decode(&newUser); err != nil || newUser.Name == "" {
            http.Error(w, "Invalid input", http.StatusBadRequest)
            return
        }
        newUser.ID = nextID
        nextID++
        newUser.HoursWorked = 0
        users = append(users, newUser)
        w.WriteHeader(http.StatusCreated)
        json.NewEncoder(w).Encode(newUser)

    case http.MethodDelete:
        users = []User{}
        nextID = 1
        w.WriteHeader(http.StatusOK)
        json.NewEncoder(w).Encode(users)

    default:
        http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
    }
}

func userHandler(w http.ResponseWriter, r *http.Request) {
    id, err := strconv.Atoi(r.URL.Path[len("/users/"):])
    if err != nil {
        http.Error(w, "Invalid user ID", http.StatusBadRequest)
        return
    }

    usersMu.Lock()
    defer usersMu.Unlock()

    var user *User
    for i := range users {
        if users[i].ID == id {
            user = &users[i]
            break
        }
    }

    if user == nil {
        http.Error(w, "User not found", http.StatusNotFound)
        return
    }

    switch r.Method {
    case http.MethodGet:
        json.NewEncoder(w).Encode(user)

    case http.MethodPut:
        var updateData map[string]interface{}
        if err := json.NewDecoder(r.Body).Decode(&updateData); err != nil {
            http.Error(w, "Invalid input", http.StatusBadRequest)
            return
        }
        if name, ok := updateData["name"].(string); ok && name != "" {
            user.Name = name
        }
        json.NewEncoder(w).Encode(user)

    case http.MethodPatch:
        var updateData map[string]interface{}
        if err := json.NewDecoder(r.Body).Decode(&updateData); err != nil {
            http.Error(w, "Invalid input", http.StatusBadRequest)
            return
        }
        if hoursToAdd, ok := updateData["hoursToAdd"].(float64); ok {
            user.HoursWorked += hoursToAdd
            json.NewEncoder(w).Encode(user)
        } else {
            http.Error(w, "Invalid hoursToAdd value", http.StatusBadRequest)
        }

    case http.MethodDelete:
        users = append(users[:id-1], users[id:]...)
        w.WriteHeader(http.StatusOK)
        json.NewEncoder(w).Encode(user)

    default:
        http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
    }
}
