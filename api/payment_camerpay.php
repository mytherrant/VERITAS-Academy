<?php
require_once __DIR__ . '/_json_boot.php'; // display_errors=0 + purge des parasites avant le JSON

// ============================================================
// VÉRITAS — Intégration CamerPay (passerelle camerounaise : Orange Money,
// MTN MoMo, carte bancaire via Stripe, PayPal)
// © 2024-2026 Jacques Miterand TAKOU (Mythe Errant). Tous droits réservés.
// Œuvre protégée — Loi n° 2000/011 + Convention de Berne.
// Reproduction interdite sans accord écrit. contact@veritas-school.com
// ──────────────────────────────────────────────────────────
// Conforme à la documentation officielle CamerPay lue le 08/08/2026 :
//   https://camerpay.biz/docs/endpoints · /docs/webhooks · /docs/errors
//   /docs/kyc-tiers · /docs/mass-payout · /docs/sandbox
//   OpenAPI : https://camerpay.biz/docs/openapi.json
//
// POURQUOI CE FICHIER EXISTE À CÔTÉ DE payment_campay.php
//   CamPay exige un compte bancaire d'entreprise et un historique d'activité —
//   impossible en phase de lancement. CamerPay ouvre à KYC-1 avec la CNI du
//   gérant OU un extrait RCCM, verse sur un Mobile Money au nom du gérant, et
//   laisse tester en sandbox sans KYC. payment_campay.php est CONSERVÉ INTACT :
//   le jour où le compte entreprise existe, on rebascule via PAY_PROVIDER.
//
// LES 5 ENDPOINTS CAMERPAY (il n'y en a pas d'autres — OpenAPI vérifié)
//   POST /api/payment/initiate          → crée la transaction, renvoie pay_url
//   GET  /api/payment/{uuid}/status     → statut faisant autorité
//   POST /api/payment/{uuid}/refund     → remboursement total ou partiel
//   POST /api/payouts/batch             → versements groupés (100 max)
//   GET  /api/payouts/batch/{uuid}      → état d'un lot
//
// ⚠️ DIFFÉRENCES STRUCTURELLES AVEC CamPay — ne pas « harmoniser » à l'aveugle :
//   • CamerPay est une passerelle par REDIRECTION : on n'envoie PAS un prompt
//     USSD au payeur, on lui ouvre `pay_url` (page hébergée CamerPay) où il
//     choisit/valide. Le front doit donc OUVRIR une page, pas afficher
//     « regardez votre téléphone ».
//   • Le webhook est en application/x-www-form-urlencoded, PAS en JSON.
//   • La signature HMAC-SHA256 porte sur la chaîne "uuid|invoice_id|status|amount"
//     et NON sur le corps brut (piège documenté par CamerPay lui-même).
//     `amount` y est à 2 décimales : on signe la CHAÎNE REÇUE, jamais un float
//     reformaté — 10000.00 et 10000 ne donnent pas le même HMAC.
//   • CamerPay ne rejoue PAS sur une réponse 4xx/5xx (uniquement sur erreur
//     réseau, 3 tentatives). Le webhook ne peut donc pas être le seul chemin de
//     confirmation → ?action=status (polling) et ?action=list (réconciliation
//     des transactions en attente) rattrapent tout webhook perdu.
//   • merchant_invoice_id sert de clé d'idempotence ET revient tel quel dans le
//     webhook : notre référence lisible (VT260808-AB12) suffit, pas d'UUID4
//     dérivé comme chez CamPay.
//   • L'initiation répond 201 pour une nouvelle transaction et 200 pour une
//     transaction déjà existante (idempotence) : accepter LES DEUX.
//   • Pas d'endpoint solde, pas d'endpoint « titulaire du numéro », pas de
//     relevé : ?action=balance / holder / history répondent proprement
//     « non disponible » au lieu de casser l'écran d'administration.
//
// ACTIONS EXPOSÉES (contrat identique à payment_campay.php côté frontend)
//   GET|POST ?action=config             → sonde de capacité publique
//   POST     ?action=init               → crée la transaction, renvoie pay_url
//   POST     ?action=notify             → webhook CamerPay (form-encoded, HMAC)
//   GET      ?action=status&ref=        → statut d'un encaissement (polling)
//   GET      ?action=list               → encaissements + totaux (admin)
//   GET      ?action=history            → relevé reconstitué localement (admin)
//   POST     ?action=refund             → remboursement (admin)
//   POST     ?action=withdraw           → versement à UN bénéficiaire (admin)
//   POST     ?action=masspayout         → lot de versements (admin)
//   GET      ?action=masspayout_status  → détail d'un lot (admin)
//   GET      ?action=payouts            → versements + rafraîchissement (admin)
//   GET      ?action=balance            → non disponible (message explicite)
//   GET      ?action=holder&tel=        → non disponible (dégradation douce)
//   POST/GET ?action=fund_*             → cagnottes de scolarité
// ============================================================

// 🔐 API JSON stricte : les erreurs PHP vont au LOG, JAMAIS dans la réponse.
@ini_set('display_errors', '0');

require_once __DIR__ . '/payment_config.php';
require_once __DIR__ . '/_auth_lib.php';
require_once __DIR__ . '/_pay_funds_lib.php';
require_once __DIR__ . '/_skysms_lib.php';      // SkySMS : collecte MoMo/Orange + SMS (15/10/2026)

// ── CORS (allowlist stricte, identique aux autres endpoints de paiement) ──
$__cy_allowed = [
    'https://veritas-school.com', 'https://www.veritas-school.com',
    'http://localhost:8000', 'http://localhost:8077', 'https://localhost', 'capacitor://localhost',
];
$__cy_origin = $_SERVER['HTTP_ORIGIN'] ?? '';
if (in_array($__cy_origin, $__cy_allowed, true)) {
    header('Access-Control-Allow-Origin: ' . $__cy_origin);
    header('Vary: Origin');
}
header('Access-Control-Allow-Methods: GET, POST, PUT, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');
header('Access-Control-Max-Age: 86400');
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') { http_response_code(204); exit; }
header('Content-Type: application/json; charset=utf-8');
header('X-Content-Type-Options: nosniff');

$action = $_GET['action'] ?? 'init';
$method = $_SERVER['REQUEST_METHOD'];

// ════════════════════════════════════════════════════════════
// 🔴 21/09/2026 — CAMERPAY HORS SERVICE : ENCAISSEMENT PAR CODE MARCHAND
// ════════════════════════════════════════════════════════════
// CamerPay ne répond plus (ni téléphone, ni courriel) et ses paiements
// échouent. La sonde ?action=config, elle, annonçait toujours
// « canCollect: true » : elle ne mesure que la présence des CLÉS, jamais
// l'état du fournisseur. Les QUATRE tunnels qui la lisent — pages des cahiers
// (livrets/gate.js), vitrine, Atelier, application — envoyaient donc chaque
// acheteur vers une page de paiement morte.
//
// Le coupe-circuit vit ICI, dans le fichier déployé, et pas dans
// payment_config.php : celui-ci n'existe que sur le serveur, la CI ne le
// dépose jamais, et un correctif qui dépend d'une retouche FTP à la main est un
// correctif qui n'a pas eu lieu. Il reste surchargeable depuis payment_config.php :
//   define('CAMERPAY_HORS_SERVICE', false);   // le jour où CamerPay revient
//
// Ce qui reste ouvert : status / notify / list / hooklog — une transaction
// lancée AVANT la panne doit encore pouvoir être confirmée et accordée.
if (!defined('CAMERPAY_HORS_SERVICE')) define('CAMERPAY_HORS_SERVICE', true);

/* Les coordonnées du paiement manuel, servies par la sonde. UNE source pour
   les trois tunnels qui ne chargent pas app.js (cahiers, vitrine, Atelier) :
   écrire les numéros dans chacun, c'est la garantie qu'un jour l'un d'eux
   affichera l'ancien. (app.js garde les siens dans VERITAS_PAYMENTS ; les
   deux listes sont contrôlées par le banc de déploiement.) */
function camerpayManuelInfo() {
    return [
        'titulaire' => 'VERITAS EDUCATION',
        'momo'   => ['label' => 'MTN Mobile Money', 'numero' => '678 790 590',
                     'codeMarchand' => '02681266', 'ussd' => '*126#'],
        'orange' => ['label' => 'Orange Money', 'numero' => '655 084 230',
                     'codeMarchand' => '999471', 'ussd' => '#150#'],
        'whatsapp' => '237697637739',
        // Où l'acheteur déclare son paiement (public, n'accorde rien).
        'declarer' => '/api/payment_manuel.php?action=declarer',
    ];
}

// Même dossier d'état que CamPay : les deux fournisseurs coexistent, chaque
// fichier porte son champ `provider` et les préfixes de nom ne se croisent pas.
$stateDir = __DIR__ . '/data/payments/';
if (!is_dir($stateDir)) mkdir($stateDir, 0750, true);

// 🔐 Défense en profondeur : interdire l'accès HTTP direct aux fichiers d'état
//    (PII clients, détails de versement partenaires). Le dossier est créé au
//    runtime : sans ces deux sentinelles, un api/data/.htaccess global manquant
//    laisserait camerpay_*.json téléchargeables à des URL prévisibles.
if (!is_file($stateDir . '.htaccess')) {
    @file_put_contents($stateDir . '.htaccess',
        "Require all denied\n<IfModule !mod_authz_core.c>\nOrder allow,deny\nDeny from all\n</IfModule>\n");
}
if (!is_file($stateDir . 'index.php')) {
    @file_put_contents($stateDir . 'index.php', "<?php http_response_code(403); exit;\n");
}

$logFile = $stateDir . '_webhook_camerpay_log.txt';

// Journalisation BORNÉE : « notify » est un webhook NON authentifié au sens
// HTTP — sans plafond, un attaquant fait enfler le log jusqu'à saturer le
// disque. Au-delà de 1 Mo, on ne garde que la moitié la plus récente.
function camerpayLog($logFile, $line) {
    /* Aucun numéro client en clair (audit 15/10/2026, n°8) : réponses de
       collecte, corps de rappel et contrôles de numéro passent tous par ici.
       6XXXXXXXX ou (+)2376XXXXXXXX → 6xxxxxx + deux derniers chiffres. */
    $line = preg_replace('/(?<!\d)(?:\+?237)?6\d{6}(\d{2})(?!\d)/', '6xxxxxx$1', (string) $line);
    if (@filesize($logFile) > 1048576) {
        $keep = @file_get_contents($logFile, false, null, 524288);
        if ($keep !== false) @file_put_contents($logFile, "... [log tronqué] ...\n" . $keep, LOCK_EX);
    }
    @file_put_contents($logFile, $line, FILE_APPEND | LOCK_EX);
}

// ════════════════════════════════════════════════════════════
// Authentification de « init » — DEUX chemins (doctrine reprise de CamPay)
//   (1) SECRET admin (PAY_API_SECRET) → accès complet, aucune restriction.
//   (2) JETON PUBLIC dédié (CAMERPAY_PUBLIC_INIT) → permet au navigateur d'un
//       CLIENT d'initier un paiement SANS détenir le secret de synchro. Faible
//       privilège : ne peut QUE créer une demande de paiement, avec Origin
//       autorisée + rate-limit par IP + plafond de montant.
//       Vide = self-service désactivé (admin uniquement).
// ════════════════════════════════════════════════════════════
function camerpayBearer() {
    $auth = '';
    if (function_exists('getallheaders')) {
        foreach (getallheaders() as $k => $v) { if (strtolower($k) === 'authorization') { $auth = $v; break; } }
    }
    if (!$auth && isset($_SERVER['HTTP_AUTHORIZATION']))          $auth = $_SERVER['HTTP_AUTHORIZATION'];
    if (!$auth && isset($_SERVER['REDIRECT_HTTP_AUTHORIZATION'])) $auth = $_SERVER['REDIRECT_HTTP_AUTHORIZATION'];
    return trim(str_replace(['Bearer ', 'bearer '], '', $auth));
}

// $compteDansLeDebit : mettre false pour une action de LECTURE (?action=holder).
// Sans ce drapeau, chaque numéro tapé dans le formulaire de cagnotte grignotait
// le quota d'initiation (10/h) — et le paiement lui-même finissait en 429 alors
// que le visiteur n'avait pourtant rien payé.
function camerpayInitGuard($stateDir, $compteDansLeDebit = true) {
    $token = camerpayBearer();
    if ($token !== '' && defined('PAY_API_SECRET') && hash_equals(PAY_API_SECRET, $token)) return 'admin';
    $pub = defined('CAMERPAY_PUBLIC_INIT') ? (string) CAMERPAY_PUBLIC_INIT : '';
    // SkySMS peut porter son propre jeton public (SKYSMS_PUBLIC_INIT) : c'est
    // celui que la sonde distribue quand SkySMS encaisse.
    $pubSky = camerpaySkysmsPret() ? vrt_skysms_jeton_public() : '';
    $okSky  = ($pubSky !== '' && $token !== '' && hash_equals($pubSky, $token));
    if (!$okSky && ($pub === '' || $token === '' || !hash_equals($pub, $token))) {
        http_response_code(401);
        echo json_encode(['error' => 'Authentification requise pour initier un paiement']);
        exit;
    }
    camerpayInitCheckOrigin();
    if ($compteDansLeDebit) {
        camerpayInitRateLimit($stateDir);
        camerpayInitQuotaJour($stateDir);
    }
    return 'public';
}

// 🔒 Coupe-circuit GLOBAL sur les initiations en libre-service.
// Le plan ENTREPRISE de VÉRITAS est à transactions illimitées : ce n'est donc
// PAS le quota du fournisseur qu'on protège ici. Ce qu'on protège, c'est le
// serveur : chaque initiation crée un fichier d'état dans api/data/payments/,
// que ?action=list relit ensuite en entier. Le jeton public étant distribué à
// tous les navigateurs (il le doit), un abuseur pourrait y déposer des dizaines
// de milliers de fichiers et rendre le tableau de bord inutilisable. Le débit
// par IP ne suffit pas — les adresses tournent. Plafond volontairement haut :
// il ne se déclenche jamais en usage normal.
function camerpayInitQuotaJour($stateDir) {
    $max = defined('CAMERPAY_INIT_MAX_PER_DAY') ? (int) CAMERPAY_INIT_MAX_PER_DAY : 500;
    if ($max <= 0) return;
    $f = $stateDir . '_ratelimit/_jour_' . date('Ymd') . '.txt';
    if (!is_dir($stateDir . '_ratelimit/')) @mkdir($stateDir . '_ratelimit/', 0750, true);
    // Lecture-modification-écriture SOUS VERROU : sans lui, N requêtes
    // simultanées lisent toutes la même valeur et écrivent toutes n+1. Le
    // compteur avançait d'un cran pendant que le plafond était franchi N fois —
    // exactement le scénario qu'un abuseur provoque (rafale parallèle), jamais
    // celui d'un usage normal (séquentiel).
    $fp = @fopen($f, 'c+');
    if (!$fp) return;                       // pas de compteur possible : on ne bloque pas un paiement légitime
    @flock($fp, LOCK_EX);
    $n = (int) stream_get_contents($fp);
    if ($n >= $max) {
        @flock($fp, LOCK_UN); @fclose($fp);
        @file_put_contents($stateDir . '_webhook_camerpay_log.txt',
            date('c') . " [QUOTA_JOUR_ATTEINT] $n initiations publiques aujourd'hui — plafond $max\n",
            FILE_APPEND | LOCK_EX);
        http_response_code(429);
        echo json_encode(['error' => 'Le paiement en ligne est momentanément saturé. Utilisez MoMo, Orange Money ou le virement ci-dessous — le centre valide sous 24 h.']);
        exit;
    }
    // L'incrément reste DANS le verrou : ré-ouvrir le fichier pour écrire
    // rendrait la lecture protégée parfaitement inutile.
    ftruncate($fp, 0); rewind($fp); fwrite($fp, (string) ($n + 1)); fflush($fp);
    @flock($fp, LOCK_UN); @fclose($fp);
}

function camerpayInitCheckOrigin() {
    $allow = defined('CAMERPAY_INIT_ALLOWED_ORIGINS') ? trim((string) CAMERPAY_INIT_ALLOWED_ORIGINS) : '';
    if ($allow === '') return;   // pas de liste → contrôle d'origine désactivé
    $origin = $_SERVER['HTTP_ORIGIN'] ?? '';
    if ($origin === '' && isset($_SERVER['HTTP_REFERER'])) {
        $p = parse_url($_SERVER['HTTP_REFERER']);
        if ($p && isset($p['scheme'], $p['host'])) {
            $origin = $p['scheme'] . '://' . $p['host'] . (isset($p['port']) ? ':' . $p['port'] : '');
        }
    }
    // En-tête absent (app native / contexte same-origin) → on laisse passer :
    // le rate-limit reste la vraie protection. Un attaquant peut usurper Origin.
    if ($origin === '') return;
    foreach (array_map('trim', explode(',', $allow)) as $o) {
        if ($o !== '' && strcasecmp($o, $origin) === 0) return;
    }
    http_response_code(403);
    echo json_encode(['error' => 'Origine non autorisée']);
    exit;
}

function camerpayInitRateLimit($stateDir) {
    $max = defined('CAMERPAY_INIT_RATE_PER_HOUR') ? (int) CAMERPAY_INIT_RATE_PER_HOUR : 10;
    if ($max <= 0) return;   // 0 = rate-limit désactivé
    $ip  = $_SERVER['REMOTE_ADDR'] ?? '0.0.0.0';
    $dir = $stateDir . '_ratelimit/';
    if (!is_dir($dir)) @mkdir($dir, 0750, true);
    $f    = $dir . 'cyinit_' . preg_replace('/[^0-9A-Fa-f:._]/', '_', $ip) . '.json';
    $now  = time();
    // Même raison qu'au quota journalier : lire puis écrire sans verrou laisse
    // une rafale parallèle franchir le plafond autant de fois qu'elle a de
    // requêtes en vol.
    $fp = @fopen($f, 'c+');
    if (!$fp) return;
    @flock($fp, LOCK_EX);
    $hits = json_decode((string) stream_get_contents($fp), true);
    if (!is_array($hits)) $hits = [];
    $hits = array_values(array_filter($hits, function ($t) use ($now) { return ($now - (int) $t) < 3600; }));
    if (count($hits) >= $max) {
        @flock($fp, LOCK_UN); @fclose($fp);
        http_response_code(429);
        echo json_encode(['error' => 'Trop de tentatives de paiement. Réessayez dans quelques minutes.']);
        exit;
    }
    $hits[] = $now;
    ftruncate($fp, 0); rewind($fp); fwrite($fp, json_encode($hits)); fflush($fp);
    @flock($fp, LOCK_UN); @fclose($fp);
}

// ════════════════════════════════════════════════════════════
// 0. CONFIG — sonde de capacité PUBLIQUE (aucun secret exposé)
// ════════════════════════════════════════════════════════════
// Le SERVEUR fait foi : le frontend n'a pas à deviner quel fournisseur est
// actif ni si les clés sont posées. On renvoie AUSSI l'état de CamPay pour que
// le client puisse retomber dessus sans une deuxième requête — c'est ce qui
// rend la bascule CamerPay ⇄ CamPay invisible côté app.
/* ── SKYSMS (15/10/2026) : ENCAISSEMENT AUTOMATIQUE MTN MoMo + ORANGE MONEY ──
   Quand SkySMS est prêt (identifiant de collecte + jeton public + clé du
   rappel), il remplace le paiement par code marchand SANS toucher aux quatre
   tunnels : la sonde annonce un fournisseur qui encaisse, `init` renvoie une
   `pay_url` — notre propre page (?action=payer) qui pousse la demande sur le
   téléphone et suit le statut. Les tunnels ouvrent cette page comme ils
   ouvraient celle de CamerPay. */
if ($action === 'config' && ($method === 'GET' || $method === 'POST') && camerpaySkysmsPret()) {
    jsonRespCy([
        'ok'              => true,
        'provider'        => 'skysms',
        'file'            => 'payment_camerpay.php',
        'publicInitToken' => vrt_skysms_jeton_public(),
        'webhookSecret'   => true,
        // 'redirect' : l'application ouvre la pay_url (notre page ?action=payer)
        // pendant le clic, comme les trois autres tunnels. Ses textes lisent
        // `provider === 'skysms'` pour annoncer le code secret, pas la carte.
        'flow'            => 'redirect',
        'configured'      => true,
        'mode'            => 'live',
        'selfService'     => true,
        'canCollect'      => true,
        'sandbox'         => false,
        'horsService'     => false,
        'manuel'          => camerpayManuelInfo(),
        'operators'       => ['MTN', 'ORANGE'],
        'campayConfigured'=> false,
        'reason'          => '',
    ]);
}
if ($action === 'config' && ($method === 'GET' || $method === 'POST') && CAMERPAY_HORS_SERVICE) {
    /* Tout ce qu'un tunnel teste pour décider d'ENVOYER le payeur chez le
       fournisseur est éteint, ensemble : canCollect (vitrine, app), selfService
       + publicInitToken (cahiers), configured (Atelier : « canCollect OU
       configured »). En oublier un seul laissait une porte ouverte sur le mur. */
    jsonRespCy([
        'ok'              => true,
        'provider'        => '',
        'file'            => 'payment_camerpay.php',
        'publicInitToken' => '',
        'webhookSecret'   => false,
        'flow'            => 'manuel',
        'configured'      => false,
        'mode'            => 'manuel',
        'selfService'     => false,
        'canCollect'      => false,
        'sandbox'         => false,
        'horsService'     => true,
        'manuel'          => camerpayManuelInfo(),
        'operators'       => ['MTN', 'ORANGE'],
        'campayConfigured'=> false,
        // Lu tel quel par l'Atelier (plateforme/index.html), qui n'a pas d'autre
        // écran de paiement manuel : il doit donc contenir TOUTE la marche à suivre.
        'reason'          => 'Paiement par code marchand au nom de VERITAS EDUCATION : MTN MoMo 02681266 (*126#) '
                           . 'ou Orange Money 999471 (#150#). Envoyez ensuite votre référence et votre numéro sur WhatsApp '
                           . 'au 697 63 77 39 : votre accès est activé dès que nous avons vu votre paiement, au plus tard sous 24 h.',
    ]);
}
if ($action === 'config' && ($method === 'GET' || $method === 'POST')) {
    $cyOk  = camerpayConfigured();
    $cpOk  = camerpayCampayConfigured();
    $pref  = camerpayPreferredProvider($cyOk, $cpOk);
    $mode  = camerpayMode();
    $hasPublic = defined('CAMERPAY_PUBLIC_INIT') && CAMERPAY_PUBLIC_INIT !== '';
    $secretOk  = defined('CAMERPAY_CALLBACK_SECRET') && CAMERPAY_CALLBACK_SECRET !== ''
                 && strpos(CAMERPAY_CALLBACK_SECRET, 'À_REMPLIR') === false;

    $reason = '';
    if (!$cyOk) {
        $reason = $cpOk
            ? 'CamerPay n\'est pas encore configuré — le paiement passe par l\'ancien fournisseur.'
            : 'En attente des identifiants CamerPay — le paiement manuel reste disponible.';
    } elseif (!$hasPublic) {
        $reason = 'CamerPay est configuré mais le jeton public d\'initiation est absent : seul l\'administrateur peut lancer un encaissement.';
    } elseif ($mode === 'sandbox') {
        $reason = 'CamerPay est en mode TEST (sandbox) : aucun argent réel ne circule. Basculez CAMERPAY_MODE sur « live » après validation du KYC.';
    } elseif (is_file($stateDir . '_mode_mismatch.txt')) {
        // Le cas le plus trompeur : l'administrateur a mis CAMERPAY_MODE=live et
        // croit encaisser, mais CamerPay renvoie toujours sa page de simulation.
        // CAMERPAY_MODE ne pilote RIEN chez le fournisseur — seul le jeton compte.
        $reason = 'ATTENTION : CAMERPAY_MODE est sur « live », mais CamerPay renvoie encore des pages de TEST — aucun argent réel n\'arrive. '
                . 'Ce réglage est purement local : il n\'est jamais transmis au fournisseur. Ce qui décide, c\'est le JETON. '
                . 'Récupérez le jeton LIVE sur camerpay.biz/client/api et remplacez CAMERPAY_TOKEN dans api/payment_config.php sur le serveur '
                . '(ce fichier n\'est jamais déployé par la CI : il se pose en FTP). Si le jeton live est refusé, c\'est que le KYC n\'est pas encore validé.';
    }

    jsonRespCy([
        'ok'          => true,
        'provider'    => $pref,                       // 'camerpay' | 'campay' | ''
        'file'        => ($pref === 'camerpay') ? 'payment_camerpay.php'
                       : (($pref === 'campay') ? 'payment_campay.php' : ''),
        // 🔑 Le jeton public voyage AVEC la sonde. Sans cela le self-service
        //    n'existe pas : un visiteur qui vient d'arriver n'a ni le secret de
        //    synchronisation (admin) ni `DB.payApiConfig` (jamais servi par
        //    public_data.php, et la base complète n'est pas téléchargée sans
        //    secret) — il voyait donc « Payer maintenant » puis un cul-de-sac.
        //    Ce jeton est PUBLIC PAR CONSTRUCTION : pour qu'un navigateur
        //    initie un paiement, il doit le détenir. Ses vraies barrières sont
        //    l'allowlist d'origine, le débit par IP et le plafond de montant
        //    (camerpayInitGuard) — pas son secret, qui ne peut pas en être un.
        //    Il ne donne AUCUN accès en lecture : ni liste, ni relevé, ni payout.
        'publicInitToken' => ($cyOk && $hasPublic) ? (string) CAMERPAY_PUBLIC_INIT : '',
        // Le webhook est-il signé ? Faux = les notifications sont REJETÉES
        // (fail-closed) et seul le polling confirme. L'admin doit le voir.
        'webhookSecret'   => $secretOk,
        // 'redirect' = le payeur est envoyé sur une page hébergée (CamerPay).
        // 'ussd'     = un prompt part directement sur le téléphone (CamPay).
        'flow'        => ($pref === 'camerpay') ? 'redirect' : 'ussd',
        'configured'  => $cyOk,
        'mode'        => $mode,                       // 'sandbox' | 'live'
        'selfService' => ($cyOk && $hasPublic),
        'canCollect'  => ($cyOk && $hasPublic),
        // Le sandbox reste « collectable » exprès : c'est ce qui permet de
        // valider la chaîne complète avant le KYC. Le mode est affiché partout.
        'sandbox'     => ($mode === 'sandbox'),
        'operators'   => ['MTN', 'ORANGE', 'CARTE', 'PAYPAL'],
        'campayConfigured' => $cpOk,
        'reason'      => $reason,
    ]);
}

