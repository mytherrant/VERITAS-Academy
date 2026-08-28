<?php
/**
 * api/compte.php — CRÉATION ET REMONTÉE DES COMPTES VISITEURS (serveur)
 * © 2024-2026 Jacques Miterand TAKOU (Mythe Errant). Tous droits réservés.
 * Œuvre protégée — Loi camerounaise n° 2000/011 + Convention de Berne.
 *
 * POURQUOI CE FICHIER EXISTE
 *   L'inscription sur veritas-school.com ne quittait JAMAIS le navigateur.
 *   `doRegister()` poussait le compte dans `DB.visitorAccounts`, appelait
 *   `save()` → localStorage, et s'arrêtait là : `_fbFetch` court-circuite
 *   api/db.php pour tout ce qui n'est pas admin/enseignant (v2.9.17), donc
 *   aucune requête ne partait. Le compte n'existait que sur CET appareil,
 *   dans CE navigateur.
 *
 *   Conséquences mesurées en production le 28/08/2026 :
 *     1. L'Atelier de Français (plateforme/) interroge `plateforme.php?
 *        action=session`, qui lit `data/veritas_db.json` côté SERVEUR. Le
 *        compte n'y étant pas, la réponse était « Identifiants invalides »
 *        pour un inscrit muni du BON mot de passe. La promesse affichée
 *        (« inscrivez-vous sur veritas-school.com puis revenez ici ») ne
 *        pouvait donc être tenue par personne.
 *     2. Changer d'appareil, de navigateur, ou vider le cache effaçait le
 *        compte définitivement — sans avertissement.
 *     3. Deux visiteurs sur deux appareils pouvaient prendre le MÊME
 *        identifiant : l'unicité n'était vérifiée que dans le localStorage
 *        de celui qui s'inscrivait.
 *
 *   Le correctif du 28/08 sur le hachage (S256 au lieu du clair) était
 *   nécessaire mais ne suffisait pas : un hash correct dans une base que le
 *   serveur ne voit pas reste invisible.
 *
 * FRONTIÈRE DE CONFIANCE
 *   Endpoint PUBLIC (une inscription précède, par définition, tout compte).
 *   Le client ne décide donc QUE de son identité déclarative. Le serveur
 *   fixe lui-même tout ce qui a une valeur : identifiant interne, hash du
 *   mot de passe, droits (`plans` toujours vide), statut de paiement,
 *   horodatage. Un client qui envoie `plans:['premium']` est ignoré.
 *
 * MOT DE PASSE
 *   Reçu en clair sur TLS — comme `plateforme.php?action=session`, qui le
 *   compare lui aussi en clair avant hachage — puis stocké en bcrypt (coût
 *   12) : le format préféré de `vrt_verify_password()`. Le navigateur, lui,
 *   garde sa copie locale en S256 ; les deux formats se vérifient.
 *
 * ACTION UNIQUE ET IDEMPOTENTE
 *   `?action=inscription` sert les deux besoins :
 *     • identifiant libre        → le compte est créé (201) ;
 *     • identifiant pris + bon mot de passe → le compte est DÉJÀ le sien,
 *       on répond 200 `existe:true` (c'est la remontée des comptes nés
 *       avant ce correctif, rejouée à chaque connexion réussie) ;
 *     • identifiant pris + mauvais mot de passe → 409, sans rien révéler
 *       d'autre que ce que tout formulaire d'inscription révèle.
 */
declare(strict_types=1);
require_once __DIR__ . '/_json_boot.php';   // display_errors=0 + purge avant le JSON
require_once __DIR__ . '/config_sync.php';  // CORS allowlist + préflight OPTIONS
require_once __DIR__ . '/_auth_lib.php';    // vrt_load_db, vrt_hash_bcrypt, vrt_verify_password

header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-store, no-cache, must-revalidate, max-age=0');
header('X-Content-Type-Options: nosniff');
header('Vary: Origin');

$DB_FILE  = dirname(__DIR__) . '/data/veritas_db.json';
$DATA_DIR = dirname(__DIR__) . '/data';

