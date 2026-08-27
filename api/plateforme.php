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
/* Second répertoire : domaine public strict (auteur mort avant 1956, écrit
   en français, aucune traduction). Rien à fermer — il n'y a personne à qui
   payer une redevance. Servi en entier à tout compte. */
$LIBRE_FILE = $DATA_DIR . '/corpus_libre.json';
/* Les deux répertoires numérotent à partir de 1 : servis ensemble, leurs
   numéros entreraient en collision. `n` est la clé du client partout — une
   collision mélangerait les textes d'une épreuve. Un numéro >= 10000 est
   une fiche libre, sans ambiguïté possible. */
define('VRT_LIBRE_OFFSET', 10000);
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

/**
 * DATE D'OUVERTURE DE L'ESSAI — dans un fichier à part, pas dans la base.
 *
 * Elle vivait sur le compte, dans data/veritas_db.json. Deux ennuis, dont un
 * qui fait perdre des données :
 *
 *  1. Le navigateur de l'administration pousse la base ENTIÈRE en PUT sur
 *     db.php. Une console ouverte avant que l'essai d'un enseignant ne
 *     s'ouvre renvoie donc une copie qui ignore `platEssaiDebut`, et l'écrase.
 *     L'essai repartirait à zéro à chaque synchronisation admin — un abonné
 *     obtiendrait un essai perpétuel sans jamais payer.
 *  2. Écrire un seul entier coûtait une relecture, une sauvegarde horodatée
 *     et une réécriture de toute la base, sous verrou exclusif, sur le chemin
 *     de LECTURE du répertoire.
 *
 * Ce fichier-ci ne contient que des identifiants de compte et des horodatages.
 * Il est minuscule, il n'entre en concurrence avec personne, et la synchro de
 * l'administration ne le voit pas.
 */
function plat_essais_fichier(): string
{
    global $DATA_DIR;
    return $DATA_DIR . '/_plat_essais.json';
}

function plat_essais_lire(): array
{
    $f = plat_essais_fichier();
    if (!is_file($f)) return [];
    $j = json_decode((string) @file_get_contents($f), true);
    return is_array($j) ? $j : [];
}

/**
 * Renvoie la date d'ouverture, en posant celle d'aujourd'hui au premier appel.
 * Best-effort : si l'écriture échoue, on renvoie quand même une date pour que
 * l'essai commence — mieux vaut un essai qui s'ouvre qu'un accès refusé sur un
 * incident d'écriture.
 */
function plat_essai_ouvrir(string $accId, int $herite = 0): int
{
    if ($accId === '') return $herite > 0 ? $herite : time();

    $f  = plat_essais_fichier();
    $fp = @fopen($f, 'c+');
    if (!$fp) return $herite > 0 ? $herite : time();

    $obtenu = false;
    for ($i = 0; $i < 10; $i++) {           // 1 s au plus : ce fichier n'est pas disputé
        if (flock($fp, LOCK_EX | LOCK_NB)) { $obtenu = true; break; }
        usleep(100000);
    }
    if (!$obtenu) { fclose($fp); return $herite > 0 ? $herite : time(); }

    $tout = json_decode((string) stream_get_contents($fp), true);
    if (!is_array($tout)) $tout = [];

    // La valeur héritée de la base gagne : un essai déjà entamé ne doit pas
    // recommencer parce qu'on a changé de rangement.
    $deja = (int) ($tout[$accId] ?? 0);
    $debut = $herite > 0 ? $herite : ($deja > 0 ? $deja : time());

    if ($deja !== $debut) {
        $tout[$accId] = $debut;
        // Purge des entrées d'il y a plus de deux ans : le fichier ne doit pas
        // enfler indéfiniment, et un essai de 2024 ne sert plus à rien.
        $limite = time() - 730 * 86400;
        foreach ($tout as $k => $v) { if ((int) $v < $limite) unset($tout[$k]); }
        $enc = json_encode($tout, JSON_UNESCAPED_UNICODE);
        if ($enc !== false) { ftruncate($fp, 0); rewind($fp); fwrite($fp, $enc); fflush($fp); }
    }
    flock($fp, LOCK_UN);
    fclose($fp);
    return $debut;
}

/**
 * Tarif public de chaque plan de l'Atelier.
 *
 * ⚠️ On ne recopie PAS la table des prix ici. Le prix qui fait foi est celui
 * que `vrt_prix_catalogue()` oppose au paiement ; un miroir de plus, c'est un
 * miroir qui finira par diverger, et l'écart entre le prix AFFICHÉ et le prix
 * EXIGÉ se paie en abonnements refusés au guichet sans que personne comprenne.
 * On interroge donc la seule autorité, avec le repli codé en dur pour le seul
 * cas où la fonction ne serait pas chargée.
 */
