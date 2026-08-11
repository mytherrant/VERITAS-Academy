<?php
/**
 * api/_auth_lib.php — Brique d'authentification + droits d'accès PARTAGÉE (S3 v1.2.x)
 * © 2024-2026 Jacques Miterand TAKOU (Mythe Errant). Tous droits réservés.
 * Œuvre protégée — Loi camerounaise n° 2000/011 + Convention de Berne.
 * Reproduction interdite sans accord écrit. Contrefaçon : 5-10 ans prison +
 * 500 000 à 10 000 000 FCFA d'amende. contact@veritas-school.com
 *
 * BUT — centraliser la frontière de sécurité réutilisée par student_data.php et
 * content.php :
 *   1. Vérification de mot de passe (S256 hérité du client + bcrypt au repos,
 *      avec signal d'upgrade) — sans dupliquer la logique dans chaque endpoint.
 *   2. Émission/vérification d'un TOKEN par compte (Étape 3) : HMAC signé,
 *      sans stockage serveur (compatible hébergement mutualisé), expirant,
 *      révocable par compte via le champ `tokenVer`.
 *   3. Calcul des DROITS D'ACCÈS au contenu e-learning (Étape 2), réplique
 *      EXACTE de la logique client (union acc.plans + plan.planTags, plus les
 *      surcharges manuelles unlockedFor/blockedFor par contenu).
 *
 * NOTE — ce fichier n'émet AUCUN header et n'écrit AUCUNE sortie : il ne fait
 * que définir des fonctions et charger API_SECRET. Chaque endpoint reste maître
 * de ses propres en-têtes (essentiel pour content.php qui diffuse du binaire).
 *
 * FAIL-CLOSED — si API_SECRET n'est pas défini côté serveur, on génère une
 * valeur aléatoire inconnue : toute vérification de token échouera plutôt que
 * d'accepter un secret connu.
 */

