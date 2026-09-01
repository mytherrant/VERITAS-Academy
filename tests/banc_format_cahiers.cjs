#!/usr/bin/env node
/**
 * tests/banc_format_cahiers.cjs — LA PAGE SAIT-ELLE LIRE CE QU'ON LUI LIVRE ?
 * © 2024-2026 Jacques Miterand TAKOU (Mythe Errant).
 *
 *   node tests/banc_format_cahiers.cjs
 *
 * POURQUOI CE BANC EXISTE — il manquait, et son absence a coûté une vente.
 *
 * Le 28/08/2026, tous les cahiers ont été ramenés à un format unique :
 * `window.CAHIER_BLOCS`, une liste de blocs plate que rend `livrets/cahier.js`.
 * La normalisation a bien eu lieu côté DONNÉES. Mais huit pages — les quatre
 * cahiers d'élève de 6ᵉ à 3ᵉ et leurs quatre guides — cherchaient toujours
 * `window.BOOKLET` / `window.GUIDE_6E`, le format d'avant. Elles recevaient
 * 1 181 blocs et n'en voyaient aucun.
 *
 * RIEN N'A PLANTÉ. Pas d'exception, pas de ligne dans la console : le sommaire
 * s'affichait sans un chiffre et le livre s'arrêtait là, sous le nom de
 * l'acheteur, filigrane compris. Aucun banc ne l'a vu — celui des codes éprouve
 * la PORTE (qui livrait correctement), celui des cahiers éprouve le MOTEUR (qui
 * rendait correctement). Personne ne vérifiait que la page et le fichier
 * parlaient la même langue. Il a fallu qu'un client se plaigne.
 *
 * CE QU'IL PROUVE
 *   ① aucune page servie ne lit une globale de données ABANDONNÉE ;
 *   ② les données publiques (extraits gratuits) posent le format VIVANT ;
 *   ③ les pages autonomes — celles qui embarquent leurs propres données en
 *      <script src> — restent cohérentes AVEC ELLES-MÊMES, quel que soit leur
 *      format : elles ne reçoivent rien du serveur, rien ne peut les démentir.
 *
 * ⚠️ Les commentaires sont dépouillés avant l'examen. Sans cela, ce banc
 *    refuserait précisément les fichiers qui RACONTENT la panne — dont les huit
 *    coquilles corrigées, dont ce fichier-ci.
 */
'use strict';
const fs = require('fs');
const path = require('path');

const RACINE = path.resolve(__dirname, '..');

/* Le format vivant, et ceux qu'on a quittés. `MANUEL_DATA` n'est PAS abandonné :
   c'est le nom qu'installent les cahiers du 2ⁿᵈ cycle, servis par le lecteur
   générique. Les confondre fermerait quatre cahiers corrects — la faute exacte
   qu'un garde-fou trop pressé a déjà commise le 01/09/2026. */
const VIVANT = 'CAHIER_BLOCS';
const ABANDONNES = /window\.(BOOKLET[A-Z0-9_]*|GUIDE_[A-Z0-9_]+)\b/g;

/* Pages AUTONOMES : elles chargent leurs propres données par <script src>, sans
   passer par la porte. Leur format n'a d'importance que vis-à-vis d'elles-mêmes,
   et il est vérifié comme tel plus bas. */
const AUTONOMES = new Set(['demo-6e.html', 'feuilletage-4e.html']);

let ok = 0, ko = 0;
const dit = (bon, quoi, det) => {
  if (bon) { ok++; console.log('  \x1b[32m✓\x1b[0m ' + quoi); }
  else { ko++; console.log('  \x1b[31m✗\x1b[0m ' + quoi + (det ? '  → ' + det : '')); }
};

