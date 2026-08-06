<?php
/**
 * api/campus/_notify.php — Notifications WhatsApp / SMS (par établissement).
 * © 2024-2026 Jacques Miterand TAKOU (Mythe Errant). Tous droits réservés.
 *
 * Chaque message est d'abord JOURNALISÉ (cmp_notifications, statut « queued »),
 * puis on TENTE l'envoi via le provider configuré dans cmp_tenant_secrets du
 * tenant. Aucune exception ne remonte : si rien n'est configuré, le message reste
 * « queued » (envoyable plus tard / manuellement). C'est l'« envoi automatique »
 * branché sur les évènements (absence, reçu, bulletin, relance, compte créé).
 *
 * Secrets attendus dans cmp_tenant_secrets (clé → valeur) :
 *   WhatsApp Cloud API : wa_token, wa_phone_id
 *   Passerelle SMS     : sms_url (gabarit), sms_token, sms_sender
 *   (sms_url accepte les jetons {to} {text} {sender} {token} ; méthode sms_method=GET|POST)
 */
declare(strict_types=1);

/** Lit un secret d'établissement (ou '' si absent). */
function cmp_tenant_secret(int $tenantId, string $key): string {
    $st = cmp_pdo()->prepare('SELECT secret_val FROM cmp_tenant_secrets WHERE tenant_id = ? AND secret_key = ? LIMIT 1');
    $st->execute([$tenantId, $key]);
    return (string) ($st->fetchColumn() ?: '');
}

/** Normalise un numéro camerounais en E.164 (+237…) de façon best-effort. */
function cmp_normalize_phone(string $raw, string $cc = '237'): string {
    $d = preg_replace('/\D+/', '', $raw);
    if ($d === '') { return ''; }
    if (str_starts_with($d, '00')) { $d = substr($d, 2); }
    if (!str_starts_with($d, $cc) && strlen($d) <= 9) { $d = $cc . $d; }
    return '+' . $d;
}

/**
 * Enfile + tente d'envoyer une notification. Renvoie [id, status].
 * @param array $opts student_id, template, created_by, cc(country)
 */
