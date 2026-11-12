<?php
/**
 * api/examens.php — BULLETINS BLANCS des abonnés (12/11/2026)
 * © 2024-2026 Jacques Miterand TAKOU (Mythe Errant). Tous droits réservés.
 *
 * L'élève passe un examen blanc chronométré (app.js, _simulerExamen), rend sa
 * copie ; le tuteur IA la note avec le barème du sujet (via ia_proxy.php, dans
 * le quota de la formule). Ce point d'entrée garde les notes et en tire le
 * bulletin blanc : moyenne par matière, moyenne générale, mention.
 *
 * DROIT — `bulletins` de la table vrt_droits_formules (Pro, Élite, Famille).
 * STOCKAGE — un fichier par compte dans data/_examens/ (hors base synchronisée :
 *   une synchro de l'administration ne peut pas effacer les notes d'un élève).
 * LIMITE — la note vient du tuteur IA, appelé par le navigateur : elle est
 *   INDICATIVE, et un élève qui trafique la sienne ne trompe que lui-même.
 *
 * USAGE — POST JSON
 *   {action:"enregistrer", token, copie:{epreuveId,titre,matiere,classe,note,detail[],appreciation,conseils,dureeMin}}
 *   {action:"bulletin", token}  → {ok, notes[], matieres[], moyenne, mention, droit}
 *   {action:"supprimer", token, id}
 * Refus ordinaires en 200 {ok:false, raison} : connexion | formule | invalide | debit
 */
declare(strict_types=1);
require_once __DIR__ . '/_json_boot.php';
ob_start();
require_once __DIR__ . '/_auth_lib.php';

$__allowed = [
    'https://veritas-school.com', 'https://www.veritas-school.com',
    'http://localhost:8000', 'http://localhost:8077', 'https://localhost', 'capacitor://localhost',
];
$__origin = $_SERVER['HTTP_ORIGIN'] ?? '';
if (in_array($__origin, $__allowed, true)) { header('Access-Control-Allow-Origin: ' . $__origin); header('Vary: Origin'); }
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
header('X-Content-Type-Options: nosniff');
header('Cache-Control: private, no-store');
if (($_SERVER['REQUEST_METHOD'] ?? '') === 'OPTIONS') { http_response_code(204); exit; }

require_once __DIR__ . '/_sentinel.php';
vrt_sentinelle('lecture');

function exa_rep(array $r, int $code = 200): void {
    while (ob_get_level() > 0) { ob_end_clean(); }
    http_response_code($code);
    header('Content-Type: application/json; charset=utf-8');
    echo json_encode($r, JSON_UNESCAPED_UNICODE);
    exit;
}
function exa_txt($v, int $n): string {
    $v = trim((string) $v);
    return function_exists('mb_substr') ? mb_substr($v, 0, $n) : substr($v, 0, $n);
}
function exa_fichier(array $acc): string {
    $dir = (defined('VRT_EXAMENS_DIR') ? (string) VRT_EXAMENS_DIR : __DIR__ . '/data/_examens') . '/';
    if (!is_dir($dir)) @mkdir($dir, 0750, true);
    return $dir . substr(hash('sha256', 'ex|' . (string) ($acc['id'] ?? $acc['user'] ?? '')), 0, 32) . '.json';
}
function exa_lire(array $acc): array {
    $f = exa_fichier($acc);
    $v = is_file($f) ? json_decode((string) @file_get_contents($f), true) : null;
    return is_array($v) ? $v : [];
}
function exa_mention(float $m): string {
    if ($m >= 16) return 'Très bien';
    if ($m >= 14) return 'Bien';
    if ($m >= 12) return 'Assez bien';
    if ($m >= 10) return 'Passable';
    return 'Insuffisant';
}
/** Le bulletin : moyenne par matière (notes sur 20), moyenne générale = moyenne des matières. */
function exa_bulletin(array $notes): array {
    $par = [];
    foreach ($notes as $n) {
        $m = (string) ($n['matiere'] ?? 'Autre');
        $par[$m][] = (float) $n['note'];
    }
    $matieres = [];
    foreach ($par as $m => $l) {
        $moy = round(array_sum($l) / count($l), 2);
        $matieres[] = ['matiere' => $m, 'moyenne' => $moy, 'copies' => count($l), 'meilleure' => max($l), 'mention' => exa_mention($moy)];
    }
    usort($matieres, function ($a, $b) { return strcmp($a['matiere'], $b['matiere']); });
    $gen = $matieres ? round(array_sum(array_column($matieres, 'moyenne')) / count($matieres), 2) : null;
    return ['matieres' => $matieres, 'moyenne' => $gen, 'mention' => $gen === null ? '' : exa_mention($gen)];
}

