// Banc navigateur (local : php -S 127.0.0.1:8000 -t gestion, puis node tests/banc_gestion_cahier.cjs <dossier captures>)
// Cahier de textes : saisi dans la feuille d'appel, enregistré au serveur, relu dans Plus › Cahier de textes
// (par classe), exporté (PDF, Excel) ; l'enseignant ne voit que ses classes. Noms fictifs.
const { chromium } = require('playwright');
const fs = require('fs');
const B = 'http://127.0.0.1:8000/';
const OUT = process.argv[2] || '.';
const echecs = [];
const ok = (n, c, d) => { console.log((c ? '  OK    ' : '  ÉCHEC ') + n + (c ? '' : '  → ' + d)); if (!c) echecs.push(n); };
const aJour = (p) => p.waitForFunction(() => document.getElementById('puce-sync').textContent === 'À jour', null, { timeout: 15000 }).catch(() => {});
const hex = () => Math.random().toString(16).slice(2, 12) + Math.random().toString(16).slice(2, 12);
const SUF = Date.now().toString(36).slice(-4).toUpperCase();
async function login(nav, id, mdp) {
  const ctx = await nav.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true, deviceScaleFactor: 2, acceptDownloads: true });
  await ctx.addInitScript(() => { try { Object.defineProperty(navigator, 'share', { value: undefined }); Object.defineProperty(navigator, 'canShare', { value: undefined }); } catch (e) {} });
  const page = await ctx.newPage(); page.setDefaultTimeout(15000); page.err = [];
  page.on('pageerror', (e) => page.err.push(e.message));
  await page.goto(B); await page.fill('input[name=identifiant]', id); await page.fill('input[name=mdp]', mdp);
  await page.click('button[type=submit]'); await page.waitForSelector('text=Bonjour'); await aJour(page);
  return page;
}
const apiDe = (page) => (route, corps) => page.evaluate(async ([route, corps]) => {
  const m = await new Promise((ok) => { const r = indexedDB.open('veritas-gestion'); r.onsuccess = () => ok(r.result); });
  const jeton = await new Promise((ok) => { const g = m.transaction('meta').objectStore('meta').get('jeton'); g.onsuccess = () => ok(g.result.v); });
  const rep = await fetch('api/index.php?r=' + route, { method: corps ? 'POST' : 'GET', headers: { Authorization: 'Bearer ' + jeton, 'Content-Type': 'application/json' }, body: corps ? JSON.stringify(corps) : undefined });
  return rep.json();
}, [route, corps]);