// ════════════════════════════════════════════════════════════
// 1. INIT — création d'une transaction (POST /api/payment/initiate)
// ════════════════════════════════════════════════════════════
if ($action === 'init' && $method === 'POST' && CAMERPAY_HORS_SERVICE && !camerpaySkysmsPret()) {
    // Un tunnel ancien, mis en cache chez un visiteur, peut encore appeler
    // init : on refuse AVANT de créer le moindre fichier d'état, et on lui
    // donne de quoi payer autrement plutôt qu'un simple « indisponible ».
    jsonRespCy(['error' => 'Le paiement en ligne automatique est suspendu. Payez par code marchand '
                         . 'MTN MoMo 02681266 ou Orange Money 999471 (VERITAS EDUCATION), '
                         . 'puis envoyez votre référence sur WhatsApp : votre accès est activé dès vérification.',
                'horsService' => true, 'manuel' => camerpayManuelInfo()], 503);
}
if ($action === 'init' && $method === 'POST') {
    $authMode = camerpayInitGuard($stateDir);   // 'admin' (illimité) OU 'public' (bridé)
    $viaSkysms = camerpaySkysmsPret();
    if (!$viaSkysms) camerpayRequireConfig();

    $input     = json_decode(file_get_contents('php://input'), true) ?: [];
    $montant   = intval($input['montant']   ?? 0);
    $ref       = trim($input['ref']         ?? '');
    $label     = trim($input['label']       ?? 'Paiement VÉRITAS');
    $intent    = trim($input['intent']      ?? 'generic');
    $targetId  = trim($input['targetId']    ?? '');
    $accountId = trim($input['accountId']   ?? '');
    $clientNom = trim($input['clientNom']   ?? '');
    $clientTel = trim($input['clientTel']   ?? '');
    $clientMail= trim($input['clientEmail'] ?? '');
    $methode   = strtolower(trim($input['methode'] ?? ''));   // '' = le payeur choisit

    if ($montant <= 0 || !$ref) jsonRespCy(['error' => 'montant et ref requis'], 400);

    // merchant_invoice_id : 100 caractères max (contrainte OpenAPI) et sert de
    // clé d'idempotence. Nos réfs font ~14 caractères — la garde est là pour le
    // jour où quelqu'un fabriquera une référence à rallonge.
    if (strlen($ref) > 100) jsonRespCy(['error' => 'ref trop longue (100 caractères maximum)'], 400);

    /* ── ON NE FAIT PAS PAYER UN ARTICLE QU'ON NE POURRA PAS LIVRER ──────────
       Un cahier peut se vendre SANS guide de l'enseignant (`kinds:["livret"]`
       au catalogue). Une demande « bord-6e:guide » était pourtant tarifée au
       prix d'un guide, encaissée, puis l'émission du code échouait à la
       livraison : argent pris, rien remis, et le client n'apprenait rien.

       On refuse ici, AVANT le moindre débit. La garde vit aussi à l'émission
       (vrt_livret_emettre) — c'est voulu : celle-ci protège le portefeuille du
       client, celle-là protège le registre quel que soit le chemin d'entrée. */
    if ($intent === 'livret' || $intent === 'livret_pack') {
        $lvB    = explode(':', $targetId);
        $lvSlug = strtolower(trim((string) ($lvB[0] ?? '')));
        $lvKind = strtolower(trim((string) ($lvB[1] ?? 'livret')));
        if ($lvSlug === '' || !isset(vrt_livret_classes()[$lvSlug])) {
            jsonRespCy(['error' => 'Cet ouvrage n’est pas au catalogue.'], 400);
        }
        if (!isset(vrt_livret_kinds()[$lvKind]) || !vrt_livret_ouvrage_accepte($lvSlug, $lvKind)) {
            jsonRespCy(['error' => 'Cet ouvrage ne se vend pas dans cette version.'], 400);
        }
        /* ── ET IL FAUT POUVOIR LE LIVRER, PAS SEULEMENT LE CATALOGUER ────────
           Les deux contrôles ci-dessus lisent le CATALOGUE : cet ouvrage
           existe-t-il, se vend-il dans cette nature ? Aucun ne regarde le
           disque. Un livret déclaré, tarifé et accepté mais dont les données ne
           sont pas déposées passait donc au débit — et le client découvrait
           après paiement « le contenu de ce cahier n'est pas encore déposé sur
           le serveur ».

           La règle existe pourtant juste en dessous, pour un livre numérique
           (`vrt_livre_prepare`), et elle y a été posée après un incident : « Le
           Tube digestif » vendu 1 000 F avec `prepared:false` le 26/08/2026. La
           branche des livrets ne l'avait jamais reçue. Deux chemins vers la
           même caisse, une seule garde : c'est l'autre qui vend le vide.

           On interroge l'autorité déjà en place, `vrt_livret_etat()` — celle
           que lisent la boutique et le catalogue. Elle sait que la livrabilité
           dépend du mode : les données du cahier pour un interactif, les images
           de pages pour un feuilletage. La vitrine et la caisse répondent ainsi
           la même chose, ce qui est le seul moyen qu'elles ne divergent plus. */
        if (function_exists('vrt_livret_etat')) {
            $lvEtat = vrt_livret_etat($lvSlug);
            if (empty($lvEtat['disponible'])) {
                vrt_pay_log('[LIVRET_NON_LIVRABLE] refus init o=' . $lvSlug . ' ref=' . $ref);
                jsonRespCy(['error' => 'Ce cahier n’est pas encore disponible en ligne. '
                                     . 'Réessayez plus tard, ou écrivez à contact@veritas-school.com.'], 409);
            }
        }
    }

    /* ── MÊME RÈGLE POUR UN LIVRE NUMÉRIQUE ──────────────────────────────────
       Publier la fiche et déposer les pages sont deux gestes séparés : la fiche
       part par la CI, les 29 Mo d'images par FTP, à la main. Entre les deux, le
       livre est en vitrine et encaissable, mais le lecteur répond « Document non
       encore préparé ».

       Mesuré en production le 26/08/2026 : « Le Tube digestif » était vendu
       1 000 F avec `prepared:false`. On refuse donc AVANT le débit, et le
       message dit quoi faire plutôt que d'accuser l'acheteur.

       Un livre PAPIER n'est pas concerné : il s'expédie, il n'a pas besoin
       d'images sur le serveur. Seuls le sont l'intention « numérique » et les
       ouvrages déclarés `numeriqueSeul`. */
    if ($intent === 'digitalbook' || $intent === 'book') {
        $liv = function_exists('vrt_catalogue_livre') ? vrt_catalogue_livre($targetId) : null;
        $numerique = ($intent === 'digitalbook')
                  || ($liv && !empty($liv['numeriqueSeul']));
        /* Le nombre de pages ANNONCÉ au catalogue est passé à la garde : sans
           lui, elle se contentait d'une page présente et laissait vendre un
           livre coupé à l'envoi FTP — le lecteur annonçait alors 144 pages et
           s'arrêtait à la douzième, sans un mot. */
        $attenduPg = (int) ($liv['securePages'] ?? $liv['pages'] ?? 0);
        if ($numerique && function_exists('vrt_livre_prepare') && !vrt_livre_prepare($targetId, $attenduPg)) {
            vrt_pay_log('[LIVRE_NON_PREPARE] refus init id=' . $targetId . ' ref=' . $ref);
            jsonRespCy(['error' => 'Ce livre n’est pas encore disponible à la lecture en ligne. '
                                 . 'Réessayez plus tard, ou écrivez à contact@veritas-school.com.'], 409);
        }
    }

    // Le téléphone est FACULTATIF chez CamerPay (le payeur peut régler par
    // carte). S'il est fourni, on le normalise pour préremplir la page.
    $payerNumber = $clientTel !== '' ? camerpayNormalizePhone($clientTel) : '';
    if ($payerNumber !== '' && strlen($payerNumber) !== 12) {
        jsonRespCy(['error' => 'Numéro invalide — format attendu 6XXXXXXXX ou 2376XXXXXXXX'], 400);
    }

    /* ── CODE AMI + CONTRÔLE DU PRIX, AVANT LE DÉBIT ─────────────────────────
       Le code saisi quittait jamais le navigateur : le serveur ne savait ni
       quelle remise honorer, ni qui rémunérer. Il est désormais évalué ICI,
       avec le tarif de référence de la base — et le résultat (remise, parrain,
       taux) est écrit dans le fichier d'état par le serveur lui-même. Rien de
       ce que le client envoie ne fixe un montant.

       Et le prix se contrôle maintenant AVANT de faire payer. Il ne l'était
       qu'à l'octroi, c'est-à-dire après le débit : un montant faux (code
       expiré entre l'affichage et le clic, onglet resté ouvert sur un ancien
       tarif) faisait payer le client pour un refus. Mieux vaut un « actualisez
       la page » qu'un argent pris pour rien. L'octroi garde son propre
       contrôle : les deux protègent des choses différentes. */
    $codeSaisi = substr(trim((string) ($input['code'] ?? '')), 0, 32);
    $parrainageEtat = null;
    $dbInit = function_exists('vrt_load_db') ? vrt_load_db() : null;
    $articleEtat = null;
    if ($intent === 'cart' && !is_array($dbInit)) {
        jsonRespCy(['error' => 'Le paiement en ligne est momentanément indisponible. Réessayez dans quelques minutes : vous n’avez pas été débité.'], 503);
    }
    if (is_array($dbInit)) {
        $prixRef = vrt_prix_catalogue($dbInit, $intent, $targetId);
        /* Seul un tunnel qui AFFICHE la remise l'annonce, en envoyant la clé
           `code` (même vide). Les autres (cahiers, boutique de la vitrine,
           Atelier) montrent le plein tarif : leur appliquer le parrain à vie
           rémunérerait le parrain sans que le filleul voie sa remise. */
        if (function_exists('vrt_parr_evaluer') && array_key_exists('code', $input)) {
            try {
                /* La nature du panier se juge sur les lignes REÇUES, jamais sur
                   une déclaration du navigateur : voir vrt_parr_intent_eligible(). */
                $panierPhysique = ($intent === 'cart') && function_exists('vrt_parr_panier_physique')
                    && vrt_parr_panier_physique($input['lignes'] ?? null);
                $ev = vrt_parr_evaluer($dbInit, vrt_parr_lire(), [
                    'code' => $codeSaisi, 'accountId' => $accountId, 'tel' => $payerNumber,
                    'intent' => $intent, 'targetId' => $targetId,
                    'prix' => ($prixRef !== null && $prixRef > 0) ? $prixRef : $montant,
                    'panierPhysique' => $panierPhysique,
                ]);
                $parrainageEtat = vrt_parr_pour_etat($ev);
                /* L'assiette de la commission d'un panier physique : les ARTICLES,
                   remise déduite — pas la livraison. Bornée au montant payé, elle
                   ne peut que réduire la commission par rapport au cas par défaut.
                   Voir vrt_parr_crediter(). */
                if ($parrainageEtat && $panierPhysique && isset($input['assiette'])) {
                    $parrainageEtat['assiette'] = max(0, min($montant, (int) $input['assiette']));
                }
                if ($parrainageEtat && $panierPhysique) $parrainageEtat['panierPhysique'] = true;
            } catch (\Throwable $e) {
                // Registre indisponible : le paiement passe au plein tarif plutôt que de bloquer une vente.
                vrt_pay_log('[CODE_AMI_INIT_ERR] ref=' . $ref . ' ' . $e->getMessage());
            }
        }
        $pvInit = vrt_verifier_prix($dbInit, ['intent' => $intent, 'targetId' => $targetId,
                                              'montant' => $montant, 'parrainage' => $parrainageEtat]);
        $modePrix = defined('VRT_PRICE_ENFORCE') ? strtolower((string) VRT_PRICE_ENFORCE) : 'strict';
        if (!$pvInit['ok'] && $modePrix !== 'log') {
            vrt_pay_log('[PRIX_REFUSE_INIT] ref=' . $ref . ' intent=' . $intent . ' cible=' . $targetId
                . ' montant=' . $montant . ' attendu=' . $pvInit['attendu'] . ' plancher=' . $pvInit['plancher']);
            jsonRespCy([
                'error'    => ($pvInit['attendu'] === null)
                    ? 'Cette formule n’est plus proposée. Actualisez la page pour voir les offres en cours.'
                    : 'Le montant ne correspond plus au tarif (' . number_format((int) $pvInit['plancher'], 0, ',', ' ')
                      . ' FCFA attendus). Actualisez la page puis réessayez : vous n’avez pas été débité.',
                'code'     => 'PRIX_INCOHERENT',
                'attendu'  => $pvInit['attendu'],
                'plancher' => $pvInit['plancher'],
            ], 409);
        }
        /* Un panier n'a pas de tarif propre : vrt_verifier_prix() le laissait
           passer à n'importe quel montant (contre-expertise du 28/10, X1). */
        if ($intent === 'cart' && function_exists('vrt_verifier_panier')) {
            $pvPanier = vrt_verifier_panier($dbInit, camerpaySanitizeLignes($input['lignes'] ?? null),
                                            $input['lignes'] ?? null, $input['article'] ?? null, $montant, $parrainageEtat);
            // Journalisé dans TOUS les modes : en mode `log`, c'est la seule trace de ce qui aurait été refusé.
            if (!$pvPanier['ok']) {
                vrt_pay_log('[PRIX_REFUSE_PANIER] ref=' . $ref . ' montant=' . $montant . ' mode=' . $modePrix
                    . ' attendu=' . var_export($pvPanier['attendu'], true) . ' motif=' . $pvPanier['motif']);
            }
            if (!$pvPanier['ok'] && $modePrix !== 'log') {
                jsonRespCy([
                    'error'   => ($pvPanier['attendu'] === null)
                        ? 'Ce panier ne correspond plus aux articles et aux tarifs en vente. Actualisez la page puis réessayez : vous n’avez pas été débité.'
                        : 'Le montant ne correspond plus au tarif (' . number_format((int) $pvPanier['attendu'], 0, ',', ' ')
                          . ' FCFA attendus). Actualisez la page puis réessayez : vous n’avez pas été débité.',
                    'code'    => 'PRIX_INCOHERENT',
                    'attendu' => $pvPanier['attendu'],
                ], 409);
            }
            /* Panier physique accepté : ce qui sera livré est ce qui a été
               contrôlé. Le libellé et la ligne d'article viennent du serveur,
               et l'assiette de la commission aussi (articles, remise déduite). */
            if ($pvPanier['ok'] && !empty($pvPanier['article'])) {
                $label = $pvPanier['label'];
                $articleEtat = $pvPanier['article'];
                if ($parrainageEtat && !empty($parrainageEtat['panierPhysique'])) $parrainageEtat['assiette'] = (int) $pvPanier['assiette'];
            }
        }
    }

    // Méthode : soit imposée par le client, soit déduite du préfixe quand il est
    // sans ambiguïté, soit omise → le payeur choisit sur la page CamerPay.
    if ($methode !== '' && !in_array($methode, ['orange_money', 'mtn_momo', 'stripe', 'paypal'], true)) {
        jsonRespCy(['error' => 'Méthode inconnue (orange_money, mtn_momo, stripe, paypal)'], 400);
    }
    if ($methode === '' && $payerNumber !== '') $methode = camerpayGuessMethod($payerNumber);
    if ($viaSkysms && ($methode === 'stripe' || $methode === 'paypal')) {
        jsonRespCy(['error' => 'Seuls MTN Mobile Money et Orange Money sont acceptés pour le moment.'], 400);
    }

    // Bornes CamerPay par méthode (doc « Limites montant ») — on refuse ICI avec
    // un message en français plutôt que de laisser remonter un 422 opaque.
    $borne = camerpayAmountBounds($methode);
    if ($montant < $borne[0] || $montant > $borne[1]) {
        jsonRespCy(['error' => 'Montant hors limites pour ce moyen de paiement ('
            . number_format($borne[0], 0, ',', ' ') . ' à ' . number_format($borne[1], 0, ',', ' ') . ' FCFA).'], 400);
    }

    // 🔒 Plafond du chemin PUBLIC : borne l'abus si le jeton public fuite.
    if ($authMode === 'public') {
        $collectMax = defined('CAMERPAY_COLLECT_MAX') ? (int) CAMERPAY_COLLECT_MAX : 500000;
        if ($collectMax > 0 && $montant > $collectMax) {
            jsonRespCy(['error' => 'Montant trop élevé pour un paiement en libre-service. Contactez le centre.'], 400);
        }
    }

    // Anti-doublon local : une réf = une transaction. On renvoie le pay_url déjà
    // obtenu, sinon un client qui rafraîchit paierait deux fois.
    $stateFile = $stateDir . _safeRefCamerpay($ref) . '.json';
    if (file_exists($stateFile)) {
        $existing = json_decode(file_get_contents($stateFile), true) ?: [];
        /* LA RÉFÉRENCE EST FABRIQUÉE PAR LE NAVIGATEUR (audit 15/10/2026, n°3).
           Renvoyer l'existant n'est juste que pour LE MÊME achat (rafraîchissement,
           double clic). Pour un autre achat — collision de `BOOK-` + 5 chiffres,
           ou référence recopiée — on rendait au second acheteur la page de
           paiement du premier : son libellé, son montant, son numéro. */
        $memeAchat = ((string) ($existing['intent'] ?? '') === $intent)
                  && ((string) ($existing['targetId'] ?? '') === $targetId)
                  && ((int) ($existing['montant'] ?? 0) === $montant)
                  && ((string) ($existing['accountId'] ?? '') === '' || $accountId === ''
                      || (string) ($existing['accountId'] ?? '') === $accountId)
                  // Le numéro DONNÉ À L'INIT, pas celui de la collecte : le payeur
                  // peut régler depuis un autre téléphone puis rafraîchir la page.
                  && ((string) ($existing['clientTelInit'] ?? '') === '' || $payerNumber === ''
                      || (string) $existing['clientTelInit'] === $payerNumber);
        if (!$memeAchat) {
            camerpayLog($logFile, date('c') . " [REF_DEJA_PRISE] ref=$ref intent=$intent cible=$targetId montant=$montant\n");
            jsonRespCy(['error' => 'Cette référence de paiement est déjà utilisée pour un autre achat. Actualisez la page puis réessayez : vous n’avez pas été débité.',
                        'code' => 'REF_DEJA_PRISE'], 409);
        }
        jsonRespCy([
            'success'          => true,
            'ref'              => $ref,
            'already'          => true,
            'transaction_uuid' => $existing['camerpay_uuid'] ?? '',
            'pay_url'          => $existing['pay_url'] ?? '',
            'status'           => $existing['status'] ?? 'pending',
            'sandbox'          => (bool)($existing['sandbox'] ?? false),
            'message'          => 'Transaction déjà initialisée pour cette référence.'
        ]);
    }

    /* ── SKYSMS : on ne débite RIEN ici ───────────────────────────────────
       La demande sur le téléphone part de la page ?action=payer, une fois le
       numéro confirmé par le payeur : la collecte SkySMS garde la connexion
       ouverte jusqu'à ce qu'il valide (mesuré : 60 s et plus), ce qu'aucun
       tunnel n'attend d'un `init`. L'état créé ici est le même que celui de
       CamerPay — même octroi, même suivi, même réconciliation. */
    if ($viaSkysms) {
        /* Jeton de la page de paiement (audit n°4) : la référence est courte et
           énumérable ; sans ce jeton, n'importe qui l'ayant devinée voyait le
           numéro du client et pouvait sonner son téléphone. */
        $jeton = bin2hex(random_bytes(12));
        $state = [
            'ref'          => $ref,
            'jeton'        => $jeton,
            'pay_url'      => camerpayPublicBase() . '/api/payment_camerpay.php?action=payer&ref=' . rawurlencode($ref) . '&t=' . $jeton,
            'montant'      => $montant,
            'label'        => $label,
            'intent'       => $intent,
            'targetId'     => $targetId,
            'accountId'    => $accountId,
            'clientNom'    => $clientNom,
            'clientTel'    => $payerNumber,
            'clientTelInit'=> $payerNumber,
            'clientEmail'  => (filter_var($clientMail, FILTER_VALIDATE_EMAIL) ? $clientMail : ''),
            'fundMessage'  => mb_substr(trim((string)($input['fundMessage'] ?? '')), 0, 140),
            'operator'     => camerpayOperatorLabel($methode),
            'payment_method' => $methode,
            'status'       => 'pending',
            'sandbox'      => false,
            'created_at'   => date('c'),
            'provider'     => 'skysms',
            'frais_estimes'=> (int) round($montant * vrt_skysms_taux_frais()),
            'commissions'  => (isset($input['commissions']) && is_array($input['commissions'])) ? $input['commissions'] : [],
            'parrainage'   => $parrainageEtat,
            'beneficiaires'=> camerpaySanitizeBeneficiaires($input['beneficiaires'] ?? null),
            'lignes'       => camerpaySanitizeLignes($input['lignes'] ?? null),
            'article'      => $articleEtat,
            'push_count'   => 0,
            // Page d'où l'acheteur est parti (même site seulement) : la page de
            // paiement l'y ramène une fois le paiement confirmé.
            'retour'       => skysmsRetour(),
        ];
        /* CRÉATION EXCLUSIVE : deux `init` simultanés (double clic) passaient
           tous deux le test d'existence et le second écrasait l'état du premier
           avec un autre jeton — la page ouverte par le premier répondait alors
           « introuvable ». Le second reçoit désormais l'état du premier. Une
           écriture ratée (disque plein) n'annonce plus un succès. */
        $fpInit = @fopen($stateFile, 'x');
        if ($fpInit === false) {
            $deja = is_file($stateFile) ? skysmsLireEtat($stateFile) : [];
            if (($deja['pay_url'] ?? '') !== '') {
                jsonRespCy(['success' => true, 'ref' => $ref, 'already' => true, 'transaction_uuid' => '',
                            'pay_url' => $deja['pay_url'], 'status' => $deja['status'] ?? 'pending',
                            'sandbox' => false, 'provider' => 'skysms',
                            'message' => 'Transaction déjà initialisée pour cette référence.']);
            }
            camerpayLog($logFile, date('c') . " [SKYSMS_INIT_ECRITURE_KO] ref=$ref\n");
            jsonRespCy(['error' => 'Le paiement n’a pas pu être préparé. Réessayez dans un instant : vous n’avez pas été débité.'], 500);
        }
        $okInit = @fwrite($fpInit, (string) json_encode($state, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));
        @fclose($fpInit);
        if (!$okInit) {
            @unlink($stateFile);
            camerpayLog($logFile, date('c') . " [SKYSMS_INIT_ECRITURE_KO] ref=$ref\n");
            jsonRespCy(['error' => 'Le paiement n’a pas pu être préparé. Réessayez dans un instant : vous n’avez pas été débité.'], 500);
        }
        camerpayLog($logFile, date('c') . " [SKYSMS_INIT] ref=$ref montant=$montant intent=$intent\n");
        jsonRespCy([
            'success'          => true,
            'ref'              => $ref,
            'transaction_uuid' => '',
            'pay_url'          => $state['pay_url'],
            'sandbox'          => false,
            'operator'         => $state['operator'],
            'provider'         => 'skysms',
            'message'          => 'Ouvrez la page de paiement : la demande arrive sur votre téléphone, validez-la avec votre code secret.',
        ]);
    }

    $payload = [
        'amount'                => $montant,          // entier XAF
        'currency'              => 'XAF',
        'merchant_invoice_id'   => $ref,
        'merchant_callback_url' => camerpayCallbackUrl(),
        'merchant_return_url'   => camerpayReturnUrl($ref),
        'idempotency_key'       => $ref,
        'source'                => 'veritas',
    ];
    if ($methode !== '')     $payload['payment_method'] = $methode;
    /* ⚠️ `customer_phone` : la documentation CamerPay se CONTREDIT.
         • le courriel « 3 raisons d'échec » (11/08/2026) : « Format API :
           +237 6XX XXX XXX (avec indicatif) » ;
         • l'exemple d'appel du tableau de bord : "customer_phone": "699123456"
           — neuf chiffres, sans indicatif.
       On garde le format international, et ce n'est pas un pari : une
       transaction réelle initiée avec « +237697637739 » a été acceptée, et la
       page de paiement a bien affiché « 697637739 » — CamerPay normalise donc
       lui-même. Ne PAS « aligner sur l'exemple » sans reproduire ce test : on
       casserait un chemin qui fonctionne pour suivre une doc ambiguë. */
    if ($payerNumber !== '') $payload['customer_phone'] = '+' . $payerNumber;
    if ($clientNom !== '')   $payload['customer_name']  = mb_substr($clientNom, 0, 255);
    if ($clientMail !== '' && filter_var($clientMail, FILTER_VALIDATE_EMAIL)) {
        $payload['customer_email'] = $clientMail;
    }

    list($http, $resp) = camerpayApi('POST', '/api/payment/initiate', $payload);
    $data = json_decode((string)$resp, true) ?: [];

    // 201 = nouvelle transaction · 200 = transaction déjà active renvoyée telle
    // quelle (idempotence CamerPay). Les DEUX sont des succès.
    $uuid = $data['transaction_uuid'] ?? '';
    if (!in_array((int)$http, [200, 201], true) || $uuid === '') {
        camerpayLog($logFile, date('c') . " [INIT_FAIL] ref=$ref http=$http " . substr((string)$resp, 0, 400) . "\n");
        jsonRespCy([
            'error'  => camerpayErrorMessage($data, $http),
            'code'   => $data['error'] ?? ($data['failure_code'] ?? ''),
            'detail' => camerpaySafeDetail($data, $resp),
        ], camerpayClientFacingCode($http));
    }

    $payUrl  = (string)($data['pay_url'] ?? $data['redirect_url'] ?? '');
    // Signature du sandbox documentée : /sandbox/simulate/ dans l'URL.
    $urlSandbox = (stripos($payUrl, '/sandbox/simulate/') !== false);
    $sandbox = $urlSandbox || camerpayMode() === 'sandbox';

    /* ⚠️ CONFIGURATION QUI SE CONTREDIT — et personne ne le disait.
       CAMERPAY_MODE est DÉCLARATIF de notre côté : il n'est jamais envoyé à
       CamerPay (camerpayApi n'ajoute que le Bearer, le payload ne porte aucun
       champ de mode). Ce qui décide là-bas, c'est le JETON employé et l'état du
       KYC. Un administrateur qui bascule CAMERPAY_MODE sur « live » croit donc
       encaisser pour de vrai, pendant que CamerPay continue de renvoyer sa page
       de simulation — le symptôme, une fois de plus, est l'absence de symptôme :
       tout « fonctionne », mais aucun franc n'arrive jamais.
       On le journalise et on le remonte, à l'initiation comme dans la sonde. */
    if ($urlSandbox && camerpayMode() === 'live') {
        camerpayLog($logFile, date('c') . " [MODE_MISMATCH] ref=$ref — CAMERPAY_MODE=live mais CamerPay renvoie une page sandbox : le jeton employé est un jeton de TEST, ou le KYC n'est pas validé\n");
        @file_put_contents($stateDir . '_mode_mismatch.txt', date('c') . '|' . $ref . "\n");
    } elseif (!$urlSandbox && camerpayMode() === 'live') {
        @unlink($stateDir . '_mode_mismatch.txt');   // rentré dans l'ordre
    }

    $state = [
        'ref'            => $ref,
        'camerpay_uuid'  => $uuid,
        'pay_url'        => $payUrl,
        'montant'        => $montant,
        'label'          => $label,
        'intent'         => $intent,
        'targetId'       => $targetId,
        'accountId'      => $accountId,
        'clientNom'      => $clientNom,
        'clientTel'      => $payerNumber,
        /* L'adresse était transmise à CamerPay (customer_email) et perdue pour
           NOUS : l'état ne la gardait pas, donc l'octroi ne l'avait pas, donc la
           remise du code ne pouvait pas s'en servir. Elle n'est validée qu'une
           fois — ici — pour qu'aucune adresse douteuse n'entre dans l'état. */
        'clientEmail'    => (filter_var($clientMail, FILTER_VALIDATE_EMAIL) ? $clientMail : ''),
        // Cagnotte : mot laissé par le contributeur, affiché publiquement à côté
        // de sa contribution une fois le paiement vérifié.
        'fundMessage'    => mb_substr(trim((string)($input['fundMessage'] ?? '')), 0, 140),
        'operator'       => camerpayOperatorLabel($methode),
        'payment_method' => $methode,
        'status'         => 'pending',
        'sandbox'        => $sandbox,
        'created_at'     => date('c'),
        'provider'       => 'camerpay_cm',
        'frais_estimes'  => (int)round($montant * camerpayFeeRate()),
        'commissions'    => (isset($input['commissions']) && is_array($input['commissions'])) ? $input['commissions'] : [],
        // Calculé par le serveur ci-dessus — jamais recopié de la requête.
        'parrainage'     => $parrainageEtat,
        // Formule Famille : les identifiants des enfants à couvrir (4 au plus,
        // bornés — c'est une entrée client, l'octroi les résout lui-même).
        'beneficiaires'  => camerpaySanitizeBeneficiaires($input['beneficiaires'] ?? null),
        // Panier : le détail article par article. Sans lui, un paiement « cart »
        // confirmé par webhook ne pouvait débloquer AUCUN des articles côté
        // serveur — seul le navigateur du payeur savait ce qu'il avait acheté.
        // Borné à 50 lignes et aux 4 champs utiles : c'est une entrée client.
        'article'        => $articleEtat,
        'lignes'         => camerpaySanitizeLignes($input['lignes'] ?? null)
    ];
    file_put_contents($stateFile, json_encode($state, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));

    // Le webhook renvoie invoice_id (= notre ref) ET uuid. L'index sur l'UUID
    // sert au chemin de re-vérification et aux webhooks de payout.
    camerpayIndex($stateDir, $uuid, $ref, 'collect');

    jsonRespCy([
        'success'          => true,
        'ref'              => $ref,
        'transaction_uuid' => $uuid,
        'pay_url'          => $payUrl,
        'sandbox'          => $sandbox,
        'operator'         => $state['operator'],
        'message'          => $sandbox
            ? 'Transaction de TEST créée — la page qui s\'ouvre simule le paiement.'
            : 'Transaction créée. Ouvrez la page de paiement pour valider.',
    ]);
}

