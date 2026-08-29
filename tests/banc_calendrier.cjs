#!/usr/bin/env node
/* ════════════════════════════════════════════════════════════════════════════
   tests/banc_calendrier.cjs — LE CALENDRIER PEUT-IL AFFICHER QUELQUE CHOSE ?
   © 2024-2026 Jacques Miterand TAKOU (Mythe Errant).

     node tests/banc_calendrier.cjs

   CE QU'IL PROTÈGE
   Le calendrier lisait `ep.date` — le champ « Période » des renseignements,
   dont le libellé d'exemple est « Trimestre 1 ». Or `_parseDate` n'accepte
   que `AAAA-MM-JJ` ou `JJ/MM/AAAA` : « Trimestre 1 » ne devenait jamais une
   date. Aucun point ne se posait sur aucun jour, et « Aucune date d'épreuve
   renseignée ce mois-ci » s'affichait quoi que l'enseignant écrive. Le
   calendrier était un décor, pas un outil — et rien ne le signalait, puisque
   son message d'absence est exactement ce qu'on attend d'un mois vide.

   Une période et une échéance sont deux choses : « Trimestre 1 » situe
   l'épreuve dans l'année, la date de passation dit quand elle doit être
   prête. D'où `ep.echeance`, saisie dans un champ de type `date`.

   CE QU'IL VÉRIFIE
     ① une échéance devient une vraie date, et « Trimestre 1 » n'en est pas une
     ② le décompte est en jours PLEINS (une échéance du jour vaut 0, pas -1)
     ③ l'urgence classe : en retard, aujourd'hui, demain, la semaine, plus tard
     ④ ce qui est validé ne réclame plus rien
     ⑤ le tri place le plus pressé en tête
     ⑥ la cloche et la liste comptent la MÊME chose
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
  let prof = 0;
  const j = s.indexOf('{', i);
  if (j < 0) return null;
  for (let k = j; k < s.length; k++) {
    if (s[k] === '{') prof++;
    else if (s[k] === '}') { prof--; if (prof === 0) return s.slice(i, k + 1); }
  }
  return null;
}

console.log(`\n${G}LE CALENDRIER PEUT-IL AFFICHER QUELQUE CHOSE ?${R}\n`);

const noms = ['_parseDate(v){', '_echeanceDe(o){', '_joursAvant(d){', '_urgence(j){', '_echeances(){'];
const corps = noms.map(n => extraire(src, n));
dire(corps.every(Boolean), 'les cinq fonctions du calendrier sont extractibles',
  noms.filter((n, i) => !corps[i]).join(', '));
if (!corps.every(Boolean)) { console.log(`\n${ok} au vert, ${ko} au rouge.\n`); process.exit(1); }

const o = new Function('return ({' + corps.join(',') + '});')();

const jour = n => {
  const d = new Date(); d.setHours(0, 0, 0, 0); d.setDate(d.getDate() + n);
  return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0')
    + '-' + String(d.getDate()).padStart(2, '0');
};

/* ── ① Ce qui est une date, et ce qui n'en est pas une ─────────────────── */
console.log(`${G}① « Trimestre 1 » n'est pas une date${R}`);
dire(o._echeanceDe({ echeance: '2026-09-15' }) instanceof Date,
  'une échéance au format du champ `date` est reconnue');
dire(o._echeanceDe({ date: 'Trimestre 1' }) === null,
  '« Trimestre 1 » ne devient pas une date — c’est ce qui vidait le calendrier');
dire(o._echeanceDe({ date: '15/09/2026' }) instanceof Date,
  'une vraie date dans l’ancien champ reste lue (les épreuves déjà saisies)');
dire(o._echeanceDe({ echeance: '2026-09-15', date: 'Trimestre 1' }) instanceof Date,
  'l’échéance l’emporte sur la période');
dire(o._echeanceDe(null) === null, 'aucun objet → aucune date');
dire(o._echeanceDe({}) === null, 'aucun champ → aucune date');

/* ── ② Des jours pleins ────────────────────────────────────────────────── */
console.log(`\n${G}② Le décompte est en jours pleins${R}`);
const maintenant = new Date();
dire(o._joursAvant(maintenant) === 0,
  'une échéance du jour vaut 0, quelle que soit l’heure de consultation',
  String(o._joursAvant(maintenant)));
