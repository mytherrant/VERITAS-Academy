/* ══════════════════════════════════════════════════════════════════════════
   tests/banc_cles_oeuvres_1c.cjs — DEUX RÉPONSES NE PARTAGENT PAS UNE CLÉ
   © 2024-2026 Jacques Miterand TAKOU (Mythe Errant).

   CE QU'IL PROTÈGE
     Les quatre cahiers d'œuvres du 1er cycle rangeaient chaque réponse sous
     « <œuvre>.<indice du bloc> » — `page.partId + '.' + bi`. Deux défauts dans
     une seule ligne :

       ① `partId` est l'ŒUVRE, pas le chapitre, et `bi` repart de zéro à chaque
          chapitre : les sept chapitres d'une même œuvre partageaient leurs
          clés. Mesuré le 09/09/2026 : 463 champs de réponse, sur les quatre
          cahiers, dont la clé désignait aussi un AUTRE champ. L'élève répond
          à la question 3 du chapitre 1, ouvre le chapitre 4, et sa réponse y
          est déjà — sous une autre question. S'il la corrige, la première est
          perdue. En silence.

       ② Même sans collision, un indice est positionnel : ajouter un exercice
          au milieu d'un chapitre décale tout ce qui suit.

     La clé porte donc le CHAPITRE et une empreinte de l'ÉNONCÉ. Ce banc rejoue
     cette règle sur les documents réels et vérifie qu'aucune clé ne sert deux
     fois à un champ de réponse. Il rejoue aussi l'ANCIENNE règle : un banc qui
     ne sait pas retrouver le défaut qu'il garde ne prouve rien.
   ══════════════════════════════════════════════════════════════════════════ */
'use strict';

const fs = require('fs');
const os = require('os');
const path = require('path');

const SRC = path.join(os.homedir(), 'Downloads', 'Ouvrages interactifs collaboratifs', 'content');
const COQUILLES = path.join(__dirname, '..', 'livrets');
const V = '\x1b[32m✓\x1b[0m', X = '\x1b[31m✗\x1b[0m', G = '\x1b[1m', R = '\x1b[0m';
let ok = 0, ko = 0;

function dit(bon, msg, det) {
  if (bon) { ok++; console.log(`  ${V} ${msg}`); }
  else { ko++; console.log(`  ${X} ${msg}${det ? '  → ' + det : ''}`); }
}

/* La règle, copiée de la coquille. Elle doit rendre EXACTEMENT la même chaîne :
   ce banc et le cahier calculent la même clé, sinon il mesure autre chose. */
function empK(texte) {
  let t = String(texte || '').replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ').trim().toLowerCase().slice(0, 400);
  let h = 0x811c9dc5;
  for (let i = 0; i < t.length; i++) {
    h ^= t.charCodeAt(i);
    h = (h + ((h << 1) + (h << 4) + (h << 7) + (h << 8) + (h << 24))) >>> 0;
  }
  return h.toString(36);
}
function texteBloc(b, i) {
  if (!b) return 'b' + i;
  let t = b.x || b.title || '';
  if (!t && b.body) t = (b.body || []).join(' ');
  if (!t && b.rows) t = JSON.stringify(b.rows).slice(0, 200);
  if (!t && b.words) t = (b.words || []).join(' ');
  if (!t && b.items) t = JSON.stringify(b.items).slice(0, 200);
  return t ? String(t) : (b.k || 'x') + '#' + i;
}

const CHAMP = new Set(['q', 'fill', 'gridfill', 'qcm', 'vf', 'order',
                       'riddle', 'match', 'wordsearch', 'crossword', 'table', 'lines']);
const NIVEAUX = ['6e', '5e', '4e', '3e'];

console.log(`\n${G}BANC — DEUX RÉPONSES NE PARTAGENT PAS UNE CLÉ${R}`);

