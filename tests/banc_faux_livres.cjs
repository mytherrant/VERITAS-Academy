#!/usr/bin/env node
/* ════════════════════════════════════════════════════════════════════════════
   tests/banc_faux_livres.cjs — LA BOUTIQUE NE VEND QUE CE QUI EXISTE
   © 2024-2026 Jacques Miterand TAKOU (Mythe Errant).

     node tests/banc_faux_livres.cjs

   CE QU'IL PROTÈGE
   Cinq manuels étaient semés dans `defaultDB()` : « Mathématiques 3ème » chez
   « MINESEC Éditions », « Français Tle A » chez « Éditions Clé »… Aucun n'a
   jamais existé — `content:{}` vide, un extrait de trois lignes écrit pour la
   démonstration, des avis inventés. Ils portaient un PRIX et un bouton
   d'achat : un visiteur pouvait payer un livre inexistant. C'est la panne dont
   on ne se relève pas commercialement, et personne au centre ne l'aurait su.

   Les retirer du seed ne suffit pas : une base déjà créée ne rejoue jamais le
   seed. Une migration les sort donc aussi des bases existantes — mais elle ne
   doit PAS supprimer à l'aveugle : « b1 » est un identifiant assez court pour
   avoir été réattribué à un vrai livre par l'administration.

   CE QU'IL VÉRIFIE
     ① les cinq fiches intactes disparaissent ;
     ② un livre du seed RENOMMÉ est gardé — quelqu'un se l'est approprié ;
     ③ un livre du seed qui a reçu du CONTENU est gardé ;
     ④ un livre du seed qui a été ACHETÉ est gardé — sinon l'acheteur perd la
       trace de ce qu'il a payé ;
     ⑤ les vrais livres ne sont jamais touchés ;
     ⑥ la migration est idempotente et inscrit les retraits au registre, sinon
       une vieille base qui se resynchronise les ferait revenir.

   COMMENT — on n'écrit pas une copie de la règle : on EXTRAIT le code réel de
   app.js et on l'exécute contre des bases fabriquées. Un banc qui réimplémente
   ce qu'il teste ne teste que sa propre réimplémentation.
   ════════════════════════════════════════════════════════════════════════ */
'use strict';
const fs = require('fs');
const path = require('path');

const RACINE = path.resolve(__dirname, '..');
const V = '\x1b[32m✓\x1b[0m', X = '\x1b[31m✗\x1b[0m', G = '\x1b[1m', R = '\x1b[0m';
let ok = 0, ko = 0;
const dire = (b, m, d) => { b ? ok++ : ko++; console.log('  ' + (b ? V : X) + ' ' + m + (!b && d ? '  → ' + d : '')); };

/* Extraction de l'IIFE `_retirerFauxLivres` telle qu'elle est dans app.js. */
const appjs = fs.readFileSync(path.join(RACINE, 'app.js'), 'utf8');
const DEBUT = '(function _retirerFauxLivres(){';
const i = appjs.indexOf(DEBUT);
if (i < 0) { console.log(`${X} _retirerFauxLivres introuvable dans app.js`); process.exit(1); }
// On coupe à la fermeture de l'IIFE, en comptant les accolades.
let prof = 0, fin = -1;
for (let k = i + DEBUT.length - 1; k < appjs.length; k++) {
  if (appjs[k] === '{') prof++;
  else if (appjs[k] === '}') { prof--; if (prof === 0) { fin = appjs.indexOf(')();', k) + 4; break; } }
}
const SOURCE = appjs.slice(i, fin);

/** Exécute la vraie migration contre une base donnée, et rend la base après. */
function migrer(db) {
  const bac = { DB: db, console: { info() {}, warn() {} } };
  new Function('DB', 'console', SOURCE)(bac.DB, bac.console);
  return bac.DB;
}

const SEED = () => ([
  { id: 'b1', titre: 'Mathématiques 3ème', auteur: 'MINESEC Éditions', prix: 5000, content: {} },
  { id: 'b2', titre: 'Français Tle A', auteur: 'Éditions Clé', prix: 6000, content: {} },
  { id: 'b3', titre: 'Physique-Chimie 2nde', auteur: 'MINESEC Éditions', prix: 5500, content: {} },
  { id: 'b4', titre: 'SVT 4ème', auteur: 'Bio-Sciences', prix: 4500, content: {} },
  { id: 'b5', titre: 'Histoire-Géographie 3ème', auteur: 'MINESEC', prix: 4000, content: {} },
]);
const ids = (db) => (db.books || []).map((b) => b.id).join(',') || '(aucun)';

