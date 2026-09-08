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
/* ── Ce que sert la racine du site ────────────────────────────────────────
 * Depuis la refonte d'août 2026, « / » sert la VITRINE PUBLIQUE
 * (vitrine.html) et non plus la coquille applicative. L'application reste
 * accessible telle quelle sur /app.html — c'est là que pointent le bouton
 * « Mon compte », les espaces élève/parent/enseignant, et les 64 pages
 * statiques qui renvoient vers #tarifs, #boutique, #cagnotte, etc.
 *
 * Repli volontaire sur app.html : si vitrine.html venait à manquer sur le
 * serveur (déploiement partiel), le visiteur retombe sur l'application
 * plutôt que sur une page de maintenance. Le site reste debout.
 */
/* ── POURQUOI CE FICHIER DOIT CHANGER A CHAQUE REFONTE DE LA VITRINE ──────
 * LiteSpeed garde une entree de cache pour « / » et ne la lache que si
 * index.php change. Le 08/09/2026, un deploiement a mis vitrine.html a jour
 * sans toucher ce fichier : /index.php et /vitrine.html rendaient le nouveau
 * bandeau, « / » rendait celui de la veille — et « / » est la seule adresse
 * qu'ouvre un visiteur. Le .htaccess porte desormais un bloc no-cache pour
 * index.php, mais il n'invalide pas une entree deja posee : seule une
 * modification de CE fichier le fait. Empreinte de la vitrine servie, mise a
 * jour a chaque refonte pour forcer cette invalidation : 2026-09-08b
 */
$vitrine = __DIR__ . '/vitrine.html';
$appFile = file_exists($vitrine) ? $vitrine : __DIR__ . '/app.html';

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
