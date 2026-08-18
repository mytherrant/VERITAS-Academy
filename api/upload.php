<?php
require_once __DIR__ . '/_json_boot.php'; // display_errors=0 + purge des parasites avant le JSON (voir _json_boot.php)
/**
 * VÉRITAS Academy — api/upload.php
 * © 2024-2026 Jacques Miterand TAKOU (Mythe Errant). Tous droits réservés.
 * Œuvre protégée — Loi n° 2000/011 + Convention de Berne.
 * Reproduction interdite sans accord écrit. Contrefaçon : 5-10 ans prison +
 * 500 000 à 10 000 000 FCFA d'amende. contact@veritas-school.com
 *
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
// Sans fileinfo, le MIME réel est invérifiable : on REFUSE (fail-closed).
// Un envoi accepté sans contrôle de type, c'est un webshell déposé dans uploads/.
if (!class_exists('finfo')) {
    @file_put_contents(__DIR__.'/data/_security_log.txt',
        date('c')." [UPLOAD_BLOCKED] extension fileinfo absente — envoi refusé
", FILE_APPEND);
    http_response_code(503);
    echo json_encode(['ok'=>false,'error'=>"Envoi indisponible : le serveur ne peut pas vérifier le type du fichier."]);
    exit;
}
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

/* 🔐 Étape 2 — STORE PROTÉGÉ : folder='protected' → uploads/protected/ (deny-all),
   servi UNIQUEMENT par api/content.php après vérification d'abonnement. Aucune URL
   publique renvoyée. Les autres folders restent publics (galerie, logos, etc.). */
$isProtected = ($folder === 'protected');

/* 🔐 v1.17 — PAGES D'UN LIVRE PROTÉGÉ : folder='bookpages'
   → uploads/protected/books/<bookId>/pNNN.jpg

   Le nom de fichier est IMPOSÉ par api/secure_pdf.php, qui cherche p001.jpg,
   p002.jpg… Le nom aléatoire utilisé pour tous les autres uploads rendrait ces
   pages invisibles au lecteur : le dossier paraîtrait rempli côté FTP et le
   livre resterait obstinément « non préparé » côté élève. */
$isBookPage = ($folder === 'bookpages');
$bookId = ''; $pageNo = 0;
if ($isBookPage) {
    $bookId = preg_replace('/[^a-zA-Z0-9_\-]/', '', (string) ($_POST['bookId'] ?? ''));
    $pageNo = (int) ($_POST['page'] ?? 0);
    if ($bookId === '') {
        http_response_code(400); echo json_encode(['ok'=>false,'error'=>'bookId requis']); exit;
    }
    if ($pageNo < 1 || $pageNo > 2000) {
        http_response_code(400); echo json_encode(['ok'=>false,'error'=>'Numéro de page hors bornes (1-2000)']); exit;
    }
    if ($mime !== 'image/jpeg') {
        http_response_code(400); echo json_encode(['ok'=>false,'error'=>'Les pages doivent être des JPEG']); exit;
    }
}

if ($isProtected || $isBookPage) {
    $protRoot = dirname(__DIR__) . '/uploads/protected/';
    if (!is_dir($protRoot)) mkdir($protRoot, 0750, true);
    $htaccess = $protRoot . '.htaccess';
    if (!file_exists($htaccess)) {
        file_put_contents($htaccess,
            "# Contenu PREMIUM — aucun accès HTTP direct ; servi via api/content.php après contrôle de droits.\n".
            "Require all denied\n".
            "<IfModule !mod_authz_core.c>\nOrder deny,allow\nDeny from all\n</IfModule>\n".
            "Options -Indexes -ExecCGI\n".
            "RemoveHandler .php .phtml .phar .cgi .pl .py\n".
            "<FilesMatch \"\\.(php|phtml|phar|cgi|pl|py|sh|asp|aspx|jsp|exe|bat)$\">\n  Require all denied\n</FilesMatch>\n"
        );
    }
    if ($isBookPage) {
        $uploadBase = $protRoot . 'books/' . $bookId . '/';
        if (!is_dir($uploadBase)) mkdir($uploadBase, 0750, true);
        /* Réexport d'un document plus court : sans purge, les pages du précédent
           survivraient (p007.jpg orpheline comptée par secure_pdf.php, donc lue
           comme la fin du nouveau document). Le client ne purge qu'à la page 1. */
        if (!empty($_POST['purge'])) {
            foreach (glob($uploadBase . 'p*.jpg') ?: [] as $old) @unlink($old);
        }
    } else {
        $uploadBase = $protRoot;
    }
} else {
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
}

/* Nom de fichier : imposé pour une page de livre, aléatoire partout ailleurs */
$name = $isBookPage
    ? sprintf('p%03d.jpg', $pageNo)
    : ('vt_' . bin2hex(random_bytes(8)) . '.' . $ext);
$dest = $uploadBase . $name;

if (!move_uploaded_file($file['tmp_name'], $dest)) {
    http_response_code(500); echo json_encode(['ok'=>false,'error'=>'Impossible de déplacer le fichier']); exit;
}
chmod($dest, ($isProtected || $isBookPage) ? 0640 : 0644);

if ($isBookPage) {
    // On renvoie le décompte réel du dossier : le client affiche ainsi une
    // progression fondée sur ce que le serveur a VRAIMENT écrit, pas sur le
    // nombre de requêtes qu'il croit avoir réussies.
    $count = count(glob($uploadBase . 'p*.jpg') ?: []);
    echo json_encode([
        'ok'=>true, 'bookpage'=>true, 'page'=>$pageNo, 'name'=>$name,
        'pages'=>$count, 'dir'=>'uploads/protected/books/'.$bookId, 'size'=>$file['size']
    ]);
} elseif ($isProtected) {
    // Pas d'URL publique : le client stocke fichierProtege et lit via content.php.
    echo json_encode(['ok'=>true,'protected'=>true,'fichierProtege'=>$name,'name'=>$name,'size'=>$file['size'],'mime'=>$mime]);
} else {
    $url = 'https://veritas-school.com/uploads/veritas/' . $folder . '/' . $name;
    echo json_encode(['ok'=>true,'url'=>$url,'name'=>$name,'size'=>$file['size'],'mime'=>$mime]);
}
