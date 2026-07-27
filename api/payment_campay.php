<?php
require_once __DIR__ . '/_json_boot.php'; // display_errors=0 + purge des parasites avant le JSON (voir _json_boot.php)
// ============================================================
// VÉRITAS — Intégration CamPay (agrégateur MTN MoMo + Orange Money, Cameroun)
// © 2024-2026 Jacques Miterand TAKOU (Mythe Errant). Tous droits réservés.
// Œuvre protégée — Loi n° 2000/011 + Convention de Berne.
// Reproduction interdite sans accord écrit. Contrefaçon : 5-10 ans prison +
// 500 000 à 10 000 000 FCFA d'amende. contact@veritas-school.com
// ──────────────────────────────────────────────────────────
// Conforme à la doc officielle CamPay (collection Postman T1LV8PVA, lue le 21/07/2026).
//
// ENCAISSEMENT
//   POST ?action=init             → /api/collect/  : prompt USSD au client (MTN ou Orange)
//   GET|POST ?action=notify       → webhook CamPay (GET ou POST selon réglage du dashboard)
//   GET  ?action=status&ref=      → statut d'un encaissement (polling frontend)
//   GET  ?action=list             → encaissements + totaux brut/frais/net (admin)
//
// VERSEMENTS
//   POST ?action=withdraw         → /api/withdraw/ : un bénéficiaire (admin)
//   POST ?action=masspayout       → /api/mass_payout/ : N bénéficiaires en UN appel (admin)
//   GET  ?action=masspayout_status&ref=  → statut détaillé d'un lot (admin)
//   GET  ?action=payouts          → liste des versements + rafraîchissement (admin)
//
// OUTILS
//   GET  ?action=balance          → /api/balance/ : solde total + MTN + Orange (admin)
//   GET  ?action=history&start=&end=  → /api/history/ : relevé avec frais réels (admin)
//   GET  ?action=holder&tel=      → /api/holder_info/ : nom du titulaire d'un numéro (admin)
//
// ⚠️ RÈGLES ISSUES DE LA DOC — ne pas « simplifier » :
//   • /collect/ exige un external_reference au format UUID4 UNIQUE. Nos réfs
//     lisibles (VT260721-AB12) n'en sont pas → on dérive un UUID4 DÉTERMINISTE
//     de la réf (campayExtRef) : format valide + idempotence conservée.
//   • Montants ENTIERS uniquement (ER201 si décimale).
//   • Le webhook porte un champ `endpoint` : "collect" (encaissement) ou
//     "withdraw" (versement). La MÊME URL reçoit les deux.
//   • Le champ `signature` est un JWT HS256 signé avec la webhook key de l'app.
//   • Les retraits doivent être autorisés dans les réglages de l'application.
//   • Les soldes sont PAR OPÉRATEUR (ER301) : encaisser en MTN ne permet pas
//     de payer en Orange.
// ============================================================

// 🔐 API JSON stricte : les erreurs PHP vont au LOG, JAMAIS dans la réponse.
//    Constaté en prod sur payment_orange.php : un warning « Constant … already
//    defined » s'imprime AVANT le corps → fuite du chemin serveur ET corruption
//    du JSON (le client ne peut plus parser). On coupe l'affichage ICI, avant
//    d'inclure la config (source possible d'un tel warning). Le log reste actif.
@ini_set('display_errors', '0');

require_once __DIR__ . '/payment_config.php';
require_once __DIR__ . '/_auth_lib.php';

// ── CORS (allowlist stricte, identique aux autres endpoints de paiement) ──
$__cp_allowed = [
    'https://veritas-school.com', 'https://www.veritas-school.com',
    'http://localhost:8000', 'https://localhost', 'capacitor://localhost',
];
$__cp_origin = $_SERVER['HTTP_ORIGIN'] ?? '';
if (in_array($__cp_origin, $__cp_allowed, true)) {
    header('Access-Control-Allow-Origin: ' . $__cp_origin);
    header('Vary: Origin');
}
header('Access-Control-Allow-Methods: GET, POST, PUT, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');
header('Access-Control-Max-Age: 86400');
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') { http_response_code(204); exit; }
header('Content-Type: application/json; charset=utf-8');
header('X-Content-Type-Options: nosniff');

$action = $_GET['action'] ?? 'init';
$method = $_SERVER['REQUEST_METHOD'];

$stateDir = __DIR__ . '/data/payments/';
if (!is_dir($stateDir)) mkdir($stateDir, 0750, true);

// 🔐 Défense en profondeur : interdire l'accès HTTP direct aux fichiers d'état
//    (jeton CamPay, PII clients, détails de versement partenaires). Le dossier
//    est créé au runtime : sans ces deux sentinelles, un api/data/.htaccess
//    global manquant laisserait /api/data/payments/_campay_token.json &
//    campay_*.json téléchargeables à des URL prévisibles (dépôt public).
if (!is_file($stateDir . '.htaccess')) {
    @file_put_contents($stateDir . '.htaccess',
        "Require all denied\n<IfModule !mod_authz_core.c>\nOrder allow,deny\nDeny from all\n</IfModule>\n");
}
if (!is_file($stateDir . 'index.php')) {
    @file_put_contents($stateDir . 'index.php', "<?php http_response_code(403); exit;\n");
}

$logFile = $stateDir . '_webhook_campay_log.txt';

// Journalisation BORNÉE : « notify » est un webhook NON authentifié — sans
// plafond, un attaquant peut faire enfler le log jusqu'à saturer le disque.
// Au-delà de 1 Mo, on ne garde que la moitié la plus récente.
function campayLog($logFile, $line) {
    if (@filesize($logFile) > 1048576) {
        $keep = @file_get_contents($logFile, false, null, 524288);
        if ($keep !== false) @file_put_contents($logFile, "... [log tronqué] ...\n" . $keep, LOCK_EX);
    }
    @file_put_contents($logFile, $line, FILE_APPEND | LOCK_EX);
}

