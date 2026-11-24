/* Leçons GRATUITES — Histoire de 6e, lot 7 (24/11/2026) : les dossiers 3 et 4, rangs 15 (l'apport de Rome) et 21
   (les pèlerinages dans les religions chrétiennes et musulmanes). Ajoute aussi le rang 11 (la religion de l'Égypte ancienne), oublié jusque-là : termine l'histoire de 6e (21 rangs sur 21). Même gabarit que 36- à 41-histoire-6e. */
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







  /* ═══════════════ RANG 15 : DOSSIER 3, L'APPORT DE ROME ═══════════════ */
  function aqueduc3D() {
    var o = [{ f: "boite", c: [0, -6, 0], d: [500, 6, 240], coul: "#8AA05A", dessus: "#9AB06A" }];
    o.push({ f: "boite", c: [0, 2, -90], d: [500, 4, 30], coul: "#4A8AC8", dessus: "#6FA8DC" });
    for (var i = 0; i < 6; i++) {
      var x = -200 + i * 80;
      o.push({ f: "boite", c: [x, 50, 0], d: [22, 100, 30], coul: "#C9B890", dessus: "#D8C8A0" });
      if (i < 5) o.push({ f: "boite", c: [x + 40, 112, 0], d: [80, 24, 30], coul: "#C2B080", dessus: "#D4C49A" });
    }
    o.push({ f: "boite", c: [0, 134, 0], d: [440, 20, 30], coul: "#B8A478", dessus: "#C9B890" });
    o.push({ f: "boite", c: [0, 145, 0], d: [440, 2, 14], coul: "#4A8AC8", dessus: "#6FA8DC", div: false });
    o.push({ f: "boite", c: [120, 3, 80], d: [260, 4, 34], coul: "#8A8A8A", dessus: "#A0A0A0" });
    [0, 1, 2, 3, 4].forEach(function (k) { o.push({ f: "boite", c: [10 + k * 50, 6, 80], d: [40, 2, 26], coul: "#9A9A9A", dessus: "#B4B4B4", div: false }); });
    return o;
  }
  VRT_L("6e-histoire-rome", {
    c: "6e", m: "histoire", cle: "Dossier 3 : L’apport de Rome", titre: "Dossier 3 : L'apport de Rome, un héritage dans notre vie", duree: 30,
    accroche: "Sur la couverture d'un livre, une élève lit « Chapitre XIV » et sur sa montre « IV » et « IX ». « Ce sont des chiffres de qui ? » Et pourquoi le mois de juillet porte-t-il le nom d'un homme ?",
    intro: "Un exposé préparé au CDI d'un lycée de Bafoussam te sert de fil rouge : à chaque partie, un indice t'aide à trancher entre trois idées sur ce que nous devons à Rome.",
    objectifs: ["situer Rome dans le temps : royauté, République, Empire", "décrire l'Empire romain et l'Afrique romaine", "présenter les apports de Rome : droit, langue, routes, villes, calendrier", "lire et écrire les chiffres romains"],
    enquete: {
      titre: "L'exposé du CDI",
      svg: svg(640, 220, "CDI d'un lycée : une montre au cadran en chiffres romains, un livre ouvert au chapitre XIV, un calendrier ; deux élèves discutent", lin("roC", ["#E6EEF8", "#F4F1EA"], true),
        "<rect width='640' height='220' fill='url(#roC)'/><rect y='186' width='640' height='34' fill='#8B6B4A'/><circle cx='320' cy='90' r='50' fill='#FBF8F2' stroke='#B07A00' stroke-width='5'/>" + txt(320, 52, "XII", { s: 13 }) + txt(362, 95, "III", { s: 13 }) + txt(320, 136, "VI", { s: 13 }) + txt(278, 95, "IX", { s: 13 }) + "<path d='M320 90V60M320 90L344 102' stroke='#142554' stroke-width='3' stroke-linecap='round'/>" +
        "<rect x='420' y='140' width='90' height='46' fill='#F4F1EA' stroke='#9AA3AF'/>" + txt(465, 168, "Chapitre XIV", { s: 11 }) + "<rect x='140' y='130' width='70' height='56' fill='#fff' stroke='#C62828' stroke-width='2'/>" + txt(175, 150, "JUILLET", { s: 10, c: "#C62828" }) + txt(175, 172, "AOÛT", { s: 10, c: "#C62828" }) +
        perso(80, 98, "#5A3A1E", "#C2540A", "#2E3445") + perso(570, 98, "#6B4423", "#1E499B", "#2E3445") +
        bulle(380, 20, 240, "Des chiffres de qui ?", "#F7C948")),
      legende: "Au CDI d'un lycée de Bafoussam, deux élèves préparent un exposé sur Rome.",
      contexte: "<p>Pour leur dossier, Gaëlle et Ulrich doivent montrer « ce que nous devons à Rome ». Ulrich pense que « Rome, c'est de l'histoire ancienne, ça n'a plus rien à voir avec notre vie ». Gaëlle croit au contraire que « les Romains ont tout inventé, même l'écriture et les mathématiques ». La documentaliste leur montre une montre au cadran en chiffres romains, un livre et un calendrier : « Cherchez Rome autour de vous. »</p>",
      documents: [{ t: "Le calendrier de Jules César", html: "<p>En 46 av. J.-C., Jules César fait adopter un calendrier de 365 jours, avec une année de 366 jours tous les quatre ans. Le mois de juillet porte son nom (Julius) ; plus tard, août prend celui de l'empereur Auguste (Augustus).</p>" },
        { t: "Un empereur africain", html: "<p>Septime Sévère, né à Leptis Magna, en Afrique (actuelle Libye), devient empereur de Rome en 193 et règne jusqu'en 211.</p>" }],
      question: "Que nous a apporté Rome, et cet héritage est-il encore présent dans notre vie ?",
      tache: "Situe Rome dans le temps, décris son empire, puis présente ses apports encore visibles aujourd'hui.",
      hypotheses: ["Rome n'a plus rien à voir avec notre vie d'aujourd'hui.", "Les Romains ont tout inventé, même l'écriture et les mathématiques.", "Rome a hérité des Grecs, des Égyptiens et d'autres peuples, et nous a transmis un droit, une langue, des routes, des villes, un calendrier et des chiffres encore utilisés."]
    },
    parties: [
      { t: "De la petite ville à l'immense empire", html: def("Empire romain", "Ensemble des territoires gouvernés par Rome, qui entouraient toute la mer Méditerranée, appelée par les Romains mare nostrum, « notre mer ».") +
          "<ul><li><strong>753 av. J.-C.</strong> : selon la légende, fondation de Rome par Romulus.</li><li><strong>509 av. J.-C.</strong> : début de la <strong>République</strong> ; Rome est gouvernée par des magistrats élus et le Sénat.</li><li><strong>27 av. J.-C.</strong> : Auguste devient le premier <strong>empereur</strong>.</li><li><strong>L'Afrique romaine</strong> : après la destruction de Carthage (146 av. J.-C.), l'Afrique du Nord devient une province riche en blé et en huile ; Septime Sévère, né en Afrique, devient empereur en 193.</li></ul>" +
          formule("durée av. J.-C. = date de début − date de fin") +
          ex("La République romaine dure de 509 à 27 av. J.-C. : 509 − 27 = 482 ans.", "Calculer la durée de la République") +
          attention("Rome n'est pas partie de rien : elle a beaucoup emprunté aux Étrusques, aux Grecs et aux peuples de la Méditerranée, dont l'Égypte."),
        planches: [P2("Les trois âges de Rome", "Rome passe d'une petite ville gouvernée par des rois à une république, puis à un empire qui entoure la Méditerranée.",
          frise("Rome : royauté, République, Empire", [{ a: "753 av. J.-C.", l: ["fondation", "(légende)"], c: "#7B3F99" }, { a: "509 av. J.-C.", l: ["début de la", "République"], c: "#1E499B" }, { a: "146 av. J.-C.", l: ["Carthage détruite,", "province d'Afrique"], c: "#C2540A" }, { a: "27 av. J.-C.", l: ["Auguste,", "premier empereur"], c: "#B07A00" }, { a: "193", l: ["Septime Sévère,", "empereur africain"], c: "#17784D" }], 230, "Frise de l'histoire de Rome"))],
        fil: { html: "<p>Gaëlle exagère : les Romains n'ont pas tout inventé. L'écriture et les mathématiques existaient bien avant eux, en Égypte et en Mésopotamie ; les Grecs leur ont transmis la philosophie et les sciences. Rome a <strong>hérité</strong> beaucoup, puis a diffusé ces savoirs dans tout son empire.</p>", verdicts: [[1, "rejetee", "Rome a hérité des Égyptiens, des Grecs et d'autres peuples : elle n'a pas tout inventé."]] },
        retenir: "753 av. J.-C. (légende) ; République 509 ; Empire 27 av. J.-C. ; Afrique romaine ; Septime Sévère (193)." },
      { t: "Routes, villes et aqueducs", html: "<ul><li><strong>Les voies romaines</strong> : des dizaines de milliers de kilomètres de routes pavées relient les villes ; on dit que « tous les chemins mènent à Rome ».</li><li><strong>Les villes</strong> : un forum (la grande place), des temples, des thermes (bains publics), un amphithéâtre pour les jeux, comme le Colisée de Rome (inauguré en 80 apr. J.-C.).</li><li><strong>Les aqueducs</strong> : des canaux, parfois portés par des ponts à arches, amènent l'eau des sources jusqu'aux villes grâce à une pente très douce.</li><li><strong>Les techniques</strong> : l'arc, la voûte et le béton romain.</li></ul>" +
          formule("dénivelé = longueur × pente (pente en mètres par kilomètre)") +
          ex("Un aqueduc de 50 km avec une pente de 0,3 m par kilomètre descend de 50 × 0,3 = 15 m entre la source et la ville : assez pour que l'eau coule seule.", "Calculer la pente d'un aqueduc") +
          astuce("Pour retenir la ville romaine, pense à « FTTA » : Forum, Temples, Thermes, Amphithéâtre."),
        planches: [{ type: "3d", titre: "Un aqueduc et une voie romaine", legende: "Tourne le paysage : un aqueduc à arches porte l'eau, dans un canal couvert, de la colline jusqu'à la ville ; au pied, une voie romaine pavée ; au fond, une rivière. L'eau coule seule grâce à une pente de quelques dizaines de centimètres par kilomètre.", modele: { h: 340, rx: -14, ry: 30, echelle: 0.72, alt: "Aqueduc à arches en pierre claire portant un canal d'eau, une route pavée au pied et une rivière", objets: aqueduc3D(), etiquettes: [{ p: [0, 146, 0], t: "canal d'eau", cote: "d" }, { p: [-160, 100, -16], t: "arches", cote: "g" }, { p: [140, 8, 80], t: "voie romaine pavée", cote: "d" }, { p: [-200, 4, -90], t: "rivière", cote: "g" }] } }],
        fil: { html: "<p>Ulrich se trompe : les routes pavées, les aqueducs, l'arc et la voûte des ponts et des bâtiments viennent des techniques romaines. En Afrique du Nord, on voit encore des villes romaines entières, comme Leptis Magna ou Timgad.</p>", verdicts: [[0, "rejetee", "Routes, aqueducs, arcs et villes : l'héritage romain est encore visible."]] },
        retenir: "Voies pavées ; forum, temples, thermes, amphithéâtre ; aqueducs ; arc, voûte, béton." },
      { t: "Le droit, la langue, le calendrier, les chiffres", html: "<ul><li><strong>Le droit romain</strong> : des lois écrites, valables pour tous les citoyens ; notre droit, au Cameroun comme en France, en a gardé des principes et des mots (juge, tribunal, citoyen).</li><li><strong>Le latin</strong> : la langue de Rome a donné naissance au français, à l'espagnol, à l'italien, au portugais et au roumain (langues romanes).</li><li><strong>Le calendrier julien</strong> (46 av. J.-C.) : 365 jours, et 366 tous les quatre ans ; il est l'ancêtre du calendrier grégorien.</li><li><strong>Les chiffres romains</strong> : I = 1, V = 5, X = 10, L = 50, C = 100, D = 500, M = 1 000.</li></ul>" +
          formule("chiffres romains : on additionne de gauche à droite ; un symbole plus petit placé avant un plus grand se retranche (IV = 4, IX = 9)") +
          ex("MMXXVI = 1 000 + 1 000 + 10 + 10 + 5 + 1 = 2026 ; XIV = 10 + (5 − 1) = 14 ; XIX = 10 + (10 − 1) = 19.", "Lire des chiffres romains") +
          savais("Juillet vient de Julius (Jules César) et août d'Augustus (l'empereur Auguste) : chaque été, ton calendrier te rappelle deux Romains."),
        planches: [P2("L'héritage romain autour de toi", "Quatre apports de Rome que l'on retrouve encore dans la vie de tous les jours.",
          colonnes("Ce que nous devons à Rome", [{ t: "Le droit", c: "#1E499B", l: ["lois écrites", "juge, tribunal", "citoyen"] }, { t: "La langue", c: "#C2540A", l: ["latin → français", "espagnol, italien", "portugais, roumain"] }, { t: "Le calendrier", c: "#17784D", l: ["365 jours", "année bissextile", "juillet, août"] }, { t: "Les chiffres", c: "#7B3F99", l: ["I V X L", "C D M", "siècles, chapitres"] }], 210, "Le droit, la langue, le calendrier et les chiffres hérités de Rome"))],
        fil: { html: "<p>Les élèves ont trouvé Rome autour d'eux : les chiffres de la montre et du chapitre XIV, les mois de juillet et d'août, les mots du français venus du latin, le droit et ses tribunaux. Rome a <strong>hérité</strong> des autres peuples et nous a <strong>transmis</strong> un héritage bien vivant.</p>", verdicts: [[2, "validee", "Héritière des Grecs et des Égyptiens, Rome nous a transmis un droit, une langue, des routes, un calendrier et des chiffres."]] },
        retenir: "Droit romain ; latin → langues romanes ; calendrier julien (46 av. J.-C.) ; I V X L C D M." },
      { t: "Entraînement au format de l'examen", html: integ("Le premier empereur romain est…", ["Jules César", "Auguste", "Romulus", "Septime Sévère"], "Auguste", "Il devient empereur en 27 av. J.-C.", "Écris en chiffres romains 2026, 14 et 49.", "2026 = MMXXVI ; 14 = XIV ; 49 = XLIX (40 = XL et 9 = IX).", "Ton petit frère dit que « Rome n'a rien laissé, ce sont des ruines ».", "En t'appuyant sur ta leçon, rédige quelques lignes pour lui montrer l'héritage romain dans sa vie.", "Rome nous a laissé beaucoup plus que des ruines. Les chiffres romains servent encore à numéroter les siècles et les chapitres ; les mois de juillet et d'août portent les noms de Jules César et d'Auguste ; notre calendrier de 365 jours vient du calendrier de Jules César ; le français vient du latin ; notre droit a gardé des principes et des mots du droit romain ; et les routes pavées et les ponts à arches reprennent des techniques romaines."), retenir: "Savoir-être : curiosité pour le patrimoine du monde et pour ses liens avec notre vie." }
    ],
    denouement: { titre: "L'exposé de Gaëlle et Ulrich", etapes: ["Situer Rome : royauté, République, Empire, Afrique romaine (indice 1).", "Montrer les traces matérielles : routes, villes, aqueducs (indice 2).", "Montrer l'héritage vivant : droit, langue, calendrier, chiffres (indice 3)."],
      formules: [F("Durée av. J.-C.", "durée = date de début − date de fin", "509 − 27 = 482 ans"), F("Pente d'un aqueduc", "dénivelé = longueur × pente", "50 × 0,3 = 15 m"), F("Chiffres romains", "additionner ; soustraire le petit placé avant le grand", "MMXXVI = 2026 ; XIV = 14")],
      reponse: "<p>Rome n'est pas une histoire morte. Petite ville fondée, selon la légende, en 753 av. J.-C., elle devient une République en 509 av. J.-C., puis un empire à partir de 27 av. J.-C., qui entoure toute la Méditerranée, y compris l'Afrique du Nord, d'où est venu l'empereur Septime Sévère. Rome n'a pas tout inventé : elle a hérité des Égyptiens, des Grecs et d'autres peuples. Mais elle a diffusé et nous a transmis un riche héritage : des routes pavées, des villes avec forum, thermes et amphithéâtre, des aqueducs à arches, un droit écrit dont notre droit garde des principes et des mots, le latin d'où vient le français, le calendrier de Jules César avec ses mois de juillet et d'août, et les chiffres romains, encore utilisés pour les siècles et les chapitres, comme le chapitre XIV du livre de Gaëlle.</p>",
      transfert: "<p>Cherche dans ta maison, ton école ou ta ville trois traces de l'héritage romain (chiffres, mots, monuments, dates). Pour chacune, explique d'où elle vient.</p>" },
    revision: ["<strong>Rome</strong> : 753 av. J.-C. (légende) ; République 509 av. J.-C. ; Empire 27 av. J.-C. (Auguste).", "Mare nostrum : l'Empire autour de la Méditerranée ; Afrique romaine, Carthage, Leptis Magna.", "Voies pavées, forum, thermes, amphithéâtre (Colisée), aqueducs, arc et voûte.", "Droit romain ; latin → français, espagnol, italien, portugais, roumain.", "Calendrier julien (46 av. J.-C.) : 365 jours, 366 tous les 4 ans ; juillet, août.", "Chiffres romains : I = 1, V = 5, X = 10, L = 50, C = 100, D = 500, M = 1 000."],
    exo: "<p>Écris en chiffres arabes : XXI, XLVI, MCMLX. <em>(21 ; 46 ; 1960.)</em></p>",
    quiz: [q("Selon la légende, Rome est fondée en…", "753 av. J.-C.", "1960", "27 av. J.-C.", "Par Romulus."), q("Le premier empereur romain est…", "Auguste", "Romulus", "Périclès", "En 27 av. J.-C."), q("Les Romains appelaient la Méditerranée…", "mare nostrum", "Noun", "Pnyx", "« Notre mer »."), q("Septime Sévère, empereur de Rome, est né…", "en Afrique, à Leptis Magna", "à Rome", "en Grèce", "Il règne de 193 à 211."), q("Un aqueduc sert à…", "amener l'eau jusqu'aux villes", "construire des bateaux", "écrire les lois", "Grâce à une pente douce."), q("Le mois de juillet doit son nom à…", "Jules César", "Auguste", "Romulus", "Julius."), q("Le français vient surtout du…", "latin", "grec", "arabe", "C'est une langue romane."), q("En chiffres romains, 2026 s'écrit…", "MMXXVI", "MMXVI", "MMCXXVI", "1000 + 1000 + 10 + 10 + 5 + 1."), q("IX vaut…", "9", "11", "4", "10 − 1."), q("La République romaine dure environ…", "482 ans", "48 ans", "1 000 ans", "509 − 27.")],
    apc: apc("Des élèves pensent que Rome n'a plus aucun lien avec leur vie quotidienne.", "Présenter l'histoire de Rome et son héritage encore visible aujourd'hui.")
  });
  VRT_A("6e-histoire-rome", 2, "Lis et écris les chiffres romains", function (el) {
    exercice(el, [["XIV vaut ___.", ["14", "16", "9"], "10 + (5 − 1)."], ["XIX vaut ___.", ["19", "21", "11"], "10 + (10 − 1)."], ["2026 s'écrit ___.", ["MMXXVI", "MMXVI", "MMXXIV"], "1000 + 1000 + 10 + 10 + 5 + 1."], ["Le XXIe siècle s'écrit aussi le siècle numéro ___.", ["21", "19", "12"], "10 + 10 + 1."], ["XL vaut ___.", ["40", "60", "15"], "50 − 10."], ["MCMLX vaut ___.", ["1960", "2160", "1940"], "1000 + (1000 − 100) + 50 + 10."]], "Nombre suivant", "Nombre");
  });

  /* ═══════════════ RANG 21 : DOSSIER 4, LES PÈLERINAGES ═══════════════ */
  function chemins3D() {
    var o = [{ f: "boite", c: [0, -6, 0], d: [520, 6, 280], coul: "#D8C49A", dessus: "#E6D4AA" }];
    var p1 = [[-230, -120], [-170, -90], [-130, -110], [-110, -20]], p2 = [[230, -120], [170, -90], [130, -110], [110, -20]];
    [p1, p2].forEach(function (pts, s) { for (var i = 0; i < pts.length - 1; i++) { var a = pts[i], b = pts[i + 1], cx = (a[0] + b[0]) / 2, cz = (a[1] + b[1]) / 2, l = Math.hypot(b[0] - a[0], b[1] - a[1]); o.push({ f: "boite", c: [cx, 1, cz], d: [l, 2, 10], coul: s ? "#17784D" : "#1E499B", div: false }); } pts.forEach(function (p) { o.push({ f: "cylindre", c: [p[0], 0, p[1]], r: 8, h: 14, n: 10, coul: s ? "#2E9A5B" : "#3F68B8" }); }); });
    /* destination 1 : un sanctuaire à clocher */
    o.push({ f: "boite", c: [-110, 30, 60], d: [90, 60, 60], coul: "#E8DFC9", dessus: "#C9B890" });
    o.push({ f: "boite", c: [-160, 60, 60], d: [26, 120, 26], coul: "#E0D4B8", dessus: "#C9B890" });
    o.push({ f: "poly", pts: [[-173, 120, 47], [-147, 120, 47], [-160, 150, 60]], coul: "#8B3A2A" });
    o.push({ f: "poly", pts: [[-147, 120, 47], [-147, 120, 73], [-160, 150, 60]], coul: "#6B2A1E" });
    /* destination 2 : une mosquée à coupole et minaret */
    o.push({ f: "boite", c: [110, 30, 60], d: [90, 60, 60], coul: "#E8DFC9", dessus: "#C9B890" });
    o.push({ f: "sphere", c: [110, 64, 60], r: 22, coul: "#2E9A5B" });
    o.push({ f: "cylindre", c: [170, 0, 60], r: 10, h: 100, n: 12, coul: "#E0D4B8" });
    o.push({ f: "cylindre", c: [170, 100, 60], r: 13, h: 6, n: 12, coul: "#C9B890" });
    return o;
  }
  VRT_L("6e-histoire-pelerinages", {
    c: "6e", m: "histoire", cle: "Dossier 4 : Les pèlerinages", titre: "Dossier 4 : Les pèlerinages chrétiens et musulmans", duree: 30,
    accroche: "Le père de Halima part en pèlerinage à La Mecque ; la tante de Marc part pour Jérusalem et Rome. « Pourquoi faire un si long voyage pour prier, alors qu'on peut prier chez soi ? »",
    intro: "Deux départs en pèlerinage dans un quartier de Douala te servent de fil rouge : à chaque partie, un indice t'aide à trancher entre trois idées sur les pèlerinages.",
    objectifs: ["définir un pèlerinage", "présenter les principaux lieux de pèlerinage chrétiens", "présenter le pèlerinage musulman à La Mecque (hajj)", "comparer les pèlerinages chrétiens et musulmans et calculer leurs dates"],
    enquete: {
      titre: "Deux départs dans le quartier",
      svg: svg(640, 220, "Rue d'un quartier de Douala : deux familles accompagnent un voyageur en tenue blanche et une voyageuse avec une valise ; un avion dans le ciel", lin("peC", ["#DDEBF5", "#F4EDE1"], true),
        "<rect width='640' height='220' fill='url(#peC)'/><rect y='186' width='640' height='34' fill='#8A8A8A'/><path d='M440 40l40 6l18 -14h8l-6 16l24 4l6 -6h6l-4 10l4 10h-6l-6 -6l-24 4l6 16h-8l-18 -14l-40 6Z' fill='#9AA3AF'/>" +
        perso(120, 96, "#4A2E18", "#F4F1EA", "#F4F1EA") + perso(60, 104, "#5A3A1E", "#17784D", "#2E3445") + perso(380, 96, "#6B4423", "#7B3F99", "#4D5163") + "<rect x='398' y='150' width='26' height='34' rx='3' fill='#1E499B'/>" + perso(450, 104, "#5A3A1E", "#C2540A", "#2E3445") +
        bulle(170, 30, 240, "Pourquoi partir si loin pour prier ?", "#F7C948")),
      legende: "À Douala, deux familles voisines accompagnent leurs pèlerins.",
      contexte: "<p>Dans le quartier, le père de Halima s'apprête à partir pour le pèlerinage à La Mecque, et la tante de Marc pour Jérusalem et Rome. Marc demande : « Pourquoi faire un si long voyage pour prier ? » Halima pense que « les pèlerinages existent seulement dans l'islam ». Marc, lui, croit que « chrétiens et musulmans font exactement le même pèlerinage, au même endroit ». Leur professeur leur propose de comparer les deux pèlerinages pour le dossier 4.</p>",
      documents: [{ t: "Doc. 1 : le hajj", html: "<p>Le pèlerinage à La Mecque, ou hajj, est le cinquième pilier de l'islam : tout musulman qui en a les moyens et la santé doit l'accomplir une fois dans sa vie. Il a lieu pendant le dernier mois du calendrier musulman.</p>" },
        { t: "Doc. 2 : les pèlerinages chrétiens", html: "<p>Depuis l'Antiquité, des chrétiens se rendent à Jérusalem, sur les lieux de la vie de Jésus, et à Rome, près des tombeaux des apôtres Pierre et Paul. D'autres lieux attirent aussi des pèlerins, comme Saint-Jacques-de-Compostelle en Espagne ou Lourdes en France.</p>" }],
      question: "Qu'est-ce qu'un pèlerinage, et quels sont les points communs et les différences entre les pèlerinages chrétiens et musulmans ?",
      tache: "Définis le pèlerinage, présente les pèlerinages chrétiens et le hajj, puis compare-les dans un tableau.",
      hypotheses: ["Le pèlerinage n'existe que dans l'islam.", "Chrétiens et musulmans font exactement le même pèlerinage, au même endroit.", "Le pèlerinage est un voyage religieux vers un lieu saint qui existe dans les deux religions : obligatoire une fois dans la vie pour les musulmans (La Mecque), libre pour les chrétiens (Jérusalem, Rome…)."]
    },
    parties: [
      { t: "Qu'est-ce qu'un pèlerinage ?", html: def("Pèlerinage", "Voyage qu'un croyant fait vers un lieu saint de sa religion pour prier, demander pardon, remercier ou renforcer sa foi. Celui qui le fait est un pèlerin.") +
          "<ul><li>Un <strong>lieu saint</strong> est lié à la vie d'un prophète, d'un saint, ou à un événement religieux important.</li><li>Le pèlerinage comprend souvent un <strong>voyage</strong>, des <strong>prières</strong>, des <strong>gestes</strong> (marcher, faire le tour d'un lieu, toucher, déposer une offrande) et une <strong>fête</strong>.</li><li>Il existe dans de nombreuses religions, dont le christianisme et l'islam.</li></ul>" +
          formule("pèlerinage = voyage + lieu saint + prières et gestes + retour transformé") +
          ex("Le voyage d'affaires d'un commerçant vers Lagos n'est pas un pèlerinage ; le voyage du père de Halima vers La Mecque pour prier en est un, car son but est religieux.", "Voyage ou pèlerinage ?") +
          attention("Chacun est libre de sa religion : dans ce dossier, on décrit les pèlerinages tels que les croyants les vivent, sans juger leur foi."),
        planches: [P2("Les quatre éléments d'un pèlerinage", "Ce que l'on retrouve dans presque tous les pèlerinages, quelle que soit la religion.",
          colonnes("Un pèlerinage, c'est…", [{ t: "Un départ", c: "#1E499B", l: ["quitter sa maison", "se préparer"] }, { t: "Un lieu saint", c: "#7B3F99", l: ["lié à un prophète", "ou à un saint"] }, { t: "Des gestes", c: "#C2540A", l: ["prières, marche", "rites, offrandes"] }, { t: "Un retour", c: "#17784D", l: ["foi renforcée", "fête, partage"] }], 200, "Les quatre éléments d'un pèlerinage"))],
        fil: { html: "<p>Halima se trompe : le pèlerinage n'existe pas seulement dans l'islam. La tante de Marc, chrétienne, part elle aussi pour un <strong>voyage religieux</strong> vers des lieux saints. Le pèlerinage existe dans de nombreuses religions.</p>", verdicts: [[0, "rejetee", "Le pèlerinage existe aussi dans le christianisme et dans bien d'autres religions."]] },
        retenir: "Pèlerinage : voyage religieux vers un lieu saint ; pèlerin ; prières, gestes, fête." },
      { t: "Les pèlerinages chrétiens et le hajj", html: "<ul><li><strong>Chez les chrétiens</strong> : Jérusalem (lieux de la vie, de la mort et de la résurrection de Jésus), Rome (tombeaux des apôtres Pierre et Paul), Saint-Jacques-de-Compostelle, Lourdes et d'autres sanctuaires. Le pèlerinage est un acte de piété <strong>libre</strong>, non obligatoire.</li><li><strong>Chez les musulmans</strong> : le <strong>hajj</strong> à La Mecque est <strong>obligatoire</strong> une fois dans la vie pour qui en a les moyens et la santé. Les pèlerins portent une tenue blanche simple, font sept fois le tour de la Kaaba, se rendent au mont Arafat et accomplissent d'autres rites.</li><li>Le hajj se termine avec la <strong>fête du sacrifice</strong> (Aïd al-Adha, appelée Tabaski en Afrique de l'Ouest et au Cameroun), célébrée par tous les musulmans du monde.</li></ul>" +
          formule("le hajj avance d'environ 11 jours chaque année dans notre calendrier (365 − 354 = 11)") +
          ex("Si le hajj commence vers le 25 mai une année, il commencera vers le 14 mai l'année suivante : 25 − 11 = 14.", "Calculer la date du hajj") +
          savais("En 1324, le roi du Mali Mansa Moussa fit le pèlerinage à La Mecque avec une immense caravane ; aujourd'hui, les pèlerins camerounais partent en avion depuis Douala, Yaoundé ou Garoua."),
        planches: [{ type: "3d", titre: "Deux chemins vers deux lieux saints", legende: "Tourne la maquette : deux chemins jalonnés d'étapes, l'un bleu vers un sanctuaire chrétien à clocher, l'autre vert vers une mosquée à coupole et minaret. Chaque étape représente un moment du voyage : départ, prière, marche, arrivée au lieu saint.", modele: { h: 340, rx: -24, ry: 28, echelle: 0.75, alt: "Deux chemins à étapes menant l'un à une église à clocher, l'autre à une mosquée à coupole et minaret", objets: chemins3D(), etiquettes: [{ p: [-160, 150, 60], t: "sanctuaire chrétien", cote: "g" }, { p: [170, 106, 60], t: "mosquée", cote: "d" }, { p: [-170, 16, -90], t: "étapes du pèlerin", cote: "g" }, { p: [170, 16, -90], t: "étapes du pèlerin", cote: "d" }] } }],
        fil: { html: "<p>Marc se trompe : chrétiens et musulmans ne font pas le même pèlerinage au même endroit. Les chrétiens vont surtout à <strong>Jérusalem et à Rome</strong>, librement ; les musulmans accomplissent le <strong>hajj à La Mecque</strong>, obligatoire une fois dans la vie pour qui le peut.</p>", verdicts: [[1, "rejetee", "Les lieux, les règles et les rites sont différents dans les deux religions."]] },
        retenir: "Chrétiens : Jérusalem, Rome, Compostelle, Lourdes (libre) ; musulmans : hajj à La Mecque (obligatoire si on le peut), Tabaski." },
      { t: "Comparer les deux pèlerinages", html: "<ul><li><strong>Points communs</strong> : un voyage vers un lieu saint ; des prières et des gestes ; un temps de pardon et de renouvellement de la foi ; des pèlerins venus du monde entier, dont le Cameroun.</li><li><strong>Différences</strong> : les lieux (Jérusalem et Rome / La Mecque) ; le caractère obligatoire ou non ; les rites ; les dates (le hajj suit le calendrier lunaire, les pèlerinages chrétiens se font toute l'année et lors de grandes fêtes).</li><li><strong>Un héritage historique</strong> : les pèlerinages ont fait voyager les hommes, les idées et les marchandises depuis le Moyen Âge.</li></ul>" +
          formule("comparer = un tableau (lieux, obligation, rites, dates) + points communs + différences") +
          ex("Lieux : Jérusalem et Rome / La Mecque ; obligation : libre / une fois dans la vie si on le peut ; rites : messes, processions, marche / tenue blanche, tours de la Kaaba, Arafat ; dates : toute l'année / dernier mois du calendrier musulman.", "Le tableau du dossier") +
          astuce("Pour comparer, commence toujours par les points communs, puis les différences : cela évite d'opposer les croyants les uns aux autres."),
        planches: [P2("Le tableau du dossier 4", "Les pèlerinages chrétiens et le hajj comparés sur quatre points.",
          colonnes("Comparer deux pèlerinages", [{ t: "Chrétiens", c: "#1E499B", l: ["Jérusalem, Rome", "Compostelle, Lourdes", "libre", "toute l'année"] }, { t: "Musulmans", c: "#17784D", l: ["La Mecque", "hajj, 5e pilier", "obligatoire si possible", "calendrier lunaire"] }], 230, "Tableau comparant les pèlerinages chrétiens et musulmans"))],
        fil: { html: "<p>Les deux voisins ont la réponse : le pèlerinage est un <strong>voyage religieux</strong> qui existe dans les deux religions. Il a des points communs (lieu saint, prière, foi renouvelée) et des différences (lieux, obligation, rites, dates). Le père de Halima et la tante de Marc partent tous les deux pour prier, chacun selon sa foi.</p>", verdicts: [[2, "validee", "Un voyage religieux présent dans les deux religions, avec des points communs et des différences."]] },
        retenir: "Points communs : lieu saint, prière, foi renouvelée ; différences : lieux, obligation, rites, dates." },
      { t: "Entraînement au format de l'examen", html: integ("Le hajj est…", ["une fête chrétienne", "le pèlerinage musulman à La Mecque", "un marché", "une prière du soir"], "Le pèlerinage musulman à La Mecque", "Cinquième pilier de l'islam.", "Cite deux lieux de pèlerinage chrétiens et dis ce qui les rend saints.", "Jérusalem, lieux de la vie, de la mort et de la résurrection de Jésus ; Rome, tombeaux des apôtres Pierre et Paul (aussi Compostelle, Lourdes).", "Dans ta classe, un élève se moque d'un camarade dont le père revient du hajj.", "Rédige quelques lignes pour expliquer le sens du pèlerinage et inviter au respect.", "Le hajj est le pèlerinage à La Mecque, l'un des cinq piliers de l'islam : le père de ce camarade a accompli un devoir religieux important, souvent après des années d'économies. Les chrétiens font aussi des pèlerinages, à Jérusalem ou à Rome. Chacun est libre de sa religion, et le respect des croyances des autres permet de bien vivre ensemble au Cameroun."), retenir: "Savoir-être : respect des croyances et des pratiques religieuses de chacun." }
    ],
    denouement: { titre: "Le dossier des deux voisins", etapes: ["Définir le pèlerinage : un voyage religieux vers un lieu saint (indice 1).", "Présenter les pèlerinages chrétiens et le hajj (indice 2).", "Comparer : points communs et différences (indice 3)."],
      formules: [F("Définir", "pèlerinage = voyage + lieu saint + prières et gestes", "La Mecque, Jérusalem, Rome"), F("Dater le hajj", "date de l'année suivante ≈ date − 11 jours", "25 mai → 14 mai"), F("Comparer", "tableau + points communs + différences", "lieux, obligation, rites, dates")],
      reponse: "<p>Un pèlerinage est un voyage religieux vers un lieu saint pour prier, demander pardon ou renforcer sa foi. Il n'existe pas seulement dans l'islam : les chrétiens se rendent depuis l'Antiquité à Jérusalem, sur les lieux de la vie de Jésus, et à Rome, près des tombeaux des apôtres Pierre et Paul, ainsi qu'à Compostelle ou à Lourdes ; ce pèlerinage est libre. Pour les musulmans, le hajj à La Mecque est le cinquième pilier de l'islam : il est obligatoire une fois dans la vie pour qui en a les moyens et la santé, se déroule pendant le dernier mois du calendrier lunaire (et avance donc d'environ 11 jours chaque année) et se termine par la Tabaski. Les deux pèlerinages ont des points communs (lieu saint, prière, foi renouvelée) et des différences (lieux, obligation, rites, dates). Le père de Halima et la tante de Marc partent ainsi, chacun selon sa foi, pour un même type de voyage.</p>",
      transfert: "<p>Interroge une personne de ton entourage qui a fait un pèlerinage (ou qui en connaît un). Note le lieu, la durée du voyage, les gestes accomplis et ce que ce voyage a représenté pour elle.</p>" },
    revision: ["<strong>Pèlerinage</strong> : voyage religieux vers un lieu saint ; le pèlerin.", "Chrétiens : Jérusalem, Rome, Saint-Jacques-de-Compostelle, Lourdes ; pèlerinage libre.", "Musulmans : hajj à La Mecque, 5e pilier, obligatoire une fois si on le peut.", "Hajj : tenue blanche, tours de la Kaaba, mont Arafat ; fin : Tabaski (Aïd al-Adha).", "Le hajj avance d'environ 11 jours par an (calendrier lunaire).", "Points communs : lieu saint, prière, foi ; différences : lieux, obligation, rites, dates."],
    exo: "<p>Si le hajj commence vers le 26 mai une année, vers quelle date commencera-t-il l'année suivante ? <em>(26 − 11 = 15 : vers le 15 mai.)</em></p>",
    quiz: [q("Un pèlerinage est…", "un voyage religieux vers un lieu saint", "un voyage d'affaires", "une fête de mariage", "Pour prier et renforcer sa foi."), q("Le pèlerinage à La Mecque s'appelle…", "le hajj", "le sabbat", "la diaspora", "Cinquième pilier de l'islam."), q("Pour un musulman, le hajj est…", "obligatoire une fois dans la vie s'il le peut", "interdit", "obligatoire chaque année", "Si on en a les moyens et la santé."), q("Les chrétiens vont en pèlerinage notamment à…", "Jérusalem et Rome", "La Mecque", "Tombouctou", "Lieux de Jésus et des apôtres."), q("À Rome se trouvent les tombeaux des apôtres…", "Pierre et Paul", "Moïse et Abraham", "Romulus et Rémus", "Selon la tradition chrétienne."), q("La fête qui termine le hajj s'appelle au Cameroun…", "la Tabaski", "le Ngondo", "Noël", "Aïd al-Adha, fête du sacrifice."), q("Pendant le hajj, les pèlerins portent…", "une tenue blanche simple", "un uniforme militaire", "un costume coloré", "Signe d'égalité entre tous."), q("Chaque année, le hajj avance d'environ…", "11 jours", "1 mois", "1 jour", "365 − 354 = 11."), q("Un pèlerinage chrétien est en général…", "libre, non obligatoire", "obligatoire chaque mois", "interdit", "Un acte de piété personnel."), q("Pour comparer deux pèlerinages, on commence par…", "les points communs", "les moqueries", "le prix du billet", "Puis on présente les différences.")],
    apc: apc("Des voisins de religions différentes se demandent pourquoi leurs proches partent en pèlerinage.", "Définir le pèlerinage et comparer les pèlerinages chrétiens et musulmans.")
  });
  VRT_A("6e-histoire-pelerinages", 1, "Chrétien ou musulman ? Retrouve le bon pèlerinage", function (el) {
    exercice(el, [["Le hajj à La Mecque est un pèlerinage ___.", ["musulman", "chrétien", "grec"], "Cinquième pilier de l'islam."], ["Le pèlerinage à Rome, près des tombeaux de Pierre et Paul, est ___.", ["chrétien", "musulman", "égyptien"], "Les apôtres de Jésus."], ["La tenue blanche simple et les tours de la Kaaba appartiennent au ___.", ["hajj", "pèlerinage de Lourdes", "Ngondo"], "Rites du pèlerinage musulman."], ["Saint-Jacques-de-Compostelle est un lieu de pèlerinage ___.", ["chrétien", "musulman", "dogon"], "En Espagne."], ["La Tabaski termine le ___.", ["hajj", "carême", "sabbat"], "Fête du sacrifice."], ["Si le hajj commence le 20 juin, l'année suivante il commence vers le ___.", ["9 juin", "1er juillet", "20 juin"], "20 − 11 = 9."]], "Question suivante", "Question");
  });

  /* ═══════════════ RANG 11 : LA RELIGION DE L'ÉGYPTE ANCIENNE ═══════════════ */
  function temple3D() {
    var o = [{ f: "boite", c: [0, -6, 0], d: [500, 6, 300], coul: "#D8C49A", dessus: "#E8D8B0" }];
    [-1, 1].forEach(function (s) { o.push({ f: "poly", pts: [[s * 30, 0, -100], [s * 130, 0, -100], [s * 116, 130, -92], [s * 40, 130, -92]], coul: "#E0CDA4" }); o.push({ f: "poly", pts: [[s * 130, 0, -100], [s * 130, 0, -70], [s * 116, 130, -76], [s * 116, 130, -92]], coul: "#C9B890" }); o.push({ f: "boite", c: [s * 78, 132, -86], d: [80, 6, 14], coul: "#C9B890", dessus: "#D8C49A" }); });
    o.push({ f: "boite", c: [0, 40, -96], d: [50, 80, 4], coul: "#5A3A1E" });
    for (var i = 0; i < 4; i++) { [-50, 50].forEach(function (x) { o.push({ f: "cylindre", c: [x, 0, -30 + i * 40], r: 12, h: 90, n: 12, coul: "#E8DFC9" }); }); }
    o.push({ f: "boite", c: [0, 94, 30], d: [130, 8, 170], coul: "#C9B890", dessus: "#D8C49A" });
    [-160, 160].forEach(function (x) { o.push({ f: "poly", pts: [[x - 8, 0, -120], [x + 8, 0, -120], [x + 4, 150, -116], [x - 4, 150, -116]], coul: "#D4B370" }); o.push({ f: "poly", pts: [[x - 4, 150, -116], [x + 4, 150, -116], [x, 162, -116]], coul: "#F7C948" }); });
    return o;
  }
  VRT_L("6e-histoire-egypte-religion", {
    c: "6e", m: "histoire", cle: "La religion de l", titre: "La religion de l'Égypte ancienne : des dieux et la vie après la mort", duree: 30,
    accroche: "Au musée, devant une momie, un élève de Kribi frissonne : « Pourquoi les Égyptiens conservaient-ils leurs morts ? » Que croyaient-ils sur les dieux et sur la vie après la mort ?",
    intro: "Une exposition itinérante sur l'Égypte, installée à Kribi, te sert de fil rouge : à chaque partie, un indice t'aide à trancher entre trois idées sur la religion égyptienne.",
    objectifs: ["décrire le polythéisme égyptien et ses principaux dieux", "présenter le rôle des temples et des prêtres", "expliquer les croyances sur la vie après la mort : momification, jugement d'Osiris", "situer la tentative d'Akhenaton"],
    enquete: {
      titre: "L'exposition de Kribi",
      svg: svg(640, 220, "Salle d'exposition : un sarcophage peint debout, une statue à tête de chacal, une fresque avec une balance ; trois élèves regardent", lin("erC", ["#F4E2B8", "#E8DFC9"], true),
        "<rect width='640' height='220' fill='url(#erC)'/><rect y='186' width='640' height='34' fill='#8B6B4A'/><path d='M280 186V60q40 -40 80 0v126Z' fill='#C9962A' stroke='#7A4A1E' stroke-width='3'/><ellipse cx='320' cy='70' rx='22' ry='24' fill='#E8C070'/><rect x='300' y='100' width='40' height='60' fill='#1E499B' opacity='.7'/>" +
        "<rect x='420' y='40' width='160' height='90' fill='#F4EDE1' stroke='#C9A06E'/><path d='M500 56v40M470 66h60M470 66l-8 18h16ZM530 66l-8 18h16Z' stroke='#4D5163' stroke-width='2' fill='#F7C948'/>" + perso(90, 98, "#5A3A1E", "#C2540A", "#2E3445") + perso(170, 104, "#6B4423", "#17784D", "#2E3445") + perso(220, 104, "#4A2E18", "#7B3F99", "#2E3445") +
        bulle(10, 30, 260, "Pourquoi conserver les morts ?", "#F7C948")),
      legende: "À Kribi, une exposition sur l'Égypte ancienne montre un sarcophage et la scène de la pesée du cœur.",
      contexte: "<p>Pendant la visite, Ateba pense que « les Égyptiens adoraient un seul dieu, comme dans les religions d'aujourd'hui ». Nadia croit que « la momification était seulement une façon d'éviter les mauvaises odeurs ». Le guide montre une fresque où un dieu à tête de chacal pèse le cœur d'un mort face à une plume, et explique que tout cela avait un sens religieux précis.</p>",
      documents: [{ t: "Doc. 1 : la pesée du cœur (Livre des morts)", html: "<p>Le cœur du défunt est posé sur une balance face à la plume de Maât, déesse de la justice et de la vérité. S'il est léger, le mort entre dans le royaume d'Osiris ; s'il est lourd de fautes, il est dévoré par un monstre.</p>" },
        { t: "Doc. 2 : la momification", html: "<p>Les embaumeurs retirent les organes, dessèchent le corps avec du natron (un sel) pendant environ 40 jours, puis l'enveloppent de bandelettes : l'opération complète dure environ 70 jours.</p>" }],
      question: "Que croyaient les Égyptiens sur les dieux et sur la vie après la mort, et pourquoi momifiaient-ils leurs morts ?",
      tache: "Présente les dieux et les temples égyptiens, puis explique les croyances sur la mort et le sens de la momification.",
      hypotheses: ["Les Égyptiens adoraient un seul dieu.", "La momification servait seulement à éviter les mauvaises odeurs.", "Les Égyptiens étaient polythéistes ; ils croyaient à une vie après la mort, jugée par Osiris, et conservaient le corps par la momification pour que le défunt puisse y vivre."]
    },
    parties: [
      { t: "De nombreux dieux", html: def("Polythéisme égyptien", "Croyance des Égyptiens en de nombreux dieux, souvent représentés avec un corps humain et une tête d'animal, chacun protégeant un domaine de la vie.") +
          "<ul><li><strong>Rê</strong> : le dieu soleil, le plus important.</li><li><strong>Osiris</strong> : le dieu des morts et de la renaissance ; <strong>Isis</strong>, son épouse, déesse protectrice ; <strong>Horus</strong>, leur fils, à tête de faucon, protecteur du pharaon.</li><li><strong>Anubis</strong> : à tête de chacal, dieu des embaumeurs et gardien des tombes.</li><li><strong>Thot</strong> : à tête d'ibis, dieu de l'écriture et du savoir ; <strong>Maât</strong> : déesse de la justice et de l'ordre du monde.</li></ul>" +
          ex("Un scribe priait Thot, le dieu de l'écriture ; une mère priait Isis pour protéger son enfant ; tous honoraient Rê, le soleil qui fait vivre l'Égypte.", "Chacun ses dieux protecteurs") +
          astuce("Pour reconnaître un dieu, regarde sa tête : faucon = Horus, chacal = Anubis, ibis = Thot, disque solaire = Rê."),
        planches: [P2("Les grands dieux de l'Égypte", "Quelques dieux égyptiens, leur apparence et leur domaine.",
          colonnes("Qui est qui ?", [{ t: "Rê", c: "#B07A00", l: ["disque solaire", "→ le soleil"] }, { t: "Osiris", c: "#17784D", l: ["roi momifié", "→ les morts"] }, { t: "Horus", c: "#1E499B", l: ["tête de faucon", "→ le pharaon"] }, { t: "Anubis", c: "#4D5163", l: ["tête de chacal", "→ les tombes"] }, { t: "Thot", c: "#7B3F99", l: ["tête d'ibis", "→ l'écriture"] }], 190, "Cinq grands dieux égyptiens et leur domaine"))],
        fil: { html: "<p>Ateba se trompe : les Égyptiens n'adoraient pas un seul dieu, mais <strong>de nombreux dieux</strong>, chacun avec son domaine : c'est le polythéisme. Seul le pharaon Akhenaton tenta un jour d'imposer un culte presque unique, sans succès durable.</p>", verdicts: [[0, "rejetee", "Les Égyptiens étaient polythéistes : Rê, Osiris, Isis, Horus, Anubis, Thot…"]] },
        retenir: "Polythéisme : Rê (soleil), Osiris (morts), Isis, Horus (faucon), Anubis (chacal), Thot (ibis), Maât (justice)." },
      { t: "Les temples et les prêtres", html: "<ul><li><strong>Le temple</strong> est la maison du dieu : une grande porte (le <strong>pylône</strong>), des cours, une salle à colonnes, puis le sanctuaire où se trouve la statue du dieu.</li><li>Seuls les <strong>prêtres</strong> et le pharaon entrent dans le sanctuaire ; ils lavent, habillent et « nourrissent » chaque jour la statue.</li><li>Le peuple prie surtout lors des <strong>fêtes</strong>, quand la statue du dieu sort en procession.</li><li>Les temples possèdent des terres, des greniers et des ateliers : ils sont aussi très riches.</li></ul>" +
          formule("nombre de rites par an = rites par jour × 365") +
          ex("Si les prêtres accomplissent 3 rites par jour devant la statue, cela fait 3 × 365 = 1 095 rites par an pour un seul dieu.", "Calculer le travail des prêtres") +
          savais("Le temple de Karnak, à Thèbes, fut agrandi pendant près de 2 000 ans ; sa grande salle compte 134 colonnes."),
        planches: [{ type: "3d", titre: "L'entrée d'un temple égyptien", legende: "Tourne le temple : deux grands massifs inclinés forment le pylône, encadrant la porte ; devant, deux obélisques à pointe dorée ; derrière, une salle à colonnes qui mène au sanctuaire du dieu, où seuls les prêtres entrent.", modele: { h: 340, rx: -16, ry: 30, echelle: 0.7, alt: "Pylône égyptien à deux massifs inclinés, deux obélisques et une salle à colonnes", objets: temple3D(), etiquettes: [{ p: [-78, 136, -86], t: "pylône", cote: "g" }, { p: [160, 162, -116], t: "obélisque", cote: "d" }, { p: [50, 60, 50], t: "salle à colonnes", cote: "d" }, { p: [0, 50, -98], t: "porte du temple", cote: "g" }] } }],
        fil: { html: "<p>Les temples montrent que la religion organise toute la société : les prêtres servent les dieux chaque jour, le pharaon est leur représentant, et le peuple participe aux grandes fêtes. Rien n'y est laissé au hasard : chaque geste a un sens religieux.</p>", verdicts: [] },
        retenir: "Temple : pylône, cours, salle à colonnes, sanctuaire ; prêtres ; fêtes et processions ; Karnak." },
      { t: "La vie après la mort", html: "<ul><li>Les Égyptiens croient que le mort continue de vivre dans l'au-delà, à condition que son <strong>corps soit conservé</strong> et qu'il réussisse le <strong>jugement d'Osiris</strong>.</li><li><strong>La momification</strong> : les embaumeurs retirent les organes, dessèchent le corps avec du natron pendant environ 40 jours, l'enveloppent de bandelettes et d'amulettes : environ 70 jours en tout.</li><li><strong>La pesée du cœur</strong> : devant Osiris, Anubis pèse le cœur du mort face à la plume de Maât ; un cœur juste est aussi léger que la plume.</li><li><strong>Le tombeau</strong> (pyramide, tombe creusée dans la roche) contient des objets, de la nourriture et des textes (le Livre des morts) pour la vie dans l'au-delà.</li><li>Vers 1350 av. J.-C., le pharaon <strong>Akhenaton</strong> tente d'imposer le culte d'un dieu unique, Aton (le disque solaire) ; après sa mort, les anciens dieux reviennent.</li></ul>" +
          formule("durée totale = séchage + préparation des bandelettes et des rites") +
          ex("Momification : environ 40 jours de séchage dans le natron + environ 30 jours de bandelettes et de rites = 40 + 30 = 70 jours.", "Calculer la durée de la momification") +
          attention("La momification n'était pas une simple mesure d'hygiène : c'était un acte religieux, pour que l'âme du mort retrouve son corps."),
        planches: [P2("Le voyage du défunt", "Les étapes qui, selon les Égyptiens, mènent le mort à la vie éternelle.",
          colonnes("Du décès à l'au-delà", [{ t: "1. Momifier", c: "#B07A00", l: ["natron, bandelettes", "≈ 70 jours"] }, { t: "2. Enterrer", c: "#7B3F99", l: ["tombeau, objets", "Livre des morts"] }, { t: "3. Être jugé", c: "#1E499B", l: ["pesée du cœur", "plume de Maât"] }, { t: "4. Vivre", c: "#17784D", l: ["royaume", "d'Osiris"] }], 200, "Les étapes du voyage du défunt dans la religion égyptienne"))],
        fil: { html: "<p>Nadia se trompe : la momification n'avait pas pour but d'éviter les odeurs, mais de <strong>conserver le corps</strong> pour que le défunt puisse vivre dans l'au-delà, après avoir réussi la pesée du cœur devant Osiris. C'est le cœur de la religion égyptienne.</p>", verdicts: [[1, "rejetee", "La momification est un acte religieux : conserver le corps pour la vie éternelle."], [2, "validee", "Polythéisme, temples et prêtres, vie après la mort jugée par Osiris et préparée par la momification."]] },
        retenir: "Vie après la mort ; momification (≈ 70 jours) ; pesée du cœur face à la plume de Maât ; tombeaux ; Akhenaton et Aton (≈ 1350 av. J.-C.)." },
      { t: "Entraînement au format de l'examen", html: integ("Le dieu égyptien des morts est…", ["Rê", "Osiris", "Thot", "Zeus"], "Osiris", "Il juge les morts lors de la pesée du cœur.", "Explique en trois lignes ce qu'est la pesée du cœur.", "Après la mort, le cœur du défunt est posé sur une balance face à la plume de Maât, déesse de la justice. S'il est aussi léger que la plume, le mort entre dans le royaume d'Osiris ; s'il est lourd de fautes, il est dévoré.", "Un camarade dit que « les momies, c'était juste pour faire peur ».", "Rédige quelques lignes pour lui expliquer le sens de la momification.", "Les Égyptiens croyaient que le mort continuait de vivre dans l'au-delà si son corps était conservé. Les embaumeurs le desséchaient avec du natron et l'enveloppaient de bandelettes, pendant environ 70 jours. Le défunt devait ensuite réussir la pesée du cœur devant Osiris. La momie n'était donc pas faite pour effrayer : c'était un acte religieux, plein de respect pour les morts."), retenir: "Savoir-être : respect des croyances des peuples anciens et des rites funéraires." }
    ],
    denouement: { titre: "Ce que la visite a appris", etapes: ["Les Égyptiens étaient polythéistes : Rê, Osiris, Isis, Horus, Anubis, Thot (indice 1).", "Les temples et les prêtres servaient les dieux chaque jour (indice 2).", "La momification préparait la vie après la mort, jugée par Osiris (indice 3)."],
      formules: [F("Durée de la momification", "séchage + bandelettes et rites", "40 + 30 = 70 jours"), F("Travail des prêtres", "rites par an = rites par jour × 365", "3 × 365 = 1 095"), F("Situer Akhenaton", "≈ 1350 av. J.-C. → âge = 1350 + 2026 − 1", "environ 3 375 ans")],
      reponse: "<p>Les Égyptiens étaient polythéistes : ils adoraient de nombreux dieux, souvent à tête d'animal, comme Rê, le soleil, Osiris, dieu des morts, Isis, Horus à tête de faucon, Anubis à tête de chacal ou Thot à tête d'ibis. Chaque dieu avait son temple, sa maison, où les prêtres servaient chaque jour sa statue ; le peuple le priait surtout lors des fêtes. Ils croyaient aussi à une vie après la mort : le défunt devait réussir la pesée du cœur devant Osiris, son cœur étant comparé à la plume de Maât. Pour qu'il puisse vivre dans l'au-delà, son corps devait être conservé : c'est le sens religieux de la momification, qui durait environ 70 jours. Seul le pharaon Akhenaton tenta, vers 1350 av. J.-C., d'imposer le culte d'un dieu unique, Aton, sans succès durable.</p>",
      transfert: "<p>Compare la religion de l'Égypte ancienne avec les religions monothéistes étudiées cette année : un ou plusieurs dieux ? quels lieux de prière ? quelles croyances sur la mort ?</p>" },
    revision: ["<strong>Polythéisme égyptien</strong> : de nombreux dieux, souvent à tête d'animal.", "Rê (soleil), Osiris (morts), Isis, Horus (faucon), Anubis (chacal), Thot (ibis), Maât (justice).", "Temple : pylône, salle à colonnes, sanctuaire ; prêtres ; fêtes et processions.", "Vie après la mort : momification (≈ 70 jours), tombeau, Livre des morts.", "Pesée du cœur face à la plume de Maât, devant Osiris.", "Akhenaton (≈ 1350 av. J.-C.) : culte d'Aton, sans succès durable."],
    exo: "<p>Associe chaque dieu à son apparence : Horus, Anubis, Thot. <em>(Tête de faucon ; tête de chacal ; tête d'ibis.)</em></p>",
    quiz: [q("La religion égyptienne était…", "polythéiste", "monothéiste", "sans dieux", "De nombreux dieux."), q("Le dieu soleil s'appelle…", "Rê", "Osiris", "Anubis", "Le plus important des dieux."), q("Le dieu à tête de chacal est…", "Anubis", "Horus", "Thot", "Dieu des embaumeurs."), q("Le dieu qui juge les morts est…", "Osiris", "Rê", "Amma", "Lors de la pesée du cœur."), q("Lors de la pesée, le cœur est comparé à…", "la plume de Maât", "une pierre", "un pain", "La justice et la vérité."), q("La momification dure environ…", "70 jours", "7 jours", "7 ans", "40 jours de séchage, puis bandelettes."), q("Le natron est…", "un sel qui dessèche le corps", "un dieu", "un temple", "Utilisé par les embaumeurs."), q("Dans le sanctuaire du temple entrent…", "les prêtres et le pharaon", "tous les habitants", "les étrangers", "Le peuple prie lors des fêtes."), q("Akhenaton voulut imposer le culte de…", "Aton", "Zeus", "Amma", "Le disque solaire, vers 1350 av. J.-C."), q("La grande porte d'un temple égyptien s'appelle…", "le pylône", "le minaret", "le forum", "Deux massifs inclinés.")],
    apc: apc("Des élèves ne comprennent pas pourquoi les Égyptiens momifiaient leurs morts.", "Présenter les dieux, les temples et les croyances des Égyptiens sur la vie après la mort.")
  });
  VRT_A("6e-histoire-egypte-religion", 0, "Reconnais le dieu égyptien", function (el) {
    exercice(el, [["Le dieu à tête de faucon, protecteur du pharaon, est ___.", ["Horus", "Anubis", "Thot"], "Fils d'Osiris et d'Isis."], ["Le dieu à tête de chacal, gardien des tombes, est ___.", ["Anubis", "Horus", "Rê"], "Dieu des embaumeurs."], ["Le dieu à tête d'ibis, dieu de l'écriture, est ___.", ["Thot", "Osiris", "Rê"], "Protecteur des scribes."], ["Le dieu soleil est ___.", ["Rê", "Thot", "Osiris"], "Le plus important des dieux."], ["La déesse de la justice, dont la plume sert à peser les cœurs, est ___.", ["Maât", "Isis", "Aton"], "Elle représente l'ordre du monde."], ["Le dieu des morts, qui juge les défunts, est ___.", ["Osiris", "Horus", "Anubis"], "Roi du royaume des morts."]], "Dieu suivant", "Dieu");
  });

})();