console.log(`\n${G}LA BOUTIQUE NE VEND QUE CE QUI EXISTE${R}\n`);

console.log(`${G}1. ① Les cinq fiches de démonstration disparaissent${R}`);
let db = migrer({ books: SEED(), bookPurchases: [] });
dire((db.books || []).length === 0, 'les 5 faux livres sont retirés', ids(db));
dire((db._livresRetires || []).length === 5,
  'et inscrits au registre des retraits (une vieille base ne les ramènera pas)',
  JSON.stringify(db._livresRetires));

console.log(`\n${G}2. ⑤ Un vrai livre n'est jamais touché${R}`);
db = migrer({
  books: SEED().concat([{ id: 'tubedigestif', titre: 'Le Tube digestif', auteur: 'Mythe Errant', prix: 1000 }]),
  bookPurchases: [],
});
dire(ids(db) === 'tubedigestif', 'seul le vrai livre reste', ids(db));

console.log(`\n${G}3. ② Un livre du seed RENOMMÉ est gardé${R}`);
/* L'administration a réutilisé l'identifiant pour un vrai ouvrage. Le
   supprimer effacerait le travail de quelqu'un. */
let s = SEED(); s[0].titre = 'Mon Cahier de français 3ᵉ'; s[0].auteur = 'Centre VÉRITAS';
db = migrer({ books: s, bookPurchases: [] });
dire(ids(db) === 'b1', 'le livre renommé survit, les quatre autres partent', ids(db));

console.log(`\n${G}4. ③ Un livre du seed pourvu de CONTENU est gardé${R}`);
for (const [champ, valeur] of [['fichierUrl', 'uploads/x.pdf'],
                               ['previewImages', ['p1.jpg']],
                               ['chaps', ['Chapitre 1']]]) {
  s = SEED(); s[1][champ] = valeur;
  db = migrer({ books: s, bookPurchases: [] });
  dire(ids(db) === 'b2', `un livre avec « ${champ} » survit`, ids(db));
}

console.log(`\n${G}5. ④ Un livre du seed ACHETÉ est gardé${R}`);
db = migrer({ books: SEED(), bookPurchases: [{ id: 'a1', bid: 'b3', eid: 'e1' }] });
dire(ids(db) === 'b3', 'le livre acheté survit — l’acheteur garde sa trace', ids(db));

console.log(`\n${G}6. ⑥ La migration est idempotente${R}`);
db = migrer({ books: SEED(), bookPurchases: [] });
const apres1 = JSON.stringify(db._livresRetires);
db = migrer(db);
dire(JSON.stringify(db._livresRetires) === apres1,
  'un second passage ne duplique pas le registre', JSON.stringify(db._livresRetires));
db = migrer({ books: [], bookPurchases: [] });
dire(!(db._livresRetires || []).length, 'une base sans livre n’invente pas de retrait');

console.log(`\n${G}7. Le seed d'app.js ne contient plus de faux livre${R}`);
const iB = appjs.indexOf('\n  books:[');
const bloc = appjs.slice(iB, appjs.indexOf('\n  ],', iB));
dire(!/\{id:'b[1-5]'/.test(bloc), 'defaultDB() ne sème plus les cinq manuels inventés');
dire(!/MINESEC Éditions|Éditions Clé|Bio-Sciences/.test(bloc),
  'et plus aucun éditeur inventé n’y figure');

console.log(`\n${G}8. Le seul livre du catalogue porte sa couverture${R}`);
const cat = JSON.parse(fs.readFileSync(path.join(RACINE, 'catalogue_livres.json'), 'utf8'));
for (const l of cat.livres) {
  dire(!!l.coverImg, `« ${l.titre} » a une couverture`, JSON.stringify(l.coverImg));
  dire(fs.existsSync(path.join(RACINE, l.coverImg || 'x')),
    `et le fichier existe : ${l.coverImg}`);
}

console.log('\n' + '─'.repeat(68));
if (ko) { console.log(`\x1b[31m${G}  ${X} ${ko} contrôle(s) en échec sur ${ok + ko}${R}`); process.exit(1); }
console.log(`\x1b[32m${G}  ✓ ${ok}/${ok} — rien en vitrine qui n'existe pas.${R}`);
