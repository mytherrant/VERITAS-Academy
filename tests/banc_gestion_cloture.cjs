// Banc navigateur (local : php -S 127.0.0.1:8000 -t gestion, puis node tests/banc_gestion_cloture.cjs <dossier captures>)
// Clôture mensuelle : comptes arrêtés par le serveur, partage, mois verrouillé (versement, dépense refusés),
// droits (actionnaire ne clôture pas, seul l'admin rouvre), compteurs des partenaires remis à zéro. Noms fictifs.
const { chromium } = require('playwright');
const B = 'http://127.0.0.1:8000/';
const OUT = process.argv[2] || '.';
const echecs = [];
const ok = (n, c, d) => { console.log((c ? '  OK    ' : '  ÉCHEC ') + n + (c ? '' : '  → ' + d)); if (!c) echecs.push(n); };
const aJour = (p) => p.waitForFunction(() => document.getElementById('puce-sync').textContent === 'À jour', null, { timeout: 15000 }).catch(() => {});
const hex = () => Math.random().toString(16).slice(2, 12) + Math.random().toString(16).slice(2, 12);
async function login(nav, id, mdp) {
  const ctx = await nav.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true, deviceScaleFactor: 2 });
  await ctx.addInitScript(() => { try { Object.defineProperty(navigator, 'share', { value: undefined }); } catch (e) {} });
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
  const now = new Date(Date.now() - new Date().getTimezoneOffset() * 60000);
  const auj = now.toISOString().slice(0, 10);
  const d = new Date(now); d.setUTCDate(15); d.setUTCMonth(d.getUTCMonth() - 1);
  const prec = d.toISOString().slice(0, 7), datePrec = prec + '-20';
  let L = (await api('sync/tirer&depuis=0')).lignes;
  const comptes = (await api('comptes')).comptes;
  const act = comptes.find((u) => !u.admin_global && u.actif && Object.values(u.acces).includes('actionnaire'));
  const cid = Object.keys(act.acces).find((c) => act.acces[c] === 'actionnaire');
  const eleve = L.eleves.find((e) => e.centre_id === cid && !Number(e.supprime));
  // Un mois précédent à clôturer, propre : on le rouvre s'il l'était.
  if (L.clotures && L.clotures.find((k) => k.id === `clo-${cid}-${prec}` && !Number(k.supprime))) await api('sync/pousser', { ops: [{ op: hex(), t: 'clotures', id: `clo-${cid}-${prec}`, suppr: true, champs: {} }] });
  await api('sync/pousser', { ops: [{ op: hex(), t: 'paiements', id: 'pa' + hex(), champs: { centre_id: cid, eleve_id: eleve.id, montant: 3000, date: datePrec, mode: 'especes' } }] });

  // L'actionnaire ne clôture pas.
  const pa = await login(nav, act.identifiant, (await api('comptes/mdp', { id: act.id })).mdp);
  let r = await apiDe(pa)('sync/pousser', { ops: [{ op: hex(), t: 'clotures', id: `clo-${cid}-${prec}`, champs: { centre_id: cid, mois: prec, parts: '[]' } }] });
  ok('un actionnaire ne clôture pas le mois', r.resultats[0].ok === false, JSON.stringify(r).slice(0, 160));

  // L'admin clôture le mois précédent depuis le Bilan.
  await adm.click('#puce-sync'); await aJour(adm);
  await adm.selectOption('#choix-centre', cid).catch(() => {});
  await adm.goto(B + '#/bilan'); await adm.click('[data-a="bilan-mois"][data-v="-1"]'); await adm.waitForSelector(`[data-a="cloturer-mois"][data-centre="${cid}"]`);
  await adm.click(`[data-a="cloturer-mois"][data-centre="${cid}"]`); await adm.click('#feuille button.btn:has-text("Clôturer")');
  await adm.waitForSelector('#feuille:has-text("Envoyer les comptes")', { timeout: 15000 }).catch(() => {});
  await adm.click('#feuille [data-a="fermer"]').catch(() => {});
  await aJour(adm); await adm.waitForTimeout(500);
  L = (await api('sync/tirer&depuis=0')).lignes;
  const k = L.clotures.find((x) => x.id === `clo-${cid}-${prec}` && !Number(x.supprime));
  const rec = L.paiements.filter((p) => p.centre_id === cid && p.date.startsWith(prec) && !Number(p.annule)).reduce((s, p) => s + Number(p.montant), 0);
  ok('clôture enregistrée, recettes recalculées par le serveur', k && Number(k.recettes) === rec && Number(k.resultat) === Number(k.recettes) - Number(k.depenses) - Number(k.paies), JSON.stringify(k || {}).slice(0, 200));
  ok('partage : une part par actionnaire du centre', k && JSON.parse(k.parts).length === L.actionnaires.filter((a) => a.centre_id === cid && !Number(a.supprime)).length, k && k.parts);
  await adm.screenshot({ path: OUT + '/cloture_bilan.png', fullPage: true });
  ok('Bilan : « … clôturé » affiché', /clôturé/.test(await adm.textContent('main')), '');

  // Verrou du mois clôturé.
  r = await api('sync/pousser', { ops: [{ op: hex(), t: 'paiements', id: 'pa' + hex(), champs: { centre_id: cid, eleve_id: eleve.id, montant: 1000, date: datePrec, mode: 'especes' } }] });
  ok('versement daté du mois clôturé : refusé', r.resultats[0].ok === false && /clôturé/.test(r.resultats[0].erreur), JSON.stringify(r).slice(0, 200));
  r = await api('sync/pousser', { ops: [{ op: hex(), t: 'depenses', id: hex(), champs: { centre_id: cid, date: datePrec, libelle: 'Test clôture', categorie: 'autre', montant: 500 } }] });
  ok('dépense datée du mois clôturé : refusée', r.resultats[0].ok === false && /clôturé/.test(r.resultats[0].erreur), JSON.stringify(r).slice(0, 200));
  r = await api('sync/pousser', { ops: [{ op: hex(), t: 'paiements', id: 'pa' + hex(), champs: { centre_id: cid, eleve_id: eleve.id, montant: 1000, date: auj, mode: 'especes' } }] });
  ok('versement du mois en cours : accepté (nouveau cycle)', r.resultats[0].ok === true, JSON.stringify(r).slice(0, 200));

  // Compteurs du partenaire : mois en cours seulement.
  await pa.goto(B + '#/caisse'); await pa.click('[data-a="caisse-onglet"][data-v="remises"]'); await pa.waitForTimeout(400);
  ok('Remises : « cycle de <mois en cours> »', /cycle de/i.test(await pa.textContent('main')), (await pa.textContent('main')).slice(0, 200));

  // Rouvrir : admin seulement.
  r = await apiDe(pa)('sync/pousser', { ops: [{ op: hex(), t: 'clotures', id: `clo-${cid}-${prec}`, suppr: true, champs: {} }] });
  ok('un actionnaire ne rouvre pas le mois', r.resultats[0].ok === false, JSON.stringify(r).slice(0, 160));
  await adm.goto(B + '#/accueil'); await adm.goto(B + '#/bilan'); await adm.waitForTimeout(300);
  if (!(await adm.isVisible(`[data-a="rouvrir-mois"][data-centre="${cid}"]`))) await adm.click('[data-a="bilan-mois"][data-v="-1"]');
  await adm.click(`[data-a="rouvrir-mois"][data-centre="${cid}"]`); await adm.click('#feuille button.btn:has-text("Rouvrir")'); await aJour(adm); await adm.waitForTimeout(500);
  r = await api('sync/pousser', { ops: [{ op: hex(), t: 'paiements', id: 'pa' + hex(), champs: { centre_id: cid, eleve_id: eleve.id, montant: 1000, date: datePrec, mode: 'especes' } }] });
  ok('mois rouvert par l\'admin : les écritures redeviennent possibles', r.resultats[0].ok === true, JSON.stringify(r).slice(0, 200));

  for (const [n, p] of [['admin', adm], ['actionnaire', pa]]) ok(n + ' : aucune erreur JavaScript', p.err.length === 0, p.err.join(' / '));
  await nav.close();
  console.log(echecs.length ? `\n${echecs.length} échec(s)` : '\nTout est vert.');
  process.exit(echecs.length ? 1 : 0);
})();
