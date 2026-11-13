<?php
// ============================================================
// VÉRITAS — Réglages publics d'Apprendre (13/11/2026)
// © 2024-2026 Jacques Miterand TAKOU (Mythe Errant). Tous droits réservés.
// ──────────────────────────────────────────────────────────
// GET /api/apprendre_config.php → JavaScript :
//     window.VRT_APP_CFG = { … };
//
// Les pages d'Apprendre (apprendre/*.html) sont STATIQUES. Ce qu'on règle
// dans l'écran admin « Apprendre » (app.js, pgApprendreAdmin) est rangé dans
// DB.apprendreCfg, part au serveur par la synchronisation habituelle
// (api/db.php → data/veritas_db.json) et redescend ici. Chaque page charge ce
// script AVANT commun.js, qui applique les réglages au chargement.
//
// Servi en JavaScript (et non en JSON lu par fetch) : la page doit connaître
// les réglages avant de dessiner, sinon l'élève verrait d'abord l'ancien
// texte, puis le nouveau.
//
// Sans base, sans réglage ou en cas d'erreur : un objet vide. Apprendre
// s'affiche alors exactement comme avant — jamais une page cassée.
// ============================================================
require_once __DIR__ . '/_json_boot.php';

header('Content-Type: application/javascript; charset=utf-8');
header('X-Content-Type-Options: nosniff');
// Une minute : un réglage enregistré se voit vite, sans relire la base à
// chaque page vue.
header('Cache-Control: public, max-age=60');

function vrt_ac_sortir($cfg) {
    $js = json_encode($cfg ?: new stdClass(),
        JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES | JSON_HEX_TAG | JSON_HEX_AMP);
    if ($js === false) $js = '{}';
    echo "window.VRT_APP_CFG=" . $js . ";\n";
    exit;
}

if (($_SERVER['REQUEST_METHOD'] ?? 'GET') !== 'GET') {
    http_response_code(405);
    vrt_ac_sortir(null);
}

$candidates = [
    __DIR__ . '/../data/veritas_db.json',
    __DIR__ . '/data/veritas_db_backup.json',
    __DIR__ . '/../uploads/veritas_db_backup.json',
];
if (defined('VRT_DB_FICHIER') && is_file((string) VRT_DB_FICHIER)) {
    array_unshift($candidates, (string) VRT_DB_FICHIER);
}
$fichier = '';
foreach ($candidates as $c) { if (is_file($c)) { $fichier = $c; break; } }
if ($fichier === '') vrt_ac_sortir(null);

// Cache : la base peut peser plusieurs Mo, les réglages quelques Ko. On ne la
// relit que lorsqu'elle a changé (date de modification).
$cache = __DIR__ . '/../data/_apprendre_cfg.cache.json';
$mt = @filemtime($fichier);
if ($mt && is_file($cache) && @filemtime($cache) >= $mt) {
    $c = json_decode((string) @file_get_contents($cache), true);
    if (is_array($c)) vrt_ac_sortir($c);
}

$db = json_decode((string) @file_get_contents($fichier), true);
$brut = (is_array($db) && isset($db['apprendreCfg']) && is_array($db['apprendreCfg'])) ? $db['apprendreCfg'] : [];

// Liste blanche des rubriques : un champ ajouté demain dans l'admin reste
// privé tant qu'on ne l'a pas déclaré ici.
$CLES = ['ferme', 'fermeTitre', 'fermeTexte', 'bandeau', 'whatsapp', 'classes', 'matieres',
         'groupes', 'familles', 'formules', 'offre', 'cahiers', 'lecons', 'nouvelles',
         'ressources', 'ressourcesAjout', 'calendrier', 'textes', 'maj'];
$cfg = [];
foreach ($CLES as $k) { if (array_key_exists($k, $brut)) $cfg[$k] = $brut[$k]; }

@file_put_contents($cache, json_encode($cfg, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES), LOCK_EX);
vrt_ac_sortir($cfg);
