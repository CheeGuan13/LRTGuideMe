<?php
session_start();
include('db_connect.php'); //

$redirect_page = 'login.html'; // Redirect back to login page

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $username = trim($_POST["username"]);
    $password = trim($_POST["password"]);

    // 检查是否为空
    if (empty($username) || empty($password)) {
        header("Location: $redirect_page?error=all_fields_required");
        exit();
    }

    // 使用预处理语句防止 SQL 注入
    $sql = "SELECT * FROM users WHERE username = ?";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("s", $username);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows === 1) {
        $user = $result->fetch_assoc();

        // 验证密码
        if (password_verify($password, $user['password'])) {
            $_SESSION["user_id"] = $user["id"];
            $_SESSION["username"] = $user["username"];

            // 登录成功，重定向到首页 (通常成功时不需要弹窗)
            header("Location: index.html?status=login_success");

        } else {
            // 密码错误
            header("Location: $redirect_page?error=login_failed_password");
        }
    } else {
        // 用户名未找到
        header("Location: $redirect_page?error=login_failed_username");
    }

    $stmt->close();
    $conn->close();
    exit(); // 确保脚本在重定向后停止

} else {
    // 如果直接通过 GET 访问，重定向回去
    header("Location: $redirect_page");
    exit();
}
?>