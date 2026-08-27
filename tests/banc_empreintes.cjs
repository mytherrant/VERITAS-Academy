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
  const textes = [];
  for (const f of fs.readdirSync(PROTEGE).filter((x) => /^booklet-.+\.js$/.test(x))) {
    const js = fs.readFileSync(path.join(PROTEGE, f), 'utf8');
    const blocs = JSON.parse(js.slice(js.indexOf('=') + 1).trim().replace(/;$/, ''));
    for (const b of blocs) {
      const t = b.txt || (b.r || []).map((r) => r && r.t).filter(Boolean).join(' ')
             || b.title || b.titre || '';
      if (t) textes.push(String(t));
    }
  }
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

console.log('\n' + '─'.repeat(68));
if (ko) { console.log(`\x1b[31m${G}  ${X} ${ko} contrôle(s) en échec sur ${ok + ko}${R}`); process.exit(1); }
console.log(`\x1b[32m${G}  ✓ ${ok}/${ok} — les corrigés se retrouveront.${R}`);
