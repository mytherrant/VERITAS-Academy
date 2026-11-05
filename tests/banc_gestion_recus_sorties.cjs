// Banc navigateur (local : php -S 127.0.0.1:8000 -t gestion, puis node tests/banc_gestion_recus_sorties.cjs <dossier captures>)
// Pièces de caisse des sorties : reçu de paie d'un enseignant, bon de sortie d'une dépense (image, PDF),
// « Mes paies » de l'enseignant avec ses reçus ; « Salaires » réservé à qui gère les enseignants. Noms fictifs.
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
const telecharger = async (page, sel) => { const [d] = await Promise.all([page.waitForEvent('download'), page.click(sel)]); const p = OUT + '/' + d.suggestedFilename(); await d.saveAs(p); return { nom: d.suggestedFilename(), data: fs.readFileSync(p) }; };

(async () => {
  const nav = await chromium.launch();
  const adm = await login(nav, 'jacques', 'MotDePasse-Test-2026');
  const api = apiDe(adm);
  const auj = new Date(Date.now() - new Date().getTimezoneOffset() * 60000).toISOString().slice(0, 10);
  const comptes = (await api('comptes')).comptes;
  const sec = comptes.find((u) => !u.admin_global && u.actif && Object.values(u.acces).includes('secretaire'));
  const cid = Object.keys(sec.acces).find((c) => sec.acces[c] === 'secretaire');
  const prof = comptes.find((u) => !u.admin_global && u.actif && u.acces[cid] === 'enseignant');
  await api('sync/pousser', { ops: [{ op: hex(), t: 'centres', id: cid, champs: { debut_comptes: '' } }] });
  const py = 'py' + hex(), de = 'de' + hex();
  let r = await api('sync/pousser', { ops: [
    { op: hex(), t: 'paies', id: py, champs: { centre_id: cid, enseignant_id: prof.id, mois: auj.slice(0, 7), montant: 5500, date: auj, mode: 'especes' } },
    { op: hex(), t: 'depenses', id: de, champs: { centre_id: cid, libelle: 'Craie ' + SUF, montant: 200, date: auj, categorie: 'fournitures', mode: 'especes', beneficiaire: 'Librairie du quartier' } }] });
  ok('préparation : une paie du mois et une dépense', r.resultats.every((x) => x.ok), JSON.stringify(r).slice(0, 200));
  await adm.click('#puce-sync'); await aJour(adm);

  // Reçu de paie (depuis le Bilan, détail des sorties).
  await adm.selectOption('#choix-centre', cid).catch(() => {});
  await adm.goto(B + '#/bilan'); await adm.waitForSelector(`[data-a="voir-bon"][data-t="paie"][data-id="${py}"]`);
  await adm.click(`[data-a="voir-bon"][data-t="paie"][data-id="${py}"]`); await adm.waitForSelector('#apercu-bon img');
  const tP = await adm.textContent('#feuille');
  ok('reçu de paie : titre, enseignant, montant, référence', tP.includes('Reçu de paiement') && tP.includes(prof.nom) && /5\s500\sF/.test(tP) && tP.includes('PA-'), tP.slice(0, 200));
  ok('reçu de paie : WhatsApp avec le message', decodeURIComponent(await adm.getAttribute('#feuille [data-a="envoyer-bon"]', 'href')).includes('reçu de votre paie'), '');
  await adm.screenshot({ path: OUT + '/recu_paie.png', fullPage: true });
  let f = await telecharger(adm, '#feuille [data-a="partager-bon"][data-v="pdf"]');
  ok('reçu de paie en PDF', f.data.slice(0, 5).toString() === '%PDF-' && /^PA-/.test(f.nom), f.nom);
  f = await telecharger(adm, '#feuille [data-a="partager-bon"][data-v="png"]');
  ok('reçu de paie en image', f.data.slice(1, 4).toString() === 'PNG', f.nom);
  await adm.click('#feuille [data-a="fermer"]');

  // Bon de sortie d'une dépense (depuis sa fiche).
  await adm.click(`[data-a="voir-depense"][data-id="${de}"]`); await adm.waitForSelector('#feuille [data-a="voir-bon"][data-t="depense"]');
  await adm.click('#feuille [data-a="voir-bon"][data-t="depense"]'); await adm.waitForSelector('#apercu-bon img');
  const tD = await adm.textContent('#feuille');
  ok('bon de sortie : titre, bénéficiaire, « à valider » tant que non validée', tD.includes('Bon de sortie') && tD.includes('Librairie du quartier') && tD.includes('pas encore validée'), tD.slice(0, 200));
  f = await telecharger(adm, '#feuille [data-a="partager-bon"][data-v="pdf"]');
  ok('bon de sortie en PDF', f.data.slice(0, 5).toString() === '%PDF-' && /^DE-/.test(f.nom), f.nom);
  await adm.screenshot({ path: OUT + '/bon_sortie.png', fullPage: true });
  await adm.click('#feuille [data-a="fermer"]');

  // L'enseignant : « Mes paies » et son reçu ; il ne voit pas les autres sorties.
  const pp = await login(nav, prof.identifiant, (await api('comptes/mdp', { id: prof.id })).mdp);
  await pp.goto(B + '#/mesheures'); await pp.waitForTimeout(500);
  ok('enseignant : « Mes paies » avec le reçu', (await pp.textContent('main')).includes('Mes paies') && await pp.isVisible(`[data-a="voir-bon"][data-id="${py}"]`), '');
  ok('enseignant : ni dépenses ni annulation de paie', !(await pp.isVisible(`[data-a="annuler-paie"]`)) && (await apiDe(pp)('sync/tirer&depuis=0')).lignes.depenses === undefined, '');

  // « Salaires » : réservé à qui gère les enseignants.
  const ps = await login(nav, sec.identifiant, (await api('comptes/mdp', { id: sec.id })).mdp);
  r = await apiDe(ps)('sync/pousser', { ops: [{ op: hex(), t: 'depenses', id: 'de' + hex(), champs: { centre_id: cid, libelle: 'Paie prof ' + SUF, montant: 3000, date: auj, categorie: 'salaires', mode: 'especes' } }] });
  ok('secrétaire : dépense « Salaires » refusée (la paie passe par « Payer »)', r.resultats[0].ok === false && /Payer/.test(r.resultats[0].erreur || ''), JSON.stringify(r).slice(0, 200));
  await ps.goto(B + '#/caisse'); await ps.click('[data-a="caisse-onglet"][data-v="depenses"]').catch(() => {});
  await ps.click('[data-a="editer-depense"][data-id=""]'); await ps.waitForSelector('#feuille select[name=categorie]');
  ok('secrétaire : pas de catégorie « Salaires » dans le formulaire', !(await ps.$('#feuille select[name=categorie] option[value=salaires]')), '');
  r = await api('sync/pousser', { ops: [{ op: hex(), t: 'depenses', id: 'de' + hex(), champs: { centre_id: cid, libelle: 'Prime ' + SUF, montant: 1000, date: auj, categorie: 'salaires', mode: 'especes' } }] });
  ok('admin : « Salaires » accepté', r.resultats[0].ok === true, JSON.stringify(r).slice(0, 200));

  for (const [n, p] of [['admin', adm], ['enseignant', pp], ['secrétaire', ps]]) ok(n + ' : aucune erreur JavaScript', p.err.length === 0, p.err.join(' / '));
  await nav.close();
  console.log(echecs.length ? `\n${echecs.length} échec(s)` : '\nTout est vert.');
  process.exit(echecs.length ? 1 : 0);
})();
