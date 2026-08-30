#!/usr/bin/env node
/* ════════════════════════════════════════════════════════════════════════════
   tests/banc_plan_site.cjs — CE QUE LE SITE PUBLIE EST-IL ATTEIGNABLE ?
   © 2024-2026 Jacques Miterand TAKOU (Mythe Errant).

     node tests/banc_plan_site.cjs

   CE QU'IL PROTÈGE
   Mesuré le 30/08/2026 sur la page d'accueil RÉELLEMENT SERVIE : le mot
   « corrigé » y figure 139 fois, et il n'existe AUCUN lien vers /corriges/ —
   ni `href`, ni `window.open`, ni action de navigation. Quatre-vingt-treize
   pages de corrigés dont le site parle sans jamais y conduire.

   Le même silence couvrait /livrets/ (16 pages), /evaluations/ (10),
   /niveaux/ (8), /decouvrir/ (6), /outils/ (4), /cours/ (3), /parcours/,
   /flash/, /adopter/, constellation.html et manuels.html. Cent soixante-cinq
   pages publiées, invisibles depuis l'accueil.

   Rien ne le signalait : une page orpheline répond 200 quand on connaît son
   adresse. Elle n'est pas cassée — elle est introuvable, ce qui ne produit
   aucune erreur.

   CE QU'IL VÉRIFIE
     ① le plan existe et se régénère depuis les fichiers (aucun chiffre saisi)
     ② chacun de ses liens mène à quelque chose qui existe
     ③ toutes les zones publiées y figurent — une nouvelle zone ne peut pas
       être oubliée en silence
     ④ chaque profil y trouve de quoi commencer
     ⑤ le plan lui-même est atteignable — une page d'orphelines orpheline
       serait la même faute, une couche plus loin
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

console.log(`\n${G}CE QUE LE SITE PUBLIE EST-IL ATTEIGNABLE ?${R}\n`);

const PLAN = path.join(RACINE, 'plan.html');
dire(fs.existsSync(PLAN), 'plan.html existe (sinon : python tools/build_plan.py)');
if (!fs.existsSync(PLAN)) { console.log(`\n${ok} au vert, ${ko} au rouge.\n`); process.exit(1); }
const plan = fs.readFileSync(PLAN, 'utf8');

/* ── ① Généré, pas écrit ───────────────────────────────────────────────── */
console.log(`${G}① Les compteurs se recomptent depuis le contenu${R}`);
dire(fs.existsSync(path.join(RACINE, 'tools', 'build_plan.py')),
  'le générateur est versionné');
function compter(zone) {
  const d = path.join(RACINE, zone);
  if (!fs.existsSync(d)) return 0;
  let n = 0;
  (function marcher(x) {
    for (const e of fs.readdirSync(x, { withFileTypes: true })) {
      if (e.isDirectory()) marcher(path.join(x, e.name));
      else if (e.name.endsWith('.html')) n++;
    }
  })(d);
  return n;
}
/* Ce qui sera SERVI, c'est ce que git suit — pas ce qui est sur le poste. */
function versionnee(zone) {
  try {
    return require('child_process')
      .execFileSync('git', ['ls-files', zone + '/'], { cwd: RACINE, encoding: 'utf8' })
      .split('\n').filter(l => l.endsWith('.html')).length;
  } catch (e) { return compter(zone); }
}
const versionnees = versionnee('corriges');
dire(versionnees > 0, 'des corrigés sont bien versionnés', String(versionnees));
dire(new RegExp('>' + versionnees + ' pages?<').test(plan),
  'le plan annonce le nombre RÉELLEMENT DÉPLOYÉ de corrigés (' + versionnees + ')',
  (plan.match(/>\d+ pages?</g) || []).slice(0, 6).join(' '));

