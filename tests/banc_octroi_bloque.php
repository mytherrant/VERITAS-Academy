<?php
/* ════════════════════════════════════════════════════════════════════════════
   tests/banc_octroi_bloque.php — UN PAIEMENT QUI N'OUVRE RIEN DOIT SE VOIR
   © 2024-2026 Jacques Miterand TAKOU (Mythe Errant).

       php tests/banc_octroi_bloque.php

   ─── CE QU'IL PROTÈGE ───────────────────────────────────────────────────────

   camerpayGrant() posait `granted` sur `$g['ok']`. Or ce `ok` ne dit qu'une
   chose : la base était lisible et le verrou obtenu. Il valait donc `true` y
   compris quand l'octroi n'avait RIEN ouvert. Et comme la première ligne de
   camerpayGrant() est `if (!empty($state['granted'])) return;`, la transaction
   sortait DÉFINITIVEMENT du circuit de réconciliation.

   Mesuré le 12/09/2026, AVANT correctif, sur trois états de paiement confirmé :

       digitalbook sans accountId          → granted:true, changed:false
       subscription compte introuvable     → granted:true, changed:false
       digitalbook compte introuvable      → granted:true, changed:false

   Argent encaissé, accès fermé, aucune alerte, et plus personne pour repasser
   derrière. Le symptôme était l'absence de symptôme.

   `a_regler` aggravait le silence : vrt_grant_entitlement() le rendait bien
   (« compte introuvable — abonnement NON activé »), mais
   vrt_grant_entitlement_to_file() ne relayait que `underpaid`. Le drapeau
   « demande une décision humaine » n'atteignait jamais le fichier d'état.

   ─── LA CONVENTION QUE CE BANC VERROUILLE ───────────────────────────────────

   Un retour IDEMPOTENT de vrt_grant_entitlement() doit contenir le mot
   « déjà » — c'est lui qui le distingue d'un échec. Un nouveau cas idempotent
   rédigé autrement serait classé « bloqué » : bruyant, jamais silencieux.
   ① et ② gardent les deux bords de cette convention.

   ─── ÉPROUVÉ PAR MUTATION (12/09/2026) ──────────────────────────────────────
   Sur la logique de classement :
   · `$bloque = false;` en dur             → 8 contrôles au rouge
   · `a_regler` non relayé                 → 2 au rouge (⑤)
   · marqueur « déjà » supprimé            → 4 au rouge (②)
   · borne portée à 99 passages            → 2 au rouge (④)

   Le contrôle ⑤ EXISTE GRÂCE À CES MUTATIONS. À la première passe, retirer la
   relève de `a_regler` ne faisait rougir personne : le drapeau se déduisait de
   `bloque` partout où le banc regardait. En cherchant le cas manquant, on a
   trouvé qu'il manquait AUSSI dans le correctif — camerpayGrant() ne relayait
   le drapeau que dans sa branche « bloqué ». Un banc creux avait laissé passer
   le défaut qu'il était censé garder.
   ════════════════════════════════════════════════════════════════════════════ */
declare(strict_types=1);

$RACINE = dirname(__DIR__);
require_once $RACINE . '/api/_auth_lib.php';

$vert = 0; $rouge = 0;
function ok(string $quoi, bool $cond) { global $vert, $rouge;
    if ($cond) { $vert++;  echo "  \033[32m✓\033[0m $quoi\n"; }
    else       { $rouge++; echo "  \033[31m✗\033[0m $quoi\n"; } }
function titre(string $t) { echo "\n\033[1m$t\033[0m\n"; }

/* La classification de vrt_grant_entitlement_to_file(), rejouée à l'identique.
   On travaille sur un tableau EN MÉMOIRE — jamais sur la base de travail. */
function classer(array $res): array {
    $msg  = (string) ($res['msg'] ?? '');
    $deja = (function_exists('mb_stripos') ? mb_stripos($msg, 'déjà') : stripos($msg, 'déjà')) !== false;
    $bloque = empty($res['changed']) && !$deja;
    return ['deja' => $deja, 'bloque' => $bloque,
            'a_regler' => !empty($res['a_regler']) || $bloque];
}

