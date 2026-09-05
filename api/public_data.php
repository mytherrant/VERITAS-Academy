<?php
require_once __DIR__ . '/_json_boot.php'; // display_errors=0 + purge des parasites avant le JSON (voir _json_boot.php)
// ============================================================
// VÉRITAS — Données publiques (sans authentification)
// © 2024-2026 Jacques Miterand TAKOU (Mythe Errant). Tous droits réservés.
// Œuvre protégée — Loi n° 2000/011 + Convention de Berne.
// Reproduction interdite sans accord écrit. Contrefaçon : 5-10 ans prison +
// 500 000 à 10 000 000 FCFA d'amende. contact@veritas-school.com
//
// GET /api/public_data.php → retourne les infos visibles
//   aux visiteurs : partenaires, school, publicInfo,
//   calendrier, tickerItems, elearning.plans
// ── Lecture seule, pas d'auth requise ──
// ============================================================

// CORS (v1.2.2 : allowlist — même si les données sont publiques, on évite
// que des sites tiers consomment l'endpoint depuis le navigateur des visiteurs).
$__pd_allowed = [
    'https://veritas-school.com', 'https://www.veritas-school.com',
    'http://localhost:8000', 'http://localhost:8077', 'https://localhost', 'capacitor://localhost',
];
$__pd_origin = $_SERVER['HTTP_ORIGIN'] ?? '';
if (in_array($__pd_origin, $__pd_allowed, true)) {
    header('Access-Control-Allow-Origin: ' . $__pd_origin);
    header('Vary: Origin');
}
header('Access-Control-Allow-Methods: GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
header('Content-Type: application/json; charset=utf-8');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

// ── 🛡️ SENTINELLE (v2.0) ────────────────────────────────────────────────
// Placée AVANT tout travail : un moissonneur ne doit pas nous coûter une
// lecture de base ni un appel réseau pour se voir refuser ensuite.
// Profil « lecture ». Un débit anormal reçoit un défi (429), pas un bannissement
// — au Cameroun une classe entière partage une IP, et bannir l'IP fermerait
// le site à trente élèves pour un seul emballement.
require_once __DIR__ . '/_sentinel.php';
vrt_sentinelle('lecture');


if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    http_response_code(405);
    echo json_encode(['error' => 'Méthode non autorisée']);
    exit;
}

// v1.2.1 FIX : lire la base réellement écrite par db.php (data/veritas_db.json).
// Avant, on lisait uploads/veritas_db_backup.json — fichier qu'AUCUN endpoint n'écrit
// → la page visiteur ne reflétait jamais les contenus publiés par l'admin.
// On garde des replis vers les anciens emplacements pour compatibilité.
$candidates = [
    __DIR__ . '/../data/veritas_db.json',           // db.php (source principale actuelle)
    __DIR__ . '/data/veritas_db_backup.json',       // sync.php (legacy)
    __DIR__ . '/../uploads/veritas_db_backup.json', // ancien emplacement (compat)
];
/* Base de substitution pour les bancs, sur le modèle de VRT_LIVRET_DONNEES.
   Un banc qui veut éprouver la devanture doit fournir SA base : écraser
   data/veritas_db.json — gitignoré, et bien réel sur le poste du propriétaire —
   pour la durée d'un test finirait un jour par ne pas être restauré. Non
   définie (donc en production), cette constante ne change rien. */
if (defined('VRT_DB_FICHIER') && is_file((string) VRT_DB_FICHIER)) {
    array_unshift($candidates, (string) VRT_DB_FICHIER);
}
$backupFile = '';
foreach ($candidates as $c) { if (is_file($c)) { $backupFile = $c; break; } }

if ($backupFile === '' || !file_exists($backupFile)) {
    /* ⚠️ SANS BASE, LES CAHIERS RESTENT PUBLIABLES.
       Cet endpoint sortait en 404 dès que `data/veritas_db.json` manquait —
       sur un serveur fraîchement déployé, avant la première synchronisation,
       ou sur le runner d'intégration qui n'a évidemment pas la base de
       production. La vitrine recevait alors `error`, retirait sa devanture, et
       le site n'annonçait plus AUCUN produit.
       Or les quinze cahiers interactifs ne viennent pas de la base : ils
       viennent de `api/data/livrets_catalogue.json`, qui est versionné et
       déployé avec le code. Il n'y a aucune raison de les taire parce qu'une
       AUTRE source est absente.
       On renvoie donc ce qu'on sait, et rien de plus : les cahiers, sans les
       champs qui dépendent de la base (école, partenaires, activité). */
    $__sec = [];
    if (!function_exists('vrt_livret_catalogue')) @require_once __DIR__ . '/_livret_lib.php';
    if (function_exists('vrt_livret_catalogue')) {
        $__dc = dirname(__DIR__) . '/uploads/oeuvres/';
        foreach (vrt_livret_catalogue() as $__s => $__x) {
            if (!is_array($__x) || (int)($__x['prix'] ?? 0) <= 0) continue;
            /* Meme regle que plus bas : on ne met en devanture que ce que
               le serveur peut livrer. Sans cette garde, le repli publiait
               plus large que le chemin normal — exactement l'inverse de ce
               qu'un repli doit faire. */
            $__e = vrt_livret_etat((string)$__s);
            if (empty($__e['disponible'])) continue;
            $__sec[] = [
                'id' => 'livret:' . $__s,
                'titre' => (string)($__x['titre'] ?? $__s),
                'auteur' => 'Centre VÉRITAS',
                'cls' => (string)($__x['niveau'] ?? ''),
                'rayon' => 'Cahiers interactifs',
                'etiquette' => '', 'desc' => 'Cahier à remplir en ligne, avec correction immédiate.',
                'prix' => (int)$__x['prix'], 'ancienPrix' => 0,
                'pages' => (int)($__x['pages'] ?? 0), 'chaps' => 0,
                'ico' => '', 'couleur' => '',
                'couv' => is_file($__dc . 'livret_' . $__s . '.jpg')
                        ? '/uploads/oeuvres/livret_' . $__s . '.jpg' : '',
                'numerique' => true, 'stock' => null, 'vendu' => 0, 'apercu' => true,
                'kind' => 'livret',
                'url' => '/livrets/' . $__e['lien'],
            ];
        }
    }
    /* Pas de `error` quand on a quelque chose à servir : ce champ fait retirer
       la devanture côté vitrine, et ce serait faux ici. */
    echo json_encode($__sec
        ? ['boutique' => $__sec, 'partenaires' => [], 'school' => null,
           'boutiqueChiffres' => ['titres' => count($__sec), 'prixMoyen' => 0, 'vendus' => 0]]
        : ['error' => 'Aucune donnée disponible', 'partenaires' => [], 'school' => null],
        JSON_UNESCAPED_UNICODE);
    if (!$__sec) http_response_code(404);
    exit;
}

