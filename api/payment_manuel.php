<?php
// ============================================================
// VÉRITAS — ENCAISSEMENT MANUEL : LA MÊME PORTE QUE LES PASSERELLES
// © 2024-2026 Jacques Miterand TAKOU (Mythe Errant). Tous droits réservés.
// ------------------------------------------------------------
// POURQUOI CE FICHIER EXISTE (20/09/2026)
//
// `vrt_grant_entitlement_to_file()` n'avait QUE quatre appelants :
// payment_camerpay.php, payment_campay.php, payment_mtn.php, payment_orange.php.
// C'est elle qui, sous le verrou de la base, ouvre l'accès, ÉMET LE CODE DE
// LIVRET, met la remise en file et la vide (`vrt_notify_vider`).
//
// Or un paiement validé à la main — l'administrateur voit l'argent arriver sur
// le compte marchand et clique « Valider & activer » — ne traversait AUCUN de
// ces quatre fichiers. Tout se passait dans le NAVIGATEUR de l'administrateur :
// l'accès était écrit dans la base locale, le reçu émis… mais côté serveur,
// rien. Donc AUCUN code de livret émis, AUCUNE remise mise en file, AUCUN pass
// envoyé. L'acheteur payait et attendait un message qui ne pouvait pas partir.
//
// Tant que la passerelle encaissait, personne ne pouvait le voir : les ventes
// passaient par elle. Le jour où le fournisseur se tait, c'est le SEUL chemin
// qui reste — et c'est celui qui ne délivrait rien.
//
// Ce fichier n'invente aucune logique d'octroi : il appelle exactement la même
// fonction, avec exactement la même forme d'état. Une seule porte, cinq
// chemins pour y arriver.
//
// ACTIONS
//   POST ?action=declarer  PUBLIC — l'acheteur dit « j'ai payé » ; la commande
//                          entre dans la file de l'administration. N'ACCORDE RIEN.
//   ── réservées à l'administration (Bearer API_SECRET) ──
//   POST ?action=grant     { ref [, intent, targetId, montant, …] }
//                          → ouvre l'accès, émet le code, vide la file de remise
//   GET  ?action=list      → commandes déclarées + octrois (réconciliation)
//   POST ?action=retry     { ref } → rejoue un octroi resté bloqué
//
// ⚠️ SEULE `declarer` est publique, et elle doit rester incapable d'ouvrir quoi
//    que ce soit. Ce fichier OUVRE DES ACCÈS sans qu'un sou ait transité par une
//    API : le seul à pouvoir affirmer « j'ai vu l'argent » est l'administrateur.
// ============================================================

// 🔐 API JSON stricte : les erreurs PHP vont au log, jamais dans la réponse.
@ini_set('display_errors', '0');

require_once __DIR__ . '/config_sync.php';   // CORS allowlist + API_SECRET + requireAuth()
require_once __DIR__ . '/_auth_lib.php';     // vrt_grant_entitlement_to_file()
require_once __DIR__ . '/_pay_funds_lib.php'; // cagLoad(), cagRecordContribution() — cagnottes

header('X-Content-Type-Options: nosniff');

// ⚠️ L'authentification est posée PLUS BAS, juste après l'action publique
// « declarer » — la seule qui n'accorde rien. Toutes les autres, y compris
// la lecture de la liste (noms et téléphones de clients), passent la porte.

$action = $_GET['action'] ?? 'grant';
$method = $_SERVER['REQUEST_METHOD'];

$dir = __DIR__ . '/data/payments_manuel/';
if (!is_dir($dir)) @mkdir($dir, 0750, true);

// Défense en profondeur : ces fichiers portent des données personnelles
// (nom, téléphone, achat). Le dossier naît à l'exécution — sans ces deux
// sentinelles il serait téléchargeable à des URL devinables.
if (!is_file($dir . '.htaccess')) {
    @file_put_contents($dir . '.htaccess',
        "Require all denied\n<IfModule !mod_authz_core.c>\nOrder allow,deny\nDeny from all\n</IfModule>\n");
}
if (!is_file($dir . 'index.php')) {
    @file_put_contents($dir . 'index.php', "<?php http_response_code(403); exit;\n");
}

$logFile = $dir . '_manuel_log.txt';

function pmOut($data, $code = 200) {
    http_response_code($code);
    echo json_encode($data, JSON_UNESCAPED_UNICODE);
    exit;
}

