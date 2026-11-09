// Banc navigateur (local : php -S 127.0.0.1:8000 -t gestion, puis node tests/banc_gestion_centres.cjs <dossier captures>)
// Centres indépendants : un compte (hors administrateur) = un centre. La même personne dans les deux centres
// a deux comptes ; la fiche propose « Son compte pour l'autre centre », pré-rempli. Noms fictifs.
const { chromium } = require('playwright');
const B = 'http://127.0.0.1:8000/';
const OUT = process.argv[2] || '.';
const echecs = [];
const ok = (n, c, d) => { console.log((c ? '  OK    ' : '  ÉCHEC ') + n + (c ? '' : '  → ' + d)); if (!c) echecs.push(n); };
const aJour = (p) => p.waitForFunction(() => document.getElementById('puce-sync').textContent === 'À jour', null, { timeout: 15000 }).catch(() => {});
const SUF = Date.now().toString(36).slice(-4).toUpperCase();

(async () => {
  const nav = await chromium.launch();
  const ctx = await nav.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true, deviceScaleFactor: 2 });
  const adm = await ctx.newPage(); adm.setDefaultTimeout(15000); const err = [];
  adm.on('pageerror', (e) => err.push(e.message));
  await adm.goto(B); await adm.fill('input[name=identifiant]', 'jacques'); await adm.fill('input[name=mdp]', 'MotDePasse-Test-2026');
  await adm.click('button[type=submit]'); await adm.waitForSelector('text=Bonjour'); await aJour(adm);
  const api = (route, corps) => adm.evaluate(async ([route, corps]) => {
    const m = await new Promise((ok) => { const r = indexedDB.open('veritas-gestion'); r.onsuccess = () => ok(r.result); });
    const jeton = await new Promise((ok) => { const g = m.transaction('meta').objectStore('meta').get('jeton'); g.onsuccess = () => ok(g.result.v); });
    const rep = await fetch('api/index.php?r=' + route, { method: corps ? 'POST' : 'GET', headers: { Authorization: 'Bearer ' + jeton, 'Content-Type': 'application/json' }, body: corps ? JSON.stringify(corps) : undefined });
    return rep.json();
  }, [route, corps]);
  const centres = (await api('sync/tirer&depuis=0')).lignes.centres.filter((c) => !+c.supprime);
  const [A, Bc] = centres;

  // Nouveau compte : un seul « Centre » et un « Rôle », plus de rôle par centre.
  await adm.goto(B + '#/enseignants'); await adm.click('[data-a="ajouter-enseignant"]'); await adm.waitForSelector('#feuille form[data-f="compte"]');
  ok('fiche : un seul choix de centre', await adm.locator('#feuille select[name=centre_id]').count() === 1 && await adm.locator('#feuille select[name^="role_"]').count() === 0, '');
  ok('fiche : la règle est expliquée', (await adm.textContent('#feuille')).includes('indépendants'), '');
  await adm.fill('#feuille input[name=nom]', 'MBARGA' + SUF + ' Alice');
  await adm.selectOption('#feuille select[name=centre_id]', A.id); await adm.selectOption('#feuille select[name=role]', 'enseignant');
  await adm.click('#feuille form[data-f="compte"] button[type=submit]'); await adm.waitForSelector('text=Compte créé');
  const ident1 = 'alice.mbarga' + SUF.toLowerCase();
  ok('compte créé dans le centre A', (await adm.textContent('#feuille')).includes(ident1), '');
  await adm.click('#feuille [data-a="fermer"]');
  let u = (await api('comptes')).comptes.find((x) => x.identifiant === ident1);
  ok('serveur : un seul centre', u && Object.keys(u.acces).length === 1 && u.acces[A.id] === 'enseignant', JSON.stringify(u && u.acces));

  // Son compte pour l'autre centre, pré-rempli.
  await adm.goto(B + '#/comptes'); await adm.waitForSelector(`#zone-comptes [data-id="${u.id}"]`);
  await adm.click(`#zone-comptes [data-id="${u.id}"]`); await adm.waitForSelector(`#feuille [data-a="compte-autre-centre"][data-v="${Bc.id}"]`);
  await adm.screenshot({ path: OUT + '/compte_un_centre.png', fullPage: true });
  await adm.click(`#feuille [data-a="compte-autre-centre"][data-v="${Bc.id}"]`); await adm.waitForSelector('#feuille form[data-f="compte"][data-id=""]');
  ok('autre centre : nom repris et centre B choisi', await adm.inputValue('#feuille input[name=nom]') === 'MBARGA' + SUF + ' Alice' && await adm.inputValue('#feuille select[name=centre_id]') === Bc.id, '');
  await adm.click('#feuille form[data-f="compte"] button[type=submit]'); await adm.waitForSelector('text=Compte créé');
  const comptes = (await api('comptes')).comptes.filter((x) => x.nom === 'MBARGA' + SUF + ' Alice');
  const u2 = comptes.find((x) => x.id !== u.id);
  ok('deux comptes distincts, identifiants différents', comptes.length === 2 && u2 && u2.identifiant !== ident1 && u2.acces[Bc.id] === 'enseignant' && Object.keys(u2.acces).length === 1, JSON.stringify(comptes.map((x) => [x.identifiant, x.acces])));
  await adm.click('#feuille [data-a="fermer"]');

  ok('aucune erreur JavaScript', err.length === 0, err.join(' / '));
  await nav.close();
  console.log(echecs.length ? `\n${echecs.length} échec(s)` : '\nTout est vert.');
  process.exit(echecs.length ? 1 : 0);
})();
