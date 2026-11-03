// Banc navigateur (local : php -S 127.0.0.1:8000 -t gestion, puis node tests/banc_gestion_enseignants.cjs <dossier captures>)
// Banc navigateur VÉRITAS Gestion : enseignants (pointage, contrat, heures, paie, bulletin, « Mes heures »),
// reçu numéroté HORS LIGNE (tranches), photo du justificatif d'une dépense. Noms fictifs.
const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');
const B = 'http://127.0.0.1:8000/';
const OUT = process.argv[2] || '.';
const echecs = [];
const ok = (nom, c, d) => { console.log((c ? '  OK    ' : '  ÉCHEC ') + nom + (c ? '' : '  → ' + d)); if (!c) echecs.push(nom); };
const SUF = Date.now().toString(36).slice(-4).toUpperCase();
const hh = (m) => String(Math.floor(m / 60)).padStart(2, '0') + ':' + String(m % 60).padStart(2, '0');
const sansNbsp = (t) => String(t).replace(/\u00a0/g, ' ');

async function session(nav, ident, mdp) {
  const ctx = await nav.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true, acceptDownloads: true });
  await ctx.addInitScript(() => { try { Object.defineProperty(navigator, 'canShare', { value: undefined }); } catch (e) {} });
  const page = await ctx.newPage();
  page.setDefaultTimeout(15000);
  page.erreurs = [];
  page.on('pageerror', (e) => page.erreurs.push(e.message));
  page.on('console', (m) => { if (m.type() === 'error' && !/ERR_INTERNET_DISCONNECTED/.test(m.text())) page.erreurs.push(m.text()); });
  await page.goto(B);
  await page.fill('input[name=identifiant]', ident);
  await page.fill('input[name=mdp]', mdp);
  await page.click('button[type=submit]');
  await page.waitForSelector('text=Bonjour');
  return { ctx, page };
}

