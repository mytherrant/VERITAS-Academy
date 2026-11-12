/* ============================================================================
   VÉRITAS — Les chiffres annoncés sur la vitrine sont-ils ceux du site ?
   ----------------------------------------------------------------------------
   Règle du projet : on n'invente ni activité ni statistique. Ce contrôle la
   rend vérifiable au lieu de la laisser à la bonne volonté.

   Le 28/08/2026, la vitrine annonçait « 3 854 exercices corrigés » à onze
   endroits — méta-description et aperçu Twitter compris. Les pages réellement
   générées dans corriges/ en totalisaient 3 716. Cent trente-huit corrigés
   annoncés n'existaient pas, et le chiffre le plus répété du site était le
   plus faux.

   La répartition par classe était pire : une seule des sept valeurs (la 3ᵉ)
   correspondait à quelque chose. Les six autres n'étaient adossées à rien.

   Ce que le contrôle fait : il RECOMPTE depuis corriges/<niveau>/index.html —
   les pages que la CI déploie — et exige que la vitrine dise la même chose.
   Le compte bouge à chaque publication de corrigés ; le test suit tout seul.

   Lancer :  node tests/chiffres_annonces.cjs
   ========================================================================== */
'use strict';
const fs = require('fs');
const path = require('path');

const RACINE = path.join(__dirname, '..');
let echecs = 0;
const t = (cond, msg) => {
  console.log((cond ? '  \x1b[32m✓\x1b[0m ' : '  \x1b[31m✗\x1b[0m ') + msg);
  if (!cond) echecs++;
};

console.log('\n\x1b[1mLES CHIFFRES ANNONCÉS SONT-ILS COMPTÉS QUELQUE PART ?\x1b[0m\n');

/* ── 1. Ce qui existe réellement ──────────────────────────────────────────
   On lit le total que build_corriges.py a écrit dans chaque page de niveau.
   C'est la source : elle est générée depuis le contenu, pas saisie à la main. */
const NIVEAUX = ['6e', '5e', '4e', '3e', '2nde', '1ere', 'tle'];
const reel = {};
let total = 0;
for (const niv of NIVEAUX) {
  const p = path.join(RACINE, 'corriges', niv, 'index.html');
  if (!fs.existsSync(p)) continue;
  const m = fs.readFileSync(p, 'utf8').match(/(\d[\d\s ]*) exercices corrigés pour/);
  if (!m) continue;
  const n = parseInt(m[1].replace(/[\s ]/g, ''), 10);
  reel[niv] = n;
  total += n;
}

t(Object.keys(reel).length === NIVEAUX.length,
  `les ${Object.keys(reel).length} pages de niveau annoncent chacune leur total`);

/* 22/10/2026 — « Recompte et affiche les vrais chiffres » (Jacques). La vitrine
   ne comptait que les anciens cahiers « Bord » (9 709 exercices, 90 pages) et
   taisait les corrigés des cahiers 2026-2027, publiés depuis le 05/10. On les
   ajoute, lus dans le <title> que build_corriges_2c écrit d'après le contenu.
   Le « livret à compléter » regroupe ces MÊMES cahiers par onglets : il ne
   s'ajoute pas. La liste des dossiers vient de build_corriges.py (ORDRE_2026),
   pour qu'un cahier publié demain entre dans le compte sans toucher au banc. */
const ordre2026 = (fs.readFileSync(path.join(RACINE, 'tools', 'build_corriges.py'), 'utf8')
  .match(/ORDRE_2026\s*=\s*\[([^\]]*)\]/) || [, ''])[1]
  .match(/"[^"]+"/g)?.map((s) => s.slice(1, -1)) || [];
t(ordre2026.length > 0, `liste des cahiers 2026-2027 lue dans build_corriges.py (${ordre2026.length} entrées)`);
const dossiers = [...NIVEAUX];
for (const slug of ordre2026) {
  const p = path.join(RACINE, 'corriges', slug, 'index.html');
  if (!fs.existsSync(p)) continue;                 // cahier pas encore publié
  const m = fs.readFileSync(p, 'utf8').match(/<title>[^<]*?(\d[\d\s  ]*) exercices/);
  if (!m) { t(false, `corriges/${slug}/ ne dit pas son nombre d'exercices`); continue; }
  const n = parseInt(m[1].replace(/[\s  ]/g, ''), 10);
  reel[slug] = n;
  total += n;
  dossiers.push(slug);
}
t(total > 0, `total réel des corrigés publiés : ${total}`);

