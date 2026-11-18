/* Leçons enrichies — lettres et sciences humaines, lot C (18/11/2026) : cultures nationales, orientation, philosophie (Tle, 2nde A),
   ECM (2nde C). Même mécanisme que 29-enrichies-lettres-a.js : AJOUTS SEULEMENT. */
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

  /* ═══════════ Tle CULTURES — LES FUNÉRAILLES ═══════════ */
  enrichir("tle-cult-mort", {
    blocs: [[0, def("Les funérailles", "Ensemble des rites qui accompagnent un décès : annonce, veillée, inhumation, deuil, puis cérémonie de fin de deuil ; elles honorent le défunt, réunissent la famille et transmettent sa mémoire.") + ex("Chez les Bamiléké, les grandes funérailles peuvent avoir lieu des mois ou des années après l'inhumation ; chez les Béti, le deuil est levé lors d'une cérémonie familiale.", "Selon les communautés")],
      [1, formule("coût total = cérémonies + réception + tenues + morgue et transport + divers") + ex("Budget prévu : 3 000 000 F, dont réception 1 200 000 F, tenues 400 000 F, cérémonies 200 000 F.") + attention("Ce qui coûte le plus n'est pas le rite, mais la réception et l'apparence : on peut réduire sans manquer de respect.")],
      [2, methode("1. Rappeler le sens des rites. 2. Lire le budget poste par poste. 3. Réduire ce qui n'est pas un rite. 4. Affecter les économies à une priorité (scolarité, caisse de solidarité). 5. Faire valider par le conseil de famille.", "Argumenter dans le débat") + astuce("Dans un débat familial, commence par ce qui unit (« nous voulons tous honorer Papa Kamga ») avant de proposer des économies.")]],
    planches: [[2, { type: "2D", titre: "Le budget révisé des funérailles", legende: "Comparaison du budget prévu (3 000 000 F) et du budget révisé : une seule journée, réception limitée aux repas, pagne facultatif. Environ 900 000 F sont dégagés : 600 000 F pour la scolarité des quatre enfants, le reste pour la caisse de solidarité.", svg: barres("Prévu ou révisé ? (en F CFA)", [["Budget prévu", 3000000, "#C62828"], ["Budget révisé", 2100000, VERT], ["Économies", 900000, "#E8A33D"], ["dont scolarité", 600000, BLEU], ["dont caisse", 300000, "#7B3F99"]], "F", 240, "Barres : budget prévu 3 000 000 F, révisé 2 100 000 F, économies 900 000 F dont 600 000 F de scolarité") }]],
    formules: [F("Lire le budget", "postes du rite / postes de l'apparence", "cérémonies 200 000 F ; réception 1 200 000 F ; tenues 400 000 F"), F("Économiser sans supprimer les rites", "économies = réductions de la réception, des tenues et de la durée", "≈ 900 000 F : 3 000 000 → 2 100 000 F"), F("Affecter les économies", "scolarité + caisse de solidarité", "600 000 F de scolarité + 300 000 F en caisse")]
  });

  /* ═══════════ Tle CULTURES — LA NAISSANCE ═══════════ */
  enrichir("tle-cult-naissance", {
    blocs: [[0, def("Rite de passage", "Cérémonie qui fait passer une personne d'un statut à un autre ; la nomination fait entrer le nouveau-né dans la famille et la lignée.") + ex("Présentation de l'enfant aux aînés, choix d'un nom qui honore un parent ou rappelle une circonstance, cadeaux et repas partagé.")],
      [1, def("Acte de naissance", "Document d'état civil qui prouve l'identité de l'enfant (nom, date, lieu, parents) ; il est établi à partir de la déclaration faite au centre d'état civil dans les délais fixés par la loi.") + formule("grossesse → consultations prénatales → accouchement à la maternité → déclaration à l'état civil → nomination en famille") + ex("Sans acte de naissance, l'enfant ne pourra pas s'inscrire au CEP, au BEPC ou au baccalauréat, ni obtenir de carte d'identité.") + attention("Déclarer l'enfant est une obligation du père ou de la mère : on peut le faire avant la cérémonie de nomination, les deux ne s'opposent pas.")],
      [2, astuce("Pour juger une pratique, pose deux questions : protège-t-elle la santé et les droits de l'enfant ? renforce-t-elle les liens de la famille ? Si oui aux deux, on la garde.")]],
    planches: [[2, { type: "2D", titre: "Garder, adapter, abandonner", legende: "Trier les pratiques autour de la naissance selon deux critères : la santé et les droits de l'enfant, et le lien familial.", svg: colonnes("Tradition et vie moderne : trier", [{ t: "On garde", c: VERT, l: ["présentation à la famille", "nomination et transmission du nom", "solidarité autour de la mère", "repas partagé"] }, { t: "On adapte", c: "#E8A33D", l: ["nomination après la maternité", "conseils des aînées + suivi médical", "interdits alimentaires vérifiés", "fête simple et sans dettes"] }, { t: "On abandonne", c: ROUGE, l: ["accoucher seule au village", "remèdes non contrôlés", "refuser les vaccins", "ne pas déclarer l'enfant"] }], 230, "Tableau en trois colonnes : pratiques à garder, à adapter, à abandonner") }]],
    formules: [F("Protéger la mère et l'enfant", "consultations prénatales + accouchement en maternité", "hôpital de district, sage-femme"), F("Donner une existence juridique", "déclaration à l'état civil dans les délais → acte de naissance", "inscription possible aux examens officiels"), F("Garder le lien familial", "présentation + nomination + solidarité", "cérémonie au retour de la maternité")]
  });

  /* ═══════════ Tle ORIENTATION — GÉRER SON TEMPS ═══════════ */
  enrichir("tle-orient-temps", {
    blocs: [[0, formule("temps d'écran par semaine = heures par jour × 7") + ex("Aïcha : 4,5 h × 7 = 31,5 h d'écran par semaine, plus que ses heures de cours.") + astuce("Note pendant une semaine ce que tu fais heure par heure : les « heures perdues » apparaissent tout de suite.")],
      [1, formule("heures d'une matière = heures de révision × coefficient ÷ somme des coefficients") + ex("15 h × 5/15 = 5 h de philosophie ; 15 h × 4/15 = 4 h de français ; 3 h d'anglais ; 3 h d'histoire-géographie.", "Répartition d'Aïcha") + attention("Ne prends jamais le temps de révision sur le sommeil : il consolide la mémoire. Prends-le sur l'écran.")]],
    planches: [[1, { type: "2D", titre: "15 heures de révision selon les coefficients", legende: "Les 15 heures hebdomadaires d'Aïcha réparties au prorata des coefficients (5, 4, 3, 3 : total 15) : 5 h, 4 h, 3 h et 3 h. On peut ensuite ajouter un bonus aux matières faibles.", svg: barres("Répartition des révisions de la semaine", [["Philosophie (coef. 5)", 5, "#7B3F99", "5 h"], ["Français (coef. 4)", 4, BLEU, "4 h"], ["Anglais (coef. 3)", 3, VERT, "3 h"], ["Histoire-géo (coef. 3)", 3, "#C2540A", "3 h"]], "h", 210, "Barres : 5 h de philosophie, 4 h de français, 3 h d’anglais, 3 h d’histoire-géographie") }]],
    formules: [F("Faire le bilan", "écran par semaine = h par jour × 7", "4,5 × 7 = 31,5 h"), F("Libérer du temps sans toucher au sommeil", "gain = (4,5 − 1,5) h × 7", "3 × 7 = 21 h libérées → au moins 15 h de révision"), F("Répartir selon les coefficients", "h matière = 15 × coef ÷ 15", "philo 5 h · français 4 h · anglais 3 h · histoire-géo 3 h")]
  });

  /* ═══════════ Tle ORIENTATION — PRÉPARER LE BAC ═══════════ */
  enrichir("tle-orient-bac", {
    blocs: [[0, formule("moyenne = Σ (note × coefficient) ÷ Σ coefficients") + formule("gain de moyenne = Σ (points gagnés × coefficient) ÷ Σ coefficients") + ex("+3 en philosophie (coef. 5) : 15 ; +3 en français (coef. 4) : 12 ; +2 en anglais et en histoire-géo (coef. 3) : 6 + 6. Total 39 ÷ 22 ≈ 1,8 point : 8,6 → 10,4.") + def("Objectif SMART", "Spécifique, Mesurable, Atteignable, Réaliste, Temporel : « passer de 6 à 9 en philosophie au deuxième trimestre ».")],
      [1, ex("Septembre-novembre : fiches et un sujet par mois ; décembre : réviser le trimestre ; avril-mai : examens blancs chronométrés.", "Calendrier type")]],
    planches: [[0, { type: "2D", titre: "Ce que rapporte un point, selon le coefficient", legende: "Avec un total de coefficients de 22, un point gagné en philosophie (coef. 5) rapporte 0,23 point de moyenne, cinq fois plus qu'un point en EPS (coef. 1). Les efforts se concentrent d'abord sur les forts coefficients.", svg: barres("Gain de moyenne pour 1 point gagné", [["Philosophie (coef. 5)", 0.23, "#7B3F99", "+0,23"], ["Français (coef. 4)", 0.18, BLEU, "+0,18"], ["Anglais (coef. 3)", 0.14, VERT, "+0,14"], ["Mathématiques (coef. 2)", 0.09, "#C2540A", "+0,09"], ["EPS (coef. 1)", 0.05, GRIS, "+0,05"]], "", 240, "Barres : gain de moyenne par point selon le coefficient, de 0,23 en philosophie à 0,05 en EPS") }]],
    formules: [F("Effet d'un progrès ciblé", "gain = Σ (points × coef) ÷ 22", "(3×5 + 3×4 + 2×3 + 2×3) ÷ 22 = 39 ÷ 22 ≈ 1,8"), F("Nouvelle moyenne", "moyenne visée = 8,6 + gain", "8,6 + 1,8 ≈ 10,4 : admis"), F("Planifier", "objectifs SMART + un sujet par mois + examens blancs", "philosophie : de 6 à 9 au 2ᵉ trimestre")]
  });

  /* ═══════════ Tle PHILOSOPHIE — LIBERTÉ ET RESPONSABILITÉ ═══════════ */
  enrichir("tle-philo-liberte", {
    blocs: [[1, ex("Le malade mental qui agresse sous l'effet d'un délire est jugé irresponsable ; le chauffeur qui boit avant de conduire est responsable de l'accident, car il a choisi de boire.", "Deux cas opposés") + astuce("Pour juger une responsabilité, pose deux questions : la personne savait-elle ce qu'elle faisait ? pouvait-elle faire autrement ? Si oui aux deux, elle est responsable.")],
      [2, ex("Sartre : « L'homme est condamné à être libre » ; même conditionné par son milieu, il reste responsable de ce qu'il fait de ce qu'on a fait de lui.", "Une thèse") + attention("Expliquer un acte (par l'éducation, la pauvreté) n'est pas l'excuser : les déterminismes diminuent parfois la responsabilité, ils ne la suppriment pas.")]],
    planches: [[1, { type: "2D", titre: "Responsable ou non ? Les deux conditions", legende: "On n'est responsable que si l'on a agi en connaissance de cause et sans contrainte. Les trois situations de la leçon passées au crible.", svg: colonnes("Savait-il ? Pouvait-il faire autrement ?", [{ t: "Paul (freins sabotés)", c: GRIS, l: ["savait : non", "(il ignorait le sabotage)", "n'a rien choisi", "→ pas responsable"] }, { t: "Ernest (arme pointée)", c: "#7B3F99", l: ["savait : oui", "pouvait autrement : non", "(sous la menace)", "→ pas responsable"] }, { t: "Bertrand (ivre)", c: ROUGE, l: ["savait : oui", "pouvait autrement : oui", "(il a choisi de boire)", "→ responsable"] }], 220, "Trois colonnes : Paul aux freins sabotés, Ernest menacé d’une arme, Bertrand ivre, et leur responsabilité") }]],
    formules: [F("Définir", "liberté = pouvoir de choisir ; responsabilité = devoir répondre de ses actes", "pas de responsabilité sans liberté"), F("Tester les deux conditions", "responsable ⇔ il savait ET pouvait faire autrement", "Paul ignorait le sabotage ; Ernest était menacé → non responsables"), F("Conclure", "déterminisme ≠ excuse", "Bertrand a choisi de boire puis de conduire → responsable")]
  });

  /* ═══════════ Tle PHILOSOPHIE — LES PASSIONS ═══════════ */
  enrichir("tle-philo-passions", {
    blocs: [[0, formule("émotion = choc bref et intense · passion = inclination durable, exclusive, qui oriente toute la vie") + ex("La colère d'un supporter après un but : émotion. L'amour du football qui organise toutes ses journées : passion.")],
      [1, ex("Junior ne pense plus qu'au jeu vidéo, néglige ses devoirs et trouve des excuses à tout ; Sali, passionnée de musique, répète des heures et joue au festival du lycée.", "Mêmes signes, deux destins") + astuce("Exclusivité, cristallisation, aveuglement : reconnais ces trois mots dans un sujet et tu sauras que l'on parle de passion.")]],
    formules: [F("Distinguer", "passion (durable, exclusive) ≠ émotion (brève)", "le jeu de Junior dure des mois : passion"), F("Repérer les manifestations", "exclusivité + cristallisation + aveuglement", "Junior et Sali : mêmes signes"), F("Juger", "servitude si la passion gouverne la raison ; grandeur si la raison la gouverne", "Junior : servitude · Sali : grandeur (Hegel)")]
  });

  /* ═══════════ 2nde A PHILOSOPHIE — DÉFINITIONS ═══════════ */
  enrichir("2nde-a-philo-definitions", {
    blocs: [[1, astuce("Face à une affirmation, pose les trois questions de Socrate : Qu'est-ce que cela veut dire ? Comment le sait-on ? Existe-t-il un contre-exemple ?") + attention("Philosopher n'est pas contredire tout le monde : c'est examiner avec méthode, puis accepter l'argument le plus solide, même s'il n'est pas le sien.")]],
    formules: [F("Définir", "philosophie = philein (aimer) + sophia (sagesse)", "amour de la sagesse, réflexion critique et rationnelle"), F("Examiner l'opinion", "qui l'affirme ? sur quelles preuves ? contre-exemple ?", "« jamais de travail » : un contre-exemple suffit"), F("Situer", "la philosophie existe partout où l'on argumente", "palabre ; Towa, Njoh-Mouelle")]
  });

  /* ═══════════ 2nde C ECM — LA PRODUCTION ═══════════ */
  enrichir("2nde-c-ecm-production", {
    blocs: [[0, formule("production = biens (matériels) + services (immatériels)") + ex("Biens : chocolat, ciment, savon. Services : transport des tablettes, vente au supermarché, soins à l'hôpital.")],
      [2, def("Valeur ajoutée", "Richesse créée par une entreprise : valeur de ce qu'elle produit moins la valeur de ce qu'elle a acheté pour produire.") + formule("valeur ajoutée = valeur de la production − consommations intermédiaires") + ex("Une tablette vendue 1 000 F, fabriquée avec 400 F de fèves, de sucre et d'emballage : valeur ajoutée = 600 F, gardée au Cameroun au lieu de partir à l'étranger.", "Exemple chiffré")]],
    planches: [[2, { type: "2D", titre: "La valeur ajoutée, de la fève à la tablette", legende: "En exportant des fèves, la coopérative ne garde que la valeur du premier maillon ; en transformant elle-même, elle garde la valeur ajoutée de la chocolaterie et de la vente (exemple chiffré).", svg: barres("Valeur ajoutée par tablette (exemple)", [["Fèves, sucre, emballage", 400, "#8B5A2B", "400 F (achats)"], ["Tablette vendue", 1000, "#7A4A1E", "1 000 F"], ["Valeur ajoutée", 600, VERT, "600 F gardés sur place"]], "F", 170, "Barres : 400 F d’achats, tablette vendue 1 000 F, valeur ajoutée 600 F") }]],
    formules: [F("Qu'est-ce que produire ?", "production = biens + services", "tablette = bien ; transport et vente = services"), F("Les facteurs", "nature + travail + capital + esprit d'entreprise", "fèves ; ouvriers ; torréfacteur, broyeuse ; plan d'affaires"), F("Ce que rapporte la transformation", "valeur ajoutée = production − consommations intermédiaires", "1 000 − 400 = 600 F par tablette")]
  });
})();
