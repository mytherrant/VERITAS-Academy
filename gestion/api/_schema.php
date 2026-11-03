<?php
/**
 * gestion/api/_schema.php — Schéma de la base ET registre de synchronisation.
 * © 2024-2026 Jacques Miterand TAKOU (Mythe Errant). Tous droits réservés.
 *
 * Le schéma est décrit ici une seule fois ; install.php en tire le DDL propre
 * au moteur (MySQL en ligne, SQLite sur le poste) et AJOUTE les colonnes
 * manquantes aux tables existantes : chaque étape du projet n'a qu'à compléter
 * ce fichier puis relancer l'installation.
 *
 * Types : id (clé VARCHAR(40), créée par le téléphone pour marcher hors ligne)
 *         ref (référence à un id) · str:N · text · int · int:D (défaut D) · bigint
 * Dates et heures en texte « AAAA-MM-JJ », « HH:MM », « AAAA-MM-JJ HH:MM:SS » :
 * comparables tels quels et identiques dans les deux moteurs.
 */
declare(strict_types=1);

/** Colonnes communes à toute table synchronisée. */
const G_COLS_SYNC = ['rev' => 'bigint', 'supprime' => 'int', 'maj_par' => 'ref', 'maj_le' => 'str:19'];

function g_schema(): array {
    return [
        'g_centres' => ['cols' => [
            'id' => 'id', 'nom' => 'str:120', 'nom_court' => 'str:40', 'adresse' => 'str:255',
            'telephones' => 'str:120', 'devise' => 'str:120',
            'tolerance_retard_min' => 'int:5',   // au-delà : « en retard »
            'alerte_appel_min'     => 'int:15',  // appel non fait → responsable
            'alerte_direction_min' => 'int:30',  // appel toujours pas fait → admin
            'jour_echeance'        => 'int:10',  // « les paiements se font au plus tard le 10 du mois »
            'ordre' => 'int',
            // Modèles des messages aux parents ({eleve}, {parent}, {classe}, {date}, {horaire},
            // {debut}, {arrivee}, {minutes}, {centre}, {tel_centre}). Vide = modèle par défaut.
            'msg_absence' => 'text', 'msg_retard' => 'text', 'msg_relance' => 'text', 'msg_recu' => 'text',
            // Grace land : « Inscription 2 500 / 4 000 F avec Mon cahier de français » (0 = pas d'option).
            'inscription_option' => 'int', 'inscription_option_libelle' => 'str:120',
        ] + G_COLS_SYNC, 'index' => [['rev']]],

        'g_annees' => ['cols' => [
            'id' => 'id', 'libelle' => 'str:20', 'debut' => 'str:10', 'fin' => 'str:10',
            'mois_factures' => 'str:120',        // ex. « 10,11,12,1,2,3,4,5 »
            'active' => 'int',
        ] + G_COLS_SYNC, 'index' => [['rev']]],

        'g_actionnaires' => ['cols' => [
            'id' => 'id', 'centre_id' => 'ref', 'nom' => 'str:120', 'tel' => 'str:30',
            'part_centiemes' => 'int',           // 3333 = 33,33 %
            'utilisateur_id' => 'ref',
        ] + G_COLS_SYNC, 'index' => [['centre_id'], ['rev']]],

        'g_utilisateurs' => ['cols' => [
            'id' => 'id', 'identifiant' => 'str:60', 'nom' => 'str:120', 'tel' => 'str:30',
            'mdp_hash' => 'str:255', 'admin_global' => 'int', 'actif' => 'int:1',
            'matieres' => 'str:500',             // ids de g_matieres enseignées, séparés par des virgules
            'cree_le' => 'str:19', 'maj_le' => 'str:19',
        ], 'unique' => [['identifiant']]],

        'g_acces' => ['cols' => [
            'id' => 'id', 'utilisateur_id' => 'ref', 'centre_id' => 'ref', 'role' => 'str:20', 'cree_le' => 'str:19',
        ], 'unique' => [['utilisateur_id', 'centre_id']]],

        'g_sessions' => ['cols' => [
            'id' => 'id', 'jeton_hash' => 'str:64', 'utilisateur_id' => 'ref', 'appareil' => 'str:120',
            'ip' => 'str:45', 'cree_le' => 'str:19', 'expire_le' => 'str:19', 'vu_le' => 'str:19',
        ], 'unique' => [['jeton_hash']], 'index' => [['utilisateur_id']]],

        'g_journal' => ['cols' => [
            'id' => 'id', 'centre_id' => 'ref', 'utilisateur_id' => 'ref', 'identifiant' => 'str:60',
            'action' => 'str:40', 'entite' => 'str:40', 'entite_id' => 'str:80',
            'avant' => 'text', 'apres' => 'text', 'ip' => 'str:45', 'le' => 'str:19',
        ], 'index' => [['centre_id', 'le'], ['action', 'le']]],

        // Liste commune aux centres (un enseignant peut intervenir dans les deux).
        'g_matieres' => ['cols' => [
            'id' => 'id', 'nom' => 'str:80', 'ordre' => 'int',
        ] + G_COLS_SYNC, 'index' => [['rev']]],

        'g_classes' => ['cols' => [
            'id' => 'id', 'centre_id' => 'ref', 'nom' => 'str:60', 'niveau' => 'str:40', 'ordre' => 'int',
            'inscription' => 'int', 'mensualite' => 'int',      // FCFA ; fixés par le responsable ou l'admin
        ] + G_COLS_SYNC, 'index' => [['centre_id'], ['rev']]],

        // Jours et horaires d'ouverture des cours. niveaux vide = tous les niveaux qui
        // n'ont pas de plage propre (à Germinal, les 3e ont leurs jours à eux).
        'g_horaires' => ['cols' => [
            'id' => 'id', 'centre_id' => 'ref', 'jour' => 'int', 'debut' => 'str:5', 'fin' => 'str:5', 'niveaux' => 'str:120',
        ] + G_COLS_SYNC, 'index' => [['centre_id'], ['rev']]],

        // Emploi du temps : un créneau hebdomadaire. jour 1 = lundi … 7 = dimanche.
        'g_creneaux' => ['cols' => [
            'id' => 'id', 'centre_id' => 'ref', 'classe_id' => 'ref', 'matiere_id' => 'ref', 'enseignant_id' => 'ref',
            'jour' => 'int', 'debut' => 'str:5', 'fin' => 'str:5', 'salle' => 'str:40',
        ] + G_COLS_SYNC, 'index' => [['centre_id'], ['rev'], ['enseignant_id', 'jour']]],

        // Fiche d'inscription. Le matricule est posé par le SERVEUR à la première
        // synchronisation (séquence par centre et par année) : deux téléphones hors
        // ligne ne peuvent pas attribuer le même numéro.
        'g_eleves' => ['cols' => [
            'id' => 'id', 'centre_id' => 'ref', 'classe_id' => 'ref', 'matricule' => 'str:20',
            'nom' => 'str:80', 'prenoms' => 'str:120', 'sexe' => 'str:1', 'date_naissance' => 'str:10',
            'etablissement' => 'str:120', 'matieres' => 'str:500', 'tel_eleve' => 'str:20', 'quartier' => 'str:120',
            'parent_nom' => 'str:120', 'parent_lien' => 'str:20', 'parent_tel' => 'str:20', 'parent_whatsapp' => 'str:20',
            'parent2_nom' => 'str:120', 'parent2_tel' => 'str:20',
            'date_inscription' => 'str:10', 'statut' => 'str:12', 'observations' => 'text',
            'doublon_ok' => 'int',              // homonyme confirmé (frères et sœurs, vrais homonymes)
            // Tarif particulier (0 = celui de la classe) et suivi des relances.
            'inscription_due' => 'int', 'mensualite_due' => 'int', 'remise_motif' => 'str:120',
            'date_depart' => 'str:10', 'relance_le' => 'str:40'
        ] + G_COLS_SYNC, 'index' => [['centre_id'], ['rev'], ['classe_id']]],

        // Appel : une feuille par classe et par jour (id déterministe « sa » + AAAAMMJJ + classe,
        // pour que deux téléphones hors ligne ouvrent la MÊME feuille). debut/fin figés
        // à l'ouverture : l'historique ne bouge pas si l'emploi du temps change.
        'g_seances' => ['cols' => [
            'id' => 'id', 'centre_id' => 'ref', 'classe_id' => 'ref', 'date' => 'str:10', 'debut' => 'str:5', 'fin' => 'str:5',
            'statut' => 'str:10', 'contenu' => 'text', 'travail' => 'text', 'ouverte_par' => 'ref', 'close_le' => 'str:19',
        ] + G_COLS_SYNC, 'index' => [['centre_id', 'date'], ['rev']]],

        // Une ligne par élève et par feuille. retard_min et le statut présent/retard sont
        // recalculés par le SERVEUR (heure d'arrivée, début de la feuille, tolérance du centre).
        'g_presences' => ['cols' => [
            'id' => 'id', 'centre_id' => 'ref', 'seance_id' => 'ref', 'eleve_id' => 'ref', 'date' => 'str:10',
            'statut' => 'str:10', 'arrivee' => 'str:5', 'depart' => 'str:5', 'retard_min' => 'int', 'motif' => 'str:200',
            'notifie' => 'str:40',              // « AAAA-MM-JJ HH:MM:SS whatsapp|sms » : message préparé au parent
        ] + G_COLS_SYNC, 'index' => [['seance_id'], ['eleve_id'], ['centre_id', 'date'], ['rev']], 'unique' => [['seance_id', 'eleve_id']]],

        // Versements : jamais modifiés ni supprimés. Le numéro de reçu est posé par le
        // SERVEUR (séquence par centre et par année) ; une erreur s'annule, avec un motif.
        'g_paiements' => ['cols' => [
            'id' => 'id', 'centre_id' => 'ref', 'eleve_id' => 'ref', 'numero' => 'str:20', 'montant' => 'int',
            'date' => 'str:10', 'mode' => 'str:12', 'reference' => 'str:60', 'note' => 'str:200',
            'encaisse_par' => 'ref', 'annule' => 'int', 'motif_annulation' => 'str:200', 'annule_par' => 'ref',
            'envoye_le' => 'str:40',            // reçu envoyé au parent (« AAAA-MM-JJ HH:MM:SS canal »)
        ] + G_COLS_SYNC, 'index' => [['centre_id', 'date'], ['eleve_id'], ['rev']]],

        // Dépenses : saisies par le centre, validées par un responsable (pas le sien) ou l'admin.
        'g_depenses' => ['cols' => [
            'id' => 'id', 'centre_id' => 'ref', 'date' => 'str:10', 'libelle' => 'str:160', 'categorie' => 'str:20',
            'montant' => 'int', 'mode' => 'str:12', 'beneficiaire' => 'str:120', 'statut' => 'str:12',
            'saisie_par' => 'ref', 'valide_par' => 'ref', 'valide_le' => 'str:19', 'motif_refus' => 'str:200',
        ] + G_COLS_SYNC, 'index' => [['centre_id', 'date'], ['rev']]],

        // Opérations déjà appliquées : un envoi répété (réseau coupé au mauvais
        // moment) n'est jamais appliqué deux fois.
        'g_ops' => ['cols' => [
            'id' => 'id', 'utilisateur_id' => 'ref', 'recu_le' => 'str:19',
        ]],
    ];
}

