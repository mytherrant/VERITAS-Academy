/* Assemble « Français 2nde Scientifique & Technique » et écrit le .docx A5 */
const R = require("./render");
const C = require("./common");
const K = require("./c2_contenu");

let ch = [];
ch = ch.concat(C.cover({ classe:"Classe de 2nde", examen:"Séries scientifiques (2nde C) et 2ndes techniques — cap sur le Probatoire" }));
ch = ch.concat(C.sommaire());
ch = ch.concat(K.avantPropos());
ch = ch.concat(K.programme());
ch = ch.concat(K.progression());
ch = ch.concat(K.evaluations());
/* Méthodologie */
ch = ch.concat(R.partTitle("Quatrième partie","Méthodes et astuces"));
ch = ch.concat(C.methodoLangue("2nde"));
ch = ch.concat(C.methodoContraction("2nde"));
ch = ch.concat(C.methodoArgumenter());
ch = ch.concat(C.methodoDissertation("2nde"));
/* Exercices + épreuves (les partTitle internes renumérotent : cinquième/sixième) */
ch = ch.concat(K.exercices());
ch = ch.concat(K.epreuves());
ch = ch.concat(K.citations());

const out = "C:\\Users\\Mythe Errant\\Downloads\\Claude code\\Manuel_EST\\Francais_2nde_Scientifique_Technique_VERITAS.docx";
R.write(ch, out, {
  title:"Français 2nde — Scientifique & Technique (VÉRITAS)",
  header:"Français 2nde — Scientifique & Technique",
  description:"Programme, progression, épreuves, méthodes, exercices — Centre VÉRITAS",
}).then(()=>console.log("OK -> "+out+"  ("+ch.length+" blocs)"))
  .catch(err=>{ console.error(err); process.exit(1); });
