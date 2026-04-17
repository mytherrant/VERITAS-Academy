<?php
// ============================================================
// VÉRITAS Academy — Configuration Base de Données
// ============================================================

// Paramètres MySQL (à remplir depuis phpMyAdmin LWS)
define('DB_HOST', '185.98.131.160');
define('DB_NAME', 'verit2781684');
define('DB_USER', 'verit2781684');
define('DB_PASS', 'VOTRE_MOT_DE_PASSE_MYSQL');  // ← À CHANGER sur le serveur
define('DB_CHARSET', 'utf8mb4');

// Dossier d'upload pour les fichiers
define('UPLOAD_DIR', __DIR__ . '/../uploads/');
define('MAX_FILE_SIZE', 50 * 1024 * 1024); // 50 Mo max

// Clé secrète pour l'API (changez cette valeur !)
define('API_SECRET', 'CHANGEZ_MOI_cle_secrete_veritas_2026');

// CORS — autorise le domaine officiel + localhost pour le développement
$allowedOrigins = [
    'https://veritas-school.com',
    'http://veritas-school.com',
    'http://localhost:8000',
    'http://localhost',
    'http://127.0.0.1:8000',
    'http://127.0.0.1',
];
$origin = $_SERVER['HTTP_ORIGIN'] ?? '';

// Autoriser les fichiers ouverts en local (file://) → origin = "null"
// Autoriser les requêtes sans origin (même serveur, curl, etc.)
if ($origin === '' || $origin === 'null') {
    $corsOrigin = '*';
} elseif (in_array($origin, $allowedOrigins)) {
    $corsOrigin = $origin;
} else {
    $corsOrigin = 'https://veritas-school.com';
}

header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: ' . $corsOrigin);
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');
if ($corsOrigin !== '*') header('Vary: Origin');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

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
            echo json_encode(['error' => 'Erreur de connexion à la base de données']);
            exit;
        }
    }
    return $pdo;
}

// Vérification simple du token admin
function requireAuth() {
    $headers = getallheaders();
    $auth = $headers['Authorization'] ?? '';
    $token = str_replace('Bearer ', '', $auth);
    if ($token !== API_SECRET) {
        http_response_code(401);
        echo json_encode(['error' => 'Non autorisé']);
        exit;
    }
}

// Réponse JSON
function jsonResponse($data, $code = 200) {
    http_response_code($code);
    echo json_encode($data, JSON_UNESCAPED_UNICODE);
    exit;
}