function plat_tarifs(array $db): array
{
    $repli = ['ens_mois' => 800, 'ens' => 5000, 'etab' => 30000, 'pro' => 70000];
    $out   = [];
    foreach (plat_plans_atelier() as $id) {
        $v = null;
        if (function_exists('vrt_prix_catalogue')) {
            $v = vrt_prix_catalogue($db, 'subscription', $id);
        }
        $out[$id] = ($v !== null && (int) $v > 0) ? (int) $v : $repli[$id];
    }
    return $out;
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
    /* `ens_mois` : le plan Enseignant paye au MOIS. Même service, même
       quota mensuel — seul le mode de paiement change.
       ⚠️ Un plan ne vit qu'inscrit AUX QUATRE ENDROITS : ici,
       plat_paliers(), vrt_prix_catalogue() et le miroir de durée de
       vrt_grant_entitlement(). En oublier un ne lève aucune erreur : le
       plan se vend et n'ouvre rien, ou s'ouvre et ne se facture pas. */
    return ['ens_mois', 'ens', 'etab', 'pro'];
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
        /* MISE EN BOUCHE. Le domaine public (1 014 textes) est ouvert à tout
           le monde et ne passe pas par ces plafonds : ils ne comptent que le
           répertoire MINESEC, sous droits. On en laisse goûter cinq, un seul
           export et deux questions à Ambassa — de quoi juger sur pièce, pas
           de quoi se passer d'un abonnement. */
        // `epreuves` de « demo » n'est PAS lu : ce palier garde son réglage
        // historique, DB.plateforme.offres.quotaEssai (10 par défaut), que
        // l'administration connaît déjà. La clé est là pour que la table reste
        // de même forme partout.
        'demo' => ['textes' => 5,   'citations' => 3,   'exports' => 1,   'ia' => 2,   'epreuves' => 10],

        /* ESSAI — JUGER SUR PIÈCE, PAS SE SERVIR.
           L'essai empruntait le palier « ens » : textes illimités et
           **30 exports**. Or 30 épreuves en .docx, c'est une année scolaire
           entière de travail — un enseignant pouvait faire sa rentrée en sept
           jours gratuits et ne jamais revenir. Le produit se vend précisément
           sur ces exports ; les offrir par trentaines, c'est l'offrir tout court.

           On garde la LECTURE large — c'est elle qui donne envie, et un
           répertoire qu'on ne peut pas parcourir ne convainc personne — mais on
           borne ce qui SORT de l'outil : quelques exports, de quoi juger la
           qualité d'une épreuve rendue, pas de quoi équiper un trimestre.
           Réglable en base (DB.plateforme.paliers.essai) sans redéploiement. */
        /* ⚠️ `textes` valait -1 : l'essai ouvrait les 1 040 textes SOUS DROITS.
           Sept jours suffisaient alors à tout parcourir, et il n'y avait qu'à
           recréer un compte la semaine suivante pour ne jamais payer. L'essai
           doit convaincre, pas équiper.
           Les 1 014 textes du DOMAINE PUBLIC ne passent pas par ce plafond :
           ils restent entiers, pour tout le monde et pour toujours. C'est eux
           qui donnent de quoi travailler tout de suite ; l'échantillon
           protégé, lui, montre ce qu'on achète.
           Réglable en base : DB.plateforme.paliers.essai.textes. */
        'essai' => ['textes' => 20,  'citations' => 8,   'exports' => 3,   'ia' => 10,  'epreuves' => 12],

        /* `epreuves` valait -1 (illimite) sur les trois paliers payants, alors
           que les cartes annoncent « 30 / 120 / 400 epreuves par mois ». Un
           plafond qu on affiche et qu on n applique pas n est pas un plafond :
           un mois paye ouvrait un nombre d epreuves sans borne. Les valeurs
           sont desormais celles des cartes, et restent reglables en base. */
        /* Mensuel : rigoureusement les mêmes plafonds que l'annuel. Les
           brider davantage ferait payer plus cher au mois pour moins de
           service — l'inverse de ce qu'on cherche, qui est d'ouvrir la
           porte à qui ne peut pas sortir 5 000 F d'un coup. */
        'ens_mois' => ['textes' => -1,  'citations' => -1,  'exports' => 30,  'ia' => 30,  'epreuves' => 30],
        'ens'  => ['textes' => -1,  'citations' => -1,  'exports' => 30,  'ia' => 30,  'epreuves' => 30],
        'etab' => ['textes' => -1,  'citations' => -1,  'exports' => 120, 'ia' => 120, 'epreuves' => 120],
        'pro'  => ['textes' => -1,  'citations' => -1,  'exports' => 400, 'ia' => 400, 'epreuves' => 400],
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
    /* L'essai a désormais SON palier. Il renvoyait « ens » — le plan payant —
       donc l'essai gratuit et l'abonnement à 5 000 F ouvraient exactement les
       mêmes droits, exports compris. Il n'y avait littéralement rien à acheter
       pendant sept jours. La lecture reste large ; seuls les exports et l'IA
       sont bornés (voir plat_paliers). */
    if (in_array($droit['motif'] ?? '', ['essai', 'essai_ouverture'], true)) return 'essai';
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

    // 2. Période d'essai. Le point de départ est horodaté CÔTÉ SERVEUR :
    //    compter depuis le navigateur laisserait relancer l'essai en vidant
    //    son stockage local. On lit le registre dédié, et à défaut la valeur
    //    héritée qui vivait sur le compte (essais déjà entamés avant le
    //    changement de rangement — ils ne doivent pas repartir à zéro).
    $accId   = (string) ($acc['id'] ?? '');
    $registre = plat_essais_lire();
    $debut = (int) ($registre[$accId] ?? 0);
    if ($debut <= 0) $debut = (int) ($acc['platEssaiDebut'] ?? 0);
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
        /* Il se dépose à la main, comme les deux autres : un fichier oublié
           doit se voir ici et non au 503 reçu par un abonné. */
        'libre'      => $etat($LIBRE_FILE),
        'essai'      => ['jours' => $offres['joursEssai'], 'cadeau' => $offres['cadeauBienvenue']],
        /* LE PARAMÉTRAGE RÉELLEMENT APPLIQUÉ, rendu en clair.
           Les cartes d'abonnement de l'Atelier portaient leurs prix et leurs
           quotas ÉCRITS EN DUR dans la page. L'administration pouvait donc
           baisser un plafond ou relever un tarif sans que la carte change :
           l'enseignant lisait « 30 exports » et s'en voyait refuser le
           sixième, ou payait le montant affiché et se faisait rejeter parce
           que le prix de référence avait bougé. Ce qu'on applique et ce qu'on
           annonce partent maintenant du même endroit.
           Ces valeurs sont publiques par nature : c'est le tarif affiché et
           le service promis. */
        'tarifs'     => plat_tarifs($db),
        'paliers'    => is_array($db) ? plat_paliers($db) : plat_paliers([]),
        'places'     => is_array($db) ? plat_places_palier($db) : plat_places_palier([]),
        'offres'     => $offres,
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
       Dans le registre DÉDIÉ — un fichier de quelques centaines d'octets —
       et non plus par une réécriture de toute la base sous verrou exclusif
       sur le chemin de lecture du répertoire. Voir plat_essai_ouvrir(). */
    if (($droit['motif'] ?? '') === 'essai_ouverture') {
        plat_essai_ouvrir((string) ($acc['id'] ?? ''), (int) ($acc['platEssaiDebut'] ?? 0));
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
        /* FICHE LIBRE DE DROITS. Servie en entier, sans condition : les
           droits patrimoniaux sont éteints, il n'y a personne à qui payer.
           Le mur d'abonnement ne s'applique qu'au répertoire MINESEC, dont
           les auteurs sont vivants ou récents. */
        if (!$estCitation && $num >= VRT_LIBRE_OFFSET) {
            if (!is_file($GLOBALS['LIBRE_FILE'])) {
                jsonResponse(['ok' => false, 'error' => 'Répertoire libre absent du serveur'], 503);
            }
            $libres = json_decode((string) file_get_contents($GLOBALS['LIBRE_FILE']), true);
            if (!is_array($libres)) jsonResponse(['ok' => false, 'error' => 'Répertoire libre illisible'], 503);
            $cible = $num - VRT_LIBRE_OFFSET;
            foreach ($libres as $t) {
                if ((int) ($t['n'] ?? 0) !== $cible) continue;
                $t['n'] = $num;              // le client ne connaît que le numéro décalé
                $t['src'] = 'libre';
                $t['libre'] = true;
                jsonResponse(['ok' => true, 'texte' => $t, 'droit' => $droit, 'palier' => $palier]);
            }
            jsonResponse(['ok' => false, 'error' => 'Introuvable'], 404);
        }
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
            'src'       => 'minesec',
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

    /* ---- Le répertoire LIBRE DE DROITS, ajouté au même index ----
       Domaine public strict : servi EN ENTIER à tout compte, essai compris.
       On l'ajoute ici plutôt que sur un second appel — LWS bannit l'IP à six
       mauvaises requêtes par minute, et une file d'envoi trop bavarde a déjà
       fermé le site entier. Deux répertoires, un transfert.
       `extrait` porte le texte COMPLET : rien à cacher, et cela évite au
       client d'aller le rechercher fiche par fiche. */
    $nLibres = 0;
    if (!$estCitation && is_file($GLOBALS['LIBRE_FILE'])) {
        $libres = json_decode((string) file_get_contents($GLOBALS['LIBRE_FILE']), true);
        if (is_array($libres)) {
            foreach ($libres as $t) {
                $index[] = [
                    'n'         => VRT_LIBRE_OFFSET + (int) ($t['n'] ?? 0),
                    'src'       => 'libre',
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
                    'faits'     => (string) ($t['faits'] ?? ''),
                    'libre'     => true,
                    'extrait'   => (string) ($t['text'] ?? ''),
                ];
                $nLibres++;
            }
        }
    }

    jsonResponse([
        'ok'      => true,
        'total'   => count($index),
        /* Deux comptes distincts : ce qui est ouvert PAR L'ABONNEMENT
           (échantillon du répertoire protégé) et ce qui l'est PAR LE DROIT
           (le domaine public). Les confondre ferait croire à l'abonné qu'il
           a débloqué 1 014 textes qui n'ont jamais été fermés. */
        'libres'  => ($offerts === null ? count($index) - $nLibres : count($offerts)) + $nLibres,
        'libresDroit' => $nLibres,
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
    $accId = (string) ($v['acc']['id'] ?? '');
    $gid   = plat_gid((string) ($_GET['groupe'] ?? ''));
    if ($gid === '') jsonResponse(['ok' => false, 'error' => 'Groupe non précisé'], 400);

    $groupe = plat_groupe_par_id($db, $gid);

    /* ⚠️ UNE ÉQUIPE NE NAÎT PLUS ICI — mesure du 26/08/2026.
       Elle naissait à la première écriture, avec la liste de membres que le
       NAVIGATEUR envoyait. Or cette liste était celle des profils de
       démonstration (u1…u6) : l'identifiant du compte réel n'y figurait
       jamais. Séquence observée sur banc, deux comptes distincts :

           POST  ?action=etat&groupe=g1   → 200  {"revision":1}   (l'équipe naît)
           POST  ?action=etat&groupe=g1   → 403  « Vous n'êtes pas membre »
           GET   ?action=etat&groupe=g1   → 403  « Ce groupe est fermé »

       Un envoi passait, puis plus jamais rien — pour l'auteur du groupe
       lui-même. Le navigateur affichait une pastille « refus » et le travail
       restait dans un seul poste, ce que la synchro était censée corriger.

       La création passe désormais par ?action=groupe&op=creer, qui inscrit le
       créateur comme membre et propriétaire. */
    if (!$groupe) {
        jsonResponse(['ok' => false, 'error' => 'Équipe inconnue.',
                      'code' => 'groupe_inconnu'], 404);
    }

    $membre = plat_est_membre($groupe, $accId);
    $ouvert = ((string) ($groupe['type'] ?? 'ferme')) === 'ouvert';

    if ($method === 'GET') {
        if (!$membre && !$ouvert) {
            jsonResponse(['ok' => false, 'error' => 'Cette équipe est fermée.',
                          'code' => 'non_membre'], 403);
        }
        /* Le groupe est rendu ENRICHI, exactement comme par op=lister.
           `plat_groupe_public` seul rendait `places` = 1 (la valeur n'est pas
           stockee sur le groupe, elle se deduit du plan du proprietaire) : le
           navigateur remplacant son groupe par celui-ci a chaque relecture,
           une equipe College de quinze places se serait affichee « 4 membres
           sur 1 place » quatre-vingt-dix secondes apres son ouverture. */
        $pub = plat_groupe_public($groupe);
        $pub['places'] = plat_places_de($db, (string) ($groupe['proprietaire'] ?? ''));
        jsonResponse([
            'ok'       => true,
            'etat'     => $db['plateforme']['etats'][$gid] ?? null,
            'groupe'   => $pub,
            'annuaire' => plat_annuaire($db, $groupe),
        ]);
    }

    if ($method === 'PUT' || $method === 'POST') {
        if (!$membre) {
            jsonResponse(['ok' => false, 'error' => 'Vous n’êtes pas membre de cette équipe.',
                          'code' => 'non_membre'], 403);
        }
        $in = plat_input();
        if (!isset($in['etat']) || !is_array($in['etat'])) {
            jsonResponse(['ok' => false, 'error' => 'État manquant'], 400);
        }
        /* ⚠️ L'OBJET `groupe` DU CLIENT N'EST PLUS LU.
           Il était recopié tel quel dans la base. Éprouvé sur banc : un membre
           quelconque renvoyait `{membres:[lui], type:'ouvert', nom:'…'}` et
           obtenait 200 — il expulsait les autres, renommait l'équipe, et la
           rendait lisible par n'importe quel compte de la plateforme. Ce qui
           touche à l'appartenance passe par ?action=groupe, où le
           propriétaire est vérifié. */
        $res = plat_muter(function (array $db2) use ($gid, $in, $accId) {
            if (!isset($db2['plateforme']) || !is_array($db2['plateforme'])) $db2['plateforme'] = [];
            if (!isset($db2['plateforme']['etats']) || !is_array($db2['plateforme']['etats'])) {
                $db2['plateforme']['etats'] = [];
            }
            /* Deuxième lecture de l'appartenance, SOUS VERROU : entre la
               vérification ci-dessus et l'écriture ici, le propriétaire a pu
               retirer ce membre. Sans elle, un exclu de la seconde d'avant
               écrase encore l'état de toute l'équipe. */
            $g2 = plat_groupe_par_id($db2, $gid);
            if (!$g2 || !plat_est_membre($g2, $accId)) return null;
            $db2['plateforme']['etats'][$gid] = [
                'contenu'  => $in['etat'],
                'majPar'   => $accId,
                'majLe'    => time(),
                'revision' => (int) ($db2['plateforme']['etats'][$gid]['revision'] ?? 0) + 1,
            ];
            return [$db2, ['revision' => $db2['plateforme']['etats'][$gid]['revision']]];
        }, false);
        if ($res === null) {
            jsonResponse(['ok' => false, 'error' => 'Vous n’êtes plus membre de cette équipe.',
                          'code' => 'non_membre'], 403);
        }
        jsonResponse(['ok' => true] + (is_array($res) ? $res : []));
    }

    jsonResponse(['ok' => false, 'error' => 'Méthode non permise'], 405);
}

/* ─────────────────────────────────────────────────────────────────────────
   4bis. ÉQUIPES — l'appartenance se décide ICI, jamais dans le navigateur

   Trois choses ne peuvent pas vivre côté client, et c'est pour cela que cette
   section existe :

     • L'IDENTIFIANT D'UNE ÉQUIPE. Il était codé en dur (`g1`) dans le
       navigateur : toutes les installations de la Terre poussaient donc dans
       le même casier. Le serveur le tire au sort et le rend.
     • LE CODE D'INVITATION. Le collègue invité ne connaît que le code ; son
       navigateur, lui, ne connaît aucune équipe. `_rejoindreEquipe` cherchait
       le code dans la liste LOCALE — il n'y était jamais, et l'invitation
       répondait « Ce code ne correspond à aucune équipe connue » à tout le
       monde. Il fallait un endroit qui sache résoudre code → équipe.
     • LE NOMBRE DE PLACES. Les cartes d'abonnement promettent « 1 utilisateur »,
       « jusqu'à 15 enseignants », « illimité ». Un plafond qu'on affiche et
       qu'on n'applique nulle part n'est pas un plafond.

   ⚠️ CODE INCONNU = HTTP 200 avec ok:false, PAS 404.
   LWS bannit l'adresse IP à six mauvaises requêtes par minute, et cette
   sanction ferme le site ENTIER, pas seulement l'Atelier. Or se tromper de
   code est l'erreur la plus banale qui soit : six fautes de frappe suffiraient.
   La réponse reste donc un 200 qui dit non.
   ───────────────────────────────────────────────────────────────────────── */

/**
 * Texte court venu du navigateur : borné, sans balises ni caractères de
 * commande. Le nom d'une équipe s'affiche chez tous ses membres — c'est
 * exactement le genre de champ par lequel on essaie de faire passer autre
 * chose que du texte.
 */
function plat_texte_court($v, int $max = 200): string
{
    $s = is_string($v) ? $v : '';
    $s = strip_tags($s);
    $s = preg_replace('/[\x00-\x1F\x7F]+/u', ' ', $s);
    $s = preg_replace('/\s+/u', ' ', (string) $s);
    $s = trim((string) $s);
    return function_exists('mb_substr') ? mb_substr($s, 0, $max, 'UTF-8') : substr($s, 0, $max);
}

/** Identifiant d'équipe assaini : seul l'alphabet que nous émettons passe. */
function plat_gid($v): string
{
    return (string) preg_replace('/[^A-Za-z0-9_-]/', '', substr((string) $v, 0, 64));
}

function plat_groupe_par_id(array $db, string $gid): ?array
{
    foreach (($db['plateforme']['groupes'] ?? []) as $g) {
        if (is_array($g) && (string) ($g['id'] ?? '') === $gid) return $g;
    }
    return null;
}

function plat_groupe_par_code(array $db, string $code): ?array
{
    $c = strtoupper(trim($code));
    if ($c === '') return null;
    foreach (($db['plateforme']['groupes'] ?? []) as $g) {
        if (is_array($g) && strtoupper((string) ($g['code'] ?? '')) === $c) return $g;
    }
    return null;
}

function plat_est_membre(?array $groupe, string $accId): bool
{
    if (!$groupe || $accId === '') return false;
    foreach ((array) ($groupe['membres'] ?? []) as $m) {
        if ((string) $m === $accId) return true;
    }
    return false;
}

/**
 * Ce qu'une équipe montre au navigateur. Volontairement pauvre : des
 * identifiants et un nom. Les adresses et les mots de passe des membres
 * n'ont rien à faire dans une réponse que lit un collègue.
 */
function plat_groupe_public(?array $g): ?array
{
    if (!$g) return null;
    return [
        'id'           => (string) ($g['id'] ?? ''),
        'nom'          => (string) ($g['nom'] ?? ''),
        'code'         => (string) ($g['code'] ?? ''),
        'type'         => (string) ($g['type'] ?? 'ferme'),
        'proprietaire' => (string) ($g['proprietaire'] ?? ''),
        'membres'      => array_values(array_map('strval', (array) ($g['membres'] ?? []))),
        'cree'         => (int) ($g['cree'] ?? 0),
        'places'       => (int) ($g['places'] ?? 1),
    ];
}

/** Nom affichable d'un compte, sans jamais rendre son adresse de connexion. */
function plat_nom_compte(array $db, string $accId): string
{
    foreach (['visitorAccounts', 'studentAccounts'] as $coll) {
        foreach (($db[$coll] ?? []) as $a) {
            if (!is_array($a) || (string) ($a['id'] ?? '') !== $accId) continue;
            $nom = trim((string) ($a['nom'] ?? ''));
            $pre = trim((string) ($a['pre'] ?? $a['prenom'] ?? ''));
            $ens = trim($pre . ' ' . $nom);
            if ($ens !== '') return $ens;
            /* Dernier recours : la partie gauche de l'adresse. Le domaine est
               retiré — il désigne l'établissement ou l'opérateur, pas la
               personne, et n'a aucune raison de circuler. */
            $u = (string) ($a['user'] ?? '');
            $p = strpos($u, '@');
            return $p === false ? $u : substr($u, 0, $p);
        }
    }
    return '';
}

/**
 * ANNUAIRE DE L'ÉQUIPE — id de compte → nom.
 *
 * Sans lui, le travail d'un collègue redescend signé d'un identifiant que le
 * navigateur ne sait pas nommer : il le résolvait alors contre sa table de
 * DÉMONSTRATION et affichait « Mme Nadège Fotso », voire le nom du lecteur
 * lui-même. Une remarque de relecture attribuée à la mauvaise personne est
 * pire qu'une remarque anonyme.
 */
function plat_annuaire(array $db, ?array $groupe): array
{
    $out = [];
    foreach ((array) (($groupe['membres'] ?? [])) as $m) {
        $id = (string) $m;
        if ($id === '') continue;
        $out[$id] = ['nom' => plat_nom_compte($db, $id)];
    }
    return $out;
}

/**
 * Places d'une équipe = celles du plan de son PROPRIÉTAIRE.
 * Miroir des cartes d'abonnement (this.plans, plateforme/index.html) :
 * Enseignant « 1 utilisateur », Collège « jusqu'à 15 enseignants »,
 * Bassin « illimité ». Réglable en base sans redéploiement.
 */
function plat_places_palier(array $db): array
{
    $def = ['demo' => 1, 'essai' => 1, 'ens_mois' => 1, 'ens' => 1, 'etab' => 15, 'pro' => -1];
    $sur = $db['plateforme']['places'] ?? [];
    if (is_array($sur)) {
        foreach ($def as $k => $v) {
            if (isset($sur[$k]) && is_numeric($sur[$k])) $def[$k] = (int) $sur[$k];
        }
    }
    return $def;
}

function plat_places_de(array $db, string $proprietaire): int
{
    $acc = null;
    foreach (['visitorAccounts', 'studentAccounts'] as $coll) {
        foreach (($db[$coll] ?? []) as $a) {
            if (is_array($a) && (string) ($a['id'] ?? '') === $proprietaire) { $acc = $a; break 2; }
        }
    }
    if (!$acc) return 1;
    $palier = plat_palier_de(plat_droit($acc, $db, plat_offres($db)));
    $table  = plat_places_palier($db);
    return isset($table[$palier]) ? (int) $table[$palier] : 1;
}

/** Code d'équipe lisible à voix haute : ni I/O/0/1, qui se confondent. */
function plat_code_equipe(array $db): string
{
    $L = 'ABCDEFGHJKLMNPQRSTUVWXYZ';
    $C = '23456789';
    for ($essai = 0; $essai < 500; $essai++) {
        $c = '';
        for ($i = 0; $i < 4; $i++) $c .= $L[random_int(0, strlen($L) - 1)];
        $c .= '-';
        for ($i = 0; $i < 3; $i++) $c .= $C[random_int(0, strlen($C) - 1)];
        if (!plat_groupe_par_code($db, $c)) return $c;
    }
    return 'EQ-' . strtoupper(bin2hex(random_bytes(4)));
}

if ($action === 'groupe') {
    $db = vrt_load_db();
    if (!is_array($db)) jsonResponse(['ok' => false, 'error' => 'Base indisponible'], 503);
    $v     = plat_compte($db);
    $accId = (string) ($v['acc']['id'] ?? '');
    if ($accId === '') jsonResponse(['ok' => false, 'error' => 'Compte sans identifiant'], 403);
    $op = strtolower((string) ($_GET['op'] ?? 'lister'));

    /* LISTER — la seule vérité sur « à quelles équipes j'appartiens ».
       Le navigateur ne s'en souvient plus : il demande. */
    if ($op === 'lister') {
        $mes = [];
        foreach (($db['plateforme']['groupes'] ?? []) as $g) {
            if (!is_array($g) || !plat_est_membre($g, $accId)) continue;
            $pub = plat_groupe_public($g);
            $pub['places']   = plat_places_de($db, (string) ($g['proprietaire'] ?? ''));
            $pub['annuaire'] = plat_annuaire($db, $g);
            $mes[] = $pub;
        }
        jsonResponse(['ok' => true, 'groupes' => $mes]);
    }

    if ($method !== 'POST' && $method !== 'PUT') {
        jsonResponse(['ok' => false, 'error' => 'Méthode non permise'], 405);
    }
    $in = plat_input(8192);

    if ($op === 'creer') {
        $nom = trim(plat_texte_court((string) ($in['nom'] ?? ''), 80));
        if ($nom === '') $nom = 'Mon établissement';
        /* Anti-abus discret : nul besoin de cinquante équipes. Le compteur
           porte sur celles qu'on POSSÈDE, pas sur celles qu'on a rejointes. */
        $miennes = 0;
        foreach (($db['plateforme']['groupes'] ?? []) as $g) {
            if (is_array($g) && (string) ($g['proprietaire'] ?? '') === $accId) $miennes++;
        }
        if ($miennes >= 5) {
            jsonResponse(['ok' => true, 'cree' => false,
                          'error' => 'Vous avez déjà cinq espaces de travail.',
                          'code' => 'trop_d_equipes']);
        }
        $res = plat_muter(function (array $db2) use ($accId, $nom) {
            if (!isset($db2['plateforme']) || !is_array($db2['plateforme'])) $db2['plateforme'] = [];
            if (!isset($db2['plateforme']['groupes']) || !is_array($db2['plateforme']['groupes'])) {
                $db2['plateforme']['groupes'] = [];
            }
            $g = [
                'id'           => 'eq_' . bin2hex(random_bytes(6)),
                'nom'          => $nom,
                'code'         => plat_code_equipe($db2),
                'type'         => 'ferme',
                'proprietaire' => $accId,
                'membres'      => [$accId],
                'cree'         => time(),
            ];
            $db2['plateforme']['groupes'][] = $g;
            return [$db2, ['groupe' => $g]];
        });
        $g = is_array($res) ? ($res['groupe'] ?? null) : null;
        $pub = plat_groupe_public($g);
        if ($pub) {
            $pub['places']   = plat_places_de($db, $accId);
            $pub['annuaire'] = [$accId => ['nom' => plat_nom_compte($db, $accId)]];
        }
        jsonResponse(['ok' => true, 'cree' => true, 'groupe' => $pub]);
    }

    if ($op === 'rejoindre') {
        /* Le seul chemin par lequel un inconnu touche à une équipe : on le
           borne. Huit essais par minute et par adresse, largement au-dessus
           d'une faute de frappe, très en dessous d'un balayage de codes. */
        if (vrt_rate_exceeded('plat_join', 8)) {
            jsonResponse(['ok' => true, 'rejoint' => false,
                          'error' => 'Trop de tentatives. Patientez une minute.',
                          'code' => 'trop_de_tentatives']);
        }
        $code = strtoupper(trim(plat_texte_court((string) ($in['code'] ?? ''), 32)));
        if ($code === '') {
            jsonResponse(['ok' => true, 'rejoint' => false,
                          'error' => 'Saisissez le code reçu.', 'code' => 'code_vide']);
        }
        $g = plat_groupe_par_code($db, $code);
        if (!$g) {
            jsonResponse(['ok' => true, 'rejoint' => false,
                          'error' => 'Ce code ne correspond à aucune équipe. '
                                   . 'Vérifiez-le auprès de la personne qui vous l’a envoyé.',
                          'code' => 'code_inconnu']);
        }
        $gid = (string) ($g['id'] ?? '');
        if (plat_est_membre($g, $accId)) {
            $pub = plat_groupe_public($g);
            $pub['places']   = plat_places_de($db, (string) ($g['proprietaire'] ?? ''));
            $pub['annuaire'] = plat_annuaire($db, $g);
            jsonResponse(['ok' => true, 'rejoint' => true, 'deja' => true, 'groupe' => $pub]);
        }
        $places = plat_places_de($db, (string) ($g['proprietaire'] ?? ''));
        if ($places >= 0 && count((array) ($g['membres'] ?? [])) >= $places) {
            jsonResponse(['ok' => true, 'rejoint' => false,
                          'error' => 'Cette équipe a atteint son nombre de places ('
                                   . $places . '). L’abonnement Collège en ouvre quinze.',
                          'code' => 'plus_de_place']);
        }
        $res = plat_muter(function (array $db2) use ($gid, $accId) {
            foreach (($db2['plateforme']['groupes'] ?? []) as $i => $g2) {
                if (!is_array($g2) || (string) ($g2['id'] ?? '') !== $gid) continue;
                $mem = array_values(array_map('strval', (array) ($g2['membres'] ?? [])));
                /* Le plafond est REVÉRIFIÉ sous verrou : deux invités qui
                   cliquent en même temps sur la quinzième place passeraient
                   tous deux le contrôle d'avant, et l'équipe compterait seize. */
                $pl = plat_places_de($db2, (string) ($g2['proprietaire'] ?? ''));
                if ($pl >= 0 && count($mem) >= $pl) return null;
                if (!in_array($accId, $mem, true)) $mem[] = $accId;
                $db2['plateforme']['groupes'][$i]['membres'] = $mem;
                return [$db2, ['groupe' => $db2['plateforme']['groupes'][$i]]];
            }
            return null;
        }, false);
        if ($res === null) {
            jsonResponse(['ok' => true, 'rejoint' => false,
                          'error' => 'Cette équipe n’a plus de place libre.',
                          'code' => 'plus_de_place']);
        }
        $db3 = vrt_load_db() ?: $db;
        $g3  = plat_groupe_par_id($db3, $gid);
        $pub = plat_groupe_public($g3);
        if ($pub) {
            $pub['places']   = plat_places_de($db3, (string) ($g3['proprietaire'] ?? ''));
            $pub['annuaire'] = plat_annuaire($db3, $g3);
        }
        jsonResponse(['ok' => true, 'rejoint' => true, 'groupe' => $pub]);
    }

    if ($op === 'renommer') {
        $gid = plat_gid((string) ($in['groupe'] ?? ''));
        $nom = trim(plat_texte_court((string) ($in['nom'] ?? ''), 80));
        $g   = plat_groupe_par_id($db, $gid);
        if (!$g) jsonResponse(['ok' => false, 'error' => 'Équipe inconnue.', 'code' => 'groupe_inconnu'], 404);
        if ((string) ($g['proprietaire'] ?? '') !== $accId) {
            jsonResponse(['ok' => false, 'error' => 'Seul le responsable de l’équipe peut la renommer.',
                          'code' => 'non_proprietaire'], 403);
        }
        if ($nom === '') jsonResponse(['ok' => false, 'error' => 'Nom vide.'], 400);
        plat_muter(function (array $db2) use ($gid, $nom) {
            foreach (($db2['plateforme']['groupes'] ?? []) as $i => $g2) {
                if (is_array($g2) && (string) ($g2['id'] ?? '') === $gid) {
                    $db2['plateforme']['groupes'][$i]['nom'] = $nom;
                    return [$db2, ['ok' => true]];
                }
            }
            return null;
        }, false);
        jsonResponse(['ok' => true, 'nom' => $nom]);
    }

    if ($op === 'retirer') {
        /* Quitter soi-même, ou retirer quelqu'un quand on est responsable.
           Un seul verbe pour les deux : c'est la même écriture, et deux
           chemins auraient fini par diverger. */
        $gid  = plat_gid((string) ($in['groupe'] ?? ''));
        $cible = (string) ($in['membre'] ?? $accId);
        $g    = plat_groupe_par_id($db, $gid);
        if (!$g) jsonResponse(['ok' => false, 'error' => 'Équipe inconnue.', 'code' => 'groupe_inconnu'], 404);
        $proprio = (string) ($g['proprietaire'] ?? '');
        if ($cible !== $accId && $proprio !== $accId) {
            jsonResponse(['ok' => false, 'error' => 'Seul le responsable peut retirer un membre.',
                          'code' => 'non_proprietaire'], 403);
        }
        if ($cible === $proprio) {
            jsonResponse(['ok' => false, 'error' => 'Le responsable ne peut pas quitter son équipe. '
                                                  . 'Supprimez-la ou transmettez-la d’abord.',
                          'code' => 'proprietaire'], 400);
        }
        plat_muter(function (array $db2) use ($gid, $cible) {
            foreach (($db2['plateforme']['groupes'] ?? []) as $i => $g2) {
                if (!is_array($g2) || (string) ($g2['id'] ?? '') !== $gid) continue;
                $db2['plateforme']['groupes'][$i]['membres'] = array_values(array_filter(
                    array_map('strval', (array) ($g2['membres'] ?? [])),
                    static function ($m) use ($cible) { return $m !== $cible; }
                ));
                return [$db2, ['ok' => true]];
            }
            return null;
        }, false);
        jsonResponse(['ok' => true, 'retire' => $cible]);
    }

    if ($op === 'supprimer') {
        $gid = plat_gid((string) ($in['groupe'] ?? ''));
        $g   = plat_groupe_par_id($db, $gid);
        if (!$g) jsonResponse(['ok' => false, 'error' => 'Équipe inconnue.', 'code' => 'groupe_inconnu'], 404);
        if ((string) ($g['proprietaire'] ?? '') !== $accId) {
            jsonResponse(['ok' => false, 'error' => 'Seul le responsable de l’équipe peut la supprimer.',
                          'code' => 'non_proprietaire'], 403);
        }
        plat_muter(function (array $db2) use ($gid) {
            $db2['plateforme']['groupes'] = array_values(array_filter(
                (array) ($db2['plateforme']['groupes'] ?? []),
                static function ($g2) use ($gid) {
                    return !(is_array($g2) && (string) ($g2['id'] ?? '') === $gid);
                }
            ));
            /* L'état partagé s'en va avec l'équipe : le garder ferait vivre
               indéfiniment des épreuves que plus personne ne peut lire. */
            if (isset($db2['plateforme']['etats'][$gid])) unset($db2['plateforme']['etats'][$gid]);
            return [$db2, ['ok' => true]];
        }, false);
        jsonResponse(['ok' => true, 'supprime' => $gid]);
    }

    jsonResponse(['ok' => false, 'error' => 'Opération inconnue.', 'code' => 'op'], 400);
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
    $CLE = ['ia' => 'ia', 'export' => 'exports', 'epreuve' => 'epreuves'];
    if ($genre === 'epreuve') {
        /* Le palier « demo » garde son réglage historique (DB.plateforme.offres
           .quotaEssai), que l'administration connaît déjà. Les autres lisent la
           TABLE — et c'est ce qui manquait : hors « demo », le plafond valait
           -1, c'est-à-dire ILLIMITÉ. Un compte en essai pouvait donc composer
           autant d'épreuves qu'il voulait ; seul l'export le freinait, et il ne
           le freinait pas non plus (30). */
        $plafond = ($palier === 'demo')
            ? (int) $offres['quotaEssai']
            : (array_key_exists('epreuves', $caps) ? (int) $caps['epreuves'] : -1);
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
