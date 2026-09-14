<?php
/**
 * tests/parrainage.php — LE CODE AMI ET LES FORMULES, ÉPROUVÉS SUR L'ARGENT
 * © 2024-2026 Jacques Miterand TAKOU (Mythe Errant).
 *
 *     php tests/parrainage.php
 *
 * Ce banc ne relit pas le code : il fabrique une base et un registre jetables,
 * confirme des paiements, et va LIRE ce qui a été crédité, versé, refusé.
 * La base de travail, le registre réel, la file de remise et les compteurs de
 * débit ne sont jamais touchés (VRT_DB_FICHIER, VRT_PARR_DIR, VRT_NOTIFY_DIR,
 * VRT_LIVRET_DIR, VRT_RATE_DIR pointent vers un dossier temporaire).
 *
 * Il garde, dans l'ordre :
 *   1. les réglages et leurs bornes ;
 *   2. des codes UNIQUES (l'ancien format donnait le même à des centaines de comptes) ;
 *   3. les formules Starter / Pro / Élite / Famille : prix, durée, étiquettes, famille ;
 *   4. l'évaluation d'un code : remise, parrain à vie, auto-parrainage ;
 *   5. le crédit au paiement confirmé : une fois, jamais sur un sous-paiement, repris au remboursement ;
 *   6. les versements : réservation, succès, refus, réponse perdue, plafond ;
 *   7. la parité de la table des opérateurs avec la passerelle.
 */
declare(strict_types=1);

$TMP = sys_get_temp_dir() . '/vrt_parr_banc_' . getmypid() . '_' . bin2hex(random_bytes(3));
@mkdir($TMP, 0700, true);
foreach (['parr', 'notify', 'livret', 'rate'] as $d) @mkdir("$TMP/$d", 0700, true);
define('VRT_PARR_DIR', "$TMP/parr");
define('VRT_NOTIFY_DIR', "$TMP/notify");
define('VRT_LIVRET_DIR', "$TMP/livret");
define('VRT_RATE_DIR', "$TMP/rate");
define('VRT_DB_FICHIER', "$TMP/veritas_db.json");
if (!defined('VRT_PRICE_ENFORCE')) define('VRT_PRICE_ENFORCE', 'strict');
register_shutdown_function(function () use ($TMP) {
    $it = new RecursiveIteratorIterator(new RecursiveDirectoryIterator($TMP, FilesystemIterator::SKIP_DOTS), RecursiveIteratorIterator::CHILD_FIRST);
    foreach ($it as $f) { $f->isDir() ? @rmdir($f->getPathname()) : @unlink($f->getPathname()); }
    @rmdir($TMP);
});

require_once __DIR__ . '/../api/_auth_lib.php';

$T = ['ok' => 0, 'ko' => 0, 'echecs' => []];
function ok(string $titre, bool $cond, string $detail = ''): void {
    global $T;
    if ($cond) { $T['ok']++; echo "  \033[32m✓\033[0m $titre\n"; return; }
    $T['ko']++; $T['echecs'][] = $titre . ($detail !== '' ? "  → $detail" : '');
    echo "  \033[31m✗\033[0m $titre" . ($detail !== '' ? "\n      \033[33m$detail\033[0m" : '') . "\n";
}
function titre(string $t): void { echo "\n\033[1m$t\033[0m\n"; }

/** Registre vierge : chaque scénario repart de zéro. */
function registreVide(): void {
    @unlink(VRT_PARR_DIR . '/registre.json');
    @unlink(VRT_PARR_DIR . '/registre.json.bak');
}
function reg(): array { return vrt_parr_lire(); }
function ecrireBase(array $db): void { file_put_contents(VRT_DB_FICHIER, json_encode($db, JSON_UNESCAPED_UNICODE)); }
function lireBase(): array { return json_decode((string) file_get_contents(VRT_DB_FICHIER), true) ?: []; }

