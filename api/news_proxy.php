<?php
// ============================================================
// VÉRITAS — Proxy RSS Actualités Éducatives
// GET /api/news_proxy.php?cat=education|minesec|grandes_ecoles|bourses
// ── Public (pas d'auth), cache 30 min ──
// ============================================================
header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: public, max-age=1800');

$feeds = [
    'education'     => 'https://news.google.com/rss/search?q=education+cameroun+scolaire&hl=fr&gl=CM&ceid=CM:fr',
    'minesec'       => 'https://news.google.com/rss/search?q=MINESEC+cameroun+enseignement+secondaire&hl=fr&gl=CM&ceid=CM:fr',
    'grandes_ecoles'=> 'https://news.google.com/rss/search?q=grandes+%C3%A9coles+concours+universit%C3%A9+cameroun&hl=fr&gl=CM&ceid=CM:fr',
    'bourses'       => 'https://news.google.com/rss/search?q=bourses+%C3%A9tudes+cameroun+2026+candidature&hl=fr&gl=CM&ceid=CM:fr',
];

$cat = isset($_GET['cat']) ? $_GET['cat'] : 'education';
if (!array_key_exists($cat, $feeds)) {
    echo json_encode(['error' => 'Catégorie invalide. Valeurs: ' . implode(', ', array_keys($feeds))]);
    exit;
}

// Cache fichier — 30 minutes
$cacheDir  = sys_get_temp_dir() . '/';
$cacheFile = $cacheDir . 'veritas_news_' . $cat . '.json';
if (file_exists($cacheFile) && (time() - filemtime($cacheFile)) < 1800) {
    $cached = json_decode(file_get_contents($cacheFile), true);
    $cached['from_cache'] = true;
    echo json_encode($cached);
    exit;
}

// Récupérer le flux RSS
$ctx = stream_context_create([
    'http' => [
        'timeout' => 12,
        'header'  => "User-Agent: Mozilla/5.0 (compatible; VERITAS-News/1.0)\r\n",
    ],
    'ssl' => [
        'verify_peer'      => false,
        'verify_peer_name' => false,
    ],
]);

$xml = @file_get_contents($feeds[$cat], false, $ctx);
if (!$xml) {
    // Retourner un résultat vide plutôt qu'une erreur dure
    echo json_encode(['items' => [], 'error' => 'Flux temporairement indisponible']);
    exit;
}

$rss = @simplexml_load_string($xml);
if (!$rss || !isset($rss->channel->item)) {
    echo json_encode(['items' => [], 'error' => 'Flux non analysable']);
    exit;
}

$items = [];
foreach ($rss->channel->item as $item) {
    $title  = html_entity_decode((string)$item->title, ENT_QUOTES, 'UTF-8');
    $link   = (string)$item->link;
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
    $dateStr   = $ts ? date('d/m/Y', $ts) : $date;

    $items[] = [
        'title'  => $title,
        'link'   => $link,
        'date'   => $dateStr,
        'source' => $source,
    ];

    if (count($items) >= 12) break;
}

$result = ['items' => $items, 'from_cache' => false, 'cat' => $cat];
@file_put_contents($cacheFile, json_encode($result));
echo json_encode($result);
