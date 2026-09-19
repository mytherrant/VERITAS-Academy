<?php
/**
 * tests/banc_recettes_livres.php — LES PARTS D'AUTEUR REPOSENT SUR L'ARGENT ENCAISSÉ
 * © 2024-2026 Jacques Miterand TAKOU (Mythe Errant).
 *
 *     php tests/banc_recettes_livres.php
 *
 * ── CE QU'IL PROTÈGE ────────────────────────────────────────────────────────
 * Les parts d'auteur se calculaient dans le navigateur comme `vendu × prix` :
 *   · le prix du jour réécrivait l'histoire (repasser un livre de 1 000 à
 *     2 000 F doublait la part de l'auteur sur des ventes passées) ;
 *   · les remises (Code ami, codes promo) n'étaient pas vues ;
 *   · `vendu` ne comptait qu'avec un stock suivi, et jamais le numérique ;
 *   · et ce que le serveur écrivait dans la base, db.php l'écrasait.
 *
 * api/_recettes_lib.php enregistre donc, au paiement confirmé, le montant
 * RÉELLEMENT encaissé pour chaque livre, dans un registre que db.php ne touche
 * pas. Ce banc confirme de vraies ventes et va LIRE ce qui a été enregistré.
 *
 * Base, registres, catalogue et files sont jetables : rien du poste ni de la
 * production n'est lu ni écrit.
 *
 * ── POUR LE FAIRE ROUGIR (éprouvé le 17/09/2026, chiffres mesurés) ───────────
 * Voir la fin de ce fichier : chaque mutation y est listée avec son décompte.
 */
declare(strict_types=1);

$TMP = sys_get_temp_dir() . '/vrt_rec_banc_' . getmypid() . '_' . bin2hex(random_bytes(3));
@mkdir($TMP, 0700, true);
foreach (['parr', 'rec', 'notify', 'livret', 'rate'] as $d) @mkdir("$TMP/$d", 0700, true);
define('VRT_PARR_DIR', "$TMP/parr");
define('VRT_REC_DIR', "$TMP/rec");
define('VRT_NOTIFY_DIR', "$TMP/notify");
define('VRT_LIVRET_DIR', "$TMP/livret");
define('VRT_RATE_DIR', "$TMP/rate");
define('VRT_DB_FICHIER', "$TMP/veritas_db.json");
define('VRT_CATALOGUE_LIVRES', "$TMP/catalogue_livres.json");
if (!defined('VRT_PRICE_ENFORCE')) define('VRT_PRICE_ENFORCE', 'strict');
register_shutdown_function(function () use ($TMP) {
    $it = new RecursiveIteratorIterator(new RecursiveDirectoryIterator($TMP, FilesystemIterator::SKIP_DOTS), RecursiveIteratorIterator::CHILD_FIRST);
    foreach ($it as $f) { $f->isDir() ? @rmdir($f->getPathname()) : @unlink($f->getPathname()); }
    @rmdir($TMP);
});

/* Le catalogue fait foi pour le PRIX CONTRÔLÉ ; la base porte `vendu`, comme en
   production. Trois livres : suivi de stock, sans stock, et un livre au passé
   déjà vendu dix fois avant l'ouverture du registre. */
file_put_contents(VRT_CATALOGUE_LIVRES, json_encode(['version' => 1, 'livres' => [
    ['id' => 'bk_stock',  'titre' => 'Manuel à stock',   'prix' => 1500, 'prixDigital' => 900],
    ['id' => 'bk_libre',  'titre' => 'Manuel sans stock', 'prix' => 1000, 'prixDigital' => 700],
    ['id' => 'bk_passe',  'titre' => 'Manuel au passé',  'prix' => 1000],
]], JSON_UNESCAPED_UNICODE));

require_once __DIR__ . '/../api/_auth_lib.php';

$T = ['ok' => 0, 'ko' => 0, 'echecs' => []];
function ok(string $titre, bool $cond, string $detail = ''): void {
    global $T;
    if ($cond) { $T['ok']++; echo "  \033[32m✓\033[0m $titre\n"; return; }
    $T['ko']++; $T['echecs'][] = $titre . ($detail !== '' ? "  → $detail" : '');
    echo "  \033[31m✗\033[0m $titre" . ($detail !== '' ? "\n      \033[33m$detail\033[0m" : '') . "\n";
}
function titre(string $t): void { echo "\n\033[1m$t\033[0m\n"; }
function ecrireBase(array $db): void { file_put_contents(VRT_DB_FICHIER, json_encode($db, JSON_UNESCAPED_UNICODE)); }
function lireBase(): array { return json_decode((string) file_get_contents(VRT_DB_FICHIER), true) ?: []; }
function livre(string $id): array { return vrt_rec_par_livre()[$id] ?? ['recette' => -1, 'n' => -1, 'anterieur' => -1]; }
function registreVide(): void {
    foreach (glob(VRT_REC_DIR . '/registre.json*') ?: [] as $f) @unlink($f);
}