// Journal borné : même doctrine que les passerelles. Un log sans plafond finit
// par saturer le disque, et un disque plein arrête TOUS les paiements.
function pmLog($line) {
    global $logFile;
    if (@filesize($logFile) > 524288) {
        $keep = @file_get_contents($logFile, false, null, 262144);
        if ($keep !== false) @file_put_contents($logFile, "... [log tronqué] ...\n" . $keep, LOCK_EX);
    }
    @file_put_contents($logFile, date('c') . ' ' . $line . "\n", FILE_APPEND | LOCK_EX);
}

/* La référence devient un NOM DE FICHIER. Une ref du genre « ../../config »
   écrirait hors du dossier. On n'échappe pas : on refuse ce qui n'est pas une
   référence VÉRITAS (VT260920-A1B2, CART…, ELRN…, et le « #3 » des lignes de
   panier). Refuser est lisible ; nettoyer en silence ferait fusionner deux
   références distinctes sur un même fichier d'état. */
function pmRefSafe($ref) {
    $ref = (string) $ref;
    if ($ref === '' || strlen($ref) > 64) return '';
    if (!preg_match('/^[A-Za-z0-9._#-]+$/', $ref)) return '';
    if (strpos($ref, '..') !== false) return '';
    return str_replace('#', '_', $ref);
}

function pmPath($ref) {
    global $dir;
    return $dir . 'manuel_' . $ref . '.json';
}

function pmLire($path) {
    if (!is_file($path)) return [];
    $j = json_decode((string) @file_get_contents($path), true);
    return is_array($j) ? $j : [];
}

function pmEcrire($path, $state) {
    @file_put_contents($path, json_encode($state, JSON_UNESCAPED_UNICODE), LOCK_EX);
}

/* Construit l'état EXACTEMENT comme une passerelle le construirait.
   Tout écart ici se paierait en octrois refusés pour une raison incompréhensible
   (un champ absent, un nom de clé différent) — et un octroi refusé, c'est un
   client qui a payé et n'a rien. */
function pmEtat(array $in, array $prev) {
    $montant = max(0, (int) ($in['montant'] ?? 0));
    return [
        'ref'         => (string) ($in['ref'] ?? ''),
        'intent'      => (string) ($in['intent'] ?? ''),
        'targetId'    => (string) ($in['targetId'] ?? ''),
        'accountId'   => (string) ($in['accountId'] ?? ''),
        'montant'     => $montant,
        // `montant_paye` prime sur `montant` dans le contrôle de prix, et c'est
        // le détail du panier qui s'y appuie ligne par ligne.
        'montant_paye' => $montant,
        'clientNom'   => (string) ($in['clientNom'] ?? ''),
        'clientTel'   => (string) ($in['clientTel'] ?? ''),
        'clientEmail' => (string) ($in['clientEmail'] ?? ''),
        'label'       => (string) ($in['label'] ?? 'Paiement VÉRITAS'),
        'lignes'      => (isset($in['lignes']) && is_array($in['lignes'])) ? $in['lignes'] : null,
        // Le moyen réellement employé, pour le rapprochement comptable :
        // « momo », « orange », « especes », « virement »…
        'moyen'       => (string) ($in['moyen'] ?? ''),
        // Cagnotte : le petit mot du donateur, affiché avec sa contribution.
        'fundMessage' => substr(trim((string) ($in['fundMessage'] ?? '')), 0, 200),
        'status'      => 'paid',
        'provider'    => 'manuel',
        'mode'        => 'manuel',
        /* QUI a validé. Un octroi manuel n'a pas de preuve extérieure : la seule
           trace possible est le nom de la personne qui a affirmé avoir vu
           l'argent. Sans elle, un accès ouvert par erreur n'a pas d'auteur. */
        'valide_par'  => (string) ($in['validePar'] ?? ''),
        'created_at'  => (string) ($prev['created_at'] ?? date('c')),
        'declared_at' => (string) ($prev['declared_at'] ?? ''),
        /* Le parrainage ne vient QUE de la déclaration, où le SERVEUR l'a
           évalué — jamais du corps de la requête : une remise ou une commission
           n'est pas quelque chose qu'on déclare, c'est quelque chose qu'on vérifie. */
        'parrainage'  => (isset($prev['parrainage']) && is_array($prev['parrainage'])) ? $prev['parrainage'] : null,
        'paid_at'     => (string) ($prev['paid_at'] ?? date('c')),
    ];
}

