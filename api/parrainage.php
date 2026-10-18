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
    /* Un DEVIS, pas une décision : c'est ?action=init qui tranche, sur les lignes
       réellement reçues. Un navigateur qui se dirait « physique » ici puis
       enverrait des lignes numériques au débit se verrait refuser le code là-bas. */
    $panierPhysique = ($intent === 'cart') && vrt_parr_panier_physique($in['lignes'] ?? null);
    $ev = vrt_parr_evaluer($db, $reg, [
        'code' => $code, 'accountId' => $acc ? (string) ($acc['id'] ?? '') : '',
        'tel' => (string) ($in['tel'] ?? ''), 'intent' => $intent, 'targetId' => $targetId, 'prix' => $prix,
        'panierPhysique' => $panierPhysique,
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
    foreach (['remisePct', 'commissionPct', 'seuilVersement', 'commissionPartenairePct',
              'cogerantsPct', 'partenaireJours', 'partenaireSeuil'] as $k) {
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

// Versement fait à la main (Mobile Money envoyé depuis le téléphone du centre).
if ($action === 'versement_manuel' && $method === 'POST') {
    parr_exiger_admin();
    $in = parr_entree();
    $benef = substr(trim((string) ($in['benef'] ?? '')), 0, 80);
    $montant = (int) ($in['montant'] ?? 0);
    if (!preg_match('/^(acc|prt|ens):[A-Za-z0-9_.\-]{1,64}$/', $benef)) parr_out(['ok' => false, 'error' => 'benef invalide'], 400);
    $db = vrt_load_db() ?: [];
    $pers = vrt_parr_personne($db, $benef);
    $r = vrt_parr_versement_manuel($benef, $montant, $pers ? vrt_parr_tel9((string) $pers['tel']) : '',
        $pers ? trim($pers['pre'] . ' ' . $pers['nom']) : '', substr(trim((string) ($in['note'] ?? '')), 0, 120));
    vrt_pay_log('[CODE_AMI_VERSEMENT_MANUEL] benef=' . $benef . ' montant=' . $montant . ' ok=' . (!empty($r['ok']) ? 1 : 0));
    parr_out($r);
}

/* ═══════════════════════════ TABLEAU DE BORD FINANCIER (18/10/2026) ═════════
   Lecture SEULE des paiements : contrairement à payment_camerpay.php?action=list,
   ces actions ne rejouent aucun octroi et ne closent rien — on peut rafraîchir
   le tableau de bord autant qu'on veut sans effet de bord.
   ─────────────────────────────────────────────────────────────────────────── */

/** Statut normalisé : reussi · echoue · attente · rembourse. */
function parr_statut_normal(string $st): string {
    $st = strtolower($st);
    if (in_array($st, ['paid', 'success', 'successful', 'completed', 'complete', 'granted'], true)) return 'reussi';
    if (in_array($st, ['refunded'], true)) return 'rembourse';
    if (in_array($st, ['failed', 'cancelled', 'canceled', 'expired', 'abandoned', 'rejected', 'rejete', 'underpaid', 'refuse'], true)) return 'echoue';
    return 'attente';
}

/** Toutes les transactions connues du serveur, normalisées, plus récentes d'abord. */
function parr_transactions(int $jours): array {
    $depuis = time() - $jours * 86400;
    $out = [];
    $ops = vrt_parr_lire()['ops'] ?? [];
    $dir = __DIR__ . '/data/payments/';
    foreach ((glob($dir . '*.json') ?: []) as $f) {
        if (basename($f)[0] === '_') continue;
        $p = json_decode((string) @file_get_contents($f), true);
        if (!is_array($p)) continue;
        $prov = (string) ($p['provider'] ?? '');
        if (!in_array($prov, ['skysms', 'camerpay_cm', 'camerpay'], true)) continue;   // les versements sortants n'en sont pas
        $t = strtotime((string) ($p['created_at'] ?? '')) ?: (int) @filemtime($f);
        if ($t < $depuis) continue;
        $ref = (string) ($p['ref'] ?? '');
        $tel = vrt_parr_tel9((string) ($p['clientTel'] ?? $p['clientTelInit'] ?? ''));
        $op  = $ops['r:' . $ref] ?? null;
        $out[] = [
            'ref' => $ref, 't' => $t, 'source' => $prov === 'skysms' ? 'SkySMS' : 'CamerPay',
            'operateur' => $tel !== '' ? (vrt_parr_methode($tel) === 'mtn_momo' ? 'MTN' : 'Orange') : (string) ($p['operator'] ?? ''),
            'tel' => $tel, 'nom' => (string) ($p['clientNom'] ?? ''),
            'montant' => (int) ($p['montant'] ?? 0), 'statut' => parr_statut_normal((string) ($p['status'] ?? '')),
            'statutBrut' => (string) ($p['status'] ?? ''), 'aRegler' => !empty($p['a_regler']),
            'accorde' => !empty($p['granted']), 'quoi' => mb_substr((string) ($p['label'] ?? $p['intent'] ?? ''), 0, 80),
            'intent' => (string) ($p['intent'] ?? ''), 'code' => (string) ($p['parrainage']['code'] ?? ''),
            'commission' => is_array($op) ? (int) ($op['c'] ?? 0) - (int) ($op['annule'] ?? 0) : 0,
            'motif' => mb_substr((string) ($p['failure_reason'] ?? $p['reason'] ?? ''), 0, 160),
            'payeLe' => (string) ($p['paid_at'] ?? ''), 'test' => !empty($p['sandbox']),
        ];
    }
    // Paiements par code marchand, déclarés par l'acheteur puis validés à la main.
    /* Le dossier est lu DIRECTEMENT (même règle que vrt_pm_dir) : charger
       _manuel_lib.php tirerait ses propres dépendances, et une seule absente
       ferait tomber tout le tableau de bord pour une lecture. */
    $pmDir = rtrim(defined('VRT_PM_DIR') ? (string) VRT_PM_DIR : __DIR__ . '/data/payments_manuel', '/') . '/';
    if (is_dir($pmDir)) {
        {
            foreach ((glob($pmDir . 'manuel_*.json') ?: []) as $f) {
                $s = json_decode((string) @file_get_contents($f), true);
                if (!is_array($s)) continue;
                $t = strtotime((string) ($s['declared_at'] ?? $s['created_at'] ?? '')) ?: (int) @filemtime($f);
                if ($t < $depuis) continue;
                $ref = (string) ($s['ref'] ?? '');
                $tel = vrt_parr_tel9((string) ($s['clientTel'] ?? ''));
                $st  = (string) ($s['status'] ?? '');
                $op  = $ops['r:' . $ref] ?? null;
                $out[] = [
                    'ref' => $ref, 't' => $t, 'source' => 'Code marchand',
                    'operateur' => $tel !== '' ? (vrt_parr_methode($tel) === 'mtn_momo' ? 'MTN' : 'Orange') : (string) ($s['moyen'] ?? ''),
                    'tel' => $tel, 'nom' => (string) ($s['clientNom'] ?? ''), 'montant' => (int) ($s['montant'] ?? 0),
                    'statut' => !empty($s['granted']) ? 'reussi' : ($st === 'declare' ? 'attente' : parr_statut_normal($st)),
                    'statutBrut' => $st === 'declare' ? 'déclaré, à vérifier' : $st, 'aRegler' => !empty($s['a_regler']),
                    'accorde' => !empty($s['granted']), 'quoi' => mb_substr((string) ($s['label'] ?? $s['intent'] ?? ''), 0, 80),
                    'intent' => (string) ($s['intent'] ?? ''), 'code' => (string) ($s['parrainage']['code'] ?? ''),
                    'commission' => is_array($op) ? (int) ($op['c'] ?? 0) - (int) ($op['annule'] ?? 0) : 0,
                    'motif' => mb_substr((string) ($s['grant']['msg'] ?? ''), 0, 160), 'payeLe' => (string) ($s['paid_at'] ?? ''), 'test' => false,
                ];
            }
        }
    }
    usort($out, function ($a, $b) { return $b['t'] - $a['t']; });
    return $out;
}

if ($action === 'transactions') {
    parr_exiger_admin();
    $jours = max(1, min(400, (int) ($_GET['jours'] ?? 90)));
    $tx = parr_transactions($jours);
    $tot = ['n' => 0, 'reussi' => 0, 'echoue' => 0, 'attente' => 0, 'rembourse' => 0, 'aRegler' => 0,
            'encaisse' => 0, 'echoueMontant' => 0, 'attenteMontant' => 0, 'commissions' => 0, 'avecCode' => 0, 'test' => 0];
    $parOp = []; $parSource = []; $parMois = []; $parProduit = []; $payeurs = [];
    $m0 = date('Y-m'); $ceMois = ['n' => 0, 'reussi' => 0, 'encaisse' => 0];
    foreach ($tx as $r) {
        if ($r['test']) { $tot['test']++; continue; }
        $tot['n']++; $tot[$r['statut']]++;
        if ($r['aRegler']) $tot['aRegler']++;
        if ($r['code'] !== '') $tot['avecCode']++;
        $tot['commissions'] += $r['commission'];
        $o = $r['operateur'] !== '' ? $r['operateur'] : 'Inconnu';
        if (!isset($parOp[$o])) $parOp[$o] = ['n' => 0, 'reussi' => 0, 'encaisse' => 0];
        $parOp[$o]['n']++;
        if (!isset($parSource[$r['source']])) $parSource[$r['source']] = ['n' => 0, 'reussi' => 0, 'encaisse' => 0];
        $parSource[$r['source']]['n']++;
        $mm = date('Y-m', $r['t']);
        if (!isset($parMois[$mm])) $parMois[$mm] = ['n' => 0, 'reussi' => 0, 'echoue' => 0, 'encaisse' => 0];
        $parMois[$mm]['n']++;
        if ($mm === $m0) $ceMois['n']++;
        if ($r['statut'] === 'reussi') {
            $tot['encaisse'] += $r['montant'];
            $parOp[$o]['reussi']++; $parOp[$o]['encaisse'] += $r['montant'];
            $parSource[$r['source']]['reussi']++; $parSource[$r['source']]['encaisse'] += $r['montant'];
            $parMois[$mm]['reussi']++; $parMois[$mm]['encaisse'] += $r['montant'];
            if ($mm === $m0) { $ceMois['reussi']++; $ceMois['encaisse'] += $r['montant']; }
            $q = $r['quoi'] !== '' ? $r['quoi'] : $r['intent'];
            if (!isset($parProduit[$q])) $parProduit[$q] = ['n' => 0, 'encaisse' => 0];
            $parProduit[$q]['n']++; $parProduit[$q]['encaisse'] += $r['montant'];
            if ($r['tel'] !== '') $payeurs[$r['tel']] = true;
        } elseif ($r['statut'] === 'echoue') {
            $tot['echoueMontant'] += $r['montant']; $parMois[$mm]['echoue']++;
        } elseif ($r['statut'] === 'attente') {
            $tot['attenteMontant'] += $r['montant'];
        }
    }
    ksort($parMois);
    uasort($parProduit, function ($a, $b) { return $b['encaisse'] - $a['encaisse']; });
    $clos = $tot['reussi'] + $tot['echoue'];
    $tot['tauxReussite'] = $clos > 0 ? round(100 * $tot['reussi'] / $clos, 1) : null;
    $tot['panierMoyen'] = $tot['reussi'] > 0 ? (int) round($tot['encaisse'] / $tot['reussi']) : 0;
    $tot['payeursUniques'] = count($payeurs);
    $reg = vrt_parr_lire();
    $du = 0;
    foreach (($reg['comptes'] ?? []) as $c) { if (is_array($c)) $du += max(0, (int) ($c['solde'] ?? 0)); }
    parr_out(['ok' => true, 'jours' => $jours, 'totaux' => $tot, 'ceMois' => $ceMois,
              'commissionsDues' => $du, 'repartition' => vrt_parr_repartition_totaux($reg),
              'parOperateur' => $parOp, 'parSource' => $parSource, 'parMois' => $parMois,
              'parProduit' => array_slice($parProduit, 0, 12, true), 'transactions' => array_slice($tx, 0, 1500)]);
}

/* Le journal : ce que le serveur a écrit à chaque décision d'argent. */
if ($action === 'journal') {
    parr_exiger_admin();
    $n = max(20, min(1000, (int) ($_GET['n'] ?? 300)));
    $q = mb_strtolower(trim((string) ($_GET['q'] ?? '')));
    $sources = [
        'Paiements'   => __DIR__ . '/data/payments/_webhook_camerpay_log.txt',
        'Commissions' => __DIR__ . '/data/_commissions_log.txt',
    ];
    $lignes = [];
    foreach ($sources as $nom => $f) {
        if (!is_file($f)) continue;
        $tout = @file($f, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES) ?: [];
        foreach (array_slice($tout, -2000) as $l) {
            if ($q !== '' && mb_strpos(mb_strtolower($l), $q) === false) continue;
            $t = 0;
            if (preg_match('/^(\d{4}-\d{2}-\d{2}T[\d:]+[+\-]\d{2}:\d{2})/', $l, $m)) $t = (int) strtotime($m[1]);
            $type = preg_match('/\[([A-Z0-9_]+)\]/', $l, $m2) ? $m2[1] : '';
            $lignes[] = ['t' => $t, 'source' => $nom, 'type' => $type, 'texte' => mb_substr($l, 0, 400)];
        }
    }
    usort($lignes, function ($a, $b) { return $b['t'] - $a['t']; });
    $types = [];
    foreach ($lignes as $l) { if ($l['type'] !== '') $types[$l['type']] = ($types[$l['type']] ?? 0) + 1; }
    arsort($types);
    parr_out(['ok' => true, 'lignes' => array_slice($lignes, 0, $n), 'types' => array_slice($types, 0, 30, true)]);
}

/* VERSEMENTS DE FIN DE MOIS — aucun fournisseur ne verse : le Centre paie les
   soldes à la main, puis les enregistre ici en une fois. */
if ($action === 'versements_mois') {
    parr_exiger_admin();
    $db = vrt_load_db() ?: [];
    if ($method === 'POST') {
        $in = parr_entree();
        $res = [];
        foreach (array_slice((array) ($in['lignes'] ?? []), 0, 300) as $l) {
            if (!is_array($l)) continue;
            $benef = substr(trim((string) ($l['benef'] ?? '')), 0, 80);
            if (!preg_match('/^(acc|prt|ens):[A-Za-z0-9_.\-]{1,64}$/', $benef)) { $res[] = ['benef' => $benef, 'ok' => false, 'error' => 'benef invalide']; continue; }
            $pers = vrt_parr_personne($db, $benef);
            $r = vrt_parr_versement_manuel($benef, (int) ($l['montant'] ?? 0), $pers ? vrt_parr_tel9((string) $pers['tel']) : '',
                $pers ? trim($pers['pre'] . ' ' . $pers['nom']) : '', substr(trim((string) ($l['note'] ?? 'Versement de fin de mois')), 0, 120));
            vrt_pay_log('[VERSEMENT_MOIS] benef=' . $benef . ' montant=' . (int) ($l['montant'] ?? 0) . ' ok=' . (!empty($r['ok']) ? 1 : 0));
            $res[] = ['benef' => $benef] + $r;
        }
        parr_out(['ok' => true, 'resultats' => $res]);
    }
    $reg = vrt_parr_lire();
    $cfg = vrt_parr_cfg($db, $reg);
    $lignes = []; $total = 0; $aPayer = 0;
    foreach (($reg['comptes'] ?? []) as $b => $c) {
        if (!is_array($c)) continue;
        $solde = (int) ($c['solde'] ?? 0);
        if ($solde <= 0) continue;
        $b = (string) $b;
        $pers = vrt_parr_personne($db, $b);
        $dest = vrt_parr_destination($db, $reg, $b);
        $tel = !empty($dest['ok']) ? substr((string) $dest['tel'], 3) : ($pers ? vrt_parr_tel9((string) $pers['tel']) : '');
        $atteint = $solde >= (int) $cfg['seuilVersement'];
        $lignes[] = ['benef' => $b, 'nom' => $pers ? trim($pers['pre'] . ' ' . $pers['nom']) : '(introuvable)',
                     'code' => $pers ? ($pers['code'] !== '' ? $pers['code'] : vrt_parr_code_pour_id($pers['id'])) : '',
                     'partenaire' => (bool) vrt_parr_partenaire_de($reg, $b), 'tel' => $tel,
                     'operateur' => $tel !== '' ? (vrt_parr_methode($tel) === 'mtn_momo' ? 'MTN MoMo' : 'Orange Money') : '',
                     'solde' => $solde, 'enCours' => (int) ($c['enCours'] ?? 0), 'gagne' => (int) ($c['gagne'] ?? 0),
                     'verse' => (int) ($c['verse'] ?? 0), 'seuilAtteint' => $atteint, 'blocage' => (string) ($dest['motif'] ?? '')];
        $total += $solde; if ($atteint) $aPayer += $solde;
    }
    usort($lignes, function ($a, $b) { return $b['solde'] - $a['solde']; });
    parr_out(['ok' => true, 'mois' => date('Y-m'), 'echeance' => date('Y-m-t'), 'seuil' => (int) $cfg['seuilVersement'],
              'total' => $total, 'aPayer' => $aPayer, 'lignes' => $lignes]);
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
