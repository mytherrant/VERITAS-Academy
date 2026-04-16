#!/usr/bin/env node
// ============================================================
// Migration des données depuis le fichier HTML vers PostgreSQL
// Usage : node scripts/migrate-from-html.js [chemin/vers/VERITAS_v1.0.html]
// ============================================================
require('dotenv').config();
const fs = require('fs');
const path = require('path');
const bcrypt = require('bcrypt');
const { Pool } = require('pg');

const SALT_ROUNDS = 12;

async function migrate() {
  const htmlPath = process.argv[2] || path.join(__dirname, '..', 'public', 'VERITAS_v1.0.html');

  console.log('╔══════════════════════════════════════════════╗');
  console.log('║   VÉRITAS — Migration HTML → PostgreSQL      ║');
  console.log('╚══════════════════════════════════════════════╝');
  console.log('📄 Fichier source :', htmlPath);

  if (!fs.existsSync(htmlPath)) {
    console.error('❌ Fichier non trouvé :', htmlPath);
    console.log('   Usage : node scripts/migrate-from-html.js chemin/vers/VERITAS_v1.0.html');
    process.exit(1);
  }

  // Extraire defaultDB() du HTML
  console.log('🔍 Extraction de defaultDB() depuis le HTML...');
  const html = fs.readFileSync(htmlPath, 'utf8');

  // Trouver le bloc script principal
  const scriptMatch = html.match(/<script\b[^>]*>([\s\S]*?function\s+defaultDB[\s\S]*?)<\/script>/);
  if (!scriptMatch) {
    console.error('❌ Impossible de trouver defaultDB() dans le HTML');
    process.exit(1);
  }

  // Extraire et évaluer defaultDB
  const scriptContent = scriptMatch[1];
  const dbMatch = scriptContent.match(/function\s+defaultDB\s*\(\s*\)\s*\{return\s*(\{[\s\S]*?\})\s*;\s*\}/);
  if (!dbMatch) {
    console.error('❌ Impossible de parser defaultDB()');
    process.exit(1);
  }

  // Créer un environnement isolé pour évaluer la fonction
  let DB;
  try {
    // On doit fournir gid() car defaultDB l'utilise
    const gid = () => Math.random().toString(36).substr(2, 8);
    const evalCode = `(function(gid){ return ${dbMatch[1]}; })`;
    DB = eval(evalCode)(gid);
    console.log('✅ defaultDB() extrait avec succès');
    console.log('   Élèves :', DB.students?.length || 0);
    console.log('   Enseignants :', DB.teachers?.length || 0);
    console.log('   Notes :', DB.grades?.length || 0);
    console.log('   Paiements :', DB.payments?.length || 0);
  } catch (err) {
    console.error('❌ Erreur lors de l\'évaluation de defaultDB() :', err.message);
    console.log('💡 Alternative : utilisez l\'API /api/sync/upload depuis le navigateur');
    process.exit(1);
  }

  // Connexion à PostgreSQL
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
  });

  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    // School config
    console.log('📦 Migration school_config...');
    if (DB.school) {
      await client.query(
        `INSERT INTO school_config (id, nom, slogan, ville, tel, bp, directeur, annee, taux_horaire)
         VALUES (1, $1,$2,$3,$4,$5,$6,$7,$8)
         ON CONFLICT (id) DO UPDATE SET nom=$1, slogan=$2, ville=$3, tel=$4, bp=$5, directeur=$6, annee=$7, taux_horaire=$8`,
        [DB.school.nom, DB.school.slogan, DB.school.ville, DB.school.tel, DB.school.bp, DB.school.directeur, DB.school.annee, DB.tauxHoraire || 2000]
      );
    }

    // Public info
    if (DB.publicInfo) {
      const pi = DB.publicInfo;
      await client.query(
        `INSERT INTO public_info (id, slogan2, description, histoire, equipe, horaires, email, whatsapp)
         VALUES (1, $1,$2,$3,$4,$5,$6,$7)
         ON CONFLICT (id) DO UPDATE SET slogan2=$1, description=$2, histoire=$3, equipe=$4, horaires=$5, email=$6, whatsapp=$7`,
        [pi.slogan2, pi.description, pi.histoire, pi.equipe, pi.horaires, pi.email, pi.whatsapp]
      );
    }

    // Students
    console.log('📦 Migration élèves...');
    for (const s of (DB.students || [])) {
      await client.query(
        `INSERT INTO students (id, matricule, nom, prenom, sexe, date_naissance, classe, tel, parent_nom, parent_tel, frais_scolarite, date_inscription, statut)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13)
         ON CONFLICT (id) DO NOTHING`,
        [s.id, s.mat, s.nom, s.pre, s.sex, s.dob, s.cls, s.tel, s.parent, s.ptel, s.frais, s.ins, s.stat]
      );
    }

    // Teachers
    console.log('📦 Migration enseignants...');
    for (const t of (DB.teachers || [])) {
      await client.query(
        `INSERT INTO teachers (id, matricule, nom, prenom, matiere, grade, username, tel, salaire, statut, classes, titulaire)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12)
         ON CONFLICT (id) DO NOTHING`,
        [t.id, t.mat, t.nom, t.pre, t.mat2, t.grade, t.user, t.tel, t.sal, t.stat, t.classes || [], t.titulaire]
      );
    }

    // Teacher passwords
    if (DB.tpwd) {
      console.log('🔐 Hashage des mots de passe enseignants...');
      for (const [username, pwd] of Object.entries(DB.tpwd)) {
        const hash = await bcrypt.hash(pwd, SALT_ROUNDS);
        await client.query('UPDATE teachers SET password_hash = $1 WHERE username = $2', [hash, username]);
      }
    }

    // Admins
    console.log('🔐 Migration admins...');
    for (const a of (DB.admins || [])) {
      const hash = await bcrypt.hash(a.pwd, SALT_ROUNDS);
      await client.query(
        `INSERT INTO admins (id, username, password_hash, nom, role, role2)
         VALUES ($1,$2,$3,$4,$5,$6) ON CONFLICT (id) DO NOTHING`,
        [a.id, a.user, hash, a.nom, a.role, a.role2]
      );
    }

    // Super admin
    if (DB.superAdmin) {
      const hash = await bcrypt.hash(DB.superAdmin.pwd, SALT_ROUNDS);
      await client.query(
        `INSERT INTO admins (id, username, password_hash, nom, role, role2, is_super_admin)
         VALUES ('superadmin', $1, $2, $3, 'Super Admin', 'superadmin', TRUE) ON CONFLICT (id) DO NOTHING`,
        [DB.superAdmin.user, hash, DB.superAdmin.nom]
      );
    }

    // Student accounts
    console.log('🔐 Hashage des mots de passe élèves...');
    for (const sa of (DB.studentAccounts || [])) {
      const hash = await bcrypt.hash(sa.pwd, SALT_ROUNDS);
      await client.query(
        `INSERT INTO student_accounts (id, student_id, username, password_hash)
         VALUES ($1,$2,$3,$4) ON CONFLICT (id) DO NOTHING`,
        [sa.id, sa.eid, sa.user, hash]
      );
    }

    // Grades
    console.log('📦 Migration notes...');
    for (const g of (DB.grades || [])) {
      await client.query(
        `INSERT INTO grades (id, student_id, student_name, student_mat, classe, matiere, note_1, note_2, coefficient, trimestre, enseignant)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11) ON CONFLICT (id) DO NOTHING`,
        [g.id, g.eid, g.enom, g.mat, g.cls, g.sub, g.n1, g.n2, g.coef, g.tri, g.ens]
      );
    }

    // Payments
    console.log('📦 Migration paiements...');
    for (const p of (DB.payments || [])) {
      await client.query(
        `INSERT INTO payments (id, student_id, student_name, classe, mois, montant, mode_paiement, date_paiement, statut, reference)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10) ON CONFLICT (id) DO NOTHING`,
        [p.id, p.eid, p.enom, p.cls, p.mo, p.mnt, p.mode, p.dt, p.stat, p.ref]
      );
    }

    // Absences
    console.log('📦 Migration absences...');
    for (const a of (DB.absences || [])) {
      await client.query(
        `INSERT INTO absences (id, student_id, date_absence, heures, matiere, motif, justifie)
         VALUES ($1,$2,$3,$4,$5,$6,$7) ON CONFLICT (id) DO NOTHING`,
        [a.id, a.eid, a.date, a.heures, a.matiere, a.motif, a.justifie]
      );
    }

    // Books
    console.log('📦 Migration boutique...');
    for (const b of (DB.books || [])) {
      await client.query(
        `INSERT INTO books (id, titre, classe, auteur, prix, stock, vendu, pages, icone, description, chapitres, cover_color, extrait)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13) ON CONFLICT (id) DO NOTHING`,
        [b.id, b.titre, b.cls, b.auteur, b.prix, b.stock, b.vendu, b.pages, b.ico, b.desc, b.chaps || [], b.coverColor, b.extrait]
      );
    }

    // Products
    for (const p of (DB.products || [])) {
      await client.query(
        `INSERT INTO products (id, icone, titre, prix, ancien_prix, description, categorie, photo, actif)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9) ON CONFLICT (id) DO NOTHING`,
        [p.id, p.ico, p.titre, p.prix, p.ancien, p.desc, p.cat, p.photo, p.actif]
      );
    }

    // Promo codes
    for (const p of (DB.promoCodes || [])) {
      await client.query(
        `INSERT INTO promo_codes (id, code, reduction, type_reduction, description, actif, usage_count)
         VALUES ($1,$2,$3,$4,$5,$6,$7) ON CONFLICT (id) DO NOTHING`,
        [p.id, p.code, p.reduction, p.type, p.desc, p.actif, p.usage || 0]
      );
    }

    // Devoirs
    for (const d of (DB.devoirs || [])) {
      await client.query(
        `INSERT INTO devoirs (id, teacher_id, matiere, classe, titre, description, date_limite, trimestre)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8) ON CONFLICT (id) DO NOTHING`,
        [d.id, d.tid, d.sub, d.cls, d.titre, d.desc, d.dateLimit, d.tri]
      );
    }

    // E-learning
    console.log('📦 Migration e-learning...');
    for (const p of (DB.elearning?.plans || [])) {
      await client.query(
        `INSERT INTO elearning_plans (id, nom, cible, prix, ancien_prix, duree, populaire, plan_tags, avantages)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9) ON CONFLICT (id) DO NOTHING`,
        [p.id, p.nom, p.cible, p.prix, p.ancien, p.duree, p.populaire, p.planTags || [], p.avantages || []]
      );
    }

    for (const c of (DB.elearning?.categories || [])) {
      await client.query(
        `INSERT INTO elearning_categories (id, nom, icone, description)
         VALUES ($1,$2,$3,$4) ON CONFLICT (id) DO NOTHING`,
        [c.id, c.nom, c.ico, c.desc]
      );
    }

    for (const c of (DB.elearning?.contenus || [])) {
      await client.query(
        `INSERT INTO elearning_contenus (id, categorie_id, titre, classe, matiere, sequence, prix, gratuit, plans, apercu, description, res_pedago)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12) ON CONFLICT (id) DO NOTHING`,
        [c.id, c.cat, c.titre, c.classe, c.matiere, c.seq, c.prix, c.gratuit, c.plans || [], c.apercu, c.desc, c.resPedago || null]
      );
    }

    // Citations
    console.log('📦 Migration citations...');
    for (const c of (DB.citations || [])) {
      await client.query('INSERT INTO citations (texte, auteur) VALUES ($1, $2)', [c.texte, c.auteur]);
    }

    // Depenses
    for (const d of (DB.depenses || [])) {
      await client.query(
        `INSERT INTO depenses (id, categorie, description, montant, date_depense)
         VALUES ($1,$2,$3,$4,$5) ON CONFLICT (id) DO NOTHING`,
        [d.id, d.cat, d.desc, d.mnt, d.dt]
      );
    }

    // Teacher hours
    for (const th of (DB.teacherHours || [])) {
      await client.query(
        `INSERT INTO teacher_hours (id, teacher_id, date_cours, heures, classe, matiere, description)
         VALUES ($1,$2,$3,$4,$5,$6,$7) ON CONFLICT (id) DO NOTHING`,
        [th.id, th.tid, th.date, th.heures, th.cls, th.matiere, th.desc]
      );
    }

    // Book reviews
    for (const r of (DB.bookReviews || [])) {
      await client.query(
        `INSERT INTO book_reviews (id, book_id, reviewer_name, role, stars, review_text, review_date, verified)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8) ON CONFLICT (id) DO NOTHING`,
        [r.id, r.bid, r.nom, r.role, r.stars, r.text, r.date, r.verified]
      );
    }

    // Announcements
    for (const a of (DB.announce || [])) {
      await client.query(
        `INSERT INTO announcements (id, titre, date_event, description, type, urgent)
         VALUES ($1,$2,$3,$4,$5,$6) ON CONFLICT (id) DO NOTHING`,
        [a.id, a.titre, a.date, a.desc, a.type, a.urg]
      );
    }

    // Exam results
    console.log('📦 Migration résultats aux examens...');
    for (const er of (DB.examResults || [])) {
      const result = await client.query(
        'INSERT INTO exam_results (annee) VALUES ($1) RETURNING id', [er.annee]
      );
      const erId = result.rows[0].id;
      for (const n of (er.niveaux || [])) {
        await client.query(
          'INSERT INTO exam_result_niveaux (exam_result_id, classe, taux, candidats, admis) VALUES ($1,$2,$3,$4,$5)',
          [erId, n.cls, n.taux, n.candidats, n.admis]
        );
      }
    }

    await client.query('COMMIT');

    // Résumé
    const counts = await pool.query(`
      SELECT
        (SELECT COUNT(*) FROM students) as students,
        (SELECT COUNT(*) FROM teachers) as teachers,
        (SELECT COUNT(*) FROM grades) as grades,
        (SELECT COUNT(*) FROM payments) as payments,
        (SELECT COUNT(*) FROM absences) as absences,
        (SELECT COUNT(*) FROM elearning_contenus) as contenus,
        (SELECT COUNT(*) FROM admins) as admins
    `);
    const c = counts.rows[0];
    console.log('\n╔══════════════════════════════════════════════╗');
    console.log('║   ✅ MIGRATION TERMINÉE AVEC SUCCÈS          ║');
    console.log('╠══════════════════════════════════════════════╣');
    console.log(`║   Élèves        : ${c.students.toString().padStart(5)}`);
    console.log(`║   Enseignants   : ${c.teachers.toString().padStart(5)}`);
    console.log(`║   Notes         : ${c.grades.toString().padStart(5)}`);
    console.log(`║   Paiements     : ${c.payments.toString().padStart(5)}`);
    console.log(`║   Absences      : ${c.absences.toString().padStart(5)}`);
    console.log(`║   Contenus e-l. : ${c.contenus.toString().padStart(5)}`);
    console.log(`║   Admins        : ${c.admins.toString().padStart(5)}`);
    console.log('╚══════════════════════════════════════════════╝');

  } catch (err) {
    await client.query('ROLLBACK');
    console.error('❌ Erreur de migration :', err.message);
    console.error(err.stack);
    process.exit(1);
  } finally {
    client.release();
    await pool.end();
  }
}

migrate();