(async () => {
  const nav = await chromium.launch();
  const { ctx, page } = await session(nav, 'jacques', 'MotDePasse-Test-2026');
  const aJour = (p = page) => p.waitForFunction(() => document.getElementById('puce-sync').textContent === 'À jour', null, { timeout: 15000 }).catch(() => {});
  const api = (route, corps, p = page) => p.evaluate(async ([route, corps]) => {
    const m = await new Promise((ok) => { const r = indexedDB.open('veritas-gestion'); r.onsuccess = () => ok(r.result); });
    const jeton = await new Promise((ok) => { const g = m.transaction('meta').objectStore('meta').get('jeton'); g.onsuccess = () => ok(g.result.v); });
    const rep = await fetch('api/index.php?r=' + route, { method: corps ? 'POST' : 'GET', headers: { Authorization: 'Bearer ' + jeton, 'Content-Type': 'application/json' }, body: corps ? JSON.stringify(corps) : undefined });
    return rep.json();
  }, [route, corps]);
  const id = (p) => p + '-' + Math.random().toString(16).slice(2, 14);
  const auj = (() => { const x = new Date(); return x.getFullYear() + '-' + String(x.getMonth() + 1).padStart(2, '0') + '-' + String(x.getDate()).padStart(2, '0'); })();
  await aJour();

  // ── Préparation : un enseignant neuf (compte), une classe, un cours commencé il y a 10 min ──
  const t = await api('sync/tirer');
  const A = t.lignes.centres.find((c) => c.nom_court === 'Ndog-passi III').id;
  const mat = t.lignes.matieres.find((m) => m.nom === 'Mathématiques').id;
  const cpt = await api('comptes/enregistrer', { identifiant: 'prof.' + SUF.toLowerCase(), nom: 'MBALLA ' + SUF + ' Serge', matieres: [mat], acces: [{ centre_id: A, role: 'enseignant' }] });
  ok('compte enseignant créé', cpt.ok && cpt.mdp, JSON.stringify(cpt));
  const now = new Date().getHours() * 60 + new Date().getMinutes();
  const debut = Math.max(0, Math.min(now - 10, 22 * 60)), fin = debut + 70;
  const jour = new Date().getDay() === 0 ? 7 : new Date().getDay();
  const cl = id('cl'), cr = id('cr'), el = id('el');
  const rep = await api('sync/pousser', { ops: [
    { op: id('op'), t: 'classes', id: cl, champs: { centre_id: A, nom: 'Prof ' + SUF, niveau: 'Tle', inscription: 2500, mensualite: 7500 } },
    { op: id('op'), t: 'creneaux', id: cr, champs: { centre_id: A, classe_id: cl, matiere_id: mat, enseignant_id: cpt.id, jour, debut: hh(debut), fin: hh(fin), salle: '' } },
    { op: id('op'), t: 'eleves', id: el, champs: { centre_id: A, classe_id: cl, nom: 'OWONA' + SUF, prenoms: 'Pierre', parent_tel: '690555666', date_inscription: auj } },
  ] });
  ok('préparation acceptée', rep.resultats.every((x) => x.ok), JSON.stringify(rep.resultats.filter((x) => !x.ok)));
  await page.click('#puce-sync'); await aJour();

  // ── Pointage de l'enseignant dans l'appel du jour ──
  await page.goto(B + '#/appel');
  await page.click('.puces .puce:has-text("Ndog-passi III")').catch(() => {});
  const ligneProf = page.locator(`.liste.pointage .ligne:has-text("MBALLA ${SUF}")`);
  ok('« Enseignants du jour » : le cours apparaît', await ligneProf.count() === 1, await page.textContent('main'));
  await ligneProf.locator('.nom-eleve').click();
  await page.fill('#feuille input[name=arrivee]', hh(debut + 3));
  await page.fill('#feuille input[name=depart]', hh(debut + 63));
  await page.click('#feuille button[type=submit]');
  await page.waitForSelector(`.liste.pointage .ligne:has-text("MBALLA ${SUF}") small.st-present`);
  ok('arrivée 3 min après le début : présent (tolérance), départ noté', /Présent · \d\d:\d\d → \d\d:\d\d/.test(await ligneProf.textContent()), await ligneProf.textContent());

  // ── Écran Enseignants : contrat, heures, dû, paie, bulletin ──
  await page.goto(B + '#/enseignants');
  await page.click('.puces .puce:has-text("Ndog-passi III")').catch(() => {});
  const rangee = page.locator(`.ligne:has-text("MBALLA ${SUF}")`);
  ok('enseignant listé, sans contrat : « 1 500 F/h · taux par défaut »', /1\s500\sF\/h · taux par défaut/.test(await rangee.textContent()), await rangee.textContent());
  await rangee.click();
  await page.selectOption('#feuille form[data-f="contrat"] select[name=mode]', 'heure');
  await page.fill('#feuille form[data-f="contrat"] input[name=taux]', '2000');
  await page.click('#feuille form[data-f="contrat"] button[type=submit]');
  await aJour();
  await page.waitForFunction((s) => [...document.querySelectorAll('.ligne')].some((l) => l.textContent.includes('MBALLA ' + s) && /2.000.F/.test(l.textContent)), SUF, { timeout: 10000 }).catch(() => {});
  const r1 = sansNbsp(await rangee.textContent());
  ok('1 h faite à 2 000 F/h : 2 000 F dus', /1 h faites/.test(r1) && /2 000 F/.test(r1) && /reste 2 000 F/.test(r1), r1);
  await rangee.click();
  await page.click('#feuille form[data-f="paie"] button[type=submit]');
  await aJour();
  await page.waitForFunction((s) => [...document.querySelectorAll('.ligne')].some((l) => l.textContent.includes('MBALLA ' + s) && /payé/.test(l.textContent)), SUF, { timeout: 10000 }).catch(() => {});
  ok('paie versée : « payé »', /payé/.test(await rangee.textContent()), await rangee.textContent());
  await rangee.click();
  const dl = page.waitForEvent('download');
  await page.click('#feuille [data-a="bulletin-ens"]');
  const f = await dl; const png = path.join(OUT, 'bulletin.png'); await f.saveAs(png);
  const b = fs.readFileSync(png);
  ok('bulletin de rémunération (PNG 1240×1240)', b.readUInt32BE(16) === 1240 && b.readUInt32BE(20) === 1240, b.length);
  await page.click('#feuille [data-a="fermer"]');
  await page.goto(B + '#/bilan');
  ok('bilan : les paies des enseignants comptent en charges', /Paies des enseignants/.test(await page.textContent('main')), '');

  // ── « Mes heures » vu par l'enseignant lui-même ──
  const prof = await session(nav, 'prof.' + SUF.toLowerCase(), cpt.mdp);
  await aJour(prof.page);
  await prof.page.goto(B + '#/mesheures');
  await prof.page.waitForSelector('h1:text("Mes heures")');
  const mes = sansNbsp(await prof.page.textContent('main'));
  const m1 = mes.replace(/\s+/g, ' ');
  ok('« Mes heures » : 1 h faite, 2 000 F dus, 2 000 F reçus', /1hfaites·1séance(?!s)/.test(m1.replace(/ /g, '')) && /2000Fdû/.test(m1.replace(/ /g, '')) && /2000Freçu/.test(m1.replace(/ /g, '')), m1.slice(0, 300));
  await prof.page.goto(B + '#/appel');
  ok('l\'enseignant ne voit pas le pointage des enseignants', await prof.page.locator('h2:text("Enseignants du jour")').count() === 0, '');
  ok('aucune erreur JavaScript (enseignant)', prof.page.erreurs.length === 0, prof.page.erreurs.join(' / '));
  await prof.ctx.close();

  // ── Reçu numéroté HORS LIGNE ──
  await page.goto(B + '#/caisse');
  await page.click('.puces .puce:has-text("Ndog-passi III")').catch(() => {});
  await page.click('#puce-sync'); await aJour();
  const tranches = await page.evaluate(async () => {
    const m = await new Promise((ok) => { const r = indexedDB.open('veritas-gestion'); r.onsuccess = () => ok(r.result); });
    return new Promise((ok) => { const g = m.transaction('meta').objectStore('meta').get('tranches'); g.onsuccess = () => ok(g.result ? g.result.v : null); });
  });
  ok('une tranche de numéros est réservée sur le téléphone', tranches && tranches[A] && tranches[A].length > 0, JSON.stringify(tranches));
  await ctx.setOffline(true);
  await page.fill('input[data-input="recherche-caisse"]', 'owona' + SUF.toLowerCase());
  await page.click('#zone-caisse .ligne');
  await page.fill('#montant-paiement', '2500');
  await page.click('#feuille button[type=submit]');
  await page.waitForSelector('#feuille h2:has-text("Reçu n°")', { timeout: 8000 }).catch(() => {});
  const titre = await page.textContent('#feuille h2').catch(() => '');
  const num = (titre.match(/\d{4}-\d{4}/) || [''])[0];
  const t0 = tranches && tranches[A] && tranches[A][0];
  ok('hors ligne : reçu numéroté tout de suite', !!num, titre);
  ok('… avec un numéro de SA tranche', t0 && tranches[A].some((x) => +num.slice(5) >= x.debut && +num.slice(5) <= x.fin), num + ' / ' + JSON.stringify(tranches[A]));
  ok('… et l\'image du reçu disponible sans réseau', await page.locator('#feuille [data-a="partager-recu"][data-v="png"]').count() === 1, '');
  await page.click('#feuille [data-a="fermer"]');
  await ctx.setOffline(false);
  await page.click('#puce-sync'); await aJour();
  const srv = await api('sync/tirer');
  const p = srv.lignes.paiements.find((x) => x.eleve_id === el);
  ok('retour du réseau : le serveur garde le même numéro', p && p.numero === num, JSON.stringify(p));

  // ── Dépense avec photo du justificatif ──
  await page.click('[data-a="caisse-onglet"][data-v="depenses"]');
  await page.click('.fab');
  await page.fill('#feuille input[name=libelle]', 'Ampoules ' + SUF);
  await page.fill('#feuille input[name=montant]', '4500');
  await page.setInputFiles('#feuille input[name=photo]', png);
  await page.click('#feuille button[type=submit]');
  await aJour();
  await page.click('#puce-sync'); await aJour();
  const srv2 = await api('sync/tirer');
  const d = srv2.lignes.depenses.find((x) => x.libelle === 'Ampoules ' + SUF);
  ok('la photo est arrivée au serveur', d && d.justificatif, JSON.stringify(d));
  await page.click(`.ligne:has-text("Ampoules ${SUF}")`);
  const img = await page.waitForSelector('#zone-justificatif img', { timeout: 10000 }).then(() => page.evaluate(() => { const i = document.querySelector('#zone-justificatif img'); return i.complete ? i.naturalWidth : -1; })).catch(() => 0);
  ok('le justificatif s\'affiche dans la dépense (JPEG ≤ 1 280 px)', img > 0 && img <= 1280, img);
  await page.click('#feuille [data-a="fermer"]');
  // Seuil du justificatif : obligatoire dès 10 000 F, facultatif en dessous.
  const grosse = id('de');
  await api('sync/pousser', { ops: [
    { op: id('op'), t: 'depenses', id: grosse, champs: { centre_id: A, date: auj, libelle: 'Sans photo ' + SUF, categorie: 'autre', montant: 15000 } },
    { op: id('op'), t: 'depenses', id: id('de'), champs: { centre_id: A, date: auj, libelle: 'Petite ' + SUF, categorie: 'autre', montant: 1000 } }] });
  await page.click('#puce-sync'); await aJour();
  await page.goto(B + '#/accueil'); await page.goto(B + '#/caisse');
  await page.click('[data-a="caisse-onglet"][data-v="depenses"]');
  const lSans = await page.textContent(`.ligne:has-text("Sans photo ${SUF}")`);
  const lPetite = await page.textContent(`.ligne:has-text("Petite ${SUF}")`);
  const lAvec = await page.textContent(`.ligne:has-text("Ampoules ${SUF}")`);
  ok('15 000 F sans photo : « justificatif manquant »', /justificatif manquant/.test(lSans), lSans);
  ok('1 000 F sans photo et dépense avec photo : pas d\'alerte', !/justificatif manquant/.test(lPetite) && !/justificatif manquant/.test(lAvec), lPetite + ' / ' + lAvec);
  const refus = await api('sync/pousser', { ops: [{ op: id('op'), t: 'depenses', id: grosse, champs: { statut: 'validee' } }] });
  ok('serveur : validation refusée sans photo dès 10 000 F', /Justificatif obligatoire/.test(JSON.stringify(refus)), JSON.stringify(refus).slice(0, 200));
  await page.click(`.ligne:has-text("Sans photo ${SUF}")`);
  await page.waitForSelector('#zone-justificatif p', { timeout: 5000 }).catch(() => {});
  const note = await page.textContent('#zone-justificatif');
  ok('fiche : « Justificatif obligatoire à partir de 10 000 F »', /obligatoire/.test(note), note);
  await page.click('#feuille [data-a="fermer"]');

  ok('aucune erreur JavaScript', page.erreurs.length === 0, page.erreurs.join(' / '));
  console.log(echecs.length ? `\n${echecs.length} échec(s)` : '\nTout est vert.');
  await nav.close();
  process.exit(echecs.length ? 1 : 0);
})().catch((e) => { console.error(e); process.exit(2); });