function cpt_out(array $payload, int $code = 200): void {
    http_response_code($code);
    echo json_encode($payload, JSON_UNESCAPED_UNICODE);
    exit;
}

$action = (string) ($_GET['action'] ?? '');
$method = $_SERVER['REQUEST_METHOD'] ?? 'GET';

/* ─────────────────────────────────────────────────────────────────────────
   PROFIL — ce que le compte porte d'un appareil à l'autre
   ─────────────────────────────────────────────────────────────────────────
   Les matières enseignées ne vivaient qu'en localStorage : cochées sur
   l'ordinateur, elles étaient inconnues du téléphone, où l'enseignant
   retrouvait les épreuves de génie civil mêlées aux siennes. Un réglage qu'il
   faut refaire sur chaque appareil n'est pas un réglage.

   AUTHENTIFICATION par le jeton de compte (Bearer) déjà émis par
   student_data.php à la connexion — jamais par un identifiant passé dans la
   requête : sinon n'importe qui réécrirait le profil de n'importe qui. Le
   serveur lit le propriétaire DANS le jeton, jamais dans le corps du message.
   ───────────────────────────────────────────────────────────────────────── */
if ($action === 'profil' && $method === 'POST') {
    if (vrt_rate_exceeded('compte_profil', 20)) {
        cpt_out(['ok' => false, 'error' => 'Trop de requêtes — patientez'], 429);
    }
    $hdr = '';
    if (function_exists('getallheaders')) {
        foreach (getallheaders() as $k => $v) { if (strtolower($k) === 'authorization') { $hdr = (string) $v; break; } }
    }
    if ($hdr === '') $hdr = (string) ($_SERVER['HTTP_AUTHORIZATION'] ?? $_SERVER['REDIRECT_HTTP_AUTHORIZATION'] ?? '');
    $jeton = trim(str_ireplace('bearer', '', $hdr));
    if ($jeton === '') cpt_out(['ok' => false, 'error' => 'Authentification requise'], 401);

    $dbp = vrt_load_db();
    if (!is_array($dbp)) cpt_out(['ok' => false, 'error' => 'Base indisponible'], 503);
    $ident = vrt_verify_token($jeton, $dbp);
    if (!$ident) cpt_out(['ok' => false, 'error' => 'Session expirée — reconnectez-vous'], 401);

    $rawp = (string) file_get_contents('php://input');
    if ($rawp === '' || strlen($rawp) > 8192) cpt_out(['ok' => false, 'error' => 'Requête invalide'], 400);
    $inp = json_decode($rawp, true);
    if (!is_array($inp)) cpt_out(['ok' => false, 'error' => 'JSON invalide'], 400);
    if (!array_key_exists('matieres', $inp)) {
        cpt_out(['ok' => false, 'error' => 'Rien à enregistrer'], 400);
    }
    /* Liste bornée et assainie. Une matière est un libellé court : 40 caractères
       suffisent au plus long de la nomenclature officielle, et 40 entrées
       dépassent déjà ce que quiconque enseigne. */
    $mats = [];
    foreach ((array) $inp['matieres'] as $m) {
        if (!is_string($m)) continue;
        $m = trim($m);
        if ($m === '') continue;
        $mats[] = mb_substr($m, 0, 40);
        if (count($mats) >= 40) break;
    }

    /* Le propriétaire vient du JETON. `vrt_verify_token` rend l'identifiant du
       compte : on écrit sur celui-là et sur aucun autre. */
    $cible = strtolower((string) ($ident['acc']['user'] ?? ''));
    if ($cible === '') cpt_out(['ok' => false, 'error' => 'Compte introuvable'], 401);

    $fpp = @fopen($DB_FILE, 'c+');
    if (!$fpp) cpt_out(['ok' => false, 'error' => 'Base indisponible'], 503);
    if (!flock($fpp, LOCK_EX)) { fclose($fpp); cpt_out(['ok' => false, 'error' => 'Base occupée — réessayez'], 503); }
    $curp = stream_get_contents($fpp);
    $cdbp = json_decode((string) $curp, true);
    if (!is_array($cdbp)) { flock($fpp, LOCK_UN); fclose($fpp); cpt_out(['ok' => false, 'error' => 'Base illisible'], 503); }

    $touche = false;
    foreach (['visitorAccounts', 'studentAccounts'] as $coll) {
        if (!isset($cdbp[$coll]) || !is_array($cdbp[$coll])) continue;
        foreach ($cdbp[$coll] as &$a) {
            if (is_array($a) && strtolower((string) ($a['user'] ?? '')) === $cible) {
                $a['matieres'] = $mats;
                $touche = true;
                break 2;
            }
        }
        unset($a);
    }
    if (!$touche) { flock($fpp, LOCK_UN); fclose($fpp); cpt_out(['ok' => false, 'error' => 'Compte introuvable'], 404); }

    $cdbp['lastModified'] = (int) round(microtime(true) * 1000);
    $encp = json_encode($cdbp, JSON_UNESCAPED_UNICODE);
    if ($encp === false) { flock($fpp, LOCK_UN); fclose($fpp); cpt_out(['ok' => false, 'error' => 'Encodage échoué'], 500); }
    ftruncate($fpp, 0); rewind($fpp); fwrite($fpp, $encp); fflush($fpp);
    flock($fpp, LOCK_UN); fclose($fpp);

    cpt_out(['ok' => true, 'matieres' => $mats]);
}

