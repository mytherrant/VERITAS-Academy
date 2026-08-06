<?php
/**
 * api/campus/_auth.php — Authentification par jeton opaque (révocable).
 * © 2024-2026 Jacques Miterand TAKOU (Mythe Errant). Tous droits réservés.
 *
 * Choix : jetons opaques aléatoires stockés HACHÉS (SHA-256) dans cmp_auth_tokens
 * plutôt que JWT auto-signé → révocables, pas de risque d'alg-confusion, pas de
 * secret de signature à protéger. Mots de passe en bcrypt (cost 12).
 */
declare(strict_types=1);

/**
 * Lit le jeton Bearer (en-tête Authorization, ou repli _token en POST).
 *
 * Le repli en GET a été RETIRÉ : un jeton dans l'URL se retrouve dans les logs
 * du serveur, l'historique du navigateur et l'en-tête Referer — il fuit sans
 * que personne ne s'en aperçoive. Le client (campus.js) envoie l'en-tête.
 */
function cmp_bearer(): string {
    $auth = '';
    if (function_exists('getallheaders')) {
        foreach (getallheaders() as $k => $v) {
            if (strtolower($k) === 'authorization') { $auth = (string) $v; break; }
        }
    }
    if ($auth === '') {
        $auth = (string) ($_SERVER['HTTP_AUTHORIZATION'] ?? $_SERVER['REDIRECT_HTTP_AUTHORIZATION'] ?? '');
    }
    if ($auth === '' && !empty($_POST['_token'])) { $auth = 'Bearer ' . $_POST['_token']; }
    return trim(str_ireplace('bearer', '', $auth));
}

/**
 * Anti-force-brute des connexions, à appeler AVANT toute vérification de mot
 * de passe. Compte les échecs récents déjà consignés au journal (cmp_audit_log)
 * — pas de table supplémentaire à migrer.
 *
 * Deux compteurs sur la même fenêtre : par IP (un attaquant qui balaie les
 * comptes) et par e-mail (un attaquant distribué qui vise un seul compte).
 *
 * FAIL-OPEN volontaire : si le journal est indisponible, on laisse passer et on
 * log l'incident. Verrouiller tout l'établissement dehors parce qu'une table
 * répond mal serait un déni de service auto-infligé ; le mot de passe reste,
 * lui, exigé dans tous les cas.
 */
