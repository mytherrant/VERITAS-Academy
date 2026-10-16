<?php
/* ════════════════════════════════════════════════════════════════════════════
   tests/banc_skysms_droits.php — UN PAIEMENT SKYSMS OUVRE-T-IL LE BON DROIT ?
   © 2024-2026 Jacques Miterand TAKOU (Mythe Errant).

       php tests/banc_skysms_droits.php

   tests/banc_skysms.php éprouve la CAISSE (rappel forgé, jeton, verrou…).
   Celui-ci éprouve la LIVRAISON, par le vrai chemin HTTP :
       init → page → collecte → rappel « payé » de SkySMS → octroi → SMS
   pour chacune des surfaces vendues par SkySMS :
     ① abonnement e-learning        → plan sur le compte, échéance juste
     ② abonnement de l'Atelier      → plan Atelier, durée MENSUELLE (pas 1 an)
     ③ cahier en ligne              → code émis, envoyé par SMS au payeur
     ④ livre numérique SANS compte  → compte créé, identifiant + code par SMS
   Deux vrais serveurs (php -S) : notre API, copiée avec sa propre
   payment_config.php, et une fausse SkySMS qui enregistre les collectes ET les
   SMS. Aucun appel ne quitte la machine, aucun franc ne bouge.
   ════════════════════════════════════════════════════════════════════════ */

$RACINE = dirname(__DIR__);
$P_API  = (int) (getenv('PORT_BANC_SKYD') ?: 3301);
$P_SKY  = $P_API + 1;
$ok = 0; $ko = 0;
function verifier($nom, $cond, $detail = '') {
    global $ok, $ko;
    if ($cond) { $ok++; echo "  \033[32m✓\033[0m $nom\n"; }
    else { $ko++; echo "  \033[31m✗ $nom\033[0m" . ($detail !== '' ? "\n      $detail" : '') . "\n"; }
}

