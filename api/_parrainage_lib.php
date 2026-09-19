<?php
/**
 * api/_parrainage_lib.php — CODE AMI : remise, commission et versement, côté SERVEUR
 * © 2024-2026 Jacques Miterand TAKOU (Mythe Errant). Tous droits réservés.
 * Œuvre protégée — Loi camerounaise n° 2000/011 + Convention de Berne.
 *
 * ─────────────────────────────────────────────────────────────────────────────
 * LA RÈGLE (arrêtée par Jacques le 13/09/2026)
 *   · Chaque compte a un code personnel : VRT + 6 caractères.
 *   · Le filleul — celui qui paie avec ce code, ou qui s'est inscrit avec —
 *     obtient −10 % sur ses paiements, SANS limite de durée.
 *   · Le propriétaire du code touche 10 % du montant RÉELLEMENT encaissé,
 *     crédité à la confirmation du paiement par l'opérateur.
 *   · Dès que son solde atteint 2 000 F, le serveur verse ce solde sur son
 *     Mobile Money (lot CamerPay, validé par CamerPay sous ~4 h ouvrées).
 *   Les quatre valeurs se règlent sans redéploiement (vrt_parr_cfg) ; le code
 *   ne porte que les défauts.
 *
 * CE QUI NE MARCHAIT PAS (mesuré le 13/09/2026, avant ce fichier)
 *   1. Le lien parrain → filleul n'était écrit que dans le navigateur du
 *      FILLEUL, après une recherche du parrain dans SA copie de la base — vide
 *      sur un téléphone neuf. Aucun parrainage n'atteignait le serveur.
 *   2. Le code valait « VRT » + les 6 premiers caractères de l'identifiant :
 *      « VRTVA1789 » pour TOUS les comptes créés par le serveur la même
 *      quinzaine (va_1789…). Un code, des centaines de parrains possibles.
 *   3. La commission n'était calculée que par le navigateur qui confirmait le
 *      paiement ; celui d'un visiteur ne synchronise jamais. Rien n'était dû.
 *   4. Les 500 F de « crédit » promis aux deux parties étaient écrits dans
 *      DB.userCredits, que rien ne lisait : une promesse sans guichet.
 *   5. Le code promo saisi au paiement ne quittait pas le navigateur : le
 *      serveur ignorait qui l'avait apporté, donc qui rémunérer.
 *
 * STOCKAGE — un REGISTRE DÉDIÉ (api/data/parrainage/registre.json), pas la base
 *   partagée. db.php remplace la base ENTIÈRE à chaque synchronisation
 *   administrateur (« dernière écriture gagne ») : un solde crédité par un
 *   webhook puis écrasé par une copie plus ancienne serait de l'argent dû qui
 *   disparaît sans trace. Le registre n'est écrit que par le serveur, sous
 *   verrou exclusif. La base ne garde que des copies de confort (le parrain
 *   d'un compte), jamais de montant.
 *
 * ORDRE DES VERROUS — toujours la base PUIS le registre, jamais l'inverse.
 *   vrt_grant_entitlement_to_file() tient la base quand il crédite ; aucun
 *   chemin ne prend le registre avant la base : pas d'étreinte fatale.
 * ─────────────────────────────────────────────────────────────────────────────
 */

