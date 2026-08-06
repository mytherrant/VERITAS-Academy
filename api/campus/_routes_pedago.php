<?php
/**
 * api/campus/routes_pedago.php — Routes pédagogiques & disciplinaires.
 * © 2024-2026 Jacques Miterand TAKOU (Mythe Errant). Tous droits réservés.
 *
 * Inclus par index.php AVANT le 404 final. Hérite de $route, $method et de tous
 * les helpers (_bootstrap/_auth/_audit). Chaque route qui matche termine la requête.
 *
 * RÈGLE D'INTÉGRITÉ : un enseignant saisit ses notes en brouillon, puis SOUMET la
 * feuille (irréversible côté prof). Une feuille soumise est VERROUILLÉE : seule
 * l'administration peut corriger une note (tracée dans le journal d'audit).
 */
declare(strict_types=1);

// Charge une feuille de notes scopée au tenant, ou termine en 404.
function cmp_load_sheet(int $tenantId, int $sheetId): array {
    $st = cmp_pdo()->prepare('SELECT * FROM cmp_grade_sheets WHERE id = ? AND tenant_id = ? LIMIT 1');
    $st->execute([$sheetId, $tenantId]);
    $s = $st->fetch();
    if (!$s) { cmp_fail('Feuille de notes introuvable.', 404); }
    return $s;
}

// ──────────────────────────── MATIÈRES ────────────────────────────
if ($route === 'subjects' && $method === 'GET') {
    $ctx = cmp_require_auth('tenant');
    $st = cmp_pdo()->prepare('SELECT id, section_id, code, name, default_coef, langue, groupe FROM cmp_subjects WHERE tenant_id = ? ORDER BY name');
    $st->execute([(int) $ctx['tenant_id']]);
    cmp_ok(['subjects' => $st->fetchAll()]);
}
if ($route === 'subjects' && $method === 'POST') {
    $ctx = cmp_require_auth('tenant');
    cmp_require_role($ctx, ['admin']);
    $code = substr(trim((string) cmp_param('code', '')), 0, 40);
    $name = substr(trim((string) cmp_param('name', '')), 0, 160);
    if ($code === '' || $name === '') { cmp_fail('code et name requis.', 422); }
    $st = cmp_pdo()->prepare(
        'INSERT INTO cmp_subjects (tenant_id, section_id, code, name, default_coef, langue, groupe)
         VALUES (?,?,?,?,?,?,?)
         ON DUPLICATE KEY UPDATE name = VALUES(name), default_coef = VALUES(default_coef), groupe = VALUES(groupe)'
    );
    $st->execute([
        (int) $ctx['tenant_id'], ($sid = (int) cmp_param('section_id', 0)) ? $sid : null,
        $code, $name, (int) cmp_param('default_coef', 1),
        substr((string) cmp_param('langue', 'fr'), 0, 5), substr((string) cmp_param('groupe', ''), 0, 60) ?: null,
    ]);
    cmp_audit($ctx, 'upsert_subject', 'subject', $code);
    cmp_ok(['code' => $code], 201);
}

// ─────────────────────── FEUILLES DE NOTES ────────────────────────
if ($route === 'grade-sheets' && $method === 'GET') {
    $ctx = cmp_require_auth('tenant');
    cmp_require_role($ctx, ['admin', 'professeur', 'vie_scolaire']);
    $tid = (int) $ctx['tenant_id'];
    $sql = 'SELECT gs.*, c.name AS class_name, sj.name AS subject_name
              FROM cmp_grade_sheets gs
              LEFT JOIN cmp_classes c  ON c.id = gs.class_id  AND c.tenant_id = gs.tenant_id
              LEFT JOIN cmp_subjects sj ON sj.id = gs.subject_id AND sj.tenant_id = gs.tenant_id
             WHERE gs.tenant_id = ?';
    $args = [$tid];
    // Un prof ne voit QUE ses feuilles.
    if ($ctx['role'] === 'professeur') { $sql .= ' AND gs.teacher_id = ?'; $args[] = $ctx['user_id']; }
    if (($cid = (int) cmp_param('class_id', 0))) { $sql .= ' AND gs.class_id = ?'; $args[] = $cid; }
    $sql .= ' ORDER BY gs.created_at DESC LIMIT 500';
    $st = cmp_pdo()->prepare($sql);
    $st->execute($args);
    cmp_ok(['sheets' => $st->fetchAll()]);
}

