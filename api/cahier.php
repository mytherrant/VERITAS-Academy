<?php
/**
 * api/cahier.php — LE CAHIER DE L'ÉLÈVE : ce qu'il écrit, et ce que le professeur y répond
 * © 2024-2026 Jacques Miterand TAKOU (Mythe Errant). Tous droits réservés.
 * Œuvre protégée — Loi camerounaise n° 2000/011 + Convention de Berne.
 *
 * BUT — un cahier en ligne où l'élève ÉCRIT. Ses réponses lui appartiennent,
 * le suivent d'un appareil à l'autre, et son enseignant peut les lire, les
 * annoter et les noter, exercice par exercice.
 *
 * CE QUE CE FICHIER AJOUTE, ET QUI MANQUAIT
 *   api/collab.php gère déjà les DEVOIRS : l'enseignant compose, l'élève rend,
 *   une copie corrigée se fige. C'est un événement, avec une date de remise.
 *   Mais l'élève travaille aussi SEUL dans son cahier, tout au long de l'année,
 *   sans qu'aucun devoir n'ait été donné. Ces réponses-là ne vivaient que dans
 *   le `localStorage` du navigateur : changer de téléphone, vider son cache ou
 *   ouvrir le cahier sur l'ordinateur de la maison, et tout était perdu.
 *
 * LA CLÉ D'UN EXERCICE — le point le plus important de tout ce fichier
 *   Chaque réponse est rangée sous une `item_key` de la forme
 *   « <ouvrage>/<bloc>/<run> », calculée à partir de la STRUCTURE du document.
 *
 *   Le moteur d'origine numérotait les champs dans l'ordre d'affichage
 *   (« a1 », « a2 », « a3 »…). Ajoutez un exercice en séquence 2 et tout ce qui
 *   suit se décale : l'élève retrouve ses réponses sur les mauvaises questions,
 *   et l'annotation du professeur désigne un autre exercice que celui qu'il a
 *   lu. Une clé d'ordre est une bombe à retardement dès que le document bouge —
 *   or un cahier scolaire se corrige entre deux rentrées.
 *
 *   Le serveur ne FABRIQUE pas ces clés (il ne connaît pas le document) : il
 *   les valide, les stocke telles quelles, et refuse tout ce qui n'a pas la
 *   forme attendue. C'est le client qui les dérive du document, de façon
 *   reproductible.
 *
 * IDENTITÉS — aucune inscription de plus, on réutilise les codes de cahier
 *   ÉLÈVE      = jeton de nature `livret` (api/livret.php). Son identité est
 *                celle de son CODE : il retrouve donc ses réponses sur ses
 *                trois appareils, et révoquer le code coupe tout.
 *   ENSEIGNANT = jeton de nature `guide` sur LE MÊME ouvrage. Il lit les
 *                copies de son ouvrage, jamais celles d'un autre niveau.
 *
 * STOCKAGE — un fichier par élève et par ouvrage :
 *   api/data/cahiers/<ouvrage>/<eleve>.json
 *   Le partitionnement n'est pas cosmétique : une classe de 40 élèves qui
 *   travaille à la même heure ne doit pas se disputer un verrou unique.
 *
 * USAGE (POST JSON)
 *   ÉLÈVE
 *     {action:"charger",     token}                    → {reponses, annotations, maj}
 *     {action:"enregistrer", token, reponses:{k:v,…}}  → fusion, jamais remplacement
 *   ENSEIGNANT (jeton `guide` du même ouvrage)
 *     {action:"copies",  token}                        → qui a travaillé, et combien
 *     {action:"copie",   token, eleve}                 → une copie entière
 *     {action:"annoter", token, eleve, item, texte, note}
 */
declare(strict_types=1);
require_once __DIR__ . '/_json_boot.php';
ob_start();
require_once __DIR__ . '/_auth_lib.php';
require_once __DIR__ . '/_livret_lib.php';

// ── CORS (même allowlist que livret.php / collab.php) ────────────────────────
$ch_allowed = [
    'https://veritas-school.com', 'https://www.veritas-school.com',
    'http://localhost:8000', 'http://localhost:8077', 'http://localhost:3000', 'https://localhost', 'capacitor://localhost',
];
$ch_origin = (string) ($_SERVER['HTTP_ORIGIN'] ?? '');
if (in_array($ch_origin, $ch_allowed, true)) {
    header('Access-Control-Allow-Origin: ' . $ch_origin);
    header('Vary: Origin');
}
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');
header('X-Content-Type-Options: nosniff');
header('Referrer-Policy: no-referrer');
header('X-Robots-Tag: noindex, nofollow, noarchive, nosnippet');
header('X-Frame-Options: DENY');
if (($_SERVER['REQUEST_METHOD'] ?? '') === 'OPTIONS') { http_response_code(204); exit; }

