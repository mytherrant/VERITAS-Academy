<?php
/**
 * api/campus/_routes_modules.php — Emploi du temps · Bibliothèque · Transport.
 * © 2024-2026 Jacques Miterand TAKOU (Mythe Errant). Tous droits réservés.
 * Inclus par index.php. Hérite de $route, $method et des helpers.
 */
declare(strict_types=1);

/* ───────────────────────── EMPLOI DU TEMPS ───────────────────────── */
if ($route === 'timetable' && $method === 'GET') {
    $ctx = cmp_require_auth('tenant');
    cmp_require_perm($ctx, 'students.view');
    $cid = (int) cmp_param('class_id', 0);
    if (!$cid) { cmp_fail('class_id requis.', 422); }
    $st = cmp_pdo()->prepare(
        'SELECT tt.id, tt.jour, tt.debut, tt.fin, tt.salle, sj.name AS matiere, u.nom AS enseignant
           FROM cmp_timetable tt
           LEFT JOIN cmp_subjects sj ON sj.id = tt.subject_id AND sj.tenant_id = tt.tenant_id
           LEFT JOIN cmp_users u ON u.id = tt.teacher_id AND u.tenant_id = tt.tenant_id
          WHERE tt.tenant_id = ? AND tt.class_id = ? ORDER BY tt.jour, tt.debut'
    );
    $st->execute([(int) $ctx['tenant_id'], $cid]);
    cmp_ok(['slots' => $st->fetchAll()]);
}
if ($route === 'timetable' && $method === 'POST') {
    $ctx = cmp_require_auth('tenant');
    cmp_require_perm($ctx, 'timetable.manage');
    $tid = (int) $ctx['tenant_id'];
    $cid = (int) cmp_param('class_id', 0);
    $jour = (int) cmp_param('jour', 0);
    $debut = substr((string) cmp_param('debut', ''), 0, 8);
    $fin = substr((string) cmp_param('fin', ''), 0, 8);
    if (!$cid || $jour < 1 || $jour > 7 || $debut === '' || $fin === '') { cmp_fail('class_id, jour (1-7), debut, fin requis.', 422); }
    cmp_pdo()->prepare(
        'INSERT INTO cmp_timetable (tenant_id, class_id, jour, debut, fin, subject_id, teacher_id, salle)
         VALUES (?,?,?,?,?,?,?,?)'
    )->execute([
        $tid, $cid, $jour, $debut, $fin,
        ($s = (int) cmp_param('subject_id', 0)) ? $s : null,
        ($t = (int) cmp_param('teacher_id', 0)) ? $t : null,
        substr((string) cmp_param('salle', ''), 0, 40) ?: null,
    ]);
    $id = (int) cmp_pdo()->lastInsertId();
    cmp_audit($ctx, 'add_timetable_slot', 'timetable', (string) $id);
    cmp_ok(['id' => $id], 201);
}
if ($route === 'timetable/delete' && $method === 'POST') {
    $ctx = cmp_require_auth('tenant');
    cmp_require_perm($ctx, 'timetable.manage');
    $id = (int) cmp_param('id', 0);
    cmp_pdo()->prepare('DELETE FROM cmp_timetable WHERE id = ? AND tenant_id = ?')->execute([$id, (int) $ctx['tenant_id']]);
    cmp_audit($ctx, 'delete_timetable_slot', 'timetable', (string) $id);
    cmp_ok([]);
}

