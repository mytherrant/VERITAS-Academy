/* Banc du 21/10/2026 : au 2nd cycle, les sujets au choix suivent la
 * progression. Une séquence de dissertation ne fait pas composer une
 * contraction que la classe n'a pas encore apprise.
 *
 *   node tests/banc_sujets_progression.cjs
 */
'use strict';
const path = require('path');
const R = path.resolve(__dirname, '..');
globalThis.MINESEC = require(path.join(R, 'plateforme/minesec.js'));
const G = require(path.join(R, 'plateforme/generateur.js'));
global.window = {};
require(path.join(R, 'plateforme/progressions.js'));
const P = window.VRT_PROGRESSIONS;
const classes = P.classes || Object.values(P);
let ko = 0;
const ok = (c, m) => { console.log((c ? '  OK ' : '  KO ') + m); if (!c) ko++; };

const tle = classes.find(c => c.id === 'esg-terminale-litteraire');
ok(!!tle, 'progression Terminale littéraire présente');
const plan = num => G.restreindreSujets(G.planEpreuve(MINESEC.epreuveParCode('A_LITT'), { classe: 'Terminale' }),
  G.genresDeSequences(tle.sequences, num));
const genres = p => p.sujets.filter(s => s.genre !== 'presentation').map(s => s.genre).concat(p.sujetTexte ? ['contraction'] : []).sort().join(',');

const p2 = plan(2);
ok(genres(p2) === 'dissertation', 'séquence 2 (dissertation) : la dissertation seule — obtenu ' + genres(p2));
ok(p2.support === 'aucun' && !p2.productions.length, 'séquence 2 : ni texte support ni contraction');
ok(p2.sujets.filter(s => s.genre === 'dissertation').every(s => !s.auChoix), 'séquence 2 : un sujet unique n’est plus « au choix »');
ok(!!(p2.restreint && p2.restreint.retires.length === 2), 'séquence 2 : deux sujets retirés et nommés');

const p3 = plan(3);
ok(genres(p3) === 'commentaire,dissertation', 'séquence 3 (commentaire) : commentaire et dissertation — obtenu ' + genres(p3));
ok(p3.sujets.filter(s => s.genre !== 'presentation').every(s => s.auChoix), 'séquence 3 : deux sujets, au choix');

const p5 = plan(5);
ok(genres(p5) === 'commentaire,contraction,dissertation', 'séquence 5 (contraction) : les trois sujets — obtenu ' + genres(p5));
ok(!p5.restreint && p5.support === 'texte', 'séquence 5 : structure officielle intacte');

/* Aucun genre reconnu : rien n'est retiré (BP, ENIET…). */
const pBp = G.restreindreSujets(G.planEpreuve(MINESEC.epreuveParCode('BP_IND'), { classe: 'BP' }), ['dissertation']);
ok(!pBp.restreint && pBp.sujets.length === 2, 'BP : lettre et rapport ne sont pas touchés');

/* La consigne dit pourquoi, et interdit de recopier le texte. */
const ctx = { plan: p2, struct: MINESEC.epreuveParCode('A_LITT'), classe: 'Terminale', textes: [] };
const pr = G.promptEpreuve ? G.promptEpreuve(ctx) : '';
ok(!pr || /SUJETS LIMITÉS À LA PROGRESSION/.test(pr), 'la consigne annonce les sujets retirés');
ok(!pr || /ne recopie JAMAIS un texte support/.test(pr), 'la consigne interdit de recopier le texte support');

console.log(ko ? '\n  ' + ko + ' échec(s)' : '\n  Tout au vert');
process.exit(ko ? 1 : 0);
