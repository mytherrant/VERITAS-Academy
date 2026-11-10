<?php
/**
 * gestion/api/_auth.php — Sessions, rôles par centre, journal.
 * © 2024-2026 Jacques Miterand TAKOU (Mythe Errant). Tous droits réservés.
 *
 * Jetons opaques aléatoires, stockés HACHÉS (SHA-256) dans g_sessions :
 * révocables un par un (téléphone perdu) — même choix que api/campus/_auth.php.
 * Mots de passe en bcrypt.
 *
 * Modèle d'accès : un compte peut être « admin global » (les deux centres, la
 * vue consolidée) et/ou avoir un rôle dans un ou plusieurs centres (g_acces).
 * Le serveur filtre CHAQUE lecture et CHAQUE écriture sur ces centres : le
 * téléphone ne décide de rien.
 */
declare(strict_types=1);

const G_ROLES = ['responsable', 'actionnaire', 'secretaire', 'enseignant'];

/** Capacités par rôle de centre. L'admin global a tout, partout. */
function g_capacites(): array {
    return [
        'responsable' => ['centre.voir', 'eleves.gerer', 'appel.faire', 'paiements.encaisser', 'paiements.voir', 'finances.voir',
                          'depenses.saisir', 'depenses.voir', 'enseignants.gerer', 'comptes.gerer', 'journal.voir', 'stats.voir', 'emploi.gerer',
                          // Pouvoirs de correction : nommés pour que l'admin puisse les retirer un par un.
                          'appel.corriger', 'caisse.corriger', 'tarifs.fixer', 'remises.accorder', 'agenda.gerer'],
        // Demande de Jacques (02/11/2026) : les actionnaires tiennent l'emploi du temps de leur centre.
        // Demande de Jacques (03/11/2026) : chaque partenaire, selon ses jours au centre et sa
        // proximité avec les parents, peut encaisser et envoyer le reçu, puis remettre l'argent au trésorier.
        // Demande de Jacques (03/11/2026, suite) : le partenaire présent fait l'appel, relance les parents, inscrit les élèves, encaisse
        // inscriptions et mensualités, crée les comptes des enseignants, fixe leur contrat et les paie.
        // L'admin peut retirer chacun de ces droits à un partenaire (Administration › Partenaires et droits).
        'actionnaire' => ['centre.voir', 'finances.voir', 'paiements.voir', 'paiements.encaisser', 'depenses.voir', 'depenses.saisir', 'stats.voir',
                          'emploi.gerer', 'agenda.gerer', 'eleves.gerer', 'comptes.gerer', 'enseignants.gerer', 'appel.faire'],
        'secretaire'  => ['centre.voir', 'eleves.gerer', 'appel.faire', 'paiements.encaisser', 'paiements.voir', 'depenses.saisir', 'depenses.voir', 'agenda.gerer'],
        'enseignant'  => ['centre.voir', 'appel.faire'],
    ];
}

function g_bearer(): string {
    $auth = '';
    if (function_exists('getallheaders')) {
        foreach (getallheaders() as $k => $v) {
            if (strtolower((string) $k) === 'authorization') { $auth = (string) $v; break; }
        }
    }
    if ($auth === '') {
        $auth = (string) ($_SERVER['HTTP_AUTHORIZATION'] ?? $_SERVER['REDIRECT_HTTP_AUTHORIZATION'] ?? '');
    }
    return trim((string) preg_replace('/^\s*bearer\s+/i', '', $auth));
}

function g_hash_mdp(string $clair): string {
    return password_hash($clair, PASSWORD_BCRYPT, ['cost' => (int) G_BCRYPT_COST]);
}

/** Mot de passe lisible (sans 0/O, 1/l), mélangé à source cryptographique. */
function g_mdp_aleatoire(int $long = 10): string {
    $maj = 'ABCDEFGHJKLMNPQRSTUVWXYZ';
    $min = 'abcdefghijkmnpqrstuvwxyz';
    $chf = '23456789';
    $pool = $maj . $min . $chf;
    $c = [$maj[random_int(0, 23)], $min[random_int(0, 23)], $chf[random_int(0, 7)]];
    while (count($c) < $long) { $c[] = $pool[random_int(0, strlen($pool) - 1)]; }
    for ($i = count($c) - 1; $i > 0; $i--) { $j = random_int(0, $i); [$c[$i], $c[$j]] = [$c[$j], $c[$i]]; }
    return implode('', $c);
}

