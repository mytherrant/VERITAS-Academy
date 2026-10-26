/* ============================================================================
   VÉRITAS — Le parent voit-il SON enfant, et seulement lui ?
   ----------------------------------------------------------------------------
   Le compte parent n'avait aucune donnée côté serveur : api/student_data.php
   renvoyait la tranche du compte lui-même (vide). Sur le téléphone d'un
   parent, « Notes & bulletin de mon enfant » ne pouvait trouver que les
   élèves de démonstration de la base locale — VRT-001 rattachait un parent
   réel à un élève fictif.

   Ce banc lève un vrai serveur (php -S) sur une copie de api/ et vérifie :
   le matricule + le téléphone enregistré par le centre ouvrent la tranche de
   l'enfant ; le matricule seul ne l'ouvre pas ; aucun autre élève ne fuit ;
   un compte élève n'obtient rien de plus ; le rôle redescend.

   Lancer :  node tests/banc_parent_enfant.cjs
   ========================================================================== */
'use strict';
const fs = require('fs');
const os = require('os');
const path = require('path');
const crypto = require('crypto');
const { spawn } = require('child_process');

const RACINE = path.resolve(__dirname, '..');
const PORT = 18000 + Math.floor(Math.random() * 1000);
const URL = `http://127.0.0.1:${PORT}/api/student_data.php`;

let ok = 0, ko = 0;
const t = (c, m) => { console.log((c ? '  ✓ ' : '  ✗ ') + m); c ? ok++ : ko++; };

const s256 = (pwd, user) => 'S256$' + crypto.createHash('sha256').update(pwd + '$' + user + '$2026').digest('hex');

const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'vrt-parent-'));
const WWW = path.join(dir, 'www');
fs.mkdirSync(path.join(WWW, 'api', 'data'), { recursive: true });
fs.mkdirSync(path.join(WWW, 'data'), { recursive: true });
for (const f of fs.readdirSync(path.join(RACINE, 'api'))) {
  if (/\.php$/.test(f) && f !== 'payment_config.php' && f !== 'config.php') fs.copyFileSync(path.join(RACINE, 'api', f), path.join(WWW, 'api', f));
}
fs.writeFileSync(path.join(WWW, 'api', 'payment_config.php'), `<?php
define('VRT_HMAC_KEY', 'cle-hmac-de-banc-0123456789-suffisamment-longue');
define('API_SECRET', 'secret-banc');
`);

const DBJ = {
  students: [
    { id: 's1', mat: 'VRT-101', nom: 'NANA', pre: 'Awa', cls: '3ème', ptel: '+237 6 90 11 22 33', pwd: 'secret' },
    { id: 's2', mat: 'VRT-102', nom: 'EKANE', pre: 'Paul', cls: '4ème', ptel: '+237 6 77 00 00 00' }
  ],
  grades: [
    { id: 'g1', eid: 's1', sub: 'Français', n1: 14, n2: 12, coef: 4, tri: '1er Trimestre' },
    { id: 'g2', eid: 's2', sub: 'Maths', n1: 8, n2: 9, coef: 4, tri: '1er Trimestre' }
  ],
  absences: [{ id: 'a1', eid: 's1', date: '2026-10-02', heures: 2, justifie: false }],
  payments: [{ id: 'p1', eid: 's1', mnt: 25000, stat: 'Payé', mo: 'Octobre' }, { id: 'p2', eid: 's2', mnt: 25000, stat: 'Impayé' }],
  devoirs: [{ id: 'd1', cls: '3ème', sub: 'Français', titre: 'Résumé' }, { id: 'd2', cls: '4ème', sub: 'Maths', titre: 'Exos' }],
  submissions: [],
  studentAccounts: [{ user: 'awa', pwd: s256('motdepasse', 'awa'), eid: 's1' }],
  visitorAccounts: [
    { id: 'va_p1', user: 'maman.awa', pwd: s256('motdepasse', 'maman.awa'), role: 'parent', isParent: true, tel: '690112233', childMat: 'VRT-101' },
    { id: 'va_p2', user: 'intrus', pwd: s256('motdepasse', 'intrus'), role: 'parent', isParent: true, tel: '699999999', childMat: 'VRT-101' },
    { id: 'va_p3', user: 'papa.sans', pwd: s256('motdepasse', 'papa.sans'), role: 'parent', isParent: true, tel: '677000000', childMat: '' }
  ],
  elearning: { contenus: [] }
};
fs.writeFileSync(path.join(WWW, 'data', 'veritas_db.json'), JSON.stringify(DBJ));

