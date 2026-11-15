/* Aperçus payants (apprendre/apercus-*.js) : une même figure SVG (carte, frise, schéma) est souvent
   posée sur plusieurs leçons. Compacter = la stocker une seule fois par fichier, dans un dictionnaire
   local, et la remettre en place avant l'appel à VRT_L : les pages (lecon.html, verrou.js) reçoivent
   exactement les mêmes objets qu'avant. Développer = revenir au format « une ligne VRT_L par leçon,
   SVG en ligne » (utile aux outils qui réécrivent les aperçus).
   Usage : node tools/compacter_apercus.cjs [--developper] [dossier apprendre]   (appelé aussi par le build) */
const fs = require("fs"), path = require("path"), crypto = require("crypto");
const DEBUT = "/*VRT_FIGS*/(function(){var F=", FIN = "})();";

function lire(texte) {
  // Retourne { tete, lecons:[[id, objet]] } quel que soit le format (compacté ou non).
  const tete = [], lecons = [];
  let F = null;
  for (const ligne of texte.split("\n")) {
    if (ligne.startsWith(DEBUT)) { F = JSON.parse(ligne.slice(DEBUT.length, ligne.indexOf(";var R="))); continue; }
    const m = ligne.match(/^VRT_L\(("[^"]+"),(?:R\()?(.*?)\)?\);$/);
    if (m && (ligne.endsWith("));") ? true : true)) {
      let objet;
      try { objet = JSON.parse(m[2]); } catch (e) { const m2 = ligne.match(/^VRT_L\(("[^"]+"),R\((.*)\)\);$/) || ligne.match(/^VRT_L\(("[^"]+"),(.*)\);$/); objet = JSON.parse(m2[2]); }
      for (const p of objet.parties || []) if (p.illus && p.illus.ref) { p.illus.svg = F[p.illus.ref]; delete p.illus.ref; }
      lecons.push([JSON.parse(m[1]), objet]); continue;
    }
    if (ligne === FIN || ligne === "") continue;
    tete.push(ligne);
  }
  return { tete, lecons };
}
function developper(texte) { const { tete, lecons } = lire(texte); return tete.concat(lecons.map(([id, o]) => `VRT_L(${JSON.stringify(id)},${JSON.stringify(o)});`)).join("\n") + "\n"; }
function compacter(texte) {
  const { tete, lecons } = lire(texte), F = {}, cle = {};
  for (const [, o] of lecons) for (const p of o.parties || []) if (p.illus && p.illus.svg) {
    const k = cle[p.illus.svg] || (cle[p.illus.svg] = "f" + crypto.createHash("sha1").update(p.illus.svg).digest("hex").slice(0, 10));
    F[k] = p.illus.svg; p.illus = Object.assign({ legende: p.illus.legende }, { ref: k });
  }
  if (!Object.keys(F).length) return developper(texte);
  return tete.join("\n") + "\n" + DEBUT + JSON.stringify(F) + ";var R=function(o){(o.parties||[]).forEach(function(p){if(p.illus&&p.illus.ref){p.illus.svg=F[p.illus.ref];delete p.illus.ref;}});return o;};\n" +
    lecons.map(([id, o]) => `VRT_L(${JSON.stringify(id)},R(${JSON.stringify(o)}));`).join("\n") + "\n" + FIN + "\n";
}
function traiterDossier(dossier, dev) {
  for (const f of fs.readdirSync(dossier).filter(f => /^apercus-.*\.js$/.test(f))) {
    const p = path.join(dossier, f), avant = fs.readFileSync(p, "utf8"), apres = dev ? developper(avant) : compacter(avant);
    if (apres !== avant) fs.writeFileSync(p, apres);
    if (require.main === module) console.log(f, (avant.length / 1024 | 0) + " → " + (apres.length / 1024 | 0) + " Ko");
  }
}
module.exports = { compacter, developper, lire, traiterDossier };
if (require.main === module) { const dev = process.argv.includes("--developper"); traiterDossier(process.argv.slice(2).find(a => !a.startsWith("--")) || path.join(__dirname, "../apprendre"), dev); }
