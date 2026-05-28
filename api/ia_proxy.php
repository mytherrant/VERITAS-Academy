<?php
/**
 * api/ia_proxy.php — Proxy sécurisé vers Anthropic Claude (Plan Élite)
 *
 * SÉCURITÉ : la clé API Anthropic n'apparaît JAMAIS côté client.
 * Elle est stockée dans api/payment_config.php (ignoré par git).
 *
 * FLOW :
 *  1. Client (frontend) envoie POST {prompt, ragContext?, sysPrompt?, userId, plan}
 *  2. PHP vérifie l'abonnement (plan = 'elite' requis pour Sonnet)
 *  3. PHP cherche d'abord dans le CACHE VALIDÉ (table veritas_validated_answers)
 *  4. Si cache miss → appelle Anthropic API
 *  5. Stocke la réponse en attente de validation
 *  6. Retourne la réponse au client
 *
 * Pour utiliser en MODE DEV/TEST (sans clé Anthropic) : ANTHROPIC_API_KEY vide → fallback Pollinations
 */

declare(strict_types=1);
header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-store, no-cache, must-revalidate');
header('Access-Control-Allow-Origin: ' . ($_SERVER['HTTP_ORIGIN'] ?? '*'));
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-User-Id, X-User-Plan');
header('Access-Control-Allow-Methods: POST, OPTIONS');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') { http_response_code(204); exit; }
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
    exit;
}

// ── 1. CONFIG ──────────────────────────────────────────────────────────
@include_once __DIR__ . '/payment_config.php';  // contient ANTHROPIC_API_KEY si défini
$apiKey = defined('ANTHROPIC_API_KEY') ? ANTHROPIC_API_KEY : (getenv('ANTHROPIC_API_KEY') ?: '');

// ── 2. PARSE INPUT ─────────────────────────────────────────────────────
$body = json_decode(file_get_contents('php://input'), true) ?: [];
$prompt    = trim($body['prompt'] ?? '');
$sysPrompt = $body['sysPrompt'] ?? '';
$ragContext = $body['ragContext'] ?? '';
$userId    = $body['userId'] ?? '';
$userPlan  = strtolower($body['plan'] ?? 'anon');
$tier      = $body['tier'] ?? 'free';  // pour stats

if ($prompt === '' || strlen($prompt) > 8000) {
    http_response_code(400);
    echo json_encode(['error' => 'Prompt invalide (1-8000 chars)']);
    exit;
}

// ── 3. RATE LIMITING basique par userId (1 req / 2s) ───────────────────
if ($userId) {
    $rateFile = sys_get_temp_dir() . '/ia_rate_' . preg_replace('/[^a-z0-9]/i', '', $userId);
    if (file_exists($rateFile) && (time() - filemtime($rateFile)) < 2) {
        http_response_code(429);
        echo json_encode(['error' => 'Trop de requêtes — attendez 2 secondes']);
        exit;
    }
    @touch($rateFile);
}

// ── 3bis. 🔐 v1.2.1 RATE LIMIT PAR IP (borne les coûts, indépendant du userId client) ──
$ip = $_SERVER['HTTP_CF_CONNECTING_IP'] ?? $_SERVER['HTTP_X_FORWARDED_FOR'] ?? $_SERVER['REMOTE_ADDR'] ?? 'unknown';
$ip = explode(',', $ip)[0];
$ip = preg_replace('/[^0-9a-fA-F:.]/', '', $ip);
$rateDir = __DIR__ . '/data/_rate/';
if (!is_dir($rateDir)) @mkdir($rateDir, 0750, true);
$ipFile = $rateDir . 'ia_' . substr(md5($ip), 0, 16) . '.txt';
$nowTs = time();
$ipHits = [];
if (is_file($ipFile)) {
    $ipHits = array_filter(explode("\n", (string)file_get_contents($ipFile)), function($t) use ($nowTs){
        return $t !== '' && ($nowTs - (int)$t) < 86400; // fenêtre glissante 24h
    });
}
$lastMin = array_filter($ipHits, function($t) use ($nowTs){ return ($nowTs - (int)$t) < 60; });
if (count($lastMin) >= 15) {
    http_response_code(429);
    echo json_encode(['error' => 'Trop de requêtes IA (max 15/min). Réessayez dans 1 minute.']);
    exit;
}
if (count($ipHits) >= 300) {
    http_response_code(429);
    echo json_encode(['error' => 'Quota IA quotidien atteint pour cette connexion (300/jour).']);
    exit;
}
$ipHits[] = $nowTs;
@file_put_contents($ipFile, implode("\n", $ipHits), LOCK_EX);

