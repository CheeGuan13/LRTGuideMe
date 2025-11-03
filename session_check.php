<?php
session_start();
require 'db_connect.php';
header('Content-Type: application/json');

// 检查登录状态
if (!isset($_SESSION["username"])) {
  echo json_encode([
    "logged_in" => false,
    "message" => "Not logged in"
  ]);
  exit;
}

$username = $_SESSION["username"];
$response = [
  "logged_in" => true,
  "username" => $username,
  "email" => null,
  "avatar" => "assets/images/user-icon.png" // 默认头像路径
];

// 查询数据库：邮箱 + 头像
$query = $conn->prepare("SELECT email, avatar FROM users WHERE username = ?");
$query->bind_param("s", $username);
$query->execute();
$result = $query->get_result();

if ($row = $result->fetch_assoc()) {
  $response["email"] = $row["email"];
  $response["avatar"] = !empty($row["avatar"]) ? $row["avatar"] : "assets/images/user-icon.png";
}

echo json_encode($response);

$query->close();
$conn->close();
?>
