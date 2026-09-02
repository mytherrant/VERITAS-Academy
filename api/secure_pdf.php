<?php
/**
 * api/secure_pdf.php — LECTEUR PDF SÉCURISÉ (v1.7)
 * © 2024-2026 Jacques Miterand TAKOU (Mythe Errant). Tous droits réservés.
 *
 * BUT — vendre/diffuser des documents PDF consultables UNIQUEMENT sur le site,
 * sans téléchargement, copie ou partage du fichier. Le PDF brut NE QUITTE JAMAIS
 * le serveur : le client ne reçoit que des IMAGES de pages, une par une, gated.
 *
 * SÉCURITÉ EN COUCHES :
 *   1. Le fichier .pdf vit dans uploads/protected/ (hors web, .htaccess deny).
 *   2. Chaque page est servie comme image JPEG via cet endpoint authentifié —
 *      jamais d'URL directe vers le PDF ni vers le dossier.
 *   3. ENTITLEMENT par compte : aperçu gratuit = N premières pages ; le reste
 *      exige que acc.unlockedBooks contienne l'id du livre (octroyé au paiement).
 *   4. FILIGRANE personnalisé (nom + id compte + date) incrusté sur chaque page
 *      → toute capture/photo reste TRAÇABLE jusqu'au compte fautif (dissuasif réel).
 *   5. En-têtes private/no-store, anti-hotlink (Referer), rate-limit IP.
 *
 * ⚠️ Aucune technologie web n'empêche à 100 % une PHOTO de l'écran par un tiers.
 *    Ce système atteint le niveau Google Books/Scribd ; le filigrane traçable est
 *    la protection réellement efficace contre la rediffusion.
 *
 * RENDU DES PAGES (par ordre de préférence) :
 *   a) Pré-rendu : uploads/protected/books/<id>/p<NNN>.jpg  (recommandé)
 *   b) À la volée : Imagick depuis uploads/protected/books/<id>.pdf (caché)
 *   Si ni l'un ni l'autre → 409 « document non préparé ».
 *
 * USAGE :
 *   GET ?id=<bookId>&page=<n>&token=<tok>            → image JPEG de la page n
 *   GET ?id=<bookId>&meta=1&token=<tok>              → {pages, freePages, hasAccess, prepared}
 *   POST {id, page|meta, login, password}            → repli auth sans token
 */
declare(strict_types=1);
require_once __DIR__ . '/_json_boot.php'; // display_errors=0 + purge des parasites avant le JSON (voir _json_boot.php)
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
// Durcissement (additif, sans risque pour la lecture légitime) :
//  • no-referrer  → l'URL du lecteur/page ne fuit jamais via Referer.
//  • SAMEORIGIN   → l'endpoint ne peut pas être encadré (iframe) sur un autre site.
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


function spdf_err(int $code, string $msg): void {
    while (ob_get_level() > 0) { ob_end_clean(); }
    http_response_code($code);
    header('Content-Type: application/json; charset=utf-8');
    echo json_encode(['ok' => false, 'error' => $msg], JSON_UNESCAPED_UNICODE);
    exit;
}

/* ── v1.17 — BAIL DE LECTURE SIGNÉ + QUOTA ANTI-ASPIRATION ───────────────────
   Le lecteur recevait d'un seul coup l'URL de TOUTES les pages auxquelles il
   avait droit, jeton de session inclus : une ligne en console récoltait un
   manuel entier, et une URL copiée restait valable aussi longtemps que la
   session. Deux verrous, ceux des liseuses en ligne :
     1. au-delà de l'aperçu, chaque page exige une signature HMAC liée au
        COMPTE, à la PAGE et à une échéance courte — une URL partagée meurt en
        quelques minutes et ne vaut que pour son destinataire ;
     2. un quota de pages DISTINCTES par heure et par document : lire ne le
        touche jamais, aspirer bute dessus (429 + journal de sécurité).
   Ni l'un ni l'autre n'empêche de photographier un écran — rien ne le peut.
   Ils suppriment l'extraction en masse, qui est la vraie fuite. */
define('SPDF_LEASE_TTL', 600);        // validité d'une signature : 10 min
define('SPDF_WINDOW_MAX', 8);         // pages signables en un appel
define('SPDF_PAGES_PER_HOUR', 150);   // pages distinctes/heure/document

