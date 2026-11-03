// Banc navigateur (local : php -S 127.0.0.1:8000 -t gestion, puis node tests/banc_gestion_exports.cjs <dossier captures>)
// Banc navigateur VÉRITAS Gestion : feuille du jour en image et en PDF, messages aux parents. Noms fictifs.
const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');
const B = 'http://127.0.0.1:8000/';
const OUT = process.argv[2] || '.';
const echecs = [];
const ok = (nom, c, d) => { console.log((c ? '  OK    ' : '  ÉCHEC ') + nom + (c ? '' : '  → ' + d)); if (!c) echecs.push(nom); };
const SUF = Date.now().toString(36).slice(-4).toUpperCase();
const hh = (m) => String(Math.floor(m / 60)).padStart(2, '0') + ':' + String(m % 60).padStart(2, '0');

/** Contrôle structurel d'un PDF : en-tête, %%EOF, et chaque entrée xref pointe sur « N 0 obj ». */
function controlerPdf(buf) {
  const txt = buf.toString('latin1');
  const pages = (txt.match(/\/Type \/Page\b/g) || []).length;
  const sx = +txt.slice(txt.lastIndexOf('startxref') + 9).trim().split(/\s/)[0];
  const xref = txt.slice(sx);
  const n = +xref.match(/^xref\n0 (\d+)/)[1];
  const lignes = xref.split('\n').slice(2, 2 + n);
  let erreurs = 0;
  for (let k = 1; k < n; k++) {
    const off = +lignes[k].slice(0, 10);
    if (!txt.startsWith(k + ' 0 obj', off)) erreurs++;
  }
  return { entete: txt.startsWith('%PDF-1.4'), fin: txt.trimEnd().endsWith('%%EOF'), pages, objets: n - 1, erreurs, jpeg: (txt.match(/\/DCTDecode/g) || []).length };
}
/** Dimensions d'un PNG (IHDR). */
const dimPng = (b) => ({ l: b.readUInt32BE(16), h: b.readUInt32BE(20), sig: b.slice(1, 4).toString() === 'PNG' });

