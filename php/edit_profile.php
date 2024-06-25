<?php
session_start();

if (!isset($_SESSION['user_id'])) {
    header('Location: ../html/login.html');
    exit;
}

require 'db_connect.php';

$user_id = $_SESSION['user_id'];
$sql = "SELECT * FROM Users WHERE UserID = ?";
$stmt = $conn->prepare($sql);
$stmt->bind_param("i", $user_id);
$stmt->execute();
$result = $stmt->get_result();
$user = $result->fetch_assoc();

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    $new_username = $_POST['username'];
    $new_email = $_POST['email'];
    $new_preferences = $_POST['preferences'];

    $sql = "UPDATE Users SET Username = ?, Email = ?, Preferences = ? WHERE UserID = ?";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("sssi", $new_username, $new_email, $new_preferences, $user_id);
    $stmt->execute();

    header('Location: profile.php');
    exit;
}

$conn->close();
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Edit Profile</title>
    <link rel="stylesheet" href="../css/profile.css">
</head>
<body>
    <h1>Edit Profile</h1>
    <form action="edit_profile.php" method="POST">
        <label for="username">Username:</label>
        <input type="text" name="username" value="<?php echo htmlspecialchars($user['Username']); ?>" required>
        <br>
        <label for="email">Email:</label>
        <input type="email" name="email" value="<?php echo htmlspecialchars($user['Email']); ?>" required>
        <br>
        <label for="preferences">Preferences:</label>
        <textarea name="preferences"><?php echo htmlspecialchars($user['Preferences']); ?></textarea>
        <br>
        <input type="submit" value="Save Changes">
    </form>
    <a href="profile.php">Back to Profile</a>
</body>
</html>
