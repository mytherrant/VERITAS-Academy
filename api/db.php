<?php
require_once __DIR__ . '/_json_boot.php'; // display_errors=0 + purge des parasites avant le JSON (voir _json_boot.php)
/**
 * VÉRITAS Academy — api/db.php
 * © 2024-2026 Jacques Miterand TAKOU (Mythe Errant). Tous droits réservés.
 * Œuvre protégée — Loi camerounaise n° 2000/011 du 19 déc. 2000 + Convention de Berne.
 * Reproduction, distribution, modification interdites sans accord écrit.
 * Contrefaçon : 5-10 ans prison + 500 000 à 10 000 000 FCFA d'amende.
 * Contact : contact@veritas-school.com
 *
 * GET  → renvoie le JSON courant (authentification requise)
 * POST application/json → sauvegarde la DB synchronisée
 *
 * 🔐 SÉCURITÉ v1.2 :
 *   - Authentification Bearer obligatoire (utilise config_sync.php → requireAuth)
 *   - Rate limiting : 60 requêtes par minute par IP
 *   - Audit log des accès suspects
 *   - Validation taille du payload
 */
require_once __DIR__ . '/config_sync.php';

// ── 🔐 Rate limiting simple basé sur IP (file plat, sans Redis) ──
$rateDir = __DIR__ . '/data/_rate/';
if (!is_dir($rateDir)) @mkdir($rateDir, 0750, true);
require_once __DIR__ . '/_sentinel.php';
// v2.0 : plus de X-Forwarded-For — en-tete ecrit par le client, donc
// compteur remis a zero a volonte tant qu'aucun proxy n'est declare.
$ip = vrt_real_ip();
$ip = preg_replace('/[^0-9a-fA-F:.,]/','', $ip);
$ipHash = substr(md5($ip), 0, 16);
$rateFile = $rateDir . 'db_' . $ipHash . '.txt';
$now = time();
$hits = [];
if (file_exists($rateFile)) {
    $hits = array_filter(explode("\n", file_get_contents($rateFile)), function($t) use ($now){
        return $t && ($now - intval($t)) < 60;
    });
}
if (count($hits) >= 60) {
    http_response_code(429);
    echo json_encode(['ok'=>false,'error'=>'Trop de requêtes — réessayez dans 1 minute']);
    // Log l'attaque potentielle
    @file_put_contents(__DIR__.'/data/_security_log.txt',
        date('c').' [RATE_LIMIT] db.php ip='.$ip.' hits='.count($hits)."\n", FILE_APPEND);
    exit;
}
$hits[] = $now;
@file_put_contents($rateFile, implode("\n", $hits));

// ── Headers de sécurité ──
header('Strict-Transport-Security: max-age=31536000; includeSubDomains');
header('X-Content-Type-Options: nosniff');
header('X-Frame-Options: SAMEORIGIN');
header('Referrer-Policy: strict-origin-when-cross-origin');
header('Permissions-Policy: geolocation=(), microphone=(), camera=()');
// 🔄 v1.2.2 : interdire toute mise en cache de la base (sinon LiteSpeed/CDN sert
// une version périmée → les autres appareils ne voient pas les dernières données).
header('Cache-Control: no-store, no-cache, must-revalidate, max-age=0');
header('Pragma: no-cache');
header('X-LiteSpeed-Cache-Control: no-cache, esi=off');
header('Vary: Authorization');
// On a déjà CORS depuis config_sync.php
header('Content-Type: application/json; charset=utf-8');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') { http_response_code(204); exit; }

// ── 🔐 Authentification OBLIGATOIRE (correction faille critique v1.2) ──
requireAuth();

$DATA_DIR = dirname(__DIR__) . '/data';
$DB_FILE  = $DATA_DIR . '/veritas_db.json';
$META_FILE = $DATA_DIR . '/veritas_db.meta.json'; // sidecar léger : {rev, lastModified, size}
if (!is_dir($DATA_DIR)) mkdir($DATA_DIR, 0750, true);
// 🔐 v1.2.1 : garantir la protection du dossier data/ MÊME si le déploiement l'oublie.
//    Sans cela, /data/veritas_db.json serait téléchargeable directement (toute la base, sans token).
if (!is_file($DATA_DIR . '/.htaccess')) {
    @file_put_contents($DATA_DIR . '/.htaccess',
        "# Aucun accès HTTP direct aux données VÉRITAS\nRequire all denied\n<IfModule !mod_authz_core.c>\nOrder deny,allow\nDeny from all\n</IfModule>\n");
}
if (!is_file($DATA_DIR . '/index.php')) {
    @file_put_contents($DATA_DIR . '/index.php', "<?php http_response_code(403); exit;\n");
}