/** Une base minimale : un parrain, un filleul, un voisin, un partenaire, des codes promo. */
function base(): array {
    return [
        'visitorAccounts' => [
            ['id' => 'va_parrain', 'user' => 'awa', 'pre' => 'Awa', 'nom' => 'Tchoua', 'tel' => '677001122', 'statut' => 'actif', 'plans' => []],
            ['id' => 'va_filleul', 'user' => 'paul', 'pre' => 'Paul', 'nom' => 'Mbida', 'tel' => '699334455', 'statut' => 'actif', 'plans' => []],
            ['id' => 'va_jumeau',  'user' => 'awa2', 'pre' => 'Awa', 'nom' => 'Bis', 'tel' => '+237 677 00 11 22', 'statut' => 'actif', 'plans' => []],
            ['id' => 'va_suspendu','user' => 'zed', 'pre' => 'Zed', 'nom' => 'Out', 'tel' => '655667788', 'statut' => 'suspendu', 'plans' => []],
            ['id' => 'va_enfant1', 'user' => 'enfant1', 'pre' => 'Léa', 'nom' => 'Mbida', 'tel' => '', 'statut' => 'actif', 'plans' => []],
            ['id' => 'va_enfant2', 'user' => 'enfant2', 'pre' => 'Tom', 'nom' => 'Mbida', 'tel' => '', 'statut' => 'actif', 'plans' => []],
            ['id' => 'va_sansnum', 'user' => 'sansnum', 'pre' => 'Nina', 'nom' => 'X', 'tel' => '', 'statut' => 'actif', 'plans' => []],
        ],
        'studentAccounts' => [],
        'teachers' => [['id' => 'ens_1', 'pre' => 'Marc', 'nom' => 'Ndi', 'tel' => '690112233']],
        'partners' => [['id' => 'prt_lib', 'nom' => 'Librairie Akwa', 'code' => 'AKWA', 'status' => 'active', 'tel' => '656000111']],
        'promoCodes' => [
            ['id' => 'pc1', 'code' => 'RENTRÉE15', 'reduction' => 15, 'type' => 'percent', 'actif' => true, 'usage' => 0, 'max' => 100],
            ['id' => 'pc2', 'code' => 'EPUISE', 'reduction' => 10, 'type' => 'percent', 'actif' => true, 'usage' => 5, 'max' => 5],
            ['id' => 'pc3', 'code' => 'VIEUX', 'reduction' => 10, 'type' => 'percent', 'actif' => true, 'expireLe' => '2020-01-01'],
            ['id' => 'pc4', 'code' => 'LIBRAIRIE', 'reduction' => 10, 'type' => 'percent', 'actif' => true, 'partnerId' => 'prt_lib'],
        ],
        'elearning' => ['plans' => [], 'abonnements' => [], 'contenus' => []],
        'visitorOrders' => [], 'livretVentes' => [],
    ];
}

echo "\n\033[1m╔══════════════════════════════════════════════════════════════════╗\033[0m\n";
echo   "\033[1m║  VÉRITAS — le Code ami paie-t-il juste, une fois, et à temps ?   ║\033[0m\n";
echo   "\033[1m╚══════════════════════════════════════════════════════════════════╝\033[0m\n";

// ═════════════════════════════════════════════════════════════════════════
titre('1. Réglages et bornes');
registreVide();
$c = vrt_parr_cfg([]);
ok('défauts : −10 % acheteur, 10 % parrain, versement dès 2 000 F, automatique',
   $c['remisePct'] === 10 && $c['commissionPct'] === 10 && $c['seuilVersement'] === 2000 && $c['versementAuto'] === true && $c['actif'] === true,
   json_encode($c));
$c = vrt_parr_cfg(['parrainageConfig' => ['remisePct' => 90, 'commissionPct' => 40, 'seuilVersement' => 50]]);
ok('un 90 % saisi par erreur est ramené à 50 %, et le cumul à 60 %', $c['remisePct'] === 50 && $c['commissionPct'] === 10, json_encode($c));
ok('un seuil de 50 F est ramené à 500 F (un versement coûte des frais)', $c['seuilVersement'] === 500);
vrt_parr_tx(function (array &$r) { $r['reglages'] = ['commissionPct' => 12]; });
$c = vrt_parr_cfg(['parrainageConfig' => ['commissionPct' => 8]]);
ok('les réglages du registre (écran admin) l’emportent sur la base synchronisée', $c['commissionPct'] === 12, json_encode($c));
registreVide();

// ═════════════════════════════════════════════════════════════════════════
titre('2. Des codes uniques');
$code = vrt_parr_code_pour_id('va_1789312345678_a1b2c3');
ok('format VRT + 6 caractères sans 0/O/1/I', (bool) preg_match('/^VRT[A-HJ-NP-Z2-9]{6}$/', $code), $code);
ok('déterministe : le même identifiant donne le même code', $code === vrt_parr_code_pour_id('va_1789312345678_a1b2c3'));
$vus = []; $collisions = 0;
for ($i = 0; $i < 20000; $i++) {
    $cc = vrt_parr_code_pour_id('va_' . (1789312345678 + $i * 37) . '_' . substr(md5((string) $i), 0, 6));
    if (isset($vus[$cc])) $collisions++;
    $vus[$cc] = true;
}
ok('20 000 comptes nés la même quinzaine : aucune collision', $collisions === 0, "$collisions collision(s)");
ok('l’ANCIEN format donnait le même code à deux comptes de la même quinzaine (le défaut réparé)',
   vrt_parr_code_ancien('va_1789312345678_a1b2c3') === vrt_parr_code_ancien('va_1789398765432_ffffff'));
$db = base();
$db['visitorAccounts'][] = ['id' => 'va_1789000000001_aaaaaa', 'user' => 'x1', 'pre' => 'X', 'nom' => '1', 'tel' => '', 'statut' => 'actif'];
$db['visitorAccounts'][] = ['id' => 'va_1789000000002_bbbbbb', 'user' => 'x2', 'pre' => 'X', 'nom' => '2', 'tel' => '', 'statut' => 'actif'];
ok('un ancien code AMBIGU est refusé (il désignait plusieurs personnes)', vrt_parr_resoudre($db, reg(), 'VRTVA1789') === null);
ok('un ancien code qui ne désigne QU’UNE personne reste honoré (kits déjà imprimés)',
   (vrt_parr_resoudre($db, reg(), vrt_parr_code_ancien('va_parrain'))['benef'] ?? '') === 'acc:va_parrain');
ok('« rentrée15 » tapé en minuscules, sans accent, trouve RENTRÉE15',
   (vrt_parr_resoudre($db, reg(), 'rentree15')['type'] ?? '') === 'promo');