// ── 4. CACHE VALIDÉ : vérifier si la question a déjà une réponse validée ─
$questionHash = sha1(strtolower(trim($prompt)));
$cachedAnswer = check_validated_cache($questionHash);
if ($cachedAnswer !== null) {
    log_request($userId, $userPlan, 'cache_hit', strlen($cachedAnswer));
    echo json_encode([
        'text'   => $cachedAnswer,
        'source' => 'cache_validated',
        'note'   => '✓ Réponse validée par un enseignant VÉRITAS'
    ]);
    exit;
}

// ── 5. CHOIX DU MODÈLE selon le plan ───────────────────────────────────
// 🔐 v1.2.1 : ne JAMAIS faire confiance au "plan" envoyé par le client (auto-déclaré côté navigateur).
// On vérifie l'abonnement RÉEL côté serveur. En cas de doute → Pollinations (gratuit, zéro coût Anthropic).
$useElite = ($apiKey !== '') && server_user_is_elite((string)$userId);
// Moteur gratuit par défaut = Google Gemini Flash (quota gratuit généreux, multilingue FR).
// ⚠️ Pollinations.ai a été DÉPRÉCIÉ en 2026 → ne plus l'utiliser.
$geminiKey = defined('GEMINI_API_KEY') ? GEMINI_API_KEY : (getenv('GEMINI_API_KEY') ?: '');

if ($useElite) {
    // Plan Élite : Claude Sonnet via Anthropic
    [$ok, $text, $error] = call_claude_sonnet($apiKey, $sysPrompt, $ragContext, $prompt);
    $source = 'claude_sonnet';
} elseif ($geminiKey !== '') {
    // Tier gratuit / visiteurs : Google Gemini Flash
    [$ok, $text, $error] = call_gemini($geminiKey, $sysPrompt, $ragContext, $prompt);
    $source = 'gemini_flash';
} else {
    // Dernier recours GRATUIT : Pollinations côté serveur. L'appel navigateur direct est
    // déprécié, mais depuis l'IP du serveur il répond encore. Si lui aussi tombe,
    // call_pollinations renvoie un message clair invitant à configurer GEMINI_API_KEY.
    [$ok, $text, $error] = call_pollinations($sysPrompt, $ragContext, $prompt);
    $source = 'pollinations';
}

// 🔁 v1.2.1 : repli automatique si le moteur principal échoue (ex. Gemini 503 « high demand »).
// L'élève obtient toujours une réponse plutôt qu'une erreur.
if (!$ok && strpos($source, 'pollinations') === false) {
    [$okP, $textP, $errP] = call_pollinations($sysPrompt, $ragContext, $prompt);
    if ($okP) { $ok = true; $text = $textP; $error = null; $source .= '_fallback_pollinations'; }
}

if (!$ok) {
    http_response_code(502);
    echo json_encode(['error' => $error ?: 'IA indisponible', 'source' => $source]);
    log_request($userId, $userPlan, 'fail', 0);
    exit;
}

// ── 6. STORE EN ATTENTE DE VALIDATION ──────────────────────────────────
store_pending_answer($questionHash, $prompt, $text, $userId, $userPlan);
log_request($userId, $userPlan, 'success_' . $source, strlen($text));

echo json_encode([
    'text'   => $text,
    'source' => $source,
    'cached' => false
]);
exit;

// ═══════════════════════════════════════════════════════════════════════
// FONCTIONS UTILES
// ═══════════════════════════════════════════════════════════════════════

function call_claude_sonnet(string $apiKey, string $sys, string $rag, string $prompt): array {
    $fullSys = trim($sys);
    if ($rag !== '') {
        $fullSys .= "\n\n═══ CONTEXTE FACTUEL (annales et corrigés MINESEC) ═══\n" . $rag
                  . "\n═══════════════════════════════════════════════════════\n"
                  . "Appuie-toi sur ce contexte. Si une info manque, dis-le clairement.";
    }

    $payload = json_encode([
        'model'      => 'claude-3-5-sonnet-20241022',
        'max_tokens' => 2048,
        'system'     => $fullSys,
        'messages'   => [['role' => 'user', 'content' => $prompt]]
    ], JSON_UNESCAPED_UNICODE);

    $ch = curl_init('https://api.anthropic.com/v1/messages');
    curl_setopt_array($ch, [
        CURLOPT_POST           => true,
        CURLOPT_POSTFIELDS     => $payload,
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_TIMEOUT        => 90,
        CURLOPT_CONNECTTIMEOUT => 10,
        CURLOPT_HTTPHEADER     => [
            'x-api-key: ' . $apiKey,
            'anthropic-version: 2023-06-01',
            'content-type: application/json'
        ]
    ]);
    $raw = curl_exec($ch);
    $http = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    $err  = curl_error($ch);
    curl_close($ch);

    if ($err) return [false, '', 'cURL: ' . $err];
    if ($http !== 200) return [false, '', 'Anthropic HTTP ' . $http . ': ' . substr($raw, 0, 200)];

    $data = json_decode($raw, true);
    $text = $data['content'][0]['text'] ?? '';
    if ($text === '') return [false, '', 'Réponse vide d\'Anthropic'];
    return [true, $text, null];
}

