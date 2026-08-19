<?php
/**
 * api/collab.php — VOLET COLLABORATIF DES LIVRETS
 * © 2024-2026 Jacques Miterand TAKOU (Mythe Errant). Tous droits réservés.
 * Œuvre protégée — Loi camerounaise n° 2000/011 + Convention de Berne.
 *
 * BUT — faire du livret une salle de classe : l'enseignant crée des classes et
 * des DEVOIRS, en envoie le lien à ses élèves ; l'élève traite le devoir et
 * soumet ses réponses ; l'enseignant annote, note, renvoie. Chaque lien partagé
 * est aussi une porte d'entrée vers l'abonnement (aperçu réel, puis mur).
 *
 * IDENTITÉS — aucune inscription supplémentaire, on réutilise les codes livrets :
 *   • ENSEIGNANT = jeton de livret de nature `guide` (api/livret.php). Son
 *     identifiant est celui de son code : révoquer le code coupe tout.
 *   • ÉLÈVE      = jeton de nature `livret`. Un code = un élève (c'est le modèle
 *     de vente : 3 appareils pour la même personne), donc l'identité est dérivée
 *     du SEUL identifiant de code — pas de l'empreinte du poste, sinon le même
 *     élève apparaîtrait deux fois selon qu'il répond du téléphone ou du PC.
 *   • VISITEUR   = personne. Il voit qu'un devoir existe, qui l'a donné et
 *     combien d'exercices — jamais le contenu vendu.
 *
 * LE MUR D'ABONNEMENT, ET CE QU'IL LAISSE PASSER
 *   Un lien de devoir circule par WhatsApp : il tombera forcément entre les mains
 *   de non-acheteurs. L'aperçu public montre donc EN ENTIER les exercices écrits
 *   par l'enseignant (ils ne sont pas le produit de VÉRITAS) et masque ceux qui
 *   renvoient au livret (« 🔒 Exercice du livret 6ᵉ »). Répondre, voir un corrigé
 *   ou une note exige un code. C'est un aperçu honnête : on montre la valeur sans
 *   donner la marchandise.
 *
 * STOCKAGE — fichiers plats sous verrou, comme le reste du backend.
 *   api/data/collab/classes.json          les classes (petit, un seul fichier)
 *   api/data/collab/devoirs/<token>.json  UN fichier par devoir : items,
 *       soumissions et appréciations ensemble. Le partitionnement par devoir
 *       évite qu'une classe de 40 élèves qui rend sa copie en même temps ne se
 *       dispute un verrou global.
 *   api/data/collab/parrainage.json       qui a amené qui, et ce qu'on lui doit.
 *
 * USAGE — POST JSON, {action:…}. Voir la table des actions plus bas.
 */
declare(strict_types=1);
require_once __DIR__ . '/_json_boot.php';
ob_start();
require_once __DIR__ . '/_auth_lib.php';
require_once __DIR__ . '/_livret_lib.php';

// ── CORS (même allowlist que livret.php) ──────────────────────────────────────
$co_allowed = [
    'https://veritas-school.com', 'https://www.veritas-school.com',
    'http://localhost:8000', 'http://localhost:3000', 'https://localhost', 'capacitor://localhost',
];
$co_origin = (string) ($_SERVER['HTTP_ORIGIN'] ?? '');
if (in_array($co_origin, $co_allowed, true)) {
    header('Access-Control-Allow-Origin: ' . $co_origin);
    header('Vary: Origin');
}
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');
header('X-Content-Type-Options: nosniff');
header('Referrer-Policy: no-referrer');
header('X-Robots-Tag: noindex, nofollow, noarchive, nosnippet');
header('X-Frame-Options: DENY');
if (($_SERVER['REQUEST_METHOD'] ?? '') === 'OPTIONS') { http_response_code(204); exit; }

// ── Sorties ───────────────────────────────────────────────────────────────────
function co_out(int $code, array $d): void {
    while (ob_get_level() > 0) { ob_end_clean(); }
    http_response_code($code);
    header('Content-Type: application/json; charset=utf-8');
    header('Cache-Control: private, no-store, max-age=0');
    echo json_encode($d, JSON_UNESCAPED_UNICODE);
    exit;
}
function co_err(int $c, string $m, string $tag = ''): void { co_out($c, ['ok' => false, 'error' => $m, 'code' => $tag]); }
function co_log(string $l): void {
    $dir = __DIR__ . '/data';
    if (!is_dir($dir)) { @mkdir($dir, 0775, true); }
    @file_put_contents($dir . '/_collab_log.txt', date('c') . ' ' . $l . "\n", FILE_APPEND);
}

// ── Bornes. Elles ne gênent aucun usage réel ; elles empêchent qu'un compte
//    compromis remplisse le disque ou rende un fichier illisible. ─────────────
const CO_MAX_CLASSES     = 40;      // par enseignant
const CO_MAX_DEVOIRS     = 300;     // par enseignant
const CO_MAX_ITEMS       = 40;      // exercices par devoir
const CO_MAX_COPIES      = 400;     // soumissions par devoir
const CO_MAX_REPONSES    = 65536;   // octets de réponses par copie
const CO_MAX_TEXTE       = 2000;    // caractères d'une consigne / appréciation
const CO_MAX_TITRE       = 120;

