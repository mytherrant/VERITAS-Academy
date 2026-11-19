/* Leçons enrichies — 5e et 2nde, lot F (18/11/2026) : histoire, français, géographie. Même mécanisme que
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

  function barres(titre, D, unite, h, alt) {
    var max = Math.max.apply(null, D.map(function (d) { return d[1]; })), s = "<rect width='640' height='" + h + "' fill='#FBF8F2'/>" + txt(320, 28, titre, { s: 15 });
    D.forEach(function (d, i) { var y = 52 + i * 36, w = d[1] / max * 330; s += txt(200, y + 18, d[0], { s: 12.5, a: "end", w: 600 }) + "<rect x='210' y='" + y + "' width='" + w.toFixed(0) + "' height='24' rx='6' fill='" + d[2] + "'/>" + txt(218 + w, y + 17, d[3] || (d[1].toLocaleString("fr-FR") + " " + unite), { s: 12, a: "start", c: NUIT }); });
    return svg(640, h, alt || titre, "", s);
  }
  function P2(titre, legende, s) { return { type: "2D", titre: titre, legende: legende, svg: s }; }

  /* ═══════════ 5e HISTOIRE — PYGMÉES ET SAO ═══════════ */
  enrichir("5e-histoire-pygmees-sao", {
    blocs: [[0, def("Chasseurs-cueilleurs semi-nomades", "Peuples qui vivent de la chasse, de la pêche et de la cueillette et déplacent leurs campements selon les ressources de la forêt.") + ex("Les Baka de l'Est récoltent le miel sauvage, chassent au filet et connaissent des centaines de plantes médicinales.")],
      [1, def("Cire perdue", "Technique de fonderie : on modèle l'objet en cire, on l'enrobe d'argile, on chauffe pour faire fondre la cire, on coule le bronze dans le vide, puis on casse le moule.") + formule("modèle en cire → moule d'argile → cire fondue → bronze coulé → moule cassé") + ex("Les statuettes sao exposées au Musée national ont été coulées ainsi ; chaque pièce est unique, car le moule est détruit.")]],
    planches: [[2, P2("Comment connaît-on les Sao ?", "Sans écrits, l'historien croise deux sources : l'archéologie (ce que l'on trouve dans le sol) et la tradition orale (ce que racontent les peuples voisins). La seconde exagère parfois : la première permet de la vérifier.", colonnes("Deux sources à croiser", [{ t: "Archéologie", c: "#8B5A2B", l: ["fouilles des buttes", "jarres funéraires", "bronzes à la cire perdue", "squelettes de taille ordinaire", "→ des agriculteurs et des artisans"] }, { t: "Tradition orale", c: "#7B3F99", l: ["récits des Kotoko, des voisins", "les Sao « géants », très forts", "fondateurs de villes", "souvenir de leur prestige", "→ une image à vérifier"] }], 250, "Tableau : ce que disent l’archéologie et la tradition orale sur les Sao"))]],
    formules: [F("Situer", "peuples pygmées : forêt du Sud et de l'Est ; Sao : sud du lac Tchad", "plus de 1 000 km les séparent"), F("Décrire", "chasse, pêche, cueillette / agriculture, buttes, bronze", "deux modes de vie différents"), F("Critiquer les sources", "tradition orale confrontée à l'archéologie", "« géants » : non confirmé par les fouilles")]
  });

  /* ═══════════ 5e FRANÇAIS — LA RELATIVE ═══════════ */
  enrichir("5e-francais-subordonnee-relative", {
    blocs: [[1, def("Pronom relatif", "Mot qui reprend l'antécédent et introduit la relative ; sa forme dépend de sa fonction dans la relative.")]],
    planches: [[2, P2("Les quatre pronoms relatifs simples", "Pour chaque pronom : sa fonction dans la relative, le test pour le trouver et un exemple tiré de la lettre de Junior.", colonnes("qui · que · dont · où", [{ t: "qui", c: BLEU, l: ["sujet", "« … qui fait l'action »", "le village qui s'appelle", "Bandjoun"] }, { t: "que", c: VERT, l: ["COD", "« on … quoi ? »", "les masques que nous", "portons"] }, { t: "dont", c: "#C2540A", l: ["complément avec « de »", "« parler de… »", "le chef dont je t'ai", "parlé"] }, { t: "où", c: "#7B3F99", l: ["lieu ou temps", "« aller où ? quand ? »", "le marché où vont", "les femmes"] }], 210, "Tableau des pronoms relatifs qui, que, dont, où avec leur fonction et un exemple"))]],
    formules: [F("Relier sans répéter", "antécédent + pronom relatif + verbe", "le chef dont je t'ai parlé habite la chefferie"), F("Choisir le pronom", "remplacer par l'antécédent → fonction → pronom", "parler du chef → dont ; aller au marché → où"), F("Repérer un faux relatif", "pas d'antécédent → « que » conjonction", "Je pense que tu aimeras Bandjoun")]
  });

  /* ═══════════ 5e GÉOGRAPHIE — CROISSANCE DE LA POPULATION ═══════════ */
  enrichir("5e-geo-croissance-population", {
    planches: [[1, P2("Natalité, mortalité, accroissement à Garoua", "Les trois taux de la commune, en pour mille : l'accroissement naturel est la différence entre natalité et mortalité, et non leur somme.", barres("En ‰ par an", [["Natalité", 36, "#2E7D32", "36 ‰"], ["Mortalité", 9, "#C62828", "9 ‰"], ["Accroissement naturel", 27, BLEU, "36 − 9 = 27 ‰ = 2,7 %"]], "", 180, "Barres : natalité 36 pour mille, mortalité 9 pour mille, accroissement naturel 27 pour mille"))]],
    formules: [F("Calculer l'accroissement", "accroissement naturel = natalité − mortalité", "36 − 9 = 27 ‰"), F("Convertir", "‰ ÷ 10 = %", "27 ‰ = 2,7 % par an"), F("Prévoir", "temps de doublement ≈ 70 ÷ taux en %", "70 ÷ 2,7 ≈ 26 ans : planifier écoles et enseignants")]
  });

  /* ═══════════ 2nde A HISTOIRE — LES DISCIPLINES ═══════════ */
  enrichir("2nde-a-histoire-disciplines", {
    blocs: [[0, def("Source historique", "Toute trace du passé qui renseigne l'historien : écrit, objet, parole, paysage, nom de lieu.") + def("Critique des sources", "Examen d'une source avant de l'utiliser : qui l'a produite, quand, pourquoi, et que disent les autres sources ?")],
      [2, formule("âge ≈ 5 730 × log₂(100 ÷ pourcentage restant)") + def("Stratigraphie", "Étude de l'ordre des couches du sol : sauf bouleversement, la couche la plus basse est la plus ancienne.") + ex("88 % de carbone 14 restant : 5 730 × log₂(100 ÷ 88) ≈ 1 060 ans ; 25 % : deux demi-vies, ≈ 11 460 ans.")]],
    planches: [[2, P2("Les couches de la tranchée et leur date", "Chaque couche est datée par ce qu'elle contient : objets récents en haut, perles de traite au milieu (XVIIIᵉ-XIXᵉ siècles), tessons et charbon en bas, datés au carbone 14.", colonnes("De haut en bas : du plus récent au plus ancien", [{ t: "Couche 1", c: "#3B2A1E", l: ["0 à 30 cm", "sachets plastique", "→ aujourd'hui"] }, { t: "Couche 2", c: "#B5651D", l: ["30 à 80 cm", "perles de traite", "→ XVIIIᵉ-XIXᵉ s."] }, { t: "Couche 3", c: "#6E6A63", l: ["80 à 140 cm", "tessons, charbon", "→ vers l'an 970"] }], 190, "Tableau : trois couches de la tranchée, leur contenu et leur date"))]],
    formules: [F("Toute trace est une source", "vestiges + paroles + langues + noms de lieux", "tessons et charbon : à protéger"), F("Ordonner", "stratigraphie : la couche la plus basse est la plus ancienne", "tessons (couche 3) plus anciens que les perles (couche 2)"), F("Dater", "âge ≈ 5 730 × log₂(100 ÷ % restant)", "88 % → ≈ 1 060 ans → vers l'an 970")]
  });

  /* ═══════════ 2nde A FRANÇAIS — L'ÉNONCIATION ═══════════ */
  enrichir("2nde-a-francais-enonciation", {
    blocs: [[2, astuce("Pour transformer un énoncé ancré en énoncé coupé : je/tu → il/elle ; ici → là, à cet endroit ; demain → le lendemain ; hier → la veille ; présent ou passé composé → imparfait ou passé simple.")]],
    planches: [[2, P2("Ancré ou coupé : le tableau de conversion", "Chaque marque de l'énoncé ancré a son équivalent dans l'énoncé coupé, qui ne dépend plus de la situation d'énonciation.", colonnes("Du billet au récit", [{ t: "Énoncé ancré", c: BLEU, l: ["je, tu, nous, vous", "ici", "aujourd'hui, maintenant", "demain / hier", "présent, passé composé"] }, { t: "Énoncé coupé", c: "#7B3F99", l: ["il, elle, ils, elles", "là, à cet endroit", "ce jour-là, alors", "le lendemain / la veille", "imparfait, passé simple"] }], 230, "Tableau de conversion des marques d’un énoncé ancré vers un énoncé coupé"))]],
    formules: [F("Situation d'énonciation", "qui ? à qui ? où ? quand ?", "billet sans nom ni date : on ne peut pas répondre"), F("Marques explicites", "pronoms + déictiques + temps + modalisateurs + ponctuation", "Je, t', ici, demain, sans doute, !"), F("Réécrire en énoncé coupé", "je → il ; demain → le lendemain ; ici → la cour", "« Il lui avait donné rendez-vous le lendemain »")]
  });

  /* ═══════════ 2nde A GÉOGRAPHIE — LIRE UNE CARTE ═══════════ */
  enrichir("2nde-a-geo-cartes", {
    planches: [[1, P2("Grande ou petite échelle ?", "Plus le dénominateur est petit, plus la carte est à grande échelle : elle montre un petit espace avec beaucoup de détails. Quelques échelles courantes et ce que représente 1 cm.", colonnes("1 cm sur la carte représente…", [{ t: "1/10 000", c: VERT, l: ["100 m", "plan de quartier", "→ grande échelle"] }, { t: "1/50 000", c: BLEU, l: ["500 m", "carte topographique", "région de Douala"] }, { t: "1/200 000", c: "#C2540A", l: ["2 km", "carte routière", "d'une région"] }, { t: "1/50 000 000", c: "#7B3F99", l: ["500 km", "planisphère", "→ petite échelle"] }], 190, "Tableau : quatre échelles et la distance représentée par 1 centimètre"))]],
    formules: [F("Compléter la carte", "TOLES : titre, orientation, légende, échelle, source", "le brouillon devient lisible"), F("Calculer la distance", "distance réelle = distance carte × dénominateur", "3,5 × 10 000 = 35 000 cm = 350 m"), F("S'orienter", "le Nord en haut, sauf indication de la flèche", "refuge au Nord-Est du marché")]
  });

  /* ═══════════ 2nde C FRANÇAIS — LE THÉÂTRE ═══════════ */
  enrichir("2nde-c-francais-theatre", {
    blocs: [[1, ex("Dans <em>Trois prétendants… un mari</em> de Guillaume Oyônô Mbia, les répliques vives entre le père et les prétendants font rire le public, qui comprend plus que les personnages.", "Un exemple camerounais")]],
    formules: [F("Lire une page", "nom du personnage + réplique + didascalies", "les italiques ne se disent pas"), F("Identifier la parole", "tirade, stichomythie, monologue, aparté", "« Pas un franc… » au public : aparté"), F("Situer dans la pièce", "exposition → nœud → dénouement", "la répétition du club : mettre en scène la structure")]
  });
})();
