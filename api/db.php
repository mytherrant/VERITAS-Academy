<?php
/**
 * VÉRITAS Academy — api/db.php
 * GET  → renvoie le JSON courant (authentification requise)
 * POST application/json → sauvegarde la DB synchronisée
 *
 * 🔐 SÉCURITÉ v1.2 :
 *   - Authentification Bearer obligatoire (utilise config_sync.php → requireAuth)
 *   - Rate limiting : 60 requêtes par minute par IP
 *   - Audit log des accès suspects
 *   - Validation taille du payload
 */
require_once __DIR__ . '/config_sync.php';

// ── 🔐 Rate limiting simple basé sur IP (file plat, sans Redis) ──
$rateDir = __DIR__ . '/data/_rate/';
if (!is_dir($rateDir)) @mkdir($rateDir, 0750, true);
$ip = $_SERVER['HTTP_CF_CONNECTING_IP'] ?? $_SERVER['HTTP_X_FORWARDED_FOR'] ?? $_SERVER['REMOTE_ADDR'] ?? 'unknown';
$ip = preg_replace('/[^0-9a-fA-F:.,]/','', $ip);
$ipHash = substr(md5($ip), 0, 16);
$rateFile = $rateDir . 'db_' . $ipHash . '.txt';
$now = time();
$hits = [];
if (file_exists($rateFile)) {
    $hits = array_filter(explode("\n", file_get_contents($rateFile)), function($t) use ($now){
        return $t && ($now - intval($t)) < 60;
    });
}
if (count($hits) >= 60) {
    http_response_code(429);
    echo json_encode(['ok'=>false,'error'=>'Trop de requêtes — réessayez dans 1 minute']);
    // Log l'attaque potentielle
    @file_put_contents(__DIR__.'/data/_security_log.txt',
        date('c').' [RATE_LIMIT] db.php ip='.$ip.' hits='.count($hits)."\n", FILE_APPEND);
    exit;
}
$hits[] = $now;
@file_put_contents($rateFile, implode("\n", $hits));

// ── Headers de sécurité ──
header('Strict-Transport-Security: max-age=31536000; includeSubDomains');
header('X-Content-Type-Options: nosniff');
header('X-Frame-Options: SAMEORIGIN');
header('Referrer-Policy: strict-origin-when-cross-origin');
header('Permissions-Policy: geolocation=(), microphone=(), camera=()');
// On a déjà CORS depuis config_sync.php
header('Content-Type: application/json; charset=utf-8');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') { http_response_code(204); exit; }

// ── 🔐 Authentification OBLIGATOIRE (correction faille critique v1.2) ──
requireAuth();

$DATA_DIR = dirname(__DIR__) . '/data';
$DB_FILE  = $DATA_DIR . '/veritas_db.json';
if (!is_dir($DATA_DIR)) mkdir($DATA_DIR, 0750, true);
// 🔐 v1.2.1 : garantir la protection du dossier data/ MÊME si le déploiement l'oublie.
//    Sans cela, /data/veritas_db.json serait téléchargeable directement (toute la base, sans token).
if (!is_file($DATA_DIR . '/.htaccess')) {
    @file_put_contents($DATA_DIR . '/.htaccess',
        "# Aucun accès HTTP direct aux données VÉRITAS\nRequire all denied\n<IfModule !mod_authz_core.c>\nOrder deny,allow\nDeny from all\n</IfModule>\n");
}
if (!is_file($DATA_DIR . '/index.php')) {
    @file_put_contents($DATA_DIR . '/index.php', "<?php http_response_code(403); exit;\n");
}

/* GET */
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    if (file_exists($DB_FILE)) {
        $c = file_get_contents($DB_FILE);
        json_decode($c);
        echo (json_last_error() === JSON_ERROR_NONE) ? $c : '{}';
    } else { echo '{}'; }
    exit;
}

/* POST */
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $raw = file_get_contents('php://input');
    if (!$raw) { http_response_code(400); echo json_encode(['ok'=>false,'error'=>'Corps vide']); exit; }
    if (strlen($raw) > 20*1024*1024) { http_response_code(413); echo json_encode(['ok'=>false,'error'=>'Données > 20 Mo']); exit; }
    $data = json_decode($raw, true);
    if ($data === null) { http_response_code(400); echo json_encode(['ok'=>false,'error'=>'JSON invalide']); exit; }
    // ── 🔐 Détecter et BLOQUER les payloads contenant des mots de passe en clair ──
    if (preg_match('/"pwd"\s*:\s*"(?!S256\$|S256!|S256-)[^"]{1,40}"/', $raw, $m)) {
        @file_put_contents(__DIR__.'/data/_security_log.txt',
            date('c').' [PLAIN_PWD_REJECTED] db.php ip='.$ip.' pattern='.substr($m[0],0,80)."\n", FILE_APPEND);
        http_response_code(400);
        echo json_encode(['ok'=>false,'error'=>'Mot de passe en clair détecté — refus pour sécurité']);
        exit;
    }
    $tmp = $DB_FILE . '.tmp';
    if (file_put_contents($tmp, $raw, LOCK_EX) === false) { http_response_code(500); echo json_encode(['ok'=>false,'error'=>'Écriture impossible']); exit; }
    if (!rename($tmp, $DB_FILE)) { @unlink($tmp); http_response_code(500); echo json_encode(['ok'=>false,'error'=>'Rename échoué']); exit; }
    // Log accès succès (rotation à 1000 lignes)
    $logF = __DIR__.'/data/_access_log.txt';
    @file_put_contents($logF, date('c').' SAVE '.round(strlen($raw)/1024).'kb ip='.$ip."\n", FILE_APPEND);
    if (file_exists($logF) && filesize($logF) > 100000) {
        $lines = file($logF);
        @file_put_contents($logF, implode('', array_slice($lines, -500)));
    }
    echo json_encode(['ok'=>true,'size_ko'=>round(strlen($raw)/1024,1),'lastModified'=>$data['lastModified']??null,'time'=>time()]);
    exit;
}

http_response_code(405); echo json_encode(['ok'=>false,'error'=>'Méthode non autorisée']);
