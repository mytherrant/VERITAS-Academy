// ============================================================
// Routes de Synchronisation
// Permet au fichier HTML existant d'envoyer/recevoir ses
// données localStorage vers/depuis PostgreSQL
// ============================================================
const express = require('express');
const bcrypt = require('bcrypt');
const db = require('../db');
const { authenticateToken, requireAdmin } = require('../middleware/auth');

const router = express.Router();
const SALT_ROUNDS = 12;

// ── POST /api/sync/upload ──
// Le fichier HTML envoie tout son DB (localStorage) au serveur
// C'est la migration initiale ET la sauvegarde continue
router.post('/upload', authenticateToken, requireAdmin, async (req, res) => {
  const client = await db.getClient();
  try {
    const data = req.body; // = l'objet DB complet du localStorage
    if (!data || !data.students) {
      return res.status(400).json({ error: 'Données invalides' });
    }

    await client.query('BEGIN');

    // ── 1. School config ──
    if (data.school) {
      await client.query(
        `INSERT INTO school_config (id, nom, slogan, ville, tel, bp, directeur, annee, taux_horaire)
         VALUES (1, $1,$2,$3,$4,$5,$6,$7,$8)
         ON CONFLICT (id) DO UPDATE SET nom=$1, slogan=$2, ville=$3, tel=$4, bp=$5, directeur=$6, annee=$7, taux_horaire=$8, updated_at=NOW()`,
        [data.school.nom, data.school.slogan, data.school.ville, data.school.tel, data.school.bp, data.school.directeur, data.school.annee, data.tauxHoraire || 2000]
      );
    }

    // ── 2. Public info ──
    if (data.publicInfo) {
      const pi = data.publicInfo;
      await client.query(
        `INSERT INTO public_info (id, slogan2, description, histoire, equipe, horaires, email, whatsapp)
         VALUES (1, $1,$2,$3,$4,$5,$6,$7)
         ON CONFLICT (id) DO UPDATE SET slogan2=$1, description=$2, histoire=$3, equipe=$4, horaires=$5, email=$6, whatsapp=$7, updated_at=NOW()`,
        [pi.slogan2, pi.description, pi.histoire, pi.equipe, pi.horaires, pi.email, pi.whatsapp]
      );
    }

    // ── 3. Students ──
    for (const s of (data.students || [])) {
      await client.query(
        `INSERT INTO students (id, matricule, nom, prenom, sexe, date_naissance, classe, tel, parent_nom, parent_tel, frais_scolarite, date_inscription, statut)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13)
         ON CONFLICT (id) DO UPDATE SET nom=$3, prenom=$4, sexe=$5, classe=$7, tel=$8, parent_nom=$9, parent_tel=$10, frais_scolarite=$11, statut=$13, updated_at=NOW()`,
        [s.id, s.mat, s.nom, s.pre, s.sex, s.dob, s.cls, s.tel, s.parent, s.ptel, s.frais, s.ins, s.stat]
      );
    }

    // ── 4. Teachers ──
    for (const t of (data.teachers || [])) {
      await client.query(
        `INSERT INTO teachers (id, matricule, nom, prenom, matiere, grade, username, tel, salaire, statut, classes, titulaire)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12)
         ON CONFLICT (id) DO UPDATE SET nom=$3, prenom=$4, matiere=$5, grade=$6, tel=$8, salaire=$9, statut=$10, classes=$11, titulaire=$12, updated_at=NOW()`,
        [t.id, t.mat, t.nom, t.pre, t.mat2, t.grade, t.user, t.tel, t.sal, t.stat, t.classes || [], t.titulaire]
      );
    }

    // ── 5. Teacher passwords ──
    if (data.tpwd) {
      for (const [username, pwd] of Object.entries(data.tpwd)) {
        const hash = await bcrypt.hash(pwd, SALT_ROUNDS);
        await client.query(
          `UPDATE teachers SET password_hash = $1 WHERE username = $2`,
          [hash, username]
        );
      }
    }

    // ── 6. Grades ──
    for (const g of (data.grades || [])) {
      await client.query(
        `INSERT INTO grades (id, student_id, student_name, student_mat, classe, matiere, note_1, note_2, coefficient, trimestre, enseignant)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)
         ON CONFLICT (id) DO UPDATE SET note_1=$7, note_2=$8, coefficient=$9, trimestre=$10, enseignant=$11, updated_at=NOW()`,
        [g.id, g.eid, g.enom, g.mat, g.cls, g.sub, g.n1, g.n2, g.coef, g.tri, g.ens]
      );
    }

    // ── 7. Payments ──
    for (const p of (data.payments || [])) {
      await client.query(
        `INSERT INTO payments (id, student_id, student_name, classe, mois, montant, mode_paiement, date_paiement, statut, reference)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)
         ON CONFLICT (id) DO UPDATE SET montant=$6, mode_paiement=$7, date_paiement=$8, statut=$9, updated_at=NOW()`,
        [p.id, p.eid, p.enom, p.cls, p.mo, p.mnt, p.mode, p.dt, p.stat, p.ref]
      );
    }

    // ── 8. Absences ──
    for (const a of (data.absences || [])) {
      await client.query(
        `INSERT INTO absences (id, student_id, date_absence, heures, matiere, motif, justifie)
         VALUES ($1,$2,$3,$4,$5,$6,$7)
         ON CONFLICT (id) DO UPDATE SET heures=$4, matiere=$5, motif=$6, justifie=$7`,
        [a.id, a.eid, a.date, a.heures, a.matiere, a.motif, a.justifie]
      );
    }

    // ── 9. Student accounts ──
    for (const sa of (data.studentAccounts || [])) {
      const hash = await bcrypt.hash(sa.pwd, SALT_ROUNDS);
      await client.query(
        `INSERT INTO student_accounts (id, student_id, username, password_hash)
         VALUES ($1,$2,$3,$4)
         ON CONFLICT (id) DO UPDATE SET password_hash=$4`,
        [sa.id, sa.eid, sa.user, hash]
      );
    }

    // ── 10. Admins ──
    for (const a of (data.admins || [])) {
      const hash = await bcrypt.hash(a.pwd, SALT_ROUNDS);
      await client.query(
        `INSERT INTO admins (id, username, password_hash, nom, role, role2, is_super_admin)
         VALUES ($1,$2,$3,$4,$5,$6,$7)
         ON CONFLICT (id) DO UPDATE SET password_hash=$3, nom=$4, role=$5, role2=$6`,
        [a.id, a.user, hash, a.nom, a.role, a.role2, false]
      );
    }

    // Super admin
    if (data.superAdmin) {
      const hash = await bcrypt.hash(data.superAdmin.pwd, SALT_ROUNDS);
      await client.query(
        `INSERT INTO admins (id, username, password_hash, nom, role, role2, is_super_admin)
         VALUES ('superadmin', $1, $2, $3, 'Super Admin', 'superadmin', TRUE)
         ON CONFLICT (id) DO UPDATE SET password_hash=$2, nom=$3`,
        [data.superAdmin.user, hash, data.superAdmin.nom]
      );
    }

    // ── 11. Books ──
    for (const b of (data.books || [])) {
      await client.query(
        `INSERT INTO books (id, titre, classe, auteur, prix, stock, vendu, pages, icone, description, chapitres, cover_color, extrait)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13)
         ON CONFLICT (id) DO UPDATE SET titre=$2, prix=$5, stock=$6, vendu=$7, description=$10, updated_at=NOW()`,
        [b.id, b.titre, b.cls, b.auteur, b.prix, b.stock, b.vendu, b.pages, b.ico, b.desc, b.chaps || [], b.coverColor, b.extrait]
      );
    }

    // ── 12. Devoirs ──
    for (const d of (data.devoirs || [])) {
      await client.query(
        `INSERT INTO devoirs (id, teacher_id, matiere, classe, titre, description, date_limite, trimestre)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8)
         ON CONFLICT (id) DO UPDATE SET titre=$5, description=$6, date_limite=$7`,
        [d.id, d.tid, d.sub, d.cls, d.titre, d.desc, d.dateLimit, d.tri]
      );
    }

    // ── 13. Citations ──
    if (data.citations && data.citations.length) {
      await client.query('DELETE FROM citations');
      for (const c of data.citations) {
        await client.query('INSERT INTO citations (texte, auteur) VALUES ($1, $2)', [c.texte, c.auteur]);
      }
    }

    // ── 14. Depenses ──
    for (const d of (data.depenses || [])) {
      await client.query(
        `INSERT INTO depenses (id, categorie, description, montant, date_depense)
         VALUES ($1,$2,$3,$4,$5) ON CONFLICT (id) DO UPDATE SET categorie=$2, description=$3, montant=$4`,
        [d.id, d.cat, d.desc, d.mnt, d.dt]
      );
    }

    // ── 15. Promo codes ──
    for (const p of (data.promoCodes || [])) {
      await client.query(
        `INSERT INTO promo_codes (id, code, reduction, type_reduction, description, actif, usage_count)
         VALUES ($1,$2,$3,$4,$5,$6,$7) ON CONFLICT (id) DO UPDATE SET code=$2, reduction=$3, actif=$6`,
        [p.id, p.code, p.reduction, p.type, p.desc, p.actif, p.usage || 0]
      );
    }

    // ── 16. E-learning plans ──
    for (const p of (data.elearning?.plans || [])) {
      await client.query(
        `INSERT INTO elearning_plans (id, nom, cible, prix, ancien_prix, duree, populaire, plan_tags, avantages)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)
         ON CONFLICT (id) DO UPDATE SET nom=$2, prix=$4, ancien_prix=$5, avantages=$9`,
        [p.id, p.nom, p.cible, p.prix, p.ancien, p.duree, p.populaire, p.planTags || [], p.avantages || []]
      );
    }

    // ── 17. E-learning categories ──
    for (const c of (data.elearning?.categories || [])) {
      await client.query(
        `INSERT INTO elearning_categories (id, nom, icone, description)
         VALUES ($1,$2,$3,$4) ON CONFLICT (id) DO UPDATE SET nom=$2, description=$4`,
        [c.id, c.nom, c.ico, c.desc]
      );
    }

    // ── 18. E-learning contenus ──
    for (const c of (data.elearning?.contenus || [])) {
      await client.query(
        `INSERT INTO elearning_contenus (id, categorie_id, titre, classe, matiere, sequence, prix, gratuit, plans, apercu, description, res_pedago)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12)
         ON CONFLICT (id) DO UPDATE SET titre=$3, prix=$7, gratuit=$8, apercu=$10, description=$11, updated_at=NOW()`,
        [c.id, c.cat, c.titre, c.classe, c.matiere, c.seq, c.prix, c.gratuit, c.plans || [], c.apercu, c.desc, c.resPedago || null]
      );
    }

    await client.query('COMMIT');
    res.json({
      message: 'Synchronisation réussie',
      counts: {
        students: (data.students || []).length,
        teachers: (data.teachers || []).length,
        grades: (data.grades || []).length,
        payments: (data.payments || []).length,
        absences: (data.absences || []).length,
        elearning_contenus: (data.elearning?.contenus || []).length
      }
    });
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('Erreur sync upload :', err);
    res.status(500).json({ error: 'Erreur lors de la synchronisation : ' + err.message });
  } finally {
    client.release();
  }
});

