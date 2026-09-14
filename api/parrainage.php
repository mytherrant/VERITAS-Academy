<?php
/**
 * api/parrainage.php — CODE AMI : ce que voient le client, le parrain et l'administration
 * © 2024-2026 Jacques Miterand TAKOU (Mythe Errant). Tous droits réservés.
 * Œuvre protégée — Loi camerounaise n° 2000/011 + Convention de Berne.
 *
 * La règle, l'argent et le registre vivent dans api/_parrainage_lib.php. Ce
 * fichier n'en est que la vitrine — il ne CRÉDITE rien de lui-même, sauf sur
 * ordre de l'administration pour un paiement validé à la main.
 *
 *   GET      ?action=config            règle en vigueur (public, pour les textes)
 *   GET|POST ?action=verifier          un code vaut-il quelque chose sur CET achat ?
 *   GET      ?action=moi               « Mon code ami » (jeton de compte)
 *   POST     ?action=numero            où recevoir ses commissions (jeton de compte)
 *   GET      ?action=admin             tableau de bord (secret administrateur)
 *   POST     ?action=reglages          taux, seuil, marche/arrêt (secret administrateur)
 *   POST     ?action=crediter          paiement validé à la main (secret administrateur)
 *   POST     ?action=versement_regler  trancher un versement « incertain » (secret administrateur)
 */
declare(strict_types=1);
require_once __DIR__ . '/_json_boot.php';   // display_errors=0 + purge avant le JSON
require_once __DIR__ . '/config_sync.php';  // CORS allowlist + préflight OPTIONS
require_once __DIR__ . '/_auth_lib.php';    // base, jetons de compte, octroi, Code ami

header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-store, no-cache, must-revalidate, max-age=0');
header('X-Content-Type-Options: nosniff');
header('Referrer-Policy: no-referrer');
header('Vary: Origin, Authorization');

function parr_out(array $p, int $code = 200): void {
    http_response_code($code);
    echo json_encode($p, JSON_UNESCAPED_UNICODE);
    exit;
}

function parr_bearer(): string {
    $h = '';
    if (function_exists('getallheaders')) {
        foreach (getallheaders() as $k => $v) { if (strtolower((string) $k) === 'authorization') { $h = (string) $v; break; } }
    }
    if ($h === '') $h = (string) ($_SERVER['HTTP_AUTHORIZATION'] ?? $_SERVER['REDIRECT_HTTP_AUTHORIZATION'] ?? '');
    return trim((string) preg_replace('/^\s*bearer\s+/i', '', $h));
}

/** L'administration : le secret de synchronisation OU celui des paiements — jamais un secret connu. */
function parr_exiger_admin(): void {
    $t = parr_bearer();
    $ok = false;
    foreach (['API_SECRET', 'PAY_API_SECRET'] as $c) {
        if (!defined($c)) continue;
        $s = (string) constant($c);
        if ($s !== '' && !vrt_secret_is_compromised($s) && $t !== '' && hash_equals($s, $t)) { $ok = true; break; }
    }
    if (!$ok) parr_out(['ok' => false, 'error' => 'Authentification administrateur requise'], 401);
}

/** Le compte derrière un jeton de connexion, ou null. */
function parr_compte(?array $db = null): ?array {
    $t = parr_bearer();
    if ($t === '' || substr_count($t, '.') !== 1) return null;
    $id = vrt_verify_token($t, $db);
    return $id ? $id['acc'] : null;
}

function parr_entree(): array {
    $raw = (string) file_get_contents('php://input');
    if (strlen($raw) > 8192) parr_out(['ok' => false, 'error' => 'Requête trop volumineuse'], 413);
    $j = $raw !== '' ? json_decode($raw, true) : null;
    return is_array($j) ? $j : [];
}

$action = (string) ($_GET['action'] ?? '');
$method = (string) ($_SERVER['REQUEST_METHOD'] ?? 'GET');

// ── RÈGLE EN VIGUEUR ─────────────────────────────────────────────────────
// Les écrans l'affichent au lieu d'écrire « 10 % » en dur : un taux changé
// par l'administration se lit partout le jour même.
if ($action === 'config') {
    $db = vrt_load_db() ?: [];
    $cfg = vrt_parr_cfg($db);
    header('Cache-Control: public, max-age=300');
    parr_out(['ok' => true, 'actif' => $cfg['actif'], 'remisePct' => $cfg['remisePct'],
              'commissionPct' => $cfg['commissionPct'], 'seuilVersement' => $cfg['seuilVersement'],
              'versementAuto' => $cfg['versementAuto']]);
}

