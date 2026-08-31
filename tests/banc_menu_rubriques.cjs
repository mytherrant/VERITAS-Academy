#!/usr/bin/env node
/* ════════════════════════════════════════════════════════════════════════════
   tests/banc_menu_rubriques.cjs — LE MENU ANNONCE TOUT CE QUI EXISTE
   © 2024-2026 Jacques Miterand TAKOU (Mythe Errant).

     node tests/banc_menu_rubriques.cjs

   CE QU'IL PROTÈGE
   Le 31/08/2026, le menu « Plus » comptait 26 entrées. Sept services publiés,
   indexés et alimentés n'y figuraient pas — dont l'**Atelier de Français**,
   un produit vendu aux enseignants dont le seul chemin connu était le lien
   direct envoyé aux collègues. Un visiteur ne pouvait les atteindre qu'en
   connaissant leur URL. Jacques : « app engloutit toujours certaines pages,
   le visiteur ne saura jamais qu'elles existent ».

   Un service qu'on publie sans l'annoncer coûte exactement ce qu'il a coûté
   à produire, et ne rapporte rien.

   CE QUE LE BANC EXIGE
   1. La page servie présente EXACTEMENT le menu que la table déclare — une
      entrée ajoutée à `build_vitrine.js` et jamais reportée serait invisible.
   2. Chaque destination existe : fichier présent, ou route connue d'app.js.
   3. Chaque sommaire public est annoncé quelque part — menu ou plan du site.
   4. Le menu n'avance aucun prix plancher tant que deux listes de tarifs
      enseignant coexistent (1 000 F en base, 800 F dans api/plateforme.php).
   ════════════════════════════════════════════════════════════════════════ */
'use strict';
const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');

const RACINE = path.resolve(__dirname, '..');
const V = '\x1b[32m✓\x1b[0m', X = '\x1b[31m✗\x1b[0m', G = '\x1b[1m', R = '\x1b[0m';
let ok = 0, ko = 0;
const dire = (b, m, d) => {
  b ? ok++ : ko++;
  console.log('  ' + (b ? V : X) + ' ' + m + (!b && d ? '  → ' + d : ''));
};

console.log(`\n${G}LE MENU ANNONCE TOUT CE QUI EXISTE${R}\n`);

const vitrine = fs.readFileSync(path.join(RACINE, 'vitrine.html'), 'utf8');

/* ── ① La page servie porte le menu que la table déclare ────────────────── */
console.log(`${G}① La page servie porte le menu de la table${R}`);
{
  let sortie = '', code = 0;
  try {
    sortie = execFileSync('node', [path.join(RACINE, 'tools', 'maj_menu_vitrine.js'), '--verifier'],
      { cwd: RACINE, encoding: 'utf8' });
  } catch (e) { code = 1; sortie = String((e.stdout || '') + (e.stderr || '')); }
  dire(code === 0, 'la table de build_vitrine.js est bien reportée dans vitrine.html',
    sortie.trim().split('\n').slice(0, 2).join(' / '));
}

/* ── ② Les entrées du menu servi ────────────────────────────────────────── */
const deb = vitrine.indexOf('id="vrtPlus"');
const bloc = vitrine.slice(deb, vitrine.indexOf('vmn vmn-mob', deb));
const entrees = [];
const re = /<(?:button|a)[^>]*?(?:href="([^"]*)"|data-go="([a-z]+)")[^>]*>[\s\S]{0,500}?<span class="vmn-x">([^<]*)<small>([^<]*)<\/small>/g;
let m;
while ((m = re.exec(bloc))) entrees.push({ h: m[1] || '', vp: m[2] || '', t: m[3], d: m[4] });

console.log(`\n${G}② Chaque entrée mène quelque part de réel${R}`);
dire(entrees.length >= 30, entrees.length + ' entrées lues dans la page servie');

const appJs = fs.readFileSync(path.join(RACINE, 'app.js'), 'utf8');

/* Les deux tables de routage d'app.js, isolées une fois pour toutes. Les
   chercher dans les 3,4 Mo du fichier entier ferait passer pour une route
   n'importe quelle occurrence du mot ailleurs dans le code. */
