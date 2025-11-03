<?php
session_start();

$response = [
  "logged_in" => isset($_SESSION["admin_username"]),
  "username" => $_SESSION["admin_username"] ?? null
];

header('Content-Type: application/json');
echo json_encode($response);
?>