function base(): array {
    return [
        'visitorAccounts' => [
            ['id' => 'va_parrain', 'user' => 'awa',  'pre' => 'Awa',  'nom' => 'Tchoua', 'tel' => '677001122', 'statut' => 'actif', 'plans' => []],
            ['id' => 'va_lecteur', 'user' => 'paul', 'pre' => 'Paul', 'nom' => 'Mbida',  'tel' => '699334455', 'statut' => 'actif', 'plans' => []],
        ],
        'studentAccounts' => [],
        'books' => [
            ['id' => 'bk_stock', 'titre' => 'Manuel à stock',    'prix' => 1500, 'prixDigital' => 900, 'stock' => 20, 'vendu' => 0],
            ['id' => 'bk_libre', 'titre' => 'Manuel sans stock', 'prix' => 1000, 'prixDigital' => 700, 'vendu' => 0],
            ['id' => 'bk_passe', 'titre' => 'Manuel au passé',   'prix' => 1000, 'stock' => 50, 'vendu' => 10],
        ],
        'promoCodes' => [], 'partners' => [], 'teachers' => [],
        'elearning' => ['plans' => [], 'abonnements' => [], 'contenus' => []],
        'visitorOrders' => [], 'livretVentes' => [],
    ];
}
function vente(string $ref, string $bookId, int $paye, array $extra = []): array {
    return array_merge(['intent' => 'book', 'targetId' => $bookId, 'montant' => $paye, 'montant_paye' => $paye,
        'ref' => $ref, 'accountId' => '', 'clientNom' => 'Banc', 'clientTel' => '699000000',
        'label' => 'Manuel — ' . $bookId], $extra);
}

echo "\n\033[1m╔══════════════════════════════════════════════════════════════════╗\033[0m\n";
echo   "\033[1m║  VÉRITAS — la part d'un auteur repose-t-elle sur l'argent reçu ? ║\033[0m\n";
echo   "\033[1m╚══════════════════════════════════════════════════════════════════╝\033[0m\n";

// ═════════════════════════════════════════════════════════════════════════
titre('1. Une vente confirmée inscrit ce qui a été ENCAISSÉ');
registreVide();
ecrireBase(base());
$g = vrt_grant_entitlement_to_file(vente('B-1', 'bk_stock', 1500));
ok('la commande est accordée', !empty($g['ok']) || !empty($g['changed']), json_encode($g));
$l = livre('bk_stock');
ok('1 500 F encaissés → 1 500 F au registre', $l['recette'] === 1500 && $l['n'] === 1, json_encode($l));
vrt_grant_entitlement_to_file(vente('B-1', 'bk_stock', 1500));
ok('webhook rejoué sur la même référence : aucun doublon', livre('bk_stock')['recette'] === 1500);
vrt_rec_enregistrer('B-1', 'bk_stock', 1500, 'book');
ok('et un second enregistrement direct non plus (idempotent par référence)', livre('bk_stock')['recette'] === 1500);

// ═════════════════════════════════════════════════════════════════════════
titre('2. Le prix du jour ne réécrit plus l’histoire');
$b = lireBase();
foreach ($b['books'] as &$x) if ($x['id'] === 'bk_stock') $x['prix'] = 3000;
unset($x); ecrireBase($b);
ok('le livre passe à 3 000 F dans la base : la recette reste 1 500 F',
   livre('bk_stock')['recette'] === 1500, json_encode(livre('bk_stock')));
ok('l’ancien calcul, lui, aurait affiché 3 000 F (1 × 3 000) — le défaut réparé',
   1 * 3000 !== livre('bk_stock')['recette']);

// ═════════════════════════════════════════════════════════════════════════
titre('3. Les ventes que l’ancien calcul ne voyait pas');
$g = vrt_grant_entitlement_to_file(vente('L-1', 'bk_libre', 1000));
$vendu = 0; foreach (lireBase()['books'] as $x) if ($x['id'] === 'bk_libre') $vendu = (int) ($x['vendu'] ?? 0);
ok('livre SANS stock suivi : `vendu` reste à 0 (le compteur ignorait la vente)…', $vendu === 0, "vendu=$vendu");
ok('… mais le registre l’inscrit : 1 000 F', livre('bk_libre')['recette'] === 1000, json_encode(livre('bk_libre')));

