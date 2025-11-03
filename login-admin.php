<?php
session_start();
include('db_connect.php');

if ($_SERVER["REQUEST_METHOD"] === "POST") {
  $username = $_POST["username"];
  $password = $_POST["password"];

  $stmt = $conn->prepare("SELECT * FROM admin WHERE username = ?");
  $stmt->bind_param("s", $username);
  $stmt->execute();
  $result = $stmt->get_result();

  if ($result->num_rows === 1) {
    $admin = $result->fetch_assoc();
    if (password_verify($password, $admin["password"])) {
      $_SESSION["admin_username"] = $admin["username"];
      header("Location: admin_dashboard.html?status=login_success");
      exit;
    } else {
      header("Location: login-admin.html?error=invalid_password");
      exit;
    }
  } else {
    header("Location: login-admin.html?error=admin_not_found");
    exit;
  }
}
?>
