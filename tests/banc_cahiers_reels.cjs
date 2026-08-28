#!/usr/bin/env node
/* ════════════════════════════════════════════════════════════════════════════
   tests/banc_cahiers_reels.cjs — LES VRAIS CAHIERS, PASSÉS AU MOTEUR
   © 2024-2026 Jacques Miterand TAKOU (Mythe Errant).

     node tests/banc_cahiers_reels.cjs [dossier-de-charge]

   POURQUOI CE BANC EXISTE, ALORS QUE banc_cahier.cjs EST DÉJÀ VERT
   `banc_cahier.cjs` éprouve la RÈGLE (qui écrit, qui lit, qui annote) sur des
   blocs fabriqués pour l'occasion : une dizaine, tous du même type. Il serait
   resté vert le jour où le moteur ignorait `lines` — le bloc le plus fréquent
   des cahiers du 2ⁿᵈ cycle — parce que ses blocs à lui n'en contenaient aucun.
   Un banc qui choisit ses données ne mesure que ce qu'il a bien voulu voir.

   Celui-ci prend les 15 cahiers RÉELS, tels qu'ils partiront chez l'acheteur,
   les passe au moteur, et compte ce qui en sort. Trois questions, une par
   promesse faite à l'acheteur :

     ① EST-CE INTERACTIF ?   combien d'endroits où l'élève peut écrire ?
                             Un cahier qui n'en a aucun n'est pas un cahier.
     ② EST-CE ÉTANCHE ?      un corrigé traîne-t-il dans la charge de l'élève,
                             ou dans l'extrait gratuit ?
     ③ L'EXTRAIT EST-IL UN EXTRAIT ?  ou bien le produit entier, comme
                             « Demo 6e » l'était avant qu'on le mesure ?

   IL N'EST PAS DANS LA CI, ET C'EST VOULU
   Les données vendues ne sont pas dans le dépôt (le dépôt est public) : elles
   vivent dans la charge FTP. La CI ne peut donc pas les voir. Ce banc se lance
   à la main, AVANT le téléversement — c'est le dernier contrôle avant que
   quelqu'un paie.
   ════════════════════════════════════════════════════════════════════════ */
'use strict';
const fs = require('fs');
const path = require('path');
const os = require('os');

const RACINE = path.resolve(__dirname, '..');
const CHARGE = process.argv[2] || path.join(os.homedir(), 'Desktop', 'veritas-ftp');
const PROTEGE = path.join(CHARGE, 'uploads', 'protected', 'livrets');
/* Les extraits ne sont PAS dans la charge FTP : ils sont dans le dépôt, parce
   qu'ils sont publics par destination et que la CI les déploie. Les chercher
   dans la charge, c'était mesurer la version d'avant — le banc a effectivement
   annoncé « 12 % du cahier, 13 leçons » alors que le producteur venait d'en
   écrire 1 % et 2 leçons, à l'autre endroit. */
const PUBLIC = path.join(RACINE, 'livrets');

const V = '\x1b[32m✓\x1b[0m', X = '\x1b[31m✗\x1b[0m', G = '\x1b[1m', R = '\x1b[0m';
let ok = 0, ko = 0;
const dire = (b, m) => { b ? ok++ : ko++; console.log('  ' + (b ? V : X) + ' ' + m); };

/* ── Un DOM juste assez grand ────────────────────────────────────────────────
   `rendre()` écrit son HTML dans `hote.innerHTML` puis appelle `peupler()`,
   qui interroge le document. On ne simule pas un navigateur : on capte la
   chaîne produite et on rend des listes vides aux interrogations. Ce qu'on
   mesure, c'est le HTML — c'est lui qui décide s'il y a un champ ou non. */
function hoteFactice() {
  return { innerHTML: '', querySelectorAll: () => [], querySelector: () => null };
}

const { Cahier } = require(path.join(RACINE, 'livrets', 'cahier.js'));

function blocsDe(fichier) {
  const js = fs.readFileSync(fichier, 'utf8');
  const i = js.indexOf('=');
  return JSON.parse(js.slice(i + 1).trim().replace(/;$/, ''));
}