$raw = file_get_contents($backupFile);
if (!$raw) {
    http_response_code(500);
    echo json_encode(['error' => 'Erreur lecture fichier']);
    exit;
}

$db = json_decode($raw, true);
if (!$db) {
    http_response_code(500);
    echo json_encode(['error' => 'JSON invalide']);
    exit;
}

// ─────────────────────────────────────────────────────────────────────────
// CATALOGUE E-LEARNING — la VITRINE, jamais la marchandise (v1.19.1)
// ─────────────────────────────────────────────────────────────────────────
// Jusqu'ici cet endpoint n'exposait que les PLANS : un visiteur non inscrit
// voyait donc les prix d'abonnement sans jamais voir ce qu'ils ouvrent. Le
// mur d'essais n'avait rien à garder sur la page publique — il gardait une
// étagère vide.
//
// On expose donc les fiches, en LISTE BLANCHE stricte. Ce qui ne sort JAMAIS
// d'ici, quelle que soit la fiche :
//   htmlContent / fichierData / fichier / idbKey → c'est le contenu lui-même ;
//   blockedFor / unlockedFor                     → ce sont des identifiants de
//                                                   comptes, donc des données
//                                                   personnelles.
// Une liste blanche (et non une liste noire) parce qu'un champ ajouté demain
// à une fiche doit être invisible par défaut, pas exposé par oubli.
//
// externalUrl et resPedago ouvrent réellement le contenu : ils ne partent que
// pour la (ou les) ressource(s) OFFERTE(S), calculées ici avec la même règle
// que le navigateur — l'admin la fixe dans « Essais & abonnements ».

/** Ressources qui restent réellement gratuites. Miroir de _pwLibreIds(). */
function vrt_pd_offertes(array $contenus, $paywall) {
    $cl = (is_array($paywall) && isset($paywall['catalogueLibre']) && is_array($paywall['catalogueLibre']))
        ? $paywall['catalogueLibre'] : [];
    $actif   = (is_array($paywall) && array_key_exists('actif', $paywall)) ? (bool)$paywall['actif'] : true;
    $limiter = array_key_exists('limiter', $cl) ? (bool)$cl['limiter'] : true;
    $max     = array_key_exists('max', $cl) ? max(0, (int)$cl['max']) : 1;
    $ids     = (isset($cl['ids']) && is_array($cl['ids'])) ? array_values($cl['ids']) : [];

    // Paywall coupé ou limitation levée → toutes les fiches « gratuit » le restent
    if (!$actif || !$limiter) {
        $out = [];
        foreach ($contenus as $c) { if (!empty($c['gratuit']) && isset($c['id'])) $out[] = (string)$c['id']; }
        return $out;
    }
    if (count($ids) > 0) return array_map('strval', $ids);   // choix explicite de l'admin
    $out = [];
    foreach ($contenus as $c) {
        if (count($out) >= $max) break;
        if (!empty($c['gratuit']) && isset($c['id'])) $out[] = (string)$c['id'];
    }
    return $out;
}

/** Classement des classes d'après les scores RÉELLEMENT enregistrés.
 *
 *  Rien n'est inventé et rien n'est complété : s'il n'y a aucun score, on rend
 *  un tableau vide et la vitrine masque le bloc. Le panneau s'allume donc tout
 *  seul dès les premiers points, sans redéploiement ni intervention.
 *
 *  Agrégation par CLASSE, jamais par élève : le classement est public, et
 *  publier « untel · 2 480 pts » exposerait un mineur nommément.
 */
