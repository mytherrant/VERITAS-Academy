// ============================================================
// VÉRITAS Academy — Serveur Backend API
// ============================================================
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const path = require('path');

const db = require('./db');
const authRoutes = require('./routes/auth');
const studentsRoutes = require('./routes/students');
const gradesRoutes = require('./routes/grades');
const paymentsRoutes = require('./routes/payments');
const teachersRoutes = require('./routes/teachers');
const elearningRoutes = require('./routes/elearning');
const cmsRoutes = require('./routes/cms');
const syncRoutes = require('./routes/sync');

const app = express();
const PORT = process.env.PORT || 3000;

// ── Sécurité ──
app.use(helmet({
  contentSecurityPolicy: false,  // le HTML embarque des scripts inline
  crossOriginEmbedderPolicy: false
}));

// ── CORS ──
app.use(cors({
  origin: process.env.CORS_ORIGIN || '*',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// ── Compression ──
app.use(compression());

// ── Logs ──
app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));

// ── Body parsing ──
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// ── Rate limiting ──
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,   // 15 minutes
  max: 200,                     // 200 requêtes par fenêtre
  message: { error: 'Trop de requêtes. Réessayez dans quelques minutes.' }
});
app.use('/api/', limiter);

// ── Rate limiting plus strict pour login ──
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: { error: 'Trop de tentatives de connexion. Réessayez dans 15 minutes.' }
});
app.use('/api/auth/login', loginLimiter);

// ── Servir le fichier HTML (frontend) ──
app.use(express.static(path.join(__dirname, 'public')));

// ── Servir les fichiers uploadés ──
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ── Routes API ──
app.use('/api/auth', authRoutes);
app.use('/api/students', studentsRoutes);
app.use('/api/grades', gradesRoutes);
app.use('/api/payments', paymentsRoutes);
app.use('/api/teachers', teachersRoutes);
app.use('/api/elearning', elearningRoutes);
app.use('/api/cms', cmsRoutes);
app.use('/api/sync', syncRoutes);

// ── Route de santé ──
app.get('/api/health', async (req, res) => {
  try {
    const result = await db.query('SELECT NOW()');
    res.json({
      status: 'ok',
      timestamp: result.rows[0].now,
      version: '1.0.0',
      database: 'connected'
    });
  } catch (err) {
    res.status(500).json({ status: 'error', database: 'disconnected' });
  }
});

// ── Fallback : servir le HTML pour toutes les routes non-API ──
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// ── Gestion d'erreurs globale ──
app.use((err, req, res, next) => {
  console.error('Erreur serveur :', err.stack);
  res.status(err.status || 500).json({
    error: process.env.NODE_ENV === 'production'
      ? 'Erreur interne du serveur'
      : err.message
  });
});

// ── Démarrage ──
app.listen(PORT, () => {
  console.log(`
  ╔══════════════════════════════════════════════╗
  ║   VÉRITAS Academy — Backend API v1.0         ║
  ║   Port : ${PORT}                                ║
  ║   Mode : ${process.env.NODE_ENV || 'development'}                      ║
  ╚══════════════════════════════════════════════╝
  `);
});

module.exports = app;
