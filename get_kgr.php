<?php
// get_kgr.php - 从数据库读取历史记录
header('Content-Type: application/json');
require_once 'db_config.php';

try {
    $stmt = $pdo->query("SELECT * FROM kgr_history ORDER BY created_at DESC LIMIT 100");
    $history = $stmt->fetchAll(PDO::FETCH_ASSOC);
    echo json_encode(['success' => true, 'data' => $history]);
} catch (PDOException $e) {
    echo json_encode(['success' => false, 'message' => '读取失败: ' . $e->getMessage()]);
}
?>