/* L'octroi lui-même. Rendu identique à camerpayGrant() sur le point qui compte :
   le drapeau `granted` ne se pose QUE si quelque chose a réellement été ouvert.
   Le poser sur un « ok » qui ne dit que « la base était lisible » sortirait
   définitivement la transaction de toute reprise — argent encaissé, accès
   fermé, et plus personne derrière. */
function pmOctroyer(array $state, $path) {
    /* CAGNOTTE : ce n'est pas un droit qu'on ouvre, c'est une contribution
       qu'on inscrit — même aiguillage que camerpayGrant(). La traduire dans
       les trois issues de l'octroi (changed / deja / bloque) garde le reste
       du circuit identique : drapeau `granted`, liste, bouton Réessayer. */
    if (($state['intent'] ?? '') === 'cagnotte') {
        try { $r = cagRecordContribution($state); }
        catch (\Throwable $e) { $r = ['ok' => false, 'reason' => $e->getMessage()]; }
        $g = [
            'ok'      => true,
            'changed' => !empty($r['ok']) && empty($r['already']),
            'deja'    => !empty($r['already']),
            'bloque'  => empty($r['ok']),
            'msg'     => !empty($r['ok'])
                ? (!empty($r['already']) ? 'Contribution déjà inscrite' : 'Contribution inscrite sur la cagnotte')
                : ('Cagnotte : ' . ($r['reason'] ?? 'échec')),
        ];
    } else {
        $g = vrt_grant_entitlement_to_file($state);
    }

    $state['grant']    = $g;
    $state['grant_at'] = date('c');

    /* `a_regler` se calcule à CHAQUE passage, jamais par accumulation : un
       rejeu qui réussit doit pouvoir effacer le drapeau posé par l'échec
       précédent, sinon la liste garde éternellement des lignes rouges déjà
       réglées et l'administration cesse de la regarder.
       Il reste vrai dans un cas où l'octroi a pourtant réussi : l'achat sans
       identifiant de compte — la ligne est écrite, l'argent tracé, mais
       personne n'en est titulaire. */
    if (!empty($g['a_regler'])) $state['a_regler'] = true;
    else                        unset($state['a_regler']);

    if (empty($g['bloque'])) {
        $state['granted']    = true;
        $state['granted_at'] = date('c');
    } else {
        $state['a_regler']     = true;
        $state['grant_essais'] = (int) ($state['grant_essais'] ?? 0) + 1;
    }

    pmEcrire($path, $state);
    pmLog('[OCTROI] ref=' . $state['ref'] . ' intent=' . $state['intent']
        . ' montant=' . $state['montant']
        . ' changed=' . (!empty($g['changed']) ? '1' : '0')
        . ' bloque=' . (!empty($g['bloque']) ? '1' : '0')
        . ' msg=' . substr((string) ($g['msg'] ?? ''), 0, 180));

    return [$state, $g];
}

// ════════════════════════════════════════════════════════════
// DECLARER — PUBLIC : « j'ai payé sur le code marchand »
// ════════════════════════════════════════════════════════════
// L'acheteur a payé depuis son téléphone ; aucune API ne nous le dit. Avant,
// il n'avait qu'un lien WhatsApp, et sa commande n'existait NULLE PART côté
// serveur : l'administration devait tout ressaisir à la main, et rien ne
// reliait le code qu'elle émettait à l'écran où l'acheteur l'attendait.
//
// La déclaration pose la commande dans la file de l'administration, avec
// exactement ce que l'octroi demandera (intent, cible, montant, téléphone).
// Elle N'ACCORDE RIEN : seul `grant`, derrière le secret, ouvre un accès, et
// seulement après que l'administration a vu l'argent sur son téléphone.
// Ses barrières sont donc celles d'un formulaire public : origine, débit par
// adresse, plafond journalier, forme stricte des champs.
function pmIpCle() {
    return substr(hash('sha256', 'vrt-pm|' . ($_SERVER['REMOTE_ADDR'] ?? '')), 0, 16);
}
function pmCompteur($fichier, $max) {
    // Lecture-écriture SOUS VERROU : une rafale parallèle lirait sinon toutes
    // la même valeur et franchirait le plafond N fois.
    $fp = @fopen($fichier, 'c+');
    if (!$fp) return true;                 // pas de compteur : on ne bloque pas un acheteur
    @flock($fp, LOCK_EX);
    $n = (int) stream_get_contents($fp);
    if ($n >= $max) { @flock($fp, LOCK_UN); fclose($fp); return false; }
    ftruncate($fp, 0); rewind($fp); fwrite($fp, (string) ($n + 1));
    @flock($fp, LOCK_UN); fclose($fp);
    return true;
}

