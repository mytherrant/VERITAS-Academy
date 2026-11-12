<?php
/**
 * tests/bulletins_direct.php — BULLETINS BLANCS, CLASSES VIRTUELLES, LABOS PREMIUM
 * ÉPROUVÉS PAR HTTP (12/11/2026)
 *
 *     php tests/bulletins_direct.php
 *
 * Démarre un serveur PHP local sur une base et des dossiers JETABLES (fichier
 * de préchargement qui définit VRT_DB_FICHIER, VRT_EXAMENS_DIR…), fabrique de
 * vrais jetons de compte, et interroge api/examens.php, api/direct.php et
 * api/apprendre.php comme le ferait l'application :
 *   1. bulletin blanc : refusé en Starter, enregistré en Pro, moyennes justes,
 *      note hors bornes refusée ;
 *   2. classes virtuelles : planning visible de tous, inscription réservée à
 *      Élite, places comptées, lien remis seulement à l'inscrit et dans la fenêtre ;
 *   3. labos premium : refusés sans formule après l'essai, servis en Pro.
 */
declare(strict_types=1);

$TMP = sys_get_temp_dir() . '/vrt_bd_banc_' . getmypid() . '_' . bin2hex(random_bytes(3));
foreach (['examens', 'direct', 'classes', 'rate', 'sentinelle'] as $d) @mkdir("$TMP/$d", 0700, true);
$prepend = "$TMP/prepend.php";
file_put_contents($prepend, "<?php\n"
    . "define('VRT_DB_FICHIER', " . var_export("$TMP/db.json", true) . ");\n"
    . "define('VRT_EXAMENS_DIR', " . var_export("$TMP/examens", true) . ");\n"
    . "define('VRT_DIRECT_DIR', " . var_export("$TMP/direct", true) . ");\n"
    . "define('VRT_CLASSES_DIR', " . var_export("$TMP/classes", true) . ");\n"
    . "define('VRT_RATE_DIR', " . var_export("$TMP/rate", true) . ");\n"
    . "define('VRT_SENTINEL_DIR', " . var_export("$TMP/sentinelle", true) . ");\n"
    // Même clé de signature pour le banc et le serveur (sans secret configuré, elle serait tirée au sort par processus).
    . "define('VRT_HMAC_KEY', " . var_export('banc-' . bin2hex(random_bytes(16)), true) . ");\n");
require $prepend;
require_once __DIR__ . '/../api/_auth_lib.php';

$futur = (int) round(microtime(true) * 1000) + 30 * 86400000;
$comptes = [
    ['id' => 'va_starter', 'user' => 'starter1', 'plans' => ['abo_starter_m']],
    ['id' => 'va_pro',     'user' => 'pro1',     'plans' => ['abo_pro_m']],
    ['id' => 'va_elite',   'user' => 'elite1',   'plans' => ['abo_elite_m']],
    ['id' => 'va_elite2',  'user' => 'elite2',   'plans' => ['abo_elite_m']],
    ['id' => 'va_rien',    'user' => 'rien1',    'plans' => []],
];
$abos = [];
foreach ($comptes as $c) foreach ($c['plans'] as $p) $abos[] = ['accountId' => $c['id'], 'plan' => $p, 'statut' => 'actif', 'dateFinTs' => $futur];
$maintenant = time();
$db = [
    'visitorAccounts' => $comptes,
    'elearning' => ['abonnements' => $abos, 'plans' => []],
    'seancesDirect' => [
        ['id' => 'sd_now', 'titre' => 'Révision maths', 'classe' => 'Tle D', 'matiere' => 'Maths', 'debut' => date('c', $maintenant + 300), 'duree' => 60, 'places' => 1, 'lien' => 'https://meet.jit.si/veritas-test'],
        ['id' => 'sd_tard', 'titre' => 'Plus tard', 'classe' => '', 'debut' => date('c', $maintenant + 86400), 'duree' => 60, 'places' => 10, 'lien' => 'https://meet.jit.si/veritas-tard'],
    ],
];
file_put_contents("$TMP/db.json", json_encode($db));
$jeton = [];
foreach ($comptes as $c) $jeton[$c['user']] = vrt_issue_token($c, 'visiteur');

$port = 8300 + random_int(0, 500);
$racine = realpath(__DIR__ . '/..');
$srv = proc_open([PHP_BINARY, '-d', 'auto_prepend_file=' . $prepend, '-S', "127.0.0.1:$port", '-t', $racine],
    [['pipe', 'r'], ['file', '/dev/null', 'w'], ['file', '/dev/null', 'w']], $pipes);
