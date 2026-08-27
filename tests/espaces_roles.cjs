/* ============================================================================
   VÉRITAS — Les espaces par rôle tiennent-ils leurs promesses ?
   ----------------------------------------------------------------------------
   Trois classes de défauts, toutes muettes, toutes trouvées à la main :

   1. UNE ENTRÉE DE MENU SANS ROUTE. `render()` se termine par `P[p]||pgDash` :
      une clé absente de la table `P` ne lève RIEN, elle affiche le tableau de
      bord sous le titre de la page demandée. « Évaluations en ligne » a vécu
      ainsi dans le menu élève — le libellé promettait, le clic ramenait
      l'accueil. Le symptôme est l'absence de symptôme.

   2. UNE DONNÉE DE LA BASE INJECTÉE BRUTE. Les titres d'évaluation viennent du
      panneau d'administration et partaient dans le HTML sans échappement.

   3. UN CHIFFRE INVENTÉ. « N élèves composent » s'affichait pendant une
      évaluation, tiré au sort. Règle du projet : on n'invente ni activité ni
      statistique — base vide ⇒ rien affiché.

   Ce fichier tourne sans navigateur : il EXTRAIT les fonctions d'app.js et les
   exécute avec des bouchons. Aucune dépendance.

   Lancer :  node tests/espaces_roles.cjs
   ========================================================================== */
'use strict';
const fs = require('fs');
const path = require('path');

const APP = path.join(__dirname, '..', 'app.js');
const src = fs.readFileSync(APP, 'utf8');

let echecs = 0;
const t = (cond, msg) => {
  console.log((cond ? '  ✓ ' : '  ✗ ') + msg);
  if (!cond) echecs++;
};
const titre = (s) => console.log('\n' + s);

/* ── 1. Aucune entrée de menu ne doit retomber sur le tableau de bord ─────── */
titre('1. Chaque entrée de menu mène-t-elle à sa page ?');

function blocEntre(texte, debut, fin) {
  const L = texte.split('\n');
  const i = L.findIndex((l) => l.trim() === debut);
  if (i < 0) return null;
  const j = L.findIndex((l, k) => k > i && l.trim() === fin);
  return j < 0 ? null : L.slice(i, j).join('\n');
}

const blocP = blocEntre(src, 'const P={', '};');
t(!!blocP, 'la table de routage `P` est trouvable dans app.js');