// ════════════════════════════════════════════════════════════
// 2. NOTIFY — webhook CamerPay (form-encoded + HMAC-SHA256)
// ════════════════════════════════════════════════════════════
if ($action === 'notify') {
    $raw = file_get_contents('php://input');

    // Corps en application/x-www-form-urlencoded : $_POST est normalement
    // rempli par PHP. Le repli parse php://input pour les configurations où
    // ce n'est pas le cas (POST via un proxy qui réécrit le Content-Type).
    $body = $_POST;
    if (!$body && $raw !== '') { parse_str((string)$raw, $body); }
    if (!is_array($body)) $body = [];
    if (!$body && $_GET)  $body = $_GET;

    camerpayLog($logFile, date('c') . ' | ' . substr((string)$raw, 0, 2000) . "\n");

    // ── Versements groupés : le webhook porte batch_uuid, pas uuid ──────────
    if (!empty($body['batch_uuid'])) {
        camerpayHandlePayoutWebhook($stateDir, $logFile, $body);
        http_response_code(200); echo 'OK'; exit;
    }

    $uuid      = (string)($body['uuid']       ?? '');
    $invoiceId = (string)($body['invoice_id'] ?? '');
    $status    = (string)($body['status']     ?? '');
    // ⚠️ CHAÎNE BRUTE, jamais reformatée : le HMAC porte sur « 10000.00 ».
    $amountStr = (string)($body['amount']     ?? '');
    $signature = (string)($body['signature']  ?? ($_SERVER['HTTP_X_CAMERPAY_SIGNATURE'] ?? ''));

    // 🔐 Signature HMAC-SHA256 hex sur "uuid|invoice_id|status|amount".
    // FAIL-CLOSED : `null` (secret absent) est refusé au même titre qu'une
    // signature fausse. Laisser passer une notification non signée revenait à
    // écrire un corps choisi par l'appelant dans nos fichiers d'état et à gonfler
    // le journal — pour rien, puisque le statut est de toute façon relu chez
    // CamerPay. Un webhook refusé ne perd AUCUN paiement : `?action=status`
    // (polling du payeur) et `?action=list` (réconciliation à l'ouverture du
    // tableau de bord) confirment tout seuls. La sonde `?action=config` remonte
    // `webhookSecret:false` pour que l'administrateur voie la cause.
    $sigOk = camerpayCheckSignature($uuid, $invoiceId, $status, $amountStr, $signature);
    if ($sigOk !== true) {
        camerpayLog($logFile, date('c') . ' ['
            . ($sigOk === null ? 'REJECTED_NO_SECRET' : 'REJECTED_BAD_SIGNATURE')
            . "] uuid=$uuid inv=$invoiceId\n");
        http_response_code(401);
        echo $sigOk === null ? 'CAMERPAY_CALLBACK_SECRET absent cote serveur' : 'signature invalide';
        exit;
    }

    // Notre référence = merchant_invoice_id, renvoyé tel quel. L'index sur
    // l'UUID sert de repli si le champ manque.
    $ourRef = $invoiceId !== '' ? $invoiceId : (string)camerpayResolveRef($stateDir, [$uuid]);
    $stateFile = $stateDir . _safeRefCamerpay($ourRef) . '.json';
    if ($ourRef === '' || !file_exists($stateFile)) {
        camerpayLog($logFile, date('c') . " [UNKNOWN_REF] inv=$invoiceId uuid=$uuid\n");
        http_response_code(404); echo 'ref inconnue'; exit;
    }

    $state = json_decode(file_get_contents($stateFile), true) ?: [];
    $state['notified_at'] = date('c');
    // Trace du webhook, BORNÉE : recopier `$body` tel quel laissait un tiers
    // faire grossir indéfiniment le fichier d'état (et donc la base) avec des
    // champs de son choix. On garde les champs documentés, tronqués.
    $trace = [];
    foreach (['uuid','invoice_id','status','amount','currency','payment_method','failure_code','failure_reason','paid_at'] as $k) {
        if (isset($body[$k]) && is_scalar($body[$k])) $trace[$k] = mb_substr((string)$body[$k], 0, 255);
    }
    $state['raw_webhook'] = $trace;
    if ($uuid !== '' && empty($state['camerpay_uuid'])) $state['camerpay_uuid'] = $uuid;
    // Champs « extras » non signés ajoutés par CamerPay en juillet 2026 :
    // ils expliquent l'échec sans ouvrir de ticket support.
    if (isset($body['failure_reason'])) $state['failure_reason'] = mb_substr((string)$body['failure_reason'], 0, 255);
    if (isset($body['failure_code']))   $state['failure_code']   = (string)$body['failure_code'];

    // Le payload n'est JAMAIS l'autorité : on relit le statut chez CamerPay.
    // (Même doctrine que CamPay : une signature valide prouve l'origine, pas
    //  que le montant crédité correspond à ce que nous attendions.)
    $verified = camerpayVerifyTransaction($state);
    if ($verified === null) {
        camerpayLog($logFile, date('c') . " [UNVERIFIED_NO_AUTH_STATUS] ref=$ourRef\n");
        file_put_contents($stateFile, json_encode($state, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));
        // 202 : CamerPay ne rejoue pas sur 4xx/5xx, mais ?action=status et
        // ?action=list réconcilient — aucune confirmation n'est perdue.
        http_response_code(202); echo 'unverifiable'; exit;
    }

    $state = camerpayApplyVerified($state, $verified, $logFile, $ourRef);
    // Octroi AVANT l'écriture : camerpayGrant pose le drapeau `granted`, et
    // c'est cette écriture-là qui le rend durable. Inverser les deux lignes
    // rendrait le drapeau inutile et rejouerait l'activation à chaque rejeu.
    camerpayGrant($state, $logFile, $ourRef);
    file_put_contents($stateFile, json_encode($state, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));

    http_response_code(200); echo 'OK'; exit;
}

// ════════════════════════════════════════════════════════════
// 2 bis. SKYSMS — page de paiement, demande sur le téléphone, rappel
// ════════════════════════════════════════════════════════════
// GET  ?action=payer&ref=            → page HTML (la pay_url des tunnels)
// POST ?action=skysms_collect        → { ref, tel, auto } pousse la demande (public, borné)
// GET|POST ?action=skysms_notify&cle= → rappel SkySMS (URL à déclarer chez SkySMS)
// POST ?action=skysms_confirmer      → { ref } validation manuelle (admin)
// GET  ?action=skysms_diag           → état de la configuration + solde SMS (admin)
// POST ?action=skysms_test_sms       → { tel } SMS d'essai (admin)
if ($action === 'payer' && $method === 'GET') {
    $ref = trim((string) ($_GET['ref'] ?? ''));
    $f   = $stateDir . _safeRefCamerpay($ref) . '.json';
    $st  = ($ref !== '' && is_file($f)) ? (json_decode((string) file_get_contents($f), true) ?: []) : [];
    header('Content-Type: text/html; charset=utf-8');
    header('Cache-Control: no-store');
    header('X-Frame-Options: DENY');
    header('Referrer-Policy: no-referrer');
    /* Jeton exigé (audit n°4). Un état d'avant le correctif n'en a pas : il
       reste ouvrable, sa page ne montre plus le numéro qu'en masqué. */
    $jetonOk = empty($st['jeton']) || hash_equals((string) $st['jeton'], (string) ($_GET['t'] ?? ''));
    if (($st['provider'] ?? '') !== 'skysms' || !$jetonOk) {
        http_response_code(($st['provider'] ?? '') === 'skysms' ? 403 : 404);
        echo '<!doctype html><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">'
           . '<title>Paiement introuvable</title><p style="font:16px system-ui;max-width:440px;margin:40px auto;padding:0 16px">'
           . 'Cette demande de paiement est introuvable ou a expiré. Revenez sur <a href="/">VÉRITAS</a> et relancez l’achat.</p>';
        exit;
    }
    // Chemin RELATIF : la page est servie par ce fichier, donc même origine.
    echo vrt_skysms_page($st, 'payment_camerpay.php');
    exit;
}

if ($action === 'skysms_collect' && $method === 'POST') {
    if (!vrt_skysms_collecte_active()) jsonRespCy(['error' => 'Le paiement Mobile Money automatique est indisponible.'], 503);
    $in  = json_decode((string) file_get_contents('php://input'), true) ?: [];
    $ref = trim((string) ($in['ref'] ?? ''));
    $stateFile = $stateDir . _safeRefCamerpay($ref) . '.json';
    if ($ref === '' || !is_file($stateFile)) jsonRespCy(['error' => 'Demande de paiement introuvable.'], 404);

    $verrou = skysmsVerrouiller($stateFile);
    $state = skysmsLireEtat($stateFile);
    // Par RÉFÉRENCE : la collecte reprend un second verrou plus bas, c'est
    // celui-là que $refuser doit rendre.
    $refuser = function ($corps, $code) use (&$verrou) { skysmsDeverrouiller($verrou); jsonRespCy($corps, $code); };
    if (($state['provider'] ?? '') !== 'skysms') $refuser(['error' => 'Référence non gérée par ce moyen de paiement.'], 400);
    if (!empty($state['jeton']) && !hash_equals((string) $state['jeton'], (string) ($in['t'] ?? ''))) {
        $refuser(['error' => 'Lien de paiement invalide. Relancez l’achat depuis VÉRITAS.'], 403);
    }
    $stat = (string) ($state['status'] ?? '');
    if ($stat === 'paid') $refuser(['ok' => true, 'status' => 'paid'], 200);
    if ($stat !== 'pending' && $stat !== 'failed') $refuser(['error' => 'Cette demande est close (' . $stat . ').'], 409);

    // Champ vide = le numéro enregistré à l'achat (la page ne le montre que masqué).
    $telSaisi = (string) ($in['tel'] ?? '');
    $tel = vrt_skysms_tel_local($telSaisi !== '' ? $telSaisi : (string) ($state['clientTel'] ?? ''));
    if ($tel === '' || camerpayGuessMethod($tel) === '') {
        $refuser(['error' => 'Entrez un numéro MTN ou Orange à 9 chiffres (6XX XX XX XX).'], 400);
    }
    // La page déclenche seule la première demande quand le numéro est connu :
    // un rechargement de la page ne doit pas en pousser une seconde.
    if (!empty($in['auto']) && !empty($state['push_count'])) $refuser(['ok' => true, 'deja' => true, 'status' => $stat], 200);

    // Bornes : cette action est publique et sonne un téléphone. Par référence
    // (6 demandes, 30 s d'écart) ET par IP (débit partagé avec init).
    $n = (int) ($state['push_count'] ?? 0);
    if ($n >= 6) $refuser(['error' => 'Trop de demandes pour ce paiement. Relancez l’achat depuis VÉRITAS.'], 429);
    $depuis = time() - strtotime((string) ($state['last_push_at'] ?? '@0'));
    if ($depuis < 30) $refuser(['error' => 'Une demande vient d’être envoyée : validez-la sur votre téléphone, ou réessayez dans ' . (30 - $depuis) . ' s.'], 429);
    skysmsDeverrouiller($verrou);   // le débit par IP peut sortir (429) : verrou rendu avant
    camerpayInitRateLimit($stateDir);

    $idc = vrt_skysms_id_client();
    $verrou = skysmsVerrouiller($stateFile);
    $state = skysmsLireEtat($stateFile) ?: $state;
    /* REVÉRIFIER sous ce second verrou : le premier a été rendu pour le débit
       par IP. Entre les deux, un rappel a pu passer « payé », ou un second clic
       a pu pousser sa demande — sans ce contrôle, une seconde demande partait
       sur le téléphone d'un client déjà débité. */
    $stat2 = (string) ($state['status'] ?? '');
    if ($stat2 === 'paid') $refuser(['ok' => true, 'status' => 'paid'], 200);
    if ($stat2 !== 'pending' && $stat2 !== 'failed') $refuser(['error' => 'Cette demande est close (' . $stat2 . ').'], 409);
    $depuis2 = time() - strtotime((string) ($state['last_push_at'] ?? '@0'));
    if ($depuis2 < 30) $refuser(['error' => 'Une demande vient d’être envoyée : validez-la sur votre téléphone, ou réessayez dans ' . (30 - $depuis2) . ' s.'], 429);
    if ((int) ($state['push_count'] ?? 0) >= 6) $refuser(['error' => 'Trop de demandes pour ce paiement. Relancez l’achat depuis VÉRITAS.'], 429);
    $state['push_count']   = (int) ($state['push_count'] ?? 0) + 1;
    $state['last_push_at'] = date('c');
    $state['clientTel']    = '237' . $tel;
    $state['operator']     = camerpayOperatorLabel(camerpayGuessMethod($tel));
    $state['payment_method'] = camerpayGuessMethod($tel);
    $state['id_clients']   = array_slice(array_merge((array) ($state['id_clients'] ?? []), [$idc]), -6);
    if (($state['status'] ?? '') === 'failed') { $state['status'] = 'pending'; unset($state['failed_at'], $state['failure_reason']); }
    // Écrit AVANT l'appel : SkySMS peut rappeler pendant qu'il nous fait attendre.
    vrt_skysms_indexer($stateDir, $idc, $ref);
    skysmsEcrireEtat($stateFile, $state);
    // Verrou RENDU pendant l'appel (jusqu'à 75 s) : le rappel doit pouvoir passer.
    skysmsDeverrouiller($verrou);

    @ignore_user_abort(true);   // le payeur peut fermer la page : on garde la réponse
    $r = vrt_skysms_collecter($tel, (int) $state['montant'], $idc);

    $d = $r['data'];
    camerpayLog($logFile, date('c') . " [SKYSMS_COLLECT] ref=$ref idc=$idc http={$r['http']} attente=" . ($r['attente'] ? 1 : 0)
        . ' rep=' . substr(json_encode($d, JSON_UNESCAPED_UNICODE), 0, 400) . "\n");
    $idop = trim((string) ($d['id_operation'] ?? ''));

    /* Relire SOUS VERROU et ne poser QUE ce que la collecte apprend : un rappel
       a pu passer « payé » pendant l'attente — on ne l'écrase plus (n°5). */
    $verrou = skysmsVerrouiller($stateFile);
    $state = skysmsLireEtat($stateFile) ?: $state;
    if ($idop !== '') {
        vrt_skysms_indexer($stateDir, $idop, $ref);
        $state['id_operation'] = $idop;
        /* La paire (id_client → id_operation) : seuls SkySMS et nous la
           connaissons. Le rappel devra la reproduire (audit n°1). */
        $ops = (array) ($state['ops'] ?? []);
        $ops[$idc] = $idop;
        $state['ops'] = array_slice($ops, -6, null, true);
    }
    $state['push_reponse'] = ['http' => $r['http'], 'statut' => (string) ($d['statut'] ?? ''),
                              'description' => mb_substr((string) ($d['description'] ?? $r['msg']), 0, 200), 'at' => date('c')];
    if (!$r['ok']) {
        $state['push_error'] = mb_substr($r['msg'], 0, 200);
        skysmsEcrireEtat($stateFile, $state);
        skysmsDeverrouiller($verrou);
        jsonRespCy(['error' => 'La demande n’a pas pu être envoyée : ' . $r['msg']], 502);
    }
    /* La réponse de la collecte n'ouvre JAMAIS l'accès. Mesuré le 15/10/2026 :
       elle revient en ~20 s avec `statut:"1"` et « Demande de collecte
       enregistrée… Veuillez valider le paiement en saisissant votre code Pin »
       — AVANT que le payeur ait validé. Lue comme un verdict, elle aurait
       ouvert l'accès sans paiement. Seuls le rappel et l'administration
       confirment. */
    skysmsEcrireEtat($stateFile, $state);
    skysmsDeverrouiller($verrou);
    jsonRespCy(['ok' => true, 'status' => $state['status'] ?? 'pending', 'attente' => $r['attente'],
                'message' => 'Validez la demande sur votre téléphone avec votre code secret.']);
}

