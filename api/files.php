<?php
// ============================================================
// VÉRITAS — Gestion des fichiers
// GET /api/files.php          → liste tous les fichiers
// GET /api/files.php?id=xxx   → un fichier
// DELETE /api/files.php?id=xxx → supprimer
// ============================================================
require_once __DIR__ . '/config.php';

$method = $_SERVER['REQUEST_METHOD'];
$id = $_GET['id'] ?? null;
$category = $_GET['category'] ?? null;
$classe = $_GET['classe'] ?? null;

$db = getDB();

// ── GET : liste ou détail ──
if ($method === 'GET') {
    if ($id) {
        $stmt = $db->prepare('SELECT * FROM files WHERE id = ?');
        $stmt->execute([$id]);
        $file = $stmt->fetch();
        if (!$file) jsonResponse(['error' => 'Fichier non trouvé'], 404);
        jsonResponse($file);
    }

    $query = 'SELECT * FROM files WHERE 1=1';
    $params = [];

    if ($category) {
        $query .= ' AND category = ?';
        $params[] = $category;
    }
    if ($classe) {
        $query .= ' AND classe = ?';
        $params[] = $classe;
    }

    $query .= ' ORDER BY created_at DESC';
    $stmt = $db->prepare($query);
    $stmt->execute($params);
    jsonResponse($stmt->fetchAll());
}

// ── DELETE : supprimer un fichier ──
if ($method === 'DELETE') {
    requireAuth();
    if (!$id) jsonResponse(['error' => 'ID requis'], 400);

    $stmt = $db->prepare('SELECT * FROM files WHERE id = ?');
    $stmt->execute([$id]);
    $file = $stmt->fetch();
    if (!$file) jsonResponse(['error' => 'Fichier non trouvé'], 404);

    // Supprimer le fichier physique
    $filePath = UPLOAD_DIR . $file['category'] . '/' . $file['filename'];
    if (file_exists($filePath)) {
        unlink($filePath);
    }

    // Supprimer de la base
    $stmt = $db->prepare('DELETE FROM files WHERE id = ?');
    $stmt->execute([$id]);

    jsonResponse(['message' => 'Fichier supprimé', 'id' => $id]);
}

jsonResponse(['error' => 'Méthode non autorisée'], 405);
