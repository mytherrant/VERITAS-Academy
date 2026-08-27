<?php
/**
 * api/secure_epub.php — LECTURE EN LIGNE, MODE TEXTE (EPUB) — v1.18
 * © 2024-2026 Jacques Miterand TAKOU (Mythe Errant). Tous droits réservés.
 *
 * BUT — servir un livre vendu au format EPUB en LECTURE SEULE sur le site, dans
 * un texte qui se recompose (confort mobile), sans jamais livrer le fichier
 * .epub. Pendant de api/secure_pdf.php, qui sert la même œuvre en IMAGES de
 * pages (mise en page fidèle de l'édition imprimée).
 *
 * POURQUOI DEUX MODES — l'acheteur paie UNE fois et lit comme il veut :
 *   • « pages »  (secure_pdf.php)  : fidèle au livre, infalsifiable, illisible
 *                                    sur un petit écran sans zoomer ;
 *   • « texte »  (ce fichier)      : se recompose, taille de police au choix,
 *                                    confortable sur téléphone — l'immense
 *                                    majorité du parc au Cameroun.
 *
 * ⚠️ HONNÊTETÉ SUR LA PROTECTION — un texte qui se recompose est, par nature,
 *    du texte remis au navigateur : un lecteur déterminé peut le récupérer dans
 *    l'onglet réseau, quelles que soient les gardes posées côté client. Le mode
 *    « pages » reste le plus difficile à extraire. Ce mode-ci est donc protégé
 *    par ce qui fonctionne réellement contre la REDIFFUSION : l'accès nominatif,
 *    la signature de l'exemplaire (nom + identifiant + date, incrustée dans le
 *    texte servi) et un quota horaire. Pour désactiver le mode texte sur un
 *    livre : retirer  epub:true  de sa fiche (admin) — le lecteur n'affiche
 *    alors que les pages.
 *
 * CE QUE LE SERVEUR NE FAIT PAS — ni décompression, ni analyse XML, ni
 * assainissement à la volée. L'EPUB est préparé UNE fois hors ligne par
 *   tools/prepare_epub_reader.py  →  uploads/protected/books/<id>/epub/
 *     index.json      manifeste (titres, nombres de mots, fichier libre)
 *     cNN.html        fragment déjà assaini (aucun script, aucun attribut actif)
 *     cNN_free.html   extrait tronqué, servi avant paiement
 * Aucune dépendance (pas de ZipArchive, pas de DOM) : si le dossier manque, la
 * réponse est un 409 explicite, jamais une demi-lecture.
 *
 * USAGE
 *   GET ?id=<bookId>&meta=1&token=<tok>        → sommaire + droits (sans texte)
 *   GET ?id=<bookId>&chap=<n>&token=<tok>      → {html, titre, tronque}
 *   POST {id, chap|meta, login, password}      → repli auth sans jeton
 */
declare(strict_types=1);
require_once __DIR__ . '/_json_boot.php'; // display_errors=0 + purge avant le JSON
ob_start();
require_once __DIR__ . '/_auth_lib.php';

$__allowed = [
    'https://veritas-school.com', 'https://www.veritas-school.com',
    'http://localhost:8000', 'http://localhost:8077', 'https://localhost', 'capacitor://localhost',
];
$__origin = $_SERVER['HTTP_ORIGIN'] ?? '';
if (in_array($__origin, $__allowed, true)) {
    header('Access-Control-Allow-Origin: ' . $__origin);
    header('Vary: Origin');
}
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');
header('X-Content-Type-Options: nosniff');
header('Referrer-Policy: no-referrer');
header('X-Frame-Options: SAMEORIGIN');
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') { http_response_code(204); exit; }

// ── 🛡️ SENTINELLE (v2.0) ────────────────────────────────────────────────
// Placée AVANT tout travail : un moissonneur ne doit pas nous coûter une
// lecture de base ni un appel réseau pour se voir refuser ensuite.
// Profil « telechargement ». Un débit anormal reçoit un défi (429), pas un bannissement
// — au Cameroun une classe entière partage une IP, et bannir l'IP fermerait
// le site à trente élèves pour un seul emballement.
require_once __DIR__ . '/_sentinel.php';
vrt_sentinelle('telechargement');


