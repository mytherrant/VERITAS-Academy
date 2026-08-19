<?php
/**
 * api/livret.php — PORTE DES LIVRETS EN LIGNE (« Mon Cahier de français »)
 * © 2024-2026 Jacques Miterand TAKOU (Mythe Errant). Tous droits réservés.
 * Œuvre protégée — Loi camerounaise n° 2000/011 + Convention de Berne.
 *
 * BUT — vendre l'accès aux livrets interactifs (6ᵉ/5ᵉ/4ᵉ/3ᵉ) et aux guides
 * enseignant sans jamais livrer le contenu à qui n'a pas payé.
 *
 * CE QUI ÉTAIT OUVERT AVANT — et que ce fichier ferme :
 *   • `tryUnlock()` comparait la saisie à 'VERITAS2026', écrit EN CLAIR dans la
 *     page : le code se lisait d'un Ctrl+U, et l'indice « Démo : tape VERITAS2026 »
 *     s'affichait sous le champ.
 *   • Le calque « Livret verrouillé » n'était qu'un calque : le contenu était
 *     déjà rendu derrière. Le supprimer dans l'inspecteur suffisait.
 *   • `booklet-data-*.js` ET `guide-data-*.js` — le livret vendu ET ses corrigés,
 *     450 Ko chacun — partaient en <script src> AVANT toute vérification, à une
 *     URL stable, donc téléchargeables par n'importe qui, sans même ouvrir la page.
 *
 * MODÈLE DE SÉCURITÉ (mêmes principes que api/teacher_access.php)
 *   1. Les données vivent dans uploads/protected/livrets/ (hors web, .htaccess
 *      deny). Aucune URL directe : tout passe par cet endpoint.
 *   2. Codes uniques par achat, stockés en EMPREINTE À CLÉ (HMAC-SHA256 avec
 *      VRT_HMAC_KEY) — cf. api/_livret_lib.php.
 *   3. Jeton HMAC court (12 h élève / 8 h enseignant) LIÉ AU POSTE (empreinte
 *      IP+agent) : une URL recopiée dans un groupe WhatsApp ne vaut rien.
 *   4. Quota d'appareils par code (3 élève / 2 enseignant) ET session unique :
 *      un code qui circule déconnecte le précédent porteur au lieu de servir
 *      toute une classe en parallèle.
 *   5. Rate-limit IP + verrouillage après 5 échecs / 15 min : la porte reste
 *      fermée même avec le bon code, pour ne pas révéler qu'on a trouvé.
 *   6. Plafond de téléchargements par session : le contenu se sert quelques
 *      fois, pas en boucle — une aspiration automatisée s'arrête d'elle-même.
 *   7. Le jeton porte la classe ET la nature : le client ne choisit pas ce qu'il
 *      télécharge (sans quoi un jeton de 6ᵉ ouvrirait la 3ᵉ).
 *   8. Révocation à effet IMMÉDIAT, y compris sur les sessions déjà ouvertes.
 *   9. FILIGRANE traçable : chaque livraison porte l'identifiant du code et la
 *      date. Une capture qui circule se remonte jusqu'à l'acheteur.
 *  10. FAIL-CLOSED : pas de clé de signature, pas de registre → 503.
 *
 * ⚠️ Aucune technologie web n'empêche à 100 % la recopie d'un écran affiché.
 *    Ce dispositif atteint le niveau des liseuses en ligne ; le filigrane
 *    traçable et la révocation sont les protections réellement efficaces.
 *
 * USAGE (public — POST JSON uniquement)
 *   {action:"unlock",  code, classe, kind}   → {ok, token, exp, kind, label}
 *   {action:"session", token}                → {ok, exp, kind, classe}
 *   {action:"content", token}                → {ok, js:{booklet,guide}, wm}
 *
 * USAGE (admin — Bearer API_SECRET, comme db.php)
 *   {action:"admin_gen",    classe, kind, n, jours, label}  → codes EN CLAIR (une seule fois)
 *   {action:"admin_list"}                                   → inventaire (sans les codes)
 *   {action:"admin_revoke", id}                             → révoque (effet immédiat)
 *
 * DÉPÔT DES DONNÉES (par FTP, hors dépôt Git — le dépôt GitHub est PUBLIC) :
 *   uploads/protected/livrets/booklet-<classe>.js
 *   uploads/protected/livrets/guide-<classe>.js
 *   Voir uploads/protected/livrets/LISEZMOI.txt
 */
declare(strict_types=1);
require_once __DIR__ . '/_json_boot.php'; // display_errors=0 + purge des parasites avant le JSON
ob_start();
require_once __DIR__ . '/_auth_lib.php';  // VRT_HMAC_KEY, API_SECRET, vrt_client_ip, vrt_rate_exceeded…
require_once __DIR__ . '/_livret_lib.php'; // registre des codes (partagé avec le paiement)

