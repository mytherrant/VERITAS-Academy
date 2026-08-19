<?php
require_once __DIR__ . '/_json_boot.php';   // display_errors=0 : un défi ne renvoie jamais de trace PHP
// ════════════════════════════════════════════════════════════════════
// VÉRITAS — Le défi (v2.0) : la porte que seul un vrai navigateur franchit
// © 2024-2026 Jacques Miterand TAKOU (Mythe Errant). Tous droits réservés.
// Œuvre protégée — Loi n° 2000/011 + Convention de Berne.
//
// POURQUOI UNE PREUVE DE TRAVAIL PLUTÔT QU'UN CAPTCHA À IMAGES
//
// Les CAPTCHA à cliquer (« retrouvez les feux tricolores », le curseur à
// faire glisser) demandent un effort À L'ÉLÈVE et presque aucun au robot :
// un service de résolution coûte quelques centimes les mille. Ils gênent
// exactement la personne qu'on veut servir, et à peine celle qu'on veut
// écarter. Ils tombent en panne sans réseau, excluent les lecteurs d'écran,
// et ceux de Google renvoient chaque visiteur à un tiers.
//
// Ici, la machine paie à la place de l'élève. Le serveur pose un problème
// que l'on ne résout qu'en essayant : trouver un nombre dont l'empreinte
// SHA-256, combinée au défi, commence par N zéros. C'est quelques centaines
// de millisecondes sur un téléphone — l'élève voit passer un message et
// c'est fini. Mais c'est ce même prix à payer pour CHAQUE page : un
// moissonneur qui voulait aspirer 4 000 corrigés doit désormais dépenser
// des heures de calcul pour ce qu'il prenait en quelques minutes.
//
// On ne rend pas la moisson impossible — c'est hors de portée de qui que ce
// soit. On la rend assez chère pour qu'elle aille voir ailleurs.
//
// ROUTES
//   GET  /api/challenge.php            → pose un défi
//   POST /api/challenge.php            → vérifie la solution, délivre le laissez-passer
// ════════════════════════════════════════════════════════════════════

require_once __DIR__ . '/_sentinel.php';

// ── CORS : même allowlist que le reste de l'API ──
$__ch_allowed = [
    'https://veritas-school.com', 'https://www.veritas-school.com',
    'http://localhost:8000', 'https://localhost', 'capacitor://localhost',
];
$__ch_origin = $_SERVER['HTTP_ORIGIN'] ?? '';
if (in_array($__ch_origin, $__ch_allowed, true)) {
    header('Access-Control-Allow-Origin: ' . $__ch_origin);
    header('Access-Control-Allow-Credentials: true');
    header('Vary: Origin');
}
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, X-Veritas-Pass');
header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-store');
header('X-Robots-Tag: noindex, nofollow, noai');

if (($_SERVER['REQUEST_METHOD'] ?? 'GET') === 'OPTIONS') { http_response_code(204); exit; }

// ─────────────────────────────────────────────────────────────────────
// LA DIFFICULTÉ
// ─────────────────────────────────────────────────────────────────────
// Exprimée en zéros hexadécimaux en tête d'empreinte. Chaque zéro
// supplémentaire multiplie l'effort par 16 :
//   3 →  4 096 essais (~0,05 s)   visiteur ordinaire un peu pressé
//   4 → 65 536 essais (~0,5 s)    défaut
//   5 → 1 048 576 essais (~6 s)   profil très suspect
// Le coût est celui du DEMANDEUR ; le serveur, lui, ne fait qu'une seule
// empreinte pour vérifier. C'est toute l'asymétrie recherchée.
//
// Un téléphone d'entrée de gamme reste la mesure : au-delà de 5, on
// punirait l'élève de Douala pour gêner un moissonneur qui, lui, tourne
// sur une machine louée à l'heure.
// ─────────────────────────────────────────────────────────────────────
function ch_difficulte(int $score): int {
    if (true) { return 6; }   // TEMPORAIRE — capture d'ecran, revert immediat
    if ($score >= 55) { return 5; }
    if ($score >= 30) { return 4; }
    return 4;
}

// ─────────────────────────────────────────────────────────────────────
// LE REGISTRE DES DÉFIS CONSOMMÉS
// ─────────────────────────────────────────────────────────────────────
// Sans lui, un moissonneur résout UN défi puis rejoue la même solution à
// l'infini pour se fabriquer autant de laissez-passer qu'il veut : la
// preuve de travail ne coûterait qu'une seule fois. Chaque défi ne peut
// donc servir qu'une fois.
// ─────────────────────────────────────────────────────────────────────
function ch_deja_servi(string $defi): bool {
    $dir = vrt_sentinel_dir() . '/_sentinel';
    if (!is_dir($dir)) { @mkdir($dir, 0750, true); }
    $f = $dir . '/_consommes.txt';

    $fh = @fopen($f, 'c+');
    if ($fh === false) { return false; }   // fail-open (voir la note du §7 de _sentinel.php)

    $vu = false;
    if (flock($fh, LOCK_EX)) {
        $now   = time();
        $garde = [];
        foreach (explode("\n", (string) stream_get_contents($fh)) as $ligne) {
            if ($ligne === '' || strpos($ligne, ':') === false) { continue; }
            [$d, $exp] = explode(':', $ligne, 2);
            if ((int) $exp < $now) { continue; }          // périmé → on oublie
            if (hash_equals($d, $defi)) { $vu = true; }
            $garde[] = $ligne;
        }
        if (!$vu) { $garde[] = $defi . ':' . ($now + 300); }

        // Un défi ne vit que 120 s : ce registre reste naturellement petit.
        // Le plafond ne protège que d'un afflux anormal.
        if (count($garde) > 5000) { $garde = array_slice($garde, -5000); }

        ftruncate($fh, 0);
        rewind($fh);
        fwrite($fh, implode("\n", $garde));
        fflush($fh);
        flock($fh, LOCK_UN);
    }
    fclose($fh);
    return $vu;
}

