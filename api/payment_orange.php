<?php
// ============================================================
// VÉRITAS — Intégration Orange Money WebPayment (Cameroun)
// © 2024-2026 Jacques Miterand TAKOU (Mythe Errant). Tous droits réservés.
// Œuvre protégée — Loi n° 2000/011 + Convention de Berne.
// Reproduction interdite sans accord écrit. Contrefaçon : 5-10 ans prison +
// 500 000 à 10 000 000 FCFA d'amende. contact@veritas-school.com
// ──────────────────────────────────────────────────────────
// Endpoints:
//   POST /api/payment_orange.php?action=init    → Initialise un paiement, retourne payment_url
//   POST /api/payment_orange.php?action=notify  → Webhook reçu d'Orange (signature)
//   GET  /api/payment_orange.php?action=status  → Vérifie le statut d'un paiement
//   GET  /api/payment_orange.php?action=return  → Page de retour après paiement
//
// Documentation Orange: https://developer.orange.com/apis/om-webpay-cm/
// ============================================================

require_once __DIR__ . '/payment_config.php';
require_once __DIR__ . '/_auth_lib.php'; // Étape 1 : octroi d'accès côté serveur

// ── CORS (déjà géré par payment_config.php) ──
header('Content-Type: application/json; charset=utf-8');

$action = $_GET['action'] ?? 'init';
$method = $_SERVER['REQUEST_METHOD'];

// Dossier d'état des paiements (fichier plat, pas de MySQL requis)
$stateDir = __DIR__ . '/data/payments/';
if (!is_dir($stateDir)) mkdir($stateDir, 0755, true);

// ────────────────────────────────────────────────────────────
// 1. INITIALISER UN PAIEMENT
// ────────────────────────────────────────────────────────────
if ($action === 'init' && $method === 'POST') {
    requirePayAuth();

    $input = json_decode(file_get_contents('php://input'), true) ?: [];
    $montant = intval($input['montant'] ?? 0);
    $ref     = trim($input['ref']     ?? '');
    $label   = trim($input['label']   ?? 'Paiement VÉRITAS');
    $intent  = trim($input['intent']  ?? 'generic');
    $targetId= trim($input['targetId']?? '');
    $accountId=trim($input['accountId']?? '');
    $clientNom=trim($input['clientNom']?? '');
    $clientTel=trim($input['clientTel']?? '');

    if ($montant <= 0 || !$ref) {
        jsonResp(['error' => 'montant et ref requis'], 400);
    }

    // 1.1 OAuth — obtenir un token Orange
    $token = orangeGetAuthToken();
    if (!$token) jsonResp(['error' => 'OAuth Orange échoué — vérifiez ORANGE_CLIENT_ID / ORANGE_CLIENT_SECRET'], 500);

    // 1.2 Créer le paiement WebPayment
    $payload = [
        'merchant_key' => ORANGE_MERCHANT_KEY,
        'currency'     => ORANGE_CURRENCY,           // 'XAF' en prod, 'OUV' en sandbox
        'order_id'     => $ref,
        'amount'       => (string)$montant,
        'return_url'   => PUBLIC_BASE_URL . '/api/payment_orange.php?action=return&ref=' . urlencode($ref),
        'cancel_url'   => PUBLIC_BASE_URL . '/api/payment_orange.php?action=cancel&ref=' . urlencode($ref),
        'notif_url'    => PUBLIC_BASE_URL . '/api/payment_orange.php?action=notify',
        'lang'         => 'fr',
        'reference'    => 'VERITAS'
    ];

    $ch = curl_init(ORANGE_API_BASE . '/orange-money-webpay/' . ORANGE_COUNTRY_CODE . '/v1/webpayment');
    curl_setopt_array($ch, [
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_POST           => true,
        CURLOPT_POSTFIELDS     => json_encode($payload),
        CURLOPT_HTTPHEADER     => [
            'Authorization: Bearer ' . $token,
            'Content-Type: application/json',
            'Accept: application/json'
        ],
        CURLOPT_TIMEOUT        => 30,
        CURLOPT_SSL_VERIFYPEER => true   // v1.2.1 : vérif TLS activée (anti-MITM)
    ]);
    $resp = curl_exec($ch);
    $http = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    $err  = curl_error($ch);
    curl_close($ch);

    if ($http !== 200 && $http !== 201) {
        jsonResp(['error' => 'Orange API erreur HTTP ' . $http, 'detail' => $resp ?: $err], 500);
    }

    $data = json_decode($resp, true);
    if (empty($data['payment_url'])) {
        jsonResp(['error' => 'Orange n\'a pas renvoyé d\'URL de paiement', 'detail' => $data], 500);
    }

    // 1.3 Sauvegarder l'état local
    $state = [
        'ref'         => $ref,
        'montant'     => $montant,
        'label'       => $label,
        'intent'      => $intent,
        'targetId'    => $targetId,
        'accountId'   => $accountId,
        'clientNom'   => $clientNom,
        'clientTel'   => $clientTel,
        'status'      => 'pending',
        'created_at'  => date('c'),
        'pay_token'   => $data['pay_token']   ?? '',
        'notif_token' => $data['notif_token'] ?? '',
        'payment_url' => $data['payment_url'],
        'provider'    => 'orange_money_cm',
        // Commissions auteurs/parrains pré-calculées par le client (persistées au paiement confirmé).
        'commissions' => (isset($input['commissions']) && is_array($input['commissions'])) ? $input['commissions'] : []
    ];
    file_put_contents($stateDir . _safeRef($ref) . '.json', json_encode($state, JSON_PRETTY_PRINT));

    jsonResp([
        'success'     => true,
        'ref'         => $ref,
        'payment_url' => $data['payment_url'],
        'pay_token'   => $data['pay_token'] ?? null,
        'message'     => 'Paiement initialisé. Redirigez l\'utilisateur vers payment_url'
    ]);
}

