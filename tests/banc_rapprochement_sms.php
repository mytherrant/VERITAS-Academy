<?php
/* ════════════════════════════════════════════════════════════════════════════
   tests/banc_rapprochement_sms.php — UN SMS DE RÉCEPTION PEUT-IL SERVIR UN
   LIVRET SANS HUMAIN… ET UN FAUX SMS, JAMAIS ?
   © 2024-2026 Jacques Miterand TAKOU (Mythe Errant).

       php tests/banc_rapprochement_sms.php

   Rejoue le rapprochement (api/_rapprochement_lib.php) contre l'OCTROI RÉEL
   (vrt_grant_entitlement_to_file) : base, registre des livrets, file de
   remise et dossier des commandes sont tous TEMPORAIRES. Rien n'est écrit
   dans les données du site.

   Ce qu'il verrouille : un code n'est émis sans humain que si le SMS vient
   de l'opérateur, que le nouveau solde prolonge EXACTEMENT la chaîne des
   soldes, que la transaction n'a jamais servi, qu'une commande déclarée
   correspond, et que le montant et le type d'achat sont autorisés. Un faux
   SMS ne sert rien, gèle la chaîne, et ne peut pas la ré-ancrer.
   ════════════════════════════════════════════════════════════════════════════ */
declare(strict_types=1);

$tmp = sys_get_temp_dir() . '/vrt_sms_banc_' . getmypid();
@mkdir($tmp, 0700, true);
define('VRT_PM_DIR', $tmp . '/pm');
define('VRT_LIVRET_DIR', $tmp . '/livrets');
define('VRT_NOTIFY_DIR', $tmp . '/notify');
define('VRT_DB_FICHIER', $tmp . '/db.json');
define('VRT_NOTIFY_CANAL', 'aucun');
define('VRT_SMS_SANS_MAIL', 1);
define('VRT_PRICE_ENFORCE', 'strict');
define('SMS_WEBHOOK_SECRET', str_repeat('k', 32));
define('SMS_AUTO_MAX', 25000);
@mkdir(VRT_LIVRET_DIR, 0700, true);
register_shutdown_function(function () use ($tmp) {
    $it = new RecursiveIteratorIterator(new RecursiveDirectoryIterator($tmp, FilesystemIterator::SKIP_DOTS),
                                        RecursiveIteratorIterator::CHILD_FIRST);
    foreach ($it as $f) { $f->isDir() ? @rmdir($f->getPathname()) : @unlink($f->getPathname()); }
    @rmdir($tmp);
});

require_once __DIR__ . '/../api/_rapprochement_lib.php';

$vert = 0; $rouge = 0;
function ok(string $quoi, bool $c, string $d = ''): void { global $vert, $rouge;
    if ($c) { $vert++; echo "  \033[32m✓\033[0m $quoi\n"; }
    else    { $rouge++; echo "  \033[31m✗\033[0m $quoi" . ($d !== '' ? "  → $d" : '') . "\n"; } }
function titre(string $t): void { echo "\n\033[1m$t\033[0m\n"; }

file_put_contents(VRT_DB_FICHIER, json_encode([
    'visitorAccounts' => [['id' => 'acc_test', 'nom' => 'Testeur', 'plans' => []]],
    'tarifs' => ['livret' => 1500, 'livretGuide' => 5000, 'livretJours' => 0],
    'plans' => [['id' => 'p1', 'nom' => 'Pro', 'prix' => 3000]],
    'books' => [['id' => 'bk1', 'titre' => 'Manuel de français 3e', 'prix' => 2500, 'prixDigital' => 2500]],
    'promoCodes' => [], 'visitorOrders' => [], 'payments' => [], 'commissions' => [],
]));