function spdf_identity(?array $acc): string {
    $aid = $acc ? (string) ($acc['id'] ?? '') : '';
    if ($aid !== '') return 'a:' . $aid;
    return 'ip:' . substr(md5(vrt_client_ip()), 0, 12);
}
function spdf_sig(string $docId, int $page, string $who, int $exp): string {
    return hash_hmac('sha256', $docId . '|' . $page . '|' . $who . '|' . $exp, VRT_HMAC_KEY);
}
/** true si le quota est dépassé. Compte les pages DISTINCTES sur 1 h glissante :
 *  relire dix fois la même page ne coûte rien, en balayer trois cents coûte. */
function spdf_budget(string $who, string $docId, array $add, int $max): bool {
    $dir = __DIR__ . '/data/_rate/';
    if (!is_dir($dir)) @mkdir($dir, 0750, true);
    $f = $dir . 'spdfq_' . substr(md5($who . '|' . $docId), 0, 20) . '.txt';
    $now = time(); $keep = [];
    if (is_file($f)) {
        foreach (explode("\n", (string) @file_get_contents($f)) as $ln) {
            $p = explode(':', $ln);
            if (count($p) === 2 && ($now - (int) $p[0]) < 3600) $keep[(int) $p[1]] = (int) $p[0];
        }
    }
    foreach ($add as $pg) { if (!isset($keep[$pg])) $keep[$pg] = $now; }
    // Dépassement : on ne PERSISTE pas, sinon un attaquant qui insiste ferait
    // enfler le fichier sans jamais rien obtenir.
    if (count($keep) > $max) return true;
    $out = [];
    foreach ($keep as $pg => $ts) $out[] = $ts . ':' . $pg;
    @file_put_contents($f, implode("\n", $out));
    return false;
}

// ── Rate-limit (anti aspiration massive de pages) ──
if (vrt_rate_exceeded('spdf', 120)) spdf_err(429, 'Trop de requêtes — patientez une minute.');

// ── Entrées ──
$method = $_SERVER['REQUEST_METHOD'];
$id = ''; $page = 0; $token = ''; $login = ''; $pass = ''; $wantMeta = false;
$wantSign = false; $signFrom = 0; $signCount = 0; $qExp = 0; $qSig = '';
if ($method === 'GET') {
    $id    = (string) ($_GET['id'] ?? '');
    $page  = (int) ($_GET['page'] ?? 0);
    $token = (string) ($_GET['token'] ?? '');
    $wantMeta = isset($_GET['meta']);
    // v1.17 — bail de lecture : le client demande la signature d'une FENÊTRE de
    // pages (celles qu'il s'apprête à afficher), jamais du document entier.
    $wantSign  = isset($_GET['sign']);
    $signFrom  = (int) ($_GET['from'] ?? 0);
    $signCount = (int) ($_GET['count'] ?? 0);
    $qExp = (int) ($_GET['exp'] ?? 0);
    $qSig = preg_replace('/[^a-f0-9]/', '', (string) ($_GET['sig'] ?? ''));
} elseif ($method === 'POST') {
    $in = json_decode((string) file_get_contents('php://input'), true);
    if (is_array($in)) {
        $id    = (string) ($in['id'] ?? '');
        $page  = (int) ($in['page'] ?? 0);
        $token = (string) ($in['token'] ?? '');
        $login = trim((string) ($in['login'] ?? ''));
        $pass  = (string) ($in['password'] ?? '');
        $wantMeta = !empty($in['meta']);
    }
} else {
    spdf_err(405, 'Méthode non autorisée');
}
$id = preg_replace('/[^a-zA-Z0-9_\-]/', '', $id);
if ($id === '') spdf_err(400, 'id requis');

$db = vrt_load_db();
if (!is_array($db)) spdf_err(503, 'Base indisponible');

// ── Authentification (token d'abord, sinon login+mot de passe) ──
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