/**
 * Registre de synchronisation : ce que le téléphone peut tirer et pousser.
 *   portee  : colonne qui porte le centre ('id' pour g_centres), null = commun
 *   lire    : capacité requise pour lire ; 'tous' = tout compte connecté
 *   ecrire  : capacité requise pour écrire ; 'admin' = admin global seulement
 *   champs  : colonnes modifiables par le téléphone (le reste est ignoré)
 */
function g_registre(): array {
    return [
        'centres' => [
            'table' => 'g_centres', 'portee' => 'id', 'lire' => 'centre.voir', 'ecrire' => 'admin',
            'champs' => ['nom', 'nom_court', 'adresse', 'telephones', 'devise', 'tolerance_retard_min',
                         'alerte_appel_min', 'alerte_direction_min', 'jour_echeance', 'ordre', 'msg_absence', 'msg_retard',
                         'msg_relance', 'msg_recu', 'inscription_option', 'inscription_option_libelle'],
        ],
        'annees' => [
            'table' => 'g_annees', 'portee' => null, 'lire' => 'tous', 'ecrire' => 'admin',
            'champs' => ['libelle', 'debut', 'fin', 'mois_factures', 'active'],
        ],
        'matieres' => [
            'table' => 'g_matieres', 'portee' => null, 'lire' => 'tous', 'ecrire' => 'admin',
            'champs' => ['nom', 'ordre'],
        ],
        'classes' => [
            'table' => 'g_classes', 'portee' => 'centre_id', 'lire' => 'centre.voir', 'ecrire' => 'emploi.gerer',
            'champs' => ['centre_id', 'nom', 'niveau', 'ordre', 'inscription', 'mensualite'],
        ],
        'horaires' => [
            'table' => 'g_horaires', 'portee' => 'centre_id', 'lire' => 'centre.voir', 'ecrire' => 'emploi.gerer',
            'champs' => ['centre_id', 'jour', 'debut', 'fin', 'niveaux'],
        ],
        'creneaux' => [
            'table' => 'g_creneaux', 'portee' => 'centre_id', 'lire' => 'centre.voir', 'ecrire' => 'emploi.gerer',
            'champs' => ['centre_id', 'classe_id', 'matiere_id', 'enseignant_id', 'jour', 'debut', 'fin', 'salle'],
        ],
        'eleves' => [
            'table' => 'g_eleves', 'portee' => 'centre_id', 'lire' => 'centre.voir', 'ecrire' => 'eleves.gerer',
            'champs' => ['centre_id', 'classe_id', 'nom', 'prenoms', 'sexe', 'date_naissance', 'etablissement', 'matieres',
                         'tel_eleve', 'quartier', 'parent_nom', 'parent_lien', 'parent_tel', 'parent_whatsapp', 'parent2_nom',
                         'parent2_tel', 'date_inscription', 'statut', 'observations', 'doublon_ok',
                         'inscription_due', 'mensualite_due', 'remise_motif', 'date_depart', 'relance_le'],
        ],
        'seances' => [
            'table' => 'g_seances', 'portee' => 'centre_id', 'lire' => 'centre.voir', 'ecrire' => 'appel.faire',
            'champs' => ['centre_id', 'classe_id', 'date', 'debut', 'fin', 'statut', 'contenu', 'travail', 'ouverte_par', 'close_le'],
        ],
        'presences' => [
            'table' => 'g_presences', 'portee' => 'centre_id', 'lire' => 'centre.voir', 'ecrire' => 'appel.faire',
            'champs' => ['centre_id', 'seance_id', 'eleve_id', 'date', 'statut', 'arrivee', 'depart', 'motif', 'notifie'],
        ],
        'paiements' => [
            'table' => 'g_paiements', 'portee' => 'centre_id', 'lire' => 'paiements.voir', 'ecrire' => 'paiements.encaisser',
            'champs' => ['centre_id', 'eleve_id', 'montant', 'date', 'mode', 'reference', 'note', 'annule', 'motif_annulation', 'envoye_le'],
        ],
        'depenses' => [
            'table' => 'g_depenses', 'portee' => 'centre_id', 'lire' => 'depenses.voir', 'ecrire' => 'depenses.saisir',
            'champs' => ['centre_id', 'date', 'libelle', 'categorie', 'montant', 'mode', 'beneficiaire', 'statut', 'motif_refus'],
        ],
        'actionnaires' => [
            'table' => 'g_actionnaires', 'portee' => 'centre_id', 'lire' => 'finances.voir', 'ecrire' => 'admin',
            'champs' => ['centre_id', 'nom', 'tel', 'part_centiemes', 'utilisateur_id'],
        ],
    ];
}