register_shutdown_function(function () use ($srv, $TMP) {
    @proc_terminate($srv);
    $it = new RecursiveIteratorIterator(new RecursiveDirectoryIterator($TMP, FilesystemIterator::SKIP_DOTS), RecursiveIteratorIterator::CHILD_FIRST);
    foreach ($it as $f) { $f->isDir() ? @rmdir($f->getPathname()) : @unlink($f->getPathname()); }
    @rmdir($TMP);
});
for ($i = 0; $i < 50; $i++) { if (@fsockopen('127.0.0.1', $port)) break; usleep(100000); }

function post(string $fichier, array $corps): array {
    global $port;
    $ctx = stream_context_create(['http' => ['method' => 'POST', 'ignore_errors' => true, 'timeout' => 10,
        'header' => "Content-Type: application/json\r\nAccept: application/json\r\nAccept-Language: fr-FR,fr\r\n"
                  . "User-Agent: Mozilla/5.0 (Linux; Android 13) AppleWebKit/537.36 Chrome/120 Mobile Safari/537.36\r\n",
        'content' => json_encode($corps)]]);
    $r = @file_get_contents("http://127.0.0.1:$port/api/$fichier", false, $ctx);
    $j = json_decode((string) $r, true);
    return is_array($j) ? $j : ['brut' => substr((string) $r, 0, 200)];
}
$T = ['ok' => 0, 'ko' => 0];
function ok(string $titre, bool $cond, $detail = ''): void {
    global $T;
    if ($cond) { $T['ok']++; echo "  \033[32m✓\033[0m $titre\n"; return; }
    $T['ko']++; echo "  \033[31m✗\033[0m $titre\n      \033[33m" . (is_string($detail) ? $detail : json_encode($detail, JSON_UNESCAPED_UNICODE)) . "\033[0m\n";
}
function titre(string $t): void { echo "\n\033[1m$t\033[0m\n"; }
$copie = fn(float $n, string $m) => ['epreuveId' => 'ep_x', 'titre' => 'Épreuve test', 'matiere' => $m, 'classe' => '3ème', 'note' => $n,
    'detail' => [['lib' => 'Exercice 1', 'note' => 3, 'sur' => 4, 'commentaire' => 'Bien']], 'appreciation' => 'Correct'];

titre('1. Bulletin blanc');
$r = post('examens.php', ['action' => 'enregistrer', 'token' => $jeton['starter1'], 'copie' => $copie(12, 'Maths')]);
ok('Starter : la note n’est pas enregistrée (formule)', ($r['raison'] ?? '') === 'formule', $r);
$r = post('examens.php', ['action' => 'enregistrer', 'token' => '', 'copie' => $copie(12, 'Maths')]);
ok('sans jeton : connexion demandée', ($r['raison'] ?? '') === 'connexion', $r);
$r1 = post('examens.php', ['action' => 'enregistrer', 'token' => $jeton['pro1'], 'copie' => $copie(12, 'Maths')]);
$r2 = post('examens.php', ['action' => 'enregistrer', 'token' => $jeton['pro1'], 'copie' => $copie(16, 'Maths')]);
$r3 = post('examens.php', ['action' => 'enregistrer', 'token' => $jeton['pro1'], 'copie' => $copie(9, 'Français')]);
ok('Pro : trois copies enregistrées', !empty($r1['ok']) && !empty($r2['ok']) && !empty($r3['ok']), [$r1, $r3]);
$b = post('examens.php', ['action' => 'bulletin', 'token' => $jeton['pro1']]);
$maths = array_values(array_filter($b['matieres'] ?? [], fn($m) => $m['matiere'] === 'Maths'))[0] ?? [];
ok('moyenne de Maths = 14 (12 et 16), mention Bien', ($maths['moyenne'] ?? null) == 14 && ($maths['mention'] ?? '') === 'Bien', $maths);
ok('moyenne générale = moyenne des matières (14 et 9 → 11,5)', ($b['moyenne'] ?? null) == 11.5 && ($b['mention'] ?? '') === 'Passable', $b);
$r = post('examens.php', ['action' => 'enregistrer', 'token' => $jeton['pro1'], 'copie' => $copie(25, 'Maths')]);
ok('note au-delà de 20 refusée', ($r['raison'] ?? '') === 'invalide', $r);
$b2 = post('examens.php', ['action' => 'bulletin', 'token' => $jeton['elite1']]);
ok('le bulletin d’un autre élève est vide', ($b2['ok'] ?? false) && count($b2['notes'] ?? [1]) === 0, $b2);

