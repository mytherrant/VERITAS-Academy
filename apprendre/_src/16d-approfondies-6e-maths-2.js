/* Leçons APPROFONDIES — 6e Mathématiques, lot 3 (18/11/2026) : trois lignes de la progression qui n'avaient aucune leçon.
   - « Numérateur, dénominateur, fractions égales » (le jus de foléré du CES de Mora)
   - « Notions d'angle ou de secteur angulaire » (l'horloge de l'école de Kribi)
   - « Points symétriques par rapport à une droite » (le motif ndop de Bamenda)
   Même gabarit et mêmes outils de dessin que 16c-approfondies-6e-maths.js. Simulations en fin de fichier. */
(function () {
  "use strict";
  "use strict";
  var NUIT = "#001136", BLEU = "#1E499B", GRIS = "#4D5163", VERT = "#17784D", ORANGE = "#C2540A";

  function txt(x, y, t, o) {
    o = o || {};
    return "<text x='" + x + "' y='" + y + "' text-anchor='" + (o.a || "middle") + "' font-size='" + (o.s || 12) + "' font-weight='" + (o.w || 700) + "' fill='" + (o.c || NUIT) + "'" + (o.i ? " font-style='italic'" : "") + ">" + t + "</text>";
  }
  function rad(id, cs) {
    var s = "<radialGradient id='" + id + "' cx='35%' cy='30%' r='75%'>";
    cs.forEach(function (c, i) { s += "<stop offset='" + (i / (cs.length - 1)).toFixed(2) + "' stop-color='" + c + "'/>"; });
    return s + "</radialGradient>";
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
  function q(qq, bonne, f1, f2, e) { return { q: qq, r: [bonne, f1, f2], b: 0, e: e }; }
  function perso(x, y, peau, habit, bas, s) {
    bas = bas || "#2E3445";
    return "<g transform='translate(" + x + " " + y + ") scale(" + (s || 1) + ")'><ellipse cx='0' cy='84' rx='18' ry='4' fill='#001136' opacity='.18'/>" +
      "<rect x='-9' y='44' width='8' height='36' rx='3' fill='" + bas + "'/><rect x='1' y='44' width='8' height='36' rx='3' fill='" + bas + "'/>" +
      "<ellipse cx='-6' cy='81' rx='7' ry='3.5' fill='#1F2328'/><ellipse cx='6' cy='81' rx='7' ry='3.5' fill='#1F2328'/>" +
      "<path d='M-13 46L-16 18C-16 13 -12 11 -6 10H6C12 11 16 13 16 18L13 46Z' fill='" + habit + "'/>" +
      "<path d='M-15 16L-20 40' stroke='" + habit + "' stroke-width='7' stroke-linecap='round'/><path d='M15 16L20 40' stroke='" + habit + "' stroke-width='7' stroke-linecap='round'/>" +
      "<circle cx='-20' cy='42' r='3.6' fill='" + peau + "'/><circle cx='20' cy='42' r='3.6' fill='" + peau + "'/>" +
      "<rect x='-3.5' y='5' width='7' height='7' fill='" + peau + "'/><ellipse cx='0' cy='-2' rx='9' ry='10.5' fill='" + peau + "'/>" +
      "<path d='M-9 -4C-10 -14 -4 -13.5 0 -13.5S10 -14 9 -4C7 -9 -7 -9 -9 -4Z' fill='#1B1410'/></g>";
  }
  var PEAU = ["#6B4226", "#8A5A36", "#5A3620", "#7A4B2C"];
  function entrainement(a, b) { return "<div class='integ'><h3>Partie A : évaluation des ressources</h3>" + a + "<h3>Partie B : évaluation des compétences</h3>" + b + "</div>"; }


  /* ═══════════════════════ 6e — FRACTIONS : NUMÉRATEUR, DÉNOMINATEUR, FRACTIONS ÉGALES ═══════════════════════ */
  function bidon(x, y, h, part, n, col, lab) {
    var s = "<g transform='translate(" + x + " " + y + ")'><rect x='0' y='0' width='70' height='" + h + "' rx='10' fill='#F4F7FC' stroke='" + NUIT + "' stroke-width='2.5'/>", i, hp = h / n;
    for (i = 0; i < n; i++) s += "<rect x='2' y='" + (h - (i + 1) * hp + 1).toFixed(1) + "' width='66' height='" + (hp - 2).toFixed(1) + "' rx='4' fill='" + (i < part ? col : "transparent") + "' opacity='.85'/>" + (i ? "<path d='M0 " + (h - i * hp).toFixed(1) + "H70' stroke='" + NUIT + "' stroke-width='1' stroke-dasharray='4 3'/>" : "");
    return s + "<rect x='22' y='-12' width='26' height='14' rx='4' fill='" + NUIT + "'/>" + (lab ? txt(35, h + 22, lab, { s: 15, c: col }) : "") + "</g>";
  }
  VRT_L("6e-maths-fractions", {
    c: "6e", m: "maths", cle: "Numérateur, dénominateur, fractions égales", titre: "Les fractions : numérateur, dénominateur, fractions égales", duree: 30,
    accroche: "Aïcha verse les 3/4 du bidon, Paul les 6/8 : qui a versé le plus de jus de foléré ?",
    intro: "Pour la fête de fin d'année du CES de Mora, deux élèves remplissent la grande marmite de jus. Partie après partie, tu vas comparer leurs versements.",
    objectifs: ["lire et écrire une fraction (numérateur, dénominateur)", "reconnaître et fabriquer des fractions égales", "simplifier une fraction", "trouver l'inverse d'une fraction"],
    enquete: {
      titre: "Le jus de foléré de la fête",
      svg: (function () {
        var s = "<rect width='640' height='220' fill='#FFF3F6'/><rect y='176' width='640' height='44' fill='#E8D3AE'/>";
        s += bidon(70, 40, 120, 3, 4, "#C2185B", "3/4") + bidon(200, 40, 120, 6, 8, "#7B2CBF", "6/8");
        s += "<ellipse cx='470' cy='150' rx='100' ry='20' fill='#5A3620'/><path d='M370 150V110Q470 90 570 110V150Z' fill='#8A5A2D'/><ellipse cx='470' cy='110' rx='100' ry='20' fill='#B4245A'/>";
        s += perso(330, 92, PEAU[0], "#E07B1F", "#3A2A20", .85) + perso(600, 92, PEAU[2], "#1E6FD0", "#24324A", .85);
        s += "<rect x='300' y='14' width='320' height='34' rx='12' fill='#fff' stroke='#F2C1D1'/>" + txt(460, 36, "Bidons de 12 L · jus de foléré", { s: 12.5, c: "#C2185B" });
        return svg(640, 220, "Deux bidons de douze litres remplis aux trois quarts et aux six huitièmes, et une grande marmite", "", s);
      })(),
      legende: "CES de Mora : la marmite de jus de foléré pour la fête de fin d'année.",
      contexte: "<p>Chaque bidon contient <strong>12 L</strong>. Aïcha verse les <strong>3/4</strong> de son bidon dans la marmite ; Paul verse les <strong>6/8</strong> du sien.</p><p>Paul se vante : « 6 est plus grand que 3, j'ai versé plus ! » Aïcha répond : « Mes quarts sont plus gros que tes huitièmes, c'est moi ! »</p>",
      documents: [{ t: "Le bidon gradué", html: "<table class='donnees'><tr><td>Contenance</td><td>12 L</td></tr><tr><td>Graduation d'Aïcha</td><td>4 parts égales de 3 L</td></tr><tr><td>Graduation de Paul</td><td>8 parts égales de 1,5 L</td></tr></table>" }],
      question: "Qui a versé le plus de jus : Aïcha avec 3/4 ou Paul avec 6/8 ?",
      tache: "Explique ce que disent le numérateur et le dénominateur, compare les deux fractions et calcule les litres versés.",
      hypotheses: ["Paul a versé plus : 6 est plus grand que 3.", "Aïcha a versé plus : un quart est plus gros qu'un huitième.", "Ils ont versé autant : 3/4 et 6/8 sont deux écritures du même nombre."]
    },
    parties: [
      { t: "Numérateur et dénominateur",
        html: "<div class='def'><b>Définition</b>Dans la fraction <strong>a/b</strong> (b ≠ 0), le <strong>dénominateur</strong> b dit en combien de <strong>parts égales</strong> on partage l'unité ; le <strong>numérateur</strong> a dit combien de parts on prend.</div><div class='ex'><b>Les bidons</b>3/4 : le bidon est partagé en 4 parts de 3 L, Aïcha en verse 3, soit 3 × 3 = <strong>9 L</strong>. 6/8 : 8 parts de 1,5 L, Paul en verse 6, soit 6 × 1,5 = <strong>9 L</strong>.</div>",
        planches: [{ type: "2D", titre: "Ce que disent les deux nombres", legende: "Le dénominateur fixe la taille des parts, le numérateur leur nombre : 3 grosses parts ou 6 petites parts donnent la même quantité.", svg: (function () {
          var s = bidon(60, 30, 150, 3, 4, "#C2185B", "") + bidon(200, 30, 150, 6, 8, "#7B2CBF", "");
          s += txt(95, 206, "3 parts de 3 L", { s: 12, c: "#C2185B" }) + txt(235, 206, "6 parts de 1,5 L", { s: 12, c: "#7B2CBF" });
          s += "<rect x='340' y='40' width='270' height='140' rx='14' fill='#FFF6E3' stroke='#F2DFA6'/>" + txt(475, 86, "numérateur", { s: 13, c: "#C2185B" }) + "<text x='475' y='118' text-anchor='middle' font-size='34' font-weight='800' fill='" + NUIT + "'>3</text><path d='M445 128H505' stroke='" + NUIT + "' stroke-width='3'/><text x='475' y='160' text-anchor='middle' font-size='34' font-weight='800' fill='" + NUIT + "'>4</text>" + txt(560, 152, "dénominateur", { s: 12, c: BLEU });
          return svg(640, 222, "Deux bidons partagés en quatre et en huit parts, et la fraction trois quarts annotée", "", s);
        })() }, { type: "3d", titre: "Le bidon en quatre parts", legende: "Le bidon découpé en 4 tranches égales : 3 sont pleines de jus, 1 est vide. Le curseur sépare les tranches.",
          modele: { h: 340, rx: -20, ry: 26, echelle: .62, dy: 46, alt: "Bidon cylindrique découpé en quatre tranches dont trois remplies", eclate: "Séparer les quarts", jouer: "Découper le bidon",
            objets: [{ f: "boite", c: [0, -6, 0], d: [300, 8, 220], coul: "#C9B48A", dessus: "#D9C59E", div: false },
              { f: "cylindre", c: [0, 0, 0], r: 60, h: 48, n: 26, coul: "#C2185B", dessus: "#E05589", ec: [0, 0, 0] },
              { f: "cylindre", c: [0, 50, 0], r: 60, h: 48, n: 26, coul: "#C2185B", dessus: "#E05589", ec: [0, 30, 0] },
              { f: "cylindre", c: [0, 100, 0], r: 60, h: 48, n: 26, coul: "#C2185B", dessus: "#E05589", ec: [0, 60, 0] },
              { f: "cylindre", c: [0, 150, 0], r: 60, h: 48, n: 26, coul: "#DCE6F5", dessus: "#EEF3FA", op: .45, ec: [0, 90, 0] }],
            etiquettes: [{ p: [62, 24, 0], t: "1er quart : 3 L", cote: "d" }, { p: [62, 124, 0], t: "3e quart : 3 L", cote: "d", ec: [0, 60, 0] }, { p: [-62, 174, 0], t: "4e quart : vide", ec: [0, 90, 0] }] } }],
        fil: { html: "<p>Comparer seulement les numérateurs n'a pas de sens : les parts de Paul sont <strong>deux fois plus petites</strong>. Il faut tenir compte du dénominateur.</p>", verdicts: [[0, "rejetee", "6 > 3, mais 6 huitièmes sont des parts deux fois plus petites que 3 quarts."]] },
        retenir: "Dénominateur : nombre de parts égales ; numérateur : parts prises." },

      { t: "Les fractions égales",
        html: "<p class='formule'>On ne change pas une fraction en multipliant (ou en divisant) son numérateur et son dénominateur par un même nombre non nul.</p><div class='ex'><b>Exemple</b>3/4 = (3 × 2)/(4 × 2) = 6/8 = (3 × 3)/(4 × 3) = 9/12.</div><div class='astuce'><b>Astuce</b>Pour comparer deux fractions, on les écrit avec le <strong>même dénominateur</strong>, puis on compare les numérateurs.</div>",
        planches: [{ type: "2D", titre: "Trois écritures, une même quantité", legende: "3/4, 6/8 et 9/12 colorient exactement la même longueur de bande.", svg: (function () {
          var s = "", L = 480, rows = [[4, 3, "#C2185B"], [8, 6, "#7B2CBF"], [12, 9, "#1B998B"]], i, k;
          rows.forEach(function (r, j) { var y = 30 + j * 56, w = L / r[0]; for (k = 0; k < r[0]; k++) s += "<rect x='" + (110 + k * w).toFixed(1) + "' y='" + y + "' width='" + (w - 2).toFixed(1) + "' height='34' rx='4' fill='" + (k < r[1] ? r[2] : "#EEF1F6") + "'/>"; s += txt(70, y + 24, r[1] + "/" + r[0], { s: 18, c: r[2] }); });
          s += "<path d='M" + (110 + L * .75) + " 20V200' stroke='" + NUIT + "' stroke-width='2' stroke-dasharray='6 4'/>" + txt(110 + L * .75, 214, "même trait : même quantité", { s: 12 });
          return svg(640, 226, "Trois bandes coloriées aux trois quarts, aux six huitièmes et aux neuf douzièmes", "", s);
        })() }],
        fil: { html: "<p>3/4 = (3 × 2)/(4 × 2) = 6/8 : les deux fractions sont <strong>égales</strong>. Les quarts d'Aïcha sont plus gros, mais elle en verse deux fois moins.</p>", verdicts: [[1, "rejetee", "Les quarts sont plus gros, mais Aïcha en prend deux fois moins : 3 quarts = 6 huitièmes."]] },
        retenir: "a/b = (a × k)/(b × k) : multiplier en haut et en bas par le même nombre." },

      { t: "Simplifier ; l'inverse d'une fraction",
        html: "<p><strong>Simplifier</strong> une fraction, c'est diviser le numérateur et le dénominateur par un même nombre : 6/8 = (6 ÷ 2)/(8 ÷ 2) = <strong>3/4</strong>. Une fraction est <strong>irréductible</strong> quand on ne peut plus la simplifier.</p><div class='def'><b>Définition</b>L'<strong>inverse</strong> de a/b (a et b non nuls) est b/a : on échange numérateur et dénominateur. Leur produit vaut 1 : 3/4 × 4/3 = 12/12 = 1.</div>",
        planches: [{ type: "2D", titre: "Simplifier, puis inverser", legende: "6/8 se simplifie par 2 en 3/4, irréductible ; l'inverse de 3/4 est 4/3, et 3/4 × 4/3 = 1.", svg: (function () {
          var s = "<rect x='20' y='30' width='290' height='150' rx='14' fill='#EEF4FC' stroke='#C9D8EE'/>" + txt(165, 62, "simplifier par 2", { s: 13, c: BLEU });
          s += "<text x='90' y='120' text-anchor='middle' font-size='30' font-weight='800' fill='#7B2CBF'>6/8</text><path d='M130 112H190' stroke='" + BLEU + "' stroke-width='3' marker-end='url(#frF)'/>" + txt(160, 100, "÷ 2", { s: 13, c: BLEU }) + "<text x='240' y='120' text-anchor='middle' font-size='30' font-weight='800' fill='#C2185B'>3/4</text>" + txt(165, 160, "3/4 est irréductible", { s: 12.5, c: GRIS });
          s += "<rect x='330' y='30' width='290' height='150' rx='14' fill='#ECF7F0' stroke='#BFDCC9'/>" + txt(475, 62, "inverse", { s: 13, c: VERT }) + "<text x='420' y='120' text-anchor='middle' font-size='30' font-weight='800' fill='#C2185B'>3/4</text><path d='M455 112H500' stroke='" + VERT + "' stroke-width='3' marker-end='url(#frF2)'/><text x='540' y='120' text-anchor='middle' font-size='30' font-weight='800' fill='" + VERT + "'>4/3</text>" + txt(475, 160, "3/4 × 4/3 = 1", { s: 14 });
          return svg(640, 200, "Simplification de six huitièmes en trois quarts et inverse de trois quarts", fleche("frF", BLEU) + fleche("frF2", VERT), s);
        })() }],
        fil: { html: "<p>6/8 se simplifie en 3/4 : Aïcha et Paul ont versé <strong>9 L chacun</strong>, soit 18 L dans la marmite.</p>", verdicts: [[2, "validee", "3/4 = 6/8 : 9 L chacun, versements égaux."]] },
        retenir: "Simplifier : diviser en haut et en bas ; inverse de a/b : b/a." },

      { t: "Entraînement", html: entrainement(
        "<p><strong>Question de cours.</strong> Que représente le dénominateur d'une fraction ?</p><details><summary>Voir la réponse</summary><p>Le nombre de parts égales dans lesquelles on partage l'unité.</p></details><p><strong>Exercice.</strong> Complète : 2/5 = …/15 ; 12/18 = 2/… ; donne l'inverse de 5/7.</p><details><summary>Voir la réponse</summary><p>2/5 = 6/15 ; 12/18 = 2/3 ; l'inverse de 5/7 est 7/5.</p></details>",
        "<p><strong>Situation.</strong> Au champ de Mbouda, grand-père laisse 2/6 du terrain en jachère ; son voisin laisse 1/3 du sien. Les deux champs ont la même taille.</p><p><strong>Tâche.</strong> Qui laisse le plus de terrain en jachère ? Justifie avec des fractions égales.</p><details><summary>Voir une réponse attendue</summary><p>2/6 = (2 ÷ 2)/(6 ÷ 2) = 1/3 : ils laissent <strong>la même part</strong>.</p></details>"),
        retenir: "Savoir-être : partager équitablement." }
    ],
    denouement: {
      titre: "Égalité : 9 L chacun",
      etapes: ["Dénominateur = parts égales, numérateur = parts prises (indice 1).", "3/4 = 6/8 en multipliant en haut et en bas par 2 (indice 2).", "6/8 se simplifie en 3/4 : 9 L chacun (indice 3)."],
      reponse: "<p>Aïcha et Paul ont versé <strong>autant</strong> : 3/4 = 6/8, car 6/8 = (3 × 2)/(4 × 2). Chacun a versé 9 L sur 12 L. Paul ne regardait que les numérateurs ; Aïcha ne regardait que la taille des parts.</p>",
      transfert: "<p>Un troisième élève verse les 10/12 de son bidon. A-t-il versé plus ? <em>(10/12 = 5/6 et 3/4 = 9/12 : oui, 10 L contre 9 L.)</em></p>"
    },
    revision: ["Fraction a/b : <strong>dénominateur</strong> b = parts égales ; <strong>numérateur</strong> a = parts prises.", "Fractions égales : multiplier (ou diviser) numérateur et dénominateur par le <strong>même nombre</strong>.", "Simplifier : diviser en haut et en bas ; irréductible quand ce n'est plus possible.", "Inverse de a/b : <strong>b/a</strong> ; leur produit vaut 1."],
    exo: "<p>Range 1/2, 3/8 et 5/8 dans l'ordre croissant. <em>(1/2 = 4/8 : 3/8 < 1/2 < 5/8.)</em></p>",
    quiz: [
      q("Dans 5/7, le dénominateur est :", "7", "5", "12", "Le nombre de parts égales."),
      q("3/4 est égal à :", "6/8", "3/8", "4/3", "On multiplie en haut et en bas par 2."),
      q("12/16 simplifié au maximum donne :", "3/4", "6/8", "4/3", "On divise par 4."),
      q("L'inverse de 2/9 est :", "9/2", "2/9", "−2/9", "On échange les deux nombres."),
      q("2/3 × 3/2 vaut :", "1", "6/6 + 1", "4/9", "Un nombre fois son inverse = 1."),
      q("Les 3/4 de 12 L font :", "9 L", "4 L", "3 L", "12 ÷ 4 × 3."),
      q("Quelle fraction est la plus grande ?", "5/8", "1/2", "3/8", "1/2 = 4/8."),
      q("Une fraction irréductible :", "ne se simplifie plus", "a un numérateur nul", "est plus grande que 1", "Ex. : 3/4."),
      q("Pour comparer 2/5 et 3/10, on écrit :", "4/10 et 3/10", "2/10 et 3/10", "2/5 et 3/5", "Même dénominateur."),
      q("2/6 et 1/3 sont :", "égales", "différentes", "inverses", "2/6 = 1/3.")
    ],
    apc: { module: "Mathématiques de 6e", famille: "Vie sociale et économique", agir: "Partager et comparer des quantités", situation: "Deux élèves versent du jus de deux bidons gradués différemment.", tache: "Comparer deux fractions et calculer les quantités versées." }
  });

  /* ═══════════════════════ 6e — LES ANGLES ═══════════════════════ */
  function horloge(cx, cy, r, h, m) {
    var s = "<circle cx='" + cx + "' cy='" + cy + "' r='" + r + "' fill='#fff' stroke='" + NUIT + "' stroke-width='3'/>", i;
    for (i = 0; i < 12; i++) { var a = i * Math.PI / 6; s += "<path d='M" + (cx + r * .82 * Math.sin(a)).toFixed(1) + " " + (cy - r * .82 * Math.cos(a)).toFixed(1) + "L" + (cx + r * .94 * Math.sin(a)).toFixed(1) + " " + (cy - r * .94 * Math.cos(a)).toFixed(1) + "' stroke='" + NUIT + "' stroke-width='" + (i % 3 ? 1.5 : 3) + "'/>"; }
    var ah = (h % 12 + m / 60) * Math.PI / 6, am = m * Math.PI / 30;
    s += "<path d='M" + cx + " " + cy + "L" + (cx + r * .5 * Math.sin(ah)).toFixed(1) + " " + (cy - r * .5 * Math.cos(ah)).toFixed(1) + "' stroke='#C62828' stroke-width='5' stroke-linecap='round'/>";
    s += "<path d='M" + cx + " " + cy + "L" + (cx + r * .78 * Math.sin(am)).toFixed(1) + " " + (cy - r * .78 * Math.cos(am)).toFixed(1) + "' stroke='" + BLEU + "' stroke-width='3.5' stroke-linecap='round'/><circle cx='" + cx + "' cy='" + cy + "' r='4' fill='" + NUIT + "'/>";
    return s;
  }
  function typeAngle(d) { return d === 0 ? "nul" : d < 90 ? "aigu" : d === 90 ? "droit" : d < 180 ? "obtus" : d === 180 ? "plat" : "rentrant"; }
  VRT_L("6e-maths-angles", {
    c: "6e", m: "maths", cle: "Notions d'angle ou de secteur angulaire", titre: "Les angles : nommer, classer, mesurer", duree: 30,
    accroche: "À 4 heures, les aiguilles de l'horloge forment-elles un angle aigu ? Plus elles sont longues, plus l'angle est grand ?",
    intro: "La grande horloge de l'école publique de Kribi sert de rapporteur géant : à chaque heure, ses aiguilles dessinent un angle.",
    objectifs: ["nommer un angle par son sommet et ses côtés", "reconnaître un angle nul, aigu, droit, obtus, plat, rentrant", "mesurer un angle en degrés avec le rapporteur"],
    enquete: {
      titre: "L'horloge de l'école de Kribi",
      svg: (function () {
        var s = "<rect width='640' height='220' fill='#EAF4FB'/><rect y='180' width='640' height='40' fill='#E8D3AE'/><rect x='60' y='40' width='180' height='140' fill='#F3DDB0' stroke='#B9A57C'/>";
        s += horloge(150, 100, 52, 4, 0) + horloge(400, 110, 46, 1, 0) + horloge(520, 110, 46, 3, 0);
        s += txt(400, 176, "1 h", { s: 13 }) + txt(520, 176, "3 h", { s: 13 }) + txt(150, 170, "4 h : la cloche", { s: 12.5, c: "#C62828" });
        s += perso(300, 102, PEAU[1], "#1B998B", "#24324A", .85);
        return svg(640, 220, "La grande horloge de l'école marquant quatre heures et deux petites horloges à une heure et trois heures", "", s);
      })(),
      legende: "École publique de Kribi : la cloche sonne à 4 heures.",
      contexte: "<p>Le maître demande de classer les angles formés par les aiguilles à <strong>1 h, 3 h, 4 h et 6 h</strong>.</p><p>Ebanda dit : « Sur la grande horloge, les aiguilles sont plus longues, donc l'angle est plus grand. » Ngo Mbia ajoute : « À 4 h, l'angle est aigu, il est encore petit. »</p>",
      documents: [{ t: "Le cadran", html: "<table class='donnees'><tr><td>Tour complet</td><td>360°</td></tr><tr><td>12 heures</td><td>360° ÷ 12 = 30° par heure</td></tr></table>" }],
      question: "Quel angle forment les aiguilles à 1 h, 3 h, 4 h et 6 h, et de quel type est-il ?",
      tache: "Mesure ou calcule chaque angle en degrés, puis classe-le (aigu, droit, obtus, plat).",
      hypotheses: ["Plus les aiguilles sont longues, plus l'angle est grand.", "À 4 h, l'angle est aigu.", "L'angle dépend seulement de l'ouverture : 30° par heure, soit 30°, 90°, 120° et 180°."]
    },
    parties: [
      { t: "Nommer un angle",
        html: "<div class='def'><b>Définition</b>Deux demi-droites [Ox) et [Oy) de même origine O forment un <strong>angle</strong>, noté <strong>x̂Oy</strong>. O est le <strong>sommet</strong>, [Ox) et [Oy) sont les <strong>côtés</strong>. La partie du plan comprise entre les côtés est le <strong>secteur angulaire</strong>.</div><div class='attention'><b>Attention</b>La taille d'un angle ne dépend pas de la longueur de ses côtés : on peut prolonger les côtés sans changer l'angle.</div>",
        planches: [{ type: "2D", titre: "Sommet, côtés, secteur", legende: "L'angle x̂Oy : prolonger les côtés (en pointillés) ne change pas son ouverture.", svg: (function () {
          var s = "<path d='M120 190L300 190A180 180 0 0 0 247 63Z' fill='#EEF4FC'/><path d='M120 190H420' stroke='" + NUIT + "' stroke-width='3'/><path d='M120 190L300 30' stroke='" + NUIT + "' stroke-width='3'/><path d='M300 30L360 -23M420 190H520' stroke='" + NUIT + "' stroke-width='2' stroke-dasharray='6 5'/>";
          s += "<path d='M180 190A60 60 0 0 0 165 150' fill='none' stroke='#C62828' stroke-width='3'/>" + txt(112, 208, "O (sommet)", { s: 13 }) + txt(430, 182, "x", { s: 14 }) + txt(312, 34, "y", { s: 14 }) + txt(250, 150, "secteur angulaire", { s: 12, c: BLEU });
          s += "<rect x='470' y='40' width='150' height='70' rx='12' fill='#FFF6E3' stroke='#F2DFA6'/>" + txt(545, 82, "angle x̂Oy", { s: 16, c: "#8A6200" });
          return svg(640, 220, "Un angle de sommet O et de côtés Ox et Oy avec son secteur angulaire", "", s);
        })() }, { type: "3d", titre: "L'horloge de l'école à 4 heures", legende: "Fais tourner l'horloge : l'ouverture entre les aiguilles reste la même quelle que soit la vue. Le curseur avance les aiguilles.",
          modele: { h: 320, rx: -62, ry: 0, echelle: .85, dy: 10, alt: "Horloge murale carrée en relief avec ses deux aiguilles à quatre heures", eclate: "Décoller les aiguilles", jouer: "Voir l'angle",
            objets: (function () {
              var o = [{ f: "boite", c: [0, 7, 0], d: [250, 14, 250], coul: "#8A5A2D", dessus: "#FFFFFF" }], k;
              for (k = 0; k < 12; k++) o.push({ f: "boite", c: [Math.round(104 * Math.sin(k * Math.PI / 6)), 19, Math.round(104 * Math.cos(k * Math.PI / 6))], d: [k % 3 ? 6 : 10, 8, k % 3 ? 6 : 10], coul: "#001136", dessus: "#001136", div: false });
              for (k = 1; k <= 7; k++) o.push({ f: "sphere", c: [Math.round(k * 10 * .866), 24, Math.round(-k * 10 * .5)], r: 6, coul: "#C62828", ec: [0, 30, 0] });
              for (k = 1; k <= 10; k++) o.push({ f: "sphere", c: [0, 22, k * 9.5], r: 4.5, coul: "#1E499B", ec: [0, 50, 0] });
              o.push({ f: "sphere", c: [0, 24, 0], r: 8, coul: "#001136" });
              return o; })(),
            etiquettes: [{ p: [61, 24, -35], t: "petite aiguille sur 4", cote: "d", ec: [0, 30, 0] }, { p: [0, 22, 95], t: "grande aiguille sur 12", ec: [0, 50, 0] }] } }],
        fil: { html: "<p>Les aiguilles de la grande horloge sont plus longues, mais à la même heure leur <strong>ouverture</strong> est identique à celle des petites horloges : la longueur des côtés ne compte pas.</p>", verdicts: [[0, "rejetee", "Un angle mesure une ouverture, pas une longueur : à la même heure, grande et petite horloge font le même angle."]] },
        retenir: "Angle x̂Oy : sommet O, côtés [Ox) et [Oy) ; la longueur des côtés ne compte pas." },

      { t: "Classer les angles",
        html: "<table class='donnees'><tr><th>Angle</th><th>Mesure</th></tr><tr><td>nul</td><td>0°</td></tr><tr><td>aigu</td><td>entre 0° et 90°</td></tr><tr><td>droit</td><td>90°</td></tr><tr><td>obtus</td><td>entre 90° et 180°</td></tr><tr><td>plat</td><td>180°</td></tr><tr><td>rentrant</td><td>entre 180° et 360°</td></tr></table><div class='ex'><b>L'horloge</b>Entre deux chiffres voisins : 360° ÷ 12 = 30°. À 1 h : 30° (aigu) ; à 3 h : 90° (droit) ; à 4 h : 120° (<strong>obtus</strong>) ; à 6 h : 180° (plat).</div>",
        planches: [{ type: "2D", titre: "Les six familles d'angles", legende: "Du nul au rentrant : la mesure dit la famille.", svg: (function () {
          var s = "", T = [[0, "nul"], [40, "aigu"], [90, "droit"], [130, "obtus"], [180, "plat"], [250, "rentrant"]], i;
          T.forEach(function (t, k) { var cx = 60 + (k % 3) * 200, cy = 90 + Math.floor(k / 3) * 110, a = t[0] * Math.PI / 180, L = 70;
            s += "<path d='M" + cx + " " + cy + "H" + (cx + L) + "' stroke='" + NUIT + "' stroke-width='3'/><path d='M" + cx + " " + cy + "L" + (cx + L * Math.cos(a)).toFixed(1) + " " + (cy - L * Math.sin(a)).toFixed(1) + "' stroke='" + NUIT + "' stroke-width='3'/>";
            if (t[0] === 90) s += "<path d='M" + (cx + 14) + " " + cy + "V" + (cy - 14) + "H" + cx + "' fill='none' stroke='#C62828' stroke-width='2.5'/>";
            else if (t[0] > 0) s += "<path d='M" + (cx + 24) + " " + cy + "A24 24 0 " + (t[0] > 180 ? 1 : 0) + " 0 " + (cx + 24 * Math.cos(a)).toFixed(1) + " " + (cy - 24 * Math.sin(a)).toFixed(1) + "' fill='none' stroke='#C62828' stroke-width='2.5'/>";
            s += txt(cx + 40, cy + 30, t[1] + " · " + t[0] + "°", { s: 13, c: BLEU }); });
          return svg(640, 240, "Six angles : nul, aigu, droit, obtus, plat et rentrant avec leur mesure", "", s);
        })() }],
        fil: { html: "<p>À 4 h, l'écart vaut 4 × 30° = <strong>120°</strong> : plus que l'angle droit, c'est un angle <strong>obtus</strong>.</p>", verdicts: [[1, "rejetee", "4 × 30° = 120° > 90° : l'angle de 4 h est obtus, pas aigu."]] },
        retenir: "Aigu < 90° < obtus < 180° = plat ; droit = 90°." },

      { t: "Mesurer avec le rapporteur",
        html: "<ol><li>Placer le <strong>centre</strong> du rapporteur sur le sommet de l'angle.</li><li>Aligner la <strong>graduation 0</strong> sur un côté.</li><li>Lire la mesure sur la graduation qui part de ce 0, là où passe l'autre côté.</li></ol><div class='astuce'><b>Astuce</b>Avant de lire, estime : aigu ou obtus ? Tu évites de lire sur la mauvaise graduation (60° au lieu de 120°).</div>",
        planches: [{ type: "2D", titre: "Lire 120° sur le rapporteur", legende: "Le 0 de la graduation intérieure est sur le côté horizontal : l'autre côté passe par 120°.", svg: (function () {
          var cx = 320, cy = 190, R = 150, s = "<path d='M" + (cx - R) + " " + cy + "A" + R + " " + R + " 0 0 1 " + (cx + R) + " " + cy + "Z' fill='#EEF4FC' stroke='" + BLEU + "' stroke-width='2'/>", i;
          for (i = 0; i <= 180; i += 10) { var a = i * Math.PI / 180; s += "<path d='M" + (cx + R * Math.cos(a)).toFixed(1) + " " + (cy - R * Math.sin(a)).toFixed(1) + "L" + (cx + (R - (i % 30 ? 8 : 16)) * Math.cos(a)).toFixed(1) + " " + (cy - (R - (i % 30 ? 8 : 16)) * Math.sin(a)).toFixed(1) + "' stroke='" + BLEU + "' stroke-width='1.5'/>"; if (i % 30 === 0) s += txt((cx + (R - 30) * Math.cos(a)).toFixed(1), (cy - (R - 30) * Math.sin(a) + 4).toFixed(1), i, { s: 11, c: BLEU }); }
          var b = 120 * Math.PI / 180;
          s += "<path d='M" + cx + " " + cy + "H" + (cx + R + 30) + "' stroke='" + NUIT + "' stroke-width='3'/><path d='M" + cx + " " + cy + "L" + (cx + (R + 30) * Math.cos(b)).toFixed(1) + " " + (cy - (R + 30) * Math.sin(b)).toFixed(1) + "' stroke='#C62828' stroke-width='3'/><circle cx='" + cx + "' cy='" + cy + "' r='4' fill='" + NUIT + "'/>" + txt(cx + 10, cy + 18, "centre sur le sommet", { s: 11.5, a: "start" });
          return svg(640, 214, "Un rapporteur placé sur un angle de 120 degrés", "", s);
        })() }],
        fil: { html: "<p>Les mesures sont 30° (1 h), 90° (3 h), 120° (4 h) et 180° (6 h) : seule l'ouverture compte.</p>", verdicts: [[2, "validee", "30° par heure : 30° aigu, 90° droit, 120° obtus, 180° plat."]] },
        retenir: "Rapporteur : centre sur le sommet, 0 sur un côté, lire sur la même graduation." },

      { t: "Entraînement", html: entrainement(
        "<p><strong>Question de cours.</strong> Qu'est-ce qu'un angle obtus ?</p><details><summary>Voir la réponse</summary><p>Un angle dont la mesure est comprise entre 90° et 180°.</p></details><p><strong>Exercice.</strong> Quel angle forment les aiguilles à 2 h ? à 5 h ? Classe-les.</p><details><summary>Voir la réponse</summary><p>2 h : 60°, aigu ; 5 h : 150°, obtus.</p></details>",
        "<p><strong>Situation.</strong> Le menuisier de Sangmélima fabrique le toit d'une case : les deux pentes doivent former au sommet un angle de 120°.</p><p><strong>Tâche.</strong> Dis de quel type est cet angle et explique comment le vérifier avec un rapporteur.</p><details><summary>Voir une réponse attendue</summary><p>120° est un angle <strong>obtus</strong>. On place le centre du rapporteur au sommet du toit, le 0 sur une pente, et on lit 120° là où passe l'autre pente.</p></details>"),
        retenir: "Savoir-être : soin et précision dans les tracés." }
    ],
    denouement: {
      titre: "30°, 90°, 120°, 180°",
      etapes: ["Un angle mesure une ouverture, pas une longueur (indice 1).", "30° par heure : 4 h → 120°, obtus (indice 2).", "Rapporteur : centre au sommet, 0 sur un côté (indice 3)."],
      reponse: "<p>À <strong>1 h</strong> : 30°, aigu ; à <strong>3 h</strong> : 90°, droit ; à <strong>4 h</strong> : 120°, obtus ; à <strong>6 h</strong> : 180°, plat. La longueur des aiguilles ne change rien (Ebanda avait tort) et 120° n'est pas aigu (Ngo Mbia avait tort).</p>",
      transfert: "<p>Quel angle forment les aiguilles à 9 h ? à 10 h ? <em>(9 h : 90°, droit ; 10 h : 60°, aigu, car on prend le plus petit angle.)</em></p>"
    },
    revision: ["Angle x̂Oy : <strong>sommet</strong> O, <strong>côtés</strong> [Ox) et [Oy).", "Nul 0° ; aigu < 90° ; <strong>droit 90°</strong> ; obtus entre 90° et 180° ; <strong>plat 180°</strong> ; rentrant > 180°.", "Rapporteur : centre sur le sommet, 0 sur un côté.", "La longueur des côtés ne change pas l'angle."],
    exo: "<p>Un angle de 75° et un angle de 105° : de quel type sont-ils, et que vaut leur somme ? <em>(Aigu et obtus ; 180°, un angle plat.)</em></p>",
    quiz: [
      q("Un angle de 90° est :", "droit", "aigu", "plat", "Le coin d'une feuille."),
      q("Un angle de 120° est :", "obtus", "aigu", "rentrant", "Entre 90° et 180°."),
      q("À 3 h, les aiguilles forment :", "90°", "30°", "180°", "3 × 30°."),
      q("Le sommet de l'angle x̂Oy est :", "O", "x", "y", "La lettre du milieu."),
      q("Allonger les côtés d'un angle :", "ne change pas sa mesure", "l'agrandit", "le rend plat", "Seule l'ouverture compte."),
      q("Un angle plat mesure :", "180°", "90°", "360°", "Une demi-droite et son prolongement."),
      q("Pour mesurer, on place le centre du rapporteur :", "sur le sommet", "sur un côté", "n'importe où", "Puis le 0 sur un côté."),
      q("Un angle de 30° est :", "aigu", "obtus", "droit", "Inférieur à 90°."),
      q("À 6 h, les aiguilles forment :", "un angle plat", "un angle droit", "un angle nul", "180°."),
      q("Un angle de 250° est :", "rentrant", "obtus", "plat", "Plus de 180°.")
    ],
    apc: { module: "Mathématiques de 6e", famille: "Environnement et vie quotidienne", agir: "Lire et mesurer des angles autour de soi", situation: "Les aiguilles de l'horloge de l'école.", tache: "Mesurer et classer les angles formés à différentes heures." }
  });

  /* ═══════════════════════ 6e — SYMÉTRIE ORTHOGONALE ═══════════════════════ */
  function grille(x, y, n, m, c) { var s = "", i; for (i = 0; i <= n; i++) s += "<path d='M" + (x + i * c) + " " + y + "V" + (y + m * c) + "' stroke='#DCE3EF'/>"; for (i = 0; i <= m; i++) s += "<path d='M" + x + " " + (y + i * c) + "H" + (x + n * c) + "' stroke='#DCE3EF'/>"; return s; }
  VRT_L("6e-maths-symetrie-axiale", {
    c: "6e", m: "maths", cle: "Points symétriques par rapport à une droite", titre: "La symétrie orthogonale (par rapport à une droite)", duree: 30,
    accroche: "L'artisan a peint la moitié du motif ndop sur le mur : comment l'apprenti doit-il peindre l'autre moitié, exactement ?",
    intro: "À Bamenda, on décore la façade de la maison du chef avec un motif symétrique. Partie après partie, tu deviens l'apprenti qui complète le dessin.",
    objectifs: ["construire le symétrique d'un point par rapport à une droite", "construire le symétrique d'une figure sur quadrillage", "utiliser la conservation des longueurs et des angles", "trouver les axes de symétrie d'une figure"],
    enquete: {
      titre: "Le motif ndop de la façade",
      svg: (function () {
        var s = "<rect width='640' height='220' fill='#F4F1EA'/><rect x='120' y='20' width='400' height='170' fill='#1C2A55'/>";
        s += "<path d='M320 20V190' stroke='#FFC93C' stroke-width='3' stroke-dasharray='8 6'/>";
        s += "<path d='M320 50L260 80L300 105L240 140L320 170' fill='none' stroke='#fff' stroke-width='6' stroke-linejoin='round'/><circle cx='270' cy='60' r='9' fill='#fff'/><path d='M200 120h30v30h-30z' fill='none' stroke='#fff' stroke-width='5'/>";
        s += "<path d='M320 50L380 80L340 105L400 140L320 170' fill='none' stroke='#fff' stroke-width='3' stroke-dasharray='4 6' opacity='.55'/>";
        s += perso(570, 100, PEAU[3], "#7B2CBF", "#3A2A20", .9) + txt(320, 210, "axe de symétrie", { s: 12, c: "#8A6200" });
        return svg(640, 220, "Un mur indigo portant la moitié gauche d'un motif ndop blanc et un axe vertical en pointillés", "", s);
      })(),
      legende: "Bamenda : la façade décorée au motif ndop, indigo et blanc.",
      contexte: "<p>Le maître-artisan a peint la moitié gauche du motif. L'apprenti doit peindre la moitié droite pour que le motif soit <strong>symétrique par rapport à l'axe</strong> jaune.</p><p>Tamo propose : « Je recopie le dessin à côté, en le faisant glisser. » Fon propose : « Je le recopie à l'envers, de haut en bas. »</p>",
      documents: [{ t: "Les mesures du maître", html: "<table class='donnees'><tr><td>Le rond</td><td>à 50 cm à gauche de l'axe, à 40 cm du haut</td></tr><tr><td>Le carré</td><td>côté 30 cm, à 90 cm de l'axe</td></tr></table>" }],
      question: "Comment placer exactement chaque point de la moitié droite ?",
      tache: "Pour chaque point du motif, construis son symétrique par rapport à l'axe et vérifie les longueurs.",
      hypotheses: ["On fait glisser le dessin vers la droite.", "On retourne le dessin de haut en bas.", "Chaque point a son symétrique de l'autre côté de l'axe, sur la perpendiculaire à l'axe, à la même distance."]
    },
    parties: [
      { t: "Le symétrique d'un point",
        html: "<div class='def'><b>Définition</b>Le <strong>symétrique</strong> du point A par rapport à la droite (d) est le point A' tel que (d) soit la <strong>médiatrice</strong> du segment [AA'] : [AA'] est perpendiculaire à (d) et coupé en son milieu par (d). Si A est sur (d), il est son propre symétrique.</div><ol><li>Tracer la perpendiculaire à (d) passant par A (équerre).</li><li>Reporter de l'autre côté la même distance (compas ou règle).</li></ol>",
        planches: [{ type: "2D", titre: "A et son symétrique A'", legende: "(d) coupe [AA'] en son milieu H, à angle droit : HA = HA'.", svg: (function () {
          var s = grille(40, 20, 28, 9, 20) + "<path d='M320 10V210' stroke='#C62828' stroke-width='3'/>" + txt(334, 26, "(d)", { s: 14, c: "#C62828", a: "start" });
          s += "<path d='M200 110H440' stroke='" + BLEU + "' stroke-width='2.5' stroke-dasharray='6 4'/><circle cx='200' cy='110' r='6' fill='" + BLEU + "'/><circle cx='440' cy='110' r='6' fill='" + VERT + "'/>" + txt(190, 100, "A", { s: 15 }) + txt(452, 100, "A'", { s: 15 }) + "<path d='M320 98H332V110' fill='none' stroke='" + NUIT + "' stroke-width='2'/>" + txt(308, 128, "H", { s: 13 });
          s += txt(260, 150, "6 carreaux", { s: 12, c: BLEU }) + txt(380, 150, "6 carreaux", { s: 12, c: VERT });
          return svg(640, 220, "Un point A, sa perpendiculaire à la droite d et son symétrique A prime à la même distance", "", s);
        })() }, { type: "3d", titre: "Le miroir", legende: "Le plan de l'axe agit comme un miroir : chaque cube a son jumeau à la même distance de l'autre côté. Le curseur éloigne les jumeaux du miroir… ensemble.",
          modele: { h: 320, rx: -22, ry: 34, echelle: .75, dy: 20, alt: "Un miroir vertical avec des cubes colorés et leurs images symétriques", eclate: "Éloigner du miroir", jouer: "Voir les jumeaux",
            objets: [{ f: "boite", c: [0, -6, 0], d: [420, 8, 260], coul: "#C9B48A", dessus: "#E3D6B6", div: false },
              { f: "boite", c: [0, 70, 0], d: [4, 150, 240], coul: "#9EC9E8", dessus: "#CFE6F6", op: .35, div: false },
              { f: "boite", c: [-80, 20, -60], d: [40, 40, 40], coul: "#C62828", dessus: "#E05555", ec: [-40, 0, 0] },
              { f: "boite", c: [80, 20, -60], d: [40, 40, 40], coul: "#C62828", dessus: "#E05555", ec: [40, 0, 0] },
              { f: "sphere", c: [-140, 25, 60], r: 25, coul: "#1B998B", ec: [-40, 0, 0] },
              { f: "sphere", c: [140, 25, 60], r: 25, coul: "#1B998B", ec: [40, 0, 0] }],
            etiquettes: [{ p: [0, 150, 0], t: "l'axe (plan miroir)" }, { p: [80, 40, -60], t: "même distance au miroir", cote: "d", ec: [40, 0, 0] }] } }],
        fil: { html: "<p>Faire glisser le dessin le décale entier vers la droite : le rond, collé à 50 cm à gauche de l'axe, se retrouverait loin à droite, pas à 50 cm. La symétrie <strong>retourne</strong> le dessin autour de l'axe.</p>", verdicts: [[0, "rejetee", "Un glissement (translation) n'est pas une symétrie : le motif doit se retourner autour de l'axe."]] },
        retenir: "A' symétrique de A : (d) est la médiatrice de [AA']." },

      { t: "Construire le symétrique d'une figure",
        html: "<p>Pour construire le symétrique d'une figure, on construit le symétrique de ses <strong>points importants</strong> (sommets, centre d'un cercle…), puis on relie.</p><div class='ex'><b>Sur quadrillage</b>Avec un axe vertical, on compte les carreaux horizontalement de chaque côté ; la hauteur ne change pas.</div><div class='attention'><b>Attention</b>Retourner de haut en bas, c'est une symétrie par rapport à un axe <strong>horizontal</strong> : ce n'est pas l'axe de la façade.</div>",
        planches: [{ type: "2D", titre: "Le motif complété", legende: "Chaque sommet de la moitié gauche a son image à la même distance de l'axe, à la même hauteur.", svg: (function () {
          var s = grille(40, 10, 28, 10, 20) + "<path d='M320 0V220' stroke='#C62828' stroke-width='3'/>";
          var P = [[320, 30], [260, 70], [300, 110], [220, 150], [320, 190]];
          s += "<path d='M" + P.map(function (p) { return p.join(" "); }).join("L") + "' fill='none' stroke='" + BLEU + "' stroke-width='5' stroke-linejoin='round'/>";
          s += "<path d='M" + P.map(function (p) { return (640 - p[0]) + " " + p[1]; }).join("L") + "' fill='none' stroke='" + VERT + "' stroke-width='5' stroke-linejoin='round'/>";
          P.forEach(function (p) { if (p[0] !== 320) s += "<path d='M" + p[0] + " " + p[1] + "H" + (640 - p[0]) + "' stroke='#8A93A6' stroke-width='1.2' stroke-dasharray='3 4'/>"; });
          s += "<circle cx='270' cy='50' r='9' fill='" + BLEU + "'/><circle cx='370' cy='50' r='9' fill='" + VERT + "'/><rect x='140' y='130' width='30' height='30' fill='none' stroke='" + BLEU + "' stroke-width='4'/><rect x='470' y='130' width='30' height='30' fill='none' stroke='" + VERT + "' stroke-width='4'/>";
          return svg(640, 222, "Motif en zigzag, rond et carré à gauche de l'axe et leurs symétriques à droite", "", s);
        })() }],
        fil: { html: "<p>Retourner de haut en bas mettrait le rond en bas : ce n'est pas la symétrie par rapport à l'axe <strong>vertical</strong> de la façade.</p>", verdicts: [[1, "rejetee", "De haut en bas, c'est la symétrie par rapport à un axe horizontal, pas l'axe vertical du mur."]] },
        retenir: "Symétrique d'une figure : symétriques des sommets, puis on relie." },

      { t: "Propriétés et axes de symétrie",
        html: "<p>La symétrie orthogonale <strong>conserve</strong> les longueurs, les angles, l'alignement et les aires : le symétrique d'un segment est un segment de même longueur, celui d'un cercle un cercle de même rayon.</p><div class='def'><b>Axe de symétrie</b>Une droite est un <strong>axe de symétrie</strong> d'une figure si la figure est son propre symétrique par rapport à elle (pliage : les deux moitiés se superposent).</div><ul><li>Rectangle : 2 axes ; carré : 4 ; losange : 2 ; triangle équilatéral : 3 ; cercle : une infinité (tous ses diamètres).</li></ul>",
        planches: [{ type: "2D", titre: "Combien d'axes ?", legende: "Les axes de symétrie en pointillés rouges : 2 pour le rectangle, 4 pour le carré, 3 pour le triangle équilatéral.", svg: (function () {
          var s = "<rect x='40' y='60' width='140' height='90' fill='#EEF4FC' stroke='" + BLEU + "' stroke-width='3'/><path d='M110 40V170M20 105H200' stroke='#C62828' stroke-width='2' stroke-dasharray='6 4'/>" + txt(110, 196, "rectangle : 2", { s: 13 });
          s += "<rect x='260' y='45' width='110' height='110' fill='#ECF7F0' stroke='" + VERT + "' stroke-width='3'/><path d='M315 30V170M245 100H385M250 35L380 165M380 35L250 165' stroke='#C62828' stroke-width='2' stroke-dasharray='6 4'/>" + txt(315, 196, "carré : 4", { s: 13 });
          s += "<path d='M520 45L585 155H455Z' fill='#FFF6E3' stroke='#C2540A' stroke-width='3'/><path d='M520 30V170M600 168L470 95M440 168L570 95' stroke='#C62828' stroke-width='2' stroke-dasharray='6 4'/>" + txt(520, 196, "équilatéral : 3", { s: 13 });
          return svg(640, 210, "Un rectangle avec deux axes, un carré avec quatre axes et un triangle équilatéral avec trois axes", "", s);
        })() }],
        fil: { html: "<p>Chaque point de droite est le symétrique d'un point de gauche : le rond à 50 cm de l'axe, le carré de 30 cm de côté à 90 cm, à la même hauteur. Les longueurs se conservent.</p>", verdicts: [[2, "validee", "Perpendiculaire à l'axe, même distance : le motif complet est symétrique."]] },
        retenir: "La symétrie conserve longueurs, angles, alignement et aires." },

      { t: "Entraînement", html: entrainement(
        "<p><strong>Question de cours.</strong> Quand dit-on que A' est le symétrique de A par rapport à (d) ?</p><details><summary>Voir la réponse</summary><p>Quand (d) est la médiatrice du segment [AA'].</p></details><p><strong>Exercice.</strong> Combien d'axes de symétrie ont un losange, un cercle et la lettre H ?</p><details><summary>Voir la réponse</summary><p>Losange : 2 ; cercle : une infinité ; H : 2.</p></details>",
        "<p><strong>Situation.</strong> Le club de dessin de Bafoussam reproduit un masque bamiléké dont on ne voit que la moitié gauche, avec son axe vertical.</p><p><strong>Tâche.</strong> Explique la méthode pour compléter le masque et cite deux propriétés que tu vérifies.</p><details><summary>Voir une réponse attendue</summary><p>Pour chaque point important, on trace la perpendiculaire à l'axe et on reporte la même distance de l'autre côté, puis on relie. On vérifie que les longueurs et les angles du côté droit sont égaux à ceux du côté gauche.</p></details>"),
        retenir: "Savoir-être : valoriser le patrimoine artistique camerounais." }
    ],
    denouement: {
      titre: "Perpendiculaire, même distance",
      etapes: ["Symétrique d'un point : (d) médiatrice de [AA'] (indice 1).", "On construit les symétriques des sommets, puis on relie (indice 2).", "Longueurs et angles conservés : le motif est complet (indice 3)."],
      reponse: "<p>Pour chaque point du motif, l'apprenti trace la <strong>perpendiculaire à l'axe</strong> et reporte la <strong>même distance</strong> de l'autre côté : le rond va à 50 cm à droite de l'axe, à 40 cm du haut ; le carré de 30 cm à 90 cm à droite. Ni glissement (Tamo) ni retournement de haut en bas (Fon).</p>",
      transfert: "<p>Le maître ajoute un triangle dont un sommet est sur l'axe. Où est le symétrique de ce sommet ? <em>(Il reste à sa place : un point de l'axe est son propre symétrique.)</em></p>"
    },
    revision: ["A' symétrique de A par rapport à (d) : <strong>(d) médiatrice de [AA']</strong>.", "Construction : perpendiculaire à (d), puis même distance de l'autre côté.", "Un point de l'axe est son propre symétrique.", "La symétrie conserve <strong>longueurs, angles, alignement, aires</strong>.", "Axes : rectangle 2, carré 4, triangle équilatéral 3, cercle infinité."],
    exo: "<p>Sur un quadrillage, A est à 3 carreaux à gauche d'un axe vertical. Où est A' ? <em>(À 3 carreaux à droite, sur la même ligne.)</em></p>",
    quiz: [
      q("Le symétrique de A par rapport à (d) est A' si :", "(d) est la médiatrice de [AA']", "A et A' sont du même côté", "AA' = 2 cm", "Perpendiculaire et milieu."),
      q("Un point situé sur l'axe a pour symétrique :", "lui-même", "aucun point", "un point au loin", "Distance nulle."),
      q("La symétrie orthogonale conserve :", "les longueurs et les angles", "seulement les angles", "rien", "Et l'alignement, les aires."),
      q("Le carré a :", "4 axes de symétrie", "2 axes", "1 axe", "Médianes et diagonales."),
      q("Le cercle a :", "une infinité d'axes", "2 axes", "aucun axe", "Tous ses diamètres."),
      q("A est à 5 carreaux de l'axe : A' est à", "5 carreaux de l'autre côté", "10 carreaux", "2,5 carreaux", "Même distance."),
      q("Faire glisser un dessin, c'est :", "une translation, pas une symétrie", "une symétrie", "une rotation", "Le dessin n'est pas retourné."),
      q("Le symétrique d'un segment de 4 cm mesure :", "4 cm", "8 cm", "2 cm", "Conservation des longueurs."),
      q("Le rectangle (non carré) a :", "2 axes", "4 axes", "aucun", "Ses médianes."),
      q("Pour construire A', on trace d'abord :", "la perpendiculaire à (d) passant par A", "la parallèle à (d)", "un cercle de centre A", "Avec l'équerre.")
    ],
    apc: { module: "Mathématiques de 6e", famille: "Art et culture", agir: "Reproduire un motif symétrique", situation: "Compléter un motif ndop symétrique sur une façade.", tache: "Construire les symétriques des points du motif et vérifier les longueurs." }
  });

  /* ═══════════════════════ SIMULATIONS ═══════════════════════ */
  function $(el, s) { return el.querySelector(s); }
  function curseur(lib, min, max, pas, val, unite) {
    return "<label class='labo-c'><span>" + lib + " : <b data-v>" + val + "</b>" + (unite || "") + "</span><input type='range' min='" + min + "' max='" + max + "' step='" + pas + "' value='" + val + "'></label>";
  }
  /* Fractions : deux fractions côte à côte, comparées en litres */
  VRT_A("6e-maths-fractions", 1, "Compare deux fractions du bidon de 12 L", function (el) {
    el.innerHTML = "<div style='display:flex;flex-wrap:wrap;gap:6px 18px'>" + curseur("Numérateur A", 0, 12, 1, 3) + curseur("Dénominateur A", 1, 12, 1, 4) + curseur("Numérateur B", 0, 12, 1, 6) + curseur("Dénominateur B", 1, 12, 1, 8) + "</div><svg viewBox='0 0 640 170' class='an-svg' data-s></svg><p class='labo-r' data-r></p>";
    var I = el.querySelectorAll("input"), V = el.querySelectorAll("[data-v]"), sv = $(el, "[data-s]");
    function maj() {
      var a = +I[0].value, b = +I[1].value, c = +I[2].value, d = +I[3].value; if (a > b) { a = b; I[0].value = a; } if (c > d) { c = d; I[2].value = c; }
      [a, b, c, d].forEach(function (v, k) { V[k].textContent = v; });
      sv.innerHTML = bidon(150, 20, 120, a, b, "#C2185B", a + "/" + b) + bidon(420, 20, 120, c, d, "#7B2CBF", c + "/" + d);
      var la = 12 * a / b, lb = 12 * c / d, f = function (x) { return x.toLocaleString("fr-FR", { maximumFractionDigits: 2 }); };
      $(el, "[data-r]").innerHTML = a + "/" + b + " de 12 L = <b>" + f(la) + " L</b> · " + c + "/" + d + " de 12 L = <b>" + f(lb) + " L</b> · " + (Math.abs(la - lb) < 1e-9 ? "<b>fractions égales</b> : " + a + " × " + d + " = " + b + " × " + c + " = " + (a * d) + "." : la > lb ? "A est plus grand." : "B est plus grand.");
    }
    I.forEach(function (x) { x.addEventListener("input", maj); }); maj();
  });
  /* Angles : l'heure → l'angle, son type, et le dessin */
  VRT_A("6e-maths-angles", 1, "Choisis l'heure : quel angle font les aiguilles ?", function (el) {
    el.innerHTML = curseur("Heure", 0, 11, 1, 4, " h") + "<svg viewBox='0 0 640 200' class='an-svg' data-s></svg><p class='labo-r' data-r></p>";
    var I = $(el, "input"), V = $(el, "[data-v]"), sv = $(el, "[data-s]");
    function maj() {
      var h = +I.value, a = h * 30, pa = a > 180 ? 360 - a : a;
      V.textContent = h;
      var s = horloge(150, 100, 80, h, 0), cx = 420, cy = 150, r = pa * Math.PI / 180;
      s += "<path d='M" + cx + " " + cy + "H" + (cx + 140) + "' stroke='#001136' stroke-width='3'/><path d='M" + cx + " " + cy + "L" + (cx + 140 * Math.cos(r)).toFixed(1) + " " + (cy - 140 * Math.sin(r)).toFixed(1) + "' stroke='#C62828' stroke-width='3'/>";
      if (pa > 0 && pa !== 90) s += "<path d='M" + (cx + 40) + " " + cy + "A40 40 0 0 0 " + (cx + 40 * Math.cos(r)).toFixed(1) + " " + (cy - 40 * Math.sin(r)).toFixed(1) + "' fill='none' stroke='#1E499B' stroke-width='3'/>";
      if (pa === 90) s += "<path d='M" + (cx + 18) + " " + cy + "V" + (cy - 18) + "H" + cx + "' fill='none' stroke='#1E499B' stroke-width='3'/>";
      sv.innerHTML = s;
      $(el, "[data-r]").innerHTML = "À " + h + " h : " + h + " × 30° = " + a + "°" + (a > 180 ? ", soit le petit angle 360° − " + a + "° = " + pa + "°" : "") + " · angle <b>" + typeAngle(pa) + "</b>.";
    }
    I.addEventListener("input", maj); maj();
  });
  /* Symétrie : place un point, vois son symétrique */
  VRT_A("6e-maths-symetrie-axiale", 0, "Déplace le point A : où est son symétrique ?", function (el) {
    el.innerHTML = "<div style='display:flex;flex-wrap:wrap;gap:6px 18px'>" + curseur("Distance à l'axe", -12, 12, 1, -6, " carreaux") + curseur("Hauteur", 1, 8, 1, 4) + "</div><svg viewBox='0 0 640 220' class='an-svg' data-s></svg><p class='labo-r' data-r></p>";
    var I = el.querySelectorAll("input"), V = el.querySelectorAll("[data-v]"), sv = $(el, "[data-s]");
    function maj() {
      var dx = +I[0].value, y = +I[1].value, c = 20, ax = 320, py = 200 - y * c, x = ax + dx * c, x2 = ax - dx * c;
      V[0].textContent = dx; V[1].textContent = y;
      var s = grille(40, 20, 28, 9, 20) + "<path d='M320 10V210' stroke='#C62828' stroke-width='3'/>";
      s += "<path d='M" + x + " " + py + "H" + x2 + "' stroke='#1E499B' stroke-width='2' stroke-dasharray='5 4'/><circle cx='" + x + "' cy='" + py + "' r='7' fill='#1E499B'/><circle cx='" + x2 + "' cy='" + py + "' r='7' fill='#17784D'/>";
      s += "<text x='" + x + "' y='" + (py - 12) + "' font-size='14' font-weight='700' text-anchor='middle'>A</text><text x='" + x2 + "' y='" + (py - 12) + "' font-size='14' font-weight='700' text-anchor='middle' fill='#17784D'>A'</text>";
      sv.innerHTML = s;
      $(el, "[data-r]").innerHTML = dx === 0 ? "A est sur l'axe : <b>il est son propre symétrique</b>." : "A est à " + Math.abs(dx) + " carreau" + (Math.abs(dx) > 1 ? "x" : "") + " " + (dx < 0 ? "à gauche" : "à droite") + " de l'axe : A' est à <b>" + Math.abs(dx) + " carreau" + (Math.abs(dx) > 1 ? "x" : "") + " " + (dx < 0 ? "à droite" : "à gauche") + "</b>, à la même hauteur. [AA'] mesure " + (2 * Math.abs(dx)) + " carreaux et l'axe le coupe en son milieu, à angle droit.";
    }
    I.forEach(function (x) { x.addEventListener("input", maj); }); maj();
  });
})();
