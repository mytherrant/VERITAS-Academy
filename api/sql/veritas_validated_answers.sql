-- ═══════════════════════════════════════════════════════════════════
-- VÉRITAS — Table de cache validé des réponses IA (Plan Élite)
-- À exécuter UNE SEULE FOIS sur la base MySQL LWS
-- ═══════════════════════════════════════════════════════════════════
-- Connexion :
--   phpMyAdmin LWS → base veritas → onglet SQL → coller ce fichier → Exécuter

CREATE TABLE IF NOT EXISTS veritas_validated_answers (
    id              INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,

    -- Identification unique de la question
    question_hash   CHAR(40)        NOT NULL,                -- SHA1 de la question normalisée
    question_text   VARCHAR(1000)   NOT NULL,
    answer_text     TEXT            NOT NULL,

    -- Métadonnées de la requête initiale
    requested_by    VARCHAR(64)     NULL,                    -- userId de l'élève qui a demandé
    requested_plan  VARCHAR(20)     NULL DEFAULT 'anon',     -- anon/free/starter/pro/elite
    created_at      TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP,

    -- Validation par un enseignant
    validated_by    VARCHAR(64)     NULL,                    -- userId du validateur (admin/teacher)
    validated_at    TIMESTAMP       NULL,
    rating          TINYINT         NULL,                    -- 1 à 5 étoiles
    rejection_note  VARCHAR(500)    NULL,                    -- raison du rejet si rejeté

    -- Classification pour faciliter la curation
    classe          VARCHAR(20)     NULL,                    -- 6e, 5e, 4e, 3e, 2nde, 1ère, Tle
    matiere         VARCHAR(50)     NULL,
    type_exercice   VARCHAR(50)     NULL,                    -- quiz, corrigé, fiche, dissertation...

    -- Statistiques
    use_count       INT UNSIGNED    NOT NULL DEFAULT 0,
    last_used_at    TIMESTAMP       NULL,

    -- Index pour les requêtes fréquentes
    UNIQUE KEY uniq_hash (question_hash),
    KEY idx_validated   (validated_at),
    KEY idx_classe_mat  (classe, matiere),
    KEY idx_created     (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Vue utile pour la page admin de validation (les réponses en attente)
CREATE OR REPLACE VIEW veritas_pending_answers AS
SELECT id, question_hash, question_text, answer_text, requested_by,
       requested_plan, created_at, classe, matiere, type_exercice
FROM veritas_validated_answers
WHERE validated_at IS NULL
ORDER BY created_at DESC;

-- Vue utile pour les stats : top des réponses les plus utilisées
CREATE OR REPLACE VIEW veritas_top_answers AS
SELECT id, question_text, rating, use_count, classe, matiere, validated_at
FROM veritas_validated_answers
WHERE validated_at IS NOT NULL
ORDER BY use_count DESC, rating DESC
LIMIT 100;
