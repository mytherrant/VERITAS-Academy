<?php
/**
 * api/teacher_access.php — PORTE DE L'ESPACE ENSEIGNANT (Constellation VÉRITAS)
 * © 2024-2026 Jacques Miterand TAKOU (Mythe Errant). Tous droits réservés.
 * Œuvre protégée — Loi camerounaise n° 2000/011 + Convention de Berne.
 *
 * BUT — ne livrer les ressources RÉSERVÉES aux enseignants (Guide pédagogique,
 * grilles officielles, progressions, épreuves prêtes à photocopier) qu'à qui
 * présente un code enseignant valide. C'est l'équivalent du « site compagnon
 * enseignant » des grands éditeurs : l'élève n'y entre pas, et l'exclusivité des
 * corrigés du Guide est ce qui fait sa valeur.
 *
 * MODÈLE DE SÉCURITÉ
 *   1. Code enseignant haché en bcrypt dans api/payment_config.php (gitignoré).
 *      FAIL-CLOSED : sans code configuré, l'espace répond 503 — jamais ouvert.
 *   2. Jeton HMAC court (8 h) signé avec VRT_HMAC_KEY (api/_auth_lib.php).
 *   3. Les fichiers vivent dans uploads/protected/enseignant/ (hors web, deny).
 *      Aucune URL directe : tout passe par cet endpoint, chemin confiné realpath.
 *   4. Rate-limit IP + journal des ouvertures (data/_teacher_log.txt) : une fuite
 *      se trace jusqu'au code utilisé, et un code se révoque en le changeant.
 *
 * CONFIGURATION (api/payment_config.php) — au moins l'une des deux formes :
 *   define('TEACHER_CODE_HASH', '$2y$12$....');            // un code unique
 *   define('TEACHER_CODES', '[{"hash":"$2y$12$...","label":"Lycée de Bonabéri"}]');
 *   Générer un hash :  php -r "echo password_hash('MON-CODE', PASSWORD_BCRYPT, ['cost'=>12]);"
 *
 * DÉPÔT DES FICHIERS (par FTP, hors dépôt Git — le dépôt est public) :
 *   uploads/protected/enseignant/<slug>.pdf   (cf. catalogue plus bas)
 *   Une ressource absente est annoncée « bientôt disponible », jamais en erreur.
 *
 * USAGE
 *   POST {action:"login", code:"..."}          → {ok, token, label, exp}
 *   POST {action:"list",  token:"..."}         → {ok, resources:[{slug,label,groupe,dispo,taille}]}
 *   GET  ?res=<slug>&token=<jeton>             → le fichier (attachment, no-store)
 */
declare(strict_types=1);
require_once __DIR__ . '/_json_boot.php';
ob_start();
require_once __DIR__ . '/_auth_lib.php';

// ── CORS (allowlist stricte, comme content.php / secure_pdf.php) ──
$__t_allowed = [
    'https://veritas-school.com', 'https://www.veritas-school.com',
    'http://localhost:8000', 'http://localhost:3000', 'https://localhost', 'capacitor://localhost',
];
$__t_origin = $_SERVER['HTTP_ORIGIN'] ?? '';
if (in_array($__t_origin, $__t_allowed, true)) {
    header('Access-Control-Allow-Origin: ' . $__t_origin);
    header('Vary: Origin');
}
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
header('X-Content-Type-Options: nosniff');
header('Referrer-Policy: no-referrer');
// Rien de ce que sert cet endpoint ne doit entrer dans un index : ni la réponse
// JSON, ni le PDF du Guide. robots.txt bloque déjà /api/, mais un lien partagé
// suffirait à contourner le fichier — l'en-tête, lui, voyage avec la réponse.
header('X-Robots-Tag: noindex, nofollow, noarchive, nosnippet');
header('X-Frame-Options: DENY');

if (($_SERVER['REQUEST_METHOD'] ?? '') === 'OPTIONS') { http_response_code(204); exit; }

