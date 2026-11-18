/* Leçons enrichies — lettres et langues, lot B (18/11/2026) : ESF, italien, chinois (1re), arabe (Tle). Même mécanisme que
   29-enrichies-lettres-a.js : AJOUTS SEULEMENT (blocs def / formule / ex / astuce, planches 2D, denouement.formules). */
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

  /* ═══════════ 1re ESF — NOTIONS ═══════════ */
  enrichir("1re-esf-notions", {
    blocs: [[0, def("Économie sociale et familiale", "Discipline qui apprend à gérer les ressources du foyer (argent, temps, nourriture, santé, logement) pour le bien-être de chacun de ses membres.") + formule("solde du mois = recettes − dépenses ; épargne = solde positif mis de côté") + ex("Chez les Abena : 120 000 − 130 000 = −10 000 F (déficit) → l'argent manque dès le 20 du mois.")],
      [1, ex("Acheter en gros au marché (sac de riz, bidon d'huile) plutôt qu'au détail chaque jour ; cuisiner les légumes de saison ; éteindre les ampoules inutiles.", "Bons gestes") + astuce("Écris le budget au début du mois et coche chaque dépense : on ne gère bien que ce que l'on note.")],
      [2, attention("On n'économise jamais sur la santé et sur une alimentation équilibrée : un enfant malade coûte bien plus cher qu'un repas complet.")]],
    planches: [[0, { type: "2D", titre: "Le cahier de budget des Abena", legende: "Le budget du mois écrit dans un cahier : à gauche les recettes, à droite les dépenses prévues et réelles. Le solde (recettes − dépenses) montre tout de suite si l'on peut épargner.", svg: (function () {
      var D = [["Nourriture", 55, 48], ["Loyer", 25, 25], ["Transport", 12, 10], ["Eau, électricité", 8, 7], ["Téléphone", 10, 5], ["Santé", 5, 5], ["Divers", 15, 9]], s = "<rect width='640' height='320' fill='#E9EEF4'/><rect x='30' y='14' width='580' height='292' rx='6' fill='#FFFBEA' stroke='#E3D7A6'/><path d='M320 14V306' stroke='#E3D7A6' stroke-width='3'/>";
      for (var k = 0; k < 11; k++) s += "<path d='M40 " + (60 + k * 22) + "H600' stroke='#D7E3F2'/>";
      s += txt(175, 40, "Recettes", { s: 15, c: VERT, i: true }) + txt(70, 82, "Salaire et petit commerce", { s: 13, a: "start", c: BLEU, i: true }) + txt(300, 82, "120 000 F", { s: 13, a: "end", c: BLEU, i: true });
      s += txt(465, 40, "Dépenses : avant → après", { s: 15, c: ROUGE, i: true });
      D.forEach(function (d, i) { var y = 82 + i * 22; s += txt(334, y, d[0], { s: 12, a: "start", c: BLEU, i: true }) + txt(520, y, d[1] + " 000", { s: 12, a: "end", c: GRIS, i: true }) + txt(596, y, d[2] + " 000", { s: 12, a: "end", c: d[2] < d[1] ? VERT : BLEU, i: true }); });
      s += "<path d='M334 246H600' stroke='" + NUIT + "'/>" + txt(334, 266, "Total", { s: 13, a: "start", i: true }) + txt(520, 266, "130 000", { s: 13, a: "end", c: ROUGE, i: true }) + txt(596, 266, "109 000", { s: 13, a: "end", c: VERT, i: true });
      s += "<rect x='54' y='200' width='240' height='80' rx='10' fill='#fff' stroke='" + VERT + "' stroke-width='2'/>" + txt(174, 226, "Solde = 120 000 − 109 000", { s: 13, c: NUIT }) + txt(174, 252, "= 11 000 F épargnés", { s: 15, c: VERT }) + txt(174, 272, "33 000 F par trimestre", { s: 11, c: GRIS, w: 600 });
      return svg(640, 320, "Cahier de budget : recettes 120 000 F, dépenses avant 130 000 F et après 109 000 F, épargne 11 000 F", "", s);
    })() }]],
    formules: [F("Faire le bilan", "solde = recettes − dépenses", "120 000 − 130 000 = −10 000 F : déficit"), F("Réduire sans nuire à la santé", "dépenses révisées = somme des postes après économies", "48 000 + 25 000 + 10 000 + 7 000 + 5 000 + 5 000 + 9 000 = 109 000 F"), F("Épargner pour la scolarité", "épargne = recettes − dépenses révisées ; × 3 pour un trimestre", "120 000 − 109 000 = 11 000 F/mois → 33 000 F/trimestre")]
  });

  /* ═══════════ 1re ESF — SIGNES D'ALARME ═══════════ */
  enrichir("1re-esf-alarme", {
    blocs: [[0, def("Fréquence respiratoire", "Nombre de respirations en une minute, comptées quand le bébé est calme, en regardant le ventre et la poitrine se soulever.") + formule("respiration rapide si : ≥ 60/min avant 2 mois · ≥ 50/min de 2 à 12 mois · ≥ 40/min de 1 à 5 ans")],
      [1, ex("Nina, 6 mois, 62 respirations par minute : 62 ≥ 50 → respiration rapide, signe de danger.<br>Un bébé de 3 semaines à 55 par minute : 55 < 60, pas de respiration rapide (mais on surveille les autres signes).") + ex("Fièvre : température ≥ 38 °C ; chez un bébé de moins de 2 mois, toute fièvre impose de consulter.", "Seuils") + astuce("Compte pendant une minute entière, montre en main, bébé éveillé et calme : compter 15 secondes et multiplier par 4 donne souvent une erreur.")],
      [2, methode("1. Repérer un signe de danger. 2. Partir tout de suite au centre de santé avec le carnet. 3. Pendant le trajet : garder le bébé au chaud, continuer à le faire téter s'il peut avaler. 4. Ne donner aucun remède sans avis.", "La conduite à tenir") + attention("Ne jamais donner de décoction, de purge ni de lavement à un nourrisson : ils peuvent aggraver la déshydratation ou l'empoisonner.")]],
    formules: [F("Compter la respiration", "respirations comptées pendant 1 minute entière", "Nina : 62 respirations par minute"), F("Comparer au seuil de son âge", "2 à 12 mois : respiration rapide si ≥ 50/min", "62 ≥ 50 → respiration rapide, avec creusement sous les côtes"), F("Décider", "un seul signe de danger = consulter immédiatement", "ne tète plus + fièvre + respiration rapide → départ immédiat avec le carnet")]
  });

  /* ═══════════ 1re ITALIEN — ACCORD ET DÉSACCORD ═══════════ */
  enrichir("1re-it-accordo", {
    blocs: [[0, formule("Sono d'accordo con te / con Lei / con voi") + def("Accordo", "Formules pour montrer qu'on partage l'avis de quelqu'un : <em>Sono d'accordo, Hai ragione, Certo, Esatto, Proprio così</em>.") + ex("— I giovani devono aiutare in casa. — Sono d'accordo con Lei, professoressa!")],
      [1, formule("Sì, però… · Da una parte…, dall'altra… · Non sono del tutto d'accordo") + ex("Da una parte i genitori decidono, dall'altra i figli devono poter parlare.<br>Non sono del tutto d'accordo : dipende dalla famiglia.") + astuce("Pour rester poli avec un adulte, utilise <em>Lei</em> (forme de politesse) et commence par une concession : <em>Capisco, però…</em>")],
      [2, attention("<em>Penso che</em> est suivi du <strong>subjonctif</strong> : penso che <strong>sia</strong> importante, penso che i genitori <strong>abbiano</strong> ragione (et non <em>hanno</em>).")]],
    planches: [[1, { type: "2D", titre: "De l'accord total au désaccord total", legende: "Une échelle pour choisir la bonne formule : plus on va vers la droite, plus on s'oppose. Au centre, les formules qui nuancent sont souvent les plus polies.", svg: (function () {
      var E = [["Sono pienamente d'accordo", "#2E7D32"], ["Hai ragione", "#5AA14A"], ["Sì, però…", "#B8860B"], ["Dipende", "#E8A33D"], ["Non sono del tutto d'accordo", "#C2540A"], ["Non sono d'accordo", "#C62828"]], s = "<rect width='640' height='220' fill='#FBF8F2'/><defs><linearGradient id='acG'><stop offset='0' stop-color='#2E7D32'/><stop offset='.5' stop-color='#E8A33D'/><stop offset='1' stop-color='#C62828'/></linearGradient></defs><rect x='30' y='100' width='580' height='14' rx='7' fill='url(#acG)'/>";
      E.forEach(function (e, i) { var x = 92 + i * 91; s += "<circle cx='" + x + "' cy='107' r='9' fill='#fff' stroke='" + e[1] + "' stroke-width='3'/>" + txt(x, i % 2 ? 150 : 76, e[0], { s: 11.5, c: e[1] }); });
      s += txt(50, 196, "😀 d'accord", { s: 12, a: "start", c: VERT }) + txt(320, 196, "nuancer", { s: 12, c: "#B8860B" }) + txt(600, 196, "pas d'accord 🙁", { s: 12, a: "end", c: ROUGE });
      return svg(640, 220, "Échelle des formules italiennes de l’accord total au désaccord total", "", s);
    })() }]],
    formules: [F("Exprimer un accord partiel", "Non sono del tutto d'accordo", "Non sono del tutto d'accordo con Lei, professoressa"), F("Nuancer poliment", "Da una parte…, dall'altra…", "Da una parte i genitori decidono, dall'altra i figli parlano"), F("Donner son opinion", "Penso che + subjonctif", "Penso che dipenda dalla famiglia")]
  });

  /* ═══════════ 1re ITALIEN — ADVERBES EN -MENTE ═══════════ */
  enrichir("1re-it-avverbi", {
    blocs: [[0, def("Avverbio", "Mot invariable qui précise un verbe, un adjectif ou un autre adverbe : il dit <em>comment</em> se fait l'action.") + formule("adjectif en -o → féminin -a + mente · adjectif en -e → + mente · -le / -re → on supprime le -e + mente") + ex("lento → lentamente · sicuro → sicuramente · veloce → velocemente · facile → facilmente · regolare → regolarmente")],
      [1, astuce("Si le mot précise un <strong>nom</strong>, c'est un adjectif (<em>un buon libro</em>) ; s'il précise un <strong>verbe</strong>, c'est un adverbe (<em>legge bene</em>).") + attention("<em>Molto</em> est adverbe devant un adjectif (invariable : <em>molto belle</em>) mais adjectif devant un nom (variable : <em>molte ragazze</em>).")],
      [2, ex("Ahmadou parla <strong>lentamente</strong> e risponde <strong>facilmente</strong> alle domande. Gioca <strong>bene</strong> a calcio.", "Phrase corrigée")]],
    planches: [[0, { type: "2D", titre: "Fabriquer un adverbe en -mente", legende: "Trois cas selon la fin de l'adjectif, plus quelques irréguliers à apprendre par cœur.", svg: colonnes("Aggettivo → avverbio", [{ t: "-o", c: BLEU, l: ["on passe au féminin -a", "lento → lentamente", "sicuro → sicuramente", "vero → veramente"] }, { t: "-e", c: VERT, l: ["on ajoute -mente", "veloce → velocemente", "forte → fortemente", "dolce → dolcemente"] }, { t: "-le / -re", c: "#C2540A", l: ["on supprime le -e", "facile → facilmente", "regolare → regolarmente", "gentile → gentilmente"] }, { t: "irréguliers", c: ROUGE, l: ["buono → bene", "cattivo → male", "migliore → meglio", "peggiore → peggio"] }], 210, "Tableau de formation des adverbes italiens en mente") }]],
    formules: [F("Adjectif en -o", "féminin en -a + mente", "lento → lenta → lentamente"), F("Adjectif en -e / -le", "+ mente (on supprime le -e après l ou r)", "veloce → velocemente · facile → facilmente"), F("Irrégulier", "buono → bene ; cattivo → male", "parla bene (et non buonamente)")]
  });

  /* ═══════════ 1re CHINOIS — 如果……就 ═══════════ */
  enrichir("1re-zh-ruguo", {
    blocs: [[0, def("Phrase conditionnelle", "La condition vient toujours <strong>en premier</strong> en chinois, la conséquence ensuite.") + ex("如果你累了，就休息一下。Rúguǒ nǐ lèi le, jiù xiūxi yíxià. — Si tu es fatigué, repose-toi un peu.") + astuce("就 se place <strong>après le sujet</strong> de la conséquence, juste avant le verbe : 我们<strong>就</strong>不去 (et non 就我们不去).")],
      [1, formule("如果 + condition，(那么) + sujet + 就 + verbe") + ex("如果明天不下雨，我们就去克里比。Rúguǒ míngtiān bú xià yǔ, wǒmen jiù qù Kèlǐbǐ. — S'il ne pleut pas demain, nous irons à Kribi.")],
      [2, formule("名词 + 有的 + A，有的 + B") + attention("有的 se place après le groupe dont on parle : 学生有的……（et non 有的学生有的……）.")]],
    planches: [[2, { type: "2D", titre: "有的……有的…… : partager un groupe", legende: "Les élèves du club : certains (有的) lisent, d'autres (有的) font du sport. 有的 répété découpe le groupe en sous-groupes.", svg: (function () {
      var s = "<rect width='640' height='240' fill='#FBF8F2'/><rect x='20' y='20' width='290' height='170' rx='14' fill='#DCE6F2'/><rect x='330' y='20' width='290' height='170' rx='14' fill='#DDEFE3'/>";
      [0, 1, 2].forEach(function (k) { s += perso(70 + k * 80, 50, "#5A3A1E", "#1E499B", "#2E3445") + "<rect x='" + (58 + k * 80) + "' y='86' width='24' height='18' fill='#F4F1EA' stroke='#9AA3AF'/>"; });
      [0, 1, 2].forEach(function (k) { s += perso(380 + k * 80, 50, "#6B4423", "#2E7D32", "#F4F1EA"); }); s += "<circle cx='600' cy='150' r='10' fill='#fff' stroke='#1F2328'/>";
      s += txt(165, 212, "有的喜欢看书", { s: 16, c: BLEU }) + txt(475, 212, "有的喜欢运动", { s: 16, c: VERT }) + txt(165, 232, "yǒude xǐhuan kàn shū : certains aiment lire", { s: 10, c: GRIS, w: 600 }) + txt(475, 232, "yǒude xǐhuan yùndòng : d'autres le sport", { s: 10, c: GRIS, w: 600 });
      return svg(640, 240, "Deux groupes d’élèves : certains lisent, d’autres font du sport, avec les phrases chinoises", "", s);
    })() }]],
    formules: [F("Condition en premier", "如果 + condition", "如果明天下雨 (s'il pleut demain)"), F("Conséquence avec 就", "sujet + 就 + verbe", "我们就不去 (nous n'irons pas)"), F("Partager un groupe", "groupe + 有的 A，有的 B", "学生有的坐车，有的走路")]
  });

  /* ═══════════ 1re CHINOIS — 不但……而且 ═══════════ */
  enrichir("1re-zh-budan", {
    blocs: [[0, def("不但……而且……", "Relie deux informations qui s'ajoutent, la seconde étant plus forte : « non seulement A, mais aussi B ».") + formule("sujet + 不但 + A，而且 + B (même sujet) · 不但 + sujet 1 + A，而且 + sujet 2 + B") + astuce("Même sujet : 不但 vient <strong>après</strong> le sujet (他不但会说……). Sujets différents : 不但 vient <strong>avant</strong> le premier sujet (不但他会说，而且我也会说).")],
      [1, attention("第 + nombre donne un ordinal : 第一 (premier), 第二 (deuxième). Sans 第, 一、二 sont de simples nombres.") + ex("第一，要努力学习；第二，要帮助家人；第三，要尊重老人。<br>Dì yī… dì èr… dì sān… — Premièrement… deuxièmement… troisièmement…")]],
    formules: [F("Ajouter une idée plus forte", "S + 不但 A，而且 B", "我的家人不但很热情，而且很团结"), F("Ordonner les arguments", "第一……，第二……，第三……", "第一，互相帮助；第二，尊重父母"), F("Écrire juste", "caractère + pinyin avec tons", "家 jiā · 帮助 bāngzhù · 尊重 zūnzhòng")]
  });

  /* ═══════════ Tle ARABE — LES TYPES DE خبر ═══════════ */
  enrichir("tle-ar-khabar", {
    blocs: [[0, def("La phrase nominale (الجملة الاسمية)", "Elle commence par un nom : le sujet (المبتدأ), puis l'attribut (الخبر) qui dit quelque chose de lui. Les deux sont مرفوع (cas sujet, en -u).") + formule("مبتدأ (مرفوع) + خبر (مرفوع) : الطالبُ مجتهدٌ") + ex("البيتُ كبيرٌ. — La maison est grande. · الشمسُ ساطعةٌ. — Le soleil brille.")],
      [1, ex("خبر مفرد : الجوُّ جميلٌ · خبر جملة فعلية : الأمُّ تطبخُ · خبر جملة اسمية : الطالبُ أبوه طبيبٌ · خبر شبه جملة : الكتابُ على الطاولةِ", "Un exemple par type") + astuce("Pour trouver le type, regarde ce qui suit le sujet : un seul mot → مفرد ; un verbe → جملة فعلية ; un nom + son attribut → جملة اسمية ; une préposition ou un adverbe de lieu → شبه جملة.")],
      [2, attention("Dans un خبر جملة, le pronom de rappel (الرابط) est obligatoire : الطالبُ أبوه طبيبٌ (ـه renvoie à الطالب).")]],
    planches: [[1, { type: "2D", titre: "Quatre types de خبر", legende: "Un exemple par type, à lire de droite à gauche : l'attribut (خبر) peut être un mot, une phrase verbale, une phrase nominale ou un groupe prépositionnel.", svg: colonnes("أنواع الخبر", [{ t: "مفرد", c: BLEU, l: ["un seul mot", "الجوُّ جميلٌ", "le temps est beau"] }, { t: "جملة فعلية", c: VERT, l: ["une phrase verbale", "الأمُّ تطبخُ", "la mère cuisine"] }, { t: "جملة اسمية", c: "#7B3F99", l: ["une phrase nominale", "الطالبُ أبوه طبيبٌ", "son père est médecin"] }, { t: "شبه جملة", c: "#C2540A", l: ["préposition / lieu", "الكتابُ على الطاولةِ", "le livre est sur la table"] }], 200, "Tableau des quatre types d’attribut en arabe avec un exemple chacun") }]],
    formules: [F("Repérer le sujet et l'attribut", "مبتدأ + خبر, tous deux مرفوع", "الجوُّ (مبتدأ) جميلٌ (خبر)"), F("Classer l'attribut", "un mot → مفرد ; phrase → جملة ; préposition / lieu → شبه جملة", "على الطاولةِ → خبر شبه جملة ; تطبخُ → خبر جملة فعلية"), F("Vérifier le lien", "خبر جملة + pronom de rappel الرابط", "الطالبُ أبوه طبيبٌ : ـه = الطالب")]
  });

  /* ═══════════ Tle ARABE — LAZIM ET MUTA'ADDI ═══════════ */
  enrichir("tle-ar-verbes", {
    blocs: [[0, def("الفعل اللازم", "Verbe dont l'action reste sur le sujet : il n'a pas de complément d'objet direct. Pour indiquer un lieu ou une personne, on passe par une préposition.") + formule("فعل لازم + فاعل (+ حرف جرّ + اسم مجرور)") + ex("جلسَ الولدُ على الكرسيِّ. · ذهبَ الطالبُ إلى المدرسةِ. · نامَ الطفلُ.")],
      [1, formule("فعل متعدٍّ + فاعل (مرفوع) + مفعول به (منصوب)") + ex("كتبَ الطالبُ الدرسَ. · قرأتْ فاطمةُ الكتابَ. · أعطى الأبُ الولدَ كتاباً (deux compléments).") + astuce("Test : peut-on demander « quoi ? » ou « qui ? » directement après le verbe, sans préposition ? Oui → متعدٍّ ; non → لازم.")],
      [2, attention("La forme IV (أفعلَ) et la forme II (فعّلَ) rendent souvent un verbe transitif : جلسَ → أجلسَ ، فرحَ → فرّحَ.")]],
    planches: [[1, { type: "2D", titre: "لازم ou متعدٍّ : le tri des verbes d'Ibrahim", legende: "À gauche, les verbes dont l'action reste sur le sujet (complément seulement avec une préposition) ; à droite, ceux qui reçoivent un complément d'objet direct au cas direct.", svg: colonnes("اللازم والمتعدي", [{ t: "لازم (intransitif)", c: BLEU, l: ["جلسَ : s'asseoir", "ذهبَ : aller (إلى)", "نامَ : dormir", "→ ذهبَ الطالبُ إلى المدرسةِ"] }, { t: "متعدٍّ (transitif)", c: "#C2540A", l: ["كتبَ : écrire", "قرأَ : lire", "أعطى : donner (2 compléments)", "→ كتبَ الطالبُ الدرسَ"] }], 200, "Tableau : verbes intransitifs et transitifs arabes avec exemples") }]],
    formules: [F("Tester le verbe", "complément direct possible ? oui → متعدٍّ ; non → لازم", "ذهبَ : non → لازم ; كتبَ : oui → متعدٍّ"), F("Corriger avec une préposition", "لازم + إلى / على / في + اسم مجرور", "ذهبَ الطالبُ إلى المدرسةِ"), F("Rendre transitif", "forme IV أفعلَ + مفعول به", "أجلسَ الأبُ الولدَ")]
  });
})();
