#!/usr/bin/env node
/**
 * tests/banc_sonde_ecriture.cjs — « TESTER LA CONNEXION » TESTE-T-IL LA PANNE ?
 * © 2024-2026 Jacques Miterand TAKOU (Mythe Errant).
 *
 *   node tests/banc_sonde_ecriture.cjs
 *
 * POURQUOI CE BANC EXISTE
 * Le 02/09/2026, l'écran d'administration affichait, l'un au-dessus de l'autre :
 *   « ✅ Connexion réussie ! Le serveur répond correctement. 6 fichiers en ligne. »
 *   « ⛔ Plus aucune sauvegarde depuis 5 jours. »
 * Les deux disaient vrai. Le bouton de test faisait un GET sur `files.php` — une
 * LECTURE, sur un AUTRE endpoint — pendant que la sauvegarde écrit dans
 * `db.php`, en PUT. Le test ne pouvait pas voir la panne qu'on lui demandait de
 * chercher : il rassurait.
 *
 * Ce n'était pas la première fois. Du 12 au 25/08/2026, treize jours de saisies
 * n'ont existé que dans un navigateur, derrière une pastille verte.
 *
 * CE QU'IL PROUVE
 *   ① la sonde emprunte le chemin RÉEL : `db.php`, en PUT, sous authentification ;
 *   ② elle ne touche PAS à la base — l'octet écrit est temporaire ;
 *   ③ elle ÉCHOUE quand le serveur ne peut pas écrire, au lieu de dire « réussi » ;
 *   ④ elle n'ouvre aucune porte : sans clé, c'est 401 comme le reste ;
 *   ⑤ le client la lance vraiment, par `_fbFetch` — le même chemin que la
 *      sauvegarde, sinon on testerait un chemin que personne n'emprunte.
 */
'use strict';
const { spawn, execFileSync } = require('child_process');
const fs = require('fs');
const os = require('os');
const path = require('path');

const RACINE = path.resolve(__dirname, '..');
const SECRET = 'BANC_SONDE_SECRET_0123456789';

/* Port libre demandé au système : un port fixe rend le banc intermittent au
   second lancement (TIME_WAIT), et un banc intermittent n'est plus lu. */
function portLibre() {
  const out = execFileSync(process.execPath, ['-e',
    "const s=require('net').createServer();s.listen(0,'127.0.0.1',()=>{" +
    "process.stdout.write(String(s.address().port));s.close();});"], { encoding: 'utf8' });
  const p = parseInt(out.trim(), 10);
  return Number.isInteger(p) && p > 0 ? p : 8811;
}

let ok = 0, ko = 0;
const dit = (bon, quoi, det) => {
  if (bon) { ok++; console.log('  \x1b[32m✓\x1b[0m ' + quoi); }
  else { ko++; console.log('  \x1b[31m✗\x1b[0m ' + quoi + (det ? '  → ' + det : '')); }
};

/* Dépendance, pas inventaire : `_auth_lib.php` fait des `require_once`, et en
   oublier un ici ne retire pas un contrôle — il donne une erreur fatale PHP et
   un banc qui ne mesure plus rien. Même liste que banc_compte_serveur.cjs. */
const FICHIERS = ['db.php', '_json_boot.php', 'config_sync.php', '_auth_lib.php',
  '_livret_lib.php', '_notify_lib.php', '_sentinel.php', '_bot_log.php'];

function monterBac(avecDossierData) {
  const bac = fs.mkdtempSync(path.join(os.tmpdir(), 'vrt-sonde-'));
  fs.mkdirSync(path.join(bac, 'api'), { recursive: true });
  for (const f of FICHIERS) {
    const src = path.join(RACINE, 'api', f);
    if (fs.existsSync(src)) fs.copyFileSync(src, path.join(bac, 'api', f));
  }
  fs.writeFileSync(path.join(bac, 'api', 'payment_config.php'),
    "<?php define('API_SECRET', " + JSON.stringify(SECRET) + ");\n");
  if (avecDossierData) {
    fs.mkdirSync(path.join(bac, 'data'), { recursive: true });
    fs.writeFileSync(path.join(bac, 'data', 'veritas_db.json'), JSON.stringify({
      school: { nom: 'VÉRITAS' }, students: [], visitorAccounts: [], lastModified: 1000,
    }));
  } else {
    /* Un FICHIER là où le serveur attend son dossier : `is_dir()` est faux,
       `mkdir()` échoue, l'écriture est impossible. C'est la façon portable de
       rejouer « disque plein / droits changés » — `chmod` ne veut rien dire
       sous Windows, et un banc qui ne tourne que sur Linux ne tourne pas ici. */
    fs.writeFileSync(path.join(bac, 'data'), 'pas un dossier');
  }
  return bac;
}

async function lancer(bac, port) {
  const srv = spawn('php', ['-S', '127.0.0.1:' + port, '-t', bac],
    { cwd: bac, stdio: ['ignore', 'ignore', 'ignore'] });
  for (let i = 0; i < 60; i++) {
    try {
      const r = await fetch('http://127.0.0.1:' + port + '/api/db.php', { method: 'GET' });
      if (r.status) return srv;
    } catch (e) { await new Promise(s => setTimeout(s, 150)); }
  }
  return srv;
}

async function sonde(port, secret, methode) {
  const h = { 'Content-Type': 'application/json' };
  if (secret) h['Authorization'] = 'Bearer ' + secret;
  const r = await fetch('http://127.0.0.1:' + port + '/api/db.php', {
    method: methode || 'PUT', headers: h, body: JSON.stringify({ __probe: true }),
  });
  let j = {};
  try { j = await r.json(); } catch (e) { /* corps non JSON */ }
  return { http: r.status, j };
}

