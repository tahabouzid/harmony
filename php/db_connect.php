<?php
$servername = "localhost";
$username = "harmony_user";
$password = "enissay2003";
$name = "harmony";

// Create connection
$conn = new mysqli($servername, $username, $password, $name);

// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

?>
