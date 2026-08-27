/* Sonde du VOLET COLLABORATIF — Atelier de Français.
 *
 * Ce que l'audit du 26/08/2026 a trouvé, et que cette sonde garde
 * ---------------------------------------------------------------
 * `tests/sonde_sync_groupe.cjs` mesurait le DÉBIT et la FUSION, et rendait
 * 5/5 — sur un serveur simulé qui répondait 200 à tout. Il ne touchait ni à
 * l'appartenance, ni à l'invitation, ni aux messages. Or, éprouvé contre le
 * vrai `api/plateforme.php` avec deux comptes distincts :
 *
 *     POST ?action=etat&groupe=g1  → 200  (l'équipe naît)
 *     POST ?action=etat&groupe=g1  → 403  « Vous n'êtes pas membre »
 *     GET  ?action=etat&groupe=g1  → 403  « Ce groupe est fermé »
 *
 * Un seul envoi passait, jamais plus — pour l'auteur du groupe lui-même. Le
 * navigateur envoyait la liste des membres, et cette liste était celle des
 * PROFILS DE DÉMONSTRATION (u1…u6) : l'identifiant du compte réel n'y était
 * pas. Trois autres pans du « travail à plusieurs » ne quittaient pas non
 * plus le navigateur : les messages, les propositions de modification, et
 * l'identité de celui qui signe.
 *
 * Cette sonde parcourt donc les trois gestes que promet l'application :
 *
 *   1. créer son espace de travail, et y inviter par code ;
 *   2. modifier une épreuve à plusieurs (fusion + propositions appliquées) ;
 *   3. s'envoyer des messages qui franchissent réellement le navigateur.
 *
 * Chaque contrôle a été éprouvé PAR MUTATION : on casse la règle exprès et
 * on vérifie que la ligne rougit. Un contrôle qui reste vert quand on brise
 * ce qu'il surveille ne surveille rien.
 *
 *   node tests/sonde_collaboratif.cjs
 */
'use strict';
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const RACINE = path.resolve(__dirname, '..');
const P = f => path.join(RACINE, f);
const html = fs.readFileSync(P('plateforme/index.html'), 'utf8');
const iScript = html.indexOf('<script type="text/x-dc"');