// ────────────────────────────────────────────────────────────
// 2. WEBHOOK — Orange notifie le statut final du paiement
// ────────────────────────────────────────────────────────────
if ($action === 'notify' && $method === 'POST') {
    // Pas d'auth requise : Orange envoie sans token. On vérifie notif_token.
    $payload = file_get_contents('php://input');
    $data    = json_decode($payload, true) ?: [];

    // Format typique : { "status": "SUCCESS", "txnid": "...", "notif_token": "...", "order_id": "VT250407-XYZ12" }
    $ref         = $data['order_id']    ?? '';
    $newStatus   = strtoupper($data['status'] ?? 'UNKNOWN');
    $notifToken  = $data['notif_token'] ?? '';
    $txnId       = $data['txnid']       ?? '';

    // Log brut pour debug
    @file_put_contents($stateDir . '_webhook_log.txt',
        date('c') . ' | ' . $payload . "\n", FILE_APPEND);

    if (!$ref) {
        http_response_code(400);
        echo 'order_id manquant';
        exit;
    }

    $stateFile = $stateDir . _safeRef($ref) . '.json';
    if (!file_exists($stateFile)) {
        http_response_code(404);
        echo 'ref inconnue';
        exit;
    }

    $state = json_decode(file_get_contents($stateFile), true);

    // 🔐 v1.2.1 Vérif token OBLIGATOIRE (anti faux webhook) :
    // si un notif_token a été émis à l'init, le webhook DOIT le présenter et il doit correspondre.
    $expectedNotif = $state['notif_token'] ?? '';
    if ($expectedNotif !== '') {
        if (!hash_equals((string)$expectedNotif, (string)$notifToken)) {
            @file_put_contents($stateDir . '_webhook_log.txt',
                date('c') . ' [REJECTED_BAD_NOTIF_TOKEN] ref=' . $ref . "\n", FILE_APPEND);
            http_response_code(403);
            echo 'notif_token invalide';
            exit;
        }
    } else {
        // Aucun notif_token connu côté serveur → impossible de garantir l'authenticité.
        // On NE marque PAS payé ; on journalise pour vérification manuelle.
        @file_put_contents($stateDir . '_webhook_log.txt',
            date('c') . ' [UNVERIFIABLE_WEBHOOK_IGNORED] ref=' . $ref . "\n", FILE_APPEND);
        http_response_code(202);
        echo 'unverifiable';
        exit;
    }

    // Mise à jour
    $state['provider_status'] = $newStatus;
    $state['txn_id']          = $txnId;
    $state['notified_at']     = date('c');
    $state['raw_webhook']     = $data;

    if (in_array($newStatus, ['SUCCESS', 'SUCCESSFULL', 'COMPLETED', 'PAID'])) {
        $state['status']    = 'paid';
        $state['paid_at']   = date('c');
    } elseif (in_array($newStatus, ['FAILED', 'EXPIRED', 'CANCELLED', 'CANCELED'])) {
        $state['status']    = 'failed';
        $state['failed_at'] = date('c');
    }

    file_put_contents($stateFile, json_encode($state, JSON_PRETTY_PRINT));

    // ── Étape 1 : octroi d'accès côté serveur (best-effort, ne bloque JAMAIS la
    //    réponse à Orange — sinon Orange retenterait en boucle). Idempotent. ──
    if (($state['status'] ?? '') === 'paid') {
        try {
            $g = vrt_grant_entitlement_to_file($state);
            @file_put_contents($stateDir . '_webhook_log.txt',
                date('c') . ' [GRANT] ref=' . $ref . ' ' . json_encode($g) . "\n", FILE_APPEND);
        } catch (\Throwable $e) {
            @file_put_contents($stateDir . '_webhook_log.txt',
                date('c') . ' [GRANT_ERR] ref=' . $ref . ' ' . $e->getMessage() . "\n", FILE_APPEND);
        }
    }

    // Répondre 200 OK à Orange (sinon Orange retentera)
    http_response_code(200);
    echo 'OK';
    exit;
}