function vrt_pd_classement(array $db): array {
    $src = [];
    foreach (['jeuScores', 'gameScores', 'quizScores'] as $k) {
        if (isset($db[$k]) && is_array($db[$k])) { $src = $db[$k]; break; }
    }
    if (!$src) return ['classement' => [], 'joueurs' => 0, 'periode' => ''];

    // Semaine en cours : un « battle de la semaine » qui cumule depuis toujours
    // n'est plus un défi hebdomadaire, c'est un palmarès historique.
    $debut = strtotime('monday this week 00:00:00') ?: 0;

    $parClasse = []; $joueurs = [];
    foreach ($src as $s) {
        if (!is_array($s)) continue;
        $ts = isset($s['ts']) ? (int) $s['ts'] : (isset($s['date']) ? (int) strtotime((string) $s['date']) : 0);
        if ($ts > 0 && $debut > 0 && $ts < $debut) continue;
        $cls = trim((string) ($s['cls'] ?? $s['classe'] ?? ''));
        if ($cls === '') continue;
        $pts = (int) ($s['pts'] ?? $s['points'] ?? $s['score'] ?? 0);
        if ($pts <= 0) continue;
        $ville = trim((string) ($s['ville'] ?? ''));
        $cle = $cls . ($ville !== '' ? ' · ' . $ville : '');
        $parClasse[$cle] = ($parClasse[$cle] ?? 0) + $pts;
        $uid = (string) ($s['uid'] ?? $s['eid'] ?? '');
        if ($uid !== '') $joueurs[$uid] = true;
    }
    if (!$parClasse) return ['classement' => [], 'joueurs' => 0, 'periode' => ''];

    arsort($parClasse);
    $out = []; $rang = 0;
    foreach ($parClasse as $libelle => $pts) {
        if (++$rang > 3) break;                      // podium seulement
        $out[] = ['rang' => $rang, 'libelle' => vrt_pd_coupe($libelle, 60), 'pts' => $pts];
    }
    return ['classement' => $out, 'joueurs' => count($joueurs),
            'periode' => $debut ? date('Y-m-d', $debut) : ''];
}

/** Troncature sûre : mbstring n'est pas garanti, et une fatale ici viderait
 *  TOUTE la réponse publique (école, ticker, partenaires compris). */
function vrt_pd_coupe($s, $n) {
    $s = (string)$s;
    return function_exists('mb_substr') ? mb_substr($s, 0, $n) : substr($s, 0, $n);
}

/** Extension du fichier, sans jamais divulguer son nom ni son chemin. */
function vrt_pd_filetype(array $c) {
    if (!empty($c['fileType'])) return preg_replace('/[^a-z0-9]/i', '', (string)$c['fileType']);
    if (!empty($c['htmlContent'])) return 'html';
    $f = isset($c['fichier']) ? (string)$c['fichier'] : '';
    if ($f === '') return '';
    $ext = strtolower((string)pathinfo($f, PATHINFO_EXTENSION));
    return preg_replace('/[^a-z0-9]/', '', $ext);
}

$__pd_contenus_src = (isset($db['elearning']['contenus']) && is_array($db['elearning']['contenus']))
    ? $db['elearning']['contenus'] : [];
$__pd_supprimes = (isset($db['deletedDefaults']) && is_array($db['deletedDefaults'])) ? $db['deletedDefaults'] : [];
$__pd_paywall   = (isset($db['paywall']) && is_array($db['paywall'])) ? $db['paywall'] : null;
$__pd_offertes  = vrt_pd_offertes($__pd_contenus_src, $__pd_paywall);

$__pd_contenus = [];
foreach ($__pd_contenus_src as $c) {
    if (!is_array($c) || !isset($c['id'])) continue;
    $id = (string)$c['id'];
    if (in_array($id, $__pd_supprimes, true)) continue;      // retiré par l'admin
    if (count($__pd_contenus) >= 400) break;                  // garde-fou de poids

    $offerte = in_array($id, $__pd_offertes, true);
    $row = [
        'id'      => $id,
        'cat'     => isset($c['cat'])     ? (string)$c['cat']     : '',
        'titre'   => isset($c['titre'])   ? (string)$c['titre']   : '',
        'classe'  => isset($c['classe'])  ? (string)$c['classe']  : '',
        'matiere' => isset($c['matiere']) ? (string)$c['matiere'] : '',
        'seq'     => isset($c['seq'])     ? (string)$c['seq']     : '',
        'prix'    => isset($c['prix'])    ? (int)$c['prix']       : 0,
        'gratuit' => !empty($c['gratuit']),
        'plans'   => (isset($c['plans']) && is_array($c['plans'])) ? array_values($c['plans']) : [],
        // Accroches : volontairement tronquées, la carte n'en montre pas plus
        'apercu'  => isset($c['apercu']) ? vrt_pd_coupe($c['apercu'], 240) : '',
        'desc'    => isset($c['desc'])   ? vrt_pd_coupe($c['desc'], 240) : '',
    ];
    if (!empty($c['ico'])) $row['ico'] = vrt_pd_coupe($c['ico'], 8);
    $ft = vrt_pd_filetype($c);
    if ($ft !== '') $row['fileType'] = $ft;
    // Les deux clés qui ouvrent VRAIMENT : réservées à la ressource offerte.
    if ($offerte) {
        if (!empty($c['externalUrl'])) $row['externalUrl'] = (string)$c['externalUrl'];
        if (!empty($c['resPedago']))   $row['resPedago']   = (string)$c['resPedago'];
    }
    $__pd_contenus[] = $row;
}

