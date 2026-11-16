/* Leçons APPROFONDIES (16/11/2026) — le gabarit qui doit battre SchoolMouv :
   • enquete : une situation-problème camerounaise STRUCTURÉE (contexte, documents chiffrés, problème,
     tâche, hypothèses) ;
   • chaque partie fait avancer la résolution : p.fil = { html, verdicts: [[hypothèse, "rejetee"|"validee"|"precisee", note]] } ;
   • p.planches : planches 2D (svg) et 3D (modele, moteur planche3d.js, l'élève fait tourner l'objet) ;
   • denouement : étapes du raisonnement, réponse rédigée, situation de transfert.
   Ces trois leçons remplacent les versions courtes (3e-maths-thales, 4e-svt-photosynthese, 3e-geo-mangrove). */
(function () {
  /* petits générateurs de modèles 3D (déterministes : même dessin à chaque chargement) */
  function feuille3D() {
    var o = [], x, z, i;
    o.push({ f: "boite", c: [0, 74, 0], d: [360, 10, 200], coul: "#CFEAA6", dessus: "#E4F5C8", ec: [0, 95, 0] });
    for (x = -162; x <= 162; x += 36) for (z = -80; z <= 80; z += 40)
      o.push({ f: "cylindre", c: [x, 10, z], r: 14, h: 58, n: 10, coul: "#3F8F2A", dessus: "#67B341", ec: [0, 48, 0] });
    for (i = 0; i < 18; i++) {
      x = -150 + (i % 6) * 58 + ((i * 37) % 18 - 9); z = -70 + Math.floor(i / 6) * 70 + ((i * 23) % 16 - 8);
      if (Math.abs(x - 50) < 30) x += 46;
      o.push({ f: "sphere", c: [x, -24 + ((i * 13) % 12 - 6), z], r: 17, n: 8, m: 4, coul: "#93C96F" });
    }
    o.push({ f: "cylindre", axe: "z", c: [50, -28, -100], r: 21, h: 200, n: 14, coul: "#D9E7B2", dessus: "#B9D58A" });
    o.push({ f: "cylindre", axe: "z", c: [50, -28, -101], r: 9, h: 202, n: 10, coul: "#5B8DD6", dessus: "#3E6FB8" });
    o.push({ f: "boite", c: [0, -56, 0], d: [360, 10, 200], coul: "#CFEAA6", ec: [0, -65, 0] });
    [[-120, -40], [-20, 50], [120, -20], [-150, 60]].forEach(function (s) {
      o.push({ f: "sphere", c: [s[0] - 7, -62, s[1]], r: [7, 4, 13], n: 8, m: 4, coul: "#2F7D22", ec: [0, -65, 0] });
      o.push({ f: "sphere", c: [s[0] + 7, -62, s[1]], r: [7, 4, 13], n: 8, m: 4, coul: "#2F7D22", ec: [0, -65, 0] });
    });
    return o;
  }
  function chloroplaste3D() {
    var o = [{ f: "sphere", c: [0, 0, 0], r: [170, 66, 90], n: 18, m: 10, coul: "#9BD67A", op: 0.3, double: true }], g, k;
    var G = [[-110, -10, 10], [-60, 8, -40], [-20, -6, 35], [30, 10, -20], [75, -8, 30], [115, 4, -15], [0, -22, -55]];
    G.forEach(function (p) { for (k = 0; k < 5; k++) o.push({ f: "cylindre", c: [p[0], p[1] - 18 + k * 8, p[2]], r: 19, h: 5, n: 12, coul: "#2E8B3A", dessus: "#4FB35A" }); });
    for (g = 0; g < G.length - 1; g++) { var a = G[g], b = G[g + 1]; o.push({ f: "boite", c: [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2, (a[2] + b[2]) / 2], d: [Math.abs(a[0] - b[0]) + 6, 2, 8], coul: "#58A85F" }); }
    o.push({ f: "sphere", c: [70, 30, 45], r: [22, 13, 16], n: 10, m: 6, coul: "#F3EFE2" });
    return o;
  }
  function mat3D() {
    /* échelle : 26 unités pour 1 m. Mât 9,60 m, ombre 6,40 m ; manche 1,20 m, ombre 0,80 m. */
    var o = [{ f: "boite", c: [-20, -3, 0], d: [460, 6, 240], coul: "#D9C7A0", dessus: "#E3D3AE" }];
    o.push({ f: "boite", c: [-40, 26, 105], d: [320, 52, 36], coul: "#F1E6CF", dessus: "#B5523B", cote: "#E6D7B8" });    /* le bâtiment des classes */
    [-160, -100, -40, 20, 80].forEach(function (x) { o.push({ f: "poly", pts: [[x, 16, 86.5], [x + 30, 16, 86.5], [x + 30, 40, 86.5], [x, 40, 86.5]], coul: "#5B8DD6" }); });
    o.push({ f: "boite", c: [-100, 4, 0], d: [36, 8, 36], coul: "#BFB8AA", dessus: "#D6D0C4" });                       /* socle */
    o.push({ f: "cylindre", c: [-100, 8, 0], r: 3.5, h: 242, n: 10, coul: "#C9CED8", dessus: "#E4E7ED" });           /* le mât */
    o.push({ f: "poly", pts: [[-97, 250, 0], [-77, 250, 0], [-77, 216, 0], [-97, 216, 0]], coul: "#1F8A4C" });         /* vert */
    o.push({ f: "poly", pts: [[-77, 250, 0], [-57, 250, 0], [-57, 216, 0], [-77, 216, 0]], coul: "#C0392B" });         /* rouge */
    o.push({ f: "poly", pts: [[-57, 250, 0], [-37, 250, 0], [-37, 216, 0], [-57, 216, 0]], coul: "#F2C200" });         /* jaune */
    o.push({ f: "poly", pts: [[-67, 239, 0.4], [-65.2, 234.5, 0.4], [-60.5, 234.5, 0.4], [-64.2, 231.5, 0.4], [-62.8, 227, 0.4], [-67, 229.8, 0.4], [-71.2, 227, 0.4], [-69.8, 231.5, 0.4], [-73.5, 234.5, 0.4], [-68.8, 234.5, 0.4]], coul: "#F2C200" });
    o.push({ f: "cylindre", c: [45, 0, 0], r: 2.5, h: 31, n: 8, coul: "#7A4A1E" });                                     /* manche à balai */
    o.push({ f: "poly", pts: [[-100, 0.6, -9], [66, 0.6, -2], [66, 0.6, 2], [-100, 0.6, 9]], coul: "#5E5A52", op: 0.5 });
    o.push({ f: "poly", pts: [[45, 1.2, -3], [66, 1.2, -1], [66, 1.2, 1], [45, 1.2, 3]], coul: "#2E2B26", op: 0.8 });
    o.push({ f: "poly", pts: [[-100, 250, -1.2], [66, 0, -1.2], [66, 0, 1.2], [-100, 250, 1.2]], coul: "#F2B705", op: 0.9 });
    o.push({ f: "sphere", c: [-190, 215, -20], r: 15, n: 10, m: 6, coul: "#FFC93C" });
    return o;
  }
  function estuaire3D() {
    var o = [], i, x, z;
    o.push({ f: "boite", c: [-120, -14, 0], d: [200, 28, 220], coul: "#B98E5A", dessus: "#C9B07E", cote: "#8E6A3E" });       /* terre ferme : la ville */
    o.push({ f: "boite", c: [70, -22, 0], d: [180, 12, 220], coul: "#7A6248", dessus: "#6F5A44", cote: "#5C4A38" });      /* vase */
    o.push({ f: "boite", c: [215, -24, 0], d: [110, 8, 220], coul: "#5C4A38" });
    o.push({ f: "boite", c: [125, -13, 0], d: [290, 3, 220], coul: "#5AA4D8", op: 0.5 });   /* eau de marée haute */
    for (i = 0; i < 6; i++) { x = -190 + (i % 3) * 55; z = -70 + Math.floor(i / 3) * 120; o.push({ f: "boite", c: [x, 14, z], d: [34, 28 + (i * 7) % 20, 34], coul: "#E8E3DA", dessus: "#C0392B" }); }
    for (i = 0; i < 12; i++) {
      x = 10 + (i % 4) * 42 + ((i * 17) % 12); z = -85 + Math.floor(i / 4) * 80 + ((i * 29) % 20 - 10);
      o.push({ f: "cone", c: [x, -16, z], r: 10, r2: 2, h: 16, n: 6, coul: "#6B3E1F" });            /* racines-échasses */
      o.push({ f: "cylindre", c: [x, 0, z], r: 3, h: 22, n: 6, coul: "#6B3E1F" });
      o.push({ f: "sphere", c: [x, 34, z], r: [24, 15, 24], n: 8, m: 4, coul: "#2F8A3B" });
    }
    o.push({ f: "sphere", c: [140, -17, 20], r: [9, 3, 4], n: 8, m: 4, coul: "#FFC93C" });
    o.push({ f: "sphere", c: [100, -17, -40], r: [7, 3, 3], n: 8, m: 4, coul: "#FFC93C" });
    return o;
  }

  /* ════════════════════ SVT 4e — LA PRODUCTION DE LA MATIÈRE VÉGÉTALE ════════════════════ */
  VRT_L("4e-svt-photosynthese", {
    c: "4e", m: "svt", cle: "La production de la matière végétale", titre: "La production de la matière végétale", duree: 35,
    accroche: "Une graine de 0,35 g devient un plant de maïs de 450 g, et la terre du pot n'a perdu que 4 g. D'où vient le reste ?",
    intro: "Tu vas mener une enquête scientifique : à chaque partie, un indice te rapproche de la solution. À la fin, tu sauras expliquer d'où vient la matière d'une plante, et le prouver par des expériences.",
    objectifs: ["identifier ce qu'une plante prélève dans le sol et dans l'air", "montrer par l'expérience le rôle de la lumière, de la chlorophylle et du CO₂", "décrire la feuille, organe de la photosynthèse", "écrire le bilan de la photosynthèse et l'utiliser pour résoudre un problème"],
    enquete: {
      titre: "Le maïs mange-t-il la terre ?",
      svg: "<svg viewBox='0 0 640 260' role='img' aria-label='À gauche, une famille au champ de maïs ; à droite, le pot de maïs de la classe pesé au début et après douze semaines'><rect width='640' height='260' fill='#EAF4FF'/><circle cx='40' cy='34' r='18' fill='#FFC93C'/><rect y='196' width='330' height='64' fill='#9B6B3E'/><g stroke='#4F9E36' stroke-width='4' stroke-linecap='round'><path d='M60 200V96M110 200V90M160 200V100M210 200V92M260 200V98'/></g><g fill='#5DAA3A'><path d='M60 150c-22-4-34-14-40-26 18 0 32 8 40 26zM60 130c20-4 32-14 38-26-18 0-30 8-38 26zM110 140c-22-4-34-14-40-26 18 0 32 8 40 26zM110 120c20-4 32-14 38-26-18 0-30 8-38 26zM160 150c-22-4-34-14-40-26 18 0 32 8 40 26zM210 130c20-4 32-14 38-26-18 0-30 8-38 26zM260 146c-22-4-34-14-40-26 18 0 32 8 40 26zM260 122c20-4 32-14 38-26-18 0-30 8-38 26z'/></g><g fill='#F2C200' stroke='#C79A00'><ellipse cx='66' cy='140' rx='5' ry='12'/><ellipse cx='166' cy='132' rx='5' ry='12'/><ellipse cx='254' cy='136' rx='5' ry='12'/></g><g><circle cx='150' cy='176' r='9' fill='#6B4A2A'/><path d='M140 186h20l6 26h-32z' fill='#C0392B'/><path d='M138 200h24' stroke='#F2C200' stroke-width='3'/><path d='M166 190l14 6' stroke='#6B4A2A' stroke-width='4'/><path d='M176 200h20l-4 12h-12z' fill='#B8784A'/></g><g><circle cx='214' cy='186' r='7' fill='#6B4A2A'/><path d='M207 194h14l3 18h-20z' fill='#E9EEF6'/><circle cx='240' cy='190' r='6' fill='#6B4A2A'/><path d='M234 197h12l2 15h-16z' fill='#5B8DD6'/></g><g><rect x='96' y='226' width='138' height='28' rx='8' fill='#fff' stroke='#C0392B'/><text x='165' y='244' text-anchor='middle' font-size='11.5' fill='#C0392B'>« Le maïs mange la terre ! »</text></g><path d='M330 0v260' stroke='#C9D3E6' stroke-width='2' stroke-dasharray='6 5'/><rect x='330' y='0' width='310' height='260' fill='#F8FAFD'/><text x='485' y='24' text-anchor='middle' font-size='12.5' font-weight='600' fill='#1E499B'>Le pot de maïs de la 4e (labo du collège)</text><g><rect x='360' y='200' width='100' height='12' rx='3' fill='#8E96A6'/><rect x='370' y='212' width='80' height='26' rx='4' fill='#3B5675'/><text x='410' y='230' text-anchor='middle' font-size='11' fill='#fff'>8,000 kg</text><path d='M385 200l6-36h38l6 36z' fill='#C0623E'/><path d='M410 166v-14' stroke='#4F9E36' stroke-width='3'/><path d='M410 156c-8-2-12-7-12-11 7 1 11 5 12 11z' fill='#5DAA3A'/><text x='410' y='254' text-anchor='middle' font-size='12' font-weight='600' fill='#001136'>Semaine 0</text></g><path d='M470 150h40' stroke='#1E499B' stroke-width='3'/><path d='M510 150l-10-6v12z' fill='#1E499B'/><g><rect x='520' y='200' width='100' height='12' rx='3' fill='#8E96A6'/><rect x='530' y='212' width='80' height='26' rx='4' fill='#3B5675'/><text x='570' y='230' text-anchor='middle' font-size='11' fill='#fff'>7,996 kg</text><path d='M545 200l6-36h38l6 36z' fill='#C0623E'/><path d='M570 166V46' stroke='#4F9E36' stroke-width='5'/><g fill='#5DAA3A'><path d='M570 140c-26-4-40-16-46-30 22 0 38 10 46 30zM570 112c24-4 38-16 44-30-22 0-36 10-44 30zM570 88c-22-4-34-14-40-26 18 0 32 8 40 26zM570 66c20-4 30-12 34-24-16 0-28 8-34 24z'/></g><text x='570' y='254' text-anchor='middle' font-size='12' font-weight='600' fill='#001136'>Semaine 12</text><text x='600' y='58' font-size='10.5' fill='#001136'>terre</text><text x='600' y='70' font-size='10.5' fill='#001136'>seule</text></g></svg>",
      legende: "À gauche, le champ de la famille à Mbalmayo. À droite, l'essai fait au collège : la balance pèse la terre sèche du pot, avant et après.",
      contexte: "<p>Pendant les vacances, Ngono aide sa mère au champ de maïs, derrière la maison, à Mbalmayo. Chaque saison, le champ donne des sacs entiers d'épis, et pourtant le sol ne s'enfonce pas. Son petit frère Ekani a sa réponse : « Le maïs mange la terre, c'est pour ça qu'on met de l'engrais. »</p><p>À la rentrée, la professeure de SVT propose à la classe de vérifier. Les élèves sèchent et pèsent la terre d'un grand pot, y sèment <strong>une graine de maïs</strong>, l'arrosent <strong>uniquement à l'eau</strong> pendant douze semaines sur le rebord de la fenêtre, puis repèsent tout. Ngono rassemble trois documents pour son compte rendu.</p>",
      documents: [
        { t: "Les pesées de la classe", html: "<table class='donnees'><tr><th></th><th>Semaine 0</th><th>Semaine 12</th></tr><tr><td>Maïs</td><td>0,35 g (la graine)</td><td>450 g (plant frais)</td></tr><tr><td>Terre sèche du pot</td><td>8,000 kg</td><td>7,996 kg</td></tr></table><p>Apport : environ 30 L d'eau, rien d'autre.</p>", source: "Valeurs données pour l'exercice. Au XVIIe siècle, Van Helmont avait obtenu le même genre de résultat avec un saule pendant cinq ans." },
        { t: "De quoi est fait un plant de maïs ?", html: "<p>Un plant frais contient environ <strong>80 % d'eau</strong>. Une fois séché à l'étuve, ce qui reste (la matière sèche) se répartit ainsi :</p><svg viewBox='0 0 300 120' role='img' aria-label='Composition de la matière sèche : environ 45 pour cent de carbone, 45 pour cent d oxygène, 6 pour cent d hydrogène, 4 pour cent d éléments minéraux'><g font-size='11.5' fill='#001136'><text x='0' y='20'>Carbone</text><text x='0' y='46'>Oxygène</text><text x='0' y='72'>Hydrogène</text><text x='0' y='98'>Minéraux</text></g><rect x='74' y='9' width='171' height='15' rx='3' fill='#1E499B'/><rect x='74' y='35' width='171' height='15' rx='3' fill='#5B8DD6'/><rect x='74' y='61' width='23' height='15' rx='3' fill='#9DB4D8'/><rect x='74' y='87' width='15' height='15' rx='3' fill='#C9A97A'/><g font-size='11.5' font-weight='600' fill='#001136'><text x='252' y='21'>≈ 45 %</text><text x='252' y='47'>≈ 45 %</text><text x='104' y='73'>≈ 6 %</text><text x='96' y='99'>≈ 4 % (N, K, P, Ca…)</text></g></svg>", source: "Ordres de grandeur classiques pour la matière sèche d'un végétal." },
        { t: "Deux observations de Ngono", html: "<p>1. Un plant de maïs oublié une semaine dans le magasin <strong>sans fenêtre</strong>, pourtant arrosé, est devenu jaune pâle, long et mou.</p><p>2. Dans l'air que nous respirons, il y a environ <strong>0,04 % de dioxyde de carbone</strong> (CO₂), un gaz qui contient du carbone.</p>" }
      ],
      question: "D'où viennent les 450 g du plant de maïs, alors que la terre du pot n'a perdu que 4 g ?",
      tache: "Exploite les documents et les expériences de la leçon pour répondre à Ekani par un texte argumenté de cinq à huit lignes, que tu pourras lire à ta famille.",
      hypotheses: [
        "Le maïs fabrique sa matière avec la terre qu'il « mange » (hypothèse d'Ekani).",
        "La matière du maïs vient de l'eau d'arrosage, et de rien d'autre.",
        "Une partie de la matière vient de l'air, captée grâce à la lumière."
      ]
    },
    parties: [
      { t: "Ce que la plante prend dans le sol", html:
        "<p>Commençons par vérifier l'idée d'Ekani. Si le maïs « mangeait » la terre, la terre du pot aurait perdu à peu près ce que le plant a gagné. Or les pesées disent autre chose.</p>" +
        "<h3>Les racines absorbent l'eau et les sels minéraux</h3><p>Près de leur extrémité, les jeunes racines portent des milliers de <strong>poils absorbants</strong>, des cellules très fines au contact de la terre humide. Elles absorbent :</p><ul><li>de l'<strong>eau</strong>, en très grande quantité ;</li><li>des <strong>sels minéraux</strong> dissous dans cette eau : nitrates (azote), phosphates, potassium, calcium…</li></ul>" +
        "<div class='def'><b>Définition</b>La <strong>sève brute</strong> est le mélange d'eau et de sels minéraux absorbé par les racines. Elle monte jusqu'aux feuilles par des vaisseaux conducteurs, le <strong>xylème</strong> (ce sont les nervures que tu vois sur une feuille).</div>" +
        "<div class='attention'><b>Attention</b>Les sels minéraux sont <strong>indispensables</strong> : sans azote, le maïs jaunit et donne de petits épis. C'est pour cela que la famille de Ngono met de l'engrais (NPK, urée) ou de la fiente de poule. Mais ils ne pèsent presque rien : quelques grammes, là où la plante en gagne des centaines.</div>",
        planches: [{ type: "2D", titre: "La zone des poils absorbants", legende: "Les poils absorbants multiplient la surface de contact avec la terre humide : c'est par eux qu'entre la sève brute.", svg:
          "<svg viewBox='0 0 640 260' role='img' aria-label='Racine de jeune plant et zoom sur les poils absorbants'><rect width='640' height='260' fill='#F6EEDD'/><g fill='#E2CFA6'><circle cx='40' cy='40' r='5'/><circle cx='90' cy='180' r='6'/><circle cx='200' cy='60' r='4'/><circle cx='250' cy='210' r='5'/><circle cx='150' cy='120' r='3'/></g><path d='M140 0v110c0 40-10 80-30 120' stroke='#D8B98A' stroke-width='18' fill='none' stroke-linecap='round'/><path d='M140 0v110c0 40-10 80-30 120' stroke='#F2E2C2' stroke-width='10' fill='none' stroke-linecap='round'/><g stroke='#E9D3A8' stroke-width='1.5'><path d='M131 120h-22M131 130h-26M131 140h-24M131 150h-22M149 120h22M149 130h26M149 140h24M148 150h20M128 160h-20M146 160h22'/></g><circle cx='140' cy='138' r='34' fill='none' stroke='#1E499B' stroke-width='2' stroke-dasharray='5 4'/><path d='M174 138L300 90' stroke='#1E499B' stroke-width='1.5' stroke-dasharray='5 4'/><circle cx='440' cy='130' r='118' fill='#FBF5E8' stroke='#1E499B' stroke-width='2'/><path d='M430 12v236' stroke='#D8B98A' stroke-width='60'/><g fill='#F7E9CC' stroke='#B8925A' stroke-width='1.5'><path d='M460 70c40 0 70-6 90-12v10c-22 6-50 12-90 12z'/><path d='M460 120c40 0 80 0 100 4v10c-24-4-60-4-100-4z'/><path d='M460 170c34 4 64 14 84 24l-4 9c-20-10-48-20-80-23z'/><path d='M400 95c-30-2-52-10-66-18l4-9c14 8 34 14 62 17z'/><path d='M400 150c-34 2-56 8-70 16l-4-9c16-8 40-15 74-17z'/></g><g fill='#5B8DD6'><circle cx='566' cy='60' r='5'/><circle cx='576' cy='128' r='5'/><circle cx='556' cy='204' r='5'/><circle cx='322' cy='70' r='5'/></g><g fill='#C0392B'><rect x='572' y='92' width='7' height='7'/><rect x='318' y='176' width='7' height='7'/></g><g stroke='#1E499B' stroke-width='2' fill='none'><path d='M562 66l-30 14M570 134l-30-2'/></g><g font-size='12.5' fill='#001136' font-weight='600'><text x='452' y='248'>poil absorbant (une seule cellule)</text><text x='16' y='250'>jeune racine</text></g><g font-size='11.5'><circle cx='24' cy='22' r='5' fill='#5B8DD6'/><text x='34' y='26' fill='#001136'>eau</text><rect x='70' y='17' width='9' height='9' fill='#C0392B'/><text x='84' y='26' fill='#001136'>sels minéraux</text></g></svg>" }],
        fil: { html: "<p>Reprenons le document 1. La terre est passée de 8,000 kg à 7,996 kg : elle n'a perdu que <strong>4 grammes</strong>, des sels minéraux. Pendant ce temps, le maïs a gagné environ <strong>450 g</strong>. La terre a donc fourni moins de 1 % de la masse du plant. Ekani a raison sur un point : l'engrais compte. Mais le maïs ne « mange » pas la terre.</p>", verdicts: [[0, "rejetee", "La terre a fourni 4 g sur 450 g : moins de 1 % de la masse du plant."]] },
        retenir: "Le sol fournit l'eau et les sels minéraux (sève brute), mais presque aucune masse." },

      { t: "Sans lumière, pas de matière", html:
        "<p>Si l'eau suffisait, le maïs du magasin (document 3), bien arrosé, aurait continué à grandir normalement. Il a jauni. Testons le rôle de la lumière par une expérience rigoureuse : on ne change <strong>qu'un seul facteur</strong> à la fois.</p>" +
        "<h3>L'expérience de la feuille cachée</h3><ol><li>On garde une plante 48 h à l'obscurité : ses feuilles épuisent leur réserve d'amidon.</li><li>On couvre une partie d'une feuille avec un cache opaque (papier aluminium), puis on éclaire la plante plusieurs heures.</li><li>On cueille la feuille, on la plonge dans l'eau bouillante, puis dans l'alcool chaud : elle se <strong>décolore</strong> (l'alcool dissout la chlorophylle).</li><li>On la rince et on y verse de l'<strong>eau iodée</strong>, qui colore l'amidon en <strong>bleu-noir</strong>.</li></ol>" +
        "<div class='def'><b>Résultat</b>Seule la partie <strong>éclairée</strong> devient bleu-noir. Sous le cache, la feuille reste jaune-brun : pas d'amidon. L'amidon, matière organique, est fabriqué <strong>dans la feuille</strong> et <strong>seulement à la lumière</strong>.</div>" +
        "<h3>Et la chlorophylle ?</h3><p>Avec une feuille <strong>panachée</strong> (vert et blanc, comme certains crotons de nos cours), le test à l'eau iodée ne bleuit que les zones <strong>vertes</strong>. La chlorophylle, pigment vert, est donc nécessaire : c'est elle qui capte l'énergie de la lumière.</p>" +
        "<div class='astuce'><b>Méthode</b>Une expérience prouve quelque chose seulement si elle a un <strong>témoin</strong> : ici, la partie éclairée de la même feuille. On compare deux situations qui ne diffèrent que par un facteur (la lumière).</div>",
        planches: [{ type: "Schéma d'expérience", titre: "Le test à l'eau iodée, en quatre étapes", legende: "L'amidon n'apparaît que là où la feuille a reçu la lumière.", svg:
          "<svg viewBox='0 0 640 230' role='img' aria-label='Quatre étapes du test à l eau iodée sur une feuille partiellement cachée'><rect width='640' height='230' fill='#fff'/><g font-size='12' fill='#001136' font-weight='600' text-anchor='middle'><text x='80' y='218'>1. Cache + lumière</text><text x='240' y='218'>2. Eau bouillante</text><text x='400' y='218'>3. Alcool chaud</text><text x='560' y='218'>4. Eau iodée</text></g><g><path d='M80 40c40 20 50 80 0 140-50-60-40-120 0-140z' fill='#4FA33A'/><path d='M80 40v140' stroke='#2F7D22' stroke-width='2'/><rect x='52' y='92' width='56' height='40' fill='#C9CDD6' stroke='#8E96A6'/><text x='80' y='116' text-anchor='middle' font-size='10' fill='#4D5163'>cache</text><g stroke='#FFC93C' stroke-width='3' stroke-linecap='round'><path d='M20 20l20 20M60 8l6 24M120 14l-14 22'/></g></g><g><path d='M200 90h80v90a10 10 0 0 1-10 10h-60a10 10 0 0 1-10-10z' fill='#DCEBFA' stroke='#5B8DD6' stroke-width='2'/><path d='M240 70c20 10 24 40 0 70-24-30-20-60 0-70z' fill='#5FA845'/><g fill='#fff' stroke='#5B8DD6'><circle cx='220' cy='170' r='4'/><circle cx='258' cy='160' r='3'/><circle cx='236' cy='150' r='3'/></g><path d='M226 196q4 10 0 18M254 196q4 10 0 18' stroke='#C0392B' stroke-width='2' fill='none'/></g><g><path d='M360 90h80v90a10 10 0 0 1-10 10h-60a10 10 0 0 1-10-10z' fill='#E8F4D8' stroke='#7FB800' stroke-width='2'/><path d='M400 70c20 10 24 40 0 70-24-30-20-60 0-70z' fill='#EDE7C4' stroke='#B8AE7A'/><text x='400' y='176' text-anchor='middle' font-size='10' fill='#4D5163'>alcool vert</text></g><g><path d='M560 40c40 20 50 80 0 140-50-60-40-120 0-140z' fill='#2A2F4A'/><rect x='532' y='92' width='56' height='40' fill='#E7D9A4'/><path d='M560 40v140' stroke='#1B1F33' stroke-width='2'/><text x='612' y='70' font-size='10.5' fill='#001136'>bleu-noir :</text><text x='612' y='84' font-size='10.5' fill='#001136'>amidon</text><text x='612' y='150' font-size='10.5' fill='#8A6200'>jaune-brun :</text><text x='612' y='164' font-size='10.5' fill='#8A6200'>pas d’amidon</text></g><g stroke='#1E499B' stroke-width='2' fill='#1E499B'><path d='M140 110h26'/><path d='M166 110l-8-5v10z'/><path d='M300 110h26'/><path d='M326 110l-8-5v10z'/><path d='M460 110h26'/><path d='M486 110l-8-5v10z'/></g></svg>" }],
        fil: { html: "<p>Le maïs du magasin avait de l'eau, mais pas de lumière : ses feuilles ne pouvaient plus fabriquer de matière. Il a vécu sur ses réserves, s'est allongé en cherchant la lumière, puis a jauni : c'est l'<strong>étiolement</strong>. La matière végétale se fabrique dans les parties vertes, à la lumière.</p>", verdicts: [[1, "precisee", "L'eau ne suffit pas : arrosée mais privée de lumière, la plante ne produit plus de matière."]] },
        retenir: "Matière organique (amidon) : fabriquée dans les parties vertes, seulement à la lumière, grâce à la chlorophylle." },

      { t: "Le carbone vient de l'air", html:
        "<p>Le document 2 donne une clé décisive : la matière sèche d'une plante contient environ <strong>45 % de carbone</strong>. Or l'eau (H₂O) ne contient <strong>pas</strong> de carbone, et le sol n'a presque rien fourni. D'où vient ce carbone ?</p>" +
        "<h3>L'expérience des deux cloches</h3><p>On place deux plantes identiques, privées d'amidon, sous deux cloches de verre bien éclairées :</p><ul><li>cloche A : un récipient de <strong>potasse</strong>, qui absorbe tout le CO₂ de l'air ;</li><li>cloche B (le témoin) : un récipient d'eau, l'air garde son CO₂.</li></ul><p>Après quelques heures, le test à l'eau iodée est <strong>négatif</strong> sous la cloche A, <strong>positif</strong> sous la cloche B.</p>" +
        "<div class='def'><b>Conclusion</b>Pour fabriquer de la matière organique, la feuille a besoin du <strong>dioxyde de carbone de l'air</strong>. C'est lui qui apporte le carbone de la plante.</div>" +
        "<div class='savais'><b>Le savais-tu ?</b>L'air ne contient que 0,04 % de CO₂. Pour en extraire assez de carbone, une feuille échange en permanence d'énormes volumes d'air : un grand arbre « filtre » ainsi l'air autour de lui toute la journée.</div>",
        planches: [{ type: "Schéma d'expérience", titre: "Les deux cloches : avec et sans CO₂", legende: "Un seul facteur change d'une cloche à l'autre : la présence de dioxyde de carbone.", svg:
          "<svg viewBox='0 0 640 250' role='img' aria-label='Deux plantes sous cloche, l une avec potasse qui retire le CO2, l autre avec de l eau'><rect width='640' height='250' fill='#fff'/><g stroke='#FFC93C' stroke-width='3' stroke-linecap='round'><path d='M320 10v24M296 18l10 18M344 18l-10 18'/></g><circle cx='320' cy='8' r='0'/><g><path d='M60 210V90a100 80 0 0 1 200 0v120' fill='#EEF6FF' fill-opacity='.7' stroke='#7FA6D6' stroke-width='3'/><rect x='40' y='208' width='240' height='10' rx='3' fill='#8E96A6'/><rect x='130' y='180' width='40' height='28' fill='#B8784A'/><path d='M150 180v-60' stroke='#3F8F2A' stroke-width='4'/><path d='M150 140c-26-6-34-22-30-34 18 4 28 16 30 34zM150 126c24-6 32-22 28-34-18 4-26 16-28 34z' fill='#5FA845'/><rect x='200' y='188' width='44' height='20' rx='3' fill='#F4F1E6' stroke='#8E96A6'/><text x='222' y='202' text-anchor='middle' font-size='10' fill='#4D5163'>potasse</text><text x='160' y='238' text-anchor='middle' font-size='13' font-weight='600' fill='#001136'>Cloche A : air sans CO₂</text><text x='92' y='70' font-size='12' fill='#C0392B' font-weight='600'>pas de CO₂</text></g><g><path d='M380 210V90a100 80 0 0 1 200 0v120' fill='#EEF6FF' fill-opacity='.7' stroke='#7FA6D6' stroke-width='3'/><rect x='360' y='208' width='240' height='10' rx='3' fill='#8E96A6'/><rect x='450' y='180' width='40' height='28' fill='#B8784A'/><path d='M470 180v-60' stroke='#3F8F2A' stroke-width='4'/><path d='M470 140c-26-6-34-22-30-34 18 4 28 16 30 34zM470 126c24-6 32-22 28-34-18 4-26 16-28 34z' fill='#5FA845'/><rect x='520' y='188' width='44' height='20' rx='3' fill='#DCEBFA' stroke='#8E96A6'/><text x='542' y='202' text-anchor='middle' font-size='10' fill='#4D5163'>eau</text><text x='480' y='238' text-anchor='middle' font-size='13' font-weight='600' fill='#001136'>Cloche B (témoin) : air normal</text><g font-size='11' fill='#1E499B' font-weight='600'><text x='400' y='76'>CO₂</text><text x='530' y='110'>CO₂</text><text x='420' y='150'>CO₂</text></g></g><g font-size='12' font-weight='600'><text x='150' y='100' text-anchor='middle' fill='#8A6200'>test iodé : négatif</text><text x='470' y='100' text-anchor='middle' fill='#1F7A45'>test iodé : positif</text></g></svg>" }],
        fil: { html: "<p>Calculons. Les 450 g de maïs frais contiennent 80 % d'eau, donc environ <strong>90 g de matière sèche</strong>, dont 45 % de carbone : environ <strong>40 g de carbone</strong>. Ce carbone ne peut venir ni de la terre (4 g en tout), ni de l'eau (H₂O n'a pas de carbone) : il vient du <strong>CO₂ de l'air</strong>, que les feuilles captent à la lumière. Van Helmont, au XVIIᵉ siècle, ne connaissait pas encore les gaz de l'air : il avait conclu, à tort, que tout venait de l'eau.</p>", verdicts: [[1, "rejetee", "L'eau ne contient pas de carbone : elle ne peut pas fournir les 40 g de carbone du plant."], [2, "validee", "Le carbone de la plante vient du CO₂ de l'air."]] },
        retenir: "Le carbone de la plante vient du dioxyde de carbone de l'air." },

      { t: "La feuille, une usine en trois dimensions", html:
        "<p>Où se rencontrent l'eau venue des racines, le CO₂ venu de l'air et la lumière ? Dans la <strong>feuille</strong>. Observe sa structure en coupe : fais tourner la planche, puis écarte les couches.</p>" +
        "<ul><li><strong>Épiderme supérieur</strong> et sa <strong>cuticule</strong> cireuse : transparents, ils laissent passer la lumière et limitent les pertes d'eau.</li><li><strong>Parenchyme palissadique</strong> : des cellules allongées, serrées, bourrées de <strong>chloroplastes</strong>. C'est là que la lumière est le plus captée.</li><li><strong>Parenchyme lacuneux</strong> : des cellules arrondies séparées par des espaces remplis d'air, où circule le CO₂.</li><li><strong>Nervures</strong> : elles apportent la sève brute (xylème) et emportent la sève élaborée, chargée de sucres (phloème).</li><li><strong>Épiderme inférieur</strong> percé de <strong>stomates</strong> : de minuscules orifices bordés de deux cellules qui s'ouvrent et se ferment. Le CO₂ entre, le dioxygène et la vapeur d'eau sortent.</li></ul>" +
        "<div class='def'><b>Définition</b>Le <strong>chloroplaste</strong> est un petit organite vert de la cellule végétale. Il contient la <strong>chlorophylle</strong> et c'est en lui que se fabriquent les sucres, puis l'amidon.</div>",
        planches: [
          { type: "3d", titre: "Bloc de feuille en coupe", legende: "Fais glisser pour tourner ; le curseur écarte l'épiderme supérieur, le palissadique et l'épiderme inférieur.",
            modele: { h: 420, rx: -22, ry: 28, echelle: 1.12, dy: 10, eclate: "Écarter les couches", alt: "Bloc de feuille en trois dimensions : épidermes, parenchymes, nervure et stomates", objets: feuille3D(),
              etiquettes: [
                { p: [-170, 79, 90], t: "Cuticule + épiderme sup.", ec: [0, 95, 0] },
                { p: [-162, 40, 80], t: "Parenchyme palissadique", ec: [0, 48, 0] },
                { p: [-150, -24, 75], t: "Parenchyme lacuneux" },
                { p: [-170, -56, 90], t: "Épiderme inférieur", ec: [0, -65, 0] },
                { p: [50, -28, 100], t: "Nervure (sèves)", cote: "d" },
                { p: [50, -28, 100], t: "Xylème : sève brute", cote: "d" },
                { p: [-20, -64, 50], t: "Stomate : entrée du CO₂", cote: "d", ec: [0, -65, 0] },
                { p: [162, 68, -80], t: "Cellule chlorophyllienne", cote: "d", ec: [0, 48, 0] }
              ] } },
          { type: "3d", titre: "Un chloroplaste, agrandi environ 10 000 fois", legende: "Les empilements de disques (grana) portent la chlorophylle ; les sucres sont assemblés dans le liquide qui les entoure (stroma) et mis en réserve sous forme d'amidon.",
            modele: { h: 340, rx: -30, ry: 20, echelle: 1.2, alt: "Chloroplaste en trois dimensions avec ses grana et un grain d amidon", objets: chloroplaste3D(),
              etiquettes: [
                { p: [-170, 0, 0], t: "Enveloppe (double membrane)" },
                { p: [-110, -12, 10], t: "Granum : la chlorophylle" },
                { p: [20, -40, 60], t: "Stroma : fabrique des sucres", cote: "d" },
                { p: [70, 40, 45], t: "Grain d'amidon", cote: "d" }
              ] } }
        ],
        fil: { html: "<p>On sait maintenant <strong>où</strong> se fabrique la matière du maïs : dans les chloroplastes de ses longues feuilles. Le CO₂ y arrive par les stomates et les lacunes, l'eau par les nervures, la lumière à travers l'épiderme transparent. C'est pour cela qu'on ne sème pas le maïs trop serré : chaque plant a besoin de sa part de soleil.</p>", verdicts: [[2, "precisee", "Le CO₂ entre par les stomates et rejoint les chloroplastes, où la lumière est captée."]] },
        retenir: "Feuille = usine : la lumière traverse l'épiderme, le CO₂ entre par les stomates, l'eau arrive par les nervures, tout se rencontre dans les chloroplastes." },

      { t: "Le bilan : la photosynthèse", html:
        "<p>Rassemblons les pièces du puzzle. Dans les chloroplastes, grâce à l'énergie lumineuse captée par la chlorophylle, l'eau et le dioxyde de carbone sont transformés en <strong>sucres</strong> (glucose), puis en <strong>amidon</strong> et en tous les constituants de la plante (bois, feuilles, fruits). Du <strong>dioxygène</strong> est rejeté.</p>" +
        "<div class='def'><b>Définition</b>La <strong>photosynthèse</strong> est la production de matière organique par les végétaux chlorophylliens, à partir d'eau et de dioxyde de carbone, en utilisant l'énergie lumineuse. Elle rejette du dioxygène.</div>" +
        "<p class='formule'>eau + dioxyde de carbone —(lumière, chlorophylle)→ matière organique + dioxygène</p>" +
        "<div class='savais'><b>Pour aller plus loin (2nde)</b>On écrira plus tard l'équation chimique : 6 CO₂ + 6 H₂O → C₆H₁₂O₆ + 6 O₂. Le carbone du glucose (C₆) vient entièrement du CO₂.</div>" +
        "<h3>Prouver le dégagement de dioxygène : l'élodée</h3><p>On place une plante aquatique, l'élodée, dans de l'eau sous une lampe. Des <strong>bulles</strong> montent des feuilles et s'accumulent dans un tube retourné. Une allumette présentant un point incandescent (une « bûchette ») se <strong>rallume</strong> dans ce gaz : c'est du <strong>dioxygène</strong>. Plus on rapproche la lampe, plus les bulles sont nombreuses ; dans le noir, elles cessent.</p>" +
        "<div class='attention'><b>Attention</b>La plante <strong>respire aussi</strong>, jour et nuit, comme nous : elle consomme du dioxygène et rejette du CO₂. Le jour, la photosynthèse l'emporte largement ; la nuit, il ne reste que la respiration.</div>",
        planches: [
          { type: "Schéma d'expérience", titre: "L'élodée sous la lampe", legende: "Le gaz recueilli ravive une bûchette incandescente : c'est du dioxygène.", svg:
            "<svg viewBox='0 0 640 250' role='img' aria-label='Élodée dans un bécher éclairé par une lampe, bulles recueillies dans un tube, bûchette qui se rallume'><rect width='640' height='250' fill='#fff'/><g><path d='M60 60l60 20v30l-60 20z' fill='#4D5163'/><circle cx='128' cy='95' r='18' fill='#FFE08A' stroke='#E0A800' stroke-width='2'/><g stroke='#FFC93C' stroke-width='3' stroke-linecap='round'><path d='M156 80l40-10M158 96h44M156 112l40 10'/></g><text x='40' y='160' font-size='12' font-weight='600' fill='#001136'>lampe</text></g><g><path d='M230 60v160a14 14 0 0 0 14 14h132a14 14 0 0 0 14-14V60' fill='#DCEBFA' fill-opacity='.8' stroke='#5B8DD6' stroke-width='3'/><path d='M232 90h156' stroke='#5B8DD6' stroke-width='1.5' stroke-dasharray='6 4'/><path d='M310 230c0-40-6-80 0-130' stroke='#2F7D22' stroke-width='4' fill='none'/><g fill='#3F8F2A'><ellipse cx='296' cy='200' rx='14' ry='5' transform='rotate(-25 296 200)'/><ellipse cx='324' cy='185' rx='14' ry='5' transform='rotate(25 324 185)'/><ellipse cx='296' cy='165' rx='14' ry='5' transform='rotate(-25 296 165)'/><ellipse cx='324' cy='150' rx='14' ry='5' transform='rotate(25 324 150)'/><ellipse cx='298' cy='130' rx='13' ry='5' transform='rotate(-25 298 130)'/></g><path d='M296 40h28v86h-28z' fill='#EEF6FF' stroke='#7FA6D6' stroke-width='2'/><rect x='298' y='42' width='24' height='26' fill='#fff'/><g fill='#fff' stroke='#5B8DD6' stroke-width='1.2'><circle cx='312' cy='118' r='3'/><circle cx='308' cy='104' r='2.5'/><circle cx='315' cy='92' r='3'/><circle cx='310' cy='80' r='2.5'/></g><text x='400' y='120' font-size='12' fill='#001136'>bulles de gaz</text><path d='M396 116h-70' stroke='#1E499B' stroke-width='1.5'/><text x='250' y='248' font-size='12' font-weight='600' fill='#001136'>élodée dans l’eau</text></g><g><path d='M500 60h28v110h-28z' fill='#EEF6FF' stroke='#7FA6D6' stroke-width='2'/><path d='M514 20v60' stroke='#8A6A3E' stroke-width='4'/><circle cx='514' cy='82' r='6' fill='#FF8A00'/><path d='M514 70c-6 6-6 12 0 16 6-4 6-10 0-16z' fill='#FFC93C'/><text x='540' y='70' font-size='12' fill='#001136' font-weight='600'>la bûchette</text><text x='540' y='86' font-size='12' fill='#001136' font-weight='600'>se rallume :</text><text x='540' y='102' font-size='12' fill='#1F7A45' font-weight='600'>dioxygène</text></g></svg>" },
          { type: "Planche bilan", titre: "Les échanges d'un arbre en plein soleil", legende: "Ce qui entre (bleu) et ce qui sort (vert) : c'est vrai pour le maïs du champ comme pour le manguier de la cour.", svg:
            "<svg viewBox='0 0 640 330' role='img' aria-label='Bilan des échanges d un arbre : lumière, CO2 et eau entrent ; dioxygène et vapeur d eau sortent ; sève brute monte, sève élaborée descend'><rect width='640' height='330' fill='#F4F9FF'/><rect y='252' width='640' height='78' fill='#E8DABB'/><circle cx='70' cy='50' r='26' fill='#FFC93C'/><g stroke='#FFC93C' stroke-width='4' stroke-linecap='round'><path d='M110 66l90 30M104 86l80 54'/></g><text x='40' y='100' font-size='13' font-weight='600' fill='#8A6200'>lumière</text><path d='M320 252V150' stroke='#6B4A2A' stroke-width='22' stroke-linecap='round'/><path d='M320 180l-60-46M320 165l58-50' stroke='#6B4A2A' stroke-width='10' stroke-linecap='round'/><ellipse cx='320' cy='100' rx='150' ry='72' fill='#3E8E2F'/><ellipse cx='260' cy='86' rx='70' ry='44' fill='#5DAA3A'/><ellipse cx='380' cy='108' rx='70' ry='40' fill='#4F9E36'/><g stroke='#4D3A24' stroke-width='6' stroke-linecap='round' fill='none'><path d='M320 252c-20 20-60 30-90 46M320 252c20 22 56 34 96 42M320 256v52'/></g><g stroke='#1E499B' stroke-width='3' fill='#1E499B'><path d='M560 70h-80'/><path d='M480 70l12-7v14z'/><path d='M120 290h70'/><path d='M190 290l-12-7v14z'/><path d='M332 240V176'/><path d='M332 176l-7 12h14z'/></g><g stroke='#1F7A45' stroke-width='3' fill='#1F7A45'><path d='M470 140h90'/><path d='M560 140l-12-7v14z'/><path d='M200 30l-60-14'/><path d='M140 16l13-1-4 13z'/><path d='M308 176v64'/><path d='M308 240l-7-12h14z'/></g><g font-size='13' font-weight='600'><text x='490' y='60' fill='#1E499B'>CO₂ de l’air</text><text x='490' y='160' fill='#1F7A45'>dioxygène</text><text x='150' y='14' fill='#1F7A45'>vapeur d’eau</text><text x='60' y='280' fill='#1E499B'>eau + sels minéraux</text><text x='346' y='214' fill='#1E499B'>sève brute ↑</text><text x='196' y='214' fill='#1F7A45'>sève élaborée ↓</text></g><text x='320' y='104' text-anchor='middle' font-size='14' font-weight='600' fill='#fff'>photosynthèse dans les feuilles</text></svg>" }
        ],
        labo: { type: "photosynthese", l: 40, co2: 0.04 },
        fil: { html: "<p>Le bilan de la photosynthèse ferme l'enquête : la matière du maïs est faite de <strong>carbone pris au CO₂ de l'air</strong> et d'<strong>eau puisée par les racines</strong>, assemblés dans les feuilles grâce à l'<strong>énergie de la lumière</strong>. La terre n'apporte que les sels minéraux, en quantité minuscule.</p>", verdicts: [[2, "validee", "L'air (CO₂) et l'eau, assemblés à la lumière, forment la matière du maïs."]] },
        retenir: "Photosynthèse : eau + CO₂ → matière organique + dioxygène, à la lumière, dans les chloroplastes." }
    ],
    denouement: {
      titre: "D'où viennent les 450 g du maïs ?",
      etapes: [
        "La terre n'a perdu que 4 g (des sels minéraux) : le maïs ne « mange » pas la terre (indice 1).",
        "Arrosé mais privé de lumière, un plant ne fabrique plus de matière : l'eau seule ne suffit pas (indice 2).",
        "450 g de plant frais = environ 360 g d'eau + 90 g de matière sèche, dont environ 40 g de carbone, venu du CO₂ de l'air (indice 3).",
        "Ce CO₂ entre par les stomates et rejoint les chloroplastes, où l'eau des nervures arrive aussi (indice 4).",
        "Dans les chloroplastes, la lumière permet d'assembler eau et CO₂ en matière organique, avec rejet de dioxygène : c'est la photosynthèse (indice 5)."
      ],
      reponse: "<p>Ekani, le maïs ne mange pas la terre : en douze semaines, la terre du pot n'a perdu que 4 g, alors que le plant a gagné 450 g. Ces 4 g, ce sont des sels minéraux, utiles comme l'engrais que met maman, mais très légers. Le plant contient surtout de l'eau puisée par ses racines, et sa matière sèche est faite à moitié de carbone, que ni la terre ni l'eau ne contiennent : il vient du dioxyde de carbone de l'air, qui entre par les stomates des feuilles. Dans les chloroplastes, grâce à la lumière captée par la chlorophylle, le maïs assemble ce CO₂ et l'eau en sucres, puis en tiges, en feuilles et en épis, en rejetant du dioxygène. Nos épis sont donc faits d'air, d'eau et de soleil.</p>",
      transfert: "<p>À Bafia, l'oncle de Ngono a semé son maïs très serré, sous de grands manguiers. Avec le même engrais et la même pluie, ses épis sont deux fois plus petits que ceux de son voisin, semés en plein soleil et bien espacés. Explique-lui, en t'appuyant sur la photosynthèse, pourquoi, et propose-lui deux solutions pour la prochaine saison.</p>"
    },
    revision: [
      "Le sol fournit l'<strong>eau</strong> et les <strong>sels minéraux</strong> (sève brute), absorbés par les <strong>poils absorbants</strong>, mais presque aucune masse.",
      "Test à l'<strong>eau iodée</strong> : bleu-noir = présence d'<strong>amidon</strong>.",
      "Feuille cachée : amidon seulement dans la partie <strong>éclairée</strong> → la lumière est indispensable.",
      "Feuille panachée : amidon seulement dans les zones <strong>vertes</strong> → la chlorophylle est indispensable.",
      "Cloche avec potasse : pas d'amidon → le <strong>CO₂</strong> de l'air est indispensable ; il apporte le carbone (≈ 45 % de la matière sèche).",
      "Feuille : épiderme et cuticule, parenchyme <strong>palissadique</strong> (chloroplastes), parenchyme <strong>lacuneux</strong>, nervures, <strong>stomates</strong>.",
      "<strong>Photosynthèse</strong> : eau + CO₂ → matière organique + dioxygène, à la lumière, dans les <strong>chloroplastes</strong>.",
      "Élodée : les bulles rallument une bûchette → <strong>dioxygène</strong> ; plus de lumière, plus de bulles."
    ],
    exo: "<p><strong>Exercice.</strong> Un élève place trois boutures de patate douce identiques, arrosées de la même façon : A en plein soleil, B sous une tôle (obscurité), C au soleil mais avec les feuilles enduites de vaseline sur leur face inférieure. Après une semaine, seule A a grossi.</p><ol><li>Pourquoi B n'a-t-elle pas grossi ?</li><li>La vaseline bouche les stomates : explique le résultat de C.</li><li>Quel est le rôle de A dans cette expérience ?</li></ol><p><em>Corrigé : 1. Sans lumière, pas de photosynthèse. 2. Le CO₂ ne peut plus entrer dans la feuille : pas de matière fabriquée. 3. C'est le témoin.</em></p>",
    quiz: [
      { q: "Dans l'essai de la classe, combien la terre du pot a-t-elle perdu en douze semaines ?", r: ["Environ 4 g", "Environ 450 g", "Environ 8 kg"], b: 0, e: "8,000 kg − 7,996 kg = 0,004 kg, soit 4 g." },
      { q: "Que colore l'eau iodée en bleu-noir ?", r: ["L'amidon", "La chlorophylle", "Le dioxygène"], b: 0, e: "C'est le test caractéristique de l'amidon." },
      { q: "Une feuille en partie cachée puis éclairée : où trouve-t-on de l'amidon ?", r: ["Seulement dans la partie éclairée", "Seulement sous le cache", "Partout sur la feuille"], b: 0, e: "La lumière est indispensable à la fabrication de l'amidon." },
      { q: "Pourquoi plonge-t-on la feuille dans l'alcool chaud avant le test ?", r: ["Pour dissoudre la chlorophylle et voir la couleur", "Pour fabriquer de l'amidon", "Pour tuer les stomates"], b: 0, e: "Une feuille décolorée laisse voir le bleu-noir de l'iode." },
      { q: "Sous une cloche contenant de la potasse, la plante ne fabrique pas d'amidon car…", r: ["la potasse a retiré le CO₂ de l'air", "la potasse bloque la lumière", "la potasse retire l'eau du sol"], b: 0, e: "Sans CO₂, pas de carbone pour fabriquer la matière." },
      { q: "D'où vient le carbone qui forme la tige et les épis du maïs ?", r: ["Du dioxyde de carbone de l'air", "De l'eau d'arrosage", "Des sels minéraux du sol"], b: 0, e: "L'eau (H₂O) ne contient pas de carbone ; le sol en fournit presque rien." },
      { q: "Par où le CO₂ entre-t-il dans la feuille ?", r: ["Par les stomates", "Par les poils absorbants", "Par les nervures"], b: 0, e: "Les stomates sont les orifices de l'épiderme inférieur." },
      { q: "Dans quelle couche de la feuille trouve-t-on le plus de chloroplastes ?", r: ["Le parenchyme palissadique", "L'épiderme inférieur", "La cuticule"], b: 0, e: "Ses cellules allongées et serrées captent l'essentiel de la lumière." },
      { q: "Quel gaz rallume une bûchette incandescente au-dessus de l'élodée ?", r: ["Le dioxygène", "Le dioxyde de carbone", "La vapeur d'eau"], b: 0, e: "C'est le test caractéristique du dioxygène." },
      { q: "La nuit, une plante…", r: ["respire seulement : elle rejette du CO₂", "fait davantage de photosynthèse", "ne fait plus aucun échange gazeux"], b: 0, e: "Sans lumière, il ne reste que la respiration." }
    ]
  });

  /* ════════════════════ MATHS 3e — THALÈS ════════════════════ */
  VRT_L("3e-maths-thales", {
    c: "3e", m: "maths", cle: "Propriété directe de Thalès", titre: "La propriété de Thalès dans le triangle", duree: 35,
    accroche: "Lundi, levée des couleurs : la corde du drapeau a cassé. Combien en acheter ? Un manche à balai et deux ombres suffisent.",
    intro: "Une seule situation te suit toute la leçon : à chaque partie, tu fais un pas de plus vers la hauteur du mât du drapeau de ton collège.",
    objectifs: ["reconnaître une configuration de Thalès (triangles emboîtés ou papillon)", "écrire l'égalité des trois rapports dans le bon ordre", "calculer une longueur inaccessible", "utiliser la réciproque pour prouver un parallélisme"],
    enquete: {
      titre: "La corde du drapeau a cassé",
      svg: "<svg viewBox='0 0 640 250' role='img' aria-label='Cour du collège : le mât du drapeau, un élève tient un manche à balai, les deux ombres se terminent au même point'><rect width='640' height='250' fill='#EAF4FF'/><circle cx='600' cy='36' r='20' fill='#FFC93C'/><rect x='0' y='120' width='640' height='86' fill='#F1E6CF'/><path d='M0 120h640' stroke='#B5523B' stroke-width='10'/><g fill='#5B8DD6'><rect x='30' y='145' width='46' height='32'/><rect x='120' y='145' width='46' height='32'/><rect x='420' y='145' width='46' height='32'/><rect x='510' y='145' width='46' height='32'/></g><rect x='560' y='140' width='34' height='66' fill='#8E6A3E'/><text x='300' y='140' text-anchor='middle' font-size='11' fill='#8E6A3E' font-weight='600'>COLLÈGE — CLASSES DE 3e</text><rect y='204' width='640' height='46' fill='#D9C7A0'/><rect x='180' y='196' width='30' height='10' fill='#BFB8AA'/><path d='M195 198V30' stroke='#AEB4C0' stroke-width='5'/><path d='M195 34h22v26h-22z' fill='#1F8A4C'/><path d='M217 34h22v26h-22z' fill='#C0392B'/><path d='M239 34h22v26h-22z' fill='#F2C200'/><path d='M228 41l2 5h5l-4 3 2 5-5-3-5 3 2-5-4-3h5z' fill='#F2C200'/><path d='M196 60v138' stroke='#7A4A1E' stroke-width='1.2' stroke-dasharray='3 3'/><path d='M195 30L470 204' stroke='#F2B705' stroke-width='2.5' stroke-dasharray='8 5'/><path d='M195 204h275' stroke='#4D4A44' stroke-width='6' opacity='.4'/><path d='M436 204v-22' stroke='#7A4A1E' stroke-width='4'/><g><circle cx='420' cy='166' r='8' fill='#6B4A2A'/><path d='M413 176h14l3 18h-20z' fill='#E9EEF6'/><path d='M411 193h18v12h-18z' fill='#1E3A6E'/><path d='M427 180l9 4' stroke='#6B4A2A' stroke-width='3'/></g><g><circle cx='520' cy='178' r='8' fill='#6B4A2A'/><path d='M513 188h14l3 18h-20z' fill='#E9EEF6'/><path d='M511 205h18v4h-18z' fill='#1E3A6E'/><path d='M500 212h60' stroke='#C0392B' stroke-width='2'/><text x='500' y='226' font-size='10' fill='#C0392B'>double-décamètre</text></g><g font-size='12' font-weight='600' fill='#001136'><text x='120' y='26'>mât du drapeau</text><text x='388' y='158'>Ahmadou</text><text x='536' y='172'>Brenda</text><text x='268' y='242'>ombre du mât : 6,40 m</text></g></svg>",
      legende: "Croquis de la cour, sans souci d'échelle. Les rayons du soleil sont parallèles entre eux.",
      contexte: "<p>Lundi matin, à la levée des couleurs, la corde du drapeau de ton collège a cassé net. Le surveillant général doit en racheter à la quincaillerie : il faut <strong>deux fois la hauteur du mât</strong> (la corde fait l'aller et le retour), plus un mètre pour les nœuds. Personne ne connaît la hauteur du mât, et personne ne va y grimper.</p><p>Le professeur de maths propose à la 3e de trouver la réponse pendant la récréation de 10 h, par grand soleil. Ahmadou tient un <strong>manche à balai bien vertical</strong> dans la cour, à l'endroit exact où le bout de son ombre touche le bout de l'ombre du mât. Brenda mesure au double-décamètre.</p>",
      documents: [
        { t: "Les mesures de Brenda", html: "<table class='donnees'><tr><td>Hauteur du manche à balai</td><td>1,20 m</td></tr><tr><td>Ombre du manche</td><td>0,80 m</td></tr><tr><td>Ombre du mât (du pied au bout)</td><td>6,40 m</td></tr></table>" },
        { t: "Ce que disent les camarades", html: "<p><strong>Ahmadou :</strong> « 6,40 m d'ombre, donc 6,40 m de mât. C'est tout. »</p><p><strong>Kevin :</strong> « Impossible sans connaître l'angle du soleil : il faut la trigonométrie. »</p><p><strong>Brenda :</strong> « Le manche et le mât sont éclairés par le même soleil : leur ombre doit être proportionnelle à leur hauteur. »</p>" }
      ],
      question: "Quelle est la hauteur du mât, et combien de mètres de corde le surveillant doit-il acheter ?",
      tache: "Modélise la situation par une figure, justifie la propriété utilisée, calcule la hauteur du mât, puis la longueur de corde à acheter.",
      hypotheses: [
        "Le mât est aussi haut que son ombre : 6,40 m (Ahmadou).",
        "On ne peut pas conclure sans connaître l'angle des rayons du soleil (Kevin).",
        "Le rapport hauteur / ombre est le même pour le manche et pour le mât (Brenda)."
      ]
    },
    parties: [
      { t: "Modéliser : la configuration de Thalès", html:
        "<p>Pour résoudre un problème concret, on commence par le <strong>traduire en figure</strong>. Nommons les points : <strong>S</strong> le sommet du mât, <strong>A</strong> son pied, <strong>E</strong> le bout commun des deux ombres, <strong>B</strong> le haut du manche à balai et <strong>P</strong> son pied.</p>" +
        "<ul><li>Les points E, P, A sont alignés (sur le sol) ; E, B, S aussi (sur le rayon de soleil).</li><li>Le manche [PB] et le mât [AS] sont tous deux <strong>verticaux</strong>, donc <strong>parallèles</strong>.</li></ul>" +
        "<div class='def'><b>Configuration de Thalès</b>Deux droites sécantes en un point (ici E), coupées par deux droites <strong>parallèles</strong> (ici (PB) et (AS)). On obtient deux triangles « emboîtés » : le petit EPB et le grand EAS.</div>" +
        "<div class='attention'><b>Condition indispensable</b>Sans parallélisme, pas de Thalès. C'est pour cela qu'Ahmadou tient le manche <strong>bien vertical</strong>, comme le mât (vérifie-le avec un fil à plomb : un caillou au bout d'une ficelle).</div>",
        planches: [
          { type: "3d", titre: "La scène en trois dimensions", legende: "Tourne la cour : le rayon de soleil, le sol, le manche et le mât sont dans un même plan vertical. Vu de face, il ne reste qu'une figure plane : deux triangles emboîtés.",
            modele: { h: 420, rx: -12, ry: 34, echelle: 0.95, dy: 120, alt: "Cour du collège en trois dimensions : mât du drapeau, manche à balai, ombres et rayon de soleil", objets: mat3D(),
              etiquettes: [
                { p: [-100, 250, 0], t: "S : haut du mât" },
                { p: [-100, 0, 0], t: "A : pied du mât" },
                { p: [-67, 233, 0], t: "Le drapeau" },
                { p: [45, 31, 0], t: "B : haut du manche", cote: "d" },
                { p: [45, 0, 0], t: "P : pied du manche", cote: "d" },
                { p: [66, 0, 0], t: "E : bout des deux ombres", cote: "d" },
                { p: [-17, 125, 0], t: "Rayon de soleil", cote: "d" }
              ] } },
          { type: "Figure", titre: "Le modèle géométrique", legende: "Sans souci d'échelle. Petit triangle EPB, grand triangle EAS, sommet commun E.", svg:
            "<svg viewBox='0 0 640 240' role='img' aria-label='Triangle EAS rectangle en A avec le segment PB parallèle à AS'><rect width='640' height='240' fill='#fff'/><path d='M80 210H560L80 30Z' fill='#EEF3FC' stroke='#001136' stroke-width='2.5' stroke-linejoin='round'/><path d='M488 210V57' stroke='#fff' stroke-width='0'/><path d='M488 210L560 210L488 183Z' fill='#FFC93C' fill-opacity='.55'/><path d='M488 210v-27' stroke='#C0392B' stroke-width='3'/><path d='M80 196h14v14' fill='none' stroke='#001136'/><path d='M488 196h-12v14' fill='none' stroke='#C0392B'/><g font-size='16' font-weight='600' fill='#001136'><text x='62' y='28'>S</text><text x='62' y='228'>A</text><text x='566' y='228'>E</text><text x='480' y='228'>P</text><text x='478' y='176'>B</text></g><g font-size='12.5' fill='#1E499B'><text x='290' y='232'>EA = 6,40 m</text><text x='506' y='202'>0,8</text><text x='452' y='200'>1,2</text><text x='40' y='126' fill='#C0392B' font-weight='600'>h = ?</text></g></svg>" }
        ],
        fil: { html: "<p>La situation est modélisée : E est le sommet commun, P ∈ [EA], B ∈ [ES], et (PB) // (AS). C'est exactement une configuration de Thalès. On n'a besoin d'<strong>aucun angle</strong> : seulement du parallélisme.</p>", verdicts: [[1, "rejetee", "Le parallélisme du manche et du mât suffit ; aucun angle n'est nécessaire."]] },
        retenir: "Modéliser d'abord : nommer les points, repérer le sommet commun et les deux parallèles." },

      { t: "La propriété de Thalès", html:
        "<div class='def'><b>Propriété (Thalès)</b>Si les points E, P, A d'une part et E, B, S d'autre part sont alignés dans cet ordre, et si (PB) // (AS), alors les longueurs des triangles EPB et EAS sont <strong>proportionnelles</strong> :</div>" +
        "<p class='formule'>EP / EA = EB / ES = PB / AS</p>" +
        "<div class='astuce'><b>Méthode sûre</b>Écris les côtés du <strong>petit triangle en haut</strong>, ceux du <strong>grand en bas</strong>, en partant toujours du <strong>sommet commun</strong> E, et en suivant l'ordre : côté sur la 1re droite, côté sur la 2e droite, côté parallèle.</div>" +
        "<p>On peut aussi le voir comme un <strong>tableau de proportionnalité</strong> : chaque longueur du grand triangle s'obtient en multipliant celle du petit par un même coefficient k (un agrandissement).</p>" +
        "<table class='donnees'><tr><th>Petit triangle EPB</th><td>EP = 0,8</td><td>PB = 1,2</td></tr><tr><th>Grand triangle EAS</th><td>EA = 6,4</td><td>AS = ?</td></tr></table>",
        planches: [{ type: "Figure", titre: "Petit triangle, grand triangle : le même dessin agrandi", legende: "EAS est un agrandissement de EPB de coefficient k = 6,4 ÷ 0,8 = 8.", svg:
          "<svg viewBox='0 0 640 200' role='img' aria-label='Le petit triangle EPB et le grand triangle EAS côte à côte, coefficient 8'><rect width='640' height='200' fill='#fff'/><path d='M40 170h60l-60-75z' fill='#FFE7A3' stroke='#001136' stroke-width='2'/><g font-size='13' fill='#001136'><text x='60' y='190'>0,8</text><text x='8' y='138'>1,2</text></g><path d='M130 120h90' stroke='#1E499B' stroke-width='2.5'/><path d='M220 120l-12-7v14z' fill='#1E499B'/><text x='132' y='108' font-size='14' font-weight='600' fill='#1E499B'>× 8</text><path d='M260 180h360L260 20z' fill='#EEF3FC' stroke='#001136' stroke-width='2'/><g font-size='13' fill='#001136'><text x='420' y='196'>6,4</text><text x='222' y='104' fill='#C0392B' font-weight='600'>? = 1,2 × 8</text></g></svg>" }],

        fil: { html: "<p>Pour le mât, la propriété donne : EP / EA = PB / AS, soit 0,8 / 6,4 = 1,2 / AS. Brenda avait raison : le rapport ombre / hauteur est <strong>le même</strong> pour le manche et pour le mât (0,8 / 1,2 = 6,4 / AS).</p>", verdicts: [[2, "validee", "C'est exactement ce que dit la propriété de Thalès : les longueurs sont proportionnelles."]] },
        retenir: "Petit triangle sur grand triangle, sommet commun en premier : EP/EA = EB/ES = PB/AS." },

      { t: "Calculer la longueur inaccessible", html:
        "<p>On ne garde que <strong>les deux rapports utiles</strong> : celui qui contient l'inconnue et celui dont on connaît les deux longueurs.</p>" +
        "<div class='ex'><b>Rédaction modèle</b>Les points E, P, A sont alignés, ainsi que E, B, S. Les droites (PB) et (AS) sont parallèles (toutes deux verticales). D'après la propriété de Thalès : EP / EA = PB / AS, soit 0,8 / 6,4 = 1,2 / AS. Par produit en croix : AS = 6,4 × 1,2 ÷ 0,8 = <strong>9,6 m</strong>.</div>" +
        "<div class='attention'><b>Piège classique</b>Écrire 0,8 / 1,2 = AS / 6,4 mélange les deux triangles dans un même rapport : on obtient environ 4,3 m, un résultat faux. Chaque rapport compare un côté du petit triangle au côté <strong>correspondant</strong> du grand.</div>" +
        "<h3>Vérifier la vraisemblance</h3><p>Le mât dépasse nettement le toit des classes (environ 4 m) : 9,6 m, c'est la hauteur d'un immeuble de trois étages, c'est plausible. Et 9,6 ≠ 6,4 : la hauteur n'est égale à l'ombre que si le soleil est exactement à 45° au-dessus de l'horizon.</p>",
        fil: { html: "<p>Le mât mesure <strong>9,6 m</strong>, soit 3,2 m de plus que son ombre. Ahmadou se trompait : à 10 h, le soleil est déjà haut, plus haut que 45°, et les ombres sont plus courtes que les objets. Corde à acheter : 2 × 9,6 + 1 = <strong>20,2 m</strong>, donc 21 m pour être tranquille.</p>", verdicts: [[0, "rejetee", "AS = 9,6 m alors que l'ombre mesure 6,4 m."]] },
        retenir: "Deux rapports seulement, puis un produit en croix, puis un contrôle de vraisemblance." },

      { t: "La configuration papillon et la réciproque", html:
        "<h3>Le papillon</h3><p>Thalès fonctionne aussi quand les deux triangles sont <strong>opposés par le sommet</strong> : les points sont alignés dans l'ordre M, E, A et N, E, S, avec (MN) // (AS). L'égalité est la même : EM / EA = EN / ES = MN / AS.</p>" +
        "<h3>La réciproque : prouver un parallélisme</h3><div class='def'><b>Réciproque</b>Si E, P, A et E, B, S sont alignés <strong>dans le même ordre</strong> et si EP / EA = EB / ES, alors (PB) et (AS) sont <strong>parallèles</strong>.</div>" +
        "<div class='ex'><b>Exemple</b>Sur le portail du collège, deux barres de fer partent du même coin E. Pour vérifier qu'une traverse [PB] est parallèle au montant [AS], on mesure : EP = 3 dm, EA = 7,5 dm, EB = 4 dm, ES = 10 dm. 3 / 7,5 = 0,4 et 4 / 10 = 0,4 : les rapports sont égaux et l'ordre est le même, donc les droites sont parallèles.</div>" +
        "<div class='astuce'><b>Astuce</b>On calcule les deux rapports <strong>séparément</strong>, puis on compare. Si les rapports sont différents, on conclut grâce à la propriété directe (sa contraposée) que les droites <strong>ne sont pas</strong> parallèles.</div>",
        planches: [{ type: "Figure", titre: "Triangles emboîtés et papillon", legende: "Dans les deux cas : un sommet commun E, deux droites parallèles, des longueurs proportionnelles.", svg:
          "<svg viewBox='0 0 640 210' role='img' aria-label='Configuration emboîtée à gauche, configuration papillon à droite'><rect width='640' height='210' fill='#fff'/><path d='M40 180h220L40 30z' fill='#EEF3FC' stroke='#001136' stroke-width='2'/><path d='M150 180L150 105' stroke='#C0392B' stroke-width='3'/><g font-size='14' font-weight='600' fill='#001136'><text x='24' y='26'>S</text><text x='24' y='198'>A</text><text x='264' y='198'>E</text><text x='142' y='198'>P</text><text x='154' y='102'>B</text></g><text x='100' y='206' font-size='12' fill='#1E499B'>emboîtés</text><path d='M360 40v140L480 110z' fill='#EEF3FC' stroke='#001136' stroke-width='2'/><path d='M480 110L600 70v80z' fill='#FFE7A3' stroke='#001136' stroke-width='2'/><path d='M600 70v80' stroke='#C0392B' stroke-width='3'/><g font-size='14' font-weight='600' fill='#001136'><text x='344' y='40'>S</text><text x='344' y='190'>A</text><text x='474' y='100'>E</text><text x='606' y='160'>M</text><text x='606' y='70'>N</text></g><text x='450' y='206' font-size='12' fill='#1E499B'>papillon</text></svg>" }],
        fil: { html: "<p>Le lendemain, le ciel est couvert : plus d'ombre. Brenda vérifie autrement, par une visée. Allongée dans la cour à 24 m du pied du mât, l'œil au ras du sol, elle tient sa règle de 30 cm bien verticale à 75 cm de son œil : la règle cache exactement le mât. Son œil est le sommet commun de deux triangles emboîtés : 0,75 / 24 = 0,3 / AS, d'où AS = 9,6 m. Deux méthodes, un même résultat : la réponse est fiable.</p>", verdicts: [[2, "validee", "Une seconde configuration de Thalès, sans ombre, confirme 9,6 m."]] },
        retenir: "Propriété directe : calculer une longueur. Réciproque : prouver un parallélisme (rapports égaux et même ordre)." }
    ],
    denouement: {
      titre: "Le mât mesure 9,6 m : il faut 21 m de corde",
      etapes: [
        "Modéliser : E, P, A alignés ; E, B, S alignés ; manche et mât verticaux donc (PB) // (AS) (indice 1).",
        "Appliquer Thalès : EP / EA = PB / AS (indice 2).",
        "Calculer : 0,8 / 6,4 = 1,2 / AS, donc AS = 6,4 × 1,2 ÷ 0,8 = 9,6 m (indice 3).",
        "Contrôler par une visée : 0,75 / 24 = 0,3 / AS donne aussi 9,6 m (indice 4).",
        "Répondre à la question posée : corde = 2 × 9,6 + 1 = 20,2 m, on achète 21 m."
      ],
      reponse: "<p>Dans le triangle EAS, P ∈ [EA] et B ∈ [ES]. Le manche à balai et le mât sont verticaux, donc (PB) // (AS). D'après la propriété de Thalès : EP / EA = PB / AS, c'est-à-dire 0,8 / 6,4 = 1,2 / AS. D'où AS = 6,4 × 1,2 ÷ 0,8 = 9,6. Le mât mesure <strong>9,6 m</strong>. La corde fait l'aller et le retour : 2 × 9,6 = 19,2 m, plus 1 m pour les nœuds, soit 20,2 m. Monsieur le surveillant, achetez <strong>21 m de corde</strong>.</p>",
      transfert: "<p>Pendant le camp de vacances à Dschang, les scouts veulent tendre une corde au-dessus de la Menoua sans traverser. Sur leur rive, ils repèrent un arbre en face (point R), plantent des piquets et obtiennent un papillon : EM = 4 m, MN = 3 m, EA = 20 m, avec (MN) // (AR). Fais la figure, puis calcule la largeur AR de la rivière. Quelle longueur de corde prévoir s'il faut 2 m de plus de chaque côté pour l'attacher ?</p>"
    },
    revision: [
      "Configuration : un <strong>sommet commun</strong>, deux droites sécantes, deux droites <strong>parallèles</strong>.",
      "Égalité : <strong>EP/EA = EB/ES = PB/AS</strong> (petit triangle en haut, grand en bas).",
      "Deux formes : triangles <strong>emboîtés</strong> ou <strong>papillon</strong>.",
      "Calcul : garder deux rapports, faire un <strong>produit en croix</strong>, contrôler la vraisemblance.",
      "Réciproque : rapports égaux <strong>et</strong> points dans le même ordre ⇒ droites parallèles.",
      "Rapports différents ⇒ droites non parallèles.",
      "Application : mesurer la hauteur d'un mât, d'un arbre ou d'un bâtiment avec un bâton et deux ombres (rayons du soleil parallèles)."
    ],
    exo: "<p>Dans un triangle EFG, R ∈ [EF] et S ∈ [EG] avec (RS) // (FG). ER = 4 cm, EF = 10 cm, EG = 15 cm, FG = 12 cm. Calcule ES et RS. <em>(Réponses : ES = 6 cm ; RS = 4,8 cm.)</em></p>",
    quiz: [
      { q: "Quelle condition est obligatoire pour appliquer Thalès dans ABC avec M ∈ [AB] et N ∈ [AC] ?", r: ["(MN) parallèle à (BC)", "AM = AN", "ABC rectangle"], b: 0, e: "Sans parallélisme, les rapports ne sont pas égaux." },
      { q: "AM = 2, AB = 6, BC = 9. Combien vaut MN ?", r: ["3", "4,5", "27"], b: 0, e: "2/6 = MN/9, donc MN = 9 × 2 ÷ 6 = 3." },
      { q: "Quelle égalité est juste (M ∈ [AB], N ∈ [AC], (MN) // (BC)) ?", r: ["AM/AB = AN/AC", "AM/AN = AB/BC", "AB/AM = AC/MN"], b: 0, e: "Petit triangle sur grand triangle, côtés correspondants." },
      { q: "Un bâton de 1 m fait une ombre de 0,5 m ; un poteau fait une ombre de 4 m. Sa hauteur ?", r: ["8 m", "2 m", "4,5 m"], b: 0, e: "0,5/4 = 1/h, donc h = 8 m." },
      { q: "Dans l'enquête du mât, pourquoi (PB) // (AS) ?", r: ["Le manche et le mât sont tous deux verticaux", "Les ombres ont la même longueur", "Le soleil est à 45°"], b: 0, e: "Deux droites verticales sont parallèles." },
      { q: "Quelle égalité est fausse pour le mât ?", r: ["0,8 / 1,2 = AS / 6,4", "0,8 / 6,4 = 1,2 / AS", "1,2 / AS = 0,8 / 6,4"], b: 0, e: "Elle mélange les deux triangles dans un même rapport." },
      { q: "Dans la configuration papillon, les deux triangles…", r: ["sont opposés par le sommet commun", "ont un côté commun", "sont toujours rectangles"], b: 0, e: "Les points sont alignés de part et d'autre de E." },
      { q: "EP = 3, EA = 7,5, EB = 4, ES = 10, même ordre. Les droites (PB) et (AS) sont…", r: ["parallèles", "sécantes", "on ne peut pas savoir"], b: 0, e: "3/7,5 = 0,4 = 4/10 : la réciproque s'applique." },
      { q: "EP/EA = 0,4 et EB/ES = 0,5. On conclut que…", r: ["(PB) et (AS) ne sont pas parallèles", "(PB) et (AS) sont parallèles", "le triangle est isocèle"], b: 0, e: "Si elles étaient parallèles, les rapports seraient égaux." },
      { q: "Le mât mesure 9,6 m. Combien de corde faut-il (aller-retour + 1 m de nœuds) ?", r: ["20,2 m", "10,6 m", "19,2 m"], b: 0, e: "2 × 9,6 + 1 = 20,2 m." }
    ],
    examen: { t: "Thalès au BEPC : sujets corrigés", href: "/corriges/" }
  });

  /* ════════════════════ GÉOGRAPHIE 3e — LA MANGROVE ════════════════════ */
  VRT_L("3e-geo-mangrove", {
    c: "3e", m: "geo", cle: "La mangrove", titre: "Dossier : la mangrove", duree: 30,
    scenes: ["3e-geo-mangrove-douala"],
    accroche: "Raser une forêt de vase pour construire : bonne affaire pour le quartier, ou catastrophe pour les pêcheurs ?",
    intro: "Une étude de cas te guide de bout en bout : un projet immobilier menace la mangrove d'un quartier de pêcheurs de Douala. À toi de rendre un avis argumenté.",
    objectifs: ["localiser et décrire la mangrove camerounaise", "expliquer ses fonctions écologiques et économiques", "identifier les menaces et leurs acteurs", "argumenter et proposer des solutions d'aménagement durable"],
    enquete: {
      titre: "Le chef de quartier de Youpwe demande votre avis",
      contexte: "<p>Le samedi, tu accompagnes ton oncle Ebongue, pêcheur à <strong>Youpwe</strong>, quartier de pêcheurs au bord du Wouri, à Douala. Pendant qu'il répare ses filets, il se plaint : « Avant, je remplissais deux bassines de crevettes. Aujourd'hui, à peine une. » Sa voisine, Mama Ngo'o, qui fume le poisson pour le vendre au marché, ajoute que l'eau est entrée dans sa cuisine à la dernière grande marée.</p><p>Au même moment, un promoteur propose au chef de quartier de <strong>raser 10 hectares de mangrove</strong> pour construire des logements et un petit port de plaisance. Il promet du travail et des routes. Le chef, qui sait que tu es au club environnement de ton collège, te demande un avis écrit avant la réunion du conseil.</p>",
      documents: [
        { t: "Le relevé de la coopérative (données de l'exercice)", html: "<table class='donnees'><tr><th>Année</th><th>Mangrove proche (ha)</th><th>Crevettes débarquées (t/an)</th></tr><tr><td>2014</td><td>60</td><td>42</td></tr><tr><td>2019</td><td>48</td><td>33</td></tr><tr><td>2024</td><td>38</td><td>25</td></tr></table>", source: "Chiffres fictifs, construits pour l'exercice." },
        { t: "La parole de Mama Ngo'o, fumeuse de poisson", html: "<p>« Pour fumer le poisson, il nous faut du bois. Le bois de palétuvier brûle longtemps et donne un bon goût. Si on nous l'interdit, avec quoi allons-nous travailler ? »</p>" },
        { t: "Ce que dit le promoteur", html: "<p>« La mangrove, c'est de la vase et des moustiques. Nous allons remblayer, assainir et créer de la valeur. »</p>" }
      ],
      question: "Faut-il autoriser la destruction de 10 hectares de mangrove à Youpwe ?",
      tache: "Rédige pour le chef de quartier un avis argumenté de huit à dix lignes, appuyé sur les documents et sur la leçon, avec au moins deux propositions concrètes.",
      hypotheses: [
        "La baisse des crevettes s'explique uniquement par la surpêche, la mangrove n'y est pour rien.",
        "La mangrove n'est que de la vase inutile : la raser ne coûterait rien au quartier.",
        "On peut concilier les besoins des habitants (bois, logement) et la protection de la mangrove."
      ]
    },
    parties: [
      { t: "Une forêt entre terre et mer", html:
        "<p>La <strong>mangrove</strong> est une forêt littorale des régions tropicales. Elle pousse dans la <strong>zone de balancement des marées</strong>, là où l'eau douce des fleuves se mélange à l'eau de mer : une eau <strong>saumâtre</strong>.</p>" +
        "<ul><li>Ses arbres, les <strong>palétuviers</strong>, supportent le sel et l'immersion deux fois par jour.</li><li>Ils tiennent dans la vase grâce à des <strong>racines-échasses</strong> arquées ; certains respirent par des racines dressées hors de la vase.</li><li>Le sol est une <strong>vase</strong> molle, pauvre en dioxygène, riche en débris végétaux.</li></ul>" +
        "<p>Au Cameroun, la mangrove borde surtout l'<strong>estuaire du Wouri</strong> autour de Douala, l'embouchure de la Sanaga et la région du <strong>Rio del Rey</strong> au nord-ouest, près du Nigeria.</p>",
        planches: [
          { type: "Croquis", titre: "Douala et la mangrove de l'estuaire du Wouri", legende: "Croquis simplifié, sans échelle : la ville s'étend sur la terre ferme, la mangrove occupe les rives basses et les îles de l'estuaire.", svg:
            "<svg viewBox='0 0 640 300' role='img' aria-label='Croquis de l estuaire du Wouri : Douala, Bonabéri, mangrove, golfe de Guinée'><rect width='640' height='300' fill='#F6F1E6'/><path d='M0 300V230c80-10 140 20 220 10s130-50 200-40 120 30 220 10v90z' fill='#9CCBEA'/><path d='M300 0c10 40-10 80 10 120s50 60 40 100' stroke='#9CCBEA' stroke-width='26' fill='none'/><path d='M300 0c10 40-10 80 10 120s50 60 40 100' stroke='#7DB8E0' stroke-width='2' fill='none'/><g fill='#3E9E4E' fill-opacity='.75'><path d='M250 140c20-10 40 0 50 20s10 50-10 60-50 0-60-20 0-50 20-60z'/><path d='M360 160c30-6 60 10 70 30s-10 40-40 40-50-20-50-40 0-26 20-30z'/><path d='M200 220c30-6 70 0 90 10l-10 14c-30-6-60-8-90-6z'/><path d='M420 214c30 0 60 6 80 16l-10 10c-24-6-50-10-74-10z'/><ellipse cx='330' cy='250' rx='40' ry='12'/></g><g fill='#D8C6A6' stroke='#B39B70'><path d='M370 40c40-10 90 0 110 30s10 70-20 80-70-10-90-30-30-70 0-80z'/><path d='M180 60c30-10 60 0 70 20s0 50-30 50-50-10-50-30 0-34 10-40z'/></g><g font-size='13' font-weight='600' fill='#001136'><text x='392' y='96'>DOUALA</text><text x='180' y='96'>Bonabéri</text><text x='318' y='30' fill='#1E499B'>Wouri</text><text x='260' y='286' fill='#1E499B'>golfe de Guinée (océan Atlantique)</text><text x='310' y='254' font-size='11'>Manoka</text></g><circle cx='372' cy='150' r='5' fill='#C0392B'/><text x='382' y='154' font-size='12' font-weight='600' fill='#C0392B'>Youpwe</text><g font-size='11.5'><rect x='470' y='14' width='14' height='10' fill='#3E9E4E' fill-opacity='.75'/><text x='490' y='23' fill='#001136'>mangrove</text><rect x='470' y='32' width='14' height='10' fill='#D8C6A6'/><text x='490' y='41' fill='#001136'>espace urbanisé</text><circle cx='477' cy='55' r='4' fill='#C0392B'/><text x='490' y='59' fill='#001136'>étude de cas</text></g><path d='M600 120v-30M600 90l-6 12h12z' fill='#001136' stroke='#001136' stroke-width='2'/><text x='595' y='138' font-size='12' font-weight='600'>N</text></svg>" },
          { type: "3d", titre: "Bloc-diagramme : de la ville au chenal", legende: "Tourne le bloc : la ville sur la terre ferme, la vase couverte à marée haute, les palétuviers sur leurs racines-échasses, les jeunes poissons abrités entre les racines.",
            modele: { h: 360, rx: -26, ry: 24, echelle: 1.15, dy: 20, alt: "Bloc-diagramme en trois dimensions d une mangrove au bord d une ville", objets: estuaire3D(),
              etiquettes: [
                { p: [-190, 30, -70], t: "Ville sur la terre ferme" },
                { p: [-20, -26, 110], t: "Vase (sol de la mangrove)" },
                { p: [52, 40, -5], t: "Palétuviers", cote: "d" },
                { p: [94, -12, 75], t: "Racines-échasses", cote: "d" },
                { p: [140, -17, 20], t: "Jeunes poissons abrités", cote: "d" },
                { p: [240, -12, 60], t: "Eau saumâtre de marée", cote: "d" }
              ] } }
        ],
        fil: { html: "<p>Youpwe est au cœur de la mangrove de l'estuaire du Wouri. Ce que le promoteur appelle « de la vase » est un milieu vivant original, adapté au sel et aux marées : on ne peut pas le juger sans savoir à quoi il sert.</p>", verdicts: [[1, "precisee", "La « vase » est le sol d'une forêt adaptée aux marées ; reste à savoir à quoi elle sert."]] },
        retenir: "Mangrove = forêt de palétuviers à racines-échasses, dans la vase, en eau saumâtre de marée." },

      { t: "Pourquoi la mangrove est précieuse", html:
        "<h3>Une nurserie pour la pêche</h3><p>Entre les racines, l'eau calme et riche en nourriture abrite les <strong>alevins</strong> (jeunes poissons), les crevettes et les crabes. Beaucoup d'espèces pêchées au large passent leur jeunesse dans la mangrove : c'est une <strong>frayère</strong> et une <strong>nurserie</strong>.</p>" +
        "<h3>Un rempart pour la côte</h3><p>Les racines freinent les vagues et retiennent la vase : la mangrove <strong>protège le littoral</strong> contre l'érosion et amortit les grandes marées et les tempêtes. Là où elle disparaît, l'eau avance et inonde les habitations basses.</p>" +
        "<h3>Des ressources pour les riverains</h3><p>Pêche, bois de chauffe et de construction, plantes médicinales, miel : des milliers de familles de l'estuaire en vivent.</p>" +
        "<h3>Un puits de carbone</h3><p>Ses arbres et surtout sa vase stockent beaucoup de <strong>carbone</strong> : détruire une mangrove relâche ce carbone dans l'atmosphère et aggrave le réchauffement climatique.</p>" +
        "<div class='def'><b>Notion</b>On appelle <strong>services écosystémiques</strong> les bienfaits gratuits qu'un milieu naturel rend aux sociétés : production (poisson, bois), protection (contre l'érosion), régulation (du climat).</div>",
        planches: [{ type: "Graphique", titre: "Mangrove et crevettes à Youpwe (document 1)", legende: "Les deux courbes baissent ensemble : un indice fort de lien, à confirmer par ce qu'on sait du rôle de nurserie.", svg:
          "<svg viewBox='0 0 640 250' role='img' aria-label='Graphique : la surface de mangrove et les crevettes débarquées baissent ensemble de 2014 à 2024'><rect width='640' height='250' fill='#fff'/><path d='M70 30v180h500' stroke='#001136' stroke-width='1.5' fill='none'/><g stroke='#E3E8F1'><path d='M70 165h500M70 120h500M70 75h500'/></g><g font-size='11.5' fill='#636A80'><text x='40' y='214'>0</text><text x='34' y='124'>30</text><text x='34' y='34'>60</text><text x='118' y='230'>2014</text><text x='300' y='230'>2019</text><text x='482' y='230'>2024</text></g><path d='M135 30L318 66L500 96' stroke='#2F8A3B' stroke-width='3.5' fill='none'/><path d='M135 84L318 111L500 135' stroke='#C0392B' stroke-width='3.5' fill='none'/><g fill='#2F8A3B'><circle cx='135' cy='30' r='5'/><circle cx='318' cy='66' r='5'/><circle cx='500' cy='96' r='5'/></g><g fill='#C0392B'><circle cx='135' cy='84' r='5'/><circle cx='318' cy='111' r='5'/><circle cx='500' cy='135' r='5'/></g><g font-size='12.5' font-weight='600'><text x='512' y='92' fill='#2F8A3B'>mangrove (ha)</text><text x='512' y='140' fill='#C0392B'>crevettes (t/an)</text></g></svg>" }],
        fil: { html: "<p>En dix ans, la mangrove proche a perdu 22 ha (−37 %) et les débarquements de crevettes 17 t (−40 %). Les deux baisses vont ensemble, et on sait pourquoi : les crevettes grandissent dans la mangrove. La surpêche peut aggraver la situation, mais elle n'explique pas tout. Quant aux inondations, elles s'expliquent par la disparition du rempart de racines.</p>", verdicts: [[0, "rejetee", "Les crevettes baissent au même rythme que la mangrove, leur nurserie."], [1, "rejetee", "La mangrove nourrit la pêche, protège les maisons des marées et stocke du carbone."]] },
        retenir: "Nurserie de la pêche, rempart contre la mer, ressources pour les familles, puits de carbone." },

      { t: "Les menaces et leurs acteurs", html:
        "<p>Une étude de géographie identifie toujours <strong>qui</strong> agit, <strong>pourquoi</strong>, et avec <strong>quelles conséquences</strong>.</p>" +
        "<table class='donnees'><tr><th>Menace</th><th>Acteurs</th><th>Pourquoi</th></tr><tr><td>Coupe du bois de palétuvier</td><td>Fumeuses et fumeurs de poisson, vendeurs de bois</td><td>Besoin d'un combustible abondant et bon marché</td></tr><tr><td>Remblai et construction</td><td>Promoteurs, ménages, pouvoirs publics</td><td>Croissance très rapide de Douala, manque de terrains</td></tr><tr><td>Déchets et pollution</td><td>Ménages, industries, port</td><td>Collecte insuffisante, rejets dans le Wouri</td></tr></table>" +
        "<div class='attention'><b>Attention</b>Les acteurs ne sont pas des « méchants » : la fumeuse de poisson (document 2) a un vrai besoin économique. Une bonne solution doit répondre à ce besoin, sinon elle ne sera pas appliquée.</div>",
        fil: { html: "<p>À Youpwe, deux menaces se cumulent : la coupe de bois pour le fumage et le projet de remblai. Interdire sans proposer d'alternative pénaliserait Mama Ngo'o et les autres fumeuses ; laisser faire détruirait la ressource dont vit ton oncle.</p>", verdicts: [[2, "precisee", "Il faut répondre aux besoins réels : combustible pour le fumage, logements pour une ville qui grandit."]] },
        retenir: "Menaces : bois de fumage, urbanisation par remblai, pollution. Chaque menace a des acteurs et des raisons." },

      { t: "Protéger en développant : les solutions", html:
        "<ul><li><strong>Fumoirs améliorés</strong> : fermés, ils consomment beaucoup moins de bois pour la même quantité de poisson et protègent la santé des fumeuses (moins de fumée inhalée).</li><li><strong>Reboisement</strong> de palétuviers par les communautés, sur les zones dégradées.</li><li><strong>Plan d'urbanisme</strong> : construire sur la terre ferme, interdire le remblai des zones inondables (qui seraient d'ailleurs dangereuses pour les futurs habitants).</li><li><strong>Aires protégées</strong> et cogestion avec les pêcheurs : zones de repos où l'on ne pêche pas pendant la reproduction.</li><li><strong>Collecte des déchets</strong> et sensibilisation.</li></ul>" +
        "<div class='def'><b>Notion</b>Le <strong>développement durable</strong> répond aux besoins d'aujourd'hui sans compromettre ceux des générations futures. Il concilie l'économie, la société et l'environnement.</div>",
        fil: { html: "<p>Il existe une voie qui concilie tout le monde : des logements sur la terre ferme plutôt que dans la mangrove, des fumoirs améliorés pour réduire la coupe de bois, un reboisement par la coopérative. Le quartier garde sa pêche, sa protection contre la mer, et se développe.</p>", verdicts: [[2, "validee", "Fumoirs améliorés, reboisement et constructions sur la terre ferme concilient les besoins."]] },
        retenir: "Développement durable : fumoirs améliorés, reboisement, urbanisme hors zones inondables, aires protégées." }
    ],
    denouement: {
      titre: "Notre avis : non au remblai, oui à un projet durable",
      etapes: [
        "La mangrove de Youpwe est un milieu vivant de l'estuaire du Wouri, pas une vase inutile (indice 1).",
        "Elle sert de nurserie : sa disparition explique en grande partie la baisse des crevettes ; elle protège aussi les maisons des marées (indice 2).",
        "Les menaces ont des acteurs aux besoins réels : combustible, logement (indice 3).",
        "Des solutions durables existent et répondent à ces besoins (indice 4)."
      ],
      reponse: "<p>Monsieur le Chef, nous vous conseillons de refuser la destruction des 10 hectares de mangrove. Entre 2014 et 2024, la mangrove proche a reculé de 37 % et les crevettes débarquées de 40 % : cette forêt est la nurserie des crevettes et des jeunes poissons dont vivent les pêcheurs. Elle protège aussi les maisons des grandes marées ; la remblayer exposerait le quartier aux inondations. Nous comprenons le besoin de logements et le travail des fumeuses de poisson. Nous proposons donc de construire sur la terre ferme, d'équiper les fumeuses de fumoirs améliorés qui consomment moins de bois, et de reboiser les zones abîmées avec la coopérative. Ainsi, Youpwe se développera sans perdre sa richesse.</p>",
      transfert: "<p>À Kribi, l'extension du port en eau profonde attire de nouveaux habitants près de l'embouchure de la Lobé. Une association veut protéger les zones humides du littoral. En réutilisant la démarche de la leçon (acteurs, fonctions, menaces, solutions), rédige trois arguments qu'elle pourrait présenter à la mairie.</p>"
    },
    revision: [
      "<strong>Mangrove</strong> : forêt littorale tropicale de <strong>palétuviers</strong>, dans la vase, en eau <strong>saumâtre</strong> de marée.",
      "Au Cameroun : estuaire du <strong>Wouri</strong> (Douala), embouchure de la Sanaga, <strong>Rio del Rey</strong>.",
      "Racines-échasses : tenir dans la vase, freiner les vagues, abriter les alevins.",
      "Fonctions : <strong>nurserie</strong> de la pêche, <strong>protection</strong> du littoral, ressources, <strong>puits de carbone</strong>.",
      "Menaces : bois de <strong>fumage</strong>, <strong>urbanisation</strong> par remblai, pollution.",
      "Solutions : <strong>fumoirs améliorés</strong>, reboisement, urbanisme hors zones inondables, aires protégées.",
      "Démarche géographique : acteurs, raisons, conséquences, solutions durables."
    ],
    exo: "<p>Rédige une affiche de sensibilisation (un titre, un slogan, trois phrases) destinée aux pêcheurs de l'estuaire du Wouri, pour les convaincre de participer au reboisement de la mangrove.</p>",
    quiz: [
      { q: "Comment s'appellent les arbres de la mangrove ?", r: ["Les palétuviers", "Les baobabs", "Les fromagers"], b: 0, e: "Ils supportent le sel et l'immersion." },
      { q: "L'eau de la mangrove est…", r: ["saumâtre : mélange d'eau douce et d'eau de mer", "uniquement de l'eau de pluie", "de l'eau de mer pure"], b: 0, e: "Fleuve et marée se mélangent dans l'estuaire." },
      { q: "Le principal estuaire à mangrove du Cameroun se trouve…", r: ["autour de Douala, sur le Wouri", "à Garoua, sur la Bénoué", "à Bertoua"], b: 0, e: "L'estuaire du Wouri est bordé de mangroves." },
      { q: "Pourquoi dit-on que la mangrove est une nurserie ?", r: ["Les jeunes poissons et crevettes y grandissent à l'abri", "On y plante des arbres en pépinière", "Les oiseaux y pondent seulement"], b: 0, e: "Les racines abritent les alevins." },
      { q: "Que se passe-t-il pour les maisons quand la mangrove disparaît ?", r: ["Elles sont plus exposées aux marées et à l'érosion", "Elles sont mieux protégées", "Rien ne change"], b: 0, e: "Les racines freinaient les vagues." },
      { q: "D'après le document 1, de combien les crevettes ont-elles baissé entre 2014 et 2024 ?", r: ["D'environ 40 %", "D'environ 10 %", "Elles ont augmenté"], b: 0, e: "De 42 à 25 t : −17 t, soit environ 40 %." },
      { q: "Pourquoi coupe-t-on le bois de palétuvier ?", r: ["Pour fumer le poisson", "Pour fabriquer du papier", "Pour exporter des meubles"], b: 0, e: "C'est un combustible apprécié des fumeuses." },
      { q: "Quelle solution répond au besoin des fumeuses tout en protégeant la mangrove ?", r: ["Les fumoirs améliorés", "L'interdiction totale de fumer le poisson", "Le remblai de la mangrove"], b: 0, e: "Ils consomment beaucoup moins de bois." },
      { q: "Détruire une mangrove aggrave le réchauffement climatique car…", r: ["le carbone stocké dans les arbres et la vase est relâché", "les palétuviers produisent du CO₂ en poussant", "la vase refroidit l'air"], b: 0, e: "La mangrove est un puits de carbone." },
      { q: "Le développement durable cherche à concilier…", r: ["l'économie, la société et l'environnement", "seulement l'économie", "seulement la nature"], b: 0, e: "Ce sont ses trois piliers." }
    ]
  });
})();