// ────────────────────────────────────────────────────────────
// 3. STATUS — Frontend interroge l'état d'un paiement
// ────────────────────────────────────────────────────────────
if ($action === 'status' && $method === 'GET') {
    $ref = trim($_GET['ref'] ?? '');
    if (!$ref) jsonResp(['error' => 'ref requise'], 400);

    $stateFile = $stateDir . _safeRef($ref) . '.json';
    if (!file_exists($stateFile)) jsonResp(['status' => 'unknown', 'ref' => $ref]);

    $state = json_decode(file_get_contents($stateFile), true);
    jsonResp([
        'ref'      => $ref,
        'status'   => $state['status'] ?? 'pending',
        'paid_at'  => $state['paid_at'] ?? null,
        'failed_at'=> $state['failed_at'] ?? null,
        'provider_status' => $state['provider_status'] ?? null,
        'intent'   => $state['intent'] ?? 'generic',
        'targetId' => $state['targetId'] ?? null,
        'accountId'=> $state['accountId'] ?? null
    ]);
}

// ────────────────────────────────────────────────────────────
// 4. RETURN — page de retour après paiement réussi
// ────────────────────────────────────────────────────────────
if ($action === 'return' && $method === 'GET') {
    $ref = trim($_GET['ref'] ?? '');
    header('Content-Type: text/html; charset=utf-8');
    echo '<!DOCTYPE html><html lang="fr"><head><meta charset="UTF-8"><title>Paiement reçu — VÉRITAS</title>'
       . '<style>body{font-family:system-ui,sans-serif;background:linear-gradient(135deg,#142554,#1e3a7a);color:#fff;display:flex;align-items:center;justify-content:center;min-height:100vh;margin:0;padding:20px;text-align:center}.card{background:rgba(255,255,255,.1);padding:40px;border-radius:20px;max-width:480px;backdrop-filter:blur(10px)}h1{color:#FFC93C;font-size:28px}p{font-size:15px;opacity:.9;line-height:1.6}.btn{display:inline-block;margin-top:20px;padding:14px 28px;background:#FFC93C;color:#142554;border-radius:12px;text-decoration:none;font-weight:800}</style></head><body>'
       . '<div class="card"><div style="font-size:64px;margin-bottom:10px">✅</div>'
       . '<h1>Paiement reçu !</h1>'
       . '<p>Votre paiement a bien été enregistré.<br>Référence : <strong>' . htmlspecialchars($ref) . '</strong></p>'
       . '<p>L\'activation de votre accès est automatique. Vous recevrez une confirmation sous quelques minutes.</p>'
       . '<a href="' . PUBLIC_FRONTEND_URL . '" class="btn">↩ Retour à VÉRITAS</a>'
       . '</div></body></html>';
    exit;
}

