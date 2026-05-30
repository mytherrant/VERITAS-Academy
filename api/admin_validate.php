<?php
/**
 * api/admin_validate.php — API admin pour valider/rejeter les réponses IA
 *
 * ENDPOINTS :
 *   GET  /api/admin_validate.php?action=list&status=pending     → liste à valider
 *   GET  /api/admin_validate.php?action=list&status=validated   → liste validées
 *   POST /api/admin_validate.php?action=validate
 *        body: {id, rating, edited_text?, classe?, matiere?, type_exercice?}
 *   POST /api/admin_validate.php?action=reject
 *        body: {id, rejection_note}
 *   POST /api/admin_validate.php?action=delete
 *        body: {id}
 *
 * SÉCURITÉ : token admin obligatoire (header X-Admin-Token)
 */

declare(strict_types=1);
header('Content-Type: application/json; charset=utf-8');
// 🔐 v1.2.2 : CORS en allowlist (endpoint admin → jamais '*' ni reflet d'origine).
$__av_allowed = [
    'https://veritas-school.com', 'https://www.veritas-school.com',
    'http://localhost:8000', 'https://localhost', 'capacitor://localhost',
];
$__av_origin = $_SERVER['HTTP_ORIGIN'] ?? '';
if (in_array($__av_origin, $__av_allowed, true)) {
    header('Access-Control-Allow-Origin: ' . $__av_origin);
    header('Vary: Origin');
}
header('Access-Control-Allow-Headers: Content-Type, X-Admin-Token');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') { http_response_code(204); exit; }

// ── 1. AUTHENTIFICATION ADMIN ──────────────────────────────────────────
@include_once __DIR__ . '/payment_config.php';  // doit définir ADMIN_TOKEN
$expected = defined('ADMIN_TOKEN') ? ADMIN_TOKEN : '';
$provided = $_SERVER['HTTP_X_ADMIN_TOKEN'] ?? ($_GET['token'] ?? '');

if ($expected === '' || $provided !== $expected) {
    http_response_code(403);
    echo json_encode(['error' => 'Token admin manquant ou invalide']);
    exit;
}

// ── 2. CONNEXION DB ────────────────────────────────────────────────────
@include_once __DIR__ . '/config.php';
if (!defined('DB_HOST')) {
    http_response_code(500);
    echo json_encode(['error' => 'DB non configurée']);
    exit;
}
try {
    $pdo = new PDO('mysql:host=' . DB_HOST . ';dbname=' . DB_NAME . ';charset=utf8mb4',
                   DB_USER, DB_PASS, [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_EMULATE_PREPARES => false
    ]);
} catch (Throwable $e) {
    http_response_code(500);
    echo json_encode(['error' => 'DB connect: ' . $e->getMessage()]);
    exit;
}

// ── 3. DISPATCH ────────────────────────────────────────────────────────
$action = $_GET['action'] ?? ($_POST['action'] ?? 'list');

try {
    switch ($action) {
        case 'list':       echo json_encode(action_list($pdo));       break;
        case 'validate':   echo json_encode(action_validate($pdo));   break;
        case 'reject':     echo json_encode(action_reject($pdo));     break;
        case 'delete':     echo json_encode(action_delete($pdo));     break;
        case 'stats':      echo json_encode(action_stats($pdo));      break;
        default:
            http_response_code(400);
            echo json_encode(['error' => 'Action inconnue']);
    }
} catch (Throwable $e) {
    http_response_code(500);
    echo json_encode(['error' => $e->getMessage()]);
}

// ═══════════════════════════════════════════════════════════════════════
// ACTIONS
// ═══════════════════════════════════════════════════════════════════════

