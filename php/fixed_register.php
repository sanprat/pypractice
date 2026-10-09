<?php
// Register.php - User registration functionality for Python Practice PWA
header('Content-Type: application/json');

// Ensure PHP errors don't output as HTML - force JSON for all errors
set_error_handler(function($errno, $errstr, $errfile, $errline) {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Server error', 'error' => $errstr]);
    exit;
});

// Start session to manage user's logged-in state
session_start();

// Try to load configuration file if it exists
$configFile = __DIR__ . '/db_config.php';

// Check if configuration file exists and load it
if (file_exists($configFile)) {
    include $configFile;
    // Map the variables from db_config.php to the ones used in this file
    $host = $db_host;
    $dbname = $db_name;
    $username = $db_user;
    $password = $db_pass;
} else {
    // No hardcoded fallback: read from environment (getenv) or fail loudly.
    // Secrets must never live in source control.
    $host = getenv('DB_HOST') ?: 'localhost';
    $dbname = getenv('DB_NAME') ?: '';
    $username = getenv('DB_USER') ?: '';
    $password = getenv('DB_PASS') ?: '';
    if ($dbname === '' || $username === '' || $password === '') {
        die(json_encode(['error' => 'Database configuration missing. Set DB_HOST/DB_NAME/DB_USER/DB_PASS environment variables.']));
    }
}

// Database connection
function getDbConnection() {
    global $host, $dbname, $username, $password;
    
    try {
        error_log("Attempting database connection to: $host, $dbname, $username");
        
        // Try to connect with provided credentials
        try {
            $pdo = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8mb4", $username, $password);
            $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
            return $pdo;
        } catch (PDOException $e) {
            // If the hostname is incorrect, try with an alternative hostname
            if (strpos($e->getMessage(), 'getaddrinfo') !== false) {
                // Try with IP address instead of hostname
                $alternativeHost = '127.0.0.1';
                error_log("Retrying connection with IP: $alternativeHost");
                
                $pdo = new PDO("mysql:host=$alternativeHost;dbname=$dbname;charset=utf8mb4", $username, $password);
                $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
                return $pdo;
            } else {
                throw $e; // Re-throw if it's not a hostname resolution issue
            }
        }
    } catch (PDOException $e) {
        error_log("Database connection error: " . $e->getMessage());
        http_response_code(500);
        echo json_encode(['success' => false, 'message' => 'Database connection error', 'error' => $e->getMessage()]);
        exit;
    }
}

// Helper function to validate email format
function isValidEmail($email) {
    return filter_var($email, FILTER_VALIDATE_EMAIL);
}

// Process registration request
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Get and sanitize user input
    $input = json_decode(file_get_contents('php://input'), true);
    
    if (!$input) {
        $input = $_POST; // Fallback to standard POST data
    }
    
    error_log("Registration attempt with user: " . (isset($input['username']) ? $input['username'] : 'undefined'));
    
    // Validate required fields
    if (!isset($input['username']) || !isset($input['email']) || !isset($input['password'])) {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'Missing required fields']);
        exit;
    }
    
    $username = trim($input['username']);
    $email = trim($input['email']);
    $password = $input['password'];
    
    // Basic validation
    if (strlen($username) < 3 || strlen($username) > 50) {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'Username must be between 3 and 50 characters']);
        exit;
    }
    
    if (!isValidEmail($email)) {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'Invalid email format']);
        exit;
    }
    
    if (strlen($password) < 6) {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'Password must be at least 6 characters']);
        exit;
    }
    
    // Hash the password
    $password_hash = password_hash($password, PASSWORD_DEFAULT);
    
    try {
        // Connect to database
        $pdo = getDbConnection();
        
        // Check if username or email already exists
        $stmt = $pdo->prepare('SELECT id FROM users WHERE username = ? OR email = ? LIMIT 1');
        $stmt->execute([$username, $email]);
        
        if ($stmt->rowCount() > 0) {
            $row = $stmt->fetch(PDO::FETCH_ASSOC);
            http_response_code(409); // Conflict
            echo json_encode(['success' => false, 'message' => 'Username or email already exists']);
            exit;
        }
        
        // Insert new user
        $stmt = $pdo->prepare('INSERT INTO users (username, email, password_hash) VALUES (?, ?, ?)');
        $result = $stmt->execute([$username, $email, $password_hash]);
        
        if ($result) {
            $userId = $pdo->lastInsertId();
            http_response_code(200); // Explicitly set 200 OK status
            echo json_encode([
                'success' => true, 
                'message' => 'Registration successful', 
                'user_id' => $userId,
                'username' => $username
            ]);
        } else {
            http_response_code(500);
            echo json_encode(['success' => false, 'message' => 'Registration failed']);
        }
    } catch (PDOException $e) {
        error_log("Registration database error: " . $e->getMessage());
        http_response_code(500);
        echo json_encode(['success' => false, 'message' => 'Database error', 'error' => $e->getMessage()]);
        exit;
    } catch (Exception $e) {
        error_log("General exception in registration: " . $e->getMessage());
        http_response_code(500);
        echo json_encode(['success' => false, 'message' => 'Server error', 'error' => 'Internal server error']);
        exit;
    }
} else {
    http_response_code(405); // Method Not Allowed
    echo json_encode(['success' => false, 'message' => 'Method not allowed']);
}
?>
