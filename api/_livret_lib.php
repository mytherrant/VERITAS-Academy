<?php
/**
 * api/_livret_lib.php — REGISTRE DES CODES D'ACCÈS AUX LIVRETS EN LIGNE
 * © 2024-2026 Jacques Miterand TAKOU (Mythe Errant). Tous droits réservés.
 *
 * Bibliothèque partagée par :
 *   • api/livret.php   — la porte (déverrouillage, session, contenu, admin)
 *   • api/_auth_lib.php — vrt_grant_entitlement() : un paiement confirmé émet
 *     automatiquement le code qui débloque le manuel acheté.
 *
 * POURQUOI UNE EMPREINTE À CLÉ ET NON UN BCRYPT
 *   Un bcrypt par code obligerait, à chaque tentative, à tester toute la base
 *   (impossible passé quelques centaines de codes). Un sha256 nu se force hors
 *   ligne en quelques heures sur un alphabet de 31 caractères. On indexe donc
 *   par HMAC-SHA256(code, VRT_HMAC_KEY) : recherche en O(1), et un registre volé
 *   sans la clé du serveur ne se retourne pas.
 *
 * Ce fichier n'inclut RIEN (pas de dépendance circulaire avec _auth_lib.php) :
 *   il lit VRT_HMAC_KEY au moment de l'appel, jamais au chargement.
 */
declare(strict_types=1);