// ── CORS (allowlist stricte, identique à teacher_access.php / content.php) ────
$lv_allowed = [
    'https://veritas-school.com', 'https://www.veritas-school.com',
    'http://localhost:8000', 'http://localhost:3000', 'https://localhost', 'capacitor://localhost',
];
$lv_origin = (string) ($_SERVER['HTTP_ORIGIN'] ?? '');
if (in_array($lv_origin, $lv_allowed, true)) {
    header('Access-Control-Allow-Origin: ' . $lv_origin);
    header('Vary: Origin');
}
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');
header('X-Content-Type-Options: nosniff');
header('Referrer-Policy: no-referrer');
// Ni la réponse JSON ni le contenu du livret ne doivent entrer dans un index.
header('X-Robots-Tag: noindex, nofollow, noarchive, nosnippet');
header('X-Frame-Options: DENY');

if (($_SERVER['REQUEST_METHOD'] ?? '') === 'OPTIONS') { http_response_code(204); exit; }

// ── Sorties ───────────────────────────────────────────────────────────────────
function lv_out(int $code, array $data): void {
    while (ob_get_level() > 0) { ob_end_clean(); }
    http_response_code($code);
    header('Content-Type: application/json; charset=utf-8');
    header('Cache-Control: private, no-store, max-age=0');
    header('Pragma: no-cache');
    echo json_encode($data, JSON_UNESCAPED_UNICODE);
    exit;
}
function lv_err(int $code, string $msg, string $tag = ''): void {
    lv_out($code, ['ok' => false, 'error' => $msg, 'code' => $tag]);
}
function lv_log(string $l): void { vrt_livret_log($l); }

function lv_dir(): string { return dirname(__DIR__) . '/uploads/protected/livrets'; }

// ── Réglages (surchargeables dans api/payment_config.php) ─────────────────────
// Durée de vie d'une session. Courte : le jeton est lié au poste, mais un poste
// partagé (cybercafé, salle informatique) ne doit pas rester ouvert des jours.
if (!defined('LIVRET_TTL_ELEVE'))          define('LIVRET_TTL_ELEVE', 12 * 3600);
if (!defined('LIVRET_TTL_ENSEIGNANT'))     define('LIVRET_TTL_ENSEIGNANT', 8 * 3600);
// Appareils distincts qu'un même code peut ouvrir. Un élève a souvent un
// téléphone + l'ordinateur familial ; au-delà de 3, c'est un code qui circule.
if (!defined('LIVRET_MAX_APPAREILS'))      define('LIVRET_MAX_APPAREILS', 3);
if (!defined('LIVRET_MAX_APPAREILS_PROF')) define('LIVRET_MAX_APPAREILS_PROF', 2);
// Session unique : un nouveau déverrouillage invalide le précédent. Trois
// appareils AUTORISÉS, mais pas trois lectures SIMULTANÉES — c'est ce qui
// distingue « ma famille » de « toute la classe ».
if (!defined('LIVRET_SESSION_UNIQUE'))     define('LIVRET_SESSION_UNIQUE', true);
// Livraisons de contenu tolérées par session : une lecture normale en demande
// une (deux si la page est rechargée). Au-delà, c'est un script.
if (!defined('LIVRET_MAX_LIVRAISONS'))     define('LIVRET_MAX_LIVRAISONS', 12);

const LV_MAX_ECHECS = 5;    // échecs tolérés…
const LV_FENETRE    = 900;  // …sur 15 minutes glissantes

// ── Verrouillage après échecs répétés (anti force brute) ──────────────────────
function lv_fichier_echecs(): string {
    $dir = __DIR__ . '/data/_rate';
    if (!is_dir($dir)) { @mkdir($dir, 0750, true); }
    return $dir . '/livfail_' . substr(hash('sha256', vrt_client_ip()), 0, 16) . '.txt';
}
function lv_echecs_recents(): int {
    $f = lv_fichier_echecs();
    if (!is_file($f)) return 0;
    $now = time();
    return count(array_filter(explode("\n", (string) @file_get_contents($f)),
        static function ($t) use ($now) { return $t !== '' && ($now - (int) $t) < LV_FENETRE; }));
}
function lv_note_echec(): void {
    $f = lv_fichier_echecs();
    $now = time();
    $lignes = [];
    if (is_file($f)) {
        $lignes = array_filter(explode("\n", (string) @file_get_contents($f)),
            static function ($t) use ($now) { return $t !== '' && ($now - (int) $t) < LV_FENETRE; });
    }
    $lignes[] = (string) $now;
    @file_put_contents($f, implode("\n", $lignes), LOCK_EX);
}
function lv_efface_echecs(): void { @unlink(lv_fichier_echecs()); }