const routes = new Set(
  [...(blocP || '').matchAll(/[{,\n]\s*'?([a-zA-Z_0-9-]+)'?\s*:/g)].map((m) => m[1])
);

function menu(nom) {
  const m = src.match(new RegExp('const ' + nom + '=\\[([\\s\\S]*?)\\n\\];'));
  if (!m) return null;
  return [...m[1].matchAll(/\{k:"([a-z_0-9]+)",i:"[^"]*",l:"([^"]*)"/g)]
    .map((x) => ({ cle: x[1], libelle: x[2] }));
}

for (const [nom, role] of [['ENAV', 'élève'], ['TNAV', 'enseignant'], ['ANAV', 'admin']]) {
  const entrees = menu(nom);
  if (!entrees) { t(false, `menu ${nom} (${role}) introuvable`); continue; }
  const mortes = entrees.filter((e) => !routes.has(e.cle));
  t(mortes.length === 0,
    `${role} : ${entrees.length} entrées, ${mortes.length} sans route`
    + (mortes.length ? ' → ' + mortes.map((m) => `${m.cle} « ${m.libelle} »`).join(', ') : ''));
}

/* ── 2. Aucun chiffre fabriqué ────────────────────────────────────────────── */
titre('2. Aucun chiffre inventé n’est présenté comme réel');
// On juge le CODE, pas les commentaires : la note qui explique le retrait cite
// forcément le libellé retiré. Sans ce filtre, documenter un correctif le ferait
// échouer — et la leçon serait effacée pour faire passer le test.
const codeSeul = src
  .replace(/\/\*[\s\S]*?\*\//g, ' ')
  .replace(/^[ \t]*\/\/.*$/gm, ' ');
t(!/_evalLiveCount/.test(codeSeul),
  'le compteur simulé « N élèves composent » a disparu (générateur ET affichage)');
t(!/élèves composent/.test(codeSeul),
  'plus aucun libellé de présence fabriquée dans le code');

/* ── 3. La page des évaluations : filtrage, échappement, deux coquilles ──── */
titre('3. « Évaluations en ligne » — la page que le menu promettait');

const debut = src.indexOf('function _evalsEleveHtml(){');
const ancre = src.indexOf('function pgMesEvaluations(){');
if (debut < 0 || ancre < 0) {
  t(false, 'les fonctions _evalsEleveHtml / pgMesEvaluations sont introuvables');
} else {
  const extrait = src.slice(debut, src.indexOf('\n', ancre) + 1);

  // Bouchons : l'extrait ne dépend que de _initEvals, _vc, DB et SES.
  const bac = { DB: {}, SES: null, vcRecu: null };
  const _initEvals = () => { if (!bac.DB.evaluations) bac.DB.evaluations = []; };
  const _vc = (h) => { bac.vcRecu = h; };
  let _evalsEleveHtml, showMesEvaluations, pgMesEvaluations;
  // eslint-disable-next-line no-eval
  eval(`
    var DB = bac.DB, SES = bac.SES;
    ${extrait}
    _evalsEleveHtml = function(){ DB = bac.DB; SES = bac.SES; return (${'_evalsEleveHtml'})(); };
  `);
  // Rebranchement propre : on ré-évalue en liant DB/SES au bac à chaque appel.
  const faire = (db, ses) => {
    bac.DB = db; bac.SES = ses;
    const fn = new Function('DB', 'SES', '_initEvals', '_vc',
      extrait + '\n return {liste:_evalsEleveHtml, page:pgMesEvaluations, vitrine:showMesEvaluations};');
    return fn(db, ses, () => { if (!db.evaluations) db.evaluations = []; }, _vc);
  };

  const evals = [
    { id: 'ev1', titre: 'Devoir de Français', matiere: 'Français', classe: '3e', duree: 45, actif: true, questions: [{}, {}], reponses: [] },
    { id: 'ev2', titre: 'Maths Tle', matiere: 'Mathématiques', classe: 'Tle D', duree: 60, actif: true, questions: [{}], reponses: [] },
    { id: 'ev3', titre: 'Tous niveaux', matiere: 'Culture', classe: '', duree: 10, actif: true, questions: [{}], reponses: [] },
    { id: 'ev4', titre: 'Inactive', matiere: 'X', classe: '3e', duree: 10, actif: false, questions: [{}], reponses: [] },
    { id: 'ev5', titre: '<img src=x onerror=alert(1)>', matiere: '"><script>bad</script>', classe: '3e', duree: 5, actif: true, questions: [{}], reponses: [] },
  ];

  let api = faire({ evaluations: evals.slice() }, { type: 'eleve', id: 'E1', cls: '3e' });
  let h = api.liste();

  console.log('   — filtrage par classe (élève de 3e)');
  t(h.includes('Devoir de Fran'), 'voit l’évaluation de SA classe');
  t(!h.includes('Maths Tle'), 'ne voit PAS celle d’une autre classe');
  t(h.includes('Tous niveaux'), 'voit celle qui ne vise aucune classe');
  t(!h.includes('Inactive'), 'ne voit PAS une évaluation désactivée');

  console.log('   — échappement des libellés venus de la base');
  t(!h.includes('<img src=x'), 'un titre piégé n’est pas injecté brut');
  t(h.includes('&lt;img src=x'), '… il est échappé');
  t(!h.includes('<script>bad'), 'une matière piégée n’ouvre aucune balise');

  console.log('   — pas de faux refus');
  api = faire({ evaluations: evals.slice() }, { type: 'eleve', id: 'E2' });
  const h2 = api.liste();
  t(h2.includes('Devoir de Fran') && h2.includes('Maths Tle'),
    'session sans classe : on montre tout plutôt que rien');

  console.log('   — état vide');
  api = faire({ evaluations: [] }, { type: 'eleve', id: 'E1', cls: '3e' });
  const h3 = api.liste();
  t(h3.includes('Aucune évaluation disponible'), 'l’état vide est explicite');
  t(h3.includes('pour la classe de 3e'), '… et nomme la classe');

  console.log('   — les deux coquilles');
  api = faire({ evaluations: [{ id: 'a', titre: 'Repère', matiere: 'M', classe: '', duree: 1, actif: true, questions: [{}], reponses: [] }] },
    { type: 'eleve', id: 'E1', cls: '3e' });
  t(typeof api.page === 'function' && api.page().includes('Repère'),
    'pgMesEvaluations RETOURNE le HTML — c’est ce qu’attend render()');
  bac.vcRecu = null; api.vitrine();
  t(bac.vcRecu && bac.vcRecu.includes('Repère'),
    'showMesEvaluations INJECTE le HTML — c’est ce qu’attend la vitrine');
}

/* ── 4. Inscription : la filière vient de la table officielle ─────────────── */
titre('4. Inscription — série / section / classe');

const iSys = src.indexOf('window._AMBASSA_SYS = {');
const iReg = src.indexOf('window._regSysChange=function(){');
if (iSys < 0 || iReg < 0) {
  t(false, '_AMBASSA_SYS ou _regSysChange introuvable');
} else {
  const blocSys = src.slice(iSys, src.indexOf('\n};', iSys) + 3);
  const blocReg = src.slice(iReg, src.indexOf('\n};', iReg) + 3);

  // Bouchons DOM : le strict nécessaire pour exécuter _regSysChange.
  const n = {};
  ['rSys', 'rEns', 'rCls', 'rSerie', 'rSerieWrap'].forEach((id) => {
    n[id] = { value: '', innerHTML: '', style: { display: '' }, addEventListener() {} };
  });

  /* ── Le bouchon de « rCls » doit se comporter comme un VRAI <select> ──────
     Il ne le faisait pas, et c'est ce qui a laissé passer un bug pendant des
     mois : sur un objet nu, écrire `innerHTML` ne touche pas `value`. Dans un
     navigateur, réécrire les <option> remet SystÉMATIQUEMENT la sélection sur
     la première. _regSysChange reconstruisait la liste à chaque appel — donc
     aussi quand l'élève changeait de classe, puisqu'elle est son propre
     écouteur — et effaçait le choix à la seconde où il était fait.
     Le test restait vert parce que le bouchon, lui, retenait la valeur.
     On lui donne la sémantique du navigateur : c'est la seule façon que ce
     fichier ait une chance de rougir sur ce défaut. */
  {
    let html = '', val = '';
    const options = () => (html.match(/<option[^>]*>([^<]*)<\/option>/g) || [])
      .map((o) => o.replace(/<[^>]+>/g, ''));
    Object.defineProperty(n.rCls, 'innerHTML', {
      get: () => html,
      set: (v) => { html = v; const o = options(); val = o.length ? o[0] : ''; },
    });
    Object.defineProperty(n.rCls, 'value', {
      get: () => val,
      set: (v) => { val = options().indexOf(v) >= 0 ? v : ''; },
    });
  }
  const bac = {
    document: { getElementById: (id) => n[id] || null },
    _esc: (v) => String(v).replace(/&/g, '&amp;').replace(/</g, '&lt;'),
    CLS: ['6ème', '5ème', '4ème', '3ème', '2nde', '1ère', 'Terminale'],
    window: {},
  };
  new Function('document', '_esc', 'CLS', 'window',
    blocSys + '\n' + blocReg + '\nglobalThis.__AS = window._AMBASSA_SYS; globalThis.__reg = window._regSysChange;'
  )(bac.document, bac._esc, bac.CLS, bac.window);

  const _AMBASSA_SYS = globalThis.__AS;   // lu par _regSysChange via la portée globale
  globalThis._AMBASSA_SYS = _AMBASSA_SYS;
  const poser = (sys, ens, cls) => {
    n.rSys.value = sys; n.rEns.value = ens;
    globalThis.__reg(); n.rCls.value = cls; globalThis.__reg();
    return { visible: n.rSerieWrap.style.display !== 'none', html: n.rSerie.innerHTML };
  };

  let r = poser('fr', 'gen', 'Terminale');
  t(r.visible, 'francophone général, Terminale : la filière est demandée');
  t(/A1 \(Lettres-Latin\)/.test(r.html) && />C</.test(r.html) && />D</.test(r.html),
    '… avec les séries officielles A1 / A4 / C / D / E / TI');
  t(!poser('fr', 'gen', '6ème').visible,
    '6ème : la filière n’est pas demandée (la question n’a pas de sens)');

  r = poser('en', 'gen', 'Upper Sixth (A Level)');
  t(r.visible && /Arts/.test(r.html) && /Science/.test(r.html), 'GCE A Level : Arts / Science');
  r = poser('fr', 'tech', 'Terminale technique (BAC)');
  t(r.visible && /F2 \(Électronique\)/.test(r.html), 'technique : nomenclature officielle OBC');
  t(/<option value="">/.test(r.html),
    'la liste s’ouvre sur « — Choisir — » : aucune valeur par défaut trompeuse');

  /* ── La classe choisie doit SURVIVRE au rendu qu'elle déclenche ──────────
     _regSysChange est l'écouteur `change` du menu des classes ET la fonction
     qui reconstruit ce menu. Sans mémorisation de la valeur, choisir
     « Terminale » rappelait la fonction, qui réécrivait les <option> et
     ramenait « 6ème » — le choix de l'élève s'annulait de lui-même, et la
     filière restait fermée alors que doRegister() l'exige. */
  n.rSys.value = 'fr'; n.rEns.value = 'gen';
  globalThis.__reg();
  n.rCls.value = 'Terminale';
  globalThis.__reg();                       // ce que fait l'écouteur `change`
  t(n.rCls.value === 'Terminale',
    'la classe choisie survit au re-rendu qu’elle déclenche (pas de retour à la 1re option)');
  t(n.rSerieWrap.style.display !== 'none',
    '… et la filière s’ouvre bien pour cette classe');

  /* Une classe qui n'existe plus dans le nouveau sous-système ne doit PAS être
     conservée de force : changer pour l'anglophone doit repartir proprement. */
  n.rSys.value = 'en'; globalThis.__reg();
  t(bac.CLS.concat(Object.values(_AMBASSA_SYS).flatMap((c) => c.classes || []))
      .indexOf(n.rCls.value) >= 0,
    'changer de sous-système retombe sur une classe réellement proposée');
}
t(/_serieDemandee\s*&&\s*!_rSerie/.test(src),
  'doRegister() refuse une inscription sans filière quand elle est demandée');

/* _regSysChange n'était appelée par RIEN au premier rendu : l'écouteur du menu
   des classes n'existait donc pas tant qu'on n'avait pas touché à l'un des
   deux autres menus. Le formulaire doit l'amorcer à son ouverture. */
t(/function _regInit\(\)/.test(src) && (src.match(/_regInit\(\);/g) || []).length >= 2,
  'showRegisterForm() amorce la cascade (_regInit) sur ses deux chemins de rendu');

/* ── Verdict ─────────────────────────────────────────────────────────────── */
console.log('\n' + '─'.repeat(68));
if (echecs) {
  console.log(`  ${echecs} échec(s).`);
  process.exit(1);
}
console.log('  ✓ Les espaces par rôle tiennent : aucune entrée morte, aucun chiffre inventé.');
