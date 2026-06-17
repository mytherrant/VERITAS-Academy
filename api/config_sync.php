<?php
// ============================================================
// VÉRITAS — Config Cloud Sync (pas de MySQL requis)
// © 2024-2026 Jacques Miterand TAKOU (Mythe Errant). Tous droits réservés.
// Œuvre protégée — Loi n° 2000/011 + Convention de Berne.
// Reproduction interdite sans accord écrit. Contrefaçon : 5-10 ans prison +
// 500 000 à 10 000 000 FCFA d'amende. contact@veritas-school.com
//
// Utilisé par sync.php et files.php uniquement
// ============================================================

// 🔐 v1.2.2 : le secret de synchronisation vit UNIQUEMENT dans api/payment_config.php
// (gitignoré). Rotation effectuée → plus aucun secret par défaut dans ce fichier versionné.
// FAIL-CLOSED : si API_SECRET n'est pas défini côté serveur, on génère une valeur
// aléatoire inconnue (toutes les requêtes seront refusées) plutôt que d'accepter un
// secret connu. → Toujours définir API_SECRET dans payment_config.php.
@include_once __DIR__ . '/payment_config.php';
if (!defined('API_SECRET')) {
    define('API_SECRET', bin2hex(random_bytes(32)));
}

// 🔐 v1.9.1 — Refuser tout secret CONNU/FUITÉ (fail-closed). Le secret historique
// « VERITAS-CLOUD-2026-xK9m » a été committé dans le dépôt public puis jamais
// rotaté : quiconque lit l'historique Git pouvait s'authentifier sur db.php et
// vider/écraser toute la base. On bloque ces valeurs : la seule issue est de poser
// un secret fort unique (openssl rand -hex 32) dans api/payment_config.php.
// (Défini AUSSI dans _auth_lib.php → garde function_exists pour éviter le redéclare
//  quand un endpoint inclut les deux, ex. migrate_protected.php / student_data.php.)
if (!function_exists('vrt_secret_is_compromised')) {
    function vrt_secret_is_compromised($s): bool {
        $bad = [
            'VERITAS-CLOUD-2026-xK9m',
            'VERITAS-CLOUD-2026',
            'CHANGEZ_MOI_cle_secrete_veritas_2026',
            'CHANGEZ_MOI',
            'CHANGEZ_MOI_token_admin_long_et_aleatoire',
            'À_REMPLIR_DEPUIS_DEVELOPER_ORANGE',
            'À_REMPLIR_DEPUIS_MOMODEVELOPER',
        ];
        return in_array((string) $s, $bad, true);
    }
}

// ── CORS (v1.2.2 : allowlist stricte au lieu de '*') ──
// L'app web ET l'app mobile Capacitor sont servies depuis veritas-school.com
// (même origine) → on peut fermer le CORS sans rien casser. Les sites tiers
// ne peuvent plus appeler l'API depuis un navigateur.
$__veritas_allowed_origins = [
    'https://veritas-school.com',
    'https://www.veritas-school.com',
    'http://localhost:8000',   // dev local (python -m http.server)
    'https://localhost',       // webview mobile éventuelle
    'capacitor://localhost',   // iOS WebView
];
$__origin = $_SERVER['HTTP_ORIGIN'] ?? '';
if (in_array($__origin, $__veritas_allowed_origins, true)) {
    header('Access-Control-Allow-Origin: ' . $__origin);
    header('Vary: Origin');
}
// (origine absente = appel same-origin/serveur → aucun header CORS nécessaire ;
//  origine non listée = pas de header ACAO → le navigateur bloque la réponse)
header('Access-Control-Allow-Methods: GET, POST, PUT, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');
header('Access-Control-Max-Age: 86400');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

header('Content-Type: application/json; charset=utf-8');

// ── Vérification du token Bearer ──
function requireAuth() {
    $auth = '';

    // 1. Header Authorization (méthode standard)
    if (function_exists('getallheaders')) {
        foreach (getallheaders() as $key => $value) {
            if (strtolower($key) === 'authorization') { $auth = $value; break; }
        }
    }
    if (empty($auth)) {
        $auth = $_SERVER['HTTP_AUTHORIZATION']
             ?? $_SERVER['REDIRECT_HTTP_AUTHORIZATION']
             ?? '';
    }

    // 2. Fallback : champ POST _secret (LiteSpeed supprime parfois le header Authorization)
    if (empty($auth) && !empty($_POST['_secret'])) {
        $auth = 'Bearer ' . $_POST['_secret'];
    }
    // 3. Fallback : champ GET _secret (pour requêtes GET avec token)
    if (empty($auth) && !empty($_GET['_secret'])) {
        $auth = 'Bearer ' . $_GET['_secret'];
    }

    $token = trim(str_ireplace('bearer', '', $auth));
    // 🔐 Fail-closed : si le secret du SERVEUR est un secret connu/fuité non rotaté,
    // on refuse TOUTE requête (même avec le bon token) plutôt que d'exposer la base.
    if (vrt_secret_is_compromised(API_SECRET)) {
        http_response_code(503);
        echo json_encode(['error' => 'Synchronisation désactivée par sécurité : le secret API du serveur est compromis et doit être renouvelé (openssl rand -hex 32 dans api/payment_config.php).']);
        @file_put_contents(__DIR__ . '/data/_security_log.txt',
            date('c') . " [COMPROMISED_SECRET_BLOCKED] config_sync.php — rotation du secret requise\n", FILE_APPEND);
        exit;
    }
    // Comparaison à temps constant (anti timing-attack) — hash_equals gère les
    // longueurs différentes sans court-circuit prématuré.
    if (!hash_equals(API_SECRET, $token)) {
        http_response_code(401);
        echo json_encode(['error' => 'Non autorisé — clé API invalide']);
        exit;
    }
}

function jsonResponse($data, $code = 200) {
    http_response_code($code);
    echo json_encode($data, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    exit;
}
