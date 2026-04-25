<?php
// ============================================================
// VÉRITAS Academy — Wrapper PHP anti-cache LiteSpeed v2
// Ce fichier sert app.html avec des en-têtes no-cache forcés.
// LiteSpeed met en cache les fichiers .html statiques et ignore
// les directives .htaccess — passer par PHP bypass ce cache.
// ============================================================
$appFile = __DIR__ . '/app.html';

// ETag basé sur la date de modification du fichier → invalide le cache à chaque déploiement
$etag = file_exists($appFile) ? '"' . filemtime($appFile) . '"' : '"0"';

header('Cache-Control: no-store, no-cache, must-revalidate, max-age=0');
header('Pragma: no-cache');
header('Expires: Thu, 01 Jan 1970 00:00:00 GMT');
header('Surrogate-Control: no-store');
header('X-LiteSpeed-Cache-Control: no-cache, esi=off');
header('ETag: ' . $etag);
header('Last-Modified: ' . (file_exists($appFile) ? gmdate('D, d M Y H:i:s', filemtime($appFile)) . ' GMT' : 'Thu, 01 Jan 1970 00:00:00 GMT'));
header('Content-Type: text/html; charset=utf-8');

if (!file_exists($appFile)) {
    http_response_code(503);
    echo '<!DOCTYPE html><html><body><h2>VÉRITAS — Maintenance en cours. Revenez dans quelques instants.</h2></body></html>';
    exit;
}

readfile($appFile);
