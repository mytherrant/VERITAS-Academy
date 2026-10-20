/* Banc du lot F (20/10/2026) : la consigne d'Ambassa demande un guide de
 * correction et une note au relecteur, et leur lecture est bornée.
 *
 *   node tests/banc_ambassa_guide.cjs
 */
'use strict';
const path = require('path');
const R = path.resolve(__dirname, '..');
globalThis.MINESEC = require(path.join(R, 'plateforme/minesec.js'));
const G = require(path.join(R, 'plateforme/generateur.js'));
let ko = 0;
const ok = (c, m) => { console.log((c ? '  OK ' : '  KO ') + m); if (!c) ko++; };

const st = MINESEC.epreuves.find(e => (e.classes || []).includes('4e') && e.nom === 'Étude de texte');
const plan = G.planEpreuve(st, { classe: '4e' });
const sys = G.formationMinesec(st, plan, '4e', [], {});
ok(sys.includes('MÉTHODE DE CONCEPTION'), 'consigne système : méthode de conception présente');
ok(sys.includes('GUIDE DE CORRECTION (clé "guide"') && sys.includes('NOTE AU RELECTEUR'), 'consigne système : guide et note demandés');
ok(sys.includes('PLAFONDS'), 'consigne système : plafonds demandés');

const stBac = MINESEC.epreuves.find(e => (e.classes || []).includes('Terminale') && /Littérature/.test(e.nom));
if (stBac) {
  const planB = G.planEpreuve(stBac, { classe: 'Terminale' });
  const sysB = G.formationMinesec(stBac, planB, 'Terminale', [], {});
  ok(sysB.includes('questions directrices'), 'sujet de réflexion : consigne orientée demandée');
}

const ctxDM = { plan, struct: st, classe: '4e', textes: [], cadre: 'Devoir de vacances n°1', exclusions: [] };
ok(G.promptEpreuve(ctxDM).includes('DEVOIR FAIT HORS DE LA CLASSE'), 'devoir de vacances : indices de recours à l’IA demandés');
ok(!G.promptEpreuve({ ...ctxDM, cadre: 'Devoir' }).includes('DEVOIR FAIT HORS DE LA CLASSE'), 'devoir surveillé : pas d’indices IA');
const fmt = G.promptEpreuve(ctxDM);
ok(fmt.includes('"guide":{"criteres"') && fmt.includes('"note":{"choix"'), 'format JSON : guide et note');
/* Renforcement du 20/10/2026 : relecture finale, contexte, typographie,
   style du sous-cycle (premier cycle seulement), ancrage sur les notions vues. */
ok(/AVANT DE RÉPONDRE/.test(sys) && /^7\. /m.test(sys), 'consigne système : relecture finale en sept points');
ok(/CONTEXTE : situations de vie camerounaises/.test(sys) && /TYPOGRAPHIE FRANÇAISE/.test(sys), 'consigne système : contexte camerounais et typographie');
ok(/NIVEAU ATTENDU — Sous-cycle d’orientation/.test(sys), '4e : style du sous-cycle d’orientation transmis');
if (stBac) {
  const sysT = G.formationMinesec(stBac, G.planEpreuve(stBac, { classe: 'Terminale' }), 'Terminale', [], {});
  ok(!/NIVEAU ATTENDU/.test(sysT), 'Terminale : aucun style de sous-cycle (le seul du 2nd cycle décrit les séries scientifiques)');
}
ok(G.promptEpreuve({ ...ctxDM, programmeFait: ['Les reprises nominales'] }).includes('EN PRIORITÉ sur ces notions'), 'les questions de langue s’ancrent sur les notions vues');
ok(G.octets(sys) < 20000, 'consigne système sous le plafond serveur (20 Ko)');
console.log('  taille consigne système : ' + G.octets(sys) + ' octets ; plafond du prompt : ' + G.PLAFOND_PROMPT);

const base = { titre: 'T', consigne: 'C', questions: [], sujets: [], grille: [], remarques: '' };
const long = 'x'.repeat(2000);
const r1 = G.validerEpreuve({ ...base,
  guide: { criteres: Array.from({ length: 12 }, (_, i) => ({ critere: 'C' + i, points: '2,5', attendu: long, reperes: 'contresens : 2 au plus' })),
    penalites: ['langue : -0,5 par tranche de cinq fautes'], niveaux: { '16 à 20': 'excellent', 'faux': 'ignoré' }, erreurs: ['confusion'] },
  note: { choix: 'texte lié à la séquence', perimetre: 'expansions du nom', points: ['Q3 à confirmer', 'date'] } },
  { plan, struct: st, classe: '4e', textes: [] }, {});
ok(r1.guide && r1.guide.criteres.length === 8, 'guide : borné à 8 critères (reçu 12)');
ok(r1.guide.criteres[0].points === 2.5, 'guide : points lus en nombre (« 2,5 »)');
ok(r1.guide.criteres[0].attendu.length <= 500, 'guide : attendu borné à 500 caractères');
ok(r1.guide.niveaux['16 à 20'] === 'excellent' && !('faux' in r1.guide.niveaux), 'guide : seules les quatre tranches sont gardées');
ok(r1.note && r1.note.points.length === 2, 'note : points lus');
const r2 = G.validerEpreuve(base, { plan, struct: st, classe: '4e', textes: [] }, {});
ok(!r2.guide && !r2.note, 'réponse sans guide ni note : rien d’inventé');
console.log(ko ? ('\n' + ko + ' au rouge') : '\nTout au vert');
process.exit(ko ? 1 : 0);
