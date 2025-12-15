<?php
header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode([
        'status' => 'error',
        'message' => 'Invalid request'
    ]);
    exit;
}

$name    = trim($_POST['name'] ?? '');
$company = trim($_POST['company'] ?? '');
$email   = trim($_POST['email'] ?? '');
$phone   = trim($_POST['phone'] ?? '');
$message = trim($_POST['message'] ?? '');

$errors = [];


if ($name === '') {
    $errors[] = 'Name is required';
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    $errors[] = 'Please enter a valid email';
}


if ($phone === '') {
    $errors[] = 'Phone number is required';
} else {
    
    if (!preg_match('/^[\d\s\-\+\(\)]+$/', $phone)) {
        $errors[] = 'Phone number contains invalid characters';
    }

   
    $digits = preg_replace('/\D/', '', $phone);

    if (strlen($digits) < 10 || strlen($digits) > 15) {
        $errors[] = 'Phone number must be between 10 and 15 digits';
    }
}


if ($message === '') {
    $errors[] = 'Message cannot be empty';
}


if (!empty($errors)) {
    echo json_encode([
        'status' => 'error',
        'message' => implode(', ', $errors)
    ]);
    exit;
}

echo json_encode([
    'status' => 'success',
    'message' => 'Form submitted successfully!'
]);
