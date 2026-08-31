#!/usr/bin/env node
/* ════════════════════════════════════════════════════════════════════════════
   tests/banc_pages_ouvrages.cjs — CHAQUE CAHIER A SA PAGE, ET ELLE DIT VRAI
   © 2024-2026 Jacques Miterand TAKOU (Mythe Errant).

     node tests/banc_pages_ouvrages.cjs

   CE QU'IL PROTÈGE
   Quinze cahiers sont au catalogue et se vendent. Cinq seulement avaient leur
   page. Les dix autres se vendaient par le lecteur générique
   `cahier.html?o=<slug>` — ce qui fonctionne, mais ne laisse RIEN à indexer :
   un parent cherchant « cahier de français 2nde Cameroun » ne pouvait pas
   tomber sur le nôtre.

   Trois pièges gardés fermés ici :

   1. UNE ICÔNE ABSENTE NE DESSINE RIEN, sans un mot dans la console. La
      première version du générateur employait `i-cart`, qui n'existe pas dans
      le sprite : dix boutons d'achat seraient partis sans pictogramme.

   2. LE CONTENU NE S'INVENTE PAS. Le catalogue ne porte que titre, niveau,
      mode et prix. Écrire « 6 séquences » ou « 340 exercices » sur une page
      dont personne n'a ouvert le sommaire, c'est fabriquer un argument de
      vente. Ces pages ne décrivent que la FORME, vraie pour toute la famille.

   3. LE PRIX AFFICHÉ EST CELUI DU CATALOGUE. Une page qui annonce un prix
      que le serveur n'exigera pas fait un client mécontent au guichet.
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

console.log(`\n${G}CHAQUE CAHIER A SA PAGE, ET ELLE DIT VRAI${R}\n`);

const catalogue = JSON.parse(fs.readFileSync(
  path.join(RACINE, 'api', 'data', 'livrets_catalogue.json'), 'utf8')).ouvrages || {};
const slugs = Object.keys(catalogue);
const sprite = fs.readFileSync(path.join(RACINE, 'assets', 'veritas-icons.svg'), 'utf8');

/* ── ① Aucun cahier sans page ───────────────────────────────────────────── */
console.log(`${G}① Aucun cahier du catalogue n'est sans page${R}`);
{
  const sans = slugs.filter(s => !fs.existsSync(path.join(RACINE, 'livrets', s + '.html')));
  dire(sans.length === 0, 'les ' + slugs.length + ' cahiers ont leur page', sans.join(', '));
}

/* ── ② à ④ Chaque page, une par une ─────────────────────────────────────── */
const pages = slugs
  .map(s => ({ slug: s, p: path.join(RACINE, 'livrets', s + '.html') }))
  .filter(x => fs.existsSync(x.p))
  .map(x => Object.assign(x, { t: fs.readFileSync(x.p, 'utf8') }));

/* ⚠️ DEUX NATURES SOUS LE MÊME NOM DE FICHIER, DEUX RÈGLES OPPOSÉES.
   `livrets/6e.html` n'est pas une page de présentation : c'est la COQUILLE
   VERROUILLÉE du cahier, 93 Ko, sans <title>, en `noindex, nofollow`. Et c'est
   juste : c'est le produit lui-même, derrière un code. Exiger d'elle qu'elle
   soit indexable reviendrait à demander qu'on expose la marchandise.
   Les pages produites par `tools/pages_ouvrages.py`, elles, n'existent QUE
   pour être trouvées. On les distingue à ce qu'elles portent des données
   structurées et pèsent quelques kilo-octets. */
const produites = pages.filter(x => x.t.indexOf('application/ld+json') > 0 && x.t.length < 30000);
const coquilles = pages.filter(x => produites.indexOf(x) < 0);

