<?php
/**
 * api/migrate_protected.php — Migration one-shot vers le store protégé (Étape 2)
 * © 2024-2026 Jacques Miterand TAKOU (Mythe Errant). Tous droits réservés.
 * Œuvre protégée — Loi camerounaise n° 2000/011 + Convention de Berne.
 * Reproduction interdite sans accord écrit. Contrefaçon : 5-10 ans prison +
 * 500 000 à 10 000 000 FCFA d'amende. contact@veritas-school.com
 *
 * BUT — déplacer les médias e-learning PREMIUM aujourd'hui PUBLICS
 * (uploads/veritas/…, téléchargeables par URL) vers uploads/protected/ (deny-all),
 * et basculer chaque contenu de `fichierUrl` vers `fichierProtege`. Après ça, le
 * média n'est plus accessible qu'via api/content.php (contrôle d'abonnement).
 *
 * AUTH  — admin (Bearer API_SECRET, via config_sync::requireAuth).
 * MÉTHODE POST. IDEMPOTENT (un contenu déjà en fichierProtege est ignoré).
 * SÛR  — read-modify-write sous flock + sauvegarde horodatée ; ?dry=1 pour
 *        simuler sans rien déplacer ni écrire.
 */
declare(strict_types=1);

require_once __DIR__ . '/config_sync.php'; // CORS + requireAuth + Content-Type JSON
require_once __DIR__ . '/_auth_lib.php';   // vrt_db_file()

requireAuth();

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['ok' => false, 'error' => 'POST requis']);
    exit;
}

$dry = isset($_GET['dry']) && $_GET['dry'] !== '0';

$DB_FILE     = vrt_db_file();
$UPLOADS_DIR = dirname(__DIR__) . '/uploads';
$PROT_DIR    = $UPLOADS_DIR . '/protected';
$uploadsBase = realpath($UPLOADS_DIR);
if ($uploadsBase === false) { http_response_code(503); echo json_encode(['ok' => false, 'error' => 'uploads/ introuvable']); exit; }
if (!is_dir($PROT_DIR)) @mkdir($PROT_DIR, 0750, true);
// Filet : garantir le .htaccess deny-all du store protégé.
if (!is_file($PROT_DIR . '/.htaccess')) {
    @file_put_contents($PROT_DIR . '/.htaccess',
        "Require all denied\n<IfModule !mod_authz_core.c>\nOrder deny,allow\nDeny from all\n</IfModule>\nOptions -Indexes -ExecCGI\n");
}

if (!is_file($DB_FILE)) { http_response_code(503); echo json_encode(['ok' => false, 'error' => 'base absente']); exit; }

$fp = @fopen($DB_FILE, 'c+');
if (!$fp) { http_response_code(500); echo json_encode(['ok' => false, 'error' => 'ouverture impossible']); exit; }
if (!flock($fp, LOCK_EX)) { fclose($fp); http_response_code(503); echo json_encode(['ok' => false, 'error' => 'base occupée']); exit; }

$cur = stream_get_contents($fp);
$db  = json_decode((string) $cur, true);
if (!is_array($db)) { flock($fp, LOCK_UN); fclose($fp); http_response_code(503); echo json_encode(['ok' => false, 'error' => 'base illisible']); exit; }

/** Mappe une URL .../uploads/<reste> vers un chemin local sûr (anti-traversal). */
function _local_from_url(string $url, string $uploadsDir, string $uploadsBase): ?string {
    $urlPath = parse_url($url, PHP_URL_PATH);
    if (!$urlPath) return null;
    $pos = strpos($urlPath, '/uploads/');
    if ($pos === false) return null;
    $rel  = substr($urlPath, $pos + strlen('/uploads/'));
    $rel  = str_replace('\\', '/', $rel);
    $segs = array_filter(explode('/', $rel), function ($s) { return $s !== '' && $s !== '.' && $s !== '..'; });
    $cand = realpath($uploadsDir . '/' . implode('/', $segs));
    if ($cand === false || strpos($cand, $uploadsBase) !== 0 || !is_file($cand)) return null;
    return $cand;
}

$migrated = 0; $skipped = 0; $missing = 0; $details = [];
$contenus = (isset($db['elearning']['contenus']) && is_array($db['elearning']['contenus'])) ? $db['elearning']['contenus'] : [];

foreach ($contenus as $i => $c) {
    if (!is_array($c)) { continue; }
    if (!empty($c['fichierProtege'])) { $skipped++; continue; }      // déjà protégé
    if (empty($c['fichierUrl'])) { continue; }                        // rien à migrer (data:/idbKey/aucun)
    $src = _local_from_url((string) $c['fichierUrl'], $UPLOADS_DIR, $uploadsBase);
    if ($src === null) { $missing++; $details[] = ['id' => $c['id'] ?? '?', 'etat' => 'fichier introuvable', 'url' => $c['fichierUrl']]; continue; }
    // Déjà dans protected/ ? (ne devrait pas via fichierUrl, mais on sécurise)
    if (strpos($src, realpath($PROT_DIR) ?: ($PROT_DIR)) === 0) { $skipped++; continue; }

    $base = basename($src);
    $dest = $PROT_DIR . '/' . $base;
    if (is_file($dest)) { $base = 'vt_' . bin2hex(random_bytes(6)) . '.' . pathinfo($src, PATHINFO_EXTENSION); $dest = $PROT_DIR . '/' . $base; }

    if ($dry) {
        $migrated++; $details[] = ['id' => $c['id'] ?? '?', 'etat' => 'À MIGRER', 'de' => $src, 'vers' => $dest];
        continue;
    }

    $moved = @rename($src, $dest);
    if (!$moved) { if (@copy($src, $dest)) { @unlink($src); $moved = true; } }
    if (!$moved) { $missing++; $details[] = ['id' => $c['id'] ?? '?', 'etat' => 'déplacement échoué', 'de' => $src]; continue; }
    @chmod($dest, 0640);

    $db['elearning']['contenus'][$i]['fichierProtege'] = $base;
    unset($db['elearning']['contenus'][$i]['fichierUrl']);
    $migrated++;
    $details[] = ['id' => $c['id'] ?? '?', 'etat' => 'migré', 'fichierProtege' => $base];
}

if (!$dry && $migrated > 0) {
    // Sauvegarde horodatée avant écriture.
    $bkDir = dirname($DB_FILE) . '/_backups';
    if (!is_dir($bkDir)) @mkdir($bkDir, 0750, true);
    @file_put_contents($bkDir . '/veritas_db.' . date('Ymd_His') . '.' . bin2hex(random_bytes(3)) . '.migrate.json', $cur);

    $db['lastModified'] = (int) round(microtime(true) * 1000);
    $enc = json_encode($db, JSON_UNESCAPED_UNICODE);
    if ($enc === false) { flock($fp, LOCK_UN); fclose($fp); http_response_code(500); echo json_encode(['ok' => false, 'error' => 'encodage échoué — base inchangée']); exit; }
    ftruncate($fp, 0); rewind($fp); fwrite($fp, $enc); fflush($fp);
}

flock($fp, LOCK_UN);
fclose($fp);

echo json_encode([
    'ok'       => true,
    'dry_run'  => $dry,
    'migrated' => $migrated,
    'skipped'  => $skipped,
    'missing'  => $missing,
    'details'  => array_slice($details, 0, 200),
], JSON_UNESCAPED_UNICODE);