// ── Empreinte du poste et jetons ──────────────────────────────────────────────
// L'implémentation vit dans _livret_lib.php : api/collab.php vérifie EXACTEMENT
// les mêmes jetons, et deux copies d'une vérification de signature finissent
// toujours par diverger. Ici, de simples relais.
function lv_empreinte(): string { return vrt_livret_empreinte(); }

function lv_issue(array $entry, string $cle, string $sid): array {
    $ttl = ((string) ($entry['t'] ?? 'livret')) === 'guide' ? LIVRET_TTL_ENSEIGNANT : LIVRET_TTL_ELEVE;
    return vrt_livret_jeton_emettre($entry, $cle, $sid, $ttl);
}

function lv_verify(string $token): ?array { return vrt_livret_jeton_verifier($token); }

/** Retrouve l'entrée du registre à partir de l'identifiant court porté par le jeton. */
function lv_entree(array $reg, string $id): array {
    foreach ($reg['codes'] as $cle => $e) {
        if (is_array($e) && substr((string) $cle, 0, 12) === $id) return ['cle' => (string) $cle, 'e' => $e];
    }
    return [];
}

/** Contrôles communs à toute session en cours : révoqué ? expiré ? évincé ? */
function lv_verifier_vivant(array $claims, array &$reg): array {
    $t = lv_entree($reg, (string) ($claims['id'] ?? ''));
    if (!$t) lv_err(403, 'Accès révoqué.', 'revoked');
    $e = $t['e'];
    if ((string) ($e['st'] ?? '') !== 'actif') lv_err(403, 'Accès révoqué.', 'revoked');
    if ((int) ($e['exp'] ?? 0) > 0 && (int) $e['exp'] < time()) lv_err(403, 'Accès expiré.', 'expired');
    if (LIVRET_SESSION_UNIQUE) {
        $sid = (string) ($e['sid'] ?? '');
        if ($sid !== '' && !hash_equals($sid, (string) ($claims['sid'] ?? ''))) {
            lv_log('[EVICTION] id=' . (string) ($claims['id'] ?? '') . ' ip=' . vrt_client_ip());
            lv_err(409, 'Ce code vient d\'être utilisé sur un autre appareil. '
                . 'Une seule lecture à la fois est possible.', 'evicted');
        }
    }
    return $t;
}

// ── Garde-fou global : clé de signature exploitable ? ─────────────────────────
// Sans clé saine, un jeton se forge : mieux vaut fermer que faire semblant.
if (!defined('VRT_HMAC_KEY') || strlen((string) VRT_HMAC_KEY) < 16) {
    lv_err(503, "Le service des livrets n'est pas configuré sur ce serveur.", 'not_configured');
}

// ── Rate-limit ────────────────────────────────────────────────────────────────
if (vrt_rate_exceeded('livret', 40)) {
    lv_err(429, 'Trop de requêtes — réessayez dans une minute.', 'rate');
}

/* ── MODE LECTURE : une page, une image ───────────────────────────────────────
   GET ?o=<ouvrage>&p=<n>[&token=…] → l'image JPEG de la page n.

   En GET, et c'est assumé : une balise <img> ne sait pas poster ni porter
   d'en-tête. Le jeton voyage donc dans l'URL — mais il est lié au poste, il
   expire en quelques heures, la réponse part en `no-store` et `Referrer-Policy:
   no-referrer` empêche l'URL de fuir vers un tiers. Une adresse recopiée
   ailleurs ne rend rien.

   Le PDF d'origine, lui, ne quitte JAMAIS le serveur : le client ne reçoit que
   des images, une par une, et chacune porte le filigrane de l'acheteur.        */
