<?php
/**
 * api/student_data.php — Synchronisation PAR UTILISATEUR (élèves/parents) — S3 v1
 * © 2024-2026 Jacques Miterand TAKOU (Mythe Errant). Tous droits réservés.
 * Œuvre protégée — Loi camerounaise n° 2000/011 + Convention de Berne.
 * Reproduction interdite sans accord écrit. Contrefaçon : 5-10 ans prison +
 * 500 000 à 10 000 000 FCFA d'amende. contact@veritas-school.com
 *
 * BUT
 *   Permettre à un élève/parent de CONSULTER ses données (notes, paiements,
 *   absences, devoirs) et d'ÉCRIRE ce qui LUI appartient (soumission de devoir,
 *   progression) depuis N'IMPORTE QUEL appareil — sans la clé admin, et sans
 *   jamais exposer les données des autres élèves.
 *
 * AUTH (frontière de sécurité)
 *   login (matricule/identifiant) + mot de passe, vérifiés contre le hash DÉJÀ
 *   stocké dans veritas_db.json. Schéma identique au client (hashPassword) :
 *       'S256$' + sha256( pwd . '$' . <user> . '$2026' )
 *   où le sel est le champ `user` du compte. Comparaison à temps constant.
 *   Le serveur fixe TOUJOURS le propriétaire (eid) d'après l'identité
 *   authentifiée — jamais depuis l'entrée client (anti-usurpation).
 *
 * ⚠️ CONCURRENCE — l'écriture fait read-modify-write sous flock(LOCK_EX) sur la
 *   base partagée + sauvegarde horodatée (data/_backups). L'écriture est
 *   APPEND-ONLY (ajout d'une soumission de l'élève) → fenêtre de clobber minime.
 *   Une montée en charge réelle nécessitera un store séparé (roadmap v40).
 *
 * SÉCURITÉ — rate-limit IP, erreurs génériques, payload borné, S256 uniquement
 *   (les comptes legacy en clair/H$ doivent se loguer une fois sur un appareil
 *   qui possède le compte pour s'upgrader en S256), aucune écriture hors
 *   whitelist d'actions, jamais de mot de passe renvoyé.
 */
declare(strict_types=1);

require_once __DIR__ . '/config_sync.php'; // CORS allowlist + préflight OPTIONS
require_once __DIR__ . '/_auth_lib.php';    // S3 v1.2.x : auth (bcrypt+S256), token, droits contenu

header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-store, no-cache, must-revalidate, max-age=0');
header('X-Content-Type-Options: nosniff');
header('Vary: Origin');

// ── Rate limiting par IP (anti credential-stuffing) — fichier plat ──
$rateDir = __DIR__ . '/data/_rate/';
if (!is_dir($rateDir)) @mkdir($rateDir, 0750, true);
$ip = $_SERVER['HTTP_CF_CONNECTING_IP'] ?? $_SERVER['HTTP_X_FORWARDED_FOR'] ?? $_SERVER['REMOTE_ADDR'] ?? 'unknown';
$ip = preg_replace('/[^0-9a-fA-F:.,]/', '', (string)$ip);
$ipHash = substr(md5($ip), 0, 16);
$rateFile = $rateDir . 'stud_' . $ipHash . '.txt';
$now = time();
$hits = [];
if (is_file($rateFile)) {
    $hits = array_filter(explode("\n", (string)@file_get_contents($rateFile)), function ($t) use ($now) {
        return $t !== '' && ($now - (int)$t) < 60;
    });
}
if (count($hits) >= 40) {
    http_response_code(429);
    echo json_encode(['ok' => false, 'error' => 'Trop de requêtes — réessayez dans 1 minute']);
    @file_put_contents(__DIR__ . '/data/_security_log.txt',
        date('c') . ' [STUDENT_RATE_LIMIT] ip=' . $ip . "\n", FILE_APPEND);
    exit;
}
$hits[] = $now;
@file_put_contents($rateFile, implode("\n", $hits));

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['ok' => false, 'error' => 'POST requis']);
    exit;
}

$raw = file_get_contents('php://input');
if ($raw === false || $raw === '' || strlen($raw) > 2 * 1024 * 1024) {
    http_response_code(400);
    echo json_encode(['ok' => false, 'error' => 'Requête invalide']);
    exit;
}
$in = json_decode($raw, true);
if (!is_array($in)) {
    http_response_code(400);
    echo json_encode(['ok' => false, 'error' => 'JSON invalide']);
    exit;
}

$action = (string)($in['action'] ?? 'fetch');
$login  = trim((string)($in['login'] ?? ''));
$pass   = (string)($in['password'] ?? '');
if ($login === '' || $pass === '') {
    http_response_code(400);
    echo json_encode(['ok' => false, 'error' => 'Identifiants requis']);
    exit;
}