function cmp_login_guard(string $email): void {
    try {
        $fenetre = (int) CAMPUS_LOGIN_WINDOW_MIN;
        $st = cmp_pdo()->prepare(
            'SELECT SUM(ip = ?) AS par_ip, SUM(actor_email = ?) AS par_email
               FROM cmp_audit_log
              WHERE action IN (\'login_failed\', \'platform_login_failed\')
                AND created_at > (NOW() - INTERVAL ' . $fenetre . ' MINUTE)'
        );
        $st->execute([cmp_client_ip(), $email]);
        $r = $st->fetch() ?: [];
        $parIp    = (int) ($r['par_ip'] ?? 0);
        $parEmail = (int) ($r['par_email'] ?? 0);
        if ($parIp >= (int) CAMPUS_LOGIN_MAX_IP || $parEmail >= (int) CAMPUS_LOGIN_MAX_EMAIL) {
            header('Retry-After: ' . ($fenetre * 60));
            cmp_fail('Trop de tentatives de connexion. Réessayez dans ' . $fenetre . ' minutes.', 429);
        }
    } catch (Throwable $e) {
        error_log('[campus][login_guard] ' . $e->getMessage());
    }
}

/** Émet un jeton de session et le persiste haché. Renvoie le jeton EN CLAIR (une seule fois). */
function cmp_issue_token(string $scope, ?int $tenantId, int $userId, string $role): array {
    $token = bin2hex(random_bytes(32));
    $hash  = hash('sha256', $token);
    $exp   = (new DateTimeImmutable('+' . (int) CAMPUS_TOKEN_TTL_HOURS . ' hours'))->format('Y-m-d H:i:s');
    $st = cmp_pdo()->prepare(
        'INSERT INTO cmp_auth_tokens (token_hash, scope, tenant_id, user_id, role, expires_at, ip, user_agent)
         VALUES (?,?,?,?,?,?,?,?)'
    );
    $st->execute([
        $hash, $scope, $tenantId, $userId, $role, $exp,
        cmp_client_ip(), substr((string) ($_SERVER['HTTP_USER_AGENT'] ?? ''), 0, 255),
    ]);
    return ['token' => $token, 'expires_at' => $exp];
}

/** Révoque le jeton courant (logout). */
function cmp_revoke_current_token(): void {
    $token = cmp_bearer();
    if ($token === '') { return; }
    $st = cmp_pdo()->prepare('DELETE FROM cmp_auth_tokens WHERE token_hash = ?');
    $st->execute([hash('sha256', $token)]);
}

/**
 * Exige une session valide. Renvoie le contexte :
 *   [scope, tenant_id, user_id, role, email, nom, prenom]
 * $scope attendu : 'tenant' (défaut) ou 'platform'. $expectTenantId : si fourni,
 * le jeton DOIT appartenir à ce tenant (anti-rejeu cross-tenant).
 */
function cmp_require_auth(string $scope = 'tenant', ?int $expectTenantId = null): array {
    $token = cmp_bearer();
    if ($token === '') { cmp_fail('Authentification requise.', 401); }
    $pdo = cmp_pdo();
    $st = $pdo->prepare('SELECT * FROM cmp_auth_tokens WHERE token_hash = ? LIMIT 1');
    $st->execute([hash('sha256', $token)]);
    $row = $st->fetch();
    if (!$row) { cmp_fail('Session invalide.', 401); }
    if (strtotime((string) $row['expires_at']) < time()) {
        $pdo->prepare('DELETE FROM cmp_auth_tokens WHERE id = ?')->execute([$row['id']]);
        cmp_fail('Session expirée.', 401);
    }
    if ($row['scope'] !== $scope) { cmp_fail('Portée de session invalide.', 403); }
    if ($expectTenantId !== null && (int) $row['tenant_id'] !== $expectTenantId) {
        cmp_fail('Session non valable pour cet établissement.', 403);
    }
    // Rafraîchit last_used_at (best effort).
    try { $pdo->prepare('UPDATE cmp_auth_tokens SET last_used_at = NOW() WHERE id = ?')->execute([$row['id']]); } catch (Throwable $e) {}

    $ctx = [
        'scope'     => $row['scope'],
        'tenant_id' => $row['tenant_id'] !== null ? (int) $row['tenant_id'] : null,
        'user_id'   => (int) $row['user_id'],
        'role'      => (string) $row['role'],
        'email'     => '',
        'nom'       => '',
        'prenom'    => '',
    ];
    // Charge l'utilisateur + vérifie qu'il est toujours actif.
    if ($scope === 'platform') {
        $u = $pdo->prepare('SELECT email, name, status FROM cmp_platform_admins WHERE id = ?');
        $u->execute([$ctx['user_id']]);
        $user = $u->fetch();
        if (!$user || $user['status'] !== 'active') { cmp_fail('Compte plateforme désactivé.', 403); }
        $ctx['email'] = (string) $user['email'];
        $ctx['nom']   = (string) ($user['name'] ?? '');
    } else {
        $u = $pdo->prepare('SELECT email, nom, prenom, role, status FROM cmp_users WHERE id = ? AND tenant_id = ?');
        $u->execute([$ctx['user_id'], $ctx['tenant_id']]);
        $user = $u->fetch();
        if (!$user || $user['status'] !== 'active') { cmp_fail('Compte désactivé.', 403); }
        $ctx['email']  = (string) $user['email'];
        $ctx['nom']    = (string) ($user['nom'] ?? '');
        $ctx['prenom'] = (string) ($user['prenom'] ?? '');
        $ctx['role']   = (string) $user['role']; // source de vérité = la table users
    }
    return $ctx;
}

/** Garde de rôle : termine en 403 si le rôle courant n'est pas autorisé. */
function cmp_require_role(array $ctx, array $allowed): void {
    if (!in_array($ctx['role'], $allowed, true)) {
        cmp_fail('Action réservée (' . implode('/', $allowed) . ').', 403);
    }
}

/** Hache un mot de passe (bcrypt cost 12). */
function cmp_hash_password(string $plain): string {
    return password_hash($plain, PASSWORD_BCRYPT, ['cost' => (int) CAMPUS_BCRYPT_COST]);
}

/**
 * Carte rôle → capacités (« qui peut faire quoi »). Reflète l'organigramme d'un
 * établissement secondaire camerounais. '*' = tout (direction).
 * Capacités : students.manage/view · grades.enter/validate/override ·
 *   attendance.manage/record · discipline.manage · finance.manage ·
 *   documents.issue · staff.manage · comms.send · settings.manage · audit.view.
 */
function cmp_role_perms(): array {
    $all = ['*'];
    return [
        'admin'               => $all,
        'proviseur'           => $all,                 // chef d'établissement (lycée)
        'directeur'           => $all,                 // chef d'établissement (collège)
        'censeur'             => ['students.view','grades.enter','grades.validate','grades.override','attendance.manage','discipline.manage','documents.issue','comms.send','settings.manage','timetable.manage','audit.view'],
        'prefet_etudes'       => ['students.view','grades.enter','grades.validate','grades.override','documents.issue','comms.send','timetable.manage','audit.view'],
        'surveillant_general' => ['students.view','attendance.manage','attendance.record','discipline.manage','documents.issue','comms.send','audit.view'],
        'surveillant'         => ['students.view','attendance.manage','attendance.record','discipline.manage'],
        'intendant'           => ['students.view','finance.manage','transport.manage','hr.manage','documents.issue','comms.send'],
        'econome'             => ['students.view','finance.manage','hr.manage','documents.issue'],
        'comptable'           => ['students.view','finance.manage'],
        'secretaire'          => ['students.manage','students.view','library.manage','timetable.manage','documents.issue','comms.send'],
        'vie_scolaire'        => ['students.view','attendance.manage','attendance.record','discipline.manage'],
        'professeur'          => ['students.view','grades.enter','attendance.record'],
        'eleve'               => ['self.view'],
        'parent'              => ['self.view'],
    ];
}

/** Le contexte courant a-t-il la capacité demandée ? */
function cmp_can(array $ctx, string $perm): bool {
    $perms = cmp_role_perms()[$ctx['role']] ?? [];
    return in_array('*', $perms, true) || in_array($perm, $perms, true);
}

/** A-t-il AU MOINS une des capacités ? */
function cmp_can_any(array $ctx, array $perms): bool {
    foreach ($perms as $p) { if (cmp_can($ctx, $p)) { return true; } }
    return false;
}

/** Garde de capacité : termine en 403 si absente. */
function cmp_require_perm(array $ctx, string $perm): void {
    if (!cmp_can($ctx, $perm)) {
        cmp_fail('Permission insuffisante (' . $perm . ') pour le rôle « ' . $ctx['role'] . ' ».', 403);
    }
}

/**
 * Génère un mot de passe fort et lisible (alphabet sans caractères ambigus).
 *
 * Le mélange final se fait avec random_int : str_shuffle s'appuie sur le
 * générateur non cryptographique de PHP, et il aurait suffi à rendre la
 * position des trois caractères imposés devinable.
 */
function cmp_generate_password(int $len = 10): string {
    $alpha = 'ABCDEFGHJKLMNPQRSTUVWXYZ';
    $low   = 'abcdefghijkmnpqrstuvwxyz';
    $dig   = '23456789';
    $sym   = '@#%&*!';
    $pool  = $alpha . $low . $dig;
    $out  = $alpha[random_int(0, strlen($alpha) - 1)];
    $out .= $dig[random_int(0, strlen($dig) - 1)];
    $out .= $sym[random_int(0, strlen($sym) - 1)];
    for ($i = strlen($out); $i < $len; $i++) { $out .= $pool[random_int(0, strlen($pool) - 1)]; }
    // Fisher-Yates à source cryptographique.
    $c = str_split($out);
    for ($i = count($c) - 1; $i > 0; $i--) {
        $j = random_int(0, $i);
        [$c[$i], $c[$j]] = [$c[$j], $c[$i]];
    }
    return implode('', $c);
}
