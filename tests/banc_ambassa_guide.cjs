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

/* Le corrigé qui désavoue sa question (3e, production, 21/10/2026). */
const texteS = 'Cette statue avait été cent ans debout ; elle fut renversée le 12 août 1792. Le peuple la mit en pièces.';
const blocs = G.blocsDuPlan(plan);
const bl = (blocs.find(b => b.kind === 'expl') || blocs[0] || { cle: 'expl', kind: 'expl' });
const r3 = G.validerEpreuve({ ...base, questions: [
  { texte: 1, liste: bl.kind, bloc: bl.cle, q: 'Dans « elle fut renversée le 12 août 1792 », donne la valeur du présent de l’indicatif.', pts: 2,
    corrige: 'Le verbe « fut renversée » est au passé simple, pas au présent. La question est mal posée. Barème : 2 pts.' },
  { texte: 1, liste: bl.kind, bloc: bl.cle, q: 'Relève le complément circonstanciel de temps de la phrase « elle fut renversée le 12 août 1792 ».', pts: 2,
    corrige: '« le 12 août 1792 ». Barème : 2 pts.' }] },
  { plan, struct: st, classe: '4e', textes: [{ n: 77, text: texteS, role: 'support', words: 20 }] }, {});
const cD = (r3.controles || []).find(c => c.cle === 'desavoue');
ok(!!cD && cD.ok === false && /1 question/.test(cD.libelle), 'un corrigé qui déclare sa question « mal posée » est signalé — ' + (cD ? cD.libelle.slice(0, 80) : 'rien'));
ok(/5 ter\./.test(sys), 'consigne système : corriger la question plutôt que la désavouer');

/* Notion plaquée (production, 21/10/2026, 6e et 3e) : détectée, donc réécrite. */
const diag = q => G.diagnostiquer(q, { texte: '' }, {}).map(d => d.code);
ok(diag('Dans la phrase « Tu le taxes à combien ? », remplace le mot « taxes » par un synonyme issu du lexique des sensations.').includes('plaquee'),
  'notion plaquée : « synonyme issu du lexique des sensations » détecté');
ok(diag('Remplace le groupe nominal « l’homme enterré » par un synonyme qui appartient au vocabulaire de la vie socioculturelle.').includes('plaquee'),
  'notion plaquée : « synonyme qui appartient au vocabulaire de… » détecté');
ok(diag('Remplace le mot « monsieur » par un homophone qui maintient le sens de moquerie.').includes('plaquee'),
  'notion plaquée : « homophone qui maintient le sens » détecté');
ok(!diag('Remplace le mot « taxes » par un synonyme qui convient dans la phrase.').includes('plaquee')
  && !diag('Complète la phrase avec l’homophone qui convient : « sens » ou « cent ».').includes('plaquee'),
  'notion plaquée : une question juste n’est pas signalée');

/* Barème ventilé : exigé par le format, et repris par la réparation. */
ok(/BARÈME DANS CHAQUE CORRIGÉ/.test(G.promptEpreuve({ plan, struct: st, classe: '4e', textes: [{ n: 77, text: texteS, role: 'support', words: 20 }] })),
  'consigne : chaque corrigé se termine par « Barème : … »');
const r4 = G.validerEpreuve({ ...base, questions: [
  { texte: 1, liste: bl.kind, bloc: bl.cle, q: 'Relève le complément circonstanciel de temps de la phrase « elle fut renversée le 12 août 1792 ».', pts: 2,
    corrige: 'Le complément est « le 12 août 1792 », il situe l’action.' }] },
  { plan, struct: st, classe: '4e', textes: [{ n: 77, text: texteS, role: 'support', words: 20 }] }, {});
ok(r4.aVentiler.length === 1, 'un corrigé sans barème part à la réparation');
const pR = G.promptReparation(r4.aReparer, texteS, r4.aVentiler);
ok(/CORRIGÉS À VENTILER/.test(pR) && /"baremes"/.test(pR), 'la réparation demande le barème');
G.appliquerReparation(r4, { questions: [], baremes: ['Barème : 1,5 pt pour le relevé, 0,5 pt pour la valeur.'] }, {}, { 77: texteS });
const qF = r4.questions[Object.keys(r4.questions)[0]][bl.kind][0];
ok(/Barème : 1,5 pt/.test(qF.corrige) && r4.aVentiler.length === 0, 'le barème reçu est ajouté au corrigé');
const cC = r4.controles.find(c => c.cle === 'corriges');
ok(cC && cC.ok === true, 'le compte rendu ne signale plus de corrigé sans barème — ' + (cC && cC.libelle));

/* Parcours complet : composer() avec un faux serveur IA (deux appels). */
const appels = [];
const fauxFetch = (url, init) => {
  const corps = JSON.parse(init.body); appels.push(corps.prompt);
  const rep = appels.length === 1
    ? { titre: 'T', consigne: 'C', sujets: [], questions: [
        { texte: 1, liste: bl.kind, bloc: bl.cle, q: 'Remplace le mot « peuple » par un synonyme issu du lexique des sensations.', pts: 2, corrige: 'foule' }] }
    : { questions: ['Remplace le mot « peuple » par un synonyme qui convient dans la phrase « Le peuple la mit en pièces. ».'],
        baremes: ['Barème : 1 pt pour le synonyme, 1 pt pour la phrase réécrite.'] };
  return Promise.resolve({ ok: true, status: 200, json: () => Promise.resolve({ text: JSON.stringify(rep) }) });
};
G.composer({ plan, struct: st, classe: '4e', textes: [{ n: 77, text: texteS, role: 'support', words: 20 }], exemples: [] },
  { fetch: fauxFetch, reparer: () => true, pause: 0 }).then(res => {
  const q1 = res.questions[Object.keys(res.questions)[0]][bl.kind][0];
  ok(appels.length === 2 && /CORRIGÉS À VENTILER/.test(appels[1]), 'composer : un seul appel de réparation, qui demande aussi le barème');
  ok(!/lexique des sensations/.test(q1.q), 'composer : la question plaquée est réécrite — « ' + q1.q.slice(0, 60) + ' »');
  ok(/Barème : 1 pt/.test(q1.corrige), 'composer : le corrigé porte son barème ventilé');
  console.log(ko ? ('\n' + ko + ' au rouge') : '\nTout au vert');
  process.exit(ko ? 1 : 0);
}).catch(e => { console.log('  KO composer a levé : ' + (e && e.message)); process.exit(1); });
