<?php
/**
 * tests/banc_livrets_admin.php — LA PAGE « LIVRETS » DE L'ADMINISTRATION
 * TIENT-ELLE SES PROMESSES CÔTÉ SERVEUR ?
 * © 2024-2026 Jacques Miterand TAKOU (Mythe Errant).
 *
 *   php tests/banc_livrets_admin.php
 *
 * La page règle quatre tranches de DB.tarifs (livretFiches, livretRetires,
 * livretParOuvrage, livretPromos). Ce banc vérifie que le SERVEUR les
 * applique — c'est lui qui décide du prix exigé et de ce qui se vend :
 *   ① une fiche ajoutée entre au catalogue (non disponible sans contenu) ;
 *   ② une fiche corrige le titre d'un ouvrage existant ;
 *   ③ un ouvrage retiré reste au catalogue mais n'est plus disponible ;
 *   ④ une promotion change le prix exigé, la promo d'ouvrage bat la générale ;
 *   ⑤ une promotion hors dates ne s'applique pas ;
 *   ⑥ après la fin, le prix promo reste admis 48 h à la vérification, pas plus.
 */
declare(strict_types=1);

$racine = dirname(__DIR__);
$tmp = sys_get_temp_dir() . '/vrt_livrets_admin_' . getmypid();
@mkdir($tmp, 0700, true);
register_shutdown_function(function () use ($tmp) {
    foreach (glob($tmp . '/*') ?: [] as $f) { if (is_file($f)) @unlink($f); }
    @rmdir($tmp);
});

$auj  = date('Y-m-d');
$hier = date('Y-m-d', time() - 86400);
$avantHier3 = date('Y-m-d', time() - 3 * 86400);
$demain = date('Y-m-d', time() + 86400);

$tarifs = [
    'livret' => 1500,
    'livretFiches'  => [
        'nouveau-cahier' => ['titre' => 'Nouveau cahier', 'niveau' => '2nde', 'kinds' => ['livret'], 'cree' => true],
        '6e'             => ['titre' => 'Sixième (titre corrigé)'],
    ],
    'livretRetires' => ['5e' => true],
    'livretPromos'  => [
        '*'  => ['pct' => 10, 'debut' => '', 'fin' => ''],
        '4e' => ['pct' => 20, 'debut' => $auj, 'fin' => $demain],
        '3e' => ['pct' => 50, 'debut' => $demain, 'fin' => ''],        // pas encore commencée
        '2nde' => ['pct' => 30, 'debut' => '', 'fin' => $hier],        // finie hier → tolérée 48 h
        'nouveau-cahier' => ['pct' => 40, 'debut' => '', 'fin' => $avantHier3], // finie il y a 3 j
    ],
];
$dbFile = $tmp . '/veritas_db.json';
file_put_contents($dbFile, json_encode(['tarifs' => $tarifs]));
define('VRT_DB_FICHIER', $dbFile);
define('VRT_LIVRET_CATALOGUE', $tmp . '/absent.json');   // repli : les cinq classes d'origine
define('VRT_LIVRET_DIR', $tmp);
if (!defined('VRT_PRICE_ENFORCE')) define('VRT_PRICE_ENFORCE', 'strict');

require_once $racine . '/api/_auth_lib.php';
require_once $racine . '/api/_livret_lib.php';

$V = "\033[32m✓\033[0m"; $X = "\033[31m✗\033[0m"; $G = "\033[1m"; $R = "\033[0m";
$ok = 0; $ko = 0;
function dit(bool $b, string $m, string $det = ''): void {
    global $ok, $ko, $V, $X;
    if ($b) { $ok++; echo "  $V $m\n"; } else { $ko++; echo "  $X $m" . ($det ? "  → $det" : '') . "\n"; }
}

$db  = ['tarifs' => $tarifs];
$cat = vrt_livret_catalogue();
echo "\n{$G}LA PAGE « LIVRETS » — RÈGLES SERVEUR{$R}\n\n";