function action_list(PDO $pdo): array {
    $status = $_GET['status'] ?? 'pending';  // pending | validated | rejected
    $limit  = min(200, max(10, (int)($_GET['limit'] ?? 50)));
    $offset = max(0, (int)($_GET['offset'] ?? 0));
    $classe = $_GET['classe'] ?? '';
    $mat    = $_GET['matiere'] ?? '';

    $where = [];
    $params = [];

    if ($status === 'pending')       { $where[] = 'validated_at IS NULL AND rejection_note IS NULL'; }
    elseif ($status === 'validated') { $where[] = 'validated_at IS NOT NULL'; }
    elseif ($status === 'rejected')  { $where[] = 'rejection_note IS NOT NULL'; }

    if ($classe) { $where[] = 'classe = ?'; $params[] = $classe; }
    if ($mat)    { $where[] = 'matiere = ?'; $params[] = $mat; }

    $sql = "SELECT id, question_hash, question_text,
                   LEFT(answer_text, 600) AS answer_preview,
                   answer_text, requested_by, requested_plan,
                   created_at, validated_at, validated_by, rating,
                   classe, matiere, type_exercice, use_count
            FROM veritas_validated_answers";
    if ($where) $sql .= ' WHERE ' . implode(' AND ', $where);
    $sql .= ' ORDER BY created_at DESC LIMIT ' . $limit . ' OFFSET ' . $offset;

    $stmt = $pdo->prepare($sql);
    $stmt->execute($params);
    $rows = $stmt->fetchAll(PDO::FETCH_ASSOC);

    // Compte total pour pagination
    $countSql = "SELECT COUNT(*) FROM veritas_validated_answers";
    if ($where) $countSql .= ' WHERE ' . implode(' AND ', $where);
    $cstmt = $pdo->prepare($countSql);
    $cstmt->execute($params);
    $total = (int)$cstmt->fetchColumn();

    return ['ok' => true, 'rows' => $rows, 'total' => $total, 'limit' => $limit, 'offset' => $offset];
}

function action_validate(PDO $pdo): array {
    $body = json_decode(file_get_contents('php://input'), true) ?: $_POST;
    $id     = (int)($body['id'] ?? 0);
    $rating = (int)($body['rating'] ?? 5);
    $edited = $body['edited_text'] ?? null;
    $classe = $body['classe'] ?? null;
    $mat    = $body['matiere'] ?? null;
    $type   = $body['type_exercice'] ?? null;
    $validator = $body['validated_by'] ?? 'admin';

    if ($id <= 0) throw new RuntimeException('id manquant');
    if ($rating < 1 || $rating > 5) throw new RuntimeException('rating doit être 1-5');

    $sets = ['validated_at = NOW()', 'validated_by = ?', 'rating = ?', 'rejection_note = NULL'];
    $params = [$validator, $rating];

    if ($edited !== null && strlen($edited) > 0) {
        $sets[] = 'answer_text = ?'; $params[] = $edited;
    }
    if ($classe) { $sets[] = 'classe = ?'; $params[] = $classe; }
    if ($mat)    { $sets[] = 'matiere = ?'; $params[] = $mat; }
    if ($type)   { $sets[] = 'type_exercice = ?'; $params[] = $type; }
    $params[] = $id;

    $sql = "UPDATE veritas_validated_answers SET " . implode(', ', $sets) . " WHERE id = ?";
    $stmt = $pdo->prepare($sql);
    $stmt->execute($params);

    return ['ok' => true, 'updated' => $stmt->rowCount()];
}

function action_reject(PDO $pdo): array {
    $body = json_decode(file_get_contents('php://input'), true) ?: $_POST;
    $id   = (int)($body['id'] ?? 0);
    $note = (string)($body['rejection_note'] ?? 'Réponse incorrecte');

    if ($id <= 0) throw new RuntimeException('id manquant');

    $stmt = $pdo->prepare("UPDATE veritas_validated_answers
                           SET rejection_note = ?, validated_at = NULL
                           WHERE id = ?");
    $stmt->execute([$note, $id]);
    return ['ok' => true, 'updated' => $stmt->rowCount()];
}

function action_delete(PDO $pdo): array {
    $body = json_decode(file_get_contents('php://input'), true) ?: $_POST;
    $id = (int)($body['id'] ?? 0);
    if ($id <= 0) throw new RuntimeException('id manquant');

    $stmt = $pdo->prepare("DELETE FROM veritas_validated_answers WHERE id = ?");
    $stmt->execute([$id]);
    return ['ok' => true, 'deleted' => $stmt->rowCount()];
}

function action_stats(PDO $pdo): array {
    $stmt = $pdo->query("SELECT
        COUNT(*) AS total,
        SUM(validated_at IS NULL AND rejection_note IS NULL) AS pending,
        SUM(validated_at IS NOT NULL) AS validated,
        SUM(rejection_note IS NOT NULL) AS rejected,
        SUM(use_count) AS total_uses,
        AVG(rating) AS avg_rating
    FROM veritas_validated_answers");
    $stats = $stmt->fetch(PDO::FETCH_ASSOC);

    // Top 10 par classe
    $byClasse = $pdo->query("SELECT classe, COUNT(*) AS n
        FROM veritas_validated_answers WHERE validated_at IS NOT NULL
        GROUP BY classe ORDER BY n DESC LIMIT 10")->fetchAll(PDO::FETCH_ASSOC);

    return ['ok' => true, 'stats' => $stats, 'by_classe' => $byClasse];
}
