<?php
/**
 * api/apprendre.php — Suite des leçons réservées aux abonnés (espace Apprendre)
 * © 2024-2026 Jacques Miterand TAKOU (Mythe Errant). Tous droits réservés.
 *
 * BUT — le début d'une leçon (titre, objectifs, première partie) est public ; la
 * suite, la fiche de révision et le quiz ne sortent d'ici que pour un compte
 * dont la formule est active. Le dépôt est PUBLIC : un verrou posé seulement
 * dans le navigateur laisserait tout lisible dans les fichiers statiques.
 *
 * DONNÉES — uploads/protected/apprendre/<id>.json (gitignoré, déposé par FTP).
 *
 * USAGE — POST {id, token} ou POST {id, login, password}
 * RÉPONSES — toujours 200 pour un refus ORDINAIRE, avec {ok:false, raison} :
 *   connexion | identifiants | abonnement | non_depose | debit
 *   classe_a_choisir (place libre : renvoyer {retenir:true} pour la prendre)
 *   classe_hors_formule (toutes les classes de la formule sont prises)
 * POST {action:"droits", token} → ce que la formule du compte ouvre (droits + classes).
 * POST {action:"liberer", classe, token} → libère une classe retenue depuis plus de 30 jours.
 * POST {action:"labo", id, token} → protocole et quiz d'un labo premium (droit « labos » ou essai).
 * POST {action:"achat", id, ref, cle} → épreuve séquentielle / examen blanc achetée à l'unité,
 *   sans compte (150 F) : raisons achat_invalide | achat_en_attente | achat_a_regler | non_depose.
 *   L'hébergeur bannit une IP à 6 réponses 401/403/429 par minute, et une classe
 *   entière partage une IP : un élève sans formule n'est pas une attaque.
 * Champ facultatif pdf:"enonce"|"corrige" (avec {id, token} ou l'achat) → le PDF de l'épreuve
 *   (application/pdf), sous le même verrou que la suite ; refus en JSON comme ailleurs.
 */
declare(strict_types=1);
require_once __DIR__ . '/_json_boot.php';
ob_start();
require_once __DIR__ . '/_auth_lib.php';

$__allowed = [
    'https://veritas-school.com', 'https://www.veritas-school.com',
    'http://localhost:8000', 'http://localhost:8077', 'https://localhost', 'capacitor://localhost',
];
$__origin = $_SERVER['HTTP_ORIGIN'] ?? '';
if (in_array($__origin, $__allowed, true)) {
    header('Access-Control-Allow-Origin: ' . $__origin);
    header('Vary: Origin');
}
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
header('Access-Control-Expose-Headers: X-Vrt-Token');   // jeton renouvelé joint à un PDF (appli mobile)
header('X-Content-Type-Options: nosniff');
header('Referrer-Policy: no-referrer');
header('Cache-Control: private, no-store');
if (($_SERVER['REQUEST_METHOD'] ?? '') === 'OPTIONS') { http_response_code(204); exit; }

require_once __DIR__ . '/_sentinel.php';
vrt_sentinelle('telechargement');

function appr_rep(array $r, int $code = 200): void {
    while (ob_get_level() > 0) { ob_end_clean(); }
    http_response_code($code);
    header('Content-Type: application/json; charset=utf-8');
    echo json_encode($r, JSON_UNESCAPED_UNICODE);
    exit;
}
function appr_refus(string $raison, string $jeton = ''): void {
    $r = ['ok' => false, 'raison' => $raison];
    if ($jeton !== '') $r['token'] = $jeton;
    appr_rep($r);
}

/* PDF DE L'ÉPREUVE (16/11/2026) — énoncé et corrigé compilés en LaTeX
   (tools/latex/sequentielles_pdf.cjs), déposés par FTP à côté du .json :
   uploads/protected/apprendre/<id>-enonce.pdf et <id>-corrige.pdf.
   Servis sous le MÊME verrou que la suite du sujet : la fonction n'est appelée
   qu'une fois l'abonnement ou l'achat vérifiés. */