function rendre(blocs, ouvrage) {
  const hote = hoteFactice();
  const c = new Cahier({ ouvrage, token: 'x', hote, blocs });
  c.rendre();
  return { html: hote.innerHTML, champs: c.champs };
}

/* Le titre d'une leçon, quelle que soit la source : les Bords le mettent dans
   des runs, les cahiers du 2ⁿᵈ cycle dans `titre`. */
function titreDe(b) {
  return String(b.title || b.titre || b.txt
    || (b.r || []).map((r) => (r && r.t) || '').join(' ')).replace(/\s+/g, ' ').trim();
}

function compter(html) {
  const n = (re) => (html.match(re) || []).length;
  return {
    saisie: n(/class="ch-champ[^"]*"/g),
    qcm: n(/class="ch-qcm"/g),
    relier: n(/class="ch-rel-s"/g),
    corrige: n(/class="ch-corrige"/g),
    exos: n(/class="ch-exo"/g),
    textes: n(/class="ch-texte"/g),
    // Un bloc tombé dans le fourre-tout : le moteur ne l'a pas reconnu.
    orphelins: n(/class="ch-p"/g),
  };
}

/* Un corrigé qui a survécu se reconnaît à ce qu'il DIT, pas à sa balise :
   le convertisseur pourrait le ranger sous un autre type sans que la chaîne
   « Corrigé — » disparaisse. On cherche donc le texte.

   Le motif d'origine — `Corrig[ée]\s*[—:-]` — dénonçait onze cahiers sur
   quinze. Aucun ne fuyait : il attrapait « Corrige-les en rayant d'un seul
   trait », c'est-à-dire l'IMPÉRATIF d'une consigne, parce que `[ée]` accepte
   le « e » nu et que le tiret du trait d'union satisfaisait `[—:-]`. Un banc
   qui crie sur du texte innocent finit par ne plus être lu. On exige donc le
   substantif accentué, suivi d'un vrai séparateur. */
const TRACES = [/"y":"corrige"/, /Corrigé\s*[—:]/, /"answer"/];

console.log(`\n${G}LES VRAIS CAHIERS, PASSÉS AU MOTEUR${R}`);
console.log(`Charge : ${CHARGE}\n`);

if (!fs.existsSync(PROTEGE)) {
  console.log(`${X} Charge introuvable : ${PROTEGE}`);
  console.log('  Produire d\'abord :  python tools/normaliser_cahiers.py --charge <dossier>');
  process.exit(2);
}

const fichiers = fs.readdirSync(PROTEGE).filter((f) => /^booklet-.+\.js$/.test(f)).sort();
if (!fichiers.length) { console.log(`${X} aucun booklet-*.js dans la charge`); process.exit(2); }

console.log(`${G}1. ① Chaque cahier est-il vraiment un cahier ?${R}`);
console.log(`  ${'ouvrage'.padEnd(12)}${'écrire'.padStart(7)}${'QCM'.padStart(6)}${'relier'.padStart(7)}`
          + `${'exos'.padStart(6)}${'textes'.padStart(8)}${'inconnus'.padStart(10)}`);

const bilan = [];
for (const f of fichiers) {
  const slug = f.replace(/^booklet-|\.js$/g, '');
  const blocs = blocsDe(path.join(PROTEGE, f));
  const { html, champs } = rendre(blocs, slug);
  const c = compter(html);
  bilan.push({
    slug, c, champs, blocs: blocs.length,
    lignesAttendues: blocs.filter((b) => b && (b.y === 'lines' || b.y === 'ligne')).length,
    lignesRendues: (html.match(/class="ch-champ ch-champ-lignes"/g) || []).length,
  });
  console.log(`  ${slug.padEnd(12)}${String(c.saisie).padStart(7)}${String(c.qcm).padStart(6)}`
    + `${String(c.relier).padStart(7)}${String(c.exos).padStart(6)}`
    + `${String(c.textes).padStart(8)}${String(c.orphelins).padStart(10)}`);
}
console.log('');
for (const b of bilan) {
  dire(b.c.saisie >= 100, `${b.slug} : ${b.c.saisie} endroits où l'élève écrit`);
}
/* ── Le contrôle qui mord vraiment ────────────────────────────────────────
   Le seuil ci-dessus est un garde-fou grossier : éprouvé par mutation, il
   RESTE VERT quand on débranche l'espace d'écriture du moteur, parce que les
   consignes fournissent à elles seules plus de cent champs. Un banc qui ne
   rougit pas quand on casse la règle ne prouve rien.
   Celui-ci compare : autant de blocs `lines` dans la charge, autant d'espaces
   d'écriture dans la page. Un seul manquant, et c'est un exercice sans
   réponse possible. */
