<?php
/**
 * api/ia_proxy.php — Proxy sécurisé vers Anthropic Claude (Plan Élite)
 * © 2024-2026 Jacques Miterand TAKOU (Mythe Errant). Tous droits réservés.
 * Œuvre protégée — Loi camerounaise n° 2000/011 + Convention de Berne.
 * Reproduction, distribution, modification interdites sans accord écrit.
 * Contrefaçon : 5-10 ans prison + 500 000 à 10 000 000 FCFA d'amende.
 * Contact : contact@veritas-school.com
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
// 🔐 v1.2.2 : CORS en allowlist (ne plus refléter aveuglément l'origine →
// empêche un site tiers de bruler votre quota IA depuis le navigateur d'un visiteur).
$__ia_allowed = [
    'https://veritas-school.com', 'https://www.veritas-school.com',
    'http://localhost:8000', 'https://localhost', 'capacitor://localhost',
];
$__ia_origin = $_SERVER['HTTP_ORIGIN'] ?? '';
if (in_array($__ia_origin, $__ia_allowed, true)) {
    header('Access-Control-Allow-Origin: ' . $__ia_origin);
    header('Vary: Origin');
}
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

// ── v1.2.2 : SOCLE DE SPÉCIALISATION MINESEC ────────────────────────────
// Appliqué à TOUTES les réponses (Gemini/Groq/Mistral/Pollinations) et à TOUS
// les appelants (y compris Prof. Ambassa), AVANT le sysPrompt du client et le RAG.
// → garantit que l'IA reste ancrée dans le secondaire camerounais même si le
//   client envoie un prompt faible/vide.
$MINESEC_BASE = <<<'MINESEC'
Tu es « Professeur Ambassa », expert pédagogique du système éducatif SECONDAIRE camerounais (MINESEC). Tu connais en profondeur les DEUX sous-systèmes et l'Approche Par les Compétences (APC).

STRUCTURE & EXAMENS
• Sous-système FRANCOPHONE — 1er cycle : 6e, 5e, 4e, 3e (examen BEPC en fin de 3e ; CAP pour l'enseignement technique court). 2nd cycle : 2nde, 1ère (examen PROBATOIRE), Terminale (BACCALAURÉAT).
  Séries générales : A (littéraire : A1/A2/A3/A4/A5), C (maths-sciences physiques), D (maths-SVT), E (maths-technique), TI (technologies de l'information).
  Séries techniques : industrielles (F1-F4, génie civil, électrotechnique, électronique, fabrication mécanique…), commerciales/STT (G1 secrétariat, G2 comptabilité, G3 commerce ; ACA, ACC), agricoles. Adapte au référentiel de la spécialité.
• Sous-système ANGLOPHONE — Forms 1-5 (GCE Ordinary Level en Form 5), Lower & Upper Sixth (GCE Advanced Level) ; filières Arts et Science.
Maîtrise les COEFFICIENTS, la durée et la STRUCTURE de chaque épreuve par série et par examen (BEPC, CAP, Probatoire, BAC, GCE O/A Level).

MATIÈRES (francophone et équivalents anglophones)
Mathématiques (Mathematics), Physique-Chimie-Technologie / PCT (Physics, Chemistry), SVT (Biology, Earth Science), Français (French), Anglais et LV2 (English Language, Literature), Histoire-Géographie, ECM/Éducation à la Citoyenneté (Citizenship Education), Philosophie / Logique (Tle), Informatique (Computer Science), Économie (Economics), Littérature, EPS, Langues et Cultures Nationales, Arts, et les matières de spécialité technique.

LITTÉRATURE & AUTEURS au programme : camerounais et africains (Mongo Beti, Ferdinand Oyono, Calixthe Beyala, Sembène Ousmane, Camara Laye, Mariama Bâ, Bernard Dadié, L. S. Senghor, Aimé Césaire), et auteurs anglophones (Chinua Achebe, Wole Soyinka, Ngugi wa Thiong'o…).

MÉTHODE & RIGUEUR
• Réponds en FRANÇAIS par défaut ; en ANGLAIS si l'élève écrit en anglais ou relève du sous-système anglophone.
• Adapte le vocabulaire et la profondeur au NIVEAU (classe/série) indiqué.
• Structure type : définition claire → explication → méthode/étapes → exemple concret en contexte camerounais/africain → point-clé d'examen ou mini-exercice.
• Sciences : pose les formules, détaille les étapes de calcul, précise les unités (SI), décris les schémas.
• Corrections : applique les GRILLES HARMONISÉES MINESEC (en français : pertinence des idées, correction de la langue, cohérence/organisation, perfectionnement ; barèmes officiels par type d'épreuve — dissertation, commentaire composé, résumé/contraction, dictée). Fournis barème détaillé, corrigé-type et critères d'évaluation.
• APC : relie chaque notion à une compétence et à une situation-problème de la vie courante.
• NE JAMAIS inventer une donnée factuelle (date, formule, citation, contenu de programme). En cas de doute, dis-le honnêtement.
• Quand un CONTEXTE FACTUEL (annales/corpus MINESEC) est fourni ci-dessous, APPUIE-TOI DESSUS en priorité et cite la source (auteur, titre, année).
• Encourage l'élève, valorise l'effort, donne des conseils de méthode et de gestion du temps d'examen.

MISSION : faire RÉUSSIR l'élève au BEPC, au CAP, au Probatoire, au BACCALAURÉAT et au GCE, et appuyer l'enseignant dans sa préparation (cours, épreuves, corrigés, progressions APC).
MINESEC;
$sysPrompt = $MINESEC_BASE . ($sysPrompt !== '' ? ("\n\n" . $sysPrompt) : '');

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

// ── 4bis. 🔐 v1.2.3 PLAFOND GLOBAL QUOTIDIEN (borne les coûts, tous appelants confondus) ──
// L'endpoint IA n'exige pas d'auth (entonnoir visiteur) ; seul un rate-limit par IP existait.
// Un plafond global protège contre l'abus distribué ou un pic viral. On ne compte QUE les
// vrais appels amont (on est ici APRÈS le cache → cache miss = coût réel).
// 🛟 FAIL-OPEN : toute erreur de compteur => on autorise (ne JAMAIS casser le funnel IA).
$IA_GLOBAL_DAILY_MAX = defined('IA_GLOBAL_DAILY_MAX') ? (int) IA_GLOBAL_DAILY_MAX : 3000;
$gFile  = $rateDir . 'ia_global_' . date('Ymd') . '.txt';
$gCount = is_file($gFile) ? (int) @file_get_contents($gFile) : 0;
if ($IA_GLOBAL_DAILY_MAX > 0 && $gCount >= $IA_GLOBAL_DAILY_MAX) {
    // Alerte e-mail best-effort, une seule fois par jour (si IA_ALERT_EMAIL défini)
    $alertFlag = $rateDir . 'ia_alert_' . date('Ymd') . '.txt';
    if (defined('IA_ALERT_EMAIL') && IA_ALERT_EMAIL && !is_file($alertFlag)) {
        @file_put_contents($alertFlag, '1');
        @mail(IA_ALERT_EMAIL, 'VERITAS — plafond IA quotidien atteint',
            'Le plafond global de ' . $IA_GLOBAL_DAILY_MAX . " requetes IA/jour a ete atteint le " . date('c')
            . ".\nLes nouvelles requetes sont temporairement refusees (les reponses validees en cache restent servies)."
            . "\nAjustez IA_GLOBAL_DAILY_MAX dans api/payment_config.php si besoin.");
    }
    @file_put_contents(__DIR__ . '/data/_security_log.txt',
        date('c') . ' [IA_GLOBAL_CAP] count=' . $gCount . ' max=' . $IA_GLOBAL_DAILY_MAX . ' ip=' . $ip . "\n", FILE_APPEND);
    http_response_code(503);
    echo json_encode(['error' => 'Assistant IA très sollicité aujourd’hui — réessayez plus tard. Les réponses déjà validées restent disponibles.']);
    exit;
}
// Incrément best-effort (lecture-écriture non atomique = tolérable pour un plafond souple)
@file_put_contents($gFile, ($gCount + 1) . '');

// ── 4ter. 🔐 QUOTA PAR UTILISATEUR SELON L'ABONNEMENT (anti-bypass du quota client) ──
// Le quota par fonctionnalité est géré côté client (UX), mais il est falsifiable. Ce
// plafond quotidien PAR COMPTE, calculé serveur depuis l'abonnement réel, empêche un
// compte de dépasser massivement sa formule. Plafonds souples (backstop), au-dessus
// des quotas client par fonctionnalité. -1 = illimité (élite/enseignant/admin).
$userTier  = server_user_tier((string) $userId);
$tierDaily = ['anon' => 5, 'free' => 12, 'starter' => 25, 'pro' => 90, 'teach' => -1, 'elite' => -1, 'admin' => -1];
if (defined('IA_TIER_DAILY_JSON')) { $cfg = json_decode(IA_TIER_DAILY_JSON, true); if (is_array($cfg)) $tierDaily = array_merge($tierDaily, $cfg); }
$uDailyMax = $tierDaily[$userTier] ?? 12;
if ($uDailyMax > 0 && $userId !== '') {
    $uFile  = $rateDir . 'iauser_' . substr(md5((string) $userId), 0, 16) . '_' . date('Ymd') . '.txt';
    $uCount = is_file($uFile) ? (int) @file_get_contents($uFile) : 0;
    if ($uCount >= $uDailyMax) {
        http_response_code(429);
        echo json_encode(['error' => 'Quota IA du jour atteint pour votre formule. Passez à une formule supérieure pour plus de requêtes.', 'tier' => $userTier, 'limit' => $uDailyMax]);
        exit;
    }
    @file_put_contents($uFile, ($uCount + 1) . '');
}

// ── 5. CHOIX DU MODÈLE — v1.2.2 : TOUT sur Google Gemini ────────────────
// Le PLAN ne choisit plus le fournisseur, seulement le MODÈLE Gemini :
//   • visiteurs / tier gratuit  → Gemini Flash    (gros quota : 250-1000 req/jour)
//   • abonnés Élite (vérifiés serveur) → Gemini 2.5 Pro (raisonnement avancé)
// 🔐 On vérifie l'abonnement RÉEL côté serveur (jamais le "plan" envoyé par le client).
// Claude/Anthropic n'est plus appelé par défaut (clé vide). Pollinations = ultime secours.
$geminiKey  = defined('GEMINI_API_KEY') ? GEMINI_API_KEY : (getenv('GEMINI_API_KEY') ?: '');
// Élite/enseignant/admin → modèle avancé. Basé sur le tier réel (corrige aussi le
// bug : le statut d'abonnement est « Activé », pas « actif » → l'ancien test échouait).
$isElite    = in_array($userTier, ['elite', 'admin', 'teach'], true);
$modelFree  = defined('GEMINI_MODEL')       ? GEMINI_MODEL       : 'gemini-2.5-flash';
$modelElite = defined('GEMINI_MODEL_ELITE') ? GEMINI_MODEL_ELITE : 'gemini-2.5-pro';
$model      = $isElite ? $modelElite : $modelFree;

if ($geminiKey !== '') {
    [$ok, $text, $error] = call_gemini($geminiKey, $sysPrompt, $ragContext, $prompt, $model);
    $source = $isElite ? 'gemini_pro' : 'gemini_flash';
} else {
    // Aucune clé Gemini configurée → dernier recours gratuit (déprécié).
    [$ok, $text, $error] = call_pollinations($sysPrompt, $ragContext, $prompt);
    $source = 'pollinations';
}

// 🔁 Repli 1 : si Gemini Pro échoue (quota Élite ~100/j, ou 503/429), réessayer en Flash
// → l'abonné garde une réponse, toujours sur Gemini.
if (!$ok && $isElite && $geminiKey !== '') {
    [$okF, $textF, $errF] = call_gemini($geminiKey, $sysPrompt, $ragContext, $prompt, $modelFree);
    if ($okF) { $ok = true; $text = $textF; $error = null; $source = 'gemini_flash_fallback'; }
}

// 🔁 Repli 2 : autres moteurs gratuits puissants, dans l'ordre Groq → Mistral → Pollinations.
// L'élève obtient toujours une réponse même si Gemini est indisponible/saturé.
if (!$ok) {
    $groqKey    = defined('GROQ_API_KEY')    ? GROQ_API_KEY    : (getenv('GROQ_API_KEY') ?: '');
    $mistralKey = defined('MISTRAL_API_KEY') ? MISTRAL_API_KEY : (getenv('MISTRAL_API_KEY') ?: '');
    $orKey      = defined('OPENROUTER_API_KEY') ? OPENROUTER_API_KEY : (getenv('OPENROUTER_API_KEY') ?: '');

    if ($orKey !== '') {  // OpenRouter → DeepSeek V3/R1 (gratuit) : fort raisonnement maths/sciences + FR
        [$okR, $textR, $errR] = call_openrouter($orKey, $sysPrompt, $ragContext, $prompt);
        if ($okR) { $ok = true; $text = $textR; $error = null; $source .= '_fallback_openrouter'; }
    }
    if (!$ok && $groqKey !== '') {  // Groq = le plus rapide (Llama 70B, ~1000 req/jour gratuit)
        [$okG, $textG, $errG] = call_groq($groqKey, $sysPrompt, $ragContext, $prompt);
        if ($okG) { $ok = true; $text = $textG; $error = null; $source .= '_fallback_groq'; }
    }
    if (!$ok && $mistralKey !== '') {  // Mistral = excellent français (société française)
        [$okM, $textM, $errM] = call_mistral($mistralKey, $sysPrompt, $ragContext, $prompt);
        if ($okM) { $ok = true; $text = $textM; $error = null; $source .= '_fallback_mistral'; }
    }
    if (!$ok && strpos($source, 'pollinations') === false) {  // ultime secours (déprécié)
        [$okP, $textP, $errP] = call_pollinations($sysPrompt, $ragContext, $prompt);
        if ($okP) { $ok = true; $text = $textP; $error = null; $source .= '_fallback_pollinations'; }
    }
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
        'max_tokens' => 4096,
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

function call_gemini(string $apiKey, string $sys, string $rag, string $prompt, string $model = ''): array {
    // Google Gemini — quota gratuit généreux, bon support du français.
    // Clé gratuite : https://aistudio.google.com/apikey
    $fullSys = trim($sys);
    if ($rag !== '') {
        $fullSys .= "\n\n═══ CONTEXTE FACTUEL (annales et corrigés MINESEC) ═══\n" . $rag
                  . "\nAppuie-toi sur ce contexte. Si une info manque, dis-le clairement.";
    }
    // v1.2.2 : le modèle peut être imposé par l'appelant (Pro pour l'Élite, Flash sinon).
    if ($model === '') $model = defined('GEMINI_MODEL') ? GEMINI_MODEL : 'gemini-2.5-flash';
    $url = 'https://generativelanguage.googleapis.com/v1beta/models/' . $model
         . ':generateContent?key=' . urlencode($apiKey);

    $payload = json_encode([
        'systemInstruction' => ['parts' => [['text' => $fullSys !== '' ? $fullSys : 'Tu es un assistant pédagogique.']]],
        'contents'          => [['role' => 'user', 'parts' => [['text' => $prompt]]]],
        'generationConfig'  => ['temperature' => 0.7, 'maxOutputTokens' => 2048]
    ], JSON_UNESCAPED_UNICODE);

    // v1.2.1 : retry sur 503 "high demand" / 429 / 5xx (le tier gratuit Gemini sature par moments)
    $raw = ''; $http = 0; $err = '';
    for ($try = 1; $try <= 3; $try++) {
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
        if ($http === 200) break;
        if ($http === 503 || $http === 429 || $http >= 500) { usleep(900000); continue; } // transitoire → réessai
        break; // autre erreur → pas de réessai
    }

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

/**
 * v1.2.2 — Helper générique pour les API "OpenAI-compatible" (Groq, Mistral, etc.).
 * Même format de requête/réponse → un seul code pour plusieurs fournisseurs.
 */