if (($_SERVER['REQUEST_METHOD'] ?? 'GET') === 'GET' && isset($_GET['o'], $_GET['p'])) {
    $slug = (string) preg_replace('/[^a-z0-9_-]/', '', strtolower((string) $_GET['o']));
    $page = (int) $_GET['p'];
    $cat  = vrt_livret_catalogue();
    if ($slug === '' || !isset($cat[$slug])) lv_err(404, 'Ouvrage inconnu.', 'unknown');
    if ($page < 1 || $page > 2000)           lv_err(400, 'Page hors bornes.', 'page');

    $libres = (int) ($cat[$slug]['pagesLibres'] ?? 0);
    $id     = 'libre';
    $wmTxt  = '';

    // Au-delà de l'aperçu gratuit, il faut un code — et le jeton doit porter
    // CET ouvrage : celui de la 6ᵉ n'ouvre pas le Bord de 3ᵉ.
    if ($page > $libres) {
        $claims = lv_verify((string) ($_GET['token'] ?? ''));
        if ($claims === null) lv_err(401, 'Ressaisissez votre code.', 'auth');
        if ((string) $claims['c'] !== $slug) lv_err(403, 'Ce code n\'ouvre pas cet ouvrage.', 'wrong_class');
        $reg = vrt_livret_registre_charger();
        lv_verifier_vivant($claims, $reg);          // révoqué / expiré / évincé
        $id    = strtoupper((string) ($claims['id'] ?? ''));
        $wmTxt = 'VÉRITAS · ' . $id . ' · ' . date('d/m/Y');
    }

    $base = realpath(lv_dir() . '/' . $slug);
    $racine = realpath(lv_dir());
    if ($base === false || $racine === false || strpos($base, $racine) !== 0) {
        lv_err(409, 'Ouvrage pas encore déposé sur le serveur.', 'missing');
    }
    $img = realpath($base . '/p' . str_pad((string) $page, 3, '0', STR_PAD_LEFT) . '.jpg');
    if ($img === false || strpos($img, $base) !== 0 || !is_file($img)) {
        lv_err(404, 'Page absente.', 'no_page');
    }

    lv_log('[PAGE] ip=' . vrt_client_ip() . ' o=' . $slug . ' p=' . $page . ' id=' . $id);

    while (ob_get_level() > 0) { ob_end_clean(); }
    header('Content-Type: image/jpeg');
    header('Cache-Control: private, no-store, max-age=0');
    header('Pragma: no-cache');
    header('Content-Disposition: inline');

    // Filigrane incrusté : c'est lui qui rend une capture traçable. S'il échoue
    // (GD absent), on sert l'image quand même — le VERROU, lui, a déjà joué.
    if ($wmTxt !== '' && function_exists('imagecreatefromjpeg')) {
        $im = @imagecreatefromjpeg($img);
        if ($im !== false) {
            $L = imagesx($im); $H = imagesy($im);
            $gris = imagecolorallocatealpha($im, 90, 90, 90, 96);
            for ($y = (int) ($H * 0.12); $y < $H; $y += (int) max(140, $H / 6)) {
                for ($x = 20; $x < $L; $x += 320) {
                    imagestring($im, 3, $x, $y, $wmTxt, $gris);
                }
            }
            $noir = imagecolorallocatealpha($im, 30, 30, 30, 40);
            imagestring($im, 2, 14, $H - 20, 'Exemplaire personnel — ' . $wmTxt
                . ' — reproduction interdite', $noir);
            imagejpeg($im, null, 82);
            imagedestroy($im);
            exit;
        }
    }
    header('Content-Length: ' . (string) filesize($img));
    readfile($img);
    exit;
}

if (($_SERVER['REQUEST_METHOD'] ?? 'GET') !== 'POST') {
    lv_err(405, 'Méthode non autorisée.', 'method');
}

// Un navigateur envoie TOUJOURS Origin sur un POST. Une origine présente mais
// étrangère = une autre page qui tente d'exploiter la porte : on refuse. Une
// origine absente reste tolérée (certaines webviews natives l'omettent), le
// jeton lié au poste couvrant déjà ce cas.
if ($lv_origin !== '' && !in_array($lv_origin, $lv_allowed, true)) {
    lv_log('[ORIGINE] refus origin=' . substr($lv_origin, 0, 80) . ' ip=' . vrt_client_ip());
    lv_err(403, 'Origine non autorisée.', 'origin');
}

$in = json_decode((string) file_get_contents('php://input'), true);
if (!is_array($in)) $in = [];
$action = (string) ($in['action'] ?? '');

// ═══ ACTIONS ADMIN (Bearer API_SECRET) ════════════════════════════════════════
function lv_exiger_admin(): void {
    $auth = '';
    if (function_exists('getallheaders')) {
        foreach (getallheaders() as $k => $v) {
            if (strtolower((string) $k) === 'authorization') { $auth = (string) $v; break; }
        }
    }
    if ($auth === '') {
        $auth = (string) ($_SERVER['HTTP_AUTHORIZATION'] ?? $_SERVER['REDIRECT_HTTP_AUTHORIZATION'] ?? '');
    }
    $token = trim(str_ireplace('bearer', '', $auth));
    // Même fail-closed que config_sync.php : un secret connu/fuité n'ouvre rien.
    if (function_exists('vrt_secret_is_compromised') && vrt_secret_is_compromised(API_SECRET)) {
        lv_err(503, 'Administration désactivée : le secret API du serveur doit être renouvelé.', 'compromised');
    }
    if ($token === '' || !hash_equals((string) API_SECRET, $token)) {
        lv_log('[ADMIN-REFUS] ip=' . vrt_client_ip());
        lv_err(401, 'Non autorisé.', 'auth');
    }
}

