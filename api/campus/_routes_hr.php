<?php
/**
 * api/campus/_routes_hr.php — Ressources humaines : congés & paie.
 * © 2024-2026 Jacques Miterand TAKOU (Mythe Errant). Tous droits réservés.
 * Inclus par index.php.
 */
declare(strict_types=1);

/* ── Congés ── */
// POST /hr/leaves — un membre du personnel dépose sa demande.
if ($route === 'hr/leaves' && $method === 'POST') {
    $ctx = cmp_require_auth('tenant');
    $tid = (int) $ctx['tenant_id'];
    $type = (string) cmp_param('type', 'conge');
    $deb = substr((string) cmp_param('date_debut', ''), 0, 10);
    $fin = substr((string) cmp_param('date_fin', ''), 0, 10);
    if ($deb === '' || $fin === '') { cmp_fail('date_debut et date_fin requises.', 422); }
    if (!in_array($type, ['conge', 'maladie', 'permission', 'maternite', 'autre'], true)) { $type = 'autre'; }
    $jours = (int) cmp_param('jours', 0);
    if ($jours <= 0) { $jours = max(1, (int) ((strtotime($fin) - strtotime($deb)) / 86400) + 1); }
    // hr.manage peut déposer pour un autre agent ; sinon pour soi.
    $uid = cmp_can($ctx, 'hr.manage') && (int) cmp_param('user_id', 0) ? (int) cmp_param('user_id', 0) : $ctx['user_id'];
    cmp_pdo()->prepare(
        'INSERT INTO cmp_staff_leaves (tenant_id, user_id, type, date_debut, date_fin, jours, motif, statut)
         VALUES (?,?,?,?,?,?,?,\'demande\')'
    )->execute([$tid, $uid, $type, $deb, $fin, $jours, substr((string) cmp_param('motif', ''), 0, 255) ?: null]);
    $id = (int) cmp_pdo()->lastInsertId();
    cmp_audit($ctx, 'request_leave', 'leave', (string) $id, null, ['type' => $type, 'jours' => $jours]);
    cmp_ok(['id' => $id], 201);
}

// POST /hr/leaves/decide — approbation/refus (RH).
if ($route === 'hr/leaves/decide' && $method === 'POST') {
    $ctx = cmp_require_auth('tenant');
    cmp_require_perm($ctx, 'hr.manage');
    $tid = (int) $ctx['tenant_id'];
    $id = (int) cmp_param('leave_id', 0);
    $decision = cmp_param('decision', '') === 'approuve' ? 'approuve' : 'refuse';
    $n = cmp_pdo()->prepare('UPDATE cmp_staff_leaves SET statut = ?, decided_by = ?, decided_at = NOW() WHERE id = ? AND tenant_id = ? AND statut = \'demande\'');
    $n->execute([$decision, $ctx['user_id'], $id, $tid]);
    if ($n->rowCount() === 0) { cmp_fail('Demande introuvable ou déjà traitée.', 409); }
    cmp_audit($ctx, 'decide_leave', 'leave', (string) $id, null, ['decision' => $decision]);
    cmp_ok(['statut' => $decision]);
}

// GET /hr/leaves — RH voit tout ; sinon ses propres demandes.
if ($route === 'hr/leaves' && $method === 'GET') {
    $ctx = cmp_require_auth('tenant');
    $tid = (int) $ctx['tenant_id'];
    if (cmp_can($ctx, 'hr.manage')) {
        $st = cmp_pdo()->prepare(
            'SELECT l.*, u.nom, u.prenom, u.role FROM cmp_staff_leaves l JOIN cmp_users u ON u.id = l.user_id AND u.tenant_id = l.tenant_id
              WHERE l.tenant_id = ? ORDER BY l.created_at DESC LIMIT 300'
        );
        $st->execute([$tid]);
    } else {
        $st = cmp_pdo()->prepare('SELECT * FROM cmp_staff_leaves WHERE tenant_id = ? AND user_id = ? ORDER BY created_at DESC');
        $st->execute([$tid, $ctx['user_id']]);
    }
    cmp_ok(['leaves' => $st->fetchAll()]);
}

/* ── Paie ── */
// POST /hr/payroll — créer/mettre à jour une fiche de paie (net calculé).
if ($route === 'hr/payroll' && $method === 'POST') {
    $ctx = cmp_require_auth('tenant');
    cmp_require_perm($ctx, 'hr.manage');
    $tid = (int) $ctx['tenant_id'];
    $uid = (int) cmp_param('user_id', 0);
    $periode = substr((string) cmp_param('periode', ''), 0, 7);
    if (!$uid || !preg_match('/^\d{4}-\d{2}$/', $periode)) { cmp_fail('user_id et periode (AAAA-MM) requis.', 422); }
    $base = (int) cmp_param('salaire_base', 0);
    $primes = (int) cmp_param('primes', 0);
    $retenues = (int) cmp_param('retenues', 0);
    $net = max(0, $base + $primes - $retenues);
    cmp_pdo()->prepare(
        'INSERT INTO cmp_payroll (tenant_id, user_id, periode, salaire_base, primes, retenues, net, created_by)
         VALUES (?,?,?,?,?,?,?,?)
         ON DUPLICATE KEY UPDATE salaire_base = VALUES(salaire_base), primes = VALUES(primes),
                                 retenues = VALUES(retenues), net = VALUES(net)'
    )->execute([$tid, $uid, $periode, $base, $primes, $retenues, $net, $ctx['user_id']]);
    cmp_audit($ctx, 'upsert_payroll', 'payroll', $periode, null, ['user_id' => $uid, 'net' => $net]);
    cmp_ok(['periode' => $periode, 'net' => $net], 201);
}

// POST /hr/payroll/pay — marquer payé + bulletin de paie au registre.
if ($route === 'hr/payroll/pay' && $method === 'POST') {
    $ctx = cmp_require_auth('tenant');
    cmp_require_perm($ctx, 'hr.manage');
    $tid = (int) $ctx['tenant_id'];
    $uid = (int) cmp_param('user_id', 0);
    $periode = substr((string) cmp_param('periode', ''), 0, 7);
    $st = cmp_pdo()->prepare('SELECT net FROM cmp_payroll WHERE tenant_id = ? AND user_id = ? AND periode = ?');
    $st->execute([$tid, $uid, $periode]);
    $net = $st->fetchColumn();
    if ($net === false) { cmp_fail('Fiche de paie introuvable.', 404); }
    cmp_pdo()->prepare('UPDATE cmp_payroll SET statut = \'paye\', mode = ?, date_paiement = NOW() WHERE tenant_id = ? AND user_id = ? AND periode = ?')
        ->execute([substr((string) cmp_param('mode', 'virement'), 0, 30), $tid, $uid, $periode]);
    cmp_audit($ctx, 'pay_payroll', 'payroll', $periode, null, ['user_id' => $uid]);
    cmp_ok(['statut' => 'paye', 'net' => (int) $net]);
}

// GET /hr/payroll?periode= — registre de paie (RH).
if ($route === 'hr/payroll' && $method === 'GET') {
    $ctx = cmp_require_auth('tenant');
    cmp_require_perm($ctx, 'hr.manage');
    $tid = (int) $ctx['tenant_id'];
    $periode = substr((string) cmp_param('periode', ''), 0, 7);
    $sql = 'SELECT p.*, u.nom, u.prenom, u.role FROM cmp_payroll p JOIN cmp_users u ON u.id = p.user_id AND u.tenant_id = p.tenant_id WHERE p.tenant_id = ?';
    $args = [$tid];
    if (preg_match('/^\d{4}-\d{2}$/', $periode)) { $sql .= ' AND p.periode = ?'; $args[] = $periode; }
    $sql .= ' ORDER BY p.periode DESC, u.nom LIMIT 500';
    $st = cmp_pdo()->prepare($sql);
    $st->execute($args);
    $rows = $st->fetchAll();
    $totalNet = 0;
    foreach ($rows as $r) { $totalNet += (int) $r['net']; }
    cmp_ok(['payroll' => $rows, 'total_net' => $totalNet]);
}

/* ── Comptabilité des heures (enseignants) + paie aux heures ── */
// POST /hr/hours — enregistrer des heures de cours.
if ($route === 'hr/hours' && $method === 'POST') {
    $ctx = cmp_require_auth('tenant');
    $tid = (int) $ctx['tenant_id'];
    // hr.manage saisit pour tout le monde ; un enseignant saisit ses propres heures.
    $teacherId = (cmp_can($ctx, 'hr.manage') && (int) cmp_param('teacher_id', 0)) ? (int) cmp_param('teacher_id', 0) : $ctx['user_id'];
    $date = substr((string) cmp_param('date_cours', ''), 0, 10);
    $heures = (float) cmp_param('heures', 0);
    if ($date === '' || $heures <= 0) { cmp_fail('date_cours (AAAA-MM-JJ) et heures (>0) requis.', 422); }
    cmp_pdo()->prepare(
        'INSERT INTO cmp_teacher_hours (tenant_id, teacher_id, class_id, subject_id, date_cours, heures, taux_horaire, libelle, created_by)
         VALUES (?,?,?,?,?,?,?,?,?)'
    )->execute([
        $tid, $teacherId, ($c = (int) cmp_param('class_id', 0)) ? $c : null, ($s = (int) cmp_param('subject_id', 0)) ? $s : null,
        $date, $heures, ($t = (int) cmp_param('taux_horaire', 0)) ? $t : null, substr((string) cmp_param('libelle', ''), 0, 190) ?: null, $ctx['user_id'],
    ]);
    cmp_audit($ctx, 'record_hours', 'teacher', (string) $teacherId, null, ['date' => $date, 'heures' => $heures]);
    cmp_ok(['id' => (int) cmp_pdo()->lastInsertId()], 201);
}

// GET /hr/hours?teacher_id=&from=&to= — relevé d'heures + total.
if ($route === 'hr/hours' && $method === 'GET') {
    $ctx = cmp_require_auth('tenant');
    $tid = (int) $ctx['tenant_id'];
    $teacherId = (int) cmp_param('teacher_id', 0) ?: $ctx['user_id'];
    if ($teacherId !== $ctx['user_id'] && !cmp_can($ctx, 'hr.manage')) { cmp_fail('Accès refusé.', 403); }
    $from = substr((string) cmp_param('from', '2000-01-01'), 0, 10);
    $to = substr((string) cmp_param('to', '2999-12-31'), 0, 10);
    $st = cmp_pdo()->prepare('SELECT * FROM cmp_teacher_hours WHERE tenant_id = ? AND teacher_id = ? AND date_cours BETWEEN ? AND ? ORDER BY date_cours DESC');
    $st->execute([$tid, $teacherId, $from, $to]);
    $rows = $st->fetchAll();
    $total = 0.0;
    foreach ($rows as $r) { $total += (float) $r['heures']; }
    cmp_ok(['hours' => $rows, 'total_heures' => $total]);
}

// GET /hr/teacher-pay?teacher_id=&from=&to= — calcul de la paie aux heures.
if ($route === 'hr/teacher-pay' && $method === 'GET') {
    $ctx = cmp_require_auth('tenant');
    cmp_require_perm($ctx, 'hr.manage');
    $tid = (int) $ctx['tenant_id'];
    $teacherId = (int) cmp_param('teacher_id', 0);
    if (!$teacherId) { cmp_fail('teacher_id requis.', 422); }
    $from = substr((string) cmp_param('from', '2000-01-01'), 0, 10);
    $to = substr((string) cmp_param('to', '2999-12-31'), 0, 10);
    $u = cmp_pdo()->prepare('SELECT nom, prenom, tarif_horaire FROM cmp_users WHERE id = ? AND tenant_id = ?');
    $u->execute([$teacherId, $tid]);
    $usr = $u->fetch();
    if (!$usr) { cmp_fail('Enseignant introuvable.', 404); }
    $rate = (int) $usr['tarif_horaire'];
    $st = cmp_pdo()->prepare('SELECT heures, taux_horaire FROM cmp_teacher_hours WHERE tenant_id = ? AND teacher_id = ? AND date_cours BETWEEN ? AND ?');
    $st->execute([$tid, $teacherId, $from, $to]);
    $totalH = 0.0; $montant = 0;
    foreach ($st->fetchAll() as $r) {
        $h = (float) $r['heures']; $totalH += $h;
        $montant += (int) round($h * (($r['taux_horaire'] !== null) ? (int) $r['taux_horaire'] : $rate));
    }
    cmp_ok(['teacher' => ['id' => $teacherId, 'nom' => $usr['nom'], 'prenom' => $usr['prenom']], 'taux_horaire' => $rate, 'total_heures' => $totalH, 'montant' => $montant, 'periode' => ['from' => $from, 'to' => $to]]);
}

// POST /hr/teacher-pay — génère la fiche de paie aux heures (cmp_payroll) + marque les heures « valide ».
if ($route === 'hr/teacher-pay' && $method === 'POST') {
    $ctx = cmp_require_auth('tenant');
    cmp_require_perm($ctx, 'hr.manage');
    $tid = (int) $ctx['tenant_id'];
    $teacherId = (int) cmp_param('teacher_id', 0);
    $periode = substr((string) cmp_param('periode', ''), 0, 7);
    if (!$teacherId || !preg_match('/^\d{4}-\d{2}$/', $periode)) { cmp_fail('teacher_id et periode (AAAA-MM) requis.', 422); }
    $from = substr((string) cmp_param('from', $periode . '-01'), 0, 10);
    $to = substr((string) cmp_param('to', $periode . '-31'), 0, 10);
    $u = cmp_pdo()->prepare('SELECT tarif_horaire FROM cmp_users WHERE id = ? AND tenant_id = ?');
    $u->execute([$teacherId, $tid]);
    $rate = (int) ($u->fetchColumn() ?: 0);
    $st = cmp_pdo()->prepare('SELECT heures, taux_horaire FROM cmp_teacher_hours WHERE tenant_id = ? AND teacher_id = ? AND date_cours BETWEEN ? AND ?');
    $st->execute([$tid, $teacherId, $from, $to]);
    $totalH = 0.0; $net = 0;
    foreach ($st->fetchAll() as $r) { $h = (float) $r['heures']; $totalH += $h; $net += (int) round($h * (($r['taux_horaire'] !== null) ? (int) $r['taux_horaire'] : $rate)); }
    cmp_pdo()->prepare(
        'INSERT INTO cmp_payroll (tenant_id, user_id, periode, salaire_base, primes, retenues, net, created_by)
         VALUES (?,?,?,?,0,0,?,?)
         ON DUPLICATE KEY UPDATE salaire_base = VALUES(salaire_base), net = VALUES(net)'
    )->execute([$tid, $teacherId, $periode, $net, $net, $ctx['user_id']]);
    cmp_pdo()->prepare('UPDATE cmp_teacher_hours SET statut = \'valide\' WHERE tenant_id = ? AND teacher_id = ? AND date_cours BETWEEN ? AND ? AND statut = \'saisi\'')
        ->execute([$tid, $teacherId, $from, $to]);
    cmp_audit($ctx, 'teacher_pay_from_hours', 'payroll', $periode, null, ['teacher_id' => $teacherId, 'heures' => $totalH, 'net' => $net]);
    cmp_ok(['periode' => $periode, 'total_heures' => $totalH, 'net' => $net], 201);
}