// ── Retrouver l'élément : LIVRE (boutique) OU CONTENU e-learning (épreuve/cours) ──
$item = null; $kind = '';
foreach (($db['books'] ?? []) as $b) {
    if (is_array($b) && (string) ($b['id'] ?? '') === $id) { $item = $b; $kind = 'book'; break; }
}
if ($item === null) {
    foreach (($db['elearning']['contenus'] ?? []) as $c) {
        if (is_array($c) && (string) ($c['id'] ?? '') === $id) { $item = $c; $kind = 'contenu'; break; }
    }
}
/* ── Repli : le catalogue déposé par la CI ────────────────────────────────
   Un livre mis en vente par catalogue_livres.json n'entre dans la BASE qu'à la
   première synchronisation d'un administrateur. Jusque-là, ce lecteur répondait
   « Document introuvable » sur un livre pourtant annoncé et payable — mesuré en
   production le 25/08/2026 pour « Le Tube digestif », la synchro étant cassée
   depuis onze jours. La base reste prioritaire (boucles ci-dessus) : ce repli ne
   sert que tant qu'elle ignore le livre, et il lit exactement la fiche qui a
   servi à le mettre en vitrine — mêmes pages offertes, même tarif. */
if ($item === null && function_exists('vrt_catalogue_livre')) {
    $fiche = vrt_catalogue_livre($id);
    if ($fiche !== null) { $item = $fiche; $kind = 'book'; }
}
if ($item === null) spdf_err(404, 'Document introuvable');
$book = $item; // alias rétro-compat (méta, titre…)

$secureId  = preg_replace('/[^a-zA-Z0-9_\-]/', '', (string) ($item['secureId'] ?? $item['id'] ?? $id));
$totalPg   = (int) ($item['securePages'] ?? $item['pages'] ?? 0);
$freePg    = (int) ($item['freePages'] ?? 10);
if ($freePg < 0) $freePg = 0;

// ── Droit d'accès complet ? ──
//   • LIVRE    : admin OU acheté (acc.unlockedBooks)
//   • CONTENU  : admin OU gratuit OU plan couvrant le contenu (vrt_account_can_access)
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
    } else { // contenu
        if (!empty($item['gratuit']) || !empty($item['free'])) $hasFull = true;
        elseif ($acc && function_exists('vrt_account_can_access')) $hasFull = vrt_account_can_access($acc, $item, $db);
    }
}

// ── Dossier des pages ──
$baseDir = realpath(dirname(__DIR__) . '/uploads/protected/books');
$bookDir = $baseDir ? ($baseDir . '/' . $secureId) : null;
$pdfFile = $baseDir ? ($baseDir . '/' . $secureId . '.pdf') : null;

// Compter les pages réellement préparées si total non renseigné
// Une seule source de vérité pour ce compte : la même fonction que la garde
// d'achat (api/payment_camerpay.php), sinon les deux dérivent en silence.
$preparedPages = function_exists('vrt_livre_pages_reelles')
    ? vrt_livre_pages_reelles($secureId)
    : (($bookDir && is_dir($bookDir)) ? count(glob($bookDir . '/p*.jpg') ?: []) : 0);
if ($totalPg <= 0) $totalPg = $preparedPages;
$prepared = ($preparedPages > 0) || ($pdfFile && is_file($pdfFile) && class_exists('Imagick'));

/* ── LE NOMBRE ANNONCÉ N'ÉTAIT JAMAIS CONFRONTÉ AU DISQUE ─────────────────
   `$totalPg` vient du catalogue (144 pour Le Tube digestif) et ne servait
   qu'à borner les requêtes. Un dépôt FTP coupé à la douzième page laissait
   donc un lecteur qui annonce 144 pages, en sert 12, et n'a rien à dire sur
   les 132 autres : l'acheteur voit une pagination complète et bute sur un mur
   muet. C'est la panne des cahiers du 01/09, jamais portée aux livres.

   On le CONSTATE ici, et on le dit au client. Le lecteur peut alors afficher
   ce qu'il a vraiment, et l'administration voit le livre à re-déposer sans
   avoir à l'acheter pour s'en apercevoir. */
$attenduPg  = $totalPg;
$incomplet  = ($preparedPages > 0 && $attenduPg > 0 && $preparedPages < $attenduPg);
if ($incomplet) {
    $totalPg = $preparedPages;   // on n'annonce que ce qu'on peut servir
    @file_put_contents(__DIR__ . '/data/_security_log.txt',
        date('c') . ' [SPDF_INCOMPLET] id=' . $id . ' disque=' . $preparedPages
        . ' annonce=' . $attenduPg . " — livre à re-déposer\n", FILE_APPEND);
}