if ($action === 'declarer' && $method === 'POST') {
    $origine = $_SERVER['HTTP_ORIGIN'] ?? '';
    $permises = ['https://veritas-school.com', 'https://www.veritas-school.com',
                 'http://localhost:8000', 'http://localhost:8077', 'https://localhost', 'capacitor://localhost'];
    if ($origine !== '' && !in_array($origine, $permises, true)) pmOut(['error' => 'Origine refusée.'], 403);

    $in = json_decode((string) file_get_contents('php://input'), true) ?: [];
    $ref    = trim((string) ($in['ref'] ?? ''));
    $intent = trim((string) ($in['intent'] ?? ''));
    $mont   = (int) ($in['montant'] ?? 0);
    $telNu  = preg_replace('/\D+/', '', (string) ($in['clientTel'] ?? ''));
    if (strlen($telNu) === 12 && strpos($telNu, '237') === 0) $telNu = substr($telNu, 3);

    if (!preg_match('/^[A-Za-z0-9._-]{4,48}$/', $ref))  pmOut(['error' => 'Référence invalide.'], 400);
    if (!preg_match('/^[a-z_]{2,30}$/', $intent))       pmOut(['error' => 'Achat non reconnu.'], 400);
    if ($mont <= 0 || $mont > 500000)                   pmOut(['error' => 'Montant invalide.'], 400);
    /* Le numéro est OBLIGATOIRE, et pas pour la forme : c'est avec ses quatre
       derniers chiffres que l'acheteur retire son code (livret.php « claim »),
       et c'est lui que l'administration compare à l'expéditeur du dépôt reçu. */
    if (!preg_match('/^6\d{8}$/', $telNu))             pmOut(['error' => 'Numéro de téléphone invalide (9 chiffres, commence par 6).'], 400);

    $rl = $dir . '_rl/';
    if (!is_dir($rl)) @mkdir($rl, 0750, true);
    if (!pmCompteur($rl . 'ip_' . pmIpCle() . '_' . date('YmdH') . '.txt', 10))
        pmOut(['error' => 'Trop de déclarations depuis cette connexion. Réessayez dans une heure.'], 429);
    if (!pmCompteur($rl . '_jour_' . date('Ymd') . '.txt', 400))
        pmOut(['error' => 'Service momentanément saturé. Écrivez-nous sur WhatsApp.'], 429);
    // Ménage : les compteurs d'heure n'ont plus d'usage le lendemain.
    if (mt_rand(1, 50) === 1) {
        foreach (glob($rl . 'ip_*.txt') ?: [] as $v) { if (filemtime($v) < time() - 7200) @unlink($v); }
    }

    $path = pmPath(pmRefSafe($ref));
    $prev = pmLire($path);
    if (!empty($prev['granted'])) {
        pmOut(['ok' => true, 'deja' => true, 'msg' => 'Ce paiement est déjà validé : ton accès est ouvert.']);
    }
    if ($prev) {
        // Redéclarer (double clic, page rechargée) ne réécrit rien : la
        // première déclaration fait foi, sinon un tiers qui connaîtrait la
        // référence pourrait en changer le numéro de retrait.
        pmOut(['ok' => true, 'declare' => true, 'ref' => $ref]);
    }

    $cible = substr((string) ($in['targetId'] ?? ''), 0, 80);

    // Une contribution à une cagnotte inexistante ou close serait encaissée
    // puis impossible à inscrire : on refuse AVANT que le donateur ne paie.
    if ($intent === 'cagnotte') {
        $fund = cagLoad($cible);
        if (!$fund) pmOut(['error' => 'Cette cagnotte est introuvable.'], 404);
        if (($fund['statut'] ?? 'ouverte') !== 'ouverte') pmOut(['error' => 'Cette cagnotte est close : elle ne reçoit plus de contributions.'], 409);
    }

    /* ── CODE AMI + PRIX, VÉRIFIÉS AVANT QUE L'ACHETEUR NE PAIE ─────────────
       Même évaluation, mot pour mot, que l'initiation de payment_camerpay.php.
       Sans elle, le filleul qui voit « 1 350 F » paierait 1 350 F — et
       l'octroi, qui ne tolère une remise QUE si le code a été validé côté
       serveur, refuserait ce paiement pour sous-paiement APRÈS l'encaissement.
       La commande est donc enregistrée avec le montant exact que l'acheteur
       doit envoyer, et le parrainage figé dans l'état (il sera crédité à
       l'octroi, idempotent par référence). La clé `code` n'est évaluée que si
       le tunnel l'envoie — c'est-à-dire s'il AFFICHE la remise. */
    $parrainageEtat = null;
    $dbD = function_exists('vrt_load_db') ? vrt_load_db() : null;
    if (is_array($dbD)) {
        $prixRef = function_exists('vrt_prix_catalogue') ? vrt_prix_catalogue($dbD, $intent, $cible) : null;
        if (function_exists('vrt_parr_evaluer') && array_key_exists('code', $in)) {
            try {
                $ev = vrt_parr_evaluer($dbD, vrt_parr_lire(), [
                    'code' => substr(trim((string) $in['code']), 0, 32),
                    'accountId' => substr((string) ($in['accountId'] ?? ''), 0, 60), 'tel' => '237' . $telNu,
                    'intent' => $intent, 'targetId' => $cible,
                    'prix' => ($prixRef !== null && $prixRef > 0) ? $prixRef : $mont,
                    'panierPhysique' => false,
                ]);
                $parrainageEtat = vrt_parr_pour_etat($ev);
            } catch (\Throwable $e) {
                pmLog('[CODE_AMI_ERR] ref=' . $ref . ' ' . $e->getMessage());
            }
        }
        if (function_exists('vrt_verifier_prix')) {
            $pv = vrt_verifier_prix($dbD, ['intent' => $intent, 'targetId' => $cible,
                                           'montant' => $mont, 'parrainage' => $parrainageEtat]);
            if (!$pv['ok']) {
                pmLog('[PRIX_REFUSE_DECLARE] ref=' . $ref . ' intent=' . $intent . ' montant=' . $mont
                    . ' attendu=' . $pv['attendu'] . ' plancher=' . $pv['plancher']);
                pmOut([
                    'error' => ($pv['attendu'] === null)
                        ? 'Cet article n’est plus proposé. Actualisez la page.'
                        : 'Le montant ne correspond plus au tarif (' . number_format((int) $pv['plancher'], 0, ',', ' ')
                          . ' FCFA). Actualisez la page puis réessayez — ne payez pas ce montant-ci.',
                    'code' => 'PRIX_INCOHERENT', 'attendu' => $pv['attendu'], 'plancher' => $pv['plancher'],
                ], 409);
            }
        }
    }

    $etat = pmEtat([
        'ref' => $ref, 'intent' => $intent,
        'targetId'    => $cible,
        'accountId'   => substr((string) ($in['accountId'] ?? ''), 0, 60),
        'montant'     => $mont,
        'clientNom'   => substr(trim((string) ($in['clientNom'] ?? '')), 0, 80),
        'clientTel'   => $telNu,
        'clientEmail' => substr(trim((string) ($in['clientEmail'] ?? '')), 0, 120),
        'label'       => substr(trim((string) ($in['label'] ?? '')), 0, 140),
        'lignes'      => (isset($in['lignes']) && is_array($in['lignes'])) ? array_slice($in['lignes'], 0, 30) : null,
        'moyen'       => in_array(($in['moyen'] ?? ''), ['momo', 'orange'], true) ? $in['moyen'] : '',
        'fundMessage' => (string) ($in['fundMessage'] ?? ''),
    ], []);
    // Une déclaration n'est PAS un paiement : l'état le dit en clair, pour
    // qu'aucune relecture ne la prenne pour un encaissement confirmé.
    $etat['status']      = 'declare';
    $etat['declared_at'] = date('c');
    $etat['parrainage']  = $parrainageEtat;
    unset($etat['paid_at']);
    pmEcrire($path, $etat);
    pmLog('[DECLARE] ref=' . $ref . ' intent=' . $intent . ' montant=' . $mont . ' tel=…' . substr($telNu, -4)
        . ($parrainageEtat ? ' code_ami=1' : ''));

    pmOut(['ok' => true, 'declare' => true, 'ref' => $ref, 'montant' => $mont]);
}