/* ── RÉCOMPENSE DE PARRAINAGE ─────────────────────────────────────────────────
   Elle était tracée mais SANS MONTANT : un enseignant qui amenait dix élèves ne
   recevait rien, donc n'en amenait pas dix. Deux barèmes, parce que les deux
   parrains n'attendent pas la même chose :

   • L'ÉLÈVE veut garder son accès → +30 jours par filleul. Le coût marginal
     d'un mois de plus est nul, là où une commission en espèces suppose un
     virement, une comptabilité et un risque de fraude.
   • L'ENSEIGNANT a déjà son année → il veut pouvoir ÉQUIPER ses élèves sans
     moyens. Tous les 5 filleuls, un code élève offert, qu'il donne à qui il
     veut. Zéro sortie de caisse, et le code offert crée un utilisateur de plus.

   Réglables dans api/payment_config.php, sans redéploiement.                  */
if (!defined('LIVRET_PARRAIN_JOURS'))       define('LIVRET_PARRAIN_JOURS', 30);
if (!defined('LIVRET_PARRAIN_JOURS_MAX'))   define('LIVRET_PARRAIN_JOURS_MAX', 730);  // plafond depuis l'émission
if (!defined('LIVRET_PARRAIN_SEUIL_CODE'))  define('LIVRET_PARRAIN_SEUIL_CODE', 5);
if (!defined('LIVRET_PARRAIN_CODES_MAX'))   define('LIVRET_PARRAIN_CODES_MAX', 40);

function co_texte($v, int $max = CO_MAX_TEXTE): string {
    $s = trim((string) $v);
    // On stocke du TEXTE. L'échappement se fait au rendu (côté client, _esc) ;
    // ici on retire seulement les caractères de contrôle, qui n'ont aucun usage
    // légitime et cassent le JSON de certains clients.
    $s = (string) preg_replace('/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/u', '', $s);
    return mb_substr($s, 0, $max);
}

// ── Stockage ──────────────────────────────────────────────────────────────────
function co_dir(): string {
    $d = __DIR__ . '/data/collab';
    if (!is_dir($d)) { @mkdir($d, 0750, true); }
    if (!is_dir($d . '/devoirs')) { @mkdir($d . '/devoirs', 0750, true); }
    return $d;
}
function co_lire(string $f, array $defaut): array {
    if (!is_file($f)) return $defaut;
    $d = json_decode((string) @file_get_contents($f), true);
    return is_array($d) ? $d : $defaut;
}
function co_ecrire(string $f, array $d): bool {
    $tmp = $f . '.tmp';
    if (@file_put_contents($tmp, json_encode($d, JSON_UNESCAPED_UNICODE), LOCK_EX) === false) return false;
    if (!@rename($tmp, $f)) { @unlink($tmp); return false; }
    @chmod($f, 0640);
    return true;
}
function co_f_classes(): string { return co_dir() . '/classes.json'; }
function co_f_parrain(): string { return co_dir() . '/parrainage.json'; }

/** Chemin d'un devoir. Le jeton vient du réseau : on le normalise AVANT de
 *  toucher au disque, et on ne concatène jamais tel quel. */
function co_f_devoir(string $token): ?string {
    $t = strtoupper((string) preg_replace('/[^A-Za-z0-9]/', '', $token));
    if (strlen($t) < 8 || strlen($t) > 24) return null;
    return co_dir() . '/devoirs/' . $t . '.json';
}
function co_jeton(int $n = 10): string {
    $A = vrt_livret_alphabet(); $L = strlen($A); $s = '';
    for ($i = 0; $i < $n; $i++) { $s .= $A[random_int(0, $L - 1)]; }
    return $s;
}

// ── Authentification (jetons de livret) ───────────────────────────────────────
/** Rend les claims si le jeton est valide ET si son code n'a pas été révoqué. */
function co_claims(array $in, string $attendu = ''): ?array {
    $c = vrt_livret_jeton_verifier((string) ($in['token'] ?? ''));
    if ($c === null) return null;
    if ($attendu !== '' && (string) ($c['k'] ?? '') !== $attendu) return null;
    // Révocation à effet immédiat : un jeton signé reste valide 12 h, mais le
    // code, lui, peut avoir été coupé entre-temps.
    if (!vrt_livret_code_vivant((string) ($c['id'] ?? ''))) return null;
    return $c;
}
function co_prof(array $in): array {
    $c = co_claims($in, 'guide');
    if ($c === null) co_err(401, "Session enseignant expirée — ressaisissez votre code enseignant.", 'auth');
    return $c;
}
function co_eleve(array $in): array {
    $c = co_claims($in, 'livret');
    if ($c === null) co_err(401, 'Session expirée — ressaisis ton code.', 'auth');
    return $c;
}
/** Identité d'élève : un code = un élève. Dérivée du seul identifiant de code,
 *  donc STABLE d'un appareil à l'autre (sinon la même personne compterait deux
 *  fois dans la classe selon qu'elle répond du téléphone ou du PC). */
function co_eleve_id(array $claims): string {
    return substr(hash_hmac('sha256', 'ELEVE|' . (string) ($claims['id'] ?? ''), VRT_HMAC_KEY), 0, 12);
}

