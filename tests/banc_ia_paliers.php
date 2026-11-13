<?php
/* Banc du 13/11/2026 : le quota du tuteur IA suit la FORMULE du compte, lue
 * dans la table des droits (vrt_droits_formules) — la même que les cartes de
 * prix, les leçons d'Apprendre et les fiches.
 *
 * Un vrai serveur (php -S) sert une copie de l'API ; un moteur SIMULÉ
 * (IA_BANC_REPONSE) répond. On lit le champ `quota` de la réponse :
 *   - visiteur sans jeton → 2 / jour ;
 *   - compte sans formule → 5 / jour (ligne « découverte ») ;
 *   - formule accordée par l'administration (acc.plans, sans ligne
 *     d'abonnement) → son quota, et non plus le palier gratuit ;
 *   - Starter 5, Pro 30, Élite 100, Famille 100, Prof 6 classes 80 ;
 *   - plan7 (e-learning enseignant) → Pro ;
 *   - une prestation (plan8, orientation) n'ouvre aucun palier : 5 ;
 *   - une formule expirée ne compte plus ;
 *   - une surcharge de la table en base (droitsFormules) est appliquée ;
 *   - au-delà du quota du jour : 429.
 *
 *   php tests/banc_ia_paliers.php
 */
$RACINE = dirname(__DIR__);
$ko = 0; $vu = 0;
function verifie($ok, $nom, $detail = '') {
    global $ko, $vu; $vu++;
    if ($ok) echo "  \033[32m✓\033[0m $nom\n";
    else { $ko++; echo "  \033[31m✗ $nom\033[0m" . ($detail !== '' ? "\n      $detail" : '') . "\n"; }
}
function b64u($s) { return rtrim(strtr(base64_encode($s), '+/', '-_'), '='); }

