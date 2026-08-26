<?php
/**
 * tests/paiements_entitlements.php — LE TEST QUI MANQUAIT
 * © 2024-2026 Jacques Miterand TAKOU (Mythe Errant).
 *
 * ─────────────────────────────────────────────────────────────────────────────
 * POURQUOI CE FICHIER EXISTE
 *
 * Dix bugs d'argent ont été trouvés à la main en une session (quatre côté
 * client, six côté serveur). Tous le même : le paiement RÉUSSIT, l'argent
 * rentre, et rien ne se débloque. Aucune exception, aucune erreur, aucune trace
 * — le symptôme est l'absence de symptôme. Un onzième audit ne les trouvera pas
 * davantage que les dix premiers.
 *
 * Ce test ne relit pas le code : il PARCOURT chaque surface payante, confirme
 * un paiement, et va vérifier qu'un droit a bien été écrit sur le compte. Si
 * quelqu'un ajoute demain un bouton « Payer » avec un intent que le serveur ne
 * connaît pas, ou déplace un tiroir de droits, une ligne rouge sort ici.
 *
 * CE QU'IL COUVRE
 *   1. Octroi   — chaque intent écrit son droit au bon endroit.
 *   2. Idempotence — un webhook rejoué n'accorde pas deux fois.
 *   3. Prix     — un sous-paiement n'ouvre AUCUN accès.
 *   4. Remise   — un code promo actif en base reste accepté.
 *   5. Panier   — chaque ligne suit sa propre règle ; une ligne à 0 est refusée.
 *   6. Commissions — le serveur recalcule, le navigateur ne décide pas.
 *   7. Parité   — tout intent vendu par app.js a un miroir serveur.
 *
 * LANCER :  php tests/paiements_entitlements.php
 * Sortie   : une ligne par contrôle, un bilan, et un code de sortie non nul au
 *            premier échec (utilisable tel quel en CI).
 * ─────────────────────────────────────────────────────────────────────────────
 */

// Le contrôle de prix doit être ACTIF pendant le test, quelle que soit la
// configuration du serveur qui l'exécute.
if (!defined('VRT_PRICE_ENFORCE')) define('VRT_PRICE_ENFORCE', 'strict');

/* Les codes de livrets sont idempotents par un FICHIER (api/data/livret_codes.json),
   pas par la base passee en argument. Ce test emet de vrais codes : sans bac a
   sable, il ecrirait dans le registre de PRODUCTION — et refuserait de tourner
   deux fois (« code deja emis pour cette reference »). On l'isole donc dans un
   dossier temporaire, cree et vide a chaque execution. */
$__lvDir = sys_get_temp_dir() . '/vrt_livret_test_' . getmypid();
@mkdir($__lvDir, 0700, true);
define('VRT_LIVRET_DIR', $__lvDir);
register_shutdown_function(function () use ($__lvDir) {
    foreach (glob($__lvDir . '/{,*/}*', GLOB_BRACE) ?: [] as $f) { if (is_file($f)) @unlink($f); }
    @rmdir($__lvDir . '/livret_ventes'); @rmdir($__lvDir);
});

require_once __DIR__ . '/../api/_auth_lib.php';

// ════════════════════════════════════════════════════════════════════════════
// Micro-harnais (aucune dépendance : ce test doit tourner sur l'hébergement
// mutualisé de VÉRITAS comme sur un runner CI, sans composer install).
// ════════════════════════════════════════════════════════════════════════════
$T = ['ok' => 0, 'ko' => 0, 'echecs' => []];

function ok(string $titre, bool $cond, string $detail = ''): void {
    global $T;
    if ($cond) { $T['ok']++; echo "  \033[32m✓\033[0m $titre\n"; return; }
    $T['ko']++;
    $T['echecs'][] = $titre . ($detail !== '' ? "  → $detail" : '');
    echo "  \033[31m✗\033[0m $titre" . ($detail !== '' ? "\n      \033[33m$detail\033[0m" : '') . "\n";
}
function titre(string $t): void { echo "\n\033[1m$t\033[0m\n"; }

/** Le compte de test, tel qu'il est APRÈS l'octroi. */
function compte(array $db, string $id = 'acc_test'): array {
    foreach (['visitorAccounts', 'studentAccounts'] as $c) {
        foreach (($db[$c] ?? []) as $a) if (($a['id'] ?? '') === $id) return $a;
    }
    return [];
}
function tiroir(array $db, string $tiroir, string $id = 'acc_test'): array {
    $a = compte($db, $id);
    return (isset($a[$tiroir]) && is_array($a[$tiroir])) ? $a[$tiroir] : [];
}

/**
 * Base de démonstration — un exemplaire de CHAQUE chose vendable, avec son
 * tarif. Les prix comptent : c'est contre eux que le contrôle de prix statue.
 */
