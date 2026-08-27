<?php
/**
 * api/rag.php — Retrieval-Augmented Generation (Plan Élite)
 * © 2024-2026 Jacques Miterand TAKOU (Mythe Errant). Tous droits réservés.
 * Œuvre protégée — Loi n° 2000/011 + Convention de Berne.
 * Reproduction interdite sans accord écrit. Contrefaçon : 5-10 ans prison +
 * 500 000 à 10 000 000 FCFA d'amende. contact@veritas-school.com
 *
 * Recherche dans la bibliothèque littéraire africaine (biblio_index.db) les
 * passages les plus pertinents pour enrichir le prompt de l'IA.
 *
 * USAGE :
 *   GET /api/rag.php?q=Tartuffe+Molière+hypocrisie&limit=5
 *
 * RETOUR :
 *   {
 *     "ok": true,
 *     "query": "Tartuffe+Molière",
 *     "passages": [
 *       { "auteur": "Molière", "titre": "Tartuffe", "extrait": "...", "rank": 0.87 },
 *       ...
 *     ]
 *   }
 *
 * LIMITES :
 *   - max 5 passages par défaut (configurable jusqu'à 10)
 *   - chaque extrait : 600 chars max
 *   - timeout 5s sur la recherche
 *
 * SÉCURITÉ :
 *   - PRAGMA query_only = 1 → SQLite en lecture seule
 *   - Requête sanitizée (paramétrée)
 *   - CORS limité au domaine veritas-school.com
 */

declare(strict_types=1);
require_once __DIR__ . '/_json_boot.php'; // display_errors=0 + purge des parasites avant le JSON (voir _json_boot.php)
header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: public, max-age=600');  // cache navigateur 10 min
// v1.2.2 : allowlist réelle (le code reflétait toute origine malgré le commentaire).
$__rag_allowed = [
    'https://veritas-school.com', 'https://www.veritas-school.com',
    'http://localhost:8000', 'http://localhost:8077', 'https://localhost', 'capacitor://localhost',
];
$__rag_origin = $_SERVER['HTTP_ORIGIN'] ?? '';
if (in_array($__rag_origin, $__rag_allowed, true)) {
    header('Access-Control-Allow-Origin: ' . $__rag_origin);
    header('Vary: Origin');
}

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') { http_response_code(204); exit; }

// ── 🛡️ SENTINELLE (v2.0) ────────────────────────────────────────────────
// Placée AVANT tout travail : un moissonneur ne doit pas nous coûter une
// lecture de base ni un appel réseau pour se voir refuser ensuite.
// Profil « lecture ». Un débit anormal reçoit un défi (429), pas un bannissement
// — au Cameroun une classe entière partage une IP, et bannir l'IP fermerait
// le site à trente élèves pour un seul emballement.
require_once __DIR__ . '/_sentinel.php';
vrt_sentinelle('lecture');


// ── 1. PARSE INPUT ─────────────────────────────────────────────────────
$q     = trim((string)($_GET['q'] ?? ''));
$limit = min(10, max(1, (int)($_GET['limit'] ?? 5)));

if (!isset($_GET['daily']) && strlen($q) < 3) {
    echo json_encode(['ok' => false, 'passages' => [], 'note' => 'Query trop courte (3 chars min)']);
    exit;
}

// ── 2. CHEMIN DE LA BASE biblio_index.db ───────────────────────────────
// Cette base provient de biblio_search.py (D:\Bibliothèque local).
// Elle doit être uploadée sur LWS dans /api/data/biblio_index.db
// v1.2.3 : ?src=oeuvres → index ISOLÉ des œuvres au programme (passages &
// références précis) ; sinon → grand corpus général. Whitelist stricte.
$src    = (string)($_GET['src'] ?? '');
$dbName = ($src === 'oeuvres') ? 'oeuvres_index.db' : 'biblio_index.db';
$dbPath = __DIR__ . '/data/' . $dbName;

if (!file_exists($dbPath)) {
    // Mode dégradé : retourner un avertissement plutôt qu'une erreur
    echo json_encode([
        'ok' => false,
        'passages' => [],
        'note' => 'Base RAG non encore déployée sur le serveur. L\'IA fonctionne sans contexte enrichi.'
    ]);
    exit;
}

