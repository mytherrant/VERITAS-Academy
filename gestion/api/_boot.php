<?php
/**
 * gestion/api/_boot.php — Socle de VÉRITAS Gestion (gestion.veritas-school.com).
 * © 2024-2026 Jacques Miterand TAKOU (Mythe Errant). Tous droits réservés.
 *
 * En-têtes de sécurité, CORS, erreurs → JSON, PDO (MySQL en ligne, SQLite sur
 * le poste de développement), lecture du corps et réponses JSON.
 * Repris du socle éprouvé de api/campus/_bootstrap.php, préfixe g_.
 *
 * À inclure EN PREMIER par tout point d'entrée (index.php, install.php).
 */
declare(strict_types=1);

date_default_timezone_set('Africa/Douala');

// Surcharges locales (gitignorées), puis les secrets du site principal.
// Le sous-domaine gestion. pointe sur le dossier gestion/ du MÊME hébergement :
// api/payment_config.php (MYSQL_PASS) est donc à deux crans au-dessus.
@include_once __DIR__ . '/_config.php';
@include_once dirname(__DIR__, 2) . '/api/payment_config.php';

if (!defined('G_DB_DRIVER')) define('G_DB_DRIVER', 'mysql');
if (!defined('G_DB_HOST'))   define('G_DB_HOST', '185.98.131.160');
if (!defined('G_DB_NAME'))   define('G_DB_NAME', 'verit2781684');
if (!defined('G_DB_USER'))   define('G_DB_USER', 'verit2781684');
if (!defined('G_DB_PASS'))   define('G_DB_PASS', defined('MYSQL_PASS') ? MYSQL_PASS : '');
if (!defined('G_SQLITE_FILE')) define('G_SQLITE_FILE', __DIR__ . '/data/gestion.sqlite');
// Jeton d'installation : FAIL-CLOSED (valeur aléatoire inconnue s'il n'est pas posé).
if (!defined('G_INSTALL_TOKEN')) {
    define('G_INSTALL_TOKEN', defined('CAMPUS_INSTALL_TOKEN') ? CAMPUS_INSTALL_TOKEN : bin2hex(random_bytes(32)));
}
if (!defined('G_SESSION_JOURS'))   define('G_SESSION_JOURS', 30);
if (!defined('G_BCRYPT_COST'))     define('G_BCRYPT_COST', 12);
if (!defined('G_LOGIN_FENETRE_MIN')) define('G_LOGIN_FENETRE_MIN', 15);
if (!defined('G_LOGIN_MAX_IP'))      define('G_LOGIN_MAX_IP', 10);
if (!defined('G_LOGIN_MAX_COMPTE'))  define('G_LOGIN_MAX_COMPTE', 5);

error_reporting(E_ALL);
ini_set('display_errors', '0');
ini_set('log_errors', '1');

header('Content-Type: application/json; charset=utf-8');
header('X-Content-Type-Options: nosniff');
header('Referrer-Policy: no-referrer');
header('Cache-Control: no-store, no-cache, must-revalidate, max-age=0');

$G_ORIGINES = [
    'https://gestion.veritas-school.com',
    'http://localhost:8000',
    'http://127.0.0.1:8000',
];
$g_origine = $_SERVER['HTTP_ORIGIN'] ?? '';
if (in_array($g_origine, $G_ORIGINES, true)) {
    header('Access-Control-Allow-Origin: ' . $g_origine);
    header('Vary: Origin');
    header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
    header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Centre');
    header('Access-Control-Max-Age: 86400');
}
if (($_SERVER['REQUEST_METHOD'] ?? 'GET') === 'OPTIONS') {
    http_response_code(204);
    exit;
}

