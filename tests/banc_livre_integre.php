<?php
/**
 * tests/banc_livre_integre.php — UN LIVRE AMPUTÉ NE SE VEND PAS
 * © 2024-2026 Jacques Miterand TAKOU (Mythe Errant).
 *
 *   php tests/banc_livre_integre.php
 *
 * CE QU'IL PROTÈGE
 *   Le 01/09/2026, un CAHIER tronqué à l'envoi FTP s'est vendu, livré, et
 *   affiché vide sous le filigrane de l'acheteur — `is_file()` le déclarait
 *   parfait. Le remède posé alors est bon : le catalogue ne dit plus
 *   « disponible » sur l'existence du fichier, mais sur ses BORNES.
 *
 *   Les LIVRES n'avaient pas reçu ce remède. `vrt_livre_prepare()` se
 *   contentait de compter AU MOINS UNE page, et le nombre annoncé au lecteur
 *   — 144 pour Le Tube digestif — venait du catalogue sans jamais être
 *   confronté au disque. Un transfert coupé à la douzième page rejouait donc
 *   exactement la panne de septembre, sur un produit à 1 000 F : le lecteur
 *   s'ouvre, annonce 144 pages, et s'arrête à la douzième sans un mot.
 *
 *   Le dépôt se fait par FTP, hors dépôt Git : ni la CI ni aucun banc ne voit
 *   ce dossier. C'est précisément pourquoi la garde doit vivre dans le CODE,
 *   qui, lui, est déployé.
 *
 * ET LES TARIFS
 *   Deux divergences mesurées le 02/09 sur la même chaîne de vente :
 *     · le catalogue public annonçait le guide enseignant à 0 F, en lisant le
 *       champ brut de la fiche au lieu du tarif que le serveur applique ;
 *     · le tunnel d'achat portait 1 500 / 5 000 EN DUR, quand le serveur
 *       promet des tarifs réglables en base. Changer un prix depuis
 *       l'administration aurait fait refuser toutes les ventes légitimes
 *       pour sous-paiement.
 */
declare(strict_types=1);

$racine = dirname(__DIR__);
if (!defined('VRT_PRICE_ENFORCE')) define('VRT_PRICE_ENFORCE', 'strict');
define('VRT_LIVRET_CATALOGUE', $racine . '/api/data/livrets_catalogue.json');

$__lvDir = sys_get_temp_dir() . '/vrt_livre_test_' . getmypid();
@mkdir($__lvDir, 0700, true);
define('VRT_LIVRET_DIR', $__lvDir);

// Bac à sable pour les pages de livre : on n'écrit JAMAIS dans le dossier réel.
$__bkDir = sys_get_temp_dir() . '/vrt_books_test_' . getmypid();
@mkdir($__bkDir . '/livretest', 0700, true);
define('VRT_BOOKS_DIR', $__bkDir);

register_shutdown_function(function () use ($__lvDir, $__bkDir) {
    foreach (glob($__lvDir . '/{,*/}*', GLOB_BRACE) ?: [] as $f) { if (is_file($f)) @unlink($f); }
    @rmdir($__lvDir . '/livret_ventes'); @rmdir($__lvDir);
    foreach (glob($__bkDir . '/{,*/}{,*/}*', GLOB_BRACE) ?: [] as $f) { if (is_file($f)) @unlink($f); }
    foreach (glob($__bkDir . '/*', GLOB_ONLYDIR) ?: [] as $d) { @rmdir($d . '/epub'); @rmdir($d); }
    @rmdir($__bkDir);
});

require_once $racine . '/api/_auth_lib.php';
require_once $racine . '/api/_livret_lib.php';

$V = "\033[32m✓\033[0m"; $X = "\033[31m✗\033[0m"; $G = "\033[1m"; $R = "\033[0m";
$ok = 0; $ko = 0;
function dit(bool $b, string $m, string $det = ''): void {
    global $ok, $ko, $V, $X;
    if ($b) { $ok++; echo "  $V $m\n"; }
    else { $ko++; echo "  $X $m" . ($det ? "  → $det" : '') . "\n"; }
}
function titre(string $t): void { global $G, $R; echo "\n{$G}{$t}{$R}\n"; }

/** Fabrique un livre de $n pages sur le disque du bac à sable. */
function poserLivre(string $id, int $n): void {
    $d = VRT_BOOKS_DIR . '/' . $id;
    @mkdir($d, 0700, true);
    foreach (glob($d . '/p*.jpg') ?: [] as $f) @unlink($f);
    for ($i = 1; $i <= $n; $i++) {
        file_put_contents($d . sprintf('/p%03d.jpg', $i), 'jpeg-factice');
    }
}

echo "\n\033[1m═══ UN LIVRE AMPUTÉ NE SE VEND PAS ═══\033[0m\n";

titre('① Le bac à sable est bien pris en compte');
dit(function_exists('vrt_livre_dossier'),
    'le dossier des livres passe par une fonction — donc surchargeable pour les tests');

titre('② Le compte de pages est CONSTATÉ, pas cru sur parole');
dit(function_exists('vrt_livre_pages_reelles'), 'une fonction compte les pages réellement présentes');
if (function_exists('vrt_livre_pages_reelles')) {
    poserLivre('complet', 144);
    dit(vrt_livre_pages_reelles('complet') === 144, 'un livre complet : 144 pages comptées',
        (string) vrt_livre_pages_reelles('complet'));
    poserLivre('tronque', 12);
    dit(vrt_livre_pages_reelles('tronque') === 12, 'un transfert coupé : 12 pages comptées',
        (string) vrt_livre_pages_reelles('tronque'));
    dit(vrt_livre_pages_reelles('jamais_depose') === 0, 'un livre absent : 0');
}