/* GET */
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    // ── v1.2.3 ?meta=1 : métadonnées LÉGÈRES (rev/lastModified/size) sans renvoyer
    //    toute la base → le client détecte un conflit avant d'écrire sans télécharger
    //    plusieurs Mo à chaque pré-vérification de sauvegarde. ──
    if (isset($_GET['meta'])) {
        if (is_file($META_FILE)) {
            echo (string) @file_get_contents($META_FILE);
        } elseif (is_file($DB_FILE)) {
            $d = json_decode((string) file_get_contents($DB_FILE), true);
            echo json_encode([
                'rev'          => 0,
                'lastModified' => (is_array($d) && isset($d['lastModified'])) ? $d['lastModified'] : null,
                'size'         => filesize($DB_FILE),
            ]);
        } else {
            echo json_encode(['rev' => 0, 'lastModified' => null, 'size' => 0]);
        }
        exit;
    }
    if (file_exists($DB_FILE)) {
        $c = file_get_contents($DB_FILE);
        json_decode($c);
        echo (json_last_error() === JSON_ERROR_NONE) ? $c : '{}';
    } else { echo '{}'; }
    exit;
}

/* POST ou PUT — écriture de la base.
   🐛 v1.2.3 FIX CRITIQUE : le client pousse en PUT (héritage de la migration
   Firebase→PHP : save(), cloudSaveDB(), _cloudSilentPushDB(), forceFullSync()
   appellent tous _fbFetch(LWS_API.db, {method:'PUT'})). Or db.php ne gérait que
   POST → renvoyait 405 sur chaque PUT → la synchro serveur ne s'écrivait JAMAIS
   (les données ne vivaient qu'en localStorage, perdues au changement d'appareil
   ou au vidage du cache). On accepte désormais les deux verbes.
   Accepter PUT est sans risque : cela ne peut que réparer le chemin PUT, jamais
   casser le chemin POST (filet de secours _backupDBToLWS) ni les lectures GET. */
