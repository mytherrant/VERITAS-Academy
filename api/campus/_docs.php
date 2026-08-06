<?php
/**
 * api/campus/_docs.php — Registre des documents officiels + vérification QR.
 * © 2024-2026 Jacques Miterand TAKOU (Mythe Errant). Tous droits réservés.
 *
 * Chaque document émis (bulletin, reçu, certificat, attestation, carte scolaire)
 * est enregistré avec un CODE public unique. Le QR du document encode l'URL
 * .../verify.php?code=CODE → page publique d'authentification (infalsifiable).
 */
declare(strict_types=1);

/** Génère un code public lisible : PREFIX-AA-XXXXXXXX. */
function cmp_doc_code(string $prefix): string {
    return strtoupper(substr(preg_replace('/[^A-Za-z]/', '', $prefix), 0, 4)) . '-' . date('y') . '-' . strtoupper(bin2hex(random_bytes(4)));
}

/** Enregistre un document et renvoie son code public. */
function cmp_doc_register(int $tenantId, string $type, string $issuedTo, ?string $entityRef, array $data): string {
    $code = cmp_doc_code($type);
    cmp_pdo()->prepare(
        'INSERT INTO cmp_doc_registry (tenant_id, type, code, entity_ref, issued_to, data)
         VALUES (?,?,?,?,?,?)'
    )->execute([
        $tenantId, $type, $code, $entityRef !== null ? substr($entityRef, 0, 80) : null,
        substr($issuedTo, 0, 190), json_encode($data, JSON_UNESCAPED_UNICODE),
    ]);
    return $code;
}

/** URL publique de vérification (encodée dans le QR). */
function cmp_verify_url(string $slug, string $code): string {
    $base = $slug !== '' ? ('https://' . $slug . '.' . CAMPUS_ROOT_DOMAIN) : '';
    return $base . '/api/campus/verify.php?code=' . rawurlencode($code);
}