// ─────────────────────────────────────────────────────────────────────────
// BOUTIQUE — LA VITRINE OBÉIT AU PANNEAU ADMIN (v1.19.48)
// ─────────────────────────────────────────────────────────────────────────
// La boutique de la vitrine était écrite EN DUR dans la maquette : neuf
// titres figés au build. Jacques pouvait ajouter un manuel dans « Bibliothèque »,
// en changer le prix, le mettre en rupture — la page publique n'en savait
// rien. Deux catalogues, deux vérités, et c'est toujours le public qui a
// tort aux yeux du client.
//
// OPT-IN EXPLICITE : seuls les livres portant `vitrine: true` sortent d'ici.
// Ce n'est pas de la prudence décorative — la base de production contient un
// produit « TEST — Paiement 100 FCFA » et cinq manuels de démonstration
// (Mathématiques 3ème, SVT 4ème…) hérités du jeu d'essai. Publier
// automatiquement tout `DB.books` les aurait mis en devanture le jour du
// déploiement, à la place des vrais cahiers. Une case à cocher dans la fiche
// du manuel décide, et rien d'autre.
//
// Liste blanche stricte, comme pour l'e-learning : un champ ajouté demain à
// la fiche d'un livre doit être invisible par défaut, pas exposé par oubli.
// Ne sortent JAMAIS d'ici : extrait / contenu / htmlContent / fichierData /
// idbKey (c'est la marchandise), secureId / securePages (ce sont les clés de
// lecture), blockedFor / unlockedFor (ce sont des identifiants de comptes).

/** Une couverture en data: URL pèse souvent plus que toute la réponse.
 *  On ne renvoie que les URL servies par le site ; la vitrine compose
 *  elle-même une couverture pour les autres. */
function vrt_pd_couverture($v) {
    $v = trim((string)$v);
    if ($v === '' || stripos($v, 'data:') === 0) return '';
    // Pas d'origine tierce : la vitrine porte une CSP qui n'autorise que
    // ses propres images, un lien externe ne s'afficherait pas.
    if (preg_match('~^https?://~i', $v)) {
        $hote = parse_url($v, PHP_URL_HOST);
        if (!in_array(strtolower((string)$hote), ['veritas-school.com', 'www.veritas-school.com'], true)) return '';
    }
    return vrt_pd_coupe($v, 300);
}

/* ⚠️ COCHÉ N'EST PAS LIVRABLE — la même règle que pour les livrets, en dessous.
   Ce bloc ne regardait que la case « vitrine ». Il mettait donc en devanture,
   avec prix et bouton d'achat, tout livre publié depuis l'administration — y
   compris un livre dont les pages ne sont PAS sur le serveur.

   Ce n'est pas théorique : publier la fiche et déposer le contenu sont deux
   gestes séparés (la fiche part par la CI dans catalogue_livres.json, les
   ~30 Mo d'images par FTP, à la main). Au 04/09/2026, les neuf cahiers
   d'œuvre intégrale répondent `prepared:false` en production. Cocher leur
   case « vitrine » les aurait affichés à la vente, et l'acheteur aurait
   découvert au moment de payer que le livre n'existe pas — l'init de paiement
   refuse bien (409, api/payment_camerpay.php), mais après le choix, après le
   panier, après la promesse.

   La branche des livrets, elle, appelle vrt_livret_etat() depuis le début.
   Deux branches du MÊME flux, une seule garde : c'est cette asymétrie qu'on
   supprime ici. Un livre PAPIER n'est pas concerné — il s'expédie, il n'a
   besoin d'aucune image sur le serveur. Même distinction qu'à l'encaissement.

   La disponibilité se constate à UN seul endroit : vrt_livre_prepare(), la
   fonction qu'interroge déjà la garde d'achat. On la charge explicitement,
   et si elle manquait, les livres NUMÉRIQUES ne sortent pas — se taire et
   publier quand même remettrait le défaut en place sans qu'on le voie. */
if (!function_exists('vrt_livre_prepare')) {
    @require_once __DIR__ . '/_auth_lib.php';
}
$__pd_gardeLivre = function_exists('vrt_livre_prepare');

