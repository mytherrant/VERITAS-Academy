<?php
// ============================================================
// VÉRITAS Academy — Wrapper PHP anti-cache LiteSpeed
// Ce fichier sert app.html avec des en-têtes no-cache forcés.
// LiteSpeed met en cache les fichiers .html statiques et ignore
// les directives .htaccess — passer par PHP bypass ce cache.
// ============================================================
header('Cache-Control: no-store, no-cache, must-revalidate, max-age=0');
header('Pragma: no-cache');
header('Expires: Thu, 01 Jan 1970 00:00:00 GMT');
header('Content-Type: text/html; charset=utf-8');

$appFile = __DIR__ . '/app.html';
if (!file_exists($appFile)) {
    http_response_code(503);
    echo '<!DOCTYPE html><html><body><h2>VÉRITAS — Maintenance en cours. Revenez dans quelques instants.</h2></body></html>';
    exit;
}

readfile($appFile);
