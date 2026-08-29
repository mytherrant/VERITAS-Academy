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
t(total > 0, `total réel des corrigés publiés : ${total}`);

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