/* ── ② Aucun lien mort ─────────────────────────────────────────────────── */
console.log(`\n${G}② Chaque lien mène quelque part${R}`);
const liens = [...new Set((plan.match(/href="\/[^"]*"/g) || [])
  .map(h => h.slice(7, -1)))];
dire(liens.length >= 15, 'le plan porte au moins quinze destinations', String(liens.length));
/* `app.html` n'est PAS dans le dépôt : la CI le produit en copiant
   VERITAS_v1.2.html au moment du déploiement. Un contrôle qui exigerait sa
   présence ici échouerait sur le runner tout en passant sur le poste du
   développeur — le pire des deux mondes. On vérifie donc sa SOURCE. */
const GENERES = { 'app.html': 'VERITAS_v1.2.html' };
const morts = liens.map(u => u.split('#')[0].replace(/^\//, ''))
  .filter(c => {
    if (!c) return false;
    const cible = GENERES[c] || c;
    return !fs.existsSync(path.join(RACINE, cible));
  });
dire(morts.length === 0, 'aucune ne pointe dans le vide', morts.join(', '));

/* ⚠️ LE PLAN ANNONCE CE QUI SERA EN LIGNE, PAS CE QUI TRAÎNE SUR LE POSTE.
   Le 30/08/2026, quatre corrigés de cahiers Bord en cours de rédaction (deux
   modules de 4ᵉ, deux séquences de Terminale) étaient présents sur la machine
   et volontairement non versionnés. Le plan, qui comptait le disque, annonçait
   « 93 corrigés » là où 89 seulement seraient servis. La CI l'a refusé — et
   elle avait raison : un travail en cours n'est pas du contenu publié.
   Le générateur compte donc `git ls-files`, et ce contrôle le vérifie. */
const surDisque = compter('corriges');
if (versionnees !== surDisque) {
  dire(!new RegExp('>' + surDisque + ' pages?<').test(plan),
    'un brouillon non versionné n’est PAS annoncé au plan',
    surDisque + ' sur le disque, ' + versionnees + ' versionnées');
}

/* ── ③ Rien d'oublié ───────────────────────────────────────────────────── */
console.log(`\n${G}③ Aucune zone publiée n'est laissée de côté${R}`);
/* Le contrôle qui compte : une zone qui contient des pages DOIT figurer au
   plan. Sans lui, publier un nouveau dossier le rendrait invisible — et c'est
   exactement ce qui est arrivé à /livrets/, /outils/ et /evaluations/. */
const ZONES = ['corriges', 'oeuvres', 'niveaux', 'evaluations', 'livrets',
  'cours', 'outils', 'parcours', 'decouvrir', 'flash', 'adopter'];
const oubliees = ZONES.filter(z => compter(z) > 0 && plan.indexOf('href="/' + z + '/"') < 0);
dire(oubliees.length === 0,
  'toutes les zones qui contiennent des pages sont au plan', oubliees.join(', '));
['constellation.html', 'manuels.html'].forEach(f => {
  if (!fs.existsSync(path.join(RACINE, f))) return;
  dire(plan.indexOf('href="/' + f + '"') >= 0, f + ' y figure aussi');
});

/* ── ④ Chaque profil a de quoi commencer ───────────────────────────────── */
console.log(`\n${G}④ Chaque public trouve son entrée${R}`);
[['eleve', 'Élèves'], ['parent', 'Parents'], ['enseignant', 'Enseignants'],
 ['partenaire', 'Partenaires']].forEach(([cle, nom]) => {
  const i = plan.indexOf('id="' + cle + '"');
  const suite = i >= 0 ? plan.slice(i, i + 6000) : '';
  const n = (suite.match(/class="pl-c"/g) || []).length;
  dire(i >= 0 && n >= 3, nom + ' : au moins trois entrées', 'trouvé ' + n);
});
/* Un service peut concerner plusieurs publics : c'est le principe de la page,
   et le vérifier empêche qu'on la « range » un jour en colonnes étanches. */
const iEl = plan.indexOf('id="eleve"'), iEns = plan.indexOf('id="enseignant"');
dire(iEl >= 0 && iEns >= 0
  && plan.slice(iEl, iEns).indexOf('href="/corriges/"') >= 0
  && plan.slice(iEns).indexOf('href="/corriges/"') >= 0,
  'les corrigés apparaissent chez l’élève ET chez l’enseignant');

/* ── ⑤ Le plan est lui-même atteignable ────────────────────────────────── */
console.log(`\n${G}⑤ Le plan n'est pas orphelin à son tour${R}`);
const vitrine = fs.readFileSync(path.join(RACINE, 'vitrine.html'), 'utf8');
dire(/href="plan\.html"|href="\/plan\.html"/.test(vitrine),
  'la vitrine y mène (pied de page)');
const dep = fs.readFileSync(path.join(RACINE, '.github', 'workflows', 'deploy.yml'), 'utf8');
dire(/cp plan\.html deploy\//.test(dep), 'le déploiement le copie');
dire(/Plan du site manquant/.test(dep),
  'et son absence ARRÊTE le déploiement au lieu de passer en silence');

console.log(`\n${G}${ok} contrôle(s) au vert, ${ko} au rouge.${R}\n`);
process.exit(ko === 0 ? 0 : 1);
