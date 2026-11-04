// Banc navigateur (local : php -S 127.0.0.1:8000 -t gestion, puis node tests/banc_gestion_detail_sorties.cjs <dossier captures>)
// Bilan : détail des sorties (qui a saisi quoi) ; une dépense touchée s'ouvre ; l'admin annule une dépense
// validée (doublon) avec un motif ; un partenaire ne le peut pas. Noms fictifs.
const { chromium } = require('playwright');
const B = 'http://127.0.0.1:8000/';
const OUT = process.argv[2] || '.';
const echecs = [];
const ok = (n, c, d) => { console.log((c ? '  OK    ' : '  ÉCHEC ') + n + (c ? '' : '  → ' + d)); if (!c) echecs.push(n); };
const aJour = (p) => p.waitForFunction(() => document.getElementById('puce-sync').textContent === 'À jour', null, { timeout: 15000 }).catch(() => {});
const hex = () => Math.random().toString(16).slice(2, 12) + Math.random().toString(16).slice(2, 12);
const SUF = Date.now().toString(36).slice(-4).toUpperCase();
async function login(nav, id, mdp) {
  const ctx = await nav.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true, deviceScaleFactor: 2 });
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
  const auj = new Date(Date.now() - new Date().getTimezoneOffset() * 60000).toISOString().slice(0, 10);
  const comptes = (await api('comptes')).comptes;
  const act = comptes.find((u) => !u.admin_global && u.actif && Object.values(u.acces).includes('actionnaire'));
  const cid = Object.keys(act.acces).find((c) => act.acces[c] === 'actionnaire');
  await api('sync/pousser', { ops: [{ op: hex(), t: 'centres', id: cid, champs: { debut_comptes: '' } }] });
  const d1 = 'de' + hex(), d2 = 'de' + hex();
  const pa = await login(nav, act.identifiant, (await api('comptes/mdp', { id: act.id })).mdp);
  let r = await apiDe(pa)('sync/pousser', { ops: [
    { op: hex(), t: 'depenses', id: d1, champs: { centre_id: cid, libelle: 'Paie prof info ' + SUF, montant: 3000, date: auj, categorie: 'fournitures', mode: 'especes' } },
    { op: hex(), t: 'depenses', id: d2, champs: { centre_id: cid, libelle: 'Craie ' + SUF, montant: 200, date: auj, categorie: 'fournitures', mode: 'especes' } }] });
  ok('préparation : deux dépenses saisies par le partenaire', r.resultats.every((x) => x.ok), JSON.stringify(r).slice(0, 200));
  r = await api('sync/pousser', { ops: [{ op: hex(), t: 'depenses', id: d1, champs: { statut: 'validee' } }] });
  ok('l\'admin valide la première', r.resultats[0].ok, JSON.stringify(r).slice(0, 200));

  await adm.click('#puce-sync'); await aJour(adm);
  await adm.selectOption('#choix-centre', cid).catch(() => {});
  await adm.goto(B + '#/bilan'); await adm.waitForSelector(`[data-a="voir-depense"][data-id="${d1}"]`);
  const t = await adm.textContent('main');
  ok('Bilan : « Détail des sorties » avec la dépense, son auteur et celle en attente', t.includes('Détail des sorties') && t.includes('Paie prof info ' + SUF) && t.includes('saisie par ' + act.nom) && t.includes('Craie ' + SUF), '');
  await adm.screenshot({ path: OUT + '/detail_sorties.png', fullPage: true });
  await adm.click(`[data-a="voir-depense"][data-id="${d2}"]`); await adm.waitForSelector('#feuille [data-a="valider-depense"]');
  ok('dépense en attente touchée : Valider / Refuser', await adm.isVisible('#feuille [data-a="refuser-depense"]'), '');
  await adm.click('#feuille [data-a="valider-depense"]'); await aJour(adm); await adm.waitForTimeout(500);
  await adm.click(`[data-a="voir-depense"][data-id="${d1}"]`); await adm.waitForSelector('#feuille [data-a="refuser-depense"][data-v="annuler"]');
  await adm.click('#feuille [data-a="refuser-depense"][data-v="annuler"]'); await adm.waitForSelector('#feuille form[data-f="refus"]');
  await adm.fill('#feuille form[data-f="refus"] input[name=motif]', 'doublon de la paie (banc)');
  await adm.click('#feuille form[data-f="refus"] button[type=submit]'); await aJour(adm); await adm.waitForTimeout(600);
  const L = (await api('sync/tirer&depuis=0')).lignes;
  const D = (id) => L.depenses.find((x) => x.id === id) || {};
  ok('serveur : dépense validée annulée par l\'admin, l\'autre validée', D(d1).statut === 'refusee' && /doublon/.test(D(d1).motif_refus) && D(d2).statut === 'validee', JSON.stringify([D(d1).statut, D(d2).statut]));
  ok('Bilan : la dépense annulée ne figure plus dans le détail', !(await adm.textContent('main')).includes('Paie prof info ' + SUF), '');
  r = await apiDe(pa)('sync/pousser', { ops: [{ op: hex(), t: 'depenses', id: d2, champs: { statut: 'refusee', motif_refus: 'essai partenaire' } }] });
  ok('partenaire : n\'annule pas une dépense validée', r.resultats[0].ok === false, JSON.stringify(r).slice(0, 200));
  r = await api('sync/pousser', { ops: [{ op: hex(), t: 'depenses', id: d2, champs: { montant: 1 } }] });
  ok('admin : une dépense validée ne change pas de montant', r.resultats[0].ok === false, JSON.stringify(r).slice(0, 200));

  for (const [n, p] of [['admin', adm], ['actionnaire', pa]]) ok(n + ' : aucune erreur JavaScript', p.err.length === 0, p.err.join(' / '));
  await nav.close();
  console.log(echecs.length ? `\n${echecs.length} échec(s)` : '\nTout est vert.');
  process.exit(echecs.length ? 1 : 0);
})();