/**
 * Anti-force-brute, à appeler AVANT de vérifier un mot de passe : compte les
 * échecs récents consignés au journal, par IP et par identifiant.
 * Fail-open si le journal répond mal (le mot de passe reste exigé).
 */
function g_garde_connexion(string $identifiant): void {
    try {
        $depuis = g_now('-' . (int) G_LOGIN_FENETRE_MIN . ' minutes');
        $st = g_pdo()->prepare(
            "SELECT SUM(CASE WHEN ip = ? THEN 1 ELSE 0 END) AS par_ip,
                    SUM(CASE WHEN ip = ? AND entite_id = ? THEN 1 ELSE 0 END) AS par_couple,
                    SUM(CASE WHEN entite_id = ? THEN 1 ELSE 0 END) AS par_compte
               FROM g_journal WHERE action = 'connexion_echec' AND le > ?"
        );
        $st->execute([g_ip(), g_ip(), $identifiant, $identifiant, $depuis]);
        $r = $st->fetch() ?: [];
        if ((int) ($r['par_ip'] ?? 0) >= G_LOGIN_MAX_IP || (int) ($r['par_couple'] ?? 0) >= G_LOGIN_MAX_COMPTE
            || (int) ($r['par_compte'] ?? 0) >= G_LOGIN_MAX_COMPTE * 6) {
            header('Retry-After: ' . (G_LOGIN_FENETRE_MIN * 60));
            g_fail('Trop de tentatives. Réessayez dans ' . G_LOGIN_FENETRE_MIN . ' minutes.', 429);
        }
    } catch (Throwable $e) {
        error_log('[gestion][garde] ' . $e->getMessage());
    }
}

function g_ouvrir_session(string $uid, string $appareil): array {
    $jeton = bin2hex(random_bytes(32));
    $expire = g_now('+' . (int) G_SESSION_JOURS . ' days');
    g_pdo()->prepare(
        'INSERT INTO g_sessions (id, jeton_hash, utilisateur_id, appareil, ip, cree_le, expire_le, vu_le)
         VALUES (?,?,?,?,?,?,?,?)'
    )->execute([g_id(), hash('sha256', $jeton), $uid, mb_substr($appareil, 0, 120), g_ip(), g_now(), $expire, g_now()]);
    return ['jeton' => $jeton, 'expire_le' => $expire];
}

function g_fermer_session(): void {
    $j = g_bearer();
    if ($j !== '') {
        g_pdo()->prepare('DELETE FROM g_sessions WHERE jeton_hash = ?')->execute([hash('sha256', $j)]);
    }
}

/** Accès du compte : [centre_id => rôle]. */
function g_acces_de(string $uid): array {
    $st = g_pdo()->prepare('SELECT centre_id, role FROM g_acces WHERE utilisateur_id = ?');
    $st->execute([$uid]);
    $out = [];
    foreach ($st->fetchAll() as $r) { $out[(string) $r['centre_id']] = (string) $r['role']; }
    return $out;
}

/**
 * Exige une session valide. Contexte renvoyé :
 *   uid, identifiant, nom, admin (bool), acces [centre_id => rôle], session_id
 */
