<?php
/**
 * tests/banc_identite_acheteur.php — QUI VIENT DE PAYER ?
 * © 2024-2026 Jacques Miterand TAKOU (Mythe Errant).
 *
 *   php tests/banc_identite_acheteur.php
 *
 * CE QU'IL PROTÈGE
 *   Un compte porte DEUX valeurs distinctes : son identifiant interne
 *   (`va_1756800000000_ab12cd`) et son login (`mariam.n`). Tout l'octroi
 *   serveur cherche le premier — `$acc['id'] === $accountId`.
 *
 *   Or la tranche de compte que `api/student_data.php` renvoie à la connexion
 *   ne contenait PAS `id`. Sur le chemin « appareil neuf » (S3), le client
 *   n'avait donc que le login à mettre dans la session, et c'est lui qui
 *   partait au paiement comme identifiant de compte. Mesuré le 02/09/2026 :
 *
 *     LE TUBE DIGESTIF   accountId = login → octroi=NON  « compte introuvable »
 *     ABONNEMENT ÉLÈVE   accountId = login → octroi=OUI  « Abonnement activé »
 *                                            … et le plan sur AUCUN compte.
 *
 *   La seconde ligne est la pire : la transaction pose son drapeau `granted`,
 *   le tableau de bord affiche « activé », et l'abonné n'a rien. Le symptôme
 *   est l'absence de symptôme.
 *
 *   Ce banc tient les DEUX bouts, parce qu'ils tombent en panne séparément :
 *     ① le CLIENT envoie le bon identifiant (app.js + tranche de compte) ;
 *     ② le SERVEUR sait retrouver un compte même si on lui donne le login
 *        — c'est le filet qui répare les navigateurs qui tournent encore sur
 *        un app.js en cache (servi `immutable`, un an).
 *
 *   Et les deux refus qui empêchent le filet de devenir un trou : une valeur
 *   qui ne désigne aucun compte n'ouvre rien, et l'identifiant l'emporte
 *   toujours sur le login quand les deux pourraient désigner des comptes
 *   différents.
 */
declare(strict_types=1);

$racine = dirname(__DIR__);
if (!defined('VRT_PRICE_ENFORCE')) define('VRT_PRICE_ENFORCE', 'strict');

$__lvDir = sys_get_temp_dir() . '/vrt_ident_test_' . getmypid();
@mkdir($__lvDir, 0700, true);
define('VRT_LIVRET_DIR', $__lvDir);
register_shutdown_function(function () use ($__lvDir) {
    foreach (glob($__lvDir . '/{,*/}*', GLOB_BRACE) ?: [] as $f) { if (is_file($f)) @unlink($f); }
    @rmdir($__lvDir . '/livret_ventes'); @rmdir($__lvDir);
});

require_once $racine . '/api/_auth_lib.php';

$V = "\033[32m✓\033[0m"; $X = "\033[31m✗\033[0m"; $G = "\033[1m"; $R = "\033[0m";
$ok = 0; $ko = 0;
function dit(bool $b, string $m, string $det = ''): void {
    global $ok, $ko, $V, $X;
    if ($b) { $ok++; echo "  $V $m\n"; }
    else { $ko++; echo "  $X $m" . ($det ? "  → $det" : '') . "\n"; }
}
function titre(string $t): void { global $G, $R; echo "\n{$G}{$t}{$R}\n"; }

const ID_REEL = 'va_1756800000000_ab12cd';
const LOGIN   = 'mariam.n';

function baseTest(): array {
    return [
        'visitorAccounts' => [[
            'id' => ID_REEL, 'user' => LOGIN, 'nom' => 'NDONGO', 'pre' => 'Mariam',
            'plans' => [], 'statut' => 'actif',
        ]],
        'books' => [[
            'id' => 'tubedigestif', 'titre' => 'Le Tube digestif',
            'prix' => 1000, 'prixDigital' => 1000, 'securePages' => 144,
        ]],
        'elearning' => [
            'plans' => [[ 'id' => 'plan2', 'nom' => 'INTERMÉDIAIRE', 'prix' => 3000, 'duree' => 'Année scolaire' ]],
            'abonnements' => [], 'contenus' => [],
        ],
        'tarifs' => [],
    ];
}

/** Joue un paiement confirmé et dit si le droit s'est RÉELLEMENT ouvert. */
function octroyer(string $intent, string $cible, int $montant, string $accountId, ?array $db = null): array {
    $db = $db ?? baseTest();
    $r = vrt_grant_entitlement($db, [
        'intent' => $intent, 'ref' => 'T' . bin2hex(random_bytes(4)), 'targetId' => $cible,
        'accountId' => $accountId, 'montant' => $montant,
        'clientNom' => 'Mariam NDONGO', 'clientTel' => '699000000',
    ]);
    $acc = $db['visitorAccounts'][0];
    $ouvert = ($intent === 'digitalbook')
        ? in_array($cible, $acc['unlockedBooks'] ?? [], true)
        : in_array($cible, vrt_account_active_plans($acc, $db), true);
    return ['ouvert' => $ouvert, 'msg' => (string) ($r['msg'] ?? ''), 'db' => $db];
}