// ── SIGNER une fenêtre de pages (bail de lecture) ──
if ($wantSign) {
    while (ob_get_level() > 0) { ob_end_clean(); }
    header('Content-Type: application/json; charset=utf-8');
    header('Cache-Control: no-store');
    $who  = spdf_identity($acc);
    $from = max(1, $signFrom);
    $cnt  = max(1, min(SPDF_WINDOW_MAX, $signCount ?: 1));
    $exp  = time() + SPDF_LEASE_TTL;
    $pages = [];
    for ($p = $from; $p < $from + $cnt; $p++) {
        if ($totalPg > 0 && $p > $totalPg) break;
        if (!$hasFull && $p > $freePg) break;   // le mur d'aperçu reste le mur
        $pages[] = $p;
    }
    if (!$pages) { echo json_encode(['ok' => true, 'exp' => $exp, 'sigs' => new stdClass()]); exit; }
    if (spdf_budget($who, $id, $pages, SPDF_PAGES_PER_HOUR)) {
        @file_put_contents(__DIR__ . '/data/_security_log.txt',
            date('c') . ' [SPDF_QUOTA] id=' . $id . ' who=' . $who . ' ip=' . vrt_client_ip() . "\n", FILE_APPEND);
        spdf_err(429, 'Beaucoup de pages consultées sur la dernière heure. La lecture redevient possible un peu plus tard.');
    }
    $sigs = [];
    foreach ($pages as $p) $sigs[(string) $p] = spdf_sig($id, $p, $who, $exp);
    echo json_encode(['ok' => true, 'exp' => $exp, 'ttl' => SPDF_LEASE_TTL, 'sigs' => $sigs]);
    exit;
}

// ── META : informations pour le client (pas d'image) ──
if ($wantMeta) {
    while (ob_get_level() > 0) { ob_end_clean(); }
    header('Content-Type: application/json; charset=utf-8');
    header('Cache-Control: no-store');
    echo json_encode([
        'ok'        => true,
        'id'        => $id,
        'pages'     => $totalPg,
        'freePages' => $freePg,
        'hasAccess' => $hasFull,
        'prepared'  => (bool) $prepared,
        // Le livre est-il entier sur le serveur ? `pages` ne compte que ce
        // qui est servable ; `attendu` dit ce que le catalogue promettait.
        'incomplet' => (bool) $incomplet,
        'attendu'   => (int) $attenduPg,
        'titre'     => (string) ($book['titre'] ?? ''),
    ], JSON_UNESCAPED_UNICODE);
    exit;
}

// ── Servir UNE page ──
if ($page < 1) spdf_err(400, 'page invalide');

// Mur d'aperçu : au-delà de freePages, accès complet requis.
if (!$hasFull && $page > $freePg) {
    @file_put_contents(__DIR__ . '/data/_security_log.txt',
        date('c') . ' [SPDF_LOCKED] id=' . $id . ' page=' . $page
        . ' user=' . substr((string) ($acc['user'] ?? 'anon'), 0, 40) . ' ip=' . vrt_client_ip() . "\n", FILE_APPEND);
    spdf_err(402, 'Page réservée — achetez la version numérique pour débloquer la suite.');
}
if ($totalPg > 0 && $page > $totalPg) spdf_err(404, 'Page hors limites');

/* Signature obligatoire AU-DELÀ de l'aperçu gratuit. L'aperçu reste ouvert :
   il est public par destination (c'est l'argument de vente), et l'exiger
   casserait net les clients servis depuis un cache antérieur. Le contenu payé,
   lui, n'est plus atteignable par une URL nue, même munie du jeton de session. */
if ($page > $freePg) {
    $who = spdf_identity($acc);
    if ($qExp < time() || $qSig === '' || !hash_equals(spdf_sig($id, $page, $who, $qExp), $qSig)) {
        spdf_err(403, 'Lien de page expiré ou invalide — rechargez le lecteur.');
    }
}

// Anti-hotlink léger : si Referer présent, il doit venir d'une origine connue.
$ref = $_SERVER['HTTP_REFERER'] ?? '';
if ($ref !== '') {
    $okRef = false;
    foreach ($__allowed as $o) { if (strpos($ref, $o) === 0) { $okRef = true; break; } }
    if (!$okRef) spdf_err(403, 'Origine non autorisée');
}