function ta_out(int $code, array $data): void {
    while (ob_get_level() > 0) { ob_end_clean(); }
    http_response_code($code);
    header('Content-Type: application/json; charset=utf-8');
    header('Cache-Control: private, no-store');
    echo json_encode($data, JSON_UNESCAPED_UNICODE);
    exit;
}
function ta_err(int $code, string $msg, string $tag = ''): void {
    ta_out($code, ['ok' => false, 'error' => $msg, 'code' => $tag]);
}
function ta_log(string $line): void {
    $dir = __DIR__ . '/data';
    if (!is_dir($dir)) { @mkdir($dir, 0775, true); }
    @file_put_contents($dir . '/_teacher_log.txt', date('c') . ' ' . $line . "\n", FILE_APPEND);
}

// ── Catalogue des ressources réservées ────────────────────────────────────────
// slug => [libellé, groupe, nom de fichier attendu dans uploads/protected/enseignant/]
function ta_catalogue(): array {
    $niveaux = [
        '6e'   => '6ᵉ',
        '5e'   => '5ᵉ',
        '4e'   => '4ᵉ',
        '3e'   => '3ᵉ (BEPC)',
        '2nde' => '2ⁿᵈᵉ A',
        '1ere' => '1ʳᵉ A (Probatoire)',
        'tle'  => 'Terminale A (BAC)',
    ];
    $cat = [];
    foreach ($niveaux as $k => $lab) {
        $cat['guide-' . $k] = ['Guide pédagogique — ' . $lab, 'Le livre du professeur', 'guide-' . $k . '.pdf'];
    }
    foreach ($niveaux as $k => $lab) {
        $cat['progression-' . $k] = ['Progression annuelle — ' . $lab, 'Préparer l\'année', 'progression-' . $k . '.pdf'];
    }
    foreach ($niveaux as $k => $lab) {
        $cat['epreuves-' . $k] = ['Épreuves prêtes à photocopier — ' . $lab, 'Évaluer', 'epreuves-' . $k . '.pdf'];
    }
    $cat['grilles-minesec'] = ['Grilles d\'évaluation officielles MINESEC', 'Évaluer', 'grilles-minesec.pdf'];
    $cat['integration-modeles'] = ['Tâches d\'intégration — productions modèles et barèmes', 'Évaluer', 'integration-modeles.pdf'];
    return $cat;
}

function ta_dir(): string {
    return dirname(__DIR__) . '/uploads/protected/enseignant';
}

// ── Verrouillage après échecs répétés (anti force brute) ──────────────────────
// Le rate-limit général plafonne le DÉBIT ; il n'empêche pas un attaquant patient
// d'essayer 40 codes par minute pendant des heures. On compte donc les échecs par
// IP sur une fenêtre glissante, et au-delà du seuil la porte reste fermée même
// avec le bon code.
const TA_MAX_ECHECS = 5;          // échecs tolérés…
const TA_FENETRE    = 900;        // …sur 15 minutes glissantes

function ta_fichier_echecs(): string {
    $dir = __DIR__ . '/data/_rate';
    if (!is_dir($dir)) { @mkdir($dir, 0750, true); }
    return $dir . '/teachfail_' . substr(hash('sha256', vrt_client_ip()), 0, 16) . '.txt';
}

function ta_echecs_recents(): int {
    $f = ta_fichier_echecs();
    if (!is_file($f)) return 0;
    $now = time();
    return count(array_filter(explode("\n", (string) @file_get_contents($f)),
        function ($t) use ($now) { return $t !== '' && ($now - (int) $t) < TA_FENETRE; }));
}

function ta_note_echec(): void {
    $f = ta_fichier_echecs();
    $now = time();
    $lignes = [];
    if (is_file($f)) {
        $lignes = array_filter(explode("\n", (string) @file_get_contents($f)),
            function ($t) use ($now) { return $t !== '' && ($now - (int) $t) < TA_FENETRE; });
    }
    $lignes[] = (string) $now;
    @file_put_contents($f, implode("\n", $lignes), LOCK_EX);
}

