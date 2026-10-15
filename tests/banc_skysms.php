<?php
/* ════════════════════════════════════════════════════════════════════════════
   tests/banc_skysms.php — LE FLUX SKYSMS DE BOUT EN BOUT, SANS UN FRANC RÉEL
   © 2024-2026 Jacques Miterand TAKOU (Mythe Errant).

       php tests/banc_skysms.php

   Deux vrais serveurs : notre API (php -S, copie de api/ dans un dossier
   temporaire, avec SA PROPRE payment_config.php) et une FAUSSE SkySMS qui
   enregistre ce qu'elle reçoit. Aucun appel ne quitte la machine.

   Ce qu'il garde (audit du 15/10/2026, AUDIT/00-RAPPORT.md) :
     ① n°2  id_client imprévisible (plus « date + 3 chiffres »)
     ② n°1  un rappel dont l'id_operation contredit la collecte n'ouvre rien
     ③ n°3  une référence déjà prise pour un AUTRE achat est refusée
     ④ n°4  la page de paiement exige le jeton de la pay_url, numéro masqué
     ⑤ n°5  rappel et collecte prennent le verrou de l'état
     ⑥ n°7  attente bornée côté page ; vieille attente signalée, jamais close
     ⑦ n°8  aucun numéro client en clair dans le journal
   ════════════════════════════════════════════════════════════════════════ */

$RACINE = dirname(__DIR__);
$P_API  = (int) (getenv('PORT_BANC_SKY') ?: 3291);
$P_SKY  = $P_API + 1;
$ok = 0; $ko = 0;
function verifier($nom, $cond, $detail = '') {
    global $ok, $ko;
    if ($cond) { $ok++; echo "  \033[32m✓\033[0m $nom\n"; }
    else { $ko++; echo "  \033[31m✗ $nom\033[0m" . ($detail !== '' ? "\n      $detail" : '') . "\n"; }
}

