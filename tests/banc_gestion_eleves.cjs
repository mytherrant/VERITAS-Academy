// Banc navigateur (local : php -S 127.0.0.1:8000 -t gestion, puis node tests/banc_gestion_eleves.cjs <dossier captures>)
// Banc navigateur VÉRITAS Gestion : inscriptions (fiche, homonyme, recherche, import) et jours/horaires.
// Noms fictifs uniquement : le dépôt est public.
const { chromium } = require('playwright');
const B = 'http://127.0.0.1:8000/';
const OUT = process.argv[2] || '.';
const echecs = [];
const ok = (nom, c, d) => { console.log((c ? '  OK    ' : '  ÉCHEC ') + nom + (c ? '' : '  → ' + d)); if (!c) echecs.push(nom); };
const SUF = Date.now().toString(36).slice(-4).toUpperCase();

(async () => {
  const nav = await chromium.launch();
  const ctx = await nav.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true });
  const page = await ctx.newPage();
  page.setDefaultTimeout(10000);
  const erreurs = [];
  page.on('pageerror', (e) => erreurs.push(e.message));
  page.on('console', (m) => { if (m.type() === 'error') erreurs.push(m.text()); });
  const aJour = () => page.waitForFunction(() => document.getElementById('puce-sync').textContent === 'À jour', null, { timeout: 10000 }).catch(() => {});
  const lignesListe = () => page.$$eval('#zone-eleves .ligne', (l) => l.map((x) => x.textContent));

  await page.goto(B);
  await page.fill('input[name=identifiant]', 'jacques');
  await page.fill('input[name=mdp]', 'MotDePasse-Test-2026');
  await page.click('button[type=submit]');
  await page.waitForSelector('text=Bonjour');
  await aJour();

  await page.goto(B + '#/eleves');
  await page.waitForSelector('h1:text("Élèves")');
  await page.click('.puces .puce:has-text("Ndog-passi III")').catch(() => {});

  // ── Inscription ──
  await page.click('.fab');
  await page.fill('#feuille input[name=nom]', 'ngono' + SUF);
  await page.fill('#feuille input[name=prenoms]', 'Marie');
  await page.selectOption('#feuille select[name=sexe]', 'F');
  await page.fill('#feuille input[name=parent_nom]', 'Mme Ngono');
  await page.fill('#feuille input[name=parent_tel]', '697 00 00 01');
  await page.click('#feuille button[type=submit]');
  await aJour();
  await page.waitForTimeout(300);
  let l = await lignesListe();
  const fiche = l.find((t) => t.includes('NGONO' + SUF));
  ok('élève inscrit, nom en capitales', !!fiche, l.slice(0, 3).join(' | '));
  ok('matricule attribué par le serveur après synchro', /\d{4}-\d{4}/.test(fiche || ''), fiche);

  // ── Homonyme ──
  await page.click('.fab');
  await page.fill('#feuille input[name=nom]', 'Marie');
  await page.fill('#feuille input[name=prenoms]', 'NGONO' + SUF.toLowerCase());
  await page.click('#feuille button[type=submit]');
  const alerte = await page.waitForSelector('#feuille .panneau.secondaire').then((x) => x.textContent()).catch(() => '');
  ok('alerte « Déjà inscrit ? » (ordre et casse ignorés)', /Déjà inscrit/.test(alerte), alerte.slice(0, 120));
  await page.click('[data-a="homonyme-oui"]');
  await aJour();
  await page.waitForTimeout(300);

  // ── Recherche ──
  await page.fill('input[data-input="recherche-eleve"]', 'ngono ' + SUF.toLowerCase());
  l = await lignesListe();
  ok('recherche par nom : les deux homonymes', l.length === 2, l.join(' | '));
  await page.fill('input[data-input="recherche-eleve"]', '6970000');
  l = await lignesListe();
  ok('recherche par téléphone du parent', l.some((t) => t.includes('NGONO' + SUF)), l.join(' | '));
  const focus = await page.evaluate(() => document.activeElement && document.activeElement.dataset.input);
  ok('le clavier reste sur la recherche pendant la frappe', focus === 'recherche-eleve', focus);
  await page.fill('input[data-input="recherche-eleve"]', '');

  // ── Fiche : contacts du parent ──
  await page.click(`#zone-eleves .ligne:has-text("NGONO${SUF}"):has-text("6 97 00 00 01")`);  // l'homonyme n'a pas de téléphone
  const wa = await page.$eval('#feuille a[href^="https://wa.me/"]', (a) => a.getAttribute('href')).catch(() => '');
  ok('lien WhatsApp du parent au format international', wa === 'https://wa.me/237697000001', wa);
  await page.screenshot({ path: OUT + '/g_fiche_eleve.png' });
  await page.click('#feuille [data-a="fermer"]');

  // ── Import d'une liste ──
  const avant = (await page.$$eval('#zone-eleves .ligne', (x) => x.length));
  await page.click('[data-a="importer-eleves"]');
  await page.fill('#feuille textarea[name=liste]', [
    `1. TAMO${SUF} Paul ; 690 11 22 33`,
    `2. BELLA${SUF} Grâce`,
    `3. bella${SUF} grâce`,
    `4. NGONO${SUF} Marie`,
  ].join('\n'));
  const apercu = await page.textContent('#apercu-import');
  ok('aperçu : 2 à inscrire, 2 écartés', /2 élèves à inscrire, 2 écartés/.test(apercu), apercu.slice(0, 160));
  await page.screenshot({ path: OUT + '/g_import.png' });
  await page.click('#feuille button[type=submit]');
  await aJour();
  await page.waitForTimeout(300);
  // Après l'import, la liste montre la classe importée : on revient sur « Toutes » pour comparer.
  await page.click('[data-a="eleves-classe"][data-v=""]');
  const apres = (await page.$$eval('#zone-eleves .ligne', (x) => x.length));
  ok('import : deux élèves de plus', apres === avant + 2, avant + ' → ' + apres);
  l = await lignesListe();
  ok('import : téléphone repris et mis en forme', l.some((t) => t.includes('TAMO' + SUF) && t.includes('6 90 11 22 33')), l.filter((t) => t.includes('TAMO')).join(' | '));
  await page.screenshot({ path: OUT + '/g_eleves.png', fullPage: true });

  // ── Jours et horaires ──
  await page.goto(B + '#/emploi');
  await page.waitForSelector('h1:text("Emploi du temps")');
  await page.click('.puces .puce:has-text("Ndog-passi III")').catch(() => {});
  await page.click('[data-a="editer-horaire"][data-id=""]');
  await page.selectOption('#feuille select[name=jour]', '3');
  await page.fill('#feuille input[name=debut]', '14:30');
  await page.fill('#feuille input[name=fin]', '18:00');
  await page.click('#feuille button[type=submit]');
  await aJour();
  await page.waitForSelector('.carte.horaires .plage:has-text("14 h 30")').catch(() => {});
  const carte = await page.textContent('.carte.horaires');
  ok('plage horaire affichée', /Mercredi\s*14 h 30 – 18 h 00/.test(carte), carte.slice(0, 160));
  // Un créneau un mercredi à 10 h sort des horaires : l'appli demande confirmation.
  await page.click('.fab');
  await page.selectOption('#feuille select[name=jour]', '3');
  await page.fill('#feuille input[name=debut]', '10:00');
  await page.fill('#feuille input[name=fin]', '11:00');
  await page.click('#feuille button[type=submit]');
  const conf = await page.waitForSelector('#feuille [data-a="confirme-oui"]').then(() => page.textContent('#feuille')).catch(() => '');
  ok('créneau hors horaires : confirmation demandée', /en dehors des horaires/.test(conf), conf.slice(0, 160));
  await page.click('#feuille [data-a="fermer"]').catch(() => {});
  await page.screenshot({ path: OUT + '/g_horaires.png', fullPage: true });
  // Nettoyage : la plage de test ne doit pas gêner les passages suivants.
  await page.click('.carte.horaires .plage:has-text("14 h 30")');
  await page.click('#feuille [data-a="suppr-horaire"]');
  await page.click('#feuille [data-a="confirme-oui"]');
  await aJour();

  ok('aucune erreur JavaScript', erreurs.length === 0, erreurs.join(' / '));
  console.log(echecs.length ? `\n${echecs.length} échec(s)` : '\nTout est vert.');
  await nav.close();
  process.exit(echecs.length ? 1 : 0);
})().catch((e) => { console.error(e); process.exit(2); });