ok('le code d’un partenaire est reconnu', (vrt_parr_resoudre($db, reg(), 'akwa')['benef'] ?? '') === 'prt:prt_lib');
ok('le code calculé d’un enseignant du centre est reconnu',
   (vrt_parr_resoudre($db, reg(), vrt_parr_code_pour_id('ens_1'))['benef'] ?? '') === 'ens:ens_1');

// ═════════════════════════════════════════════════════════════════════════
titre('3. Les formules Starter · Pro · Élite · Famille');
$db = base();
$attendus = ['abo_starter_m' => 1000, 'abo_pro_m' => 2000, 'abo_elite_m' => 3000, 'abo_famille_m' => 10000,
             'abo_starter_a' => 10000, 'abo_pro_a' => 20000, 'abo_elite_a' => 30000, 'abo_famille_a' => 100000];
$prixOk = true; $detail = '';
foreach ($attendus as $id => $p) {
    $v = vrt_prix_catalogue($db, 'subscription', $id);
    if ($v !== $p) { $prixOk = false; $detail .= $id . '=' . var_export($v, true) . ' au lieu de ' . $p . ' '; }
}
ok('tarifs connus du serveur SANS ligne en base (1 000/2 000/3 000/10 000 F par mois, l’année = 10 mois)', $prixOk, $detail);
$f = vrt_plans_formules();
ok('le prix barré de l’année est celui de 12 mois (12 000 F pour Starter)', (int) $f['abo_starter_a']['ancien'] === 12000);
$db2 = $db; $db2['elearning']['plans'][] = ['id' => 'abo_pro_m', 'nom' => 'PRO', 'prix' => 2500, 'duree' => 'mensuel'];
ok('un tarif réglé en base par l’administration l’emporte', vrt_prix_catalogue($db2, 'subscription', 'abo_pro_m') === 2500);

$g = vrt_grant_entitlement($db, ['intent' => 'subscription', 'targetId' => 'abo_pro_m', 'montant' => 100, 'ref' => 'F-SOUS', 'accountId' => 'va_filleul']);
ok('Pro mensuel payé 100 F : refusé, aucun plan écrit', empty($g['changed']) && !empty($g['underpaid']) && !in_array('abo_pro_m', $db['visitorAccounts'][1]['plans'], true), $g['msg'] ?? '');

$avant = (int) round(microtime(true) * 1000);
$g = vrt_grant_entitlement($db, ['intent' => 'subscription', 'targetId' => 'abo_pro_m', 'montant' => 2000, 'ref' => 'F-M1', 'accountId' => 'va_filleul']);
$abo = end($db['elearning']['abonnements']);
$jours = (int) round(((int) $abo['dateFinTs'] - $avant) / 86400000);
ok('Pro mensuel payé 2 000 F : activé pour 30 jours (et non 365)', !empty($g['changed']) && $jours === 30, "jours=$jours " . ($g['msg'] ?? ''));
$acc = vrt_parr_trouver_compte($db, 'va_filleul');
$tags = vrt_effective_plantags($acc, $db);
ok('le Pro ouvre les contenus existants (étiquettes plan1, plan2, plan5, plan6)', !array_diff(['plan1', 'plan2', 'plan5', 'plan6'], $tags), json_encode($tags));
$g = vrt_grant_entitlement($db, ['intent' => 'subscription', 'targetId' => 'abo_pro_m', 'montant' => 2000, 'ref' => 'F-M2', 'accountId' => 'va_filleul']);
$abo2 = end($db['elearning']['abonnements']);
$jours2 = (int) round(((int) $abo2['dateFinTs'] - $avant) / 86400000);
ok('réabonnement avant l’échéance : la nouvelle période part de la fin de l’ancienne (60 jours)', $jours2 === 60, "jours=$jours2");
$g = vrt_grant_entitlement($db, ['intent' => 'subscription', 'targetId' => 'abo_elite_a', 'montant' => 30000, 'ref' => 'F-A1', 'accountId' => 'va_parrain']);
$abo3 = end($db['elearning']['abonnements']);
ok('Élite à l’année : 365 jours', (int) round(((int) $abo3['dateFinTs'] - $avant) / 86400000) === 365);

$g = vrt_grant_entitlement($db, ['intent' => 'subscription', 'targetId' => 'abo_famille_m', 'montant' => 10000, 'ref' => 'F-FAM',
                                 'accountId' => 'va_filleul', 'beneficiaires' => ['enfant1', 'va_enfant2', 'inconnu9']]);
$e1 = vrt_parr_trouver_compte($db, 'va_enfant1'); $e2 = vrt_parr_trouver_compte($db, 'va_enfant2');
ok('Famille : chaque enfant désigné reçoit le plan et SA ligne d’abonnement',
   in_array('abo_famille_m', vrt_account_active_plans($e1, $db), true) && in_array('abo_famille_m', vrt_account_active_plans($e2, $db), true));
ok('Famille : un identifiant introuvable est signalé « à régler », sans annuler les autres',
   !empty($g['changed']) && !empty($g['a_regler']) && strpos((string) $g['msg'], 'inconnu9') !== false, $g['msg'] ?? '');
