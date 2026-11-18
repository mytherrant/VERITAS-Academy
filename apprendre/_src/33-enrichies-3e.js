/* Leçons enrichies — 3e, lot E (18/11/2026) : arts, ECM, français, histoire, géographie. Même mécanisme que
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

  /* ═══════════ 3e ARTS — OMBRE ET LUMIÈRE ═══════════ */
  enrichir("3e-arts-ombre", {
    blocs: [[0, ex("Un canari posé sur une table au soleil de 16 h : la face tournée vers le soleil est claire (lumière), l'autre face est sombre (ombre propre), et une tache sombre s'allonge sur la table du côté opposé (ombre portée).", "Au quotidien")],
      [2, astuce("Plisse les yeux en regardant ton modèle : les détails disparaissent et il ne reste que les grandes masses de lumière et d'ombre, plus faciles à dessiner.") + ex("Crayon 2H pour la pénombre légère, HB pour les gris moyens, 4B pour le plus sombre de l'ombre propre et le pied de l'ombre portée.", "Choisir ses crayons")]],
    planches: [[2, { type: "2D", titre: "Ombrer un canari en quatre étapes", legende: "1. Repérer la lumière ; 2. tracer la limite lumière-ombre ; 3. ombrer progressivement du clair au foncé ; 4. ajouter l'ombre portée, opposée à la lumière et plus longue si le soleil est bas.", svg: (function () {
      var s = "<rect width='640' height='240' fill='#FBF8F2'/><defs><radialGradient id='cnG' cx='30%' cy='30%' r='80%'><stop offset='0' stop-color='#F2D2B0'/><stop offset='.5' stop-color='#B07A4A'/><stop offset='1' stop-color='#4A2E1A'/></radialGradient></defs>", k;
      for (k = 0; k < 4; k++) {
        var x = 80 + k * 160, y = 130;
        s += "<path d='M" + (x - 40) + " " + (y + 60) + "H" + (x + 60) + "' stroke='#C9B28A' stroke-width='2'/>" + txt(x, 222, ["1. la lumière", "2. la limite", "3. le dégradé", "4. l'ombre portée"][k], { s: 12 });
        if (k === 3) s += "<ellipse cx='" + (x + 50) + "' cy='" + (y + 58) + "' rx='56' ry='8' fill='#3B2A1A' opacity='.35'/>";
        var fill = k < 2 ? "#fff" : "url(#cnG)";
        s += "<path d='M" + (x - 34) + " " + (y + 10) + "q0 -44 34 -44q34 0 34 44q0 48 -34 48q-34 0 -34 -48Z' fill='" + fill + "' stroke='#4A2E1A' stroke-width='2'/><path d='M" + (x - 14) + " " + (y - 34) + "q14 -8 28 0v-10h-28Z' fill='" + fill + "' stroke='#4A2E1A' stroke-width='2'/>";
        if (k === 1) s += "<path d='M" + (x + 6) + " " + (y - 33) + "q20 30 -8 90' stroke='#4A2E1A' stroke-dasharray='4 3' fill='none'/>";
        if (k === 0) s += "<circle cx='" + (x - 50) + "' cy='" + (y - 70) + "' r='10' fill='#F7C948'/><path d='M" + (x - 40) + " " + (y - 62) + "l22 18' stroke='#F7C948' stroke-width='3' marker-end='url(#omF)'/>";
      }
      return svg(640, 240, "Quatre canaris : la flèche de lumière, la limite lumière-ombre, le dégradé, puis l’ombre portée sur la table", fleche("omF", "#E8A33D"), s);
    })() }]],
    formules: [F("Repérer la source", "flèche de lumière sur le dessin", "soleil en haut à gauche"), F("Ombre propre", "face opposée à la lumière, en dégradé lumière → pénombre → ombre", "côté droit du canari, crayons 2H → 4B"), F("Ombre portée", "du côté opposé à la lumière ; source basse = ombre longue", "sur la table, vers la droite, allongée en fin d'après-midi")]
  });

  /* ═══════════ 3e ECM — FONDEMENTS DE LA DÉMOCRATIE ═══════════ */
  enrichir("3e-ecm-democratie", {
    blocs: [[0, formule("démocratie = gouvernement du peuple, par le peuple, pour le peuple (Abraham Lincoln)") + ex("Au Cameroun, les citoyens élisent le président de la République, les députés et les conseillers municipaux.")],
      [1, ex("Un bureau du foyer élu à vie viole l'alternance ; un président qui fait aussi les règles et juge les élèves viole la séparation des pouvoirs ; interdire de critiquer viole la liberté d'expression.", "Les piliers dans le règlement du foyer") + astuce("Pour juger si une organisation est démocratique, passe-la au crible : élection libre ? mandat limité ? pouvoirs séparés ? libertés respectées ? minorité protégée ?") + attention("La démocratie n'est pas la loi du plus grand nombre sans limites : la majorité décide, mais elle doit respecter les droits de la minorité.")]],
    formules: [F("Définir", "pouvoir du peuple, exercé directement ou par des élus", "les élèves élisent leur bureau"), F("Vérifier les piliers", "élections libres + alternance + séparation des pouvoirs + libertés", "le règlement proposé en viole quatre"), F("Proposer", "bureau élu chaque année + contrôle par une assemblée + référendum", "le foyer redevient démocratique")]
  });

  /* ═══════════ 3e ECM — SIÈGES AU SCRUTIN PROPORTIONNEL ═══════════ */
  enrichir("3e-ecm-sieges", {
    blocs: [[1, ex("Quotient 12 000 ÷ 7 ≈ 1 714. A : 5 300 ÷ 1 714 = 3,09 → 3 sièges, reste ≈ 157 ; B : 3 900 → 2 sièges, reste ≈ 471 ; C : 1 800 → 1 siège, reste ≈ 86 ; D : 1 000 → 0 siège, reste 1 000. Le 7ᵉ siège va au plus fort reste : D.", "Le calcul complet")],
      [2, ex("Avec 6 sièges au lieu de 7, le quotient serait 2 000 : A 2 (reste 1 300), B 1 (reste 1 900), C 0 (reste 1 800), D 0 (reste 1 000) ; les 3 sièges restants iraient à B, C et A.", "Et si l'on changeait le nombre de sièges ?")]],
    planches: [[2, { type: "2D", titre: "Part des voix et part des sièges", legende: "Les pourcentages de voix (barres pleines) et de sièges (barres claires) sont proches mais pas identiques : avec 7 sièges entiers, la proportionnelle n'est qu'approchée. B obtient 2 sièges pour 32,5 % des voix (2,28 sièges « idéaux »).", svg: (function () {
      var D = [["A", 5300, 3, "#1E499B"], ["B", 3900, 2, "#C2540A"], ["C", 1800, 1, "#2E7D32"], ["D", 1000, 1, "#7B3F99"]], s = "<rect width='640' height='260' fill='#FBF8F2'/>" + txt(320, 26, "% des voix et % des sièges (12 000 exprimés, 7 sièges)", { s: 14 });
      D.forEach(function (d, i) { var y = 50 + i * 50, pv = d[1] / 120, ps = d[2] / 7 * 100; s += txt(46, y + 26, "Liste " + d[0], { s: 13, a: "end" }) + "<rect x='56' y='" + y + "' width='" + (pv * 5.2).toFixed(0) + "' height='18' rx='4' fill='" + d[3] + "'/>" + txt(62 + pv * 5.2, y + 14, pv.toFixed(1).replace(".", ",") + " % des voix", { s: 11, a: "start" }) + "<rect x='56' y='" + (y + 20) + "' width='" + (ps * 5.2).toFixed(0) + "' height='16' rx='4' fill='" + d[3] + "' opacity='.4'/>" + txt(62 + ps * 5.2, y + 33, d[2] + " siège" + (d[2] > 1 ? "s" : "") + " = " + ps.toFixed(1).replace(".", ",") + " %", { s: 11, a: "start", c: GRIS }); });
      return svg(640, 260, "Barres comparant le pourcentage de voix et de sièges des listes A, B, C, D", "", s);
    })() }]],
    formules: [F("Suffrages exprimés", "votants − bulletins blancs et nuls", "12 600 − 600 = 12 000"), F("Quotient électoral", "suffrages exprimés ÷ nombre de sièges", "12 000 ÷ 7 ≈ 1 714 → A 3, B 2, C 1, D 0"), F("Plus fort reste", "sièges restants aux restes les plus grands", "7ᵉ siège : D (reste 1 000) → A 3, B 2, C 1, D 1")]
  });

  /* ═══════════ 3e FRANÇAIS — VILLE CRUELLE ═══════════ */
  enrichir("3e-fr-ville-cruelle", {
    blocs: [[0, def("Roman réaliste", "Récit qui peint fidèlement une société et ses injustices, à travers des personnages ordinaires et des lieux précis.") + ex("<em>Ville cruelle</em> (1954) peint la société coloniale du Cameroun à travers un jeune planteur, Banda, à Tanga.")],
      [1, def("Personnage type", "Personnage qui représente tout un groupe social : Banda, le jeune paysan ; le contrôleur et ses gardes, l'oppression coloniale ; les commerçants grecs, l'exploitation.") + astuce("Pour analyser un personnage, note ce qu'il fait, ce qu'il dit, ce qu'on dit de lui et ce qu'il représente.")],
      [3, ex("« Tanga-Nord » et « Tanga-Sud » : la ville elle-même raconte la séparation ; le feu qui brûle le cacao de Banda dit l'injustice mieux qu'un long discours.", "Le sens par les images") + methode("Justifier un titre : 1. relever les lieux ; 2. relever les épisodes de violence ; 3. montrer à qui elle profite ; 4. nuancer (le village étouffe aussi).", "Commenter le titre")]],
    formules: [F("Le cadre", "ville coupée en deux : colons / Africains", "Tanga-Sud et Tanga-Nord"), F("Les faits", "violence + injustice + mort", "cacao brûlé, coups des gardes, mort de Koumé"), F("Le système", "colonisation + relais africains + poids du village", "« ville cruelle » : une cruauté organisée")]
  });

  /* ═══════════ 3e HISTOIRE — LE KAMERUN ═══════════ */
  enrichir("3e-hist-kamerun", {
    blocs: [[0, def("Protectorat", "Territoire placé sous la « protection » d'une puissance étrangère, qui en contrôle en réalité la politique extérieure, puis l'administration.") + ex("12 juillet 1884 : traité germano-douala signé par les rois Ndumbé Lobé Bell et Ngando Akwa ; Gustav Nachtigal hisse le drapeau allemand.")],
      [1, ex("Chemin de fer du Nord (Bonabéri–Nkongsamba) et du Centre (Douala–Éséka), wharfs de Douala et de Kribi, plantations de cacao et de bananes autour du mont Cameroun.", "Les réalisations") + attention("Ces infrastructures servaient d'abord l'exportation vers l'Allemagne ; elles ont été construites par le travail forcé, dans lequel beaucoup d'ouvriers sont morts.")],
      [2, astuce("Pour répondre à « modernisation ou oppression ? », ne choisis pas un camp : montre les deux faces (réalisations / prix payé) puis conclus en historien, avec des faits et des dates.", "Rédiger la réponse")]],
    formules: [F("Le point de départ", "traité du 12 juillet 1884 + conditions des rois douala", "protectorat allemand"), F("Le bilan matériel", "rails + wharfs + plantations, orientés vers l'exportation", "chemin de fer du Nord, wharf de Douala"), F("Le prix humain", "travail forcé + expropriation + répression", "8 août 1914 : Rudolf Duala Manga Bell, Ngoso Din, Martin-Paul Samba ; 1916 : fin du Kamerun")]
  });

  /* ═══════════ 3e HISTOIRE — PARTAGE DE L'AFRIQUE ═══════════ */
  enrichir("3e-hist-partage", {
    blocs: [[1, def("Occupation effective", "Règle fixée à Berlin : pour revendiquer une côte d'Afrique, une puissance doit l'occuper réellement et le notifier aux autres signataires.") + formule("revendication = occupation effective + notification aux autres puissances") + ex("Aucun Africain n'est invité à Berlin ; quatorze États, surtout européens, y décident des règles du partage.")],
      [2, def("Frontière artificielle", "Limite tracée sans tenir compte des peuples, souvent en ligne droite ou le long d'un fleuve, sur des cartes encore incomplètes.") + ex("La frontière entre le Cameroun et le Nigeria sépare des familles kanuri, peules ou haoussa ; la famille de Moussa vit des deux côtés.") + astuce("Une frontière parfaitement droite sur une carte d'Afrique est presque toujours un héritage de la colonisation.")]],
    formules: [F("L'ampleur", "part de l'Afrique contrôlée par les Européens", "1880 : environ 10 % ; 1914 : environ 90 %"), F("Les règles", "occupation effective + notification (Berlin, 1884-1885)", "sans aucun représentant africain"), F("Le tracé", "traités entre Européens + lignes droites ou fleuves", "peuples séparés : la famille de Moussa")]
  });

  /* ═══════════ 3e GÉOGRAPHIE — PRÉSENTATION DU CAMEROUN ═══════════ */
  enrichir("3e-geo-cameroun", {
    blocs: [[0, def("Situation", "Position d'un pays sur le globe et par rapport à ses voisins : latitude, longitude, continent, océan, frontières.") + ex("Le Cameroun s'étend d'environ 2° à 13° de latitude Nord, du golfe de Guinée au lac Tchad ; il touche six pays : Nigeria, Tchad, RCA, Congo, Gabon, Guinée équatoriale.")],
      [1, formule("densité = population ÷ superficie") + ex("Environ 29 millions d'habitants ÷ 475 650 km² ≈ 61 habitants par km² (moyenne : bien plus au Littoral et à l'Ouest, beaucoup moins à l'Est).", "Calcul")],
      [2, def("Afrique en miniature", "Expression qui désigne le Cameroun parce qu'on y trouve presque tous les milieux du continent : forêt dense, mangrove, montagnes, plateaux, savanes et Sahel.")]],
    formules: [F("Situer", "latitude + façade maritime + voisins", "de 2° à 13° Nord ; golfe de Guinée ; 6 voisins"), F("Mesurer", "superficie + régions + densité = population ÷ superficie", "475 650 km² ; 10 régions ; ≈ 61 hab./km²"), F("Expliquer le surnom", "diversité des milieux du sud au nord", "forêt, mangrove, montagnes, savane, Sahel ; pluies de 10 000 à 600 mm")]
  });

  /* ═══════════ 3e GÉOGRAPHIE — LA MANGROVE ═══════════ */
  enrichir("3e-geo-mangrove", {
    blocs: [[1, ex("Les palétuviers aux racines-échasses retiennent la vase et cassent les vagues ; entre leurs racines, les jeunes crevettes et poissons grandissent à l'abri.", "Le rôle des palétuviers")],
      [2, ex("Une fumeuse de poisson coupe du bois de palétuvier parce qu'il brûle bien et longtemps ; un promoteur remblaie pour construire des maisons.", "Des acteurs aux besoins réels") + astuce("Dans un dossier de géographie, présente toujours chaque menace avec son acteur, sa raison et sa conséquence : c'est ce que demande l'examen.")]],
    formules: [F("Identifier le milieu", "forêt littorale de la zone de balancement des marées", "mangrove de l'estuaire du Wouri à Youpwe"), F("Mesurer ses services", "nurserie + digue naturelle + bois", "moins de mangrove → moins de crevettes, plus d'inondations"), F("Concilier", "fumoirs améliorés + reboisement + urbanisme hors zones inondables", "refuser la destruction des 10 ha et proposer des solutions")]
  });
})();