function call_openai_chat(string $url, string $apiKey, string $model, string $sys, string $rag, string $prompt, string $label): array {
    $fullSys = trim($sys);
    if ($rag !== '') {
        $fullSys .= "\n\n═══ CONTEXTE FACTUEL (annales et corrigés MINESEC) ═══\n" . $rag
                  . "\nAppuie-toi sur ce contexte. Si une info manque, dis-le clairement.";
    }
    $messages = [];
    if ($fullSys !== '') $messages[] = ['role' => 'system', 'content' => $fullSys];
    $messages[] = ['role' => 'user', 'content' => $prompt];

    $payload = json_encode([
        'model'       => $model,
        'messages'    => $messages,
        'max_tokens'  => 4096,
        'temperature' => 0.7
    ], JSON_UNESCAPED_UNICODE);

    $ch = curl_init($url);
    curl_setopt_array($ch, [
        CURLOPT_POST           => true,
        CURLOPT_POSTFIELDS     => $payload,
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_TIMEOUT        => 60,
        CURLOPT_CONNECTTIMEOUT => 10,
        CURLOPT_HTTPHEADER     => ['Authorization: Bearer ' . $apiKey, 'Content-Type: application/json'],
        CURLOPT_SSL_VERIFYPEER => true
    ]);
    $raw  = curl_exec($ch);
    $http = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    $err  = curl_error($ch);
    curl_close($ch);

    if ($err) return [false, '', $label . ' cURL: ' . $err];
    if ($http !== 200) return [false, '', $label . ' HTTP ' . $http . ': ' . substr((string)$raw, 0, 200)];

    $data = json_decode($raw, true);
    $text = $data['choices'][0]['message']['content'] ?? '';
    if ($text === '') return [false, '', $label . ' : réponse vide'];
    return [true, $text, null];
}

