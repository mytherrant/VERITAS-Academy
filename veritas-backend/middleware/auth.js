// ============================================================
// Middleware d'authentification JWT
// ============================================================
const jwt = require('jsonwebtoken');
const db = require('../db');

// Vérifier le token JWT
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // "Bearer TOKEN"

  if (!token) {
    return res.status(401).json({ error: 'Token d\'authentification requis' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // { id, type, nom }
    next();
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({ error: 'Session expirée. Reconnectez-vous.', code: 'TOKEN_EXPIRED' });
    }
    return res.status(403).json({ error: 'Token invalide' });
  }
}

// Vérifier que l'utilisateur est admin
function requireAdmin(req, res, next) {
  if (!req.user || (req.user.type !== 'admin' && req.user.type !== 'superadmin')) {
    return res.status(403).json({ error: 'Accès réservé aux administrateurs' });
  }
  next();
}

// Vérifier que l'utilisateur est super admin
function requireSuperAdmin(req, res, next) {
  if (!req.user || req.user.type !== 'superadmin') {
    return res.status(403).json({ error: 'Accès réservé au super administrateur' });
  }
  next();
}

// Vérifier que l'utilisateur est enseignant ou admin
function requireTeacherOrAdmin(req, res, next) {
  if (!req.user || !['admin', 'superadmin', 'enseignant'].includes(req.user.type)) {
    return res.status(403).json({ error: 'Accès réservé aux enseignants et administrateurs' });
  }
  next();
}

module.exports = {
  authenticateToken,
  requireAdmin,
  requireSuperAdmin,
  requireTeacherOrAdmin
};
