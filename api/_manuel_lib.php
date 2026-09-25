<?php
// ============================================================
// VÉRITAS — ENCAISSEMENT PAR CODE MARCHAND : LA LOGIQUE PARTAGÉE
// © 2024-2026 Jacques Miterand TAKOU (Mythe Errant). Tous droits réservés.
// ------------------------------------------------------------
// Extrait de payment_manuel.php le 26/09/2026, SANS modification de logique.
// Deux chemins y mènent désormais :
//   · la validation HUMAINE  (payment_manuel.php « grant ») ;
//   · la validation AUTOMATIQUE par le SMS de réception de l'opérateur
//     (_rapprochement_lib.php, appelé par payment_sms.php).
// Une seule porte d'octroi pour les deux : pmOctroyer() → la même fonction
// que les passerelles, vrt_grant_entitlement_to_file().
// ============================================================

if (defined('VRT_MANUEL_LIB')) return;
define('VRT_MANUEL_LIB', '1.0');

require_once __DIR__ . '/_auth_lib.php';      // vrt_grant_entitlement_to_file()
require_once __DIR__ . '/_pay_funds_lib.php'; // cagRecordContribution() — cagnottes

/* Dossier des commandes par code marchand. Surchargeable par VRT_PM_DIR pour
   les bancs (même doctrine que VRT_LIVRET_DIR / VRT_NOTIFY_DIR) : un banc qui
   écrirait ici déclarerait de fausses commandes dans la file de production. */
function vrt_pm_dir() {
    $dir = rtrim(defined('VRT_PM_DIR') ? (string) VRT_PM_DIR : __DIR__ . '/data/payments_manuel', '/') . '/';
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
    return $dir;
}

// Journal borné : même doctrine que les passerelles. Un log sans plafond finit
// par saturer le disque, et un disque plein arrête TOUS les paiements.
function pmLog($line) {
    $logFile = vrt_pm_dir() . '_manuel_log.txt';
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
    return vrt_pm_dir() . 'manuel_' . $ref . '.json';
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