const routes = (() => {
  const s = appJs.indexOf('var SECTIONS = [');
  const f = appJs.indexOf('var FONCTIONS = {');
  if (s < 0 || f < 0) {
    console.log('  ' + X + ' tables de routage introuvables dans app.js'); ko++;
    return { sections: '', fonctions: '' };
  }
  return {
    sections: appJs.slice(s, appJs.indexOf('];', s)),
    fonctions: appJs.slice(f, appJs.indexOf('\n  };', f))
  };
})();
const morts = [], ancresInconnues = [];
for (const e of entrees) {
  if (!e.h) continue;                                  // bouton d'écran interne
  if (/^(https?:|mailto:|tel:)/.test(e.h)) continue;
  const [chemin, ancre] = e.h.split('#');
  if (chemin && chemin !== 'app.html') {
    const p = chemin.endsWith('/') ? chemin + 'index.html' : chemin;
    if (!fs.existsSync(path.join(RACINE, p))) morts.push(e.t + ' → ' + e.h);
  } else if (ancre) {
    /* Une ancre d'application doit correspondre à une route connue : sinon
       l'entrée ouvre l'application sur son accueil, en silence.
       ⚠️ Deux tables, deux écritures. `SECTIONS` est un tableau de chaînes
       ('evaluations' n'y est PAS) ; `FONCTIONS` est un objet dont les clés
       sont NUES (`evaluations:'showEvaluations'`). Chercher seulement la
       forme entre apostrophes déclarait morte une ancre parfaitement
       vivante — c'est ce qu'a fait la première version de ce banc. */
    const enSection = new RegExp("'" + ancre + "'").test(routes.sections);
    const enFonction = new RegExp('(?:^|[{,\\s])' + ancre + '\\s*:').test(routes.fonctions);
    if (!enSection && !enFonction) ancresInconnues.push(e.t + ' → #' + ancre);
  }
}
dire(morts.length === 0, 'aucune entrée ne pointe un fichier absent', morts.join(', '));
dire(ancresInconnues.length === 0,
  'chaque ancre d’application correspond à une route connue', ancresInconnues.join(', '));

/* ── ③ Aucun service public n'est laissé hors des chemins ───────────────── */
console.log(`\n${G}③ Aucun service publié n'est laissé sans annonce${R}`);
{
  const suivis = execFileSync('git', ['ls-files'], { cwd: RACINE, encoding: 'utf8' }).split('\n');
  /* Un « sommaire » = l'index d'un dossier public de premier niveau. */
  const HORS = new Set(['tests', 'tools', 'legal', 'api', 'chunks', 'assets', 'data', 'uploads', 'd']);
  const hubs = [...new Set(suivis
    .filter(p => p.endsWith('/index.html') && p.split('/').length === 2)
    .map(p => p.split('/')[0]))].filter(d => !HORS.has(d));

  const plan = fs.readFileSync(path.join(RACINE, 'plan.html'), 'utf8');
  const citeMenu = d => bloc.indexOf('"' + d + '/"') > 0 || bloc.indexOf('/' + d + '/"') > 0;
  const citePlan = d => plan.indexOf('"' + d + '/"') > 0 || plan.indexOf('/' + d + '/"') > 0;

  const orphelins = hubs.filter(d => !citeMenu(d) && !citePlan(d));
  dire(orphelins.length === 0,
    'les ' + hubs.length + ' sommaires publics sont annoncés (menu ou plan)',
    'sans aucun chemin : ' + orphelins.join(', '));

  /* Les sept rattrapés le 31/08 : on les nomme, pour qu'un remaniement de la
     table ne les laisse pas retomber en silence. */
  for (const d of ['plateforme', 'eleve', 'enseignant', 'livrets', 'flash', 'adopter']) {
    if (hubs.indexOf(d) < 0) continue;
    dire(citeMenu(d), '« ' + d + '/ » a bien son entrée de menu');
  }
  dire(bloc.indexOf('plan.html') > 0, 'et le plan du site est atteignable depuis le menu');
}

/* ── ④ Pas de prix plancher tant que deux listes coexistent ─────────────── */
console.log(`\n${G}④ Le menu n'avance pas un prix que deux listes contredisent${R}`);
{
  const planchers = entrees.filter(e => /D[èe]s\s*[0-9]/i.test(e.d) || /D[èe]s\s*[0-9]/i.test(e.t));
  dire(planchers.length === 0,
    'aucune entrée n’annonce « Dès N F » — l’arbitrage entre 1 000 F (base) et 800 F (Atelier) reste à faire',
    planchers.map(e => e.t + ' : ' + e.d).join(', '));
}

console.log(`\n${G}${ok} contrôle(s) au vert, ${ko} au rouge.${R}\n`);
process.exit(ko === 0 ? 0 : 1);
