<?php
/**
 * api/campus/_bootstrap.php — Socle commun : sécurité HTTP, CORS, erreurs, PDO,
 * lecture du corps de requête, et helpers de réponse JSON.
 * © 2024-2026 Jacques Miterand TAKOU (Mythe Errant). Tous droits réservés.
 *
 * À inclure EN PREMIER par tout endpoint (index.php, migrate.php).
 */
declare(strict_types=1);

// Surcharges propres au serveur (gitignore, absent du depot), PUIS les valeurs
// par defaut. L'ordre compte : _defaults.php ne pose que ce qui manque.
@include_once __DIR__ . '/_config.php';
require_once __DIR__ . '/_defaults.php';

// ── Durcissement : pas de fuite d'erreurs PHP dans la réponse (sécurité). ──
// (Mémoire projet : display_errors ON en prod était un défaut à corriger.)
error_reporting(E_ALL);
ini_set('display_errors', '0');
ini_set('log_errors', '1');

header('Content-Type: application/json; charset=utf-8');
header('X-Content-Type-Options: nosniff');
header('Referrer-Policy: no-referrer');
header('Cache-Control: no-store, no-cache, must-revalidate, max-age=0');

// ── CORS : allowlist stricte (même logique que config_sync.php). ──
$CMP_ALLOWED_ORIGINS = [
    'https://veritas-campus.com',
    'https://www.veritas-campus.com',
    'https://veritas-school.com',
    'https://www.veritas-school.com',
    'http://localhost:8000',
    'https://localhost',
    'capacitor://localhost',
];
$cmp_origin = $_SERVER['HTTP_ORIGIN'] ?? '';
$cmp_host   = $_SERVER['HTTP_HOST'] ?? '';
// On autorise aussi toute origine en sous-domaine du domaine racine (slug.<racine>)
// pour le white-label par sous-domaine (https://ecole-x.veritas-campus.com).
$cmp_origin_ok = in_array($cmp_origin, $CMP_ALLOWED_ORIGINS, true);
if (!$cmp_origin_ok && $cmp_origin !== '') {
    $cmp_oh = parse_url($cmp_origin, PHP_URL_HOST);
    if (is_string($cmp_oh) && str_ends_with($cmp_oh, '.' . CAMPUS_ROOT_DOMAIN)) {
        $cmp_origin_ok = true;
    }
}
if ($cmp_origin_ok) {
    header('Access-Control-Allow-Origin: ' . $cmp_origin);
    header('Vary: Origin');
}
header('Access-Control-Allow-Methods: GET, POST, PUT, PATCH, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Tenant, X-Requested-With');
header('Access-Control-Max-Age: 86400');

if (($_SERVER['REQUEST_METHOD'] ?? 'GET') === 'OPTIONS') {
    http_response_code(204);
    exit;
}

// ── Réponses JSON ──
function cmp_json($data, int $code = 200): void {
    http_response_code($code);
    echo json_encode($data, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    exit;
}
function cmp_ok($data = [], int $code = 200): void {
    if (is_array($data)) { $data = array_merge(['ok' => true], $data); }
    cmp_json($data, $code);
}
function cmp_fail(string $message, int $code = 400, array $extra = []): void {
    cmp_json(array_merge(['ok' => false, 'error' => $message], $extra), $code);
}

// ── Erreurs/exceptions non capturées → JSON 500 propre (jamais de stack en clair). ──
set_exception_handler(function (Throwable $e): void {
    error_log('[campus] ' . $e->getMessage() . ' @ ' . $e->getFile() . ':' . $e->getLine());
    cmp_fail('Erreur serveur interne.', 500);
});
set_error_handler(function (int $no, string $str, string $file = '', int $line = 0): bool {
    if (!(error_reporting() & $no)) { return false; }
    throw new ErrorException($str, 0, $no, $file, $line);
});

// ── Corps de requête (JSON ou form) ──
function cmp_body(): array {
    static $cache = null;
    if ($cache !== null) { return $cache; }
    $raw = file_get_contents('php://input');
    $data = [];
    if ($raw !== '' && $raw !== false) {
        $j = json_decode($raw, true);
        if (is_array($j)) { $data = $j; }
    }
    if (!$data && !empty($_POST)) { $data = $_POST; }
    $cache = $data;
    return $cache;
}
function cmp_param(string $key, $default = null) {
    $b = cmp_body();
    if (array_key_exists($key, $b)) { return $b[$key]; }
    if (isset($_GET[$key])) { return $_GET[$key]; }
    return $default;
}
function cmp_client_ip(): string {
    return substr((string) ($_SERVER['REMOTE_ADDR'] ?? ''), 0, 45);
}

/**
 * Limitation de débit par IP, sur fichier plat.
 *
 * Renvoie true si la limite est DÉPASSÉE (l'appelant répond alors 429). Le
 * compteur vit dans le répertoire temporaire du système : toujours accessible
 * en écriture, y compris sur une install mono-établissement posée par FTP, et
 * sans rien ajouter à l'arborescence déployée.
 *
 * Best-effort assumé : si l'écriture échoue, on laisse passer. Une limite de
 * débit protège d'un abus, elle ne doit pas devenir un point de panne.
 */
function cmp_rate_exceeded(string $prefix, int $maxParMinute): bool {
    try {
        $dir = rtrim(sys_get_temp_dir(), '/\\') . DIRECTORY_SEPARATOR . 'veritas_campus_rl';
        if (!is_dir($dir)) { @mkdir($dir, 0700, true); }
        $f = $dir . DIRECTORY_SEPARATOR . $prefix . '_' . substr(md5(cmp_client_ip()), 0, 16) . '.txt';
        $now = time();
        $hits = [];
        if (is_file($f)) {
            foreach (explode("\n", (string) @file_get_contents($f)) as $t) {
                if ($t !== '' && ($now - (int) $t) < 60) { $hits[] = $t; }
            }
        }
        if (count($hits) >= $maxParMinute) { return true; }
        $hits[] = (string) $now;
        @file_put_contents($f, implode("\n", $hits), LOCK_EX);
    } catch (Throwable $e) {
        error_log('[campus][rate] ' . $e->getMessage());
    }
    return false;
}

// ── PDO (singleton paresseux) ──
function cmp_pdo(): PDO {
    static $pdo = null;
    if ($pdo instanceof PDO) { return $pdo; }
    if (CAMPUS_DB_PASS === '') {
        cmp_fail('Base indisponible : MYSQL_PASS non défini dans api/payment_config.php.', 503);
    }
    try {
        $pdo = new PDO(
            'mysql:host=' . CAMPUS_DB_HOST . ';dbname=' . CAMPUS_DB_NAME . ';charset=utf8mb4',
            CAMPUS_DB_USER,
            CAMPUS_DB_PASS,
            [
                PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
                PDO::ATTR_EMULATE_PREPARES   => false,
                PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            ]
        );
    } catch (Throwable $e) {
        error_log('[campus] PDO: ' . $e->getMessage());
        cmp_fail('Base de données indisponible.', 503);
    }
    return $pdo;
}
