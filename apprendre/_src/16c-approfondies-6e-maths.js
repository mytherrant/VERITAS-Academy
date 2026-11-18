/* Leçons APPROFONDIES — 6e Mathématiques, lot 2 (18/11/2026) : trois lignes de la progression qui n'avaient aucune leçon.
   - « Périmètre ou circonférence du cercle - Aire du disque » (le puits de Ngaoundéré)
   - « Tableau de proportionnalité - Coefficients de proportionnalité » (le riz du marché Mfoundi)
   - « Patron d'un cube et d'un pavé droit » (les boîtes de savon de Bafang)
   Même gabarit que 16-approfondies-premier-cycle.js : situation de vie suivie partie après partie, hypothèses tranchées,
   planches, simulation, situation résolue, entraînement au format de l'examen, quiz de 10 questions.
   Leçons NOUVELLES (VRT_L), rattachées par « cle » = début du titre officiel. Simulations déclarées en fin de fichier. */
(function () {
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

  /* ═══════════════════════ 6e — PÉRIMÈTRE DU CERCLE ET AIRE DU DISQUE ═══════════════════════ */
  function puits(x, y, s) {
    return "<g transform='translate(" + x + " " + y + ") scale(" + (s || 1) + ")'><ellipse cx='0' cy='46' rx='86' ry='14' fill='#001136' opacity='.12'/>" +
      "<path d='M-70 0V40A70 16 0 0 0 70 40V0Z' fill='url(#cpPierre)'/><ellipse cx='0' cy='0' rx='70' ry='16' fill='#9C8F80'/><ellipse cx='0' cy='0' rx='58' ry='12' fill='#2B4A5E'/>" +
      "<path d='M-70 12H70M-70 26H70' stroke='#7E7264' stroke-width='1.5' opacity='.6'/></g>";
  }
  VRT_L("6e-maths-cercle", {
    c: "6e", m: "maths", cle: "Périmètre ou circonférence du cercle", titre: "Le périmètre du cercle et l'aire du disque", duree: 30,
    accroche: "Un puits rond de 1,40 m de diamètre : combien de mètres de fer pour la bordure, combien de tôle pour le couvercle ?",
    intro: "Au quartier Baladji de Ngaoundéré, la mairie protège le puits. Partie après partie, tu trouveras les deux mesures dont le soudeur a besoin.",
    objectifs: ["nommer centre, rayon, diamètre, corde, arc et disque", "calculer le périmètre d'un cercle avec π ≈ 3,14", "calculer l'aire d'un disque", "ne pas confondre périmètre (m) et aire (m²)"],
    enquete: {
      titre: "Le puits du quartier Baladji",
      svg: (function () {
        var s = "<rect width='640' height='220' fill='#EAF4FB'/><rect y='160' width='640' height='60' fill='#D9C59E'/><circle cx='560' cy='42' r='22' fill='#FFC93C'/>";
        s += puits(240, 118, 1.1) + perso(420, 96, PEAU[2], "#2F6DB5", "#24324A") + perso(470, 100, PEAU[0], "#C62828", "#3A2A20", .9);
        s += "<path d='M163 118H317' stroke='" + ORANGE + "' stroke-width='3' marker-end='url(#cpF)' marker-start='url(#cpF)'/>" + "<rect x='210' y='78' width='60' height='20' rx='6' fill='#fff'/>" + txt(240, 93, "1,40 m", { s: 13, c: ORANGE });
        s += "<rect x='30' y='18' width='250' height='34' rx='12' fill='#fff' stroke='#C9D8EE'/>" + txt(155, 40, "Bordure en fer + couvercle en tôle", { s: 12.5, c: BLEU });
        return svg(640, 220, "Un puits circulaire de 1,40 m de diamètre et deux habitants du quartier", lin("cpPierre", ["#B5A794", "#8E8170"], true) + fleche("cpF", ORANGE), s);
      })(),
      legende: "Ngaoundéré, quartier Baladji : le puits que la mairie veut sécuriser.",
      contexte: "<p>Le puits a une ouverture ronde de <strong>1,40 m de diamètre</strong>. Le soudeur doit poser une <strong>bordure en fer</strong> tout autour et fabriquer un <strong>couvercle en tôle</strong>.</p><p>Moussa dit : « La bordure, c'est comme un carré : 4 × 1,40 = 5,60 m. » Aïssatou répond : « Et le couvercle, c'est 3,14 × 1,40, le même calcul que la bordure. »</p>",
      documents: [{ t: "Le devis du soudeur", html: "<table class='donnees'><tr><td>Fer plat</td><td>1 500 F le mètre</td></tr><tr><td>Tôle</td><td>6 000 F le m²</td></tr><tr><td>Valeur de π</td><td>3,14 (arrondi)</td></tr></table>" }],
      question: "Quelle longueur de fer et quelle surface de tôle faut-il, et combien coûtent-elles ?",
      tache: "Calcule le périmètre de l'ouverture puis l'aire du couvercle, en écrivant la formule utilisée et l'unité.",
      hypotheses: [
        "Le tour du cercle se calcule comme celui d'un carré : 4 × 1,40 m.",
        "Périmètre et aire, c'est le même calcul : 3,14 × 1,40.",
        "Périmètre = π × diamètre (en m) ; aire = π × rayon × rayon (en m²)."
      ]
    },
    parties: [
      { t: "Le vocabulaire du cercle",
        html: "<div class='def'><b>Définition</b>Le <strong>cercle</strong> de centre O et de rayon r est formé de tous les points situés à la distance r de O. Le <strong>disque</strong> est la surface limitée par ce cercle.</div><ul><li><strong>Rayon</strong> : segment qui joint le centre à un point du cercle.</li><li><strong>Diamètre</strong> : corde qui passe par le centre ; <strong>diamètre = 2 × rayon</strong>.</li><li><strong>Corde</strong> : segment qui joint deux points du cercle ; <strong>arc</strong> : portion du cercle entre deux points.</li></ul><div class='ex'><b>Pour le puits</b>Diamètre 1,40 m, donc rayon = 1,40 ÷ 2 = <strong>0,70 m</strong>.</div>",
        planches: [{ type: "2D", titre: "Les mots du cercle", legende: "Le rayon [OA], le diamètre [BC] qui passe par O, une corde [DE] qui n'y passe pas, et l'arc en orange.", svg: (function () {
          var s = "<circle cx='200' cy='130' r='100' fill='#EEF4FC' stroke='" + BLEU + "' stroke-width='3'/><circle cx='200' cy='130' r='4' fill='" + NUIT + "'/>" + txt(188, 126, "O", { s: 14 });
          s += "<path d='M200 130L270 59' stroke='" + VERT + "' stroke-width='3'/>" + txt(250, 110, "rayon", { s: 12, c: VERT }) + "<circle cx='270' cy='59' r='4' fill='" + VERT + "'/>" + txt(280, 52, "A", { s: 13 });
          s += "<path d='M100 130H300' stroke='#C62828' stroke-width='3'/>" + txt(150, 150, "diamètre", { s: 12, c: "#C62828" }) + txt(88, 134, "B", { s: 13 }) + txt(312, 134, "C", { s: 13 });
          s += "<path d='M128 200L272 200' stroke='#7B2CBF' stroke-width='3' transform='translate(0 -4)'/>" + txt(200, 214, "corde", { s: 12, c: "#7B2CBF" }) + txt(116, 202, "D", { s: 13 }) + txt(284, 202, "E", { s: 13 });
          s += "<path d='M129 60A100 100 0 0 1 200 30' fill='none' stroke='" + ORANGE + "' stroke-width='6' stroke-linecap='round'/>" + txt(150, 28, "arc", { s: 12, c: ORANGE });
          s += "<rect x='360' y='40' width='250' height='150' rx='14' fill='#FFF6E3' stroke='#F2DFA6'/>" + txt(485, 74, "diamètre = 2 × rayon", { s: 16, c: "#8A6200" }) + txt(485, 110, "1,40 m = 2 × 0,70 m", { s: 14 }) + txt(485, 146, "Le disque : toute la surface", { s: 12.5, c: GRIS }) + txt(485, 166, "à l'intérieur du cercle", { s: 12.5, c: GRIS });
          return svg(640, 240, "Un cercle de centre O avec un rayon, un diamètre, une corde et un arc", "", s);
        })() }, { type: "3d", titre: "Le puits et son couvercle", legende: "Fais tourner le puits : la bordure suit le cercle, le couvercle recouvre le disque. Le curseur soulève le couvercle.",
          modele: { h: 320, rx: -26, ry: 20, echelle: .8, dy: 20, alt: "Puits cylindrique en pierre avec son couvercle de tôle soulevé", eclate: "Soulever le couvercle", jouer: "Ouvrir le puits",
            objets: [{ f: "boite", c: [0, -6, 0], d: [380, 8, 300], coul: "#C9B48A", dessus: "#D9C59E", div: false },
              { f: "cylindre", c: [0, -2, 0], r: 100, h: 70, n: 30, coul: "#A89A87", dessus: "#2B4A5E" },
              { f: "cylindre", c: [0, 68, 0], r: 104, h: 6, n: 30, coul: "#5F6B78", dessus: "#C9D1DA" },
              { f: "cylindre", c: [0, 74, 0], r: 102, h: 4, n: 30, coul: "#8C98A6", dessus: "#B9C3CE", ec: [0, 90, 0] }],
            etiquettes: [{ p: [104, 70, 0], t: "bordure en fer : le cercle", cote: "d" }, { p: [0, 80, 0], t: "couvercle : le disque", ec: [0, 90, 0] }, { p: [-100, 20, 0], t: "diamètre 1,40 m" }] } }],
        fil: { html: "<p>La bordure suit le <strong>cercle</strong> : c'est une longueur. Le couvercle couvre le <strong>disque</strong> : c'est une surface. Ce ne sont pas les mêmes grandeurs, donc pas le même calcul ni la même unité.</p>", verdicts: [[1, "rejetee", "Une longueur (m) et une surface (m²) ne se calculent pas pareil : il faudra deux formules."]] },
        retenir: "Diamètre = 2 × rayon ; le cercle est une ligne, le disque une surface." },

      { t: "Le périmètre du cercle",
        html: "<p>Si l'on fait rouler une roue d'un tour complet, elle avance d'un peu plus de <strong>3 fois son diamètre</strong>. Ce nombre, toujours le même pour tous les cercles, s'appelle <strong>π</strong> (« pi ») ; on prend souvent <strong>π ≈ 3,14</strong>.</p><p class='formule'>Périmètre du cercle = π × diamètre = 2 × π × rayon</p><div class='ex'><b>Pour le puits</b>P = 3,14 × 1,40 = <strong>4,396 m</strong>, soit environ <strong>4,40 m</strong> de fer. Prix : 4,40 × 1 500 = <strong>6 600 F</strong>.</div><div class='attention'><b>Attention</b>Le tour du carré de côté 1,40 m mesure 5,60 m : un cercle de même largeur a un tour plus court.</div>",
        planches: [{ type: "2D", titre: "La roue déroulée", legende: "Un tour de roue de diamètre d déroulé sur le sol : 3 diamètres et un petit morceau, soit π × d.", svg: (function () {
          var s = "<rect y='180' width='640' height='8' fill='#C9B48A'/>", d = 120, i;
          s += "<circle cx='80' cy='120' r='60' fill='#EEF4FC' stroke='" + BLEU + "' stroke-width='4'/><path d='M20 120H140' stroke='#C62828' stroke-width='3'/>" + txt(80, 112, "d", { s: 15, c: "#C62828" });
          for (i = 0; i < 3; i++) s += "<rect x='" + (150 + i * d) + "' y='168' width='" + (d - 4) + "' height='12' rx='3' fill='" + ["#E0475B", "#F46036", "#1B998B"][i] + "'/>" + txt(150 + i * d + d / 2, 160, "d", { s: 14 });
          s += "<rect x='510' y='168' width='" + (0.14 * d) + "' height='12' rx='3' fill='#7B2CBF'/>" + txt(540, 160, "0,14 d", { s: 12, c: "#7B2CBF" });
          s += "<path d='M150 204H527' stroke='" + NUIT + "' stroke-width='2' marker-end='url(#crF)' marker-start='url(#crF)'/>" + txt(338, 224, "un tour de roue = π × d ≈ 3,14 × d", { s: 14, c: BLEU });
          return svg(640, 236, "Une roue et la longueur de son tour déroulé : trois diamètres et 0,14 diamètre", fleche("crF", NUIT), s);
        })() }],
        fil: { html: "<p>Le tour du puits vaut π × 1,40 ≈ <strong>4,40 m</strong>, et non 5,60 m : Moussa comptait le tour d'un carré qui entourerait le puits, plus long que le cercle.</p>", verdicts: [[0, "rejetee", "4 × 1,40 = 5,60 m est le tour du carré qui entoure le puits ; le cercle mesure π × 1,40 ≈ 4,40 m."]] },
        retenir: "Périmètre = π × diamètre ; π ≈ 3,14 ; résultat en m." },

      { t: "L'aire du disque",
        html: "<p>Découpe un disque en parts égales et range-les tête-bêche : on obtient presque un rectangle de longueur <strong>la moitié du périmètre</strong> (π × r) et de largeur <strong>le rayon</strong> (r).</p><p class='formule'>Aire du disque = π × rayon × rayon</p><div class='ex'><b>Pour le couvercle</b>A = 3,14 × 0,70 × 0,70 = 3,14 × 0,49 = <strong>1,5386 m²</strong>, soit environ <strong>1,54 m²</strong> de tôle. Prix : 1,54 × 6 000 = <strong>9 240 F</strong>.</div><div class='astuce'><b>Astuce</b>Pour l'aire, on utilise le <strong>rayon</strong>, pas le diamètre : prendre 1,40 × 1,40 donnerait une aire quatre fois trop grande.</div>",
        planches: [{ type: "2D", titre: "Le disque découpé et redressé", legende: "Seize parts rangées tête-bêche forment presque un rectangle de côtés π × r et r : son aire vaut π × r × r.", svg: (function () {
          var s = "", n = 16, R = 70, i, cx = 110, cy = 120, col = ["#F46036", "#2E86AB"];
          for (i = 0; i < n; i++) { var a0 = 2 * Math.PI * i / n, a1 = 2 * Math.PI * (i + 1) / n; s += "<path d='M" + cx + " " + cy + "L" + (cx + R * Math.cos(a0)).toFixed(1) + " " + (cy + R * Math.sin(a0)).toFixed(1) + "A" + R + " " + R + " 0 0 1 " + (cx + R * Math.cos(a1)).toFixed(1) + " " + (cy + R * Math.sin(a1)).toFixed(1) + "Z' fill='" + col[i % 2] + "' stroke='#fff'/>"; }
          s += "<path d='M200 120H250' stroke='" + NUIT + "' stroke-width='3' marker-end='url(#cdF)'/>";
          var w = 3.14 * R / 8;
          for (i = 0; i < n; i++) { var x = 270 + Math.floor(i / 2) * w + (i % 2 ? w / 2 : 0), up = i % 2 === 0; s += "<path d='" + (up ? "M" + x + " 160L" + (x + w / 2) + " 90L" + (x + w) + " 160Z" : "M" + x + " 90L" + (x + w / 2) + " 160L" + (x + w) + " 90Z") + "' fill='" + col[i % 2] + "' stroke='#fff'/>"; }
          s += "<path d='M270 176H" + (270 + 8 * w + w / 2) + "' stroke='" + NUIT + "' stroke-width='2'/>" + txt(270 + 4 * w, 196, "π × r", { s: 14, c: BLEU }) + "<path d='M" + (285 + 8 * w + w / 2) + " 90V160' stroke='" + NUIT + "' stroke-width='2'/>" + txt(305 + 8 * w + w / 2, 130, "r", { s: 15, c: "#C62828" });
          s += txt(430, 226, "aire = π × r × r", { s: 15, c: VERT });
          return svg(640, 240, "Un disque découpé en seize parts réarrangées en un quasi-rectangle de côtés pi fois r et r", fleche("cdF", NUIT), s);
        })() }],
        fil: { html: "<p>Le couvercle mesure π × 0,70 × 0,70 ≈ <strong>1,54 m²</strong>. Le calcul d'Aïssatou (3,14 × 1,40) donnait 4,40 : c'est le périmètre en mètres, pas une aire.</p>", verdicts: [[2, "validee", "Périmètre ≈ 4,40 m de fer (6 600 F) ; aire ≈ 1,54 m² de tôle (9 240 F)."]] },
        retenir: "Aire du disque = π × r × r ; résultat en m²." },

      { t: "Entraînement", html: entrainement(
        "<p><strong>Question de cours.</strong> Écris la formule du périmètre d'un cercle et celle de l'aire d'un disque.</p><details><summary>Voir la réponse</summary><p>P = π × d (ou 2 × π × r) ; A = π × r × r.</p></details><p><strong>Exercice.</strong> Un cercle a un rayon de 5 cm. Calcule son diamètre, son périmètre et l'aire du disque (π ≈ 3,14).</p><details><summary>Voir la réponse</summary><p>d = 10 cm ; P = 3,14 × 10 = 31,4 cm ; A = 3,14 × 5 × 5 = 78,5 cm².</p></details>",
        "<p><strong>Situation.</strong> Le club de sport du lycée de Kousséri trace une piste circulaire de 20 m de diamètre et veut gazonner l'intérieur. Un sac de gazon couvre 10 m².</p><p><strong>Tâche.</strong> Calcule la longueur d'un tour de piste et le nombre de sacs nécessaires.</p><details><summary>Voir une réponse attendue</summary><p>Tour : 3,14 × 20 = 62,8 m. Aire : 3,14 × 10 × 10 = 314 m², soit 314 ÷ 10 = 31,4 : il faut <strong>32 sacs</strong> (on arrondit au-dessus).</p></details>"),
        retenir: "Savoir-être : soigner un équipement commun du quartier." }
    ],
    denouement: {
      titre: "4,40 m de fer et 1,54 m² de tôle",
      etapes: ["Rayon = 1,40 ÷ 2 = 0,70 m (indice 1).", "Périmètre = 3,14 × 1,40 ≈ 4,40 m de fer (indice 2).", "Aire = 3,14 × 0,70 × 0,70 ≈ 1,54 m² de tôle (indice 3).", "Coût : 4,40 × 1 500 + 1,54 × 6 000 = 6 600 + 9 240 = 15 840 F."],
      reponse: "<p>Le soudeur a besoin d'environ <strong>4,40 m de fer</strong> (P = π × d = 3,14 × 1,40) et d'environ <strong>1,54 m² de tôle</strong> (A = π × r × r = 3,14 × 0,70 × 0,70), pour un total de <strong>15 840 F</strong>. Moussa calculait le tour d'un carré (5,60 m), Aïssatou confondait l'aire et le périmètre.</p>",
      transfert: "<p>Un autre puits a 1 m de rayon. Longueur de fer et surface de tôle ? <em>(P = 3,14 × 2 = 6,28 m ; A = 3,14 × 1 × 1 = 3,14 m².)</em></p>"
    },
    revision: ["Diamètre = <strong>2 × rayon</strong>.", "Périmètre du cercle = <strong>π × diamètre</strong>, π ≈ 3,14 (en m, cm…).", "Aire du disque = <strong>π × rayon × rayon</strong> (en m², cm²…).", "Le cercle est une ligne, le disque une surface."],
    exo: "<p>Une roue de vélo a 70 cm de diamètre. Quelle distance parcourt-elle en 100 tours ? <em>(3,14 × 70 = 219,8 cm par tour, soit 21 980 cm ≈ 220 m.)</em></p>",
    quiz: [
      q("Le diamètre d'un cercle de rayon 6 cm mesure :", "12 cm", "3 cm", "36 cm", "d = 2 × r."),
      q("Le périmètre d'un cercle de diamètre 10 cm vaut environ :", "31,4 cm", "314 cm", "40 cm", "3,14 × 10."),
      q("L'aire d'un disque de rayon 10 cm vaut environ :", "314 cm²", "62,8 cm²", "31,4 cm²", "3,14 × 10 × 10."),
      q("Le disque, c'est :", "la surface à l'intérieur du cercle", "le tour du cercle", "un segment", "Le cercle est la ligne, le disque la surface."),
      q("Un segment qui joint deux points du cercle s'appelle :", "une corde", "un rayon", "un arc", "S'il passe par le centre, c'est un diamètre."),
      q("π vaut environ :", "3,14", "2", "4", "Le même nombre pour tous les cercles."),
      q("L'aire d'un disque s'exprime en :", "m² ou cm²", "m ou cm", "degrés", "C'est une surface."),
      q("Pour l'aire, on multiplie π par :", "rayon × rayon", "diamètre", "diamètre × diamètre", "A = π × r × r."),
      q("Le tour du carré de côté 1,40 m est :", "plus long que le tour du cercle de diamètre 1,40 m", "égal", "plus court", "5,60 m contre 4,40 m."),
      q("Une roue de diamètre 50 cm avance en un tour de :", "157 cm", "50 cm", "200 cm", "3,14 × 50.")
    ],
    apc: { module: "Mathématiques de 6e", famille: "Vie économique et environnement", agir: "Calculer des longueurs et des surfaces pour un aménagement", situation: "La bordure et le couvercle d'un puits de quartier.", tache: "Calculer la longueur de fer et la surface de tôle nécessaires." }
  });

  /* ═══════════════════════ 6e — TABLEAU DE PROPORTIONNALITÉ ═══════════════════════ */
  function sacRiz(x, y, s) {
    return "<g transform='translate(" + x + " " + y + ") scale(" + (s || 1) + ")'><path d='M-18 0Q-22 34 -16 44H16Q22 34 18 0Z' fill='#EDE3CF' stroke='#B9A57C'/><path d='M-14 -4H14L12 4H-12Z' fill='#C62828'/>" + txt(0, 28, "1 kg", { s: 9, c: "#8A6200" }) + "</g>";
  }
  VRT_L("6e-maths-proportionnalite", {
    c: "6e", m: "maths", cle: "Tableau de proportionnalité", titre: "Le tableau de proportionnalité", duree: 30,
    accroche: "3 kg de riz pour 1 500 F, 6 mangues pour 900 F : qui vend vraiment « au même prix » quand on achète plus ?",
    intro: "Au marché Mfoundi de Yaoundé, Ngono fait les courses de la famille. À chaque partie, un outil l'aide à comparer et à calculer sans se tromper.",
    objectifs: ["reconnaître un tableau de proportionnalité", "calculer et utiliser le coefficient de proportionnalité", "trouver une quatrième proportionnelle", "appliquer un pourcentage et une échelle"],
    enquete: {
      titre: "Les courses au marché Mfoundi",
      svg: (function () {
        var s = "<rect width='640' height='220' fill='#FFF6E8'/><rect y='170' width='640' height='50' fill='#E8D3AE'/>", i;
        s += "<path d='M20 60H300L280 30H40Z' fill='#E0475B'/><rect x='30' y='120' width='260' height='14' fill='#8A5A2D'/>";
        for (i = 0; i < 5; i++) s += sacRiz(60 + i * 46, 74, 1);
        s += "<rect x='40' y='138' width='240' height='26' rx='8' fill='#fff' stroke='#E3DCCB'/>" + txt(160, 156, "Riz : 3 kg → 1 500 F", { s: 12.5, c: "#8A6200" });
        s += "<path d='M340 60H620L600 30H360Z' fill='#1B998B'/><rect x='350' y='120' width='260' height='14' fill='#8A5A2D'/>";
        for (i = 0; i < 9; i++) s += "<ellipse cx='" + (380 + (i % 5) * 44) + "' cy='" + (100 - Math.floor(i / 5) * 18) + "' rx='16' ry='12' fill='url(#ppM)'/>";
        s += "<rect x='360' y='138' width='240' height='26' rx='8' fill='#fff' stroke='#E3DCCB'/>" + txt(480, 156, "Mangues : 3 → 500 F ; 6 → 900 F", { s: 12, c: VERT });
        s += perso(320, 112, PEAU[1], "#7B2CBF", "#3A2A20", .8);
        return svg(640, 220, "Deux étals du marché : sacs de riz et tas de mangues avec leurs prix", rad("ppM", ["#FFD166", "#F4A261", "#E76F51"]), s);
      })(),
      legende: "Marché Mfoundi, samedi matin : les prix affichés par deux commerçantes.",
      contexte: "<p>Mama Bella vend le riz : <strong>3 kg pour 1 500 F</strong>, 5 kg pour 2 500 F. Mama Ewodo vend les mangues : <strong>3 mangues pour 500 F</strong>, 6 mangues pour 900 F.</p><p>Ngono doit acheter <strong>7 kg de riz</strong>. Son frère dit : « 7 kg, c'est 1 500 × 7. » Sa sœur ajoute : « Plus on achète, plus on paie : les deux prix sont proportionnels. »</p>",
      documents: [{ t: "La liste de courses", html: "<table class='donnees'><tr><td>Riz</td><td>7 kg</td></tr><tr><td>Mangues</td><td>9</td></tr><tr><td>Budget</td><td>5 000 F</td></tr></table>" }],
      question: "Quels prix sont proportionnels aux quantités, et combien Ngono paiera-t-elle ses 7 kg de riz ?",
      tache: "Construis le tableau de chaque commerçante, cherche un coefficient qui marche pour toutes les colonnes, puis calcule le prix de 7 kg.",
      hypotheses: [
        "Dès que le prix augmente avec la quantité, il y a proportionnalité.",
        "Un tableau est proportionnel si l'on passe de la quantité au prix en multipliant toujours par le même nombre.",
        "Le prix de 7 kg de riz est 1 500 × 7."
      ]
    },
    parties: [
      { t: "Reconnaître un tableau de proportionnalité",
        html: "<div class='def'><b>Définition</b>Un tableau est un <strong>tableau de proportionnalité</strong> lorsqu'on obtient les nombres de la 2ᵉ ligne en multipliant ceux de la 1ʳᵉ ligne par un <strong>même nombre</strong>, le <strong>coefficient de proportionnalité</strong>.</div><div class='ex'><b>Le riz</b>1 500 ÷ 3 = 500 et 2 500 ÷ 5 = 500 : le coefficient est <strong>500</strong> (500 F le kg). Le tableau est proportionnel.</div><div class='ex'><b>Les mangues</b>500 ÷ 3 ≈ 167 mais 900 ÷ 6 = 150 : pas le même nombre. Le tableau <strong>n'est pas</strong> proportionnel (il y a une réduction).</div>",
        planches: [{ type: "2D", titre: "Deux tableaux, un seul coefficient", legende: "Pour le riz, chaque flèche « × 500 » fonctionne. Pour les mangues, le quotient change : pas de proportionnalité.", svg: (function () {
          function tab(x, y, h1, l1, l2, col, ok, coef) {
            var s = "<rect x='" + x + "' y='" + y + "' width='280' height='92' rx='10' fill='#fff' stroke='#C9D0DC'/>", i;
            s += txt(x + 44, y + 34, h1[0], { s: 12, c: GRIS }) + txt(x + 44, y + 74, h1[1], { s: 12, c: GRIS });
            l1.forEach(function (v, k) { var cx = x + 112 + k * 64; s += txt(cx, y + 34, v, { s: 15 }) + txt(cx, y + 76, l2[k], { s: 15, c: col }) + "<path d='M" + cx + " " + (y + 41) + "V" + (y + 56) + "' stroke='" + (ok ? col : "#C62828") + "' stroke-width='2' marker-end='url(#ptF" + (ok ? "v" : "r") + ")'/>" + txt(cx + 7, y + 53, coef[k], { s: 10, c: ok ? col : "#C62828", a: "start" }); });
            return s;
          }
          var s = tab(20, 30, ["kg", "prix (F)"], ["1", "3", "5"], ["500", "1 500", "2 500"], VERT, true, ["×500", "×500", "×500"]);
          s += tab(340, 30, ["mangues", "prix (F)"], ["3", "6", "9"], ["500", "900", "1 200"], VERT, false, ["×167", "×150", "×133"]);
          s += txt(160, 150, "proportionnel ✓", { s: 15, c: VERT }) + txt(480, 150, "pas proportionnel ✗", { s: 15, c: "#C62828" });
          return svg(640, 172, "Tableau du riz avec un coefficient constant de 500 et tableau des mangues sans coefficient constant", fleche("ptFv", VERT) + fleche("ptFr", "#C62828"), s);
        })() }, { type: "3d", titre: "Les sacs et les pièces", legende: "Pour chaque kilo de riz, 5 pièces de 100 F : 1 kg → 5 pièces, 3 kg → 15 pièces. Le curseur écarte les colonnes.",
          modele: { h: 320, rx: -24, ry: 28, echelle: .7, dy: 30, alt: "Trois sacs de riz, chacun accompagné d'une pile de cinq pièces", eclate: "Écarter les kilos", jouer: "Compter les pièces",
            objets: (function () { var o = [{ f: "boite", c: [0, -6, 0], d: [460, 8, 220], coul: "#B38B5D", dessus: "#C9A26F", div: false }], i, k;
              for (i = 0; i < 3; i++) { o.push({ f: "boite", c: [-170 + i * 150, 30, 0], d: [60, 70, 50], coul: "#E6D9BE", dessus: "#F2E8D2", ec: [(i - 1) * 40, 0, 0] });
                for (k = 0; k < 5; k++) o.push({ f: "cylindre", c: [-118 + i * 150, k * 9, 10], r: 20, h: 7, n: 18, coul: "#C9A227", dessus: "#E8C547", ec: [(i - 1) * 40, k * 6, 0] }); }
              return o; })(),
            etiquettes: [{ p: [-170, 70, 0], t: "1 kg de riz" }, { p: [182, 50, 10], t: "5 pièces de 100 F par kilo", cote: "d" }] } }],
        fil: { html: "<p>Les mangues coûtent plus quand on en prend plus, mais pas proportionnellement : le prix par mangue baisse. Augmenter ensemble ne suffit pas, il faut <strong>le même coefficient partout</strong>.</p>", verdicts: [[0, "rejetee", "Les mangues : le prix augmente, mais le coefficient change (167, puis 150) : pas de proportionnalité."], [1, "validee", "Le riz : × 500 dans toutes les colonnes, c'est la définition."]] },
        retenir: "Proportionnel = même coefficient pour toutes les colonnes." },

      { t: "Calculer une quatrième proportionnelle",
        html: "<p>Dans un tableau de proportionnalité, on peut trouver un nombre manquant de trois façons :</p><ul><li><strong>Avec le coefficient</strong> : 7 × 500 = <strong>3 500 F</strong>.</li><li><strong>Par le passage à l'unité</strong> : 1 kg coûte 1 500 ÷ 3 = 500 F, donc 7 kg coûtent 7 × 500 F.</li><li><strong>En additionnant des colonnes</strong> : 7 kg = 2 kg + 5 kg, donc 1 000 F + 2 500 F = 3 500 F.</li></ul><div class='ex'><b>Dans l'autre sens</b>Avec 4 000 F, Ngono peut acheter 4 000 ÷ 500 = <strong>8 kg</strong>.</div>",
        planches: [{ type: "2D", titre: "Trois chemins vers 3 500 F", legende: "Le coefficient, le passage à l'unité et l'addition de colonnes donnent le même prix pour 7 kg.", svg: (function () {
          var s = "", cols = [["1", "500"], ["2", "1 000"], ["3", "1 500"], ["5", "2 500"], ["7", "?"]], i;
          s += "<rect x='40' y='20' width='560' height='90' rx='12' fill='#fff' stroke='#C9D0DC'/>" + txt(80, 54, "kg", { s: 12, c: GRIS }) + txt(80, 92, "F", { s: 12, c: GRIS });
          cols.forEach(function (c, k) { s += txt(170 + k * 100, 54, c[0], { s: 16 }) + txt(170 + k * 100, 92, c[1], { s: 16, c: k === 4 ? "#C62828" : VERT }); });
          s += "<rect x='40' y='130' width='170' height='70' rx='10' fill='#EEF4FC'/>" + txt(125, 158, "coefficient", { s: 12.5, c: BLEU }) + txt(125, 184, "7 × 500", { s: 15 });
          s += "<rect x='235' y='130' width='170' height='70' rx='10' fill='#FFF6E3'/>" + txt(320, 158, "unité", { s: 12.5, c: "#8A6200" }) + txt(320, 184, "1 kg = 500 F", { s: 15 });
          s += "<rect x='430' y='130' width='170' height='70' rx='10' fill='#ECF7F0'/>" + txt(515, 158, "colonnes", { s: 12.5, c: VERT }) + txt(515, 184, "1 000 + 2 500", { s: 15 });
          s += txt(320, 226, "7 kg → 3 500 F", { s: 16, c: "#C62828" });
          return svg(640, 240, "Tableau du riz et trois méthodes pour trouver le prix de sept kilos", "", s);
        })() }],
        fil: { html: "<p>1 500 × 7 = 10 500 F serait le prix de <strong>21 kg</strong> (7 fois 3 kg) ! Le bon prix de 7 kg est 7 × 500 = <strong>3 500 F</strong>.</p>", verdicts: [[2, "rejetee", "1 500 F est le prix de 3 kg : 1 500 × 7 donne 21 kg. On multiplie le prix d'UN kilo : 7 × 500 = 3 500 F."]] },
        retenir: "Quatrième proportionnelle : coefficient, unité ou somme de colonnes." },

      { t: "Pourcentage et échelle",
        html: "<p>Un <strong>pourcentage</strong> est une proportion sur 100 : prendre 20 %, c'est multiplier par 20 ÷ 100.</p><div class='ex'><b>Une réduction</b>Mama Bella fait 10 % de remise sur 3 500 F : 3 500 × 10 ÷ 100 = <strong>350 F</strong> ; Ngono paie 3 150 F.</div><p>Une <strong>échelle</strong> relie une longueur sur le plan à la longueur réelle : c'est aussi un coefficient de proportionnalité.</p><div class='ex'><b>Le plan du marché</b>Échelle 1/1 000 : 1 cm sur le plan = 1 000 cm = 10 m en vrai. 6 cm sur le plan = <strong>60 m</strong>.</div>",
        planches: [{ type: "2D", titre: "10 % de 3 500 F et l'échelle du plan", legende: "La bande des 100 % découpée en 10 parts de 350 F ; à droite, 1 cm du plan vaut 10 m au marché.", svg: (function () {
          var s = "", i;
          for (i = 0; i < 10; i++) s += "<rect x='" + (30 + i * 30) + "' y='60' width='28' height='40' fill='" + (i === 0 ? "#E0475B" : "#2E86AB") + "' opacity='" + (i === 0 ? 1 : .55) + "'/>";
          s += txt(180, 46, "3 500 F = 100 %", { s: 13 }) + txt(44, 124, "10 % = 350 F", { s: 13, c: "#E0475B", a: "start" });
          s += "<rect x='380' y='40' width='230' height='120' rx='10' fill='#F4F1E6' stroke='#D8CFAF'/><path d='M400 140H580' stroke='" + NUIT + "' stroke-width='3'/>";
          for (i = 0; i <= 6; i++) s += "<path d='M" + (400 + i * 30) + " 132V148' stroke='" + NUIT + "' stroke-width='2'/>";
          s += txt(495, 126, "6 cm sur le plan", { s: 12 }) + txt(495, 172, "= 60 m au marché", { s: 13, c: VERT }) + txt(495, 66, "échelle 1/1 000", { s: 13, c: BLEU });
          return svg(640, 190, "Une bande de dix parts pour dix pour cent et une barre d'échelle", "", s);
        })() }],
        fil: { html: "<p>Pourcentages et échelles sont des tableaux de proportionnalité « cachés » : on multiplie toujours par le même nombre.</p>", verdicts: [] },
        retenir: "p % de x = x × p ÷ 100 ; échelle = coefficient plan → réel." },

      { t: "Entraînement", html: entrainement(
        "<p><strong>Question de cours.</strong> Comment savoir si un tableau est un tableau de proportionnalité ?</p><details><summary>Voir la réponse</summary><p>On divise chaque nombre de la 2ᵉ ligne par celui de la 1ʳᵉ : si l'on trouve toujours le même quotient (le coefficient), le tableau est proportionnel.</p></details><p><strong>Exercice.</strong> 4 cahiers coûtent 1 000 F. Complète : 6 cahiers → … F ; … cahiers → 2 500 F.</p><details><summary>Voir la réponse</summary><p>Coefficient 250 : 6 × 250 = 1 500 F ; 2 500 ÷ 250 = 10 cahiers.</p></details>",
        "<p><strong>Situation.</strong> Pour la fête de l'école de Dschang, la recette de jus de foléré prévoit 2 L d'eau pour 150 g de fleurs, pour 10 élèves. On attend 45 élèves.</p><p><strong>Tâche.</strong> Calcule les quantités d'eau et de fleurs, en présentant un tableau de proportionnalité.</p><details><summary>Voir une réponse attendue</summary><p>Coefficient 45 ÷ 10 = 4,5 : eau 2 × 4,5 = <strong>9 L</strong> ; fleurs 150 × 4,5 = <strong>675 g</strong>.</p></details>"),
        retenir: "Savoir-être : gérer un budget familial avec rigueur." }
    ],
    denouement: {
      titre: "3 500 F pour 7 kg de riz",
      etapes: ["Riz : même coefficient 500 dans toutes les colonnes → proportionnel (indice 1).", "Mangues : 167 puis 150 → pas proportionnel (indice 1).", "7 kg : 7 × 500 = 3 500 F, pas 1 500 × 7 (indice 2)."],
      reponse: "<p>Seul le prix du riz est <strong>proportionnel</strong> à la quantité (coefficient 500 F/kg). Pour <strong>7 kg</strong>, Ngono paiera <strong>7 × 500 = 3 500 F</strong>. Son frère calculait le prix de 21 kg ; sa sœur oubliait que « augmenter ensemble » ne suffit pas : les mangues sont moins chères à l'unité par 6.</p>",
      transfert: "<p>Avec ses 5 000 F, Ngono achète ses 7 kg de riz. Combien lui reste-t-il, et combien de kilos en plus pourrait-elle acheter ? <em>(5 000 − 3 500 = 1 500 F, soit 3 kg de plus.)</em></p>"
    },
    revision: ["Tableau proportionnel : <strong>même coefficient</strong> pour toutes les colonnes.", "Coefficient = 2ᵉ ligne ÷ 1ʳᵉ ligne.", "Quatrième proportionnelle : <strong>coefficient</strong>, <strong>passage à l'unité</strong> ou <strong>somme de colonnes</strong>.", "p % de x = x × p ÷ 100.", "Échelle : longueur sur le plan → longueur réelle, même multiplication."],
    exo: "<p>Un taxi-moto demande 200 F pour 2 km, 300 F pour 4 km. Ce tarif est-il proportionnel ? <em>(200 ÷ 2 = 100 et 300 ÷ 4 = 75 : non.)</em></p>",
    quiz: [
      q("Un tableau est proportionnel si :", "on multiplie toujours par le même nombre", "les deux lignes augmentent", "les nombres sont rangés", "C'est la définition du coefficient."),
      q("3 kg coûtent 1 500 F. Le coefficient vaut :", "500", "1 500", "3", "1 500 ÷ 3."),
      q("Au même prix, 7 kg coûtent :", "3 500 F", "10 500 F", "1 507 F", "7 × 500."),
      q("Avec 4 000 F à 500 F le kg, on achète :", "8 kg", "4 kg", "2 000 kg", "4 000 ÷ 500."),
      q("3 mangues 500 F, 6 mangues 900 F : c'est", "pas proportionnel", "proportionnel", "impossible", "Le prix par mangue change."),
      q("10 % de 3 500 F valent :", "350 F", "35 F", "3 150 F", "3 500 × 10 ÷ 100."),
      q("Échelle 1/1 000 : 6 cm sur le plan représentent :", "60 m", "6 m", "600 m", "6 × 1 000 cm = 6 000 cm."),
      q("2 kg → 1 000 F et 5 kg → 2 500 F, donc 7 kg →", "3 500 F", "3 000 F", "1 500 F", "On additionne les colonnes."),
      q("Le passage à l'unité consiste à :", "calculer le prix d'un seul objet", "multiplier par 100", "ajouter 1", "Puis on multiplie."),
      q("Le prix est proportionnel au nombre de cahiers si :", "chaque cahier coûte le même prix", "on paie plus pour plus de cahiers", "il y a une promotion", "Prix d'un cahier = coefficient.")
    ],
    apc: { module: "Mathématiques de 6e", famille: "Vie économique", agir: "Comparer des prix et gérer un budget", situation: "Des courses au marché avec deux tarifs différents.", tache: "Dire quel prix est proportionnel et calculer le prix d'une quantité." }
  });

  /* ═══════════════════════ 6e — PATRON D'UN CUBE ET D'UN PAVÉ DROIT ═══════════════════════ */
  function paveCav(x, y, L, l, h, k, coul) {
    var dx = l * k * .5, dy = -l * k * .35, a = L * k, b = h * k;
    return "<g transform='translate(" + x + " " + y + ")'><path d='M0 0H" + a + "V" + b + "H0Z' fill='" + coul[0] + "' stroke='" + NUIT + "' stroke-width='2'/><path d='M0 0L" + dx + " " + dy + "H" + (a + dx) + "L" + a + " 0Z' fill='" + coul[1] + "' stroke='" + NUIT + "' stroke-width='2'/><path d='M" + a + " 0L" + (a + dx) + " " + dy + "V" + (b + dy) + "L" + a + " " + b + "Z' fill='" + coul[2] + "' stroke='" + NUIT + "' stroke-width='2'/><path d='M0 " + b + "L" + dx + " " + (b + dy) + "H" + (a + dx) + "M" + dx + " " + (b + dy) + "V" + dy + "' fill='none' stroke='" + NUIT + "' stroke-width='1.5' stroke-dasharray='5 4'/></g>";
  }
  VRT_L("6e-maths-pave-droit", {
    c: "6e", m: "maths", cle: "Patron d'un cube et d'un pavé droit", titre: "Le cube et le pavé droit : patron, aire et volume", duree: 35,
    accroche: "Une boîte de 20 cm × 12 cm × 8 cm : combien de carton pour la fabriquer, combien de savons cubiques dedans ?",
    intro: "À Bafang, la coopérative des femmes fabrique du savon. Partie après partie, tu dessines la boîte, son patron, puis tu la remplis.",
    objectifs: ["décrire un cube et un pavé droit (faces, arêtes, sommets)", "dessiner le patron d'un pavé droit", "calculer l'aire totale d'un pavé droit", "calculer le volume d'un pavé droit et d'un cube"],
    enquete: {
      titre: "Les boîtes de savon de Bafang",
      svg: (function () {
        var s = "<rect width='640' height='220' fill='#F4FBF6'/><rect y='176' width='640' height='44' fill='#D8C9A6'/>", i;
        s += paveCav(70, 90, 20, 12, 8, 7, ["#E9C98B", "#F3DDB0", "#D7B26B"]) + txt(140, 170, "20 cm × 12 cm × 8 cm", { s: 12, c: "#8A6200" });
        for (i = 0; i < 6; i++) s += paveCav(330 + (i % 3) * 46, 120 - Math.floor(i / 3) * 40, 4, 4, 4, 8, ["#9AD1C4", "#C2E6DD", "#6FB8A6"]);
        s += txt(400, 170, "savons cubiques de 4 cm", { s: 12, c: VERT });
        s += perso(560, 92, PEAU[3], "#E07B1F", "#3A2A20") + "<rect x='300' y='14' width='300' height='34' rx='12' fill='#fff' stroke='#BFDCC9'/>" + txt(450, 36, "Coopérative Les Mains de Bafang", { s: 12.5, c: VERT });
        return svg(640, 220, "Une boîte en carton en forme de pavé droit et des savons cubiques", "", s);
      })(),
      legende: "Bafang : la coopérative prépare la livraison de ses savons au marché de Bafoussam.",
      contexte: "<p>La coopérative veut des boîtes en carton de <strong>20 cm de long, 12 cm de large et 8 cm de haut</strong>, fermées. Les savons sont des <strong>cubes de 4 cm</strong> d'arête.</p><p>Kamga affirme : « Le carton, c'est 20 × 12 × 8. » Nadia propose : « Il y a trois faces différentes : 20 × 12 + 20 × 8 + 12 × 8. »</p>",
      documents: [{ t: "Le carton", html: "<table class='donnees'><tr><td>Feuille de carton</td><td>60 cm × 40 cm = 2 400 cm²</td></tr><tr><td>Prix d'une feuille</td><td>300 F</td></tr></table>" }],
      question: "Quelle surface de carton faut-il pour une boîte, et combien de savons peut-elle contenir ?",
      tache: "Dessine le patron de la boîte, calcule son aire totale, puis son volume et le nombre de savons.",
      hypotheses: [
        "Le carton nécessaire se calcule par 20 × 12 × 8.",
        "Il suffit des trois faces différentes : 20 × 12 + 20 × 8 + 12 × 8.",
        "La boîte a 6 faces, égales deux à deux ; le volume, lui, se calcule par longueur × largeur × hauteur."
      ]
    },
    parties: [
      { t: "Décrire un cube et un pavé droit",
        html: "<div class='def'><b>Définition</b>Un <strong>pavé droit</strong> (ou parallélépipède rectangle) est un solide dont les <strong>6 faces</strong> sont des rectangles. Un <strong>cube</strong> est un pavé droit dont les 6 faces sont des carrés égaux.</div><ul><li><strong>6 faces</strong>, opposées deux à deux et égales ;</li><li><strong>12 arêtes</strong>, par groupes de 4 de même longueur ;</li><li><strong>8 sommets</strong>.</li></ul><div class='ex'><b>La boîte</b>Faces : deux de 20 × 12, deux de 20 × 8, deux de 12 × 8.</div>",
        planches: [{ type: "2D", titre: "Le pavé droit en perspective cavalière", legende: "Les arêtes cachées sont en pointillés ; les arêtes parallèles restent parallèles sur le dessin.", svg: (function () {
          var s = paveCav(80, 90, 20, 12, 8, 10, ["#F3DDB0", "#FBEBCB", "#E2C285"]);
          s += txt(180, 210, "longueur 20 cm", { s: 12.5, c: ORANGE }) + txt(64, 134, "8 cm", { s: 12.5, c: ORANGE, a: "end" }) + txt(330, 60, "12 cm", { s: 12.5, c: ORANGE });
          s += "<rect x='400' y='40' width='210' height='150' rx='14' fill='#EEF4FC' stroke='#C9D8EE'/>" + txt(505, 76, "6 faces", { s: 18, c: BLEU }) + txt(505, 114, "12 arêtes", { s: 18, c: VERT }) + txt(505, 152, "8 sommets", { s: 18, c: "#C62828" });
          return svg(640, 230, "Un pavé droit de 20 sur 12 sur 8 centimètres dessiné en perspective cavalière", "", s);
        })() }, { type: "3d", titre: "La boîte et ses 30 savons", legende: "Tourne la boîte : 5 savons dans la longueur, 3 dans la largeur, 2 couches. Le curseur soulève les couches.",
          modele: { h: 340, rx: -26, ry: 30, echelle: .78, dy: 24, alt: "Une boîte en pavé droit ouverte remplie de trente savons cubiques en deux couches", eclate: "Soulever les couches", jouer: "Compter les savons",
            objets: (function () { var o = [{ f: "boite", c: [0, -4, 0], d: [216, 4, 136], coul: "#D7B26B", dessus: "#E9C98B", div: false }], i, j, k, cs = ["#9AD1C4", "#F4A261"];
              o.push({ f: "boite", c: [0, 40, -66], d: [216, 88, 4], coul: "#D7B26B", dessus: "#E9C98B", div: false, op: .28 });
              o.push({ f: "boite", c: [-106, 40, 0], d: [4, 88, 136], coul: "#CFA75E", dessus: "#E9C98B", div: false, op: .28 });
              for (k = 0; k < 2; k++) for (i = 0; i < 5; i++) for (j = 0; j < 3; j++) o.push({ f: "boite", c: [-80 + i * 40, 20 + k * 40, -40 + j * 40], d: [36, 36, 36], coul: cs[k], dessus: k ? "#F8C79A" : "#C2E6DD", div: false, ec: [0, k * 70, 0] });
              return o; })(),
            etiquettes: [{ p: [-80, 80, -40], t: "couche du haut : 15 savons", ec: [0, 70, 0] }, { p: [80, 20, 40], t: "couche du bas : 15 savons", cote: "d" }] } }],
        fil: { html: "<p>Le carton doit couvrir les <strong>6 faces</strong> de la boîte. Les savons, eux, remplissent l'intérieur : ce sera une question de <strong>volume</strong>, pas d'aire.</p>", verdicts: [[1, "rejetee", "La boîte a 6 faces, pas 3 : chaque face existe en deux exemplaires (dessus et dessous, devant et derrière, deux côtés)."]] },
        retenir: "Pavé droit : 6 faces rectangulaires, 12 arêtes, 8 sommets." },

      { t: "Le patron et l'aire totale",
        html: "<div class='def'><b>Définition</b>Un <strong>patron</strong> est une figure plane qui, après pliage, permet de fabriquer le solide sans recouvrement.</div><p>Le patron de la boîte réunit ses 6 faces : 2 de 20 × 12, 2 de 20 × 8 et 2 de 12 × 8.</p><p class='formule'>Aire totale = 2 × (L × l + L × h + l × h)</p><div class='ex'><b>Calcul</b>2 × (20 × 12 + 20 × 8 + 12 × 8) = 2 × (240 + 160 + 96) = 2 × 496 = <strong>992 cm²</strong>.</div><div class='astuce'><b>Astuce</b>Pour un cube d'arête a : aire totale = 6 × a × a.</div>",
        planches: [{ type: "2D", titre: "Le patron de la boîte", legende: "Le patron : une bande de quatre faces (dessus, devant, dessous, arrière) et, de part et d'autre du dessus, les deux côtés de 12 × 8.", svg: (function () {
          var k = 4.2, L = 20 * k, l = 12 * k, h = 8 * k, x0 = 120, y0 = 30, s = "", F = function (x, y, w, hh, c, t) { return "<rect x='" + x + "' y='" + y + "' width='" + w + "' height='" + hh + "' fill='" + c + "' stroke='" + NUIT + "' stroke-width='2'/>" + txt(x + w / 2, y + hh / 2 + 5, t, { s: 11.5 }); };
          s += F(x0 + h, y0, L, l, "#FBEBCB", "dessus 20×12");
          s += F(x0 + h, y0 + l, L, h, "#F3DDB0", "devant 20×8");
          s += F(x0 + h, y0 + l + h, L, l, "#FBEBCB", "dessous 20×12");
          s += F(x0 + h, y0 + 2 * l + h, L, h, "#F3DDB0", "arrière 20×8");
          s += F(x0, y0, h, l, "#E2C285", "") + F(x0 + h + L, y0, h, l, "#E2C285", "");
          s += txt(x0 + h / 2, y0 + l / 2 - 2, "côté", { s: 9 }) + txt(x0 + h / 2, y0 + l / 2 + 10, "12×8", { s: 8.5 }) + txt(x0 + h + L + h / 2, y0 + l / 2 - 2, "côté", { s: 9 }) + txt(x0 + h + L + h / 2, y0 + l / 2 + 10, "12×8", { s: 8.5 });
          s += "<rect x='420' y='60' width='200' height='150' rx='14' fill='#ECF7F0' stroke='#BFDCC9'/>" + txt(520, 92, "2 × 240 = 480", { s: 14 }) + txt(520, 120, "2 × 160 = 320", { s: 14 }) + txt(520, 148, "2 × 96 = 192", { s: 14 }) + txt(520, 184, "total : 992 cm²", { s: 16, c: VERT });
          return svg(640, 280, "Le patron en croix d'un pavé droit de 20 sur 12 sur 8 et le calcul de son aire totale", "", s);
        })() }],
        fil: { html: "<p>Le patron compte <strong>6 rectangles</strong> : 992 cm², soit le double de la somme de Nadia (496 cm²). Une feuille de 2 400 cm² suffit donc pour 2 boîtes (2 × 992 = 1 984 cm²), en théorie.</p>", verdicts: [[0, "rejetee", "20 × 12 × 8 = 1 920 est un volume (cm³), pas la surface de carton (cm²)."]] },
        retenir: "Aire totale = 2 × (L×l + L×h + l×h) ; cube : 6 × a × a." },

      { t: "Le volume",
        html: "<p>Le <strong>volume</strong> mesure la place occupée à l'intérieur. On compte combien de cubes d'1 cm d'arête (1 cm³) remplissent le pavé.</p><p class='formule'>Volume du pavé droit = L × l × h &nbsp;&nbsp;·&nbsp;&nbsp; Volume du cube = a × a × a</p><div class='ex'><b>La boîte</b>V = 20 × 12 × 8 = <strong>1 920 cm³</strong>. Un savon : 4 × 4 × 4 = 64 cm³. Nombre de savons : 1 920 ÷ 64 = <strong>30</strong>, rangés en 5 × 3 × 2.</div><div class='attention'><b>Attention</b>Aire en cm², volume en cm³ : on ne les additionne jamais.</div>",
        planches: [{ type: "2D", titre: "Ranger les savons couche par couche", legende: "Une couche : 5 savons × 3 savons = 15 ; deux couches dans 8 cm de hauteur : 30 savons.", svg: (function () {
          var s = "", i, j;
          for (i = 0; i < 5; i++) for (j = 0; j < 3; j++) s += "<rect x='" + (40 + i * 44) + "' y='" + (50 + j * 44) + "' width='40' height='40' rx='6' fill='#9AD1C4' stroke='#5FA592'/>";
          s += txt(150, 36, "5 × 3 = 15 savons par couche", { s: 13, c: VERT });
          s += paveCav(330, 120, 5, 3, 2, 26, ["#9AD1C4", "#C2E6DD", "#6FB8A6"]) + "<path d='M330 146H460' stroke='#fff' stroke-width='2'/>";
          s += txt(470, 216, "2 couches → 30 savons", { s: 14, c: VERT }) + txt(470, 236, "1 920 ÷ 64 = 30", { s: 13 });
          return svg(640, 250, "Une couche de quinze savons vue de dessus et un empilement de deux couches", "", s);
        })() }],
        fil: { html: "<p>La boîte contient exactement <strong>30 savons</strong> : 1 920 cm³ ÷ 64 cm³. Les deux grandeurs se calculent différemment : aire = 992 cm², volume = 1 920 cm³.</p>", verdicts: [[2, "validee", "6 faces → 992 cm² de carton ; L × l × h → 1 920 cm³ → 30 savons."]] },
        retenir: "Volume du pavé = L × l × h (en cm³) ; cube : a × a × a." },

      { t: "Entraînement", html: entrainement(
        "<p><strong>Question de cours.</strong> Combien un cube a-t-il de faces, d'arêtes et de sommets ? Donne la formule de son volume.</p><details><summary>Voir la réponse</summary><p>6 faces, 12 arêtes, 8 sommets ; V = a × a × a.</p></details><p><strong>Exercice.</strong> Un cube a 5 cm d'arête. Calcule son aire totale et son volume.</p><details><summary>Voir la réponse</summary><p>Aire : 6 × 5 × 5 = 150 cm² ; volume : 5 × 5 × 5 = 125 cm³.</p></details>",
        "<p><strong>Situation.</strong> L'école de Foumban construit une citerne en forme de pavé droit de 2 m × 1,5 m × 1 m pour recueillir l'eau de pluie.</p><p><strong>Tâche.</strong> Calcule son volume en m³ puis en litres (1 m³ = 1 000 L), et dis combien de seaux de 10 L elle peut remplir.</p><details><summary>Voir une réponse attendue</summary><p>V = 2 × 1,5 × 1 = 3 m³ = 3 000 L, soit <strong>300 seaux</strong>.</p></details>"),
        retenir: "Savoir-être : travailler en coopérative avec méthode." }
    ],
    denouement: {
      titre: "992 cm² de carton, 30 savons par boîte",
      etapes: ["La boîte a 6 faces égales deux à deux (indice 1).", "Patron : 2 × (240 + 160 + 96) = 992 cm² (indice 2).", "Volume : 20 × 12 × 8 = 1 920 cm³ ; 1 920 ÷ 64 = 30 savons (indice 3)."],
      reponse: "<p>Il faut <strong>992 cm² de carton</strong> par boîte (6 faces : 2 × 240 + 2 × 160 + 2 × 96), sans compter les languettes de collage. La boîte a un volume de <strong>1 920 cm³</strong> et contient <strong>30 savons</strong> cubiques de 4 cm (5 × 3 × 2). Kamga calculait un volume à la place d'une aire ; Nadia oubliait la moitié des faces.</p>",
      transfert: "<p>La coopérative veut une boîte cubique de 12 cm d'arête. Carton et nombre de savons ? <em>(Aire : 6 × 144 = 864 cm² ; volume 1 728 cm³ ÷ 64 = 27 savons, 3 × 3 × 3.)</em></p>"
    },
    revision: ["Pavé droit : <strong>6 faces</strong> rectangulaires, <strong>12 arêtes</strong>, <strong>8 sommets</strong> ; cube : 6 carrés égaux.", "<strong>Patron</strong> : figure plane qui se plie en solide sans recouvrement.", "Aire totale du pavé = <strong>2 × (L×l + L×h + l×h)</strong> ; cube : 6 × a × a.", "Volume du pavé = <strong>L × l × h</strong> ; cube : a × a × a (en cm³, m³).", "1 dm³ = 1 L ; 1 m³ = 1 000 L."],
    exo: "<p>Une brique mesure 20 cm × 10 cm × 5 cm. Calcule son volume et l'aire de toutes ses faces. <em>(V = 1 000 cm³ ; A = 2 × (200 + 100 + 50) = 700 cm².)</em></p>",
    quiz: [
      q("Un pavé droit a :", "6 faces, 12 arêtes, 8 sommets", "4 faces, 8 arêtes, 6 sommets", "6 faces, 8 arêtes, 12 sommets", "À retenir par cœur."),
      q("Le volume d'un pavé 20 × 12 × 8 (cm) vaut :", "1 920 cm³", "992 cm²", "40 cm", "L × l × h."),
      q("L'aire totale de ce pavé vaut :", "992 cm²", "496 cm²", "1 920 cm²", "2 × (240 + 160 + 96)."),
      q("Le volume d'un cube de 4 cm d'arête est :", "64 cm³", "16 cm³", "12 cm³", "4 × 4 × 4."),
      q("L'aire totale d'un cube de 3 cm d'arête est :", "54 cm²", "27 cm²", "9 cm²", "6 × 3 × 3."),
      q("Un patron est :", "une figure plane qui se plie en solide", "un dessin en perspective", "une face", "Sans recouvrement."),
      q("Combien de cubes de 4 cm dans une boîte 20 × 12 × 8 ?", "30", "15", "60", "1 920 ÷ 64."),
      q("Un volume s'exprime en :", "cm³ ou m³", "cm² ou m²", "cm ou m", "Trois dimensions."),
      q("1 m³ correspond à :", "1 000 L", "100 L", "10 L", "1 dm³ = 1 L."),
      q("Dans un pavé droit, deux faces opposées sont :", "égales", "perpendiculaires", "toujours carrées", "Elles ont les mêmes dimensions.")
    ],
    apc: { module: "Mathématiques de 6e", famille: "Vie économique", agir: "Fabriquer et remplir un emballage", situation: "Les boîtes de savon d'une coopérative de Bafang.", tache: "Calculer le carton d'une boîte et le nombre de savons qu'elle contient." }
  });

  /* ═══════════════════════ SIMULATIONS ═══════════════════════ */
  function $(el, s) { return el.querySelector(s); }
  function curseur(lib, min, max, pas, val, unite) {
    return "<label class='labo-c'><span>" + lib + " : <b data-v>" + val + "</b>" + (unite || "") + "</span><input type='range' min='" + min + "' max='" + max + "' step='" + pas + "' value='" + val + "'></label>";
  }
  function f2(n) { return n.toLocaleString("fr-FR", { maximumFractionDigits: 2 }); }

  /* Cercle : diamètre → périmètre déroulé et aire, comparés au carré qui l'entoure */
  VRT_A("6e-maths-cercle", 1, "Change le diamètre : le tour du cercle contre le tour du carré", function (el) {
    el.innerHTML = curseur("Diamètre", 0.4, 3, 0.1, 1.4, " m") + "<svg viewBox='0 0 640 200' class='an-svg' data-s></svg><p class='labo-r' data-r></p>";
    var I = $(el, "input"), V = $(el, "[data-v]"), sv = $(el, "[data-s]");
    function maj() {
      var d = +I.value, r = d / 2, k = 50, P = Math.round(3.14 * d * 100) / 100, A = Math.round(3.14 * r * r * 100) / 100, s = "";
      V.textContent = f2(d);
      s += "<rect x='" + (100 - r * k) + "' y='" + (90 - r * k) + "' width='" + (d * k) + "' height='" + (d * k) + "' fill='none' stroke='#C62828' stroke-width='2' stroke-dasharray='6 4'/><circle cx='100' cy='90' r='" + (r * k) + "' fill='#EEF4FC' stroke='" + BLEU + "' stroke-width='3'/>";
      s += "<rect x='240' y='60' width='" + Math.min(380, P * 22) + "' height='14' rx='4' fill='" + BLEU + "'/><text x='240' y='52' font-size='12' font-weight='700' fill='" + BLEU + "'>tour du cercle : " + f2(P) + " m</text>";
      s += "<rect x='240' y='120' width='" + Math.min(380, 4 * d * 22) + "' height='14' rx='4' fill='#C62828'/><text x='240' y='112' font-size='12' font-weight='700' fill='#C62828'>tour du carré : " + f2(4 * d) + " m</text>";
      sv.innerHTML = s;
      $(el, "[data-r]").innerHTML = "Périmètre = 3,14 × " + f2(d) + " ≈ <b>" + f2(P) + " m</b> · aire du disque = 3,14 × " + f2(r) + " × " + f2(r) + " ≈ <b>" + f2(A) + " m²</b> · fer : " + Math.round(P * 1500).toLocaleString("fr-FR") + " F, tôle : " + Math.round(A * 6000).toLocaleString("fr-FR") + " F.";
    }
    I.addEventListener("input", maj); maj();
  });

  /* Proportionnalité : prix au kilo, quantité, promotion qui casse la proportionnalité */
  VRT_A("6e-maths-proportionnalite", 1, "Construis le tableau : reste-t-il proportionnel ?", function (el) {
    el.innerHTML = "<div style='display:flex;flex-wrap:wrap;gap:8px 18px'>" + curseur("Prix d'un kilo", 300, 900, 50, 500, " F") + curseur("Quantité cherchée", 1, 12, 1, 7, " kg") + "</div><label style='display:flex;gap:8px;align-items:center;margin:6px 0'><input type='checkbox' data-p> Promotion : 1 kg offert dès 5 kg</label><svg viewBox='0 0 640 170' class='an-svg' data-s></svg><p class='labo-r' data-r></p>";
    var I = el.querySelectorAll("input[type=range]"), V = el.querySelectorAll("[data-v]"), pr = $(el, "[data-p]"), sv = $(el, "[data-s]");
    function prix(k, p) { return pr.checked && k >= 5 ? (k - 1) * p : k * p; }
    function maj() {
      var p = +I[0].value, q = +I[1].value, s = "", ks = [1, 2, 3, 5, 8, 10], max = prix(12, p) || 1, coefs = {};
      V[0].textContent = p; V[1].textContent = q;
      ks.forEach(function (k, i) { var v = prix(k, p), h = v / max * 110, x = 40 + i * 96; coefs[(v / k).toFixed(2)] = 1;
        s += "<rect x='" + x + "' y='" + (130 - h) + "' width='54' height='" + h + "' rx='6' fill='" + (v / k === p ? "#1B998B" : "#E0475B") + "'/><text x='" + (x + 27) + "' y='150' font-size='12' text-anchor='middle' font-weight='700'>" + k + " kg</text><text x='" + (x + 27) + "' y='" + (124 - h) + "' font-size='11' text-anchor='middle' font-weight='700'>" + v.toLocaleString("fr-FR") + "</text>"; });
      sv.innerHTML = s;
      var prop = Object.keys(coefs).length === 1;
      $(el, "[data-r]").innerHTML = (prop ? "<b>Proportionnel</b> : chaque colonne × " + p + "." : "<b>Plus proportionnel</b> : le prix d'un kilo change selon la quantité (barres rouges).") + " " + q + " kg coûtent <b>" + prix(q, p).toLocaleString("fr-FR") + " F</b>.";
    }
    I[0].addEventListener("input", maj); I[1].addEventListener("input", maj); pr.addEventListener("change", maj); maj();
  });

  /* Pavé droit : dimensions → patron à l'échelle, aire totale, volume et nombre de savons */
  VRT_A("6e-maths-pave-droit", 1, "Choisis les dimensions : patron, carton et savons", function (el) {
    el.innerHTML = "<div style='display:flex;flex-wrap:wrap;gap:8px 18px'>" + curseur("Longueur", 4, 28, 4, 20, " cm") + curseur("Largeur", 4, 16, 4, 12, " cm") + curseur("Hauteur", 4, 12, 4, 8, " cm") + "</div><svg viewBox='0 0 640 260' class='an-svg' data-s></svg><p class='labo-r' data-r></p>";
    var I = el.querySelectorAll("input"), V = el.querySelectorAll("[data-v]"), sv = $(el, "[data-s]");
    function maj() {
      var L = +I[0].value, l = +I[1].value, h = +I[2].value, k = Math.min(240 / (2 * l + 2 * h), 300 / (L + 2 * h)), x0 = 20, y0 = 8, s = "";
      V[0].textContent = L; V[1].textContent = l; V[2].textContent = h;
      function R(x, y, w, hh, c) { return "<rect x='" + (x0 + x * k).toFixed(1) + "' y='" + (y0 + y * k).toFixed(1) + "' width='" + (w * k).toFixed(1) + "' height='" + (hh * k).toFixed(1) + "' fill='" + c + "' stroke='#001136' stroke-width='1.5'/>"; }
      s += R(h, 0, L, l, "#FBEBCB") + R(h, l, L, h, "#F3DDB0") + R(h, l + h, L, l, "#FBEBCB") + R(h, 2 * l + h, L, h, "#F3DDB0") + R(0, 0, h, l, "#E2C285") + R(h + L, 0, h, l, "#E2C285");
      var A = 2 * (L * l + L * h + l * h), Vo = L * l * h, n = (L / 4) * (l / 4) * (h / 4);
      s += "<text x='420' y='60' font-size='15' font-weight='700' fill='#17784D'>Aire : " + A.toLocaleString("fr-FR") + " cm²</text><text x='420' y='100' font-size='15' font-weight='700' fill='#1E499B'>Volume : " + Vo.toLocaleString("fr-FR") + " cm³</text><text x='420' y='140' font-size='15' font-weight='700' fill='#C2540A'>Savons de 4 cm : " + n + "</text>";
      sv.innerHTML = s;
      $(el, "[data-r]").innerHTML = "Aire = 2 × (" + L + "×" + l + " + " + L + "×" + h + " + " + l + "×" + h + ") = <b>" + A + " cm²</b> · volume = " + L + " × " + l + " × " + h + " = <b>" + Vo + " cm³</b> · " + (L / 4) + " × " + (l / 4) + " × " + (h / 4) + " = <b>" + n + " savons</b>.";
    }
    I.forEach(function (x) { x.addEventListener("input", maj); }); maj();
  });
})();
