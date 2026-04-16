<?php
// ============================================================
// VÉRITAS — Upload de fichiers (vidéos, PDFs, épreuves)
// POST /api/upload.php
// ============================================================
require_once __DIR__ . '/config.php';
requireAuth();

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    jsonResponse(['error' => 'Méthode non autorisée'], 405);
}

// Vérifier qu'un fichier est envoyé
if (!isset($_FILES['file']) || $_FILES['file']['error'] !== UPLOAD_ERR_OK) {
    $errors = [
        UPLOAD_ERR_INI_SIZE => 'Fichier trop volumineux (limite serveur)',
        UPLOAD_ERR_FORM_SIZE => 'Fichier trop volumineux',
        UPLOAD_ERR_PARTIAL => 'Upload incomplet',
        UPLOAD_ERR_NO_FILE => 'Aucun fichier envoyé',
    ];
    $code = $_FILES['file']['error'] ?? UPLOAD_ERR_NO_FILE;
    jsonResponse(['error' => $errors[$code] ?? 'Erreur upload'], 400);
}

$file = $_FILES['file'];

// Vérifier la taille
if ($file['size'] > MAX_FILE_SIZE) {
    jsonResponse(['error' => 'Fichier trop volumineux (max 50 Mo)'], 400);
}

// Types autorisés
$allowedTypes = [
    'application/pdf' => 'epreuve',
    'video/mp4' => 'video',
    'video/webm' => 'video',
    'video/ogg' => 'video',
    'image/png' => 'image',
    'image/jpeg' => 'image',
    'image/webp' => 'image',
    'text/html' => 'ressource',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' => 'ressource',
];

$mime = mime_content_type($file['tmp_name']);
if (!isset($allowedTypes[$mime])) {
    jsonResponse(['error' => 'Type de fichier non autorisé : ' . $mime], 400);
}

// Générer un nom unique
$id = bin2hex(random_bytes(4));
$ext = pathinfo($file['name'], PATHINFO_EXTENSION);
$category = $_POST['category'] ?? $allowedTypes[$mime];
$filename = $category . '_' . $id . '.' . $ext;

// Créer le dossier si nécessaire
$uploadDir = UPLOAD_DIR . $category . '/';
if (!is_dir($uploadDir)) {
    mkdir($uploadDir, 0755, true);
}

// Déplacer le fichier
$destPath = $uploadDir . $filename;
if (!move_uploaded_file($file['tmp_name'], $destPath)) {
    jsonResponse(['error' => 'Erreur lors de l\'enregistrement du fichier'], 500);
}

// URL publique
$publicUrl = 'https://veritas-school.com/uploads/' . $category . '/' . $filename;

// Enregistrer en base de données
$db = getDB();
$stmt = $db->prepare(
    'INSERT INTO files (id, filename, original_name, mime_type, size_bytes, category, title, description, classe, matiere, uploaded_by, public_url)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)'
);
$stmt->execute([
    $id,
    $filename,
    $file['name'],
    $mime,
    $file['size'],
    $category,
    $_POST['title'] ?? $file['name'],
    $_POST['description'] ?? '',
    $_POST['classe'] ?? '',
    $_POST['matiere'] ?? '',
    $_POST['uploaded_by'] ?? 'admin',
    $publicUrl
]);

jsonResponse([
    'success' => true,
    'id' => $id,
    'url' => $publicUrl,
    'filename' => $filename,
    'size' => $file['size'],
    'category' => $category
], 201);