// ── Garde-fous globaux ────────────────────────────────────────────────────────
if (!defined('VRT_HMAC_KEY') || strlen((string) VRT_HMAC_KEY) < 16) {
    co_err(503, "Le service n'est pas configuré sur ce serveur.", 'not_configured');
}
if (vrt_rate_exceeded('collab', 60)) co_err(429, 'Trop de requêtes — patientez une minute.', 'rate');
if (($_SERVER['REQUEST_METHOD'] ?? 'GET') !== 'POST') co_err(405, 'Méthode non autorisée.', 'method');
if ($co_origin !== '' && !in_array($co_origin, $co_allowed, true)) {
    co_log('[ORIGINE] refus ' . substr($co_origin, 0, 80));
    co_err(403, 'Origine non autorisée.', 'origin');
}

$in = json_decode((string) file_get_contents('php://input'), true);
if (!is_array($in)) $in = [];
$action = (string) ($in['action'] ?? '');

/* ═══════════════════════════════════════════════════════════════════════════
   ENSEIGNANT — classes
   ═══════════════════════════════════════════════════════════════════════════ */

if ($action === 'classe_creer') {
    $c = co_prof($in);
    $nom = co_texte($in['nom'] ?? '', CO_MAX_TITRE);
    if ($nom === '') co_err(400, 'Nom de la classe requis.', 'empty');

    $f = co_f_classes();
    $reg = co_lire($f, ['version' => 1, 'classes' => []]);
    $miennes = array_filter($reg['classes'], static function ($x) use ($c) {
        return is_array($x) && (string) ($x['prof'] ?? '') === (string) $c['id'];
    });
    if (count($miennes) >= CO_MAX_CLASSES) co_err(429, 'Trop de classes créées.', 'quota');

    $id = 'cl_' . bin2hex(random_bytes(5));
    $reg['classes'][$id] = [
        'id' => $id, 'prof' => (string) $c['id'], 'profLabel' => (string) ($c['lb'] ?? ''),
        'niveau' => (string) $c['c'], 'nom' => $nom, 'cree' => time(), 'eleves' => [],
    ];
    if (!co_ecrire($f, $reg)) co_err(500, 'Enregistrement impossible.', 'io');
    co_log('[CLASSE] prof=' . $c['id'] . ' id=' . $id);
    co_out(200, ['ok' => true, 'classe' => $reg['classes'][$id]]);
}

if ($action === 'classe_lister') {
    $c = co_prof($in);
    $reg = co_lire(co_f_classes(), ['version' => 1, 'classes' => []]);
    $out = [];
    foreach ($reg['classes'] as $cl) {
        if (!is_array($cl) || (string) ($cl['prof'] ?? '') !== (string) $c['id']) continue;
        $cl['effectif'] = count((array) ($cl['eleves'] ?? []));
        $out[] = $cl;
    }
    usort($out, static function ($a, $b) { return (int) $b['cree'] <=> (int) $a['cree']; });
    co_out(200, ['ok' => true, 'classes' => $out, 'niveau' => (string) $c['c']]);
}

/* ═══════════════════════════════════════════════════════════════════════════
   ENSEIGNANT — devoirs
   ═══════════════════════════════════════════════════════════════════════════ */

if ($action === 'devoir_creer') {
    $c = co_prof($in);
    $titre = co_texte($in['titre'] ?? '', CO_MAX_TITRE);
    if ($titre === '') co_err(400, 'Titre du devoir requis.', 'empty');

    $brut = is_array($in['items'] ?? null) ? $in['items'] : [];
    if (!$brut) co_err(400, 'Ajoutez au moins un exercice.', 'empty');
    if (count($brut) > CO_MAX_ITEMS) co_err(400, 'Trop d\'exercices (' . CO_MAX_ITEMS . ' au maximum).', 'quota');

    $items = [];
    foreach ($brut as $i => $it) {
        if (!is_array($it)) continue;
        $src = ((string) ($it['src'] ?? '')) === 'prof' ? 'prof' : 'livret';
        if ($src === 'prof') {
            // Exercice écrit par l'enseignant : il lui appartient, il sera donc
            // visible même dans l'aperçu public.
            $cons = co_texte($it['consigne'] ?? '');
            if ($cons === '') continue;
            $items[] = [
                'n' => count($items) + 1, 'src' => 'prof', 'consigne' => $cons,
                'type' => in_array((string) ($it['type'] ?? ''), ['court', 'long', 'vf'], true)
                    ? (string) $it['type'] : 'court',
                'corrige' => co_texte($it['corrige'] ?? ''),
            ];
        } else {
            // Renvoi au livret : on ne recopie PAS l'énoncé côté serveur. Le
            // client le résout dans les données qu'il a déjà — donc seulement
            // s'il a payé. Un devoir n'est jamais un moyen de sortir le contenu.
            $ref = co_texte($it['ref'] ?? '', 200);
            if ($ref === '') continue;
            $items[] = [
                'n' => count($items) + 1, 'src' => 'livret', 'ref' => $ref,
                'repere' => co_texte($it['repere'] ?? '', 120),
            ];
        }
    }
    if (!$items) co_err(400, 'Aucun exercice exploitable.', 'empty');

    // Un jeton neuf, jamais déjà pris.
    $garde = 0;
    do { $token = co_jeton(); $f = co_f_devoir($token); } while ($f !== null && is_file($f) && ++$garde < 8);
    if ($f === null) co_err(500, 'Génération du lien impossible.', 'io');

    $du = (int) ($in['du'] ?? 0);
    $devoir = [
        'token' => $token,
        'prof' => (string) $c['id'], 'profLabel' => (string) ($c['lb'] ?? ''),
        'profNom' => co_texte($in['profNom'] ?? '', 80),
        'classeId' => co_texte($in['classeId'] ?? '', 40),
        'niveau' => (string) $c['c'],
        'titre' => $titre,
        'consigne' => co_texte($in['consigne'] ?? ''),
        'items' => $items,
        'du' => ($du > 0 && $du < 4102444800) ? $du : 0,   // borne : an 2100
        'cree' => time(),
        'ouvert' => true,
        'soumissions' => new stdClass(),
        'vues' => 0,
    ];
    if (!co_ecrire($f, $devoir)) co_err(500, 'Enregistrement impossible.', 'io');
    co_log('[DEVOIR] prof=' . $c['id'] . ' token=' . $token . ' items=' . count($items));
    co_out(200, ['ok' => true, 'token' => $token,
                 'lien' => 'https://veritas-school.com/d/?t=' . $token,
                 'devoir' => $devoir]);
}

