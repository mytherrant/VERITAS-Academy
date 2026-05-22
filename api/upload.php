<?php
/**
 * VÉRITAS Academy — api/upload.php
 * POST multipart/form-data
 *   file   = fichier à uploader
 *   folder = sous-dossier (galerie | elearning | misc)
 * Retourne JSON : {"ok":true,"url":"https://veritas-school.com/uploads/veritas/galerie/vt_xxx.jpg"}
 *
 * 🔐 SÉCURITÉ v1.2 :
 *   - Authentification Bearer OBLIGATOIRE
 *   - Whitelist MIME stricte (PAS de SVG/HTML/JS/JSON/XML — vecteurs XSS)
 *   - Double validation extension + MIME
 *   - .htaccess de protection dans le dossier d'upload
 */
require_once __DIR__ . '/config_sync.php';

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') { http_response_code(200); exit; }
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405); echo json_encode(['ok'=>false,'error'=>'POST requis']); exit;
}

// 🔐 Authentification OBLIGATOIRE (correction faille critique v1.2)
requireAuth();

if (!isset($_FILES['file']) || $_FILES['file']['error'] !== UPLOAD_ERR_OK) {
    $err = $_FILES['file']['error'] ?? -1;
    http_response_code(400); echo json_encode(['ok'=>false,'error'=>'Fichier manquant ou erreur upload (code '.$err.')']); exit;
}

$file   = $_FILES['file'];
$folder = preg_replace('/[^a-z0-9_\-]/i','', $_POST['folder'] ?? 'misc') ?: 'misc';
// Anti path-traversal supplémentaire
if (in_array($folder, ['..', '.', ''])) $folder = 'misc';

/* 🔐 WHITELIST STRICTE — retirés : SVG (XSS), HTML/JS/CSS/JSON/XML (XSS stored), ZIP (zip-slip) */
$allowed = [
    // Images (sans SVG)
    'image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp',
    // Documents
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'application/vnd.ms-powerpoint',
    'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    'application/vnd.oasis.opendocument.text',
    'application/vnd.oasis.opendocument.spreadsheet',
    'application/vnd.oasis.opendocument.presentation',
    'text/plain',
    // Vidéo & audio
    'video/mp4','video/webm','video/ogg','video/quicktime',
    'audio/mpeg','audio/mp3','audio/wav','audio/ogg','audio/mp4',
];
$finfo = new finfo(FILEINFO_MIME_TYPE);
$mime  = $finfo->file($file['tmp_name']);
if (!in_array($mime, $allowed)) {
    @file_put_contents(__DIR__.'/data/_security_log.txt',
        date('c').' [UPLOAD_BLOCKED] mime='.$mime.' ip='.($_SERVER['REMOTE_ADDR']??'?')."\n", FILE_APPEND);
    http_response_code(400); echo json_encode(['ok'=>false,'error'=>'Type non autorisé: '.$mime]); exit;
}

/* 🔐 Double validation : l'extension du nom doit correspondre au MIME */
$ext = strtolower(pathinfo($file['name'], PATHINFO_EXTENSION));
$ext = preg_replace('/[^a-z0-9]/','',$ext);
$mimeToExt = [
    'image/jpeg'=>['jpg','jpeg'], 'image/jpg'=>['jpg','jpeg'],
    'image/png'=>['png'], 'image/gif'=>['gif'], 'image/webp'=>['webp'],
    'application/pdf'=>['pdf'],
    'video/mp4'=>['mp4','m4v'], 'video/webm'=>['webm'],
    'video/ogg'=>['ogv','ogg'], 'video/quicktime'=>['mov'],
    'audio/mpeg'=>['mp3'], 'audio/mp3'=>['mp3'],
    'audio/wav'=>['wav'], 'audio/ogg'=>['ogg'], 'audio/mp4'=>['m4a','mp4'],
    'application/msword'=>['doc'],
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document'=>['docx'],
    'application/vnd.ms-excel'=>['xls'],
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'=>['xlsx'],
    'application/vnd.ms-powerpoint'=>['ppt'],
    'application/vnd.openxmlformats-officedocument.presentationml.presentation'=>['pptx'],
    'text/plain'=>['txt'],
];
$validExts = $mimeToExt[$mime] ?? [];
if (!empty($validExts) && !in_array($ext, $validExts)) {
    http_response_code(400); echo json_encode(['ok'=>false,'error'=>'Extension '.$ext.' incohérente avec le MIME '.$mime]); exit;
}

/* Taille max : 30 Mo (50 Mo pour vidéos) */
$maxBytes = (strpos($mime, 'video/') === 0) ? 50*1024*1024 : 30*1024*1024;
if ($file['size'] > $maxBytes) {
    http_response_code(400); echo json_encode(['ok'=>false,'error'=>'Fichier > '.($maxBytes/1048576).' Mo']); exit;
}

/* Répertoire cible */
$uploadBase = dirname(__DIR__) . '/uploads/veritas/' . $folder . '/';
if (!is_dir($uploadBase)) mkdir($uploadBase, 0755, true);

/* 🔐 .htaccess de sécurité dans le dossier d'upload (bloque l'exécution PHP/CGI) */
$htaccess = $uploadBase . '.htaccess';
if (!file_exists($htaccess)) {
    file_put_contents($htaccess,
        "# Bloquer toute exécution serveur dans uploads/\n".
        "Options -Indexes -ExecCGI\n".
        "RemoveHandler .php .phtml .phar .cgi .pl .py\n".
        "AddType text/plain .php .phtml .phar .cgi .pl .py\n".
        "<FilesMatch \"\\.(php|phtml|phar|cgi|pl|py|sh|asp|aspx|jsp|exe|bat)$\">\n".
        "  Require all denied\n".
        "</FilesMatch>\n"
    );
}

/* Nom de fichier sécurisé unique */
$name = 'vt_' . bin2hex(random_bytes(8)) . '.' . $ext;
$dest = $uploadBase . $name;

if (!move_uploaded_file($file['tmp_name'], $dest)) {
    http_response_code(500); echo json_encode(['ok'=>false,'error'=>'Impossible de déplacer le fichier']); exit;
}
chmod($dest, 0644);

$url = 'https://veritas-school.com/uploads/veritas/' . $folder . '/' . $name;
echo json_encode(['ok'=>true,'url'=>$url,'name'=>$name,'size'=>$file['size'],'mime'=>$mime]);
