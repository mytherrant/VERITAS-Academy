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
            'tresorier_id'         => 'ref',     // compte qui garde les fonds du centre et confirme les remises
            // Début des comptes (AAAA-MM-JJ) : l'argent d'avant (encaissé, dépensé, remis) ne compte plus pour les
            // partenaires ni pour la clôture ; il sert seulement à calculer ce que chaque élève doit encore. Vide = tout compte.
            'debut_comptes'        => 'str:10',
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

        // Remise de fonds au trésorier : le partenaire qui a encaissé (chez lui, près des
        // parents) remet l'argent ; le trésorier confirme l'avoir reçu, ou le conteste.
        'g_remises' => ['cols' => [
            'id' => 'id', 'centre_id' => 'ref', 'montant' => 'int', 'date' => 'str:10', 'mode' => 'str:12',
            'note' => 'str:200', 'remis_par' => 'ref', 'statut' => 'str:12',   // en_attente | confirmee | contestee
            'confirme_par' => 'ref', 'confirme_le' => 'str:19', 'motif' => 'str:200',
        ] + G_COLS_SYNC, 'index' => [['centre_id', 'date'], ['remis_par'], ['rev']]],

        // Espace « Équipe » des partenaires : messages (fil général ou commentaire attaché à une
        // dépense, une remise, une journée, un bilan, une tâche, une réunion), réunions à dates
        // proposées et disponibilités de chacun, tâches réparties.
        'g_messages' => ['cols' => [
            'id' => 'id', 'centre_id' => 'ref', 'fil' => 'str:60', 'texte' => 'str:1000',
            'auteur' => 'ref', 'cree_le' => 'str:19',
        ] + G_COLS_SYNC, 'index' => [['centre_id', 'fil'], ['rev']]],
        'g_sondages' => ['cols' => [
            'id' => 'id', 'centre_id' => 'ref', 'titre' => 'str:160', 'note' => 'str:400', 'lieu' => 'str:160',
            'options' => 'str:1000',   // JSON : ["2026-11-12 16:00", "2026-11-13", …]
            'statut' => 'str:10', 'choix' => 'str:20', 'evenement_id' => 'str:40', 'auteur' => 'ref', 'cree_le' => 'str:19',
        ] + G_COLS_SYNC, 'index' => [['centre_id'], ['rev']]],
        'g_dispos' => ['cols' => [
            'id' => 'id', 'centre_id' => 'ref', 'sondage_id' => 'str:40', 'utilisateur_id' => 'ref',
            'reponses' => 'str:1000',  // JSON : {"2026-11-12 16:00": "oui" | "peut" | "non"}
        ] + G_COLS_SYNC, 'index' => [['sondage_id'], ['rev']]],
        'g_taches' => ['cols' => [
            'id' => 'id', 'centre_id' => 'ref', 'titre' => 'str:160', 'note' => 'str:400', 'assigne_a' => 'ref',
            'echeance' => 'str:10', 'statut' => 'str:10', 'auteur' => 'ref', 'cree_le' => 'str:19', 'fait_le' => 'str:19',
        ] + G_COLS_SYNC, 'index' => [['centre_id', 'statut'], ['rev']]],

        // Clôture mensuelle : le 30 ou le 31, on arrête les comptes du mois et le partage entre
        // actionnaires ; le mois est ensuite verrouillé et un nouveau cycle commence. Totaux
        // recalculés par le serveur à la clôture (id « clo-<centre>-<AAAA-MM> »).
        'g_clotures' => ['cols' => [
            'id' => 'id', 'centre_id' => 'ref', 'mois' => 'str:7', 'recettes' => 'int', 'depenses' => 'int', 'paies' => 'int',
            'resultat' => 'int', 'parts' => 'str:2000', 'note' => 'str:400', 'clos_par' => 'ref', 'clos_le' => 'str:19',
        ] + G_COLS_SYNC, 'index' => [['centre_id', 'mois'], ['rev']]],

        // Agenda du centre : rencontres, rendez-vous, réunions de parents… Les échéances
        // de paiement ne sont pas stockées : le téléphone les déduit du jour d'échéance.
        'g_evenements' => ['cols' => [
            'id' => 'id', 'centre_id' => 'ref', 'titre' => 'str:160', 'type' => 'str:20',
            'date' => 'str:10', 'heure' => 'str:5', 'fin' => 'str:5', 'lieu' => 'str:160',
            'note' => 'str:400', 'rappel_min' => 'int',
        ] + G_COLS_SYNC, 'index' => [['centre_id', 'date'], ['rev']]],

        'g_actionnaires' => ['cols' => [
            'id' => 'id', 'centre_id' => 'ref', 'nom' => 'str:120', 'tel' => 'str:30',
            'part_centiemes' => 'int',           // 3333 = 33,33 %
            'utilisateur_id' => 'ref',
        ] + G_COLS_SYNC, 'index' => [['centre_id'], ['rev']]],

        'g_utilisateurs' => ['cols' => [
            'id' => 'id', 'identifiant' => 'str:60', 'nom' => 'str:120', 'tel' => 'str:30',
            'mdp_hash' => 'str:255', 'admin_global' => 'int', 'actif' => 'int:1',
            'matieres' => 'str:500',             // ids de g_matieres enseignées, séparés par des virgules
            'restrictions' => 'str:500',         // capacités retirées par l'admin (« caisse.corriger,tarifs.fixer »)
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
        ] + G_COLS_SYNC, 'index' => [['centre_id', 'date'], ['eleve_id'], ['rev']], 'unique' => [['centre_id', 'numero']]],

        // Dépenses : saisies par le centre, validées par un responsable (pas le sien) ou l'admin.
        'g_depenses' => ['cols' => [
            'id' => 'id', 'centre_id' => 'ref', 'date' => 'str:10', 'libelle' => 'str:160', 'categorie' => 'str:20',
            'montant' => 'int', 'mode' => 'str:12', 'beneficiaire' => 'str:120', 'statut' => 'str:12',
            'saisie_par' => 'ref', 'valide_par' => 'ref', 'valide_le' => 'str:19', 'motif_refus' => 'str:200',
            'justificatif' => 'str:40',          // « AAAA-MM-JJ HH:MM:SS » du dépôt de la photo ; vide = aucun
        ] + G_COLS_SYNC, 'index' => [['centre_id', 'date'], ['rev']]],

        // Contrat d'un enseignant dans un centre : à l'heure, à la séance ou au forfait mensuel
        // (retenue par absence pour le forfait). Un enseignant des deux centres a deux contrats.
        'g_contrats' => ['cols' => [
            'id' => 'id', 'centre_id' => 'ref', 'utilisateur_id' => 'ref', 'mode' => 'str:10', 'taux' => 'int',
            'retenue_absence' => 'int', 'actif' => 'int:1',
        ] + G_COLS_SYNC, 'index' => [['centre_id'], ['utilisateur_id'], ['rev']]],

        // Présence d'un enseignant à un créneau, un jour donné (id « pe » + AAAAMMJJ + créneau).
        // minutes et retard_min recalculés par le serveur ; un remplaçant touche les heures.
        'g_presences_ens' => ['cols' => [
            'id' => 'id', 'centre_id' => 'ref', 'creneau_id' => 'ref', 'enseignant_id' => 'ref', 'remplacant_id' => 'ref',
            'date' => 'str:10', 'statut' => 'str:10', 'arrivee' => 'str:5', 'depart' => 'str:5',
            'retard_min' => 'int', 'minutes' => 'int', 'note' => 'str:200',
        ] + G_COLS_SYNC, 'index' => [['centre_id', 'date'], ['enseignant_id'], ['remplacant_id'], ['rev']]],

        // Paies versées aux enseignants : comme les versements des élèves, jamais modifiées ;
        // une erreur s'annule avec un motif.
        'g_paies' => ['cols' => [
            'id' => 'id', 'centre_id' => 'ref', 'enseignant_id' => 'ref', 'mois' => 'str:7', 'montant' => 'int',
            'date' => 'str:10', 'mode' => 'str:12', 'note' => 'str:200', 'paye_par' => 'ref',
            'annule' => 'int', 'motif_annulation' => 'str:200',
            'presence_id' => 'str:40',          // cours payé juste après (pointage de l'enseignant) ; vide = paie du mois
        ] + G_COLS_SYNC, 'index' => [['centre_id', 'mois'], ['enseignant_id'], ['presence_id'], ['rev']]],

        // Tranches de numéros de reçu réservées par un compte : le téléphone numérote ses
        // reçus HORS LIGNE sans collision avec un autre appareil.
        'g_tranches' => ['cols' => [
            'id' => 'id', 'centre_id' => 'ref', 'utilisateur_id' => 'ref', 'prefixe' => 'str:4',
            'debut' => 'int', 'fin' => 'int', 'cree_le' => 'str:19',
        ], 'index' => [['centre_id', 'prefixe'], ['utilisateur_id']], 'unique' => [['centre_id', 'prefixe', 'debut']]],

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
                         'msg_relance', 'msg_recu', 'inscription_option', 'inscription_option_libelle', 'tresorier_id', 'debut_comptes'],
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
            'champs' => ['centre_id', 'eleve_id', 'numero', 'montant', 'date', 'mode', 'reference', 'note', 'annule', 'motif_annulation', 'envoye_le'],
        ],
        'depenses' => [
            'table' => 'g_depenses', 'portee' => 'centre_id', 'lire' => 'depenses.voir', 'ecrire' => 'depenses.saisir',
            'champs' => ['centre_id', 'date', 'libelle', 'categorie', 'montant', 'mode', 'beneficiaire', 'statut', 'motif_refus'],
        ],
        'contrats' => [
            // Lus aussi par qui tient la caisse : il paie l'enseignant après le cours, au taux du contrat.
            'table' => 'g_contrats', 'portee' => 'centre_id', 'lire' => 'paiements.voir', 'ecrire' => 'enseignants.gerer', 'proprio' => 'utilisateur_id',
            'champs' => ['centre_id', 'utilisateur_id', 'mode', 'taux', 'retenue_absence', 'actif'],
        ],
        'presences_ens' => [
            'table' => 'g_presences_ens', 'portee' => 'centre_id', 'lire' => 'centre.voir', 'ecrire' => 'appel.faire',
            'champs' => ['centre_id', 'creneau_id', 'enseignant_id', 'remplacant_id', 'date', 'statut', 'arrivee', 'depart', 'note'],
        ],
        'paies' => [
            // Lues par qui voit la caisse (elles en sortent) ; écrites par qui encaisse : le partenaire présent
            // paie l'enseignant juste après le cours. Les paies du mois restent au responsable (voir g_valider_enseignants).
            'table' => 'g_paies', 'portee' => 'centre_id', 'lire' => 'paiements.voir', 'ecrire' => 'paiements.encaisser', 'proprio' => 'enseignant_id',
            'champs' => ['centre_id', 'enseignant_id', 'mois', 'montant', 'date', 'mode', 'note', 'annule', 'motif_annulation', 'presence_id'],
        ],
        'remises' => [
            'table' => 'g_remises', 'portee' => 'centre_id', 'lire' => 'paiements.voir', 'ecrire' => 'paiements.voir',
            'champs' => ['centre_id', 'montant', 'date', 'mode', 'note', 'statut', 'motif'],
        ],
        // Réservé aux partenaires (qui voient la caisse) : les enseignants n'y ont pas accès.
        'messages' => [
            'table' => 'g_messages', 'portee' => 'centre_id', 'lire' => 'paiements.voir', 'ecrire' => 'paiements.voir',
            'champs' => ['centre_id', 'fil', 'texte'],
        ],
        'sondages' => [
            'table' => 'g_sondages', 'portee' => 'centre_id', 'lire' => 'paiements.voir', 'ecrire' => 'paiements.voir',
            'champs' => ['centre_id', 'titre', 'note', 'lieu', 'options', 'statut', 'choix', 'evenement_id'],
        ],
        'dispos' => [
            'table' => 'g_dispos', 'portee' => 'centre_id', 'lire' => 'paiements.voir', 'ecrire' => 'paiements.voir',
            'champs' => ['centre_id', 'sondage_id', 'reponses'],
        ],
        'taches' => [
            'table' => 'g_taches', 'portee' => 'centre_id', 'lire' => 'paiements.voir', 'ecrire' => 'paiements.voir',
            'champs' => ['centre_id', 'titre', 'note', 'assigne_a', 'echeance', 'statut'],
        ],
        'clotures' => [
            'table' => 'g_clotures', 'portee' => 'centre_id', 'lire' => 'paiements.voir', 'ecrire' => 'caisse.corriger',
            'champs' => ['centre_id', 'mois', 'parts', 'note'],
        ],
        'evenements' => [
            'table' => 'g_evenements', 'portee' => 'centre_id', 'lire' => 'centre.voir', 'ecrire' => 'agenda.gerer',
            'champs' => ['centre_id', 'titre', 'type', 'date', 'heure', 'fin', 'lieu', 'note', 'rappel_min'],
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

/**
 * Migration automatique : après un déploiement qui ajoute une table ou une colonne,
 * le premier appel à l'API l'applique (sans relancer install.php). Une empreinte du
 * schéma, gardée dans data/, évite de recommencer à chaque appel. Rien ne se fait
 * tant que l'application n'est pas installée (install.php crée aussi les données).
 */
function g_schema_a_jour(): void {
    try {
        $empreinte = substr(hash('sha256', json_encode(g_schema())), 0, 16);
        $fichier = __DIR__ . '/data/.schema';
        if (@file_get_contents($fichier) === $empreinte) { return; }
        $pdo = g_pdo();
        try { $pdo->query('SELECT 1 FROM g_utilisateurs LIMIT 1'); } catch (Throwable $e) { return; }
        $r = g_installer_schema($pdo);
        if (!$r['erreurs']) { @file_put_contents($fichier, $empreinte, LOCK_EX); }
        else { error_log('[gestion][schema] ' . implode(' ; ', $r['erreurs'])); }
    } catch (Throwable $e) {
        error_log('[gestion][schema] ' . $e->getMessage());
    }
}
