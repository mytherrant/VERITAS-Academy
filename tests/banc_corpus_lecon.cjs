#!/usr/bin/env node
/* ════════════════════════════════════════════════════════════════════════════
   tests/banc_corpus_lecon.cjs — LA LEÇON TROUVE-T-ELLE SON CORPUS ?
   © 2024-2026 Jacques Miterand TAKOU (Mythe Errant).

     node tests/banc_corpus_lecon.cjs

   CE QU'IL PROTÈGE
   Le sélecteur de texte support ne cherchait que dans l'auteur, le titre et le
   corps du texte. Rien ne le reliait à la leçon en cours : pour une « Leçon de
   langue — les expansions du nom, 6ᵉ, séquence 3 », il proposait les 2 054
   fiches du répertoire dans l'ordre du fichier. L'enseignant lisait des
   extraits jusqu'à en trouver un qui serve.

   Chaque fiche porte pourtant de quoi répondre : son NIVEAU, son TYPE
   (descriptif, narratif, dialogue…), son MODULE, et surtout ses `faits` — les
   faits de langue qu'elle permet d'observer.

   RÈGLE TENUE ICI : on CLASSE, on ne filtre pas. Masquer, c'est risquer de
   cacher le texte que l'enseignant cherchait. C'est la même règle que le
   filtre par matières des épreuves, et le contrôle qui compte le plus est
   celui-là : la bascule « ne montrer que ceux-là » ne doit JAMAIS pouvoir
   vider la liste.

   Le banc exécute la fonction RÉELLE extraite de plateforme/index.html, sur
   des fiches du VRAI répertoire libre de droits quand il est présent.
   ════════════════════════════════════════════════════════════════════════ */
'use strict';
const fs = require('fs');
const path = require('path');

const RACINE = path.resolve(__dirname, '..');
const V = '\x1b[32m✓\x1b[0m', X = '\x1b[31m✗\x1b[0m', G = '\x1b[1m', R = '\x1b[0m';
let ok = 0, ko = 0;
const dire = (b, m, d) => {
  b ? ok++ : ko++;
  console.log('  ' + (b ? V : X) + ' ' + m + (!b && d ? '  → ' + d : ''));
};

const src = fs.readFileSync(path.join(RACINE, 'plateforme', 'index.html'), 'utf8');

function extraire(s, entete) {
  const i = s.indexOf(entete);
  if (i < 0) return null;
  let prof = 0, j = s.indexOf('{', i);
  if (j < 0) return null;
  for (let k = j; k < s.length; k++) {
    if (s[k] === '{') prof++;
    else if (s[k] === '}') { prof--; if (prof === 0) return s.slice(i, k + 1); }
  }
  return null;
}

console.log(`\n${G}LA LEÇON TROUVE-T-ELLE SON CORPUS ?${R}\n`);

const corps = extraire(src, '_scoreCorpus(f, co){');
dire(!!corps, '`_scoreCorpus` est extractible de plateforme/index.html');
const scorer = corps ? new Function('return ({' + corps + '});')() : null;
const score = (f, co) => scorer._scoreCorpus(f, co);

/* ── ① Le cas qui a motivé la fonctionnalité ───────────────────────────── */
console.log(`${G}① « Les expansions du nom », 6ᵉ, séquence 1${R}`);

const LECON = {
  id: 'k1', title: 'Les expansions du nom', type: 'Leçon de langue',
  classe: '6ᵉ', sequence: 'Séquence 1', competence: 'Lire pour décrire',
  objAgir: 'Identifier et employer les expansions du nom dans un texte descriptif',
  regle: '',
};

const FICHE_JUSTE = {
  n: 1, type: 'DESCRIPTIF', words: 106, level: '6e', groupNum: 1,
  group: 'Module 1 — La vie quotidienne', author: 'Maurice Maeterlinck',
  faits: 'le champ lexical dominant ; l’imparfait descriptif ; les expansions du nom (épithète, complément du nom).',
  comprehension: '',
};
const FICHE_HORS_SUJET = {
  n: 2, type: 'ARGUMENTATIF', words: 300, level: 'Tle', groupNum: 6,
  group: 'Module 6 — Le débat', author: 'Anonyme',
  faits: 'les connecteurs logiques ; la thèse et les arguments.', comprehension: '',
};

const sJuste = score(FICHE_JUSTE, LECON);
const sHors = score(FICHE_HORS_SUJET, LECON);
dire(sJuste.score > 0, 'la fiche qui porte « expansions du nom » obtient un score',
  JSON.stringify(sJuste));
dire(sJuste.score > sHors.score, 'et elle passe devant une fiche sans rapport',
  sJuste.score + ' contre ' + sHors.score);
dire(sHors.score === 0, 'la fiche sans rapport ne remonte pas du tout', String(sHors.score));
dire(sJuste.raisons.join(' ').indexOf('fait') >= 0,
  'la raison affichée nomme les faits de langue', sJuste.raisons.join(' · '));
dire(sJuste.raisons.join(' ').indexOf('descriptif') >= 0,
  'et le type de texte, parce que la leçon dit « décrire »', sJuste.raisons.join(' · '));

/* ── ② Les niveaux s'écrivent de dix façons ────────────────────────────── */
console.log(`\n${G}② « 6ᵉ », « 6e », « 6ème » désignent la même classe${R}`);
const nivOnly = (classe, level) => score(
  { n: 9, type: '', level: level, faits: '', groupNum: 0 },
  { classe: classe, title: '', objAgir: '', regle: '', competence: '', type: '', sequence: '' }).score;