for (const b of bilan) {
  if (!b.lignesAttendues) continue;
  dire(b.lignesRendues === b.lignesAttendues,
    `${b.slug} : ${b.lignesRendues}/${b.lignesAttendues} espaces d'écriture réglés rendus`);
}
/* Un bloc sur dix non reconnu passerait inaperçu à l'œil et viderait le cahier
   d'un dixième de sa substance. On borne. */
for (const b of bilan) {
  const part = b.c.orphelins / b.blocs;
  dire(part < 0.12, `${b.slug} : ${(part * 100).toFixed(1)} % de blocs non reconnus (< 12 %)`);
}

console.log(`\n${G}2. Chaque clé d'exercice est unique${R}`);
for (const b of bilan) {
  const vus = new Set(b.champs);
  dire(vus.size === b.champs.length,
    `${b.slug} : ${b.champs.length} clés, ${vus.size} distinctes`);
}

/* Deux produits, deux règles — et les confondre ferait échouer le banc sur un
   comportement voulu.
     LIVRET  l'élève s'entraîne, puis l'enseignant corrige. Un corrigé dans sa
             charge, c'est le cahier qui se corrige tout seul : la fuite.
     BORD    le cahier COMPLET, vendu avec ses corrigés modèles — c'est
             précisément ce qu'on achète. Exiger qu'il n'en porte aucun
             reviendrait à exiger qu'il ne soit pas le produit annoncé.
   Dans les deux cas l'EXTRAIT GRATUIT, lui, n'en porte aucun. */
const estBord = (slug) => /^bord-/.test(slug);

console.log(`\n${G}3. ② Le corrigé est du bon côté de la porte${R}`);
for (const f of fichiers) {
  const slug = f.replace(/^booklet-|\.js$/g, '');
  const js = fs.readFileSync(path.join(PROTEGE, f), 'utf8');
  const trouve = TRACES.filter((re) => re.test(js));
  if (estBord(slug)) {
    dire(true, `${slug} : Bord — vendu avec ses corrigés modèles, c'est le produit`);
  } else {
    dire(trouve.length === 0,
      `${slug} : ${trouve.length ? 'TRACE DE CORRIGÉ — ' + trouve.join(' ') : 'aucune trace de corrigé'}`);
  }
}

console.log(`\n${G}4. ③ L'extrait gratuit est un extrait, pas le produit${R}`);
for (const f of fichiers) {
  const slug = f.replace(/^booklet-|\.js$/g, '');
  const ext = path.join(PUBLIC, `extrait-${slug}.js`);
  if (!fs.existsSync(ext)) { dire(false, `${slug} : extrait absent`); continue; }
  const pv = fs.statSync(path.join(PROTEGE, f)).size;
  const pe = fs.statSync(ext).size;
  const part = pe / pv;
  dire(part < 0.06,
    `${slug} : extrait = ${(part * 100).toFixed(1)} % du cahier (${Math.round(pe / 1024)} Ko)`);

  /* LA règle, telle que Jacques l'a posée : « 2 leçons maximum et non
     suivies ». Un contrôle de poids ne la vérifie pas — un extrait léger peut
     très bien être quatre leçons courtes et consécutives. On compte donc les
     leçons, et on va chercher dans le cahier complet si elles s'y touchent. */
  const bExt = blocsDe(ext);
  const bTout = blocsDe(path.join(PROTEGE, f));
  const estLecon = (b) => b && (b.y === 'lecon' || b.y === 'epreuve');
  const titres = bExt.filter(estLecon).map((b) => titreDe(b));
  dire(titres.length > 0 && titres.length <= 2,
    `${slug} : ${titres.length} leçon(s) dans l'aperçu (2 au plus)`);
  if (titres.length === 2) {
    const rangs = bTout.filter(estLecon).map((b) => titreDe(b));
    const i = rangs.indexOf(titres[0]), j = rangs.indexOf(titres[1]);
    dire(i >= 0 && j >= 0 && Math.abs(j - i) >= 2,
      `${slug} : les deux leçons ne se suivent pas (rangs ${i} et ${j})`);
  }
  // La CI refuse tout .js de plus de 120 Ko dans livrets/ : un extrait qui la
  // dépasse ne se déploierait pas, et l'ouvrage n'aurait plus d'aperçu.
  dire(pe < 120 * 1024, `${slug} : extrait sous le plafond de déploiement (120 Ko)`);
  const js = fs.readFileSync(ext, 'utf8');
  dire(!TRACES.some((re) => re.test(js)), `${slug} : aucun corrigé dans l'extrait`);
}