/* Les pages de corrigés : une par séquence/module dans chaque dossier, plus les
   trois cahiers scientifiques et techniques (est-*.html). Les sommaires
   (index.html) ne sont pas des pages de corrigés. */
let pages = 0;
for (const d of dossiers) {
  const dir = path.join(RACINE, 'corriges', d);
  if (fs.existsSync(dir)) pages += fs.readdirSync(dir).filter((f) => f.endsWith('.html') && f !== 'index.html').length;
}
pages += fs.readdirSync(path.join(RACINE, 'corriges')).filter((f) => /^est-.*\.html$/.test(f)).length;

/* ── 2. Ce que la vitrine annonce ─────────────────────────────────────────
   On lit la PAGE LIVRÉE, pas la maquette : c'est elle que le visiteur reçoit,
   et c'est au build que les chiffres pourraient se perdre. */
const vitrine = path.join(RACINE, 'vitrine.html');
if (!fs.existsSync(vitrine)) {
  t(false, 'vitrine.html est absente — lancer tools/build_vitrine.js d’abord');
} else {
  const v = fs.readFileSync(vitrine, 'utf8');

  /* Tout nombre à quatre chiffres suivi de « exercices corrigés ». */
  const annonces = [...v.matchAll(/(\d[\d\s ]{2,6})\s*exercices corrig/g)]
    .map((m) => parseInt(m[1].replace(/[\s ]/g, ''), 10))
    .filter((n) => n > 999);
  const distincts = [...new Set(annonces)];

  t(distincts.length <= 1,
    distincts.length <= 1
      ? `un seul total annoncé sur toute la page (${distincts[0] ?? '—'}), répété ${annonces.length} fois`
      : `la page annonce PLUSIEURS totaux différents : ${distincts.join(' / ')}`);

  if (distincts.length === 1) {
    t(distincts[0] === total,
      distincts[0] === total
        ? `le total annoncé (${distincts[0]}) est bien celui des corrigés publiés`
        : `la vitrine annonce ${distincts[0]} corrigés, il en existe ${total} — écart de ${Math.abs(distincts[0] - total)}`);
  }

  const annoncesPages = [...v.matchAll(/(\d[\d\s  ]*)\s*pages de corrigés/g)]
    .map((m) => parseInt(m[1].replace(/[\s  ]/g, ''), 10));
  for (const n of new Set(annoncesPages)) {
    t(n === pages,
      n === pages
        ? `« ${n} pages de corrigés » : c’est bien le nombre de pages publiées`
        : `la vitrine annonce ${n} pages de corrigés, il en existe ${pages}`);
  }

  /* La répartition par classe doit s'additionner au total, sinon les deux
     chiffres se contredisent sur la même page. */
  const parClasse = [...v.matchAll(/"vnb-n"[^>]*>([\d\s ]+)</g)]
    .map((m) => parseInt(m[1].replace(/[\s ]/g, ''), 10))
    .filter((n) => !isNaN(n) && n > 0);
  if (parClasse.length >= 7) {
    const somme = parClasse.slice(0, 7).reduce((a, b) => a + b, 0);
    t(somme === total,
      somme === total
        ? `la répartition par classe s’additionne bien au total (${somme})`
        : `la répartition par classe fait ${somme}, le total annoncé ${total}`);
  }
}

/* ── 3. Les autres pages qui annoncent le total (28/10/2026) ─────────────
   Contre-expertise : 14 049 sur l'accueil, 9 709 sur /corriges/, 4 212 sur
   /adopter/ et la Constellation. Jacques a tranché : un seul nombre, le total
   réel. Ces pages ne passaient par aucun banc. On lit tout nombre de plus de
   quatre chiffres suivi de « exercices » ; la phrase qui renvoie aux seuls
   anciens cahiers (« Les N corrigés, tous niveaux réunis ») n'en est pas un. */
