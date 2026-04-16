#!/usr/bin/env node
// ============================================================
// Initialisation de la base de données VÉRITAS
// Usage : node scripts/init-db.js
// ============================================================
require('dotenv').config();
const fs = require('fs');
const path = require('path');
const { Pool } = require('pg');

async function initDB() {
  console.log('╔══════════════════════════════════════════════╗');
  console.log('║   VÉRITAS — Initialisation de la base       ║');
  console.log('╚══════════════════════════════════════════════╝');

  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
  });

  try {
    // Tester la connexion
    const testResult = await pool.query('SELECT NOW()');
    console.log('✅ Connexion PostgreSQL réussie :', testResult.rows[0].now);

    // Lire et exécuter le fichier SQL
    const sqlPath = path.join(__dirname, '..', 'database.sql');
    const sql = fs.readFileSync(sqlPath, 'utf8');

    console.log('📦 Exécution du schéma SQL...');
    await pool.query(sql);

    console.log('✅ Schéma créé avec succès !');

    // Vérifier les tables créées
    const tables = await pool.query(
      `SELECT tablename FROM pg_tables WHERE schemaname = 'public' ORDER BY tablename`
    );
    console.log('\n📋 Tables créées (' + tables.rows.length + ') :');
    tables.rows.forEach(t => console.log('   • ' + t.tablename));

    console.log('\n🎉 Base de données VÉRITAS prête !');
    console.log('   Prochaine étape : npm run db:migrate (pour importer vos données existantes)');

  } catch (err) {
    console.error('❌ Erreur :', err.message);
    if (err.message.includes('does not exist')) {
      console.log('\n💡 La base de données n\'existe pas encore. Créez-la avec :');
      console.log('   sudo -u postgres createdb veritas_db');
      console.log('   sudo -u postgres createuser veritas_user -P');
      console.log('   sudo -u postgres psql -c "GRANT ALL ON DATABASE veritas_db TO veritas_user;"');
    }
    process.exit(1);
  } finally {
    await pool.end();
  }
}

initDB();