function call_gemini(string $apiKey, string $sys, string $rag, string $prompt): array {
    // Google Gemini Flash — quota gratuit généreux, bon support du français.
    // Clé gratuite : https://aistudio.google.com/apikey
    $fullSys = trim($sys);
    if ($rag !== '') {
        $fullSys .= "\n\n═══ CONTEXTE FACTUEL (annales et corrigés MINESEC) ═══\n" . $rag
                  . "\nAppuie-toi sur ce contexte. Si une info manque, dis-le clairement.";
    }
    $model = defined('GEMINI_MODEL') ? GEMINI_MODEL : 'gemini-2.5-flash';
    $url = 'https://generativelanguage.googleapis.com/v1beta/models/' . $model
         . ':generateContent?key=' . urlencode($apiKey);

    $payload = json_encode([
        'systemInstruction' => ['parts' => [['text' => $fullSys !== '' ? $fullSys : 'Tu es un assistant pédagogique.']]],
        'contents'          => [['role' => 'user', 'parts' => [['text' => $prompt]]]],
        'generationConfig'  => ['temperature' => 0.7, 'maxOutputTokens' => 2048]
    ], JSON_UNESCAPED_UNICODE);

    $ch = curl_init($url);
    curl_setopt_array($ch, [
        CURLOPT_POST           => true,
        CURLOPT_POSTFIELDS     => $payload,
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_TIMEOUT        => 60,
        CURLOPT_CONNECTTIMEOUT => 10,
        CURLOPT_HTTPHEADER     => ['Content-Type: application/json'],
        CURLOPT_SSL_VERIFYPEER => true
    ]);
    $raw  = curl_exec($ch);
    $http = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    $err  = curl_error($ch);
    curl_close($ch);

    if ($err) return [false, '', 'cURL: ' . $err];
    if ($http !== 200) return [false, '', 'Gemini HTTP ' . $http . ': ' . substr((string)$raw, 0, 200)];

    $data = json_decode($raw, true);
    $text = $data['candidates'][0]['content']['parts'][0]['text'] ?? '';
    if ($text === '') {
        $blocked = $data['promptFeedback']['blockReason'] ?? ($data['candidates'][0]['finishReason'] ?? '');
        return [false, '', 'Réponse vide de Gemini' . ($blocked ? ' (' . $blocked . ')' : '')];
    }
    return [true, $text, null];
}

function call_pollinations(string $sys, string $rag, string $prompt): array {
    // ⚠️ Service gratuit de DERNIER RECOURS — peut être déprécié sans préavis.
    $fullSys = trim($sys);
    if ($rag !== '') $fullSys .= "\n\n[Contexte]\n" . $rag;
    $payload = json_encode([
        'messages' => [
            ['role' => 'system', 'content' => $fullSys],
            ['role' => 'user',   'content' => $prompt]
        ],
        'model'   => 'openai',
        'private' => true,
        'stream'  => false
    ], JSON_UNESCAPED_UNICODE);
    $ch = curl_init('https://text.pollinations.ai/');
    curl_setopt_array($ch, [
        CURLOPT_POST           => true,
        CURLOPT_POSTFIELDS     => $payload,
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_TIMEOUT        => 60,
        CURLOPT_CONNECTTIMEOUT => 10,
        CURLOPT_HTTPHEADER     => ['content-type: application/json'],
        CURLOPT_SSL_VERIFYPEER => true
    ]);
    $raw  = curl_exec($ch);
    $http = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);
    if ($http !== 200 || $raw === false) return [false, '', 'Pollinations HTTP ' . $http];

    $tryJson = json_decode($raw, true);
    $out = '';
    if (is_array($tryJson) && isset($tryJson['choices'][0]['message']['content'])) {
        $out = $tryJson['choices'][0]['message']['content'];
    } elseif (strlen(trim((string)$raw)) > 20) {
        $out = trim($raw);
    }
    // Ne JAMAIS renvoyer le message de dépréciation comme une vraie réponse.
    if ($out === '' || preg_match('/legacy text API|being deprecated|enter\.pollinations/i', $out)) {
        return [false, '', 'IA gratuite momentanément indisponible — configurez GEMINI_API_KEY (gratuit) dans api/payment_config.php.'];
    }
    return [true, $out, null];
}