function baseDeTest(): array {
    return [
        'books' => [
            ['id' => 'bk1', 'titre' => 'Manuel 3e', 'secureId' => 'bk1', 'securePages' => 280, 'prix' => 5000, 'prixDigital' => 2500, 'stock' => 10, 'vendu' => 0],
        ],
        'elearning' => [
            'plans'    => [['id' => 'pl1', 'nom' => 'Premium annuel', 'prix' => 25000, 'duree' => 'année scolaire']],
            'contenus' => [['id' => 'ct1', 'titre' => 'Épreuve BEPC corrigée', 'prix' => 1500]],
            'abonnements' => [],
        ],
        'oeuvres'          => [['id' => 'oe1', 'titre' => 'Ville cruelle', 'prix' => 1000]],
        'labos'            => [['id' => 'lb1', 'titre' => 'Titrage acide-base', 'prix' => 800]],
        'marketplaceItems' => [['id' => 'mk1', 'titre' => 'Cours de maths Tle D', 'prix' => 3000, 'teacherId' => 'ens1']],
        'microPrix'        => ['epreuve' => ['montant' => 200], 'chapitre' => ['montant' => 500],
                               'fiche'   => ['montant' => 300], 'labo'     => ['montant' => 300],
                               'ia'      => ['montant' => 500, 'jetons' => 20]],
        'whatsappGroupes'  => [['id' => 'wg1', 'nom' => 'Tle D 2026', 'membresValides' => []]],
        'classrooms'       => [['id' => 'cv1', 'nom' => 'Classe virtuelle 3e', 'students' => []]],
        'echeanciers'      => [[
            'id' => 'ech1', 'eid' => 'el1', 'enom' => 'Awono Paul', 'cls' => '3e', 'motif' => 'Scolarité', 'nb' => 3,
            'versements' => [
                ['n' => 1, 'mnt' => 30000, 'stat' => 'Payé'],
                ['n' => 2, 'mnt' => 30000, 'stat' => 'Dû'],
                ['n' => 3, 'mnt' => 30000, 'stat' => 'Dû'],
            ],
        ]],
        'students'        => [['id' => 'el1', 'nom' => 'Awono', 'stat' => 'Doit']],
        'visitorAccounts' => [['id' => 'acc_test', 'nom' => 'Testeur', 'plans' => []]],
        'promoCodes'      => [],   // vide par défaut : contrôle de prix au plus strict
        'partners'        => [['id' => 'pa1', 'nom' => 'Partenaire', 'status' => 'active', 'level' => 'bronze']],
        'tarifs'          => ['livret' => 1500, 'livretGuide' => 5000, 'livretJours' => 0],
        'visitorOrders'   => [],
        'payments'        => [],
        'commissions'     => [],
    ];
}

/** Un paiement CONFIRMÉ, tel que les webhooks le présentent à l'octroi. */
function paiement(string $intent, string $targetId, int $montant, array $extra = []): array {
    return array_merge([
        'intent' => $intent, 'targetId' => $targetId, 'montant' => $montant,
        'montant_paye' => $montant, 'ref' => 'VT' . date('ymd') . '-' . strtoupper(substr(md5($intent . $targetId), 0, 4)),
        'accountId' => 'acc_test', 'clientNom' => 'Testeur', 'clientTel' => '237690000000',
        'label' => 'Test ' . $intent,
    ], $extra);
}

echo "\n\033[1m╔══════════════════════════════════════════════════════════════════╗\033[0m\n";
echo   "\033[1m║  VÉRITAS — chaque surface payante débloque-t-elle vraiment ?     ║\033[0m\n";
echo   "\033[1m╚══════════════════════════════════════════════════════════════════╝\033[0m\n";

// ════════════════════════════════════════════════════════════════════════════
// 1. OCTROI — une surface, un paiement, un droit écrit
// ════════════════════════════════════════════════════════════════════════════
titre('1. Chaque surface payante écrit un droit');

/**
 * Le catalogue des surfaces : intent, cible, prix RÉEL, et la preuve qu'on
 * exige. La preuve n'est jamais « la fonction a renvoyé changed=true » — c'est
 * toujours une lecture de la base, à l'endroit précis où le code de lecture
 * ira chercher le droit. C'est la seule façon d'attraper un tiroir déplacé.
 */