/* Un sous-paiement REFUSÉ n'inscrit rien : la recette naît de l'octroi, pas
   de la tentative. (Le serveur lit le tarif numérique dans la base avant le
   catalogue — c'est ce qui a d'abord fait refuser 700 F ici.) */
$avantRefus = livre('bk_libre');
$g = vrt_grant_entitlement_to_file(vente('D-SOUS', 'bk_libre', 400,
     ['intent' => 'digitalbook', 'accountId' => 'va_lecteur']));
ok('numérique payé 400 F pour un tarif de 700 : refusé', !empty($g['underpaid']) && empty($g['changed']), json_encode($g));
ok('… et RIEN n’est inscrit au registre', livre('bk_libre') == $avantRefus && !isset(vrt_rec_lire()['ops']['D-SOUS']),
   json_encode(livre('bk_libre')));

$g = vrt_grant_entitlement_to_file(vente('D-1', 'bk_libre', 700,
     ['intent' => 'digitalbook', 'accountId' => 'va_lecteur']));
ok('livre NUMÉRIQUE débloqué', !empty($g['changed']), json_encode($g));
ok('et sa recette comptée (700 F) — le numérique ne comptait JAMAIS',
   livre('bk_libre')['recette'] === 1700 && livre('bk_libre')['n'] === 2, json_encode(livre('bk_libre')));

// ═════════════════════════════════════════════════════════════════════════
titre('4. Une remise est une recette MOINDRE, pas une recette au prix fort');
$codeAwa = vrt_parr_code_pour_id('va_parrain');
$pa = vrt_parr_pour_etat(vrt_parr_evaluer(lireBase(), vrt_parr_lire(), ['code' => $codeAwa, 'accountId' => 'va_lecteur',
      'intent' => 'book', 'targetId' => 'bk_libre', 'prix' => 1000]));
ok('le Code ami est accepté sur ce livre (−10 %)', is_array($pa), json_encode($pa));
$avant = livre('bk_libre')['recette'];
$g = vrt_grant_entitlement_to_file(vente('R-1', 'bk_libre', 900, ['accountId' => 'va_lecteur', 'parrainage' => $pa]));
ok('vente à 900 F au lieu de 1 000 : accordée', !empty($g['changed']), json_encode($g));
ok('le registre inscrit 900 F — l’ancien calcul en aurait compté 1 000',
   livre('bk_libre')['recette'] - $avant === 900, 'écart = ' . (livre('bk_libre')['recette'] - $avant));

// ═════════════════════════════════════════════════════════════════════════
titre('5. Le passé est figé à la première vente suivie');
$g = vrt_grant_entitlement_to_file(vente('P-1', 'bk_passe', 1000));
$l = livre('bk_passe');
ok('10 ventes d’avant le registre à 1 000 F : 10 000 F figés dans « anterieur »',
   $l['anterieur'] === 10000, json_encode($l));
ok('et la vente du jour comptée à part, exactement : 1 000 F', $l['recette'] === 1000 && $l['n'] === 1, json_encode($l));
$b = lireBase();
foreach ($b['books'] as &$x) if ($x['id'] === 'bk_passe') $x['prix'] = 2500;
unset($x); ecrireBase($b);
vrt_grant_entitlement_to_file(vente('P-2', 'bk_passe', 1000));
ok('le prix passe à 2 500 F : le passé figé ne bouge pas (10 000 F)',
   livre('bk_passe')['anterieur'] === 10000, json_encode(livre('bk_passe')));

// ═════════════════════════════════════════════════════════════════════════
titre('6. Un panier inscrit chaque livre à SA part de l’encaissé');
$panier = ['intent' => 'cart', 'targetId' => '', 'montant' => 2500, 'montant_paye' => 2500, 'ref' => 'C-1',
           'accountId' => 'va_lecteur', 'clientNom' => 'Banc', 'clientTel' => '699000000', 'label' => 'Panier',
           'lignes' => [['intent' => 'book', 'targetId' => 'bk_stock', 'montant' => 1500, 'label' => 'A'],
                        ['intent' => 'book', 'targetId' => 'bk_libre', 'montant' => 1000, 'label' => 'B']]];