echo "\n\033[1m═══ QUI VIENT DE PAYER ? — l'identité de l'acheteur ═══\033[0m\n";

/* ─────────────────────────────────────────────────────────────────────────
   ① LE CHEMIN NORMAL NE DOIT PAS BOUGER
   ───────────────────────────────────────────────────────────────────────── */
titre('① L\'identifiant réel ouvre le droit (chemin déjà sain)');
$r = octroyer('digitalbook', 'tubedigestif', 1000, ID_REEL);
dit($r['ouvert'], 'Le Tube digestif s\'ouvre pour l\'identifiant du compte', $r['msg']);
$r = octroyer('subscription', 'plan2', 3000, ID_REEL);
dit($r['ouvert'], 'l\'abonnement s\'inscrit sur le compte', $r['msg']);

/* ─────────────────────────────────────────────────────────────────────────
   ② LE FILET : le login doit ouvrir le même droit
   ───────────────────────────────────────────────────────────────────────── */
titre('② Le login retrouve son compte — le filet des app.js en cache');
$r = octroyer('digitalbook', 'tubedigestif', 1000, LOGIN);
dit($r['ouvert'], 'payé 1 000 F depuis un appareil neuf → le livre s\'ouvre', $r['msg']);
$r = octroyer('subscription', 'plan2', 3000, LOGIN);
dit($r['ouvert'], 'payé 3 000 F depuis un appareil neuf → l\'abonnement ouvre', $r['msg']);

/* ─────────────────────────────────────────────────────────────────────────
   ③ LE FILET N'EST PAS UN TROU
   ───────────────────────────────────────────────────────────────────────── */
titre('③ Ce qui ne désigne aucun compte n\'ouvre rien');
$r = octroyer('digitalbook', 'tubedigestif', 1000, 'quelquun-dautre');
dit(!$r['ouvert'], 'un identifiant inconnu n\'ouvre aucun livre', $r['msg']);
dit(stripos($r['msg'], 'introuvable') !== false, 'et le refus le DIT (pas de silence)', $r['msg']);

$r = octroyer('subscription', 'plan2', 3000, 'quelquun-dautre');
dit(!$r['ouvert'], 'un identifiant inconnu n\'ouvre aucun abonnement', $r['msg']);
dit(stripos($r['msg'], 'introuvable') !== false,
    'et l\'abonnement ne se déclare PAS « activé » quand il n\'active rien', $r['msg']);

titre('④ L\'identifiant l\'emporte sur le login — jamais le compte du voisin');
$db = baseTest();
// Piège : le login de Paul est l'identifiant de Mariam.
$db['visitorAccounts'][] = ['id' => 'paul_id', 'user' => ID_REEL, 'nom' => 'MBALLA',
                            'pre' => 'Paul', 'plans' => [], 'statut' => 'actif'];
$r = octroyer('digitalbook', 'tubedigestif', 1000, ID_REEL, $db);
$mariam = $r['db']['visitorAccounts'][0];
$paul   = $r['db']['visitorAccounts'][1];
dit(in_array('tubedigestif', $mariam['unlockedBooks'] ?? [], true),
    'le livre va au compte dont c\'est l\'IDENTIFIANT');
dit(!in_array('tubedigestif', $paul['unlockedBooks'] ?? [], true),
    'et pas au compte dont c\'est le login');

/* ─────────────────────────────────────────────────────────────────────────
   ⑤ LA TRANCHE DE COMPTE PORTE L'IDENTIFIANT
   ───────────────────────────────────────────────────────────────────────── */
titre('⑤ Le serveur envoie au client de quoi se nommer');
$src = (string) file_get_contents($racine . '/api/student_data.php');
if (!preg_match('/\'account\'\s*=>\s*\[(.*?)\n\s*\],/s', $src, $m)) {
    dit(false, 'la tranche « account » est repérable dans student_data.php');
} else {
    $tranche = $m[1];
    dit(strpos($tranche, "'id'") !== false,
        'la tranche de compte contient « id » — sans lui le client ne PEUT pas faire mieux');
    dit(strpos($tranche, "'user'") !== false, 'et garde « user » (rien n\'est retiré)');
}

/* ─────────────────────────────────────────────────────────────────────────
   ⑥ LE CLIENT ENVOIE L'IDENTIFIANT, PAS LE LOGIN
   ───────────────────────────────────────────────────────────────────────── */
titre('⑥ Le client pose l\'identifiant dans la session');
$app = (string) file_get_contents($racine . '/app.js');

