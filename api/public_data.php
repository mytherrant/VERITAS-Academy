<?php
// ============================================================
// VÉRITAS — Données publiques (sans authentification)
// GET /api/public_data.php → retourne les infos visibles
//   aux visiteurs : partenaires, school, publicInfo,
//   calendrier, tickerItems, elearning.plans
// ── Lecture seule, pas d'auth requise ──
// ============================================================

// CORS
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
header('Content-Type: application/json; charset=utf-8');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    http_response_code(405);
    echo json_encode(['error' => 'Méthode non autorisée']);
    exit;
}

$backupFile = __DIR__ . '/../uploads/veritas_db_backup.json';

if (!file_exists($backupFile)) {
    http_response_code(404);
    echo json_encode(['error' => 'Aucune donnée disponible', 'partenaires' => [], 'school' => null]);
    exit;
}

$raw = file_get_contents($backupFile);
if (!$raw) {
    http_response_code(500);
    echo json_encode(['error' => 'Erreur lecture fichier']);
    exit;
}

$db = json_decode($raw, true);
if (!$db) {
    http_response_code(500);
    echo json_encode(['error' => 'JSON invalide']);
    exit;
}

// Extraire uniquement les données publiques (pas de notes, élèves, paiements, etc.)
$public = [
    'school'      => $db['school']      ?? null,
    'publicInfo'  => $db['publicInfo']  ?? null,
    'partenaires' => $db['partenaires'] ?? [],
    'tickerItems' => $db['tickerItems'] ?? [],
    'calendrier'  => $db['calendrier']  ?? [],
    'elearning_plans' => isset($db['elearning']['plans']) ? $db['elearning']['plans'] : [],
    'generated_at' => date('c'),
];

// Retirer les logos en data: URL (trop lourds pour une réponse publique)
foreach ($public['partenaires'] as &$p) {
    if (isset($p['logo']) && strpos($p['logo'], 'data:') === 0 && strlen($p['logo']) > 5000) {
        $p['logo'] = ''; // remplacer par vide, l'emoji ico sera utilisé
    }
}
unset($p);

echo json_encode($public, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
exit;