if ($route === 'grade-sheets' && $method === 'POST') {
    $ctx = cmp_require_auth('tenant');
    cmp_require_role($ctx, ['admin', 'professeur']);
    $tid = (int) $ctx['tenant_id'];
    $classId = (int) cmp_param('class_id', 0);
    $subjectId = (int) cmp_param('subject_id', 0);
    $periode = substr(trim((string) cmp_param('periode', '')), 0, 40);
    $sequence = substr(trim((string) cmp_param('sequence', '')), 0, 40);
    if (!$classId || !$subjectId || $periode === '' || $sequence === '') {
        cmp_fail('class_id, subject_id, periode et sequence requis.', 422);
    }
    // Le prof devient propriétaire ; un admin peut désigner un prof via teacher_id.
    $teacherId = $ctx['role'] === 'professeur' ? $ctx['user_id'] : (($t = (int) cmp_param('teacher_id', 0)) ? $t : null);
    $evalKey = substr((string) cmp_param('eval_key', 'note'), 0, 20) ?: 'note';
    $st = cmp_pdo()->prepare(
        'INSERT INTO cmp_grade_sheets (tenant_id, class_id, subject_id, teacher_id, periode, sequence, eval_key, bareme)
         VALUES (?,?,?,?,?,?,?,?)
         ON DUPLICATE KEY UPDATE id = LAST_INSERT_ID(id)'
    );
    $st->execute([$tid, $classId, $subjectId, $teacherId, $periode, $sequence, $evalKey, (int) cmp_param('bareme', 20)]);
    $id = (int) cmp_pdo()->lastInsertId();
    cmp_audit($ctx, 'open_grade_sheet', 'grade_sheet', (string) $id);
    cmp_ok(['sheet_id' => $id], 201);
}

// Détail : feuille + liste des élèves de la classe + notes déjà saisies.
if ($route === 'grade-sheet' && $method === 'GET') {
    $ctx = cmp_require_auth('tenant');
    cmp_require_perm($ctx, 'grades.enter');
    $tid = (int) $ctx['tenant_id'];
    $sheet = cmp_load_sheet($tid, (int) cmp_param('id', 0));
    if ($ctx['role'] === 'professeur' && (int) $sheet['teacher_id'] !== $ctx['user_id']) {
        cmp_fail('Feuille non rattachée à votre compte.', 403);
    }
    $g = cmp_pdo()->prepare(
        'SELECT s.id AS student_id, s.matricule, s.nom, s.prenom, s.photo_url,
                gr.id AS grade_id, gr.note, gr.coefficient, gr.appreciation, gr.status,
                gr.modified_by_admin
           FROM cmp_students s
           LEFT JOIN cmp_grades gr ON gr.student_id = s.id AND gr.sheet_id = ? AND gr.tenant_id = s.tenant_id
          WHERE s.tenant_id = ? AND s.class_id = ?
          ORDER BY s.nom, s.prenom'
    );
    $g->execute([(int) $sheet['id'], $tid, (int) $sheet['class_id']]);
    cmp_ok(['sheet' => $sheet, 'rows' => $g->fetchAll(), 'locked' => $sheet['status'] !== 'draft']);
}