/* ── Le catalogue connaît-il tout ce qui est déposé ? ───────────────────────
   `tests/ouvrages_en_vente.php` vérifie que chaque entrée du CATALOGUE a un
   prix et une porte. Il ne peut rien dire de l'inverse : un cahier téléversé
   par FTP sans que le catalogue soit régénéré lui est invisible — il n'en
   connaît pas l'existence. Or c'est exactement le geste manuel du quotidien.
   Ce contrôle-ci part du DISQUE et remonte au catalogue. Un cahier déposé mais
   non déclaré ne se vend pas (`vrt_livret_ouvrage_accepte` refuse, et c'est le
   bon sens du refus) — mais personne ne saurait pourquoi. */
console.log(`\n${G}5. Tout cahier déposé est bien au catalogue${R}`);
const fCat = path.join(RACINE, 'api', 'data', 'livrets_catalogue.json');
if (!fs.existsSync(fCat)) {
  dire(false, 'api/data/livrets_catalogue.json absent du dépôt');
} else {
  const cat = JSON.parse(fs.readFileSync(fCat, 'utf8')).ouvrages || {};
  const deposes = fichiers.map((f) => f.replace(/^booklet-|\.js$/g, ''));
  const orphelins = deposes.filter((s) => !cat[s]);
  dire(orphelins.length === 0,
    orphelins.length
      ? `${orphelins.length} cahier(s) déposé(s) hors catalogue : ${orphelins.join(', ')}`
      : `les ${deposes.length} cahiers déposés sont tous au catalogue`);
  const declares = Object.keys(cat).filter((s) => !deposes.includes(s));
  dire(declares.length === 0,
    declares.length
      ? `${declares.length} ouvrage(s) en vente sans contenu : ${declares.join(', ')}`
      : 'aucun ouvrage en vente sans son contenu');
}

console.log(`\n${G}6. Le guide de l'enseignant, lui, PORTE les corrigés${R}`);
const guides = fs.readdirSync(PROTEGE).filter((f) => /^guide-.+\.js$/.test(f)).sort();
if (!guides.length) console.log('  (aucun guide dans cette charge)');
for (const f of guides) {
  const slug = f.replace(/^guide-|\.js$/g, '');
  const js = fs.readFileSync(path.join(PROTEGE, f), 'utf8');
  const n = (js.match(/"y":"corrige"/g) || []).length;
  dire(n >= 50, `${slug} : ${n} corrigés dans le guide`);
  const blocs = blocsDe(path.join(PROTEGE, f));
  const { html } = rendre(blocs, slug);
  dire((html.match(/class="ch-corrige"/g) || []).length >= 50,
    `${slug} : le moteur les rend bien comme corrigés`);
}

console.log('\n' + '─'.repeat(68));
if (ko) { console.log(`\x1b[31m\x1b[1m  ${X} ${ko} contrôle(s) en échec sur ${ok + ko}${R}`); process.exit(1); }
console.log(`\x1b[32m${G}  ✓ ${ok}/${ok} contrôles passés — les cahiers s'écrivent, et rien ne fuit.${R}`);