if ($action === 'devoir_lister') {
    $c = co_prof($in);
    $out = [];
    foreach (glob(co_dir() . '/devoirs/*.json') ?: [] as $f) {
        $d = co_lire($f, []);
        if (!$d || (string) ($d['prof'] ?? '') !== (string) $c['id']) continue;
        $sub = (array) ($d['soumissions'] ?? []);
        $out[] = [
            'token' => (string) $d['token'], 'titre' => (string) $d['titre'],
            'classeId' => (string) ($d['classeId'] ?? ''), 'niveau' => (string) ($d['niveau'] ?? ''),
            'items' => count((array) ($d['items'] ?? [])), 'cree' => (int) $d['cree'],
            'du' => (int) ($d['du'] ?? 0), 'ouvert' => (bool) ($d['ouvert'] ?? true),
            'copies' => count($sub),
            'corrigees' => count(array_filter($sub, static function ($s) { return isset($s['note']) || !empty($s['appreciation']); })),
            'vues' => (int) ($d['vues'] ?? 0),
            'lien' => 'https://veritas-school.com/d/?t=' . (string) $d['token'],
        ];
    }
    usort($out, static function ($a, $b) { return $b['cree'] <=> $a['cree']; });
    co_out(200, ['ok' => true, 'devoirs' => $out]);
}

if ($action === 'devoir_fermer') {
    $c = co_prof($in);
    $f = co_f_devoir((string) ($in['t'] ?? ''));
    if ($f === null || !is_file($f)) co_err(404, 'Devoir introuvable.', 'unknown');
    $d = co_lire($f, []);
    if ((string) ($d['prof'] ?? '') !== (string) $c['id']) co_err(403, 'Ce devoir n\'est pas le vôtre.', 'owner');
    $d['ouvert'] = !((bool) ($d['ouvert'] ?? true));
    if (!co_ecrire($f, $d)) co_err(500, 'Enregistrement impossible.', 'io');
    co_out(200, ['ok' => true, 'ouvert' => $d['ouvert']]);
}

/* ═══════════════════════════════════════════════════════════════════════════
   ENSEIGNANT — copies et appréciations
   ═══════════════════════════════════════════════════════════════════════════ */

if ($action === 'copies') {
    $c = co_prof($in);
    $f = co_f_devoir((string) ($in['t'] ?? ''));
    if ($f === null || !is_file($f)) co_err(404, 'Devoir introuvable.', 'unknown');
    $d = co_lire($f, []);
    if ((string) ($d['prof'] ?? '') !== (string) $c['id']) co_err(403, 'Ce devoir n\'est pas le vôtre.', 'owner');
    $copies = [];
    foreach ((array) ($d['soumissions'] ?? []) as $eid => $s) {
        if (!is_array($s)) continue;
        $copies[] = [
            'eleveId' => (string) $eid, 'nom' => (string) ($s['nom'] ?? '?'),
            'envoye' => (int) ($s['envoye'] ?? 0),
            'reponses' => (array) ($s['reponses'] ?? []),
            'note' => $s['note'] ?? null, 'sur' => (int) ($s['sur'] ?? 20),
            'appreciation' => (string) ($s['appreciation'] ?? ''),
            'commentaires' => (array) ($s['commentaires'] ?? []),
            'rendue' => !empty($s['rendue']),
        ];
    }
    usort($copies, static function ($a, $b) { return $b['envoye'] <=> $a['envoye']; });
    co_out(200, ['ok' => true, 'devoir' => [
        'token' => (string) $d['token'], 'titre' => (string) $d['titre'],
        'items' => (array) ($d['items'] ?? []), 'niveau' => (string) ($d['niveau'] ?? ''),
    ], 'copies' => $copies]);
}

