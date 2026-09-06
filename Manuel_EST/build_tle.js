/* Assemble « Français Tle Scientifique & Technique » et écrit le .docx A5 */
const R = require("./render");
const C = require("./common");
const K = require("./ct_contenu");

let ch = [];
ch = ch.concat(C.cover({ classe:"Classe de Terminale", examen:"Baccalauréat C/D/E/TI · STT · F-AF-CI-BT — chaque série, sa structure" }));
ch = ch.concat(C.sommaire());
ch = ch.concat(K.avantPropos());
ch = ch.concat(K.programme());
ch = ch.concat(K.progression());
ch = ch.concat(K.structures());
ch = ch.concat(R.partTitle("Quatrième partie","Méthodes et astuces"));
ch = ch.concat(C.methodoLangue("tle"));
ch = ch.concat(C.methodoContraction("tle"));
ch = ch.concat(C.methodoDissertation("tle"));
ch = ch.concat(C.methodoArgumenter());
ch = ch.concat(K.exercices());
ch = ch.concat(K.epreuves());
ch = ch.concat(K.citations());

const out = "C:\\Users\\Mythe Errant\\Downloads\\Claude code\\Manuel_EST\\Francais_Tle_Scientifique_Technique_VERITAS.docx";
R.write(ch, out, {
  title:"Français Tle — Scientifique & Technique (VÉRITAS)",
  header:"Français Tle — Scientifique & Technique · Baccalauréat",
  description:"Programme, progression, épreuves par séries, méthodes, exercices — Centre VÉRITAS",
}).then(()=>console.log("OK -> "+out+"  ("+ch.length+" blocs)"))
  .catch(err=>{ console.error(err); process.exit(1); });
