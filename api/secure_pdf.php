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
ob_start();
require_once __DIR__ . '/_auth_lib.php';

$__allowed = [
    'https://veritas-school.com', 'https://www.veritas-school.com',
    'http://localhost:8000', 'https://localhost', 'capacitor://localhost',
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

function spdf_err(int $code, string $msg): void {
    while (ob_get_level() > 0) { ob_end_clean(); }
    http_response_code($code);
    header('Content-Type: application/json; charset=utf-8');
    echo json_encode(['ok' => false, 'error' => $msg], JSON_UNESCAPED_UNICODE);
    exit;
}

// ── Rate-limit (anti aspiration massive de pages) ──
if (vrt_rate_exceeded('spdf', 120)) spdf_err(429, 'Trop de requêtes — patientez une minute.');

// ── Entrées ──
$method = $_SERVER['REQUEST_METHOD'];
$id = ''; $page = 0; $token = ''; $login = ''; $pass = ''; $wantMeta = false;
if ($method === 'GET') {
    $id    = (string) ($_GET['id'] ?? '');
    $page  = (int) ($_GET['page'] ?? 0);
    $token = (string) ($_GET['token'] ?? '');
    $wantMeta = isset($_GET['meta']);
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
$preparedPages = 0;
if ($bookDir && is_dir($bookDir)) {
    $preparedPages = count(glob($bookDir . '/p*.jpg') ?: []);
}
if ($totalPg <= 0) $totalPg = $preparedPages;
$prepared = ($preparedPages > 0) || ($pdfFile && is_file($pdfFile) && class_exists('Imagick'));

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