// ── Tout ce qui suit est réservé à l'administration ─────────────────────────
requireAuth();

// ════════════════════════════════════════════════════════════
// GRANT — un paiement encaissé hors ligne ouvre l'accès
// ════════════════════════════════════════════════════════════
if ($action === 'grant' && $method === 'POST') {
    $in = json_decode((string) file_get_contents('php://input'), true) ?: [];
    /* Deux formes de la même référence, et il ne faut pas les confondre :
       `$refBrut` est celle que porte le paiement (elle peut contenir « # » pour
       une ligne de panier, et c'est elle qui sert de clé d'idempotence dans la
       base) ; `$refFic` est celle qui devient un nom de fichier. Écrire la
       seconde dans l'état ferait diverger la clé du registre de celle des
       passerelles, et un même achat pourrait être accordé deux fois. */
    $refBrut = trim((string) ($in['ref'] ?? ''));
    $refFic  = pmRefSafe($refBrut);
    if ($refFic === '')                    pmOut(['error' => 'Référence absente ou invalide.'], 400);

    $path = pmPath($refFic);
    $prev = pmLire($path);

    /* IDEMPOTENT — ET EN PREMIER. L'administrateur re-clique, la fenêtre se
       rouvre, la synchro rejoue : rien de tout cela ne doit émettre un second
       code ni recréditer un parrain. Ce contrôle passait APRÈS la vérification
       des champs ; une commande déjà validée, re-cliquée avec sa seule
       référence, répondait donc « intent requis » au lieu de « déjà validé »
       (trouvé par le banc le 22/09). Le fichier d'état tranche avant tout. */
    if (!empty($prev['granted'])) {
        pmOut(['ok' => true, 'deja' => true, 'changed' => false,
               'msg'      => 'Déjà accordé le ' . ($prev['granted_at'] ?? '?'),
               'a_regler' => !empty($prev['a_regler']),
               'remise'   => ($prev['grant']['remise'] ?? null)]);
    }

    /* Une commande DÉCLARÉE par l'acheteur se valide avec sa seule référence :
       l'administration n'a rien à ressaisir, donc rien à mal ressaisir. Ce que
       le corps de la requête précise (validation depuis l'application, qui
       connaît déjà la tentative) l'emporte champ par champ.
       Vrai pour TOUTE commande pas encore accordée, pas seulement au statut
       « declare » : un premier essai BLOQUÉ (compte introuvable…) fait passer
       l'état à « paid » sans rien ouvrir, et un second essai par la seule
       référence doit encore retrouver l'intent, la cible et le montant. */
    if ($prev) {
        foreach (['intent', 'targetId', 'accountId', 'montant', 'clientNom', 'clientTel',
                  'clientEmail', 'label', 'lignes', 'moyen', 'fundMessage'] as $k) {
            if (!isset($in[$k]) || $in[$k] === '' || $in[$k] === null) $in[$k] = $prev[$k] ?? null;
        }
    }
    if (trim((string) ($in['intent'] ?? '')) === '') pmOut(['error' => 'intent requis'], 400);
    if ((int) ($in['montant'] ?? 0) <= 0)  pmOut(['error' => 'montant requis'], 400);

    list($state, $g) = pmOctroyer(pmEtat(array_merge($in, ['ref' => $refBrut]), $prev), $path);

    pmOut([
        'ok'        => true,
        'changed'   => !empty($g['changed']),
        'deja'      => !empty($g['deja']),
        'bloque'    => !empty($g['bloque']),
        'a_regler'  => !empty($state['a_regler']),
        'underpaid' => !empty($g['underpaid']),
        'msg'       => (string) ($g['msg'] ?? ''),
        // Ce que la remise automatique a pu faire : combien de messages tentés,
        // combien partis, combien restent en file. Un « envoyes:0 » avec des
        // « restants » dit à l'administration qu'elle doit envoyer le code
        // elle-même — au lieu de le lui laisser découvrir par une réclamation.
        'remise'    => ($g['remise'] ?? null),
    ]);
}