// ── VÉRIFIER UN CODE POUR UN ACHAT ───────────────────────────────────────
// Le montant rendu est CELUI que ?action=init acceptera : le tunnel l'affiche
// barré puis l'envoie tel quel. Le payeur est identifié par son jeton, jamais
// par un identifiant passé en paramètre (sinon on sonderait les comptes
// d'autrui pour savoir qui a un parrain).
if ($action === 'verifier') {
    if (vrt_rate_exceeded('parr_verif', 30)) parr_out(['ok' => false, 'error' => 'Trop de vérifications — patientez une minute'], 429);
    $in = ($method === 'POST') ? parr_entree() : $_GET;
    $intent   = substr(preg_replace('/[^a-z_]/', '', strtolower((string) ($in['intent'] ?? ''))), 0, 30);
    $targetId = substr(trim((string) ($in['targetId'] ?? '')), 0, 64);
    $montant  = max(0, (int) ($in['montant'] ?? 0));
    $code     = substr(trim((string) ($in['code'] ?? '')), 0, 32);

    $db = vrt_load_db();
    if (!is_array($db)) parr_out(['ok' => false, 'error' => 'Service momentanément indisponible'], 503);
    $acc = parr_compte($db);
    $prixRef = vrt_prix_catalogue($db, $intent, $targetId);
    $prix = ($prixRef !== null && $prixRef > 0) ? $prixRef : $montant;

    try { $reg = vrt_parr_lire(); } catch (\Throwable $e) { $reg = vrt_parr_vide(); }
    $ev = vrt_parr_evaluer($db, $reg, [
        'code' => $code, 'accountId' => $acc ? (string) ($acc['id'] ?? '') : '',
        'tel' => (string) ($in['tel'] ?? ''), 'intent' => $intent, 'targetId' => $targetId, 'prix' => $prix,
    ]);
    if (!empty($ev['ok']) && !empty($ev['benef']) && $ev['type'] !== 'promo') vrt_parr_indexer((string) $ev['code'], (string) $ev['benef']);
    parr_out([
        'ok'        => (bool) $ev['ok'],
        'code'      => (string) $ev['code'],
        'source'    => (string) $ev['source'],       // « lien » = parrain de l'inscription, « saisie » = code tapé
        'parrain'   => (string) $ev['parrain'],      // « Awa T. » — jamais plus
        'remisePct' => (int) $ev['remisePct'],
        'remise'    => (int) $ev['remise'],
        'prix'      => $prix,
        'montant'   => (int) ($ev['ok'] ? $ev['montant'] : $prix),
        'message'   => (string) $ev['motif'],
    ]);
}

// ── MON CODE AMI ─────────────────────────────────────────────────────────
if ($action === 'moi') {
    $db = vrt_load_db();
    if (!is_array($db)) parr_out(['ok' => false, 'error' => 'Service momentanément indisponible'], 503);
    $acc = parr_compte($db);
    if (!$acc) parr_out(['ok' => false, 'error' => 'Connectez-vous pour voir votre code ami'], 401);
    $benef = 'acc:' . (string) ($acc['id'] ?? '');
    $reg = vrt_parr_lire();
    $r = vrt_parr_resume($db, $reg, $benef);
    if ($r['code'] !== '') vrt_parr_indexer($r['code'], $benef);
    // Le filleul voit aussi qui le parraine : c'est ce qui explique sa remise.
    $lien = vrt_parr_lien($db, $reg, (string) ($acc['id'] ?? ''));
    if ($lien) {
        $p = vrt_parr_personne($db, $lien['b']);
        $r['monParrain'] = ['code' => $lien['c'], 'nom' => $p ? vrt_parr_nom_court($p['pre'], $p['nom']) : ''];
    }
    parr_out($r);
}

// ── OÙ RECEVOIR SES COMMISSIONS ──────────────────────────────────────────
if ($action === 'numero' && $method === 'POST') {
    if (vrt_rate_exceeded('parr_numero', 10)) parr_out(['ok' => false, 'error' => 'Trop de tentatives — patientez'], 429);
    $db = vrt_load_db();
    $acc = parr_compte(is_array($db) ? $db : null);
    if (!$acc) parr_out(['ok' => false, 'error' => 'Session expirée — reconnectez-vous'], 401);
    $in = parr_entree();
    $r = vrt_parr_definir_numero('acc:' . (string) ($acc['id'] ?? ''), (string) ($in['tel'] ?? ''));
    parr_out($r, !empty($r['ok']) ? 200 : 400);
}

