/* Banc des progressions nationales (lot I, 20/10/2026).
 *
 * plateforme/progressions.js est GÉNÉRÉ par tools/importer_progressions.py
 * depuis les deux fichiers Word des progressions et CALENDRIER_SCOLAIRE
 * (app.js). On vérifie ce que l'Atelier suppose : toutes les classes, six
 * séquences (cinq modules au premier cycle EST), des semaines datées dans
 * leur séquence, aucune semaine de cours en pleine interruption, et une
 * tâche d'intégration par séquence.
 *
 *   node tests/banc_progressions.cjs
 */
'use strict';
const path = require('path');
const P = require(path.join(__dirname, '..', 'plateforme', 'progressions.js'));
let ko = 0;
const dire = (c, m, d) => { console.log((c ? '  \x1b[32m✓\x1b[0m ' : '  \x1b[31m✗\x1b[0m ') + m + (c || !d ? '' : ' — ' + d)); if (!c) ko++; };

const cal = P.calendrier;
dire(cal.sequences.length === 6, 'le calendrier porte six séquences officielles');
dire(cal.sequences.every((s, i) => i === 0 || s.debut > cal.sequences[i - 1].fin), 'les séquences se suivent dans le temps', JSON.stringify(cal.sequences.map(s => s.debut)));
dire(cal.sequences[3].debut.startsWith('2027-01'), 'la séquence 4 commence en janvier 2027 (pas 2026)', cal.sequences[3].debut);
dire(cal.feries.some(f => f.date === '2027-02-11') && cal.feries.some(f => f.date === '2027-05-20'), 'fériés nationaux présents (11 février, 20 mai)');

dire(P.classes.length >= 33, 'au moins 33 classes (ESG 6e→Tle, EST)', String(P.classes.length));
const ids = P.classes.map(c => c.id);
dire(new Set(ids).size === ids.length, 'aucune classe en double');
const incompletes = P.classes.filter(c => {
  const attendu = /^est-[1-4]-annee/.test(c.id) ? 5 : 6;
  return c.sequences.length !== attendu || c.sequences.some((s, i) => s.num !== i + 1);
}).map(c => c.libelle + ' (' + c.sequences.map(s => s.num).join(',') + ')');
dire(!incompletes.length, 'chaque classe a toutes ses séquences, numérotées dans l’ordre', incompletes.join(' ; '));

const enVacances = [], horsSeq = [], sansDate = [];
const vac = cal.vacances.filter(v => !/Grandes/.test(v.label));
P.classes.forEach(c => c.sequences.forEach(s => s.semaines.forEach(w => {
  if (!w.debut) { sansDate.push(c.libelle + ' S' + s.num + '.' + w.n); return; }
  if (w.debut < s.debut || w.fin > s.fin) horsSeq.push(c.libelle + ' S' + s.num + '.' + w.n);
  if (vac.some(v => w.debut > v.debut && w.fin < v.fin)) enVacances.push(c.libelle + ' S' + s.num + '.' + w.n);
})));
dire(!sansDate.length, 'toutes les semaines sont datées', sansDate.slice(0, 5).join(', '));
dire(!horsSeq.length, 'chaque semaine tombe dans sa séquence officielle', horsSeq.slice(0, 5).join(', '));
dire(!enVacances.length, 'aucune semaine de cours en pleine interruption', enVacances.slice(0, 5).join(', '));

const sansTache = [];
P.classes.forEach(c => c.sequences.forEach(s => { if (!s.integration) sansTache.push(c.libelle + ' S' + s.num); }));
dire(!sansTache.length, 'chaque séquence a sa tâche d’intégration (S4)', sansTache.slice(0, 5).join(', '));
const s4 = P.classes.find(c => c.id === 'esg-4').sequences[2];
dire(s4.semaines.filter(w => w.n <= 3).every(w => w.type === 'ressources'), 'S1-S3 = ressources, même quand la ligne parle d’« intégration »');

console.log(ko ? '\n' + ko + ' au rouge' : '\nTout au vert');
process.exit(ko ? 1 : 0);
