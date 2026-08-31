#!/usr/bin/env node
/* ════════════════════════════════════════════════════════════════════════════
   tests/banc_tunnel_article.cjs — LE TUNNEL FACTURE CE QU'ON A CLIQUÉ
   © 2024-2026 Jacques Miterand TAKOU (Mythe Errant).

     node tests/banc_tunnel_article.cjs

   CE QU'IL PROTÈGE
   Le tunnel de paiement de la vitrine facturait 5 000 F l'unité, EN DUR :

       function montantTotal(){ return 5000 * S.qte + [0,1000,2500][S.livr]; }

   Le produit cliqué n'entrait nulle part dans le calcul. Le récapitulatif
   affichait « Spécial BAC — Français Tˡᵉ » quoi qu'il arrive — un ouvrage
   absent de tous les catalogues — et la ligne envoyée au prestataire
   s'appelait « Cahier VÉRITAS ». Un cahier vendu 1 500 F était donc encaissé
   5 000 F, sous un nom que le centre n'aurait rattaché à aucune commande.

   S'y ajoutait une « Remise catalogue » de − 1 500 F déduite d'un sous-total
   de 6 500 F : une réduction affichée sur un prix jamais pratiqué.

   CE QUE LE BANC EXIGE
   Le montant suit le prix du produit ; le libellé porte son titre ; changer
   de rayon ne décale pas la correspondance carte → produit ; et sans article
   connu le montant vaut zéro, pour que `payer()` refuse au lieu d'inventer.

   MÉTHODE — on EXÉCUTE les fonctions extraites de assets/vitrine.js. Lire le
   fichier dirait qu'il contient « prixUnitaire », pas qu'il calcule juste.
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

console.log(`\n${G}LE TUNNEL FACTURE CE QU'ON A CLIQUÉ${R}\n`);

const src = fs.readFileSync(path.join(RACINE, 'assets', 'vitrine.js'), 'utf8');

/* ── Extraction : une fonction déclarée à deux espaces d'indentation ────── */
function extraire(nom) {
  const tete = '\n  function ' + nom + '(';
  const i = src.indexOf(tete);
  if (i < 0) return null;
  const j = src.indexOf('\n  }\n', i);
  if (j < 0) return null;
  return src.slice(i + 1, j + '\n  }'.length + i - i + j) && src.slice(i + 1, j + 4);
}

const NOMS = ['prixUnitaire', 'fraisLivraison', 'montantTotal', 'libelleCommande', 'produitDeLaCarte'];
const corps = {};
for (const n of NOMS) corps[n] = extraire(n);
const manquantes = NOMS.filter(n => !corps[n]);
dire(manquantes.length === 0, 'les fonctions du tunnel sont extractibles', manquantes.join(', '));
if (manquantes.length) { console.log(`\n${ok} au vert, ${ko} au rouge.\n`); process.exit(1); }

/* ── Bac à sable : un S mutable et un DOM minimal ───────────────────────── */
function monter(etat, cartesDOM, sources) {
  const S = Object.assign({ qte: 1, livr: 0, filtre: 0, article: null }, etat);
  const document = {
    querySelectorAll(sel) {
      return sel === '[data-vrt-item="manuels"]' ? (cartesDOM || []) : [];
    }
  };
  const sourcesAffichees = sources || [];
  const f = new Function('S', 'document', 'sourcesAffichees',
    Object.values(corps).join('\n\n') +
    '\nreturn { prixUnitaire, fraisLivraison, montantTotal, libelleCommande, produitDeLaCarte };');
  return f(S, document, sourcesAffichees);
}

/* ── ① Le montant suit le prix du produit ───────────────────────────────── */
console.log(`${G}① Le montant suit le prix de l'article${R}`);
{
  const api = monter({ article: { titre: 'Cahier 4ᵉ', prix: 1500 }, qte: 1, livr: 0 });
  dire(api.montantTotal() === 1500,
    'un cahier à 1 500 F retiré au centre est facturé 1 500 F', 'obtenu ' + api.montantTotal());
}
{
  const api = monter({ article: { titre: 'Cahier 4ᵉ', prix: 1500 }, qte: 3, livr: 1 });
  dire(api.montantTotal() === 1500 * 3 + 1000,
    'trois exemplaires livrés à Douala : 3 × 1 500 + 1 000', 'obtenu ' + api.montantTotal());
}
{
  const a = monter({ article: { titre: 'A', prix: 1500 }, qte: 1, livr: 0 }).montantTotal();
  const b = monter({ article: { titre: 'B', prix: 9000 }, qte: 1, livr: 0 }).montantTotal();
  dire(a !== b, 'deux produits de prix différents ne donnent pas le même total',
    'les deux valent ' + a);
  dire(a !== 5000 && b !== 5000,
    'et aucun ne retombe sur les 5 000 F de la version fautive');
}

