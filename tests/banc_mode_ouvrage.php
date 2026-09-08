<?php
/**
 * tests/banc_mode_ouvrage.php — LA FORME LIVRÉE EST-ELLE CELLE QU'ANNONCE LA FICHE ?
 * © 2024-2026 Jacques Miterand TAKOU (Mythe Errant).
 *
 *   php tests/banc_mode_ouvrage.php
 *
 * CE QU'IL PROTÈGE
 *   Un ouvrage se livre de deux façons, et une seule à la fois :
 *     · `interactif` → `booklet-<slug>.js`, des blocs que la page déroule ;
 *     · `lecture`    → `<slug>/pNNN.jpg`, des images servies une par une.
 *   Le catalogue dit laquelle. La porte, elle, est écrite en dur dans la page
 *   de l'ouvrage : `cahier.html` pour l'une, le liseur pour l'autre.
 *
 *   `vrt_livret_etat()` répondait « disponible » dès que L'UNE DES DEUX formes
 *   était sur le disque — un OU entre deux produits différents. Un ouvrage
 *   pouvait donc porter la forme que sa propre porte ne sait pas lire, et être
 *   annoncé en vente.
 *
 *   Ce n'est pas une hypothèse. « bord-6e » était déclaré `mode: lecture` ;
 *   `tools/normaliser_cahiers.py` a produit et déposé son `booklet-bord-6e.js`
 *   interactif tout en conservant l'ancien mode au catalogue. Le OU a vu le
 *   `.js`, la boutique a mis la carte en vente à 1 500 F, et
 *   `livrets/bord-6e.html` — resté sur le liseur — a demandé `p001.jpg`, absent :
 *   409 dès la première page de l'aperçu GRATUIT. Écran noir avant même le mur
 *   de paiement. Signalé par un client le 08/09/2026 : « je n'arrive pas à
 *   acheter le bord de 6e, ça ne charge pas ».
 *
 * COMMENT IL S'Y PREND
 *   Il fournit SON catalogue et SON dépôt, au lieu de mesurer l'état de la
 *   machine : sur un poste de développement le dossier des données n'existe
 *   pas, sur le serveur tout est déposé, et dans les deux cas un banc qui
 *   regarde le disque réel ne prouve rien. Chaque cas tourne dans son propre
 *   processus, `vrt_livret_catalogue()` gardant son résultat en cache.
 *
 *   Le croisement — la fiche annonce une forme, le disque porte l'autre — est
 *   le cas qui compte : c'est le seul que l'ancien code déclarait vendable.
 */
declare(strict_types=1);

$racine = dirname(__DIR__);

/* ═════════════════════════════════════════════════════════════════════════
   MODE ENFANT — un cas, un processus, une ligne de résultat sur la sortie.
   ═════════════════════════════════════════════════════════════════════════ */
if (($argv[1] ?? '') === '--cas') {
    $mode  = (string) ($argv[2] ?? 'interactif');   // ce que la fiche annonce
    $forme = (string) ($argv[3] ?? 'aucune');       // ce que le disque porte
    $slug  = 'bord-6e';                            // a une coquille dans /livrets/

    $tmp = sys_get_temp_dir() . '/vrt_mode_' . getmypid();
    @mkdir($tmp, 0700, true);
    @mkdir($tmp . '/depot', 0700, true);

    $cat = $tmp . '/catalogue.json';
    file_put_contents($cat, json_encode([
        'version'  => 1,
        'ouvrages' => [$slug => [
            'titre' => 'Ouvrage d\'essai', 'niveau' => '6e', 'mode' => $mode,
            'kinds' => ['livret'], 'prix' => 1500, 'prixGuide' => 0,
            'pages' => 135, 'pagesLibres' => 8,
        ]],
    ], JSON_UNESCAPED_UNICODE));

    // Ce que le serveur porte VRAIMENT. Le `.js` respecte la forme attendue
    // (`window.X = <littéral>;`) : sans cela le refus viendrait de la
    // troncature, pas du mode, et le banc prouverait autre chose.
    if ($forme === 'js') {
        file_put_contents($tmp . '/depot/booklet-' . $slug . '.js',
                          'window.CAHIER_BLOCS=[{"y":"lecon","r":[]}];');
    } elseif ($forme === 'images') {
        @mkdir($tmp . '/depot/' . $slug, 0700, true);
        file_put_contents($tmp . '/depot/' . $slug . '/p001.jpg', str_repeat("\xFF", 64));
    }

    define('VRT_LIVRET_CATALOGUE', $cat);
    define('VRT_LIVRET_DONNEES', $tmp . '/depot');
    require_once dirname(__DIR__) . '/api/_livret_lib.php';

    $e = vrt_livret_etat($slug);
    echo json_encode([
        'disponible' => (bool) $e['disponible'],
        'mode'       => (string) ($e['mode'] ?? ''),
        'lien'       => (string) $e['lien'],
        'porte'      => (string) ($e['porte'] ?? ''),
    ]);

    foreach (glob($tmp . '/{,*/}{,*/}*', GLOB_BRACE) ?: [] as $f) { if (is_file($f)) @unlink($f); }
    @rmdir($tmp . '/depot/' . $slug); @rmdir($tmp . '/depot'); @rmdir($tmp);
    exit(0);
}