/* ───────────────────────── BIBLIOTHÈQUE ───────────────────────── */
if ($route === 'books' && $method === 'GET') {
    $ctx = cmp_require_auth('tenant');
    cmp_require_perm($ctx, 'students.view');
    $q = '%' . substr((string) cmp_param('q', ''), 0, 60) . '%';
    $st = cmp_pdo()->prepare(
        'SELECT id, isbn, titre, auteur, categorie, exemplaires, disponibles
           FROM cmp_books WHERE tenant_id = ? AND (titre LIKE ? OR auteur LIKE ?) ORDER BY titre LIMIT 500'
    );
    $st->execute([(int) $ctx['tenant_id'], $q, $q]);
    cmp_ok(['books' => $st->fetchAll()]);
}
if ($route === 'books' && $method === 'POST') {
    $ctx = cmp_require_auth('tenant');
    cmp_require_perm($ctx, 'library.manage');
    $titre = trim((string) cmp_param('titre', ''));
    if ($titre === '') { cmp_fail('titre requis.', 422); }
    $ex = (int) cmp_param('exemplaires', 1);
    cmp_pdo()->prepare(
        'INSERT INTO cmp_books (tenant_id, isbn, titre, auteur, categorie, exemplaires, disponibles)
         VALUES (?,?,?,?,?,?,?)'
    )->execute([
        (int) $ctx['tenant_id'], substr((string) cmp_param('isbn', ''), 0, 20) ?: null,
        substr($titre, 0, 255), substr((string) cmp_param('auteur', ''), 0, 190) ?: null,
        substr((string) cmp_param('categorie', ''), 0, 80) ?: null, max(1, $ex), max(1, $ex),
    ]);
    $id = (int) cmp_pdo()->lastInsertId();
    cmp_audit($ctx, 'add_book', 'book', (string) $id, null, ['titre' => $titre]);
    cmp_ok(['id' => $id], 201);
}
// Prêt d'un livre (décrémente le stock disponible dans une transaction).
if ($route === 'loans' && $method === 'POST') {
    $ctx = cmp_require_auth('tenant');
    cmp_require_perm($ctx, 'library.manage');
    $tid = (int) $ctx['tenant_id'];
    $bookId = (int) cmp_param('book_id', 0);
    $datePret = substr((string) cmp_param('date_pret', date('Y-m-d')), 0, 10);
    $pdo = cmp_pdo();
    try {
        $pdo->beginTransaction();
        $b = $pdo->prepare('SELECT disponibles FROM cmp_books WHERE id = ? AND tenant_id = ? FOR UPDATE');
        $b->execute([$bookId, $tid]);
        $dispo = $b->fetchColumn();
        if ($dispo === false) { $pdo->rollBack(); cmp_fail('Livre introuvable.', 404); }
        if ((int) $dispo < 1) { $pdo->rollBack(); cmp_fail('Aucun exemplaire disponible.', 409); }
        $pdo->prepare('UPDATE cmp_books SET disponibles = disponibles - 1 WHERE id = ? AND tenant_id = ?')->execute([$bookId, $tid]);
        $pdo->prepare(
            'INSERT INTO cmp_book_loans (tenant_id, book_id, borrower_type, borrower_id, borrower_nom, date_pret, date_retour_prevue, created_by)
             VALUES (?,?,?,?,?,?,?,?)'
        )->execute([
            $tid, $bookId, cmp_param('borrower_type', 'eleve') === 'personnel' ? 'personnel' : 'eleve',
            ($bid = (int) cmp_param('borrower_id', 0)) ? $bid : null, substr((string) cmp_param('borrower_nom', ''), 0, 190) ?: null,
            $datePret, substr((string) cmp_param('date_retour_prevue', ''), 0, 10) ?: null, $ctx['user_id'],
        ]);
        $loanId = (int) $pdo->lastInsertId();
        $pdo->commit();
    } catch (Throwable $e) {
        if ($pdo->inTransaction()) { $pdo->rollBack(); }
        cmp_fail('Échec du prêt.', 500);
    }
    cmp_audit($ctx, 'lend_book', 'book', (string) $bookId);
    cmp_ok(['loan_id' => $loanId], 201);
}
if ($route === 'loans/return' && $method === 'POST') {
    $ctx = cmp_require_auth('tenant');
    cmp_require_perm($ctx, 'library.manage');
    $tid = (int) $ctx['tenant_id'];
    $loanId = (int) cmp_param('loan_id', 0);
    $pdo = cmp_pdo();
    $l = $pdo->prepare('SELECT book_id, statut FROM cmp_book_loans WHERE id = ? AND tenant_id = ?');
    $l->execute([$loanId, $tid]);
    $loan = $l->fetch();
    if (!$loan) { cmp_fail('Prêt introuvable.', 404); }
    if ($loan['statut'] === 'rendu') { cmp_fail('Déjà rendu.', 409); }
    $pdo->prepare('UPDATE cmp_book_loans SET statut = \'rendu\', date_retour = CURDATE() WHERE id = ? AND tenant_id = ?')->execute([$loanId, $tid]);
    $pdo->prepare('UPDATE cmp_books SET disponibles = disponibles + 1 WHERE id = ? AND tenant_id = ?')->execute([(int) $loan['book_id'], $tid]);
    cmp_audit($ctx, 'return_book', 'book', (string) $loan['book_id']);
    cmp_ok(['message' => 'Retour enregistré.']);
}
if ($route === 'loans' && $method === 'GET') {
    $ctx = cmp_require_auth('tenant');
    cmp_require_perm($ctx, 'library.manage');
    $st = cmp_pdo()->prepare(
        'SELECT l.*, bk.titre FROM cmp_book_loans l JOIN cmp_books bk ON bk.id = l.book_id AND bk.tenant_id = l.tenant_id
          WHERE l.tenant_id = ? ORDER BY l.date_pret DESC LIMIT 300'
    );
    $st->execute([(int) $ctx['tenant_id']]);
    cmp_ok(['loans' => $st->fetchAll()]);
}

