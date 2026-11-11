<?php
require_once __DIR__ . '/_json_boot.php'; // display_errors=0 + purge des parasites avant le JSON (voir _json_boot.php)
// ============================================================
// VÉRITAS — Proxy RSS Actualités Éducatives
// © 2024-2026 Jacques Miterand TAKOU (Mythe Errant). Tous droits réservés.
// Œuvre protégée — Loi n° 2000/011 + Convention de Berne.
// Reproduction interdite sans accord écrit. Contrefaçon : 5-10 ans prison +
// 500 000 à 10 000 000 FCFA d'amende. contact@veritas-school.com
//
// GET /api/news_proxy.php?cat=education|minesec|grandes_ecoles|bourses|bepc|probatoire|bac
// ── Public (pas d'auth), cache 30 min ──
// ============================================================
// v1.2.2 : allowlist au lieu de '*'
$__np_allowed = [
    'https://veritas-school.com', 'https://www.veritas-school.com',
    'http://localhost:8000', 'http://localhost:8077', 'https://localhost', 'capacitor://localhost',
];
$__np_origin = $_SERVER['HTTP_ORIGIN'] ?? '';
if (in_array($__np_origin, $__np_allowed, true)) {
    header('Access-Control-Allow-Origin: ' . $__np_origin);
    header('Vary: Origin');
}
header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: public, max-age=1800');

// ── 🛡️ SENTINELLE (v2.0) ────────────────────────────────────────────────
// Placée AVANT tout travail : un moissonneur ne doit pas nous coûter une
// lecture de base ni un appel réseau pour se voir refuser ensuite.
// Profil « lecture ». Un débit anormal reçoit un défi (429), pas un bannissement
// — au Cameroun une classe entière partage une IP, et bannir l'IP fermerait
// le site à trente élèves pour un seul emballement.
require_once __DIR__ . '/_sentinel.php';
vrt_sentinelle('lecture');


// 11/11/2026 — « Juste les informations pertinentes et plus récentes »
// (Jacques). Apprendre affichait en novembre les résultats du bac de JUILLET :
// Google News classe par pertinence, et on gardait les 12 premiers. Désormais
// `when:60d` restreint la recherche, puis on trie par date (plus récent
// d'abord) et on écarte tout article de plus de 60 jours. `ts` est renvoyé
// pour que le client trie sans relire la date affichée.
$feeds = [
    'education'     => 'https://news.google.com/rss/search?q=education+cameroun+scolaire+when:60d&hl=fr&gl=CM&ceid=CM:fr',
    'minesec'       => 'https://news.google.com/rss/search?q=MINESEC+cameroun+enseignement+secondaire+when:60d&hl=fr&gl=CM&ceid=CM:fr',
    'grandes_ecoles'=> 'https://news.google.com/rss/search?q=grandes+%C3%A9coles+concours+universit%C3%A9+cameroun+when:60d&hl=fr&gl=CM&ceid=CM:fr',
    'bourses'       => 'https://news.google.com/rss/search?q=bourses+%C3%A9tudes+cameroun+2026+candidature+when:60d&hl=fr&gl=CM&ceid=CM:fr',
    // Apprendre (10/11/2026) : l'actualité de l'examen de la classe choisie.
    'bepc'          => 'https://news.google.com/rss/search?q=BEPC+cameroun+OBC+when:60d&hl=fr&gl=CM&ceid=CM:fr',
    'probatoire'    => 'https://news.google.com/rss/search?q=probatoire+cameroun+OBC+when:60d&hl=fr&gl=CM&ceid=CM:fr',
    'bac'           => 'https://news.google.com/rss/search?q=baccalaur%C3%A9at+cameroun+OBC+when:60d&hl=fr&gl=CM&ceid=CM:fr',
];

$cat = isset($_GET['cat']) ? $_GET['cat'] : 'education';
if (!array_key_exists($cat, $feeds)) {
    echo json_encode(['error' => 'Catégorie invalide. Valeurs: ' . implode(', ', array_keys($feeds))]);
    exit;
}

// Cache fichier — 10 minutes (raccourci pour fraicheur)
// ?nocache=1 bypasse complètement le cache (bouton "Actualiser")
$cacheDir  = sys_get_temp_dir() . '/';
$cacheFile = $cacheDir . 'veritas_news2_' . $cat . '.json';   // « 2 » : format trié par date (11/11/2026)
$noCache   = isset($_GET['nocache']) && $_GET['nocache']==='1';
$cacheAge  = file_exists($cacheFile) ? (time() - filemtime($cacheFile)) : 999999;
// « Actualiser » est public : sans plancher, chaque appel déclenchait une
// requête sortante. Une actualisation par minute suffit (audit 16/10/2026).
if ($noCache && $cacheAge < 60) $noCache = false;
if (!$noCache && file_exists($cacheFile) && $cacheAge < 600) {
    $cached = json_decode(file_get_contents($cacheFile), true);
    $cached['from_cache']  = true;
    $cached['cache_age_s'] = $cacheAge;
    echo json_encode($cached);
    exit;
}
// Si nocache=1, supprimer le fichier cache pour forcer un fetch propre
if ($noCache && file_exists($cacheFile)) @unlink($cacheFile);

