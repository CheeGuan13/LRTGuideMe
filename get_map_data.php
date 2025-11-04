<?php
require 'db_connect.php'; // 你的数据库连接
header('Content-Type: application/json');

// 1. 获取请求的车站名称
$station_name = $_GET['station'] ?? 'KL Sentral'; // 默认为 KL Sentral

// 2. 准备最终的输出结构
$output = [];
$station_data = [
    'defaultLevel' => 'L1',
    'size' => ['width' => 1000, 'height' => 540],
    'levels' => [],
    'crossLinks' => []
];

// 3. 查询车站 ID 和默认楼层
$stmt = $conn->prepare("SELECT id, default_level FROM stations WHERE name = ?");
$stmt->bind_param("s", $station_name);
$stmt->execute();
$station_result = $stmt->get_result();
if ($station_result->num_rows === 0) {
    echo json_encode(['error' => 'Station not found']);
    exit;
}
$station_row = $station_result->fetch_assoc();
$station_id = $station_row['id'];
$station_data['defaultLevel'] = $station_row['default_level'];
$stmt->close();

// 4. 查询该车站的所有楼层
$stmt = $conn->prepare("SELECT id, level_name, map_width, map_height FROM levels WHERE station_id = ?");
$stmt->bind_param("i", $station_id);
$stmt->execute();
$levels_result = $stmt->get_result();

while ($level_row = $levels_result->fetch_assoc()) {
    $level_id = $level_row['id'];
    $level_key = $level_row['level_name'];
    
    $level_data = [
        'width' => (int)$level_row['map_width'],
        'height' => (int)$level_row['map_height'],
        'areas' => [],
        'pois' => []
    ];

    // 5. 查询该楼层的所有 POI
    $poi_stmt = $conn->prepare("SELECT poi_id_string, name, type, x_coord, y_coord FROM pois WHERE level_id = ?");
    $poi_stmt->bind_param("i", $level_id);
    $poi_stmt->execute();
    $pois_result = $poi_stmt->get_result();
    while ($poi_row = $pois_result->fetch_assoc()) {
        $level_data['pois'][] = [
            'id' => $poi_row['poi_id_string'],
            'name' => $poi_row['name'],
            'type' => $poi_row['type'],
            'x' => (int)$poi_row['x_coord'],
            'y' => (int)$poi_row['y_coord']
        ];
    }
    $poi_stmt->close();

    // 6. 查询该楼层的所有 Area
    $area_stmt = $conn->prepare("SELECT label, x, y, w, h, fill_color FROM areas WHERE level_id = ?");
    $area_stmt->bind_param("i", $level_id);
    $area_stmt->execute();
    $areas_result = $area_stmt->get_result();
    while ($area_row = $areas_result->fetch_assoc()) {
        $level_data['areas'][] = [
            'x' => (int)$area_row['x'],
            'y' => (int)$area_row['y'],
            'w' => (int)$area_row['w'],
            'h' => (int)$area_row['h'],
            'label' => $area_row['label'],
            'fill' => $area_row['fill_color']
        ];
    }
    $area_stmt->close();

    $station_data['levels'][$level_key] = $level_data;
}
$stmt->close();

// 7. 查询该车站的所有跨层连接
$stmt = $conn->prepare("SELECT from_poi_id, to_poi_id, type FROM cross_links WHERE station_id = ?");
$stmt->bind_param("i", $station_id);
$stmt->execute();
$links_result = $stmt->get_result();
while ($link_row = $links_result->fetch_assoc()) {
    // 找出 from_poi 和 to_poi 所在的楼层
    // (这是一个简化的查找，假设 poi_id_string 是唯一的)
    $from_poi_data = $conn->query("SELECT l.level_name FROM pois p JOIN levels l ON p.level_id = l.id WHERE p.poi_id_string = '{$link_row['from_poi_id']}'")->fetch_assoc();
    $to_poi_data = $conn->query("SELECT l.level_name FROM pois p JOIN levels l ON p.level_id = l.id WHERE p.poi_id_string = '{$link_row['to_poi_id']}'")->fetch_assoc();

    if ($from_poi_data && $to_poi_data) {
        $station_data['crossLinks'][] = [
            'from' => ['level' => $from_poi_data['level_name'], 'poi' => $link_row['from_poi_id']],
            'to' => ['level' => $to_poi_data['level_name'], 'poi' => $link_row['to_poi_id']],
            'type' => $link_row['type']
        ];
    }
}
$stmt->close();
$conn->close();

// 8. 以旧格式输出
$output[$station_name] = $station_data;
echo json_encode($output);
?>