function appr_servir_pdf(string $id, string $nature, string $jeton = ''): void {
    if (!in_array($nature, ['enonce', 'corrige'], true)) appr_rep(['ok' => false, 'error' => 'Document inconnu'], 400);
    $f = dirname(__DIR__) . '/uploads/protected/apprendre/' . $id . '-' . $nature . '.pdf';
    // Taille lue AVANT de vider le tampon : un fichier en cours de dépôt FTP se refuse en JSON.
    $n = is_file($f) && is_readable($f) ? @filesize($f) : false;
    if ($n === false || $n === 0) {
        @file_put_contents(__DIR__ . '/data/_security_log.txt', date('c') . ' [APPRENDRE_PDF_NON_DEPOSE] id=' . $id . ' ' . $nature . "\n", FILE_APPEND);
        appr_refus('non_depose', $jeton);
    }
    while (ob_get_level() > 0) { ob_end_clean(); }
    header('Content-Type: application/pdf');
    header('Content-Length: ' . $n);
    header('Content-Disposition: inline; filename="' . $id . '-' . $nature . '.pdf"');
    if ($jeton !== '') header('X-Vrt-Token: ' . $jeton);
    readfile($f);
    exit;
}

/** Toute formule élève ou enseignant active ouvre les cours : même règle que _aiTier() côté client. */
function appr_a_une_formule(array $acc, array $db): bool {
    return (bool) array_intersect(vrt_effective_plantags($acc, $db), ['plan1', 'plan2', 'plan3', 'plan4', 'plan5', 'plan6']);
}

if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST') appr_rep(['ok' => false, 'error' => 'Méthode non autorisée'], 405);
if (vrt_rate_exceeded('apprendre', 240)) appr_refus('debit');

$in = json_decode((string) file_get_contents('php://input'), true);
if (!is_array($in)) appr_rep(['ok' => false, 'error' => 'Requête illisible'], 400);

$id = (string) ($in['id'] ?? '');
/* L'identifiant construit un chemin de fichier : liste blanche stricte, ni point ni barre. */
if (!preg_match('/^[a-z0-9][a-z0-9-]{2,80}$/', $id)) appr_rep(['ok' => false, 'error' => 'Identifiant invalide'], 400);

/* ÉPREUVE ACHETÉE À L'UNITÉ, SANS COMPTE (15/11/2026) — 150 F l'épreuve et son corrigé.
   L'appareil qui a payé garde la référence et une clé secrète tirée au hasard ; le
   paiement n'en a gardé que l'empreinte (payment_camerpay.php, init). Il faut les
   deux, et un paiement « payé » ET « octroyé » (montant contrôlé) pour cette
   épreuve-là : une référence se devine, la clé non. */
if (($in['action'] ?? '') === 'achat') {
    $refA = (string) ($in['ref'] ?? '');
    $cleA = (string) ($in['cle'] ?? '');
    if (!preg_match('/^[A-Za-z0-9_-]{4,64}$/', $refA) || !preg_match('/^[a-f0-9]{32,128}$/', $cleA)) appr_refus('achat_invalide');
    $fA = __DIR__ . '/data/payments/camerpay_' . preg_replace('/[^a-zA-Z0-9_\-]/', '_', $refA) . '.json';
    $st = is_file($fA) ? json_decode((string) @file_get_contents($fA), true) : null;
    // L'état peut être en cours de réécriture (rappel, réconciliation) : une seconde lecture.
    if (!is_array($st) && is_file($fA)) { usleep(150000); $st = json_decode((string) @file_get_contents($fA), true); }
    if (!is_array($st) || ($st['intent'] ?? '') !== 'sequentielle' || (string) ($st['targetId'] ?? '') !== $id
        || (string) ($st['cle_hash'] ?? '') === '' || !hash_equals((string) $st['cle_hash'], hash('sha256', $cleA))) {
        appr_refus('achat_invalide');
    }
    if (($st['status'] ?? '') !== 'paid') appr_refus('achat_en_attente');
    if (empty($st['granted']) || !empty($st['underpaid'])) appr_refus('achat_a_regler');
    if (isset($in['pdf'])) appr_servir_pdf($id, (string) $in['pdf']);
    $fS = dirname(__DIR__) . '/uploads/protected/apprendre/' . $id . '.json';
    $suiteA = is_file($fS) ? json_decode((string) file_get_contents($fS), true) : null;
    if (!is_array($suiteA)) {
        @file_put_contents(__DIR__ . '/data/_security_log.txt', date('c') . ' [APPRENDRE_NON_DEPOSE] id=' . $id . " (achat)\n", FILE_APPEND);
        appr_refus('non_depose');
    }
    appr_rep(['ok' => true, 'suite' => $suiteA, 'achat' => true]);
}