titre('③ Un livre incomplet n\'est pas « prêt »');
poserLivre('complet', 144);
poserLivre('tronque', 12);
dit(vrt_livre_prepare('complet', 144) === true, 'les 144 pages annoncées sont là → prêt');
dit(vrt_livre_prepare('tronque', 144) === false,
    '12 pages sur 144 annoncées → PAS prêt (c\'est la panne du 01/09)');
dit(vrt_livre_prepare('tronque') === true,
    'sans nombre annoncé, on ne peut rien comparer : le livre reste servi');
dit(vrt_livre_prepare('jamais_depose', 144) === false, 'un livre absent n\'est jamais prêt');

titre('④ Une page de plus que prévu ne bloque pas la vente');
poserLivre('genereux', 146);
dit(vrt_livre_prepare('genereux', 144) === true,
    '146 pages pour 144 annoncées → prêt (une page de garde n\'est pas une avarie)');

titre('⑤ Le lecteur annonce ce qu\'il PEUT servir');
$src = (string) file_get_contents($racine . '/api/secure_pdf.php');
dit(strpos($src, 'vrt_livre_pages_reelles') !== false,
    'secure_pdf.php confronte le nombre annoncé au disque');
dit(preg_match('/[\'"]incomplet[\'"]\s*=>/', $src) === 1,
    'et le dit au client par un drapeau « incomplet »');

titre('⑥ Le catalogue des cahiers annonce le VRAI prix du guide');
$lv = (string) file_get_contents($racine . '/api/livret.php');
dit(!preg_match("/'prixGuide'\s*=>\s*\(int\)\s*\(\\\$o\['prixGuide'\]\s*\?\?\s*0\)/", $lv),
    'livret.php ne rend plus le champ brut de la fiche (qui vaut 0)');
dit(strpos($lv, "vrt_livret_prix(\$__tarifs, 'guide'") !== false,
    'il appelle le tarif que le serveur applique réellement');
dit(strpos($lv, "vrt_livret_prix(\$__tarifs, 'livret'") !== false,
    'et fait de même pour le livret');

// Et la valeur elle-même : le guide ne se brade pas au prix du livret.
$dbVide = [];
dit(vrt_livret_prix($dbVide, 'guide', '6e') === 5000, 'le guide vaut 5 000 F par défaut',
    (string) vrt_livret_prix($dbVide, 'guide', '6e'));
dit(vrt_livret_prix($dbVide, 'livret', '6e') === 1500, 'le livret vaut 1 500 F par défaut');
/* PRÉSÉANCE — trois crans, du plus précis au plus général. Le catalogue déposé
   porte `prix: 1500` sur LES QUINZE ouvrages : sans le cran « par ouvrage », le
   réglage général n'avait aucun effet sur un cahier, alors qu'il est annoncé
   « réglable sans redéploiement ». La promesse était fausse en silence. */
$dbRegle = ['tarifs' => ['livret' => 2000, 'livretGuide' => 6000]];
dit(vrt_livret_prix($dbRegle, 'guide', '6e') === 6000,
    'le guide suit le réglage général — le catalogue ne lui donne aucun prix');
dit(vrt_livret_prix($dbRegle, 'livret', '6e') === 1500,
    'le livret garde le prix du catalogue : c\'est lui qui fait autorité sur l\'ouvrage');

$dbOuvrage = ['tarifs' => ['livret' => 2000, 'livretParOuvrage' => ['6e' => ['livret' => 2500]]]];
dit(vrt_livret_prix($dbOuvrage, 'livret', '6e') === 2500,
    'un réglage PAR OUVRAGE en base l\'emporte sur le catalogue',
    (string) vrt_livret_prix($dbOuvrage, 'livret', '6e'));
dit(vrt_livret_prix($dbOuvrage, 'livret', '5e') === 1500,
    'et il ne déborde pas sur les autres ouvrages');

titre('⑦ Le tunnel d\'achat suit le tarif du serveur');
$gate = (string) file_get_contents($racine . '/livrets/gate.js');
dit(preg_match('/resoudreTarifs\s*\(\s*\)\s*\R?\s*\.then\s*\(\s*resoudrePasserelle/', $gate) === 1,
    'le tunnel lit les tarifs AVANT de calculer le montant qu\'il envoie');
dit(strpos($gate, 'catalogue') !== false && preg_match('/PRIX\s*\.\s*livret\s*=|PRIX\.livret\s*=/', $gate) === 1,
    'il lit les tarifs annoncés par le catalogue du serveur');
dit(preg_match('/PRIX\s*=\s*\{\s*livret\s*:\s*1500\s*,\s*guide\s*:\s*5000\s*\}/', $gate) === 1,
    'et garde 1 500 / 5 000 comme REPLI si le catalogue ne répond pas');

echo "\n" . str_repeat('─', 68) . "\n";
if ($ko === 0) echo "\033[32m\033[1m  ✓ $ok/$ok contrôles passés — rien ne se vend qui ne s'ouvre.\033[0m\n\n";
else           echo "\033[31m\033[1m  ✗ $ko contrôle(s) au rouge sur " . ($ok + $ko) . ".\033[0m\n\n";
exit($ko === 0 ? 0 : 1);