if (!defined('VRT_PARR_LIB')) {
    define('VRT_PARR_LIB', '1.0');

    // ════════════════════════════════════════════════════════════════════
    // 1. RÉGLAGES
    // ════════════════════════════════════════════════════════════════════
    function vrt_parr_defauts(): array {
        return ['actif' => true, 'remisePct' => 10, 'commissionPct' => 10,
                'seuilVersement' => 2000, 'versementAuto' => true];
    }

    /**
     * Réglages effectifs : défauts ← DB.parrainageConfig ← réglages du registre.
     * Le registre gagne parce qu'il est écrit par l'écran d'administration via
     * parrainage.php, sans dépendre d'une synchronisation de la base — cassée
     * plusieurs fois cette année. Toutes les valeurs sont BORNÉES : un 90 %
     * saisi par erreur ne doit pas vider la caisse.
     */
    function vrt_parr_cfg(array $db, ?array $reg = null): array {
        $d = vrt_parr_defauts();
        $sources = [];
        if (isset($db['parrainageConfig']) && is_array($db['parrainageConfig'])) $sources[] = $db['parrainageConfig'];
        if ($reg === null) { try { $reg = vrt_parr_lire(); } catch (\Throwable $e) { $reg = []; } }
        if (isset($reg['reglages']) && is_array($reg['reglages'])) $sources[] = $reg['reglages'];
        foreach ($sources as $c) {
            if (array_key_exists('actif', $c))        $d['actif'] = (bool) $c['actif'];
            if (array_key_exists('versementAuto', $c)) $d['versementAuto'] = (bool) $c['versementAuto'];
            foreach (['remisePct', 'commissionPct', 'seuilVersement'] as $k) {
                if (isset($c[$k]) && is_numeric($c[$k])) $d[$k] = (int) $c[$k];
            }
        }
        $d['remisePct']      = max(0, min(50, $d['remisePct']));
        $d['commissionPct']  = max(0, min(50, $d['commissionPct']));
        if ($d['remisePct'] + $d['commissionPct'] > 60) $d['commissionPct'] = 60 - $d['remisePct'];
        $d['seuilVersement'] = max(500, min(200000, $d['seuilVersement']));
        return $d;
    }

    /**
     * Paiements concernés. Exclus : les frais d'inscription (100 F — le code se
     * donne à l'inscription, pas sur elle), la scolarité du centre, les dons
     * d'une cagnotte, les paiements libres et les packs d'établissement (déjà
     * remisés au volume).
     *
     * ⚠️ LE PANIER A DEUX NATURES, ET UNE SEULE PEUT ÊTRE REMISÉE (16/09/2026).
     *   · NUMÉRIQUE (app.js : « Payer tout », les collections) — chaque ligne
     *     porte son propre intent, est accordée séparément et contrôlée contre
     *     l'encaissé. Une remise globale sous-paierait la DERNIÈRE ligne, qui
     *     ne s'ouvrirait pas : l'acheteur perdrait un article payé. Exclu.
     *   · PHYSIQUE (la boutique de la vitrine : manuels papier et livraison) —
     *     aucune ligne numérique, rien n'est ouvert ligne par ligne. La remise
     *     n'y referme rien. Admis.
     * Jusqu'au 16/09 le panier entier était exclu, si bien que la remise promise
     * partout sur le site (« −10 % sur vos abonnements et achats ») ne valait
     * sur aucune commande de manuel. C'est le SERVEUR qui tranche la nature du
     * panier, à partir des lignes réellement reçues : voir vrt_parr_panier_physique().
     */
    function vrt_parr_intent_eligible(string $intent, bool $panierPhysique = false): bool {
        if ($intent === 'cart') return $panierPhysique;
        return $intent !== '' && !in_array($intent,
            ['inscription', 'echeance', 'cagnotte', 'generic', 'livret_pack'], true);
    }

    /**
     * Un panier est PHYSIQUE s'il ne porte AUCUNE ligne numérique. Même critère
     * que camerpaySanitizeLignes() : une ligne est numérique si elle a un intent
     * valide autre que `cart`. Les lignes de la boutique ({nom, qte, pu}) n'en
     * ont pas — elles ne servent qu'à habiller la page du prestataire.
     */
    function vrt_parr_panier_physique($lignes): bool {
        if (!is_array($lignes)) return true;
        foreach ($lignes as $l) {
            if (!is_array($l)) continue;
            $i = strtolower(trim((string) ($l['intent'] ?? '')));
            if ($i !== '' && $i !== 'cart' && preg_match('/^[a-z_]{1,30}$/', $i)) return false;
        }
        return true;
    }

    // ════════════════════════════════════════════════════════════════════
    // 2. CODES
    // ════════════════════════════════════════════════════════════════════
    /** « rentrée-2026 » → « RENTREE-2026 ». Les accents tombent des DEUX côtés de la comparaison. */
    function vrt_parr_normaliser(string $code): string {
        $c = function_exists('mb_strtoupper') ? mb_strtoupper(trim($code), 'UTF-8') : strtoupper(trim($code));
        $c = strtr($c, ['À' => 'A', 'Â' => 'A', 'Ä' => 'A', 'É' => 'E', 'È' => 'E', 'Ê' => 'E', 'Ë' => 'E',
                        'Î' => 'I', 'Ï' => 'I', 'Ô' => 'O', 'Ö' => 'O', 'Ù' => 'U', 'Û' => 'U', 'Ü' => 'U', 'Ç' => 'C']);
        return substr((string) preg_replace('/[^A-Z0-9_\-]/', '', $c), 0, 32);
    }

    /**
     * Le code d'un identifiant de compte. Déterministe (le même partout, sans
     * rien stocker) et réparti sur 32⁶ ≈ un milliard de valeurs : deux comptes
     * nés la même seconde n'ont plus le même code. Alphabet sans 0/O ni 1/I —
     * un code se dicte au téléphone et se recopie d'une affiche.
     */
    function vrt_parr_code_pour_id(string $id): string {
        if ($id === '') return '';
        $alpha = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
        $h = hash('sha256', 'veritas|code-ami|' . $id, true);
        $s = 'VRT';
        for ($i = 0; $i < 6; $i++) $s .= $alpha[ord($h[$i]) % 32];
        return $s;
    }

    /** L'ancien format, encore imprimé sur des kits : « VRT » + 6 premiers caractères. */
    function vrt_parr_code_ancien(string $id): string {
        $a = substr(strtoupper((string) preg_replace('/[^A-Za-z0-9]/', '', $id)), 0, 6);
        return 'VRT' . str_pad($a, 6, 'X');
    }

    /** Les 9 chiffres nationaux d'un numéro camerounais ('' si ce n'en est pas un). */
    function vrt_parr_tel9(string $tel): string {
        $n = (string) preg_replace('/[^0-9]/', '', $tel);
        if (strlen($n) === 12 && strpos($n, '237') === 0) $n = substr($n, 3);
        return strlen($n) === 9 ? $n : '';
    }

    /**
     * Opérateur Mobile Money d'un numéro — MÊME table que camerpayGuessMethod()
     * (payment_camerpay.php) et _payGuessOperator() (app.js). Le banc
     * tests/parrainage.php compare les trois sur tous les préfixes : un écart
     * enverrait un versement chez le mauvais opérateur.
     */
    function vrt_parr_methode(string $tel): string {
        $loc = vrt_parr_tel9($tel);
        if ($loc === '') return '';
        $p2 = substr($loc, 0, 2); $p3 = substr($loc, 0, 3);
        if ($p2 === '67' || $p2 === '68') return 'mtn_momo';
        if ($p2 === '69')                 return 'orange_money';
        if ($p3 >= '650' && $p3 <= '654') return 'mtn_momo';
        if ($p3 >= '655' && $p3 <= '659') return 'orange_money';
        if ($p3 === '640')                return 'orange_money';
        return '';
    }

    function vrt_parr_nom_court(string $pre, string $nom): string {
        $pre = trim($pre); $nom = trim($nom);
        if ($pre === '' && $nom === '') return '';
        if ($pre === '') return function_exists('mb_substr') ? mb_substr($nom, 0, 24) : substr($nom, 0, 24);
        $ini = $nom !== '' ? (function_exists('mb_substr') ? mb_strtoupper(mb_substr($nom, 0, 1)) : strtoupper($nom[0])) . '.' : '';
        return trim($pre . ' ' . $ini);
    }

    // ════════════════════════════════════════════════════════════════════
    // 3. REGISTRE
    // ════════════════════════════════════════════════════════════════════
    function vrt_parr_dir(): string {
        $dir = defined('VRT_PARR_DIR') ? rtrim((string) VRT_PARR_DIR, '/\\') : __DIR__ . '/data/parrainage';
        if (!is_dir($dir)) @mkdir($dir, 0750, true);
        // Défense en profondeur : api/data/.htaccess interdit déjà tout le dossier.
        if (!is_file($dir . '/.htaccess')) {
            @file_put_contents($dir . '/.htaccess',
                "Require all denied\n<IfModule !mod_authz_core.c>\nOrder allow,deny\nDeny from all\n</IfModule>\n");
        }
        if (!is_file($dir . '/index.php')) @file_put_contents($dir . '/index.php', "<?php http_response_code(403); exit;\n");
        return $dir;
    }
    function vrt_parr_fichier(): string { return vrt_parr_dir() . '/registre.json'; }

    /**
     * Clés préfixées (« acc:… », « r:… ») : PHP convertit en entier une clé de
     * tableau purement numérique, et une référence de paiement saisie à la main
     * peut l'être. Le préfixe garde les clés telles qu'on les a écrites.
     */
    function vrt_parr_vide(): array {
        return ['v' => 1, 'reglages' => [], 'index' => [], 'liens' => [], 'comptes' => [], 'ops' => [], 'versements' => []];
    }

    function vrt_parr_lire(): array {
        $f = vrt_parr_fichier();
        if (!is_file($f)) return vrt_parr_vide();
        $j = json_decode((string) @file_get_contents($f), true);
        return is_array($j) ? array_merge(vrt_parr_vide(), $j) : vrt_parr_vide();
    }

    /**
     * Lire-modifier-écrire sous verrou exclusif. $fn reçoit le registre PAR
     * RÉFÉRENCE et renvoie ce qu'il veut ; on n'écrit que si le contenu a changé.
     * Un registre ILLISIBLE n'est jamais écrasé : de l'argent dû y est inscrit.
     */
    function vrt_parr_tx(callable $fn) {
        $f  = vrt_parr_fichier();
        $fp = @fopen($f, 'c+');
        if (!$fp) throw new \RuntimeException('registre du Code ami inaccessible');
        if (!flock($fp, LOCK_EX)) { fclose($fp); throw new \RuntimeException('registre du Code ami verrouillé'); }
        try {
            $brut = (string) stream_get_contents($fp);
            $reg  = json_decode($brut, true);
            if (!is_array($reg)) {
                if (trim($brut) !== '') {
                    @copy($f, $f . '.illisible.' . date('Ymd_His'));
                    throw new \RuntimeException('registre du Code ami illisible — copie conservée, aucune écriture');
                }
                $reg = [];
            }
            $reg   = array_merge(vrt_parr_vide(), $reg);
            $avant = json_encode($reg, JSON_UNESCAPED_UNICODE);
            $res   = $fn($reg);
            $apres = json_encode($reg, JSON_UNESCAPED_UNICODE);
            if ($apres !== false && $apres !== $avant) {
                if ($brut !== '') @file_put_contents($f . '.bak', $brut);
                ftruncate($fp, 0); rewind($fp); fwrite($fp, $apres); fflush($fp);
            }
            return $res;
        } finally {
            flock($fp, LOCK_UN);
            fclose($fp);
        }
    }

    // ════════════════════════════════════════════════════════════════════
    // 4. QUI EST DERRIÈRE UN CODE
    // ════════════════════════════════════════════════════════════════════
    /** Une clé de bénéficiaire (« acc:va_1 », « prt:p9 », « ens:t3 ») → la personne, ou null. */
    function vrt_parr_personne(array $db, string $benef): ?array {
        $p = strpos($benef, ':');
        if ($p === false) return null;
        $type = substr($benef, 0, $p); $id = (string) substr($benef, $p + 1);
        if ($id === '') return null;
        if ($type === 'acc') {
            foreach (['visitorAccounts', 'studentAccounts'] as $coll) {
                foreach (($db[$coll] ?? []) as $a) {
                    if (!is_array($a) || (string) ($a['id'] ?? '') !== $id) continue;
                    return ['type' => 'acc', 'id' => $id, 'pre' => (string) ($a['pre'] ?? ''), 'nom' => (string) ($a['nom'] ?? ''),
                            'tel' => (string) ($a['tel'] ?? ''), 'login' => (string) ($a['user'] ?? ''),
                            'code' => (string) ($a['codeParrain'] ?? ''),
                            'actif' => (string) ($a['statut'] ?? '') !== 'suspendu'];
                }
            }
            return null;
        }
        if ($type === 'ens') {
            foreach (($db['teachers'] ?? []) as $t) {
                if (!is_array($t) || (string) ($t['id'] ?? '') !== $id) continue;
                return ['type' => 'ens', 'id' => $id, 'pre' => (string) ($t['pre'] ?? ''), 'nom' => (string) ($t['nom'] ?? ''),
                        'tel' => (string) ($t['tel'] ?? ''), 'login' => (string) ($t['user'] ?? ''), 'code' => '',
                        'actif' => !in_array(strtolower((string) ($t['statut'] ?? $t['stat'] ?? '')), ['suspendu', 'inactif', 'parti'], true)];
            }
            return null;
        }
        if ($type === 'prt') {
            foreach (($db['partners'] ?? []) as $pa) {
                if (!is_array($pa) || (string) ($pa['id'] ?? '') !== $id) continue;
                return ['type' => 'prt', 'id' => $id, 'pre' => '', 'nom' => (string) ($pa['nom'] ?? $pa['name'] ?? ''),
                        'tel' => (string) ($pa['tel'] ?? ''), 'login' => '', 'code' => (string) ($pa['code'] ?? ''),
                        'actif' => (string) ($pa['status'] ?? '') === 'active'];
            }
            return null;
        }
        return null;
    }

    /** Le code AFFICHÉ d'une personne : celui qu'elle porte, sinon le calculé. */
    function vrt_parr_code_de(array $personne): string {
        if (!empty($personne['code'])) return vrt_parr_normaliser((string) $personne['code']);
        return vrt_parr_code_pour_id((string) ($personne['id'] ?? ''));
    }

    /** Un compte par identifiant puis par login, SANS toucher à la base (lecture seule). */
    function vrt_parr_trouver_compte(array $db, string $ref): ?array {
        $ref = trim($ref);
        if ($ref === '') return null;
        foreach (['id', 'user'] as $champ) {
            foreach (['visitorAccounts', 'studentAccounts'] as $coll) {
                foreach (($db[$coll] ?? []) as $a) {
                    if (is_array($a) && (string) ($a[$champ] ?? '') === $ref) return $a;
                }
            }
        }
        return null;
    }

    /** Mémorise « ce code désigne cette personne » : la résolution suivante n'a plus à tout parcourir. */
    function vrt_parr_indexer(string $code, string $benef): void {
        $code = vrt_parr_normaliser($code);
        if ($code === '' || $benef === '') return;
        try {
            vrt_parr_tx(function (array &$reg) use ($code, $benef) {
                if (($reg['index'][$code] ?? '') !== $benef) $reg['index'][$code] = $benef;
            });
        } catch (\Throwable $e) { /* un index manquant ralentit, il ne casse rien */ }
    }

    /**
     * Résout un code saisi. Ordre : codes promo de l'administration, index du
     * registre, codes de partenaires, codes de comptes (porté puis calculé),
     * enseignants, et enfin l'ancien format — seulement s'il ne désigne qu'UNE
     * personne (sinon il en désignait des centaines : refus).
     * Renvoie ['code','type'=>promo|compte|partenaire|enseignant,'benef'=>?string,
     *          'remisePct','remiseFixe','commissionPct','nom','promo'=>?array] ou null.
     */
    function vrt_parr_resoudre(array $db, array $reg, string $saisi): ?array {
        $code = vrt_parr_normaliser($saisi);
        if (strlen($code) < 3) return null;
        $cfg = vrt_parr_cfg($db, $reg);
        $base = ['code' => $code, 'remisePct' => $cfg['remisePct'], 'remiseFixe' => 0,
                 'commissionPct' => $cfg['commissionPct'], 'nom' => '', 'promo' => null];

        // a. Codes promo de l'administration (campagnes, codes de partenaires).
        foreach (($db['promoCodes'] ?? []) as $pc) {
            if (!is_array($pc) || vrt_parr_normaliser((string) ($pc['code'] ?? '')) !== $code) continue;
            if (empty($pc['actif'])) return null;
            $max = (int) ($pc['max'] ?? 0);
            if ($max > 0 && (int) ($pc['usage'] ?? 0) >= $max) return null;
            $fin = (string) ($pc['expireLe'] ?? '');
            if ($fin !== '' && strtotime($fin . ' 23:59:59') !== false && strtotime($fin . ' 23:59:59') < time()) return null;
            $r = $base;
            $r['type']  = 'promo';
            $r['promo'] = ['code' => (string) $pc['code'], 'id' => (string) ($pc['id'] ?? '')];
            $val = (float) ($pc['reduction'] ?? 0);
            if ((string) ($pc['type'] ?? 'percent') === 'fixed') { $r['remiseFixe'] = max(0, (int) round($val)); $r['remisePct'] = 0; }
            else { $r['remisePct'] = max(0, min(50, (int) round($val))); }
            $r['benef'] = null;
            if (!empty($pc['partnerId']))           $r['benef'] = 'prt:' . (string) $pc['partnerId'];
            elseif (!empty($pc['ownerAccountId']))  $r['benef'] = 'acc:' . (string) $pc['ownerAccountId'];
            if ($r['benef'] !== null) {
                $pers = vrt_parr_personne($db, $r['benef']);
                if (!$pers) $r['benef'] = null;   // propriétaire disparu : la remise reste, personne n'est payé
                else $r['nom'] = vrt_parr_nom_court($pers['pre'], $pers['nom']);
            }
            if ($r['benef'] === null) $r['commissionPct'] = 0;
            return $r;
        }

        $trouve = function (string $benef) use ($db, $base) {
            $pers = vrt_parr_personne($db, $benef);
            if (!$pers) return null;
            $r = $base;
            $r['type']  = ['acc' => 'compte', 'prt' => 'partenaire', 'ens' => 'enseignant'][$pers['type']] ?? 'compte';
            $r['benef'] = $benef;
            $r['nom']   = vrt_parr_nom_court($pers['pre'], $pers['nom']);
            return $r;
        };

        // b. Index du registre (codes déjà vus) — vérifié, jamais cru sur parole.
        if (isset($reg['index'][$code]) && is_string($reg['index'][$code])) {
            $r = $trouve($reg['index'][$code]);
            if ($r) return $r;
        }
        // c. Partenaires.
        foreach (($db['partners'] ?? []) as $pa) {
            if (is_array($pa) && !empty($pa['id']) && vrt_parr_normaliser((string) ($pa['code'] ?? '')) === $code) {
                return $trouve('prt:' . (string) $pa['id']);
            }
        }
        // d. Comptes : code porté, puis code calculé.
        $ancien = [];
        foreach (['visitorAccounts', 'studentAccounts'] as $coll) {
            foreach (($db[$coll] ?? []) as $a) {
                if (!is_array($a) || empty($a['id'])) continue;
                $id = (string) $a['id'];
                if ((!empty($a['codeParrain']) && vrt_parr_normaliser((string) $a['codeParrain']) === $code)
                    || vrt_parr_code_pour_id($id) === $code) {
                    return $trouve('acc:' . $id);
                }
                if (vrt_parr_code_ancien($id) === $code) $ancien[] = 'acc:' . $id;
            }
        }
        // e. Enseignants du centre.
        foreach (($db['teachers'] ?? []) as $t) {
            if (!is_array($t) || empty($t['id'])) continue;
            $id = (string) $t['id'];
            if (vrt_parr_code_pour_id($id) === $code) return $trouve('ens:' . $id);
            if (vrt_parr_code_ancien($id) === $code) $ancien[] = 'ens:' . $id;
        }
        // f. Ancien format : accepté s'il ne désigne qu'une seule personne.
        if (count($ancien) === 1) return $trouve($ancien[0]);
        if (count($ancien) > 1 && function_exists('vrt_pay_log')) {
            vrt_pay_log('[CODE_AMI_AMBIGU] code=' . $code . ' personnes=' . count($ancien) . ' — refusé');
        }
        return null;
    }

    /** Le parrain rattaché à vie à un compte : ['b'=>benef,'c'=>code] ou null. */
    function vrt_parr_lien(array $db, array $reg, string $accId): ?array {
        if ($accId === '') return null;
        $l = $reg['liens']['acc:' . $accId] ?? null;
        if (is_array($l) && !empty($l['b'])) return ['b' => (string) $l['b'], 'c' => (string) ($l['c'] ?? '')];
        // Copie de confort dans la base (écrite à l'inscription, sous le verrou de la base).
        foreach (['visitorAccounts', 'studentAccounts'] as $coll) {
            foreach (($db[$coll] ?? []) as $a) {
                if (!is_array($a) || (string) ($a['id'] ?? '') !== $accId) continue;
                if (!empty($a['parrainBenef'])) return ['b' => (string) $a['parrainBenef'], 'c' => (string) ($a['parrainCode'] ?? '')];
                return null;
            }
        }
        return null;
    }

    /** Montant de la remise pour un prix. Jamais plus de la moitié : un code n'offre pas l'article. */
    function vrt_parr_remise(int $prix, array $p): int {
        if ($prix <= 0) return 0;
        $fixe = (int) ($p['remiseFixe'] ?? 0);
        $r = $fixe > 0 ? $fixe : (int) round($prix * ((float) ($p['remisePct'] ?? 0)) / 100);
        return max(0, min($r, (int) floor($prix / 2)));
    }

    // ════════════════════════════════════════════════════════════════════
    // 5. ÉVALUER UN PAIEMENT
    // ════════════════════════════════════════════════════════════════════
    /**
     * Quel code s'applique, et que vaut-il ?
     *   $ctx = code (saisi, peut être vide) · accountId · tel · intent · targetId
     *          · prix (tarif de référence du serveur, à défaut le montant annoncé)
     *
     * Règles :
     *   A. Le payeur a un parrain À VIE → c'est lui qui touche la commission, et
     *      le payeur garde sa remise. Un code d'une AUTRE personne ne détourne pas
     *      ce lien. Un code de campagne sans bénéficiaire peut seulement offrir
     *      une remise plus forte.
     *   B. Pas de parrain → le code saisi s'applique (et le lien naîtra au
     *      premier paiement confirmé, voir vrt_parr_crediter).
     *   Garde : on ne se parraine pas soi-même — ni par son compte, ni par un
     *   second compte sur le même numéro de téléphone.
     */
    function vrt_parr_evaluer(array $db, array $reg, array $ctx): array {
        $cfg = vrt_parr_cfg($db, $reg);
        $prix = (int) ($ctx['prix'] ?? 0);
        $out = ['ok' => false, 'motif' => '', 'code' => '', 'benef' => null, 'source' => '', 'type' => '',
                'remisePct' => 0, 'remiseFixe' => 0, 'commissionPct' => 0,
                'remise' => 0, 'prix' => $prix, 'montant' => $prix, 'parrain' => ''];
        if (empty($cfg['actif'])) { $out['motif'] = 'Les codes sont momentanément suspendus.'; return $out; }
        if (!vrt_parr_intent_eligible((string) ($ctx['intent'] ?? ''), !empty($ctx['panierPhysique']))) {
            $out['motif'] = 'Les codes ne s’appliquent pas à ce type de paiement.'; return $out;
        }

        $payeurId = ''; $payeurTel = vrt_parr_tel9((string) ($ctx['tel'] ?? ''));
        if (!empty($ctx['accountId'])) {
            $acc = vrt_parr_trouver_compte($db, (string) $ctx['accountId']);
            if ($acc) {
                $payeurId = (string) ($acc['id'] ?? '');
                if ($payeurTel === '') $payeurTel = vrt_parr_tel9((string) ($acc['tel'] ?? ''));
            }
        }
        $estSoi = function (?string $benef, ?array $pers = null) use ($payeurId, $payeurTel, $db) {
            if (!$benef) return false;
            if ($payeurId !== '' && $benef === 'acc:' . $payeurId) return true;
            $pers = $pers ?: vrt_parr_personne($db, $benef);
            $t = $pers ? vrt_parr_tel9((string) $pers['tel']) : '';
            return $t !== '' && $payeurTel !== '' && $t === $payeurTel;
        };

        $saisi = vrt_parr_normaliser((string) ($ctx['code'] ?? ''));
        $lien  = vrt_parr_lien($db, $reg, $payeurId);
        $res   = $saisi !== '' ? vrt_parr_resoudre($db, $reg, $saisi) : null;

        $choix = null;
        if ($lien) {
            $pers = vrt_parr_personne($db, $lien['b']);
            $choix = ['code' => $lien['c'], 'type' => 'lien', 'benef' => $lien['b'],
                      'remisePct' => $cfg['remisePct'], 'remiseFixe' => 0, 'commissionPct' => $cfg['commissionPct'],
                      'nom' => $pers ? vrt_parr_nom_court($pers['pre'], $pers['nom']) : ''];
            if (!$pers || empty($pers['actif']) || $estSoi($lien['b'], $pers)) {
                $choix['benef'] = null; $choix['commissionPct'] = 0;   // la remise du filleul survit à son parrain
            }
            $out['source'] = 'lien';
            // Une campagne sans bénéficiaire peut faire mieux que la remise du lien.
            if ($res && $res['type'] === 'promo' && $res['benef'] === null && $prix > 0
                && vrt_parr_remise($prix, $res) > vrt_parr_remise($prix, $choix)) {
                $choix['remisePct'] = $res['remisePct']; $choix['remiseFixe'] = $res['remiseFixe'];
                $choix['code'] = $res['code']; $choix['promo'] = $res['promo'];
            } elseif ($res && $res['benef'] !== null && $res['benef'] !== $lien['b']) {
                $out['motif'] = 'Votre parrain reste celui de votre inscription : sa remise s’applique déjà.';
            }
        } elseif ($res) {
            if ($estSoi($res['benef'])) {
                $out['code'] = $res['code'];
                $out['motif'] = 'C’est votre propre code : partagez-le, il ne s’applique pas à vos achats.';
                return $out;
            }
            if ($res['benef'] !== null) {
                $pers = vrt_parr_personne($db, $res['benef']);
                if (!$pers || empty($pers['actif'])) { $out['motif'] = 'Ce code n’est plus actif.'; return $out; }
            }
            $choix = $res;
            $out['source'] = 'saisie';
        } else {
            if ($saisi !== '') $out['motif'] = 'Code inconnu, épuisé ou expiré.';
            return $out;
        }

        $out['ok']            = true;
        $out['code']          = (string) $choix['code'];
        $out['type']          = (string) $choix['type'];
        $out['benef']         = $choix['benef'];
        $out['remisePct']     = (int) $choix['remisePct'];
        $out['remiseFixe']    = (int) $choix['remiseFixe'];
        $out['commissionPct'] = $choix['benef'] ? (int) $choix['commissionPct'] : 0;
        $out['parrain']       = (string) ($choix['nom'] ?? '');
        if (!empty($choix['promo'])) $out['promo'] = $choix['promo'];
        $out['remise']        = vrt_parr_remise($prix, $choix);
        $out['montant']       = max(0, $prix - $out['remise']);
        return $out;
    }

    /** Ce que ?action=init écrit dans le fichier d'état : le strict nécessaire, calculé par le serveur. */
    function vrt_parr_pour_etat(array $ev): ?array {
        if (empty($ev['ok'])) return null;
        $e = ['code' => (string) $ev['code'], 'benef' => $ev['benef'], 'source' => (string) $ev['source'],
              'type' => (string) $ev['type'], 'remisePct' => (int) $ev['remisePct'],
              'remiseFixe' => (int) $ev['remiseFixe'], 'commissionPct' => (int) $ev['commissionPct']];
        if (!empty($ev['promo'])) $e['promo'] = $ev['promo'];
        return $e;
    }

    // ════════════════════════════════════════════════════════════════════
    // 6. CRÉDITER AU PAIEMENT CONFIRMÉ
    // ════════════════════════════════════════════════════════════════════
    /**
     * Appelée par vrt_grant_entitlement_to_file() SOUS LE VERROU DE LA BASE, et
     * seulement si l'octroi a réellement ouvert quelque chose. Idempotente par
     * référence de paiement : webhook, polling et rattrapage peuvent passer
     * trois fois, le parrain n'est crédité qu'une.
     *
     * Le bénéficiaire est RE-VÉRIFIÉ ici (existe, actif, n'est pas le payeur) :
     * entre l'initiation et la confirmation, un compte a pu être suspendu.
     */
    function vrt_parr_crediter(array &$db, array $state): array {
        $out = ['benef' => '', 'commission' => 0, 'aVerser' => false, 'dbModifiee' => false, 'deja' => false];
        $p = (isset($state['parrainage']) && is_array($state['parrainage'])) ? $state['parrainage'] : null;
        $ref = (string) ($state['ref'] ?? '');
        if (!$p || $ref === '') return $out;

        $paye  = (int) ($state['montant_paye'] ?? $state['montant'] ?? 0);
        $benef = !empty($p['benef']) ? (string) $p['benef'] : '';
        $cfg   = vrt_parr_cfg($db);

        // Le payeur, tel que la base le connaît.
        $payeurId = ''; $payeurTel = vrt_parr_tel9((string) ($state['clientTel'] ?? ''));
        $rc = !empty($state['accountId']) ? vrt_resoudre_compte($db, (string) $state['accountId']) : null;
        if ($rc) {
            $payeurId = (string) ($db[$rc['coll']][$rc['idx']]['id'] ?? '');
            if ($payeurTel === '') $payeurTel = vrt_parr_tel9((string) ($db[$rc['coll']][$rc['idx']]['tel'] ?? ''));
        }

        $commission = 0; $refus = '';
        if ($benef !== '') {
            $pers = vrt_parr_personne($db, $benef);
            $telB = $pers ? vrt_parr_tel9((string) $pers['tel']) : '';
            if (!$pers)                                        $refus = 'bénéficiaire introuvable';
            elseif (empty($pers['actif']))                     $refus = 'bénéficiaire suspendu';
            elseif ($payeurId !== '' && $benef === 'acc:' . $payeurId) $refus = 'auto-parrainage (compte)';
            elseif ($telB !== '' && $telB === $payeurTel)      $refus = 'auto-parrainage (même numéro)';
            if ($refus === '') {
                $pct = max(0, min(50, (int) ($p['commissionPct'] ?? 0)));
                /* L'ASSIETTE. Sur un panier physique, ce qui est payé comprend la
                   LIVRAISON — une avance de frais que le centre reverse au
                   transporteur, pas une vente. Commissionner dessus, c'est payer
                   le parrain sur un colis. `assiette` (les articles, remise
                   déduite) est posée à l'initiation ; elle est bornée ici au
                   montant payé, si bien qu'un navigateur qui la gonflerait ne
                   dépasserait jamais le cas par défaut — il ne peut que la
                   RÉDUIRE, et seulement au détriment de son propre parrain. */
                $assiette = isset($p['assiette']) ? max(0, min($paye, (int) $p['assiette'])) : $paye;
                $commission = min((int) round($assiette * $pct / 100), (int) floor($assiette / 2));
            }
        }

        $maintenant = time();
        $r = vrt_parr_tx(function (array &$reg) use ($ref, $benef, $commission, $paye, $p, $state, $payeurId, $cfg, $refus, $maintenant) {
            $cle = 'r:' . $ref;
            if (isset($reg['ops'][$cle])) return ['deja' => true, 'lienNeuf' => false, 'aVerser' => false];
            $reg['ops'][$cle] = [
                'b' => $benef, 'p' => $payeurId, 'm' => $paye, 'pct' => (int) ($p['commissionPct'] ?? 0),
                'c' => $commission, 'code' => (string) ($p['code'] ?? ''), 'src' => (string) ($p['source'] ?? ''),
                'i' => (string) ($state['intent'] ?? ''), 'l' => mb_substr((string) ($state['label'] ?? ''), 0, 80),
                't' => $maintenant, 'refus' => $refus,
            ];
            $lienNeuf = false;
            if ($benef !== '' && $refus === '') {
                if (!isset($reg['comptes'][$benef]) || !is_array($reg['comptes'][$benef])) {
                    $reg['comptes'][$benef] = ['solde' => 0, 'enCours' => 0, 'gagne' => 0, 'verse' => 0, 'nb' => 0];
                }
                $c = &$reg['comptes'][$benef];
                $c['solde'] = (int) ($c['solde'] ?? 0) + $commission;
                $c['gagne'] = (int) ($c['gagne'] ?? 0) + $commission;
                $c['nb']    = (int) ($c['nb'] ?? 0) + 1;
                $c['maj']   = $maintenant;
                unset($c['blocage']);   // un nouveau crédit relance la tentative de versement
                $c2 = $reg['comptes'][$benef];
                unset($c);
                // Le lien à vie naît au premier paiement avec un code saisi.
                if ($payeurId !== '' && ($p['source'] ?? '') === 'saisie' && ($p['type'] ?? '') !== 'promo'
                    && !isset($reg['liens']['acc:' . $payeurId])) {
                    $reg['liens']['acc:' . $payeurId] = ['b' => $benef, 'c' => (string) ($p['code'] ?? ''), 't' => $maintenant, 'via' => 'paiement'];
                    $lienNeuf = true;
                }
                $aVerser = !empty($cfg['versementAuto']) && (int) $c2['solde'] >= (int) $cfg['seuilVersement']
                           && (int) ($c2['enCours'] ?? 0) === 0;
                return ['deja' => false, 'lienNeuf' => $lienNeuf, 'aVerser' => $aVerser];
            }
            return ['deja' => false, 'lienNeuf' => false, 'aVerser' => false];
        });

        $out['deja']       = !empty($r['deja']);
        $out['benef']      = $benef;
        $out['commission'] = $out['deja'] ? 0 : $commission;
        $out['aVerser']    = !empty($r['aVerser']);
        if ($out['deja']) return $out;

        if (function_exists('vrt_pay_log')) {
            vrt_pay_log('[CODE_AMI] ref=' . $ref . ' code=' . ($p['code'] ?? '') . ' benef=' . $benef
                . ' paye=' . $paye . ' commission=' . $commission . ($refus !== '' ? ' REFUS=' . $refus : ''));
        }

        // Copies de confort dans la base : le parrain du payeur, l'usage d'un code promo.
        if (!empty($r['lienNeuf']) && $rc) {
            $acc = &$db[$rc['coll']][$rc['idx']];
            if (empty($acc['parrainBenef'])) {
                $acc['parrainBenef'] = $benef;
                $acc['parrainCode']  = (string) ($p['code'] ?? '');
                $acc['parrainLe']    = date('Y-m-d');
                $out['dbModifiee'] = true;
            }
            unset($acc);
        }
        if (!empty($p['promo']['code']) && isset($db['promoCodes']) && is_array($db['promoCodes'])) {
            foreach ($db['promoCodes'] as &$pc) {
                if (is_array($pc) && vrt_parr_normaliser((string) ($pc['code'] ?? '')) === vrt_parr_normaliser((string) $p['promo']['code'])) {
                    $pc['usage'] = (int) ($pc['usage'] ?? 0) + 1;
                    $out['dbModifiee'] = true;
                    break;
                }
            }
            unset($pc);
        }
        return $out;
    }

    /**
     * Même crédit, pour un paiement validé À LA MAIN par l'administration
     * (espèces, dépôt Mobile Money sur le numéro du centre). Prend le verrou de
     * la base puisqu'elle peut écrire le lien du payeur.
     */
    function vrt_parr_crediter_fichier(array $state): array {
        $f = vrt_db_file();
        if (!is_file($f)) return ['ok' => false, 'msg' => 'base absente'];
        $fp = @fopen($f, 'c+');
        if (!$fp) return ['ok' => false, 'msg' => 'base inaccessible'];
        if (!flock($fp, LOCK_EX)) { fclose($fp); return ['ok' => false, 'msg' => 'base verrouillée']; }
        try {
            $db = json_decode((string) stream_get_contents($fp), true);
            if (!is_array($db)) return ['ok' => false, 'msg' => 'base illisible'];
            $r = vrt_parr_crediter($db, $state);
            if (!empty($r['dbModifiee'])) {
                $db['lastModified'] = (int) round(microtime(true) * 1000);
                $enc = json_encode($db, JSON_UNESCAPED_UNICODE);
                if ($enc !== false) { ftruncate($fp, 0); rewind($fp); fwrite($fp, $enc); fflush($fp); }
            }
            return ['ok' => true] + $r;
        } finally {
            flock($fp, LOCK_UN);
            fclose($fp);
        }
    }

    /**
     * Remboursement : la commission suit l'argent. Au prorata d'un remboursement
     * partiel. Le solde peut devenir négatif — il se reconstituera sur les
     * ventes suivantes, plutôt que de payer une commission sur une vente annulée.
     */
    function vrt_parr_annuler(string $ref, int $rembourse, string $motif = 'remboursement'): array {
        return vrt_parr_tx(function (array &$reg) use ($ref, $rembourse, $motif) {
            $cle = 'r:' . $ref;
            $op = $reg['ops'][$cle] ?? null;
            if (!is_array($op) || !empty($op['annule']) || empty($op['b']) || (int) ($op['c'] ?? 0) <= 0) {
                return ['annule' => 0];
            }
            $paye = max(1, (int) ($op['m'] ?? 1));
            $part = $rembourse > 0 ? min(1, $rembourse / $paye) : 1;
            $retire = (int) round((int) $op['c'] * $part);
            $b = (string) $op['b'];
            if (isset($reg['comptes'][$b]) && is_array($reg['comptes'][$b])) {
                $reg['comptes'][$b]['solde'] = (int) ($reg['comptes'][$b]['solde'] ?? 0) - $retire;
                $reg['comptes'][$b]['gagne'] = (int) ($reg['comptes'][$b]['gagne'] ?? 0) - $retire;
            }
            $reg['ops'][$cle]['annule'] = $retire;
            $reg['ops'][$cle]['motifAnnulation'] = mb_substr($motif, 0, 80);
            return ['annule' => $retire];
        });
    }

    // ════════════════════════════════════════════════════════════════════
    // 7. VERSEMENTS
    // ════════════════════════════════════════════════════════════════════
    /** Le numéro et l'opérateur où verser ; le motif sinon. */
    function vrt_parr_destination(array $db, array $reg, string $benef): array {
        $pers = vrt_parr_personne($db, $benef);
        if (!$pers) return ['ok' => false, 'motif' => 'bénéficiaire introuvable'];
        $tel = (string) ($reg['comptes'][$benef]['tel'] ?? '');
        if ($tel === '') $tel = (string) $pers['tel'];
        $t9 = vrt_parr_tel9($tel);
        if ($t9 === '') return ['ok' => false, 'motif' => 'Numéro Mobile Money absent : renseignez-le dans « Mon code ami ».'];
        $m = vrt_parr_methode($t9);
        if ($m === '') return ['ok' => false, 'motif' => 'Ce numéro n’est ni MTN ni Orange : renseignez un numéro Mobile Money.'];
        $nom = trim($pers['pre'] . ' ' . $pers['nom']);
        return ['ok' => true, 'tel' => '237' . $t9, 'methode' => $m, 'nom' => $nom !== '' ? $nom : 'Parrain VÉRITAS'];
    }

    /** Les bénéficiaires dont le solde a atteint le seuil, sans versement en vol. */
    function vrt_parr_a_verser(array $db, array $reg): array {
        $cfg = vrt_parr_cfg($db, $reg);
        $out = [];
        foreach (($reg['comptes'] ?? []) as $b => $c) {
            if (!is_array($c)) continue;
            if ((int) ($c['solde'] ?? 0) >= (int) $cfg['seuilVersement'] && (int) ($c['enCours'] ?? 0) === 0) $out[] = (string) $b;
        }
        return $out;
    }

    /**
     * Réserve le solde d'un bénéficiaire pour un versement : solde → enCours.
     * Sans réservation, deux webhooks simultanés verseraient deux fois le même
     * solde. Renvoie la ligne de versement, ou null s'il n'y a rien à faire.
     */
    function vrt_parr_reserver(string $benef, array $dest, int $seuil, int $plafond): ?array {
        return vrt_parr_tx(function (array &$reg) use ($benef, $dest, $seuil, $plafond) {
            $c = $reg['comptes'][$benef] ?? null;
            if (!is_array($c)) return null;
            $solde = (int) ($c['solde'] ?? 0);
            if ($solde < $seuil || (int) ($c['enCours'] ?? 0) > 0) return null;
            $montant = min($solde, max($seuil, $plafond));
            $pref = 'PAR-' . strtoupper(base_convert((string) time(), 10, 36)) . '-' . strtoupper(bin2hex(random_bytes(3)));
            $reg['comptes'][$benef]['solde']   = $solde - $montant;
            $reg['comptes'][$benef]['enCours'] = $montant;
            $reg['comptes'][$benef]['versementRef'] = $pref;
            $ligne = ['ref' => $pref, 'b' => $benef, 'm' => $montant, 'tel' => $dest['tel'], 'meth' => $dest['methode'],
                      'nom' => $dest['nom'], 'etat' => 'prepare', 't' => time(), 'maj' => time()];
            $reg['versements']['v:' . $pref] = $ligne;
            return $ligne;
        });
    }

    /**
     * Suite d'un versement.
     *   soumis   → le lot est chez CamerPay (approbation manuelle < 4 h ouvrées) ;
     *   verse    → l'argent est parti : enCours → versé ;
     *   echec    → refus CLAIR de l'opérateur : enCours revient au solde ;
     *   incertain→ réponse perdue (réseau) : on GARDE la réservation — rendre le
     *              solde relancerait un second versement alors que le premier
     *              est peut-être parti. L'administration tranche.
     */
    function vrt_parr_versement_etat(string $pref, string $etat, string $raison = '', string $batch = ''): bool {
        return (bool) vrt_parr_tx(function (array &$reg) use ($pref, $etat, $raison, $batch) {
            $k = 'v:' . $pref;
            if (!isset($reg['versements'][$k]) || !is_array($reg['versements'][$k])) return false;
            $v = &$reg['versements'][$k];
            $avant = (string) ($v['etat'] ?? '');
            if (in_array($avant, ['verse', 'echec'], true)) { unset($v); return false; }   // état final : on ne revient pas dessus
            $b = (string) $v['b']; $m = (int) $v['m'];
            $v['etat'] = $etat; $v['maj'] = time();
            if ($raison !== '') $v['raison'] = mb_substr($raison, 0, 200);
            if ($batch !== '')  $v['batch']  = $batch;
            unset($v);
            if (!isset($reg['comptes'][$b]) || !is_array($reg['comptes'][$b])) return true;
            $c = &$reg['comptes'][$b];
            if ($etat === 'verse') {
                $c['enCours'] = max(0, (int) ($c['enCours'] ?? 0) - $m);
                $c['verse']   = (int) ($c['verse'] ?? 0) + $m;
                $c['dernierVersement'] = time();
                unset($c['versementRef'], $c['blocage']);
            } elseif ($etat === 'echec') {
                $c['enCours'] = max(0, (int) ($c['enCours'] ?? 0) - $m);
                $c['solde']   = (int) ($c['solde'] ?? 0) + $m;
                $c['blocage'] = 'Dernier versement refusé : ' . mb_substr($raison !== '' ? $raison : 'motif non communiqué', 0, 140);
                unset($c['versementRef']);
            }
            unset($c);
            return true;
        });
    }

    /** Une impossibilité de verser (numéro absent…) doit se LIRE : chez le parrain et chez l'administrateur. */
    function vrt_parr_bloquer(string $benef, string $motif): void {
        vrt_parr_tx(function (array &$reg) use ($benef, $motif) {
            if (!isset($reg['comptes'][$benef]) || !is_array($reg['comptes'][$benef])) return;
            $reg['comptes'][$benef]['blocage'] = mb_substr($motif, 0, 160);
        });
    }

    /** Le parrain choisit où recevoir son argent. */
    function vrt_parr_definir_numero(string $benef, string $tel): array {
        $t9 = vrt_parr_tel9($tel);
        if ($t9 === '' || vrt_parr_methode($t9) === '') {
            return ['ok' => false, 'error' => 'Numéro MTN ou Orange attendu (9 chiffres, ex. 6 77 00 00 00).'];
        }
        vrt_parr_tx(function (array &$reg) use ($benef, $t9) {
            if (!isset($reg['comptes'][$benef]) || !is_array($reg['comptes'][$benef])) {
                $reg['comptes'][$benef] = ['solde' => 0, 'enCours' => 0, 'gagne' => 0, 'verse' => 0, 'nb' => 0];
            }
            $reg['comptes'][$benef]['tel'] = $t9;
            unset($reg['comptes'][$benef]['blocage']);
        });
        return ['ok' => true, 'tel' => $t9, 'methode' => vrt_parr_methode($t9)];
    }

    // ════════════════════════════════════════════════════════════════════
    // 8. CE QU'ON MONTRE
    // ════════════════════════════════════════════════════════════════════
    function vrt_parr_masquer_tel(string $t9): string {
        return strlen($t9) === 9 ? substr($t9, 0, 3) . ' ·· ·· ' . substr($t9, 7, 2) : '';
    }

    /** L'écran « Mon code ami » : ce que le propriétaire a le droit de voir, rien d'autre. */
    function vrt_parr_resume(array $db, array $reg, string $benef): array {
        $cfg  = vrt_parr_cfg($db, $reg);
        $pers = vrt_parr_personne($db, $benef);
        $code = '';
        if ($pers) $code = $pers['code'] !== '' ? vrt_parr_normaliser($pers['code']) : vrt_parr_code_pour_id($pers['id']);
        $c = (isset($reg['comptes'][$benef]) && is_array($reg['comptes'][$benef])) ? $reg['comptes'][$benef] : [];

        $filleuls = 0;
        foreach (($reg['liens'] ?? []) as $l) { if (is_array($l) && ($l['b'] ?? '') === $benef) $filleuls++; }

        $ops = [];
        foreach (($reg['ops'] ?? []) as $o) {
            if (!is_array($o) || ($o['b'] ?? '') !== $benef || !empty($o['refus'])) continue;
            $ops[] = ['date' => date('Y-m-d', (int) ($o['t'] ?? 0)), 'paye' => (int) ($o['m'] ?? 0),
                      'commission' => (int) ($o['c'] ?? 0) - (int) ($o['annule'] ?? 0),
                      'quoi' => (string) ($o['l'] ?? $o['i'] ?? ''), 'annule' => !empty($o['annule'])];
        }
        usort($ops, function ($a, $b) { return strcmp($b['date'], $a['date']); });

        $vers = [];
        foreach (($reg['versements'] ?? []) as $v) {
            if (!is_array($v) || ($v['b'] ?? '') !== $benef) continue;
            $vers[] = ['date' => date('Y-m-d', (int) ($v['t'] ?? 0)), 'montant' => (int) ($v['m'] ?? 0),
                       'etat' => (string) ($v['etat'] ?? ''), 'raison' => (string) ($v['raison'] ?? '')];
        }
        usort($vers, function ($a, $b) { return strcmp($b['date'], $a['date']); });

        $dest = vrt_parr_destination($db, $reg, $benef);
        return [
            'ok' => true, 'code' => $code,
            'lien' => 'https://veritas-school.com/?ref=' . rawurlencode($code),
            'regle' => ['remisePct' => $cfg['remisePct'], 'commissionPct' => $cfg['commissionPct'],
                        'seuilVersement' => $cfg['seuilVersement'], 'versementAuto' => $cfg['versementAuto'], 'actif' => $cfg['actif']],
            'solde' => (int) ($c['solde'] ?? 0), 'enCours' => (int) ($c['enCours'] ?? 0),
            'gagne' => (int) ($c['gagne'] ?? 0), 'verse' => (int) ($c['verse'] ?? 0),
            'ventes' => (int) ($c['nb'] ?? 0), 'filleuls' => $filleuls,
            'numero' => !empty($dest['ok']) ? vrt_parr_masquer_tel(substr($dest['tel'], 3)) : '',
            'operateur' => !empty($dest['ok']) ? ($dest['methode'] === 'mtn_momo' ? 'MTN MoMo' : 'Orange Money') : '',
            'blocage' => (string) ($c['blocage'] ?? (!empty($dest['ok']) ? '' : ($dest['motif'] ?? ''))),
            'operations' => array_slice($ops, 0, 30), 'versements' => array_slice($vers, 0, 20),
        ];
    }

    /** Le tableau de bord de l'administration. */
    function vrt_parr_resume_admin(array $db, array $reg): array {
        $cfg = vrt_parr_cfg($db, $reg);
        $filleuls = [];
        foreach (($reg['liens'] ?? []) as $l) { if (is_array($l) && !empty($l['b'])) $filleuls[$l['b']] = ($filleuls[$l['b']] ?? 0) + 1; }
        $t = ['du' => 0, 'enCours' => 0, 'verse' => 0, 'gagne' => 0, 'parrains' => 0, 'filleuls' => array_sum($filleuls),
              'ventes' => 0, 'encaisse' => 0];
        $lignes = [];
        foreach (($reg['comptes'] ?? []) as $b => $c) {
            if (!is_array($c)) continue;
            $b = (string) $b;
            $pers = vrt_parr_personne($db, $b);
            $t['du'] += max(0, (int) ($c['solde'] ?? 0)); $t['enCours'] += (int) ($c['enCours'] ?? 0);
            $t['verse'] += (int) ($c['verse'] ?? 0); $t['gagne'] += (int) ($c['gagne'] ?? 0); $t['parrains']++;
            $lignes[] = ['benef' => $b, 'nom' => $pers ? trim($pers['pre'] . ' ' . $pers['nom']) : '(introuvable)',
                         'code' => $pers ? ($pers['code'] !== '' ? $pers['code'] : vrt_parr_code_pour_id($pers['id'])) : '',
                         'solde' => (int) ($c['solde'] ?? 0), 'enCours' => (int) ($c['enCours'] ?? 0),
                         'gagne' => (int) ($c['gagne'] ?? 0), 'verse' => (int) ($c['verse'] ?? 0),
                         'ventes' => (int) ($c['nb'] ?? 0), 'filleuls' => (int) ($filleuls[$b] ?? 0),
                         'blocage' => (string) ($c['blocage'] ?? '')];
        }
        usort($lignes, function ($a, $b) { return $b['gagne'] - $a['gagne']; });
        $ops = [];
        foreach (($reg['ops'] ?? []) as $k => $o) {
            if (!is_array($o)) continue;
            $t['ventes']++; $t['encaisse'] += (int) ($o['m'] ?? 0);
            $ops[] = ['ref' => substr((string) $k, 2), 't' => (int) ($o['t'] ?? 0), 'benef' => (string) ($o['b'] ?? ''),
                      'code' => (string) ($o['code'] ?? ''), 'paye' => (int) ($o['m'] ?? 0), 'commission' => (int) ($o['c'] ?? 0),
                      'refus' => (string) ($o['refus'] ?? ''), 'annule' => (int) ($o['annule'] ?? 0), 'quoi' => (string) ($o['l'] ?? '')];
        }
        usort($ops, function ($a, $b) { return $b['t'] - $a['t']; });
        $vers = [];
        foreach (($reg['versements'] ?? []) as $v) {
            if (!is_array($v)) continue;
            $vers[] = ['ref' => (string) ($v['ref'] ?? ''), 't' => (int) ($v['t'] ?? 0), 'benef' => (string) ($v['b'] ?? ''),
                       'nom' => (string) ($v['nom'] ?? ''), 'montant' => (int) ($v['m'] ?? 0), 'etat' => (string) ($v['etat'] ?? ''),
                       'raison' => (string) ($v['raison'] ?? ''), 'numero' => vrt_parr_masquer_tel(vrt_parr_tel9((string) ($v['tel'] ?? '')))];
        }
        usort($vers, function ($a, $b) { return $b['t'] - $a['t']; });
        return ['ok' => true, 'regle' => $cfg, 'totaux' => $t, 'parrains' => array_slice($lignes, 0, 200),
                'operations' => array_slice($ops, 0, 100), 'versements' => array_slice($vers, 0, 100)];
    }
}
