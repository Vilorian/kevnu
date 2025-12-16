<?php
require_once __DIR__ . '/../config/config.php';
require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../classes/Commission.php';

header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode(['success' => false, 'message' => 'Invalid request method']);
    exit;
}

$data = json_decode(file_get_contents('php://input'), true);

// Validate required fields
$required = ['name', 'email', 'project_type', 'budget_range', 'description'];
foreach ($required as $field) {
    if (empty($data[$field])) {
        echo json_encode(['success' => false, 'message' => ucfirst(str_replace('_', ' ', $field)) . ' is required']);
        exit;
    }
}

$database = new Database();
$db = $database->getConnection();
$commission = new Commission($db);

$commission->name = sanitizeInput($data['name']);
$commission->email = sanitizeInput($data['email']);
$commission->phone = sanitizeInput($data['phone'] ?? '');
$commission->project_type = sanitizeInput($data['project_type']);
$commission->budget_range = sanitizeInput($data['budget_range']);
$commission->description = sanitizeInput($data['description']);
$commission->timeline = sanitizeInput($data['timeline'] ?? '');
$commission->features = sanitizeInput($data['features'] ?? '');
$commission->status = 'pending';

if ($commission->create()) {
    echo json_encode([
        'success' => true,
        'message' => 'Quote request submitted successfully! We\'ll get back to you soon.',
        'id' => $commission->id
    ]);
} else {
    echo json_encode(['success' => false, 'message' => 'Error submitting request. Please try again.']);
}