/* ═════════════════════════════════════════════════════════════════════════
   MODE PARENT
   ═════════════════════════════════════════════════════════════════════════ */
$V = "\033[32m✓\033[0m"; $X = "\033[31m✗\033[0m"; $G = "\033[1m"; $R = "\033[0m";
$ok = 0; $ko = 0;
function dit(bool $b, string $m, string $det = ''): void {
    global $ok, $ko, $V, $X;
    if ($b) { $ok++; echo "  $V $m\n"; }
    else { $ko++; echo "  $X $m" . ($det !== '' ? "  → $det" : '') . "\n"; }
}

function cas(string $mode, string $forme): array {
    global $argv;
    $cmd = escapeshellarg(PHP_BINARY) . ' ' . escapeshellarg(__FILE__)
         . ' --cas ' . escapeshellarg($mode) . ' ' . escapeshellarg($forme);
    $out = (string) @shell_exec($cmd . ' 2>&1');
    $j = json_decode(trim($out), true);
    return is_array($j) ? $j : ['brut' => $out];
}

echo "\n{$G}BANC — LA FORME LIVRÉE CONTRE LE MODE DÉCLARÉ{$R}\n";

echo "\n{$G}1. La fiche et le disque s'accordent : l'ouvrage se vend{$R}\n";
$a = cas('interactif', 'js');
dit(($a['disponible'] ?? null) === true,
    'interactif + données du cahier → disponible', json_encode($a));
$b = cas('lecture', 'images');
dit(($b['disponible'] ?? null) === true,
    'lecture + images de pages → disponible', json_encode($b));

echo "\n{$G}2. LE CROISEMENT — la fiche annonce une forme, le disque porte l'autre{$R}\n";
/* Les deux contrôles qui manquaient. L'ancien `$donnees || $pages` répondait
   « disponible » aux deux : la boutique vendait, et la porte de l'ouvrage —
   qui, elle, ne connaît qu'une seule forme — ne pouvait rien ouvrir. */
$c = cas('lecture', 'js');
dit(($c['disponible'] ?? null) === false,
    'lecture, mais SEULES les données interactives sont déposées → PAS en vente',
    json_encode($c) . '  (c\'est le cas bord-6e du 08/09/2026)');
$d = cas('interactif', 'images');
dit(($d['disponible'] ?? null) === false,
    'interactif, mais SEULES les images sont déposées → PAS en vente',
    json_encode($d));

echo "\n{$G}3. Rien de déposé : rien à vendre, quel que soit le mode{$R}\n";
$e = cas('interactif', 'aucune');
dit(($e['disponible'] ?? null) === false, 'interactif, dépôt vide → PAS en vente', json_encode($e));
$f = cas('lecture', 'aucune');
dit(($f['disponible'] ?? null) === false, 'lecture, dépôt vide → PAS en vente', json_encode($f));

echo "\n{$G}4. La vitrine et la porte ne sont pas le même lien{$R}\n";
/* `lien` mène où l'on PRÉSENTE — une page de vente pour la plus grande part du
   catalogue depuis le 31/08/2026. `porte` mène où l'on OUVRE, et c'est elle
   que `vrt_notify_lien()` envoie par SMS à quelqu'un qui vient de payer :
   l'y tromper, c'est lui redemander 1 500 F ou l'envoyer sur un moteur qui ne
   sait pas lire son ouvrage. */
dit(($b['porte'] ?? '') === 'bord-6e.html',
    'un ouvrage feuilleté s\'ouvre par son liseur', json_encode($b));
dit(($a['porte'] ?? '') === 'cahier.html?o=bord-6e',
    'un cahier interactif s\'ouvre par le moteur générique', json_encode($a));
dit(($a['lien'] ?? '') === 'bord-6e.html' && ($b['lien'] ?? '') === 'bord-6e.html',
    'la vitrine, elle, mène à la page de vente dans les deux cas');
dit(($a['mode'] ?? '') === 'interactif' && ($b['mode'] ?? '') === 'lecture',
    'et l\'état rend le mode, pour que l\'appelant n\'ait pas à le redemander');

echo "\n" . str_repeat('─', 68) . "\n";
if ($ko === 0) {
    echo "\033[32m{$G}  ✓ {$ok}/{$ok} — la forme livrée suit le mode déclaré.{$R}\n\n";
    exit(0);
}
echo "\033[31m{$G}  ✘ {$ko} échec(s) sur " . ($ok + $ko) . "{$R}\n\n";
exit(1);
