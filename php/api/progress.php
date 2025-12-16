<?php
require_once __DIR__ . '/../config/config.php';
require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../classes/Enrollment.php';

header('Content-Type: application/json');

if (!isLoggedIn()) {
    echo json_encode(['success' => false, 'message' => 'Please login']);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode(['success' => false, 'message' => 'Invalid request method']);
    exit;
}

$data = json_decode(file_get_contents('php://input'), true);
$content_id = $data['content_id'] ?? null;

if (!$content_id) {
    echo json_encode(['success' => false, 'message' => 'Content ID is required']);
    exit;
}

$database = new Database();
$db = $database->getConnection();
$enrollment = new Enrollment($db);

// Get enrollment ID for this user and content
$query = "SELECT e.id as enrollment_id 
          FROM enrollments e
          JOIN course_content cc ON cc.module_id IN (
              SELECT cm.id FROM course_modules cm WHERE cm.course_id = e.course_id
          )
          WHERE e.user_id = :user_id AND cc.id = :content_id
          LIMIT 1";

$stmt = $db->prepare($query);
$stmt->bindParam(':user_id', getCurrentUserId());
$stmt->bindParam(':content_id', $content_id);
$stmt->execute();
$result = $stmt->fetch(PDO::FETCH_ASSOC);

if (!$result) {
    echo json_encode(['success' => false, 'message' => 'Enrollment not found']);
    exit;
}

$enrollment_id = $result['enrollment_id'];
$enrollment->markContentCompleted($enrollment_id, $content_id);

// Get updated progress
$progressQuery = "SELECT progress_percentage FROM enrollments WHERE id = :enrollment_id";
$progressStmt = $db->prepare($progressQuery);
$progressStmt->bindParam(':enrollment_id', $enrollment_id);
$progressStmt->execute();
$progress = $progressStmt->fetch(PDO::FETCH_ASSOC);

echo json_encode([
    'success' => true,
    'message' => 'Progress updated',
    'progress_percentage' => $progress['progress_percentage'] ?? 0
]);

