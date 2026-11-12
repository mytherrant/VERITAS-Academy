// Banc navigateur (local : php -S 127.0.0.1:8000 -t gestion, puis node tests/banc_gestion_agenda.cjs <dossier captures>)
// Agenda : rendez-vous saisi, enregistré au serveur (table créée par la migration automatique), échéance
// déduite, export .ics avec alarme, « Prochains rendez-vous », cloche, droits par rôle. Noms fictifs.
const { chromium } = require('playwright');
const fs = require('fs');
const OUT = process.argv[2]; const B = 'http://127.0.0.1:8000/';
const echecs = [];
const ok = (n, c, d) => { console.log((c ? '  OK    ' : '  ÉCHEC ') + n + (c ? '' : '  → ' + d)); if (!c) echecs.push(n); };
async function login(nav, id, mdp) {
  const ctx = await nav.newContext({ viewport: { width: 360, height: 780 }, isMobile: true, hasTouch: true, acceptDownloads: true, deviceScaleFactor: 2 });
  await ctx.addInitScript(() => { try { Object.defineProperty(navigator, 'canShare', { value: undefined }); Object.defineProperty(navigator, 'share', { value: undefined }); } catch (e) {} });
  const page = await ctx.newPage(); page.setDefaultTimeout(15000); page.err = [];
  page.on('pageerror', e => page.err.push(e.message)); page.on('console', m => { if (m.type() === 'error') page.err.push(m.text()); });
  await page.goto(B); await page.fill('input[name=identifiant]', id); await page.fill('input[name=mdp]', mdp);
  await page.click('button[type=submit]'); await page.waitForSelector('text=Bonjour');
  await page.waitForFunction(() => document.getElementById('puce-sync').textContent === 'À jour').catch(() => {});
  return page;
}
(async () => {
  const nav = await chromium.launch();
  const adm = await login(nav, 'jacques', 'MotDePasse-Test-2026');
  const api = (route, corps) => adm.evaluate(async ([route, corps]) => {
    const m = await new Promise(ok => { const r = indexedDB.open('veritas-gestion'); r.onsuccess = () => ok(r.result); });
    const jeton = await new Promise(ok => { const g = m.transaction('meta').objectStore('meta').get('jeton'); g.onsuccess = () => ok(g.result.v); });
    const rep = await fetch('api/index.php?r=' + route, { method: corps ? 'POST' : 'GET', headers: { Authorization: 'Bearer ' + jeton, 'Content-Type': 'application/json' }, body: corps ? JSON.stringify(corps) : undefined });
    return rep.json();
  }, [route, corps]);
  ok('cloche dans l\'en-tête', await adm.isVisible('#cloche'), 'absente');
  await adm.goto(B + '#/agenda'); await adm.waitForSelector('.calendrier');
  const demain = new Date(Date.now() + 86400000 - new Date().getTimezoneOffset() * 60000).toISOString().slice(0, 10);
  await adm.click('.fab');
  await adm.fill('#feuille input[name=titre]', 'Rencontre parents 3e');
  await adm.selectOption('#feuille select[name=type]', 'reunion_parents');
  await adm.fill('#feuille input[name=date]', demain);
  await adm.fill('#feuille input[name=heure]', '10:00'); await adm.fill('#feuille input[name=fin]', '11:30');
  await adm.fill('#feuille input[name=lieu]', 'Salle 2');
  await adm.selectOption('#feuille select[name=rappel_min]', '1440');
  await adm.screenshot({ path: OUT + '/ag-form.png' });
  await adm.click('#feuille button[type=submit]');
  await adm.waitForFunction(() => document.getElementById('puce-sync').textContent === 'À jour').catch(() => {});
  await adm.waitForTimeout(800);
  const liste = await adm.textContent('main');
  ok('rendez-vous affiché dans l\'agenda', /Rencontre parents 3e/.test(liste), liste.slice(0, 200));
  await adm.screenshot({ path: OUT + '/ag-page.png', fullPage: true });
  const srv = await api('sync/tirer&depuis=0');
  const n = (srv.lignes && srv.lignes.evenements || []).filter(e => e.titre === 'Rencontre parents 3e').length;
  ok('rendez-vous enregistré sur le serveur (table créée automatiquement)', n >= 1, JSON.stringify(srv).slice(0, 200));
  const ech = /Échéance des mensualités/.test(liste);
  ok('échéance des mensualités déduite et affichée', ech, '');
  await adm.click('.ligne.ev:has-text("Rencontre parents 3e") >> nth=0');
  await adm.waitForSelector('[data-a="ag-ics"]');
  const [d] = await Promise.all([adm.waitForEvent('download'), adm.click('[data-a="ag-ics"]')]);
  const p = OUT + '/' + d.suggestedFilename(); await d.saveAs(p); const ics = fs.readFileSync(p, 'utf8');
  ok('.ics : événement, heure, alarme la veille', /BEGIN:VEVENT/.test(ics) && /DTSTART:\d{8}T100000/.test(ics) && /TRIGGER:-PT1440M/.test(ics) && /LOCATION:Salle 2/.test(ics), ics);
  await adm.click('#feuille [data-a="fermer"]');
  await adm.goto(B + '#/accueil'); await adm.waitForTimeout(500);
  ok('accueil : « Prochains rendez-vous »', await adm.isVisible('h2:has-text("Prochains rendez-vous")'), '');
  await adm.screenshot({ path: OUT + '/ag-accueil.png' });
  await adm.click('#cloche'); await adm.waitForSelector('#feuille h2:has-text("Notifications")');
  const nt = await adm.textContent('#feuille');
  ok('notifications : rendez-vous de demain', /Demain à 10 h 00 · Rencontre parents 3e/.test(nt), nt.slice(0, 300));
  await adm.screenshot({ path: OUT + '/ag-notifs.png' });
  ok('admin : aucune erreur JavaScript', adm.err.length === 0, adm.err.join(' / '));
  // autres rôles
  const comptes = (await api('comptes')).comptes;
  for (const role of ['secretaire', 'enseignant', 'actionnaire']) {
    const u = comptes.find(x => !x.admin_global && Object.values(x.acces).includes(role) && x.actif);
    const r = await api('comptes/mdp', { id: u.id });
    const pg = await login(nav, u.identifiant, r.mdp);
    await pg.goto(B + '#/agenda'); await pg.waitForSelector('.calendrier'); await pg.waitForTimeout(400);
    const t = await pg.textContent('main');
    ok(role + ' : voit le rendez-vous', /Rencontre parents 3e/.test(t), t.slice(0, 120));
    ok(role + ' : bouton « Rendez-vous » ' + (role === 'enseignant' ? 'absent' : 'présent'), (await pg.isVisible('.fab')) === (role !== 'enseignant'), '');
    ok(role + ' : échéance ' + (role === 'enseignant' ? 'masquée' : 'visible'), /Échéance des mensualités/.test(t) === (role !== 'enseignant'), '');
    ok(role + ' : aucune erreur JavaScript', pg.err.length === 0, pg.err.join(' / '));
    await pg.context().close();
  }
  await nav.close();
  console.log(echecs.length ? `\n${echecs.length} échec(s)` : '\nTout est vert.');
  process.exit(echecs.length ? 1 : 0);
})();