if (!defined('VRT_LIVRET_LIB')) {
    define('VRT_LIVRET_LIB', '1.0');

    /* ── CATALOGUE DES OUVRAGES ───────────────────────────────────────────────
       Au départ, cinq classes étaient écrites en dur ici. Publier un sixième
       ouvrage — un Bord, un cahier d'œuvre, un cahier EST — demandait donc de
       modifier ce fichier, de le redéployer, et de n'oublier ni le tarif ni la
       liste côté client. Le catalogue est maintenant une DONNÉE, produite par
       tools/publier.py et déposée en `api/data/livrets_catalogue.json`.

       Repli sur les cinq classes d'origine si le fichier est absent : un
       catalogue manquant ne doit jamais fermer les accès déjà vendus.

       Forme d'une entrée :
         "balafon": { "titre":"Balafon — étude intégrale", "niveau":"1ère",
                      "mode":"lecture", "kinds":["livret"], "prix":2000 }        */
    function vrt_livret_catalogue(): array {
        static $cache = null;
        if ($cache !== null) return $cache;

        $repli = [
            '6e'   => ['titre' => '6ᵉ',        'niveau' => '6e',   'mode' => 'interactif', 'kinds' => ['livret', 'guide']],
            '5e'   => ['titre' => '5ᵉ',        'niveau' => '5e',   'mode' => 'interactif', 'kinds' => ['livret', 'guide']],
            '4e'   => ['titre' => '4ᵉ',        'niveau' => '4e',   'mode' => 'interactif', 'kinds' => ['livret', 'guide']],
            '3e'   => ['titre' => '3ᵉ (BEPC)', 'niveau' => '3e',   'mode' => 'interactif', 'kinds' => ['livret', 'guide']],
            '2nde' => ['titre' => '2ⁿᵈᵉ A',    'niveau' => '2nde', 'mode' => 'interactif', 'kinds' => ['livret', 'guide']],
        ];

        /* Le chemin est surchargeable, pour la MÊME raison que VRT_LIVRET_DIR
           l'est pour le registre : api/data/ est l'état vivant du serveur —
           registre des codes, paiements — volontairement hors dépôt et hors
           copie CI, pour qu'un déploiement ne l'écrase jamais. Le catalogue s'y
           dépose par FTP.

           Conséquence pour les bancs : sur une machine d'intégration, ce
           fichier n'existe PAS et `vrt_livret_catalogue()` retombe sur les cinq
           classes de repli. Un banc qui affirmait « bord-6e est au catalogue »
           passait donc en local et échouait en CI — ce qui a bloqué le
           déploiement du 26/08/2026, à juste titre : le banc testait l'état de
           la machine au lieu de la règle. Avec cette constante, il fournit son
           propre catalogue et devient déterministe partout. */
        $f = defined('VRT_LIVRET_CATALOGUE')
           ? (string) VRT_LIVRET_CATALOGUE
           : __DIR__ . '/data/livrets_catalogue.json';
        if (!is_file($f)) { $cache = $repli; return $cache; }
        $d = json_decode((string) @file_get_contents($f), true);
        if (!is_array($d) || !isset($d['ouvrages']) || !is_array($d['ouvrages']) || !$d['ouvrages']) {
            $cache = $repli; return $cache;
        }

        $out = [];
        foreach ($d['ouvrages'] as $slug => $o) {
            $slug = (string) preg_replace('/[^a-z0-9_-]/', '', strtolower((string) $slug));
            if ($slug === '' || !is_array($o)) continue;
            $kinds = [];
            foreach ((array) ($o['kinds'] ?? ['livret']) as $k) {
                if (in_array($k, ['livret', 'guide'], true)) $kinds[] = $k;
            }
            $out[$slug] = [
                'titre'  => (string) ($o['titre'] ?? $slug),
                'niveau' => (string) ($o['niveau'] ?? ''),
                'mode'   => ((string) ($o['mode'] ?? 'interactif')) === 'lecture' ? 'lecture' : 'interactif',
                'kinds'  => $kinds ?: ['livret'],
                'prix'   => (int) ($o['prix'] ?? 0),          // 0 = tarif général
                'prixGuide' => (int) ($o['prixGuide'] ?? 0),
                'pages'  => (int) ($o['pages'] ?? 0),          // mode lecture
                'pagesLibres' => (int) ($o['pagesLibres'] ?? 0),
            ];
        }
        // Les cinq d'origine restent servis même si le catalogue les oublie :
        // des codes sont déjà vendus dessus.
        foreach ($repli as $slug => $o) { if (!isset($out[$slug])) $out[$slug] = $o; }
        $cache = $out;
        return $cache;
    }

    /** Ouvrages ouverts à la vente — `slug => libellé`. Le nom historique est
     *  conservé : une trentaine d'appels s'y réfèrent, et un « ouvrage » ici
     *  reste, dans l'immense majorité des cas, une classe. */
    function vrt_livret_classes(): array {
        $out = [];
        foreach (vrt_livret_catalogue() as $slug => $o) { $out[$slug] = (string) $o['titre']; }
        return $out;
    }

    /** Un ouvrage donné accepte-t-il cette nature de code ? */
    function vrt_livret_ouvrage_accepte(string $slug, string $kind): bool {
        $c = vrt_livret_catalogue();
        return isset($c[$slug]) && in_array($kind, (array) $c[$slug]['kinds'], true);
    }
    /** Natures de document — un code d'une nature n'ouvre jamais l'autre. */
    function vrt_livret_kinds(): array {
        return ['livret' => 'Livret de l\'élève', 'guide' => 'Guide de l\'enseignant'];
    }

    /* ── TARIFS ───────────────────────────────────────────────────────────────
       Le livret de l'élève et le guide de l'enseignant ne valent pas la même
       chose : le premier ouvre les exercices d'une classe, le second ouvre LES
       CORRIGÉS COMPLETS (463 pour la seule 6ᵉ) et la console de devoirs. Les
       vendre au même prix bradait le second — et incitait à acheter un code
       enseignant pour avoir les corrigés du livret à moindre coût.
       Réglables en base sans redéploiement : DB.tarifs.livret / livretGuide. */
    function vrt_livret_prix(array $db, string $kind = 'livret', string $slug = ''): int {
        // Un ouvrage peut porter son propre tarif (un cahier d'œuvre intégrale
        // n'a pas le format d'un livret d'activités). Il l'emporte sur le tarif
        // général — mais reste une DONNÉE du catalogue, pas un chiffre en dur.
        if ($slug !== '') {
            $c = vrt_livret_catalogue();
            if (isset($c[$slug])) {
                $p = (int) ($kind === 'guide' ? $c[$slug]['prixGuide'] : $c[$slug]['prix']);
                if ($p > 0) return $p;
            }
        }
        if ($kind === 'guide') {
            $p = (int) ($db['tarifs']['livretGuide'] ?? 0);
            return $p > 0 ? $p : 5000;
        }
        $p = (int) ($db['tarifs']['livret'] ?? 0);
        return $p > 0 ? $p : 1500;
    }

    /** Remise de volume d'un pack établissement, en pourcentage. */
    function vrt_livret_remise_pack(int $n): int {
        if ($n >= 50) return 20;
        if ($n >= 25) return 15;
        if ($n >= 10) return 10;
        return 0;
    }

    /** Prix d'un pack de N codes. C'est la RÉFÉRENCE serveur : le navigateur
     *  peut afficher ce qu'il veut, c'est ce montant-ci qui autorise. */
    function vrt_livret_prix_pack(array $db, string $kind, int $n, string $slug = ''): int {
        $n = max(1, min(500, $n));
        $unite = vrt_livret_prix($db, $kind, $slug);
        $brut  = $unite * $n;
        return (int) round($brut * (100 - vrt_livret_remise_pack($n)) / 100);
    }

    function vrt_livret_log(string $line): void {
        $dir = defined('VRT_LIVRET_DIR') ? (string) VRT_LIVRET_DIR : __DIR__ . '/data';
        if (!is_dir($dir)) { @mkdir($dir, 0775, true); }
        @file_put_contents($dir . '/_livret_log.txt', date('c') . ' ' . $line . "\n", FILE_APPEND);
    }

    // ── Registre ─────────────────────────────────────────────────────────────
    /* Le registre des codes vit dans api/data/ par defaut. Le chemin est
       surchargeable par VRT_LIVRET_DIR pour deux raisons concretes : le
       deplacer HORS de la racine web si api/data/ venait a etre servi, et
       permettre au test des surfaces payantes d'emettre de vrais codes sans
       jamais toucher au registre de production — l'idempotence par reference
       est un FICHIER : sans cette bascule, relancer le test sur le serveur
       echouerait, ou pire, ecraserait des codes deja vendus. */
    function vrt_livret_registre_fichier(): string {
        $dir = defined('VRT_LIVRET_DIR') ? (string) VRT_LIVRET_DIR : __DIR__ . '/data';
        if (!is_dir($dir)) { @mkdir($dir, 0775, true); }
        return $dir . '/livret_codes.json';
    }

    function vrt_livret_registre_charger(): array {
        $f = vrt_livret_registre_fichier();
        if (!is_file($f)) return ['version' => 1, 'codes' => []];
        $d = json_decode((string) @file_get_contents($f), true);
        if (!is_array($d) || !isset($d['codes']) || !is_array($d['codes'])) {
            return ['version' => 1, 'codes' => []];
        }
        return $d;
    }

    /** Écriture atomique (temp + rename) : jamais de registre à moitié écrit. */
    function vrt_livret_registre_ecrire(array $reg): bool {
        $f   = vrt_livret_registre_fichier();
        $tmp = $f . '.tmp';
        $ok  = @file_put_contents($tmp, json_encode($reg, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT), LOCK_EX);
        if ($ok === false) return false;
        if (!@rename($tmp, $f)) { @unlink($tmp); return false; }
        @chmod($f, 0640);   // lisible par PHP seul — pas par un listing FTP tiers
        return true;
    }

    /** Saisie tolérante : minuscules, espaces et tirets absents sont acceptés. */
    function vrt_livret_normaliser(string $code): string {
        return (string) preg_replace('/[^A-Z0-9]/', '', strtoupper(trim($code)));
    }

    /** Index du registre — HMAC à clé, jamais le code en clair. */
    function vrt_livret_cle(string $code): string {
        $k = defined('VRT_HMAC_KEY') ? (string) VRT_HMAC_KEY : '';
        if ($k === '') return '';   // sans clé, aucune correspondance possible (fail-closed)
        return hash_hmac('sha256', vrt_livret_normaliser($code), $k);
    }

    /** Alphabet sans caractères ambigus (ni O/0, ni I/1/L) : un code se dicte au téléphone. */
    function vrt_livret_alphabet(): string { return 'ABCDEFGHJKMNPQRSTUVWXYZ23456789'; }

    function vrt_livret_generer_code(string $classe): string {
        $A = vrt_livret_alphabet();
        $n = strlen($A);
        $bloc = static function (int $len) use ($A, $n): string {
            $s = '';
            for ($i = 0; $i < $len; $i++) { $s .= $A[random_int(0, $n - 1)]; }
            return $s;
        };
        return 'VRT-' . strtoupper($classe) . '-' . $bloc(4) . '-' . $bloc(4);
    }

    /**
     * Émet N codes et les inscrit au registre.
     *
     * @param array $o classe, kind, n, jours, label, ref (référence de paiement, facultatif)
     * @return array {ok, codes:[clair…], lot, expire, erreur?}
     */
    function vrt_livret_emettre(array $o): array {
        if (!defined('VRT_HMAC_KEY') || strlen((string) VRT_HMAC_KEY) < 16) {
            return ['ok' => false, 'codes' => [], 'erreur' => 'cle_absente'];
        }
        $classe = (string) ($o['classe'] ?? '');
        $kind   = (string) ($o['kind'] ?? 'livret');
        $n      = max(1, min(500, (int) ($o['n'] ?? 1)));
        $jours  = max(1, min(3650, (int) ($o['jours'] ?? 365)));
        $label  = substr(trim((string) ($o['label'] ?? '')), 0, 80);
        $ref    = substr(trim((string) ($o['ref'] ?? '')), 0, 40);
        if (!isset(vrt_livret_classes()[$classe])) return ['ok' => false, 'codes' => [], 'erreur' => 'classe'];
        if (!isset(vrt_livret_kinds()[$kind]))     return ['ok' => false, 'codes' => [], 'erreur' => 'kind'];
        /* Un ouvrage n'accepte pas forcément les deux versions : un Bord ou un
           cahier d'œuvre se vend SANS guide de l'enseignant (`kinds:["livret"]`).
           Émettre quand même un code « guide » produit un code parfaitement
           valide — qui n'ouvre RIEN, puisqu'il n'y a pas de guide derrière.

           Ce n'était pas théorique : les DEUX chemins d'émission passaient au
           travers. `admin_gen` acceptait `bord-6e` + `guide` (200), et surtout
           un paiement d'intention `livret` avec la cible `bord-6e:guide` était
           tarifé au prix d'un guide (5 000 F par défaut) puis honoré. Argent
           encaissé, rien délivré, et aucun message pour le dire.

           `vrt_livret_ouvrage_accepte()` était écrite depuis le début et
           n'était appelée de NULLE PART — une garde morte. On la branche ici,
           au seul point de passage commun au webhook et à l'administration :
           il n'y a donc pas deux règles à tenir en cohérence. */
        if (!vrt_livret_ouvrage_accepte($classe, $kind)) {
            return ['ok' => false, 'codes' => [], 'erreur' => 'kind_ouvrage'];
        }

        $reg = vrt_livret_registre_charger();

        // Idempotence : un webhook rejoué ne doit pas émettre un second code pour
        // le même paiement. C'est la panne classique des passerelles mobiles, qui
        // renvoient la notification jusqu'à obtenir un 200.
        if ($ref !== '') {
            foreach ($reg['codes'] as $e) {
                if (is_array($e) && (string) ($e['ref'] ?? '') === $ref) {
                    return ['ok' => true, 'codes' => [], 'deja' => true, 'lot' => (string) ($e['lot'] ?? ''),
                            'expire' => (int) ($e['exp'] ?? 0)];
                }
            }
        }

        $lot  = 'L' . date('ymd') . '-' . substr(bin2hex(random_bytes(3)), 0, 5);
        $exp  = time() + $jours * 86400;
        $clairs = [];
        for ($i = 0; $i < $n; $i++) {
            // Collision improbable (31^8 ≈ 8,5·10¹¹) mais gérée : on retire.
            $garde = 0;
            do {
                $code = vrt_livret_generer_code($classe);
                $cle  = vrt_livret_cle($code);
            } while (isset($reg['codes'][$cle]) && ++$garde < 8);
            if ($cle === '') return ['ok' => false, 'codes' => [], 'erreur' => 'cle_absente'];
            $reg['codes'][$cle] = [
                'c'   => $classe,
                't'   => $kind,
                'exp' => $exp,
                'st'  => 'actif',
                'lb'  => $label !== '' ? $label : $lot,
                'lot' => $lot,
                'ref' => $ref,
                'cr'  => time(),
                'dev' => [],   // empreintes de poste → horodatage du premier usage
                'use' => 0,
                'sid' => '',   // session active (voir livret.php : une seule à la fois)
            ];
            $clairs[] = $code;
        }
        if (!vrt_livret_registre_ecrire($reg)) {
            return ['ok' => false, 'codes' => [], 'erreur' => 'io'];
        }
        vrt_livret_log('[EMISSION] lot=' . $lot . ' classe=' . $classe . ' kind=' . $kind
            . ' n=' . $n . ($ref !== '' ? ' ref=' . $ref : ''));
        return ['ok' => true, 'codes' => $clairs, 'lot' => $lot, 'expire' => $exp];
    }

    // ── Bon de livraison d'une vente ─────────────────────────────────────────
    // Le code émis par un paiement doit parvenir à l'ACHETEUR, et à lui seul.
    // On ne peut pas le renvoyer par `payment_*.php?action=status` : cette action
    // est volontairement non authentifiée et les références y sont énumérables
    // (préfixe + date + 4 caractères). On dépose donc le code dans un fichier par
    // référence, que le navigateur de l'acheteur réclame en prouvant qu'il
    // connaît AUSSI le numéro qui a payé (4 derniers chiffres).

    function vrt_livret_vente_fichier(string $ref): string {
        $dir = (defined('VRT_LIVRET_DIR') ? (string) VRT_LIVRET_DIR : __DIR__ . '/data') . '/livret_ventes';
        if (!is_dir($dir)) { @mkdir($dir, 0750, true); }
        // Nom de fichier dérivé, jamais la référence brute : aucun chemin venu
        // du réseau ne touche le disque.
        return $dir . '/' . hash('sha256', strtoupper(trim($ref))) . '.json';
    }

    /** Empreinte des 4 derniers chiffres du numéro payeur (jamais le numéro entier). */
    function vrt_livret_tel4_hash(string $tel): string {
        $chiffres = (string) preg_replace('/\D+/', '', $tel);
        if (strlen($chiffres) < 4) return '';
        $k = defined('VRT_HMAC_KEY') ? (string) VRT_HMAC_KEY : '';
        return hash_hmac('sha256', substr($chiffres, -4), $k);
    }

    function vrt_livret_vente_ecrire(string $ref, array $data): bool {
        $f = vrt_livret_vente_fichier($ref);
        $ok = @file_put_contents($f, json_encode($data, JSON_UNESCAPED_UNICODE), LOCK_EX);
        if ($ok === false) return false;
        @chmod($f, 0640);
        return true;
    }

    function vrt_livret_vente_lire(string $ref): ?array {
        $f = vrt_livret_vente_fichier($ref);
        if (!is_file($f)) return null;
        $d = json_decode((string) @file_get_contents($f), true);
        return is_array($d) ? $d : null;
    }

    // ── Empreinte de poste et jetons ─────────────────────────────────────────
    // Ici plutôt que dans livret.php : api/collab.php doit vérifier EXACTEMENT
    // les mêmes jetons. Deux implémentations auraient divergé — et une divergence
    // sur une vérification de signature, c'est une porte qui s'entrouvre.

    /** IP + agent hachés avec la clé HMAC : rien d'identifiant n'est stocké, mais
     *  un jeton ne vaut que depuis le poste qui l'a obtenu. */
    function vrt_livret_empreinte(): string {
        $ip = function_exists('vrt_client_ip') ? vrt_client_ip() : (string) ($_SERVER['REMOTE_ADDR'] ?? '');
        $ua = substr((string) ($_SERVER['HTTP_USER_AGENT'] ?? ''), 0, 120);
        return substr(hash_hmac('sha256', $ip . '|' . $ua, VRT_HMAC_KEY), 0, 16);
    }

    function vrt_livret_jeton_emettre(array $entry, string $cle, string $sid, int $ttl): array {
        $exp = time() + $ttl;
        $payload = [
            's'   => 'livret',
            'c'   => (string) ($entry['c'] ?? ''),   // classe — le client ne la choisit pas
            'k'   => (string) ($entry['t'] ?? 'livret'), // nature — idem
            'id'  => substr($cle, 0, 12),             // identifiant du code (filigrane, journal, auteur)
            'sid' => $sid,                            // session active (anti-partage)
            'lb'  => (string) ($entry['lb'] ?? ''),
            'exp' => $exp,
            'fp'  => vrt_livret_empreinte(),
        ];
        $body = vrt_b64url_encode(json_encode($payload, JSON_UNESCAPED_UNICODE));
        $sig  = vrt_b64url_encode(hash_hmac('sha256', 'LIVRET|' . $body, VRT_HMAC_KEY, true));
        return ['token' => $body . '.' . $sig, 'exp' => $exp];
    }

    function vrt_livret_jeton_verifier(string $token): ?array {
        $parts = explode('.', $token);
        if (count($parts) !== 2) return null;
        $attendu = vrt_b64url_encode(hash_hmac('sha256', 'LIVRET|' . $parts[0], VRT_HMAC_KEY, true));
        if (!hash_equals($attendu, $parts[1])) return null;
        $payload = json_decode(vrt_b64url_decode($parts[0]), true);
        if (!is_array($payload)) return null;
        if (($payload['s'] ?? '') !== 'livret') return null;
        if ((int) ($payload['exp'] ?? 0) < time()) return null;
        if (!hash_equals((string) ($payload['fp'] ?? ''), vrt_livret_empreinte())) return null;
        return $payload;
    }

    // ── Durée de vie d'un code : prolongation et échéance ────────────────────

    /** Renseignements publics sur un code, depuis son identifiant court. */
    function vrt_livret_infos_code(string $id): ?array {
        $reg = vrt_livret_registre_charger();
        foreach ($reg['codes'] as $cle => $e) {
            if (substr((string) $cle, 0, 12) !== $id) continue;
            return ['classe' => (string) ($e['c'] ?? ''), 'kind' => (string) ($e['t'] ?? 'livret'),
                    'exp' => (int) ($e['exp'] ?? 0), 'statut' => (string) ($e['st'] ?? ''),
                    'cree' => (int) ($e['cr'] ?? 0)];
        }
        return null;
    }

    /** Jours restants avant échéance ; -1 si le code n'expire pas, null s'il est inconnu. */
    function vrt_livret_jours_restants(string $id): ?int {
        $i = vrt_livret_infos_code($id);
        if ($i === null) return null;
        if ($i['exp'] <= 0) return -1;
        return (int) max(0, ceil(($i['exp'] - time()) / 86400));
    }

    /**
     * Prolonge un code de N jours — la récompense de parrainage la moins chère
     * qui soit : le coût marginal d'un mois d'accès supplémentaire est nul, là
     * où une commission en espèces suppose un virement, une comptabilité et un
     * risque de fraude. Plafonné pour qu'un code ne devienne pas perpétuel.
     *
     * @return int|null nouvelle échéance, ou null si rien n'a pu être fait
     */
    function vrt_livret_prolonger(string $id, int $jours, int $plafondJours = 0): ?int {
        if ($jours <= 0) return null;
        $reg = vrt_livret_registre_charger();
        foreach ($reg['codes'] as $cle => $e) {
            if (substr((string) $cle, 0, 12) !== $id) continue;
            if (!is_array($e) || (string) ($e['st'] ?? '') !== 'actif') return null;

            $base = (int) ($e['exp'] ?? 0);
            if ($base <= 0) return -1;                    // code sans échéance : rien à prolonger
            if ($base < time()) $base = time();           // déjà échu : on repart d'aujourd'hui
            $neuf = $base + $jours * 86400;

            // Le plafond se compte depuis l'ÉMISSION, pas depuis aujourd'hui :
            // sinon un parrain actif repousserait indéfiniment sa propre échéance.
            if ($plafondJours > 0) {
                $max = (int) ($e['cr'] ?? time()) + $plafondJours * 86400;
                if ($neuf > $max) $neuf = $max;
            }
            if ($neuf <= (int) ($e['exp'] ?? 0)) return (int) $e['exp'];   // plafond atteint

            $reg['codes'][$cle]['exp'] = $neuf;
            $reg['codes'][$cle]['prolonge'] = (int) ($e['prolonge'] ?? 0) + 1;
            if (!vrt_livret_registre_ecrire($reg)) return null;
            vrt_livret_log('[PROLONGATION] id=' . $id . ' +' . $jours . 'j → ' . date('Y-m-d', $neuf));
            return $neuf;
        }
        return null;
    }

    /** Codes dont l'échéance approche — pour la relance commerciale. */
    function vrt_livret_expirants(int $dansJours = 30): array {
        $reg = vrt_livret_registre_charger();
        $limite = time() + $dansJours * 86400;
        $out = [];
        foreach ($reg['codes'] as $cle => $e) {
            if (!is_array($e) || (string) ($e['st'] ?? '') !== 'actif') continue;
            $exp = (int) ($e['exp'] ?? 0);
            if ($exp <= 0 || $exp > $limite) continue;
            $out[] = ['id' => substr((string) $cle, 0, 12), 'classe' => (string) ($e['c'] ?? ''),
                      'kind' => (string) ($e['t'] ?? ''), 'label' => (string) ($e['lb'] ?? ''),
                      'ref' => (string) ($e['ref'] ?? ''), 'expire' => $exp,
                      'jours' => (int) max(0, ceil(($exp - time()) / 86400)),
                      'usages' => (int) ($e['use'] ?? 0)];
        }
        usort($out, static function ($a, $b) { return $a['expire'] <=> $b['expire']; });
        return $out;
    }

    /** Le code porté par ce jeton est-il toujours actif ? (révocation immédiate) */
    function vrt_livret_code_vivant(string $id): bool {
        $reg = vrt_livret_registre_charger();
        foreach ($reg['codes'] as $cle => $e) {
            if (substr((string) $cle, 0, 12) !== $id) continue;
            if ((string) ($e['st'] ?? '') !== 'actif') return false;
            if ((int) ($e['exp'] ?? 0) > 0 && (int) $e['exp'] < time()) return false;
            return true;
        }
        return false;
    }
}