if ($action === 'apprecier') {
    $c = co_prof($in);
    $f = co_f_devoir((string) ($in['t'] ?? ''));
    if ($f === null || !is_file($f)) co_err(404, 'Devoir introuvable.', 'unknown');

    // Lecture-modification-écriture SOUS VERROU : sans lui, deux copies corrigées
    // coup sur coup s'écrasent l'une l'autre (le second écrivain a lu avant le
    // premier). C'est le scénario NORMAL ici — on corrige en rafale.
    $fp = @fopen($f, 'c+');
    if (!$fp) co_err(500, 'Fichier verrouillé.', 'io');
    @flock($fp, LOCK_EX);
    $d = json_decode((string) stream_get_contents($fp), true);
    if (!is_array($d)) { @flock($fp, LOCK_UN); @fclose($fp); co_err(500, 'Devoir illisible.', 'io'); }
    if ((string) ($d['prof'] ?? '') !== (string) $c['id']) {
        @flock($fp, LOCK_UN); @fclose($fp); co_err(403, 'Ce devoir n\'est pas le vôtre.', 'owner');
    }
    $eid = (string) preg_replace('/[^a-f0-9]/', '', (string) ($in['eleveId'] ?? ''));
    $sub = (array) ($d['soumissions'] ?? []);
    if ($eid === '' || !isset($sub[$eid])) {
        @flock($fp, LOCK_UN); @fclose($fp); co_err(404, 'Copie introuvable.', 'unknown');
    }

    $note = $in['note'] ?? null;
    if ($note !== null && $note !== '') {
        $note = (float) $note;
        if ($note < 0 || $note > 100) { @flock($fp, LOCK_UN); @fclose($fp); co_err(400, 'Note hors barème.', 'note'); }
        $sub[$eid]['note'] = $note;
        $sub[$eid]['sur'] = max(1, min(100, (int) ($in['sur'] ?? 20)));
    } else {
        unset($sub[$eid]['note']);
    }
    $sub[$eid]['appreciation'] = co_texte($in['appreciation'] ?? '');
    $com = [];
    foreach ((array) ($in['commentaires'] ?? []) as $k => $v) {
        $k = (string) preg_replace('/[^0-9]/', '', (string) $k);
        if ($k === '') continue;
        $t = co_texte($v, 600);
        if ($t !== '') $com[$k] = $t;
    }
    $sub[$eid]['commentaires'] = $com;
    $sub[$eid]['rendue'] = true;
    $sub[$eid]['rendueLe'] = time();
    $d['soumissions'] = $sub;

    ftruncate($fp, 0); rewind($fp);
    fwrite($fp, json_encode($d, JSON_UNESCAPED_UNICODE));
    fflush($fp); @flock($fp, LOCK_UN); @fclose($fp);
    co_log('[APPRECIATION] prof=' . $c['id'] . ' t=' . (string) $d['token'] . ' eleve=' . $eid);
    co_out(200, ['ok' => true]);
}

if ($action === 'tableau_bord') {
    $c = co_prof($in);
    $devoirs = 0; $copies = 0; $corrigees = 0; $vues = 0;
    $aRelancer = []; $recents = [];
    $classes = co_lire(co_f_classes(), ['version' => 1, 'classes' => []])['classes'];

    foreach (glob(co_dir() . '/devoirs/*.json') ?: [] as $f) {
        $d = co_lire($f, []);
        if (!$d || (string) ($d['prof'] ?? '') !== (string) $c['id']) continue;
        $devoirs++;
        $vues += (int) ($d['vues'] ?? 0);
        $sub = (array) ($d['soumissions'] ?? []);
        $copies += count($sub);
        foreach ($sub as $s) { if (isset($s['note']) || !empty($s['appreciation'])) $corrigees++; }

        // « Élèves à relancer » : inscrits à la classe du devoir mais sans copie.
        $cl = $classes[(string) ($d['classeId'] ?? '')] ?? null;
        $attendus = is_array($cl) ? (array) ($cl['eleves'] ?? []) : [];
        $manquants = [];
        foreach ($attendus as $eid => $e) {
            if (!isset($sub[$eid])) $manquants[] = (string) ($e['nom'] ?? '?');
        }
        if ($manquants) {
            $aRelancer[] = ['devoir' => (string) $d['titre'], 'token' => (string) $d['token'],
                            'eleves' => array_slice($manquants, 0, 30), 'total' => count($manquants)];
        }
        $recents[] = ['titre' => (string) $d['titre'], 'token' => (string) $d['token'],
                      'cree' => (int) $d['cree'], 'copies' => count($sub),
                      'attendus' => count($attendus),
                      'completion' => $attendus ? round(count($sub) * 100 / count($attendus)) : null];
    }
    usort($recents, static function ($a, $b) { return $b['cree'] <=> $a['cree']; });

    // Parrainage : ce que l'enseignant a rapporté.
    $par = co_lire(co_f_parrain(), ['version' => 1, 'liens' => [], 'compteurs' => []]);
    $moi = (array) ($par['compteurs'][(string) $c['id']] ?? []);

    co_out(200, ['ok' => true, 'bilan' => [
        'devoirs' => $devoirs, 'copies' => $copies, 'corrigees' => $corrigees,
        'aCorriger' => max(0, $copies - $corrigees), 'vues' => $vues,
        'classes' => count(array_filter($classes, static function ($x) use ($c) {
            return is_array($x) && (string) ($x['prof'] ?? '') === (string) $c['id']; })),
        'parrainage' => ['invites' => (int) ($moi['invites'] ?? 0), 'convertis' => (int) ($moi['convertis'] ?? 0)],
    ], 'recents' => array_slice($recents, 0, 12), 'aRelancer' => array_slice($aRelancer, 0, 12)]);
}

/* ═══════════════════════════════════════════════════════════════════════════
   ÉLÈVE — ouvrir, soumettre, relire sa copie
   ═══════════════════════════════════════════════════════════════════════════ */

