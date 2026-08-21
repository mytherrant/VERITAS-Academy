<?php
/**
 * api/plateforme.php — Atelier de Français : corpus, état de groupe et quotas
 * © 2024-2026 Jacques Miterand TAKOU (Mythe Errant). Tous droits réservés.
 * Œuvre protégée — Loi camerounaise n° 2000/011 + Convention de Berne.
 *
 * BUT
 *   Servir à l'Atelier de Français (plateforme/) ce qui ne peut pas vivre dans
 *   le navigateur : le corpus sous condition de droit, l'état partagé d'un
 *   groupe d'établissement, et le décompte des quotas.
 *
 * POURQUOI LE CORPUS PASSE PAR ICI
 *   Les 1040 textes et 137 citations sont le produit vendu. Livrés en fichier
 *   .js statique, ils
 *   sont téléchargeables par n'importe qui avec l'URL — l'abonnement ne
 *   protégerait alors que l'interface, pas la marchandise. Ils vivent donc
 *   dans api/data/ (dossier « Require all denied ») et ne sortent qu'après
 *   vérification du droit.
 *
 * DROIT D'ACCÈS — deux portes, dans cet ordre
 *   1. un abonnement actif (plans de l'Atelier), ou
 *   2. la période d'essai, dont la durée est réglée par l'administration
 *      (jours d'essai + cadeau de bienvenue). Le premier accès est horodaté
 *      côté SERVEUR : sans cela, vider son navigateur relancerait l'essai.
 *
 * QUOTAS
 *   Incrément atomique sous flock, par utilisateur ET par équipe, avec remise
 *   à zéro au changement de mois. Le compteur du navigateur n'est qu'un
 *   affichage : c'est celui-ci qui autorise ou refuse.
 *
 * CE QUE CE FICHIER NE FAIT PAS
 *   Il n'encaisse rien. Le paiement reste l'affaire de payment_camerpay.php et
 *   l'octroi du droit celle de vrt_grant_entitlement() : un seul chemin
 *   d'argent, un seul point de contrôle du prix.
 */
declare(strict_types=1);

require_once __DIR__ . '/_json_boot.php';   // display_errors=0 + purge avant le JSON
require_once __DIR__ . '/config_sync.php';  // CORS allowlist + préflight OPTIONS
require_once __DIR__ . '/_auth_lib.php';    // auth, tokens, plans actifs

header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-store, no-cache, must-revalidate, max-age=0');
header('X-Content-Type-Options: nosniff');
header('Vary: Origin');

$action = (string) ($_GET['action'] ?? 'config');
$method = strtoupper((string) ($_SERVER['REQUEST_METHOD'] ?? 'GET'));

$DATA_DIR    = __DIR__ . '/data';
$CORPUS_FILE = $DATA_DIR . '/corpus_minesec.json';
$CITATIONS_FILE = $DATA_DIR . '/citations_minesec.json';
$DB_FILE     = vrt_db_file();

/* ─────────────────────────────────────────────────────────────────────────
   Outils
   ───────────────────────────────────────────────────────────────────────── */

/** Corps JSON de la requête, borné. Au-delà, c'est une erreur d'appel. */
function plat_input(int $maxOctets = 2000000): array
{
    $brut = file_get_contents('php://input');
    if ($brut === false || $brut === '') return [];
    if (strlen($brut) > $maxOctets) {
        jsonResponse(['ok' => false, 'error' => 'Charge utile trop grande'], 413);
    }
    $j = json_decode($brut, true);
    return is_array($j) ? $j : [];
}

/** Jeton porteur, avec les mêmes replis que requireAuth() (LiteSpeed). */
function plat_bearer(): string
{
    $auth = '';
    if (function_exists('getallheaders')) {
        foreach (getallheaders() as $k => $v) {
            if (strtolower((string) $k) === 'authorization') { $auth = (string) $v; break; }
        }
    }
    if ($auth === '') {
        $auth = (string) ($_SERVER['HTTP_AUTHORIZATION']
            ?? $_SERVER['REDIRECT_HTTP_AUTHORIZATION'] ?? '');
    }
    if ($auth === '' && !empty($_GET['_t']))  $auth = 'Bearer ' . (string) $_GET['_t'];
    if ($auth === '' && !empty($_POST['_t'])) $auth = 'Bearer ' . (string) $_POST['_t'];
    return trim(str_ireplace('bearer', '', $auth));
}

