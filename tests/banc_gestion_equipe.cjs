// Banc navigateur (local : php -S 127.0.0.1:8000 -t gestion, puis node tests/banc_gestion_equipe.cjs <dossier captures>)
// Espace « Équipe » des partenaires : discussion, commentaire sur une dépense, réunion à dates proposées
// (disponibilités, date retenue → agenda), tâche assignée, cloche ; refus serveur. Noms fictifs.
const { chromium } = require('playwright');
const B = 'http://127.0.0.1:8000/';
const OUT = process.argv[2] || '.';
const echecs = [];
const ok = (n, c, d) => { console.log((c ? '  OK    ' : '  ÉCHEC ') + n + (c ? '' : '  → ' + d)); if (!c) echecs.push(n); };
const aJour = (p) => p.waitForFunction(() => document.getElementById('puce-sync').textContent === 'À jour', null, { timeout: 15000 }).catch(() => {});
async function login(nav, id, mdp) {
  const ctx = await nav.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true, deviceScaleFactor: 2 });
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
const id = () => Math.random().toString(16).slice(2, 12) + Math.random().toString(16).slice(2, 12);
const SUF = Date.now().toString(36).slice(-4).toUpperCase();
const sync = async (p) => { await p.click('#puce-sync'); await aJour(p); await p.waitForTimeout(400); };

