<?php
/**
 * gestion/api/install.php — Installation idempotente + premier administrateur.
 * © 2024-2026 Jacques Miterand TAKOU (Mythe Errant). Tous droits réservés.
 *
 * GET  → état (installé ? un admin existe ?) — sans secret, sert l'écran d'installation.
 * POST {jeton, action:'installer'}                         → tables + 2 centres + année
 * POST {jeton, action:'admin', identifiant, mdp, nom}      → crée / réinitialise l'admin
 *
 * Le jeton vit dans api/payment_config.php (gitignoré) : define('G_INSTALL_TOKEN', '…').
 * Il est lu en POST uniquement : un jeton dans l'URL finit dans les journaux du serveur.
 * FAIL-CLOSED : sans jeton posé côté serveur, aucune action n'est possible.
 */
declare(strict_types=1);

require_once __DIR__ . '/_boot.php';
require_once __DIR__ . '/_auth.php';
require_once __DIR__ . '/_schema.php';

$pdo = g_pdo();

if (($_SERVER['REQUEST_METHOD'] ?? 'GET') === 'GET') {
    $installe = false; $admin = false;
    try {
        $admin = (int) $pdo->query('SELECT COUNT(*) FROM g_utilisateurs WHERE admin_global = 1 AND actif = 1')->fetchColumn() > 0;
        $installe = true;
    } catch (Throwable $e) { /* tables absentes */ }
    g_ok(['installe' => $installe, 'admin' => $admin]);
}

// Anti-force-brute du jeton : 5 refus par IP et par quart d'heure.
try {
    $st = $pdo->prepare("SELECT COUNT(*) FROM g_journal WHERE action = 'installation_refusee' AND ip = ? AND le > ?");
    $st->execute([g_ip(), g_now('-15 minutes')]);
    if ((int) $st->fetchColumn() >= 5) { g_fail('Trop de tentatives. Réessayez plus tard.', 429); }
} catch (PDOException $e) { /* tables absentes : première installation */ }
$jeton = (string) (g_body()['jeton'] ?? '');
if ($jeton === '' || !hash_equals(G_INSTALL_TOKEN, $jeton)) {
    g_journal(null, 'installation_refusee');
    g_fail('Jeton d\'installation invalide.', 403);
}

$action = (string) g_param('action', '');

if ($action === 'installer') {
    $rapport = g_installer_schema($pdo);
    // Premier lancement : les deux centres tels qu'ils figurent sur les carnets de
    // reçus et les affiches 2026-2027 (adresses, téléphones, classes, jours de cours).
    if ((int) $pdo->query('SELECT COUNT(*) FROM g_centres')->fetchColumn() === 0) {
        $centres = [
            [
                'nom' => 'VÉRITAS Ndog-passi III', 'court' => 'Ndog-passi III',
                'adresse' => 'École primaire bilingue Grace land, à côté du Lycée de Nylon Ndogpassi',
                'tel' => '656720476 / 671469236 / 699073755 / 652967855',
                // Tarifs de l'affiche 2026-2027 : [nom, niveau, inscription, mensualité].
                'classes' => [['Troisième', '3e', 2500, 5500], ['Première', '1ère', 2500, 7500], ['Terminale', 'Tle', 2500, 8500]],
                'option' => [4000, 'avec Mon cahier de français'],
                'horaires' => [[2, '16:00', '18:00', ''], [3, '14:30', '18:00', ''], [4, '16:00', '18:00', ''], [6, '08:00', '12:00', '']],
            ],
            [
                'nom' => 'VÉRITAS Ndog-passi II', 'court' => 'Ndog-passi II',
                'adresse' => 'École primaire Germinal, à côté de l\'école Henri Dumont (derrière le commissariat du 14e)',
                'tel' => '656720476 / 697637739 / 671469236',
                'classes' => [['3ème', '3e', 2000, 5000], ['Première A4', '1ère', 2000, 6000], ['Terminale A4', 'Tle', 2000, 7000],
                              ['Première CD', '1ère', 2000, 7000], ['Terminale CD', 'Tle', 2000, 8000]],
                'option' => [0, ''],
                'horaires' => [
                    [1, '16:00', '18:00', '1ère,Tle'], [3, '16:00', '18:00', '1ère,Tle'], [5, '16:00', '18:00', '1ère,Tle'],
                    [6, '14:00', '18:00', '1ère,Tle'], [7, '13:00', '17:00', '1ère,Tle'],
                    [2, '16:00', '18:00', '3e'], [4, '16:00', '18:00', '3e'], [6, '08:00', '12:00', '3e'], [7, '08:00', '12:00', '3e'],
                ],
            ],
        ];
        $insC = $pdo->prepare('INSERT INTO g_centres (id, nom, nom_court, adresse, telephones, devise, ordre, inscription_option, inscription_option_libelle, rev, maj_le) VALUES (?,?,?,?,?,?,?,?,?,?,?)');
        $insK = $pdo->prepare('INSERT INTO g_classes (id, centre_id, nom, niveau, ordre, inscription, mensualite, rev, maj_le) VALUES (?,?,?,?,?,?,?,?,?)');
        $insH = $pdo->prepare('INSERT INTO g_horaires (id, centre_id, jour, debut, fin, niveaux, rev, maj_le) VALUES (?,?,?,?,?,?,?,?)');
        foreach ($centres as $i => $c) {
            $cid = g_id();
            $insC->execute([$cid, $c['nom'], $c['court'], $c['adresse'], $c['tel'], 'Discipline - Constance - Rigueur - Succès', $i + 1, $c['option'][0], $c['option'][1], g_rev(), g_now()]);
            foreach ($c['classes'] as $j => $k) { $insK->execute([g_id(), $cid, $k[0], $k[1], $j + 1, $k[2], $k[3], g_rev(), g_now()]); }
            foreach ($c['horaires'] as $h) { $insH->execute([g_id(), $cid, $h[0], $h[1], $h[2], $h[3], g_rev(), g_now()]); }
        }
        $rapport['centres_crees'] = count($centres);
    }
    if ((int) $pdo->query('SELECT COUNT(*) FROM g_annees')->fetchColumn() === 0) {
        $pdo->prepare(
            'INSERT INTO g_annees (id, libelle, debut, fin, mois_factures, active, rev, maj_le) VALUES (?,?,?,?,?,?,?,?)'
        // Rentrée le mercredi 16 septembre 2026 ; « le mois de septembre est gratuit » (affiches).
        )->execute([g_id(), '2026-2027', '2026-09-16', '2027-06-30', '10,11,12,1,2,3,4,5', 1, g_rev(), g_now()]);
        $rapport['annee_creee'] = '2026-2027';
    }
    // Matières usuelles du secondaire camerounais (modifiables ensuite par l'admin).
    if ((int) $pdo->query('SELECT COUNT(*) FROM g_matieres')->fetchColumn() === 0) {
        $ins = $pdo->prepare('INSERT INTO g_matieres (id, nom, ordre, rev, maj_le) VALUES (?,?,?,?,?)');
        // Matières des affiches 2026-2027.
        $noms = ['Français', 'Philosophie', 'Mathématiques', 'Physique', 'Chimie', 'SVT-EEHB', 'Anglais', 'Informatique',
                 'Histoire', 'Géographie', 'ECM', 'Allemand', 'Espagnol', 'Chinois', 'Arabe'];
        foreach ($noms as $i => $n) { $ins->execute([g_id(), $n, $i + 1, g_rev(), g_now()]); }
        $rapport['matieres_creees'] = count($noms);
    }
    g_journal(null, 'installation', 'schema', '', null, ['colonnes_ajoutees' => $rapport['colonnes_ajoutees']]);
    g_ok($rapport);
}

