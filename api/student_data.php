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
require_once __DIR__ . '/_json_boot.php'; // display_errors=0 + purge des parasites avant le JSON (voir _json_boot.php)

require_once __DIR__ . '/config_sync.php'; // CORS allowlist + préflight OPTIONS
require_once __DIR__ . '/_auth_lib.php';    // S3 v1.2.x : auth (bcrypt+S256), token, droits contenu

header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-store, no-cache, must-revalidate, max-age=0');
header('X-Content-Type-Options: nosniff');
header('Vary: Origin');

// ── Rate limiting par IP (anti credential-stuffing) — fichier plat ──
$rateDir = __DIR__ . '/data/_rate/';
if (!is_dir($rateDir)) @mkdir($rateDir, 0750, true);
require_once __DIR__ . '/_sentinel.php';
// v2.0 : plus de X-Forwarded-For — en-tete ecrit par le client, donc
// compteur remis a zero a volonte tant qu'aucun proxy n'est declare.
$ip = vrt_real_ip();
$ip = preg_replace('/[^0-9a-fA-F:.,]/', '', (string)$ip);
$ipHash = substr(md5($ip), 0, 16);
/* Lecture du forum par jeton : compteur À PART, plus large. Le plafond de 40
   vise le bourrage d'identifiants ; il ne concerne pas une lecture authentifiée
   par jeton signé. Or tout un centre sort souvent par UNE adresse IP (même
   Wi-Fi) : trente élèves sur le forum de leur classe, qui se rafraîchit
   seul, auraient épuisé les 40 et bloqué aussi les connexions. */
