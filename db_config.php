<?php
// db_config.php - 数据库连接配置文件
// 请将以下占位符替换为你 Hostinger hPanel 中的实际信息

$host = 'localhost'; // Hostinger 通常使用 localhost
$dbname = 'u123456789_kgr_db'; // 替换为你的数据库名
$username = 'u123456789_kaka'; // 替换为你的数据库用户名
$password = 'YourStrongPassword'; // 替换为你的数据库密码

try {
    $pdo = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8mb4", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
    die("数据库连接失败: " . $e->getMessage());
}
?>
