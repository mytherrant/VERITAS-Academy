<?php
// ============================================================
// VÉRITAS — RAPPROCHEMENT AUTOMATIQUE PAR LE SMS DE RÉCEPTION
// © 2024-2026 Jacques Miterand TAKOU (Mythe Errant). Tous droits réservés.
// ------------------------------------------------------------
// POURQUOI (26/09/2026)
//
// Depuis la coupure de CamerPay, un livret ou un manuel payé sur le code
// marchand n'était servi qu'après qu'un HUMAIN avait vu l'argent sur le
// téléphone et cliqué « Valider » (payment_manuel.php « grant »). La nuit, le
// dimanche, en déplacement : l'acheteur attendait son code des heures.
//
// Aucune API opérateur n'est active (MTN et Orange demandent contrat et KYC).
// La seule preuve disponible est celle que l'administrateur lit lui-même : le
// SMS de réception que l'opérateur envoie au téléphone marchand. Une
// application de relais installée sur CE téléphone le pousse ici
// (payment_sms.php) ; ce fichier le lit, le rapproche de la commande déclarée
// et appelle la MÊME porte d'octroi que la validation humaine (pmOctroyer).
//
// UN SMS SE FALSIFIE. Qui connaît le numéro du téléphone marchand peut lui
// écrire « Vous avez reçu 1 500 FCFA » avec un expéditeur maquillé. Un code
// n'est donc émis automatiquement que si TOUTES ces conditions tiennent :
//   ① le relais connaît la clé secrète (SMS_WEBHOOK_SECRET) ;
//   ② l'expéditeur est l'opérateur (SMS_EXPEDITEURS) ;
//   ③ LA CHAÎNE DES SOLDES : le « nouveau solde » du SMS vaut EXACTEMENT
//      l'ancien solde + le montant reçu (− les frais annoncés). Un fraudeur
//      ne connaît pas le solde du compte marchand. Au moindre écart, la
//      chaîne est ROMPUE : plus rien n'est automatique pour cet opérateur
//      tant que l'administration ne l'a pas ré-ancrée, et elle est alertée.
//      Un faux SMS ne peut JAMAIS ré-ancrer la chaîne — seul l'humain le peut ;
//   ④ l'ID de transaction n'a jamais servi ;
//   ⑤ UNE commande en attente correspond : même montant, et même ID de
//      transaction (déclaré par l'acheteur) ou même numéro payeur ;
//   ⑥ le montant ne dépasse pas SMS_AUTO_MAX, et l'achat est d'un type
//      autorisé (SMS_AUTO_INTENTS : livrets et manuels).
// Tout ce qui échoue à une condition reste dans la file humaine, inchangé.
// ============================================================

if (defined('VRT_RAPPROCHEMENT_LIB')) return;
define('VRT_RAPPROCHEMENT_LIB', '1.0');

require_once __DIR__ . '/_manuel_lib.php';

// ── Réglages (surchargeables dans payment_config.php) ───────────────────────
if (!defined('SMS_WEBHOOK_SECRET'))  define('SMS_WEBHOOK_SECRET', '');     // vide = rapprochement ÉTEINT
if (!defined('SMS_AUTO_MAX'))        define('SMS_AUTO_MAX', 25000);        // FCFA : au-delà, validation humaine
if (!defined('SMS_AUTO_INTENTS'))    define('SMS_AUTO_INTENTS', 'livret,livret_pack,digitalbook,book');
if (!defined('SMS_EXPEDITEURS'))     define('SMS_EXPEDITEURS', 'MobileMoney,MoMo,MTN,OrangeMoney,Orange Money,Orange');
if (!defined('SMS_FENETRE_H'))       define('SMS_FENETRE_H', 72);          // écart max. déclaration ↔ paiement
if (!defined('SMS_TOLERANCE_SOLDE')) define('SMS_TOLERANCE_SOLDE', 0);     // FCFA

function vrt_sms_actif(): bool {
    $s = (string) SMS_WEBHOOK_SECRET;
    return strlen($s) >= 24 && stripos($s, 'REMPLIR') === false;
}

function vrt_sms_dir(): string {
    $d = vrt_pm_dir() . '_sms/';
    if (!is_dir($d)) @mkdir($d, 0750, true);
    return $d;
}

function vrt_sms_log(string $l): void { pmLog('[SMS] ' . $l); }

