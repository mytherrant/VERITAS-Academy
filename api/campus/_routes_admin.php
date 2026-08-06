<?php
/**
 * api/campus/_routes_admin.php — Comptes du personnel + notifications WhatsApp/SMS.
 * © 2024-2026 Jacques Miterand TAKOU (Mythe Errant). Tous droits réservés.
 *
 * Inclus par index.php. Hérite de $route, $method et des helpers.
 * Génère les comptes (intendant, censeur, préfet des études, surveillant…) avec
 * mot de passe auto, et envoie automatiquement les identifiants + les messages.
 */
declare(strict_types=1);

require_once __DIR__ . '/_notify.php';

/** Rôles assignables à un membre du personnel + libellés FR. */
function cmp_staff_roles(): array {
    return [
        'proviseur'           => 'Proviseur',
        'directeur'           => 'Directeur',
        'censeur'             => 'Censeur',
        'prefet_etudes'       => 'Préfet des études',
        'surveillant_general' => 'Surveillant général',
        'surveillant'         => 'Surveillant',
        'intendant'           => 'Intendant',
        'econome'             => 'Économe',
        'comptable'           => 'Comptable',
        'secretaire'          => 'Secrétaire',
        'professeur'          => 'Enseignant',
        'vie_scolaire'        => 'Vie scolaire',
    ];
}

/** Marque (nom affiché + slug) d'un tenant, pour les messages. */
function cmp_brand_min(int $tid): array {
    $st = cmp_pdo()->prepare(
        'SELECT t.slug, COALESCE(b.product_name, t.name) AS name
           FROM cmp_tenants t LEFT JOIN cmp_tenant_branding b ON b.tenant_id = t.id
          WHERE t.id = ? LIMIT 1'
    );
    $st->execute([$tid]);
    return $st->fetch() ?: ['slug' => '', 'name' => 'VÉRITAS Campus'];
}

// ── GET /roles — catalogue des rôles (pour l'UI de création de comptes) ──
if ($route === 'roles' && $method === 'GET') {
    $ctx = cmp_require_auth('tenant');
    cmp_require_perm($ctx, 'staff.manage');
    cmp_ok(['roles' => cmp_staff_roles()]);
}