function ta_efface_echecs(): void { @unlink(ta_fichier_echecs()); }

// ── Jetons (HMAC, 8 h) ────────────────────────────────────────────────────────
const TA_TTL = 8 * 3600;

/** Empreinte du demandeur : le jeton ne vaut que depuis le poste qui l'a obtenu.
 *  IP + agent hachés avec la clé HMAC — aucune donnée identifiante n'est stockée.
 *  Sans cela, l'URL de téléchargement, copiée dans un groupe WhatsApp, ouvrirait
 *  le Guide à toute une classe. */
function ta_empreinte(): string {
    $ua = substr((string) ($_SERVER['HTTP_USER_AGENT'] ?? ''), 0, 120);
    return substr(hash_hmac('sha256', vrt_client_ip() . '|' . $ua, VRT_HMAC_KEY), 0, 16);
}

function ta_issue(string $label): array {
    $exp = time() + TA_TTL;
    $payload = ['s' => 'teacher', 'l' => $label, 'exp' => $exp, 'fp' => ta_empreinte()];
    $body = vrt_b64url_encode(json_encode($payload, JSON_UNESCAPED_UNICODE));
    $sig  = vrt_b64url_encode(hash_hmac('sha256', 'TEACHER|' . $body, VRT_HMAC_KEY, true));
    return ['token' => $body . '.' . $sig, 'exp' => $exp];
}

function ta_verify(string $token): ?array {
    $parts = explode('.', $token);
    if (count($parts) !== 2) return null;
    $expected = vrt_b64url_encode(hash_hmac('sha256', 'TEACHER|' . $parts[0], VRT_HMAC_KEY, true));
    if (!hash_equals($expected, $parts[1])) return null;
    $payload = json_decode(vrt_b64url_decode($parts[0]), true);
    if (!is_array($payload)) return null;
    if (($payload['s'] ?? '') !== 'teacher') return null;
    if ((int) ($payload['exp'] ?? 0) < time()) return null;
    // Jeton lié au poste : un lien de téléchargement transmis à un tiers ne vaut rien.
    if (!hash_equals((string) ($payload['fp'] ?? ''), ta_empreinte())) return null;
    return $payload;
}

/** Codes enseignants configurés : [['hash'=>..., 'label'=>...], ...] ; [] si non configuré. */
function ta_codes(): array {
    $out = [];
    if (defined('TEACHER_CODES')) {
        $raw = json_decode((string) constant('TEACHER_CODES'), true);
        if (is_array($raw)) {
            foreach ($raw as $c) {
                if (is_array($c) && !empty($c['hash'])) {
                    $out[] = ['hash' => (string) $c['hash'], 'label' => (string) ($c['label'] ?? 'Enseignant')];
                }
            }
        }
    }
    if (defined('TEACHER_CODE_HASH')) {
        $h = (string) constant('TEACHER_CODE_HASH');
        if ($h !== '' && $h[0] === '$') {
            $out[] = ['hash' => $h, 'label' => 'Enseignant'];
        }
    }
    return $out;
}

// ── Rate-limit ────────────────────────────────────────────────────────────────
if (vrt_rate_exceeded('teach', 40)) {
    ta_err(429, 'Trop de requêtes — réessayez dans une minute.', 'rate');
}

$method = $_SERVER['REQUEST_METHOD'] ?? 'GET';

