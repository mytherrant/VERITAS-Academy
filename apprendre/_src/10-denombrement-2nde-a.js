/* Dénombrement de 2nde A (rangs 26 à 28), gabarit des leçons APPROFONDIES (16/11/2026) :
   situation-problème, indices, planches 2D et 3D, dénouement. Leçons publiques (la 2nde est en libre accès). */
(function () {
  "use strict";
  var NUIT = "#001136", BLEU = "#1E499B", OR = "#FFC93C", GRIS = "#4D5163";
  var COUL = { R: ["#FFB3B3", "#E8394B", "#B0182C", "#5E0812"], V: ["#BDF2D2", "#36B37A", "#17784D", "#093D26"], B: ["#CFE0FF", "#4F86E0", "#2155B0", "#0E2A62"], J: ["#FFF1C2", "#F2C540", "#C48A0C", "#6D4A00"] };

  /* ── dessin 2D ── */
  function defs(g) {
    var s = "<defs>";
    for (var k in COUL) { var c = COUL[k]; s += "<radialGradient id='" + g + k + "' cx='35%' cy='30%' r='75%'><stop offset='0' stop-color='" + c[0] + "'/><stop offset='.28' stop-color='" + c[1] + "'/><stop offset='.72' stop-color='" + c[2] + "'/><stop offset='1' stop-color='" + c[3] + "'/></radialGradient>"; }
    s += "<linearGradient id='" + g + "verre' x1='0' x2='1'><stop offset='0' stop-color='#EAF6FB' stop-opacity='.95'/><stop offset='.45' stop-color='#D6EBF3' stop-opacity='.55'/><stop offset='1' stop-color='#9CC3D4' stop-opacity='.8'/></linearGradient>";
    s += "<linearGradient id='" + g + "bois' x1='0' y1='0' x2='0' y2='1'><stop offset='0' stop-color='#D9A86A'/><stop offset='.5' stop-color='#B9824A'/><stop offset='1' stop-color='#8A5A2D'/></linearGradient>";
    s += "<linearGradient id='" + g + "sac' x1='0' x2='1'><stop offset='0' stop-color='#F4E3C3'/><stop offset='.5' stop-color='#E2C896'/><stop offset='1' stop-color='#B8975E'/></linearGradient>";
    s += "<radialGradient id='" + g + "omb'><stop offset='0' stop-color='#001136' stop-opacity='.26'/><stop offset='1' stop-color='#001136' stop-opacity='0'/></radialGradient>";
    s += "<marker id='" + g + "fl' markerWidth='10' markerHeight='10' refX='7' refY='5' orient='auto'><path d='M0 1L8 5L0 9Z' fill='" + BLEU + "'/></marker>";
    s += "<marker id='" + g + "flo' markerWidth='10' markerHeight='10' refX='7' refY='5' orient='auto'><path d='M0 1L8 5L0 9Z' fill='#C2540A'/></marker>";
    return s + "</defs>";
  }
  function boule(g, x, y, c, lab, r) {
    r = r || 11;
    return "<ellipse cx='" + (x + 1) + "' cy='" + (y + r * .95) + "' rx='" + (r * .9) + "' ry='" + (r * .28) + "' fill='url(#" + g + "omb)'/>" +
      "<circle cx='" + x + "' cy='" + y + "' r='" + r + "' fill='url(#" + g + c + ")'/>" +
      "<ellipse cx='" + (x - r * .35) + "' cy='" + (y - r * .45) + "' rx='" + (r * .32) + "' ry='" + (r * .2) + "' fill='#fff' opacity='.7' transform='rotate(-30 " + (x - r * .35) + " " + (y - r * .45) + ")'/>" +
      (lab ? "<text x='" + x + "' y='" + (y + r * .36) + "' text-anchor='middle' font-size='" + (r * .92).toFixed(1) + "' font-weight='800' fill='#fff'>" + lab + "</text>" : "");
  }
  function fantome(x, y, r) { return "<circle cx='" + x + "' cy='" + y + "' r='" + (r || 11) + "' fill='none' stroke='#8A96A8' stroke-width='1.5' stroke-dasharray='3 3'/>"; }
  var NID = [[20, 141], [43, 141], [66, 141], [89, 141], [112, 141], [31, 119], [54, 119], [77, 119], [100, 119], [43, 97], [66, 97], [89, 97]];
  /* urne en verre : contenu = liste de [couleur, étiquette] ; caches = indices des boules sorties */
  function urne(g, tx, ty, sc, contenu, caches) {
    caches = caches || [];
    var corps = "M17 30C7 30 2 40 2 55L2 136C2 149 12 156 27 156L105 156C120 156 130 149 130 136L130 55C130 40 125 30 115 30Z", b = "";
    contenu.forEach(function (x, i) { var p = NID[i]; b += caches.indexOf(i) >= 0 ? fantome(p[0], p[1]) : boule(g, p[0], p[1], x[0], x[1]); });
    return "<g transform='translate(" + tx + " " + ty + ") scale(" + sc + ")'><ellipse cx='66' cy='158' rx='76' ry='9' fill='url(#" + g + "omb)'/>" +
      "<path d='" + corps + "' fill='url(#" + g + "verre)'/>" + b +
      "<path d='" + corps + "' fill='none' stroke='#86AEBF' stroke-width='2'/><ellipse cx='66' cy='30' rx='54' ry='8' fill='#EEF8FB' fill-opacity='.85' stroke='#86AEBF' stroke-width='2'/>" +
      "<path d='M10 52V134' stroke='#fff' stroke-width='6' stroke-linecap='round' opacity='.55'/><path d='M120 60V120' stroke='#fff' stroke-width='2.5' stroke-linecap='round' opacity='.5'/></g>";
  }
  function support(g, tx, ty, items) {
    var s = "<g transform='translate(" + tx + " " + ty + ")'><ellipse cx='" + (items.length * 20 + 2) + "' cy='44' rx='" + (items.length * 24) + "' ry='7' fill='url(#" + g + "omb)'/><rect x='0' y='14' width='" + (items.length * 40 + 4) + "' height='28' rx='8' fill='url(#" + g + "bois)' stroke='#7A4F27'/><path d='M6 20h" + (items.length * 40 - 8) + "' stroke='#F1C98F' stroke-width='1.5' opacity='.7'/>";
    items.forEach(function (it, i) { var x = 22 + i * 40; s += "<ellipse cx='" + x + "' cy='24' rx='15' ry='6' fill='#5C3818' opacity='.7'/>" + boule(g, x, 13, it[0], it[1], 13) + "<circle cx='" + x + "' cy='55' r='9' fill='" + NUIT + "'/><text x='" + x + "' y='59' text-anchor='middle' fill='#fff' font-size='11' font-weight='800'>" + (i + 1) + "</text>"; });
    return s + "</g>";
  }
  function sac(g, tx, ty, items) {
    var s = "<g transform='translate(" + tx + " " + ty + ")'><ellipse cx='45' cy='92' rx='52' ry='8' fill='url(#" + g + "omb)'/><path d='M18 22C4 40 0 62 6 78C12 92 78 92 84 78C90 62 86 40 72 22Z' fill='url(#" + g + "sac)' stroke='#8B6B37' stroke-width='2'/><path d='M22 24C30 30 60 30 68 24' fill='none' stroke='#8B6B37' stroke-width='2'/><path d='M30 26C28 14 36 8 45 8S62 14 60 26' fill='none' stroke='#A3824A' stroke-width='3'/>";
    var P = [[30, 62], [58, 62], [44, 42]];
    items.forEach(function (it, i) { s += boule(g, P[i][0], P[i][1], it[0], it[1], 13); });
    return s + "</g>";
  }
  function svg(w, h, alt, g, corps) {
    return "<svg viewBox='0 0 " + w + " " + h + "' role='img' aria-label='" + alt + "' font-family='Inter,Arial,sans-serif'><rect width='" + w + "' height='" + h + "' fill='#fff'/>" + defs(g) + corps + "<text x='" + (w - 6) + "' y='" + (h - 5) + "' font-size='8' text-anchor='end' fill='#8A93A6'>Planche VÉRITAS</text></svg>";
  }
  function txt(x, y, t, o) { o = o || {}; return "<text x='" + x + "' y='" + y + "' font-size='" + (o.s || 13) + "' font-weight='" + (o.w || 700) + "' text-anchor='" + (o.a || "middle") + "' fill='" + (o.c || NUIT) + "'>" + t + "</text>"; }

  function urne3D(contenu, sorties, cibles) {
    var o = [{ f: "boite", c: [30, -4, 0], d: [460, 8, 220], coul: "#D9C7A0", dessus: "#E3D3AE" },
      { f: "cylindre", c: [-110, 0, 0], r: 72, h: 8, n: 28, coul: "#A9D0DE", dessus: "#C9E4EE" }];
    var P = [[-140, 22, -26], [-110, 22, 30], [-80, 22, -26], [-138, 22, 28], [-82, 22, 30], [-110, 22, -2], [-124, 56, 8], [-96, 56, -12], [-110, 56, 30], [-110, 88, 0]];
    contenu.forEach(function (c, i) {
      var k = sorties.indexOf(i), b = { f: "sphere", c: P[i], r: 15, n: 12, m: 8, coul: c };
      if (k >= 0) b.ec = [cibles[k][0] - P[i][0], cibles[k][1] - P[i][1], cibles[k][2] - P[i][2]];
      o.push(b);
    });
    o.push({ f: "cylindre", c: [-110, 4, 0], r: 74, h: 150, n: 32, coul: "#CFE9F3", op: 0.2, double: true });
    o.push({ f: "cylindre", c: [-110, 150, 0], r: 77, h: 6, n: 32, coul: "#BFE1EE", op: 0.55, double: true });   /* col de l'urne */
    return o;
  }
  function plateau3D(o, n, x0) { /* support à places numérotées, à droite de l'urne */
    o.push({ f: "boite", c: [x0 + (n - 1) * 25, 8, 40], d: [n * 50 + 10, 16, 56], coul: "#B07A44", dessus: "#C98E55" });
    return o;
  }


  function q(qq, bonne, f1, f2, e) { return { q: qq, r: [bonne, f1, f2], b: 0, e: e }; }

  /* ── r26 : diagramme de Venn, tableau à double entrée ── */
  VRT_L("2nde-a-maths-r26", {
    c: "2nde A", m: "maths", rang: 26, duree: 30, cle: "Diagramme de Venn",
    titre: "Diagramme de Venn et tableau à double entrée",
    accroche: "Club de lecture et club de danse : combien d'élèves de 2nde A ne vont à aucun club ?",
    intro: "Deux outils pour compter sans oublier personne et sans compter deux fois : le diagramme de Venn et le tableau à double entrée.",
    objectifs: ["représenter une situation par un diagramme de Venn", "remplir et lire un tableau à double entrée", "calculer « au moins un » et « aucun »"],
    enquete: { titre: "Les clubs de la 2nde A",
      contexte: "<p>La 2nde A d'un lycée de Bafoussam compte <strong>48 élèves</strong>. <strong>20</strong> sont inscrits au club de lecture, <strong>18</strong> au club de danse, et <strong>7</strong> aux deux. Le professeur principal veut proposer un <strong>troisième club</strong> si au moins 15 élèves ne font encore aucune activité.</p>",
      documents: [{ t: "La fiche d'inscription", html: "<table class='donnees'><tr><td>Élèves</td><td>48</td></tr><tr><td>Lecture</td><td>20</td></tr><tr><td>Danse</td><td>18</td></tr><tr><td>Les deux</td><td>7</td></tr></table>" }],
      question: "Combien d'élèves ne font aucun club ? Faut-il ouvrir un troisième club ?",
      tache: "Représente la situation par un diagramme de Venn puis par un tableau, calcule, et décide.",
      hypotheses: ["48 − 20 − 18 = 10 élèves sans club : pas de troisième club.", "Les 7 élèves des deux clubs ont été retirés deux fois : il y en a plus que 10."] },
    parties: [
      { t: "Le diagramme de Venn", html: "<div class='def'><b>Définition</b>Un <strong>diagramme de Venn</strong> représente un ensemble E par un rectangle et ses parties par des cercles. La zone commune à deux cercles est l'<strong>intersection</strong> A ∩ B ; la réunion des deux cercles est A ∪ B.</div>" +
        "<div class='methode'><b>Remplir un diagramme</b><ol><li>Place d'abord l'<strong>intersection</strong> : 7.</li><li>Puis « lecture seulement » : 20 − 7 = 13, « danse seulement » : 18 − 7 = 11.</li><li>Enfin l'extérieur : 48 − (13 + 7 + 11).</li></ol></div>",
        planches: [{ type: "2D", titre: "Le diagramme de la 2nde A", legende: "7 élèves aux deux clubs, 13 à la lecture seulement, 11 à la danse seulement : 31 élèves inscrits, 17 sans club.", svg: (function () {
          var g = "n26", s = "<rect x='40' y='30' width='560' height='240' rx='18' fill='#FBFAF7' stroke='#C9D2E3'/>" + txt(64, 54, "E : 48 élèves", { s: 13, a: "start" }) +
            "<circle cx='260' cy='155' r='96' fill='#1E499B' fill-opacity='.14' stroke='" + BLEU + "' stroke-width='2.5'/><circle cx='380' cy='155' r='90' fill='#B2316E' fill-opacity='.14' stroke='#B2316E' stroke-width='2.5'/>" +
            txt(205, 162, "13", { s: 26 }) + txt(320, 162, "7", { s: 26, c: "#4F2686" }) + txt(425, 162, "11", { s: 26, c: "#8D1D52" }) + txt(560, 254, "17", { s: 22, c: GRIS }) +
            txt(205, 78, "Lecture : 20", { s: 13, c: BLEU }) + txt(425, 82, "Danse : 18", { s: 13, c: "#8D1D52" });
          return svg(640, 290, "Diagramme de Venn : 13 en lecture seulement, 7 aux deux, 11 en danse seulement, 17 sans club", g, s); })() }],
        fil: { html: "<p>48 − 20 − 18 retire deux fois les 7 élèves des deux clubs. Inscrits à au moins un club : 13 + 7 + 11 = <strong>31</strong>. Sans club : 48 − 31 = <strong>17</strong>.</p>", verdicts: [[0, "rejetee", "Les 7 élèves des deux clubs sont retirés deux fois."], [1, "validee", "17 élèves n'ont aucun club."]] },
        retenir: "Au moins un club : 20 + 18 − 7 = 31 ; aucun : 48 − 31 = 17." },
      { t: "Le tableau à double entrée", html: "<p>Un <strong>tableau à double entrée</strong> croise deux caractères (lecture : oui / non ; danse : oui / non). Chaque élève est dans une seule case.</p>" +
        "<table class='donnees'><tr><th></th><th>Danse</th><th>Pas danse</th><th>Total</th></tr><tr><th>Lecture</th><td>7</td><td>13</td><td>20</td></tr><tr><th>Pas lecture</th><td>11</td><td><strong>17</strong></td><td>28</td></tr><tr><th>Total</th><td>18</td><td>30</td><td>48</td></tr></table>" +
        "<div class='astuce'><b>Contrôle</b>Les totaux des lignes et des colonnes doivent redonner 48. Une case se calcule toujours par différence.</div>" +
        "<div class='prop'><b>Formule</b>card(A ∪ B) = card(A) + card(B) − card(A ∩ B) : 20 + 18 − 7 = 31.</div>",
        fil: { html: "<p>Le tableau confirme : la case « ni lecture ni danse » vaut 28 − 11 = <strong>17</strong>.</p>" },
        retenir: "Tableau : remplir par différences, vérifier les totaux." },
      { t: "Décider", html: "<div class='ex'><b>La décision</b>17 élèves sans club, c'est plus que les 15 exigés : le troisième club (par exemple un club journal) peut ouvrir.</div>" +
        "<div class='attention'><b>Piège</b>« Lecture » (20) n'est pas « lecture seulement » (13). Lis bien « seulement », « au moins un », « aucun ».</div>" +
        "<div class='savais'><b>Le savais-tu ?</b>Le diagramme porte le nom du logicien anglais John Venn, qui l'a popularisé en 1880.</div>",
        retenir: "Calculer, puis répondre à la question posée." }
    ],
    denouement: { titre: "17 élèves sans club : le troisième club ouvre",
      etapes: ["Intersection : 7 élèves aux deux clubs.", "Parties propres : 13 et 11.", "Au moins un club : 31 ; aucun : 17.", "17 ≥ 15 : on ouvre le troisième club."],
      reponse: "<p>Notons L et D les inscrits aux clubs de lecture et de danse. card(L ∪ D) = 20 + 18 − 7 = 31, donc 48 − 31 = <strong>17 élèves</strong> ne font aucun club. Comme 17 ≥ 15, le professeur principal peut ouvrir un troisième club.</p>",
      transfert: "<p>Dans un village de l'Ouest, sur 120 familles, 70 cultivent le maïs, 55 le haricot, 30 les deux. Combien ne cultivent ni l'un ni l'autre ? <em>(120 − (70 + 55 − 30) = 25.)</em></p>" },
    revision: ["Venn : intersection d'abord, puis « seulement », puis l'extérieur.", "card(A ∪ B) = card(A) + card(B) − card(A ∩ B).", "Aucun : card(E) − card(A ∪ B).", "Tableau à double entrée : cases par différence, totaux vérifiés."],
    exo: "<p>Sur 60 élèves, 35 aiment le football, 25 le basket, 10 les deux. Combien n'aiment aucun des deux ? <em>(60 − 50 = 10.)</em></p>",
    quiz: [q("20 en lecture, 18 en danse, 7 aux deux : au moins un club ?", "31", "38", "45", "20 + 18 − 7."), q("Sur 48, sans club ?", "17", "10", "31", "48 − 31."), q("Lecture seulement ?", "13", "20", "7", "20 − 7."), q("Dans un Venn, on commence par…", "l'intersection", "l'extérieur", "le plus grand cercle", "Sinon double comptage."), q("card(A) = 9, card(B) = 6, card(A ∩ B) = 2 : card(A ∪ B) ?", "13", "15", "11", "9 + 6 − 2."), q("Dans un tableau à double entrée, chaque élève est…", "dans une seule case", "dans deux cases", "en dehors", "Les cases se partagent l'effectif."), q("Pourquoi 48 − 20 − 18 est faux ?", "Les élèves des deux clubs sont retirés deux fois", "Il manque des élèves", "Il faut multiplier", "Intersection."), q("A et B disjoints, 5 et 8 éléments : card(A ∪ B) ?", "13", "40", "3", "Intersection vide.")]
  });

  /* ── r27 : arbre de choix, arbre des parties ── */
  VRT_L("2nde-a-maths-r27", {
    c: "2nde A", m: "maths", rang: 27, duree: 30, cle: "Arbre de choix",
    titre: "Arbre de choix et arbre des parties",
    accroche: "Une tenue de la fête du lycée : un pagne, un modèle, une coiffe. Combien de tenues ?",
    intro: "L'arbre de choix compte les possibilités quand on fait des choix successifs ; l'arbre des parties compte toutes les façons de choisir « ou pas » chaque objet.",
    objectifs: ["construire et lire un arbre de choix", "appliquer le principe multiplicatif", "compter les parties d'un ensemble avec un arbre"],
    enquete: { titre: "Les tenues de la fête du lycée",
      contexte: "<p>Pour la fête de la jeunesse, la classe de 2nde A défile en tenue traditionnelle. La couturière propose <strong>3 pagnes</strong> (ndop, kaba, wax), <strong>2 modèles</strong> (robe, ensemble) et, en option, une <strong>coiffe</strong> ou <strong>sans coiffe</strong>. La classe compte <strong>12 filles</strong> qui veulent toutes une tenue différente.</p>",
      question: "Combien de tenues différentes la couturière peut-elle proposer, et suffisent-elles pour les 12 filles ?",
      tache: "Construis l'arbre de choix, dénombre les tenues et conclus.",
      hypotheses: ["3 + 2 + 2 = 7 tenues : pas assez.", "3 × 2 × 2 = 12 tenues : juste assez."] },
    parties: [
      { t: "L'arbre de choix", html: "<div class='def'><b>Définition</b>Un <strong>arbre de choix</strong> représente des choix successifs : chaque niveau est un choix, chaque branche une possibilité. Le nombre de <strong>chemins complets</strong> est le produit des nombres de branches à chaque niveau (<strong>principe multiplicatif</strong>).</div>",
        planches: [{ type: "2D", titre: "L'arbre des tenues", legende: "3 pagnes, puis 2 modèles, puis avec ou sans coiffe : 3 × 2 × 2 = 12 chemins, donc 12 tenues.", svg: (function () {
          var g = "n27", s = "", P = ["Ndop", "Kaba", "Wax"], M = ["Robe", "Ensemble"], i, j, k;
          s += "<circle cx='30' cy='170' r='7' fill='" + NUIT + "'/>";
          for (i = 0; i < 3; i++) { var y1 = 60 + i * 110;
            s += "<path d='M37 170C80 170 80 " + y1 + " 120 " + y1 + "' fill='none' stroke='" + BLEU + "' stroke-width='2.4'/><rect x='120' y='" + (y1 - 13) + "' width='80' height='26' rx='13' fill='#EEF3FC' stroke='" + BLEU + "'/>" + txt(160, y1 + 5, P[i], { s: 12, c: BLEU });
            for (j = 0; j < 2; j++) { var y2 = y1 - 26 + j * 52;
              s += "<path d='M200 " + y1 + "C240 " + y1 + " 240 " + y2 + " 280 " + y2 + "' fill='none' stroke='#B2316E' stroke-width='2'/><rect x='280' y='" + (y2 - 12) + "' width='92' height='24' rx='12' fill='#FBE9F1' stroke='#B2316E'/>" + txt(326, y2 + 4, M[j], { s: 11.5, c: "#8D1D52" });
              for (k = 0; k < 2; k++) { var y3 = y2 - 11 + k * 22; s += "<path d='M372 " + y2 + "L420 " + y3 + "' stroke='#C2540A' stroke-width='1.6'/>" + boule(g, 432, y3, k ? "V" : "J", "", 6.5) + txt(446, y3 + 4, k ? "sans coiffe" : "coiffe", { s: 10, w: 500, a: "start", c: GRIS }); } } }
          s += "<rect x='520' y='140' width='110' height='60' rx='12' fill='#FFF8E6' stroke='#F2DFA6'/>" + txt(575, 166, "3 × 2 × 2", { s: 14, c: "#8A6200" }) + txt(575, 188, "= 12 tenues", { s: 13, c: "#8A6200" });
          return svg(640, 360, "Arbre de choix : trois pagnes, deux modèles, avec ou sans coiffe, douze tenues", g, s); })() }],
        fil: { html: "<p>Chaque pagne se combine avec chaque modèle, puis avec chaque option : on <strong>multiplie</strong>. 3 × 2 × 2 = <strong>12 tenues</strong>.</p>", verdicts: [[0, "rejetee", "Additionner ne compte pas des tenues complètes."], [1, "validee", "12 tenues, une par fille."]] },
        retenir: "Un chemin complet = une possibilité ; on multiplie les branches." },
      { t: "Le principe multiplicatif", html: "<div class='prop'><b>Principe multiplicatif</b>Si un choix se fait en k étapes avec n₁, n₂, …, nₖ possibilités, il y a n₁ × n₂ × … × nₖ choix au total.</div>" +
        "<div class='ex'><b>Exemple</b>Un menu de cantine : 2 entrées, 3 plats, 2 desserts : 2 × 3 × 2 = 12 menus.</div>" +
        "<div class='astuce'><b>Quand dessiner l'arbre ?</b>Dessine-le pour comprendre (petits nombres) ; ensuite, le produit suffit.</div>",
        fil: { html: "<p>Les 12 filles peuvent toutes avoir une tenue différente : il n'y en a <strong>ni trop ni trop peu</strong>.</p>" },
        retenir: "Choix successifs : produit." },
      { t: "L'arbre des parties", html: "<div class='def'><b>Arbre des parties</b>Pour chaque élément d'un ensemble, on répond « je le prends » ou « je ne le prends pas ». Un ensemble à n éléments a <strong>2ⁿ parties</strong> (y compris l'ensemble vide et l'ensemble entier).</div>" +
        "<div class='ex'><b>Exemple</b>Accessoires possibles : collier, bracelet, foulard. Chaque fille choisit ceux qu'elle porte : 2 × 2 × 2 = 2³ = 8 façons (de « aucun » à « les trois »).</div>",
        planches: [{ type: "2D", titre: "L'arbre des parties de {collier ; bracelet ; foulard}", legende: "Trois questions « oui / non » : 2³ = 8 parties, de l'ensemble vide à l'ensemble entier.", svg: (function () {
          var g = "n27b", s = "", L = ["Collier ?", "Bracelet ?", "Foulard ?"], i, y = 30, leaves = [];
          for (i = 0; i < 8; i++) leaves.push([(i & 4) ? 0 : 1, (i & 2) ? 0 : 1, (i & 1) ? 0 : 1]);
          for (i = 0; i < 3; i++) s += txt(110 + i * 150, 22, L[i], { s: 12, c: BLEU });
          leaves.forEach(function (l, k) { var yy = 46 + k * 34; s += txt(560, yy + 4, (l[0] ? "C" : "") + (l[1] ? "B" : "") + (l[2] ? "F" : "") || "∅", { s: 13, c: NUIT, a: "start" }) + boule(g, 540, yy, l.reduce(function (a, b) { return a + b; }, 0) ? "B" : "J", "", 7); });
          function br(x, y0, depth, lo, hi) { if (depth === 3) return; var mid = (lo + hi) / 2, yo = 46 + (lo + mid - 1) / 2 * 34, yn = 46 + (mid + hi - 1) / 2 * 34;
            s += "<path d='M" + x + " " + y0 + "L" + (x + 150) + " " + yo + "' stroke='#1C6B43' stroke-width='1.8'/><path d='M" + x + " " + y0 + "L" + (x + 150) + " " + yn + "' stroke='#A31238' stroke-width='1.8' stroke-dasharray='5 4'/>";
            br(x + 150, yo, depth + 1, lo, mid); br(x + 150, yn, depth + 1, mid, hi); }
          br(40, 46 + 3.5 * 34, 0, 0, 8);
          s += txt(320, 330, "oui (trait plein) · non (pointillés) · 2³ = 8 parties", { s: 12, c: GRIS });
          return svg(640, 345, "Arbre des parties d'un ensemble à trois éléments, huit parties", g, s); })() }],
        retenir: "Un ensemble à n éléments a 2ⁿ parties." }
    ],
    denouement: { titre: "12 tenues : une par fille",
      etapes: ["Choix successifs : pagne, modèle, coiffe.", "Principe multiplicatif : 3 × 2 × 2 = 12.", "12 tenues pour 12 filles : toutes différentes."],
      reponse: "<p>Une tenue se compose d'un pagne (3 choix), d'un modèle (2 choix) et d'une option coiffe (2 choix). D'après le principe multiplicatif, il y a 3 × 2 × 2 = <strong>12 tenues</strong> : exactement assez pour que les 12 filles portent chacune une tenue différente.</p>",
      transfert: "<p>Si la couturière ajoute un 4e pagne, combien de tenues ? Et si 15 filles défilent ? <em>(4 × 2 × 2 = 16 ≥ 15 : assez.)</em></p>" },
    revision: ["Arbre de choix : un niveau par choix, un chemin = une possibilité.", "Principe multiplicatif : n₁ × n₂ × … × nₖ.", "Arbre des parties : « oui / non » pour chaque élément.", "Un ensemble à n éléments a 2ⁿ parties."],
    exo: "<p>Un code de cantine est formé d'une lettre parmi A, B, C puis d'un chiffre parmi 1, 2, 3, 4. Combien de codes ? Combien de parties a l'ensemble {A ; B ; C ; D} ? <em>(3 × 4 = 12 ; 2⁴ = 16.)</em></p>",
    quiz: [q("3 pagnes, 2 modèles, 2 options : tenues ?", "12", "7", "6", "3 × 2 × 2."), q("Dans un arbre de choix, une possibilité est…", "un chemin complet", "une branche", "un niveau", "Du départ à une feuille."), q("2 entrées, 3 plats, 2 desserts : menus ?", "12", "7", "18", "Produit."), q("Nombre de parties de {a ; b ; c} ?", "8", "6", "3", "2³."), q("Nombre de parties d'un ensemble à 4 éléments ?", "16", "8", "4", "2⁴."), q("L'ensemble vide est-il une partie ?", "oui", "non", "seulement si n = 0", "On ne prend aucun élément."), q("Pourquoi 3 + 2 + 2 est faux ?", "Une tenue réunit trois choix successifs", "Il faut soustraire", "Les coiffes ne comptent pas", "On multiplie."), q("4 pagnes, 2 modèles, 2 options ?", "16", "8", "12", "4 × 2 × 2.")]
  });

  /* ── r28 : activité d'intégration ── */
  VRT_L("2nde-a-maths-r28", {
    c: "2nde A", m: "maths", rang: 28, duree: 35, cle: "Activités d'intégration",
    titre: "Intégration : la kermesse du lycée",
    accroche: "Plateaux-repas, tickets, inscriptions croisées : la kermesse se prépare en comptant juste.",
    intro: "Une activité d'intégration réunit les outils du chapitre : diagramme de Venn, tableau à double entrée, arbre de choix. Une seule situation, celle de la kermesse d'un lycée de Garoua.",
    objectifs: ["choisir l'outil adapté à chaque question", "dénombrer sans oubli ni double comptage", "décider et rédiger une réponse"],
    enquete: { titre: "La kermesse du lycée de Garoua",
      contexte: "<p>Le foyer du lycée organise une kermesse. Le comité doit : (1) savoir combien des <strong>120 élèves</strong> de 2nde viendront, sachant que <strong>75</strong> tiennent un stand, <strong>50</strong> participent au tournoi de dames et <strong>30</strong> font les deux ; (2) imprimer un <strong>ticket différent pour chaque plateau-repas</strong> : une boisson parmi 4 (foléré, gingembre, citronnelle, eau), un plat parmi 3 et un dessert parmi 2. Le comité a 25 modèles de tickets.</p>",
      question: "Combien d'élèves participent à au moins une activité ? Les 25 modèles de tickets suffisent-ils ?",
      tache: "Choisis un outil pour chaque question, calcule et rédige ta réponse au comité.",
      hypotheses: ["75 + 50 = 125 participants : plus que les 120 élèves, c'est impossible.", "4 × 3 × 2 plateaux : les 25 tickets suffisent."] },
    parties: [
      { t: "Choisir l'outil", html: "<div class='def'><b>Définition</b>Des ensembles qui se chevauchent : <strong>diagramme de Venn</strong> ou <strong>tableau à double entrée</strong>. Des choix successifs : <strong>arbre de choix</strong> et principe multiplicatif.</div>" +
        "<div class='methode'><b>Démarche</b><ol><li>Lire chaque question et repérer : ensembles ou choix successifs ?</li><li>Représenter (Venn, tableau, arbre).</li><li>Calculer, contrôler.</li><li>Répondre par une phrase.</li></ol></div>",
        planches: [{ type: "2D", titre: "Les participants de la kermesse", legende: "30 élèves font les deux ; 45 tiennent seulement un stand ; 20 jouent seulement aux dames ; 25 ne participent à rien.", svg: (function () {
          var g = "n28", s = "<rect x='40' y='30' width='560' height='240' rx='18' fill='#FBFAF7' stroke='#C9D2E3'/>" + txt(64, 54, "E : 120 élèves", { s: 13, a: "start" }) +
            "<circle cx='260' cy='155' r='96' fill='#1E499B' fill-opacity='.14' stroke='" + BLEU + "' stroke-width='2.5'/><circle cx='380' cy='155' r='90' fill='#B2316E' fill-opacity='.14' stroke='#B2316E' stroke-width='2.5'/>" +
            txt(205, 162, "45", { s: 26 }) + txt(320, 162, "30", { s: 26, c: "#4F2686" }) + txt(425, 162, "20", { s: 26, c: "#8D1D52" }) + txt(560, 254, "25", { s: 22, c: GRIS }) +
            txt(205, 78, "Stand : 75", { s: 13, c: BLEU }) + txt(425, 82, "Dames : 50", { s: 13, c: "#8D1D52" });
          return svg(640, 290, "Diagramme de Venn de la kermesse : 45, 30, 20 et 25 élèves", g, s); })() }],
        fil: { html: "<p>75 + 50 compte deux fois les 30 élèves des deux activités. Au moins une activité : 75 + 50 − 30 = <strong>95 élèves</strong>.</p>", verdicts: [[0, "rejetee", "Il faut retirer une fois les 30 élèves comptés deux fois : 95 participants."]] },
        retenir: "Ensembles qui se chevauchent : retirer l'intersection." },
      { t: "Les plateaux-repas", html: "<div class='ex'><b>Calcul</b>Une boisson <strong>et</strong> un plat <strong>et</strong> un dessert : 4 × 3 × 2 = <strong>24 plateaux</strong>.</div>" +
        "<div class='astuce'><b>Contrôle par l'arbre</b>4 branches, puis 3 sous chacune (12), puis 2 sous chacune (24).</div>",
        planches: [{ type: "3d", titre: "24 plateaux, 24 cubes", legende: "4 boissons (colonnes), 3 plats (rangées), 2 desserts (étages) : écarte les cubes pour vérifier qu'il y en a 24.", modele: { h: 340, rx: -22, ry: 34, echelle: 0.85, alt: "Pavé de 4 sur 3 sur 2 cubes", eclate: "Écarter", jouer: "Écarter les 24 plateaux", objets: (function () { var o = [{ f: "boite", c: [0, -4, 0], d: [460, 8, 240], coul: "#E9E2D2", dessus: "#F3EEE2" }], C = ["#E8394B", "#F2994A", "#36B37A", "#4F86E0"], x, y, z; for (x = 0; x < 4; x++) for (y = 0; y < 2; y++) for (z = 0; z < 3; z++) o.push({ f: "boite", c: [-120 + x * 80, 18 + y * 44, -70 + z * 70], d: [70, 38, 56], coul: C[x], dessus: y ? "#FFF1C2" : "#FFFFFF", ec: [(x - 1.5) * 34, y * 46, (z - 1) * 26] }); return o; })(),
          etiquettes: [{ p: [-120, 70, -120], t: "Foléré" }, { p: [120, 70, -120], t: "Eau", cote: "d" }, { p: [160, 30, 70], t: "3 plats", cote: "d" }] } }],
        fil: { html: "<p>24 plateaux, 25 modèles de tickets : <strong>ils suffisent</strong>, il en reste un.</p>", verdicts: [[1, "validee", "4 × 3 × 2 = 24 ≤ 25."]] },
        retenir: "Choix successifs : produit." },
      { t: "Rédiger la réponse", html: "<div class='retiens'><b>Ce qui fait gagner les points</b>Nommer les ensembles, justifier l'outil (« certains élèves font les deux, je retire l'intersection » ; « trois choix successifs, je multiplie »), calculer, puis répondre en reprenant la question.</div>" +
        "<div class='attention'><b>Piège</b>Ne pas confondre « participent à au moins une activité » (95) et « ne participent à rien » (120 − 95 = 25).</div>",
        retenir: "Justifier, calculer, conclure." }
    ],
    denouement: { titre: "95 participants et 24 plateaux",
      etapes: ["Venn : 75 + 50 − 30 = 95 participants (indice 1).", "Sans activité : 120 − 95 = 25.", "Plateaux : 4 × 3 × 2 = 24 (indice 2).", "24 ≤ 25 : les tickets suffisent."],
      reponse: "<p>Notons S et D les élèves qui tiennent un stand et ceux qui jouent aux dames. card(S ∪ D) = 75 + 50 − 30 = <strong>95 élèves</strong> participent à au moins une activité (25 ne participent à rien). Un plateau-repas se compose d'une boisson, d'un plat et d'un dessert : 4 × 3 × 2 = <strong>24 plateaux</strong>. Les 25 modèles de tickets suffisent.</p>",
      transfert: "<p>L'an prochain, le comité ajoute un 4e plat et propose « avec ou sans dessert ». Combien de plateaux ? Les 25 tickets suffisent-ils ? <em>(4 × 4 × (2 + 1) = 48 : non.)</em></p>" },
    revision: ["Ensembles qui se chevauchent : Venn ou tableau, card(A ∪ B) = card(A) + card(B) − card(A ∩ B).", "Choix successifs : arbre et produit.", "Toujours conclure par une phrase qui répond à la question."],
    exo: "<p>Sur 80 élèves, 45 font du sport, 30 de la musique, 12 les deux. Combien ne font ni sport ni musique ? Une tenue de sport : un maillot parmi 3 couleurs et un short parmi 2 : combien de tenues ? <em>(80 − 63 = 17 ; 3 × 2 = 6.)</em></p>",
    quiz: [q("75 au stand, 50 aux dames, 30 aux deux : au moins une activité ?", "95", "125", "65", "75 + 50 − 30."), q("Sur 120, sans activité ?", "25", "95", "5", "120 − 95."), q("4 boissons, 3 plats, 2 desserts : plateaux ?", "24", "9", "12", "Produit."), q("Quel outil pour des ensembles qui se chevauchent ?", "diagramme de Venn", "arbre de choix", "factorielle", "Ou tableau à double entrée."), q("Quel outil pour des choix successifs ?", "arbre de choix", "diagramme de Venn", "tableau des effectifs", "Principe multiplicatif."), q("Stand seulement ?", "45", "75", "30", "75 − 30."), q("Les 25 tickets suffisent-ils pour 24 plateaux ?", "oui", "non", "on ne peut pas savoir", "24 ≤ 25."), q("4 plats et « avec ou sans dessert » (2 desserts) : plateaux ?", "48", "32", "24", "4 × 4 × 3.")]
  });
})();