$surfaces = [
    'subscription' => ['cible' => 'pl1', 'prix' => 25000, 'preuve' => function ($db) {
        $abo = $db['elearning']['abonnements'][0] ?? null;
        $acc = compte($db);
        return ($abo && ($abo['plan'] ?? '') === 'pl1' && ($abo['statut'] ?? '') === 'Activé')
            && in_array('pl1', $acc['plans'] ?? [], true);
    }, 'attendu' => 'abonnement activé + plan sur le compte'],

    // Le manuel PAPIER ouvre aussi la lecture en ligne, à la seconde. Sans elle,
    // le client paie et n'a rien jusqu'à son passage à l'administration — un
    // week-end de silence après un débit, c'est ce qui déclenche les demandes de
    // remboursement.
    'book' => ['cible' => 'bk1', 'prix' => 5000, 'preuve' => function ($db) {
        $o = $db['visitorOrders'][0] ?? null;
        return $o && ($o['statut'] ?? '') === 'Payé' && ($db['books'][0]['stock'] ?? 0) === 9
            && in_array('bk1', tiroir($db, 'unlockedBooks'), true);
    }, 'attendu' => 'commande payée + stock décrémenté + lecture ouverte'],

    'digitalbook' => ['cible' => 'bk1', 'prix' => 2500, 'preuve' => function ($db) {
        return in_array('bk1', tiroir($db, 'unlockedBooks'), true);
    }, 'attendu' => 'acc.unlockedBooks contient bk1'],

    'contenu' => ['cible' => 'ct1', 'prix' => 1500, 'preuve' => function ($db) {
        return in_array('ct1', tiroir($db, 'unlockedContenus'), true);
    }, 'attendu' => 'acc.unlockedContenus contient ct1'],

    'oeuvre' => ['cible' => 'oe1', 'prix' => 1000, 'preuve' => function ($db) {
        return in_array('oe1', tiroir($db, 'unlockedOeuvres'), true);
    }, 'attendu' => 'acc.unlockedOeuvres contient oe1'],

    'labo' => ['cible' => 'lb1', 'prix' => 800, 'preuve' => function ($db) {
        return in_array('lb1', tiroir($db, 'unlockedLabos'), true);
    }, 'attendu' => 'acc.unlockedLabos contient lb1'],

    'marketplace' => ['cible' => 'mk1', 'prix' => 3000, 'preuve' => function ($db) {
        return in_array('mk1', tiroir($db, 'unlockedItems'), true);
    }, 'attendu' => 'acc.unlockedItems contient mk1'],

    // Les quatre micro-achats partagent UN tiroir : la clé DOIT être préfixée,
    // sinon la fiche n° 12 débloque le labo n° 12.
    'micro_epreuve' => ['cible' => 'ct1', 'prix' => 200, 'preuve' => function ($db) {
        return in_array('micro_epreuve:ct1', tiroir($db, 'unlockedUnits'), true);
    }, 'attendu' => 'acc.unlockedUnits contient micro_epreuve:ct1'],

    'micro_chapitre' => ['cible' => 'ct1', 'prix' => 500, 'preuve' => function ($db) {
        return in_array('micro_chapitre:ct1', tiroir($db, 'unlockedUnits'), true);
    }, 'attendu' => 'clé préfixée micro_chapitre:ct1'],

    'micro_fiche' => ['cible' => 'ct1', 'prix' => 300, 'preuve' => function ($db) {
        return in_array('micro_fiche:ct1', tiroir($db, 'unlockedUnits'), true);
    }, 'attendu' => 'clé préfixée micro_fiche:ct1'],

    'micro_labo' => ['cible' => 'lb1', 'prix' => 300, 'preuve' => function ($db) {
        return in_array('micro_labo:lb1', tiroir($db, 'unlockedUnits'), true);
    }, 'attendu' => 'clé préfixée micro_labo:lb1'],

    // Les crédits IA sont un SOLDE, pas un identifiant dans un tiroir : un
    // second achat doit ajouter, là où un tableau aurait dédoublonné.
    'ia' => ['cible' => 'ia_credits', 'prix' => 500, 'preuve' => function ($db) {
        $a = compte($db);
        return (int) ($a['iaCredits'] ?? 0) === 20 && count($a['iaCreditRefs'] ?? []) === 1;
    }, 'attendu' => 'acc.iaCredits = 20 + référence mémorisée'],

    'whatsapp_group' => ['cible' => 'wg1', 'prix' => 2000, 'preuve' => function ($db) {
        return in_array('acc_test', $db['whatsappGroupes'][0]['membresValides'] ?? [], true)
            && in_array('wg1', tiroir($db, 'waGroupesValides'), true);
    }, 'attendu' => 'membre du groupe + droit sur le compte'],

    'classroom' => ['cible' => 'cv1', 'prix' => 10000, 'preuve' => function ($db) {
        foreach ($db['classrooms'][0]['students'] ?? [] as $s) if (($s['accountId'] ?? '') === 'acc_test') return true;
        return false;
    }, 'attendu' => 'élève inscrit dans la classe'],

    'echeance' => ['cible' => 'ech1:2', 'prix' => 30000, 'preuve' => function ($db) {
        $v = $db['echeanciers'][0]['versements'][1] ?? [];
        $recette = false;
        foreach ($db['payments'] ?? [] as $p) if ((int) ($p['mnt'] ?? 0) === 30000) $recette = true;
        return ($v['stat'] ?? '') === 'Payé' && $recette;
    }, 'attendu' => 'versement 2 soldé + recette créée'],

    /* Livret en ligne — la surface qui manquait, et que le controle de
       couverture (section 7c) signalait en rouge depuis sa mise en vente.
       Sa preuve n'est pas « la fonction a renvoye changed » : c'est la VENTE
       ecrite dans DB.livretVentes avec son code, la ou l'acheteur ira le
       reclamer par api/livret.php (action « claim »). Un code emis mais non
       trace, c'est un client qui a paye et qui n'a rien a saisir. */
    'livret' => ['cible' => '6e:livret', 'prix' => 1500, 'preuve' => function ($db) {
        $v = $db['livretVentes'][0] ?? null;
        return $v && ($v['classe'] ?? '') === '6e' && ($v['kind'] ?? '') === 'livret'
            && (int) ($v['quantite'] ?? 0) === 1 && trim((string) ($v['code'] ?? '')) !== ''
            && ($v['statut'] ?? '') === 'Payé';
    }, 'attendu' => 'vente tracee + code emis pour la 6e'],

    /* Le PACK etablissement porte sa quantite DANS la cible (« 6e:livret:25 ») :
       le serveur ne fait donc pas que verifier un montant, il le RECALCULE a
       partir du nombre de codes et de la remise de volume. 25 codes a 1 500 F
       moins 15 % = 31 875 F. Payer le prix d'un seul code ne doit pas en
       ouvrir vingt-cinq. */
    'livret_pack' => ['cible' => '6e:livret:25', 'prix' => 31875, 'preuve' => function ($db) {
        $v = $db['livretVentes'][0] ?? null;
        return $v && (int) ($v['quantite'] ?? 0) === 25 && ($v['classe'] ?? '') === '6e'
            && count((array) ($v['codes'] ?? [])) === 25;
    }, 'attendu' => '25 codes emis et traces'],

    'product' => ['cible' => 'prod1', 'prix' => 1000, 'preuve' => function ($db) {
        $o = $db['visitorOrders'][0] ?? null;
        return $o && ($o['statut'] ?? '') === 'Payé' && strpos((string) ($o['bid'] ?? ''), 'product:') === 0;
    }, 'attendu' => 'commande produit enregistrée'],
];

$intentsTestes = [];
foreach ($surfaces as $intent => $s) {
    $intentsTestes[] = $intent;
    $db  = baseDeTest();
    $res = vrt_grant_entitlement($db, paiement($intent, $s['cible'], $s['prix']));
    $preuve = $s['preuve'];
    ok(sprintf('%-15s → %s', $intent, $s['attendu']),
       !empty($res['changed']) && $preuve($db),
       !empty($res['changed']) ? 'octroi annoncé mais RIEN écrit en base — ' . ($res['msg'] ?? '')
                               : 'octroi refusé : ' . ($res['msg'] ?? 'sans motif'));
}