// ════════════════════════════════════════════════════════════
// RETRY — rejouer un octroi resté bloqué (compte créé après coup, etc.)
// ════════════════════════════════════════════════════════════
if ($action === 'retry' && $method === 'POST') {
    $in     = json_decode((string) file_get_contents('php://input'), true) ?: [];
    $refFic = pmRefSafe(trim((string) ($in['ref'] ?? '')));
    if ($refFic === '') pmOut(['error' => 'Référence absente ou invalide.'], 400);

    $path = pmPath($refFic);
    $prev = pmLire($path);
    if (!$prev) pmOut(['error' => 'Aucun octroi manuel pour cette référence.'], 404);
    if (!empty($prev['granted'])) {
        pmOut(['ok' => true, 'deja' => true, 'changed' => false,
               'msg' => 'Déjà accordé le ' . ($prev['granted_at'] ?? '?')]);
    }
    if ((int) ($prev['grant_essais'] ?? 0) >= 5) {
        /* Chaque tentative réécrit une sauvegarde complète de la base. Au-delà
           de cinq, ce n'est plus une reprise, c'est une meule : on rend la main
           à l'humain plutôt que de faire tourner le disque pour rien. */
        pmOut(['ok' => false, 'bloque' => true, 'a_regler' => true,
               'msg' => 'Cinq tentatives sans succès : cet octroi demande une décision manuelle ('
                      . substr((string) ($prev['grant']['msg'] ?? ''), 0, 180) . ').'], 409);
    }

    // On rejoue à partir de l'état ENREGISTRÉ, pas d'un corps de requête : le
    // montant et la cible d'origine font foi, sinon un rejeu pourrait ouvrir
    // autre chose que ce qui a été payé.
    $etat = $prev;
    unset($etat['grant'], $etat['grant_at'], $etat['a_regler']);
    list($state, $g) = pmOctroyer($etat, $path);

    pmOut(['ok' => true, 'changed' => !empty($g['changed']), 'bloque' => !empty($g['bloque']),
           'a_regler' => !empty($state['a_regler']), 'msg' => (string) ($g['msg'] ?? ''),
           'remise' => ($g['remise'] ?? null)]);
}

