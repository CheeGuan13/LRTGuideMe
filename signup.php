<?php
session_start();
include 'db_connect.php'; // 连接数据库

$redirect_page = 'signup.html'; // Redirect back to signup page

if ($_SERVER["REQUEST_METHOD"] === "POST") {
    $username = trim($_POST['username']);
    $email = trim($_POST['email']);
    $password = $_POST['password'];
    $confirm_password = $_POST['confirm_password'];

    // 检查是否为空
    if (empty($username) || empty($email) || empty($password) || empty($confirm_password)) {
        header("Location: $redirect_page?error=all_fields_required");
        exit();
    }

    // 检查两次密码是否一致
    if ($password !== $confirm_password) {
        header("Location: $redirect_page?error=passwords_do_not_match");
        exit();
    }

    // 检查密码长度
    if (strlen($password) < 6) {
        header("Location: $redirect_page?error=password_too_short");
        exit();
    }

    // 检查用户名或邮箱是否已存在
    $checkQuery = "SELECT * FROM users WHERE username = ? OR email = ?";
    $stmt = $conn->prepare($checkQuery);
    $stmt->bind_param("ss", $username, $email);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows > 0) {
        header("Location: $redirect_page?error=user_exists");
        $stmt->close();
        $conn->close();
        exit();
    }
    $stmt->close(); // 关闭检查语句

    // 加密密码
    $hashed_password = password_hash($password, PASSWORD_DEFAULT);

    // 插入数据库
    $insertQuery = "INSERT INTO users (username, email, password) VALUES (?, ?, ?)";
    $stmt_insert = $conn->prepare($insertQuery);
    $stmt_insert->bind_param("sss", $username, $email, $hashed_password);

    if ($stmt_insert->execute()) {
        // 成功后重定向到登录页，并带上成功消息的 key
        header("Location: login.html?status=signup_success");
    } else {
        header("Location: $redirect_page?error=signup_failed");
    }

    $stmt_insert->close();
    $conn->close();
    exit(); // 确保脚本在重定向后停止

} else {
    // 如果直接通过 GET 访问，重定向回去
    header("Location: $redirect_page");
    exit();
}
?>