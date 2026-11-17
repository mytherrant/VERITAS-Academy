/* Leçons APPROFONDIES — lot 6, classes d'examen (17/11/2026) : présentation du Cameroun et Cameroun allemand (3e),
   subordonnée relative (3e), gestion du temps en classe d'examen (Tle). Même gabarit et même mécanisme que
   11-approfondies-lot4.js (remplacement EN PLACE ; ordre, clé, fiche APC, examen et scènes conservés). Couleurs des
   planches proches des objets réels. Simulations VRT_A en fin de fichier. */
(function () {
  "use strict";
  var NUIT = "#001136", BLEU = "#1E499B", GRIS = "#4D5163", VERT = "#17784D";

  function txt(x, y, t, o) {
    o = o || {};
    return "<text x='" + x + "' y='" + y + "' text-anchor='" + (o.a || "middle") + "' font-size='" + (o.s || 12) + "' font-weight='" + (o.w || 700) + "' fill='" + (o.c || NUIT) + "'" + (o.i ? " font-style='italic'" : "") + (o.halo ? " stroke='#fff' stroke-width='3' paint-order='stroke'" : "") + ">" + t + "</text>";
  }
  function lin(id, cs, vertical) {
    var s = "<linearGradient id='" + id + "'" + (vertical ? " x1='0' y1='0' x2='0' y2='1'" : "") + ">";
    cs.forEach(function (c, i) { s += "<stop offset='" + (i / (cs.length - 1)).toFixed(2) + "' stop-color='" + c + "'/>"; });
    return s + "</linearGradient>";
  }
  function rad(id, cs) {
    var s = "<radialGradient id='" + id + "' cx='35%' cy='30%' r='75%'>";
    cs.forEach(function (c, i) { s += "<stop offset='" + (i / (cs.length - 1)).toFixed(2) + "' stop-color='" + c + "'/>"; });
    return s + "</radialGradient>";
  }
  function omb(id) { return "<radialGradient id='" + id + "'><stop offset='0' stop-color='#001136' stop-opacity='.3'/><stop offset='1' stop-color='#001136' stop-opacity='0'/></radialGradient>"; }
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

  /* ═══════════════════════ 3e GÉOGRAPHIE — PRÉSENTATION GÉNÉRALE DU CAMEROUN ═══════════════════════ */
  /* contour simplifié (longitude, latitude) : carte scolaire, échelle approximative */
  var CMR = [[8.6, 4.6], [9.3, 6.0], [10.1, 6.9], [11.1, 6.5], [11.8, 7.1], [12.3, 8.4], [13.0, 9.4], [13.6, 10.2], [14.1, 11.2], [14.6, 12.0], [14.1, 13.0], [14.6, 13.1], [15.0, 12.0], [15.1, 10.8], [15.6, 10.0], [14.4, 9.9], [14.9, 8.7], [15.5, 7.5], [14.6, 6.3], [14.5, 5.0], [15.0, 4.1], [16.1, 3.0], [16.2, 2.2], [15.0, 1.9], [13.3, 2.2], [11.3, 2.2], [9.8, 2.3], [9.8, 3.0], [9.5, 3.9], [9.0, 4.0]];
  var VILLES = [["Yaoundé", 11.5, 3.87, "plateau sud-camerounais", "forêt dense, climat équatorial à 4 saisons", 730, 1600], ["Douala", 9.7, 4.05, "plaine côtière", "mangrove, climat équatorial très humide", 13, 4000], ["Buea", 9.24, 4.15, "hautes terres de l'Ouest", "pentes du mont Cameroun, climat de montagne", 900, 2800], ["Bafoussam", 10.42, 5.48, "hautes terres de l'Ouest", "volcans, sols fertiles, climat tempéré par l'altitude", 1450, 1800], ["Ngaoundéré", 13.58, 7.32, "plateau de l'Adamaoua", "château d'eau, savane d'altitude", 1100, 1500], ["Garoua", 13.4, 9.3, "basses terres du Nord", "savane, climat tropical à 2 saisons", 240, 1000], ["Maroua", 14.32, 10.6, "basses terres du Nord", "steppe sahélienne, longue saison sèche", 420, 800], ["Kousséri", 15.03, 12.08, "plaine du lac Tchad", "Sahel, climat chaud et sec", 300, 600], ["Ebolowa", 11.15, 2.9, "plateau sud-camerounais", "forêt dense, climat équatorial", 600, 1700], ["Bertoua", 13.68, 4.58, "plateau sud-camerounais", "forêt et savane, climat équatorial", 670, 1500]];
  function carte(id, X, Y, opt) {
    opt = opt || {};
    var pts = CMR.map(function (p) { return X(p[0]).toFixed(1) + " " + Y(p[1]).toFixed(1); }).join("L"), s = "";
    s += "<clipPath id='" + id + "cl'><path d='M" + pts + "Z'/></clipPath>";
    s += "<path d='M" + pts + "Z' fill='#000' opacity='.12' transform='translate(4 5)'/>";
    s += "<g clip-path='url(#" + id + "cl)'>";
    [[1.5, 5.9, "#2E6B34"], [5.9, 7.0, "#7E9D57"], [7.0, 8.3, "#A9B46A"], [8.3, 10.9, "#CDBB78"], [10.9, 13.4, "#E6D6A2"]].forEach(function (b) { s += "<rect x='0' y='" + Y(b[1]) + "' width='2000' height='" + (Y(b[0]) - Y(b[1])) + "' fill='" + b[2] + "'/>"; });
    s += "<ellipse cx='" + X(10.3) + "' cy='" + Y(5.8) + "' rx='" + (X(11.3) - X(10.3)) + "' ry='" + (Y(5.0) - Y(5.8) + 6) + "' fill='#5F7F45'/>";
    s += "<ellipse cx='" + X(9.3) + "' cy='" + Y(4.0) + "' rx='" + (X(9.8) - X(9.3)) + "' ry='" + (Y(3.6) - Y(4.0) + 4) + "' fill='#3D7A5C'/>";
    s += "<ellipse cx='" + X(13.8) + "' cy='" + Y(10.6) + "' rx='" + (X(14.2) - X(13.8)) + "' ry='" + (Y(10.0) - Y(10.6) + 8) + "' fill='#B49B66'/>";
    s += "</g><path d='M" + pts + "Z' fill='none' stroke='#5B3A1A' stroke-width='2' stroke-linejoin='round'/>";
    s += "<path d='M" + X(14.1) + " " + Y(13.0) + "q10 -14 26 -8q8 10 -6 18Z' fill='#5BA3D9' stroke='#2F6DB5'/>";
    s += "<path d='M" + X(9.17) + " " + Y(4.45) + "l5 -9l5 9Z' fill='#6B4423'/>";
    if (opt.villes !== false) VILLES.forEach(function (v) {
      var cap = v[0] === "Yaoundé" || v[0] === "Douala";
      var g = v[0] === "Buea";
      s += "<circle cx='" + X(v[1]) + "' cy='" + Y(v[2]) + "' r='" + (cap ? 5 : 3.5) + "' fill='" + (cap ? "#C62828" : NUIT) + "' stroke='#fff' stroke-width='1.5'/>" + txt(X(v[1]) + (g ? -7 : 7), Y(v[2]) + (g ? -5 : 4), v[0], { s: cap ? 12 : 10.5, a: g ? "end" : "start", halo: true });
    });
    return s;
  }
  var PLANCHE_CARTE = (function () {
    var id = "gc1", X = function (l) { return 150 + (l - 8) * 46; }, Y = function (l) { return 520 - (l - 1.5) * 42; };
    var s = "<rect width='640' height='540' fill='#DCEBF5'/><path d='M0 380L120 360L150 420L120 540H0Z' fill='#BFDDF2'/>" + txt(60, 470, "Océan", { s: 13, c: "#2F6DB5", i: true }) + txt(60, 486, "Atlantique", { s: 13, c: "#2F6DB5", i: true });
    s += "<rect x='0' y='0' width='640' height='540' fill='#EFE8DA' opacity='.0'/>";
    s += carte(id, X, Y);
    [["NIGERIA", 9.0, 9.0], ["TCHAD", 16.0, 11.0], ["RCA", 16.4, 6.0], ["CONGO", 16.6, 1.75], ["GABON", 11.6, 1.6], ["GUINÉE ÉQ.", 9.0, 1.8]].forEach(function (p) { s += txt(X(p[1]), Y(p[2]), p[0], { s: 12, c: "#7A6A55", w: 600 }); });
    s += txt(X(14.4), Y(13.35), "lac Tchad", { s: 10.5, c: "#2F6DB5", a: "end", i: true }) + txt(X(9.05), Y(4.75), "mont Cameroun 4 095 m", { s: 10, a: "end", halo: true, c: "#6B4423" });
    [["#2E6B34", "forêt dense"], ["#3D7A5C", "plaine côtière, mangrove"], ["#5F7F45", "hautes terres de l'Ouest"], ["#A9B46A", "plateau de l'Adamaoua"], ["#CDBB78", "savane du Nord"], ["#E6D6A2", "Sahel"]].forEach(function (l, i) { s += "<rect x='22' y='" + (24 + i * 22) + "' width='16' height='14' rx='3' fill='" + l[0] + "'/>" + txt(44, 36 + i * 22, l[1], { s: 11, a: "start", w: 600 }); });
    s += "<g transform='translate(560 40)'><path d='M0 -22L7 0H-7Z' fill='" + NUIT + "'/><path d='M0 22L7 0H-7Z' fill='#fff' stroke='" + NUIT + "'/>" + txt(0, -26, "N", { s: 12 }) + "</g>";
    s += "<path d='M22 176h92' stroke='" + NUIT + "' stroke-width='3'/>" + txt(68, 168, "≈ 200 km", { s: 10.5 });
    return svg(640, 540, "Carte simplifiée du Cameroun : régions naturelles en couleurs, de la forêt du Sud au Sahel du Nord, principales villes et pays voisins", "", s);
  })();
  function relief3D() {
    /* bloc-diagramme sud-nord : chaque tranche = 0,5° de latitude ; hauteur = altitude moyenne exagérée */
    var o = [], P = [[2.5, 600, "#2E6B34"], [3.0, 650, "#2E6B34"], [3.5, 700, "#2E6B34"], [4.0, 60, "#3D7A5C"], [4.5, 300, "#3D7A5C"], [5.0, 1200, "#5F7F45"], [5.5, 1500, "#5F7F45"], [6.0, 1300, "#5F7F45"], [6.5, 1000, "#7E9D57"], [7.0, 1200, "#A9B46A"], [7.5, 1150, "#A9B46A"], [8.0, 900, "#A9B46A"], [8.5, 400, "#CDBB78"], [9.0, 250, "#CDBB78"], [9.5, 300, "#CDBB78"], [10.0, 450, "#CDBB78"], [10.5, 900, "#B49B66"], [11.0, 500, "#E6D6A2"], [11.5, 350, "#E6D6A2"], [12.0, 320, "#E6D6A2"], [12.5, 290, "#E6D6A2"]], k;
    P.forEach(function (p, i) { var h = 8 + p[1] / 16; o.push({ f: "boite", c: [-250 + i * 25, 0, 0], d: [25, h, 120], coul: "#8D6E4C", dessus: p[2], div: false }); });
    o.push({ f: "cone", c: [-250 + 3.6 * 25, 0, -30], r: 46, h: 8 + 4095 / 16, n: 22, coul: "#5D4A36" });
    o.push({ f: "boite", c: [-280, 0, 0], d: [30, 2, 120], coul: "#2F6DB5", dessus: "#4C8AD0", div: false });
    o.push({ f: "boite", c: [270, 0, 0], d: [30, 6, 120], coul: "#2F6DB5", dessus: "#5BA3D9", div: false });
    for (k = 0; k < 18; k++) o.push({ f: "sphere", c: [-245 + (k % 6) * 12, 54 + (k % 3) * 2, -50 + Math.floor(k / 6) * 45], r: 6, coul: "#1F5A25" });
    return o;
  }
  var GC_OLD = ancien("3e-geo-cameroun");
  remplacer("3e-geo-cameroun", {
    c: "3e", m: "geo", titre: "Présentation générale du Cameroun", duree: 35,
    accroche: "« Pourquoi dit-on que le Cameroun est l'Afrique en miniature ? » Un correspondant ivoirien attend ta réponse.",
    intro: "La lettre d'un correspondant te sert de fil rouge : à chaque partie, un indice t'aide à trancher entre trois explications.",
    objectifs: ["situer le Cameroun et nommer ses voisins", "donner ses chiffres clés", "nommer et localiser les grandes régions naturelles", "expliquer l'expression « Afrique en miniature » par la diversité des milieux"],
    enquete: {
      titre: "La lettre de Yao, correspondant d'Abidjan",
      svg: (function () { var X = function (l) { return 360 + (l - 8) * 22; }, Y = function (l) { return 215 - (l - 1.5) * 18; }; return svg(640, 230, "Une lettre posée à côté d une petite carte du Cameroun en couleurs", "", "<rect width='640' height='230' fill='#F6F1E6'/><g transform='rotate(-4 160 115)'><rect x='40' y='24' width='240' height='180' rx='6' fill='#fff' stroke='#D9CFBC'/><path d='M60 60h190M60 84h200M60 108h180M60 132h196M60 156h120' stroke='#C9D2E3' stroke-width='3' stroke-linecap='round'/>" + txt(60, 46, "Abidjan, le 3 octobre", { s: 11, a: "start", c: GRIS, i: true }) + txt(60, 188, "Yao", { s: 13, a: "start", c: BLEU, i: true }) + "</g>" + carte("gcsc", X, Y, { villes: false })); })(),
      legende: "Au collège de Kribi : la lettre de Yao, élève de 3e à Abidjan, arrive par le club des correspondants.",
      contexte: "<p>Ta classe de 3e correspond avec un collège d'Abidjan. Yao écrit : « Notre professeur dit que ton pays est l'<strong>Afrique en miniature</strong>. Est-ce parce que le Cameroun a la forme de l'Afrique ? Ou parce qu'il est au centre du continent ? Raconte-moi ton pays. »</p><p>Ton professeur te demande de répondre avec une carte, des chiffres et des exemples de paysages, du littoral de Kribi jusqu'au lac Tchad.</p>",
      documents: [{ t: "Pluies et altitudes de quelques villes", html: "<table class='donnees'><tr><th>Ville</th><th>Altitude (m)</th><th>Pluies (mm/an, environ)</th></tr><tr><td>Debundscha (pied du mont Cameroun)</td><td>10</td><td>10 000</td></tr><tr><td>Douala</td><td>13</td><td>4 000</td></tr><tr><td>Yaoundé</td><td>730</td><td>1 600</td></tr><tr><td>Ngaoundéré</td><td>1 100</td><td>1 500</td></tr><tr><td>Garoua</td><td>240</td><td>1 000</td></tr><tr><td>Maroua</td><td>420</td><td>800</td></tr><tr><td>Kousséri</td><td>300</td><td>600</td></tr></table>" }],
      question: "Pourquoi le Cameroun est-il surnommé « l'Afrique en miniature » ?",
      tache: "Rédige pour Yao une réponse de dix lignes, appuyée sur la carte et sur le document.",
      hypotheses: ["Parce que le Cameroun a la forme du continent africain.", "Parce que le Cameroun est situé au centre exact de l'Afrique.", "Parce qu'on y trouve presque tous les milieux naturels du continent, de la mer et de la forêt jusqu'au Sahel."]
    },
    parties: [
      { t: "Situation et limites", html: partie(GC_OLD, 0) +
        "<div class='methode'><b>Situer un pays</b><ol><li>Le continent et la région (Afrique centrale).</li><li>Les repères (golfe de Guinée, latitudes 2° à 13° N).</li><li>Les voisins, en tournant dans le sens des aiguilles d'une montre.</li></ol></div>",
        planches: [{ type: "2D", titre: "Le Cameroun et ses voisins", legende: "Carte simplifiée : du sud au nord, la forêt dense (vert foncé), les hautes terres de l'Ouest, le plateau de l'Adamaoua, la savane puis le Sahel jusqu'au lac Tchad. Six pays voisins et une façade sur l'océan Atlantique.", svg: PLANCHE_CARTE }],
        fil: { html: "<p>Le Cameroun s'étire sur plus de 1 200 km, du 2ᵉ au 13ᵉ degré de latitude Nord : de l'équateur presque jusqu'au Sahara. Il est en Afrique centrale, mais pas « au centre exact » du continent ; et sa forme, un triangle allongé, ne ressemble que vaguement à l'Afrique.</p>", verdicts: [[1, "rejetee", "Le Cameroun est en Afrique centrale, au fond du golfe de Guinée, pas au centre exact du continent."], [0, "rejetee", "La ressemblance de forme est une curiosité, pas l'explication donnée par les géographes."]] },
        retenir: "Six voisins et une façade maritime sur l'Atlantique ; du 2ᵉ au 13ᵉ degré Nord." },
      { t: "Chiffres clés", html: partie(GC_OLD, 1) +
        "<div class='savais'><b>Pour comparer</b>475 650 km², c'est un peu moins que la superficie de la Côte d'Ivoire et du Ghana réunis (environ 560 000 km²).</div>",
        retenir: "Deux langues officielles, dix régions, deux grandes métropoles." },
      { t: "Les grandes régions naturelles", html: partie(GC_OLD, 2) +
        "<div class='prop'><b>Un gradient du sud au nord</b>Plus on monte vers le nord, moins il pleut : d'environ 4 000 mm à Douala à 600 mm à Kousséri ; la forêt laisse place à la savane, puis à la steppe sahélienne. Le relief (hautes terres, Adamaoua) ajoute des milieux de montagne.</div>",
        planches: [
          { type: "3d", titre: "Bloc-diagramme du sud au nord", legende: "Tourne le bloc : à gauche, la forêt du Sud ; puis la plaine côtière, les hautes terres de l'Ouest et le cône du mont Cameroun ; le plateau de l'Adamaoua ; la savane du Nord, les monts Mandara et le Sahel jusqu'au lac Tchad (à droite). Altitudes très exagérées.",
            modele: { h: 360, rx: -26, ry: -34, echelle: 0.72, alt: "Bloc-diagramme du relief camerounais en trois dimensions, du sud au nord", objets: relief3D(),
              etiquettes: [{ p: [-245, 70, 0], t: "Forêt du Sud" }, { p: [-160, 264, -30], t: "Mont Cameroun" }, { p: [-25, 84, 0], t: "Adamaoua", cote: "d" }, { p: [270, 10, 0], t: "Lac Tchad", cote: "d" }] } },
          { type: "2D", titre: "Moins de pluie vers le nord", legende: "Pluies annuelles moyennes (document) : de 10 000 mm au pied du mont Cameroun, l'un des lieux les plus arrosés du monde, à 600 mm à Kousséri.", svg: (function () {
            var D = [["Debundscha", 10000, "#2E6B34"], ["Douala", 4000, "#3D7A5C"], ["Yaoundé", 1600, "#2E6B34"], ["Ngaoundéré", 1500, "#A9B46A"], ["Garoua", 1000, "#CDBB78"], ["Maroua", 800, "#CDBB78"], ["Kousséri", 600, "#D9C48C"]], s = "";
            D.forEach(function (d, i) { var h = d[1] / 10000 * 220, x = 60 + i * 82; s += "<rect x='" + x + "' y='" + (260 - h) + "' width='52' height='" + h + "' rx='5' fill='" + d[2] + "'/>" + txt(x + 26, 252 - h, d[1].toLocaleString("fr-FR"), { s: 11.5 }) + txt(x + 26, 278, d[0], { s: 11, w: 600 }); });
            s += "<path d='M40 260H620' stroke='" + NUIT + "' stroke-width='1.5'/>" + txt(40, 24, "mm de pluie par an", { s: 11.5, a: "start", c: GRIS }) + "<path d='M70 300H610' stroke='#C2540A' stroke-width='2' marker-end='url(#gc3f)'/>" + txt(340, 296, "du sud vers le nord", { s: 11.5, c: "#C2540A" });
            return svg(640, 310, "Diagramme en barres : les pluies diminuent du sud au nord du Cameroun", fleche("gc3f", "#C2540A"), s);
          })() }
        ],
        fil: { html: "<p>Mangrove de Douala, forêt dense d'Ebolowa, volcans de l'Ouest, savane d'altitude de l'Adamaoua, savane et steppe du Nord, rives sahéliennes du lac Tchad : presque tous les milieux de l'Afrique tropicale sont réunis dans un seul pays, d'où le surnom.</p>", verdicts: [[2, "validee", "La diversité des milieux, de la mer au Sahel, explique « l'Afrique en miniature »."]] },
        retenir: "Cinq grands ensembles naturels, une diversité qui fait la richesse du pays." }
    ],
    denouement: {
      titre: "L'Afrique en miniature : la diversité des milieux",
      etapes: ["Du 2ᵉ au 13ᵉ degré Nord, de la mer jusqu'au lac Tchad (indice 1).", "475 650 km², 10 régions, deux langues officielles (indice 2).", "Forêt, mangrove, montagnes, plateau, savane, Sahel ; pluies de 10 000 à 600 mm (indice 3)."],
      reponse: "<p>Cher Yao, le Cameroun est un pays d'Afrique centrale, au fond du golfe de Guinée, voisin du Nigeria, du Tchad, de la Centrafrique, du Congo, du Gabon et de la Guinée équatoriale. Il couvre environ 475 650 km², compte 10 régions et deux langues officielles. Si on l'appelle « l'Afrique en miniature », ce n'est ni pour sa forme ni parce qu'il serait au centre du continent : c'est parce qu'il s'étire de l'océan Atlantique jusqu'au lac Tchad et réunit presque tous les milieux africains. Au sud, la mangrove de Douala et la forêt dense, où il pleut jusqu'à 4 000 mm par an ; à l'ouest, les volcans et le mont Cameroun ; au centre, le plateau de l'Adamaoua, château d'eau du pays ; au nord, la savane puis le Sahel, où il ne tombe plus que 600 mm de pluie.</p>",
      transfert: "<p>Un touriste n'a qu'une semaine pour « voir toute l'Afrique » au Cameroun. Propose-lui un itinéraire de quatre étapes, du sud au nord, en nommant le milieu naturel de chaque étape.</p>"
    },
    revision: (GC_OLD ? GC_OLD.revision : []).concat(["Pluies : de 4 000 mm (Douala) à 600 mm (Kousséri) ; 10 000 mm au pied du mont Cameroun.", "« Afrique en miniature » : diversité des milieux naturels."]),
    exo: GC_OLD ? GC_OLD.exo : "",
    quiz: [
      q("Quelle est la capitale économique ?", "Douala", "Yaoundé", "Garoua", "Yaoundé est la capitale politique."),
      q("Combien de régions compte le Cameroun ?", "10", "8", "12", "Dix régions administratives."),
      q("Quel plateau est appelé « château d'eau » ?", "l'Adamaoua", "le plateau sud", "la plaine côtière", "De nombreux fleuves y prennent leur source."),
      q("Le Cameroun s'ouvre sur…", "l'océan Atlantique", "l'océan Indien", "la mer Rouge", "Au fond du golfe de Guinée."),
      q("Combien de pays voisins ?", "6", "4", "8", "Nigeria, Tchad, RCA, Congo, Gabon, Guinée équatoriale."),
      q("Superficie du Cameroun :", "environ 475 650 km²", "environ 47 500 km²", "environ 4 millions de km²", "Un peu moins que Côte d'Ivoire + Ghana."),
      q("Où pleut-il le moins ?", "à Kousséri", "à Douala", "à Yaoundé", "Environ 600 mm par an."),
      q("Le mont Cameroun culmine à environ…", "4 095 m", "1 095 m", "8 000 m", "Plus haut sommet d'Afrique de l'Ouest et du Centre."),
      q("« Afrique en miniature » s'explique par…", "la diversité des milieux naturels", "la forme du pays", "sa position au centre exact de l'Afrique", "De la mer au Sahel."),
      q("Le Sahel camerounais se trouve…", "au nord, près du lac Tchad", "au sud, près de Kribi", "à l'ouest, près de Bafoussam", "Climat chaud et sec.")
    ]
  });

  /* ═══════════════════════ 3e HISTOIRE — LE CAMEROUN ALLEMAND ═══════════════════════ */
  var HK_OLD = ancien("3e-hist-kamerun");
  function train3D() {
    var o = [], k;
    o.push({ f: "boite", c: [0, -10, 0], d: [600, 8, 220], coul: "#6E5B3E", dessus: "#8A7350" });
    for (k = 0; k < 24; k++) o.push({ f: "boite", c: [-276 + k * 24, -4, 0], d: [8, 4, 70], coul: "#5A3E26", dessus: "#6B4A2D", div: false });
    [-22, 22].forEach(function (z) { o.push({ f: "boite", c: [0, 0, z], d: [580, 3, 4], coul: "#8E96A6", dessus: "#C9CED6", div: false }); });
    /* locomotive à vapeur */
    o.push({ f: "cylindre", c: [-200, 26, 0], r: 22, h: 110, n: 20, axe: "x", coul: "#1F2328", dessus: "#2C3138" });
    o.push({ f: "boite", c: [-80, 4, 0], d: [44, 70, 54], coul: "#2C3138", dessus: "#3A4048", div: false });
    o.push({ f: "boite", c: [-80, 74, 0], d: [54, 6, 62], coul: "#7A1F1F", dessus: "#8E2A2A", div: false });
    o.push({ f: "cylindre", c: [-185, 48, 0], r: 7, r2: 10, h: 34, n: 14, coul: "#1F2328" });
    o.push({ f: "cylindre", c: [-150, 48, 0], r: 8, h: 12, n: 14, coul: "#B08D57", dessus: "#D2B07A" });
    [-190, -150, -110].forEach(function (x) { [-26, 26].forEach(function (z) { o.push({ f: "cylindre", c: [x, 14, z], r: 14, h: 4, n: 18, axe: "z", coul: "#7A1F1F" }); }); });
    for (k = 0; k < 6; k++) o.push({ f: "sphere", c: [-185 + k * 4, 96 + k * 16, -k * 3], r: 10 + k * 3, coul: "#E9ECEF", op: 0.55 - k * 0.06 });
    /* deux wagons de sacs de cacao */
    [20, 140].forEach(function (x) {
      o.push({ f: "boite", c: [x, 6, 0], d: [100, 30, 56], coul: "#6B4A2D", dessus: "#7C5836", div: false });
      [[-30, -14], [0, -14], [30, -14], [-30, 14], [0, 14], [30, 14], [-15, 0], [15, 0]].forEach(function (p, i) { o.push({ f: "sphere", c: [x + p[0], 44 + (i > 5 ? 14 : 0), p[1]], r: [16, 9, 12], n: 12, m: 7, coul: "#C9B28A" }); });
      [-34, 34].forEach(function (dx) { [-26, 26].forEach(function (z) { o.push({ f: "cylindre", c: [x + dx, 10, z], r: 10, h: 4, n: 16, axe: "z", coul: "#3A4048" }); }); });
    });
    o.push({ f: "boite", c: [250, 0, -80], d: [60, 40, 40], coul: "#E6D8BE", dessus: "#B33A2C", div: false });
    return o;
  }
  var PLANCHE_RAILS = (function () {
    var X = function (l) { return 40 + (l - 8.4) * 150; }, Y = function (l) { return 360 - (l - 2.6) * 120; }, s = "<rect width='640' height='380' fill='#DCEBF5'/>";
    s += "<path d='M0 260L60 250L120 330L80 380H0Z' fill='#BFDDF2'/>";
    s += "<path d='M" + X(8.6) + " " + Y(4.6) + "L" + X(9.3) + " " + Y(6.0) + "L" + X(10.1) + " " + Y(6.9) + "L" + X(11.1) + " " + Y(6.5) + "L" + X(11.8) + " " + Y(7.1) + "L640 0V380H" + X(9.8) + "L" + X(9.8) + " " + Y(3.0) + "L" + X(9.5) + " " + Y(3.9) + "L" + X(9.0) + " " + Y(4.0) + "Z' fill='#D9E3C3' stroke='#5B3A1A' stroke-width='1.5'/>";
    s += "<path d='M" + X(9.3) + " " + Y(4.3) + "l9 -16l9 16Z' fill='#6B4423'/>";
    function rail(pts, c) { var d = "M" + pts.map(function (p) { return X(p[0]).toFixed(1) + " " + Y(p[1]).toFixed(1); }).join("L"); return "<path d='" + d + "' fill='none' stroke='" + c + "' stroke-width='5' stroke-linecap='round'/><path d='" + d + "' fill='none' stroke='#fff' stroke-width='2' stroke-dasharray='5 6'/>"; }
    s += rail([[9.66, 4.06], [9.78, 4.4], [9.85, 4.75], [9.93, 4.95]], "#7A1F1F");
    s += rail([[9.72, 4.04], [10.1, 3.8], [10.5, 3.65], [10.75, 3.65]], "#1E499B");
    [["Douala / Bonabéri", 9.7, 4.05], ["Nkongsamba", 9.93, 4.95], ["Eséka", 10.75, 3.65], ["Buea", 9.24, 4.15], ["Yaoundé", 11.5, 3.87], ["Kribi", 9.91, 2.94]].forEach(function (v) { s += "<circle cx='" + X(v[1]) + "' cy='" + Y(v[2]) + "' r='4.5' fill='" + NUIT + "' stroke='#fff' stroke-width='1.5'/>" + txt(X(v[1]) + 8, Y(v[2]) + 4, v[0], { s: 11.5, a: "start", halo: true }); });
    s += "<g transform='translate(400 240)'><rect width='220' height='92' rx='10' fill='#fff' fill-opacity='.93' stroke='#C9D2E3'/><path d='M16 26h40' stroke='#7A1F1F' stroke-width='5'/>" + txt(64, 30, "chemin de fer du Nord", { s: 11.5, a: "start" }) + txt(64, 46, "160 km, achevé en 1911", { s: 10.5, a: "start", w: 500, c: GRIS }) + "<path d='M16 66h40' stroke='#1E499B' stroke-width='5'/>" + txt(64, 70, "chemin de fer du Centre", { s: 11.5, a: "start" }) + txt(64, 86, "vers Eséka, à la veille de 1914", { s: 10.5, a: "start", w: 500, c: GRIS }) + "</g>";
    return svg(640, 380, "Carte du littoral camerounais avec les deux voies ferrées allemandes partant de Douala : vers Nkongsamba au nord et vers Eséka à l est", "", s);
  })();
  remplacer("3e-hist-kamerun", {
    c: "3e", m: "histoire", titre: "Le Cameroun allemand (1884-1916)", duree: 35,
    accroche: "Devant la Pagode de Douala, deux élèves s'opposent : « Les Allemands ont modernisé le pays ! » — « Ils l'ont pillé ! »",
    intro: "Une sortie de classe à Douala te sert de fil rouge : à chaque partie, un document t'aide à trancher entre trois jugements.",
    objectifs: ["dater et expliquer la naissance du protectorat", "décrire l'exploitation allemande et ses infrastructures", "présenter les résistances et la fin de la colonie", "porter un jugement nuancé, appuyé sur des faits"],
    enquete: {
      titre: "La sortie de classe à Bonanjo",
      svg: (function () {
        var s = "<rect width='640' height='220' fill='#EEF4F8'/><rect y='176' width='640' height='44' fill='#C9C1B2'/>";
        s += "<rect x='90' y='96' width='200' height='80' fill='#E9DCC4' stroke='#8A6E4B'/><path d='M80 98L190 50L300 98Z' fill='#B33A2C'/><path d='M150 60L190 26L230 60Z' fill='#B33A2C'/><rect x='170' y='60' width='40' height='36' fill='#E9DCC4' stroke='#8A6E4B'/>";
        for (var i = 0; i < 5; i++) s += "<rect x='" + (104 + i * 38) + "' y='112' width='18' height='30' rx='9' fill='#5C4630'/>";
        s += txt(190, 198, "la Pagode, palais des rois Bell (1905)", { s: 11.5, c: GRIS, w: 600 });
        s += "<path d='M360 176V120' stroke='#2C3138' stroke-width='5'/><rect x='340' y='104' width='60' height='18' rx='4' fill='#2C3138'/>" + txt(370, 117, "1884", { s: 11, c: "#FFD54A" });
        s += "<g transform='translate(470 120)'><circle cx='-30' r='9' fill='#6B4423'/><path d='M-30 9v34' stroke='#2E6FB0' stroke-width='12'/><circle cx='30' r='9' fill='#5A3A1E'/><path d='M30 9v34' stroke='#C62828' stroke-width='12'/><rect x='-80' y='-60' width='120' height='30' rx='10' fill='#fff' stroke='#C9D2E3'/>" + txt(-20, -40, "Ils ont modernisé !", { s: 11 }) + "<rect x='0' y='-96' width='120' height='30' rx='10' fill='#fff' stroke='#C9D2E3'/>" + txt(60, -76, "Ils ont pillé !", { s: 11 }) + "</g>";
        return svg(640, 220, "Deux élèves se disputent devant la Pagode, ancien palais des rois Bell à Douala", "", s);
      })(),
      legende: "À Douala, quartier Bonanjo : la classe de 3e visite les lieux de mémoire du Kamerun.",
      contexte: "<p>Pendant une sortie à Bonanjo, la classe découvre la <strong>Pagode</strong>, palais construit en 1905 pour la famille royale Bell, puis la gare de Bonabéri, départ de l'ancien chemin de fer du Nord. Kevin s'enthousiasme : « Sans les Allemands, il n'y aurait ni rails ni ports : ils ont modernisé le Cameroun ! » Grace proteste : « Ils ont pris les terres et fait travailler les gens de force. Ils ont même pendu Rudolf Duala Manga Bell ! »</p><p>Le professeur demande à chacun de dépasser l'opinion et de juger à partir des faits.</p>",
      documents: [
        { t: "Le traité du 12 juillet 1884 (extrait des conditions douala)", html: "<p>« Les terrains cultivés par nous et les emplacements sur lesquels se trouvent les villages doivent rester la propriété des possesseurs actuels et de leurs descendants. »</p>" },
        { t: "Le témoignage d'un administrateur (1913)", html: "<p>« Sur les chantiers du chemin de fer et dans les plantations, la main-d'œuvre est recrutée de force dans les villages ; la mortalité y est très élevée. »</p>" }
      ],
      question: "Le Kamerun allemand fut-il une œuvre de modernisation ou d'oppression ?",
      tache: "Rédige un paragraphe argumenté de dix lignes qui tranche le débat entre Kevin et Grace, chaque argument appuyé sur un fait daté.",
      hypotheses: ["Les Allemands ont apporté le progrès au Cameroun, sans contrepartie pour les populations (Kevin).", "Les Allemands n'ont rien construit d'utile au Cameroun.", "Les Allemands ont construit des infrastructures réelles, mais par le travail forcé, l'expropriation et la répression des résistances."]
    },
    parties: [
      { t: "La naissance du Kamerun", html: partie(HK_OLD, 0),
        planches: [{ type: "2D", titre: "Du traité à la fin du Kamerun", legende: "Frise chronologique : 1884, traité germano-douala ; 1901, la capitale passe à Buea ; 1911, chemin de fer du Nord achevé et Neukamerun ; 1914, exécutions de Manga Bell et Samba ; 1916, départ des Allemands.", svg: (function () {
          var E = [[1884, "Traité germano-douala", "12 juillet"], [1901, "Capitale à Buea", ""], [1911, "Rail du Nord, Neukamerun", ""], [1914, "Manga Bell et Samba exécutés", "août 1914"], [1916, "Fin du Kamerun", "février"]], X = function (a) { return 50 + (a - 1884) / 32 * 540; }, s = "";
          s += "<rect x='40' y='118' width='560' height='14' rx='7' fill='url(#hkf)'/>";
          for (var a = 1884; a <= 1916; a += 4) s += "<path d='M" + X(a) + " 132v8' stroke='" + NUIT + "'/>" + txt(X(a), 154, a, { s: 10.5, w: 500, c: GRIS });
          var NIV = [70, 196, 70, 236, 26];
          E.forEach(function (e, i) { var x = X(e[0]), y = NIV[i], up = y < 125, bx = Math.max(6, Math.min(634 - 200, x - 100)); s += "<path d='M" + x + " 125V" + (up ? y + 18 : y - 22) + "' stroke='" + NUIT + "' stroke-width='1.5'/><circle cx='" + x + "' cy='125' r='8' fill='#FFD54A' stroke='#7A4A00' stroke-width='2'/><rect x='" + bx + "' y='" + (y - 22) + "' width='200' height='" + (e[2] ? 40 : 28) + "' rx='9' fill='#fff' stroke='#D9CFBC'/>" + txt(bx + 100, y - 4, e[0] + " · " + e[1], { s: 10.5 }) + (e[2] ? txt(bx + 100, y + 12, e[2], { s: 10, w: 500, c: GRIS }) : ""); });
          return svg(640, 270, "Frise chronologique du Cameroun allemand de 1884 à 1916", lin("hkf", ["#2C3138", "#7A1F1F", "#B33A2C"]), s);
        })() }],
        fil: { html: "<p>Le document 1 montre que les chefs douala n'ont pas « donné » leur pays : ils ont posé des conditions, dont la conservation de leurs terres. Le protectorat repose donc sur un accord que l'Allemagne va bientôt trahir.</p>" },
        retenir: "12 juillet 1884 : traité germano-douala ; 14 juillet : drapeau hissé par Nachtigal." },
      { t: "Exploiter le territoire", html: partie(HK_OLD, 1),
        planches: [
          { type: "2D", titre: "Les chemins de fer allemands", legende: "Deux lignes partent de la côte : celle du Nord (Bonabéri-Nkongsamba, 160 km, achevée en 1911) et celle du Centre (vers Eséka). Elles servent d'abord à évacuer les produits des plantations vers le port.", svg: PLANCHE_RAILS },
          { type: "3d", titre: "Un train du chemin de fer du Nord", legende: "Tourne le convoi : une locomotive à vapeur et deux wagons chargés de sacs de cacao, sur des traverses en bois. Ces voies ont été posées à la main par des travailleurs recrutés de force.",
            modele: { h: 320, rx: -20, ry: 30, echelle: 0.85, alt: "Locomotive à vapeur et deux wagons de sacs de cacao en trois dimensions", objets: train3D(),
              etiquettes: [{ p: [-200, 60, 0], t: "Locomotive à vapeur" }, { p: [80, 64, 0], t: "Sacs de cacao", cote: "d" }, { p: [250, 40, -80], t: "Gare", cote: "d" }] } }
        ],
        fil: { html: "<p>Les rails, les ports et les plantations existent bel et bien : Grace ne peut pas dire que rien n'a été construit. Mais le document 2 rappelle le prix : recrutement forcé et mortalité élevée sur les chantiers. Et ces lignes allaient de la côte vers les zones de production, pour exporter, plus que pour relier les Camerounais entre eux.</p>", verdicts: [[1, "rejetee", "Chemins de fer, wharfs, plantations : des infrastructures réelles ont été construites."], [0, "rejetee", "Ces infrastructures ont coûté le travail forcé et de nombreuses vies."]] },
        retenir: "Infrastructures réelles, mais construites par le travail forcé et tournées vers l'exportation." },
      { t: "Résister, puis tourner la page", html: partie(HK_OLD, 2) +
        "<div class='def'><b>Résistance par le droit</b>Rudolf Duala Manga Bell, éduqué en Allemagne, porte plainte et écrit au Parlement allemand (Reichstag) contre l'expropriation des Douala de leur plateau de Joss : il invoque le traité de 1884. Il est accusé de haute trahison et pendu le 8 août 1914.</div>",
        fil: { html: "<p>L'expropriation des terres douala viole la condition posée en 1884 (document 1). Les résistances, armées ou juridiques, sont réprimées dans le sang. Le jugement le plus juste combine les deux faces du Kamerun.</p>", verdicts: [[2, "validee", "Des réalisations réelles, obtenues par la contrainte et contre la volonté des populations."]] },
        retenir: "1914 : Manga Bell et Samba exécutés ; 1916 : fin du Kamerun." }
    ],
    denouement: {
      titre: "Des réalisations réelles, au prix de l'oppression",
      etapes: ["1884 : un traité aux conditions précises (indice 1).", "Rails, wharfs, plantations : des infrastructures réelles, tournées vers l'exportation (indice 2).", "Travail forcé, expropriation, exécutions de 1914 (indices 2 et 3).", "1916 : fin du Kamerun."],
      reponse: "<p>Le Kamerun naît du traité germano-douala du 12 juillet 1884, par lequel les rois Bell et Akwa acceptent un protectorat tout en exigeant de garder leurs terres. Pendant trente-deux ans, l'Allemagne construit des infrastructures bien réelles : le chemin de fer du Nord jusqu'à Nkongsamba (160 km, 1911), celui du Centre vers Eséka, des routes, des wharfs, des plantations autour du mont Cameroun ; Kevin a raison sur ce point, et Grace aurait tort de dire que rien n'a été fait. Mais ces réalisations, destinées surtout à exporter les richesses, reposent sur le travail forcé et une forte mortalité, et l'Allemagne viole le traité en expropriant les Douala. Ceux qui résistent sont réprimés : Rudolf Duala Manga Bell et Martin-Paul Samba sont exécutés en 1914. Le Kamerun fut donc à la fois une mise en valeur et une oppression ; il disparaît en 1916, chassé par les troupes franco-britanniques.</p>",
      transfert: "<p>Rédige la légende (cinq lignes) d'une plaque commémorative à installer devant la gare de Bonabéri : elle doit rappeler à la fois l'ouvrage et ceux qui l'ont construit.</p>"
    },
    revision: (HK_OLD ? HK_OLD.revision : []).concat(["Chemin de fer du Nord : Bonabéri-Nkongsamba, 160 km, 1911.", "Juger une colonisation : réalisations ET coût humain, faits datés à l'appui."]),
    exo: HK_OLD ? HK_OLD.exo : "",
    quiz: [
      q("Quand est signé le traité germano-douala ?", "12 juillet 1884", "1er janvier 1960", "1916", "Deux jours avant que Nachtigal hisse le drapeau."),
      q("Rudolf Duala Manga Bell s'opposait…", "à l'expropriation des terres douala", "à la construction des écoles", "aux missionnaires seulement", "Il fut pendu en 1914."),
      q("Quand les Allemands quittent-ils le Cameroun ?", "1916", "1884", "1945", "Chassés pendant la Première Guerre mondiale."),
      q("Qui hisse le drapeau allemand le 14 juillet 1884 ?", "Gustav Nachtigal", "Bismarck", "Puttkamer", "Explorateur et consul."),
      q("Le chemin de fer du Nord relie Bonabéri à…", "Nkongsamba", "Garoua", "Yaoundé", "160 km, achevé en 1911."),
      q("À quoi servaient d'abord les voies ferrées ?", "exporter les produits vers le port", "relier toutes les régions entre elles", "transporter les touristes", "De la côte vers les plantations."),
      q("Comment était recrutée la main-d'œuvre des chantiers ?", "souvent de force", "par concours", "parmi des volontaires payés", "Travail forcé, forte mortalité."),
      q("Martin-Paul Samba est…", "fusillé en 1914", "roi des Douala", "gouverneur allemand", "Héros de la résistance."),
      q("Le Neukamerun (1911) est…", "l'agrandissement de la colonie vers l'est et le sud", "une nouvelle capitale", "un traité avec les Douala", "Accord franco-allemand."),
      q("Un jugement historique solide…", "s'appuie sur des faits datés et nuancés", "répète une opinion", "ne retient que les aspects positifs", "Réalisations et coût humain.")
    ]
  });

  /* ═══════════════════════ 3e FRANÇAIS — LA SUBORDONNÉE RELATIVE ═══════════════════════ */
  var FR_OLD = ancien("3e-fr-relative");
  function wagon3D() {
    var o = [], ec = [130, 0, 0];
    o.push({ f: "boite", c: [0, -10, 0], d: [560, 8, 160], coul: "#7A6A55", dessus: "#97866D" });
    [-20, 20].forEach(function (z) { o.push({ f: "boite", c: [0, -4, z], d: [540, 3, 4], coul: "#8E96A6", dessus: "#C9CED6", div: false }); });
    o.push({ f: "boite", c: [-130, 6, 0], d: [150, 60, 60], coul: "#1E499B", dessus: "#2F5FBF", div: false });
    o.push({ f: "boite", c: [-170, 66, 0], d: [60, 30, 60], coul: "#163A7C", dessus: "#1E499B", div: false });
    o.push({ f: "cylindre", c: [-90, 66, 0], r: 8, h: 26, n: 12, coul: "#1F2328" });
    o.push({ f: "boite", c: [-50, 20, 0], d: [14, 6, 10], coul: "#5C6478", div: false });
    o.push({ f: "boite", c: [70, 6, 0], d: [140, 50, 56], coul: "#C2540A", dessus: "#D9772E", div: false, ec: ec });
    o.push({ f: "boite", c: [10, 20, 0], d: [14, 6, 10], coul: "#5C6478", div: false, ec: ec });
    [-185, -130, -75, 25, 115].forEach(function (x, i) { [-26, 26].forEach(function (z) { o.push({ f: "cylindre", c: [x, 10, z], r: 10, h: 4, n: 16, axe: "z", coul: "#2C3138", ec: i > 2 ? ec : [0, 0, 0] }); }); });
    return o;
  }
  remplacer("3e-fr-relative", {
    c: "3e", m: "francais", titre: "La proposition subordonnée relative", duree: 35,
    accroche: "« Le taxi que j'ai oublié mon sac dedans… » : l'avis de recherche de la radio de Bafang est à réécrire.",
    intro: "Un avis de recherche à corriger te sert de fil rouge : à chaque partie, un indice t'aide à trancher entre trois conseils.",
    objectifs: ["repérer une subordonnée relative et son antécédent", "choisir le pronom relatif selon sa fonction dans la relative", "distinguer relative déterminative et relative explicative", "corriger les relatives fautives de l'oral"],
    enquete: {
      titre: "L'avis de recherche de Radio Bafang",
      svg: (function () {
        var s = "<rect width='640' height='200' fill='#F4F0FA'/><rect x='40' y='60' width='150' height='96' rx='14' fill='#3A4048'/><circle cx='86' cy='108' r='30' fill='#2C3138' stroke='#8E96A6' stroke-width='3'/><circle cx='86' cy='108' r='10' fill='#5C6478'/><rect x='130' y='80' width='46' height='12' rx='3' fill='#FFD54A'/><path d='M150 60L180 18' stroke='#8E96A6' stroke-width='3'/>";
        s += "<rect x='230' y='30' width='380' height='140' rx='12' fill='#fff' stroke='#C9D2E3'/>" + txt(250, 56, "AVIS DE RECHERCHE", { s: 13, a: "start", c: "#C62828" });
        ["« Le taxi que j'ai oublié mon sac dedans", "était jaune. Le chauffeur que je vous parle", "est un monsieur gentil. Les papiers que", "le sac contenait sont importants. »"].forEach(function (l, i) { s += txt(250, 84 + i * 22, l, { s: 12.5, a: "start", w: 500, i: true }); });
        return svg(640, 200, "Un poste de radio et le texte d un avis de recherche contenant des fautes de relatives", "", s);
      })(),
      legende: "À Bafang : Mama Ngo Nkamga dicte un avis de recherche à son fils Junior, élève de 3e, pour la radio communautaire.",
      contexte: "<p>Mama a oublié son sac, avec ses papiers, dans un taxi. Elle dicte à Junior l'avis qu'elle veut faire lire à la radio : « Le taxi <em>que j'ai oublié mon sac dedans</em> était jaune. Le chauffeur <em>que je vous parle</em> est un monsieur gentil. Les papiers <em>que le sac contenait</em> sont importants. Les passagers <em>qui étaient assis derrière</em> peuvent appeler le 6.. »</p><p>Le journaliste refuse de lire le texte tel quel. Le grand frère de Junior propose : « Mets “que” partout, c'est plus simple ! »</p>",
      documents: [{ t: "Ce que demande le journaliste", html: "<p>« Un français correct à l'antenne, et que les auditeurs comprennent bien <strong>qui</strong> doit appeler : tous les passagers, ou seulement ceux qui étaient assis derrière ? »</p>" }],
      question: "Comment corriger l'avis pour que chaque relative soit juste et que le message soit clair ?",
      tache: "Réécris l'avis de recherche en justifiant le choix de chaque pronom relatif et de la ponctuation.",
      hypotheses: ["« Que » convient partout : c'est le pronom relatif le plus courant.", "Le pronom relatif se choisit selon sa fonction dans la relative.", "Les virgules autour d'une relative ne changent rien au sens."]
    },
    parties: [
      { t: "Reconnaître la relative", html: partie(FR_OLD, 0),
        planches: [{ type: "3d", titre: "L'antécédent et sa relative, une locomotive et son wagon", legende: "La locomotive bleue est l'antécédent (le taxi) ; le wagon orange est la relative (« dans lequel j'ai oublié mon sac »), accrochée par le pronom relatif. Le curseur décroche le wagon : la phrase reste correcte, mais on ne sait plus de quel taxi il s'agit.",
          modele: { h: 300, rx: -18, ry: 26, echelle: 0.95, alt: "Locomotive bleue et wagon orange attelés en trois dimensions", eclate: "Décrocher la relative", jouer: "Décrocher le wagon", objets: wagon3D(),
            etiquettes: [{ p: [-130, 80, 0], t: "Antécédent : le taxi" }, { p: [70, 60, 0], t: "Relative : dans lequel j'ai oublié mon sac", cote: "d", ec: [130, 0, 0] }, { p: [10, 26, 0], t: "Pronom relatif = attelage", cote: "d", ec: [130, 0, 0] }] } }],
        fil: { html: "<p>Dans l'avis, chaque passage en italique complète un nom : <em>le taxi</em>, <em>le chauffeur</em>, <em>les papiers</em>, <em>les passagers</em>. Ce sont quatre relatives, et ces quatre noms sont leurs antécédents.</p>" },
        retenir: "Pas d'antécédent, pas de relative : on cherche d'abord le nom complété." },
      { t: "Choisir le pronom relatif", html: partie(FR_OLD, 1) +
        "<div class='methode'><b>La méthode de la phrase simple</b><ol><li>Remplace le pronom relatif par l'antécédent et écris la phrase simple : « J'ai oublié mon sac <strong>dans le taxi</strong>. »</li><li>Regarde la fonction du groupe : complément introduit par « dans ».</li><li>Choisis le pronom : préposition + lequel → « <strong>dans lequel</strong> » (ou « où » pour le lieu).</li></ol></div>",
        fil: { html: "<p>« J'ai oublié mon sac <strong>dans</strong> le taxi » → le taxi <strong>dans lequel</strong> (ou <strong>où</strong>) j'ai oublié mon sac. « Je vous parle <strong>du</strong> chauffeur » → le chauffeur <strong>dont</strong> je vous parle. « Le sac contenait <strong>les papiers</strong> » (COD) → les papiers <strong>que</strong> le sac contenait : ici « que » est juste. Mettre « que » partout produirait deux fautes sur trois.</p>", verdicts: [[0, "rejetee", "« que » n'est correct que pour un COD : « dont » et « dans lequel » sont nécessaires ici."], [1, "validee", "Phrase simple → fonction → pronom."]] },
        retenir: "Le pronom dépend de sa fonction DANS la relative : qui sujet, que COD, dont = « de »." },
      { t: "Déterminative ou explicative ?", html: partie(FR_OLD, 2),
        planches: [{ type: "2D", titre: "Une virgule, deux sens", legende: "Sans virgules, seuls les passagers assis derrière sont concernés (relative déterminative). Avec des virgules, tous les passagers étaient assis derrière et tous doivent appeler (relative explicative).", svg: (function () {
          function taxi(x, y, tous) {
            var s = "<g transform='translate(" + x + " " + y + ")'><path d='M10 70h250v-26l-30-34h-150l-36 34h-34z' fill='#F7C948' stroke='#7A5A00' stroke-width='2'/><rect x='70' y='18' width='70' height='26' rx='4' fill='#CFE3F3'/><rect x='150' y='18' width='70' height='26' rx='4' fill='#CFE3F3'/><circle cx='60' cy='72' r='16' fill='#2C3138'/><circle cx='210' cy='72' r='16' fill='#2C3138'/><circle cx='60' cy='72' r='6' fill='#9AA3B2'/><circle cx='210' cy='72' r='6' fill='#9AA3B2'/>";
            s += "<circle cx='100' cy='30' r='8' fill='#6B4423'/>";
            [170, 188, 206].forEach(function (cx) { s += "<circle cx='" + cx + "' cy='30' r='8' fill='" + "#5A3A1E" + "'/>"; });
            s += "<rect x='" + (tous ? 86 : 158) + "' y='14' width='" + (tous ? 136 : 62) + "' height='34' rx='8' fill='none' stroke='#C62828' stroke-width='3'/>";
            return s + "</g>";
          }
          var s = taxi(30, 50, false) + taxi(340, 50, true);
          s += txt(165, 30, "Les passagers qui étaient assis derrière", { s: 12.5 }) + txt(165, 46, "peuvent appeler.", { s: 12.5 }) + txt(165, 170, "déterminative : seulement ceux de derrière", { s: 11.5, c: "#C62828" });
          s += txt(475, 30, "Les passagers, qui étaient assis derrière,", { s: 12.5 }) + txt(475, 46, "peuvent appeler.", { s: 12.5 }) + txt(475, 170, "explicative : tous les passagers", { s: 11.5, c: "#C62828" });
          return svg(640, 190, "Deux taxis : dans le premier, seuls les passagers de l arrière sont entourés ; dans le second, tous les passagers le sont", "", s);
        })() }],
        fil: { html: "<p>Mama veut que <strong>seuls</strong> les passagers de l'arrière appellent (le chauffeur et le passager avant n'ont rien vu) : la relative doit rester <strong>déterminative</strong>, sans virgules. Ajouter des virgules changerait le message : les virgules comptent.</p>", verdicts: [[2, "rejetee", "Avec des virgules, la relative devient explicative et désigne tous les passagers."]] },
        retenir: "La virgule change le sens : elle transforme une sélection en simple explication." }
    ],
    denouement: {
      titre: "L'avis corrigé, prêt pour l'antenne",
      etapes: ["Repérer les quatre antécédents (indice 1).", "Phrase simple → fonction → pronom : où / dans lequel, dont, que (indice 2).", "Relative déterminative sans virgules pour « les passagers qui étaient assis derrière » (indice 3)."],
      reponse: "<p>Avis de recherche corrigé : « Le taxi <strong>dans lequel</strong> (ou <strong>où</strong>) j'ai oublié mon sac était jaune. Le chauffeur <strong>dont</strong> je vous parle est un monsieur gentil. Les papiers <strong>que</strong> le sac contenait sont importants. Les passagers <strong>qui</strong> étaient assis derrière peuvent appeler le 6.. » Le pronom se choisit selon sa fonction dans la relative : « dans lequel » ou « où » pour le complément de lieu (oublier <em>dans</em> le taxi), « dont » pour un complément introduit par « de » (parler <em>du</em> chauffeur), « que » pour le COD (contenir <em>les papiers</em>), « qui » pour le sujet. Mettre « que » partout aurait laissé deux fautes. Enfin, la dernière relative reste sans virgules, car elle est déterminative : seuls les passagers de l'arrière sont concernés.</p>",
      transfert: "<p>Corrige et justifie : « C'est le marché que je t'ai dit que les prix sont bas. » <em>(C'est le marché dont je t'ai dit que les prix sont bas → mieux : C'est le marché où les prix sont bas, dont je t'ai parlé.)</em></p>"
    },
    revision: (FR_OLD ? FR_OLD.revision : []).concat(["Méthode : phrase simple → fonction → pronom.", "Oral fautif : « que … dedans » → dans lequel / où ; « que je te parle » → dont je te parle."]),
    exo: FR_OLD ? FR_OLD.exo : "",
    quiz: [
      q("Dans « le livre que je lis », l'antécédent est…", "le livre", "que", "je lis", "Le nom complété par la relative."),
      q("« Le chauffeur ___ je vous parle » :", "dont", "que", "qui", "Parler DE quelqu'un."),
      q("« Le taxi ___ j'ai oublié mon sac » :", "dans lequel", "que", "dont", "Oublier DANS le taxi (ou « où »)."),
      q("« Les papiers ___ le sac contenait » :", "que", "dont", "qui", "COD de contenait."),
      q("« Les passagers ___ étaient assis derrière » :", "qui", "que", "dont", "Sujet de étaient."),
      q("Une relative explicative se reconnaît…", "à ses virgules", "à son pronom « dont »", "à sa longueur", "On peut la supprimer."),
      q("« Les élèves qui ont fini peuvent sortir » : qui sort ?", "seulement ceux qui ont fini", "tous les élèves", "personne", "Relative déterminative."),
      q("« La ville où je suis né » : « où » est complément…", "de lieu", "sujet", "COD", "Où = lieu ou temps."),
      q("« La table sur ___ j'écris » :", "laquelle", "que", "dont", "Préposition + lequel."),
      q("Pour choisir le pronom relatif, on cherche…", "sa fonction dans la relative", "la fonction de l'antécédent dans la principale", "le temps du verbe", "Méthode de la phrase simple.")
    ]
  });

  /* ═══════════════════════ Tle — GÉRER SON TEMPS EN CLASSE D'EXAMEN ═══════════════════════ */
  var OT_OLD = ancien("tle-orient-temps");
  var JOURNEE = [["Sommeil", 6, "#3A4E8C"], ["Cours", 7, "#1E88E5"], ["Trajets", 1.5, "#8E96A6"], ["Repas, tâches", 2.5, "#C9A576"], ["Téléphone, réseaux", 4.5, "#C62828"], ["Révisions", 1, "#2E7D32"], ["Autre", 1.5, "#E0E3E8"]];
  function donut(cx, cy, R, r, D) {
    var tot = D.reduce(function (a, d) { return a + d[1]; }, 0), a0 = -Math.PI / 2, s = "";
    D.forEach(function (d) {
      var a1 = a0 + d[1] / tot * 2 * Math.PI, g = a1 - a0 > Math.PI ? 1 : 0, p = function (rr, a) { return (cx + rr * Math.cos(a)).toFixed(1) + " " + (cy + rr * Math.sin(a)).toFixed(1); };
      s += "<path d='M" + p(R, a0) + "A" + R + " " + R + " 0 " + g + " 1 " + p(R, a1) + "L" + p(r, a1) + "A" + r + " " + r + " 0 " + g + " 0 " + p(r, a0) + "Z' fill='" + d[2] + "' stroke='#fff' stroke-width='2'/>";
      a0 = a1;
    });
    return s;
  }
  function semaine3D() {
    var o = [], J = ["L", "M", "M", "J", "V", "S", "D"], C = { cours: "#1E88E5", rev: "#2E7D32", sport: "#F2994A", repos: "#E0E3E8", som: "#3A4E8C" }, k;
    o.push({ f: "boite", c: [0, -6, 0], d: [460, 8, 160], coul: "#C9A576", dessus: "#E3C79C" });
    var P = [[["som", 8], ["cours", 7], ["rev", 2], ["repos", 2]], [["som", 8], ["cours", 7], ["rev", 2], ["sport", 1]], [["som", 8], ["cours", 5], ["rev", 2], ["repos", 2]], [["som", 8], ["cours", 7], ["rev", 2], ["sport", 1]], [["som", 8], ["cours", 7], ["rev", 1.5], ["repos", 2]], [["som", 9], ["rev", 4], ["sport", 2], ["repos", 4]], [["som", 9], ["rev", 2], ["repos", 6]]];
    P.forEach(function (j, i) {
      var y = 0; j.forEach(function (b, n) { var h = b[1] * 8; o.push({ f: "boite", c: [-195 + i * 65, y, 0], d: [48, h - 1.5, 60], coul: C[b[0]], div: false, ec: [0, n * 10, 0] }); y += h; });
    });
    return o;
  }
  remplacer("tle-orient-temps", {
    c: "Tle A", m: "orientation", titre: "Gérer son temps en classe d'examen", duree: 30,
    accroche: "Quatre heures et demie par jour sur le téléphone, une heure de révision : Aïcha veut changer avant le bac.",
    intro: "L'emploi du temps réel d'une élève de Terminale te sert de fil rouge : à chaque partie, un indice t'aide à trancher entre trois stratégies.",
    objectifs: ["faire le bilan chiffré de son emploi du temps", "construire un planning réaliste qui respecte le sommeil", "répartir les révisions selon les coefficients et les faiblesses", "utiliser la révision espacée et lutter contre la procrastination"],
    enquete: {
      titre: "Le bilan d'Aïcha, Terminale A à Ngaoundéré",
      svg: svg(640, 220, "Diagramme circulaire d une journée d Aïcha : 6 heures de sommeil, 7 de cours, 4 heures et demie de téléphone, 1 heure de révision", "", "<rect width='640' height='220' fill='#F5F7FB'/>" + donut(130, 110, 90, 52, JOURNEE) + txt(130, 106, "24 h", { s: 18 }) + txt(130, 124, "d'Aïcha", { s: 11, w: 500, c: GRIS }) + JOURNEE.map(function (d, i) { return "<rect x='260' y='" + (30 + i * 24) + "' width='16' height='16' rx='4' fill='" + d[2] + "'/>" + txt(284, 43 + i * 24, d[0] + " : " + String(d[1]).replace(".", ",") + " h", { s: 12, a: "start", w: d[0] === "Révisions" || d[0] === "Téléphone, réseaux" ? 800 : 600 }); }).join("")),
      legende: "À Ngaoundéré : Aïcha, en Terminale A, note pendant une semaine ce qu'elle fait heure par heure, comme le conseille le conseiller d'orientation.",
      contexte: "<p>À six mois du baccalauréat, Aïcha se sent débordée. Son bilan d'une journée de semaine est sans appel : <strong>4 h 30 de téléphone</strong>, <strong>1 h de révision</strong>, <strong>6 h de sommeil</strong>. Sa camarade Ramatou lui conseille de « travailler la nuit jusqu'à 2 h comme les grands ». Son cousin, lui, a eu le bac en « révisant tout la dernière semaine ».</p>",
      documents: [
        { t: "Ce que dit la recherche sur la mémoire", html: "<p>Sans révision, on oublie environ <strong>la moitié</strong> d'une leçon en quelques jours. Chaque révision espacée (le lendemain, une semaine après, un mois après) ralentit l'oubli. Le sommeil consolide ce qui a été appris dans la journée.</p>" },
        { t: "Les coefficients (exemple d'une série littéraire)", html: "<table class='donnees'><tr><th>Matière</th><td>Philosophie</td><td>Français</td><td>Anglais</td><td>Histoire-géo</td><td>Autres</td></tr><tr><th>Coefficient</th><td>5</td><td>4</td><td>3</td><td>3</td><td>1 à 2</td></tr></table><p><em>Exemple pour le calcul ; vérifie les coefficients de ta série auprès de ton établissement.</em></p>" }
      ],
      question: "Comment Aïcha doit-elle réorganiser son temps pour être prête au bac sans s'épuiser ?",
      tache: "Construis pour Aïcha une semaine type chiffrée, justifiée par son bilan et les documents.",
      hypotheses: ["Travailler la nuit jusqu'à 2 h pour gagner des heures (Ramatou).", "Tout réviser la dernière semaine, quand la pression aide à se concentrer (le cousin).", "Garder 7 à 8 h de sommeil, réduire le téléphone et réviser chaque jour par séances courtes, selon les coefficients."]
    },
    parties: [
      { t: "Faire le bilan", html: partie(OT_OLD, 0) +
        "<div class='ex'><b>Le calcul d'Aïcha</b>4 h 30 de téléphone par jour, c'est 31 h 30 par semaine, plus que ses heures de cours. En ramenant l'écran à 1 h 30, elle récupère 3 h par jour : de quoi dormir enfin 8 h et ajouter une heure de révision chaque soir.</div>",
        fil: { html: "<p>Le temps existe : il est caché dans les 4 h 30 d'écran. Il n'est pas nécessaire de le prendre sur le sommeil.</p>" },
        retenir: "On ne gère bien que ce que l'on mesure." },
      { t: "Construire un planning", html: partie(OT_OLD, 1) +
        "<div class='methode'><b>Répartir selon les coefficients</b><ol><li>Additionne les coefficients des matières écrites (ex. 5 + 4 + 3 + 3 = 15).</li><li>Partage les heures de révision au prorata : philosophie 5/15, français 4/15…</li><li>Ajoute un bonus aux matières où tu es faible.</li></ol></div>",
        planches: [{ type: "3d", titre: "La semaine type d'Aïcha", legende: "Chaque colonne est un jour, chaque bloc une activité : sommeil (bleu nuit), cours (bleu), révisions (vert), sport (orange), repos (gris clair). Le curseur sépare les blocs pour mieux les compter : environ 15 h 30 de révisions dans la semaine, sans toucher au sommeil.",
          modele: { h: 340, rx: -20, ry: 24, echelle: 0.95, alt: "Sept colonnes de blocs colorés représentant une semaine type", eclate: "Séparer les blocs", jouer: "Séparer", objets: semaine3D(),
            etiquettes: [{ p: [-195, 30, 30], t: "Sommeil 8 h" }, { p: [130, 90, 30], t: "Samedi : 4 h de révision", cote: "d", ec: [0, 10, 0] }] } }],
        fil: { html: "<p>Travailler jusqu'à 2 h du matin réduirait encore un sommeil déjà trop court : fatigue en classe, mémoire moins efficace (document 1). Le simulateur montre qu'avec 8 h de sommeil et 1 h 30 de téléphone par jour, Aïcha dispose de plus de 15 h de révision par semaine.</p>", verdicts: [[0, "rejetee", "Le sommeil consolide la mémoire : on prend le temps sur l'écran, pas sur la nuit."]] },
        retenir: "Un planning réaliste vaut mieux qu'un planning parfait jamais suivi." },
      { t: "Réviser au bon moment et vaincre la procrastination", html: partie(OT_OLD, 2) +
        "<div class='def'><b>Révision espacée</b>Revoir une leçon le lendemain, puis une semaine après, puis un mois après : chaque rappel remonte la mémoire et la fait baisser moins vite ensuite.</div>",
        planches: [{ type: "2D", titre: "La courbe de l'oubli et les révisions espacées", legende: "Sans révision (pointillés rouges), la mémoire d'une leçon chute à environ 50 % en quelques jours. Avec trois révisions espacées (courbe verte), elle reste haute jusqu'à l'examen.", svg: (function () {
          var X = function (j) { return 70 + j / 30 * 530; }, Y = function (p) { return 250 - p * 2; }, s = "", d1 = "", d2 = "", j;
          for (j = 0; j <= 30; j += 0.5) { d1 += (j ? "L" : "M") + X(j).toFixed(1) + " " + Y(100 * Math.exp(-j / 4) * 0.62 + 30).toFixed(1); }
          var R = [0, 1, 7, 21], k = 0.25;
          for (j = 0; j <= 30; j += 0.25) { var last = 0, n = 0; R.forEach(function (r, i) { if (j >= r) { last = r; n = i; } }); var tau = 2 * Math.pow(3, n); d2 += (j ? "L" : "M") + X(j).toFixed(1) + " " + Y(100 - (100 - 30) * (1 - Math.exp(-(j - last) / tau)) * 0.9).toFixed(1); }
          for (j = 0; j <= 100; j += 25) s += "<path d='M70 " + Y(j) + "H600' stroke='#E6EAF2'/>" + txt(62, Y(j) + 4, j + " %", { s: 10.5, a: "end", w: 500, c: GRIS });
          s += "<path d='" + d1 + "' fill='none' stroke='#C62828' stroke-width='2.5' stroke-dasharray='7 5'/><path d='" + d2 + "' fill='none' stroke='#2E7D32' stroke-width='3'/>";
          R.slice(1).forEach(function (r) { s += "<circle cx='" + X(r) + "' cy='" + Y(100) + "' r='5' fill='#2E7D32'/>" + txt(X(r), Y(100) - 10, "J" + r, { s: 11, c: VERT }); });
          s += "<path d='M70 250H604M70 250V36' stroke='" + NUIT + "' stroke-width='1.5'/>" + txt(335, 276, "jours après la leçon", { s: 12 }) + txt(80, 30, "ce qu'on retient", { s: 11.5, a: "start", c: GRIS });
          return svg(640, 290, "Courbe de l oubli : sans révision la mémoire chute, avec des révisions espacées à J1, J7 et J21 elle reste haute", "", s);
        })() }],
        fil: { html: "<p>Tout réviser la dernière semaine, c'est réapprendre des leçons à moitié oubliées, sous stress, sans le temps de les revoir : la courbe de l'oubli condamne cette stratégie. Mieux vaut des séances courtes chaque jour, avec des révisions espacées.</p>", verdicts: [[1, "rejetee", "Sans révisions espacées, on a oublié la moitié des leçons ; la dernière semaine ne suffit pas."], [2, "validee", "Sommeil préservé, écran réduit, séances courtes et espacées selon les coefficients."]] },
        retenir: "Commencer petit, mais commencer aujourd'hui ; revoir à J1, J7, J21." }
    ],
    denouement: {
      titre: "Une semaine type pour Aïcha",
      etapes: ["Bilan : 4 h 30 de téléphone, 1 h de révision, 6 h de sommeil (indice 1).", "Sommeil à 8 h, téléphone ramené à 1 h 30, séances de 45 min réparties selon les coefficients : au moins 15 h par semaine (indice 2).", "Révisions espacées à J1, J7, J21 ; démarrer par 5 minutes (indice 3)."],
      reponse: "<p>Le bilan d'Aïcha montre que le temps ne manque pas : il est absorbé par 4 h 30 d'écran par jour, soit plus de 31 h par semaine. Elle ne doit pas le prendre sur ses nuits, car le sommeil consolide la mémoire : elle se couchera assez tôt pour dormir 7 à 8 h. En ramenant le téléphone à 1 h 30 par jour, elle dégage au moins 15 h de révision par semaine, qu'elle découpe en séances de 40 à 50 minutes suivies de pauses, réparties selon les coefficients (la philosophie et le français d'abord) et ses points faibles. Plutôt que de tout réviser la dernière semaine, elle revoit chaque leçon le lendemain, une semaine puis trois semaines après, pour contrer la courbe de l'oubli. Pour démarrer chaque soir, elle commence par une tâche de cinq minutes, téléphone rangé dans une autre pièce.</p>",
      transfert: "<p>Fais ton propre bilan d'une journée (en heures), puis utilise le simulateur pour calculer combien d'heures de révision tu peux dégager chaque semaine sans réduire ton sommeil.</p>"
    },
    revision: (OT_OLD ? OT_OLD.revision : []).concat(["Répartition des révisions au prorata des coefficients.", "Révisions espacées : J1, J7, J21."]),
    exo: OT_OLD ? OT_OLD.exo : "",
    quiz: [
      q("Combien d'heures de sommeil viser ?", "7 à 8 h", "4 à 5 h", "12 h", "Le sommeil fixe les apprentissages."),
      q("Durée conseillée d'une séance de travail :", "40 à 50 min", "4 heures sans pause", "10 min", "Suivie d'une pause courte."),
      q("Contre la procrastination :", "commencer par une tâche de 5 min", "attendre l'inspiration", "tout faire la veille", "Le plus dur est de commencer."),
      q("4 h 30 de téléphone par jour représentent par semaine…", "31 h 30", "4 h 30", "15 h", "4,5 × 7."),
      q("Sans révision, on oublie une leçon…", "en grande partie en quelques jours", "jamais", "seulement après un an", "Courbe de l'oubli."),
      q("Révisions espacées :", "J1, J7, J21", "toutes la veille de l'examen", "une seule fois", "Chaque rappel ralentit l'oubli."),
      q("Coefficients 5, 4, 3, 3 : part de la matière de coefficient 5 ?", "5/15", "5/4", "1/4", "Au prorata du total 15."),
      q("Travailler jusqu'à 2 h du matin…", "nuit à la mémoire et à l'attention", "double les résultats", "est sans effet", "Le sommeil consolide la mémoire."),
      q("Pendant une séance de travail, le téléphone doit être…", "hors de portée, en silencieux", "à côté, sonnerie forte", "en main", "Chaque notification coupe l'attention."),
      q("La première étape pour gérer son temps :", "faire le bilan de sa semaine", "acheter un agenda neuf", "réviser la nuit", "On ne gère bien que ce que l'on mesure.")
    ]
  });

  /* ═══════════════════════ SIMULATIONS ═══════════════════════ */
  function $(el, s) { return el.querySelector(s); }
  /* carte du Cameroun interactive : choisir une ville */
  VRT_A("3e-geo-cameroun", 2, "Choisis une ville : milieu naturel, altitude et pluies", function (el) {
    var X = function (l) { return 40 + (l - 8) * 40; }, Y = function (l) { return 470 - (l - 1.5) * 38; };
    el.innerHTML = "<div style='display:flex;flex-wrap:wrap;gap:6px' data-b>" + VILLES.map(function (v, i) { return "<button type='button' class='btn-l' data-i='" + i + "'>" + v[0] + "</button>"; }).join("") + "</div><svg viewBox='0 0 640 480' class='an-svg' style='max-height:420px' data-s></svg><p class='labo-r' data-r>Choisis une ville.</p>";
    var sv = $(el, "[data-s]");
    function maj(i) {
      var v = VILLES[i], s = "<rect width='640' height='480' fill='#DCEBF5'/><defs></defs>" + carte("gcA", X, Y, { villes: false });
      VILLES.forEach(function (w, k) { s += "<circle cx='" + X(w[1]) + "' cy='" + Y(w[2]) + "' r='" + (k === i ? 9 : 4) + "' fill='" + (k === i ? "#C62828" : NUIT) + "' stroke='#fff' stroke-width='2'/>"; });
      s += txt(X(v[1]) + 12, Y(v[2]) + 5, v[0], { s: 15, a: "start", halo: true });
      var h = v[6] / 4000 * 120; s += "<g transform='translate(520 330)'><rect x='0' y='" + (-Math.min(140, h)) + "' width='40' height='" + Math.min(140, h) + "' rx='4' fill='#2F6DB5'/>" + txt(20, 18, v[6].toLocaleString("fr-FR") + " mm", { s: 12 }) + txt(20, 34, "pluies/an", { s: 10.5, w: 500, c: GRIS }) + "</g>";
      sv.innerHTML = s;
      $(el, "[data-r]").innerHTML = "<b>" + v[0] + "</b> · " + v[3] + " · " + v[4] + " · altitude ≈ <b>" + v[5].toLocaleString("fr-FR") + " m</b> · pluies ≈ <b>" + v[6].toLocaleString("fr-FR") + " mm/an</b>";
      el.querySelectorAll("[data-i]").forEach(function (b) { b.setAttribute("aria-pressed", +b.dataset.i === i); });
    }
    el.querySelectorAll("[data-i]").forEach(function (b) { b.addEventListener("click", function () { maj(+b.dataset.i); }); });
    maj(0);
  });

  /* choisir le pronom relatif */
  VRT_A("3e-fr-relative", 1, "Choisis le bon pronom relatif", function (el) {
    var P = [["Le taxi ___ j'ai oublié mon sac était jaune.", ["dans lequel", "que", "dont"], 0, "On oublie DANS le taxi : préposition + lequel (ou « où »)."], ["Le chauffeur ___ je vous parle est gentil.", ["dont", "que", "qui"], 0, "On parle DE quelqu'un : « dont »."], ["Les papiers ___ le sac contenait sont importants.", ["que", "dont", "qui"], 0, "« les papiers » est COD de « contenait »."], ["Les passagers ___ étaient assis derrière peuvent appeler.", ["qui", "que", "où"], 0, "Sujet de « étaient » : « qui »."], ["Bafang est la ville ___ Junior est né.", ["où", "que", "dont"], 0, "Complément de lieu : « où »."], ["C'est un roman ___ tout le monde parle.", ["dont", "que", "lequel"], 0, "Parler DE : « dont »."], ["Voici la table sur ___ j'écris.", ["laquelle", "que", "qui"], 0, "Préposition + lequel, accordé au féminin."], ["Le cacao ___ Banda transporte est lourd.", ["que", "qui", "dont"], 0, "COD de « transporte »."]];
    var i = 0, ok = 0;
    el.innerHTML = "<p class='labo-r' data-q style='font-size:17px'></p><div style='display:flex;gap:8px;flex-wrap:wrap' data-c></div><p class='an-note' data-e></p><p class='labo-r' data-s></p>";
    function melange(a) { return a.map(function (x, k) { return [x, (k * 7 + i * 3) % 5]; }).sort(function (u, v) { return u[1] - v[1]; }).map(function (x) { return x[0]; }); }
    function poser() {
      var p = P[i];
      $(el, "[data-q]").innerHTML = p[0].replace("___", "<b style='border-bottom:2px dashed #1E499B;padding:0 18px'>?</b>");
      $(el, "[data-e]").textContent = ""; $(el, "[data-s]").innerHTML = "Question " + (i + 1) + " sur " + P.length + " · score : <b>" + ok + "</b>";
      $(el, "[data-c]").innerHTML = melange(p[1]).map(function (c) { return "<button type='button' class='btn-l' data-v='" + c + "'>" + c + "</button>"; }).join("");
      el.querySelectorAll("[data-v]").forEach(function (b) {
        b.addEventListener("click", function () {
          var bon = b.dataset.v === p[1][p[2]];
          if (bon) ok++;
          $(el, "[data-q]").innerHTML = p[0].replace("___", "<b style='color:" + (bon ? VERT : "#C62828") + "'>" + p[1][p[2]] + "</b>");
          $(el, "[data-e]").innerHTML = (bon ? "✔ Juste. " : "✘ Non : « " + b.dataset.v + " » ne convient pas. ") + p[3];
          el.querySelectorAll("[data-v]").forEach(function (x) { x.disabled = true; });
          var nx = document.createElement("button"); nx.type = "button"; nx.className = "btn-l"; nx.textContent = i + 1 < P.length ? "Phrase suivante" : "Recommencer";
          nx.addEventListener("click", function () { i = (i + 1) % P.length; if (!i) ok = 0; poser(); });
          $(el, "[data-c]").appendChild(nx);
          $(el, "[data-s]").innerHTML = "Question " + (i + 1) + " sur " + P.length + " · score : <b>" + ok + "</b>";
        });
      });
    }
    poser();
  });

  /* simulateur de semaine : sommeil, téléphone → heures de révision et répartition */
  VRT_A("tle-orient-temps", 1, "Simulateur : combien d'heures de révision par semaine ?", function (el) {
    function cur(l, min, max, pas, v, u) { return "<label class='labo-c'><span>" + l + " : <b data-v>" + String(v).replace(".", ",") + "</b> " + u + "</span><input type='range' min='" + min + "' max='" + max + "' step='" + pas + "' value='" + v + "'></label>"; }
    el.innerHTML = "<div style='display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:4px 18px'>" + cur("Sommeil par nuit", 5, 9, 0.5, 6, "h") + cur("Téléphone par jour", 0, 6, 0.5, 4.5, "h") + cur("Cours par jour (semaine)", 5, 8, 0.5, 7, "h") + "</div><svg viewBox='0 0 640 210' class='an-svg' data-s></svg><p class='labo-r' data-r></p>";
    var I = el.querySelectorAll("input"), V = el.querySelectorAll("[data-v]"), M = [["Philosophie", 5, "#7B3F99"], ["Français", 4, "#1E499B"], ["Anglais", 3, "#2E7D32"], ["Histoire-géo", 3, "#C2540A"]];
    function maj() {
      var som = +I[0].value, tel = +I[1].value, cours = +I[2].value;
      I.forEach(function (x, i) { V[i].textContent = String(+x.value).replace(".", ","); });
      var libreSemaine = 5 * Math.max(0, 24 - som - cours - 1.5 - 2.5 - tel - 1.5) + 2 * Math.max(0, 24 - som - 3 - tel - 4);
      var rev = Math.round(libreSemaine * 0.8 * 2) / 2, s = "", x = 20;
      M.forEach(function (m) { var h = rev * m[1] / 15, w = h / Math.max(rev, 1) * 600; s += "<rect x='" + x + "' y='40' width='" + Math.max(0, w - 3) + "' height='46' rx='6' fill='" + m[2] + "'/>" + (w > 70 ? txt(x + w / 2, 60, m[0], { s: 11.5, c: "#fff" }) + txt(x + w / 2, 77, String(Math.round(h * 2) / 2).replace(".", ",") + " h", { s: 11.5, c: "#fff" }) : ""); x += w; });
      s += txt(20, 26, "Répartition au prorata des coefficients (5, 4, 3, 3)", { s: 12, a: "start", c: GRIS });
      var alerte = som < 7 ? "⚠️ Moins de 7 h de sommeil : mémoire et attention en baisse." : "✔ Sommeil suffisant.";
      s += "<rect x='20' y='120' width='600' height='26' rx='13' fill='#EEF1F6'/><rect x='20' y='120' width='" + Math.min(600, rev / 25 * 600) + "' height='26' rx='13' fill='" + (rev >= 15 ? "#2E7D32" : rev >= 8 ? "#F2994A" : "#C62828") + "'/>" + txt(20, 112, "Révisions possibles : " + String(rev).replace(".", ",") + " h par semaine (objectif ≥ 15 h)", { s: 12.5, a: "start" });
      s += txt(20, 180, alerte, { s: 12.5, a: "start", c: som < 7 ? "#C62828" : VERT });
      $(el, "[data-s]").innerHTML = s;
      $(el, "[data-r]").innerHTML = "Écran par semaine : <b>" + String(tel * 7).replace(".", ",") + " h</b> · révisions possibles (80 % du temps libre) : <b>" + String(rev).replace(".", ",") + " h</b>";
    }
    I.forEach(function (x) { x.addEventListener("input", maj); }); maj();
  });
})();