$db = vrt_load_db();
if (!is_array($db)) appr_rep(['ok' => false, 'error' => 'Base indisponible'], 503);

$token = (string) ($in['token'] ?? '');
$login = trim((string) ($in['login'] ?? ''));
$pass  = (string) ($in['password'] ?? '');
$acc = null; $nouveau = '';

if ($token !== '') {
    $res = vrt_verify_token($token, $db);
    if ($res !== null) $acc = $res['acc'];
}
if ($acc === null && $login !== '' && $pass !== '') {
    /* Essais de mot de passe bornés à part : la lecture des leçons a son propre plafond, large. */
    if (vrt_rate_exceeded('apprendre_login', 12)) appr_refus('debit');
    $found = vrt_find_account($db, $login);
    $need = false;
    if ($found !== null && vrt_verify_password($pass, (string) ($found['acc']['pwd'] ?? ''), (string) $found['acc']['user'], $need)) {
        $acc = $found['acc'];
        $nouveau = vrt_issue_token($acc, (string) $found['type']);
    } else {
        @file_put_contents(__DIR__ . '/data/_security_log.txt',
            date('c') . ' [APPRENDRE_AUTH_FAIL] ip=' . vrt_client_ip() . "\n", FILE_APPEND);
        appr_refus('identifiants');
    }
}
if ($acc === null) appr_refus('connexion');

$droits = vrt_droits_compte($acc, $db);
$role = strtolower((string) ($acc['role'] ?? ''));
/* Rôle « enseignant » déclaré à l'inscription ou né dans l'Atelier : plus de passe-droit (vrt_compte_equipe). */
if (vrt_compte_equipe($acc)) $droits['classes'] = -1;

/* Ce que la formule ouvre : lu par les pages pour afficher les bons verrous. */
if (($in['action'] ?? '') === 'droits') {
    $r = ['ok' => true, 'droits' => $droits, 'classes' => array_keys(vrt_classes_compte($acc))];
    if ($nouveau !== '') $r['token'] = $nouveau;
    appr_rep($r);
}

/* LABO PREMIUM : protocole et quiz, sortis du module public le 12/11/2026.
   Ouverts avec le droit « labos » (Pro et au-dessus), sinon à l'essai
   (labosEssai labos distincts par 7 jours : 2 en Starter, 1 sans formule). */
if (($in['action'] ?? '') === 'labo') {
    $labos = require __DIR__ . '/_labos_premium.php';
    if (!is_array($labos) || !isset($labos[$id])) appr_rep(['ok' => false, 'raison' => 'introuvable']);
    $admin = vrt_compte_equipe($acc);
    if (!$admin && empty($droits['labos']) && !vrt_labo_essai($acc, $id, (int) ($droits['labosEssai'] ?? 0))) {
        appr_refus((int) ($droits['labosEssai'] ?? 0) > 0 ? 'essais' : 'abonnement', $nouveau);
    }
    $r = ['ok' => true, 'labo' => $labos[$id]];
    if ($nouveau !== '') $r['token'] = $nouveau;
    appr_rep($r);
}

/* Changer de classe : une classe retenue depuis plus de 30 jours se libère. */
if (($in['action'] ?? '') === 'liberer') {
    $c = (string) ($in['classe'] ?? '');
    $okL = preg_match('/^[a-z0-9-]{2,12}$/', $c) && vrt_classe_liberer($acc, $c);
    appr_rep(['ok' => (bool) $okL, 'classes' => array_keys(vrt_classes_compte($acc))]);
}