(async () => {
  const nav = await chromium.launch();
  const adm = await login(nav, 'jacques', 'MotDePasse-Test-2026');
  const api = apiDe(adm);
  let L = (await api('sync/tirer&depuis=0')).lignes;
  const III = L.centres.find((c) => /Ndog-passi III/.test(c.nom));
  const comptes = (await api('comptes')).comptes;
  const prof = comptes.find((u) => !u.admin_global && u.actif && u.acces[III.id] === 'enseignant');
  const auj = new Date(Date.now() - new Date().getTimezoneOffset() * 60000).toISOString().slice(0, 10);
  const jour = ((new Date().getDay() + 6) % 7) + 1;
  const k1 = hex(), k2 = hex();
  await api('sync/pousser', { ops: [
    { op: hex(), t: 'classes', id: k1, champs: { centre_id: III.id, nom: 'Cahier A ' + SUF, niveau: '1ere' } },
    { op: hex(), t: 'classes', id: k2, champs: { centre_id: III.id, nom: 'Cahier B ' + SUF, niveau: '1ere' } }] });
  await api('sync/pousser', { ops: [{ op: hex(), t: 'creneaux', id: hex(), champs: { centre_id: III.id, classe_id: k1, matiere_id: L.matieres[0].id, enseignant_id: prof.id, jour, debut: '05:10', fin: '05:40' } }] });
  await adm.click('#puce-sync'); await aJour(adm); await adm.waitForTimeout(500);

  // Saisie dans la feuille d'appel (comme Jacques).
  await adm.goto(B + '#/pointage/' + k1 + '/' + auj); await adm.waitForSelector('form[data-f="cahier"]');
  await adm.fill('form[data-f="cahier"] textarea[name=contenu]', 'Fonctions dérivées ' + SUF);
  await adm.fill('form[data-f="cahier"] textarea[name=travail]', 'Exercices 4 et 5 page 82 ' + SUF);
  await adm.click('form[data-f="cahier"] button[type=submit]'); await aJour(adm); await adm.waitForTimeout(600);
  L = (await api('sync/tirer&depuis=0')).lignes;
  const se = L.seances.find((s) => s.classe_id === k1 && s.date === auj);
  ok('cahier de textes enregistré au serveur (fait + travail)', se && se.contenu.includes(SUF) && se.travail.includes(SUF), JSON.stringify(se || {}).slice(0, 200));
  await api('sync/pousser', { ops: [{ op: hex(), t: 'seances', id: 'sa' + auj.replace(/-/g, '') + k2, champs: { centre_id: III.id, classe_id: k2, date: auj, debut: '10:00', fin: '12:00', contenu: 'Classe B ' + SUF, travail: '' } }] });
  await adm.click('#puce-sync'); await aJour(adm);

  // Relecture dans Plus › Cahier de textes.
  await adm.goto(B + '#/moi'); ok('Plus : entrée « Cahier de textes »', await adm.isVisible('a[href="#/cahier"]'), '');
  await adm.goto(B + '#/cahier'); await adm.waitForTimeout(400);
  await adm.click(`[data-a="cdt-centre"][data-v="${III.id}"]`).catch(() => {});
  ok('page Cahier de textes : la séance avec ce qui a été fait et le travail', (await adm.textContent('main')).includes('Fonctions dérivées ' + SUF) && (await adm.textContent('main')).includes('Exercices 4 et 5 page 82 ' + SUF), '');
  await adm.click(`[data-a="cdt-classe"][data-v="${k1}"]`); await adm.waitForTimeout(300);
  ok('filtre par classe : seulement la classe A', (await adm.textContent('main')).includes('Fonctions dérivées ' + SUF) && !(await adm.textContent('main')).includes('Classe B ' + SUF), '');
  await adm.screenshot({ path: OUT + '/cahier_de_textes.png', fullPage: true });
  const exporter = async (v) => { const [d] = await Promise.all([adm.waitForEvent('download'), adm.click(`[data-a="export-cahier"][data-v="${v}"]`)]); const p = OUT + '/' + d.suggestedFilename(); await d.saveAs(p); return fs.readFileSync(p); };
  const pdf = await exporter('pdf');
  ok('export PDF du cahier', pdf.slice(0, 5).toString() === '%PDF-', '');
  const csv = (await exporter('csv')).toString('utf8');
  ok('export Excel du cahier (fait et travail en clair)', csv.includes('Ce qui a été fait') && csv.includes('Exercices 4 et 5 page 82 ' + SUF), csv.slice(0, 200));

  // L'enseignant ne voit que ses classes.
  const pp = await login(nav, prof.identifiant, (await api('comptes/mdp', { id: prof.id })).mdp);
  await pp.goto(B + '#/cahier'); await pp.waitForTimeout(400);
  await pp.click(`[data-a="cdt-centre"][data-v="${III.id}"]`).catch(() => {});
  const tp = await pp.textContent('main');
  ok('enseignant : voit sa classe, pas l\'autre', tp.includes('Fonctions dérivées ' + SUF) && !tp.includes('Classe B ' + SUF), tp.slice(0, 200));
  for (const [n, p] of [['admin', adm], ['enseignant', pp]]) ok(n + ' : aucune erreur JavaScript', p.err.length === 0, p.err.join(' / '));
  await nav.close();
  console.log(echecs.length ? `\n${echecs.length} échec(s)` : '\nTout est vert.');
  process.exit(echecs.length ? 1 : 0);
})();