// ── Sorties ─────────────────────────────────────────────────────────────────
function ch_out(int $code, array $d): void {
    while (ob_get_level() > 0) { ob_end_clean(); }
    http_response_code($code);
    header('Content-Type: application/json; charset=utf-8');
    header('Cache-Control: private, no-store, max-age=0');
    echo json_encode($d, JSON_UNESCAPED_UNICODE);
    exit;
}
function ch_err(int $c, string $m, string $tag = ''): void {
    ch_out($c, ['ok' => false, 'error' => $m, 'code' => $tag]);
}

/* ── PLAFONDS ────────────────────────────────────────────────────────────────
   Ils protègent le disque du serveur, pas l'élève. Chacun REFUSE bruyamment
   plutôt que de tronquer : une réponse coupée en silence, l'élève ne la voit
   pas disparaître — il la découvre absente le jour du contrôle. */
const CH_MAX_REPONSE   = 6000;    // caractères pour UNE réponse (une dissertation tient dedans)
const CH_MAX_ITEMS     = 4000;    // exercices distincts par élève et par ouvrage
const CH_MAX_ENVOI     = 262144;  // 256 Ko par requête d'enregistrement
const CH_MAX_ANNOT     = 2000;    // caractères pour une annotation
const CH_MAX_ELEVES    = 3000;    // copies listables pour un ouvrage

function ch_dir(string $ouvrage = ''): string {
    $base = (defined('VRT_LIVRET_DIR') ? (string) VRT_LIVRET_DIR : __DIR__ . '/data') . '/cahiers';
    $d = $ouvrage === '' ? $base : $base . '/' . $ouvrage;
    if (!is_dir($d)) { @mkdir($d, 0775, true); }
    return $d;
}

/** Fichier d'un élève. L'identifiant vient du JETON, jamais du corps de la
 *  requête : sans cela, n'importe qui écrirait dans le cahier d'un autre. */
function ch_fichier(string $ouvrage, string $eleve): string {
    return ch_dir($ouvrage) . '/' . $eleve . '.json';
}

function ch_lire(string $f): array {
    if (!is_file($f)) return ['reponses' => [], 'annotations' => [], 'maj' => 0, 'cree' => time()];
    $d = json_decode((string) @file_get_contents($f), true);
    if (!is_array($d)) return ['reponses' => [], 'annotations' => [], 'maj' => 0, 'cree' => time()];
    $d['reponses']    = (array) ($d['reponses'] ?? []);
    $d['annotations'] = (array) ($d['annotations'] ?? []);
    return $d;
}

/* Écriture atomique : on écrit à côté puis on renomme. Une coupure de courant
   au milieu d'un `file_put_contents` laisse un JSON tronqué — donc un cahier
   d'élève illisible, c'est-à-dire perdu. `rename` est atomique sur le même
   volume : le fichier est soit l'ancien, soit le nouveau, jamais un moignon. */
function ch_ecrire(string $f, array $d): bool {
    $tmp = $f . '.' . bin2hex(random_bytes(4)) . '.tmp';
    $j = json_encode($d, JSON_UNESCAPED_UNICODE);
    if ($j === false) return false;
    if (@file_put_contents($tmp, $j, LOCK_EX) === false) { @unlink($tmp); return false; }
    if (!@rename($tmp, $f)) { @unlink($tmp); return false; }
    return true;
}

/** La forme d'une clé d'exercice. On refuse tout le reste — une clé libre
 *  serait un chemin de fichier déguisé, et un moyen d'écrire n'importe où. */
function ch_cle_valide(string $k): bool {
    return $k !== '' && strlen($k) <= 120 && (bool) preg_match('~^[A-Za-z0-9_-]+(/[A-Za-z0-9_.-]+){1,5}$~', $k);
}

function ch_texte($v, int $max): string {
    if (!is_scalar($v)) return '';
    $s = trim((string) $v);
    // Normalise les fins de ligne : sinon la même réponse pèse 2 octets de plus
    // par ligne selon le navigateur, et les comparaisons de longueur mentent.
    $s = str_replace(["\r\n", "\r"], "\n", $s);
    return mb_substr($s, 0, $max);
}