function contexte(repondre, journal) {
  const stock = {};
  const elt = () => ({
    style: {}, dataset: {}, classList: { add() {}, remove() {}, toggle() {} },
    setAttribute() {}, removeAttribute() {}, getAttribute: () => null,
    appendChild() {}, removeChild() {}, addEventListener() {}, removeEventListener() {},
    click() {}, focus() {}, remove() {}, scrollIntoView() {},
    querySelector: () => null, querySelectorAll: () => [],
    getBoundingClientRect: () => ({ top: 0, height: 0, width: 0 }),
    set innerHTML(v) {}, get innerHTML() { return ''; }
  });
  const win = {
    MINESEC_CORPUS: null,
    localStorage: { getItem: k => (k in stock ? stock[k] : null),
      setItem: (k, v) => { stock[k] = String(v); }, removeItem: k => { delete stock[k]; } },
    matchMedia: () => ({ matches: false, addListener() {}, removeListener() {} }),
    addEventListener() {}, removeEventListener() {}, scrollTo() {},
    setTimeout, clearTimeout, setInterval, clearInterval,
    requestAnimationFrame: fn => setTimeout(fn, 0),
    location: { protocol: 'http:', hostname: 'localhost', hash: '', href: 'http://localhost/',
      pathname: '/plateforme/', origin: 'http://localhost' },
    history: { pushState() {}, replaceState() {}, back() {} },
    navigator: { userAgent: 'sonde', clipboard: { writeText: () => Promise.resolve() } },
    __VRT_API: '/api/', __VRT_TOKEN: 'JETON-SONDE'
  };
  win.document = { documentElement: elt(), head: elt(), body: elt(), hidden: false,
    createElement: () => elt(), createTextNode: () => elt(),
    getElementById: () => null, querySelector: () => null, querySelectorAll: () => [],
    addEventListener() {}, removeEventListener() {} };
  win.window = win; win.self = win;
  const ctx = vm.createContext(win);
  ctx.console = { log() {}, warn() {}, error() {} };
  ctx.TextDecoder = require('util').TextDecoder;
  ctx.AbortController = typeof AbortController !== 'undefined' ? AbortController : undefined;
  ctx.Blob = function () {}; ctx.URL = { createObjectURL: () => 'blob:', revokeObjectURL() {} };
  ctx.React = { createElement: (t, p) => ({ type: t, props: p || {} }),
    cloneElement: (e, p) => ({ type: e && e.type, props: Object.assign({}, e && e.props, p) }),
    Fragment: 'F', isValidElement: x => !!(x && x.type) };
  ctx.fetch = (url, o) => {
    const entree = { url: String(url), methode: (o && o.method) || 'GET', t: Date.now(),
                     corps: (() => { try { return JSON.parse((o && o.body) || 'null'); }
                                     catch (e) { return null; } })() };
    journal.push(entree);
    const r = repondre(String(url), o, entree);
    if (!r) return new Promise(() => {});
    if (r.rejet) return Promise.reject(r.rejet);
    return Promise.resolve({ ok: r.status ? r.status < 300 : true, status: r.status || 200,
      json: () => Promise.resolve(r.corps), body: null });
  };
  vm.runInContext(
    'class DCLogic{constructor(p){this.props=p||{};this.state={};}' +
    'setState(x,a){const d=(typeof x==="function")?x(this.state):x;' +
    'this.state=Object.assign({},this.state,d||{});if(typeof a==="function")a();}}',
    ctx, { filename: 'dclogic.js' });
  ['texte', 'minesec', 'conformite', 'exercices', 'docx'].forEach(n =>
    vm.runInContext(fs.readFileSync(P('plateforme/' + n + '.js'), 'utf8'), ctx, { filename: n + '.js' }));
  vm.runInContext(html.slice(iScript).replace(/^[\s\S]*?>/, '').replace(/<\/script>[\s\S]*$/, ''),
    ctx, { filename: 'index.html#x-dc' });
  return ctx;
}

/* Un texte du corpus, avec de vraies questions : les propositions portent
   sur une question précise, il en faut donc au moins une. */
const CORPUS = [{ n: 1, words: 40, text: 'un texte', reference: 'Anonyme',
  comprehension: '1) Qui raconte ? 2) A quel temps ?',
  exploitation: '1) Redige un paragraphe.',
  type: 'NARRATIF', cycle: 'PREMIER CYCLE', group: 'Module 1',
  _partiel: false, _libre: true }];

function atelier(repondre) {
  const journal = [];
  const ctx = contexte(repondre, journal);
  ctx.window.MINESEC_CORPUS = CORPUS.map(t => Object.assign({}, t));
  const C = vm.runInContext('Component', ctx);
  const a = new C({});
  a.__journal = journal;
  a.__ctx = ctx;
  return a;
}

const resultats = [];
const attendre = ms => new Promise(r => setTimeout(r, ms));
function juger(nom, ok, vu) {
  resultats.push({ nom, ok, vu });
  console.log('  ' + (ok ? '[ OK ]' : '[ KO ]') + ' ' + nom + '\n         → ' + vu);
}
const appels = (a, motif, methode) => a.__journal.filter(
  x => motif.test(x.url) && (!methode || x.methode === methode));

/* Serveur simulé d'équipes : il tient la même règle que api/plateforme.php —
   l'appartenance est décidée par LUI, à partir de l'identifiant de compte. */