// ════════════════════════════════════════════════════════════
// Authentification de l'action « init » — DEUX chemins :
//   (1) SECRET admin (PAY_API_SECRET) → accès complet, aucune restriction.
//   (2) JETON PUBLIC dédié (CAMPAY_PUBLIC_INIT) → permet au navigateur d'un
//       CLIENT d'initier un encaissement (/collect/) SANS détenir le secret de
//       synchro. Faible privilège : ne peut QUE créer une demande de paiement,
//       et UNIQUEMENT avec une Origin autorisée + un rate-limit par IP.
//       Laisser CAMPAY_PUBLIC_INIT vide = self-service désactivé (admin only).
// Le jeton public est volontairement rotable/désactivable : le rendre lisible
// côté client ne compromet ni le wallet ni la base.
// ════════════════════════════════════════════════════════════
function campayBearer() {
    $auth = '';
    if (function_exists('getallheaders')) {
        foreach (getallheaders() as $k => $v) { if (strtolower($k) === 'authorization') { $auth = $v; break; } }
    }
    if (!$auth && isset($_SERVER['HTTP_AUTHORIZATION']))          $auth = $_SERVER['HTTP_AUTHORIZATION'];
    if (!$auth && isset($_SERVER['REDIRECT_HTTP_AUTHORIZATION'])) $auth = $_SERVER['REDIRECT_HTTP_AUTHORIZATION'];
    return trim(str_replace(['Bearer ', 'bearer '], '', $auth));
}
function campayInitGuard($stateDir) {
    $token = campayBearer();
    // (1) Secret admin → accès complet, sans rate-limit ni plafond.
    if ($token !== '' && defined('PAY_API_SECRET') && hash_equals(PAY_API_SECRET, $token)) return 'admin';
    // (2) Jeton public dédié (si configuré).
    $pub = defined('CAMPAY_PUBLIC_INIT') ? (string) CAMPAY_PUBLIC_INIT : '';
    if ($pub === '' || $token === '' || !hash_equals($pub, $token)) {
        http_response_code(401);
        echo json_encode(['error' => 'Authentification requise pour initier un paiement']);
        exit;
    }
    campayInitCheckOrigin();
    campayInitRateLimit($stateDir);
    return 'public';
}
function campayInitCheckOrigin() {
    $allow = defined('CAMPAY_INIT_ALLOWED_ORIGINS') ? trim((string) CAMPAY_INIT_ALLOWED_ORIGINS) : '';
    if ($allow === '') return;   // pas de liste → contrôle d'origine désactivé
    $origin = $_SERVER['HTTP_ORIGIN'] ?? '';
    if ($origin === '' && isset($_SERVER['HTTP_REFERER'])) {
        $p = parse_url($_SERVER['HTTP_REFERER']);
        if ($p && isset($p['scheme'], $p['host'])) {
            $origin = $p['scheme'] . '://' . $p['host'] . (isset($p['port']) ? ':' . $p['port'] : '');
        }
    }
    // En-tête absent (app native / contexte same-origin) → on laisse passer :
    // le rate-limit reste la vraie protection. Un attaquant peut usurper Origin.
    if ($origin === '') return;
    foreach (array_map('trim', explode(',', $allow)) as $o) {
        if ($o !== '' && strcasecmp($o, $origin) === 0) return;
    }
    http_response_code(403);
    echo json_encode(['error' => 'Origine non autorisée']);
    exit;
}
function campayInitRateLimit($stateDir) {
    $max = defined('CAMPAY_INIT_RATE_PER_HOUR') ? (int) CAMPAY_INIT_RATE_PER_HOUR : 10;
    if ($max <= 0) return;   // 0 = rate-limit désactivé
    $ip  = $_SERVER['REMOTE_ADDR'] ?? '0.0.0.0';
    $dir = $stateDir . '_ratelimit/';
    if (!is_dir($dir)) @mkdir($dir, 0750, true);
    $f    = $dir . 'init_' . preg_replace('/[^0-9A-Fa-f:._]/', '_', $ip) . '.json';
    $now  = time();
    $hits = [];
    if (is_file($f)) {
        $prev = json_decode((string) @file_get_contents($f), true);
        if (is_array($prev)) $hits = $prev;
    }
    $hits = array_values(array_filter($hits, function ($t) use ($now) { return ($now - (int) $t) < 3600; }));
    if (count($hits) >= $max) {
        http_response_code(429);
        echo json_encode(['error' => 'Trop de tentatives de paiement. Réessayez dans quelques minutes.']);
        exit;
    }
    $hits[] = $now;
    @file_put_contents($f, json_encode($hits), LOCK_EX);
}

// ════════════════════════════════════════════════════════════
// 0. CONFIG — sonde de capacité PUBLIQUE (aucun secret exposé)
// ════════════════════════════════════════════════════════════
// Permet au frontend de savoir SEUL si l'encaissement automatique est
// réellement opérationnel, au lieu de dépendre d'une case à cocher admin qui
// se désynchronise du serveur. Conséquence voulue : le jour où les vraies
// clés CamPay sont posées dans payment_config.php, le paiement automatique
// s'active de lui-même — sans redéploiement ni intervention dans l'app.
//
// On ne renvoie QUE des booléens et un mode : jamais un identifiant, jamais
// une clé, jamais un jeton.
if ($action === 'config' && ($method === 'GET' || $method === 'POST')) {
    $hasPerm = defined('CAMPAY_PERMANENT_TOKEN') && CAMPAY_PERMANENT_TOKEN !== ''
               && strpos(CAMPAY_PERMANENT_TOKEN, 'À_REMPLIR') === false;
    $hasCred = defined('CAMPAY_USERNAME') && defined('CAMPAY_PASSWORD')
               && CAMPAY_USERNAME !== '' && strpos(CAMPAY_USERNAME, 'À_REMPLIR') === false
               && CAMPAY_PASSWORD !== '' && strpos(CAMPAY_PASSWORD, 'À_REMPLIR') === false;
    $configured = ($hasPerm || $hasCred);
    $base       = campayBase();
    $isDemo     = (stripos($base, 'demo.') !== false);
    $hasPublic  = defined('CAMPAY_PUBLIC_INIT') && CAMPAY_PUBLIC_INIT !== '';

    jsonResp([
        'ok'         => true,
        'configured' => $configured,
        // 'demo' = bac à sable CamPay (aucun débit réel) ; 'live' = production.
        'mode'       => $isDemo ? 'demo' : 'live',
        // Un paiement en libre-service exige AUSSI un jeton public côté serveur.
        'selfService' => ($configured && $hasPublic),
        // Encaissement automatique réellement utilisable par un client final.
        'canCollect' => ($configured && !$isDemo && $hasPublic),
        'operators'  => ['MTN', 'ORANGE'],
        // Message prêt à afficher quand l'automatique n'est pas disponible.
        'reason'     => $configured
            ? ($isDemo
                ? 'CamPay est en mode démonstration (aucun débit réel) — basculez CAMPAY_API_BASE sur la production.'
                : (!$hasPublic
                    ? 'CamPay est configuré mais le jeton public d\'initiation (CAMPAY_PUBLIC_INIT) est absent.'
                    : ''))
            : 'En attente des identifiants CamPay — le paiement manuel reste disponible.',
    ]);
}

