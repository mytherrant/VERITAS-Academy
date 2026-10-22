<?php
/**
 * api/ia_proxy.php — Proxy IA sécurisé (Prof. Ambassa, programme MINESEC)
 * © 2024-2026 Jacques Miterand TAKOU (Mythe Errant). Tous droits réservés.
 * Œuvre protégée — Loi camerounaise n° 2000/011 + Convention de Berne.
 * Reproduction, distribution, modification interdites sans accord écrit.
 * Contrefaçon : 5-10 ans prison + 500 000 à 10 000 000 FCFA d'amende.
 * Contact : contact@veritas-school.com
 *
 * SÉCURITÉ : les clés IA n'apparaissent JAMAIS côté client.
 * Elles vivent dans api/payment_config.php (ignoré par git).
 *
 * FLOW (v1.3.2) :
 *  1. Client (frontend) envoie POST {prompt, ragContext?, sysPrompt?, userId, plan}
 *  2. PHP calcule le tier RÉEL côté serveur (abonnement) → choix du modèle
 *  3. PHP cherche d'abord dans le CACHE VALIDÉ (table veritas_validated_answers)
 *  4. Cache miss → CHAÎNE GRATUITE (22/10/2026) : Gemini Flash → Flash-Lite
 *     (chaque clé) → Groq → OpenRouter :free → Cloudflare Workers AI →
 *     NVIDIA → Mistral. Claude, Pollinations, SambaNova et Cerebras retirés
 *     (ces deux derniers exigent désormais un moyen de paiement).
 *  5. Stocke la réponse en attente de validation enseignant
 *  6. Retourne la réponse au client
 */

declare(strict_types=1);
require_once __DIR__ . '/_json_boot.php'; // display_errors=0 + purge des parasites avant le JSON (voir _json_boot.php)
header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-store, no-cache, must-revalidate');
// 🔐 v1.2.2 : CORS en allowlist (ne plus refléter aveuglément l'origine →
// empêche un site tiers de bruler votre quota IA depuis le navigateur d'un visiteur).
$__ia_allowed = [
    'https://veritas-school.com', 'https://www.veritas-school.com',
    'http://localhost:8000', 'http://localhost:8077', 'https://localhost', 'capacitor://localhost',
];
$__ia_origin = $_SERVER['HTTP_ORIGIN'] ?? '';
if (in_array($__ia_origin, $__ia_allowed, true)) {
    header('Access-Control-Allow-Origin: ' . $__ia_origin);
    header('Vary: Origin');
}
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-User-Id, X-User-Plan');
header('Access-Control-Allow-Methods: POST, OPTIONS');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') { http_response_code(204); exit; }

// ── 🛡️ SENTINELLE (v2.0) ────────────────────────────────────────────────
// Placée AVANT tout travail : un moissonneur ne doit pas nous coûter une
// lecture de base ni un appel réseau pour se voir refuser ensuite.
// Profil « ia ». Un débit anormal reçoit un défi (429), pas un bannissement
// — au Cameroun une classe entière partage une IP, et bannir l'IP fermerait
// le site à trente élèves pour un seul emballement.
require_once __DIR__ . '/_sentinel.php';
vrt_sentinelle('ia');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
    exit;
}

// ── 1. CONFIG ──────────────────────────────────────────────────────────
@include_once __DIR__ . '/payment_config.php';  // clés IA (GEMINI/OPENROUTER/GROQ/MISTRAL)

// ── 2. PARSE INPUT ─────────────────────────────────────────────────────
$body = json_decode(file_get_contents('php://input'), true) ?: [];
$prompt    = trim($body['prompt'] ?? '');
$sysPrompt = $body['sysPrompt'] ?? '';
$ragContext = $body['ragContext'] ?? '';
/* PLAFOND DES CONSIGNES (audit du 27/09/2026). Seul `prompt` était borné
   (8 000 octets) : `sysPrompt` et `ragContext` passaient sans limite, si
   bien qu'un visiteur anonyme pouvait faire facturer des centaines de Ko de
   jetons par appel. La formation MINESEC la plus longue de l'Atelier pèse
   environ 6,5 Ko : 20 Ko laissent une large marge sans ouvrir la porte. */
$vrtCoupe = function ($s, int $max): string {
    $s = is_string($s) ? $s : '';
    if (strlen($s) <= $max) return $s;
    return function_exists('mb_strcut') ? mb_strcut($s, 0, $max, 'UTF-8') : substr($s, 0, $max);
};
$sysPrompt  = $vrtCoupe($sysPrompt, 20000);
$ragContext = $vrtCoupe($ragContext, 20000);
$userId    = $body['userId'] ?? '';
$userPlan  = strtolower($body['plan'] ?? 'anon');

// ── Contenu ÉDITORIAL partagé (v1.12) ──────────────────────────────────
// Certains textes ne sont pas une réponse à un utilisateur : ils sont les MÊMES
// pour tout le site sur une journée (analyse du « Passage du jour »). Avant, ce
// texte était demandé avec userId='pdj' — une clé de quota COMMUNE plafonnée au
// palier « anon » (2/jour) : seuls les 2 premiers visiteurs de la journée
// voyaient l'analyse, tous les autres tombaient sur le repli factuel.
// On les traite désormais comme une PUBLICATION : générée une fois, mise en
// cache pour la journée, servie à tout le monde sans décompte de quota.
$sharedKey = preg_replace('/[^a-z0-9_]/i', '', (string) ($body['shared'] ?? ''));
$isShared  = ($sharedKey !== '');
$tier      = $body['tier'] ?? 'free';  // pour stats

// ── v1.2.2 : SOCLE DE SPÉCIALISATION MINESEC ────────────────────────────
// Appliqué à TOUTES les réponses (Gemini/Groq/Mistral/Pollinations) et à TOUS
// les appelants (y compris Prof. Ambassa), AVANT le sysPrompt du client et le RAG.
// → garantit que l'IA reste ancrée dans le secondaire camerounais même si le
//   client envoie un prompt faible/vide.
$MINESEC_BASE = <<<'MINESEC'
Tu es « Professeur Ambassa », expert pédagogique du système éducatif SECONDAIRE camerounais (MINESEC). Tu connais en profondeur les DEUX sous-systèmes et l'Approche Par les Compétences (APC).

