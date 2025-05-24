<?php
/**
 * Database Configuration File
 * Contains connection parameters for the MySQL/MariaDB database
 * Used by all database-dependent PHP scripts in the Python Practice application
 */

// Database connection parameters for Hostinger
$db_host = 'localhost'; // Usually 'localhost' for shared hosting
$db_name = 'u486120778_zenalys'; // Your database name
$db_user = 'u486120778_sanprat'; // Your database username
$db_pass = 'LetsLearn@2025'; // Your database password

// Enable logging for debugging
error_log("DB Config loaded. Host: $db_host, DB: $db_name, User: $db_user");

// Create a function to get PDO connection
function getPDOConnection() {
    global $db_host, $db_name, $db_user, $db_pass;
    
    try {
        $pdo = new PDO("mysql:host=$db_host;dbname=$db_name;charset=utf8mb4", $db_user, $db_pass);
        $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        return $pdo;
    } catch (PDOException $e) {
        error_log("DB Connection Error: " . $e->getMessage());
        return false;
    }
}

// Prevent direct access to this file
if (basename($_SERVER['PHP_SELF']) == basename(__FILE__)) {
    header('HTTP/1.0 403 Forbidden');
    exit('Access forbidden');
}
?>
