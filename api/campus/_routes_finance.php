<?php
/**
 * api/campus/_routes_finance.php — Paiements, reçus (registre QR) et paiement en
 * ligne Mobile Money (initiation + webhooks idempotents).
 * © 2024-2026 Jacques Miterand TAKOU (Mythe Errant). Tous droits réservés.
 * Inclus par index.php. Webhooks = PUBLICS (pas d'auth, vérifiés par jeton tenant).
 */
declare(strict_types=1);

require_once __DIR__ . '/_docs.php';

// Référence GLOBALEMENT unique (préfixe tenant → lookup webhook sans ambiguïté).
function cmp_pay_ref(int $tid): string {
    return 'VT' . $tid . '-' . date('ymd') . '-' . strtoupper(bin2hex(random_bytes(3)));
}
function cmp_student_brief(int $tid, int $sid): array {
    $st = cmp_pdo()->prepare(
        'SELECT s.nom, s.prenom, s.parent_tel, c.name AS classe
           FROM cmp_students s LEFT JOIN cmp_classes c ON c.id = s.class_id AND c.tenant_id = s.tenant_id
          WHERE s.id = ? AND s.tenant_id = ?'
    );
    $st->execute([$sid, $tid]);
    return $st->fetch() ?: [];
}

/* ── POST /payments — encaissement manuel (intendant) + reçu enregistré ── */
if ($route === 'payments' && $method === 'POST') {
    $ctx = cmp_require_auth('tenant');
    cmp_require_perm($ctx, 'finance.manage');
    $tid = (int) $ctx['tenant_id'];
    $sid = (int) cmp_param('student_id', 0);
    $montant = (int) cmp_param('montant', 0);
    if ($montant <= 0) { cmp_fail('Montant invalide.', 422); }
    $ref = trim((string) cmp_param('reference', '')) ?: cmp_pay_ref($tid);
    cmp_pdo()->prepare(
        'INSERT INTO cmp_payments (tenant_id, student_id, montant, devise, moyen, reference, statut, verifie, validated_by)
         VALUES (?,?,?,?,?,?,\'confirmed\',1,?)'
    )->execute([
        $tid, $sid ?: null, $montant, (string) cmp_param('devise', 'XAF'),
        substr((string) cmp_param('moyen', 'caisse'), 0, 20), $ref, $ctx['user_id'],
    ]);
    $payId = (int) cmp_pdo()->lastInsertId();
    $s = $sid ? cmp_student_brief($tid, $sid) : [];
    $nom = trim((string) (($s['prenom'] ?? '') . ' ' . ($s['nom'] ?? ''))) ?: 'Élève';
    // Reçu enregistré au registre (vérifiable par QR).
    $code = cmp_doc_register($tid, 'recu', $nom, (string) $payId, [
        'classe' => $s['classe'] ?? '', 'montant' => number_format($montant, 0, ',', ' ') . ' FCFA',
        'reference' => $ref,
    ]);
    cmp_audit($ctx, 'record_payment', 'payment', (string) $payId, null, ['montant' => $montant, 'ref' => $ref]);
    // Notification reçu au parent (best-effort).
    if (cmp_param('notify', true) && !empty($s['parent_tel']) && function_exists('cmp_notify')) {
        $brand = function_exists('cmp_brand_min') ? cmp_brand_min($tid) : ['name' => 'École', 'slug' => ''];
        $msg = $brand['name'] . ' : paiement de ' . number_format($montant, 0, ',', ' ') . ' FCFA reçu pour ' . $nom
             . '. Reçu N° ' . $code . '. Merci.';
        cmp_notify($tid, (string) cmp_param('channel', 'sms'), (string) $s['parent_tel'], $msg, ['student_id' => $sid, 'template' => 'recu', 'created_by' => $ctx['user_id']]);
    }
    $brandSlug = function_exists('cmp_brand_min') ? cmp_brand_min($tid)['slug'] : '';
    cmp_ok(['payment_id' => $payId, 'reference' => $ref, 'receipt_code' => $code, 'verify_url' => cmp_verify_url($brandSlug, $code)], 201);
}

/* ── GET /payments?student_id= — historique + soldes ── */
if ($route === 'payments' && $method === 'GET') {
    $ctx = cmp_require_auth('tenant');
    cmp_require_perm($ctx, 'finance.manage');
    $tid = (int) $ctx['tenant_id'];
    $sid = (int) cmp_param('student_id', 0);
    $sql = 'SELECT id, student_id, montant, moyen, reference, statut, verifie, date_paiement FROM cmp_payments WHERE tenant_id = ?';
    $args = [$tid];
    if ($sid) { $sql .= ' AND student_id = ?'; $args[] = $sid; }
    $sql .= ' ORDER BY date_paiement DESC LIMIT 500';
    $st = cmp_pdo()->prepare($sql);
    $st->execute($args);
    $rows = $st->fetchAll();
    $total = 0;
    foreach ($rows as $r) { if ($r['statut'] === 'confirmed') { $total += (int) $r['montant']; } }
    cmp_ok(['payments' => $rows, 'total_confirme' => $total]);
}

/* ── POST /payments/initiate — paiement en ligne Mobile Money (MoMo/Orange) ── */
if ($route === 'payments/initiate' && $method === 'POST') {
    $ctx = cmp_require_auth('tenant');
    // Intendant OU élève/parent (pour leur propre scolarité).
    if (!cmp_can($ctx, 'finance.manage') && !in_array($ctx['role'], ['eleve', 'parent'], true)) {
        cmp_fail('Accès refusé.', 403);
    }
    $tid = (int) $ctx['tenant_id'];
    $montant = (int) cmp_param('montant', 0);
    $moyen = cmp_param('moyen', 'momo') === 'orange' ? 'orange' : 'momo';
    $sid = (int) cmp_param('student_id', 0);
    if ($montant <= 0) { cmp_fail('Montant invalide.', 422); }
    $ref = cmp_pay_ref($tid);
    cmp_pdo()->prepare(
        'INSERT INTO cmp_payments (tenant_id, student_id, montant, devise, moyen, reference, statut, verifie)
         VALUES (?,?,?,\'XAF\',?,?,\'pending\',0)'
    )->execute([$tid, $sid ?: null, $montant, $moyen, $ref]);
    cmp_audit($ctx, 'initiate_payment', 'payment', $ref, null, ['montant' => $montant, 'moyen' => $moyen]);
    // En prod : appeler l'API du provider (collecte) puis renvoyer l'URL/USSD.
    // Le statut passera à « confirmed » via le webhook /webhooks/momo|orange.
    cmp_ok([
        'reference' => $ref, 'statut' => 'pending', 'montant' => $montant, 'moyen' => $moyen,
        'instructions' => 'Validez la demande de paiement reçue sur votre téléphone (' . strtoupper($moyen) . '). Statut confirmé automatiquement après paiement.',
    ], 201);
}

/* ── GET /payments/status?reference= ── */
if ($route === 'payments/status' && $method === 'GET') {
    $ctx = cmp_require_auth('tenant');
    $ref = trim((string) cmp_param('reference', ''));
    if ($ref === '') { cmp_fail('reference requise.', 422); }
    $st = cmp_pdo()->prepare('SELECT statut, verifie, montant FROM cmp_payments WHERE tenant_id = ? AND reference = ?');
    $st->execute([(int) $ctx['tenant_id'], $ref]);
    $p = $st->fetch();
    if (!$p) { cmp_fail('Référence inconnue.', 404); }
    cmp_ok(['reference' => $ref, 'statut' => $p['statut'], 'verifie' => (bool) $p['verifie'], 'montant' => (int) $p['montant']]);
}

/* ── POST /webhooks/momo|orange — callback provider (PUBLIC, idempotent) ── */
if (($route === 'webhooks/momo' || $route === 'webhooks/orange') && $method === 'POST') {
    $provider = $route === 'webhooks/orange' ? 'orange' : 'momo';
    $body = cmp_body();
    $eventId = substr((string) ($body['event_id'] ?? $body['transactionId'] ?? ''), 0, 120);
    $ref = substr((string) ($body['reference'] ?? $body['externalId'] ?? ''), 0, 80);
    $status = strtolower((string) ($body['status'] ?? ''));
    $token = (string) ($body['token'] ?? $body['notif_token'] ?? '');
    if ($eventId === '' || $ref === '') { cmp_fail('Webhook incomplet.', 422); }

    $pdo = cmp_pdo();
    // Idempotence : un event_id n'est traité qu'une fois.
    try {
        $pdo->prepare('INSERT INTO cmp_payment_webhooks (provider, event_id, reference, payload) VALUES (?,?,?,?)')
            ->execute([$provider, $eventId, $ref, json_encode($body, JSON_UNESCAPED_UNICODE)]);
    } catch (Throwable $e) {
        cmp_ok(['duplicate' => true]);   // déjà reçu → on confirme sans retraiter
    }
    // Retrouve le paiement (référence globalement unique).
    $p = $pdo->prepare('SELECT id, tenant_id, montant, student_id, statut FROM cmp_payments WHERE reference = ? LIMIT 1');
    $p->execute([$ref]);
    $pay = $p->fetch();
    if (!$pay) { $pdo->prepare('UPDATE cmp_payment_webhooks SET processed = 1 WHERE provider = ? AND event_id = ?')->execute([$provider, $eventId]); cmp_ok(['unknown_reference' => true]); }
    $tid = (int) $pay['tenant_id'];
    // Vérification du jeton de notification du tenant (fail-closed si configuré).
    $secret = function_exists('cmp_tenant_secret') ? cmp_tenant_secret($tid, $provider . '_notif_token') : '';
    if ($secret !== '' && !hash_equals($secret, $token)) {
        cmp_fail('Jeton de notification invalide.', 401);
    }
    $success = in_array($status, ['success', 'successful', 'completed', 'paid'], true);
    if ($success && $pay['statut'] !== 'confirmed') {
        $pdo->prepare('UPDATE cmp_payments SET statut = \'confirmed\', verifie = 1, provider_ref = ? WHERE id = ?')
            ->execute([substr($eventId, 0, 120), (int) $pay['id']]);
        $s = ((int) $pay['student_id']) ? cmp_student_brief($tid, (int) $pay['student_id']) : [];
        $nom = trim((string) (($s['prenom'] ?? '') . ' ' . ($s['nom'] ?? ''))) ?: 'Élève';
        cmp_doc_register($tid, 'recu', $nom, (string) $pay['id'], [
            'montant' => number_format((int) $pay['montant'], 0, ',', ' ') . ' FCFA', 'reference' => $ref, 'moyen' => $provider,
        ]);
        if (!empty($s['parent_tel']) && function_exists('cmp_notify')) {
            cmp_notify($tid, 'sms', (string) $s['parent_tel'], 'Paiement de ' . number_format((int) $pay['montant'], 0, ',', ' ') . ' FCFA confirmé (réf. ' . $ref . '). Merci.', ['template' => 'recu']);
        }
    } elseif (!$success) {
        $pdo->prepare('UPDATE cmp_payments SET statut = \'failed\' WHERE id = ? AND statut = \'pending\'')->execute([(int) $pay['id']]);
    }
    $pdo->prepare('UPDATE cmp_payment_webhooks SET processed = 1, tenant_id = ? WHERE provider = ? AND event_id = ?')->execute([$tid, $provider, $eventId]);
    cmp_ok(['processed' => true, 'reference' => $ref, 'statut' => $success ? 'confirmed' : 'failed']);
}