if (strpos($action, 'admin_') === 0) {
    lv_exiger_admin();

    if ($action === 'admin_gen') {
        $r = vrt_livret_emettre([
            'classe' => (string) ($in['classe'] ?? ''),
            'kind'   => (string) ($in['kind'] ?? 'livret'),
            'n'      => (int) ($in['n'] ?? 1),
            'jours'  => (int) ($in['jours'] ?? 365),
            'label'  => (string) ($in['label'] ?? ''),
        ]);
        if (!$r['ok']) {
            $m = ['classe' => 'Classe inconnue.', 'kind' => 'Nature inconnue.',
                  'io' => 'Écriture du registre impossible.',
                  'cle_absente' => 'Clé de signature absente sur ce serveur.'];
            lv_err(400, $m[$r['erreur'] ?? ''] ?? 'Émission impossible.', (string) ($r['erreur'] ?? 'gen'));
        }
        // Les codes en clair ne sont montrés QU'ICI : le registre n'en garde que l'empreinte.
        lv_out(200, ['ok' => true, 'lot' => $r['lot'], 'expire' => $r['expire'], 'codes' => $r['codes']]);
    }

    $reg = vrt_livret_registre_charger();

    if ($action === 'admin_list') {
        $out = [];
        foreach ($reg['codes'] as $cle => $e) {
            if (!is_array($e)) continue;
            $out[] = [
                'id'        => substr((string) $cle, 0, 12),
                'classe'    => (string) ($e['c'] ?? ''),
                'kind'      => (string) ($e['t'] ?? ''),
                'label'     => (string) ($e['lb'] ?? ''),
                'lot'       => (string) ($e['lot'] ?? ''),
                'ref'       => (string) ($e['ref'] ?? ''),
                'statut'    => (string) ($e['st'] ?? ''),
                'expire'    => (int) ($e['exp'] ?? 0),
                'cree'      => (int) ($e['cr'] ?? 0),
                'usages'    => (int) ($e['use'] ?? 0),
                'appareils' => count((array) ($e['dev'] ?? [])),
            ];
        }
        usort($out, static function ($a, $b) { return $b['cree'] <=> $a['cree']; });
        lv_out(200, ['ok' => true, 'total' => count($out), 'codes' => $out]);
    }

    if ($action === 'admin_revoke') {
        $id = (string) ($in['id'] ?? '');
        if ($id === '') lv_err(400, 'Identifiant requis.', 'id');
        $touche = 0;
        foreach ($reg['codes'] as $cle => $e) {
            if (substr((string) $cle, 0, 12) === $id) {
                $reg['codes'][$cle]['st']  = 'revoque';
                $reg['codes'][$cle]['sid'] = '';   // coupe la session en cours
                $touche++;
            }
        }
        if (!$touche) lv_err(404, 'Code inconnu.', 'unknown');
        if (!vrt_livret_registre_ecrire($reg)) lv_err(500, 'Écriture du registre impossible.', 'io');
        lv_log('[REVOKE] id=' . $id);
        lv_out(200, ['ok' => true, 'revoques' => $touche]);
    }

    // Réinitialise les appareils d'un code (« j'ai changé de téléphone »).
    if ($action === 'admin_reset_devices') {
        $id = (string) ($in['id'] ?? '');
        $touche = 0;
        foreach ($reg['codes'] as $cle => $e) {
            if (substr((string) $cle, 0, 12) === $id) {
                $reg['codes'][$cle]['dev'] = [];
                $reg['codes'][$cle]['sid'] = '';
                $touche++;
            }
        }
        if (!$touche) lv_err(404, 'Code inconnu.', 'unknown');
        if (!vrt_livret_registre_ecrire($reg)) lv_err(500, 'Écriture du registre impossible.', 'io');
        lv_log('[RESET-APPAREILS] id=' . $id);
        lv_out(200, ['ok' => true]);
    }

    // Relance : qui doit renouveler, et quand. Sans cette liste, un abonnement
    // qui s'eteint est une vente perdue qu'on ne voit meme pas passer.
    if ($action === 'admin_expirants') {
        $j = max(1, min(365, (int) ($in['jours'] ?? 30)));
        $l = vrt_livret_expirants($j);
        lv_out(200, ['ok' => true, 'jours' => $j, 'total' => count($l), 'codes' => $l]);
    }

    lv_err(400, 'Action admin inconnue.', 'action');
}

// ═══ ACTIONS PUBLIQUES ════════════════════════════════════════════════════════