// ════════════════════════════════════════════════════════════
// LECTURE DU SMS
// ════════════════════════════════════════════════════════════
function vrt_sms_plat(string $s): string {
    $s = str_replace(["\u{00A0}", "\u{202F}", "\r", "\n", "\t"], ' ', $s);
    $t = @iconv('UTF-8', 'ASCII//TRANSLIT//IGNORE', $s);
    if (!is_string($t) || $t === '') $t = $s;
    return strtolower(preg_replace('/\s+/', ' ', $t));
}

function vrt_sms_nombre(string $brut): int {
    // « 12 500 », « 12.500 », « 12,500 », « 12500.00 » → 12500
    $b = preg_replace('/[.,](\d{1,2})$/', '', trim($brut));
    return (int) preg_replace('/\D+/', '', (string) $b);
}

/**
 * Lit un SMS d'opérateur. Rend null si ce n'est pas un SMS d'argent.
 * Tolérant sur la forme (les libellés MTN et Orange changent), strict sur le
 * sens : un doute sur le sens → « inconnu », et « inconnu » n'accorde rien.
 */
function vrt_sms_analyser(string $texte, string $expediteur = ''): ?array {
    $p = vrt_sms_plat($texte);
    $e = vrt_sms_plat($expediteur);
    if ($p === '') return null;

    $op = '';
    if (strpos($e, 'orange') !== false || preg_match('/\borange money\b|\bom\b/', $p)) $op = 'orange';
    elseif (preg_match('/mtn|momo|mobile ?money/', $e . ' ' . $p))                   $op = 'mtn';

    // ── Montants : on classe chacun d'après les mots qui le précèdent ──
    $montant = null; $solde = null; $frais = 0;
    if (preg_match_all('/(\d{1,3}(?:[ .,]\d{3})+|\d+)(?:[.,]\d{1,2})?\s*(?:fcfa|f ?cfa|xaf|cfa|f)\b/', $p, $m, PREG_OFFSET_CAPTURE)) {
        foreach ($m[1] as $i => $cap) {
            $avant = substr($p, max(0, $cap[1] - 32), min(32, $cap[1]));
            // La partie ENTIÈRE seule : « 1 500,00 FCFA » lu en bloc donnerait 150 000.
            $val = vrt_sms_nombre($cap[0]);
            if (preg_match('/(solde|balance)[^0-9]*$/', $avant))            { if ($solde === null) $solde = $val; continue; }
            if (preg_match('/(frais|fee|fees|commission|taxe)[^0-9]*$/', $avant)) { $frais += $val; continue; }
            if ($montant === null) $montant = $val;
        }
    }
    if ($montant === null || $montant <= 0) return null;

    // ── Sens : entrant / sortant ; dans le doute, inconnu ──
    $entrant = (bool) preg_match('/(vous avez recu|avez recu|paiement recu|transfert recu|depot recu|you have received|received|recu de|recu du|credite|credited|paiement de .* recu)/', $p);
    $sortant = (bool) preg_match('/(vous avez envoye|avez envoye|you have sent|retrait|withdraw|vous avez paye|paiement effectue|payment of .* to|transfert de .* (vers|a) )/', $p);
    $sens = ($entrant && !$sortant) ? 'entrant' : (($sortant && !$entrant) ? 'sortant' : 'inconnu');

    // ── Numéro du payeur (9 chiffres commençant par 6) ──
    $tel = '';
    if (preg_match('/(?<!\d)(?:\+?237[ .]?)?(6\d{8})(?!\d)/', $p, $t)) $tel = $t[1];

    // ── ID de transaction : il doit contenir au moins un chiffre ──
    $txid = '';
    if (preg_match_all('/(?:financial transaction id|transaction id|id(?: de(?: la)?)? transaction|trans(?:action)?\.? ?id|txn ?id|n[o°]? ?(?:de )?transaction|reference|ref)\s*[:#=.]?\s*([a-z0-9][a-z0-9.\-]{5,40})/', $p, $tx)) {
        foreach ($tx[1] as $c) { if (preg_match('/\d/', $c)) { $txid = strtoupper(rtrim($c, '.-')); break; } }
    }

    return ['operateur' => $op, 'sens' => $sens, 'montant' => (int) $montant, 'solde' => $solde,
            'frais' => (int) $frais, 'tel' => $tel, 'txid' => $txid];
}

