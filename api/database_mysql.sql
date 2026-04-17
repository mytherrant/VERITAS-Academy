-- ============================================================
-- VÉRITAS Academy — Base de données MySQL (pour LWS)
-- À exécuter dans phpMyAdmin
-- ============================================================

-- NOTE : ne pas utiliser CREATE DATABASE ni USE sur LWS
-- Sélectionnez la base verit2781684 dans phpMyAdmin avant d'importer

-- ── Données principales (synchronisées depuis localStorage) ──

CREATE TABLE IF NOT EXISTS sync_snapshots (
    id INT AUTO_INCREMENT PRIMARY KEY,
    data LONGTEXT NOT NULL,                -- JSON complet de DB
    created_by VARCHAR(100),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    size_bytes INT DEFAULT 0
) ENGINE=InnoDB;

-- ── Fichiers uploadés (vidéos, PDFs, épreuves) ──

CREATE TABLE IF NOT EXISTS files (
    id VARCHAR(20) PRIMARY KEY,
    filename VARCHAR(500) NOT NULL,
    original_name VARCHAR(500),
    mime_type VARCHAR(100),
    size_bytes INT DEFAULT 0,
    category VARCHAR(50),                  -- 'video', 'epreuve', 'cours', 'ressource', 'image'
    title VARCHAR(500),
    description TEXT,
    classe VARCHAR(30),
    matiere VARCHAR(100),
    uploaded_by VARCHAR(100),
    public_url VARCHAR(1000),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

CREATE INDEX idx_files_category ON files(category);
CREATE INDEX idx_files_classe ON files(classe);
CREATE INDEX idx_files_matiere ON files(matiere);

-- ── Élèves ──

CREATE TABLE IF NOT EXISTS students (
    id VARCHAR(20) PRIMARY KEY,
    matricule VARCHAR(30) UNIQUE NOT NULL,
    nom VARCHAR(100) NOT NULL,
    prenom VARCHAR(100) NOT NULL,
    sexe CHAR(1),
    date_naissance VARCHAR(20),
    classe VARCHAR(30) NOT NULL,
    tel VARCHAR(50),
    parent_nom VARCHAR(200),
    parent_tel VARCHAR(50),
    frais_scolarite INT DEFAULT 0,
    date_inscription VARCHAR(20),
    statut VARCHAR(30) DEFAULT 'En attente',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- ── Enseignants ──

CREATE TABLE IF NOT EXISTS teachers (
    id VARCHAR(20) PRIMARY KEY,
    matricule VARCHAR(30) UNIQUE,
    nom VARCHAR(100) NOT NULL,
    prenom VARCHAR(100) NOT NULL,
    matiere VARCHAR(100),
    grade VARCHAR(100),
    username VARCHAR(100) UNIQUE,
    tel VARCHAR(50),
    salaire INT DEFAULT 0,
    statut VARCHAR(30) DEFAULT 'Actif',
    classes JSON,
    titulaire VARCHAR(30),
    password_hash VARCHAR(255),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- ── Notes ──

CREATE TABLE IF NOT EXISTS grades (
    id VARCHAR(20) PRIMARY KEY,
    student_id VARCHAR(20) NOT NULL,
    student_name VARCHAR(200),
    student_mat VARCHAR(30),
    classe VARCHAR(30),
    matiere VARCHAR(100) NOT NULL,
    note_1 DECIMAL(5,2),
    note_2 DECIMAL(5,2),
    coefficient INT DEFAULT 1,
    trimestre VARCHAR(30),
    enseignant VARCHAR(200),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE INDEX idx_grades_student ON grades(student_id);
CREATE INDEX idx_grades_classe ON grades(classe);

-- ── Paiements ──

CREATE TABLE IF NOT EXISTS payments (
    id VARCHAR(20) PRIMARY KEY,
    student_id VARCHAR(20),
    student_name VARCHAR(200),
    classe VARCHAR(30),
    mois VARCHAR(50),
    montant INT NOT NULL,
    mode_paiement VARCHAR(50),
    date_paiement VARCHAR(20),
    statut VARCHAR(30) DEFAULT 'En attente',
    reference VARCHAR(50) UNIQUE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE SET NULL
) ENGINE=InnoDB;

-- ── Absences ──

CREATE TABLE IF NOT EXISTS absences (
    id VARCHAR(20) PRIMARY KEY,
    student_id VARCHAR(20) NOT NULL,
    date_absence VARCHAR(20) NOT NULL,
    heures INT DEFAULT 0,
    matiere VARCHAR(100),
    motif TEXT,
    justifie BOOLEAN DEFAULT FALSE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- ── Contenus E-Learning ──

CREATE TABLE IF NOT EXISTS elearning_contenus (
    id VARCHAR(20) PRIMARY KEY,
    categorie_id VARCHAR(20),
    titre VARCHAR(500) NOT NULL,
    classe VARCHAR(30),
    matiere VARCHAR(100),
    sequence_name VARCHAR(100),
    prix INT DEFAULT 0,
    gratuit BOOLEAN DEFAULT FALSE,
    plans JSON,
    fichier_url TEXT,
    res_pedago VARCHAR(50),
    apercu TEXT,
    description TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- ============================================================
-- FIN DU SCHEMA
-- ============================================================
