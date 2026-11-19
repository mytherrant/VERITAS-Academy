/* Banc des RÔLES D'ÉQUIPE — Atelier de Français (contre-expertise du 28/10/2026, X2).
 *
 * Ce que le rapport a trouvé
 * --------------------------
 * `?action=etat` enregistrait tel quel l'instantané que renvoie chaque membre.
 * Le statut d'une épreuve (brouillon → relecture → validé) et sa publication
 * en bibliothèque vivaient dans cet instantané, et les rôles seulement dans
 * le navigateur : un enseignant passait une épreuve à « validé » et toute
 * l'équipe la recevait ainsi.
 *
 * La règle retenue par Jacques : le responsable DÉSIGNE les relecteurs, et le
 * serveur les reconnaît. Ce banc parle au vrai api/plateforme.php par HTTP
 * (php -S), avec trois comptes : A responsable, B enseignant, C relecteur.
 *
 *   node tests/banc_atelier_roles.cjs
 */
'use strict';
const fs = require('fs');
const os = require('os');
const path = require('path');
const { spawn } = require('child_process');

const RACINE = path.resolve(__dirname, '..');
const V = '\x1b[32m✓\x1b[0m', X = '\x1b[31m✗\x1b[0m', G = '\x1b[1m', R = '\x1b[0m';
let ok = 0, ko = 0;
const dire = (b, m, d) => {
  b ? ok++ : ko++;
  console.log('  ' + (b ? V : X) + ' ' + m + (!b && d ? '  → ' + d : ''));
};

const PORT = 8971 + (process.pid % 20);
const BASE = 'http://127.0.0.1:' + PORT;
const BAC = fs.mkdtempSync(path.join(os.tmpdir(), 'vrt-banc-roles-'));
// Mêmes dépendances que banc_entree_libre.cjs : un require_once oublié est une erreur fatale.
const FICHIERS = ['plateforme.php', '_json_boot.php', 'config_sync.php',
  '_auth_lib.php', '_livret_lib.php', '_notify_lib.php', '_skysms_lib.php', '_parrainage_lib.php', '_recettes_lib.php', '_sentinel.php',
  '_bot_log.php'];
const DBF = path.join(BAC, 'data', 'veritas_db.json');

function monterBac() {
  fs.mkdirSync(path.join(BAC, 'api', 'data'), { recursive: true });
  fs.mkdirSync(path.join(BAC, 'data'), { recursive: true });
  for (const f of FICHIERS) {
    const src = path.join(RACINE, 'api', f);
    if (fs.existsSync(src)) fs.copyFileSync(src, path.join(BAC, 'api', f));
  }
  fs.writeFileSync(path.join(BAC, 'api', 'payment_config.php'),
    "<?php define('API_SECRET', 'banc-roles-" + Math.random().toString(36).slice(2) + "');\n");
  fs.writeFileSync(path.join(BAC, 'api', 'data', 'corpus_minesec.json'), '[]');
  fs.writeFileSync(DBF, JSON.stringify({
    school: { nom: 'VÉRITAS' }, students: [], studentAccounts: [], visitorAccounts: [],
    plateforme: { offres: { joursEssai: 7, cadeauBienvenue: 0, quotaEssai: 10, essaisParIp: 20 } },
    lastModified: 1000,
  }));
}

let serveur = null;
async function lancerServeur() {
  serveur = spawn('php', ['-S', '127.0.0.1:' + PORT, '-t', BAC], { cwd: BAC, stdio: ['ignore', 'ignore', 'ignore'] });
  for (let i = 0; i < 60; i++) {
    try { const r = await fetch(BASE + '/api/plateforme.php?action=config'); if (r.status) return true; }
    catch (e) { await new Promise(s => setTimeout(s, 150)); }
  }
  return false;
}
async function appel(url, opts) {
  const r = await fetch(BASE + '/api/plateforme.php' + url, opts || {});
  let j = {}; try { j = await r.json(); } catch (e) {}
  return { http: r.status, j };
}
const poste = (url, corps, jeton) => appel(url, { method: 'POST',
  headers: Object.assign({ 'Content-Type': 'application/json' }, jeton ? { Authorization: 'Bearer ' + jeton } : {}),
  body: JSON.stringify(corps || {}) });