/** Une commande déclarée, telle que payment_manuel.php « declarer » l'écrit. */
function declarer(string $ref, string $tel, int $montant = 1500, string $intent = 'livret',
                  string $cible = '6e:livret', string $quand = 'now', string $txid = ''): string {
    $e = pmEtat(['ref' => $ref, 'intent' => $intent, 'targetId' => $cible, 'accountId' => 'acc_test',
                 'montant' => $montant, 'clientTel' => $tel, 'clientNom' => 'Parent', 'label' => 'Livret'], []);
    $e['status'] = 'declare'; $e['declared_at'] = date('c', strtotime($quand)); unset($e['paid_at']);
    if ($txid !== '') $e['txid'] = $txid;
    pmEcrire(pmPath(pmRefSafe($ref)), $e);
    return pmRefSafe($ref);
}
function cmd(string $ref): array { return pmLire(pmPath(pmRefSafe($ref))); }
function ventes(): array { $db = json_decode((string) file_get_contents(VRT_DB_FICHIER), true); return $db['livretVentes'] ?? []; }
function mtn(int $montant, string $tel, int $solde, string $tx): string {
    return "Vous avez recu $montant FCFA de NGONO MARIE (237$tel) le 26/09/2026 10:12. Message: livret. "
         . "Nouveau solde: " . number_format($solde, 0, ',', ' ') . " FCFA. Transaction Id: $tx.";
}
function orange(int $montant, string $tel, int $solde, string $tx): string {
    return "Paiement recu de " . number_format($montant, 0, ',', ' ') . ",00 FCFA du $tel ABENA PAUL. "
         . "ID transaction: $tx. Nouveau solde: $solde FCFA.";
}

// ─────────────────────────────────────────────────────────────────────────────
titre('① Lecture des SMS d’opérateur');
$a = vrt_sms_analyser(mtn(1500, '690000001', 11500, '7788990011'), 'MobileMoney');
ok('MTN : opérateur, sens, montant, solde, numéro, transaction',
   $a && $a['operateur'] === 'mtn' && $a['sens'] === 'entrant' && $a['montant'] === 1500
   && $a['solde'] === 11500 && $a['tel'] === '690000001' && $a['txid'] === '7788990011', json_encode($a));
$b = vrt_sms_analyser(orange(12500, '699000002', 40000, 'MP260926.1012.A12345'), 'OrangeMoney');
ok('Orange : « 12 500,00 FCFA » lu 12 500, et non 1 250 000', $b && $b['montant'] === 12500 && $b['operateur'] === 'orange', json_encode($b));
ok('Orange : ID de transaction avec points', $b && $b['txid'] === 'MP260926.1012.A12345', json_encode($b));
$c = vrt_sms_analyser('Vous avez envoye 5000 FCFA a 677000000. Frais: 50 FCFA. Nouveau solde: 3000 FCFA. Transaction Id: 555666777.', 'MobileMoney');
ok('un envoi est « sortant », frais lus à part', $c && $c['sens'] === 'sortant' && $c['frais'] === 50 && $c['montant'] === 5000, json_encode($c));
ok('un SMS sans montant n’est pas un SMS d’argent', vrt_sms_analyser('Votre code de confirmation est 4521', 'MobileMoney') === null);
ok('expéditeur de l’opérateur admis, inconnu refusé',
   vrt_sms_expediteur_admis('MobileMoney') && vrt_sms_expediteur_admis('Orange Money') && !vrt_sms_expediteur_admis('+237677123456'));

// ─────────────────────────────────────────────────────────────────────────────
titre('② Chaîne jamais ancrée : rien n’est automatique');
declarer('VT-A1', '690000001');
$r = vrt_sms_traiter(mtn(1500, '690000001', 11500, '1000000001'), 'MobileMoney');
ok('SMS conforme mais chaîne non ancrée → non vérifié', ($r['statut'] ?? '') === 'non_verifie', json_encode($r));
ok('aucun code émis', count(ventes()) === 0 && empty(cmd('VT-A1')['granted']));

// ─────────────────────────────────────────────────────────────────────────────
titre('③ Paiement conforme : le code part sans humain');
vrt_sms_ancrer('mtn', 10000, 'banc');
$r = vrt_sms_traiter(mtn(1500, '690000001', 11500, '7788990011'), 'MobileMoney');
ok('le SMS sert la commande', !empty($r['auto']) && ($r['ref'] ?? '') === 'VT-A1', json_encode($r));
$v = ventes();
ok('un code de livret est émis (6e)', count($v) === 1 && ($v[0]['classe'] ?? '') === '6e' && !empty($v[0]['code']), json_encode($v));
$k = cmd('VT-A1');
ok('la commande est accordée et signée « auto:sms »', !empty($k['granted']) && strpos((string) $k['valide_par'], 'auto:sms:mtn:7788990011') === 0, (string) ($k['valide_par'] ?? ''));
ok('la chaîne avance au nouveau solde', vrt_sms_chaine_lire('mtn')['solde'] === 11500);