/* ── Préparation ─────────────────────────────────────────────────────────── */
$tmp = sys_get_temp_dir() . DIRECTORY_SEPARATOR . 'vrt-sky-' . bin2hex(random_bytes(4));
mkdir("$tmp/api", 0777, true);
mkdir("$tmp/mock", 0777, true);
foreach (glob("$RACINE/api/*.php") as $f) {
    if (strpos(basename($f), 'payment_config') === 0) continue;
    copy($f, "$tmp/api/" . basename($f));
}
$CLE = 'cle-de-rappel-du-banc-0123456789abcdef';
$PUB = 'pub_0123456789abcdef0123456789abcdef';
$ADM = 'secret-admin-du-banc-0123456789';
$db  = "$tmp/db.json";
file_put_contents($db, json_encode(['school' => ['nom' => 'Banc'], 'elearning' => ['plans' => []], 'visitorAccounts' => []]));
file_put_contents("$tmp/api/payment_config.php", '<?php
define("PAY_API_SECRET", ' . var_export($ADM, true) . ');
define("SKYSMS_UID", "uid-du-banc");
define("SKYSMS_PUBLIC_INIT", ' . var_export($PUB, true) . ');
define("SKYSMS_CALLBACK_CLE", ' . var_export($CLE, true) . ');
define("SKYSMS_API_BASE", "http://127.0.0.1:' . $P_SKY . '");
define("SKYSMS_TIMEOUT", 10);
define("CAMERPAY_INIT_RATE_PER_HOUR", 0);
define("CAMERPAY_INIT_MAX_PER_DAY", 0);
define("VRT_DB_FICHIER", ' . var_export($db, true) . ');
define("PUBLIC_BASE_URL", "http://127.0.0.1:' . $P_API . '");
function requirePayAuth() {
    $a = $_SERVER["HTTP_AUTHORIZATION"] ?? "";
    $t = trim(str_replace(["Bearer ", "bearer "], "", $a));
    if ($t === "" || !hash_equals(PAY_API_SECRET, $t)) { http_response_code(401); echo "{}"; exit; }
}
');
/* La fausse SkySMS : enregistre la demande, rend un accusé « demande
   enregistrée » (statut 1, comme la vraie, AVANT le Pin) et un id_operation
   que seul notre serveur apprend. */
file_put_contents("$tmp/mock/router.php", '<?php
$j = json_decode((string) @file_get_contents(__DIR__ . "/recu.json"), true) ?: [];
$j[] = ["uri" => $_SERVER["REQUEST_URI"], "get" => $_GET];
file_put_contents(__DIR__ . "/recu.json", json_encode($j), LOCK_EX);
header("Content-Type: application/json");
echo json_encode(["statut" => "1", "id_operation" => "OP-" . bin2hex(random_bytes(6)),
  "amount" => (int) ($_GET["amount"] ?? 0), "telephone" => (string) ($_GET["phone"] ?? ""),
  "description" => "Demande de collecte enregistrée avec succes."]);
');

function serveur($port, $docroot, $router = null) {
    $cmd = [PHP_BINARY, '-S', "127.0.0.1:$port", '-t', $docroot];
    if ($router) $cmd[] = $router;
    $p = proc_open($cmd, [0 => ['pipe', 'r'], 1 => ['file', $docroot . '/../srv' . $port . '.log', 'a'], 2 => ['file', $docroot . '/../srv' . $port . '.log', 'a']], $pipes);
    for ($i = 0; $i < 50; $i++) { $s = @fsockopen('127.0.0.1', $port, $e, $es, 0.2); if ($s) { fclose($s); break; } usleep(100000); }
    return $p;
}
$srvApi = serveur($P_API, $tmp);
$srvSky = serveur($P_SKY, "$tmp/mock", "$tmp/mock/router.php");

function req($method, $chemin, $body = null, $hdr = []) {
    global $P_API;
    $h = array_merge(['Content-Type: application/json'], $hdr);
    $ctx = stream_context_create(['http' => ['method' => $method, 'header' => implode("\r\n", $h),
        'content' => $body === null ? '' : (is_string($body) ? $body : json_encode($body)),
        'ignore_errors' => true, 'timeout' => 30]]);
    $r = @file_get_contents("http://127.0.0.1:$P_API$chemin", false, $ctx);
    $code = 0;
    foreach (($http_response_header ?? []) as $l) if (preg_match('#^HTTP/\S+ (\d+)#', $l, $m)) $code = (int) $m[1];
    return [$code, (string) $r, json_decode((string) $r, true)];
}
$API = '/api/payment_camerpay.php';
$etatDir = "$tmp/api/data/payments/";
function etat($ref) { global $etatDir; return json_decode((string) @file_get_contents($etatDir . 'camerpay_' . preg_replace('/[^a-zA-Z0-9_\-]/', '_', $ref) . '.json'), true) ?: []; }
function ecrireEtat($ref, $st) { global $etatDir; file_put_contents($etatDir . 'camerpay_' . preg_replace('/[^a-zA-Z0-9_\-]/', '_', $ref) . '.json', json_encode($st)); }
function recuSky() { global $tmp; return json_decode((string) @file_get_contents("$tmp/mock/recu.json"), true) ?: []; }
function init($ref, $montant, $cible = 'objet-A', $tel = '690000001') {
    global $API, $PUB;
    return req('POST', "$API?action=init", ['ref' => $ref, 'montant' => $montant, 'intent' => 'generic',
        'targetId' => $cible, 'clientTel' => $tel, 'label' => 'Banc'], ["Authorization: Bearer $PUB"]);
}
function jeton($payUrl) { $q = []; parse_str((string) parse_url((string) $payUrl, PHP_URL_QUERY), $q); return (string) ($q['t'] ?? ''); }
function collecter($ref, $t, $tel = '690000001') {
    global $API;
    return req('POST', "$API?action=skysms_collect", ['ref' => $ref, 'tel' => $tel, 't' => $t]);
}
function rappel(array $p) { global $API, $CLE; return req('GET', "$API?action=skysms_notify&cle=" . rawurlencode($CLE) . '&' . http_build_query($p)); }

try {
    echo "\n\033[1m① id_client imprévisible\033[0m\n";
    [$c, , $j] = init('BANC-A1', 1000);
    verifier('init SkySMS répond 200', $c === 200, "http $c " . json_encode($j));
    $tA = jeton($j['pay_url'] ?? '');
    [$c, $r] = collecter('BANC-A1', $tA);
    verifier('la collecte part vers SkySMS', $c === 200, "http $c $r");
    $recu = recuSky();
    $idc  = (string) ($recu[count($recu) - 1]['get']['id_client'] ?? '');
    verifier('id_client numérique', preg_match('/^\d+$/', $idc) === 1, $idc);
    verifier('id_client ne commence pas par la date', $idc !== '' && strpos($idc, date('ymd')) !== 0, $idc);

    echo "\n\033[1m② rappel : l'id_operation doit être celui de la collecte\033[0m\n";
    $st = etat('BANC-A1');
    $op = (string) ($st['id_operation'] ?? '');
    verifier('id_operation de la collecte mémorisé', $op !== '');
    [$c] = rappel(['id_client' => $idc, 'id_operation' => 'OP-FORGE', 'id_operateur' => 'X', 'statut' => '1']);
    $st = etat('BANC-A1');
    verifier('rappel « payé » avec un id_operation forgé : refusé', $c >= 400 && ($st['status'] ?? '') !== 'paid', "http $c statut " . ($st['status'] ?? ''));
    [$c] = rappel(['id_client' => $idc, 'id_operation' => $op, 'id_operateur' => 'MP123', 'statut' => '1']);
    $st = etat('BANC-A1');
    verifier('rappel authentique : payé', $c === 200 && ($st['status'] ?? '') === 'paid', "http $c statut " . ($st['status'] ?? ''));
    [$c] = rappel(['id_client' => $idc, 'id_operation' => $op, 'statut' => '1']);
    verifier('rappel rejoué : accepté sans changement', $c === 200 && (etat('BANC-A1')['paid_at'] ?? '') === ($st['paid_at'] ?? 'x'));
    [$c] = rappel(['statut' => '1', 'id_client' => '1234567890']);
    verifier('rappel pour un id_client inconnu : 404', $c === 404, "http $c");
    [$c] = req('GET', "$API?action=skysms_notify&cle=mauvaise&statut=1&id_client=$idc");
    verifier('clé fausse : 401', $c === 401, "http $c");

    echo "\n\033[1m③ une référence ne sert qu'à UN achat\033[0m\n";
    [$c, , $j1] = init('BANC-R1', 1000, 'objet-A');
    verifier('premier init : 200', $c === 200);
    [$c, , $j2] = init('BANC-R1', 1000, 'objet-A');
    verifier('même achat, même réf : renvoie l\'existant', $c === 200 && !empty($j2['already']));
    [$c, , $j3] = init('BANC-R1', 1500, 'objet-B', '670000002');
    verifier('autre achat, même réf : 409', $c === 409, "http $c " . json_encode($j3));
    verifier('…sans rendre la pay_url du premier', empty($j3['pay_url']));
    $appjs = (string) @file_get_contents("$RACINE/app.js");
    verifier('confirmerAchat ne fabrique plus BOOK-+5 chiffres', strpos($appjs, "const ref='BOOK-'+Math.floor(Math.random()*90000+10000);\n  DB.bookPurchases.push({id:gid(),eid:s.id") === false
        && strpos(str_replace("\r", '', $appjs), "const ref='BOOK-'+Math.floor(Math.random()*90000+10000);\n  DB.bookPurchases.push({id:gid(),eid:s.id") === false);

    echo "\n\033[1m④ la page de paiement exige le jeton de la pay_url\033[0m\n";
    $t1 = jeton($j1['pay_url'] ?? '');
    verifier('pay_url porte un jeton', strlen($t1) >= 16, (string) ($j1['pay_url'] ?? ''));
    [$c, $page] = req('GET', "$API?action=payer&ref=BANC-R1");
    verifier('page sans jeton : refusée', $c === 403 || $c === 404, "http $c");
    verifier('…et ne montre pas le numéro', strpos($page, '690000001') === false);
    [$c] = req('GET', "$API?action=payer&ref=BANC-R1&t=faux");
    verifier('page avec un faux jeton : refusée', $c === 403 || $c === 404, "http $c");
    [$c, $page] = req('GET', "$API?action=payer&ref=BANC-R1&t=" . rawurlencode($t1));
    verifier('page avec le jeton : 200', $c === 200, "http $c");
    verifier('…numéro masqué', strpos($page, '690000001') === false && strpos($page, '01') !== false);
    [$c] = collecter('BANC-R1', 'faux');
    verifier('collecte avec un faux jeton : refusée', $c === 403, "http $c");
    $n0 = count(recuSky());
    [$c] = req('POST', "$API?action=skysms_collect", ['ref' => 'BANC-R1', 'tel' => '', 't' => $t1, 'auto' => true]);
    verifier('collecte avec le jeton, numéro vide : utilise le numéro enregistré', $c === 200 && count(recuSky()) === $n0 + 1
        && (recuSky()[$n0]['get']['phone'] ?? '') === '690000001', "http $c");

    echo "\n\033[1m⑤ le rappel prend le verrou de l'état\033[0m\n";
    [$c, , $j] = init('BANC-L1', 1000);
    $tL = jeton($j['pay_url'] ?? '');
    collecter('BANC-L1', $tL);
    $recu = recuSky(); $idcL = (string) ($recu[count($recu) - 1]['get']['id_client'] ?? '');
    $opL = (string) (etat('BANC-L1')['id_operation'] ?? '');
    $verrou = $etatDir . 'camerpay_BANC-L1.lock';
    $fp = fopen($verrou, 'c+'); flock($fp, LOCK_EX);
    /* Un processus fils envoie le rappel et chronomètre SA requête ; nous
       tenons le verrou 1,5 s avant de le rendre. Le rappel ne peut durer plus
       de 1,3 s que s'il a attendu ce verrou. (1re version de ce contrôle :
       elle chronométrait notre propre attente et passait au vert sans le
       correctif — corrigé après mutation.) */
    $enfant = proc_open([PHP_BINARY, '-r', '$t=microtime(true);$c=stream_context_create(["http"=>["ignore_errors"=>true,"timeout"=>20]]);$r=@file_get_contents(' . var_export("http://127.0.0.1:$P_API$API?action=skysms_notify&cle=" . rawurlencode($CLE) . "&statut=1&id_client=$idcL&id_operation=$opL", true) . ',false,$c);file_put_contents(' . var_export("$tmp/rappelL.txt", true) . ',(microtime(true)-$t)."|".$r);'], [], $pe);
    usleep(1500000);
    flock($fp, LOCK_UN); fclose($fp);
    proc_close($enfant);
    $duree = (float) explode('|', (string) @file_get_contents("$tmp/rappelL.txt"))[0];
    verifier('le rappel a attendu la libération du verrou', $duree >= 1.3, sprintf('%.2f s', $duree));
    verifier('…puis payé', (etat('BANC-L1')['status'] ?? '') === 'paid', (string) @file_get_contents("$tmp/rappelL.txt"));

    echo "\n\033[1m⑥ attente bornée, jamais close à tort\033[0m\n";
    verifier('la page propose WhatsApp après 3 min sans verdict', strpos($page, '180000') !== false && stripos($page, 'WhatsApp') !== false);
    [$c, , $j] = init('BANC-V1', 1000);
    $st = etat('BANC-V1'); $st['created_at'] = date('c', time() - 2 * 86400); ecrireEtat('BANC-V1', $st);
    [$c] = req('GET', "$API?action=list", null, ["Authorization: Bearer $ADM"]);
    $st = etat('BANC-V1');
    verifier('list admin : 200', $c === 200, "http $c");
    verifier('attente SkySMS de 2 jours : signalée « à régler »', !empty($st['a_regler']));
    verifier('…mais toujours en attente (on ne sait pas si elle est payée)', ($st['status'] ?? '') === 'pending');

    echo "\n\033[1m⑦ pas de numéro client dans le journal\033[0m\n";
    rappel(['id_client' => $idc, 'id_operation' => $op, 'statut' => '1', 'telephone' => '690000001']);
    $log = (string) @file_get_contents($etatDir . '_webhook_camerpay_log.txt');
    verifier('journal non vide', strlen($log) > 50);
    verifier('aucun 690000001 / 670000002 en clair', strpos($log, '690000001') === false && strpos($log, '670000002') === false,
        implode(' | ', array_slice(preg_grep('/69000000|67000000/', explode("\n", $log)) ?: [], 0, 2)));
} finally {
    foreach ([$srvApi, $srvSky] as $p) { if (is_resource($p)) { proc_terminate($p); proc_close($p); } }
}

echo "\n" . ($ko === 0 ? "\033[32m\033[1m  ✓ $ok/$ok — le flux SkySMS tient.\033[0m" : "\033[31m\033[1m  ✗ $ko au rouge, $ok au vert.\033[0m") . "\n";
exit($ko === 0 ? 0 : 1);
