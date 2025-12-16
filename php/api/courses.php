<?php
require_once __DIR__ . '/../config/config.php';
require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../classes/Course.php';

header('Content-Type: application/json');

$database = new Database();
$db = $database->getConnection();
$course = new Course($db);

$filters = [];

if (isset($_GET['category']) && !empty($_GET['category'])) {
    $filters['category'] = $_GET['category'];
}

if (isset($_GET['difficulty']) && !empty($_GET['difficulty'])) {
    $filters['difficulty'] = $_GET['difficulty'];
}

if (isset($_GET['search']) && !empty($_GET['search'])) {
    $filters['search'] = $_GET['search'];
}

if (isset($_GET['featured']) && $_GET['featured'] === 'true') {
    $filters['featured'] = true;
}

if (isset($_GET['limit'])) {
    $filters['limit'] = (int)$_GET['limit'];
    if (isset($_GET['offset'])) {
        $filters['offset'] = (int)$_GET['offset'];
    }
}

if (isset($_GET['slug']) && !empty($_GET['slug'])) {
    // Get single course by slug
    $courseData = $course->getBySlug($_GET['slug']);
    if ($courseData) {
        // Get modules
        $modules = $course->getModules($courseData['id']);
        $courseData['modules'] = $modules;
        echo json_encode([
            'success' => true,
            'course' => $courseData
        ]);
    } else {
        echo json_encode([
            'success' => false,
            'message' => 'Course not found'
        ]);
    }
} else {
    // Get all courses
    $courses = $course->getAll($filters);
    echo json_encode([
        'success' => true,
        'courses' => $courses,
        'count' => count($courses)
    ]);
}