/* ── ② Sans article, on ne facture rien ─────────────────────────────────── */
console.log(`\n${G}② Sans article connu, le montant est nul${R}`);
for (const [libelle, art] of [
  ['aucun article', null],
  ['un article sans prix', { titre: 'X' }],
  ['un prix à zéro', { titre: 'X', prix: 0 }],
  ['un prix illisible', { titre: 'X', prix: 'cinq mille' }]
]) {
  const api = monter({ article: art, qte: 2, livr: 2 });
  dire(api.montantTotal() === 0,
    libelle + ' → montant nul, donc payer() refuse', 'obtenu ' + api.montantTotal());
}

/* ── ③ Le libellé nomme l'ouvrage ───────────────────────────────────────── */
console.log(`\n${G}③ Le versement porte le nom de l'ouvrage${R}`);
{
  const api = monter({ article: { titre: 'Mon Cahier de français 4ᵉ', prix: 1500 }, qte: 2, livr: 1 });
  const l = api.libelleCommande();
  dire(l.indexOf('Mon Cahier de français 4ᵉ') === 0,
    'le libellé commence par le titre réel', l);
  dire(l.indexOf('Cahier VÉRITAS') < 0,
    'et ne porte plus le nom générique qui empêchait tout rapprochement', l);
  dire(monter({ article: null }).libelleCommande() === '',
    'sans article, aucun libellé n’est fabriqué');
}

/* ── ④ Le rang de la carte désigne le bon produit ───────────────────────── */
console.log(`\n${G}④ La carte cliquée désigne SON produit${R}`);
{
  const btns = [{}, {}, {}];
  const cartes = btns.map(b => ({ contains: x => x === b }));
  const sources = [
    { id: 'a', titre: 'Cahier 6ᵉ', prix: 1500, cls: '6ᵉ', pages: 120, apercu: true },
    { id: 'b', titre: 'Cahier 4ᵉ', prix: 1500, cls: '4ᵉ' },
    { id: 'c', titre: 'Roman', prix: 4000, cls: '' }
  ];
  const api = monter({}, cartes, sources);
  const p0 = api.produitDeLaCarte(btns[0]);
  const p2 = api.produitDeLaCarte(btns[2]);
  dire(p0 && p0.id === 'a', 'la première carte rend le premier produit', p0 && p0.id);
  dire(p2 && p2.id === 'c' && p2.prix === 4000,
    'la troisième rend le troisième, avec SON prix', p2 && p2.prix);
  dire(p0 && p0.detail === '6ᵉ · 120 pages', 'le détail vient du produit', p0 && p0.detail);
  dire(p0 && p0.note === 'Aperçu gratuit avant achat' && p2 && p2.note === '',
    'la mention n’est portée que si le flux l’affirme');
}
{
  /* La grille pré-rendue au build n'a pas de sources : rien ne doit partir. */
  const btn = {};
  const api = monter({}, [{ contains: x => x === btn }], []);
  dire(api.produitDeLaCarte(btn) === null,
    'une carte du pré-rendu, sans source, ne vend rien');
}
{
  /* Un produit gratuit ou sans prix n'ouvre pas le tunnel. */
  const btn = {};
  const api = monter({}, [{ contains: x => x === btn }], [{ id: 'z', titre: 'Z', prix: 0 }]);
  dire(api.produitDeLaCarte(btn) === null, 'un produit sans prix ne vend rien non plus');
}

/* ── ⑤ Ce que la page servie ne doit plus contenir ──────────────────────── */
console.log(`\n${G}⑤ La page servie ne vante plus un produit inexistant${R}`);
{
  const html = fs.readFileSync(path.join(RACINE, 'vitrine.html'), 'utf8');
  const vivant = html.replace(/<!--[\s\S]*?-->/g, '');   // hors commentaires
  dire(vivant.indexOf('Le plus vendu du catalogue') < 0,
    'plus de pastille « le plus vendu » — le centre ne publie aucun chiffre de vente');
  dire(vivant.indexOf('6 500 F') < 0,
    'plus de prix barré à 6 500 F, qui n’a jamais été pratiqué');
  dire(vivant.indexOf('−23 %') < 0 && vivant.indexOf('-23 %') < 0,
    'plus de remise de 23 % calculée sur ce prix');
  for (const h of ['articleTitre', 'articleDetail', 'articleNote']) {
    dire(html.indexOf('data-vrt-val="' + h + '"') > 0,
      'le récapitulatif expose la fente « ' + h + ' »');
  }
  dire(html.indexOf('data-vrt-img="article"') > 0,
    'et la couverture du récapitulatif est pilotable');
}

console.log(`\n${G}${ok} contrôle(s) au vert, ${ko} au rouge.${R}\n`);
process.exit(ko === 0 ? 0 : 1);