$db3 = base();
$g = vrt_grant_entitlement($db3, ['intent' => 'subscription', 'targetId' => 'abo_famille_m', 'montant' => 10000, 'ref' => 'F-FAM5',
                                  'accountId' => 'va_filleul', 'beneficiaires' => ['enfant1', 'enfant2', 'sansnum', 'awa2', 'zed']]);
$nbLignes = count(array_filter($db3['elearning']['abonnements'], function ($a) { return ($a['plan'] ?? '') === 'abo_famille_m'; }));
ok('Famille : jamais plus de 4 enfants couverts, en plus du payeur (5 lignes au plus)', $nbLignes === 5, "lignes=$nbLignes");

// Parité de la vitrine : la liste publique montre les formules, retire les anciens plans élève.
$src = (string) file_get_contents(__DIR__ . '/../api/public_data.php');
// \R et non \n : le poste de travail extrait en CRLF, la CI en LF.
if (preg_match('/function vrt_pd_plans_en_vente\(array \$db\): array \{.*?\R\}\R/s', $src, $m)) {
    eval(str_replace('function vrt_pd_plans_en_vente(', 'function __banc_plans_en_vente(', $m[0]));
    $pub = __banc_plans_en_vente(['elearning' => ['plans' => [
        ['id' => 'plan1', 'prix' => 5000], ['id' => 'plan3', 'prix' => 7000], ['id' => 'plan2', 'prix' => 3000, 'enVente' => true],
    ]]]);
    $ids = array_map(function ($p) { return $p['id']; }, $pub);
    ok('vitrine : les 8 formules sont proposées même absentes de la base', !array_diff(array_keys($attendus), $ids), implode(',', $ids));
    ok('vitrine : l’ancien plan élève (plan1) quitte la vente, le plan enseignant (plan3) reste', !in_array('plan1', $ids, true) && in_array('plan3', $ids, true));
    ok('vitrine : un ancien plan remis en vente à la main (enVente) réapparaît', in_array('plan2', $ids, true));
} else {
    ok('vrt_pd_plans_en_vente lisible dans public_data.php', false, 'regex décrochée');
}

// ═════════════════════════════════════════════════════════════════════════
titre('4. Évaluer un code sur un achat');
registreVide();
$db = base();
$codeAwa = vrt_parr_code_pour_id('va_parrain');
$ev = vrt_parr_evaluer($db, reg(), ['code' => $codeAwa, 'accountId' => 'va_filleul', 'intent' => 'subscription', 'targetId' => 'abo_pro_m', 'prix' => 2000]);
ok('code d’Awa sur un Pro à 2 000 F : −200 F, 1 800 F à payer, Awa bénéficiaire',
   $ev['ok'] && $ev['remise'] === 200 && $ev['montant'] === 1800 && $ev['benef'] === 'acc:va_parrain' && $ev['source'] === 'saisie', json_encode($ev));
ok('le nom du parrain est abrégé (« Awa T. »), jamais plus', $ev['parrain'] === 'Awa T.', $ev['parrain']);
$ev = vrt_parr_evaluer($db, reg(), ['code' => $codeAwa, 'accountId' => 'va_parrain', 'intent' => 'subscription', 'targetId' => 'abo_pro_m', 'prix' => 2000]);
ok('Awa ne peut pas utiliser son propre code', !$ev['ok'] && strpos($ev['motif'], 'propre code') !== false, $ev['motif']);
$ev = vrt_parr_evaluer($db, reg(), ['code' => $codeAwa, 'accountId' => 'va_jumeau', 'intent' => 'subscription', 'targetId' => 'abo_pro_m', 'prix' => 2000]);
ok('un second compte sur LE MÊME numéro est traité comme Awa elle-même', !$ev['ok'], $ev['motif']);
$ev = vrt_parr_evaluer($db, reg(), ['code' => vrt_parr_code_pour_id('va_suspendu'), 'accountId' => 'va_filleul', 'intent' => 'subscription', 'targetId' => 'abo_pro_m', 'prix' => 2000]);
ok('le code d’un compte suspendu n’a plus cours', !$ev['ok']);
foreach (['EPUISE' => 'épuisé', 'VIEUX' => 'expiré', 'NIMPORTEQUOI' => 'inconnu'] as $cd => $quoi) {
    $ev = vrt_parr_evaluer($db, reg(), ['code' => $cd, 'accountId' => 'va_filleul', 'intent' => 'subscription', 'targetId' => 'abo_pro_m', 'prix' => 2000]);
    ok("code promo $quoi : refusé", !$ev['ok']);
}
foreach (['inscription', 'cart', 'echeance', 'cagnotte'] as $it) {
    $ev = vrt_parr_evaluer($db, reg(), ['code' => $codeAwa, 'accountId' => 'va_filleul', 'intent' => $it, 'targetId' => 'x', 'prix' => 1000]);
    ok("le code ne s’applique pas à « $it »", !$ev['ok']);
}
$ev = vrt_parr_evaluer($db, reg(), ['code' => 'RENTREE15', 'accountId' => 'va_filleul', 'intent' => 'subscription', 'targetId' => 'abo_pro_m', 'prix' => 2000]);
ok('campagne RENTRÉE15 sans bénéficiaire : −15 %, personne n’est commissionné', $ev['ok'] && $ev['remise'] === 300 && $ev['benef'] === null && $ev['commissionPct'] === 0, json_encode($ev));
$ev = vrt_parr_evaluer($db, reg(), ['code' => 'LIBRAIRIE', 'accountId' => 'va_filleul', 'intent' => 'book', 'targetId' => 'bk', 'prix' => 5000]);
ok('code promo rattaché à un partenaire : remise ET commission au partenaire', $ev['ok'] && $ev['benef'] === 'prt:prt_lib' && $ev['commissionPct'] === 10);

