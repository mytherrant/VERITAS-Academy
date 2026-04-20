<?php
// ============================================================
// VÉRITAS — Upload vidéo d'introduction
// POST /api/upload_video.php  → upload vers uploads/video/
// ── Pas de MySQL requis ──
// ============================================================
require_once __DIR__ . '/config_sync.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    jsonResponse(['error' => 'Méthode non autorisée'], 405);
}

requireAuth();

if (!isset($_FILES['video']) || $_FILES['video']['error'] !== UPLOAD_ERR_OK) {
    $errors = [
        UPLOAD_ERR_INI_SIZE  => 'Fichier trop volumineux (limite serveur PHP)',
        UPLOAD_ERR_FORM_SIZE => 'Fichier trop volumineux',
        UPLOAD_ERR_PARTIAL   => 'Upload incomplet — réessayez',
        UPLOAD_ERR_NO_FILE   => 'Aucun fichier reçu',
    ];
    $code = isset($_FILES['video']['error']) ? $_FILES['video']['error'] : UPLOAD_ERR_NO_FILE;
    jsonResponse(['error' => $errors[$code] ?? 'Erreur upload (' . $code . ')'], 400);
}

$file = $_FILES['video'];

// Vérifier la taille (100 Mo max)
$maxSize = 100 * 1024 * 1024;
if ($file['size'] > $maxSize) {
    jsonResponse(['error' => 'Fichier trop volumineux (max 100 Mo)'], 400);
}

// Vérifier le type MIME réel
$allowedMimes = ['video/mp4', 'video/webm', 'video/ogg', 'video/quicktime', 'video/x-msvideo'];
$mime = mime_content_type($file['tmp_name']);
if (!in_array($mime, $allowedMimes)) {
    jsonResponse(['error' => 'Type non autorisé : ' . $mime . ' — utilisez MP4 ou WebM'], 400);
}

// Extension
$ext = strtolower(pathinfo($file['name'], PATHINFO_EXTENSION));
if (!in_array($ext, ['mp4', 'webm', 'ogg', 'mov', 'avi'])) $ext = 'mp4';

// Dossier de destination
$uploadDir = __DIR__ . '/../uploads/video/';
if (!is_dir($uploadDir)) {
    mkdir($uploadDir, 0755, true);
}

// Nom fixe → écrase la vidéo précédente (une seule vidéo d'intro)
$filename = 'intro_video.' . $ext;
$dest = $uploadDir . $filename;

if (!move_uploaded_file($file['tmp_name'], $dest)) {
    jsonResponse(['error' => 'Erreur lors de l\'enregistrement du fichier (permissions ?)'], 500);
}

$url = 'https://veritas-school.com/uploads/video/' . $filename;

jsonResponse([
    'success'  => true,
    'url'      => $url,
    'filename' => $filename,
    'size_kb'  => round($file['size'] / 1024, 1),
    'mime'     => $mime,
]);
