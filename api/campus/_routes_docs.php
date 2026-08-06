<?php
/**
 * api/campus/_routes_docs.php — Émission de documents officiels + carte scolaire,
 * avec code public et URL de vérification (QR).
 * © 2024-2026 Jacques Miterand TAKOU (Mythe Errant). Tous droits réservés.
 * Inclus par index.php.
 */
declare(strict_types=1);

require_once __DIR__ . '/_docs.php';

function cmp_doc_slug(int $tid): string {
    return function_exists('cmp_brand_min') ? (string) cmp_brand_min($tid)['slug'] : '';
}

// POST /documents/issue — enregistre un document (bulletin/certificat/attestation…) et renvoie son code + URL QR.
if ($route === 'documents/issue' && $method === 'POST') {
    $ctx = cmp_require_auth('tenant');
    cmp_require_perm($ctx, 'documents.issue');
    $tid = (int) $ctx['tenant_id'];
    $type = (string) cmp_param('type', 'autre');
    if (!in_array($type, ['bulletin', 'recu', 'certificat', 'attestation', 'carte', 'autre'], true)) { $type = 'autre'; }
    $issuedTo = trim((string) cmp_param('issued_to', ''));
    if ($issuedTo === '') { cmp_fail('issued_to requis.', 422); }
    $data = cmp_param('data', []);
    if (!is_array($data)) { $data = []; }
    $code = cmp_doc_register($tid, $type, $issuedTo, (string) cmp_param('entity_ref', '') ?: null, $data);
    cmp_audit($ctx, 'issue_document', 'document', $code, null, ['type' => $type]);
    cmp_ok(['code' => $code, 'verify_url' => cmp_verify_url(cmp_doc_slug($tid), $code)], 201);
}

// POST /students/card — émet une carte scolaire vérifiable pour un élève.
if ($route === 'students/card' && $method === 'POST') {
    $ctx = cmp_require_auth('tenant');
    cmp_require_perm($ctx, 'documents.issue');
    $tid = (int) $ctx['tenant_id'];
    $sid = (int) cmp_param('student_id', 0);
    $st = cmp_pdo()->prepare(
        'SELECT s.matricule, s.nom, s.prenom, s.photo_url, c.name AS classe
           FROM cmp_students s LEFT JOIN cmp_classes c ON c.id = s.class_id AND c.tenant_id = s.tenant_id
          WHERE s.id = ? AND s.tenant_id = ?'
    );
    $st->execute([$sid, $tid]);
    $s = $st->fetch();
    if (!$s) { cmp_fail('Élève introuvable.', 404); }
    $nom = trim((string) ($s['prenom'] . ' ' . $s['nom']));
    $code = cmp_doc_register($tid, 'carte', $nom, (string) $sid, [
        'matricule' => $s['matricule'] ?? '', 'classe' => $s['classe'] ?? '',
    ]);
    cmp_audit($ctx, 'issue_card', 'student', (string) $sid);
    cmp_ok([
        'code' => $code, 'verify_url' => cmp_verify_url(cmp_doc_slug($tid), $code),
        'student' => ['matricule' => $s['matricule'], 'nom' => $nom, 'classe' => $s['classe'], 'photo_url' => $s['photo_url']],
    ], 201);
}

// GET /documents — liste des documents émis (registre).
if ($route === 'documents' && $method === 'GET') {
    $ctx = cmp_require_auth('tenant');
    if (!cmp_can_any($ctx, ['documents.issue', 'audit.view'])) { cmp_fail('Accès refusé.', 403); }
    $st = cmp_pdo()->prepare('SELECT id, type, code, issued_to, issued_at, valid FROM cmp_doc_registry WHERE tenant_id = ? ORDER BY id DESC LIMIT 300');
    $st->execute([(int) $ctx['tenant_id']]);
    cmp_ok(['documents' => $st->fetchAll()]);
}

// POST /documents/revoke — invalide un document (annulation).
if ($route === 'documents/revoke' && $method === 'POST') {
    $ctx = cmp_require_auth('tenant');
    cmp_require_perm($ctx, 'documents.issue');
    $code = strtoupper(trim((string) cmp_param('code', '')));
    $n = cmp_pdo()->prepare('UPDATE cmp_doc_registry SET valid = 0 WHERE code = ? AND tenant_id = ?');
    $n->execute([$code, (int) $ctx['tenant_id']]);
    if ($n->rowCount() === 0) { cmp_fail('Document introuvable.', 404); }
    cmp_audit($ctx, 'revoke_document', 'document', $code);
    cmp_ok(['revoked' => $code]);
}
