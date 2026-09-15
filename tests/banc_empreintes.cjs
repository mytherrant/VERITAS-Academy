#!/usr/bin/env node
/* ════════════════════════════════════════════════════════════════════════════
   tests/banc_empreintes.cjs — LES DEUX EMPREINTES DISENT-ELLES LA MÊME CHOSE ?
   © 2024-2026 Jacques Miterand TAKOU (Mythe Errant).

     node tests/banc_empreintes.cjs

   CE QU'IL PROTÈGE
   Le corrigé d'un exercice n'accompagne plus l'exercice : il attend sur le
   serveur, rangé sous l'empreinte de sa consigne. Deux programmes calculent
   cette empreinte, dans deux langages :

     tools/normaliser_cahiers.py  (Python) range les corrigés à la publication ;
     livrets/cahier.js            (JS)     les réclame quand l'élève a répondu.

   Si les deux fonctions divergent d'un seul caractère, aucun corrigé ne se
   retrouve. Et la panne serait MUETTE : l'élève lit « pas de correction pour
   cet exercice », ce qui est exactement ce qu'affiche un exercice sans
   corrigé. Rien ne distinguerait « il n'y en a pas » de « nous ne savons plus
   où il est ».

   Trois pièges concrets, tous vérifiés ici :
     • le décalage de 24 bits déborde en Python, qui n'a pas d'entiers 32 bits ;
     • `charCodeAt` rend des unités UTF-16 — « é » composé ou précomposé, les
       guillemets français, les exposants des niveaux (2ⁿᵈᵉ, 1ʳᵉ, Tˡᵉ) ;
     • la troncature à 400 caractères tombe au milieu d'un mot, pas d'un octet.
   ════════════════════════════════════════════════════════════════════════ */
'use strict';
const fs = require('fs');
const path = require('path');
const os = require('os');
const { execFileSync } = require('child_process');

const RACINE = path.resolve(__dirname, '..');
const { empreinte } = require(path.join(RACINE, 'livrets', 'cahier.js'));

const V = '\x1b[32m✓\x1b[0m', X = '\x1b[31m✗\x1b[0m', G = '\x1b[1m', R = '\x1b[0m';
let ok = 0, ko = 0;
const dire = (b, m) => { b ? ok++ : ko++; console.log('  ' + (b ? V : X) + ' ' + m); };

/* Un échantillon choisi pour ses pièges, pas pour sa taille : chaque entrée
   casse une implémentation naïve d'une façon différente. */
const PIEGES = [
  '',
  'Bonjour',
  'a  b',                                   // espaces multiples
  '  a b  ',                                // espaces de bord
  'A B',                                    // casse
  "Élève à l'école, en 2ⁿᵈᵉ",               // accents + exposants
  '« Ne mens pas, Faydé. »',                // guillemets français
  'Tˡᵉ A — 1ʳᵉ A — 6ᵉ',                     // les exposants des niveaux
  'école',                            // é décomposé
  'école',                             // é précomposé — DOIT différer du précédent
  'x'.repeat(399),
  'x'.repeat(400),
  'x'.repeat(401),                          // la troncature
  'ligne1\nligne2\tligne3',                 // les blancs exotiques
  'Indique le type de chacune des phrases de ce dialogue de Djaïli Amadou Amal.',
];

function empreintesPython(liste) {
  /* stdin et stdout sont reconfigurés en UTF-8 AVANT toute lecture : sur ce
     poste Windows, Python ouvre ses flux en cp1252. Sans cela, « ⁿᵈᵉ » et les
     guillemets français arrivent en paires de substitution invalides et la
     comparaison échoue sur un défaut de tuyauterie, pas sur la fonction. */
  const src = `
import sys, json
sys.stdin.reconfigure(encoding="utf-8")
sys.stdout.reconfigure(encoding="utf-8")
sys.path.insert(0, ${JSON.stringify(path.join(RACINE, 'tools'))})
import normaliser_cahiers as N
liste = json.loads(sys.stdin.read())
sys.stdout.write(json.dumps([N.empreinte(t) for t in liste]))
`;
  const out = execFileSync('python', ['-c', src], {
    input: JSON.stringify(liste), encoding: 'utf8', maxBuffer: 64 * 1024 * 1024,
  });
  return JSON.parse(out);
}

console.log(`\n${G}LES DEUX EMPREINTES DISENT-ELLES LA MÊME CHOSE ?${R}\n`);

