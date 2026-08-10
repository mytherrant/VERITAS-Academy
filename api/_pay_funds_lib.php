<?php
// ============================================================
// VÉRITAS — Cagnottes de scolarité : stockage partagé entre fournisseurs
// © 2024-2026 Jacques Miterand TAKOU (Mythe Errant). Tous droits réservés.
// ──────────────────────────────────────────────────────────
// Ces helpers étaient définis DANS payment_campay.php. Ils sont extraits ici
// parce que payment_camerpay.php écrit dans le MÊME dossier data/funds/ : deux
// implémentations divergentes du même format de fichier finiraient par se
// corrompre mutuellement (un compteur de cagnotte calculé différemment selon
// le fournisseur qui a encaissé).
//
// ⚠️ COHABITATION : payment_campay.php garde encore ses propres définitions
//    (on ne touche pas à une intégration en service). PHP déclare les fonctions
//    de premier niveau à la COMPILATION du fichier, donc quand ce fichier-ci est
//    inclus depuis payment_campay.php, les `function_exists` ci-dessous sont
//    déjà vraies et rien n'est redéclaré. Tant que CamPay n'est pas retiré,
//    TOUTE correction ici doit être reportée dans payment_campay.php.
// ============================================================

if (!function_exists('cagDir')) {
    // Même doctrine que les paiements : dossier interdit en HTTP (deux
    // sentinelles créées au runtime), un fichier JSON par cagnotte.
    function cagDir() {
        static $dir = null;
        if ($dir !== null) return $dir;
        $dir = __DIR__ . '/data/funds/';
        if (!is_dir($dir)) @mkdir($dir, 0750, true);
        if (!is_file($dir . '.htaccess')) {
            @file_put_contents($dir . '.htaccess',
                "Require all denied\n<IfModule !mod_authz_core.c>\nOrder allow,deny\nDeny from all\n</IfModule>\n");
        }
        if (!is_file($dir . 'index.php')) {
            @file_put_contents($dir . 'index.php', "<?php http_response_code(403); exit;\n");
        }
        return $dir;
    }
}

if (!function_exists('cagFile')) {
    function cagFile($token) {
        $t = preg_replace('/[^a-f0-9]/', '', strtolower((string)$token));
        if (strlen($t) < 16) return null;              // jeton trop court = tentative
        return cagDir() . 'fund_' . $t . '.json';
    }
}

if (!function_exists('cagLoad')) {
    function cagLoad($token) {
        $f = cagFile($token);
        if (!$f || !is_file($f)) return null;
        $d = json_decode((string)file_get_contents($f), true);
        return is_array($d) ? $d : null;
    }
}

if (!function_exists('cagSave')) {
    function cagSave(array $fund) {
        $f = cagFile($fund['token'] ?? '');
        if (!$f) return false;
        return (bool)@file_put_contents($f, json_encode($fund, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE), LOCK_EX);
    }
}

if (!function_exists('cagShortName')) {
    // « Marie-Claire NGOUEWOUE » → « Marie-Claire N. »
    function cagShortName($nom) {
        $nom = trim(preg_replace('/\s+/', ' ', (string)$nom));
        if ($nom === '') return 'Anonyme';
        $mots = explode(' ', $nom);
        if (count($mots) === 1) return mb_substr($mots[0], 0, 24);
        $last = array_pop($mots);
        return mb_substr(implode(' ', $mots), 0, 24) . ' ' . mb_strtoupper(mb_substr($last, 0, 1)) . '.';
    }
}

if (!function_exists('cagPublicView')) {
    // Vue PUBLIQUE — ce que voit l'oncle à Bruxelles. Jamais de numéro de
    // téléphone, jamais de nom de famille complet : « Awa T. ».
    function cagPublicView(array $fund) {
        $contribs = [];
        $total = 0;
        foreach (($fund['contributions'] ?? []) as $c) {
            $m = (int)($c['montant'] ?? 0);
            $total += $m;
            $contribs[] = [
                'nom'     => cagShortName((string)($c['nom'] ?? '')),
                'montant' => $m,
                'date'    => substr((string)($c['date'] ?? ''), 0, 10),
                'mot'     => mb_substr((string)($c['mot'] ?? ''), 0, 140)
            ];
        }
        $objectif = (int)($fund['objectif'] ?? 0);
        $reste    = max(0, $objectif - $total);
        return [
            'token'      => $fund['token'] ?? '',
            'prenom'     => $fund['prenom'] ?? '',
            'classe'     => $fund['classe'] ?? '',
            'titre'      => $fund['titre'] ?? '',
            'message'    => $fund['message'] ?? '',
            'objectif'   => $objectif,
            'collecte'   => $total,
            'reste'      => $reste,
            'pourcent'   => $objectif > 0 ? min(100, (int)round($total * 100 / $objectif)) : 0,
            'echeance'   => $fund['echeance'] ?? '',
            'statut'     => $fund['statut'] ?? 'ouverte',
            'created_at' => $fund['created_at'] ?? '',
            'nb'         => count($contribs),
            'contributions' => array_reverse($contribs)   // la plus récente d'abord
        ];
    }
}

if (!function_exists('cagRecordContribution')) {
    // Inscription IDEMPOTENTE : une référence de paiement = une contribution.
    // Rejouer le webhook (CamerPay permet le rejeu manuel depuis son dashboard)
    // ne double jamais le compteur.
    function cagRecordContribution(array $state) {
        $fund = cagLoad((string)($state['targetId'] ?? ''));
        if (!$fund) return ['ok' => false, 'reason' => 'cagnotte introuvable'];

        $ref = (string)($state['ref'] ?? '');
        foreach (($fund['contributions'] ?? []) as $c) {
            if ((string)($c['ref'] ?? '') === $ref) return ['ok' => true, 'already' => true];
        }

        $fund['contributions'][] = [
            'ref'      => $ref,
            'nom'      => (string)($state['clientNom'] ?? ''),
            'montant'  => (int)($state['montant_paye'] ?? $state['montant'] ?? 0),
            'mot'      => (string)($state['fundMessage'] ?? ''),
            'date'     => date('c'),
            'operator' => (string)($state['operator'] ?? '')
        ];
        cagSave($fund);

        $v = cagPublicView($fund);
        return ['ok' => true, 'collecte' => $v['collecte'], 'objectif' => $v['objectif'], 'nb' => $v['nb']];
    }
}
