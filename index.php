<?php
/**
 * ============================================================================
 *  VÉRITAS Academy — Wrapper PHP anti-cache LiteSpeed v2  ·  index.php
 *  © 2024-2026 Jacques Miterand TAKOU (Mythe Errant). Tous droits réservés.
 *
 *  Œuvre originale protégée par le droit d'auteur (Loi camerounaise
 *  n° 2000/011 du 19 décembre 2000 et Convention de Berne).
 *  Reproduction, distribution, modification interdites sans accord écrit.
 *  Contrefaçon : 5-10 ans prison + 500 000 à 10 000 000 FCFA d'amende.
 *  Contact : contact@veritas-school.com  ·  https://veritas-school.com
 *
 *  Ce fichier sert app.html avec des en-têtes no-cache forcés.
 *  LiteSpeed met en cache les fichiers .html statiques et ignore
 *  les directives .htaccess — passer par PHP bypass ce cache.
 * ============================================================================
 */
$appFile = __DIR__ . '/app.html';

// ETag basé sur la date de modification du fichier → invalide le cache à chaque déploiement
$etag = file_exists($appFile) ? '"' . filemtime($appFile) . '"' : '"0"';

// v1.3.1 PERF : `no-cache` (et non `no-store`) → le navigateur garde une copie
// privée mais REVALIDE à chaque visite. Combiné au 304 ci-dessous, les visites
// répétées ne re-téléchargent plus les ~440 Ko du HTML (réponse 304 vide) tout
// en restant toujours à jour (l'ETag change à chaque déploiement).
// Le cache SERVEUR LiteSpeed reste désactivé (X-LiteSpeed-Cache-Control) :
// aucun risque de servir une version périmée à un autre utilisateur.
header('Cache-Control: private, no-cache, must-revalidate, max-age=0');
header('Surrogate-Control: no-store');
header('X-LiteSpeed-Cache-Control: no-cache, esi=off');
header('ETag: ' . $etag);
header('Last-Modified: ' . (file_exists($appFile) ? gmdate('D, d M Y H:i:s', filemtime($appFile)) . ' GMT' : 'Thu, 01 Jan 1970 00:00:00 GMT'));
header('Content-Type: text/html; charset=utf-8');

// v1.3.1 PERF : réponse 304 si le client possède déjà la version courante.
// (L'ETag était envoyé mais If-None-Match n'était jamais lu → toujours 200 plein.)
$inm = trim($_SERVER['HTTP_IF_NONE_MATCH'] ?? '');
if ($inm !== '' && $inm === $etag && file_exists($appFile)) {
    http_response_code(304);
    exit;
}

if (!file_exists($appFile)) {
    http_response_code(503);
    echo '<!DOCTYPE html><html><body><h2>VÉRITAS — Maintenance en cours. Revenez dans quelques instants.</h2></body></html>';
    exit;
}

readfile($appFile);
