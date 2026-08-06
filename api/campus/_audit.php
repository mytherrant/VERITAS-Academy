<?php
/**
 * api/campus/_audit.php — Journal de traçabilité (« qui a modifié quoi et quand »).
 * © 2024-2026 Jacques Miterand TAKOU (Mythe Errant). Tous droits réservés.
 *
 * L'argument différenciant n°1 face à la concurrence. Best-effort : un échec
 * d'écriture du journal ne doit JAMAIS casser l'action métier.
 */
declare(strict_types=1);

function cmp_audit(
    ?array $ctx,
    string $action,
    string $entity = '',
    string $entityId = '',
    ?array $before = null,
    ?array $after = null,
    ?int $tenantId = null
): void {
    try {
        $tid = $tenantId;
        if ($tid === null && $ctx !== null && isset($ctx['tenant_id'])) { $tid = $ctx['tenant_id']; }
        $st = cmp_pdo()->prepare(
            'INSERT INTO cmp_audit_log
               (tenant_id, user_id, actor_email, actor_role, action, entity, entity_id, before_json, after_json, ip)
             VALUES (?,?,?,?,?,?,?,?,?,?)'
        );
        $st->execute([
            $tid,
            $ctx['user_id'] ?? null,
            $ctx['email'] ?? null,
            $ctx['role'] ?? null,
            $action,
            $entity,
            substr($entityId, 0, 60),
            $before !== null ? json_encode($before, JSON_UNESCAPED_UNICODE) : null,
            $after !== null ? json_encode($after, JSON_UNESCAPED_UNICODE) : null,
            cmp_client_ip(),
        ]);
    } catch (Throwable $e) {
        error_log('[campus][audit] ' . $e->getMessage());
    }
}