$sAvant = livre('bk_stock')['recette']; $lAvant = livre('bk_libre')['recette'];
$b = lireBase();
foreach ($b['books'] as &$x) if ($x['id'] === 'bk_stock') $x['prix'] = 1500;   // retour au tarif du catalogue
unset($x); ecrireBase($b);
vrt_grant_entitlement_to_file($panier);
$ops = vrt_rec_lire()['ops'];
ok('deux lignes enregistrées sous C-1#1 et C-1#2', isset($ops['C-1#1'], $ops['C-1#2']), implode(',', array_keys($ops)));
ok('chaque livre reçoit sa part : +1 500 et +1 000',
   livre('bk_stock')['recette'] - $sAvant === 1500 && livre('bk_libre')['recette'] - $lAvant === 1000);

// ═════════════════════════════════════════════════════════════════════════
titre('7. Un remboursement reprend la recette');
$avant = livre('bk_stock')['recette'];
$rep = vrt_rec_annuler('B-1', 0);
ok('remboursement total de B-1 : 1 500 F repris', $rep === 1500 && livre('bk_stock')['recette'] === $avant - 1500,
   "repris=$rep recette=" . livre('bk_stock')['recette']);
ok('rembourser deux fois ne reprend rien de plus', vrt_rec_annuler('B-1', 0) === 0);

$s0 = livre('bk_stock')['recette']; $l0 = livre('bk_libre')['recette'];
$rep = vrt_rec_annuler('C-1', 1250);
ok('panier remboursé à moitié (1 250 sur 2 500) : 1 250 F repris, au prorata des lignes', $rep === 1250, "repris=$rep");
ok('… 750 F sur le premier livre, 500 F sur le second',
   $s0 - livre('bk_stock')['recette'] === 750 && $l0 - livre('bk_libre')['recette'] === 500,
   'écarts ' . ($s0 - livre('bk_stock')['recette']) . ' / ' . ($l0 - livre('bk_libre')['recette']));
ok('la recette ne passe jamais sous zéro', livre('bk_stock')['recette'] >= 0 && livre('bk_libre')['recette'] >= 0);

// ═════════════════════════════════════════════════════════════════════════
titre('8. db.php ne peut plus rien effacer');
$reg = vrt_rec_lire();
ecrireBase(base());                        // une synchro administrateur réécrit la base ENTIÈRE
ok('la base est remplacée par une copie sans aucune trace de vente…',
   array_sum(array_map(fn($x) => (int) ($x['vendu'] ?? 0), lireBase()['books'])) === 10);
ok('… et le registre, lui, est intact', vrt_rec_lire() == $reg);

// ═════════════════════════════════════════════════════════════════════════
titre('9. Un registre abîmé n’est jamais écrasé, et l’accès passe quand même');
$f = VRT_REC_DIR . '/registre.json';
file_put_contents($f, '{ ceci n\'est pas du JSON');
$g = vrt_grant_entitlement_to_file(vente('Z-1', 'bk_stock', 1500));
ok('la commande est quand même accordée — le client a payé', !empty($g['changed']), json_encode($g));
ok('le fichier abîmé n’a pas été remplacé par un registre vide',
   (string) file_get_contents($f) === '{ ceci n\'est pas du JSON');
ok('une copie de sauvegarde en a été gardée', count(glob($f . '.illisible.*') ?: []) >= 1);

/* ── MUTATIONS, ÉPROUVÉES LE 17/09/2026 (remplacement exact, puis inverse exact) ──
 *   api/_auth_lib.php      `vrt_rec_vente($db, $state, $bookId);` (numérique) retiré  → 1 au rouge
 *   api/_recettes_lib.php  idempotence `if (isset($reg['ops'][$ref])) return false;`  → 3 au rouge
 *                          NB : le webhook rejoué reste VERT sans elle — l'octroi a sa
 *                          propre garde (« commande déjà payée »). Deux couches, deux
 *                          contrôles : c'est l'enregistrement direct qui la voit.
 *   api/_recettes_lib.php  passé non figé (`'anterieur' => 0`)                         → 2 au rouge
 *   api/_recettes_lib.php  tout remboursement total (`$part = 1.0;`)                   → 2 au rouge
 *   api/_recettes_lib.php  registre illisible écrasé au lieu d'être gardé              → 1 au rouge
 */
echo "\n────────────────────────────────────────────────────────────────────\n";
if ($T['ko'] === 0) {
    echo "\033[32m\033[1m  ✓ {$T['ok']}/{$T['ok']} — la part d'un auteur repose sur l'argent reçu.\033[0m\n\n";
    exit(0);
}
echo "\033[31m\033[1m  ✗ {$T['ko']} échec(s) sur " . ($T['ok'] + $T['ko']) . " :\033[0m\n";
foreach ($T['echecs'] as $e) echo "    - $e\n";
exit(1);