function check_validated_cache(string $hash): ?string {
    $pdo = get_pdo();
    if (!$pdo) return null;
    try {
        $stmt = $pdo->prepare("SELECT answer_text FROM veritas_validated_answers
                               WHERE question_hash = ? AND validated_at IS NOT NULL
                               LIMIT 1");
        $stmt->execute([$hash]);
        $row = $stmt->fetch(PDO::FETCH_ASSOC);
        if ($row) {
            // Incrémenter le compteur d'utilisation
            $pdo->prepare("UPDATE veritas_validated_answers SET use_count = use_count + 1
                           WHERE question_hash = ?")->execute([$hash]);
            return $row['answer_text'];
        }
    } catch (Throwable $e) { /* table pas encore créée → on continue */ }
    return null;
}

function store_pending_answer(string $hash, string $q, string $a, string $userId, string $plan): void {
    $pdo = get_pdo();
    if (!$pdo) return;
    try {
        $stmt = $pdo->prepare("INSERT IGNORE INTO veritas_validated_answers
                               (question_hash, question_text, answer_text, requested_by, requested_plan, created_at)
                               VALUES (?, ?, ?, ?, ?, NOW())");
        $stmt->execute([$hash, substr($q, 0, 1000), substr($a, 0, 8000), $userId, $plan]);
    } catch (Throwable $e) { /* silencieux */ }
}

function log_request(string $userId, string $plan, string $action, int $bytes): void {
    $line = date('Y-m-d H:i:s') . " | " . $plan . " | " . $userId . " | " . $action . " | " . $bytes . " bytes\n";
    @file_put_contents(__DIR__ . '/data/ia_proxy.log', $line, FILE_APPEND | LOCK_EX);
}

/**
 * 🔐 v1.2.1 — Vérifie CÔTÉ SERVEUR si l'utilisateur a droit au modèle Élite (Anthropic).
 * Lit la base réelle (data/veritas_db.json) au lieu de croire le "plan" envoyé par le client.
 * Politique fail-safe : toute incertitude (fichier absent, structure inattendue, plan non
 * identifiable, abonnement expiré) renvoie false → on bascule sur Pollinations (gratuit).
 */
function server_user_is_elite(string $userId): bool {
    if ($userId === '') return false;
    $dbFile = __DIR__ . '/../data/veritas_db.json';
    if (!is_file($dbFile)) return false;
    try {
        $db = json_decode((string)file_get_contents($dbFile), true);
        if (!is_array($db)) return false;

        // Admin / super-admin → toujours autorisés
        foreach (($db['admins'] ?? []) as $a) {
            if (($a['id'] ?? null) === $userId || ($a['user'] ?? null) === $userId) return true;
        }
        if (($db['superAdmin']['user'] ?? null) === $userId) return true;

        // Identifier les plans "Élite" par leur libellé
        $elitePlanIds = [];
        foreach (($db['elearning']['plans'] ?? []) as $p) {
            $hay = strtolower(($p['nom'] ?? '') . ' ' . ($p['tier'] ?? '') . ' ' . ($p['niveau'] ?? ''));
            if (strpos($hay, 'elite') !== false || strpos($hay, 'élite') !== false) {
                if (isset($p['id'])) $elitePlanIds[] = $p['id'];
            }
        }
        if (!$elitePlanIds) return false; // aucun plan élite identifié → fail-safe

        // Abonnement actif, non expiré, sur un plan élite, pour ce compte
        $now = time();
        foreach (($db['elearning']['abonnements'] ?? []) as $abo) {
            if (($abo['accountId'] ?? null) !== $userId) continue;
            if (strtolower($abo['statut'] ?? '') !== 'actif') continue;
            $fin = !empty($abo['dateFin']) ? strtotime($abo['dateFin']) : 0;
            if ($fin && $fin < $now) continue; // expiré
            if (in_array(($abo['planId'] ?? null), $elitePlanIds, true)) return true;
        }
    } catch (Throwable $e) {
        return false;
    }
    return false;
}

function get_pdo(): ?PDO {
    static $pdo = null;
    if ($pdo !== null) return $pdo === false ? null : $pdo;
    try {
        @include_once __DIR__ . '/config.php';
        if (!defined('DB_HOST')) { $pdo = false; return null; }
        $pdo = new PDO('mysql:host=' . DB_HOST . ';dbname=' . DB_NAME . ';charset=utf8mb4',
                       DB_USER, DB_PASS, [
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_EMULATE_PREPARES => false
        ]);
        return $pdo;
    } catch (Throwable $e) {
        $pdo = false;
        return null;
    }
}
