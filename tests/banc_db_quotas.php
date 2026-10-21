<?php
/* Banc du 21/10/2026 : la synchro de l'administration ne remet plus à zéro
 * les compteurs de l'Atelier (plateforme.quotas).
 *
 * Constaté en production : la base ne gardait qu'UNE clé de quota, à 2
 * appels, pour un compte qui en avait consommé plus de huit dans la journée.
 * La copie de l'administrateur, poussée en entier sur db.php, ramenait les
 * compteurs à leur valeur de son dernier chargement : le quota mensuel payé
 * repartait de zéro, et ia_proxy.php ramenait un compte « pro » au palier
 * gratuit.
 *
 * Un vrai serveur (php -S) sert une copie de l'API et de sa base.
 *
 *   php tests/banc_db_quotas.php
 */
$RACINE = dirname(__DIR__);
$ko = 0; $vu = 0;
function verifie($ok, $nom, $detail = '') {
    global $ko, $vu; $vu++;
    if ($ok) echo "  \033[32m✓\033[0m $nom\n";
    else { $ko++; echo "  \033[31m✗ $nom\033[0m" . ($detail !== '' ? "\n      $detail" : '') . "\n"; }
}
$tmp = sys_get_temp_dir() . DIRECTORY_SEPARATOR . 'vrt-dbq-' . bin2hex(random_bytes(4));
mkdir("$tmp/api", 0777, true); mkdir("$tmp/data", 0777, true);
foreach (glob("$RACINE/api/*.php") as $f) {
    if (strpos(basename($f), 'payment_config') === 0 || basename($f) === 'config.php') continue;
    copy($f, "$tmp/api/" . basename($f));
}
$SECRET = 'secret-du-banc-db-quotas-0123456789-abcdef';
file_put_contents("$tmp/api/payment_config.php", '<?php define("API_SECRET", ' . var_export($SECRET, true) . ');');
$DB = "$tmp/data/veritas_db.json";
function base() { global $DB; return json_decode((string) file_get_contents($DB), true) ?: []; }
function poser($quotas) {
    global $DB;
    file_put_contents($DB, json_encode(['school' => ['nom' => 'Banc'], 'lastModified' => 1,
        'visitorAccounts' => [], 'plateforme' => ['quotas' => $quotas]]));
}
$PORT = 18000 + random_int(0, 900);
$log = "$tmp/srv.log";
$srv = proc_open([PHP_BINARY, '-S', "127.0.0.1:$PORT", '-t', $tmp],
    [0 => ['pipe', 'r'], 1 => ['file', $log, 'a'], 2 => ['file', $log, 'a']], $pipes);
for ($i = 0; $i < 50; $i++) { $s = @fsockopen('127.0.0.1', $PORT, $e, $es, 0.2); if ($s) { fclose($s); break; } usleep(100000); }

function pousser($quotas) {
    global $PORT, $SECRET;
    $corps = json_encode(['school' => ['nom' => 'Banc'], 'lastModified' => 2, 'visitorAccounts' => [],
        'plateforme' => $quotas === null ? ['offres' => []] : ['quotas' => $quotas],
        'remplissage' => str_repeat('x', 3000)]);
    $ctx = stream_context_create(['http' => ['method' => 'PUT', 'ignore_errors' => true, 'timeout' => 20,
        'protocol_version' => 1.1,
        'header' => implode("\r\n", ['Content-Type: application/json', 'Authorization: Bearer ' . $SECRET,
            'Accept: application/json', 'Accept-Language: fr-FR,fr;q=0.9', 'Accept-Encoding: identity',
            'User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/130.0',
            'Sec-Fetch-Mode: cors', 'Sec-Fetch-Site: same-origin', 'Connection: close', 'Origin: http://localhost:8000']),
        'content' => $corps]]);
    $r = @file_get_contents("http://127.0.0.1:$PORT/api/db.php", false, $ctx);
    $code = 0;
    foreach (($http_response_header ?? []) as $l) if (preg_match('#^HTTP/\S+ (\d+)#', $l, $m)) $code = (int) $m[1];
    usleep(300000);
    return [$code, (string) $r];
}
$M = date('Y-m');
$Mplus = date('Y-m', strtotime('first day of next month'));

echo "\n\033[1m① Copie admin périmée : le compteur du serveur ne recule pas\033[0m\n";
poser(['acc1|ia' => ['mois' => $M, 'utilise' => 9], 'acc2|epreuve' => ['mois' => $M, 'utilise' => 3]]);
$r = pousser(['acc1|ia' => ['mois' => $M, 'utilise' => 2]]);
$q = base()['plateforme']['quotas'] ?? [];
verifie($r[0] === 200, 'écriture admin acceptée', "HTTP {$r[0]} " . substr($r[1], 0, 140));
verifie(($q['acc1|ia']['utilise'] ?? null) === 9, 'acc1|ia reste à 9 (la copie disait 2)', json_encode($q['acc1|ia'] ?? null));
verifie(($q['acc2|epreuve']['utilise'] ?? null) === 3, 'acc2|epreuve, absent de la copie, est conservé', json_encode($q['acc2|epreuve'] ?? null));

echo "\n\033[1m② Copie sans aucun quota (plateforme sans « quotas »)\033[0m\n";
poser(['acc1|ia' => ['mois' => $M, 'utilise' => 9]]);
pousser(null);
$q = base()['plateforme']['quotas'] ?? [];
verifie(($q['acc1|ia']['utilise'] ?? null) === 9, 'les compteurs survivent à une copie qui n’en a pas', json_encode($q));

echo "\n\033[1m③ Ce qui est plus récent dans la copie l'emporte\033[0m\n";
poser(['acc1|ia' => ['mois' => $M, 'utilise' => 9]]);
pousser(['acc1|ia' => ['mois' => $M, 'utilise' => 12]]);
verifie((base()['plateforme']['quotas']['acc1|ia']['utilise'] ?? null) === 12, 'valeur plus grande du même mois : gardée');
poser(['acc1|ia' => ['mois' => $M, 'utilise' => 9]]);
pousser(['acc1|ia' => ['mois' => $Mplus, 'utilise' => 1]]);
$q1 = base()['plateforme']['quotas']['acc1|ia'] ?? [];
verifie(($q1['mois'] ?? '') === $Mplus && ($q1['utilise'] ?? null) === 1, 'mois suivant dans la copie : gardé', json_encode($q1));

proc_terminate($srv);
echo "\n" . ($ko ? "\033[31m$ko échec(s) sur $vu\033[0m" : "\033[32m$vu vérification(s) au vert\033[0m") . "\n";
exit($ko ? 1 : 0);
