<?php
session_start();

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    require 'db_connect.php'; // Connect to the database

    

    // Retrieve username and password from form submission
    $username = $_POST['username'];
    $password = $_POST['password'];

    // Perform database query to check credentials
    $sql = "SELECT * FROM Users WHERE Username='$username' AND Password='$password'";
    $result = $conn->query($sql);
    $user = $result->fetch_assoc();
    $user_id = $user['UserID'];
    if ($result->num_rows > 0) {
        // Login successful
        echo "Login successful!";
        // Redirect or display success message
        $_SESSION['user_id'] = $user_id;

            header("Location: ../html/index.html"); // Redirect to home page
            exit;
    } else {
        // Login failed
        echo "Invalid username or password.";
        // Redirect or display error message
    }

    $conn->close(); // Close the database connection
}


?>

