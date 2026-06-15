<?php
/**
 * api/stats.php — Tunnel d'acquisition MINIMALISTE (v1.5)
 * © 2024-2026 Jacques Miterand TAKOU (Mythe Errant). Tous droits réservés.
 *
 * BUT — chiffrer le tunnel : visites → inscriptions → essais IA → clics
 * abonnement → paiements initiés. Sans données, le marketing pilote à l'aveugle.
 *
 *   POST {ev:"visit|signup|ia_try|sub_click|pay_init", meta?:{...}}  → 1 ligne JSONL
 *   GET  ?summary=1  (Authorization: Bearer API_SECRET)             → agrégat 30 jours
 *
 * Stockage : data/_stats/YYYYMM.jsonl (fichier plat, aucun cookie, aucune
 * donnée personnelle — uniquement l'événement, le jour et un hash d'IP court
 * pour dédupliquer les visites).
 */
declare(strict_types=1);

@include_once __DIR__ . '/payment_config.php';
if (!defined('API_SECRET')) define('API_SECRET', bin2hex(random_bytes(32))); // fail-closed

$__st_allowed = [
    'https://veritas-school.com', 'https://www.veritas-school.com',
    'http://localhost:8000', 'https://localhost', 'capacitor://localhost',
];
$__st_origin = $_SERVER['HTTP_ORIGIN'] ?? '';
if (in_array($__st_origin, $__st_allowed, true)) {
    header('Access-Control-Allow-Origin: ' . $__st_origin);
    header('Vary: Origin');
}
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') { http_response_code(204); exit; }
header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-store');

$dir = __DIR__ . '/data/_stats';
if (!is_dir($dir)) @mkdir($dir, 0750, true);

$ip = $_SERVER['HTTP_CF_CONNECTING_IP'] ?? $_SERVER['HTTP_X_FORWARDED_FOR'] ?? $_SERVER['REMOTE_ADDR'] ?? '?';
$ip = explode(',', (string) $ip)[0];
$ipHash = substr(md5($ip . date('Ym')), 0, 10); // pseudonymisé, rotation mensuelle

// ── Rate-limit simple : 30 events/min/IP (anti-spam) ──
$rl = $dir . '/_rl_' . substr(md5($ip), 0, 12) . '.txt';
$now = time();
$hits = is_file($rl) ? array_filter(explode("\n", (string) @file_get_contents($rl)),
    function ($t) use ($now) { return $t !== '' && ($now - (int) $t) < 60; }) : [];
if (count($hits) >= 30) { http_response_code(429); echo '{"ok":false}'; exit; }
$hits[] = $now;
@file_put_contents($rl, implode("\n", $hits));

/* ── POST : enregistrer un événement ── */
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $in = json_decode((string) file_get_contents('php://input'), true) ?: [];
    $ev = preg_replace('/[^a-z_]/', '', strtolower((string) ($in['ev'] ?? '')));
    $ALLOWED = ['visit', 'signup', 'ia_try', 'sub_click', 'pay_init'];
    if (!in_array($ev, $ALLOWED, true)) { http_response_code(400); echo '{"ok":false}'; exit; }
    $line = json_encode([
        't'  => date('Y-m-d'),
        'ev' => $ev,
        'u'  => $ipHash,
        'm'  => substr((string) json_encode($in['meta'] ?? null), 0, 120),
    ]);
    @file_put_contents($dir . '/' . date('Ym') . '.jsonl', $line . "\n", FILE_APPEND | LOCK_EX);
    echo '{"ok":true}';
    exit;
}

/* ── GET ?summary=1 : agrégat (ADMIN — Bearer API_SECRET) ── */
if (isset($_GET['summary'])) {
    $auth = $_SERVER['HTTP_AUTHORIZATION'] ?? '';
    $tok = trim(str_ireplace('bearer', '', $auth));
    if ($tok === '' || !hash_equals(API_SECRET, $tok)) {
        http_response_code(401); echo '{"ok":false,"error":"auth"}'; exit;
    }
    $out = []; // [jour][ev] = count ; visites dédupliquées par hash IP/jour
    $seenVisit = [];
    foreach ([date('Ym'), date('Ym', strtotime('-1 month'))] as $mFile) {
        $f = $dir . '/' . $mFile . '.jsonl';
        if (!is_file($f)) continue;
        foreach (file($f, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES) as $ln) {
            $r = json_decode($ln, true);
            if (!is_array($r) || empty($r['t']) || empty($r['ev'])) continue;
            if (strtotime($r['t']) < strtotime('-30 days')) continue;
            if ($r['ev'] === 'visit') {
                $k = $r['t'] . '|' . ($r['u'] ?? '');
                if (isset($seenVisit[$k])) continue;
                $seenVisit[$k] = 1;
            }
            $out[$r['t']][$r['ev']] = ($out[$r['t']][$r['ev']] ?? 0) + 1;
        }
    }
    krsort($out);
    echo json_encode(['ok' => true, 'days' => $out], JSON_UNESCAPED_UNICODE);
    exit;
}

http_response_code(405);
echo '{"ok":false}';