// Parrain à vie
vrt_parr_tx(function (array &$r) { $r['liens']['acc:va_filleul'] = ['b' => 'acc:va_parrain', 'c' => vrt_parr_code_pour_id('va_parrain'), 't' => time()]; });
$ev = vrt_parr_evaluer($db, reg(), ['code' => '', 'accountId' => 'va_filleul', 'intent' => 'oeuvre', 'targetId' => 'oe1', 'prix' => 1000]);
ok('filleul rattaché, SANS rien saisir : remise et commission s’appliquent d’elles-mêmes', $ev['ok'] && $ev['source'] === 'lien' && $ev['benef'] === 'acc:va_parrain' && $ev['remise'] === 100, json_encode($ev));
$ev = vrt_parr_evaluer($db, reg(), ['code' => 'AKWA', 'accountId' => 'va_filleul', 'intent' => 'oeuvre', 'targetId' => 'oe1', 'prix' => 1000]);
ok('le code d’un AUTRE parrain ne détourne pas le lien à vie', $ev['ok'] && $ev['benef'] === 'acc:va_parrain', json_encode($ev));
$ev = vrt_parr_evaluer($db, reg(), ['code' => 'RENTREE15', 'accountId' => 'va_filleul', 'intent' => 'oeuvre', 'targetId' => 'oe1', 'prix' => 1000]);
ok('une campagne plus forte (−15 %) s’applique, et le parrain garde sa commission', $ev['ok'] && $ev['remise'] === 150 && $ev['benef'] === 'acc:va_parrain', json_encode($ev));
vrt_parr_tx(function (array &$r) { $r['reglages'] = ['actif' => false]; });
$ev = vrt_parr_evaluer($db, reg(), ['code' => $codeAwa, 'accountId' => 'va_enfant1', 'intent' => 'oeuvre', 'targetId' => 'oe1', 'prix' => 1000]);
ok('programme mis en pause par l’administration : aucun code ne s’applique', !$ev['ok']);
registreVide();

// Le prix : la remise tolérée n'est jamais plus que celle de la règle.
$etatCode = vrt_parr_pour_etat(vrt_parr_evaluer($db, reg(), ['code' => $codeAwa, 'accountId' => 'va_filleul', 'intent' => 'subscription', 'targetId' => 'abo_pro_m', 'prix' => 2000]));
$pv = vrt_verifier_prix($db, ['intent' => 'subscription', 'targetId' => 'abo_pro_m', 'montant' => 1800, 'parrainage' => $etatCode]);
ok('prix : 1 800 F avec le code (−10 %) accepté', $pv['ok'], json_encode($pv));
$pv = vrt_verifier_prix($db, ['intent' => 'subscription', 'targetId' => 'abo_pro_m', 'montant' => 1600, 'parrainage' => $etatCode]);
ok('prix : 1 600 F (−20 %) refusé malgré le code', !$pv['ok'], json_encode($pv));
/* Sans code transmis, seule reste l'ancienne tolérance « meilleure remise active
   en base » (vrt_prix_plancher) — celle des navigateurs d'avant le Code ami. On
   l'éprouve sur une base SANS campagne active, sinon RENTRÉE15 la justifierait. */
$dbSansCampagne = $db; $dbSansCampagne['promoCodes'] = [];
$pv = vrt_verifier_prix($dbSansCampagne, ['intent' => 'subscription', 'targetId' => 'abo_pro_m', 'montant' => 1800]);
ok('prix : 1 800 F SANS code (et sans campagne active) refusé — la remise ne se devine pas', !$pv['ok']);

// ═════════════════════════════════════════════════════════════════════════
titre('5. Le crédit, au paiement confirmé');
registreVide();
ecrireBase(base());
$db = lireBase();
$etat = function (string $ref, int $montant, ?array $parr, string $payeur = 'va_filleul', string $cible = 'abo_pro_m') {
    return ['intent' => 'subscription', 'targetId' => $cible, 'montant' => $montant, 'montant_paye' => $montant,
            'ref' => $ref, 'accountId' => $payeur, 'clientTel' => '', 'label' => 'Pro', 'parrainage' => $parr];
};
$p = vrt_parr_pour_etat(vrt_parr_evaluer($db, reg(), ['code' => $codeAwa, 'accountId' => 'va_filleul', 'intent' => 'subscription', 'targetId' => 'abo_pro_m', 'prix' => 2000]));
$g = vrt_grant_entitlement_to_file($etat('C-1', 1800, $p));
$r = reg();
ok('paiement de 1 800 F confirmé : 180 F crédités à Awa, immédiatement', (int) ($r['comptes']['acc:va_parrain']['solde'] ?? 0) === 180, json_encode($r['comptes'] ?? []));
ok('l’abonnement est bien ouvert au filleul', in_array('abo_pro_m', vrt_parr_trouver_compte(lireBase(), 'va_filleul')['plans'] ?? [], true));
ok('le lien à vie est né au premier paiement (registre ET copie dans la base)',
   ($r['liens']['acc:va_filleul']['b'] ?? '') === 'acc:va_parrain' && (vrt_parr_trouver_compte(lireBase(), 'va_filleul')['parrainBenef'] ?? '') === 'acc:va_parrain');
