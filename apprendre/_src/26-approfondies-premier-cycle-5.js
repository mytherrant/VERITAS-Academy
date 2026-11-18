/* Leçons APPROFONDIES — lot 18, 6e (18/11/2026) : coordination bras-jambes, matériel de dessin, site d'une pépinière.
   Même gabarit et même mécanisme que 11-approfondies-lot4.js (remplacement EN PLACE ; schémas d'origine (illus) repris ; quiz
   portés à 10 questions). Simulations VRT_A en fin (la partie 1 de 6e-eps-bras-jambes garde son animation de 91-animations-2.js). */
(function () {
  "use strict";
  var NUIT = "#001136", BLEU = "#1E499B", GRIS = "#4D5163", VERT = "#17784D", ROUGE = "#C62828", TERRE = "#C46A2B";

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
  function fleche(id, c) { return "<marker id='" + id + "' markerWidth='10' markerHeight='10' refX='7' refY='5' orient='auto'><path d='M0 1L8 5L0 9Z' fill='" + c + "'/></marker>"; }
  function svg(w, h, alt, defs, corps) {
    return "<svg viewBox='0 0 " + w + " " + h + "' role='img' aria-label='" + alt + "' font-family='Inter,Arial,sans-serif'><rect width='" + w + "' height='" + h + "' fill='#fff'/><defs>" + defs + "</defs>" + corps +
      "<text x='" + (w - 6) + "' y='" + (h - 5) + "' font-size='8' text-anchor='end' fill='#8A93A6'>Planche VÉRITAS</text></svg>";
  }
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
  /* portrait en buste (arbre généalogique) */
  function portrait(x, y, peau, habit, cheveux, age) {
    var s = "<g transform='translate(" + x + " " + y + ")'><circle r='30' fill='#F4EFE4' stroke='#C9A576' stroke-width='3'/><clipPath id='pc" + x + "_" + y + "'><circle r='28'/></clipPath><g clip-path='url(#pc" + x + "_" + y + ")'>";
    s += "<path d='M-26 32C-26 14 -14 10 0 10S26 14 26 32Z' fill='" + habit + "'/><rect x='-4' y='2' width='8' height='10' fill='" + peau + "'/><ellipse cy='-6' rx='11' ry='13' fill='" + peau + "'/>";
    s += age === "vieux" ? "<path d='M-11 -10C-12 -20 -4 -21 0 -21S12 -20 11 -10C9 -14 -9 -14 -11 -10Z' fill='#D8D8D8'/>" : age === "femme" ? "<path d='M-13 -6C-15 -24 15 -24 13 -6C12 -14 -12 -14 -13 -6Z' fill='" + cheveux + "'/><path d='M-13 -14h26v-6c-6 -6 -20 -6 -26 0Z' fill='" + habit + "'/>" : "<path d='M-11 -10C-12 -20 -4 -21 0 -21S12 -20 11 -10C9 -14 -9 -14 -11 -10Z' fill='" + cheveux + "'/>";
    s += "<circle cx='-4' cy='-6' r='1.4' fill='#1B1410'/><circle cx='4' cy='-6' r='1.4' fill='#1B1410'/><path d='M-3 2q3 2 6 0' stroke='#1B1410' fill='none'/></g></g>";
    return s;
  }
  /* boucle d'exercice générique : [phrase avec ___, [bonne, autres…], explication] */
  function exercice(el, C, suivant, lib) {
    var i = 0, ok = 0;
    el.innerHTML = "<p class='labo-r' data-q style='font-size:16px'></p><div style='display:flex;gap:8px;flex-wrap:wrap' data-c></div><p class='an-note' data-e></p><p class='labo-r' data-s></p>";
    function $(s) { return el.querySelector(s); }
    function poser() {
      var c = C[i];
      $("[data-q]").innerHTML = (i + 1) + ". " + c[0].replace("___", "<b style='border-bottom:2px dashed #1E499B;padding:0 14px'>?</b>");
      $("[data-e]").textContent = ""; $("[data-s]").innerHTML = lib + " " + (i + 1) + " / " + C.length + " · score : <b>" + ok + "</b>";
      $("[data-c]").innerHTML = c[1].slice().sort().map(function (x) { return "<button type='button' class='btn-l' data-v='" + x + "'>" + x + "</button>"; }).join("");
      el.querySelectorAll("[data-v]").forEach(function (b) {
        b.addEventListener("click", function () {
          var bon = b.dataset.v === c[1][0]; if (bon) ok++;
          $("[data-q]").innerHTML = (i + 1) + ". " + c[0].replace("___", "<b style='color:" + (bon ? VERT : ROUGE) + "'>" + c[1][0] + "</b>");
          $("[data-e]").innerHTML = (bon ? "✔ " : "✘ ") + c[2];
          el.querySelectorAll("[data-v]").forEach(function (x) { x.disabled = true; });
          var nx = document.createElement("button"); nx.type = "button"; nx.className = "btn-l"; nx.textContent = i + 1 < C.length ? suivant : "↺";
          nx.addEventListener("click", function () { i = (i + 1) % C.length; if (!i) ok = 0; poser(); });
          $("[data-c]").appendChild(nx);
          $("[data-s]").innerHTML = lib + " " + (i + 1) + " / " + C.length + " · score : <b>" + ok + "</b>";
        });
      });
    }
    poser();
  }

  function alea(g) { return function () { g = (g * 16807) % 2147483647; return (g - 1) / 2147483646; }; }
  function ill(old, i) { return old && old.parties[i] ? old.parties[i].illus : undefined; }
  function chaine(o, pts, r, coul, z) {
    var k; for (k = 0; k < pts.length - 1; k++) { var a = pts[k], b = pts[k + 1], L = Math.hypot(b[0] - a[0], b[1] - a[1], (b[2] || z) - (a[2] || z)), n = Math.max(2, Math.round(L / (r * 0.9))), j; for (j = 0; j <= n; j++) { var t = j / n; o.push({ f: "sphere", c: [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, (a[2] == null ? z : a[2]) + (((b[2] == null ? z : b[2]) - (a[2] == null ? z : a[2])) * t)], r: r, coul: coul }); } }
  }

  /* ═══════════════════════ 6e EPS — LA COORDINATION BRAS-JAMBES ═══════════════════════ */
  var BJ_OLD = ancien("6e-eps-bras-jambes");
  function coureur3D() {
    var o = [], OR = "#E8A33D", BL = "#2F6DB5", PEAU = "#6B4423";
    o.push({ f: "boite", c: [0, 22, 0], d: [260, 6, 120], coul: "#B5442C", dessus: "#C0533A" });
    o.push({ f: "boite", c: [0, 25.5, 30], d: [260, 1, 2], coul: "#F4F1EA", div: false });
    o.push({ f: "boite", c: [0, 25.5, -30], d: [260, 1, 2], coul: "#F4F1EA", div: false });
    chaine(o, [[0, 100], [24, 78], [32, 48], [42, 46]], 5, OR, -8);
    chaine(o, [[0, 100], [-8, 64], [-32, 46], [-40, 40]], 5, BL, 8);
    o.push({ f: "sphere", c: [0, 132, 0], r: [13, 34, 11], coul: "#F4F1EA" });
    o.push({ f: "sphere", c: [0, 104, 0], r: [12, 9, 11], coul: "#1E499B" });
    chaine(o, [[0, 158, 14], [16, 138, 14], [30, 152, 14]], 4, OR);
    chaine(o, [[0, 158, -14], [-18, 136, -14], [-10, 118, -14]], 4, BL);
    o.push({ f: "sphere", c: [5, 182, 0], r: 12, coul: PEAU });
    o.push({ f: "cylindre", c: [2, 164, 0], r: 5, h: 8, n: 8, coul: PEAU });
    o.push({ f: "sphere", c: [44, 46, -8], r: [8, 4, 5], coul: "#1F2328" });
    o.push({ f: "sphere", c: [-42, 40, 8], r: [8, 4, 5], coul: "#1F2328" });
    o.forEach(function (b) { b.c[1] -= 105; });
    return o;
  }
  remplacer("6e-eps-bras-jambes", {
    c: "6e", m: "eps", titre: "Courir mieux : la coordination bras-jambes", duree: 30,
    accroche: "Au 60 m du lycée de Bafia, Samuel court les bras serrés contre le corps : « Les bras ne servent à rien ! » Son camarade balance le bras du même côté que la jambe. Et personne ne s'est échauffé…",
    intro: "Une séance de vitesse au lycée de Bafia te sert de fil rouge : à chaque partie, un indice t'aide à trancher entre trois conseils.",
    objectifs: ["décrire la coordination croisée bras-jambes", "expliquer pourquoi elle équilibre la course", "adopter une bonne posture de course", "s'échauffer et récupérer"],
    enquete: {
      titre: "La séance de vitesse de Bafia",
      svg: svg(640, 220, "Trois élèves courent sur une piste : l’un bras collés au corps, l’un bras et jambe du même côté, l’un en coordination croisée", lin("bjC", ["#CFE3F2", "#F4F1EA"], true),
        "<rect width='640' height='220' fill='url(#bjC)'/><rect y='150' width='640' height='70' fill='#B5442C'/><path d='M0 170H640M0 196H640' stroke='#F4F1EA' stroke-width='2'/>" +
        [[120, "serrés", 0], [320, "même côté", 1], [520, "croisés", 2]].map(function (c) {
          var x = c[0], s = "<g transform='translate(" + x + " 70)'><circle cx='0' cy='0' r='10' fill='#5A3A1E'/><path d='M0 10V52' stroke='#F4F1EA' stroke-width='12' stroke-linecap='round'/>";
          s += "<path d='M0 52L16 72L12 96M0 52L-12 74L-26 90' stroke='#1E499B' stroke-width='7' fill='none' stroke-linecap='round'/>";
          if (c[2] === 0) s += "<path d='M-4 16V44M4 16V44' stroke='#5A3A1E' stroke-width='5'/>";
          if (c[2] === 1) s += "<path d='M0 18L14 30L22 20M0 18L-12 32L-6 44' stroke='#5A3A1E' stroke-width='5' fill='none'/>";
          if (c[2] === 2) s += "<path d='M0 18L-14 32L-8 44M0 18L14 30L22 20' stroke='#5A3A1E' stroke-width='5' fill='none'/>";
          return s + "</g>" + txt(x, 214, c[1], { s: 11, c: "#fff" });
        }).join("") + bulle(30, 14, 190, "Les bras ? Inutiles !", "#F7C948") + bulle(420, 14, 200, "Qui va le plus droit ?", "#9FC5E8")),
      legende: "Au lycée de Bafia, la classe de 6e prépare le 60 m de l'épreuve sportive.",
      contexte: "<p>Samuel court les bras collés au corps : « Les bras ne servent à rien, ce sont les jambes qui courent. » Aboubakar balance le bras droit en même temps que la jambe droite et zigzague un peu. Christelle, elle, court fluide. À la deuxième course, deux élèves qui ne se sont pas échauffés se plaignent d'une crampe au mollet.</p>",
      documents: [{ t: "Les temps du 60 m", html: "<table class='donnees'><tr><th>Élève</th><th>Bras</th><th>Temps</th></tr><tr><td>Samuel</td><td>collés au corps</td><td>10,4 s</td></tr><tr><td>Aboubakar</td><td>même côté que la jambe</td><td>10,9 s</td></tr><tr><td>Christelle</td><td>bras opposé à la jambe</td><td>9,6 s</td></tr></table>" }],
      question: "Les bras servent-ils à courir, et comment doivent-ils bouger ?",
      tache: "Explique à Samuel et Aboubakar comment coordonner bras et jambes, puis propose un échauffement.",
      hypotheses: ["Les bras ne servent à rien : seules les jambes comptent.", "Il faut avancer le bras du même côté que la jambe.", "Coordination croisée (bras opposé à la jambe), coudes à 90°, regard devant ; et un échauffement avant l'effort."]
    },
    parties: [
      { t: "La coordination croisée", html: partie(BJ_OLD, 0),
        planches: [{ type: "2D", titre: "Une foulée décomposée", legende: "Quatre instants d'une foulée : à chaque fois, le bras qui avance (orange) est opposé à la jambe qui avance (orange). Les bras donnent le rythme et empêchent le buste de tourner.", svg: (function () {
          var s = "<rect width='640' height='230' fill='#FBF8F2'/><rect y='196' width='640' height='34' fill='#B5442C'/>", k;
          for (k = 0; k < 4; k++) {
            var x = 80 + k * 160, ph = k % 2 ? -1 : 1, OR = "#E8A33D", BL = "#2F6DB5", g = "<g transform='translate(" + x + " 60)'>";
            g += "<circle cx='6' cy='0' r='12' fill='#6B4423'/><path d='M2 12L0 74' stroke='#F4F1EA' stroke-width='14' stroke-linecap='round'/>";
            g += "<path d='M0 74L" + (24 * ph) + " 100L" + (30 * ph) + " 134' stroke='" + (ph > 0 ? OR : BL) + "' stroke-width='8' fill='none' stroke-linecap='round'/>";
            g += "<path d='M0 74L" + (-10 * ph) + " 110L" + (-34 * ph) + " 128' stroke='" + (ph > 0 ? BL : OR) + "' stroke-width='8' fill='none' stroke-linecap='round'/>";
            g += "<path d='M0 20L" + (-18 * ph) + " 40L" + (-10 * ph) + " 58' stroke='" + (ph > 0 ? BL : OR) + "' stroke-width='6' fill='none' stroke-linecap='round'/>";
            g += "<path d='M0 20L" + (16 * ph) + " 40L" + (30 * ph) + " 26' stroke='" + (ph > 0 ? OR : BL) + "' stroke-width='6' fill='none' stroke-linecap='round'/></g>";
            s += g + txt(x, 222, ["jambe A devant", "jambe B devant", "jambe A devant", "jambe B devant"][k], { s: 11, c: "#fff" });
          }
          return svg(640, 230, "Quatre silhouettes de coureur : chaque fois, le bras orange et la jambe orange opposés avancent ensemble", "", s);
        })() }],
        fil: { html: "<p>Christelle, la plus rapide, utilise ses bras : quand sa jambe droite avance, son bras gauche avance. Ce mouvement <strong>croisé</strong> équilibre la rotation du bassin par celle des épaules et donne le rythme. Les bras collés de Samuel freinent la course : ils servent bien à courir.</p>", verdicts: [[0, "rejetee", "Les bras équilibrent et rythment la course."]] },
        retenir: "Bras et jambe opposés avancent ensemble." },
      { t: "La bonne posture", html: partie(BJ_OLD, 1),
        planches: [{ type: "3d", titre: "Le coureur en pleine foulée", legende: "Tourne le coureur : la jambe droite (orange, côté proche) monte devant pendant que le bras gauche (orange, côté éloigné) avance, coude plié à 90° ; la jambe gauche et le bras droit (bleus) sont en arrière. Regard devant, buste droit, appui sur l'avant du pied.",
          modele: { h: 360, rx: -8, ry: 32, echelle: 1.2, alt: "Coureur articulé en pleine foulée sur une piste, membres opposés de même couleur", objets: coureur3D(),
            etiquettes: [{ p: [30, 47, 14], t: "bras gauche devant (coude 90°)", cote: "d" }, { p: [24, -27, -8], t: "jambe droite devant", cote: "d" }, { p: [-18, 31, -14], t: "bras droit en arrière", cote: "g" }, { p: [-8, -41, 8], t: "jambe gauche en arrière", cote: "g" }] } }],
        fil: { html: "<p>Avec le bras droit et la jambe droite ensemble, Aboubakar fait tourner tout son corps du même côté à chaque pas : il zigzague et perd du temps (simulation ci-dessus). La règle est inverse : bras <strong>opposé</strong> à la jambe, coudes à 90°, mains d'avant en arrière.</p>", verdicts: [[1, "rejetee", "Bras du même côté : le buste tourne ; il faut le bras opposé."]] },
        retenir: "Coudes à 90°, épaules relâchées, regard devant." },
      { t: "S'échauffer et récupérer", html: partie(BJ_OLD, 2),
        fil: { html: "<p>Les crampes viennent souvent de muscles froids sollicités brutalement. Un échauffement progressif (footing, montées de genoux, talons-fesses, rotations) prépare les muscles et le cœur. Coordination croisée, bonne posture, échauffement : les trois conseils de Christelle.</p>", verdicts: [[2, "validee", "Coordination croisée, posture et échauffement."]] },
        retenir: "Un corps échauffé se blesse moins." }
    ],
    denouement: {
      titre: "Les conseils du professeur",
      etapes: ["Les bras équilibrent et rythment (indice 1).", "Bras opposé à la jambe, coudes à 90° (indice 2).", "S'échauffer avant, récupérer après (indice 3)."],
      reponse: "<p>Les bras servent à courir : en avançant en même temps que la jambe opposée, ils compensent la rotation du bassin et gardent le buste face à la course ; ils donnent aussi le rythme, et pour accélérer on accélère d'abord les bras. Samuel, bras collés, se prive de cet équilibre ; Aboubakar, bras et jambe du même côté, fait tourner son corps à chaque pas et zigzague. La bonne technique est celle de Christelle : coordination croisée, coudes pliés à environ 90°, épaules relâchées, mains qui vont d'avant en arrière sans traverser devant la poitrine, regard loin devant, appuis sur l'avant du pied. Enfin, on s'échauffe avant de courir (footing, montées de genoux, talons-fesses) et on récupère après (marche, étirements doux, eau) pour éviter crampes et blessures.</p>",
      transfert: "<p>Observe un camarade sur 30 m : ses bras sont-ils croisés avec ses jambes ? Ses mains traversent-elles devant sa poitrine ? Donne-lui un conseil.</p>"
    },
    revision: (BJ_OLD ? BJ_OLD.revision : []).concat(["Bras du même côté que la jambe : le buste tourne, on zigzague."]),
    exo: BJ_OLD ? BJ_OLD.exo : "",
    quiz: [
      q("Quand la jambe droite avance, quel bras avance ?", "Le gauche", "Le droit", "Aucun", "Coordination croisée."),
      q("Angle conseillé des coudes :", "environ 90°", "bras tendus", "45°", "Les bras pliés donnent le rythme."),
      q("Pour accélérer, on peut…", "accélérer les bras", "regarder ses pieds", "serrer les épaules", "Les jambes suivent le rythme des bras."),
      q("Courir les bras collés au corps…", "freine la course", "fait gagner du temps", "est obligatoire", "On perd l'équilibre et le rythme."),
      q("Bras et jambe du même côté ensemble…", "font tourner le buste", "aident à aller droit", "sont conseillés", "Le corps zigzague."),
      q("Le regard du coureur se porte…", "loin devant", "sur ses pieds", "sur le côté", "Tête dans l'axe du corps."),
      q("Les mains doivent…", "aller d'avant en arrière", "traverser devant la poitrine", "rester sur les hanches", "Sans croiser devant le corps."),
      q("L'appui se fait sur…", "l'avant du pied", "le talon seulement", "le bord du pied", "Pour une foulée dynamique."),
      q("Avant l'effort, on…", "s'échauffe progressivement", "court tout de suite à fond", "s'étire longuement à froid", "Footing, montées de genoux, talons-fesses."),
      q("Après l'effort, on…", "marche, s'étire doucement et boit", "s'arrête net et s'assoit", "refait un sprint", "C'est la récupération.")
    ]
  });

  /* ═══════════════════════ 6e TECHNOLOGIE — LE MATÉRIEL DE DESSIN ═══════════════════════ */
  var MD_OLD = ancien("6e-tm-materiel-dessin");
  function table3D() {
    var o = [], k;
    o.push({ f: "boite", c: [0, -10, 0], d: [420, 14, 300], coul: "#8B5A2B", dessus: "#FBF8F2" });
    o.push({ f: "boite", c: [-10, 1, -70], d: [240, 3, 24], coul: "#E8D27A", dessus: "#F2E4A6", div: false });
    for (k = 0; k <= 20; k++) o.push({ f: "boite", c: [-128 + k * 11.8, 2.8, -78 + (k % 5 ? 3 : 0)], d: [0.8, 0.4, k % 5 ? 6 : 10], coul: "#2B2F36", div: false });
    o.push({ f: "boite", c: [95, 1.5, -35], d: [110, 3, 10], coul: "#7CC4C8", dessus: "#9ED8DB" });
    o.push({ f: "boite", c: [45, 1.5, 15], d: [10, 3, 100], coul: "#7CC4C8", dessus: "#9ED8DB" });
    for (k = 0; k <= 18; k++) { var tq = k / 18; o.push({ f: "boite", c: [146 - 101 * tq, 1.5, -36 + 101 * tq], d: [9, 3, 9], coul: "#7CC4C8", dessus: "#9ED8DB" }); }
    o.push({ f: "boite", c: [44, 2, -36], d: [6, 0.2, 6], coul: "#0A4F55", div: false });
    o.push({ f: "boite", c: [-120, 1.5, 40], d: [76, 3, 6], coul: "#9EC5E3", dessus: "#C9E3F5" });
    for (k = 0; k <= 16; k++) { var aq = Math.PI * k / 16; o.push({ f: "boite", c: [-120 + 36 * Math.cos(aq), 1.5, 40 + 36 * Math.sin(aq)], d: [7, 3, 7], coul: "#9EC5E3", dessus: "#C9E3F5" }); }
    chaine(o, [[-40, 44, 20], [-56, 2, 4]], 2, "#9AA3AF");
    chaine(o, [[-40, 44, 20], [-24, 2, 36]], 2, "#9AA3AF");
    o.push({ f: "cylindre", c: [-40, 44, 20], r: 3, h: 10, n: 10, coul: "#1F2328" });
    o.push({ f: "sphere", c: [-24, 3, 36], r: 2.4, coul: "#3A3F47" });
    [[-20, "#F7C948", "H"], [10, "#2E7D32", "HB"], [40, "#C62828", "4B"]].forEach(function (c, i) {
      o.push({ f: "cylindre", c: [90 + 0 * i, 4, 90 + i * 14 - 14], r: 4, h: 90, n: 6, axe: "x", coul: c[1] });
      o.push({ f: "cylindre", c: [180, 4, 90 + i * 14 - 14], r: 4, r2: 0.6, h: 14, n: 6, axe: "x", coul: "#D9B77A" });
    });
    o.push({ f: "boite", c: [150, 3, 30], d: [22, 6, 12], coul: "#E57373", dessus: "#F8BBD0" });
    return o;
  }
  var DURETE = [["4H", 0.18, 0.7, "très gris, très fin : traits de construction"], ["2H", 0.3, 0.9, "gris fin : construction"], ["HB", 0.55, 1.3, "moyen : écriture, traits courants"], ["2B", 0.75, 1.7, "foncé : traits définitifs"], ["4B", 0.9, 2.2, "très foncé et épais : ombres, croquis"]];
  remplacer("6e-tm-materiel-dessin", {
    c: "6e", m: "tm", titre: "Le matériel de dessin", duree: 30,
    accroche: "Pour dessiner le kiosque du lycée, Jordan prend un crayon 4B, appuie fort, trace le toit rond avec un couvercle et les angles « à l'œil ». Résultat : un plan sale et faux. Que faut-il changer ?",
    intro: "Le plan du kiosque à construire au lycée de Bafoussam te sert de fil rouge : à chaque partie, un indice t'aide à trancher entre trois idées sur le matériel de dessin.",
    objectifs: ["nommer les instruments de dessin et leur rôle", "choisir la dureté du crayon (H, HB, B)", "tracer cercles, angles droits et angles avec le bon instrument", "entretenir et ranger son matériel"],
    enquete: {
      titre: "Le plan raté du kiosque",
      svg: svg(640, 220, "Une feuille de plan aux traits épais et salis, un couvercle utilisé comme gabarit de cercle ; un élève perplexe", lin("mdC", ["#F4EDE1", "#E9DFCF"], true),
        "<rect width='640' height='220' fill='url(#mdC)'/><rect x='170' y='20' width='300' height='180' fill='#FBF8F2' stroke='#C9B28A'/><path d='M210 170H430M210 170V90L320 46L430 90V170' stroke='#2B2F36' stroke-width='5' fill='none' stroke-linejoin='round'/><path d='M216 168l-8 8M300 52l6 -10' stroke='#6E6A63' stroke-width='3'/><ellipse cx='320' cy='120' rx='34' ry='30' fill='none' stroke='#2B2F36' stroke-width='4'/><path d='M230 186q40 -10 80 4q30 8 70 -2' stroke='#9AA3AF' stroke-width='10' opacity='.35' fill='none'/>" +
        "<circle cx='520' cy='160' r='30' fill='#C9CED6' stroke='#8E96A6' stroke-width='4'/>" + txt(520, 204, "couvercle", { s: 10, c: GRIS }) + perso(90, 90, "#5A3A1E", "#7B3F99", "#2E3445") + "<path d='M108 110l40 -6' stroke='#C62828' stroke-width='5'/>" + bulle(20, 30, 170, "Un crayon, c'est un crayon !", "#F7C948") + bulle(470, 24, 160, "Angles « à l'œil »…", "#9FC5E8")),
      legende: "Au lycée de Bafoussam, chaque élève de 6e doit dessiner le plan du kiosque que l'atelier va construire.",
      contexte: "<p>Jordan a tracé ses traits de construction avec un crayon 4B en appuyant fort : impossible de les gommer, la feuille est grise. Il a dessiné le toit rond en suivant un couvercle et les angles droits « à l'œil » avec sa règle. Le professeur rend le plan : « Les angles ne sont pas droits, le cercle n'a pas le bon rayon, et on ne voit plus les traits définitifs. » Jordan répond : « Un crayon, c'est un crayon ; et une règle suffit pour tout. »</p>",
      documents: [{ t: "La consigne", html: "<p>« Plan du kiosque au 1/50 : murs perpendiculaires, toit circulaire de 4 cm de rayon, porte inclinée à 60°. Traits de construction légers, traits définitifs foncés. »</p>" }],
      question: "Quel matériel fallait-il utiliser, et comment ?",
      tache: "Pour chaque élément du plan, indique l'instrument et le crayon à utiliser, puis donne deux règles d'entretien.",
      hypotheses: ["Tous les crayons se valent : un 4B convient pour les traits de construction.", "Une règle suffit : on peut tracer cercles et angles droits à main levée.", "Chaque outil a son rôle : H léger pour construire, B pour repasser ; compas pour le cercle, équerre pour l'angle droit, rapporteur pour 60° ; et on entretient le matériel."]
    },
    parties: [
      { t: "Pour tracer", html: partie(MD_OLD, 0), illus: ill(MD_OLD, 0),
        planches: [{ type: "3d", titre: "La table à dessin", legende: "Tourne la planche à dessin : la règle graduée, l'équerre transparente (angle droit dans le coin), le rapporteur (demi-cercle gradué), le compas ouvert et trois crayons de dureté différente (H, HB, 4B), avec la gomme. Chaque instrument a son rôle.",
          modele: { h: 360, rx: -44, ry: 12, echelle: 0.9, alt: "Table à dessin avec une feuille, une règle, une équerre, un rapporteur, un compas, trois crayons et une gomme", objets: table3D(),
            etiquettes: [{ p: [-10, 2, -70], t: "règle graduée", cote: "g" }, { p: [44, 3, -36], t: "équerre : angle droit", cote: "d" }, { p: [-120, 2, 60], t: "rapporteur : angles", cote: "g" }, { p: [-40, 50, 20], t: "compas : cercles", cote: "g" }, { p: [130, 6, 76], t: "crayons H, HB, 4B", cote: "d" }, { p: [150, 7, 30], t: "gomme", cote: "d" }] } }],
        fil: { html: "<p>La règle trace des droites et mesure ; mais l'<strong>angle droit</strong> se trace avec l'<strong>équerre</strong>, le <strong>cercle</strong> de 4 cm de rayon avec le <strong>compas</strong> ouvert à 4 cm, et l'angle de 60° avec le <strong>rapporteur</strong>. Un couvercle ne donne pas le bon rayon, et l'œil se trompe de quelques degrés.</p>", verdicts: [[1, "rejetee", "Équerre, compas et rapporteur sont indispensables."]] },
        retenir: "Règle : droites ; équerre : angle droit ; compas : cercle ; rapporteur : angle." },
      { t: "Pour corriger et colorier", html: partie(MD_OLD, 1),
        fil: { html: "<p>Un crayon <strong>H</strong> (dur) laisse un trait fin et clair qui se gomme facilement : parfait pour les traits de construction. Un crayon <strong>B</strong> (tendre) laisse un trait foncé et épais, presque impossible à effacer : il sert à repasser les traits définitifs (simulation ci-dessus). Le 4B de Jordan était le pire choix pour construire.</p>", verdicts: [[0, "rejetee", "Construire au H, repasser au B : les crayons ne se valent pas."]] },
        retenir: "H = dur et clair ; B = tendre et foncé." },
      { t: "Entretenir son matériel", html: partie(MD_OLD, 2),
        fil: { html: "<p>Une mine bien taillée, une règle et une équerre propres, un compas rangé pointe protégée : un outil propre fait un dessin propre. Avec le bon instrument et le bon crayon, le plan du kiosque sera juste et net.</p>", verdicts: [[2, "validee", "Le bon outil et le bon crayon pour chaque trait ; matériel entretenu."]] },
        retenir: "Un outil propre fait un dessin propre." }
    ],
    denouement: {
      titre: "Le plan refait",
      etapes: ["Équerre, compas, rapporteur pour angles et cercles (indice 1).", "H pour construire, B pour repasser (indice 2).", "Mine taillée, outils propres, compas protégé (indice 3)."],
      reponse: "<p>Jordan doit choisir un outil pour chaque tâche. Les traits de construction se font au crayon H (dur), en appuyant peu : ils sont fins, clairs et se gomment facilement ; les traits définitifs sont ensuite repassés au crayon HB ou B (tendre, foncé). Les murs se tracent à la règle graduée, les angles droits avec l'équerre, le toit circulaire avec le compas ouvert à 4 cm (le rayon demandé), la porte inclinée à 60° avec le rapporteur. Le couvercle et le tracé « à l'œil » donnent des mesures fausses. Enfin, il garde une mine bien taillée, nettoie règle et équerre pour ne pas salir la feuille, et range son compas pointe protégée. Son nouveau plan sera juste et propre.</p>",
      transfert: "<p>Dresse la liste du matériel pour dessiner un carré de 6 cm, son cercle inscrit et une diagonale ; pour chaque trait, indique l'instrument et le crayon.</p>"
    },
    revision: (MD_OLD ? MD_OLD.revision : []).concat(["Construire au H (léger), repasser au B (foncé)."]),
    exo: MD_OLD ? MD_OLD.exo : "",
    quiz: [
      q("Pour tracer un cercle, on utilise…", "le compas", "l'équerre", "le rapporteur", "Le compas trace cercles et arcs."),
      q("Un crayon 4B donne un trait…", "foncé et tendre", "clair et dur", "coloré", "B = tendre, foncé."),
      q("Pour un angle droit, on utilise…", "l'équerre", "la gomme", "le calque", "Elle a un angle de 90°."),
      q("Pour mesurer un angle de 60°, on utilise…", "le rapporteur", "le compas", "la règle seule", "Un demi-cercle gradué en degrés."),
      q("Les traits de construction se font…", "au crayon H, en appuyant peu", "au 4B, en appuyant fort", "au feutre", "Fins, clairs, faciles à gommer."),
      q("Un crayon H est…", "dur", "tendre", "en couleur", "H pour hard : dur."),
      q("Pour un cercle de 4 cm de rayon, on ouvre le compas de…", "4 cm", "8 cm", "2 cm", "L'écartement = le rayon."),
      q("Pourquoi nettoyer la règle ?", "La mine salit la feuille", "Pour qu'elle brille", "Pour la rendre plus longue", "Un outil propre fait un dessin propre."),
      q("On range le compas…", "pointe protégée", "pointe en l'air dans la trousse", "ouvert au maximum", "C'est un outil piquant."),
      q("La règle graduée sert à…", "tracer des droites et mesurer", "tracer des cercles", "mesurer des angles", "Graduée en centimètres et millimètres.")
    ]
  });

  /* ═══════════════════════ 6e TECHNOLOGIE — LE SITE D'UNE PÉPINIÈRE ═══════════════════════ */
  var SP_OLD = ancien("6e-tm-site-pepiniere");
  var CRIT = ["eau", "sol", "relief", "lumière", "accès", "protection"];
  var TERRAINS = [["Terrain A : sous le grand fromager, près du bas-fond", [2, 0, 1, 0, 1, 1]], ["Terrain B : à côté du forage, plat et dégagé", [2, 2, 2, 2, 2, 1]]];
  function pepiniere3D() {
    var o = [], k, j, R = alea(41);
    o.push({ f: "boite", c: [0, -8, 0], d: [520, 8, 360], coul: "#6B4A2B", dessus: "#8C6A44" });
    [[-140, -90], [140, -90], [-140, 90], [140, 90], [0, -90], [0, 90]].forEach(function (p) { o.push({ f: "cylindre", c: [p[0], 0, p[1]], r: 4, h: 110, n: 8, coul: "#6B4423" }); });
    for (k = 0; k < 14; k++) o.push({ f: "boite", c: [-140 + k * 21.5, 112, 0], d: [12, 3, 200], coul: "#8B7A4A", dessus: "#A6935C", div: false });
    for (k = 0; k < 8; k++) for (j = 0; j < 6; j++) { var x = -120 + k * 34, z = -70 + j * 28; o.push({ f: "cylindre", c: [x, 0, z], r: 6, h: 12, n: 8, coul: "#1F2328" }); o.push({ f: "cylindre", c: [x, 12, z], r: 1, h: 10, n: 5, coul: "#4E7D2A" }); o.push({ f: "sphere", c: [x + (R() - 0.5) * 2, 25, z], r: 6 + R() * 2, coul: j % 2 ? "#3E8E3A" : "#5AA14A" }); }
    for (k = 0; k <= 12; k++) { o.push({ f: "cylindre", c: [-200 + k * 33.3, 0, -160], r: 2.5, h: 40, n: 6, coul: "#8B5A2B" }); o.push({ f: "cylindre", c: [-200 + k * 33.3, 0, 160], r: 2.5, h: 40, n: 6, coul: "#8B5A2B" }); }
    for (k = 0; k <= 9; k++) { o.push({ f: "cylindre", c: [-200, 0, -160 + k * 35.5], r: 2.5, h: 40, n: 6, coul: "#8B5A2B" }); o.push({ f: "cylindre", c: [200, 0, -160 + k * 35.5], r: 2.5, h: 40, n: 6, coul: "#8B5A2B" }); }
    [14, 30].forEach(function (y) { o.push({ f: "boite", c: [0, y, -160], d: [400, 1, 1], coul: "#9AA3AF", div: false }); o.push({ f: "boite", c: [0, y, 160], d: [400, 1, 1], coul: "#9AA3AF", div: false }); o.push({ f: "boite", c: [-200, y, 0], d: [1, 1, 320], coul: "#9AA3AF", div: false }); o.push({ f: "boite", c: [200, y, 0], d: [1, 1, 320], coul: "#9AA3AF", div: false }); });
    o.push({ f: "cylindre", c: [230, 0, -100], r: 8, h: 40, n: 12, coul: "#5C6478" });
    o.push({ f: "boite", c: [240, 40, -100], d: [30, 4, 4], coul: "#3A3F47" });
    o.push({ f: "cylindre", c: [220, 26, -100], r: 2, h: 10, n: 6, axe: "x", coul: "#3A3F47" });
    o.push({ f: "cylindre", c: [235, -2, -70], r: 14, h: 18, n: 12, coul: "#2F6DB5", dessus: "#4A90C2" });
    o.push({ f: "boite", c: [0, -3.5, -210], d: [520, 1, 40], coul: "#B88A5A", dessus: "#C9A06E", div: false });
    return o;
  }
  remplacer("6e-tm-site-pepiniere", {
    c: "6e", m: "tm", titre: "Choisir le site d'une pépinière", duree: 30,
    accroche: "Le club agricole veut une pépinière de cacaoyers : « Sous le grand fromager, l'ombre est gratuite ! » « Non, près du forage ! » « Ou à côté de la classe, c'est plus pratique. » Comment décider ?",
    intro: "Le projet de pépinière du club agricole d'un lycée de Mbalmayo te sert de fil rouge : à chaque partie, un indice t'aide à trancher entre trois avis.",
    objectifs: ["définir une pépinière et son rôle", "énumérer les six critères de choix du site", "repérer les pièges (zone inondable, grand arbre)", "justifier un choix avec une grille notée"],
    enquete: {
      titre: "Où installer la pépinière du club agricole ?",
      svg: svg(640, 220, "Deux terrains : l’un sous un immense arbre près d’un bas-fond humide, l’autre plat et ensoleillé près d’un forage", lin("spC", ["#CFE3F2", "#F4F1EA"], true),
        "<rect width='640' height='220' fill='url(#spC)'/><rect y='140' width='640' height='80' fill='#6E9B45'/><path d='M0 170Q120 150 240 175V220H0Z' fill='#5B8FB0' opacity='.7'/>" +
        "<path d='M130 140V60' stroke='#8C8577' stroke-width='22'/><path d='M130 140l-30 10M130 140l30 10' stroke='#8C8577' stroke-width='10'/><ellipse cx='130' cy='50' rx='110' ry='40' fill='#2E6B2A'/><ellipse cx='70' cy='60' rx='50' ry='26' fill='#3E7D32'/>" + txt(130, 210, "Terrain A", { s: 12, c: "#fff" }) +
        "<path d='M330 140h220' stroke='#C9A06E' stroke-width='4'/><rect x='520' y='96' width='14' height='44' fill='#5C6478'/><path d='M534 102h20' stroke='#3A3F47' stroke-width='4'/><circle cx='580' cy='40' r='16' fill='#F7C948'/>" + txt(440, 210, "Terrain B", { s: 12, c: "#fff" }) +
        perso(300, 70, "#5A3A1E", "#2E7D32", "#2E3445") + perso(400, 70, "#6B4423", "#E8A33D", "#2E3445") + bulle(200, 14, 180, "L'ombre est gratuite !", "#F7C948") + bulle(400, 14, 170, "Près du forage !", "#9FC5E8")),
      legende: "À Mbalmayo, le club agricole du lycée veut produire 300 plants de cacaoyers pour les familles des élèves.",
      contexte: "<p>Deux terrains sont possibles. Le terrain A est sous un immense fromager, au bord d'un bas-fond où l'eau stagne en saison des pluies. Le terrain B est plat, en plein soleil, à 20 m du forage et au bord de la piste ; il faudra le clôturer et y construire une ombrière. Paul préfère A : « L'ombre et l'humidité sont gratuites. » Rose propose de choisir le terrain le plus proche de la salle de classe, « parce que c'est plus pratique ».</p>",
      documents: [{ t: "Les observations du club", html: "<table class='donnees'><tr><th>Critère</th><th>Terrain A</th><th>Terrain B</th></tr><tr><td>Eau</td><td>bas-fond tout proche</td><td>forage à 20 m</td></tr><tr><td>Sol</td><td>gorgé d'eau en saison des pluies</td><td>meuble, bien drainé</td></tr><tr><td>Relief</td><td>cuvette</td><td>plat</td></tr><tr><td>Lumière</td><td>ombre épaisse toute la journée</td><td>plein soleil (ombrière à prévoir)</td></tr><tr><td>Accès</td><td>sentier boueux</td><td>bord de piste</td></tr><tr><td>Protection</td><td>racines et branches mortes</td><td>chèvres du quartier (clôture à prévoir)</td></tr></table>" }],
      question: "Quel terrain choisir, et comment justifier ce choix ?",
      tache: "Compare les deux terrains avec une grille de six critères notés de 0 à 2 et justifie le choix du club.",
      hypotheses: ["Le terrain sous le grand arbre est idéal : ombre et humidité gratuites.", "On choisit le terrain le plus proche de la salle de classe, c'est plus pratique.", "On note les six critères (eau, sol, relief, lumière, accès, protection) et on retient le meilleur total : le terrain B, avec ombrière et clôture."]
    },
    parties: [
      { t: "Qu'est-ce qu'une pépinière ?", html: partie(SP_OLD, 0),
        planches: [{ type: "3d", titre: "Une pépinière bien installée", legende: "Tourne la pépinière : des rangées de sachets noirs portant chacun un jeune cacaoyer, sous une ombrière de palmes qui filtre le soleil ; un forage à pompe et un fût pour l'arrosage ; une clôture de piquets et de fil contre les chèvres ; la piste pour sortir les plants.",
          modele: { h: 380, rx: -36, ry: 24, echelle: 0.78, alt: "Pépinière : sachets noirs avec jeunes plants sous une ombrière de palmes, clôture, forage et fût d’eau", objets: pepiniere3D(),
            etiquettes: [{ p: [0, 114, 0], t: "ombrière (palmes)", cote: "g" }, { p: [-120, 26, -70], t: "jeunes plants en sachets", cote: "g" }, { p: [230, 40, -100], t: "forage (eau)", cote: "d" }, { p: [200, 30, 60], t: "clôture", cote: "d" }, { p: [0, -3, -210], t: "piste (accès)", cote: "d" }] } }],
        fil: { html: "<p>Une pépinière est le <strong>berceau</strong> des jeunes plants : ils y germent et grandissent, protégés, avant d'être plantés au champ. Pendant plusieurs mois, il faut donc les arroser chaque jour, leur donner une lumière douce et les protéger des animaux.</p>", verdicts: [] },
        retenir: "Pépinière = berceau des jeunes plants." },
      { t: "Les critères du bon site", html: partie(SP_OLD, 1), illus: ill(SP_OLD, 1),
        fil: { html: "<p>Le terrain A cumule les pièges : le bas-fond est <strong>inondable</strong> (les racines pourrissent dans l'eau stagnante), l'ombre du fromager est trop épaisse et permanente, ses racines prennent l'eau et l'engrais, ses branches mortes peuvent tomber et ses feuilles porter des maladies. L'ombre et l'humidité « gratuites » coûtent en réalité les plants.</p>", verdicts: [[0, "rejetee", "Bas-fond inondable, ombre trop épaisse, racines et branches : terrain à éviter."]] },
        retenir: "Eau ; sol ; relief ; lumière ; accès ; protection." },
      { t: "Sur le terrain", html: partie(SP_OLD, 2),
        fil: { html: "<p>La proximité de la classe n'est pas un critère : ce qui compte, ce sont l'eau, le sol, le relief, la lumière, l'accès et la protection. Avec la grille (simulation ci-dessus), le terrain A obtient 5 sur 12 et le terrain B 11 sur 12 : on choisit B, en y ajoutant une ombrière et une clôture.</p>", verdicts: [[1, "rejetee", "« Plus pratique » n'est pas un critère : on note les six critères."], [2, "validee", "Grille notée : terrain B (11/12), avec ombrière et clôture."]] },
        retenir: "Un choix se justifie par des critères notés." }
    ],
    denouement: {
      titre: "Le choix du club agricole",
      etapes: ["Pépinière : berceau des plants, à arroser et protéger (indice 1).", "Terrain A : inondable, trop ombragé, sous un grand arbre (indice 2).", "Grille : A = 5/12, B = 11/12 (indice 3)."],
      reponse: "<p>Une pépinière doit offrir aux jeunes cacaoyers de l'eau toute l'année, un sol meuble et bien drainé, un terrain plat, une lumière filtrée, un accès facile et une protection contre les animaux. Le terrain A semble pratique, mais il est en bas-fond inondable (les racines pourriraient), sous une ombre trop épaisse, et le grand fromager vole l'eau, laisse tomber des branches et peut transmettre des maladies. Choisir le terrain le plus proche de la classe n'est pas un critère. Avec une grille notée de 0 à 2 sur les six critères, le terrain A obtient 5 sur 12 et le terrain B 11 sur 12 : le club retient le terrain B, près du forage et de la piste, en construisant une ombrière de palmes et une clôture contre les chèvres.</p>",
      transfert: "<p>Repère deux terrains autour de ton établissement, remplis la grille des six critères et présente ton choix à la classe.</p>"
    },
    revision: (SP_OLD ? SP_OLD.revision : []).concat(["Éviter le pied d'un grand arbre : racines, branches, maladies."]),
    exo: SP_OLD ? SP_OLD.exo : "",
    quiz: [
      q("Le critère le plus important pour arroser :", "un point d'eau proche", "un grand arbre", "une route goudronnée", "Les jeunes plants ont besoin d'arrosage régulier."),
      q("Une zone inondable est…", "à éviter", "idéale", "obligatoire", "Les racines pourrissent dans l'eau stagnante."),
      q("Pourquoi une clôture ?", "Pour protéger des animaux", "Pour décorer", "Pour faire de l'ombre", "Les chèvres adorent les jeunes plants !"),
      q("Une pépinière est…", "un lieu où l'on fait grandir de jeunes plants", "un champ de cacao adulte", "un marché aux fleurs", "Le berceau des plants."),
      q("Le relief idéal est…", "plat ou en légère pente", "une cuvette", "une forte pente", "Pas d'eau stagnante, pas d'érosion."),
      q("Une ombrière sert à…", "filtrer le soleil", "arroser", "clôturer", "Lumière douce pour les jeunes plants."),
      q("Le sol doit être…", "meuble, fertile et bien drainé", "dur et compact", "toujours gorgé d'eau", "Les racines respirent."),
      q("Pourquoi éviter le pied d'un grand arbre ?", "ses racines prennent l'eau et ses branches peuvent tomber", "il fait trop chaud", "il attire le soleil", "Et ses feuilles portent des maladies."),
      q("Pour justifier un choix de site, on…", "note chaque critère et on compare les totaux", "tire au sort", "prend le plus proche de la classe", "Une grille notée."),
      q("Combien de critères dans la grille ?", "six", "trois", "dix", "Eau, sol, relief, lumière, accès, protection.")
    ]
  });

  /* ═══════════════════════ SIMULATIONS ═══════════════════════ */
  VRT_A("6e-eps-bras-jambes", 1, "Change la façon de bouger les bras et observe le buste", function (el) {
    var mode = 2, t0 = null;
    el.innerHTML = "<div style='display:flex;gap:6px;flex-wrap:wrap'><button type='button' class='btn-l' data-m='0'>Bras collés</button><button type='button' class='btn-l' data-m='1'>Bras du même côté</button><button type='button' class='btn-l' data-m='2'>Bras croisés (opposés)</button></div><div data-g style='margin:8px 0'></div><p class='labo-r' data-r></p>";
    var TXT = ["Bras collés : rien ne compense la rotation du bassin, le buste tourne et le rythme manque.", "Bras du même côté : épaules et bassin tournent dans le même sens, le buste se tord fort : on zigzague.", "Bras opposés : les épaules tournent à l'inverse du bassin, le buste reste face à la course : équilibre et rythme."];
    function dessin(t) {
      var p = Math.sin(t * 5), jA = 26 * p, bA = mode === 2 ? -26 * p : mode === 1 ? 26 * p : 0, tors = mode === 2 ? 3 : mode === 1 ? 22 : 12, s = "<rect width='480' height='200' fill='#FBF8F2'/><rect y='176' width='480' height='24' fill='#B5442C'/>";
      function seg(x, y, a, L) { return [x + L * Math.sin(a * Math.PI / 180), y + L * Math.cos(a * Math.PI / 180)]; }
      var H = [140, 100], S = [140, 50], k1 = seg(H[0], H[1], jA, 38), f1 = seg(k1[0], k1[1], jA - 20, 36), k2 = seg(H[0], H[1], -jA, 38), f2 = seg(k2[0], k2[1], -jA - 20, 36), e1 = seg(S[0], S[1], bA, 24), h1 = seg(e1[0], e1[1], bA + 80, 22), e2 = seg(S[0], S[1], -bA, 24), h2 = seg(e2[0], e2[1], -bA + 80, 22);
      s += "<path d='M" + H + "L" + k2 + "L" + f2 + "' stroke='#2F6DB5' stroke-width='8' fill='none' stroke-linecap='round'/><path d='M" + S + "L" + e2 + "L" + h2 + "' stroke='#E8A33D' stroke-width='6' fill='none' stroke-linecap='round'/>";
      s += "<path d='M" + S + "L" + H + "' stroke='#F4F1EA' stroke-width='16' stroke-linecap='round'/><circle cx='145' cy='30' r='13' fill='#6B4423'/>";
      s += "<path d='M" + H + "L" + k1 + "L" + f1 + "' stroke='#E8A33D' stroke-width='8' fill='none' stroke-linecap='round'/><path d='M" + S + "L" + e1 + "L" + h1 + "' stroke='#2F6DB5' stroke-width='6' fill='none' stroke-linecap='round'/>";
      var rot = tors * p, w = 70;
      s += txt(370, 22, "Vue de dessus : épaules et bassin", { s: 11, c: GRIS }) + "<g transform='translate(370 100)'><ellipse rx='" + w + "' ry='14' fill='#DCE6F2' stroke='#1E499B' transform='rotate(" + (mode === 2 ? -jA * 0.5 : mode === 1 ? jA * 0.5 : 0) + ")'/><ellipse rx='" + (w - 14) + "' ry='12' fill='#F4E7C8' stroke='#B8860B' transform='rotate(" + (jA * 0.5) + ")'/></g>" + txt(370, 150, "torsion du buste", { s: 11, c: GRIS }) + "<rect x='310' y='158' width='120' height='10' rx='5' fill='#E3E7EF'/><rect x='310' y='158' width='" + (Math.abs(rot) / 22 * 120).toFixed(1) + "' height='10' rx='5' fill='" + (tors > 15 ? ROUGE : tors > 5 ? "#E8A33D" : VERT) + "'/>";
      el.querySelector("[data-g]").innerHTML = "<svg viewBox='0 0 480 200' style='max-width:540px;width:100%' role='img' aria-label='Coureur animé et torsion du buste vue de dessus'>" + s + "</svg>";
    }
    function boucle(ts) { if (!el.isConnected) return; if (t0 === null) t0 = ts; dessin((ts - t0) / 1000); requestAnimationFrame(boucle); }
    el.querySelectorAll("[data-m]").forEach(function (b) { b.addEventListener("click", function () { mode = +b.dataset.m; el.querySelector("[data-r]").textContent = TXT[mode]; }); });
    el.querySelector("[data-r]").textContent = TXT[mode]; dessin(0.15); requestAnimationFrame(boucle);
  });
  VRT_A("6e-tm-materiel-dessin", 1, "Choisis la dureté du crayon, trace, puis gomme", function (el) {
    var d = 0, gomme = false;
    el.innerHTML = "<label class='labo-c'><span>Crayon : <b data-dv>4H</b></span><input type='range' min='0' max='4' value='0' data-d style='width:220px'></label><button type='button' class='btn-l' data-g style='margin-left:10px'>🧽 Gommer</button><div data-s style='margin:8px 0'></div><p class='labo-r' data-r></p>";
    function maj() {
      var c = DURETE[d], restant = gomme ? c[1] * c[1] * 0.9 : c[1], s = "<rect width='480' height='130' fill='#FBF8F2' stroke='#E3D7A6'/>", k;
      for (k = 0; k < 4; k++) s += "<path d='M30 " + (30 + k * 24) + "Q240 " + (20 + k * 24) + " 450 " + (30 + k * 24) + "' stroke='#1F2328' stroke-opacity='" + restant.toFixed(2) + "' stroke-width='" + c[2] + "' fill='none'/>";
      if (gomme) s += "<rect x='300' y='96' width='60' height='24' rx='4' fill='#F8BBD0' stroke='#E57373'/>";
      el.querySelector("[data-dv]").textContent = c[0];
      el.querySelector("[data-s]").innerHTML = "<svg viewBox='0 0 480 130' style='max-width:540px;width:100%' role='img' aria-label='Traits de crayon plus ou moins foncés'>" + s + "</svg>";
      el.querySelector("[data-r]").innerHTML = "<b>" + c[0] + "</b> : " + c[3] + (gomme ? " · après gommage : " + (restant < 0.1 ? "<b style='color:" + VERT + "'>effacé</b>" : restant < 0.35 ? "presque effacé" : "<b style='color:" + ROUGE + "'>trace encore bien visible</b>") : "");
    }
    el.querySelector("[data-d]").addEventListener("input", function (e) { d = +e.target.value; gomme = false; maj(); });
    el.querySelector("[data-g]").addEventListener("click", function () { gomme = true; maj(); });
    maj();
  });
  VRT_A("6e-tm-materiel-dessin", 2, "Quel instrument pour chaque trait du plan ?", function (el) {
    exercice(el, [["Tracer les murs perpendiculaires : ___", ["l'équerre", "le compas", "le rapporteur"], "L'angle droit de l'équerre."], ["Tracer le toit circulaire de 4 cm de rayon : ___", ["le compas", "l'équerre", "un couvercle"], "Compas ouvert à 4 cm."], ["Tracer la porte inclinée à 60° : ___", ["le rapporteur", "la règle seule", "l'équerre"], "Le rapporteur mesure les angles."], ["Tracer une droite de 12 cm : ___", ["la règle graduée", "le compas", "le rapporteur"], "La règle trace et mesure."], ["Faire les traits de construction : ___", ["un crayon H", "un crayon 4B", "un feutre"], "Fins, clairs, faciles à gommer."], ["Repasser les traits définitifs : ___", ["un crayon B", "un crayon 4H", "la gomme"], "Trait foncé et net."]], "Trait suivant", "Trait");
  });
  VRT_A("6e-tm-site-pepiniere", 2, "Note les deux terrains avec la grille", function (el) {
    var N = TERRAINS.map(function (t) { return t[1].slice(); });
    el.innerHTML = "<div data-t style='overflow-x:auto'></div><p class='labo-r' data-r></p>";
    function maj() {
      var h = "<table class='donnees' style='min-width:420px'><tr><th>Critère</th>" + TERRAINS.map(function (t) { return "<th>" + t[0].split(" :")[0] + "</th>"; }).join("") + "</tr>";
      CRIT.forEach(function (c, i) { h += "<tr><td>" + c + "</td>" + N.map(function (n, j) { return "<td>" + [0, 1, 2].map(function (v) { return "<button type='button' class='btn-l' data-j='" + j + "' data-i='" + i + "' data-v='" + v + "' style='padding:2px 9px;margin:1px;" + (n[i] === v ? "background:#1E499B;color:#fff" : "") + "'>" + v + "</button>"; }).join("") + "</td>"; }).join("") + "</tr>"; });
      var T = N.map(function (n) { return n.reduce(function (a, b) { return a + b; }, 0); });
      h += "<tr><th>Total / 12</th>" + T.map(function (t, j) { return "<th style='color:" + (t === Math.max.apply(null, T) ? VERT : ROUGE) + "'>" + t + "</th>"; }).join("") + "</tr></table>";
      el.querySelector("[data-t]").innerHTML = h;
      el.querySelectorAll("[data-v]").forEach(function (b) { b.addEventListener("click", function () { N[+b.dataset.j][+b.dataset.i] = +b.dataset.v; maj(); }); });
      el.querySelector("[data-r]").innerHTML = T[0] === T[1] ? "Égalité : regarde le critère le plus important, l'eau, puis le sol." : "Terrain retenu : <b>" + TERRAINS[T[0] > T[1] ? 0 : 1][0] + "</b> (" + Math.max(T[0], T[1]) + " / 12). Les notes de départ viennent des observations du club ; modifie-les si tu observes autre chose.";
    }
    maj();
  });
})();
