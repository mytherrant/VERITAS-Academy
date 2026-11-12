<?php
/**
 * api/direct.php — CLASSES VIRTUELLES EN DIRECT des abonnés en ligne (12/11/2026)
 * © 2024-2026 Jacques Miterand TAKOU (Mythe Errant). Tous droits réservés.
 *
 * Le centre publie ses séances dans l'administration (DB.seancesDirect :
 * titre, classe, matière, début, durée, lien de visio, places, enseignant).
 * L'abonné Élite ou Famille voit le planning, s'inscrit dans la limite des
 * places et des classes de sa formule, et reçoit le lien de visio — seulement
 * s'il est inscrit, et seulement de 15 minutes avant le début jusqu'à la fin :
 * le lien ne circule pas dans le planning public.
 *
 * DROIT — `direct` de la table vrt_droits_formules.
 * INSCRIPTIONS — data/_direct/<séance>.json (hors base synchronisée).
 *
 * USAGE — POST JSON
 *   {action:"liste", token}                → séances à venir (sans lien), inscrit ?, places restantes
 *   {action:"inscrire" | "desinscrire", token, id}
 *   {action:"rejoindre", token, id}        → {ok, lien}
 * Refus ordinaires en 200 {ok:false, raison} :
 *   connexion | formule | complet | classe | trop_tot | terminee | introuvable | non_inscrit | debit
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

function dir_rep(array $r, int $code = 200): void {
    while (ob_get_level() > 0) { ob_end_clean(); }
    http_response_code($code);
    header('Content-Type: application/json; charset=utf-8');
    echo json_encode($r, JSON_UNESCAPED_UNICODE);
    exit;
}
/** Début d'une séance en secondes (accepte un horodatage en ms ou une date ISO). */
function dir_debut(array $s): int {
    $d = $s['debut'] ?? 0;
    if (is_numeric($d)) { $d = (int) $d; return $d > 100000000000 ? intdiv($d, 1000) : $d; }
    $t = strtotime((string) $d);
    return $t === false ? 0 : $t;
}
function dir_fin(array $s): int { return dir_debut($s) + 60 * max(15, min(300, (int) ($s['duree'] ?? 60))); }
function dir_fichier(string $id): string {
    $dir = (defined('VRT_DIRECT_DIR') ? (string) VRT_DIRECT_DIR : __DIR__ . '/data/_direct') . '/';
    if (!is_dir($dir)) @mkdir($dir, 0750, true);
    return $dir . substr(hash('sha256', 'sd|' . $id), 0, 32) . '.json';
}
function dir_inscrits(string $id): array {
    $f = dir_fichier($id);
    $v = is_file($f) ? json_decode((string) @file_get_contents($f), true) : null;
    return is_array($v) ? $v : [];
}
/** Les séances publiées, actives, triées par date. */
function dir_seances(array $db): array {
    $out = [];
    foreach (($db['seancesDirect'] ?? []) as $s) {
        if (!is_array($s) || empty($s['id']) || (isset($s['actif']) && $s['actif'] === false)) continue;
        if (dir_debut($s) <= 0) continue;
        $out[(string) $s['id']] = $s;
    }
    uasort($out, function ($a, $b) { return dir_debut($a) <=> dir_debut($b); });
    return $out;
}

if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST') dir_rep(['ok' => false, 'error' => 'Méthode non autorisée'], 405);
if (vrt_rate_exceeded('direct', 60)) dir_rep(['ok' => false, 'raison' => 'debit']);
$in = json_decode((string) file_get_contents('php://input'), true);
if (!is_array($in)) dir_rep(['ok' => false, 'error' => 'Requête illisible'], 400);

$db = vrt_load_db();
if (!is_array($db)) dir_rep(['ok' => false, 'error' => 'Base indisponible'], 503);
$acc = null;
$token = (string) ($in['token'] ?? '');
if ($token !== '') { $res = vrt_verify_token($token, $db); if ($res !== null) $acc = $res['acc']; }
if ($acc === null) dir_rep(['ok' => false, 'raison' => 'connexion']);

