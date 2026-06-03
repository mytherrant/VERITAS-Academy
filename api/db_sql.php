<?php
/**
 * api/db_sql.php — Miroir relationnel MySQL de la base VÉRITAS  (« base solide »)
 * © 2024-2026 Jacques Miterand TAKOU (Mythe Errant). Tous droits réservés.
 * Œuvre protégée — Loi n° 2000/011 + Convention de Berne.
 *
 * RÔLE
 *   Recopie les données de data/veritas_db.json vers MySQL : un SNAPSHOT JSON
 *   complet horodaté (filet : rien n'est jamais perdu) + des UPSERTS dans des
 *   tables relationnelles requêtables (élèves, notes, paiements, …). Idempotent.
 *
 *   Le fichier JSON reste la SOURCE LIVE (db.php inchangé). MySQL est un miroir
 *   durable/requêtable — la lecture depuis MySQL viendra dans une phase ultérieure,
 *   une fois ce miroir prouvé en ligne. Ainsi, AUCUN risque pour le sync qui marche.
 *
 * SÛRETÉ — totalement ISOLÉ et TOLÉRANT AUX PANNES :
 *   - Auth Bearer (même secret que db.php, via config_sync → requireAuth()).
 *   - Si MySQL indisponible / non configuré → réponse JSON d'erreur, JAMAIS de
 *     fatale qui casserait quoi que ce soit (db.php n'appelle pas ce fichier).
 *   - Chaque table est traitée dans sa propre transaction + try/catch : l'échec
 *     d'une table n'empêche pas les autres. Rapport par table renvoyé.
 *
 * PRÉREQUIS SERVEUR (à faire une fois par l'admin) :
 *   1. Importer api/database_mysql.sql dans phpMyAdmin (base verit2781684).
 *   2. Ajouter dans api/payment_config.php (gitignoré) :  define('MYSQL_PASS', '<motdepasse>');
 *      (hôte/base/user sont publics et fixés ci-dessous ; seul le mot de passe est secret.)
 */
declare(strict_types=1);

require_once __DIR__ . '/config_sync.php'; // CORS allowlist + OPTIONS + requireAuth() + jsonResponse()

header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-store, no-cache, must-revalidate, max-age=0');

// ── Auth : même clé que db.php (le client envoie déjà DB.cloudConfig.secret) ──
requireAuth();

// ── Connexion MySQL — tolérante (pas de fatale) ──────────────────────────────
$DB_HOST = '185.98.131.160';   // public (déjà dans config.php)
$DB_NAME = 'verit2781684';
$DB_USER = 'verit2781684';
$DB_PASS = defined('MYSQL_PASS') ? MYSQL_PASS : '';
if ($DB_PASS === '') {
    jsonResponse(['ok' => false, 'error' => 'MYSQL_PASS non défini dans api/payment_config.php — miroir MySQL inactif (le sync JSON continue normalement).'], 200);
}
try {
    $pdo = new PDO(
        'mysql:host=' . $DB_HOST . ';dbname=' . $DB_NAME . ';charset=utf8mb4',
        $DB_USER, $DB_PASS,
        [PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION, PDO::ATTR_EMULATE_PREPARES => false]
    );
} catch (Throwable $e) {
    jsonResponse(['ok' => false, 'error' => 'MySQL indisponible : ' . $e->getMessage()], 200);
}

// ── Source : la base JSON live (root/data/veritas_db.json), comme db.php ──────
$DB_FILE = dirname(__DIR__) . '/data/veritas_db.json';
if (!is_file($DB_FILE)) {
    jsonResponse(['ok' => false, 'error' => 'veritas_db.json introuvable'], 200);
}
$db = json_decode((string) file_get_contents($DB_FILE), true);
if (!is_array($db)) {
    jsonResponse(['ok' => false, 'error' => 'veritas_db.json illisible'], 200);
}

$report = [];
$arr = function ($k) use ($db) { return (isset($db[$k]) && is_array($db[$k])) ? $db[$k] : []; };
$S   = function ($v, $n = null) { // string borné
    $s = is_scalar($v) ? (string) $v : '';
    return ($n && strlen($s) > $n) ? substr($s, 0, $n) : $s;
};
$I   = function ($v) { return (int) (is_numeric($v) ? $v : 0); };
$F   = function ($v) { return is_numeric($v) ? (float) $v : null; };

/**
 * Remplace tout le contenu d'une table par les lignes fournies, dans une
 * transaction (atomique). $rows = liste de tableaux associatifs colonne=>valeur.
 */
