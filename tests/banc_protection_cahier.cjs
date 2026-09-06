#!/usr/bin/env node
/* ════════════════════════════════════════════════════════════════════════════
   tests/banc_protection_cahier.cjs — CE QU'ON VEND NE DOIT PAS PARTIR NU
   © 2024-2026 Jacques Miterand TAKOU (Mythe Errant).

     node tests/banc_protection_cahier.cjs

   CE QU'IL PROTÈGE
   Les cahiers en ligne sont de la marchandise : 1 000 à 1 500 FCFA l'ouvrage,
   livrés dans le navigateur de l'acheteur. Aucune page web ne peut empêcher
   une photo — ce banc ne le prétend pas. Il vérifie les deux choses qui, elles,
   tiennent :

     ① les gestes de copie ordinaires sont fermés (clic droit, glisser, copier,
        Ctrl+S/P/U), SANS jamais gêner l'élève dans ses propres champs : lui
        retirer le presse-papier pour protéger un texte qui est le sien serait
        payer la protection avec le produit ;
     ② tout ce qui sort porte un NOM. C'est le seul recours réel : un exemplaire
        signé désigne celui qui l'a fait circuler.

   LE DÉFAUT QUI A MOTIVÉ CE BANC (06/09/2026)
   `livrets/cahier.css` n'avait AUCUNE règle @media print. Ctrl+P était bien
   bloqué — mais le menu du navigateur (Fichier ▸ Imprimer ▸ Enregistrer au
   format PDF) ne l'est pas et ne peut pas l'être. Le cahier entier partait donc
   en PDF. Et le filigrane, en `position:fixed`, ne marquait que la PREMIÈRE
   feuille : les suivantes sortaient nues.

   Une protection qu'on croit avoir n'est pas une protection. On la mesure.
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

const js = fs.readFileSync(path.join(RACINE, 'livrets', 'cahier.js'), 'utf8');
const css = fs.readFileSync(path.join(RACINE, 'livrets', 'cahier.css'), 'utf8');
const gate = fs.readFileSync(path.join(RACINE, 'livrets', 'gate.js'), 'utf8');

console.log(`\n${G}CE QU'ON VEND NE DOIT PAS PARTIR NU${R}\n`);

/* ── ① Les gestes de copie ───────────────────────────────────────────────── */
console.log(`${G}① Les gestes de copie sont fermés${R}`);
for (const [evt, nom] of [['contextmenu', 'clic droit'], ['copy', 'copier'],
                          ['dragstart', 'glisser-déposer']]) {
  dire(new RegExp("addEventListener\\('" + evt + "'").test(js),
    'le ' + nom + ' est intercepté', evt + ' absent');
}
dire(/k !== 's' && k !== 'p' && k !== 'u'/.test(js),
  'Ctrl/Cmd + S, P et U sont interceptés');
dire(/PrintScreen/.test(js),
  'la touche de capture voile le cahier', 'aucune garde PrintScreen');
dire(/\.ch-voile\b/.test(css), 'et le voile existe en CSS — sinon la garde ne voile rien');

/* ── ② …sans gêner l'élève ───────────────────────────────────────────────── */
console.log(`\n${G}② …sans jamais gêner l'élève dans SES champs${R}`);
dire(/textarea, input, select, \[contenteditable="true"\]/.test(js),
  'les champs de saisie sont reconnus');
dire(/if \(saisie\(document\.activeElement\)\) return;/.test(js),
  'un raccourci dans un champ passe — sa copie lui appartient');
const n = (js.match(/if \(!saisie\(e\.target\)\) e\.preventDefault\(\);/g) || []).length;
dire(n >= 3, 'les trois gestes épargnent les champs', n + ' sur 3');

/* ── ③ L'impression ──────────────────────────────────────────────────────── */
console.log(`\n${G}③ Ce qui sort de l'imprimante porte un nom${R}`);
const bloc = css.slice(css.indexOf('@media print {'));
dire(css.includes('@media print {'), 'une règle d\'impression existe');
dire(/html\s*\{[^}]*background-image:var\(--vrt-wm/.test(bloc.replace(/\s+/g, ' ')),
  'le filigrane est reposé sur `html` — il se répète sur CHAQUE feuille',
  'seule la première page serait marquée');
dire(/--vrt-wm/.test(gate),
  'et gate.js expose bien le motif au CSS', 'la variable ne serait jamais définie');
dire(/#vrt-wm\s*\{\s*display:none/.test(bloc.replace(/\s+/g, ' ')),
  'l\'élément fixe est retiré à l\'impression — sinon il masque le fond répété');
dire(/#vrt-wm-pied/.test(bloc), 'la mention nominative reste en pied de page');
dire(/break-inside:avoid/.test(bloc),
  'un exercice n\'est pas coupé entre deux feuilles');

/* ── ④ Le filigrane nomme quelqu'un ──────────────────────────────────────── */
console.log(`\n${G}④ Le filigrane désigne l'acheteur, pas la maison${R}`);
dire(/Exemplaire personnel — ' \+ wm\.txt/.test(gate),
  'le pied porte le texte fourni par le serveur, pas une mention générique');
dire(/print-color-adjust:exact/.test(gate),
  'et il survit au réglage « ne pas imprimer les fonds »');

console.log(`\n${G}${ok} contrôle(s) au vert, ${ko} au rouge.${R}\n`);
process.exit(ko === 0 ? 0 : 1);