vrt_grant_entitlement_to_file($etat('C-1', 1800, $p));
ok('webhook rejoué : aucun double crédit', (int) (reg()['comptes']['acc:va_parrain']['solde'] ?? 0) === 180);
vrt_parr_crediter_fichier($etat('C-1', 1800, $p));
ok('validation manuelle APRÈS le webhook : toujours aucun double crédit', (int) (reg()['comptes']['acc:va_parrain']['solde'] ?? 0) === 180);
$g = vrt_grant_entitlement_to_file($etat('C-SOUS', 1500, $p));
ok('sous-paiement (1 500 F) : accès refusé ET aucune commission', !empty($g['underpaid']) && !isset(reg()['ops']['r:C-SOUS']), json_encode($g['parrainage'] ?? null));
$g = vrt_grant_entitlement_to_file($etat('C-SANS', 2000, null, 'va_enfant2'));
ok('paiement sans code ni parrain : rien au registre', !isset(reg()['ops']['r:C-SANS']));

// Le bénéficiaire suspendu ENTRE l'initiation et la confirmation.
$b = lireBase(); $b['visitorAccounts'][0]['statut'] = 'suspendu'; ecrireBase($b);
vrt_grant_entitlement_to_file($etat('C-SUSP', 1800, $p, 'va_enfant1'));
$op = reg()['ops']['r:C-SUSP'] ?? [];
ok('parrain suspendu entre-temps : opération tracée avec le refus, solde inchangé', ($op['refus'] ?? '') !== '' && (int) (reg()['comptes']['acc:va_parrain']['solde'] ?? 0) === 180, json_encode($op));
$b['visitorAccounts'][0]['statut'] = 'actif'; ecrireBase($b);

// Remboursement.
vrt_parr_annuler('C-1', 0);
ok('remboursement total : la commission est reprise (solde 0)', (int) (reg()['comptes']['acc:va_parrain']['solde'] ?? -1) === 0);
vrt_parr_annuler('C-1', 0);
ok('remboursement rejoué : rien n’est repris deux fois', (int) (reg()['comptes']['acc:va_parrain']['solde'] ?? -1) === 0);

// Le seuil : dès 2 000 F cumulés, le versement est demandé.
// Solde à 0 après la reprise : 11 × 180 = 1 980 F (pas encore), 12 × 180 = 2 160 F (maintenant).
$aVerser = false;
for ($i = 1; $i <= 13; $i++) {
    $g = vrt_grant_entitlement_to_file($etat('C-S' . $i, 1800, $p));
    if (!empty($g['parrainage']['aVerser'])) { $aVerser = $i; break; }
}
ok('le versement est demandé au crédit qui franchit 2 000 F — pas avant (12ᵉ vente à 180 F)', $aVerser === 12, 'demandé au passage ' . var_export($aVerser, true) . ' solde=' . (reg()['comptes']['acc:va_parrain']['solde'] ?? '?'));

// ═════════════════════════════════════════════════════════════════════════
titre('6. Les versements');
$db = lireBase(); $r = reg();
$dest = vrt_parr_destination($db, $r, 'acc:va_parrain');
ok('destination : numéro MTN d’Awa reconnu', !empty($dest['ok']) && $dest['methode'] === 'mtn_momo' && $dest['tel'] === '237677001122', json_encode($dest));
$d2 = vrt_parr_destination($db, $r, 'acc:va_sansnum');
ok('sans numéro Mobile Money : motif lisible, rien ne part', empty($d2['ok']) && strpos((string) $d2['motif'], 'Numéro') !== false);
$solde = (int) $r['comptes']['acc:va_parrain']['solde'];
$v = vrt_parr_reserver('acc:va_parrain', $dest, 2000, 200000);
$r = reg();
ok('réservation : tout le solde passe « en cours », le solde tombe à 0', $v && (int) $v['m'] === $solde && (int) $r['comptes']['acc:va_parrain']['solde'] === 0 && (int) $r['comptes']['acc:va_parrain']['enCours'] === $solde);
/* Pendant que ce lot attend l'approbation de CamerPay, de nouvelles ventes
   refont un solde au-dessus du seuil : un second lot NE DOIT PAS partir tant
   que le premier est en vol (sinon deux webhooks simultanés versent deux fois).
   Sans ces 2 500 F, la garde « en cours » ne serait jamais éprouvée : le solde
   à zéro suffirait à refuser. */
vrt_parr_tx(function (array &$r) { $r['comptes']['acc:va_parrain']['solde'] += 2500; });
ok('nouveau solde ≥ seuil pendant qu’un versement est en vol : aucun second lot', vrt_parr_reserver('acc:va_parrain', $dest, 2000, 200000) === null);
vrt_parr_tx(function (array &$r) { $r['comptes']['acc:va_parrain']['solde'] -= 2500; });
vrt_parr_versement_etat($v['ref'], 'soumis', '', 'batch-1');
vrt_parr_versement_etat($v['ref'], 'verse');
$r = reg();
ok('versement confirmé par CamerPay : « versé » augmente, « en cours » revient à 0', (int) $r['comptes']['acc:va_parrain']['verse'] === $solde && (int) $r['comptes']['acc:va_parrain']['enCours'] === 0);
vrt_parr_versement_etat($v['ref'], 'echec', 'tardif');
ok('un « échec » arrivé APRÈS « versé » ne recrédite pas (état final)', (int) reg()['comptes']['acc:va_parrain']['solde'] === 0);

