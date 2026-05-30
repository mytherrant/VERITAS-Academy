<?php
// ============================================================
// VÉRITAS — Données publiques (sans authentification)
// © 2024-2026 Jacques Miterand TAKOU (Mythe Errant). Tous droits réservés.
// Œuvre protégée — Loi n° 2000/011 + Convention de Berne.
// Reproduction interdite sans accord écrit. Contrefaçon : 5-10 ans prison +
// 500 000 à 10 000 000 FCFA d'amende. contact@veritas-school.com
//
// GET /api/public_data.php → retourne les infos visibles
//   aux visiteurs : partenaires, school, publicInfo,
//   calendrier, tickerItems, elearning.plans
// ── Lecture seule, pas d'auth requise ──
// ============================================================

// CORS (v1.2.2 : allowlist — même si les données sont publiques, on évite
// que des sites tiers consomment l'endpoint depuis le navigateur des visiteurs).
$__pd_allowed = [
    'https://veritas-school.com', 'https://www.veritas-school.com',
    'http://localhost:8000', 'https://localhost', 'capacitor://localhost',
];
$__pd_origin = $_SERVER['HTTP_ORIGIN'] ?? '';
if (in_array($__pd_origin, $__pd_allowed, true)) {
    header('Access-Control-Allow-Origin: ' . $__pd_origin);
    header('Vary: Origin');
}
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

// v1.2.1 FIX : lire la base réellement écrite par db.php (data/veritas_db.json).
// Avant, on lisait uploads/veritas_db_backup.json — fichier qu'AUCUN endpoint n'écrit
// → la page visiteur ne reflétait jamais les contenus publiés par l'admin.
// On garde des replis vers les anciens emplacements pour compatibilité.
$candidates = [
    __DIR__ . '/../data/veritas_db.json',           // db.php (source principale actuelle)
    __DIR__ . '/data/veritas_db_backup.json',       // sync.php (legacy)
    __DIR__ . '/../uploads/veritas_db_backup.json', // ancien emplacement (compat)
];
$backupFile = '';
foreach ($candidates as $c) { if (is_file($c)) { $backupFile = $c; break; } }

if ($backupFile === '' || !file_exists($backupFile)) {
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
