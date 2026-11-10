#!/usr/bin/env node
/* tests/banc_apprendre_verrou.cjs — LA SUITE D'UNE LEÇON NE SORT QUE POUR UN ABONNÉ
     node tests/banc_apprendre_verrou.cjs
   Vrai php -S sur une copie des endpoints, base et leçons isolées.
   Prouve : ① sans compte, sans formule ou avec formule expirée, rien ne sort ;
   ② l'abonné reçoit la suite, avec jeton réutilisable ; ③ les refus ordinaires
   répondent 200 (l'hébergeur bannit à 6 réponses 401/403/429 par minute) ;
   ④ un identifiant fabriqué ne lit aucun fichier ; ⑤ les fichiers publics
   ne contiennent ni la suite, ni la fiche, ni le quiz d'une leçon à verrou. */
'use strict';
const fs = require('fs'), os = require('os'), path = require('path'), crypto = require('crypto');
const { spawn } = require('child_process');
const RACINE = path.resolve(__dirname, '..');
let ok = 0, ko = 0;
const dire = (b, m, d) => { b ? ok++ : ko++; console.log('  ' + (b ? '\x1b[32m✓\x1b[0m ' : '\x1b[31m✗\x1b[0m ') + m + (!b && d ? '  → ' + d : '')); };
const PORT = 8700 + (process.pid % 90), BASE = 'http://127.0.0.1:' + PORT;
const BAC = fs.mkdtempSync(path.join(os.tmpdir(), 'vrt-banc-apprendre-'));
const FICHIERS = ['apprendre.php', '_json_boot.php', 'config_sync.php', '_auth_lib.php', '_livret_lib.php', '_notify_lib.php',
  '_skysms_lib.php', '_parrainage_lib.php', '_recettes_lib.php', '_sentinel.php', '_bot_log.php'];
const mdp = (p, u) => 'S256$' + crypto.createHash('sha256').update(p + '$' + u + '$2026').digest('hex');
const compte = (id, user, plans) => ({ id, user, pwd: mdp('secret123', user), plans });

fs.mkdirSync(path.join(BAC, 'api'), { recursive: true });
fs.mkdirSync(path.join(BAC, 'data'), { recursive: true });
fs.mkdirSync(path.join(BAC, 'api', 'data'), { recursive: true });
fs.mkdirSync(path.join(BAC, 'uploads/protected/apprendre'), { recursive: true });
for (const f of FICHIERS) { const s = path.join(RACINE, 'api', f); if (fs.existsSync(s)) fs.copyFileSync(s, path.join(BAC, 'api', f)); }
fs.writeFileSync(path.join(BAC, 'api/payment_config.php'), "<?php define('API_SECRET', 'banc-apprendre-" + process.pid + "-0123456789');\n");
fs.writeFileSync(path.join(BAC, 'data/veritas_db.json'), JSON.stringify({
  studentAccounts: [],
  visitorAccounts: [compte('a1', 'gratuit', []), compte('a2', 'abonne', ['plan1']), compte('a3', 'expire', ['plan1'])],
  elearning: { plans: [], abonnements: [{ plan: 'plan1', accountId: 'a3', statut: 'Expiré' }] },
}));
fs.writeFileSync(path.join(BAC, 'uploads/protected/apprendre/3e-maths-test.json'), JSON.stringify({ parties: [{ t: 'Suite', html: '<p>SECRET</p>' }], revision: ['r'], exo: 'e', quiz: [{ q: 'q', r: ['a', 'b'], b: 1, e: 'x' }] }));

const poste = async (c) => { const r = await fetch(BASE + '/api/apprendre.php', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(c) }); let j = {}; try { j = await r.json(); } catch (e) { } return { h: r.status, j }; };

(async () => {
  const srv = spawn('php', ['-S', '127.0.0.1:' + PORT, '-t', BAC], { cwd: BAC, stdio: 'ignore' });
  let pret = false;
  for (let i = 0; i < 60 && !pret; i++) { try { await fetch(BASE + '/api/apprendre.php'); pret = true; } catch (e) { await new Promise(s => setTimeout(s, 150)); } }
  try {
    dire(pret, 'le serveur PHP démarre');
    const id = '3e-maths-test';
    let r = await poste({ id });
    dire(r.h === 200 && r.j.raison === 'connexion' && !r.j.suite, 'sans compte : refus « connexion » en 200, rien ne sort', JSON.stringify(r));
    r = await poste({ id, login: 'gratuit', password: 'faux' });
    dire(r.h === 200 && r.j.raison === 'identifiants', 'mauvais mot de passe : refus en 200', JSON.stringify(r));
    r = await poste({ id, login: 'gratuit', password: 'secret123' });
    dire(r.h === 200 && r.j.raison === 'abonnement' && !r.j.suite && !!r.j.token, 'compte sans formule : refus « abonnement », jeton remis, rien ne sort', JSON.stringify(r));
    r = await poste({ id, login: 'expire', password: 'secret123' });
    dire(r.j.raison === 'abonnement' && !r.j.suite, 'formule expirée : rien ne sort', JSON.stringify(r));
    r = await poste({ id, login: 'abonne', password: 'secret123' });
    dire(r.j.ok && r.j.suite && r.j.suite.parties[0].html.includes('SECRET'), 'abonné : la suite arrive', JSON.stringify(r));
    const tok = r.j.token;
    r = await poste({ id, token: tok });
    dire(r.j.ok && r.j.suite.quiz.length === 1, 'abonné : le jeton sert à la leçon suivante', JSON.stringify(r));
    r = await poste({ id: '3e-maths-absente', token: tok });
    dire(r.h === 200 && r.j.raison === 'non_depose', 'fichier non déposé : refus explicite, pas une page blanche', JSON.stringify(r));
    r = await poste({ id, token: 'x.y' });
    dire(r.j.raison === 'connexion' && !r.j.suite, 'jeton falsifié : rien ne sort', JSON.stringify(r));
    for (const m of ['../../data/veritas_db', '..%2f..%2fdata', 'a/b', '3E-MATHS']) {
      r = await poste({ id: m, token: tok });
      dire(r.h === 400 && !r.j.suite, 'identifiant fabriqué refusé : ' + m, JSON.stringify(r));
    }
  } finally { srv.kill(); }

  global.window = {}; const L = {};
  global.VRT_L = (i, o) => { L[i] = o; };
  const ap = fs.readdirSync(path.join(RACINE, 'apprendre')).filter(f => /^apercus-.*\.js$/.test(f));
  for (const f of ap) eval(fs.readFileSync(path.join(RACINE, 'apprendre', f), 'utf8'));
  const v = Object.entries(L).filter(([, o]) => o.verrou);
  dire(v.length > 0, `des leçons à verrou existent (${v.length})`);
  dire(v.every(([, o]) => o.quiz.length === 0 && o.revision.length === 0 && !o.exo), 'aucun quiz, aucune fiche, aucun exercice public sur une leçon à verrou');
  dire(v.every(([, o]) => o.parties.slice(1).every(p => p.verrou && !p.html)), 'les parties suivantes ne publient que leur titre');
  dire(v.every(([, o]) => o.parties[0].html && o.objectifs.length && o.intro), 'objectifs, introduction et définition restent visibles');
  try { fs.rmSync(BAC, { recursive: true, force: true }); } catch (e) { }
  console.log(`\n${ok} réussis, ${ko} échoués`);
  process.exit(ko ? 1 : 0);
})();