$__pd_livres = [];
$__pd_books_src = (isset($db['books']) && is_array($db['books'])) ? $db['books'] : [];
foreach ($__pd_books_src as $b) {
    if (!is_array($b) || !isset($b['id'])) continue;
    if (empty($b['vitrine'])) continue;                 // pas publié : rien ne sort
    if (in_array((string)$b['id'], $__pd_supprimes, true)) continue;
    if (count($__pd_livres) >= 120) break;              // garde-fou de poids

    $numerique = !empty($b['numeriqueSeul']);
    /* Le nombre de pages ANNONCÉ est passé à la garde : sans lui, un envoi FTP
       coupé laisse des fichiers qu'is_file() déclare parfaits, et la boutique
       vend un livre qui s'arrête à la douzième page. Même appel, mêmes
       arguments qu'à l'encaissement — les deux ne peuvent pas diverger. */
    if ($numerique) {
        if (!$__pd_gardeLivre) continue;
        $__pd_attenduPg = (int)($b['securePages'] ?? $b['pages'] ?? 0);
        if (!vrt_livre_prepare((string)$b['id'], $__pd_attenduPg)) continue;
    }
    $__pd_livres[] = [
        'id'         => (string)$b['id'],
        'titre'      => isset($b['titre'])  ? vrt_pd_coupe($b['titre'], 120)  : '',
        'auteur'     => isset($b['auteur']) ? vrt_pd_coupe($b['auteur'], 80)  : '',
        'cls'        => isset($b['cls'])    ? vrt_pd_coupe($b['cls'], 40)     : '',
        'rayon'      => isset($b['rayon'])  ? vrt_pd_coupe($b['rayon'], 40)   : '',
        'etiquette'  => isset($b['etiquette']) ? vrt_pd_coupe($b['etiquette'], 24) : '',
        'desc'       => isset($b['desc'])   ? vrt_pd_coupe($b['desc'], 180)   : '',
        'prix'       => isset($b['prix'])       ? (int)$b['prix']       : 0,
        'ancienPrix' => isset($b['ancienPrix']) ? (int)$b['ancienPrix'] : 0,
        'pages'      => isset($b['pages'])      ? (int)$b['pages']      : 0,
        'chaps'      => (isset($b['chaps']) && is_array($b['chaps'])) ? count($b['chaps']) : 0,
        'ico'        => isset($b['ico']) ? vrt_pd_coupe($b['ico'], 8) : '',
        'couleur'    => isset($b['coverColor']) ? vrt_pd_coupe($b['coverColor'], 24) : '',
        'couv'       => vrt_pd_couverture($b['coverImg'] ?? ''),
        'numerique'  => $numerique,
        // Un livre numérique n'a ni pile ni rupture : il est simplement là.
        'stock'      => $numerique ? null : (isset($b['stock']) ? (int)$b['stock'] : 0),
        'vendu'      => isset($b['vendu']) ? max(0, (int)$b['vendu']) : 0,
        // Booléen seulement : l'extrait lui-même reste dans l'application.
        'apercu'     => !empty($b['extrait']) || (isset($b['previewImages']) && is_array($b['previewImages']) && count($b['previewImages']) > 0),
    ];
}


/* ═══════════════════════════════════════════════════════════════════════════
   LES LIVRES DU CATALOGUE ENTRENT AUSSI DANS LA DEVANTURE

   Un livre numérique se publie par `catalogue_livres.json`, que la CI dépose à
   la racine du site. Tout le reste du serveur le sait déjà : `secure_pdf.php`
   l'ouvre depuis ce fichier, `vrt_prix_catalogue()` y lit son tarif, la garde
   d'achat y compte ses pages. Un seul endroit l'ignorait — celui qui compose la
   devanture. Le résultat, mesuré le 04/09/2026 : dix ouvrages payables, lisibles
   et tarifés — « Le Tube digestif » et les neuf cahiers d'œuvre intégrale de
   2ⁿᵈᵉ, 1ʳᵉ et Tˡᵉ — dont AUCUNE page publique n'annonçait l'existence.

   La cause tient en une ligne : la boucle ci-dessus ne lit que `DB.books`, et
   la base n'apprend un titre qu'à la première synchronisation d'un
   administrateur. Tant qu'elle n'a pas eu lieu, le livre n'existe pour personne
   — alors même que le site sait le vendre et le livrer. C'est le même défaut
   que celui corrigé le 25/08 pour le prix et pour le lecteur ; il restait ici.

   TROIS RÈGLES, dans cet ordre :
     · LA BASE TRANCHE   — un livre déjà publié depuis l'administration a été vu
       ci-dessus ; on ne le double pas, et un décochage de « vitrine » continue
       de le retirer. Le catalogue ne sert que ce que la base ignore encore.
     · RÉVOCABLE         — un livre retiré à la main (`_livresRetires`, ou la
       liste des défauts supprimés) ne revient pas par ce chemin.
     · LIVRABLE          — même garde qu'au-dessus : rien ne sort si le serveur
       ne peut pas l'ouvrir. C'est ce qui rend cette publication sûre : les neuf
       cahiers apparaîtront d'eux-mêmes le jour de leur dépôt FTP, pas avant.
   ═══════════════════════════════════════════════════════════════════════════ */