titre('2. Classes virtuelles en direct');
$l = post('direct.php', ['action' => 'liste', 'token' => $jeton['pro1']]);
ok('Pro voit le planning, sans droit d’inscription', !empty($l['ok']) && $l['droit'] === false && count($l['seances']) === 2, $l);
ok('le planning ne contient aucun lien de visio', strpos(json_encode($l), 'meet.jit.si') === false);
$r = post('direct.php', ['action' => 'inscrire', 'token' => $jeton['pro1'], 'id' => 'sd_now']);
ok('Pro ne peut pas s’inscrire', ($r['raison'] ?? '') === 'formule', $r);
$r = post('direct.php', ['action' => 'rejoindre', 'token' => $jeton['elite1'], 'id' => 'sd_now']);
ok('Élite non inscrit : pas de lien', ($r['raison'] ?? '') === 'non_inscrit', $r);
$r = post('direct.php', ['action' => 'inscrire', 'token' => $jeton['elite1'], 'id' => 'sd_now']);
ok('Élite s’inscrit', !empty($r['ok']), $r);
$r = post('direct.php', ['action' => 'inscrire', 'token' => $jeton['elite2'], 'id' => 'sd_now']);
ok('séance à 1 place : le second Élite reçoit « complet »', ($r['raison'] ?? '') === 'complet', $r);
$r = post('direct.php', ['action' => 'rejoindre', 'token' => $jeton['elite1'], 'id' => 'sd_now']);
ok('inscrit, 5 min avant : le lien est remis', ($r['lien'] ?? '') === 'https://meet.jit.si/veritas-test', $r);
post('direct.php', ['action' => 'inscrire', 'token' => $jeton['elite1'], 'id' => 'sd_tard']);
$r = post('direct.php', ['action' => 'rejoindre', 'token' => $jeton['elite1'], 'id' => 'sd_tard']);
ok('séance de demain : lien refusé (trop tôt)', ($r['raison'] ?? '') === 'trop_tot', $r);
$l = post('direct.php', ['action' => 'liste', 'token' => $jeton['elite1']]);
$now1 = array_values(array_filter($l['seances'] ?? [], fn($s) => $s['id'] === 'sd_now'))[0] ?? [];
ok('le planning de l’inscrit le dit inscrit, 0 place restante', ($now1['inscrit'] ?? false) && ($now1['restantes'] ?? -1) === 0, $now1);
$r = post('direct.php', ['action' => 'inscrire', 'token' => $jeton['elite1'], 'id' => 'inconnue']);
ok('séance inconnue', ($r['raison'] ?? '') === 'introuvable', $r);

/* Le banc enchaîne des dizaines de requêtes depuis une seule adresse : on
   remet l'anti-robot à zéro entre deux séries, comme une minute d'attente. */
function sentinelleZero(): void { global $TMP; foreach (glob("$TMP/sentinelle/*") ?: [] as $f) if (is_file($f)) @unlink($f); }
sentinelleZero();
titre('3. Labos premium');
$r = post('apprendre.php', ['action' => 'labo', 'id' => 'lv10', 'token' => $jeton['pro1']]);
ok('Pro : protocole et quiz servis', !empty($r['ok']) && !empty($r['labo']['quiz']), array_slice($r, 0, 2));
$a = post('apprendre.php', ['action' => 'labo', 'id' => 'lv10', 'token' => $jeton['rien1']]);
$b = post('apprendre.php', ['action' => 'labo', 'id' => 'lv11', 'token' => $jeton['rien1']]);
ok('sans formule : 1 labo à l’essai, le 2ᵉ refusé', !empty($a['ok']) && ($b['raison'] ?? '') === 'essais', [$a['ok'] ?? null, $b]);
$s1 = post('apprendre.php', ['action' => 'labo', 'id' => 'lv14', 'token' => $jeton['starter1']]);
$s2 = post('apprendre.php', ['action' => 'labo', 'id' => 'lv16', 'token' => $jeton['starter1']]);
$s3 = post('apprendre.php', ['action' => 'labo', 'id' => 'lv18', 'token' => $jeton['starter1']]);
ok('Starter : 2 labos à l’essai, le 3ᵉ refusé', !empty($s1['ok']) && !empty($s2['ok']) && ($s3['raison'] ?? '') === 'essais', $s3);

echo "\n" . ($T['ko'] === 0 ? "\033[32m\033[1m  ✓ {$T['ok']}/{$T['ok']} contrôles passés — bulletins, direct et labos tiennent parole.\033[0m"
                             : "\033[31m\033[1m  ✗ {$T['ko']} échec(s) sur " . ($T['ok'] + $T['ko']) . "\033[0m") . "\n";
exit($T['ko'] === 0 ? 0 : 1);
