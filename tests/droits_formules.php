<?php
/**
 * tests/droits_formules.php — CE QUE CHAQUE FORMULE OUVRE, ÉPROUVÉ
 *
 *     php tests/droits_formules.php
 *
 * Garde la table des droits (vrt_droits_formules) et ce qui en dépend :
 *   1. groupe de droits de chaque identifiant de plan ;
 *   2. droits d'un compte selon ses abonnements actifs (le meilleur l'emporte,
 *      un abonnement expiré n'ouvre rien) ;
 *   3. classe d'une leçon d'après son identifiant ;
 *   4. classes retenues : confirmation, plafond, niveau générique, libération à 30 jours ;
 *   5. formules enseignant au catalogue, prix au mois et à l'année ;
 *   6. réglage par la base (DB.elearning.droitsFormules).
 * Les fichiers de classes vont dans un dossier temporaire (VRT_CLASSES_DIR).
 */
declare(strict_types=1);

$TMP = sys_get_temp_dir() . '/vrt_droits_banc_' . getmypid() . '_' . bin2hex(random_bytes(3));
@mkdir("$TMP/classes", 0700, true);
@mkdir("$TMP/rate", 0700, true);
define('VRT_CLASSES_DIR', "$TMP/classes");
define('VRT_RATE_DIR', "$TMP/rate");
define('VRT_DB_FICHIER', "$TMP/veritas_db.json");
register_shutdown_function(function () use ($TMP) {
    $it = new RecursiveIteratorIterator(new RecursiveDirectoryIterator($TMP, FilesystemIterator::SKIP_DOTS), RecursiveIteratorIterator::CHILD_FIRST);
    foreach ($it as $f) { $f->isDir() ? @rmdir($f->getPathname()) : @unlink($f->getPathname()); }
    @rmdir($TMP);
});

require_once __DIR__ . '/../api/_auth_lib.php';

$T = ['ok' => 0, 'ko' => 0];
function ok(string $titre, bool $cond, string $detail = ''): void {
    global $T;
    if ($cond) { $T['ok']++; echo "  \033[32m✓\033[0m $titre\n"; return; }
    $T['ko']++;
    echo "  \033[31m✗\033[0m $titre" . ($detail !== '' ? "\n      \033[33m$detail\033[0m" : '') . "\n";
}
function titre(string $t): void { echo "\n\033[1m$t\033[0m\n"; }

$futur = (int) round(microtime(true) * 1000) + 30 * 86400000;
$passe = (int) round(microtime(true) * 1000) - 86400000;
function compte(string $id, array $plans): array { return ['id' => $id, 'user' => $id, 'plans' => $plans]; }
function abo(string $acc, string $plan, int $fin, string $statut = 'actif'): array {
    return ['accountId' => $acc, 'plan' => $plan, 'statut' => $statut, 'dateFinTs' => $fin];
}

titre('1. Groupe de droits de chaque plan');
$attendu = ['abo_starter_m' => 'starter', 'abo_pro_a' => 'pro', 'abo_elite_m' => 'elite', 'abo_famille_a' => 'famille',
            'abo_prof3_m' => 'prof3', 'abo_prof6_a' => 'prof6', 'abo_proftout_m' => 'proftout',
            'plan1' => 'pro', 'plan2' => 'starter', 'plan4' => 'famille', 'ens' => null, 'pro' => null];
$mal = [];
foreach ($attendu as $p => $g) if (vrt_groupe_droits($p) !== $g) $mal[] = "$p→" . var_export(vrt_groupe_droits($p), true);
ok('chaque identifiant tombe dans son groupe (plans de l’Atelier exclus)', !$mal, implode(', ', $mal));

titre('2. Droits d’un compte');
$db = ['elearning' => ['abonnements' => [
    abo('a_starter', 'abo_starter_m', $futur),
    abo('a_pro', 'abo_pro_m', $futur),
    abo('a_expire', 'abo_elite_m', $passe),
    abo('a_cumul', 'abo_starter_m', $futur), abo('a_cumul', 'abo_elite_a', $futur),
    abo('a_prof', 'abo_prof6_m', $futur),
    abo('a_tout', 'abo_proftout_a', $futur),
]]];
$d = vrt_droits_compte(compte('rien', []), $db);
ok('sans formule : aucune classe, aucune fiche, pas de labos', $d['classes'] === 0 && $d['fichesSemaine'] === 0 && !$d['labos']);
$d = vrt_droits_compte(compte('a_starter', ['abo_starter_m']), $db);
ok('Starter : 1 classe, 5 questions/jour, 10 fiches/semaine, labos premium à l’essai seulement (2)',
   $d['classes'] === 1 && $d['iaJour'] === 5 && $d['fichesSemaine'] === 10 && !$d['labos'] && $d['labosEssai'] === 2, json_encode($d));