function refreshTable(PDO $pdo, string $table, array $cols, array $rows, array &$report): void {
    try {
        $pdo->beginTransaction();
        $pdo->exec('DELETE FROM `' . $table . '`');
        if ($rows) {
            $place = '(' . implode(',', array_fill(0, count($cols), '?')) . ')';
            $sql = 'INSERT INTO `' . $table . '` (`' . implode('`,`', $cols) . '`) VALUES ' . $place;
            $stmt = $pdo->prepare($sql);
            foreach ($rows as $r) {
                $vals = [];
                foreach ($cols as $c) { $vals[] = $r[$c] ?? null; }
                $stmt->execute($vals);
            }
        }
        $pdo->commit();
        $report[$table] = count($rows);
    } catch (Throwable $e) {
        if ($pdo->inTransaction()) $pdo->rollBack();
        $report[$table] = 'ERREUR: ' . $e->getMessage();
    }
}

// ── 1. SNAPSHOT JSON complet (filet absolu) — capé à 30 ──────────────────────
try {
    $raw = json_encode($db, JSON_UNESCAPED_UNICODE);
    $st = $pdo->prepare('INSERT INTO sync_snapshots (data, rev, last_modified, created_by, size_bytes) VALUES (?,?,?,?,?)');
    $st->execute([
        $raw,
        $I($db['_rev'] ?? 0),
        $I($db['lastModified'] ?? 0),
        'db_sql.php',
        strlen((string) $raw),
    ]);
    $pdo->exec('DELETE FROM sync_snapshots WHERE id NOT IN (SELECT id FROM (SELECT id FROM sync_snapshots ORDER BY id DESC LIMIT 30) t)');
    $report['sync_snapshots'] = 'ok (#' . $pdo->lastInsertId() . ')';
} catch (Throwable $e) {
    $report['sync_snapshots'] = 'ERREUR: ' . $e->getMessage();
}

// ── 2. Tables relationnelles (mapping selon la forme documentée de DB) ───────
// Élèves : {id, mat, nom, pre, cls, ...}
$rows = [];
foreach ($arr('students') as $s) {
    if (!is_array($s)) continue;
    $rows[] = [
        'id' => $S($s['id'] ?? '', 40), 'matricule' => $S($s['mat'] ?? ($s['matricule'] ?? ''), 40),
        'nom' => $S($s['nom'] ?? '', 120), 'prenom' => $S($s['pre'] ?? ($s['prenom'] ?? ''), 120),
        'sexe' => $S($s['sexe'] ?? '', 1), 'date_naissance' => $S($s['dn'] ?? ($s['dateNaiss'] ?? ''), 20),
        'classe' => $S($s['cls'] ?? '', 40), 'tel' => $S($s['tel'] ?? '', 50),
        'parent_nom' => $S($s['parent'] ?? ($s['parentNom'] ?? ''), 200), 'parent_tel' => $S($s['parentTel'] ?? ($s['ptel'] ?? ''), 50),
        'frais_scolarite' => null === ($s['frais'] ?? null) ? 0 : (int) ($s['frais'] ?? 0),
        'date_inscription' => $S($s['dateInscr'] ?? ($s['di'] ?? ''), 20),
        'statut' => $S($s['statut'] ?? ($s['stat'] ?? 'En attente'), 40),
        'photo_url' => $S($s['photo'] ?? '', 1000),
    ];
}
refreshTable($pdo, 'students', ['id','matricule','nom','prenom','sexe','date_naissance','classe','tel','parent_nom','parent_tel','frais_scolarite','date_inscription','statut','photo_url'], $rows, $report);

// Enseignants : {id, nom, pre, mat2, sal, user?}
$rows = [];
foreach ($arr('teachers') as $t) {
    if (!is_array($t)) continue;
    $rows[] = [
        'id' => $S($t['id'] ?? '', 40), 'matricule' => $S($t['mat'] ?? '', 40),
        'nom' => $S($t['nom'] ?? '', 120), 'prenom' => $S($t['pre'] ?? '', 120),
        'matiere' => $S($t['mat2'] ?? ($t['matiere'] ?? ''), 120), 'grade' => $S($t['grade'] ?? '', 120),
        'username' => $S($t['user'] ?? '', 120), 'tel' => $S($t['tel'] ?? '', 50),
        'salaire' => (int) ($t['sal'] ?? 0), 'statut' => $S($t['statut'] ?? 'Actif', 40),
        'classes' => isset($t['classes']) ? json_encode($t['classes'], JSON_UNESCAPED_UNICODE) : null,
        'titulaire' => $S($t['titulaire'] ?? '', 40),
    ];
}
refreshTable($pdo, 'teachers', ['id','matricule','nom','prenom','matiere','grade','username','tel','salaire','statut','classes','titulaire'], $rows, $report);