function call_groq(string $apiKey, string $sys, string $rag, string $prompt): array {
    // Groq — ultra-rapide (Llama 70B). Clé gratuite : https://console.groq.com/keys
    $model = defined('GROQ_MODEL') ? GROQ_MODEL : 'llama-3.3-70b-versatile';
    return call_openai_chat('https://api.groq.com/openai/v1/chat/completions',
                            $apiKey, $model, $sys, $rag, $prompt, 'Groq');
}

function call_mistral(string $apiKey, string $sys, string $rag, string $prompt): array {
    // Mistral — excellent en français. Clé gratuite : https://console.mistral.ai/api-keys
    $model = defined('MISTRAL_MODEL') ? MISTRAL_MODEL : 'mistral-large-latest';
    return call_openai_chat('https://api.mistral.ai/v1/chat/completions',
                            $apiKey, $model, $sys, $rag, $prompt, 'Mistral');
}

// OpenRouter — passerelle OpenAI-compatible vers des modèles GRATUITS très puissants
// (DeepSeek V3 / R1, Llama, Qwen…). Une seule clé → de nombreux modèles.
// Clé gratuite : https://openrouter.ai/keys . Modèle par défaut : DeepSeek V3 (free),
// excellent en raisonnement maths/sciences et en français.
function call_openrouter(string $apiKey, string $sys, string $rag, string $prompt): array {
    $model = defined('OPENROUTER_MODEL') ? OPENROUTER_MODEL : 'deepseek/deepseek-chat-v3-0324:free';
    return call_openai_chat('https://openrouter.ai/api/v1/chat/completions',
                            $apiKey, $model, $sys, $rag, $prompt, 'OpenRouter');
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

// Tier serveur (anon|free|starter|pro|elite|teach|admin) calculé depuis l'abonnement
// RÉEL. Réplique de _aiTier() client : exclut les statuts expirés/annulés/en attente,
// reconnaît « Activé » (et non l'ancien test === 'actif'), retient le MEILLEUR tier.
function server_user_tier(string $userId): string {
    if ($userId === '') return 'anon';
    $dbFile = __DIR__ . '/../data/veritas_db.json';
    if (!is_file($dbFile)) return 'anon';
    try {
        $db = json_decode((string) file_get_contents($dbFile), true);
        if (!is_array($db)) return 'anon';
        foreach (($db['admins'] ?? []) as $a) {
            if (($a['id'] ?? null) === $userId || ($a['user'] ?? null) === $userId) return 'admin';
        }
        if (($db['superAdmin']['user'] ?? null) === $userId || ($db['superAdmin']['id'] ?? null) === $userId) return 'admin';
        foreach (($db['teachers'] ?? []) as $t) {
            if (($t['id'] ?? null) === $userId || ($t['user'] ?? null) === $userId) return 'teach';
        }
        $known = false;
        foreach (['studentAccounts', 'visitorAccounts'] as $coll) {
            foreach (($db[$coll] ?? []) as $acc) {
                if (($acc['id'] ?? null) === $userId || ($acc['user'] ?? null) === $userId) { $known = true; break 2; }
            }
        }
        $rank = ['free' => 0, 'starter' => 1, 'pro' => 2, 'elite' => 3];
        $best = -1; $bestT = 'free';
        $now = (int) round(microtime(true) * 1000);
        foreach (($db['elearning']['abonnements'] ?? []) as $abo) {
            if (!is_array($abo)) continue;
            if (($abo['accountId'] ?? null) !== $userId && ($abo['userId'] ?? null) !== $userId) continue;
            $st = strtolower((string) ($abo['statut'] ?? ''));
            if (in_array($st, ['expiré', 'expire', 'annulé', 'annule', 'en attente', 'suspendu'], true)) continue;
            $end = isset($abo['dateFinTs']) ? (int) $abo['dateFinTs'] : 0;
            if ($end && $end < $now) continue;
            $p = strtolower((string) ($abo['plan'] ?? $abo['planId'] ?? ''));
            if (strpos($p, 'elite') !== false || $p === 'plan4') $t = 'elite';
            elseif ($p === 'plan2' || strpos($p, 'starter') !== false) $t = 'starter';
            else $t = 'pro';
            if ($rank[$t] > $best) { $best = $rank[$t]; $bestT = $t; }
        }
        if ($best >= 0) return $bestT;
        return $known ? 'free' : 'anon';
    } catch (Throwable $e) {
        return 'anon';
    }
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