for (const rel of ['corriges/index.html', 'adopter/index.html', 'constellation.html', 'manuels.html']) {
  const p = path.join(RACINE, rel);
  if (!fs.existsSync(p)) continue;
  const h = fs.readFileSync(p, 'utf8');
  /* /corriges/ détaille aussi un total PAR CLASSE (cartes « 1 151 exercices
     corrigés ») : seules ses annonces globales — titre, descriptions, en-tête —
     doivent porter le total. */
  const motif = rel === 'corriges/index.html'
    ? /(?:Terminale — |content="|"description":"|<p>)(\d{1,3}[\s  ]\d{3})\s*exercices/g
    : /(\d{1,3}[\s  ]\d{3})\s*exercices/g;
  const vus = [...h.matchAll(motif)]
    .map((m) => parseInt(m[1].replace(/[\s  ]/g, ''), 10))
    .filter((n) => n > 999);
  const faux = [...new Set(vus)].filter((n) => n !== total);
  t(vus.length > 0 && faux.length === 0,
    faux.length === 0
      ? `${rel} annonce le total réel (${total}), ${vus.length} fois`
      : `${rel} annonce ${faux.join(' / ')} exercices au lieu de ${total}`);
}

console.log('\n  Détail réel par niveau :');
for (const [k, n] of Object.entries(reel)) console.log(`    ${k.padEnd(6)} ${n}`);

/* ── L'HISTOIRE DU CENTRE NE S'INVENTE PAS ────────────────────────────────
   Trouvé le 29/08/2026 dans la section « Notre Histoire » de l'application :
   un sous-titre « 20 ans d'excellence » ÉCRIT EN DUR, au-dessus d'une frise
   elle aussi en dur qui datait la fondation de 2023 — trois ans, pas vingt.
   La frise contenait deux entrées « 2023 », un « statut d'établissement agréé
   par le MINESEC » affirmé pour 2024 (une affirmation réglementaire qu'on
   n'invente pas), et une « adaptation aux cours à distance pendant la période
   COVID-19 » datée de 2024 — le COVID est de 2020.
   Ces deux blocs viennent désormais de l'administration
   (`publicInfo.histoireSous`, `publicInfo.jalons`) et ne s'affichent pas tant
   qu'elle n'a rien écrit. */
{
  const appjs = fs.readFileSync(path.join(RACINE, 'app.js'), 'utf8');
  console.log('\n\x1b[1mL’HISTOIRE DU CENTRE EST-ELLE ÉCRITE PAR LE CENTRE ?\x1b[0m\n');
  t(!/20 ans d.excellence au service/.test(appjs),
    '« 20 ans d’excellence » n’est plus écrit en dur (ni sa traduction)');
  t(!/Fondation du centre","Ouverture avec 15/.test(appjs),
    'la frise inventée a disparu');
  t(!/agréé par le MINESEC/.test(appjs),
    'plus aucun agrément MINESEC affirmé dans le code');
  t(!/COVID-19/.test(appjs) || !/2024","Innovation/.test(appjs),
    'plus de COVID daté de 2024');
  t(/pi\.histoireSous/.test(appjs),
    'le sous-titre vient de l’administration');
  t(/pi\.jalons/.test(appjs) && /if\(!_j\.length\) return ''/.test(appjs),
    'la frise vient de l’administration, et disparaît quand elle est vide');
  t(/cms_histoireSous/.test(appjs) && /cms_jalons/.test(appjs),
    'les deux champs sont éditables — retirer sans donner de quoi remplacer serait pire');
  t(/DB\.publicInfo\.jalons=String\(_jel\.value/.test(appjs),
    'et la saisie des jalons est bien enregistrée');
}

console.log('\n' + '─'.repeat(68));
if (echecs) {
  console.log(`  \x1b[31m\x1b[1m${echecs} échec(s) — un chiffre annoncé n’est adossé à rien.\x1b[0m`);
  process.exit(1);
}
console.log('  \x1b[32m\x1b[1m✓ Chaque chiffre annoncé se recompte depuis le contenu publié.\x1b[0m');
