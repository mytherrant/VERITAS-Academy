<?php
// ============================================================
// VÉRITAS — Config Cloud Sync (pas de MySQL requis)
// Utilisé par sync.php et files.php uniquement
// ============================================================

// Clé API : doit correspondre à DB.cloudConfig.secret dans VERITAS
define('API_SECRET', 'VERITAS-CLOUD-2026-xK9m');

// ── CORS ──
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
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
    if ($token !== API_SECRET) {
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
