// ============================================================
// Routes Paiements
// ============================================================
const express = require('express');
const db = require('../db');
const { authenticateToken, requireAdmin } = require('../middleware/auth');

const router = express.Router();

// ── GET /api/payments ── Liste des paiements
router.get('/', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { statut, classe, student_id } = req.query;
    let query = 'SELECT * FROM payments';
    const params = [];
    const conditions = [];

    if (statut) { conditions.push('statut = $' + (params.length + 1)); params.push(statut); }
    if (classe) { conditions.push('classe = $' + (params.length + 1)); params.push(classe); }
    if (student_id) { conditions.push('student_id = $' + (params.length + 1)); params.push(student_id); }

    if (conditions.length) query += ' WHERE ' + conditions.join(' AND ');
    query += ' ORDER BY created_at DESC';

    const result = await db.query(query, params);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// ── POST /api/payments ── Enregistrer un paiement
router.post('/', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { id, student_id, student_name, classe, mois, montant, mode_paiement, date_paiement, statut, reference } = req.body;
    const newId = id || require('crypto').randomBytes(4).toString('hex');
    const ref = reference || 'REF-' + Date.now();

    const result = await db.query(
      `INSERT INTO payments (id, student_id, student_name, classe, mois, montant, mode_paiement, date_paiement, statut, reference)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10) RETURNING *`,
      [newId, student_id, student_name, classe, mois, montant, mode_paiement, date_paiement, statut || 'En attente', ref]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    if (err.code === '23505') return res.status(409).json({ error: 'Référence de paiement déjà utilisée' });
    console.error(err);
    res.status(500).json({ error: 'Erreur lors de l\'enregistrement' });
  }
});

// ── PUT /api/payments/:id ── Modifier un paiement
router.put('/:id', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { statut, mode_paiement, date_paiement, montant } = req.body;
    const result = await db.query(
      `UPDATE payments SET statut=$1, mode_paiement=$2, date_paiement=$3, montant=$4, updated_at=NOW()
       WHERE id = $5 RETURNING *`,
      [statut, mode_paiement, date_paiement, montant, req.params.id]
    );
    if (result.rows.length === 0) return res.status(404).json({ error: 'Paiement non trouvé' });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// ── Tentatives de paiement en ligne ──

// GET /api/payments/attempts
router.get('/attempts', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM pay_attempts ORDER BY created_at DESC');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// POST /api/payments/attempts ── Nouvelle tentative (depuis le frontend)
router.post('/attempts', async (req, res) => {
  try {
    const { montant, label, reference, methode, user_type, user_id } = req.body;
    const id = require('crypto').randomBytes(4).toString('hex');
    const ref = reference || 'VT' + new Date().toISOString().slice(2, 10).replace(/-/g, '') + '-' + Math.random().toString(36).substr(2, 4).toUpperCase();

    const result = await db.query(
      `INSERT INTO pay_attempts (id, montant, label, reference, methode, user_type, user_id)
       VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING *`,
      [id, montant, label, ref, methode, user_type, user_id]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// PATCH /api/payments/attempts/:id/confirm ── Confirmer un paiement
router.patch('/attempts/:id/confirm', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const result = await db.query(
      `UPDATE pay_attempts SET statut='confirmed', confirmed_by=$1, confirmed_at=NOW()
       WHERE id = $2 RETURNING *`,
      [req.user.id, req.params.id]
    );
    if (result.rows.length === 0) return res.status(404).json({ error: 'Tentative non trouvée' });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

module.exports = router;
