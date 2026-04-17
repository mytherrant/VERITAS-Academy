<?php
// ============================================================
// VÉRITAS Academy — Configuration Base de Données
// ⚠️ CE FICHIER N'EST PAS DÉPLOYÉ PAR GITHUB ACTIONS
//    Modifiez-le directement dans le Gestionnaire de fichiers LWS
// ============================================================

// Paramètres MySQL (à remplir depuis phpMyAdmin LWS)
define('DB_HOST', '185.98.131.160');
define('DB_NAME', 'verit2781684');
define('DB_USER', 'verit2781684');
define('DB_PASS', 'VOTRE_MOT_DE_PASSE_MYSQL');  // ← À CHANGER sur le serveur

define('DB_CHARSET', 'utf8mb4');
define('UPLOAD_DIR', __DIR__ . '/../uploads/');
define('MAX_FILE_SIZE', 50 * 1024 * 1024); // 50 Mo max
define('API_SECRET', 'CHANGEZ_MOI_cle_secrete_veritas_2026'); // ← À CHANGER

// ── CORS : accepte toutes les origines (app locale + live) ──────
// On répond IMMÉDIATEMENT aux préflights OPTIONS avant tout le reste
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');
header('Access-Control-Max-Age: 86400'); // cache le préflight 24h

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

header('Content-Type: application/json; charset=utf-8');

// Connexion PDO
function getDB() {
    static $pdo = null;
    if ($pdo === null) {
        try {
            $pdo = new PDO(
                'mysql:host=' . DB_HOST . ';dbname=' . DB_NAME . ';charset=' . DB_CHARSET,
                DB_USER, DB_PASS,
                [
                    PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
                    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
                    PDO::ATTR_EMULATE_PREPARES => false
                ]
            );
        } catch (PDOException $e) {
            http_response_code(500);
            echo json_encode(['error' => 'Erreur connexion MySQL : ' . $e->getMessage()]);
            exit;
        }
    }
    return $pdo;
}

// Vérification du token Bearer
function requireAuth() {
    $auth = '';
    if (function_exists('getallheaders')) {
        $headers = getallheaders();
        // Cherche Authorization quelle que soit la casse
        foreach ($headers as $key => $value) {
            if (strtolower($key) === 'authorization') { $auth = $value; break; }
        }
    }
    if (empty($auth)) {
        $auth = $_SERVER['HTTP_AUTHORIZATION'] ?? $_SERVER['REDIRECT_HTTP_AUTHORIZATION'] ?? '';
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
