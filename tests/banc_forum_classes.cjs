/* ============================================================================
   VÉRITAS — Chaque élève écrit-il dans SA classe virtuelle ?
   ----------------------------------------------------------------------------
   L'inscription range le niveau (« Terminale », « 1ère ») et, à part, la
   filière (« C », « A1 ») ; les classes virtuelles s'appellent « Tle C »,
   « 1ère A ». api/student_data.php comparait les noms à l'identique : un élève
   de 1ère ou de Terminale était refusé (403) dans sa propre classe, et les
   séries C et D n'avaient pas de classe du tout (11/11/2026).

   Ce banc lève un vrai serveur (php -S) sur une copie de api/ et vérifie :
   la Tle C, la 1ère A1 et la 3ème écrivent dans leur classe ; la Tle C
   publiée seulement côté client reste utilisable ; personne n'écrit dans une
   classe sœur (Tle D ≠ Tle C, Tle C ≠ Tle A) ; l'annonce reste aux enseignants.

   Lancer :  node tests/banc_forum_classes.cjs
   ========================================================================== */
'use strict';
const fs = require('fs');
const os = require('os');
const path = require('path');
const crypto = require('crypto');
const { spawn } = require('child_process');

const RACINE = path.resolve(__dirname, '..');
const PORT = 19000 + Math.floor(Math.random() * 900);
const URL = `http://127.0.0.1:${PORT}/api/student_data.php`;

let ok = 0, ko = 0;
const t = (c, m) => { console.log((c ? '  ✓ ' : '  ✗ ') + m); c ? ok++ : ko++; };
const s256 = (pwd, user) => 'S256$' + crypto.createHash('sha256').update(pwd + '$' + user + '$2026').digest('hex');

const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'vrt-forum-'));
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

// Les classes publiées par l'administration : les 7 classes par défaut, sans série scientifique.
const salons = (k) => [
  { id: 'ch_gen_' + k, nom: 'Général' }, { id: 'ch_ann_' + k, nom: 'Annonces', teacherOnly: true },
  { id: 'ch_fr_' + k, nom: 'Français' }, { id: 'ch_math_' + k, nom: 'Mathématiques' }, { id: 'ch_sc_' + k, nom: 'Sciences' }
];
const classe = (nom) => { const k = nom.replace(/[^a-z0-9]/gi, '').toLowerCase(); return { id: 'cls_' + k, nom, channels: salons(k), membres: [] }; };
const DBJ = {
  students: [], grades: [], absences: [], payments: [], devoirs: [], submissions: [], studentAccounts: [],
  classrooms: ['6ème', '5ème', '4ème', '3ème', '2nde', '1ère A', 'Tle A'].map(classe),
  forumPosts: [],
  visitorAccounts: [
    { id: 'va_tc', user: 'tle.c', pwd: s256('motdepasse', 'tle.c'), cls: 'Terminale', serie: 'C' },
    { id: 'va_td', user: 'tle.d', pwd: s256('motdepasse', 'tle.d'), cls: 'Terminale', serie: 'D' },
    { id: 'va_pa', user: 'pre.a1', pwd: s256('motdepasse', 'pre.a1'), cls: '1ère', serie: 'A1' },
    { id: 'va_3e', user: 'troisieme', pwd: s256('motdepasse', 'troisieme'), cls: '3ème' }
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
const jeton = async (login) => { const r = await post({ action: 'fetch', login, password: 'motdepasse' }); return r.j && r.j.token; };
const ecrire = (token, classroomId, channelId) => post({ action: 'forum_post', token, payload: { classroomId, channelId, contenu: 'Bonjour la classe' } });
const classes = async (token) => { const r = await post({ action: 'forum_fetch', token, payload: {} }); return (r.j && r.j.classrooms) || []; };

(async () => {
  for (let i = 0; i < 50; i++) { try { await fetch(URL); break; } catch (e) { await new Promise(r => setTimeout(r, 100)); } }
  try {
    const tc = await jeton('tle.c'), td = await jeton('tle.d'), pa = await jeton('pre.a1'), e3 = await jeton('troisieme');
    t(!!(tc && td && pa && e3), 'les quatre comptes se connectent');

    console.log('\n1. Terminale + filière C → Tle C (classe ajoutée côté client, pas encore publiée)');
    t((await classes(tc)).indexOf('cls_tlec') >= 0, 'forum_fetch annonce la Tle C');
    let r = await ecrire(tc, 'cls_tlec', 'ch_gen_tlec');
    t(r.code === 200 && r.j && r.j.ok, 'un message dans « Général » de la Tle C passe');
    r = await ecrire(tc, 'cls_tlec', 'ch_svt_tlec');
    t(r.code === 200 && r.j && r.j.ok, '… et dans le salon SVT des séries scientifiques');
    r = await ecrire(tc, 'cls_tlea', 'ch_gen_tlea');
    t(r.code === 403, 'pas dans la Tle A (classe sœur)');
    r = await ecrire(tc, 'cls_tlec', 'ch_ann_tlec');
    t(r.code === 403, 'les annonces restent aux enseignants');

    console.log('\n2. Terminale + filière D → jamais la Tle C');
    r = await ecrire(td, 'cls_tlec', 'ch_gen_tlec');
    t(r.code === 403, 'une Tle D n’écrit pas dans la Tle C');
    t((await classes(td)).indexOf('cls_tled') >= 0, 'elle a sa Tle D');

    console.log('\n3. 1ère + filière A1 → 1ère A (classe publiée)');
    t((await classes(pa)).indexOf('cls_1rea') >= 0, 'forum_fetch annonce la 1ère A');
    r = await ecrire(pa, 'cls_1rea', 'ch_gen_1rea');
    t(r.code === 200 && r.j && r.j.ok, 'le message passe (403 avant le correctif)');

    console.log('\n4. Collège : inchangé');
    r = await ecrire(e3, 'cls_3me', 'ch_gen_3me');
    t(r.code === 200 && r.j && r.j.ok, 'la 3ème écrit dans la 3ème');
    r = await ecrire(e3, 'cls_4me', 'ch_gen_4me');
    t(r.code === 403, '… et pas dans la 4ème');
  } finally {
    srv.kill();
    fs.rmSync(dir, { recursive: true, force: true });
  }
  console.log(`\n${ok} contrôle(s) au vert, ${ko} au rouge.`);
  process.exit(ko ? 1 : 0);
})();
