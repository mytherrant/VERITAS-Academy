<?php
/**
 * ============================================================================
 *  VÉRITAS — Page « introuvable », servie par PHP pour n'être JAMAIS mise en cache
 *  © 2024-2026 Jacques Miterand TAKOU (Mythe Errant). Tous droits réservés.
 * ============================================================================
 *
 * POURQUOI CE FICHIER EXISTE — un incident mesuré le 07/09/2026
 *
 * Un fichier de validation Google Search Console a été déposé à la racine du
 * site. Une seconde AVANT la fin du transfert FTP, son adresse a été demandée :
 * le serveur a répondu 404, et LiteSpeed a mis cette 404 en cache sous cette
 * URL exacte. Le fichier est arrivé juste après — et il est resté introuvable.
 *
 * La signature est nette et reproductible :
 *     /google<jeton>.html        → 404  (la réponse en cache)
 *     /google<jeton>.html?x=1    → 200  (clé de cache neuve, lit le disque)
 *
 * Un cache d'erreur est une erreur qui se fige. Ici elle bloquait la validation
 * du site auprès de Google ; demain elle rendra introuvable n'importe quel
 * fichier neuf dont l'adresse aura été demandée une fois de trop tôt — et rien
 * ne le dira, puisque le fichier EST sur le serveur.
 *
 * POURQUOI PAS UNE DIRECTIVE DANS .htaccess
 *
 * C'était la première idée : `Header set X-LiteSpeed-Cache-Control "no-cache"`
 * conditionné au statut 404. Mais LWS a déjà REFUSÉ deux directives de ce
 * dépôt, et un .htaccess refusé n'est pas « à moitié appliqué » : il est ignoré
 * EN ENTIER, et le site répond 500. C'est arrivé le 19/08 (RemoveHandler) puis
 * le 28/08 (un Require posé à nu). Le risque n'est pas la page d'erreur : c'est
 * tout le site.
 *
 * Une page PHP, elle, ne peut rater que les pages d'erreur. On échange un
 * risque total contre un risque local — et on ne pose aucune directive neuve :
 * `ErrorDocument` était déjà là, seule sa cible change.
 *
 * CE QUE CE FICHIER NE CHANGE PAS
 * Le contenu affiché reste `404.html`, à l'octet près : c'est la même page,
 * avec les mêmes liens. On n'ajoute que trois en-têtes et le bon code HTTP.
 */

// ── Le code HTTP D'ABORD ────────────────────────────────────────────────────
// Sans cette ligne, PHP répondrait 200 avec le contenu d'une page d'erreur :
// Google et les navigateurs croiraient la page valide, et l'indexeraient.
http_response_code(404);

// ── Les en-têtes qui empêchent la mise en cache ─────────────────────────────
// `X-LiteSpeed-Cache-Control` est celui qui compte ici — c'est le cache de
// l'hébergeur qui a figé la 404. Les deux autres couvrent les intermédiaires
// et le navigateur ; ils sont déjà posés sur les .html par .htaccess, on les
// répète parce que cette réponse-ci ne passe pas forcément par la même règle.
header('X-LiteSpeed-Cache-Control: no-cache, esi=off');
header('Cache-Control: no-store, no-cache, must-revalidate, max-age=0');
header('Pragma: no-cache');
header('Content-Type: text/html; charset=utf-8');

// ── Le corps : la page existante, inchangée ─────────────────────────────────
// Si elle venait à manquer (déploiement partiel), on ne renvoie pas une page
// blanche : un message court vaut mieux qu'un écran vide, et le code 404 est
// déjà posé — ce qui compte pour un moteur de recherche.
$page = __DIR__ . '/404.html';
if (is_file($page)) {
    readfile($page);
} else {
    echo '<!DOCTYPE html><html lang="fr"><head><meta charset="utf-8">'
       . '<title>Page introuvable — Centre VÉRITAS</title>'
       . '<meta name="robots" content="noindex,nofollow"></head><body>'
       . '<h1>Page introuvable</h1><p>L\'adresse demandée n\'existe pas. '
       . '<a href="/">Retour à l\'accueil</a></p></body></html>';
}
