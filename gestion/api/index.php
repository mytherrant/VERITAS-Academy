<?php
/**
 * gestion/api/index.php — Point d'entrée unique de l'API (route dans ?r=).
 * © 2024-2026 Jacques Miterand TAKOU (Mythe Errant). Tous droits réservés.
 *
 *   POST auth/connexion   {identifiant, mdp, appareil}
 *   POST auth/deconnexion
 *   GET  moi              profil, accès par centre, capacités
 *   POST moi/mdp          {ancien, nouveau}
 *   GET  sessions         [{id}] sessions d'un compte (le sien, ou admin/responsable)
 *   POST sessions/revoquer {id}
 *   GET  comptes          comptes visibles
 *   POST comptes/enregistrer {id?, identifiant, nom, tel, actif, admin_global, acces:[{centre_id, role}]}
 *   POST comptes/mdp      {id} → nouveau mot de passe, affiché une seule fois
 *   GET  journal          {centre?, avant?, limite?}
 *   GET  sync/tirer       {depuis}
 *   POST sync/pousser     {ops:[{op, t, id, suppr?, champs}]}
 */
declare(strict_types=1);

require_once __DIR__ . '/_boot.php';
require_once __DIR__ . '/_auth.php';
require_once __DIR__ . '/_schema.php';
g_schema_a_jour();

$route   = trim((string) ($_GET['r'] ?? ''), '/');
$methode = $_SERVER['REQUEST_METHOD'] ?? 'GET';
$pdo     = g_pdo();

function g_exiger_post(string $methode): void {
    if ($methode !== 'POST') { g_fail('Méthode non autorisée.', 405); }
}

/** Profil renvoyé au téléphone après connexion et à chaque ouverture. */
function g_profil(array $ctx): array {
    return [
        'utilisateur' => ['id' => $ctx['uid'], 'identifiant' => $ctx['identifiant'], 'nom' => $ctx['nom'], 'admin' => $ctx['admin']],
        'acces'       => (object) $ctx['acces'],
        'capacites'   => g_capacites(),
        'restrictions' => $ctx['restrictions'] ?? [],
        'retirables'  => g_capacites_retirables(),
    ];
}

/** Le compte $ctx peut-il gérer le compte cible (accès [centre => rôle], admin_global) ? */
function g_peut_gerer_compte(array $ctx, array $accesCible, bool $cibleAdmin): bool {
    if ($ctx['admin']) { return true; }
    if ($cibleAdmin || !$accesCible) { return false; }
    foreach ($accesCible as $cid => $role) {
        // Un responsable ne gère que les secrétaires et enseignants de SES centres.
        if (!g_peut($ctx, 'comptes.gerer', (string) $cid) || !in_array($role, ['secretaire', 'enseignant'], true)) {
            return false;
        }
    }
    return true;
}

