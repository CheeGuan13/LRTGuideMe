<?php
session_start();
include('db_connect.php');
header('Content-Type: application/json');

// 封装一个函数来发送 JSON 错误并退出
function send_json_error($message) {
    die(json_encode(['error' => $message]));
}

// 1. 验证管理员身份
if (!isset($_SESSION["admin_username"])) {
    send_json_error('Unauthorized. Please log in again.');
}

$action = $_POST['action'] ?? $_GET['action'] ?? '';

try {
    switch ($action) {

        // ----------------------------------
        // (来自 admin_dashboard.html)
        // ----------------------------------
        case 'add_station':
            $name = trim($_POST['stationName'] ?? '');
            $level = trim($_POST['defaultLevel'] ?? 'L1');
            if (empty($name) || empty($level)) {
                send_json_error('Station name and default level are required.');
            }
            
            $stmt = $conn->prepare("INSERT INTO stations (name, default_level) VALUES (?, ?)");
            $stmt->bind_param("ss", $name, $level);
            if ($stmt->execute()) {
                echo json_encode(['success' => true, 'id' => $conn->insert_id]);
            } else {
                send_json_error('Station name might already exist.');
            }
            $stmt->close();
            break;

        // ----------------------------------
        // (来自 admin_manage_station.js)
        // ----------------------------------
        case 'get_station_levels':
            $station_id = (int)($_GET['station_id'] ?? 0);
            if ($station_id === 0) send_json_error('Invalid Station ID.');
            
            // 1. 获取车站名称
            $stmt_station = $conn->prepare("SELECT name FROM stations WHERE id = ?");
            $stmt_station->bind_param("i", $station_id);
            $stmt_station->execute();
            $station_result = $stmt_station->get_result();
            $station_row = $station_result->fetch_assoc();
            $station_name = $station_row ? $station_row['name'] : 'Unknown Station';
            $stmt_station->close();

            // 2. 获取楼层
            $levels = [];
            $stmt_levels = $conn->prepare("SELECT id, level_name FROM levels WHERE station_id = ? ORDER BY level_name");
            $stmt_levels->bind_param("i", $station_id);
            $stmt_levels->execute();
            $result = $stmt_levels->get_result();
            while($row = $result->fetch_assoc()) {
                $levels[] = $row;
            }
            $stmt_levels->close();
            
            // 3. 一起返回
            echo json_encode([
                'station_name' => $station_name,
                'levels' => $levels
            ]);
            break;

        case 'get_level_details':
            $level_id = (int)($_GET['level_id'] ?? 0);
            if ($level_id === 0) send_json_error('Invalid Level ID.');
            
            $response = [
                'level_info' => null,
                'pois' => [],
                'areas' => []
            ];
            
            $stmt = $conn->prepare("
                SELECT l.*, s.name AS station_name 
                FROM levels l
                JOIN stations s ON l.station_id = s.id
                WHERE l.id = ?
            ");
            $stmt->bind_param("i", $level_id);
            $stmt->execute();
            $result = $stmt->get_result();
            $response['level_info'] = $result->fetch_assoc();
            $stmt->close();
            
            if (!$response['level_info']) {
                send_json_error('Level not found.');
            }

            // 获取所有 POIs
            $stmt = $conn->prepare("SELECT * FROM pois WHERE level_id = ? ORDER BY name");
            $stmt->bind_param("i", $level_id);
            $stmt->execute();
            $result = $stmt->get_result();
            while($row = $result->fetch_assoc()) {
                $response['pois'][] = $row;
            }
            $stmt->close();
            
            echo json_encode($response);
            break;

        case 'add_poi':
            $level_id = (int)($_POST['level_id'] ?? 0);
            $name = trim($_POST['name'] ?? '');
            $poi_id_string = trim($_POST['poi_id_string'] ?? '');
            $type = trim($_POST['type'] ?? '');
            $x = (int)($_POST['x_coord'] ?? 0);
            $y = (int)($_POST['y_coord'] ?? 0);
            
            if (empty($name) || empty($poi_id_string) || empty($type) || $level_id === 0) {
                 send_json_error('All fields and coordinates are required.');
            }
            
            $stmt = $conn->prepare("INSERT INTO pois (level_id, poi_id_string, name, type, x_coord, y_coord) VALUES (?, ?, ?, ?, ?, ?)");
            $stmt->bind_param("isssii", $level_id, $poi_id_string, $name, $type, $x, $y);
            if ($stmt->execute()) {
                echo json_encode(['success' => true, 'id' => $conn->insert_id]);
            } else {
                send_json_error('Database error or Unique ID (poi_id_string) already exists.');
            }
            $stmt->close();
            break;
            
        case 'delete_poi':
            $poi_id = (int)($_POST['poi_id'] ?? 0);
            
            $stmt = $conn->prepare("DELETE FROM pois WHERE id = ?");
            $stmt->bind_param("i", $poi_id);
            if ($stmt->execute()) {
                echo json_encode(['success' => true]);
            } else {
                send_json_error('Failed to delete. It might be linked to a cross-link.');
            }
            $stmt->close();
            break;
            
        case 'upload_floorplan':
            $level_id = (int)($_POST['level_id'] ?? 0);
            if ($level_id === 0) send_json_error('Invalid Level ID.');
            
            if (isset($_FILES['floorplan']) && $_FILES['floorplan']['error'] === UPLOAD_ERR_OK) {
                $uploadDir = "uploads/"; // 确保这个文件夹存在且可写
                if (!is_dir($uploadDir)) mkdir($uploadDir, 0777, true);
                
                $fileName = "level_" . $level_id . "_" . uniqid() . "_" . basename($_FILES['floorplan']['name']);
                $targetFile = $uploadDir . $fileName;
                
                if (move_uploaded_file($_FILES['floorplan']['tmp_name'], $targetFile)) {
                    // 上传成功，更新数据库
                    $stmt = $conn->prepare("UPDATE levels SET background_image = ? WHERE id = ?");
                    $stmt->bind_param("si", $targetFile, $level_id);
                    $stmt->execute();
                    $stmt->close();
                    echo json_encode(['success' => true, 'path' => $targetFile]);
                } else {
                    send_json_error('Failed to move uploaded file.');
                }
            } else {
                send_json_error('No file uploaded or upload error.');
            }
            break;
            
        case 'add_level':
            $station_id = (int)($_POST['station_id'] ?? 0);
            $level_name = trim($_POST['level_name'] ?? '');
            if ($station_id === 0 || empty($level_name)) {
                 send_json_error('Invalid station ID or level name.');
            }
            
            $stmt = $conn->prepare("INSERT INTO levels (station_id, level_name) VALUES (?, ?)");
            $stmt->bind_param("is", $station_id, $level_name);
            if ($stmt->execute()) {
                echo json_encode(['success' => true, 'id' => $conn->insert_id]);
            } else {
                send_json_error('Failed to add level.');
            }
            $stmt->close();
            break;

        default:
            send_json_error('Invalid action.');
    }
} catch (Exception $e) {
    // 捕捉任何 PHP 或数据库的致命错误
    send_json_error('A fatal error occurred: ' . $e->getMessage());
}

$conn->close();
?>