// ── GET ?res=<slug>&token= : diffusion du fichier ─────────────────────────────
if ($method === 'GET' && isset($_GET['res'])) {
    $slug  = (string) $_GET['res'];
    $token = (string) ($_GET['token'] ?? '');
    $claims = ta_verify($token);
    if ($claims === null) {
        ta_log('[REFUS] ip=' . vrt_client_ip() . ' res=' . substr($slug, 0, 40) . ' motif=jeton');
        ta_err(401, 'Session expirée — ressaisissez votre code enseignant.', 'auth');
    }
    $cat = ta_catalogue();
    if (!isset($cat[$slug])) ta_err(404, 'Ressource inconnue.', 'unknown');

    $base = realpath(ta_dir());
    if ($base === false) ta_err(409, 'Ressource pas encore déposée sur le serveur.', 'missing');
    $path = realpath($base . '/' . basename($cat[$slug][2]));
    if ($path === false || strpos($path, $base) !== 0 || !is_file($path)) {
        ta_err(409, 'Ressource pas encore déposée sur le serveur.', 'missing');
    }

    ta_log('[OK] ip=' . vrt_client_ip() . ' code=' . (string) ($claims['l'] ?? '?') . ' res=' . $slug);

    while (ob_get_level() > 0) { ob_end_clean(); }
    $ext  = strtolower((string) pathinfo($path, PATHINFO_EXTENSION));
    $mime = $ext === 'pdf' ? 'application/pdf'
        : ($ext === 'docx' ? 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
        : ($ext === 'zip' ? 'application/zip' : 'application/octet-stream'));
    header('Content-Type: ' . $mime);
    header('Content-Length: ' . (string) filesize($path));
    header('Content-Disposition: attachment; filename="' . basename($path) . '"');
    header('Cache-Control: private, no-store, max-age=0');
    header('Pragma: no-cache');
    readfile($path);
    exit;
}

// ── POST : login / list ───────────────────────────────────────────────────────
if ($method !== 'POST') ta_err(405, 'Méthode non autorisée.', 'method');

$in = json_decode((string) file_get_contents('php://input'), true);
if (!is_array($in)) $in = [];
$action = (string) ($in['action'] ?? '');

if ($action === 'login') {
    $codes = ta_codes();
    if (!$codes) {
        ta_err(503, "L'espace enseignant n'est pas encore activé sur ce serveur.", 'not_configured');
    }
    // Porte fermée après trop d'échecs, même si le code présenté est le bon :
    // sinon un attaquant apprendrait, en tombant juste, qu'il a trouvé.
    if (ta_echecs_recents() >= TA_MAX_ECHECS) {
        ta_log('[BLOQUE] ip=' . vrt_client_ip() . ' echecs>=' . TA_MAX_ECHECS);
        ta_err(429, 'Trop de tentatives. Réessayez dans un quart d\'heure.', 'locked');
    }

    $code = trim((string) ($in['code'] ?? ''));
    if ($code === '') ta_err(400, 'Code requis.', 'empty');

    $label = null;
    foreach ($codes as $c) {
        if (password_verify($code, $c['hash'])) { $label = $c['label']; break; }
    }
    if ($label === null) {
        ta_note_echec();
        ta_log('[REFUS] ip=' . vrt_client_ip() . ' motif=code echecs=' . ta_echecs_recents());
        // Petite latence : décourage l'essai en masse sans pénaliser l'usage normal.
        usleep(400000);
        ta_err(401, 'Code enseignant non reconnu.', 'bad_code');
    }
    ta_efface_echecs();
    $t = ta_issue($label);
    ta_log('[LOGIN] ip=' . vrt_client_ip() . ' code=' . $label);
    ta_out(200, ['ok' => true, 'token' => $t['token'], 'label' => $label, 'exp' => $t['exp']]);
}

if ($action === 'list') {
    $claims = ta_verify((string) ($in['token'] ?? ''));
    if ($claims === null) ta_err(401, 'Session expirée.', 'auth');

    $base = realpath(ta_dir());
    $res = [];
    foreach (ta_catalogue() as $slug => $meta) {
        $dispo = false; $taille = 0;
        if ($base !== false) {
            $p = $base . '/' . $meta[2];
            if (is_file($p)) { $dispo = true; $taille = (int) filesize($p); }
        }
        $res[] = ['slug' => $slug, 'label' => $meta[0], 'groupe' => $meta[1],
                  'dispo' => $dispo, 'taille' => $taille];
    }
    ta_out(200, ['ok' => true, 'label' => (string) ($claims['l'] ?? ''), 'resources' => $res]);
}

ta_err(400, 'Action inconnue.', 'action');
