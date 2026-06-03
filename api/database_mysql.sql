-- ============================================================
-- VÉRITAS Academy — Base de données MySQL (LWS)  ·  schéma "pro"
-- © 2024-2026 Jacques Miterand TAKOU (Mythe Errant). Tous droits réservés.
-- Œuvre protégée — Loi n° 2000/011 + Convention de Berne.
--
-- À IMPORTER dans phpMyAdmin (base verit2781684) :
--   1. Sélectionnez la base verit2781684
--   2. Onglet « Importer » → ce fichier → Exécuter
--   (Ne PAS utiliser CREATE DATABASE ni USE sur LWS — la base existe déjà.)
--
-- Rôle : miroir relationnel DURABLE et REQUÊTABLE des données VÉRITAS, alimenté
-- par api/db_sql.php (upserts idempotents) après chaque sauvegarde admin. Le
-- fichier JSON (data/veritas_db.json) reste la source live ; MySQL est le socle
-- "base de données solide" (rapports, recouvrement, durabilité). La table
-- sync_snapshots conserve en plus le JSON COMPLET horodaté (filet : rien n'est
-- jamais perdu, même les entités non modélisées relationnellement).
--
-- Toutes les tables : InnoDB + utf8mb4 (accents/emoji sûrs).
-- ============================================================

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 1;

