/* Leçons GRATUITES — Histoire de 6e (19/11/2026), demande de Jacques : « Continue l'enrichissement des leçons »,
   « rassure-toi que c'est illustré et que les situations-problèmes sont résolues, les étapes, cartes mentales ».
   Rangs 1, 2, 4 de la progression (aucune leçon n'existait). Gabarit approfondi complet : situation-problème avec
   hypothèses et indices, situation résolue en étapes et formules, 2 planches 2D, 1 planche 3D, simulation,
   entraînement au format de l'examen (évaluation des ressources / des compétences). */
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

  /* ═══════════════ RANG 1 : INTRODUCTION À L'ÉTUDE DE L'HISTOIRE ═══════════════ */
  function table3D() {
    var o = [];
    o.push({ f: "boite", c: [0, -6, 0], d: [460, 6, 240], coul: "#8B6B4A", dessus: "#A68A5E" });
    o.push({ f: "boite", c: [0, 66, 0], d: [380, 10, 170], coul: "#6B4423", dessus: "#8A5A33" });
    [[-180, -75], [180, -75], [-180, 75], [180, 75]].forEach(function (p) { o.push({ f: "boite", c: [p[0], 30, p[1]], d: [10, 60, 10], coul: "#5A3A1E" }); });
    o.push({ f: "boite", c: [-130, 80, -30], d: [70, 16, 90], coul: "#1E499B", dessus: "#F4F1EA" });
    o.push({ f: "cylindre", c: [-30, 71, -40], r: 22, h: 48, n: 14, coul: "#A0522D" });
    o.push({ f: "cylindre", c: [-30, 119, -40], r: 15, h: 6, n: 14, coul: "#7A3E1E" });
    o.push({ f: "cylindre", c: [70, 71, -30], r: 20, h: 40, n: 14, coul: "#C9A06E" });
    o.push({ f: "cylindre", c: [70, 111, -30], r: 21, h: 3, n: 14, coul: "#E8DFC9" });
    o.push({ f: "boite", c: [150, 72, 30], d: [60, 2, 44], coul: "#FBF8F2", dessus: "#E0D8C8" });
    o.push({ f: "boite", c: [150, 74, 30], d: [44, 1, 28], coul: "#4D5163", div: false });
    o.push({ f: "boite", c: [10, 72, 50], d: [120, 2, 30], coul: "#F7C948", dessus: "#F7C948" });
    return o;
  }
  VRT_L("6e-histoire-introduction", {
    c: "6e", m: "histoire", cle: "Introduction à l", titre: "Qu'est-ce que l'Histoire ? Les sources et le temps", duree: 30,
    accroche: "« Mon grand-père dit que notre chefferie a été fondée il y a très longtemps. » « Comment le savoir, s'il n'y a rien d'écrit ? » Comment l'historien connaît-il le passé ?",
    intro: "Un exposé à préparer sur l'histoire d'une chefferie de Bafia te sert de fil rouge : à chaque partie, un indice t'aide à trancher entre trois façons de connaître le passé.",
    objectifs: ["définir l'Histoire et le travail de l'historien", "distinguer les quatre grands types de sources", "se repérer dans le temps : avant et après Jésus-Christ, siècle, millénaire", "calculer une durée et trouver le siècle d'une date"],
    enquete: {
      titre: "L'exposé sur la chefferie",
      svg: svg(640, 220, "Cour d'une concession : un grand-père raconte, assis sur un tabouret, devant deux élèves avec un cahier ; une jarre ancienne et une vieille photo à côté", lin("hiC", ["#F4EDE1", "#E8DFC9"], true),
        "<rect width='640' height='220' fill='url(#hiC)'/><rect y='186' width='640' height='34' fill='#B5834E'/><path d='M60 186V90l60-40l60 40v96Z' fill='#C9A06E' stroke='#8B5A2B' stroke-width='3'/><path d='M40 96l80-56l80 56' fill='none' stroke='#6B4423' stroke-width='10' stroke-linecap='round'/>" +
        perso(290, 100, "#4A2E18", "#7B3F99", "#4D5163") + "<rect x='274' y='170' width='32' height='12' rx='3' fill='#6B4423'/>" + perso(420, 96, "#6B4423", "#1E499B", "#2E3445") + perso(500, 100, "#5A3A1E", "#C2540A", "#2E3445") +
        "<rect x='452' y='130' width='22' height='28' fill='#fff' stroke='#9AA3AF'/><path d='M560 186c-18 0 -22 -40 -8 -54h20c14 14 10 54 -12 54Z' fill='#A0522D' stroke='#6B3A1E'/><rect x='200' y='140' width='40' height='30' fill='#E0D8C8' stroke='#4D5163' stroke-width='2'/>" +
        bulle(200, 30, 210, "C'était il y a très longtemps…", "#F7C948") + bulle(440, 30, 180, "Comment le prouver ?", "#9FC3E8")),
      legende: "À Bafia, deux élèves interrogent le grand-père de l'une d'eux sur l'histoire de la chefferie.",
      contexte: "<p>Pour un exposé d'histoire, Mireille et Samuel veulent raconter la fondation de la chefferie de leur village, près de Bafia. Samuel affirme : « Sans livre, on ne peut rien savoir : seuls les écrits comptent. » Mireille répond : « Mon grand-père connaît tout par cœur : tout ce qu'il dit est vrai. » Leur professeur leur conseille de chercher <strong>plusieurs sortes de traces</strong> : le récit du grand-père, une vieille photographie, une jarre ancienne gardée dans la case du chef, et les archives de la mairie.</p>",
      documents: [{ t: "Le récit du grand-père (tradition orale)", html: "<p>« Notre premier chef est venu du nord avec sa famille, à l'époque de mon arrière-grand-père. Il a planté le premier arbre de la place. »</p>" },
        { t: "Les archives de la commune", html: "<p>Un registre de l'administration coloniale cite le village et son chef en 1912.</p>" }],
      question: "Comment l'historien peut-il connaître le passé, et comment situer une date dans le temps ?",
      tache: "Définis l'Histoire, classe les sources de l'exposé, puis situe dans le temps la fondation de la chefferie.",
      hypotheses: ["Seuls les documents écrits permettent de connaître le passé.", "Le témoignage d'un ancien suffit : tout ce qu'il raconte est exact.", "L'historien croise plusieurs sources (orales, écrites, matérielles, images), les critique, puis les situe sur une frise."]
    },
    parties: [
      { t: "L'Histoire et le travail de l'historien", html: def("Histoire", "Science qui étudie le passé des hommes et des sociétés à partir des traces qu'ils ont laissées, appelées sources.") +
          "<ul><li><strong>L'historien</strong> recherche les traces du passé, les lit et les compare.</li><li>Il fait la <strong>critique des sources</strong> : qui a produit ce document ? quand ? pourquoi ? est-il fiable ?</li><li>Il <strong>croise</strong> les sources : une information confirmée par deux traces différentes est plus sûre.</li></ul>" +
          def("Source historique", "Toute trace du passé qui renseigne l'historien : un récit, un texte, un objet, une image, un monument.") +
          ex("Le registre de 1912 et le récit du grand-père parlent tous deux d'un chef : l'historien rapproche les deux sources pour dater la chefferie.", "Croiser deux sources") +
          astuce("Pour critiquer une source, pose toujours trois questions : Qui ? Quand ? Pourquoi ?"),
        planches: [P2("Le travail de l'historien en trois gestes", "L'historien ne recopie pas le passé : il cherche les traces, les critique, puis les croise pour écrire un récit vérifié.",
          colonnes("Comment travaille l'historien ?", [{ t: "1. Chercher", c: "#1E499B", l: ["récits, archives", "objets, photos", "→ rassembler les traces"] }, { t: "2. Critiquer", c: "#C2540A", l: ["Qui ? Quand ?", "Pourquoi ?", "→ la trace est-elle fiable ?"] }, { t: "3. Croiser", c: "#17784D", l: ["comparer deux sources", "qui se confirment", "→ écrire le récit"] }], 220, "Les trois gestes du travail de l'historien"))],
        fil: { html: "<p>Le registre de 1912 et le récit du grand-père se confirment : une chefferie existait déjà au début du XX<sup>e</sup> siècle. L'historien ne se fie donc pas à <strong>une seule</strong> source : il les compare. Croire qu'un écrit suffit, c'est oublier la mémoire du village.</p>", verdicts: [[0, "rejetee", "Les écrits ne sont qu'une sorte de source : le récit, l'objet et l'image renseignent aussi."]] },
        retenir: "Histoire : étude du passé à partir des sources ; critiquer ; croiser." },
      { t: "Les quatre types de sources", html: "<ul><li><strong>Sources orales</strong> : récits, contes, chants, généalogies transmis de bouche à oreille (tradition orale, griots, anciens).</li><li><strong>Sources écrites</strong> : livres, lettres, registres, journaux, inscriptions.</li><li><strong>Sources matérielles (archéologiques)</strong> : outils, poteries, ossements, monuments, bijoux.</li><li><strong>Sources iconographiques</strong> : dessins, peintures, photographies, gravures sur roche.</li></ul>" +
          formule("sources = orales + écrites + matérielles + iconographiques") +
          ex("Dans l'exposé : le récit du grand-père est une source orale, le registre une source écrite, la jarre une source matérielle, la vieille photographie une source iconographique.", "Classer les sources de l'exposé") +
          attention("Une source orale n'est pas fausse, mais elle peut se transformer en passant de génération en génération : il faut la comparer à d'autres sources.") +
          savais("En Afrique, la tradition orale a longtemps été la principale mémoire des peuples. L'historien malien Amadou Hampâté Bâ disait qu'en Afrique, un vieillard qui meurt, c'est une bibliothèque qui brûle."),
        planches: [{ type: "3d", titre: "La table de l'historien", legende: "Tourne la table : un livre et des archives (sources écrites), une jarre et une poterie anciennes (sources matérielles), une vieille photographie (source iconographique) et la feuille où l'élève note le récit du grand-père (source orale).", modele: { h: 340, rx: -22, ry: 28, echelle: 0.85, alt: "Table en bois avec un livre, deux poteries, une photographie et une feuille de notes", objets: table3D(), etiquettes: [{ p: [-130, 92, -30], t: "source écrite", cote: "g" }, { p: [-30, 125, -40], t: "source matérielle", cote: "g" }, { p: [150, 76, 30], t: "source iconographique", cote: "d" }, { p: [10, 76, 50], t: "source orale notée", cote: "d" }] } }],
        fil: { html: "<p>Le récit du grand-père est précieux, mais il dit « à l'époque de mon arrière-grand-père » : la date reste vague et a pu se déformer. Comparé au registre de 1912, il devient une source <strong>confirmée</strong>. Le témoignage seul ne suffit pas.</p>", verdicts: [[1, "rejetee", "Un témoignage, même sincère, doit être comparé à d'autres sources."]] },
        retenir: "Sources orales ; écrites ; matérielles ; iconographiques." },
      { t: "Se repérer dans le temps", html: "<ul><li>Notre calendrier compte les années à partir de la naissance de Jésus-Christ : <strong>avant J.-C.</strong> (av. J.-C.) et <strong>après J.-C.</strong> (apr. J.-C.). Il n'y a pas d'année zéro.</li><li>Un <strong>siècle</strong> = 100 ans ; un <strong>millénaire</strong> = 1 000 ans. On écrit les siècles en chiffres romains : XIX<sup>e</sup>, XX<sup>e</sup>, XXI<sup>e</sup> siècle.</li><li>Une <strong>frise chronologique</strong> place les événements dans l'ordre, à une échelle régulière.</li></ul>" +
          formule("siècle d'une date = (centaines + 1) ; ex. 1912 → 19 + 1 = XX<sup>e</sup> siècle") +
          formule("durée entre deux dates apr. J.-C. = date récente − date ancienne") +
          ex("De 1912 à 2026 : 2026 − 1912 = 114 ans. La chefferie existe depuis au moins 114 ans.", "Calculer une durée") +
          ex("Entre 500 av. J.-C. et 2026 : 500 + 2026 − 1 = 2 525 ans (on retire 1 car il n'y a pas d'année zéro).", "Une durée qui traverse la naissance de J.-C.") +
          astuce("Attention aux années rondes : l'an 1900 appartient encore au XIX<sup>e</sup> siècle, car un siècle va de l'année 1 à l'année 100 (ici 1801 à 1900)."),
        planches: [P2("La frise de la chefferie", "Les dates de l'exposé placées sur une frise : le récit du grand-père, le registre de 1912, l'indépendance du Cameroun et l'exposé de 2026.",
          frise("La chefferie sur une frise", [{ a: "vers 1880 ?", l: ["arrivée du premier chef", "(récit du grand-père)"], c: "#7B3F99" }, { a: "1912", l: ["le chef cité", "dans un registre"], c: "#1E499B" }, { a: "1960", l: ["indépendance", "du Cameroun"], c: "#17784D" }, { a: "2026", l: ["l'exposé", "de Mireille et Samuel"], c: "#C2540A" }], 230, "Frise chronologique de la chefferie de 1880 à 2026"))],
        fil: { html: "<p>En croisant le récit (« l'arrière-grand-père », soit environ trois ou quatre générations, vers 1880) et le registre de 1912, les élèves situent la fondation à la fin du XIX<sup>e</sup> siècle et la placent sur une frise. C'est la démarche de l'historien.</p>", verdicts: [[2, "validee", "Croiser les sources puis les situer sur une frise : c'est la méthode de l'historien."]] },
        retenir: "Avant et après Jésus-Christ ; siècle = 100 ans ; 1912 → XXe siècle ; durée = date récente − date ancienne." },
      { t: "Entraînement au format de l'examen", html: integ("Une poterie ancienne retrouvée dans un village est une source…", ["orale", "écrite", "matérielle", "iconographique"], "Matérielle", "C'est un objet : une source archéologique.", "Classe : un conte, une lettre de 1914, une hache en pierre, une photographie de 1960.", "Conte : orale ; lettre : écrite ; hache : matérielle ; photographie : iconographique.", "Ton petit frère dit : « L'histoire, c'est apprendre des dates par cœur, ça ne sert à rien. »", "En t'appuyant sur ta leçon, explique-lui en quelques lignes à quoi sert l'Histoire et comment on la construit.", "L'Histoire permet de comprendre d'où nous venons : notre village, notre pays, nos coutumes. On la construit avec des sources variées (récits des anciens, écrits, objets, images) que l'on critique et que l'on compare. Les dates servent à mettre les événements dans l'ordre pour les comprendre."), retenir: "Savoir-être : respect de la mémoire des anciens et esprit critique." }
    ],
    denouement: { titre: "L'exposé est prêt", etapes: ["Définir l'Histoire : l'étude du passé à partir des sources, critiquées et croisées (indice 1).", "Classer les sources : orale (récit), écrite (registre), matérielle (jarre), iconographique (photo) (indice 2).", "Situer la fondation : fin du XIXe siècle, chefferie attestée en 1912, soit au moins 114 ans en 2026 (indice 3)."],
      formules: [F("Classer", "sources = orales + écrites + matérielles + iconographiques", "récit / registre / jarre / photo"), F("Trouver le siècle", "siècle = centaines + 1", "1912 → 19 + 1 = XXe siècle ; vers 1880 → XIXe siècle"), F("Calculer la durée", "durée = date récente − date ancienne", "2026 − 1912 = 114 ans")],
      reponse: "<p>L'Histoire est la science qui étudie le passé des hommes à partir des traces qu'ils ont laissées. Pour l'exposé, Mireille et Samuel disposent de quatre types de sources : le récit du grand-père (source orale), le registre de 1912 (source écrite), la jarre de la case du chef (source matérielle) et la vieille photographie (source iconographique). Aucune ne suffit seule : ils les critiquent (qui ? quand ? pourquoi ?) puis les croisent. Le récit situe l'arrivée du premier chef vers la fin du XIX<sup>e</sup> siècle ; le registre prouve que la chefferie existait en 1912, au XX<sup>e</sup> siècle. En 2026, elle a donc au moins 2026 − 1912 = 114 ans.</p>",
      transfert: "<p>Interroge un ancien de ta famille sur un événement de sa jeunesse. Note son récit, cherche une autre source qui le confirme (photo, document, objet), puis place l'événement sur une frise.</p>" },
    revision: ["<strong>Histoire</strong> : étude du passé des hommes à partir des sources.", "Le travail de l'historien : chercher, critiquer (qui ? quand ? pourquoi ?), croiser.", "Quatre sources : orales, écrites, matérielles, iconographiques.", "Avant et après Jésus-Christ, pas d'année zéro.", "Siècle = 100 ans ; millénaire = 1 000 ans ; 1912 → XXe siècle.", "Durée = date récente − date ancienne."],
    exo: "<p>Dans quel siècle se situent 1884, 1960 et 2026 ? <em>(XIXe ; XXe ; XXIe.)</em></p>",
    quiz: [q("L'Histoire étudie…", "le passé des hommes à partir des sources", "l'avenir des sociétés", "seulement les rois", "Elle s'appuie sur les traces du passé."), q("Un récit transmis par un griot est une source…", "orale", "écrite", "matérielle", "Elle passe de bouche à oreille."), q("Une hache en pierre est une source…", "matérielle", "iconographique", "orale", "C'est un objet, étudié par l'archéologie."), q("Une photographie ancienne est une source…", "iconographique", "écrite", "orale", "Une image du passé."), q("Critiquer une source, c'est se demander…", "qui l'a produite, quand et pourquoi", "si elle est jolie", "combien elle coûte", "Pour juger de sa fiabilité."), q("L'année 1912 appartient au…", "XXe siècle", "XIXe siècle", "XIIe siècle", "19 centaines + 1 = XXe."), q("Un siècle dure…", "100 ans", "10 ans", "1 000 ans", "Un millénaire dure 1 000 ans."), q("De 1960 à 2026, il s'est écoulé…", "66 ans", "76 ans", "56 ans", "2026 − 1960 = 66."), q("Dans notre calendrier, il n'y a pas…", "d'année zéro", "d'année 1", "de siècle", "On passe de 1 av. J.-C. à 1 apr. J.-C."), q("Croiser les sources, c'est…", "comparer des traces différentes qui se confirment", "n'en garder qu'une", "les recopier", "Une information confirmée est plus sûre.")],
    apc: apc("Lors d'une fête au village, deux anciens racontent différemment la fondation de la chefferie.", "Montrer, avec la méthode de l'historien, comment établir ce qui s'est passé.")
  });
  VRT_A("6e-histoire-introduction", 1, "Quel type de source ? Classe chaque trace du passé", function (el) {
    exercice(el, [["Un chant que les anciens chantent depuis des générations est une source ___.", ["orale", "écrite", "matérielle"], "Transmis de bouche à oreille."], ["Une lettre écrite en 1915 par un instituteur est une source ___.", ["écrite", "orale", "iconographique"], "Un texte."], ["Une jarre retrouvée dans la terre est une source ___.", ["matérielle", "orale", "écrite"], "Un objet étudié par l'archéologue."], ["Une peinture sur la paroi d'un rocher est une source ___.", ["iconographique", "écrite", "orale"], "Une image."], ["Un registre de naissances de la mairie est une source ___.", ["écrite", "matérielle", "orale"], "Un document écrit."], ["Un bracelet en bronze ancien est une source ___.", ["matérielle", "iconographique", "orale"], "Un objet."]], "Trace suivante", "Trace");
  });

  /* ═══════════════ RANG 2 : DOSSIER 1, LES VESTIGES HISTORIQUES ═══════════════ */
  function coupe3D() {
    var o = [], couches = [["#7A5530", "#8A6A40"], ["#A0784E", "#B08A5E"], ["#C9A06E", "#D8B47A"], ["#8B6B4A", "#9A7A58"]];
    couches.forEach(function (c, i) { o.push({ f: "boite", c: [0, 20 + i * 40, 0], d: [420, 40, 160], coul: c[0], dessus: c[1] }); });
    o.push({ f: "boite", c: [0, 182, 0], d: [420, 4, 160], coul: "#5A8A3A", dessus: "#6FA04A" });
    /* objets posés sur la face avant de la tranchée (z < −80) pour rester visibles */
    o.push({ f: "cylindre", c: [-120, 90, -94], r: 14, h: 28, n: 12, coul: "#A0522D" });
    o.push({ f: "cylindre", c: [-120, 118, -94], r: 9, h: 4, n: 12, coul: "#7A3E1E" });
    o.push({ f: "sphere", c: [50, 62, -92], r: 10, coul: "#EFE8D8" });
    o.push({ f: "boite", c: [84, 58, -90], d: [44, 7, 8], coul: "#EFE8D8" });
    o.push({ f: "poly", pts: [[118, 8, -88], [170, 22, -88], [160, 36, -88], [114, 30, -88]], coul: "#C8C8C8" });
    o.push({ f: "boite", c: [-30, 150, -88], d: [40, 12, 8], coul: "#E0B040" });
    return o;
  }
  VRT_L("6e-histoire-vestiges", {
    c: "6e", m: "histoire", cle: "Dossier 1 : Les vestiges", titre: "Dossier 1 : Les vestiges historiques", duree: 30,
    accroche: "Des ouvriers creusent une route près de Yaoundé et trouvent des morceaux de poterie. « Jetons ça, ce sont de vieux débris ! » « Non, c'est peut-être un trésor du passé ! » Que faire ?",
    intro: "La découverte d'un chantier routier près de Yaoundé te sert de fil rouge : à chaque partie, un indice t'aide à trancher entre trois attitudes face aux vestiges.",
    objectifs: ["définir un vestige et en citer plusieurs sortes", "présenter des sites archéologiques du Cameroun", "expliquer comment on date un vestige (couches du sol, carbone 14)", "adopter les bons gestes pour protéger le patrimoine"],
    enquete: {
      titre: "La découverte du chantier",
      svg: svg(640, 220, "Chantier de route : une pelleteuse jaune, une tranchée qui montre des couches de terre, des tessons de poterie au sol et deux ouvriers", lin("veC", ["#DDEBF5", "#F4EDE1"], true),
        "<rect width='640' height='220' fill='url(#veC)'/><rect y='150' width='640' height='70' fill='#A0784E'/><rect y='170' width='640' height='22' fill='#8B6B4A'/><rect y='192' width='640' height='28' fill='#7A5530'/>" +
        "<rect x='60' y='96' width='110' height='50' rx='6' fill='#F7C948' stroke='#B07A00' stroke-width='3'/><rect x='140' y='70' width='30' height='30' fill='#DCEBF5' stroke='#B07A00' stroke-width='3'/><path d='M170 110L240 80L270 120' fill='none' stroke='#B07A00' stroke-width='8' stroke-linecap='round'/><circle cx='80' cy='150' r='12' fill='#2E3445'/><circle cx='150' cy='150' r='12' fill='#2E3445'/>" +
        "<path d='M330 176c-8 -2 -10 -10 -2 -14l14 2c6 4 2 12 -12 12Z' fill='#C46A2B' stroke='#6B3A1E'/><path d='M360 184c-6 -4 -2 -12 6 -10l10 6c2 6 -8 8 -16 4Z' fill='#A0522D' stroke='#6B3A1E'/>" +
        perso(440, 66, "#5A3A1E", "#C2540A", "#2E3445") + perso(540, 66, "#6B4423", "#17784D", "#2E3445") +
        bulle(380, 20, 120, "On jette ?", "#F7C948") + bulle(500, 20, 130, "Un trésor ?", "#9FC3E8")),
      legende: "Près de Yaoundé, un chantier routier met au jour des morceaux de poterie dans une couche profonde du sol.",
      contexte: "<p>En élargissant une route, une pelleteuse ouvre une tranchée de deux mètres. Dans une couche de terre sombre, à 1,50 m de profondeur, apparaissent des morceaux de poterie décorée et des restes de charbon de bois. M. Essomba, le chef de chantier, veut tout jeter : « Ce sont de vieux débris sans valeur. » Un ouvrier propose de les vendre au marché. Sa fille, élève de 6e, pense qu'il faut prévenir le musée, car « ces débris racontent peut-être l'histoire des premiers habitants ».</p>",
      documents: [{ t: "Un site archéologique de Yaoundé", html: "<p>À Obobogo, dans la périphérie de Yaoundé, des archéologues ont étudié des fosses contenant des poteries, des meules et des restes de foyers : elles témoignent de villages de cultivateurs installés il y a environ 3 000 ans.</p>" },
        { t: "La loi", html: "<p>Au Cameroun, les objets et sites qui intéressent l'histoire font partie du patrimoine culturel national : leur découverte doit être signalée aux autorités.</p>" }],
      question: "Les morceaux de poterie du chantier ont-ils une valeur historique, et comment savoir de quand ils datent ?",
      tache: "Définis un vestige, montre ce que ces débris peuvent apprendre, explique comment les dater, puis dis ce qu'il faut faire.",
      hypotheses: ["Ce sont de vieux débris sans valeur : on peut les jeter.", "Ce sont des objets anciens : on peut les vendre au marché.", "Ce sont des vestiges : ils renseignent sur les premiers habitants ; il faut les laisser en place et prévenir les spécialistes pour les étudier et les dater."]
    },
    parties: [
      { t: "Qu'est-ce qu'un vestige ?", html: def("Vestige", "Reste matériel laissé par les hommes du passé : outil, poterie, ossement, foyer, construction, gravure. C'est une source matérielle de l'Histoire.") +
          "<ul><li><strong>Les outils</strong> : pierres taillées ou polies, haches, meules à grains, objets en fer.</li><li><strong>Les restes humains et animaux</strong> : ossements, dents, fossiles.</li><li><strong>Les objets de la vie quotidienne</strong> : poteries, perles, bijoux, charbon des foyers.</li><li><strong>Les constructions</strong> : murs, tombes, fours à fer.</li><li><strong>L'art</strong> : gravures et peintures sur les rochers (art rupestre).</li></ul>" +
          def("Archéologie", "Science qui étudie le passé des hommes à partir des vestiges retrouvés, le plus souvent par des fouilles du sol.") +
          ex("Un tesson de poterie décoré dit comment les gens cuisaient et conservaient leurs aliments ; le charbon de bois montre qu'ils faisaient du feu à cet endroit : il y avait un foyer, donc un habitat.", "Ce que disent les débris du chantier") +
          astuce("Un vestige « parle » quand on sait où il était : sa position dans le sol compte autant que l'objet lui-même. C'est pourquoi on ne le déplace pas avant l'archéologue."),
        planches: [P2("Les familles de vestiges", "Cinq familles de vestiges et ce que chacune apprend à l'historien sur la vie des hommes du passé.",
          colonnes("Que nous apprennent les vestiges ?", [{ t: "Outils", c: "#4D5163", l: ["pierre, fer, meules", "→ le travail"] }, { t: "Ossements", c: "#7B3F99", l: ["humains, animaux", "→ l'alimentation, la santé"] }, { t: "Poteries", c: "#C2540A", l: ["tessons décorés", "→ la vie quotidienne"] }, { t: "Constructions", c: "#1E499B", l: ["tombes, fours", "→ l'habitat, les croyances"] }, { t: "Art rupestre", c: "#17784D", l: ["gravures, peintures", "→ la pensée, les animaux"] }], 200, "Cinq familles de vestiges et ce qu'elles apprennent"))],
        fil: { html: "<p>Les « débris » sont des tessons de poterie et du charbon : ce sont des <strong>vestiges</strong>. Ils montrent qu'il y avait là un foyer et des gens qui fabriquaient des pots. Les jeter, ce serait détruire une page d'histoire qui n'est écrite nulle part ailleurs.</p>", verdicts: [[0, "rejetee", "Des tessons et un foyer sont des vestiges : ils renseignent sur les premiers habitants."]] },
        retenir: "Vestige : reste matériel du passé ; outils, ossements, poteries, constructions, art rupestre." },
      { t: "Des vestiges au Cameroun", html: "<ul><li><strong>Shum Laka</strong> (Nord-Ouest, près de Bamenda) : un abri sous roche occupé par des hommes depuis des dizaines de milliers d'années ; on y a retrouvé des outils de pierre et des sépultures.</li><li><strong>Obobogo</strong> (Yaoundé) : des fosses avec poteries, meules et foyers de villages de cultivateurs d'il y a environ 3 000 ans.</li><li><strong>Bidzar</strong> (Nord) : des milliers de gravures rupestres, des cercles et des motifs taillés dans le marbre.</li><li><strong>Le pays sao</strong> (Extrême-Nord) : jarres funéraires, statuettes en terre cuite, objets en bronze.</li></ul>" +
          ex("Les gravures de Bidzar ne sont ni des livres ni des récits : ce sont des images taillées dans la pierre, qui prouvent que des hommes vivaient et pensaient là bien avant l'écriture.", "Lire un vestige sans écriture") +
          attention("Un vestige vendu au marché perd sa valeur historique : on ne sait plus d'où il vient ni à quelle profondeur il se trouvait. Le trafic d'objets anciens appauvrit l'histoire de tous.") +
          savais("Le Musée national de Yaoundé conserve et expose des objets retrouvés au Cameroun, dont des pièces de la civilisation sao."),
        planches: [P2("La carte des vestiges du Cameroun", "Quatre grands sites archéologiques du Cameroun, du nord au sud, et ce que chacun nous apprend.",
          colonnes("Quatre sites archéologiques du Cameroun", [{ t: "Pays sao", c: "#C2540A", l: ["Extrême-Nord", "jarres, bronzes", "terre cuite"] }, { t: "Bidzar", c: "#17784D", l: ["Nord", "gravures rupestres", "dans le marbre"] }, { t: "Shum Laka", c: "#7B3F99", l: ["Nord-Ouest", "abri sous roche", "outils, sépultures"] }, { t: "Obobogo", c: "#1E499B", l: ["Centre (Yaoundé)", "poteries, meules", "≈ 3 000 ans"] }], 210, "Quatre sites archéologiques du Cameroun"))],
        fil: { html: "<p>Vendre les tessons au marché, c'est leur ôter leur histoire : sans leur emplacement exact, l'archéologue ne peut plus les dater ni les comparer aux vestiges d'Obobogo, tout proche. Ces objets appartiennent au <strong>patrimoine national</strong>, pas à celui qui les trouve.</p>", verdicts: [[1, "rejetee", "Un vestige vendu perd sa valeur historique ; il appartient au patrimoine de tous."]] },
        retenir: "Shum Laka ; Obobogo ; Bidzar ; pays sao : le passé du Cameroun dans le sol." },
      { t: "Dater et protéger les vestiges", html: "<ul><li><strong>La stratigraphie</strong> : le sol est fait de couches déposées les unes sur les autres. En règle générale, plus une couche est profonde, plus elle est ancienne.</li><li><strong>Le carbone 14</strong> : tout être vivant contient du carbone 14 ; après sa mort, la moitié disparaît environ tous les 5 730 ans. En mesurant ce qui reste dans un charbon de bois ou un os, on calcule son âge.</li><li><strong>Protéger</strong> : ne pas déplacer, photographier, signaler au chef de quartier, à la mairie ou au musée.</li></ul>" +
          formule("plus profond = plus ancien (stratigraphie)") +
          formule("carbone 14 : il reste ½ après ≈ 5 730 ans, ¼ après ≈ 11 460 ans") +
          ex("Si le charbon du chantier ne contient plus que la moitié de son carbone 14 de départ, il a environ 5 730 ans ; s'il en contient le quart, il a environ 5 730 × 2 = 11 460 ans.", "Dater le charbon du chantier") +
          astuce("Pour retenir la stratigraphie, pense à une pile de cahiers : celui du dessous a été posé en premier."),
        planches: [{ type: "3d", titre: "La coupe du sol du chantier", legende: "Tourne la coupe : quatre couches de terre posées les unes sur les autres. Tout en bas, l'outil de pierre est le plus ancien ; au milieu, les ossements et la poterie ; près de la surface, l'objet en métal est le plus récent. Plus on descend, plus on remonte le temps.", modele: { h: 340, rx: -14, ry: 30, echelle: 0.8, alt: "Bloc de terre en quatre couches de couleurs différentes contenant un outil de pierre, des os, une poterie et un objet en métal", objets: coupe3D(), etiquettes: [{ p: [-30, 158, -92], t: "objet en métal : récent", cote: "g" }, { p: [-120, 122, -98], t: "poterie", cote: "g" }, { p: [70, 66, -96], t: "ossements", cote: "d" }, { p: [146, 30, -92], t: "outil de pierre : le plus ancien", cote: "d" }] } }],
        fil: { html: "<p>La poterie se trouve à 1,50 m, sous des couches plus récentes : elle est ancienne. Le charbon de bois qui l'accompagne peut être daté au carbone 14. La fille du chef de chantier a raison : on laisse tout en place, on photographie et on <strong>prévient le musée</strong> pour que les spécialistes étudient et datent les vestiges.</p>", verdicts: [[2, "validee", "Laisser en place, signaler, faire dater : c'est ainsi qu'un vestige devient une source d'histoire."]] },
        retenir: "Plus profond = plus ancien ; carbone 14 : moitié tous les 5 730 ans ; signaler toute découverte." },
      { t: "Entraînement au format de l'examen", html: integ("Dans une coupe du sol, la couche la plus ancienne est généralement…", ["celle du dessus", "celle du milieu", "celle du dessous", "celle qui est la plus colorée"], "Celle du dessous", "Les couches se déposent les unes sur les autres : la plus profonde est la plus ancienne.", "Cite deux sites archéologiques du Cameroun et dis ce qu'on y a trouvé.", "Obobogo (Yaoundé) : poteries, meules, foyers d'il y a environ 3 000 ans ; Bidzar (Nord) : gravures rupestres ; Shum Laka (Nord-Ouest) : outils et sépultures ; pays sao : jarres et bronzes.", "En creusant une fosse dans votre cour, ton oncle trouve une hache en pierre polie. Il veut l'offrir à un touriste contre de l'argent.", "Rédige quelques lignes pour le convaincre de faire autrement.", "Cette hache est un vestige : elle raconte la vie des hommes qui vivaient ici il y a très longtemps. Vendue, elle perd son histoire, car on ne saura plus d'où elle vient. Il faut la garder telle quelle, noter l'endroit et la profondeur, et prévenir la mairie ou le musée : c'est un bien du patrimoine national."), retenir: "Savoir-être : respect et protection du patrimoine culturel." }
    ],
    denouement: { titre: "Le bon geste du chantier", etapes: ["Reconnaître des vestiges : tessons et charbon d'un foyer ancien (indice 1).", "Comprendre leur valeur : ils appartiennent au patrimoine, comme ceux d'Obobogo (indice 2).", "Dater et protéger : couche profonde, carbone 14, signalement au musée (indice 3)."],
      formules: [F("Identifier", "vestige = reste matériel du passé", "tessons de poterie + charbon = foyer ancien"), F("Dater par les couches", "plus profond = plus ancien", "1,50 m sous des couches récentes → ancien"), F("Dater au carbone 14", "½ restant → ≈ 5 730 ans ; ¼ → ≈ 11 460 ans", "5 730 × 2 = 11 460")],
      reponse: "<p>Les morceaux de poterie et le charbon de bois du chantier ne sont pas des débris sans valeur : ce sont des vestiges, c'est-à-dire des restes matériels laissés par les hommes du passé. Ils montrent qu'un foyer existait à cet endroit et que ses habitants fabriquaient des poteries, comme les villageois d'Obobogo il y a environ 3 000 ans. Trouvés à 1,50 m de profondeur, sous des couches plus récentes, ils sont anciens ; le charbon pourra être daté au carbone 14. Il ne faut ni les jeter ni les vendre, car ils appartiennent au patrimoine national : on les laisse en place, on photographie, on note la profondeur et on prévient le musée.</p>",
      transfert: "<p>Observe un vieux mur, une tombe ancienne ou un objet gardé dans ta famille. Quel type de vestige est-ce ? Que t'apprend-il sur la vie d'autrefois ?</p>" },
    revision: ["<strong>Vestige</strong> : reste matériel laissé par les hommes du passé.", "Familles : outils, ossements, poteries, constructions, art rupestre.", "Archéologie : étude du passé par les vestiges et les fouilles.", "Au Cameroun : Shum Laka, Obobogo, Bidzar, pays sao.", "Stratigraphie : plus profond = plus ancien.", "Carbone 14 : la moitié disparaît environ tous les 5 730 ans ; signaler toute découverte."],
    exo: "<p>Range de la plus ancienne à la plus récente : un objet en métal à 40 cm, un outil de pierre à 1,80 m, une poterie à 1 m. <em>(Outil de pierre ; poterie ; objet en métal.)</em></p>",
    quiz: [q("Un vestige est…", "un reste matériel laissé par les hommes du passé", "un récit d'un ancien", "un livre d'histoire", "C'est une source matérielle."), q("La science qui étudie les vestiges s'appelle…", "l'archéologie", "la géographie", "la biologie", "Elle fouille le sol."), q("Les gravures de Bidzar se trouvent…", "dans le Nord du Cameroun", "à Douala", "à Kribi", "Gravures rupestres taillées dans le marbre."), q("À Obobogo, près de Yaoundé, on a trouvé…", "des poteries, des meules et des foyers", "des pyramides", "des gratte-ciel", "Des villages de cultivateurs d'il y a environ 3 000 ans."), q("Shum Laka est…", "un abri sous roche du Nord-Ouest", "un fleuve", "un royaume", "Occupé par des hommes depuis très longtemps."), q("Dans le sol, la couche la plus ancienne est en général…", "la plus profonde", "la plus haute", "la plus mince", "C'est la stratigraphie."), q("Le carbone 14 sert à…", "dater un os ou un charbon", "fabriquer des poteries", "construire des routes", "On mesure ce qui reste après la mort de l'être vivant."), q("La moitié du carbone 14 disparaît environ tous les…", "5 730 ans", "57 ans", "573 000 ans", "Si la moitié reste, l'objet a environ 5 730 ans."), q("Si tu trouves un vestige, tu dois…", "le laisser en place et prévenir les autorités", "le vendre", "le jeter", "Il appartient au patrimoine national."), q("L'art rupestre, ce sont…", "des gravures et peintures sur les rochers", "des chansons", "des lois écrites", "Des images taillées ou peintes dans la pierre.")],
    apc: apc("Des enfants ramassent des tessons anciens près d'un chantier pour jouer.", "Expliquer pourquoi ces objets sont précieux et comment les protéger.")
  });
  VRT_A("6e-histoire-vestiges", 2, "Fouille la coupe : date chaque objet par sa couche", function (el) {
    exercice(el, [["Un outil de pierre trouvé à 2 m de profondeur est ___ qu'une poterie trouvée à 1 m.", ["plus ancien", "plus récent", "du même âge"], "Plus profond = plus ancien."], ["Une canette en métal trouvée à 10 cm est ___.", ["très récente", "très ancienne", "préhistorique"], "Près de la surface : récent."], ["Un charbon qui garde la moitié de son carbone 14 a environ ___.", ["5 730 ans", "57 ans", "57 300 ans"], "Une demi-vie : ≈ 5 730 ans."], ["Un os qui garde le quart de son carbone 14 a environ ___.", ["11 460 ans", "2 865 ans", "5 730 ans"], "Deux demi-vies : 5 730 × 2."], ["Pour qu'un vestige garde sa valeur, il faut noter ___ où il se trouvait.", ["la profondeur", "le prix", "la couleur du ciel"], "Sa position dans le sol permet de le dater."], ["Une découverte archéologique doit être signalée au ___.", ["musée ou à la mairie", "marché", "touriste"], "Elle appartient au patrimoine national."]], "Objet suivant", "Objet");
  });

  /* ═══════════════ RANG 4 : LES PREMIERS HOMMES ET LEUR MODE DE VIE ═══════════════ */
  function campement3D() {
    var o = [];
    o.push({ f: "boite", c: [0, -6, 0], d: [480, 6, 260], coul: "#8A9A5B", dessus: "#9AAA6B" });
    [[-130, 40], [120, 60]].forEach(function (p) {
      o.push({ f: "poly", pts: [[p[0] - 50, 0, p[1] - 40], [p[0], 90, p[1]], [p[0] + 50, 0, p[1] - 40]], coul: "#8B6B4A" });
      o.push({ f: "poly", pts: [[p[0] + 50, 0, p[1] - 40], [p[0], 90, p[1]], [p[0] + 50, 0, p[1] + 40]], coul: "#7A5A3A" });
      o.push({ f: "poly", pts: [[p[0] - 50, 0, p[1] - 40], [p[0], 90, p[1]], [p[0] - 50, 0, p[1] + 40]], coul: "#9A7A58" });
    });
    [0, 1, 2, 3, 4, 5].forEach(function (k) { var a = k * Math.PI / 3; o.push({ f: "sphere", c: [Math.cos(a) * 26, 6, -60 + Math.sin(a) * 26], r: 7, coul: "#7A7A7A" }); });
    o.push({ f: "cylindre", c: [0, 0, -60], r: 14, h: 26, n: 10, coul: "#E8842C" });
    o.push({ f: "cylindre", c: [0, 26, -60], r: 7, h: 18, n: 10, coul: "#F7C948" });
    o.push({ f: "poly", pts: [[160, 4, -70], [182, 20, -70], [170, 30, -70], [150, 16, -70]], coul: "#6B6B6B" });
    o.push({ f: "boite", c: [-60, 4, -100], d: [70, 6, 10], coul: "#6B4423" });
    o.push({ f: "sphere", c: [-170, 10, -90], r: 10, coul: "#C62828" });
    o.push({ f: "sphere", c: [-150, 10, -96], r: 9, coul: "#C62828" });
    return o;
  }
  VRT_L("6e-histoire-premiers-hommes", {
    c: "6e", m: "histoire", cle: "Les premiers hommes", titre: "Les premiers hommes et leur mode de vie", duree: 30,
    accroche: "Dans un dessin animé, un homme préhistorique chevauche un dinosaure. « C'est comme ça que vivaient les premiers hommes ! » Vraiment ?",
    intro: "Une soirée télé en famille à Garoua te sert de fil rouge : à chaque partie, un indice t'aide à trancher entre trois idées sur les premiers hommes.",
    objectifs: ["montrer que l'Afrique est le berceau de l'humanité", "présenter les grandes étapes de l'évolution humaine", "décrire le mode de vie des premiers hommes (Paléolithique)", "calculer des écarts de temps très longs"],
    enquete: {
      titre: "Le dessin animé de Garoua",
      svg: svg(640, 220, "Salon : une famille regarde un téléviseur qui montre un homme préhistorique sur un dinosaure ; un élève tient un manuel d'histoire", lin("phC", ["#FBEFD8", "#F4F1EA"], true),
        "<rect width='640' height='220' fill='url(#phC)'/><rect y='186' width='640' height='34' fill='#8A6A4A'/><rect x='220' y='30' width='200' height='120' rx='8' fill='#1F2328'/><rect x='230' y='40' width='180' height='100' fill='#9FC3E8'/>" +
        "<path d='M260 120c10 -30 40 -40 70 -30l30 -20l10 10l-20 20c10 10 10 20 0 20Z' fill='#5A8A3A'/><circle cx='320' cy='78' r='6' fill='#6B4423'/><rect x='316' y='84' width='8' height='14' fill='#8B6B4A'/>" +
        "<rect x='300' y='150' width='40' height='36' fill='#5A3A1E'/>" + perso(110, 100, "#5A3A1E", "#7B3F99", "#2E3445") + perso(520, 100, "#6B4423", "#1E499B", "#2E3445") + "<rect x='536' y='124' width='26' height='34' fill='#fff' stroke='#C2540A' stroke-width='2'/>" +
        bulle(20, 46, 160, "C'était comme ça !", "#F7C948") + bulle(450, 40, 180, "Mon manuel dit non…", "#9FC3E8")),
      legende: "À Garoua, une famille regarde un dessin animé où un homme préhistorique monte un dinosaure.",
      contexte: "<p>Le petit frère d'Oumarou est sûr que les premiers hommes « vivaient avec les dinosaures ». Sa sœur aînée ajoute : « Et ils habitaient déjà des villages, avec des champs, comme au village de grand-père. » Oumarou, en 6e, ouvre son manuel : il y lit que les plus anciens ancêtres de l'homme ont été trouvés <strong>en Afrique</strong>, et qu'ils vivaient de chasse et de cueillette, en se déplaçant sans cesse.</p>",
      documents: [{ t: "Quelques découvertes en Afrique", html: "<p>Toumaï, au Tchad, voisin du Cameroun : environ 7 millions d'années. Lucy, en Éthiopie : environ 3,2 millions d'années. Les plus anciens fossiles d'<em>Homo sapiens</em> connus, au Maroc : environ 300 000 ans.</p>" },
        { t: "Les dinosaures", html: "<p>Les grands dinosaures ont disparu il y a environ 66 millions d'années.</p>" }],
      question: "Où et comment vivaient les premiers hommes, et ont-ils connu les dinosaures ?",
      tache: "Situe l'apparition des premiers hommes, présente les étapes de leur évolution, puis décris leur mode de vie.",
      hypotheses: ["Les premiers hommes vivaient en même temps que les dinosaures.", "Les premiers hommes vivaient déjà dans des villages et cultivaient des champs.", "Les premiers hommes sont apparus en Afrique, des millions d'années après les dinosaures ; ils étaient nomades et vivaient de chasse, de pêche et de cueillette."]
    },
    parties: [
      { t: "L'Afrique, berceau de l'humanité", html: def("Hominidés (hominines)", "Famille des ancêtres de l'homme et de l'homme actuel, qui se tiennent debout et marchent sur deux jambes (bipèdes).") +
          "<ul><li><strong>Toumaï</strong> (Tchad, environ 7 millions d'années) : l'un des plus anciens ancêtres connus.</li><li><strong>Lucy</strong> (Éthiopie, environ 3,2 millions d'années) : une australopithèque, déjà bipède.</li><li>Tous les plus anciens fossiles d'hominidés ont été trouvés <strong>en Afrique</strong> : c'est pourquoi on dit que l'Afrique est le <strong>berceau de l'humanité</strong>.</li></ul>" +
          def("Fossile", "Reste ou trace d'un être vivant très ancien conservé dans les roches (os, dents, empreintes).") +
          formule("écart de temps = date la plus ancienne − date la plus récente") +
          ex("Dinosaures disparus il y a 66 millions d'années ; Toumaï il y a 7 millions d'années : 66 − 7 = 59 millions d'années les séparent. Aucun homme n'a jamais vu un dinosaure vivant.", "Hommes et dinosaures ?") +
          savais("Toumaï veut dire « espoir de vie » en langue goran, au Tchad : il a été découvert en 2001 dans le désert du Djourab."),
        planches: [P2("La longue route de l'humanité", "Les grandes étapes, en millions d'années (Ma) : des dinosaures, disparus bien avant, jusqu'à l'homme moderne.",
          frise("De Toumaï à Homo sapiens", [{ a: "− 66 Ma", l: ["fin des", "dinosaures"], c: "#4D5163" }, { a: "− 7 Ma", l: ["Toumaï", "(Tchad)"], c: "#7B3F99" }, { a: "− 3,2 Ma", l: ["Lucy", "(Éthiopie)"], c: "#C2540A" }, { a: "− 2,4 Ma", l: ["Homo habilis", "premiers outils"], c: "#1E499B" }, { a: "− 300 000 ans", l: ["Homo sapiens", "(Maroc)"], c: "#17784D" }], 230, "Frise des étapes de l'évolution humaine"))],
        fil: { html: "<p>Les dinosaures ont disparu il y a 66 millions d'années, et Toumaï, l'un des plus anciens ancêtres de l'homme, vivait il y a 7 millions d'années : <strong>59 millions d'années</strong> les séparent. Le dessin animé invente une rencontre qui n'a jamais eu lieu.</p>", verdicts: [[0, "rejetee", "66 − 7 = 59 millions d'années séparent les dinosaures des premiers hominidés."]] },
        retenir: "Afrique, berceau de l'humanité : Toumaï (Tchad, ≈ 7 Ma), Lucy (Éthiopie, ≈ 3,2 Ma)." },
      { t: "Les étapes de l'évolution humaine", html: "<ul><li><strong>Australopithèques</strong> (comme Lucy) : bipèdes, petits, vivent en Afrique de l'Est et du Sud.</li><li><strong>Homo habilis</strong> (« l'homme habile », environ 2,4 millions d'années) : fabrique les premiers outils de pierre taillée (galets aménagés).</li><li><strong>Homo erectus</strong> (« l'homme debout ») : plus grand, taille des bifaces, maîtrise peu à peu le feu, et sort d'Afrique vers l'Asie et l'Europe.</li><li><strong>Homo sapiens</strong> (« l'homme sage », environ 300 000 ans) : notre espèce ; il peuple ensuite toute la Terre.</li></ul>" +
          ex("Un galet cassé d'un ou deux coups pour obtenir un bord tranchant : c'est l'outil d'Homo habilis. Le biface, taillé sur les deux faces en forme d'amande, est plus élaboré : c'est l'outil d'Homo erectus.", "Du galet au biface") +
          astuce("Les noms latins se traduisent : habilis = habile (il fait des outils), erectus = debout, sapiens = sage (qui pense). Le nom dit ce qui le distingue.") +
          attention("L'évolution n'est pas une échelle où chaque espèce remplace la précédente d'un coup : plusieurs espèces humaines ont parfois vécu à la même époque."),
        planches: [P2("Quatre étapes, quatre progrès", "Chaque étape de l'évolution humaine est marquée par un progrès : se tenir debout, fabriquer des outils, maîtriser le feu, penser et créer.",
          colonnes("Les étapes de l'évolution humaine", [{ t: "Australopithèque", c: "#7B3F99", l: ["Lucy, ≈ 3,2 Ma", "bipède", "→ se tient debout"] }, { t: "Homo habilis", c: "#C2540A", l: ["≈ 2,4 Ma", "galets taillés", "→ premiers outils"] }, { t: "Homo erectus", c: "#1E499B", l: ["bifaces", "le feu", "→ sort d'Afrique"] }, { t: "Homo sapiens", c: "#17784D", l: ["≈ 300 000 ans", "art, langage", "→ toute la Terre"] }], 210, "Les quatre étapes de l'évolution humaine et leurs progrès"))],
        fil: { html: "<p>Pendant presque toute cette longue histoire, les hommes n'ont ni villages fixes ni champs : ils taillent des outils de pierre, apprennent à maîtriser le feu et se déplacent pour trouver leur nourriture. L'agriculture viendra beaucoup plus tard, au <strong>Néolithique</strong>.</p>", verdicts: [[1, "rejetee", "Les villages et les champs n'apparaissent qu'au Néolithique, bien plus tard."]] },
        retenir: "Australopithèque ; Homo habilis (outils) ; Homo erectus (feu, biface) ; Homo sapiens (notre espèce)." },
      { t: "Le mode de vie des premiers hommes", html: def("Paléolithique", "Période de l'« âge de la pierre taillée », la plus longue de l'histoire humaine, pendant laquelle les hommes vivent de chasse, de pêche et de cueillette.") +
          "<ul><li><strong>Nomades</strong> : ils se déplacent en petits groupes pour suivre le gibier et trouver des fruits.</li><li><strong>Chasseurs-cueilleurs</strong> : ils chassent, pêchent, ramassent fruits, racines et miel.</li><li><strong>Abris</strong> : grottes, abris sous roche (comme Shum Laka au Cameroun), huttes de branches et de peaux.</li><li><strong>Le feu</strong> : il chauffe, éclaire, éloigne les bêtes sauvages, cuit les aliments et rassemble le groupe.</li><li><strong>L'art</strong> : peintures et gravures sur les rochers, parures de coquillages.</li></ul>" +
          formule("Paléolithique = pierre taillée + chasse, pêche, cueillette + vie nomade") +
          ex("Les peuples pygmées de la forêt camerounaise ont longtemps vécu de chasse et de cueillette en se déplaçant dans la forêt : leur mode de vie aide à imaginer, sans le confondre, celui des chasseurs-cueilleurs d'autrefois.", "Un rapprochement prudent") +
          astuce("Paléo = ancien, lithos = pierre : Paléolithique = « l'ancienne pierre », la pierre taillée. Néo = nouveau : Néolithique = « la nouvelle pierre », la pierre polie (leçon suivante)."),
        planches: [{ type: "3d", titre: "Un campement de chasseurs-cueilleurs", legende: "Tourne le campement : deux huttes de branches et de peaux, un foyer entouré de pierres au centre, un outil de pierre taillée, une lance de bois et des fruits cueillis. Le groupe restera ici quelques semaines, puis partira suivre le gibier.", modele: { h: 340, rx: -18, ry: 26, echelle: 0.8, alt: "Campement préhistorique avec deux huttes, un feu entouré de pierres, une lance, un outil de pierre et des fruits", objets: campement3D(), etiquettes: [{ p: [0, 46, -60], t: "le feu", cote: "g" }, { p: [-130, 90, 40], t: "hutte de branches", cote: "g" }, { p: [166, 30, -70], t: "outil de pierre taillée", cote: "d" }, { p: [-160, 22, -92], t: "fruits cueillis", cote: "d" }] } }],
        fil: { html: "<p>Oumarou peut répondre à son frère et à sa sœur : les premiers hommes sont apparus <strong>en Afrique</strong>, des millions d'années après les dinosaures ; nomades, ils vivaient de chasse, de pêche et de cueillette, dans des abris et autour du feu, avec des outils de pierre taillée.</p>", verdicts: [[2, "validee", "Apparus en Afrique, longtemps après les dinosaures, nomades chasseurs-cueilleurs : c'est ce que disent les vestiges."]] },
        retenir: "Paléolithique : nomades, chasse, pêche, cueillette, pierre taillée, feu, abris, art rupestre." },
      { t: "Entraînement au format de l'examen", html: integ("On dit que l'Afrique est le berceau de l'humanité parce que…", ["les dinosaures y vivaient", "les plus anciens fossiles d'hominidés y ont été trouvés", "il y fait chaud", "l'écriture y a été inventée"], "Les plus anciens fossiles d'hominidés y ont été trouvés", "Toumaï au Tchad, Lucy en Éthiopie.", "Associe chaque espèce à son progrès : Homo habilis, Homo erectus, Homo sapiens.", "Homo habilis : premiers outils de pierre ; Homo erectus : biface, maîtrise du feu, sortie d'Afrique ; Homo sapiens : notre espèce, art et langage.", "Un camarade affirme : « Les Africains n'ont pas d'histoire ancienne ; tout a commencé ailleurs. »", "En t'appuyant sur ta leçon, rédige quelques lignes pour lui répondre.", "C'est faux : les plus anciens ancêtres de l'homme ont été trouvés en Afrique, comme Toumaï au Tchad (environ 7 millions d'années) et Lucy en Éthiopie (environ 3,2 millions d'années). Notre espèce, Homo sapiens, y est aussi apparue avant de peupler la Terre. L'histoire de l'humanité tout entière commence donc en Afrique."), retenir: "Savoir-être : fierté éclairée et respect de tous les peuples, issus d'une même humanité." }
    ],
    denouement: { titre: "Oumarou répond à sa famille", etapes: ["Comparer les dates : 66 − 7 = 59 millions d'années entre les dinosaures et Toumaï (indice 1).", "Situer les villages et les champs au Néolithique, bien plus tard (indice 2).", "Décrire le Paléolithique : nomades chasseurs-cueilleurs, pierre taillée, feu (indice 3)."],
      formules: [F("Calculer un écart", "écart = date la plus ancienne − date la plus récente", "66 Ma − 7 Ma = 59 Ma"), F("Situer les étapes", "Toumaï ≈ 7 Ma → Lucy ≈ 3,2 Ma → Homo habilis ≈ 2,4 Ma → Homo sapiens ≈ 300 000 ans", "toutes en Afrique"), F("Décrire le mode de vie", "Paléolithique = pierre taillée + chasse, pêche, cueillette + nomadisme", "abris, feu, art rupestre")],
      reponse: "<p>Les premiers hommes n'ont jamais vécu avec les dinosaures : ceux-ci ont disparu il y a environ 66 millions d'années, alors que Toumaï, l'un des plus anciens ancêtres de l'homme, trouvé au Tchad, vivait il y a environ 7 millions d'années, soit 59 millions d'années plus tard. Tous les plus anciens fossiles d'hominidés ont été découverts en Afrique : c'est le berceau de l'humanité. Des australopithèques comme Lucy à Homo habilis, qui fabrique les premiers outils, puis à Homo erectus, qui maîtrise le feu, et enfin à Homo sapiens, notre espèce, l'homme évolue lentement. Pendant le Paléolithique, il ne vit pas dans des villages : nomade, il se déplace en petits groupes et vit de chasse, de pêche et de cueillette, dans des abris, autour du feu, avec des outils de pierre taillée. Les villages et les champs n'apparaîtront qu'au Néolithique.</p>",
      transfert: "<p>Calcule combien de temps sépare Lucy (3,2 millions d'années) de l'apparition d'Homo sapiens (300 000 ans). Donne ta réponse en milliers d'années.</p>" },
    revision: ["<strong>Afrique, berceau de l'humanité</strong> : les plus anciens fossiles d'hominidés y ont été trouvés.", "Toumaï (Tchad, ≈ 7 Ma) ; Lucy (Éthiopie, ≈ 3,2 Ma).", "Homo habilis : premiers outils ; Homo erectus : biface, feu ; Homo sapiens : notre espèce (≈ 300 000 ans).", "Dinosaures disparus il y a ≈ 66 Ma : jamais contemporains des hommes.", "Paléolithique : pierre taillée, chasse, pêche, cueillette, nomadisme.", "Abris, feu, art rupestre ; villages et champs au Néolithique."],
    exo: "<p>Range dans l'ordre d'apparition : Homo sapiens, Lucy, Toumaï, Homo habilis. <em>(Toumaï ; Lucy ; Homo habilis ; Homo sapiens.)</em></p>",
    quiz: [q("On appelle l'Afrique le berceau de l'humanité car…", "les plus anciens fossiles d'hominidés y ont été trouvés", "les dinosaures y vivaient", "l'écriture y est née", "Toumaï, Lucy…"), q("Toumaï a été découvert…", "au Tchad", "en France", "en Chine", "En 2001, dans le désert du Djourab."), q("Lucy est une…", "australopithèque", "Homo sapiens", "dinosaure", "Elle vivait il y a environ 3,2 millions d'années, en Éthiopie."), q("Les premiers outils de pierre sont attribués à…", "Homo habilis", "Lucy", "Homo sapiens", "« L'homme habile »."), q("Homo erectus est connu pour…", "le biface et la maîtrise du feu", "l'agriculture", "l'écriture", "Il sort aussi d'Afrique."), q("Notre espèce s'appelle…", "Homo sapiens", "Homo habilis", "Australopithèque", "Apparue il y a environ 300 000 ans."), q("Combien de temps sépare la fin des dinosaures (66 Ma) de Toumaï (7 Ma) ?", "59 millions d'années", "73 millions d'années", "7 millions d'années", "66 − 7 = 59."), q("Au Paléolithique, les hommes vivaient surtout…", "de chasse, de pêche et de cueillette", "de l'agriculture", "du commerce en ville", "Ce sont des chasseurs-cueilleurs."), q("Un nomade est quelqu'un qui…", "se déplace sans cesse", "vit toujours au même endroit", "cultive des champs", "Il suit le gibier et les saisons."), q("Paléolithique signifie…", "âge de la pierre ancienne (taillée)", "âge du fer", "âge de la pierre polie", "Paléo = ancien, lithos = pierre.")],
    apc: apc("Un dessin animé fait croire aux enfants que les hommes vivaient avec les dinosaures.", "Rétablir la vérité historique sur l'apparition et la vie des premiers hommes.")
  });
  VRT_A("6e-histoire-premiers-hommes", 0, "Place chaque ancêtre sur la frise du temps", function (el) {
    exercice(el, [["Les grands dinosaures ont disparu il y a environ ___.", ["66 millions d'années", "7 millions d'années", "300 000 ans"], "Bien avant les premiers hominidés."], ["Toumaï, trouvé au Tchad, vivait il y a environ ___.", ["7 millions d'années", "66 millions d'années", "3 000 ans"], "L'un des plus anciens ancêtres connus."], ["Lucy, l'australopithèque d'Éthiopie, vivait il y a environ ___.", ["3,2 millions d'années", "300 ans", "66 millions d'années"], "Elle était déjà bipède."], ["Homo habilis fabrique les premiers outils il y a environ ___.", ["2,4 millions d'années", "7 millions d'années", "2 400 ans"], "Des galets taillés."], ["Homo sapiens apparaît il y a environ ___.", ["300 000 ans", "3 millions d'années", "30 ans"], "Notre espèce."], ["Entre la fin des dinosaures et Toumaï, il s'est écoulé ___.", ["59 millions d'années", "73 millions d'années", "6 millions d'années"], "66 − 7 = 59."]], "Ancêtre suivant", "Frise");
  });
})();