function cmp_notify(int $tenantId, string $channel, string $recipient, string $message, array $opts = []): array {
    $channel = in_array($channel, ['whatsapp', 'sms', 'email'], true) ? $channel : 'sms';
    if ($channel !== 'email') {
        $recipient = cmp_normalize_phone($recipient, (string) ($opts['cc'] ?? '237'));
    }
    $pdo = cmp_pdo();
    $ins = $pdo->prepare(
        'INSERT INTO cmp_notifications (tenant_id, channel, recipient, student_id, template, message, status, created_by)
         VALUES (?,?,?,?,?,?,\'queued\',?)'
    );
    $ins->execute([
        $tenantId, $channel, substr($recipient, 0, 190),
        ($opts['student_id'] ?? 0) ? (int) $opts['student_id'] : null,
        isset($opts['template']) ? substr((string) $opts['template'], 0, 60) : null,
        $message, ($opts['created_by'] ?? 0) ? (int) $opts['created_by'] : null,
    ]);
    $id = (int) $pdo->lastInsertId();
    if ($recipient === '') {
        cmp_notify_mark($id, 'failed', null, null, 'Destinataire vide/invalide');
        return ['id' => $id, 'status' => 'failed'];
    }

    try {
        $res = $channel === 'whatsapp'
            ? cmp_send_whatsapp($tenantId, $recipient, $message)
            : ($channel === 'sms' ? cmp_send_sms($tenantId, $recipient, $message) : ['ok' => false, 'error' => 'e-mail non configuré']);
    } catch (Throwable $e) {
        $res = ['ok' => false, 'error' => substr($e->getMessage(), 0, 200)];
    }

    if (!empty($res['ok'])) {
        cmp_notify_mark($id, 'sent', $channel, $res['ref'] ?? null, null);
        return ['id' => $id, 'status' => 'sent'];
    }
    // Pas de provider configuré → on garde « queued » (renvoyable). Sinon « failed ».
    $status = (!empty($res['unconfigured'])) ? 'queued' : 'failed';
    cmp_notify_mark($id, $status, $channel, null, $res['error'] ?? null);
    return ['id' => $id, 'status' => $status];
}

function cmp_notify_mark(int $id, string $status, ?string $provider, ?string $ref, ?string $error): void {
    try {
        cmp_pdo()->prepare(
            'UPDATE cmp_notifications SET status = ?, provider = ?, provider_ref = ?, error = ?,
                   sent_at = IF(? = \'sent\', NOW(), sent_at) WHERE id = ?'
        )->execute([$status, $provider, $ref, $error ? substr($error, 0, 255) : null, $status, $id]);
    } catch (Throwable $e) { error_log('[campus][notify] mark: ' . $e->getMessage()); }
}

/** WhatsApp Cloud API (graph.facebook.com). */
function cmp_send_whatsapp(int $tenantId, string $to, string $message): array {
    $token   = cmp_tenant_secret($tenantId, 'wa_token');
    $phoneId = cmp_tenant_secret($tenantId, 'wa_phone_id');
    if ($token === '' || $phoneId === '') { return ['ok' => false, 'unconfigured' => true, 'error' => 'WhatsApp non configuré']; }
    $url = 'https://graph.facebook.com/v20.0/' . rawurlencode($phoneId) . '/messages';
    $payload = json_encode([
        'messaging_product' => 'whatsapp',
        'to' => ltrim($to, '+'),
        'type' => 'text',
        'text' => ['body' => $message],
    ], JSON_UNESCAPED_UNICODE);
    $resp = cmp_http_post($url, $payload, [
        'Content-Type: application/json',
        'Authorization: Bearer ' . $token,
    ]);
    if ($resp['status'] >= 200 && $resp['status'] < 300) {
        $j = json_decode($resp['body'], true);
        return ['ok' => true, 'ref' => $j['messages'][0]['id'] ?? null];
    }
    return ['ok' => false, 'error' => 'WhatsApp HTTP ' . $resp['status'] . ' ' . substr($resp['body'], 0, 140)];
}

/** Passerelle SMS générique (gabarit d'URL configurable par établissement). */
function cmp_send_sms(int $tenantId, string $to, string $message): array {
    $tpl    = cmp_tenant_secret($tenantId, 'sms_url');
    $token  = cmp_tenant_secret($tenantId, 'sms_token');
    $sender = cmp_tenant_secret($tenantId, 'sms_sender');
    if ($tpl === '') { return ['ok' => false, 'unconfigured' => true, 'error' => 'SMS non configuré']; }
    $method = strtoupper(cmp_tenant_secret($tenantId, 'sms_method') ?: 'POST');
    $repl = [
        '{to}'     => rawurlencode($to),
        '{text}'   => rawurlencode($message),
        '{sender}' => rawurlencode($sender),
        '{token}'  => rawurlencode($token),
    ];
    $url = strtr($tpl, $repl);
    $resp = $method === 'GET'
        ? cmp_http_get($url, ['Authorization: Bearer ' . $token])
        : cmp_http_post($url, json_encode(['to' => $to, 'message' => $message, 'sender' => $sender], JSON_UNESCAPED_UNICODE),
            ['Content-Type: application/json', 'Authorization: Bearer ' . $token]);
    if ($resp['status'] >= 200 && $resp['status'] < 300) {
        return ['ok' => true, 'ref' => null];
    }
    return ['ok' => false, 'error' => 'SMS HTTP ' . $resp['status'] . ' ' . substr($resp['body'], 0, 140)];
}

/** Petits clients HTTP (cURL si dispo, repli stream). Toujours tolérants. */
function cmp_http_post(string $url, string $body, array $headers): array {
    if (function_exists('curl_init')) {
        $ch = curl_init($url);
        curl_setopt_array($ch, [
            CURLOPT_POST => true, CURLOPT_POSTFIELDS => $body, CURLOPT_HTTPHEADER => $headers,
            CURLOPT_RETURNTRANSFER => true, CURLOPT_TIMEOUT => 12, CURLOPT_CONNECTTIMEOUT => 6,
        ]);
        $out = curl_exec($ch);
        $code = (int) curl_getinfo($ch, CURLINFO_HTTP_CODE);
        $err = curl_error($ch);
        curl_close($ch);
        if ($out === false) { return ['status' => 0, 'body' => $err]; }
        return ['status' => $code, 'body' => (string) $out];
    }
    $ctx = stream_context_create(['http' => [
        'method' => 'POST', 'header' => implode("\r\n", $headers), 'content' => $body, 'timeout' => 12, 'ignore_errors' => true,
    ]]);
    $out = @file_get_contents($url, false, $ctx);
    return ['status' => cmp_http_code($http_response_header ?? []), 'body' => (string) $out];
}
function cmp_http_get(string $url, array $headers): array {
    if (function_exists('curl_init')) {
        $ch = curl_init($url);
        curl_setopt_array($ch, [
            CURLOPT_HTTPHEADER => $headers, CURLOPT_RETURNTRANSFER => true,
            CURLOPT_TIMEOUT => 12, CURLOPT_CONNECTTIMEOUT => 6,
        ]);
        $out = curl_exec($ch);
        $code = (int) curl_getinfo($ch, CURLINFO_HTTP_CODE);
        curl_close($ch);
        if ($out === false) { return ['status' => 0, 'body' => '']; }
        return ['status' => $code, 'body' => (string) $out];
    }
    $ctx = stream_context_create(['http' => ['method' => 'GET', 'header' => implode("\r\n", $headers), 'timeout' => 12, 'ignore_errors' => true]]);
    $out = @file_get_contents($url, false, $ctx);
    return ['status' => cmp_http_code($http_response_header ?? []), 'body' => (string) $out];
}
function cmp_http_code(array $headers): int {
    foreach ($headers as $h) { if (preg_match('#HTTP/\S+\s+(\d{3})#', $h, $m)) { return (int) $m[1]; } }
    return 0;
}