if ($action === 'skysms_notify') {
    $body = skysmsCorpsRappel($logFile, 'SKYSMS_RAPPEL');
    skysmsCleValide($body, $logFile, $method, 'SKYSMS_RAPPEL_REFUSE');

    /* Clé bonne : on ACCUSE toujours « 1 » (SKYSOFT renvoie sinon sans fin),
       y compris quand le rappel est refusé ou demande un contrôle humain —
       un renvoi n'y changerait rien. Accuser n'est jamais payer. */
    $rp  = vrt_skysms_lire_rappel($body);
    $ref = vrt_skysms_resoudre($stateDir, [$rp['id_client'], $rp['id_operation']]);
    $stateFile = $stateDir . _safeRefCamerpay($ref) . '.json';
    if ($ref === '' || !is_file($stateFile)) {
        camerpayLog($logFile, date('c') . " [SKYSMS_REF_INCONNUE] idc={$rp['id_client']} idop={$rp['id_operation']} (accuse 1)\n");
        skysmsAccuser();
    }
    $verrou = skysmsVerrouiller($stateFile);
    $state = skysmsLireEtat($stateFile);
    $accuser = function () use ($verrou) { skysmsDeverrouiller($verrou); skysmsAccuser(); };
    if (($state['provider'] ?? '') !== 'skysms') {
        camerpayLog($logFile, date('c') . " [SKYSMS_PROVIDER_AUTRE] ref=$ref (accuse 1)\n");
        $accuser();
    }

    /* LA CLÉ NE SUFFIT PLUS (audit 15/10/2026, n°1). Le rappel officiel ne
       porte ni montant ni numéro : la clé de l'URL était le SEUL contrôle, et
       une clé qui fuit validait n'importe quel paiement en attente. La
       collecte nous a appris, pour chaque id_client, l'id_operation de
       SkySMS — que personne d'autre ne connaît. Le rappel doit le reproduire.
       Collecte coupée sans réponse (pas d'id_operation connu) : la clé reste
       seule juge, et l'état le dit (`controle`). */
    $ops = (array) ($state['ops'] ?? []);
    $opAttendu = ($rp['id_client'] !== '' && isset($ops[$rp['id_client']])) ? (string) $ops[$rp['id_client']] : '';
    if ($opAttendu === '' && $rp['id_client'] === '' && $rp['id_operation'] !== '' && in_array($rp['id_operation'], $ops, true)) {
        $opAttendu = $rp['id_operation'];          // résolu par l'id_operation lui-même
    }
    /* Seul un « payé » ouvre un accès : c'est lui qu'on exige authentique. Un
       « échec » ou une « attente » sans id_operation reste lu (au pire, le
       payeur relance sa demande) — c'est aussi la forme minimale qu'emploie
       tests/banc_skysms_rappel.cjs. */
    // Comparaison sur la forme normalisée (espaces, casse) : un UUID renvoyé en
    // majuscules par le rappel n'est pas une autre opération.
    $opNorm = function ($s) { return strtolower(trim((string) $s)); };
    if ($rp['verdict'] === 'paid' && $opAttendu !== '' && !hash_equals($opNorm($opAttendu), $opNorm($rp['id_operation']))) {
        $state['a_regler'] = true;
        $state['reason']   = 'Rappel refusé : son id_operation ne correspond pas à la demande envoyée. À vérifier sur le relevé SkySMS.';
        camerpayLog($logFile, date('c') . " [SKYSMS_OP_DIFFERENT] ref=$ref idc={$rp['id_client']} recu=" . mb_substr($rp['id_operation'], 0, 60) . " (accuse 1, rien ouvert)\n");
        skysmsEcrireEtat($stateFile, $state);
        $accuser();
    }

    $trace = [];
    foreach ($body as $k => $v) {
        if (count($trace) >= 25) break;
        if (is_scalar($v)) $trace[mb_substr((string) $k, 0, 40)] = mb_substr((string) $v, 0, 200);
    }
    $state['raw_rappel']  = $trace;
    $state['notified_at'] = date('c');
    if ($rp['id_operation'] !== '' && empty($state['id_operation'])) $state['id_operation'] = $rp['id_operation'];
    if ($rp['id_operateur'] !== '') $state['id_operateur'] = mb_substr($rp['id_operateur'], 0, 80);

    // Le rappel n'est pas signé : on recoupe le numéro qui a payé, s'il est donné.
    $telAttendu = vrt_skysms_tel_local((string) ($state['clientTel'] ?? ''));
    if ($rp['verdict'] === 'paid' && $rp['tel'] !== '' && $telAttendu !== '' && $rp['tel'] !== $telAttendu) {
        $state['a_regler'] = true;
        $state['reason']   = 'Rappel « payé » pour le ' . vrt_skysms_tel_masque($rp['tel']) . ', attendu ' . vrt_skysms_tel_masque($telAttendu) . ' : à vérifier.';
        camerpayLog($logFile, date('c') . " [SKYSMS_TEL_DIFFERENT] ref=$ref recu={$rp['tel']} attendu=$telAttendu\n");
        skysmsEcrireEtat($stateFile, $state);
        $accuser();   // reçu et consigné « à régler » : un renvoi n'y changerait rien
    }
    if ($rp['verdict'] !== 'pending') {
        if ($rp['verdict'] === 'paid') $state['controle'] = $opAttendu !== '' ? 'cle+operation' : 'cle_seule';
        // Verdict d'abord, octroi ENSUITE (n°6) : l'octroi copie la base et
        // envoie les SMS du code — des secondes que SKYSOFT n'a pas à attendre.
        skysmsAppliquer($state, $rp['verdict'], $rp['montant'], 'rappel', $rp['motif'], $logFile, $ref, false);
    }
    skysmsEcrireEtat($stateFile, $state);

    /* Répondre AVANT d'octroyer quand le serveur sait couper la connexion
       (LiteSpeed : litespeed_finish_request ; PHP-FPM : fastcgi_finish_request).
       L'état « payé » est déjà écrit et le verrou tenu : l'octroi qui suit ne
       peut ni se perdre ni se doubler. Sans ces fonctions, comportement d'avant. */
    $fin = function_exists('litespeed_finish_request') ? 'litespeed_finish_request'
         : (function_exists('fastcgi_finish_request') ? 'fastcgi_finish_request' : '');
    if ($fin !== '' && ($state['status'] ?? '') === 'paid' && empty($state['granted'])) {
        @ignore_user_abort(true);
        header('Content-Type: text/plain; charset=utf-8');
        http_response_code(200); echo '1';
        while (ob_get_level() > 0) @ob_end_flush();
        @flush();
        $fin();
        camerpayGrant($state, $logFile, $ref);
        skysmsEcrireEtat($stateFile, $state);
        skysmsDeverrouiller($verrou);
        exit;
    }
    camerpayGrant($state, $logFile, $ref);
    skysmsEcrireEtat($stateFile, $state);
    $accuser();
}

if ($action === 'skysms_confirmer' && $method === 'POST') {
    requirePayAuth();
    $in  = json_decode((string) file_get_contents('php://input'), true) ?: [];
    $ref = trim((string) ($in['ref'] ?? ''));
    $stateFile = $stateDir . _safeRefCamerpay($ref) . '.json';
    if ($ref === '' || !is_file($stateFile)) jsonRespCy(['error' => 'ref inconnue'], 404);
    $verrou = skysmsVerrouiller($stateFile);
    $state = skysmsLireEtat($stateFile);
    if (($state['provider'] ?? '') !== 'skysms') { skysmsDeverrouiller($verrou); jsonRespCy(['error' => 'pas un paiement SkySMS'], 400); }
    $m = (isset($in['montant']) && is_numeric($in['montant'])) ? (int) $in['montant'] : null;
    skysmsAppliquer($state, 'paid', $m, 'admin', 'Validé par l’administration après contrôle SkySMS', $logFile, $ref);
    skysmsEcrireEtat($stateFile, $state);
    skysmsDeverrouiller($verrou);
    jsonRespCy(['ok' => true, 'ref' => $ref, 'status' => $state['status'] ?? '', 'granted' => !empty($state['granted']),
                'grant_msg' => $state['grant_msg'] ?? '', 'a_regler' => !empty($state['a_regler'])]);
}

/* ── ACCUSÉ DE RÉCEPTION DES SMS (rappel SKYSOFT) ────────────────────────────
   URL à déclarer chez SKYSOFT comme « callback SMS » (même clé que le rappel
   des paiements) : …/payment_camerpay.php?action=skysms_dlr&cle=<clé>.
   Format attendu (doc V2023 § 3) : ssid_sms, idsmsclient, statut (1 délivré,
   0 non délivré), datereception — lu largement, comme le rappel de paiement. */
if ($action === 'skysms_dlr') {
    $body = skysmsCorpsRappel($logFile, 'SKYSMS_DLR');
    skysmsCleValide($body, $logFile, $method, 'SKYSMS_DLR_REFUSE');
    $pick = function (array $cles) use ($body) {
        foreach ($cles as $k) { if (isset($body[$k]) && is_scalar($body[$k]) && trim((string) $body[$k]) !== '') return trim((string) $body[$k]); }
        return '';
    };
    $ssid = $pick(['ssid_sms', 'ssid', 'id_sms', 'idsms', 'id']);
    $idsms = $pick(['idsmsclient', 'id_sms_client', 'idSmsClient', 'id_client']);
    $m = skysmsMessageParSms($ssid, $idsms);
    if (!$m) {
        /* « Retourne 1 pour que je sache que tu as reçu » (SKYSOFT, 15/10/2026).
           Clé valide = la notification est bien de chez eux et bien arrivée : on
           l'accuse, même si le SMS n'est pas une remise de code (SMS d'essai,
           test de leur côté). Répondre autre chose les ferait renvoyer sans fin
           un accusé qu'aucun renvoi ne rendra rattachable. Trace gardée. */
        camerpayLog($logFile, date('c') . " [SKYSMS_DLR_INCONNU] ssid=$ssid idsms=$idsms (accuse 1)\n");
        skysmsAccuser();
    }
    $m['dlr'] = ['statut' => vrt_skysms_dlr_statut($pick(['statut', 'status', 'delivered', 'dlr_status'])),
                 'date' => mb_substr($pick(['datereception', 'dlrtime', 'date', 'delivered_at']), 0, 40),
                 'motif' => mb_substr($pick(['description', 'dlrerror', 'message']), 0, 160),
                 'recu_at' => time(), 'source' => 'rappel'];
    vrt_notify_ecrire($m);
    camerpayLog($logFile, date('c') . ' [SKYSMS_DLR] ref=' . ($m['ref'] ?? '') . ' statut=' . $m['dlr']['statut'] . "\n");
    // Accusé attendu par SKYSOFT (15/10/2026) : le corps « 1 » = notification reçue.
    // Toute autre réponse (clé refusée) leur fait renvoyer.
    skysmsAccuser();
}

/* ── SUIVI (admin) : paiements, codes remis, SMS envoyés et délivrés ────────── */
if ($action === 'skysms_suivi' && $method === 'GET') {
    requirePayAuth();
    $jours  = max(1, min(90, (int) ($_GET['jours'] ?? 14)));
    $depuis = time() - $jours * 86400;
    $reg    = function_exists('vrt_livret_registre_charger') ? vrt_livret_registre_charger() : [];
    $vus    = [];
    $lignes = [];
    $tot = ['payes' => 0, 'encaisse' => 0, 'attente' => 0, 'echecs' => 0, 'a_regler' => 0,
            'codes' => 0, 'codes_affiches' => 0, 'codes_utilises' => 0,
            'sms_envoyes' => 0, 'sms_delivres' => 0, 'sms_non_delivres' => 0, 'sms_en_echec' => 0, 'sms_en_attente' => 0];

    $ligneRemise = function (string $ref) use ($reg, &$tot) {
        $out = ['code' => null, 'sms' => null];
        $v = function_exists('vrt_livret_vente_lire') ? vrt_livret_vente_lire($ref) : null;
        if ($v && !empty($v['code'])) {
            $e = $reg['codes'][vrt_livret_cle((string) $v['code'])] ?? null;
            $out['code'] = ['fin' => '…' . substr((string) $v['code'], -4), 'classe' => (string) ($v['classe'] ?? ''),
                            'affiche_at' => $v['retire_at'] ?? null, 'affichages' => (int) ($v['retraits'] ?? 0),
                            'appareils' => is_array($e) ? count((array) ($e['dev'] ?? [])) : null,
                            'utilisations' => is_array($e) ? (int) ($e['use'] ?? 0) : null];
            $tot['codes']++;
            if (!empty($v['retire_at'])) $tot['codes_affiches']++;
            if (is_array($e) && (count((array) ($e['dev'] ?? [])) > 0 || (int) ($e['use'] ?? 0) > 0)) $tot['codes_utilises']++;
        }
        $m = function_exists('vrt_notify_lire') ? vrt_notify_lire($ref) : null;
        if ($m) {
            $etat = (string) ($m['etat'] ?? '');
            $out['sms'] = ['etat' => $etat, 'canal' => (string) ($m['canal'] ?? ''), 'essais' => (int) ($m['essais'] ?? 0),
                           'envoye_at' => $m['envoye_at'] ?? null, 'erreur' => mb_substr((string) ($m['erreur'] ?? ''), 0, 140),
                           'dlr' => $m['dlr'] ?? null, 'type' => (string) ($m['kind'] ?? '')];
            if ($etat === 'envoye') {
                $tot['sms_envoyes']++;
                $d = (string) ($m['dlr']['statut'] ?? '');
                if ($d === 'delivre') $tot['sms_delivres']++;
                elseif ($d === 'non_delivre') $tot['sms_non_delivres']++;
            } elseif ($etat === 'echec') $tot['sms_en_echec']++;
            elseif ($etat === 'attente') $tot['sms_en_attente']++;
        }
        return $out;
    };

    foreach (camerpayCollectStates($stateDir, 'skysms') as $p) {
        if (strtotime((string) ($p['created_at'] ?? '')) < $depuis) continue;
        $ref = (string) ($p['ref'] ?? ''); $vus[$ref] = true;
        $st = (string) ($p['status'] ?? '');
        if ($st === 'paid') { $tot['payes']++; $tot['encaisse'] += (int) ($p['montant_paye'] ?? $p['montant'] ?? 0); }
        elseif ($st === 'pending') $tot['attente']++;
        else $tot['echecs']++;
        if (!empty($p['a_regler'])) $tot['a_regler']++;
        $lignes[] = ['ref' => $ref, 'source' => 'skysms', 'cree' => $p['created_at'] ?? null, 'label' => (string) ($p['label'] ?? ''),
                     'intent' => (string) ($p['intent'] ?? ''), 'montant' => (int) ($p['montant'] ?? 0), 'tel' => (string) ($p['clientTel'] ?? ''),
                     'operateur' => (string) ($p['operator'] ?? ''), 'statut' => $st, 'paye_at' => $p['paid_at'] ?? null,
                     'confirme_par' => (string) ($p['paid_source'] ?? ''), 'id_operateur' => (string) ($p['id_operateur'] ?? ''),
                     'demandes' => (int) ($p['push_count'] ?? 0), 'erreur_demande' => (string) ($p['push_error'] ?? ''),
                     'accorde' => !empty($p['granted']), 'a_regler' => !empty($p['a_regler']),
                     'octroi' => mb_substr((string) ($p['grant_msg'] ?? ''), 0, 140), 'motif' => (string) ($p['failure_reason'] ?? ($p['reason'] ?? ''))]
                   + $ligneRemise($ref);
    }
    // Les remises nées d'un paiement par CODE MARCHAND validé (hors SkySMS) :
    // le SMS du code part pareil, il doit se voir pareil.
    foreach ((function_exists('vrt_notify_liste') ? vrt_notify_liste(500) : []) as $n) {
        $ref = (string) ($n['ref'] ?? '');
        if ($ref === '' || isset($vus[$ref]) || (int) ($n['cree'] ?? 0) < $depuis) continue;
        $lignes[] = ['ref' => $ref, 'source' => 'code_marchand', 'cree' => date('c', (int) $n['cree']), 'label' => (string) ($n['classe'] ?? ''),
                     'intent' => (string) ($n['kind'] ?? ''), 'montant' => null, 'tel' => '…' . (string) ($n['tel4'] ?? ''),
                     'statut' => 'paid', 'accorde' => true] + $ligneRemise($ref);
    }
    usort($lignes, function ($a, $b) { return strcmp((string) ($b['cree'] ?? ''), (string) ($a['cree'] ?? '')); });
    jsonRespCy(['ok' => true, 'jours' => $jours, 'totaux' => $tot, 'lignes' => $lignes,
                'canaux' => function_exists('vrt_notify_canaux') ? vrt_notify_canaux() : []]);
}

/* ── Consulter chez SKYSOFT l'accusé des SMS sans réponse (admin) ─────────── */
if ($action === 'skysms_sms_verifier' && $method === 'POST') {
    requirePayAuth();
    $faits = 0; $maj = 0; $limite = time() - 7 * 86400;
    foreach ((glob(vrt_notify_dir() . '/*.json') ?: []) as $f) {
        if ($faits >= 25) break;
        $m = json_decode((string) @file_get_contents($f), true);
        if (!is_array($m) || ($m['etat'] ?? '') !== 'envoye' || ($m['canal'] ?? '') !== 'skysms' || empty($m['ssid'])) continue;
        if ((int) ($m['envoye_at'] ?? 0) < $limite) continue;
        if (in_array((string) ($m['dlr']['statut'] ?? ''), ['delivre', 'non_delivre'], true)) continue;
        $faits++;
        $r = vrt_skysms_dlr_consulter((string) $m['ssid']);
        if (!$r['ok']) continue;
        $m['dlr'] = ['statut' => $r['statut'], 'date' => $r['date'], 'motif' => $r['motif'], 'recu_at' => time(), 'source' => 'consultation'];
        vrt_notify_ecrire($m); $maj++;
    }
    jsonRespCy(['ok' => true, 'consultes' => $faits, 'mis_a_jour' => $maj]);
}

/* ── Renvoyer le SMS d'une remise (admin) ─────────────────────────────────── */
if ($action === 'skysms_sms_relancer' && $method === 'POST') {
    requirePayAuth();
    $in = json_decode((string) file_get_contents('php://input'), true) ?: [];
    $ref = trim((string) ($in['ref'] ?? ''));
    $m = ($ref !== '' && function_exists('vrt_notify_lire')) ? vrt_notify_lire($ref) : null;
    if (!$m) jsonRespCy(['error' => 'Aucune remise pour cette référence.'], 404);
    $m['etat'] = 'attente'; $m['essais'] = 0; $m['prochain'] = 0; unset($m['dlr']);
    vrt_notify_ecrire($m);
    $r = vrt_notify_vider(5);
    $apres = vrt_notify_lire($ref) ?: [];
    jsonRespCy(['ok' => true, 'etat' => $apres['etat'] ?? '', 'erreur' => mb_substr((string) ($apres['erreur'] ?? ''), 0, 160), 'file' => $r]);
}

if ($action === 'skysms_diag' && $method === 'GET') {
    requirePayAuth();
    $cle = vrt_skysms_cle_rappel();
    jsonRespCy([
        'collecteActive' => vrt_skysms_collecte_active(),
        'jetonPublic'    => vrt_skysms_jeton_public() !== '',
        'cleRappel'      => $cle !== '',
        'pret'           => camerpaySkysmsPret(),
        // L'adresse à déclarer chez SkySMS (champ « URL de callback » du compte).
        'urlRappel'      => $cle !== '' ? camerpayPublicBase() . '/api/payment_camerpay.php?action=skysms_notify&cle=' . rawurlencode($cle) : '',
        'urlRappelSms'   => $cle !== '' ? camerpayPublicBase() . '/api/payment_camerpay.php?action=skysms_dlr&cle=' . rawurlencode($cle) : '',
        'smsActif'       => vrt_skysms_sms_actif(),
        // Longueur seulement : départage « mauvais fichier » de « mauvais mot de passe ».
        'identifiantsLongueur' => ['user' => strlen(vrt_skysms_const('SKYSMS_USER')), 'password' => strlen(vrt_skysms_const('SKYSMS_PASSWORD')),
                                   'sender' => vrt_skysms_const('SKYSMS_SENDER')],
        'soldeSms'       => vrt_skysms_sms_actif() ? vrt_skysms_solde() : null,
        'joignable'      => skysmsJoignable(),
        'dernieresDemandes' => skysmsDernieresDemandes($stateDir, 8),
    ]);
}

if ($action === 'skysms_test_sms' && $method === 'POST') {
    requirePayAuth();
    $in = json_decode((string) file_get_contents('php://input'), true) ?: [];
    $r  = vrt_skysms_sms((string) ($in['tel'] ?? ''), (string) ($in['message'] ?? 'Test SMS VERITAS : la passerelle SkySMS fonctionne.'), 'VRTTEST' . time());
    jsonRespCy($r, !empty($r['ok']) ? 200 : 502);
}

