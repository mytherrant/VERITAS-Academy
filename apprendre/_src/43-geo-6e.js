/* Leçons GRATUITES — Géographie de 6e, lot 1 (24/11/2026) : rangs 1 (la géographie), 2 (notre planète la Terre),
   3 (TP 1 : localiser un lieu sur la carte). Aucune leçon n'existait en géographie de 6e. Même gabarit que les leçons
   d'histoire de 6e : situation-problème résolue en étapes et formules, 2 planches 2D, 1 planche 3D, simulation,
   entraînement au format de l'examen, quiz de 10. */
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
  /* ═══════════════ RANG 1 : LA GÉOGRAPHIE ═══════════════ */
  function bureauGeo3D() {
    var o = [{ f: "boite", c: [0, -6, 0], d: [460, 6, 240], coul: "#8B6B4A", dessus: "#A68A5E" }];
    o.push({ f: "boite", c: [0, 60, 0], d: [380, 10, 170], coul: "#6B4423", dessus: "#8A5A33" });
    [[-180, -75], [180, -75], [-180, 75], [180, 75]].forEach(function (p) { o.push({ f: "boite", c: [p[0], 28, p[1]], d: [10, 56, 10], coul: "#5A3A1E" }); });
    o.push({ f: "cylindre", c: [-120, 65, 10], r: 20, h: 6, n: 14, coul: "#3B4252" });
    o.push({ f: "boite", c: [-120, 80, 10], d: [4, 24, 4], coul: "#3B4252" });
    o.push({ f: "sphere", c: [-120, 118, 10], r: 32, coul: "#2E86AB" });
    o.push({ f: "sphere", c: [-128, 126, -20], r: 12, coul: "#5A9A3A" });
    o.push({ f: "boite", c: [40, 66, -10], d: [150, 2, 100], coul: "#F4EDD8", dessus: "#F4EDD8" });
    o.push({ f: "boite", c: [20, 68, -20], d: [60, 1, 40], coul: "#9AC48A", dessus: "#9AC48A", div: false });
    o.push({ f: "boite", c: [70, 68, 10], d: [40, 1, 2], coul: "#2E86AB", dessus: "#2E86AB", div: false });
    o.push({ f: "cylindre", c: [140, 65, 50], r: 18, h: 8, n: 16, coul: "#B07A00" });
    o.push({ f: "boite", c: [140, 74, 50], d: [2, 1, 26], coul: "#C62828", div: false });
    return o;
  }
  VRT_L("6e-geo-la-geographie", {
    c: "6e", m: "geo", cle: "La géographie", titre: "La géographie : décrire et comprendre les espaces", duree: 30,
    accroche: "Pour la fête de l'école, la classe doit dessiner le plan du quartier de Mvog-Mbi, à Yaoundé. « Dessiner un plan, c'est de la géographie ? » À quoi sert cette science ?",
    intro: "La réalisation du plan d'un quartier de Yaoundé te sert de fil rouge : à chaque partie, un indice t'aide à trancher entre trois idées sur la géographie.",
    objectifs: ["définir la géographie et son objet", "distinguer géographie physique et géographie humaine", "citer les outils du géographe : carte, plan, croquis, photographie, statistiques", "utiliser l'échelle pour calculer une distance réelle"],
    enquete: {
      titre: "Le plan du quartier de Mvog-Mbi",
      svg: svg(640, 220, "Rue d'un quartier de Yaoundé avec un carrefour, un marché et une école ; deux élèves dessinent un plan sur un cahier", lin("ggC", ["#DDEBF5", "#F4EDE1"], true),
        "<rect width='640' height='220' fill='url(#ggC)'/><rect y='150' width='640' height='70' fill='#B5834E'/><rect x='0' y='168' width='640' height='18' fill='#6B6B6B'/><rect x='300' y='150' width='18' height='70' fill='#6B6B6B'/>" +
        "<rect x='60' y='86' width='120' height='64' fill='#E8DFC9'/><path d='M50 90l70 -34l70 34Z' fill='#C62828'/>" + txt(120, 124, "ÉCOLE", { s: 11 }) + "<rect x='420' y='100' width='150' height='50' fill='#F7C948'/><path d='M410 104h170l-14 -20H424Z' fill='#17784D'/>" + txt(495, 132, "MARCHÉ", { s: 11 }) +
        perso(260, 66, "#5A3A1E", "#7B3F99", "#2E3445") + perso(360, 66, "#6B4423", "#1E499B", "#2E3445") + "<rect x='272' y='92' width='26' height='20' fill='#fff' stroke='#9AA3AF'/>" +
        bulle(190, 14, 260, "C'est de la géographie, ça ?", "#F7C948")),
      legende: "À Yaoundé, deux élèves de 6e dessinent le plan de leur quartier pour la fête de l'école.",
      contexte: "<p>Pour la fête de l'école, Joëlle et Bertrand doivent dessiner le plan du quartier de Mvog-Mbi, avec l'école, le marché et le carrefour. Bertrand pense que « la géographie, c'est seulement apprendre par cœur les capitales et les fleuves ». Joëlle croit que « la géographie étudie seulement la nature : les montagnes, les rivières, le climat ». Leur professeur leur explique que dessiner et comprendre leur quartier, c'est déjà faire de la géographie.</p>",
      documents: [{ t: "Une définition", html: "<p>Le mot géographie vient du grec gê, « la Terre », et graphein, « écrire, décrire » : c'est la description de la Terre et des espaces où vivent les hommes.</p>" },
        { t: "L'échelle du plan", html: "<p>Le professeur donne une carte du quartier à l'échelle 1/10 000 : 1 cm sur la carte représente 10 000 cm, soit 100 m, sur le terrain.</p>" }],
      question: "Qu'est-ce que la géographie, que étudie-t-elle et avec quels outils ?",
      tache: "Définis la géographie, distingue ses branches, présente ses outils, puis calcule des distances réelles avec l'échelle du plan.",
      hypotheses: ["La géographie, c'est seulement apprendre par cœur des noms de capitales et de fleuves.", "La géographie étudie seulement la nature, sans les hommes.", "La géographie décrit et explique les espaces où vivent les hommes, la nature comme les activités humaines, avec des outils comme la carte, le plan et l'échelle."]
    },
    parties: [
      { t: "Qu'est-ce que la géographie ?", html: def("Géographie", "Science qui décrit et explique les espaces de la Terre et la façon dont les hommes les occupent, les aménagent et les transforment.") +
          "<ul><li>Elle répond à trois questions : <strong>Où ?</strong> (localiser), <strong>Comment ?</strong> (décrire), <strong>Pourquoi ?</strong> (expliquer).</li><li>Elle étudie les relations entre les hommes et leur <strong>milieu</strong> : le relief, le climat, l'eau, la végétation, mais aussi les villes, les routes, les champs, les marchés.</li><li>Elle travaille à toutes les échelles : le quartier, la région, le Cameroun, l'Afrique, le monde.</li></ul>" +
          formule("géographie = localiser (où ?) + décrire (comment ?) + expliquer (pourquoi ?)") +
          ex("Le marché de Mvog-Mbi est au bord de la route principale (où ?), il est très animé le matin (comment ?), parce que les camions de vivres y arrivent des villages (pourquoi ?).", "Les trois questions du géographe") +
          savais("On surnomme le Cameroun « l'Afrique en miniature », car on y trouve presque tous les paysages du continent : mer, montagnes, forêt, savane, sahel."),
        planches: [P2("Les trois questions du géographe", "Toute étude de géographie part de trois questions, de la plus simple à la plus profonde.",
          colonnes("Où ? Comment ? Pourquoi ?", [{ t: "Où ?", c: "#1E499B", l: ["localiser", "carte, plan", "coordonnées"] }, { t: "Comment ?", c: "#17784D", l: ["décrire", "paysage, activités", "chiffres"] }, { t: "Pourquoi ?", c: "#C2540A", l: ["expliquer", "liens homme-milieu", "causes"] }], 210, "Les trois questions du géographe"))],
        fil: { html: "<p>Bertrand se trompe : la géographie ne se réduit pas à des listes de noms. Elle cherche à <strong>localiser, décrire et expliquer</strong> : pourquoi le marché est-il là ? pourquoi le quartier s'étend-il le long de la route ?</p>", verdicts: [[0, "rejetee", "La géographie localise, décrit et explique ; elle ne se réduit pas à des listes."]] },
        retenir: "Géographie : gê (Terre) + graphein (décrire) ; où ? comment ? pourquoi ?" },
      { t: "Géographie physique et géographie humaine", html: "<ul><li><strong>La géographie physique</strong> étudie le milieu naturel : le relief (montagnes, plaines, plateaux), le climat, les cours d'eau, la végétation, les sols.</li><li><strong>La géographie humaine</strong> étudie les hommes dans l'espace : la population, les villes et les villages, les activités (agriculture, commerce, industrie), les transports.</li><li>Les deux sont liées : les hommes s'installent près de l'eau, cultivent selon le climat, aménagent le relief.</li></ul>" +
          def("Milieu", "Ensemble des conditions naturelles (relief, climat, eau, végétation, sols) dans lesquelles vivent les hommes.") +
          ex("À l'Ouest, les hauts plateaux fertiles et frais (géographie physique) expliquent les nombreuses cultures et la forte densité de population (géographie humaine).", "Des liens entre milieu et hommes") +
          attention("La géographie n'étudie pas « la nature » seule ni « les hommes » seuls : elle étudie les relations entre les deux."),
        planches: [{ type: "3d", titre: "La table du géographe", legende: "Tourne la table : un globe terrestre pour voir la Terre entière, une carte dépliée pour une région, et une boussole pour s'orienter. Ce sont les outils de base du géographe, avec le plan, la photographie aérienne et les statistiques.", modele: { h: 340, rx: -20, ry: 28, echelle: 0.82, alt: "Table en bois avec un globe terrestre, une carte dépliée et une boussole", objets: bureauGeo3D(), etiquettes: [{ p: [-120, 150, 10], t: "globe terrestre", cote: "g" }, { p: [40, 70, -10], t: "carte", cote: "d" }, { p: [140, 76, 50], t: "boussole", cote: "d" }] } }],
        fil: { html: "<p>Joëlle se trompe aussi : la géographie n'étudie pas seulement la nature. Le marché, l'école, la route, les maisons du plan de Mvog-Mbi relèvent de la <strong>géographie humaine</strong> ; les collines et le ruisseau du quartier, de la géographie physique.</p>", verdicts: [[1, "rejetee", "La géographie étudie aussi les hommes, leurs villes, leurs activités."]] },
        retenir: "Géographie physique : relief, climat, eaux, végétation ; humaine : population, villes, activités, transports." },
      { t: "Les outils du géographe et l'échelle", html: "<ul><li><strong>La carte</strong> : représentation réduite d'un espace, vue de dessus, avec un titre, une légende, une orientation (le nord) et une échelle.</li><li><strong>Le plan</strong> : une carte d'un petit espace (quartier, ville).</li><li><strong>Le croquis</strong> : un dessin simplifié qui montre l'essentiel.</li><li><strong>La photographie aérienne</strong> et l'image satellite, les <strong>statistiques</strong> et les graphiques, le <strong>GPS</strong>.</li></ul>" +
          def("Échelle", "Rapport entre une distance mesurée sur la carte et la distance réelle sur le terrain. À 1/10 000, 1 cm sur la carte représente 10 000 cm, soit 100 m.") +
          formule("distance réelle = distance sur la carte × dénominateur de l'échelle") +
          ex("Sur le plan au 1/10 000, l'école et le marché sont à 6 cm : 6 × 10 000 = 60 000 cm = 600 m.", "Calculer une distance réelle") +
          astuce("Pour convertir : 100 cm = 1 m ; 100 000 cm = 1 km. À 1/100 000, 1 cm = 1 km."),
        planches: [P2("Les éléments d'une carte", "Une carte sans ces cinq éléments ne peut pas être lue correctement.",
          colonnes("Les cinq éléments d'une carte", [{ t: "Titre", c: "#1E499B", l: ["de quoi", "parle la carte"] }, { t: "Légende", c: "#17784D", l: ["sens des", "couleurs, signes"] }, { t: "Orientation", c: "#C62828", l: ["flèche", "du nord"] }, { t: "Échelle", c: "#B07A00", l: ["1 cm =", "… sur le terrain"] }, { t: "Source", c: "#4D5163", l: ["qui l'a", "faite, quand"] }], 190, "Les cinq éléments d'une carte"))],
        fil: { html: "<p>Avec le plan au 1/10 000, Joëlle et Bertrand calculent que l'école est à 600 m du marché. Ils comprennent que la géographie <strong>localise, décrit et explique</strong> leur quartier, la nature comme les activités, avec des outils précis : le plan, la légende et l'échelle.</p>", verdicts: [[2, "validee", "Localiser, décrire, expliquer la nature et les activités humaines, avec la carte et l'échelle."]] },
        retenir: "Carte : titre, légende, orientation, échelle, source ; distance réelle = distance carte × dénominateur." },
      { t: "Entraînement au format de l'examen", html: integ("Le mot « géographie » signifie…", ["l'étude du passé", "la description de la Terre", "la science des nombres", "l'étude des êtres vivants"], "La description de la Terre", "Gê = Terre, graphein = décrire.", "Sur une carte au 1/50 000, deux villages sont à 4 cm. Calcule la distance réelle.", "4 × 50 000 = 200 000 cm = 2 000 m = 2 km.", "Ton cousin dit : « La géographie ne sert à rien dans la vie. »", "En t'appuyant sur ta leçon, rédige quelques lignes pour lui montrer son utilité.", "La géographie sert tous les jours : elle permet de lire une carte ou un plan pour trouver son chemin, de calculer une distance avec l'échelle, de comprendre pourquoi un marché, une école ou une route se trouvent à un endroit, et de connaître les paysages et les risques de son pays. Elle aide aussi à aménager et à protéger son milieu de vie."), retenir: "Savoir-être : curiosité pour son milieu de vie et sens de l'observation." }
    ],
    denouement: { titre: "Le plan est prêt", etapes: ["La géographie localise, décrit et explique (indice 1).", "Elle étudie le milieu naturel et les activités humaines (indice 2).", "Elle utilise la carte, le plan et l'échelle : 6 cm → 600 m (indice 3)."],
      formules: [F("Les trois questions", "où ? comment ? pourquoi ?", "le marché au bord de la route"), F("Lire l'échelle", "1/10 000 : 1 cm = 10 000 cm = 100 m", "1 cm sur le plan = 100 m"), F("Calculer une distance", "distance réelle = distance carte × dénominateur", "6 × 10 000 = 60 000 cm = 600 m")],
      reponse: "<p>La géographie est la science qui décrit et explique les espaces de la Terre et la façon dont les hommes les occupent. Elle ne se réduit ni à des listes de capitales ni à l'étude de la nature : elle répond aux questions « où ? », « comment ? » et « pourquoi ? », et étudie à la fois le milieu naturel (géographie physique) et les activités humaines (géographie humaine). Ses outils sont la carte, le plan, le croquis, la photographie aérienne et les statistiques. Une carte doit avoir un titre, une légende, une orientation, une échelle et une source. Sur le plan de Mvog-Mbi au 1/10 000, l'école et le marché sont à 6 cm, soit 6 × 10 000 = 60 000 cm, donc 600 m sur le terrain.</p>",
      transfert: "<p>Dessine le plan du trajet entre ta maison et ton école, avec une légende, la flèche du nord et une échelle approximative. Calcule la longueur réelle du trajet.</p>" },
    revision: ["<strong>Géographie</strong> : gê (Terre) + graphein (décrire) ; décrire et expliquer les espaces.", "Trois questions : où ? comment ? pourquoi ?", "Géographie physique (relief, climat, eaux, végétation) et humaine (population, villes, activités).", "Outils : carte, plan, croquis, photographie aérienne, statistiques, GPS.", "Carte : titre, légende, orientation, échelle, source.", "Distance réelle = distance sur la carte × dénominateur de l'échelle."],
    exo: "<p>Sur un plan au 1/5 000, ta maison est à 8 cm de l'école. Quelle est la distance réelle ? <em>(8 × 5 000 = 40 000 cm = 400 m.)</em></p>",
    quiz: [q("Le mot géographie vient du grec et signifie…", "décrire la Terre", "compter les étoiles", "étudier le passé", "Gê + graphein."), q("Les trois questions du géographe sont…", "où ? comment ? pourquoi ?", "qui ? quand ? combien ?", "quoi ? qui ? quand ?", "Localiser, décrire, expliquer."), q("Le relief et le climat relèvent de la géographie…", "physique", "humaine", "historique", "Le milieu naturel."), q("Les villes et les marchés relèvent de la géographie…", "humaine", "physique", "astronomique", "Les activités des hommes."), q("La légende d'une carte sert à…", "expliquer les couleurs et les signes", "dire qui a gagné", "donner l'heure", "Elle permet de lire la carte."), q("À l'échelle 1/10 000, 1 cm représente…", "100 m", "10 m", "1 km", "10 000 cm = 100 m."), q("6 cm au 1/10 000 représentent…", "600 m", "60 m", "6 km", "6 × 10 000 = 60 000 cm."), q("À l'échelle 1/100 000, 1 cm représente…", "1 km", "100 m", "10 km", "100 000 cm = 1 km."), q("Le Cameroun est surnommé…", "l'Afrique en miniature", "le pays du soleil levant", "le toit du monde", "Presque tous les paysages d'Afrique."), q("Un plan est…", "une carte d'un petit espace", "une photo du ciel", "un graphique", "Quartier, ville.")],
    apc: apc("Des élèves doivent dessiner le plan de leur quartier sans savoir ce qu'est la géographie.", "Définir la géographie, ses branches et ses outils, et utiliser l'échelle.")
  });
  VRT_A("6e-geo-la-geographie", 2, "Calcule les distances avec l'échelle", function (el) {
    exercice(el, [["À 1/10 000, 3 cm sur la carte représentent ___.", ["300 m", "30 m", "3 km"], "3 × 10 000 = 30 000 cm = 300 m."], ["À 1/50 000, 2 cm représentent ___.", ["1 km", "100 m", "10 km"], "2 × 50 000 = 100 000 cm = 1 km."], ["À 1/100 000, 7 cm représentent ___.", ["7 km", "700 m", "70 km"], "1 cm = 1 km."], ["À 1/25 000, 4 cm représentent ___.", ["1 km", "250 m", "4 km"], "4 × 25 000 = 100 000 cm = 1 km."], ["Le relief est un sujet de géographie ___.", ["physique", "humaine", "économique"], "Le milieu naturel."], ["Le commerce au marché est un sujet de géographie ___.", ["humaine", "physique", "climatique"], "Les activités des hommes."]], "Calcul suivant", "Calcul");
  });
  /* ═══════════════ RANG 2 : NOTRE PLANÈTE LA TERRE ═══════════════ */
  function terreSoleil3D() {
    var o = [];
    o.push({ f: "sphere", c: [-190, 0, 30], r: 54, coul: "#F7C948" });
    o.push({ f: "sphere", c: [60, 0, 0], r: 46, coul: "#2E86AB" });
    [[38, 18, -32], [78, -20, -32], [52, -10, -40], [96, 14, -14], [30, 38, -10]].forEach(function (p, i) {
      o.push({ f: "sphere", c: p, r: i === 2 ? 14 : 12, coul: "#5A9A3A" });
    });
    o.push({ f: "sphere", c: [60, 48, -4], r: 10, coul: "#F4F6F8" });
    o.push({ f: "sphere", c: [60, -48, -4], r: 10, coul: "#F4F6F8" });
    o.push({ f: "sphere", c: [170, 30, -30], r: 13, coul: "#B0B6BE" });
    return o;
  }
  VRT_L("6e-geo-notre-planete-terre", {
    c: "6e", m: "geo", cle: "Notre planète la terre", titre: "Notre planète la Terre : forme, dimensions, terres et mers", duree: 30,
    accroche: "À Garoua, le petit frère de Moussa affirme que « la Terre est plate comme une galette » : sinon, dit-il, l'eau du Bénoué tomberait. Comment lui prouver qu'il se trompe ?",
    intro: "Un débat entre deux frères de Garoua te sert de fil rouge : à chaque partie, un indice t'aide à trancher entre trois idées sur la Terre.",
    objectifs: ["décrire la forme et les dimensions de la Terre", "situer la Terre dans le système solaire", "nommer les continents et les océans", "calculer des grandeurs simples : circonférence, part des mers, temps de trajet de la lumière"],
    enquete: {
      titre: "La Terre est-elle plate ?",
      svg: svg(640, 220, "Deux frères au bord d'un fleuve à Garoua ; au loin, une pirogue dont on ne voit plus que le haut de la voile", lin("gpC", ["#CFE6F5", "#F6E7C8"], true),
        "<rect width='640' height='220' fill='url(#gpC)'/><circle cx='560' cy='48' r='26' fill='#F7C948'/><rect y='140' width='640' height='80' fill='#5B9BD5'/><path d='M0 140 Q320 128 640 140' fill='#4A88C2'/>" +
        "<path d='M430 138 l40 0 l-6 6 h-28Z' fill='#6B4423'/><path d='M450 138 V104 L470 132Z' fill='#fff' stroke='#9AA3AF'/>" +
        "<rect y='170' width='300' height='50' fill='#D9B77A'/>" + perso(120, 118, "#5A3A1E", "#17784D", "#2E3445") + perso(200, 128, "#6B4423", "#C62828", "#2E3445") +
        bulle(20, 20, 270, "La Terre est plate comme une galette !", "#F7C948") + bulle(330, 64, 250, "Alors pourquoi la voile disparaît ?", "#9FC5E8")),
      legende: "Au bord de la Bénoué, Moussa montre à son frère une pirogue qui s'éloigne : sa coque disparaît avant sa voile.",
      contexte: "<p>Le petit frère de Moussa pense que la Terre est plate. Leur cousine Aïssatou, elle, croit que la Terre est ronde mais « recouverte surtout de terres, avec un peu d'eau ». Moussa, élève de 6e, veut leur répondre avec des preuves et des chiffres tirés de sa leçon.</p>",
      documents: [{ t: "Une observation", html: "<p>Quand une pirogue s'éloigne sur un grand plan d'eau, on voit d'abord disparaître sa coque, puis le bas de la voile, et enfin le haut de la voile : la surface de l'eau est courbe.</p>" },
        { t: "Quelques chiffres", html: "<p>Rayon de la Terre : environ 6 370 km. Surface totale : environ 510 millions de km², dont 71 % couverts par les mers et les océans. Distance Terre-Soleil : environ 150 millions de km.</p>" }],
      question: "Quelle est la forme de la Terre, quelle est sa taille et comment se partagent les terres et les mers ?",
      tache: "Prouve que la Terre est ronde, calcule sa circonférence, situe-la dans le système solaire, puis nomme et compare les continents et les océans.",
      hypotheses: ["La Terre est plate comme une galette.", "La Terre est ronde, mais elle est couverte surtout de terres.", "La Terre est une sphère légèrement aplatie aux pôles, la troisième planète du Soleil, couverte surtout par les mers et les océans."]
    },
    parties: [
      { t: "La forme et les dimensions de la Terre", html: def("Planète", "Astre de forme presque sphérique qui tourne autour d'une étoile (le Soleil) et qui ne produit pas sa propre lumière.") +
          "<ul><li>La Terre est une <strong>sphère</strong> (une boule), légèrement aplatie aux pôles et renflée à l'équateur.</li><li>Preuves : les navires disparaissent à l'horizon par la coque ; les photographies prises de l'espace ; l'ombre ronde de la Terre sur la Lune pendant une éclipse ; des voyageurs ont fait le tour du monde.</li><li>Son rayon mesure environ <strong>6 370 km</strong> ; sa circonférence à l'équateur, environ <strong>40 000 km</strong>.</li></ul>" +
          formule("circonférence = 2 × π × rayon ≈ 2 × 3,14 × 6 370 ≈ 40 000 km") +
          ex("À 800 km par jour en voiture, il faudrait 40 000 ÷ 800 = 50 jours, sans s'arrêter, pour faire le tour de la Terre par l'équateur.", "Mesurer le tour de la Terre") +
          savais("Vers 240 avant J.-C., le savant grec Ératosthène a calculé la circonférence de la Terre en mesurant l'ombre d'un bâton dans deux villes d'Égypte. Il a trouvé une valeur proche de 40 000 km."),
        planches: [P2("Trois preuves que la Terre est ronde", "On n'a pas besoin d'aller dans l'espace pour savoir que la Terre est ronde : des observations simples le montrent.",
          colonnes("Trois preuves de la rondeur de la Terre", [{ t: "L'horizon", c: BLEU, l: ["la coque d'un bateau", "disparaît avant", "la voile"] }, { t: "Les éclipses", c: VERT, l: ["l'ombre de la Terre", "sur la Lune", "est ronde"] }, { t: "L'espace", c: TERRE, l: ["les photos", "des satellites", "montrent une boule"] }], 210, "Trois preuves de la rondeur de la Terre"))],
        fil: { html: "<p>Le petit frère se trompe : la pirogue qui disparaît par la coque montre que la surface de l'eau est <strong>courbe</strong>. L'eau du fleuve ne « tombe » pas, car la pesanteur attire tout vers le centre de la Terre.</p>", verdicts: [[0, "rejetee", "La Terre n'est pas plate : bateaux à l'horizon, éclipses et photos de l'espace le prouvent."]] },
        retenir: "Terre : sphère aplatie aux pôles ; rayon ≈ 6 370 km ; circonférence ≈ 2 × 3,14 × 6 370 ≈ 40 000 km." },
      { t: "La Terre dans le système solaire", html: "<ul><li>Le <strong>système solaire</strong> est formé du Soleil, une étoile, et de huit planètes qui tournent autour de lui : Mercure, Vénus, <strong>la Terre</strong>, Mars, Jupiter, Saturne, Uranus et Neptune.</li><li>La Terre est la <strong>troisième planète</strong> à partir du Soleil, à environ <strong>150 millions de km</strong>.</li><li>Elle a un satellite naturel, la <strong>Lune</strong>.</li><li>C'est la seule planète connue où il y a de l'eau liquide, de l'air respirable et la vie.</li></ul>" +
          def("Satellite", "Astre qui tourne autour d'une planète. La Lune est le satellite naturel de la Terre ; les hommes ont aussi lancé des satellites artificiels.") +
          formule("temps de trajet de la lumière du Soleil = distance ÷ vitesse = 150 000 000 ÷ 300 000 = 500 s ≈ 8 min 20 s") +
          ex("La lumière qui éclaire Garoua ce matin a quitté le Soleil environ 8 minutes plus tôt.", "La lumière du Soleil voyage") +
          astuce("Pour retenir l'ordre des planètes : « Me Voici Toute Mignonne, Je Suis Une Nébuleuse » (Mercure, Vénus, Terre, Mars, Jupiter, Saturne, Uranus, Neptune)."),
        planches: [{ type: "3d", titre: "Le Soleil, la Terre et la Lune", legende: "Tourne la scène : à gauche, le Soleil, une étoile qui produit sa lumière ; au centre, la Terre, bleue des océans, avec ses continents verts et ses calottes glaciaires blanches aux pôles ; à droite, la Lune, son satellite. Les distances ne sont pas respectées : en réalité, le Soleil est à 150 millions de km.", modele: { h: 330, rx: -12, ry: 20, echelle: 1, alt: "Une grosse boule jaune, une boule bleue avec des taches vertes et blanches, et une petite boule grise", objets: terreSoleil3D(), etiquettes: [{ p: [-190, 60, 30], t: "le Soleil (étoile)", cote: "g" }, { p: [60, 55, -4], t: "pôle Nord (glace)", cote: "d" }, { p: [78, -20, -46], t: "un continent", cote: "d" }, { p: [170, 45, -30], t: "la Lune (satellite)", cote: "d" }] } }],
        fil: { html: "<p>Moussa ajoute un argument : vue de l'espace, la Terre est une <strong>planète</strong> ronde comme les sept autres qui tournent autour du Soleil. Elle est la troisième, à 150 millions de km.</p>", verdicts: [] },
        retenir: "Système solaire : le Soleil et 8 planètes ; la Terre est la 3e, à 150 millions de km ; la Lune est son satellite." },
      { t: "Les continents et les océans", html: "<ul><li>La surface de la Terre mesure environ <strong>510 millions de km²</strong>.</li><li>Les <strong>mers et océans</strong> en couvrent environ <strong>71 %</strong> : on surnomme la Terre « la planète bleue ».</li><li>Cinq océans : Pacifique (le plus grand), Atlantique (il borde le Cameroun), Indien, Arctique, Antarctique (ou Austral).</li><li>Six continents : Asie (le plus grand), Afrique, Amérique, Europe, Océanie, Antarctique.</li></ul>" +
          def("Continent", "Très grande étendue de terre entourée d'océans. Le Cameroun se trouve sur le continent africain, au fond du golfe de Guinée.") +
          formule("surface des mers ≈ 71 % × 510 = 0,71 × 510 ≈ 362 millions de km² ; terres ≈ 510 − 362 = 148 millions de km²") +
          ex("Les mers couvrent environ 362 millions de km² et les terres 148 millions : il y a environ 362 ÷ 148 ≈ 2,4 fois plus d'eau que de terre à la surface du globe.", "Comparer les terres et les mers") +
          attention("L'Afrique n'est pas un pays : c'est un continent de 54 pays, dont le Cameroun. Ne confonds pas pays et continent."),
        planches: [P2("La part des terres et des mers", "Sur 100 km² de la surface de la Terre, 71 sont couverts par l'eau et 29 seulement par les terres émergées.",
          colonnes("Terres et mers à la surface du globe", [{ t: "Mers et océans", c: BLEU, l: ["71 %", "≈ 362 millions de km²", "5 océans"] }, { t: "Terres émergées", c: TERRE, l: ["29 %", "≈ 148 millions de km²", "6 continents"] }], 200, "Terres et mers à la surface du globe"))],
        fil: { html: "<p>Aïssatou se trompe : la Terre est ronde, mais elle est couverte <strong>surtout d'eau</strong>, à 71 %. Moussa conclut : la Terre est une sphère, la troisième planète du Soleil, et c'est une planète bleue.</p>", verdicts: [[1, "rejetee", "Les mers et les océans couvrent 71 % de la surface de la Terre."], [2, "validee", "Sphère aplatie aux pôles, 3e planète du Soleil, couverte à 71 % par les mers."]] },
        retenir: "Surface : 510 millions de km², dont 71 % de mers ; 5 océans ; 6 continents ; le Cameroun est en Afrique, au bord de l'Atlantique." },
      { t: "Entraînement au format de l'examen", html: integ("La Terre est…", ["la 1re planète à partir du Soleil", "la 3e planète à partir du Soleil", "une étoile", "le satellite de la Lune"], "La 3e planète à partir du Soleil", "Après Mercure et Vénus.", "Le rayon de la Terre mesure 6 370 km. Calcule sa circonférence avec π ≈ 3,14.", "2 × 3,14 × 6 370 = 40 003,6 km, soit environ 40 000 km.", "Pendant une veillée, un ancien de ton village affirme que « l'océan est une petite partie de la Terre ».", "Rédige quelques lignes pour lui répondre avec respect, en t'appuyant sur des chiffres.", "Avec tout mon respect, les mers et les océans couvrent environ 71 % de la surface de la Terre, soit à peu près 362 millions de km² sur 510. Les terres n'en couvrent que 29 %. C'est pour cela qu'on appelle la Terre « la planète bleue » ; l'océan Atlantique, qui borde le Cameroun, n'est que le deuxième plus grand des cinq océans."), retenir: "Savoir-être : respect de l'avis des anciens et goût de la preuve." }
    ],
    denouement: { titre: "Les deux frères sont convaincus", etapes: ["La pirogue disparaît par la coque : la Terre est ronde (indice 1).", "La Terre est la 3e planète du Soleil, avec la Lune pour satellite (indice 2).", "Les mers couvrent 71 % de sa surface (indice 3)."],
      formules: [F("Circonférence", "2 × π × R", "2 × 3,14 × 6 370 ≈ 40 000 km"), F("Surface des mers", "71 % × 510 millions de km²", "≈ 362 millions de km²"), F("Lumière du Soleil", "150 000 000 ÷ 300 000", "500 s ≈ 8 min 20 s")],
      reponse: "<p>La Terre n'est pas plate : c'est une sphère légèrement aplatie aux pôles. On le prouve par les bateaux qui disparaissent à l'horizon par la coque, par l'ombre ronde de la Terre sur la Lune pendant les éclipses et par les photographies prises de l'espace. Son rayon mesure environ 6 370 km et sa circonférence environ 2 × 3,14 × 6 370 ≈ 40 000 km. C'est la troisième des huit planètes du système solaire, à 150 millions de km du Soleil, et la Lune est son satellite. Sa surface, d'environ 510 millions de km², est couverte à 71 % par les mers et les océans (environ 362 millions de km²) : c'est la planète bleue, avec cinq océans et six continents. Le Cameroun se trouve en Afrique, au bord de l'océan Atlantique.</p>",
      transfert: "<p>Sur un globe ou une carte du monde, repère l'Afrique, le Cameroun et l'océan Atlantique. Cite le continent et l'océan les plus grands.</p>" },
    revision: ["<strong>La Terre</strong> : sphère aplatie aux pôles.", "Rayon ≈ 6 370 km ; circonférence ≈ 40 000 km.", "3e planète du système solaire, à 150 millions de km du Soleil ; la Lune est son satellite.", "Surface ≈ 510 millions de km², dont 71 % de mers et d'océans.", "5 océans (Pacifique le plus grand) et 6 continents (Asie le plus grand).", "Le Cameroun est en Afrique, au bord de l'océan Atlantique."],
    exo: "<p>Les terres émergées couvrent 29 % des 510 millions de km² de la surface terrestre. Calcule leur superficie. <em>(0,29 × 510 ≈ 148 millions de km².)</em></p>",
    quiz: [q("La forme de la Terre est…", "une sphère aplatie aux pôles", "un disque plat", "un cube", "Une boule légèrement aplatie."), q("Une preuve de la rondeur de la Terre est…", "la coque d'un bateau disparaît avant sa voile", "le soleil se lève", "il pleut en été", "La surface de l'eau est courbe."), q("La circonférence de la Terre mesure environ…", "40 000 km", "4 000 km", "400 000 km", "2 × 3,14 × 6 370."), q("La Terre est la … planète à partir du Soleil.", "troisième", "première", "huitième", "Après Mercure et Vénus."), q("La distance Terre-Soleil est d'environ…", "150 millions de km", "150 000 km", "15 km", "La lumière met 8 minutes."), q("La Lune est…", "le satellite de la Terre", "une étoile", "une planète du Soleil", "Elle tourne autour de la Terre."), q("Les mers et océans couvrent environ … de la Terre.", "71 %", "29 %", "50 %", "La planète bleue."), q("Le plus grand océan est…", "le Pacifique", "l'Atlantique", "l'Indien", "Il couvre un tiers du globe."), q("Le Cameroun se trouve sur le continent…", "africain", "asiatique", "américain", "Au fond du golfe de Guinée."), q("L'océan qui borde le Cameroun est…", "l'Atlantique", "l'Indien", "le Pacifique", "Par le golfe de Guinée.")],
    apc: apc("Un enfant affirme que la Terre est plate ; un autre pense qu'elle est couverte surtout de terres.", "Prouver la forme de la Terre, la situer dans le système solaire et comparer terres et mers avec des chiffres.")
  });
  VRT_A("6e-geo-notre-planete-terre", 2, "Teste tes connaissances sur la Terre", function (el) {
    exercice(el, [["La Terre est la ___ planète à partir du Soleil.", ["3e", "1re", "5e"], "Mercure, Vénus, puis la Terre."], ["2 × 3,14 × 6 370 km ≈ ___.", ["40 000 km", "20 000 km", "6 370 km"], "C'est la circonférence de la Terre."], ["71 % de 510 millions de km² ≈ ___.", ["362 millions de km²", "148 millions de km²", "71 millions de km²"], "0,71 × 510 ≈ 362."], ["Le plus grand continent est ___.", ["l'Asie", "l'Afrique", "l'Europe"], "Environ 44 millions de km²."], ["Le satellite naturel de la Terre est ___.", ["la Lune", "le Soleil", "Mars"], "Il tourne autour de la Terre."], ["150 000 000 km ÷ 300 000 km/s = ___.", ["500 s", "50 s", "5 000 s"], "Soit environ 8 min 20 s."]], "Question suivante", "Question");
  });

  /* ═══════════════ RANG 3 : TP 1, LOCALISER UN LIEU SUR LA CARTE ═══════════════ */
  function globeRepere3D() {
    var R = 92, cy = 0, o = [{ f: "sphere", c: [0, cy, 0], r: R, coul: "#9FC5E8" }], k, a;
    for (k = 0; k < 24; k++) {
      a = k * Math.PI / 12;
      o.push({ f: "sphere", c: [Math.round((R + 2) * Math.sin(a)), cy, Math.round(-(R + 2) * Math.cos(a))], r: 3.5, coul: ROUGE });
    }
    for (k = -5; k <= 5; k++) {
      a = k * Math.PI / 12;
      o.push({ f: "sphere", c: [0, Math.round(cy + (R + 2) * Math.sin(a)), Math.round(-(R + 2) * Math.cos(a))], r: 3.5, coul: VERT });
    }
    var la = 6 * Math.PI / 180, lo = 12 * Math.PI / 180;
    o.push({ f: "sphere", c: [Math.round((R + 5) * Math.cos(la) * Math.sin(lo)), Math.round(cy + (R + 5) * Math.sin(la)), Math.round(-(R + 5) * Math.cos(la) * Math.cos(lo))], r: 8, coul: "#F7C948" });
    o.push({ f: "sphere", c: [0, cy + R + 4, 0], r: 6, coul: NUIT });
    o.push({ f: "sphere", c: [0, cy - R - 4, 0], r: 6, coul: NUIT });
    return o;
  }
  function quadrillage(titre, h, alt) {
    var x0 = 90, y0 = 46, w = 460, hh = h - 90, s = "<rect width='640' height='" + h + "' fill='#FBF8F2'/>" + txt(320, 26, titre, { s: 15 }), i, x, y;
    s += "<rect x='" + x0 + "' y='" + y0 + "' width='" + w + "' height='" + hh + "' fill='#EAF3EA' stroke='#9AA3AF'/>";
    for (i = 0; i <= 8; i++) { x = x0 + i * w / 8; s += "<line x1='" + x + "' y1='" + y0 + "' x2='" + x + "' y2='" + (y0 + hh) + "' stroke='#9AA3AF' stroke-width='1'/>" + txt(x, y0 + hh + 16, (8 + i) + "° E", { s: 10, w: 600, c: GRIS }); }
    for (i = 0; i <= 6; i++) { y = y0 + hh - i * hh / 6; s += "<line x1='" + x0 + "' y1='" + y + "' x2='" + (x0 + w) + "' y2='" + y + "' stroke='#9AA3AF' stroke-width='1'/>" + txt(x0 - 8, y + 4, (2 + 2 * i) + "° N", { s: 10, w: 600, c: GRIS, a: "end" }); }
    function pt(lat, lon, nom, c, d) {
      var px = x0 + (lon - 8) * w / 8, py = y0 + hh - (lat - 2) * hh / 12;
      return "<circle cx='" + px + "' cy='" + py + "' r='6' fill='" + c + "' stroke='#fff' stroke-width='2'/>" + txt(px + (d || 10), py + 4, nom, { s: 11, a: d < 0 ? "end" : "start", c: c, halo: true });
    }
    s += pt(3.87, 11.52, "Yaoundé", BLEU, 10) + pt(4.05, 9.7, "Douala", ROUGE, -10) + pt(9.3, 13.4, "Garoua", VERT, 10) + pt(10.6, 14.3, "Maroua", TERRE, 10);
    s += "<path d='M600 70 v-26 m-7 10 l7 -10 l7 10' stroke='" + NUIT + "' stroke-width='3' fill='none'/>" + txt(600, 88, "N", { s: 13 });
    return svg(640, h, alt || titre, "", s);
  }
  VRT_L("6e-geo-tp-localiser-lieu", {
    c: "6e", m: "geo", cle: "TP 1 : Localiser un lieu sur la carte", titre: "TP 1 : localiser un lieu sur la carte avec les coordonnées géographiques", duree: 35,
    accroche: "À la radio scolaire de Garoua, le jeu du jour demande : « Quelle ville se trouve à 9° 18′ de latitude Nord et 13° 24′ de longitude Est ? » Comment trouver la réponse sur une carte ?",
    intro: "Un jeu radio de Garoua te sert de fil rouge : à chaque partie, un indice t'aide à trancher entre trois manières de localiser un lieu.",
    objectifs: ["nommer les points cardinaux et s'orienter sur une carte", "distinguer parallèles et méridiens, équateur et méridien de Greenwich", "lire et écrire les coordonnées géographiques d'un lieu", "calculer une distance nord-sud à partir des latitudes"],
    enquete: {
      titre: "Le jeu radio des coordonnées",
      svg: svg(640, 220, "Studio de radio scolaire : deux élèves au micro, une carte du Cameroun quadrillée au mur", lin("grC", ["#EDE7F6", "#F6F1E7"], true),
        "<rect width='640' height='220' fill='url(#grC)'/><rect y='170' width='640' height='50' fill='#B5834E'/><rect x='360' y='30' width='230' height='130' fill='#EAF3EA' stroke='#6B6B6B' stroke-width='3'/>" +
        "<path d='M440 140 L430 110 L452 92 L470 60 L486 40 L496 64 L486 96 L500 124 L476 146Z' fill='#9AC48A' stroke='#17784D' stroke-width='2'/>" +
        "<line x1='360' y1='75' x2='590' y2='75' stroke='#C62828' stroke-dasharray='4 3'/><line x1='475' y1='30' x2='475' y2='160' stroke='#1E499B' stroke-dasharray='4 3'/><circle cx='475' cy='75' r='5' fill='#F7C948' stroke='#001136'/>" +
        "<rect x='150' y='120' width='120' height='50' fill='#4D5163'/><rect x='205' y='84' width='6' height='36' fill='#2E3445'/><circle cx='208' cy='80' r='9' fill='#2E3445'/>" +
        perso(130, 66, "#5A3A1E", "#C62828", "#2E3445") + perso(290, 66, "#6B4423", "#1E499B", "#2E3445") +
        bulle(20, 16, 300, "9° 18′ N et 13° 24′ E : quelle ville ?", "#F7C948")),
      legende: "À la radio du lycée de Garoua, Fadimatou pose la question du jeu ; une carte quadrillée du Cameroun est accrochée au mur.",
      contexte: "<p>Pour gagner le jeu, Ibrahim propose de localiser la ville « en disant qu'elle est en haut de la carte, près de Maroua ». Haoua veut seulement « suivre le fleuve Bénoué jusqu'à une grande ville ». Leur professeur leur montre qu'il existe une méthode précise, valable partout sur la Terre : les coordonnées géographiques.</p>",
      documents: [{ t: "Le quadrillage du globe", html: "<p>Le globe est quadrillé par des lignes imaginaires : les parallèles, qui font le tour de la Terre d'ouest en est, et les méridiens, qui vont d'un pôle à l'autre. Leur croisement donne l'adresse exacte d'un lieu.</p>" },
        { t: "Une donnée utile", html: "<p>Entre deux parallèles séparés de 1° de latitude, il y a environ 111 km sur le terrain.</p>" }],
      question: "Comment localiser avec précision un lieu sur une carte ou sur le globe ?",
      tache: "Oriente-toi avec les points cardinaux, lis les parallèles et les méridiens, trouve la ville du jeu, puis calcule sa distance nord-sud à Yaoundé.",
      hypotheses: ["Il suffit de dire « en haut » ou « en bas » de la carte.", "Il suffit de suivre un fleuve ou une route jusqu'à la ville.", "On localise un lieu par ses coordonnées géographiques : sa latitude, lue sur les parallèles, et sa longitude, lue sur les méridiens."]
    },
    parties: [
      { t: "S'orienter : les points cardinaux", html: "<ul><li>Les quatre <strong>points cardinaux</strong> sont le Nord, le Sud, l'Est et l'Ouest. Entre eux, on trouve le Nord-Est, le Nord-Ouest, le Sud-Est et le Sud-Ouest.</li><li>Sur la plupart des cartes, le <strong>Nord est en haut</strong> ; une flèche marquée N l'indique.</li><li>Le Soleil se lève à l'<strong>Est</strong> et se couche à l'<strong>Ouest</strong> ; une <strong>boussole</strong> indique le Nord.</li></ul>" +
          def("S'orienter", "Trouver la direction des points cardinaux, sur le terrain ou sur une carte, pour savoir où l'on est et où l'on va.") +
          ex("Sur la carte du Cameroun, Garoua est au nord de Yaoundé, et Douala à l'ouest de Yaoundé.", "Situer des villes les unes par rapport aux autres") +
          attention("« En haut » et « en bas » ne sont pas des directions géographiques : sur une carte dont le nord n'est pas en haut, ils ne veulent plus rien dire. Dis « au nord », « au sud »."),
        planches: [P2("La rose des vents", "Les points cardinaux et intermédiaires permettent de décrire une direction partout sur la Terre.",
          svg(640, 230, "Rose des vents à huit branches avec N, S, E, O et les directions intermédiaires", "", "<rect width='640' height='230' fill='#FBF8F2'/>" + txt(320, 26, "La rose des vents", { s: 15 }) +
            "<path d='M320 44 L334 116 L320 130 L306 116Z' fill='" + ROUGE + "'/><path d='M320 216 L334 144 L320 130 L306 144Z' fill='" + NUIT + "'/><path d='M410 130 L338 144 L320 130 L338 116Z' fill='" + NUIT + "'/><path d='M230 130 L302 144 L320 130 L302 116Z' fill='" + NUIT + "'/>" +
            "<path d='M384 66 L330 124 L320 130 Z M256 66 L310 124 L320 130 Z M384 194 L330 136 L320 130 Z M256 194 L310 136 L320 130 Z' fill='#9AA3AF'/>" +
            txt(320, 40, "N", { s: 15, c: ROUGE }) + txt(320, 228, "S", { s: 15 }) + txt(426, 135, "E", { s: 15 }) + txt(214, 135, "O", { s: 15 }) + txt(398, 60, "NE", { s: 11 }) + txt(242, 60, "NO", { s: 11 }) + txt(398, 210, "SE", { s: 11 }) + txt(242, 210, "SO", { s: 11 }) +
            txt(520, 110, "lever du Soleil", { s: 11, c: TERRE }) + txt(520, 126, "→ Est", { s: 11, c: TERRE }) + txt(120, 110, "coucher du Soleil", { s: 11, c: BLEU }) + txt(120, 126, "→ Ouest", { s: 11, c: BLEU })))],
        fil: { html: "<p>Ibrahim se trompe : « en haut de la carte » est trop vague, et cela ne vaut que si le nord est en haut. Les points cardinaux aident à s'orienter, mais ils ne donnent pas l'adresse exacte de la ville.</p>", verdicts: [[0, "rejetee", "« En haut, en bas » est trop vague : il faut une méthode précise."]] },
        retenir: "Points cardinaux : N, S, E, O ; le Nord est en haut des cartes ; le Soleil se lève à l'Est." },
      { t: "Parallèles, méridiens et coordonnées", html: "<ul><li>Les <strong>parallèles</strong> sont des cercles qui font le tour de la Terre d'ouest en est. Le plus grand est l'<strong>équateur</strong> (0°), qui partage la Terre en hémisphère Nord et hémisphère Sud.</li><li>Les <strong>méridiens</strong> sont des demi-cercles qui vont du pôle Nord au pôle Sud. Le méridien de départ est celui de <strong>Greenwich</strong> (0°), près de Londres.</li><li>La <strong>latitude</strong> d'un lieu est sa distance à l'équateur, en degrés Nord ou Sud (de 0° à 90°). La <strong>longitude</strong> est sa distance au méridien de Greenwich, en degrés Est ou Ouest (de 0° à 180°).</li></ul>" +
          def("Coordonnées géographiques", "La latitude et la longitude d'un lieu, qui donnent son « adresse » sur le globe. On écrit d'abord la latitude, puis la longitude : Yaoundé, 3° 52′ N et 11° 31′ E.") +
          formule("coordonnées = latitude (N ou S, lue sur les parallèles) + longitude (E ou O, lue sur les méridiens)") +
          ex("Le Cameroun s'étend environ de 2° à 13° de latitude Nord et de 8° à 16° de longitude Est : il est entièrement dans l'hémisphère Nord et à l'est du méridien de Greenwich.", "Situer le Cameroun") +
          astuce("Latitude : pense à une échelle (« l'échelle des latitudes ») que l'on monte vers le nord ou descend vers le sud. Longitude : pense à une longue route vers l'est ou l'ouest."),
        planches: [{ type: "3d", titre: "Le globe et son quadrillage", legende: "Tourne le globe : les points rouges dessinent l'équateur (latitude 0°), les points verts le méridien de Greenwich (longitude 0°), et les deux pôles sont marqués en bleu nuit. La boule jaune marque le Cameroun, à environ 6° N et 12° E : un peu au nord de l'équateur, un peu à l'est de Greenwich.", modele: { h: 340, rx: -14, ry: 18, echelle: 1, alt: "Globe bleu clair parcouru par une ligne de points rouges horizontale et une ligne de points verts verticale, avec un point jaune", objets: globeRepere3D(), etiquettes: [{ p: [94, 0, 0], t: "équateur (0°)", cote: "d" }, { p: [0, 75, -50], t: "méridien de Greenwich (0°)", cote: "g" }, { p: [20, 10, -95], t: "le Cameroun ≈ 6° N, 12° E", cote: "d" }, { p: [0, 96, 0], t: "pôle Nord", cote: "g" }] } }],
        fil: { html: "<p>Haoua se trompe aussi : suivre la Bénoué peut aider, mais beaucoup de lieux ne sont pas au bord d'un fleuve. Les <strong>parallèles et les méridiens</strong> donnent à chaque lieu une adresse unique.</p>", verdicts: [[1, "rejetee", "Suivre un fleuve ne marche pas pour tous les lieux ; les coordonnées si."]] },
        retenir: "Équateur = latitude 0° ; Greenwich = longitude 0° ; latitude N ou S, longitude E ou O ; on écrit la latitude d'abord." },
      { t: "Lire une carte quadrillée et calculer une distance", html: "<div class='methode'><b>Localiser un lieu à partir de ses coordonnées</b><ol><li>Repère le <strong>parallèle</strong> de la latitude donnée (sur le bord gauche ou droit de la carte).</li><li>Repère le <strong>méridien</strong> de la longitude donnée (sur le bord haut ou bas).</li><li>Suis les deux lignes jusqu'à leur <strong>croisement</strong> : c'est le lieu cherché.</li><li>Inversement, pour donner les coordonnées d'un lieu, lis le parallèle puis le méridien qui passent par lui.</li></ol></div>" +
          formule("distance nord-sud ≈ différence de latitude (en degrés) × 111 km") +
          ex("Garoua (9° 18′ N) et Yaoundé (3° 52′ N) : 9° 18′ − 3° 52′ = 5° 26′, soit environ 5,4°. Distance nord-sud ≈ 5,4 × 111 ≈ 600 km.", "De Yaoundé à Garoua") +
          savais("Le GPS d'un téléphone affiche les coordonnées du lieu où tu te trouves, calculées grâce à des satellites qui tournent autour de la Terre."),
        planches: [P2("Carte quadrillée du Cameroun", "On lit la latitude sur le bord gauche (parallèles) et la longitude sur le bord bas (méridiens). Garoua est au croisement du parallèle 9° 18′ N et du méridien 13° 24′ E.", quadrillage("Quelques villes du Cameroun sur le quadrillage", 260, "Carte quadrillée de 2° à 14° N et de 8° à 16° E avec Yaoundé, Douala, Garoua et Maroua"))],
        fil: { html: "<p>Au croisement du parallèle 9° 18′ N et du méridien 13° 24′ E, les élèves trouvent <strong>Garoua</strong>. Ils gagnent le jeu et ajoutent même que la ville est à environ 600 km au nord de Yaoundé.</p>", verdicts: [[2, "validee", "Latitude et longitude donnent l'adresse exacte : 9° 18′ N, 13° 24′ E, c'est Garoua."]] },
        retenir: "Croisement parallèle × méridien = lieu ; 1° de latitude ≈ 111 km ; Yaoundé-Garoua ≈ 600 km nord-sud." },
      { t: "Entraînement au format de l'examen", html: integ("La latitude d'un lieu se mesure à partir…", ["du méridien de Greenwich", "de l'équateur", "du pôle Nord", "de la capitale"], "De l'équateur", "Elle va de 0° à 90° Nord ou Sud.", "Maroua est à environ 10° 36′ N et Yaoundé à 3° 52′ N. Calcule la distance nord-sud approximative entre les deux villes.", "10° 36′ − 3° 52′ = 6° 44′ ≈ 6,7° ; 6,7 × 111 ≈ 744 km, soit environ 740 km.", "Ton oncle, pêcheur à Kribi, veut indiquer aux secours l'endroit exact où son moteur est tombé en panne en mer.", "Explique-lui comment donner sa position de façon précise.", "Il doit donner ses coordonnées géographiques : d'abord la latitude (par exemple 2° 50′ N), puis la longitude (par exemple 9° 40′ E). Il peut les lire sur le GPS de son téléphone. Dire « au large de Kribi » ou « en face de la plage » est trop vague : avec la latitude et la longitude, les secours trouvent le point exact sur leur carte."), retenir: "Savoir-être : précision et sens du service en cas de danger." }
    ],
    denouement: { titre: "La ville du jeu est trouvée", etapes: ["Les points cardinaux orientent, mais restent vagues (indice 1).", "Parallèles et méridiens donnent la latitude et la longitude (indice 2).", "Le croisement 9° 18′ N × 13° 24′ E est Garoua, à ≈ 600 km au nord de Yaoundé (indice 3)."],
      formules: [F("Écrire des coordonnées", "latitude puis longitude", "Garoua : 9° 18′ N ; 13° 24′ E"), F("Différence de latitude", "9° 18′ − 3° 52′", "5° 26′ ≈ 5,4°"), F("Distance nord-sud", "différence × 111 km", "5,4 × 111 ≈ 600 km")],
      reponse: "<p>Pour localiser un lieu avec précision, on utilise ses coordonnées géographiques. Le globe est quadrillé par les parallèles, qui font le tour de la Terre (l'équateur est le parallèle 0°), et par les méridiens, qui vont d'un pôle à l'autre (le méridien de Greenwich est le méridien 0°). La latitude d'un lieu est sa distance à l'équateur, en degrés Nord ou Sud ; sa longitude est sa distance au méridien de Greenwich, en degrés Est ou Ouest. Sur la carte, la ville située au croisement du parallèle 9° 18′ N et du méridien 13° 24′ E est Garoua. Comme 1° de latitude représente environ 111 km, Garoua est à environ (9° 18′ − 3° 52′) ≈ 5,4° × 111 ≈ 600 km au nord de Yaoundé.</p>",
      transfert: "<p>Avec un atlas ou le GPS d'un téléphone, relève les coordonnées de ta ville et donne sa position par rapport à l'équateur et au méridien de Greenwich.</p>" },
    revision: ["<strong>Points cardinaux</strong> : Nord, Sud, Est, Ouest ; le Soleil se lève à l'Est.", "Parallèles : tour de la Terre ; équateur = 0°.", "Méridiens : d'un pôle à l'autre ; Greenwich = 0°.", "Latitude : 0° à 90° N ou S ; longitude : 0° à 180° E ou O.", "On écrit la latitude, puis la longitude.", "1° de latitude ≈ 111 km."],
    exo: "<p>Douala est à 4° 03′ N et Garoua à 9° 18′ N. Calcule la distance nord-sud approximative. <em>(9° 18′ − 4° 03′ = 5° 15′ = 5,25° ; 5,25 × 111 ≈ 583 km.)</em></p>",
    quiz: [q("Le Soleil se lève à…", "l'Est", "l'Ouest", "le Nord", "Et se couche à l'Ouest."), q("Sur la plupart des cartes, le Nord est…", "en haut", "en bas", "à droite", "Indiqué par une flèche N."), q("L'équateur est…", "le parallèle 0°", "le méridien 0°", "le pôle Nord", "Il partage la Terre en deux hémisphères."), q("Le méridien de Greenwich est…", "le méridien 0°", "le parallèle 0°", "la ligne de changement de date", "Près de Londres."), q("Les méridiens vont…", "d'un pôle à l'autre", "d'est en ouest autour de la Terre", "du centre de la Terre", "Ce sont des demi-cercles."), q("La latitude se lit sur…", "les parallèles", "les méridiens", "la légende", "Distance à l'équateur."), q("On écrit les coordonnées dans l'ordre…", "latitude puis longitude", "longitude puis latitude", "n'importe lequel", "Ex. 3° 52′ N, 11° 31′ E."), q("Le Cameroun est dans l'hémisphère…", "Nord", "Sud", "Ouest", "De 2° à 13° de latitude Nord."), q("1° de latitude représente environ…", "111 km", "11 km", "1 111 km", "Sur le terrain."), q("La ville à 9° 18′ N et 13° 24′ E est…", "Garoua", "Douala", "Bertoua", "Dans le Nord du Cameroun.")],
    apc: apc("Des élèves doivent trouver une ville à partir de sa latitude et de sa longitude pour un jeu radio.", "S'orienter, lire les coordonnées géographiques sur une carte quadrillée et calculer une distance nord-sud.")
  });
  VRT_A("6e-geo-tp-localiser-lieu", 2, "Trouve les coordonnées et les distances", function (el) {
    exercice(el, [["La latitude de l'équateur est ___.", ["0°", "90°", "180°"], "C'est le parallèle de départ."], ["Yaoundé (3° 52′ N) est dans l'hémisphère ___.", ["Nord", "Sud", "Ouest"], "N = Nord."], ["Une ville à 13° E est à l'___ du méridien de Greenwich.", ["est", "ouest", "nord"], "E = Est."], ["Le méridien de Greenwich passe près de ___.", ["Londres", "Yaoundé", "Dakar"], "En Angleterre."], ["3° de latitude ≈ ___.", ["333 km", "33 km", "3 330 km"], "3 × 111 = 333 km."], ["Garoua est au ___ de Yaoundé.", ["nord", "sud", "ouest"], "Sa latitude est plus grande."]], "Question suivante", "Question");
  });
})();
