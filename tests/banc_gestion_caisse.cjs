// Banc navigateur (local : php -S 127.0.0.1:8000 -t gestion, puis node tests/banc_gestion_caisse.cjs <dossier captures>)
// Banc navigateur VÉRITAS Gestion : échéancier, encaissement, reçu (image/PDF), relances, dépenses, bilan. Noms fictifs.
const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');
const B = 'http://127.0.0.1:8000/';
const OUT = process.argv[2] || '.';
const echecs = [];
const ok = (nom, c, d) => { console.log((c ? '  OK    ' : '  ÉCHEC ') + nom + (c ? '' : '  → ' + d)); if (!c) echecs.push(nom); };
const SUF = Date.now().toString(36).slice(-4).toUpperCase();
const hh = (m) => String(Math.floor(m / 60)).padStart(2, '0') + ':' + String(m % 60).padStart(2, '0');
const F = (n) => String(n).replace(/\B(?=(\d{3})+(?!\d))/g, ' ') + ' F';
const sansNbsp = (t) => String(t).replace(/ /g, ' ');

(async () => {
  const nav = await chromium.launch();
  const ctx = await nav.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true, acceptDownloads: true });
  await ctx.addInitScript(() => { try { Object.defineProperty(navigator, 'canShare', { value: undefined }); } catch (e) {} });
  const page = await ctx.newPage();
  page.setDefaultTimeout(15000);
  const erreurs = [];
  page.on('pageerror', (e) => erreurs.push(e.message));
  page.on('console', (m) => { if (m.type() === 'error') erreurs.push(m.text()); });
  const aJour = () => page.waitForFunction(() => document.getElementById('puce-sync').textContent === 'À jour', null, { timeout: 15000 }).catch(() => {});
  const api = (route, corps) => page.evaluate(async ([route, corps]) => {
    const m = await new Promise((ok) => { const r = indexedDB.open('veritas-gestion'); r.onsuccess = () => ok(r.result); });
    const jeton = await new Promise((ok) => { const g = m.transaction('meta').objectStore('meta').get('jeton'); g.onsuccess = () => ok(g.result.v); });
    const rep = await fetch('api/index.php?r=' + route, { method: corps ? 'POST' : 'GET', headers: { Authorization: 'Bearer ' + jeton, 'Content-Type': 'application/json' }, body: corps ? JSON.stringify(corps) : undefined });
    return rep.json();
  }, [route, corps]);
  const id = (p) => p + '-' + Math.random().toString(16).slice(2, 14);
  const iso = (k) => { const x = new Date(); x.setDate(x.getDate() + k); return x.getFullYear() + '-' + String(x.getMonth() + 1).padStart(2, '0') + '-' + String(x.getDate()).padStart(2, '0'); };

  await page.goto(B);
  await page.fill('input[name=identifiant]', 'jacques');
  await page.fill('input[name=mdp]', 'MotDePasse-Test-2026');
  await page.click('button[type=submit]');
  await page.waitForSelector('text=Bonjour');
  await aJour();

  // ── Préparation : une classe à 2 500 F + 7 500 F/mois, deux élèves ──
  const t = await api('sync/tirer');
  const A = t.lignes.centres.find((c) => c.nom_court === 'Ndog-passi III').id;
  const mat = t.lignes.matieres.find((m) => m.nom === 'Mathématiques').id;
  const an = t.lignes.annees.find((a) => +a.active);
  const auj = iso(0);
  const moisCourant = auj.slice(0, 7);
  // Premier élève inscrit le 5 du mois PRÉCÉDENT : inscription + ce mois-là échus, le mois courant pas encore (si on est avant le 10).
  const d = new Date(); d.setDate(1); d.setMonth(d.getMonth() - 1);
  const moisPrec = d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0');
  const factures = String(an.mois_factures).split(',').map(Number);
  ok('mois précédent et mois courant facturés (sinon banc à adapter)', factures.includes(+moisPrec.slice(5)) && factures.includes(+moisCourant.slice(5)), an.mois_factures);
  const avantLe10 = new Date().getDate() < 10;
  const cl = id('cl'); const e1 = id('el'); const e2 = id('el');
  const now = new Date().getHours() * 60 + new Date().getMinutes();
  const jour = new Date().getDay() === 0 ? 7 : new Date().getDay();
  const rep = await api('sync/pousser', { ops: [
    { op: id('op'), t: 'classes', id: cl, champs: { centre_id: A, nom: 'Caisse ' + SUF, niveau: 'Tle', inscription: 2500, mensualite: 7500 } },
    { op: id('op'), t: 'creneaux', id: id('cr'), champs: { centre_id: A, classe_id: cl, matiere_id: mat, enseignant_id: '', jour, debut: hh(Math.max(0, now - 10)), fin: hh(Math.min(1439, now + 60)), salle: '' } },
    { op: id('op'), t: 'eleves', id: e1, champs: { centre_id: A, classe_id: cl, nom: 'NJOYA' + SUF, prenoms: 'Brice', parent_nom: 'M. Njoya', parent_tel: '690111222', date_inscription: moisPrec + '-05' } },
    { op: id('op'), t: 'eleves', id: e2, champs: { centre_id: A, classe_id: cl, nom: 'EBODE' + SUF, prenoms: 'Carine', parent_nom: 'Mme Ebode', parent_tel: '690333444', date_inscription: moisCourant + '-01' } },
  ] });
  ok('préparation acceptée', rep.resultats.every((x) => x.ok), JSON.stringify(rep.resultats.filter((x) => !x.ok)));
  await page.click('#puce-sync'); await aJour();

  // ── Encaisser ──
  await page.goto(B + '#/caisse');
  await page.click('.puces .puce:has-text("Ndog-passi III")').catch(() => {});
  await page.fill('input[data-input="recherche-caisse"]', 'njoya' + SUF.toLowerCase());
  const carte = page.locator('#zone-caisse .ligne').first();
  const retardAttendu = 2500 + 7500 + (avantLe10 ? 0 : 7500);
  ok('échéancier : retard = inscription + mois échus (' + F(retardAttendu) + ')', sansNbsp(await carte.textContent()).includes(sansNbsp(F(retardAttendu)) + ' en retard'), await carte.textContent());
  await carte.click();
  ok('montant proposé = tout le retard', +(await page.inputValue('#montant-paiement')) === retardAttendu, await page.inputValue('#montant-paiement'));
  const verse = retardAttendu + 2000;   // + 2 000 F d'avance sur le mois suivant le retard
  await page.fill('#montant-paiement', String(verse));
  await page.selectOption('#feuille select[name=mode]', 'om');
  ok('référence demandée pour Orange Money', await page.isVisible('#champ-reference'), 'champ caché');
  await page.fill('#feuille input[name=reference]', 'MP' + SUF);
  await page.click('#feuille button[type=submit]');
  await page.waitForSelector('#apercu-recu img', { timeout: 20000 });
  const titre = await page.textContent('#feuille h2');
  ok('reçu numéroté par le serveur', /Reçu n° \d{4}-\d{4}/.test(titre), titre);
  const lien = await page.getAttribute('#feuille a[data-a="envoyer-recu"]', 'href');
  const msg = decodeURIComponent(lien.split('?text=')[1] || '');
  ok('message au parent : montant, n° de reçu, mois couverts, reste', sansNbsp(msg).includes(sansNbsp(F(verse))) && /reçu n° \d{4}-\d{4}/.test(msg) && /inscription, .* \(partiel\)/.test(msg) && /Reste à payer à ce jour : /.test(msg), msg);
  ok('lien WhatsApp vers le parent', lien.startsWith('https://wa.me/237690111222?text='), lien.slice(0, 50));

  // Reçu en image et en PDF
  let dl = page.waitForEvent('download');
  await page.click('#feuille [data-a="partager-recu"][data-v="png"]');
  let f = await dl; const png = path.join(OUT, 'recu.png'); await f.saveAs(png);
  const b = fs.readFileSync(png);
  ok('reçu PNG 1240×1240', b.readUInt32BE(16) === 1240 && b.readUInt32BE(20) === 1240, b.readUInt32BE(16) + '×' + b.readUInt32BE(20));
  dl = page.waitForEvent('download');
  await page.click('#feuille [data-a="partager-recu"][data-v="pdf"]');
  f = await dl; const pdf = path.join(OUT, 'recu.pdf'); await f.saveAs(pdf);
  const txt = fs.readFileSync(pdf).toString('latin1');
  ok('reçu PDF : 1 page, bien terminé', txt.startsWith('%PDF-1.4') && (txt.match(/\/Type \/Page\b/g) || []).length === 1 && txt.trimEnd().endsWith('%%EOF'), txt.length);
  await page.click('#feuille [data-a="fermer"]');

  // ── Impayés et relance ──
  await page.click('[data-a="caisse-onglet"][data-v="impayes"]');
  const imp = page.locator(`.ligne.message:has-text("EBODE${SUF}")`);
  ok('impayés : l\'élève qui n\'a pas réglé son inscription', sansNbsp(await imp.textContent()).includes(sansNbsp(F(2500))), await imp.textContent().catch(() => 'absent'));
  ok('impayés : l\'élève à jour n\'y figure plus', await page.locator(`.ligne.message:has-text("NJOYA${SUF}")`).count() === 0, 'présent');
  const rel = await imp.locator('a[data-canal="whatsapp"]').getAttribute('href');
  ok('relance pré-rédigée (montant, inscription, échéance)', /il reste 2.500.F à régler pour EBODE/.test(decodeURIComponent(rel)) && decodeURIComponent(rel).includes('au plus tard le'), decodeURIComponent(rel));
  const popup = page.waitForEvent('popup');
  await imp.locator('a[data-canal="whatsapp"]').click();
  (await popup).close().catch(() => {});
  await page.waitForSelector(`.ligne.message:has-text("EBODE${SUF}") small:has-text("relancé le")`);
  ok('trace de relance affichée', true);

  // ── Badge « impayé » dans l'appel ──
  await page.goto(B + '#/pointage/' + cl + '/' + auj);
  await page.waitForSelector('.liste.pointage');
  ok('appel : badge « impayé » sur l\'élève en retard de paiement', await page.locator(`.liste.pointage .ligne:has-text("EBODE${SUF}") .badge.danger`).count() === 1, 'absent');
  ok('appel : pas de badge pour l\'élève à jour', await page.locator(`.liste.pointage .ligne:has-text("NJOYA${SUF}") .badge.danger`).count() === 0, 'présent');

  // ── Dépense : saisie puis validation ──
  await page.goto(B + '#/caisse');
  await page.click('[data-a="caisse-onglet"][data-v="depenses"]');
  await page.click('.fab');
  await page.fill('#feuille input[name=libelle]', 'Craies ' + SUF);
  await page.fill('#feuille input[name=montant]', '3000');
  await page.click('#feuille button[type=submit]');
  await page.click(`.ligne:has-text("Craies ${SUF}")`);
  await page.click('#feuille [data-a="valider-depense"]');
  await aJour();
  const validee = await page.waitForSelector(`.ligne:has-text("Craies ${SUF}") .badge.ok`).then(() => true).catch(() => false);
  ok('dépense validée', validee, await page.textContent(`.ligne:has-text("Craies ${SUF}")`));

  // ── Bilan ──
  await page.goto(B + '#/bilan');
  await page.waitForSelector('h1:text("Bilan financier")');
  const bil = sansNbsp(await page.textContent('main'));
  const bloc = bil.slice(bil.indexOf('VÉRITAS Ndog-passi III'));
  // Montants éventuellement négatifs : le résultat d'un mois peut l'être.
  const nombre = (lib) => { const m = bloc.match(new RegExp('(-?[\\d ]+) F' + lib)); return m ? +m[1].replace(/ /g, '') : NaN; };
  const rec = nombre('recettes'), dep = nombre('dépenses validées'), res = nombre('résultat');
  ok('bilan : recettes et dépenses du mois comptées', rec >= verse && dep >= 3000, bloc.slice(0, 200));
  ok('bilan : résultat = recettes − dépenses', res === rec - dep, rec + ' − ' + dep + ' ≠ ' + res);
  const part = bloc.match(/Jacques Miterand TAKOU40 %(-?[\d ]+) F/);
  ok('bilan : part de l\'actionnaire (40 %) = 40 % du résultat', part && +part[1].replace(/ /g, '') === Math.round(res * 0.4), part ? part[1] : bloc.slice(-300));
  await page.screenshot({ path: OUT + '/g_bilan.png', fullPage: true });

  // ── Annulation motivée ──
  await page.goto(B + '#/caisse');
  await page.click('[data-a="caisse-onglet"][data-v="jour"]');
  await page.click(`.ligne:has-text("NJOYA${SUF}")`);
  await page.click('#feuille [data-a="annuler-versement"]');
  await page.fill('#feuille input[name=motif]', 'Erreur de montant');
  await page.click('#feuille button[type=submit]');
  await aJour();
  const annule = await page.waitForSelector(`.ligne:has-text("NJOYA${SUF}") .badge.danger:has-text("annulé")`).then(() => true).catch(() => false);
  ok('versement annulé : barré et marqué', annule && await page.locator(`.ligne:has-text("NJOYA${SUF}") .barre-txt`).count() === 1, '');
  await page.goto(B + '#/bilan');
  const bil2 = sansNbsp(await page.textContent('main'));
  const rec2 = +((bil2.slice(bil2.indexOf('VÉRITAS Ndog-passi III')).match(/([\d ]+) Frecettes/) || [, 'x'])[1].replace(/ /g, ''));
  ok('bilan : le versement annulé ne compte plus', rec2 === rec - verse, rec + ' → ' + rec2);

  ok('aucune erreur JavaScript', erreurs.length === 0, erreurs.join(' / '));
  console.log(echecs.length ? `\n${echecs.length} échec(s)` : '\nTout est vert.');
  await nav.close();
  process.exit(echecs.length ? 1 : 0);
})().catch((e) => { console.error(e); process.exit(2); });
