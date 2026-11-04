// Banc navigateur (local : php -S 127.0.0.1:8000 -t gestion, puis node tests/banc_gestion_redater.cjs <dossier captures>)
// Versements saisis en retard : l'admin les rattache au mois passé depuis le Bilan (il décoche ceux du mois).
// Seule la date change ; un partenaire ne redate pas. Noms fictifs.
const { chromium } = require('playwright');
const B = 'http://127.0.0.1:8000/';
const OUT = process.argv[2] || '.';
const echecs = [];
const ok = (n, c, d) => { console.log((c ? '  OK    ' : '  ÉCHEC ') + n + (c ? '' : '  → ' + d)); if (!c) echecs.push(n); };
const aJour = (p) => p.waitForFunction(() => document.getElementById('puce-sync').textContent === 'À jour', null, { timeout: 15000 }).catch(() => {});
const hex = () => Math.random().toString(16).slice(2, 12) + Math.random().toString(16).slice(2, 12);
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
  const now = new Date(Date.now() - new Date().getTimezoneOffset() * 60000);
  const auj = now.toISOString().slice(0, 10);
  const d = new Date(now); d.setUTCDate(1); d.setUTCDate(0);
  const finPrec = d.toISOString().slice(0, 10), prec = finPrec.slice(0, 7);
  let L = (await api('sync/tirer&depuis=0')).lignes;
  const comptes = (await api('comptes')).comptes;
  const act = comptes.find((u) => !u.admin_global && u.actif && Object.values(u.acces).includes('actionnaire'));
  const cid = Object.keys(act.acces).find((c) => act.acces[c] === 'actionnaire');
  const els = L.eleves.filter((e) => e.centre_id === cid && !Number(e.supprime)).slice(0, 3);
  const prep = [{ op: hex(), t: 'centres', id: cid, champs: { debut_comptes: '' } }];
  if ((L.clotures || []).find((k) => k.id === `clo-${cid}-${prec}` && !Number(k.supprime))) prep.push({ op: hex(), t: 'clotures', id: `clo-${cid}-${prec}`, suppr: true, champs: {} });
  await api('sync/pousser', { ops: prep });
  // Les versements du mois déjà là (autres bancs) restent dans le mois : on ne coche que les nôtres.
  const ids = els.map(() => 'pa' + hex());
  const r0 = await api('sync/pousser', { ops: els.map((e, i) => ({ op: hex(), t: 'paiements', id: ids[i], champs: { centre_id: cid, eleve_id: e.id, montant: 1100 + i, date: auj, mode: 'especes' } })) });
  ok('préparation : trois versements du jour', r0.resultats.every((x) => x.ok), JSON.stringify(r0).slice(0, 200));

  await adm.click('#puce-sync'); await aJour(adm);
  await adm.goto(B + '#/bilan'); await adm.waitForSelector(`[data-a="redater-versements"][data-centre="${cid}"]`);
  await adm.click(`[data-a="redater-versements"][data-centre="${cid}"]`); await adm.waitForSelector('#feuille form[data-f="redater"]');
  ok('feuille : date proposée = dernier jour du mois passé', await adm.inputValue('#feuille input[name=date]') === finPrec, await adm.inputValue('#feuille input[name=date]'));
  await adm.click('#feuille [data-a="redater-tout"][data-v="0"]');
  await adm.check(`#feuille input[value="${ids[0]}"]`); await adm.check(`#feuille input[value="${ids[1]}"]`);
  ok('le bouton annonce le nombre et le total', /2 versements \(2\s201\sF\)/.test((await adm.textContent('#redater-ok')).replace(/ | /g, ' ')), await adm.textContent('#redater-ok'));
  await adm.screenshot({ path: OUT + '/redater.png', fullPage: true });
  await adm.click('#redater-ok'); await aJour(adm); await adm.waitForTimeout(800);
  L = (await api('sync/tirer&depuis=0')).lignes;
  const P = (id) => L.paiements.find((p) => p.id === id) || {};
  ok('serveur : les deux cochés passent au mois passé', P(ids[0]).date === finPrec && P(ids[1]).date === finPrec, JSON.stringify([P(ids[0]).date, P(ids[1]).date]));
  ok('le décoché reste du jour ; montants et reçus inchangés', P(ids[2]).date === auj && Number(P(ids[0]).montant) === 1100 && P(ids[0]).numero, JSON.stringify(P(ids[0])).slice(0, 160));

  // Un partenaire ne redate pas ; l'admin ne touche pas au montant par ce biais.
  const pa = await login(nav, act.identifiant, (await api('comptes/mdp', { id: act.id })).mdp);
  let r = await apiDe(pa)('sync/pousser', { ops: [{ op: hex(), t: 'paiements', id: ids[2], champs: { date: finPrec } }] });
  ok('partenaire : redater refusé', r.resultats[0].ok === false, JSON.stringify(r).slice(0, 200));
  r = await api('sync/pousser', { ops: [{ op: hex(), t: 'paiements', id: ids[2], champs: { date: finPrec, montant: 1 } }] });
  ok('admin : la date seule, pas le montant', r.resultats[0].ok === false, JSON.stringify(r).slice(0, 200));

  for (const [n, p] of [['admin', adm], ['actionnaire', pa]]) ok(n + ' : aucune erreur JavaScript', p.err.length === 0, p.err.join(' / '));
  await nav.close();
  console.log(echecs.length ? `\n${echecs.length} échec(s)` : '\nTout est vert.');
  process.exit(echecs.length ? 1 : 0);
})();