if ($_SERVER['REQUEST_METHOD'] === 'POST' || $_SERVER['REQUEST_METHOD'] === 'PUT') {
    $raw = file_get_contents('php://input');
    if (!$raw) { http_response_code(400); echo json_encode(['ok'=>false,'error'=>'Corps vide']); exit; }
    if (strlen($raw) > 20*1024*1024) { http_response_code(413); echo json_encode(['ok'=>false,'error'=>'Données > 20 Mo']); exit; }
    $data = json_decode($raw, true);
    if ($data === null) { http_response_code(400); echo json_encode(['ok'=>false,'error'=>'JSON invalide']); exit; }

    /* ── 🩺 SONDE D'ÉCRITURE — « Tester la connexion » doit tester CE chemin ──
       LE 02/09/2026, L'ÉCRAN D'ADMINISTRATION SE CONTREDISAIT. Il affichait
       « Connexion réussie ! Le serveur répond correctement » ET « Plus aucune
       sauvegarde depuis 5 jours ». Les deux étaient vrais : le bouton de test
       faisait un GET sur `files.php` — une LECTURE, sur un AUTRE endpoint —
       pendant que la sauvegarde écrit ici, en PUT. Le test ne pouvait donc pas
       voir la panne qu'on lui demandait de chercher, et il rassurait à tort.
       Déjà vu du 12 au 25/08 : treize jours de saisies dans un seul navigateur,
       derrière une pastille verte.

       Cette sonde emprunte le chemin RÉEL, celui qui échouait : même endpoint,
       même verbe PUT (que l'hébergeur pourrait refuser à lui seul), même
       `requireAuth()`. Elle vérifie en plus que le dossier de données est
       inscriptible — un disque plein ou un droit changé par un dépôt FTP ne se
       voient d'aucune autre façon avant la prochaine sauvegarde.

       Elle ne touche PAS à la base : elle écrit un fichier temporaire de un
       octet, le relit, l'efface. Placée ici, elle passe après l'authentification
       et la validation du JSON, mais avant tout ce qui remplace quoi que ce
       soit — y compris le garde-fou anti-écrasement, qui refuserait ce petit
       corps avec un 409 trompeur. */
    if (!empty($data['__probe'])) {
        $dir = is_dir($DATA_DIR) ? $DATA_DIR : dirname($DB_FILE);
        if (!is_dir($dir)) { @mkdir($dir, 0750, true); }
        $tmp   = $dir . '/.probe_' . bin2hex(random_bytes(4)) . '.tmp';
        $ecrit = @file_put_contents($tmp, '1') === 1 && @file_get_contents($tmp) === '1';
        @unlink($tmp);
        http_response_code($ecrit ? 200 : 500);
        echo json_encode([
            'ok'           => $ecrit,
            'probe'        => true,
            'method'       => (string) ($_SERVER['REQUEST_METHOD'] ?? ''),
            'writable'     => $ecrit,
            'error'        => $ecrit ? null
                : 'Le serveur accepte la requête mais ne peut pas ÉCRIRE dans son dossier de données.',
            'lastModified' => is_file($DB_FILE) ? (int) filemtime($DB_FILE) : 0,
            'bytes'        => is_file($DB_FILE) ? (int) filesize($DB_FILE) : 0,
        ], JSON_UNESCAPED_UNICODE);
        exit;
    }
    // ── 🔐 Détecter et BLOQUER les payloads contenant des mots de passe en clair ──
    if (preg_match('/"pwd"\s*:\s*"(?!S256\$|S256!|S256-)[^"]{1,40}"/', $raw, $m)) {
        @file_put_contents(__DIR__.'/data/_security_log.txt',
            date('c').' [PLAIN_PWD_REJECTED] db.php ip='.$ip.' pattern='.substr($m[0],0,80)."\n", FILE_APPEND);
        http_response_code(400);
        echo json_encode(['ok'=>false,'error'=>'Mot de passe en clair détecté — refus pour sécurité']);
        exit;
    }

    // ── 🛟 v1.2.3 Garde-fou anti-écrasement catastrophique ──────────────────
    // Empêche qu'un état client vide / à moitié initialisé n'écrase une vraie base.
    // Seuil ultra-conservateur (un payload < 2 Ko remplaçant une base > 50 Ko est
    // forcément un bug : la base par défaut seule pèse déjà bien plus). Aucun
    // risque de faux positif sur une vraie sauvegarde.
    $existsLen = is_file($DB_FILE) ? (int) filesize($DB_FILE) : 0;
    if ($existsLen > 50000 && strlen($raw) < 2000) {
        @file_put_contents(__DIR__ . '/data/_security_log.txt',
            date('c') . ' [TINY_OVERWRITE_BLOCKED] db.php ip=' . $ip
            . ' new=' . strlen($raw) . 'o vs existant=' . $existsLen . "o\n", FILE_APPEND);
        http_response_code(409);
        echo json_encode(['ok' => false, 'error' =>
            'Écriture refusée : données anormalement petites (' . strlen($raw)
            . ' o) face à une base de ' . $existsLen . ' o. Rechargez la page puis réessayez.']);
        exit;
    }

    /* ── 🛟 PRÉSERVER LES COMPTES NÉS CÔTÉ SERVEUR ───────────────────────────
       Cet endpoint remplace la base ENTIÈRE par la copie que l'administrateur
       a dans son navigateur. Tant que les comptes ne naissaient que dans des
       navigateurs, cela ne se voyait pas. Depuis api/compte.php, un visiteur
       peut s'inscrire directement sur le serveur — et la première synchro
       admin qui suivait effaçait son compte sans un mot, rouvrant le bug
       qu'on venait de fermer (« Identifiants invalides » à l'Atelier).

       Règle de conservation, volontairement étroite : on ne rattrape QUE les
       comptes marqués `srvCreated` que la copie poussée ne contient pas, et
       seulement s'ils sont nés APRÈS le `lastModified` de cette copie —
       autrement dit ceux que l'administrateur ne pouvait pas connaître quand
       il a chargé sa page. Un compte plus ancien absent de la copie, lui, a
       été VOLONTAIREMENT supprimé depuis l'administration : le ressusciter
       rendrait toute suppression impossible.
       Sans `lastModified` exploitable, on conserve (perdre un inscrit est
       plus grave que garder un compte supprimé une synchro de trop). */
    $preserves = [];
    if (is_file($DB_FILE) && isset($data['visitorAccounts']) && is_array($data['visitorAccounts'])) {
        $srvDb = json_decode((string) @file_get_contents($DB_FILE), true);
        if (is_array($srvDb) && !empty($srvDb['visitorAccounts']) && is_array($srvDb['visitorAccounts'])) {
            $connus = [];
            foreach ($data['visitorAccounts'] as $a) {
                if (is_array($a) && isset($a['user'])) $connus[strtolower((string) $a['user'])] = true;
            }
            $refLm = (int) ($data['lastModified'] ?? 0);
            foreach ($srvDb['visitorAccounts'] as $a) {
                if (!is_array($a) || !isset($a['user'])) continue;
                if (isset($connus[strtolower((string) $a['user'])])) continue; // déjà dans la copie poussée
                if (empty($a['srvCreated'])) continue;                          // compte ordinaire → absence = suppression
                $ne = (int) ($a['srvAt'] ?? 0);
                if ($refLm > 0 && $ne > 0 && $ne < $refLm) continue;            // l'admin le connaissait, il l'a retiré
                $preserves[] = $a;
            }
        }
    }
    if ($preserves) {
        $data['visitorAccounts'] = array_merge($data['visitorAccounts'], $preserves);
        $reEnc = json_encode($data, JSON_UNESCAPED_UNICODE);
        // Si le ré-encodage échoue, on écrit le payload d'origine : mieux vaut
        // perdre la préservation qu'écrire un JSON tronqué sur la base.
        if ($reEnc !== false) {
            $raw = $reEnc;
            @file_put_contents(__DIR__ . '/data/_access_log.txt',
                date('c') . ' MERGE_KEEP ' . count($preserves)
                . ' compte(s) serveur preserve(s) ip=' . $ip . "\n", FILE_APPEND);
        }
    }

    // ── 💾 v1.2.3 Sauvegarde horodatée AVANT écrasement (rétention 30) ───────
    // La synchro est en « dernière écriture gagne » (le verrou optimiste côté
    // client est inopérant). Cette copie convertit une perte SILENCIEUSE en perte
    // RÉCUPÉRABLE : si un appareil clobber les données d'un autre, la version
    // précédente reste dans data/_backups/ (protégé par data/.htaccess).
    if (is_file($DB_FILE)) {
        $bkDir = $DATA_DIR . '/_backups';
        if (!is_dir($bkDir)) @mkdir($bkDir, 0750, true);
        @copy($DB_FILE, $bkDir . '/veritas_db.' . date('Ymd_His') . '.'
            . bin2hex(random_bytes(3)) . '.json');
        $bks = glob($bkDir . '/veritas_db.*.json');
        if ($bks && count($bks) > 30) {
            sort($bks);
            foreach (array_slice($bks, 0, count($bks) - 30) as $old) { @unlink($old); }
        }
    }

    $tmp = $DB_FILE . '.tmp';
    if (file_put_contents($tmp, $raw, LOCK_EX) === false) { http_response_code(500); echo json_encode(['ok'=>false,'error'=>'Écriture impossible']); exit; }
    if (!rename($tmp, $DB_FILE)) { @unlink($tmp); http_response_code(500); echo json_encode(['ok'=>false,'error'=>'Rename échoué']); exit; }
    // ── v1.2.3 Mettre à jour le sidecar de métadonnées (rev monotone + lastModified) ──
    $rev = 0;
    if (is_file($META_FILE)) {
        $mPrev = json_decode((string) @file_get_contents($META_FILE), true);
        if (is_array($mPrev) && isset($mPrev['rev'])) $rev = (int) $mPrev['rev'];
    }
    $rev++;
    @file_put_contents($META_FILE, json_encode([
        'rev'          => $rev,
        'lastModified' => $data['lastModified'] ?? null,
        'size'         => strlen($raw),
        'time'         => time(),
    ]));
    // Log accès succès (rotation à 1000 lignes)
    $logF = __DIR__.'/data/_access_log.txt';
    @file_put_contents($logF, date('c').' SAVE '.round(strlen($raw)/1024).'kb ip='.$ip."\n", FILE_APPEND);
    if (file_exists($logF) && filesize($logF) > 100000) {
        $lines = file($logF);
        @file_put_contents($logF, implode('', array_slice($lines, -500)));
    }
    echo json_encode(['ok'=>true,'rev'=>$rev,'size_ko'=>round(strlen($raw)/1024,1),'lastModified'=>$data['lastModified']??null,'time'=>time()]);
    exit;
}

http_response_code(405); echo json_encode(['ok'=>false,'error'=>'Méthode non autorisée']);