const srv = spawn('php', ['-S', `127.0.0.1:${PORT}`, '-t', WWW], { stdio: 'ignore' });
const post = async (b) => {
  const r = await fetch(URL, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(b) });
  let j = null; try { j = await r.json(); } catch (e) {}
  return { code: r.status, j };
};

(async () => {
  for (let i = 0; i < 50; i++) { try { await fetch(URL); break; } catch (e) { await new Promise(r => setTimeout(r, 100)); } }
  try {
    console.log('\n1. Le bon parent (matricule + téléphone du centre)');
    let r = await post({ action: 'fetch', login: 'maman.awa', password: 'motdepasse' });
    t(r.code === 200 && r.j && r.j.ok, 'connexion acceptée');
    const ch = (r.j && r.j.children) || [];
    t(ch.length === 1 && ch[0].student.id === 's1', 'la tranche de l’enfant redescend');
    t(ch[0] && ch[0].grades.length === 1 && ch[0].grades[0].id === 'g1', '… avec SES notes et seulement les siennes');
    t(ch[0] && ch[0].absences.length === 1 && ch[0].payments.length === 1, '… ses absences et ses paiements');
    t(ch[0] && ch[0].devoirs.every(d => d.cls === '3ème'), '… les devoirs de SA classe');
    t(ch[0] && !('pwd' in ch[0].student), 'aucun mot de passe dans la fiche élève');
    t(r.j && r.j.account && r.j.account.role === 'parent', 'le rôle du compte redescend (appareil neuf → espace parent)');
    const tok = r.j && r.j.token;

    console.log('\n2. Par jeton, avec un matricule saisi');
    r = await post({ action: 'fetch', token: tok, childMat: 'vrt-102' });
    t(r.j && r.j.ok && r.j.children.length === 1, 'un matricule étranger n’ouvre rien de plus');
    t(r.j && r.j.childrenRefused.some(x => x.mat === 'VRT-102' && x.raison === 'telephone'), '… et le refus dit pourquoi (téléphone)');
    r = await post({ action: 'fetch', token: tok, childMat: 'VRT-999' });
    t(r.j && r.j.childrenRefused.some(x => x.mat === 'VRT-999' && x.raison === 'introuvable'), 'matricule inconnu : « introuvable »');

    console.log('\n3. Le matricule seul ne suffit pas');
    r = await post({ action: 'fetch', login: 'intrus', password: 'motdepasse' });
    t(r.j && r.j.ok && r.j.children.length === 0, 'autre téléphone : aucune donnée de l’enfant');
    t(r.j && r.j.grades.length === 0 && r.j.student == null && JSON.stringify(r.j).indexOf('NANA') < 0, '… pas une note ni une fiche ne fuit');
    r = await post({ action: 'fetch', login: 'papa.sans', password: 'motdepasse', childMat: 'VRT-102' });
    t(r.j && r.j.children.length === 1 && r.j.children[0].student.id === 's2', 'matricule saisi + bon téléphone : rattaché');

    console.log('\n4. Les autres comptes ne changent pas');
    r = await post({ action: 'fetch', login: 'awa', password: 'motdepasse', childMat: 'VRT-102' });
    t(r.j && r.j.ok && r.j.children.length === 0, 'un compte élève n’obtient aucun autre élève');
    t(r.j && r.j.student && r.j.student.id === 's1' && r.j.grades.length === 1, '… et garde sa propre tranche');
    r = await post({ action: 'fetch', login: 'maman.awa', password: 'faux' });
    t(r.code === 401, 'mauvais mot de passe : 401');
  } finally {
    srv.kill();
    fs.rmSync(dir, { recursive: true, force: true });
  }
  console.log(`\n${ok} contrôle(s) au vert, ${ko} au rouge.`);
  process.exit(ko ? 1 : 0);
})();
