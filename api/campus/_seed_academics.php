<?php
/**
 * api/campus/_seed_academics.php — Structure académique camerounaise STANDARD.
 * © 2024-2026 Jacques Miterand TAKOU (Mythe Errant). Tous droits réservés.
 *
 * Renvoyée par campus_seed_academics() : la structure par défaut (sous-systèmes
 * francophone/anglophone × enseignement général/technique) copiée dans chaque
 * établissement au provisioning. 100 % CONFIGURABLE ensuite : l'admin peut
 * activer/désactiver une section, ajouter une classe/série, changer le barème.
 *
 * Source : organisation MINESEC (Cameroun) — cycles, classes, séries, examens.
 */
declare(strict_types=1);

function campus_seed_academics(): array {
    return [
        // ───────────────────────── FRANCOPHONE — GÉNÉRAL ─────────────────────────
        [
            'section_key'   => 'fr_general',
            'sous_systeme'  => 'francophone',
            'filiere'       => 'general',
            'label'         => 'Francophone — Enseignement général',
            'langue'        => 'fr',
            'bareme'        => 20,
            'grading_scale' => 'sur_20',
            'periodes'      => 'trimestre',
            'ordering'      => 1,
            'cycles'        => [
                [
                    'key' => 'premier_cycle', 'label' => 'Premier cycle', 'examen' => 'BEPC',
                    'classes' => ['6e', '5e', '4e', '3e'],
                ],
                [
                    'key' => 'second_cycle', 'label' => 'Second cycle', 'examen' => 'Probatoire / Baccalauréat',
                    'classes' => [
                        '2nde A', '2nde C',
                        '1ère A', '1ère C', '1ère D', '1ère TI',
                        'Tle A', 'Tle C', 'Tle D', 'Tle TI',
                    ],
                ],
            ],
            'series' => ['A' => 'Littéraire', 'C' => 'Mathématiques-Sciences physiques', 'D' => 'Sciences de la vie et de la terre', 'TI' => 'Technologies de l\'information'],
        ],

        // ───────────────────────── FRANCOPHONE — TECHNIQUE ───────────────────────
        [
            'section_key'   => 'fr_technique',
            'sous_systeme'  => 'francophone',
            'filiere'       => 'technique',
            'label'         => 'Francophone — Enseignement technique & professionnel',
            'langue'        => 'fr',
            'bareme'        => 20,
            'grading_scale' => 'sur_20',
            'periodes'      => 'trimestre',
            'ordering'      => 2,
            'cycles'        => [
                [
                    'key' => 'premier_cycle_tech', 'label' => 'Premier cycle technique', 'examen' => 'CAP',
                    'classes' => ['1ère année CAP', '2e année CAP', '3e année CAP', '4e année CAP'],
                ],
                [
                    'key' => 'second_cycle_tech', 'label' => 'Second cycle technique', 'examen' => 'Probatoire technique / Baccalauréat technique / BEP',
                    'classes' => [
                        '2nde F1', '2nde F2', '2nde F3', '2nde F4', '2nde G1', '2nde G2', '2nde G3',
                        '1ère F2', '1ère F3', '1ère G2', '1ère G3',
                        'Tle F2', 'Tle F3', 'Tle G2', 'Tle G3',
                    ],
                ],
            ],
            'series' => [
                'F1' => 'Construction mécanique', 'F2' => 'Électronique', 'F3' => 'Électrotechnique',
                'F4' => 'Génie civil', 'G1' => 'Techniques administratives', 'G2' => 'Comptabilité',
                'G3' => 'Commerce',
            ],
        ],

        // ───────────────────────── ANGLOPHONE — GENERAL ──────────────────────────
        [
            'section_key'   => 'en_general',
            'sous_systeme'  => 'anglophone',
            'filiere'       => 'general',
            'label'         => 'Anglophone — General Education',
            'langue'        => 'en',
            'bareme'        => 20,
            'grading_scale' => 'gce_letter',
            'periodes'      => 'trimestre',
            'ordering'      => 3,
            'cycles'        => [
                [
                    'key' => 'first_cycle', 'label' => 'First Cycle', 'examen' => 'GCE Ordinary Level (O/L)',
                    'classes' => ['Form 1', 'Form 2', 'Form 3', 'Form 4', 'Form 5'],
                ],
                [
                    'key' => 'second_cycle', 'label' => 'Second Cycle', 'examen' => 'GCE Advanced Level (A/L)',
                    'classes' => ['Lower Sixth Arts', 'Lower Sixth Science', 'Upper Sixth Arts', 'Upper Sixth Science'],
                ],
            ],
            'series' => ['Arts' => 'Arts', 'Science' => 'Science', 'Commercial' => 'Commercial'],
        ],

        // ───────────────────────── ANGLOPHONE — TECHNICAL ────────────────────────
        [
            'section_key'   => 'en_technical',
            'sous_systeme'  => 'anglophone',
            'filiere'       => 'technique',
            'label'         => 'Anglophone — Technical & Vocational Education',
            'langue'        => 'en',
            'bareme'        => 20,
            'grading_scale' => 'gce_letter',
            'periodes'      => 'trimestre',
            'ordering'      => 4,
            'cycles'        => [
                [
                    'key' => 'first_cycle_tech', 'label' => 'First Cycle (Technical)', 'examen' => 'GCE O/L Technical · City & Guilds',
                    'classes' => ['Form 1 (Tech)', 'Form 2 (Tech)', 'Form 3 (Tech)', 'Form 4 (Tech)', 'Form 5 (Tech)'],
                ],
                [
                    'key' => 'second_cycle_tech', 'label' => 'Second Cycle (Technical)', 'examen' => 'GCE A/L Technical',
                    'classes' => ['Lower Sixth Industrial', 'Lower Sixth Commercial', 'Upper Sixth Industrial', 'Upper Sixth Commercial'],
                ],
            ],
            'series' => ['Industrial' => 'Industrial', 'Commercial' => 'Commercial'],
        ],
    ];
}