function vrt_sms_expediteur_admis(string $expediteur): bool {
    $e = vrt_sms_plat($expediteur);
    if ($e === '') return false;
    foreach (explode(',', (string) SMS_EXPEDITEURS) as $a) {
        $a = vrt_sms_plat(trim($a));
        if ($a !== '' && strpos(str_replace(' ', '', $e), str_replace(' ', '', $a)) !== false) return true;
    }
    return false;
}

// ════════════════════════════════════════════════════════════
// LA CHAÎNE DES SOLDES — la preuve qu'un SMS n'est pas inventé
// ════════════════════════════════════════════════════════════
function vrt_sms_chaine_fichier(string $op): string { return vrt_sms_dir() . 'chaine_' . preg_replace('/[^a-z]/', '', $op) . '.json'; }

function vrt_sms_chaine_lire(string $op): array {
    $j = json_decode((string) @file_get_contents(vrt_sms_chaine_fichier($op)), true);
    return is_array($j) ? $j : ['solde' => null, 'rompue' => false];
}

function vrt_sms_chaine_ecrire(string $op, array $c): void {
    $c['maj'] = date('c');
    @file_put_contents(vrt_sms_chaine_fichier($op), json_encode($c, JSON_UNESCAPED_UNICODE), LOCK_EX);
}

/** L'administration ancre la chaîne sur le solde qu'elle LIT sur le téléphone. */
function vrt_sms_ancrer(string $op, int $solde, string $par = ''): array {
    if (!in_array($op, ['mtn', 'orange'], true) || $solde < 0) return ['ok' => false, 'msg' => 'opérateur ou solde invalide'];
    $c = ['solde' => $solde, 'rompue' => false, 'motif' => '', 'ancre_par' => $par, 'ancre_at' => date('c')];
    vrt_sms_chaine_ecrire($op, $c);
    vrt_sms_log('[ANCRE] op=' . $op . ' solde=' . $solde . ' par=' . $par);
    return ['ok' => true, 'chaine' => $c];
}

/** Vérifie le SMS contre la chaîne et la fait avancer. Appelée SOUS le verrou global. */
function vrt_sms_chaine_verifier(array $a): array {
    $op = (string) $a['operateur'];
    if ($op === '')            return ['ok' => false, 'motif' => 'opérateur non reconnu'];
    if ($a['solde'] === null)  return ['ok' => false, 'motif' => 'SMS sans nouveau solde : non vérifiable'];
    $c = vrt_sms_chaine_lire($op);
    if ($c['solde'] === null)  return ['ok' => false, 'motif' => 'chaîne ' . $op . ' jamais ancrée'];
    if (!empty($c['rompue']))  return ['ok' => false, 'motif' => 'chaîne ' . $op . ' rompue : ' . ($c['motif'] ?? '')];

    $dernier = (int) $c['solde'];
    if ($a['sens'] === 'entrant')      $attendu = $dernier + $a['montant'] - $a['frais'];
    elseif ($a['sens'] === 'sortant')  $attendu = $dernier - $a['montant'] - $a['frais'];
    else                               $attendu = $dernier;

    if (abs((int) $a['solde'] - $attendu) <= (int) SMS_TOLERANCE_SOLDE) {
        $c['solde'] = (int) $a['solde'];
        vrt_sms_chaine_ecrire($op, $c);
        return ['ok' => true];
    }
    /* ÉCART : on ne suit PAS le solde du SMS (un faux SMS pourrait sinon
       ré-ancrer la chaîne sur un chiffre qu'il connaît, puis enchaîner un
       second faux « cohérent »). On gèle, et on prévient. */
    $motif = 'solde annoncé ' . $a['solde'] . ' F, attendu ' . $attendu . ' F (' . $a['sens'] . ' ' . $a['montant'] . ' F)';
    $c['rompue'] = true; $c['motif'] = $motif; $c['rompue_at'] = date('c');
    vrt_sms_chaine_ecrire($op, $c);
    vrt_sms_alerte('Rapprochement ' . strtoupper($op) . ' suspendu',
        "La chaîne des soldes est rompue : $motif.\n\nPlus aucun paiement " . strtoupper($op)
        . " n'est validé automatiquement. Vérifiez le solde sur le téléphone marchand, puis ré-ancrez-le"
        . " dans l'administration (Paiements → Rapprochement SMS). Les commandes restent dans la file de validation.");
    return ['ok' => false, 'motif' => 'chaîne rompue : ' . $motif];
}

