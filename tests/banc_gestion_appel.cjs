// Banc navigateur (local : php -S 127.0.0.1:8000 -t gestion, puis node tests/banc_gestion_appel.cjs <dossier captures>)
// Banc navigateur VÉRITAS Gestion : appel du jour, retards, clôture, assiduité, hors ligne. Noms fictifs.
const { chromium } = require('playwright');
const B = 'http://127.0.0.1:8000/';
const OUT = process.argv[2] || '.';
const echecs = [];
const ok = (nom, c, d) => { console.log((c ? '  OK    ' : '  ÉCHEC ') + nom + (c ? '' : '  → ' + d)); if (!c) echecs.push(nom); };
const SUF = Date.now().toString(36).slice(-4).toUpperCase();
const hh = (m) => String(Math.floor(m / 60)).padStart(2, '0') + ':' + String(m % 60).padStart(2, '0');

(async () => {
  const nav = await chromium.launch();
  const ctx = await nav.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true });
  const page = await ctx.newPage();
  page.setDefaultTimeout(10000);
  const erreurs = [];
  page.on('pageerror', (e) => erreurs.push(e.message));
  page.on('console', (m) => { if (m.type() === 'error' && !/ERR_INTERNET_DISCONNECTED/.test(m.text())) erreurs.push(m.text()); });
  const aJour = () => page.waitForFunction(() => document.getElementById('puce-sync').textContent === 'À jour', null, { timeout: 15000 }).catch(() => {});
  const api = (route, corps) => page.evaluate(async ([route, corps]) => {
    const m = await new Promise((ok) => { const r = indexedDB.open('veritas-gestion'); r.onsuccess = () => ok(r.result); });
    const jeton = await new Promise((ok) => { const g = m.transaction('meta').objectStore('meta').get('jeton'); g.onsuccess = () => ok(g.result.v); });
    const rep = await fetch('api/index.php?r=' + route, { method: corps ? 'POST' : 'GET', headers: { Authorization: 'Bearer ' + jeton, 'Content-Type': 'application/json' }, body: corps ? JSON.stringify(corps) : undefined });
    return rep.json();
  }, [route, corps]);
  const id = (p) => p + '-' + Math.random().toString(16).slice(2, 14);

  await page.goto(B);
  await page.fill('input[name=identifiant]', 'jacques');
  await page.fill('input[name=mdp]', 'MotDePasse-Test-2026');
  await page.click('button[type=submit]');
  await page.waitForSelector('text=Bonjour');
  await aJour();

  // ── Préparation : une classe de 4 élèves, un cours commencé il y a 30 min ──
  const t = await api('sync/tirer');
  const A = t.lignes.centres.find((c) => c.nom_court === 'Ndog-passi III').id;
  const mat = t.lignes.matieres.find((m) => m.nom === 'Mathématiques').id;
  const d = new Date();
  const now = d.getHours() * 60 + d.getMinutes();
  const debut = Math.max(0, now - 30), fin = Math.min(23 * 60 + 59, now + 60);
  const jour = d.getDay() === 0 ? 7 : d.getDay();
  const cl = id('cl');
  const NOMS = [['ESSOMBA', 'Luc'], ['MBARGA', 'Anne'], ['ONANA', 'Joël'], ['ZANGA', 'Rita']].map(([n, p]) => [n + SUF, p]);
  const el = NOMS.map(() => id('el'));
  const ops = [
    { op: id('op'), t: 'classes', id: cl, champs: { centre_id: A, nom: 'Appel ' + SUF, niveau: 'Tle' } },
    { op: id('op'), t: 'creneaux', id: id('cr'), champs: { centre_id: A, classe_id: cl, matiere_id: mat, enseignant_id: '', jour, debut: hh(debut), fin: hh(fin), salle: '' } },
    ...NOMS.map(([n, p], i) => ({ op: id('op'), t: 'eleves', id: el[i], champs: { centre_id: A, classe_id: cl, nom: n, prenoms: p, parent_nom: 'Parent ' + p, parent_tel: '69' + String(1000000 + i).slice(-7) } })),
  ];
  // MBARGA absente les deux jours précédents : une troisième absence déclenche l'alerte.
  const iso = (k) => { const x = new Date(); x.setDate(x.getDate() - k); return x.getFullYear() + '-' + String(x.getMonth() + 1).padStart(2, '0') + '-' + String(x.getDate()).padStart(2, '0'); };
  for (const k of [1, 2]) {
    const s = 'sa' + iso(k).replace(/-/g, '') + cl;
    ops.push({ op: id('op'), t: 'seances', id: s, champs: { centre_id: A, classe_id: cl, date: iso(k), debut: '16:00', fin: '18:00' } });
    ops.push({ op: id('op'), t: 'presences', id: id('pr'), champs: { centre_id: A, seance_id: s, eleve_id: el[1], statut: 'absent' } });
  }
  const rep = await api('sync/pousser', { ops });
  ok('préparation acceptée par le serveur', rep.resultats.every((x) => x.ok), JSON.stringify(rep.resultats.filter((x) => !x.ok)));
  await page.click('#puce-sync');
  await aJour();

  // ── Appels du jour ──
  await page.goto(B + '#/appel');
  await page.click('.puces .puce:has-text("Ndog-passi III")').catch(() => {});
  const carte = page.locator(`a.ligne:has-text("Appel ${SUF}")`);
  ok('le cours du jour apparaît dans l\'appel', await carte.count() === 1, await page.textContent('main'));
  ok('appel non fait 30 min après le début : signalé', /en retard/.test(await carte.textContent()) && await page.isVisible('.alerte-appel'), await carte.textContent());

  // ── Feuille d'appel ──
  await carte.click();
  await page.waitForSelector('.liste.pointage');
  const rangee = (nom) => page.locator(`.liste.pointage .ligne:has-text("${nom}")`);
  await rangee(NOMS[0][0]).locator('[data-v="arrive"]').click();            // arrivé maintenant → retard ~30 min
  await rangee(NOMS[1][0]).locator('[data-v="absent"]').click();            // absente (3e de suite)
  await rangee(NOMS[2][0]).locator('.nom-eleve').click();                   // détail : arrivée à l'heure
  await page.fill('#feuille input[name=arrivee]', hh(debut + 2));
  await page.click('#feuille button[type=submit]');
  await page.waitForTimeout(300);
  const l0 = await rangee(NOMS[0][0]).textContent();
  ok('un geste « arrivé » : retard calculé tout de suite', /En retard · \d\d:\d\d \(\+\d+ min\)/.test(l0), l0);
  ok('arrivée 2 min après le début : présent (tolérance)', /Présent · /.test(await rangee(NOMS[2][0]).textContent()), await rangee(NOMS[2][0]).textContent());
  await page.click('[data-a="clore-appel"]');
  await page.click('#feuille [data-a="confirme-oui"]');
  await page.waitForTimeout(400);
  await page.click('[data-a="fin-cours"]');
  await page.waitForTimeout(400);
  const comp = await page.textContent('.compteurs');
  ok('compteurs : 1 présent, 1 retard, 2 absents, 0 à pointer', /1\s*présents\s*1\s*retards\s*2\s*absents\s*0\s*à pointer/.test(comp.replace(/\s+/g, ' ').replace(/(\d) /g, '$1')) || comp.replace(/\s+/g, '') === '1présents1retards2absents0àpointer', comp);
  ok('« Fin du cours » note l\'heure de départ', /→ \d\d:\d\d/.test(await rangee(NOMS[2][0]).textContent()), await rangee(NOMS[2][0]).textContent());
  await page.screenshot({ path: OUT + '/g_pointage.png', fullPage: true });
  await aJour();
  const srv = await api('sync/tirer');
  const s0 = 'sa' + iso(0).replace(/-/g, '') + cl;
  const pres = srv.lignes.presences.filter((p) => p.seance_id === s0 && !+p.supprime);
  const st = Object.fromEntries(pres.map((p) => [p.eleve_id, p]));
  ok('serveur : 4 pointages enregistrés', pres.length === 4, pres.length);
  ok('serveur : le retard recalculé correspond (≥ 25 min)', st[el[0]] && st[el[0]].statut === 'retard' && +st[el[0]].retard_min >= 25, JSON.stringify(st[el[0]]));
  ok('serveur : feuille close', srv.lignes.seances.some((s) => s.id === s0 && s.statut === 'close'), '');

  // ── Assiduité ──
  await page.goto(B + '#/assiduite');
  await page.click('.puces .puce:has-text("Ndog-passi III")').catch(() => {});
  const alerte = page.locator(`.liste .ligne:has-text("${NOMS[1][0]}")`).first();
  ok('alerte « 3 absences de suite »', /3 absences de suite/.test(await alerte.textContent().catch(() => '')), await page.textContent('main'));
  const wa = await alerte.locator('a[href^="https://wa.me/"]').getAttribute('href').catch(() => '');
  ok('message WhatsApp pré-rédigé au parent', /^https:\/\/wa\.me\/23769100000\d\?text=/.test(wa) && decodeURIComponent(wa).includes('3 dernières séances') && /au \d \d\d \d\d \d\d \d\d\./.test(decodeURIComponent(wa)), wa);
  await page.screenshot({ path: OUT + '/g_assiduite.png', fullPage: true });

  // ── Hors ligne : pointer sans réseau, envoi au retour ──
  await page.goto(B + '#/pointage/' + cl + '/' + iso(0));
  await page.waitForSelector('.liste.pointage');
  await ctx.setOffline(true);
  await rangee(NOMS[3][0]).locator('[data-v="arrive"]').click();
  await page.waitForTimeout(500);
  ok('hors ligne : pointage mis en file', /Hors ligne · \d/.test(await page.textContent('#puce-sync')), await page.textContent('#puce-sync'));
  await ctx.setOffline(false);
  await page.click('#puce-sync');
  await aJour();
  const srv2 = await api('sync/tirer');
  const z = srv2.lignes.presences.find((p) => p.seance_id === s0 && p.eleve_id === el[3]);
  ok('retour du réseau : le pointage hors ligne est arrivé', z && z.statut === 'retard', JSON.stringify(z));

  ok('aucune erreur JavaScript', erreurs.length === 0, erreurs.join(' / '));
  console.log(echecs.length ? `\n${echecs.length} échec(s)` : '\nTout est vert.');
  await nav.close();
  process.exit(echecs.length ? 1 : 0);
})().catch((e) => { console.error(e); process.exit(2); });