/* `inscription` n'est pas une surface « à cible » : elle n'ouvre pas un tiroir
   d'identifiants mais change l'ÉTAT du compte (statut → actif). Elle a donc sa
   propre batterie, la SECTION 8 (montant exact, sous-paiement refusé, tarif
   relevé en base, rejeu idempotent, compte inconnu) — cinq contrôles, plus
   serrés que le gabarit générique ci-dessus.
   On l'inscrit ici parce que le contrôle de couverture (c) de la section 7
   s'exécute AVANT la section 8 : sans cette ligne, une surface pourtant testée
   serait signalée « sans contrôle d'octroi ». Ce n'est pas une exemption —
   retirer la section 8 fait retomber le rouge, là où il doit tomber. */
$intentsTestes[] = 'inscription';

// ════════════════════════════════════════════════════════════════════════════
// 2. IDEMPOTENCE — un webhook rejoué ne double pas l'octroi
// ════════════════════════════════════════════════════════════════════════════
titre('2. Un webhook rejoué n\'accorde jamais deux fois');

foreach ($surfaces as $intent => $s) {
    $db = baseDeTest();
    $p  = paiement($intent, $s['cible'], $s['prix']);
    vrt_grant_entitlement($db, $p);
    $second = vrt_grant_entitlement($db, $p);       // même référence, rejouée
    ok(sprintf('%-15s → second passage sans effet', $intent),
       empty($second['changed']),
       'le rejeu a modifié la base : ' . ($second['msg'] ?? ''));
}

// Cas particulier : les crédits IA doivent CUMULER sur deux achats distincts,
// tout en restant idempotents par référence. Un tableau dédoublonnant rendait
// le deuxième pack acheté totalement muet.
$db = baseDeTest();
vrt_grant_entitlement($db, paiement('ia', 'ia_credits', 500, ['ref' => 'UIA-1']));
vrt_grant_entitlement($db, paiement('ia', 'ia_credits', 500, ['ref' => 'UIA-2']));
ok('ia              → deux achats distincts cumulent (40 crédits)',
   (int) (compte($db)['iaCredits'] ?? 0) === 40,
   'solde obtenu : ' . (compte($db)['iaCredits'] ?? 0) . ' au lieu de 40');

// ════════════════════════════════════════════════════════════════════════════
// 3. PRIX — un sous-paiement n'ouvre AUCUN accès
// ════════════════════════════════════════════════════════════════════════════
titre('3. Payer moins que le tarif n\'ouvre rien');

// L'attaque réelle : le jeton public d'initiation est distribué à tous les
// navigateurs (il le doit). Une requête forgée à 100 FCFA sur l'abonnement
// annuel traversait toute la chaîne — paiement réel, signature valide.
foreach ([
    ['subscription', 'pl1', 100,  25000, 'abonnement annuel payé 100 FCFA'],
    ['digitalbook',  'bk1', 100,  2500,  'manuel numérique payé 100 FCFA'],
    ['contenu',      'ct1', 200,  1500,  'contenu e-learning sous-payé'],
    ['micro_epreuve','ct1', 50,   200,   'micro-achat sous-payé'],
    ['ia',           'ia_credits', 100, 500, 'crédits IA sous-payés'],
    ['echeance',     'ech1:2', 5000, 30000, 'tranche de scolarité sous-payée'],
] as [$intent, $cible, $paye, $tarif, $libelle]) {
    $db  = baseDeTest();
    $res = vrt_grant_entitlement($db, paiement($intent, $cible, $paye));
    $s   = $surfaces[$intent];
    $preuve = $s['preuve'];
    ok(sprintf('%-15s → refusé : %s', $intent, $libelle),
       empty($res['changed']) && !empty($res['underpaid']) && !$preuve($db),
       'ACCÈS OUVERT pour ' . $paye . ' FCFA au lieu de ' . $tarif . ' — ' . ($res['msg'] ?? ''));
}

// Le montant EXACT reste évidemment accepté (sinon on aurait juste échangé un
// bug silencieux contre un refus silencieux, ce qui est pire).
$db  = baseDeTest();
$res = vrt_grant_entitlement($db, paiement('subscription', 'pl1', 25000));
ok('subscription    → le tarif exact passe toujours', !empty($res['changed']), $res['msg'] ?? '');

// Un objet absent du catalogue n'a pas de tarif connu : on ne refuse pas sur
// une ignorance, on laisse passer et on journalise. Refuser ici ferait payer au
// client un trou de NOS données.
$db  = baseDeTest();
$res = vrt_grant_entitlement($db, paiement('contenu', 'inconnu_xyz', 100));
ok('contenu         → cible hors catalogue : accordée, pas refusée',
   !empty($res['changed']), 'un tarif a été inventé pour un objet inconnu');

// ── Atelier de Français : les trois abonnements de plateforme/ ─────────────
// Ils sont vendus depuis une page autonome, pas depuis le catalogue e-learning
// que l'administration remplit à la main. baseDeTest() ne contient donc AUCUNE
// ligne « ens / etab / pro » — et c'est précisément l'état où le serveur n'avait
// pas de prix de référence : « tarif indéterminable » acceptait 100 FCFA pour un
// abonnement annuel à 5 000. Ces contrôles échouent si le repli tarifaire de
// vrt_prix_catalogue() disparaît.
//  (800 F/mois) est entre dans la table le 26/08 : il DOIT figurer
// aux quatre miroirs, sinon il se vend a n importe quel prix ou n ouvre rien.
foreach ([['ens_mois', 800], ['ens', 5000], ['etab', 30000], ['pro', 70000]] as [$plan, $tarif]) {
    $db  = baseDeTest();
    $res = vrt_grant_entitlement($db, paiement('subscription', $plan, 100));
    ok(sprintf('atelier %-8s → 100 FCFA refusés (tarif %d)', $plan, $tarif),
       empty($res['changed']) && !empty($res['underpaid']),
       'ABONNEMENT OUVERT pour 100 FCFA — ' . ($res['msg'] ?? ''));

    // Et le tarif juste doit non seulement passer, mais écrire le droit SOUS LE
    // NOM que api/plateforme.php interroge : plat_plans_atelier() cherche
    // exactement 'ens'/'etab'/'pro' dans les plans actifs du compte. Un octroi
    // qui réussirait sous un autre nom, c'est « il a payé, rien ne s'ouvre ».
    $db  = baseDeTest();
    $res = vrt_grant_entitlement($db, paiement('subscription', $plan, $tarif));
    $acc = null;
    foreach (($db['visitorAccounts'] ?? []) as $a) {
        if (($a['id'] ?? '') === 'acc_test') { $acc = $a; break; }
    }
    ok(sprintf('atelier %-8s → %d FCFA ouvrent le droit lu par la plateforme', $plan, $tarif),
       !empty($res['changed']) && $acc !== null
         && in_array($plan, vrt_account_active_plans($acc, $db), true),
       'le paiement est passé mais le plan n\'est pas actif sur le compte');
}

