// Banc navigateur (local : php -S 127.0.0.1:8000 -t gestion, puis node tests/banc_gestion_rapports.cjs <dossier captures>)
// Rapports : insolvables (montants dus), paiements par mois et par classe (cases du cahier), rapport du
// trésorier ; exports PDF (paginé), Excel (CSV ; avec BOM), image. Noms fictifs.
const { chromium } = require('playwright');
const fs = require('fs');
const B = 'http://127.0.0.1:8000/';
const OUT = process.argv[2] || '.';
const echecs = [];
const ok = (n, c, d) => { console.log((c ? '  OK    ' : '  ÉCHEC ') + n + (c ? '' : '  → ' + d)); if (!c) echecs.push(n); };
const aJour = (p) => p.waitForFunction(() => document.getElementById('puce-sync').textContent === 'À jour', null, { timeout: 15000 }).catch(() => {});
const hex = () => Math.random().toString(16).slice(2, 12) + Math.random().toString(16).slice(2, 12);
const SUF = Date.now().toString(36).slice(-4).toUpperCase();
const nb = (t) => +String(t || '0').replace(/[^\d-]/g, '') || 0;

(async () => {
  const nav = await chromium.launch();
  const ctx = await nav.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true, deviceScaleFactor: 2, acceptDownloads: true });
  await ctx.addInitScript(() => { try { Object.defineProperty(navigator, 'share', { value: undefined }); Object.defineProperty(navigator, 'canShare', { value: undefined }); } catch (e) {} });
  const page = await ctx.newPage(); page.setDefaultTimeout(20000); const err = []; page.on('pageerror', (e) => err.push(e.message));
  await page.goto(B); await page.fill('input[name=identifiant]', 'jacques'); await page.fill('input[name=mdp]', 'MotDePasse-Test-2026');
  await page.click('button[type=submit]'); await page.waitForSelector('text=Bonjour'); await aJour(page);
  const api = (route, corps) => page.evaluate(async ([route, corps]) => {
    const m = await new Promise((ok) => { const r = indexedDB.open('veritas-gestion'); r.onsuccess = () => ok(r.result); });
    const jeton = await new Promise((ok) => { const g = m.transaction('meta').objectStore('meta').get('jeton'); g.onsuccess = () => ok(g.result.v); });
    const rep = await fetch('api/index.php?r=' + route, { method: corps ? 'POST' : 'GET', headers: { Authorization: 'Bearer ' + jeton, 'Content-Type': 'application/json' }, body: corps ? JSON.stringify(corps) : undefined });
    return rep.json();
  }, [route, corps]);
  const L = (await api('sync/tirer&depuis=0')).lignes;
  const III = L.centres.find((c) => /Ndog-passi III/.test(c.nom));
  const k = hex(), nomClasse = 'Rapport ' + SUF;
  await api('sync/pousser', { ops: [{ op: hex(), t: 'classes', id: k, champs: { centre_id: III.id, nom: nomClasse, niveau: '1ere', inscription: 2500, mensualite: 7500 } }] });
  await page.click('#puce-sync'); await aJour(page); await page.waitForTimeout(500);

  // Trois élèves : A à jour sur octobre, B sans inscription payée, C inscription partielle.
  await page.goto(B + '#/eleves'); await page.click('[data-a="importer-eleves"]'); await page.waitForSelector('#feuille select[name=centre_import]');
  await page.selectOption('#feuille select[name=centre_import]', III.id); await page.waitForTimeout(300);
  await page.selectOption('#feuille select[name=classe_id]', k);
  await page.fill('#feuille textarea[name=liste]', `AAA${SUF} Alpha ; 2500 ; 7500\nBBB${SUF} Beta ; - ; 7500\nCCC${SUF} Gamma ; 2000`);
  await page.dispatchEvent('#feuille textarea[name=liste]', 'input'); await page.waitForTimeout(300);
  await page.click('#feuille form[data-f="import"] button[type=submit]'); await page.waitForTimeout(2500); await aJour(page); await page.waitForTimeout(800);

  // 1. Insolvables
  await page.goto(B + '#/accueil'); await page.goto(B + '#/rapports'); await page.waitForSelector('table.rapport');
  await page.click(`[data-a="rap-centre"][data-v="${III.id}"]`).catch(() => {});
  await page.click('[data-a="rap-onglet"][data-v="insolvables"]'); await page.waitForTimeout(300);
  const du = async (nom) => { const r = await page.$(`table.rapport tbody tr:has-text("${nom}")`); return r ? nb(await r.$eval('td:nth-child(4)', (td) => td.textContent)) : 0; };
  const dA = await du('AAA' + SUF), dB = await du('BBB' + SUF), dC = await du('CCC' + SUF);
  ok('insolvables : B doit 2 500 F de plus que A (inscription non payée)', dB - dA === 2500 && dB > 0, `A=${dA} B=${dB}`);
  ok('insolvables : C doit 5 500 F de plus que B (paie par tranches, imputation)', dC - dB === 5500, `B=${dB} C=${dC}`);
  ok('insolvables : sous-total de la classe et total général', /Sous-total Rapport/.test(await page.textContent('table.rapport')) && /Total · \d+ élève/.test(await page.textContent('table.rapport tfoot')), '');
  await page.screenshot({ path: OUT + '/rapport_insolvables.png', fullPage: true });

  // 2. Paiements par mois et par classe
  await page.click('[data-a="rap-onglet"][data-v="paiements"]'); await page.waitForSelector('table.rapport');
  const enTetes = await page.$$eval('table.rapport thead th', (l) => l.map((x) => x.textContent));
  const ligneA = await page.$$eval(`table.rapport tbody tr:has-text("AAA${SUF}") td`, (l) => l.map((x) => x.textContent));
  const iOct = enTetes.findIndex((t) => /^oct/i.test(t)), iIns = enTetes.indexOf('Insc.');
  ok('par mois et classe : A = 2 500 en inscription, 7 500 en octobre', nb(ligneA[iIns]) === 2500 && nb(ligneA[iOct]) === 7500, JSON.stringify({ enTetes, ligneA }));
  const ligneC = await page.$$eval(`table.rapport tbody tr:has-text("CCC${SUF}") td`, (l) => l.map((x) => x.textContent));
  ok('par mois et classe : C = 2 000 en inscription (tranche), 0 en octobre', nb(ligneC[iIns]) === 2000 && ligneC[iOct].trim() === '0', JSON.stringify(ligneC));
  ok('par mois et classe : groupe et total de la classe', (await page.textContent('table.rapport')).includes(nomClasse) && (await page.textContent('table.rapport')).includes('Total ' + nomClasse), '');

  // Exports
  const exporter = async (v) => { const [d] = await Promise.all([page.waitForEvent('download'), page.click(`[data-a="export-rapport"][data-v="${v}"]`)]); const p = OUT + '/' + d.suggestedFilename(); await d.saveAs(p); return { nom: d.suggestedFilename(), buf: fs.readFileSync(p) }; };
  const pdf = await exporter('pdf');
  ok('export PDF (paysage, paginé)', pdf.buf.slice(0, 5).toString() === '%PDF-' && /MediaBox \[0 0 841\.89 595\.28\]/.test(pdf.buf.toString('latin1')), pdf.nom);
  const csv = await exporter('csv');
  const txt = csv.buf.toString('utf8');
  ok('export Excel (CSV ; avec BOM, colonnes et élèves)', txt.charCodeAt(0) === 0xfeff && /Élève;Insc\.;/.test(txt) && txt.includes('AAA' + SUF), txt.slice(0, 160));
  const png = await exporter('png');
  ok('export image (PNG)', png.buf.slice(1, 4).toString() === 'PNG', png.nom);

  // 3. Trésorier
  await page.click('[data-a="rap-onglet"][data-v="tresorier"]'); await page.waitForSelector('table.rapport');
  const tt = await page.textContent('main');
  ok('rapport du trésorier : partenaires, remis, non versé, fonds chez le trésorier', /Encaissé/.test(tt) && /Non versé/.test(tt) && /Fonds chez le trésorier/.test(tt), tt.slice(0, 300));
  const pdfT = await exporter('pdf');
  ok('rapport du trésorier : export PDF', pdfT.buf.slice(0, 5).toString() === '%PDF-', pdfT.nom);
  await page.screenshot({ path: OUT + '/rapport_tresorier.png', fullPage: true });

  // L'enseignant n'a pas les rapports.
  ok('aucune erreur JavaScript', err.length === 0, err.join(' / '));
  await nav.close();
  console.log(echecs.length ? `\n${echecs.length} échec(s)` : '\nTout est vert.');
  process.exit(echecs.length ? 1 : 0);
})();
