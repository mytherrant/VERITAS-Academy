<?php
// ============================================================
// VÉRITAS — Intégration MTN MoMo Collection API (Cameroun)
// ──────────────────────────────────────────────────────────
// Endpoints:
//   POST /api/payment_mtn.php?action=init    → Initialise un paiement, envoie USSD au client
//   POST /api/payment_mtn.php?action=notify  → Webhook reçu de MTN (callback)
//   GET  /api/payment_mtn.php?action=status  → Vérifie le statut d'un paiement
//   GET  /api/payment_mtn.php?action=list    → Liste tous les paiements (admin)
//
// Documentation MTN: https://momodeveloper.mtn.com/docs/services/collection
// ============================================================

require_once __DIR__ . '/payment_config.php';

header('Content-Type: application/json; charset=utf-8');

$action = $_GET['action'] ?? 'init';
$method = $_SERVER['REQUEST_METHOD'];

$stateDir = __DIR__ . '/data/payments/';
if (!is_dir($stateDir)) mkdir($stateDir, 0755, true);

// ────────────────────────────────────────────────────────────
// 1. INITIALISER UN PAIEMENT — envoie un prompt USSD au client
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
    $clientTel=trim($input['clientTel']?? '');     // ⚠️ numéro MTN du payeur, OBLIGATOIRE

    if ($montant <= 0 || !$ref) {
        jsonResp(['error' => 'montant et ref requis'], 400);
    }
    if (!$clientTel) {
        jsonResp(['error' => 'clientTel (numéro MTN MoMo du payeur) requis'], 400);
    }

    // Normaliser le numéro : retirer +, espaces, tirets, garder seulement chiffres
    $payerNumber = preg_replace('/[^0-9]/', '', $clientTel);
    // En sandbox MTN attend le format international sans le +
    // Au Cameroun : 237 6XX XX XX XX (sans le +)
    if (strpos($payerNumber, '237') !== 0 && strlen($payerNumber) === 9) {
        $payerNumber = '237' . $payerNumber;
    }

    // 1.1 OAuth — obtenir un token MTN
    $token = mtnGetAuthToken();
    if (!$token) jsonResp(['error' => 'OAuth MTN échoué — vérifiez MTN_API_USER / MTN_API_KEY / MTN_SUBSCRIPTION_KEY'], 500);

    // 1.2 Créer un X-Reference-Id (UUID v4)
    $referenceId = mtnUuid();

    // 1.3 Envoyer la requête de paiement
    $payload = [
        'amount'      => (string)$montant,
        'currency'    => MTN_TARGET_ENV === 'sandbox' ? 'EUR' : 'XAF',
        'externalId'  => $ref,
        'payer'       => [
            'partyIdType' => 'MSISDN',
            'partyId'     => $payerNumber
        ],
        'payerMessage' => substr('VERITAS ' . $label, 0, 160),
        'payeeNote'    => substr($ref . ' - ' . $label, 0, 160)
    ];

    $callbackUrl = PUBLIC_BASE_URL . '/api/payment_mtn.php?action=notify&ref=' . urlencode($ref);

    $ch = curl_init(MTN_API_BASE . '/collection/v1_0/requesttopay');
    curl_setopt_array($ch, [
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_POST           => true,
        CURLOPT_POSTFIELDS     => json_encode($payload),
        CURLOPT_HTTPHEADER     => [
            'Authorization: Bearer ' . $token,
            'X-Reference-Id: ' . $referenceId,
            'X-Target-Environment: ' . MTN_TARGET_ENV,
            'X-Callback-Url: ' . $callbackUrl,
            'Ocp-Apim-Subscription-Key: ' . MTN_SUBSCRIPTION_KEY,
            'Content-Type: application/json'
        ],
        CURLOPT_TIMEOUT        => 30,
        CURLOPT_SSL_VERIFYPEER => true
    ]);
    $resp = curl_exec($ch);
    $http = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);

    // MTN renvoie 202 Accepted en cas de succès (le paiement est en cours)
    if ($http !== 202) {
        jsonResp(['error' => 'MTN API erreur HTTP ' . $http, 'detail' => $resp ?: 'pas de réponse'], 500);
    }

    // 1.4 Sauvegarder l'état local
    $state = [
        'ref'         => $ref,
        'mtn_reference_id' => $referenceId,
        'montant'     => $montant,
        'label'       => $label,
        'intent'      => $intent,
        'targetId'    => $targetId,
        'accountId'   => $accountId,
        'clientNom'   => $clientNom,
        'clientTel'   => $payerNumber,
        'status'      => 'pending',
        'created_at'  => date('c'),
        'provider'    => 'mtn_momo_cm'
    ];
    file_put_contents($stateDir . _safeRefMtn($ref) . '.json', json_encode($state, JSON_PRETTY_PRINT));

    jsonResp([
        'success'      => true,
        'ref'          => $ref,
        'reference_id' => $referenceId,
        'message'      => 'Demande de paiement envoyée. Le client doit valider sur son téléphone (PIN MoMo).',
        'instruction'  => 'Un prompt USSD a été envoyé au ' . $payerNumber . '. Validation requise sous 60 secondes.'
    ]);
}