// ════════════════════════════════════════════════════════════
// 3. STATUS — polling frontend
// ════════════════════════════════════════════════════════════
if ($action === 'status' && $method === 'GET') {
    $ref = trim($_GET['ref'] ?? '');
    if (!$ref) jsonRespCy(['error' => 'ref requise'], 400);

    $stateFile = $stateDir . _safeRefCamerpay($ref) . '.json';
    if (!file_exists($stateFile)) {
        /* ── COMMANDE PAYÉE PAR CODE MARCHAND (21/09/2026) ─────────────────
           Tous les tunnels suivent un paiement en interrogeant CETTE action :
           l'Atelier (_sonderPaiement, _reconcilierPaiements), les cahiers
           (ecranAttente, repriseAchat), l'application. Plutôt que d'apprendre
           à chacun un second point de suivi, on répond ici pour les commandes
           déclarées dans api/payment_manuel.php : « paid » une fois validées
           par l'administration, « pending » tant qu'elles attendent.
           Rien d'autre ne sort — cette action n'est pas authentifiée. */
        if (preg_match('/^[A-Za-z0-9._-]{4,64}$/', $ref) && strpos($ref, '..') === false) {
            // Même dossier que l'octroi (et que le rapprochement SMS) : une seule source.
            require_once __DIR__ . '/_manuel_lib.php';
            $fm = vrt_pm_dir() . 'manuel_' . $ref . '.json';
            if (is_file($fm)) {
                $m = json_decode((string) @file_get_contents($fm), true) ?: [];
                jsonRespCy([
                    'ref'     => $ref,
                    'status'  => !empty($m['granted']) ? 'paid' : 'pending',
                    'paid_at' => !empty($m['granted']) ? ($m['granted_at'] ?? null) : null,
                    'manuel'  => true,
                    'intent'  => $m['intent'] ?? 'generic',
                ]);
            }
        }
        jsonRespCy(['status' => 'unknown', 'ref' => $ref]);
    }

    $state = json_decode(file_get_contents($stateFile), true) ?: [];
    $age   = time() - strtotime($state['created_at'] ?? 'now');
    // 🔒 Anti-amplification. Cette action est NON authentifiée (le payeur poll
    //    sans compte) et chaque passage déclenchait un appel sortant vers
    //    CamerPay : une boucle sur une seule référence connue suffisait à faire
    //    marteler notre serveur chez le fournisseur, jusqu'au 429 qui aurait
    //    alors bloqué les VRAIS paiements. On borne la re-vérification par
    //    référence, pas par IP — les adresses tournent, la référence non.
    //    4 secondes laissent le polling légitime (5 s) inchangé.
    $depuisControle = time() - strtotime($state['last_check_at'] ?? '@0');
    /* Paiement SkySMS : rien à vérifier chez un fournisseur (pas de
       `camerpay_uuid`), seul le rappel tranche. Ne PAS réécrire l'état : la
       page de paiement interroge toutes les 5 s, et cette écriture pouvait
       effacer un « payé » posé par le rappel entre la lecture et l'écriture. */
    if (($state['status'] ?? '') === 'pending' && $age > 5 && $depuisControle >= 4 && !empty($state['camerpay_uuid'])) {
        $state['last_check_at'] = date('c');
        $verified = camerpayVerifyTransaction($state);
        if ($verified !== null) {
            $state = camerpayApplyVerified($state, $verified, $logFile, $ref);
            camerpayGrant($state, $logFile, $ref);   // pose `granted` — écrire APRÈS
        }
        file_put_contents($stateFile, json_encode($state, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));
    }

    // ⚠️ Action NON authentifiée (le payeur poll sans compte). On ne renvoie
    //    donc QUE ce dont l'écran de suivi a besoin. `targetId` / `accountId`
    //    en sortaient : une référence est courte (préfixe + date + 4 caractères),
    //    donc énumérable, et ces deux champs désignent un élève et un compte.
    //    Aucun code client ne les lisait — vérifié avant retrait.
    jsonRespCy([
        'ref'             => $ref,
        'status'          => $state['status'] ?? 'pending',
        'paid_at'         => $state['paid_at'] ?? null,
        'failed_at'       => $state['failed_at'] ?? null,
        'provider_status' => $state['provider_status'] ?? null,
        'operator'        => $state['operator'] ?? null,
        'sandbox'         => (bool)($state['sandbox'] ?? false),
        'intent'          => $state['intent'] ?? 'generic',
        // SkySMS : la pay_url porte le jeton de la page (audit n°4) — cette
        // action publique ne doit pas le rendre à qui connaît la référence.
        // Aucun tunnel ne la lit ici : ils la prennent dans la réponse d'init.
        'pay_url'         => (($state['provider'] ?? '') === 'skysms') ? null : ($state['pay_url'] ?? null),
        // failure_reason vient du provider (Orange/MTN/Stripe) : « solde
        // insuffisant », « PIN incorrect »… C'est ce qu'on montre au payeur.
        'reason'          => $state['failure_reason'] ?? ($state['reason'] ?? null),
        'failure_code'    => $state['failure_code'] ?? null,
        // « Payé » ne veut pas dire « accès ouvert » : un octroi bloqué (compte
        // introuvable…) laisse granted faux. Le tunnel doit pouvoir le dire.
        'granted'         => !empty($state['granted']),
        'a_regler'        => !empty($state['a_regler']),
    ]);
}

// ════════════════════════════════════════════════════════════
// 4. LIST — encaissements + totaux + RÉCONCILIATION des « pending »
// ════════════════════════════════════════════════════════════
// CamerPay ne rejoue pas un webhook perdu. Cette action est le filet : à chaque
// ouverture du tableau de bord, toute transaction encore « pending » de moins
// de 24 h est re-vérifiée auprès de CamerPay et l'accès est octroyé si elle a
// été payée pendant que notre serveur était injoignable.
if ($action === 'list' && $method === 'GET') {
    requirePayAuth();
    // SkySMS écrit dans le même dossier, avec le même schéma : une seule liste.
    // Ses lignes « pending » ne se re-vérifient pas (aucune route de statut
    // chez SkySMS) — camerpayVerifyTransaction rend null faute d'UUID.
    $payments = array_merge(camerpayCollectStates($stateDir, 'skysms'), camerpayCollectStates($stateDir, 'camerpay_cm'));
    usort($payments, function ($a, $b) { return strcmp($b['created_at'] ?? '', $a['created_at'] ?? ''); });
    $reconciles = 0;

    /* ⏳ DÉLAI AU-DELÀ DUQUEL UNE TRANSACTION EN ATTENTE EST CLOSE.
       Sept jours : bien plus que le temps de payer, assez pour couvrir un
       week-end prolongé pendant lequel personne n'ouvre le tableau de bord. */
    $limiteAbandon = defined('CAMERPAY_PENDING_TTL') ? (int) CAMERPAY_PENDING_TTL : 604800;
    $expires = 0;

    foreach ($payments as $i => $p) {
        /* PAYÉ MAIS PAS OCTROYÉ : camerpayGrant laisse `granted` faux quand
           l'octroi est bloqué (compte pas encore synchronisé…) en comptant sur
           cette passe pour réessayer — mais elle ne regardait que les
           « pending ». Une ligne « paid » bloquée ne repassait donc jamais.
           camerpayGrant borne lui-même les essais (5) puis pose `granted`. */
        if (($p['status'] ?? '') === 'paid' && empty($p['granted'])) {
            // Chaque octroi copie la base entière : 5 rejeux par ouverture au plus.
            if (($rejoues = ($rejoues ?? 0) + 1) > 5) continue;
            $fG = $stateDir . _safeRefCamerpay($p['ref'] ?? '') . '.json';
            $vG = skysmsVerrouiller($fG);
            $p = skysmsLireEtat($fG) ?: $p;
            if (($p['status'] ?? '') === 'paid' && empty($p['granted'])) {
                camerpayGrant($p, $logFile, $p['ref'] ?? '');
                skysmsEcrireEtat($fG, $p);
                camerpayLog($logFile, date('c') . ' [OCTROI_REJOUE] ref=' . ($p['ref'] ?? '') . ' granted=' . (empty($p['granted']) ? 0 : 1) . "\n");
            }
            skysmsDeverrouiller($vG);
            $payments[$i] = $p;
            continue;
        }
        if (($p['status'] ?? '') !== 'pending') continue;
        $age = time() - strtotime($p['created_at'] ?? 'now');
        if ($age < 60) continue;                      // trop frais : le payeur est encore dessus

        /* SKYSMS : AUCUNE ROUTE DE STATUT, DONC JAMAIS CLOSE (audit n°7).
           Rien ne peut dire si une attente SkySMS a été payée : rappel perdu, ou
           payeur qui n'a jamais validé ? La clore cacherait un client qui a
           payé. Au-delà de 24 h on la SIGNALE (`a_regler`) : l'administration
           vérifie sur le relevé SkySMS, puis valide (skysms_confirmer). */
        if (($p['provider'] ?? '') === 'skysms') {
            if ($age > 86400 && empty($p['a_regler'])) {
                $fSky = $stateDir . _safeRefCamerpay($p['ref'] ?? '') . '.json';
                $vSky = skysmsVerrouiller($fSky);
                $p = skysmsLireEtat($fSky) ?: $p;
                if (($p['status'] ?? '') === 'pending' && empty($p['a_regler'])) {
                    $p['a_regler'] = true;
                    $p['reason']   = 'Aucune confirmation SkySMS après 24 h : vérifiez le relevé SkySMS, puis validez ou laissez en attente.';
                    skysmsEcrireEtat($fSky, $p);
                    camerpayLog($logFile, date('c') . ' [SKYSMS_ATTENTE_24H] ref=' . ($p['ref'] ?? '') . "\n");
                }
                skysmsDeverrouiller($vSky);
                $payments[$i] = $p;
            }
            continue;
        }

        /* ⚠️ CE `continue` PRENAIT L'ARGENT SANS RIEN RENDRE.
           La ligne disait `if ($age > 86400 ... ) continue;` — passé 24 h, la
           transaction n'était PLUS JAMAIS examinée. Or CamerPay ne rejoue pas
           un webhook perdu (voir plus haut) : il suffisait que la notification
           se perde ET que le client ferme son onglet pour que le paiement
           reste « pending » à vie. L'argent était bien encaissé chez CamerPay ;
           l'accès n'était jamais ouvert ; et rien, nulle part, ne le signalait.
           Le seuil doit DÉCLENCHER un traitement, pas l'interrompre.

           On vérifie donc une dernière fois auprès de CamerPay avant de
           clore : c'est précisément le cas où un paiement abouti a été oublié.
           Si le fournisseur ne répond pas, on ne clôt RIEN — mieux vaut une
           ligne en attente qu'une transaction payée marquée abandonnée. */
        $verified = camerpayVerifyTransaction($p);

        if ($verified === null) {
            if ($age > $limiteAbandon) {
                camerpayLog($logFile, date('c') . ' [PENDING_INVERIFIABLE] ref=' . ($p['ref'] ?? '')
                    . ' age=' . $age . "s — laissée en attente, CamerPay injoignable\n");
            }
            continue;
        }

        $p = camerpayApplyVerified($p, $verified, $logFile, $p['ref'] ?? '');
        camerpayGrant($p, $logFile, $p['ref'] ?? '');   // pose `granted` — écrire APRÈS

        /* Toujours en attente APRÈS vérification, et trop vieille : le payeur
           n'a jamais réglé. On la clôt pour qu'elle sorte des « en attente »,
           en gardant la trace de la raison — un état muet est ce qui avait
           rendu le problème d'origine invisible. */
        if (($p['status'] ?? '') === 'pending' && $age > $limiteAbandon) {
            $p['status']     = 'expired';
            $p['expired_at'] = date('c');
            $p['reason']     = 'Abandonnée : aucun paiement constaté après '
                             . round($limiteAbandon / 86400) . ' jours.';
            camerpayLog($logFile, date('c') . ' [PENDING_EXPIRE] ref=' . ($p['ref'] ?? '')
                . ' age=' . $age . "s\n");
            $expires++;
        } else {
            $reconciles++;
        }

        file_put_contents($stateDir . _safeRefCamerpay($p['ref'] ?? '') . '.json',
            json_encode($p, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));
        $payments[$i] = $p;
    }

    $brut = 0; $net = 0; $frais = 0; $test = 0;
    foreach ($payments as $p) {
        if (($p['status'] ?? '') !== 'paid') continue;
        $m = intval($p['montant_paye'] ?? $p['montant'] ?? 0);
        // Les transactions sandbox ne sont PAS de l'argent : les compter dans
        // le chiffre d'affaires ferait mentir le tableau de bord.
        if (!empty($p['sandbox'])) { $test += $m; continue; }
        $f = intval($p['frais'] ?? $p['frais_estimes'] ?? 0);
        $brut += $m; $frais += $f; $net += intval($p['net_encaisse'] ?? ($m - $f));
    }

    jsonRespCy([
        'count'      => count($payments),
        'reconciles' => $reconciles,
        // Rendu explicite : l'administration doit voir qu'on a clos des lignes,
        // et combien. Un nettoyage silencieux ressemble à une perte de données.
        'expires'    => $expires,
        'totaux'     => [
            'brut_paye'    => $brut,
            'frais'        => $frais,          // estimation : CamerPay ne renvoie pas la commission par transaction
            'net_encaisse' => $net,
            'montant_test' => $test,           // sandbox, hors comptabilité
        ],
        'note'     => 'Frais ESTIMÉS (SkySMS : taux SKYSMS_FEE_RATE ; anciennes lignes CamerPay : ' . (camerpayFeeRate() * 100) . ' %). Le montant exact figure sur le relevé du fournisseur.',
        'payments' => $payments
    ]);
}

// ════════════════════════════════════════════════════════════
// 5. HISTORY — relevé reconstitué depuis nos propres états
// ════════════════════════════════════════════════════════════
// CamerPay n'expose pas d'endpoint « relevé » (OpenAPI vérifié : 5 opérations).
// On agrège donc ce que NOUS savons, et on dit clairement d'où viennent les
// chiffres — plutôt que de laisser croire à un relevé bancaire faisant foi.
/* RATTRAPER LES DROITS VENDUS SOUS UN LOGIN — passe manuelle, idempotente.
   Du 31/08 au 02/09/2026, l'octroi recevait le login au lieu de l'identifiant
   du compte : le livre numérique répondait « compte introuvable », et
   l'abonnement se déclarait « activé » en n'inscrivant le plan nulle part. Le
   correctif protège les ventes à venir ; celles-là sont déjà encaissées.

     GET  ?action=repair_identities&dry=1   → compte sans rien changer
     POST ?action=repair_identities         → applique

   Toujours regarder avant d'appliquer : la simulation dit l'ampleur, et la
   passe écrit une sauvegarde horodatée avant de toucher à la base. */
if ($action === 'repair_identities') {
    requirePayAuth();
    // `$body` n'est peuplé que dans le bloc `notify` : ici on lit les
    // superglobales, sinon PHP 8 signale une variable indéfinie.
    $simulation = ($method === 'GET') || !empty($_GET['dry']) || !empty($_POST['dry']);
    if (!function_exists('vrt_reparer_identites_fichier')) {
        jsonRespCy(['ok' => false, 'error' => 'passe de réparation absente — api/_auth_lib.php pas à jour'], 500);
    }
    $r = vrt_reparer_identites_fichier($simulation);
    camerpayLog($logFile, date('c') . ' [REPAIR_IDENT] ' . json_encode($r) . "\n");
    jsonRespCy($r, empty($r['ok']) ? 500 : 200);
}

if ($action === 'history' && $method === 'GET') {
    requirePayAuth();
    $start = trim($_GET['start'] ?? date('Y-m-01'));
    $end   = trim($_GET['end']   ?? date('Y-m-d'));
    if (!preg_match('/^\d{4}-\d{2}-\d{2}$/', $start) || !preg_match('/^\d{4}-\d{2}-\d{2}$/', $end)) {
        jsonRespCy(['error' => 'Dates attendues au format YYYY-MM-DD'], 400);
    }

    $rows = []; $encaisse = 0; $frais = 0;
    foreach (camerpayCollectStates($stateDir, 'camerpay_cm') as $p) {
        if (($p['status'] ?? '') !== 'paid' || !empty($p['sandbox'])) continue;
        $d = substr((string)($p['paid_at'] ?? $p['created_at'] ?? ''), 0, 10);
        if ($d < $start || $d > $end) continue;
        $m = intval($p['montant_paye'] ?? $p['montant'] ?? 0);
        $f = intval($p['frais'] ?? $p['frais_estimes'] ?? 0);
        $encaisse += $m; $frais += $f;
        $rows[] = ['date' => $d, 'ref' => $p['ref'] ?? '', 'montant' => $m,
                   'frais_estimes' => $f, 'label' => $p['label'] ?? '',
                   'methode' => $p['payment_method'] ?? ''];
    }

    $verse = 0;
    foreach (camerpayCollectStates($stateDir, 'camerpay_payout_cm') as $o) {
        if (($o['status'] ?? '') !== 'sent') continue;
        $d = substr((string)($o['sent_at'] ?? $o['created_at'] ?? ''), 0, 10);
        if ($d < $start || $d > $end) continue;
        $verse += intval($o['montant'] ?? 0);
    }

    jsonRespCy([
        'periode' => ['start' => $start, 'end' => $end],
        'totaux'  => ['encaisse_brut' => $encaisse, 'frais_estimes' => $frais,
                      'net_estime' => max(0, $encaisse - $frais), 'verse' => $verse],
        'count'   => count($rows),
        'source'  => 'local',
        'note'    => 'Relevé reconstitué depuis les paiements enregistrés par VÉRITAS. CamerPay n\'expose pas d\'API de relevé : le document faisant foi reste celui de camerpay.biz/client.',
        'data'    => $rows
    ]);
}

// ════════════════════════════════════════════════════════════
// 6. REFUND — remboursement total ou partiel
// ════════════════════════════════════════════════════════════
if ($action === 'refund' && $method === 'POST') {
    requirePayAuth();
    camerpayRequireConfig();

    $in     = json_decode(file_get_contents('php://input'), true) ?: [];
    $ref    = trim($in['ref'] ?? '');
    $mnt    = intval($in['montant'] ?? 0);          // 0 = remboursement total
    $motif  = trim($in['motif'] ?? 'Remboursement VÉRITAS');
    if (!$ref) jsonRespCy(['error' => 'ref requise'], 400);

    $stateFile = $stateDir . _safeRefCamerpay($ref) . '.json';
    if (!file_exists($stateFile)) jsonRespCy(['error' => 'Transaction inconnue'], 404);
    $state = json_decode(file_get_contents($stateFile), true) ?: [];
    if (($state['status'] ?? '') !== 'paid') {
        jsonRespCy(['error' => 'Seule une transaction payée peut être remboursée (statut actuel : ' . ($state['status'] ?? '?') . ')'], 409);
    }
    if (empty($state['camerpay_uuid'])) jsonRespCy(['error' => 'UUID CamerPay manquant sur cette transaction'], 409);

    $body = ['reason' => mb_substr($motif, 0, 255)];
    if ($mnt > 0) $body['amount'] = $mnt;

    list($http, $resp) = camerpayApi('POST', '/api/payment/' . rawurlencode($state['camerpay_uuid']) . '/refund', $body);
    $data = json_decode((string)$resp, true) ?: [];
    if ($http < 200 || $http >= 300) {
        jsonRespCy(['error' => camerpayErrorMessage($data, $http), 'detail' => camerpaySafeDetail($data, $resp)], camerpayClientFacingCode($http));
    }

    $state['refunds'][]   = ['montant' => $mnt ?: intval($state['montant_paye'] ?? $state['montant'] ?? 0),
                             'motif' => $motif, 'at' => date('c')];
    $state['status']      = 'refunded';
    $state['refunded_at'] = date('c');
    file_put_contents($stateFile, json_encode($state, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));
    camerpayLog($logFile, date('c') . " [REFUND] ref=$ref montant=" . ($mnt ?: 'total') . "\n");

    // La commission du Code ami suit l'argent : remboursée, elle est reprise.
    if (function_exists('vrt_parr_annuler')) {
        try {
            $ann = vrt_parr_annuler($ref, $mnt, 'remboursement');
            if (!empty($ann['annule'])) camerpayLog($logFile, date('c') . " [CODE_AMI_REPRISE] ref=$ref commission=" . (int) $ann['annule'] . "\n");
        } catch (\Throwable $e) {
            camerpayLog($logFile, date('c') . " [CODE_AMI_REPRISE_ERR] ref=$ref " . $e->getMessage() . "\n");
        }
    }

    // La recette d'un livre suit l'argent aussi : remboursee, elle ne compte
    // plus dans la part de son auteur. Un panier est repris ligne par ligne.
    if (function_exists('vrt_rec_annuler')) {
        try {
            $rep = vrt_rec_annuler($ref, (int) $mnt);
            if ($rep > 0) camerpayLog($logFile, date('c') . " [RECETTE_REPRISE] ref=$ref recette=" . $rep . "\n");
        } catch (\Throwable $e) {
            camerpayLog($logFile, date('c') . " [RECETTE_REPRISE_ERR] ref=$ref " . $e->getMessage() . "\n");
        }
    }

    // ⚠️ Le remboursement N'ANNULE PAS l'accès déjà ouvert : révoquer un
    // entitlement au milieu d'un trimestre est une décision pédagogique, pas
    // technique. L'admin retire l'accès à la main s'il le veut.
    jsonRespCy(['success' => true, 'ref' => $ref,
                'message' => 'Remboursement demandé. Orange/MTN ne sont pas réversibles par API : vérifiez auprès du support CamerPay. L\'accès de l\'élève reste ouvert — retirez-le manuellement si nécessaire.']);
}

// ════════════════════════════════════════════════════════════
// 6bis. CODE AMI — versements dus, lancés par l'administration
// ════════════════════════════════════════════════════════════
// Le versement part tout seul au crédit qui franchit le seuil. Ce bouton
// rattrape le reste : un numéro corrigé après coup, un lot refusé puis
// réparé, un budget épuisé. `benef` vide = tous les soldes dus.
if ($action === 'parrainage_verser' && $method === 'POST') {
    requirePayAuth();
    camerpayRequireConfig();
    $in = json_decode(file_get_contents('php://input'), true) ?: [];
    $benef = preg_replace('/[^A-Za-z0-9:_.@-]/', '', (string) ($in['benef'] ?? ''));
    $bilan = camerpayParrainageVerser($logFile, $benef !== '' ? 1 : 20, $benef);
    jsonRespCy(['success' => true] + $bilan + ['message' =>
        $bilan['soumis'] . ' versement(s) soumis à CamerPay (validation < 4 h ouvrées), '
        . $bilan['bloques'] . ' bloqué(s), ' . $bilan['echecs'] . ' en échec.']);
}