/**
 * Compte authentifié, ou refus 401. On recharge le compte depuis la base à
 * chaque appel (c'est ce que fait vrt_verify_token) : un droit retiré prend
 * effet tout de suite, sans attendre l'expiration du jeton.
 */
function plat_compte(array $db): array
{
    $tok = plat_bearer();
    if ($tok === '') jsonResponse(['ok' => false, 'error' => 'Authentification requise'], 401);
    $v = vrt_verify_token($tok, $db);
    if (!$v || empty($v['acc'])) jsonResponse(['ok' => false, 'error' => 'Session expirée'], 401);
    return $v;
}

/** Politique d'essai et de cadeaux, réglée par l'administration. */
function plat_offres(array $db): array
{
    $o = $db['plateforme']['offres'] ?? [];
    return [
        'joursEssai'       => max(0, (int) ($o['joursEssai']       ?? 7)),
        'cadeauBienvenue'  => max(0, (int) ($o['cadeauBienvenue']  ?? 0)),
        'bonusReabo'       => max(0, (int) ($o['bonusReabo']       ?? 0)),
        'quotaEssai'       => max(0, (int) ($o['quotaEssai']       ?? 10)),
        'message'          => (string) ($o['message'] ?? ''),
    ];
}

/** Identifiants des plans de l'Atelier (miroir de this.plans côté client). */
function plat_plans_atelier(): array
{
    return ['ens', 'etab', 'pro'];
}

/**
 * Plafonds par palier. -1 = sans limite.
 *
 * Le palier « demo » n'est pas un abonnement : c'est ce que voit un compte
 * sans droit, une fois l'essai terminé. Il garde volontairement un accès —
 * un catalogue entièrement muet ne donne envie de rien.
 */
function plat_paliers(array $db): array
{
    $def = [
        'demo' => ['textes' => 20,  'citations' => 10,  'exports' => 2,   'ia' => 3],
        'ens'  => ['textes' => -1,  'citations' => -1,  'exports' => 30,  'ia' => 30],
        'etab' => ['textes' => -1,  'citations' => -1,  'exports' => 120, 'ia' => 120],
        'pro'  => ['textes' => -1,  'citations' => -1,  'exports' => 400, 'ia' => 400],
    ];
    $sur = $db['plateforme']['paliers'] ?? [];
    if (!is_array($sur)) return $def;
    foreach ($def as $cle => $vals) {
        if (!isset($sur[$cle]) || !is_array($sur[$cle])) continue;
        foreach ($vals as $k => $v) {
            if (isset($sur[$cle][$k]) && is_numeric($sur[$cle][$k])) {
                $def[$cle][$k] = (int) $sur[$cle][$k];
            }
        }
    }
    return $def;
}

/** Palier effectif d'un compte : son plan actif, sinon « demo ». */
function plat_palier_de(array $droit): string
{
    if (($droit['motif'] ?? '') === 'abonnement') return (string) ($droit['plan'] ?? 'ens');
    // Pendant l'essai on ouvre le palier Enseignant : c'est l'essai qui doit
    // convaincre, pas une version amputée.
    if (in_array($droit['motif'] ?? '', ['essai', 'essai_ouverture'], true)) return 'ens';
    return 'demo';
}

/**
 * Numéros des textes offerts, étalés sur toute la base.
 *
 * Prendre les N premiers donnerait N textes du seul Module 1 : le visiteur en
 * conclurait que la base ne couvre que la 6e. Un pas régulier fait tomber
 * l'échantillon dans tous les cycles et tous les usages, et il est
 * DÉTERMINISTE — le même pour tout le monde, donc explicable et cachable.
 */
function plat_offerts(array $items, int $combien, string $champ = 'n'): array
{
    $total = count($items);
    if ($combien <= 0 || $total === 0) return [];
    if ($combien >= $total) {
        return array_map(static fn($t) => (int) ($t[$champ] ?? 0), $items);
    }
    $pas = $total / $combien;
    $out = [];
    for ($k = 0; $k < $combien; $k++) {
        $idx = (int) floor($k * $pas);
        if ($idx >= $total) $idx = $total - 1;
        $out[] = (int) ($items[$idx][$champ] ?? 0);
    }
    return array_values(array_unique($out));
}