if (!function_exists('vrt_catalogue_livres')) {
    @require_once __DIR__ . '/_auth_lib.php';
}
if (function_exists('vrt_catalogue_livres')) {
    $__pd_retires = (isset($db['_livresRetires']) && is_array($db['_livresRetires']))
                  ? $db['_livresRetires'] : [];
    /* ⚠️ « LA BASE A TRANCHÉ », PAS « LA BASE CONNAÎT ».
       Deux versions de ce relevé ont déjà échoué, chacune dans un sens :

       ① sur $__pd_livres (les livres RETENUS) — un livre dont l'administration
          avait DÉCOCHÉ « vitrine » n'y figurait pas, et le catalogue le
          republiait aussitôt : décocher n'aurait plus rien retiré.
       ② sur tout $__pd_books_src (les livres CONNUS) — mesuré en production le
          05/09/2026 : « Le Tube digestif », pourtant livrable et coché nulle
          part, restait invisible. La raison est que `_catalogueFiche()`
          (app.js) fusionne les fiches du catalogue dans DB.books SANS poser la
          clé `vitrine`. Dès qu'un administrateur ouvre l'application une fois,
          la base absorbe les dix fiches — et ce relevé les excluait alors
          définitivement. Le correctif ne tenait donc que tant que la base
          ignorait les livres, c'est-à-dire pas longtemps.

       La question n'est pas « la base connaît-elle ce titre ? » mais
       « QUELQU'UN a-t-il décidé de son sort ? ». La clé `vitrine` répond :
       posée (true ou false), un humain a tranché dans le panneau admin, et sa
       décision l'emporte ; absente, la fiche n'a fait que transiter par la
       synchronisation, et le catalogue reste seul à parler. */
    $__pd_deja = [];
    foreach ($__pd_books_src as $__b) {
        if (is_array($__b) && isset($__b['id']) && array_key_exists('vitrine', $__b)) {
            $__pd_deja[(string)$__b['id']] = 1;
        }
    }

    foreach (vrt_catalogue_livres() as $__id => $__f) {
        if (!is_array($__f)) continue;
        if (count($__pd_livres) >= 120) break;
        $__id = (string)$__id;
        if (isset($__pd_deja[$__id])) continue;                       // la base a tranché
        if (in_array($__id, $__pd_retires, true)) continue;           // retiré à la main
        if (in_array($__id, $__pd_supprimes, true)) continue;
        $__prix = (int)($__f['prixDigital'] ?? $__f['prix'] ?? 0);
        if ($__prix <= 0) continue;                                   // pas de prix : pas en devanture

        /* `numeriqueSeul` vaut vrai par défaut pour une fiche de catalogue —
           c'est la règle de _catalogueFiche() côté client, on la tient ici. */
        $__num = !isset($__f['numeriqueSeul']) || $__f['numeriqueSeul'] !== false;
        if ($__num) {
            if (!$__pd_gardeLivre) continue;
            if (!vrt_livre_prepare($__id, (int)($__f['securePages'] ?? $__f['pages'] ?? 0))) continue;
        }

        $__pd_livres[] = [
            'id'         => $__id,
            'titre'      => vrt_pd_coupe((string)($__f['titre'] ?? ''), 120),
            'auteur'     => vrt_pd_coupe((string)($__f['auteur'] ?? ''), 80),
            'cls'        => vrt_pd_coupe((string)($__f['cls'] ?? ''), 40),
            /* Un rayon écrit dans la fiche l'emporte ; sinon on range au
               fourre-tout honnête plutôt que d'inventer une catégorie
               éditoriale d'après un titre. Même règle que la vitrine. */
            'rayon'      => vrt_pd_coupe((string)($__f['rayon'] ?? 'Livres numériques'), 40),
            'etiquette'  => '',
            'desc'       => vrt_pd_coupe((string)($__f['desc'] ?? ''), 180),
            'prix'       => $__prix,
            'ancienPrix' => 0,
            'pages'      => (int)($__f['pages'] ?? 0),
            'chaps'      => (isset($__f['chaps']) && is_array($__f['chaps'])) ? count($__f['chaps']) : 0,
            'ico'        => vrt_pd_coupe((string)($__f['ico'] ?? ''), 8),
            'couleur'    => vrt_pd_coupe((string)($__f['coverColor'] ?? ''), 24),
            'couv'       => vrt_pd_couverture($__f['coverImg'] ?? ''),
            'numerique'  => $__num,
            'stock'      => $__num ? null : (int)($__f['stock'] ?? 0),
            'vendu'      => 0,
            // Un extrait au catalogue, ou des pages offertes : dans les deux
            // cas le visiteur peut lire avant de payer, et la carte le dit.
            'apercu'     => !empty($__f['extrait']) || (int)($__f['freePages'] ?? 0) > 0,
        ];
    }
}


/* ═══════════════════════════════════════════════════════════════════════════
   LES LIVRETS ENTRENT DANS LA MÊME DEVANTURE

   Le centre vendait ses ouvrages à deux endroits, avec deux catalogues et deux
   parcours : les manuels par `DB.books` (case « vitrine » cochée) et la
   boutique de l'accueil ; les cahiers interactifs par
   `api/data/livrets_catalogue.json` et une page à part. Un client cherchant
   « le cahier de 4ᵉ » devait savoir lequel des deux rayons regarder — et rien
   sur la page d'accueil ne lui disait que le second existait.

   On publie donc les deux dans le MÊME flux. La boutique n'a plus qu'une
   source à lire, et le classement se fait par `rayon`.

   CE QUI RESTE DISTINCT, ET DOIT L'ÊTRE : le parcours d'achat. Un manuel part
   en commande ; un cahier interactif ouvre un CODE D'ACCÈS émis au paiement
   confirmé (api/livret.php). D'où `kind` et `url` : la carte sait où mener,
   sans que la boutique ait à connaître la mécanique de chacun. Le canal de
   paiement, lui, est bien le même depuis le 30/08 — livrets/gate.js suit
   désormais la sonde du fournisseur actif, comme l'application.

   On ne publie QUE ce qui est réellement servi : `vrt_livret_catalogue()` est
   la source qu'`api/livret.php` interroge pour ouvrir un cahier. Un ouvrage
   absent d'ici ne peut pas être vendu ailleurs.
   ═══════════════════════════════════════════════════════════════════════════ */
