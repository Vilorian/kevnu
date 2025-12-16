<?php
require_once __DIR__ . '/../config/config.php';
require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../classes/User.php';

header('Content-Type: application/json');

$action = $_GET['action'] ?? '';

if ($action === 'logout') {
    session_destroy();
    header('Location: /login');
    exit;
}

if ($action === 'check') {
    if (isLoggedIn()) {
        echo json_encode([
            'loggedIn' => true,
            'user' => [
                'id' => $_SESSION['user_id'],
                'name' => $_SESSION['user_name'],
                'email' => $_SESSION['user_email'],
                'role' => $_SESSION['user_role']
            ]
        ]);
    } else {
        echo json_encode(['loggedIn' => false]);
    }
    exit;
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = json_decode(file_get_contents('php://input'), true);
    
        if ($action === 'register') {
            $name = sanitizeInput($data['name'] ?? '');
            $email = sanitizeInput($data['email'] ?? '');
            $password = $data['password'] ?? '';

            if (empty($name) || empty($email) || empty($password)) {
                echo json_encode(['success' => false, 'message' => 'Please fill in all fields.']);
                exit;
            }

            if (strlen($password) < 8) {
                echo json_encode(['success' => false, 'message' => 'Password must be at least 8 characters.']);
                exit;
            }

            $database = new Database();
            $db = $database->getConnection();
            $user = new User($db);

            if ($user->emailExists($email)) {
                echo json_encode(['success' => false, 'message' => 'Email already registered.']);
                exit;
            }

            $user->name = $name;
            $user->email = $email;
            $user->password_hash = $password;
            $user->role = 'student';

            if ($user->create()) {
                $_SESSION['user_id'] = $user->id;
                $_SESSION['user_email'] = $user->email;
                $_SESSION['user_name'] = $user->name;
                $_SESSION['user_role'] = $user->role;

                echo json_encode([
                    'success' => true,
                    'message' => 'Registration successful',
                    'user' => [
                        'id' => $user->id,
                        'name' => $user->name,
                        'email' => $user->email,
                        'role' => $user->role
                    ]
                ]);
            } else {
                echo json_encode(['success' => false, 'message' => 'Registration failed.']);
            }
        } elseif ($action === 'login') {
        $email = sanitizeInput($data['email'] ?? '');
        $password = $data['password'] ?? '';

        if (empty($email) || empty($password)) {
            echo json_encode(['success' => false, 'message' => 'Please fill in all fields.']);
            exit;
        }

        $database = new Database();
        $db = $database->getConnection();
        $user = new User($db);

        if ($user->getByEmail($email) && $user->verifyPassword($password)) {
            $_SESSION['user_id'] = $user->id;
            $_SESSION['user_email'] = $user->email;
            $_SESSION['user_name'] = $user->name;
            $_SESSION['user_role'] = $user->role;

            echo json_encode([
                'success' => true,
                'message' => 'Login successful',
                'user' => [
                    'id' => $user->id,
                    'name' => $user->name,
                    'email' => $user->email,
                    'role' => $user->role
                ]
            ]);
        } else {
            echo json_encode(['success' => false, 'message' => 'Invalid email or password.']);
        }
    }
} else {
    echo json_encode(['success' => false, 'message' => 'Invalid request method.']);
}