// ════════════════════════════════════════════════════════════
// 1. INIT — encaissement (/api/collect/)
// ════════════════════════════════════════════════════════════
if ($action === 'init' && $method === 'POST') {
    $authMode = campayInitGuard($stateDir);   // 'admin' (illimité) OU 'public' (Origin + rate-limit + plafond)
    campayRequireConfig();

    $input     = json_decode(file_get_contents('php://input'), true) ?: [];
    $montant   = intval($input['montant']   ?? 0);          // ER201 : entier obligatoire
    $ref       = trim($input['ref']         ?? '');
    $label     = trim($input['label']       ?? 'Paiement VÉRITAS');
    $intent    = trim($input['intent']      ?? 'generic');
    $targetId  = trim($input['targetId']    ?? '');
    $accountId = trim($input['accountId']   ?? '');
    $clientNom = trim($input['clientNom']   ?? '');
    $clientTel = trim($input['clientTel']   ?? '');

    if ($montant <= 0 || !$ref)  jsonResp(['error' => 'montant et ref requis'], 400);
    if (!$clientTel)             jsonResp(['error' => 'clientTel (numéro MoMo ou Orange du payeur) requis'], 400);

    $payerNumber = campayNormalizePhone($clientTel);
    if (strlen($payerNumber) !== 12) {
        jsonResp(['error' => 'Numéro invalide — format attendu 6XXXXXXXX ou 2376XXXXXXXX (ER101)'], 400);
    }

    // 🔒 Plafond du chemin PUBLIC (self-service visiteur) : borne l'abus si le
    //    jeton public fuite (un visiteur ne peut pas déclencher un encaissement
    //    de montant arbitraire). L'admin (secret) n'est jamais plafonné ici.
    if ($authMode === 'public') {
        $collectMax = defined('CAMPAY_COLLECT_MAX') ? (int) CAMPAY_COLLECT_MAX : 500000;
        if ($collectMax > 0 && $montant > $collectMax) {
            jsonResp(['error' => 'Montant trop élevé pour un paiement en libre-service. Contactez le centre.'], 400);
        }
    }

    // Anti-doublon local : une réf = une transaction.
    $stateFile = $stateDir . _safeRefCampay($ref) . '.json';
    if (file_exists($stateFile)) {
        $existing = json_decode(file_get_contents($stateFile), true) ?: [];
        jsonResp([
            'success' => true, 'ref' => $ref, 'already' => true,
            'reference_id' => $existing['campay_reference'] ?? '',
            'operator'     => $existing['operator'] ?? '',
            'ussd_code'    => $existing['ussd_code'] ?? '',
            'status'       => $existing['status'] ?? 'pending',
            'message'      => 'Transaction déjà initialisée pour cette référence.'
        ]);
    }

    $token = campayGetToken();
    if (!$token) jsonResp(['error' => 'Authentification CamPay échouée — vérifiez CAMPAY_USERNAME / CAMPAY_PASSWORD (ou CAMPAY_PERMANENT_TOKEN)'], 500);

    // UUID4 déterministe dérivé de notre référence lisible (exigence /collect/).
    $extRef = campayExtRef($ref);

    list($http, $resp) = campayApi('POST', '/api/collect/', [
        'amount'             => (string)$montant,
        'currency'           => 'XAF',
        'from'               => $payerNumber,
        'description'        => substr('VERITAS ' . $label, 0, 120),
        'external_reference' => $extRef,
        'external_user'      => $accountId,
    ], $token);

    $data = json_decode((string)$resp, true) ?: [];
    if ($http < 200 || $http >= 300 || empty($data['reference'])) {
        jsonResp([
            'error'  => campayErrorMessage($data, $http),
            'detail' => $data ?: ($resp ?: 'pas de réponse')
        ], 500);
    }

    $state = [
        'ref'                => $ref,
        'external_reference' => $extRef,
        'campay_reference'   => $data['reference'],
        'montant'            => $montant,
        'label'              => $label,
        'intent'             => $intent,
        'targetId'           => $targetId,
        'accountId'          => $accountId,
        'clientNom'          => $clientNom,
        'clientTel'          => $payerNumber,
        'operator'           => strtoupper($data['operator'] ?? ''),
        'ussd_code'          => $data['ussd_code'] ?? '',
        'status'             => 'pending',
        'created_at'         => date('c'),
        'provider'           => 'campay_cm',
        'frais_estimes'      => (int)round($montant * campayFeeRate()),
        'commissions'        => (isset($input['commissions']) && is_array($input['commissions'])) ? $input['commissions'] : []
    ];
    file_put_contents($stateFile, json_encode($state, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));

    // Index inverse : le webhook nous renvoie l'UUID (et la réf CamPay), pas notre réf.
    campayIndex($stateDir, $extRef, $ref, 'collect');
    campayIndex($stateDir, $data['reference'], $ref, 'collect');

    jsonResp([
        'success'      => true,
        'ref'          => $ref,
        'reference_id' => $data['reference'],
        'operator'     => $state['operator'],
        'ussd_code'    => $state['ussd_code'],
        'message'      => 'Demande de paiement envoyée. Le client doit valider sur son téléphone.',
        'instruction'  => 'Un prompt a été envoyé au ' . $payerNumber . '. Validation avec le code secret.'
    ]);
}

// ════════════════════════════════════════════════════════════
// 2. NOTIFY — webhook CamPay (GET ou POST, collect ou withdraw)
// ════════════════════════════════════════════════════════════
if ($action === 'notify') {
    $payload = file_get_contents('php://input');
    $data    = json_decode((string)$payload, true);
    if (!is_array($data) || !$data) { $data = $_GET; $payload = json_encode($data); }

    campayLog($logFile,date('c') . ' | ' . substr((string)$payload, 0, 2000) . "\n");

    // 🔐 Signature JWT (HS256, webhook key de l'app). Si une clé est configurée,
    //    une signature absente ou invalide fait rejeter la notification.
    $sigOk = campayCheckSignature($data['signature'] ?? '');
    if ($sigOk === false) {
        campayLog($logFile,date('c') . " [REJECTED_BAD_SIGNATURE]\n");
        http_response_code(403); echo 'signature invalide'; exit;
    }

    $kind = strtolower(trim((string)($data['endpoint'] ?? 'collect')));   // collect | withdraw

    // Retrouver NOTRE référence : via l'index (external_reference ou réf CamPay).
    $ourRef = campayResolveRef($stateDir, [
        (string)($data['external_reference'] ?? ''),
        (string)($data['reference'] ?? '')
    ]);
    if (!$ourRef) { http_response_code(404); echo 'ref inconnue'; exit; }

    // ── Cas VERSEMENT : confirmation d'un payout ───────────────────────────
    if ($kind === 'withdraw') {
        $outFile = $stateDir . _safePayoutCampay($ourRef) . '.json';
        if (!file_exists($outFile)) { http_response_code(404); echo 'payout inconnu'; exit; }
        $out = json_decode(file_get_contents($outFile), true) ?: [];
        $st  = strtoupper((string)($data['status'] ?? ''));
        $out['provider_status'] = $st;
        $out['notified_at']     = date('c');
        if ($st === 'SUCCESSFUL')      { $out['status'] = 'sent';   $out['sent_at']   = date('c'); }
        elseif ($st === 'FAILED')      { $out['status'] = 'failed'; $out['failed_at'] = date('c');
                                         $out['reason'] = $data['reason'] ?? 'Refusé par l\'opérateur'; }
        file_put_contents($outFile, json_encode($out, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));
        http_response_code(200); echo 'OK'; exit;
    }

    // ── Cas ENCAISSEMENT ───────────────────────────────────────────────────
    $stateFile = $stateDir . _safeRefCampay($ourRef) . '.json';
    if (!file_exists($stateFile)) { http_response_code(404); echo 'ref inconnue'; exit; }

    $state = json_decode(file_get_contents($stateFile), true) ?: [];
    $state['notified_at'] = date('c');
    $state['raw_webhook'] = $data;

    // Le payload n'est jamais l'autorité : on relit le statut chez CamPay.
    $verified = campayVerifyTransaction($state);
    if ($verified === null) {
        campayLog($logFile,date('c') . " [UNVERIFIED_NO_AUTH_STATUS] ref=$ourRef\n");
        file_put_contents($stateFile, json_encode($state, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));
        http_response_code(202); echo 'unverifiable'; exit;
    }

    $state = campayApplyVerified($state, $verified, $logFile, $ourRef);
    file_put_contents($stateFile, json_encode($state, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));
    campayGrant($state, $logFile, $ourRef);

    http_response_code(200); echo 'OK'; exit;
}

