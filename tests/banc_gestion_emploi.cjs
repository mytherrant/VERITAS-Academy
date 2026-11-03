// Banc navigateur (local : php -S 127.0.0.1:8000 -t gestion, puis node tests/banc_gestion_emploi.cjs <dossier captures>)
// Banc navigateur VÉRITAS Gestion : emploi du temps et matières des enseignants.
const { chromium } = require('playwright');
const B = 'http://127.0.0.1:8000/';
const OUT = process.argv[2];
const echecs = [];
const ok = (nom, c, d) => { console.log((c ? '  OK    ' : '  ÉCHEC ') + nom + (c ? '' : '  → ' + d)); if (!c) echecs.push(nom); };

(async () => {
  const nav = await chromium.launch();
  const ctx = await nav.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true });
  const page = await ctx.newPage();
  page.setDefaultTimeout(10000);
  const erreurs = [];
  page.on('pageerror', (e) => erreurs.push(e.message));
  page.on('console', (m) => { if (m.type() === 'error') erreurs.push(m.text()); });
  // Administration : entrée visible dans Plus (le geste caché du logo est retiré).
  const ouvrirPanneau = async () => {
    await page.goto(B + '#/moi');
    await page.click('a[data-a="ouvrir-admin"]');
    await page.waitForSelector('main h1:text("Administration")');
  };
  const aJour = () => page.waitForFunction(() => document.getElementById('puce-sync').textContent === 'À jour', null, { timeout: 10000 }).catch(() => {});

  await page.goto(B);
  await page.fill('input[name=identifiant]', 'jacques');
  await page.fill('input[name=mdp]', 'MotDePasse-Test-2026');
  await page.click('button[type=submit]');
  await page.waitForSelector('text=Bonjour');
  await aJour();

  // Fiche compte : matières enseignées
  await page.goto(B + '#/comptes');
  await page.waitForSelector('#zone-comptes');
  ok('comptes accessibles à l\'administrateur, sans geste caché', await page.isVisible('#zone-comptes'), 'invisibles');
  await ouvrirPanneau();
  await page.goto(B + '#/comptes');
  await page.waitForSelector('#zone-comptes .ligne');
  await page.click('text=Essomba Paul');
  const cases = await page.$$eval('#feuille input[name=matiere]', (l) => ({ n: l.length, cochees: l.filter((x) => x.checked).length }));
  ok('fiche enseignant : matières proposées et cochées', cases.n >= 10 && cases.cochees === 2, JSON.stringify(cases));
  await page.screenshot({ path: OUT + '/g_compte_matieres.png' });
  await page.click('#feuille [data-a="fermer"]');

  // Emploi du temps
  await page.goto(B + '#/emploi');
  await page.waitForSelector('h1:text("Emploi du temps")');
  await page.click('.puces .puce:text("Ndog-passi III")').catch(() => {});
  const NOM = 'Tle ' + Date.now().toString(36).slice(-4);
  await page.click('[data-a="editer-classe"][data-id=""]');
  await page.fill('#feuille input[name=nom]', NOM);
  await page.selectOption('#feuille select[name=niveau]', 'Tle');
  await page.click('#feuille button[type=submit]');
  await page.waitForSelector('text=' + NOM);
  ok('classe créée depuis l\'écran', true);

  // Créneau : la matière Mathématiques met l'enseignant de maths en tête
  await page.click('.fab');
  await page.selectOption('#feuille select[name=classe_id]', { label: NOM });
  await page.selectOption('#feuille select[name=matiere_id]', { label: 'Mathématiques' });
  const groupe = await page.$eval('#choix-prof optgroup', (g) => g.label + ' : ' + [...g.querySelectorAll('option')].map((o) => o.textContent).join(', '));
  ok('enseignants de la matière proposés en premier', /Enseignent cette matière : .*Essomba Paul/.test(groupe), groupe);
  await page.selectOption('#choix-prof', { label: 'Essomba Paul' });
  await page.selectOption('#feuille select[name=jour]', '7');
  // Heure libre pour cet enseignant le dimanche (le banc API pose des créneaux au hasard).
  const libre = await page.evaluate(async () => {
    const m = await new Promise((ok) => { const r = indexedDB.open('veritas-gestion'); r.onsuccess = () => ok(r.result); });
    const toutes = await new Promise((ok) => { const g = m.transaction('lignes').objectStore('lignes').getAll(); g.onsuccess = () => ok(g.result); });
    const pris = toutes.filter((x) => x.t === 'creneaux' && !+x.l.supprime && +x.l.jour === 7).map((x) => [x.l.debut, x.l.fin]);
    for (let h = 6; h < 22; h++) {
      const d = String(h).padStart(2, '0') + ':05', f = String(h + 1).padStart(2, '0') + ':00';
      if (!pris.some(([a, b]) => a < f && b > d)) return [d, f];
    }
    return null;
  });
  await page.fill('#feuille input[name=debut]', libre[0]);
  await page.fill('#feuille input[name=fin]', libre[1]);
  await page.fill('#feuille input[name=salle]', 'Salle 2');
  await page.click('#feuille button[type=submit]');
  // Le dimanche peut être hors des horaires du centre : l'appli demande alors confirmation.
  await page.click('#feuille [data-a="confirme-oui"]', { timeout: 1500 }).catch(() => {});
  await aJour();
  await page.waitForTimeout(400);
  const liste = await page.textContent('main');
  ok('créneau visible dans la journée', liste.includes(libre[0]) && liste.includes('Mathématiques') && liste.includes(NOM), liste.slice(0, 300));
  await page.screenshot({ path: OUT + '/g_emploi_jour.png', fullPage: true });

  // Conflit : même classe, même heure → refus sur le téléphone, rien n'est envoyé
  const avant = await page.evaluate(() => document.querySelectorAll('.ligne.creneau').length);
  await page.click('.fab');
  await page.selectOption('#feuille select[name=classe_id]', { label: NOM });
  await page.selectOption('#feuille select[name=jour]', '7');
  await page.fill('#feuille input[name=debut]', libre[0]);
  await page.fill('#feuille input[name=fin]', libre[1]);
  await page.click('#feuille button[type=submit]');
  const toast = await page.waitForSelector('.toast.erreur-t').then((t) => t.textContent()).catch(() => '');
  ok('conflit refusé avec un message clair', /déjà cours/.test(toast), toast);
  await page.click('#feuille [data-a="fermer"]').catch(() => {});
  const apres = await page.evaluate(() => document.querySelectorAll('.ligne.creneau').length);
  ok('aucun créneau en double', apres === avant, avant + ' → ' + apres);

  // Vue par enseignant : total hebdomadaire
  await page.click('[data-a="emploi-mode"][data-v="enseignant"]');
  await page.selectOption('select[data-change="emploi-filtre"]', { label: 'Essomba Paul' }).catch(() => {});
  const vueProf = await page.textContent('main');
  ok('vue par enseignant avec total de la semaine', /Total : \d+ h/.test(vueProf) && vueProf.includes(NOM), vueProf.slice(0, 200));
  await page.screenshot({ path: OUT + '/g_emploi_prof.png', fullPage: true });

  ok('aucune erreur JavaScript', erreurs.length === 0, erreurs.join(' / '));
  console.log(echecs.length ? `\n${echecs.length} échec(s)` : '\nTout est vert.');
  await nav.close();
  process.exit(echecs.length ? 1 : 0);
})().catch((e) => { console.error(e); process.exit(2); });
