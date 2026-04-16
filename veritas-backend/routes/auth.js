// ============================================================
// Routes d'authentification
// ============================================================
const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../db');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();
const SALT_ROUNDS = 12;

// ── POST /api/auth/login ──
router.post('/login', async (req, res) => {
  try {
    const { username, password, type } = req.body;
    if (!username || !password) {
      return res.status(400).json({ error: 'Identifiant et mot de passe requis' });
    }

    let user = null;
    let userType = type || 'admin';

    // 1. Essayer admin / superadmin
    if (!type || type === 'admin' || type === 'superadmin') {
      const adminResult = await db.query(
        'SELECT * FROM admins WHERE username = $1', [username]
      );
      if (adminResult.rows.length > 0) {
        const admin = adminResult.rows[0];
        const valid = await bcrypt.compare(password, admin.password_hash);
        if (valid) {
          user = { id: admin.id, nom: admin.nom, type: admin.is_super_admin ? 'superadmin' : 'admin', role: admin.role };
        }
      }
    }

    // 2. Essayer enseignant
    if (!user && (!type || type === 'enseignant')) {
      const teacherResult = await db.query(
        'SELECT * FROM teachers WHERE username = $1', [username]
      );
      if (teacherResult.rows.length > 0) {
        const teacher = teacherResult.rows[0];
        if (teacher.password_hash) {
          const valid = await bcrypt.compare(password, teacher.password_hash);
          if (valid) {
            user = { id: teacher.id, nom: teacher.prenom + ' ' + teacher.nom, type: 'enseignant', matiere: teacher.matiere };
          }
        }
      }
    }

    // 3. Essayer élève
    if (!user && (!type || type === 'eleve')) {
      const studentResult = await db.query(
        `SELECT sa.*, s.nom, s.prenom, s.classe, s.matricule
         FROM student_accounts sa
         JOIN students s ON s.id = sa.student_id
         WHERE sa.username = $1`, [username]
      );
      if (studentResult.rows.length > 0) {
        const sa = studentResult.rows[0];
        const valid = await bcrypt.compare(password, sa.password_hash);
        if (valid) {
          user = { id: sa.student_id, nom: sa.prenom + ' ' + sa.nom, type: 'eleve', classe: sa.classe, matricule: sa.matricule };
        }
      }
    }

    // 4. Essayer visiteur
    if (!user && (!type || type === 'visiteur')) {
      const visitorResult = await db.query(
        'SELECT * FROM visitor_accounts WHERE email = $1', [username]
      );
      if (visitorResult.rows.length > 0) {
        const visitor = visitorResult.rows[0];
        const valid = await bcrypt.compare(password, visitor.password_hash);
        if (valid) {
          user = { id: visitor.id, nom: visitor.nom, type: 'visiteur_inscrit', email: visitor.email };
        }
      }
    }

    if (!user) {
      // Log de la tentative échouée
      await db.query(
        'INSERT INTO login_log (user_type, username, ip_address, success) VALUES ($1, $2, $3, $4)',
        [type || 'unknown', username, req.ip, false]
      );
      return res.status(401).json({ error: 'Identifiant ou mot de passe incorrect' });
    }

    // Générer les tokens
    const token = jwt.sign(
      { id: user.id, type: user.type, nom: user.nom },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '15m' }
    );

    const refreshToken = jwt.sign(
      { id: user.id, type: user.type },
      process.env.JWT_REFRESH_SECRET,
      { expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d' }
    );

    // Sauvegarder la session
    await db.query(
      `INSERT INTO sessions (user_type, user_id, token, refresh_token, ip_address, user_agent, expires_at)
       VALUES ($1, $2, $3, $4, $5, $6, NOW() + INTERVAL '7 days')`,
      [user.type, user.id, token, refreshToken, req.ip, req.headers['user-agent']]
    );

    // Log de connexion réussie
    await db.query(
      'INSERT INTO login_log (user_type, username, ip_address, success) VALUES ($1, $2, $3, $4)',
      [user.type, username, req.ip, true]
    );

    res.json({
      token,
      refreshToken,
      user: {
        id: user.id,
        type: user.type,
        nom: user.nom,
        ...user
      }
    });
  } catch (err) {
    console.error('Erreur login :', err);
    res.status(500).json({ error: 'Erreur serveur lors de la connexion' });
  }
});

// ── POST /api/auth/refresh ──
router.post('/refresh', async (req, res) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) {
      return res.status(400).json({ error: 'Refresh token requis' });
    }

    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);

    // Vérifier que la session existe encore
    const session = await db.query(
      'SELECT * FROM sessions WHERE refresh_token = $1 AND expires_at > NOW()', [refreshToken]
    );
    if (session.rows.length === 0) {
      return res.status(401).json({ error: 'Session expirée' });
    }

    // Nouveau token
    const newToken = jwt.sign(
      { id: decoded.id, type: decoded.type, nom: decoded.nom },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '15m' }
    );

    // Mettre à jour la session
    await db.query(
      'UPDATE sessions SET token = $1 WHERE refresh_token = $2',
      [newToken, refreshToken]
    );

    res.json({ token: newToken });
  } catch (err) {
    res.status(401).json({ error: 'Refresh token invalide' });
  }
});

// ── POST /api/auth/logout ──
router.post('/logout', authenticateToken, async (req, res) => {
  try {
    const token = req.headers['authorization']?.split(' ')[1];
    await db.query('DELETE FROM sessions WHERE token = $1', [token]);
    res.json({ message: 'Déconnexion réussie' });
  } catch (err) {
    res.status(500).json({ error: 'Erreur lors de la déconnexion' });
  }
});

// ── GET /api/auth/me ──
router.get('/me', authenticateToken, async (req, res) => {
  res.json({ user: req.user });
});

// ── POST /api/auth/register (visiteurs uniquement) ──
router.post('/register', async (req, res) => {
  try {
    const { nom, email, tel, password } = req.body;
    if (!nom || !email || !password) {
      return res.status(400).json({ error: 'Nom, email et mot de passe requis' });
    }

    // Vérifier unicité
    const existing = await db.query('SELECT id FROM visitor_accounts WHERE email = $1', [email]);
    if (existing.rows.length > 0) {
      return res.status(409).json({ error: 'Un compte existe déjà avec cet email' });
    }

    const hash = await bcrypt.hash(password, SALT_ROUNDS);
    const id = require('crypto').randomBytes(4).toString('hex');

    await db.query(
      'INSERT INTO visitor_accounts (id, nom, email, tel, password_hash) VALUES ($1, $2, $3, $4, $5)',
      [id, nom, email, tel || null, hash]
    );

    res.status(201).json({ message: 'Compte créé avec succès', id });
  } catch (err) {
    console.error('Erreur inscription :', err);
    res.status(500).json({ error: 'Erreur lors de l\'inscription' });
  }
});

module.exports = router;