/** Le code, sans les commentaires. Un `//` précédé de `:` est une URL. */
function sansCommentaires(src) {
  return String(src)
    .replace(/<!--[\s\S]*?-->/g, ' ')
    .replace(/\/\*[\s\S]*?\*\//g, ' ')
    .replace(/(^|[^:])\/\/[^\n]*/g, '$1 ');
}

function lire(p) { return fs.readFileSync(p, 'utf8'); }

console.log('\n\x1b[1mLE FORMAT DES CAHIERS — la page et le fichier parlent-ils la même langue ?\x1b[0m\n');

// ── ① Aucune page servie ne lit un format abandonné ──────────────────────────
console.log('\x1b[1m1. Aucune page servie ne lit un format abandonné\x1b[0m');
const aExaminer = [];
for (const dir of ['livrets', 'd']) {
  const abs = path.join(RACINE, dir);
  if (!fs.existsSync(abs)) continue;
  for (const f of fs.readdirSync(abs)) {
    if (!/\.(html|js)$/.test(f)) continue;
    if (AUTONOMES.has(f)) continue;
    // Les données publiques sont jugées en ②, pas ici.
    if (/^(demo-|feuilletage-|extrait-)/.test(f)) continue;
    aExaminer.push(path.join(dir, f));
  }
}
dit(aExaminer.length > 10, `${aExaminer.length} fichiers servis examinés`);

const fautifs = [];
for (const rel of aExaminer) {
  const code = sansCommentaires(lire(path.join(RACINE, rel)));
  const trouve = [...new Set((code.match(ABANDONNES) || []))];
  if (trouve.length) fautifs.push(rel + ' → ' + trouve.join(', '));
}
dit(fautifs.length === 0,
    'aucun ne cherche BOOKLET* ni GUIDE_* — les formats d’avant le 28/08/2026',
    fautifs.join(' | '));

// ── ② Les données publiques posent le format vivant ──────────────────────────
console.log('\n\x1b[1m2. Les extraits gratuits posent le format que les pages savent lire\x1b[0m');
const extraits = fs.readdirSync(path.join(RACINE, 'livrets'))
  .filter((f) => /^extrait-.*\.js$/.test(f));
dit(extraits.length > 0, `${extraits.length} extraits gratuits trouvés`);

const malFormes = [];
for (const f of extraits) {
  const tete = lire(path.join(RACINE, 'livrets', f)).slice(0, 400);
  const m = /^[\s﻿]*window\.([A-Za-z_$][A-Za-z0-9_$]*)\s*=/.exec(tete);
  const nom = m ? m[1] : '(aucune)';
  if (nom !== VIVANT) malFormes.push(f + ' pose ' + nom);
}
dit(malFormes.length === 0,
    `tous posent window.${VIVANT}`,
    malFormes.join(' | '));

// ── ③ Les pages autonomes sont d'accord avec leurs propres données ───────────
console.log('\n\x1b[1m3. Les pages autonomes s’accordent avec les données qu’elles embarquent\x1b[0m');
for (const page of AUTONOMES) {
  const abs = path.join(RACINE, 'livrets', page);
  if (!fs.existsSync(abs)) { dit(true, `${page} — absente, rien à vérifier`); continue; }
  const html = lire(abs);
  const code = sansCommentaires(html);
  const lues = new Set((code.match(ABANDONNES) || []).map((s) => s.replace('window.', '')));
  // Ce que ses <script src> locaux posent réellement.
  const posees = new Set();
  for (const m of html.matchAll(/<script[^>]+src=["']\.?\/?([A-Za-z0-9._-]+\.js)["']/g)) {
    const d = path.join(RACINE, 'livrets', m[1]);
    if (!fs.existsSync(d)) continue;
    const t = /^[\s﻿]*window\.([A-Za-z_$][A-Za-z0-9_$]*)\s*=/.exec(lire(d).slice(0, 400));
    if (t) posees.add(t[1]);
  }
  const orphelines = [...lues].filter((g) => !posees.has(g));
  dit(orphelines.length === 0,
      `${page} — les globales lues sont bien celles que ses fichiers posent`,
      'lues sans être posées : ' + orphelines.join(', ')
        + ' (posées : ' + [...posees].join(', ') + ')');
}

console.log('\n' + '─'.repeat(68));
const total = ok + ko;
if (ko === 0) console.log(`\x1b[32m\x1b[1m  ✓ ${ok}/${total} contrôles passés\x1b[0m`);
else console.log(`\x1b[31m\x1b[1m  ✗ ${ko} échec(s) sur ${total}\x1b[0m`);
process.exit(ko === 0 ? 0 : 1);