// ════════════════════════════════════════════════════════════════════════════
// 4. REMISE — un code promo actif en base reste honoré
// ════════════════════════════════════════════════════════════════════════════
titre('4. Les remises légitimes passent encore');

$db = baseDeTest();
$db['promoCodes'] = [['code' => 'ELEVE10', 'reduction' => 10, 'type' => 'percent', 'actif' => true]];
$res = vrt_grant_entitlement($db, paiement('subscription', 'pl1', 22500));   // -10 %
ok('subscription    → -10 % (code actif en base) accepté', !empty($res['changed']), $res['msg'] ?? '');

$db = baseDeTest();
$db['promoCodes'] = [['code' => 'ELEVE10', 'reduction' => 10, 'type' => 'percent', 'actif' => true]];
$res = vrt_grant_entitlement($db, paiement('subscription', 'pl1', 5000));    // -80 %
ok('subscription    → -80 % refusé malgré un code à -10 %',
   empty($res['changed']), 'la tolérance de remise sert de porte dérobée');

// Un code désactivé ne doit pas élargir la tolérance.
$db = baseDeTest();
$db['promoCodes'] = [['code' => 'VIEUX', 'reduction' => 90, 'type' => 'percent', 'actif' => false]];
$res = vrt_grant_entitlement($db, paiement('subscription', 'pl1', 2500));
ok('subscription    → un code INACTIF n\'ouvre aucune tolérance',
   empty($res['changed']), 'un code désactivé a été pris en compte');

// ════════════════════════════════════════════════════════════════════════════
// 5. PANIER — chaque ligne suit sa propre règle
// ════════════════════════════════════════════════════════════════════════════
titre('5. Panier : N articles, un paiement, N droits');

$db = baseDeTest();
$res = vrt_grant_entitlement($db, paiement('cart', '', 4000, [
    'lignes' => [
        ['intent' => 'contenu', 'targetId' => 'ct1', 'montant' => 1500, 'label' => 'Épreuve'],
        ['intent' => 'oeuvre',  'targetId' => 'oe1', 'montant' => 1000, 'label' => 'Œuvre'],
        ['intent' => 'labo',    'targetId' => 'lb1', 'montant' => 800,  'label' => 'Labo'],
    ],
]));
ok('cart            → les 3 lignes sont débloquées',
   in_array('ct1', tiroir($db, 'unlockedContenus'), true)
   && in_array('oe1', tiroir($db, 'unlockedOeuvres'), true)
   && in_array('lb1', tiroir($db, 'unlockedLabos'), true),
   $res['msg'] ?? '');

// La ligne gratuite glissée dans un panier payant : le total encaissé est juste,
// mais l'article ne l'est pas. Sans contrôle par ligne, il passait.
$db = baseDeTest();
vrt_grant_entitlement($db, paiement('cart', '', 1500, [
    'lignes' => [
        ['intent' => 'contenu',      'targetId' => 'ct1', 'montant' => 1500],
        ['intent' => 'subscription', 'targetId' => 'pl1', 'montant' => 0],
    ],
]));
ok('cart            → la ligne à 0 FCFA n\'ouvre pas l\'abonnement',
   !in_array('pl1', compte($db)['plans'] ?? [], true),
   'un abonnement à 25 000 FCFA offert dans un panier à 1 500');

// Le détail vient du navigateur : il dit QUOI débloquer, jamais COMBIEN a été
// encaissé. Le total des lignes est ramené au montant réellement payé.
$db = baseDeTest();
vrt_grant_entitlement($db, paiement('cart', '', 1500, [
    'montant_paye' => 1500,
    'lignes' => [
        ['intent' => 'contenu', 'targetId' => 'ct1', 'montant' => 1500],
        ['intent' => 'oeuvre',  'targetId' => 'oe1', 'montant' => 1000],   // au-delà de l'encaissé
    ],
]));
ok('cart            → une ligne au-delà de l\'encaissé ne passe pas',
   !in_array('oe1', tiroir($db, 'unlockedOeuvres'), true),
   'le panier a débloqué plus que ce qui a été payé');

// ════════════════════════════════════════════════════════════════════════════
// 6. COMMISSIONS — de l'argent qui SORT : le serveur recalcule
// ════════════════════════════════════════════════════════════════════════════
titre('6. Partage de revenus : le navigateur propose, le serveur dispose');

$etat = paiement('book', 'bk1', 5000, ['commissions' => [[
    'id' => 'cm1', 'partnerId' => 'pa1', 'saleAmount' => 5000, 'commissionAmount' => 2000000,
]]]);
$out = vrt_commissions_verifiees(baseDeTest(), $etat);
/* 500 et non plus 250 : la grille est passée de 5-12 % à 10-18 % (le serveur
   plafonnait à 12 % ce qu'on promettait à 18). Le contrôle, lui, est inchangé
   dans son esprit — il prouve qu'une demande gonflée est ramenée au taux réel.
   On vérifie donc AUSSI que le montant retenu n'est pas celui qui a été
   demandé : sans cette seconde condition, un jour où le plafonnement sauterait,
   l'égalité stricte pourrait être satisfaite par accident. */