vrt_parr_tx(function (array &$r) { $r['comptes']['acc:va_parrain']['solde'] = 2500; });
$v = vrt_parr_reserver('acc:va_parrain', $dest, 2000, 200000);
vrt_parr_versement_etat($v['ref'], 'echec', 'Numéro inactif');
$r = reg();
ok('versement refusé par l’opérateur : le montant revient au solde, le motif est affiché', (int) $r['comptes']['acc:va_parrain']['solde'] === 2500 && strpos((string) ($r['comptes']['acc:va_parrain']['blocage'] ?? ''), 'Numéro inactif') !== false);
$v = vrt_parr_reserver('acc:va_parrain', $dest, 2000, 200000);
vrt_parr_versement_etat($v['ref'], 'incertain', 'HTTP 0');
$r = reg();
ok('réponse perdue : la réservation est GARDÉE (sinon double versement possible)', (int) $r['comptes']['acc:va_parrain']['enCours'] === 2500 && (int) $r['comptes']['acc:va_parrain']['solde'] === 0);
vrt_parr_versement_etat($v['ref'], 'echec', 'Vérifié : jamais parti');
ok('l’administration tranche « jamais parti » : le solde est rendu', (int) reg()['comptes']['acc:va_parrain']['solde'] === 2500);

vrt_parr_tx(function (array &$r) { $r['comptes']['acc:va_parrain']['solde'] = 250000; $r['comptes']['acc:va_parrain']['enCours'] = 0; });
$v = vrt_parr_reserver('acc:va_parrain', $dest, 2000, 200000);
ok('solde au-dessus du plafond de versement : on verse le plafond, le reste attend', $v && (int) $v['m'] === 200000 && (int) reg()['comptes']['acc:va_parrain']['solde'] === 50000);
$n = vrt_parr_definir_numero('acc:va_sansnum', '621000000');
ok('un numéro Camtel (ni MTN ni Orange) est refusé comme numéro de versement', empty($n['ok']));
$n = vrt_parr_definir_numero('acc:va_sansnum', '+237 691 23 45 67');
ok('un numéro Orange est accepté et devient la destination', !empty($n['ok']) && (vrt_parr_destination(lireBase(), reg(), 'acc:va_sansnum')['methode'] ?? '') === 'orange_money');

$res = vrt_parr_resume(lireBase(), reg(), 'acc:va_parrain');
ok('« Mon code ami » : code, lien, gains et règle en vigueur', $res['code'] === $codeAwa && strpos($res['lien'], $codeAwa) !== false && $res['regle']['remisePct'] === 10 && $res['gagne'] > 0, json_encode(array_intersect_key($res, array_flip(['code', 'gagne', 'solde', 'verse']))));
ok('« Mon code ami » : le numéro est masqué', strpos((string) $res['numero'], '001122') === false);

// ═════════════════════════════════════════════════════════════════════════
titre('7. Parité de la table des opérateurs');
$srcCy = (string) file_get_contents(__DIR__ . '/../api/payment_camerpay.php');
$okExtrait = preg_match('/function camerpayNormalizePhone\(\$tel\) \{.*?\R\}\R/s', $srcCy, $m1)
          && preg_match('/function camerpayGuessMethod\(\$tel\) \{.*?\R\}\R/s', $srcCy, $m2);
if ($okExtrait) {
    eval(str_replace('camerpayNormalizePhone', '__banc_norm', $m1[0]));
    eval(str_replace(['camerpayGuessMethod', 'camerpayNormalizePhone'], ['__banc_guess', '__banc_norm'], $m2[0]));
    $ecarts = [];
    for ($pfx = 600; $pfx <= 699; $pfx++) {
        $tel = $pfx . '123456';
        if (__banc_guess($tel) !== vrt_parr_methode($tel)) $ecarts[] = $pfx;
    }
    ok('vrt_parr_methode ≡ camerpayGuessMethod sur les 100 préfixes 600-699', !$ecarts, 'écarts : ' . implode(',', $ecarts));
} else {
    ok('camerpayGuessMethod lisible dans payment_camerpay.php', false, 'regex décrochée');
}

// ═════════════════════════════════════════════════════════════════════════
titre('8. Prix réglés dans « Prix & calculs » : le serveur les applique');
$db = base();
// Une formule retirée de la vente : ni tarif, ni vitrine, ni repli.
$db['elearning']['plans'][] = ['id' => 'abo_elite_m', 'formule' => true, 'groupe' => 'elite', 'variante' => 'mois',
                               'nom' => 'ÉLITE', 'prix' => 3000, 'duree' => 'mensuel', 'actif' => false];
