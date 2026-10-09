<?php
// Login.php - User authentication functionality for Python Practice PWA
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
        error_log("Attempting database connection to: $host, $dbname");
        
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

// Process login request
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Get and sanitize user input
    $input = json_decode(file_get_contents('php://input'), true);
    
    if (!$input) {
        $input = $_POST; // Fallback to standard POST data
    }
    
    error_log("Login attempt with user: " . (isset($input['username']) ? $input['username'] : 'undefined'));
    
    // Validate required fields
    if (!isset($input['username']) || !isset($input['password'])) {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'Missing required fields']);
        exit;
    }
    
    $username = trim($input['username']);
    $password = $input['password'];
    
    // For test user, bypass database authentication
    if ($username === 'testuser' && $password === 'testing') {
        // Set session variables
        $_SESSION['user_id'] = 999;
        $_SESSION['username'] = 'testuser';
        $_SESSION['email'] = 'testuser@example.com';
        $_SESSION['logged_in'] = true;
        
        // Return success response
        echo json_encode([
            'success' => true,
            'message' => 'Login successful',
            'user_id' => 999,
            'username' => 'testuser'
        ]);
        exit;
    }
    
    // Connect to database for normal users
    try {
        $pdo = getDbConnection();
        
        // Find user by username or email
        $stmt = $pdo->prepare('SELECT id, username, email, password_hash FROM users WHERE username = ? OR email = ? LIMIT 1');
        $stmt->execute([$username, $username]); // Allow login with either username or email
        
        if ($stmt->rowCount() === 0) {
            http_response_code(401); // Unauthorized
            echo json_encode(['success' => false, 'message' => 'Invalid username or password']);
            exit;
        }
        
        $user = $stmt->fetch(PDO::FETCH_ASSOC);
        
        // Verify password
        if (password_verify($password, $user['password_hash'])) {
            // Update last login timestamp
            $updateStmt = $pdo->prepare('UPDATE users SET last_login = CURRENT_TIMESTAMP WHERE id = ?');
            $updateStmt->execute([$user['id']]);
            
            // Set session variables
            $_SESSION['user_id'] = $user['id'];
            $_SESSION['username'] = $user['username'];
            $_SESSION['email'] = $user['email'];
            $_SESSION['logged_in'] = true;
            
            // Return success response
            echo json_encode([
                'success' => true,
                'message' => 'Login successful',
                'user_id' => $user['id'],
                'username' => $user['username']
            ]);
        } else {
            http_response_code(401); // Unauthorized
            echo json_encode(['success' => false, 'message' => 'Invalid username or password']);
        }
    } catch (PDOException $e) {
        error_log("Login database error: " . $e->getMessage());
        http_response_code(500);
        echo json_encode(['success' => false, 'message' => 'Database error', 'error' => $e->getMessage()]);
    } catch (Exception $e) {
        error_log("General exception in login: " . $e->getMessage());
        http_response_code(500);
        echo json_encode(['success' => false, 'message' => 'Server error', 'error' => 'Internal server error']);
    }
} else if ($_SERVER['REQUEST_METHOD'] === 'GET' && isset($_GET['action']) && $_GET['action'] === 'check') {
    // Check if user is logged in
    if (isset($_SESSION['logged_in']) && $_SESSION['logged_in'] === true) {
        echo json_encode([
            'success' => true,
            'logged_in' => true,
            'user_id' => $_SESSION['user_id'],
            'username' => $_SESSION['username']
        ]);
    } else {
        echo json_encode([
            'success' => true,
            'logged_in' => false
        ]);
    }
} else if ($_SERVER['REQUEST_METHOD'] === 'GET' && isset($_GET['action']) && $_GET['action'] === 'logout') {
    // Logout functionality
    session_unset();
    session_destroy();
    echo json_encode([
        'success' => true,
        'message' => 'Logged out successfully'
    ]);
} else {
    http_response_code(405); // Method Not Allowed
    echo json_encode(['success' => false, 'message' => 'Method not allowed']);
}
?>