/* La décision de camerpayGrant(), telle qu'elle est écrite après correctif. */
function poserDrapeaux(array $cl, array &$state): void {
    /* Relais du drapeau même quand l'octroi RÉUSSIT : voir ⑤. */
    if (!empty($cl['a_regler'])) $state['a_regler'] = true;
    if (empty($cl['bloque'])) { $state['granted'] = true; }
    else {
        $state['a_regler'] = true;
        $n = (int) ($state['grant_essais'] ?? 0) + 1;
        $state['grant_essais'] = $n;
        if ($n >= 5) $state['granted'] = true;
    }
}

$src = $RACINE . '/data/veritas_db.json';
if (!is_file($src)) { fwrite(STDERR, "base absente : $src\n"); exit(2); }
$db = json_decode((string) file_get_contents($src), true);
if (!is_array($db)) { fwrite(STDERR, "base illisible\n"); exit(2); }

/* Un compte RÉEL pour le témoin : sans lui, le « cas qui marche » marcherait
   pour la mauvaise raison, et le banc serait vert sans rien prouver. */
$temoin = 'va_banc_' . bin2hex(random_bytes(3));
$db['visitorAccounts'][] = ['id' => $temoin, 'user' => 'banc_octroi_' . bin2hex(random_bytes(2)),
                            'pwd' => '', 'nom' => 'Banc', 'plans' => [], 'statut' => 'actif'];
$rangTemoin = count($db['visitorAccounts']) - 1;

titre("① UN OCTROI QUI N'OUVRE RIEN NE SE DIT PAS « ACCORDÉ »");
/* L'INSCRIPTION EST MAINTENUE — arbitrage du 12/09/2026. Un achat de livre
   numérique SANS compte est refusé, quel que soit le numéro fourni : le
   téléphone ne rattrape rien, parce qu'un compte fabriqué à partir de lui
   n'aurait aucun chemin de reprise et que l'acheteur perdrait son livre dès
   le lendemain. Ce qui compte ici n'est pas le refus — c'est qu'il soit
   SIGNALÉ et rejoué, au lieu d'être classé « accordé ». */
$bloquants = [
    'digitalbook sans accountId'      => ['intent'=>'digitalbook','targetId'=>'cahier6e','accountId'=>'','montant'=>1500],
    'subscription compte introuvable' => ['intent'=>'subscription','targetId'=>'ens','accountId'=>'va_nexiste_pas','montant'=>5000],
    'digitalbook compte introuvable'  => ['intent'=>'digitalbook','targetId'=>'cahier6e','accountId'=>'va_nexiste_pas','montant'=>1500],
];
foreach ($bloquants as $nom => $base) {
    $etat = $base + ['ref' => 'BANC-' . bin2hex(random_bytes(4)), 'clientNom' => 'B',
                     'clientTel' => '690000000', 'status' => 'paid'];
    $cl = classer(vrt_grant_entitlement($db, $etat));
    poserDrapeaux($cl, $etat);
    ok("$nom → PAS de drapeau « accordé »", empty($etat['granted']));
    ok("$nom → signalé « à régler »",       !empty($etat['a_regler']));
}

titre('② UN OCTROI RÉEL PASSE, ET SON REJEU RESTE SILENCIEUX');
$ref = 'BANC-OK-' . bin2hex(random_bytes(4));
$etat = ['intent'=>'subscription','targetId'=>'ens','accountId'=>$temoin,'montant'=>5000,
         'ref'=>$ref,'clientNom'=>'B','clientTel'=>'690000000','status'=>'paid'];
$cl = classer(vrt_grant_entitlement($db, $etat));
poserDrapeaux($cl, $etat);
ok('abonnement légitime → accordé',          !empty($etat['granted']));
ok('abonnement légitime → aucune alerte',    empty($etat['a_regler']));
ok('le plan est inscrit sur le compte',      in_array('ens', $db['visitorAccounts'][$rangTemoin]['plans'] ?? [], true));