if ($action === 'admin') {
    $ident = mb_strtolower(trim((string) (g_body()['identifiant'] ?? '')));
    $mdp   = (string) (g_body()['mdp'] ?? '');
    $nom   = mb_substr(trim((string) (g_body()['nom'] ?? 'Administrateur')), 0, 120);
    // Une fois un admin actif en place, cette porte se ferme : la rouvrir demande de déposer
    // le fichier témoin data/.install_ouverte sur le serveur (accès FTP = preuve de propriété).
    $adminActif = (int) $pdo->query('SELECT COUNT(*) FROM g_utilisateurs WHERE admin_global = 1 AND actif = 1')->fetchColumn() > 0;
    if ($adminActif && !is_file(__DIR__ . '/data/.install_ouverte')) {
        g_fail('Un administrateur existe déjà. Pour en recréer un, déposez le fichier api/data/.install_ouverte sur le serveur.', 409);
    }
    if (!preg_match('/^[a-z0-9._-]{3,60}$/', $ident)) { g_fail('Identifiant : 3 à 60 caractères (lettres, chiffres, . _ -).', 422); }
    if (mb_strlen($mdp) < 10) { g_fail('Mot de passe : 10 caractères minimum.', 422); }
    $st = $pdo->prepare('SELECT id FROM g_utilisateurs WHERE identifiant = ?');
    $st->execute([$ident]);
    $id = $st->fetchColumn();
    if ($id) {
        $pdo->prepare('UPDATE g_utilisateurs SET mdp_hash = ?, nom = ?, admin_global = 1, actif = 1, maj_le = ? WHERE id = ?')
            ->execute([g_hash_mdp($mdp), $nom, g_now(), $id]);
        $pdo->prepare('DELETE FROM g_sessions WHERE utilisateur_id = ?')->execute([$id]);
    } else {
        $id = g_id();
        $pdo->prepare(
            'INSERT INTO g_utilisateurs (id, identifiant, nom, mdp_hash, admin_global, actif, cree_le, maj_le) VALUES (?,?,?,?,1,1,?,?)'
        )->execute([$id, $ident, $nom, g_hash_mdp($mdp), g_now(), g_now()]);
    }
    g_journal(null, 'admin_installe', 'utilisateur', (string) $id);
    g_ok(['identifiant' => $ident]);
}

g_fail('Action inconnue (installer | admin).', 400);