function sepub_err(int $code, string $msg): void {
    while (ob_get_level() > 0) { ob_end_clean(); }
    http_response_code($code);
    header('Content-Type: application/json; charset=utf-8');
    header('Cache-Control: no-store');
    echo json_encode(['ok' => false, 'error' => $msg], JSON_UNESCAPED_UNICODE);
    exit;
}
function sepub_out(array $data): void {
    while (ob_get_level() > 0) { ob_end_clean(); }
    header('Content-Type: application/json; charset=utf-8');
    header('Cache-Control: private, no-store, max-age=0');
    header('Pragma: no-cache');
    echo json_encode(['ok' => true] + $data, JSON_UNESCAPED_UNICODE);
    exit;
}

define('SEPUB_CHAPS_PER_HOUR', 24);   // documents DISTINCTS par heure et par livre

function sepub_identity(?array $acc): string {
    $aid = $acc ? (string) ($acc['id'] ?? '') : '';
    if ($aid !== '') return 'a:' . $aid;
    return 'ip:' . substr(md5(vrt_client_ip()), 0, 12);
}

/** true si le quota est dépassé. Compte les chapitres DISTINCTS sur 1 h
 *  glissante : relire le même chapitre ne coûte rien, balayer le livre en
 *  boucle coûte. Même logique que spdf_budget() dans secure_pdf.php. */
function sepub_budget(string $who, string $docId, int $chap, int $max): bool {
    $dir = __DIR__ . '/data/_rate/';
    if (!is_dir($dir)) @mkdir($dir, 0750, true);
    $f = $dir . 'sepubq_' . substr(md5($who . '|' . $docId), 0, 20) . '.txt';
    $now = time(); $keep = [];
    if (is_file($f)) {
        foreach (explode("\n", (string) @file_get_contents($f)) as $ln) {
            $p = explode(':', $ln);
            if (count($p) === 2 && ($now - (int) $p[0]) < 3600) $keep[(int) $p[1]] = (int) $p[0];
        }
    }
    if (!isset($keep[$chap])) $keep[$chap] = $now;
    // Dépassement : on ne PERSISTE pas, sinon insister ferait enfler le fichier
    // sans jamais rien obtenir.
    if (count($keep) > $max) return true;
    $out = [];
    foreach ($keep as $c => $ts) $out[] = $ts . ':' . $c;
    @file_put_contents($f, implode("\n", $out));
    return false;
}

// ── Rate-limit (anti aspiration) ──
if (vrt_rate_exceeded('sepub', 90)) sepub_err(429, 'Trop de requêtes — patientez une minute.');

// ── Entrées ──
$method = $_SERVER['REQUEST_METHOD'];
$id = ''; $chap = 0; $token = ''; $login = ''; $pass = ''; $wantMeta = false;
if ($method === 'GET') {
    $id       = (string) ($_GET['id'] ?? '');
    $chap     = (int) ($_GET['chap'] ?? 0);
    $token    = (string) ($_GET['token'] ?? '');
    $wantMeta = isset($_GET['meta']);
} elseif ($method === 'POST') {
    $in = json_decode((string) file_get_contents('php://input'), true);
    if (is_array($in)) {
        $id       = (string) ($in['id'] ?? '');
        $chap     = (int) ($in['chap'] ?? 0);
        $token    = (string) ($in['token'] ?? '');
        $login    = trim((string) ($in['login'] ?? ''));
        $pass     = (string) ($in['password'] ?? '');
        $wantMeta = !empty($in['meta']);
    }
} else {
    sepub_err(405, 'Méthode non autorisée');
}
$id = preg_replace('/[^a-zA-Z0-9_\-]/', '', $id);
if ($id === '') sepub_err(400, 'id requis');

$db = vrt_load_db();
if (!is_array($db)) sepub_err(503, 'Base indisponible');

// ── Authentification (jeton d'abord, sinon login + mot de passe) ──
$acc = null;
if ($token !== '') {
    $res = vrt_verify_token($token, $db);
    if ($res !== null) $acc = $res['acc'];
}
if ($acc === null && $login !== '' && $pass !== '') {
    $found = vrt_find_account($db, $login);
    if ($found !== null) {
        $need = false;
        if (vrt_verify_password($pass, (string) ($found['acc']['pwd'] ?? ''), (string) $found['acc']['user'], $need)) {
            $acc = $found['acc'];
        }
    }
}

