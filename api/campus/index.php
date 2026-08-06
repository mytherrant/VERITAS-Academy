<?php
/**
 * api/campus/index.php — Front controller du backend multi-tenant VÉRITAS Campus.
 * © 2024-2026 Jacques Miterand TAKOU (Mythe Errant). Tous droits réservés.
 *
 * Routage : route = PATH_INFO (…/index.php/auth/login) OU ?route=auth/login.
 * Toutes les réponses sont JSON. Voir api/campus/README.md pour le contrat complet.
 */
declare(strict_types=1);

require_once __DIR__ . '/_bootstrap.php';
require_once __DIR__ . '/_tenant.php';
require_once __DIR__ . '/_auth.php';
require_once __DIR__ . '/_audit.php';
require_once __DIR__ . '/_seed_academics.php';

$method = $_SERVER['REQUEST_METHOD'] ?? 'GET';
$route  = (string) ($_SERVER['PATH_INFO'] ?? ($_GET['route'] ?? ''));
$route  = trim($route, '/');

// Mapping plan → plafond d'élèves (garde-fou forfait).
function cmp_plan_cap(string $plan): int {
    return [
        'starter' => 200, 'croissance' => 400, 'pro' => 1000,
        'premium' => 1500, 'entreprise' => 100000,
    ][$plan] ?? 200;
}

// Modules activés par défaut à la création d'un établissement.
function cmp_default_modules(): array {
    return ['frais', 'bulletins', 'sms', 'elearning', 'ia', 'jeux', 'discipline', 'emploi_temps', 'boutique', 'rh'];
}

// Lit la config white-label complète d'un tenant (branding + modules + sections).
function cmp_tenant_config(int $tenantId): array {
    $pdo = cmp_pdo();
    $b = $pdo->prepare('SELECT * FROM cmp_tenant_branding WHERE tenant_id = ?');
    $b->execute([$tenantId]);
    $branding = $b->fetch() ?: [];
    unset($branding['tenant_id'], $branding['updated_at']);

    $m = $pdo->prepare('SELECT module_key, enabled FROM cmp_tenant_modules WHERE tenant_id = ?');
    $m->execute([$tenantId]);
    $modules = [];
    foreach ($m->fetchAll() as $r) { $modules[$r['module_key']] = (bool) $r['enabled']; }

    $s = $pdo->prepare(
        'SELECT section_key, sous_systeme, filiere, label, langue, bareme, grading_scale, periodes, cycles, grading, enabled
           FROM cmp_academic_sections WHERE tenant_id = ? ORDER BY ordering'
    );
    $s->execute([$tenantId]);
    $sections = [];
    foreach ($s->fetchAll() as $r) {
        $r['enabled'] = (bool) $r['enabled'];
        $r['cycles'] = $r['cycles'] ? json_decode((string) $r['cycles'], true) : [];
        $r['grading'] = $r['grading'] ? json_decode((string) $r['grading'], true) : null;
        $sections[] = $r;
    }
    // Récapitulatif des sous-systèmes/filières actifs (pratique pour l'UI).
    $sous = []; $fil = [];
    foreach ($sections as $sec) {
        if ($sec['enabled']) { $sous[$sec['sous_systeme']] = true; $fil[$sec['filiere']] = true; }
    }
    return [
        'branding'       => $branding,
        'modules'        => $modules,
        'academics'      => ['sections' => $sections, 'sous_systemes' => array_keys($sous), 'filieres' => array_keys($fil)],
    ];
}

// =====================================================================
//  ROUTES
// =====================================================================

// ── GET /tenant/config — config white-label PUBLIQUE (thème avant login) ──
if ($route === 'tenant/config' && $method === 'GET') {
    $t = cmp_require_tenant();
    $cfg = cmp_tenant_config((int) $t['id']);
    cmp_ok([
        'tenant' => ['slug' => $t['slug'], 'name' => $t['name'], 'plan' => $t['plan'], 'status' => $t['status'], 'currency' => $t['currency']],
        'branding' => $cfg['branding'],
        'modules' => $cfg['modules'],
        'academics' => $cfg['academics'],
    ]);
}