// Comptes élèves : {id, user, pwd, eid, plans}
$rows = [];
foreach ($arr('studentAccounts') as $a) {
    if (!is_array($a)) continue;
    $rows[] = [
        'id' => $S($a['id'] ?? '', 40), 'user' => $S($a['user'] ?? '', 120), 'eid' => $S($a['eid'] ?? '', 40),
        'password_hash' => $S($a['pwd'] ?? '', 255), 'plans' => isset($a['plans']) ? json_encode($a['plans']) : null,
        'last_login' => $S($a['lastLogin'] ?? '', 40),
    ];
}
refreshTable($pdo, 'student_accounts', ['id','user','eid','password_hash','plans','last_login'], $rows, $report);

// Comptes visiteurs : {id, user, nom, pre, cls, tel, pwd, plans, statut}
$rows = [];
foreach ($arr('visitorAccounts') as $a) {
    if (!is_array($a)) continue;
    $rows[] = [
        'id' => $S($a['id'] ?? '', 40), 'user' => $S($a['user'] ?? '', 120),
        'nom' => $S($a['nom'] ?? '', 120), 'prenom' => $S($a['pre'] ?? '', 120),
        'classe' => $S($a['cls'] ?? '', 40), 'tel' => $S($a['tel'] ?? '', 50),
        'password_hash' => $S($a['pwd'] ?? '', 255), 'plans' => isset($a['plans']) ? json_encode($a['plans']) : null,
        'statut' => $S($a['statut'] ?? 'actif', 40), 'last_login' => $S($a['lastLogin'] ?? '', 40),
    ];
}
refreshTable($pdo, 'visitor_accounts', ['id','user','nom','prenom','classe','tel','password_hash','plans','statut','last_login'], $rows, $report);

// Notes : {id, eid, sub, n1, n2, coef, tri}
$rows = [];
foreach ($arr('grades') as $g) {
    if (!is_array($g)) continue;
    $rows[] = [
        'id' => $S($g['id'] ?? '', 40), 'student_id' => $S($g['eid'] ?? '', 40),
        'student_name' => $S($g['nom'] ?? '', 200), 'student_mat' => $S($g['mat'] ?? '', 40),
        'classe' => $S($g['cls'] ?? '', 40), 'matiere' => $S($g['sub'] ?? ($g['matiere'] ?? ''), 120),
        'note_1' => $F($g['n1'] ?? null), 'note_2' => $F($g['n2'] ?? null),
        'coefficient' => (int) ($g['coef'] ?? 1), 'trimestre' => $S($g['tri'] ?? '', 40),
        'enseignant' => $S($g['ens'] ?? ($g['enseignant'] ?? ''), 200),
    ];
}
refreshTable($pdo, 'grades', ['id','student_id','student_name','student_mat','classe','matiere','note_1','note_2','coefficient','trimestre','enseignant'], $rows, $report);

// Paiements : {id, eid, mnt, date, tri, stat}
$rows = [];
foreach ($arr('payments') as $p) {
    if (!is_array($p)) continue;
    $rows[] = [
        'id' => $S($p['id'] ?? '', 40), 'student_id' => $S($p['eid'] ?? '', 40),
        'student_name' => $S($p['nom'] ?? '', 200), 'classe' => $S($p['cls'] ?? '', 40),
        'mois' => $S($p['mois'] ?? ($p['tri'] ?? ''), 50), 'montant' => (int) ($p['mnt'] ?? ($p['montant'] ?? 0)),
        'mode_paiement' => $S($p['mode'] ?? '', 50), 'date_paiement' => $S($p['date'] ?? '', 20),
        'statut' => $S($p['stat'] ?? ($p['statut'] ?? ''), 40), 'reference' => $S($p['ref'] ?? '', 80),
    ];
}
refreshTable($pdo, 'payments', ['id','student_id','student_name','classe','mois','montant','mode_paiement','date_paiement','statut','reference'], $rows, $report);

// Absences : {id, eid, date, matiere, motif}
$rows = [];
foreach ($arr('absences') as $a) {
    if (!is_array($a)) continue;
    $rows[] = [
        'id' => $S($a['id'] ?? '', 40), 'student_id' => $S($a['eid'] ?? '', 40),
        'date_absence' => $S($a['date'] ?? '', 20), 'heures' => (int) ($a['heures'] ?? 0),
        'matiere' => $S($a['matiere'] ?? '', 120), 'motif' => $S($a['motif'] ?? '', 2000),
        'justifie' => !empty($a['justifie']) ? 1 : 0,
    ];
}
refreshTable($pdo, 'absences', ['id','student_id','date_absence','heures','matiere','motif','justifie'], $rows, $report);

