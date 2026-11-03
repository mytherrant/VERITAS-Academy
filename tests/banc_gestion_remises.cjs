// Banc navigateur (local : php -S 127.0.0.1:8000 -t gestion, puis node tests/banc_gestion_remises.cjs <dossier captures>)
// Remises de fonds au trésorier : désignation du trésorier, remise par un partenaire, confirmation
// (« Reçu ») et contestation (« Pas reçu ») par le trésorier, refus côté serveur, cloche. Noms fictifs.
const { chromium } = require('playwright');
const B = 'http://127.0.0.1:8000/';
const OUT = process.argv[2] || '.';
const echecs = [];
const ok = (n, c, d) => { console.log((c ? '  OK    ' : '  ÉCHEC ') + n + (c ? '' : '  → ' + d)); if (!c) echecs.push(n); };
const aJour = (p) => p.waitForFunction(() => document.getElementById('puce-sync').textContent === 'À jour', null, { timeout: 15000 }).catch(() => {});
async function login(nav, id, mdp) {
  const ctx = await nav.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true, deviceScaleFactor: 2 });
  await ctx.addInitScript(() => { try { Object.defineProperty(navigator, 'share', { value: undefined }); } catch (e) {} });
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
const allerRemises = async (p) => { await p.goto(B + '#/accueil'); await p.goto(B + '#/caisse'); await p.click('[data-a="caisse-onglet"][data-v="remises"]'); await p.waitForTimeout(300); };