if ($action !== 'inscription' || $method !== 'POST') {
    cpt_out(['ok' => false, 'error' => 'Action inconnue'], 400);
}

/* Rate-limit : l'endpoint crée des enregistrements ET vérifie des mots de
   passe. Le plafond couvre donc les deux abus — inondation de faux comptes
   et essais d'identifiants — sans gêner une famille derrière une même IP. */
if (vrt_rate_exceeded('compte_new', 8)) {
    cpt_out(['ok' => false, 'error' => 'Trop de tentatives — patientez une minute'], 429);
}

$raw = (string) file_get_contents('php://input');
if ($raw === '' || strlen($raw) > 16384) {
    cpt_out(['ok' => false, 'error' => 'Requête invalide'], 400);
}
$in = json_decode($raw, true);
if (!is_array($in)) cpt_out(['ok' => false, 'error' => 'JSON invalide'], 400);

$user = trim((string) ($in['user'] ?? ''));
$pwd  = (string) ($in['motDePasse'] ?? $in['pwd'] ?? '');

/* Mêmes règles que le formulaire du site — écrites ici parce qu'un contrôle
   de saisie côté navigateur n'est pas un contrôle : il suffit d'appeler
   l'URL directement pour le contourner. */
if ($user === '' || $pwd === '') {
    cpt_out(['ok' => false, 'error' => 'Identifiant et mot de passe requis'], 400);
}
if (strlen($user) > 64 || strlen($pwd) > 200) {
    cpt_out(['ok' => false, 'error' => 'Requête invalide'], 400);
}
/* ⚠️ Le FORMAT de l'identifiant n'est PAS contrôlé ici, mais plus bas, juste
   avant la création. Raison : cet endpoint sert aussi la remontée des comptes
   nés AVANT lui — dans un navigateur où le formulaire acceptait les accents,
   l'arobase et les espaces. Refuser leur format à la porte les condamnerait à
   ne jamais rejoindre le serveur, c'est-à-dire exactement le bug qu'on répare.
   Un identifiant hors-norme déjà porté reste donc utilisable ; seuls les
   NOUVEAUX doivent respecter la règle. */

$db = vrt_load_db();
if (!is_array($db)) cpt_out(['ok' => false, 'error' => 'Base indisponible'], 503);

/* ── L'identifiant est-il déjà porté ? ────────────────────────────────────
   `vrt_find_account` ignore les comptes suspendus : ici on veut l'inverse,
   un identifiant suspendu reste prisonnier de son propriétaire. On balaie
   donc les deux collections nous-mêmes. */
$lc = strtolower($user);
$dejaPris = null;
foreach (['studentAccounts', 'visitorAccounts'] as $coll) {
    foreach (($db[$coll] ?? []) as $a) {
        if (is_array($a) && strtolower((string) ($a['user'] ?? '')) === $lc) { $dejaPris = $a; break 2; }
    }
}