/**
 * Insère la structure académique d'un tenant + ses classes dérivées.
 * @param array $onlySections Sous-ensemble de section_key à activer (les autres
 *              sont insérées désactivées). [] = tout activer.
 */
/**
 * Politique d'évaluation par défaut — CONFIGURABLE par établissement (et par section).
 * evals : composantes affichées au bulletin (Devoir 1/2, ou CC/DS/SN…) avec pondération %.
 * distinctions : seuils (min) des mentions (Tableau d'honneur, etc.).
 */
function campus_default_grading(): string {
    return json_encode([
        'evals' => [
            ['key' => 'dev1', 'label' => 'Devoir 1', 'weight' => 50],
            ['key' => 'dev2', 'label' => 'Devoir 2', 'weight' => 50],
        ],
        'periodes' => ['trimestre', 2],   // 2 devoirs synthétisés en note trimestrielle
        'distinctions' => [
            ['label' => 'Félicitations', 'en' => 'Commendation', 'min' => 16],
            ['label' => "Tableau d'honneur", 'en' => 'Honour roll', 'min' => 14],
            ['label' => 'Encouragements', 'en' => 'Distinction', 'min' => 12],
            ['label' => 'Avertissement travail', 'en' => 'Academic warning', 'min' => 8],
            ['label' => 'Blâme travail', 'en' => 'Serious warning', 'min' => 0],
        ],
    ], JSON_UNESCAPED_UNICODE);
}

function campus_install_academics(PDO $pdo, int $tenantId, array $onlySections = []): void {
    $stSec = $pdo->prepare(
        'INSERT INTO cmp_academic_sections
           (tenant_id, section_key, sous_systeme, filiere, label, langue, bareme, grading_scale, periodes, cycles, grading, ordering, enabled)
         VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?)
         ON DUPLICATE KEY UPDATE label=VALUES(label), cycles=VALUES(cycles), enabled=VALUES(enabled)'
    );
    $stCls = $pdo->prepare(
        'INSERT IGNORE INTO cmp_classes
           (tenant_id, section_id, sous_systeme, filiere, code, name, cycle, niveau_ordre)
         VALUES (?,?,?,?,?,?,?,?)'
    );

    foreach (campus_seed_academics() as $sec) {
        $enabled = ($onlySections === [] || in_array($sec['section_key'], $onlySections, true)) ? 1 : 0;
        $stSec->execute([
            $tenantId, $sec['section_key'], $sec['sous_systeme'], $sec['filiere'], $sec['label'],
            $sec['langue'], $sec['bareme'], $sec['grading_scale'], $sec['periodes'],
            json_encode($sec['cycles'], JSON_UNESCAPED_UNICODE),
            isset($sec['grading']) ? json_encode($sec['grading'], JSON_UNESCAPED_UNICODE) : campus_default_grading(),
            $sec['ordering'], $enabled,
        ]);
        $sectionId = (int) $pdo->lastInsertId();
        if ($sectionId === 0) {
            $q = $pdo->prepare('SELECT id FROM cmp_academic_sections WHERE tenant_id=? AND section_key=?');
            $q->execute([$tenantId, $sec['section_key']]);
            $sectionId = (int) ($q->fetchColumn() ?: 0);
        }
        if (!$enabled || $sectionId === 0) { continue; }

        $ordre = 0;
        foreach ($sec['cycles'] as $cyc) {
            foreach ($cyc['classes'] as $clsName) {
                $ordre++;
                $code = preg_replace('/[^A-Za-z0-9]/', '', $clsName);
                $stCls->execute([
                    $tenantId, $sectionId, $sec['sous_systeme'], $sec['filiere'],
                    $code, $clsName, $cyc['key'], $ordre,
                ]);
            }
        }
    }
}
