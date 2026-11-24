/* Leçons GRATUITES — Histoire de 6e, lot 5 (24/11/2026) : rangs 20 (expansion de l'islam en Afrique), 13 (dossier :
   le travail des métaux), 7 (TD : les civilisations du Néolithique au Cameroun). Même gabarit que 36- à 39-histoire-6e. */
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
  function apc(situation, tache) { return { module: "Histoire de 6e", famille: "Vie sociale et culturelle", agir: "Connaître le passé de l'Afrique et du Cameroun pour mieux comprendre le présent", situation: situation, tache: tache }; }
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





  /* ═══════════════ RANG 20 : L'EXPANSION DE L'ISLAM EN AFRIQUE ═══════════════ */
  function djingareyber3D() {
    var o = [{ f: "boite", c: [0, -6, 0], d: [500, 6, 280], coul: "#D8B47A", dessus: "#E6C48A" }];
    o.push({ f: "boite", c: [0, 30, 20], d: [340, 60, 180], coul: "#B5834E", dessus: "#C9965E" });
    o.push({ f: "boite", c: [-60, 66, 20], d: [180, 12, 140], coul: "#A97A48", dessus: "#BE8C56" });
    /* le minaret en tronc de pyramide, avec ses poutres de bois (toron) qui dépassent */
    o.push({ f: "poly", pts: [[110, 0, -50], [170, 0, -50], [158, 120, -38], [122, 120, -38]], coul: "#B07A46" });
    o.push({ f: "poly", pts: [[170, 0, -50], [170, 0, 10], [158, 120, -2], [158, 120, -38]], coul: "#9A6A3A" });
    o.push({ f: "poly", pts: [[110, 0, -50], [110, 0, 10], [122, 120, -2], [122, 120, -38]], coul: "#A87444" });
    o.push({ f: "boite", c: [140, 126, -20], d: [36, 12, 36], coul: "#9A6A3A", dessus: "#B07A46" });
    [20, 45, 70, 95].forEach(function (y) { [118, 132, 146, 160].forEach(function (x) { o.push({ f: "boite", c: [x, y, -54], d: [3, 3, 12], coul: "#5A3A1E" }); }); });
    [-140, -100, -60, -20, 20, 60].forEach(function (x) { o.push({ f: "boite", c: [x, 40, -72], d: [3, 3, 12], coul: "#5A3A1E" }); });
    /* une caravane : dromadaires stylisés */
    [[-200, -110], [-160, -118]].forEach(function (p) { o.push({ f: "boite", c: [p[0], 22, p[1]], d: [34, 14, 12], coul: "#C9A06E" }); o.push({ f: "sphere", c: [p[0], 32, p[1]], r: 8, coul: "#C9A06E" }); o.push({ f: "boite", c: [p[0] + 22, 34, p[1]], d: [6, 22, 6], coul: "#C9A06E" }); [-12, 12].forEach(function (dx) { o.push({ f: "boite", c: [p[0] + dx, 8, p[1]], d: [4, 16, 4], coul: "#A07850" }); }); });
    o.push({ f: "boite", c: [-90, 6, -120], d: [30, 12, 18], coul: "#F4F1EA", dessus: "#FBF8F2" });
    return o;
  }
  VRT_L("6e-histoire-islam-afrique", {
    c: "6e", m: "histoire", cle: "L’expansion de l’islam en Afrique", titre: "L'expansion de l'islam en Afrique, jusqu'au Nord-Cameroun", duree: 30,
    accroche: "Le lamido de Ngaoundéré reçoit des élèves dans son palais. « Depuis quand l'islam est-il au Cameroun ? » Il sourit : « Depuis bien plus longtemps que tu ne le crois, et il est venu par le désert. »",
    intro: "Une visite au lamidat de Ngaoundéré te sert de fil rouge : à chaque partie, un indice t'aide à trancher entre trois idées sur l'arrivée de l'islam en Afrique et au Cameroun.",
    objectifs: ["décrire l'arrivée de l'islam en Afrique du Nord au VIIe siècle", "expliquer le rôle du commerce transsaharien", "présenter les royaumes musulmans du Soudan (Ghana, Mali, Kanem-Bornou)", "expliquer l'installation de l'islam au Nord-Cameroun au XIXe siècle"],
    enquete: {
      titre: "La visite du lamidat",
      svg: svg(640, 220, "Entrée d'un palais traditionnel en terre au toit conique ; un lamido en grand boubou reçoit des élèves", lin("iaC", ["#FBEFD8", "#EEDBB2"], true),
        "<rect width='640' height='220' fill='url(#iaC)'/><rect y='186' width='640' height='34' fill='#C9A06E'/><rect x='360' y='90' width='220' height='96' fill='#B5834E'/><path d='M350 94L470 40L590 94Z' fill='#C9A65A'/><rect x='446' y='130' width='48' height='56' rx='24' fill='#5A3A1E'/>" +
        perso(300, 96, "#4A2E18", "#F4F1EA", "#F4F1EA") + "<path d='M286 106h28v-8h-28Z' fill='#1E499B'/>" + perso(90, 98, "#5A3A1E", "#C2540A", "#2E3445") + perso(160, 104, "#6B4423", "#17784D", "#2E3445") + perso(220, 104, "#4A2E18", "#7B3F99", "#2E3445") +
        bulle(30, 30, 240, "Depuis quand l'islam est ici ?", "#F7C948")),
      legende: "À Ngaoundéré, des élèves de 6e visitent le palais du lamido.",
      contexte: "<p>En visite au lamidat de Ngaoundéré, les élèves de 6e A écoutent le guide. Djibrilla pense que « l'islam est arrivé au Cameroun avec les commerçants arabes venus par bateau à Douala ». Esther croit que « l'islam s'est répandu en Afrique en une seule année, par la guerre ». Le guide montre une carte du Sahara et des routes des caravanes, et rappelle que Ngaoundéré a été fondé au XIXe siècle par des Peuls musulmans.</p>",
      documents: [{ t: "Le pèlerinage de Mansa Moussa (1324)", html: "<p>Le roi du Mali, Mansa Moussa, traverse le Sahara pour se rendre à La Mecque avec une immense caravane. Au Caire, il distribue tant d'or que le prix de ce métal baisse pendant plusieurs années.</p>" },
        { t: "L'Adamaoua au XIXe siècle", html: "<p>En 1804, Ousmane dan Fodio lance un djihad dans le pays haoussa (actuel Nigeria). Son disciple Modibo Adama reçoit en 1806 l'étendard pour étendre l'islam vers le sud-est : naissent les lamidats de l'Adamaoua, dont Garoua, Maroua et Ngaoundéré.</p>" }],
      question: "Comment, par quels chemins et en combien de temps l'islam s'est-il répandu en Afrique jusqu'au Nord-Cameroun ?",
      tache: "Retrace les grandes étapes de l'expansion de l'islam en Afrique, du VIIe siècle au XIXe siècle, et explique son arrivée au Nord-Cameroun.",
      hypotheses: ["L'islam est arrivé au Cameroun par la mer, à Douala, avec des commerçants arabes.", "L'islam s'est répandu en Afrique en une seule fois, en quelques années, par la guerre.", "L'islam s'est répandu en plusieurs siècles : conquête de l'Afrique du Nord au VIIe siècle, puis commerce transsaharien vers les royaumes du Soudan, et au Nord-Cameroun surtout au XIXe siècle, avec les Peuls de l'Adamaoua."]
    },
    parties: [
      { t: "L'islam en Afrique du Nord (VIIe-VIIIe siècle)", html: def("Conquête arabe", "Expansion de l'empire musulman après la mort de Mahomet (632) : les armées des califes conquièrent l'Égypte, puis l'Afrique du Nord, jusqu'à l'Espagne.") +
          "<ul><li>Vers <strong>640-642</strong>, l'Égypte est conquise ; la ville du Caire sera fondée plus tard, au Xe siècle.</li><li>En <strong>670</strong>, les Arabes fondent <strong>Kairouan</strong> (Tunisie), avec sa grande mosquée.</li><li>Les <strong>Berbères</strong>, peuples d'Afrique du Nord, résistent longtemps, puis se convertissent en grand nombre.</li><li>En <strong>711</strong>, des troupes arabes et berbères passent en Espagne.</li></ul>" +
          formule("durée de la conquête = date de fin − date de début") +
          ex("De la conquête de l'Égypte (642) à l'entrée en Espagne (711) : 711 − 642 = 69 ans pour traverser toute l'Afrique du Nord.", "Calculer une durée de conquête") +
          attention("Conquête politique ne veut pas dire conversion immédiate : en Afrique du Nord, il faut plusieurs siècles pour que la majorité des habitants devienne musulmane."),
        planches: [P2("Les étapes de l'islam en Afrique", "Une expansion en trois grands temps, sur plus de mille ans : la conquête du Nord, le commerce à travers le Sahara, puis les royaumes et lamidats du Soudan et du Nord-Cameroun.",
          frise("L'islam en Afrique, du VIIe au XIXe siècle", [{ a: "642", l: ["conquête", "de l'Égypte"], c: "#B07A00" }, { a: "670", l: ["fondation", "de Kairouan"], c: "#C2540A" }, { a: "XIe s.", l: ["rois du Kanem", "et du Ghana"], c: "#17784D" }, { a: "1324", l: ["pèlerinage de", "Mansa Moussa"], c: "#1E499B" }, { a: "1804-1806", l: ["djihad peul,", "Modibo Adama"], c: "#7B3F99" }], 230, "Frise des étapes de l'islam en Afrique"))],
        fil: { html: "<p>Esther se trompe : il faut près de <strong>70 ans</strong> pour conquérir l'Afrique du Nord, et des siècles pour que ses habitants se convertissent. Et au sud du Sahara, ce n'est pas d'abord la guerre qui apporte l'islam, mais le commerce. L'expansion est longue et prend plusieurs formes.</p>", verdicts: [[1, "rejetee", "L'expansion dure plus de mille ans et passe d'abord par le commerce au sud du Sahara."]] },
        retenir: "Égypte (642), Kairouan (670), Berbères, Espagne (711) : la conquête de l'Afrique du Nord prend près de 70 ans." },
      { t: "Le commerce transsaharien et les royaumes du Soudan", html: "<ul><li><strong>Le commerce transsaharien</strong> : des caravanes de dromadaires traversent le Sahara ; elles apportent au sud le sel, les tissus, les livres, et rapportent au nord l'or, l'ivoire et des esclaves.</li><li>Avec les marchands arrivent l'islam, l'écriture arabe et les savants.</li><li><strong>Le Ghana</strong> (XIe siècle) : sa capitale compte une ville des marchands musulmans, à côté de la ville du roi.</li><li><strong>Le Mali</strong> : Mansa Moussa fait le pèlerinage à La Mecque en <strong>1324</strong> ; <strong>Tombouctou</strong> devient un grand centre de savoir, avec la mosquée de <strong>Djingareyber</strong>.</li><li><strong>Le Kanem-Bornou</strong>, autour du lac Tchad, voisin du Cameroun : ses rois deviennent musulmans à partir du XIe siècle.</li></ul>" +
          def("Commerce transsaharien", "Échanges à travers le Sahara, par des caravanes de dromadaires, entre l'Afrique du Nord et les pays du sud du désert (le « Soudan » des géographes arabes)." ) +
          formule("durée d'une traversée = distance ÷ distance parcourue par jour") +
          ex("Une caravane qui parcourt 1 500 km à raison de 30 km par jour met 1 500 ÷ 30 = 50 jours pour traverser le désert.", "Le temps d'une caravane") +
          savais("Le mot « Soudan » vient de l'arabe bilad as-sudan, « le pays des Noirs » : les géographes arabes désignaient ainsi toute la bande de savane au sud du Sahara."),
        planches: [{ type: "3d", titre: "Tombouctou : la mosquée de Djingareyber et une caravane", legende: "Tourne la scène : une mosquée en terre crue (banco), aux murs hérissés de poutres de bois qui servent d'échafaudage pour le crépissage chaque année, et son minaret en forme de pyramide tronquée. Devant, une caravane de dromadaires chargés de sel arrive du désert.", modele: { h: 340, rx: -16, ry: 30, echelle: 0.72, alt: "Mosquée en terre avec poutres de bois saillantes et minaret pyramidal, caravane de dromadaires devant", objets: djingareyber3D(), etiquettes: [{ p: [140, 132, -20], t: "minaret en banco", cote: "d" }, { p: [-60, 46, -74], t: "poutres de bois (toron)", cote: "g" }, { p: [-180, 40, -114], t: "caravane de dromadaires", cote: "g" }, { p: [-90, 14, -120], t: "barres de sel", cote: "d" }] } }],
        fil: { html: "<p>Djibrilla se trompe de chemin : l'islam n'est pas arrivé au Cameroun par la mer à Douala, mais <strong>par le désert</strong>, avec les caravanes du commerce transsaharien, jusqu'aux royaumes du Soudan, puis au Kanem-Bornou, au bord du lac Tchad, aux portes du Nord-Cameroun.</p>", verdicts: [[0, "rejetee", "L'islam est venu par le Sahara et le lac Tchad, pas par la mer à Douala."]] },
        retenir: "Caravanes : or contre sel ; Ghana, Mali (Mansa Moussa, 1324 ; Tombouctou), Kanem-Bornou au lac Tchad." },
      { t: "L'islam au Nord-Cameroun", html: "<ul><li>Par le <strong>Kanem-Bornou</strong>, l'islam touche très tôt le nord de l'actuel Cameroun, autour du lac Tchad.</li><li>Au <strong>XIXe siècle</strong>, les <strong>Peuls</strong> (Foulbé) jouent un rôle décisif : en <strong>1804</strong>, Ousmane dan Fodio lance un djihad dans le pays haoussa.</li><li>En <strong>1806</strong>, son disciple <strong>Modibo Adama</strong> reçoit l'étendard ; il fonde l'émirat de l'<strong>Adamaoua</strong>, qui porte son nom, avec Yola pour capitale.</li><li>Des <strong>lamidats</strong> sont créés : Garoua, Maroua, Ngaoundéré (vers 1835), Tibati, Rey Bouba… Le lamido y exerce le pouvoir politique et religieux.</li></ul>" +
          def("Lamidat", "Territoire dirigé par un lamido, chef politique et religieux musulman, au Nord-Cameroun et dans l'Adamaoua.") +
          formule("âge d'une ville ou d'une institution = 2026 − date de fondation") +
          ex("Le lamidat de Ngaoundéré, fondé vers 1835, a environ 2026 − 1835 = 191 ans.", "Calculer l'âge d'un lamidat") +
          astuce("Le nom « Adamaoua » vient de Modibo Adama : la région porte encore le nom du fondateur de l'émirat."),
        planches: [P2("Trois chemins de l'islam vers le Cameroun", "L'islam arrive au Nord-Cameroun par plusieurs voies, sur plusieurs siècles : le commerce, les royaumes du lac Tchad, puis le djihad peul.",
          colonnes("Comment l'islam arrive au Nord-Cameroun", [{ t: "Le commerce", c: "#B07A00", l: ["caravanes", "marchands haoussa", "→ villes, marchés"] }, { t: "Le Kanem-Bornou", c: "#17784D", l: ["lac Tchad", "rois musulmans", "dès le XIe siècle"] }, { t: "Le djihad peul", c: "#7B3F99", l: ["1804 : dan Fodio", "1806 : Modibo Adama", "→ lamidats"] }], 230, "Trois voies d'arrivée de l'islam au Nord-Cameroun"))],
        fil: { html: "<p>Le guide conclut : l'islam s'est répandu en Afrique en <strong>plusieurs siècles et par plusieurs chemins</strong>. Conquête de l'Afrique du Nord au VIIe siècle, commerce à travers le Sahara, royaumes musulmans du Soudan et du lac Tchad, puis, au XIXe siècle, djihad peul et création des lamidats, dont celui de Ngaoundéré.</p>", verdicts: [[2, "validee", "Conquête du Nord, commerce transsaharien, royaumes du Soudan, puis lamidats peuls du XIXe siècle."]] },
        retenir: "Kanem-Bornou ; 1804 dan Fodio ; 1806 Modibo Adama ; Adamaoua ; lamidats de Garoua, Maroua, Ngaoundéré (vers 1835)." },
      { t: "Entraînement au format de l'examen", html: integ("Le roi du Mali qui fit un célèbre pèlerinage à La Mecque en 1324 est…", ["Modibo Adama", "Mansa Moussa", "Ezana", "Ousmane dan Fodio"], "Mansa Moussa", "Sa caravane distribua tant d'or au Caire que le prix de l'or baissa.", "Cite deux produits échangés dans le commerce transsaharien et deux lamidats du Nord-Cameroun.", "Produits : l'or et le sel (aussi tissus, ivoire). Lamidats : Garoua, Maroua, Ngaoundéré (aussi Tibati, Rey Bouba).", "Un élève de Douala pense que l'islam du Nord-Cameroun est « venu de l'étranger il y a peu de temps ».", "En t'appuyant sur ta leçon, rédige quelques lignes pour lui présenter l'histoire de l'islam au Cameroun.", "L'islam est présent en Afrique depuis le VIIe siècle et il est arrivé au sud du Sahara par le commerce des caravanes. Autour du lac Tchad, les rois du Kanem-Bornou sont musulmans dès le XIe siècle. Au XIXe siècle, le djihad peul de Modibo Adama donne naissance aux lamidats de l'Adamaoua, comme Ngaoundéré, Garoua et Maroua. C'est donc une longue histoire africaine, qui fait partie de l'histoire du Cameroun."), retenir: "Savoir-être : respect de la diversité religieuse et culturelle du Cameroun." }
    ],
    denouement: { titre: "Ce que le guide a expliqué", etapes: ["Au VIIe siècle, l'islam conquiert l'Afrique du Nord en près de 70 ans (indice 1).", "Il traverse le Sahara avec les caravanes jusqu'aux royaumes du Soudan et du lac Tchad (indice 2).", "Au XIXe siècle, le djihad peul crée les lamidats du Nord-Cameroun (indice 3)."],
      formules: [F("Durée d'une conquête", "durée = date de fin − date de début", "711 − 642 = 69 ans"), F("Durée d'une traversée", "durée = distance ÷ distance par jour", "1 500 ÷ 30 = 50 jours"), F("Âge d'un lamidat", "âge = 2026 − date de fondation", "2026 − 1835 = 191 ans")],
      reponse: "<p>L'islam s'est répandu en Afrique en plus de mille ans et par plusieurs chemins. Au VIIe siècle, les armées des califes conquièrent l'Égypte (642) puis toute l'Afrique du Nord jusqu'en 711 ; les Berbères se convertissent peu à peu. Ensuite, l'islam traverse le Sahara avec les caravanes du commerce transsaharien, qui échangent l'or du sud contre le sel du nord : il gagne les royaumes du Ghana, du Mali, où Mansa Moussa fait son pèlerinage en 1324, et du Kanem-Bornou, autour du lac Tchad, aux portes du Cameroun. Au XIXe siècle enfin, le djihad peul d'Ousmane dan Fodio (1804) et de son disciple Modibo Adama (1806) donne naissance à l'Adamaoua et aux lamidats de Garoua, Maroua et Ngaoundéré. L'islam n'est donc pas arrivé par la mer à Douala, ni en une seule fois par la guerre.</p>",
      transfert: "<p>Sur une carte de l'Afrique, trace le chemin d'une caravane de Tombouctou au Caire. Mesure la distance avec l'échelle et calcule le nombre de jours de marche à 30 km par jour.</p>" },
    revision: ["<strong>VIIe-VIIIe siècle</strong> : Égypte (642), Kairouan (670), Berbères, Espagne (711).", "Commerce transsaharien : caravanes de dromadaires, or contre sel.", "Ghana, Mali (Mansa Moussa, 1324 ; Tombouctou, Djingareyber), Kanem-Bornou (lac Tchad).", "1804 : djihad d'Ousmane dan Fodio ; 1806 : Modibo Adama, émirat de l'Adamaoua.", "Lamidats : Garoua, Maroua, Ngaoundéré (vers 1835) ; le lamido, chef politique et religieux.", "Durée d'une traversée = distance ÷ distance par jour."],
    exo: "<p>Range dans l'ordre : fondation de Kairouan, pèlerinage de Mansa Moussa, Modibo Adama reçoit l'étendard, conquête de l'Égypte. <em>(642 ; 670 ; 1324 ; 1806.)</em></p>",
    quiz: [q("L'Égypte est conquise par les Arabes vers…", "642", "1324", "1806", "Dix ans après la mort de Mahomet."), q("Kairouan, fondée en 670, se trouve en…", "Tunisie", "au Mali", "au Cameroun", "Avec sa grande mosquée."), q("Les caravanes transsahariennes utilisaient surtout des…", "dromadaires", "chevaux", "pirogues", "Adaptés au désert."), q("Dans le commerce transsaharien, le sud vendait surtout…", "de l'or", "du sel", "du pétrole", "Contre le sel du nord."), q("Mansa Moussa était roi du…", "Mali", "Kongo", "Kanem", "Pèlerinage à La Mecque en 1324."), q("La mosquée de Djingareyber se trouve à…", "Tombouctou", "Ngaoundéré", "Kairouan", "Construite en terre crue."), q("Le royaume musulman voisin du lac Tchad est le…", "Kanem-Bornou", "Ghana", "Kongo", "Ses rois sont musulmans dès le XIe siècle."), q("Modibo Adama reçoit l'étendard en…", "1806", "1324", "642", "De la main d'Ousmane dan Fodio."), q("Un lamido est…", "un chef politique et religieux musulman", "un marchand de sel", "un roi du Mali", "Il dirige un lamidat."), q("1 500 km à 30 km par jour, cela fait…", "50 jours", "45 jours", "500 jours", "1 500 ÷ 30.")],
    apc: apc("Un élève croit que l'islam est arrivé récemment au Cameroun, par la mer.", "Retracer l'expansion de l'islam en Afrique jusqu'aux lamidats du Nord-Cameroun.")
  });
  VRT_A("6e-histoire-islam-afrique", 1, "Suis la caravane : retrouve chaque étape", function (el) {
    exercice(el, [["Les caravanes apportent au sud du Sahara surtout du ___.", ["sel", "or", "manioc"], "Le sel manque dans les pays du sud."], ["Les pays du sud vendent surtout de l'___.", ["or", "eau", "sel"], "L'or du Soudan est célèbre."], ["La grande ville de savoir du Mali est ___.", ["Tombouctou", "Kairouan", "Garoua"], "Avec ses mosquées et ses bibliothèques."], ["Le royaume musulman du lac Tchad est le ___.", ["Kanem-Bornou", "Ghana", "Mali"], "Voisin du Nord-Cameroun."], ["Le fondateur de l'émirat de l'Adamaoua est ___.", ["Modibo Adama", "Mansa Moussa", "Ezana"], "La région porte son nom."], ["Une caravane qui parcourt 900 km à 30 km par jour met ___ jours.", ["30", "27", "90"], "900 ÷ 30 = 30."]], "Étape suivante", "Étape");
  });

  /* ═══════════════ RANG 13 : DOSSIER 2, LE TRAVAIL DES MÉTAUX ═══════════════ */
  function forge3D() {
    var o = [{ f: "boite", c: [0, -6, 0], d: [480, 6, 260], coul: "#8B6B4A", dessus: "#A0805A" }];
    o.push({ f: "cylindre", c: [-120, 0, 0], r: 40, h: 90, n: 16, coul: "#9A5A34" });
    o.push({ f: "cylindre", c: [-120, 90, 0], r: 22, h: 30, n: 14, coul: "#8A4A2A" });
    o.push({ f: "cylindre", c: [-120, 118, 0], r: 10, h: 12, n: 12, coul: "#F7A94A" });
    o.push({ f: "boite", c: [-120, 14, -42], d: [24, 24, 6], coul: "#E8842C", dessus: "#F7C948" });
    [-60, -10].forEach(function (x) { o.push({ f: "cylindre", c: [x, 0, -90], r: 18, h: 16, n: 14, coul: "#6B4423" }); o.push({ f: "cylindre", c: [x, 16, -90], r: 16, h: 4, n: 14, coul: "#C9A06E" }); o.push({ f: "boite", c: [(x - 120) / 2, 6, -60], d: [Math.abs(x + 120), 5, 5], coul: "#5A3A1E" }); });
    o.push({ f: "boite", c: [100, 20, -10], d: [30, 40, 30], coul: "#4D5163", dessus: "#5A6070" });
    o.push({ f: "boite", c: [100, 46, -10], d: [60, 12, 26], coul: "#3B4252", dessus: "#55555E" });
    o.push({ f: "boite", c: [140, 62, -10], d: [44, 4, 6], coul: "#6B4423" });
    o.push({ f: "boite", c: [164, 62, -10], d: [12, 10, 12], coul: "#3B4252" });
    o.push({ f: "boite", c: [-150, 6, 90], d: [60, 12, 34], coul: "#2E3445", dessus: "#3F3F48" });
    o.push({ f: "boite", c: [100, 4, 70], d: [40, 8, 6], coul: "#55555E" });
    o.push({ f: "boite", c: [130, 4, 84], d: [8, 8, 40], coul: "#55555E" });
    return o;
  }
  VRT_L("6e-histoire-metaux", {
    c: "6e", m: "histoire", cle: "Dossier 2 : Le travail des métaux", titre: "Dossier 2 : Le travail des métaux, du minerai à l'outil", duree: 30,
    accroche: "Chez le forgeron du quartier, à Foumban, une élève demande : « Le fer vient-il des Blancs ? » Le forgeron rit et montre le fourneau de son grand-père. Depuis quand l'Afrique travaille-t-elle les métaux ?",
    intro: "Une visite à l'atelier d'un forgeron de Foumban te sert de fil rouge : à chaque partie, un indice t'aide à trancher entre trois idées sur le travail des métaux en Afrique.",
    objectifs: ["distinguer le cuivre, le bronze et le fer", "décrire les étapes de la métallurgie du fer : minerai, fourneau, forge", "présenter des foyers anciens du travail des métaux en Afrique et au Cameroun", "calculer les proportions d'un alliage et le rendement d'une fonte"],
    enquete: {
      titre: "L'atelier du forgeron de Foumban",
      svg: svg(640, 220, "Atelier de forgeron : un feu de forge, des soufflets en peau, une enclume ; le forgeron frappe une houe rougeoyante devant trois élèves", lin("fmC", ["#F4E2C8", "#E8DFC9"], true),
        "<rect width='640' height='220' fill='url(#fmC)'/><rect y='186' width='640' height='34' fill='#6B4423'/><path d='M40 186V80l90-40l90 40v106' fill='#B5834E' opacity='.5'/>" +
        "<ellipse cx='150' cy='170' rx='36' ry='14' fill='#3B4252'/><path d='M136 170q14 -30 28 0' fill='#F7A94A'/><path d='M142 168q8 -18 16 0' fill='#F7C948'/><rect x='70' y='160' width='40' height='20' rx='10' fill='#8B6B4A'/><rect x='70' y='140' width='40' height='20' rx='10' fill='#A0805A'/>" +
        "<rect x='250' y='150' width='60' height='14' fill='#3B4252'/><rect x='266' y='164' width='28' height='22' fill='#4D5163'/><rect x='262' y='146' width='34' height='6' fill='#E8842C'/>" + perso(310, 96, "#4A2E18", "#8B6B4A", "#4D5163") + "<path d='M320 104L296 132' stroke='#6B4423' stroke-width='4'/>" +
        perso(450, 98, "#5A3A1E", "#C2540A", "#2E3445") + perso(520, 104, "#6B4423", "#1E499B", "#2E3445") + perso(590, 104, "#4A2E18", "#17784D", "#2E3445") +
        bulle(380, 30, 240, "Le fer vient-il des Blancs ?", "#F7C948")),
      legende: "À Foumban, un forgeron montre son atelier à des élèves de 6e.",
      contexte: "<p>Pour leur dossier d'histoire, Ndouma, Rachel et Ibrahim visitent l'atelier de M. Njoya, forgeron à Foumban. Rachel demande si « le fer a été apporté en Afrique par les Européens ». Ibrahim pense que « le bronze et le fer, c'est la même chose ». M. Njoya montre la houe qu'il forge, les soufflets en peau et un vieux fourneau en terre au fond de la cour : « Mon grand-père fondait lui-même le minerai. »</p>",
      documents: [{ t: "Le fer de Nok", html: "<p>Dans le centre de l'actuel Nigeria, voisin du Cameroun, la civilisation de Nok fondait le fer il y a environ 2 500 ans, vers 500 av. J.-C. ; elle est aussi célèbre pour ses statues en terre cuite.</p>" },
        { t: "Les bronzes du Bénin", html: "<p>Du XVe au XVIIIe siècle, les artisans du royaume du Bénin (actuel Nigeria) fondent des plaques et des têtes en bronze et en laiton, par la technique de la cire perdue.</p>" }],
      question: "Depuis quand et comment l'Afrique travaille-t-elle les métaux ?",
      tache: "Distingue les métaux, décris la fabrication du fer, du minerai à l'outil, puis présente des foyers anciens du travail des métaux en Afrique.",
      hypotheses: ["Le fer a été apporté en Afrique par les Européens.", "Le bronze et le fer sont le même métal.", "L'Afrique travaille le cuivre, le bronze et le fer depuis l'Antiquité : on y fondait le fer il y a plus de 2 500 ans, dans des fourneaux de terre, et les forgerons en faisaient des outils et des armes."]
    },
    parties: [
      { t: "Cuivre, bronze et fer", html: def("Métallurgie", "Ensemble des techniques qui permettent d'extraire un métal de son minerai, puis de le travailler pour fabriquer des objets.") +
          "<ul><li><strong>Le cuivre</strong> : un métal rougeâtre, assez mou, travaillé très tôt.</li><li><strong>Le bronze</strong> : un <strong>alliage</strong> de cuivre et d'étain, plus dur que le cuivre ; on le coule dans des moules (statues, bracelets, armes).</li><li><strong>Le fer</strong> : un métal tiré d'un minerai très répandu, plus dur et moins cher, idéal pour les outils (houes, haches, couteaux) et les armes.</li></ul>" +
          def("Alliage", "Mélange de deux métaux ou plus, fondus ensemble, pour obtenir un métal aux qualités nouvelles. Le bronze est un alliage de cuivre et d'étain.") +
          formule("bronze ≈ 9 parts de cuivre + 1 part d'étain (90 % + 10 %)") +
          ex("Pour couler 5 kg de bronze : 5 × 90 ÷ 100 = 4,5 kg de cuivre et 5 × 10 ÷ 100 = 0,5 kg d'étain.", "Calculer un alliage") +
          attention("Le laiton, souvent confondu avec le bronze, est un alliage de cuivre et de zinc."),
        planches: [P2("Trois métaux, trois usages", "Le cuivre, le bronze et le fer n'ont ni les mêmes qualités ni les mêmes usages.",
          colonnes("Cuivre, bronze et fer", [{ t: "Cuivre", c: "#C2540A", l: ["métal pur", "rougeâtre, mou", "→ bijoux, fils"] }, { t: "Bronze", c: "#B07A00", l: ["alliage", "cuivre + étain", "→ statues coulées"] }, { t: "Fer", c: "#4D5163", l: ["minerai abondant", "dur, solide", "→ houes, haches"] }], 210, "Tableau comparant le cuivre, le bronze et le fer"))],
        fil: { html: "<p>Ibrahim se trompe : le bronze n'est pas du fer. C'est un <strong>alliage</strong> de cuivre et d'étain, que l'on coule dans un moule ; le fer, lui, est tiré d'un minerai, puis martelé à la forge. Ce sont deux métaux et deux techniques différentes.</p>", verdicts: [[1, "rejetee", "Le bronze est un alliage de cuivre et d'étain ; le fer est un autre métal."]] },
        retenir: "Cuivre ; bronze = cuivre + étain (≈ 90 % + 10 %) ; fer : minerai abondant, outils et armes." },
      { t: "Du minerai à l'outil : la fabrication du fer", html: "<ul><li><strong>1. Extraire le minerai</strong> : des pierres rouges ou noires riches en fer.</li><li><strong>2. Préparer le charbon de bois</strong> : il fournit la chaleur et aide à retirer l'oxygène du minerai.</li><li><strong>3. Fondre dans un fourneau</strong> en terre : minerai et charbon en couches, soufflets pour attiser le feu, jusqu'à environ 1 200 °C. On obtient une <strong>loupe</strong> de fer mêlée de scories.</li><li><strong>4. Forger</strong> : le forgeron chauffe la loupe, la martèle sur l'enclume pour chasser les scories et donner sa forme à l'outil.</li></ul>" +
          formule("rendement = masse de fer obtenue ÷ masse de minerai × 100") +
          ex("Avec 20 kg de minerai, un fourneau donne 3 kg de fer : 3 ÷ 20 × 100 = 15 %. Il faut donc beaucoup de minerai et de charbon pour une houe.", "Calculer le rendement d'une fonte") +
          astuce("Retiens « Mi-Cha-Fou-For » : Minerai, Charbon, Fourneau, Forge."),
        planches: [{ type: "3d", titre: "Le fourneau et la forge", legende: "Tourne l'atelier : à gauche, le fourneau en terre où l'on fond le minerai avec le charbon de bois, attisé par deux soufflets en peau ; à droite, l'enclume, le marteau, les tenailles et un tas de charbon. Le fer passe du fourneau à la forge pour devenir un outil.", modele: { h: 340, rx: -18, ry: 30, echelle: 0.75, alt: "Fourneau cylindrique en terre avec soufflets, enclume, marteau, tenailles et charbon", objets: forge3D(), etiquettes: [{ p: [-120, 124, 0], t: "fourneau en terre", cote: "g" }, { p: [-35, 22, -90], t: "soufflets en peau", cote: "g" }, { p: [100, 54, -10], t: "enclume et marteau", cote: "d" }, { p: [-150, 16, 90], t: "charbon de bois", cote: "g" }] } }],
        fil: { html: "<p>Le vieux fourneau de la cour le prouve : le grand-père de M. Njoya fondait <strong>lui-même</strong> le minerai, avec du charbon de bois et des soufflets, puis forgeait ses outils. C'est un savoir-faire africain, transmis de génération en génération.</p>", verdicts: [] },
        retenir: "Minerai ; charbon de bois ; fourneau et soufflets (≈ 1 200 °C) ; loupe ; forge et enclume." },
      { t: "Les métaux dans l'histoire africaine", html: "<ul><li><strong>Nok</strong> (Nigeria actuel) : on y fond le fer vers <strong>500 av. J.-C.</strong></li><li><strong>Méroé</strong> (Soudan) : une grande production de fer, prouvée par des collines de scories.</li><li><strong>Le Cameroun</strong> : des fourneaux et des scories anciens ont été retrouvés dans plusieurs régions ; le fer accompagne l'installation des agriculteurs.</li><li><strong>Le bronze et le laiton</strong> : les Sao du lac Tchad et le royaume du Bénin coulent des œuvres célèbres par la <strong>cire perdue</strong>.</li><li><strong>Le forgeron</strong> : dans de nombreuses sociétés africaines, c'est un personnage important, respecté et parfois craint, gardien de savoirs et de rites.</li></ul>" +
          formule("âge d'une technique = date de début (av. J.-C.) + 2026 − 1") +
          ex("Le fer de Nok, vers 500 av. J.-C. : 500 + 2026 − 1 = 2 525 ans, soit plus de deux millénaires et demi de métallurgie africaine.", "Mesurer l'ancienneté du fer africain") +
          savais("À Foumban, la rue des artisans est célèbre pour ses fondeurs de bronze et de laiton, qui utilisent encore la cire perdue."),
        planches: [P2("La métallurgie africaine dans le temps", "Quelques repères de l'histoire des métaux en Afrique, du fer de Nok aux bronzes du Bénin et aux fondeurs de Foumban.",
          frise("Les métaux en Afrique", [{ a: "≈ 500 av. J.-C.", l: ["fer de Nok", "(Nigeria)"], c: "#4D5163" }, { a: "≈ 300 av. J.-C.", l: ["fer de Méroé", "(Soudan)"], c: "#7B3F99" }, { a: "Ier millénaire", l: ["fourneaux", "au Cameroun"], c: "#17784D" }, { a: "XVe-XVIIIe s.", l: ["bronzes", "du Bénin"], c: "#B07A00" }, { a: "aujourd'hui", l: ["fondeurs", "de Foumban"], c: "#C2540A" }], 230, "Frise de la métallurgie en Afrique"))],
        fil: { html: "<p>Rachel se trompe : le fer n'a pas été apporté par les Européens. L'Afrique le fond depuis <strong>plus de 2 500 ans</strong> (Nok, Méroé), le Cameroun a ses fourneaux anciens, et le bronze y est coulé avec art. Le forgeron de Foumban est l'héritier de cette longue histoire.</p>", verdicts: [[0, "rejetee", "L'Afrique fond le fer depuis plus de 2 500 ans."], [2, "validee", "Cuivre, bronze, fer : une métallurgie africaine très ancienne, du fourneau à la forge."]] },
        retenir: "Nok (≈ 500 av. J.-C.), Méroé ; fourneaux au Cameroun ; Sao, Bénin : cire perdue ; le forgeron, personnage important." },
      { t: "Entraînement au format de l'examen", html: integ("Le bronze est un alliage de…", ["fer et cuivre", "cuivre et étain", "or et argent", "fer et charbon"], "Cuivre et étain", "Environ 90 % de cuivre et 10 % d'étain.", "Range dans l'ordre les étapes de la fabrication d'une houe en fer : forger, extraire le minerai, fondre dans le fourneau, préparer le charbon de bois.", "Extraire le minerai ; préparer le charbon de bois ; fondre dans le fourneau ; forger.", "Un camarade affirme que « l'Afrique n'a jamais su fabriquer de métal avant la colonisation ».", "Rédige quelques lignes pour lui répondre avec des exemples précis.", "C'est faux. L'Afrique fond le fer depuis plus de 2 500 ans : à Nok, au Nigeria, vers 500 av. J.-C., puis à Méroé, au Soudan. Au Cameroun, on a retrouvé des fourneaux et des scories anciens. Les Sao du lac Tchad et le royaume du Bénin coulaient des œuvres en bronze par la cire perdue, comme le font encore les fondeurs de Foumban."), retenir: "Savoir-être : fierté éclairée des savoir-faire africains et respect des métiers manuels." }
    ],
    denouement: { titre: "Le dossier des trois élèves", etapes: ["Distinguer les métaux : cuivre, bronze (alliage), fer (indice 1).", "Décrire la chaîne du fer : minerai, charbon, fourneau, forge (indice 2).", "Dater la métallurgie africaine : plus de 2 500 ans (indice 3)."],
      formules: [F("Calculer un alliage", "cuivre = masse × 90 ÷ 100 ; étain = masse × 10 ÷ 100", "5 kg de bronze : 4,5 kg + 0,5 kg"), F("Calculer un rendement", "rendement = fer ÷ minerai × 100", "3 ÷ 20 × 100 = 15 %"), F("Mesurer l'ancienneté", "âge = date av. J.-C. + 2026 − 1", "500 + 2 026 − 1 = 2 525 ans")],
      reponse: "<p>L'Afrique travaille les métaux depuis l'Antiquité. Le cuivre est un métal pur ; le bronze est un alliage de cuivre (environ 90 %) et d'étain (environ 10 %), que l'on coule dans des moules ; le fer est tiré d'un minerai abondant. Pour fabriquer du fer, on extrait le minerai, on prépare du charbon de bois, on fond le tout dans un fourneau en terre attisé par des soufflets, vers 1 200 °C, puis le forgeron martèle la loupe obtenue sur l'enclume pour en faire des houes, des haches ou des armes. Ce savoir est très ancien : on fondait le fer à Nok vers 500 av. J.-C., il y a plus de 2 500 ans, et à Méroé ; des fourneaux anciens ont été retrouvés au Cameroun, et les Sao comme le royaume du Bénin coulaient le bronze par la cire perdue. Le fer n'a donc pas été apporté par les Européens.</p>",
      transfert: "<p>Interroge un forgeron, un fondeur ou un ancien de ton village sur les outils en fer d'autrefois. Note les étapes qu'il décrit et compare-les avec celles de la leçon.</p>" },
    revision: ["<strong>Métallurgie</strong> : extraire un métal de son minerai et le travailler.", "Bronze = alliage de cuivre (≈ 90 %) et d'étain (≈ 10 %) ; laiton = cuivre + zinc.", "Fer : minerai, charbon de bois, fourneau et soufflets (≈ 1 200 °C), loupe, forge.", "Rendement = fer ÷ minerai × 100.", "Nok (≈ 500 av. J.-C.), Méroé ; fourneaux anciens au Cameroun.", "Cire perdue : Sao, Bénin, Foumban ; le forgeron, personnage respecté."],
    exo: "<p>Combien faut-il de cuivre et d'étain pour couler 8 kg de bronze ? <em>(8 × 90 ÷ 100 = 7,2 kg de cuivre ; 8 × 10 ÷ 100 = 0,8 kg d'étain.)</em></p>",
    quiz: [q("Le bronze est un alliage de…", "cuivre et étain", "fer et cuivre", "or et zinc", "Environ 90 % de cuivre."), q("Un alliage est…", "un mélange de métaux fondus ensemble", "un minerai", "un outil", "Il a des qualités nouvelles."), q("Pour fondre le minerai de fer, on utilise surtout…", "du charbon de bois", "de l'eau", "du sable", "Il fournit chaleur et réduction."), q("Les soufflets servent à…", "attiser le feu du fourneau", "refroidir le fer", "peser le minerai", "Plus d'air, plus de chaleur."), q("Le bloc de fer qui sort du fourneau s'appelle…", "une loupe", "une enclume", "un alliage", "Il contient encore des scories."), q("Le forgeron martèle le fer sur…", "une enclume", "un soufflet", "un fourneau", "Pour chasser les scories et former l'outil."), q("Le fer de Nok date d'environ…", "500 av. J.-C.", "1960", "1884", "Il y a plus de 2 500 ans."), q("La technique de la cire perdue sert à couler…", "le bronze et le laiton", "le fer", "le sel", "Sao, Bénin, Foumban."), q("20 kg de minerai donnent 3 kg de fer : le rendement est de…", "15 %", "30 %", "60 %", "3 ÷ 20 × 100."), q("Dans beaucoup de sociétés africaines, le forgeron est…", "un personnage important et respecté", "sans importance", "toujours un étranger", "Gardien de savoirs et de rites.")],
    apc: apc("Une élève pense que le fer a été apporté en Afrique par les Européens.", "Présenter les métaux, la fabrication du fer et l'ancienneté de la métallurgie africaine.")
  });
  VRT_A("6e-histoire-metaux", 1, "Fabrique une houe : remets les étapes dans l'ordre", function (el) {
    exercice(el, [["Première étape : ___ le minerai de fer.", ["extraire", "forger", "vendre"], "On le ramasse ou on le creuse."], ["Deuxième étape : préparer le ___.", ["charbon de bois", "sel", "bronze"], "Il fournit la chaleur."], ["Troisième étape : fondre dans le ___.", ["fourneau", "moule de cire", "grenier"], "Vers 1 200 °C, avec les soufflets."], ["Il en sort une ___ de fer mêlée de scories.", ["loupe", "statue", "pièce de monnaie"], "Un bloc irrégulier."], ["Quatrième étape : ___ sur l'enclume.", ["forger", "fondre", "couler"], "Le forgeron martèle le fer chaud."], ["15 kg de minerai donnent 3 kg de fer : rendement de ___.", ["20 %", "15 %", "45 %"], "3 ÷ 15 × 100 = 20 %."]], "Étape suivante", "Étape");
  });

  /* ═══════════════ RANG 7 : TD 3, LES CIVILISATIONS DU NÉOLITHIQUE AU CAMEROUN ═══════════════ */
  function fouille3D() {
    var o = [{ f: "boite", c: [0, -6, 0], d: [500, 6, 300], coul: "#7A9A4A", dessus: "#8AAA5A" }];
    o.push({ f: "boite", c: [0, -2, 0], d: [300, 4, 200], coul: "#A0784E", dessus: "#B08A5E" });
    for (var i = 0; i <= 3; i++) { o.push({ f: "boite", c: [-150 + i * 100, 4, 0], d: [2, 2, 200], coul: "#F4F1EA", div: false }); }
    for (var j = 0; j <= 2; j++) { o.push({ f: "boite", c: [0, 4, -100 + j * 100], d: [300, 2, 2], coul: "#F4F1EA", div: false }); }
    [[-150, -100], [150, -100], [-150, 100], [150, 100], [-50, -100], [50, -100]].forEach(function (p) { o.push({ f: "cylindre", c: [p[0], 0, p[1]], r: 3, h: 22, n: 8, coul: "#C62828" }); });
    o.push({ f: "cylindre", c: [-100, -20, -50], r: 30, h: 20, n: 16, coul: "#6B4A2E" });
    o.push({ f: "cylindre", c: [-100, 0, -50], r: 12, h: 18, n: 12, coul: "#A0522D" });
    o.push({ f: "boite", c: [0, 4, -50], d: [22, 8, 12], coul: "#5A5A5A", dessus: "#7A7A7A" });
    o.push({ f: "boite", c: [100, 4, 50], d: [40, 6, 26], coul: "#8A8A8A", dessus: "#A8A8A8" });
    o.push({ f: "sphere", c: [10, 6, 50], r: 6, coul: "#3B2A1E" });
    o.push({ f: "sphere", c: [24, 6, 56], r: 5, coul: "#3B2A1E" });
    o.push({ f: "boite", c: [190, 10, -130], d: [30, 20, 20], coul: "#C9A06E", dessus: "#E0C080" });
    return o;
  }
  VRT_L("6e-histoire-td-neolithique-cameroun", {
    c: "6e", m: "histoire", cle: "TD 3 : Les civilisations du Néolithique au Cameroun", titre: "TD 3 : Les civilisations du Néolithique au Cameroun, étude de documents", duree: 35,
    accroche: "Ton professeur distribue trois documents sur des sites archéologiques du Cameroun et demande : « Que nous apprennent-ils sur les premiers villages ? » Comment lire et exploiter un document d'histoire ?",
    intro: "Un travail dirigé en classe, à Yaoundé, te sert de fil rouge : à chaque partie, un indice t'aide à trancher entre trois façons d'exploiter les documents.",
    objectifs: ["présenter un document historique : nature, auteur, date, sujet", "relever des informations dans un document et les classer", "décrire les traces du Néolithique au Cameroun : pierre polie, poterie, fosses, villages", "rédiger un court paragraphe qui croise plusieurs documents"],
    enquete: {
      titre: "Le TD de la 6e C",
      svg: svg(640, 220, "Salle de classe : trois documents affichés au tableau (une photo de hache polie, un dessin de poterie, une carte du Cameroun) ; des élèves travaillent en groupe", lin("tdC", ["#E6EEF8", "#F4F1EA"], true),
        "<rect width='640' height='220' fill='url(#tdC)'/><rect y='186' width='640' height='34' fill='#C9A06E'/><rect x='120' y='14' width='400' height='110' fill='#2E4A3A' stroke='#6B4423' stroke-width='5'/>" +
        "<rect x='140' y='26' width='110' height='84' fill='#F4F1EA'/><path d='M170 92l20 -50l26 6l-16 46Z' fill='#7A7A7A'/>" + txt(195, 106, "Doc. 1", { s: 9 }) +
        "<rect x='265' y='26' width='110' height='84' fill='#F4F1EA'/><path d='M300 96c-14 0 -18 -34 -6 -44h24c12 10 8 44 -6 44Z' fill='#A0522D'/>" + txt(320, 106, "Doc. 2", { s: 9 }) +
        "<rect x='390' y='26' width='110' height='84' fill='#F4F1EA'/><path d='M430 40l20 -6l14 20l-6 30l-20 14l-14 -20Z' fill='#9FC3E8' stroke='#1E499B'/><circle cx='446' cy='76' r='4' fill='#C62828'/><circle cx='452' cy='54' r='4' fill='#C62828'/>" + txt(445, 106, "Doc. 3", { s: 9 }) +
        perso(90, 98, "#5A3A1E", "#7B3F99", "#2E3445") + perso(560, 98, "#6B4423", "#1E499B", "#2E3445") + perso(610, 104, "#4A2E18", "#C2540A", "#2E3445")),
      legende: "À Yaoundé, la 6e C étudie trois documents sur le Néolithique au Cameroun.",
      contexte: "<p>Pour le TD, le groupe de Serge, Mbarga et Clarisse reçoit trois documents : la photo d'une hache en pierre polie, le dessin d'une poterie trouvée dans une fosse à Obobogo, et une carte des sites archéologiques. Serge propose de « recopier les documents sans rien expliquer ». Mbarga veut « raconter ce qu'il imagine, sans regarder les documents ». Clarisse rappelle la méthode apprise en classe : présenter, relever, expliquer, conclure.</p>",
      documents: [{ t: "Document 1 : une hache en pierre polie", html: "<p>Hache en pierre polie trouvée dans le Centre du Cameroun. La pierre a été frottée longuement sur une roche dure et du sable mouillé pour obtenir un tranchant régulier. Sert à abattre les arbres et à défricher.</p>" },
        { t: "Document 2 : les fosses d'Obobogo (Yaoundé)", html: "<p>Les fouilles d'Obobogo ont mis au jour des fosses contenant des tessons de poteries décorées, des meules, des restes de foyers et des noix de palme carbonisées. Ces vestiges ont environ 3 000 ans.</p>" },
        { t: "Document 3 : carte des sites", html: "<p>Sites étudiés : Shum Laka (Nord-Ouest, abri sous roche, outils de pierre, poteries, sépultures) ; Obobogo (Centre, fosses et poteries) ; d'autres sites de villages anciens dans le Centre et le Sud.</p>" }],
      question: "Que nous apprennent ces documents sur les civilisations du Néolithique au Cameroun, et comment les exploiter correctement ?",
      tache: "Présente chaque document, relève ses informations dans un tableau, puis rédige un paragraphe qui décrit la vie des premiers villageois du Cameroun.",
      hypotheses: ["Il suffit de recopier les documents, sans les présenter ni les expliquer.", "On peut raconter ce qu'on imagine, sans s'appuyer sur les documents.", "On présente chaque document (nature, date, lieu), on relève ses informations, on les classe, puis on les croise pour écrire un paragraphe justifié."]
    },
    parties: [
      { t: "Présenter un document historique", html: def("Présenter un document", "Dire en une ou deux phrases sa nature (texte, photo, carte, dessin, objet), son auteur s'il est connu, sa date, son lieu et son sujet.") +
          "<ul><li><strong>Nature</strong> : texte, photographie, carte, dessin, tableau, objet.</li><li><strong>Auteur et source</strong> : qui l'a produit, d'où il vient.</li><li><strong>Date et lieu</strong> : de quand date le document, ou ce qu'il montre.</li><li><strong>Sujet</strong> : de quoi parle le document.</li></ul>" +
          formule("présenter = nature + auteur/source + date + lieu + sujet") +
          ex("Document 2 : un texte qui décrit les résultats des fouilles archéologiques d'Obobogo, à Yaoundé, et présente des vestiges vieux d'environ 3 000 ans : poteries, meules, foyers.", "Présenter le document 2") +
          astuce("Pour présenter un document, réponds à cinq questions : Quoi ? Qui ? Quand ? Où ? De quoi parle-t-il ?"),
        planches: [P2("La méthode du TD en quatre temps", "Les quatre étapes pour exploiter un ou plusieurs documents d'histoire, du TD à l'examen.",
          colonnes("Exploiter un document en quatre temps", [{ t: "1. Présenter", c: "#1E499B", l: ["nature, auteur", "date, lieu, sujet"] }, { t: "2. Relever", c: "#17784D", l: ["les informations", "utiles"] }, { t: "3. Expliquer", c: "#C2540A", l: ["avec la leçon", "les mots-clés"] }, { t: "4. Conclure", c: "#7B3F99", l: ["croiser", "répondre"] }], 200, "Les quatre étapes de l'exploitation d'un document"))],
        fil: { html: "<p>Recopier un document ne sert à rien : il faut d'abord le <strong>présenter</strong>, pour savoir ce qu'il est et ce qu'il peut nous apprendre. Une photo d'objet, un texte de fouilles et une carte ne se lisent pas de la même façon.</p>", verdicts: [[0, "rejetee", "Recopier n'est pas exploiter : il faut présenter, relever et expliquer."]] },
        retenir: "Présenter un document : nature, auteur ou source, date, lieu, sujet." },
      { t: "Relever et classer les informations", html: "<ul><li>On relève <strong>seulement</strong> les informations qui répondent à la question.</li><li>On les classe dans un <strong>tableau</strong> : outils, habitat, alimentation, artisanat.</li><li>On utilise le <strong>vocabulaire de la leçon</strong> : pierre polie, poterie, sédentarisation, agriculture.</li></ul>" +
          def("Pierre polie", "Pierre taillée puis frottée longuement sur une roche dure et du sable mouillé, pour obtenir un tranchant lisse et régulier. C'est la marque du Néolithique.") +
          ex("Hache polie (doc. 1) → outils, défrichement ; poteries et meules (doc. 2) → cuisine, conservation, grains ; noix de palme (doc. 2) → alimentation ; abri sous roche (doc. 3) → habitat ancien.", "Le tableau du groupe") +
          attention("Une information se justifie toujours par le numéro du document : « (doc. 2) ». Sans référence, elle n'est pas prouvée."),
        planches: [{ type: "3d", titre: "Un chantier de fouille au Cameroun", legende: "Tourne le chantier : le sol est quadrillé par des cordeaux et des piquets rouges pour noter la place exacte de chaque objet. Dans un carré, une fosse avec une poterie ; ailleurs, une hache polie, une meule et des noix de palme carbonisées ; au bord, une caisse pour les trouvailles. C'est ainsi que l'on a fouillé Obobogo.", modele: { h: 340, rx: -30, ry: 28, echelle: 0.78, alt: "Chantier de fouille quadrillé par des cordeaux, avec une fosse, une poterie, une hache polie, une meule et des noix", objets: fouille3D(), etiquettes: [{ p: [-100, 20, -50], t: "fosse et poterie", cote: "g" }, { p: [0, 10, -50], t: "hache polie", cote: "d" }, { p: [100, 10, 50], t: "meule", cote: "d" }, { p: [-150, 24, -100], t: "piquets et cordeaux", cote: "g" }] } }],
        fil: { html: "<p>Imaginer sans regarder les documents, c'est raconter une histoire, pas faire de l'histoire. Le groupe relève dans les documents des <strong>preuves</strong> : la hache polie, les poteries, les meules, les noix de palme, l'abri sous roche. Chaque phrase s'appuie sur un document.</p>", verdicts: [[1, "rejetee", "L'historien s'appuie sur les documents, pas sur son imagination."]] },
        retenir: "Relever l'utile ; classer (outils, habitat, alimentation, artisanat) ; citer le document." },
      { t: "Croiser les documents et rédiger", html: "<ul><li><strong>Croiser</strong> : mettre ensemble les informations de plusieurs documents pour répondre à la question.</li><li><strong>Rédiger</strong> un paragraphe : une phrase d'introduction, des informations prouvées par les documents, une phrase de conclusion.</li><li>Les documents du TD montrent qu'il y a environ 3 000 ans, au Cameroun, des hommes vivaient dans des <strong>villages</strong>, cultivaient et récoltaient (meules, noix de palme), fabriquaient des <strong>poteries</strong> et utilisaient des <strong>haches polies</strong> pour défricher.</li></ul>" +
          formule("paragraphe = introduction + informations justifiées (doc.) + conclusion") +
          ex("« Il y a environ 3 000 ans, des agriculteurs vivaient au Cameroun. Ils défrichaient la forêt avec des haches en pierre polie (doc. 1) et écrasaient des graines sur des meules (doc. 2). Ils fabriquaient des poteries décorées (doc. 2) et vivaient dans des villages, comme à Obobogo (doc. 2 et 3). Ce sont des civilisations du Néolithique. »", "Le paragraphe du groupe") +
          savais("Le mot « croiser » vient de l'image de deux chemins qui se rencontrent : deux documents qui disent la même chose rendent une information plus sûre."),
        planches: [P2("Ce que les documents prouvent", "Chaque trace du TD, mise en relation avec une activité des premiers villageois du Cameroun.",
          colonnes("Des traces aux activités", [{ t: "Hache polie", c: "#4D5163", l: ["(doc. 1)", "→ défricher, cultiver"] }, { t: "Poteries, meules", c: "#C2540A", l: ["(doc. 2)", "→ cuire, moudre"] }, { t: "Noix de palme", c: "#17784D", l: ["(doc. 2)", "→ se nourrir"] }, { t: "Fosses, abri", c: "#1E499B", l: ["(doc. 2 et 3)", "→ habiter"] }], 200, "Tableau reliant les traces aux activités des villageois du Néolithique"))],
        fil: { html: "<p>Clarisse a la bonne méthode : présenter chaque document, relever les informations utiles, les <strong>classer</strong> et les <strong>croiser</strong> pour écrire un paragraphe justifié. Les documents montrent des villages d'agriculteurs et de potiers au Cameroun il y a environ 3 000 ans.</p>", verdicts: [[2, "validee", "Présenter, relever, classer, croiser : c'est la méthode du TD."]] },
        retenir: "Croiser les documents ; rédiger : introduction, informations justifiées, conclusion ; villages d'agriculteurs et de potiers il y a ≈ 3 000 ans." },
      { t: "Entraînement au format de l'examen", html: integ("Présenter un document, c'est d'abord indiquer…", ["son prix", "sa nature, sa date, son lieu et son sujet", "ce qu'on en pense", "sa couleur"], "Sa nature, sa date, son lieu et son sujet", "Quoi ? Qui ? Quand ? Où ? De quoi parle-t-il ?", "Relève dans les documents du TD deux preuves d'agriculture et une preuve d'artisanat.", "Agriculture : la hache polie pour défricher (doc. 1), les meules pour moudre les graines (doc. 2), les noix de palme (doc. 2). Artisanat : les poteries décorées (doc. 2).", "Ton cousin ne croit pas que des villages existaient au Cameroun il y a 3 000 ans.", "Rédige un paragraphe de cinq lignes en t'appuyant sur les documents du TD.", "Il y a environ 3 000 ans, des villages existaient déjà au Cameroun. À Obobogo, près de Yaoundé, les archéologues ont trouvé des fosses avec des poteries décorées, des meules et des restes de foyers (doc. 2). Des haches en pierre polie servaient à défricher la forêt (doc. 1). Ces traces prouvent que des agriculteurs et des potiers vivaient ensemble dans des villages."), retenir: "Savoir-être : rigueur dans l'usage des preuves et respect du travail en groupe." }
    ],
    denouement: { titre: "Le TD rendu par le groupe", etapes: ["Présenter chaque document (indice 1).", "Relever et classer les informations, avec la référence du document (indice 2).", "Croiser les documents et rédiger un paragraphe justifié (indice 3)."],
      formules: [F("Présenter", "nature + auteur/source + date + lieu + sujet", "doc. 2 : texte de fouilles, Obobogo, ≈ 3 000 ans"), F("Relever", "information + (doc. n°)", "meules → moudre les graines (doc. 2)"), F("Rédiger", "introduction + informations justifiées + conclusion", "villages d'agriculteurs et de potiers")],
      reponse: "<p>Les documents du TD montrent qu'il y a environ 3 000 ans, des civilisations du Néolithique vivaient au Cameroun. Les habitants défrichaient la forêt avec des haches en pierre polie (doc. 1) ; à Obobogo, près de Yaoundé, ils creusaient des fosses où l'on a retrouvé des poteries décorées, des meules pour moudre les graines, des restes de foyers et des noix de palme carbonisées (doc. 2) ; l'abri sous roche de Shum Laka et d'autres sites témoignent aussi d'une occupation ancienne (doc. 3). Ces hommes étaient donc des agriculteurs et des potiers qui vivaient dans des villages. Pour l'établir, le groupe a présenté chaque document, relevé et classé ses informations, puis les a croisées dans un paragraphe justifié.</p>",
      transfert: "<p>Choisis un objet ancien de ta famille ou de ton village. Présente-le comme un document d'histoire : nature, date approximative, lieu, usage, ce qu'il t'apprend.</p>" },
    revision: ["<strong>Présenter un document</strong> : nature, auteur ou source, date, lieu, sujet.", "Relever l'utile et citer le document : « (doc. 2) ».", "Classer : outils, habitat, alimentation, artisanat.", "Croiser les documents ; rédiger : introduction, informations, conclusion.", "Pierre polie : frottée pour un tranchant lisse ; marque du Néolithique.", "Obobogo (≈ 3 000 ans) : fosses, poteries, meules, foyers, noix de palme ; Shum Laka : abri sous roche."],
    exo: "<p>Présente en une phrase le document 1 du TD. <em>(Photographie d'une hache en pierre polie trouvée dans le Centre du Cameroun, qui servait à abattre les arbres et à défricher.)</em></p>",
    quiz: [q("Présenter un document, c'est indiquer d'abord…", "sa nature, sa date, son lieu, son sujet", "son prix", "son poids", "Quoi ? Qui ? Quand ? Où ? Sujet ?"), q("Une photo d'objet ancien est un document…", "iconographique", "oral", "écrit", "Une image."), q("Pour prouver une information, on cite…", "le numéro du document", "son avis", "un ami", "« (doc. 2) »."), q("La pierre polie est la marque du…", "Néolithique", "Paléolithique", "Moyen Âge", "On frotte la pierre pour un tranchant lisse."), q("À Obobogo, les fosses contenaient…", "des poteries, des meules et des foyers", "des pyramides", "des pièces d'or", "Environ 3 000 ans."), q("Les meules servaient à…", "moudre les graines", "chasser", "écrire", "Signe d'agriculture."), q("Croiser des documents, c'est…", "mettre ensemble leurs informations", "les découper", "n'en garder qu'un", "Pour une information plus sûre."), q("Un paragraphe d'histoire contient…", "une introduction, des informations justifiées, une conclusion", "seulement des dates", "un dessin", "Méthode de rédaction."), q("Shum Laka est…", "un abri sous roche du Nord-Ouest", "une rivière", "un royaume", "Occupé depuis très longtemps."), q("Les vestiges d'Obobogo ont environ…", "3 000 ans", "30 ans", "3 millions d'années", "Villages d'agriculteurs.")],
    apc: apc("Un groupe d'élèves ne sait pas comment exploiter des documents sur le Néolithique au Cameroun.", "Présenter, relever, classer et croiser des documents pour décrire les premiers villages du Cameroun.")
  });
  VRT_A("6e-histoire-td-neolithique-cameroun", 0, "Présente le document : nature, date, lieu, sujet", function (el) {
    exercice(el, [["La photo d'une hache polie est un document de nature ___.", ["iconographique", "orale", "écrite"], "Une image."], ["Le compte rendu des fouilles d'Obobogo est un document ___.", ["écrit", "oral", "iconographique"], "Un texte."], ["Les vestiges d'Obobogo ont environ ___.", ["3 000 ans", "300 ans", "30 000 ans"], "Villages d'agriculteurs."], ["Obobogo se trouve près de ___.", ["Yaoundé", "Garoua", "Kribi"], "Dans le Centre du Cameroun."], ["Pour justifier une information, j'écris ___.", ["(doc. 2)", "« je pense »", "rien"], "On cite le document."], ["Une meule prouve une activité ___.", ["agricole", "de chasse", "de pêche"], "On y écrase les graines."]], "Question suivante", "Question");
  });
})();
