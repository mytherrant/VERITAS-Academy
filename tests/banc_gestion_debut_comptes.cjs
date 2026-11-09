// Banc navigateur (local : php -S 127.0.0.1:8000 -t gestion, puis node tests/banc_gestion_debut_comptes.cjs <dossier captures>)
// « Repartir de zéro » : l'admin retire un mois passé (octobre mal tenu) des comptes des partenaires.
// Les versements d'avant restent (dettes des élèves), mais plus de bilan, de clôture ni d'écriture avant la date.
// Le banc remet le centre comme avant à la fin (début des comptes vide). Noms fictifs.
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
  page.on('dialog', (d) => d.accept());
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
  const auj = now.toISOString().slice(0, 10), am = auj.slice(0, 7), debut = am + '-01';
  const d = new Date(now); d.setUTCDate(15); d.setUTCMonth(d.getUTCMonth() - 1);
  const prec = d.toISOString().slice(0, 7);
  let L = (await api('sync/tirer&depuis=0')).lignes;
  const comptes = (await api('comptes')).comptes;
  const act = comptes.find((u) => !u.admin_global && u.actif && Object.values(u.acces).includes('actionnaire'));
  const cid = Object.keys(act.acces).find((c) => act.acces[c] === 'actionnaire');
  const eleve = L.eleves.find((e) => e.centre_id === cid && !Number(e.supprime));
  // Départ propre : pas de début des comptes, mois précédent ouvert.
  const prep = [{ op: hex(), t: 'centres', id: cid, champs: { debut_comptes: '' } }];
  if ((L.clotures || []).find((k) => k.id === `clo-${cid}-${prec}` && !Number(k.supprime))) prep.push({ op: hex(), t: 'clotures', id: `clo-${cid}-${prec}`, suppr: true, champs: {} });
  await api('sync/pousser', { ops: prep });
  const paPrec = 'pa' + hex();
  let r = await api('sync/pousser', { ops: [{ op: hex(), t: 'paiements', id: paPrec, champs: { centre_id: cid, eleve_id: eleve.id, montant: 4000, date: prec + '-12', mode: 'especes' } }] });
  ok('préparation : un versement du mois précédent', r.resultats[0].ok, JSON.stringify(r).slice(0, 200));

  // Bilan du mois précédent : bouton « Retirer … des comptes ».
  await adm.click('#puce-sync'); await aJour(adm);
  await adm.goto(B + '#/bilan'); await adm.click('[data-a="bilan-mois"][data-v="-1"]');
  await adm.waitForSelector(`[data-a="repartir-zero"][data-centre="${cid}"]`);
  ok('bilan du mois précédent : bouton « Repartir de zéro »', await adm.getAttribute(`[data-a="repartir-zero"][data-centre="${cid}"]`, 'data-v') === debut, '');
  await adm.click(`[data-a="repartir-zero"][data-centre="${cid}"]`); await aJour(adm); await adm.waitForTimeout(600);
  L = (await api('sync/tirer&depuis=0')).lignes;
  ok('serveur : début des comptes au 1er du mois', L.centres.find((c) => c.id === cid).debut_comptes === debut, '');
  const t = await adm.textContent('main');
  ok('le mois précédent « ne compte plus », dettes des élèves gardées', t.includes('ne compte plus') && t.includes('reliquats') && !(await adm.isVisible(`[data-a="cloturer-mois"][data-centre="${cid}"]`)), t.slice(0, 300));
  await adm.screenshot({ path: OUT + '/debut_comptes_bilan.png', fullPage: true });
  ok('le versement d\'avant reste enregistré (il sert aux dettes des élèves)', L.paiements.some((p) => p.id === paPrec && !Number(p.annule) && !Number(p.supprime)), '');

  // Serveur : plus de clôture ni d'écriture avant la date (sauf l'admin qui corrige).
  r = await api('sync/pousser', { ops: [{ op: hex(), t: 'clotures', id: `clo-${cid}-${prec}`, champs: { centre_id: cid, mois: prec, parts: '[]' } }] });
  ok('clôture du mois retiré refusée', r.resultats[0].ok === false && /début des comptes/.test(r.resultats[0].erreur || ''), JSON.stringify(r).slice(0, 200));
  const pa = await login(nav, act.identifiant, (await api('comptes/mdp', { id: act.id })).mdp);
  r = await apiDe(pa)('sync/pousser', { ops: [{ op: hex(), t: 'remises', id: 're' + hex(), champs: { centre_id: cid, montant: 1000, date: prec + '-28', mode: 'especes' } }] });
  ok('partenaire : rien ne s\'enregistre avant le début des comptes', r.resultats[0].ok === false && /repartent de zéro/.test(r.resultats[0].erreur || ''), JSON.stringify(r).slice(0, 200));
  r = await api('sync/pousser', { ops: [{ op: hex(), t: 'paiements', id: paPrec, champs: { annule: 1, motif_annulation: 'erreur de saisie (banc)' } }] });
  ok('admin : corrige encore un versement d\'avant', r.resultats[0].ok === true, JSON.stringify(r).slice(0, 200));
  r = await api('sync/pousser', { ops: [{ op: hex(), t: 'paiements', id: 'pa' + hex(), champs: { centre_id: cid, eleve_id: eleve.id, montant: 2500, date: prec + '-20', mode: 'especes' } }] });
  ok('admin : encaisse encore dans le mois retiré (contrôle sur tout)', r.resultats[0].ok === true, JSON.stringify(r).slice(0, 200));

  // Le mois en cours le rappelle ; le partenaire part de zéro.
  await adm.click('[data-a="bilan-mois"][data-v="1"]'); await adm.waitForTimeout(300);
  ok('bilan du mois : « Comptes repartis de zéro »', (await adm.textContent('main')).includes('repartis de zéro'), '');
  await pa.goto(B + '#/caisse'); await pa.click('[data-a="caisse-onglet"][data-v="remises"]').catch(() => {}); await pa.waitForTimeout(400);
  ok('partenaire : pas de reste du mois précédent à remettre', !(await pa.textContent('main')).includes('n\'est pas encore clôturé'), '');

  // Remise en état pour les autres bancs.
  await api('sync/pousser', { ops: [{ op: hex(), t: 'centres', id: cid, champs: { debut_comptes: '' } }] });
  for (const [n, p] of [['admin', adm], ['actionnaire', pa]]) ok(n + ' : aucune erreur JavaScript', p.err.length === 0, p.err.join(' / '));
  await nav.close();
  console.log(echecs.length ? `\n${echecs.length} échec(s)` : '\nTout est vert.');
  process.exit(echecs.length ? 1 : 0);
})();