if (!defined('VRT_AUTH_LIB')) {
    define('VRT_AUTH_LIB', '1.0');

    // API_SECRET vit dans api/payment_config.php (gitignoré). Même source que
    // config_sync.php → les tokens restent valides à travers tous les endpoints.
    @include_once __DIR__ . '/payment_config.php';
    if (!defined('API_SECRET')) {
        define('API_SECRET', bin2hex(random_bytes(32))); // fail-closed
    }

    // 🔐 v1.9.1 — BLOCKLIST DES SECRETS COMPROMIS / PLACEHOLDERS.
    //   « VERITAS-CLOUD-2026-xK9m » a FUITÉ : présent dans l'historique Git public
    //   (cf. AUDIT_VERITAS_v1.2.md « à abandonner ») et jamais réellement remplacé.
    //   Tant qu'un secret connu reste actif, n'importe qui peut (1) lire/écrire toute
    //   la base via db.php et (2) FORGER des tokens de compte (cette lib les signe en
    //   HMAC avec API_SECRET). On neutralise les deux vecteurs : fail-closed.
    if (!function_exists('vrt_secret_is_compromised')) {
        function vrt_secret_is_compromised($s): bool {
            $bad = [
                'VERITAS-CLOUD-2026-xK9m',
                'VERITAS-CLOUD-2026',
                'CHANGEZ_MOI_cle_secrete_veritas_2026',
                'CHANGEZ_MOI',
                'CHANGEZ_MOI_token_admin_long_et_aleatoire',
                'À_REMPLIR_DEPUIS_DEVELOPER_ORANGE',
                'À_REMPLIR_DEPUIS_MOMODEVELOPER',
            ];
            return in_array((string) $s, $bad, true);
        }
    }
    // Clé de SIGNATURE des tokens : si API_SECRET est un secret fuité/placeholder, on
    // bascule sur une clé aléatoire par processus → les tokens deviennent invalides
    // (re-login requis) mais AUCUNE forge n'est possible avec le secret public.
    if (!defined('VRT_HMAC_KEY')) {
        define('VRT_HMAC_KEY', vrt_secret_is_compromised(API_SECRET)
            ? bin2hex(random_bytes(32)) : API_SECRET);
    }

    if (!defined('VRT_TOKEN_TTL')) {
        define('VRT_TOKEN_TTL', 7 * 24 * 3600); // 7 jours
    }

    // ── Base de données partagée (même fichier que db.php / student_data.php) ──
    function vrt_db_file(): string {
        return dirname(__DIR__) . '/data/veritas_db.json';
    }
    function vrt_load_db(): ?array {
        $f = vrt_db_file();
        if (!is_file($f)) return null;
        $db = json_decode((string) file_get_contents($f), true);
        return is_array($db) ? $db : null;
    }

    // ── Recherche d'un compte (élève d'abord, puis visiteur inscrit) ──────────
    // Retourne ['acc'=>..., 'type'=>'eleve'|'visiteur'] ou null.
    function vrt_find_account(array $db, string $login): ?array {
        $lc = strtolower(trim($login));
        if ($lc === '') return null;
        foreach (($db['studentAccounts'] ?? []) as $a) {
            if (isset($a['user']) && strtolower((string) $a['user']) === $lc) {
                return ['acc' => $a, 'type' => 'eleve'];
            }
        }
        foreach (($db['visitorAccounts'] ?? []) as $a) {
            if (isset($a['user']) && strtolower((string) $a['user']) === $lc
                && (($a['statut'] ?? '') !== 'suspendu')) {
                return ['acc' => $a, 'type' => 'visiteur'];
            }
        }
        return null;
    }

    // ── Mots de passe ─────────────────────────────────────────────────────────
    /** Réplique de hashPassword() côté client : 'S256$' + sha256(pwd.'$'.salt.'$2026'). */
    function vrt_hash_s256(string $plain, string $salt): string {
        return 'S256$' . hash('sha256', $plain . '$' . ($salt !== '' ? $salt : 'VERITAS') . '$2026');
    }

    /**
     * Vérifie un mot de passe contre la valeur stockée.
     * Supporte : bcrypt (préféré, au repos), S256 (hérité du client).
     * $needUpgrade passe à true quand l'authentification a réussi mais que le
     * stockage devrait migrer vers bcrypt (compte encore en S256).
     * Comparaison à temps constant. Refuse le clair (jamais accepté ici).
     */
    function vrt_verify_password(string $plain, string $stored, string $userSalt, bool &$needUpgrade = false): bool {
        $needUpgrade = false;
        if ($plain === '' || $stored === '') return false;

        // bcrypt / argon2 (préfixes $2y$, $2a$, $argon2…) → vérification native.
        if (strlen($stored) > 3 && $stored[0] === '$') {
            return password_verify($plain, $stored);
        }
        // S256 hérité → comparer le hash recalculé ; succès ⇒ proposer l'upgrade bcrypt.
        if (strpos($stored, 'S256$') === 0) {
            $ok = hash_equals($stored, vrt_hash_s256($plain, $userSalt));
            if ($ok) $needUpgrade = true;
            return $ok;
        }
        // Tout le reste (clair, H$ XOR faible) refusé côté serveur : l'utilisateur
        // doit d'abord se reconnecter sur un appareil possédant le compte pour
        // s'upgrader en S256 (cf. doLogin/verifyPassword côté client).
        return false;
    }

    /** Produit un hash bcrypt (cost 12) — stockage au repos recommandé. */
    function vrt_hash_bcrypt(string $plain): string {
        return password_hash($plain, PASSWORD_BCRYPT, ['cost' => 12]);
    }

    // ── Tokens par compte (stateless, signés HMAC) ────────────────────────────
    function vrt_b64url_encode(string $s): string {
        return rtrim(strtr(base64_encode($s), '+/', '-_'), '=');
    }
    function vrt_b64url_decode(string $s): string {
        return (string) base64_decode(strtr($s, '-_', '+/'));
    }

    /**
     * Émet un token pour un compte authentifié.
     * Charge utile : user, eid, type, exp, v (version de révocation du compte).
     */
    function vrt_issue_token(array $acc, string $type): string {
        $payload = [
            'u'   => (string) ($acc['user'] ?? ''),
            'eid' => (string) ($acc['eid'] ?? $acc['id'] ?? ''),
            't'   => $type,
            'exp' => time() + VRT_TOKEN_TTL,
            'v'   => (int) ($acc['tokenVer'] ?? 0),
        ];
        $body = vrt_b64url_encode(json_encode($payload, JSON_UNESCAPED_UNICODE));
        $sig  = vrt_b64url_encode(hash_hmac('sha256', $body, VRT_HMAC_KEY, true));
        return $body . '.' . $sig;
    }

    /**
     * Vérifie un token et renvoie le compte FRAIS (rechargé depuis la base) +
     * son type, ou null si invalide/expiré/révoqué.
     * Recharger le compte garantit que les droits (plans) sont à jour et permet
     * la révocation : incrémenter acc.tokenVer invalide tous les tokens émis.
     */
    function vrt_verify_token(string $token, ?array $db = null): ?array {
        $parts = explode('.', $token);
        if (count($parts) !== 2) return null;
        [$body, $sig] = $parts;
        $expected = vrt_b64url_encode(hash_hmac('sha256', $body, VRT_HMAC_KEY, true));
        if (!hash_equals($expected, $sig)) return null;

        $payload = json_decode(vrt_b64url_decode($body), true);
        if (!is_array($payload)) return null;
        if ((int) ($payload['exp'] ?? 0) < time()) return null;

        if ($db === null) $db = vrt_load_db();
        if (!is_array($db)) return null;

        $found = vrt_find_account($db, (string) ($payload['u'] ?? ''));
        if ($found === null) return null;
        // Révocation : la version du token doit correspondre à celle du compte.
        if ((int) ($found['acc']['tokenVer'] ?? 0) !== (int) ($payload['v'] ?? 0)) return null;

        return ['acc' => $found['acc'], 'type' => $found['type'], 'payload' => $payload];
    }

    // ── Droits d'accès au contenu e-learning ──────────────────────────────────
    /**
     * planTags EFFECTIFS d'un compte = union de acc.plans + planTags de chaque
     * plan possédé (réplique exacte de la logique client app.js:7781 / 4670).
     */
    /**
     * Plans EFFECTIVEMENT actifs d'un compte = acc.plans filtrés par expiration.
     * Rend « durée des abonnements » réelle côté serveur (content.php/student_data).
     * Anti faux-refus : un plan présent dans acc.plans SANS aucun abonnement associé
     * est conservé (accordé manuellement par l'admin) ; on ne RETIRE un plan que si
     * un abonnement correspondant existe ET est expiré/annulé/en-attente.
     */
    function vrt_account_active_plans(array $acc, array $db): array {
        $plans = $acc['plans'] ?? [];
        if (!is_array($plans)) return [];
        $abos  = $db['elearning']['abonnements'] ?? [];
        $accId = (string) ($acc['id'] ?? '');
        $now   = (int) round(microtime(true) * 1000);
        $out = [];
        foreach ($plans as $pid) {
            $pid = (string) $pid;
            $found = false; $active = false;
            foreach ($abos as $a) {
                if (!is_array($a)) continue;
                if ((string) ($a['plan'] ?? $a['planId'] ?? '') !== $pid) continue;
                $owner = (string) ($a['accountId'] ?? $a['userId'] ?? '');
                if ($accId !== '' && $owner !== '' && $owner !== $accId) continue; // abo d'un autre compte
                $found = true;
                $st = strtolower((string) ($a['statut'] ?? ''));
                $bad = in_array($st, ['expiré', 'expire', 'annulé', 'annule', 'en attente', 'suspendu'], true);
                $end = isset($a['dateFinTs']) ? (int) $a['dateFinTs'] : 0;
                if (!$bad && ($end === 0 || $end > $now)) { $active = true; break; }
            }
            if (!$found || $active) $out[] = $pid; // grandfather si aucun abo, sinon exige actif
        }
        return $out;
    }

    function vrt_effective_plantags(array $acc, array $db): array {
        $plans = vrt_account_active_plans($acc, $db);
        if (!is_array($plans)) $plans = [];
        $defs = $db['elearning']['plans'] ?? [];
        $eff = [];
        foreach ($plans as $pid) {
            if (!in_array($pid, $eff, true)) $eff[] = $pid;
            foreach ($defs as $pd) {
                if (($pd['id'] ?? null) === $pid && !empty($pd['planTags']) && is_array($pd['planTags'])) {
                    foreach ($pd['planTags'] as $t) {
                        if (!in_array($t, $eff, true)) $eff[] = $t;
                    }
                }
            }
        }
        return $eff;
    }

    /**
     * Le compte $acc a-t-il accès au $contenu ? Réplique exacte du client :
     *   1. bloqué manuellement (blockedFor) → NON
     *   2. débloqué manuellement (unlockedFor) → OUI
     *   3. contenu explicitement gratuit → OUI
     *   4. intersection(planTags effectifs, contenu.plans) non vide → OUI
     *   5. sinon → NON (défaut sécurisé : on ne sert pas un contenu non requis)
     */
    function vrt_account_can_access(array $acc, array $contenu, array $db): bool {
        $accId = (string) ($acc['id'] ?? '');
        $blocked = $contenu['blockedFor'] ?? [];
        if (is_array($blocked) && $accId !== '' && in_array($accId, $blocked, true)) return false;

        $unlocked = $contenu['unlockedFor'] ?? [];
        if (is_array($unlocked) && $accId !== '' && in_array($accId, $unlocked, true)) return true;

        if (!empty($contenu['gratuit']) || !empty($contenu['free'])) return true;

        $req = $contenu['plans'] ?? [];
        if (!is_array($req) || count($req) === 0) return false; // aucun plan requis ⇒ pas servi par défaut
        $eff = vrt_effective_plantags($acc, $db);
        if (count($eff) === 0) return false;
        foreach ($req as $p) {
            if (in_array($p, $eff, true)) return true;
        }
        return false;
    }

    // ── Rate-limit IP par fichier plat (réutilisable) ─────────────────────────
    function vrt_client_ip(): string {
        $ip = $_SERVER['HTTP_CF_CONNECTING_IP'] ?? $_SERVER['HTTP_X_FORWARDED_FOR'] ?? $_SERVER['REMOTE_ADDR'] ?? 'unknown';
        $ip = explode(',', (string) $ip)[0];
        return preg_replace('/[^0-9a-fA-F:.]/', '', $ip) ?: 'unknown';
    }
    /** Renvoie true si la limite est DÉPASSÉE (caller doit alors répondre 429). */
    function vrt_rate_exceeded(string $prefix, int $maxPerMin): bool {
        $dir = __DIR__ . '/data/_rate/';
        if (!is_dir($dir)) @mkdir($dir, 0750, true);
        $f = $dir . $prefix . '_' . substr(md5(vrt_client_ip()), 0, 16) . '.txt';
        $now = time();
        $hits = [];
        if (is_file($f)) {
            $hits = array_filter(explode("\n", (string) @file_get_contents($f)), function ($t) use ($now) {
                return $t !== '' && ($now - (int) $t) < 60;
            });
        }
        if (count($hits) >= $maxPerMin) return true;
        $hits[] = $now;
        @file_put_contents($f, implode("\n", $hits));
        return false;
    }

    // ── Octroi d'accès côté SERVEUR (Étape 1) ────────────────────────────────
    // Quand un paiement est CONFIRMÉ par un webhook vérifié, on inscrit l'accès
    // dans la base serveur. Sans cela, l'octroi ne vit que dans le navigateur du
    // client (qui ne peut pas pousser sur db.php) → accès perdu au changement
    // d'appareil et contournable. Réplique serveur de _payAutoActivate (client).
    function vrt_abo_duree_ms($duree): int {
        $d = strtolower(trim((string) $duree));
        if (strpos($d, 'mois') !== false || strpos($d, 'mensuel') !== false) return 30 * 86400000;
        if (strpos($d, 'trimestre') !== false) return 90 * 86400000;
        if (strpos($d, 'semestre') !== false) return 182 * 86400000;
        return 365 * 86400000; // « année scolaire », annuel, ou défaut
    }
    function vrt_dec_stock(array &$db, string $bookId): void {
        if ($bookId === '' || !isset($db['books']) || !is_array($db['books'])) return;
        foreach ($db['books'] as &$b) {
            if (is_array($b) && (string) ($b['id'] ?? '') === $bookId) {
                if (isset($b['stock']) && (int) $b['stock'] > 0) { $b['stock'] = (int) $b['stock'] - 1; $b['vendu'] = (int) ($b['vendu'] ?? 0) + 1; }
                break;
            }
        }
        unset($b);
    }

    /* ══════════════════════════════════════════════════════════════════════
       PRIX DE RÉFÉRENCE — ce que l'objet vendu coûte VRAIMENT, d'après la base.

       ⚠️ Le trou que cela ferme est le plus coûteux de toute la chaîne d'argent.
       `?action=init` reçoit `montant`, `intent` et `targetId` du NAVIGATEUR, et
       le jeton public d'initiation est servi à tous par `?action=config` (il le
       doit : sans lui, personne ne peut payer). Jusqu'ici l'octroi ne confrontait
       le montant qu'à... lui-même : `camerpayApplyVerified` vérifie que la somme
       encaissée par l'opérateur égale la somme DÉCLARÉE, jamais le tarif. Une
       requête forgée à 100 FCFA (le minimum CamerPay) sur l'abonnement annuel
       passait donc toute la chaîne — paiement réel, signature HMAC valide,
       montant « vérifié » — et ouvrait l'accès complet. Aucune alerte : le
       paiement RÉUSSIT.

       Le prix est cherché dans la base partagée, jamais dans la requête.
       null = tarif indéterminable (produit libre, panier, cagnotte, objet absent
       du catalogue) : on n'invente pas un prix, on journalise et on laisse
       passer — refuser sur une ignorance ferait payer le client pour un trou de
       nos données, exactement le mal qu'on soigne.
       ══════════════════════════════════════════════════════════════════════ */
    function vrt_prix_catalogue(array $db, string $intent, string $targetId): ?int {
        // Micro-achats à l'unité et crédits IA : le tarif vit dans DB.microPrix,
        // avec le repli sur les valeurs par défaut du client (MICRO_PRIX_DEFAULT).
        $micro    = ['micro_epreuve' => 'epreuve', 'micro_chapitre' => 'chapitre',
                     'micro_fiche'   => 'fiche',   'micro_labo'     => 'labo'];
        $microDef = ['epreuve' => 200, 'chapitre' => 500, 'fiche' => 300, 'labo' => 300, 'ia' => 500];
        if (isset($micro[$intent]) || $intent === 'ia') {
            $t = ($intent === 'ia') ? 'ia' : $micro[$intent];
            $v = (int) ($db['microPrix'][$t]['montant'] ?? 0);
            return $v > 0 ? $v : $microDef[$t];
        }

        // Tranche de scolarité : le montant dû est inscrit versement par
        // versement. C'est le seul intent dont le tarif est EXACT en base.
        if ($intent === 'echeance') {
            $bout   = explode(':', $targetId);
            $planId = (string) ($bout[0] ?? '');
            $rang   = (int) ($bout[1] ?? 0);
            foreach (($db['echeanciers'] ?? []) as $p) {
                if (!is_array($p) || (string) ($p['id'] ?? '') !== $planId) continue;
                foreach ((isset($p['versements']) && is_array($p['versements']) ? $p['versements'] : []) as $v) {
                    if (is_array($v) && (int) ($v['n'] ?? 0) === $rang) return max(0, (int) ($v['mnt'] ?? 0));
                }
            }
            return null;
        }

        // Collections du catalogue — miroir EXACT de VERITAS_MONETISATION
        // (app.js) : même intent, même collection, même champ de prix.
        $coll = [
            'book' => 'books', 'digitalbook' => 'books', 'contenu' => 'contenus',
            'oeuvre' => 'oeuvres', 'labo' => 'labos', 'marketplace' => 'marketplaceItems',
            'subscription' => 'plans',
        ];
        if (!isset($coll[$intent]) || $targetId === '') return null;

        switch ($coll[$intent]) {
            case 'books':            $liste = $db['books'] ?? []; break;
            case 'contenus':         $liste = $db['elearning']['contenus'] ?? []; break;
            case 'plans':            $liste = $db['elearning']['plans'] ?? []; break;
            case 'labos':            $liste = $db['labos'] ?? ($db['laboratoires'] ?? []); break;
            case 'oeuvres':          $liste = $db['oeuvres'] ?? []; break;
            case 'marketplaceItems': $liste = $db['marketplaceItems'] ?? []; break;
            default:                 $liste = [];
        }
        if (!is_array($liste)) return null;

        foreach ($liste as $o) {
            if (!is_array($o) || (string) ($o['id'] ?? '') !== $targetId) continue;
            // Le manuel NUMÉRIQUE a son propre tarif (souvent moitié du papier) :
            // le confronter au prix papier refuserait un achat parfaitement payé.
            if ($intent === 'digitalbook') {
                foreach (['prixDigital', 'priceDigital', 'prix'] as $k) {
                    if (isset($o[$k]) && (int) $o[$k] > 0) return (int) $o[$k];
                }
                return null;
            }
            $p = (int) ($o['prix'] ?? 0);
            return $p > 0 ? $p : null;   // 0 = gratuit ou non tarifé → rien à contrôler
        }
        return null;   // objet absent du catalogue : on ne devine pas
    }

    /**
     * Prix plancher acceptable pour un tarif donné : le catalogue MOINS la
     * meilleure remise réellement active en base (DB.promoCodes).
     *
     * Le navigateur applique les codes promo sans transmettre lequel : refuser
     * tout paiement inférieur au catalogue bloquerait des remises légitimes
     * (la boutique de manuels envoie déjà `finalPrix`). On borne donc par le bas
     * plutôt que d'exiger l'égalité — et on plafonne cette tolérance, sinon un
     * code « -95 % » saisi une fois en base rouvrirait le trou en grand.
     */
    function vrt_prix_plancher(array $db, int $prix): int {
        if ($prix <= 0) return 0;
        $capPct = defined('VRT_REMISE_MAX_PCT') ? (float) VRT_REMISE_MAX_PCT : 50.0;
        if ($capPct < 0)  $capPct = 0;
        if ($capPct > 90) $capPct = 90;

        $best = 0;
        foreach (($db['promoCodes'] ?? []) as $p) {
            if (!is_array($p) || empty($p['actif'])) continue;
            $r = (float) ($p['reduction'] ?? 0);
            if ($r <= 0) continue;
            $v = ((string) ($p['type'] ?? 'percent') === 'fixed')
                ? (int) round($r)                       // remise en FCFA
                : (int) round($prix * $r / 100);        // remise en pourcentage
            if ($v > $best) $best = $v;
        }
        $plafond = (int) floor($prix * $capPct / 100);
        if ($best > $plafond) $best = $plafond;
        return max(0, $prix - $best);
    }

    /**
     * Le montant encaissé couvre-t-il l'objet vendu ?
     * ['ok'=>bool, 'attendu'=>?int, 'paye'=>int, 'plancher'=>int, 'motif'=>string]
     */
    function vrt_verifier_prix(array $db, array $state): array {
        $intent   = (string) ($state['intent']   ?? '');
        $targetId = (string) ($state['targetId'] ?? '');
        $paye     = (int) ($state['montant_paye'] ?? $state['montant'] ?? 0);
        $attendu  = vrt_prix_catalogue($db, $intent, $targetId);

        if ($attendu === null) return ['ok' => true, 'attendu' => null, 'paye' => $paye, 'plancher' => 0, 'motif' => 'tarif indéterminable'];
        if ($attendu <= 0)     return ['ok' => true, 'attendu' => $attendu, 'paye' => $paye, 'plancher' => 0, 'motif' => 'gratuit'];

        $plancher = vrt_prix_plancher($db, $attendu);
        if ($paye >= $plancher) {
            return ['ok' => true, 'attendu' => $attendu, 'paye' => $paye, 'plancher' => $plancher,
                    'motif' => ($paye < $attendu) ? 'remise admise' : ''];
        }
        return ['ok' => false, 'attendu' => $attendu, 'paye' => $paye, 'plancher' => $plancher, 'motif' => 'sous-paiement'];
    }

    /**
     * MANUEL PAPIER PAYÉ ⇒ LECTURE NUMÉRIQUE OUVERTE TOUT DE SUITE.
     *
     * Payer un livre puis attendre de passer à l'administration pour le retirer,
     * c'est un trou de plusieurs heures — parfois un week-end — entre le débit et
     * la moindre contrepartie. Vu du client qui vient de sortir 5 000 FCFA sur son
     * téléphone, ça ressemble à une arnaque, et c'est là qu'il demande son
     * remboursement.
     *
     * Le livre acheté existe déjà en lecture sécurisée (api/secure_pdf.php sert
     * des IMAGES page par page, filigranées, sans jamais livrer le PDF). Il suffit
     * d'inscrire le livre dans acc.unlockedBooks : la lecture s'ouvre à la seconde
     * où le paiement est confirmé, l'exemplaire papier se retire ensuite.
     * Rien n'est téléchargeable pour autant — le droit ouvert est celui de LIRE.
     *
     * Silencieux et sans effet si le livre n'a pas de version préparée
     * (`secureId` / `securePages` / `digital`) ou si l'acheteur n'a pas de compte.
     */
    function vrt_ouvrir_lecture_immediate(array &$db, string $bookId, string $accountId): string {
        if ($bookId === '' || $accountId === '') return '';
        $livre = null;
        foreach (($db['books'] ?? []) as $b) {
            if (is_array($b) && (string) ($b['id'] ?? '') === $bookId) { $livre = $b; break; }
        }
        if (!$livre) return '';
        $lisible = !empty($livre['secureId']) || !empty($livre['securePages']) || !empty($livre['digital']);
        if (!$lisible) return '';

        foreach (['visitorAccounts', 'studentAccounts'] as $coll) {
            if (!isset($db[$coll]) || !is_array($db[$coll])) continue;
            foreach ($db[$coll] as &$acc) {
                if (!is_array($acc) || (string) ($acc['id'] ?? '') !== $accountId) continue;
                if (!isset($acc['unlockedBooks']) || !is_array($acc['unlockedBooks'])) $acc['unlockedBooks'] = [];
                if (in_array($bookId, $acc['unlockedBooks'], true)) { unset($acc); return ''; }
                $acc['unlockedBooks'][] = $bookId;
                unset($acc);
                return ' — lecture numérique ouverte immédiatement';
            }
            unset($acc);
        }
        return '';
    }

    /**
     * Applique au $db (mutation en place) l'entitlement d'un paiement confirmé.
     * IDEMPOTENT par référence ($state['ref']) → rejouable sans double-octroi.
     * Renvoie ['changed'=>bool, 'msg'=>string]. Ne LÈVE jamais.
     */
    function vrt_grant_entitlement(array &$db, array $state): array {
        $intent    = (string) ($state['intent'] ?? '');
        $ref       = (string) ($state['ref'] ?? '');
        $targetId  = (string) ($state['targetId'] ?? '');
        $accountId = (string) ($state['accountId'] ?? '');
        $montant   = (int) ($state['montant'] ?? 0);
        $nom       = (string) ($state['clientNom'] ?? '');
        $tel       = (string) ($state['clientTel'] ?? '');
        $label     = (string) ($state['label'] ?? '');
        if ($intent === '' || $ref === '') return ['changed' => false, 'msg' => 'intent/ref manquant'];

        /* 🔐 LE MONTANT COUVRE-T-IL L'OBJET ? — contrôle unique, ici, parce que
           les QUATRE passerelles (CamerPay, CamPay, MTN, Orange) passent par
           cette fonction. Le placer dans les `init` obligerait à l'écrire quatre
           fois et à le tenir à jour quatre fois.
           Le panier se vérifie ligne par ligne : chaque ligne repasse par cette
           même porte avec son propre intent et son propre montant. */
        $pv = vrt_verifier_prix($db, $state);
        if (!$pv['ok']) {
            vrt_pay_log('[PRIX_REFUSE] ref=' . $ref . ' intent=' . $intent . ' cible=' . $targetId
                . ' paye=' . $pv['paye'] . ' attendu=' . $pv['attendu'] . ' plancher=' . $pv['plancher']);
            $mode = defined('VRT_PRICE_ENFORCE') ? strtolower((string) VRT_PRICE_ENFORCE) : 'strict';
            if ($mode !== 'log') {
                // Échec BRUYANT et non rejouable : la transaction garde son
                // drapeau `granted`, le tableau de bord montre le motif, et
                // l'administrateur tranche à la main. C'est l'inverse exact du
                // symptôme d'origine — le silence.
                return ['changed' => false, 'underpaid' => true,
                        'msg' => 'Sous-paiement REFUSÉ : ' . $pv['paye'] . ' FCFA reçus pour un tarif de '
                               . $pv['attendu'] . ' FCFA (plancher remise incluse : ' . $pv['plancher'] . ')'];
            }
        } elseif ($pv['motif'] === 'remise admise') {
            vrt_pay_log('[PRIX_REMISE] ref=' . $ref . ' intent=' . $intent . ' cible=' . $targetId
                . ' paye=' . $pv['paye'] . ' catalogue=' . $pv['attendu']);
        }

        if ($intent === 'subscription') {
            if (!isset($db['elearning']) || !is_array($db['elearning'])) $db['elearning'] = [];
            if (!isset($db['elearning']['abonnements']) || !is_array($db['elearning']['abonnements'])) $db['elearning']['abonnements'] = [];
            foreach ($db['elearning']['abonnements'] as $a) {
                if (is_array($a) && (string) ($a['ref'] ?? '') === $ref) return ['changed' => false, 'msg' => 'abonnement déjà accordé'];
            }
            $plan = null;
            foreach (($db['elearning']['plans'] ?? []) as $p) {
                if (is_array($p) && (string) ($p['id'] ?? '') === $targetId) { $plan = $p; break; }
            }
            $now = (int) round(microtime(true) * 1000);
            $finTs = $now + vrt_abo_duree_ms($plan['duree'] ?? '');
            $db['elearning']['abonnements'][] = [
                'id' => 'abo_' . bin2hex(random_bytes(5)), 'ref' => $ref,
                'accountId' => $accountId, 'plan' => $targetId, 'planId' => $targetId,
                'planNom' => $plan ? ($plan['nom'] ?? $label) : $label,
                'nom' => $nom, 'tel' => $tel, 'montant' => $montant,
                'date' => date('d/m/Y'), 'dateDebut' => date('c'), 'dateActivation' => date('d/m/Y'),
                'dateFinTs' => $finTs, 'dateFin' => date('d/m/Y', (int) ($finTs / 1000)),
                'statut' => 'Activé', 'via' => 'webhook_serveur',
            ];
            if ($accountId !== '') {
                foreach (['visitorAccounts', 'studentAccounts'] as $coll) {
                    if (!isset($db[$coll]) || !is_array($db[$coll])) continue;
                    foreach ($db[$coll] as &$acc) {
                        if (is_array($acc) && (string) ($acc['id'] ?? '') === $accountId) {
                            if (!isset($acc['plans']) || !is_array($acc['plans'])) $acc['plans'] = [];
                            if (!in_array($targetId, $acc['plans'], true)) $acc['plans'][] = $targetId;
                            $acc['statut'] = 'actif';
                        }
                    }
                    unset($acc);
                }
            }
            return ['changed' => true, 'msg' => 'Abonnement ' . ($plan['nom'] ?? '') . ' activé'];
        }

        if ($intent === 'book') {
            if (!isset($db['visitorOrders']) || !is_array($db['visitorOrders'])) $db['visitorOrders'] = [];
            foreach ($db['visitorOrders'] as &$o) {
                if (is_array($o) && (string) ($o['ref'] ?? '') === $ref) {
                    if (($o['statut'] ?? '') === 'Payé') { unset($o); return ['changed' => false, 'msg' => 'commande déjà payée']; }
                    $o['statut'] = 'Payé'; $o['datePaiement'] = date('c'); unset($o);
                    vrt_dec_stock($db, $targetId);
                    $lect = vrt_ouvrir_lecture_immediate($db, $targetId, $accountId);
                    return ['changed' => true, 'msg' => 'Commande livre confirmée' . $lect];
                }
            }
            unset($o);
            $db['visitorOrders'][] = [
                'id' => 'ord_' . bin2hex(random_bytes(5)), 'ref' => $ref, 'bid' => $targetId,
                'bookTitle' => preg_replace('/^[^—]*—\s*/u', '', $label), 'nom' => $nom ?: '?', 'tel' => $tel ?: '?',
                'date' => date('d/m/Y'), 'statut' => 'Payé', 'prix' => $montant, 'datePaiement' => date('c'), 'via' => 'webhook_serveur',
            ];
            vrt_dec_stock($db, $targetId);
            $lect = vrt_ouvrir_lecture_immediate($db, $targetId, $accountId);
            return ['changed' => true, 'msg' => 'Commande livre créée et confirmée' . $lect];
        }

        // v1.7 : LIVRE NUMÉRIQUE — débloque la lecture sécurisée sur le compte
        // (acc.unlockedBooks). Idempotent par ref. Lu par api/secure_pdf.php.
        if ($intent === 'digitalbook') {
            if ($accountId === '') return ['changed' => false, 'msg' => 'accountId manquant'];
            $bookId = $targetId;
            foreach (['visitorAccounts', 'studentAccounts'] as $coll) {
                if (!isset($db[$coll]) || !is_array($db[$coll])) continue;
                foreach ($db[$coll] as &$acc) {
                    if (is_array($acc) && (string) ($acc['id'] ?? '') === $accountId) {
                        if (!isset($acc['unlockedBooks']) || !is_array($acc['unlockedBooks'])) $acc['unlockedBooks'] = [];
                        if (in_array($bookId, $acc['unlockedBooks'], true)) { unset($acc); return ['changed' => false, 'msg' => 'livre déjà débloqué']; }
                        $acc['unlockedBooks'][] = $bookId;
                        unset($acc);
                        return ['changed' => true, 'msg' => 'Livre numérique débloqué'];
                    }
                }
                unset($acc);
            }
            return ['changed' => false, 'msg' => 'compte introuvable'];
        }

        if ($intent === 'product') {
            if (!isset($db['visitorOrders']) || !is_array($db['visitorOrders'])) $db['visitorOrders'] = [];
            foreach ($db['visitorOrders'] as $o) {
                if (is_array($o) && (string) ($o['ref'] ?? '') === $ref) return ['changed' => false, 'msg' => 'commande déjà créée'];
            }
            $db['visitorOrders'][] = [
                'id' => 'ord_' . bin2hex(random_bytes(5)), 'ref' => $ref, 'bid' => 'product:' . $targetId,
                'bookTitle' => $label ?: 'Produit', 'nom' => $nom ?: '?', 'tel' => $tel ?: '?',
                'date' => date('d/m/Y'), 'statut' => 'Payé', 'prix' => $montant, 'datePaiement' => date('c'), 'via' => 'webhook_serveur',
            ];
            return ['changed' => true, 'msg' => 'Commande produit confirmée'];
        }

        if ($intent === 'whatsapp_group') {
            if (!isset($db['whatsappGroupes']) || !is_array($db['whatsappGroupes'])) return ['changed' => false, 'msg' => 'groupe introuvable'];
            foreach ($db['whatsappGroupes'] as &$g) {
                if (is_array($g) && (string) ($g['id'] ?? '') === $targetId) {
                    if (!isset($g['membresValides']) || !is_array($g['membresValides'])) $g['membresValides'] = [];
                    $new = ($accountId !== '' && !in_array($accountId, $g['membresValides'], true));
                    if ($new) $g['membresValides'][] = $accountId;
                    unset($g);
                    if ($accountId !== '' && isset($db['visitorAccounts']) && is_array($db['visitorAccounts'])) {
                        foreach ($db['visitorAccounts'] as &$acc2) {
                            if (is_array($acc2) && (string) ($acc2['id'] ?? '') === $accountId) {
                                if (!isset($acc2['waGroupesValides']) || !is_array($acc2['waGroupesValides'])) $acc2['waGroupesValides'] = [];
                                if (!in_array($targetId, $acc2['waGroupesValides'], true)) $acc2['waGroupesValides'][] = $targetId;
                            }
                        }
                        unset($acc2);
                    }
                    return ['changed' => $new, 'msg' => 'Accès groupe WhatsApp accordé'];
                }
            }
            unset($g);
            return ['changed' => false, 'msg' => 'groupe introuvable'];
        }

        if ($intent === 'classroom') {
            if (!isset($db['classrooms']) || !is_array($db['classrooms'])) return ['changed' => false, 'msg' => 'classe introuvable'];
            foreach ($db['classrooms'] as &$cv) {
                if (is_array($cv) && (string) ($cv['id'] ?? '') === $targetId) {
                    if (!isset($cv['students']) || !is_array($cv['students'])) $cv['students'] = [];
                    foreach ($cv['students'] as $st) {
                        if (is_array($st) && (string) ($st['accountId'] ?? '') === $accountId) { unset($cv); return ['changed' => false, 'msg' => 'déjà inscrit']; }
                    }
                    if ($accountId !== '') {
                        $cv['students'][] = ['accountId' => $accountId, 'nom' => $nom ?: '?', 'tel' => $tel ?: '?', 'dateInscription' => date('c'), 'statut' => 'Inscrit'];
                        unset($cv);
                        return ['changed' => true, 'msg' => 'Inscription classe confirmée'];
                    }
                    unset($cv);
                    return ['changed' => false, 'msg' => 'accountId manquant'];
                }
            }
            unset($cv);
            return ['changed' => false, 'msg' => 'classe introuvable'];
        }

        /* ── Tranche de scolarité (échéancier) ────────────────────────────────
           targetId = "<idDuPlan>:<rangDuVersement>". C'est le seul moyen de
           désigner LE versement réglé parmi les N du plan : la référence de
           paiement, elle, est propre à la tentative.
           Sans ce cas, un parent payait sa tranche en ligne et la voyait
           toujours due — l'octroi répondait « intent non géré ». */
        if ($intent === 'echeance') {
            $bout   = explode(':', $targetId);
            $planId = (string) ($bout[0] ?? '');
            $rang   = (int) ($bout[1] ?? 0);
            if ($planId === '' || $rang <= 0) return ['changed' => false, 'msg' => 'échéance : cible illisible'];
            if (!isset($db['echeanciers']) || !is_array($db['echeanciers'])) return ['changed' => false, 'msg' => 'aucun échéancier'];

            // Indices plutôt que références : une boucle `as &$x` imbriquée avec
            // des `return` au milieu est le meilleur moyen d'écrire dans la
            // mauvaise ligne au tour suivant.
            foreach ($db['echeanciers'] as $pi => $plan) {
                if (!is_array($plan) || (string) ($plan['id'] ?? '') !== $planId) continue;
                $vers = (isset($plan['versements']) && is_array($plan['versements'])) ? $plan['versements'] : [];
                foreach ($vers as $vi => $v) {
                    if (!is_array($v) || (int) ($v['n'] ?? 0) !== $rang) continue;
                    if ((string) ($v['stat'] ?? '') === 'Payé') return ['changed' => false, 'msg' => 'versement déjà réglé'];

                    $mnt = (int) ($v['mnt'] ?? $montant);
                    $db['echeanciers'][$pi]['versements'][$vi]['stat'] = 'Payé';
                    $db['echeanciers'][$pi]['versements'][$vi]['paye'] = date('d/m/Y');
                    if (empty($v['ref'])) $db['echeanciers'][$pi]['versements'][$vi]['ref'] = $ref;

                    // Recette, idempotente par référence (le navigateur du payeur
                    // a pu la créer de son côté avant que la synchro n'arrive).
                    if (!isset($db['payments']) || !is_array($db['payments'])) $db['payments'] = [];
                    $dejaRecette = false;
                    foreach ($db['payments'] as $pay) {
                        if (is_array($pay) && (string) ($pay['ref'] ?? '') === $ref) { $dejaRecette = true; break; }
                    }
                    if (!$dejaRecette) {
                        $db['payments'][] = [
                            'id'   => 'pay_' . bin2hex(random_bytes(4)),
                            'eid'  => (string) ($plan['eid'] ?? ''),
                            'enom' => (string) ($plan['enom'] ?? $nom),
                            'cls'  => (string) ($plan['cls'] ?? ''),
                            'mo'   => (string) ($plan['motif'] ?? 'Scolarité') . ' — versement ' . $rang . '/' . (int) ($plan['nb'] ?? 0),
                            'mnt'  => $mnt, 'mode' => 'CamerPay', 'dt' => date('d/m/Y'),
                            'stat' => 'Payé', 'ref' => $ref, 'via' => 'webhook_serveur',
                        ];
                    }

                    // Plan soldé ⇒ l'élève est à jour.
                    $reste = 0;
                    foreach ($db['echeanciers'][$pi]['versements'] as $w) {
                        if (is_array($w) && (string) ($w['stat'] ?? '') !== 'Payé') $reste += (int) ($w['mnt'] ?? 0);
                    }
                    if ($reste === 0 && isset($db['students']) && is_array($db['students'])) {
                        foreach ($db['students'] as $si => $st) {
                            if (is_array($st) && (string) ($st['id'] ?? '') === (string) ($plan['eid'] ?? '')) {
                                $db['students'][$si]['stat'] = 'Payé';
                            }
                        }
                    }
                    return ['changed' => true, 'msg' => 'Versement ' . $rang . ' encaissé'
                        . ($reste === 0 ? ' — scolarité soldée' : '')];
                }
                return ['changed' => false, 'msg' => 'versement ' . $rang . ' introuvable'];
            }
            return ['changed' => false, 'msg' => 'échéancier introuvable'];
        }

        /* ── Panier : N articles réglés en UN paiement ─────────────────────────
           On ne duplique aucune règle : chaque ligne repasse par ce même octroi
           avec son propre intent. La référence est suffixée « #rang » pour que
           l'idempotence de chaque branche joue ligne par ligne — sinon la 2e
           ligne se croirait déjà accordée à cause de la 1re. */
        if ($intent === 'cart') {
            $lignes = (isset($state['lignes']) && is_array($state['lignes'])) ? $state['lignes'] : [];
            if (!$lignes) return ['changed' => false, 'msg' => 'panier sans détail (ligne non transmise)'];
            // Le détail vient du navigateur : il dit QUOI débloquer, il ne décide
            // pas COMBIEN a été encaissé. Le total des lignes est donc ramené au
            // montant réellement payé, sinon une ligne gonflée gonflerait la
            // commande enregistrée (et l'assiette des commissions avec elle).
            $paye = (int) ($state['montant_paye'] ?? $state['montant'] ?? 0);
            $changed = false; $msgs = []; $reste = $paye;
            foreach ($lignes as $i => $l) {
                if (!is_array($l)) continue;
                $sousIntent = (string) ($l['intent'] ?? '');
                if ($sousIntent === '' || $sousIntent === 'cart') continue;
                $mLigne = max(0, (int) ($l['montant'] ?? 0));
                if ($mLigne > $reste) $mLigne = $reste;
                $reste -= $mLigne;
                $sous = $state;
                $sous['intent']   = $sousIntent;
                $sous['targetId'] = (string) ($l['targetId'] ?? '');
                $sous['montant']  = $mLigne;
                // `montant_paye` porte le total du PANIER et prime sur `montant`
                // dans le contrôle de prix : le laisser tel quel ferait passer
                // chaque ligne pour payée au prix du panier entier — une ligne à
                // 0 FCFA glissée dans un panier de 20 000 aurait été accordée.
                $sous['montant_paye'] = $mLigne;
                $sous['label']    = (string) ($l['label'] ?? $label);
                $sous['ref']      = $ref . '#' . ($i + 1);
                unset($sous['lignes']);
                $r = vrt_grant_entitlement($db, $sous);
                if (!empty($r['changed'])) $changed = true;
                if (!empty($r['msg']))     $msgs[] = $r['msg'];
            }
            return ['changed' => $changed,
                    'msg' => 'Panier (' . count($lignes) . ') : ' . ($msgs ? implode(' · ', $msgs) : 'rien à activer')];
        }

        /* ── CRÉDITS IA (intent `ia`) ─────────────────────────────────────────
           Le bouton « Crédits Prof. Ambassa » vendait 20 questions vers un
           tiroir `unlockedIA` que RIEN ne lisait : ni compteur, ni garde. Le
           client payait 500 FCFA et ne recevait rien du tout, même sur son
           propre appareil, et un second achat était encore plus muet (le tiroir
           dédoublonnait la même valeur). Les jetons deviennent donc un SOLDE.
           Le nombre vient de la base (jamais du client), et `iaCreditRefs`
           rend l'octroi idempotent : un webhook rejoué ne crédite pas deux fois. */
        if ($intent === 'ia') {
            if ($accountId === '') return ['changed' => false, 'msg' => 'accountId manquant'];
            $jetons = (int) ($db['microPrix']['ia']['jetons'] ?? 20);
            if ($jetons <= 0) $jetons = 20;
            foreach (['visitorAccounts', 'studentAccounts'] as $coll) {
                if (!isset($db[$coll]) || !is_array($db[$coll])) continue;
                foreach ($db[$coll] as &$acc) {
                    if (!is_array($acc) || (string) ($acc['id'] ?? '') !== $accountId) continue;
                    if (!isset($acc['iaCreditRefs']) || !is_array($acc['iaCreditRefs'])) $acc['iaCreditRefs'] = [];
                    if (in_array($ref, $acc['iaCreditRefs'], true)) { unset($acc); return ['changed' => false, 'msg' => 'crédits IA déjà accordés']; }
                    $acc['iaCredits']      = (int) ($acc['iaCredits'] ?? 0) + $jetons;
                    $acc['iaCreditRefs'][] = $ref;
                    $solde = (int) $acc['iaCredits'];
                    unset($acc);
                    return ['changed' => true, 'msg' => $jetons . ' crédits IA ajoutés (solde ' . $solde . ')'];
                }
                unset($acc);
            }
            return ['changed' => false, 'msg' => 'compte introuvable pour les crédits IA'];
        }

        /* ── ACHATS À L'UNITÉ ──────────────────────────────────────────────────
           Contenu e-learning, œuvre, laboratoire, cours marketplace et
           micro-achats. Le navigateur savait les activer (branche `default` de
           _payAutoActivate), le serveur non : il répondait « intent non géré ».
           Conséquence, avec CamerPay qui fait SORTIR le payeur de l'application :
           un client qui fermait l'onglet avant la confirmation payait et
           n'obtenait rien nulle part, et le droit gagné par ceux qui restaient
           ne vivait que dans leur localStorage — perdu au changement d'appareil.
           Miroir EXACT de _payAccorderDroit() : mêmes tiroirs, même clé. */
        $tiroirs = [
            'contenu'        => 'unlockedContenus',
            'oeuvre'         => 'unlockedOeuvres',
            'labo'           => 'unlockedLabos',
            'marketplace'    => 'unlockedItems',
            'micro_epreuve'  => 'unlockedUnits',
            'micro_chapitre' => 'unlockedUnits',
            'micro_fiche'    => 'unlockedUnits',
            'micro_labo'     => 'unlockedUnits',
        ];
        if (isset($tiroirs[$intent])) {
            if ($accountId === '') return ['changed' => false, 'msg' => 'accountId manquant'];
            if ($targetId === '')  return ['changed' => false, 'msg' => 'targetId manquant'];
            $tiroir = $tiroirs[$intent];
            // Les micro-achats partagent UN tiroir : sans le préfixe d'intent,
            // la fiche n° 12 débloquerait le labo n° 12.
            $cle = ($tiroir === 'unlockedUnits') ? ($intent . ':' . $targetId) : $targetId;
            foreach (['visitorAccounts', 'studentAccounts'] as $coll) {
                if (!isset($db[$coll]) || !is_array($db[$coll])) continue;
                foreach ($db[$coll] as &$acc) {
                    if (!is_array($acc) || (string) ($acc['id'] ?? '') !== $accountId) continue;
                    if (!isset($acc[$tiroir]) || !is_array($acc[$tiroir])) $acc[$tiroir] = [];
                    if (in_array($cle, $acc[$tiroir], true)) { unset($acc); return ['changed' => false, 'msg' => 'accès déjà ouvert']; }
                    $acc[$tiroir][] = $cle;
                    unset($acc);
                    return ['changed' => true, 'msg' => 'Accès ouvert (' . $intent . ')'];
                }
                unset($acc);
            }
            return ['changed' => false, 'msg' => 'compte introuvable'];
        }

        return ['changed' => false, 'msg' => 'intent non géré: ' . $intent];
    }

    /** Table des paliers de partenariat, telle qu'elle vit dans la base (l'admin
     *  peut la modifier), avec le repli sur les valeurs par défaut du client. */
    function vrt_paliers_partenaires(array $db): array {
        $l = (isset($db['partnerLevels']) && is_array($db['partnerLevels'])) ? $db['partnerLevels'] : [];
        $defaut = [
            'bronze'  => ['commission' => 0.05], 'argent'  => ['commission' => 0.08],
            'or'      => ['commission' => 0.10], 'diamant' => ['commission' => 0.12],
        ];
        foreach ($defaut as $k => $v) {
            if (!isset($l[$k]) || !is_array($l[$k]) || !isset($l[$k]['commission'])) $l[$k] = $v;
        }
        return $l;
    }

    /**
     * Commissions de code promo : ce que le serveur accepte VRAIMENT d'inscrire.
     *
     * Le navigateur propose, le serveur dispose. Pour chaque ligne reçue :
     *   1. le partenaire doit exister ET être actif dans la base ;
     *   2. le taux vient du PALIER enregistré, jamais du champ envoyé ;
     *   3. l'assiette est bornée au montant RÉELLEMENT encaissé ;
     *   4. la valeur envoyée par le client ne sert que de plafond (on prend le
     *      minimum des deux — un client honnête tombe juste, un client malveillant
     *      est ramené au taux réel) ;
     *   5. le cumul de la vente ne peut pas dépasser la moitié de l'encaissement ;
     *   6. dix lignes au maximum, et seuls les champs connus sont recopiés.
     * Toute ligne rejetée est journalisée : une tentative doit laisser une trace.
     */
    function vrt_commissions_verifiees(array $db, array $state): array {
        $brut = (isset($state['commissions']) && is_array($state['commissions'])) ? $state['commissions'] : [];
        if (!$brut) return [];

        $ref   = (string) ($state['ref'] ?? '');
        $paye  = (int) ($state['montant_paye'] ?? $state['montant'] ?? 0);
        if ($paye <= 0) return [];
        $plafondVente = (int) floor($paye * 0.5);   // garde-fou global de la vente
        $paliers  = vrt_paliers_partenaires($db);
        $partners = (isset($db['partners']) && is_array($db['partners'])) ? $db['partners'] : [];

        $out = []; $cumul = 0; $n = 0;
        foreach ($brut as $c) {
            if (!is_array($c) || empty($c['id'])) continue;
            if (++$n > 10) { vrt_pay_log("[COMMISSION_REFUSEE] ref=$ref motif=plus de 10 lignes"); break; }

            $pid = (string) ($c['partnerId'] ?? '');
            $partenaire = null;
            foreach ($partners as $p) {
                if (is_array($p) && (string) ($p['id'] ?? '') === $pid) { $partenaire = $p; break; }
            }
            if (!$partenaire) { vrt_pay_log("[COMMISSION_REFUSEE] ref=$ref partenaire=$pid motif=inconnu"); continue; }
            if ((string) ($partenaire['status'] ?? '') !== 'active') {
                vrt_pay_log("[COMMISSION_REFUSEE] ref=$ref partenaire=$pid motif=non actif"); continue;
            }

            $niveau = (string) ($partenaire['level'] ?? 'bronze');
            $taux   = (float) ($paliers[$niveau]['commission'] ?? ($paliers['bronze']['commission'] ?? 0.05));
            if ($taux <= 0 || $taux > 0.5) $taux = 0.05;              // palier aberrant en base

            $assiette = (int) ($c['saleAmount'] ?? 0);
            if ($assiette <= 0 || $assiette > $paye) $assiette = $paye;   // jamais plus que l'encaissé
            $attendu  = (int) round($assiette * $taux);
            $demande  = (int) ($c['commissionAmount'] ?? 0);
            $montant  = ($demande > 0) ? min($demande, $attendu) : $attendu;
            if ($montant <= 0) continue;
            if ($demande > $attendu) {
                vrt_pay_log("[COMMISSION_PLAFONNEE] ref=$ref partenaire=$pid demande=$demande retenu=$montant taux=$taux");
            }
            if ($cumul + $montant > $plafondVente) {
                vrt_pay_log("[COMMISSION_REFUSEE] ref=$ref partenaire=$pid motif=cumul>50% de $paye");
                continue;
            }
            $cumul += $montant;

            // Recopie par liste blanche : aucun champ inconnu ne rentre en base.
            $out[] = [
                'id'               => mb_substr((string) $c['id'], 0, 40),
                'partnerId'        => $pid,
                'type'             => 'sale',
                'refType'          => mb_substr((string) ($c['refType']  ?? 'other'), 0, 30),
                'refId'            => mb_substr((string) ($c['refId']    ?? ''), 0, 64),
                'refLabel'         => mb_substr((string) ($c['refLabel'] ?? ''), 0, 120),
                'saleAmount'       => $assiette,
                'commissionPct'    => $taux,
                'commissionAmount' => $montant,
                'qty'              => max(1, min(999, (int) ($c['qty'] ?? 1))),
                'status'           => 'validated',
                'date'             => date('d/m/Y'),
                'validatedAt'      => date('Y-m-d'),
                'paymentRef'       => $ref,
                'via'              => 'webhook_serveur',
            ];
        }
        return $out;
    }

    /** Journal des décisions d'argent prises côté serveur (hors webhook log). */
    function vrt_pay_log(string $ligne): void {
        @file_put_contents(__DIR__ . '/data/_commissions_log.txt',
            date('c') . ' ' . $ligne . "\n", FILE_APPEND | LOCK_EX);
    }

    /**
     * Octroi sur le FICHIER de base partagé : read-modify-write sous flock + backup
     * horodaté. Best-effort : renvoie un tableau, ne lève jamais. À appeler depuis
     * les webhooks de paiement une fois le statut « paid » établi de façon vérifiée.
     */
    function vrt_grant_entitlement_to_file(array $state): array {
        $f = vrt_db_file();
        if (!is_file($f)) return ['ok' => false, 'changed' => false, 'msg' => 'base absente'];
        $fp = @fopen($f, 'c+');
        if (!$fp) return ['ok' => false, 'changed' => false, 'msg' => 'ouverture impossible'];
        if (!flock($fp, LOCK_EX)) { fclose($fp); return ['ok' => false, 'changed' => false, 'msg' => 'verrou indisponible']; }
        $cur = stream_get_contents($fp);
        $db = json_decode((string) $cur, true);
        if (!is_array($db)) { flock($fp, LOCK_UN); fclose($fp); return ['ok' => false, 'changed' => false, 'msg' => 'base illisible']; }

        $bkDir = dirname($f) . '/_backups';
        if (!is_dir($bkDir)) @mkdir($bkDir, 0750, true);
        @file_put_contents($bkDir . '/veritas_db.' . date('Ymd_His') . '.' . bin2hex(random_bytes(3)) . '.pay.json', $cur);

        /* ROTATION — rien n'effaçait ces sauvegardes.
           Une copie complète de la base est écrite AVANT chaque octroi. La base
           pèse plusieurs mégaoctets : à raison d'un fichier par paiement, et sans
           personne pour faire le ménage, le dossier grossit jusqu'à saturer le
           quota d'un hébergement mutualisé — et un disque plein met TOUT le site
           en erreur 500, y compris les pages statiques qui n'ont rien à voir.
           C'est un filet de sécurité, pas un archivage : les 40 dernières
           suffisent largement à rattraper une écriture fautive, et l'export
           manuel reste le vrai outil de conservation. */
        $anciennes = glob($bkDir . '/veritas_db.*.pay.json') ?: [];
        if (count($anciennes) > 40) {
            sort($anciennes);                                   // horodatage en tête = ordre chronologique
            foreach (array_slice($anciennes, 0, count($anciennes) - 40) as $vieux) @unlink($vieux);
        }

        $res = vrt_grant_entitlement($db, $state);

        // ── Partage de revenus (auteurs / parrains) ──────────────────────────
        // ⚠️ CE BLOC MANIPULE DE L'ARGENT QUI SORT. Il recopiait telle quelle la
        //    liste `commissions` envoyée par le NAVIGATEUR et la marquait
        //    « validated ». Or `?action=init` est ouvert aux clients (jeton
        //    public) : n'importe qui pouvait payer 100 FCFA en joignant
        //    { partnerId: <le sien>, commissionAmount: 2000000 } et voir la somme
        //    créditée au solde de versement — puis partir toute seule si le
        //    versement automatique est actif. Le montant est désormais RECALCULÉ
        //    ici, à partir du palier du partenaire tel qu'il est enregistré dans
        //    la base : la valeur du client n'est plus qu'un plafond.
        $commChanged = false;
        $commissionsOk = vrt_commissions_verifiees($db, $state);
        if ($commissionsOk) {
            if (!isset($db['commissions']) || !is_array($db['commissions'])) $db['commissions'] = [];
            $seen = [];
            foreach ($db['commissions'] as $c) { if (is_array($c) && isset($c['id'])) $seen[(string) $c['id']] = true; }
            foreach ($commissionsOk as $c) {
                if (isset($seen[(string) $c['id']])) continue;
                $db['commissions'][] = $c;
                $seen[(string) $c['id']] = true;
                $commChanged = true;
            }
        }

        $changed = (!empty($res['changed']) || $commChanged);
        if ($changed) {
            $db['lastModified'] = (int) round(microtime(true) * 1000);
            $enc = json_encode($db, JSON_UNESCAPED_UNICODE);
            if ($enc !== false) { ftruncate($fp, 0); rewind($fp); fwrite($fp, $enc); fflush($fp); }
        }
        flock($fp, LOCK_UN);
        fclose($fp);
        return ['ok' => true, 'changed' => $changed, 'msg' => $res['msg'] ?? '',
                // Remonté jusqu'au fichier d'état par camerpayGrant() : un refus
                // de prix doit être LISIBLE dans le tableau de bord, pas seulement
                // dans un journal que personne n'ouvre.
                'underpaid' => !empty($res['underpaid'])];
    }
}
