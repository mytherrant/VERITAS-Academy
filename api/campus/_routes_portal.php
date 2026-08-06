<?php
/**
 * api/campus/_routes_portal.php — Portail élève / parent (self-service).
 * © 2024-2026 Jacques Miterand TAKOU (Mythe Errant). Tous droits réservés.
 * Inclus par index.php. Strictement scopé à l'élève lié au compte connecté.
 */
declare(strict_types=1);

// Renvoie l'id de l'élève associé au compte courant (eleve/parent), ou 404.
function cmp_portal_student(array $ctx): int {
    $st = cmp_pdo()->prepare('SELECT student_id FROM cmp_users WHERE id = ? AND tenant_id = ?');
    $st->execute([$ctx['user_id'], (int) $ctx['tenant_id']]);
    $sid = (int) ($st->fetchColumn() ?: 0);
    if (!$sid) { cmp_fail('Aucun élève associé à ce compte.', 404); }
    return $sid;
}

// GET /portal/me — fiche de l'élève + synthèse.
if ($route === 'portal/me' && $method === 'GET') {
    $ctx = cmp_require_auth('tenant');
    cmp_require_perm($ctx, 'self.view');
    $tid = (int) $ctx['tenant_id'];
    $sid = cmp_portal_student($ctx);
    $st = cmp_pdo()->prepare(
        'SELECT s.id, s.matricule, s.nom, s.prenom, s.photo_url, c.name AS classe, c.sous_systeme, c.filiere
           FROM cmp_students s LEFT JOIN cmp_classes c ON c.id = s.class_id AND c.tenant_id = s.tenant_id
          WHERE s.id = ? AND s.tenant_id = ?'
    );
    $st->execute([$sid, $tid]);
    $student = $st->fetch();
    if (!$student) { cmp_fail('Élève introuvable.', 404); }
    cmp_ok(['student' => $student]);
}

// GET /portal/grades — uniquement les notes SOUMISES (verrouillées).
if ($route === 'portal/grades' && $method === 'GET') {
    $ctx = cmp_require_auth('tenant');
    cmp_require_perm($ctx, 'self.view');
    $tid = (int) $ctx['tenant_id'];
    $sid = cmp_portal_student($ctx);
    $st = cmp_pdo()->prepare(
        'SELECT sj.name AS matiere, gr.note, gr.coefficient, gr.appreciation, gs.periode, gs.sequence
           FROM cmp_grades gr
           JOIN cmp_grade_sheets gs ON gs.id = gr.sheet_id AND gs.tenant_id = gr.tenant_id
           LEFT JOIN cmp_subjects sj ON sj.id = gs.subject_id AND sj.tenant_id = gs.tenant_id
          WHERE gr.tenant_id = ? AND gr.student_id = ? AND gs.status <> \'draft\'
          ORDER BY gs.periode, sj.name'
    );
    $st->execute([$tid, $sid]);
    cmp_ok(['grades' => $st->fetchAll()]);
}

// GET /portal/absences — absences de l'élève + totaux.
if ($route === 'portal/absences' && $method === 'GET') {
    $ctx = cmp_require_auth('tenant');
    cmp_require_perm($ctx, 'self.view');
    $tid = (int) $ctx['tenant_id'];
    $sid = cmp_portal_student($ctx);
    $st = cmp_pdo()->prepare('SELECT date_absence, heures, matiere, justifie, motif FROM cmp_absences WHERE tenant_id = ? AND student_id = ? ORDER BY date_absence DESC');
    $st->execute([$tid, $sid]);
    $rows = $st->fetchAll();
    $tot = 0; $nj = 0;
    foreach ($rows as $r) { $tot += (int) $r['heures']; if (!$r['justifie']) { $nj += (int) $r['heures']; } }
    cmp_ok(['absences' => $rows, 'total_heures' => $tot, 'heures_non_justifiees' => $nj]);
}

// GET /portal/payments — paiements de l'élève + solde.
if ($route === 'portal/payments' && $method === 'GET') {
    $ctx = cmp_require_auth('tenant');
    cmp_require_perm($ctx, 'self.view');
    $tid = (int) $ctx['tenant_id'];
    $sid = cmp_portal_student($ctx);
    $st = cmp_pdo()->prepare('SELECT montant, moyen, reference, statut, date_paiement FROM cmp_payments WHERE tenant_id = ? AND student_id = ? ORDER BY date_paiement DESC');
    $st->execute([$tid, $sid]);
    $rows = $st->fetchAll();
    $paye = 0;
    foreach ($rows as $r) { if ($r['statut'] === 'confirmed') { $paye += (int) $r['montant']; } }
    $fr = cmp_pdo()->prepare('SELECT frais_total FROM cmp_students WHERE id = ? AND tenant_id = ?');
    $fr->execute([$sid, $tid]);
    $du = (int) ($fr->fetchColumn() ?: 0);
    cmp_ok(['payments' => $rows, 'total_paye' => $paye, 'frais_total' => $du, 'solde' => max(0, $du - $paye)]);
}
