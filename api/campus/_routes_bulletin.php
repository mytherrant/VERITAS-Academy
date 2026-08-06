<?php
/**
 * api/campus/_routes_bulletin.php — Moteur de bulletin.
 * © 2024-2026 Jacques Miterand TAKOU (Mythe Errant). Tous droits réservés.
 *
 * Agrège les notes saisies (composantes pondérées Devoir 1/2 ou CC/DS/SN selon la
 * config `grading` de la section) → note trimestrielle par matière, rang par
 * matière, max/min/moyenne de classe, moyenne générale, rang général, mention.
 * C'est ce qui produit le « vrai » bulletin à partir des notes réellement saisies.
 */
declare(strict_types=1);

/** Pondérations + distinctions de la section d'une classe (ou défaut Devoir 1/2). */
function cmp_class_grading(int $tid, int $classId): array {
    $st = cmp_pdo()->prepare(
        'SELECT s.grading FROM cmp_classes c
           LEFT JOIN cmp_academic_sections s ON s.id = c.section_id AND s.tenant_id = c.tenant_id
          WHERE c.id = ? AND c.tenant_id = ? LIMIT 1'
    );
    $st->execute([$classId, $tid]);
    $g = $st->fetchColumn();
    $g = $g ? json_decode((string) $g, true) : null;
    if (!is_array($g) || empty($g['evals'])) {
        $g = [
            'evals' => [['key' => 'dev1', 'weight' => 50], ['key' => 'dev2', 'weight' => 50]],
            'distinctions' => [
                ['label' => 'Félicitations', 'min' => 16], ['label' => "Tableau d'honneur", 'min' => 14],
                ['label' => 'Encouragements', 'min' => 12], ['label' => 'Avertissement travail', 'min' => 8],
                ['label' => 'Blâme travail', 'min' => 0],
            ],
        ];
    }
    return $g;
}