// SAISIE GROUPÉE des notes (brouillon). Bloquée si la feuille est soumise.
if ($route === 'grades/batch' && $method === 'POST') {
    $ctx = cmp_require_auth('tenant');
    cmp_require_perm($ctx, 'grades.enter');
    $tid = (int) $ctx['tenant_id'];
    $sheet = cmp_load_sheet($tid, (int) cmp_param('sheet_id', 0));
    $canOverride = cmp_can($ctx, 'grades.override');   // direction / censeur / préfet des études
    $isOwner = $ctx['role'] === 'professeur' && (int) $sheet['teacher_id'] === $ctx['user_id'];
    if (!$canOverride && !$isOwner) { cmp_fail('Vous ne pouvez pas saisir sur cette feuille.', 403); }
    // 🔒 VERROU : feuille soumise → le prof ne touche plus rien.
    if (!$canOverride && $sheet['status'] !== 'draft') {
        cmp_fail('Notes déjà soumises et verrouillées. Toute correction doit passer par l\'administration.', 423);
    }
    $grades = cmp_param('grades', null);
    if (!is_array($grades)) { cmp_fail('« grades » doit être une liste.', 422); }
    $bareme = (int) $sheet['bareme'];
    $pdo = cmp_pdo();
    $up = $pdo->prepare(
        'INSERT INTO cmp_grades (tenant_id, sheet_id, student_id, note, coefficient, appreciation, status, entered_by)
         VALUES (?,?,?,?,?,?,\'draft\',?)
         ON DUPLICATE KEY UPDATE note = VALUES(note), coefficient = VALUES(coefficient),
                                 appreciation = VALUES(appreciation), entered_by = VALUES(entered_by), entered_at = NOW()'
    );
    $n = 0;
    foreach ($grades as $row) {
        if (!is_array($row) || empty($row['student_id'])) { continue; }
        $note = isset($row['note']) && $row['note'] !== '' ? (float) $row['note'] : null;
        if ($note !== null && ($note < 0 || $note > $bareme)) {
            cmp_fail('Note hors barème (0–' . $bareme . ') pour l\'élève #' . (int) $row['student_id'] . '.', 422);
        }
        $up->execute([
            $tid, (int) $sheet['id'], (int) $row['student_id'], $note,
            (int) ($row['coefficient'] ?? 1),
            isset($row['appreciation']) ? substr((string) $row['appreciation'], 0, 255) : null,
            $ctx['user_id'],
        ]);
        $n++;
    }
    cmp_audit($ctx, 'save_grades_draft', 'grade_sheet', (string) $sheet['id'], null, ['count' => $n]);
    cmp_ok(['saved' => $n, 'status' => $sheet['status']]);
}

// SOUMETTRE la feuille → verrouille les notes pour l'enseignant (irréversible côté prof).
if ($route === 'grades/submit' && $method === 'POST') {
    $ctx = cmp_require_auth('tenant');
    cmp_require_perm($ctx, 'grades.enter');
    $tid = (int) $ctx['tenant_id'];
    $sheet = cmp_load_sheet($tid, (int) cmp_param('sheet_id', 0));
    $isOwner = $ctx['role'] === 'professeur' && (int) $sheet['teacher_id'] === $ctx['user_id'];
    if (!cmp_can($ctx, 'grades.validate') && !$isOwner) { cmp_fail('Feuille non rattachée à votre compte.', 403); }
    if ($sheet['status'] !== 'draft') { cmp_fail('Feuille déjà soumise.', 409); }
    $pdo = cmp_pdo();
    $pdo->prepare('UPDATE cmp_grade_sheets SET status = \'submitted\', submitted_at = NOW() WHERE id = ? AND tenant_id = ?')
        ->execute([(int) $sheet['id'], $tid]);
    $pdo->prepare('UPDATE cmp_grades SET status = \'locked\' WHERE sheet_id = ? AND tenant_id = ?')
        ->execute([(int) $sheet['id'], $tid]);
    cmp_audit($ctx, 'submit_grade_sheet', 'grade_sheet', (string) $sheet['id'], ['status' => 'draft'], ['status' => 'submitted']);
    cmp_ok(['status' => 'submitted', 'message' => 'Notes soumises et verrouillées.']);
}

// ADMIN : corriger une note verrouillée (tracé : modified_by_admin + audit avant/après).
if ($route === 'grades/admin-edit' && $method === 'POST') {
    $ctx = cmp_require_auth('tenant');
    cmp_require_perm($ctx, 'grades.override');   // direction / censeur / préfet des études
    $tid = (int) $ctx['tenant_id'];
    $gid = (int) cmp_param('grade_id', 0);
    $reason = trim((string) cmp_param('reason', ''));
    if (!$gid || $reason === '') { cmp_fail('grade_id et reason (motif) requis.', 422); }
    $st = cmp_pdo()->prepare('SELECT * FROM cmp_grades WHERE id = ? AND tenant_id = ? LIMIT 1');
    $st->execute([$gid, $tid]);
    $grade = $st->fetch();
    if (!$grade) { cmp_fail('Note introuvable.', 404); }
    $newNote = cmp_param('note', null);
    $newNote = ($newNote === null || $newNote === '') ? null : (float) $newNote;
    $newAppr = cmp_param('appreciation', null);
    cmp_pdo()->prepare(
        'UPDATE cmp_grades SET note = ?, appreciation = COALESCE(?, appreciation),
               modified_by_admin = ?, modified_at = NOW() WHERE id = ? AND tenant_id = ?'
    )->execute([$newNote, $newAppr !== null ? substr((string) $newAppr, 0, 255) : null, $ctx['user_id'], $gid, $tid]);
    cmp_audit($ctx, 'admin_edit_grade', 'grade', (string) $gid,
        ['note' => $grade['note'], 'status' => $grade['status']],
        ['note' => $newNote, 'reason' => $reason]);
    cmp_ok(['message' => 'Note corrigée par l\'administration (tracée).']);
}

// ADMIN : rouvrir une feuille verrouillée pour correction par le prof.
if ($route === 'grades/unlock' && $method === 'POST') {
    $ctx = cmp_require_auth('tenant');
    cmp_require_perm($ctx, 'grades.override');
    $tid = (int) $ctx['tenant_id'];
    $reason = trim((string) cmp_param('reason', ''));
    $sheet = cmp_load_sheet($tid, (int) cmp_param('sheet_id', 0));
    if ($reason === '') { cmp_fail('Motif (reason) requis pour rouvrir une feuille.', 422); }
    $pdo = cmp_pdo();
    $pdo->prepare('UPDATE cmp_grade_sheets SET status = \'draft\', submitted_at = NULL WHERE id = ? AND tenant_id = ?')
        ->execute([(int) $sheet['id'], $tid]);
    $pdo->prepare('UPDATE cmp_grades SET status = \'draft\' WHERE sheet_id = ? AND tenant_id = ?')
        ->execute([(int) $sheet['id'], $tid]);
    cmp_audit($ctx, 'unlock_grade_sheet', 'grade_sheet', (string) $sheet['id'], ['status' => $sheet['status']], ['status' => 'draft', 'reason' => $reason]);
    cmp_ok(['status' => 'draft', 'message' => 'Feuille rouverte pour correction.']);
}

// Données d'EXPORT (le frontend produit le XLSX/PDF via SheetJS/jsPDF côté client).
if ($route === 'export/sheet' && $method === 'GET') {
    $ctx = cmp_require_auth('tenant');
    cmp_require_perm($ctx, 'grades.enter');
    $tid = (int) $ctx['tenant_id'];
    $sheet = cmp_load_sheet($tid, (int) cmp_param('id', 0));
    $g = cmp_pdo()->prepare(
        'SELECT s.matricule, s.nom, s.prenom, gr.note, gr.coefficient, gr.appreciation
           FROM cmp_students s
           LEFT JOIN cmp_grades gr ON gr.student_id = s.id AND gr.sheet_id = ? AND gr.tenant_id = s.tenant_id
          WHERE s.tenant_id = ? AND s.class_id = ? ORDER BY s.nom, s.prenom'
    );
    $g->execute([(int) $sheet['id'], $tid, (int) $sheet['class_id']]);
    cmp_ok(['sheet' => $sheet, 'rows' => $g->fetchAll()]);
}

// ─────────────────────────── ABSENCES ─────────────────────────────
if ($route === 'absences' && $method === 'POST') {
    $ctx = cmp_require_auth('tenant');
    if (!cmp_can_any($ctx, ['attendance.manage', 'attendance.record'])) { cmp_fail('Permission insuffisante (attendance).', 403); }
    $tid = (int) $ctx['tenant_id'];
    $sid = (int) cmp_param('student_id', 0);
    $date = substr((string) cmp_param('date_absence', ''), 0, 10);
    if (!$sid || $date === '') { cmp_fail('student_id et date_absence (AAAA-MM-JJ) requis.', 422); }
    $heures = (int) cmp_param('heures', 0);
    $justifie = cmp_param('justifie', false) ? 1 : 0;
    cmp_pdo()->prepare(
        'INSERT INTO cmp_absences (tenant_id, student_id, class_id, date_absence, heures, matiere, justifie, motif, recorded_by)
         VALUES (?,?,?,?,?,?,?,?,?)'
    )->execute([
        $tid, $sid, ($cid = (int) cmp_param('class_id', 0)) ? $cid : null, $date,
        $heures, substr((string) cmp_param('matiere', ''), 0, 120) ?: null,
        $justifie, substr((string) cmp_param('motif', ''), 0, 255) ?: null, $ctx['user_id'],
    ]);
    $absId = (int) cmp_pdo()->lastInsertId();   // ← AVANT l'audit (qui écrit dans cmp_audit_log)
    cmp_audit($ctx, 'record_absence', 'student', (string) $sid, null, ['date' => $date, 'heures' => $heures]);
    // Envoi automatique au parent (absence non justifiée + n° connu).
    $notif = null;
    if (!$justifie && cmp_param('notify', true) && function_exists('cmp_notify')) {
        $s = cmp_pdo()->prepare('SELECT nom, prenom, parent_tel FROM cmp_students WHERE id = ? AND tenant_id = ?');
        $s->execute([$sid, $tid]);
        if (($stu = $s->fetch()) && $stu['parent_tel']) {
            $brand = function_exists('cmp_brand_min') ? cmp_brand_min($tid) : ['name' => 'École'];
            $msg = $brand['name'] . ' : votre enfant ' . trim($stu['prenom'] . ' ' . $stu['nom'])
                 . ' a été absent le ' . $date . ($heures ? ' (' . $heures . 'h)' : '') . '. Merci de justifier.';
            $notif = cmp_notify($tid, (string) cmp_param('channel', 'sms'), (string) $stu['parent_tel'], $msg,
                ['student_id' => $sid, 'template' => 'absence', 'created_by' => $ctx['user_id']]);
        }
    }
    cmp_ok(['id' => $absId, 'notification' => $notif], 201);
}
if ($route === 'absences' && $method === 'GET') {
    $ctx = cmp_require_auth('tenant');
    cmp_require_perm($ctx, 'students.view');
    $tid = (int) $ctx['tenant_id'];
    $sid = (int) cmp_param('student_id', 0);
    if (!$sid) { cmp_fail('student_id requis.', 422); }
    $st = cmp_pdo()->prepare('SELECT * FROM cmp_absences WHERE tenant_id = ? AND student_id = ? ORDER BY date_absence DESC');
    $st->execute([$tid, $sid]);
    $rows = $st->fetchAll();
    $total = 0; $nj = 0;
    foreach ($rows as $r) { $total += (int) $r['heures']; if (!$r['justifie']) { $nj += (int) $r['heures']; } }
    cmp_ok(['absences' => $rows, 'total_heures' => $total, 'heures_non_justifiees' => $nj]);
}

// ────────────────────────── DISCIPLINE ────────────────────────────
if ($route === 'sanctions' && $method === 'POST') {
    $ctx = cmp_require_auth('tenant');
    cmp_require_perm($ctx, 'discipline.manage');
    $tid = (int) $ctx['tenant_id'];
    $sid = (int) cmp_param('student_id', 0);
    $type = (string) cmp_param('type', 'avertissement');
    $date = substr((string) cmp_param('date_fait', ''), 0, 10);
    $allowed = ['avertissement','blame','exclusion_temporaire','exclusion_definitive','convocation','consigne','retenue','felicitations','encouragement','tableau_honneur'];
    if (!$sid || $date === '' || !in_array($type, $allowed, true)) { cmp_fail('student_id, type valide et date_fait requis.', 422); }
    cmp_pdo()->prepare(
        'INSERT INTO cmp_sanctions (tenant_id, student_id, type, date_fait, description, decision, duree_jours, recorded_by)
         VALUES (?,?,?,?,?,?,?,?)'
    )->execute([
        $tid, $sid, $type, $date, substr((string) cmp_param('description', ''), 0, 5000) ?: null,
        substr((string) cmp_param('decision', ''), 0, 5000) ?: null,
        ($d = (int) cmp_param('duree_jours', 0)) ? $d : null, $ctx['user_id'],
    ]);
    $sanctionId = (int) cmp_pdo()->lastInsertId();   // ← AVANT l'audit
    cmp_audit($ctx, 'record_sanction', 'student', (string) $sid, null, ['type' => $type, 'date' => $date]);
    cmp_ok(['id' => $sanctionId], 201);
}
if ($route === 'sanctions' && $method === 'GET') {
    $ctx = cmp_require_auth('tenant');
    cmp_require_perm($ctx, 'students.view');
    $tid = (int) $ctx['tenant_id'];
    $sid = (int) cmp_param('student_id', 0);
    if (!$sid) { cmp_fail('student_id requis.', 422); }
    $st = cmp_pdo()->prepare('SELECT * FROM cmp_sanctions WHERE tenant_id = ? AND student_id = ? ORDER BY date_fait DESC');
    $st->execute([$tid, $sid]);
    cmp_ok(['sanctions' => $st->fetchAll()]);
}

// ──────────────────────── PROCÈS-VERBAUX ──────────────────────────
if ($route === 'pv' && $method === 'POST') {
    $ctx = cmp_require_auth('tenant');
    cmp_require_role($ctx, ['admin', 'vie_scolaire']);
    $tid = (int) $ctx['tenant_id'];
    $titre = substr(trim((string) cmp_param('titre', '')), 0, 255);
    if ($titre === '') { cmp_fail('titre requis.', 422); }
    $parts = cmp_param('participants', null);
    cmp_pdo()->prepare(
        'INSERT INTO cmp_pv (tenant_id, class_id, type, periode, titre, president, participants, contenu, decisions, status, created_by)
         VALUES (?,?,?,?,?,?,?,?,?,?,?)'
    )->execute([
        $tid, ($cid = (int) cmp_param('class_id', 0)) ? $cid : null,
        (string) cmp_param('type', 'conseil_classe'), substr((string) cmp_param('periode', ''), 0, 40) ?: null,
        $titre, substr((string) cmp_param('president', ''), 0, 160) ?: null,
        is_array($parts) ? json_encode($parts, JSON_UNESCAPED_UNICODE) : null,
        (string) cmp_param('contenu', '') ?: null, (string) cmp_param('decisions', '') ?: null,
        cmp_param('status', 'draft') === 'final' ? 'final' : 'draft', $ctx['user_id'],
    ]);
    $id = (int) cmp_pdo()->lastInsertId();
    cmp_audit($ctx, 'create_pv', 'pv', (string) $id, null, ['titre' => $titre]);
    cmp_ok(['id' => $id], 201);
}
if ($route === 'pv' && $method === 'GET') {
    $ctx = cmp_require_auth('tenant');
    cmp_require_role($ctx, ['admin', 'vie_scolaire']);
    $tid = (int) $ctx['tenant_id'];
    $sql = 'SELECT id, class_id, type, periode, titre, president, status, created_at FROM cmp_pv WHERE tenant_id = ?';
    $args = [$tid];
    if (($cid = (int) cmp_param('class_id', 0))) { $sql .= ' AND class_id = ?'; $args[] = $cid; }
    $sql .= ' ORDER BY created_at DESC LIMIT 300';
    $st = cmp_pdo()->prepare($sql);
    $st->execute($args);
    cmp_ok(['pv' => $st->fetchAll()]);
}

// ─────────────────── IMPORT GROUPÉ D'ÉLÈVES (Excel/CSV parsé côté client) ───────────────────
if ($route === 'import/students' && $method === 'POST') {
    $ctx = cmp_require_auth('tenant');
    cmp_require_role($ctx, ['admin', 'comptable']);
    $tid = (int) $ctx['tenant_id'];
    $rows = cmp_param('rows', null);
    if (!is_array($rows)) { cmp_fail('« rows » doit être une liste d\'élèves.', 422); }
    $cap = (int) (cmp_pdo()->query('SELECT max_students FROM cmp_tenants WHERE id = ' . $tid)->fetchColumn() ?: 0);
    $cnt = (int) cmp_pdo()->query('SELECT COUNT(*) FROM cmp_students WHERE tenant_id = ' . $tid)->fetchColumn();
    $pdo = cmp_pdo();
    $ins = $pdo->prepare(
        'INSERT INTO cmp_students (tenant_id, matricule, nom, prenom, sexe, class_id, parent_nom, parent_tel, frais_total, statut, photo_url)
         VALUES (?,?,?,?,?,?,?,?,?,?,?)
         ON DUPLICATE KEY UPDATE nom = VALUES(nom), prenom = VALUES(prenom), class_id = VALUES(class_id),
                                 parent_nom = VALUES(parent_nom), parent_tel = VALUES(parent_tel)'
    );
    $ok = 0; $skipped = 0; $errors = [];
    foreach ($rows as $i => $r) {
        if (!is_array($r) || empty($r['nom'])) { $skipped++; continue; }
        if ($cap > 0 && ($cnt + $ok) >= $cap) { $errors[] = 'Plafond du forfait atteint à la ligne ' . $i . '.'; break; }
        try {
            $ins->execute([
                $tid, substr((string) ($r['matricule'] ?? ''), 0, 40) ?: null,
                substr((string) $r['nom'], 0, 120), substr((string) ($r['prenom'] ?? ''), 0, 120),
                substr((string) ($r['sexe'] ?? ''), 0, 1) ?: null, (int) ($r['class_id'] ?? 0) ?: null,
                substr((string) ($r['parent_nom'] ?? ''), 0, 200), substr((string) ($r['parent_tel'] ?? ''), 0, 60),
                (int) ($r['frais_total'] ?? 0), substr((string) ($r['statut'] ?? 'actif'), 0, 40),
                substr((string) ($r['photo_url'] ?? ''), 0, 1000) ?: null,
            ]);
            $ok++;
        } catch (Throwable $e) { $errors[] = 'Ligne ' . $i . ' : ' . substr($e->getMessage(), 0, 120); }
    }
    cmp_audit($ctx, 'import_students', 'students', '', null, ['imported' => $ok, 'skipped' => $skipped]);
    cmp_ok(['imported' => $ok, 'skipped' => $skipped, 'errors' => $errors], 201);
}

// ── GET /grades/tracking?periode= — SUIVI DES SAISIES (admin) : progression + enseignants en retard ──
if ($route === 'grades/tracking' && $method === 'GET') {
    $ctx = cmp_require_auth('tenant');
    if (!cmp_can_any($ctx, ['audit.view', 'settings.manage', 'staff.manage'])) { cmp_fail('Accès refusé.', 403); }
    $tid = (int) $ctx['tenant_id'];
    $periode = substr((string) cmp_param('periode', ''), 0, 40);
    $sql = 'SELECT gs.id, gs.periode, gs.sequence, gs.eval_key, gs.status, gs.submitted_at, gs.created_at,
                   c.name AS classe, sj.name AS matiere, u.id AS teacher_id, u.nom AS ens_nom, u.prenom AS ens_prenom,
                   (SELECT COUNT(*) FROM cmp_students s WHERE s.tenant_id = gs.tenant_id AND s.class_id = gs.class_id) AS effectif,
                   (SELECT COUNT(*) FROM cmp_grades g WHERE g.sheet_id = gs.id AND g.note IS NOT NULL) AS saisies
              FROM cmp_grade_sheets gs
              LEFT JOIN cmp_classes c  ON c.id = gs.class_id   AND c.tenant_id = gs.tenant_id
              LEFT JOIN cmp_subjects sj ON sj.id = gs.subject_id AND sj.tenant_id = gs.tenant_id
              LEFT JOIN cmp_users u    ON u.id = gs.teacher_id AND u.tenant_id = gs.tenant_id
             WHERE gs.tenant_id = ?';
    $args = [$tid];
    if ($periode !== '') { $sql .= ' AND gs.periode = ?'; $args[] = $periode; }
    $sql .= ' ORDER BY u.nom, c.name, sj.name';
    $st = cmp_pdo()->prepare($sql);
    $st->execute($args);
    $rows = $st->fetchAll();
    $enRetard = []; $complets = 0;
    foreach ($rows as &$r) {
        $eff = (int) $r['effectif']; $sa = (int) $r['saisies'];
        $r['progression'] = $eff ? (int) round($sa / $eff * 100) : 0;
        if ($r['status'] !== 'draft') { $r['etat'] = 'a_jour'; $complets++; }
        elseif ($sa === 0) { $r['etat'] = 'non_commence'; }
        elseif ($sa < $eff) { $r['etat'] = 'en_cours'; }
        else { $r['etat'] = 'a_valider'; }
        if (in_array($r['etat'], ['non_commence', 'en_cours'], true) && $r['teacher_id']) {
            $enRetard[(int) $r['teacher_id']] = trim((string) $r['ens_prenom'] . ' ' . (string) $r['ens_nom']);
        }
    }
    unset($r);
    cmp_ok(['sheets' => $rows, 'total' => count($rows), 'complets' => $complets, 'enseignants_en_retard' => array_values($enRetard)]);
}