if ($action === 'devoir_ouvrir') {
    $c = co_eleve($in);
    $f = co_f_devoir((string) ($in['t'] ?? ''));
    if ($f === null || !is_file($f)) co_err(404, 'Devoir introuvable.', 'unknown');
    $d = co_lire($f, []);
    // Le devoir d'une autre classe ne s'ouvre pas avec le code de la sienne.
    if ((string) ($d['niveau'] ?? '') !== (string) $c['c']) {
        co_err(403, 'Ce devoir est destiné à la classe de ' . (string) ($d['niveau'] ?? '?') . '.', 'wrong_class');
    }
    $eid = co_eleve_id($c);
    $moi = (array) ($d['soumissions'][$eid] ?? []);
    co_out(200, ['ok' => true, 'devoir' => [
        'token' => (string) $d['token'], 'titre' => (string) $d['titre'],
        'consigne' => (string) ($d['consigne'] ?? ''), 'items' => (array) ($d['items'] ?? []),
        'niveau' => (string) ($d['niveau'] ?? ''), 'du' => (int) ($d['du'] ?? 0),
        'ouvert' => (bool) ($d['ouvert'] ?? true),
        'profNom' => (string) ($d['profNom'] ?? ''),
    ], 'macopie' => $moi ? [
        'nom' => (string) ($moi['nom'] ?? ''), 'reponses' => (array) ($moi['reponses'] ?? []),
        'envoye' => (int) ($moi['envoye'] ?? 0), 'note' => $moi['note'] ?? null,
        'sur' => (int) ($moi['sur'] ?? 20), 'appreciation' => (string) ($moi['appreciation'] ?? ''),
        'commentaires' => (array) ($moi['commentaires'] ?? []), 'rendue' => !empty($moi['rendue']),
    ] : null]);
}

if ($action === 'soumettre') {
    $c = co_eleve($in);
    $f = co_f_devoir((string) ($in['t'] ?? ''));
    if ($f === null || !is_file($f)) co_err(404, 'Devoir introuvable.', 'unknown');

    $reponses = (array) ($in['reponses'] ?? []);
    $poids = strlen(json_encode($reponses, JSON_UNESCAPED_UNICODE));
    if ($poids > CO_MAX_REPONSES) co_err(413, 'Copie trop volumineuse.', 'size');

    $fp = @fopen($f, 'c+');
    if (!$fp) co_err(500, 'Fichier verrouillé.', 'io');
    @flock($fp, LOCK_EX);
    $d = json_decode((string) stream_get_contents($fp), true);
    if (!is_array($d)) { @flock($fp, LOCK_UN); @fclose($fp); co_err(500, 'Devoir illisible.', 'io'); }
    $fermer = static function () use ($fp) { @flock($fp, LOCK_UN); @fclose($fp); };

    if ((string) ($d['niveau'] ?? '') !== (string) $c['c']) { $fermer(); co_err(403, 'Devoir d\'une autre classe.', 'wrong_class'); }
    if (!($d['ouvert'] ?? true)) { $fermer(); co_err(403, 'Ce devoir est clos — ton enseignant l\'a fermé.', 'closed'); }

    $sub = (array) ($d['soumissions'] ?? []);
    $eid = co_eleve_id($c);
    if (!isset($sub[$eid]) && count($sub) >= CO_MAX_COPIES) { $fermer(); co_err(429, 'Ce devoir a atteint sa limite de copies.', 'quota'); }

    // Une copie déjà corrigée ne se réécrit pas : sinon l'élève modifie sa
    // réponse après avoir lu le corrigé, et la note ne veut plus rien dire.
    if (!empty($sub[$eid]['rendue'])) { $fermer(); co_err(403, 'Ta copie est déjà corrigée : elle ne peut plus être modifiée.', 'graded'); }

    $propres = [];
    foreach ($reponses as $k => $v) {
        $k = (string) preg_replace('/[^0-9a-zA-Z_-]/', '', (string) $k);
        if ($k === '') continue;
        $propres[$k] = is_bool($v) ? $v : co_texte($v, 4000);
    }
    $sub[$eid] = array_merge((array) ($sub[$eid] ?? []), [
        'nom' => co_texte($in['nom'] ?? ($sub[$eid]['nom'] ?? ''), 80),
        'reponses' => $propres,
        'envoye' => time(),
    ]);
    $d['soumissions'] = $sub;

    ftruncate($fp, 0); rewind($fp);
    fwrite($fp, json_encode($d, JSON_UNESCAPED_UNICODE));
    fflush($fp); $fermer();

    // Inscription à la classe (pour le suivi et les relances), best effort.
    $cid = (string) ($d['classeId'] ?? '');
    if ($cid !== '') {
        $fc = co_f_classes();
        $reg = co_lire($fc, ['version' => 1, 'classes' => []]);
        if (isset($reg['classes'][$cid]) && is_array($reg['classes'][$cid])) {
            $reg['classes'][$cid]['eleves'][$eid] = [
                'nom' => (string) $sub[$eid]['nom'], 'vu' => time(),
            ];
            co_ecrire($fc, $reg);
        }
    }
    co_log('[COPIE] t=' . (string) $d['token'] . ' eleve=' . $eid);
    co_out(200, ['ok' => true, 'envoye' => (int) $sub[$eid]['envoye']]);
}

/* ═══════════════════════════════════════════════════════════════════════════
   PUBLIC — aperçu d'un lien partagé, et mur d'abonnement
   ═══════════════════════════════════════════════════════════════════════════ */