$tmp = sys_get_temp_dir() . DIRECTORY_SEPARATOR . 'vrt-skyd-' . bin2hex(random_bytes(4));
foreach (["$tmp/api", "$tmp/mock", "$tmp/lv", "$tmp/nf"] as $d) mkdir($d, 0777, true);
foreach (glob("$RACINE/api/*.php") as $f) {
    if (strpos(basename($f), 'payment_config') === 0) continue;
    copy($f, "$tmp/api/" . basename($f));
}
$CLE = 'cle-de-rappel-du-banc-droits-0123456789';
$PUB = 'pub_fedcba9876543210fedcba9876543210';
$ADM = 'secret-admin-du-banc-droits-0123';
$db  = "$tmp/db.json";
file_put_contents($db, json_encode([
    'school'    => ['nom' => 'Banc'],
    'books'     => [['id' => 'bk1', 'titre' => 'Manuel 3e', 'secureId' => 'bk1', 'securePages' => 280,
                     'prix' => 5000, 'prixDigital' => 2500, 'stock' => 10, 'vendu' => 0]],
    'elearning' => ['plans' => [['id' => 'pl1', 'nom' => 'Premium annuel', 'prix' => 25000, 'duree' => 'annuel']],
                    'abonnements' => [], 'contenus' => []],
    'visitorAccounts' => [['id' => 'acc_test', 'user' => 'testeur', 'nom' => 'Testeur', 'plans' => []]],
    'tarifs'    => ['livret' => 1500, 'livretGuide' => 5000, 'livretJours' => 0],
    'promoCodes' => [], 'visitorOrders' => [], 'payments' => [], 'commissions' => [], 'partners' => [],
], JSON_UNESCAPED_UNICODE));
file_put_contents("$tmp/api/payment_config.php", '<?php
define("PAY_API_SECRET", ' . var_export($ADM, true) . ');
define("SKYSMS_UID", "uid-du-banc");
define("SKYSMS_PUBLIC_INIT", ' . var_export($PUB, true) . ');
define("SKYSMS_CALLBACK_CLE", ' . var_export($CLE, true) . ');
define("SKYSMS_USER", "banc"); define("SKYSMS_PASSWORD", "banc"); define("SKYSMS_SENDER", "VERITAS");
define("SKYSMS_API_BASE", "http://127.0.0.1:' . $P_SKY . '");
define("SKYSMS_TIMEOUT", 10);
define("CAMERPAY_INIT_RATE_PER_HOUR", 0);
define("CAMERPAY_INIT_MAX_PER_DAY", 0);
define("VRT_DB_FICHIER", ' . var_export($db, true) . ');
define("VRT_LIVRET_DIR", ' . var_export("$tmp/lv", true) . ');
define("VRT_NOTIFY_DIR", ' . var_export("$tmp/nf", true) . ');
define("VRT_HMAC_KEY", "cle-hmac-du-banc-0123456789-suffisamment-longue");
define("PUBLIC_BASE_URL", "http://127.0.0.1:' . $P_API . '");
function requirePayAuth() {
    $t = trim(str_replace(["Bearer ", "bearer "], "", $_SERVER["HTTP_AUTHORIZATION"] ?? ""));
    if ($t === "" || !hash_equals(PAY_API_SECRET, $t)) { http_response_code(401); echo "{}"; exit; }
}
');
// Fausse SkySMS : collecte → accusé « demande enregistrée » ; SMS → « envoyé ».
file_put_contents("$tmp/mock/router.php", '<?php
$j = json_decode((string) @file_get_contents(__DIR__ . "/recu.json"), true) ?: [];
$j[] = ["uri" => $_SERVER["REQUEST_URI"], "get" => $_GET];
file_put_contents(__DIR__ . "/recu.json", json_encode($j), LOCK_EX);
header("Content-Type: application/json");
if (strpos($_SERVER["REQUEST_URI"], "/sendsms/") === 0) {
    echo json_encode(["statut" => "1", "ssid_sms" => "SS-" . bin2hex(random_bytes(4)), "description" => "SMS envoye"]); exit;
}
echo json_encode(["statut" => "1", "id_operation" => "OP-" . bin2hex(random_bytes(6)),
  "amount" => (int) ($_GET["amount"] ?? 0), "telephone" => (string) ($_GET["phone"] ?? ""),
  "description" => "Demande de collecte enregistrée avec succes."]);
');

function serveur($port, $docroot, $router = null) {
    $cmd = [PHP_BINARY, '-S', "127.0.0.1:$port", '-t', $docroot];
    if ($router) $cmd[] = $router;
    $log = dirname($docroot) . '/srv' . $port . '.log';
    $p = proc_open($cmd, [0 => ['pipe', 'r'], 1 => ['file', $log, 'a'], 2 => ['file', $log, 'a']], $pipes);
    for ($i = 0; $i < 50; $i++) { $s = @fsockopen('127.0.0.1', $port, $e, $es, 0.2); if ($s) { fclose($s); break; } usleep(100000); }
    return $p;
}
$srvApi = serveur($P_API, $tmp);
$srvSky = serveur($P_SKY, "$tmp/mock", "$tmp/mock/router.php");

function req($method, $chemin, $body = null, $hdr = []) {
    global $P_API;
    $ctx = stream_context_create(['http' => ['method' => $method,
        'header' => implode("\r\n", array_merge(['Content-Type: application/json'], $hdr)),
        'content' => $body === null ? '' : json_encode($body), 'ignore_errors' => true, 'timeout' => 60]]);
    $r = @file_get_contents("http://127.0.0.1:$P_API$chemin", false, $ctx);
    $code = 0;
    foreach (($http_response_header ?? []) as $l) if (preg_match('#^HTTP/\S+ (\d+)#', $l, $m)) $code = (int) $m[1];
    return [$code, (string) $r, json_decode((string) $r, true)];
}
$API = '/api/payment_camerpay.php';
$etatDir = "$tmp/api/data/payments/";
function fEtat($ref) { global $etatDir; return $etatDir . 'camerpay_' . preg_replace('/[^a-zA-Z0-9_\-]/', '_', $ref) . '.json'; }
function etat($ref) { return json_decode((string) @file_get_contents(fEtat($ref)), true) ?: []; }
function base() { global $db; return json_decode((string) file_get_contents($db), true) ?: []; }
function compte($id) { foreach ((base()['visitorAccounts'] ?? []) as $a) if (($a['id'] ?? '') === $id) return $a; return []; }
function recuSky() { global $tmp; return json_decode((string) @file_get_contents("$tmp/mock/recu.json"), true) ?: []; }
function smsPour($tel) {
    $out = [];
    foreach (recuSky() as $r) if (strpos($r['uri'], '/sendsms/') === 0 && ($r['get']['phone'] ?? '') === $tel) $out[] = (string) ($r['get']['message'] ?? '');
    return $out;
}

/* Le parcours complet d'un acheteur, tel que SkySMS le vit.
   $forcer : surfaces dont l'`init` exige des fichiers déposés par FTP
   (cahier, pages d'un livre) absents d'un banc — l'état est alors créé par un
   init « generic » puis recopié avec la vraie intention : tout ce qui suit
   (collecte, rappel, octroi, SMS) est le chemin de production, sans raccourci. */
function acheter($ref, $intent, $cible, $montant, $tel, $accountId, $forcer = false) {
    global $API, $PUB;
    $corps = ['ref' => $ref, 'montant' => $montant, 'intent' => $forcer ? 'generic' : $intent,
              'targetId' => $cible, 'clientTel' => $tel, 'clientNom' => 'Acheteur Banc',
              'accountId' => $accountId, 'label' => 'Banc ' . $intent];
    [$c, $r, $j] = req('POST', "$API?action=init", $corps, ["Authorization: Bearer $PUB"]);
    if ($c !== 200) return "init $c $r";
    if ($forcer) {
        $st = etat($ref); $st['intent'] = $intent; $st['targetId'] = $cible;
        file_put_contents(fEtat($ref), json_encode($st));
    }
    $q = []; parse_str((string) parse_url((string) ($j['pay_url'] ?? ''), PHP_URL_QUERY), $q);
    [$c, $r] = req('POST', "$API?action=skysms_collect", ['ref' => $ref, 'tel' => '', 't' => (string) ($q['t'] ?? '')]);
    if ($c !== 200) return "collecte $c $r";
    $st = etat($ref);
    $idc = (string) (array_slice((array) ($st['id_clients'] ?? []), -1)[0] ?? '');
    $op  = (string) ($st['ops'][$idc] ?? '');
    // Le rappel officiel SKYSOFT : id_operation, id_operateur, id_client, statut.
    global $CLE;
    [$c, $r] = req('GET', "$API?action=skysms_notify&cle=" . rawurlencode($CLE) . '&'
        . http_build_query(['id_operation' => $op, 'id_operateur' => 'MP' . rand(1000, 9999), 'id_client' => $idc, 'statut' => '1']));
    if ($c !== 200 || trim($r) !== '1') return "rappel $c « $r »";
    return '';
}

try {
    echo "\n\033[1m① Abonnement e-learning (25 000 F, annuel)\033[0m\n";
    $e = acheter('BD-ABO1', 'subscription', 'pl1', 25000, '690000011', 'acc_test');
    verifier('parcours init → collecte → rappel', $e === '', $e);
    $st = etat('BD-ABO1');
    verifier('paiement payé ET octroyé', ($st['status'] ?? '') === 'paid' && !empty($st['granted']), json_encode(['s' => $st['status'] ?? '', 'g' => $st['grant_msg'] ?? '']));
    verifier('plan pl1 inscrit sur le compte', in_array('pl1', (array) (compte('acc_test')['plans'] ?? []), true));
    $abo = null; foreach ((base()['elearning']['abonnements'] ?? []) as $a) if (($a['ref'] ?? '') === 'BD-ABO1') $abo = $a;
    $jours = $abo ? (((int) $abo['dateFinTs'] / 1000) - time()) / 86400 : 0;
    verifier('abonnement « Activé », échéance ≈ 1 an', $abo && ($abo['statut'] ?? '') === 'Activé' && $jours > 360 && $jours < 370, sprintf('%.1f jours', $jours));
    $sms = smsPour('690000011');
    $fin = $abo ? date('d/m/Y', (int) ($abo['dateFinTs'] / 1000)) : '§';
    verifier('SMS de confirmation au numéro qui a payé', count($sms) === 1, count($sms) . ' SMS');
    $m = (string) ($sms[0] ?? '');
    verifier('…avec la formule et la date de fin', strpos($m, 'Premium annuel') !== false && strpos($m, $fin) !== false, mb_substr($m, 0, 200));
    verifier('…et le lien vers les abonnements', strpos($m, '/app.html#abonnements') !== false, mb_substr($m, 0, 200));

    echo "\n\033[1m② Abonnement de l'Atelier (800 F, MENSUEL)\033[0m\n";
    $e = acheter('BD-ATL1', 'subscription', 'ens_mois', 800, '690000012', 'acc_test');
    verifier('parcours init → collecte → rappel', $e === '', $e);
    $st = etat('BD-ATL1');
    verifier('paiement payé ET octroyé', ($st['status'] ?? '') === 'paid' && !empty($st['granted']), (string) ($st['grant_msg'] ?? ''));
    verifier('plan Atelier ens_mois inscrit sur le compte', in_array('ens_mois', (array) (compte('acc_test')['plans'] ?? []), true));
    $abo = null; foreach ((base()['elearning']['abonnements'] ?? []) as $a) if (($a['ref'] ?? '') === 'BD-ATL1') $abo = $a;
    $jours = $abo ? (((int) $abo['dateFinTs'] / 1000) - time()) / 86400 : 0;
    verifier('durée d\'UN MOIS, pas d\'un an', $jours > 27 && $jours < 32, sprintf('%.1f jours', $jours));
    $sms = smsPour('690000012');
    $fin = $abo ? date('d/m/Y', (int) ($abo['dateFinTs'] / 1000)) : '§';
    $m = (string) ($sms[0] ?? '');
    verifier('SMS Atelier : un seul, avec la date de fin', count($sms) === 1 && strpos($m, $fin) !== false, count($sms) . ' SMS · ' . mb_substr($m, 0, 200));
    verifier('…et le lien vers l\'Atelier', strpos($m, '/plateforme/') !== false, mb_substr($m, 0, 200));
    [$c] = req('POST', "$API?action=init", ['ref' => 'BD-ATL2', 'montant' => 100, 'intent' => 'subscription', 'targetId' => 'ens_mois',
        'clientTel' => '690000012', 'accountId' => 'acc_test'], ["Authorization: Bearer $PUB"]);
    verifier('Atelier à 100 F au lieu de 800 : refusé avant débit', $c === 409, "http $c");

    echo "\n\033[1m③ Cahier en ligne (1 500 F) — code par SMS\033[0m\n";
    $e = acheter('BD-LIV1', 'livret', '6e:livret', 1500, '690000013', '', true);
    verifier('parcours init → collecte → rappel', $e === '', $e);
    $st = etat('BD-LIV1');
    verifier('paiement payé ET octroyé', ($st['status'] ?? '') === 'paid' && !empty($st['granted']), (string) ($st['grant_msg'] ?? ''));
    $vente = null; foreach ((base()['livretVentes'] ?? []) as $v) if (($v['ref'] ?? '') === 'BD-LIV1') $vente = $v;
    $code = (string) ($vente['code'] ?? '');
    verifier('code d\'accès émis au registre', $code !== '', json_encode($vente));
    $sms = smsPour('690000013');
    verifier('SMS envoyé au numéro qui a payé', count($sms) >= 1, 'aucun SMS vers 690000013 ; reçus : ' . count(recuSky()));
    $court = $code !== '' ? substr(preg_replace('/[^A-Z0-9]/', '', strtoupper($code)), -8) : '§';
    $dansSms = false; foreach ($sms as $m) { $mm = preg_replace('/[^A-Z0-9]/', '', strtoupper($m)); if ($code !== '' && (strpos($m, $code) !== false || strpos($mm, $court) !== false)) $dansSms = true; }
    verifier('le SMS contient le code', $dansSms, mb_substr(implode(' | ', $sms), 0, 220));

    echo "\n\033[1m④ Livre numérique SANS compte (2 500 F) — accès par SMS\033[0m\n";
    $e = acheter('BD-EBK1', 'digitalbook', 'bk1', 2500, '690000014', '', true);
    verifier('parcours init → collecte → rappel', $e === '', $e);
    $st = etat('BD-EBK1');
    verifier('paiement payé ET octroyé', ($st['status'] ?? '') === 'paid' && !empty($st['granted']), (string) ($st['grant_msg'] ?? ''));
    $cree = null; foreach ((base()['visitorAccounts'] ?? []) as $a) if (in_array('bk1', (array) ($a['unlockedBooks'] ?? []), true)) $cree = $a;
    verifier('compte créé pour le numéro, livre débloqué dessus', $cree !== null && ($cree['id'] ?? '') !== 'acc_test', json_encode(array_column(base()['visitorAccounts'] ?? [], 'id')));
    verifier('mot de passe stocké en bcrypt, jamais en clair', $cree && strpos((string) ($cree['pwd'] ?? ''), '$2') === 0);
    $sms = smsPour('690000014');
    verifier('SMS envoyé au numéro qui a payé', count($sms) >= 1, 'aucun SMS vers 690000014');
    $login = (string) ($cree['user'] ?? '');
    $avecId = false; foreach ($sms as $m) if ($login !== '' && strpos($m, $login) !== false) $avecId = true;
    verifier('le SMS donne l\'identifiant de connexion', $avecId, mb_substr(implode(' | ', $sms), 0, 220));

    echo "\n\033[1m⑤ Rejeu du rappel : ni second droit, ni second SMS\033[0m\n";
    $avant = count(recuSky());
    $st = etat('BD-LIV1'); $idc = (string) (array_slice((array) $st['id_clients'], -1)[0]);
    req('GET', "$API?action=skysms_notify&cle=" . rawurlencode($CLE) . '&' . http_build_query(['id_operation' => $st['ops'][$idc], 'id_client' => $idc, 'statut' => '1']));
    $n = 0; foreach ((base()['livretVentes'] ?? []) as $v) if (($v['ref'] ?? '') === 'BD-LIV1') $n++;
    verifier('un seul code pour ce paiement', $n === 1, "$n ventes");
    $nouveaux = array_slice(recuSky(), $avant);
    $sms2 = array_filter($nouveaux, function ($r) { return strpos($r['uri'], '/sendsms/') === 0; });
    verifier('aucun SMS de plus', count($sms2) === 0, count($sms2) . ' SMS');
    $avant = count(recuSky());
    $st = etat('BD-ABO1'); $idc = (string) (array_slice((array) $st['id_clients'], -1)[0]);
    req('GET', "$API?action=skysms_notify&cle=" . rawurlencode($CLE) . '&' . http_build_query(['id_operation' => $st['ops'][$idc], 'id_client' => $idc, 'statut' => '1']));
    $sms3 = array_filter(array_slice(recuSky(), $avant), function ($r) { return strpos($r['uri'], '/sendsms/') === 0; });
    verifier('abonnement rejoué : pas de second SMS de confirmation', count($sms3) === 0, count($sms3) . ' SMS');
} finally {
    foreach ([$srvApi, $srvSky] as $p) { if (is_resource($p)) { proc_terminate($p); proc_close($p); } }
}

echo "\n" . ($ko === 0 ? "\033[32m\033[1m  ✓ $ok/$ok — chaque paiement SkySMS livre ce qu'il vend.\033[0m" : "\033[31m\033[1m  ✗ $ko au rouge, $ok au vert.\033[0m") . "\n";
exit($ko === 0 ? 0 : 1);
