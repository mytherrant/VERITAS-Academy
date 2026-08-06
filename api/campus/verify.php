<?php
/**
 * api/campus/verify.php — Vérification PUBLIQUE d'un document via son code (QR).
 * © 2024-2026 Jacques Miterand TAKOU (Mythe Errant). Tous droits réservés.
 *
 * Accès public (pas d'auth) : un parent/employeur scanne le QR → cette page
 * confirme l'authenticité (ou non) du document. Ne renvoie qu'un RÉSUMÉ public.
 * Répond en HTML (navigateur) ou JSON (?format=json / Accept: application/json).
 */
declare(strict_types=1);

require_once __DIR__ . '/_bootstrap.php';

$code = strtoupper(trim((string) ($_GET['code'] ?? '')));
$wantsJson = (($_GET['format'] ?? '') === 'json')
    || str_contains(strtolower($_SERVER['HTTP_ACCEPT'] ?? ''), 'application/json');

$result = ['valid' => false, 'code' => $code];
if ($code !== '' && preg_match('/^[A-Z]{2,4}-\d{2}-[A-F0-9]{8}$/', $code)) {
    try {
        $st = cmp_pdo()->prepare(
            'SELECT d.type, d.issued_to, d.issued_at, d.data, d.valid, t.name AS school, b.product_name
               FROM cmp_doc_registry d
               JOIN cmp_tenants t ON t.id = d.tenant_id
               LEFT JOIN cmp_tenant_branding b ON b.tenant_id = d.tenant_id
              WHERE d.code = ? LIMIT 1'
        );
        $st->execute([$code]);
        $row = $st->fetch();
        if ($row) {
            $result = [
                'valid'     => (bool) $row['valid'],
                'code'      => $code,
                'type'      => $row['type'],
                'issued_to' => $row['issued_to'],
                'issued_at' => $row['issued_at'],
                'school'    => $row['product_name'] ?: $row['school'],
                'data'      => $row['data'] ? json_decode((string) $row['data'], true) : null,
            ];
        }
    } catch (Throwable $e) {
        error_log('[campus][verify] ' . $e->getMessage());
    }
}

if ($wantsJson) {
    cmp_json($result, $result['valid'] ? 200 : 404);
}

// ── Rendu HTML (page de vérification lisible par un humain) ──
header('Content-Type: text/html; charset=utf-8');
$TYPES = ['bulletin' => 'Bulletin scolaire', 'recu' => 'Reçu de paiement', 'certificat' => 'Certificat de scolarité',
          'attestation' => 'Attestation de travail', 'carte' => 'Carte scolaire', 'autre' => 'Document'];
$e = fn($s) => htmlspecialchars((string) $s, ENT_QUOTES, 'UTF-8');
$ok = $result['valid'];
$color = $ok ? '#1aa463' : '#d8453f';
echo '<!doctype html><html lang="fr"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">';
echo '<title>Vérification — VÉRITAS Campus</title>';
echo '<style>body{font-family:system-ui,Segoe UI,sans-serif;background:#0e1b3f;color:#14213a;margin:0;display:grid;place-items:center;min-height:100vh;padding:20px}';
echo '.card{background:#fff;border-radius:16px;box-shadow:0 12px 40px rgba(0,0,0,.3);max-width:440px;width:100%;overflow:hidden}';
echo '.hd{background:' . $color . ';color:#fff;padding:22px;text-align:center}.hd .ic{font-size:44px}.hd b{display:block;font-size:1.2rem;margin-top:6px}';
echo '.bd{padding:22px}.row{display:flex;justify-content:space-between;gap:12px;padding:9px 0;border-bottom:1px solid #eee;font-size:.92rem}';
echo '.row .l{color:#5b6b86}.row b{text-align:right}.ft{padding:14px 22px;background:#f5f7fc;font-size:.75rem;color:#5b6b86;text-align:center}</style></head><body>';
echo '<div class="card"><div class="hd"><div class="ic">' . ($ok ? '✅' : '⛔') . '</div><b>' . ($ok ? 'Document authentique' : 'Document introuvable ou invalide') . '</b></div><div class="bd">';
if ($ok) {
    echo '<div class="row"><span class="l">Type</span><b>' . $e($TYPES[$result['type']] ?? $result['type']) . '</b></div>';
    echo '<div class="row"><span class="l">Établissement</span><b>' . $e($result['school']) . '</b></div>';
    if (!empty($result['issued_to'])) { echo '<div class="row"><span class="l">Délivré à</span><b>' . $e($result['issued_to']) . '</b></div>'; }
    echo '<div class="row"><span class="l">Émis le</span><b>' . $e($result['issued_at']) . '</b></div>';
    if (!empty($result['data']) && is_array($result['data'])) {
        foreach ($result['data'] as $k => $v) {
            if (is_scalar($v)) { echo '<div class="row"><span class="l">' . $e(ucfirst((string) $k)) . '</span><b>' . $e($v) . '</b></div>'; }
        }
    }
    echo '<div class="row"><span class="l">Code</span><b>' . $e($result['code']) . '</b></div>';
} else {
    echo '<p style="text-align:center;color:#5b6b86">Le code <b>' . $e($code ?: '—') . '</b> ne correspond à aucun document officiel émis par la plateforme.</p>';
}
echo '</div><div class="ft">Vérification sécurisée · Propulsé par VÉRITAS Campus</div></div></body></html>';
