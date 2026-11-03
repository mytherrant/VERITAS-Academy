// Banc navigateur (local : php -S 127.0.0.1:8000 -t gestion, puis node tests/banc_gestion_connexion.cjs <dossier captures>)
// Connexion : aide après un échec, identifiant gardé, œil du mot de passe, majuscules et espaces de
// l'identifiant tolérés, avertissement « version disponible » quand le téléphone est en retard.
const { chromium } = require('playwright');
const B = 'http://127.0.0.1:8000/';
const OUT = process.argv[2] || '.';
const echecs = [];
const ok = (n, c, d) => { console.log((c ? '  OK    ' : '  ÉCHEC ') + n + (c ? '' : '  → ' + d)); if (!c) echecs.push(n); };

(async () => {
  const nav = await chromium.launch();
  const ctx = await nav.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true, deviceScaleFactor: 2 });
  const page = await ctx.newPage(); page.setDefaultTimeout(15000); const err = [];
  page.on('pageerror', (e) => err.push(e.message));
  await page.goto(B); await page.waitForSelector('form[data-f="connexion"]');
  const v = await page.evaluate(async () => (await (await fetch('api/index.php?r=version')).json()).version);
  ok('route « version » : version en ligne lue dans index.html', /^\d+\.\d+\.\d+$/.test(v) && (await page.textContent('.pied')).includes('v' + v), v);
  ok('pas d\'avertissement quand le téléphone est à jour', !(await page.isVisible('.maj-dispo')), '');

  await page.fill('input[name=identifiant]', 'takou'); await page.fill('input[name=mdp]', 'mauvais');
  await page.click('button[type=submit]'); await page.waitForSelector('.erreur');
  ok('échec : message et aide « Vérifiez : identifiant… »', /incorrect/.test(await page.textContent('.erreur')) && (await page.isVisible('.aide-connexion')), await page.textContent('#zone-connexion'));
  ok('échec : l\'identifiant saisi reste dans le champ', (await page.inputValue('input[name=identifiant]')) === 'takou', await page.inputValue('input[name=identifiant]'));
  await page.screenshot({ path: OUT + '/connexion_echec.png' });

  await page.fill('#champ-mdp', 'MotDePasse');
  await page.click('[data-a="voir-mdp"]');
  ok('l\'œil affiche le mot de passe', (await page.getAttribute('#champ-mdp', 'type')) === 'text', '');
  await page.click('[data-a="voir-mdp"]');
  ok('…et le masque à nouveau', (await page.getAttribute('#champ-mdp', 'type')) === 'password', '');

  await page.fill('input[name=identifiant]', ' Jacques '); await page.fill('#champ-mdp', 'MotDePasse-Test-2026');
  await page.click('button[type=submit]'); await page.waitForSelector('text=Bonjour');
  ok('« Jacques » avec majuscule et espaces : connexion réussie', true, '');
  // Tous les champs secrets ont leur œil : « Changer mon mot de passe » (3 champs indépendants), code.
  await page.goto(B + '#/moi'); await page.click('[data-a="changer-mdp"]'); await page.waitForSelector('#feuille input[name=ancien]');
  const yeux = await page.$$('#feuille [data-a="voir-mdp"]');
  ok('« Changer mon mot de passe » : un œil par champ (3)', yeux.length === 3, yeux.length);
  await yeux[1].click();
  const types = await page.$$eval('#feuille .mdp-ligne input', (l) => l.map((i) => i.type).join(','));
  ok('l\'œil du nouveau mot de passe n\'affiche que ce champ', types === 'password,text,password', types);
  await page.click('#feuille [data-a="fermer"]').catch(() => {});
  await page.goto(B + '#/moi'); await page.click('[data-a="code-pin"]'); await page.waitForSelector('#feuille input[name=pin]');
  ok('code de verrouillage : œil présent', await page.isVisible('#feuille [data-a="voir-mdp"]'), '');
  await page.click('#feuille [data-a="voir-mdp"]');
  ok('…qui affiche le code', (await page.getAttribute('#feuille input[name=pin]', 'type')) === 'text', '');
  await page.click('#feuille [data-a="fermer"]').catch(() => {});

  // Téléphone en retard : la route renvoie une version plus récente.
  await page.route('**/api/index.php?r=version*', (r) => r.fulfill({ contentType: 'application/json', body: JSON.stringify({ ok: true, version: '9.9.9' }) }));
  await page.evaluate(() => { localStorage.removeItem('vg-session'); });
  const ctx2 = await nav.newContext({ viewport: { width: 390, height: 844 }, isMobile: true });
  const p2 = await ctx2.newPage();
  await p2.route('**/api/index.php?r=version*', (r) => r.fulfill({ contentType: 'application/json', body: JSON.stringify({ ok: true, version: '9.9.9' }) }));
  await p2.goto(B); await p2.waitForSelector('form[data-f="connexion"]');
  await p2.waitForSelector('.maj-dispo', { timeout: 5000 }).catch(() => {});
  ok('téléphone en retard : « Version 9.9.9 disponible » sur l\'écran de connexion', /Version 9\.9\.9 disponible/.test(await p2.textContent('#zone-connexion')), await p2.textContent('#zone-connexion'));
  ok('…avec « Mettre à jour maintenant » (web)', await p2.isVisible('[data-a="mettre-a-jour"]'), '');
  ok('identifiant retenu d\'une connexion à l\'autre (même téléphone)', (await page.evaluate(() => localStorage.getItem('vg-ident'))) === 'jacques', '');
  await p2.screenshot({ path: OUT + '/connexion_version.png' });
  ok('aucune erreur JavaScript', err.length === 0, err.join(' / '));
  await nav.close();
  console.log(echecs.length ? `\n${echecs.length} échec(s)` : '\nTout est vert.');
  process.exit(echecs.length ? 1 : 0);
})();