switch ($route) {

// ─────────────────────────────── Connexion ───────────────────────────────
// Version de l'application en ligne (lue dans index.html) : un téléphone resté sur une vieille
// version (application Android, copie en cache) le signale à son utilisateur. Sans secret.
case 'version': {
    $html = @file_get_contents(dirname(__DIR__) . '/index.html') ?: '';
    g_ok(['version' => preg_match('/app\.js\?v=([\d.]+)/', $html, $m) ? $m[1] : '']);
}

case 'auth/connexion': {
    g_exiger_post($methode);
    $ident = mb_strtolower(trim((string) (g_body()['identifiant'] ?? '')));
    $mdp   = (string) (g_body()['mdp'] ?? '');
    if ($ident === '' || $mdp === '') { g_fail('Identifiant et mot de passe requis.', 422); }
    $st = $pdo->prepare('SELECT id, mdp_hash, actif FROM g_utilisateurs WHERE identifiant = ?');
    $st->execute([mb_substr($ident, 0, 60)]);
    $u = $st->fetch();
    // Identifiant inconnu : on n'en garde qu'une empreinte (ce pourrait être un mot de passe).
    $cleJournal = $u ? $ident : 'inconnu:' . substr(hash('sha256', $ident), 0, 12);
    g_garde_connexion($cleJournal);
    // password_verify même sans compte : même durée de réponse, on ne révèle pas qui existe.
    $okMdp = password_verify($mdp, $u ? (string) $u['mdp_hash'] : '$2y$12$' . str_repeat('x', 53));
    if (!$u || !$okMdp) {
        g_journal(null, 'connexion_echec', 'utilisateur', $cleJournal);
        g_fail('Identifiant ou mot de passe incorrect.', 401);
    }
    if ((int) $u['actif'] !== 1) { g_fail('Compte désactivé. Contactez l\'administrateur.', 403); }
    if (password_needs_rehash((string) $u['mdp_hash'], PASSWORD_BCRYPT, ['cost' => (int) G_BCRYPT_COST])) {
        $pdo->prepare('UPDATE g_utilisateurs SET mdp_hash = ? WHERE id = ?')->execute([g_hash_mdp($mdp), $u['id']]);
    }
    $session = g_ouvrir_session((string) $u['id'], (string) g_param('appareil', ''));
    $ctx = g_exiger_session($session['jeton']);
    g_journal($ctx, 'connexion', 'utilisateur', $ctx['uid']);
    g_ok(['session' => $session] + g_profil($ctx));
}

case 'auth/deconnexion': {
    g_exiger_post($methode);
    $ctx = g_exiger_session();
    g_fermer_session();
    g_journal($ctx, 'deconnexion', 'utilisateur', $ctx['uid']);
    g_ok();
}

case 'moi': {
    g_ok(g_profil(g_exiger_session()));
}

case 'moi/mdp': {
    g_exiger_post($methode);
    $ctx = g_exiger_session();
    $ancien = (string) (g_body()['ancien'] ?? '');
    $nouveau = (string) (g_body()['nouveau'] ?? '');
    if (mb_strlen($nouveau) < 8) { g_fail('Nouveau mot de passe : 8 caractères minimum.', 422); }
    g_garde_connexion($ctx['identifiant']);
    $st = $pdo->prepare('SELECT mdp_hash FROM g_utilisateurs WHERE id = ?');
    $st->execute([$ctx['uid']]);
    if (!password_verify($ancien, (string) $st->fetchColumn())) {
        g_journal($ctx, 'connexion_echec', 'utilisateur', $ctx['identifiant']);
        g_fail('Mot de passe actuel incorrect.', 403);
    }
    $pdo->prepare('UPDATE g_utilisateurs SET mdp_hash = ?, maj_le = ? WHERE id = ?')->execute([g_hash_mdp($nouveau), g_now(), $ctx['uid']]);
    // Les autres appareils sont déconnectés ; celui-ci garde sa session.
    $pdo->prepare('DELETE FROM g_sessions WHERE utilisateur_id = ? AND id <> ?')->execute([$ctx['uid'], $ctx['session_id']]);
    g_journal($ctx, 'mdp_change', 'utilisateur', $ctx['uid']);
    g_ok();
}

// ─────────────────────────────── Sessions ───────────────────────────────
case 'sessions': {
    $ctx = g_exiger_session();
    $cible = (string) g_param('id', $ctx['uid']);
    if ($cible !== $ctx['uid']) {
        $st = $pdo->prepare('SELECT admin_global FROM g_utilisateurs WHERE id = ?');
        $st->execute([$cible]);
        if (!g_peut_gerer_compte($ctx, g_acces_de($cible), (int) $st->fetchColumn() === 1)) { g_fail('Non autorisé.', 403); }
    }
    $st = $pdo->prepare('SELECT id, appareil, ip, cree_le, vu_le, expire_le FROM g_sessions WHERE utilisateur_id = ? ORDER BY vu_le DESC');
    $st->execute([$cible]);
    $lignes = $st->fetchAll();
    foreach ($lignes as &$l) { $l['courante'] = $l['id'] === $ctx['session_id']; }
    g_ok(['sessions' => $lignes]);
}

case 'sessions/revoquer': {
    g_exiger_post($methode);
    $ctx = g_exiger_session();
    $sid = (string) g_param('id', '');
    $st = $pdo->prepare('SELECT s.utilisateur_id, u.admin_global FROM g_sessions s JOIN g_utilisateurs u ON u.id = s.utilisateur_id WHERE s.id = ?');
    $st->execute([$sid]);
    $s = $st->fetch();
    if (!$s) { g_fail('Session introuvable.', 404); }
    $proprio = (string) $s['utilisateur_id'];
    if ($proprio !== $ctx['uid'] && !g_peut_gerer_compte($ctx, g_acces_de($proprio), (int) $s['admin_global'] === 1)) {
        g_fail('Non autorisé.', 403);
    }
    $pdo->prepare('DELETE FROM g_sessions WHERE id = ?')->execute([$sid]);
    g_journal($ctx, 'session_revoquee', 'utilisateur', $proprio);
    g_ok();
}

// ─────────────────────────────── Comptes ───────────────────────────────
case 'comptes': {
    $ctx = g_exiger_session();
    $centres = g_centres_avec($ctx, 'comptes.gerer');
    if (!$centres && !$ctx['admin']) { g_fail('Non autorisé.', 403); }
    $users = $pdo->query('SELECT id, identifiant, nom, tel, admin_global, actif, matieres, restrictions, cree_le FROM g_utilisateurs ORDER BY nom')->fetchAll();
    $acces = [];
    foreach ($pdo->query('SELECT utilisateur_id, centre_id, role FROM g_acces')->fetchAll() as $a) {
        $acces[$a['utilisateur_id']][$a['centre_id']] = $a['role'];
    }
    $vus = $pdo->query('SELECT utilisateur_id, MAX(vu_le) AS vu FROM g_sessions GROUP BY utilisateur_id')->fetchAll(PDO::FETCH_KEY_PAIR);
    $out = [];
    foreach ($users as $u) {
        $a = $acces[$u['id']] ?? [];
        if (!$ctx['admin']) {
            // Un responsable voit les comptes rattachés à ses centres (hors admins).
            if ((int) $u['admin_global'] === 1 || !array_intersect(array_keys($a), $centres)) { continue; }
        }
        $u['admin_global'] = (int) $u['admin_global'] === 1;
        $u['actif'] = (int) $u['actif'] === 1;
        $u['acces'] = (object) $a;
        $u['matieres'] = array_values(array_filter(explode(',', (string) $u['matieres'])));
        $u['restrictions'] = array_values(array_filter(explode(',', (string) $u['restrictions'])));
        $u['vu_le'] = $vus[$u['id']] ?? null;
        $u['gerable'] = g_peut_gerer_compte($ctx, $a, $u['admin_global']);
        $out[] = $u;
    }
    g_ok(['comptes' => $out]);
}

case 'comptes/enregistrer': {
    g_exiger_post($methode);
    $ctx = g_exiger_session();
    $id    = (string) g_param('id', '');
    $ident = mb_strtolower(trim((string) g_param('identifiant', '')));
    $nom   = trim((string) g_param('nom', ''));
    $tel   = trim((string) g_param('tel', ''));
    $actif = g_param('actif', true) ? 1 : 0;
    $admin = g_param('admin_global', false) ? 1 : 0;
    $accesDemandes = [];
    foreach ((array) g_param('acces', []) as $a) {
        $cid = (string) ($a['centre_id'] ?? ''); $role = (string) ($a['role'] ?? '');
        if ($cid !== '' && in_array($role, G_ROLES, true)) { $accesDemandes[$cid] = $role; }
    }
    if ($nom === '') { g_fail('Le nom est obligatoire.', 422); }
    // Nouveau compte sans identifiant : il se déduit du nom (« ESSOMBA Paul » → paul.essomba), unique.
    // Centres indépendants : un compte (hors administrateur) = un seul centre. Une personne présente
    // dans les deux centres a deux comptes distincts ; rien n'est mélangé (caisse, paie, appel, messages).
    if (!$admin && count($accesDemandes) > 1) {
        g_fail('Les centres sont indépendants : un compte n\'a accès qu\'à un seul centre. Créez un compte séparé pour l\'autre centre.', 422);
    }
    if ($ident === '' && $id === '') {
        $suffixe = '';
        if ($accesDemandes) {
            $st = $pdo->prepare('SELECT COALESCE(NULLIF(nom_court, \'\'), nom) FROM g_centres WHERE id = ?');
            $st->execute([array_key_first($accesDemandes)]);
            $suffixe = (string) $st->fetchColumn();
        }
        $ident = g_identifiant_libre($pdo, $nom, $suffixe);
    }
    if (!preg_match('/^[a-z0-9._-]{3,60}$/', $ident)) { g_fail('Identifiant : 3 à 60 caractères (lettres, chiffres, . _ -).', 422); }
    $matieres = array_values(array_unique(array_filter(array_map('strval', (array) g_param('matieres', [])))));
    if ($matieres) {
        $ph = implode(',', array_fill(0, count($matieres), '?'));
        $st = $pdo->prepare("SELECT COUNT(*) FROM g_matieres WHERE supprime = 0 AND id IN ($ph)");
        $st->execute($matieres);
        if ((int) $st->fetchColumn() !== count($matieres)) { g_fail('Matière inconnue.', 422); }
    }
    $matieresTxt = mb_substr(implode(',', $matieres), 0, 500);
    $restrictionsTxt = null;   // null = inchangé
    if (g_param('restrictions', null) !== null) {
        $demandees = array_values(array_unique(array_filter(array_map('strval', (array) g_param('restrictions', [])))));
        if (array_diff($demandees, g_capacites_retirables())) { g_fail('Capacité inconnue.', 422); }
        sort($demandees);
        $restrictionsTxt = implode(',', $demandees);
    }
    if ($accesDemandes) {
        $ph = implode(',', array_fill(0, count($accesDemandes), '?'));
        $st = $pdo->prepare("SELECT COUNT(*) FROM g_centres WHERE supprime = 0 AND id IN ($ph)");
        $st->execute(array_keys($accesDemandes));
        if ((int) $st->fetchColumn() !== count($accesDemandes)) { g_fail('Centre inconnu.', 422); }
    }
    if (!$admin && !$accesDemandes) { g_fail('Donnez au moins un rôle dans un centre.', 422); }
    if ($admin && !$ctx['admin']) { g_fail('Seul l\'administrateur peut créer un administrateur.', 403); }

    $avant = null;
    if ($id !== '') {
        $st = $pdo->prepare('SELECT id, identifiant, nom, tel, admin_global, actif, matieres FROM g_utilisateurs WHERE id = ?');
        $st->execute([$id]);
        $avant = $st->fetch();
        if (!$avant) { g_fail('Compte introuvable.', 404); }
        $avant['restrictions'] = (string) $pdo->query('SELECT restrictions FROM g_utilisateurs WHERE id = ' . $pdo->quote($id))->fetchColumn();
        $avant['acces'] = g_acces_de($id);
        if (!g_peut_gerer_compte($ctx, $avant['acces'], (int) $avant['admin_global'] === 1)) { g_fail('Non autorisé.', 403); }
        if ($id === $ctx['uid'] && (!$actif || ($ctx['admin'] && !$admin))) {
            g_fail('Vous ne pouvez pas vous désactiver ni retirer votre propre rôle d\'administrateur.', 422);
        }
    }
    if (!g_peut_gerer_compte($ctx, $accesDemandes, (bool) $admin)) { g_fail('Vous ne pouvez attribuer que des rôles secrétaire ou enseignant dans vos centres.', 403); }
    if ($restrictionsTxt !== null && $restrictionsTxt !== (string) ($avant['restrictions'] ?? '') && !$ctx['admin']) {
        g_fail('Seul l\'administrateur règle les droits d\'un compte.', 403);
    }
    if ($restrictionsTxt !== null && $id === $ctx['uid'] && $restrictionsTxt !== '') { g_fail('Vous ne pouvez pas vous retirer des droits à vous-même.', 422); }
    if ($avant && (int) $avant['admin_global'] === 1 && (!$admin || !$actif)) {
        $st = $pdo->prepare('SELECT COUNT(*) FROM g_utilisateurs WHERE admin_global = 1 AND actif = 1 AND id <> ?');
        $st->execute([$id]);
        if (!(int) $st->fetchColumn()) { g_fail('C\'est le dernier administrateur actif : il doit le rester.', 422); }
    }
    $st = $pdo->prepare('SELECT id FROM g_utilisateurs WHERE identifiant = ? AND id <> ?');
    $st->execute([$ident, $id]);
    if ($st->fetchColumn()) { g_fail('Cet identifiant est déjà pris.', 409); }

    $mdpClair = null;
    $pdo->beginTransaction();
    try {
        if ($id === '') {
            $id = g_id();
            $mdpClair = g_mdp_aleatoire();
            $pdo->prepare('INSERT INTO g_utilisateurs (id, identifiant, nom, tel, mdp_hash, admin_global, actif, matieres, cree_le, maj_le) VALUES (?,?,?,?,?,?,?,?,?,?)')
                ->execute([$id, $ident, $nom, $tel, g_hash_mdp($mdpClair), $admin, $actif, $matieresTxt, g_now(), g_now()]);
        } else {
            $pdo->prepare('UPDATE g_utilisateurs SET identifiant = ?, nom = ?, tel = ?, admin_global = ?, actif = ?, matieres = ?, maj_le = ? WHERE id = ?')
                ->execute([$ident, $nom, $tel, $admin, $actif, $matieresTxt, g_now(), $id]);
        }
        if ($restrictionsTxt !== null) {
            $pdo->prepare('UPDATE g_utilisateurs SET restrictions = ? WHERE id = ?')->execute([$restrictionsTxt, $id]);
        }
        $pdo->prepare('DELETE FROM g_acces WHERE utilisateur_id = ?')->execute([$id]);
        $ins = $pdo->prepare('INSERT INTO g_acces (id, utilisateur_id, centre_id, role, cree_le) VALUES (?,?,?,?,?)');
        foreach ($accesDemandes as $cid => $role) { $ins->execute([g_id(), $id, $cid, $role, g_now()]); }
        if (!$actif) { $pdo->prepare('DELETE FROM g_sessions WHERE utilisateur_id = ?')->execute([$id]); }
        $pdo->commit();
    } catch (Throwable $e) {
        $pdo->rollBack();
        throw $e;
    }
    $apres = ['identifiant' => $ident, 'nom' => $nom, 'tel' => $tel, 'admin_global' => $admin, 'actif' => $actif, 'acces' => $accesDemandes, 'matieres' => $matieres]
        + ($restrictionsTxt !== null ? ['restrictions' => $restrictionsTxt] : []);
    foreach (array_keys($accesDemandes + ($avant['acces'] ?? [])) as $cid) {
        g_journal($ctx, $avant ? 'compte_modifie' : 'compte_cree', 'utilisateur', $id, $avant, $apres, (string) $cid);
    }
    if (!$accesDemandes && !($avant['acces'] ?? [])) {
        g_journal($ctx, $avant ? 'compte_modifie' : 'compte_cree', 'utilisateur', $id, $avant, $apres);
    }
    g_ok(['id' => $id, 'mdp' => $mdpClair, 'identifiant' => $ident]);
}

case 'comptes/mdp': {
    g_exiger_post($methode);
    $ctx = g_exiger_session();
    $id = (string) g_param('id', '');
    $st = $pdo->prepare('SELECT admin_global FROM g_utilisateurs WHERE id = ?');
    $st->execute([$id]);
    $adm = $st->fetchColumn();
    if ($adm === false) { g_fail('Compte introuvable.', 404); }
    if (!g_peut_gerer_compte($ctx, g_acces_de($id), (int) $adm === 1)) { g_fail('Non autorisé.', 403); }
    $mdp = g_mdp_aleatoire();
    $pdo->prepare('UPDATE g_utilisateurs SET mdp_hash = ?, maj_le = ? WHERE id = ?')->execute([g_hash_mdp($mdp), g_now(), $id]);
    $pdo->prepare('DELETE FROM g_sessions WHERE utilisateur_id = ?')->execute([$id]);
    g_journal($ctx, 'mdp_reinitialise', 'utilisateur', $id);
    g_ok(['mdp' => $mdp]);
}

// ─────────────────────────────── Tranches de numéros de reçu ───────────────────────────────
case 'recus/tranche': {
    g_exiger_post($methode);
    $ctx = g_exiger_session();
    $centre = (string) g_param('centre', '');
    g_exiger($ctx, 'paiements.encaisser', $centre);
    $st = $pdo->prepare('SELECT COUNT(*) FROM g_centres WHERE id = ? AND supprime = 0');
    $st->execute([$centre]);
    if (!(int) $st->fetchColumn()) { g_fail('Centre inconnu.', 404); }
    $prefixe = g_prefixe_annee($pdo);
    $taille = 20;
    // Renvoie TOUJOURS les tranches du compte (un téléphone réinstallé les retrouve) ; n'en
    // crée une nouvelle que s'il lui reste moins de 10 numéros libres : pas d'accaparement.
    $mesTranches = function () use ($pdo, $centre, $ctx, $prefixe): array {
        $st = $pdo->prepare('SELECT id, centre_id, utilisateur_id, prefixe, debut, fin, cree_le FROM g_tranches WHERE centre_id = ? AND utilisateur_id = ? AND prefixe = ? ORDER BY debut');
        $st->execute([$centre, $ctx['uid'], $prefixe]);
        return array_map(fn($t) => ['debut' => (int) $t['debut'], 'fin' => (int) $t['fin']] + $t, $st->fetchAll());
    };
    $miennes = $mesTranches();
    $st = $pdo->prepare('SELECT numero FROM g_paiements WHERE centre_id = ? AND numero LIKE ?');
    $st->execute([$centre, $prefixe . '-%']);
    $pris = array_flip(array_map(fn($n) => (int) substr((string) $n, 5), $st->fetchAll(PDO::FETCH_COLUMN)));
    $libres = 0;
    foreach ($miennes as $t) { for ($n = $t['debut']; $n <= $t['fin']; $n++) { if (!isset($pris[$n])) { $libres++; } } }
    if ($libres >= 10) { g_ok(['tranches' => $miennes, 'libres' => $libres]); }
    $pdo->beginTransaction();
    try {
        g_verrou_centre($pdo, $centre);
        $st = $pdo->prepare('SELECT numero FROM g_paiements WHERE centre_id = ? AND numero LIKE ?');
        $st->execute([$centre, $prefixe . '-%']);
        $max = 0;
        foreach ($st->fetchAll(PDO::FETCH_COLUMN) as $n) { $max = max($max, (int) substr((string) $n, 5)); }
        $max = max($max, g_max_tranche($pdo, $centre, $prefixe));
        if ($max + $taille > 9999) { throw new RuntimeException('Plus de numéros disponibles cette année.'); }
        $t = ['id' => g_id(), 'centre_id' => $centre, 'utilisateur_id' => $ctx['uid'], 'prefixe' => $prefixe, 'debut' => $max + 1, 'fin' => $max + $taille, 'cree_le' => g_now()];
        $pdo->prepare('INSERT INTO g_tranches (id, centre_id, utilisateur_id, prefixe, debut, fin, cree_le) VALUES (?,?,?,?,?,?,?)')->execute(array_values($t));
        $pdo->commit();
    } catch (Throwable $e) {
        $pdo->rollBack();
        throw $e;
    }
    g_journal($ctx, 'tranche_reservee', 'g_tranches', $t['id'], null, ['debut' => $t['debut'], 'fin' => $t['fin']], $centre);
    g_ok(['tranches' => $mesTranches(), 'libres' => $libres + $taille]);
}

// ─────────────────────────────── Justificatifs (photos) ───────────────────────────────
// Stockés hors de la base, dans data/justificatifs/ (verrouillé par .htaccess), servis
// seulement aux comptes qui voient les dépenses du centre.
case 'justificatif/deposer': {
    g_exiger_post($methode);
    $ctx = g_exiger_session();
    $st = $pdo->prepare('SELECT * FROM g_depenses WHERE id = ? AND supprime = 0');
    $st->execute([(string) g_param('id', '')]);
    $d = $st->fetch();
    if (!$d) { g_fail('Dépense introuvable (pas encore synchronisée ?).', 404); }
    g_exiger($ctx, 'depenses.saisir', (string) $d['centre_id']);
    if ($d['statut'] === 'validee') { g_fail('Dépense validée : son justificatif ne change plus.', 409); }
    $bin = base64_decode((string) g_param('jpeg', ''), true);
    if ($bin === false || strlen($bin) < 1000 || strlen($bin) > 3 * 1024 * 1024 || substr($bin, 0, 3) !== "\xFF\xD8\xFF") {
        g_fail('Photo invalide (JPEG de 3 Mo au plus).', 422);
    }
    $dir = __DIR__ . '/data/justificatifs';
    if (!is_dir($dir)) { @mkdir($dir, 0700, true); }
    if (file_put_contents($dir . '/' . preg_replace('/[^a-zA-Z0-9-]/', '', (string) $d['id']) . '.jpg', $bin, LOCK_EX) === false) { g_fail('Écriture impossible sur le serveur.', 500); }
    $quand = g_now();
    $pdo->prepare('UPDATE g_depenses SET justificatif = ?, rev = ?, maj_par = ?, maj_le = ? WHERE id = ?')->execute([$quand, g_rev(), $ctx['uid'], $quand, $d['id']]);
    g_journal($ctx, 'justificatif_depose', 'g_depenses', (string) $d['id'], null, ['taille' => strlen($bin)], (string) $d['centre_id']);
    g_ok(['justificatif' => $quand]);
}

case 'justificatif/lire': {
    $ctx = g_exiger_session();
    $st = $pdo->prepare('SELECT id, centre_id, justificatif FROM g_depenses WHERE id = ?');
    $st->execute([(string) g_param('id', '')]);
    $d = $st->fetch();
    if (!$d || !$d['justificatif']) { g_fail('Aucun justificatif.', 404); }
    g_exiger($ctx, 'depenses.voir', (string) $d['centre_id']);
    $f = __DIR__ . '/data/justificatifs/' . preg_replace('/[^a-zA-Z0-9-]/', '', (string) $d['id']) . '.jpg';
    if (!is_file($f)) { g_fail('Fichier absent du serveur.', 404); }
    header('Content-Type: image/jpeg');
    header('Content-Length: ' . filesize($f));
    header('Cache-Control: private, max-age=86400');
    readfile($f);
    exit;
}

// ─────────────────────────────── Journal ───────────────────────────────
case 'journal': {
    $ctx = g_exiger_session();
    $centres = g_centres_avec($ctx, 'journal.voir');
    if (!$centres && !$ctx['admin']) { g_fail('Non autorisé.', 403); }
    $centre = (string) g_param('centre', '');
    $avant  = (string) g_param('avant', '');
    $limite = max(10, min(200, (int) g_param('limite', 50)));
    $where = []; $args = [];
    if ($centre !== '') {
        if (!in_array($centre, $centres, true)) { g_fail('Non autorisé pour ce centre.', 403); }
        $where[] = 'centre_id = ?'; $args[] = $centre;
    } elseif (!$ctx['admin']) {
        $where[] = 'centre_id IN (' . implode(',', array_fill(0, count($centres), '?')) . ')';
        $args = array_merge($args, $centres);
    }
    $avantId = (string) g_param('avant_id', '');
    if ($avant !== '' && $avantId !== '') { $where[] = '(le < ? OR (le = ? AND id < ?))'; array_push($args, $avant, $avant, $avantId); }
    elseif ($avant !== '') { $where[] = 'le < ?'; $args[] = $avant; }
    $sql = 'SELECT id, centre_id, identifiant, action, entite, entite_id, avant, apres, ip, le FROM g_journal'
         . ($where ? ' WHERE ' . implode(' AND ', $where) : '') . ' ORDER BY le DESC, id DESC LIMIT ' . $limite;
    $st = $pdo->prepare($sql);
    $st->execute($args);
    g_ok(['lignes' => $st->fetchAll()]);
}

// ─────────────────────────────── Synchronisation ───────────────────────────────
case 'sync/tirer': {
    $ctx = g_exiger_session();
    $debut = g_rev();
    // Recouvrement de 5 s : une écriture validée juste après notre lecture précédente,
    // mais horodatée juste avant, n'est pas perdue (le téléphone dédoublonne par id).
    $depuis = max(0, (int) g_param('depuis', 0) - 5000);
    $out = [];
    foreach (g_registre() as $nom => $r) {
        $where = 'rev > ?'; $args = [$depuis];
        if ($r['portee'] !== null && !$ctx['admin']) {
            $centres = $r['lire'] === 'tous' ? array_keys($ctx['acces']) : g_centres_avec($ctx, $r['lire']);
            $conds = [];
            if ($centres) {
                $conds[] = $r['portee'] . ' IN (' . implode(',', array_fill(0, count($centres), '?')) . ')';
                $args = array_merge($args, $centres);
            }
            // Le propriétaire lit ses propres lignes (un enseignant : son contrat, ses paies).
            if (!empty($r['proprio'])) { $conds[] = $r['proprio'] . ' = ?'; $args[] = $ctx['uid']; }
            if (!$conds) { continue; }
            $where .= ' AND (' . implode(' OR ', $conds) . ')';
        }
        $st = $pdo->prepare('SELECT * FROM ' . $r['table'] . ' WHERE ' . $where);
        $st->execute($args);
        $out[$nom] = $st->fetchAll();
        if ($nom === 'eleves' && !$ctx['admin']) {
            foreach ($out[$nom] as &$e) {
                if (!g_peut($ctx, 'paiements.voir', (string) $e['centre_id'])) {
                    foreach (['inscription_due', 'mensualite_due', 'remise_motif', 'relance_le'] as $c) { unset($e[$c]); }
                }
            }
            unset($e);
        }
    }
    // Équipe des centres visibles : de quoi choisir un enseignant hors ligne.
    // Noms, rôles et matières seulement — ni téléphone, ni identifiant.
    $centresEquipe = g_centres_avec($ctx, 'centre.voir');
    $equipe = [];
    if ($centresEquipe) {
        $st = $pdo->prepare('SELECT u.id, u.nom, u.matieres, a.centre_id, a.role FROM g_acces a JOIN g_utilisateurs u ON u.id = a.utilisateur_id
                              WHERE u.actif = 1 AND a.centre_id IN (' . implode(',', array_fill(0, count($centresEquipe), '?')) . ') ORDER BY u.nom');
        $st->execute($centresEquipe);
        $equipe = $st->fetchAll();
        // L'administrateur n'a pas de ligne d'accès : son NOM suffit (auteur d'un encaissement,
        // d'une dépense, d'une remise, trésorier). Rôle « admin ».
        // Rattaché à chaque centre déjà visible : l'équipe reste celle des centres du compte.
        foreach ($pdo->query('SELECT id, nom FROM g_utilisateurs WHERE admin_global = 1 AND actif = 1')->fetchAll() as $a) {
            foreach ($centresEquipe as $cidEq) {
                $equipe[] = ['id' => $a['id'], 'nom' => $a['nom'], 'matieres' => '', 'centre_id' => (string) $cidEq, 'role' => 'admin'];
            }
        }
    }
    g_ok(['rev' => $debut, 'lignes' => $out, 'equipe' => $equipe]);
}

case 'sync/pousser': {
    g_exiger_post($methode);
    $ctx = g_exiger_session();
    $ops = g_param('ops', []);
    if (!is_array($ops) || count($ops) > 500) { g_fail('Lot invalide (500 opérations au plus).', 422); }
    $registre = g_registre();
    $schema = g_schema();
    $resultats = [];
    foreach ($ops as $op) {
        $opId = is_array($op) ? (string) ($op['op'] ?? '') : '';
        try {
            if (!is_array($op) || !preg_match('/^[a-z0-9-]{8,40}$/', $opId)) { throw new DomainException('Opération sans identifiant valide.'); }
            // Clé propre au compte : un autre compte ne peut pas « consommer » cette opération.
            $cleOp = substr(hash('sha256', $ctx['uid'] . '|' . $opId), 0, 40);
            $st = $pdo->prepare('SELECT 1 FROM g_ops WHERE id = ?');
            $st->execute([$cleOp]);
            if ($st->fetchColumn()) { $resultats[] = ['op' => $opId, 'ok' => true, 'deja' => true]; continue; }

            $r = $registre[(string) ($op['t'] ?? '')] ?? null;
            if (!$r) { throw new DomainException('Table inconnue.'); }
            $id = (string) ($op['id'] ?? '');
            if (!preg_match('/^[a-z0-9-]{8,40}$/', $id)) { throw new DomainException('Identifiant de ligne invalide.'); }
            $types = $schema[$r['table']]['cols'];
            $champs = [];
            foreach ((array) ($op['champs'] ?? []) as $c => $v) {
                if (!in_array($c, $r['champs'], true)) { continue; }
                if ($v !== null && !is_scalar($v)) { throw new DomainException('Valeur invalide pour ' . $c . '.'); }
                $t = $types[$c];
                if ($t === 'ref' && $v !== null && $v !== '' && !preg_match('/^[a-z0-9-]{1,40}$/', (string) $v)) { throw new DomainException('Référence invalide pour ' . $c . '.'); }
                if ($t === 'int' || strncmp($t, 'int:', 4) === 0 || $t === 'bigint') { $champs[$c] = (int) $v; }
                elseif (strncmp($t, 'str:', 4) === 0) { $champs[$c] = $v === null ? null : mb_substr(trim((string) $v), 0, (int) substr($t, 4)); }
                else { $champs[$c] = $v === null ? null : (string) $v; }
            }
            $suppr = !empty($op['suppr']);

            $st = $pdo->prepare('SELECT * FROM ' . $r['table'] . ' WHERE id = ?');
            $st->execute([$id]);
            $existant = $st->fetch() ?: null;

            // Centre(s) concerné(s) : l'ancien ET le nouveau si la ligne change de centre.
            $centres = [];
            if ($r['portee'] === 'id') { $centres[] = $id; }
            elseif ($r['portee'] !== null) {
                if ($existant) { $centres[] = (string) $existant[$r['portee']]; }
                if (isset($champs[$r['portee']])) { $centres[] = (string) $champs[$r['portee']]; }
                if (!$centres) { throw new DomainException('Centre manquant.'); }
            }
            // Un refus ne vaut que pour CETTE opération : le reste du lot passe.
            if ($r['ecrire'] === 'admin' && !$ctx['admin']) { throw new DomainException('Réservé à l\'administrateur.'); }
            if ($r['ecrire'] !== 'admin') {
                foreach (array_unique($centres) as $cid) {
                    if (!g_peut($ctx, $r['ecrire'], $cid)) { throw new DomainException('Action non autorisée pour votre rôle dans ce centre.'); }
                }
            }

            $GLOBALS['g_ctx'] = $ctx;
            g_valider_ligne($pdo, $r['table'], $id, $existant, $champs, $suppr);

            $meta = ['rev' => g_rev(), 'maj_par' => $ctx['uid'], 'maj_le' => g_now()];
            $pdo->beginTransaction();
            if ($existant) {
                // Réécrire une ligne effacée la fait revivre (pointage refait, classe recréée…).
                $maj = $suppr ? ['supprime' => 1] + $meta : $champs + ['supprime' => 0] + $meta;
                $set = implode(', ', array_map(fn($c) => $c . ' = ?', array_keys($maj)));
                $pdo->prepare('UPDATE ' . $r['table'] . ' SET ' . $set . ' WHERE id = ?')->execute([...array_values($maj), $id]);
            } elseif (!$suppr) {
                if ($r['table'] === 'g_eleves') { $champs = g_completer_eleve($pdo, $champs); }
                if ($r['table'] === 'g_paiements') { $champs = g_completer_paiement($pdo, $champs, $ctx); }
                if ($r['table'] === 'g_depenses') { $champs['saisie_par'] = $ctx['uid']; }
                $ins = ['id' => $id] + $champs + $meta;
                $pdo->prepare('INSERT INTO ' . $r['table'] . ' (' . implode(', ', array_keys($ins)) . ') VALUES ('
                    . implode(',', array_fill(0, count($ins), '?')) . ')')->execute(array_values($ins));
            }
            $pdo->prepare('INSERT INTO g_ops (id, utilisateur_id, recu_le) VALUES (?,?,?)')->execute([$cleOp, $ctx['uid'], g_now()]);
            $pdo->commit();

            // Journal : seulement les champs réellement changés.
            $avantDiff = []; $apresDiff = [];
            foreach ($champs as $c => $v) {
                if (!$existant || (string) $existant[$c] !== (string) $v) { $avantDiff[$c] = $existant[$c] ?? null; $apresDiff[$c] = $v; }
            }
            $action = $suppr ? 'suppression' : ($existant ? 'modification' : 'creation');
            if ($suppr || $apresDiff) {
                g_journal($ctx, $action, $r['table'], $id, $existant ? ($suppr ? $existant : $avantDiff) : null,
                          $suppr ? null : $apresDiff, $centres[count($centres) - 1] ?? null);
            }
            $resultats[] = ['op' => $opId, 'ok' => true];
        } catch (DomainException $e) {
            if ($pdo->inTransaction()) { $pdo->rollBack(); }
            $resultats[] = ['op' => $opId, 'ok' => false, 'erreur' => $e->getMessage()];
        } catch (Throwable $e) {
            // Erreur technique (contrainte, type…) : refusée pour CETTE opération, le lot continue ;
            // sinon le téléphone renverrait indéfiniment le même lot.
            if ($pdo->inTransaction()) { $pdo->rollBack(); }
            error_log('[gestion][pousser] ' . $e->getMessage());
            $doublon = $e instanceof PDOException && (string) $e->getCode() === '23000';
            $resultats[] = ['op' => $opId, 'ok' => false, 'erreur' => $doublon ? 'Doublon : cette valeur existe déjà (numéro de reçu ?).' : 'Erreur serveur sur cette opération.'];
        }
    }
    g_ok(['resultats' => $resultats]);
}

default:
    g_fail('Route inconnue.', 404);
}

/**
 * Règles de l'appel.
 *  - Feuille : classe du centre, date et heures valides, statut ouverte|close.
 *  - Présence : feuille et élève du même centre ; un seul pointage par élève et
 *    par feuille ; retard calculé ici (arrivée − début, tolérance du centre).
 *  - Un enseignant ne pointe que les classes où il a cours ce jour-là.
 *  - Au-delà de 2 jours, seul un responsable (ou l'admin) peut corriger ; les
 *    autres peuvent encore JUSTIFIER une absence (le justificatif arrive tard).
 */
function g_valider_appel(PDO $pdo, string $table, string $id, ?array $existant, array &$champs): void {
    $ctx = $GLOBALS['g_ctx'] ?? null;
    $val = fn(string $c) => array_key_exists($c, $champs) ? $champs[$c] : ($existant[$c] ?? null);
    $centre = (string) $val('centre_id');
    $heure = '/^([01]\d|2[0-3]):[0-5]\d$/';

    if ($table === 'g_seances') {
        $date = (string) $val('date');
        $classe = (string) $val('classe_id');
    } else {
        $st = $pdo->prepare('SELECT * FROM g_seances WHERE id = ? AND supprime = 0');
        $st->execute([(string) $val('seance_id')]);
        $seance = $st->fetch();
        if (!$seance || (string) $seance['centre_id'] !== $centre) { throw new DomainException('Feuille d\'appel introuvable dans ce centre.'); }
        $date = (string) $seance['date'];
        $classe = (string) $seance['classe_id'];
        $champs['date'] = $date;
    }
    if (!preg_match('/^\d{4}-\d{2}-\d{2}$/', $date)) { throw new DomainException('Date invalide.'); }
    if ($table === 'g_presences' && (string) $val('notifie') !== '' && !preg_match('/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2} (whatsapp|sms)$/', (string) $val('notifie'))) {
        throw new DomainException('Trace de message invalide.');
    }
    if ($date > date('Y-m-d')) { throw new DomainException('On ne fait pas l\'appel d\'un jour à venir.'); }

    $role = $ctx && !$ctx['admin'] ? ($ctx['acces'][$centre] ?? '') : 'admin';
    // L'enseignant fait l'appel de toute classe de SON centre (le centre est vérifié plus bas et
    // par la portée du registre), dans la même limite de 2 jours que les autres ; même sans
    // emploi du temps rempli. Demande de Jacques (04/11/2026).
    $ancien = $date < date('Y-m-d', strtotime('-2 days'));
    $correcteur = g_ctx_peut('appel.corriger', $centre);

    if ($table === 'g_seances') {
        $st = $pdo->prepare('SELECT COUNT(*) FROM g_classes WHERE id = ? AND centre_id = ? AND supprime = 0');
        $st->execute([$classe, $centre]);
        if (!(int) $st->fetchColumn()) { throw new DomainException('Classe inconnue dans ce centre.'); }
        if (!preg_match($heure, (string) $val('debut')) || !preg_match($heure, (string) $val('fin')) || $val('debut') >= $val('fin')) {
            throw new DomainException('Heures de la feuille invalides.');
        }
        if (!in_array((string) ($val('statut') ?: 'ouverte'), ['ouverte', 'close'], true)) { throw new DomainException('Statut de feuille inconnu.'); }
        if ($ancien && !$correcteur) { throw new DomainException('Feuille de plus de 2 jours : seul un responsable peut la modifier.'); }
        return;
    }

    // ── Présence ──
    $statut = (string) $val('statut');
    if (!in_array($statut, ['present', 'retard', 'absent', 'justifie'], true)) { throw new DomainException('Statut de présence inconnu.'); }
    foreach (['arrivee', 'depart'] as $c) {
        if ((string) $val($c) !== '' && !preg_match($heure, (string) $val($c))) { throw new DomainException('Heure invalide (HH:MM).'); }
    }
    if ((string) $val('arrivee') !== '' && (string) $val('depart') !== '' && $val('depart') < $val('arrivee')) {
        throw new DomainException('Le départ ne peut pas précéder l\'arrivée.');
    }
    $st = $pdo->prepare('SELECT COUNT(*) FROM g_eleves WHERE id = ? AND centre_id = ? AND supprime = 0');
    $st->execute([(string) $val('eleve_id'), $centre]);
    if (!(int) $st->fetchColumn()) { throw new DomainException('Élève inconnu dans ce centre.'); }
    if (!$existant) {
        $st = $pdo->prepare('SELECT COUNT(*) FROM g_presences WHERE seance_id = ? AND eleve_id = ? AND supprime = 0');
        $st->execute([(string) $val('seance_id'), (string) $val('eleve_id')]);
        if ((int) $st->fetchColumn()) { throw new DomainException('Cet élève est déjà pointé sur cette feuille.'); }
    }
    if ($ancien && !$correcteur) {
        $justification = $existant && $existant['statut'] === 'absent' && $statut === 'justifie'
            && !array_diff(array_keys($champs), ['statut', 'motif', 'date', 'centre_id', 'seance_id', 'eleve_id', 'notifie']);
        $simpleTrace = $existant && !array_diff(array_keys($champs), ['notifie', 'statut', 'date', 'centre_id', 'seance_id', 'eleve_id'])
            && (!array_key_exists('statut', $champs) || $champs['statut'] === $existant['statut']);
        if (!$justification && !$simpleTrace) { throw new DomainException('Appel de plus de 2 jours : seul un responsable peut le corriger (vous pouvez justifier une absence).'); }
    }
    // Retard : calculé ici, jamais cru sur parole.
    if (in_array($statut, ['present', 'retard'], true)) {
        $arrivee = (string) $val('arrivee');
        if ($arrivee === '') { $arrivee = (string) $seance['debut']; $champs['arrivee'] = $arrivee; }
        $st = $pdo->prepare('SELECT tolerance_retard_min FROM g_centres WHERE id = ?');
        $st->execute([$centre]);
        $tol = (int) $st->fetchColumn();
        [$ha, $ma] = array_map('intval', explode(':', $arrivee));
        [$hd, $md] = array_map('intval', explode(':', (string) $seance['debut']));
        $retard = max(0, ($ha * 60 + $ma) - ($hd * 60 + $md));
        $champs['statut'] = $retard > $tol ? 'retard' : 'present';
        $champs['retard_min'] = $champs['statut'] === 'retard' ? $retard : 0;
    } else {
        $champs['retard_min'] = 0;
        if (!array_key_exists('arrivee', $champs) || $statut === 'absent') { $champs['arrivee'] = ''; $champs['depart'] = ''; }
    }
}

/**
 * Finances.
 *  Paiement : création seulement (montant > 0, élève du centre, date ≤ aujourd'hui,
 *  au plus 2 jours en arrière sauf responsable) ; ensuite une seule écriture
 *  possible : l'ANNULATION motivée par un responsable — ou la trace d'envoi du reçu.
 *  Dépense : « en attente » à la saisie ; validée ou refusée par un responsable
 *  (jamais sa propre dépense) ou l'admin ; figée une fois validée.
 */
function g_valider_finances(PDO $pdo, string $table, string $id, ?array $existant, array &$champs): void {
    $ctx = $GLOBALS['g_ctx'] ?? null;
    $val = fn(string $c) => array_key_exists($c, $champs) ? $champs[$c] : ($existant[$c] ?? null);
    $centre = (string) $val('centre_id');
    $role = $ctx && !$ctx['admin'] ? ($ctx['acces'][$centre] ?? '') : 'admin';
    $correcteur = g_ctx_peut('caisse.corriger', $centre);
    $modes = ['especes', 'momo', 'om', 'virement', 'autre'];

    if ($table === 'g_paiements') {
        if ($existant) {
            $cles = array_keys($champs);
            if ($cles && !array_diff($cles, ['envoye_le'])) {
                if (!preg_match('/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2} (whatsapp|sms|partage)$/', (string) $champs['envoye_le'])) { throw new DomainException('Trace d\'envoi invalide.'); }
                return;
            }
            if (array_diff($cles, ['annule', 'motif_annulation']) || (int) ($champs['annule'] ?? 0) !== 1) {
                throw new DomainException('Un versement ne se modifie pas : annulez-le (avec un motif) et saisissez-le à nouveau.');
            }
            if ((int) $existant['annule'] === 1) { throw new DomainException('Versement déjà annulé.'); }
            if (!$correcteur) { throw new DomainException('Seul un responsable peut annuler un versement.'); }
            if (mb_strlen(trim((string) ($champs['motif_annulation'] ?? ''))) < 5) { throw new DomainException('Indiquez le motif de l\'annulation.'); }
            $champs['annule_par'] = $ctx['uid'] ?? null;
            return;
        }
        $montant = (int) $val('montant');
        if ($montant <= 0 || $montant > 10000000) { throw new DomainException('Montant invalide.'); }
        if (!in_array((string) $val('mode'), $modes, true)) { throw new DomainException('Mode de paiement inconnu.'); }
        $date = (string) $val('date');
        if (!preg_match('/^\d{4}-\d{2}-\d{2}$/', $date) || $date > date('Y-m-d')) { throw new DomainException('Date de versement invalide.'); }
        if ($date < date('Y-m-d', strtotime('-2 days')) && !$correcteur) { throw new DomainException('Versement de plus de 2 jours : seul un responsable peut le saisir.'); }
        $st = $pdo->prepare('SELECT COUNT(*) FROM g_eleves WHERE id = ? AND centre_id = ? AND supprime = 0');
        $st->execute([(string) $val('eleve_id'), $centre]);
        if (!(int) $st->fetchColumn()) { throw new DomainException('Élève inconnu dans ce centre.'); }
        if ((int) ($champs['annule'] ?? 0)) { throw new DomainException('Un versement naît valide.'); }
        unset($champs['annule'], $champs['motif_annulation'], $champs['envoye_le']);
        return;
    }

    // ── Dépense ──
    $montant = (int) $val('montant');
    if ($montant <= 0 || $montant > 50000000) { throw new DomainException('Montant invalide.'); }
    if (trim((string) $val('libelle')) === '') { throw new DomainException('Libellé obligatoire.'); }
    if (!in_array((string) $val('categorie'), ['loyer', 'salaires', 'fournitures', 'electricite', 'transport', 'communication', 'autre'], true)) { throw new DomainException('Catégorie inconnue.'); }
    if (!in_array((string) ($val('mode') ?: 'especes'), $modes, true)) { throw new DomainException('Mode de paiement inconnu.'); }
    if (!preg_match('/^\d{4}-\d{2}-\d{2}$/', (string) $val('date')) || $val('date') > date('Y-m-d')) { throw new DomainException('Date invalide.'); }
    $statut = (string) ($val('statut') ?: 'en_attente');
    if (!in_array($statut, ['en_attente', 'validee', 'refusee'], true)) { throw new DomainException('Statut inconnu.'); }
    $avant = $existant ? (string) $existant['statut'] : '';
    if ($avant === 'validee') { throw new DomainException('Dépense validée : elle ne se modifie plus.'); }
    if ($statut !== 'en_attente' && $statut !== $avant) {
        $auteur = $existant ? (string) $existant['saisie_par'] : (string) ($ctx['uid'] ?? '');
        if ($role !== 'admin' && !(g_ctx_peut('depenses.valider', $centre) && $auteur !== ($ctx['uid'] ?? ''))) {
            throw new DomainException('La validation revient à un responsable (pas l\'auteur de la dépense) ou à l\'administrateur.');
        }
        if ($statut === 'refusee' && trim((string) $val('motif_refus')) === '') { throw new DomainException('Indiquez le motif du refus.'); }
        if ($statut === 'validee' && $montant >= G_SEUIL_JUSTIFICATIF && empty($existant['justificatif'])) {
            throw new DomainException('Justificatif obligatoire à partir de ' . number_format(G_SEUIL_JUSTIFICATIF, 0, ',', ' ') . ' F : ajoutez la photo avant de valider.');
        }
        $champs['valide_par'] = $ctx['uid'] ?? null;
        $champs['valide_le'] = g_now();
    }
    $champs['statut'] = $statut;
}

/** Nouveau versement : numéro de reçu « AAAA-NNNN » par centre, encaissé par l'auteur. Appelé DANS la transaction. */
/** Verrou d'écriture sur la ligne du centre (MySQL) : sérialise les numérotations concurrentes. */
function g_verrou_centre(PDO $pdo, string $centre): void {
    if ($pdo->getAttribute(PDO::ATTR_DRIVER_NAME) === 'mysql') {
        $pdo->prepare('SELECT id FROM g_centres WHERE id = ? FOR UPDATE')->execute([$centre]);
    }
}

function g_completer_paiement(PDO $pdo, array $champs, array $ctx): array {
    g_verrou_centre($pdo, (string) $champs['centre_id']);
    $propose = (string) ($champs['numero'] ?? '');
    if ($propose !== '') {
        // Numéro pris par le téléphone dans SA tranche : il doit lui appartenir et n'avoir jamais servi.
        if (!preg_match('/^(\d{4})-(\d{4})$/', $propose, $m)) { throw new DomainException('Numéro de reçu invalide.'); }
        $st = $pdo->prepare('SELECT COUNT(*) FROM g_tranches WHERE centre_id = ? AND utilisateur_id = ? AND prefixe = ? AND debut <= ? AND fin >= ?');
        $st->execute([(string) $champs['centre_id'], $ctx['uid'], $m[1], (int) $m[2], (int) $m[2]]);
        if (!(int) $st->fetchColumn()) { throw new DomainException('Ce numéro de reçu n\'appartient pas à vos tranches.'); }
        $st = $pdo->prepare('SELECT COUNT(*) FROM g_paiements WHERE centre_id = ? AND numero = ?');
        $st->execute([(string) $champs['centre_id'], $propose]);
        if ((int) $st->fetchColumn()) { throw new DomainException('Numéro de reçu déjà utilisé.'); }
        $champs['encaisse_par'] = $ctx['uid'];
        $champs['annule'] = 0;
        return $champs;
    }
    $prefixe = g_prefixe_annee($pdo);
    $st = $pdo->prepare('SELECT numero FROM g_paiements WHERE centre_id = ? AND numero LIKE ?');
    $st->execute([(string) $champs['centre_id'], $prefixe . '-%']);
    $max = 0;
    foreach ($st->fetchAll(PDO::FETCH_COLUMN) as $n) { $max = max($max, (int) substr((string) $n, 5)); }
    $max = max($max, g_max_tranche($pdo, (string) $champs['centre_id'], $prefixe));
    if ($max >= 9999) { throw new DomainException('Plus de numéros de reçu disponibles cette année.'); }
    $champs['numero'] = $prefixe . '-' . str_pad((string) ($max + 1), 4, '0', STR_PAD_LEFT);
    $champs['encaisse_par'] = $ctx['uid'];
    $champs['annule'] = 0;
    return $champs;
}

function g_max_tranche(PDO $pdo, string $centre, string $prefixe): int {
    $st = $pdo->prepare('SELECT COALESCE(MAX(fin), 0) FROM g_tranches WHERE centre_id = ? AND prefixe = ?');
    $st->execute([$centre, $prefixe]);
    return (int) $st->fetchColumn();
}

/** Préfixe des numéros (reçus, matricules) : « 2627 » pour l'année 2026-2027. */
function g_prefixe_annee(PDO $pdo): string {
    $libelle = (string) ($pdo->query("SELECT libelle FROM g_annees WHERE active = 1 AND supprime = 0 ORDER BY debut DESC LIMIT 1")->fetchColumn() ?: '');
    return preg_match('/^\d{2}(\d{2})-\d{2}(\d{2})$/', $libelle, $m) ? $m[1] . $m[2] : date('y') . date('y', strtotime('+1 year'));
}

/**
 * Enseignants.
 *  Contrat : mode heure|seance|forfait, taux ≥ 0 ; un seul contrat actif par enseignant et centre.
 *  Présence : créneau du centre, jour de la semaine conforme, pas de date future ; l'enseignant
 *  ne se pointe pas lui-même ; un remplaçant doit être enseignant du centre ; retard et minutes
 *  recalculés ; au-delà de 2 jours, responsable seulement.
 *  Paie : création, puis seulement l'annulation motivée (responsable).
 */
function g_valider_enseignants(PDO $pdo, string $table, string $id, ?array $existant, array &$champs): void {
    $ctx = $GLOBALS['g_ctx'] ?? null;
    $val = fn(string $c) => array_key_exists($c, $champs) ? $champs[$c] : ($existant[$c] ?? null);
    $centre = (string) $val('centre_id');
    $role = $ctx && !$ctx['admin'] ? ($ctx['acces'][$centre] ?? '') : 'admin';
    $correcteur = g_ctx_peut('appel.corriger', $centre);
    $estEnseignant = function (string $uid) use ($pdo, $centre): bool {
        $st = $pdo->prepare("SELECT COUNT(*) FROM g_acces WHERE utilisateur_id = ? AND centre_id = ? AND role = 'enseignant'");
        $st->execute([$uid, $centre]);
        return (int) $st->fetchColumn() > 0;
    };

    if ($table === 'g_contrats') {
        if (!$estEnseignant((string) $val('utilisateur_id'))) { throw new DomainException('Cette personne n\'est pas enseignant dans ce centre.'); }
        if (!in_array((string) $val('mode'), ['heure', 'seance', 'forfait'], true)) { throw new DomainException('Mode de rémunération inconnu.'); }
        if ((int) $val('taux') < 0 || (int) $val('taux') > 5000000 || (int) $val('retenue_absence') < 0) { throw new DomainException('Montant invalide.'); }
        if ((int) ($val('actif') ?? 1)) {
            $st = $pdo->prepare('SELECT COUNT(*) FROM g_contrats WHERE centre_id = ? AND utilisateur_id = ? AND actif = 1 AND supprime = 0 AND id <> ?');
            $st->execute([$centre, (string) $val('utilisateur_id'), $id]);
            if ((int) $st->fetchColumn()) { throw new DomainException('Cet enseignant a déjà un contrat actif dans ce centre.'); }
        }
        return;
    }

    if ($table === 'g_paies') {
        $gerant = g_ctx_peut('enseignants.gerer', $centre);
        if ($existant) {
            if (array_diff(array_keys($champs), ['annule', 'motif_annulation']) || (int) ($champs['annule'] ?? 0) !== 1) { throw new DomainException('Une paie ne se modifie pas : annulez-la et saisissez-la à nouveau.'); }
            if ((int) $existant['annule']) { throw new DomainException('Paie déjà annulée.'); }
            // Le responsable annule ; celui qui a payé un cours peut corriger son erreur le jour même.
            $auteurDuJour = (string) $existant['paye_par'] === (string) ($ctx['uid'] ?? '') && (string) $existant['date'] === date('Y-m-d');
            if (!$gerant && !$auteurDuJour) { throw new DomainException('Seul un responsable annule une paie.'); }
            if (mb_strlen(trim((string) ($champs['motif_annulation'] ?? ''))) < 5) { throw new DomainException('Indiquez le motif de l\'annulation.'); }
            return;
        }
        if ((string) $val('presence_id') !== '') {
            g_valider_paie_cours($pdo, $centre, $champs, $val);
            $champs['paye_par'] = $ctx['uid'] ?? null;
            $champs['annule'] = 0;
            unset($champs['motif_annulation']);
            return;
        }
        if (!$gerant) { throw new DomainException('La paie du mois revient au responsable ; après un cours, utilisez « Payer » dans l\'appel.'); }
        if (!$estEnseignant((string) $val('enseignant_id'))) { throw new DomainException('Cette personne n\'est pas enseignant dans ce centre.'); }
        if (!preg_match('/^\d{4}-\d{2}$/', (string) $val('mois'))) { throw new DomainException('Mois invalide.'); }
        if ((int) $val('montant') <= 0 || (int) $val('montant') > 10000000) { throw new DomainException('Montant invalide.'); }
        if (!in_array((string) $val('mode'), ['especes', 'momo', 'om', 'virement', 'autre'], true)) { throw new DomainException('Mode de paiement inconnu.'); }
        if (!preg_match('/^\d{4}-\d{2}-\d{2}$/', (string) $val('date')) || $val('date') > date('Y-m-d')) { throw new DomainException('Date invalide.'); }
        $champs['paye_par'] = $ctx['uid'] ?? null;
        $champs['annule'] = 0;
        unset($champs['motif_annulation']);
        return;
    }

    // ── Présence d'un enseignant ──
    if ($role === 'enseignant') { throw new DomainException('La présence d\'un enseignant est pointée par le centre, pas par lui-même.'); }
    $st = $pdo->prepare('SELECT * FROM g_creneaux WHERE id = ? AND centre_id = ? AND supprime = 0');
    $st->execute([(string) $val('creneau_id'), $centre]);
    $cr = $st->fetch();
    if (!$cr) { throw new DomainException('Créneau introuvable dans ce centre.'); }
    $date = (string) $val('date');
    if (!preg_match('/^\d{4}-\d{2}-\d{2}$/', $date) || $date > date('Y-m-d')) { throw new DomainException('Date invalide.'); }
    if ((int) date('N', strtotime($date)) !== (int) $cr['jour']) { throw new DomainException('Ce créneau n\'a pas lieu ce jour-là.'); }
    if ($date < date('Y-m-d', strtotime('-2 days')) && !$correcteur) { throw new DomainException('Pointage de plus de 2 jours : seul un responsable peut le corriger.'); }
    $statut = (string) $val('statut');
    if (!in_array($statut, ['present', 'retard', 'absent', 'remplace'], true)) { throw new DomainException('Statut inconnu.'); }
    $champs['enseignant_id'] = (string) $cr['enseignant_id'];
    if ($statut === 'remplace') {
        $remp = (string) $val('remplacant_id');
        if ($remp === '' || $remp === (string) $cr['enseignant_id'] || !$estEnseignant($remp)) { throw new DomainException('Choisissez un remplaçant parmi les enseignants du centre.'); }
    } else {
        $champs['remplacant_id'] = '';
    }
    $heure = '/^([01]\d|2[0-3]):[0-5]\d$/';
    foreach (['arrivee', 'depart'] as $c) {
        if ((string) $val($c) !== '' && !preg_match($heure, (string) $val($c))) { throw new DomainException('Heure invalide (HH:MM).'); }
    }
    $mn = fn(string $h) => ((int) substr($h, 0, 2)) * 60 + (int) substr($h, 3, 2);
    if ($statut === 'absent') {
        $champs['arrivee'] = ''; $champs['depart'] = ''; $champs['retard_min'] = 0; $champs['minutes'] = 0;
        return;
    }
    $arrivee = (string) $val('arrivee') ?: (string) $cr['debut'];
    $depart = (string) $val('depart');
    if ($depart !== '' && $depart < $arrivee) { throw new DomainException('Le départ ne peut pas précéder l\'arrivée.'); }
    $st = $pdo->prepare('SELECT tolerance_retard_min FROM g_centres WHERE id = ?');
    $st->execute([$centre]);
    $tol = (int) $st->fetchColumn();
    $retard = max(0, $mn($arrivee) - $mn((string) $cr['debut']));
    $champs['arrivee'] = $arrivee;
    $champs['retard_min'] = $retard > $tol ? $retard : 0;
    if ($statut !== 'remplace') { $champs['statut'] = $retard > $tol ? 'retard' : 'present'; }
    // Durée faite : de l'arrivée (au plus tôt le début) au départ (sinon la fin prévue).
    $fin = $depart !== '' ? $depart : (string) $cr['fin'];
    $champs['minutes'] = max(0, $mn($fin) - max($mn($arrivee), $mn((string) $cr['debut'])));
}

/**
 * Nouvel élève : matricule « AAAA-NNNN » (année scolaire en cours, séquence par
 * centre), date d'inscription et statut par défaut. Appelé DANS la transaction.
 */
function g_completer_eleve(PDO $pdo, array $champs): array {
    $prefixe = g_prefixe_annee($pdo);
    $st = $pdo->prepare('SELECT matricule FROM g_eleves WHERE centre_id = ? AND matricule LIKE ?');
    $st->execute([(string) $champs['centre_id'], $prefixe . '-%']);
    $max = 0;
    foreach ($st->fetchAll(PDO::FETCH_COLUMN) as $mat) { $max = max($max, (int) substr((string) $mat, 5)); }
    $champs['matricule'] = $prefixe . '-' . str_pad((string) ($max + 1), 4, '0', STR_PAD_LEFT);
    if (empty($champs['date_inscription'])) { $champs['date_inscription'] = date('Y-m-d'); }
    if (empty($champs['statut'])) { $champs['statut'] = 'actif'; }
    return $champs;
}

/**
 * Règles métier vérifiées côté serveur avant toute écriture synchronisée.
 * Lève DomainException : l'opération est refusée, le téléphone affiche pourquoi.
 */
function g_valider_ligne(PDO $pdo, string $table, string $id, ?array $existant, array &$champs, bool $suppr): void {
    // Mois clôturé : plus rien n'y entre ni n'en sort (versements, dépenses, paies, remises).
    // Seule exception : le trésorier tranche encore une remise du mois (reçu / pas reçu).
    if (in_array($table, ['g_paiements', 'g_depenses', 'g_paies', 'g_remises'], true)) {
        $centreL = (string) ($champs['centre_id'] ?? ($existant['centre_id'] ?? ''));
        $seulementTrancher = $table === 'g_remises' && $existant && !$suppr && !array_diff(array_keys($champs), ['statut', 'motif']);
        if (!$seulementTrancher) {
            foreach ([$existant['date'] ?? null, $champs['date'] ?? null] as $d) {
                if ($d && ($m = g_mois_clos($pdo, $centreL, (string) $d))) {
                    throw new DomainException('Le mois de ' . $m . ' est clôturé (comptes et partage faits) : rien ne peut plus y être enregistré ni modifié.');
                }
            }
        }
    }
    if ($table === 'g_clotures') { g_valider_cloture($pdo, $id, $existant, $champs, $suppr); return; }
    if ($suppr) {
        // Effacer un pointage ou une feuille d'appel : responsable ou admin seulement
        // (sinon une absence gênante disparaîtrait sans laisser de correction motivée).
        if ($table === 'g_paiements') { throw new DomainException('Un versement ne se supprime pas : annulez-le avec un motif.'); }
        if ($table === 'g_paies') { throw new DomainException('Une paie ne se supprime pas : annulez-la avec un motif.'); }
        if ($table === 'g_presences_ens') {
            $ctx = $GLOBALS['g_ctx'] ?? null;
            $role = $ctx && !$ctx['admin'] ? ($ctx['acces'][(string) ($existant['centre_id'] ?? '')] ?? '') : 'admin';
            if (!g_ctx_peut('appel.corriger', (string) ($existant['centre_id'] ?? ''))) { throw new DomainException('Seul un responsable peut effacer un pointage d\'enseignant.'); }
        }
        if ($table === 'g_depenses' && ($existant['statut'] ?? '') !== 'en_attente') { throw new DomainException('Seule une dépense en attente peut être retirée.'); }
        if (in_array($table, ['g_messages', 'g_sondages', 'g_taches'], true)) {
            $ctx = $GLOBALS['g_ctx'] ?? [];
            if (empty($ctx['admin']) && (string) ($existant['auteur'] ?? '') !== (string) ($ctx['uid'] ?? '')) { throw new DomainException('Seul son auteur peut le supprimer.'); }
        }
        if ($table === 'g_dispos') { throw new DomainException('Une disponibilité se modifie, elle ne se supprime pas.'); }
        if ($table === 'g_remises') {
            $ctx = $GLOBALS['g_ctx'] ?? [];
            if (($existant['statut'] ?? '') !== 'en_attente') { throw new DomainException('Une remise confirmée ou contestée ne se retire pas.'); }
            if (empty($ctx['admin']) && (string) ($existant['remis_par'] ?? '') !== (string) ($ctx['uid'] ?? '')) { throw new DomainException('Seul l\'auteur de la remise peut la retirer.'); }
        }
        if ($table === 'g_seances' || $table === 'g_presences') {
            $ctx = $GLOBALS['g_ctx'] ?? null;
            $role = $ctx && !$ctx['admin'] ? ($ctx['acces'][(string) ($existant['centre_id'] ?? '')] ?? '') : 'admin';
            if (!g_ctx_peut('appel.corriger', (string) ($existant['centre_id'] ?? ''))) { throw new DomainException('Seul un responsable peut supprimer un appel.'); }
        }
        return;
    }
    $val = fn(string $c) => array_key_exists($c, $champs) ? $champs[$c] : ($existant[$c] ?? null);
    if ($table === 'g_centres' && trim((string) $val('nom')) === '') { throw new DomainException('Le nom du centre est obligatoire.'); }
    if ($table === 'g_centres') {
        $j = (int) $val('jour_echeance');
        if ($j < 1 || $j > 28) { throw new DomainException('Jour d\'échéance : entre 1 et 28.'); }
    }
    if ($table === 'g_centres' && array_key_exists('tresorier_id', $champs) && (string) $champs['tresorier_id'] !== '') {
        $st = $pdo->prepare('SELECT COUNT(*) FROM g_acces a JOIN g_utilisateurs u ON u.id = a.utilisateur_id WHERE a.utilisateur_id = ? AND a.centre_id = ? AND u.actif = 1');
        $st->execute([(string) $champs['tresorier_id'], $id]);
        $admin = $pdo->prepare('SELECT COUNT(*) FROM g_utilisateurs WHERE id = ? AND admin_global = 1 AND actif = 1');
        $admin->execute([(string) $champs['tresorier_id']]);
        if (!(int) $st->fetchColumn() && !(int) $admin->fetchColumn()) { throw new DomainException('Le trésorier doit avoir un compte actif dans ce centre.'); }
    }
    if ($table === 'g_remises') { g_valider_remise($pdo, $existant, $champs); return; }
    if (in_array($table, ['g_messages', 'g_sondages', 'g_dispos', 'g_taches'], true)) { g_valider_equipe($pdo, $table, $existant, $champs); return; }
    if ($table === 'g_evenements') {
        if (trim((string) $val('titre')) === '') { throw new DomainException('Donnez un titre au rendez-vous.'); }
        if (!preg_match('/^\d{4}-\d{2}-\d{2}$/', (string) $val('date'))) { throw new DomainException('Date du rendez-vous invalide.'); }
        foreach (['heure', 'fin'] as $c) {
            $h = (string) $val($c);
            if ($h !== '' && !preg_match('/^([01]\d|2[0-3]):[0-5]\d$/', $h)) { throw new DomainException('Heure invalide (HH:MM).'); }
        }
        if (!in_array((string) ($val('type') ?: 'rencontre'), ['rencontre', 'rendez_vous', 'reunion_parents', 'echeance', 'autre'], true)) { throw new DomainException('Type de rendez-vous inconnu.'); }
        $r = (int) $val('rappel_min');
        if ($r < 0 || $r > 20160) { throw new DomainException('Rappel : entre 0 et 14 jours.'); }
    }
    if ($table === 'g_annees' && !preg_match('/^\d{4}-\d{4}$/', (string) $val('libelle'))) {
        throw new DomainException('Année : format 2026-2027.');
    }
    if ($table === 'g_eleves') {
        if (trim((string) $val('nom')) === '') { throw new DomainException('Le nom de l\'élève est obligatoire.'); }
        foreach (['parent_tel', 'parent_whatsapp', 'parent2_tel', 'tel_eleve'] as $c) {
            if (!array_key_exists($c, $champs)) { continue; }
            $t = g_tel($champs[$c]);
            if ($t === null) { throw new DomainException('Téléphone invalide (' . $champs[$c] . ') : 9 chiffres, ex. 697 63 77 39.'); }
            $champs[$c] = $t;
        }
        if (!in_array((string) $val('sexe'), ['', 'F', 'M'], true)) { throw new DomainException('Sexe : F ou M.'); }
        // Tarif particulier : une remise est une décision du responsable. La secrétaire peut
        // seulement choisir l'option d'inscription prévue par le centre (ex. 4 000 F avec le cahier).
        foreach (['inscription_due', 'mensualite_due'] as $c) {
            if (!array_key_exists($c, $champs) || (int) $champs[$c] === (int) ($existant[$c] ?? 0)) { continue; }
            $v = (int) $champs[$c];
            if ($v < 0 || $v > 1000000) { throw new DomainException('Tarif particulier invalide.'); }
            $ctx = $GLOBALS['g_ctx'] ?? null;
            $role = $ctx && !$ctx['admin'] ? ($ctx['acces'][(string) $val('centre_id')] ?? '') : 'admin';
            if (g_ctx_peut('remises.accorder', (string) $val('centre_id')) || $v === 0) { continue; }
            $st = $pdo->prepare('SELECT inscription_option FROM g_centres WHERE id = ?');
            $st->execute([(string) $val('centre_id')]);
            $option = (int) $st->fetchColumn();
            if (!($c === 'inscription_due' && $option > 0 && $v === $option)) {
                throw new DomainException('Une remise ou un tarif particulier se décide par le responsable.');
            }
        }
        if ((string) ($champs['relance_le'] ?? '') !== '' && !preg_match('/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2} (whatsapp|sms)$/', (string) $champs['relance_le'])) {
            throw new DomainException('Trace de relance invalide.');
        }
        if (!in_array((string) ($val('statut') ?: 'actif'), ['actif', 'suspendu', 'parti'], true)) { throw new DomainException('Statut inconnu.'); }
        $centre = (string) $val('centre_id');
        if ((string) $val('classe_id') !== '') {
            $st = $pdo->prepare('SELECT COUNT(*) FROM g_classes WHERE id = ? AND centre_id = ? AND supprime = 0');
            $st->execute([(string) $val('classe_id'), $centre]);
            if (!(int) $st->fetchColumn()) { throw new DomainException('Classe inconnue dans ce centre.'); }
        }
        foreach (['date_naissance', 'date_inscription'] as $c) {
            if ((string) $val($c) !== '' && !preg_match('/^\d{4}-\d{2}-\d{2}$/', (string) $val($c))) { throw new DomainException('Date invalide.'); }
        }
        // Doublon : même nom complet (accents, casse et ordre des mots ignorés) dans le centre,
        // sauf homonyme confirmé. (Un même élève figurait deux fois sur un cahier papier.)
        $nomChange = !$existant || array_key_exists('nom', $champs) || array_key_exists('prenoms', $champs);
        if ($nomChange && !(int) $val('doublon_ok')) {
            $cle = g_cle_nom($val('nom') . ' ' . $val('prenoms'));
            $st = $pdo->prepare("SELECT nom, prenoms, matricule FROM g_eleves WHERE centre_id = ? AND id <> ? AND supprime = 0 AND statut <> 'parti'");
            $st->execute([$centre, $id]);
            foreach ($st->fetchAll() as $e) {
                if (g_cle_nom($e['nom'] . ' ' . $e['prenoms']) === $cle) {
                    throw new DomainException('Déjà inscrit : ' . trim($e['nom'] . ' ' . $e['prenoms']) . ($e['matricule'] ? ' (' . $e['matricule'] . ')' : '') . '. Confirmez s\'il s\'agit d\'un homonyme.');
                }
            }
        }
    }
    if ($table === 'g_seances' || $table === 'g_presences') { g_valider_appel($pdo, $table, $id, $existant, $champs); return; }
    if ($table === 'g_paiements' || $table === 'g_depenses') { g_valider_finances($pdo, $table, $id, $existant, $champs); return; }
    if (in_array($table, ['g_contrats', 'g_presences_ens', 'g_paies'], true)) { g_valider_enseignants($pdo, $table, $id, $existant, $champs); return; }
    // Tarifs d'une classe : responsable ou admin (un actionnaire tient l'emploi du temps, pas les prix).
    if ($table === 'g_classes' && (array_key_exists('inscription', $champs) || array_key_exists('mensualite', $champs))) {
        $ctx = $GLOBALS['g_ctx'] ?? null;
        $role = $ctx && !$ctx['admin'] ? ($ctx['acces'][(string) $val('centre_id')] ?? '') : 'admin';
        $change = !$existant || (int) ($champs['inscription'] ?? $existant['inscription']) !== (int) $existant['inscription']
            || (int) ($champs['mensualite'] ?? $existant['mensualite']) !== (int) $existant['mensualite'];
        if ($change && !g_ctx_peut('tarifs.fixer', (string) $val('centre_id'))) { throw new DomainException('Seul un responsable fixe les tarifs.'); }
        foreach (['inscription', 'mensualite'] as $c) {
            if (array_key_exists($c, $champs) && ((int) $champs[$c] < 0 || (int) $champs[$c] > 1000000)) { throw new DomainException('Tarif invalide.'); }
        }
    }
    if ($table === 'g_horaires') {
        $jour = (int) $val('jour');
        $debut = (string) $val('debut');
        $fin = (string) $val('fin');
        if ($jour < 1 || $jour > 7) { throw new DomainException('Jour invalide.'); }
        if (!preg_match('/^([01]\d|2[0-3]):[0-5]\d$/', $debut) || !preg_match('/^([01]\d|2[0-3]):[0-5]\d$/', $fin) || $debut >= $fin) {
            throw new DomainException('Heures invalides : la fin doit suivre le début (HH:MM).');
        }
        $permis = ['Primaire', '6e', '5e', '4e', '3e', '2nde', '1ère', 'Tle', 'Autre'];
        foreach (array_filter(explode(',', (string) $val('niveaux'))) as $n) {
            if (!in_array($n, $permis, true)) { throw new DomainException('Niveau inconnu : ' . $n . '.'); }
        }
    }
    if ($table === 'g_matieres' && trim((string) $val('nom')) === '') { throw new DomainException('Le nom de la matière est obligatoire.'); }
    if ($table === 'g_classes' && trim((string) $val('nom')) === '') { throw new DomainException('Le nom de la classe est obligatoire.'); }
    if ($table === 'g_classes') {
        // Comparaison en PHP : LOWER() de SQLite ignore les lettres accentuées (« 1ÈRE » ≠ « 1ère »).
        $st = $pdo->prepare('SELECT nom FROM g_classes WHERE centre_id = ? AND supprime = 0 AND id <> ?');
        $st->execute([(string) $val('centre_id'), $id]);
        $cle = mb_strtolower(preg_replace('/\s+/u', ' ', trim((string) $val('nom'))));
        foreach ($st->fetchAll(PDO::FETCH_COLUMN) as $autre) {
            if (mb_strtolower(preg_replace('/\s+/u', ' ', trim((string) $autre))) === $cle) { throw new DomainException('Une classe porte déjà ce nom dans ce centre.'); }
        }
    }
    if ($table === 'g_creneaux') {
        $centre = (string) $val('centre_id');
        $jour = (int) $val('jour');
        $debut = (string) $val('debut');
        $fin = (string) $val('fin');
        if ($jour < 1 || $jour > 7) { throw new DomainException('Jour invalide.'); }
        if (!preg_match('/^([01]\d|2[0-3]):[0-5]\d$/', $debut) || !preg_match('/^([01]\d|2[0-3]):[0-5]\d$/', $fin) || $debut >= $fin) {
            throw new DomainException('Heures invalides : la fin doit suivre le début (HH:MM).');
        }
        $st = $pdo->prepare('SELECT nom FROM g_classes WHERE id = ? AND centre_id = ? AND supprime = 0');
        $st->execute([(string) $val('classe_id'), $centre]);
        $classe = $st->fetchColumn();
        if ($classe === false) { throw new DomainException('Classe inconnue dans ce centre.'); }
        $st = $pdo->prepare('SELECT COUNT(*) FROM g_matieres WHERE id = ? AND supprime = 0');
        $st->execute([(string) $val('matiere_id')]);
        if (!(int) $st->fetchColumn()) { throw new DomainException('Matière inconnue.'); }
        $ens = (string) $val('enseignant_id');
        if ($ens !== '') {
            $st = $pdo->prepare("SELECT COUNT(*) FROM g_acces WHERE utilisateur_id = ? AND centre_id = ? AND role = 'enseignant'");
            $st->execute([$ens, $centre]);
            if (!(int) $st->fetchColumn()) { throw new DomainException('Cette personne n\'est pas enseignant dans ce centre.'); }
        }
        // Conflits : même classe, ou même enseignant (y compris dans l'AUTRE centre), sur des heures qui se chevauchent.
        $st = $pdo->prepare(
            'SELECT c.debut, c.fin, c.classe_id, c.enseignant_id, k.nom AS classe, ce.nom_court AS centre
               FROM g_creneaux c LEFT JOIN g_classes k ON k.id = c.classe_id LEFT JOIN g_centres ce ON ce.id = c.centre_id
              WHERE c.supprime = 0 AND c.id <> ? AND c.jour = ? AND c.debut < ? AND c.fin > ?
                AND (c.classe_id = ? OR (c.enseignant_id = ? AND c.enseignant_id <> \'\'))'
        );
        $st->execute([$id, $jour, $fin, $debut, (string) $val('classe_id'), $ens === '' ? '§' : $ens]);
        if ($c = $st->fetch()) {
            if ((string) $c['classe_id'] === (string) $val('classe_id')) {
                throw new DomainException('La classe ' . $classe . ' a déjà cours de ' . $c['debut'] . ' à ' . $c['fin'] . '.');
            }
            throw new DomainException('Cet enseignant est déjà pris de ' . $c['debut'] . ' à ' . $c['fin'] . ' (' . $c['classe'] . ', ' . $c['centre'] . ').');
        }
    }
    if ($table === 'g_actionnaires') {
        if (trim((string) $val('nom')) === '') { throw new DomainException('Le nom de l\'actionnaire est obligatoire.'); }
        $part = (int) $val('part_centiemes');
        if ($part < 0 || $part > 10000) { throw new DomainException('Part : entre 0 et 100 %.'); }
        $st = $pdo->prepare('SELECT COALESCE(SUM(part_centiemes), 0) FROM g_actionnaires WHERE centre_id = ? AND supprime = 0 AND id <> ?');
        $st->execute([(string) $val('centre_id'), $id]);
        if ((int) $st->fetchColumn() + $part > 10000) { throw new DomainException('Le total des parts du centre dépasserait 100 %.'); }
    }
}

/**
 * Remise de fonds au trésorier.
 *  - Créée par celui qui remet l'argent (remis_par = lui), toujours « en attente ».
 *  - Tant qu'elle attend, son auteur peut corriger montant, date, mode, note.
 *  - Seul le trésorier du centre (ou l'admin) la confirme (« reçu ») ou la conteste (« pas reçu »,
 *    avec un motif) ; ni l'auteur ni un autre partenaire ne le peut. Une fois tranchée, elle est figée.
 */
function g_valider_remise(PDO $pdo, ?array $existant, array &$champs): void {
    $ctx = $GLOBALS['g_ctx'] ?? [];
    $uid = (string) ($ctx['uid'] ?? '');
    $val = fn(string $c) => array_key_exists($c, $champs) ? $champs[$c] : ($existant[$c] ?? null);
    $centre = (string) $val('centre_id');
    $avant = $existant ? (string) $existant['statut'] : '';
    $statut = (string) ($val('statut') ?: 'en_attente');
    if (!in_array($statut, ['en_attente', 'confirmee', 'contestee'], true)) { throw new DomainException('Statut de remise inconnu.'); }
    if ($avant === 'confirmee' || $avant === 'contestee') { throw new DomainException('Remise déjà tranchée par le trésorier : elle ne se modifie plus.'); }
    $montant = (int) $val('montant');
    if ($montant <= 0 || $montant > 50000000) { throw new DomainException('Montant de remise invalide.'); }
    if (!in_array((string) ($val('mode') ?: 'especes'), ['especes', 'momo', 'om', 'virement', 'autre'], true)) { throw new DomainException('Mode de remise inconnu.'); }
    $date = (string) $val('date');
    if (!preg_match('/^\d{4}-\d{2}-\d{2}$/', $date) || $date > date('Y-m-d')) { throw new DomainException('Date de remise invalide.'); }

    $st = $pdo->prepare('SELECT tresorier_id FROM g_centres WHERE id = ?');
    $st->execute([$centre]);
    $tresorier = (string) ($st->fetchColumn() ?: '');

    if (!$existant) {
        if ($statut !== 'en_attente') { throw new DomainException('Une remise naît « en attente » : le trésorier la confirme.'); }
        if (!g_ctx_peut('paiements.encaisser', $centre)) { throw new DomainException('Seul un compte qui encaisse peut remettre des fonds.'); }
        if ($tresorier === '') { throw new DomainException('Aucun trésorier désigné pour ce centre : l\'administrateur le choisit dans Centres.'); }
        $champs['remis_par'] = $uid;
        $champs['statut'] = 'en_attente';
        unset($champs['motif']);
        return;
    }
    $auteur = (string) $existant['remis_par'];
    if ($statut === 'en_attente') {
        if ($uid !== $auteur && empty($ctx['admin'])) { throw new DomainException('Seul l\'auteur peut corriger sa remise.'); }
        if ((string) $val('centre_id') !== (string) $existant['centre_id']) { throw new DomainException('Une remise ne change pas de centre.'); }
        unset($champs['motif']);
        return;
    }
    // Confirmation ou contestation : le trésorier du centre, ou l'admin ; jamais l'auteur lui-même.
    if (empty($ctx['admin']) && ($tresorier === '' || $uid !== $tresorier)) { throw new DomainException('Seul le trésorier du centre confirme la réception des fonds.'); }
    if ($uid === $auteur && empty($ctx['admin'])) { throw new DomainException('On ne confirme pas sa propre remise.'); }
    if ($statut === 'contestee' && trim((string) $val('motif')) === '') { throw new DomainException('Indiquez pourquoi la remise n\'est pas reçue.'); }
    foreach (['montant', 'date', 'mode', 'note', 'centre_id'] as $c) {
        if (array_key_exists($c, $champs) && (string) $champs[$c] !== (string) $existant[$c]) { throw new DomainException('Le trésorier confirme ou conteste, sans modifier la remise.'); }
    }
    $champs['confirme_par'] = $uid;
    $champs['confirme_le'] = g_now();
}

/** Taux horaire et mode d'un enseignant dans un centre : son contrat actif, sinon 1 500 F de l'heure. */
function g_remuneration(PDO $pdo, string $centre, string $uid): array {
    $st = $pdo->prepare('SELECT mode, taux FROM g_contrats WHERE centre_id = ? AND utilisateur_id = ? AND actif = 1 AND supprime = 0 LIMIT 1');
    $st->execute([$centre, $uid]);
    $c = $st->fetch();
    return $c ? ['mode' => (string) $c['mode'], 'taux' => (int) $c['taux']] : ['mode' => 'heure', 'taux' => (int) G_TAUX_HORAIRE_DEFAUT];
}

/**
 * Paie d'un cours, juste après, par le partenaire présent qui a encaissé : rattachée au pointage
 * de l'enseignant (présent, en retard ou remplaçant), une seule par cours, et jamais plus que
 * la durée faite × le taux (à la séance : le taux ; au forfait : rien ici, c'est la paie du mois).
 */
function g_valider_paie_cours(PDO $pdo, string $centre, array &$champs, callable $val): void {
    $st = $pdo->prepare('SELECT * FROM g_presences_ens WHERE id = ? AND centre_id = ? AND supprime = 0');
    $st->execute([(string) $val('presence_id'), $centre]);
    $p = $st->fetch();
    if (!$p) { throw new DomainException('Cours introuvable : pointez d\'abord l\'enseignant.'); }
    if (!in_array((string) $p['statut'], ['present', 'retard', 'remplace'], true) || (int) $p['minutes'] <= 0) { throw new DomainException('Ce cours n\'a pas été fait : rien à payer.'); }
    $prof = (string) $p['statut'] === 'remplace' ? (string) $p['remplacant_id'] : (string) $p['enseignant_id'];
    if ((string) $val('enseignant_id') !== $prof) { throw new DomainException('La paie va à l\'enseignant qui a fait le cours.'); }
    $r = g_remuneration($pdo, $centre, $prof);
    if ($r['mode'] === 'forfait') { throw new DomainException('Enseignant au forfait : il est payé au mois, pas après chaque cours.'); }
    $max = $r['mode'] === 'seance' ? $r['taux'] : (int) round(((int) $p['minutes']) / 60 * $r['taux']);
    $montant = (int) $val('montant');
    if ($montant <= 0 || $montant > $max) { throw new DomainException('Montant du cours : au plus ' . number_format($max, 0, ',', ' ') . ' F.'); }
    $st = $pdo->prepare('SELECT COUNT(*) FROM g_paies WHERE presence_id = ? AND annule = 0 AND supprime = 0');
    $st->execute([(string) $p['id']]);
    if ((int) $st->fetchColumn()) { throw new DomainException('Ce cours est déjà payé.'); }
    if (!in_array((string) ($val('mode') ?: 'especes'), ['especes', 'momo', 'om', 'virement', 'autre'], true)) { throw new DomainException('Mode de paiement inconnu.'); }
    $date = (string) $val('date');
    if (!preg_match('/^\d{4}-\d{2}-\d{2}$/', $date) || $date > date('Y-m-d') || $date < (string) $p['date']) { throw new DomainException('Date de paie invalide.'); }
    $champs['mois'] = substr((string) $p['date'], 0, 7);
}

/** Comptes partenaires d'un centre (ou admin) : pour assigner une tâche. */
function g_est_partenaire(PDO $pdo, string $uid, string $centre): bool {
    $st = $pdo->prepare("SELECT COUNT(*) FROM g_acces a JOIN g_utilisateurs u ON u.id = a.utilisateur_id WHERE a.utilisateur_id = ? AND a.centre_id = ? AND a.role <> 'enseignant' AND u.actif = 1");
    $st->execute([$uid, $centre]);
    if ((int) $st->fetchColumn()) { return true; }
    $st = $pdo->prepare('SELECT COUNT(*) FROM g_utilisateurs WHERE id = ? AND admin_global = 1 AND actif = 1');
    $st->execute([$uid]);
    return (int) $st->fetchColumn() > 0;
}

/**
 * Espace « Équipe » : l'auteur est toujours celui qui écrit (posé par le serveur) ; un message
 * se corrige par son auteur seul ; une réunion se tranche par son auteur, un responsable de
 * l'agenda ou l'admin ; une disponibilité n'appartient qu'à celui qui l'a donnée ; une tâche
 * est collaborative (chaque partenaire peut l'avancer).
 */
function g_valider_equipe(PDO $pdo, string $table, ?array $existant, array &$champs): void {
    $ctx = $GLOBALS['g_ctx'] ?? [];
    $uid = (string) ($ctx['uid'] ?? '');
    $admin = !empty($ctx['admin']);
    $val = fn(string $c) => array_key_exists($c, $champs) ? $champs[$c] : ($existant[$c] ?? null);
    $centre = (string) $val('centre_id');
    if ($existant && array_key_exists('centre_id', $champs) && (string) $champs['centre_id'] !== (string) $existant['centre_id']) { throw new DomainException('Ne change pas de centre.'); }
    $date = '/^\d{4}-\d{2}-\d{2}( ([01]\d|2[0-3]):[0-5]\d)?$/';

    if ($table === 'g_messages') {
        $t = trim((string) $val('texte'));
        if ($t === '' || mb_strlen($t) > 1000) { throw new DomainException('Message vide ou trop long (1 000 caractères au plus).'); }
        if (!preg_match('/^[a-z]+(:[A-Za-z0-9-]{1,40})?$/', (string) $val('fil'))) { throw new DomainException('Fil de discussion invalide.'); }
        if ($existant) {
            if (!$admin && (string) $existant['auteur'] !== $uid) { throw new DomainException('Seul son auteur peut modifier un message.'); }
            if (array_key_exists('fil', $champs) && (string) $champs['fil'] !== (string) $existant['fil']) { throw new DomainException('Un message ne change pas de fil.'); }
            return;
        }
        $champs['auteur'] = $uid; $champs['cree_le'] = g_now();
        return;
    }
    if ($table === 'g_sondages') {
        if (trim((string) $val('titre')) === '') { throw new DomainException('Donnez un objet à la réunion.'); }
        $opts = json_decode((string) $val('options'), true);
        if (!is_array($opts) || count($opts) < 1 || count($opts) > 12) { throw new DomainException('Proposez entre 1 et 12 dates.'); }
        foreach ($opts as $o) { if (!is_string($o) || !preg_match($date, $o)) { throw new DomainException('Date proposée invalide.'); } }
        $statut = (string) ($val('statut') ?: 'ouvert');
        if (!in_array($statut, ['ouvert', 'clos'], true)) { throw new DomainException('Statut de réunion inconnu.'); }
        if ($statut === 'clos' && !in_array((string) $val('choix'), $opts, true)) { throw new DomainException('Retenez une des dates proposées.'); }
        if (!$existant) {
            if ($statut !== 'ouvert') { throw new DomainException('Une réunion naît ouverte aux réponses.'); }
            $champs['auteur'] = $uid; $champs['cree_le'] = g_now();
            return;
        }
        if ((string) $existant['statut'] === 'clos' && $statut === 'clos' && array_diff(array_keys($champs), ['evenement_id'])) { throw new DomainException('Réunion déjà fixée.'); }
        if (!$admin && (string) $existant['auteur'] !== $uid && !g_ctx_peut('agenda.gerer', $centre)) { throw new DomainException('Seul celui qui a proposé la réunion la modifie ou la fixe.'); }
        return;
    }
    if ($table === 'g_dispos') {
        $st = $pdo->prepare('SELECT * FROM g_sondages WHERE id = ? AND supprime = 0');
        $st->execute([(string) $val('sondage_id')]);
        $sd = $st->fetch();
        if (!$sd || (string) $sd['centre_id'] !== $centre) { throw new DomainException('Réunion introuvable.'); }
        if ((string) $sd['statut'] !== 'ouvert') { throw new DomainException('La date de cette réunion est déjà fixée.'); }
        if ($existant && (string) $existant['utilisateur_id'] !== $uid) { throw new DomainException('Chacun ne donne que ses propres disponibilités.'); }
        $opts = json_decode((string) $sd['options'], true) ?: [];
        $rep = json_decode((string) $val('reponses'), true);
        if (!is_array($rep)) { throw new DomainException('Réponses invalides.'); }
        foreach ($rep as $o => $v) { if (!in_array($o, $opts, true) || !in_array($v, ['oui', 'peut', 'non'], true)) { throw new DomainException('Réponse invalide.'); } }
        $champs['utilisateur_id'] = $uid;
        return;
    }
    // Tâches
    if (trim((string) $val('titre')) === '') { throw new DomainException('Donnez un titre à la tâche.'); }
    $statut = (string) ($val('statut') ?: 'a_faire');
    if (!in_array($statut, ['a_faire', 'en_cours', 'fait'], true)) { throw new DomainException('Statut de tâche inconnu.'); }
    $ech = (string) $val('echeance');
    if ($ech !== '' && !preg_match('/^\d{4}-\d{2}-\d{2}$/', $ech)) { throw new DomainException('Échéance invalide.'); }
    $qui = (string) $val('assigne_a');
    if ($qui !== '' && !g_est_partenaire($pdo, $qui, $centre)) { throw new DomainException('Assignez la tâche à un partenaire du centre.'); }
    if (!$existant) { $champs['auteur'] = $uid; $champs['cree_le'] = g_now(); }
    if ($statut === 'fait' && (!$existant || (string) $existant['statut'] !== 'fait')) { $champs['fait_le'] = g_now(); }
    if ($statut !== 'fait') { $champs['fait_le'] = ''; }
}

/** Libellé du mois si la date tombe dans un mois clôturé pour ce centre, sinon chaîne vide. */
function g_mois_clos(PDO $pdo, string $centre, string $date): string {
    if ($centre === '' || !preg_match('/^(\d{4}-\d{2})/', $date, $m)) { return ''; }
    static $cache = [];
    $cle = $centre . '|' . $m[1];
    if (!array_key_exists($cle, $cache)) {
        try {
            $st = $pdo->prepare('SELECT COUNT(*) FROM g_clotures WHERE centre_id = ? AND mois = ? AND supprime = 0');
            $st->execute([$centre, $m[1]]);
            $cache[$cle] = (int) $st->fetchColumn() > 0;
        } catch (Throwable $e) { $cache[$cle] = false; }   // table pas encore créée : rien de clôturé
    }
    if (!$cache[$cle]) { return ''; }
    $mois = ['janvier', 'février', 'mars', 'avril', 'mai', 'juin', 'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre'];
    return $mois[(int) substr($m[1], 5, 2) - 1] . ' ' . substr($m[1], 0, 4);
}

/**
 * Clôture d'un mois : par un responsable (caisse.corriger) ou l'admin ; une par centre et par mois ;
 * jamais un mois à venir ; totaux recalculés ici. Rouvrir (supprimer la clôture) : admin seulement.
 */
function g_valider_cloture(PDO $pdo, string $id, ?array $existant, array &$champs, bool $suppr): void {
    $ctx = $GLOBALS['g_ctx'] ?? [];
    if ($suppr) {
        if (empty($ctx['admin'])) { throw new DomainException('Seul l\'administrateur rouvre un mois clôturé.'); }
        return;
    }
    if ($existant && !(int) $existant['supprime']) { throw new DomainException('Ce mois est déjà clôturé.'); }
    $centre = (string) ($champs['centre_id'] ?? ($existant['centre_id'] ?? ''));
    $mois = (string) ($champs['mois'] ?? ($existant['mois'] ?? ''));
    if (!preg_match('/^\d{4}-(0[1-9]|1[0-2])$/', $mois)) { throw new DomainException('Mois invalide.'); }
    if ($mois > date('Y-m')) { throw new DomainException('On ne clôture pas un mois à venir.'); }
    if ($id !== 'clo-' . $centre . '-' . $mois) { throw new DomainException('Identifiant de clôture invalide.'); }
    $somme = function (string $sql) use ($pdo, $centre, $mois): int {
        $st = $pdo->prepare($sql);
        $st->execute([$centre, $mois . '%']);
        return (int) $st->fetchColumn();
    };
    $r = $somme('SELECT COALESCE(SUM(montant),0) FROM g_paiements WHERE centre_id = ? AND date LIKE ? AND annule = 0 AND supprime = 0');
    $d = $somme("SELECT COALESCE(SUM(montant),0) FROM g_depenses WHERE centre_id = ? AND date LIKE ? AND statut = 'validee' AND supprime = 0");
    $p = $somme('SELECT COALESCE(SUM(montant),0) FROM g_paies WHERE centre_id = ? AND date LIKE ? AND annule = 0 AND supprime = 0');
    $champs['recettes'] = $r; $champs['depenses'] = $d; $champs['paies'] = $p; $champs['resultat'] = $r - $d - $p;
    $parts = json_decode((string) ($champs['parts'] ?? '[]'), true);
    if (!is_array($parts)) { $parts = []; }
    // Parts recalculées sur le résultat du serveur, d'après les actionnaires du centre.
    $st = $pdo->prepare('SELECT nom, part_centiemes FROM g_actionnaires WHERE centre_id = ? AND supprime = 0');
    $st->execute([$centre]);
    $champs['parts'] = json_encode(array_map(fn($a) => ['nom' => $a['nom'], 'part' => (int) $a['part_centiemes'], 'montant' => (int) round(($r - $d - $p) * (int) $a['part_centiemes'] / 10000)], $st->fetchAll()), JSON_UNESCAPED_UNICODE);
    $champs['clos_par'] = $ctx['uid'] ?? null;
    $champs['clos_le'] = g_now();
}

/** Identifiant tiré du nom : prénom.nom en minuscules sans accents (NOM en capitales = nom de famille), unique. */
function g_identifiant_libre(PDO $pdo, string $nom, string $centre = ''): string {
    $mots = preg_split('/\s+/u', trim($nom)) ?: [];
    $famille = []; $prenoms = [];
    foreach ($mots as $m) {
        if ($m === '') { continue; }
        if (mb_strtoupper($m) === $m && preg_match('/\p{L}/u', $m)) { $famille[] = $m; } else { $prenoms[] = $m; }
    }
    $ordre = $prenoms && $famille ? array_merge(array_slice($prenoms, 0, 1), array_slice($famille, 0, 1)) : array_slice($mots, 0, 2);
    $ascii = function (string $t): string {
        $t = mb_strtolower($t);
        $t = strtr($t, ['à' => 'a', 'â' => 'a', 'ä' => 'a', 'á' => 'a', 'ç' => 'c', 'é' => 'e', 'è' => 'e', 'ê' => 'e', 'ë' => 'e', 'î' => 'i', 'ï' => 'i', 'í' => 'i',
                        'ô' => 'o', 'ö' => 'o', 'ó' => 'o', 'ù' => 'u', 'û' => 'u', 'ü' => 'u', 'ú' => 'u', 'ÿ' => 'y', 'ñ' => 'n', 'œ' => 'oe', 'æ' => 'ae']);
        return preg_replace('/[^a-z0-9]+/', '', $t);
    };
    $base = implode('.', array_filter(array_map($ascii, $ordre)));
    if (strlen($base) < 3) { $base = 'compte' . $base; }
    $base = substr($base, 0, 50);
    $st = $pdo->prepare('SELECT COUNT(*) FROM g_utilisateurs WHERE identifiant = ?');
    // Déjà pris (souvent : la même personne dans l'autre centre) → on ajoute le centre : paul.essomba.ndogpassi3.
    $c = $ascii(preg_replace_callback('/\\b(IV|III|II|I)\\b/u', function ($m) { return (string) ['I' => 1, 'II' => 2, 'III' => 3, 'IV' => 4][$m[1]]; }, $centre));
    if ($c !== '') {
        $st->execute([$base]);
        if ((int) $st->fetchColumn()) { $base = substr($base, 0, 59 - min(10, strlen($c))) . '.' . substr($c, 0, 10); }
    }
    for ($i = 1; $i < 1000; $i++) {
        $essai = $i === 1 ? $base : $base . $i;
        $st->execute([$essai]);
        if (!(int) $st->fetchColumn()) { return $essai; }
    }
    return $base . substr(bin2hex(random_bytes(3)), 0, 5);
}
