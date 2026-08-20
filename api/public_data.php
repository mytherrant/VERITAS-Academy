<?php
require_once __DIR__ . '/_json_boot.php'; // display_errors=0 + purge des parasites avant le JSON (voir _json_boot.php)
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

// ── 🛡️ SENTINELLE (v2.0) ────────────────────────────────────────────────
// Placée AVANT tout travail : un moissonneur ne doit pas nous coûter une
// lecture de base ni un appel réseau pour se voir refuser ensuite.
// Profil « lecture ». Un débit anormal reçoit un défi (429), pas un bannissement
// — au Cameroun une classe entière partage une IP, et bannir l'IP fermerait
// le site à trente élèves pour un seul emballement.
require_once __DIR__ . '/_sentinel.php';
vrt_sentinelle('lecture');


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

// ─────────────────────────────────────────────────────────────────────────
// CATALOGUE E-LEARNING — la VITRINE, jamais la marchandise (v1.19.1)
// ─────────────────────────────────────────────────────────────────────────
// Jusqu'ici cet endpoint n'exposait que les PLANS : un visiteur non inscrit
// voyait donc les prix d'abonnement sans jamais voir ce qu'ils ouvrent. Le
// mur d'essais n'avait rien à garder sur la page publique — il gardait une
// étagère vide.
//
// On expose donc les fiches, en LISTE BLANCHE stricte. Ce qui ne sort JAMAIS
// d'ici, quelle que soit la fiche :
//   htmlContent / fichierData / fichier / idbKey → c'est le contenu lui-même ;
//   blockedFor / unlockedFor                     → ce sont des identifiants de
//                                                   comptes, donc des données
//                                                   personnelles.
// Une liste blanche (et non une liste noire) parce qu'un champ ajouté demain
// à une fiche doit être invisible par défaut, pas exposé par oubli.
//
// externalUrl et resPedago ouvrent réellement le contenu : ils ne partent que
// pour la (ou les) ressource(s) OFFERTE(S), calculées ici avec la même règle
// que le navigateur — l'admin la fixe dans « Essais & abonnements ».

/** Ressources qui restent réellement gratuites. Miroir de _pwLibreIds(). */
function vrt_pd_offertes(array $contenus, $paywall) {
    $cl = (is_array($paywall) && isset($paywall['catalogueLibre']) && is_array($paywall['catalogueLibre']))
        ? $paywall['catalogueLibre'] : [];
    $actif   = (is_array($paywall) && array_key_exists('actif', $paywall)) ? (bool)$paywall['actif'] : true;
    $limiter = array_key_exists('limiter', $cl) ? (bool)$cl['limiter'] : true;
    $max     = array_key_exists('max', $cl) ? max(0, (int)$cl['max']) : 1;
    $ids     = (isset($cl['ids']) && is_array($cl['ids'])) ? array_values($cl['ids']) : [];

    // Paywall coupé ou limitation levée → toutes les fiches « gratuit » le restent
    if (!$actif || !$limiter) {
        $out = [];
        foreach ($contenus as $c) { if (!empty($c['gratuit']) && isset($c['id'])) $out[] = (string)$c['id']; }
        return $out;
    }
    if (count($ids) > 0) return array_map('strval', $ids);   // choix explicite de l'admin
    $out = [];
    foreach ($contenus as $c) {
        if (count($out) >= $max) break;
        if (!empty($c['gratuit']) && isset($c['id'])) $out[] = (string)$c['id'];
    }
    return $out;
}

/** Classement des classes d'après les scores RÉELLEMENT enregistrés.
 *
 *  Rien n'est inventé et rien n'est complété : s'il n'y a aucun score, on rend
 *  un tableau vide et la vitrine masque le bloc. Le panneau s'allume donc tout
 *  seul dès les premiers points, sans redéploiement ni intervention.
 *
 *  Agrégation par CLASSE, jamais par élève : le classement est public, et
 *  publier « untel · 2 480 pts » exposerait un mineur nommément.
 */
function vrt_pd_classement(array $db): array {
    $src = [];
    foreach (['jeuScores', 'gameScores', 'quizScores'] as $k) {
        if (isset($db[$k]) && is_array($db[$k])) { $src = $db[$k]; break; }
    }
    if (!$src) return ['classement' => [], 'joueurs' => 0, 'periode' => ''];

    // Semaine en cours : un « battle de la semaine » qui cumule depuis toujours
    // n'est plus un défi hebdomadaire, c'est un palmarès historique.
    $debut = strtotime('monday this week 00:00:00') ?: 0;

    $parClasse = []; $joueurs = [];
    foreach ($src as $s) {
        if (!is_array($s)) continue;
        $ts = isset($s['ts']) ? (int) $s['ts'] : (isset($s['date']) ? (int) strtotime((string) $s['date']) : 0);
        if ($ts > 0 && $debut > 0 && $ts < $debut) continue;
        $cls = trim((string) ($s['cls'] ?? $s['classe'] ?? ''));
        if ($cls === '') continue;
        $pts = (int) ($s['pts'] ?? $s['points'] ?? $s['score'] ?? 0);
        if ($pts <= 0) continue;
        $ville = trim((string) ($s['ville'] ?? ''));
        $cle = $cls . ($ville !== '' ? ' · ' . $ville : '');
        $parClasse[$cle] = ($parClasse[$cle] ?? 0) + $pts;
        $uid = (string) ($s['uid'] ?? $s['eid'] ?? '');
        if ($uid !== '') $joueurs[$uid] = true;
    }
    if (!$parClasse) return ['classement' => [], 'joueurs' => 0, 'periode' => ''];

    arsort($parClasse);
    $out = []; $rang = 0;
    foreach ($parClasse as $libelle => $pts) {
        if (++$rang > 3) break;                      // podium seulement
        $out[] = ['rang' => $rang, 'libelle' => vrt_pd_coupe($libelle, 60), 'pts' => $pts];
    }
    return ['classement' => $out, 'joueurs' => count($joueurs),
            'periode' => $debut ? date('Y-m-d', $debut) : ''];
}