/* ───────────────────────── TRANSPORT ───────────────────────── */
if ($route === 'transport/routes' && $method === 'GET') {
    $ctx = cmp_require_auth('tenant');
    cmp_require_perm($ctx, 'students.view');
    $st = cmp_pdo()->prepare(
        'SELECT r.*, (SELECT COUNT(*) FROM cmp_transport_assign a WHERE a.route_id = r.id) AS inscrits
           FROM cmp_transport_routes r WHERE r.tenant_id = ? ORDER BY r.nom'
    );
    $st->execute([(int) $ctx['tenant_id']]);
    cmp_ok(['routes' => $st->fetchAll()]);
}
if ($route === 'transport/routes' && $method === 'POST') {
    $ctx = cmp_require_auth('tenant');
    cmp_require_perm($ctx, 'transport.manage');
    $nom = trim((string) cmp_param('nom', ''));
    if ($nom === '') { cmp_fail('nom requis.', 422); }
    cmp_pdo()->prepare(
        'INSERT INTO cmp_transport_routes (tenant_id, nom, vehicule, immatriculation, chauffeur, chauffeur_tel, places, frais)
         VALUES (?,?,?,?,?,?,?,?)'
    )->execute([
        (int) $ctx['tenant_id'], substr($nom, 0, 120),
        substr((string) cmp_param('vehicule', ''), 0, 80) ?: null, substr((string) cmp_param('immatriculation', ''), 0, 40) ?: null,
        substr((string) cmp_param('chauffeur', ''), 0, 120) ?: null, substr((string) cmp_param('chauffeur_tel', ''), 0, 60) ?: null,
        (int) cmp_param('places', 0), (int) cmp_param('frais', 0),
    ]);
    $id = (int) cmp_pdo()->lastInsertId();
    cmp_audit($ctx, 'add_transport_route', 'transport_route', (string) $id);
    cmp_ok(['id' => $id], 201);
}
if ($route === 'transport/stops' && $method === 'POST') {
    $ctx = cmp_require_auth('tenant');
    cmp_require_perm($ctx, 'transport.manage');
    $rid = (int) cmp_param('route_id', 0);
    $nom = trim((string) cmp_param('nom', ''));
    if (!$rid || $nom === '') { cmp_fail('route_id et nom requis.', 422); }
    cmp_pdo()->prepare('INSERT INTO cmp_transport_stops (tenant_id, route_id, nom, heure, ordre) VALUES (?,?,?,?,?)')
        ->execute([(int) $ctx['tenant_id'], $rid, substr($nom, 0, 120), substr((string) cmp_param('heure', ''), 0, 8) ?: null, (int) cmp_param('ordre', 0)]);
    cmp_ok(['id' => (int) cmp_pdo()->lastInsertId()], 201);
}
if ($route === 'transport/assign' && $method === 'POST') {
    $ctx = cmp_require_auth('tenant');
    cmp_require_perm($ctx, 'transport.manage');
    $tid = (int) $ctx['tenant_id'];
    $rid = (int) cmp_param('route_id', 0);
    $sid = (int) cmp_param('student_id', 0);
    if (!$rid || !$sid) { cmp_fail('route_id et student_id requis.', 422); }
    cmp_pdo()->prepare(
        'INSERT INTO cmp_transport_assign (tenant_id, route_id, student_id, stop_id, frais)
         VALUES (?,?,?,?,?) ON DUPLICATE KEY UPDATE stop_id = VALUES(stop_id), frais = VALUES(frais), statut = \'actif\''
    )->execute([$tid, $rid, $sid, ($sp = (int) cmp_param('stop_id', 0)) ? $sp : null, (int) cmp_param('frais', 0)]);
    cmp_audit($ctx, 'assign_transport', 'student', (string) $sid, null, ['route_id' => $rid]);
    cmp_ok(['message' => 'Élève affecté à la ligne.'], 201);
}