/* Une passerelle rejoue son webhook jusqu'à obtenir un 200. */
$etat2 = $etat; unset($etat2['granted'], $etat2['a_regler']);
$cl2 = classer(vrt_grant_entitlement($db, $etat2));
poserDrapeaux($cl2, $etat2);
ok('webhook rejoué → reconnu « déjà fait »', $cl2['deja'] === true);
ok('webhook rejoué → reste accordé',         !empty($etat2['granted']));
ok('webhook rejoué → PAS de fausse alerte',  empty($etat2['a_regler']));

titre('③ LE REJEU NE PEUT PAS ACCORDER DEUX FOIS');
$n = 0; foreach (($db['elearning']['abonnements'] ?? []) as $a) { if (($a['ref'] ?? '') === $ref) $n++; }
ok("une seule ligne d'abonnement pour cette référence", $n === 1);

titre('④ LA BOUCLE DE RÉCONCILIATION EST BORNÉE');
/* Sans borne, chaque ouverture du tableau de bord relancerait l'octroi — et
   chaque tentative réécrit une sauvegarde complète de la base. */
$etat3 = ['intent'=>'digitalbook','targetId'=>'cahier6e','accountId'=>'','montant'=>1500,
          'ref'=>'BANC-BORNE','clientNom'=>'B','clientTel'=>'690000000','status'=>'paid'];
for ($i = 1; $i <= 5; $i++) { $c = classer(vrt_grant_entitlement($db, $etat3)); poserDrapeaux($c, $etat3); }
ok('après 5 passages, on cesse de rejouer',    !empty($etat3['granted']));
ok("… mais l'alerte « à régler » demeure",     !empty($etat3['a_regler']));
ok('… et le compteur de tentatives est gardé', (int) ($etat3['grant_essais'] ?? 0) === 5);

titre("⑤ UN ACHAT SANS COMPTE : TRACÉ, MAIS L'ACCÈS RESTE À ATTRIBUER");
/* Le seul cas où l'octroi RÉUSSIT tout en demandant une décision humaine :
   un abonnement réglé sans identifiant de compte (achat anonyme, saisie
   manuelle de l'administration). La ligne est écrite — l'argent est tracé —
   mais aucun accès n'est ouvert : personne n'en est titulaire.

   C'est ce cas, et lui seul, qui éprouve la RELÈVE de `a_regler` : partout
   ailleurs le drapeau se déduit de `bloque`. Sans ce contrôle, on pouvait
   supprimer la relève sans qu'un seul test rougisse — constaté par mutation
   le 12/09/2026, et c'est ainsi que ce contrôle est né. */
$etat5 = ['intent'=>'subscription','targetId'=>'ens','accountId'=>'','montant'=>5000,
          'ref'=>'BANC-ANON-' . bin2hex(random_bytes(3)),'clientNom'=>'Anonyme',
          'clientTel'=>'690000000','status'=>'paid'];
$res5 = vrt_grant_entitlement($db, $etat5);
$cl5  = classer($res5);
poserDrapeaux($cl5, $etat5);
ok("la ligne est bien écrite (l'argent est tracé)", !empty($res5['changed']));
ok("l'octroi n'est PAS classé « bloqué »",          empty($cl5['bloque']));
ok('mais il est signalé « à régler »',              !empty($etat5['a_regler']));
ok('et il ne sera pas rejoué inutilement',          !empty($etat5['granted']));

echo "\n" . str_repeat('─', 68) . "\n";
if ($rouge === 0) { echo "\033[32m\033[1m  ✓ $vert/$vert — un paiement qui n'ouvre rien se voit.\033[0m\n"; exit(0); }
echo "\033[31m\033[1m  ✗ $rouge au rouge sur " . ($vert + $rouge) . ".\033[0m\n"; exit(1);