// ════════════════════════════════════════════════════════════
// 3. STATUS — polling frontend
// ════════════════════════════════════════════════════════════
if ($action === 'status' && $method === 'GET') {
    $ref = trim($_GET['ref'] ?? '');
    if (!$ref) jsonResp(['error' => 'ref requise'], 400);

    $stateFile = $stateDir . _safeRefCampay($ref) . '.json';
    if (!file_exists($stateFile)) jsonResp(['status' => 'unknown', 'ref' => $ref]);

    $state = json_decode(file_get_contents($stateFile), true) ?: [];
    $age   = time() - strtotime($state['created_at'] ?? 'now');
    if (($state['status'] ?? '') === 'pending' && $age > 10) {
        $verified = campayVerifyTransaction($state);
        if ($verified !== null) {
            $state = campayApplyVerified($state, $verified, $logFile, $ref);
            file_put_contents($stateFile, json_encode($state, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));
            campayGrant($state, $logFile, $ref);
        }
    }

    jsonResp([
        'ref'             => $ref,
        'status'          => $state['status'] ?? 'pending',
        'paid_at'         => $state['paid_at'] ?? null,
        'failed_at'       => $state['failed_at'] ?? null,
        'provider_status' => $state['provider_status'] ?? null,
        'operator'        => $state['operator'] ?? null,
        'intent'          => $state['intent'] ?? 'generic',
        'targetId'        => $state['targetId'] ?? null,
        'accountId'       => $state['accountId'] ?? null,
        'reason'          => $state['reason'] ?? null
    ]);
}

// ════════════════════════════════════════════════════════════
// 4. LIST — encaissements + totaux comptables
// ════════════════════════════════════════════════════════════
if ($action === 'list' && $method === 'GET') {
    requirePayAuth();
    $payments = campayCollectStates($stateDir, 'campay_cm');
    $brut = 0; $net = 0; $frais = 0;
    foreach ($payments as $p) {
        if (($p['status'] ?? '') !== 'paid') continue;
        $m = intval($p['montant_paye'] ?? $p['montant'] ?? 0);
        $f = intval($p['frais'] ?? $p['frais_estimes'] ?? 0);
        $brut += $m; $frais += $f; $net += intval($p['net_encaisse'] ?? ($m - $f));
    }
    jsonResp([
        'count'    => count($payments),
        'totaux'   => ['brut_paye' => $brut, 'frais' => $frais, 'net_encaisse' => $net],
        'payments' => $payments
    ]);
}

// ════════════════════════════════════════════════════════════
// 5. WITHDRAW — versement à UN bénéficiaire (/api/withdraw/)
// ════════════════════════════════════════════════════════════
if ($action === 'withdraw' && $method === 'POST') {
    requirePayAuth();
    campayRequireConfig();

    $input        = json_decode(file_get_contents('php://input'), true) ?: [];
    $montant      = intval($input['montant']    ?? 0);
    $to           = campayNormalizePhone(trim($input['to'] ?? ''));
    $ref          = trim($input['ref']          ?? '');
    $partenaireId = trim($input['partenaireId'] ?? '');
    $note         = trim($input['note']         ?? 'Versement partenaire VÉRITAS');
    $attendu      = trim($input['nomAttendu']   ?? '');   // contrôle optionnel du titulaire

    if ($montant <= 0)       jsonResp(['error' => 'montant requis (entier, ER201)'], 400);
    if (!$ref)               jsonResp(['error' => 'ref requise (idempotence)'], 400);
    if (strlen($to) !== 12)  jsonResp(['error' => 'Numéro destinataire invalide (ER101)'], 400);

    $plafond = defined('CAMPAY_PAYOUT_MAX') ? (int)CAMPAY_PAYOUT_MAX : 200000;
    if ($montant > $plafond) {
        jsonResp(['error' => 'Montant supérieur au plafond de versement (' . $plafond . ' FCFA). Modifiez CAMPAY_PAYOUT_MAX si volontaire.'], 400);
    }

    // 🔒 Idempotence locale : jamais deux envois pour une même réf.
    $outFile = $stateDir . _safePayoutCampay($ref) . '.json';
    if (file_exists($outFile)) {
        $existing = json_decode(file_get_contents($outFile), true) ?: [];
        jsonResp(['success' => true, 'already' => true, 'ref' => $ref,
                  'status' => $existing['status'] ?? 'pending',
                  'message' => 'Versement déjà émis pour cette référence (aucun double envoi).']);
    }

    $token = campayGetToken();
    if (!$token) jsonResp(['error' => 'Authentification CamPay échouée'], 500);

    // Contrôle du titulaire avant d'envoyer l'argent (évite le « numéro inexistant »).
    $titulaire = campayHolderName($to, $token);
    if ($attendu !== '' && $titulaire !== null && !campayNamesMatch($attendu, $titulaire)) {
        jsonResp(['error' => 'Le numéro appartient à « ' . $titulaire .' », pas à « ' . $attendu . ' ». Versement annulé.',
                  'holder' => $titulaire], 409);
    }

    list($http, $resp) = campayApi('POST', '/api/withdraw/', [
        'amount'             => (string)$montant,
        'to'                 => $to,
        'description'        => substr($note, 0, 120),
        'external_reference' => $ref,
    ], $token);

    $data = json_decode((string)$resp, true) ?: [];
    if ($http < 200 || $http >= 300 || empty($data['reference'])) {
        jsonResp(['error' => campayErrorMessage($data, $http), 'detail' => $data ?: $resp], 500);
    }

    $out = [
        'ref'              => $ref,
        'campay_reference' => $data['reference'],
        'montant'          => $montant,
        'to'               => $to,
        'titulaire'        => $titulaire,
        'partenaireId'     => $partenaireId,
        'note'             => $note,
        'status'           => 'pending',
        'provider_status'  => strtoupper($data['status'] ?? 'PENDING'),
        'created_at'       => date('c'),
        'provider'         => 'campay_payout_cm'
    ];
    file_put_contents($outFile, json_encode($out, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));
    campayIndex($stateDir, $ref, $ref, 'withdraw');
    campayIndex($stateDir, $data['reference'], $ref, 'withdraw');
    campayLog($logFile,date('c') . " [PAYOUT] ref=$ref to=$to montant=$montant\n");

    jsonResp(['success' => true, 'ref' => $ref, 'reference_id' => $data['reference'],
              'titulaire' => $titulaire,
              'message' => 'Versement émis. Confirmation par webhook ou via ?action=payouts.']);
}