// veritas_db.json vit à la RACINE/data (comme db.php), pas dans api/data.
$DATA_DIR = dirname(__DIR__) . '/data';
$DB_FILE  = $DATA_DIR . '/veritas_db.json';
if (!is_file($DB_FILE)) {
    http_response_code(503);
    echo json_encode(['ok' => false, 'error' => 'Base indisponible']);
    exit;
}

/** Réplique exacte de hashPassword() côté client. */
function veritas_hash(string $plain, string $salt): string {
    return 'S256$' . hash('sha256', $plain . '$' . ($salt !== '' ? $salt : 'VERITAS') . '$2026');
}

// ── Charger la base + authentifier ───────────────────────────────────────────
$db = json_decode((string)file_get_contents($DB_FILE), true);
if (!is_array($db)) {
    http_response_code(503);
    echo json_encode(['ok' => false, 'error' => 'Base illisible']);
    exit;
}

$acc = null;
$accType = null;
$lc = strtolower($login);
foreach (($db['studentAccounts'] ?? []) as $a) {
    if (isset($a['user']) && strtolower((string)$a['user']) === $lc) { $acc = $a; $accType = 'eleve'; break; }
}
if ($acc === null) {
    foreach (($db['visitorAccounts'] ?? []) as $a) {
        if (isset($a['user']) && strtolower((string)$a['user']) === $lc && (($a['statut'] ?? '') !== 'suspendu')) {
            $acc = $a; $accType = 'visiteur'; break;
        }
    }
}

// S3 v1.2.x : vérification déléguée à _auth_lib (supporte bcrypt au repos ET
// S256 hérité ; $pwNeedUpgrade=true quand le compte gagnerait à passer en bcrypt).
$authOk = false;
$pwNeedUpgrade = false;
if ($acc !== null) {
    $authOk = vrt_verify_password($pass, (string)($acc['pwd'] ?? ''), (string)$acc['user'], $pwNeedUpgrade);
}
if (!$authOk) {
    @file_put_contents(__DIR__ . '/data/_security_log.txt',
        date('c') . ' [STUDENT_AUTH_FAIL] ip=' . $ip . ' login=' . substr($login, 0, 40) . "\n", FILE_APPEND);
    http_response_code(401);
    echo json_encode(['ok' => false, 'error' => 'Identifiants incorrects']);
    exit;
}

// Identité authentifiée — source de vérité du propriétaire (jamais depuis le client).
$eid = (string)($acc['eid'] ?? $acc['id'] ?? '');

/** Filtre un tableau d'enregistrements sur le propriétaire (eid/studentId/sid). */
function _by_owner(array $arr, string $eid): array {
    $out = [];
    foreach ($arr as $x) {
        if (!is_array($x)) continue;
        $owner = (string)($x['eid'] ?? $x['studentId'] ?? $x['sid'] ?? '');
        if ($owner !== '' && $owner === $eid) $out[] = $x;
    }
    return array_values($out);
}

// ── Lecture : renvoie UNIQUEMENT la tranche de l'utilisateur ──────────────────
if ($action === 'fetch') {
    $student = null;
    foreach (($db['students'] ?? []) as $s) {
        if (is_array($s) && (string)($s['id'] ?? '') === $eid) { $student = $s; break; }
    }
    if (is_array($student)) { unset($student['pwd'], $student['pwdHash']); }

    $school = is_array($db['school'] ?? null) ? $db['school'] : [];
    $schoolPub = [
        'nom'    => $school['nom'] ?? 'VÉRITAS',
        'ville'  => $school['ville'] ?? '',
        'slogan' => $school['slogan'] ?? '',
    ];

    // ── S3 v1.2.x (Étape 2) : liste des contenus AUTORISÉS pour ce compte ──
    // Métadonnées uniquement (jamais les octets) → l'octet passe par content.php
    // après re-vérification des droits. Réplique exacte de l'entitlement client.
    $contenusAutorises = [];
    foreach (($db['elearning']['contenus'] ?? []) as $c) {
        if (!is_array($c)) continue;
        if (!vrt_account_can_access($acc, $c, $db)) continue;
        $contenusAutorises[] = [
            'id'             => $c['id'] ?? '',
            'titre'          => $c['titre'] ?? ($c['nom'] ?? ''),
            'type'           => $c['type'] ?? '',
            'cat'            => $c['cat'] ?? ($c['categorie'] ?? ''),
            'cls'            => $c['cls'] ?? '',
            'matiere'        => $c['matiere'] ?? '',
            'plans'          => $c['plans'] ?? [],
            'fichier'        => $c['fichier'] ?? '',
            'fileType'       => $c['fileType'] ?? '',
            // Lisible via content.php (par id) seulement si le média est dans le store protégé.
            'fichierProtege' => $c['fichierProtege'] ?? '',
            'serveViaGate'   => !empty($c['fichierProtege']),
        ];
    }

    echo json_encode([
        'ok'      => true,
        // S3 v1.2.x (Étape 3) : token par compte → content.php sans renvoyer le mot de passe.
        'token'   => vrt_issue_token($acc, (string) $accType),
        'account' => [
            'user'  => $acc['user'],
            'type'  => $accType,
            'plans' => $acc['plans'] ?? [],
            'nom'   => $acc['nom'] ?? ($student['nom'] ?? ''),
            'pre'   => $acc['pre'] ?? ($student['pre'] ?? ''),
            'cls'   => $acc['cls'] ?? ($student['cls'] ?? ''),
        ],
        'student'           => $student,
        'grades'            => _by_owner($db['grades'] ?? [], $eid),
        'payments'          => _by_owner($db['payments'] ?? [], $eid),
        'absences'          => _by_owner($db['absences'] ?? [], $eid),
        'submissions'       => _by_owner($db['submissions'] ?? [], $eid),
        'devoirs'           => $db['devoirs'] ?? [],   // énoncés communs (non sensibles)
        'contenusAutorises' => $contenusAutorises,
        'lastModified'      => $db['lastModified'] ?? 0,
        'server_time'       => time(),
    ], JSON_UNESCAPED_UNICODE);
    exit;
}

