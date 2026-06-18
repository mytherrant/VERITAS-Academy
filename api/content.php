<?php
/**
 * api/content.php — Porte de diffusion du CONTENU PREMIUM (Étape 2, S3 v1.2.x)
 * © 2024-2026 Jacques Miterand TAKOU (Mythe Errant). Tous droits réservés.
 * Œuvre protégée — Loi camerounaise n° 2000/011 + Convention de Berne.
 * Reproduction interdite sans accord écrit. Contrefaçon : 5-10 ans prison +
 * 500 000 à 10 000 000 FCFA d'amende. contact@veritas-school.com
 *
 * BUT — ne livrer un média e-learning (PDF, vidéo, audio, image) QUE si le
 * demandeur est authentifié ET possède un plan couvrant ce contenu. Remplace
 * l'injection de `data:` URI dans le DOM (extractibles en 1 clic) par une
 * diffusion contrôlée côté serveur.
 *
 * USAGE
 *   GET  /api/content.php?id=<contenuId>&token=<token>      (pour <video src> / <embed>)
 *   POST /api/content.php   {id, login, password}           (repli sans token)
 *
 * AUTH      — token par compte (vrt_verify_token) OU login+mot de passe.
 * DROITS    — vrt_account_can_access (réplique exacte de la logique client).
 * SÉCURITÉ  — rate-limit IP, anti path-traversal (realpath confiné à uploads/),
 *             en-têtes private/no-store, support Range (lecture vidéo/iOS),
 *             refus des contenus encore stockés en data:/IndexedDB.
 *
 * STOCKAGE ATTENDU — le contenu doit pointer vers un fichier serveur via, par
 *   ordre de préférence :
 *     contenu.fichierProtege  → uploads/protected/<nom>   (recommandé, non public)
 *     contenu.fichierUrl      → .../uploads/...           (compat existant)
 *   Les champs contenu.fichierData (data:) et contenu.idbKey (IndexedDB local)
 *   ne sont PAS diffusables ici : migrer le média vers un fichier serveur.
 */
declare(strict_types=1);

// Tampon défensif : _auth_lib inclut payment_config.php, qui émet des en-têtes
// (et pourrait émettre un caractère parasite, ex. un saut de ligne après la balise PHP fermante).
// On capture toute sortie d'inclusion pour la jeter AVANT de diffuser le binaire,
// sinon le moindre octet parasite corromprait le fichier servi.
ob_start();

require_once __DIR__ . '/_auth_lib.php';

// ── CORS (allowlist — gérée localement, surtout PAS de Content-Type JSON forcé) ──
$__c_allowed = [
    'https://veritas-school.com', 'https://www.veritas-school.com',
    'http://localhost:8000', 'https://localhost', 'capacitor://localhost',
];
$__c_origin = $_SERVER['HTTP_ORIGIN'] ?? '';
if (in_array($__c_origin, $__c_allowed, true)) {
    header('Access-Control-Allow-Origin: ' . $__c_origin);
    header('Vary: Origin');
}
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization, Range');
header('X-Content-Type-Options: nosniff');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') { http_response_code(204); exit; }

function content_err(int $code, string $msg): void {
    while (ob_get_level() > 0) { ob_end_clean(); } // jeter tout résidu d'inclusion
    http_response_code($code);
    header('Content-Type: application/json; charset=utf-8');
    echo json_encode(['ok' => false, 'error' => $msg], JSON_UNESCAPED_UNICODE);
    exit;
}

// ── Rate-limit (anti aspiration de masse) ──
if (vrt_rate_exceeded('content', 90)) {
    content_err(429, 'Trop de requêtes — réessayez dans 1 minute');
}

// ── Récupérer id + identité ──
$method = $_SERVER['REQUEST_METHOD'];
$id = ''; $token = ''; $login = ''; $pass = '';
if ($method === 'GET') {
    $id    = (string) ($_GET['id'] ?? '');
    $token = (string) ($_GET['token'] ?? '');
} elseif ($method === 'POST') {
    $in = json_decode((string) file_get_contents('php://input'), true);
    if (is_array($in)) {
        $id    = (string) ($in['id'] ?? '');
        $token = (string) ($in['token'] ?? '');
        $login = trim((string) ($in['login'] ?? ''));
        $pass  = (string) ($in['password'] ?? '');
    }
} else {
    content_err(405, 'Méthode non autorisée');
}
if ($id === '') content_err(400, 'id requis');

$db = vrt_load_db();
if (!is_array($db)) content_err(503, 'Base indisponible');

// ── Authentifier : token d'abord, sinon login+mot de passe ──
$acc = null;
if ($token !== '') {
    $res = vrt_verify_token($token, $db);
    if ($res !== null) $acc = $res['acc'];
}
if ($acc === null && $login !== '' && $pass !== '') {
    $found = vrt_find_account($db, $login);
    if ($found !== null) {
        $need = false;
        if (vrt_verify_password($pass, (string) ($found['acc']['pwd'] ?? ''), (string) $found['acc']['user'], $need)) {
            $acc = $found['acc'];
        }
    }
}
if ($acc === null) {
    @file_put_contents(__DIR__ . '/data/_security_log.txt',
        date('c') . ' [CONTENT_AUTH_FAIL] ip=' . vrt_client_ip() . ' id=' . substr($id, 0, 40) . "\n", FILE_APPEND);
    content_err(401, 'Authentification requise');
}

