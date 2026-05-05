<?php
/**
 * VÉRITAS Academy — api/db.php
 * GET  → renvoie le JSON courant (ou {} si vide)
 * POST application/json → sauvegarde la DB synchronisée
 */
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
header('Content-Type: application/json; charset=utf-8');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') { http_response_code(200); exit; }

$DATA_DIR = dirname(__DIR__) . '/data';
$DB_FILE  = $DATA_DIR . '/veritas_db.json';
if (!is_dir($DATA_DIR)) mkdir($DATA_DIR, 0750, true);

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
    $data = json_decode($raw, true);
    if ($data === null) { http_response_code(400); echo json_encode(['ok'=>false,'error'=>'JSON invalide']); exit; }
    if (strlen($raw) > 20*1024*1024) { http_response_code(413); echo json_encode(['ok'=>false,'error'=>'Données > 20 Mo — ne pas mettre de binaires base64 dans la DB']); exit; }
    $tmp = $DB_FILE . '.tmp';
    if (file_put_contents($tmp, $raw, LOCK_EX) === false) { http_response_code(500); echo json_encode(['ok'=>false,'error'=>'Écriture impossible — vérifier chmod data/']); exit; }
    if (!rename($tmp, $DB_FILE)) { @unlink($tmp); http_response_code(500); echo json_encode(['ok'=>false,'error'=>'Rename échoué']); exit; }
    echo json_encode(['ok'=>true,'size_ko'=>round(strlen($raw)/1024,1),'lastModified'=>$data['lastModified']??null,'time'=>time()]);
    exit;
}

http_response_code(405); echo json_encode(['ok'=>false,'error'=>'Méthode non autorisée']);