(async () => {
  const nav = await chromium.launch();
  const adm = await login(nav, 'jacques', 'MotDePasse-Test-2026');
  const api = apiDe(adm);
  const comptes = (await api('comptes')).comptes;
  const act = comptes.find((u) => !u.admin_global && u.actif && Object.values(u.acces).includes('actionnaire'));
  const cid = Object.keys(act.acces).find((c) => act.acces[c] === 'actionnaire');
  const sec = comptes.find((u) => !u.admin_global && u.actif && u.acces[cid] === 'secretaire');
  const resp = comptes.find((u) => !u.admin_global && u.actif && u.acces[cid] === 'responsable');
  const auj = new Date(Date.now() - new Date().getTimezoneOffset() * 60000).toISOString().slice(0, 10);

  // Sans trésorier, une remise est refusée.
  await api('sync/pousser', { ops: [{ op: id(), t: 'centres', id: cid, champs: { tresorier_id: '' } }] });
  const mdpS = (await api('comptes/mdp', { id: sec.id })).mdp;
  let ps = await login(nav, sec.identifiant, mdpS);
  let r = await apiDe(ps)('sync/pousser', { ops: [{ op: id(), t: 'remises', id: id(), champs: { centre_id: cid, montant: 1000, date: auj, mode: 'especes', statut: 'en_attente' } }] });
  ok('sans trésorier désigné : remise refusée', /Aucun trésorier/.test(JSON.stringify(r)), JSON.stringify(r).slice(0, 200));

  // L'admin désigne l'actionnaire comme trésorier, dans la fiche du centre.
  await adm.goto(B + '#/accueil');
  const b = await adm.locator('.entete .marque').boundingBox();
  await adm.mouse.move(b.x + 10, b.y + 10); await adm.mouse.down(); await adm.waitForTimeout(2300); await adm.mouse.up();
  await adm.goto(B + '#/centres'); await adm.click(`[data-a="editer-centre"][data-id="${cid}"]`);
  await adm.selectOption('#feuille select[name=tresorier_id]', act.id);
  await adm.click('#feuille button[type=submit]'); await aJour(adm); await adm.waitForTimeout(500);
  const srvC = (await api('sync/tirer&depuis=0')).lignes.centres.find((c) => c.id === cid);
  ok('trésorier enregistré dans la fiche du centre', srvC.tresorier_id === act.id, JSON.stringify(srvC).slice(0, 120));

  // La secrétaire remet 25 000 F (interface).
  await ps.close(); ps = await login(nav, sec.identifiant, mdpS);
  await allerRemises(ps);
  ok('secrétaire : « Chez vous » et bouton « Remettre au trésorier »', await ps.isVisible('text=À remettre au trésorier') && await ps.isVisible('[data-a="editer-remise"]'), '');
  await ps.click('[data-a="editer-remise"]');
  await ps.fill('#feuille input[name=montant]', '25000');
  await ps.fill('#feuille input[name=note]', 'Versements de la semaine');
  await ps.click('#feuille button[type=submit]');
  await ps.waitForSelector('#feuille:has-text("Prévenir")'); await ps.click('#feuille [data-a="fermer"]').catch(() => {});
  await aJour(ps); await ps.waitForTimeout(500);
  let rem = (await api('sync/tirer&depuis=0')).lignes.remises.filter((x) => x.remis_par === sec.id && x.montant == 25000 && x.statut === 'en_attente');
  ok('remise enregistrée au serveur, « en attente », remis_par = la secrétaire', rem.length >= 1, JSON.stringify(rem).slice(0, 200));
  const r1 = rem[rem.length - 1];
  await ps.screenshot({ path: OUT + '/remise_secretaire.png', fullPage: true });

  // Ni l'auteur, ni un responsable non trésorier ne confirment.
  r = await apiDe(ps)('sync/pousser', { ops: [{ op: id(), t: 'remises', id: r1.id, champs: { statut: 'confirmee' } }] });
  ok('la secrétaire ne confirme pas sa propre remise', /trésorier/.test(JSON.stringify(r)), JSON.stringify(r).slice(0, 200));
  if (resp) {
    const pr = await login(nav, resp.identifiant, (await api('comptes/mdp', { id: resp.id })).mdp);
    r = await apiDe(pr)('sync/pousser', { ops: [{ op: id(), t: 'remises', id: r1.id, champs: { statut: 'confirmee' } }] });
    ok('un responsable non trésorier ne confirme pas', /trésorier/.test(JSON.stringify(r)), JSON.stringify(r).slice(0, 200));
    await pr.context().close();
  }

  // Deuxième remise, que le trésorier contestera.
  const r2id = id();
  await apiDe(ps)('sync/pousser', { ops: [{ op: id(), t: 'remises', id: r2id, champs: { centre_id: cid, montant: 7000, date: auj, mode: 'momo', statut: 'en_attente' } }] });

  // Le trésorier (actionnaire) : cloche, confirmation, contestation.
  const pa = await login(nav, act.identifiant, (await api('comptes/mdp', { id: act.id })).mdp);
  await pa.click('#cloche'); await pa.waitForSelector('#feuille h2:has-text("Notifications")');
  ok('trésorier : la cloche annonce les remises à confirmer', /remises? à confirmer/.test(await pa.textContent('#feuille')), await pa.textContent('#feuille'));
  await pa.click('#feuille [data-a="fermer"]');
  await allerRemises(pa);
  ok('actionnaire : peut encaisser (onglet « Encaisser »)', await pa.isVisible('[data-a="caisse-onglet"][data-v="encaisser"]'), '');
  await pa.screenshot({ path: OUT + '/remise_tresorier.png', fullPage: true });
  await pa.click(`.ligne.remise:has-text("25 000") [data-a="remise-recue"]`);
  await pa.click('#feuille button.btn:has-text("Oui, reçu")'); await aJour(pa); await pa.waitForTimeout(400);
  await pa.click(`.ligne.remise:has-text("7 000") [data-a="remise-contester"]`);
  await pa.fill('#feuille input[name=motif]', 'Rien reçu sur MoMo');
  await pa.click('#feuille button[type=submit]'); await aJour(pa); await pa.waitForTimeout(400);
  const l = (await api('sync/tirer&depuis=0')).lignes.remises;
  const a = l.find((x) => x.id === r1.id), c2 = l.find((x) => x.id === r2id);
  ok('« Reçu » : remise confirmée par le trésorier, horodatée', a.statut === 'confirmee' && a.confirme_par === act.id && !!a.confirme_le, JSON.stringify(a));
  ok('« Pas reçu » : remise contestée avec le motif', c2.statut === 'contestee' && c2.motif === 'Rien reçu sur MoMo', JSON.stringify(c2));
  r = await apiDe(pa)('sync/pousser', { ops: [{ op: id(), t: 'remises', id: r1.id, champs: { statut: 'contestee', motif: 'je change d avis' } }] });
  ok('une remise tranchée ne se modifie plus', /tranchée/.test(JSON.stringify(r)), JSON.stringify(r).slice(0, 200));

  // La secrétaire voit la contestation.
  await ps.close(); ps = await login(nav, sec.identifiant, mdpS);
  await ps.click('#cloche'); await ps.waitForSelector('#feuille h2:has-text("Notifications")');
  ok('secrétaire : la cloche signale la remise « non reçue »', /non reçue/.test(await ps.textContent('#feuille')), await ps.textContent('#feuille'));
  await ps.click('#feuille [data-a="fermer"]');
  await adm.goto(B + '#/bilan'); await adm.waitForTimeout(400);
  ok('bilan : « Fonds chez le trésorier » et « Encore chez les partenaires »', /Fonds chez le trésorier/.test(await adm.textContent('main')) && /Encore chez les partenaires/.test(await adm.textContent('main')), '');

  for (const [n, p] of [['admin', adm], ['secrétaire', ps], ['trésorier', pa]]) ok(n + ' : aucune erreur JavaScript', p.err.length === 0, p.err.join(' / '));
  await nav.close();
  console.log(echecs.length ? `\n${echecs.length} échec(s)` : '\nTout est vert.');
  process.exit(echecs.length ? 1 : 0);
})();
