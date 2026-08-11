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

// ── CORS (allowlist stricte, identique aux autres endpoints de paiement) ──
$__cy_allowed = [
    'https://veritas-school.com', 'https://www.veritas-school.com',
    'http://localhost:8000', 'https://localhost', 'capacitor://localhost',
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
    if ($pub === '' || $token === '' || !hash_equals($pub, $token)) {
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
if ($action === 'init' && $method === 'POST') {
    $authMode = camerpayInitGuard($stateDir);   // 'admin' (illimité) OU 'public' (bridé)
    camerpayRequireConfig();

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

    // Le téléphone est FACULTATIF chez CamerPay (le payeur peut régler par
    // carte). S'il est fourni, on le normalise pour préremplir la page.
    $payerNumber = $clientTel !== '' ? camerpayNormalizePhone($clientTel) : '';
    if ($payerNumber !== '' && strlen($payerNumber) !== 12) {
        jsonRespCy(['error' => 'Numéro invalide — format attendu 6XXXXXXXX ou 2376XXXXXXXX'], 400);
    }

    // Méthode : soit imposée par le client, soit déduite du préfixe quand il est
    // sans ambiguïté, soit omise → le payeur choisit sur la page CamerPay.
    if ($methode !== '' && !in_array($methode, ['orange_money', 'mtn_momo', 'stripe', 'paypal'], true)) {
        jsonRespCy(['error' => 'Méthode inconnue (orange_money, mtn_momo, stripe, paypal)'], 400);
    }
    if ($methode === '' && $payerNumber !== '') $methode = camerpayGuessMethod($payerNumber);

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
        // Panier : le détail article par article. Sans lui, un paiement « cart »
        // confirmé par webhook ne pouvait débloquer AUCUN des articles côté
        // serveur — seul le navigateur du payeur savait ce qu'il avait acheté.
        // Borné à 50 lignes et aux 4 champs utiles : c'est une entrée client.
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
// 3. STATUS — polling frontend
// ════════════════════════════════════════════════════════════
if ($action === 'status' && $method === 'GET') {
    $ref = trim($_GET['ref'] ?? '');
    if (!$ref) jsonRespCy(['error' => 'ref requise'], 400);

    $stateFile = $stateDir . _safeRefCamerpay($ref) . '.json';
    if (!file_exists($stateFile)) jsonRespCy(['status' => 'unknown', 'ref' => $ref]);

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
    if (($state['status'] ?? '') === 'pending' && $age > 5 && $depuisControle >= 4) {
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
        'pay_url'         => $state['pay_url'] ?? null,
        // failure_reason vient du provider (Orange/MTN/Stripe) : « solde
        // insuffisant », « PIN incorrect »… C'est ce qu'on montre au payeur.
        'reason'          => $state['failure_reason'] ?? ($state['reason'] ?? null),
        'failure_code'    => $state['failure_code'] ?? null,
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
    $payments = camerpayCollectStates($stateDir, 'camerpay_cm');
    $reconciles = 0;

    foreach ($payments as $i => $p) {
        if (($p['status'] ?? '') !== 'pending') continue;
        $age = time() - strtotime($p['created_at'] ?? 'now');
        if ($age > 86400 || $age < 60) continue;      // trop vieux ou trop frais
        $verified = camerpayVerifyTransaction($p);
        if ($verified === null) continue;
        $p = camerpayApplyVerified($p, $verified, $logFile, $p['ref'] ?? '');
        camerpayGrant($p, $logFile, $p['ref'] ?? '');   // pose `granted` — écrire APRÈS
        file_put_contents($stateDir . _safeRefCamerpay($p['ref'] ?? '') . '.json',
            json_encode($p, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));
        $payments[$i] = $p;
        $reconciles++;
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
        'totaux'     => [
            'brut_paye'    => $brut,
            'frais'        => $frais,          // estimation : CamerPay ne renvoie pas la commission par transaction
            'net_encaisse' => $net,
            'montant_test' => $test,           // sandbox, hors comptabilité
        ],
        'note'     => 'Les frais sont ESTIMÉS au taux de votre plan CamerPay (' . (camerpayFeeRate() * 100) . ' %). Le montant exact figure sur votre relevé camerpay.biz/client.',
        'payments' => $payments
    ]);
}

// ════════════════════════════════════════════════════════════
// 5. HISTORY — relevé reconstitué depuis nos propres états
// ════════════════════════════════════════════════════════════
// CamerPay n'expose pas d'endpoint « relevé » (OpenAPI vérifié : 5 opérations).
// On agrège donc ce que NOUS savons, et on dit clairement d'où viennent les
// chiffres — plutôt que de laisser croire à un relevé bancaire faisant foi.
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

    // ⚠️ Le remboursement N'ANNULE PAS l'accès déjà ouvert : révoquer un
    // entitlement au milieu d'un trimestre est une décision pédagogique, pas
    // technique. L'admin retire l'accès à la main s'il le veut.
    jsonRespCy(['success' => true, 'ref' => $ref,
                'message' => 'Remboursement demandé. Orange/MTN ne sont pas réversibles par API : vérifiez auprès du support CamerPay. L\'accès de l\'élève reste ouvert — retirez-le manuellement si nécessaire.']);
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

function camerpayConfigured() {
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
        if (!empty($g['ok'])) { $state['granted'] = true; $state['granted_at'] = date('c'); }
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