console.log(`\n${G}② Les pages de présentation sont indexables${R}`);
{
  const sansTitre = produites.filter(x => !/<title>[^<]{10,}<\/title>/.test(x.t));
  const sansDesc = produites.filter(x => !/name="description" content="[^"]{40,}"/.test(x.t));
  const sansCanon = produites.filter(x => x.t.indexOf('rel="canonical"') < 0);
  const bloquees = produites.filter(x => /content="noindex/.test(x.t));
  dire(produites.length > 0, produites.length + ' page(s) de présentation trouvée(s)');
  dire(sansTitre.length === 0, 'toutes portent un titre', sansTitre.map(x => x.slug).join(', '));
  dire(sansDesc.length === 0, 'toutes portent une description', sansDesc.map(x => x.slug).join(', '));
  dire(sansCanon.length === 0, 'toutes déclarent leur adresse canonique', sansCanon.map(x => x.slug).join(', '));
  dire(bloquees.length === 0, 'aucune ne s’interdit aux moteurs', bloquees.map(x => x.slug).join(', '));

  /* Deux pages ne doivent pas se disputer le même titre : Google n'en garde
     qu'une, et c'est rarement celle qu'on voulait. */
  const titres = produites.map(x => (x.t.match(/<title>([^<]*)<\/title>/) || [])[1] || '');
  const doublons = titres.filter((v, i) => titres.indexOf(v) !== i);
  dire(doublons.length === 0, 'aucun titre n’est employé deux fois', doublons.join(' | '));
}

console.log(`\n${G}②bis Les coquilles verrouillées restent fermées aux moteurs${R}`);
{
  const ouvertes = coquilles.filter(x => !/content="noindex/.test(x.t));
  dire(ouvertes.length === 0,
    'les ' + coquilles.length + ' coquilles de publier.py gardent leur noindex — c’est le produit, pas sa vitrine',
    ouvertes.map(x => x.slug).join(', '));
}

console.log(`\n${G}③ Aucune icône fantôme${R}`);
{
  const fautives = [];
  for (const x of pages) {
    for (const m of x.t.match(/veritas-icons\.svg#([a-z-]+)/g) || []) {
      const id = m.split('#')[1];
      if (sprite.indexOf('id="' + id + '"') < 0) fautives.push(x.slug + ' → ' + id);
    }
  }
  dire(fautives.length === 0,
    'chaque pictogramme employé existe dans le sprite — sinon il ne dessine rien',
    fautives.slice(0, 4).join(', '));
}

console.log(`\n${G}④ Le prix affiché est celui du catalogue${R}`);
{
  const faux = [], sansLd = [];
  for (const x of pages) {
    const m = x.t.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/);
    if (!m) continue;                        // les coquilles de publier.py n'en ont pas
    let d;
    try { d = JSON.parse(m[1]); } catch (e) { sansLd.push(x.slug); continue; }
    const attendu = String(catalogue[x.slug].prix || 0);
    const dit = String(((d.offers || {}).price) || '');
    if (dit && dit !== attendu) faux.push(x.slug + ' : ' + dit + ' au lieu de ' + attendu);
  }
  dire(sansLd.length === 0, 'les données structurées sont lisibles', sansLd.join(', '));
  dire(faux.length === 0, 'et le prix annoncé est celui du catalogue', faux.join(', '));
}

/* ── ⑤ Rien d'inventé sur le contenu ────────────────────────────────────── */
console.log(`\n${G}⑤ Aucune page ne décrit un contenu que personne n'a ouvert${R}`);
{
  /* Le catalogue ne dit ni le nombre de séquences ni celui des exercices. Une
     page qui l'annonce l'a fabriqué. On ne regarde que les pages produites par
     le générateur : les coquilles de `publier.py` embarquent le vrai sommaire
     et ont donc le droit de compter. */
  /* ⚠️ NE PAS SE CONTENTER DU TEXTE VISIBLE. Première version de ce contrôle :
     elle retirait les balises puis cherchait le décompte. Une mutation d'essai
     glissant « 6 séquences » dans la MÉTA DESCRIPTION est passée au vert — or
     c'est exactement le texte que Google affiche sous le lien. Un mensonge
     dans un résultat de recherche est lu par plus de monde que la page.
     On inspecte donc les trois endroits qui parlent au lecteur : le corps, le
     titre, et la description. */
  const inventes = [];
  for (const x of produites) {
    const morceaux = [
      x.t.replace(/<[^>]*>/g, ' '),
      (x.t.match(/<title>([^<]*)<\/title>/) || [])[1] || '',
      (x.t.match(/name="description" content="([^"]*)"/) || [])[1] || ''
    ];
    for (const bout of morceaux) {
      const m = bout.match(/\b\d+\s*(séquences?|exercices?|leçons?|pages?|chapitres?)\b/i);
      if (m) { inventes.push(x.slug + ' : « ' + m[0].trim() + ' »'); break; }
    }
  }
  dire(inventes.length === 0,
    produites.length + ' pages produites, aucune n’avance un décompte de contenu',
    inventes.slice(0, 4).join(', '));
}

/* ── ⑥ Une seule autorité sur « est-ce publié ? » ───────────────────────── */
console.log(`\n${G}⑥ La disponibilité se calcule à UN seul endroit${R}`);
{
  const lib = fs.readFileSync(path.join(RACINE, 'api', '_livret_lib.php'), 'utf8');
  const pd = fs.readFileSync(path.join(RACINE, 'api', 'public_data.php'), 'utf8');
  dire(lib.indexOf('function vrt_livret_etat') > 0,
    'le helper partagé existe dans _livret_lib.php');
  dire((pd.match(/vrt_livret_etat\(/g) || []).length >= 2,
    'public_data.php l’appelle — devanture ET repli sans base');
  /* Le défaut d'origine : la devanture publiait tout ouvrage tarifé sans
     vérifier qu'il y avait quelque chose à livrer. */
  dire(pd.indexOf("'/livrets/cahier.html?o='") < 0,
    'et il ne fabrique plus le lien lui-même — le serveur le dit');
}

console.log(`\n${G}${ok} contrôle(s) au vert, ${ko} au rouge.${R}\n`);
process.exit(ko === 0 ? 0 : 1);