ok('commission      → 2 000 000 demandés ramenés au palier bronze (10 %)',
   count($out) === 1
     && (int) $out[0]['commissionAmount'] === 500
     && (int) $out[0]['commissionAmount'] !== 2000000,
   'montant retenu : ' . (isset($out[0]) ? $out[0]['commissionAmount'] : 'aucune ligne'));

$etat['commissions'][0]['partnerId'] = 'inconnu';
ok('commission      → partenaire inconnu : ligne rejetée',
   count(vrt_commissions_verifiees(baseDeTest(), $etat)) === 0);

$db = baseDeTest();
$db['partners'][0]['status'] = 'suspended';
$etat['commissions'][0]['partnerId'] = 'pa1';
ok('commission      → partenaire suspendu : ligne rejetée',
   count(vrt_commissions_verifiees($db, $etat)) === 0);

// ════════════════════════════════════════════════════════════════════════════
// 7. PARITÉ CLIENT ↔ SERVEUR — le contrôle qui aurait attrapé les dix bugs
// ════════════════════════════════════════════════════════════════════════════
titre('7. Tout ce que le client vend, le serveur sait le débloquer');

$appJs = @file_get_contents(__DIR__ . '/../app.js');
if ($appJs === false || $appJs === '') {
    ok('app.js lisible', false, 'app.js introuvable : la parité client/serveur n\'a PAS été vérifiée');
} else {
    // (a) La table de monétisation : l'inventaire déclaré des surfaces payantes.
    $bloc = '';
    if (preg_match('/window\.VERITAS_MONETISATION\s*=\s*\{(.*?)\n\};/s', $appJs, $m)) $bloc = $m[1];
    preg_match_all('/^\s*([a-z_]+)\s*:\s*\{/mi', $bloc, $mm);
    $intentsClient = array_values(array_unique($mm[1] ?? []));
    ok('table de monétisation lue dans app.js',
       count($intentsClient) >= 10, count($intentsClient) . ' intents trouvés — la regex a-t-elle décroché ?');

    // Chaque intent déclaré doit être réellement traité par l'octroi serveur.
    // « intent non géré » est la réponse exacte que renvoyait le serveur pour
    // six surfaces payantes, sans que personne ne le voie.
    $orphelins = [];
    foreach ($intentsClient as $i) {
        $db = baseDeTest();
        $r  = vrt_grant_entitlement($db, paiement($i, 'zzz_inexistant', 100000));
        if (strpos((string) ($r['msg'] ?? ''), 'intent non géré') !== false) $orphelins[] = $i;
    }
    ok('aucun intent vendu n\'est ignoré par le serveur',
       count($orphelins) === 0,
       'intents encaissés sans miroir serveur : ' . implode(', ', $orphelins));

    // (b) Les APPELANTS : un bouton peut très bien passer un intent absent de la
    //     table (c'est le bug n°1 — `commanderContenu` ouvrait le paiement en
    //     `intent:'product'`, dont le droit est null : l'élève payait, rien ne
    //     s'ouvrait). On lit donc les intents réellement PASSÉS au modal.
    preg_match_all('/intent\s*:\s*[\'"]([a-z_]+)[\'"]/i', $appJs, $ap);
    $intentsAppelants = array_values(array_unique(array_filter($ap[1] ?? [],
        function ($i) {
            // `cart` et `cagnotte` ont leur propre chemin d'octroi ; `generic`
            // n'ouvre aucun droit (paiement libre). Et `acheterUnite` construit
            // son intent — `intent:'micro_'+type` — ce qui laisse le fragment
            // « micro_ » dans la capture : les quatre variantes réelles sont
            // vérifiées une à une par la section 1.
            return !in_array($i, ['cart', 'cagnotte', 'generic'], true) && substr($i, -1) !== '_';
        })));
    $inconnus = array_diff($intentsAppelants, $intentsClient);
    ok('tout intent passé au paiement existe dans la table',
       count($inconnus) === 0,
       'intents inconnus de VERITAS_MONETISATION : ' . implode(', ', $inconnus));

    // (c) Le test lui-même doit suivre : une surface ajoutée sans contrôle ici
    //     recréerait exactement l'angle mort qu'on vient de fermer.
    $nonCouverts = array_diff($intentsClient, $intentsTestes);
    ok('toute surface déclarée est couverte par ce test',
       count($nonCouverts) === 0,
       'surfaces sans contrôle d\'octroi : ' . implode(', ', $nonCouverts));
}

// ═════════════════════════════════════════════════════════════════
// 8. FRAIS D'INSCRIPTION — 100 FCFA, et pas 1 franc
// ═════════════════════════════════════════════════════════════════
titre('8. Frais d\'inscription');

