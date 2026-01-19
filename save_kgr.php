<?php
// save_kgr.php - 保存 KGR 数据到数据库
header('Content-Type: application/json');
require_once 'db_config.php';

// 获取 POST 请求中的 JSON 数据
$input = file_get_contents('php://input');
$data = json_decode($input, true);

if (!$data) {
    echo json_encode(['success' => false, 'message' => '无效的数据格式']);
    exit;
}

try {
    $stmt = $pdo->prepare("INSERT INTO kgr_history (keyword, volume, intent, cpc, kd, allintitle, kgr) VALUES (?, ?, ?, ?, ?, ?, ?)");
    
    foreach ($data as $row) {
        $stmt->execute([
            $row['keyword'],
            (int)$row['volume'],
            $row['intent'],
            $row['cpc'],
            $row['kd'],
            (int)$row['allintitle'],
            (float)$row['kgr']
        ]);
    }

    echo json_encode(['success' => true, 'message' => '成功保存到数据库']);
} catch (PDOException $e) {
    echo json_encode(['success' => false, 'message' => '数据库错误: ' . $e->getMessage()]);
}
?>
