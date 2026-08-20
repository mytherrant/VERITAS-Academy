/* tests/grille_tarifaire.cjs — la grille par public cible atteint-elle les
 * bases DEJA CREEES ?
 *
 * defaultDB() n'est joue qu'a la premiere ouverture. Une offre ecrite la et
 * nulle part ailleurs n'existe donc que pour une installation neuve : la
 * production, elle, tourne sur une base vieille de plusieurs mois. C'est
 * _migrateDB qui doit la completer, et ce test verifie qu'elle le fait sans
 * rien ecraser.
 *
 * Le code n'est pas recopie : il est EXTRAIT d'app.js et execute tel quel.
 * Un test rejouant une copie de la logique ne prouverait rien du fichier
 * reellement deploye.
 *
 * Lancer : node tests/grille_tarifaire.cjs   (depuis la racine du depot)
 */
const fs = require('fs');
const src = fs.readFileSync('app.js', 'utf8');

/* — 1. Extraire defaultDB() en comptant les accolades — */
function extraire(nom, source) {
  const i = source.indexOf('function ' + nom + '(');
  if (i < 0) throw new Error(nom + ' introuvable');
  let p = source.indexOf('{', i), n = 0, j = p;
  for (; j < source.length; j++) {
    const c = source[j];
    if (c === '{') n++;
    else if (c === '}') { n--; if (n === 0) { j++; break; } }
  }
  return source.slice(i, j);
}

const codeDefault = extraire('defaultDB', src);

/* — 2. Extraire le bloc de migration de la grille, tel qu'il est écrit — */
const debut = src.indexOf('/* ── GRILLE PAR PUBLIC CIBLE');
const fin = src.indexOf("catch(e){ console.warn('[migration grille tarifaire]', e); }", debut);
if (debut < 0 || fin < 0) throw new Error('bloc de migration introuvable');
const codeMigration = src.slice(debut, fin + "catch(e){ console.warn('[migration grille tarifaire]', e); }".length);

/* — 3. Une base ANCIENNE : six plans, aucun champ `public` — */
globalThis.window = globalThis.window || {};
const aides = "function gid(){return 'x'+Math.random().toString(36).slice(2,8);}function today(){return '20/08/2026';}";
const defaultDB = new Function('window', aides + codeDefault + '; return defaultDB;')(globalThis.window);
const neuf = defaultDB();
const DB = {
  elearning: {
    plans: JSON.parse(JSON.stringify(neuf.elearning.plans.slice(0, 6)))
      .map(p => { delete p.public; if (p.id === 'plan3') { p.prix = 5000; p.nom = 'ENSEIGNANT'; } return p; }),
    categories: [], contenus: [], abonnements: [], commandes: []
  }
};

console.log('AVANT  : ' + DB.elearning.plans.length + ' plans, ' +
  DB.elearning.plans.filter(p => p.public).length + ' classes par public, ' +
  'enseignant annuel = ' + DB.elearning.plans.find(p => p.id === 'plan3').prix + ' F');

/* — 4. Jouer la migration réelle — */
new Function('DB', 'defaultDB', 'console', codeMigration)(DB, defaultDB, console);

const pl = DB.elearning.plans;
const parPublic = {};
pl.forEach(p => { parPublic[p.public || '(aucun)'] = (parPublic[p.public || '(aucun)'] || 0) + 1; });

console.log('APRES  : ' + pl.length + ' plans, ' +
  pl.filter(p => p.public).length + ' classes par public, ' +
  'enseignant annuel = ' + pl.find(p => p.id === 'plan3').prix + ' F');
console.log('         repartition : ' + JSON.stringify(parPublic));

/* — 5. Idempotence : rejouer ne doit rien dupliquer — */
new Function('DB', 'defaultDB', 'console', codeMigration)(DB, defaultDB, console);
console.log('APRES x2 : ' + DB.elearning.plans.length + ' plans (doit etre identique)');

/* — 6. Un prix ajuste a la main doit survivre — */
const DB2 = { elearning: { plans: JSON.parse(JSON.stringify(neuf.elearning.plans.slice(0, 6))).map(p => { delete p.public; if (p.id === 'plan3') { p.prix = 12000; } return p; }) } };
new Function('DB', 'defaultDB', 'console', codeMigration)(DB2, defaultDB, console);
console.log('Prix personnalise 12000 conserve : ' + (DB2.elearning.plans.find(p => p.id === 'plan3').prix === 12000));

/* — Verdict — */
const ok = pl.length === 15 && pl.every(p => p.public) &&
  pl.find(p => p.id === 'plan3').prix === 7000 &&
  DB2.elearning.plans.find(p => p.id === 'plan3').prix === 12000;
console.log('\n' + (ok ? 'VERT — la migration complete une base ancienne sans rien ecraser.' : 'ROUGE'));
const okA = ok;

/* — 7. Le cas REEL de la production : plan5 et plan6 ont ete retires par
       l'administration, et un plan maison a ete ajoute. Ils ne doivent ni
       reapparaitre, ni disparaitre. — */
const DB3 = { elearning: { plans: [
  { id:'plan1', nom:'EXAMEN / AN', prix:5000 },
  { id:'plan2', nom:'INTERMÉDIAIRE', prix:3000 },
  { id:'plan3', nom:'ENSEIGNANT', prix:5000 },
  { id:'plan4', nom:'FAMILLE / ÉCOLE', prix:25000 },
  { id:'pk1776855191200', nom:'PREPA Intense', prix:5000 }
] } };
new Function('DB','defaultDB','console', codeMigration)(DB3, defaultDB, console);
const ids3 = DB3.elearning.plans.map(p => p.id);
const revenus = ids3.filter(i => i === 'plan5' || i === 'plan6');
const persoGarde = ids3.indexOf('pk1776855191200') >= 0;
console.log('\nBase de production simulee :');
console.log('  plans apres migration : ' + ids3.length + ' (5 + 9 nouveaux = 14 attendu)');
console.log('  plan5/plan6 ressuscites : ' + (revenus.length ? revenus.join(',') : 'aucun'));
console.log('  plan maison conserve    : ' + persoGarde);
console.log('  enseignant annuel       : ' + DB3.elearning.plans.find(p=>p.id==='plan3').prix + ' F');
const ok3 = ids3.length === 14 && revenus.length === 0 && persoGarde &&
            DB3.elearning.plans.find(p=>p.id==='plan3').prix === 7000;
console.log(ok3 ? 'VERT — rien ne ressuscite, rien ne disparait.' : 'ROUGE');
process.exit(ok3 ? 0 : 1);