const lit = (url, jeton) => appel(url, jeton ? { headers: { Authorization: 'Bearer ' + jeton } } : {});
const empreinte = () => 'app' + Math.random().toString(36).slice(2, 14) + Math.random().toString(36).slice(2, 10);
const lireBase = () => JSON.parse(fs.readFileSync(DBF, 'utf8'));

async function titulaire(nom, tel) {
  const inv = await poste('?action=invite', { appareil: empreinte() });
  const pr = await poste('?action=promouvoir', { nom, tel }, inv.j.token);
  return { jeton: pr.j.token, id: pr.j.compte && pr.j.compte.id };
}
const epreuve = (id, quoi) => Object.assign({ id, title: 'Épreuve ' + id, classe: '3ᵉ', consigne: 'Lis le texte.',
  textIds: [1], status: 'brouillon', ownerId: 'x', editorIds: [], inLibrary: false, updatedAt: 1000,
  comments: [], activity: [], revue: { tour: 1, requis: 1, echeance: 0, decisions: [] } }, quoi || {});
const etatServeur = gid => ((lireBase().plateforme.etats || {})[gid] || {}).contenu || {};
const ep = (gid, id) => (etatServeur(gid).epreuves || []).find(e => e.id === id) || {};

let horloge = Date.now();
const tic = () => (horloge = Math.max(horloge + 10, Date.now()));
/* Copie de _revueDe + _statutRevue (plateforme/index.html) : le statut que le
   navigateur RECALCULE à partir des décisions, quoi que dise `status`. */
function statutNavigateur(e) {
  const r0 = (e && e.revue) || {};
  const r = { tour: r0.tour || 1, requis: Math.max(1, +r0.requis || 1), decisions: Array.isArray(r0.decisions) ? r0.decisions : [] };
  const cur = r.decisions.filter(d => d.tour === r.tour);
  if (cur.some(d => d.verdict === 'rejete')) return 'rejete';
  if (cur.some(d => d.verdict === 'ajustement')) return 'ajustement';
  if (cur.filter(d => d.verdict === 'valide').length >= r.requis) return 'valide';
  return 'relecture';
}

