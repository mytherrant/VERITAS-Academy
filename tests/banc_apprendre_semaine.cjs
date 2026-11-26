/* Banc — la semaine de la progression (apprendre/calendrier.js, 26/11/2026).
   ① 25 semaines de cours, 5 d'évaluation, vacances de Noël et de Pâques ;
   ② chaque leçon de chaque classe et matière tombe dans une semaine de cours,
      dans l'ordre de la progression ;
   ③ semaineDe() : évaluation le 26/11/2026, cours le 02/12, vacances le 23/12 ;
   ④ « à rattraper » reste vide pour un élève qui n'a rien lu (pas de « 183 leçons »).
   node tests/banc_apprendre_semaine.cjs */
'use strict';
const fs = require('fs'), path = require('path'), vm = require('vm');
const R = path.join(__dirname, '..', 'apprendre');
let ok = 0, ko = 0;
const verifier = (c, msg) => { if (c) { ok++; console.log('  \x1b[32m✓\x1b[0m ' + msg); } else { ko++; console.log('  \x1b[31m✗\x1b[0m ' + msg); } };

function charger(lus) {
  const store = { 'vrt_app_lus': JSON.stringify(lus || {}) };
  /* Même contexte nu que banc_apprendre_reglages.cjs (pas de document). */
  const ctx = { location: { search: '' }, fetch: () => Promise.reject(new Error('hors ligne')),
    localStorage: { getItem: k => (k in store ? store[k] : null), setItem: (k, v) => { store[k] = String(v); } },
    sessionStorage: { getItem() { return null; }, setItem() {}, removeItem() {} },
    setTimeout() { return 0; }, clearTimeout() {} };
  ctx.window = ctx; vm.createContext(ctx);
  for (const f of ['progressions.js', 'lecons.js', 'ressources.js', 'apercus-3e.js', 'commun.js', 'calendrier.js'])
    vm.runInContext(fs.readFileSync(path.join(R, f), 'utf8'), ctx, { filename: f });
  return ctx;
}

const W = charger();
const Y = W.VRT.annee, A = W.VRT.app;
console.log('① calendrier');
verifier(Y.NB_COURS === 25, '25 semaines de cours (' + Y.NB_COURS + ')');
verifier(Y.SEMAINES.filter(w => w.type === 'eval').length === 5, '5 semaines d\'évaluation');
verifier(Y.SEMAINES.filter(w => w.type === 'vac').length === 4, '4 semaines de vacances (Noël, Pâques)');
verifier(Y.SEMAINES.every(w => w.de.getUTCDay() === 0 && w.de.getUTCHours() === 23), 'chaque semaine commence un lundi (heure du Cameroun)');

console.log('② répartition des leçons');
let total = 0, hors = 0, desordre = 0, vides = 0;
for (const c of A.CLASSES) for (const m of A.MATIERES) {
  const P = Y.plan(c, m.id), n = P.reduce((s, w) => s + w.length, 0);
  if (!n) continue;
  total += n;
  let kPrec = -1;
  m.minesec.forEach(s => {
    let k0 = -1;
    P.forEach((w, k) => w.forEach(L => { if (L.k !== k || k < 0 || k >= Y.NB_COURS) hors++; }));
    P.flat().filter(L => (((W.VRT_PROG[c] || {})[s] || []).some(ch => ch[1].some(l => l[1] === L.o)))).forEach(L => { if (L.k < k0) desordre++; k0 = L.k; });
  });
  if (n >= Y.NB_COURS && P.some(w => !w.length)) vides++;
}
verifier(total > 3000, total + ' leçons placées');
verifier(hors === 0, 'aucune leçon hors des semaines de cours');
verifier(desordre === 0, 'l\'ordre de la progression est respecté');
verifier(vides === 0, 'une progression d\'au moins 25 leçons remplit chaque semaine');

console.log('③ semaine courante');
const t = s => new Date(s + 'T10:00:00+01:00');
verifier(Y.semaineDe(t('2026-11-26')).etat === 'eval', '26/11/2026 : semaine d\'évaluation (séquence 2)');
verifier(Y.semaineDe(t('2026-12-02')).etat === 'cours' && Y.semaineDe(t('2026-12-02')).w.seq === 3, '02/12/2026 : cours, séquence 3');
verifier(Y.semaineDe(t('2026-12-23')).etat === 'vac', '23/12/2026 : vacances de Noël');
verifier(Y.semaineDe(t('2027-04-01')).etat === 'vac', '01/04/2027 : vacances de Pâques');
verifier(Y.semaineDe(t('2026-08-20')).etat === 'avant' && Y.kCourant(t('2026-08-20')) === 0, 'avant la rentrée : première semaine');
verifier(Y.kCourant(t('2027-05-10')) === Y.NB_COURS, 'après la séquence 5 : programme bouclé');

console.log('④ retard');
const b0 = Y.bilan('3e', 'maths', t('2027-02-10'));
verifier(b0.retard.length === 0 && !b0.commence, 'élève qui n\'a rien lu : rien « à rattraper »');
const red = b0.dues[0];
if (red) {
  const W2 = charger({ [red.id]: Date.now() });
  const b1 = W2.VRT.annee.bilan('3e', 'maths', t('2027-02-10'));
  verifier(b1.commence && b1.retard.length > 0 && b1.retard.length <= 3 * 4, 'élève commencé : retard limité aux 3 dernières semaines (' + b1.retard.length + ')');
} else verifier(false, 'aucune leçon rédigée de maths 3e passée au 10/02/2027');

console.log('\n' + ok + ' réussis, ' + ko + ' échoués');
process.exit(ko ? 1 : 0);