-- ── Snapshots : JSON complet de la base, horodaté (filet de récupération) ──
CREATE TABLE IF NOT EXISTS sync_snapshots (
    id          INT AUTO_INCREMENT PRIMARY KEY,
    data        LONGTEXT NOT NULL,                 -- JSON complet de DB (UTF-8)
    rev         INT DEFAULT 0,                      -- révision monotone (méta)
    last_modified BIGINT DEFAULT 0,                 -- DB.lastModified (ms epoch)
    created_by  VARCHAR(100),
    size_bytes  INT DEFAULT 0,
    created_at  DATETIME DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_snap_created (created_at),
    INDEX idx_snap_rev (rev)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ── Fichiers uploadés (vidéos, PDFs, épreuves, images) ──
CREATE TABLE IF NOT EXISTS files (
    id            VARCHAR(40) PRIMARY KEY,
    filename      VARCHAR(500) NOT NULL,
    original_name VARCHAR(500),
    mime_type     VARCHAR(100),
    size_bytes    INT DEFAULT 0,
    category      VARCHAR(50),
    title         VARCHAR(500),
    description   TEXT,
    classe        VARCHAR(40),
    matiere       VARCHAR(100),
    uploaded_by   VARCHAR(100),
    public_url    VARCHAR(1000),
    created_at    DATETIME DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_files_category (category),
    INDEX idx_files_classe (classe),
    INDEX idx_files_matiere (matiere)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ── Élèves ──
CREATE TABLE IF NOT EXISTS students (
    id              VARCHAR(40) PRIMARY KEY,
    matricule       VARCHAR(40),
    nom             VARCHAR(120),
    prenom          VARCHAR(120),
    sexe            CHAR(1),
    date_naissance  VARCHAR(20),
    classe          VARCHAR(40),
    tel             VARCHAR(50),
    parent_nom      VARCHAR(200),
    parent_tel      VARCHAR(50),
    frais_scolarite INT DEFAULT 0,
    date_inscription VARCHAR(20),
    statut          VARCHAR(40) DEFAULT 'En attente',
    photo_url       VARCHAR(1000),
    created_at      DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at      DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_students_mat (matricule),
    INDEX idx_students_classe (classe)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ── Enseignants ──
CREATE TABLE IF NOT EXISTS teachers (
    id          VARCHAR(40) PRIMARY KEY,
    matricule   VARCHAR(40),
    nom         VARCHAR(120),
    prenom      VARCHAR(120),
    matiere     VARCHAR(120),
    grade       VARCHAR(120),
    username    VARCHAR(120),
    tel         VARCHAR(50),
    salaire     INT DEFAULT 0,
    statut      VARCHAR(40) DEFAULT 'Actif',
    classes     JSON,
    titulaire   VARCHAR(40),
    password_hash VARCHAR(255),
    created_at  DATETIME DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_teachers_user (username)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ── Comptes élèves (login app) — liés à students.id via eid ──
CREATE TABLE IF NOT EXISTS student_accounts (
    id          VARCHAR(40) PRIMARY KEY,
    user        VARCHAR(120),               -- identifiant de connexion
    eid         VARCHAR(40),                -- → students.id
    password_hash VARCHAR(255),             -- hash S256$ (jamais en clair)
    plans       JSON,
    last_login  VARCHAR(40),
    created_at  DATETIME DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_stuacc_user (user),
    INDEX idx_stuacc_eid (eid)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ── Comptes visiteurs inscrits ──
CREATE TABLE IF NOT EXISTS visitor_accounts (
    id          VARCHAR(40) PRIMARY KEY,
    user        VARCHAR(120),
    nom         VARCHAR(120),
    prenom      VARCHAR(120),
    classe      VARCHAR(40),
    tel         VARCHAR(50),
    password_hash VARCHAR(255),
    plans       JSON,
    statut      VARCHAR(40) DEFAULT 'actif',
    last_login  VARCHAR(40),
    created_at  DATETIME DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_visacc_user (user)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ── Notes ──
CREATE TABLE IF NOT EXISTS grades (
    id            VARCHAR(40) PRIMARY KEY,
    student_id    VARCHAR(40),
    student_name  VARCHAR(200),
    student_mat   VARCHAR(40),
    classe        VARCHAR(40),
    matiere       VARCHAR(120),
    note_1        DECIMAL(5,2),
    note_2        DECIMAL(5,2),
    coefficient   INT DEFAULT 1,
    trimestre     VARCHAR(40),
    enseignant    VARCHAR(200),
    created_at    DATETIME DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_grades_student (student_id),
    INDEX idx_grades_classe (classe),
    INDEX idx_grades_tri (trimestre)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ── Paiements ──
CREATE TABLE IF NOT EXISTS payments (
    id            VARCHAR(40) PRIMARY KEY,
    student_id    VARCHAR(40),
    student_name  VARCHAR(200),
    classe        VARCHAR(40),
    mois          VARCHAR(50),
    montant       INT NOT NULL DEFAULT 0,
    mode_paiement VARCHAR(50),
    date_paiement VARCHAR(20),
    statut        VARCHAR(40) DEFAULT 'En attente',
    reference     VARCHAR(80),
    created_at    DATETIME DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_payments_student (student_id),
    INDEX idx_payments_statut (statut),
    INDEX idx_payments_ref (reference)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ── Absences ──
CREATE TABLE IF NOT EXISTS absences (
    id            VARCHAR(40) PRIMARY KEY,
    student_id    VARCHAR(40),
    date_absence  VARCHAR(20),
    heures        INT DEFAULT 0,
    matiere       VARCHAR(120),
    motif         TEXT,
    justifie      TINYINT(1) DEFAULT 0,
    created_at    DATETIME DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_absences_student (student_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ── Devoirs (énoncés proposés par les enseignants) ──
CREATE TABLE IF NOT EXISTS devoirs (
    id          VARCHAR(40) PRIMARY KEY,
    titre       VARCHAR(500),
    classe      VARCHAR(40),
    matiere     VARCHAR(120),
    enonce      TEXT,
    echeance    VARCHAR(40),
    teacher_id  VARCHAR(40),
    created_at  DATETIME DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_devoirs_classe (classe)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ── Soumissions de devoirs (élèves) ──
CREATE TABLE IF NOT EXISTS submissions (
    id          VARCHAR(40) PRIMARY KEY,
    student_id  VARCHAR(40),               -- eid
    dvid        VARCHAR(40),               -- → devoirs.id
    texte       MEDIUMTEXT,
    fichier_url VARCHAR(1000),
    note        DECIMAL(5,2),
    date_soumission VARCHAR(40),
    created_at  DATETIME DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_sub_student (student_id),
    INDEX idx_sub_dvid (dvid)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ── Manuels / boutique ──
CREATE TABLE IF NOT EXISTS books (
    id          VARCHAR(40) PRIMARY KEY,
    titre       VARCHAR(500),
    auteur      VARCHAR(200),
    classe      VARCHAR(40),
    prix        INT DEFAULT 0,
    stock       INT DEFAULT 0,
    vendu       INT DEFAULT 0,
    pages       INT DEFAULT 0,
    description TEXT,
    cover_url   VARCHAR(1000),
    fichier_url VARCHAR(1000),
    created_at  DATETIME DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_books_classe (classe)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ── Contenus E-Learning ──
CREATE TABLE IF NOT EXISTS elearning_contenus (
    id            VARCHAR(40) PRIMARY KEY,
    categorie_id  VARCHAR(40),
    titre         VARCHAR(500),
    classe        VARCHAR(40),
    matiere       VARCHAR(120),
    sequence_name VARCHAR(120),
    prix          INT DEFAULT 0,
    gratuit       TINYINT(1) DEFAULT 0,
    plans         JSON,
    fichier_url   TEXT,
    res_pedago    VARCHAR(50),
    apercu        TEXT,
    description   TEXT,
    created_at    DATETIME DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_elc_classe (classe),
    INDEX idx_elc_matiere (matiere)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ── Abonnements e-learning (souscriptions actives) ──
CREATE TABLE IF NOT EXISTS elearning_abonnements (
    id          VARCHAR(40) PRIMARY KEY,
    account_id  VARCHAR(40),
    plan_id     VARCHAR(40),
    statut      VARCHAR(40),
    date_debut  VARCHAR(40),
    date_fin    VARCHAR(40),
    created_at  DATETIME DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_abo_account (account_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ── Tentatives de paiement (suivi) ──
CREATE TABLE IF NOT EXISTS pay_attempts (
    id          VARCHAR(40) PRIMARY KEY,
    ref         VARCHAR(80),
    montant     INT DEFAULT 0,
    label       VARCHAR(500),
    methode     VARCHAR(50),
    statut      VARCHAR(40) DEFAULT 'pending',
    account_id  VARCHAR(40),
    created_at  DATETIME DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_payatt_ref (ref),
    INDEX idx_payatt_statut (statut)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- FIN DU SCHEMA  (16 tables — InnoDB / utf8mb4)
-- ============================================================