// ── POST /auth/login — connexion utilisateur d'un établissement ──
if ($route === 'auth/login' && $method === 'POST') {
    $t = cmp_require_tenant();
    $email = strtolower(trim((string) cmp_param('email', '')));
    $pass  = (string) cmp_param('password', '');
    if ($email === '' || $pass === '') { cmp_fail('E-mail et mot de passe requis.', 422); }
    cmp_login_guard($email);   // anti-force-brute AVANT toute vérification

    $st = cmp_pdo()->prepare('SELECT * FROM cmp_users WHERE tenant_id = ? AND email = ? LIMIT 1');
    $st->execute([(int) $t['id'], $email]);
    $u = $st->fetch();
    // Message générique (anti-énumération de comptes).
    if (!$u || $u['status'] !== 'active' || !password_verify($pass, (string) $u['password_hash'])) {
        cmp_audit(['tenant_id' => (int) $t['id'], 'email' => $email, 'role' => 'inconnu'], 'login_failed', 'user', $email);
        cmp_fail('Identifiants invalides.', 401);
    }
    cmp_pdo()->prepare('UPDATE cmp_users SET last_login_at = NOW() WHERE id = ?')->execute([(int) $u['id']]);
    $tok = cmp_issue_token('tenant', (int) $t['id'], (int) $u['id'], (string) $u['role']);
    $ctx = ['tenant_id' => (int) $t['id'], 'user_id' => (int) $u['id'], 'email' => $email, 'role' => $u['role']];
    cmp_audit($ctx, 'login', 'user', (string) $u['id']);
    cmp_ok([
        'token' => $tok['token'], 'expires_at' => $tok['expires_at'],
        'user' => ['id' => (int) $u['id'], 'email' => $email, 'role' => $u['role'], 'nom' => $u['nom'], 'prenom' => $u['prenom']],
    ]);
}

// ── POST /auth/logout ──
if ($route === 'auth/logout' && $method === 'POST') {
    cmp_revoke_current_token();
    cmp_ok(['message' => 'Déconnecté.']);
}

// ── GET /me — utilisateur courant + config de son établissement ──
if ($route === 'me' && $method === 'GET') {
    $ctx = cmp_require_auth('tenant');
    $cfg = cmp_tenant_config((int) $ctx['tenant_id']);
    cmp_ok([
        'user' => ['id' => $ctx['user_id'], 'email' => $ctx['email'], 'role' => $ctx['role'], 'nom' => $ctx['nom'], 'prenom' => $ctx['prenom']],
        'config' => $cfg,
    ]);
}

// ── PUT /tenant/branding — l'admin de l'école change logo/couleurs/nom ──
if ($route === 'tenant/branding' && in_array($method, ['PUT', 'PATCH', 'POST'], true)) {
    $ctx = cmp_require_auth('tenant');
    cmp_require_role($ctx, ['admin']);
    $tid = (int) $ctx['tenant_id'];
    $allowed = ['product_name', 'slogan', 'logo_url', 'favicon_url', 'login_bg_url',
                'primary_color', 'accent_color', 'header_mode', 'font_family',
                'contact_tel', 'contact_whatsapp', 'contact_email', 'address'];
    $body = cmp_body();
    $sets = []; $vals = [];
    foreach ($allowed as $f) {
        if (array_key_exists($f, $body)) {
            $v = (string) $body[$f];
            if (($f === 'primary_color' || $f === 'accent_color') && !preg_match('/^#[0-9A-Fa-f]{3,8}$/', $v)) {
                cmp_fail("Couleur invalide pour $f (format #RRGGBB attendu).", 422);
            }
            if ($f === 'header_mode' && !in_array($v, ['sombre', 'clair'], true)) {
                cmp_fail('header_mode doit être « sombre » ou « clair ».', 422);
            }
            $sets[] = "`$f` = ?"; $vals[] = $v;
        }
    }
    if (!$sets) { cmp_fail('Aucun champ de marque à mettre à jour.', 422); }
    $vals[] = $tid;
    cmp_pdo()->prepare('UPDATE cmp_tenant_branding SET ' . implode(',', $sets) . ' WHERE tenant_id = ?')->execute($vals);
    cmp_audit($ctx, 'update_branding', 'branding', (string) $tid, null, $body);
    cmp_ok(['branding' => cmp_tenant_config($tid)['branding']]);
}