// ── Trouver le contenu ──
$contenu = null;
foreach (($db['elearning']['contenus'] ?? []) as $c) {
    if (is_array($c) && (string) ($c['id'] ?? '') === $id) { $contenu = $c; break; }
}
if ($contenu === null) content_err(404, 'Contenu introuvable');

// ── Vérifier les droits ──
if (!vrt_account_can_access($acc, $contenu, $db)) {
    @file_put_contents(__DIR__ . '/data/_security_log.txt',
        date('c') . ' [CONTENT_FORBIDDEN] ip=' . vrt_client_ip()
        . ' user=' . substr((string) ($acc['user'] ?? ''), 0, 40) . ' id=' . $id . "\n", FILE_APPEND);
    content_err(403, 'Accès réservé aux abonnés du plan correspondant');
}

// ── Résoudre le chemin du fichier (confiné à uploads/) ──
$uploadsBase = realpath(dirname(__DIR__) . '/uploads');
if ($uploadsBase === false) content_err(503, 'Stockage indisponible');

$path = null;
if (!empty($contenu['fichierProtege'])) {
    $cand = dirname(__DIR__) . '/uploads/protected/' . basename((string) $contenu['fichierProtege']);
    $path = realpath($cand);
} elseif (!empty($contenu['fichierUrl'])) {
    // Mapper une URL .../uploads/<reste> vers le chemin local, sans traversal.
    $urlPath = parse_url((string) $contenu['fichierUrl'], PHP_URL_PATH) ?: '';
    $pos = strpos($urlPath, '/uploads/');
    if ($pos !== false) {
        $rel = substr($urlPath, $pos + strlen('/uploads/'));
        $rel = str_replace('\\', '/', $rel);
        // Nettoyer chaque segment (pas de .. ni de chemins absolus).
        $segs = array_filter(explode('/', $rel), function ($s) { return $s !== '' && $s !== '.' && $s !== '..'; });
        $cand = dirname(__DIR__) . '/uploads/' . implode('/', $segs);
        $path = realpath($cand);
    }
} elseif (!empty($contenu['fichierData']) || !empty($contenu['idbKey'])) {
    content_err(409, 'Ce contenu est encore stocké en local (data:/IndexedDB). Republiez-le en fichier serveur pour activer la diffusion protégée.');
}

if ($path === false || $path === null || strpos($path, $uploadsBase) !== 0 || !is_file($path)) {
    content_err(404, 'Fichier indisponible');
}

// ── Diffusion (avec support Range pour la vidéo / iOS) ──
$finfo = new finfo(FILEINFO_MIME_TYPE);
$mime  = $finfo->file($path) ?: 'application/octet-stream';
$size  = filesize($path);

// Journaliser l'accès légitime (best-effort).
@file_put_contents(__DIR__ . '/data/_access_log.txt',
    date('c') . ' CONTENT_SERVE user=' . substr((string) ($acc['user'] ?? ''), 0, 40)
    . ' id=' . $id . ' ' . round($size / 1024) . 'ko ip=' . vrt_client_ip() . "\n", FILE_APPEND);

header('Content-Type: ' . $mime);
header('Cache-Control: private, no-store, max-age=0');
header('Pragma: no-cache');
header('Content-Disposition: inline; filename="' . preg_replace('/[^\w.\-]/', '_', basename($path)) . '"');
header('Accept-Ranges: bytes');

$start = 0; $end = $size - 1;
$range = $_SERVER['HTTP_RANGE'] ?? '';
if ($range !== '' && preg_match('/bytes=(\d*)-(\d*)/', $range, $m)) {
    if ($m[1] !== '') $start = (int) $m[1];
    if ($m[2] !== '') $end = (int) $m[2];
    if ($start > $end || $start >= $size) {
        http_response_code(416);
        header('Content-Range: bytes */' . $size);
        exit;
    }
    if ($end >= $size) $end = $size - 1;
    http_response_code(206);
    header('Content-Range: bytes ' . $start . '-' . $end . '/' . $size);
}

$length = $end - $start + 1;
header('Content-Length: ' . $length);

// Vider tout tampon de sortie pour ne pas charger le fichier en RAM.
while (ob_get_level() > 0) { ob_end_clean(); }

$fp = fopen($path, 'rb');
if ($fp === false) { exit; }
fseek($fp, $start);
$remaining = $length;
$chunk = 8192;
while ($remaining > 0 && !feof($fp)) {
    $read = ($remaining > $chunk) ? $chunk : $remaining;
    $buf = fread($fp, (int) $read);
    if ($buf === false) break;
    echo $buf;
    flush();
    $remaining -= strlen($buf);
}
fclose($fp);
exit;
