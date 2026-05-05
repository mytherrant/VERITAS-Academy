<?php
/**
 * VÉRITAS Academy — api/upload.php
 * POST multipart/form-data
 *   file   = fichier à uploader
 *   folder = sous-dossier (galerie | elearning | misc)
 * Retourne JSON : {"ok":true,"url":"https://veritas-school.com/uploads/veritas/galerie/vt_xxx.jpg"}
 */
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Content-Type: application/json; charset=utf-8');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') { http_response_code(200); exit; }
if ($_SERVER['REQUEST_METHOD'] !== 'POST') { http_response_code(405); echo json_encode(['ok'=>false,'error'=>'POST requis']); exit; }

if (!isset($_FILES['file']) || $_FILES['file']['error'] !== UPLOAD_ERR_OK) {
    $err = $_FILES['file']['error'] ?? -1;
    http_response_code(400); echo json_encode(['ok'=>false,'error'=>'Fichier manquant ou erreur upload (code '.$err.')']); exit;
}

$file   = $_FILES['file'];
$folder = preg_replace('/[^a-z0-9_\-]/i','', $_POST['folder'] ?? 'misc') ?: 'misc';

/* Types autorisés */
$allowed = ['image/jpeg','image/jpg','image/png','image/gif','image/webp','application/pdf','video/mp4','audio/mpeg','audio/mp3'];
$finfo   = new finfo(FILEINFO_MIME_TYPE);
$mime    = $finfo->file($file['tmp_name']);
if (!in_array($mime, $allowed)) {
    http_response_code(400); echo json_encode(['ok'=>false,'error'=>'Type non autorisé: '.$mime]); exit;
}

/* Taille max : 10 Mo */
if ($file['size'] > 10*1024*1024) {
    http_response_code(400); echo json_encode(['ok'=>false,'error'=>'Fichier > 10 Mo']); exit;
}

/* Répertoire cible */
$uploadBase = dirname(__DIR__) . '/uploads/veritas/' . $folder . '/';
if (!is_dir($uploadBase)) mkdir($uploadBase, 0755, true);

/* Nom de fichier sécurisé unique */
$ext  = strtolower(pathinfo($file['name'], PATHINFO_EXTENSION));
$ext  = preg_replace('/[^a-z0-9]/','',$ext);
$name = 'vt_' . bin2hex(random_bytes(8)) . '.' . $ext;
$dest = $uploadBase . $name;

if (!move_uploaded_file($file['tmp_name'], $dest)) {
    http_response_code(500); echo json_encode(['ok'=>false,'error'=>'Impossible de déplacer le fichier']); exit;
}

$url = 'https://veritas-school.com/uploads/veritas/' . $folder . '/' . $name;
echo json_encode(['ok'=>true,'url'=>$url,'name'=>$name,'size'=>$file['size'],'mime'=>$mime]);
