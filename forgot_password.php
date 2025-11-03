<?php
include 'db_connect.php'; //

$redirect_page = 'forgot_password.html'; // Redirect back to forgot password page

if ($_SERVER["REQUEST_METHOD"] === "POST") {
    $username = trim($_POST['username']);
    $email = trim($_POST['email']);
    $password = $_POST['password'];
    $confirm_password = $_POST['confirm_password'];

    // 1. 检查字段是否为空
    if (empty($username) || empty($email) || empty($password) || empty($confirm_password)) {
        header("Location: $redirect_page?error=all_fields_required");
        exit();
    }

    // 2. 检查新密码是否匹配
    if ($password !== $confirm_password) {
        header("Location: $redirect_page?error=passwords_do_not_match");
        exit();
    }

    // 3. 检查密码长度
    if (strlen($password) < 6) {
        header("Location: $redirect_page?error=password_too_short");
        exit();
    }

    // 4. 核心逻辑：检查用户名
    $checkQuery = "SELECT email FROM users WHERE username = ?";
    $stmt = $conn->prepare($checkQuery);
    $stmt->bind_param("s", $username);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows === 1) {
        $user = $result->fetch_assoc();

        // 5. 验证邮箱是否是这个用户的
        if ($user['email'] === $email) {

            // 6. 验证通过！加密新密码
            $hashed_password = password_hash($password, PASSWORD_DEFAULT);

            // 7. 更新数据库
            $updateQuery = "UPDATE users SET password = ? WHERE username = ?";
            $stmt_update = $conn->prepare($updateQuery);
            $stmt_update->bind_param("ss", $hashed_password, $username);

            if ($stmt_update->execute()) {
                // 成功后重定向到登录页，并带上成功消息的 key
                header("Location: login.html?status=reset_success");
            } else {
                header("Location: $redirect_page?error=reset_failed_update");
            }
            $stmt_update->close();

        } else {
            // 邮箱不匹配
            header("Location: $redirect_page?error=reset_failed_email_mismatch");
        }
    } else {
        // 用户名不存在 (重用登录的错误 key)
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