/** Types déclaratifs → type SQL du moteur. */
function g_type_sql(string $t, string $moteur): string {
    if ($t === 'id')     { return 'VARCHAR(40) NOT NULL PRIMARY KEY'; }
    if ($t === 'ref')    { return 'VARCHAR(40) NULL'; }
    if ($t === 'text')   { return 'TEXT NULL'; }
    if ($t === 'bigint') { return 'BIGINT NOT NULL DEFAULT 0'; }
    if ($t === 'int')    { return 'INTEGER NOT NULL DEFAULT 0'; }
    if (strncmp($t, 'int:', 4) === 0) { return 'INTEGER NOT NULL DEFAULT ' . (int) substr($t, 4); }
    if (strncmp($t, 'str:', 4) === 0) { return 'VARCHAR(' . (int) substr($t, 4) . ') NULL'; }
    throw new RuntimeException('Type inconnu : ' . $t);
}

/**
 * Crée les tables, ajoute les colonnes manquantes et les index. Idempotent.
 * Renvoie le compte rendu [tables, colonnes_ajoutees, erreurs].
 */
function g_installer_schema(PDO $pdo): array {
    $moteur = $pdo->getAttribute(PDO::ATTR_DRIVER_NAME);
    $suffixe = $moteur === 'mysql' ? ' ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci' : '';
    $rapport = ['tables' => [], 'colonnes_ajoutees' => [], 'erreurs' => []];
    foreach (g_schema() as $table => $def) {
        $cols = [];
        foreach ($def['cols'] as $c => $t) { $cols[] = $c . ' ' . g_type_sql($t, $moteur); }
        $pdo->exec('CREATE TABLE IF NOT EXISTS ' . $table . ' (' . implode(', ', $cols) . ')' . $suffixe);
        $rapport['tables'][] = $table;

        $existantes = [];
        if ($moteur === 'mysql') {
            foreach ($pdo->query('SHOW COLUMNS FROM ' . $table)->fetchAll() as $r) { $existantes[] = $r['Field']; }
        } else {
            foreach ($pdo->query('PRAGMA table_info(' . $table . ')')->fetchAll() as $r) { $existantes[] = $r['name']; }
        }
        foreach ($def['cols'] as $c => $t) {
            if (!in_array($c, $existantes, true)) {
                $pdo->exec('ALTER TABLE ' . $table . ' ADD COLUMN ' . $c . ' ' . g_type_sql($t, $moteur));
                $rapport['colonnes_ajoutees'][] = $table . '.' . $c;
            }
        }
        foreach (['index' => 'INDEX', 'unique' => 'UNIQUE INDEX'] as $cle => $mot) {
            foreach ($def[$cle] ?? [] as $champs) {
                $nom = ($cle === 'unique' ? 'ux_' : 'ix_') . $table . '_' . implode('_', $champs);
                try {
                    $pdo->exec('CREATE ' . $mot . ' ' . $nom . ' ON ' . $table . ' (' . implode(', ', $champs) . ')');
                } catch (Throwable $e) {
                    // « existe déjà » attendu à la 2e installation ; le reste est remonté.
                    if (!preg_match('/exist|Duplicate key name/i', $e->getMessage())) {
                        $rapport['erreurs'][] = $nom . ' : ' . mb_substr($e->getMessage(), 0, 160);
                    }
                }
            }
        }
    }
    return $rapport;
}