if (!function_exists('vrt_livret_catalogue')) {
    @require_once __DIR__ . '/_livret_lib.php';
}
if (function_exists('vrt_livret_catalogue')) {
    $__pd_dirCouv = dirname(__DIR__) . '/uploads/oeuvres/';
    foreach (vrt_livret_catalogue() as $__slug => $__o) {
        if (!is_array($__o)) continue;
        if (count($__pd_livres) >= 120) break;
        $__prix = (int)($__o['prix'] ?? 0);
        if ($__prix <= 0) continue;          // pas de prix : pas en devanture
        /* ⚠️ DÉCLARÉ N'EST PAS PUBLIÉ. Ce bloc ne regardait que le prix : il
           mettait donc en devanture tout ouvrage tarifé, sans vérifier qu'il
           y avait quoi que ce soit à livrer derrière. 
           constate sur le disque — coquille dédiée ou données du cahier — et
           donne le lien qui va avec. C'est le MÊME calcul que sert
           api/livret.php ; il n'y en a plus deux. */
        $__etat = vrt_livret_etat((string)$__slug);
        if (empty($__etat['disponible'])) continue;
        /* Couverture CONSTATÉE, jamais déclarée — même règle qu'api/livret.php :
           un chemin écrit à la main survit à la disparition du fichier, et une
           image cassée sur la vitrine d'un produit payant est pire que pas
           d'image du tout. */
        $__couv = is_file($__pd_dirCouv . 'livret_' . $__slug . '.jpg')
                ? '/uploads/oeuvres/livret_' . $__slug . '.jpg' : '';
        $__pd_livres[] = [
            'id'         => 'livret:' . $__slug,
            'titre'      => vrt_pd_coupe((string)($__o['titre'] ?? $__slug), 120),
            'auteur'     => 'Centre VÉRITAS',
            'cls'        => vrt_pd_coupe((string)($__o['niveau'] ?? ''), 40),
            'rayon'      => 'Cahiers interactifs',
            'etiquette'  => '',
            'desc'       => 'Cahier à remplir en ligne, avec correction immédiate.',
            'prix'       => $__prix,
            'ancienPrix' => 0,
            'pages'      => (int)($__o['pages'] ?? 0),
            'chaps'      => 0,
            'ico'        => '',
            'couleur'    => '',
            'couv'       => $__couv,
            'numerique'  => true,
            'stock'      => null,            // un cahier en ligne n'a pas de pile
            'vendu'      => 0,
            'apercu'     => true,
            /* Le parcours propre au produit. La boutique s'en sert pour mener
               au bon tunnel sans rien savoir de sa mécanique. */
            'kind'       => 'livret',
            /* Le lien vient du serveur, pas d'une supposition : une page
               dedicace presente mieux qu'un lecteur nu, et lui seul sait
               laquelle des deux formes existe. */
            'url'        => '/livrets/' . $__etat['lien'],
        ];
    }
}

/** « Cécile Ngo Bassong » → « Cécile N. ». Nom vide → chaîne vide. */
function vrt_pd_initiale($nom) {
    $nom = preg_replace('/\s+/u', ' ', trim((string)$nom));
    if ($nom === '') return '';
    $parts = explode(' ', $nom);
    $prenom = $parts[0];
    if (count($parts) < 2) return vrt_pd_coupe($prenom, 24);
    $ini = function_exists('mb_substr') ? mb_substr($parts[1], 0, 1) : substr($parts[1], 0, 1);
    return vrt_pd_coupe($prenom, 24) . ' ' . strtoupper($ini) . '.';
}

/** Ventes RÉELLES et récentes, anonymisées — la preuve sociale de la vitrine.
 *
 *  Le principe tient en une phrase : on ne fabrique rien. Pas de vente, pas de
 *  bulle. Un « Cécile F. — Bafoussam vient d'acheter un livre » inventé est la
 *  première chose qu'un enseignant vérifie, et la seule qu'il ne pardonne pas.
 *  Base vide aujourd'hui ⇒ tableau vide ⇒ la vitrine n'affiche rien du tout.
 *
 *  Anonymisation : prénom + initiale du nom, jamais le nom entier, jamais le
 *  téléphone. Les acheteurs sont souvent des parents d'élèves mineurs d'un
 *  même quartier — « Cécile Ngo Bassong, Bonabéri » les désigne.
 */
function vrt_pd_activite(array $db): array {
    $ventes = [];

    // Deux journaux portent des achats : les commandes visiteur et les achats
    // de manuels des élèves. On lit les deux, on ne garde que ce qui est payé.
    $sources = [];
    if (isset($db['visitorOrders']) && is_array($db['visitorOrders'])) $sources[] = $db['visitorOrders'];
    if (isset($db['bookPurchases']) && is_array($db['bookPurchases'])) $sources[] = $db['bookPurchases'];

    $titres = [];
    if (isset($db['books']) && is_array($db['books'])) {
        foreach ($db['books'] as $b) {
            if (is_array($b) && isset($b['id'])) $titres[(string)$b['id']] = (string)($b['titre'] ?? '');
        }
    }

    foreach ($sources as $liste) {
        foreach ($liste as $o) {
            if (!is_array($o)) continue;
            /* Seuls les paiements ABOUTIS comptent. « En attente de paiement »
               n'est pas une vente, c'est une intention — et c'est le statut par
               défaut de toute commande créée. Les publier reviendrait à
               annoncer une vente à chaque clic sur « Payer ». */
            $st = mb_strtolower((string)($o['statut'] ?? $o['status'] ?? ''), 'UTF-8');
            $ok = ($st !== '') && (strpos($st, 'pay') !== false || strpos($st, 'confirm') !== false
                 || strpos($st, 'valid') !== false || strpos($st, 'livr') !== false);
            if ($ok && strpos($st, 'attente') !== false) $ok = false;   // « en attente de paiement »
            if (!$ok) continue;

            $ts = 0;
            foreach (['ts', 'datePaid', 'date'] as $k) {
                if (empty($o[$k])) continue;
                $v = $o[$k];
                if (is_numeric($v)) { $ts = (int)$v; if ($ts > 100000000000) $ts = (int)($ts / 1000); break; }
                // Dates écrites en fr-FR (jj/mm/aaaa) : strtotime les lit à l'envers.
                if (preg_match('#^(\d{2})/(\d{2})/(\d{4})$#', (string)$v, $m)) {
                    $ts = (int)mktime(12, 0, 0, (int)$m[2], (int)$m[1], (int)$m[3]); break;
                }
                $t = strtotime((string)$v); if ($t) { $ts = $t; break; }
            }
            if ($ts <= 0) continue;
            if ($ts < time() - 90 * 86400) continue;      // au-delà de 90 j, ce n'est plus « récent »

            $nom = trim((string)($o['nom'] ?? $o['client'] ?? $o['customerNom'] ?? ''));
            $bid = (string)($o['bid'] ?? $o['bookId'] ?? '');
            $ventes[] = [
                'qui'   => vrt_pd_initiale($nom),
                'ou'    => vrt_pd_coupe(trim((string)($o['ville'] ?? '')), 40),
                'quoi'  => isset($titres[$bid]) ? vrt_pd_coupe($titres[$bid], 70) : '',
                'quand' => $ts,
            ];
        }
    }

    usort($ventes, function ($a, $b) { return $b['quand'] - $a['quand']; });
    return array_slice($ventes, 0, 8);
}