/* L'inscription n'est pas un tiroir : elle ne débloque rien, elle change
   l'ÉTAT du compte. Cinq choses à prouver, et la troisième est la seule qui
   coûte de l'argent quand elle manque. */
{
    // (a) Le paiement du bon montant active le compte.
    $db = baseDeTest();
    $db['visitorAccounts'][0]['statut'] = 'en_attente_paiement';
    $r = vrt_grant_entitlement($db, paiement('inscription', '', 100));
    $a = compte($db);
    ok('100 FCFA payés → compte actif',
       !empty($r['changed']) && ($a['statut'] ?? '') === 'actif' && !empty($a['inscriptionPayee']),
       'statut=' . ($a['statut'] ?? '∅') . ' msg=' . ($r['msg'] ?? ''));

    // (b) Un webhook rejoué ne doit ni réactiver ni réécrire la date.
    $dateAvant = $a['inscriptionPayee'] ?? '';
    $r2 = vrt_grant_entitlement($db, paiement('inscription', '', 100));
    $a2 = compte($db);
    ok('webhook rejoué → aucun second octroi',
       empty($r2['changed']) && ($a2['inscriptionPayee'] ?? '') === $dateAvant,
       'msg=' . ($r2['msg'] ?? ''));

    // (c) LE CONTRÔLE QUI COMPTE : sous-paiement refusé. Sans prix de référence
    //     pour cet intent, vrt_prix_catalogue rendrait null, le contrôle serait
    //     SAUTÉ, et l'inscription s'achèterait à 1 franc.
    $db3 = baseDeTest();
    $db3['visitorAccounts'][0]['statut'] = 'en_attente_paiement';
    $r3 = vrt_grant_entitlement($db3, paiement('inscription', '', 1));
    $a3 = compte($db3);
    ok('1 FCFA → inscription REFUSÉE',
       empty($r3['changed']) && ($a3['statut'] ?? '') !== 'actif',
       'statut=' . ($a3['statut'] ?? '∅') . ' msg=' . ($r3['msg'] ?? ''));

    // (d) Le tarif se règle en base, sans redéploiement.
    $db4 = baseDeTest();
    $db4['tarifs'] = ['inscription' => 500];
    $db4['visitorAccounts'][0]['statut'] = 'en_attente_paiement';
    $r4 = vrt_grant_entitlement($db4, paiement('inscription', '', 100));
    ok('tarif relevé à 500 en base → 100 FCFA ne suffisent plus',
       empty($r4['changed']), 'msg=' . ($r4['msg'] ?? ''));

    // (e) Compte inconnu : on n'active rien au hasard.
    $db5 = baseDeTest();
    $r5 = vrt_grant_entitlement($db5, paiement('inscription', '', 100, ['accountId' => 'fantome']));
    ok('compte inconnu → aucun octroi',
       empty($r5['changed']), 'msg=' . ($r5['msg'] ?? ''));
}

// ════════════════════════════════════════════════════════════════════════════
// 9. LECTURE DU DROIT — payer ouvre, et l'echeance referme
//
// Les huit sections precedentes verifient l'OCTROI : un paiement ecrit un
// droit. Personne ne verifiait la LECTURE — vrt_account_active_plans() et
// vrt_account_can_access(), les deux fonctions que content.php interroge
// avant de livrer un octet. Le trou s'est paye : mesure du 19/08/2026, un
// seul abonnement SANS accountId (ce qu'ecrit validerAbonnement des que la
// souscription n'est pas faite par un visiteur connecte, et ce que produit
// toute saisie manuelle a l'administration) suffisait a rendre l'expiration
// inoperante pour TOUS les abonnes du meme plan : l'abonne expire recevait
// 200 et les octets du fichier. Un abonnement ne vaut que pour son titulaire.
// ════════════════════════════════════════════════════════════════════════════
titre("9. Lecture du droit : l'echeance referme vraiment");

(function () {
    $now = (int) round(microtime(true) * 1000);
    $base = function (array $abos) use ($now) {
        return [
            'visitorAccounts' => [
                ['id' => 'accA', 'nom' => 'Abonne',  'plans' => ['pl1']],
                ['id' => 'accB', 'nom' => 'Sans',    'plans' => []],
            ],
            'elearning' => [
                'plans'       => [['id' => 'pl1', 'nom' => 'Premium', 'planTags' => ['premium']]],
                'contenus'    => [['id' => 'ct1', 'titre' => 'Epreuve', 'plans' => ['pl1']]],
                'abonnements' => $abos,
            ],
        ];
    };
    $abo = function (string $owner, string $statut, int $finMs) {
        return ['id' => 'ab_' . $owner . $statut, 'accountId' => $owner, 'plan' => 'pl1',
                'statut' => $statut, 'dateFinTs' => $finMs];
    };
    $peut = function (array $db, string $accId) {
        foreach ($db['visitorAccounts'] as $a) if ($a['id'] === $accId) {
            return vrt_account_can_access($a, $db['elearning']['contenus'][0], $db);
        }
        return false;
    };

    $dbOk = $base([$abo('accA', 'Active', $now + 30 * 86400000)]);
    ok('abonnement en cours          → contenu servi', $peut($dbOk, 'accA'));

    $dbExp = $base([$abo('accA', 'Active', $now - 86400000)]);
    ok('abonnement expire            → contenu REFUSE', !$peut($dbExp, 'accA'));

    $dbAnn = $base([$abo('accA', 'Annule', $now + 30 * 86400000)]);
    ok('abonnement annule            → contenu REFUSE', !$peut($dbAnn, 'accA'));

    ok('aucun plan sur le compte     → contenu REFUSE', !$peut($dbOk, 'accB'));

    // Le coeur du correctif : un orphelin actif ne ressuscite personne.
    $dbOrph = $base([
        $abo('accA', 'Active', $now - 86400000),          // le sien, expire
        ['id' => 'orph', 'accountId' => '', 'plan' => 'pl1', // celui de personne, actif
         'statut' => 'Active', 'dateFinTs' => $now + 30 * 86400000],
    ]);
    ok('un abonnement SANS titulaire ne prolonge pas un expire',
       !$peut($dbOrph, 'accA'),
       "l'expiration est inoperante : un orphelin actif rouvre le contenu payant");

    // …et l'octroi manuel de l'administration (plan pose sur le compte, aucun
    // abonnement en face) reste servi : le correctif ne coupe personne.
    $dbManuel = $base([]);
    ok('octroi manuel admin (aucun abonnement) → contenu servi', $peut($dbManuel, 'accA'));

    // Un contenu payant qui n'exige aucun plan ne s'ouvre pas « par defaut ».
    $dbSansPlan = $base([$abo('accA', 'Active', $now + 30 * 86400000)]);
    $dbSansPlan['elearning']['contenus'][0]['plans'] = [];
    ok('contenu payant sans plan requis → REFUSE (fail-closed)', !$peut($dbSansPlan, 'accA'));

    // Jeton : signature falsifiee, jeton perime, jeton revoque.
    $accT = ['id' => 'accA', 'user' => 'a@t.cm', 'eid' => 'e1', 'plans' => ['pl1'], 'tokenVer' => 0];
    $dbT  = $base([$abo('accA', 'Active', $now + 30 * 86400000)]);
    $dbT['visitorAccounts'][0] = $accT;
    $tok = vrt_issue_token($accT, 'visiteur');
    ok('jeton valide                 → compte reconnu',
       (vrt_verify_token($tok, $dbT)['acc']['id'] ?? '') === 'accA');
    ok('jeton a la signature modifiee → refuse',
       vrt_verify_token(substr($tok, 0, -2) . 'aa', $dbT) === null);
    $dbRev = $dbT; $dbRev['visitorAccounts'][0]['tokenVer'] = 1;
    ok('jeton revoque (tokenVer++)   → refuse', vrt_verify_token($tok, $dbRev) === null);
})();