// GET /bulletin/compute?class_id=&periode= — calcule le bulletin de toute la classe.
if ($route === 'bulletin/compute' && $method === 'GET') {
    $ctx = cmp_require_auth('tenant');
    cmp_require_perm($ctx, 'grades.enter');
    $tid = (int) $ctx['tenant_id'];
    $classId = (int) cmp_param('class_id', 0);
    $periode = substr((string) cmp_param('periode', ''), 0, 40);
    if (!$classId || $periode === '') { cmp_fail('class_id et periode requis.', 422); }

    $grading = cmp_class_grading($tid, $classId);
    $weights = [];
    foreach ($grading['evals'] as $e) { $weights[$e['key']] = (float) $e['weight']; }
    $dists = $grading['distinctions'] ?? [];
    usort($dists, function ($a, $b) { return $b['min'] <=> $a['min']; });

    $pdo = cmp_pdo();
    $stS = $pdo->prepare('SELECT id, matricule, nom, prenom FROM cmp_students WHERE tenant_id = ? AND class_id = ? ORDER BY nom, prenom');
    $stS->execute([$tid, $classId]);
    $students = $stS->fetchAll();

    $stSheets = $pdo->prepare(
        'SELECT gs.id AS sheet_id, gs.subject_id, gs.eval_key, sj.name AS subject, COALESCE(sj.default_coef,1) AS coef
           FROM cmp_grade_sheets gs LEFT JOIN cmp_subjects sj ON sj.id = gs.subject_id AND sj.tenant_id = gs.tenant_id
          WHERE gs.tenant_id = ? AND gs.class_id = ? AND gs.periode = ?'
    );
    $stSheets->execute([$tid, $classId, $periode]);
    $sheets = $stSheets->fetchAll();
    if (!$sheets) { cmp_ok(['bulletins' => [], 'message' => 'Aucune note saisie pour cette période.']); }

    $sheetIds = []; $subjMeta = []; $sheetEval = [];
    foreach ($sheets as $s) {
        $sheetIds[] = (int) $s['sheet_id'];
        $subjMeta[(int) $s['subject_id']] = ['name' => $s['subject'], 'coef' => (int) $s['coef']];
        $sheetEval[(int) $s['sheet_id']] = ['subject' => (int) $s['subject_id'], 'eval' => $s['eval_key']];
    }
    $in = implode(',', array_fill(0, count($sheetIds), '?'));
    $stG = $pdo->prepare('SELECT sheet_id, student_id, note FROM cmp_grades WHERE tenant_id = ? AND sheet_id IN (' . $in . ')');
    $stG->execute(array_merge([$tid], $sheetIds));
    $byStu = [];
    foreach ($stG->fetchAll() as $g) {
        if ($g['note'] === null) { continue; }
        $se = $sheetEval[(int) $g['sheet_id']] ?? null;
        if (!$se) { continue; }
        $byStu[(int) $g['student_id']][$se['subject']][$se['eval']] = (float) $g['note'];
    }

    // Note pondérée par matière et par élève.
    $perStudent = []; $subjectNotes = [];
    foreach ($students as $st) {
        $sid = (int) $st['id'];
        $perStudent[$sid] = [];
        foreach ($subjMeta as $subjId => $m) {
            $evals = $byStu[$sid][$subjId] ?? null;
            if (!$evals) { continue; }
            $sum = 0.0; $wsum = 0.0;
            foreach ($evals as $ek => $note) {
                $w = $weights[$ek] ?? (100.0 / max(1, count($evals)));
                $sum += $note * $w; $wsum += $w;
            }
            if ($wsum <= 0) { continue; }
            $note = $sum / $wsum;     // normalisé si les poids ne somment pas à 100
            $perStudent[$sid][$subjId] = round($note, 2);
            $subjectNotes[$subjId][] = $note;
        }
    }

    // Stats par matière (max / min / moyenne de classe).
    $subjStats = [];
    foreach ($subjMeta as $subjId => $m) {
        $notes = $subjectNotes[$subjId] ?? [];
        $subjStats[$subjId] = [
            'max' => $notes ? round(max($notes), 2) : null,
            'min' => $notes ? round(min($notes), 2) : null,
            'avg' => $notes ? round(array_sum($notes) / count($notes), 2) : null,
        ];
    }
    // Rang par matière.
    $subjRank = [];
    foreach ($subjMeta as $subjId => $m) {
        $pairs = [];
        foreach ($perStudent as $sid => $notes) { if (isset($notes[$subjId])) { $pairs[$sid] = $notes[$subjId]; } }
        arsort($pairs);
        $r = 0;
        foreach ($pairs as $sid => $n) { $r++; $subjRank[$subjId][$sid] = $r; }
    }

    // Moyenne générale (pondérée par coef) + rang général.
    $general = [];
    foreach ($students as $st) {
        $sid = (int) $st['id'];
        $w = 0.0; $c = 0;
        foreach ($perStudent[$sid] as $subjId => $note) { $coef = $subjMeta[$subjId]['coef']; $w += $note * $coef; $c += $coef; }
        $general[$sid] = $c > 0 ? round($w / $c, 2) : null;
    }
    arsort($general);
    $rankGen = []; $rr = 0;
    foreach ($general as $sid => $moy) { $rr++; $rankGen[$sid] = $rr; }

    $mention = function ($moy) use ($dists) {
        if ($moy === null) { return ''; }
        foreach ($dists as $d) { if ($moy >= $d['min']) { return $d['label']; } }
        return '';
    };

    $out = [];
    foreach ($students as $st) {
        $sid = (int) $st['id'];
        $subjects = [];
        foreach ($subjMeta as $subjId => $m) {
            if (!isset($perStudent[$sid][$subjId])) { continue; }
            $subjects[] = [
                'subject' => $m['name'], 'coef' => $m['coef'], 'note' => $perStudent[$sid][$subjId],
                'rang' => $subjRank[$subjId][$sid] ?? null,
                'max' => $subjStats[$subjId]['max'], 'min' => $subjStats[$subjId]['min'], 'moy_classe' => $subjStats[$subjId]['avg'],
            ];
        }
        $out[] = [
            'student' => ['id' => $sid, 'matricule' => $st['matricule'], 'nom' => $st['nom'], 'prenom' => $st['prenom']],
            'subjects' => $subjects,
            'moyenne' => $general[$sid], 'rang' => $rankGen[$sid] ?? null, 'effectif' => count($students),
            'mention' => $mention($general[$sid]),
        ];
    }
    cmp_ok(['periode' => $periode, 'class_id' => $classId, 'grading' => $grading, 'bulletins' => $out]);
}
