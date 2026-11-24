/* Leçons GRATUITES — Histoire de 6e, lot 4 (24/11/2026) : rangs 17 (judaïsme et christianisme), 18 (expansion du
   christianisme en Afrique), 19 (l'islam). Traitement historique, factuel et respectueux de toutes les croyances ;
   situations de vivre-ensemble au Cameroun. Même gabarit que 36- à 38-histoire-6e. */
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




  /* ═══════════════ RANG 17 : LE JUDAÏSME ET LE CHRISTIANISME ═══════════════ */
  function livres3D() {
    var o = [{ f: "boite", c: [0, -6, 0], d: [460, 6, 240], coul: "#8B6B4A", dessus: "#A68A5E" }];
    o.push({ f: "boite", c: [0, 60, 0], d: [380, 10, 170], coul: "#6B4423", dessus: "#8A5A33" });
    [[-180, -75], [180, -75], [-180, 75], [180, 75]].forEach(function (p) { o.push({ f: "boite", c: [p[0], 28, p[1]], d: [10, 56, 10], coul: "#5A3A1E" }); });
    o.push({ f: "cylindre", c: [-130, 66, -20], r: 13, h: 70, n: 14, coul: "#6B4423" });
    o.push({ f: "cylindre", c: [-70, 66, -20], r: 13, h: 70, n: 14, coul: "#6B4423" });
    o.push({ f: "boite", c: [-100, 90, -32], d: [60, 46, 2], coul: "#F2E6C8", dessus: "#F2E6C8" });
    o.push({ f: "boite", c: [40, 72, -20], d: [80, 12, 60], coul: "#7A1E2E", dessus: "#F4F1EA" });
    o.push({ f: "boite", c: [40, 79, -20], d: [74, 2, 54], coul: "#F4F1EA", dessus: "#F4F1EA" });
    o.push({ f: "boite", c: [140, 70, 30], d: [50, 8, 70], coul: "#1E499B", dessus: "#3F68B8" });
    o.push({ f: "boite", c: [140, 78, 30], d: [46, 8, 66], coul: "#17784D", dessus: "#2E9A5B" });
    return o;
  }
  VRT_L("6e-histoire-judaisme-christianisme", {
    c: "6e", m: "histoire", cle: "Le judaïsme et le christianisme", titre: "Le judaïsme et le christianisme : deux religions monothéistes", duree: 30,
    accroche: "Dans un club de lecture de Ngaoundéré, une élève demande : « Pourquoi les chrétiens lisent-ils aussi des livres des juifs ? » D'où viennent ces deux religions, et qu'ont-elles en commun ?",
    intro: "Une visite de classe à la bibliothèque de Ngaoundéré te sert de fil rouge : à chaque partie, un indice t'aide à trancher entre trois idées sur l'histoire du judaïsme et du christianisme.",
    objectifs: ["définir le monothéisme", "présenter les origines du judaïsme : les Hébreux, Abraham, Moïse, la Torah", "présenter la naissance du christianisme : Jésus, les apôtres, les Évangiles", "situer dans le temps la diffusion du christianisme dans l'Empire romain"],
    enquete: {
      titre: "La visite de la bibliothèque",
      svg: svg(640, 220, "Bibliothèque : des étagères de livres, une table avec un rouleau ancien et un livre relié ; trois élèves discutent avec la bibliothécaire", lin("jcC", ["#EEF2F8", "#F4EDE1"], true),
        "<rect width='640' height='220' fill='url(#jcC)'/><rect y='186' width='640' height='34' fill='#8B6B4A'/>" + [0, 1, 2].map(function (k) { return "<rect x='20' y='" + (30 + k * 46) + "' width='170' height='6' fill='#6B4423'/>" + [0, 1, 2, 3, 4, 5, 6, 7].map(function (j) { return "<rect x='" + (26 + j * 20) + "' y='" + (6 + k * 46) + "' width='14' height='24' fill='" + ["#1E499B", "#C2540A", "#17784D", "#7B3F99"][(j + k) % 4] + "'/>"; }).join(""); }).join("") +
        "<rect x='250' y='140' width='160' height='12' fill='#6B4423'/><rect x='268' y='118' width='14' height='24' rx='7' fill='#6B4423'/><rect x='316' y='118' width='14' height='24' rx='7' fill='#6B4423'/><rect x='280' y='120' width='38' height='20' fill='#F2E6C8'/><rect x='356' y='124' width='40' height='16' fill='#7A1E2E'/>" +
        perso(470, 96, "#5A3A1E", "#7B3F99", "#4D5163") + perso(540, 96, "#6B4423", "#1E499B", "#2E3445") + perso(600, 102, "#4A2E18", "#17784D", "#2E3445") +
        bulle(250, 30, 220, "Pourquoi les mêmes livres ?", "#F7C948")),
      legende: "À Ngaoundéré, une classe de 6e visite la bibliothèque municipale et découvre un rouleau ancien et une Bible.",
      contexte: "<p>À la bibliothèque, la bibliothécaire montre un rouleau de la Torah et une Bible. Sali remarque que les premières pages de la Bible racontent les mêmes histoires que le rouleau. Daniel affirme : « Le judaïsme et le christianisme n'ont rien à voir l'un avec l'autre. » Esther pense que « le christianisme est né en Europe, à Rome ». La bibliothécaire leur propose de chercher dans les livres d'histoire d'où viennent ces deux religions.</p>",
      documents: [{ t: "Le premier des Dix Commandements (Bible, livre de l'Exode)", html: "<p>« Tu n'auras pas d'autres dieux devant moi. »</p>" },
        { t: "Repères", html: "<p>Les chrétiens appellent Ancien Testament les livres de la Bible hébraïque, qu'ils lisent avec le Nouveau Testament, qui raconte la vie et l'enseignement de Jésus.</p>" }],
      question: "D'où viennent le judaïsme et le christianisme, et qu'ont-ils en commun ?",
      tache: "Définis le monothéisme, présente les origines du judaïsme, puis la naissance et la diffusion du christianisme.",
      hypotheses: ["Le judaïsme et le christianisme n'ont aucun lien entre eux.", "Le christianisme est né en Europe, à Rome.", "Le judaïsme est la religion monothéiste des Hébreux ; le christianisme est né de lui en Palestine, avec Jésus, puis s'est diffusé dans l'Empire romain. Les deux partagent la croyance en un seul Dieu et une partie de leurs livres."]
    },
    parties: [
      { t: "Le monothéisme et les Hébreux", html: def("Monothéisme", "Croyance en un seul Dieu. Le contraire est le polythéisme, la croyance en plusieurs dieux, comme chez les Égyptiens ou les Grecs de l'Antiquité.") +
          "<ul><li><strong>Les Hébreux</strong> sont un peuple du Proche-Orient. Selon la Bible, leur ancêtre est <strong>Abraham</strong>, qui croit en un Dieu unique.</li><li><strong>Moïse</strong> conduit les Hébreux hors d'Égypte et reçoit, selon la tradition, les <strong>Dix Commandements</strong>.</li><li>Vers <strong>1000 av. J.-C.</strong>, les rois David puis Salomon règnent à <strong>Jérusalem</strong>, où Salomon fait bâtir un Temple.</li></ul>" +
          def("Torah", "Les cinq premiers livres de la Bible hébraïque. Elle contient l'histoire des origines du peuple hébreu et les lois religieuses du judaïsme.") +
          ex("Les Égyptiens priaient de nombreux dieux (Rê, Osiris, Isis…) : ils étaient polythéistes. Les Hébreux, eux, n'adoraient qu'un seul Dieu : ils étaient monothéistes.", "Polythéisme ou monothéisme ?") +
          astuce("Mono = un seul ; poly = plusieurs ; théos = dieu. Les mots se lisent comme des formules."),
        planches: [P2("Du polythéisme au monothéisme", "Deux façons de croire dans l'Antiquité : de nombreux dieux chez la plupart des peuples, un Dieu unique chez les Hébreux.",
          colonnes("Croire en un ou en plusieurs dieux", [{ t: "Polythéisme", c: "#C2540A", l: ["plusieurs dieux", "Égyptiens : Rê, Osiris", "Grecs : Zeus, Athéna", "temples pour chaque dieu"] }, { t: "Monothéisme", c: "#1E499B", l: ["un seul Dieu", "Hébreux : Abraham, Moïse", "puis chrétiens", "puis musulmans"] }], 220, "Tableau comparant le polythéisme et le monothéisme"))],
        fil: { html: "<p>Le rouleau et la Bible racontent les mêmes débuts parce que le christianisme est <strong>né du judaïsme</strong> : les chrétiens ont gardé la Bible hébraïque, qu'ils appellent Ancien Testament. Les deux religions croient en un seul Dieu. Dire qu'elles n'ont aucun lien est donc faux.</p>", verdicts: [[0, "rejetee", "Le christianisme est né du judaïsme et garde la Bible hébraïque."]] },
        retenir: "Monothéisme : un seul Dieu ; Hébreux, Abraham, Moïse ; Torah ; Jérusalem vers 1000 av. J.-C." },
      { t: "Le judaïsme : une religion du Livre", html: "<ul><li>Le judaïsme est la religion des <strong>juifs</strong>, descendants des Hébreux.</li><li>Les juifs prient à la <strong>synagogue</strong>, où l'on lit la Torah ; un rabbin enseigne la loi religieuse.</li><li>Le <strong>sabbat</strong>, du vendredi soir au samedi soir, est un jour de repos et de prière.</li><li>Après la destruction du Temple de Jérusalem par les Romains en <strong>70 apr. J.-C.</strong>, beaucoup de juifs se dispersent dans le monde : c'est la <strong>diaspora</strong>.</li></ul>" +
          formule("âge d'un événement = 2026 − date (apr. J.-C.)") +
          ex("Le Temple de Jérusalem a été détruit en 70 apr. J.-C. : 2026 − 70 = 1 956 ans.", "Calculer l'âge d'un événement") +
          attention("Dans une leçon d'histoire, on présente ce que les croyants croient et ce que les documents montrent, sans juger les croyances : chacun est libre de sa religion."),
        planches: [{ type: "3d", titre: "Le rouleau et le livre", legende: "Tourne la table : à gauche, un rouleau enroulé sur deux bâtons de bois, comme ceux de la Torah lus à la synagogue ; au milieu, un livre relié ; à droite, des livres empilés. Dans l'Antiquité, on écrivait sur des rouleaux ; le livre à pages, le codex, s'est répandu ensuite, notamment avec les chrétiens.", modele: { h: 340, rx: -20, ry: 26, echelle: 0.82, alt: "Table en bois avec un rouleau sur deux bâtons, un livre ouvert et une pile de livres", objets: livres3D(), etiquettes: [{ p: [-100, 114, -34], t: "rouleau", cote: "g" }, { p: [40, 82, -20], t: "livre relié (codex)", cote: "d" }, { p: [140, 84, 30], t: "livres empilés", cote: "d" }] } }],
        fil: { html: "<p>Le judaïsme a ses lieux (la synagogue), ses textes (la Torah), ses jours (le sabbat). Après 70 apr. J.-C., la diaspora disperse les juifs dans le monde : leur religion se maintient grâce à la <strong>lecture du Livre</strong>, partout où ils vivent.</p>", verdicts: [] },
        retenir: "Synagogue ; rabbin ; Torah ; sabbat ; Temple détruit en 70 apr. J.-C. ; diaspora." },
      { t: "La naissance et la diffusion du christianisme", html: "<ul><li><strong>Jésus</strong> naît en Palestine, alors province de l'Empire romain, au début de notre ère. Il est juif et enseigne l'amour de Dieu et du prochain.</li><li>Il est <strong>crucifié</strong> à Jérusalem vers 30 apr. J.-C. ; ses disciples affirment qu'il est ressuscité et le reconnaissent comme le Christ.</li><li>Les <strong>apôtres</strong> (Pierre, Paul…) diffusent son message dans l'Empire romain ; les <strong>Évangiles</strong> racontent sa vie (Nouveau Testament).</li><li>Les chrétiens sont d'abord persécutés ; en <strong>313</strong>, l'empereur Constantin leur accorde la liberté de culte ; en <strong>380</strong>, le christianisme devient religion officielle de l'Empire.</li></ul>" +
          formule("durée entre deux dates apr. J.-C. = date récente − date ancienne") +
          ex("De la crucifixion (vers 30) à la liberté de culte (313) : 313 − 30 = 283 ans, près de trois siècles de diffusion souvent clandestine.", "Calculer la durée des persécutions") +
          savais("Le mot « Christ » vient du grec christos, qui traduit le mot hébreu « messie » : celui qui a reçu l'onction."),
        planches: [P2("Du judaïsme au christianisme", "Les grandes étapes, de Jérusalem à Rome : le christianisme naît en Palestine et s'étend dans l'Empire romain.",
          frise("Les débuts du christianisme", [{ a: "vers 1000 av. J.-C.", l: ["David, Salomon", "Temple de Jérusalem"], c: "#7B3F99" }, { a: "vers 30", l: ["crucifixion", "de Jésus"], c: "#C62828" }, { a: "70", l: ["destruction", "du Temple"], c: "#4D5163" }, { a: "313", l: ["liberté de culte", "(Constantin)"], c: "#1E499B" }, { a: "380", l: ["religion officielle", "de l'Empire"], c: "#17784D" }], 230, "Frise des débuts du judaïsme et du christianisme"))],
        fil: { html: "<p>Esther se trompe : le christianisme n'est pas né à Rome mais en <strong>Palestine</strong>, avec Jésus, un juif de Galilée. C'est ensuite, par les apôtres et après 313, qu'il s'est répandu dans tout l'Empire romain, jusqu'à Rome.</p>", verdicts: [[1, "rejetee", "Le christianisme est né en Palestine, pas à Rome."], [2, "validee", "Deux monothéismes liés : le christianisme est né du judaïsme en Palestine, puis s'est diffusé dans l'Empire romain."]] },
        retenir: "Jésus, Palestine ; crucifixion vers 30 ; apôtres, Évangiles ; 313 liberté de culte ; 380 religion officielle." },
      { t: "Entraînement au format de l'examen", html: integ("Le monothéisme, c'est…", ["croire en plusieurs dieux", "croire en un seul Dieu", "ne croire en aucun dieu", "adorer les ancêtres"], "Croire en un seul Dieu", "Mono = un seul, théos = dieu.", "Cite deux personnages importants du judaïsme et deux du christianisme.", "Judaïsme : Abraham, Moïse (aussi David, Salomon). Christianisme : Jésus, les apôtres Pierre et Paul.", "Dans ton quartier, deux voisins de religions différentes se disputent en disant que « leurs religions n'ont rien en commun ».", "En t'appuyant sur ta leçon, rédige quelques lignes pour les aider à se comprendre.", "Le judaïsme et le christianisme sont deux religions monothéistes : elles croient en un seul Dieu. Le christianisme est né du judaïsme : Jésus était juif, et les chrétiens lisent aussi la Bible hébraïque, l'Ancien Testament. Connaître l'histoire de chacune aide à respecter l'autre : au Cameroun, la loi garantit la liberté de religion à tous."), retenir: "Savoir-être : tolérance et respect de la liberté de religion de chacun." }
    ],
    denouement: { titre: "Ce que la classe a trouvé", etapes: ["Le monothéisme naît chez les Hébreux : Abraham, Moïse, la Torah (indice 1).", "Le judaïsme : synagogue, sabbat, diaspora après 70 (indice 2).", "Le christianisme naît du judaïsme en Palestine, puis se diffuse dans l'Empire romain (indice 3)."],
      formules: [F("Définir", "monothéisme = un seul Dieu ; polythéisme = plusieurs dieux", "Hébreux / Égyptiens"), F("Calculer un âge", "âge = 2026 − date apr. J.-C.", "2026 − 70 = 1 956 ans"), F("Calculer une durée", "durée = date récente − date ancienne", "313 − 30 = 283 ans")],
      reponse: "<p>Le judaïsme et le christianisme sont deux religions monothéistes, qui croient en un seul Dieu. Le judaïsme est la religion des Hébreux : selon la Bible, il remonte à Abraham, puis à Moïse, qui reçoit les Dix Commandements ; vers 1000 av. J.-C., Salomon bâtit le Temple de Jérusalem. Les juifs prient à la synagogue, lisent la Torah et respectent le sabbat ; après la destruction du Temple en 70 apr. J.-C., ils se dispersent dans le monde. Le christianisme est né du judaïsme, en Palestine : Jésus, un juif, y enseigne et y est crucifié vers 30 ; ses apôtres répandent son message dans l'Empire romain, qui accorde la liberté de culte aux chrétiens en 313 puis fait du christianisme sa religion officielle en 380. C'est pourquoi les chrétiens lisent aussi la Bible hébraïque, sous le nom d'Ancien Testament.</p>",
      transfert: "<p>Range dans l'ordre chronologique : la liberté de culte accordée aux chrétiens, le règne de Salomon, la destruction du Temple, la crucifixion de Jésus. Calcule l'écart entre le premier et le dernier événement.</p>" },
    revision: ["<strong>Monothéisme</strong> : croyance en un seul Dieu ; polythéisme : plusieurs dieux.", "Hébreux : Abraham, Moïse, Dix Commandements ; Jérusalem vers 1000 av. J.-C.", "Judaïsme : Torah, synagogue, rabbin, sabbat ; diaspora après 70.", "Christianisme : Jésus, Palestine ; crucifixion vers 30 ; apôtres ; Évangiles.", "313 : liberté de culte (Constantin) ; 380 : religion officielle de l'Empire.", "Les chrétiens lisent la Bible hébraïque (Ancien Testament) et le Nouveau Testament."],
    exo: "<p>Associe : Torah, Évangiles, synagogue, apôtres. <em>(Judaïsme : Torah, synagogue ; christianisme : Évangiles, apôtres.)</em></p>",
    quiz: [q("Le monothéisme est…", "la croyance en un seul Dieu", "la croyance en plusieurs dieux", "une forme de gouvernement", "Mono = un seul."), q("Selon la Bible, l'ancêtre des Hébreux est…", "Abraham", "Constantin", "Pierre", "Il croit en un Dieu unique."), q("Les Dix Commandements sont reçus, selon la tradition, par…", "Moïse", "Jésus", "Paul", "Sur le mont Sinaï."), q("La Torah regroupe…", "les cinq premiers livres de la Bible hébraïque", "les Évangiles", "les lois romaines", "Histoire des origines et lois religieuses."), q("Les juifs prient à…", "la synagogue", "la pyramide", "l'agora", "On y lit la Torah."), q("Le Temple de Jérusalem est détruit par les Romains en…", "70 apr. J.-C.", "380 apr. J.-C.", "1000 av. J.-C.", "Début de la diaspora."), q("Jésus est né…", "en Palestine", "à Rome", "en Égypte", "Province de l'Empire romain."), q("Les Évangiles racontent…", "la vie et l'enseignement de Jésus", "la vie de Moïse", "l'histoire de Rome", "Ils font partie du Nouveau Testament."), q("En 313, l'empereur Constantin…", "accorde la liberté de culte aux chrétiens", "interdit le christianisme", "fonde Jérusalem", "C'est l'édit de Milan."), q("De 30 à 313, il s'est écoulé…", "283 ans", "343 ans", "28 ans", "313 − 30 = 283.")],
    apc: apc("Deux voisins de religions différentes se disputent en affirmant que leurs croyances n'ont rien en commun.", "Présenter les origines du judaïsme et du christianisme et ce qui les relie.")
  });
  VRT_A("6e-histoire-judaisme-christianisme", 2, "Judaïsme ou christianisme ? Range chaque élément", function (el) {
    exercice(el, [["La synagogue est le lieu de prière du ___.", ["judaïsme", "christianisme", "polythéisme grec"], "On y lit la Torah."], ["Les Évangiles appartiennent au ___.", ["christianisme", "judaïsme", "polythéisme égyptien"], "Ils racontent la vie de Jésus."], ["Le sabbat est le jour de repos du ___.", ["judaïsme", "christianisme", "culte de Rê"], "Du vendredi soir au samedi soir."], ["Les apôtres Pierre et Paul diffusent le ___.", ["christianisme", "judaïsme", "culte de Zeus"], "Dans l'Empire romain."], ["Croire en Zeus, Athéna et Apollon, c'est du ___.", ["polythéisme", "monothéisme", "judaïsme"], "Plusieurs dieux."], ["Le judaïsme et le christianisme sont deux religions ___.", ["monothéistes", "polythéistes", "sans dieu"], "Elles croient en un seul Dieu."]], "Élément suivant", "Élément");
  });

  /* ═══════════════ RANG 18 : L'EXPANSION DU CHRISTIANISME EN AFRIQUE ═══════════════ */
  function lalibela3D() {
    var o = [{ f: "boite", c: [0, -6, 0], d: [500, 6, 300], coul: "#A0603A", dessus: "#B8744A" }];
    /* le sol de roche autour de la fosse */
    o.push({ f: "boite", c: [0, 40, -120], d: [500, 80, 60], coul: "#9A5A34", dessus: "#B06A40" });
    o.push({ f: "boite", c: [0, 40, 120], d: [500, 80, 60], coul: "#9A5A34", dessus: "#B06A40" });
    o.push({ f: "boite", c: [-210, 40, 0], d: [80, 80, 180], coul: "#9A5A34", dessus: "#B06A40" });
    o.push({ f: "boite", c: [210, 40, 0], d: [80, 80, 180], coul: "#9A5A34", dessus: "#B06A40" });
    /* l'église en croix taillée dans la roche */
    o.push({ f: "boite", c: [0, 34, 0], d: [180, 68, 56], coul: "#C47A4A", dessus: "#D48A5A" });
    o.push({ f: "boite", c: [0, 34, 0], d: [56, 68, 180], coul: "#BE7444", dessus: "#D48A5A" });
    o.push({ f: "boite", c: [0, 72, 0], d: [130, 6, 20], coul: "#A0603A", dessus: "#A0603A", div: false });
    o.push({ f: "boite", c: [0, 72, 0], d: [20, 6, 130], coul: "#A0603A", dessus: "#A0603A", div: false });
    [-60, 60].forEach(function (x) { o.push({ f: "boite", c: [x, 40, -29], d: [12, 18, 2], coul: "#5A2E1A" }); });
    o.push({ f: "boite", c: [0, 16, -91], d: [18, 30, 2], coul: "#5A2E1A" });
    return o;
  }
  VRT_L("6e-histoire-christianisme-afrique", {
    c: "6e", m: "histoire", cle: "L’expansion du christianisme en Afrique", titre: "L'expansion du christianisme en Afrique, de l'Antiquité au Cameroun", duree: 30,
    accroche: "« Le christianisme est arrivé en Afrique avec les colons au XIXe siècle ! » Pourtant, l'Éthiopie est chrétienne depuis le IVe siècle, bien avant l'Europe du Nord. Comment le christianisme s'est-il répandu en Afrique ?",
    intro: "La préparation d'un exposé pour la fête de la paroisse, à Bimbia près de Limbé, te sert de fil rouge : à chaque partie, un indice t'aide à trancher entre trois idées sur l'arrivée du christianisme en Afrique.",
    objectifs: ["montrer que le christianisme est présent en Afrique dès l'Antiquité", "présenter l'Égypte copte, l'Afrique du Nord de saint Augustin et l'Éthiopie", "présenter le christianisme au royaume du Kongo", "situer l'arrivée des missionnaires au Cameroun au XIXe siècle"],
    enquete: {
      titre: "L'exposé de Bimbia",
      svg: svg(640, 220, "Bord de mer à Bimbia : une plaque commémorative près de vieilles pierres, deux élèves avec un cahier et un ancien qui leur parle", lin("caC", ["#DDEBF5", "#F4EDE1"], true),
        "<rect width='640' height='220' fill='url(#caC)'/><rect y='150' width='640' height='30' fill='#4A8AC8'/><rect y='176' width='640' height='44' fill='#C9A06E'/><path d='M0 150q80 -12 160 0t160 0t160 0t160 0' fill='none' stroke='#9FC3E8' stroke-width='3'/>" +
        "<rect x='60' y='112' width='90' height='64' fill='#8A8A8A'/><rect x='72' y='124' width='66' height='40' fill='#D8D2C0'/>" + txt(105, 140, "BIMBIA", { s: 10 }) + txt(105, 154, "1844", { s: 10, c: "#C62828" }) +
        perso(300, 98, "#4A2E18", "#F4F1EA", "#4D5163") + perso(420, 98, "#5A3A1E", "#C2540A", "#2E3445") + perso(490, 104, "#6B4423", "#1E499B", "#2E3445") +
        bulle(380, 30, 240, "Avec les colons seulement ?", "#F7C948")),
      legende: "À Bimbia, près de Limbé, des élèves préparent un exposé sur l'arrivée du christianisme au Cameroun.",
      contexte: "<p>Pour la fête de leur paroisse, Ewane et Sandrine préparent un exposé. Ewane affirme : « Le christianisme est arrivé en Afrique avec les colons, à la fin du XIXe siècle. » Sandrine pense qu'« il n'y a jamais eu de chrétiens africains avant les missionnaires européens ». Un ancien de Bimbia leur montre une plaque près de la mer et leur conseille de remonter beaucoup plus loin dans le temps.</p>",
      documents: [{ t: "Le roi Ezana d'Axoum (IVe siècle)", html: "<p>Les monnaies du roi Ezana, frappées vers le milieu du IVe siècle, portent d'abord les symboles des anciens dieux, puis une croix : le royaume d'Axoum devient chrétien.</p>" },
        { t: "Bimbia, 1844", html: "<p>Le missionnaire baptiste jamaïcain Joseph Merrick s'installe à Bimbia dans les années 1840 ; Alfred Saker, missionnaire anglais, ouvre une mission à Douala en 1845, puis fonde Victoria (aujourd'hui Limbé) en 1858.</p>" }],
      question: "Le christianisme est-il arrivé en Afrique seulement avec les missionnaires du XIXe siècle ?",
      tache: "Présente les grandes étapes de l'expansion du christianisme en Afrique, de l'Antiquité au Cameroun du XIXe siècle.",
      hypotheses: ["Le christianisme est arrivé en Afrique seulement avec les colons, à la fin du XIXe siècle.", "Il n'y a jamais eu de chrétiens africains avant les missionnaires européens.", "Le christianisme est présent en Afrique dès les premiers siècles (Égypte, Afrique du Nord, Éthiopie), puis au Kongo au XVe siècle, et au Cameroun avec les missionnaires du XIXe siècle."]
    },
    parties: [
      { t: "Le christianisme africain de l'Antiquité", html: def("Église copte", "Église chrétienne d'Égypte, l'une des plus anciennes du monde. « Copte » vient d'un mot qui désignait les Égyptiens.") +
          "<ul><li><strong>En Égypte</strong> : dès le Ier et le IIe siècle, Alexandrie devient un grand centre chrétien ; les premiers moines vivent dans le désert égyptien.</li><li><strong>En Afrique du Nord</strong> : <strong>saint Augustin</strong> (354-430), né en Numidie (actuelle Algérie), évêque d'Hippone, est l'un des penseurs chrétiens les plus importants.</li><li><strong>En Éthiopie</strong> : le royaume d'Axoum devient chrétien au IVe siècle avec le roi <strong>Ezana</strong>.</li><li><strong>En Nubie</strong> : des royaumes chrétiens existent du VIe au XVe siècle.</li></ul>" +
          formule("écart entre deux dates apr. J.-C. = date récente − date ancienne") +
          ex("Entre la conversion d'Axoum (vers 350) et l'arrivée de Saker à Douala (1845) : 1845 − 350 = 1 495 ans. Le christianisme était africain depuis près de quinze siècles.", "Mesurer l'ancienneté du christianisme africain") +
          savais("Saint Augustin était africain : il a vécu et écrit à Hippone, aujourd'hui Annaba, en Algérie. Ses livres sont encore étudiés dans le monde entier."),
        planches: [P2("Les premiers chrétiens d'Afrique", "Trois foyers anciens du christianisme africain, bien avant l'arrivée des missionnaires européens en Afrique subsaharienne.",
          colonnes("Le christianisme africain ancien", [{ t: "Égypte", c: "#B07A00", l: ["Ier-IIe siècle", "Alexandrie", "Église copte", "premiers moines"] }, { t: "Afrique du Nord", c: "#1E499B", l: ["IVe-Ve siècle", "saint Augustin", "évêque d'Hippone", "(Algérie)"] }, { t: "Éthiopie", c: "#17784D", l: ["IVe siècle", "roi Ezana d'Axoum", "églises de Lalibela", "(XIIe-XIIIe s.)"] }], 230, "Trois foyers anciens du christianisme en Afrique"))],
        fil: { html: "<p>Ewane se trompe : le christianisme est présent en Afrique dès les <strong>premiers siècles</strong>, en Égypte, en Afrique du Nord et en Éthiopie. Le roi Ezana d'Axoum devient chrétien vers 350, plus de 1 400 ans avant l'arrivée des missionnaires au Cameroun.</p>", verdicts: [[0, "rejetee", "Le christianisme est présent en Afrique dès les premiers siècles."]] },
        retenir: "Égypte copte (Ier-IIe s.) ; saint Augustin (354-430) ; Axoum chrétien vers 350 ; Nubie chrétienne (VIe-XVe s.)." },
      { t: "Lalibela et le royaume du Kongo", html: "<ul><li><strong>Lalibela</strong> (Éthiopie) : aux XIIe et XIIIe siècles, sous le roi Lalibela, des églises sont <strong>taillées directement dans la roche</strong>, d'un seul bloc ; l'une d'elles a la forme d'une croix.</li><li><strong>Le royaume du Kongo</strong> (Afrique centrale) : en 1483, les navigateurs portugais arrivent à l'embouchure du fleuve Congo. En <strong>1491</strong>, le roi Nzinga a Nkuwu est baptisé.</li><li>Son fils, le roi <strong>Afonso Ier</strong> (Nzinga Mbemba), favorise le christianisme et écrit au roi du Portugal ; le Kongo a même un évêque africain, Henrique, son fils.</li></ul>" +
          def("Église monolithe", "Église taillée dans un seul bloc de roche : on creuse la roche tout autour, puis on vide l'intérieur, au lieu d'empiler des pierres.") +
          ex("Pour tailler une église monolithe, on retire la roche de haut en bas : d'abord une fosse autour du bloc, puis les portes, les fenêtres et les salles intérieures. Rien ne peut être rajouté : la moindre erreur est définitive.", "Construire en creusant") +
          astuce("Pour retenir l'ordre des étapes, pense à « E-A-K-C » : Égypte, Axoum, Kongo, Cameroun."),
        planches: [{ type: "3d", titre: "Une église taillée dans la roche, à Lalibela", legende: "Tourne le site : dans une fosse creusée dans la roche rouge, une église en forme de croix, taillée d'un seul bloc, avec ses portes et ses fenêtres. Son toit est au niveau du sol : on la découvre en s'approchant du bord de la fosse.", modele: { h: 340, rx: -30, ry: 30, echelle: 0.75, alt: "Église en forme de croix taillée dans la roche au fond d'une fosse", objets: lalibela3D(), etiquettes: [{ p: [0, 76, 0], t: "toit en croix", cote: "d" }, { p: [60, 46, -30], t: "porte et fenêtres taillées", cote: "g" }, { p: [-210, 82, 0], t: "roche creusée", cote: "g" }] } }],
        fil: { html: "<p>Sandrine se trompe aussi : il y a eu des chrétiens africains bien avant le XIXe siècle. En Éthiopie, on taille des églises dans la roche au XIIIe siècle ; au Kongo, le roi est baptisé en 1491 et son petit-fils devient <strong>évêque</strong>. Le christianisme africain a ses rois, ses saints et ses monuments.</p>", verdicts: [[1, "rejetee", "Éthiopie, Kongo : il y a eu des chrétiens africains bien avant le XIXe siècle."]] },
        retenir: "Lalibela : églises taillées dans la roche (XIIe-XIIIe s.) ; Kongo : roi baptisé en 1491 ; Afonso Ier." },
      { t: "Les missions chrétiennes au Cameroun", html: "<ul><li><strong>1841-1845</strong> : les missionnaires baptistes, dont <strong>Joseph Merrick</strong>, venu de la Jamaïque, s'installent à Bimbia ; <strong>Alfred Saker</strong> ouvre une mission à Douala en 1845.</li><li><strong>1858</strong> : Saker fonde Victoria (aujourd'hui Limbé).</li><li>Après 1884 et l'arrivée des Allemands : la <strong>mission de Bâle</strong> (protestante) en 1886, les <strong>pallottins</strong> (catholiques) en 1890 à Marienberg, les presbytériens américains dans le Sud.</li><li>Les missions ouvrent des <strong>écoles</strong> et des dispensaires, traduisent la Bible en langues locales (le duala, puis d'autres).</li></ul>" +
          formule("âge d'une institution = 2026 − année de fondation") +
          ex("La ville de Limbé, fondée sous le nom de Victoria en 1858, a 2026 − 1858 = 168 ans.", "Calculer l'âge d'une ville") +
          attention("Les missions ont aussi joué un rôle pendant la colonisation, et des Camerounais ont parfois été contraints d'abandonner leurs croyances : l'historien présente les faits avec nuance, sans les embellir ni les noircir."),
        planches: [P2("Le christianisme au Cameroun", "Les débuts des missions chrétiennes au Cameroun, de Bimbia aux grandes missions de la période allemande.",
          frise("Les missions au Cameroun", [{ a: "1844", l: ["Merrick", "à Bimbia"], c: "#7B3F99" }, { a: "1845", l: ["Saker", "à Douala"], c: "#1E499B" }, { a: "1858", l: ["fondation", "de Victoria"], c: "#17784D" }, { a: "1886", l: ["mission", "de Bâle"], c: "#C2540A" }, { a: "1890", l: ["pallottins", "à Marienberg"], c: "#C62828" }], 230, "Frise des débuts des missions chrétiennes au Cameroun"))],
        fil: { html: "<p>L'exposé peut conclure : le christianisme est africain depuis l'<strong>Antiquité</strong> (Égypte, Afrique du Nord, Éthiopie), il atteint le Kongo au XVe siècle, et le Cameroun au XIXe siècle avec Merrick à Bimbia et Saker à Douala, avant les grandes missions de la période allemande.</p>", verdicts: [[2, "validee", "Une expansion en plusieurs étapes : Antiquité, Kongo au XVe siècle, Cameroun au XIXe siècle."]] },
        retenir: "Bimbia (Merrick, années 1840) ; Saker à Douala (1845), Victoria (1858) ; Bâle (1886) ; pallottins (1890)." },
      { t: "Entraînement au format de l'examen", html: integ("Le roi d'Axoum qui se convertit au christianisme au IVe siècle est…", ["Afonso Ier", "Ezana", "Lalibela", "Taharqa"], "Ezana", "Vers 350, ses monnaies portent une croix.", "Cite deux étapes anciennes et une étape camerounaise de l'expansion du christianisme en Afrique.", "Anciennes : l'Église copte d'Égypte (Ier-IIe siècle), saint Augustin en Afrique du Nord, Axoum au IVe siècle, le Kongo en 1491. Au Cameroun : Merrick à Bimbia, Saker à Douala en 1845.", "Un camarade dit que « le christianisme est une religion étrangère à l'Afrique ».", "En t'appuyant sur ta leçon, rédige quelques lignes pour nuancer son affirmation.", "Le christianisme est né au Proche-Orient, mais il est présent en Afrique dès ses débuts : en Égypte, où l'Église copte est l'une des plus anciennes du monde, en Afrique du Nord avec saint Augustin, en Éthiopie avec le roi Ezana au IVe siècle. Il atteint le Kongo en 1491 et le Cameroun au XIXe siècle. Il fait donc partie de l'histoire africaine depuis près de deux mille ans, à côté des religions traditionnelles et de l'islam."), retenir: "Savoir-être : respect de la diversité religieuse et esprit de nuance." }
    ],
    denouement: { titre: "La conclusion de l'exposé", etapes: ["Antiquité : Égypte copte, saint Augustin, Axoum (indice 1).", "Moyen Âge et XVe siècle : Lalibela, royaume du Kongo (indice 2).", "XIXe siècle : Bimbia, Douala, Victoria, puis les grandes missions (indice 3)."],
      formules: [F("Mesurer l'ancienneté", "écart = date récente − date ancienne", "1845 − 350 = 1 495 ans"), F("Calculer un âge", "âge = 2026 − année de fondation", "2026 − 1858 = 168 ans (Limbé)"), F("Ordonner", "Égypte → Axoum → Kongo → Cameroun", "« E-A-K-C »")],
      reponse: "<p>Le christianisme n'est pas arrivé en Afrique seulement avec les colons. Il y est présent dès les premiers siècles : en Égypte, où naît l'Église copte, en Afrique du Nord, où saint Augustin (354-430) est évêque d'Hippone, et en Éthiopie, où le roi Ezana d'Axoum se convertit vers 350. Au XIIe et au XIIIe siècle, on taille à Lalibela des églises dans la roche. En 1491, le roi du Kongo est baptisé et son fils Afonso Ier développe le christianisme dans son royaume. Au Cameroun, le christianisme arrive au XIXe siècle : Joseph Merrick à Bimbia dans les années 1840, Alfred Saker à Douala en 1845, puis la fondation de Victoria en 1858, avant les missions de Bâle (1886) et des pallottins (1890). C'est donc une histoire africaine de près de deux mille ans.</p>",
      transfert: "<p>Renseigne-toi sur la date de fondation de l'église, de la mosquée ou de l'école la plus ancienne de ton quartier, et calcule son âge.</p>" },
    revision: ["<strong>Égypte</strong> : Alexandrie, Église copte (Ier-IIe siècle).", "Afrique du Nord : saint Augustin (354-430), évêque d'Hippone.", "Éthiopie : Ezana (vers 350) ; Lalibela, églises taillées dans la roche (XIIe-XIIIe s.).", "Kongo : roi baptisé en 1491 ; Afonso Ier.", "Cameroun : Merrick à Bimbia, Saker à Douala (1845), Victoria (1858).", "Bâle (1886), pallottins (1890) ; écoles, traduction de la Bible en duala."],
    exo: "<p>Range dans l'ordre : Saker à Douala, Ezana chrétien, baptême du roi du Kongo, saint Augustin évêque. <em>(Ezana vers 350 ; Augustin vers 396 ; Kongo 1491 ; Saker 1845.)</em></p>",
    quiz: [q("L'Église chrétienne d'Égypte s'appelle…", "l'Église copte", "l'Église de Bâle", "l'Église de Rome", "L'une des plus anciennes du monde."), q("Saint Augustin était…", "un évêque africain d'Hippone", "un roi d'Axoum", "un missionnaire anglais", "Né en Numidie, actuelle Algérie."), q("Axoum devient chrétien au…", "IVe siècle", "XIXe siècle", "Ier siècle av. J.-C.", "Avec le roi Ezana."), q("À Lalibela, les églises sont…", "taillées dans la roche", "construites en bois", "flottantes", "D'un seul bloc de pierre."), q("Le roi du Kongo est baptisé en…", "1491", "1884", "350", "Nzinga a Nkuwu."), q("Le missionnaire qui ouvre une mission à Douala en 1845 est…", "Alfred Saker", "Joseph Merrick", "Constantin", "Il fonde ensuite Victoria."), q("Victoria, fondée en 1858, s'appelle aujourd'hui…", "Limbé", "Kribi", "Buea", "Elle a 168 ans en 2026."), q("La mission de Bâle arrive au Cameroun en…", "1886", "1491", "1958", "Mission protestante, période allemande."), q("Les pallottins sont des missionnaires…", "catholiques", "baptistes", "musulmans", "Arrivés en 1890 à Marienberg."), q("De 350 à 1845, il s'est écoulé…", "1 495 ans", "2 195 ans", "1 395 ans", "1845 − 350.")],
    apc: apc("Un camarade affirme que le christianisme n'est arrivé en Afrique qu'avec la colonisation.", "Présenter les étapes de l'expansion du christianisme en Afrique et au Cameroun.")
  });
  VRT_A("6e-histoire-christianisme-afrique", 2, "Place chaque étape sur la frise du christianisme africain", function (el) {
    exercice(el, [["L'Église copte se développe en ___.", ["Égypte", "Éthiopie", "au Cameroun"], "Dès le Ier-IIe siècle, autour d'Alexandrie."], ["Le roi Ezana se convertit vers ___.", ["350", "1491", "1845"], "Royaume d'Axoum."], ["Les églises taillées dans la roche se trouvent à ___.", ["Lalibela", "Douala", "Hippone"], "En Éthiopie, XIIe-XIIIe siècle."], ["Le roi du Kongo est baptisé en ___.", ["1491", "350", "1890"], "Après l'arrivée des Portugais."], ["Alfred Saker ouvre une mission à Douala en ___.", ["1845", "1491", "1958"], "Puis il fonde Victoria en 1858."], ["Les pallottins catholiques arrivent au Cameroun en ___.", ["1890", "1845", "350"], "À Marienberg."]], "Étape suivante", "Étape");
  });

  /* ═══════════════ RANG 19 : L'ISLAM ═══════════════ */
  function mosquee3D() {
    var o = [{ f: "boite", c: [0, -6, 0], d: [480, 6, 280], coul: "#D8C49A", dessus: "#E8D8B0" }];
    o.push({ f: "boite", c: [0, 20, -10], d: [400, 40, 220], coul: "#E8DFC9", dessus: "#F2EBDA" });
    o.push({ f: "boite", c: [0, 42, -10], d: [320, 6, 140], coul: "#D8C49A", dessus: "#E0CDA4" });
    o.push({ f: "boite", c: [0, 60, 70], d: [320, 80, 60], coul: "#E0D4B8", dessus: "#C9B890" });
    o.push({ f: "cylindre", c: [0, 100, 70], r: 26, h: 20, n: 16, coul: "#C9B890" });
    o.push({ f: "sphere", c: [0, 124, 70], r: 24, coul: "#B8A070" });
    o.push({ f: "boite", c: [0, 70, -110], d: [56, 140, 56], coul: "#E0D4B8", dessus: "#C9B890" });
    o.push({ f: "boite", c: [0, 152, -110], d: [44, 24, 44], coul: "#D4C6A6", dessus: "#C9B890" });
    o.push({ f: "boite", c: [0, 176, -110], d: [30, 24, 30], coul: "#C9B890", dessus: "#B8A070" });
    [-40, 0, 40].forEach(function (x) { o.push({ f: "boite", c: [x, 36, 39], d: [18, 34, 2], coul: "#6B4423" }); });
    o.push({ f: "cylindre", c: [-110, 45, -40], r: 18, h: 8, n: 14, coul: "#8A7A62" });
    o.push({ f: "cylindre", c: [-110, 50, -40], r: 14, h: 4, n: 14, coul: "#5A93D0" });
    return o;
  }
  VRT_L("6e-histoire-islam", {
    c: "6e", m: "histoire", cle: "L’islam", titre: "L'islam : naissance et principes d'une religion monothéiste", duree: 30,
    accroche: "À Garoua, pendant le ramadan, une élève demande à sa voisine : « Pourquoi le calendrier musulman est-il en 1448 alors que nous sommes en 2026 ? » Où et quand l'islam est-il né ?",
    intro: "Une rupture du jeûne partagée entre voisins, à Garoua, te sert de fil rouge : à chaque partie, un indice t'aide à trancher entre trois idées sur la naissance de l'islam.",
    objectifs: ["situer la naissance de l'islam dans le temps et dans l'espace", "présenter Mahomet (Muhammad), le Coran et l'Hégire", "décrire les cinq piliers de l'islam", "expliquer le calendrier musulman et le comparer au nôtre"],
    enquete: {
      titre: "La rupture du jeûne à Garoua",
      svg: svg(640, 220, "Cour de concession au coucher du soleil : des voisins partagent un repas sur une natte ; au fond, le minaret d'une mosquée", lin("isC", ["#F7C9A0", "#F4EDE1"], true),
        "<rect width='640' height='220' fill='url(#isC)'/><circle cx='560' cy='70' r='26' fill='#F7A94A' opacity='.8'/><rect y='186' width='640' height='34' fill='#C9A06E'/><rect x='470' y='60' width='28' height='126' fill='#E8DFC9' stroke='#B8A070'/><rect x='464' y='54' width='40' height='10' fill='#C9B890'/><rect x='420' y='120' width='160' height='66' fill='#E8DFC9' stroke='#B8A070'/>" +
        "<rect x='120' y='170' width='240' height='16' rx='4' fill='#7B3F99'/><circle cx='200' cy='166' r='12' fill='#F4F1EA' stroke='#9AA3AF'/><circle cx='250' cy='166' r='10' fill='#C2540A'/><circle cx='290' cy='166' r='9' fill='#F7C948'/>" +
        perso(90, 96, "#5A3A1E", "#F4F1EA", "#4D5163") + perso(380, 96, "#6B4423", "#1E499B", "#2E3445") + perso(150, 104, "#4A2E18", "#17784D", "#2E3445") +
        bulle(180, 30, 240, "Pourquoi 1448 et pas 2026 ?", "#F7C948")),
      legende: "À Garoua, des voisins partagent la rupture du jeûne pendant le ramadan.",
      contexte: "<p>Pendant le ramadan, la famille d'Aminatou invite les voisins à rompre le jeûne. Christelle, leur voisine, remarque sur le calendrier accroché au mur l'année 1448. Son frère Joël affirme : « L'islam est né en Afrique, au Nord-Cameroun. » Christelle, elle, pense que « l'islam n'a rien à voir avec le judaïsme et le christianisme ». Aminatou propose de chercher ensemble dans le manuel d'histoire.</p>",
      documents: [{ t: "Repères", html: "<p>Mahomet (Muhammad) naît vers 570 à La Mecque, en Arabie. En 622, il quitte La Mecque pour Médine : c'est l'Hégire, point de départ du calendrier musulman. Il meurt en 632.</p>" },
        { t: "Le Coran (sourate 2, verset 136, sens général)", html: "<p>Les croyants déclarent croire en Dieu et à ce qui a été révélé à Abraham, à Moïse, à Jésus et aux autres prophètes.</p>" }],
      question: "Où, quand et comment l'islam est-il né, et pourquoi le calendrier musulman compte-t-il autrement ?",
      tache: "Situe la naissance de l'islam, présente Mahomet, le Coran et les cinq piliers, puis explique le calendrier musulman.",
      hypotheses: ["L'islam est né en Afrique, au Nord-Cameroun.", "L'islam n'a aucun lien avec le judaïsme et le christianisme.", "L'islam est né en Arabie au VIIe siècle avec Mahomet ; c'est un monothéisme qui reconnaît Abraham, Moïse et Jésus comme prophètes, et son calendrier commence en 622."]
    },
    parties: [
      { t: "Mahomet et la naissance de l'islam", html: def("Islam", "Mot arabe qui signifie « soumission » à Dieu. Religion monothéiste née en Arabie au VIIe siècle ; ses fidèles sont les musulmans, ils appellent Dieu Allah.") +
          "<ul><li><strong>Mahomet</strong> (Muhammad) naît vers <strong>570</strong> à <strong>La Mecque</strong>, une ville marchande d'Arabie.</li><li>Vers <strong>610</strong>, selon la tradition musulmane, il reçoit la révélation de l'ange Gabriel et prêche un Dieu unique.</li><li>En <strong>622</strong>, menacé, il part pour <strong>Médine</strong> : c'est l'<strong>Hégire</strong> (l'émigration).</li><li>Il revient à La Mecque en 630 et meurt en <strong>632</strong> ; l'Arabie est alors en grande partie musulmane.</li></ul>" +
          formule("âge = 2026 − date apr. J.-C. ; durée = date récente − date ancienne") +
          ex("De la naissance de Mahomet (vers 570) à l'Hégire (622) : 622 − 570 = 52 ans. Il avait environ 52 ans quand il partit pour Médine.", "Calculer un âge au moment d'un événement") +
          attention("L'islam est né en Arabie, pas en Afrique : il arrive en Afrique ensuite, par l'Égypte et le Sahara (leçon suivante)."),
        planches: [P2("La vie de Mahomet en dates", "Les grandes dates de la naissance de l'islam, en Arabie, au VIIe siècle.",
          frise("La naissance de l'islam", [{ a: "vers 570", l: ["naissance", "à La Mecque"], c: "#B07A00" }, { a: "vers 610", l: ["révélation", "début de la prédication"], c: "#17784D" }, { a: "622", l: ["Hégire :", "départ pour Médine"], c: "#C62828" }, { a: "630", l: ["retour", "à La Mecque"], c: "#1E499B" }, { a: "632", l: ["mort", "de Mahomet"], c: "#4D5163" }], 230, "Frise de la vie de Mahomet"))],
        fil: { html: "<p>Joël se trompe : l'islam n'est pas né au Nord-Cameroun mais en <strong>Arabie</strong>, à La Mecque et à Médine, au VIIe siècle. Il est arrivé en Afrique ensuite, puis, bien plus tard, au Nord-Cameroun.</p>", verdicts: [[0, "rejetee", "L'islam est né en Arabie au VIIe siècle, pas en Afrique."]] },
        retenir: "Islam : « soumission » à Dieu ; Mahomet né vers 570 à La Mecque ; révélation vers 610 ; Hégire 622 ; mort en 632." },
      { t: "Le Coran et les cinq piliers", html: "<ul><li><strong>Le Coran</strong> est le livre sacré des musulmans : il rassemble, selon eux, la parole de Dieu révélée à Mahomet. Il est écrit en arabe et divisé en sourates.</li><li>L'islam reconnaît <strong>Abraham, Moïse et Jésus</strong> comme des prophètes ; Mahomet est pour les musulmans le dernier prophète.</li><li><strong>Les cinq piliers</strong> : la <strong>profession de foi</strong> (chahada) ; la <strong>prière</strong> cinq fois par jour (salat), tourné vers La Mecque ; l'<strong>aumône</strong> aux pauvres (zakat) ; le <strong>jeûne</strong> du mois de ramadan (sawm) ; le <strong>pèlerinage</strong> à La Mecque une fois dans sa vie si on le peut (hajj).</li><li>Les musulmans prient à la <strong>mosquée</strong> ; le muezzin appelle à la prière du haut du minaret.</li></ul>" +
          def("Pilier de l'islam", "Une des cinq obligations principales du croyant musulman, sur lesquelles repose sa pratique religieuse.") +
          ex("Pendant le ramadan, les musulmans ne mangent ni ne boivent du lever au coucher du soleil ; le soir, la rupture du jeûne est souvent un moment de partage, comme chez Aminatou.", "Le jeûne du ramadan") +
          astuce("Pour retenir les cinq piliers, compte sur ta main : 1 la foi, 2 la prière, 3 l'aumône, 4 le jeûne, 5 le pèlerinage."),
        planches: [{ type: "3d", titre: "Une mosquée ancienne à minaret carré", legende: "Tourne la mosquée : une grande cour entourée de murs, une fontaine pour les ablutions, une salle de prière couverte d'une coupole et, de l'autre côté, un minaret carré à étages, d'où le muezzin appelle à la prière. La grande mosquée de Kairouan, en Tunisie, fondée au VIIe siècle, a cette forme.", modele: { h: 350, rx: -22, ry: 30, echelle: 0.72, alt: "Mosquée avec cour, fontaine, salle de prière à coupole et minaret carré à étages", objets: mosquee3D(), etiquettes: [{ p: [0, 188, -110], t: "minaret", cote: "g" }, { p: [0, 148, 70], t: "coupole de la salle de prière", cote: "d" }, { p: [-110, 58, -40], t: "fontaine aux ablutions", cote: "g" }, { p: [-40, 48, 10], t: "cour", cote: "d" }] } }],
        fil: { html: "<p>Christelle se trompe : l'islam est un <strong>monothéisme</strong>, comme le judaïsme et le christianisme, et il reconnaît Abraham, Moïse et Jésus comme des prophètes. On dit parfois que ces trois religions sont les « religions d'Abraham ».</p>", verdicts: [[1, "rejetee", "L'islam reconnaît Abraham, Moïse et Jésus comme prophètes : il est lié aux deux autres monothéismes."]] },
        retenir: "Coran ; prophètes Abraham, Moïse, Jésus, Mahomet ; cinq piliers : foi, prière, aumône, jeûne, pèlerinage ; mosquée, minaret." },
      { t: "Le calendrier musulman et la première expansion", html: "<ul><li>Le <strong>calendrier musulman</strong> commence en <strong>622</strong>, l'année de l'Hégire.</li><li>C'est un calendrier <strong>lunaire</strong> : 12 mois lunaires font environ <strong>354 jours</strong>, soit 11 jours de moins que notre année solaire de 365 jours. Le ramadan avance donc d'environ 11 jours chaque année.</li><li>Après 632, les <strong>califes</strong>, successeurs de Mahomet, étendent l'empire musulman : Proche-Orient, Égypte (vers 640), Afrique du Nord, puis Espagne (711).</li></ul>" +
          formule("année musulmane ≈ (année grégorienne − 622) × 33 ÷ 32") +
          ex("En 2026 : (2026 − 622) × 33 ÷ 32 = 1 404 × 33 ÷ 32 ≈ 1 448. Le calendrier musulman est plus « en avance » que 1 404, car ses années lunaires sont plus courtes.", "Calculer l'année musulmane") +
          savais("33 années lunaires durent à peu près autant que 32 années solaires : c'est pourquoi on multiplie par 33 et on divise par 32."),
        planches: [P2("Deux calendriers, deux façons de compter", "Notre calendrier suit le Soleil, le calendrier musulman suit la Lune : il compte à partir de l'Hégire et ses années sont plus courtes.",
          colonnes("Calendrier grégorien et calendrier musulman", [{ t: "Grégorien (solaire)", c: "#C2540A", l: ["départ : naissance de Jésus", "année de 365 jours", "suit le Soleil", "→ 2026"] }, { t: "Musulman (lunaire)", c: "#17784D", l: ["départ : Hégire, 622", "année d'environ 354 jours", "suit la Lune", "→ environ 1448"] }], 230, "Tableau comparant le calendrier grégorien et le calendrier musulman"))],
        fil: { html: "<p>La réponse à Christelle est dans le calcul : le calendrier musulman commence en 622 et ses années lunaires sont plus courtes de 11 jours, d'où <strong>(2026 − 622) × 33 ÷ 32 ≈ 1 448</strong>. L'islam est né en Arabie au VIIe siècle, s'est répandu très vite et partage avec le judaïsme et le christianisme la foi en un seul Dieu.</p>", verdicts: [[2, "validee", "Né en Arabie au VIIe siècle, monothéiste, lié aux religions d'Abraham, avec un calendrier lunaire qui commence en 622."]] },
        retenir: "Calendrier lunaire depuis 622 ; année ≈ 354 jours ; année musulmane ≈ (année − 622) × 33 ÷ 32 ; califes ; Égypte vers 640, Espagne 711." },
      { t: "Entraînement au format de l'examen", html: integ("L'Hégire, point de départ du calendrier musulman, date de…", ["570", "610", "622", "632"], "622", "Mahomet part de La Mecque pour Médine.", "Cite les cinq piliers de l'islam.", "La profession de foi, la prière cinq fois par jour, l'aumône, le jeûne du ramadan, le pèlerinage à La Mecque.", "Pendant le ramadan, un camarade se moque d'un élève qui jeûne et ne mange pas à la récréation.", "En t'appuyant sur ta leçon, rédige quelques lignes pour lui expliquer le sens du jeûne et l'inviter au respect.", "Le jeûne du ramadan est l'un des cinq piliers de l'islam : du lever au coucher du soleil, les musulmans ne mangent ni ne boivent, pour obéir à Dieu et partager la faim des plus pauvres. Ce n'est ni une punition ni une bizarrerie. Au Cameroun, chacun est libre de sa religion : se moquer d'un camarade qui jeûne, c'est manquer de respect. Mieux vaut l'encourager, ou partager avec lui la rupture du jeûne le soir."), retenir: "Savoir-être : respect des pratiques religieuses de chacun et vivre-ensemble." }
    ],
    denouement: { titre: "Ce que les voisins ont appris ensemble", etapes: ["L'islam est né en Arabie, à La Mecque et à Médine, au VIIe siècle (indice 1).", "C'est un monothéisme qui reconnaît Abraham, Moïse et Jésus ; il repose sur le Coran et les cinq piliers (indice 2).", "Son calendrier est lunaire et commence en 622 : d'où l'année 1448 (indice 3)."],
      formules: [F("Calculer un âge", "âge au moment d'un événement = date de l'événement − date de naissance", "622 − 570 = 52 ans"), F("Convertir une année", "année musulmane ≈ (année − 622) × 33 ÷ 32", "(2026 − 622) × 33 ÷ 32 ≈ 1 448"), F("Comparer les années", "année solaire − année lunaire ≈ 365 − 354 = 11 jours", "le ramadan avance de 11 jours par an")],
      reponse: "<p>L'islam est né en Arabie au VIIe siècle. Mahomet (Muhammad), né vers 570 à La Mecque, commence à prêcher un Dieu unique vers 610 ; menacé, il part pour Médine en 622 : c'est l'Hégire, point de départ du calendrier musulman ; il meurt en 632. L'islam est une religion monothéiste : son livre sacré est le Coran, il reconnaît Abraham, Moïse et Jésus comme prophètes, et sa pratique repose sur cinq piliers, la profession de foi, la prière, l'aumône, le jeûne du ramadan et le pèlerinage à La Mecque. Son calendrier est lunaire : ses années, d'environ 354 jours, sont plus courtes que les nôtres, ce qui explique qu'en 2026 on soit en 1448 de l'Hégire. Après la mort de Mahomet, les califes étendent l'islam jusqu'en Égypte et en Afrique du Nord.</p>",
      transfert: "<p>Si le ramadan commence le 18 février une année, vers quelle date commencera-t-il l'année suivante ? Explique ton calcul.</p>" },
    revision: ["<strong>Islam</strong> : « soumission » à Dieu ; religion monothéiste née en Arabie au VIIe siècle.", "Mahomet : né vers 570 à La Mecque ; révélation vers 610 ; Hégire 622 ; mort en 632.", "Coran ; prophètes reconnus : Abraham, Moïse, Jésus ; Mahomet, dernier prophète.", "Cinq piliers : foi, prière, aumône, jeûne du ramadan, pèlerinage à La Mecque.", "Mosquée, minaret, muezzin.", "Calendrier lunaire depuis 622 ; ≈ 354 jours ; année musulmane ≈ (année − 622) × 33 ÷ 32."],
    exo: "<p>Combien d'années séparent l'Hégire (622) de la mort de Mahomet (632) ? Et la mort de Mahomet de l'arrivée de l'islam en Égypte (vers 640) ? <em>(10 ans ; environ 8 ans.)</em></p>",
    quiz: [q("L'islam est né…", "en Arabie", "au Cameroun", "en Grèce", "À La Mecque et à Médine."), q("Mahomet est né vers…", "570 à La Mecque", "622 à Médine", "30 à Jérusalem", "Dans une ville marchande d'Arabie."), q("L'Hégire, c'est…", "le départ de Mahomet pour Médine en 622", "le pèlerinage à La Mecque", "le livre sacré", "Le point de départ du calendrier."), q("Le livre sacré des musulmans est…", "le Coran", "la Torah", "les Évangiles", "Écrit en arabe."), q("L'islam reconnaît comme prophètes…", "Abraham, Moïse et Jésus", "Zeus et Apollon", "aucun autre que Mahomet", "Les « religions d'Abraham »."), q("Combien y a-t-il de piliers de l'islam ?", "cinq", "trois", "dix", "Foi, prière, aumône, jeûne, pèlerinage."), q("Le jeûne des musulmans a lieu pendant le mois de…", "ramadan", "sabbat", "carême", "Du lever au coucher du soleil."), q("Le calendrier musulman est…", "lunaire", "solaire", "égyptien", "Ses années durent environ 354 jours."), q("En 2026, l'année musulmane est environ…", "1448", "1404", "2648", "(2026 − 622) × 33 ÷ 32."), q("Celui qui appelle à la prière du haut du minaret est…", "le muezzin", "le calife", "le rabbin", "Cinq fois par jour.")],
    apc: apc("Pendant le ramadan, des voisins de religions différentes partagent la rupture du jeûne et se posent des questions sur l'islam.", "Présenter la naissance, les principes et le calendrier de l'islam.")
  });
  VRT_A("6e-histoire-islam", 2, "Calcule comme sur le calendrier de l'Hégire", function (el) {
    exercice(el, [["L'Hégire a lieu en ___.", ["622", "570", "632"], "Point de départ du calendrier musulman."], ["Une année lunaire dure environ ___ jours.", ["354", "365", "300"], "12 mois lunaires."], ["L'écart entre l'année solaire et l'année lunaire est d'environ ___ jours.", ["11", "30", "1"], "365 − 354 = 11."], ["En 2026, l'année musulmane est environ ___.", ["1448", "1404", "2026"], "(2026 − 622) × 33 ÷ 32."], ["Mahomet avait environ ___ ans lors de l'Hégire.", ["52", "62", "22"], "622 − 570 = 52."], ["Le cinquième pilier de l'islam est le ___.", ["pèlerinage à La Mecque", "jeûne", "Coran"], "Le hajj, une fois dans sa vie si on le peut."]], "Calcul suivant", "Calcul");
  });
})();