// ═════════════════════════ ADMINISTRATION ═══════════════════════════════
if ($action === 'admin') {
    parr_exiger_admin();
    $db = vrt_load_db();
    if (!is_array($db)) parr_out(['ok' => false, 'error' => 'Base indisponible'], 503);
    parr_out(vrt_parr_resume_admin($db, vrt_parr_lire()));
}

if ($action === 'reglages' && $method === 'POST') {
    parr_exiger_admin();
    $in = parr_entree();
    $propre = [];
    if (array_key_exists('actif', $in))         $propre['actif'] = (bool) $in['actif'];
    if (array_key_exists('versementAuto', $in)) $propre['versementAuto'] = (bool) $in['versementAuto'];
    foreach (['remisePct', 'commissionPct', 'seuilVersement'] as $k) {
        if (isset($in[$k]) && is_numeric($in[$k])) $propre[$k] = (int) $in[$k];
    }
    vrt_parr_tx(function (array &$reg) use ($propre) {
        $reg['reglages'] = array_merge(is_array($reg['reglages'] ?? null) ? $reg['reglages'] : [], $propre);
        $reg['reglages']['maj'] = date('c');
    });
    $db = vrt_load_db() ?: [];
    vrt_pay_log('[CODE_AMI_REGLAGES] ' . json_encode($propre));
    parr_out(['ok' => true, 'regle' => vrt_parr_cfg($db)]);
}

// Paiement encaissé HORS passerelle (espèces, dépôt sur le numéro du centre),
// validé par l'administration : même règle, même registre, même idempotence.
if ($action === 'crediter' && $method === 'POST') {
    parr_exiger_admin();
    $in = parr_entree();
    $ref = substr(trim((string) ($in['ref'] ?? '')), 0, 100);
    $montant = max(0, (int) ($in['montant'] ?? 0));
    if ($ref === '' || $montant <= 0) parr_out(['ok' => false, 'error' => 'ref et montant requis'], 400);
    $db = vrt_load_db();
    if (!is_array($db)) parr_out(['ok' => false, 'error' => 'Base indisponible'], 503);
    $ctx = [
        'code' => substr(trim((string) ($in['code'] ?? '')), 0, 32),
        'accountId' => substr(trim((string) ($in['accountId'] ?? '')), 0, 64),
        'tel' => (string) ($in['tel'] ?? ''), 'intent' => substr(preg_replace('/[^a-z_]/', '', strtolower((string) ($in['intent'] ?? ''))), 0, 30),
        'targetId' => substr(trim((string) ($in['targetId'] ?? '')), 0, 64), 'prix' => $montant,
    ];
    $ev = vrt_parr_evaluer($db, vrt_parr_lire(), $ctx);
    $etat = vrt_parr_pour_etat($ev);
    if (!$etat || empty($etat['benef'])) parr_out(['ok' => true, 'commission' => 0, 'message' => $ev['motif'] ?: 'Aucun parrain concerné par ce paiement.']);
    $r = vrt_parr_crediter_fichier([
        'ref' => $ref, 'montant' => $montant, 'montant_paye' => $montant, 'intent' => $ctx['intent'],
        'targetId' => $ctx['targetId'], 'accountId' => $ctx['accountId'], 'clientTel' => $ctx['tel'],
        'label' => substr((string) ($in['label'] ?? 'Paiement validé à la main'), 0, 80), 'parrainage' => $etat,
    ]);
    parr_out(['ok' => !empty($r['ok']), 'deja' => !empty($r['deja']), 'commission' => (int) ($r['commission'] ?? 0),
              'aVerser' => !empty($r['aVerser']), 'message' => !empty($r['deja']) ? 'Déjà crédité pour cette référence.' : '']);
}

if ($action === 'versement_regler' && $method === 'POST') {
    parr_exiger_admin();
    $in = parr_entree();
    $ref = preg_replace('/[^A-Za-z0-9\-]/', '', (string) ($in['ref'] ?? ''));
    $etat = (string) ($in['etat'] ?? '');
    if (strpos($ref, 'PAR-') !== 0 || !in_array($etat, ['verse', 'echec'], true)) {
        parr_out(['ok' => false, 'error' => 'ref PAR-… et etat verse|echec requis'], 400);
    }
    $ok = vrt_parr_versement_etat($ref, $etat, $etat === 'echec' ? 'Annulé par l’administration après vérification' : '');
    vrt_pay_log('[CODE_AMI_REGLEMENT_MANUEL] ref=' . $ref . ' etat=' . $etat . ' ok=' . ($ok ? 1 : 0));
    parr_out(['ok' => $ok]);
}

parr_out(['ok' => false, 'error' => 'Action inconnue'], 400);
