<?php
/* Banc du 21/10/2026 : l'invité de l'Atelier n'est plus bridé à 2 appels IA
 * par jour, mais il ne reçoit pas plus que ce que son essai lui accorde.
 *
 * Un vrai serveur (php -S) sert une copie de l'API. Le registre des invités
 * est fabriqué : l'appareil « A » a reçu 4 appels IA ce mois-ci de
 * plateforme.php. On mesure ce que répond ia_proxy.php :
 *   - l'invité A passe 4 fois sans buter sur le plafond JOURNALIER ;
 *   - au 5e appel, au-delà de ce qui lui a été accordé, il retombe au
 *     palier anonyme — et bute ;
 *   - un jeton d'invité FORGÉ (mauvaise signature) n'ouvre rien.
 * Aucune clé IA n'est configurée : un moteur SIMULÉ (IA_BANC_REPONSE) répond.
 * Il le faut depuis le 26/10/2026 : un appel en échec rend désormais son
 * crédit, si bien qu'avec des 502 le banc ne comptait plus rien et exigeait,
 * sans le dire, que l'échec soit facturé. On regarde le refus 429.
 *
 *   php tests/banc_ia_invite.php
 */
$RACINE = dirname(__DIR__);
$ko = 0; $vu = 0;
function verifie($ok, $nom, $detail = '') {
    global $ko, $vu; $vu++;
    if ($ok) echo "  \033[32m✓\033[0m $nom\n";
    else { $ko++; echo "  \033[31m✗ $nom\033[0m" . ($detail !== '' ? "\n      $detail" : '') . "\n"; }
}
function b64u($s) { return rtrim(strtr(base64_encode($s), '+/', '-_'), '='); }

