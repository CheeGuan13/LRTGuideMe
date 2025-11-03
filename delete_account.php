<?php
session_start();
include('db_connect.php'); // 包含数据库连接

// 默认返回 JSON
header('Content-Type: application/json');

// 1. 检查用户是否已登录
if (!isset($_SESSION['user_id'])) {
    echo json_encode(['success' => false, 'messageKey' => 'delete_error_not_logged_in']);
    exit();
}

// 2. 检查是否是通过 POST 请求，并且密码已发送
if ($_SERVER["REQUEST_METHOD"] !== "POST" || !isset($_POST['password'])) {
    echo json_encode(['success' => false, 'messageKey' => 'delete_error_generic']); // 通用错误
    exit();
}

$user_id = $_SESSION['user_id'];
$entered_password = $_POST['password'];

// 3. 从数据库获取当前用户的哈希密码
$sql = "SELECT password FROM users WHERE id = ?";
$stmt = $conn->prepare($sql);
$stmt->bind_param("i", $user_id);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows === 1) {
    $user = $result->fetch_assoc();
    $hashed_password_from_db = $user['password'];

    // 4. 使用 password_verify 验证密码
    if (password_verify($entered_password, $hashed_password_from_db)) {

        // 5. 密码正确，执行删除操作
        $delete_sql = "DELETE FROM users WHERE id = ?";
        $stmt_delete = $conn->prepare($delete_sql);
        $stmt_delete->bind_param("i", $user_id);

        if ($stmt_delete->execute()) {
            // 6. 删除成功，销毁 session (登出用户)
            session_unset();
            session_destroy();

            // 7. 【【【 修改这里 】】】返回成功信息和重定向 URL 到 index.html
            echo json_encode([
                'success' => true,
                'redirectUrl' => 'index.html?status=delete_success' // 让 JS 跳转到首页
            ]);

        } else {
            // 数据库删除失败
            echo json_encode(['success' => false, 'messageKey' => 'delete_error_generic']);
        }
        $stmt_delete->close();

    } else {
        // 密码不正确
        echo json_encode(['success' => false, 'messageKey' => 'delete_error_password']); // 使用新的 key
    }

} else {
    // 理论上不应该发生，因为用户已登录
    echo json_encode(['success' => false, 'messageKey' => 'delete_error_generic']);
}

$stmt->close();
$conn->close();
exit();
?>