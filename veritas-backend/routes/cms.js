// ============================================================
// Routes CMS (Contenu public, citations, ticker, galerie...)
// ============================================================
const express = require('express');
const db = require('../db');
const { authenticateToken, requireAdmin } = require('../middleware/auth');

const router = express.Router();

// ── Public Info (lecture publique) ──
router.get('/public-info', async (req, res) => {
  try {
    const school = await db.query('SELECT * FROM school_config WHERE id = 1');
    const info = await db.query('SELECT * FROM public_info WHERE id = 1');
    const citations = await db.query('SELECT texte, auteur FROM citations WHERE actif = TRUE ORDER BY id');
    const examResults = await db.query(
      `SELECT er.id, er.annee, json_agg(json_build_object('cls', ern.classe, 'taux', ern.taux, 'candidats', ern.candidats, 'admis', ern.admis) ORDER BY ern.id) as niveaux
       FROM exam_results er LEFT JOIN exam_result_niveaux ern ON ern.exam_result_id = er.id
       GROUP BY er.id, er.annee ORDER BY er.annee DESC`
    );

    res.json({
      school: school.rows[0] || {},
      publicInfo: info.rows[0] || {},
      citations: citations.rows,
      examResults: examResults.rows
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// ── Modifier infos publiques (admin) ──
router.put('/public-info', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { slogan2, description, histoire, equipe, horaires, email, whatsapp } = req.body;
    await db.query(
      `UPDATE public_info SET slogan2=$1, description=$2, histoire=$3, equipe=$4, horaires=$5, email=$6, whatsapp=$7, updated_at=NOW() WHERE id=1`,
      [slogan2, description, histoire, equipe, horaires, email, whatsapp]
    );
    res.json({ message: 'Informations mises à jour' });
  } catch (err) {
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// ── Citations ──
router.get('/citations', async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM citations WHERE actif = TRUE ORDER BY id');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

router.post('/citations', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { texte, auteur } = req.body;
    const result = await db.query('INSERT INTO citations (texte, auteur) VALUES ($1, $2) RETURNING *', [texte, auteur]);
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

router.delete('/citations/:id', authenticateToken, requireAdmin, async (req, res) => {
  try {
    await db.query('DELETE FROM citations WHERE id = $1', [req.params.id]);
    res.json({ message: 'Citation supprimée' });
  } catch (err) {
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// ── Ticker ──
router.get('/ticker', async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM ticker_items WHERE actif = TRUE ORDER BY ordre');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// ── Produits boutique (lecture publique) ──
router.get('/products', async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM products WHERE actif = TRUE ORDER BY titre');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// ── Livres boutique (lecture publique) ──
router.get('/books', async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM books ORDER BY titre');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// ── Avis sur les livres (lecture publique) ──
router.get('/books/:id/reviews', async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM book_reviews WHERE book_id = $1 ORDER BY created_at DESC', [req.params.id]);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// ── Annonces ──
router.get('/announcements', async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM announcements ORDER BY created_at DESC LIMIT 20');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// ── Orientation ──
router.post('/orientation', async (req, res) => {
  try {
    const { nom, tel, niveau, type_service, disponibilite, message } = req.body;
    const id = require('crypto').randomBytes(4).toString('hex');
    const today = new Date().toLocaleDateString('fr-FR');
    await db.query(
      `INSERT INTO orientation_demandes (id, nom, tel, niveau, type_service, disponibilite, message, date_demande)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8)`,
      [id, nom, tel, niveau, type_service, disponibilite, message, today]
    );
    res.status(201).json({ message: 'Demande enregistrée' });
  } catch (err) {
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

router.get('/orientation', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM orientation_demandes ORDER BY created_at DESC');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

module.exports = router;