(async () => {
  const nav = await chromium.launch();
  const adm = await login(nav, 'jacques', 'MotDePasse-Test-2026');
  const api = apiDe(adm);
  const comptes = (await api('comptes')).comptes;
  const sec = comptes.find((u) => !u.admin_global && u.actif && Object.values(u.acces).includes('secretaire'));
  const cid = Object.keys(sec.acces).find((c) => sec.acces[c] === 'secretaire');
  const act = comptes.find((u) => !u.admin_global && u.actif && u.acces[cid] === 'actionnaire');
  const prof = comptes.find((u) => !u.admin_global && u.actif && u.acces[cid] === 'enseignant');
  const ps = await login(nav, sec.identifiant, (await api('comptes/mdp', { id: sec.id })).mdp);
  const pa = await login(nav, act.identifiant, (await api('comptes/mdp', { id: act.id })).mdp);

  // 1. Discussion
  await ps.goto(B + '#/equipe'); await ps.waitForSelector('.form-message');
  await ps.fill('.form-message textarea', 'Bonjour à tous ' + SUF + ', point caisse vendredi ?');
  await ps.click('.form-message button[type=submit]'); await aJour(ps); await ps.waitForTimeout(400);
  await sync(pa);
  await pa.click('#cloche'); await pa.waitForSelector('#feuille h2:has-text("Notifications")');
  ok('cloche de l\'actionnaire : nouveau message', /nouveaux? messages?/.test(await pa.textContent('#feuille')), await pa.textContent('#feuille'));
  await pa.click('#feuille a[data-eq="discussion"]'); await pa.waitForSelector('.fil');
  ok('l\'actionnaire lit le message de la secrétaire', (await pa.textContent('.fil')).includes('Bonjour à tous ' + SUF), '');
  await pa.fill('.form-message textarea', 'Oui, vendredi 16 h. ' + SUF);
  await pa.click('.form-message button[type=submit]'); await aJour(pa); await pa.waitForTimeout(300);

  // 2. Commentaire sur une dépense
  const dep = id();
  await api('sync/pousser', { ops: [{ op: id(), t: 'depenses', id: dep, champs: { centre_id: cid, date: new Date().toISOString().slice(0, 10), libelle: 'Peinture ' + SUF, categorie: 'fournitures', montant: 8000 } }] });
  await sync(pa);
  await pa.goto(B + '#/caisse'); await pa.click('[data-a="caisse-onglet"][data-v="depenses"]');
  await pa.click(`.ligne:has-text("Peinture ${SUF}")`);
  await pa.click('#feuille [data-a="ouvrir-fil"]'); await pa.waitForSelector('#zone-fil');
  await pa.fill('#feuille .form-message textarea', 'Pourquoi deux pots ? ' + SUF);
  await pa.click('#feuille .form-message button[type=submit]'); await pa.waitForTimeout(400);
  ok('commentaire ajouté sous la dépense', (await pa.textContent('#zone-fil')).includes('Pourquoi deux pots ? ' + SUF), '');
  await pa.screenshot({ path: OUT + '/equipe_commentaire.png' });
  await pa.click('#feuille [data-a="fermer"]'); await aJour(pa);
  await sync(ps); await ps.goto(B + '#/accueil'); await ps.goto(B + '#/equipe'); await ps.waitForTimeout(300);
  ok('la secrétaire voit le commentaire dans « Commentaires récents »', /Dépense · Peinture/.test(await ps.textContent('main')), (await ps.textContent('main')).slice(0, 300));

  // 3. Réunion : dates proposées, disponibilités, date retenue → agenda
  await ps.click('[data-a="eq-onglet"][data-v="reunions"]'); await ps.click('.fab');
  const j1 = new Date(Date.now() + 2 * 86400000).toISOString().slice(0, 10), j2 = new Date(Date.now() + 3 * 86400000).toISOString().slice(0, 10);
  await ps.fill('#feuille input[name=titre]', 'Réunion bilan ' + SUF);
  await ps.fill('#feuille input[name=d0]', j1); await ps.fill('#feuille input[name=h0]', '16:00');
  await ps.fill('#feuille input[name=d1]', j2); await ps.fill('#feuille input[name=h1]', '17:00');
  await ps.click('#feuille button[type=submit]'); await ps.waitForSelector('#feuille .option-date'); await ps.click('#feuille [data-a="fermer"]'); await aJour(ps);
  await sync(pa);
  await pa.click('#cloche'); await pa.waitForSelector('#feuille h2:has-text("Notifications")');
  ok('cloche : « Réunion : donnez vos disponibilités »', (await pa.textContent('#feuille')).includes('Réunion bilan ' + SUF), '');
  await pa.click('#feuille [data-a="fermer"]');
  await pa.goto(B + '#/equipe'); await pa.click('[data-a="eq-onglet"][data-v="reunions"]'); await pa.click(`.ligne:has-text("Réunion bilan ${SUF}")`);
  await pa.click(`#feuille [data-a="dispo"][data-o="${j2} 17:00"][data-v="oui"]`); await pa.waitForTimeout(300);
  await pa.click(`#feuille [data-a="dispo"][data-o="${j1} 16:00"][data-v="non"]`); await pa.waitForTimeout(300);
  await pa.screenshot({ path: OUT + '/equipe_reunion.png' });
  await pa.click('#feuille [data-a="fermer"]'); await aJour(pa);
  await sync(ps);
  await ps.goto(B + '#/accueil'); await ps.goto(B + '#/equipe'); await ps.click('[data-a="eq-onglet"][data-v="reunions"]'); await ps.click(`.ligne:has-text("Réunion bilan ${SUF}")`);
  ok('la proposante voit « Oui : Actionnaire… » sur la 2e date', /Oui : [^·]*Actionnaire/.test(await ps.textContent('#feuille .option-date:has-text("à 17 h 00")')), await ps.textContent('#feuille'));
  await ps.click(`#feuille [data-a="fixer-sondage"][data-o="${j2} 17:00"]`); await ps.click('#feuille button.btn:has-text("Retenir")');
  await aJour(ps); await ps.waitForTimeout(500);
  const L = (await api('sync/tirer&depuis=0')).lignes;
  const sd = L.sondages.find((x) => x.titre === 'Réunion bilan ' + SUF);
  const ev = L.evenements.find((x) => x.titre === 'Réunion bilan ' + SUF);
  ok('réunion fixée au 2e créneau, et ajoutée à l\'agenda', sd && sd.statut === 'clos' && sd.choix === j2 + ' 17:00' && ev && ev.date === j2 && ev.heure === '17:00', JSON.stringify({ sd, ev }).slice(0, 300));

  // 4. Tâche assignée, en retard, faite
  await pa.goto(B + '#/equipe'); await pa.click('[data-a="eq-onglet"][data-v="taches"]'); await pa.click('.fab');
  await pa.fill('#feuille input[name=titre]', 'Relancer les impayés ' + SUF);
  await pa.selectOption('#feuille select[name=assigne_a]', sec.id);
  await pa.fill('#feuille input[name=echeance]', new Date(Date.now() - 86400000).toISOString().slice(0, 10));
  await pa.click('#feuille button[type=submit]'); await aJour(pa); await pa.waitForTimeout(300);
  await sync(ps);
  await ps.click('#cloche'); await ps.waitForSelector('#feuille h2:has-text("Notifications")');
  ok('cloche de la secrétaire : « Tâche en retard »', (await ps.textContent('#feuille')).includes('Tâche en retard : Relancer les impayés ' + SUF), await ps.textContent('#feuille'));
  await ps.click('#feuille a[data-eq="taches"]'); await ps.waitForSelector('.ligne.tache');
  await ps.click(`.ligne.tache:has-text("Relancer les impayés ${SUF}") [data-a="avancer-tache"]`); await aJour(ps); await ps.waitForTimeout(300);
  await ps.click(`.ligne.tache:has-text("Relancer les impayés ${SUF}") [data-a="avancer-tache"]`); await aJour(ps); await ps.waitForTimeout(400);
  const t = (await api('sync/tirer&depuis=0')).lignes.taches.find((x) => x.titre === 'Relancer les impayés ' + SUF);
  ok('tâche passée « En cours » puis « Fait », horodatée', t && t.statut === 'fait' && !!t.fait_le && t.auteur === act.id, JSON.stringify(t));
  await ps.screenshot({ path: OUT + '/equipe_taches.png', fullPage: true });

  // 5. Refus côté serveur
  const msgS = (await api('sync/tirer&depuis=0')).lignes.messages.find((m) => m.texte === 'Bonjour à tous ' + SUF + ', point caisse vendredi ?');
  let r = await apiDe(pa)('sync/pousser', { ops: [{ op: id(), t: 'messages', id: msgS.id, suppr: true, champs: {} }] });
  ok('on ne supprime pas le message d\'un autre', /auteur/.test(JSON.stringify(r)), JSON.stringify(r).slice(0, 200));
  r = await apiDe(pa)('sync/pousser', { ops: [{ op: id(), t: 'messages', id: msgS.id, champs: { texte: 'modifié' } }] });
  ok('on ne modifie pas le message d\'un autre', /auteur/.test(JSON.stringify(r)), JSON.stringify(r).slice(0, 200));
  if (prof) {
    const pp = await login(nav, prof.identifiant, (await api('comptes/mdp', { id: prof.id })).mdp);
    const lp = (await apiDe(pp)('sync/tirer&depuis=0')).lignes;
    ok('l\'enseignant ne reçoit ni messages, ni réunions, ni tâches', !(lp.messages || []).length && !(lp.sondages || []).length && !(lp.taches || []).length, Object.keys(lp).join(','));
    await pp.goto(B + '#/equipe'); await pp.waitForTimeout(300);
    ok('l\'enseignant n\'a pas l\'écran Équipe', !(await pp.isVisible('h1:text("Équipe")')), '');
    await pp.context().close();
  }
  for (const [n, p] of [['secrétaire', ps], ['actionnaire', pa], ['admin', adm]]) ok(n + ' : aucune erreur JavaScript', p.err.length === 0, p.err.join(' / '));
  await nav.close();
  console.log(echecs.length ? `\n${echecs.length} échec(s)` : '\nTout est vert.');
  process.exit(echecs.length ? 1 : 0);
})();