if ($dejaPris !== null) {
    /* Remontée : le compte est déjà connu du serveur. Si le mot de passe
       correspond, c'est bien le sien — on le lui dit, et le navigateur
       cesse de retenter à chaque connexion. Sinon l'identifiant est pris
       par quelqu'un d'autre, et c'est tout ce qu'on en dira. */
    $besoinMaj = false;
    $ok = vrt_verify_password($pwd, (string) ($dejaPris['pwd'] ?? ''), (string) ($dejaPris['user'] ?? ''), $besoinMaj);
    if ($ok) {
        cpt_out([
            'ok'      => true,
            'existe'  => true,
            'id'      => (string) ($dejaPris['id'] ?? ''),
            'message' => 'Compte déjà enregistré sur le serveur',
        ]);
    }
    cpt_out(['ok' => false, 'existe' => true,
        'error' => 'Cet identifiant est déjà pris, choisissez-en un autre'], 409);
}

/* ── Création ─────────────────────────────────────────────────────────────
   Liste blanche stricte. Tout champ non listé est jeté : c'est ce qui
   empêche `{"plans":["premium"],"inscriptionPayee":true}` d'ouvrir un
   abonnement gratuit à qui sait ouvrir la console. */
/* Format imposé aux NOUVEAUX identifiants (cf. la note plus haut : les
   anciens, déjà portés, sont servis avant d'arriver ici). Le formulaire du
   site applique la même règle, mot pour mot — sans quoi un visiteur verrait
   son inscription acceptée à l'écran puis refusée par le serveur. */
if (!preg_match('/^[A-Za-z0-9._-]{3,32}$/', $user)) {
    cpt_out(['ok' => false, 'error' => 'Identifiant : 3 à 32 caractères — lettres, chiffres, point, tiret ou souligné'], 400);
}
if (strlen($pwd) < 6) {
    cpt_out(['ok' => false, 'error' => 'Mot de passe : 6 caractères minimum'], 400);
}

function cpt_txt($v, int $max): string {
    return substr(trim((string) $v), 0, $max);
}
$rolesConnus = ['eleve', 'enseignant', 'parent', 'auteur', 'partenaire', 'mecene'];
$role = strtolower(cpt_txt($in['role'] ?? 'eleve', 20));
if (!in_array($role, $rolesConnus, true)) $role = 'eleve';

$profilIn = is_array($in['profil'] ?? null) ? $in['profil'] : [];

/* Le portillon des 100 F est un réglage d'ADMINISTRATION (DB.accessGate),
   lu ici dans la base — jamais dans la requête. Sinon le client choisirait
   lui-même s'il doit payer son inscription. */
$gateActif = !empty($db['accessGate']['actif']);

$acc = [
    'id'    => 'va_' . round(microtime(true) * 1000) . '_' . bin2hex(random_bytes(3)),
    'user'  => $user,
    'pwd'   => vrt_hash_bcrypt($pwd),
    'nom'   => cpt_txt($in['nom'] ?? '', 80),
    'pre'   => cpt_txt($in['pre'] ?? '', 80),
    'tel'   => cpt_txt($in['tel'] ?? '', 30),
    'email' => cpt_txt($in['email'] ?? '', 120),
    'cls'   => cpt_txt($in['cls'] ?? '', 40),
    'serie' => cpt_txt($in['serie'] ?? '', 40),
    'profil' => [
        'sys'   => cpt_txt($profilIn['sys'] ?? 'fr', 8),
        'ens'   => cpt_txt($profilIn['ens'] ?? 'gen', 8),
        'cls'   => cpt_txt($profilIn['cls'] ?? ($in['cls'] ?? ''), 40),
        'serie' => cpt_txt($profilIn['serie'] ?? ($in['serie'] ?? ''), 40),
    ],
    'role'  => $role,
    'plans' => [],                                   // ← jamais depuis le client
    'statut'           => $gateActif ? 'en_attente_paiement' : 'actif',
    'inscriptionPayee' => $gateActif ? false : true,
    'dateInscription'  => date('d/m/Y'),
    /* Horodatage de naissance CÔTÉ SERVEUR. C'est lui que db.php compare au
       `lastModified` d'une synchronisation administrateur pour distinguer
       « compte que l'admin ne pouvait pas connaître » (à conserver) de
       « compte que l'admin a supprimé » (à ne pas ressusciter). */
    'srvAt'      => (int) round(microtime(true) * 1000),
    'srvCreated' => true,
];
if ($role === 'auteur' || $role === 'enseignant') {
    $acc['discipline'] = cpt_txt($in['discipline'] ?? '', 60);
    if ($role === 'enseignant') $acc['isTeacher'] = true;
    else $acc['isAuthor'] = true;
} elseif ($role === 'partenaire' || $role === 'mecene') {
    $acc['isPartner'] = true;
    $acc['orgNom']    = cpt_txt($in['orgNom'] ?? '', 120);
    $acc['orgType']   = cpt_txt($in['orgType'] ?? ($role === 'mecene' ? 'mecene' : ''), 40);
} elseif ($role === 'parent') {
    $acc['isParent'] = true;
    $acc['childMat'] = strtoupper(cpt_txt($in['childMat'] ?? '', 30));
}