$tmp = sys_get_temp_dir() . DIRECTORY_SEPARATOR . 'vrt-iapal-' . bin2hex(random_bytes(4));
foreach (["$tmp/api/data/_rate", "$tmp/data"] as $d) mkdir($d, 0777, true);
foreach (glob("$RACINE/api/*.php") as $f) {
    if (strpos(basename($f), 'payment_config') === 0 || basename($f) === 'config.php') continue;
    copy($f, "$tmp/api/" . basename($f));
}
$HMAC = 'cle-hmac-du-banc-ia-paliers-0123456789-assez-longue';
file_put_contents("$tmp/api/payment_config.php", '<?php
define("API_SECRET", ' . var_export($HMAC, true) . ');
define("VRT_HMAC_KEY", ' . var_export($HMAC, true) . ');
define("IA_BANC_REPONSE", "Réponse simulée du banc.");
');

$ms = (int) round(microtime(true) * 1000);
$fin = $ms + 20 * 86400000; $passe = $ms - 86400000;
$comptes = [
    'gratuit'  => [],
    'admin'    => ['abo_pro_m'],          // accordé à la main, sans ligne d'abonnement
    'starter'  => ['abo_starter_m'],
    'elite'    => ['abo_elite_a'],
    'famille'  => ['abo_famille_m'],
    'prof6'    => ['abo_prof6_m'],
    'plan7'    => ['plan7'],
    'presta'   => ['plan8'],
    'expire'   => ['abo_elite_m'],
    'surcharge'=> ['abo_pro_a'],
];
$acc = []; $abos = [];
foreach ($comptes as $u => $plans) {
    $acc[] = ['id' => 'id_' . $u, 'user' => 'banc_' . $u, 'plans' => $plans, 'tokenVer' => 0, 'statut' => 'actif'];
    if ($u === 'admin' || $u === 'surcharge') continue;
    foreach ($plans as $p) $abos[] = ['accountId' => 'id_' . $u, 'plan' => $p, 'statut' => 'Activé',
        'dateFinTs' => $u === 'expire' ? $passe : $fin];
}
file_put_contents("$tmp/data/veritas_db.json", json_encode([
    'visitorAccounts' => $acc,
    'elearning' => ['abonnements' => $abos, 'droitsFormules' => ['pro' => ['iaJour' => 33]]],
]));
// La surcharge (pro → 33) vaut pour TOUT « pro » : on la retire après son test.
function jeton($u) {
    global $HMAC;
    $b = b64u(json_encode(['u' => 'banc_' . $u, 'eid' => 'id_' . $u, 't' => 'visiteur', 'exp' => time() + 3600, 'v' => 0]));
    return $b . '.' . b64u(hash_hmac('sha256', $b, $HMAC, true));
}

$PORT = 18000 + random_int(0, 900);
$log = "$tmp/srv.log";
$srv = proc_open([PHP_BINARY, '-S', "127.0.0.1:$PORT", '-t', $tmp],
    [0 => ['pipe', 'r'], 1 => ['file', $log, 'a'], 2 => ['file', $log, 'a']], $pipes);
for ($i = 0; $i < 50; $i++) { $s = @fsockopen('127.0.0.1', $PORT, $e, $es, 0.2); if ($s) { fclose($s); break; } usleep(100000); }

function appel($jeton) {
    global $PORT;
    static $n = 0; $n++;
    $corps = ['action' => 'apprendre_tuteur', 'prompt' => 'Question du banc ' . $n . ' ' . microtime(true),
              'sysPrompt' => 'Tuteur de leçon', 'ragContext' => 'LEÇON : banc', 'userId' => ''];
    if ($jeton !== '') $corps['token'] = $jeton;
    $ctx = stream_context_create(['http' => ['method' => 'POST', 'ignore_errors' => true, 'timeout' => 30,
        'protocol_version' => 1.1,
        'header' => implode("\r\n", ['Content-Type: application/json', 'Accept: application/json',
            'Accept-Language: fr-FR,fr;q=0.9', 'User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/130.0',
            'Accept-Encoding: identity', 'Sec-Fetch-Mode: cors', 'Sec-Fetch-Site: same-origin',
            'Connection: close', 'Origin: http://localhost:8000']),
        'content' => json_encode($corps)]]);
    $r = @file_get_contents("http://127.0.0.1:$PORT/api/ia_proxy.php", false, $ctx);
    $code = 0;
    foreach (($http_response_header ?? []) as $l) if (preg_match('#^HTTP/\S+ (\d+)#', $l, $m)) $code = (int) $m[1];
    usleep(5200000);   // bouclier (_sentinel.php, profil « ia » : 12 appels/min par IP) : un rythme d’élève
    return [$code, json_decode((string) $r, true) ?: [], (string) $r];
}
function palier($u, $tier, $limit, $nom) {
    $r = appel($u === '' ? '' : jeton($u));
    $q = $r[1]['quota'] ?? [];
    verifie($r[0] === 200 && ($q['limit'] ?? null) === $limit && ($q['tier'] ?? null) === $tier,
        "$nom → $tier, $limit / jour", "HTTP {$r[0]} " . substr($r[2], 0, 200));
}

echo "\n\033[1m① Paliers lus dans la table des droits\033[0m\n";
palier('',        'anon',     2,   'visiteur sans compte');
palier('gratuit', 'free',     5,   'compte sans formule (découverte)');
palier('starter', 'starter',  5,   'Starter');
palier('elite',   'elite',    100, 'Élite');
palier('famille', 'famille',  100, 'Famille');
palier('prof6',   'prof6',    80,  'Prof 6 classes');

echo "\n\033[1m② Les cas qui tombaient à côté avant le 13/11/2026\033[0m\n";
palier('admin',   'pro',  33, 'Pro accordé par l’administration (acc.plans seul), surcharge en base appliquée');
palier('presta',  'free', 5,  'une prestation (plan8, orientation) n’ouvre pas « pro »');
palier('expire',  'free', 5,  'Élite expirée : plus de palier Élite');
// Retire la surcharge : plan7 et « surcharge » relèvent de la table d'origine.
$db = json_decode(file_get_contents("$tmp/data/veritas_db.json"), true);
unset($db['elearning']['droitsFormules']);
file_put_contents("$tmp/data/veritas_db.json", json_encode($db));
palier('plan7',     'pro', 30, 'plan7 (e-learning enseignant) → Pro');
palier('surcharge', 'pro', 30, 'Pro sans surcharge → 30');

echo "\n\033[1m③ Le décompte suit le compte, et bute au quota\033[0m\n";
$r = appel(jeton('starter'));
verifie(($r[1]['quota']['used'] ?? null) === 2, 'le 2e appel du Starter est compté 2', substr($r[2], 0, 200));
file_put_contents("$tmp/api/data/_rate/iauser_" . substr(md5('banc_starter'), 0, 16) . '_' . date('Ymd') . '.txt', '5');
$r = appel(jeton('starter'));
verifie($r[0] === 429 && ($r[1]['limit'] ?? null) === 5, 'au-delà de 5, le Starter reçoit 429', "HTTP {$r[0]} " . substr($r[2], 0, 200));
$r = appel(jeton('elite'));
verifie($r[0] === 200, 'l’Élite, elle, continue', "HTTP {$r[0]} " . substr($r[2], 0, 200));

proc_terminate($srv);
echo "\n" . ($ko === 0 ? "\033[32m$vu vérification(s) au vert\033[0m\n" : "\033[31m$ko échec(s) sur $vu\033[0m\n");
exit($ko === 0 ? 0 : 1);