$d = vrt_droits_compte(compte('a_pro', ['abo_pro_m']), $db);
ok('Pro : 1 classe, 30 questions/jour, tous les labos, pas d’orientation',
   $d['classes'] === 1 && $d['iaJour'] === 30 && $d['labos'] && !$d['orientation'], json_encode($d));
$d = vrt_droits_compte(compte('a_expire', ['abo_elite_m']), $db);
ok('Élite expiré : n’ouvre plus rien', $d['classes'] === 0 && !$d['labos'] && !$d['orientation'], json_encode($d));
$d = vrt_droits_compte(compte('a_cumul', ['abo_starter_m', 'abo_elite_a']), $db);
ok('Starter + Élite : le meilleur de chaque droit, les classes s’additionnent (1 + 2)',
   $d['classes'] === 3 && $d['iaJour'] === 100 && $d['orientation'], json_encode($d));
$d = vrt_droits_compte(compte('a_prof', ['abo_prof6_m']), $db);
ok('Prof 6 classes : 6 classes, 80 questions/jour, 60 fiches/semaine', $d['classes'] === 6 && $d['iaJour'] === 80 && $d['fichesSemaine'] === 60, json_encode($d));
$d = vrt_droits_compte(compte('a_tout', ['abo_proftout_a']), $db);
ok('Prof toutes classes : classes sans limite', $d['classes'] === -1, json_encode($d));

titre('2 bis. Formule Famille : une classe par enfant');
$dbF = ['elearning' => ['abonnements' => [
    abo('parent', 'abo_famille_m', $futur),
    abo('enf1', 'abo_famille_m', $futur) + ['payeParCompte' => 'parent'],
    abo('enf2', 'abo_famille_m', $futur) + ['payeParCompte' => 'parent'],
    abo('parentSeul', 'abo_famille_a', $futur),
]]];
$d = vrt_droits_compte(compte('enf1', ['abo_famille_m']), $dbF);
ok('un enfant rattaché a 1 classe, au niveau Élite', $d['classes'] === 1 && $d['iaJour'] === 100 && $d['labos'], json_encode($d));
$d = vrt_droits_compte(compte('parent', ['abo_famille_m']), $dbF);
ok('le payeur garde les places non occupées (4 − 2 enfants = 2)', $d['classes'] === 2, json_encode($d));
$d = vrt_droits_compte(compte('parentSeul', ['abo_famille_a']), $dbF);
ok('sans enfant rattaché, le compte familial a les 4 places', $d['classes'] === 4, json_encode($d));

titre('2 ter. Classe d’un document du catalogue');
$cas = ['1ère C' => '1re-c', '3ème' => '3e', 'Tle D' => 'tle-d', 'Terminale' => 'tle', '2nde' => '2nde',
        '6ème-3ème' => '', '2nde-Tle C' => '', 'Form 5' => 'form-5', 'Tle F3' => 'tle-f3', '' => ''];
$mal = [];
foreach ($cas as $c => $v) if (vrt_classe_normaliser($c) !== $v) $mal[] = "« $c »→" . vrt_classe_normaliser($c);
ok('libellés reconnus ; un document multi-classes n’est rattaché à aucune', !$mal, implode(', ', $mal));

titre('2 quater. Labos premium');
$accL = compte('essai1', []);
ok('Starter : 2 labos premium distincts à l’essai sur 7 jours', vrt_labo_essai($accL, 'lv10', 2) && vrt_labo_essai($accL, 'lv11', 2));
ok('… le même labo se rouvre', vrt_labo_essai($accL, 'lv10', 2));
ok('… un 3ᵉ est refusé', !vrt_labo_essai($accL, 'lv14', 2));
ok('sans essai prévu, refusé', !vrt_labo_essai(compte('essai2', []), 'lv10', 0));
$prem = require __DIR__ . '/../api/_labos_premium.php';
ok('protocole et quiz des 9 labos payants servis par le serveur', is_array($prem) && count($prem) === 9 && !empty($prem['lv10']['quiz']));
$chunk = (string) file_get_contents(__DIR__ . '/../chunks/labo.js');
$fuite = [];
foreach ($prem as $id => $l) { foreach ($l['quiz'] as $q) if (strpos($chunk, (string) $q['q']) !== false) { $fuite[] = $id; break; } }
ok('aucun quiz payant ne reste dans le module public', !$fuite, implode(', ', $fuite));