// ════════════════════════════════════════════════════════════
// RAPPROCHEMENT
// ════════════════════════════════════════════════════════════
function vrt_sms_intents(): array {
    return array_values(array_filter(array_map('trim', explode(',', (string) SMS_AUTO_INTENTS))));
}

function vrt_sms_fichier(string $id): string { return vrt_sms_dir() . 'sms_' . $id . '.json'; }

function vrt_sms_lire(string $id): array {
    $j = json_decode((string) @file_get_contents(vrt_sms_fichier($id)), true);
    return is_array($j) ? $j : [];
}

function vrt_sms_ecrire(array $s): void {
    @file_put_contents(vrt_sms_fichier($s['id']), json_encode($s, JSON_UNESCAPED_UNICODE), LOCK_EX);
}

/** Verrou global : deux SMS simultanés ne doivent ni croiser la chaîne ni servir la même commande. */
function vrt_sms_verrou() {
    $fp = @fopen(vrt_sms_dir() . '.verrou', 'c');
    if ($fp) @flock($fp, LOCK_EX);
    return $fp;
}
function vrt_sms_liberer($fp): void { if ($fp) { @flock($fp, LOCK_UN); @fclose($fp); } }

/** Cette commande est-elle payable par CE SMS ? 2 = par ID de transaction, 1 = par numéro, 0 = non. */
function vrt_sms_accord(array $cmd, array $sms): int {
    if (!empty($cmd['granted'])) return 0;
    if (!in_array((string) ($cmd['intent'] ?? ''), vrt_sms_intents(), true)) return 0;
    if ((int) ($cmd['montant'] ?? 0) !== (int) $sms['montant']) return 0;
    if ((int) $sms['montant'] > (int) SMS_AUTO_MAX) return 0;
    $moyen = (string) ($cmd['moyen'] ?? '');
    $opMoyen = ['momo' => 'mtn', 'orange' => 'orange'];
    if ($moyen !== '' && isset($opMoyen[$moyen]) && $opMoyen[$moyen] !== $sms['operateur']) return 0;
    // Fenêtre : la commande est déclarée au plus SMS_FENETRE_H heures avant ou après le paiement.
    $tD = strtotime((string) ($cmd['declared_at'] ?? '')) ?: 0;
    $tS = strtotime((string) ($sms['recu_at'] ?? '')) ?: time();
    if (!$tD || abs($tS - $tD) > (int) SMS_FENETRE_H * 3600) return 0;
    if ($sms['txid'] !== '' && strtoupper((string) ($cmd['txid'] ?? '')) === $sms['txid']) return 2;
    if ($sms['tel'] !== '' && (string) ($cmd['clientTel'] ?? '') === $sms['tel']) return 1;
    return 0;
}

/** Accorde la commande au nom du SMS. Même porte que la validation humaine. */
function vrt_sms_accorder(string $path, array $cmd, array &$sms): array {
    $cmd['sms'] = ['id' => $sms['id'], 'operateur' => $sms['operateur'], 'txid' => $sms['txid']];
    $state = pmEtat(array_merge($cmd, ['validePar' => 'auto:sms:' . $sms['operateur'] . ':' . $sms['txid']]), $cmd);
    $state['sms'] = $cmd['sms'];
    list($state, $g) = pmOctroyer($state, $path);
    $sms['statut'] = empty($g['bloque']) ? 'rapproche' : 'octroi_bloque';
    $sms['ref'] = (string) ($state['ref'] ?? '');
    $sms['rapproche_at'] = date('c');
    vrt_sms_ecrire($sms);
    vrt_sms_log('[AUTO] ref=' . $sms['ref'] . ' op=' . $sms['operateur'] . ' tx=' . $sms['txid']
        . ' montant=' . $sms['montant'] . ' bloque=' . (!empty($g['bloque']) ? '1' : '0'));
    return ['ok' => empty($g['bloque']), 'ref' => $sms['ref'], 'grant' => $g];
}

/**
 * Point d'entrée du relais : un SMS arrive du téléphone marchand.
 * Rend toujours un tableau ; `auto` dit si une commande a été servie.
 */
