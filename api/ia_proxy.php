<?php
/**
 * api/ia_proxy.php — Proxy IA sécurisé (Prof. Ambassa, programme MINESEC)
 * © 2024-2026 Jacques Miterand TAKOU (Mythe Errant). Tous droits réservés.
 * Œuvre protégée — Loi camerounaise n° 2000/011 + Convention de Berne.
 * Reproduction, distribution, modification interdites sans accord écrit.
 * Contrefaçon : 5-10 ans prison + 500 000 à 10 000 000 FCFA d'amende.
 * Contact : contact@veritas-school.com
 *
 * SÉCURITÉ : les clés IA n'apparaissent JAMAIS côté client.
 * Elles vivent dans api/payment_config.php (ignoré par git).
 *
 * FLOW (v1.3.2) :
 *  1. Client (frontend) envoie POST {prompt, ragContext?, sysPrompt?, userId, plan}
 *  2. PHP calcule le tier RÉEL côté serveur (abonnement) → choix du modèle
 *  3. PHP cherche d'abord dans le CACHE VALIDÉ (table veritas_validated_answers)
 *  4. Cache miss → CHAÎNE PAR PERFORMANCE : Gemini 2.5 Pro/Flash → DeepSeek
 *     (OpenRouter) → Groq Llama 70B → Mistral Large. Claude et Pollinations retirés.
 *  5. Stocke la réponse en attente de validation enseignant
 *  6. Retourne la réponse au client
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
@include_once __DIR__ . '/payment_config.php';  // clés IA (GEMINI/OPENROUTER/GROQ/MISTRAL)

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
  Séries techniques : industrielles (F1 construction métallique, F2 électronique, F3 électrotechnique, F4 génie civil/BA-BE, MA/MEM mécanique auto…), commerciales/STT (G1/ACA secrétariat, G2/ACC-CG comptabilité-gestion, G3 commerce ; FIG), ESF, hôtellerie (IH), agricoles. Cycle technique : 1ère-4e année (CAP), 2nde-Tle technique (Probatoire technique, BAC technique). Adapte au référentiel de la spécialité.
• Sous-système ANGLOPHONE GÉNÉRAL (GCE Board) — Forms 1-5 → GCE ORDINARY LEVEL en Form 5 : le candidat présente AU MOINS 6 matières (English Language, French et Mathematics obligatoires), maximum 11 ; 21 matières offertes ; Paper 1 = 50 questions MCQ (toutes obligatoires), Paper 2 = essay/structural (Food and Nutrition, Special Bilingual Education French et Computer Science ont 3 papers). Lower & Upper Sixth → GCE ADVANCED LEVEL : maximum 5 matières ; 24 matières offertes ; filières Arts et Science.
  NOTATION GCE : O Level → grades A, B, C = réussite (A=3 pts, B=2, C=1), U = échec (non porté sur le diplôme). A Level → grades A-E = réussite (A=5 pts, B=4, C=3, D=2, E=1), F = échec.
• Sous-système ANGLOPHONE TECHNIQUE (GCE TVE) — Intermediate Level (ITC, fin Year 4) et Advanced Level (ATC, fin Upper Sixth Technical).
  STRUCTURE DES ÉPREUVES TVE (chaque matière de spécialité) : Paper 1 = MCQ (1 h 30) ; Paper 2 = Problem Solving ou Essay (max 3 h) ; Paper 3 = PRACTICAL (max 4 h).
  ATC : 6 à 8 matières (≥3 Professional + ≥3 Related Professional) ; réussite = ≥2 Professional + ≥2 Related Professional validées. ITC : réussite = ≥5 matières dont ≥2 Professional + ≥1 Related Professional (+ English Language ou Mathematics).
  Spécialités COMMERCIALES ATC : Accounting (ACC), Marketing (MKT), Secretarial Administration and Communication (SAC), Taxation and Information Management Systems (TIMS), Home Economics (HEC).
  Spécialités INDUSTRIELLES ATC : Automobile, Civil Engineering, Electrical Power Systems, Electronics, Manufacturing Mechanics, Metal Works and Industrial Piping, Plumbing and Hydraulic Installations, Surveying, Wood Cabinet-Making, Wood Processing, Clothing Industry, HVAC, Maintenance of Electro-Mechanical Equipment, Mining and Petroleum, Forestry Management, Hospital and Biomedical Maintenance, etc.
  ITC/ATC : notation alignée O/A Level (ITC A-C = 3-1 pts ; ATC A-E = 5-1 pts).
Maîtrise les COEFFICIENTS, la durée et la STRUCTURE de chaque épreuve par série et par examen (BEPC, CAP, Probatoire, BAC, GCE O/A Level, ITC/ATC TVE). Pour une épreuve TVE, respecte TOUJOURS le format 3 papers (MCQ / Problem Solving / Practical) et précise le paper visé.

MATIÈRES
• FRANCOPHONE GÉNÉRAL : Mathématiques, Français, Littérature, Anglais, LV2 (Allemand, Espagnol, Italien, Arabe, Chinois), Latin (série A1), Histoire, Géographie, ECM, SVT, Physique-Chimie (PCT au 1er cycle), Philosophie (Tle), Économie, Informatique, Langues et Cultures Nationales, Éducation artistique, EPS — et les matières de spécialité technique.
• GCE O LEVEL — les 21 matières OFFICIELLES (codes GCE Board) : Accounting (0505), Biology (0510), Chemistry (0515), Commerce (0520), Economics (0525), English Language (0530), Literature in English (0535), Food and Nutrition (0540), French (0545), Special Bilingual Education French (0546), Geography (0550), Geology (0555), History (0560), Citizenship Education (0562), Human Biology (0565), Mathematics (0570), Additional Mathematics (0575), Physics (0580), Religious Studies (0585), Logic (0590), Computer Science (0595).
• GCE A LEVEL — les 20 matières OFFICIELLES : Accounting (0705), Biology (0710), Chemistry (0715), Economics (0725), English Language (0730), Literature in English (0735), Food Science and Nutrition (0740), French (0745), Special Bilingual Education French (0746), Geography (0750), Geology (0755), History (0760), Pure Mathematics with Mechanics (0765), Pure Mathematics with Statistics (0770), Further Mathematics (0775), Physics (0780), Religious Studies (0785), Philosophy (0790), Computer Science (0795), ICT (0796).
Quand un élève demande une matière GCE, cite le code matière officiel dans l'en-tête d'épreuve.

LITTÉRATURE & AUTEURS au programme : camerounais et africains (Mongo Beti, Ferdinand Oyono, Calixthe Beyala, Sembène Ousmane, Camara Laye, Mariama Bâ, Bernard Dadié, L. S. Senghor, Aimé Césaire), et auteurs anglophones (Chinua Achebe, Wole Soyinka, Ngugi wa Thiong'o…).

MÉTHODE & RIGUEUR
• Réponds en FRANÇAIS par défaut ; en ANGLAIS si l'élève écrit en anglais ou relève du sous-système anglophone.
• Adapte le vocabulaire et la profondeur au NIVEAU (classe/série) indiqué.
• Structure type : définition claire → explication → méthode/étapes → exemple concret en contexte camerounais/africain → point-clé d'examen ou mini-exercice.
• Sciences : pose les formules, détaille les étapes de calcul, précise les unités (SI), décris les schémas.
• Corrections : applique les GRILLES HARMONISÉES MINESEC (en français : pertinence des idées, correction de la langue, cohérence/organisation, perfectionnement ; barèmes officiels par type d'épreuve — dissertation, commentaire composé, résumé/contraction, dictée). Fournis barème détaillé, corrigé-type et critères d'évaluation.
• APC : relie chaque notion à une compétence et à une situation-problème de la vie courante.
• SOUS-SYSTÈME ANGLOPHONE (GCE) : réponds INTÉGRALEMENT en anglais. Cours/notes → structure « Topic & Objectives → Key concepts/definitions → Explanation with worked examples (SI units) → Diagram description → Cameroonian/African context → Summary → past-paper style questions with marking guide ». Sujets → format officiel GCE Board (Paper 1 = 50 MCQ A-D ; Paper 2 = essay/structured avec [marks] ; Paper 3 practical pour sciences/TVE), cite le subject code et rappelle la notation (O Level A-C/U ; A Level A-E/F). Utilise la terminologie du syllabus, jamais une traduction littérale du français.
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

// ── 4ter. 🔐 QUOTAS STRICTS PAR FORMULE — ratio d'abonnement vérifié SERVEUR ──
// Stratégie v1.3.3 : TOUS les utilisateurs (visiteurs inclus) accèdent aux
// MEILLEURS modèles (Gemini 2.5 Pro, DeepSeek). La différence entre formules
// n'est PAS la qualité mais le VOLUME — ratio STRICT, resserré pour PRIVILÉGIER
// LES ABONNÉS et tenir la charge à des milliers de comptes :
//   anon 2/jour (goûter) → free 5 → starter 15 → pro 50 → élite 100 →
//   enseignant 120 → admin illimité.
// Même l'Élite est BORNÉ (100/j = largement « illimité » pour un élève réel,
// mais protège le budget tokens contre un compte qui scripte/abuse).
// Ajustable SANS redéploiement via IA_TIER_DAILY_JSON dans payment_config.php,
// ex. : define('IA_TIER_DAILY_JSON','{"anon":2,"free":5,"pro":60}');
// L'anonyme est compté PAR IP (avant : userId vide ⇒ il échappait totalement
// au quota par formule et disposait de 300/jour).
$userTier  = server_user_tier((string) $userId);
$tierDaily = ['anon' => 2, 'free' => 5, 'starter' => 15, 'pro' => 50, 'teach' => 120, 'elite' => 100, 'admin' => -1];
if (defined('IA_TIER_DAILY_JSON')) { $cfg = json_decode(IA_TIER_DAILY_JSON, true); if (is_array($cfg)) $tierDaily = array_merge($tierDaily, $cfg); }
$uDailyMax = $tierDaily[$userTier] ?? 5;
if ($uDailyMax > 0) {
    // Clé de comptage : le COMPTE si connu, sinon l'IP (visiteur anonyme).
    $qKey   = $userId !== ''
        ? 'iauser_' . substr(md5((string) $userId), 0, 16)
        : 'iaanon_' . substr(md5($ip), 0, 16);
    $uFile  = $rateDir . $qKey . '_' . date('Ymd') . '.txt';
    $uCount = is_file($uFile) ? (int) @file_get_contents($uFile) : 0;
    if ($uCount >= $uDailyMax) {
        http_response_code(429);
        echo json_encode(['error' => ($userTier === 'anon'
                ? 'Vos ' . $uDailyMax . ' essais gratuits du jour sont épuisés. Créez un compte gratuit (' . (int) ($tierDaily['free'] ?? 5) . '/jour) ou choisissez une formule pour continuer avec la même qualité d\'IA.'
                : 'Quota IA du jour atteint pour votre formule (' . $uDailyMax . '/jour). Passez à la formule supérieure pour plus de requêtes — même IA premium, plus de volume.'),
            'tier' => $userTier, 'limit' => $uDailyMax]);
        exit;
    }
    @file_put_contents($uFile, ($uCount + 1) . '');
}

// ── 5. CHOIX DU MODÈLE — v1.3.3 : LE MEILLEUR POUR TOUS ─────────────────
// Stratégie commerciale (décision Jacques) : le visiteur teste la MEILLEURE
// qualité (Gemini 2.5 Pro en primaire, DeepSeek en 1er repli) et doit être
// conquis AVANT de passer à la formule supérieure. La différenciation des
// formules se fait UNIQUEMENT par le quota strict (section 4ter), plus par le
// modèle. Quand le quota Google du modèle Pro (~100 req/jour) est consommé,
// repli automatique Flash pour TOUS — puis DeepSeek → Groq → Mistral.
// 🚀 v1.4.2 — ROTATION MULTI-CLÉS GEMINI : 2-3 clés Google AI Studio gratuites
// (comptes distincts) multiplient le quota du moteur primaire. Définir
// GEMINI_API_KEY_2 / GEMINI_API_KEY_3 dans payment_config.php.
$geminiKeys = array_values(array_filter([
    defined('GEMINI_API_KEY')   ? GEMINI_API_KEY   : (getenv('GEMINI_API_KEY') ?: ''),
    defined('GEMINI_API_KEY_2') ? GEMINI_API_KEY_2 : '',
    defined('GEMINI_API_KEY_3') ? GEMINI_API_KEY_3 : '',
], function ($k) { return $k !== ''; }));
$isElite    = in_array($userTier, ['elite', 'admin', 'teach'], true); // conservé pour stats
$modelFree  = defined('GEMINI_MODEL')       ? GEMINI_MODEL       : 'gemini-2.5-flash';
$modelElite = defined('GEMINI_MODEL_ELITE') ? GEMINI_MODEL_ELITE : 'gemini-2.5-pro';
$model      = $modelElite; // 🚀 top modèle pour TOUS (visiteurs inclus)

// 🚀 CHAÎNE DE MOTEURS PAR PERFORMANCE (v1.4.2 — « jamais à court de tokens ») :
//   1. Gemini 2.5 Pro → Flash, sur CHAQUE clé configurée (rotation)
//   2. DeepSeek V3 via OpenRouter — meilleur raisonnement gratuit
//   3. Cerebras (Llama 3.3 70B) — 1 MILLION de tokens/jour gratuits, ultra-rapide
//   4. Groq (Llama 3.3 70B) — ~1000 req/jour gratuit
//   5. SambaNova (Llama 3.3 70B) — tier gratuit persistant
//   6. Mistral Large — excellent français
// Chaque maillon ne s'active que si sa clé est configurée dans payment_config.php.
$ok = false; $text = ''; $error = null; $source = 'none';

foreach ($geminiKeys as $gIdx => $gk) {
    [$ok, $text, $error] = call_gemini($gk, $sysPrompt, $ragContext, $prompt, $model);
    if ($ok) { $source = 'gemini_pro' . ($gIdx ? ('_k' . ($gIdx + 1)) : ''); break; }
    if ($model !== $modelFree) { // repli Flash sur la même clé
        [$okF, $textF, $errF] = call_gemini($gk, $sysPrompt, $ragContext, $prompt, $modelFree);
        if ($okF) { $ok = true; $text = $textF; $error = null; $source = 'gemini_flash' . ($gIdx ? ('_k' . ($gIdx + 1)) : ''); break; }
    }
}

if (!$ok) {
    $orKey       = defined('OPENROUTER_API_KEY') ? OPENROUTER_API_KEY : (getenv('OPENROUTER_API_KEY') ?: '');
    $cerebrasKey = defined('CEREBRAS_API_KEY')   ? CEREBRAS_API_KEY   : (getenv('CEREBRAS_API_KEY') ?: '');
    $groqKey     = defined('GROQ_API_KEY')       ? GROQ_API_KEY       : (getenv('GROQ_API_KEY') ?: '');
    $snKey       = defined('SAMBANOVA_API_KEY')  ? SAMBANOVA_API_KEY  : (getenv('SAMBANOVA_API_KEY') ?: '');
    $mistralKey  = defined('MISTRAL_API_KEY')    ? MISTRAL_API_KEY    : (getenv('MISTRAL_API_KEY') ?: '');

    if ($orKey !== '') {  // DeepSeek V3/R1 via OpenRouter : fort raisonnement + bon FR
        [$okR, $textR, $errR] = call_openrouter($orKey, $sysPrompt, $ragContext, $prompt);
        if ($okR) { $ok = true; $text = $textR; $error = null; $source .= '_fallback_openrouter'; }
        elseif ($error === null) { $error = $errR; }
    }
    if (!$ok && $cerebrasKey !== '') {  // Cerebras : 1M tokens/jour gratuits, 20× plus rapide
        [$okC, $textC, $errC] = call_cerebras($cerebrasKey, $sysPrompt, $ragContext, $prompt);
        if ($okC) { $ok = true; $text = $textC; $error = null; $source .= '_fallback_cerebras'; }
        elseif ($error === null) { $error = $errC; }
    }
    if (!$ok && $groqKey !== '') {  // Groq = le plus rapide (Llama 70B, ~1000 req/jour gratuit)
        [$okG, $textG, $errG] = call_groq($groqKey, $sysPrompt, $ragContext, $prompt);
        if ($okG) { $ok = true; $text = $textG; $error = null; $source .= '_fallback_groq'; }
        elseif ($error === null) { $error = $errG; }
    }
    if (!$ok && $snKey !== '') {  // SambaNova : tier gratuit persistant (Llama 70B)
        [$okS, $textS, $errS] = call_sambanova($snKey, $sysPrompt, $ragContext, $prompt);
        if ($okS) { $ok = true; $text = $textS; $error = null; $source .= '_fallback_sambanova'; }
        elseif ($error === null) { $error = $errS; }
    }
    if (!$ok && $mistralKey !== '') {  // Mistral = excellent français
        [$okM, $textM, $errM] = call_mistral($mistralKey, $sysPrompt, $ragContext, $prompt);
        if ($okM) { $ok = true; $text = $textM; $error = null; $source .= '_fallback_mistral'; }
        elseif ($error === null) { $error = $errM; }
    }
    if (!$ok && $error === null) {
        // v1.3.3 : le détail de configuration part en LOG (admin), jamais au visiteur.
        @file_put_contents(__DIR__ . '/data/_security_log.txt',
            date('c') . " [IA_NO_ENGINE] Aucun moteur IA configuré — renseignez GEMINI_API_KEY dans api/payment_config.php\n", FILE_APPEND);
        $error = 'Assistant IA momentanément indisponible — réessayez dans quelques instants.';
    }
}

if (!$ok) {
    // v1.3.3 : le détail technique ('Gemini HTTP 429…', 'cURL…') part en LOG —
    // le visiteur reçoit TOUJOURS un message neutre et rassurant.
    @file_put_contents(__DIR__ . '/data/_security_log.txt',
        date('c') . ' [IA_FAIL] source=' . $source . ' err=' . substr((string) $error, 0, 300) . "\n", FILE_APPEND);
    http_response_code(502);
    echo json_encode(['error' => 'Le Professeur Ambassa est momentanément indisponible — réessayez dans quelques instants.', 'source' => $source]);
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

// v1.3.2 : call_claude_sonnet SUPPRIMÉE (code mort — clé jamais configurée,
// modèle obsolète). La chaîne active : Gemini → DeepSeek → Groq → Mistral.

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

    // 🚀 v1.3.2 : 2048 → 8192 tokens. Une dissertation ou un commentaire composé
    // MINESEC complet (intro + 3 axes + conclusion + barème) dépassait 2048 →
    // réponses TRONQUÉES (« partielles ») signalées par les élèves.
    $maxTok = defined('IA_MAX_OUTPUT_TOKENS') ? (int) IA_MAX_OUTPUT_TOKENS : 8192;
    $payload = json_encode([
        'systemInstruction' => ['parts' => [['text' => $fullSys !== '' ? $fullSys : 'Tu es un assistant pédagogique.']]],
        'contents'          => [['role' => 'user', 'parts' => [['text' => $prompt]]]],
        'generationConfig'  => ['temperature' => 0.7, 'maxOutputTokens' => $maxTok]
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

// v1.3.2 : call_pollinations SUPPRIMÉE (service déprécié par son fournisseur,
// renvoyait « legacy text API deprecated » au lieu de vraies réponses).

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
        // v1.3.2 : 4096 → 8192 (aligné sur Gemini — dissertations complètes)
        'max_tokens'  => defined('IA_MAX_OUTPUT_TOKENS') ? (int) IA_MAX_OUTPUT_TOKENS : 8192,
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

// Cerebras — 1 MILLION de tokens/jour GRATUITS (le tier le plus généreux 2026),
// inférence wafer-scale ~20× plus rapide. Clé : https://cloud.cerebras.ai
function call_cerebras(string $apiKey, string $sys, string $rag, string $prompt): array {
    $model = defined('CEREBRAS_MODEL') ? CEREBRAS_MODEL : 'llama-3.3-70b';
    return call_openai_chat('https://api.cerebras.ai/v1/chat/completions',
                            $apiKey, $model, $sys, $rag, $prompt, 'Cerebras');
}

// SambaNova — tier gratuit PERSISTANT (Llama 3.3 70B, jusqu'à 405B).
// Clé : https://cloud.sambanova.ai
function call_sambanova(string $apiKey, string $sys, string $rag, string $prompt): array {
    $model = defined('SAMBANOVA_MODEL') ? SAMBANOVA_MODEL : 'Meta-Llama-3.3-70B-Instruct';
    return call_openai_chat('https://api.sambanova.ai/v1/chat/completions',
                            $apiKey, $model, $sys, $rag, $prompt, 'SambaNova');
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
        // v1.3.2 : 8000 → 30000. Une dissertation complète dépasse 8000 chars →
        // le cache resservait une réponse TRONQUÉE (colonne TEXT = 64 Ko, ample).
        $stmt->execute([$hash, substr($q, 0, 1000), substr($a, 0, 30000), $userId, $plan]);
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