// ────────────────────────────────────────────────────────────
// 2. WEBHOOK — MTN notifie le résultat final
// ────────────────────────────────────────────────────────────
if ($action === 'notify' && ($method === 'POST' || $method === 'PUT')) {
    $payload = file_get_contents('php://input');
    $data    = json_decode($payload, true) ?: [];
    $ref     = $_GET['ref'] ?? ($data['externalId'] ?? '');

    @file_put_contents($stateDir . '_webhook_mtn_log.txt',
        date('c') . ' | ref=' . $ref . ' | ' . $payload . "\n", FILE_APPEND);

    if (!$ref) {
        http_response_code(400);
        echo 'ref manquante';
        exit;
    }

    $stateFile = $stateDir . _safeRefMtn($ref) . '.json';
    if (!file_exists($stateFile)) {
        http_response_code(404);
        echo 'ref inconnue';
        exit;
    }

    $state = json_decode(file_get_contents($stateFile), true);
    $state['notified_at'] = date('c');
    $state['raw_webhook'] = $data;

    // 🔐 v1.2.1 : NE PAS faire confiance au statut du payload (webhook falsifiable).
    // On interroge MTN directement avec notre mtn_reference_id pour obtenir le statut autoritatif.
    $authStatus = null;
    if (!empty($state['mtn_reference_id'])) {
        $vtok = mtnGetAuthToken();
        if ($vtok) {
            $vch = curl_init(MTN_API_BASE . '/collection/v1_0/requesttopay/' . $state['mtn_reference_id']);
            curl_setopt_array($vch, [
                CURLOPT_RETURNTRANSFER => true,
                CURLOPT_HTTPHEADER => [
                    'Authorization: Bearer ' . $vtok,
                    'X-Target-Environment: ' . MTN_TARGET_ENV,
                    'Ocp-Apim-Subscription-Key: ' . MTN_SUBSCRIPTION_KEY
                ],
                CURLOPT_TIMEOUT => 15,
                CURLOPT_SSL_VERIFYPEER => true
            ]);
            $vresp = curl_exec($vch);
            $vhttp = curl_getinfo($vch, CURLINFO_HTTP_CODE);
            curl_close($vch);
            if ($vhttp === 200) {
                $vdata = json_decode($vresp, true) ?: [];
                $authStatus = strtoupper($vdata['status'] ?? '');
                $state['mtn_financial_transaction_id'] = $vdata['financialTransactionId'] ?? ($state['mtn_financial_transaction_id'] ?? '');
                if (isset($vdata['reason'])) $state['reason'] = $vdata['reason'];
            }
        }
    }

    if ($authStatus !== null && $authStatus !== '') {
        $state['provider_status'] = $authStatus;
        if ($authStatus === 'SUCCESSFUL') {
            $state['status']  = 'paid';
            $state['paid_at'] = date('c');
        } elseif (in_array($authStatus, ['FAILED', 'REJECTED', 'TIMEOUT', 'EXPIRED'])) {
            $state['status']    = 'failed';
            $state['failed_at'] = date('c');
            $state['reason']    = $state['reason'] ?? 'Refusé par le payeur ou expiration';
        }
        // PENDING → on laisse 'pending' ; le polling status confirmera.
    } else {
        // Impossible de vérifier auprès de MTN → ne PAS changer le statut, journaliser.
        @file_put_contents($stateDir . '_webhook_mtn_log.txt',
            date('c') . ' [UNVERIFIED_NO_AUTH_STATUS] ref=' . $ref . "\n", FILE_APPEND);
    }

    file_put_contents($stateFile, json_encode($state, JSON_PRETTY_PRINT));

    http_response_code(200);
    echo 'OK';
    exit;
}