function vrt_sms_traiter(string $texte, string $expediteur, ?string $recuAt = null): array {
    $texte = substr($texte, 0, 1000);
    $a = vrt_sms_analyser($texte, $expediteur);
    $id = substr(hash('sha256', $expediteur . '|' . $texte), 0, 24);
    $sms = [
        'id' => $id, 'expediteur' => substr($expediteur, 0, 40), 'texte' => $texte,
        'recu_at' => $recuAt ?: date('c'), 'statut' => 'ignore', 'motif' => '',
        'operateur' => '', 'sens' => '', 'montant' => 0, 'solde' => null, 'frais' => 0, 'tel' => '', 'txid' => '',
    ];
    if ($a) $sms = array_merge($sms, $a);

    $fp = vrt_sms_verrou();
    try {
        // Le relais rejoue un SMS non acquitté : même texte, même traitement, une seule fois.
        $deja = vrt_sms_lire($id);
        if ($deja) return ['ok' => true, 'doublon' => true, 'statut' => $deja['statut'] ?? ''];

        if (!vrt_sms_expediteur_admis($expediteur)) {
            $sms['motif'] = 'expéditeur non reconnu';
            vrt_sms_ecrire($sms); vrt_sms_log('[IGNORE] exp=' . $sms['expediteur'] . ' ' . $sms['motif']);
            return ['ok' => true, 'statut' => 'ignore', 'motif' => $sms['motif']];
        }
        if (!$a) {
            $sms['motif'] = 'aucun montant lisible';
            vrt_sms_ecrire($sms);
            return ['ok' => true, 'statut' => 'ignore', 'motif' => $sms['motif']];
        }

        // ④ Une transaction ne sert qu'une fois — même si son SMS est reformulé.
        if ($sms['txid'] !== '') {
            foreach (glob(vrt_sms_dir() . 'sms_*.json') ?: [] as $f) {
                $o = json_decode((string) @file_get_contents($f), true);
                if (is_array($o) && ($o['txid'] ?? '') === $sms['txid'] && ($o['operateur'] ?? '') === $sms['operateur']
                    && in_array($o['statut'] ?? '', ['rapproche', 'en_attente', 'octroi_bloque', 'non_verifie'], true)) {
                    $sms['statut'] = 'ignore'; $sms['motif'] = 'transaction déjà reçue (' . $o['id'] . ')';
                    vrt_sms_ecrire($sms);
                    return ['ok' => true, 'statut' => 'ignore', 'motif' => $sms['motif']];
                }
            }
        }

        // ③ La chaîne des soldes, pour TOUT SMS d'argent (un retrait la fait avancer aussi).
        $ch = vrt_sms_chaine_verifier($sms);
        if ($sms['sens'] !== 'entrant') {
            $sms['statut'] = 'mouvement'; $sms['motif'] = $ch['ok'] ? '' : $ch['motif'];
            vrt_sms_ecrire($sms);
            return ['ok' => true, 'statut' => 'mouvement', 'chaine' => $ch['ok']];
        }
        if (!$ch['ok']) {
            $sms['statut'] = 'non_verifie'; $sms['motif'] = $ch['motif'];
            vrt_sms_ecrire($sms); vrt_sms_log('[NON_VERIFIE] tx=' . $sms['txid'] . ' ' . $ch['motif']);
            return ['ok' => true, 'statut' => 'non_verifie', 'motif' => $ch['motif']];
        }
        $sms['verifie'] = true;
        if ($sms['txid'] === '') {
            $sms['statut'] = 'non_verifie'; $sms['motif'] = 'SMS sans ID de transaction';
            vrt_sms_ecrire($sms);
            return ['ok' => true, 'statut' => 'non_verifie', 'motif' => $sms['motif']];
        }

        // ⑤ Quelle commande ? ID de transaction d'abord, puis numéro payeur (la plus ancienne).
        $meilleur = null; $meilleurScore = 0; $meilleurT = PHP_INT_MAX;
        $limite = time() - ((int) SMS_FENETRE_H + 24) * 3600;
        foreach (glob(vrt_pm_dir() . 'manuel_*.json') ?: [] as $f) {
            if (@filemtime($f) < $limite) continue;
            $cmd = pmLire($f);
            if (!$cmd) continue;
            $sc = vrt_sms_accord($cmd, $sms);
            if (!$sc) continue;
            $t = strtotime((string) ($cmd['declared_at'] ?? '')) ?: PHP_INT_MAX;
            if ($sc > $meilleurScore || ($sc === $meilleurScore && $t < $meilleurT)) {
                $meilleur = [$f, $cmd]; $meilleurScore = $sc; $meilleurT = $t;
            }
        }
        if (!$meilleur) {
            // Payé avant d'avoir déclaré, ou payé d'un autre numéro : la déclaration
            // (ou l'ID de transaction saisi ensuite) le retrouvera ici.
            $sms['statut'] = 'en_attente'; $sms['motif'] = 'aucune commande correspondante pour l’instant';
            vrt_sms_ecrire($sms);
            return ['ok' => true, 'statut' => 'en_attente'];
        }
        $r = vrt_sms_accorder($meilleur[0], $meilleur[1], $sms);
        return ['ok' => true, 'statut' => $sms['statut'], 'auto' => $r['ok'], 'ref' => $r['ref']];
    } finally {
        vrt_sms_liberer($fp);
    }
}