// ════════════════════════════════════════════════════════════════════════════
// 9. UN LIVRE MIS EN VENTE AVANT LA PREMIÈRE SYNCHRO A QUAND MÊME UN PRIX
// ────────────────────────────────────────────────────────────────────────────
// Un livre entre en vente par catalogue_livres.json, déposé à la racine du site
// par la CI. Mais la BASE du serveur ne l'apprend qu'à la première synchro d'un
// administrateur — et le 25/08/2026 cette synchro était cassée depuis onze
// jours. Entre les deux, vrt_prix_catalogue rendait null, vrt_verifier_prix
// répondait « tarif indéterminable » et acceptait n'importe quel montant.
// Ces contrôles exigent que le serveur sache lire son propre catalogue.
// ════════════════════════════════════════════════════════════════════════════
(function () {
    titre('9. LIVRE VENDU AVANT SYNCHRO — le prix vient du catalogue déposé');

    $fichier = dirname(__DIR__) . '/catalogue_livres.json';
    if (!is_file($fichier)) {
        ok('catalogue_livres.json présent', false, 'absent — aucun livre ne peut être vendu');
        return;
    }
    $cat = json_decode((string) file_get_contents($fichier), true);
    $livre = null;
    foreach (($cat['livres'] ?? []) as $l) {
        if (is_array($l) && !empty($l['id'])) { $livre = $l; break; }
    }
    if (!$livre) { ok('au moins un livre au catalogue', false, 'catalogue vide'); return; }

    // Le prix attendu se LIT dans le fichier : republier à un autre tarif ne
    // doit pas faire rougir ce test pour une mauvaise raison.
    $id      = (string) $livre['id'];
    $attendu = 0;
    foreach (['prixDigital', 'priceDigital', 'prix'] as $k) {
        if (isset($livre[$k]) && (int) $livre[$k] > 0) { $attendu = (int) $livre[$k]; break; }
    }
    ok("le livre « $id » porte un tarif", $attendu > 0, $attendu . ' FCFA');

    // La base du serveur ne connaît PAS ce livre : c'est toute la situation.
    $dbVierge = ['books' => [], 'elearning' => ['contenus' => [], 'plans' => []]];

    $lu = vrt_prix_catalogue($dbVierge, 'digitalbook', $id);
    ok('prix trouvé alors que la base ignore le livre', $lu === $attendu,
       'lu=' . var_export($lu, true) . ' attendu=' . $attendu);

    // LE CONTRÔLE QUI COMPTE : payer 100 F un livre à ce tarif doit être refusé.
    $v = vrt_verifier_prix($dbVierge, ['intent' => 'digitalbook', 'targetId' => $id, 'montant_paye' => 100]);
    ok('100 FCFA pour ce livre → REFUSÉ', $v['ok'] === false,
       'motif=' . $v['motif'] . ' attendu=' . var_export($v['attendu'], true));

    // Le montant juste passe, évidemment — sinon on aurait fermé la vente.
    $v2 = vrt_verifier_prix($dbVierge, ['intent' => 'digitalbook', 'targetId' => $id, 'montant_paye' => $attendu]);
    ok('le tarif exact → ACCEPTÉ', $v2['ok'] === true, 'motif=' . $v2['motif']);

    // La base reste prioritaire : l'administration doit pouvoir changer un prix
    // sans redéployer le catalogue.
    $dbAvecLivre = ['books' => [['id' => $id, 'prixDigital' => $attendu + 500]],
                    'elearning' => ['contenus' => [], 'plans' => []]];
    ok('un tarif en base l\'emporte sur le fichier',
       vrt_prix_catalogue($dbAvecLivre, 'digitalbook', $id) === $attendu + 500);

    // Un identifiant inconnu ne doit rien inventer.
    ok('un livre inexistant ne reçoit aucun tarif',
       vrt_prix_catalogue($dbVierge, 'digitalbook', 'nexistepas_' . bin2hex(random_bytes(4))) === null);
})();

// ════════════════════════════════════════════════════════════════════════════
// BILAN
// ════════════════════════════════════════════════════════════════════════════
$total = $T['ok'] + $T['ko'];
echo "\n" . str_repeat('─', 68) . "\n";
if ($T['ko'] === 0) {
    echo "\033[32m\033[1m  ✓ {$T['ok']}/{$total} contrôles passés — chaque surface payante débloque.\033[0m\n\n";
    exit(0);
}
echo "\033[31m\033[1m  ✗ {$T['ko']} échec(s) sur $total :\033[0m\n";
foreach ($T['echecs'] as $e) echo "     • $e\n";
echo "\n  Un échec ici = un client qui paie et ne reçoit rien, ou l'inverse.\n\n";
exit(1);