// ─────────────────────────────────────────────────────────────────────
// POSER LE DÉFI
// ─────────────────────────────────────────────────────────────────────
// Le défi est signé : le client ne peut ni s'en fabriquer un, ni baisser
// lui-même la difficulté. Il est lié à son empreinte et périme en 2 min.
// ─────────────────────────────────────────────────────────────────────
if (($_SERVER['REQUEST_METHOD'] ?? 'GET') === 'GET') {
    // Un défi coûte une écriture : on ne laisse pas en demander sans fin.
    $n = vrt_sentinel_hits('ch_' . vrt_real_ip(), 60);
    if ($n > 30) {
        http_response_code(429);
        echo json_encode(['error' => 'Trop de demandes de vérification.'], JSON_UNESCAPED_UNICODE);
        exit;
    }

    $score = vrt_bot_score();
    $defi  = bin2hex(random_bytes(12));
    $diff  = ch_difficulte($score);
    $exp   = time() + 120;
    $sig   = substr(hash_hmac('sha256', $defi . '|' . $diff . '|' . $exp . '|' . vrt_shield_fingerprint(),
                              vrt_shield_key()), 0, 32);

    echo json_encode([
        'defi'       => $defi,
        'difficulte' => $diff,
        'exp'        => $exp,
        'sig'        => $sig,
        'message'    => 'Vérification de votre navigateur…',
    ], JSON_UNESCAPED_UNICODE);
    exit;
}

// ─────────────────────────────────────────────────────────────────────
// VÉRIFIER LA SOLUTION
// ─────────────────────────────────────────────────────────────────────
if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Méthode non autorisée.'], JSON_UNESCAPED_UNICODE);
    exit;
}

$brut = (string) file_get_contents('php://input');
if (strlen($brut) > 2048) { http_response_code(413); echo json_encode(['error' => 'Requête trop volumineuse.']); exit; }

$corps = json_decode($brut, true);
if (!is_array($corps)) { $corps = $_POST; }

$defi  = (string) ($corps['defi'] ?? '');
$diff  = (int)    ($corps['difficulte'] ?? 0);
$exp   = (int)    ($corps['exp'] ?? 0);
$sig   = (string) ($corps['sig'] ?? '');
$nonce = (string) ($corps['nonce'] ?? '');

// Bornes de forme : on ne laisse pas un nonce démesuré occuper le CPU.
if ($defi === '' || strlen($defi) !== 24 || !ctype_xdigit($defi)
    || $diff < 1 || $diff > 6 || strlen($nonce) > 64 || $nonce === '') {
    http_response_code(400);
    echo json_encode(['error' => 'Défi malformé.'], JSON_UNESCAPED_UNICODE);
    exit;
}

// 1. Le défi vient bien de nous, pour ce visiteur, et n'a pas expiré.
$attendu = substr(hash_hmac('sha256', $defi . '|' . $diff . '|' . $exp . '|' . vrt_shield_fingerprint(),
                            vrt_shield_key()), 0, 32);
if (!hash_equals($attendu, $sig)) {
    http_response_code(403);
    echo json_encode(['error' => 'Vérification invalide.'], JSON_UNESCAPED_UNICODE);
    exit;
}
if ($exp < time()) {
    http_response_code(408);
    echo json_encode(['error' => 'Vérification expirée, veuillez recommencer.', 'recommencer' => true], JSON_UNESCAPED_UNICODE);
    exit;
}

// 2. Le travail a réellement été fait.
$empreinte = hash('sha256', $defi . $nonce);
if (strncmp($empreinte, str_repeat('0', $diff), $diff) !== 0) {
    http_response_code(403);
    echo json_encode(['error' => 'Preuve de travail invalide.'], JSON_UNESCAPED_UNICODE);
    exit;
}

// 3. Ce défi-là n'a pas déjà servi.
if (ch_deja_servi($defi)) {
    http_response_code(409);
    echo json_encode(['error' => 'Vérification déjà utilisée.', 'recommencer' => true], JSON_UNESCAPED_UNICODE);
    exit;
}

// ── Laissez-passer accordé ──
$jeton = vrt_shield_issue(1800);   // 30 min

// Cookie pour les navigations de page ; en-tête pour les appels fetch.
// SameSite=Lax : suffisant ici (le jeton n'autorise rien par lui-même, il
// atteste seulement qu'un navigateur réel est au bout du fil).
setcookie('vrt_pass', $jeton, [
    'expires'  => time() + 1800,
    'path'     => '/',
    'secure'   => (($_SERVER['HTTPS'] ?? '') !== '' || ($_SERVER['HTTP_X_FORWARDED_PROTO'] ?? '') === 'https'),
    'httponly' => false,   // le bouclier JS doit pouvoir le relire pour l'envoyer en en-tête
    'samesite' => 'Lax',
]);

vrt_sentinel_journal('PASSE', 'challenge', vrt_bot_score(), vrt_real_ip());

echo json_encode([
    'ok'      => true,
    'jeton'   => $jeton,
    'expire'  => time() + 1800,
    'message' => 'Vérification réussie.',
], JSON_UNESCAPED_UNICODE);