titre('④ Un même paiement ne sert qu’une fois');
$r = vrt_sms_traiter(mtn(1500, '690000001', 11500, '7788990011'), 'MobileMoney');
ok('le relais rejoue le SMS → doublon', !empty($r['doublon']), json_encode($r));
declarer('VT-A2', '690000001');
$r = vrt_sms_traiter(mtn(1500, '690000001', 13000, '7788990011') . ' ', 'MobileMoney');
ok('même transaction, texte reformulé → ignoré', ($r['statut'] ?? '') === 'ignore', json_encode($r));
ok('toujours un seul code', count(ventes()) === 1 && empty(cmd('VT-A2')['granted']));
ok('et la chaîne n’a pas bougé', vrt_sms_chaine_lire('mtn')['solde'] === 11500);

// ─────────────────────────────────────────────────────────────────────────────
titre('⑤ Un faux SMS ne sert rien, et gèle la chaîne');
$r = vrt_sms_traiter(mtn(1500, '690000001', 99999, '9999999991'), 'MobileMoney');
ok('solde incohérent → non vérifié', ($r['statut'] ?? '') === 'non_verifie', json_encode($r));
ok('la commande VT-A2 reste en attente', empty(cmd('VT-A2')['granted']) && count(ventes()) === 1);
ok('la chaîne MTN est rompue', !empty(vrt_sms_chaine_lire('mtn')['rompue']));
ok('le faux solde n’a PAS été adopté', vrt_sms_chaine_lire('mtn')['solde'] === 11500);
$r = vrt_sms_traiter(mtn(1500, '690000001', 101499, '9999999992'), 'MobileMoney');
ok('un second faux « cohérent » avec le premier ne passe pas', ($r['statut'] ?? '') === 'non_verifie' && empty(cmd('VT-A2')['granted']), json_encode($r));
$r = vrt_sms_traiter(mtn(1500, '690000001', 13000, '2000000003'), 'MobileMoney');
ok('même un vrai SMS attend, tant que l’humain n’a pas ré-ancré', ($r['statut'] ?? '') === 'non_verifie' && empty(cmd('VT-A2')['granted']));
ok('Orange n’est pas touché par la rupture MTN', empty(vrt_sms_chaine_lire('orange')['rompue']));

titre('⑥ L’humain ré-ancre, l’automatique reprend');
vrt_sms_ancrer('mtn', 13000, 'banc');
$r = vrt_sms_traiter(mtn(1500, '690000001', 14500, '2000000004'), 'MobileMoney');
ok('VT-A2 servie après ré-ancrage', !empty($r['auto']) && !empty(cmd('VT-A2')['granted']) && count(ventes()) === 2, json_encode($r));

// ─────────────────────────────────────────────────────────────────────────────
titre('⑦ Payé AVANT d’avoir déclaré');
vrt_sms_ancrer('orange', 40000, 'banc');
$r = vrt_sms_traiter(orange(1500, '699000002', 41500, 'MP260926.0001.B1'), 'OrangeMoney');
ok('SMS vérifié sans commande → mis en attente', ($r['statut'] ?? '') === 'en_attente', json_encode($r));
$refB = declarer('VT-B1', '699000002');
$x = vrt_sms_rapprocher_commande($refB);
ok('la déclaration le retrouve et sert la commande', !empty($x['auto']) && !empty(cmd('VT-B1')['granted']), json_encode($x));

titre('⑧ Payé depuis le numéro d’un parent : l’ID de transaction rattrape');
$refC = declarer('VT-C1', '690000055');
$r = vrt_sms_traiter(mtn(1500, '677000099', 16000, '3000000005'), 'MobileMoney');
ok('numéro différent → en attente, rien d’accordé', ($r['statut'] ?? '') === 'en_attente' && empty(cmd('VT-C1')['granted']), json_encode($r));
$k = cmd('VT-C1'); $k['txid'] = '3000000005'; pmEcrire(pmPath($refC), $k);
$x = vrt_sms_rapprocher_commande($refC);
ok('l’ID saisi par l’acheteur sert la commande', !empty($x['auto']) && !empty(cmd('VT-C1')['granted']), json_encode($x));
$refC2 = declarer('VT-C2', '690000077', 1500, 'livret', '6e:livret', 'now', '3000000005');
$x = vrt_sms_rapprocher_commande($refC2);
ok('le même ID ne sert pas une seconde commande', empty($x['auto']) && empty(cmd('VT-C2')['granted']), json_encode($x));