// ── GET /staff — liste du personnel (jamais de hash) ──
if ($route === 'staff' && $method === 'GET') {
    $ctx = cmp_require_auth('tenant');
    if (!cmp_can_any($ctx, ['staff.manage', 'audit.view'])) { cmp_fail('Accès refusé.', 403); }
    $st = cmp_pdo()->prepare(
        'SELECT id, email, role, nom, prenom, tel, status, last_login_at, created_at
           FROM cmp_users WHERE tenant_id = ? AND role NOT IN (\'eleve\',\'parent\')
          ORDER BY role, nom'
    );
    $st->execute([(int) $ctx['tenant_id']]);
    cmp_ok(['staff' => $st->fetchAll()]);
}

// ── POST /staff — créer un compte personnel (mot de passe auto + envoi auto) ──
if ($route === 'staff' && $method === 'POST') {
    $ctx = cmp_require_auth('tenant');
    cmp_require_perm($ctx, 'staff.manage');     // réservé à la direction
    $tid = (int) $ctx['tenant_id'];
    $email = strtolower(trim((string) cmp_param('email', '')));
    $role  = (string) cmp_param('role', '');
    $roles = cmp_staff_roles();
    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) { cmp_fail('E-mail invalide.', 422); }
    if (!isset($roles[$role])) { cmp_fail('Rôle invalide.', 422); }

    $pdo = cmp_pdo();
    $ex = $pdo->prepare('SELECT id FROM cmp_users WHERE tenant_id = ? AND email = ?');
    $ex->execute([$tid, $email]);
    if ($ex->fetch()) { cmp_fail('Un compte existe déjà avec cet e-mail.', 409); }

    // Mot de passe : fourni, sinon généré.
    $pass = trim((string) cmp_param('password', ''));
    $generated = ($pass === '');
    if ($generated) { $pass = cmp_generate_password(10); }
    if (strlen($pass) < 8) { cmp_fail('Mot de passe trop court (≥ 8 caractères).', 422); }

    $tel = trim((string) cmp_param('tel', ''));
    $pdo->prepare(
        'INSERT INTO cmp_users (tenant_id, email, password_hash, role, nom, prenom, tel, status)
         VALUES (?,?,?,?,?,?,?,\'active\')'
    )->execute([
        $tid, $email, cmp_hash_password($pass), $role,
        substr((string) cmp_param('nom', ''), 0, 120),
        substr((string) cmp_param('prenom', ''), 0, 120),
        substr($tel, 0, 60),
    ]);
    $uid = (int) $pdo->lastInsertId();
    // Audit SANS le mot de passe.
    cmp_audit($ctx, 'create_staff', 'user', (string) $uid, null, ['email' => $email, 'role' => $role]);

    // Envoi automatique des identifiants (WhatsApp par défaut, SMS en repli).
    $notif = null;
    $wantNotify = cmp_param('notify', true);
    if ($wantNotify && $tel !== '') {
        $brand = cmp_brand_min($tid);
        $url = 'https://' . $brand['slug'] . '.' . CAMPUS_ROOT_DOMAIN;
        $msg = $brand['name'] . " — votre compte (" . $roles[$role] . ") est créé.\n"
             . "Connexion : " . $url . "\nIdentifiant : " . $email . "\nMot de passe : " . $pass
             . "\nMerci de le changer à la 1re connexion.";
        $channel = in_array(cmp_param('channel', 'whatsapp'), ['whatsapp', 'sms'], true) ? (string) cmp_param('channel', 'whatsapp') : 'whatsapp';
        $notif = cmp_notify($tid, $channel, $tel, $msg, ['template' => 'welcome', 'created_by' => $ctx['user_id']]);
    }

    // Le mot de passe N'EST renvoyé qu'ICI (une seule fois) pour communication.
    cmp_ok([
        'user' => ['id' => $uid, 'email' => $email, 'role' => $role, 'role_label' => $roles[$role]],
        'password' => $pass, 'password_generated' => $generated, 'notification' => $notif,
    ], 201);
}

// ── POST /staff/reset-password — réinitialiser (admin) ──
if ($route === 'staff/reset-password' && $method === 'POST') {
    $ctx = cmp_require_auth('tenant');
    cmp_require_perm($ctx, 'staff.manage');
    $tid = (int) $ctx['tenant_id'];
    $uid = (int) cmp_param('user_id', 0);
    $st = cmp_pdo()->prepare('SELECT id, email, tel, role FROM cmp_users WHERE id = ? AND tenant_id = ? LIMIT 1');
    $st->execute([$uid, $tid]);
    $u = $st->fetch();
    if (!$u) { cmp_fail('Compte introuvable.', 404); }
    $pass = cmp_generate_password(10);
    cmp_pdo()->prepare('UPDATE cmp_users SET password_hash = ? WHERE id = ? AND tenant_id = ?')
        ->execute([cmp_hash_password($pass), $uid, $tid]);
    // Révoque les sessions existantes du compte (sécurité).
    cmp_pdo()->prepare('DELETE FROM cmp_auth_tokens WHERE tenant_id = ? AND user_id = ? AND scope = \'tenant\'')->execute([$tid, $uid]);
    cmp_audit($ctx, 'reset_staff_password', 'user', (string) $uid);
    $notif = null;
    if (cmp_param('notify', true) && $u['tel']) {
        $brand = cmp_brand_min($tid);
        $msg = $brand['name'] . " — votre mot de passe a été réinitialisé.\nIdentifiant : " . $u['email'] . "\nNouveau mot de passe : " . $pass;
        $notif = cmp_notify($tid, (string) cmp_param('channel', 'whatsapp'), (string) $u['tel'], $msg, ['template' => 'reset', 'created_by' => $ctx['user_id']]);
    }
    cmp_ok(['password' => $pass, 'notification' => $notif]);
}

// ── POST /staff/status — activer/désactiver un compte ──
if ($route === 'staff/status' && $method === 'POST') {
    $ctx = cmp_require_auth('tenant');
    cmp_require_perm($ctx, 'staff.manage');
    $tid = (int) $ctx['tenant_id'];
    $uid = (int) cmp_param('user_id', 0);
    $status = cmp_param('status', '') === 'disabled' ? 'disabled' : 'active';
    if ($uid === $ctx['user_id']) { cmp_fail('Vous ne pouvez pas désactiver votre propre compte.', 409); }
    cmp_pdo()->prepare('UPDATE cmp_users SET status = ? WHERE id = ? AND tenant_id = ?')->execute([$status, $uid, $tid]);
    if ($status === 'disabled') {
        cmp_pdo()->prepare('DELETE FROM cmp_auth_tokens WHERE tenant_id = ? AND user_id = ? AND scope = \'tenant\'')->execute([$tid, $uid]);
    }
    cmp_audit($ctx, 'set_staff_status', 'user', (string) $uid, null, ['status' => $status]);
    cmp_ok(['status' => $status]);
}

// ── POST /notify/send — envoi manuel WhatsApp/SMS (à un numéro ou à un élève) ──
if ($route === 'notify/send' && $method === 'POST') {
    $ctx = cmp_require_auth('tenant');
    cmp_require_perm($ctx, 'comms.send');
    $tid = (int) $ctx['tenant_id'];
    $channel = (string) cmp_param('channel', 'sms');
    $message = trim((string) cmp_param('message', ''));
    if ($message === '') { cmp_fail('Message vide.', 422); }
    $recipient = trim((string) cmp_param('recipient', ''));
    $studentId = (int) cmp_param('student_id', 0);
    if ($recipient === '' && $studentId) {
        $s = cmp_pdo()->prepare('SELECT parent_tel FROM cmp_students WHERE id = ? AND tenant_id = ?');
        $s->execute([$studentId, $tid]);
        $recipient = (string) ($s->fetchColumn() ?: '');
    }
    if ($recipient === '') { cmp_fail('Destinataire requis (recipient ou student_id avec n° parent).', 422); }
    $notif = cmp_notify($tid, $channel, $recipient, $message, ['student_id' => $studentId, 'template' => 'custom', 'created_by' => $ctx['user_id']]);
    cmp_audit($ctx, 'notify_send', 'notification', (string) $notif['id'], null, ['channel' => $channel]);
    cmp_ok(['notification' => $notif]);
}

// ── GET /notify/log — journal d'envoi ──
if ($route === 'notify/log' && $method === 'GET') {
    $ctx = cmp_require_auth('tenant');
    if (!cmp_can_any($ctx, ['comms.send', 'audit.view'])) { cmp_fail('Accès refusé.', 403); }
    $st = cmp_pdo()->prepare(
        'SELECT id, channel, recipient, template, status, provider, error, created_at, sent_at
           FROM cmp_notifications WHERE tenant_id = ? ORDER BY id DESC LIMIT 200'
    );
    $st->execute([(int) $ctx['tenant_id']]);
    cmp_ok(['notifications' => $st->fetchAll()]);
}