function serveurEquipes(opts) {
  opts = opts || {};
  const etat = { groupes: [], etats: {}, moi: opts.moi || 'accA' };
  return function (url, o, entree) {
    const q = String(url);
    const corps = entree.corps || {};
    if (/op=lister/.test(q)) {
      return { status: 200, corps: { ok: true,
        groupes: etat.groupes.filter(g => g.membres.indexOf(etat.moi) >= 0) } };
    }
    if (/op=creer/.test(q)) {
      const g = { id: 'eq_' + (etat.groupes.length + 1), nom: corps.nom || 'Mon établissement',
        code: 'KBMR-48' + (etat.groupes.length + 1), type: 'ferme',
        proprietaire: etat.moi, membres: [etat.moi], places: 15,
        annuaire: { [etat.moi]: { nom: 'Alice Fotso' } } };
      etat.groupes.push(g);
      return { status: 200, corps: { ok: true, cree: true, groupe: g } };
    }
    if (/op=rejoindre/.test(q)) {
      const g = etat.groupes.find(x => x.code === String(corps.code || '').toUpperCase());
      if (!g) return { status: 200, corps: { ok: true, rejoint: false,
        error: 'Ce code ne correspond à aucune équipe.', code: 'code_inconnu' } };
      if (g.membres.indexOf(etat.moi) < 0) g.membres.push(etat.moi);
      g.annuaire = Object.assign({}, g.annuaire, { [etat.moi]: { nom: 'Bob Etoa' } });
      return { status: 200, corps: { ok: true, rejoint: true, groupe: g } };
    }
    if (/action=etat/.test(q)) {
      const gid = (/groupe=([^&]+)/.exec(q) || [])[1] || '';
      const g = etat.groupes.find(x => x.id === gid);
      if (!g) return { status: 404, corps: { ok: false, code: 'groupe_inconnu' } };
      if (g.membres.indexOf(etat.moi) < 0) return { status: 403, corps: { ok: false } };
      if (entree.methode === 'GET') {
        return { status: 200, corps: { ok: true, etat: etat.etats[gid] || null,
          groupe: g, annuaire: g.annuaire } };
      }
      const rev = ((etat.etats[gid] || {}).revision || 0) + 1;
      etat.etats[gid] = { contenu: corps.etat, revision: rev, majPar: etat.moi };
      return { status: 200, corps: { ok: true, revision: rev } };
    }
    return { status: 200, corps: { ok: true } };
  };
}

