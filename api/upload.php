<?php
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: https://veritas-school.com');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') { http_response_code(204); exit; }

$UPLOAD_BASE = __DIR__ . '/../uploads/veritas/';
$PUBLIC_BASE = 'https://veritas-school.com/uploads/veritas/';
$MAX_BYTES   = 50 * 1024 * 1024; // 50 Mo
$ALLOWED_EXT = ['pdf','jpg','jpeg','png','gif','webp','mp4','mp3'];

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
  http_response_code(405); echo '{"error":"Méthode non autorisée"}'; exit;
}
if (empty($_FILES['file'])) {
  http_response_code(400); echo '{"error":"Aucun fichier reçu"}'; exit;
}

$file = $_FILES['file'];
if ($file['error'] !== UPLOAD_ERR_OK) {
  http_response_code(400); echo '{"error":"Erreur upload PHP: ' . $file['error'] . '"}'; exit;
}
if ($file['size'] > $MAX_BYTES) {
  http_response_code(413); echo '{"error":"Fichier > 50 Mo"}'; exit;
}

$ext = strtolower(pathinfo($file['name'], PATHINFO_EXTENSION));
if (!in_array($ext, $ALLOWED_EXT, true)) {
  http_response_code(415); echo '{"error":"Extension non autorisée: ' . htmlspecialchars($ext) . '"}'; exit;
}

$folder  = isset($_POST['folder']) ? preg_replace('/[^a-z0-9_-]/', '', $_POST['folder']) : 'misc';
$newName = uniqid('vrt_', true) . '.' . $ext;
$destDir = $UPLOAD_BASE . $folder . '/';
if (!is_dir($destDir)) { mkdir($destDir, 0755, true); }

if (!move_uploaded_file($file['tmp_name'], $destDir . $newName)) {
  http_response_code(500); echo '{"error":"Déplacement fichier échoué"}'; exit;
}

echo json_encode([
  'ok'     => true,
  'url'    => $PUBLIC_BASE . $folder . '/' . $newName,
  'name'   => $newName,
  'folder' => $folder,
  'size'   => $file['size'],
  'ext'    => $ext
], JSON_UNESCAPED_UNICODE);