console.log(`${G}1. Les pièges connus${R}`);
let py;
try {
  py = empreintesPython(PIEGES);
} catch (e) {
  console.log(`${X} Python injoignable : ${e.message.split('\n')[0]}`);
  process.exit(2);
}
PIEGES.forEach((t, i) => {
  const js = empreinte(t);
  const etiquette = t.length > 34 ? t.slice(0, 31) + '…' : (t || '(chaîne vide)');
  dire(js === py[i], `${JSON.stringify(etiquette)} → ${js}${js === py[i] ? '' : ' ≠ ' + py[i]}`);
});

console.log(`\n${G}2. Deux textes différents ne partagent pas une empreinte${R}`);
dire(empreinte('école') !== empreinte('école'),
  'é décomposé et é précomposé restent distincts');
dire(empreinte('x'.repeat(400)) === empreinte('x'.repeat(401)),
  'au-delà de 400 caractères, la suite ne compte plus (des deux côtés)');

/* Le vrai corpus. C'est lui qui compte : les pièges ci-dessus sont ceux
   auxquels j'ai pensé, celui-ci contient ceux auxquels je n'ai pas pensé. */
const CHARGE = process.argv[2] || path.join(os.homedir(), 'Desktop', 'veritas-ftp');
const PROTEGE = path.join(CHARGE, 'uploads', 'protected', 'livrets');
console.log(`\n${G}3. Le corpus réel${R}`);
if (!fs.existsSync(PROTEGE)) {
  console.log('  (charge absente — contrôle limité aux pièges ci-dessus)');
} else {
  /* Deux formes de charge cohabitent, et les confondre a fait tomber ce banc.
     • Un TABLEAU de blocs — les vingt-quatre cahiers servis par cahier.js.
       Ceux-là réclament leur corrigé au serveur par empreinte : c'est le
       contrat que ce banc protège.
     • Un OBJET {level,title,parts} — les quatre cahiers d'œuvres du collège,
       qui ont leur propre moteur (livrets/cahier-oeuvres-*.html) et portent
       leurs corrigés dans la charge. Ils ne réclament rien par empreinte.
     Jusqu'ici la boucle itérait la charge sans regarder sa forme : au premier
     objet, `for...of` levait « blocs is not iterable » et le banc mourait —
     AVANT toute comparaison. Aucun des vingt-huit cahiers n'était vérifié, et
     la CI ne le voyait pas : sans la charge sur le runner, cette section est
     sautée. Une forme inconnue doit rougir, jamais être ignorée en silence. */
  const textes = [];
  const autonomes = [];
  const inconnus = [];
  for (const f of fs.readdirSync(PROTEGE).filter((x) => /^booklet-.+\.js$/.test(x))) {
    const js = fs.readFileSync(path.join(PROTEGE, f), 'utf8');
    const charge = JSON.parse(js.slice(js.indexOf('=') + 1).trim().replace(/;$/, ''));
    if (Array.isArray(charge)) {
      for (const b of charge) {
        const t = b.txt || (b.r || []).map((r) => r && r.t).filter(Boolean).join(' ')
               || b.title || b.titre || '';
        if (t) textes.push(String(t));
      }
    } else if (charge && Array.isArray(charge.parts)) {
      autonomes.push(f);
    } else {
      inconnus.push(f);
    }
  }
  dire(inconnus.length === 0, inconnus.length === 0
    ? `${autonomes.length} cahier(s) à moteur autonome écartés, forme reconnue`
    : `forme de charge inconnue : ${inconnus.join(', ')}`);
  console.log(`  ${textes.length} textes de blocs relevés dans la charge`);
  const attendu = empreintesPython(textes);
  let ecarts = 0, premier = null;
  textes.forEach((t, i) => {
    if (empreinte(t) !== attendu[i]) { ecarts++; if (!premier) premier = t.slice(0, 70); }
  });
  dire(ecarts === 0, ecarts === 0
    ? `les ${textes.length} empreintes concordent, Python et JavaScript`
    : `${ecarts} écart(s) — premier : ${JSON.stringify(premier)}`);
}

/* ── 4. LE TROISIÈME MOTEUR ──────────────────────────────────────────────
   Il y a trois implémentations, pas deux. Les quatre cahiers d'œuvres du
   collège embarquent la leur, `empK()`, dans livrets/cahier-oeuvres-*.html.
   Son commentaire affirme « le même FNV-1a » que cahier.js, « les deux
   moteurs rangent leurs réponses de la même façon, ce qui compte le jour où
   api/cahier.php les lit tous les deux ».

   C'est vrai du noyau, faux du texte d'entrée : `empK` retire les balises
   HTML avant de normaliser, cahier.js et Python non. Mesuré sur la charge —
   2 950 blocs sur 7 756, soit 38 %, reçoivent deux empreintes différentes.

   AUCUN des deux ne doit être aligné sur l'autre. Chaque moteur est cohérent
   avec lui-même et les élèves ont déjà répondu : toucher `empK` détacherait
   les réponses des quatre cahiers d'œuvres, toucher cahier.js celles des
   vingt-quatre autres ET les corrigés rangés par Python. Ce qu'on protège
   ici, c'est donc que l'écart reste EXACTEMENT celui-là — le noyau commun,
   et le retrait des balises pour seule différence. Si quelqu'un touche au
   noyau de l'un des deux, cette section rougit. */
