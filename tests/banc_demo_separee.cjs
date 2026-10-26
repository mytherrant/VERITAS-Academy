#!/usr/bin/env node
/* ════════════════════════════════════════════════════════════════════════════
   tests/banc_demo_separee.cjs — LA DÉMONSTRATION N'EST PAS LE SUIVI DU CENTRE
   © 2024-2026 Jacques Miterand TAKOU (Mythe Errant).

     node tests/banc_demo_separee.cjs

   CE QU'IL PROTÈGE
   Le 22/10/2026, le tableau de bord de production annonçait 12 élèves,
   « Recettes 340 000 » et « Masse salariale 465 000 » : c'était, à l'identifiant
   près, le jeu de démonstration semé par defaultDB(). `_separerDemo()` (app.js)
   écarte ces enregistrements fictifs dans DB._demoArchive.

   CE QU'IL VÉRIFIE
     ① une base neuve : toute la démo part à l'écart, rien n'est perdu ;
     ② un enregistrement de démo MODIFIÉ à la main est réputé réel et reste ;
     ③ un élève de démo cité par un paiement RÉEL reste (pas d'orphelin) ;
     ④ les enregistrements réels ne sont jamais touchés ;
     ⑤ idempotent, et une vieille base resynchronisée qui ramène la démo la
       voit écartée de nouveau, sans doublon dans l'archive ;
     ⑥ « Réafficher » (DB._demoVisible) suspend l'écart.

   COMMENT — on EXTRAIT le code réel d'app.js (defaultDB, _formulesDefaut,
   _DEMO_COLS, _demoIntact, _separerDemo) et on l'exécute contre des bases
   fabriquées.
   ════════════════════════════════════════════════════════════════════════ */
'use strict';
const fs = require('fs');
const path = require('path');

const RACINE = path.resolve(__dirname, '..');
const V = '\x1b[32m✓\x1b[0m', X = '\x1b[31m✗\x1b[0m', G = '\x1b[1m', R = '\x1b[0m';
let ok = 0, ko = 0;
const dire = (b, m, d) => { b ? ok++ : ko++; console.log('  ' + (b ? V : X) + ' ' + m + (!b && d ? '  → ' + d : '')); };

const lignes = fs.readFileSync(path.join(RACINE, 'app.js'), 'utf8').split(/\r?\n/);
const de = (debut, fin) => {
  const i = lignes.findIndex((l) => debut.test(l));
  const j = lignes.findIndex((l, k) => k > i && fin.test(l));
  if (i < 0 || j < 0) throw new Error('bloc introuvable : ' + debut);
  return lignes.slice(i, j).join('\n');
};
const code = [
  'function gid(){return Math.random().toString(36).slice(2,10);}',
  de(/^function defaultDB\(\)/, /^let DB;/),
  de(/^function _formulesDefaut\(\)/, /^function /),
  de(/^var _DEMO_COLS\b/, /^function _demoCompte\(\)/),
  'return { defaultDB, _separerDemo, setDB: (d) => { DB = d; }, getDB: () => DB };',
].join('\n');
const fabrique = () => new Function('var DB; var window = {}; var console = { info(){}, warn(){} };\n' + code)();

const COLS = ['students','teachers','payments','grades','absences','devoirs','submissions','teacherHours','depenses','studentAccounts'];
const total = (db, cols = COLS) => cols.reduce((n, k) => n + (db[k] || []).length, 0);
const archive = (db) => Object.values(db._demoArchive || {}).reduce((n, a) => n + a.length, 0);

console.log(`\n${G}LA DÉMONSTRATION EST-ELLE TENUE À L'ÉCART DU SUIVI RÉEL ?${R}\n`);

/* ① base neuve */
{
  const m = fabrique(); const db = m.defaultDB(); const avant = total(db);
  m.setDB(db); const n = m._separerDemo();
  dire(avant > 30, `le seed contient bien une démonstration (${avant} enregistrements)`);
  dire(n === avant && total(db) === 0, `base neuve : les ${avant} enregistrements fictifs partent à l'écart`, `${n} écartés, ${total(db)} restants`);
  dire(archive(db) === avant, `rien n'est perdu : ${archive(db)} dans DB._demoArchive`);
}

/* ② modifié à la main */
{
  const m = fabrique(); const db = m.defaultDB();
  db.students[0].stat = 'Impayé (corrigé par la secrétaire)';
  db.teachers[0].sal = 150000;
  m.setDB(db); m._separerDemo();
  dire(db.students.some((s) => s.id === 'pas-s1' || s.stat.indexOf('corrigé') >= 0), 'un élève de démo modifié à la main reste dans le suivi');
  dire(db.teachers.length === 1 && db.teachers[0].sal === 150000, 'un enseignant de démo dont le salaire a été changé reste');
}

/* ③ cité par un enregistrement réel */
{
  const m = fabrique(); const db = m.defaultDB();
  const s = db.students[1].id;
  db.payments.push({ id: 'pReel1', eid: s, mnt: 25000, stat: 'Payé', dt: '01/10/2026' });
  m.setDB(db); m._separerDemo();
  dire(db.students.some((x) => x.id === s), `l'élève de démo ${s}, cité par un paiement réel, reste`);
  dire(db.payments.length === 1 && db.payments[0].id === 'pReel1', 'le paiement réel reste, les paiements de démo partent');
}

/* ④ le réel n'est jamais touché */
{
  const m = fabrique(); const db = m.defaultDB();
  db.students.push({ id: 'k3f9a2pq', mat: 'VRT-101', nom: 'NDJOCK', pre: 'Awa', cls: '3ème' });
  db.grades.push({ id: 'gReel', eid: 'k3f9a2pq', sub: 'Français', n1: 12, n2: 14, coef: 4 });
  db.students.push({ id: 's1', mat: 'VRT-900', nom: 'AUTRE', pre: 'Élève', cls: '6ème' }); // id réattribué
  m.setDB(db); m._separerDemo();
  dire(db.students.some((x) => x.id === 'k3f9a2pq') && db.grades.some((g) => g.id === 'gReel'), 'un vrai élève et sa note restent');
  dire(db.students.some((x) => x.id === 's1' && x.nom === 'AUTRE'), 'un identifiant de démo réattribué à un vrai élève est gardé');
}

/* ⑤ idempotence + resynchronisation */
{
  const m = fabrique(); const db = m.defaultDB(); m.setDB(db);
  m._separerDemo(); const a1 = archive(db);
  const n2 = m._separerDemo();
  dire(n2 === 0 && archive(db) === a1, 'second passage : rien ne bouge');
  const vieux = m.defaultDB();
  db.students = vieux.students; db.payments = vieux.payments;   // une vieille base ramène la démo
  const n3 = m._separerDemo();
  dire(n3 === vieux.students.length + vieux.payments.length && db.students.length === 0, 'la démo ramenée par une resynchronisation est écartée de nouveau');
  dire(archive(db) === a1, `sans doublon dans l'archive (${archive(db)})`);
}

/* ⑥ réaffichée */
{
  const m = fabrique(); const db = m.defaultDB(); db._demoVisible = true; m.setDB(db);
  const avant = total(db);
  dire(m._separerDemo() === 0 && total(db) === avant, '« Réafficher la démonstration » suspend l’écart');
}

console.log('\n' + '─'.repeat(68));
if (ko) { console.log(`  \x1b[31m${G}${ko} échec(s) sur ${ok + ko}.${R}`); process.exit(1); }
console.log(`  \x1b[32m${G}✓ ${ok}/${ok} — la démonstration ne se mêle plus au suivi réel.${R}`);