// ─────────────────────────────────────────────────────────────────────────────
titre('⑨ Plafond et types d’achat');
declarer('VT-D1', '690000010', 30000, 'livret_pack', '6e:livret:20');
$r = vrt_sms_traiter(mtn(30000, '690000010', 46000, '4000000006'), 'MobileMoney');
ok('au-dessus du plafond → validation humaine', empty(cmd('VT-D1')['granted']) && ($r['statut'] ?? '') === 'en_attente', json_encode($r));
declarer('VT-D2', '690000011', 3000, 'subscription', 'p1');
$r = vrt_sms_traiter(mtn(3000, '690000011', 49000, '4000000007'), 'MobileMoney');
ok('un abonnement n’est pas servi par SMS (hors périmètre)', empty(cmd('VT-D2')['granted']), json_encode($r));

titre('⑩ Expéditeur et fenêtre');
$av = vrt_sms_chaine_lire('mtn')['solde'];
$r = vrt_sms_traiter(mtn(1500, '690000012', $av + 1500, '5000000008'), '+237677123456');
ok('un SMS d’un particulier est ignoré', ($r['statut'] ?? '') === 'ignore', json_encode($r));
ok('et ne fait pas avancer la chaîne', vrt_sms_chaine_lire('mtn')['solde'] === $av);
declarer('VT-E1', '690000013', 1500, 'livret', '6e:livret', '-5 days');
$r = vrt_sms_traiter(mtn(1500, '690000013', $av + 1500, '5000000009'), 'MobileMoney');
ok('une commande déclarée il y a 5 jours n’est pas servie', empty(cmd('VT-E1')['granted']), json_encode($r));

titre('⑪ Mouvements sortants et commandes jumelles');
$av = vrt_sms_chaine_lire('mtn')['solde'];
$r = vrt_sms_traiter("Vous avez envoye 1000 FCFA a 677000000. Frais: 20 FCFA. Nouveau solde: " . ($av - 1020) . " FCFA. Transaction Id: 6000000010.", 'MobileMoney');
ok('un retrait cohérent fait avancer la chaîne', ($r['statut'] ?? '') === 'mouvement' && vrt_sms_chaine_lire('mtn')['solde'] === $av - 1020, json_encode($r));
$av = vrt_sms_chaine_lire('mtn')['solde'];
declarer('VT-F1', '690000020', 1500, 'livret', '6e:livret', '-2 hours');
declarer('VT-F2', '690000020', 1500, 'livret', '6e:livret', '-1 hours');
vrt_sms_traiter(mtn(1500, '690000020', $av + 1500, '7000000011'), 'MobileMoney');
ok('deux commandes identiques : la plus ancienne est servie d’abord', !empty(cmd('VT-F1')['granted']) && empty(cmd('VT-F2')['granted']));
vrt_sms_traiter(mtn(1500, '690000020', $av + 3000, '7000000012'), 'MobileMoney');
ok('le second paiement sert la seconde', !empty(cmd('VT-F2')['granted']));

titre('⑫ Un manuel numérique est servi comme un livret');
$av = vrt_sms_chaine_lire('mtn')['solde'];
declarer('VT-G1', '690000030', 2500, 'digitalbook', 'bk1');
vrt_sms_traiter(mtn(2500, '690000030', $av + 2500, '8000000013'), 'MobileMoney');
$db = json_decode((string) file_get_contents(VRT_DB_FICHIER), true);
ok('le manuel numérique est débloqué sur le compte, sans humain',
   !empty(cmd('VT-G1')['granted']) && in_array('bk1', $db['visitorAccounts'][0]['unlockedBooks'] ?? [], true),
   json_encode($db['visitorAccounts'][0] ?? []));

// ─────────────────────────────────────────────────────────────────────────────
titre('⑬ Éteint tant que la clé n’est pas posée');
ok('clé de 32 caractères → actif', vrt_sms_actif());

echo "\n\033[1m$vert contrôle(s) au vert, $rouge au rouge.\033[0m\n";
exit($rouge === 0 ? 0 : 1);