/**
 * Droit d'accès au corpus. Renvoie toujours un tableau explicite : l'appelant
 * ne devine pas, il lit `ok` et `motif`.
 */
function plat_droit(array $acc, array $db, array $offres): array
{
    // 1. Abonnement actif ?
    $actifs = vrt_account_active_plans($acc, $db);
    foreach (plat_plans_atelier() as $p) {
        if (in_array($p, $actifs, true)) {
            return ['ok' => true, 'motif' => 'abonnement', 'plan' => $p, 'resteJours' => null];
        }
    }

    // 2. Période d'essai. Le point de départ est celui enregistré en base ;
    //    s'il n'existe pas encore, l'essai commence maintenant (l'appelant
    //    l'écrira). Compter depuis le navigateur laisserait relancer l'essai
    //    en vidant son stockage local.
    $debut = (int) ($acc['platEssaiDebut'] ?? 0);
    $jours = $offres['joursEssai'] + $offres['cadeauBienvenue'];
    if ($jours <= 0) {
        return ['ok' => false, 'motif' => 'sans_essai', 'resteJours' => 0];
    }
    if ($debut <= 0) {
        return ['ok' => true, 'motif' => 'essai_ouverture', 'resteJours' => $jours];
    }
    $ecoule = (int) floor((time() - $debut) / 86400);
    $reste  = $jours - $ecoule;
    if ($reste > 0) {
        return ['ok' => true, 'motif' => 'essai', 'resteJours' => $reste];
    }
    return ['ok' => false, 'motif' => 'essai_termine', 'resteJours' => 0];
}

/**
 * Lecture-modification-écriture de la base sous verrou exclusif, avec
 * sauvegarde horodatée. Le mutateur reçoit la base et la renvoie modifiée ;
 * s'il renvoie null, rien n'est écrit.
 */