if ($action === 'devoir_apercu') {
    $f = co_f_devoir((string) ($in['t'] ?? ''));
    if ($f === null || !is_file($f)) co_err(404, 'Ce lien de devoir n\'existe pas ou a expiré.', 'unknown');
    $d = co_lire($f, []);

    // Compteur de vues : c'est la preuve sociale du tableau de bord (« X élèves
    // ont ouvert ce devoir »). Écriture best effort, jamais bloquante.
    $d['vues'] = (int) ($d['vues'] ?? 0) + 1;
    co_ecrire($f, $d);

    // Ce qui passe le mur : les exercices ÉCRITS PAR L'ENSEIGNANT (ils ne sont
    // pas le produit de VÉRITAS). Ce qui reste derrière : tout renvoi au livret,
    // réduit à un repère. On montre la valeur, on ne donne pas la marchandise.
    $items = [];
    foreach ((array) ($d['items'] ?? []) as $it) {
        if (!is_array($it)) continue;
        if ((string) ($it['src'] ?? '') === 'prof') {
            $items[] = ['n' => (int) $it['n'], 'src' => 'prof',
                        'consigne' => (string) $it['consigne'], 'type' => (string) ($it['type'] ?? 'court')];
            // Le corrigé de l'enseignant reste derrière le mur, lui aussi.
        } else {
            $items[] = ['n' => (int) $it['n'], 'src' => 'verrouille',
                        'repere' => (string) ($it['repere'] ?? 'Exercice du livret')];
        }
    }
    $sub = (array) ($d['soumissions'] ?? []);
    co_out(200, ['ok' => true, 'apercu' => [
        'titre' => (string) $d['titre'], 'consigne' => (string) ($d['consigne'] ?? ''),
        'niveau' => (string) ($d['niveau'] ?? ''), 'profNom' => (string) ($d['profNom'] ?? ''),
        'du' => (int) ($d['du'] ?? 0), 'ouvert' => (bool) ($d['ouvert'] ?? true),
        'items' => $items, 'total' => count($items),
        'verrouilles' => count(array_filter($items, static function ($i) { return $i['src'] === 'verrouille'; })),
        // Preuve sociale : combien d'élèves ont déjà rendu par ce lien.
        'rejoints' => count($sub),
    ]]);
}

/* ═══════════════════════════════════════════════════════════════════════════
   PARRAINAGE — qui a amené qui
   ═══════════════════════════════════════════════════════════════════════════ */

if ($action === 'parrain_visite') {
    // Un lien partagé ouvert par quelqu'un. On compte l'invitation, sans rien
    // stocker sur le visiteur : pas de cookie, pas d'empreinte conservée.
    $p = (string) preg_replace('/[^a-zA-Z0-9_-]/', '', (string) ($in['parrain'] ?? ''));
    if ($p === '' || strlen($p) > 24) co_out(200, ['ok' => true, 'ignore' => true]);
    $f = co_f_parrain();
    $r = co_lire($f, ['version' => 1, 'liens' => [], 'compteurs' => []]);
    $r['compteurs'][$p]['invites'] = (int) ($r['compteurs'][$p]['invites'] ?? 0) + 1;
    co_ecrire($f, $r);
    co_out(200, ['ok' => true]);
}

if ($action === 'parrain_convertir') {
    // Appelé après un retrait de code réussi. La vente doit EXISTER : sans ce
    // contrôle, n'importe qui se créditerait des filleuls en boucle.
    $ref = trim((string) ($in['ref'] ?? ''));
    $p   = (string) preg_replace('/[^a-zA-Z0-9_-]/', '', (string) ($in['parrain'] ?? ''));
    if ($ref === '' || $p === '') co_err(400, 'Référence et parrain requis.', 'empty');
    $vente = vrt_livret_vente_lire($ref);
    if ($vente === null || (string) ($vente['code'] ?? '') === '') co_err(404, 'Vente inconnue.', 'unknown');

    $f = co_f_parrain();
    $r = co_lire($f, ['version' => 1, 'liens' => [], 'compteurs' => []]);
    if (isset($r['liens'][$ref])) co_out(200, ['ok' => true, 'deja' => true]);   // idempotent
    $convertis = (int) ($r['compteurs'][$p]['convertis'] ?? 0) + 1;
    $r['compteurs'][$p]['convertis'] = $convertis;
    $r['liens'][$ref] = ['parrain' => $p, 'classe' => (string) ($vente['classe'] ?? ''),
                         'statut' => 'a_crediter', 'date' => time()];

    // ── La récompense, appliquée TOUT DE SUITE ──────────────────────────────
    $recompense = null;
    $infos = vrt_livret_infos_code($p);
    if ($infos !== null && $infos['statut'] === 'actif') {
        if ($infos['kind'] === 'guide') {
            // Enseignant : un code élève offert tous les N filleuls.
            $du   = intdiv($convertis, LIVRET_PARRAIN_SEUIL_CODE);
            $deja = count((array) ($r['codes'][$p] ?? []));
            if ($du > $deja && $deja < LIVRET_PARRAIN_CODES_MAX) {
                $em = vrt_livret_emettre([
                    'classe' => $infos['classe'], 'kind' => 'livret', 'n' => 1, 'jours' => 365,
                    'label'  => 'Offert au parrain ' . $p,
                ]);
                if ($em['ok'] && !empty($em['codes'])) {
                    if (!isset($r['codes'][$p]) || !is_array($r['codes'][$p])) $r['codes'][$p] = [];
                    $r['codes'][$p][] = ['code' => $em['codes'][0], 'classe' => $infos['classe'],
                                         'cree' => time(), 'expire' => (int) ($em['expire'] ?? 0)];
                    $recompense = ['type' => 'code', 'classe' => $infos['classe']];
                    co_log('[PARRAIN-CODE] parrain=' . $p . ' offert=…' . substr($em['codes'][0], -4));
                }
            } else {
                $recompense = ['type' => 'progression',
                               'reste' => LIVRET_PARRAIN_SEUIL_CODE - ($convertis % LIVRET_PARRAIN_SEUIL_CODE)];
            }
        } else {
            // Élève : son propre accès est prolongé.
            $neuf = vrt_livret_prolonger($p, LIVRET_PARRAIN_JOURS, LIVRET_PARRAIN_JOURS_MAX);
            if ($neuf !== null && $neuf > 0) {
                $r['compteurs'][$p]['jours'] = (int) ($r['compteurs'][$p]['jours'] ?? 0) + LIVRET_PARRAIN_JOURS;
                $recompense = ['type' => 'jours', 'jours' => LIVRET_PARRAIN_JOURS, 'expire' => $neuf];
            }
        }
    }

    if (!co_ecrire($f, $r)) co_err(500, 'Enregistrement impossible.', 'io');
    co_log('[PARRAIN] ref=' . substr($ref, 0, 24) . ' parrain=' . $p . ' convertis=' . $convertis);
    co_out(200, ['ok' => true, 'convertis' => $convertis, 'recompense' => $recompense]);
}

