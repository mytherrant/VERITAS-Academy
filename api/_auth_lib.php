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
                    return ['changed' => true, 'msg' => 'Commande livre confirmée'];
                }
            }
            unset($o);
            $db['visitorOrders'][] = [
                'id' => 'ord_' . bin2hex(random_bytes(5)), 'ref' => $ref, 'bid' => $targetId,
                'bookTitle' => preg_replace('/^[^—]*—\s*/u', '', $label), 'nom' => $nom ?: '?', 'tel' => $tel ?: '?',
                'date' => date('d/m/Y'), 'statut' => 'Payé', 'prix' => $montant, 'datePaiement' => date('c'), 'via' => 'webhook_serveur',
            ];
            vrt_dec_stock($db, $targetId);
            return ['changed' => true, 'msg' => 'Commande livre créée et confirmée'];
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

        return ['changed' => false, 'msg' => 'intent non géré: ' . $intent];
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

        $res = vrt_grant_entitlement($db, $state);

        // ── Partage de revenus (auteurs / parrains) ──────────────────────────
        // Le client envoie les commissions DÉJÀ CALCULÉES par applyPartnerCode
        // (palier × montant) au moment du paiement. Ici on se contente de les
        // PERSISTER en 'validated' (idempotent par id) → ZÉRO logique d'argent en
        // PHP. L'admin recalcule paliers/bonus à l'ouverture (calculatePartnerLevel).
        $commChanged = false;
        if (!empty($state['commissions']) && is_array($state['commissions'])) {
            if (!isset($db['commissions']) || !is_array($db['commissions'])) $db['commissions'] = [];
            $seen = [];
            foreach ($db['commissions'] as $c) { if (is_array($c) && isset($c['id'])) $seen[(string) $c['id']] = true; }
            foreach ($state['commissions'] as $c) {
                if (!is_array($c) || empty($c['id']) || isset($seen[(string) $c['id']])) continue;
                $c['status']      = 'validated';
                $c['validatedAt'] = date('Y-m-d');
                $c['via']         = 'webhook_serveur';
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
        return ['ok' => true, 'changed' => $changed, 'msg' => $res['msg'] ?? ''];
    }
}
