<?php
/**
 * api/campus/_defaults.php — Valeurs par defaut du backend VÉRITAS Campus.
 * © 2024-2026 Jacques Miterand TAKOU (Mythe Errant). Tous droits réservés.
 *
 * Les SECRETS (mot de passe MySQL, jeton d'installation) vivent dans
 * api/payment_config.php (gitignoré) — comme pour db_sql.php. Ce fichier-ci ne
 * contient que des valeurs publiques + des défauts FAIL-CLOSED.
 */
declare(strict_types=1);

// payment_config.php fournit MYSQL_PASS (déjà utilisé par db_sql.php) et,
// optionnellement, CAMPUS_INSTALL_TOKEN. @include : absent en local = pas de fatale.
@include_once dirname(__DIR__) . '/payment_config.php';

// ── Connexion MySQL (mêmes coordonnées publiques que db_sql.php) ──
if (!defined('CAMPUS_DB_HOST')) define('CAMPUS_DB_HOST', '185.98.131.160');
if (!defined('CAMPUS_DB_NAME')) define('CAMPUS_DB_NAME', 'verit2781684');
if (!defined('CAMPUS_DB_USER')) define('CAMPUS_DB_USER', 'verit2781684');
if (!defined('CAMPUS_DB_PASS')) define('CAMPUS_DB_PASS', defined('MYSQL_PASS') ? MYSQL_PASS : '');

// ── Jeton d'installation/migration (protège migrate.php) ──
// FAIL-CLOSED : si non défini dans payment_config.php → valeur aléatoire inconnue,
// donc migrate.php refuse toute exécution tant que l'admin n'a pas posé un vrai jeton.
if (!defined('CAMPUS_INSTALL_TOKEN')) {
    define('CAMPUS_INSTALL_TOKEN', bin2hex(random_bytes(32)));
}

// ── Durée de vie des sessions (jetons opaques) ──
if (!defined('CAMPUS_TOKEN_TTL_HOURS')) define('CAMPUS_TOKEN_TTL_HOURS', 12);

// ── Coût bcrypt ──
if (!defined('CAMPUS_BCRYPT_COST')) define('CAMPUS_BCRYPT_COST', 12);

// ── Anti-force-brute des connexions (cf. cmp_login_guard dans _auth.php) ──
// Deux compteurs sur une même fenêtre : par IP (un attaquant qui balaie les
// comptes) et par e-mail (un attaquant distribué qui vise un seul compte).
if (!defined('CAMPUS_LOGIN_WINDOW_MIN')) define('CAMPUS_LOGIN_WINDOW_MIN', 15);
if (!defined('CAMPUS_LOGIN_MAX_IP'))    define('CAMPUS_LOGIN_MAX_IP', 10);
if (!defined('CAMPUS_LOGIN_MAX_EMAIL')) define('CAMPUS_LOGIN_MAX_EMAIL', 5);

// ── Domaine racine pour la résolution par sous-domaine (slug.<racine>) ──
if (!defined('CAMPUS_ROOT_DOMAIN')) define('CAMPUS_ROOT_DOMAIN', 'veritas-campus.com');

// ── Mode de déploiement : 'managed' (hébergé VÉRITAS, multi-tenant sous-domaine)
//    | 'self' (serveur en ligne de l'école) | 'local' (PC du proviseur). ──
if (!defined('CAMPUS_MODE')) define('CAMPUS_MODE', 'managed');
// ── Établissement imposé pour les installs MONO-établissement (self/local) :
//    poser le slug ici dans payment_config.php → plus besoin de sous-domaine.
//    Vide en 'managed' → l'établissement est résolu par le sous-domaine. ──
if (!defined('CAMPUS_FIXED_TENANT')) define('CAMPUS_FIXED_TENANT', '');
