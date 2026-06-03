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
header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: public, max-age=600');  // cache navigateur 10 min
// v1.2.2 : allowlist réelle (le code reflétait toute origine malgré le commentaire).
$__rag_allowed = [
    'https://veritas-school.com', 'https://www.veritas-school.com',
    'http://localhost:8000', 'https://localhost', 'capacitor://localhost',
];
$__rag_origin = $_SERVER['HTTP_ORIGIN'] ?? '';
if (in_array($__rag_origin, $__rag_allowed, true)) {
    header('Access-Control-Allow-Origin: ' . $__rag_origin);
    header('Vary: Origin');
}

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') { http_response_code(204); exit; }

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
    try {
        $pdo = new PDO('sqlite:' . $dbPath);
        $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        $pdo->exec("PRAGMA query_only = 1");
        // v1.2.3 : ne tirer que des passages FRANÇAIS (les œuvres en V.O. anglaise,
        // ex. l'epub de Conrad, n'ont pas d'accents français) → heuristique accents.
        $fr = "(text LIKE '%é%' OR text LIKE '%è%' OR text LIKE '%à%' OR text LIKE '%ç%' OR text LIKE '%ê%')";
        $cnt = (int)$pdo->query("SELECT COUNT(*) FROM passages WHERE LENGTH(text) > 240 AND " . $fr)->fetchColumn();
        if ($cnt < 1) { echo json_encode(['ok' => false, 'passages' => []]); exit; }
        $off = ((int)date('z') * 7 + (int)date('Y')) % $cnt;
        $r = $pdo->query("SELECT f.author AS auteur, COALESCE(f.title, f.filename) AS titre, p.text AS extrait
                          FROM passages p JOIN files f ON p.file_id = f.id
                          WHERE LENGTH(p.text) > 240 AND (p.text LIKE '%é%' OR p.text LIKE '%è%' OR p.text LIKE '%à%' OR p.text LIKE '%ç%' OR p.text LIKE '%ê%') LIMIT 1 OFFSET " . $off)->fetch(PDO::FETCH_ASSOC);
        if (!$r) { echo json_encode(['ok' => false, 'passages' => []]); exit; }
        $ex = preg_replace('/\s+/u', ' ', (string)$r['extrait']);
        echo json_encode(['ok' => true, 'daily' => true, 'passages' => [[
            'auteur'  => trim((string)$r['auteur']) ?: 'Anonyme',
            'titre'   => trim((string)$r['titre']),
            'extrait' => function_exists('mb_substr') ? mb_substr($ex, 0, 480) : substr($ex, 0, 480),
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