// ── Retrouver l'élément : LIVRE (boutique) OU CONTENU e-learning ──
$item = null; $kind = '';
foreach (($db['books'] ?? []) as $b) {
    if (is_array($b) && (string) ($b['id'] ?? '') === $id) { $item = $b; $kind = 'book'; break; }
}
if ($item === null) {
    foreach (($db['elearning']['contenus'] ?? []) as $c) {
        if (is_array($c) && (string) ($c['id'] ?? '') === $id) { $item = $c; $kind = 'contenu'; break; }
    }
}
if ($item === null) sepub_err(404, 'Document introuvable');
if (empty($item['epub'])) sepub_err(409, 'Ce document n\'a pas de version texte.');

$secureId = preg_replace('/[^a-zA-Z0-9_\-]/', '', (string) ($item['secureId'] ?? $item['id'] ?? $id));

// ── Droit d'accès complet (mêmes règles que secure_pdf.php) ──
$isAdmin = false;
$accId = $acc ? (string) ($acc['id'] ?? '') : '';
if ($acc) {
    foreach (($db['admins'] ?? []) as $a) {
        if (($a['id'] ?? null) === $accId || ($a['user'] ?? null) === ($acc['user'] ?? null)) { $isAdmin = true; break; }
    }
    if (($db['superAdmin']['user'] ?? null) === ($acc['user'] ?? null)) $isAdmin = true;
}
$hasFull = $isAdmin;
if (!$hasFull) {
    if ($kind === 'book') {
        $hasFull = $acc && is_array($acc['unlockedBooks'] ?? null) && in_array($id, $acc['unlockedBooks'], true);
    } else {
        if (!empty($item['gratuit']) || !empty($item['free'])) $hasFull = true;
        elseif ($acc && function_exists('vrt_account_can_access')) $hasFull = vrt_account_can_access($acc, $item, $db);
    }
}

// ── Manifeste préparé hors ligne ──
$baseDir = realpath(dirname(__DIR__) . '/uploads/protected/books');
$epubDir = $baseDir ? ($baseDir . '/' . $secureId . '/epub') : null;
$indexFile = $epubDir ? ($epubDir . '/index.json') : null;
$manifeste = null;
if ($indexFile && is_file($indexFile)) {
    $manifeste = json_decode((string) @file_get_contents($indexFile), true);
}
$chapitres = (is_array($manifeste) && is_array($manifeste['chapitres'] ?? null))
    ? array_values($manifeste['chapitres']) : [];
if (!$chapitres) {
    sepub_err(409, 'Version texte non encore préparée sur ce serveur.');
}

// Rang (1-indexé) du premier document non liminaire : c'est celui qui porte
// l'extrait gratuit, et le mur commence juste après.
$rangLibre = 0;
foreach ($chapitres as $i => $c) {
    if (empty($c['liminaire'])) { $rangLibre = $i + 1; break; }
}

// ── META : sommaire + droits, sans une ligne du texte ──
if ($wantMeta) {
    $liste = [];
    foreach ($chapitres as $i => $c) {
        $liste[] = [
            'i'         => $i + 1,
            'titre'     => (string) ($c['titre'] ?? ''),
            'mots'      => (int) ($c['mots'] ?? 0),
            'liminaire' => !empty($c['liminaire']),
            'libre'     => $hasFull || !empty($c['liminaire']) || ($i + 1) === $rangLibre,
        ];
    }
    sepub_out([
        'id'        => $id,
        'titre'     => (string) ($item['titre'] ?? ''),
        'auteur'    => (string) ($item['auteur'] ?? ''),
        'chapitres' => $liste,
        'mots'      => (int) ($manifeste['mots'] ?? 0),
        'hasAccess' => $hasFull,
        'prepared'  => true,
        'freeUntil' => $rangLibre,
        'freeMots'  => (int) ($chapitres[$rangLibre - 1]['free_mots'] ?? 0),
    ]);
}