// ════════════════════════════════════════════════════════════
// 6. MASS PAYOUT — N bénéficiaires en UN appel (/api/mass_payout/)
// ════════════════════════════════════════════════════════════
if ($action === 'masspayout' && $method === 'POST') {
    requirePayAuth();
    campayRequireConfig();

    $input   = json_decode(file_get_contents('php://input'), true) ?: [];
    $mpRef   = trim($input['ref']     ?? '');
    $comment = trim($input['comment'] ?? 'Versements VÉRITAS');
    $lignes  = (isset($input['lignes']) && is_array($input['lignes'])) ? $input['lignes'] : [];

    if (!$mpRef)   jsonResp(['error' => 'ref du lot requise (idempotence)'], 400);
    if (!$lignes)  jsonResp(['error' => 'aucune ligne de versement'], 400);

    $mpFile = $stateDir . _safeMassCampay($mpRef) . '.json';
    if (file_exists($mpFile)) {
        $ex = json_decode(file_get_contents($mpFile), true) ?: [];
        jsonResp(['success' => true, 'already' => true, 'ref' => $mpRef,
                  'status' => $ex['status'] ?? 'pending',
                  'message' => 'Lot déjà envoyé (aucun double versement).']);
    }

    $plafond   = defined('CAMPAY_PAYOUT_MAX') ? (int)CAMPAY_PAYOUT_MAX : 200000;
    $plafondLot= defined('CAMPAY_MASSPAYOUT_MAX') ? (int)CAMPAY_MASSPAYOUT_MAX : 2000000;
    $details = []; $total = 0; $meta = [];
    foreach ($lignes as $l) {
        $m  = intval($l['montant'] ?? 0);
        $to = campayNormalizePhone(trim($l['to'] ?? ''));
        $r  = trim($l['ref'] ?? '');
        if ($m <= 0 || strlen($to) !== 12 || !$r) {
            jsonResp(['error' => 'Ligne invalide (montant entier, numéro 2376XXXXXXXX, ref) : ' . json_encode($l)], 400);
        }
        if ($m > $plafond) jsonResp(['error' => 'Ligne au-dessus du plafond unitaire (' . $plafond . ' FCFA) : ' . $r], 400);
        $total += $m;
        $details[] = [
            'phone_number'       => $to,
            'amount'             => (string)$m,
            'description'        => substr(trim($l['note'] ?? $comment), 0, 120),
            'external_reference' => $r,
        ];
        $meta[$r] = ['montant' => $m, 'to' => $to, 'partenaireId' => trim($l['partenaireId'] ?? '')];
    }
    if ($total > $plafondLot) {
        jsonResp(['error' => 'Total du lot (' . $total . ') supérieur au plafond CAMPAY_MASSPAYOUT_MAX (' . $plafondLot . ')'], 400);
    }

    $token = campayGetToken();
    if (!$token) jsonResp(['error' => 'Authentification CamPay échouée'], 500);

    list($http, $resp) = campayApi('POST', '/api/mass_payout/', [
        'comment'      => substr($comment, 0, 120),
        'mp_reference' => $mpRef,
        'details'      => $details,
    ], $token);

    $data = json_decode((string)$resp, true) ?: [];
    if ($http < 200 || $http >= 300 || empty($data['reference'])) {
        jsonResp(['error' => campayErrorMessage($data, $http), 'detail' => $data ?: $resp], 500);
    }

    $mp = [
        'ref'              => $mpRef,
        'campay_reference' => $data['reference'],
        'comment'          => $comment,
        'total'            => $total,
        'nb'               => count($details),
        'meta'             => $meta,
        'status'           => 'pending',
        'provider_status'  => strtoupper($data['status'] ?? 'PENDING'),
        'created_at'       => date('c'),
        'provider'         => 'campay_masspayout_cm'
    ];
    file_put_contents($mpFile, json_encode($mp, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));
    campayLog($logFile,date('c') . " [MASSPAYOUT] ref=$mpRef nb=" . count($details) . " total=$total\n");

    jsonResp(['success' => true, 'ref' => $mpRef, 'reference_id' => $data['reference'],
              'nb' => count($details), 'total' => $total,
              'message' => count($details) . ' versement(s) envoyé(s) en un appel.']);
}

// ════════════════════════════════════════════════════════════
// 7. MASS PAYOUT STATUS — détail ligne par ligne
// ════════════════════════════════════════════════════════════
if ($action === 'masspayout_status' && $method === 'GET') {
    requirePayAuth();
    $mpRef = trim($_GET['ref'] ?? '');
    if (!$mpRef) jsonResp(['error' => 'ref requise'], 400);
    $mpFile = $stateDir . _safeMassCampay($mpRef) . '.json';
    if (!file_exists($mpFile)) jsonResp(['error' => 'lot inconnu'], 404);

    $mp    = json_decode(file_get_contents($mpFile), true) ?: [];
    $token = campayGetToken();
    if (!$token) jsonResp(['error' => 'Authentification CamPay échouée'], 500);

    list($http, $resp) = campayApi('GET', '/api/mass_payout_status/' . rawurlencode($mp['campay_reference']) . '/', null, $token);
    if ($http !== 200) jsonResp(['error' => 'CamPay HTTP ' . $http, 'detail' => $resp], 500);

    $d = json_decode((string)$resp, true) ?: [];
    $mp['provider_status'] = strtoupper($d['status'] ?? '');
    if ($mp['provider_status'] === 'COMPLETED') $mp['status'] = 'complete';

    // Ventilation ligne par ligne, dans le vocabulaire du client VÉRITAS.
    $lignes = [];
    foreach (($d['details'] ?? []) as $it) {
        $tx  = $it['transaction'] ?? [];
        $r   = (string)($tx['external_reference'] ?? $it['external_reference'] ?? '');
        $st  = strtoupper($tx['status'] ?? '');
        $lignes[] = [
            'ref'          => $r,
            'to'           => $it['phone_number'] ?? '',
            'montant'      => intval($mp['meta'][$r]['montant'] ?? 0),
            'partenaireId' => $mp['meta'][$r]['partenaireId'] ?? '',
            'status'       => ($st === 'SUCCESSFUL') ? 'sent' : (($st === 'FAILED') ? 'failed' : 'pending'),
            'operator'     => $tx['operator'] ?? '',
            'reason'       => $tx['reason'] ?? '',
        ];
    }
    $mp['lignes'] = $lignes;
    file_put_contents($mpFile, json_encode($mp, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));

    jsonResp(['ref' => $mpRef, 'status' => $mp['status'], 'provider_status' => $mp['provider_status'],
              'nb' => $mp['nb'], 'total' => $mp['total'], 'lignes' => $lignes]);
}

