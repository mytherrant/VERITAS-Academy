<?php
/**
 * api/campus/_tenant.php — Résolution de l'établissement (tenant) courant.
 * © 2024-2026 Jacques Miterand TAKOU (Mythe Errant). Tous droits réservés.
 *
 * Ordre de résolution (le 1er trouvé gagne) :
 *   1. En-tête HTTP  X-Tenant: <slug>
 *   2. Paramètre     ?tenant=<slug>
 *   3. Sous-domaine  <slug>.veritas-campus.com
 * FAIL-CLOSED : slug absent → 400 ; tenant inconnu → 404 ; suspendu/archivé → 403.
 */
declare(strict_types=1);

function cmp_tenant_slug(): string {
    // 0. Install MONO-établissement (self/local) : slug imposé → pas de sous-domaine requis.
    if (defined('CAMPUS_FIXED_TENANT') && CAMPUS_FIXED_TENANT !== '') {
        return preg_replace('/[^a-z0-9\-]/', '', strtolower((string) CAMPUS_FIXED_TENANT));
    }
    // 1. En-tête dédié
    $slug = '';
    if (function_exists('getallheaders')) {
        foreach (getallheaders() as $k => $v) {
            if (strtolower($k) === 'x-tenant') { $slug = trim((string) $v); break; }
        }
    }
    if ($slug === '') { $slug = (string) ($_SERVER['HTTP_X_TENANT'] ?? ''); }
    // 2. Paramètre
    if ($slug === '' && isset($_GET['tenant'])) { $slug = (string) $_GET['tenant']; }
    // 3. Sous-domaine <slug>.<racine>
    if ($slug === '') {
        $host = strtolower((string) ($_SERVER['HTTP_HOST'] ?? ''));
        $host = preg_replace('/:\d+$/', '', $host); // retire le port
        $suffix = '.' . CAMPUS_ROOT_DOMAIN;
        if ($host !== '' && str_ends_with($host, $suffix)) {
            $sub = substr($host, 0, -strlen($suffix));
            if ($sub !== '' && $sub !== 'www' && $sub !== 'app') { $slug = $sub; }
        }
    }
    // Normalisation stricte (a-z 0-9 tiret) → anti-injection.
    $slug = strtolower($slug);
    $slug = preg_replace('/[^a-z0-9\-]/', '', $slug);
    return (string) $slug;
}

/** Résout et renvoie la ligne tenant, ou termine la requête (fail-closed). */
function cmp_require_tenant(): array {
    $slug = cmp_tenant_slug();
    if ($slug === '') {
        cmp_fail('Établissement non précisé (en-tête X-Tenant, ?tenant= ou sous-domaine requis).', 400);
    }
    $st = cmp_pdo()->prepare('SELECT * FROM cmp_tenants WHERE slug = ? LIMIT 1');
    $st->execute([$slug]);
    $t = $st->fetch();
    if (!$t) {
        cmp_fail('Établissement introuvable.', 404);
    }
    if ($t['status'] === 'suspended' || $t['status'] === 'archived') {
        cmp_fail('Établissement suspendu. Contactez VÉRITAS Campus.', 403, ['status' => $t['status']]);
    }
    return $t;
}