/* Épreuve achetée à l'unité et rattachée au compte (connecté au paiement, ou
   retrouvé par le numéro qui a payé) : ouverte sans formule ni place de classe. */
$achetee = in_array('sequentielle:' . $id, (array) ($acc['unlockedUnits'] ?? []), true);
if (!$achetee && !appr_a_une_formule($acc, $db)) appr_refus('abonnement', $nouveau);

/* CLASSES DE LA FORMULE (12/11/2026). Starter et Pro ouvrent 1 classe,
   Élite 2, Famille 4, les formules enseignant 3, 6 ou toutes. La classe se
   retient à la première leçon ouverte, APRÈS confirmation : un clic égaré
   ne doit pas consommer la place. */
$classe = vrt_classe_de_lecon($id);
$etat = $achetee ? 'ok' : vrt_classe_couverte($acc, $droits, $classe, !empty($in['retenir']));
if ($etat !== 'ok') {
    $r = ['ok' => false, 'raison' => $etat === 'complet' ? 'classe_hors_formule' : 'classe_a_choisir',
          'classe' => $classe, 'classes' => array_keys(vrt_classes_compte($acc)), 'max' => (int) $droits['classes']];
    if ($nouveau !== '') $r['token'] = $nouveau;
    appr_rep($r);
}

/* PDF d'un abonné : compté avec les fiches (vrt_quota_fiches, fenêtres 24 h / 7 j / 30 j).
   Énoncé et corrigé d'une même épreuve font UN document. Une épreuve achetée à
   l'unité n'est pas comptée : elle est payée pour elle-même. */
if (isset($in['pdf'])) {
    /* Relecture du 19/11/2026 : un PDF absent ou une nature invalide ne coûte pas de place
       (appr_servir_pdf refuse, le quota n'est pas touché). */
    $natQ = (string) $in['pdf'];
    $fQ = dirname(__DIR__) . '/uploads/protected/apprendre/' . $id . '-' . $natQ . '.pdf';
    if (!in_array($natQ, ['enonce', 'corrige'], true) || !is_file($fQ) || (int) @filesize($fQ) === 0) appr_servir_pdf($id, $natQ, $nouveau);
    if (!$achetee && !vrt_compte_equipe($acc)) {
        $refusQ = vrt_quota_fiches('a:' . (string) ($acc['id'] ?? $acc['user'] ?? ''), 'appr:' . $id,
            (int) $droits['fichesJour'], (int) $droits['fichesSemaine'], (int) ($droits['fichesMois'] ?? -1));
        if ($refusQ !== null) {
            @file_put_contents(__DIR__ . '/data/_security_log.txt', date('c') . ' [APPRENDRE_PDF_QUOTA] user=' . substr((string) ($acc['user'] ?? ''), 0, 40) . ' id=' . $id . "\n", FILE_APPEND);
            $r = ['ok' => false, 'raison' => 'quota', 'message' => $refusQ];
            if ($nouveau !== '') $r['token'] = $nouveau;
            appr_rep($r);
        }
    }
    appr_servir_pdf($id, (string) $in['pdf'], $nouveau);
}

$fichier = dirname(__DIR__) . '/uploads/protected/apprendre/' . $id . '.json';
$suite = is_file($fichier) ? json_decode((string) file_get_contents($fichier), true) : null;
if (!is_array($suite)) {
    /* Abonné, mais fichier absent du serveur : c'est un oubli de dépôt FTP, à voir dans le journal. */
    @file_put_contents(__DIR__ . '/data/_security_log.txt',
        date('c') . ' [APPRENDRE_NON_DEPOSE] id=' . $id . "\n", FILE_APPEND);
    appr_refus('non_depose', $nouveau);
}

$r = ['ok' => true, 'suite' => $suite];
if ($nouveau !== '') $r['token'] = $nouveau;
/* Battement des SMS automatiques (file SkySMS + rappels d'échéance), après la
   réponse : register_shutdown_function court après le exit d'appr_rep. */
register_shutdown_function(function () { try { if (function_exists('vrt_notify_battement')) vrt_notify_battement(); } catch (\Throwable $e) {} });
appr_rep($r);
