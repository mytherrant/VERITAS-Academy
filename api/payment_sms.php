<?php
// ============================================================
// VÉRITAS — RÉCEPTION DES SMS DU TÉLÉPHONE MARCHAND
// © 2024-2026 Jacques Miterand TAKOU (Mythe Errant). Tous droits réservés.
// ------------------------------------------------------------
// Une application de relais installée sur le téléphone qui porte les codes
// marchands (MTN MoMo, Orange Money) pousse ici chaque SMS reçu. Le
// rapprochement (_rapprochement_lib.php) sert la commande déclarée quand la
// preuve est complète — sinon la commande reste dans la file humaine.
//
// ACTIONS
//   POST ?action=recu      — le RELAIS. Clé : en-tête « X-VRT-Cle » ou ?cle=…
//                            (SMS_WEBHOOK_SECRET). Corps JSON ou formulaire :
//                            expéditeur  from|sender|expediteur|number|phone
//                            texte       text|message|body|msg|content|sms
//   ── réservées à l'administration (Bearer API_SECRET) ──
//   GET  ?action=etat      — chaînes des soldes + derniers SMS
//   POST ?action=ancrer    { operateur: mtn|orange, solde, par }
//   POST ?action=analyser  { texte, expediteur } — lecture seule, n'accorde rien
//
// Tant que SMS_WEBHOOK_SECRET n'est pas posé (24 caractères au moins) dans
// payment_config.php, `recu` répond 503 et RIEN n'est automatique.
// ============================================================

@ini_set('display_errors', '0');

// Une erreur fatale au chargement (bibliothèque absente, redéclaration…) ne
// laisse qu'un 500 muet : on la rend lisible — type, fichier (nom seul), ligne,
// message sans chemin absolu. La sonde de production du déploiement la lit.
register_shutdown_function(function () {
    $e = error_get_last();
    if (!$e || !in_array($e['type'], [E_ERROR, E_PARSE, E_CORE_ERROR, E_COMPILE_ERROR], true)) return;
    if (!headers_sent()) { http_response_code(500); header('Content-Type: application/json; charset=utf-8'); }
    $msg = str_replace([__DIR__ . '/', dirname(__DIR__) . '/'], '', (string) $e['message']);
    echo json_encode(['error' => 'Erreur fatale', 'fatal' => [
        'type' => $e['type'], 'fichier' => basename((string) $e['file']), 'ligne' => $e['line'],
        'message' => substr($msg, 0, 300)]], JSON_UNESCAPED_UNICODE);
});

require_once __DIR__ . '/config_sync.php';          // payment_config.php + requireAuth()
require_once __DIR__ . '/_rapprochement_lib.php';

header('Content-Type: application/json; charset=utf-8');
header('X-Content-Type-Options: nosniff');

function psOut($d, $c = 200) { http_response_code($c); echo json_encode($d, JSON_UNESCAPED_UNICODE); exit; }

$action = $_GET['action'] ?? '';
$method = $_SERVER['REQUEST_METHOD'] ?? 'GET';

// ════════════════════════════════════════════════════════════
// RECU — le relais du téléphone marchand
// ════════════════════════════════════════════════════════════
if ($action === 'recu') {
    if (!vrt_sms_actif()) psOut(['error' => 'Rapprochement SMS non configuré.'], 503);
    if ($method !== 'POST') psOut(['error' => 'POST attendu.'], 405);

    $cle = (string) ($_SERVER['HTTP_X_VRT_CLE'] ?? ($_GET['cle'] ?? ''));
    if ($cle === '' || !hash_equals((string) SMS_WEBHOOK_SECRET, $cle)) {
        vrt_sms_log('[CLE_REFUSEE] ip=' . substr(hash('sha256', (string) ($_SERVER['REMOTE_ADDR'] ?? '')), 0, 12));
        psOut(['error' => 'Clé refusée.'], 401);
    }

    $brut = (string) file_get_contents('php://input');
    $in = json_decode($brut, true);
    if (!is_array($in)) $in = $_POST ?: [];
    $pick = function (array $keys) use ($in) {
        foreach ($keys as $k) { if (isset($in[$k]) && is_scalar($in[$k]) && trim((string) $in[$k]) !== '') return trim((string) $in[$k]); }
        return '';
    };
    $exp   = $pick(['from', 'sender', 'expediteur', 'number', 'phone', 'address']);
    $texte = $pick(['text', 'message', 'body', 'msg', 'content', 'sms']);
    if ($texte === '' && !is_array(json_decode($brut, true)) && empty($_POST)) $texte = trim($brut);
    if ($texte === '') psOut(['error' => 'Texte du SMS absent.'], 400);

    try {
        $r = vrt_sms_traiter($texte, $exp);
    } catch (\Throwable $e) {
        vrt_sms_log('[ERREUR] ' . $e->getMessage());
        // 200 quand même : le relais rejouerait sans fin une erreur de notre côté.
        psOut(['ok' => false, 'error' => 'Traitement impossible, SMS conservé pour la validation manuelle.']);
    }
    psOut($r);
}

// ── Tout ce qui suit est réservé à l'administration ─────────────────────────
requireAuth();

if ($action === 'etat') psOut(['ok' => true] + vrt_sms_etat());

if ($action === 'ancrer' && $method === 'POST') {
    $in = json_decode((string) file_get_contents('php://input'), true) ?: [];
    $r = vrt_sms_ancrer((string) ($in['operateur'] ?? ''), (int) ($in['solde'] ?? -1), substr((string) ($in['par'] ?? ''), 0, 60));
    psOut($r, $r['ok'] ? 200 : 400);
}

if ($action === 'analyser' && $method === 'POST') {
    $in = json_decode((string) file_get_contents('php://input'), true) ?: [];
    $t = (string) ($in['texte'] ?? ''); $e = (string) ($in['expediteur'] ?? '');
    psOut(['ok' => true, 'lecture' => vrt_sms_analyser($t, $e), 'expediteurAdmis' => vrt_sms_expediteur_admis($e)]);
}

psOut(['error' => 'Action inconnue.'], 400);
