<?php
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: https://veritas-school.com');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') { http_response_code(204); exit; }

$DB_FILE = __DIR__ . '/../data/veritas_db.json';

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
  if (!file_exists($DB_FILE)) { echo '{}'; exit; }
  echo file_get_contents($DB_FILE);
  exit;
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
  $body = file_get_contents('php://input');
  if (!$body) { http_response_code(400); echo '{"error":"Corps vide"}'; exit; }
  $data = json_decode($body, true);
  if ($data === null) { http_response_code(400); echo '{"error":"JSON invalide"}'; exit; }
  $dir = dirname($DB_FILE);
  if (!is_dir($dir)) { mkdir($dir, 0755, true); }
  $result = file_put_contents($DB_FILE, json_encode($data, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT), LOCK_EX);
  if ($result === false) { http_response_code(500); echo '{"error":"Écriture impossible"}'; exit; }
  echo '{"ok":true,"bytes":' . $result . '}';
  exit;
}

http_response_code(405);
echo '{"error":"Méthode non autorisée"}';
?>
