<?php
$servername = "localhost"; // 不改
$username = "root"; // 默认用户名
$password = ""; // 默认没有密码
$dbname = "lrt_guideme"; // 你的数据库名字

$conn = new mysqli($servername, $username, $password, $dbname);

// 检查连接是否成功
if ($conn->connect_error) {
  die("Connection failed: " . $conn->connect_error);
}
?>