titre('3. Classe d’une leçon');
$cas = ['1re-c-maths-r20' => '1re-c', '3e-maths-thales' => '3e', 'tle-a-sciences-r39' => 'tle-a',
        'tle-orient-bac' => 'tle', '2nde-a-fr-r1' => '2nde-a', '6e-ecm-famille' => '6e', 'inconnu' => ''];
$mal = [];
foreach ($cas as $id => $c) if (vrt_classe_de_lecon($id) !== $c) $mal[] = "$id→" . vrt_classe_de_lecon($id);
ok('identifiants reconnus, y compris les leçons de niveau sans série', !$mal, implode(', ', $mal));

titre('4. Classes retenues');
$acc = compte('eleve1', ['abo_pro_m']);
$dr = vrt_droits_compte($acc, $db + ['x' => 1]);
$dr['classes'] = 1;
ok('première classe : il faut confirmer avant de la retenir', vrt_classe_couverte($acc, $dr, '3e') === 'a_choisir');
ok('rien n’est retenu sans confirmation', vrt_classes_compte($acc) === []);
ok('confirmée : la 3ᵉ est retenue', vrt_classe_couverte($acc, $dr, '3e', true) === 'ok' && isset(vrt_classes_compte($acc)['3e']));
ok('une autre leçon de 3ᵉ passe sans rien demander', vrt_classe_couverte($acc, $dr, '3e') === 'ok');
ok('une 2ᵉ classe est refusée à une formule 1 classe, même avec « retenir »', vrt_classe_couverte($acc, $dr, '1re-c', true) === 'complet');
ok('la 3ᵉ ne se libère pas avant 30 jours', vrt_classe_liberer($acc, '3e') === false);
$f = vrt_classes_fichier($acc);
file_put_contents($f, json_encode(['3e' => time() - 31 * 86400]));
ok('après 30 jours elle se libère, et une autre classe peut être retenue',
   vrt_classe_liberer($acc, '3e') && vrt_classe_couverte($acc, $dr, '1re-c', true) === 'ok');
$accT = compte('eleve2', []); $dr2 = ['classes' => 1];
vrt_classe_couverte($accT, $dr2, 'tle-c', true);
ok('Tle C retenue couvre les leçons de Terminale sans série', vrt_classe_couverte($accT, $dr2, 'tle') === 'ok');
ok('… mais pas la Tle D', vrt_classe_couverte($accT, $dr2, 'tle-d') === 'complet');
ok('formule toutes classes : tout passe sans rien retenir', vrt_classe_couverte(compte('p', []), ['classes' => -1], '1re-d') === 'ok');

titre('5. Formules enseignant au catalogue');
$cat = vrt_plans_formules();
$prix = ['abo_prof3_m' => 2500, 'abo_prof3_a' => 21000, 'abo_prof6_m' => 4000, 'abo_prof6_a' => 33500,
         'abo_proftout_m' => 6000, 'abo_proftout_a' => 50000];
$mal = [];
foreach ($prix as $id => $p) if ((int) ($cat[$id]['prix'] ?? 0) !== $p) $mal[] = "$id=" . ($cat[$id]['prix'] ?? 'absent');
ok('prix au mois et à l’année', !$mal, implode(', ', $mal));
ok('durée mensuelle / annuelle', ($cat['abo_prof6_m']['duree'] ?? '') === 'mensuel' && ($cat['abo_prof6_a']['duree'] ?? '') === 'annuel');
ok('public enseignant', ($cat['abo_prof3_m']['public'] ?? '') === 'enseignant');
ok('prix de catalogue exigé au paiement', vrt_prix_catalogue([], 'subscription', 'abo_prof3_m') === 2500);

titre('6. Réglage par la base');
$dbR = $db; $dbR['elearning']['droitsFormules'] = ['starter' => ['fichesSemaine' => 15, 'labos' => true]];
$d = vrt_droits_compte(compte('a_starter', ['abo_starter_m']), $dbR);
ok('l’administration peut relever un droit sans redéployer', $d['fichesSemaine'] === 15 && $d['labos'] === true, json_encode($d));

echo "\n" . ($T['ko'] === 0 ? "\033[32m\033[1m  ✓ {$T['ok']}/{$T['ok']} contrôles passés — chaque formule ouvre ce qu’elle annonce.\033[0m"
                             : "\033[31m\033[1m  ✗ {$T['ko']} échec(s) sur " . ($T['ok'] + $T['ko']) . "\033[0m") . "\n";
exit($T['ko'] === 0 ? 0 : 1);