if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST') exa_rep(['ok' => false, 'error' => 'Méthode non autorisée'], 405);
if (vrt_rate_exceeded('examens', 60)) exa_rep(['ok' => false, 'raison' => 'debit']);
$in = json_decode((string) file_get_contents('php://input'), true);
if (!is_array($in)) exa_rep(['ok' => false, 'error' => 'Requête illisible'], 400);

$db = vrt_load_db();
if (!is_array($db)) exa_rep(['ok' => false, 'error' => 'Base indisponible'], 503);
$acc = null;
$token = (string) ($in['token'] ?? '');
if ($token !== '') { $res = vrt_verify_token($token, $db); if ($res !== null) $acc = $res['acc']; }
if ($acc === null) exa_rep(['ok' => false, 'raison' => 'connexion']);

$droits = vrt_droits_compte($acc, $db);
$action = (string) ($in['action'] ?? '');

if ($action === 'bulletin') {
    $notes = exa_lire($acc);
    usort($notes, function ($a, $b) { return (int) ($b['date'] ?? 0) <=> (int) ($a['date'] ?? 0); });
    exa_rep(['ok' => true, 'droit' => !empty($droits['bulletins']), 'notes' => $notes] + exa_bulletin($notes));
}

if ($action === 'supprimer') {
    $id = (string) ($in['id'] ?? '');
    $notes = array_values(array_filter(exa_lire($acc), function ($n) use ($id) { return (string) ($n['id'] ?? '') !== $id; }));
    @file_put_contents(exa_fichier($acc), json_encode($notes, JSON_UNESCAPED_UNICODE), LOCK_EX);
    exa_rep(['ok' => true]);
}

if ($action === 'enregistrer') {
    if (empty($droits['bulletins'])) exa_rep(['ok' => false, 'raison' => 'formule']);
    $c = $in['copie'] ?? null;
    if (!is_array($c)) exa_rep(['ok' => false, 'raison' => 'invalide']);
    $note = is_numeric($c['note'] ?? null) ? (float) $c['note'] : -1;
    if ($note < 0 || $note > 20) exa_rep(['ok' => false, 'raison' => 'invalide']);
    $detail = [];
    foreach (array_slice(is_array($c['detail'] ?? null) ? $c['detail'] : [], 0, 12) as $d) {
        if (!is_array($d)) continue;
        $sur = max(0.0, min(40.0, (float) ($d['sur'] ?? 0)));
        $detail[] = ['lib' => exa_txt($d['lib'] ?? '', 80), 'note' => max(0.0, min($sur, (float) ($d['note'] ?? 0))),
                     'sur' => $sur, 'commentaire' => exa_txt($d['commentaire'] ?? '', 400)];
    }
    $ligne = [
        'id' => 'ex_' . bin2hex(random_bytes(5)),
        'epreuveId' => exa_txt($c['epreuveId'] ?? '', 60), 'titre' => exa_txt($c['titre'] ?? 'Épreuve', 140),
        'matiere' => exa_txt($c['matiere'] ?? 'Autre', 40) ?: 'Autre', 'classe' => exa_txt($c['classe'] ?? '', 20),
        'note' => round($note, 2), 'detail' => $detail,
        'appreciation' => exa_txt($c['appreciation'] ?? '', 600), 'conseils' => exa_txt($c['conseils'] ?? '', 800),
        'dureeMin' => max(0, min(600, (int) ($c['dureeMin'] ?? 0))), 'date' => time(),
    ];
    $notes = exa_lire($acc);
    $notes[] = $ligne;
    if (count($notes) > 300) $notes = array_slice($notes, -300);   // 300 copies : plusieurs années d'examens blancs
    @file_put_contents(exa_fichier($acc), json_encode($notes, JSON_UNESCAPED_UNICODE), LOCK_EX);
    exa_rep(['ok' => true, 'copie' => $ligne] + exa_bulletin($notes));
}

exa_rep(['ok' => false, 'error' => 'Action inconnue'], 400);