(async () => {
  console.log('\n  SONDE DU VOLET COLLABORATIF — Atelier de Français\n');

  /* ─── 1. SANS ÉQUIPE, RIEN NE PART ─────────────────────────────────────
     L'état de départ portait une équipe écrite en dur (`g1`, code
     `LBY-2026`, membres u1…u6). Toutes les installations poussaient donc
     dans le MÊME casier serveur. */
  {
    const a = atelier(serveurEquipes());
    juger('Aucune équipe n’est inventée au démarrage',
      (a.state.groupes || []).length === 0 && !a._groupeActif(),
      (a.state.groupes || []).length + ' équipe(s), groupe actif « '
        + (a._groupeActif() || '(aucun)') + ' »');

    a.state.epreuves = [{ id: 'e1', title: 'seul', updatedAt: 1 }];
    a._persist();
    a._syncTirer();
    await attendre(5200);
    juger('Sans équipe, aucune requête de synchronisation ne part',
      appels(a, /action=etat/).length === 0,
      appels(a, /action=etat/).length + ' requête(s) — chacune irait dans le casier d’autrui');
  }

  /* ─── 2. CRÉER SON ESPACE DE TRAVAIL ───────────────────────────────── */
  {
    const a = atelier(serveurEquipes());
    a._creerEquipe('Lycée de Douala');
    await attendre(200);
    const g = (a.state.groupes || [])[0] || {};
    juger('Créer un espace de travail passe par le serveur et rend un code',
      appels(a, /op=creer/, 'POST').length === 1 && !!g.id && /^[A-Z]{4}-\d{3}$/.test(g.code || ''),
      'équipe « ' + (g.nom || '—') + ' », code ' + (g.code || '(aucun)'));
    juger('Le nouvel espace devient l’équipe active',
      a._groupeActif() === g.id, 'groupe actif : ' + (a._groupeActif() || '(aucun)'));
    await attendre(5200);
    juger('Le premier instantané part aussitôt (l’équipe ne naît pas vide)',
      appels(a, /action=etat/, 'POST').length >= 1,
      appels(a, /action=etat/, 'POST').length + ' envoi(s) après création');
  }

  /* ─── 3. REJOINDRE PAR CODE ────────────────────────────────────────────
     `_rejoindreEquipe` cherchait le code dans la liste LOCALE. L'invité ne
     l'a jamais : le message « Ce code ne correspond à aucune équipe connue »
     tombait sur tout le monde, et l'invitation n'a jamais pu fonctionner. */
  {
    const srv = serveurEquipes({ moi: 'accA' });
    const hote = atelier(srv);
    hote._creerEquipe('Lycée de Douala');
    await attendre(150);
    const code = (hote.state.groupes[0] || {}).code;

    /* L'invité : un AUTRE navigateur, qui n'a jamais entendu parler de
       cette équipe. C'est tout le point du contrôle. */
    const equipeHote = hote.state.groupes[0];
    const invite = atelier(function (url, o, e) {
      const q = String(url);
      if (/op=lister/.test(q)) return { status: 200, corps: { ok: true, groupes: [] } };
      if (/op=rejoindre/.test(q)) {
        const saisi = String(((e.corps || {}).code) || '').toUpperCase();
        if (saisi !== equipeHote.code) {
          return { status: 200, corps: { ok: true, rejoint: false,
            error: 'Ce code ne correspond à aucune équipe.', code: 'code_inconnu' } };
        }
        return { status: 200, corps: { ok: true, rejoint: true, groupe: {
          id: equipeHote.id, nom: equipeHote.nom, code: equipeHote.code, type: 'ferme',
          proprietaire: 'accA', membres: ['accA', 'accB'], places: 15,
          annuaire: { accA: { nom: 'Alice Fotso' }, accB: { nom: 'Bob Etoa' } } } } };
      }
      if (/action=etat/.test(q) && e.methode === 'GET') {
        /* Le serveur rend le groupe COMPLET (nom, code, places compris) :
           le navigateur remplace le sien par celui-ci à chaque relecture.
           Rendre ici un objet partiel, comme le faisait ce simulateur, a
           révélé que `places` retombait à 1 côté serveur — une équipe
           Collège de quinze places s'affichait « 2 membres sur 1 place ». */
        return { status: 200, corps: { ok: true, etat: null,
          groupe: { id: equipeHote.id, nom: equipeHote.nom, code: equipeHote.code,
            type: 'ferme', proprietaire: 'accA', membres: ['accA', 'accB'], places: 15 },
          annuaire: { accA: { nom: 'Alice Fotso' }, accB: { nom: 'Bob Etoa' } } } };
      }
      return { status: 200, corps: { ok: true, revision: 1 } };
    });
    juger('L’invité ne connaît AUCUNE équipe avant de saisir le code',
      (invite.state.groupes || []).length === 0,
      (invite.state.groupes || []).length + ' équipe(s) en local');

    invite._rejoindreEquipe(code);
    await attendre(250);
    const rejoint = (invite.state.groupes || [])[0] || {};
    juger('Rejoindre par code interroge le serveur et aboutit',
      appels(invite, /op=rejoindre/, 'POST').length === 1
        && rejoint.id === hote.state.groupes[0].id
        /* Le nom et le nombre de places doivent SURVIVRE à la relecture qui
           suit immédiatement : elle remplace le groupe local par celui du
           serveur, et un objet appauvri effacerait les deux. */
        && rejoint.nom === 'Lycée de Douala' && Number(rejoint.places) === 15,
      'code ' + code + ' → « ' + (rejoint.nom || 'REFUSÉ') + ' », '
        + rejoint.places + ' place(s) · ' + (invite.state.invMsgTon || '—'));
    juger('L’annuaire du serveur nomme les collègues',
      (invite.state.users || []).some(u => u.name === 'Alice Fotso'),
      'noms connus : ' + (invite.state.users || []).map(u => u.name).slice(-2).join(', '));

    const mauvais = atelier(srv);
    mauvais._rejoindreEquipe('ZZZZ-999');
    await attendre(200);
    juger('Un code inconnu est refusé avec un message, sans rien casser',
      (mauvais.state.groupes || []).length === 0 && mauvais.state.invMsgTon === 'ko',
      '« ' + String(mauvais.state.invMsg || '').slice(0, 58) + '… »');
  }

  /* ─── 4. LES MESSAGES FRANCHISSENT LE NAVIGATEUR ───────────────────────
     `_syncContenu` ne partageait que {epreuves, cours, annot}. Écrire à son
     équipe revenait à s'écrire à soi-même. */
  {
    const a = atelier(serveurEquipes());
    a._creerEquipe('Lycée de Douala');
    await attendre(150);
    a.state.convs = [{ id: 'team', nom: 'Équipe de français', cree: 1 }];
    a.state.convId = 'team';
    a.state.msgsByConv = { team: [{ id: 'm1', userId: 'accA', text: 'Bonjour', ts: 1000 }] };
    a._persist();
    await attendre(5200);
    const envoi = appels(a, /action=etat/, 'POST').slice(-1)[0] || {};
    const partis = (((envoi.corps || {}).etat || {}).msgs || {}).team || [];
    juger('Un message envoyé part vraiment vers l’équipe',
      partis.length === 1 && partis[0].text === 'Bonjour',
      partis.length + ' message(s) dans l’instantané');
    juger('Les propositions et les fils de discussion partent aussi',
      !!((envoi.corps || {}).etat || {}).props && !!((envoi.corps || {}).etat || {}).convs,
      'clés partagées : ' + Object.keys((envoi.corps || {}).etat || {}).join(', '));
  }

  /* ─── 5. UN MESSAGE REÇU S'AJOUTE, IL N'ÉCRASE PAS ─────────────────────
     Deux collègues qui écrivent dans la même minute ont dit deux choses.
     « Le dernier gagne » en effacerait une. */
  {
    const mien = { id: 'm1', userId: 'accA', text: 'le mien', ts: 1000 };
    const sien = { id: 'm2', userId: 'accB', text: 'le sien', ts: 1100 };
    const a = atelier((url, o, e) => {
      if (/op=lister/.test(String(url))) {
        return { status: 200, corps: { ok: true, groupes: [{ id: 'eq_1', nom: 'E', code: 'AAAA-111',
          type: 'ferme', proprietaire: 'accA', membres: ['accA', 'accB'], places: 15,
          annuaire: { accA: { nom: 'Alice' }, accB: { nom: 'Bob' } } }] } };
      }
      if (/action=etat/.test(String(url)) && e.methode === 'GET') {
        return { status: 200, corps: { ok: true, revision: 9,
          etat: { revision: 9, contenu: { epreuves: [], cours: [], annot: {},
            convs: [{ id: 'team', nom: 'Équipe', cree: 1 }],
            msgs: { team: [sien] }, props: {} } },
          groupe: { id: 'eq_1', membres: ['accA', 'accB'] },
          annuaire: { accB: { nom: 'Bob Etoa' } } } };
      }
      return { status: 200, corps: { ok: true, revision: 1 } };
    });
    a.state.groupes = [{ id: 'eq_1', membres: ['accA', 'accB'] }];
    a.state.groupeId = 'eq_1';
    a.state.msgsByConv = { team: [mien] };
    a._syncTirer();
    await attendre(200);
    const fil = (a.state.msgsByConv || {}).team || [];
    juger('Le message d’un collègue arrive sans effacer le sien',
      fil.length === 2 && fil[0].text === 'le mien' && fil[1].text === 'le sien',
      'fil après fusion : ' + fil.map(m => m.text).join(' | '));

    /* Rejoué : la relecture suivante ne doit pas dupliquer. */
    a._syncRev = null;
    a._syncTirer();
    await attendre(200);
    const fil2 = (a.state.msgsByConv || {}).team || [];
    juger('Une relecture ne duplique pas les messages déjà vus',
      fil2.length === 2, fil2.length + ' message(s) après seconde relecture');
  }

  /* ─── 6. MODIFIER UNE ÉPREUVE À PLUSIEURS ──────────────────────────────
     La carte annonçait « Acceptée · appliquée à l'édition ». `_setProp` ne
     changeait que le statut : le texte de l'épreuve ne bougeait pas. */
  {
    const a = atelier(serveurEquipes());
    a.state.epreuves = [{ id: 'e1', title: 'Devoir', textIds: [1], consigne: 'Ancienne consigne.',
      status: 'brouillon', ownerId: 'accA', editorIds: [], customQ: {}, comments: [],
      activity: [], updatedAt: 1 }];
    a.state.activeId = 'e1';

    juger('Une proposition peut enfin être CRÉÉE',
      a._proposerModif({ cible: 'consigne', target: 'Consigne générale',
        ctx: '', del: 'Ancienne consigne.', ins: 'Nouvelle consigne.' }) === true,
      ((a.state.proposals || {}).e1 || []).length + ' proposition(s) sur l’épreuve');

    const pid = ((a.state.proposals || {}).e1 || [])[0].id;
    a._setProp(pid, 'accepted');
    await attendre(120);
    const ep = a.state.epreuves.find(e => e.id === 'e1');
    juger('Accepter une proposition MODIFIE réellement l’épreuve',
      ep.consigne === 'Nouvelle consigne.',
      'consigne après acceptation : « ' + ep.consigne + ' »');

    const p = ((a.state.proposals || {}).e1 || [])[0];
    juger('La proposition est marquée comme appliquée',
      p.status === 'accepted' && p.applique === true,
      'statut ' + p.status + ', appliquée : ' + p.applique);

    /* Sur une QUESTION, pas seulement sur la consigne. */
    const f = a.all.find(x => x.n === 1);
    const avant = a._qList(f, 'comp')[0];
    a._proposerModif({ cible: 'question', n: 1, kind: 'comp', idx: 0,
      target: 'Texte n°1 · Q1', ctx: '', del: avant, ins: 'Qui raconte cette histoire ?' });
    const pid2 = ((a.state.proposals || {}).e1 || [])[0].id;
    a._setProp(pid2, 'accepted');
    await attendre(120);
    juger('Une proposition sur une question s’applique à la question',
      a._qList(a.all.find(x => x.n === 1), 'comp')[0] === 'Qui raconte cette histoire ?',
      'question 1 : « ' + a._qList(a.all.find(x => x.n === 1), 'comp')[0] + ' »');
  }

  /* ─── 7. L'IDENTITÉ EST CELLE DU COMPTE, PLUS « u1 » ───────────────────
     Deux enseignants d'une même équipe étaient tous deux `u1` : le travail
     de l'un redescendait chez l'autre signé du nom du lecteur. */
  {
    const a = atelier(serveurEquipes());
    juger('Avant connexion, l’identité est un profil de démonstration',
      /^u\d+$/.test(a.state.currentUserId), 'currentUserId = ' + a.state.currentUserId);

    a.state.epreuves = [{ id: 'e1', title: 'mon travail', ownerId: 'u1', editorIds: [],
      comments: [{ id: 'c1', userId: 'u1', text: 'ma remarque', ts: 1 }],
      activity: [{ userId: 'u1', text: 'a créé', ts: 1 }], updatedAt: 1 }];
    a._adopterIdentite('accA', 'Alice Fotso');
    juger('Après connexion, on EST son compte VÉRITAS',
      a.state.currentUserId === 'accA' && a._me().name === 'Alice Fotso',
      'currentUserId = ' + a.state.currentUserId + ' (' + a._me().name + ')');

    const ep = a.state.epreuves[0];
    juger('Le travail déjà fait sur ce poste est ré-attribué au compte',
      ep.ownerId === 'accA' && ep.comments[0].userId === 'accA'
        && ep.activity[0].userId === 'accA',
      'propriétaire ' + ep.ownerId + ', remarque ' + ep.comments[0].userId);

    /* Un SECOND compte sur le même poste ne s'approprie pas le premier. */
    a._adopterIdentite('accB', 'Bob Etoa');
    juger('Un second compte ne s’approprie pas le travail du premier',
      a.state.epreuves[0].ownerId === 'accA',
      'propriétaire resté ' + a.state.epreuves[0].ownerId + ' alors que Bob est connecté');
  }

  /* ─── 8. LE DÉBIT RESTE BORNÉ ──────────────────────────────────────────
     LWS bannit l'IP à six mauvaises requêtes par minute, et cette sanction
     ferme le site ENTIER. Régression du garde-fou déjà en place. */
  {
    const a = atelier(serveurEquipes());
    a.state.groupes = [{ id: 'eq_1', membres: ['accA'] }];
    a.state.groupeId = 'eq_1';
    for (let i = 0; i < 20; i++) {
      a.state.epreuves = [{ id: 'e1', updatedAt: Date.now() + i }];
      a._persist();
    }
    await attendre(6000);
    const n = appels(a, /action=etat/, 'POST').length;
    juger('Vingt mutations d’affilée ne produisent qu’un envoi',
      n <= 1, n + ' envoi(s) pour 20 mutations');
  }

  /* ─── 9. REFUS ET DISPARITION SE TRAITENT DIFFÉREMMENT ────────────────
     Un 404 sur une équipe supprimée doit lâcher la référence : sinon le
     poste interroge un casier disparu toutes les 90 s, indéfiniment. */
  {
    const a = atelier(() => ({ status: 404, corps: { ok: false, code: 'groupe_inconnu' } }));
    a.state.groupes = [{ id: 'eq_mort', membres: ['accA'] }];
    a.state.groupeId = 'eq_mort';
    a._syncTirer();
    await attendre(200);
    juger('Une équipe disparue est oubliée, pas interrogée sans fin',
      !a._groupeActif() && (a.state.groupes || []).length === 0,
      'groupe actif après 404 : « ' + (a._groupeActif() || '(aucun)') + ' »');

    const b = atelier(() => ({ status: 403, corps: { ok: false, code: 'non_membre' } }));
    b.state.groupes = [{ id: 'eq_1', membres: ['accA'] }];
    b.state.groupeId = 'eq_1';
    b.state.epreuves = [{ id: 'e1', title: 'mon travail', updatedAt: 1 }];
    b._persist();
    await attendre(6000);
    juger('Un refus ne perd rien et ne déclenche aucune rafale',
      (b.state.epreuves[0] || {}).title === 'mon travail'
        && appels(b, /action=etat/, 'POST').length <= 1
        && b.state.syncEtat === 'refus',
      'travail conservé, ' + appels(b, /action=etat/, 'POST').length
        + ' tentative(s), état « ' + b.state.syncEtat + ' »');
  }

  /* ─── 10. AUCUN TÉMOIN D'ACTIVITÉ FABRIQUÉ ────────────────────────────
     « X est en train d'écrire… » était câblé sur `true` : il s'affichait en
     permanence, même seul dans l'équipe. */
  {
    const a = atelier(serveurEquipes());
    const v = a.renderVals ? a.renderVals() : null;
    juger('Aucune frappe de collègue n’est simulée',
      v ? v.chatTyping === false : false,
      v ? ('chatTyping = ' + v.chatTyping) : 'renderVals introuvable');
    juger('Sans équipe, la liste des membres ne montre que soi',
      v ? (v.membersView || []).length === 1 : false,
      v ? ((v.membersView || []).length + ' membre(s) affiché(s)') : '—');

    /* Les messages de démonstration sont signés « Paul Etoa », « Jacques
       Takou ». Ils ne partent jamais au serveur — ils n'ont pas
       d'identifiant — mais les LIRE dans le fil d'une équipe qui ne compte
       ni l'un ni l'autre laissait croire à une activité qui n'existait pas. */
    const b = atelier(serveurEquipes());
    const avant = b.renderVals ? (b.renderVals().chatMessages || []).length : -1;
    b.state.compteId = 'accA';
    const apres = b.renderVals ? (b.renderVals().chatMessages || []).length : -1;
    juger('Les messages de démonstration disparaissent dès qu’un compte est connecté',
      avant === 3 && apres === 0,
      'visite guidée : ' + avant + ' message(s) · compte connecté : ' + apres);
  }

  const ok = resultats.filter(r => r.ok).length;
  console.log('\n  ' + ok + '/' + resultats.length + ' contrôles passés\n');
  if (ok !== resultats.length) {
    console.log('  Échecs :');
    resultats.filter(r => !r.ok).forEach(r => console.log('    · ' + r.nom));
    console.log('');
  }
  process.exit(ok === resultats.length ? 0 : 1);
})();