// ── Obtenir l'image de la page (pré-rendu, sinon Imagick) ──
$pageJpegPath = $bookDir ? sprintf('%s/p%03d.jpg', $bookDir, $page) : null;
$jpegData = null;
if ($pageJpegPath && is_file($pageJpegPath)) {
    $jpegData = @file_get_contents($pageJpegPath);
} elseif ($pdfFile && is_file($pdfFile) && class_exists('Imagick')) {
    // Rendu à la volée + cache disque (idempotent).
    try {
        $im = new Imagick();
        $im->setResolution(120, 120);
        $im->readImage($pdfFile . '[' . ($page - 1) . ']'); // 0-indexed
        $im->setImageBackgroundColor('white');
        $im = $im->flattenImages();
        $im->setImageFormat('jpeg');
        $im->setImageCompressionQuality(78);
        $im->resizeImage(1240, 0, Imagick::FILTER_LANCZOS, 1); // largeur max 1240px
        $jpegData = $im->getImageBlob();
        if ($bookDir) { @mkdir($bookDir, 0750, true); @file_put_contents($pageJpegPath, $jpegData); }
        $im->clear();
    } catch (Throwable $e) {
        spdf_err(409, 'Document non préparé sur ce serveur (Imagick indisponible).');
    }
} else {
    spdf_err(409, 'Document non encore préparé. (Déposez les images de pages ou activez Imagick.)');
}
if (!$jpegData) spdf_err(500, 'Lecture de page impossible');

// ── FILIGRANE personnalisé (traçabilité) via GD ──
$wmText = ($acc ? ((string) ($acc['nom'] ?? '') . ' ' . (string) ($acc['pre'] ?? '') . ' · ' . $accId) : 'Aperçu')
        . ' · ' . date('d/m/Y');
if (function_exists('imagecreatefromstring')) {
    $img = @imagecreatefromstring($jpegData);
    if ($img !== false) {
        $w = imagesx($img); $h = imagesy($img);
        // Filigrane diagonal répété, gris très clair (lisible mais discret).
        $col = imagecolorallocatealpha($img, 90, 100, 130, 110);
        if (function_exists('imagettftext') && is_file(__DIR__ . '/_wm.ttf')) {
            for ($yy = 80; $yy < $h; $yy += 240) {
                for ($xx = -100; $xx < $w; $xx += 360) {
                    @imagettftext($img, 16, 30, $xx, $yy, $col, __DIR__ . '/_wm.ttf', $wmText);
                }
            }
        } else {
            // Repli sans police TTF : texte bitmap répété.
            for ($yy = 60; $yy < $h; $yy += 150) {
                for ($xx = 20; $xx < $w; $xx += 300) {
                    @imagestring($img, 3, $xx, $yy, $wmText, $col);
                }
            }
        }
        // Bandeau bas (origine + ID — toujours visible sur une capture).
        $bar = imagecolorallocatealpha($img, 20, 37, 84, 40);
        imagefilledrectangle($img, 0, $h - 26, $w, $h, $bar);
        $white = imagecolorallocate($img, 255, 255, 255);
        @imagestring($img, 3, 10, $h - 22, 'VÉRITAS Academy · veritas-school.com · ' . $wmText, $white);
        ob_start(); imagejpeg($img, null, 82); $jpegData = ob_get_clean();
        imagedestroy($img);
    }
}

// ── Journaliser l'accès légitime ──
@file_put_contents(__DIR__ . '/data/_access_log.txt',
    date('c') . ' SPDF id=' . $id . ' p=' . $page . ' user=' . substr((string) ($acc['user'] ?? 'anon'), 0, 40)
    . ' ' . round(strlen($jpegData) / 1024) . 'ko ip=' . vrt_client_ip() . "\n", FILE_APPEND);

while (ob_get_level() > 0) { ob_end_clean(); }
header('Content-Type: image/jpeg');
header('Cache-Control: private, no-store, max-age=0');
header('Pragma: no-cache');
header('Content-Length: ' . strlen($jpegData));
header('Content-Disposition: inline'); // jamais d'attachment → pas de "save as" suggéré
echo $jpegData;
exit;