$accId  = (string) ($acc['id'] ?? $acc['user'] ?? '');
$droits = vrt_droits_compte($acc, $db);
$role   = strtolower((string) ($acc['role'] ?? ''));
$equipe = in_array($role, ['admin', 'superadmin', 'enseignant'], true);
$droit  = $equipe || !empty($droits['direct']);
$action = (string) ($in['action'] ?? '');
$seances = dir_seances($db);
$now = time();

if ($action === 'liste') {
    $liste = [];
    foreach ($seances as $id => $s) {
        if (dir_fin($s) < $now) continue;                     // terminée
        $ins = dir_inscrits($id);
        $places = max(0, (int) ($s['places'] ?? 30));
        $liste[] = [
            'id' => $id, 'titre' => (string) ($s['titre'] ?? 'Séance'), 'classe' => (string) ($s['classe'] ?? ''),
            'matiere' => (string) ($s['matiere'] ?? ''), 'enseignant' => (string) ($s['enseignant'] ?? ''),
            'debut' => dir_debut($s), 'duree' => (int) ($s['duree'] ?? 60),
            'places' => $places, 'restantes' => max(0, $places - count($ins)), 'inscrit' => isset($ins[$accId]),
            'ouverte' => $now >= dir_debut($s) - 900,
        ];
        if (count($liste) >= 60) break;
    }
    dir_rep(['ok' => true, 'droit' => $droit, 'seances' => $liste]);
}

$id = (string) ($in['id'] ?? '');
if (!isset($seances[$id])) dir_rep(['ok' => false, 'raison' => 'introuvable']);
$s = $seances[$id];
$f = dir_fichier($id);

if ($action === 'inscrire') {
    if (!$droit) dir_rep(['ok' => false, 'raison' => 'formule']);
    if (dir_fin($s) < $now) dir_rep(['ok' => false, 'raison' => 'terminee']);
    /* La séance appartient à une classe : elle compte parmi les classes de la
       formule (une place libre est prise, comme à l'ouverture d'une leçon). */
    $cl = vrt_classe_normaliser((string) ($s['classe'] ?? ''));
    if (!$equipe && $cl !== '' && vrt_classe_couverte($acc, $droits, $cl, true) === 'complet') dir_rep(['ok' => false, 'raison' => 'classe']);
    $fh = @fopen($f, 'c+');
    if ($fh === false) dir_rep(['ok' => false, 'error' => 'Stockage indisponible'], 503);
    @flock($fh, LOCK_EX);
    $ins = json_decode((string) stream_get_contents($fh), true);
    if (!is_array($ins)) $ins = [];
    if (!isset($ins[$accId])) {
        if (count($ins) >= max(0, (int) ($s['places'] ?? 30))) { @flock($fh, LOCK_UN); fclose($fh); dir_rep(['ok' => false, 'raison' => 'complet']); }
        $ins[$accId] = ['t' => $now, 'nom' => trim((string) ($acc['pre'] ?? '') . ' ' . (string) ($acc['nom'] ?? '')) ?: (string) ($acc['user'] ?? '')];
        ftruncate($fh, 0); rewind($fh); fwrite($fh, json_encode($ins, JSON_UNESCAPED_UNICODE));
    }
    @flock($fh, LOCK_UN); fclose($fh);
    dir_rep(['ok' => true]);
}

if ($action === 'desinscrire') {
    $ins = dir_inscrits($id);
    unset($ins[$accId]);
    @file_put_contents($f, json_encode($ins, JSON_UNESCAPED_UNICODE), LOCK_EX);
    dir_rep(['ok' => true]);
}

if ($action === 'rejoindre') {
    if (!$droit) dir_rep(['ok' => false, 'raison' => 'formule']);
    if (!$equipe && !isset(dir_inscrits($id)[$accId])) dir_rep(['ok' => false, 'raison' => 'non_inscrit']);
    if ($now < dir_debut($s) - 900) dir_rep(['ok' => false, 'raison' => 'trop_tot', 'debut' => dir_debut($s)]);
    if ($now > dir_fin($s)) dir_rep(['ok' => false, 'raison' => 'terminee']);
    $lien = (string) ($s['lien'] ?? '');
    if (!preg_match('#^https://#i', $lien)) dir_rep(['ok' => false, 'raison' => 'introuvable']);
    dir_rep(['ok' => true, 'lien' => $lien]);
}

dir_rep(['ok' => false, 'error' => 'Action inconnue'], 400);