// ── PUT /tenant/modules — activer/désactiver des modules ──
if ($route === 'tenant/modules' && in_array($method, ['PUT', 'PATCH', 'POST'], true)) {
    $ctx = cmp_require_auth('tenant');
    cmp_require_role($ctx, ['admin']);
    $tid = (int) $ctx['tenant_id'];
    $mods = cmp_param('modules', null);
    if (!is_array($mods)) { cmp_fail('« modules » doit être un objet {clé: bool}.', 422); }
    $st = cmp_pdo()->prepare(
        'INSERT INTO cmp_tenant_modules (tenant_id, module_key, enabled) VALUES (?,?,?)
         ON DUPLICATE KEY UPDATE enabled = VALUES(enabled)'
    );
    foreach ($mods as $key => $on) {
        $key = preg_replace('/[^a-z_]/', '', strtolower((string) $key));
        if ($key === '') { continue; }
        $st->execute([$tid, $key, $on ? 1 : 0]);
    }
    cmp_audit($ctx, 'update_modules', 'modules', (string) $tid, null, $mods);
    cmp_ok(['modules' => cmp_tenant_config($tid)['modules']]);
}

// ── GET /academics — structure académique de l'établissement ──
if ($route === 'academics' && $method === 'GET') {
    $ctx = cmp_require_auth('tenant');
    cmp_ok(['academics' => cmp_tenant_config((int) $ctx['tenant_id'])['academics']]);
}

// ── PUT /academics/section — activer/désactiver/éditer une section ──
if ($route === 'academics/section' && in_array($method, ['PUT', 'PATCH', 'POST'], true)) {
    $ctx = cmp_require_auth('tenant');
    cmp_require_role($ctx, ['admin']);
    $tid = (int) $ctx['tenant_id'];
    $key = preg_replace('/[^a-z0-9_]/', '', strtolower((string) cmp_param('section_key', '')));
    if ($key === '') { cmp_fail('section_key requis.', 422); }
    $body = cmp_body();
    $sets = []; $vals = [];
    foreach (['label', 'bareme', 'grading_scale', 'periodes', 'enabled', 'cycles', 'grading'] as $f) {
        if (!array_key_exists($f, $body)) { continue; }
        if ($f === 'cycles' || $f === 'grading') { $sets[] = '`' . $f . '` = ?'; $vals[] = json_encode($body[$f], JSON_UNESCAPED_UNICODE); }
        elseif ($f === 'enabled') { $sets[] = '`enabled` = ?'; $vals[] = $body[$f] ? 1 : 0; }
        elseif ($f === 'bareme') { $sets[] = '`bareme` = ?'; $vals[] = (int) $body[$f]; }
        else { $sets[] = "`$f` = ?"; $vals[] = (string) $body[$f]; }
    }
    if (!$sets) { cmp_fail('Aucun champ de section à mettre à jour.', 422); }
    $vals[] = $tid; $vals[] = $key;
    $n = cmp_pdo()->prepare('UPDATE cmp_academic_sections SET ' . implode(',', $sets) . ' WHERE tenant_id = ? AND section_key = ?');
    $n->execute($vals);
    cmp_audit($ctx, 'update_section', 'academic_section', $key, null, $body);
    cmp_ok(['academics' => cmp_tenant_config($tid)['academics']]);
}

// ── GET /students — liste scopée au tenant (preuve d'isolation) ──
if ($route === 'students' && $method === 'GET') {
    $ctx = cmp_require_auth('tenant');
    cmp_require_role($ctx, ['admin', 'comptable', 'professeur', 'vie_scolaire']);
    $tid = (int) $ctx['tenant_id'];
    $st = cmp_pdo()->prepare(
        'SELECT s.id, s.matricule, s.nom, s.prenom, s.sexe, s.statut, s.frais_total,
                c.code AS class_code, c.name AS class_name, c.sous_systeme, c.filiere
           FROM cmp_students s LEFT JOIN cmp_classes c ON c.id = s.class_id AND c.tenant_id = s.tenant_id
          WHERE s.tenant_id = ? ORDER BY s.nom, s.prenom LIMIT 1000'
    );
    $st->execute([$tid]); // ← TOUJOURS filtré par tenant_id (isolation imposée)
    cmp_ok(['students' => $st->fetchAll()]);
}

