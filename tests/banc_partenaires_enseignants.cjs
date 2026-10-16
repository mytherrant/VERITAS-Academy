#!/usr/bin/env node
/* ════════════════════════════════════════════════════════════════════════════
   tests/banc_partenaires_enseignants.cjs — LES ENSEIGNANTS-PARTENAIRES, DE BOUT EN BOUT
   © 2024-2026 Jacques Miterand TAKOU (Mythe Errant).

     node tests/banc_partenaires_enseignants.cjs

   ─── CE QU'IL PROTÈGE (grille du 16/10/2026) ────────────────────────────────

   Un geste de l'administrateur (`api/plateforme.php?action=partenaires`) doit
   donner à un professeur : un compte de l'Atelier, un code de reprise qui le
   rouvre, un code public à partager, et l'Atelier au palier Enseignant pour
   60 jours. Le moteur (taux, reconduction, répartition) est éprouvé par
   tests/parrainage.php ; ici on parle au VRAI endpoint, par HTTP, sur un
   `php -S` jetable — comme le navigateur de l'administration et l'Atelier.

   Le cas qui justifie le registre : une synchronisation administrateur plus
   ancienne efface le compte de la base. Le code de reprise doit le recréer,
   et l'accès doit revenir.
   ══════════════════════════════════════════════════════════════════════════ */
'use strict';

const fs = require('fs');
const os = require('os');
const path = require('path');
const { spawn } = require('child_process');

const RACINE = path.resolve(__dirname, '..');
const V = '\x1b[32m✓\x1b[0m', X = '\x1b[31m✗\x1b[0m', G = '\x1b[1m', R = '\x1b[0m';
let ok = 0, ko = 0;
const dire = (b, m, d) => {
  b ? ok++ : ko++;
  console.log('  ' + (b ? V : X) + ' ' + m + (!b && d ? '  → ' + d : ''));
};

const PORT = 8981 + (process.pid % 90);
const BASE = 'http://127.0.0.1:' + PORT;
const SECRET = 'banc-partenaires-' + Math.random().toString(36).slice(2, 12);
const BAC = fs.mkdtempSync(path.join(os.tmpdir(), 'vrt-banc-partenaires-'));

/* Dépendances de _auth_lib.php : en oublier une donne une erreur fatale, pas un contrôle en moins. */
const FICHIERS = ['plateforme.php', '_json_boot.php', 'config_sync.php',
  '_auth_lib.php', '_livret_lib.php', '_notify_lib.php', '_skysms_lib.php', '_parrainage_lib.php', '_recettes_lib.php', '_sentinel.php',
  '_bot_log.php'];

function monterBac() {
  fs.mkdirSync(path.join(BAC, 'api', 'data'), { recursive: true });
  fs.mkdirSync(path.join(BAC, 'data'), { recursive: true });
  for (const f of FICHIERS) {
    const src = path.join(RACINE, 'api', f);
    if (fs.existsSync(src)) fs.copyFileSync(src, path.join(BAC, 'api', f));
  }
  fs.writeFileSync(path.join(BAC, 'api', 'payment_config.php'),
    "<?php define('API_SECRET', " + JSON.stringify(SECRET) + ");\n");
  fs.writeFileSync(path.join(BAC, 'data', 'veritas_db.json'), JSON.stringify({
    school: { nom: 'VÉRITAS' }, students: [], studentAccounts: [],
    visitorAccounts: [{ id: 'va_autre', user: 'autre', nom: 'Autre', tel: '677000000', statut: 'actif', codeParrain: 'PROF-PRIS', plans: [] }],
    plateforme: { offres: { joursEssai: 7, essaisParIp: 50 } }, lastModified: 1000,
  }));
}

let serveur = null;
async function lancerServeur() {
  serveur = spawn('php', ['-S', '127.0.0.1:' + PORT, '-t', BAC], { cwd: BAC, stdio: ['ignore', 'ignore', 'ignore'] });
  for (let i = 0; i < 60; i++) {
    try { const r = await fetch(BASE + '/api/plateforme.php?action=config'); if (r.status) return true; }
    catch (e) { await new Promise(s => setTimeout(s, 150)); }
  }
  return false;
}
async function appel(url, opts) {
  const r = await fetch(BASE + '/api/plateforme.php' + url, opts || {});
  let j = {}; try { j = await r.json(); } catch (e) {}
  return { http: r.status, j };
}
const poste = (url, corps, jeton) => appel(url, {
  method: 'POST',
  headers: Object.assign({ 'Content-Type': 'application/json' }, jeton ? { Authorization: 'Bearer ' + jeton } : {}),
  body: JSON.stringify(corps || {}),
});
const lireBase = () => JSON.parse(fs.readFileSync(path.join(BAC, 'data', 'veritas_db.json'), 'utf8'));
const ecrireBase = (db) => fs.writeFileSync(path.join(BAC, 'data', 'veritas_db.json'), JSON.stringify(db));
const lireRegistre = () => {
  const f = path.join(BAC, 'api', 'data', 'parrainage', 'registre.json');
  return fs.existsSync(f) ? JSON.parse(fs.readFileSync(f, 'utf8')) : {};
};