const d3 = new Date(); d3.setDate(d3.getDate() + 3); d3.setHours(23, 59, 0, 0);
dire(o._joursAvant(d3) === 3, 'trois jours plus tard vaut 3, pas 2', String(o._joursAvant(d3)));
const dm2 = new Date(); dm2.setDate(dm2.getDate() - 2);
dire(o._joursAvant(dm2) === -2, 'et un retard est négatif', String(o._joursAvant(dm2)));

/* ── ③ L'urgence ───────────────────────────────────────────────────────── */
console.log(`\n${G}③ L'urgence dit ce qu'il faut faire d'abord${R}`);
dire(o._urgence(-1).cle === 'retard' && /retard/.test(o._urgence(-1).libelle), 'dépassée → en retard');
dire(o._urgence(0).cle === 'jour', 'le jour même');
dire(o._urgence(1).cle === 'demain', 'demain');
dire(o._urgence(5).cle === 'semaine', 'dans la semaine');
dire(o._urgence(30).cle === 'plus_tard', 'au-delà : un agenda, pas une alerte');
dire(o._urgence(-1).poids < o._urgence(0).poids
  && o._urgence(0).poids < o._urgence(1).poids
  && o._urgence(1).poids < o._urgence(5).poids
  && o._urgence(5).poids < o._urgence(30).poids,
  'les poids ordonnent correctement du plus pressé au moins pressé');
dire(o._urgence(null) === null, 'sans date, aucune urgence inventée');

/* ── ④⑤ L'agrégation ───────────────────────────────────────────────────── */
console.log(`\n${G}④ Ce qui est fini ne réclame plus rien${R}`);
o.state = {
  epreuves: [
    { id: 'a', title: 'En retard', echeance: jour(-3), status: 'brouillon' },
    { id: 'b', title: 'Demain', echeance: jour(1), status: 'relecture' },
    { id: 'c', title: 'Déjà validée', echeance: jour(-5), status: 'valide' },
    { id: 'd', title: 'Sans échéance', date: 'Trimestre 1', status: 'brouillon' },
    { id: 'e', title: 'Dans un mois', echeance: jour(30), status: 'brouillon' },
  ],
  cours: [{ id: 'k', title: 'Leçon de demain', echeance: jour(0), status: 'brouillon' }],
};
const liste = o._echeances();
dire(!liste.some(x => x.id === 'c'),
  'une épreuve validée ne s’affiche plus « en retard »', liste.map(x => x.id).join(','));
dire(!liste.some(x => x.id === 'd'),
  'une épreuve sans échéance n’est pas inventée dans le calendrier');
dire(liste.length === 4, 'les autres sont là, cours compris', String(liste.length));
dire(liste.some(x => x.genre === 'cours'), 'les cours ont aussi leurs échéances');

console.log(`\n${G}⑤ Le plus pressé passe en tête${R}`);
dire(liste[0].id === 'a', 'le retard d’abord', liste.map(x => x.id).join(' > '));
dire(liste[liste.length - 1].id === 'e', 'le lointain en dernier', liste.map(x => x.id).join(' > '));

/* ── ⑥ Une seule source pour trois affichages ──────────────────────────── */
console.log(`\n${G}⑥ Calendrier, liste et cloche comptent la même chose${R}`);
dire(/const echeances=this\._echeances\(\)/.test(src),
  'la grille du mois part de _echeances()');
dire(/const calEvents=echeances\.slice/.test(src),
  'la liste « à venir » aussi — et elle n’est plus bornée au mois affiché');
dire(/const echeancesUrgentes=echeances\.filter\(x=>x\.urgence\.poids<=3\)/.test(src),
  'la cloche ne retient que le dépassé et les sept jours qui viennent');
dire(/const nbNotif=acts\.length\+echeancesUrgentes\.length/.test(src),
  'et son compteur les additionne à l’activité');
dire(/type="date" value="\{\{ ep\.echeance \}\}"/.test(src),
  'le champ de saisie est de type `date` — la forme est imposée, pas devinée');
dire(/setEcheance:setField\('echeance'\)/.test(src),
  'et il est relié à son enregistrement');
dire(/ouvrir:\(\)=>this\.setState\(/.test(src),
  'chaque ligne ouvre son épreuve : une alerte sans clic se remet à plus tard');

console.log(`\n${G}${ok} contrôle(s) au vert, ${ko} au rouge.${R}\n`);
process.exit(ko === 0 ? 0 : 1);