// ════════════════════════════════════════════════════════════
// LIST — réconciliation : ce qui est passé, ce qui est resté en travers
// ════════════════════════════════════════════════════════════
if ($action === 'list' && ($method === 'GET' || $method === 'POST')) {
    $fichiers = glob($dir . 'manuel_*.json') ?: [];
    // Les plus récents d'abord, et un plafond : cette réponse traverse le
    // réseau à chaque ouverture du tableau de bord.
    usort($fichiers, function ($a, $b) { return filemtime($b) <=> filemtime($a); });
    $fichiers = array_slice($fichiers, 0, 200);

    $out = []; $bloques = 0; $enAttente = 0;
    foreach ($fichiers as $f) {
        $s = pmLire($f);
        if (!$s) continue;
        if (!empty($s['a_regler']) && empty($s['granted'])) $bloques++;
        // « En attente » = tout ce qui n'est pas ACCORDÉ : une commande dont le
        // premier essai a été bloqué reste à traiter, elle ne doit pas sortir
        // de la file parce que son statut est passé à « paid ».
        if (empty($s['granted'])) $enAttente++;
        $out[] = [
            'ref'        => (string) ($s['ref'] ?? ''),
            'intent'     => (string) ($s['intent'] ?? ''),
            'targetId'   => (string) ($s['targetId'] ?? ''),
            'montant'    => (int) ($s['montant'] ?? 0),
            'label'      => (string) ($s['label'] ?? ''),
            'moyen'      => (string) ($s['moyen'] ?? ''),
            'clientNom'  => (string) ($s['clientNom'] ?? ''),
            'clientTel'  => (string) ($s['clientTel'] ?? ''),
            'validePar'  => (string) ($s['valide_par'] ?? ''),
            'granted'    => !empty($s['granted']),
            'grantedAt'  => (string) ($s['granted_at'] ?? ''),
            'aRegler'    => !empty($s['a_regler']),
            'essais'     => (int) ($s['grant_essais'] ?? 0),
            'msg'        => substr((string) ($s['grant']['msg'] ?? ''), 0, 200),
            'paidAt'     => (string) ($s['paid_at'] ?? ''),
            // « declare » = l'acheteur dit avoir payé ; RIEN n'est ouvert tant
            // que l'administration n'a pas vu l'argent et validé.
            'status'     => (string) ($s['status'] ?? ''),
            'declaredAt' => (string) ($s['declared_at'] ?? ''),
        ];
    }
    pmOut(['ok' => true, 'total' => count($out), 'bloques' => $bloques, 'enAttente' => $enAttente, 'items' => $out]);
}

pmOut(['error' => 'Action inconnue : ' . $action], 400);
