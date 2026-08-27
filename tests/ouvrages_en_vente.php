<?php
/**
 * tests/ouvrages_en_vente.php — CHAQUE OUVRAGE DU CATALOGUE SE VEND-IL ?
 * © 2024-2026 Jacques Miterand TAKOU (Mythe Errant).
 *
 *   php tests/ouvrages_en_vente.php
 *
 * CE QU'IL PROTÈGE
 *   `vrt_verifier_prix()` refuse un sous-paiement en comparant le montant reçu
 *   au tarif de RÉFÉRENCE du serveur. Quand ce tarif est « indéterminable »,
 *   elle n'a rien à comparer et laisse passer — c'est le trou d'argent mesuré
 *   le 21/08/2026 sur l'Atelier : 100 FCFA ouvraient un abonnement à 5 000.
 *
 *   Le catalogue est passé de 5 ouvrages à 15 le 27/08. Dix produits neufs,
 *   dix occasions de répéter exactement la même panne — et elle est silencieuse
 *   des deux côtés : l'acheteur est content, le vendeur ne voit qu'un paiement
 *   de plus. Ce banc pose donc, pour CHAQUE entrée du catalogue, les trois
 *   questions dont dépend un encaissement correct :
 *
 *     ① a-t-il un tarif de référence non nul ?
 *     ② accepte-t-il la nature de code sous laquelle il est vendu ?
 *     ③ le prix d'un pack suit-il, remise comprise ?
 *
 *   Puis les deux refus qui comptent : un ouvrage inconnu ne se vend pas, et
 *   une nature de code non déclarée est refusée — sans quoi on encaisserait un
 *   code enseignant sur un cahier qui n'en a pas.
 */
declare(strict_types=1);

$racine = dirname(__DIR__);
define('VRT_LIVRET_CATALOGUE', $racine . '/api/data/livrets_catalogue.json');
require_once $racine . '/api/_livret_lib.php';

$V = "\033[32m✓\033[0m"; $X = "\033[31m✗\033[0m"; $G = "\033[1m"; $R = "\033[0m";
$ok = 0; $ko = 0;
function dit(bool $b, string $m, string $det = ''): void {
    global $ok, $ko, $V, $X;
    if ($b) { $ok++; echo "  $V $m\n"; }
    else { $ko++; echo "  $X $m" . ($det ? "  → $det" : '') . "\n"; }
}

/* Base VIDE, volontairement : on éprouve le tarif que le serveur connaît de
   lui-même. Un tarif qui n'existe que dans la base synchronisée disparaît le
   jour où la synchro tombe — et c'est ce jour-là qu'on encaisse 1 franc. */
$db = [];

$cat = vrt_livret_catalogue();
echo "\n{$G}CHAQUE OUVRAGE DU CATALOGUE SE VEND-IL ?{$R}\n";
echo "Catalogue : " . count($cat) . " ouvrages\n\n";

echo "{$G}1. Un tarif de référence, pour chacun{$R}\n";
printf("  %-13s %7s %7s %9s  %s\n", 'ouvrage', 'élève', 'guide', 'pack 10', 'natures');
foreach ($cat as $slug => $o) {
    $p  = vrt_livret_prix($db, 'livret', (string) $slug);
    $pk = vrt_livret_prix_pack($db, 'livret', 10, (string) $slug);
    $kinds = implode(',', (array) ($o['kinds'] ?? []));
    $pg = in_array('guide', (array) ($o['kinds'] ?? []), true)
        ? vrt_livret_prix($db, 'guide', (string) $slug) : 0;
    printf("  %-13s %7d %7s %9d  %s\n", $slug, $p, $pg ?: '—', $pk, $kinds);
}
echo "\n";
foreach ($cat as $slug => $o) {
    $p = vrt_livret_prix($db, 'livret', (string) $slug);
    dit($p > 0, "$slug : tarif de référence = $p FCFA", 'un tarif nul fait sauter le contrôle de sous-paiement');
}

echo "\n{$G}2. Chaque nature déclarée est acceptée — et elle seule{$R}\n";
foreach ($cat as $slug => $o) {
    $kinds = (array) ($o['kinds'] ?? ['livret']);
    foreach (['livret', 'guide'] as $k) {
        $attendu = in_array($k, $kinds, true);
        $reel = vrt_livret_ouvrage_accepte((string) $slug, $k);
        if ($attendu) {
            dit($reel, "$slug : accepte un code « $k »");
        } elseif ($reel) {
            // On ne compte un contrôle que quand il échoue : sinon la sortie
            // ferait trente lignes pour dire trente fois « non, en effet ».
            dit(false, "$slug : accepte « $k » alors qu'il ne le vend pas");
        }
    }
}

echo "\n{$G}3. Le pack suit le tarif, remise comprise{$R}\n";
$slug = array_key_first($cat);
$u = vrt_livret_prix($db, 'livret', (string) $slug);
foreach ([[1, 0], [10, 10], [25, 15], [50, 20]] as [$n, $remise]) {
    $attendu = (int) round($u * $n * (100 - $remise) / 100);
    $reel = vrt_livret_prix_pack($db, 'livret', $n, (string) $slug);
    dit($reel === $attendu, "$n code(s) → $reel FCFA (remise $remise %)", "attendu $attendu");
}

echo "\n{$G}4. Les refus{$R}\n";
dit(!vrt_livret_ouvrage_accepte('ouvrage-qui-nexiste-pas', 'livret'),
    'un ouvrage absent du catalogue ne se vend pas');
dit(!vrt_livret_ouvrage_accepte('', 'livret'),
    'un slug vide ne se vend pas');
/* Le tarif d'un ouvrage inconnu retombe sur le tarif général plutôt que sur
   zéro. C'est VOULU, et c'est le comportement sûr : un tarif nul rendrait le
   contrôle de sous-paiement inopérant, alors qu'un tarif trop élevé ne fait
   que refuser un paiement — et de toute façon `vrt_livret_ouvrage_accepte()`
   a déjà barré la route au-dessus. */
dit(vrt_livret_prix($db, 'livret', 'ouvrage-qui-nexiste-pas') > 0,
    'un ouvrage inconnu retombe sur un tarif non nul (jamais sur zéro)');

echo "\n" . str_repeat('─', 68) . "\n";
if ($ko) { echo "\033[31m{$G}  $X $ko contrôle(s) en échec sur " . ($ok + $ko) . "{$R}\n"; exit(1); }
echo "\033[32m{$G}  ✓ $ok/$ok — les " . count($cat) . " ouvrages ont un prix et une porte.{$R}\n";
exit(0);
