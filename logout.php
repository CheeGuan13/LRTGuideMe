<?php
session_start();
session_unset();
session_destroy();
// 重定向到首页，并带上登出成功的 key
header("Location: index.html?status=logout_success");
exit();
?>