// ════════════════════════════════════════════════════════════
// 7. WITHDRAW — versement à UN bénéficiaire
// ════════════════════════════════════════════════════════════
// CamerPay n'a pas d'endpoint « un seul versement » : on envoie un lot d'une
// ligne. Conséquence à connaître — tout lot passe par une APPROBATION MANUELLE
// d'un administrateur CamerPay (SLA annoncé < 4 h ouvrées). Un versement
// partenaire n'est donc jamais instantané, contrairement à CamPay.
if ($action === 'withdraw' && $method === 'POST') {
    requirePayAuth();
    camerpayRequireConfig();

    $input        = json_decode(file_get_contents('php://input'), true) ?: [];
    $montant      = intval($input['montant']    ?? 0);
    $to           = camerpayNormalizePhone(trim($input['to'] ?? ''));
    $ref          = trim($input['ref']          ?? '');
    $partenaireId = trim($input['partenaireId'] ?? '');
    $note         = trim($input['note']         ?? 'Versement partenaire VÉRITAS');
    $nom          = trim($input['nomAttendu']   ?? ($input['nom'] ?? ''));
    $methode      = strtolower(trim($input['methode'] ?? ''));

    if ($montant <= 0)      jsonRespCy(['error' => 'montant requis (entier)'], 400);
    if (!$ref)              jsonRespCy(['error' => 'ref requise (idempotence)'], 400);
    if (strlen($to) !== 12) jsonRespCy(['error' => 'Numéro destinataire invalide (format 2376XXXXXXXX)'], 400);

    // `method` est OBLIGATOIRE côté CamerPay pour un payout et n'accepte que
    // orange_money ou mtn_momo. Un mauvais choix envoie l'argent nulle part :
    // on refuse plutôt que de deviner quand le préfixe est ambigu.
    if ($methode === '') $methode = camerpayGuessMethod($to);
    if (!in_array($methode, ['orange_money', 'mtn_momo'], true)) {
        jsonRespCy(['error' => 'Opérateur indéterminé pour ' . $to . ' — précisez « methode » (orange_money ou mtn_momo).'], 400);
    }

    $plafond = defined('CAMERPAY_PAYOUT_MAX') ? (int)CAMERPAY_PAYOUT_MAX : 200000;
    if ($montant > $plafond) {
        jsonRespCy(['error' => 'Montant supérieur au plafond de versement (' . $plafond . ' FCFA). Modifiez CAMERPAY_PAYOUT_MAX si volontaire.'], 400);
    }

    // 🔒 Idempotence locale : jamais deux envois pour une même réf.
    $outFile = $stateDir . _safePayoutCamerpay($ref) . '.json';
    if (file_exists($outFile)) {
        $existing = json_decode(file_get_contents($outFile), true) ?: [];
        jsonRespCy(['success' => true, 'already' => true, 'ref' => $ref,
                    'status' => $existing['status'] ?? 'pending',
                    'message' => 'Versement déjà émis pour cette référence (aucun double envoi).']);
    }

    list($http, $resp) = camerpayApi('POST', '/api/payouts/batch', [
        'reference'     => $ref,
        'description'   => mb_substr($note, 0, 255),
        'callback_url'  => camerpayCallbackUrl(),
        'beneficiaries' => [[
            'phone'       => '+' . $to,
            'amount'      => $montant,
            'name'        => mb_substr($nom !== '' ? $nom : 'Partenaire VÉRITAS', 0, 120),
            'method'      => $methode,
            'external_id' => $ref,
        ]],
    ]);
    $data = json_decode((string)$resp, true) ?: [];
    if ($http < 200 || $http >= 300 || empty($data['batch_uuid'])) {
        jsonRespCy(['error' => camerpayErrorMessage($data, $http), 'detail' => camerpaySafeDetail($data, $resp)], camerpayClientFacingCode($http));
    }

    $out = [
        'ref'              => $ref,
        'camerpay_batch'   => $data['batch_uuid'],
        'montant'          => $montant,
        'to'               => $to,
        'titulaire'        => $nom,
        'methode'          => $methode,
        'partenaireId'     => $partenaireId,
        'note'             => $note,
        'status'           => 'pending',
        'provider_status'  => strtoupper((string)($data['status'] ?? 'PENDING_APPROVAL')),
        'estimated_fees'   => intval($data['estimated_fees'] ?? 0),
        'created_at'       => date('c'),
        'provider'         => 'camerpay_payout_cm'
    ];
    file_put_contents($outFile, json_encode($out, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));
    camerpayIndex($stateDir, $data['batch_uuid'], $ref, 'withdraw');
    camerpayLog($logFile, date('c') . " [PAYOUT] ref=$ref to=$to montant=$montant methode=$methode\n");

    jsonRespCy(['success' => true, 'ref' => $ref, 'batch_uuid' => $data['batch_uuid'],
                'status' => 'pending_approval',
                'message' => 'Versement soumis. CamerPay exige une approbation manuelle avant exécution (généralement moins de 4 h ouvrées).']);
}

// ════════════════════════════════════════════════════════════
// 8. MASS PAYOUT — N bénéficiaires en un lot
// ════════════════════════════════════════════════════════════
if ($action === 'masspayout' && $method === 'POST') {
    requirePayAuth();
    camerpayRequireConfig();

    $input   = json_decode(file_get_contents('php://input'), true) ?: [];
    $mpRef   = trim($input['ref']     ?? '');
    $comment = trim($input['comment'] ?? 'Versements VÉRITAS');
    $lignes  = (isset($input['lignes']) && is_array($input['lignes'])) ? $input['lignes'] : [];

    if (!$mpRef)  jsonRespCy(['error' => 'ref du lot requise (idempotence)'], 400);
    if (!$lignes) jsonRespCy(['error' => 'aucune ligne de versement'], 400);
    // Limite BEAC documentée par CamerPay.
    if (count($lignes) > 100) jsonRespCy(['error' => 'CamerPay limite un lot à 100 bénéficiaires. Découpez en plusieurs lots.'], 400);

    $mpFile = $stateDir . _safeMassCamerpay($mpRef) . '.json';
    if (file_exists($mpFile)) {
        $ex = json_decode(file_get_contents($mpFile), true) ?: [];
        jsonRespCy(['success' => true, 'already' => true, 'ref' => $mpRef,
                    'status' => $ex['status'] ?? 'pending',
                    'message' => 'Lot déjà envoyé (aucun double versement).']);
    }

    $plafond    = defined('CAMERPAY_PAYOUT_MAX') ? (int)CAMERPAY_PAYOUT_MAX : 200000;
    // CamerPay plafonne un lot à 2 000 000 XAF (BEAC) : on ne peut pas être
    // plus permissif que le fournisseur, seulement plus prudent.
    $plafondLot = min(2000000, defined('CAMERPAY_MASSPAYOUT_MAX') ? (int)CAMERPAY_MASSPAYOUT_MAX : 2000000);

    $benefs = []; $total = 0; $meta = [];
    foreach ($lignes as $l) {
        $m  = intval($l['montant'] ?? 0);
        $to = camerpayNormalizePhone(trim($l['to'] ?? ''));
        $r  = trim($l['ref'] ?? '');
        $me = strtolower(trim($l['methode'] ?? ''));
        if ($me === '') $me = camerpayGuessMethod($to);
        if ($m <= 0 || strlen($to) !== 12 || !$r) {
            jsonRespCy(['error' => 'Ligne invalide (montant entier, numéro 2376XXXXXXXX, ref) : ' . json_encode($l)], 400);
        }
        if (!in_array($me, ['orange_money', 'mtn_momo'], true)) {
            jsonRespCy(['error' => 'Opérateur indéterminé pour ' . $to . ' (ligne ' . $r . ') — ajoutez « methode ».'], 400);
        }
        if ($m > $plafond) jsonRespCy(['error' => 'Ligne au-dessus du plafond unitaire (' . $plafond . ' FCFA) : ' . $r], 400);
        $total += $m;
        $benefs[] = ['phone' => '+' . $to, 'amount' => $m,
                     'name' => mb_substr(trim((string)($l['nom'] ?? 'Partenaire VÉRITAS')), 0, 120),
                     'method' => $me, 'external_id' => $r];
        $meta[$r] = ['montant' => $m, 'to' => $to, 'partenaireId' => trim($l['partenaireId'] ?? '')];
    }
    if ($total > $plafondLot) {
        jsonRespCy(['error' => 'Total du lot (' . $total . ') supérieur au plafond autorisé (' . $plafondLot . ' FCFA).'], 400);
    }

    list($http, $resp) = camerpayApi('POST', '/api/payouts/batch', [
        'reference'     => $mpRef,
        'description'   => mb_substr($comment, 0, 255),
        'callback_url'  => camerpayCallbackUrl(),
        'beneficiaries' => $benefs,
    ]);
    $data = json_decode((string)$resp, true) ?: [];
    if ($http < 200 || $http >= 300 || empty($data['batch_uuid'])) {
        jsonRespCy(['error' => camerpayErrorMessage($data, $http), 'detail' => camerpaySafeDetail($data, $resp)], camerpayClientFacingCode($http));
    }

    $mp = [
        'ref'             => $mpRef,
        'camerpay_batch'  => $data['batch_uuid'],
        'comment'         => $comment,
        'total'           => $total,
        'nb'              => count($benefs),
        'meta'            => $meta,
        'status'          => 'pending',
        'provider_status' => strtoupper((string)($data['status'] ?? 'PENDING_APPROVAL')),
        'estimated_fees'  => intval($data['estimated_fees'] ?? 0),
        'created_at'      => date('c'),
        'provider'        => 'camerpay_masspayout_cm'
    ];
    file_put_contents($mpFile, json_encode($mp, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));
    camerpayIndex($stateDir, $data['batch_uuid'], $mpRef, 'masspayout');
    camerpayLog($logFile, date('c') . " [MASSPAYOUT] ref=$mpRef nb=" . count($benefs) . " total=$total\n");

    jsonRespCy(['success' => true, 'ref' => $mpRef, 'batch_uuid' => $data['batch_uuid'],
                'nb' => count($benefs), 'total' => $total, 'status' => 'pending_approval',
                'message' => count($benefs) . ' versement(s) soumis. En attente d\'approbation CamerPay (moins de 4 h ouvrées).']);
}

// ════════════════════════════════════════════════════════════
// 9. MASS PAYOUT STATUS — détail ligne par ligne
// ════════════════════════════════════════════════════════════
if ($action === 'masspayout_status' && $method === 'GET') {
    requirePayAuth();
    $mpRef = trim($_GET['ref'] ?? '');
    if (!$mpRef) jsonRespCy(['error' => 'ref requise'], 400);
    $mpFile = $stateDir . _safeMassCamerpay($mpRef) . '.json';
    if (!file_exists($mpFile)) jsonRespCy(['error' => 'lot inconnu'], 404);

    $mp = json_decode(file_get_contents($mpFile), true) ?: [];
    list($http, $resp) = camerpayApi('GET', '/api/payouts/batch/' . rawurlencode((string)($mp['camerpay_batch'] ?? '')));
    if ($http !== 200) jsonRespCy(['error' => 'CamerPay HTTP ' . $http, 'detail' => camerpaySafeDetail(json_decode((string)$resp, true), $resp)], 502);

    $d = json_decode((string)$resp, true) ?: [];
    $mp['provider_status'] = strtoupper((string)($d['status'] ?? ''));
    if (in_array($mp['provider_status'], ['COMPLETED', 'COMPLETE'], true)) $mp['status'] = 'complete';

    $lignes = [];
    foreach (($d['payouts'] ?? []) as $it) {
        $r  = (string)($it['external_id'] ?? '');
        $st = strtolower((string)($it['status'] ?? ''));
        $lignes[] = [
            'ref'          => $r,
            'to'           => $it['phone'] ?? '',
            'montant'      => intval($it['amount'] ?? ($mp['meta'][$r]['montant'] ?? 0)),
            'partenaireId' => $mp['meta'][$r]['partenaireId'] ?? '',
            'status'       => ($st === 'completed') ? 'sent' : (($st === 'failed') ? 'failed' : 'pending'),
            'reason'       => $it['failure_reason'] ?? '',
        ];
    }
    $mp['lignes'] = $lignes;
    file_put_contents($mpFile, json_encode($mp, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));

    jsonRespCy(['ref' => $mpRef, 'status' => $mp['status'], 'provider_status' => $mp['provider_status'],
                'nb' => $mp['nb'] ?? count($lignes), 'total' => $mp['total'] ?? 0,
                'completed' => intval($d['completed_count'] ?? 0), 'failed' => intval($d['failed_count'] ?? 0),
                'lignes' => $lignes]);
}

// ════════════════════════════════════════════════════════════
// 10. PAYOUTS — liste + rafraîchissement des versements unitaires
// ════════════════════════════════════════════════════════════
if ($action === 'payouts' && $method === 'GET') {
    requirePayAuth();
    $payouts = camerpayCollectStates($stateDir, 'camerpay_payout_cm');
    foreach ($payouts as $i => $p) {
        if (($p['status'] ?? '') !== 'pending' || empty($p['camerpay_batch'])) continue;
        list($h, $r) = camerpayApi('GET', '/api/payouts/batch/' . rawurlencode($p['camerpay_batch']));
        if ($h !== 200) continue;
        $d = json_decode((string)$r, true) ?: [];
        // Un lot d'une ligne : le statut de la ligne est celui du versement.
        $ligne = ($d['payouts'][0] ?? []);
        $st = strtolower((string)($ligne['status'] ?? $d['status'] ?? ''));
        if ($st === 'completed')                                    { $p['status'] = 'sent';   $p['sent_at']   = date('c'); }
        elseif (in_array($st, ['failed', 'cancelled', 'rejected'], true)) { $p['status'] = 'failed'; $p['failed_at'] = date('c');
                                                                      $p['reason'] = $ligne['failure_reason'] ?? ''; }
        $p['provider_status'] = strtoupper((string)($d['status'] ?? ''));
        file_put_contents($stateDir . _safePayoutCamerpay($p['ref']) . '.json', json_encode($p, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));
        camerpayParrainageSuivi((string) ($p['ref'] ?? ''), (string) ($p['status'] ?? ''), (string) ($p['reason'] ?? ''));
        $payouts[$i] = $p;
    }
    jsonRespCy(['count' => count($payouts), 'payouts' => $payouts]);
}

// ════════════════════════════════════════════════════════════
// 11. BALANCE / HOLDER — capacités que CamerPay n'expose pas
// ════════════════════════════════════════════════════════════
// On répond 200 avec `unsupported: true` plutôt qu'une erreur : le bouton de
// l'écran d'administration doit afficher une phrase utile, pas un 500 rouge.
/* ── HOOKLOG — pourquoi une notification a-t-elle été refusée ? ──────────────
   CamerPay affiche « 1 webhook en échec · votre serveur n'a pas pu être
   notifié », ce qui laisse croire à un serveur injoignable. Dans la plupart des
   cas il a très bien répondu — il a REFUSÉ, et il a dit pourquoi :
     REJECTED_BAD_SIGNATURE → CAMERPAY_CALLBACK_SECRET ≠ celui du tableau de bord
     REJECTED_NO_SECRET     → secret absent côté serveur (fail-closed)
     UNKNOWN_REF            → invoice_id inconnu de nos fichiers d'état
     UNVERIFIED_NO_AUTH...  → statut irrelisible chez CamerPay (jeton ?)
     MODE_MISMATCH          → CAMERPAY_MODE=live mais pages de test
   Ce motif ne vivait que dans un fichier accessible en FTP. Il se lit désormais
   depuis l'écran d'administration. Lecture seule, réservée à l'admin. */
if ($action === 'hooklog' && $method === 'GET') {
    requirePayAuth();
    $n = max(1, min(200, (int)($_GET['lines'] ?? 50)));
    $lignes = is_file($logFile) ? @file($logFile, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES) : [];
    if (!is_array($lignes)) $lignes = [];
    $recent = array_slice($lignes, -$n);

    // Compte des refus, pour dire en UNE phrase ce qui cloche.
    $motifs = [];
    foreach (['REJECTED_BAD_SIGNATURE', 'REJECTED_NO_SECRET', 'UNKNOWN_REF',
              'UNVERIFIED_NO_AUTH_STATUS', 'MODE_MISMATCH', 'AMOUNT_MISMATCH', 'GRANT'] as $m) {
        $c = 0;
        foreach ($lignes as $l) if (strpos($l, '[' . $m . ']') !== false) $c++;
        if ($c > 0) $motifs[$m] = $c;
    }
    $diag = '';
    if (!empty($motifs['REJECTED_BAD_SIGNATURE'])) {
        $diag = 'Les notifications arrivent bien, mais leur signature est refusée : CAMERPAY_CALLBACK_SECRET ne correspond pas à celui affiché sur camerpay.biz/client. Recopiez-le exactement (sandbox et live peuvent en avoir deux différents).';
    } elseif (!empty($motifs['REJECTED_NO_SECRET'])) {
        $diag = 'CAMERPAY_CALLBACK_SECRET est absent du serveur : toute notification est refusée (fail-closed). Aucun paiement n\'est perdu — le polling confirme — mais renseignez-le dans api/payment_config.php.';
    } elseif (!empty($motifs['UNKNOWN_REF'])) {
        $diag = 'Une notification portait une référence inconnue de ce serveur : transaction créée depuis un AUTRE environnement (local, autre domaine), ou fichiers d\'état effacés.';
    } elseif (!empty($motifs['UNVERIFIED_NO_AUTH_STATUS'])) {
        $diag = 'La notification a été acceptée mais le statut n\'a pas pu être relu chez CamerPay (jeton refusé ou API injoignable). Vérifiez CAMERPAY_TOKEN.';
    }
    /* EMPREINTE du secret, jamais le secret.
       « Le secret est-il le bon ? » ne se vérifie pas à l'œil : les deux valeurs
       vivent à deux endroits différents (tableau de bord CamerPay / serveur), et
       les recopier pour comparer est le meilleur moyen de les faire fuiter — un
       secret HMAC lu par un tiers permet de forger des notifications.
       On publie donc les 12 premiers caractères d'un SHA-256 SALÉ du secret :
       assez pour comparer, inutilisable pour remonter à la valeur. La commande
       qui calcule la même empreinte sur le secret affiché par CamerPay est
       donnée juste à côté — si les deux chaînes diffèrent, le secret du serveur
       n'est pas celui du tableau de bord, et c'est toute l'explication des
       « webhooks en échec ». Rappel : sandbox et live peuvent avoir DEUX
       secrets distincts — passer en live sans reporter le nouveau les casse tous. */
    $secretPose = defined('CAMERPAY_CALLBACK_SECRET') && CAMERPAY_CALLBACK_SECRET !== ''
                  && strpos(CAMERPAY_CALLBACK_SECRET, 'À_REMPLIR') === false;
    $fp = $secretPose ? substr(hash('sha256', 'vrt-fp|' . CAMERPAY_CALLBACK_SECRET), 0, 12) : '';
    // Le jeton API a droit à la même empreinte : « ai-je bien remplacé le jeton
    // de test par celui de production ? » se vérifie ainsi sans le recopier.
    $fpTok = camerpayConfigured() ? substr(hash('sha256', 'vrt-fp|' . CAMERPAY_TOKEN), 0, 12) : '';

    /* ⚠️ DÉFINITIONS EN DOUBLE — le piège de `if (!defined(...)) define(...)`.
       Ces gardes évitent une erreur fatale si le fichier est inclus deux fois,
       mais elles ont un effet de bord redoutable : la PREMIÈRE définition gagne,
       et les suivantes sont ignorées SANS le moindre avertissement. Un
       administrateur qui remplace son jeton de test par le jeton live dans le
       second bloc voit… exactement le même comportement qu'avant, et cherche la
       panne partout ailleurs. PHP ne sait pas dire où une constante a été
       définie : on lit donc le fichier de configuration et on compte. */
    $doublons = [];
    $cfgFile = __DIR__ . '/payment_config.php';
    if (is_readable($cfgFile)) {
        $src = (string) @file_get_contents($cfgFile);
        foreach (['CAMERPAY_TOKEN', 'CAMERPAY_CALLBACK_SECRET', 'CAMERPAY_PUBLIC_INIT', 'CAMERPAY_MODE'] as $c) {
            $n = preg_match_all("/define\s*\(\s*['\"]" . $c . "['\"]/", $src);
            if ($n > 1) $doublons[$c] = $n;
        }
    }

    jsonRespCy([
        'ok'         => true,
        'count'      => count($lignes),
        'motifs'     => $motifs,
        'diagnostic' => $diag ?: 'Aucun refus enregistré dans ce journal.',
        'callback_url' => camerpayCallbackUrl(),
        'secret_pose'        => $secretPose,
        'secret_empreinte'   => $fp,
        'token_empreinte'    => $fpTok,
        'definitions_en_double' => $doublons ?: null,
        'alerte_doublons'    => $doublons
            ? 'ATTENTION : ' . implode(', ', array_keys($doublons)) . ' est défini PLUSIEURS fois dans api/payment_config.php. '
              . 'Avec « if (!defined(...)) define(...) », c\'est la PREMIÈRE définition qui gagne et les suivantes sont ignorées en silence : '
              . 'la valeur que vous venez de modifier n\'est peut-être pas celle qui sert. Supprimez les définitions en trop et ne gardez que la bonne.'
            : null,
        'secret_comparaison' => $secretPose
            ? 'Collez le secret affiché sur camerpay.biz dans cette commande — il ne quitte pas votre machine : '
              . 'php -r "echo substr(hash(\'sha256\',\'vrt-fp|\'.trim(fgets(STDIN))),0,12).PHP_EOL;" '
              . '· une empreinte différente de « ' . $fp . ' » = ce n\'est pas le même secret.'
            : 'Aucun secret de webhook posé sur ce serveur : toutes les notifications sont refusées (fail-closed).',
        'lignes'     => $recent,
    ]);
}

if ($action === 'balance' && $method === 'GET') {
    requirePayAuth();
    jsonRespCy([
        'unsupported' => true,
        'provider'    => 'camerpay',
        'message'     => 'CamerPay n\'expose pas le solde par API. Consultez-le sur https://camerpay.biz/client — puis demandez un retrait vers votre Mobile Money (minimum 1 000 FCFA, versement sous 24 à 72 h ouvrées).',
        'dashboard'   => 'https://camerpay.biz/client',
    ]);
}

if ($action === 'holder' && $method === 'GET') {
    // Le frontend appelle cette action avant une contribution de cagnotte pour
    // confirmer le NOM du titulaire. CamerPay n'a pas d'équivalent : on renvoie
    // found=false, ce que le front interprète déjà comme « on n'affiche rien ».
    camerpayInitGuard($stateDir, false);   // lecture seule : ne consomme pas le quota d'initiation
    $tel = camerpayNormalizePhone(trim($_GET['tel'] ?? ''));
    if (strlen($tel) !== 12) jsonRespCy(['error' => 'Numéro invalide'], 400);
    jsonRespCy(['tel' => $tel, 'full_name' => null, 'found' => false, 'unsupported' => true,
                'operator' => camerpayOperatorLabel(camerpayGuessMethod($tel))]);
}

// ════════════════════════════════════════════════════════════
// 12. CAGNOTTES DE SCOLARITÉ — le lien partageable
// ════════════════════════════════════════════════════════════
// Au Cameroun, une scolarité n'est presque jamais payée par une seule personne.
// La cagnotte donne un LIEN : n'importe qui paie SANS créer de compte. Le
// paiement lui-même passe par ?action=init (chemin public durci) avec
// intent='cagnotte' et targetId=<token>. C'est camerpayGrant() qui, à la
// confirmation VÉRIFIÉE, inscrit la contribution — jamais le client.
if ($action === 'fund_create' && $method === 'POST') {
    requirePayAuth();
    $in = json_decode(file_get_contents('php://input'), true) ?: [];

    $prenom   = trim((string)($in['prenom']   ?? ''));
    $objectif = (int)($in['objectif'] ?? 0);
    if ($prenom === '') jsonRespCy(['error' => 'prenom requis'], 400);
    if ($objectif <= 0) jsonRespCy(['error' => 'objectif (montant total à réunir) requis'], 400);

    $token = bin2hex(random_bytes(12));   // 24 hex — non devinable
    $fund = [
        'token'      => $token,
        'eleveId'    => trim((string)($in['eleveId'] ?? '')),
        'prenom'     => mb_substr($prenom, 0, 40),
        'classe'     => mb_substr(trim((string)($in['classe'] ?? '')), 0, 30),
        'titre'      => mb_substr(trim((string)($in['titre'] ?? '')) ?: ('Scolarité de ' . $prenom), 0, 120),
        'message'    => mb_substr(trim((string)($in['message'] ?? '')), 0, 600),
        'objectif'   => $objectif,
        'echeance'   => trim((string)($in['echeance'] ?? '')),   // AAAA-MM-JJ, facultatif
        'statut'     => 'ouverte',
        'created_at' => date('c'),
        'contributions' => []
    ];
    if (!cagSave($fund)) jsonRespCy(['error' => 'Écriture impossible côté serveur'], 500);

    jsonRespCy(['success' => true, 'token' => $token,
                'url'  => camerpayFrontendBase() . '/#cagnotte?t=' . $token,
                'fund' => cagPublicView($fund)]);
}