// ── Écritures : read-modify-write sous verrou exclusif, propriétaire = serveur ─
if ($action === 'submit' || $action === 'progress') {
    $payload = $in['payload'] ?? [];
    if (!is_array($payload)) {
        http_response_code(400);
        echo json_encode(['ok' => false, 'error' => 'payload invalide']);
        exit;
    }

    $fp = fopen($DB_FILE, 'c+');
    if (!$fp) {
        http_response_code(500);
        echo json_encode(['ok' => false, 'error' => 'Ouverture impossible']);
        exit;
    }
    if (!flock($fp, LOCK_EX)) {
        fclose($fp);
        http_response_code(503);
        echo json_encode(['ok' => false, 'error' => 'Base occupée — réessayez']);
        exit;
    }
    $cur = stream_get_contents($fp);
    $cdb = json_decode((string)$cur, true);
    if (!is_array($cdb)) {
        flock($fp, LOCK_UN);
        fclose($fp);
        http_response_code(503);
        echo json_encode(['ok' => false, 'error' => 'Base illisible']);
        exit;
    }

    // Sauvegarde horodatée avant modification (récupérable en cas de souci).
    $bkDir = $DATA_DIR . '/_backups';
    if (!is_dir($bkDir)) @mkdir($bkDir, 0750, true);
    @file_put_contents($bkDir . '/veritas_db.' . date('Ymd_His') . '.' . bin2hex(random_bytes(3)) . '.stud.json', $cur);
    $bks = glob($bkDir . '/veritas_db.*.json');
    if ($bks && count($bks) > 40) {
        sort($bks);
        foreach (array_slice($bks, 0, count($bks) - 40) as $old) { @unlink($old); }
    }

    $result = ['ok' => true];
    if ($action === 'submit') {
        if (!isset($cdb['submissions']) || !is_array($cdb['submissions'])) $cdb['submissions'] = [];
        $sub = [
            'id'         => 'sub' . bin2hex(random_bytes(5)),
            'eid'        => $eid,                                          // ← fixé serveur
            'dvid'       => substr((string)($payload['dvid'] ?? ''), 0, 64),
            'texte'      => substr((string)($payload['texte'] ?? ''), 0, 20000),
            'fichierUrl' => substr((string)($payload['fichierUrl'] ?? ''), 0, 500),
            'date'       => date('c'),
            'via'        => 'student_sync',
        ];
        $cdb['submissions'][] = $sub;
        $result['submission'] = $sub;
    } else { // progress
        if (!isset($cdb['studentProgress']) || !is_array($cdb['studentProgress'])) $cdb['studentProgress'] = [];
        $progJson = json_encode($payload['progress'] ?? []);
        $cdb['studentProgress'][$eid] = json_decode(substr((string)$progJson, 0, 8000), true) ?: [];
    }
    $cdb['lastModified'] = (int)round(microtime(true) * 1000);

    $enc = json_encode($cdb, JSON_UNESCAPED_UNICODE);
    if ($enc === false) {
        flock($fp, LOCK_UN);
        fclose($fp);
        http_response_code(500);
        echo json_encode(['ok' => false, 'error' => 'Encodage échoué']);
        exit;
    }
    ftruncate($fp, 0);
    rewind($fp);
    fwrite($fp, $enc);
    fflush($fp);
    flock($fp, LOCK_UN);
    fclose($fp);

    @file_put_contents(__DIR__ . '/data/_access_log.txt',
        date('c') . ' STUDENT_' . strtoupper($action) . ' eid=' . $eid . ' ip=' . $ip . "\n", FILE_APPEND);
    echo json_encode($result, JSON_UNESCAPED_UNICODE);
    exit;
}

http_response_code(400);
echo json_encode(['ok' => false, 'error' => 'Action inconnue']);
