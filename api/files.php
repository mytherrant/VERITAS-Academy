<?php
// ============================================================
// VÉRITAS — Liste des sauvegardes disponibles
// GET /api/files.php  → liste les sauvegardes JSON sur le serveur
// ── Pas de MySQL requis ──
// ============================================================
require_once __DIR__ . '/config_sync.php';

$method    = $_SERVER['REQUEST_METHOD'];
$backupDir = __DIR__ . '/data/';

if ($method === 'GET') {
    requireAuth();

    $files = [];

    // Sauvegarde principale
    $mainFile = $backupDir . 'veritas_db_backup.json';
    if (file_exists($mainFile)) {
        $metaFile = $backupDir . 'veritas_db_meta.json';
        $meta = file_exists($metaFile)
            ? json_decode(file_get_contents($metaFile), true)
            : [];
        $files[] = [
            'name'     => 'veritas_db_backup.json',
            'type'     => 'backup_principal',
            'size'     => filesize($mainFile),
            'saved_at' => $meta['saved_at']    ?? '',
            'label'    => 'Sauvegarde principale — ' . ($meta['saved_at_fr'] ?? date('d/m/Y', filemtime($mainFile))),
        ];
    }

    // Archives
    $archives = glob($backupDir . 'veritas_db_2*.json') ?: [];
    rsort($archives); // plus récente en premier
    foreach ($archives as $arch) {
        $files[] = [
            'name'     => basename($arch),
            'type'     => 'archive',
            'size'     => filesize($arch),
            'saved_at' => date('c', filemtime($arch)),
            'label'    => 'Archive — ' . date('d/m/Y H:i', filemtime($arch)),
        ];
    }

    jsonResponse($files);
}

jsonResponse(['error' => 'Méthode non autorisée'], 405);