if ($action === 'cancel' && $method === 'GET') {
    $ref = trim($_GET['ref'] ?? '');
    $stateFile = $stateDir . _safeRef($ref) . '.json';
    if (file_exists($stateFile)) {
        $state = json_decode(file_get_contents($stateFile), true);
        $state['status'] = 'cancelled';
        $state['cancelled_at'] = date('c');
        file_put_contents($stateFile, json_encode($state, JSON_PRETTY_PRINT));
    }
    header('Content-Type: text/html; charset=utf-8');
    echo '<!DOCTYPE html><html lang="fr"><head><meta charset="UTF-8"><title>Paiement annulé</title>'
       . '<style>body{font-family:system-ui,sans-serif;background:#7f1d1d;color:#fff;display:flex;align-items:center;justify-content:center;min-height:100vh;margin:0;padding:20px;text-align:center}.card{background:rgba(255,255,255,.1);padding:40px;border-radius:20px;max-width:480px}.btn{display:inline-block;margin-top:20px;padding:14px 28px;background:#FFC93C;color:#142554;border-radius:12px;text-decoration:none;font-weight:800}</style></head><body>'
       . '<div class="card"><div style="font-size:64px">❌</div><h1>Paiement annulé</h1><p>Vous pouvez réessayer ou utiliser un autre moyen.</p>'
       . '<a href="' . PUBLIC_FRONTEND_URL . '" class="btn">↩ Retour</a></div></body></html>';
    exit;
}

// ────────────────────────────────────────────────────────────
// 5. LIST — liste tous les paiements (admin)
// ────────────────────────────────────────────────────────────
if ($action === 'list' && $method === 'GET') {
    requirePayAuth();
    $files = glob($stateDir . '*.json') ?: [];
    $payments = [];
    foreach ($files as $f) {
        if (basename($f)[0] === '_') continue; // skip _webhook_log.txt
        $payments[] = json_decode(file_get_contents($f), true);
    }
    usort($payments, function($a, $b){
        return strcmp($b['created_at'] ?? '', $a['created_at'] ?? '');
    });
    jsonResp(['count' => count($payments), 'payments' => $payments]);
}

jsonResp(['error' => 'Action inconnue', 'allowed' => ['init', 'notify', 'status', 'return', 'cancel', 'list']], 400);

// ════════════════════════════════════════════════════════════
// HELPERS
// ════════════════════════════════════════════════════════════
function jsonResp($data, $code = 200) {
    http_response_code($code);
    echo json_encode($data);
    exit;
}

function _safeRef($ref) {
    return preg_replace('/[^a-zA-Z0-9_\-]/', '_', $ref);
}

function orangeGetAuthToken() {
    // Cache du token (validité ~1h)
    $cacheFile = __DIR__ . '/data/payments/_orange_token.json';
    if (file_exists($cacheFile)) {
        $cache = json_decode(file_get_contents($cacheFile), true);
        if ($cache && (time() - $cache['t']) < 3000) return $cache['token'];
    }

    $authString = base64_encode(ORANGE_CLIENT_ID . ':' . ORANGE_CLIENT_SECRET);
    $ch = curl_init(ORANGE_API_BASE . '/oauth/v3/token');
    curl_setopt_array($ch, [
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_POST           => true,
        CURLOPT_POSTFIELDS     => 'grant_type=client_credentials',
        CURLOPT_HTTPHEADER     => [
            'Authorization: Basic ' . $authString,
            'Accept: application/json',
            'Content-Type: application/x-www-form-urlencoded'
        ],
        CURLOPT_TIMEOUT        => 20,
        CURLOPT_SSL_VERIFYPEER => true   // v1.2.1 : vérif TLS activée (anti-MITM)
    ]);
    $resp = curl_exec($ch);
    $code = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);

    if ($code !== 200) {
        error_log('[Orange OAuth] HTTP '.$code.' — '.$resp);
        return null;
    }
    $data  = json_decode($resp, true);
    $token = $data['access_token'] ?? null;
    if ($token) {
        file_put_contents($cacheFile, json_encode(['token'=>$token, 't'=>time()]));
    }
    return $token;
}