// ════════════════════════════════════════════════════════════
// 8. PAYOUTS — liste + rafraîchissement des versements unitaires
// ════════════════════════════════════════════════════════════
if ($action === 'payouts' && $method === 'GET') {
    requirePayAuth();
    $token   = campayGetToken();
    $payouts = campayCollectStates($stateDir, 'campay_payout_cm');
    foreach ($payouts as $i => $p) {
        if (($p['status'] ?? '') !== 'pending' || !$token || empty($p['campay_reference'])) continue;
        list($h, $r) = campayApi('GET', '/api/transaction/' . rawurlencode($p['campay_reference']) . '/', null, $token);
        if ($h !== 200) continue;
        $d  = json_decode((string)$r, true) ?: [];
        $st = strtoupper($d['status'] ?? '');
        if ($st === 'SUCCESSFUL')                                        { $p['status'] = 'sent';   $p['sent_at']   = date('c'); }
        elseif (in_array($st, ['FAILED', 'CANCELLED', 'EXPIRED'], true)) { $p['status'] = 'failed'; $p['failed_at'] = date('c');
                                                                           $p['reason'] = $d['reason'] ?? ''; }
        $p['provider_status'] = $st;
        file_put_contents($stateDir . _safePayoutCampay($p['ref']) . '.json', json_encode($p, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));
        $payouts[$i] = $p;
    }
    jsonResp(['count' => count($payouts), 'payouts' => $payouts]);
}

// ════════════════════════════════════════════════════════════
// 9. BALANCE — solde global ET par opérateur (ER301)
// ════════════════════════════════════════════════════════════
if ($action === 'balance' && $method === 'GET') {
    requirePayAuth();
    campayRequireConfig();
    $token = campayGetToken();
    if (!$token) jsonResp(['error' => 'Authentification CamPay échouée'], 500);
    list($http, $resp) = campayApi('GET', '/api/balance/', null, $token);
    if ($http !== 200) jsonResp(['error' => 'CamPay balance HTTP ' . $http, 'detail' => $resp], 500);
    $b = json_decode((string)$resp, true) ?: [];
    $b['_note'] = 'Les retraits puisent dans le solde de l\'opérateur du bénéficiaire (ER301) : '
                . 'payer un partenaire Orange exige un solde Orange suffisant.';
    jsonResp($b);
}

// ════════════════════════════════════════════════════════════
// 10. HISTORY — relevé CamPay avec frais RÉELS (comptabilité)
// ════════════════════════════════════════════════════════════
if ($action === 'history' && $method === 'GET') {
    requirePayAuth();
    campayRequireConfig();
    $start = trim($_GET['start'] ?? date('Y-m-01'));
    $end   = trim($_GET['end']   ?? date('Y-m-d'));
    if (!preg_match('/^\d{4}-\d{2}-\d{2}$/', $start) || !preg_match('/^\d{4}-\d{2}-\d{2}$/', $end)) {
        jsonResp(['error' => 'Dates attendues au format YYYY-MM-DD'], 400);
    }
    $token = campayGetToken();
    if (!$token) jsonResp(['error' => 'Authentification CamPay échouée'], 500);

    list($http, $resp) = campayApi('POST', '/api/history/', ['start_date' => $start, 'end_date' => $end], $token);
    if ($http !== 200) jsonResp(['error' => 'CamPay history HTTP ' . $http, 'detail' => $resp], 500);

    $d = json_decode((string)$resp, true) ?: [];
    $rows = $d['data'] ?? [];
    $encaisse = 0.0; $frais = 0.0; $verse = 0.0;
    foreach ($rows as $t) {
        if (strtoupper($t['status'] ?? '') !== 'SUCCESSFUL') continue;
        $frais    += (float)($t['charge_amount'] ?? 0);
        $encaisse += (float)($t['credit'] ?? 0);
        $verse    += (float)($t['debit']  ?? 0);
    }
    jsonResp([
        'periode' => ['start' => $start, 'end' => $end],
        'totaux'  => [
            'credite_net' => round($encaisse, 2),   // ce qui est réellement entré
            'debite'      => round($verse, 2),      // versements sortants
            'frais_reels' => round($frais, 2)
        ],
        'count' => count($rows),
        'data'  => $rows
    ]);
}

// ════════════════════════════════════════════════════════════
// 11. HOLDER — nom du titulaire d'un numéro (avant de payer)
// ════════════════════════════════════════════════════════════
if ($action === 'holder' && $method === 'GET') {
    requirePayAuth();
    campayRequireConfig();
    $tel = campayNormalizePhone(trim($_GET['tel'] ?? ''));
    if (strlen($tel) !== 12) jsonResp(['error' => 'Numéro invalide (ER101)'], 400);
    $token = campayGetToken();
    if (!$token) jsonResp(['error' => 'Authentification CamPay échouée'], 500);
    $nom = campayHolderName($tel, $token);
    jsonResp(['tel' => $tel, 'full_name' => $nom, 'found' => ($nom !== null)]);
}

jsonResp(['error' => 'Action inconnue',
          'allowed' => ['init','notify','status','list','withdraw','masspayout',
                        'masspayout_status','payouts','balance','history','holder']], 400);

// ════════════════════════════════════════════════════════════
// HELPERS
// ════════════════════════════════════════════════════════════
function jsonResp($data, $code = 200) {
    http_response_code($code);
    echo json_encode($data, JSON_UNESCAPED_UNICODE);
    exit;
}