$peek = json_decode((string) file_get_contents('php://input'), true);
$lectureForum = is_array($peek) && (($peek['action'] ?? '') === 'forum_fetch') && !empty($peek['token']);
$rateMax  = $lectureForum ? 400 : 40;
$rateFile = $rateDir . ($lectureForum ? 'stufr_' : 'stud_') . $ipHash . '.txt';
$now = time();
$hits = [];
if (is_file($rateFile)) {
    $hits = array_filter(explode("\n", (string)@file_get_contents($rateFile)), function ($t) use ($now) {
        return $t !== '' && ($now - (int)$t) < 60;
    });
}
if (count($hits) >= $rateMax) {
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
$token  = (string)($in['token'] ?? '');   // S3 v1.3.x : auth par token (le client soumet sans renvoyer le mot de passe)
$login  = trim((string)($in['login'] ?? ''));
$pass   = (string)($in['password'] ?? '');
if ($token === '' && ($login === '' || $pass === '')) {
    http_response_code(400);
    echo json_encode(['ok' => false, 'error' => 'Identifiants ou token requis']);
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

// S3 v1.3.x — AUTH PAR TOKEN d'abord (le client soumet ses devoirs sans renvoyer
// le mot de passe ; token émis à la connexion, vérifié par _auth_lib).
if ($token !== '') {
    $tk = vrt_verify_token($token, $db);
    if ($tk !== null) { $acc = $tk['acc']; $accType = $tk['type']; }
}

// Sinon : auth login + mot de passe (bcrypt au repos OU S256 hérité, via _auth_lib).
if ($acc === null && $login !== '') {
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
    $pwNeedUpgrade = false;
    if ($acc !== null && !vrt_verify_password($pass, (string)($acc['pwd'] ?? ''), (string)$acc['user'], $pwNeedUpgrade)) {
        $acc = null; // mot de passe incorrect
    }
    /* Empreinte S256 (SHA-256 un tour, sel public) → bcrypt, une seule fois.
       Le drapeau existait depuis le début et n'était lu nulle part. */
    if ($acc !== null && $pwNeedUpgrade) { @vrt_upgrade_password_bcrypt((string)$acc['user'], $pass); }
}

if ($acc === null) {
    @file_put_contents(__DIR__ . '/data/_security_log.txt',
        date('c') . ' [STUDENT_AUTH_FAIL] ip=' . $ip . ' login=' . substr($login, 0, 40) . "\n", FILE_APPEND);
    http_response_code(401);
    echo json_encode(['ok' => false, 'error' => 'Authentification requise']);
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
            /* L'IDENTIFIANT DU COMPTE, SANS LEQUEL RIEN NE S'ACHÈTE.
               Tout l'octroi serveur retrouve un compte par son `id`. Cette
               tranche ne portait que `user` : sur un appareil neuf, le client
               n'avait donc que le login à poser dans la session, et c'est lui
               qui partait au paiement. Le livre numérique répondait « compte
               introuvable », l'abonnement se disait « activé » sans rien
               ouvrir. Le client ne pouvait PAS faire mieux — la valeur ne lui
               était jamais donnée. Elle l'est ici, après authentification, et
               c'est son propre identifiant : rien de neuf n'est exposé. */
            'id'    => (string) ($acc['id'] ?? ''),
            'user'  => $acc['user'],
            'type'  => $accType,
            'plans' => $acc['plans'] ?? [],
            'nom'   => $acc['nom'] ?? ($student['nom'] ?? ''),
            'pre'   => $acc['pre'] ?? ($student['pre'] ?? ''),
            'cls'   => $acc['cls'] ?? ($student['cls'] ?? ''),
            /* Les matières enseignées suivent le COMPTE, pas l'appareil.
               Elles ne vivaient que dans le localStorage : l'enseignant qui
               les cochait sur son ordinateur retrouvait, sur son téléphone,
               les épreuves de génie civil mêlées aux siennes — et devait
               tout recocher. Écrites par api/compte.php?action=profil,
               relues ici à chaque connexion. */
            'matieres'   => array_values(array_filter((array) ($acc['matieres'] ?? []), 'is_string')),
            'discipline' => (string) ($acc['discipline'] ?? ''),
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
        $texte = substr((string)($payload['texte'] ?? $payload['contenu'] ?? ''), 0, 20000);
        $sub = [
            'id'         => 'sub' . bin2hex(random_bytes(5)),
            'eid'        => $eid,                                          // ← fixé serveur
            'dvid'       => substr((string)($payload['dvid'] ?? ''), 0, 64),
            'texte'      => $texte,
            'contenu'    => $texte,                                        // alias lu par la vue prof
            'fichierUrl' => substr((string)($payload['fichierUrl'] ?? ''), 0, 500),
            'date'       => date('c'),
            'note'       => null,
            'commentaire' => '',
            'via'        => 'student_sync',
        ];
        // Idempotence : ne pas dupliquer si l'élève re-soumet le même devoir.
        $dup = false;
        foreach ($cdb['submissions'] as $exist) {
            if (is_array($exist) && (string)($exist['eid'] ?? '') === $eid && (string)($exist['dvid'] ?? '') === (string)$sub['dvid']) { $dup = true; break; }
        }
        if ($dup) { flock($fp, LOCK_UN); fclose($fp); echo json_encode(['ok' => true, 'duplicate' => true]); exit; }
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

// ── FORUM DES CLASSES VIRTUELLES ─────────────────────────────────────────────
/* Jusqu'ici un message d'élève ne quittait jamais son navigateur : le forum
   n'écrivait que dans localStorage, et seule la synchro ADMIN (db.php)
   atteignait le serveur. L'élève « postait », personne ne le lisait jamais.
   Ces actions font du serveur la source des messages, avec les mêmes règles
   que les soumissions : auteur fixé d'après l'identité authentifiée,
   propriétaire jamais pris dans l'entrée, écriture sous verrou.
   db.php conserve ces messages (`srv`) face à un envoi admin qui ne les
   contient pas, sauf s'ils figurent dans `forumDeleted` (suppression voulue). */
if (in_array($action, ['forum_fetch', 'forum_post', 'forum_like', 'forum_delete'], true)) {
    // mbstring n'est pas garanti sur l'hébergement (voir vrt_pd_coupe, public_data.php).
    $coupe = function (string $t, int $n): string {
        return function_exists('mb_substr') ? mb_substr($t, 0, $n) : substr($t, 0, $n);
    };
    $accId   = (string) ($acc['id'] ?? $eid);
    $role    = strtolower((string) ($acc['role'] ?? ''));
    $isProf  = ($role === 'enseignant') || !empty($acc['isTeacher']);
    // Classe de l'élève : sa fiche d'abord, le compte ensuite.
    // Le NOM aussi : un compte élève ne porte souvent que son identifiant de
    // connexion — c'est la fiche qui porte « Awa Ngono ».
    $clsNom = (string) ($acc['cls'] ?? '');
    $fiche = null;
    foreach (($db['students'] ?? []) as $s) {
        if (is_array($s) && (string) ($s['id'] ?? '') === $eid) { $fiche = $s; $clsNom = (string) ($s['cls'] ?? $clsNom); break; }
    }
    // Même clé que _cvDefaultClassrooms() côté client : 'cls_' + nom sans
    // caractère hors [a-z0-9] (les accents tombent des deux côtés : « 6ème » → 6me).
    $cleCls = function (string $nom): string { return strtolower((string) preg_replace('/[^a-z0-9]/i', '', $nom)); };

    $classes = (isset($db['classrooms']) && is_array($db['classrooms'])) ? $db['classrooms'] : [];
    $accede = function (array $cv) use ($eid, $accId, $clsNom, $isProf, $cleCls, $acc): bool {
        if ($isProf) return true;
        if (in_array($eid, (array) ($cv['membres'] ?? []), true) || in_array($accId, (array) ($cv['membres'] ?? []), true)) return true;
        foreach ((array) ($cv['students'] ?? []) as $st) {
            if (is_array($st) && (string) ($st['accountId'] ?? '') === $accId) return true;
        }
        if ($clsNom !== '' && (string) ($cv['nom'] ?? '') === $clsNom) return true;
        if (!empty($cv['seg']) && (string) ($acc['seg'] ?? '') === (string) $cv['seg']) return true;
        return false;
    };
    $mesClasses = [];
    foreach ($classes as $cv) {
        if (is_array($cv) && isset($cv['id']) && $accede($cv)) $mesClasses[(string) $cv['id']] = $cv;
    }
    // Base où l'administration n'a pas encore publié les classes : la classe
    // par défaut de l'élève (celle que le client affiche) reste utilisable.
    if ($clsNom !== '' && !$classes) {
        $k = $cleCls($clsNom);
        $mesClasses['cls_' . $k] = ['id' => 'cls_' . $k, 'nom' => $clsNom, 'channels' => [
            ['id' => 'ch_gen_' . $k], ['id' => 'ch_ann_' . $k, 'teacherOnly' => true],
            ['id' => 'ch_fr_' . $k], ['id' => 'ch_math_' . $k], ['id' => 'ch_sc_' . $k],
        ]];
    }

    if ($action === 'forum_fetch') {
        $posts = [];
        foreach ((array) ($db['forumPosts'] ?? []) as $p) {
            if (is_array($p) && isset($mesClasses[(string) ($p['classroomId'] ?? '')])) $posts[] = $p;
        }
        // Les plus récents d'abord, bornés : un forum actif ne doit pas faire
        // télécharger des mois d'historique à chaque rafraîchissement.
        usort($posts, function ($a, $b) { return strcmp((string) ($b['dateISO'] ?? ''), (string) ($a['dateISO'] ?? '')); });
        echo json_encode([
            'ok' => true,
            'classrooms' => array_keys($mesClasses),
            'posts' => array_slice($posts, 0, 400),
            'uid' => $eid,
            'server_time' => time(),
        ], JSON_UNESCAPED_UNICODE);
        exit;
    }

    $payload = $in['payload'] ?? [];
    if (!is_array($payload)) { http_response_code(400); echo json_encode(['ok' => false, 'error' => 'payload invalide']); exit; }

    $fp = fopen($DB_FILE, 'c+');
    if (!$fp || !flock($fp, LOCK_EX)) {
        if ($fp) fclose($fp);
        http_response_code(503); echo json_encode(['ok' => false, 'error' => 'Base occupée — réessayez']); exit;
    }
    $cur = stream_get_contents($fp);
    $cdb = json_decode((string) $cur, true);
    if (!is_array($cdb)) { flock($fp, LOCK_UN); fclose($fp); http_response_code(503); echo json_encode(['ok' => false, 'error' => 'Base illisible']); exit; }
    if (!isset($cdb['forumPosts']) || !is_array($cdb['forumPosts'])) $cdb['forumPosts'] = [];
    $refus = function (int $code, string $msg) use ($fp) {
        flock($fp, LOCK_UN); fclose($fp); http_response_code($code);
        echo json_encode(['ok' => false, 'error' => $msg], JSON_UNESCAPED_UNICODE); exit;
    };
    $nowIso = gmdate('Y-m-d\TH:i:s\Z');
    $nowMs  = (int) round(microtime(true) * 1000);
    $nomAuteur = trim((string) ($acc['pre'] ?? ($fiche['pre'] ?? '')) . ' ' . (string) ($acc['nom'] ?? ($fiche['nom'] ?? '')));
    if ($nomAuteur === '') $nomAuteur = (string) ($acc['user'] ?? 'Élève');
    $nomAuteur = $coupe($nomAuteur, 80);
    $typeAuteur = $isProf ? 'enseignant' : ($accType === 'eleve' ? 'eleve' : 'visiteur');
    $result = ['ok' => true];

    if ($action === 'forum_post') {
        $clsId = (string) ($payload['classroomId'] ?? '');
        $chId  = (string) ($payload['channelId'] ?? '');
        $texte = trim($coupe((string) ($payload['contenu'] ?? ''), 4000));
        $replyTo = (string) ($payload['replyTo'] ?? '');
        if ($texte === '') $refus(400, 'Message vide');
        if (!isset($mesClasses[$clsId])) $refus(403, 'Ce forum est réservé aux membres de la classe');
        $canal = null;
        foreach ((array) ($mesClasses[$clsId]['channels'] ?? []) as $c) {
            if (is_array($c) && (string) ($c['id'] ?? '') === $chId) { $canal = $c; break; }
        }
        if ($canal === null) $refus(404, 'Canal introuvable');
        if (!empty($canal['teacherOnly']) && !$isProf) $refus(403, 'Canal réservé aux enseignants');

        if ($replyTo !== '') {
            $trouve = false;
            foreach ($cdb['forumPosts'] as $i => $p) {
                if (!is_array($p) || (string) ($p['id'] ?? '') !== $replyTo) continue;
                if ((string) ($p['classroomId'] ?? '') !== $clsId) $refus(403, 'Message d\'une autre classe');
                $r = ['id' => 'r' . bin2hex(random_bytes(5)), 'auteurId' => $eid, 'auteurNom' => $nomAuteur,
                      'auteurType' => $typeAuteur, 'contenu' => $texte, 'date' => date('d/m/Y'),
                      'dateISO' => $nowIso, 'likes' => [], 'srv' => true, 'srvAt' => $nowMs];
                if (!isset($cdb['forumPosts'][$i]['replies']) || !is_array($cdb['forumPosts'][$i]['replies'])) $cdb['forumPosts'][$i]['replies'] = [];
                $cdb['forumPosts'][$i]['replies'][] = $r;
                $result['post'] = $cdb['forumPosts'][$i];
                $trouve = true; break;
            }
            if (!$trouve) $refus(404, 'Message d\'origine introuvable (supprimé ?)');
        } else {
            $types = $isProf ? ['discussion', 'question', 'ressource', 'devoir', 'annonce'] : ['discussion', 'question', 'ressource'];
            $type = (string) ($payload['type'] ?? 'discussion');
            if (!in_array($type, $types, true)) $type = 'discussion';
            $p = ['id' => 'fp' . bin2hex(random_bytes(6)), 'classroomId' => $clsId, 'channelId' => $chId,
                  'auteurId' => $eid, 'auteurNom' => $nomAuteur, 'auteurType' => $typeAuteur, 'type' => $type,
                  'titre' => $isProf ? $coupe(trim((string) ($payload['titre'] ?? '')), 150) : '',
                  'contenu' => $texte, 'date' => date('d/m/Y'), 'dateISO' => $nowIso,
                  'likes' => [], 'pinned' => false, 'replies' => [], 'srv' => true, 'srvAt' => $nowMs];
            $cdb['forumPosts'][] = $p;
            $result['post'] = $p;
        }
    } elseif ($action === 'forum_like') {
        $pid = (string) ($payload['postId'] ?? ''); $rid = (string) ($payload['replyId'] ?? '');
        $trouve = false;
        foreach ($cdb['forumPosts'] as $i => $p) {
            if (!is_array($p) || (string) ($p['id'] ?? '') !== $pid) continue;
            if (!isset($mesClasses[(string) ($p['classroomId'] ?? '')])) $refus(403, 'Message d\'une autre classe');
            $bascule = function (array $l) use ($eid): array {
                $k = array_search($eid, $l, true);
                if ($k === false) { $l[] = $eid; } else { array_splice($l, $k, 1); }
                return array_values($l);
            };
            if ($rid === '') {
                $cdb['forumPosts'][$i]['likes'] = $bascule((array) ($p['likes'] ?? []));
            } else {
                foreach ((array) ($p['replies'] ?? []) as $j => $r) {
                    if (is_array($r) && (string) ($r['id'] ?? '') === $rid) {
                        $cdb['forumPosts'][$i]['replies'][$j]['likes'] = $bascule((array) ($r['likes'] ?? []));
                    }
                }
            }
            $result['post'] = $cdb['forumPosts'][$i];
            $trouve = true; break;
        }
        if (!$trouve) $refus(404, 'Message introuvable');
    } else { // forum_delete — seulement ce qu'on a soi-même écrit
        $pid = (string) ($payload['postId'] ?? ''); $rid = (string) ($payload['replyId'] ?? '');
        $trouve = false;
        foreach ($cdb['forumPosts'] as $i => $p) {
            if (!is_array($p) || (string) ($p['id'] ?? '') !== $pid) continue;
            if ($rid === '') {
                if ((string) ($p['auteurId'] ?? '') !== $eid) $refus(403, 'Vous ne pouvez supprimer que vos propres messages');
                array_splice($cdb['forumPosts'], $i, 1);
                $result['deleted'] = $pid;
            } else {
                $reps = (array) ($p['replies'] ?? []);
                foreach ($reps as $j => $r) {
                    if (is_array($r) && (string) ($r['id'] ?? '') === $rid) {
                        if ((string) ($r['auteurId'] ?? '') !== $eid) $refus(403, 'Vous ne pouvez supprimer que vos propres réponses');
                        array_splice($reps, $j, 1);
                        break;
                    }
                }
                $cdb['forumPosts'][$i]['replies'] = array_values($reps);
                $result['post'] = $cdb['forumPosts'][$i];
            }
            $trouve = true; break;
        }
        if (!$trouve) $refus(404, 'Message introuvable');
    }

    $cdb['lastModified'] = $nowMs;
    $enc = json_encode($cdb, JSON_UNESCAPED_UNICODE);
    if ($enc === false) $refus(500, 'Encodage échoué');
    ftruncate($fp, 0); rewind($fp); fwrite($fp, $enc); fflush($fp);
    flock($fp, LOCK_UN); fclose($fp);
    @file_put_contents(__DIR__ . '/data/_access_log.txt',
        date('c') . ' STUDENT_' . strtoupper($action) . ' eid=' . $eid . ' ip=' . $ip . "\n", FILE_APPEND);
    echo json_encode($result, JSON_UNESCAPED_UNICODE);
    exit;
}

http_response_code(400);
echo json_encode(['ok' => false, 'error' => 'Action inconnue']);
