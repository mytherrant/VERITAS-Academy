// ============================================================
// Routes Élèves
// ============================================================
const express = require('express');
const db = require('../db');
const { authenticateToken, requireAdmin, requireTeacherOrAdmin } = require('../middleware/auth');

const router = express.Router();

// ── GET /api/students ── Liste de tous les élèves
router.get('/', authenticateToken, requireTeacherOrAdmin, async (req, res) => {
  try {
    const { classe, search } = req.query;
    let query = 'SELECT * FROM students';
    const params = [];
    const conditions = [];

    if (classe) {
      conditions.push('classe = $' + (params.length + 1));
      params.push(classe);
    }
    if (search) {
      conditions.push('(LOWER(nom) LIKE $' + (params.length + 1) + ' OR LOWER(prenom) LIKE $' + (params.length + 1) + ' OR matricule LIKE $' + (params.length + 1) + ')');
      params.push('%' + search.toLowerCase() + '%');
    }

    if (conditions.length) query += ' WHERE ' + conditions.join(' AND ');
    query += ' ORDER BY classe, nom, prenom';

    const result = await db.query(query, params);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erreur lors de la récupération des élèves' });
  }
});

// ── GET /api/students/:id ── Un élève
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    // Un élève ne peut voir que ses propres données
    if (req.user.type === 'eleve' && req.user.id !== req.params.id) {
      return res.status(403).json({ error: 'Accès non autorisé' });
    }
    const result = await db.query('SELECT * FROM students WHERE id = $1', [req.params.id]);
    if (result.rows.length === 0) return res.status(404).json({ error: 'Élève non trouvé' });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// ── POST /api/students ── Créer un élève
router.post('/', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { id, matricule, nom, prenom, sexe, date_naissance, classe, tel, parent_nom, parent_tel, frais_scolarite, date_inscription, statut } = req.body;
    const newId = id || require('crypto').randomBytes(4).toString('hex');

    const result = await db.query(
      `INSERT INTO students (id, matricule, nom, prenom, sexe, date_naissance, classe, tel, parent_nom, parent_tel, frais_scolarite, date_inscription, statut)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13) RETURNING *`,
      [newId, matricule, nom, prenom, sexe, date_naissance, classe, tel, parent_nom, parent_tel, frais_scolarite || 0, date_inscription, statut || 'En attente']
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    if (err.code === '23505') return res.status(409).json({ error: 'Matricule déjà utilisé' });
    console.error(err);
    res.status(500).json({ error: 'Erreur lors de la création' });
  }
});

// ── PUT /api/students/:id ── Modifier un élève
router.put('/:id', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { nom, prenom, sexe, date_naissance, classe, tel, parent_nom, parent_tel, frais_scolarite, statut } = req.body;
    const result = await db.query(
      `UPDATE students SET nom=$1, prenom=$2, sexe=$3, date_naissance=$4, classe=$5, tel=$6,
       parent_nom=$7, parent_tel=$8, frais_scolarite=$9, statut=$10, updated_at=NOW()
       WHERE id = $11 RETURNING *`,
      [nom, prenom, sexe, date_naissance, classe, tel, parent_nom, parent_tel, frais_scolarite, statut, req.params.id]
    );
    if (result.rows.length === 0) return res.status(404).json({ error: 'Élève non trouvé' });
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erreur lors de la modification' });
  }
});

// ── DELETE /api/students/:id ── Supprimer un élève
router.delete('/:id', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const result = await db.query('DELETE FROM students WHERE id = $1 RETURNING id', [req.params.id]);
    if (result.rows.length === 0) return res.status(404).json({ error: 'Élève non trouvé' });
    res.json({ message: 'Élève supprimé', id: req.params.id });
  } catch (err) {
    res.status(500).json({ error: 'Erreur lors de la suppression' });
  }
});

// ── GET /api/students/:id/grades ── Notes d'un élève
router.get('/:id/grades', authenticateToken, async (req, res) => {
  try {
    if (req.user.type === 'eleve' && req.user.id !== req.params.id) {
      return res.status(403).json({ error: 'Accès non autorisé' });
    }
    const { trimestre } = req.query;
    let query = 'SELECT * FROM grades WHERE student_id = $1';
    const params = [req.params.id];
    if (trimestre) {
      query += ' AND trimestre = $2';
      params.push(trimestre);
    }
    query += ' ORDER BY matiere';
    const result = await db.query(query, params);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// ── GET /api/students/:id/absences ── Absences d'un élève
router.get('/:id/absences', authenticateToken, async (req, res) => {
  try {
    if (req.user.type === 'eleve' && req.user.id !== req.params.id) {
      return res.status(403).json({ error: 'Accès non autorisé' });
    }
    const result = await db.query('SELECT * FROM absences WHERE student_id = $1 ORDER BY date_absence DESC', [req.params.id]);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// ── GET /api/students/:id/payments ── Paiements d'un élève
router.get('/:id/payments', authenticateToken, async (req, res) => {
  try {
    if (req.user.type === 'eleve' && req.user.id !== req.params.id) {
      return res.status(403).json({ error: 'Accès non autorisé' });
    }
    const result = await db.query('SELECT * FROM payments WHERE student_id = $1 ORDER BY created_at DESC', [req.params.id]);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

module.exports = router;
