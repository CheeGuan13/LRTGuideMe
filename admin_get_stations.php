<?php
session_start();
include('db_connect.php');
header('Content-Type: application/json');

// 1. 验证管理员身份
if (!isset($_SESSION["admin_username"])) {
    echo json_encode(['error' => 'Unauthorized']);
    exit;
}

// 2. 从数据库获取所有车站
$result = $conn->query("SELECT id, name, default_level FROM stations ORDER BY name");

if (!$result) {
    echo json_encode(['error' => 'Database query failed']);
    exit;
}

$stations = [];
while ($row = $result->fetch_assoc()) {
    $stations[] = $row;
}

$conn->close();
echo json_encode($stations);
?>