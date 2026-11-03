// Banc navigateur (local : php -S 127.0.0.1:8000 -t gestion, puis node tests/banc_gestion_partenaire.cjs <dossier captures>)
// Un actionnaire (partenaire) travaille seul au centre : il inscrit un élève, encaisse son inscription,
// crée le compte d'un enseignant, fixe son contrat et lui verse sa paie. Noms fictifs.
const { chromium } = require('playwright');
const B = 'http://127.0.0.1:8000/';
const OUT = process.argv[2] || '.';
const echecs = [];
const ok = (n, c, d) => { console.log((c ? '  OK    ' : '  ÉCHEC ') + n + (c ? '' : '  → ' + d)); if (!c) echecs.push(n); };
const aJour = (p) => p.waitForFunction(() => document.getElementById('puce-sync').textContent === 'À jour', null, { timeout: 15000 }).catch(() => {});
const SUF = Date.now().toString(36).slice(-4).toUpperCase();
const opId = () => 'op' + Math.random().toString(16).slice(2, 14) + Date.now().toString(16);
async function login(nav, id, mdp) {
  const ctx = await nav.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true, deviceScaleFactor: 2 });
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

(async () => {
  const nav = await chromium.launch();
  const adm = await login(nav, 'jacques', 'MotDePasse-Test-2026');
  const api = apiDe(adm);
  const act = (await api('comptes')).comptes.find((u) => !u.admin_global && u.actif && Object.values(u.acces).includes('actionnaire'));
  const cid = Object.keys(act.acces).find((c) => act.acces[c] === 'actionnaire');
  const pa = await login(nav, act.identifiant, (await api('comptes/mdp', { id: act.id })).mdp);
  const apiA = apiDe(pa);

  // 1. Inscrire un élève
  await pa.goto(B + '#/eleves'); await pa.waitForTimeout(300);
  ok('Élèves : bouton « Inscrire » visible pour l\'actionnaire', await pa.isVisible('.fab[data-a="editer-eleve"]'), '');
  await pa.screenshot({ path: OUT + '/partenaire_eleves.png' });
  await pa.click('.fab[data-a="editer-eleve"]'); await pa.waitForSelector('#feuille form[data-f="eleve"]');
  await pa.fill('#feuille input[name=nom]', 'NGONO' + SUF); await pa.fill('#feuille input[name=prenoms]', 'Clarisse');
  await pa.click('#feuille form[data-f="eleve"] button[type=submit]');
  await pa.waitForTimeout(800); await aJour(pa);
  const el = (await apiA('sync/tirer&depuis=0')).lignes.eleves.find((e) => e.nom === 'NGONO' + SUF);
  ok('élève inscrit au serveur, matricule attribué', el && el.centre_id === cid && !!el.matricule, JSON.stringify(el || {}).slice(0, 160));

  // 2. Encaisser son inscription
  await pa.goto(B + '#/caisse'); await pa.click('[data-a="caisse-onglet"][data-v="encaisser"]');
  await pa.fill('[data-input="recherche-caisse"]', 'NGONO' + SUF); await pa.waitForSelector(`[data-a="encaisser"][data-id="${el.id}"]`);
  await pa.click(`[data-a="encaisser"][data-id="${el.id}"]`); await pa.waitForSelector('#feuille form[data-f="paiement"]');
  await pa.fill('#montant-paiement', '5000');
  await pa.click('#feuille form[data-f="paiement"] button[type=submit]');
  await pa.waitForTimeout(1500); await aJour(pa);
  const pay = (await apiA('sync/tirer&depuis=0')).lignes.paiements.filter((p) => p.eleve_id === el.id);
  ok('versement de 5 000 F enregistré, reçu numéroté, encaissé par l\'actionnaire', pay.length === 1 && Number(pay[0].montant) === 5000 && !!pay[0].numero && pay[0].encaisse_par === act.id, JSON.stringify(pay).slice(0, 200));
  await pa.click('#feuille [data-a="fermer"]').catch(() => {});

  // 3. Ajouter un enseignant
  await pa.goto(B + '#/enseignants'); await pa.waitForSelector('[data-a="ajouter-enseignant"]');
  ok('Enseignants : « Ajouter un enseignant » visible', true, '');
  await pa.click('[data-a="ajouter-enseignant"]'); await pa.waitForSelector('#feuille form[data-f="compte"]');
  await pa.fill('#feuille input[name=nom]', 'Prof Partenaire ' + SUF); await pa.fill('#feuille input[name=identifiant]', 'prof.part' + SUF.toLowerCase());
  await pa.click('#feuille form[data-f="compte"] button[type=submit]'); await pa.waitForSelector('text=Compte créé');
  await pa.click('#feuille [data-a="fermer"]'); await pa.click('#puce-sync'); await aJour(pa); await pa.waitForTimeout(600);
  const prof = (await api('comptes')).comptes.find((u) => u.identifiant === 'prof.part' + SUF.toLowerCase());
  ok('compte enseignant créé par l\'actionnaire', prof && prof.acces[cid] === 'enseignant', JSON.stringify(prof || {}).slice(0, 160));

  // 4. Contrat et paie du mois
  await pa.goto(B + '#/accueil'); await pa.goto(B + '#/enseignants'); await pa.waitForSelector(`[data-a="voir-ens"][data-id="${prof.id}"]`);
  await pa.click(`[data-a="voir-ens"][data-id="${prof.id}"]`); await pa.waitForSelector('#feuille form[data-f="contrat"]');
  await pa.fill('#feuille form[data-f="contrat"] input[name=taux]', '2000');
  await pa.click('#feuille form[data-f="contrat"] button[type=submit]'); await pa.waitForTimeout(800); await aJour(pa);
  let L = (await apiA('sync/tirer&depuis=0')).lignes;
  ok('contrat fixé par l\'actionnaire (2 000 F/h)', (L.contrats || []).some((k) => k.utilisateur_id === prof.id && Number(k.taux) === 2000 && Number(k.actif)), '');
  await pa.goto(B + '#/accueil'); await pa.goto(B + '#/enseignants'); await pa.click(`[data-a="voir-ens"][data-id="${prof.id}"]`); await pa.waitForSelector('#feuille form[data-f="paie"]');
  await pa.fill('#feuille form[data-f="paie"] input[name=montant]', '4000');
  await pa.click('#feuille form[data-f="paie"] button[type=submit]'); await pa.waitForTimeout(800); await aJour(pa);
  L = (await apiA('sync/tirer&depuis=0')).lignes;
  ok('paie du mois de 4 000 F versée par l\'actionnaire', (L.paies || []).some((x) => x.enseignant_id === prof.id && Number(x.montant) === 4000 && x.paye_par === act.id), JSON.stringify((L.paies || []).filter((x) => x.enseignant_id === prof.id)));

  // 5. Toujours rien dans l'autre centre
  const autre = (await api('sync/tirer&depuis=0')).lignes.centres.find((c) => c.id !== cid);
  if (autre) {
    const r = await apiA('sync/pousser', { ops: [{ op: opId(), t: 'eleves', id: 'el' + SUF + 'x', champs: { centre_id: autre.id, nom: 'INTRUS', prenoms: 'X', classe_id: '' } }] });
    ok('pas d\'inscription dans un centre où il n\'est pas', r.resultats && r.resultats[0].ok === false, JSON.stringify(r).slice(0, 160));
  }
  // 7. L'actionnaire fait l'appel.
  await pa.goto(B + '#/appel'); await pa.waitForTimeout(400);
  ok('onglet « Appel » dans la barre du bas', await pa.isVisible('.nav-basse a[href="#/appel"]'), '');
  // Une séance du jour qui a des élèves à pointer (d'autres bancs créent des classes vides).
  const hrefs = await pa.$$eval('a.ligne.creneau', (l) => l.map((a) => a.getAttribute('href')));
  let seance = null;
  for (const h of hrefs) { await pa.goto(B + h); await pa.waitForTimeout(300); if (await pa.$('[data-a="pointer"]')) { seance = h; break; } }
  if (seance) {
    const b = await pa.$('[data-a="pointer"][data-v="arrive"]') || await pa.$('[data-a="pointer"]');
    if (b) { await b.click(); await pa.waitForTimeout(500); await aJour(pa); }
    ok('l\'actionnaire pointe un élève à l\'appel', !!b && !(await pa.textContent('main')).includes('Consultation seule'), (await pa.textContent('main')).slice(0, 200));
  } else ok('une classe a cours aujourd\'hui pour tester l\'appel', false, 'aucune séance');

  // 8. Rappel d'échéance (avant la date) au parent et à l'élève.
  const auj = new Date(Date.now() - new Date().getTimezoneOffset() * 60000).toISOString().slice(0, 10);
  const jourEch = Math.min(28, Number(auj.slice(8)) + 2);
  const centreAvant = (await api('sync/tirer&depuis=0')).lignes.centres.find((c) => c.id === cid);
  await api('sync/pousser', { ops: [{ op: opId(), t: 'centres', id: cid, champs: { jour_echeance: jourEch } }] });
  const elR = 'elr' + SUF.toLowerCase() + Date.now().toString(36);
  const r7 = await api('sync/pousser', { ops: [{ op: opId(), t: 'eleves', id: elR, champs: { centre_id: cid, classe_id: el.classe_id, nom: 'RAPPEL' + SUF, prenoms: 'Junior', date_inscription: auj, parent_nom: 'Mme Rappel', parent_tel: '690000001', tel_eleve: '690000002', mensualite_due: 10000 } }] });
  ok('élève avec mensualité et numéros parent / élève', r7.resultats && r7.resultats[0].ok, JSON.stringify(r7).slice(0, 200));
  await pa.click('#puce-sync'); await aJour(pa); await pa.waitForTimeout(500);
  await pa.goto(B + '#/accueil'); await pa.goto(B + '#/caisse'); await pa.click('[data-a="caisse-onglet"][data-v="impayes"]'); await pa.waitForTimeout(400);
  const ligneR = pa.locator(`.ligne.message:has-text("RAPPEL${SUF}")`).first();
  ok('« Échéance proche » liste l\'élève avant la date', (await pa.textContent('main')).includes('Échéance proche') && (await ligneR.count()) > 0, (await pa.textContent('main')).slice(0, 300));
  if (await ligneR.count()) {
    const hrefs = await ligneR.locator('[data-a="relancer"]').evaluateAll((l) => l.map((a) => a.getAttribute('href')));
    ok('rappel au parent (WhatsApp et SMS) et à l\'élève (WhatsApp)', hrefs.some((h) => h.startsWith('https://wa.me/237690000001')) && hrefs.some((h) => h.startsWith('sms:+237690000001')) && hrefs.some((h) => h.startsWith('https://wa.me/237690000002')), hrefs.join(' | '));
    const txtEleve = decodeURIComponent((hrefs.find((h) => h.includes('690000002')) || '').split('text=')[1] || '');
    ok('message à l\'élève : « Bonjour Junior … au plus tard le … »', /^Bonjour Junior, petit rappel/.test(txtEleve) && /au plus tard le/.test(txtEleve), txtEleve);
    await pa.screenshot({ path: OUT + '/partenaire_rappels.png', fullPage: true });
  }
  await api('sync/pousser', { ops: [{ op: opId(), t: 'centres', id: cid, champs: { jour_echeance: Number(centreAvant.jour_echeance) || 10 } }] });

  // 9. Import d'une liste de cahier avec les montants (inscription ; octobre ; …), noms fictifs.
  await pa.goto(B + '#/accueil'); await pa.goto(B + '#/eleves'); await pa.click('[data-a="importer-eleves"]'); await pa.waitForSelector('#feuille form[data-f="import"]');
  await pa.selectOption('#feuille select[name=classe_id]', el.classe_id);
  await pa.fill('#feuille textarea[name=liste]', `ALPHA${SUF} Test ; 2500 ; 7500\nBETA${SUF} ; - ; 5000\nGAMMA${SUF} Essai ; 2000`);
  await pa.dispatchEvent('#feuille textarea[name=liste]', 'input'); await pa.waitForTimeout(300);
  ok('aperçu : 3 élèves, 4 versements (17 000 F)', /3\s*élèves à inscrire · 4\s*versements \(17\s000\sF\)/.test(await pa.textContent('#apercu-import')), await pa.textContent('#apercu-import'));
  await pa.click('#feuille form[data-f="import"] button[type=submit]'); await pa.waitForTimeout(2500); await aJour(pa); await pa.waitForTimeout(800);
  const Li = (await apiA('sync/tirer&depuis=0')).lignes;
  const imp = Li.eleves.filter((e) => e.nom.endsWith(SUF) && /^(ALPHA|BETA|GAMMA)/.test(e.nom));
  const vers = Li.paiements.filter((p) => imp.some((e) => e.id === p.eleve_id));
  ok('import : 3 élèves et 4 versements numérotés, 17 000 F', imp.length === 3 && vers.length === 4 && vers.every((p) => p.numero) && vers.reduce((s, p) => s + Number(p.montant), 0) === 17000, imp.length + ' / ' + vers.length);

  // 10. L'élève qui doit est marqué en rouge devant son nom (GAMMA : 2 000 F sur 2 500 F d'inscription).
  await pa.goto(B + '#/accueil'); await pa.goto(B + '#/eleves'); await pa.fill('input[type=search]', 'GAMMA' + SUF); await pa.waitForTimeout(500);
  ok('élève qui doit : pastille rouge et « doit … » dans la liste', (await pa.$$('.ligne .marque-doit')).length === 1 && /doit\s[\d\s ]+F/.test(await pa.textContent('main')), (await pa.textContent('main')).slice(0, 200));

  // 6. Chacun ne voit que son rôle ; l'administrateur les voit tous.
  await pa.goto(B + '#/roles'); await pa.waitForSelector('.fiche-role');
  const fichesA = await pa.$$eval('.fiche-role h3', (l) => l.map((x) => x.textContent));
  ok('actionnaire : « Mon rôle » ne montre que sa fiche', fichesA.length === 1 && fichesA[0] === 'Actionnaire' && /Mon rôle/.test(await pa.textContent('h1')), fichesA.join(', '));
  ok('actionnaire : pas de tableau des droits des autres rôles', !(await pa.isVisible('.matrice')), '');
  await adm.goto(B + '#/roles'); await adm.waitForSelector('.fiche-role');
  ok('administrateur : les cinq rôles et le tableau des droits', (await adm.$$('.fiche-role')).length === 5 && (await adm.isVisible('.matrice')), '');
  ok('aucune erreur JavaScript', pa.err.length === 0, pa.err.join(' / '));
  await nav.close();
  console.log(echecs.length ? `\n${echecs.length} échec(s)` : '\nTout est vert.');
  process.exit(echecs.length ? 1 : 0);
})();
