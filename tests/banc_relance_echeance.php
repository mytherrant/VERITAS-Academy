<?php
/**
 * tests/banc_relance_echeance.php — PRÉVENIR AVANT QUE L'ACCÈS SE REFERME
 * © 2024-2026 Jacques Miterand TAKOU (Mythe Errant).
 *
 *   php tests/banc_relance_echeance.php
 *
 * CE QU'IL PROTÈGE
 *   La durée d'un abonnement était calculée, écrite et respectée à la lecture.
 *   Mais rien n'existait ENTRE « abonné » et « expiré » : pas de relance à
 *   l'approche du terme, aucun message le jour où le contenu se referme.
 *   L'abonné constatait un matin que tout avait disparu, sans savoir pourquoi
 *   ni comment revenir — et repartait souvent pour de bon.
 *
 *   Le transport existait déjà, éprouvé : c'est celui qui livre les codes de
 *   cahier par courriel, WhatsApp ou SMS. Il ne manquait que de s'en servir.
 *
 *   Les trois pièges d'une relance automatique, et ce banc les tient :
 *     ① prévenir DEUX fois est pire que ne pas prévenir (on passe pour un
 *        robot, et la personne se désabonne du canal) ;
 *     ② prévenir un abonnement SANS TERME n'a aucun sens — un octroi manuel
 *        de l'administration n'expire pas ;
 *     ③ prévenir trop tôt ne sert à rien, prévenir après coup non plus.
 */
declare(strict_types=1);

$racine = dirname(__DIR__);
$__nDir = sys_get_temp_dir() . '/vrt_relance_' . getmypid();
@mkdir($__nDir, 0700, true);
define('VRT_NOTIFY_DIR', $__nDir);
register_shutdown_function(function () use ($__nDir) {
    foreach (glob($__nDir . '/{,*/}*', GLOB_BRACE) ?: [] as $f) { if (is_file($f)) @unlink($f); }
    @rmdir($__nDir . '/notify'); @rmdir($__nDir);
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

function jours(int $j): int { return (int) round(microtime(true) * 1000) + $j * 86400000; }
function videFile(): void {
    foreach (glob(vrt_notify_dir() . '/*.json') ?: [] as $f) @unlink($f);
}
function enFile(): int { return count(glob(vrt_notify_dir() . '/*.json') ?: []); }

function baseAvec(array $abos): array {
    return [
        'visitorAccounts' => [[
            'id' => 'va_1', 'user' => 'mariam.n', 'nom' => 'NDONGO', 'pre' => 'Mariam',
            'tel' => '699000000', 'email' => 'mariam@example.cm', 'plans' => ['plan2'],
        ]],
        'elearning' => ['plans' => [], 'abonnements' => $abos, 'contenus' => []],
    ];
}
function abo(array $sur = []): array {
    return array_merge([
        'id' => 'abo_' . bin2hex(random_bytes(3)), 'accountId' => 'va_1',
        'plan' => 'plan2', 'planId' => 'plan2', 'planNom' => 'INTERMÉDIAIRE',
        'statut' => 'Activé', 'dateFinTs' => jours(3),
    ], $sur);
}

echo "\n\033[1m═══ PRÉVENIR AVANT QUE L'ACCÈS SE REFERME ═══\033[0m\n";

titre('① Un abonnement qui se termine bientôt est annoncé');
videFile();
$db = baseAvec([abo(['dateFinTs' => jours(3)])]);
$n = vrt_abo_relances($db, 7);
dit($n === 1, 'un abonnement à 3 jours du terme est relancé', (string) $n);
dit(enFile() === 1, 'et le message est en file', (string) enFile());
dit(!empty($db['elearning']['abonnements'][0]['relance']), 'la base garde trace de la relance');

$fs = glob(vrt_notify_dir() . '/*.json');
$m  = json_decode((string) file_get_contents($fs[0]), true);
dit(stripos((string) $m['texte'], 'echeance') !== false
    || stripos((string) $m['texte'], 'échéance') !== false,
    'le message parle bien d\'une échéance, pas d\'un code d\'accès');
dit(stripos((string) $m['texte'], '3 jour') !== false,
    'il dit combien de jours il reste', substr((string) $m['texte'], 0, 70));
dit(stripos((string) $m['texte'], 'Code :') === false,
    'et ne contient AUCUN code — ce n\'est pas une livraison');
dit(stripos((string) $m['texte'], 'enouvel') !== false,
    'il dit quoi faire : renouveler');

titre('② On ne prévient jamais deux fois');
$n2 = vrt_abo_relances($db, 7);
dit($n2 === 0, 'repasser la ronde ne relance rien', (string) $n2);
dit(enFile() === 1, 'et rien de neuf n\'entre en file', (string) enFile());

titre('③ Ce qui n\'a pas de terme n\'a rien à annoncer');
videFile();
$db = baseAvec([abo(['dateFinTs' => 0])]);
dit(vrt_abo_relances($db, 7) === 0, 'un octroi manuel sans date de fin n\'est pas relancé');
dit(enFile() === 0, 'rien en file');

titre('④ Ni trop tôt, ni trop tard');
videFile();
$db = baseAvec([abo(['dateFinTs' => jours(60)])]);
dit(vrt_abo_relances($db, 7) === 0, 'à 60 jours du terme : trop tôt, on ne dit rien');

videFile();
$db = baseAvec([abo(['dateFinTs' => jours(-2)])]);
dit(vrt_abo_relances($db, 7) === 0, 'déjà expiré depuis 2 jours : la relance n\'a plus d\'objet');

videFile();
$db = baseAvec([abo(['dateFinTs' => jours(3), 'statut' => 'Annulé'])]);
dit(vrt_abo_relances($db, 7) === 0, 'un abonnement annulé n\'est pas relancé');

titre('⑤ Le contact se complète par le compte');
videFile();
// La ligne d'abonnement ne porte AUCUN contact : c'est le cas du webhook
// serveur, qui ne connaît que l'identifiant du compte.
$db = baseAvec([abo(['tel' => '', 'email' => ''])]);
dit(vrt_abo_relances($db, 7) === 1, 'le numéro et l\'adresse sont repris sur le compte');
$fs = glob(vrt_notify_dir() . '/*.json');
$m  = json_decode((string) file_get_contents($fs[0]), true);
dit(($m['etat'] ?? '') === 'attente', 'la relance est joignable', (string) ($m['etat'] ?? ''));

videFile();
$db = baseAvec([abo(['tel' => '', 'email' => '', 'accountId' => 'inconnu'])]);
$db['visitorAccounts'][0]['tel'] = ''; $db['visitorAccounts'][0]['email'] = '';
dit(vrt_abo_relances($db, 7) === 0, 'sans aucun contact, on ne met rien en file');

titre('⑥ Le battement est bon marché quand il n\'y a rien à faire');
videFile();
$t0 = microtime(true);
vrt_notify_battement(600, 2);
$ms = (microtime(true) - $t0) * 1000;
dit($ms < 200, 'file vide : le battement rend la main tout de suite',
    sprintf('%.1f ms', $ms));

echo "\n" . str_repeat('─', 68) . "\n";
if ($ko === 0) echo "\033[32m\033[1m  ✓ $ok/$ok contrôles passés — personne ne perd son accès sans être prévenu.\033[0m\n\n";
else           echo "\033[31m\033[1m  ✗ $ko contrôle(s) au rouge sur " . ($ok + $ko) . ".\033[0m\n\n";
exit($ko === 0 ? 0 : 1);
