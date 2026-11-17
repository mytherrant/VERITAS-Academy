/* Leçons APPROFONDIES — lot 7, classes d'examen (17/11/2026) : partage de l'Afrique et fondements de la démocratie (3e),
   les passions et la liberté (Tle, philosophie). Même gabarit et même mécanisme que 11-approfondies-lot4.js
   (remplacement EN PLACE ; ordre, clé, fiche APC, examen et scènes conservés). Couleurs proches des objets réels.
   Simulations VRT_A en fin de fichier. */
(function () {
  "use strict";
  var NUIT = "#001136", BLEU = "#1E499B", GRIS = "#4D5163", VERT = "#17784D", ROUGE = "#C62828";

  function txt(x, y, t, o) {
    o = o || {};
    return "<text x='" + x + "' y='" + y + "' text-anchor='" + (o.a || "middle") + "' font-size='" + (o.s || 12) + "' font-weight='" + (o.w || 700) + "' fill='" + (o.c || NUIT) + "'" + (o.i ? " font-style='italic'" : "") + (o.halo ? " stroke='#fff' stroke-width='3' paint-order='stroke'" : "") + ">" + t + "</text>";
  }
  function lin(id, cs, vertical) {
    var s = "<linearGradient id='" + id + "'" + (vertical ? " x1='0' y1='0' x2='0' y2='1'" : "") + ">";
    cs.forEach(function (c, i) { s += "<stop offset='" + (i / (cs.length - 1)).toFixed(2) + "' stop-color='" + c + "'/>"; });
    return s + "</linearGradient>";
  }
  function fleche(id, c) { return "<marker id='" + id + "' markerWidth='10' markerHeight='10' refX='7' refY='5' orient='auto'><path d='M0 1L8 5L0 9Z' fill='" + c + "'/></marker>"; }
  function svg(w, h, alt, defs, corps) {
    return "<svg viewBox='0 0 " + w + " " + h + "' role='img' aria-label='" + alt + "' font-family='Inter,Arial,sans-serif'><rect width='" + w + "' height='" + h + "' fill='#fff'/><defs>" + defs + "</defs>" + corps +
      "<text x='" + (w - 6) + "' y='" + (h - 5) + "' font-size='8' text-anchor='end' fill='#8A93A6'>Planche VÉRITAS</text></svg>";
  }
  function alea(g) { return function () { g = (g * 16807) % 2147483647; return (g - 1) / 2147483646; }; }
  function ancien(id) { return window.VRT_LECONS[id]; }
  function remplacer(id, o) {
    var a = ancien(id);
    if (a) ["apc", "examen", "rang", "cle", "scenes"].forEach(function (k) { if (a[k] != null && o[k] == null) o[k] = a[k]; });
    VRT_L(id, o);
    if (a) o.ordre = a.ordre;
  }
  function q(qq, bonne, f1, f2, e) { return { q: qq, r: [bonne, f1, f2], b: 0, e: e }; }
  function partie(old, i) { return old && old.parties[i] ? old.parties[i].html : ""; }
  function bulle(x, y, w, t, c) { return "<rect x='" + x + "' y='" + y + "' width='" + w + "' height='30' rx='12' fill='#fff' stroke='" + (c || "#C9D2E3") + "'/>" + txt(x + w / 2, y + 20, t, { s: 11.5 }); }
  /* silhouette debout : y = centre de la tête ; environ 92 px de haut */
  function perso(x, y, peau, habit, bas) {
    bas = bas || "#2E3445";
    return "<g transform='translate(" + x + " " + y + ")'><ellipse cx='0' cy='84' rx='18' ry='4' fill='#001136' opacity='.18'/>" +
      "<rect x='-9' y='44' width='8' height='36' rx='3' fill='" + bas + "'/><rect x='1' y='44' width='8' height='36' rx='3' fill='" + bas + "'/>" +
      "<ellipse cx='-6' cy='81' rx='7' ry='3.5' fill='#1F2328'/><ellipse cx='6' cy='81' rx='7' ry='3.5' fill='#1F2328'/>" +
      "<path d='M-13 46L-16 18C-16 13 -12 11 -6 10H6C12 11 16 13 16 18L13 46Z' fill='" + habit + "'/>" +
      "<path d='M-15 16L-20 40' stroke='" + habit + "' stroke-width='7' stroke-linecap='round'/><path d='M15 16L20 40' stroke='" + habit + "' stroke-width='7' stroke-linecap='round'/>" +
      "<circle cx='-20' cy='42' r='3.6' fill='" + peau + "'/><circle cx='20' cy='42' r='3.6' fill='" + peau + "'/>" +
      "<rect x='-3.5' y='5' width='7' height='7' fill='" + peau + "'/><ellipse cx='0' cy='-2' rx='9' ry='10.5' fill='" + peau + "'/>" +
      "<path d='M-9 -4C-10 -14 -4 -13.5 0 -13.5S10 -14 9 -4C7 -9 -7 -9 -9 -4Z' fill='#1B1410'/><ellipse cx='-9' cy='-1' rx='1.8' ry='3' fill='" + peau + "'/><ellipse cx='9' cy='-1' rx='1.8' ry='3' fill='" + peau + "'/></g>";
  }

  /* ═══════════════════════ 3e HISTOIRE — LE PARTAGE DE L'AFRIQUE ═══════════════════════ */
  var HP_OLD = ancien("3e-hist-partage");
  function frontiere3D() {
    var o = [], R = alea(1885), k;
    o.push({ f: "boite", c: [0, -8, 0], d: [600, 8, 340], coul: "#8C7A55", dessus: "#C9B07A" });
    for (k = 0; k < 14; k++) o.push({ f: "boite", c: [-280 + k * 44, -2, 30 + Math.sin(k * 0.7) * 30], d: [46, 3, 34], coul: "#2F6DB5", dessus: "#5BA3D9", div: false });
    for (k = -150; k <= 150; k += 30) o.push({ f: "boite", c: [0, 0, k], d: [6, 30, 6], coul: "#E9E4D8", dessus: "#C62828", div: false });
    o.push({ f: "boite", c: [0, 1, 0], d: [2, 1, 320], coul: "#C62828", div: false });
    [[-160, -90], [-110, -120], [-200, -60], [-120, -60], [120, -100], [170, -70], [140, -130], [200, -110], [-150, 120], [-90, 140], [130, 120], [190, 140]].forEach(function (p) {
      o.push({ f: "cylindre", c: [p[0], 0, p[1]], r: 16, h: 18, n: 16, coul: "#B98A55", dessus: "#C99A65" });
      o.push({ f: "cone", c: [p[0], 18, p[1]], r: 22, h: 22, n: 16, coul: "#C9A86B" });
    });
    for (k = 0; k < 22; k++) { var x = (R() - 0.5) * 560, z = (R() - 0.5) * 300; if (Math.abs(x) < 30) continue; o.push({ f: "cylindre", c: [x, 0, z], r: 2.5, h: 22, n: 6, coul: "#6B4423" }); o.push({ f: "sphere", c: [x, 28, z], r: 12, coul: "#3E7C3A" }); }
    return o;
  }
  var AFR = [[-17, 21], [-16, 28], [-10, 30], [-6, 36], [10, 37], [11, 33], [20, 31], [25, 32], [32, 31], [34, 28], [37, 22], [39, 15], [43, 12], [51, 12], [51, 10], [48, 5], [42, -1], [40, -5], [40, -10], [40, -16], [35, -22], [33, -26], [28, -33], [20, -35], [18, -33], [15, -27], [12, -18], [13, -12], [12, -5], [9, -1], [9, 4], [5, 6], [-3, 5], [-8, 4], [-13, 8], [-17, 14]];
  var ETH = [[36, 14], [40, 14], [42, 12], [44, 9], [47, 8], [44, 4.5], [39, 3.5], [35, 5], [34, 8]], LBR = [[-11.5, 7], [-10, 8.5], [-8, 8], [-7.5, 5], [-9, 4.8]];
  var PLANCHE_AFRIQUE = (function () {
    function carteAf(ox, an) {
      var X = function (l) { return ox + (l + 18) * 3.9; }, Y = function (l) { return 36 + (38 - l) * 3.9; }, P = function (T) { return "M" + T.map(function (p) { return X(p[0]).toFixed(1) + " " + Y(p[1]).toFixed(1); }).join("L") + "Z"; }, id = "af" + an, s = "";
      s += "<clipPath id='" + id + "'><path d='" + P(AFR) + "'/></clipPath><path d='" + P(AFR) + "' fill='#000' opacity='.12' transform='translate(3 4)'/><path d='" + P(AFR) + "' fill='#CDBB78'/>";
      if (an === 1880) s += "<g clip-path='url(#" + id + ")'><path d='" + P(AFR) + "' fill='none' stroke='#7A1F1F' stroke-width='9'/><rect x='" + X(-2) + "' y='" + Y(37) + "' width='" + (X(9) - X(-2)) + "' height='" + (Y(32) - Y(37)) + "' fill='#7A1F1F'/><rect x='" + X(17) + "' y='" + Y(-28) + "' width='" + (X(33) - X(17)) + "' height='" + (Y(-35) - Y(-28)) + "' fill='#7A1F1F'/></g>";
      else s += "<path d='" + P(AFR) + "' fill='#7A1F1F'/><path d='" + P(ETH) + "' fill='#CDBB78' stroke='#5B3A1A'/><path d='" + P(LBR) + "' fill='#CDBB78' stroke='#5B3A1A'/>" + txt(X(41), Y(9) + 4, "Éthiopie", { s: 9.5, halo: true }) + txt(X(-9), Y(3), "Libéria", { s: 9.5, halo: true });
      s += "<path d='" + P(AFR) + "' fill='none' stroke='#5B3A1A' stroke-width='1.6' stroke-linejoin='round'/>" + txt(X(17), 32, an + " : ≈ " + (an === 1880 ? 10 : 90) + " %", { s: 16 });
      return s;
    }
    var s = "<rect width='640' height='360' fill='#DCEBF5'/>" + carteAf(10, 1880) + carteAf(330, 1914);
    s += "<rect x='200' y='326' width='14' height='14' fill='#7A1F1F'/>" + txt(220, 338, "sous contrôle européen", { s: 11.5, a: "start" }) + "<rect x='380' y='326' width='14' height='14' fill='#CDBB78'/>" + txt(400, 338, "États africains", { s: 11.5, a: "start" });
    return svg(640, 360, "Deux cartes de l Afrique : en 1880 seules les côtes, l Algérie et le Cap sont européennes ; en 1914 tout le continent l est sauf l Éthiopie et le Libéria", "", s);
  })();
  remplacer("3e-hist-partage", {
    c: "3e", m: "histoire", titre: "La conquête et le partage de l'Afrique", duree: 35,
    accroche: "« Pourquoi ma famille vit-elle dans trois pays ? » Moussa, de Kousséri, cherche la réponse à Berlin.",
    intro: "La question d'un élève de Kousséri te sert de fil rouge : à chaque partie, un document t'aide à trancher entre trois explications.",
    objectifs: ["expliquer les causes et les moyens de la conquête", "présenter les règles fixées par la conférence de Berlin", "décrire le partage et les résistances africaines", "expliquer l'origine des frontières actuelles"],
    enquete: {
      titre: "La famille de Moussa, de part et d'autre des frontières",
      svg: (function () {
        var s = "<rect width='640' height='210' fill='#F6EFDF'/><path d='M0 160C160 150 320 170 640 150V210H0Z' fill='#E3D3A8'/><path d='M0 120C200 110 420 140 640 112V132C420 160 200 130 0 140Z' fill='#5BA3D9'/>";
        s += "<path d='M320 30V200' stroke='#C62828' stroke-width='3' stroke-dasharray='10 6'/><path d='M150 30L200 200' stroke='#C62828' stroke-width='3' stroke-dasharray='10 6'/>";
        s += txt(80, 24, "NIGERIA", { s: 13, c: "#7A6A55" }) + txt(250, 24, "CAMEROUN", { s: 13, c: "#7A6A55" }) + txt(470, 24, "TCHAD", { s: 13, c: "#7A6A55" });
        s += perso(90, 64, "#6B4423", "#2E7D32", "#2E7D32") + perso(250, 64, "#5A3A1E", "#F2F2F2") + perso(470, 64, "#6B4423", "#C2540A", "#C2540A") + txt(250, 44, "Moussa", { s: 12 });
        s += "<path d='M110 150q70 -24 120 0M270 150q100 -30 180 0' fill='none' stroke='#8A6E4B' stroke-width='2' stroke-dasharray='4 4'/>" + txt(320, 202, "le Logone et le Chari : une même famille, trois pays", { s: 11.5, c: "#6D4A00", w: 600 });
        return svg(640, 210, "Trois membres d une même famille séparés par deux frontières en pointillés rouges, au Nigeria, au Cameroun et au Tchad", "", s);
      })(),
      legende: "À Kousséri, au bord du Logone : Moussa revient d'un mariage à N'Djamena et rend visite à un cousin à Maiduguri.",
      contexte: "<p>Moussa, élève de 3e à Kousséri, a des cousins à <strong>N'Djamena</strong> (Tchad), juste en face, de l'autre côté du Logone, et des oncles à <strong>Maiduguri</strong> (Nigeria). Tous parlent la même langue et ont les mêmes ancêtres. « Qui a décidé de ces frontières ? » demande-t-il en classe.</p><p>Son voisin affirme : « Ce sont nos chefs qui les ont choisies. » Une autre : « Les Européens ont découpé l'Afrique sur une carte, à Berlin. » Le professeur sort deux documents.</p>",
      documents: [
        { t: "L'Acte général de la conférence de Berlin (26 février 1885), article 35", html: "<p>« Les puissances signataires reconnaissent l'obligation d'assurer, dans les territoires occupés par elles sur les côtes du continent africain, l'existence d'une autorité suffisante pour faire respecter les droits acquis. »</p>" },
        { t: "L'Afrique sous contrôle européen", html: "<table class='donnees'><tr><th>Année</th><td>1880</td><td>1914</td></tr><tr><th>Part du continent contrôlée par des Européens</th><td>environ 10 %</td><td>environ 90 %</td></tr></table>" }
      ],
      question: "Qui a tracé les frontières qui séparent la famille de Moussa, et comment ?",
      tache: "Rédige pour Moussa une réponse argumentée de dix lignes, en t'appuyant sur les deux documents.",
      hypotheses: ["Les chefs africains ont choisi ces frontières.", "La conférence de Berlin a découpé l'Afrique sur une carte.", "Berlin a fixé les règles du partage ; les frontières ont ensuite été tracées par des traités entre Européens, sans les peuples concernés."]
    },
    parties: [
      { t: "Pourquoi conquérir l'Afrique ?", html: partie(HP_OLD, 0),
        planches: [{ type: "2D", titre: "L'Afrique en 1880 et en 1914", legende: "Cartes simplifiées. En 1880, les Européens ne tiennent que des comptoirs côtiers, l'Algérie et la colonie du Cap (environ 10 % du continent). En 1914, presque tout est colonisé (environ 90 %) : seuls l'Éthiopie et le Libéria restent indépendants.", svg: PLANCHE_AFRIQUE }],
        fil: { html: "<p>En 1880, les Européens n'occupent que des comptoirs côtiers : il n'existe alors aucune des frontières actuelles entre le Nigeria, le Cameroun et le Tchad. Elles naissent entre 1884 et 1914, au moment où la conquête s'accélère.</p>" },
        retenir: "Économie, puissance, idéologie : trois familles de causes." },
      { t: "La conférence de Berlin (1884-1885)", html: partie(HP_OLD, 1) +
        "<div class='attention'><b>Idée fausse</b>On lit souvent que les Européens ont « découpé l'Afrique sur une carte » à Berlin. En réalité, la conférence fixe des <strong>règles</strong> ; les frontières sont tracées ensuite, par des traités bilatéraux entre puissances (par exemple les accords anglo-allemands et franco-allemands pour le Kamerun).</div>",
        planches: [{ type: "2D", titre: "Autour de la table de Berlin", legende: "Quatorze délégations (puissances européennes, Empire ottoman, États-Unis) autour de la table, aucune chaise pour un Africain ; sur la table, une carte de l'Afrique encore en grande partie inconnue des Européens.", svg: (function () {
          var s = "<rect width='640' height='300' fill='#F2EADB'/><ellipse cx='320' cy='150' rx='230' ry='92' fill='#6B4423'/><ellipse cx='320' cy='146' rx='224' ry='86' fill='#8B5A2B'/><rect x='250' y='110' width='140' height='76' rx='4' fill='#F4E7C5' stroke='#C9A86B'/>";
          s += "<path d='M300 118c-14 6-20 22-12 34 8 14 4 22 14 30s20-6 24-18c6-14 18-12 14-26s-26-24-40-20Z' fill='#C9B07A' stroke='#8A6E4B'/>" + txt(320, 198, "carte de l'Afrique", { s: 10.5, c: "#F4E7C5", w: 600 });
          var C = ["#000", "#D52B1E", "#0055A4", "#C8102E", "#008C45", "#AA151B", "#006600", "#FFCD00", "#C8102E", "#002B7F", "#003DA5", "#E30A17", "#B22234", "#0064AA"];
          for (var k = 0; k < 14; k++) { var a = Math.PI * 2 * k / 14, x = 320 + 262 * Math.cos(a), y = 150 + 112 * Math.sin(a); var ang = (a * 180 / Math.PI + 90).toFixed(0); s += "<g transform='translate(" + x.toFixed(0) + " " + y.toFixed(0) + ") rotate(" + ang + ")'><rect x='-17' y='-4' width='34' height='18' rx='6' fill='#5C3A1E'/><ellipse cx='0' cy='2' rx='17' ry='9' fill='#1F2328'/><path d='M-4 -6L0 2L4 -6Z' fill='#F4F1EA'/><circle cx='0' cy='-4' r='7.5' fill='#E8C3A0'/><path d='M-7 -3A7.5 7.5 0 0 1 7 -3Z' fill='#5A4632'/></g><rect x='" + (x - 6).toFixed(0) + "' y='" + (y - 30).toFixed(0) + "' width='12' height='8' fill='" + C[k] + "' stroke='#fff' stroke-width='.8'/>"; }
          s += txt(320, 288, "15 novembre 1884 – 26 février 1885 : aucun représentant africain", { s: 12, c: ROUGE });
          return svg(640, 300, "Une table ovale entourée de quatorze délégations avec leurs drapeaux, une carte de l Afrique au centre, aucun Africain", "", s);
        })() }],
        fil: { html: "<p>Le document 1 le montre : Berlin impose l'<strong>occupation effective</strong> (une « autorité suffisante » sur place) et la notification. Ce ne sont pas des lignes tracées sur une carte, mais une règle du jeu qui lance la course à la conquête. Et aucun Africain n'est consulté.</p>", verdicts: [[1, "rejetee", "Berlin fixe des règles (occupation effective, notification), il ne trace pas les frontières."], [0, "rejetee", "Aucun Africain n'est invité à Berlin ; les frontières sont négociées entre Européens."]] },
        retenir: "Berlin ne partage pas l'Afrique sur une carte : il fixe les RÈGLES du partage." },
      { t: "Le partage du continent", html: partie(HP_OLD, 2) +
        "<div class='ex'><b>Les frontières de Moussa</b>La frontière entre le Kamerun allemand et le Nigeria britannique est fixée par des accords anglo-allemands (1885-1913) ; celle avec le Tchad français par des accords franco-allemands, qui suivent en partie le Logone et le Chari. Kotoko, Arabes Choa, Kanouri se retrouvent partagés entre plusieurs colonies.</div>",
        planches: [{ type: "3d", titre: "Une frontière tracée à la règle", legende: "Tourne le paysage : une ligne de bornes rouges coupe en deux un même pays, avec ses cases et ses champs, et traverse la rivière. Les villages de part et d'autre appartiennent au même peuple.",
          modele: { h: 340, rx: -30, ry: 24, echelle: 0.85, alt: "Paysage de savane avec des cases rondes de part et d autre d une ligne de bornes rouges rectiligne", objets: frontiere3D(),
            etiquettes: [{ p: [0, 32, -150], t: "Bornes de la frontière" }, { p: [-150, 42, -90], t: "Village de la colonie A" }, { p: [170, 42, -70], t: "Village de la colonie B", cote: "d" }, { p: [120, 4, 40], t: "Rivière", cote: "d" }] } }],
        fil: { html: "<p>Les frontières de la région de Moussa ont été négociées entre l'Allemagne, la Grande-Bretagne et la France, souvent en lignes droites ou le long des fleuves, sans tenir compte des peuples. À l'indépendance, les États africains ont choisi de les conserver (OUA, 1964) pour éviter des guerres : la famille de Moussa en vit encore les effets.</p>", verdicts: [[2, "validee", "Règles fixées à Berlin, frontières tracées ensuite par des traités entre Européens, sans les peuples."]] },
        retenir: "Des frontières tracées par d'autres : un héritage encore visible aujourd'hui." }
    ],
    denouement: {
      titre: "Des frontières négociées entre Européens",
      etapes: ["1880 : 10 % de l'Afrique contrôlée ; 1914 : 90 % (indice 1).", "Berlin (1884-1885) : règles de l'occupation effective et de la notification, sans Africains (indice 2).", "Traités entre Européens, frontières droites ou fluviales, peuples séparés (indice 3)."],
      reponse: "<p>Les frontières qui séparent la famille de Moussa ne viennent pas des chefs africains. Poussés par des intérêts économiques, politiques et idéologiques, les Européens se lancent à la conquête de l'Afrique, dont ils ne contrôlaient que 10 % en 1880. La conférence de Berlin (15 novembre 1884 – 26 février 1885), convoquée par Bismarck sans aucun Africain, ne découpe pas le continent sur une carte : elle fixe les règles du partage, notamment l'occupation effective et la notification. Les frontières sont ensuite tracées par des traités entre puissances, l'Allemagne avec la Grande-Bretagne pour la frontière du Nigeria, avec la France pour celle du Tchad, souvent en lignes droites ou le long des fleuves, sans consulter les peuples. En 1914, 90 % de l'Afrique est colonisée ; ces frontières, conservées à l'indépendance, séparent encore des familles comme celle de Moussa.</p>",
      transfert: "<p>Cherche sur une carte du Cameroun une frontière tracée en ligne droite et une frontière qui suit un fleuve. Nomme-les et indique quelles puissances coloniales les ont négociées.</p>"
    },
    revision: (HP_OLD ? HP_OLD.revision : []).concat(["Berlin fixe des règles ; les frontières viennent de traités entre Européens.", "1880 : 10 % ; 1914 : 90 % du continent colonisé."]),
    exo: HP_OLD ? HP_OLD.exo : "",
    quiz: [
      q("Qui convoque la conférence de Berlin ?", "Bismarck", "Napoléon III", "la reine Victoria", "Le chancelier allemand."),
      q("Que signifie l'occupation effective ?", "occuper réellement le territoire revendiqué", "acheter le territoire", "le visiter une fois", "Une simple revendication ne suffit plus."),
      q("Combien d'Africains participent à la conférence ?", "aucun", "dix", "un par royaume", "Le continent est partagé sans ses peuples."),
      q("En 1914, quels pays africains restent indépendants ?", "l'Éthiopie et le Libéria", "le Cameroun et le Tchad", "l'Égypte et le Maroc", "Menelik II bat l'Italie à Adoua (1896)."),
      q("La conférence de Berlin a…", "fixé les règles du partage", "tracé toutes les frontières", "accordé l'indépendance à l'Afrique", "Les frontières viennent ensuite de traités."),
      q("Part de l'Afrique sous contrôle européen en 1880 :", "environ 10 %", "environ 90 %", "100 %", "Des comptoirs côtiers."),
      q("Une cause économique de la conquête :", "le besoin de matières premières", "la mission civilisatrice", "le prestige national", "Caoutchouc, huile de palme, minerais."),
      q("Quel médicament a facilité la pénétration européenne ?", "la quinine", "la pénicilline", "l'aspirine", "Contre le paludisme."),
      q("Un résistant à la conquête :", "Samory Touré", "Bismarck", "Nachtigal", "Avec Béhanzin, Menelik II…"),
      q("Pourquoi les États africains ont-ils gardé les frontières coloniales ?", "pour éviter des guerres", "parce qu'elles respectaient les peuples", "par obligation de Berlin", "Principe adopté par l'OUA en 1964.")
    ]
  });

  /* ═══════════════════════ 3e ECM — LES FONDEMENTS DE LA DÉMOCRATIE ═══════════════════════ */
  var ED_OLD = ancien("3e-ecm-democratie");
  var PILIERS = ["Élections libres", "Séparation des pouvoirs", "État de droit", "Libertés", "Pluralisme"];
  function temple3D() {
    var o = [], toit = [0, 70, 0], k;
    o.push({ f: "boite", c: [0, -14, 0], d: [460, 10, 200], coul: "#B9B2A2", dessus: "#D9D3C6" });
    o.push({ f: "boite", c: [0, -4, 0], d: [400, 10, 150], coul: "#D6CFC0", dessus: "#ECE7DC" });
    o.push({ f: "boite", c: [0, 6, 0], d: [370, 10, 130], coul: "#E4DED2", dessus: "#F4F1EA" });
    for (k = 0; k < 5; k++) { var x = -150 + k * 75; o.push({ f: "cylindre", c: [x, 16, 30], r: 14, h: 150, n: 18, coul: "#F1ECE2", dessus: "#FBF8F2" }); o.push({ f: "boite", c: [x, 166, 30], d: [36, 8, 36], coul: "#E4DED2", dessus: "#F4F1EA", div: false }); }
    o.push({ f: "boite", c: [0, 174, 0], d: [380, 18, 130], coul: "#E4DED2", dessus: "#F1ECE2", ec: toit });
    o.push({ f: "poly", pts: [[-190, 192, 65], [190, 192, 65], [0, 250, 65]], coul: "#ECE7DC", ec: toit });
    o.push({ f: "poly", pts: [[-190, 192, -65], [0, 250, -65], [190, 192, -65]], coul: "#D6CFC0", ec: toit });
    o.push({ f: "poly", pts: [[-190, 192, 65], [0, 250, 65], [0, 250, -65], [-190, 192, -65]], coul: "#B33A2C", ec: toit });
    o.push({ f: "poly", pts: [[190, 192, 65], [190, 192, -65], [0, 250, -65], [0, 250, 65]], coul: "#9E2F24", ec: toit });
    o.forEach(function (x) { if (x.c) x.c[1] -= 110; if (x.pts) x.pts.forEach(function (q) { q[1] -= 110; }); });
    return o;
  }
  remplacer("3e-ecm-democratie", {
    c: "3e", m: "ecm", titre: "Les fondements de la démocratie", duree: 35,
    accroche: "Le proviseur veut nommer lui-même le président du foyer ; les élèves réclament un vote. Un seul vote suffit-il à faire une démocratie ?",
    intro: "L'élection du foyer d'un lycée te sert de fil rouge : à chaque partie, un indice t'aide à trancher entre trois idées.",
    objectifs: ["définir la démocratie et expliquer son étymologie", "identifier les cinq piliers d'un régime démocratique", "distinguer démocratie directe, représentative et semi-directe", "appliquer ces critères à une situation concrète"],
    enquete: {
      titre: "Le foyer du lycée de Mokolo",
      svg: (function () {
        var s = "<rect width='640' height='210' fill='#EEF3F9'/><rect x='220' y='70' width='200' height='110' rx='6' fill='#fff' stroke='#C9D2E3'/><rect x='280' y='60' width='80' height='14' rx='3' fill='#1E499B'/><path d='M300 68h40' stroke='#0E2A62' stroke-width='4'/>" + txt(320, 130, "URNE", { s: 18, c: BLEU });
        s += perso(90, 104, "#6B4423", "#5A5F6B", "#3A3F4A") + bulle(20, 40, 150, "Je nommerai le président.") + perso(520, 104, "#5A3A1E", "#DCE6F2", "#1E499B") + perso(570, 108, "#6B4423", "#DCE6F2", "#1E499B") + bulle(470, 40, 150, "Nous voulons voter !");
        s += txt(320, 200, "lycée de Mokolo, Extrême-Nord", { s: 11.5, c: GRIS, w: 600 });
        return svg(640, 210, "Le proviseur veut nommer le président du foyer, des élèves réclament un vote autour d une urne", "", s);
      })(),
      legende: "À Mokolo, dans l'Extrême-Nord : la rentrée au lycée, et un foyer des élèves à réorganiser.",
      contexte: "<p>Le proviseur annonce qu'il <strong>nommera lui-même</strong> le président du foyer, « pour gagner du temps ». Les élèves protestent et obtiennent un vote. Mais le candidat élu propose ensuite : « Je resterai président jusqu'au bac, je déciderai seul des dépenses, et ceux qui me critiqueront seront exclus du foyer. » Ses partisans répondent : « Il a été élu, c'est la démocratie ! »</p>",
      documents: [{ t: "Le règlement intérieur proposé par le président élu", html: "<ol><li>Le président est élu une fois pour trois ans.</li><li>Il décide seul du budget et des sanctions.</li><li>Les critiques publiques sont interdites.</li><li>Une seule liste peut se présenter.</li></ol>" }],
      question: "Le foyer du lycée de Mokolo fonctionne-t-il de façon démocratique ?",
      tache: "Analyse le règlement article par article à l'aide des piliers de la démocratie, puis propose un règlement démocratique.",
      hypotheses: ["Oui : le président a été élu, c'est suffisant.", "La démocratie, c'est que la majorité décide de tout, même contre les droits des autres.", "Non : la démocratie exige des élections régulières, la séparation des pouvoirs, le respect des lois, des libertés et du pluralisme."]
    },
    parties: [
      { t: "Définition", html: "<div class='def'><b>Démocratie</b>Régime politique dans lequel le pouvoir appartient au peuple, qui l'exerce directement ou par ses représentants élus.</div>" + partie(ED_OLD, 0),
        planches: [{ type: "2D", titre: "La formule de Lincoln", legende: "« Du peuple » : le pouvoir vient du peuple ; « par le peuple » : il l'exerce, directement ou par ses élus ; « pour le peuple » : il sert l'intérêt général.", svg: (function () {
          var s = "", C = [["du peuple", "origine du pouvoir", "#1E499B"], ["par le peuple", "exercice du pouvoir", "#2E7D32"], ["pour le peuple", "but du pouvoir", "#C2540A"]];
          C.forEach(function (c, i) { var x = 30 + i * 205; s += "<rect x='" + x + "' y='70' width='175' height='96' rx='16' fill='" + c[2] + "'/>" + txt(x + 87, 112, c[0], { s: 17, c: "#fff" }) + txt(x + 87, 140, c[1], { s: 12, c: "#fff", w: 500 }); if (i < 2) s += "<path d='M" + (x + 178) + " 118h24' stroke='" + NUIT + "' stroke-width='2.5' marker-end='url(#ed1f)'/>"; });
          s += txt(320, 40, "« le gouvernement du peuple, par le peuple, pour le peuple »", { s: 14, i: true }) + txt(320, 200, "dêmos (le peuple) + kratos (le pouvoir)", { s: 12.5, c: GRIS });
          return svg(640, 220, "Trois blocs : du peuple, par le peuple, pour le peuple", fleche("ed1f", NUIT), s);
        })() }],
        fil: { html: "<p>Un vote a bien eu lieu : le pouvoir vient des élèves (« du peuple »). Mais une démocratie doit aussi s'exercer avec eux et pour eux : un vote unique ne suffit pas à le garantir.</p>" },
        retenir: "Démocratie : le pouvoir du peuple, par le peuple, pour le peuple." },
      { t: "Les piliers de la démocratie", html: partie(ED_OLD, 1),
        planches: [{ type: "3d", titre: "Le temple de la démocratie", legende: "Les cinq colonnes portent le toit : élections libres et régulières, séparation des pouvoirs, État de droit, libertés fondamentales, pluralisme. Le curseur soulève le toit : sans colonnes, rien ne le soutient.",
          modele: { h: 380, rx: -14, ry: 22, echelle: 0.8, alt: "Temple grec blanc à cinq colonnes et toit rouge", eclate: "Soulever le toit", jouer: "Soulever le toit", objets: temple3D(),
            etiquettes: PILIERS.map(function (p, k) { return { p: [-150 + k * 75, -10, 44], t: p, cote: k > 2 ? "d" : "g" }; }) } }],
        fil: { html: "<p>Le règlement proposé abat les colonnes une à une : un mandat de trois ans sans nouvelle élection (élections régulières), un président qui décide seul du budget et des sanctions (séparation des pouvoirs, État de droit), des critiques interdites (libertés) et une liste unique (pluralisme). Une élection ne rend pas démocratique un pouvoir qui supprime ensuite les droits des autres.</p>", verdicts: [[0, "rejetee", "Une élection unique ne suffit pas : il faut aussi les quatre autres piliers."], [1, "rejetee", "La majorité ne peut pas supprimer les droits et libertés de la minorité."], [2, "validee", "Les cinq piliers sont nécessaires ensemble."]] },
        retenir: "Élections, séparation des pouvoirs, État de droit, libertés, pluralisme : les cinq piliers." },
      { t: "Les formes de démocratie", html: partie(ED_OLD, 2),
        planches: [{ type: "2D", titre: "Directe, représentative, semi-directe", legende: "Dans la démocratie directe, les citoyens votent eux-mêmes les décisions ; dans la représentative, ils élisent des représentants ; la semi-directe ajoute le référendum.", svg: (function () {
          var s = "", T = [["directe", "les citoyens décident", "Athènes antique"], ["représentative", "les citoyens élisent", "députés, conseillers"], ["semi-directe", "élus + référendum", "Cameroun, Suisse…"]];
          T.forEach(function (t, i) {
            var x = 20 + i * 210, k;
            s += "<rect x='" + x + "' y='20' width='190' height='200' rx='14' fill='#F7F9FC' stroke='#C9D2E3'/>" + txt(x + 95, 46, t[0], { s: 15, c: BLEU });
            for (k = 0; k < 9; k++) s += "<circle cx='" + (x + 35 + (k % 5) * 30) + "' cy='" + (176 - Math.floor(k / 5) * 22) + "' r='8' fill='#6B4423'/>";
            s += "<rect x='" + (x + 65) + "' y='70' width='60' height='40' rx='6' fill='" + (i === 1 ? "#E3D8C4" : "#FFE9A8") + "' stroke='#8A6E4B'/>" + (i === 1 ? "" : txt(x + 95, 95, "décision", { s: 11 }));
            if (i === 1) for (k = 0; k < 3; k++) s += "<circle cx='" + (x + 80 + k * 15) + "' cy='84' r='6' fill='#1E499B'/>";
            s += "<path d='M" + (x + 95) + " 150V116' stroke='" + NUIT + "' stroke-width='2' marker-end='url(#ed3f)'/>" + txt(x + 95, 206, t[1] + " · " + t[2], { s: 10, w: 600, c: GRIS });
          });
          return svg(640, 236, "Trois schémas : démocratie directe, représentative et semi-directe", fleche("ed3f", NUIT), s);
        })() }],
        fil: { html: "<p>Au foyer, une démocratie représentative suffit : les élèves élisent un bureau pour un an, qui rend des comptes ; les décisions importantes (par exemple le prix de la cotisation) peuvent être soumises à un vote de tous les élèves, comme un référendum.</p>" },
        retenir: "Directe, représentative, semi-directe : le Cameroun est une démocratie représentative avec référendum possible." }
    ],
    denouement: {
      titre: "Un règlement démocratique pour le foyer",
      etapes: ["Le pouvoir vient des élèves : élection (indice 1).", "Le règlement proposé viole quatre piliers (indice 2).", "Bureau élu chaque année, contrôle par une assemblée, référendum possible (indice 3)."],
      reponse: "<p>Le foyer n'est pas démocratique, même si son président a été élu. La démocratie, « le gouvernement du peuple, par le peuple, pour le peuple », repose sur cinq piliers à la fois. Le règlement proposé les détruit : un mandat de trois ans supprime les élections régulières ; un président qui décide seul du budget et des sanctions confond les pouvoirs et se place au-dessus des règles ; l'interdiction des critiques supprime la liberté d'expression ; la liste unique supprime le pluralisme. Un règlement démocratique prévoirait l'élection du bureau chaque année avec plusieurs listes, un budget voté et contrôlé par l'assemblée des délégués, des sanctions décidées par un conseil de discipline selon le règlement, la liberté de critiquer, et un vote de tous les élèves pour les décisions importantes.</p>",
      transfert: "<p>Rédige en cinq articles le règlement démocratique du club de ta classe (élection, durée du mandat, budget, sanctions, libertés).</p>"
    },
    revision: (ED_OLD ? ED_OLD.revision : []).concat(["Une élection ne suffit pas : il faut les cinq piliers ensemble.", "La majorité ne supprime pas les droits de la minorité."]),
    exo: ED_OLD ? ED_OLD.exo : "",
    quiz: [
      q("« Démocratie » vient du grec…", "dêmos (peuple) et kratos (pouvoir)", "dêmos (ville) et kratos (loi)", "demo (moitié) et cratie (roi)", "Le pouvoir du peuple."),
      q("Qui a parlé du « gouvernement du peuple, par le peuple, pour le peuple » ?", "Abraham Lincoln", "Montesquieu", "Bismarck", "Président des États-Unis."),
      q("La séparation des pouvoirs a été théorisée par…", "Montesquieu", "Lincoln", "Rousseau seul", "De l'esprit des lois (1748)."),
      q("Les trois pouvoirs sont…", "législatif, exécutif, judiciaire", "militaire, religieux, civil", "national, régional, local", "Ils doivent être séparés."),
      q("Le pluralisme, c'est…", "l'existence de plusieurs partis et opinions", "un parti unique", "le vote obligatoire", "Pas de liste unique."),
      q("Dans une démocratie directe, …", "les citoyens votent eux-mêmes les décisions", "les citoyens élisent des députés", "un roi décide", "Comme à Athènes."),
      q("Le référendum est un trait de la démocratie…", "semi-directe", "directe pure", "autoritaire", "Élus + vote direct sur une question."),
      q("Un président élu qui interdit toute critique…", "viole la liberté d'expression", "reste démocratique car élu", "applique l'État de droit", "Une élection ne suffit pas."),
      q("L'État de droit signifie que…", "gouvernants et gouvernés obéissent aux mêmes lois", "l'État fait ce qu'il veut", "seuls les citoyens obéissent", "Personne n'est au-dessus des lois."),
      q("La majorité peut-elle supprimer les droits de la minorité ?", "non", "oui, toujours", "oui, si elle est large", "Les libertés fondamentales protègent chacun.")
    ]
  });

  /* ═══════════════════════ Tle PHILOSOPHIE — LES PASSIONS ═══════════════════════ */
  var PP_OLD = ancien("tle-philo-passions");
  function balance3D() {
    var o = [], H = 150, D = 26, k;
    o.push({ f: "boite", c: [0, -10, 0], d: [420, 8, 200], coul: "#6B4423", dessus: "#8B5A2B" });
    o.push({ f: "cylindre", c: [0, -2, 0], r: 46, r2: 34, h: 16, n: 24, coul: "#B08D57", dessus: "#D2B07A" });
    o.push({ f: "cylindre", c: [0, 14, 0], r: 7, h: H - 14, n: 14, coul: "#B08D57", dessus: "#D2B07A" });
    o.push({ f: "cone", c: [0, H - 4, 0], r: 12, h: 22, n: 12, coul: "#D2B07A" });
    for (k = -30; k <= 30; k++) { var x = k * 5, dy = -x / 150 * D; o.push({ f: "sphere", c: [x, H + dy, 0], r: 4.2, coul: "#C9A66B", ec: [0, -dy, 0] }); }
    [[-150, D, "#C62828"], [150, -D, "#1E499B"]].forEach(function (p) {
      var y0 = H - p[1], ec = [0, p[1], 0];
      [[-24, 0], [24, 0], [0, 24], [0, -24]].forEach(function (d) { for (k = 0; k <= 8; k++) { var t = k / 8; o.push({ f: "sphere", c: [p[0] + d[0] * t, y0 - 80 * t, d[1] * t], r: 1.2, coul: "#8E96A6", ec: ec }); } });
      o.push({ f: "cylindre", c: [p[0], y0 - 88, 0], r: 46, r2: 30, h: 8, n: 26, coul: "#B08D57", dessus: "#E0C38B", ec: ec });
      o.push({ f: "sphere", c: [p[0], y0 - 64, 0], r: 16, coul: p[2], ec: ec });
    });
    return o;
  }
  remplacer("tle-philo-passions", {
    c: "Tle A", m: "philo", titre: "Les passions : définition et manifestations", duree: 35,
    accroche: "Junior ne vit plus que pour les paris sportifs ; Sali ne vit que pour sa guitare. La même passion ?",
    intro: "Deux amis de Garoua te servent de fil rouge : à chaque partie, un indice t'aide à trancher entre trois thèses.",
    objectifs: ["définir la passion et la distinguer de l'émotion", "décrire ses manifestations (exclusivité, cristallisation, logique propre, énergie)", "confronter les thèses : la passion asservit ou grandit", "construire une problématique et une réponse nuancée"],
    enquete: {
      titre: "Junior, Sali et leurs passions",
      svg: (function () {
        var s = "<rect width='640' height='210' fill='#F4F1EA'/>";
        s += "<rect x='40' y='40' width='120' height='80' rx='10' fill='#1F2328'/><rect x='48' y='48' width='104' height='58' rx='4' fill='#123B26'/>" + txt(100, 70, "Coton Sport – Canon", { s: 9.5, c: "#E8ECF1", w: 600 }) + txt(100, 92, "cote 2,35", { s: 13, c: "#FFD54A" }) + "<rect x='92' y='120' width='16' height='14' fill='#1F2328'/>" + perso(205, 96, "#6B4423", "#DCE6F2", "#1E499B") + txt(130, 190, "Junior : les paris sportifs", { s: 12, c: ROUGE });
        s += "<g transform='translate(470 70) rotate(-20)'><ellipse cx='0' cy='40' rx='34' ry='40' fill='#B9824A'/><circle cx='0' cy='40' r='10' fill='#3A2A1A'/><rect x='-6' y='-70' width='12' height='90' fill='#5A3A1E'/></g>" + perso(545, 96, "#5A3A1E", "#7B3F99", "#7B3F99") + txt(500, 190, "Sali : la guitare", { s: 12, c: "#7B3F99" });
        return svg(640, 210, "À gauche un écran de paris sportifs et Junior ; à droite une guitare et Sali", "", s);
      })(),
      legende: "À Garoua : deux amis de Terminale A, inséparables depuis le collège.",
      contexte: "<p><strong>Junior</strong> passe ses nuits à étudier les matchs et à parier : il a vendu son téléphone pour « se refaire », ment à ses parents et a manqué deux devoirs. « Je maîtrise, j'ai une méthode », dit-il. <strong>Sali</strong> joue de la guitare six heures par jour ; elle a monté un groupe qui joue au festival de Garoua et prépare un concours de musique. Leur professeur de philosophie leur demande : « Êtes-vous libres ou esclaves de vos passions ? »</p>",
      documents: [
        { t: "Hegel, La Raison dans l'histoire (1822-1830)", html: "<p>« Rien de grand ne s'est accompli dans le monde sans passion. »</p>" },
        { t: "Kant, Anthropologie (1798)", html: "<p>« La passion est une maladie de l'âme […] qui exclut l'empire sur soi-même. »</p>" }
      ],
      question: "La passion est-elle une servitude ou une source de grandeur ?",
      tache: "Rédige une introduction de dissertation (définitions, problème, plan) puis une conclusion qui tranche, en t'appuyant sur les cas de Junior et Sali.",
      hypotheses: ["La passion est toujours une servitude : elle nous rend esclaves (Kant).", "La passion est toujours une grandeur : sans elle, rien de grand (Hegel).", "La passion est ambivalente : énergie précieuse quand la raison la gouverne, servitude quand elle gouverne la raison."]
    },
    parties: [
      { t: "Définir la passion", html: partie(PP_OLD, 0),
        planches: [{ type: "2D", titre: "Émotion et passion dans le temps", legende: "L'émotion (la peur devant un serpent) est un pic brusque qui retombe vite ; la passion est une intensité durable qui organise toute la vie autour de son objet.", svg: (function () {
          var X = function (t) { return 70 + t * 5.3; }, Y = function (v) { return 220 - v * 1.7; }, d1 = "", d2 = "", t;
          for (t = 0; t <= 100; t++) { d1 += (t ? "L" : "M") + X(t).toFixed(1) + " " + Y(t < 10 ? 5 : 5 + 95 * Math.exp(-(t - 10) / 3) * (t < 11 ? (t - 10) : 1)).toFixed(1); d2 += (t ? "L" : "M") + X(t).toFixed(1) + " " + Y(Math.min(80, 5 + (t > 15 ? (t - 15) * 4 : 0)) + Math.sin(t / 3) * 3).toFixed(1); }
          return svg(640, 260, "Deux courbes : un pic bref pour l émotion, un plateau durable pour la passion", "", "<path d='M70 220H610M70 220V30' stroke='" + NUIT + "' stroke-width='1.5'/><path d='" + d1 + "' fill='none' stroke='#F2994A' stroke-width='3'/><path d='" + d2 + "' fill='none' stroke='" + ROUGE + "' stroke-width='3.5'/>" + txt(150, 54, "émotion : brusque et brève", { s: 12, c: "#C2540A", a: "start" }) + txt(600, 70, "passion : durable et exclusive", { s: 12, c: ROUGE, a: "end" }) + txt(340, 248, "temps", { s: 12 }) + txt(76, 26, "intensité", { s: 11.5, a: "start", c: GRIS }));
        })() }],
        fil: { html: "<p>Junior et Sali ne vivent pas une simple émotion : leur attachement dure depuis des mois et oriente toute leur vie. Ce sont deux <strong>passions</strong>, au sens propre : quelque chose qu'ils « subissent » (pati) autant qu'ils le choisissent.</p>" },
        retenir: "Passion ≠ émotion : durable et exclusive ; étymologie pati, subir." },
      { t: "Les manifestations de la passion", html: partie(PP_OLD, 1) +
        "<div class='savais'><b>La cristallisation (Stendhal)</b>Dans les mines de sel de Salzbourg, un rameau d'arbre laissé quelques mois se couvre de cristaux brillants : le passionné « cristallise » de même son objet en le parant de toutes les perfections.</div>",
        planches: [{ type: "2D", titre: "Le rameau de Salzbourg", legende: "À gauche, un rameau sec ; à droite, le même rameau après des mois dans une mine de sel, couvert de cristaux qui scintillent. Ainsi Junior ne voit plus que les gains possibles et oublie les pertes.", svg: (function () {
          function rameau(x, cristaux) {
            var s = "<g transform='translate(" + x + " 40)'><path d='M100 220L100 120L60 60M100 140L150 80M100 170L60 140M100 100L130 40M60 60L40 30M150 80L175 60' stroke='#6B4423' stroke-width='5' stroke-linecap='round' fill='none'/>";
            if (cristaux) { var R = alea(7); for (var k = 0; k < 70; k++) { var pts = [[100, 120 + R() * 100], [60 + R() * 40, 60 + R() * 60], [100 + R() * 50, 80 + R() * 60], [60 + R() * 40, 140 + R() * 30], [100 + R() * 30, 40 + R() * 60]][k % 5], r = 3 + R() * 4; s += "<path d='M" + pts[0] + " " + (pts[1] - r) + "L" + (pts[0] + r * .8) + " " + pts[1] + "L" + pts[0] + " " + (pts[1] + r) + "L" + (pts[0] - r * .8) + " " + pts[1] + "Z' fill='url(#ppcr)' stroke='#9FD4F2' stroke-width='.6'/>"; } }
            return s + "</g>";
          }
          return svg(640, 290, "Un rameau sec et le même rameau couvert de cristaux de sel brillants", lin("ppcr", ["#FFFFFF", "#DDF1FD", "#9FD4F2"], true), "<rect width='640' height='290' fill='#2B2B33'/>" + rameau(40, false) + rameau(360, true) + txt(160, 280, "rameau sec", { s: 12, c: "#E8ECF1" }) + txt(480, 280, "après des mois dans la mine de sel", { s: 12, c: "#E8ECF1" }) + "<path d='M300 150h50' stroke='#FFD54A' stroke-width='3' marker-end='url(#ppf)'/>").replace("</defs>", fleche("ppf", "#FFD54A") + "</defs>");
        })() }],
        fil: { html: "<p>Junior présente toutes les manifestations : exclusivité (il ne pense qu'aux matchs), cristallisation (il ne retient que ses gains), logique propre (« j'ai une méthode »), énergie (des nuits entières). Sali aussi : exclusivité, énergie, mais son énergie construit une œuvre, un groupe, un concours. Les manifestations sont les mêmes ; les effets diffèrent.</p>" },
        retenir: "Exclusivité, cristallisation, logique propre, énergie." },
      { t: "Le problème : grandeur ou servitude ?", html: partie(PP_OLD, 2),
        planches: [{ type: "3d", titre: "La balance de la raison et de la passion", legende: "Le plateau rouge (la passion) l'emporte sur le plateau bleu (la raison) : c'est l'état de Junior. Le curseur rééquilibre la balance : la passion reste, mais la raison la gouverne, comme le veut Descartes.",
          modele: { h: 340, rx: -12, ry: 18, echelle: 0.95, alt: "Balance en laiton à deux plateaux, l un rouge plus bas que l autre bleu", eclate: "Rééquilibrer", jouer: "Rééquilibrer", objets: balance3D(),
            etiquettes: [{ p: [-150, 76, 0], t: "Passion", ec: [0, 26, 0] }, { p: [150, 128, 0], t: "Raison", cote: "d", ec: [0, -26, 0] }] } }],
        fil: { html: "<p>Chez Junior, la passion a pris le pouvoir : il ment, vend ses biens, ne maîtrise plus rien ; Kant a raison de parler de « maladie de l'âme ». Chez Sali, la passion fournit l'énergie, mais sa raison l'organise (horaires, objectifs, concours) : Hegel a raison. Ni « toujours servitude » ni « toujours grandeur » : tout dépend de qui gouverne.</p>", verdicts: [[0, "rejetee", "Sali montre que la passion peut produire une œuvre."], [1, "rejetee", "Junior montre que la passion peut asservir."], [2, "validee", "Énergie gouvernée par la raison : grandeur ; raison asservie : servitude."]] },
        retenir: "Thèse 1 : la passion asservit ; thèse 2 : elle grandit ; dépassement : la régler par la raison (Descartes)." }
    ],
    denouement: {
      titre: "Une énergie à gouverner",
      etapes: ["Passion : inclination durable et exclusive, distincte de l'émotion (indice 1).", "Mêmes manifestations chez Junior et Sali (indice 2).", "Servitude quand elle gouverne la raison, grandeur quand la raison la gouverne (indice 3)."],
      reponse: "<p>La passion, du latin pati (subir), est une inclination durable et exclusive qui oriente toute la vie vers un objet ; elle se distingue de l'émotion, brusque et brève. Junior et Sali vivent tous deux une passion, avec ses manifestations : exclusivité, cristallisation, logique propre, énergie. Le problème est de savoir si elle nous asservit ou nous grandit. Junior illustre la thèse de Kant : sa passion du jeu a pris l'« empire sur lui-même », le pousse à mentir et à se ruiner. Sali illustre celle de Hegel : sa passion de la musique lui donne l'énergie d'accomplir quelque chose de grand. La passion n'est donc ni bonne ni mauvaise en elle-même : comme le soutient Descartes, elle est une force précieuse lorsque la raison la gouverne, et une servitude lorsqu'elle gouverne la raison.</p>",
      transfert: "<p>Rédige un paragraphe argumenté (dix lignes) : « Peut-on être raisonnablement passionné ? », avec un exemple tiré de la vie au Cameroun (sport, études, commerce, art).</p>"
    },
    revision: (PP_OLD ? PP_OLD.revision : []).concat(["Kant : « maladie de l'âme » ; Hegel : « rien de grand sans passion ».", "Stendhal : la cristallisation."]),
    exo: PP_OLD ? PP_OLD.exo : "",
    quiz: [
      q("Le mot « passion » vient du latin pati, qui signifie…", "subir", "aimer", "agir", "La passion est ce que l'âme subit."),
      q("La passion se distingue de l'émotion parce qu'elle est…", "durable et exclusive", "brusque et brève", "toujours joyeuse", "L'émotion retombe vite."),
      q("« Rien de grand ne s'est accompli dans le monde sans passion » :", "Hegel", "Kant", "Spinoza", "La passion comme moteur de l'histoire."),
      q("Pour Kant, la passion est…", "une maladie de l'âme", "la source de toute vertu", "une émotion brève", "Elle exclut l'empire sur soi."),
      q("La cristallisation, selon Stendhal, c'est…", "parer son objet de toutes les perfections", "oublier son objet", "transformer la passion en sel", "Le rameau de Salzbourg."),
      q("Descartes juge les passions…", "bonnes si la raison les gouverne", "toujours mauvaises", "sans importance", "Les Passions de l'âme (1649)."),
      q("Le passionné qui raisonne beaucoup au service de sa passion montre…", "une logique propre", "une émotion", "une indifférence", "Junior : « j'ai une méthode »."),
      q("Les stoïciens et Spinoza voient d'abord dans la passion…", "une servitude", "une grandeur", "une vertu", "L'homme n'est plus maître de lui."),
      q("La peur soudaine devant un serpent est…", "une émotion", "une passion", "une cristallisation", "Brusque et brève."),
      q("Une conclusion nuancée sur les passions dira que…", "tout dépend de qui gouverne, la raison ou la passion", "la passion est toujours bonne", "il faut supprimer toute passion", "Ambivalence de la passion.")
    ]
  });

  /* ═══════════════════════ Tle PHILOSOPHIE — LA LIBERTÉ, FONDEMENT DE LA RESPONSABILITÉ ═══════════════════════ */
  var PL_OLD = ancien("tle-philo-liberte");
  function marionnette3D() {
    var o = [], fils = [0, 70, -40];
    o.push({ f: "boite", c: [0, -10, 0], d: [360, 8, 200], coul: "#7A4A22", dessus: "#A8703A" });
    o.push({ f: "boite", c: [0, 0, 0], d: [60, 10, 30], coul: "#5D3A1E", div: false });
    o.push({ f: "boite", c: [0, 60, 0], d: [44, 60, 24], coul: "#C2540A", dessus: "#D9772E", div: false });
    o.push({ f: "sphere", c: [0, 140, 0], r: 18, coul: "#8B5A2B" });
    o.push({ f: "boite", c: [-12, 10, 0], d: [12, 50, 12], coul: "#1E499B", div: false });
    o.push({ f: "boite", c: [12, 10, 0], d: [12, 50, 12], coul: "#1E499B", div: false });
    o.push({ f: "boite", c: [-30, 70, 0], d: [10, 46, 10], coul: "#8B5A2B", div: false });
    o.push({ f: "boite", c: [30, 70, 0], d: [10, 46, 10], coul: "#8B5A2B", div: false });
    o.push({ f: "boite", c: [0, 250, 0], d: [140, 8, 10], coul: "#6B4423", dessus: "#8B5A2B", div: false, ec: fils });
    o.push({ f: "boite", c: [0, 250, 0], d: [10, 8, 90], coul: "#6B4423", dessus: "#8B5A2B", div: false, ec: fils });
    [[-60, 0, -30, 116], [60, 0, 30, 116], [0, 40, 0, 158], [0, -40, 0, 120]].forEach(function (f) {
      for (var k = 0; k < 10; k++) { var t = k / 9; o.push({ f: "sphere", c: [f[0] + (f[2] - f[0]) * t, 250 - (250 - f[3]) * t, f[1] * (1 - t)], r: 1.4, coul: "#E9ECEF", ec: [fils[0], fils[1] * (1 - t), fils[2] * (1 - t)] }); }
    });
    o.forEach(function (x) { if (x.c) x.c[1] -= 110; });
    return o;
  }
  remplacer("tle-philo-liberte", {
    c: "Tle A", m: "philo", titre: "La liberté, fondement de la responsabilité", duree: 35,
    accroche: "Trois chauffeurs, trois accidents à Douala : sont-ils tous également responsables ?",
    intro: "Trois affaires jugées par la classe te servent de fil rouge : à chaque partie, un indice t'aide à trancher entre trois thèses.",
    objectifs: ["définir la liberté et la responsabilité", "montrer qu'il n'y a pas de responsabilité sans liberté", "examiner les limites : déterminismes et inconscient", "construire une position nuancée : la liberté comme conquête"],
    enquete: {
      titre: "Le tribunal de la classe de Terminale A",
      svg: (function () {
        var s = "<rect width='640' height='210' fill='#F2EEE6'/>", C = [["freins coupés", "#8E96A6"], ["arme pointée", "#C62828"], ["alcool au volant", "#B07A00"]];
        C.forEach(function (c, i) { var x = 30 + i * 205; s += "<g transform='translate(" + x + " 40)'><path d='M10 80h170v-22l-24-30h-110l-26 30h-10z' fill='#F7C948' stroke='#7A5A00' stroke-width='2'/><rect x='52' y='32' width='46' height='24' rx='3' fill='#CFE3F3'/><rect x='104' y='32' width='46' height='24' rx='3' fill='#CFE3F3'/><circle cx='50' cy='82' r='13' fill='#2C3138'/><circle cx='140' cy='82' r='13' fill='#2C3138'/></g>" + "<rect x='" + (x + 20) + "' y='150' width='150' height='30' rx='12' fill='#fff' stroke='" + c[1] + "' stroke-width='2'/>" + txt(x + 95, 170, "Affaire " + (i + 1) + " : " + c[0], { s: 11.5, c: c[1] }); });
        return svg(640, 210, "Trois taxis jaunes et trois affaires : freins coupés, arme pointée, alcool au volant", "", s);
      })(),
      legende: "À Douala : la classe de Terminale A simule un tribunal à partir de trois faits divers.",
      contexte: "<p>Trois chauffeurs de taxi ont renversé un piéton. <strong>Affaire 1</strong> : les freins de Paul ont lâché ; un mécanicien les avait sabotés à son insu. <strong>Affaire 2</strong> : un bandit armé a obligé Ernest à foncer pour fuir la police. <strong>Affaire 3</strong> : Bertrand avait bu six bières avant de prendre le volant.</p><p>Un élève soutient : « Ils ont tous conduit, ils sont tous responsables. » Un autre : « Personne n'est jamais vraiment libre : l'alcool, la pauvreté, l'éducation nous déterminent. Donc personne n'est responsable. »</p>",
      documents: [
        { t: "Sartre, L'existentialisme est un humanisme (1946)", html: "<p>« L'homme est condamné à être libre. Condamné, parce qu'il ne s'est pas créé lui-même, et par ailleurs cependant libre, parce qu'une fois jeté dans le monde, il est responsable de tout ce qu'il fait. »</p>" },
        { t: "Un principe du droit pénal", html: "<p>N'est pas pénalement responsable la personne qui a agi sous l'empire d'une contrainte à laquelle elle n'a pu résister, ou atteinte d'un trouble ayant aboli son discernement. L'ivresse volontaire n'excuse pas.</p>" }
      ],
      question: "Sommes-nous responsables de nos actes à proportion de notre liberté ?",
      tache: "Juge les trois affaires en justifiant chaque verdict par la relation entre liberté et responsabilité, puis rédige la conclusion du débat.",
      hypotheses: ["On est toujours responsable de ce qu'on fait, quelles que soient les circonstances.", "Nous sommes entièrement déterminés : personne n'est jamais responsable.", "On est responsable dans la mesure où l'on était libre ; et l'on reste responsable d'avoir renoncé à sa liberté (ivresse volontaire)."]
    },
    parties: [
      { t: "Deux notions liées", html: partie(PL_OLD, 0),
        planches: [{ type: "2D", titre: "De la liberté à la responsabilité", legende: "Être libre, c'est pouvoir choisir ; le choix produit un acte, l'acte a des conséquences, et l'on doit en répondre (respondere) : c'est la responsabilité.", svg: (function () {
          var E = [["Liberté", "#1E499B"], ["Choix", "#2E7D32"], ["Acte", "#C2540A"], ["Conséquences", "#7B3F99"], ["Répondre", "#C62828"]], s = "";
          E.forEach(function (e, i) { var x = 18 + i * 124; s += "<rect x='" + x + "' y='70' width='108' height='60' rx='30' fill='" + e[1] + "'/>" + txt(x + 54, 105, e[0], { s: 13.5, c: "#fff" }); if (i < 4) s += "<path d='M" + (x + 110) + " 100h12' stroke='" + NUIT + "' stroke-width='2.5' marker-end='url(#pl1f)'/>"; });
          s += "<path d='M560 140C560 200 72 200 72 140' fill='none' stroke='" + GRIS + "' stroke-width='2' stroke-dasharray='6 5' marker-end='url(#pl1g)'/>" + txt(320, 200, "pas de liberté → pas de responsabilité", { s: 12.5, c: GRIS });
          return svg(640, 220, "Chaîne : liberté, choix, acte, conséquences, répondre", fleche("pl1f", NUIT) + fleche("pl1g", GRIS), s);
        })() }],
        retenir: "Liberté : se déterminer soi-même ; responsabilité : répondre de ses actes." },
      { t: "Pas de responsabilité sans liberté", html: partie(PL_OLD, 1),
        fil: { html: "<p>Paul n'a rien choisi : le sabotage lui était inconnu ; Ernest a agi sous une contrainte irrésistible, une arme sur la tempe. Sans liberté, il n'y a pas de faute : la thèse « tous responsables » ne tient pas. Bertrand, lui, a choisi de boire puis de conduire : il était libre au moment décisif.</p>", verdicts: [[0, "rejetee", "Paul et Ernest n'étaient pas libres : on ne peut leur imputer la faute."]] },
        retenir: "Sans liberté, pas de faute (contrainte, folie) ; Kant : autonomie ; Sartre : condamné à être libre." },
      { t: "Les limites", html: partie(PL_OLD, 2),
        planches: [{ type: "3d", titre: "La marionnette et ses fils", legende: "Les fils représentent les déterminismes (sociaux, biologiques, psychologiques). Le curseur éloigne la croix : connaître ses fils, c'est commencer à s'en libérer. La liberté n'est pas donnée d'avance : elle se conquiert.",
          modele: { h: 400, rx: -8, ry: 24, echelle: 0.9, alt: "Marionnette en bois suspendue à une croix par des fils", eclate: "Éloigner les fils", jouer: "Se libérer", objets: marionnette3D(),
            etiquettes: [{ p: [0, 144, 0], t: "Croix : les déterminismes", ec: [0, 70, -40] }, { p: [0, 30, 0], t: "La personne", cote: "d" }] } }],
        fil: { html: "<p>Oui, l'alcool, la pauvreté, l'éducation pèsent sur nos choix ; le droit en tient compte par les circonstances atténuantes. Mais conclure que personne n'est responsable, c'est nier la différence entre Paul et Bertrand. Pour Sartre (document 1), invoquer ses déterminismes est une « mauvaise foi » : Bertrand reste responsable d'avoir renoncé lui-même à sa lucidité.</p>", verdicts: [[1, "rejetee", "Les déterminismes limitent la liberté sans l'abolir ; le droit distingue contrainte et ivresse volontaire."], [2, "validee", "Responsabilité à proportion de la liberté, et responsabilité d'avoir renoncé à sa liberté."]] },
        retenir: "Les déterminismes limitent la liberté sans l'abolir ; la liberté est une conquête." }
    ],
    denouement: {
      titre: "Le verdict de la classe",
      etapes: ["Liberté → choix → acte → répondre (indice 1).", "Paul et Ernest : pas libres, donc pas fautifs (indice 2).", "Bertrand : libre de boire et de conduire, donc responsable ; les déterminismes n'abolissent pas la liberté (indice 3)."],
      reponse: "<p>Être responsable, c'est devoir répondre de ses actes ; or on ne peut répondre que de ce que l'on a librement choisi. Paul, dont les freins ont été sabotés à son insu, et Ernest, contraint par une arme, n'étaient pas libres : ils ne sont pas fautifs, même s'ils ont causé l'accident. Bertrand, en revanche, a choisi de boire puis de conduire : il était libre au moment décisif, et l'ivresse volontaire ne l'excuse pas. La thèse « tous responsables » oublie que la responsabilité suppose la liberté ; la thèse « personne n'est responsable » confond les déterminismes, qui limitent la liberté, avec une contrainte qui l'abolit. Comme le dit Sartre, l'homme est « condamné à être libre » : il ne peut se cacher derrière sa nature ou son milieu. Nous sommes donc responsables à proportion de notre liberté, et la liberté elle-même est une conquête : connaître ses déterminismes, c'est commencer à s'en libérer.</p>",
      transfert: "<p>Un élève qui triche sous la pression de ses camarades est-il responsable ? Réponds en huit lignes en utilisant les notions de contrainte, de déterminisme et de mauvaise foi.</p>"
    },
    revision: (PL_OLD ? PL_OLD.revision : []).concat(["Droit : contrainte irrésistible ou trouble mental = pas de responsabilité ; ivresse volontaire = responsabilité.", "Sartre : invoquer ses déterminismes pour s'excuser, c'est la mauvaise foi."]),
    exo: PL_OLD ? PL_OLD.exo : "",
    quiz: [
      q("« Responsabilité » vient du latin respondere, qui signifie…", "répondre", "respecter", "réfléchir", "Répondre de ses actes."),
      q("On ne punit pas celui qui a agi sous la menace d'une arme car…", "il n'était pas libre", "l'acte était sans conséquence", "il a avoué", "Contrainte irrésistible."),
      q("« L'homme est condamné à être libre » :", "Sartre", "Kant", "Freud", "L'existentialisme est un humanisme."),
      q("Kant fonde la morale sur…", "l'autonomie de la volonté", "la recherche du plaisir", "l'obéissance aveugle", "Se donner sa propre loi."),
      q("L'ivresse volontaire au volant…", "n'excuse pas", "supprime toute responsabilité", "est une contrainte", "On a choisi de boire."),
      q("Freud montre que certains actes échappent…", "à la conscience", "aux lois physiques", "au temps", "L'inconscient."),
      q("Les circonstances atténuantes signifient que…", "les déterminismes diminuent la responsabilité sans l'abolir", "l'accusé est innocent", "la loi ne s'applique pas", "Le droit nuance."),
      q("Invoquer son milieu pour se déclarer irresponsable, c'est pour Sartre…", "de la mauvaise foi", "de la lucidité", "une contrainte", "On se ment à soi-même."),
      q("Pourquoi la liberté est-elle « une conquête » ?", "connaître ses déterminismes permet de s'en libérer", "elle s'achète", "elle est donnée à la naissance", "On devient plus libre."),
      q("Paul, dont les freins ont été sabotés à son insu, est…", "non fautif", "pleinement fautif", "de mauvaise foi", "Il n'a rien choisi.")
    ]
  });

  /* ═══════════════════════ SIMULATIONS ═══════════════════════ */
  function $(el, s) { return el.querySelector(s); }
  /* Berlin : appliquer les règles */
  VRT_A("3e-hist-partage", 1, "Applique les règles de Berlin : la revendication est-elle valable ?", function (el) {
    var C = [["Un explorateur plante un drapeau sur une plage, puis repart.", false, "Pas d'autorité sur place : l'occupation n'est pas effective."], ["Une puissance installe un poste militaire et un administrateur, puis prévient les autres signataires.", true, "Occupation effective et notification : la revendication est conforme aux règles."], ["Une puissance occupe un territoire mais n'en informe personne.", false, "Il manque la notification aux autres puissances."], ["Une puissance interdit aux bateaux des autres de naviguer sur le fleuve Congo.", false, "La navigation sur le Congo et le Niger doit rester libre."], ["Une puissance demande l'avis des peuples africains concernés.", null, "Les règles de Berlin ne l'exigent pas : c'est justement ce qu'on leur reproche."]];
    var i = 0, ok = 0;
    el.innerHTML = "<p class='labo-r' data-q style='font-size:16px'></p><div style='display:flex;gap:8px;flex-wrap:wrap' data-c></div><p class='an-note' data-e></p><p class='labo-r' data-s></p>";
    function poser() {
      var c = C[i];
      $(el, "[data-q]").textContent = (i + 1) + ". " + c[0];
      $(el, "[data-e]").textContent = "";
      $(el, "[data-s]").innerHTML = "Cas " + (i + 1) + " sur " + C.length + " · score : <b>" + ok + "</b>";
      $(el, "[data-c]").innerHTML = "<button type='button' class='btn-l' data-v='1'>Valable selon Berlin</button><button type='button' class='btn-l' data-v='0'>Pas valable</button>" + (c[1] === null ? "<button type='button' class='btn-l' data-v='2'>Berlin ne dit rien</button>" : "");
      el.querySelectorAll("[data-v]").forEach(function (b) {
        b.addEventListener("click", function () {
          var v = +b.dataset.v, bon = c[1] === null ? v === 2 : (v === 1) === c[1];
          if (bon) ok++;
          $(el, "[data-e]").innerHTML = (bon ? "✔ " : "✘ ") + c[2];
          el.querySelectorAll("[data-v]").forEach(function (x) { x.disabled = true; });
          var nx = document.createElement("button"); nx.type = "button"; nx.className = "btn-l"; nx.textContent = i + 1 < C.length ? "Cas suivant" : "Recommencer";
          nx.addEventListener("click", function () { i = (i + 1) % C.length; if (!i) ok = 0; poser(); });
          $(el, "[data-c]").appendChild(nx);
          $(el, "[data-s]").innerHTML = "Cas " + (i + 1) + " sur " + C.length + " · score : <b>" + ok + "</b>";
        });
      });
    }
    poser();
  });

  /* démocratie : cocher les règles du foyer, le temple se construit */
  VRT_A("3e-ecm-democratie", 1, "Écris le règlement du foyer : chaque règle démocratique dresse une colonne", function (el) {
    var R = [["Le bureau est élu chaque année.", 0], ["Plusieurs listes peuvent se présenter.", 4], ["Le budget est voté et contrôlé par l'assemblée des délégués.", 1], ["Les sanctions sont décidées par un conseil, selon le règlement.", 2], ["Chacun peut critiquer le bureau librement.", 3]];
    el.innerHTML = "<div data-l style='display:grid;gap:6px'>" + R.map(function (r, k) { return "<label style='display:flex;gap:8px;align-items:center'><input type='checkbox' data-k='" + k + "'><span>" + r[0] + "</span></label>"; }).join("") + "</div><svg viewBox='0 0 640 280' class='an-svg' data-s></svg><p class='labo-r' data-r></p>";
    function maj() {
      var on = [].map.call(el.querySelectorAll("[data-k]"), function (c) { return c.checked; }), n = 0;
      var s = "<defs>" + lin("edc", ["#FBF8F2", "#E4DED2", "#C9C1B2"]) + lin("edv", ["#C9C1B2", "#F4F1EA", "#C9C1B2"], true) + "</defs><rect width='640' height='280' fill='#EEF3F9'/><rect x='0' y='236' width='640' height='44' fill='#D9CDB4'/>";
      s += "<rect x='100' y='222' width='440' height='14' fill='#C9C1B2'/><rect x='118' y='210' width='404' height='12' fill='#E4DED2'/><rect x='136' y='198' width='368' height='12' fill='#F1ECE2'/>";
      R.forEach(function (r, k) {
        var x = 160 + r[1] * 80;
        if (on[k]) { n++; s += "<rect x='" + (x - 15) + "' y='76' width='30' height='122' fill='url(#edc)'/><path d='M" + (x - 9) + " 80V196M" + (x - 1) + " 80V196M" + (x + 7) + " 80V196' stroke='#D6CFC0' stroke-width='1.2'/><rect x='" + (x - 20) + "' y='68' width='40' height='9' fill='#E4DED2'/>"; }
        else s += "<g transform='translate(" + (x - 50 + r[1] * 4) + " 246) rotate(" + (r[1] % 2 ? 4 : -3) + ")'><rect width='100' height='22' rx='4' fill='url(#edv)'/></g>";
        var mots = PILIERS[r[1]].split(" "), l2 = mots.length > 1 ? mots.slice(1).join(" ") : "";
        s += txt(x, 186, mots[0], { s: 9.5, c: on[k] ? NUIT : "#9AA3B2", halo: true }) + (l2 ? txt(x, 196, l2, { s: 9.5, c: on[k] ? NUIT : "#9AA3B2", halo: true }) : "");
      });
      if (n === 5) s += "<rect x='126' y='58' width='388' height='12' fill='#E4DED2'/><path d='M120 58H520L320 14Z' fill='#B33A2C'/>" + txt(320, 50, "DÉMOCRATIE", { s: 14, c: "#fff" });
      else s += "<path d='M120 58H520L320 14Z' fill='none' stroke='#B33A2C' stroke-width='2' stroke-dasharray='6 6'/>" + txt(320, 46, "le toit ne tient pas", { s: 12, c: "#B33A2C" });
      $(el, "[data-s]").innerHTML = s;
      $(el, "[data-r]").innerHTML = n === 5 ? "<b>Les cinq piliers sont debout : le foyer est démocratique.</b>" : "Piliers debout : <b>" + n + "/5</b>. Il manque : " + R.filter(function (r, k) { return !on[k]; }).map(function (r) { return PILIERS[r[1]].toLowerCase(); }).join(", ") + ".";
    }
    el.querySelectorAll("[data-k]").forEach(function (c) { c.addEventListener("change", maj); }); maj();
  });

  /* passion ou émotion ? */
  VRT_A("tle-philo-passions", 0, "Passion ou émotion ? Classe chaque situation", function (el) {
    var C = [["Mariam sursaute et crie en voyant un serpent dans la cour.", "émotion", "Brusque, brève, provoquée par un objet présent."], ["Depuis deux ans, Ibrahim ne pense qu'à devenir champion de lutte et organise toute sa vie autour.", "passion", "Durable, exclusive, elle oriente toute la vie."], ["Junior parie chaque nuit et ment à ses parents pour se refaire.", "passion", "Exclusive et durable ; la raison est à son service."], ["Ton cœur s'emballe quand on annonce les résultats du bac.", "émotion", "Intense mais passagère."], ["Un commerçant de Mokolo ne vit que pour accumuler de l'argent, au mépris de sa famille.", "passion", "L'avarice est une passion classique."], ["La colère te monte au visage après une injustice, puis retombe.", "émotion", "Une colère passagère ; la haine durable serait une passion."]];
    var i = 0, ok = 0;
    el.innerHTML = "<p class='labo-r' data-q style='font-size:16px'></p><div style='display:flex;gap:8px;flex-wrap:wrap' data-c></div><p class='an-note' data-e></p><p class='labo-r' data-s></p>";
    function poser() {
      var c = C[i];
      $(el, "[data-q]").textContent = (i + 1) + ". " + c[0]; $(el, "[data-e]").textContent = "";
      $(el, "[data-s]").innerHTML = "Situation " + (i + 1) + " sur " + C.length + " · score : <b>" + ok + "</b>";
      $(el, "[data-c]").innerHTML = "<button type='button' class='btn-l' data-v='émotion'>Émotion</button><button type='button' class='btn-l' data-v='passion'>Passion</button>";
      el.querySelectorAll("[data-v]").forEach(function (b) {
        b.addEventListener("click", function () {
          var bon = b.dataset.v === c[1]; if (bon) ok++;
          $(el, "[data-e]").innerHTML = (bon ? "✔ " : "✘ C'est une " + c[1] + ". ") + c[2];
          el.querySelectorAll("[data-v]").forEach(function (x) { x.disabled = true; });
          var nx = document.createElement("button"); nx.type = "button"; nx.className = "btn-l"; nx.textContent = i + 1 < C.length ? "Situation suivante" : "Recommencer";
          nx.addEventListener("click", function () { i = (i + 1) % C.length; if (!i) ok = 0; poser(); });
          $(el, "[data-c]").appendChild(nx);
          $(el, "[data-s]").innerHTML = "Situation " + (i + 1) + " sur " + C.length + " · score : <b>" + ok + "</b>";
        });
      });
    }
    poser();
  });

  /* tribunal de la classe : degré de liberté → responsabilité */
  VRT_A("tle-philo-liberte", 1, "Le tribunal de la classe : juge chaque affaire", function (el) {
    var A = [["Affaire 1 : Paul", "Ses freins ont été sabotés à son insu.", [["Savait-il que les freins étaient sabotés ?", false], ["Était-il menacé ?", false], ["A-t-il choisi de se mettre en danger ?", false]], "Non responsable : il n'a rien choisi de ce qui a causé l'accident."], ["Affaire 2 : Ernest", "Un bandit armé l'a forcé à foncer.", [["Savait-il ce qu'il faisait ?", true], ["Était-il menacé ?", true], ["A-t-il choisi de se mettre en danger ?", false]], "Non responsable pénalement : contrainte irrésistible (arme sur la tempe)."], ["Affaire 3 : Bertrand", "Il a bu six bières avant de conduire.", [["Savait-il ce qu'il faisait au moment de boire ?", true], ["Était-il menacé ?", false], ["A-t-il choisi de se mettre en danger ?", true]], "Responsable : il était libre de ne pas boire ou de ne pas conduire ; l'ivresse volontaire n'excuse pas."]];
    var i = 0;
    el.innerHTML = "<div style='display:flex;gap:6px;flex-wrap:wrap' data-t></div><div data-z style='margin-top:10px'></div>";
    $(el, "[data-t]").innerHTML = A.map(function (a, k) { return "<button type='button' class='btn-l' data-a='" + k + "'>" + a[0] + "</button>"; }).join("");
    function montrer() {
      var a = A[i], h = "<p class='labo-r'><b>" + a[0] + "</b> · " + a[1] + "</p><ol>" + a[2].map(function (x) { return "<li>" + x[0] + " <b>" + (x[1] ? "oui" : "non") + "</b></li>"; }).join("") + "</ol>";
      var lib = a[2][0][1] && !a[2][1][1] ? 1 : a[2][0][1] ? 0.15 : 0;
      h += "<svg viewBox='0 0 640 70' class='an-svg'><rect x='20' y='26' width='600' height='18' rx='9' fill='#EEF1F6'/><rect x='20' y='26' width='" + (600 * lib) + "' height='18' rx='9' fill='" + (lib > 0.5 ? ROUGE : "#F2994A") + "'/>" + txt(20, 18, "Liberté au moment décisif → responsabilité", { s: 12, a: "start", c: GRIS }) + txt(620, 64, lib > 0.5 ? "responsable" : "non responsable", { s: 12, a: "end", c: lib > 0.5 ? ROUGE : VERT }) + "</svg><p class='an-note'>" + a[3] + "</p>";
      $(el, "[data-z]").innerHTML = h;
      el.querySelectorAll("[data-a]").forEach(function (b) { b.setAttribute("aria-pressed", +b.dataset.a === i); });
    }
    el.querySelectorAll("[data-a]").forEach(function (b) { b.addEventListener("click", function () { i = +b.dataset.a; montrer(); }); });
    montrer();
  });
})();