$tmp = sys_get_temp_dir() . DIRECTORY_SEPARATOR . 'vrt-iainv-' . bin2hex(random_bytes(4));
foreach (["$tmp/api/data/_rate"] as $d) mkdir($d, 0777, true);
foreach (glob("$RACINE/api/*.php") as $f) {
    if (strpos(basename($f), 'payment_config') === 0 || basename($f) === 'config.php') continue;
    copy($f, "$tmp/api/" . basename($f));
}
$HMAC = 'cle-hmac-du-banc-ia-invite-0123456789-assez-longue';
file_put_contents("$tmp/api/payment_config.php", '<?php
define("API_SECRET", ' . var_export($HMAC, true) . ');
define("VRT_HMAC_KEY", ' . var_export($HMAC, true) . ');
define("IA_BANC_REPONSE", "Réponse simulée du banc.");
');
$cleA = str_repeat('a', 32); $cleB = str_repeat('b', 32);
file_put_contents("$tmp/api/data/_plat_invites.json", json_encode([
    'appareils' => [
        $cleA => ['id' => 'invA', 'q' => ['ia' => ['mois' => date('Y-m'), 'utilise' => 4]]],
        $cleB => ['id' => 'invB', 'q' => ['ia' => ['mois' => date('Y-m'), 'utilise' => 4]]],
    ], 'ip' => [],
]));
function jeton($id, $cle, $hmac) {
    $body = b64u(json_encode(['id' => $id, 'd' => $cle, 'exp' => time() + 3600]));
    return 'inv.' . $body . '.' . b64u(hash_hmac('sha256', 'invite|' . $body, $hmac, true));
}
$PORT = 18000 + random_int(0, 900);
$log = "$tmp/srv.log";
$srv = proc_open([PHP_BINARY, '-S', "127.0.0.1:$PORT", '-t', $tmp],
    [0 => ['pipe', 'r'], 1 => ['file', $log, 'a'], 2 => ['file', $log, 'a']], $pipes);
for ($i = 0; $i < 50; $i++) { $s = @fsockopen('127.0.0.1', $PORT, $e, $es, 0.2); if ($s) { fclose($s); break; } usleep(100000); }

function appel($jeton, $n) {
    global $PORT;
    $corps = json_encode(['action' => 'epreuve_minesec', 'prompt' => 'Banc ' . $n . ' ' . microtime(true),
                          'sysPrompt' => '', 'token' => $jeton, 'userId' => '']);
    // En-têtes d'un vrai navigateur : le bouclier (_sentinel.php) ne doit pas
    // prendre le banc pour un robot et répondre par un défi.
    $ctx = stream_context_create(['http' => ['method' => 'POST', 'ignore_errors' => true, 'timeout' => 30,
        'protocol_version' => 1.1,
        'header' => implode("\r\n", ['Content-Type: application/json', 'Accept: application/json',
            'Accept-Language: fr-FR,fr;q=0.9', 'User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/130.0',
            'Accept-Encoding: identity', 'Sec-Fetch-Mode: cors', 'Sec-Fetch-Site: same-origin',
            'Connection: close', 'Origin: http://localhost:8000']),
        'content' => $corps]]);
    $r = @file_get_contents("http://127.0.0.1:$PORT/api/ia_proxy.php", false, $ctx);
    $code = 0;
    foreach (($http_response_header ?? []) as $l) if (preg_match('#^HTTP/\S+ (\d+)#', $l, $m)) $code = (int) $m[1];
    usleep(2200000);   // le proxy refuse plus d'une demande toutes les 2 s par identité
    return [$code, (string) $r];
}
function quotaJour($r) { return $r[0] === 429 && preg_match('/jour|essais gratuits/u', $r[1]); }

echo "\n\033[1m① L'invité A : 4 appels accordés ce mois-ci\033[0m\n";
$tA = jeton('invA', $cleA, $HMAC);
$bute = 0;
for ($n = 1; $n <= 4; $n++) { $r = appel($tA, $n); if (quotaJour($r)) $bute = $n; }
verifie($bute === 0, '4 appels sans buter sur le plafond du jour (anonyme : 2)', $bute ? "refus au $bute" . 'e appel' : '');
$r5 = appel($tA, 5);
verifie(quotaJour($r5), 'le 5e appel, au-delà de l’essai, est refusé', "HTTP {$r5[0]} " . substr($r5[1], 0, 160));

echo "\n\033[1m② Un jeton d'invité forgé n'ouvre rien\033[0m\n";
$tF = jeton('invB', $cleB, 'mauvaise-cle-de-signature-0123456789');
$buteF = 0;
for ($n = 1; $n <= 3; $n++) { $r = appel($tF, 10 + $n); if (quotaJour($r) && !$buteF) $buteF = $n; }
verifie($buteF > 0 && $buteF <= 3, 'jeton forgé : palier anonyme, refusé au plus tard au 3e appel', 'premier refus : ' . ($buteF ?: 'aucun'));
$cpt = glob("$tmp/api/data/_rate/iainvite_*");
verifie(count($cpt) === 1, 'un seul compteur d’invité tenu (celui de A)', count($cpt) . ' compteur(s)');

echo "\n\033[1m③ Abonné « pro » désynchronisé : il retrouve son palier, sans appel gratuit de plus\033[0m\n";
/* Situation de production du 21/10/2026 : la synchro admin avait ramené
   accordés à 2, le compteur du proxy était à 8, et le quota gratuit du jour
   (5) était consommé. L'abonné recevait 429 « Quota IA du jour atteint ». */
@mkdir("$tmp/data", 0777, true);
file_put_contents("$tmp/data/veritas_db.json", json_encode([
    'visitorAccounts' => [['id' => 'accP', 'user' => 'profbanc', 'plans' => ['pro'], 'tokenVer' => 0, 'statut' => 'actif']],
    'elearning' => ['abonnements' => []],
    'plateforme' => ['quotas' => ['accP|ia' => ['mois' => date('Y-m'), 'utilise' => 2]]],
]));
file_put_contents("$tmp/api/data/_rate/iaatelier_" . substr(md5('accP'), 0, 16) . '_' . date('Ym') . '.txt', '8');
file_put_contents("$tmp/api/data/_rate/iauser_" . substr(md5('profbanc'), 0, 16) . '_' . date('Ymd') . '.txt', '5');
$bodyP = b64u(json_encode(['u' => 'profbanc', 'eid' => 'accP', 't' => 'visiteur', 'exp' => time() + 3600, 'v' => 0]));
$tP = $bodyP . '.' . b64u(hash_hmac('sha256', $bodyP, $HMAC, true));
$rP1 = appel($tP, 31);
verifie(!quotaJour($rP1), 'l’appel accordé passe (palier enseignant retrouvé)', "HTTP {$rP1[0]} " . substr($rP1[1], 0, 160));
$rP2 = appel($tP, 32);
verifie(quotaJour($rP2), 'un appel de plus, sans accord de plateforme.php, reste refusé', "HTTP {$rP2[0]} " . substr($rP2[1], 0, 160));

echo "\n\033[1m④ Un appel qui échoue rend le crédit qu'il a pris, et rien de plus\033[0m\n";
/* Depuis le 26/10/2026, un échec de tous les moteurs rend le crédit. Rien ne
   le vérifiait : ni l'essai d'invité (jamais rendu), ni le crédit Atelier d'un
   palier enseignant (rendu sans avoir été pris). Le moteur simulé est retiré :
   sans clé IA, l'appel échoue vraiment. */
file_put_contents("$tmp/api/payment_config.php", '<?php
define("API_SECRET", ' . var_export($HMAC, true) . ');
define("VRT_HMAC_KEY", ' . var_export($HMAC, true) . ');
');
$cleC = str_repeat('c', 32);
$reg = json_decode(file_get_contents("$tmp/api/data/_plat_invites.json"), true);
$reg['appareils'][$cleC] = ['id' => 'invC', 'q' => ['ia' => ['mois' => date('Y-m'), 'utilise' => 4]]];
file_put_contents("$tmp/api/data/_plat_invites.json", json_encode($reg));
function compteur($motif) {
    global $tmp; $t = 0;
    foreach (glob("$tmp/api/data/_rate/$motif") as $f) $t += (int) file_get_contents($f);
    return $t;
}
// L'invité est compté sous « inv:<empreinte de sa clé> », pas sous son id.
$jourC = 'iauser_' . substr(md5('inv:' . substr(md5($cleC), 0, 16)), 0, 16) . '_*';
$avant = [compteur('iainvite_*'), compteur($jourC)];
$rC = appel(jeton('invC', $cleC, $HMAC), 41);
verifie($rC[0] === 502, 'sans moteur, l’appel échoue (502)', "HTTP {$rC[0]} " . substr($rC[1], 0, 160));
verifie(count(glob("$tmp/api/data/_rate/$jourC")) === 1, 'le compteur du jour de l’invité existe (le motif vise le bon fichier)');
$apres = [compteur('iainvite_*'), compteur($jourC)];
verifie($apres[0] === $avant[0], 'l’essai d’invité est rendu', "avant {$avant[0]}, après {$apres[0]}");
verifie($apres[1] === $avant[1], 'le quota du jour est rendu', "avant {$avant[1]}, après {$apres[1]}");
$fAt = "$tmp/api/data/_rate/iaatelier_" . substr(md5('accP'), 0, 16) . '_' . date('Ym') . '.txt';
$atAvant = (int) file_get_contents($fAt);
file_put_contents("$tmp/data/veritas_db.json", json_encode([
    'visitorAccounts' => [['id' => 'accP', 'user' => 'profbanc', 'plans' => ['pro'], 'tokenVer' => 0, 'statut' => 'actif']],
    'elearning' => ['abonnements' => []],
    'plateforme' => ['quotas' => ['accP|ia' => ['mois' => date('Y-m'), 'utilise' => 50]]],
]));
$rP3 = appel($tP, 42);
verifie($rP3[0] === 502, 'abonné : sans moteur, l’appel échoue (502)', "HTTP {$rP3[0]} " . substr($rP3[1], 0, 160));
$atApres = (int) file_get_contents($fAt);
verifie($atApres === $atAvant, 'le crédit Atelier pris est rendu', "avant $atAvant, après $atApres");
// Un compte ENSEIGNANT n'entame pas le crédit Atelier (palier « teach ») : un
// échec ne doit donc rien lui rendre. Le code du 26/10 le rendait quand même.
file_put_contents("$tmp/data/veritas_db.json", json_encode([
    'visitorAccounts' => [['id' => 'accP', 'user' => 'profbanc', 'plans' => ['pro'], 'tokenVer' => 0, 'statut' => 'actif']],
    'teachers' => [['id' => 'tProf', 'user' => 'profbanc']],
    'elearning' => ['abonnements' => []],
    'plateforme' => ['quotas' => ['accP|ia' => ['mois' => date('Y-m'), 'utilise' => 50]]],
]));
$atAvant = (int) file_get_contents($fAt);
verifie($atAvant > 0, 'le crédit Atelier de départ n’est pas nul (sinon rien ne peut descendre)', "compteur $atAvant");
// Quatorze appels depuis la même adresse : le bouclier (_sentinel.php) finit
// par demander un défi. On repart d'une fenêtre neuve, comme un autre poste.
array_map('unlink', glob("$tmp/api/data/_sentinel/*.txt") ?: []);
$rT = appel($tP, 43);
verifie($rT[0] === 502, 'enseignant : sans moteur, l’appel échoue (502)', "HTTP {$rT[0]} " . substr($rT[1], 0, 160));
$atApres = (int) file_get_contents($fAt);
verifie($atApres === $atAvant, 'enseignant : rien n’est rendu, puisque rien n’a été pris', "avant $atAvant, après $atApres");

proc_terminate($srv);
echo "\n" . ($ko ? "\033[31m$ko échec(s) sur $vu\033[0m" : "\033[32m$vu vérification(s) au vert\033[0m") . "\n";
exit($ko ? 1 : 0);