function g_json($data, int $code = 200): void {
    http_response_code($code);
    echo json_encode($data, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    exit;
}
function g_ok(array $data = [], int $code = 200): void {
    g_json(array_merge(['ok' => true], $data), $code);
}
function g_fail(string $message, int $code = 400, array $extra = []): void {
    g_json(array_merge(['ok' => false, 'error' => $message], $extra), $code);
}

set_exception_handler(function (Throwable $e): void {
    error_log('[gestion] ' . $e->getMessage() . ' @ ' . $e->getFile() . ':' . $e->getLine());
    g_fail('Erreur serveur interne.', 500);
});
set_error_handler(function (int $no, string $str, string $file = '', int $line = 0): bool {
    if (!(error_reporting() & $no)) { return false; }
    throw new ErrorException($str, 0, $no, $file, $line);
});

function g_body(): array {
    static $cache = null;
    if ($cache !== null) { return $cache; }
    $raw = file_get_contents('php://input');
    $data = [];
    if ($raw !== '' && $raw !== false) {
        $j = json_decode($raw, true);
        if (is_array($j)) { $data = $j; }
        // Un corps JSON illisible (accents mal encodés…) ne doit pas passer pour
        // un formulaire vide : l'erreur serait trompeuse (« champ obligatoire »).
        elseif (stripos((string) ($_SERVER['CONTENT_TYPE'] ?? ''), 'json') !== false) {
            g_fail('Requête illisible (JSON invalide ou mal encodé).', 400);
        }
    }
    if (!$data && !empty($_POST)) { $data = $_POST; }
    return $cache = $data;
}
function g_param(string $cle, $defaut = null) {
    $b = g_body();
    if (array_key_exists($cle, $b)) { return $b[$cle]; }
    if (isset($_GET[$cle])) { return $_GET[$cle]; }
    return $defaut;
}
function g_ip(): string {
    return substr((string) ($_SERVER['REMOTE_ADDR'] ?? ''), 0, 45);
}
/** Horodatage local (Douala) au format SQL — calculé en PHP pour rester portable MySQL/SQLite. */
function g_now(string $decalage = ''): string {
    return (new DateTimeImmutable($decalage === '' ? 'now' : $decalage))->format('Y-m-d H:i:s');
}
/** Identifiant aléatoire (même forme que ceux créés hors ligne par le téléphone). */
function g_id(): string {
    return bin2hex(random_bytes(10));
}
/**
 * Révision monotone (millisecondes) posée sur chaque ligne écrite. Le téléphone
 * tire « tout ce qui a changé depuis sa dernière révision » avec un recouvrement
 * de quelques secondes : deux écritures dans la même milliseconde ne se perdent pas.
 */
function g_rev(): int {
    return (int) floor(microtime(true) * 1000);
}

/** Nom comparable : sans accents, minuscules, mots triés (« NGONO Marie » = « marie ngono »). */
function g_cle_nom(string $s): string {
    $s = strtr($s, [
        'À'=>'a','Á'=>'a','Â'=>'a','Ä'=>'a','Ã'=>'a','à'=>'a','á'=>'a','â'=>'a','ä'=>'a','ã'=>'a',
        'Ç'=>'c','ç'=>'c','È'=>'e','É'=>'e','Ê'=>'e','Ë'=>'e','è'=>'e','é'=>'e','ê'=>'e','ë'=>'e',
        'Ì'=>'i','Í'=>'i','Î'=>'i','Ï'=>'i','ì'=>'i','í'=>'i','î'=>'i','ï'=>'i','Ñ'=>'n','ñ'=>'n',
        'Ò'=>'o','Ó'=>'o','Ô'=>'o','Ö'=>'o','Õ'=>'o','ò'=>'o','ó'=>'o','ô'=>'o','ö'=>'o','õ'=>'o',
        'Ù'=>'u','Ú'=>'u','Û'=>'u','Ü'=>'u','ù'=>'u','ú'=>'u','û'=>'u','ü'=>'u','Ÿ'=>'y','ÿ'=>'y',
        'Œ'=>'oe','œ'=>'oe','Æ'=>'ae','æ'=>'ae',
    ]);
    $mots = preg_split('/[^a-z0-9]+/', strtolower($s), -1, PREG_SPLIT_NO_EMPTY);
    sort($mots);
    return implode(' ', $mots);
}

/**
 * Téléphone camerounais → 9 chiffres (« +237 697 63 77 39 » → « 697637739 »).
 * Vide reste vide. Renvoie null si le numéro est invalide.
 */
function g_tel(?string $t): ?string {
    $d = preg_replace('/\D+/', '', (string) $t);
    if ($d === '') { return ''; }
    if (strlen($d) === 12 && strncmp($d, '237', 3) === 0) { $d = substr($d, 3); }
    if (strlen($d) === 14 && strncmp($d, '00237', 5) === 0) { $d = substr($d, 5); }
    return preg_match('/^[26]\d{8}$/', $d) ? $d : null;
}

function g_pdo(): PDO {
    static $pdo = null;
    if ($pdo instanceof PDO) { return $pdo; }
    $opts = [
        PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
    ];
    try {
        if (G_DB_DRIVER === 'sqlite') {
            $dir = dirname(G_SQLITE_FILE);
            if (!is_dir($dir)) { @mkdir($dir, 0700, true); }
            $pdo = new PDO('sqlite:' . G_SQLITE_FILE, null, null, $opts);
            $pdo->exec('PRAGMA foreign_keys = ON');
            $pdo->exec('PRAGMA journal_mode = WAL');
        } else {
            if (G_DB_PASS === '') {
                g_fail('Base indisponible : MYSQL_PASS non défini dans api/payment_config.php.', 503);
            }
            $opts[PDO::ATTR_EMULATE_PREPARES] = false;
            $pdo = new PDO(
                'mysql:host=' . G_DB_HOST . ';dbname=' . G_DB_NAME . ';charset=utf8mb4',
                G_DB_USER, G_DB_PASS, $opts
            );
        }
    } catch (Throwable $e) {
        error_log('[gestion] PDO: ' . $e->getMessage());
        g_fail('Base de données indisponible.', 503);
    }
    return $pdo;
}
