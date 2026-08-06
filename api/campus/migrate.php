<?php
/**
 * api/campus/migrate.php — Installateur idempotent du schéma + 1er admin plateforme.
 * © 2024-2026 Jacques Miterand TAKOU (Mythe Errant). Tous droits réservés.
 *
 * PROTÉGÉ : exige le jeton CAMPUS_INSTALL_TOKEN (défini dans api/payment_config.php).
 * FAIL-CLOSED : si le jeton n'est pas posé côté serveur, aucune action possible.
 *
 * USAGE (une fois, par l'admin serveur) :
 *   1. Poser dans api/payment_config.php :  define('CAMPUS_INSTALL_TOKEN', '<openssl rand -hex 32>');
 *   2. POST  /api/campus/migrate.php?action=install        &token=<jeton>
 *   3. POST  /api/campus/migrate.php?action=seed_admin     &token=<jeton>&email=...&password=...
 *   (optionnel) action=demo_tenant pour créer un établissement de démonstration.
 */
declare(strict_types=1);

require_once __DIR__ . '/_bootstrap.php';
require_once __DIR__ . '/_seed_academics.php';

// ── Garde fail-closed : le jeton serveur doit être explicitement défini. ──
$provided = (string) ($_GET['token'] ?? $_POST['token'] ?? '');
if (!defined('CAMPUS_INSTALL_TOKEN') || $provided === '' || !hash_equals(CAMPUS_INSTALL_TOKEN, $provided)) {
    cmp_fail('Installation verrouillée : jeton invalide ou CAMPUS_INSTALL_TOKEN non défini dans api/payment_config.php.', 403);
}

$action = (string) ($_GET['action'] ?? $_POST['action'] ?? '');
$pdo = cmp_pdo();

if ($action === 'install') {
    $sql = file_get_contents(__DIR__ . '/schema.sql');
    if ($sql === false) { cmp_fail('schema.sql introuvable.', 500); }
    // Retire les lignes de commentaire « -- … », puis découpe en instructions.
    $lines = preg_split('/\R/', $sql);
    $clean = [];
    foreach ($lines as $ln) {
        if (preg_match('/^\s*--/', $ln)) { continue; }
        $clean[] = $ln;
    }
    $statements = array_filter(array_map('trim', explode(';', implode("\n", $clean))));
    $done = []; $errors = [];
    foreach ($statements as $stmt) {
        if ($stmt === '') { continue; }
        try {
            $pdo->exec($stmt);
            if (preg_match('/CREATE TABLE IF NOT EXISTS\s+`?(\w+)`?/i', $stmt, $m)) { $done[] = $m[1]; }
        } catch (Throwable $e) {
            $errors[] = substr($e->getMessage(), 0, 200);
        }
    }
    cmp_ok(['action' => 'install', 'tables' => $done, 'errors' => $errors]);
}

if ($action === 'seed_admin') {
    $email = strtolower(trim((string) ($_POST['email'] ?? $_GET['email'] ?? '')));
    $pass  = (string) ($_POST['password'] ?? $_GET['password'] ?? '');
    $name  = (string) ($_POST['name'] ?? $_GET['name'] ?? 'Administrateur VÉRITAS');
    if ($email === '' || strlen($pass) < 10) {
        cmp_fail('email + password (≥ 10 caractères) requis.', 422);
    }
    $st = $pdo->prepare(
        'INSERT INTO cmp_platform_admins (email, password_hash, name, status) VALUES (?,?,?,?)
         ON DUPLICATE KEY UPDATE password_hash = VALUES(password_hash), name = VALUES(name), status = "active"'
    );
    $st->execute([$email, password_hash($pass, PASSWORD_BCRYPT, ['cost' => (int) CAMPUS_BCRYPT_COST]), $name, 'active']);
    cmp_ok(['action' => 'seed_admin', 'email' => $email]);
}

if ($action === 'demo_tenant') {
    // Établissement de démonstration bilingue (général + technique) pour tester.
    $slug = 'demo';
    $exists = $pdo->prepare('SELECT id FROM cmp_tenants WHERE slug = ?');
    $exists->execute([$slug]);
    if ($exists->fetch()) { cmp_ok(['action' => 'demo_tenant', 'message' => 'Déjà créé.']); }
    try {
        $pdo->beginTransaction();
        $pdo->prepare('INSERT INTO cmp_tenants (slug, name, status, plan, max_students) VALUES (?,?,?,?,?)')
            ->execute([$slug, 'Établissement Démo (bilingue)', 'active', 'pro', 1000]);
        $tid = (int) $pdo->lastInsertId();
        $pdo->prepare('INSERT INTO cmp_tenant_branding (tenant_id, product_name, slogan, primary_color, accent_color) VALUES (?,?,?,?,?)')
            ->execute([$tid, 'Collège Démo', 'L\'excellence en deux langues', '#142554', '#FFC93C']);
        $pdo->prepare('INSERT INTO cmp_tenant_settings (tenant_id) VALUES (?)')->execute([$tid]);
        $m = $pdo->prepare('INSERT INTO cmp_tenant_modules (tenant_id, module_key, enabled) VALUES (?,?,1)');
        foreach (['frais', 'bulletins', 'sms', 'elearning', 'ia', 'jeux', 'discipline', 'emploi_temps', 'boutique', 'rh'] as $mk) {
            $m->execute([$tid, $mk]);
        }
        campus_install_academics($pdo, $tid, []); // toutes les sections FR/EN × général/technique
        $pdo->prepare('INSERT INTO cmp_users (tenant_id, email, password_hash, role, status) VALUES (?,?,?,?,?)')
            ->execute([$tid, 'admin@demo.cm', password_hash('Demo@12345', PASSWORD_BCRYPT, ['cost' => (int) CAMPUS_BCRYPT_COST]), 'admin', 'active']);
        $pdo->commit();
    } catch (Throwable $e) {
        if ($pdo->inTransaction()) { $pdo->rollBack(); }
        cmp_fail('Échec création démo : ' . substr($e->getMessage(), 0, 200), 500);
    }
    cmp_ok(['action' => 'demo_tenant', 'slug' => $slug, 'admin' => 'admin@demo.cm / Demo@12345']);
}

cmp_fail('Action inconnue. Utilisez action=install | seed_admin | demo_tenant.', 400);