/**
 * Appelée juste après une déclaration (ou la saisie de l'ID de transaction) :
 * un SMS vérifié déjà arrivé peut servir la commande tout de suite.
 */
function vrt_sms_rapprocher_commande(string $refFic): array {
    if (!vrt_sms_actif()) return ['auto' => false];
    $path = pmPath($refFic);
    $fp = vrt_sms_verrou();
    try {
        $cmd = pmLire($path);
        if (!$cmd || !empty($cmd['granted'])) return ['auto' => false];
        $choix = null; $score = 0;
        foreach (glob(vrt_sms_dir() . 'sms_*.json') ?: [] as $f) {
            $s = json_decode((string) @file_get_contents($f), true);
            if (!is_array($s) || ($s['statut'] ?? '') !== 'en_attente' || empty($s['verifie'])) continue;
            $sc = vrt_sms_accord($cmd, $s);
            if ($sc > $score) { $choix = $s; $score = $sc; }
        }
        if (!$choix) return ['auto' => false];
        $r = vrt_sms_accorder($path, $cmd, $choix);
        return ['auto' => $r['ok'], 'ref' => $r['ref']];
    } finally {
        vrt_sms_liberer($fp);
    }
}

/** État pour l'administration : chaînes, derniers SMS (texte masqué). */
function vrt_sms_etat(int $n = 60): array {
    $liste = [];
    $fichiers = glob(vrt_sms_dir() . 'sms_*.json') ?: [];
    usort($fichiers, function ($x, $y) { return filemtime($y) <=> filemtime($x); });
    foreach (array_slice($fichiers, 0, $n) as $f) {
        $s = json_decode((string) @file_get_contents($f), true);
        if (!is_array($s)) continue;
        $liste[] = ['id' => $s['id'] ?? '', 'recu_at' => $s['recu_at'] ?? '', 'operateur' => $s['operateur'] ?? '',
                    'sens' => $s['sens'] ?? '', 'montant' => (int) ($s['montant'] ?? 0), 'solde' => $s['solde'] ?? null,
                    'tel' => ($s['tel'] ?? '') !== '' ? '…' . substr((string) $s['tel'], -4) : '',
                    'txid' => $s['txid'] ?? '', 'statut' => $s['statut'] ?? '', 'motif' => $s['motif'] ?? '',
                    'ref' => $s['ref'] ?? ''];
    }
    return ['actif' => vrt_sms_actif(), 'plafond' => (int) SMS_AUTO_MAX, 'intents' => vrt_sms_intents(),
            'chaines' => ['mtn' => vrt_sms_chaine_lire('mtn'), 'orange' => vrt_sms_chaine_lire('orange')],
            'sms' => $liste];
}

/** Courriel à l'administration, au plus un par heure et par sujet. */
function vrt_sms_alerte(string $sujet, string $texte): void {
    $a = defined('VRT_NOTIFY_ADMIN_MAIL') ? trim((string) VRT_NOTIFY_ADMIN_MAIL) : '';
    $borne = vrt_sms_dir() . '_alerte_' . substr(md5($sujet), 0, 8) . '.txt';
    if (is_file($borne) && filemtime($borne) > time() - 3600) return;
    @touch($borne);
    vrt_sms_log('[ALERTE] ' . $sujet);
    if ($a === '' || !function_exists('mail') || defined('VRT_SMS_SANS_MAIL')) return;
    $de = defined('VRT_NOTIFY_FROM') ? (string) VRT_NOTIFY_FROM : 'no-reply@veritas-school.com';
    @mail($a, '=?UTF-8?B?' . base64_encode('VÉRITAS — ' . $sujet) . '?=', $texte,
          "MIME-Version: 1.0\r\nContent-Type: text/plain; charset=UTF-8\r\nFrom: $de\r\n", '-f' . $de);
}