/* ── Écriture : read-modify-write sous verrou exclusif ────────────────────
   Même motif que student_data.php. Le contrôle d'unicité est REJOUÉ sous le
   verrou : entre la lecture d'en haut et l'écriture ici, une autre requête a
   pu prendre l'identifiant. Sans cela, deux inscriptions simultanées avec le
   même identifiant passeraient toutes les deux. */
$fp = @fopen($DB_FILE, 'c+');
if (!$fp) cpt_out(['ok' => false, 'error' => 'Base indisponible'], 503);
if (!flock($fp, LOCK_EX)) { fclose($fp); cpt_out(['ok' => false, 'error' => 'Base occupée — réessayez'], 503); }

$cur = stream_get_contents($fp);
$cdb = json_decode((string) $cur, true);
if (!is_array($cdb)) { flock($fp, LOCK_UN); fclose($fp); cpt_out(['ok' => false, 'error' => 'Base illisible'], 503); }

foreach (['studentAccounts', 'visitorAccounts'] as $coll) {
    foreach (($cdb[$coll] ?? []) as $a) {
        if (is_array($a) && strtolower((string) ($a['user'] ?? '')) === $lc) {
            flock($fp, LOCK_UN); fclose($fp);
            cpt_out(['ok' => false, 'existe' => true,
                'error' => 'Cet identifiant est déjà pris, choisissez-en un autre'], 409);
        }
    }
}

$bkDir = $DATA_DIR . '/_backups';
if (!is_dir($bkDir)) @mkdir($bkDir, 0750, true);
@file_put_contents($bkDir . '/veritas_db.' . date('Ymd_His') . '.' . bin2hex(random_bytes(3)) . '.cpt.json', $cur);
$bks = glob($bkDir . '/veritas_db.*.json');
if ($bks && count($bks) > 40) {
    sort($bks);
    foreach (array_slice($bks, 0, count($bks) - 40) as $old) { @unlink($old); }
}

if (!isset($cdb['visitorAccounts']) || !is_array($cdb['visitorAccounts'])) $cdb['visitorAccounts'] = [];
$cdb['visitorAccounts'][] = $acc;
$cdb['lastModified'] = (int) round(microtime(true) * 1000);

$enc = json_encode($cdb, JSON_UNESCAPED_UNICODE);
if ($enc === false) { flock($fp, LOCK_UN); fclose($fp); cpt_out(['ok' => false, 'error' => 'Encodage échoué'], 500); }
ftruncate($fp, 0);
rewind($fp);
fwrite($fp, $enc);
fflush($fp);
flock($fp, LOCK_UN);
fclose($fp);

@file_put_contents(__DIR__ . '/data/_access_log.txt',
    date('c') . ' COMPTE_NEW user=' . $user . ' role=' . $role . ' ip=' . vrt_client_ip() . "\n", FILE_APPEND);

cpt_out(['ok' => true, 'existe' => false, 'id' => $acc['id'], 'srvAt' => $acc['srvAt']], 201);