/* ── Les documents sont-ils là ? Sinon on ne mesure rien, et on le dit. ──── */
const presents = NIVEAUX.filter(n => fs.existsSync(path.join(SRC, n + '.json')));
if (presents.length !== NIVEAUX.length) {
  console.log(`\n  ${V} documents source absents de ce poste — banc ignoré ` +
              `(${presents.length}/${NIVEAUX.length} trouvés)`);
  console.log('    Les coquilles, elles, sont vérifiées ci-dessous.\n');
}

/* ── ① La règle en vigueur ne produit aucune collision ──────────────────── */
if (presents.length) {
  console.log(`\n${G}1. Sur les documents réels, aucune clé ne sert deux fois${R}`);
  let totalNeuf = 0, totalVieux = 0;
  for (const n of presents) {
    const doc = JSON.parse(fs.readFileSync(path.join(SRC, n + '.json'), 'utf8'));

    const neuf = {}, vieux = {};
    for (const p of doc.parts) for (const c of (p.chapters || [])) {
      const vus = {};
      (c.blocks || []).forEach((b, i) => {
        const e = empK(texteBloc(b, i));
        vus[e] = (vus[e] || 0) + 1;
        const idN = c.id + '.' + e + (vus[e] > 1 ? '_' + vus[e] : '');
        (neuf[idN] = neuf[idN] || []).push(b.k);
        const idV = p.id + '.' + i;                       // l'ancienne règle
        (vieux[idV] = vieux[idV] || []).push(b.k);
      });
    }
    const compte = (t) => Object.values(t)
      .filter(v => v.filter(k => CHAMP.has(k)).length > 1)
      .reduce((s, v) => s + v.filter(k => CHAMP.has(k)).length, 0);
    const cn = compte(neuf), cv = compte(vieux);
    totalNeuf += cn; totalVieux += cv;
    dit(cn === 0, `${n} : ${Object.keys(neuf).length} clés, aucun champ partagé`,
      `${cn} champs en collision`);
  }

  /* ── ② LE BANC SAIT-IL VOIR LE DÉFAUT ? ────────────────────────────────
     Un contrôle qui n'a jamais rougi ne prouve rien. On rejoue l'ANCIENNE
     règle sur les mêmes documents : elle doit produire des collisions. Si
     elle n'en produit plus, c'est que ce banc ne mesure plus ce qu'il croit. */
  console.log(`\n${G}2. Le banc retrouve-t-il le défaut qu'il garde ?${R}`);
  dit(totalVieux > 0,
    `l'ancienne règle (indice de bloc) produit bien ${totalVieux} champs en collision`,
    'elle n’en produit aucune — ce banc ne mesure plus rien');
  dit(totalNeuf === 0 && totalVieux > 0,
    `et la règle en vigueur en produit ${totalNeuf} — le contraste est la preuve`);
}

/* ── ③ Les coquilles portent bien la règle ──────────────────────────────── */
console.log(`\n${G}3. Les quatre coquilles emploient la clé stable${R}`);
for (const n of NIVEAUX) {
  const f = path.join(COQUILLES, `cahier-oeuvres-${n}.html`);
  if (!fs.existsSync(f)) { dit(false, `cahier-oeuvres-${n}.html présent`); continue; }
  const s = fs.readFileSync(f, 'utf8');
  const stable = /const _cles = clesDuChapitre\(page, blocks\);/.test(s)
              && /function clesDuChapitre/.test(s);
  const vieille = /const K = p => page\.partId \+ '\.' \+ p;/.test(s);
  dit(stable && !vieille, `cahier-oeuvres-${n}.html : clé par chapitre + empreinte`,
    vieille ? 'la fabrique positionnelle est encore là' : 'clesDuChapitre absente');
}

console.log('\n' + '─'.repeat(70));
if (ko === 0) { console.log(`\x1b[32m${G}  ✓ ${ok}/${ok} — chaque réponse a sa clé, et une seule.${R}\n`); process.exit(0); }
console.log(`\x1b[31m${G}  ✘ ${ko} échec(s) sur ${ok + ko}${R}\n`);
process.exit(1);
