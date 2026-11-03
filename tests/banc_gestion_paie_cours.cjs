// Banc navigateur (local : php -S 127.0.0.1:8000 -t gestion, puis node tests/banc_gestion_paie_cours.cjs <dossier captures>)
// Paie de l'enseignant juste après le cours, par le partenaire présent qui encaisse : 1 500 F de l'heure
// sans contrat, une seule paie par cours, jamais plus que durée × taux, sortie de sa caisse. Noms fictifs.
const { chromium } = require('playwright');
const B = 'http://127.0.0.1:8000/';
const OUT = process.argv[2] || '.';
const echecs = [];
const ok = (n, c, d) => { console.log((c ? '  OK    ' : '  ÉCHEC ') + n + (c ? '' : '  → ' + d)); if (!c) echecs.push(n); };
const aJour = (p) => p.waitForFunction(() => document.getElementById('puce-sync').textContent === 'À jour', null, { timeout: 15000 }).catch(() => {});
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
const id = () => Math.random().toString(16).slice(2, 12) + Math.random().toString(16).slice(2, 12);
const op = (t, i, champs) => ({ op: id(), t, id: i, champs });

(async () => {
  const nav = await chromium.launch();
  const adm = await login(nav, 'jacques', 'MotDePasse-Test-2026');
  const api = apiDe(adm);
  const comptes = (await api('comptes')).comptes;
  const sec = comptes.find((u) => !u.admin_global && u.actif && Object.values(u.acces).includes('secretaire'));
  const cid = Object.keys(sec.acces).find((c) => sec.acces[c] === 'secretaire');
  const prof = comptes.find((u) => !u.admin_global && u.actif && u.acces[cid] === 'enseignant');
  const lignes = (await api('sync/tirer&depuis=0')).lignes;
  const classe = lignes.classes.find((k) => k.centre_id === cid && !Number(k.supprime));
  const matiere = lignes.matieres[0];
  // Pas de contrat actif : le taux par défaut s'applique.
  for (const k of (lignes.contrats || []).filter((k) => k.centre_id === cid && k.utilisateur_id === prof.id && Number(k.actif))) await api('sync/pousser', { ops: [op('contrats', k.id, { actif: 0 })] });
  const now = new Date(Date.now() - new Date().getTimezoneOffset() * 60000);
  const auj = now.toISOString().slice(0, 10);
  const jour = ((new Date().getDay() + 6) % 7) + 1;
  const cr = id(), cr2 = id();
  await api('sync/pousser', { ops: [
    op('creneaux', cr, { centre_id: cid, classe_id: classe.id, matiere_id: matiere.id, enseignant_id: prof.id, jour, debut: '00:00', fin: '00:01' }),
    op('creneaux', cr2, { centre_id: cid, classe_id: classe.id, matiere_id: matiere.id, enseignant_id: prof.id, jour, debut: '00:02', fin: '00:03' })] });
  // Pointage : arrivé 00:00, parti… la durée faite est calculée par le serveur ; on force 2 h via un créneau long.
  await api('sync/pousser', { ops: [op('creneaux', cr, { debut: '00:00', fin: '02:00' }), op('creneaux', cr2, { debut: '02:00', fin: '03:00' })] });
  const pe = 'pe' + auj.replace(/-/g, '') + cr, pe2 = 'pe' + auj.replace(/-/g, '') + cr2;
  let r = await api('sync/pousser', { ops: [
    op('presences_ens', pe, { centre_id: cid, creneau_id: cr, date: auj, statut: 'present', arrivee: '00:00', depart: '02:00' }),
    op('presences_ens', pe2, { centre_id: cid, creneau_id: cr2, date: auj, statut: 'present', arrivee: '02:00', depart: '03:00' })] });
  ok('deux cours pointés (2 h et 1 h)', r.resultats.every((x) => x.ok), JSON.stringify(r).slice(0, 200));

  // La secrétaire paie le cours de 2 h depuis l'appel.
  const mdpS = (await api('comptes/mdp', { id: sec.id })).mdp;
  const ps = await login(nav, sec.identifiant, mdpS);
  await ps.goto(B + '#/appel'); await ps.waitForSelector(`[data-a="payer-cours"][data-pe="${pe}"]`);
  const lib = await ps.textContent(`[data-a="payer-cours"][data-pe="${pe}"]`);
  ok('bouton « Payer 3 000 F » (2 h × 1 500 F, taux par défaut)', /3\s000/.test(lib), lib);
  await ps.screenshot({ path: OUT + '/paie_cours_avant.png', fullPage: true });
  await ps.click(`[data-a="payer-cours"][data-pe="${pe}"]`);
  ok('confirmation détaille le calcul', /2 h × 1\s500\sF\/h/.test(await ps.textContent('#feuille')), await ps.textContent('#feuille'));
  await ps.click('#feuille button.btn:has-text("Payer")');
  await ps.waitForSelector('#feuille:has-text("Envoyer le reçu")'); await ps.click('#feuille [data-a="fermer"]').catch(() => {});
  await aJour(ps); await ps.waitForTimeout(500);
  const paies = (await api('sync/tirer&depuis=0')).lignes.paies.filter((x) => x.presence_id === pe);
  ok('paie au serveur : 3 000 F, rattachée au cours, payée par la secrétaire', paies.length === 1 && Number(paies[0].montant) === 3000 && paies[0].paye_par === sec.id && paies[0].mois === auj.slice(0, 7), JSON.stringify(paies));
  ok('le cours affiche « Payé 3 000 F »', /Payé 3\s000/.test(await ps.textContent('main')), '');
  await ps.screenshot({ path: OUT + '/paie_cours_apres.png', fullPage: true });

  const apiS = () => apiDe(ps);
  r = await apiS()('sync/pousser', { ops: [op('paies', id(), { centre_id: cid, enseignant_id: prof.id, mois: auj.slice(0, 7), montant: 3000, date: auj, mode: 'especes', presence_id: pe })] });
  ok('un cours ne se paie pas deux fois', /déjà payé/.test(JSON.stringify(r)), JSON.stringify(r).slice(0, 200));
  r = await apiS()('sync/pousser', { ops: [op('paies', id(), { centre_id: cid, enseignant_id: prof.id, mois: auj.slice(0, 7), montant: 2000, date: auj, mode: 'especes', presence_id: pe2 })] });
  ok('jamais plus que durée × taux (1 h → 1 500 F au plus)', /au plus 1\s500/.test(JSON.stringify(r)), JSON.stringify(r).slice(0, 200));
  r = await apiS()('sync/pousser', { ops: [op('paies', id(), { centre_id: cid, enseignant_id: prof.id, mois: auj.slice(0, 7), montant: 20000, date: auj, mode: 'especes' })] });
  ok('la paie du mois (sans cours) reste au responsable', /responsable/.test(JSON.stringify(r)), JSON.stringify(r).slice(0, 200));

  // Caisse : la paie compte dans ce que la secrétaire a sorti, et figure parmi les dépenses.
  await ps.goto(B + '#/caisse'); await ps.click('[data-a="caisse-onglet"][data-v="depenses"]'); await ps.waitForTimeout(300);
  ok('Caisse › Dépenses : « Paies des enseignants »', /Paies des enseignants/.test(await ps.textContent('main')), '');
  await ps.click('[data-a="caisse-onglet"][data-v="remises"]'); await ps.waitForTimeout(300);
  ok('Remises : « dépenses et paies » compte la paie', /dépenses et paies/.test(await ps.textContent('main')), '');

  // L'enseignant voit sa paie.
  const pp = await login(nav, prof.identifiant, (await api('comptes/mdp', { id: prof.id })).mdp);
  await pp.goto(B + '#/mesheures'); await pp.waitForTimeout(400);
  ok('« Mes heures » : le cours porte « payé 3 000 F »', /payé 3\s000\sF/.test(await pp.textContent('main')), (await pp.textContent('main')).slice(0, 300));

  await api('sync/pousser', { ops: [op('creneaux', cr, {}), op('creneaux', cr2, {})].map((o) => ({ ...o, suppr: true })) });
  for (const [n, p] of [['secrétaire', ps], ['enseignant', pp], ['admin', adm]]) ok(n + ' : aucune erreur JavaScript', p.err.length === 0, p.err.join(' / '));
  await nav.close();
  console.log(echecs.length ? `\n${echecs.length} échec(s)` : '\nTout est vert.');
  process.exit(echecs.length ? 1 : 0);
})();
