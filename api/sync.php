<?php
// ============================================================
// VÉRITAS — Synchronisation données ↔ serveur
// POST /api/sync.php  → sauvegarde DB (JSON) sur le serveur
// GET  /api/sync.php  → récupère la dernière sauvegarde
// ── Stockage fichier plat, pas de MySQL requis ──
// ============================================================
require_once __DIR__ . '/config_sync.php';

$method     = $_SERVER['REQUEST_METHOD'];
$backupDir  = __DIR__ . '/../uploads/';
$backupFile = $backupDir . 'veritas_db_backup.json';
$metaFile   = $backupDir . 'veritas_db_meta.json';

// ── POST : sauvegarder ──────────────────────────────────────
if ($method === 'POST') {
    requireAuth();

    $input = file_get_contents('php://input');
    if (!$input || !json_decode($input)) {
        jsonResponse(['error' => 'JSON invalide ou corps vide'], 400);
    }

    // Créer le dossier si nécessaire
    if (!is_dir($backupDir)) {
        mkdir($backupDir, 0755, true);
    }

    // Archiver la sauvegarde précédente (garde les 5 dernières)
    if (file_exists($backupFile)) {
        $ts = date('Ymd_His');
        copy($backupFile, $backupDir . 'veritas_db_' . $ts . '.json');
        // Supprimer les archives en excès (garder 5 max)
        $archives = glob($backupDir . 'veritas_db_2*.json') ?: [];
        if (count($archives) > 5) {
            sort($archives); // plus ancien en premier
            foreach (array_slice($archives, 0, count($archives) - 5) as $old) {
                @unlink($old);
            }
        }
    }

    // Écrire la nouvelle sauvegarde
    if (file_put_contents($backupFile, $input) === false) {
        jsonResponse(['error' => 'Impossible d\'écrire le fichier (permissions ?)'], 500);
    }

    $meta = [
        'saved_at'    => date('c'),
        'saved_at_fr' => date('d/m/Y à H:i:s'),
        'size_bytes'  => strlen($input),
        'size_kb'     => round(strlen($input) / 1024, 1),
    ];
    file_put_contents($metaFile, json_encode($meta, JSON_PRETTY_PRINT));

    jsonResponse([
        'success'  => true,
        'saved_at' => $meta['saved_at_fr'],
        'size_kb'  => $meta['size_kb'],
        'message'  => 'Données sauvegardées (' . $meta['size_kb'] . ' Ko) — ' . $meta['saved_at_fr'],
    ], 201);
}

// ── GET : récupérer la dernière sauvegarde ──────────────────
if ($method === 'GET') {
    requireAuth();

    if (!file_exists($backupFile)) {
        jsonResponse(['error' => 'Aucune sauvegarde trouvée sur le serveur'], 404);
    }

    // Lire les métadonnées pour les headers
    if (file_exists($metaFile)) {
        $meta = json_decode(file_get_contents($metaFile), true);
        header('X-Backup-Date: ' . ($meta['saved_at_fr'] ?? ''));
        header('X-Backup-Size: '  . ($meta['size_kb']    ?? '') . ' Ko');
    }

    header('Content-Type: application/json; charset=utf-8');
    readfile($backupFile);
    exit;
}

jsonResponse(['error' => 'Méthode non autorisée'], 405);
