/* Leçons enrichies — premier cycle, lot D (18/11/2026) : langues nationales, arts, EPS, latin, grec. Même mécanisme que
   29-enrichies-lettres-a.js : AJOUTS SEULEMENT. */
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
  /* Consignes de Jacques (18/11/2026) : situation résolue avec les formules étape par étape, exemples, règles, astuces,
     planches 2D et 3D. AJOUTS SEULEMENT : blocs en fin de partie, planches, denouement.formules. */
  function enrichir(id, o) {
    var L = ancien(id); if (!L) return;
    (o.blocs || []).forEach(function (b) { var p = L.parties[b[0]]; if (p) p.html = (p.html || "") + b[1]; });
    (o.planches || []).forEach(function (b) { var p = L.parties[b[0]]; if (p) p.planches = (p.planches || []).concat([b[1]]); });
    if (o.formules && L.denouement && !(L.denouement.formules || []).length) L.denouement.formules = o.formules;
  }
  function def(t, h) { return "<div class='def'><b>" + t + "</b>" + h + "</div>"; }
  function formule(h) { return "<p class='formule'>" + h + "</p>"; }
  function ex(h, t) { return "<div class='ex'><b>" + (t || "Exemples") + "</b>" + h + "</div>"; }
  function astuce(h, t) { return "<div class='astuce'><b>" + (t || "Astuce") + "</b>" + h + "</div>"; }
  function attention(h, t) { return "<div class='attention'><b>" + (t || "Attention") + "</b>" + h + "</div>"; }
  function methode(h, t) { return "<div class='methode'><b>" + (t || "Méthode") + "</b>" + h + "</div>"; }
  function F(nom, f, calcul) { return { nom: nom, f: f, calcul: calcul }; }
  /* fiche 2D en colonnes : [{t, c, l:[lignes]}] */
  function colonnes(titre, cols, h, alt) {
    var W = 640, n = cols.length, w = (W - 30 - (n - 1) * 12) / n, s = "<rect width='640' height='" + h + "' fill='#FBF8F2'/>" + txt(320, 28, titre, { s: 15 });
    cols.forEach(function (c, i) {
      var x = 15 + i * (w + 12);
      s += "<rect x='" + x + "' y='44' width='" + w + "' height='" + (h - 58) + "' rx='12' fill='#fff' stroke='" + c.c + "' stroke-width='2'/><rect x='" + x + "' y='44' width='" + w + "' height='34' rx='11' fill='" + c.c + "'/>" + txt(x + w / 2, 66, c.t, { s: 14, c: "#fff" });
      c.l.forEach(function (l, k) { s += txt(x + 12, 100 + k * 24, l, { s: 12, a: "start", w: l.charAt(0) === "→" ? 800 : 550, c: l.charAt(0) === "→" ? c.c : NUIT }); });
    });
    return svg(640, h, alt || titre, "", s);
  }

  function etapes(titre, E, h, alt) {
    var n = E.length, w = (600 - (n - 1) * 16) / n, s = "<rect width='640' height='" + h + "' fill='#FBF8F2'/>" + txt(320, 28, titre, { s: 15 });
    E.forEach(function (e, i) { var x = 20 + i * (w + 16); s += "<rect x='" + x + "' y='46' width='" + w + "' height='" + (h - 62) + "' rx='14' fill='#fff' stroke='" + e[2] + "' stroke-width='2.5'/><circle cx='" + (x + 24) + "' cy='70' r='14' fill='" + e[2] + "'/>" + txt(x + 24, 75, String(i + 1), { s: 13, c: "#fff" }) + txt(x + w / 2 + 12, 76, e[0], { s: 13, c: e[2] }) + (e[3] ? "<g transform='translate(" + (x + w / 2) + " " + (h / 2 + 8) + ")'>" + e[3] + "</g>" : "") + txt(x + w / 2, h - 30, e[1], { s: 11, w: 600 }) + (i < n - 1 ? "<path d='M" + (x + w + 2) + " " + (h / 2 + 10) + "h12' stroke='" + NUIT + "' stroke-width='2.5' marker-end='url(#etF)'/>" : ""); });
    return svg(640, h, alt || titre, fleche("etF", NUIT), s);
  }
  function bonhomme(pose) {
    var P = { course: "M0 -30V0M0 0l-10 18M0 0l12 14l-2 8M0 -22l-12 10M0 -22l12 -6", genoux: "M0 -30V0M0 0l0 24M0 0l14 -4l2 14M0 -22l-12 10M0 -22l12 10", talons: "M0 -30V0M0 0l-2 24M0 0l6 12l-12 4M0 -22l-12 10M0 -22l12 10", bras: "M0 -30V0M0 0l-8 24M0 0l8 24M0 -22l-16 -10M0 -22l16 -10" };
    return "<circle cx='0' cy='-38' r='7' fill='#6B4423'/><path d='" + P[pose] + "' stroke='" + NUIT + "' stroke-width='4' stroke-linecap='round' fill='none'/>";
  }

  /* ═══════════ 4e LANGUES NATIONALES — LES TONS ═══════════ */
  enrichir("4e-ln-tons", {
    blocs: [[0, def("Ton", "Hauteur musicale d'une syllabe ; dans une langue à tons, changer le ton peut changer le sens du mot.") + ex("En français déjà, l'intonation change le sens d'une phrase : « Il vient. » (affirmation) / « Il vient ? » (question). Dans nos langues, c'est le mot lui-même qui change.")],
      [1, formule("haut : ´ (á) · bas : ` (à) · moyen : ¯ (ā) · montant : ˇ (ǎ) · descendant : ˆ (â)") + ex("bá (haut), bà (bas), bā (moyen), bǎ (montant), bâ (descendant) : cinq mélodies sur la même syllabe.") + astuce("Accent aigu = la voix monte en haut ; accent grave = elle descend en bas ; le signe dessine la mélodie : ˇ monte, ˆ descend.")],
      [2, attention("Ne confonds pas ton et accent tonique : en français, on appuie sur la dernière syllabe sans changer le sens ; le ton, lui, distingue des mots.")]],
    planches: [[2, { type: "2D", titre: "Noter le ton d'un mot en quatre gestes", legende: "La méthode de la leçon en quatre gestes : écouter le mot, le fredonner sur « la-la », tracer sa mélodie avec la main, puis noter le signe AGLC sur la voyelle.", svg: etapes("Noter le ton d'un mot en quatre gestes", [["Écouter", "le mot dit par l'enseignant", "#1E499B", "<path d='M-14 -6q6 -10 14 0M-20 -12q12 -18 26 0' stroke='#1E499B' stroke-width='3' fill='none'/><circle r='5' fill='#1E499B'/>"], ["Fredonner", "« la-la » sur la mélodie", "#7B3F99", "<path d='M-18 6q10 -20 18 -6t18 -10' stroke='#7B3F99' stroke-width='3' fill='none'/><circle cx='-18' cy='6' r='4' fill='#7B3F99'/>"], ["Tracer", "la courbe avec la main", "#C2540A", "<path d='M-20 10L0 -10L20 10' stroke='#C2540A' stroke-width='4' fill='none' stroke-linecap='round'/>"], ["Noter", "le signe AGLC sur la voyelle", "#2E7D32", "<text y='8' text-anchor='middle' font-size='30' font-weight='800' fill='#2E7D32'>bâ</text>"]], 200, "Quatre étapes pour noter un ton : écouter, fredonner, tracer, noter") }]],
    formules: [F("Définir", "ton = hauteur musicale d'une syllabe", "le volume (fort / doux) ne change pas le ton"), F("Vérifier l'effet sur le sens", "mêmes sons + ton différent = mot différent", "bá ≠ bà ≠ bā ≠ bǎ ≠ bâ"), F("Noter selon l'AGLC", "´ haut · ` bas · ¯ moyen · ˇ montant · ˆ descendant", "les signes de l'affiche restent")]
  });

  /* ═══════════ 6e ARTS — LES BRANCHES ═══════════ */
  enrichir("6e-arts-branches", {
    blocs: [[0, def("Arts plastiques", "Arts qui façonnent la matière, les formes et les couleurs pour créer une œuvre que l'on regarde : dessin, peinture, sculpture, poterie, tissage, photographie, architecture.") + ex("Les sculptures en bois de Foumban, les poteries décorées, les pagnes ndop teints à l'indigo.")],
      [1, def("Arts musicaux et arts scéniques", "Arts musicaux : on organise des sons (chant, instruments). Arts scéniques : on donne un spectacle devant un public (théâtre, danse, conte, mime, marionnettes).") + ex("Musical : un air de balafon, un chant de chorale. Scénique : un conte de la tortue dit à la veillée, une danse bikutsi.") + astuce("Demande-toi ce que reçoit le public : il regarde une œuvre → plastique ; il écoute → musical ; il assiste à un spectacle joué → scénique.")]],
    planches: [[2, { type: "2D", titre: "Quel jury ? L'arbre de décision", legende: "Deux questions suffisent pour ranger une œuvre : le public la regarde-t-il comme un objet ? sinon, l'écoute-t-il seulement ou assiste-t-il à un spectacle ?", svg: (function () {
      var s = "<rect width='640' height='260' fill='#FBF8F2'/>";
      function b(x, y, w, t, c, f) { return "<rect x='" + x + "' y='" + y + "' width='" + w + "' height='44' rx='10' fill='" + (f ? c : "#fff") + "' stroke='" + c + "' stroke-width='2'/>" + txt(x + w / 2, y + 27, t, { s: 12.5, c: f ? "#fff" : NUIT }); }
      s += b(170, 14, 300, "Le public regarde un objet créé ?", BLEU) + "<path d='M320 58V78H120V96M320 78H470V96' stroke='" + NUIT + "' stroke-width='2' fill='none'/>" + txt(210, 74, "oui", { s: 11, c: VERT }) + txt(420, 74, "non", { s: 11, c: ROUGE });
      s += b(30, 96, 180, "ARTS PLASTIQUES", "#352C72", true) + txt(120, 160, "bronze, ndop, photo", { s: 11, w: 500 });
      s += b(340, 96, 260, "Il écoute seulement ?", BLEU) + "<path d='M470 140V160H380V178M470 160H560V178' stroke='" + NUIT + "' stroke-width='2' fill='none'/>" + txt(415, 156, "oui", { s: 11, c: VERT }) + txt(525, 156, "non", { s: 11, c: ROUGE });
      s += b(300, 178, 160, "ARTS MUSICAUX", "#6B4E00", true) + b(470, 178, 160, "ARTS SCÉNIQUES", "#6E1F43", true) + txt(380, 242, "balafon, chant", { s: 11, w: 500 }) + txt(550, 242, "conte, danse, théâtre", { s: 11, w: 500 });
      return svg(640, 260, "Arbre de décision : objet regardé, arts plastiques ; sinon, écoute seule, arts musicaux ; spectacle, arts scéniques", "", s);
    })() }]],
    formules: [F("Ce que perçoit le public", "regarder → plastique ; écouter → musical ; spectacle → scénique", "statuette → plastique · balafon → musical"), F("Ne pas se fier à la matière", "on classe l'œuvre, pas l'objet", "balafon en bois sculpté → air de musique → musical"), F("Reconnaître le conte", "parole + gestes + public = spectacle", "conte de la tortue → scénique")]
  });

  /* ═══════════ 6e EPS — COORDINATION BRAS-JAMBES ═══════════ */
  enrichir("6e-eps-bras-jambes", {
    blocs: [[0, def("Coordination croisée", "En course, le bras qui avance est toujours opposé à la jambe qui avance : bras gauche avec jambe droite, bras droit avec jambe gauche.") + formule("jambe droite devant ⇔ bras gauche devant · jambe gauche devant ⇔ bras droit devant") + ex("Observe un sprinteur au ralenti : à chaque foulée, son épaule gauche avance avec son genou droit.")],
      [2, ex("Footing 5 minutes, rotations des chevilles, genoux et épaules, 2 × 20 m de montées de genoux, 2 × 20 m de talons-fesses, puis deux accélérations progressives.", "Un échauffement de 10 minutes") + astuce("Pour retrouver la coordination, marche d'abord en exagérant le balancement des bras, puis trottine, puis accélère.")]],
    planches: [[2, { type: "2D", titre: "L'échauffement en quatre exercices", legende: "Un échauffement simple avant de courir : footing lent, montées de genoux, talons-fesses, rotations des articulations.", svg: etapes("L'échauffement en quatre exercices", [["Footing", "5 min, allure lente", "#1E499B", bonhomme("course")], ["Montées de genoux", "2 × 20 m", "#7B3F99", bonhomme("genoux")], ["Talons-fesses", "2 × 20 m", "#C2540A", bonhomme("talons")], ["Rotations", "chevilles, épaules", "#2E7D32", bonhomme("bras")]], 210, "Quatre silhouettes : footing, montées de genoux, talons-fesses, rotations des bras") }]],
    formules: [F("Rôle des bras", "bras = équilibre + rythme", "bras collés de Samuel → course freinée"), F("Coordination croisée", "bras opposé à la jambe", "Aboubakar, bras du même côté → le buste tourne, il zigzague"), F("Prévenir les crampes", "échauffement progressif avant, récupération après", "footing, montées de genoux, talons-fesses")]
  });

  /* ═══════════ 6e EPS — LA PISTE ═══════════ */
  enrichir("6e-eps-piste", {
    blocs: [[0, def("Piste réglementaire", "Anneau de 400 m mesuré dans le couloir 1, composé de deux lignes droites et de deux virages, avec en général huit couloirs de 1,22 m.") + ex("Un tour de piste = 400 m ; le 800 m = deux tours ; le 1 500 m = trois tours trois quarts.")],
      [1, formule("décalage au 200 m ≈ π × (rayon du couloir − rayon du couloir 1)") + ex("Couloir 8 : π × (45,24 − 36,80) ≈ 26,5 m d'avance au départ du 200 m ; au 400 m (deux virages) : environ 53 m.") + astuce("Le coureur qui part le plus loin devant (couloir 8) ne voit pas ses adversaires : il doit courir « à l'aveugle » et garder son allure.") + attention("Au 200 m et au 400 m, mettre le pied dans le couloir voisin, surtout à l'intérieur du virage, entraîne la disqualification.")]],
    planches: [[1, { type: "2D", titre: "La piste vue de dessus : son vocabulaire", legende: "Vue de dessus d'une piste : deux lignes droites, deux virages, huit couloirs, la corde à l'intérieur, la ligne d'arrivée au bout de la ligne droite et le sens de course (inverse des aiguilles d'une montre).", svg: (function () {
      var s = "<rect width='640' height='300' fill='#6E9B45'/>", cy = 150, cx1 = 200, cx2 = 440;
      function st(r) { return "M" + cx1 + " " + (cy - r) + "H" + cx2 + "A" + r + " " + r + " 0 0 1 " + cx2 + " " + (cy + r) + "H" + cx1 + "A" + r + " " + r + " 0 0 1 " + cx1 + " " + (cy - r) + "Z"; }
      s += "<path d='" + st(126) + "' fill='#B5442C'/><path d='" + st(90) + "' fill='#5E9E4E'/>"; for (var k = 0; k <= 8; k++) s += "<path d='" + st(90 + k * 4.5) + "' fill='none' stroke='#F4F1EA' stroke-width='1'/>";
      s += "<path d='M" + cx2 + " " + (cy + 90) + "V" + (cy + 126) + "' stroke='#fff' stroke-width='4'/><path d='M260 " + (cy + 108) + "H380' stroke='#fff' stroke-width='3' marker-end='url(#psF)'/>";
      [[320, cy - 108, "ligne droite", "#fff"], [90, cy, "virage", "#fff"], [320, cy, "pelouse", "#fff"], [470, cy + 140, "ligne d'arrivée", "#fff"], [320, cy + 140, "sens de course", "#fff"], [560, cy - 70, "couloir 8", "#fff"], [540, cy + 60, "corde (couloir 1)", "#F7C948"]].forEach(function (e) { s += txt(e[0], e[1] + 4, e[2], { s: 12, c: e[3] }); });
      return svg(640, 300, "Vue de dessus d’une piste rouge à huit couloirs avec le vocabulaire : ligne droite, virage, corde, ligne d’arrivée, sens de course", fleche("psF", "#fff"), s);
    })() }]],
    formules: [F("Longueur d'un tour", "400 m mesurés dans le couloir 1", "les couloirs extérieurs sont plus longs dans les virages"), F("Décalage au 200 m", "π × (R du couloir − R du couloir 1)", "couloir 8 : π × (45,24 − 36,80) ≈ 26,5 m"), F("Règle du couloir", "rester dans son couloir du départ à l'arrivée", "couper le virage → disqualification")]
  });

  /* ═══════════ 6e LATIN — JOURS ET MOIS ═══════════ */
  enrichir("6e-la-jours", {
    blocs: [[0, formule("jour = nom de l'astre (au génitif) + dies : Lunae dies → lundi") + ex("Martis dies → mardi · Mercurii dies → mercredi · Iovis dies → jeudi · Veneris dies → vendredi") + astuce("Cherche l'astre caché dans le nom du jour : lun- (Lune), mar- (Mars), mercre- (Mercure), jeu- (Jupiter), vendre- (Vénus).")],
      [1, def("Calendrier romain primitif", "L'année de Romulus commençait en mars (Martius) et comptait dix mois ; janvier et février furent ajoutés plus tard, puis placés en tête de l'année.") + ex("September (7ᵉ) → 9ᵉ mois ; October (8ᵉ) → 10ᵉ ; November (9ᵉ) → 11ᵉ ; December (10ᵉ) → 12ᵉ.", "Le glissement de deux rangs") + attention("Samedi ne vient pas de Saturne en français (sambati dies, jour du sabbat) ; mais l'anglais Saturday garde Saturne.")]],
    planches: [[0, { type: "2D", titre: "Un jour latin, quatre langues romanes", legende: "Les noms latins des jours se retrouvent dans toutes les langues romanes : on reconnaît la Lune, Mars, Mercure, Jupiter et Vénus.", svg: colonnes("Un jour latin, quatre langues romanes", [{ t: "latin", c: "#7A1F1F", l: ["Lunae dies", "Martis dies", "Mercurii dies", "Iovis dies", "Veneris dies"] }, { t: "français", c: BLEU, l: ["lundi", "mardi", "mercredi", "jeudi", "vendredi"] }, { t: "italien", c: VERT, l: ["lunedì", "martedì", "mercoledì", "giovedì", "venerdì"] }, { t: "espagnol", c: "#C2540A", l: ["lunes", "martes", "miércoles", "jueves", "viernes"] }], 230, "Tableau : noms latins des jours et leurs équivalents en français, italien, espagnol") }]],
    formules: [F("Origine des jours", "astre + dies (le jour)", "Lunae dies → lundi : le jour de la Lune"), F("Calendrier primitif", "l'année commence en mars", "Martius 1ᵉʳ … September 7ᵉ"), F("Glissement", "début en janvier → les numéros glissent de deux rangs", "September devient le 9ᵉ mois")]
  });

  /* ═══════════ 6e LATIN — ORIGINE ═══════════ */
  enrichir("6e-la-origine", {
    blocs: [[0, def("Langue romane", "Langue issue du latin parlé dans les provinces de l'Empire romain : français, italien, espagnol, portugais, roumain.") + ex("Le Latium, région de Rome, a donné son nom au latin ; la Gaule conquise par César (58-51 av. J.-C.) a peu à peu parlé latin.")],
      [2, formule("racine latine + suffixe français = mot savant : aqua + -rium → aquarium") + ex("terra → territoire, terrestre, enterrer · manus → manuel, manuscrit, manucure · vita → vital, vitamine") + astuce("Quand un mot te paraît difficile, cherche la racine latine cachée dedans : elle te donne souvent le sens.")]],
    planches: [[2, { type: "2D", titre: "Trois racines latines et leurs familles de mots", legende: "Une racine latine donne toute une famille de mots français : connaître la racine, c'est deviner le sens.", svg: colonnes("Trois racines latines et leurs familles de mots", [{ t: "aqua (l'eau)", c: BLEU, l: ["aquarium", "aquatique", "aqueduc", "aquarelle"] }, { t: "terra (la terre)", c: "#8B5A2B", l: ["territoire", "terrestre", "enterrer", "terrasse"] }, { t: "manus (la main)", c: "#C2540A", l: ["manuel", "manuscrit", "manucure", "manœuvre"] }], 200, "Tableau : familles de mots français issues de aqua, terra et manus") }]],
    formules: [F("Origine", "latin = langue du Latium et de Rome", "répandu par la conquête jusqu'en Gaule"), F("Filiation", "latin parlé → langues romanes", "noctem → nuit, notte, noche, noite, noapte"), F("Présence aujourd'hui", "racine latine → mot français", "agenda, et cetera, aquarium, Homo sapiens")]
  });

  /* ═══════════ 6e LANGUES NATIONALES — LA CARTE ═══════════ */
  enrichir("6e-ln-carte", {
    blocs: [[0, def("Langue officielle, langue nationale", "Langue officielle : langue de l'administration, de la justice et de l'école (français, anglais). Langue nationale : langue parlée par une communauté du pays (ewondo, duala, fulfulde…).") + ex("Au marché de Ngaoundéré, on achète en fulfulde ; au tribunal, on plaide en français ou en anglais.")],
      [1, def("Famille de langues", "Ensemble de langues qui descendent d'une même langue ancienne et se ressemblent dans leurs mots et leur grammaire.") + ex("Bantoues : ewondo, bulu, duala, basaa · Grassfields : ghomálá', medumba · Tchadiques : mafa, giziga · Adamawa-oubanguiennes : mbum, gbaya") + astuce("Pour retenir les familles, pense à la carte du Sud au Nord : bantou (Sud, Centre, côte), Grassfields (Ouest), adamawa (Adamaoua, Est), tchadique (Extrême-Nord).")],
      [3, attention("Écrire une langue nationale n'est pas « franciser » les sons : l'AGLC a ses propres lettres (ɛ, ɔ, ŋ…) et ses signes de tons.")]],
    planches: [[3, { type: "2D", titre: "Les grandes familles, du Sud au Nord", legende: "Les quatre grandes familles de langues du Cameroun, leurs régions et quelques langues de chacune (limites approximatives).", svg: colonnes("Les grandes familles, du Sud au Nord", [{ t: "bantoues", c: "#2E7D32", l: ["Sud, Centre, Littoral", "ewondo, bulu", "duala, basaa"] }, { t: "Grassfields", c: "#C2540A", l: ["Ouest, Nord-Ouest", "ghomálá', medumba", "lamnso'"] }, { t: "adamawa", c: "#B8860B", l: ["Adamaoua, Est", "mbum, gbaya"] }, { t: "tchadiques", c: "#7B3F99", l: ["Extrême-Nord", "mafa, giziga"] }], 180, "Tableau des grandes familles de langues du Cameroun, de leurs régions et de quelques langues") }]],
    formules: [F("Langues officielles et nationales", "2 langues officielles + plus de 250 langues nationales", "français, anglais ; ewondo, fulfulde…"), F("Classer par famille", "langue → famille → région", "ewondo → bantoue → Centre ; fulfulde → atlantique → Nord"), F("Écrire", "AGLC (1979) : un alphabet commun avec les tons", "toutes nos langues peuvent s'écrire")]
  });

  /* ═══════════ 4e GREC — L'ALPHABET ═══════════ */
  enrichir("4e-gr-alphabet", {
    blocs: [[1, formule("Η η = ê · Ρ ρ = r · Χ χ = kh · Θ θ = th · Φ φ = ph · Ψ ψ = ps · Ξ ξ = ks") + def("Faux amis", "Capitales grecques qui ressemblent à des lettres latines mais ne se lisent pas pareil : Η (êta), Ρ (rhô), Χ (khi), Ν (nu).") + ex("ΑΘΗΝΑ → Athêna · ΑΚΡΟΠΟΛΙΣ → Akropolis · ΧΑΙΡΕ → khaïré (bonjour)") + astuce("Lis chaque lettre séparément en disant son nom (alpha, thêta, êta…) avant de prononcer le mot entier.")],
      [2, ex("τῆλε (loin) + φωνή (voix) → téléphone · γῆ (terre) + γράφω (écrire) → géographie", "Racines") + attention("En fin de mot, le sigma s'écrit ς : λόγος ; au milieu, σ : σοφία.")]],
    formules: [F("Lire lettre par lettre", "nom de la lettre → son", "Α a · Θ th · Η ê · Ν n · Α a"), F("Éviter les faux amis", "Η = ê, Ρ = r, Χ = kh", "ΑΘΗΝΑ = Athêna, pas « Athhna »"), F("Relier au français", "racine grecque + racine grecque = mot savant", "ἄκρος + πόλις → acropole")]
  });
})();