/** Troncature sûre : mbstring n'est pas garanti, et une fatale ici viderait
 *  TOUTE la réponse publique (école, ticker, partenaires compris). */
function vrt_pd_coupe($s, $n) {
    $s = (string)$s;
    return function_exists('mb_substr') ? mb_substr($s, 0, $n) : substr($s, 0, $n);
}

/** Extension du fichier, sans jamais divulguer son nom ni son chemin. */
function vrt_pd_filetype(array $c) {
    if (!empty($c['fileType'])) return preg_replace('/[^a-z0-9]/i', '', (string)$c['fileType']);
    if (!empty($c['htmlContent'])) return 'html';
    $f = isset($c['fichier']) ? (string)$c['fichier'] : '';
    if ($f === '') return '';
    $ext = strtolower((string)pathinfo($f, PATHINFO_EXTENSION));
    return preg_replace('/[^a-z0-9]/', '', $ext);
}

$__pd_contenus_src = (isset($db['elearning']['contenus']) && is_array($db['elearning']['contenus']))
    ? $db['elearning']['contenus'] : [];
$__pd_supprimes = (isset($db['deletedDefaults']) && is_array($db['deletedDefaults'])) ? $db['deletedDefaults'] : [];
$__pd_paywall   = (isset($db['paywall']) && is_array($db['paywall'])) ? $db['paywall'] : null;
$__pd_offertes  = vrt_pd_offertes($__pd_contenus_src, $__pd_paywall);

$__pd_contenus = [];
foreach ($__pd_contenus_src as $c) {
    if (!is_array($c) || !isset($c['id'])) continue;
    $id = (string)$c['id'];
    if (in_array($id, $__pd_supprimes, true)) continue;      // retiré par l'admin
    if (count($__pd_contenus) >= 400) break;                  // garde-fou de poids

    $offerte = in_array($id, $__pd_offertes, true);
    $row = [
        'id'      => $id,
        'cat'     => isset($c['cat'])     ? (string)$c['cat']     : '',
        'titre'   => isset($c['titre'])   ? (string)$c['titre']   : '',
        'classe'  => isset($c['classe'])  ? (string)$c['classe']  : '',
        'matiere' => isset($c['matiere']) ? (string)$c['matiere'] : '',
        'seq'     => isset($c['seq'])     ? (string)$c['seq']     : '',
        'prix'    => isset($c['prix'])    ? (int)$c['prix']       : 0,
        'gratuit' => !empty($c['gratuit']),
        'plans'   => (isset($c['plans']) && is_array($c['plans'])) ? array_values($c['plans']) : [],
        // Accroches : volontairement tronquées, la carte n'en montre pas plus
        'apercu'  => isset($c['apercu']) ? vrt_pd_coupe($c['apercu'], 240) : '',
        'desc'    => isset($c['desc'])   ? vrt_pd_coupe($c['desc'], 240) : '',
    ];
    if (!empty($c['ico'])) $row['ico'] = vrt_pd_coupe($c['ico'], 8);
    $ft = vrt_pd_filetype($c);
    if ($ft !== '') $row['fileType'] = $ft;
    // Les deux clés qui ouvrent VRAIMENT : réservées à la ressource offerte.
    if ($offerte) {
        if (!empty($c['externalUrl'])) $row['externalUrl'] = (string)$c['externalUrl'];
        if (!empty($c['resPedago']))   $row['resPedago']   = (string)$c['resPedago'];
    }
    $__pd_contenus[] = $row;
}

// Extraire uniquement les données publiques (pas de notes, élèves, paiements, etc.)
$public = [
    'school'      => $db['school']      ?? null,
    'publicInfo'  => $db['publicInfo']  ?? null,
    'partenaires' => $db['partenaires'] ?? [],
    'tickerItems' => $db['tickerItems'] ?? [],
    'calendrier'  => $db['calendrier']  ?? [],
    'elearning_plans' => isset($db['elearning']['plans']) ? $db['elearning']['plans'] : [],
    'elearning_categories' => (isset($db['elearning']['categories']) && is_array($db['elearning']['categories']))
        ? $db['elearning']['categories'] : [],
    'elearning_contenus' => $__pd_contenus,
    // Politique d'affichage (essais, ressource offerte) : que des nombres, des
    // booléens et des identifiants de fiches. Elle part telle quelle pour que
    // la vitrine obéisse au panneau admin, et non à des valeurs codées en dur.
    'paywall' => $__pd_paywall,
    /* CLASSEMENT DE JEU — calculé, jamais écrit à la main.
       Le panneau « Apprendre en jouant » affichait un tableau d'honneur inventé
       (« Terminale A4 · Douala — 2 480 pts »), codé en dur dans la maquette.
       Il part d'ici désormais, et il part VIDE tant qu'aucun score n'existe :
       la vitrine masque alors le tableau et n'affiche que l'invitation à jouer.
       Un classement fabriqué est la seule chose qu'un enseignant vérifie. */
    'jeu' => vrt_pd_classement($db),
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