// ── POST /students — créer un élève (scopé + audité) ──
if ($route === 'students' && $method === 'POST') {
    $ctx = cmp_require_auth('tenant');
    cmp_require_role($ctx, ['admin', 'comptable']);
    $tid = (int) $ctx['tenant_id'];
    $nom = trim((string) cmp_param('nom', ''));
    if ($nom === '') { cmp_fail('Nom requis.', 422); }
    // Garde-fou plafond du forfait.
    $cap = (int) (cmp_pdo()->query('SELECT max_students FROM cmp_tenants WHERE id = ' . $tid)->fetchColumn() ?: 0);
    $cnt = (int) cmp_pdo()->query('SELECT COUNT(*) FROM cmp_students WHERE tenant_id = ' . $tid)->fetchColumn();
    if ($cap > 0 && $cnt >= $cap) {
        cmp_fail('Plafond du forfait atteint (' . $cap . ' élèves). Passez au forfait supérieur.', 409);
    }
    $st = cmp_pdo()->prepare(
        'INSERT INTO cmp_students (tenant_id, matricule, nom, prenom, sexe, class_id, parent_nom, parent_tel, frais_total, statut)
         VALUES (?,?,?,?,?,?,?,?,?,?)'
    );
    $st->execute([
        $tid,
        substr((string) cmp_param('matricule', ''), 0, 40) ?: null,
        substr($nom, 0, 120),
        substr((string) cmp_param('prenom', ''), 0, 120),
        substr((string) cmp_param('sexe', ''), 0, 1) ?: null,
        ($cid = (int) cmp_param('class_id', 0)) ? $cid : null,
        substr((string) cmp_param('parent_nom', ''), 0, 200),
        substr((string) cmp_param('parent_tel', ''), 0, 60),
        (int) cmp_param('frais_total', 0),
        substr((string) cmp_param('statut', 'actif'), 0, 40),
    ]);
    $id = (int) cmp_pdo()->lastInsertId();
    cmp_audit($ctx, 'create_student', 'student', (string) $id, null, ['nom' => $nom]);
    cmp_ok(['id' => $id], 201);
}

// =====================================================================
//  ROUTES PLATEFORME (éditeur VÉRITAS) — provisioning des établissements
// =====================================================================

// ── POST /platform/login ──
if ($route === 'platform/login' && $method === 'POST') {
    $email = strtolower(trim((string) cmp_param('email', '')));
    $pass  = (string) cmp_param('password', '');
    if ($email === '' || $pass === '') { cmp_fail('E-mail et mot de passe requis.', 422); }
    cmp_login_guard($email);   // anti-force-brute AVANT toute vérification
    $st = cmp_pdo()->prepare('SELECT * FROM cmp_platform_admins WHERE email = ? LIMIT 1');
    $st->execute([$email]);
    $a = $st->fetch();
    if (!$a || $a['status'] !== 'active' || !password_verify($pass, (string) $a['password_hash'])) {
        // Un échec sur le compte ÉDITEUR ne laissait aucune trace : c'est
        // pourtant le compte qui voit tous les établissements. Il est consigné,
        // et il alimente le compteur anti-force-brute.
        cmp_audit(['email' => $email, 'role' => 'inconnu'], 'platform_login_failed', 'platform_admin', $email);
        cmp_fail('Identifiants invalides.', 401);
    }
    cmp_pdo()->prepare('UPDATE cmp_platform_admins SET last_login_at = NOW() WHERE id = ?')->execute([(int) $a['id']]);
    $tok = cmp_issue_token('platform', null, (int) $a['id'], 'superadmin');
    cmp_audit(['user_id' => (int) $a['id'], 'email' => $email, 'role' => 'superadmin'], 'platform_login', 'platform_admin', (string) $a['id']);
    cmp_ok(['token' => $tok['token'], 'expires_at' => $tok['expires_at'], 'admin' => ['email' => $email, 'name' => $a['name']]]);
}

// ── GET /platform/tenants — liste des établissements ──
if ($route === 'platform/tenants' && $method === 'GET') {
    cmp_require_auth('platform');
    $rows = cmp_pdo()->query(
        'SELECT t.id, t.slug, t.name, t.status, t.plan, t.max_students, t.created_at,
                (SELECT COUNT(*) FROM cmp_students s WHERE s.tenant_id = t.id) AS students,
                (SELECT COUNT(*) FROM cmp_users u WHERE u.tenant_id = t.id) AS users
           FROM cmp_tenants t ORDER BY t.created_at DESC'
    )->fetchAll();
    cmp_ok(['tenants' => $rows]);
}