if ($action === 'unlock') {
    $reg = vrt_livret_registre_charger();
    if (!$reg['codes']) {
        // Fail-closed : aucun code émis = service pas encore ouvert.
        lv_err(503, 'Les livrets en ligne ne sont pas encore activés sur ce serveur.', 'not_configured');
    }
    // Porte fermée après trop d'échecs, MÊME si le code présenté est le bon :
    // sinon un attaquant apprendrait, en tombant juste, qu'il a trouvé.
    if (lv_echecs_recents() >= LV_MAX_ECHECS) {
        lv_log('[BLOQUE] ip=' . vrt_client_ip() . ' echecs>=' . LV_MAX_ECHECS);
        lv_err(429, 'Trop de tentatives. Réessayez dans un quart d\'heure.', 'locked');
    }

    $code   = (string) ($in['code'] ?? '');
    $classe = (string) ($in['classe'] ?? '');
    $kind   = (string) ($in['kind'] ?? 'livret');
    if (vrt_livret_normaliser($code) === '') lv_err(400, 'Code requis.', 'empty');
    if (!isset(vrt_livret_classes()[$classe])) lv_err(400, 'Classe inconnue.', 'classe');
    if (!isset(vrt_livret_kinds()[$kind]))     lv_err(400, 'Nature inconnue.', 'kind');

    $cle   = vrt_livret_cle($code);
    $entry = $reg['codes'][$cle] ?? null;

    if (!is_array($entry)) {
        lv_note_echec();
        lv_log('[REFUS] ip=' . vrt_client_ip() . ' motif=inconnu echecs=' . lv_echecs_recents());
        usleep(400000); // décourage l'essai en masse sans gêner l'usage normal
        lv_err(401, 'Code non reconnu.', 'bad_code');
    }
    if ((string) ($entry['st'] ?? '') !== 'actif') {
        lv_log('[REFUS] ip=' . vrt_client_ip() . ' id=' . substr($cle, 0, 12) . ' motif=revoque');
        lv_err(403, 'Ce code a été révoqué. Contactez le Centre VÉRITAS.', 'revoked');
    }
    if ((int) ($entry['exp'] ?? 0) > 0 && (int) $entry['exp'] < time()) {
        lv_log('[REFUS] ip=' . vrt_client_ip() . ' id=' . substr($cle, 0, 12) . ' motif=expire');
        lv_err(403, 'Ce code a expiré. Renouvelez votre accès.', 'expired');
    }
    if ((string) ($entry['c'] ?? '') !== $classe) {
        lv_note_echec();
        lv_log('[REFUS] ip=' . vrt_client_ip() . ' id=' . substr($cle, 0, 12) . ' motif=classe');
        lv_err(403, 'Ce code ne correspond pas à cette classe.', 'wrong_class');
    }
    if ((string) ($entry['t'] ?? '') !== $kind) {
        lv_note_echec();
        lv_log('[REFUS] ip=' . vrt_client_ip() . ' id=' . substr($cle, 0, 12) . ' motif=nature');
        lv_err(403, $kind === 'guide'
            ? 'Ce code n\'est pas un code enseignant.'
            : 'Ce code n\'ouvre pas le livret de l\'élève.', 'wrong_kind');
    }

    // ── Quota d'appareils ────────────────────────────────────────────────────
    $fp   = lv_empreinte();
    $devs = (array) ($entry['dev'] ?? []);
    $max  = ($kind === 'guide') ? LIVRET_MAX_APPAREILS_PROF : LIVRET_MAX_APPAREILS;
    if (!isset($devs[$fp]) && count($devs) >= $max) {
        lv_log('[REFUS] ip=' . vrt_client_ip() . ' id=' . substr($cle, 0, 12)
            . ' motif=quota appareils=' . count($devs));
        lv_err(403, 'Ce code est déjà utilisé sur ' . $max . ' appareils. '
            . 'Contactez le Centre VÉRITAS pour le réinitialiser.', 'device_quota');
    }
    if (!isset($devs[$fp])) { $devs[$fp] = time(); }

    // Nouvelle session : elle évince la précédente (LIVRET_SESSION_UNIQUE).
    $sid = bin2hex(random_bytes(8));
    $reg['codes'][$cle]['dev']  = $devs;
    $reg['codes'][$cle]['use']  = (int) ($entry['use'] ?? 0) + 1;
    $reg['codes'][$cle]['last'] = time();
    $reg['codes'][$cle]['sid']  = $sid;
    $reg['codes'][$cle]['liv']  = 0;   // compteur de livraisons de la session
    if (!vrt_livret_registre_ecrire($reg)) {
        // Un échec d'écriture ne doit pas priver d'accès un acheteur légitime,
        // mais il est journalisé : sans registre à jour, les quotas ne tiennent plus.
        lv_log('[IO] registre non écrit id=' . substr($cle, 0, 12));
    }

    lv_efface_echecs();
    $t = lv_issue($reg['codes'][$cle], $cle, $sid);
    lv_log('[OUVERTURE] ip=' . vrt_client_ip() . ' id=' . substr($cle, 0, 12)
        . ' classe=' . $classe . ' kind=' . $kind . ' appareils=' . count($devs));
    lv_out(200, [
        'ok'     => true,
        'token'  => $t['token'],
        'exp'    => $t['exp'],                                   // fin de SESSION (heures)
        'kind'   => $kind,
        'classe' => $classe,
        'label'  => (string) ($entry['lb'] ?? ''),
        // Fin de l'ABONNEMENT (mois) : sans cette valeur, l'eleve decouvrait
        // l'echeance le jour ou son code cessait de fonctionner.
        'joursRestants' => vrt_livret_jours_restants(substr($cle, 0, 12)),
        'expireLe'      => (int) ($entry['exp'] ?? 0),
    ]);
}

