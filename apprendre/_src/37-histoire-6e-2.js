/* Leçons GRATUITES — Histoire de 6e, lot 2 (20/11/2026) : rangs 6 (Néolithique), 8 (Égypte, société structurée),
   10 (avancées scientifiques et techniques de l'Égypte). Même gabarit que 36-histoire-6e.js : situation-problème
   résolue en étapes et formules, 2 planches 2D, 1 planche 3D, simulation, entraînement, quiz de 10. */
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


  /* ═══════════════ RANG 6 : LA CIVILISATION DU NÉOLITHIQUE ═══════════════ */
  function case3D(x, z, r, h, mur, toit) {
    var o = [{ f: "cylindre", c: [x, 0, z], r: r, h: h, n: 14, coul: mur }], n = 10;
    for (var k = 0; k < n; k++) {
      var a = 2 * Math.PI * k / n, b = 2 * Math.PI * (k + 1) / n;
      o.push({ f: "poly", pts: [[x + Math.cos(a) * (r + 6), h, z + Math.sin(a) * (r + 6)], [x, h + r * 1.1, z], [x + Math.cos(b) * (r + 6), h, z + Math.sin(b) * (r + 6)]], coul: k % 2 ? toit : "#B08A4A" });
    }
    return o;
  }
  function village3D() {
    var o = [{ f: "boite", c: [0, -6, 0], d: [480, 6, 280], coul: "#8A9A5B", dessus: "#9AAA6B" }];
    o = o.concat(case3D(-120, 40, 34, 40, "#B5834E", "#C9A65A"), case3D(-20, 80, 30, 36, "#A97A48", "#C9A65A"), case3D(-150, -50, 18, 30, "#8B6B4A", "#B08A4A"));
    [0, 1, 2, 3].forEach(function (k) { o.push({ f: "boite", c: [120, 4, -80 + k * 34], d: [150, 8, 14], coul: "#6B4423", dessus: "#3E7A2E" }); });
    o.push({ f: "boite", c: [60, 6, -110], d: [36, 12, 22], coul: "#C9C2B0", dessus: "#D8D2C0" });
    o.push({ f: "cylindre", c: [40, 0, 20], r: 12, h: 18, n: 12, coul: "#A0522D" });
    o.push({ f: "cylindre", c: [64, 0, 30], r: 9, h: 14, n: 12, coul: "#C46A2B" });
    o.push({ f: "boite", c: [160, 18, 90], d: [44, 22, 16], coul: "#6B4423" });
    o.push({ f: "sphere", c: [184, 30, 90], r: 9, coul: "#6B4423" });
    return o;
  }
  VRT_L("6e-histoire-neolithique", {
    c: "6e", m: "histoire", cle: "La civilisation du Néolithique", titre: "La civilisation du Néolithique : la révolution des premiers villages", duree: 30,
    accroche: "« Nos ancêtres ont toujours cultivé le manioc et vécu au village ! » « Non, il fut un temps où personne ne cultivait rien ! » Quand et comment les hommes sont-ils devenus agriculteurs ?",
    intro: "Une visite au champ du grand-père, près de Bafoussam, te sert de fil rouge : à chaque partie, un indice t'aide à trancher entre trois idées sur la naissance des villages.",
    objectifs: ["définir le Néolithique et dater ses débuts", "expliquer les grands changements : agriculture, élevage, sédentarisation", "décrire les nouvelles techniques : pierre polie, poterie, tissage", "situer le Néolithique en Afrique et au Cameroun"],
    enquete: {
      titre: "Au champ du grand-père",
      svg: svg(640, 220, "Champ de maïs et de haricots près d'une case ; un grand-père tient une houe, deux enfants l'écoutent, un grenier en terre au fond", lin("neC", ["#E6F0DA", "#F4EDE1"], true),
        "<rect width='640' height='220' fill='url(#neC)'/><rect y='170' width='640' height='50' fill='#8B6B4A'/>" +
        [0, 1, 2, 3, 4, 5, 6].map(function (k) { return "<path d='M" + (300 + k * 44) + " 172v-58' stroke='#3E7A2E' stroke-width='5'/><path d='M" + (300 + k * 44) + " 140l-14 -12M" + (300 + k * 44) + " 128l14 -12' stroke='#5A9A3A' stroke-width='4' stroke-linecap='round'/>"; }).join("") +
        "<rect x='40' y='96' width='70' height='74' fill='#B5834E'/><path d='M30 100l45 -40l45 40Z' fill='#C9A65A'/><rect x='150' y='118' width='34' height='52' rx='10' fill='#A97A48'/><path d='M144 120l23 -22l23 22Z' fill='#C9A65A'/>" +
        perso(230, 92, "#4A2E18", "#7B3F99", "#4D5163") + "<path d='M250 120l26 40' stroke='#6B4423' stroke-width='4'/><rect x='268' y='156' width='18' height='8' fill='#8A8A8A'/>" +
        bulle(170, 30, 230, "Il y a 10 000 ans, personne ne cultivait…", "#F7C948")),
      legende: "Près de Bafoussam, un grand-père explique à ses petits-enfants l'histoire de l'agriculture.",
      contexte: "<p>Pendant les vacances, Brenda et son cousin Junior aident leur grand-père au champ. Junior affirme : « Les hommes ont toujours cultivé et vécu au village, comme nous. » Brenda, qui vient d'étudier les premiers hommes, n'est pas d'accord : « Au début, ils étaient chasseurs-cueilleurs. » Junior réplique : « Alors ils sont devenus agriculteurs du jour au lendemain, partout en même temps ! » Le grand-père sourit et montre la houe, le grenier et les pots de terre : « Chacun de ces objets a une longue histoire. »</p>",
      documents: [{ t: "Des dates repères", html: "<p>Au Proche-Orient, les premiers villages d'agriculteurs apparaissent il y a environ 10 000 ans. Dans le Sahara, alors plus vert et plus humide qu'aujourd'hui, des hommes fabriquent des poteries il y a plus de 10 000 ans et élèvent des bœufs quelques milliers d'années plus tard.</p>" },
        { t: "Le Cameroun et les Bantous", html: "<p>D'après les linguistes et les archéologues, il y a environ 4 000 à 5 000 ans, des agriculteurs parlant des langues bantoues sont partis de la région frontalière du Cameroun et du Nigeria et se sont répandus peu à peu vers le centre, l'est et le sud de l'Afrique.</p>" }],
      question: "Quand, comment et où les hommes sont-ils devenus agriculteurs, et qu'est-ce que cela a changé dans leur vie ?",
      tache: "Définis le Néolithique, explique ses grands changements et ses techniques, puis situe-le en Afrique et au Cameroun.",
      hypotheses: ["Les hommes ont toujours cultivé et vécu dans des villages.", "Tous les hommes sont devenus agriculteurs d'un coup, partout en même temps.", "Il y a environ 10 000 ans, les hommes ont commencé, peu à peu et à des époques différentes selon les régions, à cultiver, élever et vivre dans des villages : c'est le Néolithique."]
    },
    parties: [
      { t: "Une révolution : produire sa nourriture", html: def("Néolithique", "« Âge de la pierre nouvelle » (polie). Période qui commence il y a environ 10 000 ans, pendant laquelle les hommes se mettent à produire leur nourriture en cultivant des plantes et en élevant des animaux.") +
          "<ul><li><strong>L'agriculture</strong> : les hommes sèment et récoltent des céréales (blé, orge au Proche-Orient ; mil et sorgho au Sahel) et des tubercules (igname en Afrique de l'Ouest et du Centre).</li><li><strong>L'élevage</strong> : ils domestiquent des animaux (chèvres, moutons, bœufs, chiens).</li><li>On parle de <strong>révolution néolithique</strong> : les hommes passent de la <strong>prédation</strong> (prendre dans la nature) à la <strong>production</strong>.</li></ul>" +
          def("Domestiquer", "Apprivoiser et faire se reproduire une plante ou un animal sauvage pour l'utiliser : il devient dépendant de l'homme.") +
          ex("Un chasseur-cueilleur dépend de la chance de la chasse ; un agriculteur qui garde une partie de ses graines peut ressemer l'année suivante et prévoir sa nourriture.", "Prédateur ou producteur ?") +
          attention("La révolution néolithique n'est pas un événement d'un jour : elle s'étend sur des milliers d'années et commence à des dates différentes selon les régions."),
        planches: [P2("Paléolithique ou Néolithique ?", "Deux façons de vivre : prendre sa nourriture dans la nature, ou la produire. Le passage de l'une à l'autre change toute la vie des hommes.",
          colonnes("Avant et après la révolution néolithique", [{ t: "Paléolithique", c: "#C2540A", l: ["chasse, pêche, cueillette", "nomades", "pierre taillée", "petits groupes", "→ prédateurs"] }, { t: "Néolithique", c: "#17784D", l: ["agriculture, élevage", "sédentaires, villages", "pierre polie, poterie", "populations plus nombreuses", "→ producteurs"] }], 240, "Tableau comparant le Paléolithique et le Néolithique"))],
        fil: { html: "<p>Brenda a raison sur le début : pendant des centaines de milliers d'années, les hommes ont été chasseurs-cueilleurs. L'agriculture n'apparaît qu'il y a environ <strong>10 000 ans</strong>, une durée très courte à l'échelle de l'humanité. Les hommes n'ont donc pas « toujours » cultivé.</p>", verdicts: [[0, "rejetee", "L'agriculture n'a qu'environ 10 000 ans ; avant, les hommes étaient chasseurs-cueilleurs."]] },
        retenir: "Néolithique : il y a environ 10 000 ans ; agriculture et élevage ; de la prédation à la production." },
      { t: "Une nouvelle vie : villages et techniques", html: "<ul><li><strong>La sédentarisation</strong> : pour surveiller les champs, les hommes s'installent dans des villages de cases.</li><li><strong>Les surplus</strong> : quand la récolte dépasse les besoins, on stocke dans des greniers et des jarres ; certains peuvent alors faire un autre métier (potier, tisserand).</li><li><strong>Les techniques</strong> : la <strong>pierre polie</strong> (haches pour défricher), la <strong>poterie</strong> (cuire et conserver), le <strong>tissage</strong>, la meule pour moudre le grain.</li><li><strong>La société</strong> : la population augmente, apparaissent des chefs, des échanges et parfois des conflits pour la terre.</li></ul>" +
          formule("surplus = récolte − consommation du village") +
          ex("Un village récolte 120 paniers de mil et en mange 90 dans l'année : 120 − 90 = 30 paniers de surplus, gardés dans le grenier pour la mauvaise saison ou échangés contre des poteries.", "Calculer un surplus") +
          astuce("Retiens les trois « P » du Néolithique : pierre polie, poterie, production.") +
          savais("Les meules de pierre retrouvées à Obobogo, près de Yaoundé, servaient à écraser des graines : elles témoignent de villages d'agriculteurs d'il y a environ 3 000 ans."),
        planches: [{ type: "3d", titre: "Un village néolithique", legende: "Tourne le village : des cases rondes en terre au toit de paille, un champ en sillons, un grenier, des jarres de terre cuite, une meule de pierre et un animal domestiqué. Tout ce qui fait la vie d'un village est déjà là.", modele: { h: 340, rx: -20, ry: 26, echelle: 0.8, alt: "Village préhistorique avec trois cases rondes, un champ en sillons, des jarres, une meule et un animal", objets: village3D(), etiquettes: [{ p: [-120, 80, 40], t: "case en terre", cote: "g" }, { p: [120, 14, -30], t: "champ cultivé", cote: "d" }, { p: [52, 24, 24], t: "jarres de poterie", cote: "g" }, { p: [60, 16, -110], t: "meule de pierre", cote: "d" }, { p: [172, 34, 90], t: "animal domestiqué", cote: "d" }] } }],
        fil: { html: "<p>Le grenier, la houe et les pots de terre du grand-père sont les héritiers du Néolithique. Mais ces inventions ne sont pas apparues partout en même temps : elles se sont <strong>diffusées lentement</strong>, sur des milliers d'années, et certaines régions les ont inventées de leur côté.</p>", verdicts: [[1, "rejetee", "Le Néolithique s'est diffusé lentement, à des époques différentes selon les régions."]] },
        retenir: "Sédentarisation ; surplus = récolte − consommation ; pierre polie, poterie, tissage." },
      { t: "Le Néolithique en Afrique et au Cameroun", html: "<ul><li><strong>Le Sahara vert</strong> : il y a environ 10 000 ans, le Sahara était plus humide ; des hommes y fabriquaient déjà des poteries et y ont ensuite élevé des bœufs (peintures rupestres du Tassili).</li><li><strong>Des plantes africaines</strong> : le mil, le sorgho et le riz africain au Sahel, l'igname et le palmier à huile dans les régions forestières.</li><li><strong>Au Cameroun</strong> : à Shum Laka apparaissent pierre polie et poterie ; à Obobogo, des villages avec meules et poteries il y a environ 3 000 ans.</li><li><strong>L'expansion bantoue</strong> : il y a environ 4 000 à 5 000 ans, des agriculteurs partis de la frontière Cameroun–Nigeria se répandent vers le sud et l'est de l'Afrique.</li></ul>" +
          formule("âge d'un site = 2026 − date du site (en années après J.-C.) ou nombre d'années « il y a »") +
          ex("Des villages d'Obobogo datés d'environ 3 000 ans remontent à vers 1000 av. J.-C. : 3 000 − 2 026 ≈ 974, soit environ le Xe siècle avant J.-C.", "Passer de « il y a » à « av. J.-C. »") +
          astuce("Quand tu entends « Bantou », pense à un mot (« ba-ntu » signifie « les hommes » dans beaucoup de ces langues) et à une famille de langues partie de chez nous."),
        planches: [P2("La diffusion de l'agriculture en Afrique", "Quelques foyers et quelques dates de l'agriculture africaine : chaque région a ses plantes, et l'expansion bantoue part de la frontière du Cameroun et du Nigeria.",
          colonnes("Les débuts de l'agriculture en Afrique", [{ t: "Sahara vert", c: "#C2540A", l: ["≈ 10 000 ans : poterie", "puis élevage de bœufs", "→ peintures du Tassili"] }, { t: "Sahel", c: "#B07A00", l: ["mil, sorgho", "riz africain", "→ greniers en terre"] }, { t: "Forêts", c: "#17784D", l: ["igname", "palmier à huile", "→ défrichement"] }, { t: "Cameroun", c: "#1E499B", l: ["Shum Laka, Obobogo", "expansion bantoue", "≈ 4 000-5 000 ans"] }], 220, "Les débuts de l'agriculture dans quatre régions d'Afrique"))],
        fil: { html: "<p>Le grand-père conclut : l'agriculture est née il y a environ 10 000 ans, <strong>à plusieurs endroits et à des époques différentes</strong> ; en Afrique, chaque région a domestiqué ses propres plantes, et le Cameroun est le point de départ des agriculteurs bantous. Les villages, les greniers et les poteries viennent de cette révolution.</p>", verdicts: [[2, "validee", "Une révolution lente, née il y a environ 10 000 ans, à des dates différentes selon les régions."]] },
        retenir: "Sahara vert ; mil, sorgho, igname ; Shum Laka, Obobogo ; expansion bantoue depuis la frontière Cameroun-Nigeria." },
      { t: "Entraînement au format de l'examen", html: integ("Le Néolithique est marqué par…", ["l'invention de l'écriture", "l'apparition de l'agriculture et de l'élevage", "la disparition des dinosaures", "la découverte du feu"], "L'apparition de l'agriculture et de l'élevage", "Les hommes deviennent producteurs, il y a environ 10 000 ans.", "Cite trois techniques nouvelles du Néolithique et dis à quoi elles servent.", "La pierre polie (haches pour défricher), la poterie (cuire et conserver les aliments), le tissage (fabriquer des vêtements) ; la meule (moudre le grain).", "Ton village a récolté 200 sacs de maïs ; ses habitants en consomment 150 dans l'année.", "Calcule le surplus et explique, comme au Néolithique, ce que le village peut en faire.", "200 − 150 = 50 sacs de surplus. Le village peut les stocker dans des greniers pour la saison sèche, les échanger contre d'autres produits, ou nourrir ceux qui font un autre métier : c'est ce qui a permis, au Néolithique, l'apparition des artisans et des échanges."), retenir: "Savoir-être : respect du travail de la terre et des savoir-faire des anciens." }
    ],
    denouement: { titre: "Ce que le grand-père a appris aux enfants", etapes: ["Situer : l'agriculture n'a qu'environ 10 000 ans ; avant, les hommes étaient chasseurs-cueilleurs (indice 1).", "Comprendre : elle s'est diffusée lentement, avec la pierre polie, la poterie et les villages (indice 2).", "Localiser : en Afrique, chaque région a ses plantes ; l'expansion bantoue part du Cameroun (indice 3)."],
      formules: [F("Définir", "Néolithique = agriculture + élevage + villages", "de la prédation à la production"), F("Calculer un surplus", "surplus = récolte − consommation", "120 − 90 = 30 paniers"), F("Dater", "« il y a 3 000 ans » ≈ 3 000 − 2 026 ≈ 974 av. J.-C.", "Obobogo, vers le Xe siècle av. J.-C.")],
      reponse: "<p>Les hommes n'ont pas toujours cultivé. Pendant le Paléolithique, ils étaient chasseurs-cueilleurs et nomades. Il y a environ 10 000 ans commence le Néolithique : ils se mettent à cultiver des plantes et à élever des animaux, passant de la prédation à la production. Ils se sédentarisent dans des villages, stockent leurs surplus dans des greniers et des jarres, polissent la pierre, fabriquent des poteries et tissent. Cette révolution n'a pas eu lieu d'un coup ni partout en même temps : elle s'est étendue sur des milliers d'années. En Afrique, le Sahara alors vert connaît très tôt la poterie et l'élevage ; le Sahel domestique le mil et le sorgho, les forêts l'igname et le palmier à huile. Au Cameroun, Shum Laka et Obobogo en gardent les traces, et c'est de la frontière du Cameroun et du Nigeria que sont partis, il y a 4 000 à 5 000 ans, les agriculteurs bantous.</p>",
      transfert: "<p>Cherche dans ta famille ou ton village un objet hérité du Néolithique (houe, jarre, meule, grenier, panier tressé). Décris-le et explique à quoi il sert.</p>" },
    revision: ["<strong>Néolithique</strong> : âge de la pierre polie, commence il y a environ 10 000 ans.", "Agriculture et élevage : de la prédation à la production.", "Sédentarisation : villages, greniers ; surplus = récolte − consommation.", "Techniques : pierre polie, poterie, tissage, meule.", "Afrique : Sahara vert, mil, sorgho, igname, palmier à huile.", "Cameroun : Shum Laka, Obobogo ; expansion bantoue depuis la frontière Cameroun-Nigeria."],
    exo: "<p>Classe : chasse, poterie, cueillette, élevage, pierre taillée, pierre polie. <em>(Paléolithique : chasse, cueillette, pierre taillée ; Néolithique : poterie, élevage, pierre polie.)</em></p>",
    quiz: [q("Le Néolithique commence il y a environ…", "10 000 ans", "1 000 ans", "7 millions d'années", "Avec l'agriculture et l'élevage."), q("Néolithique signifie…", "âge de la pierre nouvelle (polie)", "âge du fer", "âge de la pierre taillée", "Néo = nouveau, lithos = pierre."), q("Domestiquer un animal, c'est…", "l'apprivoiser et le faire se reproduire pour l'utiliser", "le chasser", "le peindre sur un rocher", "Il dépend alors de l'homme."), q("La sédentarisation, c'est…", "s'installer durablement dans un village", "se déplacer sans cesse", "chasser en groupe", "Pour surveiller les champs."), q("Un village récolte 80 sacs et en consomme 60 : le surplus est de…", "20 sacs", "140 sacs", "60 sacs", "80 − 60 = 20."), q("La poterie sert surtout à…", "cuire et conserver les aliments", "chasser", "écrire", "Jarres et pots de terre cuite."), q("Plante domestiquée dans les forêts d'Afrique :", "l'igname", "le blé", "la pomme de terre", "Avec le palmier à huile."), q("Le mil et le sorgho ont été domestiqués…", "au Sahel", "en Europe", "en Amérique", "Céréales africaines."), q("L'expansion bantoue part…", "de la frontière Cameroun-Nigeria", "d'Égypte", "du Maroc", "Il y a environ 4 000 à 5 000 ans."), q("Les meules d'Obobogo servaient à…", "écraser des graines", "tailler des pierres", "faire du feu", "Signe de villages d'agriculteurs.")],
    apc: apc("Un élève pense que l'agriculture a toujours existé et que les villages sont aussi anciens que l'homme.", "Expliquer la naissance de l'agriculture et des villages au Néolithique.")
  });
  VRT_A("6e-histoire-neolithique", 1, "Paléolithique ou Néolithique ? Trie les inventions", function (el) {
    exercice(el, [["Une hache de pierre polie pour défricher appartient au ___.", ["Néolithique", "Paléolithique", "Moyen Âge"], "La pierre polie caractérise le Néolithique."], ["Un groupe nomade qui suit le gibier vit au ___.", ["Paléolithique", "Néolithique", "XXe siècle"], "Chasseurs-cueilleurs nomades."], ["Une jarre en terre cuite pour garder le mil date du ___.", ["Néolithique", "Paléolithique", "temps des dinosaures"], "La poterie sert à conserver les récoltes."], ["Un biface taillé appartient au ___.", ["Paléolithique", "Néolithique", "Néolithique tardif"], "Pierre taillée."], ["Un grenier rempli après la récolte montre un ___.", ["surplus", "nomadisme", "fossile"], "Récolte − consommation > 0."], ["Garder des chèvres dans un enclos, c'est l'___.", ["élevage", "cueillette", "chasse"], "Une invention du Néolithique."]], "Invention suivante", "Invention");
  });

  /* ═══════════════ RANG 8 : L'ÉGYPTE, UNE SOCIÉTÉ STRUCTURÉE ═══════════════ */
  function pyramideSociale3D() {
    var o = [{ f: "boite", c: [0, -6, 0], d: [460, 6, 260], coul: "#D8C49A", dessus: "#E8D8B0" }];
    var n = [["#8B6B4A", "#A6885E", 380], ["#B07A00", "#C9962A", 300], ["#7B3F99", "#9A5FB8", 220], ["#1E499B", "#3F68B8", 140], ["#C9962A", "#F7C948", 70]];
    n.forEach(function (c, i) { o.push({ f: "boite", c: [0, 18 + i * 36, 0], d: [c[2], 36, c[2] * 0.55], coul: c[0], dessus: c[1] }); });
    o.push({ f: "boite", c: [-200, 10, -110], d: [40, 20, 24], coul: "#5A8A3A", dessus: "#6FA04A" });
    o.push({ f: "boite", c: [200, 4, -110], d: [60, 8, 20], coul: "#4A8AC8", dessus: "#6FA8DC" });
    return o;
  }
  VRT_L("6e-histoire-egypte-societe", {
    c: "6e", m: "histoire", cle: "L’Egypte : une société structurée", titre: "L'Égypte ancienne : une société structurée autour du pharaon", duree: 30,
    accroche: "« En Égypte, il n'y avait que le pharaon et des esclaves qui construisaient les pyramides ! » Est-ce vraiment ainsi qu'était organisée la société égyptienne ?",
    intro: "La préparation d'une pièce de théâtre sur l'Égypte ancienne, dans un collège de Maroua, te sert de fil rouge : à chaque partie, un indice t'aide à trancher entre trois images de la société égyptienne.",
    objectifs: ["expliquer le rôle du Nil dans la naissance de l'Égypte", "décrire le pouvoir du pharaon", "présenter les groupes sociaux sous forme de pyramide", "calculer des durées avant Jésus-Christ"],
    enquete: {
      titre: "La pièce de théâtre du collège",
      svg: svg(640, 220, "Scène de théâtre scolaire : un élève costumé en pharaon avec une coiffe rayée, un scribe assis, un paysan avec une houe ; décor du Nil et d'une pyramide", lin("egC", ["#FBEFD8", "#F0DDB0"], true),
        "<rect width='640' height='220' fill='url(#egC)'/><rect y='150' width='640' height='18' fill='#4A8AC8'/><rect y='168' width='640' height='52' fill='#6B4423'/><path d='M470 150L540 60L610 150Z' fill='#D8B47A' stroke='#B08A4A' stroke-width='2'/><path d='M500 150L540 100L580 150' fill='none' stroke='#B08A4A'/>" +
        perso(120, 66, "#6B4423", "#F4F1EA", "#F4F1EA") + "<path d='M108 54L120 40L132 54L136 74H104Z' fill='#1E499B'/><path d='M110 56h20M108 62h24M106 68h28' stroke='#F7C948' stroke-width='3'/>" +
        perso(250, 74, "#5A3A1E", "#F4F1EA", "#F4F1EA") + "<rect x='262' y='112' width='26' height='18' fill='#E8DFC9' stroke='#B08A4A'/>" + perso(370, 74, "#4A2E18", "#C9A06E", "#8B6B4A") + "<path d='M390 100l20 44' stroke='#6B4423' stroke-width='4'/>" +
        bulle(20, 16, 200, "Que le pharaon et des esclaves ?", "#F7C948")),
      legende: "À Maroua, des élèves de 6e répètent une pièce de théâtre sur l'Égypte ancienne.",
      contexte: "<p>Pour la fête du collège, la classe de 6e prépare une pièce sur l'Égypte ancienne. Abdoulaye veut seulement deux sortes de personnages : « le pharaon, et des esclaves qui construisent les pyramides ». Fadimatou propose au contraire : « Tous les Égyptiens étaient égaux, chacun faisait ce qu'il voulait. » Le professeur distribue deux documents et demande de répartir les rôles selon <strong>la vraie organisation</strong> de la société égyptienne.</p>",
      documents: [{ t: "Hérodote, historien grec (Ve siècle av. J.-C.)", html: "<p>« L'Égypte est un don du Nil. »</p>" },
        { t: "Les ouvriers de Deir el-Médineh", html: "<p>Près de Thèbes, les archéologues ont retrouvé le village des artisans qui creusaient et décoraient les tombes royales : ils étaient payés en grain, en poisson et en huile, avaient des familles et des jours de repos.</p>" }],
      question: "Comment la société de l'Égypte ancienne était-elle organisée, et pourquoi autour du Nil et du pharaon ?",
      tache: "Explique le rôle du Nil, décris le pouvoir du pharaon, puis répartis les rôles de la pièce dans une pyramide sociale.",
      hypotheses: ["La société égyptienne n'avait que deux groupes : le pharaon et des esclaves.", "Tous les Égyptiens étaient égaux et faisaient ce qu'ils voulaient.", "La société égyptienne était organisée en pyramide : le pharaon au sommet, puis les vizirs, prêtres et scribes, les artisans et soldats, et à la base la masse des paysans ; les esclaves étaient peu nombreux."]
    },
    parties: [
      { t: "Le Nil, à l'origine de l'Égypte", html: def("Crue du Nil", "Montée annuelle des eaux du Nil, de juillet à octobre environ : le fleuve déborde et dépose sur ses rives un limon noir et fertile.") +
          "<ul><li>L'Égypte est un pays de désert traversé par le Nil : la vie se concentre sur une étroite bande de terres fertiles, la <strong>vallée</strong>, et dans le <strong>delta</strong>.</li><li>Après la crue, les paysans sèment dans le limon : blé, orge, lin, légumes.</li><li>Pour partager l'eau et les terres, il faut une <strong>organisation</strong> : canaux, digues, calendrier, chefs.</li><li>Vers <strong>3100 av. J.-C.</strong>, la Haute et la Basse-Égypte sont <strong>unifiées</strong> sous un seul roi : c'est le début de l'Égypte des pharaons.</li></ul>" +
          formule("durée entre une date av. J.-C. et une date apr. J.-C. = date av. + date apr. − 1") +
          ex("De l'unification (3100 av. J.-C.) à 2026 : 3 100 + 2 026 − 1 = 5 125 ans.", "Calculer l'âge de l'Égypte unifiée") +
          savais("Les Égyptiens appelaient leur pays Kemet, « la Terre noire », à cause du limon déposé par le Nil, par opposition au désert, « la Terre rouge »."),
        planches: [P2("Le Nil, une bande de vie dans le désert", "Le désert d'un côté, le désert de l'autre : seule la vallée inondée par la crue peut être cultivée. Les trois saisons égyptiennes suivent le fleuve.",
          colonnes("Les trois saisons du Nil", [{ t: "Akhet : l'inondation", c: "#1E499B", l: ["juillet à octobre", "le Nil déborde", "→ dépôt de limon"] }, { t: "Peret : la germination", c: "#17784D", l: ["novembre à février", "semailles", "→ blé, orge, lin"] }, { t: "Shemou : la récolte", c: "#B07A00", l: ["mars à juin", "moisson, greniers", "→ impôts en grain"] }], 220, "Les trois saisons du calendrier égyptien liées au Nil"))],
        fil: { html: "<p>« L'Égypte est un don du Nil » : sans la crue, pas de récoltes ; sans organisation pour partager l'eau et les terres, pas d'Égypte. Une société où « chacun fait ce qu'il veut » n'aurait pas pu creuser les canaux ni stocker le grain : il fallait des <strong>chefs</strong> et des règles.</p>", verdicts: [[1, "rejetee", "Partager l'eau du Nil exigeait une organisation forte et hiérarchisée."]] },
        retenir: "L'Égypte, don du Nil : crue, limon, organisation ; unification vers 3100 av. J.-C." },
      { t: "Le pharaon, roi et dieu", html: def("Pharaon", "Roi de l'Égypte ancienne, considéré comme un dieu vivant, fils du dieu Rê, qui possède toutes les terres et détient tous les pouvoirs.") +
          "<ul><li><strong>Pouvoir politique</strong> : il fait les lois, lève les impôts, nomme les fonctionnaires.</li><li><strong>Pouvoir militaire</strong> : il commande l'armée.</li><li><strong>Pouvoir religieux</strong> : il est le grand prêtre de tous les dieux et maintient l'ordre du monde (la <em>maât</em>).</li><li><strong>Les symboles</strong> : la double couronne (Haute et Basse-Égypte), le sceptre et le fouet (flagellum), la barbe postiche, le cobra (uræus) sur le front.</li></ul>" +
          ex("Comme un chef traditionnel porte des insignes (chasse-mouches, bonnet, siège sculpté) qui montrent son autorité, le pharaon porte des symboles qui montrent ses pouvoirs.", "Des symboles du pouvoir") +
          astuce("Pour retenir les pouvoirs du pharaon, pense à « LAR » : Loi (politique), Armée (militaire), Religion (religieux).") +
          attention("Le pharaon ne gouverne pas seul : il s'appuie sur le vizir, son premier ministre, et sur des milliers de scribes et de fonctionnaires."),
        planches: [P2("Les symboles du pharaon", "Chaque objet porté par le pharaon rappelle l'un de ses pouvoirs : unir les deux Égypte, guider et punir, être un dieu protégé par le cobra.",
          colonnes("Les insignes du pharaon et leur sens", [{ t: "Double couronne", c: "#C62828", l: ["blanche + rouge", "→ roi des deux Égypte"] }, { t: "Sceptre et fouet", c: "#1E499B", l: ["crosse et flagellum", "→ guider et punir"] }, { t: "Cobra (uræus)", c: "#B07A00", l: ["sur le front", "→ protection divine"] }, { t: "Barbe postiche", c: "#7B3F99", l: ["portée même par", "une femme pharaon", "→ signe divin"] }], 210, "Quatre insignes du pharaon et leur signification"))],
        fil: { html: "<p>Le pharaon est au sommet, avec tous les pouvoirs. Mais il gouverne avec un <strong>vizir</strong>, des prêtres et des scribes qui comptent les récoltes et lèvent les impôts. La pièce ne peut donc pas se réduire à « un pharaon et des esclaves » : il faut aussi ces personnages.</p>", verdicts: [] },
        retenir: "Pharaon : roi-dieu ; pouvoirs politique, militaire, religieux ; double couronne, sceptre, cobra." },
      { t: "Une société en pyramide", html: "<ul><li><strong>Au sommet</strong> : le pharaon et sa famille.</li><li><strong>Les grands</strong> : le vizir, les nobles, les grands prêtres, les chefs de l'armée.</li><li><strong>Les scribes</strong> : ils savent lire et écrire, tiennent les comptes, recensent les récoltes et les impôts.</li><li><strong>Les artisans, soldats et marchands</strong>.</li><li><strong>La base, très nombreuse</strong> : les paysans, qui cultivent les terres, paient l'impôt en nature et travaillent aux grands chantiers pendant la crue (corvée).</li><li><strong>Les esclaves</strong>, surtout des prisonniers de guerre, sont peu nombreux.</li></ul>" +
          formule("pyramide sociale : peu de personnes et beaucoup de pouvoir en haut ; beaucoup de personnes et peu de pouvoir en bas") +
          ex("Les pyramides n'ont pas été bâties surtout par des esclaves : les fouilles montrent des équipes d'ouvriers et de paysans, nourris et logés près des chantiers, souvent pendant la crue, quand les champs étaient sous l'eau.", "Qui a construit les pyramides ?") +
          astuce("Dessine un triangle et range les groupes du haut vers le bas : plus on monte, moins il y a de monde et plus il y a de pouvoir."),
        planches: [{ type: "3d", titre: "La pyramide de la société égyptienne", legende: "Tourne la pyramide : chaque étage est un groupe social. Le pharaon au sommet, puis les grands (vizir, prêtres, nobles), les scribes, les artisans et soldats, et à la base la grande masse des paysans. Au pied, un champ et le Nil, d'où vient la richesse de tous.", modele: { h: 360, rx: -26, ry: 28, echelle: 0.6, alt: "Pyramide à cinq étages colorés posée sur le sable, avec un champ et un bras du Nil au pied", objets: pyramideSociale3D(), etiquettes: [{ p: [0, 184, -10], t: "le pharaon", cote: "d" }, { p: [-60, 144, -40], t: "vizir, prêtres, nobles", cote: "g" }, { p: [100, 108, -62], t: "scribes", cote: "d" }, { p: [-140, 72, -84], t: "artisans, soldats", cote: "g" }, { p: [120, 30, -106], t: "paysans : la base", cote: "d" }] } }],
        fil: { html: "<p>La classe peut distribuer les rôles : un pharaon, un vizir, un prêtre, un scribe, des artisans, des soldats et beaucoup de paysans, avec peut-être un prisonnier de guerre. Les ouvriers de Deir el-Médineh, payés et vivant en famille, n'étaient pas des esclaves : la société égyptienne était une <strong>pyramide</strong>, pas un face-à-face.</p>", verdicts: [[0, "rejetee", "Les esclaves étaient peu nombreux ; les paysans formaient la base de la société."], [2, "validee", "Une société hiérarchisée en pyramide, du pharaon aux paysans."]] },
        retenir: "Pharaon ; vizir, prêtres, nobles ; scribes ; artisans et soldats ; paysans (base) ; peu d'esclaves." },
      { t: "Entraînement au format de l'examen", html: integ("Dans la société égyptienne, la base la plus nombreuse était formée par…", ["les scribes", "les prêtres", "les paysans", "les esclaves"], "Les paysans", "Ils cultivaient les terres et payaient l'impôt en nature.", "Cite les trois pouvoirs du pharaon et un symbole de ce pouvoir.", "Politique (lois, impôts), militaire (armée), religieux (grand prêtre) ; symboles : double couronne, sceptre et fouet, cobra, barbe postiche.", "Ton cousin affirme que les pyramides ont été construites uniquement par des esclaves maltraités.", "En t'appuyant sur ta leçon, rédige quelques lignes pour corriger son idée.", "Les fouilles montrent que les pyramides ont surtout été bâties par des équipes d'ouvriers et de paysans, nourris et logés près des chantiers, souvent pendant la crue du Nil, quand les champs étaient inondés. Les ouvriers de Deir el-Médineh étaient payés et vivaient en famille. Les esclaves, surtout des prisonniers de guerre, étaient peu nombreux dans la société égyptienne."), retenir: "Savoir-être : sens de l'organisation et respect du travail de chacun." }
    ],
    denouement: { titre: "Les rôles de la pièce", etapes: ["Partir du Nil : la crue impose une organisation forte (indice 1).", "Placer le pharaon au sommet, entouré du vizir, des prêtres et des scribes (indice 2).", "Construire la pyramide sociale jusqu'aux paysans, avec peu d'esclaves (indice 3)."],
      formules: [F("Dater", "durée = date av. J.-C. + date apr. J.-C. − 1", "3 100 + 2 026 − 1 = 5 125 ans"), F("Hiérarchiser", "pyramide sociale : peu en haut, beaucoup en bas", "pharaon → grands → scribes → artisans → paysans"), F("Répartir les rôles", "1 pharaon, 1 vizir, prêtres, scribes, artisans, soldats, beaucoup de paysans", "pas « un pharaon et des esclaves »")],
      reponse: "<p>La société de l'Égypte ancienne est née du Nil : sa crue annuelle dépose un limon fertile, mais partager l'eau et les terres exige une organisation forte. Vers 3100 av. J.-C., le pays est unifié sous un pharaon, roi considéré comme un dieu, qui détient les pouvoirs politique, militaire et religieux. Il gouverne avec un vizir, des prêtres et des scribes. La société forme une pyramide : au sommet le pharaon, puis les grands, les scribes, les artisans et les soldats, et à la base la masse des paysans, qui cultivent la terre, paient l'impôt en grain et travaillent aux grands chantiers. Les esclaves, surtout des prisonniers de guerre, sont peu nombreux. Pour la pièce, il faut donc un pharaon, un vizir, des prêtres, des scribes, des artisans, des soldats et de nombreux paysans.</p>",
      transfert: "<p>Compare la pyramide sociale égyptienne avec l'organisation d'une chefferie traditionnelle de ta région : qui est au sommet ? qui conseille ? qui travaille la terre ?</p>" },
    revision: ["<strong>L'Égypte, don du Nil</strong> : crue de juillet à octobre, limon fertile.", "Unification vers 3100 av. J.-C. : début des pharaons.", "Pharaon : roi-dieu, pouvoirs politique, militaire, religieux.", "Symboles : double couronne, sceptre et fouet, cobra, barbe postiche.", "Pyramide sociale : pharaon, grands, scribes, artisans et soldats, paysans.", "Esclaves peu nombreux ; pyramides bâties surtout par des ouvriers et des paysans."],
    exo: "<p>Combien d'années séparent l'unification de l'Égypte (3100 av. J.-C.) de la construction de la pyramide de Khéops (vers 2560 av. J.-C.) ? <em>(3 100 − 2 560 = 540 ans.)</em></p>",
    quiz: [q("« L'Égypte est un don du Nil » est une phrase de…", "Hérodote", "Toumaï", "Ramsès", "Historien grec du Ve siècle av. J.-C."), q("La crue du Nil dépose…", "un limon noir et fertile", "du sable", "de l'or", "Les paysans y sèment après la crue."), q("L'Égypte est unifiée vers…", "3100 av. J.-C.", "2026 apr. J.-C.", "10 000 av. J.-C.", "Haute et Basse-Égypte réunies."), q("Le pharaon était considéré comme…", "un dieu vivant", "un simple paysan", "un esclave", "Fils du dieu Rê."), q("Le premier ministre du pharaon s'appelle…", "le vizir", "le scribe", "le griot", "Il dirige l'administration."), q("Les scribes savaient…", "lire, écrire et compter", "seulement chasser", "construire des pirogues", "Ils tenaient les comptes de l'État."), q("La base la plus nombreuse de la société était formée par…", "les paysans", "les prêtres", "les nobles", "Ils cultivaient et payaient l'impôt."), q("Les esclaves en Égypte étaient surtout…", "des prisonniers de guerre peu nombreux", "la majorité de la population", "les scribes", "Ce ne sont pas eux qui ont tout construit."), q("Combien d'années de 3100 av. J.-C. à 2026 ?", "5 125 ans", "1 074 ans", "5 126 ans", "3 100 + 2 026 − 1."), q("La double couronne symbolise…", "l'union de la Haute et de la Basse-Égypte", "la richesse du Nil", "la mort du pharaon", "Couronne blanche et couronne rouge réunies.")],
    apc: apc("Des élèves préparent une pièce de théâtre sur l'Égypte et ne savent pas comment répartir les rôles.", "Décrire l'organisation de la société égyptienne pour distribuer les rôles avec justesse.")
  });
  VRT_A("6e-histoire-egypte-societe", 2, "Monte la pyramide sociale : place chaque personnage", function (el) {
    exercice(el, [["Au sommet de la pyramide sociale se trouve ___.", ["le pharaon", "le scribe", "le paysan"], "Roi-dieu, il a tous les pouvoirs."], ["Le premier ministre qui dirige l'administration est ___.", ["le vizir", "le soldat", "le potier"], "Il aide le pharaon à gouverner."], ["Celui qui compte les sacs de blé de l'impôt est ___.", ["le scribe", "le prêtre", "l'esclave"], "Il sait lire, écrire et compter."], ["Le groupe le plus nombreux, à la base, ce sont ___.", ["les paysans", "les nobles", "les prêtres"], "Ils cultivent les terres du Nil."], ["Un prisonnier de guerre ramené en Égypte devient souvent ___.", ["esclave", "vizir", "pharaon"], "Les esclaves étaient peu nombreux."], ["Pendant la crue, les paysans travaillent souvent ___.", ["aux grands chantiers", "dans leurs champs inondés", "à la chasse au lion"], "Les champs sont sous l'eau : c'est la corvée."]], "Personnage suivant", "Personnage");
  });

  /* ═══════════════ RANG 10 : AVANCÉES SCIENTIFIQUES ET TECHNIQUES ═══════════════ */
  function kheops3D() {
    var o = [{ f: "boite", c: [0, -6, 0], d: [500, 6, 300], coul: "#D8C49A", dessus: "#E8D8B0" }], s = 120, h = 150, z0 = 20;
    var A = [-s, 0, z0 - s], B = [s, 0, z0 - s], C = [s, 0, z0 + s], D = [-s, 0, z0 + s], T = [0, h, z0];
    o.push({ f: "poly", pts: [A, B, T], coul: "#E0C080" }); o.push({ f: "poly", pts: [B, C, T], coul: "#C9A660" }); o.push({ f: "poly", pts: [C, D, T], coul: "#B8954F" }); o.push({ f: "poly", pts: [D, A, T], coul: "#D4B370" });
    o.push({ f: "boite", c: [0, 2, -130], d: [500, 4, 36], coul: "#3F78B8", dessus: "#5A93D0" });
    o.push({ f: "boite", c: [-190, 20, -100], d: [6, 40, 6], coul: "#6B4423" });
    o.push({ f: "poly", pts: [[-220, 34, -100], [-160, 52, -100], [-160, 48, -100], [-220, 30, -100]], coul: "#8B6B4A" });
    o.push({ f: "cylindre", c: [-220, 14, -100], r: 6, h: 10, n: 10, coul: "#A0522D" });
    o.push({ f: "boite", c: [190, 10, -80], d: [30, 20, 30], coul: "#C9A660", dessus: "#E0C080" });
    o.push({ f: "boite", c: [160, 6, -60], d: [26, 12, 26], coul: "#C9A660", dessus: "#E0C080" });
    return o;
  }
  VRT_L("6e-histoire-egypte-sciences", {
    c: "6e", m: "histoire", cle: "Les avancées scientifiques et techniques dans l", titre: "Les avancées scientifiques et techniques de l'Égypte ancienne", duree: 30,
    accroche: "« Les pyramides ont été construites par des extraterrestres : les hommes de l'époque n'en étaient pas capables ! » Que savaient vraiment faire les Égyptiens ?",
    intro: "Une vidéo partagée sur un groupe WhatsApp de la classe, à Ebolowa, te sert de fil rouge : à chaque partie, un indice t'aide à trancher entre trois explications des réussites égyptiennes.",
    objectifs: ["présenter l'écriture hiéroglyphique et le papyrus", "expliquer le calendrier et les mathématiques des Égyptiens", "décrire leurs savoirs en médecine et en techniques", "expliquer, avec des chiffres, la construction des pyramides"],
    enquete: {
      titre: "La vidéo des extraterrestres",
      svg: svg(640, 220, "Un téléphone affiche une vidéo d'une soucoupe volante au-dessus d'une pyramide ; deux élèves regardent, l'un sceptique, avec un manuel ouvert", lin("esC", ["#E6EEF8", "#F4EDE1"], true),
        "<rect width='640' height='220' fill='url(#esC)'/><rect y='186' width='640' height='34' fill='#C9A06E'/><rect x='240' y='20' width='160' height='150' rx='16' fill='#1F2328'/><rect x='250' y='34' width='140' height='120' fill='#F4E2B8'/>" +
        "<path d='M270 150L320 80L370 150Z' fill='#D8B47A' stroke='#B08A4A'/><ellipse cx='320' cy='56' rx='34' ry='9' fill='#9AA3AF'/><ellipse cx='320' cy='50' rx='14' ry='9' fill='#C9D2E3'/><path d='M306 64l-8 30M334 64l8 30' stroke='#F7C948' stroke-width='3' opacity='.7'/>" +
        perso(130, 98, "#5A3A1E", "#C2540A", "#2E3445") + perso(520, 98, "#6B4423", "#17784D", "#2E3445") + "<rect x='536' y='122' width='30' height='24' fill='#fff' stroke='#1E499B' stroke-width='2'/>" +
        bulle(14, 40, 170, "Des extraterrestres !", "#F7C948") + bulle(440, 40, 190, "Le manuel dit autre chose…", "#9FC3E8")),
      legende: "À Ebolowa, une vidéo partagée dans le groupe de la classe affirme que les pyramides ont été bâties par des extraterrestres.",
      contexte: "<p>Une vidéo circule dans le groupe WhatsApp de la 6e : elle prétend que « les Égyptiens ne savaient ni calculer ni écrire, donc les pyramides sont l'œuvre d'extraterrestres ». Paul y croit. Grâce, elle, pense que « les pyramides sont simplement apparues par magie, grâce aux dieux ». Leur professeur leur demande d'enquêter : que savaient réellement les Égyptiens en écriture, en calcul, en médecine et en construction ?</p>",
      documents: [{ t: "Le papyrus Rhind (vers 1550 av. J.-C.)", html: "<p>Ce rouleau de papyrus contient des dizaines de problèmes de mathématiques résolus : partages de pains, calculs de surfaces de champs, volumes de greniers et pentes de pyramides.</p>" },
        { t: "La pyramide de Khéops (vers 2560 av. J.-C.)", html: "<p>Haute d'environ 146 m à l'origine, elle est faite de plus de deux millions de blocs de pierre. Près de Gizeh, on a retrouvé les traces du village des ouvriers, leurs boulangeries et leurs tombes.</p>" }],
      question: "Les Égyptiens avaient-ils les connaissances nécessaires pour bâtir les pyramides et faire progresser les sciences ?",
      tache: "Présente l'écriture, le calendrier et les mathématiques des Égyptiens, leurs savoirs en médecine et en techniques, puis explique comment ils ont construit les pyramides.",
      hypotheses: ["Les pyramides ont été construites par des extraterrestres.", "Les pyramides sont apparues par magie, grâce aux dieux.", "Les Égyptiens savaient écrire, compter, mesurer, soigner et organiser des milliers d'ouvriers : ce sont eux qui ont bâti les pyramides."]
    },
    parties: [
      { t: "Écrire et compter le temps", html: def("Hiéroglyphes", "Écriture de l'Égypte ancienne, apparue vers 3200 av. J.-C., faite de signes dessinés : certains représentent des objets ou des idées, d'autres des sons.") +
          "<ul><li><strong>Le papyrus</strong> : une plante des bords du Nil dont les tiges, découpées et pressées, donnent une sorte de papier.</li><li><strong>Les scribes</strong> écrivent avec un calame (roseau taillé) et de l'encre noire et rouge.</li><li><strong>Le calendrier</strong> : les Égyptiens observent le ciel et le retour de la crue ; ils comptent 12 mois de 30 jours, plus 5 jours de fête.</li></ul>" +
          formule("année égyptienne = 12 × 30 + 5 = 365 jours") +
          ex("Notre calendrier compte 365 jours, comme celui des Égyptiens ; il ajoute un jour tous les quatre ans (années bissextiles) pour rattraper le quart de jour manquant.", "Un héritage dans notre calendrier") +
          savais("En 1822, le Français Jean-François Champollion a réussi à déchiffrer les hiéroglyphes grâce à la pierre de Rosette, qui porte le même texte en trois écritures."),
        planches: [P2("Du papyrus au calendrier", "Trois inventions de l'Égypte qui servent encore : une écriture, un support pour écrire et un calendrier de 365 jours.",
          colonnes("Écrire et mesurer le temps en Égypte", [{ t: "Hiéroglyphes", c: "#C2540A", l: ["≈ 3200 av. J.-C.", "signes-images", "et signes-sons"] }, { t: "Papyrus", c: "#17784D", l: ["tiges pressées", "rouleaux", "→ le « papier »"] }, { t: "Calendrier", c: "#1E499B", l: ["12 mois × 30 jours", "+ 5 jours", "= 365 jours"] }], 220, "Hiéroglyphes, papyrus et calendrier de 365 jours"))],
        fil: { html: "<p>La vidéo affirme que les Égyptiens « ne savaient pas écrire » : c'est faux. Ils ont inventé l'une des plus anciennes écritures du monde, des milliers de papyrus nous sont parvenus, et leur calendrier de <strong>365 jours</strong> est l'ancêtre du nôtre.</p>", verdicts: [[0, "rejetee", "Les Égyptiens savaient écrire et compter le temps : rien n'exige d'extraterrestres."]] },
        retenir: "Hiéroglyphes (≈ 3200 av. J.-C.) ; papyrus ; calendrier : 12 × 30 + 5 = 365 jours." },
      { t: "Mathématiques et médecine", html: "<ul><li><strong>La géométrie</strong> : après chaque crue, les limites des champs disparaissent sous le limon ; des arpenteurs les remesurent avec des cordes à nœuds pour calculer l'impôt.</li><li><strong>Le calcul</strong> : les scribes savent additionner, multiplier, partager, calculer des surfaces et des volumes (papyrus Rhind).</li><li><strong>La médecine</strong> : des papyrus médicaux décrivent des maladies, des blessures et des remèdes à base de plantes ; les médecins réduisent des fractures et soignent des plaies.</li><li><strong>La momification</strong> : pour conserver les corps, les embaumeurs connaissent bien l'anatomie.</li></ul>" +
          formule("aire d'un champ rectangulaire = longueur × largeur") +
          ex("Un champ de 50 coudées de long et 20 coudées de large a une aire de 50 × 20 = 1 000 coudées carrées : le scribe calcule l'impôt d'après cette surface.", "Le calcul de l'arpenteur") +
          astuce("La corde à 12 nœuds régulièrement espacés permet de former un triangle de côtés 3, 4 et 5 : il a un angle droit. C'est ainsi qu'on trace des coins bien droits.") +
          attention("Les médecins égyptiens mêlaient remèdes efficaces et formules magiques : leur médecine était avancée pour l'époque, mais différente de la médecine scientifique d'aujourd'hui."),
        planches: [P2("Les savoirs des scribes et des médecins", "Les problèmes résolus des papyrus montrent des savoirs pratiques : mesurer, calculer, soigner, conserver.",
          colonnes("Les sciences au service de la vie égyptienne", [{ t: "Arpentage", c: "#B07A00", l: ["cordes à nœuds", "remesurer après la crue", "→ calcul de l'impôt"] }, { t: "Calcul", c: "#1E499B", l: ["surfaces, volumes", "partages de pains", "→ papyrus Rhind"] }, { t: "Médecine", c: "#17784D", l: ["plantes, pansements", "fractures réduites", "→ papyrus médicaux"] }, { t: "Momification", c: "#7B3F99", l: ["conserver le corps", "connaître l'anatomie", "→ embaumeurs"] }], 220, "Arpentage, calcul, médecine et momification en Égypte"))],
        fil: { html: "<p>Les pyramides ne sont pas « apparues par magie » : le papyrus Rhind contient justement des calculs de pente de pyramide. Arpenteurs, scribes et architectes savaient mesurer, calculer et tracer des angles droits avec des <strong>cordes à nœuds</strong>.</p>", verdicts: [[1, "rejetee", "Les calculs de pente des pyramides figurent dans un papyrus de mathématiques : c'est un savoir humain."]] },
        retenir: "Arpentage et cordes à nœuds ; aire = longueur × largeur ; papyrus Rhind ; médecine par les plantes ; momification." },
      { t: "Les techniques : bâtir et irriguer", html: "<ul><li><strong>Les pyramides</strong> : tombeaux des pharaons ; Khéops (vers 2560 av. J.-C.) mesurait environ 146 m de haut.</li><li><strong>Le chantier</strong> : on taille les blocs au ciseau de cuivre, on les transporte sur des traîneaux et des bateaux, on les monte par des rampes de terre et de briques.</li><li><strong>Les ouvriers</strong> : des équipes organisées, nourries et logées dans un village près du chantier.</li><li><strong>L'irrigation</strong> : canaux, bassins et <strong>chadouf</strong> (balancier à contrepoids qui soulève l'eau du fleuve).</li></ul>" +
          formule("nombre de blocs posés = blocs par jour × nombre de jours de travail") +
          ex("Si une grande équipe pose 300 blocs par jour pendant 300 jours par an, elle en pose 300 × 300 = 90 000 par an ; il faut alors environ 2 300 000 ÷ 90 000 ≈ 25 ans pour une pyramide de 2,3 millions de blocs. C'est l'ordre de grandeur du règne de Khéops.", "Un calcul pour la pyramide") +
          astuce("Pour retenir le chadouf, pense à une balançoire : un poids d'un côté, un seau de l'autre ; on abaisse le seau dans l'eau et le poids le remonte."),
        planches: [{ type: "3d", titre: "Le chantier de la pyramide et le chadouf", legende: "Tourne le chantier : la pyramide aux quatre faces de pierre claire, le Nil au premier plan, un chadouf qui soulève l'eau pour irriguer, et des blocs taillés prêts à être tirés sur la rampe.", modele: { h: 340, rx: -14, ry: 30, echelle: 0.75, alt: "Pyramide de pierre claire près d'un fleuve, avec un chadouf en bois et des blocs de pierre au sol", objets: kheops3D(), etiquettes: [{ p: [0, 150, 20], t: "pyramide ≈ 146 m", cote: "d" }, { p: [-190, 50, -100], t: "chadouf", cote: "g" }, { p: [100, 6, -130], t: "le Nil", cote: "g" }, { p: [180, 22, -80], t: "blocs taillés", cote: "d" }] } }],
        fil: { html: "<p>Avec des chiffres, la vidéo s'effondre : quelques centaines de blocs par jour, pendant une vingtaine d'années, avec des équipes nourries par les greniers du Nil, suffisent à bâtir Khéops. Les Égyptiens savaient <strong>écrire, compter, mesurer et organiser</strong> : ce sont eux qui ont construit les pyramides.</p>", verdicts: [[2, "validee", "Écriture, calcul, techniques et organisation : les Égyptiens ont bâti les pyramides."]] },
        retenir: "Khéops ≈ 2560 av. J.-C., ≈ 146 m ; rampes, traîneaux, ciseaux de cuivre ; chadouf et canaux." },
      { t: "Entraînement au format de l'examen", html: integ("L'écriture de l'Égypte ancienne s'appelle…", ["l'alphabet latin", "les hiéroglyphes", "le braille", "l'écriture arabe"], "Les hiéroglyphes", "Elle apparaît vers 3200 av. J.-C.", "Calcule la durée de l'année égyptienne et explique à quoi servait l'arpentage.", "12 × 30 + 5 = 365 jours. L'arpentage permettait de remesurer les champs après la crue, dont le limon effaçait les limites, pour calculer l'impôt de chaque paysan.", "Une vidéo affirme que les Africains de l'Antiquité n'ont rien inventé.", "En t'appuyant sur ta leçon, rédige quelques lignes pour lui répondre avec des exemples précis.", "C'est faux : en Égypte, en Afrique, on a inventé l'une des premières écritures (les hiéroglyphes), le papyrus, un calendrier de 365 jours, des méthodes de calcul et de mesure (papyrus Rhind, cordes à nœuds), une médecine par les plantes et des techniques de construction capables de bâtir la pyramide de Khéops, haute d'environ 146 m."), retenir: "Savoir-être : esprit critique face aux rumeurs et fierté du patrimoine africain." }
    ],
    denouement: { titre: "La réponse à la vidéo", etapes: ["Les Égyptiens savaient écrire (hiéroglyphes) et compter le temps (365 jours) (indice 1).", "Ils calculaient et mesuraient : arpentage, papyrus Rhind, pente des pyramides (indice 2).", "Ils maîtrisaient les techniques et l'organisation d'un grand chantier (indice 3)."],
      formules: [F("Compter l'année", "12 × 30 + 5 = 365 jours", "l'ancêtre de notre calendrier"), F("Mesurer un champ", "aire = longueur × largeur", "50 × 20 = 1 000 coudées carrées"), F("Estimer le chantier", "blocs par an = blocs par jour × jours", "300 × 300 = 90 000 ; 2 300 000 ÷ 90 000 ≈ 25 ans")],
      reponse: "<p>La vidéo se trompe : les Égyptiens avaient toutes les connaissances nécessaires pour bâtir les pyramides. Ils ont inventé les hiéroglyphes vers 3200 av. J.-C. et écrivaient sur du papyrus ; leur calendrier comptait 12 mois de 30 jours plus 5 jours, soit 365 jours. Leurs scribes et arpenteurs savaient calculer des surfaces et des volumes, comme le montre le papyrus Rhind, qui contient même des calculs de pente de pyramide ; avec des cordes à nœuds, ils traçaient des angles droits. Leurs médecins soignaient avec des plantes et réduisaient des fractures. Enfin, ils taillaient la pierre au ciseau de cuivre, transportaient les blocs sur des traîneaux et des bateaux et les montaient par des rampes, avec des équipes d'ouvriers nourris et logés près du chantier. En posant quelques centaines de blocs par jour pendant une vingtaine d'années, ils ont pu élever Khéops, haute d'environ 146 m. Ce sont bien des hommes, des Africains, qui ont construit les pyramides.</p>",
      transfert: "<p>Une autre rumeur circule sur internet. Avant de la partager, quelles questions poses-tu, comme pour la vidéo des pyramides ? Donne trois questions.</p>" },
    revision: ["<strong>Hiéroglyphes</strong> : écriture apparue vers 3200 av. J.-C. ; papyrus ; scribes.", "Calendrier : 12 × 30 + 5 = 365 jours.", "Arpentage après la crue ; cordes à nœuds ; aire = longueur × largeur.", "Papyrus Rhind : problèmes de mathématiques ; papyrus médicaux.", "Momification ; médecine par les plantes.", "Khéops (≈ 2560 av. J.-C., ≈ 146 m) : rampes, traîneaux, ouvriers organisés ; chadouf pour irriguer."],
    exo: "<p>Un champ mesure 40 coudées sur 25 coudées. Calcule son aire. <em>(40 × 25 = 1 000 coudées carrées.)</em></p>",
    quiz: [q("Les hiéroglyphes sont…", "l'écriture de l'Égypte ancienne", "des pyramides", "des dieux", "Apparus vers 3200 av. J.-C."), q("Le papyrus est…", "une plante dont on fait une sorte de papier", "un animal du Nil", "un outil de pierre", "Tiges découpées et pressées."), q("L'année égyptienne comptait…", "365 jours", "300 jours", "12 jours", "12 × 30 + 5."), q("Les hiéroglyphes ont été déchiffrés par…", "Champollion", "Hérodote", "Khéops", "En 1822, grâce à la pierre de Rosette."), q("L'arpentage servait à…", "remesurer les champs après la crue", "construire des bateaux", "écrire des poèmes", "Pour calculer l'impôt."), q("Aire d'un champ de 30 sur 10 coudées :", "300 coudées carrées", "40 coudées carrées", "3 000 coudées carrées", "30 × 10 = 300."), q("Le papyrus Rhind contient surtout…", "des problèmes de mathématiques", "des recettes de cuisine", "des lois", "Partages, surfaces, volumes, pentes."), q("Le chadouf sert à…", "soulever l'eau du fleuve pour irriguer", "tailler la pierre", "écrire", "Un balancier à contrepoids."), q("La pyramide de Khéops a été bâtie vers…", "2560 av. J.-C.", "1960 apr. J.-C.", "10 000 av. J.-C.", "Haute d'environ 146 m à l'origine."), q("Les pyramides ont été construites…", "par des équipes d'ouvriers égyptiens organisés", "par des extraterrestres", "par magie", "Leur village a été retrouvé près de Gizeh.")],
    apc: apc("Une vidéo virale affirme que les pyramides ont été bâties par des extraterrestres.", "Montrer, avec des preuves et des calculs, les savoirs des Égyptiens.")
  });
  VRT_A("6e-histoire-egypte-sciences", 1, "Calcule comme un scribe égyptien", function (el) {
    exercice(el, [["L'année égyptienne : 12 × 30 + 5 = ___ jours.", ["365", "360", "350"], "12 mois de 30 jours, plus 5 jours de fête."], ["Un champ de 20 coudées sur 15 coudées a une aire de ___ coudées carrées.", ["300", "35", "3 000"], "Aire = longueur × largeur."], ["Partager 10 pains entre 5 ouvriers : chacun reçoit ___ pains.", ["2", "5", "50"], "10 ÷ 5 = 2 (problème du papyrus Rhind)."], ["Une équipe pose 200 blocs par jour pendant 10 jours : ___ blocs.", ["2 000", "210", "20 000"], "200 × 10."], ["De la pyramide de Khéops (2560 av. J.-C.) à 2026, il s'est écoulé ___ ans.", ["4 585", "534", "4 586"], "2 560 + 2 026 − 1 = 4 585."], ["Une corde à nœuds de côtés 3, 4 et 5 forme un angle ___.", ["droit", "aigu", "plat"], "Le triangle 3-4-5 est rectangle."]], "Calcul suivant", "Calcul");
  });
})();