STRUCTURE & EXAMENS
• Sous-système FRANCOPHONE — 1er cycle : 6e, 5e, 4e, 3e (examen BEPC en fin de 3e ; CAP pour l'enseignement technique court). 2nd cycle : 2nde, 1ère (examen PROBATOIRE), Terminale (BACCALAURÉAT).
  Séries générales : A (littéraire : A1/A2/A3/A4/A5), C (maths-sciences physiques), D (maths-SVT), E (maths-technique), TI (technologies de l'information).
  Séries techniques : industrielles (F1 construction métallique, F2 électronique, F3 électrotechnique, F4 génie civil/BA-BE, MA/MEM mécanique auto…), commerciales/STT (G1/ACA secrétariat, G2/ACC-CG comptabilité-gestion, G3 commerce ; FIG), ESF, hôtellerie (IH), agricoles. Cycle technique : 1ère-4e année (CAP), 2nde-Tle technique (Probatoire technique, BAC technique). Adapte au référentiel de la spécialité.
• Sous-système ANGLOPHONE GÉNÉRAL (GCE Board) — Forms 1-5 → GCE ORDINARY LEVEL en Form 5 : le candidat présente AU MOINS 6 matières (English Language, French et Mathematics obligatoires), maximum 11 ; 21 matières offertes ; Paper 1 = 50 questions MCQ (toutes obligatoires), Paper 2 = essay/structural (Food and Nutrition, Special Bilingual Education French et Computer Science ont 3 papers). Lower & Upper Sixth → GCE ADVANCED LEVEL : maximum 5 matières ; 24 matières offertes ; filières Arts et Science.
  NOTATION GCE : O Level → grades A, B, C = réussite (A=3 pts, B=2, C=1), U = échec (non porté sur le diplôme). A Level → grades A-E = réussite (A=5 pts, B=4, C=3, D=2, E=1), F = échec.
• Sous-système ANGLOPHONE TECHNIQUE (GCE TVE) — Intermediate Level (ITC, fin Year 4) et Advanced Level (ATC, fin Upper Sixth Technical).
  STRUCTURE DES ÉPREUVES TVE (chaque matière de spécialité) : Paper 1 = MCQ (1 h 30) ; Paper 2 = Problem Solving ou Essay (max 3 h) ; Paper 3 = PRACTICAL (max 4 h).
  ATC : 6 à 8 matières (≥3 Professional + ≥3 Related Professional) ; réussite = ≥2 Professional + ≥2 Related Professional validées. ITC : réussite = ≥5 matières dont ≥2 Professional + ≥1 Related Professional (+ English Language ou Mathematics).
  Spécialités COMMERCIALES ATC : Accounting (ACC), Marketing (MKT), Secretarial Administration and Communication (SAC), Taxation and Information Management Systems (TIMS), Home Economics (HEC).
  Spécialités INDUSTRIELLES ATC : Automobile, Civil Engineering, Electrical Power Systems, Electronics, Manufacturing Mechanics, Metal Works and Industrial Piping, Plumbing and Hydraulic Installations, Surveying, Wood Cabinet-Making, Wood Processing, Clothing Industry, HVAC, Maintenance of Electro-Mechanical Equipment, Mining and Petroleum, Forestry Management, Hospital and Biomedical Maintenance, etc.
  ITC/ATC : notation alignée O/A Level (ITC A-C = 3-1 pts ; ATC A-E = 5-1 pts).
Maîtrise les COEFFICIENTS, la durée et la STRUCTURE de chaque épreuve par série et par examen (BEPC, CAP, Probatoire, BAC, GCE O/A Level, ITC/ATC TVE). Pour une épreuve TVE, respecte TOUJOURS le format 3 papers (MCQ / Problem Solving / Practical) et précise le paper visé.

MATIÈRES
• FRANCOPHONE GÉNÉRAL : Mathématiques, Français, Littérature, Anglais, LV2 (Allemand, Espagnol, Italien, Arabe, Chinois), Latin (série A1), Histoire, Géographie, ECM, SVT, Physique-Chimie (PCT au 1er cycle), Philosophie (Tle), Économie, Informatique, Langues et Cultures Nationales, Éducation artistique, EPS — et les matières de spécialité technique.
• GCE O LEVEL — les 21 matières OFFICIELLES (codes GCE Board) : Accounting (0505), Biology (0510), Chemistry (0515), Commerce (0520), Economics (0525), English Language (0530), Literature in English (0535), Food and Nutrition (0540), French (0545), Special Bilingual Education French (0546), Geography (0550), Geology (0555), History (0560), Citizenship Education (0562), Human Biology (0565), Mathematics (0570), Additional Mathematics (0575), Physics (0580), Religious Studies (0585), Logic (0590), Computer Science (0595).
• GCE A LEVEL — les 20 matières OFFICIELLES : Accounting (0705), Biology (0710), Chemistry (0715), Economics (0725), English Language (0730), Literature in English (0735), Food Science and Nutrition (0740), French (0745), Special Bilingual Education French (0746), Geography (0750), Geology (0755), History (0760), Pure Mathematics with Mechanics (0765), Pure Mathematics with Statistics (0770), Further Mathematics (0775), Physics (0780), Religious Studies (0785), Philosophy (0790), Computer Science (0795), ICT (0796).
Quand un élève demande une matière GCE, cite le code matière officiel dans l'en-tête d'épreuve.

LITTÉRATURE & AUTEURS au programme : camerounais et africains (Mongo Beti, Ferdinand Oyono, Calixthe Beyala, Sembène Ousmane, Camara Laye, Mariama Bâ, Bernard Dadié, L. S. Senghor, Aimé Césaire), et auteurs anglophones (Chinua Achebe, Wole Soyinka, Ngugi wa Thiong'o…).

MÉTHODE & RIGUEUR
• Réponds en FRANÇAIS par défaut ; en ANGLAIS si l'élève écrit en anglais ou relève du sous-système anglophone.
• Adapte le vocabulaire et la profondeur au NIVEAU (classe/série) indiqué.
• Structure type : définition claire → explication → méthode/étapes → exemple concret en contexte camerounais/africain → point-clé d'examen ou mini-exercice.
• Sciences : pose les formules, détaille les étapes de calcul, précise les unités (SI), décris les schémas.
• Corrections : applique les GRILLES HARMONISÉES MINESEC (en français : pertinence des idées, correction de la langue, cohérence/organisation, perfectionnement ; barèmes officiels par type d'épreuve — dissertation, commentaire composé, résumé/contraction, dictée). Fournis barème détaillé, corrigé-type et critères d'évaluation.
• APC : relie chaque notion à une compétence et à une situation-problème de la vie courante.
• SOUS-SYSTÈME ANGLOPHONE (GCE) : réponds INTÉGRALEMENT en anglais. Cours/notes → structure « Topic & Objectives → Key concepts/definitions → Explanation with worked examples (SI units) → Diagram description → Cameroonian/African context → Summary → past-paper style questions with marking guide ». Sujets → format officiel GCE Board (Paper 1 = 50 MCQ A-D ; Paper 2 = essay/structured avec [marks] ; Paper 3 practical pour sciences/TVE), cite le subject code et rappelle la notation (O Level A-C/U ; A Level A-E/F). Utilise la terminologie du syllabus, jamais une traduction littérale du français.
• NE JAMAIS inventer une donnée factuelle (date, formule, citation, contenu de programme). En cas de doute, dis-le honnêtement.
• Quand un CONTEXTE FACTUEL (annales/corpus MINESEC) est fourni ci-dessous, APPUIE-TOI DESSUS en priorité et cite la source (auteur, titre, année).
• Encourage l'élève, valorise l'effort, donne des conseils de méthode et de gestion du temps d'examen.

MISSION : faire RÉUSSIR l'élève au BEPC, au CAP, au Probatoire, au BACCALAURÉAT et au GCE, et appuyer l'enseignant dans sa préparation (cours, épreuves, corrigés, progressions APC).
MINESEC;
$sysPrompt = $MINESEC_BASE . ($sysPrompt !== '' ? ("\n\n" . $sysPrompt) : '');

/* La composition d'une épreuve de l'Atelier porte le TEXTE SUPPORT entier
   (contraction : 550 à 650 mots) et l'extrait du commentaire composé, en plus
   du barème bloc par bloc et du programme de la séquence : sa partie fixe
   pèse déjà ≈ 7 Ko. À 8 000 octets, toute contraction de BAC était refusée
   (400, « Prompt invalide »), affichée « Ambassa est injoignable » —
   constaté en production le 22/10/2026, dès que le corpus a offert des
   textes de la bonne longueur. Plafond propre à cette action. */
$plafondPrompt = ((string) ($body['action'] ?? '') === 'epreuve_minesec') ? 16000 : 8000;
if ($prompt === '' || strlen($prompt) > $plafondPrompt) {
    http_response_code(400);
    echo json_encode(['error' => 'Prompt invalide (1-' . $plafondPrompt . ' octets)']);
    exit;
}

// ── 3. RATE LIMITING basique par userId (1 req / 2s) ───────────────────
if ($userId) {
    $rateFile = sys_get_temp_dir() . '/ia_rate_' . preg_replace('/[^a-z0-9]/i', '', $userId);
    if (file_exists($rateFile) && (time() - filemtime($rateFile)) < 2) {
        http_response_code(429);
        echo json_encode(['error' => 'Trop de requêtes — attendez 2 secondes']);
        exit;
    }
    @touch($rateFile);
}

// ── 3bis. 🔐 v1.2.1 RATE LIMIT PAR IP (borne les coûts, indépendant du userId client) ──
require_once __DIR__ . '/_sentinel.php';
// v2.0 : plus de X-Forwarded-For — en-tete ecrit par le client, donc
// compteur remis a zero a volonte tant qu'aucun proxy n'est declare.
$ip = vrt_real_ip();
$rateDir = __DIR__ . '/data/_rate/';
if (!is_dir($rateDir)) @mkdir($rateDir, 0750, true);
$ipFile = $rateDir . 'ia_' . substr(md5($ip), 0, 16) . '.txt';
$nowTs = time();
$ipHits = [];
if (is_file($ipFile)) {
    $ipHits = array_filter(explode("\n", (string)file_get_contents($ipFile)), function($t) use ($nowTs){
        return $t !== '' && ($nowTs - (int)$t) < 86400; // fenêtre glissante 24h
    });
}
$lastMin = array_filter($ipHits, function($t) use ($nowTs){ return ($nowTs - (int)$t) < 60; });
if (count($lastMin) >= 15) {
    http_response_code(429);
    echo json_encode(['error' => 'Trop de requêtes IA (max 15/min). Réessayez dans 1 minute.']);
    exit;
}
if (count($ipHits) >= 300) {
    http_response_code(429);
    echo json_encode(['error' => 'Quota IA quotidien atteint pour cette connexion (300/jour).']);
    exit;
}
$ipHits[] = $nowTs;
@file_put_contents($ipFile, implode("\n", $ipHits), LOCK_EX);

// ── 4. CACHE VALIDÉ : vérifier si la question a déjà une réponse validée ─
$questionHash = sha1(strtolower(trim($prompt)));
$cachedAnswer = check_validated_cache($questionHash);
if ($cachedAnswer !== null) {
    log_request($userId, $userPlan, 'cache_hit', strlen($cachedAnswer));
    echo json_encode([
        'text'   => $cachedAnswer,
        'source' => 'cache_validated',
        'note'   => '✓ Réponse validée par un enseignant VÉRITAS'
    ]);
    exit;
}

// ── 4ante. 📰 CACHE ÉDITORIAL PARTAGÉ (v1.12) ───────────────────────────
// Une seule génération par (clé éditoriale + contenu + jour) ; tous les visiteurs
// suivants lisent le même texte, instantanément et sans consommer de quota.
$sharedFile = '';
if ($isShared) {
    $sharedDir = $rateDir . '_shared/';
    if (!is_dir($sharedDir)) @mkdir($sharedDir, 0750, true);
    $sharedFile = $sharedDir . $sharedKey . '_' . date('Ymd') . '_' . substr($questionHash, 0, 16) . '.txt';

    if (is_file($sharedFile)) {
        $hit = (string) @file_get_contents($sharedFile);
        if ($hit !== '') {
            log_request($userId, $userPlan, 'shared_hit', strlen($hit));
            echo json_encode(['text' => $hit, 'source' => 'cache_shared', 'cached' => true]);
            exit;
        }
    }

    // Purge best-effort des éditions périmées (garde le disque propre).
    foreach ((array) @glob($sharedDir . $sharedKey . '_*.txt') as $old) {
        if (is_file($old) && (time() - (int) @filemtime($old)) > 172800) @unlink($old);
    }

    // Garde-fou de coût : même partagé, on borne le nombre de générations par
    // jour et par clé (sinon un contenu qui varie à chaque appel relancerait
    // l'IA indéfiniment en contournant les quotas individuels).
    $sGenFile  = $sharedDir . '_gen_' . $sharedKey . '_' . date('Ymd') . '.txt';
    $sGenCount = is_file($sGenFile) ? (int) @file_get_contents($sGenFile) : 0;
    if ($sGenCount >= 40) {
        http_response_code(429);
        echo json_encode(['error' => 'Contenu éditorial du jour déjà généré — réessayez demain.', 'shared' => $sharedKey]);
        exit;
    }
    @file_put_contents($sGenFile, ($sGenCount + 1) . '');
}

// ── 4bis. 🔐 v1.2.3 PLAFOND GLOBAL QUOTIDIEN (borne les coûts, tous appelants confondus) ──
// L'endpoint IA n'exige pas d'auth (entonnoir visiteur) ; seul un rate-limit par IP existait.
// Un plafond global protège contre l'abus distribué ou un pic viral. On ne compte QUE les
// vrais appels amont (on est ici APRÈS le cache → cache miss = coût réel).
// 🛟 FAIL-OPEN : toute erreur de compteur => on autorise (ne JAMAIS casser le funnel IA).
$IA_GLOBAL_DAILY_MAX = defined('IA_GLOBAL_DAILY_MAX') ? (int) IA_GLOBAL_DAILY_MAX : 3000;
$gFile  = $rateDir . 'ia_global_' . date('Ymd') . '.txt';
$gCount = is_file($gFile) ? (int) @file_get_contents($gFile) : 0;
if ($IA_GLOBAL_DAILY_MAX > 0 && $gCount >= $IA_GLOBAL_DAILY_MAX) {
    // Alerte e-mail best-effort, une seule fois par jour (si IA_ALERT_EMAIL défini)
    $alertFlag = $rateDir . 'ia_alert_' . date('Ymd') . '.txt';
    if (defined('IA_ALERT_EMAIL') && IA_ALERT_EMAIL && !is_file($alertFlag)) {
        @file_put_contents($alertFlag, '1');
        @mail(IA_ALERT_EMAIL, 'VERITAS — plafond IA quotidien atteint',
            'Le plafond global de ' . $IA_GLOBAL_DAILY_MAX . " requetes IA/jour a ete atteint le " . date('c')
            . ".\nLes nouvelles requetes sont temporairement refusees (les reponses validees en cache restent servies)."
            . "\nAjustez IA_GLOBAL_DAILY_MAX dans api/payment_config.php si besoin.");
    }
    @file_put_contents(__DIR__ . '/data/_security_log.txt',
        date('c') . ' [IA_GLOBAL_CAP] count=' . $gCount . ' max=' . $IA_GLOBAL_DAILY_MAX . ' ip=' . $ip . "\n", FILE_APPEND);
    http_response_code(503);
    echo json_encode(['error' => 'Assistant IA très sollicité aujourd’hui — réessayez plus tard. Les réponses déjà validées restent disponibles.']);
    exit;
}
// L'incrément a lieu APRÈS le quota par formule (section 4ter, audit du
// 22/10/2026) : posé ici, il comptait aussi les requêtes que 4ter refusait,
// si bien qu'un visiteur à court d'essais qui insistait (jusqu'à 300 fois
// par IP et par jour) brûlait le budget de tout le site sans rien coûter.

// ── 4ter. 🔐 QUOTAS STRICTS PAR FORMULE — ratio d'abonnement vérifié SERVEUR ──
// Stratégie v1.3.3 : TOUS les utilisateurs (visiteurs inclus) accèdent aux
// MEILLEURS modèles (Gemini 2.5 Pro, DeepSeek). La différence entre formules
// n'est PAS la qualité mais le VOLUME — ratio STRICT, resserré pour PRIVILÉGIER
// LES ABONNÉS et tenir la charge à des milliers de comptes :
//   anon 2/jour (goûter) → free 5 → starter 15 → pro 50 → élite 100 →
//   enseignant 120 → admin illimité.
// Même l'Élite est BORNÉ (100/j = largement « illimité » pour un élève réel,
// mais protège le budget tokens contre un compte qui scripte/abuse).
// Ajustable SANS redéploiement via IA_TIER_DAILY_JSON dans payment_config.php,
// ex. : define('IA_TIER_DAILY_JSON','{"anon":2,"free":5,"pro":60}');
// L'anonyme est compté PAR IP (avant : userId vide ⇒ il échappait totalement
// au quota par formule et disposait de 300/jour).
// ── 🔐 v1.12 — L'IDENTITÉ DOIT ÊTRE PROUVÉE POUR OUVRIR UN GROS QUOTA ──
// `userId` arrive du client, en clair, sans aucune preuve. server_user_tier()
// le comparait directement aux comptes de la base : il suffisait donc d'envoyer
// l'identifiant d'un enseignant (120/jour) ou d'un admin (ILLIMITÉ) pour vider
// le budget IA — un identifiant qui circule dès qu'on partage un écran.
//
// Correctif : si un jeton de compte est fourni (émis par student_data.php et
// signé HMAC), le palier découle du compte VÉRIFIÉ. Sinon on calcule comme
// avant, mais on ÉCRÊTE les paliers à privilège. Les abonnés légitimes gardent
// un quota confortable ; l'usurpation ne rapporte plus rien.
$utilisateurVerifie = '';
$abonneAtelier = false;
$fichierAtelier = ''; $compteAtelier = 0;
$jetonIA = (string) ($body['token'] ?? '');
/* INVITÉ DE L'ATELIER (21/10/2026). Le jeton « inv. » de l'invité d'appareil
   n'est pas un jeton de compte : vrt_verify_token le rejetait, et l'invité
   tombait au palier « anon » — 2 appels par JOUR, alors que son essai lui en
   accorde 5 par mois et qu'une composition en demande un, parfois deux (la
   réparation). Résultat constaté : une seule épreuve par jour, puis « quota
   épuisé ». On reconnaît désormais ce jeton (même signature que
   plateforme.php, plat_inv_verifier) et l'on suit la règle des abonnés : le
   palier « free » ne vaut qu'à hauteur des appels que plateforme.php a DÉJÀ
   accordés ce mois-ci à cet appareil (registre _plat_invites.json). Appeler
   ce proxy directement n'ouvre donc rien de plus que le quota de l'essai. */
$inviteAtelier = false; $fichierInvite = ''; $compteInvite = 0; $idInvite = '';
if (strpos($jetonIA, 'inv.') === 0) {
    @include_once __DIR__ . '/_auth_lib.php';
    if (defined('VRT_HMAC_KEY') && function_exists('vrt_b64url_encode') && function_exists('vrt_b64url_decode')) {
        $partsInv = explode('.', substr($jetonIA, 4));
        if (count($partsInv) === 2) {
            $attenduInv = vrt_b64url_encode(hash_hmac('sha256', 'invite|' . $partsInv[0], VRT_HMAC_KEY, true));
            $pInv = hash_equals($attenduInv, $partsInv[1]) ? json_decode(vrt_b64url_decode($partsInv[0]), true) : null;
            $cleInv = is_array($pInv) ? (string) ($pInv['d'] ?? '') : '';
            if ($cleInv !== '' && (int) ($pInv['exp'] ?? 0) >= time()) {
                $regInv = json_decode((string) @file_get_contents(__DIR__ . '/data/_plat_invites.json'), true);
                $qInv = is_array($regInv) ? ($regInv['appareils'][$cleInv]['q']['ia'] ?? null) : null;
                $accordesInv = (is_array($qInv) && (string) ($qInv['mois'] ?? '') === date('Y-m'))
                    ? (int) ($qInv['utilise'] ?? 0) : 0;
                $fInv = $rateDir . 'iainvite_' . substr(md5($cleInv), 0, 16) . '_' . date('Ym') . '.txt';
                $utilisesInv = is_file($fInv) ? (int) @file_get_contents($fInv) : 0;
                $idInvite = 'inv:' . substr(md5($cleInv), 0, 16);
                if ($utilisesInv < $accordesInv) {
                    $inviteAtelier = true;
                    $fichierInvite = $fInv;
                    $compteInvite  = $utilisesInv;
                }
            }
        }
    }
    $jetonIA = '';   // ce n'est pas un jeton de compte : on ne le soumet pas à vrt_verify_token
}
if ($jetonIA !== '') {
    @include_once __DIR__ . '/_auth_lib.php';
    if (function_exists('vrt_verify_token')) {
        try {
            $verif = vrt_verify_token($jetonIA);
            if ($verif !== null) {
                $utilisateurVerifie = (string) ($verif['acc']['user'] ?? $verif['acc']['id'] ?? '');
                /* ABONNÉ DE L'ATELIER DE FRANÇAIS. server_user_tier() ne lit
                   que les abonnements e-learning : un abonné de l'Atelier
                   tombait au palier « free » (5 appels/jour), si bien qu'une
                   formule vendue avec 120 ou 400 appels à Ambassa par mois ne
                   pouvait jamais être consommée. Le compte étant PROUVÉ par
                   son jeton, on lui donne le palier enseignant ; la vraie
                   borne reste le quota MENSUEL de sa formule, décompté par
                   plateforme.php?action=quota avant chaque composition.
                   Liste identique à plat_plans_atelier() (api/plateforme.php). */
                if (function_exists('vrt_account_active_plans') && function_exists('vrt_load_db')) {
                    $dbAtelier = vrt_load_db();
                    if (is_array($dbAtelier) && array_intersect(
                            vrt_account_active_plans($verif['acc'], $dbAtelier),
                            ['ens_mois', 'ens', 'etab', 'pro'])) {
                        /* ⚠️ LE PALIER SUIT LE QUOTA DÉJÀ DÉCOMPTÉ (audit du
                           27/09/2026). Sans cette borne, un abonné à 800 F
                           pouvait appeler ce proxy DIRECTEMENT, 120 fois par
                           jour, sans jamais passer par plateforme.php?action=
                           quota : le quota mensuel vendu (30) ne bornait que
                           l'interface. On n'accorde donc le palier enseignant
                           qu'à hauteur des appels que plateforme.php a déjà
                           accordés CE MOIS-CI (quotas[<compte>|ia].utilise) :
                           chaque appel légitime de l'Atelier en a décompté un
                           juste avant. Au-delà, le compte garde son palier
                           ordinaire. Compteur propre, dans data/_rate/. */
                        $accAt = (string) ($verif['acc']['id'] ?? '');
                        $qAt   = $dbAtelier['plateforme']['quotas'][$accAt . '|ia'] ?? null;
                        $accordesAt = (is_array($qAt) && (string) ($qAt['mois'] ?? '') === date('Y-m'))
                            ? (int) ($qAt['utilise'] ?? 0) : 0;
                        $fAt = $rateDir . 'iaatelier_' . substr(md5($accAt), 0, 16) . '_' . date('Ym') . '.txt';
                        $utilisesAt = is_file($fAt) ? (int) @file_get_contents($fAt) : 0;
                        /* RECALAGE (21/10/2026). Tant que la synchro de
                           l'administration remettait `plateforme.quotas` à sa
                           valeur d'avant (corrigé dans db.php), ce compteur-ci
                           dépassait les appels accordés : un abonné « pro »
                           restait au palier gratuit des jours durant. Il ne
                           peut pas légitimement dépasser ce qui a été accordé.
                           plateforme.php accorde AVANT l'appel : le dernier
                           accord est celui de l'appel en cours, d'où le
                           recalage à « accordés − 1 ». Un appel direct, sans
                           accord préalable, reste refusé. */
                        /* Strictement supérieur : à égalité, tous les accords
                           ont été consommés et l'appel est refusé — sinon un
                           appel direct se recalerait lui-même indéfiniment. */
                        if ($accAt !== '' && $accordesAt > 0 && $utilisesAt > $accordesAt) {
                            $utilisesAt = $accordesAt - 1;
                            @file_put_contents($fAt, (string) $utilisesAt, LOCK_EX);
                        }
                        if ($accAt !== '' && $utilisesAt < $accordesAt) {
                            $abonneAtelier = true;
                            $fichierAtelier = $fAt;
                            $compteAtelier  = $utilisesAt;
                        }
                    }
                }
            }
        } catch (Throwable $e) { /* jeton illisible → on retombe sur l'écrêtage */ }
    }
}

$userTier = server_user_tier($utilisateurVerifie !== '' ? $utilisateurVerifie : (string) $userId);

if ($utilisateurVerifie === '') {
    if ($userTier === 'admin' || $userTier === 'teach') {
        @file_put_contents(__DIR__ . '/data/_security_log.txt',
            date('c') . ' [IA_TIER_UNPROVEN] palier ' . $userTier . ' réclamé sans jeton — ramené à free. ip=' . $ip
            . ' userId=' . substr((string) $userId, 0, 40) . "\n", FILE_APPEND);
        $userTier = 'free';
    } elseif ($userTier === 'elite') {
        $userTier = 'pro';   // abonné non prouvé : quota confortable, jamais le maximum
    }
} else {
    // Le compteur suit l'identité PROUVÉE (un jeton = un compte).
    $userId = $utilisateurVerifie;
}
if ($utilisateurVerifie === '' && $idInvite !== '') {
    // L'invité est compté sur SON appareil, pas sur l'adresse IP partagée.
    $userId = $idInvite;
    if ($inviteAtelier && in_array($userTier, ['anon', 'free'], true)) {
        $userTier = 'free';
        if (!is_dir($rateDir)) @mkdir($rateDir, 0755, true);
        @file_put_contents($fichierInvite, ($compteInvite + 1) . '', LOCK_EX);
    }
}
if ($utilisateurVerifie !== '') {
    if ($abonneAtelier && in_array($userTier, ['anon', 'free', 'starter', 'pro', 'elite'], true)) {
        $userTier = 'teach';
        if (!is_dir($rateDir)) @mkdir($rateDir, 0755, true);
        @file_put_contents($fichierAtelier, ($compteAtelier + 1) . '', LOCK_EX);
    }
}
$tierDaily = ['anon' => 2, 'free' => 5, 'starter' => 15, 'pro' => 50, 'teach' => 120, 'elite' => 100, 'admin' => -1];
if (defined('IA_TIER_DAILY_JSON')) { $cfg = json_decode(IA_TIER_DAILY_JSON, true); if (is_array($cfg)) $tierDaily = array_merge($tierDaily, $cfg); }
$uDailyMax = $tierDaily[$userTier] ?? 5;
// Une publication éditoriale n'est facturée à personne : elle a son propre
// garde-fou (section 4ante) et ne doit pas amputer le quota d'un visiteur qui
// n'a encore rien demandé.
if ($isShared) { $uDailyMax = -1; }
if ($uDailyMax > 0) {
    // Clé de comptage : le COMPTE si connu, sinon l'IP (visiteur anonyme).
    $qKey   = $userId !== ''
        ? 'iauser_' . substr(md5((string) $userId), 0, 16)
        : 'iaanon_' . substr(md5($ip), 0, 16);
    $uFile  = $rateDir . $qKey . '_' . date('Ymd') . '.txt';
    $uCount = is_file($uFile) ? (int) @file_get_contents($uFile) : 0;
    if ($uCount >= $uDailyMax) {
        http_response_code(429);
        echo json_encode(['error' => ($userTier === 'anon'
                ? 'Vos ' . $uDailyMax . ' essais gratuits du jour sont épuisés. Créez un compte gratuit (' . (int) ($tierDaily['free'] ?? 5) . '/jour) ou choisissez une formule pour continuer avec la même qualité d\'IA.'
                : 'Quota IA du jour atteint pour votre formule (' . $uDailyMax . '/jour). Passez à la formule supérieure pour plus de requêtes — même IA premium, plus de volume.'),
            'tier' => $userTier, 'limit' => $uDailyMax]);
        exit;
    }
    @file_put_contents($uFile, ($uCount + 1) . '');
}
// Plafond global : on ne compte que les requêtes qui partent vraiment vers un
// moteur (incrément best-effort, non atomique = tolérable pour un plafond souple).
@file_put_contents($gFile, ($gCount + 1) . '');

// ── 5. CHOIX DU MODÈLE — v1.3.3 : LE MEILLEUR POUR TOUS ─────────────────
// Stratégie commerciale (décision Jacques) : le visiteur teste la MEILLEURE
// qualité (Gemini 2.5 Pro en primaire, DeepSeek en 1er repli) et doit être
// conquis AVANT de passer à la formule supérieure. La différenciation des
// formules se fait UNIQUEMENT par le quota strict (section 4ter), plus par le
// modèle. Quand le quota Google du modèle Pro (~100 req/jour) est consommé,
// repli automatique Flash pour TOUS — puis DeepSeek → Groq → Mistral.
// 🚀 v1.4.2 — ROTATION MULTI-CLÉS GEMINI : 2-3 clés Google AI Studio gratuites
// (comptes distincts) multiplient le quota du moteur primaire. Définir
// GEMINI_API_KEY_2 / GEMINI_API_KEY_3 dans payment_config.php.
$geminiKeys = array_values(array_filter([
    defined('GEMINI_API_KEY')   ? GEMINI_API_KEY   : (getenv('GEMINI_API_KEY') ?: ''),
    defined('GEMINI_API_KEY_2') ? GEMINI_API_KEY_2 : '',
    defined('GEMINI_API_KEY_3') ? GEMINI_API_KEY_3 : '',
], function ($k) { return $k !== ''; }));
$isElite    = in_array($userTier, ['elite', 'admin', 'teach'], true); // conservé pour stats
$modelFree  = defined('GEMINI_MODEL')       ? GEMINI_MODEL       : 'gemini-2.5-flash';
// ⚠️ 22/10/2026 : gemini-2.5-pro répond 404 « no longer available to new
// users » sur notre clé — chaque requête perdait un appel avant le repli Flash.
// Défaut aligné sur Flash ; une valeur PRO encore définie dans
// payment_config.php est tolérée : après son premier 404, call_gemini() la
// saute pendant 24 h (ia_marquer_indispo).
// Banc du 22/10/2026 sur les DEUX clés de prod : gemini-3.5-flash répond sur
// les deux (~3,5 s) alors que gemini-2.5-flash est refusé (404) à la 2e clé ;
// gemini-3.8-flash et gemini-flash-latest restaient muets 90 s — à éviter.
$modelElite = defined('GEMINI_MODEL_ELITE') ? GEMINI_MODEL_ELITE : 'gemini-3.5-flash';
// Réserve GRATUITE : chaque modèle a son propre quota journalier chez Google,
// un Flash-Lite de 3e génération double donc la capacité sans rien coûter.
$modelReserve = defined('GEMINI_MODEL_RESERVE') ? GEMINI_MODEL_RESERVE : 'gemini-3.5-flash-lite';
$model      = $modelElite; // 🚀 top modèle pour TOUS (visiteurs inclus)

// 🚀 CASCADE « JAMAIS À COURT DE JETONS » (22/10/2026) :
//   1. Gemini : chaque clé × chaque modèle (3.5-flash → 2.5-flash → 3.5-flash-lite
//      → réserves). Google compte le quota PAR MODÈLE : chaque modèle ajouté est
//      un quota journalier de plus, gratuit.
//   2. Groq : gpt-oss-120b → qwen3.8-27b → gpt-oss-20b (quota par modèle aussi).
//   3. OpenRouter :free → Cloudflare → NVIDIA → Mistral.
//   4. Dernier recours : une réponse déjà générée pour la même question.
// Un maillon sans clé est ignoré ; un maillon épuisé, retiré ou refusé est mis
// de côté (ia_marquer_indispo) au lieu d'être rappelé à chaque requête.
// Budget de temps global : on ne lance plus d'appel quand il ne reste pas de
// quoi le mener à bout — mieux vaut le dernier recours qu'une page qui pend.
$IA_BUDGET = defined('IA_BUDGET_SECONDES') ? max(20, (int) IA_BUDGET_SECONDES) : 100;
$iaDebut   = microtime(true);
// Le budget n'a de sens que si PHP laisse vivre la requête aussi longtemps :
// au banc local, max_execution_time (30 s) tuait la cascade en plein secours
// OpenRouter → page 500, sans réponse ni journal. Sans effet si l'hébergeur
// interdit set_time_limit (le @ évite alors l'avertissement).
@set_time_limit($IA_BUDGET + 20);
$iaReste   = function () use ($IA_BUDGET, $iaDebut): int {
    return (int) floor($IA_BUDGET - (microtime(true) - $iaDebut));
};
$ok = false; $text = ''; $error = null; $source = 'none';

// ── Réglages de génération propres à certaines demandes ──────────────────
// La composition d'une épreuve complète (Atelier de Français, action
// `epreuve_minesec`) renvoie un JSON long : questions, barème, corrigé,
// sujets. Deux pièges avec Gemini 2.5 : (1) sa « réflexion » est décomptée
// du MÊME plafond de sortie — elle pouvait en consommer l'essentiel et
// laisser un JSON tronqué ; (2) sans contrainte de format, il l'entoure de
// prose. On borne donc la réflexion, on impose le JSON et on baisse la
// température (un sujet d'examen n'a pas besoin de fantaisie). Aucune autre
// action n'est touchée.
$geminiReglages = [];
if ((string) ($body['action'] ?? '') === 'epreuve_minesec') {
    $geminiReglages = [
        'temperature'      => 0.3,
        'responseMimeType' => 'application/json',
        'thinkingConfig'   => ['thinkingBudget' => 2048],
        /* La réflexion (2 048) se décompte du plafond de sortie : à 8 192,
           il restait ≈ 6 000 jetons de réponse. Une épreuve de Terminale à
           trois sujets, corrigés et guide s'arrêtait au milieu du guide
           (24 433 caractères, constaté en production le 21/10/2026). Le
           relèvement ne vaut que pour cette action. */
        'maxOutputTokens'  => defined('IA_MAX_OUTPUT_TOKENS_EPREUVE') ? (int) IA_MAX_OUTPUT_TOKENS_EPREUVE : 16384,
    ];
}

// Ordre par clé : modèle « élite » → Flash → réserve Flash-Lite → réserves
// supplémentaires (GEMINI_MODELS_EXTRA, liste séparée par des virgules ; un
// modèle absent pour une clé est sauté 24 h après son premier 404).
// gemini-2.5-flash-lite retiré : 404 « no longer available » sur nos 3 clés
// (banc du 22/10/2026). gemini-3.1-flash-lite répond, mais lent (6-14 s) : en dernier.
$geminiExtra = defined('GEMINI_MODELS_EXTRA') ? (string) GEMINI_MODELS_EXTRA : 'gemini-3.1-flash-lite';
$geminiModeles = array_values(array_unique(array_filter(array_map('trim',
    array_merge([$model, $modelFree, $modelReserve], explode(',', $geminiExtra))))));
foreach ($geminiKeys as $gIdx => $gk) {
    foreach ($geminiModeles as $gm) {
        if ($iaReste() < 15) break 2;
        [$okG, $textG, $errG] = call_gemini($gk, $sysPrompt, $ragContext, $prompt, $gm, $geminiReglages, min(45, $iaReste()));
        if ($okG) {
            $ok = true; $text = $textG; $error = null;
            $source = 'gemini_' . preg_replace(['/^gemini-/', '/[^a-z0-9.]+/'], ['', '-'], $gm) . ($gIdx ? ('_k' . ($gIdx + 1)) : '');
            break 2;
        }
        if ($error === null) $error = $errG;
    }
}

if (!$ok) {
    foreach (ia_maillons_secours() as $mai) {
        foreach ($mai['modeles'] as $mm) {
            if ($iaReste() < 15) break 2;
            [$okX, $textX, $errX] = call_openai_chat($mai['url'], $mai['cle'], $mm, $sysPrompt, $ragContext, $prompt,
                                                     $mai['label'], $mai['max'], min(45, $iaReste()));
            if ($okX) { $ok = true; $text = $textX; $error = null; $source = 'fallback_' . $mai['id']; break 2; }
            if ($error === null) $error = $errX;
        }
    }
    // Dernier recours : la même question a déjà reçu une réponse (pas encore
    // validée par un enseignant). Mieux qu'un « indisponible ».
    if (!$ok) {
        $deja = check_any_cache($questionHash);
        if ($deja !== null) { $ok = true; $text = $deja; $error = null; $source = 'cache_pending'; }
    }
    if (!$ok && $error === null) {
        // v1.3.3 : le détail de configuration part en LOG (admin), jamais au visiteur.
        @file_put_contents(__DIR__ . '/data/_security_log.txt',
            date('c') . " [IA_NO_ENGINE] Aucun moteur IA configuré — renseignez GEMINI_API_KEY dans api/payment_config.php\n", FILE_APPEND);
        $error = 'Assistant IA momentanément indisponible — réessayez dans quelques instants.';
    }
}

if (!$ok) {
    // v1.3.3 : le détail technique ('Gemini HTTP 429…', 'cURL…') part en LOG —
    // le visiteur reçoit TOUJOURS un message neutre et rassurant.
    @file_put_contents(__DIR__ . '/data/_security_log.txt',
        date('c') . ' [IA_FAIL] source=' . $source . ' err=' . substr((string) $error, 0, 300) . "\n", FILE_APPEND);
    http_response_code(502);
    echo json_encode(['error' => 'Le Professeur Ambassa est momentanément indisponible — réessayez dans quelques instants.', 'source' => $source]);
    log_request($userId, $userPlan, 'fail', 0);
    exit;
}

// ── 6. STORE EN ATTENTE DE VALIDATION ──────────────────────────────────
store_pending_answer($questionHash, $prompt, $text, $userId, $userPlan);
log_request($userId, $userPlan, 'success_' . $source, strlen($text));

// Publier le contenu éditorial du jour : les visiteurs suivants le liront ici.
if ($isShared && $sharedFile !== '' && $text !== '') {
    @file_put_contents($sharedFile, $text, LOCK_EX);
}

echo json_encode([
    'text'   => $text,
    'source' => $source,
    'cached' => false
]);
exit;

// ═══════════════════════════════════════════════════════════════════════
// FONCTIONS UTILES
// ═══════════════════════════════════════════════════════════════════════

// v1.3.2 : call_claude_sonnet SUPPRIMÉE (code mort — clé jamais configurée,
// modèle obsolète). La chaîne active : Gemini → DeepSeek → Groq → Mistral.

function call_gemini(string $apiKey, string $sys, string $rag, string $prompt, string $model = '', array $reglages = [], int $delai = 60): array {
    // Google Gemini — quota gratuit généreux, bon support du français.
    // Clé gratuite : https://aistudio.google.com/apikey
    $fullSys = trim($sys);
    if ($rag !== '') {
        $fullSys .= "\n\n═══ CONTEXTE FACTUEL (annales et corrigés MINESEC) ═══\n" . $rag
                  . "\nAppuie-toi sur ce contexte. Si une info manque, dis-le clairement.";
    }
    // v1.2.2 : le modèle peut être imposé par l'appelant (Pro pour l'Élite, Flash sinon).
    if ($model === '') $model = defined('GEMINI_MODEL') ? GEMINI_MODEL : 'gemini-2.5-flash';
    // Modèle retiré, ou quota du jour épuisé sur CETTE clé : inutile de rappeler.
    $indispo = 'gemini|' . md5($apiKey) . '|' . $model;
    if (ia_est_indispo($indispo)) return [false, '', 'Gemini ' . $model . ' ignoré (indisponible ou quota du jour épuisé)'];
    $url ='https://generativelanguage.googleapis.com/v1beta/models/' . $model
         . ':generateContent?key=' . urlencode($apiKey);

    // 🚀 v1.3.2 : 2048 → 8192 tokens. Une dissertation ou un commentaire composé
    // MINESEC complet (intro + 3 axes + conclusion + barème) dépassait 2048 →
    // réponses TRONQUÉES (« partielles ») signalées par les élèves.
    $maxTok = defined('IA_MAX_OUTPUT_TOKENS') ? (int) IA_MAX_OUTPUT_TOKENS : 8192;
    $payload = json_encode([
        'systemInstruction' => ['parts' => [['text' => $fullSys !== '' ? $fullSys : 'Tu es un assistant pédagogique.']]],
        'contents'          => [['role' => 'user', 'parts' => [['text' => $prompt]]]],
        'generationConfig'  => array_merge(['temperature' => 0.7, 'maxOutputTokens' => $maxTok], $reglages)
    ], JSON_UNESCAPED_UNICODE);

    // v1.2.1 : retry sur 503 "high demand" / 429 / 5xx (le tier gratuit Gemini sature par moments)
    $raw = ''; $http = 0; $err = '';
    // 2 essais (et non plus 3) : la cascade a d'autres modèles et d'autres clés
    // derrière, inutile de s'acharner sur un modèle saturé.
    $t0 = microtime(true);
    for ($try = 1; $try <= 2; $try++) {
        $reste = $delai - (int) (microtime(true) - $t0);
        if ($reste < 5) break;
        $ch = curl_init($url);
        curl_setopt_array($ch, [
            CURLOPT_POST           => true,
            CURLOPT_POSTFIELDS     => $payload,
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_TIMEOUT        => $reste,
            CURLOPT_CONNECTTIMEOUT => 10,
            CURLOPT_HTTPHEADER     => ['Content-Type: application/json'],
            CURLOPT_SSL_VERIFYPEER => true
        ]);
        $raw  = curl_exec($ch);
        $http = curl_getinfo($ch, CURLINFO_HTTP_CODE);
        $err  = curl_error($ch);
        $errno = curl_errno($ch);
        curl_close($ch);
        if ($http === 200) break;
        // Modèle muet jusqu'au délai (vu au banc : gemini-3.8-flash, 90 s) :
        // on le saute 15 min plutôt que d'y perdre le budget de chaque requête.
        if ($errno === CURLE_OPERATION_TIMEDOUT) { ia_marquer_indispo($indispo, time() + 900); break; }
        // Quota JOURNALIER épuisé (quotaId « …PerDay… ») : il ne revient qu'à
        // minuit heure du Pacifique. Le réessayer coûtait 2 × 0,9 s par clé et
        // par requête ; on mémorise l'épuisement jusqu'à la remise à zéro.
        if ($http === 429 && stripos((string) $raw, 'PerDay') !== false) {
            ia_marquer_indispo($indispo, ia_minuit_pacifique());
            break;
        }
        if ($http === 503 || $http === 429 || $http >= 500) { usleep(900000); continue; } // transitoire → réessai
        break; // autre erreur → pas de réessai
    }

    if ($err) return [false, '', 'cURL: ' . $err];
    // 404 = modèle retiré pour ce compte : on le saute 24 h au lieu de perdre un
    // appel à chaque requête (constaté sur gemini-2.5-pro le 22/10/2026).
    if ($http === 404) ia_marquer_indispo($indispo, time() + 86400);
    if ($http !== 200) return [false, '', 'Gemini ' . $model . ' HTTP ' . $http . ': ' . substr((string)$raw, 0, 200)];

    $data = json_decode($raw, true);
    $text = $data['candidates'][0]['content']['parts'][0]['text'] ?? '';
    if ($text === '') {
        $blocked = $data['promptFeedback']['blockReason'] ?? ($data['candidates'][0]['finishReason'] ?? '');
        return [false, '', 'Réponse vide de Gemini' . ($blocked ? ' (' . $blocked . ')' : '')];
    }
    $u = $data['usageMetadata'] ?? [];
    ia_dernier_usage([
        'in'    => (int) ($u['promptTokenCount'] ?? 0),
        'out'   => (int) ($u['candidatesTokenCount'] ?? 0),
        'think' => (int) ($u['thoughtsTokenCount'] ?? 0),
    ]);
    return [true, $text, null];
}

// v1.3.2 : call_pollinations SUPPRIMÉE (service déprécié par son fournisseur,
// renvoyait « legacy text API deprecated » au lieu de vraies réponses).

/**
 * v1.2.2 — Helper générique pour les API "OpenAI-compatible" (Groq, Mistral, etc.).
 * Même format de requête/réponse → un seul code pour plusieurs fournisseurs.
 */
function call_openai_chat(string $url, string $apiKey, string $model, string $sys, string $rag, string $prompt, string $label, int $maxTok = 0, int $delai = 60): array {
    // L'URL entre dans la clé : chez Cloudflare elle porte l'identifiant de
    // compte, dont une erreur (404) ne doit plus bloquer 24 h une fois corrigée.
    $indispo = $url . '|' . md5($apiKey) . '|' . $model;
    if (ia_est_indispo($indispo)) return [false, '', $label . ' ' . $model . ' ignoré (modèle indisponible)'];
    if ($maxTok <= 0) $maxTok = defined('IA_MAX_OUTPUT_TOKENS') ? (int) IA_MAX_OUTPUT_TOKENS : 8192;
    $fullSys = trim($sys);
    if ($rag !== '') {
        $fullSys .= "\n\n═══ CONTEXTE FACTUEL (annales et corrigés MINESEC) ═══\n" . $rag
                  . "\nAppuie-toi sur ce contexte. Si une info manque, dis-le clairement.";
    }
    $messages = [];
    if ($fullSys !== '') $messages[] = ['role' => 'system', 'content' => $fullSys];
    $messages[] = ['role' => 'user', 'content' => $prompt];

    $payload = json_encode([
        'model'       => $model,
        'messages'    => $messages,
        // v1.3.2 : 4096 → 8192 (aligné sur Gemini — dissertations complètes) ;
        // un fournisseur au plafond de jetons/minute serré passe sa propre borne.
        'max_tokens'  => $maxTok,
        'temperature' => 0.7
    ], JSON_UNESCAPED_UNICODE);

    $ch = curl_init($url);
    curl_setopt_array($ch, [
        CURLOPT_POST           => true,
        CURLOPT_POSTFIELDS     => $payload,
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_TIMEOUT        => max(5, $delai),
        CURLOPT_CONNECTTIMEOUT => 10,
        CURLOPT_HTTPHEADER     => ['Authorization: Bearer ' . $apiKey, 'Content-Type: application/json'],
        CURLOPT_SSL_VERIFYPEER => true
    ]);
    $raw  = curl_exec($ch);
    $http = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    $err  = curl_error($ch);
    $errno = curl_errno($ch);
    curl_close($ch);

    if ($errno === CURLE_OPERATION_TIMEDOUT) ia_marquer_indispo($indispo, time() + 900); // muet : 15 min de côté
    if ($err) return [false, '', $label . ' cURL: ' . $err];
    if ($http === 404) ia_marquer_indispo($indispo, time() + 86400); // modèle retiré
    // Quota épuisé : du JOUR (Groq « per day », OpenRouter « free-models-per-day »)
    // → 1 h de côté ; de la MINUTE → 60 s. Le modèle suivant prend le relais.
    if ($http === 429) {
        ia_marquer_indispo($indispo, time() + (preg_match('/per.?day|daily|\bRPD\b|\bTPD\b/i', (string) $raw) ? 3600 : 60));
    }
    // Clé refusée (401), paiement exigé (402), modèle hors offre (403) : rien ne
    // changera dans la minute ; on évite 2-3 s perdues à chaque requête pendant 1 h.
    if (in_array($http, [401, 402, 403], true)) ia_marquer_indispo($indispo, time() + 3600);
    if ($http !== 200) return [false, '', $label . ' ' . $model . ' HTTP ' . $http . ': ' . substr((string)$raw, 0, 200)];

    $data = json_decode($raw, true);
    $text = $data['choices'][0]['message']['content'] ?? '';
    if ($text === '') return [false, '', $label . ' : réponse vide'];
    $u = $data['usage'] ?? [];
    ia_dernier_usage([
        'in'  => (int) ($u['prompt_tokens'] ?? 0),
        'out' => (int) ($u['completion_tokens'] ?? 0),
    ]);
    return [true, $text, null];
}

/* MODÈLES RETIRÉS (vérifié le 22/10/2026 sur les pages des fournisseurs).
   payment_config.php.exemple a longtemps proposé ces identifiants : une config
   copiée de l'exemple les définit encore, et la constante l'emportait sur le
   défaut du code → secours morts en silence. On les remplace ici. */
function ia_modele(string $constante, string $defaut): string {
    $retires = [
        'llama-3.3-70b-versatile'             => 'openai/gpt-oss-120b',             // Groq
        'deepseek/deepseek-chat-v3-0324:free' => 'minimax/minimax-m3.1-flash:free', // OpenRouter
        'mistral-large-latest'                => 'mistral-medium-latest',           // Mistral : Large hors offre gratuite (403)
        'deepseek-ai/deepseek-v4.1-flash'     => 'nvidia/nemotron-3-ultra-550b-a55b', // NVIDIA : muet 90 s au banc
    ];
    $m = defined($constante) ? (string) constant($constante) : $defaut;
    return $retires[$m] ?? $m;
}

/* LES MAILLONS DE SECOURS, dans l'ordre de la cascade (banc du 22/10/2026).
   Tous parlent le format OpenAI : un seul appelant, call_openai_chat().
   Plusieurs modèles par fournisseur quand son quota est compté PAR MODÈLE
   (Groq, Mistral) : chaque modèle est un quota de plus. Un maillon sans clé
   n'apparaît pas. `max` = jetons de sortie (0 = IA_MAX_OUTPUT_TOKENS). */
function ia_cle(string $constante): string {
    return defined($constante) ? (string) constant($constante) : (string) (getenv($constante) ?: '');
}
function ia_liste_modeles(string $constante, string $principal, array $reserves): array {
    // <FOURNISSEUR>_MODELS (liste séparée par des virgules) remplace toute la liste.
    if (defined($constante)) return array_values(array_filter(array_map('trim', explode(',', (string) constant($constante)))));
    return array_values(array_unique(array_merge([$principal], $reserves)));
}
function ia_maillons_secours(): array {
    $m = [];
    // Groq — le plus rapide (0,9 s au banc), gratuit : par modèle 1 000 req/jour,
    // 200 000 jetons/jour et 8 000 jetons/MINUTE → sortie bornée à 3 000.
    // Clé : https://console.groq.com/keys
    if (($k = ia_cle('GROQ_API_KEY')) !== '') $m[] = ['id' => 'groq', 'label' => 'Groq', 'cle' => $k, 'max' => 3000,
        'url' => 'https://api.groq.com/openai/v1/chat/completions',
        'modeles' => ia_liste_modeles('GROQ_MODELS', ia_modele('GROQ_MODEL', 'openai/gpt-oss-120b'), ['qwen/qwen3.8-27b', 'openai/gpt-oss-20b'])];
    // OpenRouter — modèles « :free » : 50 req/jour pour le COMPTE (1 000 après un
    // achat unique de 10 $), 20 req/min. Le 2e modèle sert quand le 1er est en
    // panne chez son hébergeur. Liste à jour : https://openrouter.ai/api/v1/models
    if (($k = ia_cle('OPENROUTER_API_KEY')) !== '') $m[] = ['id' => 'openrouter', 'label' => 'OpenRouter', 'cle' => $k, 'max' => 0,
        'url' => 'https://openrouter.ai/api/v1/chat/completions',
        'modeles' => ia_liste_modeles('OPENROUTER_MODELS', ia_modele('OPENROUTER_MODEL', 'minimax/minimax-m3.1-flash:free'), ['recursive/flint-v1.0:free'])];
    // Cloudflare Workers AI — 10 000 « neurones »/jour (~80-200 réponses), remis à
    // zéro à 0 h UTC ; jeton (permission « Workers AI ») ET identifiant de compte.
    // Sortie bornée à 3 000 : chaque jeton coûte des neurones.
    $cfT = ia_cle('CLOUDFLARE_AI_TOKEN'); $cfC = ia_cle('CLOUDFLARE_ACCOUNT_ID');
    if ($cfT !== '' && $cfC !== '') $m[] = ['id' => 'cloudflare', 'label' => 'Cloudflare', 'cle' => $cfT, 'max' => 3000,
        'url' => 'https://api.cloudflare.com/client/v4/accounts/' . rawurlencode($cfC) . '/ai/v1/chat/completions',
        'modeles' => ia_liste_modeles('CLOUDFLARE_MODELS', ia_modele('CLOUDFLARE_MODEL', '@cf/openai/gpt-oss-120b'), [])];
    // NVIDIA (build.nvidia.com) — ~40 req/min ; ⚠️ conditions : l'accès gratuit
    // semble réservé au développement. Modèles : integrate.api.nvidia.com/v1/models
    // Banc du 22/10/2026 : nemotron-3-ultra 2,6 s, bon français ; lightning
    // 8 s (il raisonne d'abord, d'où 4 096 jetons). Muets 90 s : deepseek-v4.1-flash,
    // glm-5.3, gemma-4 ; absents du compte (404) : mistral-large-2, kimi-k2.6.
    if (($k = ia_cle('NVIDIA_API_KEY')) !== '') $m[] = ['id' => 'nvidia', 'label' => 'NVIDIA', 'cle' => $k, 'max' => 4096,
        'url' => 'https://integrate.api.nvidia.com/v1/chat/completions',
        'modeles' => ia_liste_modeles('NVIDIA_MODELS', ia_modele('NVIDIA_MODEL', 'nvidia/nemotron-3-ultra-550b-a55b'), ['nvidia/nemotron-3.5-lightning-30b-a3b'])];
    // Mistral — excellent français ; offre « Experiment » (téléphone vérifié).
    // Large est hors offre gratuite (403). Clé : https://console.mistral.ai/api-keys
    if (($k = ia_cle('MISTRAL_API_KEY')) !== '') $m[] = ['id' => 'mistral', 'label' => 'Mistral', 'cle' => $k, 'max' => 0,
        'url' => 'https://api.mistral.ai/v1/chat/completions',
        'modeles' => ia_liste_modeles('MISTRAL_MODELS', ia_modele('MISTRAL_MODEL', 'mistral-medium-latest'), ['mistral-small-latest'])];
    // SambaNova et Cerebras RETIRÉS (22/10/2026) : tous deux exigent désormais
    // un moyen de paiement (SambaNova 402 PAYMENT_METHOD_REQUIRED, Cerebras
    // « Payment required »). Leurs constantes, si une config les définit
    // encore, sont ignorées.
    return $m;
}

function check_validated_cache(string $hash): ?string {
    $pdo = get_pdo();
    if (!$pdo) return null;
    try {
        $stmt = $pdo->prepare("SELECT answer_text FROM veritas_validated_answers
                               WHERE question_hash = ? AND validated_at IS NOT NULL
                               LIMIT 1");
        $stmt->execute([$hash]);
        $row = $stmt->fetch(PDO::FETCH_ASSOC);
        if ($row) {
            // Incrémenter le compteur d'utilisation
            $pdo->prepare("UPDATE veritas_validated_answers SET use_count = use_count + 1
                           WHERE question_hash = ?")->execute([$hash]);
            return $row['answer_text'];
        }
    } catch (Throwable $e) { /* table pas encore créée → on continue */ }
    return null;
}

// Dernier recours de la cascade : toute réponse déjà générée pour cette
// question, validée ou non (la plus récente).
function check_any_cache(string $hash): ?string {
    $pdo = get_pdo();
    if (!$pdo) return null;
    try {
        $stmt = $pdo->prepare("SELECT answer_text FROM veritas_validated_answers
                               WHERE question_hash = ? AND answer_text <> ''
                               ORDER BY created_at DESC LIMIT 1");
        $stmt->execute([$hash]);
        $a = $stmt->fetchColumn();
        return ($a !== false && $a !== null) ? (string) $a : null;
    } catch (Throwable $e) { return null; }
}

function store_pending_answer(string $hash, string $q, string $a, string $userId, string $plan): void {
    $pdo = get_pdo();
    if (!$pdo) return;
    try {
        $stmt = $pdo->prepare("INSERT IGNORE INTO veritas_validated_answers
                               (question_hash, question_text, answer_text, requested_by, requested_plan, created_at)
                               VALUES (?, ?, ?, ?, ?, NOW())");
        // v1.3.2 : 8000 → 30000. Une dissertation complète dépasse 8000 chars →
        // le cache resservait une réponse TRONQUÉE (colonne TEXT = 64 Ko, ample).
        $stmt->execute([$hash, substr($q, 0, 1000), substr($a, 0, 30000), $userId, $plan]);
    } catch (Throwable $e) { /* silencieux */ }
}

function log_request(string $userId, string $plan, string $action, int $bytes): void {
    // Jetons réellement facturés par le moteur (usageMetadata / usage) : sans
    // eux on ne mesurait que des octets, impossible d'estimer la capacité.
    $u = ia_dernier_usage();
    $tok = $u ? (' | tok_in=' . (int) ($u['in'] ?? 0) . ' tok_out=' . (int) ($u['out'] ?? 0)
                 . (isset($u['think']) ? ' tok_think=' . (int) $u['think'] : '')) : '';
    $line = date('Y-m-d H:i:s') . " | " . $plan . " | " . $userId . " | " . $action . " | " . $bytes . " bytes" . $tok . "\n";
    @file_put_contents(__DIR__ . '/data/ia_proxy.log', $line, FILE_APPEND | LOCK_EX);
}

// Usage du DERNIER appel réussi (null = aucun appel moteur dans cette requête).
function ia_dernier_usage(?array $set = null): ?array {
    static $u = null;
    if ($set !== null) $u = $set;
    return $u;
}

// Mémoire « inutile de rappeler » : modèle retiré (404) ou quota du jour épuisé.
// Un fichier par (fournisseur, clé, modèle) contenant l'échéance en timestamp.
function ia_indispo_fichier(string $quoi): string {
    return __DIR__ . '/data/_rate/ia_indispo_' . substr(md5($quoi), 0, 16) . '.txt';
}
function ia_est_indispo(string $quoi): bool {
    $f = ia_indispo_fichier($quoi);
    if (!is_file($f)) return false;
    if ((int) @file_get_contents($f) > time()) return true;
    @unlink($f);
    return false;
}
function ia_marquer_indispo(string $quoi, int $jusqua): void {
    $dir = __DIR__ . '/data/_rate/';
    if (!is_dir($dir)) @mkdir($dir, 0750, true);
    @file_put_contents(ia_indispo_fichier($quoi), (string) $jusqua, LOCK_EX);
}
// Les quotas journaliers Gemini repartent à minuit, heure du Pacifique.
function ia_minuit_pacifique(): int {
    try {
        return (new DateTime('tomorrow', new DateTimeZone('America/Los_Angeles')))->getTimestamp();
    } catch (Throwable $e) {
        return time() + 3600;
    }
}

/**
 * 🔐 v1.2.1 — Vérifie CÔTÉ SERVEUR si l'utilisateur a droit au modèle Élite (Anthropic).
 * Lit la base réelle (data/veritas_db.json) au lieu de croire le "plan" envoyé par le client.
 * Politique fail-safe : toute incertitude (fichier absent, structure inattendue, plan non
 * identifiable, abonnement expiré) renvoie false → on bascule sur Pollinations (gratuit).
 */
function server_user_is_elite(string $userId): bool {
    if ($userId === '') return false;
    $dbFile = __DIR__ . '/../data/veritas_db.json';
    if (!is_file($dbFile)) return false;
    try {
        $db = json_decode((string)file_get_contents($dbFile), true);
        if (!is_array($db)) return false;

        // Admin / super-admin → toujours autorisés
        foreach (($db['admins'] ?? []) as $a) {
            if (($a['id'] ?? null) === $userId || ($a['user'] ?? null) === $userId) return true;
        }
        if (($db['superAdmin']['user'] ?? null) === $userId) return true;

        // Identifier les plans "Élite" par leur libellé
        $elitePlanIds = [];
        foreach (($db['elearning']['plans'] ?? []) as $p) {
            $hay = strtolower(($p['nom'] ?? '') . ' ' . ($p['tier'] ?? '') . ' ' . ($p['niveau'] ?? ''));
            if (strpos($hay, 'elite') !== false || strpos($hay, 'élite') !== false) {
                if (isset($p['id'])) $elitePlanIds[] = $p['id'];
            }
        }
        if (!$elitePlanIds) return false; // aucun plan élite identifié → fail-safe

        // Abonnement actif, non expiré, sur un plan élite, pour ce compte
        $now = time();
        foreach (($db['elearning']['abonnements'] ?? []) as $abo) {
            if (($abo['accountId'] ?? null) !== $userId) continue;
            if (strtolower($abo['statut'] ?? '') !== 'actif') continue;
            $fin = !empty($abo['dateFin']) ? strtotime($abo['dateFin']) : 0;
            if ($fin && $fin < $now) continue; // expiré
            if (in_array(($abo['planId'] ?? null), $elitePlanIds, true)) return true;
        }
    } catch (Throwable $e) {
        return false;
    }
    return false;
}

// Tier serveur (anon|free|starter|pro|elite|teach|admin) calculé depuis l'abonnement
// RÉEL. Réplique de _aiTier() client : exclut les statuts expirés/annulés/en attente,
// reconnaît « Activé » (et non l'ancien test === 'actif'), retient le MEILLEUR tier.
function server_user_tier(string $userId): string {
    if ($userId === '') return 'anon';
    $dbFile = __DIR__ . '/../data/veritas_db.json';
    if (!is_file($dbFile)) return 'anon';
    try {
        $db = json_decode((string) file_get_contents($dbFile), true);
        if (!is_array($db)) return 'anon';
        foreach (($db['admins'] ?? []) as $a) {
            if (($a['id'] ?? null) === $userId || ($a['user'] ?? null) === $userId) return 'admin';
        }
        if (($db['superAdmin']['user'] ?? null) === $userId || ($db['superAdmin']['id'] ?? null) === $userId) return 'admin';
        foreach (($db['teachers'] ?? []) as $t) {
            if (($t['id'] ?? null) === $userId || ($t['user'] ?? null) === $userId) return 'teach';
        }
        $known = false;
        foreach (['studentAccounts', 'visitorAccounts'] as $coll) {
            foreach (($db[$coll] ?? []) as $acc) {
                if (($acc['id'] ?? null) === $userId || ($acc['user'] ?? null) === $userId) { $known = true; break 2; }
            }
        }
        $rank = ['free' => 0, 'starter' => 1, 'pro' => 2, 'elite' => 3];
        $best = -1; $bestT = 'free';
        $now = (int) round(microtime(true) * 1000);
        foreach (($db['elearning']['abonnements'] ?? []) as $abo) {
            if (!is_array($abo)) continue;
            if (($abo['accountId'] ?? null) !== $userId && ($abo['userId'] ?? null) !== $userId) continue;
            $st = strtolower((string) ($abo['statut'] ?? ''));
            if (in_array($st, ['expiré', 'expire', 'annulé', 'annule', 'en attente', 'suspendu'], true)) continue;
            $end = isset($abo['dateFinTs']) ? (int) $abo['dateFinTs'] : 0;
            if ($end && $end < $now) continue;
            $p = strtolower((string) ($abo['plan'] ?? $abo['planId'] ?? ''));
            // « famille » : chaque enfant couvert est au niveau Élite (formule du 13/09/2026).
            if (strpos($p, 'elite') !== false || strpos($p, 'famille') !== false || $p === 'plan4') $t = 'elite';
            elseif ($p === 'plan2' || strpos($p, 'starter') !== false) $t = 'starter';
            else $t = 'pro';
            if ($rank[$t] > $best) { $best = $rank[$t]; $bestT = $t; }
        }
        if ($best >= 0) return $bestT;
        return $known ? 'free' : 'anon';
    } catch (Throwable $e) {
        return 'anon';
    }
}

function get_pdo(): ?PDO {
    static $pdo = null;
    if ($pdo !== null) return $pdo === false ? null : $pdo;
    try {
        @include_once __DIR__ . '/config.php';
        if (!defined('DB_HOST')) { $pdo = false; return null; }
        $pdo = new PDO('mysql:host=' . DB_HOST . ';dbname=' . DB_NAME . ';charset=utf8mb4',
                       DB_USER, DB_PASS, [
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_EMULATE_PREPARES => false
        ]);
        return $pdo;
    } catch (Throwable $e) {
        $pdo = false;
        return null;
    }
}
