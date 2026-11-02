// Banc navigateur (local : php -S 127.0.0.1:8000 -t gestion, puis node tests/banc_gestion_horsligne.cjs <dossier captures>)
// Banc navigateur VÉRITAS Gestion : hors ligne réel (service worker + IndexedDB + file d'envoi).
const { chromium } = require('playwright');
const B = 'http://127.0.0.1:8000/';
const echecs = [];
const NOM = 'Associé hors ligne ' + Date.now().toString(36);
const ok = (nom, c, d) => { console.log((c ? '  OK    ' : '  ÉCHEC ') + nom + (c ? '' : '  → ' + d)); if (!c) echecs.push(nom); };

(async () => {
  const nav = await chromium.launch();
  const ctx = await nav.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true });
  const page = await ctx.newPage();
  page.setDefaultTimeout(10000);
  const erreurs = [];
  page.on('pageerror', (e) => erreurs.push(e.message));
  page.on('console', (m) => { if (m.type() === 'error' && !/ERR_INTERNET_DISCONNECTED/.test(m.text())) erreurs.push(m.text()); });

  await page.goto(B);
  await page.fill('input[name=identifiant]', 'jacques');
  await page.fill('input[name=mdp]', 'MotDePasse-Test-2026');
  await page.click('button[type=submit]');
  await page.waitForSelector('text=Bonjour', { timeout: 8000 });
  ok('connexion et accueil', true);
  await page.waitForFunction(() => document.getElementById('puce-sync').textContent === 'À jour', null, { timeout: 8000 });
  await page.evaluate(() => navigator.serviceWorker.ready);
  await page.reload();
  await page.waitForSelector('text=Bonjour');
  ok('service worker aux commandes', await page.evaluate(() => !!navigator.serviceWorker.controller), 'pas de contrôleur');
  const largeurPuce = await page.evaluate(() => getComputedStyle(document.getElementById('puce-sync')).whiteSpace);
  ok('en-tête : puce sur une ligne', largeurPuce === 'nowrap', largeurPuce);
  const icones = await page.evaluate(() => {
    const u = [...document.querySelectorAll('svg.ico use')];
    return { n: u.length, cassees: u.filter((x) => !document.querySelector(x.getAttribute('href'))).map((x) => x.getAttribute('href')) };
  });
  ok('icônes du sprite (aucune référence cassée)', icones.n > 8 && !icones.cassees.length, JSON.stringify(icones));
  await page.evaluate(() => document.fonts.ready);
  ok('police Poppins chargée en local', await page.evaluate(() => document.fonts.check('600 16px Poppins')), 'absente');
  await page.screenshot({ path: process.argv[2] + '/g_accueil.png', fullPage: true });

  // ── Ouvrir un nouveau centre depuis l'accueil (admin) ──
  const NOM_CENTRE = 'VÉRITAS Test ' + Date.now().toString(36);
  await page.click('main [data-a="editer-centre"][data-id=""]');
  await page.fill('#feuille input[name=nom]', NOM_CENTRE);
  await page.fill('#feuille input[name=nom_court]', NOM_CENTRE.replace('VÉRITAS ', ''));
  await page.fill('#feuille input[name=adresse]', 'Adresse de test');
  await page.click('#feuille button[type=submit]');
  await page.waitForFunction(() => document.getElementById('puce-sync').textContent === 'À jour', null, { timeout: 10000 }).catch(() => {});
  await page.waitForFunction((n) => [...document.querySelectorAll('#choix-centre option')].some((o) => n.endsWith(o.textContent)), NOM_CENTRE, { timeout: 6000 }).catch(() => {});
  const options = await page.$$eval('#choix-centre option', (o) => o.map((x) => x.textContent));
  ok('le nouveau centre apparaît dans le sélecteur', options.some((t) => NOM_CENTRE.endsWith(t)), options.join(' | '));
  const centreServeur = await page.evaluate(async (nom) => {
    const m = await new Promise((ok) => { const r = indexedDB.open('veritas-gestion'); r.onsuccess = () => ok(r.result); });
    const jeton = await new Promise((ok) => { const g = m.transaction('meta').objectStore('meta').get('jeton'); g.onsuccess = () => ok(g.result.v); });
    const j = await (await fetch('api/index.php?r=sync/tirer&depuis=0', { headers: { Authorization: 'Bearer ' + jeton } })).json();
    return j.lignes.centres.filter((c) => c.nom === nom).length;
  }, NOM_CENTRE);
  ok('le serveur a enregistré le nouveau centre', centreServeur === 1, centreServeur);

  // ── Coupure réseau RÉELLE puis rechargement complet ──
  await ctx.setOffline(true);
  await page.reload();
  await page.waitForSelector('text=Bonjour', { timeout: 8000 }).catch(() => {});
  ok('hors ligne : l\'application s\'ouvre après rechargement', await page.isVisible('text=Bonjour'), await page.textContent('body'));

  await page.goto(B + '#/actionnaires');
  await page.waitForSelector('text=Actionnaires');
  const avant = await page.textContent('main');
  // Ajout d'un actionnaire hors ligne au centre Ndog-passi III (part 10 %).
  await page.locator('[data-a="editer-actionnaire"][data-id=""]').first().click();
  await page.fill('#feuille input[name=nom]', NOM);
  await page.fill('#feuille input[name=part]', '1');
  await page.click('#feuille button[type=submit]');
  await page.waitForSelector('text=' + NOM);
  const puce = await page.textContent('#puce-sync');
  ok('saisie hors ligne mise en file', /Hors ligne · 1/.test(puce), puce);

  await page.reload();
  await page.waitForSelector('text=' + NOM, { timeout: 8000 }).catch(() => {});
  ok('la saisie hors ligne survit au rechargement', await page.isVisible('text=' + NOM), 'perdue');
  await page.screenshot({ path: process.argv[2] + '/g_horsligne.png' });

  // ── Retour du réseau ──
  await ctx.setOffline(false);
  await page.waitForFunction(() => document.getElementById('puce-sync').textContent === 'À jour', null, { timeout: 30000 }).catch(() => {});
  ok('retour réseau : envoi automatique', (await page.textContent('#puce-sync')) === 'À jour', await page.textContent('#puce-sync'));
  const rep = await page.evaluate(async (nom) => {
    const m = await new Promise((ok) => { const r = indexedDB.open('veritas-gestion'); r.onsuccess = () => ok(r.result); });
    const jeton = await new Promise((ok) => { const g = m.transaction('meta').objectStore('meta').get('jeton'); g.onsuccess = () => ok(g.result.v); });
    const j = await (await fetch('api/index.php?r=sync/tirer&depuis=0', { headers: { Authorization: 'Bearer ' + jeton } })).json();
    return j.lignes.actionnaires.filter((a) => a.nom === nom && !+a.supprime).length;
  }, NOM);
  ok('le serveur a bien reçu la ligne saisie hors ligne', rep === 1, rep);
  ok('aucune erreur JavaScript', erreurs.length === 0, erreurs.join(' / '));
  console.log(echecs.length ? `\n${echecs.length} échec(s)` : '\nTout est vert.');
  await nav.close();
  process.exit(echecs.length ? 1 : 0);
})().catch((e) => { console.error(e); process.exit(2); });