(async () => {
  const nav = await chromium.launch();
  const ctx = await nav.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true, acceptDownloads: true });
  // Pas de partage natif dans le navigateur de test : on force le repli « téléchargement ».
  await ctx.addInitScript(() => { try { Object.defineProperty(navigator, 'canShare', { value: undefined }); } catch (e) {} });
  const page = await ctx.newPage();
  page.setDefaultTimeout(15000);
  const erreurs = [];
  page.on('pageerror', (e) => erreurs.push(e.message));
  page.on('requestfailed', (r) => erreurs.push('requête coupée : ' + r.method() + ' ' + r.url().replace(B, '') + ' (' + (r.failure() || {}).errorText + ')'));
  page.on('console', (m) => { if (m.type() === 'error') erreurs.push(m.text()); });
  const aJour = () => page.waitForFunction(() => document.getElementById('puce-sync').textContent === 'À jour', null, { timeout: 15000 }).catch(() => {});
  const api = (route, corps) => page.evaluate(async ([route, corps]) => {
    const m = await new Promise((ok) => { const r = indexedDB.open('veritas-gestion'); r.onsuccess = () => ok(r.result); });
    const jeton = await new Promise((ok) => { const g = m.transaction('meta').objectStore('meta').get('jeton'); g.onsuccess = () => ok(g.result.v); });
    const rep = await fetch('api/index.php?r=' + route, { method: corps ? 'POST' : 'GET', headers: { Authorization: 'Bearer ' + jeton, 'Content-Type': 'application/json' }, body: corps ? JSON.stringify(corps) : undefined });
    return rep.json();
  }, [route, corps]);
  const id = (p) => p + '-' + Math.random().toString(16).slice(2, 14);
  const iso0 = (() => { const x = new Date(); return x.getFullYear() + '-' + String(x.getMonth() + 1).padStart(2, '0') + '-' + String(x.getDate()).padStart(2, '0'); })();

  await page.goto(B);
  await page.fill('input[name=identifiant]', 'jacques');
  await page.fill('input[name=mdp]', 'MotDePasse-Test-2026');
  await page.click('button[type=submit]');
  await page.waitForSelector('text=Bonjour');
  await aJour();

  // ── Préparation : deux classes pointées aujourd'hui (30 élèves dans la 1re : 2 pages A4) ──
  const t = await api('sync/tirer');
  const A = t.lignes.centres.find((c) => c.nom_court === 'Ndog-passi III').id;
  const mat = t.lignes.matieres.find((m) => m.nom === 'Mathématiques').id;
  const d = new Date(); const now = d.getHours() * 60 + d.getMinutes();
  const debut = Math.max(0, now - 20), fin = Math.min(23 * 60 + 59, now + 60);
  const jour = d.getDay() === 0 ? 7 : d.getDay();
  const PRENOMS = ['Luc', 'Anne', 'Joël', 'Rita', 'Paul', 'Inès', 'Hervé', 'Aïcha', 'Brice', 'Clarisse'];
  const ops = [];
  const classes = [];
  for (const [k, taille] of [[0, 30], [1, 6]]) {
    const cl = id('cl'); classes.push(cl);
    ops.push({ op: id('op'), t: 'classes', id: cl, champs: { centre_id: A, nom: 'Export ' + SUF + (k ? ' B' : ' A'), niveau: 'Tle' } });
    ops.push({ op: id('op'), t: 'creneaux', id: id('cr'), champs: { centre_id: A, classe_id: cl, matiere_id: mat, enseignant_id: '', jour, debut: hh(debut), fin: hh(fin), salle: '' } });
    const s = 'sa' + iso0.replace(/-/g, '') + cl;
    ops.push({ op: id('op'), t: 'seances', id: s, champs: { centre_id: A, classe_id: cl, date: iso0, debut: hh(debut), fin: hh(fin) } });
    for (let i = 0; i < taille; i++) {
      const e = id('el');
      ops.push({ op: id('op'), t: 'eleves', id: e, champs: { centre_id: A, classe_id: cl, nom: 'ÉLÈVE' + SUF + String.fromCharCode(65 + k) + String(i).padStart(2, '0'), prenoms: PRENOMS[i % 10], parent_nom: 'Parent ' + PRENOMS[i % 10], parent_tel: '69' + String(2000000 + i).slice(-7) } });
      const st = i % 5 === 1 ? { statut: 'absent' } : i % 5 === 2 ? { statut: 'present', arrivee: hh(debut + 25) } : { statut: 'present', arrivee: hh(debut) };
      ops.push({ op: id('op'), t: 'presences', id: id('pr'), champs: Object.assign({ centre_id: A, seance_id: s, eleve_id: e }, st) });
    }
  }
  const rep = await api('sync/pousser', { ops });
  ok('préparation acceptée par le serveur', rep.resultats.every((x) => x.ok), JSON.stringify(rep.resultats.filter((x) => !x.ok)).slice(0, 300));
  await page.click('#puce-sync'); await aJour();

  // ── Image PNG ──
  await page.goto(B + '#/pointage/' + classes[0] + '/' + iso0);
  await page.waitForSelector('[data-a="ouvrir-export"]');
  await page.click('[data-a="ouvrir-export"]');
  let dl = page.waitForEvent('download');
  await page.click('[data-a="export"][data-v="png"]');
  let f = await dl;
  const png = path.join(OUT, 'feuille.png');
  await f.saveAs(png);
  const dim = dimPng(fs.readFileSync(png));
  ok('image PNG produite (' + dim.l + '×' + dim.h + ')', dim.sig && dim.l === 1240 && dim.h > 30 * 54, JSON.stringify(dim));
  ok('nom de fichier sans accent ni espace', /^presence-Export-[A-Z0-9]+-A-\d{4}-\d{2}-\d{2}\.png$/.test(f.suggestedFilename()), f.suggestedFilename());

  // ── PDF A4 ──
  dl = page.waitForEvent('download');
  await page.click('[data-a="export"][data-v="pdf"]');
  f = await dl;
  const pdf = path.join(OUT, 'feuille.pdf');
  await f.saveAs(pdf);
  const c = controlerPdf(fs.readFileSync(pdf));
  ok('PDF bien formé (en-tête, %%EOF, table d\'index exacte)', c.entete && c.fin && c.erreurs === 0, JSON.stringify(c));
  ok('30 élèves → 2 pages A4, une image par page', c.pages === 2 && c.jpeg === 2, JSON.stringify(c));
  await page.click('#feuille [data-a="fermer"]');

  // ── Messages aux parents ──
  const bloc = await page.textContent('main');
  ok('section « Messages aux parents » : absents et retardataires', /Messages aux parents/.test(bloc) && /\d+ messages? à envoyer/.test(bloc), bloc.slice(-400));
  const lien = page.locator('.ligne.message a[data-canal="whatsapp"]').first();
  const href = await lien.getAttribute('href');
  const txt = decodeURIComponent(href.split('?text=')[1] || '');
  ok('message pré-rédigé : nom, classe, date, téléphone du centre', /^Bonjour Parent /.test(txt) && txt.includes('Export ' + SUF + ' A') && /\d \d\d \d\d \d\d \d\d/.test(txt), txt);
  const sms = await page.locator('.ligne.message a[data-canal="sms"]').first().getAttribute('href');
  ok('lien SMS vers le numéro du parent', /^sms:\+23769\d{7}\?body=/.test(sms), sms);
  const popup = page.waitForEvent('popup');
  await lien.click();
  const pp = await popup;
  ok('WhatsApp s\'ouvre sur le bon lien', pp.url().startsWith('https://wa.me/237') || pp.url().includes('whatsapp') || pp.url().includes('wa.me'), pp.url());
  await pp.close().catch(() => {});
  await page.waitForSelector('.ligne.message small:has-text("préparé à")');
  ok('trace « message préparé » affichée', true);
  await aJour();
  const srv = await api('sync/tirer');
  ok('trace enregistrée au serveur', srv.lignes.presences.some((p) => /^\d{4}-\d\d-\d\d \d\d:\d\d:\d\d whatsapp$/.test(p.notifie || '')), '');
  await page.screenshot({ path: OUT + '/g_messages.png', fullPage: true });

  // ── Toutes les feuilles du jour ──
  await page.goto(B + '#/appel');
  await page.click('.puces .puce:has-text("Ndog-passi III")').catch(() => {});
  await page.waitForSelector('[data-a="export-jour"]');
  const fichiers = [];
  page.on('download', (x) => fichiers.push(x.suggestedFilename()));
  await page.click('[data-a="export-jour"]');
  await page.waitForTimeout(4000);
  ok('« Partager les feuilles du jour » : une image par classe pointée', fichiers.length >= 2 && fichiers.every((n) => n.endsWith('.png')), fichiers.join(', '));

  ok('aucune erreur JavaScript', erreurs.length === 0, erreurs.join(' / '));
  console.log(echecs.length ? `\n${echecs.length} échec(s)` : '\nTout est vert.');
  await nav.close();
  process.exit(echecs.length ? 1 : 0);
})().catch((e) => { console.error(e); process.exit(2); });
