/* ============================================================================
   VÉRITAS — Chaque script que la CI appelle est-il DANS le dépôt ?
   ----------------------------------------------------------------------------
   Ce contrôle existe parce que la panne s'est produite trois fois.

   La CI part d'un `actions/checkout` : elle ne voit QUE ce que git suit. Un
   fichier présent sur la machine de développement mais jamais `git add`é
   n'existe pas pour elle. Or il passe tous les essais en local — c'est
   précisément ce qui rend le défaut invisible avant le déploiement.

   Deux formes, toutes deux observées sur ce dépôt :

   1. LE SCRIPT MANQUE ET LA CI S'ARRÊTE. `node tests/banc_empreintes.cjs`
      → MODULE_NOT_FOUND, déploiement rouge au bout de 21 secondes
      (run 33118587271, 27/08/2026). Bruyant, donc réparable.

   2. LE SCRIPT MANQUE ET LA CI SE TAIT. Le même oubli derrière un
      `[ -f fichier ] && node fichier` saute la vérification SANS un mot :
      le déploiement passe au vert en ayant contrôlé une chose de moins.
      C'est le cas dangereux, et c'est pour lui que ce fichier existe.

   On lit donc le workflow, on extrait tout ce qu'il exécute depuis tests/ ou
   tools/, et on exige que git le connaisse.

   Lancer :  node tests/ci_scripts_suivis.cjs
   ========================================================================== */
'use strict';
const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');

const RACINE = path.join(__dirname, '..');
const WORKFLOW = path.join(RACINE, '.github', 'workflows', 'deploy.yml');

let echecs = 0;
const t = (cond, msg) => {
  console.log((cond ? '  \x1b[32m✓\x1b[0m ' : '  \x1b[31m✗\x1b[0m ') + msg);
  if (!cond) echecs++;
};

console.log('\n\x1b[1mChaque script appelé par la CI est-il suivi par git ?\x1b[0m\n');

const yml = fs.readFileSync(WORKFLOW, 'utf8');

/* On capture aussi bien « node tests/x.cjs » que « php tests/x.php », y compris
   derrière un `[ -f … ] &&` ou un `if [ -f … ]; then`. Le chemin est ce qui
   compte, pas la façon dont il est gardé. */
const appels = [...yml.matchAll(/\b(?:node|php)\s+((?:tests|tools)\/[A-Za-z0-9_.\/-]+\.(?:cjs|js|php|mjs))/g)]
  .map((m) => m[1]);
const uniques = [...new Set(appels)].sort();

t(uniques.length > 0, `le workflow appelle ${uniques.length} script(s) — la lecture a bien trouvé quelque chose`);

/* La liste de ce que git suit, demandée une seule fois. */
let suivis = new Set();
try {
  suivis = new Set(
    execFileSync('git', ['ls-files', 'tests', 'tools'], { cwd: RACINE, encoding: 'utf8' })
      .split('\n').map((s) => s.trim()).filter(Boolean)
  );
} catch (e) {
  t(false, 'git ls-files a échoué : ' + e.message);
}

const absents = [];
const nonSuivis = [];
for (const f of uniques) {
  const surDisque = fs.existsSync(path.join(RACINE, f));
  if (!suivis.has(f)) (surDisque ? nonSuivis : absents).push(f);
}

t(nonSuivis.length === 0,
  nonSuivis.length === 0
    ? 'aucun script appelé n’est resté hors de l’index'
    : `${nonSuivis.length} script(s) présent(s) en local mais ABSENT(S) du dépôt : ${nonSuivis.join(', ')}`);

t(absents.length === 0,
  absents.length === 0
    ? 'aucun script appelé n’est introuvable'
    : `${absents.length} script(s) appelé(s) et introuvable(s) : ${absents.join(', ')}`);

/* ── Et ce que ces scripts IMPORTENT, à leur tour ? ───────────────────────
   Indexer le banc ne suffit pas : `tests/banc_empreintes.cjs` compare une
   empreinte JavaScript à une empreinte Python et fait donc, en cours de
   route, `import normaliser_cahiers`. Ce module vit dans tools/ et n'était pas
   suivi non plus — la CI est repartie et s'est arrêtée dix lignes plus loin,
   sur un ModuleNotFoundError cette fois. Un contrôle qui s'arrête au premier
   maillon laisse le second casser le déploiement suivant. */
const dependances = [];
for (const f of uniques) {
  // On ne s'inspecte pas soi-même : ce fichier CITE des noms de modules dans
  // ses commentaires, ce qui les ferait remonter comme de fausses dépendances.
  if (f === 'tests/ci_scripts_suivis.cjs') continue;
  const p = path.join(RACINE, f);
  if (!fs.existsSync(p)) continue;
  const code = fs.readFileSync(p, 'utf8');
  for (const m of code.matchAll(/\bimport\s+([a-z_][a-z0-9_]*)/g)) {
    const mod = 'tools/' + m[1] + '.py';
    if (fs.existsSync(path.join(RACINE, mod)) && !suivis.has(mod)) dependances.push(mod + '  (importé par ' + f + ')');
  }
  for (const m of code.matchAll(/['"`]((?:tools|tests)\/[A-Za-z0-9_.\/-]+\.(?:py|cjs|js|json))['"`]/g)) {
    if (fs.existsSync(path.join(RACINE, m[1])) && !suivis.has(m[1])) dependances.push(m[1] + '  (lu par ' + f + ')');
  }
}
const depUniq = [...new Set(dependances)];
t(depUniq.length === 0,
  depUniq.length === 0
    ? 'aucune dépendance de ces bancs n’est restée hors de l’index'
    : `${depUniq.length} dépendance(s) hors du dépôt : ${depUniq.join(' · ')}`);

if (nonSuivis.length || depUniq.length) {
  const aAjouter = nonSuivis.concat(depUniq.map((d) => d.split('  ')[0]));
  console.log('\n  \x1b[33mRemède :\x1b[0m  git add ' + [...new Set(aAjouter)].join(' '));
  console.log('  Sans cela, la CI part d’un checkout qui ne les contient pas.');
}

console.log('\n  ' + uniques.length + ' script(s) contrôlé(s) :');
for (const f of uniques) console.log('    ' + (suivis.has(f) ? '·' : '!') + ' ' + f);

console.log('\n' + '─'.repeat(68));
if (echecs) {
  console.log(`  \x1b[31m\x1b[1m${echecs} échec(s) — le déploiement contrôlerait moins qu’il ne le croit.\x1b[0m`);
  process.exit(1);
}
console.log('  \x1b[32m\x1b[1m✓ Tout ce que la CI exécute existe dans le dépôt.\x1b[0m');