console.log(`\n${G}4. Le moteur des cahiers d'œuvres dit-il la même chose ?${R}`);
{
  const extraireFn = (src, nom) => {
    const i = src.indexOf('function ' + nom + '(');
    if (i < 0) return null;
    const j = src.indexOf('\n}', i);
    return j < 0 ? null : src.slice(i, j + 2);
  };
  const lire = (n) => fs.readFileSync(
    path.join(RACINE, 'livrets', `cahier-oeuvres-${n}.html`), 'utf8').replace(/\r\n/g, '\n');

  const NIVEAUX = ['3e', '4e', '5e', '6e'];
  const moteurs = {};
  for (const n of NIVEAUX) {
    const src = lire(n);
    moteurs[n] = { empK: extraireFn(src, 'empK'), texteBloc: extraireFn(src, 'texteBloc') };
  }
  const ref = moteurs['6e'];
  dire(!!(ref.empK && ref.texteBloc), 'le moteur des cahiers d’œuvres est extractible');

  if (ref.empK && ref.texteBloc) {
    dire(NIVEAUX.every((n) => moteurs[n].empK === ref.empK
                           && moteurs[n].texteBloc === ref.texteBloc),
      'les quatre cahiers d’œuvres portent le même moteur');

    const { empK, texteBloc } = new Function(
      ref.empK + '\n' + ref.texteBloc + '\nreturn { empK, texteBloc };')();

    /* Le noyau : sans balise, les deux moteurs doivent dire le même mot. */
    const sansBalise = PIEGES.filter((t) => !/<[^>]+>/.test(t));
    const noyau = sansBalise.filter((t) => empK(t) !== empreinte(t));
    dire(noyau.length === 0, noyau.length === 0
      ? `même noyau FNV-1a sur les ${sansBalise.length} pièges sans balise`
      : `noyau divergent — premier : ${JSON.stringify(noyau[0].slice(0, 50))}`);

    /* La seule différence admise, énoncée à l'endroit : une balise change
       l'empreinte de empK, et elle seule. */
    dire(empK('<b>a</b> b') === empreinte('a b'),
      'empK retire les balises — c’est sa seule différence, et elle est voulue');
    dire(empK('<b>a</b> b') !== empreinte('<b>a</b> b'),
      'donc sur un texte balisé les deux moteurs divergent, comme documenté');

    /* Sur la charge réelle : l'écart ne déborde pas des textes balisés. */
    if (fs.existsSync(PROTEGE)) {
      let vus = 0, divergents = 0, balises = 0, horsBalise = null;
      for (const n of NIVEAUX) {
        const p = path.join(PROTEGE, `booklet-oeuvres-${n}.js`);
        if (!fs.existsSync(p)) continue;
        const js = fs.readFileSync(p, 'utf8');
        const d = JSON.parse(js.slice(js.indexOf('=') + 1).trim().replace(/;$/, ''));
        const paquets = [];
        for (const pt of (d.parts || [])) {
          if (pt.blocks) paquets.push(pt.blocks);
          for (const ch of (pt.chapters || [])) if (ch.blocks) paquets.push(ch.blocks);
        }
        for (const blocs of paquets) {
          blocs.forEach((b, i) => {
            const t = texteBloc(b, i);
            vus++;
            const balise = /<[^>]+>/.test(t);
            if (balise) balises++;
            if (empK(t) !== empreinte(t)) {
              divergents++;
              if (!balise && !horsBalise) horsBalise = String(t).slice(0, 70);
            }
          });
        }
      }
      console.log(`  ${vus} textes relevés dans les quatre cahiers d’œuvres`);
      dire(horsBalise === null && divergents === balises,
        horsBalise === null && divergents === balises
          ? `l’écart se limite aux ${balises} textes balisés, et les couvre tous`
          : `écart hors balise — ${JSON.stringify(horsBalise)} (${divergents} ≠ ${balises})`);
    } else {
      console.log('  (charge absente — contrôle limité au noyau ci-dessus)');
    }
  }
}

console.log('\n' + '─'.repeat(68));
if (ko) { console.log(`\x1b[31m${G}  ${X} ${ko} contrôle(s) en échec sur ${ok + ko}${R}`); process.exit(1); }
console.log(`\x1b[32m${G}  ✓ ${ok}/${ok} — les corrigés se retrouveront.${R}`);