// ── GET /api/sync/download ──
// Télécharge toutes les données du serveur vers le format DB du HTML
router.get('/download', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const [students, teachers, grades, payments, absences, devoirs, submissions,
           books, bookReviews, promoCodes, depenses, citations, products,
           plans, categories, contenus, admins, studentAccounts, teacherHours,
           school, publicInfo, announcements] = await Promise.all([
      db.query('SELECT * FROM students ORDER BY classe, nom'),
      db.query('SELECT id, matricule, nom, prenom, matiere, grade, username, tel, salaire, statut, classes, titulaire FROM teachers'),
      db.query('SELECT * FROM grades'),
      db.query('SELECT * FROM payments'),
      db.query('SELECT * FROM absences'),
      db.query('SELECT * FROM devoirs'),
      db.query('SELECT * FROM submissions'),
      db.query('SELECT * FROM books'),
      db.query('SELECT * FROM book_reviews'),
      db.query('SELECT * FROM promo_codes'),
      db.query('SELECT * FROM depenses'),
      db.query('SELECT * FROM citations WHERE actif = TRUE'),
      db.query('SELECT * FROM products'),
      db.query('SELECT * FROM elearning_plans'),
      db.query('SELECT * FROM elearning_categories'),
      db.query('SELECT * FROM elearning_contenus'),
      db.query('SELECT id, username, nom, role, role2, is_super_admin FROM admins'),
      db.query('SELECT id, student_id, username FROM student_accounts'),
      db.query('SELECT * FROM teacher_hours'),
      db.query('SELECT * FROM school_config WHERE id = 1'),
      db.query('SELECT * FROM public_info WHERE id = 1'),
      db.query('SELECT * FROM announcements ORDER BY created_at DESC LIMIT 50'),
    ]);

    // Reconvertir au format DB du HTML pour compatibilité
    const dbFormat = {
      school: school.rows[0] ? {
        nom: school.rows[0].nom, slogan: school.rows[0].slogan, ville: school.rows[0].ville,
        tel: school.rows[0].tel, bp: school.rows[0].bp, directeur: school.rows[0].directeur,
        annee: school.rows[0].annee, logo: school.rows[0].logo
      } : {},
      publicInfo: publicInfo.rows[0] || {},
      students: students.rows.map(s => ({
        id: s.id, mat: s.matricule, nom: s.nom, pre: s.prenom, sex: s.sexe,
        dob: s.date_naissance, cls: s.classe, tel: s.tel, parent: s.parent_nom,
        ptel: s.parent_tel, frais: s.frais_scolarite, ins: s.date_inscription, stat: s.statut
      })),
      teachers: teachers.rows.map(t => ({
        id: t.id, mat: t.matricule, nom: t.nom, pre: t.prenom, mat2: t.matiere,
        grade: t.grade, user: t.username, tel: t.tel, sal: t.salaire, stat: t.statut,
        classes: t.classes, titulaire: t.titulaire
      })),
      grades: grades.rows.map(g => ({
        id: g.id, eid: g.student_id, enom: g.student_name, mat: g.student_mat,
        cls: g.classe, sub: g.matiere, n1: parseFloat(g.note_1), n2: parseFloat(g.note_2),
        coef: g.coefficient, tri: g.trimestre, ens: g.enseignant
      })),
      payments: payments.rows.map(p => ({
        id: p.id, eid: p.student_id, enom: p.student_name, cls: p.classe,
        mo: p.mois, mnt: p.montant, mode: p.mode_paiement, dt: p.date_paiement,
        stat: p.statut, ref: p.reference
      })),
      absences: absences.rows.map(a => ({
        id: a.id, eid: a.student_id, date: a.date_absence, heures: a.heures,
        matiere: a.matiere, motif: a.motif, justifie: a.justifie
      })),
      devoirs: devoirs.rows.map(d => ({
        id: d.id, tid: d.teacher_id, sub: d.matiere, cls: d.classe, titre: d.titre,
        desc: d.description, dateLimit: d.date_limite, tri: d.trimestre
      })),
      books: books.rows.map(b => ({
        id: b.id, titre: b.titre, cls: b.classe, auteur: b.auteur, prix: b.prix,
        stock: b.stock, vendu: b.vendu, pages: b.pages, ico: b.icone, desc: b.description,
        chaps: b.chapitres, coverColor: b.cover_color, extrait: b.extrait
      })),
      promoCodes: promoCodes.rows.map(p => ({
        id: p.id, code: p.code, reduction: p.reduction, type: p.type_reduction,
        desc: p.description, actif: p.actif, usage: p.usage_count
      })),
      depenses: depenses.rows.map(d => ({
        id: d.id, cat: d.categorie, desc: d.description, mnt: d.montant, dt: d.date_depense
      })),
      citations: citations.rows,
      products: products.rows.map(p => ({
        id: p.id, ico: p.icone, titre: p.titre, prix: p.prix, ancien: p.ancien_prix,
        desc: p.description, cat: p.categorie, photo: p.photo, actif: p.actif
      })),
      elearning: {
        plans: plans.rows.map(p => ({
          id: p.id, nom: p.nom, cible: p.cible, prix: p.prix, ancien: p.ancien_prix,
          duree: p.duree, populaire: p.populaire, planTags: p.plan_tags, avantages: p.avantages
        })),
        categories: categories.rows.map(c => ({
          id: c.id, nom: c.nom, ico: c.icone, desc: c.description
        })),
        contenus: contenus.rows.map(c => ({
          id: c.id, cat: c.categorie_id, titre: c.titre, classe: c.classe, matiere: c.matiere,
          seq: c.sequence, prix: c.prix, gratuit: c.gratuit, plans: c.plans,
          apercu: c.apercu, desc: c.description, resPedago: c.res_pedago
        })),
        abonnements: [], commandes: [], soumissions: [], telechargementsGratuits: {}
      },
      admins: admins.rows.filter(a => !a.is_super_admin).map(a => ({
        id: a.id, user: a.username, nom: a.nom, role: a.role, role2: a.role2
      })),
      tauxHoraire: school.rows[0]?.taux_horaire || 2000,
      announce: announcements.rows.map(a => ({
        id: a.id, titre: a.titre, date: a.date_event, desc: a.description, type: a.type, urg: a.urgent
      })),
      _syncedAt: new Date().toISOString()
    };

    res.json(dbFormat);
  } catch (err) {
    console.error('Erreur sync download :', err);
    res.status(500).json({ error: 'Erreur lors du téléchargement' });
  }
});

// ── GET /api/sync/status ── Vérifier l'état de la synchro
router.get('/status', authenticateToken, async (req, res) => {
  try {
    const counts = await Promise.all([
      db.query('SELECT COUNT(*) FROM students'),
      db.query('SELECT COUNT(*) FROM grades'),
      db.query('SELECT COUNT(*) FROM payments'),
      db.query('SELECT MAX(updated_at) as last FROM students'),
    ]);
    res.json({
      students: parseInt(counts[0].rows[0].count),
      grades: parseInt(counts[1].rows[0].count),
      payments: parseInt(counts[2].rows[0].count),
      lastUpdate: counts[3].rows[0].last
    });
  } catch (err) {
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

module.exports = router;
