<?php
// ============================================================
// VÉRITAS — Upload de fichiers pédagogiques (PDF, images, vidéos)
// POST /api/upload_file.php  → sauvegarde un fichier dans uploads/media/
//   Champs POST attendus :
//     file      (multipart)  — le fichier
//     type      (text)       — "book" | "resource" | "other"
//     ref_id    (text)       — ID du livre ou de la ressource
//     _secret   (text)       — clé API (fallback si header Authorization absent)
// Retourne : { success, url, filename, size_kb }
// ── Authentification Bearer requise ──
// ============================================================
require_once __DIR__ . '/config_sync.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    jsonResponse(['error' => 'Méthode non autorisée'], 405);
}

requireAuth();

// ── Créer le répertoire si nécessaire ──
$mediaDir = __DIR__ . '/../uploads/media/';
if (!is_dir($mediaDir)) {
    if (!mkdir($mediaDir, 0755, true)) {
        jsonResponse(['error' => 'Impossible de créer le répertoire uploads/media/'], 500);
    }
}

// ── Ajouter un .htaccess de sécurité la première fois ──
$htaccess = $mediaDir . '.htaccess';
if (!file_exists($htaccess)) {
    file_put_contents($htaccess,
        "# Autoriser l'accès aux fichiers pédagogiques VÉRITAS\n" .
        "Options -Indexes\n" .
        "<FilesMatch \"\\.php$\">\n  Deny from all\n</FilesMatch>\n"
    );
}

// ── Vérifier la présence du fichier ──
if (empty($_FILES['file']) || $_FILES['file']['error'] === UPLOAD_ERR_NO_FILE) {
    jsonResponse(['error' => 'Aucun fichier reçu'], 400);
}

$file = $_FILES['file'];

if ($file['error'] !== UPLOAD_ERR_OK) {
    $errs = [
        UPLOAD_ERR_INI_SIZE   => 'Fichier trop lourd (upload_max_filesize PHP)',
        UPLOAD_ERR_FORM_SIZE  => 'Fichier trop lourd (MAX_FILE_SIZE HTML)',
        UPLOAD_ERR_PARTIAL    => 'Upload partiel — réessayez',
        UPLOAD_ERR_NO_TMP_DIR => 'Dossier temporaire manquant',
        UPLOAD_ERR_CANT_WRITE => 'Échec d\'écriture sur disque',
        UPLOAD_ERR_EXTENSION  => 'Extension PHP a bloqué l\'upload',
    ];
    jsonResponse(['error' => $errs[$file['error']] ?? 'Erreur upload #' . $file['error']], 400);
}

// ── Taille maximale : 30 Mo (ou 100 Mo pour vidéos) ──
$finfo    = finfo_open(FILEINFO_MIME_TYPE);
$mime     = finfo_file($finfo, $file['tmp_name']);
finfo_close($finfo);

$isVideo  = strpos($mime, 'video/') === 0;
$maxBytes = $isVideo ? 100 * 1024 * 1024 : 30 * 1024 * 1024;

if ($file['size'] > $maxBytes) {
    jsonResponse(['error' => 'Fichier trop lourd (max ' . ($isVideo ? '100' : '30') . ' Mo)'], 400);
}

// ── Types MIME autorisés ──
$allowed = [
    'application/pdf',
    'image/jpeg', 'image/png', 'image/gif', 'image/webp',
    'video/mp4', 'video/webm', 'video/ogg',
    'audio/mpeg', 'audio/mp4', 'audio/wav',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-powerpoint',
    'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    'text/html',
];
if (!in_array($mime, $allowed)) {
    jsonResponse(['error' => 'Type de fichier non autorisé : ' . $mime], 400);
}

// ── Construire un nom de fichier sûr ──
$type   = preg_replace('/[^a-z0-9]/', '', strtolower($_POST['type']   ?? 'file'));
$refId  = preg_replace('/[^a-z0-9_-]/', '', $_POST['ref_id'] ?? 'x');
$origRaw = basename($file['name']);
$origSafe = preg_replace('/[^a-z0-9._-]/i', '_', $origRaw);
$origSafe = strtolower(substr($origSafe, 0, 80));

$filename = ($type ?: 'file') . '_' . ($refId ?: 'x') . '_' . date('Ymd_His') . '_' . $origSafe;
$dest     = $mediaDir . $filename;

if (!move_uploaded_file($file['tmp_name'], $dest)) {
    jsonResponse(['error' => 'Échec de déplacement du fichier (permissions ?)'], 500);
}

// ── Construire l'URL publique ──
$protocol = (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off') ? 'https' : 'http';
$host     = $_SERVER['HTTP_HOST'] ?? 'localhost';

// Chemin relatif de /uploads/media/ depuis la racine web
$docRoot   = rtrim(str_replace('\\', '/', $_SERVER['DOCUMENT_ROOT']), '/');
$mediaReal = rtrim(str_replace('\\', '/', realpath($mediaDir)), '/');
$relMedia  = str_replace($docRoot, '', $mediaReal);
if (!$relMedia) $relMedia = '/uploads/media';

$url = $protocol . '://' . $host . $relMedia . '/' . $filename;

jsonResponse([
    'success'  => true,
    'url'      => $url,
    'filename' => $filename,
    'size_kb'  => round($file['size'] / 1024, 1),
    'mime'     => $mime,
]);