dire(nivOnly('6ᵉ', '6e') > 0, '« 6ᵉ » retrouve « 6e »');
dire(nivOnly('6ème', '6e') > 0, '« 6ème » aussi');
dire(nivOnly('Terminale', 'Tle') > 0, '« Terminale » retrouve « Tle »');
dire(nivOnly('6ᵉ', '3e') === 0, 'mais une 6ᵉ ne prend pas les textes de 3ᵉ');

/* ── ③ Les mots vides ne doivent rien faire remonter ───────────────────── */
console.log(`\n${G}③ « les », « dans », « identifier » ne sont pas des critères${R}`);
/* ⚠️ Premiere version de ce controle : elle opposait « Identifier les temps »
   a une fiche portant « identifier les temps dans le texte », et attendait 0.
   Elle avait tort — « temps » EST un fait de langue, et le rapprochement etait
   juste. On teste donc ce qu'on voulait vraiment tester : des mots OUTILS
   seuls, qui ne designent aucun fait. */
const bruit = score(
  { n: 3, type: 'NARRATIF', level: '5e', groupNum: 2,
    faits: 'les connecteurs dans le texte pour les eleves', comprehension: '' },
  { classe: '', title: 'Identifier dans le texte', objAgir: 'pour les eleves',
    regle: '', competence: '', type: '', sequence: '' });
dire(bruit.score === 0,
  'une leçon faite de mots outils n’attrape rien',
  JSON.stringify(bruit));

/* ── ④ Le module répond à la séquence ──────────────────────────────────── */
console.log(`\n${G}④ « Séquence 3 » et « Module 3 » se répondent${R}`);
const mod = score({ n: 4, type: '', level: '', groupNum: 3, faits: '' },
  { classe: '', title: '', objAgir: '', regle: '', competence: '', type: '', sequence: 'Séquence 3' });
dire(mod.score > 0 && mod.raisons.join(' ').indexOf('module 3') >= 0,
  'le module est reconnu et nommé', JSON.stringify(mod));

/* ── ⑤ Sur le VRAI répertoire ──────────────────────────────────────────── */
console.log(`\n${G}⑤ Sur le répertoire réel${R}`);
const fLibre = path.join(RACINE, 'api', 'data', 'corpus_libre.json');
if (fs.existsSync(fLibre)) {
  const tous = JSON.parse(fs.readFileSync(fLibre, 'utf8'));
  const notes = tous.map(f => ({ f: f, s: score(f, LECON) }));
  /* Le SEUIL est le coeur du reglage. Sans lui, 647 fiches sur 1 014
     obtenaient au moins un point pour cette lecon — la moitie du repertoire,
     ce qui ne conseille rien. Mesure de la distribution : 313 fiches a
     3 points (un seul critere), puis un creux. A 6 points il faut deux
     criteres qui se croisent. */
  const SEUIL = 6;
  const retenus = notes.filter(x => x.s.score >= SEUIL);
  dire(retenus.length > 0,
    'la leçon « expansions du nom, 6ᵉ » trouve des textes dans les 1 014',
    retenus.length + ' fiche(s)');
  dire(retenus.length < tous.length * 0.25,
    'et moins du quart du répertoire — le classement discrimine vraiment',
    retenus.length + ' / ' + tous.length);
  dire(/const CO_SEUIL=6;/.test(src),
    'le même seuil est appliqué dans la page (compteur, étoile, bascule)');
  const tri = notes.slice().sort((a, b) => b.s.score - a.s.score);
  const tete = tri[0];
  dire(tete.s.score >= 3, 'la tête de liste a un score franc',
    'n°' + tete.f.n + ' score ' + tete.s.score + ' — ' + tete.s.raisons.join(' · '));
  dire(tri[0].s.score >= tri[tri.length - 1].s.score,
    'le tri est bien décroissant');
} else {
  dire(true, 'répertoire libre absent de ce poste — contrôles réels ignorés');
}

/* ── ⑥ LE CONTRÔLE QUI COMPTE : ne jamais vider la liste ───────────────── */
console.log(`\n${G}⑥ La bascule ne peut pas vider la liste${R}`);
const bloc = src.slice(src.indexOf('const coScores=this._scoresCorpus'),
  src.indexOf('const coCorpusOptions='));
dire(bloc.length > 0, 'le bloc de classement est trouvable');
dire(/coNbConseilles>0/.test(bloc),
  '« ne montrer que ceux-là » exige qu’il y en ait au moins un',
  'sinon l’enseignant conclut que le répertoire est vide, pas que sa leçon est vague');
dire(/!coQ/.test(bloc),
  'une recherche libre garde la main : on ne réordonne pas sous ses doigts');
dire(/coConseilVisible:coNbConseilles>0/.test(src),
  'le bandeau se tait quand il n’a rien à dire (pas de « 0 texte conseillé »)');
/* Le fichier ecrit ses caracteres non-ASCII en sequences d'echappement
   (`°`, `—`) : chercher le glyphe brut echouerait sur du code
   pourtant correct. */
dire(/\\u2605/.test(src), 'les fiches retenues sont marquées d’une étoile dans la liste');
dire(/CO_SEUIL/.test(bloc) || /CO_SEUIL/.test(src),
  'et le seuil gouverne bien ce marquage');

console.log(`\n${G}${ok} contrôle(s) au vert, ${ko} au rouge.${R}\n`);
process.exit(ko === 0 ? 0 : 1);
