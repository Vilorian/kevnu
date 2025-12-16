<?php
require_once __DIR__ . '/../config/config.php';
require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../classes/Enrollment.php';

header('Content-Type: application/json');

if (!isLoggedIn()) {
    echo json_encode([
        'success' => false,
        'message' => 'Please login to enroll in courses',
        'redirect' => '/login.php'
    ]);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode(['success' => false, 'message' => 'Invalid request method']);
    exit;
}

$data = json_decode(file_get_contents('php://input'), true);
$course_id = $data['course_id'] ?? null;

if (!$course_id) {
    echo json_encode(['success' => false, 'message' => 'Course ID is required']);
    exit;
}

$database = new Database();
$db = $database->getConnection();
$enrollment = new Enrollment($db);

$enrollment->user_id = getCurrentUserId();
$enrollment->course_id = $course_id;

if ($enrollment->enroll()) {
    echo json_encode([
        'success' => true,
        'message' => 'Successfully enrolled in course'
    ]);
} else {
    echo json_encode([
        'success' => false,
        'message' => 'Already enrolled or enrollment failed'
    ]);
}