if ($action === 'fund_get' && $method === 'GET') {
    $fund = cagLoad(trim((string)($_GET['token'] ?? '')));
    if (!$fund) jsonRespCy(['error' => 'Cagnotte introuvable ou lien expiré'], 404);
    jsonRespCy(['success' => true, 'fund' => cagPublicView($fund)]);
}

if ($action === 'fund_list' && $method === 'GET') {
    requirePayAuth();
    $out = [];
    foreach (glob(cagDir() . '*.json') ?: [] as $f) {
        if (basename($f)[0] === '_') continue;
        $p = json_decode((string)file_get_contents($f), true);
        if (!is_array($p)) continue;
        $v = cagPublicView($p);
        $v['eleveId'] = $p['eleveId'] ?? '';
        $out[] = $v;
    }
    usort($out, function ($a, $b) { return strcmp($b['created_at'] ?? '', $a['created_at'] ?? ''); });
    jsonRespCy(['success' => true, 'count' => count($out), 'data' => $out]);
}

if ($action === 'fund_close' && $method === 'POST') {
    requirePayAuth();
    $in = json_decode(file_get_contents('php://input'), true) ?: [];
    $fund = cagLoad(trim((string)($in['token'] ?? '')));
    if (!$fund) jsonRespCy(['error' => 'Cagnotte introuvable'], 404);
    $fund['statut'] = ($in['statut'] ?? 'close') === 'ouverte' ? 'ouverte' : 'close';
    cagSave($fund);
    jsonRespCy(['success' => true, 'fund' => cagPublicView($fund)]);
}

jsonRespCy(['error' => 'Action inconnue',
            'allowed' => ['config','init','notify','status','list','history','refund','withdraw',
                          'masspayout','masspayout_status','payouts','balance','holder','hooklog',
                          'fund_create','fund_get','fund_list','fund_close']], 400);

// ════════════════════════════════════════════════════════════
// HELPERS
// ════════════════════════════════════════════════════════════
function jsonRespCy($data, $code = 200) {
    http_response_code($code);
    echo json_encode($data, JSON_UNESCAPED_UNICODE);
    exit;
}

/* 🔴 15/10/2026 — CONTRAT CAMERPAY ROMPU. Ce n'est PAS un réglage : aucune
   constante de payment_config.php ne doit pouvoir rallumer un fournisseur avec
   lequel VÉRITAS n'a plus de contrat. camerpayConfigured() répond toujours non
   (sonde, init, vérification, versements des parrains) et camerpayApi() refuse
   tout appel sortant. Ce fichier reste le point d'entrée des quatre tunnels
   (il porte l'octroi, le suivi, les cagnottes) — c'est SkySMS qui encaisse. */
function camerpayResilie() { return true; }

function camerpayConfigured() {
    if (camerpayResilie()) return false;
    return defined('CAMERPAY_TOKEN') && CAMERPAY_TOKEN !== ''
        && strpos(CAMERPAY_TOKEN, 'À_REMPLIR') === false;
}

function camerpayCampayConfigured() {
    $perm = defined('CAMPAY_PERMANENT_TOKEN') && CAMPAY_PERMANENT_TOKEN !== ''
            && strpos(CAMPAY_PERMANENT_TOKEN, 'À_REMPLIR') === false;
    $cred = defined('CAMPAY_USERNAME') && CAMPAY_USERNAME !== ''
            && strpos(CAMPAY_USERNAME, 'À_REMPLIR') === false;
    return $perm || $cred;
}

/* SkySMS encaisse-t-il ? Il faut ses TROIS pièces : l'identifiant de collecte
   (sinon rien ne part), le jeton public (sinon aucun visiteur ne peut lancer
   un paiement) et la clé du rappel (sinon aucun paiement ne se confirme seul —
   on encaisserait sans jamais ouvrir l'accès). Une pièce manque : on reste sur
   le paiement par code marchand, qui, lui, fonctionne. */
function camerpaySkysmsPret() {
    return vrt_skysms_collecte_active() && vrt_skysms_jeton_public() !== '' && vrt_skysms_cle_rappel() !== '';
}

/* Page d'origine de l'achat, d'après le Referer — acceptée seulement si elle
   est sur NOTRE domaine : la page de paiement y redirige, on n'en fait pas une
   redirection ouverte vers n'importe où. */
/* Diagnostic (admin) : le serveur JOINT-il SkySMS ? Requête sans identifiants,
   vers une route qui ne débite rien : seule compte la réponse, quelle qu'elle
   soit. « partie: false » = pare-feu, DNS ou certificat — la demande de
   paiement ne pouvait pas arriver sur le téléphone. */
function skysmsJoignable() {
    $t = microtime(true);
    [$http, $rep, $err, $partie] = vrt_skysms_get('/soldesms/v1/output=json', [], 15);
    return ['ok' => $http > 0, 'http' => $http, 'requetePartie' => $partie,
            'ms' => (int) round((microtime(true) - $t) * 1000), 'erreur' => mb_substr($err, 0, 160)];
}

/* Diagnostic (admin) : ce que SkySMS a répondu aux dernières demandes poussées.
   C'est là que se lit pourquoi un téléphone n'a rien reçu. Numéros masqués. */
function skysmsDernieresDemandes($stateDir, $n) {
    $out = [];
    foreach (camerpayCollectStates($stateDir, 'skysms') as $p) {
        if (empty($p['push_count'])) continue;
        $out[] = ['ref' => (string) ($p['ref'] ?? ''), 'derniere' => (string) ($p['last_push_at'] ?? ''),
                  'demandes' => (int) $p['push_count'], 'statut' => (string) ($p['status'] ?? ''),
                  'tel' => vrt_skysms_tel_masque((string) ($p['clientTel'] ?? '')),
                  'reponseSkysms' => $p['push_reponse'] ?? null, 'erreur' => (string) ($p['push_error'] ?? ''),
                  'idOperation' => (string) ($p['id_operation'] ?? '')];
    }
    usort($out, function ($a, $b) { return strcmp($b['derniere'], $a['derniere']); });
    return array_slice($out, 0, $n);
}

function skysmsRetour() {
    $r = (string) ($_SERVER['HTTP_REFERER'] ?? '');
    $p = $r !== '' ? parse_url($r) : false;
    $nous = (string) parse_url(camerpayPublicBase(), PHP_URL_HOST);
    if (!$p || empty($p['host']) || !in_array(strtolower((string) ($p['scheme'] ?? '')), ['https', 'http'], true)) return '';
    $h = function ($x) { return preg_replace('/^www\./', '', strtolower((string) $x)); };
    if ($h($p['host']) !== $h($nous)) return '';
    return mb_substr(preg_replace('/#.*$/', '', $r), 0, 300);
}

/* Accusé attendu par SKYSOFT pour SES DEUX rappels (paiement et SMS) : le
   corps « 1 » = « notification reçue » (15/10/2026). Toute autre réponse les
   fait renvoyer. On l'envoie dès que la clé est bonne et que la notification
   est consignée — y compris quand elle ne se rattache à rien ou demande un
   contrôle humain (« à régler ») : un renvoi n'y changerait rien. Seule une
   clé absente ou fausse (401/503) reste refusée. */
function skysmsAccuser() {
    header('Content-Type: text/plain; charset=utf-8');
    http_response_code(200); echo '1'; exit;
}

/* Corps d'un rappel SKYSOFT (GET, POST formulaire ou JSON), journalisé borné. */
function skysmsCorpsRappel($logFile, $tag) {
    $raw  = (string) file_get_contents('php://input');
    $body = $_POST;
    if (!$body && $raw !== '') { $j = json_decode($raw, true); if (is_array($j)) $body = $j; else parse_str($raw, $body); }
    if (!is_array($body)) $body = [];
    $q = $_GET; unset($q['action'], $q['cle']);
    $body = $body + $q;
    // Trace BORNÉE, clé retirée.
    camerpayLog($logFile, date('c') . ' [' . $tag . '] ' . substr(json_encode($body, JSON_UNESCAPED_UNICODE), 0, 1500) . "\n");
    return $body;
}

/* Clé du rappel — SORT (401/503) si elle est absente ou fausse.
   SKYSOFT COLLE SES PARAMÈTRES AVEC UN SECOND « ? ». Mesuré le 15/10/2026 :
   leurs appels de test vides passaient la clé, leurs vrais rappels étaient
   refusés. Notre URL contient déjà « ?action=…&cle=… » : un « ?statut=1… »
   ajouté derrière fait lire cle = « <clé>?statut=1 ». On coupe au premier
   « ? » et on relit la suite comme paramètres. La clé doit rester EXACTE. */
function skysmsCleValide(array &$body, $logFile, $method, $tagRefus) {
    $cle = vrt_skysms_cle_rappel();
    if ($cle === '') { http_response_code(503); echo 'SKYSMS_CALLBACK_CLE absente cote serveur'; exit; }
    $recue = (string) ($_GET['cle'] ?? ($_SERVER['HTTP_X_VRT_CLE'] ?? ''));
    if (strpos($recue, '?') !== false) {
        [$recue, $suite] = explode('?', $recue, 2);
        $extra = []; parse_str($suite, $extra);
        foreach ($extra as $k => $v) { if (is_scalar($v) && !isset($body[$k])) $body[$k] = $v; }
    }
    $recue = trim($recue);
    if ($recue === '' || !hash_equals($cle, $recue)) {
        // Forme de la clé reçue, JAMAIS sa valeur.
        camerpayLog($logFile, date('c') . ' [' . $tagRefus . '] cle invalide (recue ' . strlen($recue)
            . ' car., attendue ' . strlen($cle) . ', debut ' . (strncmp($recue, $cle, 8) === 0 ? 'bon' : 'different')
            . ', methode ' . $method . ")\n");
        http_response_code(401); echo 'cle invalide'; exit;
    }
}

/* Le message de remise auquel se rapporte un accusé SMS (par ssid SkySMS ou
   par notre idsmsclient). La file est petite (≤ quelques centaines). */
function skysmsMessageParSms($ssid, $idsms) {
    if ($ssid === '' && $idsms === '') return null;
    foreach ((glob(vrt_notify_dir() . '/*.json') ?: []) as $f) {
        $m = json_decode((string) @file_get_contents($f), true);
        if (!is_array($m)) continue;
        if (($ssid !== '' && ($m['ssid'] ?? '') === $ssid) || ($idsms !== '' && ($m['idsms'] ?? '') === $idsms)) return $m;
    }
    return null;
}

/* VERROU PAR RÉFÉRENCE (audit 15/10/2026, n°5). La collecte, le rappel, la
   validation admin et la réconciliation lisent puis réécrivent le même fichier
   d'état. Sans verrou, un rappel « payé » arrivé pendant que la collecte
   réécrivait l'état était écrasé par « pending », et deux rappels simultanés
   lisaient tous deux « pending ». Fichier .lock à part : sous Windows un
   verrou sur le fichier d'état lui-même en interdirait la lecture. */
function skysmsVerrouiller($stateFile) {
    $fp = @fopen(preg_replace('/\.json$/', '', $stateFile) . '.lock', 'c');
    if ($fp) @flock($fp, LOCK_EX);
    return $fp;
}
function skysmsDeverrouiller($fp) {
    if ($fp) { @flock($fp, LOCK_UN); @fclose($fp); }
}
function skysmsLireEtat($stateFile) {
    return json_decode((string) @file_get_contents($stateFile), true) ?: [];
}
function skysmsEcrireEtat($stateFile, array $state) {
    file_put_contents($stateFile, json_encode($state, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE), LOCK_EX);
}

/* Applique un verdict SkySMS (rappel, réponse de collecte, ou administration)
   puis octroie. Idempotent : `camerpayGrant` ne rejoue pas un octroi posé.
   $octroyer = false : le verdict seul, l'appelant octroie après avoir répondu. */
function skysmsAppliquer(&$state, $verdict, $montant, $source, $motif, $logFile, $ref, $octroyer = true) {
    $st = (string) ($state['status'] ?? 'pending');
    if ($verdict === 'paid' && ($st === 'pending' || $st === 'failed')) {
        $attendu = (int) ($state['montant'] ?? 0);
        $state['montant_verifie'] = ($montant !== null);
        if ($montant !== null && $montant < $attendu) {
            $state['status'] = 'underpaid';
            $state['a_regler'] = true;
            $state['reason'] = 'Montant encaissé (' . $montant . ') inférieur au montant attendu (' . $attendu . ')';
            camerpayLog($logFile, date('c') . " [SKYSMS_SOUS_PAIEMENT] ref=$ref paye=$montant attendu=$attendu\n");
            return;
        }
        $state['status']          = 'paid';
        $state['paid_at']         = date('c');
        $state['paid_source']     = $source;
        $state['provider_status'] = 'SUCCESS';
        $state['montant_paye']    = $montant ?: $attendu;
        $state['frais']           = (int) round($state['montant_paye'] * vrt_skysms_taux_frais());
        $state['net_encaisse']    = max(0, $state['montant_paye'] - $state['frais']);
        unset($state['failed_at'], $state['failure_reason']);
        camerpayLog($logFile, date('c') . " [SKYSMS_PAYE] ref=$ref source=$source montant={$state['montant_paye']}\n");
    } elseif ($verdict === 'failed' && $st === 'pending') {
        $state['status']          = 'failed';
        $state['failed_at']       = date('c');
        $state['provider_status'] = 'FAILED';
        $state['failure_reason']  = $motif !== '' ? $motif : 'Paiement non abouti';
        camerpayLog($logFile, date('c') . " [SKYSMS_ECHEC] ref=$ref source=$source motif=" . mb_substr($motif, 0, 120) . "\n");
    }
    if ($octroyer) camerpayGrant($state, $logFile, $ref);
}

// Quel fournisseur sert les paiements ? PAY_PROVIDER tranche si elle est
// explicite ; sinon CamerPay dès qu'il est configuré, CamPay en repli.
function camerpayPreferredProvider($cyOk, $cpOk) {
    $forced = defined('PAY_PROVIDER') ? strtolower(trim((string)PAY_PROVIDER)) : 'auto';
    if ($forced === 'camerpay') return $cyOk ? 'camerpay' : ($cpOk ? 'campay' : '');
    if ($forced === 'campay')   return $cpOk ? 'campay'   : ($cyOk ? 'camerpay' : '');
    if ($cyOk) return 'camerpay';
    if ($cpOk) return 'campay';
    return '';
}

// Sandbox ou production ? Contrairement à CamPay, l'URL est la MÊME dans les
// deux cas : c'est le COMPTE CamerPay qui décide. On ne peut donc pas le
// déduire — l'admin le déclare, et l'initiation le confirme (une pay_url en
// /sandbox/simulate/ marque la transaction comme test dans son fichier d'état).
function camerpayMode() {
    $m = defined('CAMERPAY_MODE') ? strtolower(trim((string)CAMERPAY_MODE)) : 'sandbox';
    return ($m === 'live') ? 'live' : 'sandbox';
}

function camerpayBase()    { return defined('CAMERPAY_API_BASE') ? rtrim(CAMERPAY_API_BASE, '/') : 'https://camerpay.biz'; }
// 1,5 % = plan ENTREPRISE, celui de VÉRITAS (500 XAF/mois, transactions
// illimitées). Démarreur = 0.03, Pro = 0.01. Ne sert QU'À estimer le net :
// le chiffre qui fait foi reste le relevé camerpay.biz/client.
function camerpayFeeRate() { return defined('CAMERPAY_FEE_RATE') ? (float)CAMERPAY_FEE_RATE : 0.015; }

function camerpayPublicBase() {
    $b = defined('PUBLIC_BASE_URL') ? rtrim((string)PUBLIC_BASE_URL, '/') : 'https://veritas-school.com';
    return $b !== '' ? $b : 'https://veritas-school.com';
}
function camerpayFrontendBase() {
    $b = defined('PUBLIC_FRONTEND_URL') ? rtrim((string)PUBLIC_FRONTEND_URL, '/') : '';
    return $b !== '' ? $b : camerpayPublicBase();
}
function camerpayCallbackUrl() {
    return camerpayPublicBase() . '/api/payment_camerpay.php?action=notify';
}
function camerpayReturnUrl($ref) {
    // Le payeur revient sur VÉRITAS ; le hash porte la référence pour que l'app
    // rouvre l'écran de suivi et reprenne le polling à la seconde près.
    return camerpayFrontendBase() . '/#paiement?ref=' . rawurlencode($ref);
}

function _safeRefCamerpay($ref)    { return 'camerpay_'   . preg_replace('/[^a-zA-Z0-9_\-]/', '_', (string)$ref); }
function _safePayoutCamerpay($ref) { return 'camerpayout_' . preg_replace('/[^a-zA-Z0-9_\-]/', '_', (string)$ref); }
function _safeMassCamerpay($ref)   { return 'camerpaymp_'  . preg_replace('/[^a-zA-Z0-9_\-]/', '_', (string)$ref); }

// 6XXXXXXXX → 2376XXXXXXXX
function camerpayNormalizePhone($tel) {
    $n = preg_replace('/[^0-9]/', '', (string)$tel);
    if (strlen($n) === 9 && strpos($n, '237') !== 0) $n = '237' . $n;
    return $n;
}

// Opérateur d'après le préfixe (ARPT Cameroun, plan de numérotation à 9
// chiffres). On ne devine QUE ce qui est certain : un préfixe hors table
// renvoie '' et le payeur choisira lui-même sur la page CamerPay.
//   MTN    : 67x, 68x, 650-654
//   Orange : 69x, 655-659, 640
//   Camtel : 62x  → ni MTN ni Orange, donc pas de Mobile Money ici
function camerpayGuessMethod($tel) {
    $n = camerpayNormalizePhone($tel);
    if (strlen($n) !== 12) return '';
    $loc = substr($n, 3);                      // les 9 chiffres nationaux
    $p2  = substr($loc, 0, 2);
    $p3  = substr($loc, 0, 3);
    if ($p2 === '67' || $p2 === '68') return 'mtn_momo';
    if ($p2 === '69')                 return 'orange_money';
    if ($p3 >= '650' && $p3 <= '654') return 'mtn_momo';
    if ($p3 >= '655' && $p3 <= '659') return 'orange_money';
    if ($p3 === '640')                return 'orange_money';
    return '';
}

function camerpayOperatorLabel($methode) {
    switch ($methode) {
        case 'mtn_momo':     return 'MTN';
        case 'orange_money': return 'ORANGE';
        case 'stripe':       return 'CARTE';
        case 'paypal':       return 'PAYPAL';
    }
    return '';
}

// Bornes documentées par CamerPay (« Limites montant par méthode »).
// Sans méthode connue, on prend l'intersection prudente Mobile Money.
function camerpayAmountBounds($methode) {
    switch ($methode) {
        case 'stripe': return [300, 5000000];
        case 'paypal': return [600, 5000000];
    }
    return [100, 1000000];
}

// Lignes de panier reçues du navigateur : on ne recopie QUE les quatre champs
// exploités par l'octroi, typés et tronqués. Un tableau libre venu du client
// finirait tel quel dans la base partagée.
function camerpaySanitizeLignes($brut) {
    if (!is_array($brut)) return [];
    $out = [];
    foreach ($brut as $l) {
        if (!is_array($l)) continue;
        $intent = strtolower(trim((string)($l['intent'] ?? '')));
        if ($intent === '' || $intent === 'cart') continue;          // pas de panier imbriqué
        if (!preg_match('/^[a-z_]{1,30}$/', $intent)) continue;
        $out[] = [
            'intent'   => $intent,
            'targetId' => mb_substr(trim((string)($l['targetId'] ?? '')), 0, 64),
            'montant'  => max(0, (int)($l['montant'] ?? 0)),
            'label'    => mb_substr(trim((string)($l['label'] ?? '')), 0, 120),
        ];
        if (count($out) >= 50) break;
    }
    return $out;
}

// Enfants couverts par une formule Famille : des identifiants de compte, rien
// d'autre. Quatre au plus, 32 caractères, alphabet des identifiants du site.
function camerpaySanitizeBeneficiaires($brut) {
    if (!is_array($brut)) return [];
    $out = [];
    foreach ($brut as $b) {
        $b = trim((string) $b);
        if ($b === '' || !preg_match('/^[A-Za-z0-9._@-]{2,64}$/', $b)) continue;
        if (!in_array($b, $out, true)) $out[] = mb_substr($b, 0, 64);
        if (count($out) >= 4) break;
    }
    return $out;
}

/* ── VERSEMENTS DU CODE AMI ────────────────────────────────────────────────
   Le solde d'un parrain part dès qu'il atteint le seuil (2 000 F par défaut).
   Appelé juste après un octroi qui a crédité une commission, donc HORS du
   verrou de la base : un appel au fournisseur prend des secondes, et tenir la
   base fermée pendant ce temps bloquerait les paiements qui arrivent.

   Budget de deux versements par appel : une passerelle attend notre 200, et
   un lot refusé ne doit pas en retenir d'autres. Ce qui dépasse le budget part
   au crédit suivant, ou par le bouton de l'administration.

   `$seul` : forcer UN bénéficiaire depuis l'administration (le réglage
   « versement automatique » ne bloque pas un geste humain). */
function camerpayParrainageVerser($logFile, $budget = 2, $seul = '') {
    $bilan = ['soumis' => 0, 'bloques' => 0, 'echecs' => 0, 'details' => []];
    if (!function_exists('vrt_parr_a_verser') || !camerpayConfigured()) return $bilan;
    $db = vrt_load_db();
    if (!is_array($db)) return $bilan;
    $reg = vrt_parr_lire();
    $cfg = vrt_parr_cfg($db, $reg);
    if ($seul === '' && empty($cfg['versementAuto'])) return $bilan;

    $candidats = ($seul !== '') ? [$seul] : vrt_parr_a_verser($db, $reg);
    $plafond   = defined('CAMERPAY_PAYOUT_MAX') ? (int) CAMERPAY_PAYOUT_MAX : 200000;
    $stateDir  = __DIR__ . '/data/payments/';

    foreach ($candidats as $benef) {
        if ($bilan['soumis'] >= $budget) break;
        $dest = vrt_parr_destination($db, $reg, $benef);
        if (empty($dest['ok'])) {
            vrt_parr_bloquer($benef, (string) $dest['motif']);
            $bilan['bloques']++; $bilan['details'][] = ['benef' => $benef, 'motif' => $dest['motif']];
            continue;
        }
        $v = vrt_parr_reserver($benef, $dest, (int) $cfg['seuilVersement'], $plafond);
        if (!$v) continue;

        list($http, $resp) = camerpayApi('POST', '/api/payouts/batch', [
            'reference'     => $v['ref'],
            'description'   => 'Commission Code ami VÉRITAS',
            'callback_url'  => camerpayCallbackUrl(),
            'beneficiaries' => [[
                'phone' => '+' . $v['tel'], 'amount' => (int) $v['m'],
                'name' => mb_substr((string) $v['nom'], 0, 120), 'method' => $v['meth'], 'external_id' => $v['ref'],
            ]],
        ]);
        $data = json_decode((string) $resp, true) ?: [];

        if ($http >= 200 && $http < 300 && !empty($data['batch_uuid'])) {
            vrt_parr_versement_etat($v['ref'], 'soumis', '', (string) $data['batch_uuid']);
            // Même fichier d'état qu'un versement manuel : ?action=payouts et le
            // webhook des lots le suivent sans code supplémentaire.
            @file_put_contents($stateDir . _safePayoutCamerpay($v['ref']) . '.json', json_encode([
                'ref' => $v['ref'], 'camerpay_batch' => $data['batch_uuid'], 'montant' => (int) $v['m'],
                'to' => $v['tel'], 'titulaire' => $v['nom'], 'methode' => $v['meth'], 'partenaireId' => $benef,
                'note' => 'Commission Code ami', 'status' => 'pending',
                'provider_status' => strtoupper((string) ($data['status'] ?? 'PENDING_APPROVAL')),
                'estimated_fees' => intval($data['estimated_fees'] ?? 0),
                'created_at' => date('c'), 'provider' => 'camerpay_payout_cm', 'origine' => 'code_ami',
            ], JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));
            camerpayIndex($stateDir, $data['batch_uuid'], $v['ref'], 'withdraw');
            camerpayLog($logFile, date('c') . ' [CODE_AMI_VERSEMENT] ref=' . $v['ref'] . ' benef=' . $benef . ' montant=' . $v['m'] . "\n");
            $bilan['soumis']++; $bilan['details'][] = ['benef' => $benef, 'ref' => $v['ref'], 'montant' => (int) $v['m']];
        } elseif ((int) $http === 0 || (int) $http >= 500) {
            // Réponse perdue : le lot est PEUT-ÊTRE parti. On garde la réservation.
            vrt_parr_versement_etat($v['ref'], 'incertain', 'Réponse du fournisseur perdue (HTTP ' . (int) $http . ') — vérifier sur camerpay.biz avant de relancer');
            camerpayLog($logFile, date('c') . ' [CODE_AMI_VERSEMENT_INCERTAIN] ref=' . $v['ref'] . ' http=' . (int) $http . "\n");
            $bilan['echecs']++; $bilan['details'][] = ['benef' => $benef, 'ref' => $v['ref'], 'motif' => 'incertain'];
        } else {
            $motif = camerpayErrorMessage($data, $http);
            vrt_parr_versement_etat($v['ref'], 'echec', $motif);
            camerpayLog($logFile, date('c') . ' [CODE_AMI_VERSEMENT_REFUSE] ref=' . $v['ref'] . ' http=' . (int) $http . ' ' . $motif . "\n");
            $bilan['echecs']++; $bilan['details'][] = ['benef' => $benef, 'ref' => $v['ref'], 'motif' => $motif];
        }
    }
    return $bilan;
}