(async () => {
  console.log('\n' + G + 'VÉRITAS — enseignants-partenaires : compte, codes, accès de 60 jours' + R + '\n');
  monterBac();
  if (!(await lancerServeur())) { console.log('  ' + X + ' impossible de lancer php -S'); process.exit(1); }
  try {
    let r = await poste('?action=partenaires', { op: 'creer', nom: 'IPR Test', tel: '699000001', code: 'PROF-TEST' });
    dire(r.http === 401, 'sans la clé d’administration : refusé (401)', r.http);

    r = await poste('?action=partenaires', { op: 'creer', nom: 'IPR Test', tel: '6 99 00 00 01', code: 'prof-test' }, SECRET);
    const reprise = r.j.reprise || '';
    dire(r.http === 201 && r.j.ok && r.j.cree && /^[A-Z0-9]{4}-[A-Z0-9]{4}-[A-Z0-9]{4}$/.test(reprise),
      'création : compte neuf + code de reprise rendu une fois', JSON.stringify(r.j));
    const accId = r.j.accId;
    const jours = Math.round((Date.parse(r.j.fin) - Date.now()) / 86400000);
    dire(jours >= 59 && jours <= 61, 'accès ouvert pour 60 jours (fin ' + r.j.fin + ')', jours);

    const acc = (lireBase().visitorAccounts || []).find(a => a.id === accId) || {};
    dire(acc.codeParrain === 'PROF-TEST' && acc.tel === '699000001' && acc.pwd === '' && acc.srvCreated && acc.platCode,
      'compte : code public, numéro normalisé, sans mot de passe, marqué « né sur le serveur »', JSON.stringify(acc));
    dire(!JSON.stringify(lireBase()).includes(reprise) && !JSON.stringify(lireRegistre()).includes(reprise),
      'le code de reprise n’est rangé nulle part en clair');
    const e = (lireRegistre().partenaires || {})['acc:' + accId] || {};
    dire(e.code === 'PROF-TEST' && e.actif && e.rh, 'registre : partenaire inscrit, avec l’empreinte du code de reprise', JSON.stringify(e));

    r = await poste('?action=reprise', { code: reprise });
    dire(r.j.ok && r.j.droit && r.j.droit.ok && r.j.droit.motif === 'abonnement' && r.j.droit.plan === 'ens' && r.j.droit.partenaire,
      'le code de reprise ouvre l’Atelier au palier Enseignant', JSON.stringify(r.j.droit));

    r = await poste('?action=partenaires', { op: 'creer', nom: 'IPR Test', tel: '+237699000001', code: 'PROF-TEST' }, SECRET);
    dire(r.j.ok && r.j.cree === false && r.j.accId === accId
      && lireBase().visitorAccounts.filter(a => a.tel === '699000001').length === 1,
      'recréer le même numéro : rattaché au même compte, pas de doublon', JSON.stringify(r.j));
    const reprise2 = r.j.reprise;

    r = await poste('?action=partenaires', { op: 'creer', nom: 'Autre prof', tel: '699000002', code: 'PROF-TEST' }, SECRET);
    dire(!r.j.ok, 'un code déjà attribué à un autre professeur est refusé', JSON.stringify(r.j));
    r = await poste('?action=partenaires', { op: 'creer', nom: 'Autre prof', tel: '699000002', code: 'PROF-PRIS' }, SECRET);
    dire(!r.j.ok, 'un code déjà porté par un compte existant est refusé', JSON.stringify(r.j));
    r = await poste('?action=partenaires', { op: 'creer', nom: 'Sans numéro', tel: '1234', code: 'PROF-X' }, SECRET);
    dire(!r.j.ok, 'un numéro qui n’est pas camerounais à 9 chiffres est refusé', JSON.stringify(r.j));

    r = await poste('?action=reprise', { code: reprise });
    dire(!r.j.ok, 'l’ancien code de reprise ne vaut plus après en avoir émis un neuf');

    // Une synchronisation administrateur plus ancienne efface le compte.
    const db = lireBase();
    db.visitorAccounts = db.visitorAccounts.filter(a => a.id !== accId);
    ecrireBase(db);
    r = await poste('?action=reprise', { code: reprise2 });
    const recree = (lireBase().visitorAccounts || []).find(a => a.id === accId) || null;
    dire(r.j.ok && r.j.droit && r.j.droit.partenaire && recree && recree.codeParrain === 'PROF-TEST',
      'compte effacé par une synchro : le code de reprise le recrée, même identifiant, accès rendu', JSON.stringify(r.j));

    r = await poste('?action=partenaires', { op: 'suspendre', accId }, SECRET);
    const rs = await poste('?action=reprise', { code: reprise2 });
    dire(r.j.ok && rs.j.ok && rs.j.droit && !rs.j.droit.partenaire,
      'suspendu : le compte se rouvre, mais sans l’accès partenaire', JSON.stringify(rs.j.droit));
    await poste('?action=partenaires', { op: 'reactiver', accId }, SECRET);
    const avant = lireRegistre().partenaires['acc:' + accId].fin * 1000;
    r = await poste('?action=partenaires', { op: 'reconduire', accId, jours: 60 }, SECRET);
    const apres = lireRegistre().partenaires['acc:' + accId].fin * 1000;
    dire(r.j.ok && Math.round((apres - avant) / 86400000) === 60, 'reconduction manuelle : +60 jours', r.j.fin);

    r = await appel('?action=partenaires', { headers: { Authorization: 'Bearer ' + SECRET } });
    const l = (r.j.partenaires || [])[0] || {};
    dire(r.j.ok && r.j.partenaires.length === 1 && l.code === 'PROF-TEST' && l.seuil === 5 && r.j.regle.commissionPartenairePct === 20,
      'liste d’administration : un partenaire, seuil 5, taux 20 %', JSON.stringify(r.j).slice(0, 300));
  } finally {
    try { serveur && serveur.kill(); } catch (e) {}
    try { fs.rmSync(BAC, { recursive: true, force: true }); } catch (e) {}
  }
  console.log('\n' + (ko === 0 ? '\x1b[32m' + G + '  ✓ ' + ok + '/' + ok + ' contrôles passés' : '\x1b[31m' + G + '  ✗ ' + ko + ' échec(s) sur ' + (ok + ko)) + R + '\n');
  process.exit(ko === 0 ? 0 : 1);
})();