echo "{$G}1. Fiches{$R}\n";
dit(isset($cat['nouveau-cahier']), 'une fiche ajoutée entre au catalogue');
dit(($cat['nouveau-cahier']['niveau'] ?? '') === '2nde', 'avec son niveau');
dit(empty(vrt_livret_etat('nouveau-cahier')['disponible']), 'mais n’est pas disponible tant que son contenu manque');
dit(($cat['6e']['titre'] ?? '') === 'Sixième (titre corrigé)', 'une fiche corrige le titre d’un ouvrage existant');
dit(in_array('guide', $cat['6e']['kinds'] ?? [], true), 'sans effacer ce qu’elle ne précise pas (versions)');

echo "\n{$G}2. Retrait de la vente{$R}\n";
dit(isset($cat['5e']), 'un ouvrage retiré reste au catalogue (codes vendus)');
dit(!empty($cat['5e']['retire']), 'marqué « retiré »');
$e5 = vrt_livret_etat('5e');
dit(empty($e5['disponible']) && !empty($e5['retire']), 'et vrt_livret_etat() le ferme à la vente');

echo "\n{$G}3. Promotions{$R}\n";
dit(vrt_livret_prix_normal($db, 'livret', '4e') === 1500, 'prix normal 4e : 1 500');
dit(vrt_livret_prix($db, 'livret', '4e') === 1200, 'promo d’ouvrage −20 % : 1 200 (bat la générale)', (string) vrt_livret_prix($db, 'livret', '4e'));
dit(vrt_livret_prix($db, 'livret', '6e') === 1350, 'promo générale −10 % : 1 350', (string) vrt_livret_prix($db, 'livret', '6e'));
dit(vrt_livret_prix($db, 'guide', '6e') === 4500, 'elle vaut aussi pour le guide : 4 500', (string) vrt_livret_prix($db, 'guide', '6e'));
dit(vrt_livret_prix($db, 'livret', '3e') === 1350, 'promo pas encore commencée → la générale s’applique', (string) vrt_livret_prix($db, 'livret', '3e'));
dit(vrt_livret_prix($db, 'livret', '2nde') === 1350, 'promo finie hier → plus affichée', (string) vrt_livret_prix($db, 'livret', '2nde'));
dit(vrt_livret_prix_pack($db, 'livret', 10, '4e') === 10800, 'pack de 10 en promo : 1 200 × 10, −10 % de volume = 10 800', (string) vrt_livret_prix_pack($db, 'livret', 10, '4e'));

echo "\n{$G}4. Le prix exigé au paiement{$R}\n";
$v = vrt_verifier_prix($db, ['intent' => 'livret', 'targetId' => '4e:livret', 'montant' => 1200]);
dit($v['ok'], '4e payé 1 200 pendant la promo : accepté');
$v = vrt_verifier_prix($db, ['intent' => 'livret', 'targetId' => '4e:livret', 'montant' => 1000]);
dit(!$v['ok'], '4e payé 1 000 : refusé (sous-paiement)');
$v = vrt_verifier_prix($db, ['intent' => 'livret', 'targetId' => '2nde:livret', 'montant' => 1050]);
dit($v['ok'], '2nde payée au prix promo le lendemain de la fin : toléré (48 h)');
$v = vrt_verifier_prix($db, ['intent' => 'livret', 'targetId' => 'nouveau-cahier:livret', 'montant' => 900]);
dit(!$v['ok'], 'promo finie il y a 3 jours : son prix est refusé (délai de 48 h dépassé)');
$v = vrt_verifier_prix($db, ['intent' => 'livret', 'targetId' => '3e:livret', 'montant' => 750]);
dit(!$v['ok'], 'promo pas encore commencée : son prix est refusé');

echo "\n" . ($ko ? "{$G}\033[31m  ✗ $ko contrôle(s) au rouge, $ok au vert.{$R}\n" : "{$G}\033[32m  ✓ $ok/$ok — la page Livrets tient ses promesses.{$R}\n");
exit($ko ? 1 : 0);