/* Fiche d'un ouvrage en mode lecture : de quoi que le liseur sache quoi
   afficher AVANT tout code — nombre de pages et aperçu gratuit. Volontairement
   public : c'est la vitrine, pas le contenu. */
if ($action === 'ouvrage') {
    $slug = (string) preg_replace('/[^a-z0-9_-]/', '', strtolower((string) ($in['o'] ?? '')));
    $cat  = vrt_livret_catalogue();
    if ($slug === '' || !isset($cat[$slug])) lv_err(404, 'Ouvrage inconnu.', 'unknown');
    $o = $cat[$slug];
    lv_out(200, ['ok' => true, 'ouvrage' => [
        'slug' => $slug, 'titre' => (string) $o['titre'], 'niveau' => (string) $o['niveau'],
        'mode' => (string) $o['mode'], 'kinds' => (array) $o['kinds'],
        'pages' => (int) $o['pages'], 'pagesLibres' => (int) $o['pagesLibres'],
        'prix' => (int) $o['prix'],
    ]]);
}

if ($action === 'session') {
    $claims = lv_verify((string) ($in['token'] ?? ''));
    if ($claims === null) lv_err(401, 'Session expirée.', 'auth');
    $reg = vrt_livret_registre_charger();
    lv_verifier_vivant($claims, $reg);
    $inf = vrt_livret_infos_code((string) ($claims['id'] ?? ''));
    lv_out(200, [
        'ok'     => true,
        'exp'    => (int) $claims['exp'],
        'kind'   => (string) $claims['k'],
        'classe' => (string) $claims['c'],
        'label'  => (string) ($claims['lb'] ?? ''),
        'joursRestants' => vrt_livret_jours_restants((string) ($claims['id'] ?? '')),
        'expireLe'      => $inf ? (int) $inf['exp'] : 0,
    ]);
}

if ($action === 'content') {
    $claims = lv_verify((string) ($in['token'] ?? ''));
    if ($claims === null) lv_err(401, 'Session expirée — ressaisissez votre code.', 'auth');

    $reg = vrt_livret_registre_charger();
    $t   = lv_verifier_vivant($claims, $reg);   // révoqué / expiré / évincé → sortie

    // Plafond de livraisons par session : une lecture normale en demande une,
    // deux si la page est rechargée. Douze, c'est déjà un script.
    $n = (int) ($t['e']['liv'] ?? 0) + 1;
    if ($n > LIVRET_MAX_LIVRAISONS) {
        lv_log('[PLAFOND] id=' . (string) ($claims['id'] ?? '') . ' livraisons=' . $n . ' ip=' . vrt_client_ip());
        lv_err(429, 'Trop de chargements pour cette session. Ressaisissez votre code.', 'flood');
    }
    $reg['codes'][$t['cle']]['liv'] = $n;
    vrt_livret_registre_ecrire($reg);

    // Le jeton porte la classe et la nature : le client ne choisit pas ce qu'il
    // télécharge. Sans cela, un jeton de 6ᵉ ouvrirait la 3ᵉ.
    $classe = (string) $claims['c'];
    $kind   = (string) $claims['k'];

    $base = realpath(lv_dir());
    if ($base === false) lv_err(409, 'Livret pas encore déposé sur le serveur.', 'missing');

    /** Lecture confinée : basename + realpath, aucun chemin venu du client. */
    $lire = static function (string $nom) use ($base): ?string {
        $p = realpath($base . '/' . basename($nom));
        if ($p === false || strpos($p, $base) !== 0 || !is_file($p)) return null;
        $s = @file_get_contents($p);
        return $s === false ? null : $s;
    };

    $js = [];
    if ($kind === 'guide') {
        // L'enseignant reçoit le guide, et le livret pour suivre l'élève.
        $js['guide']   = $lire('guide-' . $classe . '.js');
        $js['booklet'] = $lire('booklet-' . $classe . '.js');
        if ($js['guide'] === null) lv_err(409, 'Guide pas encore déposé sur le serveur.', 'missing');
    } else {
        // L'élève reçoit son livret ET les corrigés (bouton « Voir la correction »),
        // mais seulement après déverrouillage — c'était précisément la fuite :
        // guide-data-*.js partait en <script src> avant toute vérification.
        $js['booklet'] = $lire('booklet-' . $classe . '.js');
        $js['guide']   = $lire('guide-' . $classe . '.js');
        if ($js['booklet'] === null) lv_err(409, 'Livret pas encore déposé sur le serveur.', 'missing');
    }

    // ── Filigrane traçable ───────────────────────────────────────────────────
    // Porté par la réponse et peint discrètement par la page : une capture qui
    // circule désigne le code, donc l'acheteur.
    $id = strtoupper((string) ($claims['id'] ?? ''));
    $wm = [
        'id'  => $id,
        'lb'  => (string) ($claims['lb'] ?? ''),
        'd'   => date('d/m/Y'),
        'txt' => 'VÉRITAS · ' . $id . ' · ' . date('d/m/Y'),
    ];

    lv_log('[CONTENU] ip=' . vrt_client_ip() . ' id=' . $id
        . ' classe=' . $classe . ' kind=' . $kind . ' n=' . $n);

    lv_out(200, ['ok' => true, 'classe' => $classe, 'kind' => $kind, 'wm' => $wm, 'js' => $js]);
}