// Un lot de commission a changé d'état chez CamerPay : le registre suit.
// `sent` → versé ; `failed` → le montant revient au solde du parrain.
function camerpayParrainageSuivi($ref, $status, $reason) {
    if (strpos((string) $ref, 'PAR-') !== 0 || !function_exists('vrt_parr_versement_etat')) return;
    try {
        if ($status === 'sent')       vrt_parr_versement_etat($ref, 'verse');
        elseif ($status === 'failed') vrt_parr_versement_etat($ref, 'echec', (string) $reason);
    } catch (\Throwable $e) {
        error_log('[CODE_AMI_SUIVI] ' . $ref . ' ' . $e->getMessage());
    }
}

function camerpayIndex($stateDir, $key, $ourRef, $kind) {
    if (!$key) return;
    $f = $stateDir . '_camerpayidx_' . preg_replace('/[^a-zA-Z0-9_\-]/', '_', (string)$key) . '.json';
    @file_put_contents($f, json_encode(['ref' => $ourRef, 'kind' => $kind, 'at' => date('c')]));
}

function camerpayResolveRef($stateDir, array $candidats) {
    foreach ($candidats as $k) {
        if (!$k) continue;
        $f = $stateDir . '_camerpayidx_' . preg_replace('/[^a-zA-Z0-9_\-]/', '_', (string)$k) . '.json';
        if (is_file($f)) {
            $d = json_decode((string)file_get_contents($f), true);
            if (is_array($d) && !empty($d['ref'])) return $d['ref'];
        }
        if (is_file($stateDir . _safeRefCamerpay($k) . '.json'))    return $k;
        if (is_file($stateDir . _safePayoutCamerpay($k) . '.json')) return $k;
    }
    return null;
}

// 🔐 HMAC-SHA256 hex lowercase sur "uuid|invoice_id|status|amount".
// true = valide · false = invalide · null = pas de secret configuré.
// ⚠️ L'appelant REJETTE false ET null (fail-closed) : sans secret, on ne sait
//    pas d'où vient la notification, et le polling confirme de toute façon.
// Vecteur de test officiel (doc CamerPay), à garder pour vérifier une rotation :
//   secret test_secret_key_123 sur
//   5add2319-f71b-4f2d-a4f4-97fe0d11c1d4|FACT-001|completed|10000.00
//   → feab3068de64a00e07ecddc6990570a621eb3d725f9efb728b6a9ca2e455bc37
function camerpayCheckSignature($uuid, $invoiceId, $status, $amountStr, $signature) {
    if (!defined('CAMERPAY_CALLBACK_SECRET') || CAMERPAY_CALLBACK_SECRET === ''
        || strpos(CAMERPAY_CALLBACK_SECRET, 'À_REMPLIR') !== false) {
        return null;                       // secret non configuré → contrôle désactivé
    }
    $sig = strtolower(trim((string)$signature));
    if ($sig === '') return false;
    $attendu = hash_hmac('sha256', $uuid . '|' . $invoiceId . '|' . $status . '|' . $amountStr, CAMERPAY_CALLBACK_SECRET);
    return hash_equals($attendu, $sig);
}

function camerpayApi($method, $path, $body = null) {
    if (camerpayResilie()) return [0, json_encode(['error' => 'CAMERPAY_RESILIE', 'message' => 'Contrat CamerPay rompu : aucun appel.'])];
    $ch = curl_init(camerpayBase() . $path);
    $headers = ['Accept: application/json'];
    if (defined('CAMERPAY_TOKEN') && CAMERPAY_TOKEN !== '') $headers[] = 'Authorization: Bearer ' . CAMERPAY_TOKEN;
    if ($body !== null) $headers[] = 'Content-Type: application/json';
    $opts = [
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_HTTPHEADER     => $headers,
        CURLOPT_TIMEOUT        => 30,
        CURLOPT_SSL_VERIFYPEER => true,
        CURLOPT_SSL_VERIFYHOST => 2,
    ];
    if ($method === 'POST') {
        $opts[CURLOPT_POST]       = true;
        $opts[CURLOPT_POSTFIELDS] = json_encode($body ?: [], JSON_UNESCAPED_UNICODE);
    } elseif ($method !== 'GET') {
        $opts[CURLOPT_CUSTOMREQUEST] = $method;
        if ($body !== null) $opts[CURLOPT_POSTFIELDS] = json_encode($body, JSON_UNESCAPED_UNICODE);
    }
    curl_setopt_array($ch, $opts);
    $resp = curl_exec($ch);
    $http = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    $err  = curl_error($ch);
    curl_close($ch);
    if ($resp === false) { error_log('[CamerPay] curl ' . $path . ' — ' . $err); return [0, null]; }
    return [$http, $resp];
}

// Traduit les 3 familles d'erreur documentées en UNE phrase exploitable.
// Rappel de la doc : aucun champ n'est présent partout — on lit défensivement.
//   A. cadre       (401/403/404) → { message }
//   B. validation  (422)         → { success:false, errors:{champ:[…]} }
//   C. règle métier(402/403)     → { success:false, error:<code>, message }
function camerpayErrorMessage($data, $http) {
    if (!is_array($data)) $data = [];

    // Famille C — codes métier connus, traduits pour l'administrateur.
    $code = (string)($data['error'] ?? '');
    $table = [
        'kyc_tier_volume_exceeded' => 'Plafond KYC atteint : votre niveau CamerPay limite le volume encaissé ce mois-ci. Ajoutez le document demandé sur camerpay.biz/client/kyc pour monter de niveau.',
        'transaction_limit_reached'=> 'Quota de transactions CamerPay atteint. Ce plafond (100/mois) ne concerne que le plan Démarreur : le plan Entreprise (500 XAF/mois) est illimité — camerpay.biz/client/subscription.',
        'subscription_expired'     => 'Abonnement CamerPay expiré — renouvelez-le sur camerpay.biz/client/subscription.',
        'no_merchant'              => 'Aucun compte marchand CamerPay associé à ce jeton.',
    ];
    if ($code !== '' && isset($table[$code])) {
        $sup = '';
        if (isset($data['remaining']))  $sup .= ' Reste disponible : ' . (int)$data['remaining'] . ' FCFA.';
        if (isset($data['next_action'])) $sup .= ' ' . $data['next_action'];
        return $table[$code] . $sup;
    }

    // Famille B — validation : on nomme le premier champ fautif.
    if (isset($data['errors']) && is_array($data['errors'])) {
        foreach ($data['errors'] as $champ => $msgs) {
            $m = is_array($msgs) ? (string)reset($msgs) : (string)$msgs;
            return 'Champ « ' . $champ . ' » refusé par CamerPay : ' . $m;
        }
    }

    // Échec métier remonté en synchrone (juillet 2026).
    $fc = (string)($data['failure_code'] ?? '');
    if ($fc === 'PROVIDER_BUSINESS_ERROR') {
        return (string)($data['message'] ?? 'Paiement refusé par l\'opérateur.') . ' Réessayez avec un autre numéro ou un autre moyen de paiement.';
    }

    // Famille A + tout le reste.
    $msg = (string)($data['message'] ?? '');
    switch ((int)$http) {
        case 401: return 'Jeton CamerPay invalide ou révoqué — régénérez-le sur camerpay.biz/client/api.';
        case 403: return $msg !== '' ? $msg : 'CamerPay refuse l\'opération : KYC non validé pour le mode réel, ou compte marchand désactivé.';
        case 404: return 'Transaction introuvable chez CamerPay.';
        case 429: return 'Trop de requêtes vers CamerPay (limite de votre plan). Réessayez dans une minute.';
        case 503: return 'Opérateur momentanément indisponible chez CamerPay. Réessayez dans quelques minutes.';
        case 0:   return 'CamerPay injoignable depuis le serveur (réseau ou TLS).';
    }
    return 'CamerPay erreur HTTP ' . $http . ($msg !== '' ? ' — ' . $msg : '');
}

// Le corps brut du fournisseur peut contenir des détails d'infrastructure :
// on ne renvoie au client QUE des champs connus et inoffensifs.
function camerpaySafeDetail($data, $resp) {
    if (!is_array($data)) return null;
    $out = [];
    foreach (['error', 'failure_code', 'errors', 'monthly_limit', 'remaining', 'kyc_tier', 'upgrade_url', 'renew_url'] as $k) {
        if (isset($data[$k])) $out[$k] = $data[$k];
    }
    return $out ?: null;
}

// 402/403/422 sont des refus légitimes à répercuter tels quels au client ;
// tout le reste devient un 502 (« le fournisseur a un souci »), jamais un 500
// qui laisserait croire à un bug de VÉRITAS.
function camerpayClientFacingCode($http) {
    $h = (int)$http;
    if (in_array($h, [400, 402, 403, 404, 409, 422, 429], true)) return $h;
    return 502;
}

function camerpayRequireConfig() {
    if (camerpayConfigured()) return;
    @file_put_contents(__DIR__ . '/data/_security_log.txt',
        date('c') . " [CAMERPAY_NOT_CONFIGURED] jeton absent — renseignez CAMERPAY_TOKEN dans api/payment_config.php\n", FILE_APPEND);
    jsonRespCy([
        'error'    => 'Le paiement automatique n\'est pas encore activé. Utilisez MTN MoMo, Orange Money ou le virement ci-dessous : votre accès sera validé par le centre.',
        'code'     => 'CAMERPAY_NOT_CONFIGURED',
        'fallback' => 'manual',
    ], 503);
}

// Relit le statut chez CamerPay — SEULE source d'autorité.
function camerpayVerifyTransaction($state) {
    if (empty($state['camerpay_uuid'])) return null;
    if (!camerpayConfigured()) return null;
    list($http, $resp) = camerpayApi('GET', '/api/payment/' . rawurlencode($state['camerpay_uuid']) . '/status');
    if ($http !== 200) return null;
    $d = json_decode((string)$resp, true);
    if (!is_array($d)) return null;
    // Le corps enveloppe la transaction : { success, transaction: {...} }
    $t = (isset($d['transaction']) && is_array($d['transaction'])) ? $d['transaction'] : $d;
    return $t ?: null;
}

function camerpayApplyVerified($state, $verified, $logFile, $ref) {
    $st = strtolower((string)($verified['status'] ?? ''));
    $state['provider_status'] = strtoupper($st);
    if (!empty($verified['payment_method'])) {
        $state['payment_method'] = (string)$verified['payment_method'];
        $state['operator']       = camerpayOperatorLabel((string)$verified['payment_method']);
    }
    if (isset($verified['is_sandbox'])) $state['sandbox'] = (bool)$verified['is_sandbox'];

    if ($st === 'completed') {
        // 🔐 Un encaissement partiel n'ouvre JAMAIS l'accès.
        // Le champ de montant n'a pas le même nom partout dans la doc CamerPay
        // (`amount` sur /status, `amount_paid` dans certains exemples) : on lit
        // les trois, sinon un simple renommage côté fournisseur ferait retomber
        // le contrôle à zéro — et « 0 » désactivait silencieusement la garde de
        // sous-paiement ci-dessous.
        $brut = null;
        foreach (['amount', 'amount_paid', 'paid_amount'] as $k) {
            if (isset($verified[$k]) && $verified[$k] !== '' && is_numeric($verified[$k])) { $brut = $verified[$k]; break; }
        }
        $paye    = ($brut === null) ? 0 : (int)round((float)$brut);
        $attendu = (int)($state['montant'] ?? 0);
        // Traçabilité : dire quand le montant n'a PAS pu être confronté, plutôt
        // que de laisser croire à une vérification qui n'a pas eu lieu.
        $state['montant_verifie'] = ($brut !== null);
        if ($brut === null) {
            camerpayLog($logFile, date('c') . " [AMOUNT_ABSENT] ref=$ref — CamerPay n'a pas renvoyé de montant, attendu=$attendu retenu\n");
        }
        $devise = strtoupper((string)($verified['currency'] ?? 'XAF'));
        if ($devise !== '' && $devise !== 'XAF') {
            camerpayLog($logFile, date('c') . " [CURRENCY] ref=$ref devise=$devise (attendu XAF)\n");
        }
        if ($paye > 0 && $paye < $attendu) {
            $state['status'] = 'underpaid';
            $state['reason'] = 'Montant encaissé (' . $paye . ') inférieur au montant attendu (' . $attendu . ')';
            camerpayLog($logFile, date('c') . " [AMOUNT_MISMATCH] ref=$ref paye=$paye attendu=$attendu\n");
            return $state;
        }
        $state['status']       = 'paid';
        $state['paid_at']      = (string)($verified['paid_at'] ?? date('c'));
        $state['montant_paye'] = $paye ?: $attendu;
        // CamerPay ne renvoie pas la commission par transaction : estimation au
        // taux du plan. Le chiffre exact reste celui du relevé camerpay.biz.
        $state['frais']        = (int)round($state['montant_paye'] * camerpayFeeRate());
        $state['net_encaisse'] = max(0, $state['montant_paye'] - $state['frais']);
    } elseif ($st === 'refunded') {
        $state['status']      = 'refunded';
        $state['refunded_at'] = date('c');
    } elseif (in_array($st, ['failed', 'cancelled', 'canceled', 'expired'], true)) {
        $state['status']    = 'failed';
        $state['failed_at'] = date('c');
        if (empty($state['failure_reason'])) $state['reason'] = 'Paiement non abouti';
    }
    return $state;
}

// Octroi de l'accès — IDEMPOTENT : le drapeau `granted` empêche qu'un webhook
// rejoué (CamerPay permet le rejeu manuel) n'active deux fois le même achat.
function camerpayGrant(&$state, $logFile, $ref) {
    if (($state['status'] ?? '') !== 'paid') return;
    if (!empty($state['granted']))          return;

    if (($state['intent'] ?? '') === 'cagnotte') {
        try {
            $r = cagRecordContribution($state);
            // ⚠️ Le drapeau ne se pose QUE si la contribution est réellement
            // inscrite. Le poser inconditionnellement (ce qu'on faisait) rendait
            // une cagnotte introuvable définitive : l'argent était encaissé, la
            // contribution n'apparaissait nulle part, et la réconciliation ne
            // repassait jamais puisque `granted` la déclarait traitée.
            if (!empty($r['ok'])) { $state['granted'] = true; $state['granted_at'] = date('c'); }
            camerpayLog($logFile, date('c') . ' [CAGNOTTE] ref=' . $ref . ' ' . json_encode($r) . "\n");
        } catch (\Throwable $e) {
            // Pas de drapeau en cas d'échec : la prochaine passe de
            // réconciliation (?action=list) réessaiera.
            camerpayLog($logFile, date('c') . ' [CAGNOTTE_ERR] ref=' . $ref . ' ' . $e->getMessage() . "\n");
        }
        return;
    }

    try {
        $g = vrt_grant_entitlement_to_file($state);

        /* ⚠️ `granted` SE POSE SUR L'OCTROI, PAS SUR LA LECTURE DE LA BASE.
           Il se posait sur `$g['ok']`, qui ne dit que « la base était lisible ».
           Un octroi qui n'ouvrait rien — « accountId manquant », « compte
           introuvable : va_… » — était donc marqué accordé, et la première
           ligne de cette fonction (`if (!empty($state['granted'])) return;`)
           le sortait définitivement de la réconciliation. Le client avait payé,
           son accès restait fermé, et plus rien ne repassait derrière.
           Mesuré le 12/09/2026 sur les trois cas : chacun ressortait
           `granted:true, changed:false`.

           Désormais : un octroi BLOQUÉ ne pose pas le drapeau — la
           réconciliation (?action=list) le reprend au passage suivant, ce qui
           rattrape tout seul le cas fréquent d'un compte créé juste après le
           paiement. */
        /* ⚠️ UN OCTROI QUI RÉUSSIT PEUT QUAND MÊME DEMANDER UNE DÉCISION.
           Ce relais manquait, et le banc l'a trouvé par mutation le
           12/09/2026 : un abonnement réglé SANS identifiant de compte — achat
           anonyme, saisie manuelle de l'administration — rend `changed:true`
           ET `a_regler:true`. La ligne est écrite, l'argent est tracé, mais
           personne n'en est titulaire : l'accès reste à attribuer à la main.
           Ne relayer le drapeau que dans la branche « bloqué » perdait ce
           cas-là — le seul où l'octroi réussit sans ouvrir d'accès. */
        if (!empty($g['a_regler'])) $state['a_regler'] = true;

        if (empty($g['bloque'])) {
            $state['granted'] = true; $state['granted_at'] = date('c');
        } else {
            $state['a_regler'] = true;             // demande une décision humaine
            $n = (int) ($state['grant_essais'] ?? 0) + 1;
            $state['grant_essais'] = $n;
            /* Au-delà de cinq passages on cesse de rejouer : chaque tentative
               réécrit une sauvegarde complète de la base, et une transaction
               irrécupérable ferait tourner cette meule à chaque ouverture du
               tableau de bord. On pose le drapeau pour arrêter la boucle, mais
               `a_regler` et `grant_msg` RESTENT : elle sort du circuit
               automatique, pas de la vue de l'administration. */
            if ($n >= 5) { $state['granted'] = true; $state['granted_at'] = date('c'); }
        }
        // Le VERDICT de l'octroi vit désormais dans le fichier d'état : « accès
        // ouvert », « compte introuvable », « sous-paiement refusé »… Sans lui,
        // ?action=list affichait « payé » pour une transaction qui n'avait
        // strictement rien débloqué — le symptôme est justement l'absence de
        // symptôme, et c'est ici qu'on lui donne une voix.
        $state['grant_msg'] = mb_substr((string) ($g['msg'] ?? ''), 0, 200);
        if (!empty($g['underpaid'])) {
            $state['underpaid']  = true;
            $state['a_regler']   = true;   // demande une décision humaine
        }
        camerpayLog($logFile, date('c') . ' [GRANT] ref=' . $ref . ' ' . json_encode($g) . "\n");

        // Code ami : commission créditée par l'octroi. Si le solde du parrain
        // vient d'atteindre le seuil, on verse — après le verrou de la base.
        if (!empty($g['parrainage']['commission'])) {
            $state['commission_code_ami'] = (int) $g['parrainage']['commission'];
        }
        if (!empty($g['parrainage']['aVerser'])) {
            try {
                $vb = camerpayParrainageVerser($logFile, 2);
                if ($vb['soumis'] || $vb['echecs'] || $vb['bloques']) {
                    camerpayLog($logFile, date('c') . ' [CODE_AMI_AUTO] ref=' . $ref . ' ' . json_encode($vb) . "\n");
                }
            } catch (\Throwable $e) {
                camerpayLog($logFile, date('c') . ' [CODE_AMI_AUTO_ERR] ref=' . $ref . ' ' . $e->getMessage() . "\n");
            }
        }
    } catch (\Throwable $e) {
        camerpayLog($logFile, date('c') . ' [GRANT_ERR] ref=' . $ref . ' ' . $e->getMessage() . "\n");
    }
}

// Webhook des versements groupés : met à jour le lot ET la ligne concernée.
function camerpayHandlePayoutWebhook($stateDir, $logFile, array $body) {
    $batch  = (string)($body['batch_uuid']  ?? '');
    $extId  = (string)($body['external_id'] ?? '');
    $status = strtolower((string)($body['status'] ?? ''));
    $ourRef = (string)camerpayResolveRef($stateDir, [$batch]);

    camerpayLog($logFile, date('c') . " [PAYOUT_HOOK] batch=$batch ext=$extId status=$status\n");

    // Versement unitaire (lot d'une ligne) : la référence externe EST la nôtre.
    $unit = $stateDir . _safePayoutCamerpay($extId !== '' ? $extId : $ourRef) . '.json';
    if (is_file($unit)) {
        $out = json_decode((string)file_get_contents($unit), true) ?: [];
        $out['provider_status'] = strtoupper($status);
        $out['notified_at']     = date('c');
        if ($status === 'completed')                              { $out['status'] = 'sent';   $out['sent_at']   = date('c'); }
        elseif (in_array($status, ['failed', 'cancelled'], true)) { $out['status'] = 'failed'; $out['failed_at'] = date('c');
                                                                    $out['reason'] = (string)($body['failure_reason'] ?? 'Refusé par l\'opérateur'); }
        file_put_contents($unit, json_encode($out, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));
        camerpayParrainageSuivi((string) ($out['ref'] ?? ''), (string) ($out['status'] ?? ''), (string) ($out['reason'] ?? ''));
        return;
    }

    // Sinon c'est l'événement global d'un lot : on note l'avancement.
    if ($ourRef === '') return;
    $mpFile = $stateDir . _safeMassCamerpay($ourRef) . '.json';
    if (!is_file($mpFile)) return;
    $mp = json_decode((string)file_get_contents($mpFile), true) ?: [];
    $mp['provider_status'] = strtoupper((string)($body['status'] ?? ''));
    $mp['notified_at']     = date('c');
    if (in_array($status, ['completed', 'complete'], true)) $mp['status'] = 'complete';
    file_put_contents($mpFile, json_encode($mp, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));
}

function camerpayCollectStates($stateDir, $provider) {
    $files = glob($stateDir . '*.json') ?: [];
    $out = [];
    foreach ($files as $f) {
        if (basename($f)[0] === '_') continue;
        $p = json_decode((string)file_get_contents($f), true);
        if (is_array($p) && ($p['provider'] ?? '') === $provider) $out[] = $p;
    }
    usort($out, function ($a, $b) { return strcmp($b['created_at'] ?? '', $a['created_at'] ?? ''); });
    return $out;
}