// Chemin S3 « appareil neuf » : deux appels, un par type de compte.
dit(!preg_match('/accountId\s*:\s*\(\s*_slice\.account\s*&&\s*_slice\.account\.user\s*\)\s*\|\|\s*u\b/', $app),
    'le chemin élève n\'envoie plus le login comme identifiant de compte');
dit(preg_match('/accountId\s*:\s*\(\s*_slice\.account\s*&&\s*\(\s*_slice\.account\.id/', $app) === 1,
    'il envoie l\'identifiant, avec repli sur le login');
dit(!preg_match('/_createSession\(\{\s*id\s*:\s*_ac\.user\b/', $app),
    'le chemin visiteur ne prend plus le login pour identifiant');
dit(preg_match('/_ac\.id\s*\|\|\s*_ac\.user/', $app) === 1,
    'il préfère l\'identifiant quand le serveur le donne');

// Souscription : l'élève connecté DOIT transmettre son compte.
dit(!preg_match('/accountId\s*:\s*SES\s*&&\s*\(\s*SES\.type\s*===\s*\'visiteur\'\s*\|\|\s*SES\.type\s*===\s*\'visiteur_inscrit\'\s*\)\s*\?/', $app),
    'validerAbonnement ne réserve plus l\'identifiant à deux types de session sur trois');
dit(preg_match('/customerAccountId\s*:\s*_accId\(\)/', $app) === 1,
    'et le paiement d\'abonnement passe par le résolveur unique _accId()');
dit(preg_match('/function\s+_accId\s*\(/', $app) === 1,
    'ce résolveur existe une seule fois, au lieu d\'être recopié à chaque appel');

/* ─────────────────────────────────────────────────────────────────────────
   ⑦ RÉPARER CE QUI A DÉJÀ ÉTÉ VENDU
   ───────────────────────────────────────────────────────────────────────── */
titre('⑦ Les ventes déjà encaissées se rattrapent');
dit(function_exists('vrt_reparer_identites'),
    'une passe de réparation existe pour les droits écrits sous un login');

if (function_exists('vrt_reparer_identites')) {
    $db = baseTest();
    // Ce que la panne a produit en production : un abonnement au nom du login,
    // et le plan sur aucun compte.
    $db['elearning']['abonnements'][] = [
        'id' => 'abo_casse', 'ref' => 'VT260901-AAAA', 'accountId' => LOGIN,
        'plan' => 'plan2', 'planId' => 'plan2', 'statut' => 'Activé',
        'dateFinTs' => (int) round(microtime(true) * 1000) + 86400000,
    ];
    $avant = vrt_account_active_plans($db['visitorAccounts'][0], $db);
    dit(!in_array('plan2', $avant, true), 'avant réparation : l\'abonné payé n\'a AUCUN accès');

    $rap = vrt_reparer_identites($db);
    $apres = vrt_account_active_plans($db['visitorAccounts'][0], $db);
    dit(in_array('plan2', $apres, true), 'après réparation : son abonnement ouvre enfin');
    dit((int) ($rap['abonnements'] ?? 0) === 1, 'et la passe dit combien de lignes elle a reprises',
        json_encode($rap));
    dit((string) ($db['elearning']['abonnements'][0]['accountId'] ?? '') === ID_REEL,
        'la ligne porte désormais l\'identifiant, plus le login');

    // Idempotence : repasser ne doit rien re-compter ni rien casser.
    $rap2 = vrt_reparer_identites($db);
    dit((int) ($rap2['abonnements'] ?? 0) === 0, 'repasser la réparation ne reprend rien de plus');

    // Un livre débloqué sous un login se rattrape aussi.
    $db2 = baseTest();
    $db2['visitorAccounts'][0]['unlockedBooks'] = [];
    $db2['livreDebloqueSousLogin'] = true;
    $db2['elearning']['abonnements'][] = [
        'id' => 'abo_orphelin', 'ref' => 'VT260901-BBBB', 'accountId' => '',
        'plan' => 'plan2', 'planId' => 'plan2', 'statut' => 'Activé', 'tel' => '699000000',
    ];
    $rapO = vrt_reparer_identites($db2);
    dit((int) ($rapO['abonnements'] ?? 0) === 0,
        'un abonnement SANS aucun identifiant n\'est pas attribué au hasard', json_encode($rapO));
}

echo "\n" . str_repeat('─', 68) . "\n";
if ($ko === 0) echo "\033[32m\033[1m  ✓ $ok/$ok contrôles passés — l'acheteur est reconnu.\033[0m\n\n";
else           echo "\033[31m\033[1m  ✗ $ko contrôle(s) au rouge sur " . ($ok + $ko) . ".\033[0m\n\n";
exit($ko === 0 ? 0 : 1);