// Récupérer le flux RSS — durée TOTALE bornée (11/11/2026).
// L'ancien file_get_contents ne bornait que chaque lecture : le flux « bac »
// pouvait pendre indéfiniment (requête jamais close, encart « Chargement… »
// sans fin dans Apprendre). cURL borne la connexion ET le total, et suit la
// redirection de Google News (gl=CM → gl=FR).
$xml = false;
if (function_exists('curl_init')) {
    $ch = curl_init($feeds[$cat]);
    curl_setopt_array($ch, [
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_FOLLOWLOCATION => true,
        CURLOPT_MAXREDIRS      => 3,
        // Redirections en HTTPS seulement : le flux est affiché sur le site.
        CURLOPT_PROTOCOLS      => CURLPROTO_HTTPS,
        CURLOPT_REDIR_PROTOCOLS=> CURLPROTO_HTTPS,
        CURLOPT_CONNECTTIMEOUT => 4,
        CURLOPT_TIMEOUT        => 8,
        CURLOPT_USERAGENT      => 'Mozilla/5.0 (compatible; VERITAS-News/1.0)',
        // Certificat VÉRIFIÉ (audit 16/10/2026) : sans contrôle, un intermédiaire
        // pouvait injecter le flux affiché sur le site.
        CURLOPT_SSL_VERIFYPEER => true,
        CURLOPT_SSL_VERIFYHOST => 2,
    ]);
    $xml = curl_exec($ch);
    if (curl_getinfo($ch, CURLINFO_HTTP_CODE) !== 200) $xml = false;
    curl_close($ch);
} else {
    $ctx = stream_context_create([
        'http' => ['timeout' => 8, 'header' => "User-Agent: Mozilla/5.0 (compatible; VERITAS-News/1.0)\r\n"],
        'ssl'  => ['verify_peer' => true, 'verify_peer_name' => true],
    ]);
    $xml = @file_get_contents($feeds[$cat], false, $ctx);
}
if (!$xml) {
    // Résultat vide plutôt qu'une erreur dure, mis en cache 2 min : un flux en
    // panne ne doit pas faire attendre 8 s chaque visiteur.
    // La dernière liste valide, même périmée, vaut mieux qu'une liste vide.
    $ancien = file_exists($cacheFile) ? json_decode((string)@file_get_contents($cacheFile), true) : null;
    $vide = (is_array($ancien) && !empty($ancien['items'])) ? $ancien
          : ['items' => [], 'error' => 'Flux temporairement indisponible', 'cat' => $cat];
    @file_put_contents($cacheFile, json_encode($vide));
    @touch($cacheFile, time() - 480);
    echo json_encode($vide);
    exit;
}

$rss = @simplexml_load_string($xml);
if (!$rss || !isset($rss->channel->item)) {
    echo json_encode(['items' => [], 'error' => 'Flux non analysable']);
    exit;
}

$items = [];
$__np_limite = time() - 60 * 86400;
foreach ($rss->channel->item as $item) {
    $title  = html_entity_decode((string)$item->title, ENT_QUOTES, 'UTF-8');
    $link   = (string)$item->link;
    // Seuls des liens web : un « javascript: » venu du flux n'atteint jamais un href.
    if (!preg_match('#^https?://#i', $link)) continue;
    $date   = (string)$item->pubDate;
    $source = '';
    if (isset($item->source)) $source = (string)$item->source;

    // Nettoyer le titre Google News (format : "Titre - Source")
    if (preg_match('/^(.+?)\s+-\s+([^-]+)$/', $title, $m)) {
        $title  = trim($m[1]);
        if (!$source) $source = trim($m[2]);
    }

    // Formater la date
    $ts        = strtotime($date);
    // Sans date lisible ou trop ancien : pas une actualité.
    if (!$ts || $ts < $__np_limite) continue;

    $items[] = [
        'title'  => $title,
        'link'   => $link,
        'date'   => date('d/m/Y', $ts),
        'source' => $source,
        'ts'     => $ts,
    ];
}
usort($items, function ($a, $b) { return $b['ts'] - $a['ts']; });
$items = array_slice($items, 0, 12);

$result = ['items' => $items, 'from_cache' => false, 'cat' => $cat, 'fetched_at' => date('c')];
@file_put_contents($cacheFile, json_encode($result));
echo json_encode($result);