ok('formule retirée : aucun tarif (le repli codé ne la remet pas en vente)', vrt_prix_catalogue($db, 'subscription', 'abo_elite_m') === null);
$pv = vrt_verifier_prix($db, ['intent' => 'subscription', 'targetId' => 'abo_elite_m', 'montant' => 3000]);
ok('formule retirée : un paiement au plein tarif est refusé', !$pv['ok']);
// Un tarif modifié : c'est lui qu'on exige.
$db['elearning']['plans'][] = ['id' => 'abo_pro_m', 'formule' => true, 'groupe' => 'pro', 'variante' => 'mois',
                               'nom' => 'PRO', 'prix' => 2500, 'duree' => 'mensuel'];
ok('tarif modifié à 2 500 F : exigé tel quel', vrt_prix_catalogue($db, 'subscription', 'abo_pro_m') === 2500);
$pv = vrt_verifier_prix($db, ['intent' => 'subscription', 'targetId' => 'abo_pro_m', 'montant' => 2000]);
ok('tarif modifié : l’ancien prix (2 000 F) ne passe plus', !$pv['ok']);

if (function_exists('__banc_plans_en_vente')) {
    $pub = __banc_plans_en_vente($db);
    $ids = array_map(function ($p) { return $p['id']; }, $pub);
    ok('vitrine : la formule retirée n’est pas proposée (ni par la base, ni par le repli)', !in_array('abo_elite_m', $ids, true), implode(',', $ids));
    $proPub = array_values(array_filter($pub, function ($p) { return $p['id'] === 'abo_pro_m'; }))[0] ?? [];
    ok('vitrine : le tarif modifié est celui qu’on affiche', (int) ($proPub['prix'] ?? 0) === 2500);
}

// Paliers de remise des packs d'établissement.
ok('paliers par défaut : 10 % dès 10, 15 % dès 25, 20 % dès 50',
   vrt_livret_paliers_pack([]) === [[50, 20], [25, 15], [10, 10]]);
$dbP = ['tarifs' => ['livret' => 1500, 'livretPack' => ['5' => 5, '30' => 25, '999' => 40, '20' => 80]]];
ok('paliers réglés : les valeurs hors bornes (999 codes, 80 %) sont écartées', vrt_livret_paliers_pack($dbP) === [[30, 25], [5, 5]], json_encode(vrt_livret_paliers_pack($dbP)));
ok('prix d’un pack de 30 : 30 × 1 500 − 25 % = 33 750 F', vrt_livret_prix_pack($dbP, 'livret', 30) === 33750);
ok('prix d’un pack de 4 (sous le premier palier) : sans remise', vrt_livret_prix_pack($dbP, 'livret', 4) === 6000);

// La tranche publique des tarifs : des nombres bornés, rien d'autre.
if (preg_match('/function vrt_pd_tarifs_publics\(array \$db\): array \{.*?\R\}\R/s', $src, $mt)) {
    eval(str_replace('function vrt_pd_tarifs_publics(', 'function __banc_tarifs_publics(', $mt[0]));
    $tp = __banc_tarifs_publics([
        'microPrix' => ['epreuve' => ['montant' => 300, 'label' => 'Une épreuve'], 'labo' => ['montant' => -5],
                        'ia' => ['montant' => 700, 'jetons' => 30, 'secret' => 'x']],
        'tarifs' => ['inscription' => 150, 'inscriptionRoles' => ['enseignant' => 600, 'pirate' => 1],
                     'livret' => 2000, 'fraisOperateurPct' => 1.5, 'formules' => ['moisOfferts' => 3],
                     'livretParOuvrage' => ['bord-tle' => ['livret' => 9]], 'cleApi' => 'NE PAS PUBLIER'],
    ]);
    ok('tarifs publics : le micro-achat réglé (300 F) et les crédits IA (700 F / 30) sont publiés',
       ($tp['microPrix']['epreuve']['montant'] ?? 0) === 300 && ($tp['microPrix']['ia']['jetons'] ?? 0) === 30);
    ok('tarifs publics : un montant négatif n’est pas publié', !isset($tp['microPrix']['labo']));
    ok('tarifs publics : un champ inconnu ne sort pas (ni « secret », ni « cleApi », ni un rôle inventé)',
       strpos(json_encode($tp), 'secret') === false && strpos(json_encode($tp), 'NE PAS PUBLIER') === false
       && !isset($tp['tarifs']['inscriptionRoles']['pirate']));
    ok('tarifs publics : inscription, livret, frais, mois offerts publiés',
       ($tp['tarifs']['inscription'] ?? 0) === 150 && ($tp['tarifs']['livret'] ?? 0) === 2000
       && ($tp['tarifs']['fraisOperateurPct'] ?? 0) == 1.5 && ($tp['tarifs']['formules']['moisOfferts'] ?? 0) === 3);
} else {
    ok('vrt_pd_tarifs_publics lisible dans public_data.php', false, 'regex décrochée');
}

echo "\n────────────────────────────────────────────────────────────────────\n";
if ($T['ko'] === 0) {
    echo "\033[32m\033[1m  ✓ {$T['ok']}/{$T['ok']} contrôles passés — le Code ami paie juste.\033[0m\n\n";
    exit(0);
}
echo "\033[31m\033[1m  ✗ {$T['ko']} échec(s) sur " . ($T['ok'] + $T['ko']) . " :\033[0m\n";
foreach ($T['echecs'] as $e) echo "    - $e\n";
exit(1);
