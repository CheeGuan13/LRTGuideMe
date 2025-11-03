<?php
session_start();
include 'db_connect.php';

header('Content-Type: application/json');

if (!isset($_SESSION['username'])) {
  echo json_encode(["success" => false, "message" => "Not logged in"]);
  exit;
}

$currentUser = $_SESSION['username'];

// 获取前端传入的新资料
$newUsername = trim($_POST['username'] ?? '');
$newEmail = trim($_POST['email'] ?? '');
$newPassword = trim($_POST['password'] ?? '');

if (empty($newUsername) || empty($newEmail)) {
  echo json_encode(["success" => false, "message" => "Username and email cannot be empty."]);
  exit;
}

// === 处理头像上传 ===
$avatarPath = null;

if (isset($_FILES['avatar']) && $_FILES['avatar']['error'] === UPLOAD_ERR_OK) {
  $uploadDir = "uploads/";
  if (!is_dir($uploadDir)) mkdir($uploadDir, 0777, true);

  $fileTmp = $_FILES['avatar']['tmp_name'];
  $fileName = uniqid("avatar_") . "_" . basename($_FILES['avatar']['name']);
  $targetFile = $uploadDir . $fileName;

  // 限制类型 (安全)
  $allowed = ['jpg', 'jpeg', 'png', 'gif', 'webp'];
  $ext = strtolower(pathinfo($targetFile, PATHINFO_EXTENSION));
  if (!in_array($ext, $allowed)) {
    echo json_encode(["success" => false, "message" => "Invalid image type."]);
    exit;
  }

  if (move_uploaded_file($fileTmp, $targetFile)) {
    $avatarPath = $targetFile;
  } else {
    echo json_encode(["success" => false, "message" => "Failed to upload avatar."]);
    exit;
  }
}

// === 根据是否修改密码/头像决定 SQL ===
if (!empty($newPassword) && $avatarPath) {
  $hashedPassword = password_hash($newPassword, PASSWORD_DEFAULT);
  $sql = "UPDATE users SET username=?, email=?, password=?, avatar=? WHERE username=?";
  $stmt = $conn->prepare($sql);
  $stmt->bind_param("sssss", $newUsername, $newEmail, $hashedPassword, $avatarPath, $currentUser);
} elseif (!empty($newPassword)) {
  $hashedPassword = password_hash($newPassword, PASSWORD_DEFAULT);
  $sql = "UPDATE users SET username=?, email=?, password=? WHERE username=?";
  $stmt = $conn->prepare($sql);
  $stmt->bind_param("ssss", $newUsername, $newEmail, $hashedPassword, $currentUser);
} elseif ($avatarPath) {
  $sql = "UPDATE users SET username=?, email=?, avatar=? WHERE username=?";
  $stmt = $conn->prepare($sql);
  $stmt->bind_param("ssss", $newUsername, $newEmail, $avatarPath, $currentUser);
} else {
  $sql = "UPDATE users SET username=?, email=? WHERE username=?";
  $stmt = $conn->prepare($sql);
  $stmt->bind_param("sss", $newUsername, $newEmail, $currentUser);
}

$success = $stmt->execute();

if ($success) {
  $_SESSION['username'] = $newUsername;
  echo json_encode(["success" => true]);
} else {
  echo json_encode(["success" => false, "message" => "Database update failed."]);
}

$stmt->close();
$conn->close();
?>