// ── Entrée ──────────────────────────────────────────────────────────────────
if (vrt_rate_exceeded('cahier', 90)) {
    ch_err(429, 'Trop de requêtes. Patientez une minute.', 'rate');
}
$brut = (string) file_get_contents('php://input');
if (strlen($brut) > CH_MAX_ENVOI) {
    ch_err(413, 'Envoi trop volumineux. Vos réponses n’ont PAS été enregistrées — '
              . 'attendez quelques secondes et réessayez.', 'size');
}
$in = json_decode($brut, true);
if (!is_array($in)) ch_err(400, 'Requête illisible.', 'json');

if ($ch_origin !== '' && !in_array($ch_origin, $ch_allowed, true)) {
    ch_err(403, 'Origine non autorisée.', 'origin');
}
$action = (string) ($in['action'] ?? '');

/* Le jeton dit QUI écrit, sur QUEL ouvrage, et à quel titre. Les trois viennent
   de la signature du serveur : le client ne choisit ni son identité, ni son
   niveau, ni son rôle. */
$claims = vrt_livret_jeton_verifier((string) ($in['token'] ?? ''));
if ($claims === null) ch_err(401, 'Session expirée — ressaisissez votre code.', 'auth');

$reg = vrt_livret_registre_charger();
$cle = (string) ($claims['id'] ?? '');
$e   = $reg['codes'][$cle] ?? null;
foreach ($reg['codes'] as $k => $v) {          // le jeton porte l'id court
    if (substr((string) $k, 0, 12) === substr($cle, 0, 12)) { $e = $v; break; }
}
if (!is_array($e) || (string) ($e['st'] ?? '') === 'revoque') {
    ch_err(403, 'Ce code a été révoqué.', 'revoked');
}
if ((int) ($e['exp'] ?? 0) > 0 && (int) $e['exp'] < time()) {
    ch_err(403, 'Ce code a expiré.', 'expired');
}

$ouvrage = preg_replace('/[^a-z0-9_-]/', '', strtolower((string) ($claims['c'] ?? '')));
$kind    = (string) ($claims['k'] ?? 'livret');
$moi     = substr(hash('sha256', (string) ($claims['id'] ?? '')), 0, 16);
if ($ouvrage === '') ch_err(400, 'Ouvrage inconnu.', 'ouvrage');

// ═══ ÉLÈVE ══════════════════════════════════════════════════════════════════

if ($action === 'charger') {
    $d = ch_lire(ch_fichier($ouvrage, $moi));
    ch_out(200, [
        'ok' => true, 'ouvrage' => $ouvrage,
        'reponses'    => (object) $d['reponses'],
        'annotations' => (object) $d['annotations'],
        'maj'         => (int) ($d['maj'] ?? 0),
        'total'       => count($d['reponses']),
        /* Combien de corrections type existent pour CET ouvrage. Le cahier ne
           pose son bouton « Voir la correction » que si ce nombre est non nul :
           tous les cahiers n'en ont pas (les livrets du 2ⁿᵈ cycle n'en portent
           aucune dans leur source), et un bouton qui répond toujours « aucune
           correction » se lit comme une panne. */
        'corriges'    => count(ch_corriges($ouvrage)),
    ]);
}

if ($action === 'enregistrer') {
    if ($kind !== 'livret') ch_err(403, 'Un compte enseignant n’écrit pas dans le cahier d’un élève.', 'role');
    $envoi = $in['reponses'] ?? null;
    if (!is_array($envoi)) ch_err(400, 'Aucune réponse à enregistrer.', 'vide');

    $f = ch_fichier($ouvrage, $moi);
    $d = ch_lire($f);

    /* FUSION, jamais remplacement. Le client n'envoie que ce qui a changé
       depuis la dernière fois — c'est ce qui rend l'enregistrement supportable
       sur une connexion lente. Écraser le tout à chaque envoi ferait perdre
       toutes les réponses saisies pendant qu'une requête était en vol. */
    $ecrits = 0; $refuses = [];
    foreach ($envoi as $k => $v) {
        $k = (string) $k;
        if (!ch_cle_valide($k)) { $refuses[] = 'clé invalide'; continue; }
        // Effacement volontaire : l'élève a vidé le champ.
        if ($v === null || $v === '') {
            if (isset($d['reponses'][$k])) { unset($d['reponses'][$k]); $ecrits++; }
            continue;
        }
        if (!isset($d['reponses'][$k]) && count($d['reponses']) >= CH_MAX_ITEMS) {
            ch_err(413, 'Ce cahier a atteint sa limite d’exercices enregistrés.', 'quota');
        }
        $txt = ch_texte($v, CH_MAX_REPONSE);
        if (mb_strlen((string) $v) > CH_MAX_REPONSE) {
            $refuses[] = $k;   // on le DIT : la réponse a été coupée
        }
        if (($d['reponses'][$k] ?? null) !== $txt) { $d['reponses'][$k] = $txt; $ecrits++; }
    }
    $d['maj'] = time();
    if (!ch_ecrire($f, $d)) ch_err(500, 'Enregistrement impossible — réessayez.', 'io');

    ch_out(200, ['ok' => true, 'ecrits' => $ecrits, 'total' => count($d['reponses']),
                 'maj' => $d['maj'],
                 'tronquees' => $refuses ? array_values(array_slice($refuses, 0, 5)) : []]);
}