// ────────────────────────────────────────────────────────────
// 3. STATUS — interroge MTN pour confirmer (au cas où le webhook tarde)
// ────────────────────────────────────────────────────────────
if ($action === 'status' && $method === 'GET') {
    $ref = trim($_GET['ref'] ?? '');
    if (!$ref) jsonResp(['error' => 'ref requise'], 400);

    $stateFile = $stateDir . _safeRefMtn($ref) . '.json';
    if (!file_exists($stateFile)) jsonResp(['status' => 'unknown', 'ref' => $ref]);

    $state = json_decode(file_get_contents($stateFile), true);

    // Si toujours pending et > 10s écoulées : interroger MTN directement
    $age = time() - strtotime($state['created_at']);
    if ($state['status'] === 'pending' && $age > 10 && !empty($state['mtn_reference_id'])) {
        $token = mtnGetAuthToken();
        if ($token) {
            $ch = curl_init(MTN_API_BASE . '/collection/v1_0/requesttopay/' . $state['mtn_reference_id']);
            curl_setopt_array($ch, [
                CURLOPT_RETURNTRANSFER => true,
                CURLOPT_HTTPHEADER => [
                    'Authorization: Bearer ' . $token,
                    'X-Target-Environment: ' . MTN_TARGET_ENV,
                    'Ocp-Apim-Subscription-Key: ' . MTN_SUBSCRIPTION_KEY
                ],
                CURLOPT_TIMEOUT => 15,
                CURLOPT_SSL_VERIFYPEER => true
            ]);
            $resp = curl_exec($ch);
            $http = curl_getinfo($ch, CURLINFO_HTTP_CODE);
            curl_close($ch);

            if ($http === 200) {
                $data = json_decode($resp, true) ?: [];
                $mtnStatus = strtoupper($data['status'] ?? 'PENDING');
                $state['provider_status'] = $mtnStatus;
                if ($mtnStatus === 'SUCCESSFUL') {
                    $state['status']  = 'paid';
                    $state['paid_at'] = date('c');
                    $state['mtn_financial_transaction_id'] = $data['financialTransactionId'] ?? '';
                } elseif (in_array($mtnStatus, ['FAILED', 'REJECTED', 'TIMEOUT', 'EXPIRED'])) {
                    $state['status']    = 'failed';
                    $state['failed_at'] = date('c');
                    $state['reason']    = $data['reason'] ?? 'Refusé';
                }
                file_put_contents($stateFile, json_encode($state, JSON_PRETTY_PRINT));
            }
        }
    }

    jsonResp([
        'ref'      => $ref,
        'status'   => $state['status'] ?? 'pending',
        'paid_at'  => $state['paid_at'] ?? null,
        'failed_at'=> $state['failed_at'] ?? null,
        'provider_status' => $state['provider_status'] ?? null,
        'intent'   => $state['intent'] ?? 'generic',
        'targetId' => $state['targetId'] ?? null,
        'accountId'=> $state['accountId'] ?? null,
        'reason'   => $state['reason'] ?? null
    ]);
}

// ────────────────────────────────────────────────────────────
// 4. LIST — admin : tous les paiements MTN
// ────────────────────────────────────────────────────────────
if ($action === 'list' && $method === 'GET') {
    requirePayAuth();
    $files = glob($stateDir . '*.json') ?: [];
    $payments = [];
    foreach ($files as $f) {
        if (basename($f)[0] === '_') continue;
        $p = json_decode(file_get_contents($f), true);
        if (($p['provider'] ?? '') === 'mtn_momo_cm') $payments[] = $p;
    }
    usort($payments, function($a, $b){
        return strcmp($b['created_at'] ?? '', $a['created_at'] ?? '');
    });
    jsonResp(['count' => count($payments), 'payments' => $payments]);
}

jsonResp(['error' => 'Action inconnue', 'allowed' => ['init', 'notify', 'status', 'list']], 400);

// ════════════════════════════════════════════════════════════
// HELPERS
// ════════════════════════════════════════════════════════════
function jsonResp($data, $code = 200) {
    http_response_code($code);
    echo json_encode($data);
    exit;
}

function _safeRefMtn($ref) {
    return 'mtn_' . preg_replace('/[^a-zA-Z0-9_\-]/', '_', $ref);
}

function mtnUuid() {
    // UUID v4 standard
    $d = random_bytes(16);
    $d[6] = chr(ord($d[6]) & 0x0f | 0x40);
    $d[8] = chr(ord($d[8]) & 0x3f | 0x80);
    return vsprintf('%s%s-%s-%s-%s-%s%s%s', str_split(bin2hex($d), 4));
}

function mtnGetAuthToken() {
    // Cache du token (validité ~1h pour MTN Collection)
    $cacheFile = __DIR__ . '/data/payments/_mtn_token.json';
    if (file_exists($cacheFile)) {
        $cache = json_decode(file_get_contents($cacheFile), true);
        if ($cache && (time() - $cache['t']) < 3000) return $cache['token'];
    }

    $authString = base64_encode(MTN_API_USER . ':' . MTN_API_KEY);
    $ch = curl_init(MTN_API_BASE . '/collection/token/');
    curl_setopt_array($ch, [
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_POST           => true,
        CURLOPT_POSTFIELDS     => '',
        CURLOPT_HTTPHEADER     => [
            'Authorization: Basic ' . $authString,
            'Ocp-Apim-Subscription-Key: ' . MTN_SUBSCRIPTION_KEY,
            'Content-Type: application/json'
        ],
        CURLOPT_TIMEOUT        => 20,
        CURLOPT_SSL_VERIFYPEER => true
    ]);
    $resp = curl_exec($ch);
    $code = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);

    if ($code !== 200) {
        error_log('[MTN OAuth] HTTP '.$code.' — '.$resp);
        return null;
    }
    $data  = json_decode($resp, true);
    $token = $data['access_token'] ?? null;
    if ($token) {
        file_put_contents($cacheFile, json_encode(['token'=>$token, 't'=>time()]));
    }
    return $token;
}
