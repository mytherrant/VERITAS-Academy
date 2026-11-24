/* Leçons GRATUITES — Histoire de 6e, lot 6 (24/11/2026) : les TD 1, 2 et 4, rangs 3 (le comptage du temps dans la
   localité), 5 (les mythes de la création), 9 (les symboles du pouvoir traditionnel). Même gabarit que 36- à 40-histoire-6e. */
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






  /* ═══════════════ RANG 3 : TD 1, LE COMPTAGE DU TEMPS DANS LA LOCALITÉ ═══════════════ */
  function ombre3D() {
    var o = [{ f: "boite", c: [0, -6, 0], d: [460, 6, 280], coul: "#C9A06E", dessus: "#D8B47A" }];
    for (var k = 0; k < 8; k++) { var a = Math.PI * (0.1 + 0.8 * k / 7); o.push({ f: "boite", c: [Math.cos(a) * -160, 2, Math.sin(a) * -160 + 60], d: [10, 4, 10], coul: "#5A5A5A" }); }
    o.push({ f: "cylindre", c: [0, 0, 60], r: 4, h: 110, n: 10, coul: "#6B4423" });
    o.push({ f: "poly", pts: [[-3, 1, 60], [3, 1, 60], [120, 1, 150], [114, 1, 156]], coul: "#3B2A1E" });
    o.push({ f: "sphere", c: [-170, 140, -40], r: 22, coul: "#F7C948" });
    return o;
  }
  VRT_L("6e-histoire-td-temps-localite", {
    c: "6e", m: "histoire", cle: "TD 1 : Le comptage du temps", titre: "TD 1 : Compter le temps dans ma localité, d'hier à aujourd'hui", duree: 35,
    accroche: "« Je suis né l'année de la grande inondation, un jour de marché », dit le grand-père. Comment comptait-on le temps au village, avant le calendrier écrit ?",
    intro: "Une enquête familiale à Dschang te sert de fil rouge : à chaque partie, un indice t'aide à trancher entre trois idées sur la façon dont nos ancêtres comptaient le temps.",
    objectifs: ["recueillir un témoignage sur le comptage traditionnel du temps", "décrire les repères traditionnels : jours de marché, lunes, saisons, générations, événements", "convertir un repère traditionnel en date du calendrier", "comparer le temps traditionnel et le calendrier grégorien"],
    enquete: {
      titre: "L'âge du grand-père",
      svg: svg(640, 220, "Cour d'une concession de l'Ouest : un grand-père assis raconte, une petite-fille prend des notes ; au fond, un marché avec des étals", lin("tlC", ["#E6F0DA", "#F4EDE1"], true),
        "<rect width='640' height='220' fill='url(#tlC)'/><rect y='186' width='640' height='34' fill='#B5834E'/>" + [0, 1, 2, 3].map(function (k) { return "<rect x='" + (400 + k * 56) + "' y='120' width='46' height='40' fill='#C9A06E'/><path d='M" + (396 + k * 56) + " 122l27 -18l27 18Z' fill='#8B6B4A'/>"; }).join("") +
        perso(140, 100, "#4A2E18", "#7B3F99", "#4D5163") + "<rect x='124' y='172' width='32' height='12' rx='3' fill='#6B4423'/>" + perso(250, 96, "#5A3A1E", "#C2540A", "#2E3445") + "<rect x='262' y='120' width='24' height='20' fill='#fff' stroke='#9AA3AF'/>" +
        bulle(20, 30, 300, "L'année de la grande inondation…", "#F7C948")),
      legende: "À Dschang, Linda interroge son grand-père pour un TD sur le comptage du temps.",
      contexte: "<p>Pour le TD 1, Linda doit trouver l'année de naissance de son grand-père. Il répond : « Je suis né l'année de la grande inondation, pendant la saison des pluies, un jour du marché de Foto. Mon père appartenait à la même classe d'âge que le chef de l'époque. » Son frère Romain affirme que « sans calendrier écrit, nos ancêtres ne savaient pas compter le temps ». Linda pense qu'« on ne pourra jamais retrouver une date ».</p>",
      documents: [{ t: "Témoignage", html: "<p>« Chez nous, la semaine compte huit jours, chacun portant le nom d'un marché ou d'un interdit. On compte les mois par les lunes, l'année par les saisons, et les longues durées par les générations et les grands événements. »</p>" },
        { t: "Un repère vérifiable", html: "<p>D'après les archives de la préfecture, une crue exceptionnelle a ravagé la vallée en 1948.</p>" }],
      question: "Comment comptait-on le temps dans la localité avant le calendrier écrit, et peut-on retrouver une date à partir de ces repères ?",
      tache: "Recueille et présente les repères traditionnels du temps, puis convertis le témoignage du grand-père en date du calendrier.",
      hypotheses: ["Sans calendrier écrit, nos ancêtres ne savaient pas compter le temps.", "On ne peut jamais retrouver une date à partir d'un récit traditionnel.", "Nos ancêtres comptaient le temps avec des repères précis (marchés, lunes, saisons, générations, événements) ; en les croisant avec un document écrit, on peut retrouver une date."]
    },
    parties: [
      { t: "Les repères traditionnels du temps", html: def("Repère chronologique", "Événement ou phénomène qui revient ou qui a marqué la mémoire, et qui permet de situer les autres événements dans le temps.") +
          "<ul><li><strong>Le jour et ses moments</strong> : le chant du coq, le soleil au zénith, l'ombre qui s'allonge.</li><li><strong>La semaine</strong> : dans beaucoup de régions de l'Ouest, elle compte <strong>huit jours</strong>, rythmés par les marchés.</li><li><strong>Le mois</strong> : une lune, de la nouvelle lune à la suivante, environ 29 jours et demi.</li><li><strong>L'année</strong> : le retour des saisons (saison sèche, saison des pluies) et des travaux des champs.</li><li><strong>Les longues durées</strong> : les générations, les classes d'âge, les règnes des chefs, les grands événements.</li></ul>" +
          formule("1 lune ≈ 29,5 jours ; 12 lunes ≈ 354 jours ; 1 génération ≈ 25 à 30 ans") +
          ex("« Trois générations avant moi » : 3 × 25 = 75 à 3 × 30 = 90 ans plus tôt.", "Convertir des générations en années") +
          astuce("Pour retrouver une date, cherche toujours un événement connu par écrit (une crue, une indépendance, une épidémie) : il sert d'ancre au récit."),
        planches: [P2("Deux façons de compter le temps", "Les repères traditionnels et ceux du calendrier ne s'opposent pas : on peut passer des uns aux autres.",
          colonnes("Temps traditionnel et calendrier", [{ t: "Repères traditionnels", c: "#C2540A", l: ["semaine de 8 jours", "lunes, saisons", "générations, règnes", "grands événements"] }, { t: "Calendrier grégorien", c: "#1E499B", l: ["semaine de 7 jours", "mois, années", "siècles", "dates écrites"] }], 220, "Tableau comparant les repères traditionnels du temps et le calendrier"))],
        fil: { html: "<p>Romain se trompe : nos ancêtres comptaient le temps avec précision, par les <strong>marchés</strong>, les <strong>lunes</strong>, les <strong>saisons</strong> et les <strong>générations</strong>. Ce sont d'autres repères que le calendrier, mais ce sont de vrais repères.</p>", verdicts: [[0, "rejetee", "Marchés, lunes, saisons, générations : de vrais repères pour compter le temps."]] },
        retenir: "Repères : jour (soleil), semaine de marchés, lune (≈ 29,5 j), saisons, générations (≈ 25-30 ans), événements." },
      { t: "Mesurer le temps par le soleil et la lune", html: "<ul><li><strong>Le soleil</strong> : l'ombre d'un bâton est la plus courte à midi ; le matin et le soir, elle s'allonge. C'est le principe du cadran solaire.</li><li><strong>La lune</strong> : ses phases (nouvelle lune, premier quartier, pleine lune, dernier quartier) reviennent environ tous les 29,5 jours.</li><li><strong>Les saisons</strong> : au Cameroun, l'alternance saison sèche / saison des pluies règle les semailles et les récoltes.</li></ul>" +
          formule("nombre de lunes = nombre de jours ÷ 29,5") +
          ex("Une saison des pluies d'environ 177 jours dure 177 ÷ 29,5 = 6 lunes.", "Compter en lunes") +
          attention("L'ombre est la plus courte à midi, mais au Cameroun, proche de l'équateur, elle peut tomber au nord ou au sud selon les mois."),
        planches: [{ type: "3d", titre: "Le bâton et son ombre", legende: "Tourne la cour : un bâton planté dans le sol, des cailloux posés en arc pour marquer les heures, et l'ombre portée par le soleil. Le matin et le soir, l'ombre est longue ; à midi, elle est presque nulle : c'est ainsi qu'on lisait l'heure sans montre.", modele: { h: 340, rx: -26, ry: 28, echelle: 0.72, alt: "Bâton planté dans une cour avec son ombre et des cailloux en arc, le soleil dans le ciel", objets: ombre3D(), etiquettes: [{ p: [0, 112, 60], t: "le bâton (gnomon)", cote: "d" }, { p: [100, 4, 140], t: "l'ombre", cote: "d" }, { p: [-150, 6, 10], t: "cailloux des heures", cote: "g" }, { p: [-170, 140, -40], t: "le soleil", cote: "g" }] } }],
        fil: { html: "<p>Le grand-père donne trois repères : une <strong>saison</strong> (les pluies), un <strong>jour</strong> (le marché de Foto) et un <strong>événement</strong> (la grande inondation). Ces repères sont précis ; il reste à les relier au calendrier.</p>", verdicts: [] },
        retenir: "Ombre la plus courte à midi ; phases de la lune ≈ 29,5 jours ; saisons sèche et des pluies." },
      { t: "Du récit à la date", html: "<ul><li><strong>Relever</strong> les repères du témoignage : saison, jour de marché, événement, génération.</li><li><strong>Chercher l'ancre</strong> : un document écrit qui date l'événement (archives, journal, registre).</li><li><strong>Calculer</strong> : partir de la date de l'événement et vérifier avec les autres repères (âge, générations).</li><li><strong>Présenter</strong> le résultat sur une frise : date, source, degré de certitude.</li></ul>" +
          formule("année de naissance = année de l'événement repère ; âge = 2026 − année de naissance") +
          ex("La grande inondation date de 1948 (archives) : le grand-père est né en 1948, pendant la saison des pluies ; en 2026, il a 2026 − 1948 = 78 ans.", "Dater la naissance du grand-père") +
          savais("Les registres d'état civil (naissances, mariages) n'existent pas partout depuis longtemps : beaucoup de personnes âgées connaissent leur âge grâce aux événements de leur enfance."),
        planches: [P2("La frise de la famille de Linda", "Les repères du témoignage du grand-père, convertis en dates et placés sur une frise.",
          frise("Du récit à la date", [{ a: "1948", l: ["grande inondation", "naissance du grand-père"], c: "#1E499B" }, { a: "1960", l: ["indépendance", "(il a 12 ans)"], c: "#17784D" }, { a: "≈ 1975", l: ["naissance", "du père de Linda"], c: "#B07A00" }, { a: "2014", l: ["naissance", "de Linda"], c: "#C2540A" }, { a: "2026", l: ["le TD", "(78 ans)"], c: "#7B3F99" }], 230, "Frise de la famille de Linda"))],
        fil: { html: "<p>Linda se trompait : en croisant le récit avec un <strong>document écrit</strong> (la crue de 1948 dans les archives), elle date la naissance de son grand-père : 1948, il a 78 ans. Les repères traditionnels deviennent des dates quand on trouve une ancre.</p>", verdicts: [[1, "rejetee", "Avec une ancre écrite, un récit traditionnel donne une date."], [2, "validee", "Repères traditionnels + document écrit = une date retrouvée."]] },
        retenir: "Relever les repères ; chercher l'ancre écrite ; calculer ; placer sur une frise." },
      { t: "Entraînement au format de l'examen", html: integ("Une lune dure environ…", ["7 jours", "29,5 jours", "365 jours", "8 jours"], "29,5 jours", "De la nouvelle lune à la suivante.", "Une grand-mère dit être née « l'année de l'indépendance du Cameroun ». Quelle est son année de naissance et quel âge a-t-elle en 2026 ?", "L'indépendance date de 1960 : elle est née en 1960 et a 2026 − 1960 = 66 ans.", "Ton TD : interroger un ancien de ta famille sur sa naissance.", "Rédige la méthode que tu suivras et la frise que tu obtiendras.", "Je note tous les repères qu'il donne (saison, jour de marché, événement, chef de l'époque). Je cherche un document écrit qui date l'événement (archives, livre, journal). Je calcule son année de naissance et son âge, puis je place sur une frise sa naissance, l'événement repère et d'autres dates de sa vie, en indiquant mes sources."), retenir: "Savoir-être : respect de la mémoire des anciens et rigueur dans la vérification." }
    ],
    denouement: { titre: "La date retrouvée", etapes: ["Relever les repères : saison des pluies, marché de Foto, grande inondation (indice 1).", "Comprendre les mesures traditionnelles : soleil, lune, saisons (indice 2).", "Ancrer le récit dans une date écrite : 1948 ; 78 ans en 2026 (indice 3)."],
      formules: [F("Convertir des générations", "années ≈ générations × 25 à 30", "3 générations ≈ 75 à 90 ans"), F("Compter en lunes", "lunes = jours ÷ 29,5", "177 ÷ 29,5 = 6 lunes"), F("Calculer un âge", "âge = 2026 − année de naissance", "2026 − 1948 = 78 ans")],
      reponse: "<p>Nos ancêtres comptaient le temps sans calendrier écrit, avec des repères précis : le soleil et l'ombre pour les heures, les jours de marché pour la semaine (huit jours dans de nombreuses régions de l'Ouest), les lunes pour les mois (environ 29,5 jours), les saisons pour l'année, et les générations, les règnes et les grands événements pour les longues durées. Le grand-père de Linda est né « l'année de la grande inondation », pendant la saison des pluies, un jour du marché de Foto. Les archives datent cette crue de 1948 : il est donc né en 1948 et a 78 ans en 2026. En croisant le témoignage et un document écrit, on peut ainsi retrouver une date.</p>",
      transfert: "<p>Demande à un parent comment on appelle les jours de marché dans ta localité. Fais un tableau qui associe chaque jour de marché à un jour de notre semaine pendant deux semaines.</p>" },
    revision: ["<strong>Repère chronologique</strong> : événement ou phénomène qui permet de situer dans le temps.", "Soleil et ombre : l'ombre est la plus courte à midi.", "Lune ≈ 29,5 jours ; 12 lunes ≈ 354 jours.", "Semaine de marchés (huit jours dans de nombreuses régions de l'Ouest) ; saisons sèche et des pluies.", "Génération ≈ 25 à 30 ans ; classes d'âge, règnes, grands événements.", "Méthode : relever les repères, chercher l'ancre écrite, calculer, placer sur une frise."],
    exo: "<p>« Mon arrière-grand-père a vécu quatre générations avant moi. » Si tu es né en 2014, vers quelle époque est-il né ? <em>(4 × 25 à 4 × 30 = 100 à 120 ans plus tôt : entre 1894 et 1914 environ.)</em></p>",
    quiz: [q("Une lune dure environ…", "29,5 jours", "7 jours", "365 jours", "De la nouvelle lune à la suivante."), q("Dans beaucoup de régions de l'Ouest, la semaine traditionnelle compte…", "huit jours", "cinq jours", "douze jours", "Rythmée par les marchés."), q("L'ombre d'un bâton est la plus courte…", "à midi", "le matin", "la nuit", "Le soleil est au plus haut."), q("Une génération représente environ…", "25 à 30 ans", "5 ans", "100 ans", "L'écart entre parents et enfants."), q("Pour dater un récit traditionnel, il faut…", "une ancre écrite", "deviner", "un dessin", "Un document qui date l'événement."), q("12 lunes font environ…", "354 jours", "365 jours", "300 jours", "12 × 29,5."), q("Un repère chronologique est…", "un événement qui sert à situer les autres", "une montre", "un livre", "Il marque la mémoire."), q("Né en 1948, quel âge a-t-on en 2026 ?", "78 ans", "68 ans", "88 ans", "2026 − 1948."), q("Les saisons au Cameroun sont surtout…", "la saison sèche et la saison des pluies", "l'été et l'hiver", "le printemps et l'automne", "Elles règlent les travaux des champs."), q("Trois générations avant moi, c'est environ…", "75 à 90 ans", "3 ans", "300 ans", "3 × 25 à 3 × 30.")],
    apc: apc("Un enfant ne connaît pas l'année de naissance de son grand-père, qui donne seulement des repères traditionnels.", "Convertir des repères traditionnels du temps en dates du calendrier.")
  });
  VRT_A("6e-histoire-td-temps-localite", 2, "Transforme les repères en dates", function (el) {
    exercice(el, [["« L'année de l'indépendance du Cameroun » correspond à ___.", ["1960", "1884", "1948"], "Indépendance du Cameroun oriental, le 1er janvier 1960."], ["« Trois lunes plus tard » représente environ ___.", ["88 jours", "21 jours", "365 jours"], "3 × 29,5 ≈ 88."], ["« Deux générations avant moi » (né en 2014), c'est vers ___.", ["1954-1964", "2000", "1800"], "2 × 25 à 2 × 30 = 50 à 60 ans."], ["Né en 1955, j'ai en 2026 ___.", ["71 ans", "61 ans", "81 ans"], "2026 − 1955."], ["Pour vérifier un récit, je cherche une ___.", ["ancre écrite", "chanson", "rumeur"], "Archives, journal, registre."], ["L'ombre la plus courte de la journée indique ___.", ["midi", "minuit", "le matin"], "Le soleil est au plus haut."]], "Repère suivant", "Repère");
  });

  /* ═══════════════ RANG 5 : TD 2, LES MYTHES DE LA CRÉATION ═══════════════ */
  function colline3D() {
    var o = [{ f: "boite", c: [0, -6, 0], d: [480, 6, 280], coul: "#2E6FA8", dessus: "#4A8AC8" }];
    var n = 12, cx = 0, cz = 20, r = 110, h = 90;
    for (var k = 0; k < n; k++) { var a = 2 * Math.PI * k / n, b = 2 * Math.PI * (k + 1) / n; o.push({ f: "poly", pts: [[cx + Math.cos(a) * r, 0, cz + Math.sin(a) * r], [cx, h, cz], [cx + Math.cos(b) * r, 0, cz + Math.sin(b) * r]], coul: k % 2 ? "#6B8F3A" : "#7FA44A" }); }
    o.push({ f: "sphere", c: [-150, 130, -20], r: 22, coul: "#F7C948" });
    o.push({ f: "boite", c: [-170, 2, -100], d: [60, 4, 30], coul: "#6FA8DC", dessus: "#9FC3E8" });
    o.push({ f: "boite", c: [160, 2, 110], d: [80, 4, 24], coul: "#6FA8DC", dessus: "#9FC3E8" });
    return o;
  }
  VRT_L("6e-histoire-td-mythes-creation", {
    c: "6e", m: "histoire", cle: "TD2 : Les mythes de la création", titre: "TD 2 : Les mythes de la création, récits des origines", duree: 35,
    accroche: "Pendant une veillée à Bertoua, une grand-mère raconte comment le monde est né. Le petit-fils demande : « C'est vrai, ou c'est une histoire ? » Qu'est-ce qu'un mythe, et à quoi sert-il ?",
    intro: "Une veillée de contes dans un village de l'Est te sert de fil rouge : à chaque partie, un indice t'aide à trancher entre trois idées sur les mythes de la création.",
    objectifs: ["définir un mythe et le distinguer d'un conte et d'une explication scientifique", "comparer plusieurs mythes de la création (Égypte, Bible, Dogon)", "relever les points communs des mythes de la création", "expliquer ce qu'un mythe nous apprend sur une société"],
    enquete: {
      titre: "La veillée de Bertoua",
      svg: svg(640, 220, "Veillée nocturne : un feu au centre, une grand-mère raconte, des enfants assis autour ; un ciel étoilé avec la lune", lin("myC", ["#1B2347", "#3B2A4A"], true),
        "<rect width='640' height='220' fill='url(#myC)'/>" + [40, 120, 210, 300, 380, 470, 560, 600].map(function (x, k) { return "<circle cx='" + x + "' cy='" + (20 + (k * 17) % 50) + "' r='2' fill='#FBF8F2'/>"; }).join("") + "<circle cx='540' cy='40' r='18' fill='#F4F1EA'/><rect y='186' width='640' height='34' fill='#3E2A1E'/>" +
        "<ellipse cx='320' cy='180' rx='40' ry='10' fill='#5A3A1E'/><path d='M300 180q20 -60 40 0' fill='#F7A94A'/><path d='M310 180q10 -36 20 0' fill='#F7C948'/>" +
        perso(200, 100, "#4A2E18", "#7B3F99", "#4D5163") + perso(440, 108, "#5A3A1E", "#C2540A", "#2E3445") + perso(500, 108, "#6B4423", "#17784D", "#2E3445") +
        bulle(30, 40, 240, "Au commencement, il n'y avait que l'eau…", "#F7C948")),
      legende: "Au village, près de Bertoua, une grand-mère raconte un récit des origines pendant la veillée.",
      contexte: "<p>Pendant la veillée, la grand-mère d'Arouna raconte : « Au commencement, il n'y avait que l'eau et la nuit. Puis le Créateur fit sortir la terre et alluma le soleil. » Arouna demande si c'est « une vraie explication scientifique ». Sa sœur Yvette affirme que « ce n'est qu'une histoire pour endormir les enfants, sans aucune valeur ». Pour le TD 2, leur professeur leur donne trois récits de la création venus de peuples différents à comparer.</p>",
      documents: [{ t: "Doc. 1 : un mythe de l'Égypte ancienne (résumé)", html: "<p>Au commencement existait Noun, un océan sans limites, immobile et obscur. De ces eaux surgit une colline, et sur elle le dieu Atoum, qui créa les autres dieux, le ciel, la terre et les hommes.</p>" },
        { t: "Doc. 2 : la Bible, livre de la Genèse (résumé)", html: "<p>Au commencement, Dieu créa le ciel et la terre. La terre était informe et vide, les ténèbres couvraient les eaux. En six jours, Dieu sépara la lumière des ténèbres, les eaux de la terre, créa les plantes, les astres, les animaux et l'homme ; le septième jour, il se reposa.</p>" },
        { t: "Doc. 3 : un mythe des Dogon du Mali (résumé)", html: "<p>Le dieu Amma façonna la terre avec de l'argile et la lança dans l'espace ; il créa ensuite les premiers êtres, les ancêtres des hommes, qui enseignèrent aux hommes la parole, l'agriculture et les techniques.</p>" }],
      question: "Qu'est-ce qu'un mythe de la création, et que nous apprennent ces récits sur les peuples qui les racontent ?",
      tache: "Définis le mythe, compare les trois récits dans un tableau, puis explique ce qu'ils ont en commun et à quoi ils servent.",
      hypotheses: ["Un mythe de la création est une explication scientifique de l'origine du monde.", "Un mythe n'est qu'une histoire pour enfants, sans aucune valeur.", "Un mythe est un récit sacré des origines : il ne remplace pas la science, mais il exprime les croyances, les valeurs et l'identité d'un peuple."]
    },
    parties: [
      { t: "Qu'est-ce qu'un mythe ?", html: def("Mythe", "Récit traditionnel, souvent sacré, qui raconte les origines du monde, des hommes ou d'un peuple, en faisant intervenir des dieux, des ancêtres ou des forces surnaturelles.") +
          "<ul><li><strong>Le mythe</strong> se transmet d'abord oralement, de génération en génération ; il est souvent lié à la religion.</li><li><strong>Le conte</strong> est un récit pour divertir et instruire (la Tortue rusée, le Lièvre…) ; il n'est pas sacré.</li><li><strong>La science</strong> explique l'origine de l'Univers par l'observation, la mesure et la preuve : l'Univers a environ 13,8 milliards d'années, la Terre environ 4,5 milliards d'années.</li></ul>" +
          formule("mythe = récit sacré des origines ≠ conte (divertir) ≠ explication scientifique (prouver)") +
          ex("La Tortue qui trompe le Léopard est un conte : il amuse et donne une leçon. Le récit de la grand-mère sur la naissance du monde est un mythe : il dit d'où vient le monde selon les croyances du peuple.", "Conte ou mythe ?") +
          attention("Dans un TD d'histoire, on étudie les mythes comme des documents sur les croyances des peuples, avec respect : on ne se moque d'aucun récit, et on ne les présente pas comme des preuves scientifiques."),
        planches: [P2("Mythe, conte ou science ?", "Trois façons de raconter ou d'expliquer, qui n'ont pas le même but.",
          colonnes("Trois sortes de récits", [{ t: "Mythe", c: "#7B3F99", l: ["récit sacré", "les origines", "dieux, ancêtres", "→ croire, donner du sens"] }, { t: "Conte", c: "#C2540A", l: ["récit pour enfants", "animaux, ruses", "morale", "→ divertir, instruire"] }, { t: "Science", c: "#1E499B", l: ["observation", "mesures, preuves", "théories vérifiées", "→ expliquer, prouver"] }], 230, "Tableau comparant le mythe, le conte et l'explication scientifique"))],
        fil: { html: "<p>Arouna se trompe : un mythe de la création n'est pas une explication scientifique. La science mesure et prouve ; le mythe raconte, avec des dieux et des ancêtres, <strong>ce qu'un peuple croit</strong> sur ses origines.</p>", verdicts: [[0, "rejetee", "Un mythe n'est pas une explication scientifique : c'est un récit sacré des origines."]] },
        retenir: "Mythe : récit sacré des origines ; conte : divertir ; science : observer, mesurer, prouver." },
      { t: "Comparer trois mythes de la création", html: "<ul><li><strong>Au départ</strong> : dans les trois récits, il y a d'abord le vide, la nuit ou l'eau (Noun en Égypte, les eaux sombres de la Genèse).</li><li><strong>Un créateur</strong> : Atoum, Dieu, Amma.</li><li><strong>Un ordre</strong> : la création se fait par étapes (la colline, puis les dieux ; six jours ; l'argile, puis les ancêtres).</li><li><strong>L'homme</strong> : il apparaît dans la création et reçoit une place, des règles ou des savoirs.</li></ul>" +
          formule("comparer = mêmes questions posées à chaque document (au départ ? qui crée ? comment ? quelle place pour l'homme ?)") +
          ex("Au départ : Noun, l'océan obscur (doc. 1) ; la terre informe et les eaux (doc. 2) ; l'espace où Amma lance la terre (doc. 3). Les trois récits partent d'un monde sans forme.", "Une ligne du tableau comparatif") +
          astuce("Pour comparer des documents, fais un tableau : une colonne par document, une ligne par question. Les points communs sautent aux yeux."),
        planches: [{ type: "3d", titre: "La colline qui sort des eaux", legende: "Tourne la scène : une colline verte émerge d'un océan sans limites, et au-dessus brille le soleil. C'est l'image du mythe égyptien : de Noun, l'océan des origines, surgit la première terre, sur laquelle apparaît le créateur. On retrouve cette image de la terre qui sort de l'eau dans de nombreux récits.", modele: { h: 340, rx: -18, ry: 30, echelle: 0.72, alt: "Colline verte sortant d'une étendue d'eau bleue, avec un soleil au-dessus", objets: colline3D(), etiquettes: [{ p: [0, 90, 20], t: "la première terre", cote: "d" }, { p: [-170, 4, -100], t: "l'océan des origines (Noun)", cote: "g" }, { p: [-150, 130, -20], t: "le soleil", cote: "g" }] } }],
        fil: { html: "<p>Le tableau montre des <strong>points communs</strong> frappants : un monde d'abord vide ou couvert d'eau, un créateur, une création par étapes, une place donnée à l'homme. Des peuples très éloignés se sont posé les mêmes grandes questions.</p>", verdicts: [] },
        retenir: "Points communs : vide ou eau au départ ; un créateur ; création par étapes ; place de l'homme." },
      { t: "Ce que les mythes nous apprennent", html: "<ul><li><strong>Les croyances</strong> : les dieux, les ancêtres, ce qui est sacré pour un peuple.</li><li><strong>Les valeurs et les règles</strong> : le respect des anciens, le repos, le travail de la terre, les interdits.</li><li><strong>L'identité</strong> : les mythes disent d'où vient un peuple et le rassemblent.</li><li><strong>Le milieu de vie</strong> : un peuple du fleuve parle d'eau, un peuple d'agriculteurs parle de terre et de semences.</li></ul>" +
          formule("ce que m'apprend un mythe = croyances + valeurs + identité + milieu de vie du peuple") +
          ex("Chez les Dogon, les ancêtres enseignent l'agriculture et les techniques : le mythe montre l'importance du travail de la terre et des savoir-faire transmis.", "Lire un mythe comme un document d'histoire") +
          savais("La pierre de Palerme et d'autres textes égyptiens, gravés il y a plus de 4 000 ans, montrent que les mythes de la création étaient déjà écrits dans l'Antiquité."),
        planches: [P2("Ce qu'un mythe dit d'un peuple", "Quatre informations qu'un historien peut tirer d'un mythe de la création.",
          colonnes("Lire un mythe en historien", [{ t: "Croyances", c: "#7B3F99", l: ["dieux, ancêtres", "le sacré"] }, { t: "Valeurs", c: "#17784D", l: ["règles, interdits", "respect, travail"] }, { t: "Identité", c: "#C2540A", l: ["origine commune", "ce qui rassemble"] }, { t: "Milieu", c: "#1E499B", l: ["eau, terre", "fleuve, désert"] }], 200, "Quatre informations qu'un mythe donne sur un peuple"))],
        fil: { html: "<p>Yvette se trompe aussi : un mythe n'est pas sans valeur. Il ne prouve rien sur l'âge de l'Univers, mais il nous apprend les <strong>croyances, les valeurs et l'identité</strong> d'un peuple. Pour l'historien, c'est un document précieux.</p>", verdicts: [[1, "rejetee", "Un mythe est un document précieux sur les croyances et les valeurs d'un peuple."], [2, "validee", "Récit sacré des origines, différent de la science, qui exprime croyances, valeurs et identité."]] },
        retenir: "Un mythe renseigne sur les croyances, les valeurs, l'identité et le milieu d'un peuple." },
      { t: "Entraînement au format de l'examen", html: integ("Un mythe de la création est…", ["une explication scientifique", "un récit sacré des origines", "un conte pour rire", "un article de journal"], "Un récit sacré des origines", "Il fait intervenir des dieux ou des ancêtres.", "Relève deux points communs entre les trois mythes du TD.", "Le monde est d'abord vide ou couvert d'eau ; un créateur (Atoum, Dieu, Amma) crée le monde par étapes ; l'homme y reçoit une place.", "Un camarade se moque du mythe raconté par sa grand-mère en disant que « c'est faux, la science a tout expliqué ».", "Rédige quelques lignes pour lui expliquer la différence entre un mythe et la science, et la valeur d'un mythe.", "La science explique l'origine de l'Univers par des observations et des preuves ; un mythe ne cherche pas à prouver, il raconte les origines selon les croyances d'un peuple. Il n'est donc ni « vrai » ni « faux » au sens scientifique : il exprime les valeurs, l'identité et la mémoire d'un peuple. C'est pourquoi on l'écoute et on l'étudie avec respect."), retenir: "Savoir-être : respect des croyances et des traditions orales de chaque peuple." }
    ],
    denouement: { titre: "Le tableau du TD 2", etapes: ["Définir le mythe et le distinguer du conte et de la science (indice 1).", "Comparer les trois récits dans un tableau et relever les points communs (indice 2).", "Dire ce que les mythes apprennent : croyances, valeurs, identité, milieu (indice 3)."],
      formules: [F("Définir", "mythe = récit sacré des origines ≠ conte ≠ science", "la veillée / la Tortue / l'âge de l'Univers"), F("Comparer", "mêmes questions à chaque document", "au départ ? qui crée ? comment ? place de l'homme ?"), F("Interpréter", "mythe → croyances + valeurs + identité + milieu", "Dogon : les ancêtres enseignent l'agriculture")],
      reponse: "<p>Un mythe de la création est un récit traditionnel, souvent sacré, qui raconte les origines du monde et des hommes avec des dieux ou des ancêtres. Ce n'est ni un simple conte, fait pour divertir, ni une explication scientifique, qui mesure et prouve. Les trois récits du TD (Égypte, Bible, Dogon) ont des points communs : au départ, un monde vide ou couvert d'eau ; un créateur, Atoum, Dieu ou Amma ; une création par étapes ; une place donnée à l'homme. Pour l'historien, ces mythes sont des documents précieux : ils montrent les croyances, les valeurs, l'identité et le milieu de vie des peuples qui les racontent. Le récit de la grand-mère d'Arouna n'est donc ni une preuve scientifique ni une histoire sans valeur.</p>",
      transfert: "<p>Recueille auprès d'un ancien un récit des origines de ton peuple ou de ton village. Présente-le comme un document (qui le raconte, où, quand) et relève ce qu'il t'apprend sur les croyances et les valeurs de ton peuple.</p>" },
    revision: ["<strong>Mythe</strong> : récit sacré des origines, avec des dieux ou des ancêtres.", "Conte : divertir et instruire ; science : observer, mesurer, prouver.", "Égypte : Noun, la colline, Atoum ; Bible : création en six jours ; Dogon : Amma et l'argile.", "Points communs : vide ou eau au départ, un créateur, des étapes, la place de l'homme.", "Un mythe renseigne sur les croyances, les valeurs, l'identité et le milieu d'un peuple.", "Science : Univers ≈ 13,8 milliards d'années ; Terre ≈ 4,5 milliards d'années."],
    exo: "<p>Classe : « le Lièvre et la Tortue », « Amma façonne la terre avec de l'argile », « la Terre a environ 4,5 milliards d'années ». <em>(Conte ; mythe ; explication scientifique.)</em></p>",
    quiz: [q("Un mythe est…", "un récit sacré des origines", "une preuve scientifique", "un article de loi", "Avec des dieux ou des ancêtres."), q("Un conte sert surtout à…", "divertir et instruire", "prouver", "prier", "La Tortue, le Lièvre…"), q("Dans le mythe égyptien, l'océan des origines s'appelle…", "Noun", "Amma", "Atoum", "D'où surgit la colline."), q("Dans la Genèse, la création dure…", "six jours, puis un jour de repos", "un an", "un siècle", "Le septième jour, Dieu se repose."), q("Chez les Dogon, le créateur s'appelle…", "Amma", "Noun", "Zeus", "Il façonne la terre avec de l'argile."), q("Un point commun des mythes de la création est…", "un monde d'abord vide ou couvert d'eau", "la présence d'ordinateurs", "une date précise", "Avant la création, le vide ou l'eau."), q("Selon la science, la Terre a environ…", "4,5 milliards d'années", "6 000 ans", "2026 ans", "Mesuré par la radioactivité des roches."), q("Pour comparer des documents, on fait…", "un tableau", "un dessin libre", "un résumé d'un seul document", "Une colonne par document."), q("Un mythe apprend à l'historien…", "les croyances et les valeurs d'un peuple", "l'âge exact de l'Univers", "le prix des marchandises", "C'est un document précieux."), q("Face au récit d'une grand-mère, il faut…", "l'écouter et l'étudier avec respect", "s'en moquer", "le corriger", "Chaque peuple a ses récits.")],
    apc: apc("Un enfant se demande si le récit des origines raconté pendant une veillée est « vrai » ou « une simple histoire ».", "Définir le mythe, comparer des récits de la création et dire ce qu'ils apprennent.")
  });
  VRT_A("6e-histoire-td-mythes-creation", 1, "Mythe, conte ou science ? Classe chaque phrase", function (el) {
    exercice(el, [["« Atoum surgit sur la colline sortie de l'océan Noun. » C'est un ___.", ["mythe", "conte", "fait scientifique"], "Récit sacré des origines, Égypte."], ["« La Tortue trompa le Léopard et gagna la course. » C'est un ___.", ["conte", "mythe", "fait scientifique"], "Récit pour divertir et instruire."], ["« La Terre s'est formée il y a environ 4,5 milliards d'années. » C'est un ___.", ["fait scientifique", "mythe", "conte"], "Mesuré par les scientifiques."], ["« Amma façonna la terre avec de l'argile. » C'est un ___.", ["mythe", "conte", "fait scientifique"], "Mythe des Dogon du Mali."], ["« Le Lièvre partagea la viande avec ruse. » C'est un ___.", ["conte", "mythe", "fait scientifique"], "Les animaux rusés des contes."], ["« En six jours, Dieu créa le ciel et la terre. » C'est un récit ___.", ["religieux des origines", "scientifique", "de conte"], "Bible, livre de la Genèse."]], "Phrase suivante", "Phrase");
  });

  /* ═══════════════ RANG 9 : TD 4, LES SYMBOLES DU POUVOIR TRADITIONNEL ═══════════════ */
  function trone3D() {
    var o = [{ f: "boite", c: [0, -6, 0], d: [460, 6, 260], coul: "#8B6B4A", dessus: "#A68A5E" }];
    o.push({ f: "boite", c: [0, 4, 0], d: [300, 8, 160], coul: "#5A3A1E", dessus: "#C62828" });
    o.push({ f: "cylindre", c: [-40, 8, 0], r: 34, h: 50, n: 16, coul: "#1E499B" });
    o.push({ f: "cylindre", c: [-40, 58, 0], r: 38, h: 8, n: 16, coul: "#F7C948" });
    o.push({ f: "boite", c: [-40, 100, 34], d: [70, 80, 8], coul: "#C2540A", dessus: "#F7C948" });
    [-1, 1].forEach(function (s) { o.push({ f: "boite", c: [-40 + s * 40, 76, 10], d: [8, 26, 40], coul: "#17784D", dessus: "#F7C948" }); });
    o.push({ f: "cylindre", c: [90, 8, 30], r: 24, h: 70, n: 14, coul: "#8B4A2A" });
    o.push({ f: "cylindre", c: [90, 78, 30], r: 25, h: 4, n: 14, coul: "#E8DFC9" });
    o.push({ f: "boite", c: [80, 12, -50], d: [70, 6, 40], coul: "#C9A06E", dessus: "#E0B848" });
    [-12, 0, 12].forEach(function (dx) { o.push({ f: "sphere", c: [80 + dx * 2, 18, -50 + dx], r: 5, coul: "#3B2A1E" }); });
    o.push({ f: "boite", c: [-140, 30, -40], d: [6, 60, 6], coul: "#6B4423" });
    o.push({ f: "poly", pts: [[-140, 60, -40], [-150, 92, -40], [-140, 100, -40], [-130, 92, -40]], coul: "#F4F1EA" });
    return o;
  }
  VRT_L("6e-histoire-td-symboles-pouvoir", {
    c: "6e", m: "histoire", cle: "TD 4 : Les symboles du pouvoir traditionnel", titre: "TD 4 : Les symboles du pouvoir traditionnel dans ma région", duree: 35,
    accroche: "Au palais de Foumban, une élève s'arrête devant un trône couvert de perles : « Pourquoi un chef a-t-il besoin d'un trône, d'un chasse-mouches ou d'une peau de léopard ? » Que disent ces objets du pouvoir ?",
    intro: "Une visite au musée du palais des rois Bamoun, à Foumban, te sert de fil rouge : à chaque partie, un indice t'aide à trancher entre trois idées sur les symboles du pouvoir traditionnel.",
    objectifs: ["définir un symbole du pouvoir", "identifier les principaux symboles du pouvoir traditionnel au Cameroun", "expliquer ce que chaque symbole signifie", "comparer avec les symboles du pharaon égyptien"],
    enquete: {
      titre: "Au musée du palais de Foumban",
      svg: svg(640, 220, "Salle de musée : un trône couvert de perles colorées sur une estrade, un grand tambour, une peau de léopard ; trois élèves et un guide", lin("spC", ["#F4EDE1", "#E8DFC9"], true),
        "<rect width='640' height='220' fill='url(#spC)'/><rect y='186' width='640' height='34' fill='#8B6B4A'/><rect x='240' y='160' width='160' height='26' fill='#5A3A1E'/>" +
        "<rect x='290' y='120' width='60' height='40' rx='6' fill='#1E499B'/><rect x='296' y='70' width='48' height='52' fill='#C2540A'/>" + [0, 1, 2, 3].map(function (k) { return "<circle cx='" + (304 + k * 11) + "' cy='" + (84 + (k % 2) * 14) + "' r='3' fill='#F7C948'/>"; }).join("") +
        "<rect x='420' y='120' width='34' height='60' rx='6' fill='#8B4A2A'/><ellipse cx='437' cy='120' rx='17' ry='5' fill='#E8DFC9'/><path d='M170 176q30 -22 60 0q-30 10 -60 0Z' fill='#E0B848'/>" +
        perso(80, 98, "#5A3A1E", "#7B3F99", "#2E3445") + perso(520, 98, "#6B4423", "#1E499B", "#2E3445") + perso(590, 104, "#4A2E18", "#C2540A", "#2E3445") +
        bulle(30, 30, 240, "Pourquoi tous ces objets ?", "#F7C948")),
      legende: "À Foumban, des élèves visitent le musée du palais des rois Bamoun.",
      contexte: "<p>Pour le TD 4, la classe visite le musée du palais de Foumban. Devant un trône recouvert de perles, Mfoula pense que « ce sont de simples meubles décorés, sans signification ». Kévine croit que « chaque région a ses symboles, qui n'ont rien de commun avec les autres ». Le guide demande aux élèves d'observer les objets et de chercher ce que chacun dit du pouvoir du roi.</p>",
      documents: [{ t: "Doc. 1 : le trône perlé", html: "<p>Trône recouvert de perles de verre et de cauris, orné de figures humaines et animales. Seul le roi peut s'y asseoir ; il le montre lors des grandes cérémonies.</p>" },
        { t: "Doc. 2 : témoignage d'un notable", html: "<p>« La peau de léopard est réservée au chef, car le léopard est le roi de la forêt. Le chasse-mouches en queue de cheval, le grand tambour et le bonnet brodé disent à tous qui commande. »</p>" }],
      question: "Que signifient les objets du pouvoir traditionnel, et ont-ils des points communs d'une région à l'autre ?",
      tache: "Définis un symbole du pouvoir, identifie et explique les symboles de ta région, puis compare-les à ceux du pharaon.",
      hypotheses: ["Les objets du chef sont de simples meubles décorés, sans signification.", "Chaque région a ses symboles, qui n'ont rien de commun avec ceux des autres.", "Les objets du chef sont des symboles : ils montrent son autorité, sa richesse, son lien avec les ancêtres ; ils varient selon les régions mais expriment partout les mêmes idées."]
    },
    parties: [
      { t: "Qu'est-ce qu'un symbole du pouvoir ?", html: def("Symbole du pouvoir", "Objet, animal, couleur ou geste qui représente l'autorité d'un chef et que tout le monde reconnaît : il n'a pas seulement un usage, il a un sens.") +
          "<ul><li><strong>Le siège ou le trône</strong> : seul le chef s'y assoit ; il marque sa place au-dessus des autres.</li><li><strong>Le chasse-mouches</strong> : il montre l'autorité et le pouvoir de commander.</li><li><strong>La coiffure ou le bonnet</strong> : un bonnet brodé, un chapeau à plumes, un turban.</li><li><strong>Les animaux</strong> : le léopard, le lion, l'éléphant, symboles de force.</li></ul>" +
          formule("symbole = objet visible + sens reconnu par tous (autorité, force, richesse, ancêtres)") +
          ex("Un tabouret ordinaire sert à s'asseoir ; le trône perlé du roi sert aussi à dire « je suis le roi » : c'est un symbole.", "Objet ou symbole ?") +
          astuce("Devant un objet de chef, pose deux questions : « À quoi sert-il ? » et « Que dit-il du chef ? ». La seconde réponse est son sens symbolique."),
        planches: [P2("Objet ordinaire ou symbole ?", "Le même type d'objet peut être ordinaire ou devenir un symbole du pouvoir, selon qui l'utilise et comment.",
          colonnes("Usage et sens", [{ t: "Objet ordinaire", c: "#4D5163", l: ["tabouret simple", "pour s'asseoir", "chacun peut l'utiliser"] }, { t: "Symbole du pouvoir", c: "#C2540A", l: ["trône perlé", "réservé au roi", "→ dit son autorité"] }], 220, "Tableau comparant un objet ordinaire et un symbole du pouvoir"))],
        fil: { html: "<p>Mfoula se trompe : le trône perlé n'est pas un simple meuble. Il est <strong>réservé au roi</strong> et montré lors des cérémonies : c'est un symbole qui dit à tous qui commande.</p>", verdicts: [[0, "rejetee", "Ces objets sont des symboles : ils disent l'autorité du chef."]] },
        retenir: "Symbole du pouvoir : objet visible + sens reconnu par tous ; trône, chasse-mouches, bonnet, animaux." },
      { t: "Les symboles du pouvoir au Cameroun", html: "<ul><li><strong>Dans les Grassfields (Ouest, Nord-Ouest)</strong> : trônes et tabourets perlés, peau de léopard, bonnet brodé, chasse-mouches, cloches et tambours, statues des ancêtres, grande case du fon ou du roi.</li><li><strong>Chez les Bamoun</strong> : le trône perlé, le palais de Foumban, le sultan et ses dignitaires.</li><li><strong>Au Nord</strong> : le lamido, le parasol, les cavaliers, les longues trompettes, le grand boubou et le turban.</li><li><strong>Dans le Sud et l'Est</strong> : la canne ou le bâton du chef, la peau de panthère, le tambour d'appel.</li></ul>" +
          formule("lire un symbole = je décris l'objet → je dis à qui il est réservé → j'explique son sens") +
          ex("La peau de léopard (doc. 2) : un tapis de fourrure tachetée, réservé au chef, car le léopard est « le roi de la forêt » : elle signifie la force et le pouvoir.", "Lire un symbole avec la méthode") +
          savais("Au Cameroun, le chef traditionnel est aussi reconnu par l'État : il existe des chefferies de premier, deuxième et troisième degré."),
        planches: [{ type: "3d", titre: "Les attributs d'un roi", legende: "Tourne l'estrade : au centre, le trône perlé aux couleurs vives, avec son dossier et ses accoudoirs ; à côté, le grand tambour d'appel ; devant, la peau de léopard ; à gauche, le chasse-mouches. Réunis, ces objets disent l'autorité, la force et la richesse du roi.", modele: { h: 340, rx: -18, ry: 30, echelle: 0.8, alt: "Estrade avec un trône perlé coloré, un grand tambour, une peau de léopard et un chasse-mouches", objets: trone3D(), etiquettes: [{ p: [-40, 140, 34], t: "trône perlé", cote: "g" }, { p: [90, 82, 30], t: "tambour d'appel", cote: "d" }, { p: [80, 18, -50], t: "peau de léopard", cote: "d" }, { p: [-140, 96, -40], t: "chasse-mouches", cote: "g" }] } }],
        fil: { html: "<p>En comparant les régions, Kévine découvre que les objets changent (trône perlé à l'Ouest, parasol au Nord, canne au Sud) mais que leurs <strong>sens se ressemblent</strong> : l'autorité, la force, la richesse, le lien avec les ancêtres.</p>", verdicts: [[1, "rejetee", "Les objets varient, mais ils expriment partout les mêmes idées."]] },
        retenir: "Ouest : trône perlé, léopard, bonnet ; Nord : parasol, cavaliers, trompettes ; Sud et Est : canne, tambour." },
      { t: "Comparer avec le pharaon", html: "<ul><li>Le <strong>pharaon</strong> portait la double couronne, le sceptre et le fouet, le cobra, la barbe postiche (leçon sur l'Égypte).</li><li>Comme le chef camerounais, il utilisait des objets <strong>réservés</strong> pour montrer son autorité.</li><li>Dans les deux cas, le pouvoir est aussi <strong>religieux</strong> : le pharaon est un dieu vivant, le chef traditionnel est souvent le lien entre les vivants et les ancêtres.</li></ul>" +
          formule("comparer = mêmes questions (quel objet ? à qui réservé ? quel sens ?) pour le chef et pour le pharaon") +
          ex("Le sceptre du pharaon et la canne du chef : deux bâtons réservés au souverain, qui signifient le pouvoir de guider et de commander.", "Un point commun") +
          attention("Respecte la chefferie de ta région quand tu étudies ses symboles : certains objets sont sacrés et ne se touchent pas ; demande toujours l'autorisation avant de photographier."),
        planches: [P2("Chef camerounais et pharaon", "Des objets différents, des sens semblables : l'autorité, la force, le lien avec le sacré.",
          colonnes("Comparer les symboles du pouvoir", [{ t: "Le pharaon", c: "#B07A00", l: ["double couronne", "sceptre et fouet", "cobra", "→ roi-dieu"] }, { t: "Le chef camerounais", c: "#C2540A", l: ["trône perlé, bonnet", "canne, chasse-mouches", "léopard, tambour", "→ lien avec les ancêtres"] }], 230, "Tableau comparant les symboles du pharaon et ceux d'un chef camerounais"))],
        fil: { html: "<p>La classe a la réponse : les objets du chef sont des <strong>symboles</strong> qui montrent son autorité, sa force et son lien avec les ancêtres ; ils varient selon les régions, mais leurs sens se rejoignent, et on retrouve les mêmes idées chez le pharaon d'Égypte.</p>", verdicts: [[2, "validee", "Des symboles variés selon les régions, mais qui expriment partout l'autorité, la force et le sacré."]] },
        retenir: "Pharaon et chef : objets réservés, sens semblables (autorité, force, sacré)." },
      { t: "Entraînement au format de l'examen", html: integ("Un symbole du pouvoir est…", ["un objet que tout le monde utilise", "un objet qui représente l'autorité du chef", "un outil agricole", "un jeu"], "Un objet qui représente l'autorité du chef", "Il a un sens reconnu par tous.", "Cite trois symboles du pouvoir traditionnel au Cameroun et dis ce que chacun signifie.", "Le trône perlé : la place du roi au-dessus des autres ; la peau de léopard : la force ; le chasse-mouches : l'autorité ; le parasol du lamido : la protection et la dignité.", "Ton TD : présenter un symbole du pouvoir de ta région.", "Rédige ta présentation en suivant la méthode de la leçon.", "Je choisis le bonnet brodé du chef de mon village. Je le décris : un bonnet tricoté avec des motifs et des pompons. Il est réservé au chef et à certains notables. Il signifie que celui qui le porte détient l'autorité et la sagesse. Comme la couronne du pharaon, c'est un objet qui montre à tous qui commande."), retenir: "Savoir-être : respect des chefferies et du patrimoine culturel de chaque région." }
    ],
    denouement: { titre: "La fiche du TD 4", etapes: ["Définir le symbole du pouvoir : un objet visible au sens reconnu (indice 1).", "Identifier et lire les symboles de plusieurs régions du Cameroun (indice 2).", "Comparer avec le pharaon : des objets différents, des sens semblables (indice 3)."],
      formules: [F("Définir", "symbole = objet + sens reconnu par tous", "trône perlé = autorité du roi"), F("Lire un symbole", "décrire → à qui réservé → sens", "peau de léopard → chef → force"), F("Comparer", "mêmes questions pour le chef et le pharaon", "canne et sceptre : guider, commander")],
      reponse: "<p>Les objets du chef traditionnel ne sont pas de simples meubles : ce sont des symboles du pouvoir, des objets réservés dont le sens est reconnu par tous. Au palais de Foumban, le trône perlé montre la place du roi au-dessus des autres ; la peau de léopard, « roi de la forêt », dit sa force ; le chasse-mouches, le bonnet brodé et le grand tambour disent qu'il commande. Les objets changent d'une région à l'autre (trône perlé dans les Grassfields, parasol et trompettes du lamido au Nord, canne au Sud), mais ils expriment partout les mêmes idées : l'autorité, la force, la richesse et le lien avec les ancêtres. On retrouve ces idées chez le pharaon d'Égypte, avec sa double couronne, son sceptre et son fouet.</p>",
      transfert: "<p>Dessine un symbole du pouvoir de ta région (ou de la région de tes parents). Sous ton dessin, écris ce qu'il est, à qui il est réservé et ce qu'il signifie.</p>" },
    revision: ["<strong>Symbole du pouvoir</strong> : objet visible au sens reconnu par tous.", "Trône ou tabouret perlé : la place du chef ; chasse-mouches : l'autorité.", "Léopard, lion, éléphant : la force ; bonnet brodé, turban : la dignité.", "Grassfields : trône perlé, léopard ; Nord : parasol, cavaliers, trompettes ; Sud : canne, tambour.", "Méthode : décrire, dire à qui il est réservé, expliquer son sens.", "Pharaon : double couronne, sceptre et fouet ; sens semblables."],
    exo: "<p>Associe chaque symbole à son sens : peau de léopard, trône perlé, chasse-mouches. <em>(La force ; la place du roi au-dessus des autres ; l'autorité de commander.)</em></p>",
    quiz: [q("Un symbole du pouvoir est…", "un objet au sens reconnu par tous", "un objet sans valeur", "un outil de cuisine", "Il représente l'autorité."), q("La peau de léopard signifie surtout…", "la force du chef", "la pauvreté", "la fête", "Le léopard, « roi de la forêt »."), q("Le trône perlé est célèbre chez les…", "Bamoun", "Grecs", "Dogon", "Au palais de Foumban."), q("Au Nord, le lamido est souvent protégé par…", "un parasol", "une peau de léopard", "une pirogue", "Symbole de dignité et de protection."), q("Le chasse-mouches symbolise…", "l'autorité", "la pluie", "la chasse", "Le pouvoir de commander."), q("Pour lire un symbole, on dit d'abord…", "ce qu'est l'objet", "son prix", "son poids", "Décrire, puis à qui il est réservé, puis le sens."), q("Le pharaon portait…", "une double couronne", "une peau de léopard", "un bonnet perlé", "Symbole de l'union des deux Égypte."), q("Chez le pharaon comme chez le chef, le pouvoir est aussi…", "religieux ou sacré", "seulement économique", "sportif", "Dieu vivant, lien avec les ancêtres."), q("Avant de photographier un objet sacré d'une chefferie, il faut…", "demander l'autorisation", "le toucher", "le déplacer", "Respect du patrimoine."), q("Les symboles varient selon les régions mais expriment…", "les mêmes idées", "des idées toujours opposées", "rien", "Autorité, force, richesse, ancêtres.")],
    apc: apc("Lors d'une visite de musée, des élèves ne comprennent pas pourquoi un roi a besoin d'un trône perlé ou d'une peau de léopard.", "Identifier, lire et comparer les symboles du pouvoir traditionnel.")
  });
  VRT_A("6e-histoire-td-symboles-pouvoir", 1, "Que signifie ce symbole ? Retrouve son sens", function (el) {
    exercice(el, [["La peau de léopard, réservée au chef, signifie ___.", ["la force", "la pauvreté", "la pluie"], "Le léopard est le « roi de la forêt »."], ["Le trône perlé montre ___.", ["la place du roi au-dessus des autres", "le prix des perles", "le marché"], "Seul le roi s'y assoit."], ["Le chasse-mouches signifie ___.", ["l'autorité", "la chasse", "le jeu"], "Le pouvoir de commander."], ["Le parasol du lamido signifie ___.", ["la dignité et la protection", "le soleil", "le commerce"], "Au Nord-Cameroun."], ["Le grand tambour d'appel sert à ___.", ["rassembler le peuple sur ordre du chef", "danser seulement", "faire pleuvoir"], "Il porte la voix du chef."], ["La double couronne est un symbole du ___.", ["pharaon", "lamido", "fon"], "Union de la Haute et de la Basse-Égypte."]], "Symbole suivant", "Symbole");
  });
})();