function plat_muter(callable $mutateur, bool $obligatoire = true)
{
    global $DB_FILE, $DATA_DIR;
    $fp = fopen($DB_FILE, 'c+');
    if (!$fp) {
        if (!$obligatoire) return null;
        jsonResponse(['ok' => false, 'error' => 'Ouverture impossible'], 500);
    }

    /* VERROU BORNÉ, jamais bloquant.
       `flock($fp, LOCK_EX)` sans LOCK_NB attend INDÉFINIMENT que le verrou se
       libère, et sur Unix cette attente ne compte pas dans max_execution_time :
       PHP ne l'interrompt donc jamais. Or db.php écrit dans ce même fichier à
       chaque synchronisation admin. Constaté en production le 21/08/2026 :
       l'Atelier est resté cinq minutes sur « Chargement du répertoire… », sans
       message ni bouton, parce que la requête n'a simplement jamais rendu la
       main. On tente le verrou pendant deux secondes, puis on abandonne. */
    $obtenu = false;
    for ($essai = 0; $essai < 20; $essai++) {
        if (flock($fp, LOCK_EX | LOCK_NB)) { $obtenu = true; break; }
        usleep(100000); // 100 ms
    }
    if (!$obtenu) {
        fclose($fp);
        if (!$obligatoire) return null;
        jsonResponse(['ok' => false, 'error' => 'Base occupée — réessayez'], 503);
    }
    $brut = stream_get_contents($fp);
    $db   = json_decode((string) $brut, true);
    if (!is_array($db)) {
        flock($fp, LOCK_UN);
        fclose($fp);
        jsonResponse(['ok' => false, 'error' => 'Base illisible'], 503);
    }

    $sortie = $mutateur($db);
    if ($sortie === null) {
        flock($fp, LOCK_UN);
        fclose($fp);
        return null;
    }
    [$db, $resultat] = $sortie;

    // Sauvegarde avant écrasement, et purge des plus anciennes.
    $bkDir = $DATA_DIR . '/_backups';
    if (!is_dir($bkDir)) @mkdir($bkDir, 0750, true);
    @file_put_contents(
        $bkDir . '/veritas_db.' . date('Ymd_His') . '.' . bin2hex(random_bytes(3)) . '.plat.json',
        $brut
    );
    $bks = glob($bkDir . '/veritas_db.*.json');
    if ($bks && count($bks) > 40) {
        sort($bks);
        foreach (array_slice($bks, 0, count($bks) - 40) as $vieux) { @unlink($vieux); }
    }

    $encode = json_encode($db, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    if ($encode === false) {
        flock($fp, LOCK_UN);
        fclose($fp);
        jsonResponse(['ok' => false, 'error' => 'Encodage impossible'], 500);
    }
    ftruncate($fp, 0);
    rewind($fp);
    fwrite($fp, $encode);
    fflush($fp);
    flock($fp, LOCK_UN);
    fclose($fp);
    return $resultat;
}

/** Écrit une valeur sur le compte, quelle que soit la collection qui le porte. */
function plat_ecrire_compte(array &$db, string $accId, array $champs): void
{
    foreach (['visitorAccounts', 'studentAccounts'] as $coll) {
        if (!isset($db[$coll]) || !is_array($db[$coll])) continue;
        foreach ($db[$coll] as $i => $a) {
            if (!is_array($a) || (string) ($a['id'] ?? '') !== $accId) continue;
            foreach ($champs as $k => $v) { $db[$coll][$i][$k] = $v; }
            return;
        }
    }
}

/* ─────────────────────────────────────────────────────────────────────────
   Limitation de débit — avant toute lecture de base
   ───────────────────────────────────────────────────────────────────────── */

$rateDir = $DATA_DIR . '/_rate';
if (!is_dir($rateDir)) @mkdir($rateDir, 0750, true);
/* Le corpus se sert par pages : un plafond trop bas arrêterait un enseignant
   au milieu de sa recherche. 120/min laisse la place au parcours normal tout
   en fermant l'aspiration automatisée. */
if (vrt_rate_exceeded('plat', 120)) {
    jsonResponse(['ok' => false, 'error' => 'Trop de requêtes — patientez une minute'], 429);
}

/* ─────────────────────────────────────────────────────────────────────────
   1. SONDE PUBLIQUE — dit ce que le serveur sait faire, sans rien livrer
   ───────────────────────────────────────────────────────────────────────── */

if ($action === 'config') {
    $db     = vrt_load_db();
    $offres = is_array($db) ? plat_offres($db) : plat_offres([]);

    /* Les DEUX répertoires sont rapportés, pas seulement le corpus.
       Ils se déposent à la main par FTP (ils sont hors dépôt : c'est la
       marchandise et le dépôt est public), donc l'un peut arriver sans
       l'autre. Tant que cette sonde ne parlait que du corpus, un
       citations_minesec.json oublié restait invisible jusqu'à ce qu'un
       abonné ouvre la section des citations et reçoive un 503 — le seul
       endroit prévu pour vérifier un déploiement ne rendait pas compte de
       la moitié de ce qu'il fallait vérifier.
       On lit la taille, pas le contenu : décoder 2,8 Mo à chaque sonde
       coûterait cher pour ne rien dire de plus. */
    $etat = static function (string $f): array {
        $ok = is_file($f);
        return ['disponible' => $ok, 'octets' => $ok ? (int) filesize($f) : 0];
    };
    jsonResponse([
        'ok'         => true,
        'service'    => 'plateforme',
        'version'    => '1.0.1',
        'corpus'     => $etat($CORPUS_FILE),
        'citations'  => $etat($CITATIONS_FILE),
        'essai'      => ['jours' => $offres['joursEssai'], 'cadeau' => $offres['cadeauBienvenue']],
        'baseLisible' => is_array($db),
    ]);
}

/* ─────────────────────────────────────────────────────────────────────────
   2. SESSION — identifiants contre la base, jeton en retour
   ───────────────────────────────────────────────────────────────────────── */

if ($action === 'session' && $method === 'POST') {
    if (vrt_rate_exceeded('plat_login', 10)) {
        jsonResponse(['ok' => false, 'error' => 'Trop de tentatives — patientez'], 429);
    }
    $in    = plat_input(4096);
    $login = trim((string) ($in['login'] ?? ''));
    $mdp   = (string) ($in['motDePasse'] ?? $in['password'] ?? '');
    if ($login === '' || $mdp === '') {
        jsonResponse(['ok' => false, 'error' => 'Identifiant et mot de passe requis'], 400);
    }
    $db = vrt_load_db();
    if (!is_array($db)) jsonResponse(['ok' => false, 'error' => 'Base indisponible'], 503);

    $trouve = vrt_find_account($db, $login);
    // Message identique dans les deux cas : ne pas révéler quels comptes existent.
    if (!$trouve) jsonResponse(['ok' => false, 'error' => 'Identifiants invalides'], 401);

    $acc      = $trouve['acc'];
    $besoinMaj = false;
    $ok = vrt_verify_password($mdp, (string) ($acc['pwd'] ?? ''), (string) ($acc['user'] ?? ''), $besoinMaj);
    if (!$ok) jsonResponse(['ok' => false, 'error' => 'Identifiants invalides'], 401);

    $offres = plat_offres($db);
    $droit  = plat_droit($acc, $db, $offres);

    jsonResponse([
        'ok'      => true,
        'token'   => vrt_issue_token($acc, (string) $trouve['type']),
        'compte'  => [
            'id'   => (string) ($acc['id'] ?? ''),
            'nom'  => (string) ($acc['nom'] ?? $acc['user'] ?? ''),
            'type' => (string) $trouve['type'],
        ],
        'droit'   => $droit,
    ]);
}

/* ─────────────────────────────────────────────────────────────────────────
   3. CORPUS — sous condition de droit
   ───────────────────────────────────────────────────────────────────────── */

if (($action === 'corpus' || $action === 'citations') && $method === 'GET') {
    $db = vrt_load_db();
    if (!is_array($db)) jsonResponse(['ok' => false, 'error' => 'Base indisponible'], 503);
    $v      = plat_compte($db);
    $acc    = $v['acc'];
    $offres = plat_offres($db);
    $droit  = plat_droit($acc, $db, $offres);
    $palier = plat_palier_de($droit);
    $caps   = plat_paliers($db)[$palier] ?? plat_paliers($db)['demo'];

    /* Premier accès : on horodate l'ouverture de l'essai, côté serveur.
       AU MIEUX, jamais au prix de la lecture. Cette écriture n'est qu'un
       tampon de date ; si la base est occupée par une synchronisation, on
       sert quand même le répertoire et le tampon se posera à la requête
       suivante. Faire dépendre l'affichage du corpus de l'obtention d'un
       verrou d'écriture, c'était accepter que l'enseignant attende que
       l'administration ait fini de synchroniser — ou pour toujours. */
    if (($droit['motif'] ?? '') === 'essai_ouverture') {
        $accId = (string) ($acc['id'] ?? '');
        plat_muter(function (array $db2) use ($accId) {
            plat_ecrire_compte($db2, $accId, ['platEssaiDebut' => time()]);
            return [$db2, true];
        }, false);
    }

    $estCitation = ($action === 'citations');
    $fichier = $estCitation ? $GLOBALS['CITATIONS_FILE'] : $GLOBALS['CORPUS_FILE'];
    if (!is_file($fichier)) {
        jsonResponse(['ok' => false, 'error' => 'Répertoire absent du serveur'], 503);
    }
    $items = json_decode((string) file_get_contents($fichier), true);
    if (!is_array($items)) jsonResponse(['ok' => false, 'error' => 'Répertoire illisible'], 503);

    $plafond = (int) ($estCitation ? $caps['citations'] : $caps['textes']);
    $offerts = $plafond < 0 ? null : plat_offerts($items, $plafond);
    $estLibre = static function (int $num) use ($offerts): bool {
        return $offerts === null || in_array($num, $offerts, true);
    };

    $mode = (string) ($_GET['mode'] ?? 'index');

    /* ---- Contenu intégral : c'est ICI que le droit se vérifie ---- */
    if ($mode === 'complet') {
        $num = (int) ($_GET['n'] ?? 0);
        foreach ($items as $t) {
            if ((int) ($t['n'] ?? 0) !== $num) continue;
            if (!$estLibre($num)) {
                jsonResponse([
                    'ok'       => false,
                    'error'    => 'Abonnement requis',
                    'motif'    => $droit['motif'] ?? 'palier',
                    'palier'   => $palier,
                    'message'  => $offres['message'] !== '' ? $offres['message']
                        : ($estCitation
                            ? 'Cette citation fait partie du répertoire complet. Abonnez-vous pour lire les 137 citations et leurs sources vérifiées.'
                            : 'Ce texte fait partie du répertoire complet. Abonnez-vous pour ouvrir les 1040 textes, leurs questions et leurs faits de langue.'),
                ], 402);
            }
            jsonResponse(['ok' => true, ($estCitation ? 'citation' : 'texte') => $t,
                          'droit' => $droit, 'palier' => $palier]);
        }
        jsonResponse(['ok' => false, 'error' => 'Introuvable'], 404);
    }

    /* ---- Index : ouvert à tout compte ----
       L'auteur et les premières lignes restent visibles, et l'entrée remonte
       dans les recherches. C'est délibéré : un catalogue muet ne donne envie
       de rien, tandis qu'un extrait qu'on ne peut pas finir donne envie de
       s'abonner. Le champ `libre` dit à l'interface où poser le cadenas. */
    $index = [];
    foreach ($items as $t) {
        $num = (int) ($t['n'] ?? 0);
        $ouvert = $estLibre($num);
        if ($estCitation) {
            $entier = (string) ($t['texte'] ?? '');
            $index[] = [
                'n' => $num, 'auteur' => (string) ($t['auteur'] ?? ''),
                'theme' => (string) ($t['theme'] ?? ''),
                'statut' => (string) ($t['statut'] ?? ''),
                'mention' => (string) ($t['mention'] ?? ''),
                'libre' => $ouvert,
                'texte' => $ouvert ? $entier : mb_substr($entier, 0, 70),
                'note'  => $ouvert ? (string) ($t['note'] ?? '') : '',
            ];
            continue;
        }
        $index[] = [
            'n' => $num,
            'type'      => (string) ($t['type'] ?? ''),
            'words'     => (int) ($t['words'] ?? 0),
            'level'     => (string) ($t['level'] ?? ''),
            'cycle'     => (string) ($t['cycle'] ?? ''),
            'group'     => (string) ($t['group'] ?? ''),
            'groupKind' => (string) ($t['groupKind'] ?? ''),
            'subkind'   => (string) ($t['subkind'] ?? ''),
            'usage'     => (string) ($t['usage'] ?? ''),
            'author'    => (string) ($t['author'] ?? ''),
            'title'     => (string) ($t['title'] ?? ''),
            'reference' => (string) ($t['reference'] ?? ''),
            'faits'     => $ouvert ? (string) ($t['faits'] ?? '') : '',
            'libre'     => $ouvert,
            // Les premières lignes, pour reconnaître le texte et le retrouver
            // dans une recherche. Jamais de quoi composer une épreuve avec.
            'extrait'   => mb_substr((string) ($t['text'] ?? ''), 0, 180),
        ];
    }

    jsonResponse([
        'ok'      => true,
        'total'   => count($index),
        'libres'  => $offerts === null ? count($index) : count($offerts),
        'palier'  => $palier,
        'plafonds' => $caps,
        ($estCitation ? 'citations' : 'textes') => $index,
        'droit'   => $droit,
    ]);
}

/* ─────────────────────────────────────────────────────────────────────────
   4. ÉTAT DU GROUPE — épreuves, cours et annotations partagés
   ───────────────────────────────────────────────────────────────────────── */

if ($action === 'etat') {
    $db = vrt_load_db();
    if (!is_array($db)) jsonResponse(['ok' => false, 'error' => 'Base indisponible'], 503);
    $v     = plat_compte($db);
    $acc   = $v['acc'];
    $accId = (string) ($acc['id'] ?? '');
    $gid   = preg_replace('/[^A-Za-z0-9_-]/', '', (string) ($_GET['groupe'] ?? ''));
    if ($gid === '') jsonResponse(['ok' => false, 'error' => 'Groupe non précisé'], 400);

    $groupes = $db['plateforme']['groupes'] ?? [];
    $groupe  = null;
    foreach ($groupes as $g) {
        if ((string) ($g['id'] ?? '') === $gid) { $groupe = $g; break; }
    }
    // Un groupe inconnu n'est pas une erreur à la première écriture : il naît ici.
    $membre = $groupe ? in_array($accId, (array) ($groupe['membres'] ?? []), true) : true;
    $ouvert = $groupe ? (($groupe['type'] ?? 'ferme') === 'ouvert') : false;

    if ($method === 'GET') {
        if (!$membre && !$ouvert) {
            jsonResponse(['ok' => false, 'error' => 'Ce groupe est fermé'], 403);
        }
        jsonResponse([
            'ok'    => true,
            'etat'  => $db['plateforme']['etats'][$gid] ?? null,
            'groupe'=> $groupe,
        ]);
    }

    if ($method === 'PUT' || $method === 'POST') {
        if (!$membre) jsonResponse(['ok' => false, 'error' => 'Vous n’êtes pas membre de ce groupe'], 403);
        $in = plat_input();
        if (!isset($in['etat']) || !is_array($in['etat'])) {
            jsonResponse(['ok' => false, 'error' => 'État manquant'], 400);
        }
        $res = plat_muter(function (array $db2) use ($gid, $in, $accId) {
            if (!isset($db2['plateforme']) || !is_array($db2['plateforme'])) $db2['plateforme'] = [];
            if (!isset($db2['plateforme']['etats']) || !is_array($db2['plateforme']['etats'])) {
                $db2['plateforme']['etats'] = [];
            }
            $db2['plateforme']['etats'][$gid] = [
                'contenu'  => $in['etat'],
                'majPar'   => $accId,
                'majLe'    => time(),
                'revision' => (int) ($db2['plateforme']['etats'][$gid]['revision'] ?? 0) + 1,
            ];
            if (isset($in['groupe']) && is_array($in['groupe'])) {
                if (!isset($db2['plateforme']['groupes']) || !is_array($db2['plateforme']['groupes'])) {
                    $db2['plateforme']['groupes'] = [];
                }
                $vu = false;
                foreach ($db2['plateforme']['groupes'] as $i => $g) {
                    if ((string) ($g['id'] ?? '') === $gid) {
                        $db2['plateforme']['groupes'][$i] = $in['groupe'];
                        $vu = true;
                        break;
                    }
                }
                if (!$vu) $db2['plateforme']['groupes'][] = $in['groupe'];
            }
            return [$db2, ['revision' => $db2['plateforme']['etats'][$gid]['revision']]];
        });
        jsonResponse(['ok' => true] + (is_array($res) ? $res : []));
    }

    jsonResponse(['ok' => false, 'error' => 'Méthode non permise'], 405);
}

/* ─────────────────────────────────────────────────────────────────────────
   5. QUOTA — incrément atomique, remis à zéro chaque mois
   ───────────────────────────────────────────────────────────────────────── */

if ($action === 'quota' && $method === 'POST') {
    $db = vrt_load_db();
    if (!is_array($db)) jsonResponse(['ok' => false, 'error' => 'Base indisponible'], 503);
    $v      = plat_compte($db);
    $acc    = $v['acc'];
    $accId  = (string) ($acc['id'] ?? '');
    $offres = plat_offres($db);
    $droit  = plat_droit($acc, $db, $offres);

    $in    = plat_input(2048);
    $genre = (string) ($in['genre'] ?? 'epreuve');   // epreuve | ia | export
    if (!in_array($genre, ['epreuve', 'ia', 'export'], true)) {
        jsonResponse(['ok' => false, 'error' => 'Genre de quota inconnu'], 400);
    }

    /* Le plafond dépend du droit : en essai on applique celui de l'essai, sinon
       celui du plan. Un plafond nul signifie « illimité » seulement quand il
       vaut -1 ; à 0 on refuse, sinon une erreur de saisie ouvrirait tout. */
    /* Le plafond vient de la table des paliers : c'est la MEME table que
       celle qui borne le corpus, donc un seul endroit a regler. */
    $palier = plat_palier_de($droit);
    $caps   = plat_paliers($db)[$palier] ?? plat_paliers($db)['demo'];
    /* Le genre demandé et la clé de la table ne portent pas le même nom
       (« export » contre « exports ») : sans cette table de correspondance,
       le ?? -1 rendait le quota ILLIMITÉ au lieu de 2, en silence. On refuse
       donc explicitement un genre dont on ne connaît pas la clé. */
    $CLE = ['ia' => 'ia', 'export' => 'exports'];
    if ($genre === 'epreuve') {
        $plafond = ($palier === 'demo') ? (int) $offres['quotaEssai'] : -1;
    } elseif (isset($CLE[$genre]) && array_key_exists($CLE[$genre], $caps)) {
        $plafond = (int) $caps[$CLE[$genre]];
    } else {
        jsonResponse(['ok' => false, 'error' => 'Plafond inconnu pour ce genre'], 400);
    }

    $mois = date('Y-m');
    $res  = plat_muter(function (array $db2) use ($accId, $genre, $mois, $plafond) {
        if (!isset($db2['plateforme']) || !is_array($db2['plateforme'])) $db2['plateforme'] = [];
        if (!isset($db2['plateforme']['quotas']) || !is_array($db2['plateforme']['quotas'])) {
            $db2['plateforme']['quotas'] = [];
        }
        $cle = $accId . '|' . $genre;
        $q   = $db2['plateforme']['quotas'][$cle] ?? null;
        if (!is_array($q) || (string) ($q['mois'] ?? '') !== $mois) {
            $q = ['mois' => $mois, 'utilise' => 0];
        }
        if ($plafond >= 0 && (int) $q['utilise'] >= $plafond) {
            // Rien n'est écrit : le refus ne doit pas consommer.
            return [$db2, ['accorde' => false, 'utilise' => (int) $q['utilise'], 'plafond' => $plafond]];
        }
        $q['utilise'] = (int) $q['utilise'] + 1;
        $db2['plateforme']['quotas'][$cle] = $q;
        return [$db2, ['accorde' => true, 'utilise' => (int) $q['utilise'], 'plafond' => $plafond]];
    });

    if (!is_array($res)) jsonResponse(['ok' => false, 'error' => 'Écriture impossible'], 500);
    if (!$res['accorde']) {
        jsonResponse(['ok' => false, 'error' => 'Quota épuisé'] + $res, 402);
    }
    jsonResponse(['ok' => true] + $res);
}

/* ─────────────────────────────────────────────────────────────────────────
   6. OFFRES — lecture publique, écriture réservée à l'administration
   ───────────────────────────────────────────────────────────────────────── */

if ($action === 'offres') {
    $db = vrt_load_db();
    if (!is_array($db)) jsonResponse(['ok' => false, 'error' => 'Base indisponible'], 503);

    if ($method === 'GET') {
        jsonResponse(['ok' => true, 'offres' => plat_offres($db)]);
    }

    if ($method === 'POST' || $method === 'PUT') {
        // Écriture réservée : c'est la clé d'administration qui tranche, pas un
        // rôle déclaré par le navigateur.
        requireAuth();
        $in  = plat_input(8192);
        $res = plat_muter(function (array $db2) use ($in) {
            if (!isset($db2['plateforme']) || !is_array($db2['plateforme'])) $db2['plateforme'] = [];
            $ancien = $db2['plateforme']['offres'] ?? [];
            $db2['plateforme']['offres'] = [
                'joursEssai'      => max(0, min(365, (int) ($in['joursEssai']      ?? $ancien['joursEssai']      ?? 7))),
                'cadeauBienvenue' => max(0, min(365, (int) ($in['cadeauBienvenue'] ?? $ancien['cadeauBienvenue'] ?? 0))),
                'bonusReabo'      => max(0, min(365, (int) ($in['bonusReabo']      ?? $ancien['bonusReabo']      ?? 0))),
                'quotaEssai'      => max(0, min(9999, (int) ($in['quotaEssai']     ?? $ancien['quotaEssai']      ?? 10))),
                'message'         => mb_substr((string) ($in['message'] ?? $ancien['message'] ?? ''), 0, 400),
            ];
            return [$db2, $db2['plateforme']['offres']];
        });
        jsonResponse(['ok' => true, 'offres' => $res]);
    }

    jsonResponse(['ok' => false, 'error' => 'Méthode non permise'], 405);
}

/* ───────────────────────────────────────────────────────────────────────── */

jsonResponse(['ok' => false, 'error' => 'Action inconnue'], 404);