// ── Servir UN document ──
if ($chap < 1 || $chap > count($chapitres)) sepub_err(400, 'chapitre invalide');
$entree = $chapitres[$chap - 1];
$tronque = false;

// Mur de lecture : hors aperçu, l'accès complet est requis.
if (!$hasFull) {
    $estApercu = !empty($entree['liminaire']) || $chap === $rangLibre;
    if (!$estApercu) {
        @file_put_contents(__DIR__ . '/data/_security_log.txt',
            date('c') . ' [SEPUB_LOCKED] id=' . $id . ' chap=' . $chap
            . ' user=' . substr((string) ($acc['user'] ?? 'anon'), 0, 40) . ' ip=' . vrt_client_ip() . "\n", FILE_APPEND);
        sepub_err(402, 'Chapitre réservé — débloquez la version numérique pour lire la suite.');
    }
}

// Anti-hotlink léger : si Referer présent, il doit venir d'une origine connue.
$ref = $_SERVER['HTTP_REFERER'] ?? '';
if ($ref !== '') {
    $okRef = false;
    foreach ($__allowed as $o) { if (strpos($ref, $o) === 0) { $okRef = true; break; } }
    if (!$okRef) sepub_err(403, 'Origine non autorisée');
}

$who = sepub_identity($acc);
if (sepub_budget($who, $id, $chap, SEPUB_CHAPS_PER_HOUR)) {
    @file_put_contents(__DIR__ . '/data/_security_log.txt',
        date('c') . ' [SEPUB_QUOTA] id=' . $id . ' who=' . $who . ' ip=' . vrt_client_ip() . "\n", FILE_APPEND);
    sepub_err(429, 'Beaucoup de chapitres ouverts sur la dernière heure. La lecture redevient possible un peu plus tard.');
}

// Le nom de fichier vient du MANIFESTE, jamais de la requête : aucune traversée
// de dossier n'est possible, même avec un id malmené.
$nomFichier = (string) (($hasFull || empty($entree['free'])) ? ($entree['f'] ?? '') : $entree['free']);
if (!$hasFull && !empty($entree['free'])) $tronque = true;
$nomFichier = basename($nomFichier);
if ($nomFichier === '' || !preg_match('/^c\d{2}(_free)?\.html$/', $nomFichier)) {
    sepub_err(500, 'Manifeste incohérent');
}
$chemin = $epubDir . '/' . $nomFichier;
if (!is_file($chemin)) sepub_err(409, 'Chapitre non préparé sur ce serveur.');
$html = (string) @file_get_contents($chemin);
if ($html === '') sepub_err(500, 'Lecture impossible');

/* SIGNATURE DE L'EXEMPLAIRE — incrustée dans le texte servi. C'est ce qui rend
   une rediffusion remontable jusqu'au compte : la capture d'écran comme le
   copier-coller emportent la mention avec eux. */
$qui = $acc
    ? trim((string) ($acc['nom'] ?? '') . ' ' . (string) ($acc['pre'] ?? '')) . ' · ' . $accId
    : 'Aperçu gratuit';
$sig = htmlspecialchars($qui . ' · ' . date('d/m/Y'), ENT_QUOTES, 'UTF-8');
$titreLivre = htmlspecialchars((string) ($item['titre'] ?? ''), ENT_QUOTES, 'UTF-8');
$html .= "\n" . '<p class="sread-sign">« ' . $titreLivre . ' » — exemplaire numérique de '
       . $sig . ' · veritas-school.com · reproduction interdite</p>';

// ── Journaliser l'accès légitime ──
@file_put_contents(__DIR__ . '/data/_access_log.txt',
    date('c') . ' SEPUB id=' . $id . ' c=' . $chap . ' user=' . substr((string) ($acc['user'] ?? 'anon'), 0, 40)
    . ' ' . round(strlen($html) / 1024) . 'ko ip=' . vrt_client_ip() . "\n", FILE_APPEND);

sepub_out([
    'i'       => $chap,
    'total'   => count($chapitres),
    'titre'   => (string) ($entree['titre'] ?? ''),
    'html'    => $html,
    'tronque' => $tronque,
    'wm'      => $qui,
]);