// ── POST /platform/tenants — PROVISIONNER un nouvel établissement (onboarding) ──
if ($route === 'platform/tenants' && $method === 'POST') {
    $ctx = cmp_require_auth('platform');
    $slug = preg_replace('/[^a-z0-9\-]/', '', strtolower(trim((string) cmp_param('slug', ''))));
    $name = trim((string) cmp_param('name', ''));
    $plan = (string) cmp_param('plan', 'starter');
    $adminEmail = strtolower(trim((string) cmp_param('admin_email', '')));
    $adminPass  = (string) cmp_param('admin_password', '');
    $productName = trim((string) cmp_param('product_name', '')) ?: $name;
    $sections = cmp_param('sections', []); // [] = toutes ; sinon sous-ensemble de section_key
    if (!is_array($sections)) { $sections = []; }

    if ($slug === '' || $name === '' || $adminEmail === '' || strlen($adminPass) < 8) {
        cmp_fail('slug, name, admin_email et admin_password (≥ 8 car.) requis.', 422);
    }
    if (!in_array($plan, ['starter', 'croissance', 'pro', 'premium', 'entreprise'], true)) {
        cmp_fail('Forfait invalide.', 422);
    }
    $pdo = cmp_pdo();
    $exists = $pdo->prepare('SELECT id FROM cmp_tenants WHERE slug = ?');
    $exists->execute([$slug]);
    if ($exists->fetch()) { cmp_fail('Ce sous-domaine (slug) est déjà pris.', 409); }

    try {
        $pdo->beginTransaction();
        $pdo->prepare('INSERT INTO cmp_tenants (slug, name, status, plan, max_students) VALUES (?,?,?,?,?)')
            ->execute([$slug, $name, 'trial', $plan, cmp_plan_cap($plan)]);
        $tid = (int) $pdo->lastInsertId();

        // Branding par défaut (navy/or VÉRITAS) — l'admin personnalisera ensuite.
        $pdo->prepare('INSERT INTO cmp_tenant_branding (tenant_id, product_name, slogan) VALUES (?,?,?)')
            ->execute([$tid, substr($productName, 0, 120), '']);
        $pdo->prepare('INSERT INTO cmp_tenant_settings (tenant_id) VALUES (?)')->execute([$tid]);

        // Modules par défaut.
        $mstmt = $pdo->prepare('INSERT INTO cmp_tenant_modules (tenant_id, module_key, enabled) VALUES (?,?,1)');
        foreach (cmp_default_modules() as $mk) { $mstmt->execute([$tid, $mk]); }

        // Structure académique (FR/EN × général/technique) — configurable.
        campus_install_academics($pdo, $tid, $sections);

        // Compte admin de l'établissement.
        $pdo->prepare('INSERT INTO cmp_users (tenant_id, email, password_hash, role, status) VALUES (?,?,?,?,?)')
            ->execute([$tid, $adminEmail, cmp_hash_password($adminPass), 'admin', 'active']);

        $pdo->commit();
    } catch (Throwable $e) {
        if ($pdo->inTransaction()) { $pdo->rollBack(); }
        error_log('[campus][provision] ' . $e->getMessage());
        cmp_fail('Échec du provisioning de l\'établissement.', 500);
    }
    cmp_audit($ctx, 'provision_tenant', 'tenant', (string) $tid, null, ['slug' => $slug, 'name' => $name, 'plan' => $plan], $tid);
    cmp_ok(['tenant' => ['id' => $tid, 'slug' => $slug, 'name' => $name, 'plan' => $plan, 'login_url' => 'https://' . $slug . '.' . CAMPUS_ROOT_DOMAIN]], 201);
}

// ── Comptes du personnel (intendant, censeur, préfet, surveillant…) +
//    notifications WhatsApp/SMS. ──
require __DIR__ . '/_routes_admin.php';

// ── Documents officiels + carte scolaire (codes + vérification QR). ──
require __DIR__ . '/_routes_docs.php';

// ── Emploi du temps · Bibliothèque · Transport. ──
require __DIR__ . '/_routes_modules.php';

// ── Paiements, reçus, paiement en ligne (MoMo/Orange) + webhooks. ──
require __DIR__ . '/_routes_finance.php';

// ── Ressources humaines : congés & paie. ──
require __DIR__ . '/_routes_hr.php';

// ── Portail élève / parent (self-service). ──
require __DIR__ . '/_routes_portal.php';

// ── Modules pédagogiques & disciplinaires (notes/verrou, absences, discipline,
//    procès-verbaux, import) — chaque route qui matche termine la requête. ──
require __DIR__ . '/_routes_pedago.php';

// ── Moteur de bulletin (agrégation des notes saisies → bulletin calculé). ──
require __DIR__ . '/_routes_bulletin.php';

// ── Aucune route ne correspond ──
cmp_fail('Route inconnue : ' . ($route === '' ? '(vide)' : $route), 404);
