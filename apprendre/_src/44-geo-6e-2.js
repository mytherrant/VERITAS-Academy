/* Leçons GRATUITES — Géographie de 6e, lot 2 (25/11/2026) : rangs 4 (la Terre en mouvement), 5 (TP 2 : le calcul
   de l'heure), 6 (TP 3 : les formes de représentation de la Terre). Même gabarit que le lot 1 (43-geo-6e.js). */
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
  function q(qq, bonne, f1, f2, e) { return { q: qq, r: [bonne, f1, f2], b: 0, e: e }; }
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
  function def(t, h) { return "<div class='def'><b>" + t + "</b>" + h + "</div>"; }
  function formule(h) { return "<p class='formule'>" + h + "</p>"; }
  function ex(h, t) { return "<div class='ex'><b>" + (t || "Exemple") + "</b>" + h + "</div>"; }
  function astuce(h, t) { return "<div class='astuce'><b>" + (t || "Astuce") + "</b>" + h + "</div>"; }
  function attention(h, t) { return "<div class='attention'><b>" + (t || "Attention") + "</b>" + h + "</div>"; }
  function savais(h) { return "<div class='savais'><b>Le savais-tu ?</b>" + h + "</div>"; }
  function F(nom, f, calcul) { return { nom: nom, f: f, calcul: calcul }; }
  function colonnes(titre, cols, h, alt) {
    var W = 640, n = cols.length, w = (W - 30 - (n - 1) * 12) / n, s = "<rect width='640' height='" + h + "' fill='#FBF8F2'/>" + txt(320, 28, titre, { s: 15 });
    cols.forEach(function (c, i) {
      var x = 15 + i * (w + 12);
      s += "<rect x='" + x + "' y='44' width='" + w + "' height='" + (h - 58) + "' rx='12' fill='#fff' stroke='" + c.c + "' stroke-width='2'/><rect x='" + x + "' y='44' width='" + w + "' height='34' rx='11' fill='" + c.c + "'/>" + txt(x + w / 2, 66, c.t, { s: 13.5, c: "#fff" });
      c.l.forEach(function (l, k) { s += txt(x + 10, 100 + k * 23, l, { s: 11.5, a: "start", w: l.charAt(0) === "→" ? 800 : 550, c: l.charAt(0) === "→" ? c.c : NUIT }); });
    });
    return svg(640, h, alt || titre, "", s);
  }
  function P2(titre, legende, s) { return { type: "2D", titre: titre, legende: legende, svg: s }; }
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
  function apc(situation, tache) { return { module: "Géographie de 6e", famille: "Vie sociale et culturelle", agir: "Se situer dans l'espace et comprendre son milieu pour mieux l'habiter et le protéger", situation: situation, tache: tache }; }
  function integ(qc, opts, bonne, rep, exo, exoRep, sit, tache, attendu) {
    return "<div class='integ'><h3>Partie A : évaluation des ressources</h3><p><strong>Question de cours.</strong> " + qc + "</p><ol type='a'>" + opts.map(function (o) { return "<li>" + o + "</li>"; }).join("") + "</ol><details><summary>Voir la réponse</summary><p><strong>" + bonne + "</strong>. " + rep + "</p></details>" +
      "<p><strong>Exercice.</strong> " + exo + "</p><details><summary>Voir la réponse</summary><p>" + exoRep + "</p></details>" +
      "<h3>Partie B : évaluation des compétences</h3><p><strong>Situation.</strong> " + sit + "</p><p><strong>Tâche.</strong> " + tache + "</p><details><summary>Voir une réponse attendue</summary><p>" + attendu + "</p></details></div>";
  }
  function frise(titre, pts, h, alt) {
    var s = "<rect width='640' height='" + h + "' fill='#FBF8F2'/>" + txt(320, 28, titre, { s: 15 }) + "<line x1='30' y1='" + (h / 2 + 6) + "' x2='610' y2='" + (h / 2 + 6) + "' stroke='#1E499B' stroke-width='4' stroke-linecap='round'/>";
    var n = pts.length, pas = 580 / (n - 1);
    pts.forEach(function (p, i) {
      var x = 30 + i * pas, haut = i % 2 === 0, y0 = h / 2 + 6;
      s += "<circle cx='" + x + "' cy='" + y0 + "' r='8' fill='" + (p.c || "#C2540A") + "' stroke='#fff' stroke-width='3'/>" + txt(x, haut ? y0 - 20 : y0 + 30, p.a, { s: 12.5, c: p.c || "#C2540A" });
      (p.l || []).forEach(function (l, k) { s += txt(x, haut ? y0 - 38 - k * 15 : y0 + 48 + k * 15, l, { s: 10.5, w: 550 }); });
    });
    return svg(640, h, alt || titre, "", s);
  }

  /* ═══════════════ RANG 4 : LA TERRE, UNE PLANÈTE EN MOUVEMENT ═══════════════ */
  function orbite3D() {
    var o = [{ f: "sphere", c: [0, 0, 0], r: 46, coul: "#F7C948" }], k, a, R = 190;
    for (k = 0; k < 28; k++) {
      a = k * 2 * Math.PI / 28;
      o.push({ f: "sphere", c: [Math.round(R * Math.cos(a)), 0, Math.round(R * Math.sin(a))], r: 3, coul: "#9AA3AF" });
    }
    [[-R, 0], [R, 0]].forEach(function (p) {
      o.push({ f: "sphere", c: [p[0], 0, p[1]], r: 24, coul: "#2E86AB" });
      for (k = -4; k <= 4; k++) {
        if (k === 0) continue;
        o.push({ f: "sphere", c: [p[0] + Math.round(k * 9 * Math.sin(0.41)), Math.round(k * 9 * Math.cos(0.41)), p[1]], r: 2.6, coul: ROUGE });
      }
    });
    return o;
  }
  VRT_L("6e-geo-terre-mouvement", {
    c: "6e", m: "geo", cle: "La terre, une planète en mouvement dans l’espace", titre: "La Terre, une planète en mouvement : rotation et révolution", duree: 30,
    accroche: "À Bafoussam, Ngoufo voit chaque matin le Soleil se lever à l'est et, le soir, se coucher derrière les monts Bamboutos, à l'ouest. Sa petite sœur demande, elle, pourquoi certaines années ont un 29 février. Qu'est-ce qui fait « bouger » le Soleil et le calendrier ?",
    intro: "Les questions de deux enfants de Bafoussam te servent de fil rouge : à chaque partie, un indice t'aide à trancher entre trois idées sur les mouvements de la Terre.",
    objectifs: ["décrire le mouvement de rotation de la Terre et ses conséquences", "décrire le mouvement de révolution et ses conséquences", "expliquer l'année bissextile", "calculer des vitesses et des durées liées aux mouvements de la Terre"],
    enquete: {
      titre: "Le Soleil tourne-t-il autour de nous ?",
      svg: svg(640, 220, "Village des hauts plateaux de l'Ouest au lever du soleil ; un garçon montre le soleil, une fille tient un calendrier", lin("gmC", ["#FDE3B5", "#E8F0E0"], true),
        "<rect width='640' height='220' fill='url(#gmC)'/><circle cx='560' cy='118' r='30' fill='#F7C948'/><path d='M0 150 Q120 96 240 140 Q360 108 480 146 Q560 128 640 140 V220 H0Z' fill='#7FA347'/><rect y='176' width='640' height='44' fill='#B5834E'/>" +
        "<rect x='60' y='120' width='70' height='56' fill='#C9A27A'/><path d='M50 124l45 -34l45 34Z' fill='#6B6B6B'/>" + perso(260, 92, "#5A3A1E", "#17784D", "#2E3445") + perso(340, 102, "#6B4423", "#7B3F99", "#2E3445") +
        "<rect x='352' y='126' width='30' height='26' fill='#fff' stroke='#9AA3AF'/>" + txt(367, 144, "29", { s: 12, c: ROUGE }) +
        bulle(150, 18, 240, "Le Soleil tourne autour de nous !", "#F7C948") + bulle(360, 52, 250, "Pourquoi un 29 février ?", "#9FC5E8")),
      legende: "Sur les hauts plateaux de l'Ouest, Ngoufo regarde le Soleil se lever ; sa sœur Mafo tient le calendrier ouvert au 29 février.",
      contexte: "<p>Ngoufo pense que « c'est le Soleil qui tourne autour de la Terre en une journée, puisqu'on le voit bouger dans le ciel ». Mafo, elle, croit que « la Terre ne bouge pas : le jour et la nuit viennent du Soleil qui s'allume et s'éteint ». Leur grand frère, élève de 6e, veut leur expliquer, chiffres à l'appui, que c'est la Terre qui bouge.</p>",
      documents: [{ t: "Deux mouvements", html: "<p>La Terre tourne sur elle-même autour d'un axe incliné qui passe par les pôles, en 24 heures environ. En même temps, elle tourne autour du Soleil en 365 jours et 6 heures environ.</p>" },
        { t: "Quelques chiffres", html: "<p>Circonférence de la Terre à l'équateur : environ 40 000 km. Distance moyenne Terre-Soleil : environ 150 millions de km. Inclinaison de l'axe : environ 23° 27′.</p>" }],
      question: "Quels sont les mouvements de la Terre et quelles sont leurs conséquences ?",
      tache: "Décris la rotation et la révolution de la Terre, explique le jour et la nuit, l'année et le 29 février, puis calcule les vitesses de la Terre.",
      hypotheses: ["C'est le Soleil qui tourne autour de la Terre en une journée.", "La Terre est immobile : le Soleil s'allume le jour et s'éteint la nuit.", "La Terre tourne sur elle-même en 24 heures (jour et nuit) et autour du Soleil en 365 jours et 6 heures (l'année)."]
    },
    parties: [
      { t: "La rotation : le jour et la nuit", html: def("Rotation", "Mouvement de la Terre qui tourne sur elle-même, d'ouest en est, autour d'un axe imaginaire passant par les pôles. Un tour complet dure environ 24 heures.") +
          "<ul><li>À chaque instant, la moitié de la Terre tournée vers le Soleil est éclairée : c'est le <strong>jour</strong> ; l'autre moitié est dans l'ombre : c'est la <strong>nuit</strong>.</li><li>Comme la Terre tourne d'ouest en est, le Soleil <strong>semble</strong> se lever à l'est et se coucher à l'ouest : c'est un mouvement apparent.</li><li>La rotation explique aussi les <strong>différences d'heure</strong> entre les pays.</li></ul>" +
          formule("vitesse à l'équateur = circonférence ÷ durée = 40 000 km ÷ 24 h ≈ 1 670 km/h") +
          ex("Un point de l'équateur parcourt environ 1 670 km chaque heure, soit environ 7 fois la distance Douala-Yaoundé par la route (environ 240 km : 1 670 ÷ 240 ≈ 7). Nous ne le sentons pas, car tout tourne avec nous : l'air, les maisons, les arbres.", "La Terre tourne vite") +
          attention("Le Soleil ne « se lève » pas vraiment : c'est la Terre qui tourne. On dit qu'il s'agit d'un mouvement apparent du Soleil."),
        planches: [P2("Jour et nuit sur la Terre", "La moitié de la Terre tournée vers le Soleil est éclairée ; en tournant d'ouest en est, chaque lieu passe du jour à la nuit.",
          svg(640, 230, "Le Soleil à gauche éclaire la moitié gauche de la Terre ; la moitié droite est sombre ; une flèche montre la rotation d'ouest en est", "", "<rect width='640' height='230' fill='#0E1A3A'/>" + txt(320, 26, "Le jour et la nuit", { s: 15, c: "#fff" }) +
            "<circle cx='70' cy='125' r='46' fill='#F7C948'/>" + [0, 1, 2, 3, 4].map(function (i) { return "<line x1='130' y1='" + (75 + i * 25) + "' x2='300' y2='" + (75 + i * 25) + "' stroke='#F7C948' stroke-width='2' stroke-dasharray='6 5'/>"; }).join("") +
            "<circle cx='400' cy='125' r='78' fill='#1B2A4A'/><path d='M400 47 A78 78 0 0 0 400 203Z' fill='#2E86AB'/><path d='M372 80 q20 -10 30 10 q-6 22 -26 20Z M360 140 q22 -6 30 14 q-12 20 -30 8Z' fill='#5A9A3A'/>" +
            "<path d='M320 66 Q400 18 480 66' stroke='#fff' stroke-width='2.5' fill='none' marker-end='url(#fl)'/>" + txt(565, 58, "rotation", { s: 11, c: "#fff" }) + txt(565, 74, "d'ouest en est", { s: 11, c: "#fff" }) +
            txt(352, 220, "JOUR", { s: 13, c: "#F7C948" }) + txt(452, 220, "NUIT", { s: 13, c: "#9FC5E8" }) + txt(70, 194, "Soleil", { s: 12, c: "#F7C948" }) +
            "<defs><marker id='fl' markerWidth='10' markerHeight='10' refX='7' refY='5' orient='auto'><path d='M0 1L8 5L0 9Z' fill='#fff'/></marker></defs>"))],
        fil: { html: "<p>Ngoufo se trompe : le Soleil ne tourne pas autour de la Terre en une journée. C'est la Terre qui <strong>tourne sur elle-même</strong> d'ouest en est ; le Soleil semble donc se déplacer d'est en ouest.</p>", verdicts: [[0, "rejetee", "C'est la Terre qui tourne sur elle-même ; le mouvement du Soleil est apparent."]] },
        retenir: "Rotation : 24 h, d'ouest en est ; jour et nuit ; vitesse à l'équateur ≈ 40 000 ÷ 24 ≈ 1 670 km/h." },
      { t: "La révolution : l'année et le 29 février", html: def("Révolution", "Mouvement de la Terre qui tourne autour du Soleil en suivant une orbite presque circulaire. Un tour complet dure environ 365 jours et 6 heures.") +
          "<ul><li>La durée de la révolution définit l'<strong>année</strong>.</li><li>Le calendrier compte 365 jours : il reste 6 heures chaque année. Tous les quatre ans, 4 × 6 h = 24 h : on ajoute un jour, le <strong>29 février</strong>. L'année a alors 366 jours : c'est une <strong>année bissextile</strong>.</li><li>L'axe de la Terre est incliné d'environ 23° 27′ : pendant la révolution, chaque hémisphère reçoit plus ou moins de lumière, ce qui crée les <strong>saisons</strong> et l'inégale durée des jours et des nuits loin de l'équateur.</li></ul>" +
          formule("4 années × 6 h = 24 h = 1 jour → une année bissextile (366 jours) tous les 4 ans") +
          formule("longueur de l'orbite ≈ 2 × 3,14 × 150 000 000 ≈ 942 millions de km ; vitesse ≈ 942 000 000 ÷ 8 766 h ≈ 107 000 km/h") +
          ex("2024 et 2028 sont bissextiles : 2024 ÷ 4 = 506 et 2028 ÷ 4 = 507, sans reste. 2026 ÷ 4 = 506,5 : 2026 n'est pas bissextile.", "Reconnaître une année bissextile") +
          savais("Au Cameroun, proche de l'équateur, les jours et les nuits durent presque 12 heures toute l'année ; on y parle surtout de saison des pluies et de saison sèche plutôt que d'été et d'hiver."),
        planches: [{ type: "3d", titre: "La Terre autour du Soleil", legende: "Tourne la scène : au centre, le Soleil ; les points gris dessinent l'orbite de la Terre ; la Terre est montrée à deux moments de l'année, de part et d'autre du Soleil. Les points rouges dessinent son axe, toujours incliné dans la même direction : c'est l'origine des saisons. Les tailles et les distances ne sont pas à l'échelle.", modele: { h: 330, rx: -22, ry: 16, echelle: 0.95, alt: "Boule jaune au centre d'un cercle de points gris, avec deux boules bleues traversées par une ligne de points rouges inclinée", objets: orbite3D(), etiquettes: [{ p: [0, 48, 0], t: "le Soleil", cote: "g" }, { p: [190, 30, 0], t: "axe incliné (≈ 23° 27′)", cote: "d" }, { p: [-190, -26, 0], t: "la Terre six mois plus tôt", cote: "g" }, { p: [0, 0, -190], t: "orbite : 365 j 6 h", cote: "d" }] } }],
        fil: { html: "<p>Mafo se trompe : le Soleil ne s'allume ni ne s'éteint. La Terre tourne sur elle-même et, en même temps, <strong>autour du Soleil</strong> en 365 jours et 6 heures : ces 6 heures, cumulées sur quatre ans, donnent le 29 février.</p>", verdicts: [[1, "rejetee", "La Terre n'est pas immobile : elle tourne sur elle-même et autour du Soleil."]] },
        retenir: "Révolution : 365 j 6 h autour du Soleil ; année bissextile tous les 4 ans (4 × 6 h = 24 h) ; axe incliné → saisons." },
      { t: "Comparer les deux mouvements", html: "<table class='donnees'><thead><tr><th></th><th>Rotation</th><th>Révolution</th></tr></thead><tbody><tr><td>Autour de quoi ?</td><td>de son axe</td><td>du Soleil</td></tr><tr><td>Durée</td><td>24 h (un jour)</td><td>365 j 6 h (une année)</td></tr><tr><td>Sens</td><td>d'ouest en est</td><td>d'ouest en est</td></tr><tr><td>Conséquences</td><td>jour et nuit, différences d'heure</td><td>année, saisons, année bissextile</td></tr><tr><td>Vitesse</td><td>≈ 1 670 km/h à l'équateur</td><td>≈ 107 000 km/h</td></tr></tbody></table>" +
          def("Mouvement apparent", "Mouvement que l'on croit voir, mais qui vient en réalité de notre propre déplacement. Le Soleil qui « se lève » est un mouvement apparent dû à la rotation de la Terre.") +
          ex("Dans un taxi qui roule, les arbres du bord de la route semblent reculer : c'est le taxi qui avance. De même, le Soleil semble traverser le ciel parce que la Terre tourne.", "Une image du mouvement apparent") +
          astuce("Rotation = « rond sur soi », comme une toupie ; révolution = « tour autour », comme un coureur autour d'un stade."),
        planches: [P2("Rotation et révolution", "Deux mouvements en même temps : la Terre tourne sur elle-même comme une toupie, et autour du Soleil comme un coureur autour d'un stade.",
          colonnes("Les deux mouvements de la Terre", [{ t: "Rotation", c: BLEU, l: ["sur son axe", "24 heures", "jour et nuit", "≈ 1 670 km/h"] }, { t: "Révolution", c: TERRE, l: ["autour du Soleil", "365 j 6 h", "année, saisons", "≈ 107 000 km/h"] }], 220, "Les deux mouvements de la Terre"))],
        fil: { html: "<p>Le grand frère conclut : la Terre a deux mouvements. La <strong>rotation</strong> en 24 heures donne le jour et la nuit ; la <strong>révolution</strong> en 365 jours et 6 heures donne l'année et le 29 février.</p>", verdicts: [[2, "validee", "Rotation en 24 h (jour et nuit) et révolution en 365 j 6 h (année, 29 février)."]] },
        retenir: "Rotation : 24 h, jour et nuit ; révolution : 365 j 6 h, année et saisons ; le mouvement du Soleil est apparent." },
      { t: "Entraînement au format de l'examen", html: integ("La rotation de la Terre dure environ…", ["365 jours", "24 heures", "30 jours", "une semaine"], "24 heures", "C'est la durée d'un jour.", "Explique pourquoi l'année 2028 aura un 29 février.", "La révolution dure 365 jours et 6 heures. Le calendrier ne compte que 365 jours : tous les 4 ans, les 4 × 6 h = 24 h forment un jour de plus, le 29 février. 2028 ÷ 4 = 507, sans reste : 2028 est bissextile.", "Un camarade affirme que « la nuit, le Soleil va dormir derrière les montagnes ».", "Rédige quelques lignes pour lui expliquer scientifiquement l'alternance du jour et de la nuit.", "Le Soleil ne dort pas et ne se cache pas derrière les montagnes. C'est la Terre qui tourne sur elle-même, d'ouest en est, en 24 heures. La moitié tournée vers le Soleil a le jour ; l'autre moitié, dans l'ombre, a la nuit. Quand notre région passe du côté de l'ombre, le Soleil semble se coucher à l'ouest : c'est un mouvement apparent."), retenir: "Savoir-être : esprit scientifique face aux croyances." }
    ],
    denouement: { titre: "Le mystère du 29 février résolu", etapes: ["La Terre tourne sur elle-même en 24 h : jour et nuit (indice 1).", "Elle tourne autour du Soleil en 365 j 6 h : l'année (indice 2).", "4 × 6 h = 24 h : un jour de plus tous les 4 ans (indice 3)."],
      formules: [F("Vitesse de rotation à l'équateur", "40 000 km ÷ 24 h", "≈ 1 670 km/h"), F("Jour ajouté tous les 4 ans", "4 × 6 h", "24 h = 1 jour, le 29 février"), F("Vitesse sur l'orbite", "942 000 000 km ÷ 8 766 h", "≈ 107 000 km/h")],
      reponse: "<p>La Terre a deux mouvements. Elle tourne sur elle-même, d'ouest en est, autour d'un axe incliné qui passe par les pôles, en 24 heures : c'est la rotation. Elle explique l'alternance du jour et de la nuit et le mouvement apparent du Soleil, qui semble se lever à l'est et se coucher à l'ouest ; à l'équateur, elle nous entraîne à environ 40 000 ÷ 24 ≈ 1 670 km/h. La Terre tourne aussi autour du Soleil en 365 jours et 6 heures : c'est la révolution, qui définit l'année et, avec l'inclinaison de l'axe, les saisons. Comme le calendrier ne compte que 365 jours, les 6 heures restantes s'additionnent : 4 × 6 h = 24 h, d'où un 29 février tous les quatre ans, dans les années bissextiles.</p>",
      transfert: "<p>Les années 2032 et 2030 sont-elles bissextiles ? Justifie par un calcul. Combien de jours compte une période de 4 années consécutives ?</p>" },
    revision: ["<strong>Rotation</strong> : la Terre tourne sur elle-même en 24 h, d'ouest en est.", "Conséquences : jour et nuit, mouvement apparent du Soleil, différences d'heure.", "<strong>Révolution</strong> : la Terre tourne autour du Soleil en 365 j 6 h.", "Conséquences : l'année, les saisons (axe incliné de 23° 27′).", "Année bissextile : 366 jours, tous les 4 ans (4 × 6 h = 24 h).", "Vitesses : ≈ 1 670 km/h (rotation à l'équateur), ≈ 107 000 km/h (révolution)."],
    exo: "<p>Combien de jours compte la période du 1er janvier 2025 au 31 décembre 2028 ? <em>(3 × 365 + 366 = 1 461 jours, car 2028 est bissextile.)</em></p>",
    quiz: [q("La rotation de la Terre se fait…", "sur elle-même", "autour du Soleil", "autour de la Lune", "Autour de son axe."), q("La rotation dure environ…", "24 heures", "365 jours", "un mois", "Un jour."), q("La rotation se fait…", "d'ouest en est", "d'est en ouest", "du nord au sud", "Le Soleil semble donc aller d'est en ouest."), q("L'alternance du jour et de la nuit est due…", "à la rotation", "à la révolution", "aux nuages", "La moitié éclairée change."), q("La révolution dure environ…", "365 jours et 6 heures", "24 heures", "30 jours", "C'est l'année."), q("Une année bissextile compte…", "366 jours", "365 jours", "360 jours", "On ajoute le 29 février."), q("On ajoute un 29 février tous les…", "4 ans", "2 ans", "10 ans", "4 × 6 h = 24 h."), q("Les saisons sont dues à la révolution et…", "à l'inclinaison de l'axe", "à la Lune", "aux vents", "Axe incliné de 23° 27′."), q("La vitesse de rotation à l'équateur est d'environ…", "1 670 km/h", "167 km/h", "16 700 km/h", "40 000 ÷ 24."), q("Le lever du Soleil est un mouvement…", "apparent", "réel du Soleil", "de la Lune", "C'est la Terre qui tourne.")],
    apc: apc("Des enfants croient que le Soleil tourne autour de la Terre et ne comprennent pas le 29 février.", "Décrire la rotation et la révolution de la Terre et expliquer leurs conséquences avec des calculs.")
  });
  VRT_A("6e-geo-terre-mouvement", 2, "Rotation ou révolution ?", function (el) {
    exercice(el, [["Le jour et la nuit sont dus à la ___.", ["rotation", "révolution", "pluie"], "La Terre tourne sur elle-même."], ["L'année est due à la ___.", ["révolution", "rotation", "Lune"], "Un tour autour du Soleil."], ["4 × 6 h = ___.", ["24 h", "12 h", "36 h"], "Un jour de plus tous les 4 ans."], ["2032 est-elle bissextile ? ___", ["oui", "non", "on ne peut pas savoir"], "2032 ÷ 4 = 508, sans reste."], ["40 000 km ÷ 24 h ≈ ___.", ["1 670 km/h", "167 km/h", "960 km/h"], "Vitesse de rotation à l'équateur."], ["Le Soleil semble se coucher à l'___.", ["ouest", "est", "nord"], "La Terre tourne d'ouest en est."]], "Question suivante", "Question");
  });

  /* ═══════════════ RANG 5 : TP 2, LE CALCUL DE L'HEURE ═══════════════ */
  function fuseaux3D() {
    var o = [{ f: "sphere", c: [0, 0, 0], r: 90, coul: "#9FC5E8" }], k, a, R = 104;
    for (k = 0; k < 24; k++) {
      a = k * Math.PI / 12;
      o.push({ f: "boite", c: [Math.round(R * Math.sin(a)), 0, Math.round(-R * Math.cos(a))], d: [24, 16, 10], coul: k === 1 ? ROUGE : (k === 0 ? VERT : (k % 2 ? "#F7C948" : "#FFFFFF")) });
    }
    o.push({ f: "sphere", c: [0, 94, 0], r: 6, coul: NUIT });
    o.push({ f: "sphere", c: [0, -94, 0], r: 6, coul: NUIT });
    return o;
  }
  VRT_L("6e-geo-tp-calcul-heure", {
    c: "6e", m: "geo", cle: "TP 2 : Le calcul de l’heure", titre: "TP 2 : le calcul de l'heure, des degrés aux fuseaux horaires", duree: 35,
    accroche: "Les Lions indomptables jouent un match amical à New York à 20 h, heure de New York. Le père de Bello veut le regarder en direct à Ngaoundéré. À quelle heure doit-il allumer la télévision ?",
    intro: "Un match des Lions indomptables te sert de fil rouge : à chaque partie, un indice t'aide à trancher entre trois manières de calculer l'heure.",
    objectifs: ["expliquer pourquoi l'heure n'est pas la même partout", "utiliser la relation 360° = 24 h, 15° = 1 h, 1° = 4 min", "calculer l'heure solaire d'un lieu à partir de sa longitude", "utiliser les fuseaux horaires et le décalage avec l'heure de Greenwich (UTC)"],
    enquete: {
      titre: "À quelle heure le match ?",
      svg: svg(640, 220, "Salon à Ngaoundéré avec une télévision éteinte, une horloge et un père et son fils qui regardent un calendrier des matchs", lin("ghC", ["#F3EDE2", "#E6EEF7"], true),
        "<rect width='640' height='220' fill='url(#ghC)'/><rect y='176' width='640' height='44' fill='#B5834E'/><rect x='420' y='80' width='160' height='96' rx='6' fill='#2E3445'/><rect x='430' y='90' width='140' height='76' fill='#4D5163'/>" + txt(500, 134, "Lions ⚽ 20 h (NY)", { s: 11, c: "#F7C948" }) +
        "<circle cx='330' cy='60' r='28' fill='#fff' stroke='#2E3445' stroke-width='3'/><line x1='330' y1='60' x2='330' y2='40' stroke='#2E3445' stroke-width='3'/><line x1='330' y1='60' x2='345' y2='66' stroke='#C62828' stroke-width='3'/>" +
        perso(140, 94, "#5A3A1E", "#1E499B", "#2E3445") + perso(220, 112, "#6B4423", "#17784D", "#2E3445") + bulle(20, 18, 270, "20 h à New York… et ici ?", "#F7C948")),
      legende: "À Ngaoundéré, Bello et son père préparent la soirée du match des Lions indomptables, joué à New York.",
      contexte: "<p>Bello pense que « le match passera à 20 h ici aussi, puisque l'heure est la même partout ». Son père croit qu'« il faut retirer 5 heures, car New York est en avance sur le Cameroun ». Bello, élève de 6e, ressort son cours de géographie pour faire le calcul juste.</p>",
      documents: [{ t: "Les fuseaux horaires", html: "<p>La Terre est découpée en 24 fuseaux horaires de 15° chacun. L'heure de référence est celle du méridien de Greenwich (heure UTC). Le Cameroun est à UTC + 1 ; New York, en hiver, à UTC − 5.</p>" },
        { t: "Une relation", html: "<p>En 24 heures, la Terre fait un tour complet, soit 360°.</p>" }],
      question: "Comment calculer l'heure d'un lieu à partir de celle d'un autre lieu ?",
      tache: "Explique pourquoi l'heure change d'un lieu à l'autre, calcule des heures solaires avec la longitude, puis trouve l'heure du match au Cameroun avec les fuseaux horaires.",
      hypotheses: ["L'heure est la même partout sur la Terre.", "New York est en avance : il faut retirer 5 heures.", "À l'est, l'heure est en avance ; le Cameroun (UTC + 1) a 6 heures d'avance sur New York (UTC − 5) : il faut ajouter 6 heures."]
    },
    parties: [
      { t: "Pourquoi l'heure change selon le lieu", html: "<ul><li>À cause de la <strong>rotation</strong>, le Soleil n'est pas au plus haut dans le ciel au même moment partout : il est <strong>midi solaire</strong> quand le Soleil passe au méridien du lieu.</li><li>La Terre tourne de <strong>360° en 24 h</strong>, donc de <strong>15° en 1 h</strong> et de <strong>1° en 4 minutes</strong>.</li><li>Comme la Terre tourne d'ouest en est, les lieux situés à l'<strong>est</strong> voient le Soleil plus tôt : ils sont <strong>en avance</strong> ; ceux de l'ouest sont <strong>en retard</strong>.</li></ul>" +
          def("Heure solaire", "Heure d'un lieu calculée d'après la position du Soleil : il est 12 h solaire quand le Soleil est au plus haut dans le ciel de ce lieu.") +
          formule("360° ↔ 24 h ; 15° ↔ 1 h ; 1° ↔ 4 min (24 × 60 ÷ 360 = 4)") +
          astuce("Phrase-clé : « À l'est, on est en avance ; à l'ouest, on est en retard. » Le Soleil se lève d'abord à l'est."),
        planches: [P2("Des degrés aux heures", "En une heure, la Terre tourne de 15° ; en quatre minutes, de 1°. On convertit ainsi une différence de longitude en différence d'heure.",
          colonnes("Convertir les degrés en temps", [{ t: "360°", c: BLEU, l: ["un tour", "= 24 h"] }, { t: "15°", c: VERT, l: ["un fuseau", "= 1 h"] }, { t: "1°", c: TERRE, l: ["= 4 min", "(1 440 min ÷ 360)"] }, { t: "Est / Ouest", c: ROUGE, l: ["est = avance", "ouest = retard"] }], 200, "Convertir les degrés en temps"))],
        fil: { html: "<p>Bello se trompe : l'heure n'est pas la même partout. Quand il est midi à Ngaoundéré, le Soleil n'est pas encore levé à New York, qui est loin à l'ouest.</p>", verdicts: [[0, "rejetee", "La rotation crée des heures différentes : l'est est en avance."]] },
        retenir: "360° = 24 h ; 15° = 1 h ; 1° = 4 min ; à l'est on est en avance, à l'ouest en retard." },
      { t: "Calculer une heure solaire", html: "<div class='methode'><b>Calculer l'heure solaire d'un lieu B connaissant celle d'un lieu A</b><ol><li>Calcule la <strong>différence de longitude</strong> : si les deux lieux sont du même côté de Greenwich, on soustrait ; s'ils sont de part et d'autre, on additionne.</li><li>Convertis en temps : <strong>× 4 min</strong> par degré.</li><li><strong>Ajoute</strong> le décalage si B est à l'est de A, <strong>retire-le</strong> si B est à l'ouest.</li></ol></div>" +
          formule("différence d'heure = différence de longitude × 4 min") +
          ex("Douala (9° 42′ E ≈ 9,7° E) et Maroua (14° 19′ E ≈ 14,3° E) : 14,3 − 9,7 = 4,6° ; 4,6 × 4 ≈ 18 min. Quand il est 12 h solaire à Douala, il est environ 12 h 18 à Maroua, plus à l'est.", "Heure solaire de Douala à Maroua") +
          ex("Greenwich (0°) et Yaoundé (11° 31′ E ≈ 11,5° E) : 11,5 × 4 = 46 min. Quand il est 12 h solaire à Greenwich, il est environ 12 h 46 à Yaoundé.", "De Greenwich à Yaoundé") +
          attention("Lieux de part et d'autre de Greenwich (un à l'est, l'autre à l'ouest) : on additionne les longitudes. Ex. 30° O et 15° E : 30 + 15 = 45°, soit 3 h."),
        planches: [{ type: "3d", titre: "Les 24 fuseaux horaires", legende: "Tourne le globe : la ceinture de 24 blocs représente les 24 fuseaux horaires de 15° chacun. Le bloc vert est le fuseau de Greenwich (UTC) ; le bloc rouge, juste à l'est, est celui du Cameroun (UTC + 1). Chaque bloc vers l'est ajoute une heure ; vers l'ouest, il en retire une.", modele: { h: 330, rx: -18, ry: 22, echelle: 1, alt: "Globe bleu clair entouré d'une ceinture de 24 blocs jaunes et blancs, avec un bloc vert et un bloc rouge", objets: fuseaux3D(), etiquettes: [{ p: [0, 10, -110], t: "Greenwich : UTC", cote: "g" }, { p: [27, 10, -101], t: "Cameroun : UTC + 1", cote: "d" }, { p: [0, 100, 0], t: "pôle Nord", cote: "g" }] } }],
        fil: { html: "<p>Le père de Bello a raison de vouloir calculer un écart, mais il se trompe de sens : New York est à l'<strong>ouest</strong> du Cameroun, donc <strong>en retard</strong>, pas en avance. Il ne faut pas retirer d'heures, il faut en ajouter.</p>", verdicts: [[1, "rejetee", "New York est à l'ouest : il est en retard sur le Cameroun, pas en avance."]] },
        retenir: "Différence d'heure = différence de longitude × 4 min ; on ajoute vers l'est, on retire vers l'ouest." },
      { t: "Les fuseaux horaires et l'heure légale", html: def("Fuseau horaire", "Bande de la Terre, large de 15° de longitude, à l'intérieur de laquelle tous les lieux adoptent la même heure légale. Il y a 24 fuseaux.") +
          "<ul><li>L'heure de référence est l'<strong>heure UTC</strong>, celle du méridien de Greenwich.</li><li>Chaque pays choisit son <strong>heure légale</strong> : le Cameroun est à <strong>UTC + 1</strong> (heure d'Afrique de l'Ouest et du Centre), comme le Nigeria, le Gabon ou le Tchad.</li><li>Les frontières des fuseaux suivent souvent celles des pays, pour qu'un pays garde une seule heure.</li></ul>" +
          formule("heure de B = heure de A + (décalage de B − décalage de A)") +
          ex("Match à 20 h à New York (UTC − 5). Décalage du Cameroun moins celui de New York : (+1) − (−5) = 6 h. 20 h + 6 h = 26 h, soit 2 h du matin le lendemain à Ngaoundéré.", "L'heure du match au Cameroun") +
          savais("Près de l'antiméridien (180°), la ligne de changement de date sépare deux journées : en la franchissant vers l'ouest, on avance d'un jour."),
        planches: [P2("Quelle heure est-il dans le monde ?", "Quand il est 12 h à Yaoundé (UTC + 1), l'heure légale change d'un pays à l'autre selon son décalage avec Greenwich.",
          frise("Quand il est 12 h à Yaoundé", [{ a: "New York", l: ["UTC − 5", "6 h"], c: BLEU }, { a: "Dakar", l: ["UTC", "11 h"], c: VERT }, { a: "Yaoundé", l: ["UTC + 1", "12 h"], c: ROUGE }, { a: "Nairobi", l: ["UTC + 3", "14 h"], c: TERRE }, { a: "Pékin", l: ["UTC + 8", "19 h"], c: "#7B3F99" }, { a: "Tokyo", l: ["UTC + 9", "20 h"], c: GRIS }], 230, "Frise des heures légales de New York à Tokyo quand il est 12 h à Yaoundé"))],
        fil: { html: "<p>Bello trouve la bonne réponse : le Cameroun (UTC + 1) a <strong>6 heures d'avance</strong> sur New York (UTC − 5). Le match commencera à 20 h + 6 h = <strong>2 h du matin</strong>, le lendemain, à Ngaoundéré.</p>", verdicts: [[2, "validee", "(+1) − (−5) = 6 h d'avance : 20 h + 6 h = 2 h du matin le lendemain."]] },
        retenir: "24 fuseaux de 15° ; UTC = Greenwich ; Cameroun = UTC + 1 ; heure de B = heure de A + (décalage B − décalage A)." },
      { t: "Entraînement au format de l'examen", html: integ("Un fuseau horaire mesure…", ["15° de longitude", "1° de longitude", "24° de longitude", "90° de longitude"], "15° de longitude", "360° ÷ 24 = 15°.", "Il est 10 h à Yaoundé (UTC + 1). Quelle heure est-il à Tokyo (UTC + 9) ?", "Décalage : 9 − 1 = 8 h d'avance pour Tokyo. 10 h + 8 h = 18 h à Tokyo.", "Ta tante, à Paris (UTC + 1 en hiver), veut appeler ton cousin étudiant à Montréal (UTC − 5) à 21 h, heure de Paris.", "Calcule l'heure qu'il sera à Montréal et dis si c'est un bon moment pour appeler.", "Décalage : (−5) − (+1) = −6 h. 21 h − 6 h = 15 h à Montréal. C'est l'après-midi : le cousin est peut-être en cours, mais l'heure n'est pas gênante ; il vaut mieux lui envoyer un message avant pour convenir d'un moment."), retenir: "Savoir-être : respect du temps des autres et ponctualité." }
    ],
    denouement: { titre: "Le réveil est réglé", etapes: ["L'heure change avec la longitude : l'est est en avance (indice 1).", "15° = 1 h, 1° = 4 min (indice 2).", "Cameroun UTC + 1, New York UTC − 5 : 6 h d'écart (indice 3)."],
      formules: [F("Conversion", "360° = 24 h", "15° = 1 h ; 1° = 4 min"), F("Heure solaire Douala → Maroua", "(14,3 − 9,7) × 4 min", "≈ 18 min d'avance pour Maroua"), F("Heure du match", "20 h + [(+1) − (−5)] h", "20 h + 6 h = 2 h du matin le lendemain")],
      reponse: "<p>L'heure n'est pas la même partout, car la Terre tourne de 360° en 24 heures, soit 15° par heure et 1° toutes les 4 minutes : les lieux situés à l'est voient le Soleil plus tôt et sont en avance, ceux de l'ouest sont en retard. Pour calculer une heure solaire, on multiplie la différence de longitude par 4 minutes : Maroua a environ 18 minutes d'avance sur Douala. Pour l'heure légale, la Terre est découpée en 24 fuseaux horaires de 15° ; la référence est l'heure UTC de Greenwich. Le Cameroun est à UTC + 1 et New York, en hiver, à UTC − 5 : le Cameroun a 6 heures d'avance. Le match joué à 20 h à New York commencera donc à 2 h du matin, le lendemain, à Ngaoundéré.</p>",
      transfert: "<p>La finale d'une compétition se joue à Doha (UTC + 3) à 18 h. À quelle heure faut-il l'allumer au Cameroun ? Et à Rio de Janeiro (UTC − 3) ?</p>" },
    revision: ["L'heure change selon la longitude, à cause de la <strong>rotation</strong>.", "360° = 24 h ; 15° = 1 h ; 1° = 4 min.", "À l'est, on est en avance ; à l'ouest, en retard.", "Différence d'heure = différence de longitude × 4 min.", "24 <strong>fuseaux horaires</strong> de 15° ; référence : UTC (Greenwich).", "Le Cameroun est à UTC + 1."],
    exo: "<p>Il est 15 h à Yaoundé (UTC + 1). Quelle heure est-il à Dakar (UTC) et à Nairobi (UTC + 3) ? <em>(Dakar : 14 h ; Nairobi : 17 h.)</em></p>",
    quiz: [q("En 24 heures, la Terre tourne de…", "360°", "180°", "24°", "Un tour complet."), q("En une heure, la Terre tourne de…", "15°", "1°", "60°", "360 ÷ 24."), q("1° de longitude correspond à…", "4 minutes", "1 heure", "15 minutes", "1 440 min ÷ 360."), q("Un lieu situé à l'est est…", "en avance", "en retard", "à la même heure", "Il voit le Soleil plus tôt."), q("L'heure de référence mondiale est celle…", "de Greenwich (UTC)", "de Yaoundé", "de New York", "Méridien 0°."), q("Le Cameroun est à…", "UTC + 1", "UTC − 1", "UTC + 3", "Comme le Nigeria et le Gabon."), q("La Terre compte … fuseaux horaires.", "24", "12", "360", "Un par heure."), q("Il est 12 h à Yaoundé ; à Dakar (UTC), il est…", "11 h", "13 h", "12 h", "Dakar est en retard d'une heure."), q("Différence de longitude de 30° = …", "2 h", "30 min", "30 h", "30 ÷ 15 = 2."), q("Match à 20 h à New York (UTC − 5) : au Cameroun, il est…", "2 h du matin le lendemain", "14 h", "15 h", "20 h + 6 h.")],
    apc: apc("Une famille veut regarder en direct un match joué à New York sans connaître l'heure au Cameroun.", "Convertir les degrés de longitude en temps, calculer une heure solaire et une heure légale avec les fuseaux horaires.")
  });
  VRT_A("6e-geo-tp-calcul-heure", 2, "Calcule l'heure", function (el) {
    exercice(el, [["45° de différence de longitude = ___.", ["3 h", "45 min", "4 h 30"], "45 ÷ 15 = 3."], ["10° de différence = ___.", ["40 min", "10 min", "1 h"], "10 × 4 min."], ["12 h à Yaoundé (UTC + 1) = ___ à Dakar (UTC).", ["11 h", "13 h", "12 h"], "Dakar est à l'ouest."], ["12 h à Yaoundé = ___ à Nairobi (UTC + 3).", ["14 h", "10 h", "15 h"], "Nairobi est à l'est : + 2 h."], ["8 h à New York (UTC − 5) = ___ au Cameroun.", ["14 h", "2 h", "13 h"], "+ 6 h."], ["Un lieu à l'ouest de Greenwich est ___.", ["en retard", "en avance", "à la même heure"], "Il voit le Soleil plus tard."]], "Calcul suivant", "Calcul");
  });

  /* ═══════════════ RANG 6 : TP 3, LES FORMES DE REPRÉSENTATION DE LA TERRE ═══════════════ */
  function projection3D() {
    var o = [{ f: "sphere", c: [-120, 0, 0], r: 70, coul: "#2E86AB" }];
    [[-150, 20, -52], [-96, -18, -58], [-120, 44, -50], [-80, 30, -48]].forEach(function (p) { o.push({ f: "sphere", c: p, r: 16, coul: "#5A9A3A" }); });
    o.push({ f: "cylindre", c: [-120, -90, 0], r: 74, h: 180, n: 24, coul: "#F7C948", op: 0.25 });
    o.push({ f: "boite", c: [130, 0, 0], d: [200, 120, 6], coul: "#2E86AB" });
    [[90, 20, -4, 36, 30], [150, -14, -4, 46, 44], [170, 36, -4, 30, 26], [96, -30, -4, 20, 22], [130, 52, -4, 80, 14]].forEach(function (p) { o.push({ f: "boite", c: [p[0], p[1], p[2]], d: [p[3], p[4], 2], coul: "#5A9A3A", div: false }); });
    return o;
  }
  VRT_L("6e-geo-tp-representations-terre", {
    c: "6e", m: "geo", cle: "TP 3 : Les formes de représentations de la terre", titre: "TP 3 : les formes de représentation de la Terre (globe, planisphère, cartes)", duree: 35,
    accroche: "Sur le planisphère de la classe, à Ebolowa, le Groenland paraît presque aussi grand que l'Afrique. Pourtant, le globe du professeur montre le contraire. Quelle représentation dit vrai ?",
    intro: "Un débat devant le planisphère de la classe te sert de fil rouge : à chaque partie, un indice t'aide à trancher entre trois idées sur les représentations de la Terre.",
    objectifs: ["distinguer le globe, le planisphère et les cartes", "expliquer pourquoi tout planisphère déforme la Terre", "distinguer carte à petite échelle et carte à grande échelle", "comparer des superficies et des distances avec des calculs simples"],
    enquete: {
      titre: "Le Groenland est-il aussi grand que l'Afrique ?",
      svg: svg(640, 220, "Salle de classe à Ebolowa avec un planisphère au mur et un globe sur le bureau", lin("grpC", ["#F5EFE3", "#E9F1F7"], true),
        "<rect width='640' height='220' fill='url(#grpC)'/><rect y='176' width='640' height='44' fill='#B5834E'/><rect x='300' y='30' width='300' height='140' fill='#5B9BD5' stroke='#6B6B6B' stroke-width='3'/>" +
        "<path d='M400 40 h70 v32 h-70Z' fill='#E8F0E0' stroke='#17784D'/><path d='M440 90 q30 -6 40 16 q6 34 -18 56 q-22 -20 -30 -44Z' fill='#9AC48A' stroke='#17784D'/>" + txt(435, 60, "Groenland", { s: 10 }) + txt(460, 125, "Afrique", { s: 10 }) +
        "<rect x='150' y='140' width='110' height='36' fill='#8A5A33'/><circle cx='205' cy='112' r='26' fill='#2E86AB'/><path d='M195 104 q12 -6 18 6 q-4 14 -16 12Z' fill='#5A9A3A'/><rect x='202' y='136' width='6' height='6' fill='#3B4252'/>" +
        perso(80, 92, "#5A3A1E", "#C62828", "#2E3445") + bulle(20, 16, 260, "Le Groenland est aussi grand ?", "#F7C948")),
      legende: "Dans une salle de 6e à Ebolowa, le planisphère accroché au mur et le globe posé sur le bureau ne montrent pas les mêmes tailles.",
      contexte: "<p>Essomba affirme que « le planisphère est juste, puisqu'il est imprimé par des spécialistes : le Groenland est presque aussi grand que l'Afrique ». Nkolo pense que « le globe et le planisphère sont faux tous les deux : on ne peut pas savoir la vraie taille ». Le professeur propose de comparer les représentations et de calculer.</p>",
      documents: [{ t: "Deux superficies", html: "<p>Afrique : environ 30,3 millions de km². Groenland : environ 2,2 millions de km².</p>" },
        { t: "Mettre à plat une sphère", html: "<p>Essaie d'aplatir la peau d'une orange sans la déchirer ni l'étirer : c'est impossible. Les cartographes rencontrent le même problème avec la Terre.</p>" }],
      question: "Quelles sont les formes de représentation de la Terre et laquelle respecte les tailles réelles ?",
      tache: "Compare le globe, le planisphère et les cartes, explique les déformations, puis calcule le rapport réel entre l'Afrique et le Groenland.",
      hypotheses: ["Le planisphère est exact : le Groenland est presque aussi grand que l'Afrique.", "Toutes les représentations sont fausses : on ne peut pas connaître la vraie taille.", "Le globe respecte les formes et les surfaces ; le planisphère déforme toujours, surtout près des pôles : l'Afrique est en réalité environ 14 fois plus grande que le Groenland."]
    },
    parties: [
      { t: "Le globe : la représentation la plus fidèle", html: def("Globe terrestre", "Représentation de la Terre sous la forme d'une sphère réduite. Il respecte les formes, les surfaces, les distances et les directions, mais il ne montre qu'une moitié de la Terre à la fois et ne peut pas être très détaillé.") +
          "<ul><li>Le globe est un modèle réduit de la Terre : sur un globe de 30 cm de diamètre, l'échelle est d'environ 1/42 000 000.</li><li>Avantages : formes et surfaces <strong>exactes</strong>.</li><li>Inconvénients : on ne voit qu'une moitié de la Terre ; il est encombrant ; on ne peut pas y représenter un quartier ou une ville.</li></ul>" +
          formule("échelle du globe ≈ diamètre du globe ÷ diamètre de la Terre = 30 cm ÷ 1 274 000 000 cm ≈ 1/42 000 000") +
          ex("Sur ce globe, 1 cm représente 42 000 000 cm, soit 420 km : la distance Douala-Yaoundé (environ 200 km à vol d'oiseau) n'y mesure qu'un demi-centimètre.", "Un globe est peu détaillé") +
          savais("Le plus ancien globe terrestre conservé, celui de Martin Behaim, date de 1492 : il ne montre pas encore l'Amérique."),
        planches: [P2("Globe, planisphère, carte", "Chaque représentation a ses avantages et ses limites : on choisit selon ce que l'on veut montrer.",
          colonnes("Trois façons de représenter la Terre", [{ t: "Globe", c: BLEU, l: ["sphère réduite", "formes exactes", "une moitié visible", "peu détaillé"] }, { t: "Planisphère", c: TERRE, l: ["toute la Terre", "à plat", "déformations", "surtout aux pôles"] }, { t: "Carte", c: VERT, l: ["une partie", "de la Terre", "détaillée", "selon l'échelle"] }], 230, "Trois façons de représenter la Terre"))],
        fil: { html: "<p>Nkolo se trompe : toutes les représentations ne sont pas fausses. Le <strong>globe</strong> respecte les formes et les surfaces ; il permet de connaître les tailles réelles.</p>", verdicts: [[1, "rejetee", "Le globe respecte les formes et les surfaces : on peut connaître les tailles réelles."]] },
        retenir: "Globe : sphère réduite, formes et surfaces exactes, mais une moitié visible et peu de détails." },
      { t: "Le planisphère et ses déformations", html: def("Planisphère", "Carte qui représente toute la surface de la Terre à plat, sur une feuille. On l'obtient par une projection, qui déforme toujours une partie de la Terre.") +
          "<ul><li>On ne peut pas mettre une sphère à plat sans la <strong>déformer</strong>, comme la peau d'une orange.</li><li>La <strong>projection</strong> la plus connue, celle de Mercator (1569), enroule une feuille en cylindre autour du globe : elle respecte les formes et les directions, utiles aux marins, mais <strong>agrandit énormément</strong> les régions proches des pôles.</li><li>D'autres projections respectent mieux les surfaces (comme celle de Peters), mais déforment les formes.</li></ul>" +
          formule("rapport des superficies = 30,3 ÷ 2,2 ≈ 14 : l'Afrique est environ 14 fois plus grande que le Groenland") +
          ex("Sur le planisphère de Mercator, le Groenland, proche du pôle Nord, paraît presque aussi grand que l'Afrique, qui est traversée par l'équateur. En réalité, on pourrait placer environ 14 Groenland dans l'Afrique.", "Le piège du Groenland") +
          attention("Un planisphère n'est ni « vrai » ni « faux » : il fait un choix. Lis toujours le nom de la projection avant de comparer des surfaces."),
        planches: [{ type: "3d", titre: "Du globe au planisphère", legende: "Tourne la scène : à gauche, le globe entouré d'un cylindre de papier transparent, comme dans la projection de Mercator ; à droite, le même papier déroulé à plat devient un planisphère rectangulaire. Les continents sont étirés, surtout vers le haut et le bas, près des pôles.", modele: { h: 320, rx: -14, ry: 22, echelle: 0.95, alt: "Globe bleu à taches vertes entouré d'un cylindre jaune transparent, et un rectangle bleu à taches vertes", objets: projection3D(), etiquettes: [{ p: [-120, 74, 0], t: "globe dans un cylindre", cote: "g" }, { p: [130, 62, -4], t: "planisphère (déroulé à plat)", cote: "d" }, { p: [130, 52, -6], t: "régions polaires étirées", cote: "d" }] } }],
        fil: { html: "<p>Essomba se trompe : le planisphère de Mercator <strong>agrandit</strong> les régions proches des pôles. Le Groenland n'est pas presque aussi grand que l'Afrique : l'Afrique est environ 14 fois plus vaste.</p>", verdicts: [[0, "rejetee", "Le planisphère de Mercator agrandit les régions polaires : l'Afrique est 14 fois plus grande."]] },
        retenir: "Planisphère = projection à plat ; toujours des déformations ; Mercator agrandit les pôles ; Afrique ≈ 14 × Groenland." },
      { t: "Les cartes : petite et grande échelle", html: "<ul><li>Une <strong>carte</strong> représente une partie de la Terre : un continent, un pays, une région, une ville.</li><li>Une carte à <strong>petite échelle</strong> (1/10 000 000, par exemple) représente un <strong>grand espace avec peu de détails</strong> : l'Afrique, le Cameroun.</li><li>Une carte à <strong>grande échelle</strong> (1/10 000, par exemple) représente un <strong>petit espace avec beaucoup de détails</strong> : un quartier, une ville.</li></ul>" +
          def("Petite et grande échelle", "Plus le dénominateur de l'échelle est grand, plus l'échelle est petite : 1/10 000 000 est une petite échelle (grand espace, peu de détails) ; 1/10 000 est une grande échelle (petit espace, beaucoup de détails).") +
          formule("1/10 000 000 : 1 cm = 100 km ; 1/10 000 : 1 cm = 100 m") +
          ex("Le Cameroun mesure environ 1 200 km du nord au sud. Sur une carte au 1/10 000 000, il mesure 1 200 ÷ 100 = 12 cm ; au 1/1 000 000, 120 cm : la carte ne tiendrait pas dans un cahier.", "Choisir l'échelle d'une carte") +
          astuce("« Grande échelle = grands détails. Petite échelle = petits détails. » Le dénominateur et la taille de l'espace vont dans le même sens."),
        planches: [P2("Petite échelle ou grande échelle ?", "Plus on veut voir de détails, plus l'échelle doit être grande et l'espace représenté petit.",
          colonnes("Choisir l'échelle", [{ t: "1/10 000 000", c: BLEU, l: ["petite échelle", "1 cm = 100 km", "l'Afrique, le Cameroun"] }, { t: "1/200 000", c: VERT, l: ["échelle moyenne", "1 cm = 2 km", "une région"] }, { t: "1/10 000", c: TERRE, l: ["grande échelle", "1 cm = 100 m", "un quartier, une ville"] }], 210, "Choisir l'échelle"))],
        fil: { html: "<p>Le professeur conclut : le <strong>globe</strong> donne les vraies proportions ; le <strong>planisphère</strong> montre toute la Terre mais la déforme ; les <strong>cartes</strong> montrent une partie plus ou moins détaillée selon l'échelle. L'Afrique est environ 14 fois plus grande que le Groenland.</p>", verdicts: [[2, "validee", "Globe fidèle, planisphère toujours déformé, cartes selon l'échelle ; Afrique ≈ 14 fois le Groenland."]] },
        retenir: "Petite échelle : grand espace, peu de détails ; grande échelle : petit espace, beaucoup de détails." },
      { t: "Entraînement au format de l'examen", html: integ("La représentation qui respecte le mieux les formes et les surfaces de la Terre est…", ["le planisphère de Mercator", "le globe terrestre", "le plan d'une ville", "le croquis"], "Le globe terrestre", "C'est une sphère réduite, comme la Terre.", "Le Cameroun (475 000 km²) et le Nigeria (924 000 km²) : combien de fois le Nigeria est-il plus grand ?", "924 000 ÷ 475 000 ≈ 1,9 : le Nigeria est presque 2 fois plus grand que le Cameroun.", "Ton club de géographie prépare une affiche « Notre continent » et hésite entre un planisphère de Mercator et une projection qui respecte les surfaces.", "Conseille-le en justifiant ton choix.", "Pour montrer la vraie taille de l'Afrique, il faut choisir une projection qui respecte les surfaces (comme celle de Peters) : sur le planisphère de Mercator, les régions proches des pôles, comme l'Europe ou le Groenland, sont agrandies, et l'Afrique paraît plus petite qu'elle n'est. On peut ajouter un encadré : « L'Afrique est environ 14 fois plus grande que le Groenland. »"), retenir: "Savoir-être : esprit critique devant les images et fierté de son continent." }
    ],
    denouement: { titre: "Le piège du planisphère déjoué", etapes: ["Le globe respecte les formes et les surfaces (indice 1).", "Le planisphère de Mercator agrandit les pôles : Afrique ≈ 14 × Groenland (indice 2).", "Les cartes changent de détail selon l'échelle (indice 3)."],
      formules: [F("Rapport des superficies", "30,3 ÷ 2,2", "≈ 14"), F("Échelle d'un globe de 30 cm", "30 ÷ 1 274 000 000", "≈ 1/42 000 000"), F("Cameroun au 1/10 000 000", "1 200 km ÷ 100 km/cm", "12 cm")],
      reponse: "<p>On représente la Terre de trois façons. Le globe terrestre est une sphère réduite : il respecte les formes et les surfaces, mais ne montre qu'une moitié de la Terre et peu de détails. Le planisphère montre toute la Terre à plat, grâce à une projection ; comme on ne peut pas aplatir une sphère sans la déformer, il déforme toujours une partie de la Terre : la projection de Mercator agrandit les régions proches des pôles. C'est pourquoi le Groenland y paraît presque aussi grand que l'Afrique, alors que l'Afrique (30,3 millions de km²) est environ 30,3 ÷ 2,2 ≈ 14 fois plus grande. Enfin, les cartes représentent une partie de la Terre : à petite échelle, un grand espace avec peu de détails ; à grande échelle, un petit espace avec beaucoup de détails.</p>",
      transfert: "<p>Compare sur un globe et sur un planisphère la taille de l'Europe et celle de l'Afrique. Que remarques-tu ? Explique la différence.</p>" },
    revision: ["<strong>Globe</strong> : sphère réduite ; formes et surfaces exactes.", "<strong>Planisphère</strong> : toute la Terre à plat, grâce à une projection.", "Toute projection déforme ; Mercator agrandit les régions polaires.", "L'Afrique est environ 14 fois plus grande que le Groenland.", "<strong>Carte</strong> : une partie de la Terre.", "Petite échelle (1/10 000 000) : grand espace, peu de détails ; grande échelle (1/10 000) : petit espace, beaucoup de détails."],
    exo: "<p>L'Afrique mesure environ 30,3 millions de km² et l'Europe environ 10,2 millions de km². Combien de fois l'Afrique est-elle plus grande ? <em>(30,3 ÷ 10,2 ≈ 3 fois.)</em></p>",
    quiz: [q("Le globe terrestre est…", "une sphère réduite représentant la Terre", "une carte plate", "un plan de ville", "Comme une petite Terre."), q("Le globe respecte…", "les formes et les surfaces", "seulement les noms", "rien", "C'est la représentation la plus fidèle."), q("Le planisphère représente…", "toute la Terre à plat", "une seule ville", "une moitié de la Terre", "Sur une feuille."), q("Une projection sert à…", "mettre la sphère terrestre à plat", "colorier une carte", "mesurer l'heure", "Elle déforme toujours."), q("La projection de Mercator agrandit…", "les régions proches des pôles", "l'Afrique", "l'équateur", "Le Groenland paraît énorme."), q("L'Afrique est environ … fois plus grande que le Groenland.", "14", "2", "1", "30,3 ÷ 2,2."), q("Une carte au 1/10 000 000 est à…", "petite échelle", "grande échelle", "échelle réelle", "Grand espace, peu de détails."), q("Pour représenter un quartier, on choisit une…", "grande échelle", "petite échelle", "projection de Mercator", "Beaucoup de détails."), q("Au 1/10 000 000, 1 cm représente…", "100 km", "10 km", "1 000 km", "10 000 000 cm = 100 km."), q("Le plus ancien globe conservé date de…", "1492", "1950", "300 av. J.-C.", "Globe de Martin Behaim.")],
    apc: apc("Des élèves croient, en regardant le planisphère de la classe, que le Groenland est presque aussi grand que l'Afrique.", "Comparer globe, planisphère et cartes, expliquer les déformations et calculer le rapport réel des superficies.")
  });
  VRT_A("6e-geo-tp-representations-terre", 2, "Globe, planisphère ou carte ?", function (el) {
    exercice(el, [["Pour voir toute la Terre d'un coup d'œil, on utilise ___.", ["un planisphère", "un globe", "un plan"], "Toute la Terre à plat."], ["Pour connaître les vraies formes des continents, on utilise ___.", ["un globe", "un planisphère de Mercator", "un croquis"], "Il ne déforme pas."], ["Pour trouver une rue de Douala, on utilise ___.", ["un plan à grande échelle", "un planisphère", "un globe"], "Beaucoup de détails."], ["30,3 ÷ 2,2 ≈ ___.", ["14", "3", "28"], "Afrique / Groenland."], ["1/10 000 000 est une ___ échelle.", ["petite", "grande", "moyenne"], "Grand dénominateur."], ["Au 1/10 000 000, 12 cm représentent ___.", ["1 200 km", "120 km", "12 km"], "12 × 100 km."]], "Question suivante", "Question");
  });
})();