/** Les chiffres du bandeau de la boutique. Comptés, jamais écrits à la main :
 *  la maquette annonçait « 134 titres au catalogue » et « 4 000 F prix moyen »
 *  pour neuf titres à 3 277 F de moyenne. Un chiffre faux sur une page de
 *  vente coûte plus qu'il ne rapporte. */
function vrt_pd_chiffres(array $db, array $boutique): array {
    $n = count($boutique);
    $somme = 0; $vendus = 0;
    foreach ($boutique as $b) $somme += (int)$b['prix'];
    if (isset($db['books']) && is_array($db['books'])) {
        foreach ($db['books'] as $b) {
            if (is_array($b) && !empty($b['vitrine'])) $vendus += (int)($b['vendu'] ?? 0);
        }
    }
    return [
        'titres'    => $n,
        'prixMoyen' => $n ? (int)round($somme / $n) : 0,
        'vendus'    => $vendus,      // 0 ⇒ la vitrine masque la statistique
    ];
}


// Extraire uniquement les données publiques (pas de notes, élèves, paiements, etc.)
$public = [
    'school'      => $db['school']      ?? null,
    'publicInfo'  => $db['publicInfo']  ?? null,
    'partenaires' => $db['partenaires'] ?? [],
    'tickerItems' => $db['tickerItems'] ?? [],
    'calendrier'  => $db['calendrier']  ?? [],
    'elearning_plans' => isset($db['elearning']['plans']) ? $db['elearning']['plans'] : [],
    'elearning_categories' => (isset($db['elearning']['categories']) && is_array($db['elearning']['categories']))
        ? $db['elearning']['categories'] : [],
    'elearning_contenus' => $__pd_contenus,
    // Catalogue de la boutique publié depuis « Bibliothèque » (case « vitrine »).
    'boutique' => $__pd_livres,
    // Politique d'affichage (essais, ressource offerte) : que des nombres, des
    // booléens et des identifiants de fiches. Elle part telle quelle pour que
    // la vitrine obéisse au panneau admin, et non à des valeurs codées en dur.
    'paywall' => $__pd_paywall,
    /* CLASSEMENT DE JEU — calculé, jamais écrit à la main.
       Le panneau « Apprendre en jouant » affichait un tableau d'honneur inventé
       (« Terminale A4 · Douala — 2 480 pts »), codé en dur dans la maquette.
       Il part d'ici désormais, et il part VIDE tant qu'aucun score n'existe :
       la vitrine masque alors le tableau et n'affiche que l'invitation à jouer.
       Un classement fabriqué est la seule chose qu'un enseignant vérifie. */
    'jeu' => vrt_pd_classement($db),
    /* Les chiffres du bandeau de la boutique, COMPTÉS. La maquette annonçait
       « 134 titres au catalogue » et « 4 000 F prix moyen » — deux nombres
       écrits à la main, faux tous les deux. */
    'boutiqueChiffres' => vrt_pd_chiffres($db, $__pd_livres),
    /* PREUVE SOCIALE — ventes réelles, anonymisées, ou rien du tout.
       Tableau vide ⇒ la vitrine n'affiche aucune bulle. */
    'activite' => vrt_pd_activite($db),
    /* SURCHARGES DE CONTENU — posees depuis « Contenu du site » (panneau
       admin). Chaque cle designe une feuille de texte ou une image de la
       maquette ; assets/vitrine.js les applique par-dessus le HTML pre-rendu.
       On ne sert que la table des valeurs : ni horodatage d'edition, ni
       identifiant d'auteur, qui ne regardent pas le visiteur. */
    'accueil' => (isset($db['accueil']['slots']) && is_array($db['accueil']['slots']))
        ? ['slots' => $db['accueil']['slots']] : null,
    'generated_at' => date('c'),
];

// Retirer les logos en data: URL (trop lourds pour une réponse publique)
foreach ($public['partenaires'] as &$p) {
    if (isset($p['logo']) && strpos($p['logo'], 'data:') === 0 && strlen($p['logo']) > 5000) {
        $p['logo'] = ''; // remplacer par vide, l'emoji ico sera utilisé
    }
}
unset($p);

echo json_encode($public, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
exit;
