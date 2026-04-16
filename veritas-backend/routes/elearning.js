// ============================================================
// Routes E-Learning
// ============================================================
const express = require('express');
const db = require('../db');
const { authenticateToken, requireAdmin } = require('../middleware/auth');

const router = express.Router();

// ── Plans ──
router.get('/plans', async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM elearning_plans ORDER BY prix');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// ── Catégories ──
router.get('/categories', async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM elearning_categories');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// ── Contenus (public : aperçu seulement / connecté : tout) ──
router.get('/contenus', async (req, res) => {
  try {
    const { classe, matiere, categorie, gratuit } = req.query;
    let query = 'SELECT * FROM elearning_contenus';
    const params = [];
    const conditions = [];

    if (classe) { conditions.push('classe = $' + (params.length + 1)); params.push(classe); }
    if (matiere) { conditions.push('matiere = $' + (params.length + 1)); params.push(matiere); }
    if (categorie) { conditions.push('categorie_id = $' + (params.length + 1)); params.push(categorie); }
    if (gratuit === 'true') { conditions.push('gratuit = TRUE'); }

    if (conditions.length) query += ' WHERE ' + conditions.join(' AND ');
    query += ' ORDER BY classe, matiere, titre';

    const result = await db.query(query, params);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// ── POST /api/elearning/contenus ── Ajouter un contenu (admin)
router.post('/contenus', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { id, categorie_id, titre, classe, matiere, sequence, prix, gratuit, plans, apercu, description, res_pedago } = req.body;
    const newId = id || require('crypto').randomBytes(4).toString('hex');
    const result = await db.query(
      `INSERT INTO elearning_contenus (id, categorie_id, titre, classe, matiere, sequence, prix, gratuit, plans, apercu, description, res_pedago)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12) RETURNING *`,
      [newId, categorie_id, titre, classe, matiere, sequence, prix || 0, gratuit || false, plans || [], apercu, description, res_pedago]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// ── Abonnements ──
router.get('/subscriptions', authenticateToken, async (req, res) => {
  try {
    let query = 'SELECT * FROM elearning_subscriptions';
    if (req.user.type !== 'admin' && req.user.type !== 'superadmin') {
      query += ' WHERE user_id = $1';
      const result = await db.query(query, [req.user.id]);
      return res.json(result.rows);
    }
    const result = await db.query(query + ' ORDER BY created_at DESC');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

router.post('/subscribe', authenticateToken, async (req, res) => {
  try {
    const { plan_id, payment_ref } = req.body;
    const id = require('crypto').randomBytes(4).toString('hex');
    const result = await db.query(
      `INSERT INTO elearning_subscriptions (id, user_type, user_id, plan_id, date_fin, payment_ref)
       VALUES ($1,$2,$3,$4, NOW() + INTERVAL '1 year', $5) RETURNING *`,
      [id, req.user.type, req.user.id, plan_id, payment_ref]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

module.exports = router;