function g_exiger_session(?string $jetonForce = null): array {
    $j = $jetonForce ?? g_bearer();
    if ($j === '') { g_fail('Connexion requise.', 401); }
    $pdo = g_pdo();
    $st = $pdo->prepare(
        'SELECT s.id AS sid, s.expire_le, u.id, u.identifiant, u.nom, u.admin_global, u.actif, u.restrictions
           FROM g_sessions s JOIN g_utilisateurs u ON u.id = s.utilisateur_id
          WHERE s.jeton_hash = ?'
    );
    $st->execute([hash('sha256', $j)]);
    $r = $st->fetch();
    if (!$r) { g_fail('Session invalide ou révoquée.', 401); }
    if ((string) $r['expire_le'] < g_now()) {
        $pdo->prepare('DELETE FROM g_sessions WHERE id = ?')->execute([$r['sid']]);
        g_fail('Session expirée. Reconnectez-vous.', 401);
    }
    if ((int) $r['actif'] !== 1) { g_fail('Compte désactivé.', 403); }
    try { $pdo->prepare('UPDATE g_sessions SET vu_le = ? WHERE id = ?')->execute([g_now(), $r['sid']]); } catch (Throwable $e) {}
    return [
        'uid'         => (string) $r['id'],
        'identifiant' => (string) $r['identifiant'],
        'nom'         => (string) $r['nom'],
        'admin'       => (int) $r['admin_global'] === 1,
        'acces'       => g_acces_de((string) $r['id']),
        // Capacités retirées à ce compte par l'administrateur (tous centres confondus).
        'restrictions' => array_values(array_filter(explode(',', (string) ($r['restrictions'] ?? '')))),
        'session_id'  => (string) $r['sid'],
    ];
}

/** Le compte a-t-il la capacité $cap dans le centre $centreId ? */
function g_peut(array $ctx, string $cap, ?string $centreId): bool {
    if ($ctx['admin']) { return true; }
    if ($centreId === null || !isset($ctx['acces'][$centreId])) { return false; }
    if (in_array($cap, $ctx['restrictions'] ?? [], true)) { return false; }
    return in_array($cap, g_capacites()[$ctx['acces'][$centreId]] ?? [], true);
}

/** g_peut() pour les règles métier appelées pendant sync/pousser (contexte global). */
function g_ctx_peut(string $cap, string $centreId): bool {
    $ctx = $GLOBALS['g_ctx'] ?? null;
    return $ctx !== null && g_peut($ctx, $cap, $centreId);
}

/** Capacités que l'admin peut retirer à un compte (centre.voir reste : sans lui, plus rien n'a de sens). */
function g_capacites_retirables(): array {
    $toutes = [];
    foreach (g_capacites() as $caps) { $toutes = array_merge($toutes, $caps); }
    return array_values(array_diff(array_unique($toutes), ['centre.voir']));
}

function g_exiger(array $ctx, string $cap, ?string $centreId): void {
    if (!g_peut($ctx, $cap, $centreId)) { g_fail('Action non autorisée pour votre rôle dans ce centre.', 403); }
}

function g_exiger_admin(array $ctx): void {
    if (!$ctx['admin']) { g_fail('Réservé à l\'administrateur.', 403); }
}

/** Centres où le compte a la capacité $cap (tous pour l'admin). */
function g_centres_avec(array $ctx, string $cap): array {
    if ($ctx['admin']) {
        return array_map('strval', g_pdo()->query('SELECT id FROM g_centres WHERE supprime = 0')->fetchAll(PDO::FETCH_COLUMN));
    }
    $out = [];
    if (in_array($cap, $ctx['restrictions'] ?? [], true)) { return $out; }
    foreach ($ctx['acces'] as $cid => $role) {
        if (in_array($cap, g_capacites()[$role] ?? [], true)) { $out[] = (string) $cid; }
    }
    return $out;
}

/**
 * Journal « qui a modifié quoi ». Best-effort : un échec d'écriture du journal
 * ne doit jamais faire échouer l'action métier (mais il est consigné au log PHP).
 */
function g_journal(?array $ctx, string $action, string $entite = '', string $entiteId = '',
                   ?array $avant = null, ?array $apres = null, ?string $centreId = null): void {
    try {
        g_pdo()->prepare(
            'INSERT INTO g_journal (id, centre_id, utilisateur_id, identifiant, action, entite, entite_id, avant, apres, ip, le)
             VALUES (?,?,?,?,?,?,?,?,?,?,?)'
        )->execute([
            g_id(), $centreId, $ctx['uid'] ?? null, $ctx['identifiant'] ?? null, $action, $entite,
            mb_substr($entiteId, 0, 80),
            $avant !== null ? json_encode($avant, JSON_UNESCAPED_UNICODE) : null,
            $apres !== null ? json_encode($apres, JSON_UNESCAPED_UNICODE) : null,
            g_ip(), g_now(),
        ]);
    } catch (Throwable $e) {
        error_log('[gestion][journal] ' . $e->getMessage());
    }
}