/* ═══ LE CORRIGÉ, APRÈS AVOIR CHERCHÉ ════════════════════════════════════════
   « L'apprenant peut travailler de manière autonome puis voir les corrigés
   sans avoir besoin de l'enseignant. » — c'est le premier des trois modes de
   déverrouillage prévus au cahier des charges : à la complétion, exercice par
   exercice, sans intervention humaine.

   TROIS CHOSES QUE CETTE ACTION REFUSE DE FAIRE
   ① Elle n'envoie pas le corrigé d'avance. Le cahier que l'élève télécharge
      n'en contient aucun (`tests/banc_cahiers_reels.cjs` le vérifie sur les
      15 ouvrages) : ils vivent dans `corrige-<ouvrage>.js`, dans le dossier
      protégé, et ne sortent d'ici qu'un par un. Masquer un corrigé en CSS
      aurait suffi à l'afficher — trois clics dans l'inspecteur.
   ② Elle n'en donne pas un que l'élève n'a pas cherché. La règle est vérifiée
      ICI, sur ce que le serveur a enregistré : une réponse non vide sous cette
      clé. Un contrôle côté client se contourne en changeant une variable.
   ③ Elle ne rend pas la table. Une action qui répondrait « voici tous les
      corrigés » économiserait des requêtes et supprimerait la règle.

   L'enseignant, lui, y accède sans condition : c'est son métier de préparer
   son cours avant que quiconque ait répondu.
*/
if ($action === 'corrige') {
    $item = (string) ($in['item'] ?? '');
    if (!ch_cle_valide($item)) ch_err(400, 'Exercice non précisé.', 'item');

    /* A-t-il cherché ? On accepte la clé exacte OU l'une de ses descendantes :
       un exercice peut porter plusieurs champs (plusieurs pointillés, un
       tableau), et avoir rempli l'un d'eux, c'est s'y être mis. */
    if ($kind !== 'guide') {
        $d = ch_lire(ch_fichier($ouvrage, $moi));
        $repondu = false;
        foreach ($d['reponses'] as $k => $v) {
            if (trim((string) $v) === '') continue;
            if ($k === $item || strpos((string) $k, $item . '/') === 0
                || strpos($item, (string) $k . '/') === 0) { $repondu = true; break; }
        }
        if (!$repondu) {
            ch_err(403, 'Réponds d’abord à cet exercice — la correction s’ouvre ensuite.', 'cherche');
        }
    }

    /* L'empreinte de la consigne est le 4ᵉ segment de la clé, suffixe d'ordre
       retiré. On ne dérive PAS le corrigé du rang de l'exercice : renuméroter
       un cahier déplacerait alors toutes les corrections d'un cran. */
    $bouts = explode('/', $item);
    $emp = isset($bouts[3]) ? (string) $bouts[3] : '';
    $emp = preg_replace('/_\d+$/', '', $emp);
    if ($emp === '' || !preg_match('/^[a-z0-9]{1,12}$/', $emp)) {
        ch_err(400, 'Exercice non précisé.', 'item');
    }

    $table = ch_corriges($ouvrage);
    if (!isset($table[$emp])) {
        // Dit tel quel : tous les cahiers n'ont pas de corrigé pour chaque
        // exercice, et une production écrite n'en a pas du tout.
        ch_err(404, 'Cet exercice n’a pas de correction type.', 'aucun');
    }
    ch_out(200, ['ok' => true, 'item' => $item, 'corrige' => (string) $table[$emp]]);
}

/** La table des corrigés d'un ouvrage — `empreinte de la consigne => corrigé`.
 *
 *  Elle est lue depuis le MÊME dossier protégé que le cahier vendu, jamais
 *  depuis le dépôt : le dépôt GitHub est public, y pousser cette table
 *  reviendrait à publier les corrigés de tous les cahiers en vente.
 *  Le fichier peut être absent — un ouvrage sans corrigé type est un cas
 *  normal, pas une panne : on rend une table vide et l'action répond 404.
 */