/* ── RETRAIT DU CODE APRÈS PAIEMENT ──────────────────────────────────────────
   Le navigateur de l'acheteur réclame le code émis par son paiement. Deux
   facteurs, parce qu'une référence seule ne suffit pas : elle est courte
   (préfixe + date + 4 caractères) donc énumérable, et `payment_*.php?action=
   status` la rend interrogeable sans authentification. On exige donc AUSSI les
   4 derniers chiffres du numéro qui a payé — que seul le payeur connaît.       */
if ($action === 'claim') {
    if (lv_echecs_recents() >= LV_MAX_ECHECS) {
        lv_log('[CLAIM-BLOQUE] ip=' . vrt_client_ip());
        lv_err(429, 'Trop de tentatives. Réessayez dans un quart d\'heure.', 'locked');
    }
    $ref = trim((string) ($in['ref'] ?? ''));
    $tel = trim((string) ($in['tel'] ?? ''));
    if ($ref === '') lv_err(400, 'Référence requise.', 'empty');

    $v = vrt_livret_vente_lire($ref);
    // Un seul message pour « référence inconnue » et « paiement non confirmé » :
    // sinon l'énumération dirait lesquelles ont été payées.
    if ($v === null || (string) ($v['code'] ?? '') === '') {
        lv_note_echec();
        usleep(300000);
        lv_err(404, 'Aucun code disponible pour cette référence. '
            . 'Si votre paiement vient d\'aboutir, patientez une minute et réessayez.', 'pending');
    }

    $attendu = (string) ($v['tel4'] ?? '');
    if ($attendu !== '') {
        $fourni = vrt_livret_tel4_hash($tel);
        if ($fourni === '' || !hash_equals($attendu, $fourni)) {
            lv_note_echec();
            lv_log('[CLAIM-REFUS] ip=' . vrt_client_ip() . ' motif=tel');
            usleep(400000);
            lv_err(403, 'Les 4 derniers chiffres du numéro payeur ne correspondent pas.', 'bad_tel');
        }
    } else {
        // Vente sans numéro enregistré (paiement par carte, saisie incomplète) :
        // la référence seule fait foi, mais l'accès est journalisé pour audit.
        lv_log('[CLAIM-SANS-TEL] ip=' . vrt_client_ip() . ' ref=' . substr($ref, 0, 24));
    }

    lv_efface_echecs();
    lv_log('[CLAIM] ip=' . vrt_client_ip() . ' ref=' . substr($ref, 0, 24)
        . ' classe=' . (string) ($v['classe'] ?? '') . ' code=…' . substr((string) $v['code'], -4));
    $lot = (is_array($v['codes'] ?? null) && count($v['codes']) > 1) ? array_values($v['codes']) : null;
    lv_out(200, [
        'ok'     => true,
        'code'   => (string) $v['code'],
        'codes'  => $lot,                       // pack etablissement : tout le lot
        'classe' => (string) ($v['classe'] ?? ''),
        'kind'   => (string) ($v['kind'] ?? 'livret'),
        'expire' => (int) ($v['exp'] ?? 0),
    ]);
}

lv_err(400, 'Action inconnue.', 'action');