(async () => {
  monterBac();
  if (!(await lancerServeur())) { console.log('  ' + X + ' impossible de lancer php -S'); process.exit(1); }
  try {
    console.log(`\n${G}① Trois titulaires, une équipe${R}`);
    const A = await titulaire('Mme Responsable', '699000001');
    const B = await titulaire('M. Enseignant', '699000002');
    const C = await titulaire('Mme Relectrice', '699000003');
    dire(!!(A.jeton && B.jeton && C.jeton && A.id && B.id && C.id), 'trois comptes titulaires, trois jetons');
    const cr = await poste('?action=groupe&op=creer', { nom: 'Lycée Banc' }, A.jeton);
    const gid = cr.j.groupe && cr.j.groupe.id;
    dire(!!gid, 'A crée l’équipe', JSON.stringify(cr.j).slice(0, 120));
    // Les places d'un compte d'essai ne laissent pas rejoindre : on inscrit B et C dans la base du banc.
    const base = lireBase();
    base.plateforme.groupes.forEach(g => { if (g.id === gid) g.membres = [A.id, B.id, C.id]; });
    fs.writeFileSync(DBF, JSON.stringify(base));

    console.log(`\n${G}② Le responsable seul attribue les rôles${R}`);
    let r = await poste('?action=groupe&op=role', { groupe: gid, membre: C.id, role: 'relecteur' }, A.jeton);
    dire(r.http === 200 && r.j.ok && r.j.roles && r.j.roles[C.id] === 'relecteur', 'A désigne C relectrice', JSON.stringify(r.j).slice(0, 140));
    r = await poste('?action=groupe&op=role', { groupe: gid, membre: B.id, role: 'chef' }, B.jeton);
    dire(r.http === 403, 'B ne peut pas se nommer chef', 'HTTP ' + r.http);
    r = await poste('?action=groupe&op=role', { groupe: gid, membre: B.id, role: 'dieu' }, A.jeton);
    dire(r.http === 400, 'un rôle inconnu est refusé', 'HTTP ' + r.http);
    r = await poste('?action=groupe&op=role', { groupe: gid, membre: 'va_inconnu', role: 'relecteur' }, A.jeton);
    dire(r.http === 400, 'un non-membre ne reçoit pas de rôle', 'HTTP ' + r.http);
    r = await poste('?action=groupe&op=role', { groupe: gid, membre: A.id, role: 'enseignant' }, A.jeton);
    dire(r.http === 400, 'le responsable ne se rétrograde pas en enseignant', 'HTTP ' + r.http);
    r = await lit('?action=groupe&op=lister', B.jeton);
    const roles = ((r.j.groupes || [])[0] || {}).roles || {};
    dire(roles[A.id] === 'chef' && roles[B.id] === 'enseignant' && roles[C.id] === 'relecteur',
      'chaque membre lit les rôles appliqués (A chef, B enseignant, C relectrice)', JSON.stringify(roles));

    console.log(`\n${G}③ Ce qu’un enseignant ne décide pas${R}`);
    const pousse = (jeton, eps, plus) => poste('?action=etat&groupe=' + gid,
      { etat: Object.assign({ epreuves: eps }, plus || {}) }, jeton);
    const D = (uid, verdict, tour) => ({ uid, nom: 'R', verdict, portee: 'Tout le sujet', motif: '', tour: tour || 1, ts: tic() });
    r = await pousse(B.jeton, [epreuve('e9', { ownerId: A.id, status: 'valide', updatedAt: tic() })]);
    dire(r.http === 200 && ep(gid, 'e9').status === 'relecture' && r.j.corriges >= 1,
      'B pose « validé » sur une épreuve neuve : le serveur la remet en relecture', ep(gid, 'e9').status + ' / ' + JSON.stringify(r.j));
    await pousse(B.jeton, [Object.assign({}, ep(gid, 'e9'), { inLibrary: true, updatedAt: tic() })]);
    dire(ep(gid, 'e9').inLibrary === false, 'B ne publie pas en bibliothèque');
    for (const faux of ['0', [], {}]) {
      await pousse(B.jeton, [Object.assign({}, ep(gid, 'e9'), { inLibrary: faux, updatedAt: tic() })]);
      dire(ep(gid, 'e9').inLibrary === false, 'B ne publie pas non plus avec inLibrary = ' + JSON.stringify(faux) + ' (vrai pour le navigateur)');
    }
    await pousse(B.jeton, [Object.assign({}, ep(gid, 'e9'), { updatedAt: tic(),
      revue: { tour: 1, requis: 1, echeance: 0, decisions: [D(C.id, 'valide')] } })]);
    dire((ep(gid, 'e9').revue.decisions || []).length === 0,
      'B ne fabrique pas une décision « valide » au nom de C (le navigateur en déduirait le statut)');
    r = await pousse(B.jeton, [epreuve(['z1'], { status: 'valide', inLibrary: true, updatedAt: tic() })]);
    dire(!(etatServeur(gid).epreuves || []).some(e => Array.isArray(e.id) || e.id === 'z1'),
      'un identifiant en tableau (le navigateur en ferait la clé "z1") est écarté');
    await pousse(B.jeton, [epreuve('solo', { ownerId: B.id, status: 'valide', solo: true, updatedAt: tic(),
      revue: { tour: 1, requis: 1, echeance: 0, decisions: [Object.assign(D(B.id, 'valide'), { solo: true })] } })]);
    dire(ep(gid, 'solo').status === 'relecture' && (ep(gid, 'solo').revue.decisions || []).length === 0,
      'en équipe, B ne valide pas seul sa propre épreuve (le solo est pour qui peut valider)');

    console.log(`\n${G}④ Ce que les relectrices décident${R}`);
    // D, seconde relectrice, pour un quorum de deux.
    const Dd = await titulaire('Mme Seconde', '699000004');
    const b2 = lireBase(); b2.plateforme.groupes.forEach(g => { if (g.id === gid) g.membres.push(Dd.id); }); fs.writeFileSync(DBF, JSON.stringify(b2));
    await poste('?action=groupe&op=role', { groupe: gid, membre: Dd.id, role: 'relecteur' }, A.jeton);
    await pousse(B.jeton, [Object.assign({}, ep(gid, 'e9'), { status: 'relecture', updatedAt: tic(),
      revue: { tour: 1, requis: 2, echeance: 0, decisions: [] } })]);
    dire(ep(gid, 'e9').revue.requis === 2, 'B soumet en relecture avec deux relectures requises');
    r = await pousse(C.jeton, [Object.assign({}, ep(gid, 'e9'), { updatedAt: tic(),
      revue: Object.assign({}, ep(gid, 'e9').revue, { decisions: [D(C.id, 'valide')] }) })]);
    dire(ep(gid, 'e9').revue.decisions.length === 1 && ep(gid, 'e9').status !== 'valide',
      'C rend sa décision : une sur deux, pas encore validé', JSON.stringify(r.j));
    await pousse(B.jeton, [Object.assign({}, ep(gid, 'e9'), { updatedAt: tic(),
      revue: Object.assign({}, ep(gid, 'e9').revue, { requis: 1 }) })]);
    dire(ep(gid, 'e9').revue.requis === 2 && ep(gid, 'e9').status !== 'valide',
      'B abaisse « requis » à 1 dans le même tour : refusé, la décision de C ne suffit pas');
    r = await pousse(Dd.jeton, [Object.assign({}, ep(gid, 'e9'), { status: 'valide', updatedAt: tic(),
      revue: Object.assign({}, ep(gid, 'e9').revue, { decisions: [D(Dd.id, 'valide')] }) })]);
    dire(ep(gid, 'e9').revue.decisions.length === 2,
      'D envoie sans la décision de C : le serveur ADDITIONNE (il n’écrase plus celle de C)', JSON.stringify(ep(gid, 'e9').revue.decisions.map(d => d.uid)));
    dire(r.j.corriges === 0 && r.j.fusionnes >= 1,
      'c’est une FUSION, pas un refus : D n’est pas prévenue à tort', JSON.stringify(r.j));
    dire(ep(gid, 'e9').status === 'valide', 'deux décisions sur deux : validé');
    await pousse(C.jeton, [Object.assign({}, ep(gid, 'e9'), { inLibrary: true, updatedAt: tic() })]);
    dire(ep(gid, 'e9').inLibrary === false, 'C valide mais ne publie pas (droit du chef et de l’inspecteur)');
    await pousse(A.jeton, [Object.assign({}, ep(gid, 'e9'), { inLibrary: true, updatedAt: tic() })]);
    dire(ep(gid, 'e9').inLibrary === true, 'A publie');
    await pousse(A.jeton, [epreuve('pub0', { ownerId: A.id, status: 'valide', inLibrary: '0', updatedAt: tic() })]);
    dire(ep(gid, 'pub0').inLibrary === true,
      'inLibrary « "0" » de A est rangé comme le navigateur le comprend : publié (vrai en JavaScript)', JSON.stringify(ep(gid, 'pub0').inLibrary));

    console.log(`\n${G}⑤ Ce qui est déjà validé${R}`);
    const valide = ep(gid, 'e9');
    r = await pousse(B.jeton, [valide]);
    dire(ep(gid, 'e9').status === 'valide' && ep(gid, 'e9').inLibrary === true && r.j.corriges === 0,
      'B renvoie l’épreuve validée sans y toucher : rien n’est déclassé', JSON.stringify(r.j));
    await pousse(B.jeton, [Object.assign({}, valide, { nouveauChamp: 1 })]);
    dire(ep(gid, 'e9').status === 'valide',
      'un champ seulement AJOUTÉ (navigateur plus récent) ne déclasse pas une épreuve validée', ep(gid, 'e9').status);
    await pousse(B.jeton, [Object.assign({}, ep(gid, 'e9'), { status: 'brouillon', updatedAt: tic() })]);
    dire(ep(gid, 'e9').status === 'valide', 'B ne retire pas le statut d’une épreuve validée d’autrui sans y toucher');
    const avantRetouche = ep(gid, 'e9');
    await pousse(B.jeton, [Object.assign({}, avantRetouche, { title: 'Retouchée en douce' })]);
    const ret = ep(gid, 'e9');
    dire(ret.status === 'relecture' && ret.inLibrary === false && ret.revue.tour === avantRetouche.revue.tour + 1,
      'B retouche l’épreuve validée en gardant sa date : tour suivant, relecture, hors bibliothèque', JSON.stringify({ s: ret.status, t: ret.revue.tour }));
    dire(statutNavigateur(ret) === 'relecture',
      'et le navigateur, qui RECALCULE le statut depuis les décisions, n’en refait pas une épreuve validée', statutNavigateur(ret));
    await pousse(B.jeton, [Object.assign({}, ret, { updatedAt: tic(), revue: Object.assign({}, ret.revue, { tour: 1 }) })]);
    dire(ep(gid, 'e9').revue.tour === ret.revue.tour && statutNavigateur(ep(gid, 'e9')) !== 'valide',
      'B ramène le tour à celui où les relectrices avaient validé : refusé', JSON.stringify({ t: ep(gid, 'e9').revue.tour, nav: statutNavigateur(ep(gid, 'e9')) }));
    await pousse(B.jeton, [epreuve('autre', { updatedAt: tic() })]);
    dire(!!ep(gid, 'e9').id, 'un envoi qui omet une épreuve ne l’efface pas du serveur');

    console.log(`\n${G}⑥ Suppressions${R}`);
    const e9 = ep(gid, 'e9');
    const vers = Object.assign({}, e9, { status: 'valide', revue: Object.assign({}, e9.revue, { requis: 1,
      decisions: e9.revue.decisions.concat([D(A.id, 'valide', e9.revue.tour)]) }) });
    await pousse(A.jeton, [Object.assign({}, vers, { updatedAt: tic() })]);
    r = await pousse(B.jeton, [], { epSuppr: { e9: Date.now() } });
    dire(!((etatServeur(gid).epSuppr || {}).e9), 'B n’efface pas chez tous une épreuve validée', JSON.stringify(etatServeur(gid).epSuppr));
    await pousse(B.jeton, [epreuve('brB', { ownerId: B.id, updatedAt: tic() })]);
    await pousse(B.jeton, [], { epSuppr: { brB: Date.now() } });
    dire(!!((etatServeur(gid).epSuppr || {}).brB), 'B supprime son propre brouillon');
    dire(!ep(gid, 'brB').id, 'et le brouillon supprimé quitte l’état du serveur (il n’est plus renvoyé à chaque tirage)');
    await pousse(B.jeton, [epreuve('brL', { ownerId: B.id, updatedAt: tic() })]);
    await pousse(B.jeton, [], { epSuppr: { brL: Date.now() + 9e12 } });
    const tL = (etatServeur(gid).epSuppr || {}).brL || 0;
    dire(tL > 0 && tL <= Date.now() + 86400000 + 5000, 'une date de suppression dans le futur lointain est bornée', String(tL));
    const fantomes = {}; for (let i = 0; i < 500; i++) fantomes['x' + i + '_' + Math.random().toString(36).slice(2, 8)] = Date.now();
    // Envoyés par A, qui a tous les droits de suppression : seule la règle « épreuve connue » les arrête.
    await pousse(A.jeton, [], { epSuppr: fantomes });
    dire(Object.keys(etatServeur(gid).epSuppr || {}).length < 10,
      'cinq cents identifiants inconnus ne gonflent pas le registre (il bloquait la synchro à 2 Mo)', String(Object.keys(etatServeur(gid).epSuppr || {}).length));
    await pousse(A.jeton, [epreuve('brA', { ownerId: A.id, updatedAt: tic() })]);
    r = await pousse(B.jeton, [], { epSuppr: { brA: Date.now() } });
    dire(Array.isArray(r.j.suppRefusees) && r.j.suppRefusees.includes('brA') && !!ep(gid, 'brA').id,
      'B ne supprime pas le brouillon de A, et la réponse le dit (le navigateur purge son registre)', JSON.stringify(r.j));

    console.log(`\n${G}⑦ Ce que le serveur garde est ce que le navigateur affiche${R}`);
    const toutes = (etatServeur(gid).epreuves || []).filter(e => e.revue && (e.revue.decisions || []).length && e.status !== 'brouillon');
    const ecarts = toutes.filter(e => statutNavigateur(e) !== e.status).map(e => e.id + ':' + e.status + '≠' + statutNavigateur(e));
    dire(toutes.length > 0 && ecarts.length === 0, 'chaque épreuve stockée a le statut que _statutRevue en déduirait', ecarts.join(', '));

    console.log(`\n${G}⑨ Seconde relecture : retouche après validation, dates, copies${R}`);
    // L'auteur retire le statut de son épreuve validée, la retouche, la resoumet au même tour.
    const v1 = epreuve('v1', { ownerId: B.id, status: 'relecture', updatedAt: tic(), revue: { tour: 1, requis: 1, echeance: 0, decisions: [] } });
    await pousse(B.jeton, [v1]);
    await pousse(Dd.jeton, [Object.assign({}, ep(gid, 'v1'), { status: 'valide', updatedAt: tic(),
      revue: Object.assign({}, ep(gid, 'v1').revue, { decisions: [D(Dd.id, 'valide')] }) })]);
    dire(ep(gid, 'v1').status === 'valide', 'v1 validée par D');
    await pousse(B.jeton, [Object.assign({}, ep(gid, 'v1'), { status: 'brouillon', updatedAt: tic() })]);
    await pousse(B.jeton, [Object.assign({}, ep(gid, 'v1'), { status: 'relecture', title: 'CONTENU FALSIFIÉ', updatedAt: tic() })]);
    dire(ep(gid, 'v1').status !== 'valide' && statutNavigateur(ep(gid, 'v1')) !== 'valide' && ep(gid, 'v1').revue.tour === 2,
      'retirer le statut, retoucher, resoumettre au même tour : la décision de D ne valide pas l’autre texte',
      JSON.stringify({ s: ep(gid, 'v1').status, nav: statutNavigateur(ep(gid, 'v1')), t: ep(gid, 'v1').revue.tour }));
    // Date forgée très loin dans le futur.
    await pousse(A.jeton, [epreuve('v2', { ownerId: A.id, status: 'brouillon', title: 'Original', updatedAt: tic() })]);
    await pousse(B.jeton, [Object.assign({}, ep(gid, 'v2'), { title: 'DÉTRUIT', updatedAt: 9e15 })]);
    dire(ep(gid, 'v2').updatedAt <= Date.now() + 86400000 + 5000, 'une date en l’an 300 000 est écrêtée à un jour', String(ep(gid, 'v2').updatedAt));
    // Un poste en retard ne repousse pas la date du serveur (l'édition de A pendant l'aller-retour gagne).
    const t0 = ep(gid, 'v2').updatedAt;
    await pousse(A.jeton, [Object.assign({}, ep(gid, 'v2'), { title: 'A, maintenant', updatedAt: t0 + 1 })]);
    const tA = ep(gid, 'v2').updatedAt;
    r = await pousse(B.jeton, [epreuve('v2', { ownerId: A.id, title: 'vieux', updatedAt: t0 - 1000 })]);
    dire(ep(gid, 'v2').updatedAt === tA && ep(gid, 'v2').title === 'A, maintenant',
      'un envoi en retard garde la version du serveur SANS lui donner l’heure du serveur', JSON.stringify({ avant: tA, apres: ep(gid, 'v2').updatedAt }));
    // Une copie qui a gardé les décisions de l'original : retirées, sans avis de refus.
    r = await pousse(B.jeton, [Object.assign({}, ep(gid, 'v1'), { id: 'copie1', ownerId: B.id, status: 'brouillon', updatedAt: tic(),
      revue: { tour: 1, requis: 1, echeance: 0, decisions: [D(Dd.id, 'valide')] } })]);
    dire(r.j.corriges === 0 && (ep(gid, 'copie1').revue || { decisions: [] }).decisions.length === 0,
      'une copie qui a gardé les décisions de l’original : retirées, sans avis de refus', JSON.stringify(r.j));

    console.log(`\n${G}⑧ Le rôle part avec le membre${R}`);
    await poste('?action=groupe&op=retirer', { groupe: gid, membre: C.id }, A.jeton);
    const g = (lireBase().plateforme.groupes || []).find(x => x.id === gid) || {};
    dire(!(g.roles || {})[C.id], 'C retirée : son rôle de relectrice disparaît', JSON.stringify(g.roles));
  } catch (e) {
    // Un banc qui s'interrompt ne doit pas finir sans bilan : c'est un échec, et il se compte.
    dire(false, 'le banc s’est interrompu', e && e.message);
  } finally {
    if (serveur) serveur.kill();
    try { fs.rmSync(BAC, { recursive: true, force: true }); } catch (e) {}
  }
  console.log('\n' + G + ok + ' contrôle(s) au vert, ' + ko + ' au rouge.' + R + '\n');
  process.exit(ko === 0 ? 0 : 1);
})();
