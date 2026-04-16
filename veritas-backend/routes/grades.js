// ============================================================
// Routes Notes
// ============================================================
const express = require('express');
const db = require('../db');
const { authenticateToken, requireAdmin, requireTeacherOrAdmin } = require('../middleware/auth');

const router = express.Router();

// ── GET /api/grades ── Toutes les notes (filtrable)
router.get('/', authenticateToken, requireTeacherOrAdmin, async (req, res) => {
  try {
    const { classe, trimestre, matiere, student_id } = req.query;
    let query = 'SELECT * FROM grades';
    const params = [];
    const conditions = [];

    if (classe) { conditions.push('classe = $' + (params.length + 1)); params.push(classe); }
    if (trimestre) { conditions.push('trimestre = $' + (params.length + 1)); params.push(trimestre); }
    if (matiere) { conditions.push('matiere = $' + (params.length + 1)); params.push(matiere); }
    if (student_id) { conditions.push('student_id = $' + (params.length + 1)); params.push(student_id); }

    if (conditions.length) query += ' WHERE ' + conditions.join(' AND ');
    query += ' ORDER BY classe, student_name, matiere';

    const result = await db.query(query, params);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erreur lors de la récupération des notes' });
  }
});

// ── POST /api/grades ── Ajouter une note
router.post('/', authenticateToken, requireTeacherOrAdmin, async (req, res) => {
  try {
    const { id, student_id, student_name, student_mat, classe, matiere, note_1, note_2, coefficient, trimestre, enseignant, teacher_id } = req.body;
    const newId = id || require('crypto').randomBytes(4).toString('hex');

    const result = await db.query(
      `INSERT INTO grades (id, student_id, student_name, student_mat, classe, matiere, note_1, note_2, coefficient, trimestre, enseignant, teacher_id)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12) RETURNING *`,
      [newId, student_id, student_name, student_mat, classe, matiere, note_1, note_2, coefficient || 1, trimestre, enseignant, teacher_id]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erreur lors de l\'ajout de la note' });
  }
});

// ── PUT /api/grades/:id ── Modifier une note
router.put('/:id', authenticateToken, requireTeacherOrAdmin, async (req, res) => {
  try {
    const { note_1, note_2, coefficient, trimestre } = req.body;
    const result = await db.query(
      `UPDATE grades SET note_1=$1, note_2=$2, coefficient=$3, trimestre=$4, updated_at=NOW()
       WHERE id = $5 RETURNING *`,
      [note_1, note_2, coefficient, trimestre, req.params.id]
    );
    if (result.rows.length === 0) return res.status(404).json({ error: 'Note non trouvée' });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Erreur lors de la modification' });
  }
});

// ── DELETE /api/grades/:id ──
router.delete('/:id', authenticateToken, requireAdmin, async (req, res) => {
  try {
    await db.query('DELETE FROM grades WHERE id = $1', [req.params.id]);
    res.json({ message: 'Note supprimée' });
  } catch (err) {
    res.status(500).json({ error: 'Erreur lors de la suppression' });
  }
});

module.exports = router;