if ($action === 'parrain_bilan') {
    $c = co_claims($in);
    if ($c === null) co_err(401, 'Session expirée.', 'auth');
    $r = co_lire(co_f_parrain(), ['version' => 1, 'liens' => [], 'compteurs' => []]);
    $id  = (string) $c['id'];
    $moi = (array) ($r['compteurs'][$id] ?? []);
    $conv = (int) ($moi['convertis'] ?? 0);
    $estProf = ((string) ($c['k'] ?? '')) === 'guide';
    co_out(200, ['ok' => true, 'parrain' => $id,
                 'invites' => (int) ($moi['invites'] ?? 0),
                 'convertis' => $conv,
                 'lien' => 'https://veritas-school.com/livrets/?p=' . rawurlencode($id),
                 // Le barème, dit en clair : un parrain qui ignore ce qu'il gagne ne parraine pas.
                 'bareme' => $estProf
                     ? ['type' => 'code', 'seuil' => LIVRET_PARRAIN_SEUIL_CODE,
                        'reste' => LIVRET_PARRAIN_SEUIL_CODE - ($conv % LIVRET_PARRAIN_SEUIL_CODE)]
                     : ['type' => 'jours', 'jours' => LIVRET_PARRAIN_JOURS],
                 'joursGagnes' => (int) ($moi['jours'] ?? 0),
                 'joursRestants' => vrt_livret_jours_restants($id),
                 // Codes offerts : rendus au SEUL porteur du jeton correspondant.
                 'codesOfferts' => array_values((array) ($r['codes'][$id] ?? []))]);
}

/* ═══════════════════════════════════════════════════════════════════════════
   ADMIN — crédits de parrainage à régler
   ═══════════════════════════════════════════════════════════════════════════ */

if (strpos($action, 'admin_') === 0) {
    $auth = '';
    if (function_exists('getallheaders')) {
        foreach (getallheaders() as $k => $v) { if (strtolower((string) $k) === 'authorization') { $auth = (string) $v; break; } }
    }
    if ($auth === '') $auth = (string) ($_SERVER['HTTP_AUTHORIZATION'] ?? $_SERVER['REDIRECT_HTTP_AUTHORIZATION'] ?? '');
    $tok = trim(str_ireplace('bearer', '', $auth));
    if (function_exists('vrt_secret_is_compromised') && vrt_secret_is_compromised(API_SECRET)) {
        co_err(503, 'Administration désactivée : secret API à renouveler.', 'compromised');
    }
    if ($tok === '' || !hash_equals((string) API_SECRET, $tok)) co_err(401, 'Non autorisé.', 'auth');

    $f = co_f_parrain();
    $r = co_lire($f, ['version' => 1, 'liens' => [], 'compteurs' => []]);

    if ($action === 'admin_parrainages') {
        $out = [];
        foreach ($r['liens'] as $ref => $l) {
            if (!is_array($l)) continue;
            $out[] = ['ref' => (string) $ref] + $l;
        }
        usort($out, static function ($a, $b) { return (int) $b['date'] <=> (int) $a['date']; });
        co_out(200, ['ok' => true, 'total' => count($out), 'liens' => $out,
                     'aRegler' => count(array_filter($out, static function ($l) { return ($l['statut'] ?? '') === 'a_crediter'; }))]);
    }
    if ($action === 'admin_parrain_regle') {
        $ref = (string) ($in['ref'] ?? '');
        if (!isset($r['liens'][$ref])) co_err(404, 'Lien inconnu.', 'unknown');
        $r['liens'][$ref]['statut'] = 'credite';
        $r['liens'][$ref]['regleLe'] = time();
        if (!co_ecrire($f, $r)) co_err(500, 'Enregistrement impossible.', 'io');
        co_out(200, ['ok' => true]);
    }
    co_err(400, 'Action admin inconnue.', 'action');
}

co_err(400, 'Action inconnue.', 'action');