// Devoirs : {id, titre, cls, matiere, enonce, echeance, tid}
$rows = [];
foreach ($arr('devoirs') as $d) {
    if (!is_array($d)) continue;
    $rows[] = [
        'id' => $S($d['id'] ?? '', 40), 'titre' => $S($d['titre'] ?? '', 500),
        'classe' => $S($d['cls'] ?? '', 40), 'matiere' => $S($d['matiere'] ?? ($d['sub'] ?? ''), 120),
        'enonce' => $S($d['enonce'] ?? ($d['desc'] ?? ''), 20000), 'echeance' => $S($d['echeance'] ?? '', 40),
        'teacher_id' => $S($d['tid'] ?? '', 40),
    ];
}
refreshTable($pdo, 'devoirs', ['id','titre','classe','matiere','enonce','echeance','teacher_id'], $rows, $report);

// Soumissions : {id, eid, dvid, texte, fichierUrl, note, date}
$rows = [];
foreach ($arr('submissions') as $s) {
    if (!is_array($s)) continue;
    $rows[] = [
        'id' => $S($s['id'] ?? '', 40), 'student_id' => $S($s['eid'] ?? ($s['studentId'] ?? ''), 40),
        'dvid' => $S($s['dvid'] ?? '', 40), 'texte' => $S($s['texte'] ?? '', 60000),
        'fichier_url' => $S($s['fichierUrl'] ?? '', 1000), 'note' => $F($s['note'] ?? null),
        'date_soumission' => $S($s['date'] ?? '', 40),
    ];
}
refreshTable($pdo, 'submissions', ['id','student_id','dvid','texte','fichier_url','note','date_soumission'], $rows, $report);

// Manuels : {id, titre, auteur, cls, prix, stock, vendu, pages, desc, coverImg, fichierUrl}
$rows = [];
foreach ($arr('books') as $b) {
    if (!is_array($b)) continue;
    $rows[] = [
        'id' => $S($b['id'] ?? '', 40), 'titre' => $S($b['titre'] ?? '', 500), 'auteur' => $S($b['auteur'] ?? '', 200),
        'classe' => $S($b['cls'] ?? '', 40), 'prix' => (int) ($b['prix'] ?? 0), 'stock' => (int) ($b['stock'] ?? 0),
        'vendu' => (int) ($b['vendu'] ?? 0), 'pages' => (int) ($b['pages'] ?? 0), 'description' => $S($b['desc'] ?? '', 5000),
        'cover_url' => $S($b['coverImg'] ?? '', 1000), 'fichier_url' => $S($b['fichierUrl'] ?? '', 1000),
    ];
}
refreshTable($pdo, 'books', ['id','titre','auteur','classe','prix','stock','vendu','pages','description','cover_url','fichier_url'], $rows, $report);

// Contenus e-learning : DB.elearning.contenus
$rows = [];
$elc = (isset($db['elearning']['contenus']) && is_array($db['elearning']['contenus'])) ? $db['elearning']['contenus'] : [];
foreach ($elc as $c) {
    if (!is_array($c)) continue;
    $rows[] = [
        'id' => $S($c['id'] ?? '', 40), 'categorie_id' => $S($c['catId'] ?? ($c['categorie'] ?? ''), 40),
        'titre' => $S($c['titre'] ?? '', 500), 'classe' => $S($c['cls'] ?? '', 40),
        'matiere' => $S($c['matiere'] ?? ($c['sub'] ?? ''), 120), 'sequence_name' => $S($c['seq'] ?? '', 120),
        'prix' => (int) ($c['prix'] ?? 0), 'gratuit' => !empty($c['gratuit']) ? 1 : 0,
        'plans' => isset($c['plans']) ? json_encode($c['plans']) : null, 'fichier_url' => $S($c['fichierUrl'] ?? '', 2000),
        'res_pedago' => $S($c['resPedago'] ?? '', 50), 'apercu' => $S($c['apercu'] ?? '', 5000),
        'description' => $S($c['description'] ?? ($c['desc'] ?? ''), 5000),
    ];
}
refreshTable($pdo, 'elearning_contenus', ['id','categorie_id','titre','classe','matiere','sequence_name','prix','gratuit','plans','fichier_url','res_pedago','apercu','description'], $rows, $report);

jsonResponse(['ok' => true, 'mirrored_at' => date('c'), 'tables' => $report], 200);