(async () => {
  console.log('\n\x1b[1m« TESTER LA CONNEXION » TESTE-T-IL LA PANNE QU\'IL DOIT VOIR ?\x1b[0m\n');

  // ── ① et ② : le chemin réel, sans toucher à la base ───────────────────────
  console.log('\x1b[1m1. La sonde emprunte le chemin de la sauvegarde\x1b[0m');
  const bac = monterBac(true);
  const port = portLibre();
  const srv = await lancer(bac, port);
  const dbF = path.join(bac, 'data', 'veritas_db.json');
  const avant = fs.readFileSync(dbF, 'utf8');

  const r1 = await sonde(port, SECRET, 'PUT');
  dit(r1.http === 200 && r1.j.ok === true && r1.j.probe === true,
      'db.php répond à la sonde, en PUT — le verbe que la sauvegarde emploie',
      'HTTP ' + r1.http + ' ' + JSON.stringify(r1.j).slice(0, 140));
  dit(r1.j.method === 'PUT', 'et il confirme le verbe reçu', String(r1.j.method));
  dit(r1.j.writable === true, 'il déclare son dossier de données inscriptible');

  const apres = fs.readFileSync(dbF, 'utf8');
  dit(avant === apres, 'LA BASE N’EST PAS TOUCHÉE — une sonde qui écrirait serait une arme');

  const restes = fs.readdirSync(path.join(bac, 'data')).filter(f => f.indexOf('.probe_') === 0);
  dit(restes.length === 0, 'et le fichier temporaire est effacé', restes.join(', '));

  // ── ④ : aucune porte ouverte ──────────────────────────────────────────────
  console.log('\n\x1b[1m2. La sonde n’ouvre aucune porte\x1b[0m');
  const r2 = await sonde(port, '', 'PUT');
  dit(r2.http === 401, 'sans clé, c’est 401 — comme toute autre écriture',
      'HTTP ' + r2.http);
  const r3 = await sonde(port, 'MAUVAISE_CLE_XXXXXXXXXXXX', 'PUT');
  dit(r3.http === 401, 'avec une mauvaise clé aussi', 'HTTP ' + r3.http);

  try { srv.kill(); } catch (e) {}

  // ── ③ : elle ÉCHOUE quand l'écriture est impossible ───────────────────────
  console.log('\n\x1b[1m3. Quand le serveur ne peut PAS écrire, la sonde le dit\x1b[0m');
  const bac2 = monterBac(false);
  const port2 = portLibre();
  const srv2 = await lancer(bac2, port2);
  const r4 = await sonde(port2, SECRET, 'PUT');
  dit(r4.j.ok !== true,
      'elle ne déclare PAS « réussi » — c’est tout l’objet de ce banc',
      'HTTP ' + r4.http + ' ' + JSON.stringify(r4.j).slice(0, 140));
  dit(r4.j.writable === false, 'elle nomme la cause : le dossier n’est pas inscriptible');
  dit(r4.http === 500, 'et le code HTTP le dit aussi, pour le client', 'HTTP ' + r4.http);
  try { srv2.kill(); } catch (e) {}

  // ── ⑤ : le client la lance vraiment, par le chemin de la sauvegarde ───────
  console.log('\n\x1b[1m4. Le navigateur lance cette sonde, et par le bon chemin\x1b[0m');
  const app = fs.readFileSync(path.join(RACINE, 'app.js'), 'utf8');
  const i = app.indexOf('function cloudTestConnection');
  const bloc = i >= 0 ? app.slice(i, i + 6000) : '';
  dit(i >= 0, 'cloudTestConnection() existe');
  dit(/__probe/.test(bloc), 'le test envoie bien la sonde');
  dit(/_fbFetch\s*\(\s*LWS_API\.db/.test(bloc),
      'et il passe par _fbFetch — la même enveloppe que la sauvegarde',
      'un fetch() direct testerait un chemin que personne n’emprunte');
  /* La régression à empêcher : revenir à « Connexion réussie » sur la seule
     lecture. On exige que l'annonce de succès vive APRÈS la sonde.
     ⚠️ Les commentaires sont retirés d'abord. Le bloc RACONTE la panne, en
     citant l'ancien message : sans ce dépouillement, ce contrôle rougirait
     à cause du texte qui explique pourquoi il existe. */
  const nu = bloc
    .replace(/\/\*[\s\S]*?\*\//g, ' ')
    .replace(/(^|[^:])\/\/[^\n]*/g, '$1 ');
  const okIdx = nu.indexOf('Connexion réussie');
  const probeIdx = nu.indexOf('__probe');
  dit(okIdx > probeIdx && probeIdx > 0,
      'le succès n’est annoncé qu’APRÈS la sonde, jamais sur la lecture seule');
  dit(/écriture/i.test(bloc), 'et l’échec d’écriture a son propre message');

  console.log('\n' + '─'.repeat(68));
  const total = ok + ko;
  if (ko === 0) console.log(`\x1b[32m\x1b[1m  ✓ ${ok}/${total} contrôles passés\x1b[0m`);
  else console.log(`\x1b[31m\x1b[1m  ✗ ${ko} échec(s) sur ${total}\x1b[0m`);
  try { fs.rmSync(bac, { recursive: true, force: true }); } catch (e) {}
  try { fs.rmSync(bac2, { recursive: true, force: true }); } catch (e) {}
  process.exit(ko === 0 ? 0 : 1);
})();