// ── 2bis. v1.2.3 : PASSAGE DU JOUR (?daily=1) — tirage déterministe par date,
//    sans requête. Sert le widget « Passage du jour » (œuvres du corpus isolé). ──
if (isset($_GET['daily'])) {
    require_once __DIR__ . '/_oeuvres_auteurs.php';
    try {
        $pdo = new PDO('sqlite:' . $dbPath);
        $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        $pdo->exec("PRAGMA query_only = 1");
        // v1.2.3 : ne tirer que des passages FRANÇAIS (les œuvres en V.O. anglaise,
        // ex. l'epub de Conrad, n'ont pas d'accents français) → heuristique accents.
        $fr = "(p.text LIKE '%é%' OR p.text LIKE '%è%' OR p.text LIKE '%à%' OR p.text LIKE '%ç%' OR p.text LIKE '%ê%')";
        // Passage du jour = teaser : on exige des extraits SUBSTANTIELS (≈6 lignes mini)
        // pour vraiment donner envie de lire la suite. Seuil relevé 240 → 450 caractères.

        /* ── On tire une ŒUVRE, PUIS un passage dedans ────────────────────
           L'ancien tirage prenait un offset dans les 57 433 passages, toutes
           œuvres confondues, et n'avançait que de 7 par jour. Or les passages
           sont rangés par livre, et un roman en compte autour d'un millier :
           il fallait donc environ CENT QUARANTE JOURS pour sortir du même
           ouvrage. Vérifié le 20/08/2026 — sept jours d'affilée renvoyaient
           « Assèze l'Africaine ». Le « passage du jour » ne changeait pas de
           livre d'un trimestre à l'autre.
           On énumère donc les œuvres, on en prend une par jour, et l'extrait
           se choisit à l'intérieur : 101 œuvres = 101 jours avant de revoir
           la même, et jamais deux fois le même extrait. */
        $oeuvres = $pdo->query(
            "SELECT f.id AS id, COALESCE(f.title, f.filename) AS nom, COUNT(*) AS n
             FROM passages p JOIN files f ON p.file_id = f.id
             WHERE LENGTH(p.text) > 450 AND " . $fr . "
             GROUP BY f.id ORDER BY f.id"
        )->fetchAll(PDO::FETCH_ASSOC);

        // Essais politiques, enquêtes et fichiers au nom illisible ne sont pas
        // des extraits de lecture : ils restent dans l'index, hors du widget.
        $choix = [];
        foreach ($oeuvres as $o) {
            if (!oa_est_exclu($o['nom'])) { $choix[] = $o; }
        }
        if (!$choix) { echo json_encode(['ok' => false, 'passages' => []]); exit; }

        // Compteur de jours continu : il ne repart pas à zéro au 1er janvier.
        $jour   = (int)date('z') + ((int)date('Y') - 2026) * 366;
        $oe     = $choix[$jour % count($choix)];
        $n      = max(1, (int)$oe['n']);
        $offset = ($jour * 7 + (int)date('Y')) % $n;

        $st = $pdo->prepare(
            "SELECT p.text AS extrait FROM passages p
             WHERE p.file_id = :fid AND LENGTH(p.text) > 450 AND " . $fr . "
             LIMIT 1 OFFSET " . $offset
        );
        /* PARAM_INT, et pas le execute([...]) qui semble équivalent : celui-ci
           lie en CHAÎNE par défaut, et SQLite ne rapproche pas '1' de 1. La
           requête ne remontait alors aucune ligne — le widget gardait sans
           bruit le passage figé dans la maquette, en affichant quand même le
           titre et l'auteur du jour. Un échec strictement invisible. */
        $st->bindValue(':fid', (int)$oe['id'], PDO::PARAM_INT);
        $st->execute();
        $r = $st->fetch(PDO::FETCH_ASSOC);
        if (!$r) { echo json_encode(['ok' => false, 'passages' => []]); exit; }

        /* ── Les retours à la ligne SURVIVENT ─────────────────────────────
           Un « preg_replace('/\s+/', ' ') » écrasait ici tout le blanc, sauts
           de ligne compris. Conséquence sur la page : un dialogue de théâtre
           ou de roman arrivait en un seul bloc —
             « Elle a pas pu partir toute seule. - Ça que non ! elle n'a pas
               de pieds ! - À moins que quelqu'un l'ait chipée ! »
           là où l'auteur avait écrit une réplique par ligne. On donnait à lire
           le contraire de ce qui est imprimé dans le livre. L'index, lui, les
           avait bien conservés : 33 677 passages en contiennent, dont 11 745
           avec un tiret de dialogue en tête de ligne.
           On normalise donc les espaces HORIZONTAUX seulement. */
        $ex = (string)$r['extrait'];
        $ex = str_replace(["\r\n", "\r"], "\n", $ex);
        $ex = preg_replace('/[ \t\x{00A0}]+/u', ' ', $ex);   // espaces et tabulations
        $ex = preg_replace('/ *\n */u', "\n", $ex);          // bords de ligne
        $ex = preg_replace('/\n{3,}/u', "\n\n", $ex);        // au plus une ligne vide
        $ex = trim($ex);

        /* L'index range TOUTES les œuvres sous l'auteur « Œuvre au programme
           MINESEC » : une étiquette de collection, pas une signature. Le vrai
           nom vient de la table écrite à la main (api/_oeuvres_auteurs.php),
           et reste vide tant qu'il n'est pas établi — on ne signe pas un texte
           au hasard. */
        $ident = oa_pour($oe['nom']);
        $titre = $ident['titre'] !== '' ? $ident['titre'] : trim((string)$oe['nom']);

        echo json_encode(['ok' => true, 'daily' => true, 'passages' => [[
            'auteur'  => $ident['auteur'],
            'titre'   => $titre,
            'extrait' => function_exists('mb_substr') ? mb_substr($ex, 0, 900) : substr($ex, 0, 900),
        ]]], JSON_UNESCAPED_UNICODE);
    } catch (Throwable $e) {
        echo json_encode(['ok' => false, 'passages' => [], 'error' => $e->getMessage()]);
    }
    exit;
}