function campayRequireConfig() {
    $hasPerm = defined('CAMPAY_PERMANENT_TOKEN') && CAMPAY_PERMANENT_TOKEN !== '' && strpos(CAMPAY_PERMANENT_TOKEN, 'À_REMPLIR') === false;
    $hasCred = defined('CAMPAY_USERNAME') && defined('CAMPAY_PASSWORD')
               && CAMPAY_USERNAME !== '' && strpos(CAMPAY_USERNAME, 'À_REMPLIR') === false;
    if (!$hasPerm && !$hasCred) {
        // Message DESTINÉ AU CLIENT FINAL : il ne doit ni l'inquiéter ni le
        // laisser sans issue. Le détail technique part dans le journal, pas à
        // l'écran (et surtout pas le nom des constantes, dépôt public).
        @file_put_contents(__DIR__ . '/data/_security_log.txt',
            date('c') . " [CAMPAY_NOT_CONFIGURED] identifiants absents — renseignez CAMPAY_USERNAME/CAMPAY_PASSWORD"
            . " (ou CAMPAY_PERMANENT_TOKEN) dans api/payment_config.php\n", FILE_APPEND);
        jsonResp([
            'error'      => 'Le paiement automatique n\'est pas encore activé. Utilisez MTN MoMo, Orange Money ou le virement ci-dessous : votre accès sera validé par le centre.',
            'code'       => 'CAMPAY_NOT_CONFIGURED',
            'fallback'   => 'manual',
        ], 503);
    }
}

function campayBase()    { return defined('CAMPAY_API_BASE') ? rtrim(CAMPAY_API_BASE, '/') : 'https://demo.campay.net'; }
function campayFeeRate() { return defined('CAMPAY_FEE_RATE') ? (float)CAMPAY_FEE_RATE : 0.02; }

function _safeRefCampay($ref)    { return 'campay_'    . preg_replace('/[^a-zA-Z0-9_\-]/', '_', (string)$ref); }
function _safePayoutCampay($ref) { return 'campayout_' . preg_replace('/[^a-zA-Z0-9_\-]/', '_', (string)$ref); }
function _safeMassCampay($ref)   { return 'campaymp_'  . preg_replace('/[^a-zA-Z0-9_\-]/', '_', (string)$ref); }

// 6XXXXXXXX → 2376XXXXXXXX (ER101 : indicatif pays obligatoire)
function campayNormalizePhone($tel) {
    $n = preg_replace('/[^0-9]/', '', (string)$tel);
    if (strlen($n) === 9 && strpos($n, '237') !== 0) $n = '237' . $n;
    return $n;
}

// UUID4 DÉTERMINISTE dérivé de notre référence lisible.
// /collect/ exige un UUID4 unique ; nos réfs (VT260721-AB12) n'en sont pas.
// Déterministe = la même réf redonne le même UUID → idempotence préservée.
function campayExtRef($ref) {
    $h = md5('VERITAS-CAMPAY|' . $ref);
    return substr($h, 0, 8) . '-' . substr($h, 8, 4) . '-4' . substr($h, 13, 3) . '-'
         . dechex((hexdec($h[16]) & 0x3) | 0x8) . substr($h, 17, 3) . '-' . substr($h, 20, 12);
}

// Index inverse : référence externe/CamPay → notre référence VÉRITAS.
function campayIndex($stateDir, $key, $ourRef, $kind) {
    if (!$key) return;
    $f = $stateDir . '_campayidx_' . preg_replace('/[^a-zA-Z0-9_\-]/', '_', (string)$key) . '.json';
    @file_put_contents($f, json_encode(['ref' => $ourRef, 'kind' => $kind, 'at' => date('c')]));
}

function campayResolveRef($stateDir, array $candidats) {
    foreach ($candidats as $k) {
        if (!$k) continue;
        $f = $stateDir . '_campayidx_' . preg_replace('/[^a-zA-Z0-9_\-]/', '_', $k) . '.json';
        if (is_file($f)) {
            $d = json_decode((string)file_get_contents($f), true);
            if (is_array($d) && !empty($d['ref'])) return $d['ref'];
        }
        // Repli : la valeur est peut-être déjà notre référence.
        if (is_file($stateDir . _safeRefCampay($k) . '.json'))    return $k;
        if (is_file($stateDir . _safePayoutCampay($k) . '.json')) return $k;
    }
    return null;
}

// Vérifie la signature JWT (HS256) du webhook avec la webhook key de l'app.
// true = valide · false = invalide (rejeter) · null = pas de clé configurée.
function campayCheckSignature($jwt) {
    if (!defined('CAMPAY_WEBHOOK_KEY') || CAMPAY_WEBHOOK_KEY === ''
        || strpos(CAMPAY_WEBHOOK_KEY, 'À_REMPLIR') !== false) {
        return null;                       // clé non configurée → contrôle désactivé
    }
    $jwt = (string)$jwt;
    $parts = explode('.', $jwt);
    if (count($parts) !== 3) return false;
    list($h64, $p64, $s64) = $parts;
    $b64url = function ($s) { return rtrim(strtr(base64_encode($s), '+/', '-_'), '='); };
    $attendu = $b64url(hash_hmac('sha256', $h64 . '.' . $p64, CAMPAY_WEBHOOK_KEY, true));
    return hash_equals($attendu, $s64);
}

function campayApi($method, $path, $body, $token) {
    $ch = curl_init(campayBase() . $path);
    $headers = ['Content-Type: application/json', 'Accept: application/json'];
    if ($token) $headers[] = 'Authorization: Token ' . $token;
    $opts = [
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_HTTPHEADER     => $headers,
        CURLOPT_TIMEOUT        => 30,
        CURLOPT_SSL_VERIFYPEER => true,
        CURLOPT_SSL_VERIFYHOST => 2,
    ];
    if ($method === 'POST') {
        $opts[CURLOPT_POST]       = true;
        $opts[CURLOPT_POSTFIELDS] = json_encode($body ?: []);
    } elseif ($method !== 'GET') {
        $opts[CURLOPT_CUSTOMREQUEST] = $method;
        if ($body !== null) $opts[CURLOPT_POSTFIELDS] = json_encode($body);
    }
    curl_setopt_array($ch, $opts);
    $resp = curl_exec($ch);
    $http = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    $err  = curl_error($ch);
    curl_close($ch);
    if ($resp === false) { error_log('[CamPay] curl ' . $path . ' — ' . $err); return [0, null]; }
    return [$http, $resp];
}

// Traduit les codes d'erreur documentés en messages exploitables par l'admin.
function campayErrorMessage($data, $http) {
    $code = '';
    if (is_array($data)) {
        $code = (string)($data['error_code'] ?? $data['code'] ?? '');
        if (!$code && isset($data['message']) && preg_match('/ER\d{3}/', (string)$data['message'], $m)) $code = $m[0];
    }
    $table = [
        'ER101' => 'Numéro invalide — il doit commencer par l\'indicatif pays (237XXXXXXXXX).',
        'ER102' => 'Opérateur non pris en charge — seuls MTN et Orange sont acceptés.',
        'ER201' => 'Montant invalide — les décimales sont interdites, envoyez un entier.',
        'ER301' => 'Solde insuffisant sur cet opérateur — vérifiez le solde MTN/Orange séparément.',
    ];
    if ($code && isset($table[$code])) return $table[$code] . ' (' . $code . ')';
    $msg = is_array($data) ? ($data['message'] ?? ($data['detail'] ?? '')) : '';
    return 'CamPay erreur HTTP ' . $http . ($msg ? ' — ' . $msg : '');
}

