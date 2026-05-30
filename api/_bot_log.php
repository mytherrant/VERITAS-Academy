<?php
// ════════════════════════════════════════════════════════════════════
// VÉRITAS — Bot detection log (v2.5)
// © 2024-2026 Jacques Miterand TAKOU (Mythe Errant). Tous droits réservés.
// Œuvre protégée — Loi n° 2000/011 + Convention de Berne.
// Reproduction interdite sans accord écrit. Contrefaçon : 5-10 ans prison +
// 500 000 à 10 000 000 FCFA d'amende. contact@veritas-school.com
//
// Reçoit les beacons du JS anti-clonage et enregistre les bots détectés.
// ════════════════════════════════════════════════════════════════════

header('Content-Type: application/json; charset=utf-8');
// v1.2.2 : allowlist au lieu de '*'
$__bl_allowed = [
    'https://veritas-school.com', 'https://www.veritas-school.com',
    'http://localhost:8000', 'https://localhost', 'capacitor://localhost',
];
$__bl_origin = $_SERVER['HTTP_ORIGIN'] ?? '';
if (in_array($__bl_origin, $__bl_allowed, true)) {
    header('Access-Control-Allow-Origin: ' . $__bl_origin);
    header('Vary: Origin');
}
header('X-Robots-Tag: noindex, nofollow, noai');

// Accept POST only (beacons sont des POST)
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(204); // No content
    exit;
}

$raw = file_get_contents('php://input');
if (strlen($raw) > 4096) {
    // Limite anti-spam
    http_response_code(413);
    exit;
}

$data = json_decode($raw, true);
if (!is_array($data)) {
    http_response_code(204);
    exit;
}

// Préparer l'entrée de log
$entry = [
    'ts'     => date('c'),
    'ip'     => $_SERVER['REMOTE_ADDR'] ?? '?',
    'ua'     => $_SERVER['HTTP_USER_AGENT'] ?? '?',
    'ref'    => $_SERVER['HTTP_REFERER'] ?? '',
    'reason' => substr($data['reason'] ?? '', 0, 200),
    'susp'   => (int)($data['susp'] ?? 0),
    'url'    => substr($data['url'] ?? '', 0, 200),
];

// Écrire dans un fichier de log rotatif (taille max 1 Mo)
$logDir = __DIR__ . '/data/';
if (!is_dir($logDir)) @mkdir($logDir, 0750, true);
$logFile = $logDir . '_bot_detections.log';

// Rotation si trop gros
if (file_exists($logFile) && filesize($logFile) > 1024*1024) {
    @rename($logFile, $logFile . '.' . date('Ymd-His') . '.bak');
}

@file_put_contents(
    $logFile,
    json_encode($entry) . "\n",
    FILE_APPEND | LOCK_EX
);

// Réponse vide (le client ne doit rien savoir)
http_response_code(204);
exit;
