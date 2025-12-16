<?php
require_once __DIR__ . '/../config/config.php';
require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../classes/Enrollment.php';

header('Content-Type: application/json');

if (!isLoggedIn()) {
    echo json_encode(['success' => false, 'message' => 'Please login']);
    exit;
}

$database = new Database();
$db = $database->getConnection();
$enrollment = new Enrollment($db);

$userEnrollments = $enrollment->getUserEnrollments(getCurrentUserId());

echo json_encode([
    'success' => true,
    'enrollments' => $userEnrollments
]);

