-- ============================================================
-- VÉRITAS Academy — Base de données PostgreSQL
-- Version : 1.0
-- Date : 2026-04-16
-- Description : Schéma complet pour le déploiement en ligne
-- ============================================================

-- Supprimer les tables existantes (dans l'ordre des dépendances)
DROP TABLE IF EXISTS payment_webhooks CASCADE;
DROP TABLE IF EXISTS pay_attempts CASCADE;
DROP TABLE IF EXISTS visitor_orders CASCADE;
DROP TABLE IF EXISTS book_purchases CASCADE;
DROP TABLE IF EXISTS book_reviews CASCADE;
DROP TABLE IF EXISTS elearning_subscriptions CASCADE;
DROP TABLE IF EXISTS elearning_orders CASCADE;
DROP TABLE IF EXISTS elearning_downloads CASCADE;
DROP TABLE IF EXISTS submissions CASCADE;
DROP TABLE IF EXISTS devoirs CASCADE;
DROP TABLE IF EXISTS grades CASCADE;
DROP TABLE IF EXISTS absences CASCADE;
DROP TABLE IF EXISTS payments CASCADE;
DROP TABLE IF EXISTS teacher_hours CASCADE;
DROP TABLE IF EXISTS schedule_items CASCADE;
DROP TABLE IF EXISTS depenses CASCADE;
DROP TABLE IF EXISTS notifications CASCADE;
DROP TABLE IF EXISTS announcements CASCADE;
DROP TABLE IF EXISTS orientation_demandes CASCADE;
DROP TABLE IF EXISTS promo_codes CASCADE;
DROP TABLE IF EXISTS citations CASCADE;
DROP TABLE IF EXISTS ticker_items CASCADE;
DROP TABLE IF EXISTS gallery_images CASCADE;
DROP TABLE IF EXISTS exam_result_niveaux CASCADE;
DROP TABLE IF EXISTS exam_results CASCADE;
DROP TABLE IF EXISTS elearning_contenus CASCADE;
DROP TABLE IF EXISTS elearning_categories CASCADE;
DROP TABLE IF EXISTS elearning_plans CASCADE;
DROP TABLE IF EXISTS products CASCADE;
DROP TABLE IF EXISTS books CASCADE;
DROP TABLE IF EXISTS student_accounts CASCADE;
DROP TABLE IF EXISTS students CASCADE;
DROP TABLE IF EXISTS teacher_passwords CASCADE;
DROP TABLE IF EXISTS teachers CASCADE;
DROP TABLE IF EXISTS authors CASCADE;
DROP TABLE IF EXISTS login_log CASCADE;
DROP TABLE IF EXISTS sessions CASCADE;
DROP TABLE IF EXISTS admins CASCADE;
DROP TABLE IF EXISTS school_config CASCADE;
DROP TABLE IF EXISTS public_info CASCADE;

-- ============================================================
-- 1. CONFIGURATION DU CENTRE
-- ============================================================

CREATE TABLE school_config (
    id INTEGER PRIMARY KEY DEFAULT 1,
    nom VARCHAR(200) NOT NULL DEFAULT 'VÉRITAS Academy',
    slogan VARCHAR(300) DEFAULT 'Centre d''Excellence Scolaire',
    ville VARCHAR(200) DEFAULT 'Yaoundé, Cameroun',
    tel VARCHAR(50),
    bp VARCHAR(200),
    logo TEXT,                          -- URL ou base64 du logo
    directeur VARCHAR(200),
    annee VARCHAR(30) DEFAULT '2024–2025',
    taux_horaire INTEGER DEFAULT 2000,
    author_share INTEGER DEFAULT 60,
    intro_video_src TEXT,
    intro_video_mime VARCHAR(50),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT single_config CHECK (id = 1)
);

CREATE TABLE public_info (
    id INTEGER PRIMARY KEY DEFAULT 1,
    slogan2 VARCHAR(500),
    description TEXT,
    histoire TEXT,
    equipe VARCHAR(500),
    horaires VARCHAR(300),
    contact VARCHAR(100),
    email VARCHAR(200),
    whatsapp VARCHAR(50),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT single_public_info CHECK (id = 1)
);

-- ============================================================
-- 2. UTILISATEURS & AUTHENTIFICATION
-- ============================================================

CREATE TABLE admins (
    id VARCHAR(20) PRIMARY KEY,
    username VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,   -- bcrypt hash
    nom VARCHAR(200) NOT NULL,
    role VARCHAR(50) DEFAULT 'Secrétaire', -- 'Directeur', 'Secrétaire'
    role2 VARCHAR(30) DEFAULT 'secretaire',-- 'admin', 'secretaire', 'superadmin'
    is_super_admin BOOLEAN DEFAULT FALSE,
    last_login TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE teachers (
    id VARCHAR(20) PRIMARY KEY,
    matricule VARCHAR(30) UNIQUE,
    nom VARCHAR(100) NOT NULL,
    prenom VARCHAR(100) NOT NULL,
    matiere VARCHAR(100),                  -- matière principale
    grade VARCHAR(100),
    username VARCHAR(100) UNIQUE,
    tel VARCHAR(50),
    salaire INTEGER DEFAULT 0,
    statut VARCHAR(30) DEFAULT 'Actif',
    classes TEXT[],                         -- array de classes
    titulaire VARCHAR(30),                 -- classe dont il est titulaire
    password_hash VARCHAR(255),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE students (
    id VARCHAR(20) PRIMARY KEY,
    matricule VARCHAR(30) UNIQUE NOT NULL,
    nom VARCHAR(100) NOT NULL,
    prenom VARCHAR(100) NOT NULL,
    sexe CHAR(1) CHECK (sexe IN ('M', 'F')),
    date_naissance VARCHAR(20),
    classe VARCHAR(30) NOT NULL,
    tel VARCHAR(50),
    parent_nom VARCHAR(200),
    parent_tel VARCHAR(50),
    frais_scolarite INTEGER DEFAULT 0,
    date_inscription VARCHAR(20),
    statut VARCHAR(30) DEFAULT 'En attente', -- 'Payé', 'Impayé', 'En attente'
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE student_accounts (
    id VARCHAR(20) PRIMARY KEY,
    student_id VARCHAR(20) NOT NULL REFERENCES students(id) ON DELETE CASCADE,
    username VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    last_login TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_type VARCHAR(30) NOT NULL,        -- 'admin', 'superadmin', 'enseignant', 'eleve', 'visiteur'
    user_id VARCHAR(50) NOT NULL,
    token VARCHAR(500) UNIQUE NOT NULL,
    refresh_token VARCHAR(500) UNIQUE,
    ip_address VARCHAR(45),
    user_agent TEXT,
    expires_at TIMESTAMPTZ NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE login_log (
    id SERIAL PRIMARY KEY,
    user_type VARCHAR(30),
    username VARCHAR(100),
    ip_address VARCHAR(45),
    success BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- 3. DONNÉES SCOLAIRES
-- ============================================================

CREATE TABLE grades (
    id VARCHAR(20) PRIMARY KEY,
    student_id VARCHAR(20) NOT NULL REFERENCES students(id) ON DELETE CASCADE,
    student_name VARCHAR(200),             -- dénormalisé pour perf
    student_mat VARCHAR(30),
    classe VARCHAR(30),
    matiere VARCHAR(100) NOT NULL,
    note_1 DECIMAL(5,2),
    note_2 DECIMAL(5,2),
    coefficient INTEGER DEFAULT 1,
    trimestre VARCHAR(30),                 -- '1er Trimestre', '2ème Trimestre', '3ème Trimestre'
    enseignant VARCHAR(200),
    teacher_id VARCHAR(20) REFERENCES teachers(id),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE absences (
    id VARCHAR(20) PRIMARY KEY,
    student_id VARCHAR(20) NOT NULL REFERENCES students(id) ON DELETE CASCADE,
    date_absence VARCHAR(20) NOT NULL,
    heures INTEGER DEFAULT 0,
    matiere VARCHAR(100),
    motif TEXT,
    justifie BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE payments (
    id VARCHAR(20) PRIMARY KEY,
    student_id VARCHAR(20) REFERENCES students(id) ON DELETE SET NULL,
    student_name VARCHAR(200),
    classe VARCHAR(30),
    mois VARCHAR(50),                      -- 'Octobre 2024', etc.
    montant INTEGER NOT NULL,
    mode_paiement VARCHAR(50),             -- 'Espèces', 'Mobile Money', 'Orange Money', 'Virement'
    date_paiement VARCHAR(20),
    statut VARCHAR(30) DEFAULT 'En attente',
    reference VARCHAR(50) UNIQUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE devoirs (
    id VARCHAR(20) PRIMARY KEY,
    teacher_id VARCHAR(20) REFERENCES teachers(id),
    matiere VARCHAR(100),
    classe VARCHAR(30),
    titre VARCHAR(300) NOT NULL,
    description TEXT,
    date_limite VARCHAR(20),
    trimestre VARCHAR(30),
    note_max DECIMAL(5,2),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE submissions (
    id VARCHAR(20) PRIMARY KEY,
    devoir_id VARCHAR(20) REFERENCES devoirs(id) ON DELETE CASCADE,
    student_id VARCHAR(20) REFERENCES students(id) ON DELETE CASCADE,
    date_soumission VARCHAR(20),
    contenu TEXT,
    fichier_url TEXT,
    note DECIMAL(5,2),
    commentaire TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE teacher_hours (
    id VARCHAR(20) PRIMARY KEY,
    teacher_id VARCHAR(20) NOT NULL REFERENCES teachers(id) ON DELETE CASCADE,
    date_cours VARCHAR(20),
    heures INTEGER DEFAULT 0,
    classe VARCHAR(30),
    matiere VARCHAR(100),
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE schedule_items (
    id VARCHAR(20) PRIMARY KEY,
    jour VARCHAR(20) NOT NULL,             -- 'Lundi', 'Mardi', etc.
    creneau VARCHAR(30) NOT NULL,          -- '07h30–09h10'
    matiere VARCHAR(100),
    classe VARCHAR(30),
    teacher_id VARCHAR(20) REFERENCES teachers(id),
    salle VARCHAR(50),
    couleur VARCHAR(10),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- 4. BOUTIQUE & MANUELS
-- ============================================================

CREATE TABLE books (
    id VARCHAR(20) PRIMARY KEY,
    titre VARCHAR(300) NOT NULL,
    classe VARCHAR(30),
    auteur VARCHAR(200),
    prix INTEGER DEFAULT 0,
    stock INTEGER DEFAULT 0,
    vendu INTEGER DEFAULT 0,
    pages INTEGER,
    icone VARCHAR(10),
    description TEXT,
    chapitres TEXT[],
    cover_color VARCHAR(20),
    extrait TEXT,
    cover_img TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE book_purchases (
    id VARCHAR(20) PRIMARY KEY,
    student_id VARCHAR(20) REFERENCES students(id) ON DELETE SET NULL,
    book_id VARCHAR(20) REFERENCES books(id) ON DELETE SET NULL,
    date_achat VARCHAR(20),
    montant INTEGER,
    statut VARCHAR(30) DEFAULT 'Payé',
    reference VARCHAR(50),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE book_reviews (
    id VARCHAR(20) PRIMARY KEY,
    book_id VARCHAR(20) REFERENCES books(id) ON DELETE CASCADE,
    reviewer_name VARCHAR(200),
    role VARCHAR(100),
    stars INTEGER CHECK (stars >= 1 AND stars <= 5),
    review_text TEXT,
    review_date VARCHAR(20),
    verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE products (
    id VARCHAR(20) PRIMARY KEY,
    icone VARCHAR(10),
    titre VARCHAR(300) NOT NULL,
    prix INTEGER DEFAULT 0,
    ancien_prix INTEGER,
    description TEXT,
    categorie VARCHAR(50),
    photo TEXT,
    actif BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE promo_codes (
    id VARCHAR(20) PRIMARY KEY,
    code VARCHAR(50) UNIQUE NOT NULL,
    reduction INTEGER DEFAULT 0,
    type_reduction VARCHAR(20) DEFAULT 'percent', -- 'percent' ou 'fixed'
    description TEXT,
    actif BOOLEAN DEFAULT TRUE,
    usage_count INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- 5. E-LEARNING
-- ============================================================

CREATE TABLE elearning_plans (
    id VARCHAR(20) PRIMARY KEY,
    nom VARCHAR(100) NOT NULL,
    cible VARCHAR(200),
    prix INTEGER DEFAULT 0,
    ancien_prix INTEGER,
    duree VARCHAR(100),
    populaire BOOLEAN DEFAULT FALSE,
    plan_tags TEXT[],
    avantages TEXT[],
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE elearning_categories (
    id VARCHAR(20) PRIMARY KEY,
    nom VARCHAR(200) NOT NULL,
    icone VARCHAR(10),
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE elearning_contenus (
    id VARCHAR(20) PRIMARY KEY,
    categorie_id VARCHAR(20) REFERENCES elearning_categories(id),
    titre VARCHAR(500) NOT NULL,
    classe VARCHAR(30),
    matiere VARCHAR(100),
    sequence VARCHAR(100),
    prix INTEGER DEFAULT 0,
    gratuit BOOLEAN DEFAULT FALSE,
    plans TEXT[],                           -- IDs des plans autorisés
    fichier_url TEXT,
    idb_key VARCHAR(100),
    res_pedago VARCHAR(50),                -- clé de ressource pédagogique interactive
    apercu TEXT,
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE elearning_subscriptions (
    id VARCHAR(20) PRIMARY KEY,
    user_type VARCHAR(30),                 -- 'student', 'visitor', 'teacher'
    user_id VARCHAR(50),
    plan_id VARCHAR(20) REFERENCES elearning_plans(id),
    date_debut TIMESTAMPTZ DEFAULT NOW(),
    date_fin TIMESTAMPTZ,
    statut VARCHAR(30) DEFAULT 'active',
    payment_ref VARCHAR(50),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE elearning_orders (
    id VARCHAR(20) PRIMARY KEY,
    user_type VARCHAR(30),
    user_id VARCHAR(50),
    contenu_id VARCHAR(20) REFERENCES elearning_contenus(id),
    montant INTEGER,
    statut VARCHAR(30) DEFAULT 'pending',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE elearning_downloads (
    user_id VARCHAR(50) NOT NULL,
    contenu_id VARCHAR(20) NOT NULL REFERENCES elearning_contenus(id),
    downloaded_at TIMESTAMPTZ DEFAULT NOW(),
    PRIMARY KEY (user_id, contenu_id)
);

-- ============================================================
-- 6. PAIEMENTS EN LIGNE
-- ============================================================

CREATE TABLE pay_attempts (
    id VARCHAR(20) PRIMARY KEY,
    montant INTEGER NOT NULL,
    label VARCHAR(500),
    reference VARCHAR(50) UNIQUE NOT NULL,
    methode VARCHAR(50),                   -- 'momo', 'orange', 'paypal', 'stripe', 'bank'
    statut VARCHAR(30) DEFAULT 'pending',  -- 'pending', 'confirmed', 'failed'
    user_type VARCHAR(30),
    user_id VARCHAR(50),
    confirmed_by VARCHAR(50),
    confirmed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE payment_webhooks (
    id SERIAL PRIMARY KEY,
    provider VARCHAR(30),                  -- 'stripe', 'orange', 'mtn'
    event_id VARCHAR(200) UNIQUE,
    payload JSONB,
    signature VARCHAR(500),
    processed BOOLEAN DEFAULT FALSE,
    received_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- 7. VISITEURS & COMMANDES
-- ============================================================

CREATE TABLE visitor_accounts (
    id VARCHAR(20) PRIMARY KEY,
    nom VARCHAR(200) NOT NULL,
    email VARCHAR(200) UNIQUE,
    tel VARCHAR(50),
    password_hash VARCHAR(255) NOT NULL,
    plan_id VARCHAR(20),
    plan_expire TIMESTAMPTZ,
    last_login TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE visitor_orders (
    id VARCHAR(20) PRIMARY KEY,
    visitor_id VARCHAR(20) REFERENCES visitor_accounts(id) ON DELETE SET NULL,
    items JSONB,                           -- [{id, titre, prix, qty}]
    total INTEGER,
    statut VARCHAR(30) DEFAULT 'pending',
    reference VARCHAR(50),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- 8. CONTENU & COMMUNICATION
-- ============================================================

CREATE TABLE announcements (
    id VARCHAR(20) PRIMARY KEY,
    titre VARCHAR(500) NOT NULL,
    date_event VARCHAR(20),
    description TEXT,
    type VARCHAR(30),                      -- 'reunion', 'exam', 'info'
    urgent BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE notifications (
    id VARCHAR(20) PRIMARY KEY,
    destinataire VARCHAR(50) DEFAULT 'all',
    titre VARCHAR(300),
    message TEXT,
    date_notif VARCHAR(20),
    read_by TEXT[],
    type VARCHAR(30) DEFAULT 'info',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE ticker_items (
    id SERIAL PRIMARY KEY,
    texte TEXT NOT NULL,
    icone VARCHAR(10),
    actif BOOLEAN DEFAULT TRUE,
    ordre INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE citations (
    id SERIAL PRIMARY KEY,
    texte TEXT NOT NULL,
    auteur VARCHAR(200) NOT NULL,
    actif BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE gallery_images (
    id VARCHAR(20) PRIMARY KEY,
    src TEXT NOT NULL,                      -- URL de l'image
    titre VARCHAR(200),
    description TEXT,
    ordre INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE exam_results (
    id SERIAL PRIMARY KEY,
    annee VARCHAR(30) NOT NULL,
    ordre INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE exam_result_niveaux (
    id SERIAL PRIMARY KEY,
    exam_result_id INTEGER REFERENCES exam_results(id) ON DELETE CASCADE,
    classe VARCHAR(30),
    taux INTEGER DEFAULT 0,
    candidats INTEGER DEFAULT 0,
    admis INTEGER DEFAULT 0
);

CREATE TABLE depenses (
    id VARCHAR(20) PRIMARY KEY,
    categorie VARCHAR(100),
    description TEXT,
    montant INTEGER NOT NULL,
    date_depense VARCHAR(20),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE orientation_demandes (
    id VARCHAR(20) PRIMARY KEY,
    nom VARCHAR(200),
    tel VARCHAR(50),
    niveau VARCHAR(50),
    type_service VARCHAR(100),
    disponibilite VARCHAR(200),
    message TEXT,
    statut VARCHAR(30) DEFAULT 'Nouveau',
    date_demande VARCHAR(20),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE authors (
    id VARCHAR(20) PRIMARY KEY,
    username VARCHAR(100) UNIQUE,
    password_hash VARCHAR(255),
    nom VARCHAR(200),
    email VARCHAR(200),
    tel VARCHAR(50),
    bio TEXT,
    share_percent INTEGER DEFAULT 60,
    statut VARCHAR(30) DEFAULT 'approved',
    book_ids TEXT[],
    gains INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- 9. INDEX POUR LA PERFORMANCE
-- ============================================================

CREATE INDEX idx_students_classe ON students(classe);
CREATE INDEX idx_students_matricule ON students(matricule);
CREATE INDEX idx_grades_student ON grades(student_id);
CREATE INDEX idx_grades_trimestre ON grades(trimestre);
CREATE INDEX idx_grades_classe ON grades(classe);
CREATE INDEX idx_payments_student ON payments(student_id);
CREATE INDEX idx_payments_statut ON payments(statut);
CREATE INDEX idx_payments_reference ON payments(reference);
CREATE INDEX idx_absences_student ON absences(student_id);
CREATE INDEX idx_devoirs_teacher ON devoirs(teacher_id);
CREATE INDEX idx_devoirs_classe ON devoirs(classe);
CREATE INDEX idx_submissions_devoir ON submissions(devoir_id);
CREATE INDEX idx_submissions_student ON submissions(student_id);
CREATE INDEX idx_teacher_hours_teacher ON teacher_hours(teacher_id);
CREATE INDEX idx_book_purchases_student ON book_purchases(student_id);
CREATE INDEX idx_book_reviews_book ON book_reviews(book_id);
CREATE INDEX idx_elearning_contenus_cat ON elearning_contenus(categorie_id);
CREATE INDEX idx_elearning_contenus_classe ON elearning_contenus(classe);
CREATE INDEX idx_elearning_subs_user ON elearning_subscriptions(user_id);
CREATE INDEX idx_pay_attempts_ref ON pay_attempts(reference);
CREATE INDEX idx_pay_attempts_status ON pay_attempts(statut);
CREATE INDEX idx_sessions_token ON sessions(token);
CREATE INDEX idx_sessions_expires ON sessions(expires_at);
CREATE INDEX idx_login_log_date ON login_log(created_at);
CREATE INDEX idx_visitor_orders_visitor ON visitor_orders(visitor_id);

-- ============================================================
-- 10. DONNÉES INITIALES
-- ============================================================

-- Configuration du centre
INSERT INTO school_config (nom, slogan, ville, tel, bp, directeur, annee)
VALUES ('VÉRITAS Academy', 'Centre d''Excellence Scolaire', 'Yaoundé, Cameroun',
        '697 637 739', 'Yaoundé, Cameroun', 'M. Jacques Miterand TAKOU', '2024–2025');

-- Informations publiques
INSERT INTO public_info (slogan2, description, histoire, equipe, horaires, email, whatsapp)
VALUES (
    'Excellence académique depuis 2023',
    'Le Centre VÉRITAS est un établissement d''enseignement secondaire de renom basé à Yaoundé, Cameroun.',
    'Fondé en 2023 par TAKOU Jacques Miterand (Directeur), AMBASSA et TCHAPDA.',
    'Une équipe de 15 enseignants certifiés dans diverses disciplines',
    'Lundi–Vendredi: 7h30–17h30 | Samedi: 8h00–13h00',
    'contact@veritas-cm.cm',
    '+237 6 00 00 00 00'
);

-- Citations par défaut
INSERT INTO citations (texte, auteur) VALUES
    ('L''éducation est l''arme la plus puissante pour changer le monde.', 'Nelson Mandela'),
    ('Le savoir est la seule richesse qu''on peut donner sans s''appauvrir.', 'Proverbe africain'),
    ('Celui qui ouvre une porte d''école ferme une prison.', 'Victor Hugo'),
    ('L''excellence n''est pas un acte, c''est une habitude.', 'Aristote'),
    ('Apprendre sans réfléchir est vain, réfléchir sans apprendre est dangereux.', 'Confucius'),
    ('L''avenir appartient à ceux qui croient en la beauté de leurs rêves.', 'Eleanor Roosevelt'),
    ('Vis comme si tu devais mourir demain. Apprends comme si tu devais vivre toujours.', 'Gandhi');

-- ============================================================
-- Fin du schéma
-- ============================================================