function ch_corriges(string $ouvrage): array {
    static $cache = [];
    if (isset($cache[$ouvrage])) return $cache[$ouvrage];
    $base = defined('VRT_LIVRET_DONNEES')
          ? (string) VRT_LIVRET_DONNEES
          : dirname(__DIR__) . '/uploads/protected/livrets';
    $f = $base . '/corrige-' . $ouvrage . '.js';
    $t = [];
    if (is_file($f)) {
        $js = (string) @file_get_contents($f);
        $i = strpos($js, '=');
        if ($i !== false) {
            $j = json_decode(rtrim(trim(substr($js, $i + 1)), ';'), true);
            if (is_array($j)) $t = $j;
        }
    }
    $cache[$ouvrage] = $t;
    return $t;
}

// ═══ ENSEIGNANT (jeton `guide` du MÊME ouvrage) ═════════════════════════════

function ch_exiger_prof(string $kind): void {
    if ($kind !== 'guide') {
        ch_err(403, 'Réservé à l’enseignant (code du Guide pédagogique).', 'role');
    }
}

if ($action === 'copies') {
    ch_exiger_prof($kind);
    $out = [];
    foreach (glob(ch_dir($ouvrage) . '/*.json') ?: [] as $f) {
        if (count($out) >= CH_MAX_ELEVES) break;
        $d = ch_lire($f);
        $out[] = [
            'eleve'    => basename($f, '.json'),
            'exercices'=> count($d['reponses']),
            'annotes'  => count($d['annotations']),
            'maj'      => (int) ($d['maj'] ?? 0),
        ];
    }
    usort($out, static function ($a, $b) { return $b['maj'] <=> $a['maj']; });
    ch_out(200, ['ok' => true, 'ouvrage' => $ouvrage, 'total' => count($out), 'copies' => $out]);
}

if ($action === 'copie') {
    ch_exiger_prof($kind);
    $eleve = preg_replace('/[^a-f0-9]/', '', strtolower((string) ($in['eleve'] ?? '')));
    if ($eleve === '') ch_err(400, 'Élève non précisé.', 'eleve');
    $f = ch_fichier($ouvrage, $eleve);
    if (!is_file($f)) ch_err(404, 'Cette copie n’existe pas.', 'unknown');
    $d = ch_lire($f);
    ch_out(200, ['ok' => true, 'eleve' => $eleve,
                 'reponses' => (object) $d['reponses'],
                 'annotations' => (object) $d['annotations'],
                 'maj' => (int) ($d['maj'] ?? 0)]);
}

if ($action === 'annoter') {
    ch_exiger_prof($kind);
    $eleve = preg_replace('/[^a-f0-9]/', '', strtolower((string) ($in['eleve'] ?? '')));
    $item  = (string) ($in['item'] ?? '');
    if ($eleve === '')          ch_err(400, 'Élève non précisé.', 'eleve');
    if (!ch_cle_valide($item))  ch_err(400, 'Exercice non précisé.', 'item');

    $f = ch_fichier($ouvrage, $eleve);
    if (!is_file($f)) ch_err(404, 'Cette copie n’existe pas.', 'unknown');
    $d = ch_lire($f);

    $texte = ch_texte($in['texte'] ?? '', CH_MAX_ANNOT);
    $note  = $in['note'] ?? null;
    if ($texte === '' && $note === null) {
        unset($d['annotations'][$item]);          // retirer une annotation
    } else {
        $a = ['texte' => $texte, 'date' => time(),
              'par' => substr(hash('sha256', (string) ($claims['id'] ?? '')), 0, 8)];
        // Une note se borne : « 25/20 » n'existe pas, et une note négative non plus.
        if ($note !== null && $note !== '') {
            $n = (float) $note;
            if ($n < 0 || $n > 20) ch_err(400, 'La note doit être comprise entre 0 et 20.', 'note');
            $a['note'] = round($n, 2);
        }
        $d['annotations'][$item] = $a;
    }
    $d['majProf'] = time();
    if (!ch_ecrire($f, $d)) ch_err(500, 'Enregistrement impossible — réessayez.', 'io');
    ch_out(200, ['ok' => true, 'item' => $item, 'annotations' => count($d['annotations'])]);
}

ch_err(400, 'Action inconnue.', 'action');