// ── 3. NORMALISATION DE LA QUERY POUR FTS5 ─────────────────────────────
// FTS5 utilise une syntaxe spéciale ; on échappe et on joint en OR
$cleanQ = preg_replace('/[^\p{L}\p{N}\s\-]/u', ' ', $q);
$tokens = array_filter(array_map('trim', preg_split('/\s+/u', $cleanQ)));
$tokens = array_slice($tokens, 0, 8);  // max 8 tokens
if (empty($tokens)) {
    echo json_encode(['ok' => false, 'passages' => [], 'note' => 'Query vide après normalisation']);
    exit;
}
// Format FTS5 : "mot1 OR mot2 OR mot3"
$ftsQuery = implode(' OR ', array_map(function($t){ return '"' . str_replace('"','""',$t) . '"'; }, $tokens));

// ── 4. REQUÊTE SQLite FTS5 ─────────────────────────────────────────────
try {
    $pdo = new PDO('sqlite:' . $dbPath);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    $pdo->exec("PRAGMA query_only = 1");
    $pdo->exec("PRAGMA busy_timeout = 5000");

    $sql = "
        SELECT
            f.author  AS auteur,
            f.title   AS titre,
            f.year    AS annee,
            snippet(passages, 1, '<b>', '</b>', '…', 32) AS extrait,
            bm25(passages) AS score
        FROM passages
        JOIN files f ON p.file_id = f.id, passages p
        WHERE passages MATCH :q
        ORDER BY bm25(passages)
        LIMIT :lim
    ";
    // FIX : syntaxe correcte FTS5 + jointure (PHP PDO ne supporte pas bien LIMIT bindParam → on inline)
    $sql = "
        SELECT
            f.author  AS auteur,
            COALESCE(f.title, f.filename) AS titre,
            f.year    AS annee,
            snippet(passages, 1, '«', '»', '…', 32) AS extrait,
            bm25(passages) AS score
        FROM passages
        JOIN files f ON passages.file_id = f.id
        WHERE passages MATCH :q
        ORDER BY bm25(passages)
        LIMIT " . $limit . "
    ";
    $stmt = $pdo->prepare($sql);
    $stmt->execute([':q' => $ftsQuery]);
    $rows = $stmt->fetchAll(PDO::FETCH_ASSOC);

    // ── 5. NETTOYAGE DES EXTRAITS ──────────────────────────────────────
    $passages = [];
    foreach ($rows as $r) {
        $extrait = preg_replace('/\s+/u', ' ', (string)$r['extrait']);
        $extrait = substr($extrait, 0, 600);
        $passages[] = [
            'auteur'  => trim((string)$r['auteur']) ?: 'Anonyme',
            'titre'   => trim((string)$r['titre']),
            'annee'   => trim((string)$r['annee']) ?: null,
            'extrait' => $extrait,
            'score'   => round((float)$r['score'], 3)
        ];
    }

    echo json_encode([
        'ok'        => true,
        'query'     => $q,
        'count'     => count($passages),
        'passages'  => $passages
    ], JSON_UNESCAPED_UNICODE);

} catch (Throwable $e) {
    http_response_code(500);
    echo json_encode([
        'ok' => false,
        'passages' => [],
        'error' => 'Erreur RAG : ' . $e->getMessage()
    ]);
}
