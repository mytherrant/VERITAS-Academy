<?php
// ============================================================
// VÉRITAS — Synchronisation localStorage ↔ MySQL
// POST /api/sync.php  → envoie DB complète du navigateur
// GET  /api/sync.php  → récupère la dernière version
// ============================================================
require_once __DIR__ . '/config.php';

$method = $_SERVER['REQUEST_METHOD'];
$db = getDB();

// ── POST : sauvegarder le DB du navigateur vers MySQL ──
if ($method === 'POST') {
    requireAuth();

    $input = file_get_contents('php://input');
    $data = json_decode($input, true);

    if (!$data) {
        jsonResponse(['error' => 'JSON invalide'], 400);
    }

    // Sauvegarder le snapshot complet
    $stmt = $db->prepare(
        'INSERT INTO sync_snapshots (data, created_by, size_bytes) VALUES (?, ?, ?)'
    );
    $stmt->execute([
        $input,
        $_POST['user'] ?? 'admin',
        strlen($input)
    ]);

    $snapshotId = $db->lastInsertId();

    // Garder les 50 derniers snapshots seulement
    $db->exec('DELETE FROM sync_snapshots WHERE id NOT IN (SELECT id FROM (SELECT id FROM sync_snapshots ORDER BY created_at DESC LIMIT 50) t)');

    jsonResponse([
        'success' => true,
        'snapshot_id' => $snapshotId,
        'size' => strlen($input),
        'message' => 'Données synchronisées'
    ], 201);
}

// ── GET : récupérer la dernière sauvegarde ──
if ($method === 'GET') {
    requireAuth();

    $stmt = $db->query('SELECT * FROM sync_snapshots ORDER BY created_at DESC LIMIT 1');
    $snapshot = $stmt->fetch();

    if (!$snapshot) {
        jsonResponse(['error' => 'Aucune sauvegarde trouvée'], 404);
    }

    // Retourner le JSON directement
    header('Content-Type: application/json; charset=utf-8');
    echo $snapshot['data'];
    exit;
}

jsonResponse(['error' => 'Méthode non autorisée'], 405);
