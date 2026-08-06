-- ============================================================
-- VÉRITAS Campus — Schéma SQL multi-tenant (white-label)
-- © 2024-2026 Jacques Miterand TAKOU (Mythe Errant). Tous droits réservés.
-- Œuvre protégée — Loi n° 2000/011 + Convention de Berne.
--
-- Backend NEUF, isolé de l'app mono-établissement VÉRITAS Academy.
-- Toutes les tables sont préfixées « cmp_ » → AUCUNE collision avec les
-- tables existantes (students, payments, grades…) de la base verit2781684.
--
-- IMPORT : à exécuter via api/campus/migrate.php?install=1 (idempotent),
-- ou manuellement dans phpMyAdmin (base verit2781684).
-- ⚠ LWS : NE PAS faire CREATE DATABASE ni USE — la base existe déjà.
--
-- Règle d'OR multi-tenant : toute table « métier » porte tenant_id NOT NULL
-- + clé étrangère vers cmp_tenants + index. L'isolation est imposée AUSSI
-- côté code (_db.php : tout SELECT/UPDATE/DELETE métier est filtré par tenant).
-- InnoDB + utf8mb4 partout.
-- ============================================================

SET NAMES utf8mb4;

-- ── Éditeur de la plateforme (équipe VÉRITAS) : gère/provisionne les écoles ──
CREATE TABLE IF NOT EXISTS cmp_platform_admins (
    id            BIGINT AUTO_INCREMENT PRIMARY KEY,
    email         VARCHAR(190) NOT NULL,
    password_hash VARCHAR(255) NOT NULL,        -- bcrypt (cost 12)
    name          VARCHAR(160),
    status        ENUM('active','disabled') NOT NULL DEFAULT 'active',
    last_login_at DATETIME NULL,
    created_at    DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY uq_padmin_email (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ── Établissements (tenants) ──
CREATE TABLE IF NOT EXISTS cmp_tenants (
    id             BIGINT AUTO_INCREMENT PRIMARY KEY,
    slug           VARCHAR(63)  NOT NULL,        -- identifiant URL/sous-domaine (a-z0-9-)
    name           VARCHAR(190) NOT NULL,        -- raison sociale de l'école
    status         ENUM('trial','active','suspended','archived') NOT NULL DEFAULT 'trial',
    plan           ENUM('starter','croissance','pro','premium','entreprise') NOT NULL DEFAULT 'starter',
    max_students   INT NOT NULL DEFAULT 200,     -- plafond du forfait (garde-fou)
    country        VARCHAR(2)  NOT NULL DEFAULT 'CM',
    currency       VARCHAR(3)  NOT NULL DEFAULT 'XAF',
    trial_ends_at  DATETIME NULL,
    created_at     DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at     DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE KEY uq_tenant_slug (slug),
    KEY idx_tenant_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ── Identité visuelle / white-label (1 ligne par tenant) ──
-- Renvoyée par GET /tenant/config AVANT login → applyTenantTheme() côté frontend.
-- NE CONTIENT AUCUN SECRET (couleurs/logo/nom seulement).
CREATE TABLE IF NOT EXISTS cmp_tenant_branding (
    tenant_id      BIGINT PRIMARY KEY,
    product_name   VARCHAR(120) NOT NULL DEFAULT 'VÉRITAS Campus', -- nom affiché aux utilisateurs de l'école
    slogan         VARCHAR(190) DEFAULT '',
    logo_url       VARCHAR(1000) DEFAULT '',
    favicon_url    VARCHAR(1000) DEFAULT '',
    login_bg_url   VARCHAR(1000) DEFAULT '',
    primary_color  VARCHAR(9) NOT NULL DEFAULT '#142554',   -- navy VÉRITAS par défaut
    accent_color   VARCHAR(9) NOT NULL DEFAULT '#FFC93C',    -- or VÉRITAS par défaut
    header_mode    ENUM('sombre','clair') NOT NULL DEFAULT 'sombre',
    font_family    VARCHAR(120) DEFAULT '',
    contact_tel    VARCHAR(60)  DEFAULT '',
    contact_whatsapp VARCHAR(60) DEFAULT '',
    contact_email  VARCHAR(190) DEFAULT '',
    address        VARCHAR(255) DEFAULT '',
    updated_at     DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_branding_tenant FOREIGN KEY (tenant_id) REFERENCES cmp_tenants(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ── Activation des modules par établissement (qui paie quoi, qui voit quoi) ──
CREATE TABLE IF NOT EXISTS cmp_tenant_modules (
    tenant_id   BIGINT NOT NULL,
    module_key  VARCHAR(40) NOT NULL,   -- frais|bulletins|sms|elearning|ia|jeux|rh|emploi_temps|boutique...
    enabled     TINYINT(1) NOT NULL DEFAULT 1,
    PRIMARY KEY (tenant_id, module_key),
    CONSTRAINT fk_modules_tenant FOREIGN KEY (tenant_id) REFERENCES cmp_tenants(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ── Réglages structurés par établissement (système, périodes, barème…) ──
-- JSON souples : academics (systeme/cycles/periodes/bareme), comms (sender SMS…),
-- payments (numéros MoMo/OM AFFICHÉS, NON secrets). Les CLÉS provider vont dans
-- cmp_tenant_secrets (jamais renvoyées au client).
CREATE TABLE IF NOT EXISTS cmp_tenant_settings (
    tenant_id   BIGINT PRIMARY KEY,
    academics   JSON NULL,
    comms       JSON NULL,
    payments    JSON NULL,
    updated_at  DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_settings_tenant FOREIGN KEY (tenant_id) REFERENCES cmp_tenants(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ── Secrets par établissement (clés API paiement/SMS) — JAMAIS exposés au navigateur ──
CREATE TABLE IF NOT EXISTS cmp_tenant_secrets (
    tenant_id   BIGINT NOT NULL,
    secret_key  VARCHAR(60) NOT NULL,   -- ex: momo_api_user, orange_client_secret, sms_token
    secret_val  TEXT NOT NULL,
    updated_at  DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (tenant_id, secret_key),
    CONSTRAINT fk_secrets_tenant FOREIGN KEY (tenant_id) REFERENCES cmp_tenants(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ── Utilisateurs (scopés au tenant) ──
-- Rôles façon « qui voit quoi » : admin, comptable, professeur, vie_scolaire, eleve, parent.
CREATE TABLE IF NOT EXISTS cmp_users (
    id            BIGINT AUTO_INCREMENT PRIMARY KEY,
    tenant_id     BIGINT NOT NULL,
    email         VARCHAR(190) NOT NULL,
    password_hash VARCHAR(255) NOT NULL,        -- bcrypt (cost 12)
    role          ENUM('admin','proviseur','directeur','censeur','prefet_etudes',
                       'surveillant_general','surveillant','intendant','econome','comptable',
                       'secretaire','vie_scolaire','professeur','eleve','parent')
                  NOT NULL DEFAULT 'admin',
    nom           VARCHAR(120),
    prenom        VARCHAR(120),
    tel           VARCHAR(60),
    student_id    BIGINT NULL,                  -- lie un compte eleve/parent à un élève (portail)
    tarif_horaire INT NOT NULL DEFAULT 0,        -- taux horaire (vacataire) pour la paie aux heures
    status        ENUM('active','disabled') NOT NULL DEFAULT 'active',
    last_login_at DATETIME NULL,
    created_at    DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY uq_user_tenant_email (tenant_id, email),
    KEY idx_user_tenant (tenant_id),
    CONSTRAINT fk_user_tenant FOREIGN KEY (tenant_id) REFERENCES cmp_tenants(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ── Jetons de session opaques (révocables, hachés en base) ──
-- On stocke SHA-256 du jeton, jamais le jeton en clair. scope = tenant OU platform.
CREATE TABLE IF NOT EXISTS cmp_auth_tokens (
    id           BIGINT AUTO_INCREMENT PRIMARY KEY,
    token_hash   CHAR(64) NOT NULL,            -- hash('sha256', token)
    scope        ENUM('tenant','platform') NOT NULL DEFAULT 'tenant',
    tenant_id    BIGINT NULL,                  -- NULL si scope=platform
    user_id      BIGINT NOT NULL,              -- cmp_users.id OU cmp_platform_admins.id
    role         VARCHAR(20) NOT NULL,
    expires_at   DATETIME NOT NULL,
    created_at   DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    last_used_at DATETIME NULL,
    ip           VARCHAR(45),
    user_agent   VARCHAR(255),
    UNIQUE KEY uq_token_hash (token_hash),
    KEY idx_token_tenant (tenant_id),
    KEY idx_token_expires (expires_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ── Journal d'audit (TRAÇABILITÉ : qui a modifié quoi et quand) ──
-- L'argument n°1 du concurrent. Inviolable côté serveur, scopé par tenant.
CREATE TABLE IF NOT EXISTS cmp_audit_log (
    id           BIGINT AUTO_INCREMENT PRIMARY KEY,
    tenant_id    BIGINT NULL,                  -- NULL = action plateforme (éditeur)
    user_id      BIGINT NULL,
    actor_email  VARCHAR(190),
    actor_role   VARCHAR(20),
    action       VARCHAR(60) NOT NULL,         -- login|update_branding|create_student|...
    entity       VARCHAR(60),
    entity_id    VARCHAR(60),
    before_json  JSON NULL,
    after_json   JSON NULL,
    ip           VARCHAR(45),
    created_at   DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    KEY idx_audit_tenant_time (tenant_id, created_at),
    KEY idx_audit_action (action)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ── Structure académique CONFIGURABLE (scopée par tenant) ──
-- Modélise le système camerounais à double sous-système :
--   sous_systeme : francophone | anglophone   (un établissement peut activer les 2)
--   filiere      : general | technique | professionnel
-- Chaque « section » porte son barème, ses périodes et son examen terminal.
-- Au provisioning d'un tenant, on copie la structure standard camerounaise
-- (_seed_academics.php) que l'admin peut ensuite ajouter/éditer/désactiver.
CREATE TABLE IF NOT EXISTS cmp_academic_sections (
    id            BIGINT AUTO_INCREMENT PRIMARY KEY,
    tenant_id     BIGINT NOT NULL,
    section_key   VARCHAR(40) NOT NULL,        -- fr_general | fr_technique | en_general | en_technical...
    sous_systeme  ENUM('francophone','anglophone') NOT NULL,
    filiere       ENUM('general','technique','professionnel') NOT NULL DEFAULT 'general',
    label         VARCHAR(160) NOT NULL,
    langue        VARCHAR(5) NOT NULL DEFAULT 'fr',   -- fr | en (langue d'enseignement/bulletins)
    bareme        INT NOT NULL DEFAULT 20,             -- note maximale (20 FR ; 100 ou échelle GCE EN)
    grading_scale ENUM('sur_20','gce_letter','percentage') NOT NULL DEFAULT 'sur_20',
    periodes      ENUM('trimestre','semestre') NOT NULL DEFAULT 'trimestre',
    cycles        JSON NULL,                    -- [{key,label,classes:[],examen}] (configurable)
    grading       JSON NULL,                    -- {weights:{cc,ds,sn}, distinctions:[{label,en,min}]} (configurable)
    ordering      INT NOT NULL DEFAULT 0,
    enabled       TINYINT(1) NOT NULL DEFAULT 1,
    created_at    DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at    DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE KEY uq_section_tenant_key (tenant_id, section_key),
    KEY idx_section_tenant (tenant_id),
    CONSTRAINT fk_section_tenant FOREIGN KEY (tenant_id) REFERENCES cmp_tenants(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ── Classes (scopées, rattachées à une section académique) ──
CREATE TABLE IF NOT EXISTS cmp_classes (
    id            BIGINT AUTO_INCREMENT PRIMARY KEY,
    tenant_id     BIGINT NOT NULL,
    section_id    BIGINT NULL,                  -- → cmp_academic_sections.id
    sous_systeme  ENUM('francophone','anglophone') NOT NULL DEFAULT 'francophone',
    filiere       ENUM('general','technique','professionnel') NOT NULL DEFAULT 'general',
    code          VARCHAR(40) NOT NULL,         -- 6eA | Form1 | 2ndeF2 | LowerSixth...
    name          VARCHAR(120) NOT NULL,
    cycle         VARCHAR(40),                  -- 1er_cycle | 2nd_cycle | first_cycle | second_cycle
    serie         VARCHAR(40),                  -- A,C,D / F2,G2 / Science,Arts...
    niveau_ordre  INT NOT NULL DEFAULT 0,       -- ordre pédagogique (tri)
    created_at    DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY uq_class_tenant_code (tenant_id, code),
    KEY idx_class_tenant (tenant_id),
    KEY idx_class_section (section_id),
    CONSTRAINT fk_class_tenant FOREIGN KEY (tenant_id) REFERENCES cmp_tenants(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ── Élèves (scopés) ──
CREATE TABLE IF NOT EXISTS cmp_students (
    id              BIGINT AUTO_INCREMENT PRIMARY KEY,
    tenant_id       BIGINT NOT NULL,
    matricule       VARCHAR(40),
    nom             VARCHAR(120) NOT NULL,
    prenom          VARCHAR(120),
    sexe            CHAR(1),
    date_naissance  DATE NULL,
    class_id        BIGINT NULL,
    parent_nom      VARCHAR(200),
    parent_tel      VARCHAR(60),
    frais_total     INT NOT NULL DEFAULT 0,
    statut          VARCHAR(40) NOT NULL DEFAULT 'actif',
    photo_url       VARCHAR(1000),
    created_at      DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY uq_student_tenant_mat (tenant_id, matricule),
    KEY idx_student_tenant (tenant_id),
    KEY idx_student_class (class_id),
    CONSTRAINT fk_student_tenant FOREIGN KEY (tenant_id) REFERENCES cmp_tenants(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ── Paiements (scopés) ──
CREATE TABLE IF NOT EXISTS cmp_payments (
    id            BIGINT AUTO_INCREMENT PRIMARY KEY,
    tenant_id     BIGINT NOT NULL,
    student_id    BIGINT NULL,
    montant       INT NOT NULL DEFAULT 0,
    devise        VARCHAR(3) NOT NULL DEFAULT 'XAF',
    moyen         VARCHAR(20),                  -- momo|orange|paypal|stripe|caisse|virement
    reference     VARCHAR(80),
    provider_ref  VARCHAR(120),
    statut        ENUM('pending','confirmed','failed','refunded') NOT NULL DEFAULT 'pending',
    verifie       TINYINT(1) NOT NULL DEFAULT 0,
    date_paiement DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    validated_by  BIGINT NULL,
    UNIQUE KEY uq_payment_tenant_ref (tenant_id, reference),
    KEY idx_payment_tenant (tenant_id),
    KEY idx_payment_status (tenant_id, statut),
    CONSTRAINT fk_payment_tenant FOREIGN KEY (tenant_id) REFERENCES cmp_tenants(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
--  MODULES PÉDAGOGIQUES & DISCIPLINAIRES (scopés par tenant)
-- ============================================================

-- ── Matières (configurables, rattachables à une section) ──
CREATE TABLE IF NOT EXISTS cmp_subjects (
    id           BIGINT AUTO_INCREMENT PRIMARY KEY,
    tenant_id    BIGINT NOT NULL,
    section_id   BIGINT NULL,
    code         VARCHAR(40) NOT NULL,
    name         VARCHAR(160) NOT NULL,
    default_coef INT NOT NULL DEFAULT 1,
    langue       VARCHAR(5) NOT NULL DEFAULT 'fr',
    groupe       VARCHAR(60) NULL,          -- ex: Disciplines littéraires / scientifiques
    created_at   DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY uq_subject_tenant_code (tenant_id, code),
    KEY idx_subject_tenant (tenant_id),
    CONSTRAINT fk_subject_tenant FOREIGN KEY (tenant_id) REFERENCES cmp_tenants(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ── Feuilles de notes (SAISIE GROUPÉE) : classe × matière × période × séquence ──
-- status : draft (le prof saisit) → submitted (VERROUILLÉ pour le prof) → validated (admin).
CREATE TABLE IF NOT EXISTS cmp_grade_sheets (
    id           BIGINT AUTO_INCREMENT PRIMARY KEY,
    tenant_id    BIGINT NOT NULL,
    class_id     BIGINT NOT NULL,
    subject_id   BIGINT NOT NULL,
    teacher_id   BIGINT NULL,               -- cmp_users.id : le prof propriétaire de la saisie
    periode      VARCHAR(40) NOT NULL,       -- Trimestre 1 / Semestre 1 / Term 1
    sequence     VARCHAR(40) NOT NULL,       -- Séquence 1 / Évaluation 1
    eval_key     VARCHAR(20) NOT NULL DEFAULT 'note',  -- composante : dev1|dev2|cc|ds|sn… (pondérée via grading)
    bareme       INT NOT NULL DEFAULT 20,
    status       ENUM('draft','submitted','validated') NOT NULL DEFAULT 'draft',
    submitted_at DATETIME NULL,
    validated_by BIGINT NULL,
    validated_at DATETIME NULL,
    created_at   DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY uq_sheet (tenant_id, class_id, subject_id, periode, sequence, eval_key),
    KEY idx_sheet_tenant (tenant_id),
    KEY idx_sheet_teacher (teacher_id),
    CONSTRAINT fk_sheet_tenant FOREIGN KEY (tenant_id) REFERENCES cmp_tenants(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ── Notes individuelles (1 par élève × feuille) ──
-- status : draft → locked (au submit de la feuille). Un prof ne peut PAS toucher
-- une note locked ; seul l'admin peut la corriger (modified_by_admin + audit).
CREATE TABLE IF NOT EXISTS cmp_grades (
    id                BIGINT AUTO_INCREMENT PRIMARY KEY,
    tenant_id         BIGINT NOT NULL,
    sheet_id          BIGINT NOT NULL,
    student_id        BIGINT NOT NULL,
    note              DECIMAL(5,2) NULL,
    coefficient       INT NOT NULL DEFAULT 1,
    appreciation      VARCHAR(255) NULL,
    status            ENUM('draft','locked') NOT NULL DEFAULT 'draft',
    entered_by        BIGINT NULL,
    entered_at        DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    modified_by_admin BIGINT NULL,
    modified_at       DATETIME NULL,
    UNIQUE KEY uq_grade (tenant_id, sheet_id, student_id),
    KEY idx_grade_tenant (tenant_id),
    KEY idx_grade_sheet (sheet_id),
    KEY idx_grade_student (student_id),
    CONSTRAINT fk_grade_tenant FOREIGN KEY (tenant_id) REFERENCES cmp_tenants(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ── Absences (en HEURES, justifiées ou non) ──
CREATE TABLE IF NOT EXISTS cmp_absences (
    id           BIGINT AUTO_INCREMENT PRIMARY KEY,
    tenant_id    BIGINT NOT NULL,
    student_id   BIGINT NOT NULL,
    class_id     BIGINT NULL,
    date_absence DATE NOT NULL,
    heures       INT NOT NULL DEFAULT 0,
    matiere      VARCHAR(120) NULL,
    justifie     TINYINT(1) NOT NULL DEFAULT 0,
    motif        VARCHAR(255) NULL,
    recorded_by  BIGINT NULL,
    created_at   DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    KEY idx_abs_tenant (tenant_id),
    KEY idx_abs_student (student_id),
    CONSTRAINT fk_abs_tenant FOREIGN KEY (tenant_id) REFERENCES cmp_tenants(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ── Discipline : sanctions ET récompenses ──
CREATE TABLE IF NOT EXISTS cmp_sanctions (
    id          BIGINT AUTO_INCREMENT PRIMARY KEY,
    tenant_id   BIGINT NOT NULL,
    student_id  BIGINT NOT NULL,
    type        ENUM('avertissement','blame','exclusion_temporaire','exclusion_definitive',
                     'convocation','consigne','retenue','felicitations','encouragement','tableau_honneur')
                NOT NULL DEFAULT 'avertissement',
    date_fait   DATE NOT NULL,
    description TEXT NULL,
    decision    TEXT NULL,
    duree_jours INT NULL,
    recorded_by BIGINT NULL,
    created_at  DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    KEY idx_sanction_tenant (tenant_id),
    KEY idx_sanction_student (student_id),
    CONSTRAINT fk_sanction_tenant FOREIGN KEY (tenant_id) REFERENCES cmp_tenants(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ── Procès-verbaux (conseil de classe, délibération, conseil de discipline) ──
CREATE TABLE IF NOT EXISTS cmp_pv (
    id           BIGINT AUTO_INCREMENT PRIMARY KEY,
    tenant_id    BIGINT NOT NULL,
    class_id     BIGINT NULL,
    type         ENUM('conseil_classe','deliberation','conseil_discipline','reunion','autre')
                 NOT NULL DEFAULT 'conseil_classe',
    periode      VARCHAR(40) NULL,
    titre        VARCHAR(255) NOT NULL,
    president    VARCHAR(160) NULL,
    participants JSON NULL,
    contenu      LONGTEXT NULL,
    decisions    LONGTEXT NULL,
    status       ENUM('draft','final') NOT NULL DEFAULT 'draft',
    created_by   BIGINT NULL,
    created_at   DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    KEY idx_pv_tenant (tenant_id),
    CONSTRAINT fk_pv_tenant FOREIGN KEY (tenant_id) REFERENCES cmp_tenants(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ── Notifications WhatsApp / SMS / e-mail (file + journal d'envoi) ──
-- Les CLÉS provider (token WhatsApp Cloud, gateway SMS) vivent dans
-- cmp_tenant_secrets (par établissement, jamais renvoyées au client).
CREATE TABLE IF NOT EXISTS cmp_notifications (
    id           BIGINT AUTO_INCREMENT PRIMARY KEY,
    tenant_id    BIGINT NOT NULL,
    channel      ENUM('whatsapp','sms','email') NOT NULL DEFAULT 'sms',
    recipient    VARCHAR(190) NOT NULL,        -- numéro (E.164) ou e-mail
    student_id   BIGINT NULL,
    template     VARCHAR(60) NULL,             -- bulletin|absence|recu|relance|welcome|custom
    message      TEXT NOT NULL,
    status       ENUM('queued','sent','failed') NOT NULL DEFAULT 'queued',
    provider     VARCHAR(40) NULL,
    provider_ref VARCHAR(120) NULL,
    error        VARCHAR(255) NULL,
    created_by   BIGINT NULL,
    created_at   DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    sent_at      DATETIME NULL,
    KEY idx_notif_tenant (tenant_id),
    KEY idx_notif_status (tenant_id, status),
    CONSTRAINT fk_notif_tenant FOREIGN KEY (tenant_id) REFERENCES cmp_tenants(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
--  MODULES : emploi du temps · bibliothèque · transport · RH · paiement en ligne · vérification QR
-- ============================================================

-- ── Emploi du temps ──
CREATE TABLE IF NOT EXISTS cmp_timetable (
    id         BIGINT AUTO_INCREMENT PRIMARY KEY,
    tenant_id  BIGINT NOT NULL,
    class_id   BIGINT NOT NULL,
    jour       TINYINT NOT NULL,            -- 1=lundi … 6=samedi
    debut      TIME NOT NULL,
    fin        TIME NOT NULL,
    subject_id BIGINT NULL,
    teacher_id BIGINT NULL,
    salle      VARCHAR(40) NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    KEY idx_tt_tenant (tenant_id, class_id),
    CONSTRAINT fk_tt_tenant FOREIGN KEY (tenant_id) REFERENCES cmp_tenants(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ── Bibliothèque ──
CREATE TABLE IF NOT EXISTS cmp_books (
    id           BIGINT AUTO_INCREMENT PRIMARY KEY,
    tenant_id    BIGINT NOT NULL,
    isbn         VARCHAR(20) NULL,
    titre        VARCHAR(255) NOT NULL,
    auteur       VARCHAR(190) NULL,
    categorie    VARCHAR(80) NULL,
    exemplaires  INT NOT NULL DEFAULT 1,
    disponibles  INT NOT NULL DEFAULT 1,
    created_at   DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    KEY idx_book_tenant (tenant_id),
    CONSTRAINT fk_book_tenant FOREIGN KEY (tenant_id) REFERENCES cmp_tenants(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS cmp_book_loans (
    id                  BIGINT AUTO_INCREMENT PRIMARY KEY,
    tenant_id           BIGINT NOT NULL,
    book_id             BIGINT NOT NULL,
    borrower_type       ENUM('eleve','personnel') NOT NULL DEFAULT 'eleve',
    borrower_id         BIGINT NULL,
    borrower_nom        VARCHAR(190) NULL,
    date_pret           DATE NOT NULL,
    date_retour_prevue  DATE NULL,
    date_retour         DATE NULL,
    statut              ENUM('en_cours','rendu','retard') NOT NULL DEFAULT 'en_cours',
    created_by          BIGINT NULL,
    created_at          DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    KEY idx_loan_tenant (tenant_id),
    KEY idx_loan_book (book_id),
    CONSTRAINT fk_loan_tenant FOREIGN KEY (tenant_id) REFERENCES cmp_tenants(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ── Transport scolaire ──
CREATE TABLE IF NOT EXISTS cmp_transport_routes (
    id             BIGINT AUTO_INCREMENT PRIMARY KEY,
    tenant_id      BIGINT NOT NULL,
    nom            VARCHAR(120) NOT NULL,
    vehicule       VARCHAR(80) NULL,
    immatriculation VARCHAR(40) NULL,
    chauffeur      VARCHAR(120) NULL,
    chauffeur_tel  VARCHAR(60) NULL,
    places         INT NOT NULL DEFAULT 0,
    frais          INT NOT NULL DEFAULT 0,
    created_at     DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    KEY idx_route_tenant (tenant_id),
    CONSTRAINT fk_route_tenant FOREIGN KEY (tenant_id) REFERENCES cmp_tenants(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS cmp_transport_stops (
    id        BIGINT AUTO_INCREMENT PRIMARY KEY,
    tenant_id BIGINT NOT NULL,
    route_id  BIGINT NOT NULL,
    nom       VARCHAR(120) NOT NULL,
    heure     TIME NULL,
    ordre     INT NOT NULL DEFAULT 0,
    KEY idx_stop_route (route_id),
    CONSTRAINT fk_stop_tenant FOREIGN KEY (tenant_id) REFERENCES cmp_tenants(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS cmp_transport_assign (
    id         BIGINT AUTO_INCREMENT PRIMARY KEY,
    tenant_id  BIGINT NOT NULL,
    route_id   BIGINT NOT NULL,
    student_id BIGINT NOT NULL,
    stop_id    BIGINT NULL,
    frais      INT NOT NULL DEFAULT 0,
    statut     VARCHAR(20) NOT NULL DEFAULT 'actif',
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY uq_assign (tenant_id, route_id, student_id),
    KEY idx_assign_tenant (tenant_id),
    CONSTRAINT fk_assign_tenant FOREIGN KEY (tenant_id) REFERENCES cmp_tenants(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ── RH : congés ──
CREATE TABLE IF NOT EXISTS cmp_staff_leaves (
    id         BIGINT AUTO_INCREMENT PRIMARY KEY,
    tenant_id  BIGINT NOT NULL,
    user_id    BIGINT NOT NULL,
    type       ENUM('conge','maladie','permission','maternite','autre') NOT NULL DEFAULT 'conge',
    date_debut DATE NOT NULL,
    date_fin   DATE NOT NULL,
    jours      INT NOT NULL DEFAULT 0,
    motif      VARCHAR(255) NULL,
    statut     ENUM('demande','approuve','refuse') NOT NULL DEFAULT 'demande',
    decided_by BIGINT NULL,
    decided_at DATETIME NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    KEY idx_leave_tenant (tenant_id),
    KEY idx_leave_user (user_id),
    CONSTRAINT fk_leave_tenant FOREIGN KEY (tenant_id) REFERENCES cmp_tenants(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ── RH : paie ──
CREATE TABLE IF NOT EXISTS cmp_payroll (
    id            BIGINT AUTO_INCREMENT PRIMARY KEY,
    tenant_id     BIGINT NOT NULL,
    user_id       BIGINT NOT NULL,
    periode       VARCHAR(7) NOT NULL,        -- AAAA-MM
    salaire_base  INT NOT NULL DEFAULT 0,
    primes        INT NOT NULL DEFAULT 0,
    retenues      INT NOT NULL DEFAULT 0,
    net           INT NOT NULL DEFAULT 0,
    statut        ENUM('brouillon','valide','paye') NOT NULL DEFAULT 'brouillon',
    mode          VARCHAR(30) NULL,
    date_paiement DATETIME NULL,
    created_by    BIGINT NULL,
    created_at    DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY uq_payroll (tenant_id, user_id, periode),
    KEY idx_payroll_tenant (tenant_id),
    CONSTRAINT fk_payroll_tenant FOREIGN KEY (tenant_id) REFERENCES cmp_tenants(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ── Comptabilité des heures (cahier de charge horaire des enseignants) ──
CREATE TABLE IF NOT EXISTS cmp_teacher_hours (
    id            BIGINT AUTO_INCREMENT PRIMARY KEY,
    tenant_id     BIGINT NOT NULL,
    teacher_id    BIGINT NOT NULL,
    class_id      BIGINT NULL,
    subject_id    BIGINT NULL,
    date_cours    DATE NOT NULL,
    heures        DECIMAL(4,1) NOT NULL DEFAULT 0,
    taux_horaire  INT NULL,                      -- override ponctuel ; sinon cmp_users.tarif_horaire
    libelle       VARCHAR(190) NULL,
    statut        ENUM('saisi','valide','paye') NOT NULL DEFAULT 'saisi',
    created_by    BIGINT NULL,
    created_at    DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    KEY idx_th_tenant (tenant_id),
    KEY idx_th_teacher (tenant_id, teacher_id, date_cours),
    CONSTRAINT fk_th_tenant FOREIGN KEY (tenant_id) REFERENCES cmp_tenants(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ── Paiement en ligne : journal des webhooks (idempotence) ──
CREATE TABLE IF NOT EXISTS cmp_payment_webhooks (
    id          BIGINT AUTO_INCREMENT PRIMARY KEY,
    tenant_id   BIGINT NULL,
    provider    VARCHAR(20) NOT NULL,
    event_id    VARCHAR(120) NOT NULL,
    reference   VARCHAR(80) NULL,
    payload     JSON NULL,
    processed   TINYINT(1) NOT NULL DEFAULT 0,
    received_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY uq_webhook_event (provider, event_id),
    KEY idx_webhook_ref (reference)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ── Registre des documents (vérification QR : bulletin, reçu, certificat, attestation, carte) ──
CREATE TABLE IF NOT EXISTS cmp_doc_registry (
    id         BIGINT AUTO_INCREMENT PRIMARY KEY,
    tenant_id  BIGINT NOT NULL,
    type       ENUM('bulletin','recu','certificat','attestation','carte','autre') NOT NULL DEFAULT 'autre',
    code       VARCHAR(40) NOT NULL,         -- code public imprimé/encodé dans le QR
    entity_ref VARCHAR(80) NULL,             -- id interne (élève, paiement…)
    issued_to  VARCHAR(190) NULL,
    issued_at  DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    data       JSON NULL,                    -- résumé public (nom, classe, montant…)
    valid      TINYINT(1) NOT NULL DEFAULT 1,
    UNIQUE KEY uq_doc_code (code),
    KEY idx_doc_tenant (tenant_id),
    CONSTRAINT fk_doc_tenant FOREIGN KEY (tenant_id) REFERENCES cmp_tenants(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
