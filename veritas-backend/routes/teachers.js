// ============================================================
// Routes Enseignants
// ============================================================
const express = require('express');
const db = require('../db');
const { authenticateToken, requireAdmin } = require('../middleware/auth');

const router = express.Router();

router.get('/', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const result = await db.query('SELECT id, matricule, nom, prenom, matiere, grade, username, tel, salaire, statut, classes, titulaire, created_at FROM teachers ORDER BY nom');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const result = await db.query('SELECT id, matricule, nom, prenom, matiere, grade, username, tel, salaire, statut, classes, titulaire FROM teachers WHERE id = $1', [req.params.id]);
    if (result.rows.length === 0) return res.status(404).json({ error: 'Enseignant non trouvé' });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

router.post('/', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { id, matricule, nom, prenom, matiere, grade, username, tel, salaire, statut, classes, titulaire } = req.body;
    const newId = id || require('crypto').randomBytes(4).toString('hex');
    const result = await db.query(
      `INSERT INTO teachers (id, matricule, nom, prenom, matiere, grade, username, tel, salaire, statut, classes, titulaire)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12) RETURNING *`,
      [newId, matricule, nom, prenom, matiere, grade, username, tel, salaire || 0, statut || 'Actif', classes || [], titulaire]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erreur lors de la création' });
  }
});

router.put('/:id', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { nom, prenom, matiere, grade, tel, salaire, statut, classes, titulaire } = req.body;
    const result = await db.query(
      `UPDATE teachers SET nom=$1, prenom=$2, matiere=$3, grade=$4, tel=$5, salaire=$6, statut=$7, classes=$8, titulaire=$9, updated_at=NOW()
       WHERE id = $10 RETURNING *`,
      [nom, prenom, matiere, grade, tel, salaire, statut, classes, titulaire, req.params.id]
    );
    if (result.rows.length === 0) return res.status(404).json({ error: 'Enseignant non trouvé' });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

router.delete('/:id', authenticateToken, requireAdmin, async (req, res) => {
  try {
    await db.query('DELETE FROM teachers WHERE id = $1', [req.params.id]);
    res.json({ message: 'Enseignant supprimé' });
  } catch (err) {
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// ── GET /api/teachers/:id/hours ──
router.get('/:id/hours', authenticateToken, async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM teacher_hours WHERE teacher_id = $1 ORDER BY date_cours DESC', [req.params.id]);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// ── POST /api/teachers/:id/hours ──
router.post('/:id/hours', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { heures, classe, matiere, description, date_cours } = req.body;
    const id = require('crypto').randomBytes(4).toString('hex');
    const result = await db.query(
      `INSERT INTO teacher_hours (id, teacher_id, date_cours, heures, classe, matiere, description)
       VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING *`,
      [id, req.params.id, date_cours, heures, classe, matiere, description]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

module.exports = router;