function campayGetToken() {
    if (defined('CAMPAY_PERMANENT_TOKEN') && CAMPAY_PERMANENT_TOKEN !== ''
        && strpos(CAMPAY_PERMANENT_TOKEN, 'À_REMPLIR') === false) {
        return CAMPAY_PERMANENT_TOKEN;
    }
    if (!defined('CAMPAY_USERNAME') || !defined('CAMPAY_PASSWORD')
        || CAMPAY_USERNAME === '' || strpos(CAMPAY_USERNAME, 'À_REMPLIR') !== false) {
        error_log('[CamPay] identifiants absents de payment_config.php');
        return null;
    }
    $cacheFile = __DIR__ . '/data/payments/_campay_token.json';
    if (file_exists($cacheFile)) {
        $cache = json_decode(file_get_contents($cacheFile), true);
        // Le token expire en 3600 s (doc) → on renouvelle à 3300 s.
        if ($cache && (time() - ($cache['t'] ?? 0)) < 3300) return $cache['token'];
    }
    list($http, $resp) = campayApi('POST', '/api/token/', [
        'username' => CAMPAY_USERNAME, 'password' => CAMPAY_PASSWORD,
    ], null);
    if ($http !== 200) { error_log('[CamPay token] HTTP ' . $http . ' — ' . substr((string)$resp, 0, 300)); return null; }
    $data  = json_decode((string)$resp, true) ?: [];
    $token = $data['token'] ?? null;
    if ($token) @file_put_contents($cacheFile, json_encode(['token' => $token, 't' => time()]));
    return $token;
}

function campayVerifyTransaction($state) {
    if (empty($state['campay_reference'])) return null;
    $token = campayGetToken();
    if (!$token) return null;
    list($http, $resp) = campayApi('GET', '/api/transaction/' . rawurlencode($state['campay_reference']) . '/', null, $token);
    if ($http !== 200) return null;
    $d = json_decode((string)$resp, true);
    return is_array($d) ? $d : null;
}

function campayApplyVerified($state, $verified, $logFile, $ref) {
    $st = strtoupper($verified['status'] ?? '');
    $state['provider_status']    = $st;
    $state['operator']           = strtoupper($verified['operator'] ?? ($state['operator'] ?? ''));
    $state['operator_reference'] = $verified['operator_reference'] ?? ($state['operator_reference'] ?? '');
    $state['campay_code']        = $verified['code'] ?? ($state['campay_code'] ?? '');
    if (isset($verified['reason']) && $verified['reason'] !== '') $state['reason'] = $verified['reason'];

    if ($st === 'SUCCESSFUL') {
        // 🔐 Un encaissement partiel n'ouvre JAMAIS l'accès.
        $paye    = (int)round((float)($verified['amount'] ?? 0));
        $attendu = (int)($state['montant'] ?? 0);
        if ($paye > 0 && $paye < $attendu) {
            $state['status'] = 'underpaid';
            $state['reason'] = 'Montant encaissé (' . $paye . ') inférieur au montant attendu (' . $attendu . ')';
            campayLog($logFile,date('c') . " [AMOUNT_MISMATCH] ref=$ref paye=$paye attendu=$attendu\n");
            return $state;
        }
        $state['status']       = 'paid';
        $state['paid_at']      = date('c');
        $state['montant_paye'] = $paye ?: $attendu;
        // Frais réels si CamPay les renvoie (charge_amount), sinon estimation.
        $frais = isset($verified['charge_amount']) ? (int)round((float)$verified['charge_amount'])
               : (int)round($state['montant_paye'] * campayFeeRate());
        $state['frais']        = $frais;
        $state['net_encaisse'] = max(0, $state['montant_paye'] - $frais);
    } elseif (in_array($st, ['FAILED', 'REJECTED', 'CANCELLED', 'CANCELED', 'EXPIRED', 'TIMEOUT'], true)) {
        $state['status']    = 'failed';
        $state['failed_at'] = date('c');
        $state['reason']    = $state['reason'] ?? 'Refusé par le payeur ou expiration';
    }
    return $state;
}

function campayGrant($state, $logFile, $ref) {
    if (($state['status'] ?? '') !== 'paid') return;
    try {
        $g = vrt_grant_entitlement_to_file($state);
        campayLog($logFile,date('c') . ' [GRANT] ref=' . $ref . ' ' . json_encode($g) . "\n");
    } catch (\Throwable $e) {
        campayLog($logFile,date('c') . ' [GRANT_ERR] ref=' . $ref . ' ' . $e->getMessage() . "\n");
    }
}

// Nom du titulaire d'un numéro (/api/holder_info/). null si introuvable.
function campayHolderName($tel, $token) {
    list($http, $resp) = campayApi('GET', '/api/holder_info/?phone_number=' . rawurlencode($tel), null, $token);
    if ($http !== 200) return null;
    $d = json_decode((string)$resp, true) ?: [];
    $n = trim((string)($d['full_name'] ?? ''));
    return $n !== '' ? $n : null;
}

// Comparaison tolérante (casse, accents, ordre des mots, initiales).
function campayNamesMatch($a, $b) {
    $norm = function ($s) {
        $s = strtolower(trim((string)$s));
        $s = strtr($s, ['à'=>'a','â'=>'a','ä'=>'a','é'=>'e','è'=>'e','ê'=>'e','ë'=>'e',
                        'î'=>'i','ï'=>'i','ô'=>'o','ö'=>'o','ù'=>'u','û'=>'u','ü'=>'u','ç'=>'c']);
        $s = preg_replace('/[^a-z0-9 ]/', ' ', $s);
        $mots = array_values(array_filter(explode(' ', $s), function ($m) { return strlen($m) > 1; }));
        sort($mots);
        return $mots;
    };
    $ma = $norm($a); $mb = $norm($b);
    if (!$ma || !$mb) return true;                       // rien à comparer → on laisse passer
    return count(array_intersect($ma, $mb)) > 0;         // au moins un mot en commun
}

function campayCollectStates($stateDir, $provider) {
    $files = glob($stateDir . '*.json') ?: [];
    $out = [];
    foreach ($files as $f) {
        if (basename($f)[0] === '_') continue;
        $p = json_decode((string)file_get_contents($f), true);
        if (is_array($p) && ($p['provider'] ?? '') === $provider) $out[] = $p;
    }
    usort($out, function ($a, $b) { return strcmp($b['created_at'] ?? '', $a['created_at'] ?? ''); });
    return $out;
}
