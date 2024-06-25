<?php
session_start();

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    require 'db_connect.php'; // Connect to the database
    

    // Retrieve user input from form submission
    $username = $_POST['username'];
    $email = $_POST['email'];
    $password = $_POST['password'];
      // Function to check password strength
      function isPasswordStrong($password) {
        if (strlen($password) < 8) {
            return false;
        }
        if (!preg_match('/[A-Z]/', $password)) {
            return false;
        }
        if (!preg_match('/[a-z]/', $password)) {
            return false;
        }
        if (!preg_match('/[0-9]/', $password)) {
            return false;
        }
        if (!preg_match('/[\W]/', $password)) {
            return false;
        }
        return true;
    }

    // Check if the password is strong enough
    if (!isPasswordStrong($password)) {
        echo "Password is not strong enough. It must be at least 8 characters long, contain uppercase and lowercase letters, a number, and a special character.";
        exit;
    }

    // Hash the password before storing
    $hashedPassword = password_hash($password, PASSWORD_DEFAULT);

    // Insert the new user into the database 
    $sql = "INSERT INTO Users (Username, Email, Password) VALUES ('$username', '$email', '$password')";
    if(filter_var($email, FILTER_VALIDATE_EMAIL)){
        // Check if the email already exists
    $stmt = $conn->prepare("SELECT * FROM Users WHERE Email = ?");
    $stmt->bind_param("s", $email);
    $stmt->execute();
    $result = $stmt->get_result();

     // Check if the username already exists
     $stmt = $conn->prepare("SELECT * FROM Users WHERE Username = ?");
     $stmt->bind_param("s", $username);
     $stmt->execute();
     $result_username = $stmt->get_result();
 

    if ($result->num_rows > 0) {
        echo "Email is already taken. Please choose another one.";
    }elseif ($result_username->num_rows > 0) {
        echo "Username is already taken. Please choose another one.";}
         else {

    

    if ($conn->query($sql) === TRUE) {
        echo "Registration successful!";
        // Redirect or display success message
    } else {
        echo "Error: " . $sql . "<br>" . $conn->error;
    }

    $conn->close(); // Close the database connection
}
}
}

?>