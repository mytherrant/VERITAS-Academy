/* Assemble « Français 1ère Scientifique & Technique » et écrit le .docx A5 */
const R = require("./render");
const C = require("./common");
const K = require("./c1_contenu");

let ch = [];
ch = ch.concat(C.cover({ classe:"Classe de 1ère", examen:"Probatoire C/D/E/TI · STT · F-AF-CI-BT — chaque série, sa structure" }));
ch = ch.concat(C.sommaire());
ch = ch.concat(K.avantPropos());
ch = ch.concat(K.programme());
ch = ch.concat(K.progression());
ch = ch.concat(K.structures());
ch = ch.concat(R.partTitle("Quatrième partie","Méthodes et astuces"));
ch = ch.concat(C.methodoLangue("1ere"));
ch = ch.concat(C.methodoContraction("1ere"));
ch = ch.concat(C.methodoDissertation("1ere"));
ch = ch.concat(C.methodoArgumenter());
ch = ch.concat(K.exercices());
ch = ch.concat(K.epreuves());
ch = ch.concat(K.citations());

const out = "C:\\Users\\Mythe Errant\\Downloads\\Claude code\\Manuel_EST\\Francais_1ere_Scientifique_Technique_VERITAS.docx";
R.write(ch, out, {
  title:"Français 1ère — Scientifique & Technique (VÉRITAS)",
  header:"Français 1ère — Scientifique & Technique · Probatoire",
  description:"Programme, progression, épreuves par séries, méthodes, exercices — Centre VÉRITAS",
}).then(()=>console.log("OK -> "+out+"  ("+ch.length+" blocs)"))
  .catch(err=>{ console.error(err); process.exit(1); });
