/* Leçons APPROFONDIES — lot 11, classe d'examen de 1re (18/11/2026) : économie sociale et familiale (notions, signes
   d'alarme chez le nourrisson) et italien (adverbes en -mente, accord et désaccord). Même gabarit et même mécanisme que
   11-approfondies-lot4.js (remplacement EN PLACE ; ordre, clé, fiche APC, examen et scènes conservés). Les classes de
   6e, 5e et 4e sont traitées par une autre session (16-approfondies-premier-cycle.js). Simulations VRT_A en fin de fichier. */
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

  /* ═══════════════════════ 1re ESF — NOTIONS SUR L'ÉCONOMIE SOCIALE ET FAMILIALE ═══════════════════════ */
  var EN_OLD = ancien("1re-esf-notions");
  var POSTES = [["Nourriture", 55000, 48000, "#C2540A"], ["Loyer", 25000, 25000, "#5C6478"], ["Transport", 12000, 10000, "#1E88E5"], ["Eau, électricité", 8000, 8000, "#2E7D32"], ["Téléphone (crédit)", 10000, 5000, "#7B3F99"], ["Santé", 5000, 5000, "#C62828"], ["Divers", 15000, 8000, "#B07A00"]];
  function maison3D() {
    var o = [], toit = [0, 110, 0];
    o.push({ f: "boite", c: [0, -10, 0], d: [520, 8, 320], coul: "#A9B46A", dessus: "#BCC77A" });
    o.push({ f: "boite", c: [0, -2, 0], d: [380, 6, 220], coul: "#C9B28A", dessus: "#D9C49C", div: false });
    o.push({ f: "boite", c: [0, 4, 110], d: [380, 90, 6], coul: "#E9E2D2", div: false });
    o.push({ f: "boite", c: [-190, 4, 0], d: [6, 90, 220], coul: "#E9E2D2", div: false });
    o.push({ f: "boite", c: [190, 4, 0], d: [6, 90, 220], coul: "#E9E2D2", div: false });
    o.push({ f: "boite", c: [0, 4, 0], d: [4, 90, 220], coul: "#DDD5C2", div: false });
    o.push({ f: "boite", c: [-95, 4, 0], d: [190, 90, 4], coul: "#DDD5C2", div: false });
    /* cuisine : table, marmite, foyer */
    o.push({ f: "boite", c: [-120, 4, -60], d: [80, 30, 40], coul: "#8B5A2B", dessus: "#A8703A", div: false });
    o.push({ f: "cylindre", c: [-120, 34, -60], r: 14, h: 16, n: 18, coul: "#5C6478", dessus: "#8E96A6" });
    o.push({ f: "sphere", c: [-60, 12, -70], r: 10, coul: "#E8492E" }); o.push({ f: "sphere", c: [-48, 12, -64], r: 9, coul: "#F2C94C" });
    /* chambre de l'enfant : lit, berceau */
    o.push({ f: "boite", c: [-110, 4, 55], d: [90, 22, 50], coul: "#F4EFE4", dessus: "#9FC5E8", div: false });
    o.push({ f: "boite", c: [-40, 4, 70], d: [36, 26, 26], coul: "#C9A576", dessus: "#F4EFE4", div: false });
    /* salon : table, cahier de comptes, pagnes et machine à coudre */
    o.push({ f: "boite", c: [90, 4, -40], d: [90, 28, 50], coul: "#6B4423", dessus: "#8B5A2B", div: false });
    o.push({ f: "boite", c: [80, 32, -40], d: [36, 2, 26], coul: "#FBF8F2", div: false });
    o.push({ f: "boite", c: [120, 32, -36], d: [18, 6, 12], coul: "#2E7D32", div: false });
    o.push({ f: "boite", c: [110, 4, 60], d: [60, 30, 36], coul: "#5D3A1E", dessus: "#7A5230", div: false });
    o.push({ f: "boite", c: [110, 34, 60], d: [40, 22, 14], coul: "#1F2328", dessus: "#3A4048", div: false });
    o.push({ f: "boite", c: [160, 4, 60], d: [30, 40, 30], coul: "#C2540A", dessus: "#F2994A", div: false });
    /* toit amovible */
    o.push({ f: "poly", pts: [[-200, 94, 120], [200, 94, 120], [200, 150, 0], [-200, 150, 0]], coul: "#8E96A6", ec: toit });
    o.push({ f: "poly", pts: [[-200, 94, -120], [-200, 150, 0], [200, 150, 0], [200, 94, -120]], coul: "#A7AEB9", ec: toit });
    return o;
  }
  remplacer("1re-esf-notions", {
    c: "1re A", m: "esf", titre: "Notions sur l'économie sociale et familiale", duree: 30,
    accroche: "Le 20 du mois, plus d'argent chez les Abena. Gagner plus, ou gérer mieux ?",
    intro: "Le budget d'une famille d'Ebolowa te sert de fil rouge : à chaque partie, un indice t'aide à trancher entre trois solutions.",
    objectifs: ["définir l'économie sociale et familiale à partir de ses trois mots", "citer ses domaines (budget, alimentation, santé, habitat et vêtement)", "établir et réviser un budget familial", "mesurer l'impact concret d'une bonne gestion du foyer"],
    enquete: {
      titre: "Le budget de la famille Abena",
      svg: svg(640, 220, "Une mère compte de l argent à une table avec un cahier de comptes ; à côté, un calendrier où le 20 est entouré", "", "<rect width='640' height='220' fill='#F4EFE4'/><rect x='170' y='130' width='300' height='14' fill='#8B5A2B'/><path d='M190 144v60M450 144v60' stroke='#6B4423' stroke-width='7'/><rect x='250' y='112' width='90' height='18' fill='#FBF8F2' stroke='#C9C1B2'/><path d='M258 118h70M258 124h52' stroke='#C9C1B2'/><rect x='360' y='116' width='40' height='14' rx='2' fill='#2E7D32'/><rect x='366' y='110' width='40' height='14' rx='2' fill='#1E88E5'/>" + perso(300, 46, "#5A3A1E", "#C2540A", "#7B3F99") + "<rect x='510' y='40' width='100' height='110' rx='6' fill='#fff' stroke='#C9D2E3'/><rect x='510' y='40' width='100' height='22' rx='6' fill='" + ROUGE + "'/>" + txt(560, 56, "NOVEMBRE", { s: 10.5, c: "#fff" }) + Array.apply(null, Array(28)).map(function (_, k) { var d = k + 1, x = 520 + (k % 7) * 13, y = 78 + Math.floor(k / 7) * 18; return txt(x + 4, y, d, { s: 8.5, w: 500 }) + (d === 20 ? "<circle cx='" + (x + 4) + "' cy='" + (y - 3) + "' r='7' fill='none' stroke='" + ROUGE + "' stroke-width='2'/>" : ""); }).join("") + bulle(40, 40, 170, "Plus rien le 20 !", ROUGE)),
      legende: "À Ebolowa : Mama Abena, commerçante, et ses quatre enfants ; sa fille Brigitte est en 1re A et suit l'ESF.",
      contexte: "<p>Le foyer dispose de <strong>120 000 F par mois</strong>. Chaque mois, l'argent est épuisé vers le 20 ; la scolarité du trimestre prochain n'est pas prévue. L'oncle conseille : « Il faut gagner plus, c'est tout. » La voisine : « Mangez moins, supprimez la viande et le poisson. » Brigitte propose d'appliquer ce qu'elle apprend en économie sociale et familiale.</p>",
      documents: [{ t: "Les dépenses d'un mois chez les Abena", html: "<table class='donnees'><tr><th>Poste</th><th>Montant (F)</th></tr>" + POSTES.map(function (p) { return "<tr><td>" + p[0] + "</td><td>" + p[1].toLocaleString("fr-FR") + "</td></tr>"; }).join("") + "<tr><th>Total</th><th>130 000</th></tr></table>" }],
      question: "Comment la famille Abena peut-elle finir le mois et épargner pour la scolarité ?",
      tache: "Établis le budget révisé du foyer et explique, en huit lignes, ce que l'ESF apporte à la famille.",
      hypotheses: ["La seule solution est de gagner plus d'argent.", "Il faut réduire fortement la nourriture, même au détriment de l'équilibre des repas.", "Il faut gérer : prévoir un budget, acheter malin sans déséquilibrer les repas, prévenir les maladies et épargner chaque mois."]
    },
    parties: [
      { t: "Trois mots", html: partie(EN_OLD, 0),
        fil: { html: "<p>« Économie » vient de <em>oikos</em>, la maison : l'ESF ne demande pas d'abord de gagner plus, mais de <strong>bien gérer</strong> ce dont le foyer dispose. Le problème des Abena n'est pas seulement un manque de revenu : 130 000 F dépensés pour 120 000 F reçus.</p>", verdicts: [[0, "rejetee", "Même à revenu égal, une meilleure gestion supprime le déficit."]] },
        retenir: "Gérer au mieux les ressources du foyer pour le bien-être de chacun." },
      { t: "Ses domaines", html: partie(EN_OLD, 1),
        planches: [{ type: "3d", titre: "Une maison, quatre domaines de l'ESF", legende: "Soulève le toit : la cuisine (alimentation), la chambre de l'enfant (santé, puériculture), le salon avec le cahier de comptes (budget) et la machine à coudre avec les pagnes (habitat et vêtement).",
          modele: { h: 360, rx: -34, ry: 22, echelle: 0.85, alt: "Maison en coupe avec une cuisine, une chambre d enfant et un salon, toit de tôle amovible", eclate: "Soulever le toit", jouer: "Soulever le toit", objets: maison3D(),
            etiquettes: [{ p: [-120, 50, -60], t: "Alimentation" }, { p: [-60, 34, 60], t: "Santé, puériculture" }, { p: [80, 36, -40], t: "Budget", cote: "d" }, { p: [110, 50, 60], t: "Habitat et vêtement", cote: "d" }] } }],
        fil: { html: "<p>Supprimer la viande et le poisson déséquilibrerait les repas des enfants (domaine alimentation) et risquerait de les rendre malades (domaine santé) : une économie qui coûterait cher. L'ESF regarde tous les domaines ensemble.</p>", verdicts: [[1, "rejetee", "Des repas déséquilibrés nuisent à la santé : l'économie serait illusoire."]] },
        retenir: "Budget, alimentation, santé, habitat et vêtement." },
      { t: "Un impact concret", html: partie(EN_OLD, 2),
        planches: [{ type: "2D", titre: "Le budget des Abena, avant et après", legende: "Avant : 130 000 F de dépenses pour 120 000 F de revenu, soit 10 000 F de déficit. Après : achats groupés au marché, crédit téléphonique réduit, divers limités : 109 000 F, et 11 000 F d'épargne chaque mois.", svg: (function () {
          var s = "", K = 470 / 130000;
          [["Avant", 1, 60], ["Après", 2, 150]].forEach(function (r) {
            var x = 110; s += txt(100, r[2] + 28, r[0], { s: 14, a: "end" });
            POSTES.forEach(function (p) { var w = p[r[1]] * K; s += "<rect x='" + x + "' y='" + r[2] + "' width='" + (w - 1) + "' height='42' fill='" + p[3] + "'/>" + (w > 48 ? txt(x + w / 2, r[2] + 26, Math.round(p[r[1]] / 1000) + " k", { s: 11, c: "#fff" }) : ""); x += w; });
            if (r[1] === 2) s += "<rect x='" + x + "' y='" + r[2] + "' width='" + (11000 * K) + "' height='42' fill='none' stroke='" + VERT + "' stroke-width='2.5' stroke-dasharray='5 4'/>" + txt(x + 5.5 * 1000 * K, r[2] + 62, "épargne", { s: 11, c: VERT });
          });
          s += "<path d='M" + (110 + 120000 * K) + " 40V210' stroke='" + NUIT + "' stroke-width='2' stroke-dasharray='5 4'/>" + txt(110 + 120000 * K, 30, "revenu : 120 000 F", { s: 11.5 }) + txt(110 + 130000 * K - 4, 120, "−10 000", { s: 11, c: ROUGE, a: "end" });
          POSTES.forEach(function (p, i) { var xx = 30 + (i % 4) * 150, yy = 236 + Math.floor(i / 4) * 20; s += "<rect x='" + xx + "' y='" + (yy - 10) + "' width='12' height='12' rx='3' fill='" + p[3] + "'/>" + txt(xx + 18, yy, p[0], { s: 10.5, a: "start", w: 600 }); });
          return svg(640, 280, "Deux barres de budget : avant, les dépenses dépassent le revenu ; après, elles sont en dessous et laissent une épargne", "", s);
        })() }],
        fil: { html: "<p>Les économies portent sur ce qui ne nuit à personne : achats groupés de vivres au marché (sans supprimer les protéines), crédit téléphonique, dépenses diverses. Le foyer finit le mois et met de côté 11 000 F, soit 33 000 F par trimestre pour la scolarité.</p>", verdicts: [[2, "validee", "Budget prévu, achats malins, repas équilibrés, épargne régulière."]] },
        retenir: "Un foyer bien géré dépense moins, mange mieux, épargne." }
    ],
    denouement: {
      titre: "Le budget révisé de Brigitte",
      etapes: ["L'ESF, c'est d'abord gérer (indice 1).", "Tous les domaines ensemble : pas d'économie sur la santé (indice 2).", "Budget révisé : 109 000 F de dépenses, 11 000 F d'épargne par mois (indice 3)."],
      reponse: "<p>Brigitte explique que l'économie sociale et familiale apprend à gérer au mieux les ressources du foyer pour le bien-être de chacun. Le problème n'est pas seulement de gagner plus : la famille dépense 130 000 F pour 120 000 F reçus. Supprimer la viande et le poisson serait une fausse économie, car des repas déséquilibrés rendraient les enfants malades. Brigitte propose plutôt un budget écrit chaque début de mois, des achats groupés au marché (48 000 F au lieu de 55 000 F), un crédit téléphonique limité, moins de dépenses diverses et un trajet mieux organisé. Les dépenses tombent à 109 000 F : la famille finit le mois et épargne 11 000 F, soit 33 000 F par trimestre pour la scolarité.</p>",
      transfert: "<p>Établis le budget d'un repas familial pour six personnes avec les prix du marché de ton quartier, en respectant un repas équilibré (féculent, légume, protéine, fruit).</p>"
    },
    revision: (EN_OLD ? EN_OLD.revision : []).concat(["Budget : recettes − dépenses ; prévoir, épargner.", "Une économie qui nuit à la santé est une fausse économie."]),
    exo: EN_OLD ? EN_OLD.exo : "",
    quiz: [
      q("« Oikos » signifie…", "la maison", "la règle", "l'argent", "Économie = règle de la maison."),
      q("Lequel n'est pas un domaine de l'ESF ?", "l'astronomie", "le budget", "l'alimentation", "Budget, alimentation, santé, habitat et vêtement."),
      q("Épargner pour la scolarité relève…", "du budget", "de la couture", "de la puériculture", "Prévoir et mettre de côté."),
      q("Revenu 120 000 F, dépenses 130 000 F : le solde est…", "−10 000 F", "+10 000 F", "250 000 F", "Déficit."),
      q("Une bonne économie sur l'alimentation consiste à…", "acheter groupé sans déséquilibrer les repas", "supprimer les protéines", "ne manger qu'une fois par jour", "Pas au détriment de la santé."),
      q("11 000 F épargnés par mois font par trimestre…", "33 000 F", "11 000 F", "110 000 F", "3 × 11 000."),
      q("La puériculture concerne…", "les soins aux jeunes enfants", "les personnes âgées", "la couture", "Domaine santé."),
      q("La gérontologie concerne…", "les personnes âgées", "les nourrissons", "le budget", "Domaine santé."),
      q("Un métier préparé par l'ESF :", "conseiller en économie familiale", "pilote d'avion", "géomètre", "Aussi restauration, couture, puériculture."),
      q("Le premier outil de gestion du foyer est…", "un budget écrit", "un crédit bancaire", "une tontine seulement", "Prévoir recettes et dépenses.")
    ]
  });

  /* ═══════════════════════ 1re ESF — LES SIGNES D'ALARME CHEZ LE NOURRISSON ═══════════════════════ */
  var EA_OLD = ancien("1re-esf-alarme");
  /* nourrisson couché sur le dos, vu de dessus, sur sa couverture ; etat : normal, pleure, mou, conv, fievre, jaune, vomit, pli, resp, biberon */
  function bebe(x, y, s, etat) {
    etat = etat || "normal";
    var jaune = etat === "jaune", peau = jaune ? "url(#bbJaune)" : "url(#bbPeau)", trait = "#3B2414", body = "#F7E7A6", ombreBody = "#E3CF86";
    var d = "<defs><radialGradient id='bbPeau' cx='40%' cy='35%' r='70%'><stop offset='0' stop-color='#A8724A'/><stop offset='.6' stop-color='#8A5A36'/><stop offset='1' stop-color='#6B4423'/></radialGradient>" +
      "<radialGradient id='bbJaune' cx='40%' cy='35%' r='70%'><stop offset='0' stop-color='#C9A04A'/><stop offset='.6' stop-color='#A8803A'/><stop offset='1' stop-color='#86642A'/></radialGradient>" +
      "<linearGradient id='bbCouv' x1='0' y1='0' x2='1' y2='1'><stop offset='0' stop-color='#DDEBF7'/><stop offset='1' stop-color='#BFD6EC'/></linearGradient></defs>";
    var t = "<g transform='translate(" + x + " " + y + ") scale(" + (s || 1) + ")'>" + d + "<rect x='-54' y='-58' width='108' height='124' rx='16' fill='url(#bbCouv)'/>";
    for (var k = -40; k <= 40; k += 20) t += "<path d='M" + k + " -56V64' stroke='#fff' stroke-width='2' opacity='.5'/>";
    var mou = etat === "mou", conv = etat === "conv";
    function membre(pts, c, w) { return "<path d='M" + pts.map(function (q) { return q.join(" "); }).join("L") + "' stroke='" + c + "' stroke-width='" + w + "' stroke-linecap='round' stroke-linejoin='round' fill='none'/>"; }
    /* jambes */
    var J = mou ? [[[-10, 30], [-14, 50], [-15, 60]], [[10, 30], [14, 50], [15, 60]]] : conv ? [[[-10, 30], [-16, 52], [-20, 62]], [[10, 30], [16, 52], [20, 62]]] : [[[-10, 30], [-28, 44], [-20, 56]], [[10, 30], [28, 44], [20, 56]]];
    J.forEach(function (j) { t += membre(j, ombreBody, 13) + membre(j, body, 11) + "<ellipse cx='" + j[2][0] + "' cy='" + (j[2][1] + 3) + "' rx='5.5' ry='4' fill='" + peau + "'/>"; });
    /* bras */
    var B = mou ? [[[-18, -2], [-26, 16], [-28, 30]], [[18, -2], [26, 16], [28, 30]]] : conv ? [[[-18, -2], [-36, -10], [-46, -20]], [[18, -2], [36, -10], [46, -20]]] : [[[-18, -2], [-32, 6], [-30, -14]], [[18, -2], [32, 6], [30, -14]]];
    B.forEach(function (j) { t += membre(j, ombreBody, 10) + membre(j, body, 8) + "<circle cx='" + j[2][0] + "' cy='" + j[2][1] + "' r='4.6' fill='" + peau + "'/>"; });
    if (conv) t += "<path d='M-52 -24l4 -4l3 5M48 -28l4 -4l3 5M-26 66l3 4l4 -3M22 68l3 4l4 -3' stroke='" + ROUGE + "' stroke-width='1.8' fill='none'/>";
    /* corps en grenouillère */
    t += "<ellipse cx='0' cy='12' rx='22' ry='25' fill='" + ombreBody + "'/><ellipse cx='-1' cy='10' rx='20' ry='23' fill='" + body + "'/><circle cx='0' cy='0' r='1.6' fill='#C9B26A'/><circle cx='0' cy='9' r='1.6' fill='#C9B26A'/><circle cx='0' cy='18' r='1.6' fill='#C9B26A'/>";
    if (etat === "resp") t += "<path d='M-14 16q6 4 12 0M2 16q6 4 12 0' stroke='" + ROUGE + "' stroke-width='2' fill='none'/><path d='M-26 4q-6 6 0 12M26 4q6 6 0 12M-31 2q-8 8 0 16M31 2q8 8 0 16' stroke='" + ROUGE + "' stroke-width='1.6' fill='none' opacity='.8'/>";
    if (etat === "pli") t += "<path d='M-8 14q8 -10 16 0' stroke='#8A5A36' stroke-width='5' fill='none' stroke-linecap='round'/><path d='M-6 8l-6 -6M6 8l6 -6' stroke='" + GRIS + "' stroke-width='1.6'/>";
    /* tête */
    t += "<rect x='-6' y='-14' width='12' height='8' fill='" + peau + "'/><circle cx='-19' cy='-30' r='4.5' fill='" + peau + "'/><circle cx='19' cy='-30' r='4.5' fill='" + peau + "'/><circle cx='0' cy='-30' r='19' fill='" + peau + "'/>";
    [[-10, -46], [-4, -48], [2, -48], [8, -46], [-14, -42], [13, -42], [-1, -44]].forEach(function (c) { t += "<circle cx='" + c[0] + "' cy='" + c[1] + "' r='3.4' fill='#1B1410'/>"; });
    var oeil = jaune ? "#F2D96B" : "#FFFFFF";
    if (etat === "pleure" || etat === "resp" || etat === "biberon") t += "<path d='M-12 -32q5 4 10 0M2 -32q5 4 10 0' stroke='" + trait + "' stroke-width='2' fill='none' stroke-linecap='round'/>";
    else if (mou) t += "<path d='M-12 -30q5 2 10 0M2 -30q5 2 10 0' stroke='" + trait + "' stroke-width='2' fill='none' stroke-linecap='round'/><path d='M-12 -31h10M2 -31h10' stroke='" + trait + "' stroke-width='1' opacity='.6'/>";
    else if (conv) t += "<ellipse cx='-7' cy='-31' rx='4.4' ry='3.6' fill='" + oeil + "' stroke='" + trait + "'/><ellipse cx='7' cy='-31' rx='4.4' ry='3.6' fill='" + oeil + "' stroke='" + trait + "'/><circle cx='-7' cy='-34' r='1.6' fill='" + trait + "'/><circle cx='7' cy='-34' r='1.6' fill='" + trait + "'/>";
    else t += "<ellipse cx='-7' cy='-31' rx='4' ry='3.6' fill='" + oeil + "'/><ellipse cx='7' cy='-31' rx='4' ry='3.6' fill='" + oeil + "'/><circle cx='-6.5' cy='-30.5' r='2.4' fill='" + trait + "'/><circle cx='7.5' cy='-30.5' r='2.4' fill='" + trait + "'/><circle cx='-5.8' cy='-31.4' r='.8' fill='#fff'/><circle cx='8.2' cy='-31.4' r='.8' fill='#fff'/>";
    if (etat === "pli") t += "<path d='M-12 -26q5 3 10 0M2 -26q5 3 10 0' stroke='#4A2E18' stroke-width='2' fill='none' opacity='.7'/>";
    t += "<path d='M-1.5 -24q1.5 2 3 0' stroke='" + trait + "' stroke-width='1.3' fill='none'/>";
    if (etat === "pleure" || etat === "resp") t += "<ellipse cx='0' cy='-17' rx='5' ry='4' fill='#7A1F1F'/><path d='M-12 -28q-2 6 0 9M12 -28q2 6 0 9' stroke='#5BA3D9' stroke-width='2' fill='none'/>";
    else if (etat === "biberon") t += "<path d='M-4 -18h8' stroke='" + trait + "' stroke-width='2' stroke-linecap='round'/>";
    else if (mou || conv) t += "<ellipse cx='0' cy='-18' rx='3' ry='2' fill='#5A2A1A'/>";
    else t += "<path d='M-5 -19q5 4 10 0' stroke='" + trait + "' stroke-width='1.6' fill='none' stroke-linecap='round'/>";
    if (etat === "fievre") t += "<ellipse cx='-12' cy='-23' rx='5' ry='3' fill='#E8492E' opacity='.55'/><ellipse cx='12' cy='-23' rx='5' ry='3' fill='#E8492E' opacity='.55'/><path d='M16 -44q2 4 0 6q-2 -2 0 -6M-18 -40q2 4 0 6q-2 -2 0 -6' fill='#9FD4F2'/>";
    else if (!jaune) t += "<ellipse cx='-12' cy='-23' rx='4' ry='2.4' fill='#C9746A' opacity='.35'/><ellipse cx='12' cy='-23' rx='4' ry='2.4' fill='#C9746A' opacity='.35'/>";
    if (etat === "vomit") t += "<path d='M4 -16q10 6 22 2q8 4 14 -2q-6 10 -20 10q-12 0 -16 -10Z' fill='#F4F1E6' stroke='#D9D2BC'/>";
    return t + "</g>";
  }
  var SIGNES = [["Ne peut plus téter ni boire", "biberon"], ["Vomit tout ce qu'il prend", "vomit"], ["Convulsions", "conv"], ["Anormalement mou, somnolent", "mou"], ["Respire très vite, creusement sous les côtes", "resp"], ["Forte fièvre ou corps froid", "fievre"], ["Diarrhée, yeux enfoncés, pli cutané", "pli"], ["Peau ou yeux jaunes (jaunisse)", "jaune"]];
  function table3D() {
    var o = [];
    o.push({ f: "boite", c: [0, -10, 0], d: [460, 8, 240], coul: "#7A4A22", dessus: "#A8703A" });
    o.push({ f: "boite", c: [-110, -2, -10], d: [100, 6, 140], coul: "#2E7D32", dessus: "#3E9B44", div: false });
    o.push({ f: "boite", c: [-110, 4, -10], d: [86, 1, 120], coul: "#F4EFE4", div: false });
    o.push({ f: "boite", c: [-110, 5, -40], d: [60, 1, 6], coul: "#C62828", div: false });
    o.push({ f: "cylindre", c: [30, -2, 20], r: 16, h: 70, n: 22, coul: "#E8F4FA", dessus: "#FFFFFF", op: 0.85 });
    o.push({ f: "cylindre", c: [30, 68, 20], r: 12, r2: 5, h: 22, n: 18, coul: "#E3C79C" });
    o.push({ f: "cylindre", c: [130, 2, -40], r: 3.5, h: 90, n: 10, axe: "x", coul: "#E8F4FA", op: 0.9 });
    o.push({ f: "sphere", c: [130, 6, -40], r: 4.5, coul: "#C62828" });
    o.push({ f: "boite", c: [130, -2, 60], d: [80, 14, 50], coul: "#C2540A", dessus: "#F2994A", div: false });
    return o;
  }
  remplacer("1re-esf-alarme", {
    c: "1re A", m: "esf", titre: "Les signes d'alarme chez le nourrisson", duree: 30,
    accroche: "Nina, 4 mois, ne tète plus et respire vite. La voisine propose une décoction et d'attendre demain. Toi, tu fais quoi ?",
    intro: "Une soirée de garde de ta petite sœur te sert de fil rouge : à chaque partie, un indice t'aide à trancher entre trois décisions.",
    objectifs: ["reconnaître un nourrisson en bonne santé", "identifier les signes de danger qui imposent de consulter", "compter la fréquence respiratoire et la comparer au seuil", "savoir quoi faire et quoi éviter en attendant les soins"],
    enquete: {
      titre: "La garde de Nina à Bertoua",
      svg: svg(640, 220, "Une adolescente veille sur un nourrisson couché qui pleure, une voisine tend une calebasse", "", "<rect width='640' height='220' fill='#EEF2F8'/><rect y='180' width='640' height='40' fill='#C9B28A'/>" + bebe(300, 116, 0.95, "pleure") + perso(150, 86, "#5A3A1E", "#F7C948", "#1E499B") + perso(480, 86, "#6B4423", "#7B3F99", "#7B3F99") + "<path d='M500 128q20 -6 30 6q-6 14 -24 10Z' fill='#B9824A'/>" + bulle(410, 30, 210, "Une décoction, et on attend…", "#7B3F99") + bulle(60, 30, 180, "Elle ne tète plus…", BLEU)),
      legende: "À Bertoua : la maman de Nina est au marché ; Clarisse, élève de 1re A, garde sa petite sœur de 4 mois.",
      contexte: "<p>En fin d'après-midi, Nina refuse le biberon de lait maternel tiré, est très chaude et respire vite : Clarisse compte <strong>62 respirations en une minute</strong> et voit sa peau se creuser sous les côtes à chaque inspiration. La voisine propose une <strong>décoction de feuilles</strong> et dit qu'il faut « attendre que la maman rentre demain matin ». Le centre de santé est à quinze minutes en moto-taxi.</p>",
      documents: [{ t: "Seuils de respiration rapide (OMS, prise en charge de l'enfant malade)", html: "<table class='donnees'><tr><th>Âge</th><th>Respiration rapide si…</th></tr><tr><td>moins de 2 mois</td><td>60 par minute ou plus</td></tr><tr><td>2 à 12 mois</td><td>50 par minute ou plus</td></tr><tr><td>1 à 5 ans</td><td>40 par minute ou plus</td></tr></table>" }],
      question: "Nina présente-t-elle des signes de danger, et que doit faire Clarisse ?",
      tache: "Rédige la conduite à tenir de Clarisse, étape par étape, en justifiant chaque décision par un signe observé.",
      hypotheses: ["Attendre le retour de la maman demain matin.", "Donner la décoction de la voisine pour faire baisser la fièvre.", "Nina a plusieurs signes de danger : partir immédiatement au centre de santé avec le carnet, sans donner de décoction."]
    },
    parties: [
      { t: "Un bébé bien portant", html: partie(EA_OLD, 0),
        planches: [{ type: "2D", titre: "La courbe de poids du carnet de santé", legende: "Dans le carnet de santé, le poids de l'enfant est reporté à chaque pesée : la courbe doit monter régulièrement entre les deux courbes de référence. Une courbe qui stagne ou qui baisse doit faire consulter.", svg: (function () {
          var X = function (m) { return 60 + m * 46; }, Y = function (kg) { return 250 - (kg - 2) * 26; }, ref1 = "", ref2 = "", bebeC = "", m;
          var P1 = [2.5, 3.4, 4.3, 5.0, 5.6, 6.1, 6.5, 6.9, 7.2, 7.5, 7.7, 8.0, 8.2], P2 = [4.3, 5.6, 6.8, 7.7, 8.4, 9.0, 9.5, 9.9, 10.3, 10.6, 10.9, 11.2, 11.5], B = [3.3, 4.4, 5.5, 6.3, 6.8];
          for (m = 0; m <= 12; m++) { ref1 += (m ? "L" : "M") + X(m) + " " + Y(P1[m]); ref2 += (m ? "L" : "M") + X(m) + " " + Y(P2[m]); }
          var s = "<rect width='640' height='290' fill='#FBF8F2'/><path d='" + ref2 + "L" + X(12) + " " + Y(P1[12]) + P1.slice().reverse().map(function (v, i) { return "L" + X(12 - i) + " " + Y(v); }).join("") + "Z' fill='#DCEFE0'/><path d='" + ref1 + "' stroke='#2E7D32' fill='none' stroke-width='1.5'/><path d='" + ref2 + "' stroke='#2E7D32' fill='none' stroke-width='1.5'/>";
          for (m = 0; m <= 12; m++) s += "<path d='M" + X(m) + " 254v6' stroke='" + NUIT + "'/>" + (m % 2 ? "" : txt(X(m), 274, m, { s: 10.5, w: 500, c: GRIS }));
          for (m = 2; m <= 12; m += 2) s += "<path d='M56 " + Y(m) + "h6' stroke='" + NUIT + "'/>" + txt(50, Y(m) + 4, m + " kg", { s: 10, w: 500, c: GRIS, a: "end" });
          B.forEach(function (v, i) { bebeC += (i ? "L" : "M") + X(i) + " " + Y(v); });
          s += "<path d='" + bebeC + "' stroke='" + BLEU + "' stroke-width='3' fill='none'/>" + B.map(function (v, i) { return "<circle cx='" + X(i) + "' cy='" + Y(v) + "' r='5' fill='" + BLEU + "'/>"; }).join("");
          s += "<path d='M60 254H620M60 254V30' stroke='" + NUIT + "' stroke-width='1.5'/>" + txt(340, 288, "âge (mois)", { s: 11.5 }) + txt(X(4) + 10, Y(6.8) - 12, "Nina : 6,8 kg à 4 mois", { s: 11.5, a: "start", c: BLEU }) + txt(X(9), Y(10.6) - 30, "zone normale", { s: 11.5, c: VERT });
          return svg(640, 290, "Courbe de poids du carnet de santé : la courbe de Nina monte régulièrement dans la zone normale", "", s);
        })() }],
        fil: { html: "<p>La courbe de poids de Nina est bonne : elle n'est pas « faible de nature ». Ce qui inquiète, c'est le changement brutal de ce soir : elle ne tète plus et respire vite.</p>" },
        retenir: "Tète bien, prend du poids, éveillée, respire calmement, peau rose et chaude." },
      { t: "Les signes de danger", html: partie(EA_OLD, 1),
        planches: [{ type: "2D", titre: "Les huit signes qui imposent de consulter", legende: "Un seul de ces signes suffit pour partir sans attendre au centre de santé.", svg: (function () {
          var s = "<rect width='640' height='300' fill='#FFF6F4'/>";
          SIGNES.forEach(function (g, i) {
            var x = 14 + (i % 4) * 156, y = 14 + Math.floor(i / 4) * 142;
            s += "<rect x='" + x + "' y='" + y + "' width='146' height='130' rx='12' fill='#fff' stroke='#F2C2C9'/>" + bebe(x + 73, y + 48, 0.62, g[1]);
            if (g[1] === "biberon") s += "<g transform='translate(" + (x + 124) + " " + (y + 30) + ") rotate(25)'><rect x='-6' y='-14' width='12' height='26' rx='4' fill='#E8F4FA' stroke='#8EA9C1'/><path d='M-4 -14l4 -8l4 8' fill='#E3C79C'/></g><path d='M" + (x + 112) + " " + (y + 14) + "l24 26M" + (x + 136) + " " + (y + 14) + "l-24 26' stroke='" + ROUGE + "' stroke-width='3'/>";
            if (g[1] === "fievre") s += "<g transform='translate(" + (x + 126) + " " + (y + 34) + ")'><rect x='-4' y='-22' width='8' height='36' rx='4' fill='#fff' stroke='#8E96A6'/><rect x='-2' y='-12' width='4' height='24' fill='" + ROUGE + "'/><circle cy='16' r='6' fill='" + ROUGE + "'/></g>" + txt(x + 126, y + 66, "39 °C", { s: 10, c: ROUGE });
            if (g[1] === "resp") s += txt(x + 124, y + 22, "≥ 50/min", { s: 10, c: ROUGE });
            var mots = g[0].split(" "), l1 = "", l2 = "";
            mots.forEach(function (m) { if ((l1 + " " + m).length <= 22 && !l2) l1 = (l1 ? l1 + " " : "") + m; else l2 = (l2 ? l2 + " " : "") + m; });
            s += txt(x + 73, y + 104, l1, { s: 10.5, c: ROUGE }) + (l2 ? txt(x + 73, y + 118, l2, { s: 10.5, c: ROUGE }) : "");
          });
          return svg(640, 300, "Huit vignettes de nourrissons illustrant les signes de danger", "", s);
        })() }],
        fil: { html: "<p>Nina a au moins trois signes de danger : elle ne peut plus téter, elle a une forte fièvre, et elle respire à 62 par minute avec un creusement sous les côtes, au-dessus du seuil de 50 pour son âge (document). Attendre jusqu'au lendemain serait dangereux.</p>", verdicts: [[0, "rejetee", "Plusieurs signes de danger : on ne peut pas attendre."]] },
        retenir: "Un seul signe de danger suffit : consulter immédiatement." },
      { t: "Que faire ?", html: partie(EA_OLD, 2),
        planches: [{ type: "3d", titre: "Ce qu'on emporte au centre de santé", legende: "Tourne la table : le carnet de santé (vert), le lait maternel tiré dans un biberon propre pour continuer à faire boire si l'enfant avale, un thermomètre et un pagne pour couvrir l'enfant, sans le surcouvrir s'il a de la fièvre.",
          modele: { h: 300, rx: -24, ry: 22, echelle: 1, alt: "Carnet de santé vert, biberon, thermomètre et pagne sur une table", objets: table3D(),
            etiquettes: [{ p: [-110, 8, -10], t: "Carnet de santé" }, { p: [30, 92, 20], t: "Biberon de lait maternel" }, { p: [175, 6, -40], t: "Thermomètre", cote: "d" }, { p: [130, 14, 60], t: "Pagne", cote: "d" }] } }],
        fil: { html: "<p>Une décoction peut provoquer des vomissements, une intoxication ou faire perdre un temps précieux : on ne donne rien sans avis d'un agent de santé. Clarisse appelle sa mère et part en moto-taxi avec le carnet de santé.</p>", verdicts: [[1, "rejetee", "Pas de décoction sans avis médical : risque d'intoxication et retard des soins."], [2, "validee", "Signes de danger → centre de santé sans attendre, avec le carnet."]] },
        retenir: "Partir sans attendre, avec le carnet ; ne rien donner sans avis d'un agent de santé." }
    ],
    denouement: {
      titre: "Clarisse part au centre de santé",
      etapes: ["La courbe de poids est bonne : c'est un changement brutal (indice 1).", "Ne tète plus, forte fièvre, 62 respirations par minute avec creusement : signes de danger (indice 2).", "Départ immédiat avec le carnet, pas de décoction (indice 3)."],
      reponse: "<p>Nina présente plusieurs signes de danger : elle ne peut plus téter, elle a une forte fièvre, et elle respire 62 fois par minute avec un creusement sous les côtes, alors que le seuil de respiration rapide est de 50 par minute entre 2 et 12 mois. Un seul de ces signes suffirait à consulter immédiatement : il ne faut donc pas attendre le lendemain. Clarisse ne donne pas la décoction, car on ne donne aucun remède sans avis d'un agent de santé. Elle appelle sa mère, prend le carnet de santé, couvre légèrement Nina et part sans attendre au centre de santé en moto-taxi, en lui proposant le lait maternel pendant le trajet si elle peut avaler.</p>",
      transfert: "<p>Réalise une affiche des huit signes de danger du nourrisson pour les jeunes parents de ton quartier, avec un numéro et une adresse de centre de santé.</p>"
    },
    revision: (EA_OLD ? EA_OLD.revision : []).concat(["Respiration rapide : ≥ 60/min avant 2 mois ; ≥ 50/min de 2 à 12 mois ; ≥ 40/min de 1 à 5 ans."]),
    exo: EA_OLD ? EA_OLD.exo : "",
    quiz: [
      q("Un nourrisson qui vomit tout ce qu'il prend…", "doit consulter d'urgence", "peut attendre une semaine", "doit jeûner", "Signe de danger."),
      q("Signe de bonne santé :", "prise de poids régulière", "sommeil très profond et difficile à réveiller", "respiration très rapide", "Courbe du carnet de santé."),
      q("Que prendre en allant au centre de santé ?", "le carnet de santé", "une décoction", "rien", "Il contient vaccins et pesées."),
      q("Entre 2 et 12 mois, la respiration est rapide à partir de…", "50 par minute", "20 par minute", "100 par minute", "Seuil de l'OMS."),
      q("62 respirations par minute à 4 mois, c'est…", "une respiration rapide", "normal", "trop lent", "Au-dessus de 50."),
      q("Un bébé anormalement mou et difficile à réveiller…", "doit consulter immédiatement", "a juste sommeil", "doit boire une décoction", "Signe de danger."),
      q("Pli cutané qui reste et yeux enfoncés indiquent…", "une déshydratation", "une bonne santé", "une jaunisse", "Souvent avec diarrhée."),
      q("Faut-il donner une décoction à un nourrisson fiévreux ?", "non, sans avis d'un agent de santé", "oui, toujours", "oui, en grande quantité", "Risque d'intoxication."),
      q("Pendant le trajet, si l'enfant peut avaler…", "on continue à lui proposer le sein ou à boire", "on l'empêche de boire", "on lui donne du sucre pur", "Prévenir la déshydratation."),
      q("Combien de signes de danger faut-il pour consulter ?", "un seul suffit", "au moins trois", "aucun, on attend toujours", "Ne jamais attendre.")
    ]
  });

  /* ═══════════════════════ 1re ITALIEN — GLI AVVERBI IN -MENTE ═══════════════════════ */
  var IA_OLD = ancien("1re-it-avverbi");
  var AGG = [["lento", "o"], ["sicuro", "o"], ["rapido", "o"], ["veloce", "e"], ["forte", "e"], ["triste", "e"], ["facile", "le"], ["gentile", "le"], ["regolare", "re"], ["particolare", "re"], ["buono", "irr"], ["cattivo", "irr"]];
  function avverbio(a) {
    var t = a[1];
    if (t === "o") return [a[0], a[0].slice(0, -1) + "a", a[0].slice(0, -1) + "amente", "-o → féminin -a + mente"];
    if (t === "e") return [a[0], a[0], a[0] + "mente", "-e + mente"];
    if (t === "le" || t === "re") return [a[0], a[0].slice(0, -1), a[0].slice(0, -1) + "mente", "-" + t + " : le e tombe"];
    return [a[0], "", a[0] === "buono" ? "bene" : "male", "irrégulier"];
  }
  function bloc3D() {
    var o = [], k, C = ["#1E499B", "#C2540A", "#2E7D32"], W = [[-150, 90], [-50, 30], [60, 110]];
    o.push({ f: "boite", c: [0, -10, 0], d: [460, 8, 160], coul: "#C9A576", dessus: "#E3C79C" });
    for (k = 0; k < 3; k++) o.push({ f: "boite", c: [W[k][0] + W[k][1] / 2 - 20, 0, 0], d: [W[k][1], 50, 60], coul: C[k], dessus: C[k], div: false, ec: [(k - 1) * 40, k === 1 ? 40 : 0, 0] });
    return o;
  }
  remplacer("1re-it-avverbi", {
    c: "1re A", m: "italien", titre: "Gli avverbi in -mente", duree: 30,
    accroche: "« Il portiere ha giocato buono e ha parlato veloce » : le compte rendu du match pour le club d'italien fait rire Giulia.",
    intro: "Le compte rendu d'un match pour une correspondante italienne te sert de fil rouge : à chaque partie, un indice t'aide à trancher entre trois règles.",
    objectifs: ["former un adverbe en -mente à partir d'un adjectif", "appliquer les règles selon la terminaison de l'adjectif (-o, -e, -le, -re)", "employer les adverbes irréguliers bene, male, meglio, peggio", "décrire une action avec des adverbes"],
    enquete: {
      titre: "Le compte rendu du match pour Giulia",
      svg: svg(640, 220, "Un terrain de football et un texte en italien contenant des fautes d adverbes", lin("itP", ["#3E9B44", "#2E7D32"], true), "<rect width='640' height='220' fill='url(#itP)'/><path d='M0 110H340M170 20V200' stroke='#fff' stroke-width='3' opacity='.7'/><circle cx='170' cy='110' r='36' fill='none' stroke='#fff' stroke-width='3' opacity='.7'/>" + perso(110, 70, "#5A3A1E", "#F7C948", "#1F2328") + perso(240, 80, "#6B4423", "#C62828", "#FFFFFF") + "<circle cx='190' cy='160' r='8' fill='#fff' stroke='#1F2328'/>" + "<rect x='360' y='24' width='260' height='170' rx='10' fill='#fff' stroke='#C9D2E3'/>" + txt(376, 50, "Cara Giulia,", { s: 13, a: "start", c: BLEU, i: true }) + ["il portiere ha giocato buono,", "l'arbitro ha parlato veloce,", "abbiamo vinto facilemente", "e lento siamo tornati a casa."].map(function (l, i) { return txt(376, 80 + i * 26, l, { s: 12, a: "start", w: 500, i: true }); }).join("")),
      legende: "À Garoua : Ahmadou, élève de 1re A, raconte en italien un match de Coton Sport à Giulia, sa correspondante de Turin.",
      contexte: "<p>Ahmadou écrit : « Il portiere ha giocato <em>buono</em>, l'arbitro ha parlato <em>veloce</em>, abbiamo vinto <em>facilemente</em> e <em>lento</em> siamo tornati a casa. » Giulia répond : « Bravo pour le match ! Mais tes adverbes… » Son camarade affirme : « On ajoute -mente à l'adjectif, toujours. » Un autre : « En italien, l'adjectif peut servir d'adverbe, comme en anglais parlé. »</p>",
      documents: [{ t: "La règle en trois cas", html: "<table class='donnees'><tr><th>Adjectif</th><th>Règle</th><th>Exemple</th></tr><tr><td>en -o</td><td>féminin en -a + mente</td><td>lento → lentamente</td></tr><tr><td>en -e</td><td>+ mente</td><td>veloce → velocemente</td></tr><tr><td>en -le / -re</td><td>le e tombe + mente</td><td>facile → facilmente</td></tr></table>" }],
      question: "Comment corriger les adverbes d'Ahmadou ?",
      tache: "Corrige les quatre adverbes en indiquant la règle appliquée pour chacun.",
      hypotheses: ["On ajoute toujours -mente à l'adjectif tel quel.", "L'adjectif peut servir d'adverbe : « ha giocato buono » est correct.", "La règle dépend de la terminaison : -o → -amente, -e → -emente, -le / -re → e tombe ; buono → bene."]
    },
    parties: [
      { t: "La règle", html: partie(IA_OLD, 0),
        planches: [{ type: "3d", titre: "Les trois pièces d'un adverbe", legende: "lent (bleu) + a (orange, la marque du féminin) + mente (vert) = lentamente. Le curseur sépare les pièces : sans le a, « lentmente » serait faux.",
          modele: { h: 300, rx: -14, ry: 16, echelle: 1, alt: "Trois blocs de couleur assemblés : lent, a, mente", eclate: "Séparer les pièces", jouer: "Séparer", objets: bloc3D(),
            etiquettes: [{ p: [-125, 54, 0], t: "lent- (radical)", ec: [-40, 0, 0] }, { p: [-55, 54, 0], t: "-a (féminin)", ec: [0, 40, 0] }, { p: [80, 54, 0], t: "-mente", cote: "d", ec: [40, 0, 0] }] } }],
        fil: { html: "<p>« lento » se termine par -o : on passe par le féminin, <strong>lentamente</strong>. « facile » se termine par -le : le e tombe, <strong>facilmente</strong> (et non « facilemente »). « veloce » se termine par -e : on ajoute -mente, <strong>velocemente</strong>. Ajouter -mente « tel quel » donnerait « lentomente » ou « facilemente » : faux.</p>", verdicts: [[0, "rejetee", "La règle dépend de la terminaison : lentamente, facilmente."]] },
        retenir: "-o → -amente ; -e → -emente ; -le / -re → -lmente / -rmente." },
      { t: "Les irréguliers", html: partie(IA_OLD, 1),
        planches: [{ type: "2D", titre: "Adjectif ou adverbe ?", legende: "L'adjectif qualifie un nom (un buon portiere) ; l'adverbe modifie un verbe (ha giocato bene). Buono → bene, cattivo → male.", svg: (function () {
          var s = "<rect width='640' height='200' fill='#F5F7FB'/>", L = [["un buon portiere", "adjectif → nom", BLEU], ["ha giocato bene", "adverbe → verbe", VERT], ["un cattivo arbitro", "adjectif → nom", BLEU], ["ha arbitrato male", "adverbe → verbe", VERT]];
          L.forEach(function (l, i) { var x = 20 + (i % 2) * 310, y = 24 + Math.floor(i / 2) * 88; s += "<rect x='" + x + "' y='" + y + "' width='290' height='70' rx='14' fill='#fff' stroke='" + l[2] + "' stroke-width='2'/>" + txt(x + 145, y + 32, l[0], { s: 17, c: l[2] }) + txt(x + 145, y + 54, l[1], { s: 11.5, w: 500, c: GRIS }); });
          return svg(640, 200, "Quatre étiquettes : un buon portiere, ha giocato bene, un cattivo arbitro, ha arbitrato male", "", s);
        })() }],
        fil: { html: "<p>« Ha giocato » est un verbe : il faut un adverbe. L'adjectif « buono » ne convient pas ; son adverbe est irrégulier : <strong>bene</strong>. L'italien écrit ne remplace pas l'adverbe par l'adjectif.</p>", verdicts: [[1, "rejetee", "Un verbe appelle un adverbe : ha giocato bene."]] },
        retenir: "buono → bene ; cattivo → male ; migliore → meglio ; peggiore → peggio." },
      { t: "En contexte", html: partie(IA_OLD, 2),
        fil: { html: "<p>Avec la règle complète : « Il portiere ha giocato <strong>bene</strong>, l'arbitro ha parlato <strong>velocemente</strong>, abbiamo vinto <strong>facilmente</strong> e <strong>lentamente</strong> siamo tornati a casa. »</p>", verdicts: [[2, "validee", "Terminaison de l'adjectif + irréguliers."]] },
        retenir: "Un adverbe modifie un verbe, un adjectif, un autre adverbe." }
    ],
    denouement: {
      titre: "La lettre corrigée",
      etapes: ["lento → lentamente ; facile → facilmente ; veloce → velocemente (indice 1).", "buono → bene : un verbe appelle un adverbe (indice 2).", "Relecture complète (indice 3)."],
      reponse: "<p>Lettre corrigée : « Cara Giulia, il portiere ha giocato <strong>bene</strong>, l'arbitro ha parlato <strong>velocemente</strong>, abbiamo vinto <strong>facilmente</strong> e <strong>lentamente</strong> siamo tornati a casa. » Pour former un adverbe en -mente, on regarde la terminaison de l'adjectif : en -o, on passe par le féminin (lento → lentamente) ; en -e, on ajoute -mente (veloce → velocemente) ; en -le ou -re, le e tombe (facile → facilmente). Quelques adverbes sont irréguliers : buono → bene, cattivo → male. Et un verbe se modifie toujours par un adverbe, jamais par un adjectif.</p>",
      transfert: "<p>Raconte à Giulia, en cinq phrases, une journée au lycée en utilisant cinq adverbes différents, dont un irrégulier.</p>"
    },
    revision: (IA_OLD ? IA_OLD.revision : []).concat(["-o → -amente ; -e → -emente ; -le / -re → e tombe.", "Un verbe appelle un adverbe : ha giocato bene."]),
    exo: IA_OLD ? IA_OLD.exo : "",
    quiz: [
      q("regolare → ?", "regolarmente", "regolaremente", "regolamente", "-re : le e tombe."),
      q("buono → ?", "bene", "buonamente", "buono", "Irrégulier."),
      q("sicuro → ?", "sicuramente", "sicuromente", "sicurmente", "-o → -amente."),
      q("veloce → ?", "velocemente", "velocamente", "velocmente", "-e + mente."),
      q("facile → ?", "facilmente", "facilemente", "facilamente", "-le : le e tombe."),
      q("cattivo → ?", "male", "cattivamente seulement", "peggio", "Irrégulier."),
      q("« Il a mieux joué » :", "Ha giocato meglio.", "Ha giocato migliore.", "Ha giocato buono.", "migliore → meglio."),
      q("lento → ?", "lentamente", "lentomente", "lentmente", "Par le féminin lenta."),
      q("gentile → ?", "gentilmente", "gentilemente", "gentilamente", "-le."),
      q("Dans « ha giocato bene », bene modifie…", "le verbe", "le nom", "le sujet", "C'est un adverbe.")
    ]
  });

  /* ═══════════════════════ 1re ITALIEN — ESPRIMERE ACCORDO E DISACCORDO ═══════════════════════ */
  var IC_OLD = ancien("1re-it-accordo");
  var ESPR = [["Sono d'accordo con te.", "accordo"], ["Hai ragione.", "accordo"], ["Esatto!", "accordo"], ["Non sono d'accordo.", "disaccordo"], ["Hai torto.", "disaccordo"], ["Non è vero.", "disaccordo"], ["Sì, però…", "sfumatura"], ["Dipende.", "sfumatura"], ["Da una parte…, dall'altra…", "sfumatura"]];
  function dibattito3D() {
    var o = [];
    o.push({ f: "boite", c: [0, -10, 0], d: [520, 8, 300], coul: "#9C6B3C", dessus: "#C0894F" });
    [[-150, "#2E7D32"], [150, "#C62828"]].forEach(function (t) {
      o.push({ f: "boite", c: [t[0], 0, 10], d: [150, 50, 60], coul: "#6B4423", dessus: "#8B5A2B", div: false });
      o.push({ f: "boite", c: [t[0], 0, -24], d: [146, 46, 2], coul: t[1], div: false });
      [-40, 0, 40].forEach(function (dx) { o.push({ f: "sphere", c: [t[0] + dx, 72, 40], r: 12, coul: "#6B4423" }); o.push({ f: "boite", c: [t[0] + dx, 50, 40], d: [26, 22, 16], coul: t[1] === "#2E7D32" ? "#DCE6F2" : "#F7C948", div: false }); });
    });
    o.push({ f: "boite", c: [0, 0, -100], d: [60, 80, 40], coul: "#5D3A1E", dessus: "#7A5230", div: false });
    o.push({ f: "boite", c: [0, 0, -122], d: [56, 76, 2], coul: "#1E499B", div: false });
    o.push({ f: "sphere", c: [0, 104, -90], r: 12, coul: "#5A3A1E" }); o.push({ f: "boite", c: [0, 80, -90], d: [28, 24, 16], coul: "#7B3F99", div: false });
    return o;
  }
  remplacer("1re-it-accordo", {
    c: "1re A", m: "italien", titre: "Esprimere accordo e disaccordo", duree: 30,
    accroche: "« I giovani di oggi non rispettano più gli anziani. » Le débat du club d'italien est lancé : il faut dire oui, non… ou nuancer.",
    intro: "Un débat du club d'italien te sert de fil rouge : à chaque partie, un indice t'aide à trancher entre trois façons de réagir.",
    objectifs: ["exprimer son accord en italien", "exprimer son désaccord poliment et nuancer", "donner son opinion avec secondo me, penso che + subjonctif", "construire une réaction argumentée de trois phrases"],
    enquete: {
      titre: "Le débat du club d'italien à Douala",
      svg: svg(640, 220, "Deux équipes de débat face à face avec des bulles en italien", "", "<rect width='640' height='220' fill='#F4F1EA'/><rect x='250' y='20' width='140' height='40' rx='10' fill='#1E499B'/>" + txt(320, 46, "« I giovani di oggi… »", { s: 11.5, c: "#fff" }) + perso(100, 100, "#5A3A1E", "#DCE6F2", "#1E499B") + perso(170, 104, "#6B4423", "#DCE6F2", "#1E499B") + perso(470, 100, "#6B4423", "#F7C948", "#2E3445") + perso(540, 104, "#5A3A1E", "#F7C948", "#2E3445") + bulle(40, 60, 170, "Hai ragione!", VERT) + bulle(430, 60, 180, "Non è vero!", ROUGE) + bulle(240, 150, 170, "Sì, però… dipende.", "#F2994A")),
      legende: "Au lycée bilingue de Deïdo, à Douala : le club d'italien prépare la journée de la francophonie et de l'italophonie.",
      contexte: "<p>La professeure lance la phrase : « <em>I giovani di oggi non rispettano più gli anziani.</em> » Patrick répond seulement « Sì ». Mireille crie « No, no, no ! ». La professeure demande à chacun de réagir en <strong>trois phrases</strong> : dire son accord ou son désaccord, nuancer, et donner son opinion avec un argument. Patrick pense qu'« un oui ou un non suffit ». Mireille, qu'« il est impoli de dire non en italien ».</p>",
      documents: [{ t: "La consigne de l'épreuve orale du Probatoire (exemple)", html: "<p>« Réagissez au document en exprimant votre opinion et en la justifiant par au moins un argument et un exemple. »</p>" }],
      question: "Comment réagir correctement, et poliment, à la phrase de la professeure ?",
      tache: "Écris ta réaction en trois phrases : une expression d'accord ou de désaccord, une nuance, une opinion argumentée avec « penso che ».",
      hypotheses: ["Un simple « sì » ou « no » suffit.", "Dire « non sono d'accordo » est impoli en italien.", "On exprime son accord ou son désaccord avec une formule, on nuance, puis on justifie son opinion (secondo me, penso che + subjonctif)."]
    },
    parties: [
      { t: "Dire son accord", html: partie(IC_OLD, 0),
        planches: [{ type: "3d", titre: "La salle du débat", legende: "Tourne la salle : l'équipe d'accord (tables vertes) face à l'équipe en désaccord (tables rouges), et la modératrice au pupitre. Chaque intervention commence par une formule d'accord ou de désaccord.",
          modele: { h: 320, rx: -26, ry: 0, echelle: 0.95, alt: "Salle de débat avec deux tables d équipes face à face et un pupitre", objets: dibattito3D(),
            etiquettes: [{ p: [-150, 90, 40], t: "Accordo" }, { p: [150, 90, 40], t: "Disaccordo", cote: "d" }, { p: [0, 120, -90], t: "La moderatrice" }] } }],
        fil: { html: "<p>« Sì » répond, mais ne montre ni la langue ni la pensée. Une formule complète, « <strong>Sono d'accordo con Lei</strong> » ou « <strong>Ha ragione</strong> » (forme de politesse avec la professeure), est attendue.</p>", verdicts: [[0, "rejetee", "Une formule complète, une nuance et un argument sont attendus."]] },
        retenir: "Sono d'accordo, hai ragione, certo, esatto." },
      { t: "Dire son désaccord, nuancer", html: partie(IC_OLD, 1),
        fil: { html: "<p>Il n'est pas impoli de dire « <strong>Non sono d'accordo</strong> » : c'est la formule normale du débat. Ce qui serait impoli, c'est « Hai torto ! » lancé sèchement à la professeure. On peut adoucir : « Non sono del tutto d'accordo… », « Sì, però… ».</p>", verdicts: [[1, "rejetee", "« Non sono d'accordo » est une formule polie et courante."]] },
        retenir: "Non sono d'accordo, non è vero ; nuancer : sì, però…, dipende." },
      { t: "Donner son opinion", html: partie(IC_OLD, 2),
        planches: [{ type: "2D", titre: "Une réaction en trois temps", legende: "1. La formule (accord ou désaccord) ; 2. la nuance ; 3. l'opinion argumentée avec « penso che » et le subjonctif.", svg: (function () {
          var E = [["1", "Non sono del tutto d'accordo.", "formule", ROUGE], ["2", "Da una parte alcuni giovani sono maleducati, dall'altra molti aiutano i nonni.", "nuance", "#F2994A"], ["3", "Penso che il rispetto dipenda dall'educazione in famiglia.", "opinion + subjonctif", VERT]], s = "<rect width='640' height='230' fill='#F5F7FB'/>";
          E.forEach(function (e, i) { var y = 16 + i * 70; s += "<circle cx='40' cy='" + (y + 28) + "' r='20' fill='" + e[3] + "'/>" + txt(40, y + 34, e[0], { s: 16, c: "#fff" }) + "<rect x='70' y='" + y + "' width='552' height='56' rx='12' fill='#fff' stroke='" + e[3] + "' stroke-width='2'/>" + txt(84, y + 26, e[1].length > 70 ? e[1].slice(0, e[1].indexOf(",") + 1) : e[1], { s: 13, a: "start", i: true }) + (e[1].length > 70 ? txt(84, y + 44, e[1].slice(e[1].indexOf(",") + 2), { s: 13, a: "start", i: true }) : "") + txt(610, y + 48, e[2], { s: 10.5, a: "end", c: e[3] }); });
          return svg(640, 230, "Trois étapes numérotées d une réaction en italien : formule, nuance, opinion", "", s);
        })() }],
        fil: { html: "<p>« Penso che » est suivi du <strong>subjonctif</strong> : « Penso che il rispetto <strong>dipenda</strong> dall'educazione » (et non « dipende »).</p>", verdicts: [[2, "validee", "Formule, nuance, opinion argumentée au subjonctif."]] },
        retenir: "Secondo me…, per me…, penso che + subjonctif." }
    ],
    denouement: {
      titre: "La réaction modèle",
      etapes: ["Une formule : « Non sono del tutto d'accordo » (indice 1).", "Une nuance polie : « da una parte…, dall'altra… » (indice 2).", "Une opinion au subjonctif : « penso che… dipenda » (indice 3)."],
      reponse: "<p>Réaction modèle : « Non sono del tutto d'accordo. Da una parte alcuni giovani sono maleducati, dall'altra molti aiutano i nonni ogni giorno. Penso che il rispetto dipenda soprattutto dall'educazione in famiglia. » Un simple « sì » ou « no » ne suffit pas : on attend une formule complète, une nuance et une opinion justifiée. Dire « non sono d'accordo » n'est pas impoli : c'est la formule normale du débat, qu'on peut adoucir par « del tutto » ou « sì, però ». Enfin, après « penso che », le verbe se met au subjonctif.</p>",
      transfert: "<p>Réagis en trois phrases à : « Il telefono cellulare è indispensabile per studiare. » Utilise une formule d'accord ou de désaccord, une nuance et « secondo me » ou « penso che ».</p>"
    },
    revision: (IC_OLD ? IC_OLD.revision : []).concat(["Réaction en trois temps : formule, nuance, opinion argumentée."]),
    exo: IC_OLD ? IC_OLD.exo : "",
    quiz: [
      q("« Tu as raison »", "Hai ragione", "Hai torto", "Sei ragione", "avere ragione."),
      q("Pour nuancer, on dit…", "Sì, però…", "Esatto!", "Hai torto.", "Oui, mais…"),
      q("« Penso che » est suivi…", "du subjonctif", "de l'indicatif", "de l'infinitif", "Penso che sia…"),
      q("« Je ne suis pas d'accord »", "Non sono d'accordo.", "Non ho d'accordo.", "Sono disaccordo.", "essere d'accordo."),
      q("« Tu as tort »", "Hai torto.", "Hai ragione.", "Sei torto.", "avere torto."),
      q("« Selon moi… »", "Secondo me…", "Dopo me…", "Per te…", "Pour donner son opinion."),
      q("« Dipende » signifie…", "ça dépend", "je dépense", "c'est faux", "Nuance."),
      q("Avec la professeure (vouvoiement), on dit…", "Ha ragione.", "Hai ragione.", "Abbiamo ragione.", "Forme de politesse Lei."),
      q("« Penso che il rispetto ___ dall'educazione. »", "dipenda", "dipende", "dipendere", "Subjonctif présent."),
      q("« Da una parte…, dall'altra… » sert à…", "nuancer", "approuver totalement", "refuser sèchement", "Présenter deux aspects.")
    ]
  });

  /* ═══════════════════════ SIMULATIONS ═══════════════════════ */
  VRT_A("1re-esf-notions", 2, "Simulateur : le budget du mois", function (el) {
    el.innerHTML = "<div style='display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:2px 18px'>" + POSTES.map(function (p) { return "<label class='labo-c'><span>" + p[0] + " : <b data-v>" + p[1].toLocaleString("fr-FR") + "</b> F</span><input type='range' min='" + Math.round(p[1] * (p[0] === "Loyer" || p[0] === "Eau, électricité" ? 1 : p[0] === "Nourriture" ? 0.7 : 0.3) / 1000) * 1000 + "' max='" + p[1] + "' step='1000' value='" + p[1] + "'></label>"; }).join("") + "</div><svg viewBox='0 0 640 110' class='an-svg' data-s></svg><p class='labo-r' data-r></p>";
    var I = el.querySelectorAll("input"), V = el.querySelectorAll("[data-v]");
    function maj() {
      var N = [].map.call(I, function (x) { return +x.value; }), tot = N.reduce(function (a, b) { return a + b; }, 0), sol = 120000 - tot, X = function (v) { return 30 + v / 140000 * 580; };
      N.forEach(function (n, i) { V[i].textContent = n.toLocaleString("fr-FR"); });
      el.querySelector("[data-s]").innerHTML = "<rect x='30' y='34' width='580' height='26' rx='13' fill='#EEF1F6'/><rect x='30' y='34' width='" + (X(tot) - 30) + "' height='26' rx='13' fill='" + (sol >= 0 ? "#C2540A" : ROUGE) + "'/><path d='M" + X(120000) + " 24V70' stroke='" + NUIT + "' stroke-width='2' stroke-dasharray='4 3'/>" + txt(X(120000), 18, "revenu 120 000 F", { s: 11 }) + txt(30, 88, "Dépenses : " + tot.toLocaleString("fr-FR") + " F", { s: 12, a: "start" }) + txt(610, 88, (sol >= 0 ? "Épargne : " : "Déficit : ") + Math.abs(sol).toLocaleString("fr-FR") + " F", { s: 12, a: "end", c: sol >= 0 ? VERT : ROUGE });
      el.querySelector("[data-r]").innerHTML = (sol >= 0 ? "<b>Le mois est bouclé</b> ; épargne par trimestre : <b>" + (3 * sol).toLocaleString("fr-FR") + " F</b>." : "<b>Déficit de " + (-sol).toLocaleString("fr-FR") + " F</b> : l'argent manquera avant la fin du mois.") + (N[0] < 45000 ? " ⚠️ Nourriture trop réduite : risque pour l'équilibre des repas." : "") + (N[5] < 5000 ? " ⚠️ Ne pas supprimer la santé." : "");
    }
    I.forEach(function (x) { x.addEventListener("input", maj); }); maj();
  });
  VRT_A("1re-esf-alarme", 1, "Compte les respirations : rapide ou non ?", function (el) {
    el.innerHTML = "<div style='display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:4px 18px'><label class='labo-c'><span>Âge : <b data-v>4</b> mois</span><input type='range' min='0' max='59' step='1' value='4'></label><label class='labo-c'><span>Respirations en 1 minute : <b data-v>62</b></span><input type='range' min='20' max='80' step='1' value='62'></label></div><svg viewBox='0 0 640 170' class='an-svg' data-s></svg><p class='labo-r' data-r></p>";
    var I = el.querySelectorAll("input"), V = el.querySelectorAll("[data-v]"), raf = 0, t0 = 0;
    function seuil(m) { return m < 2 ? 60 : m < 12 ? 50 : 40; }
    function dess(ts) {
      var age = +I[0].value, r = +I[1].value, s = seuil(age), rapide = r >= s, ph = ((ts || 0) / 1000) * r / 60 * 2 * Math.PI, k = 1 + 0.06 * Math.sin(ph);
      el.querySelector("[data-s]").innerHTML = "<rect width='640' height='170' fill='" + (rapide ? "#FFF1EE" : "#EEF8F1") + "'/><g transform='translate(190 88) scale(1.2 " + (1.2 * k).toFixed(3) + ")'>" + bebe(0, 0, 1, rapide ? "resp" : "normal") + "</g>" + txt(460, 70, r + " / min", { s: 28, c: rapide ? ROUGE : VERT }) + txt(460, 100, "seuil pour cet âge : " + s + " / min", { s: 13, c: GRIS }) + txt(460, 130, rapide ? "RESPIRATION RAPIDE : consulter" : "respiration normale", { s: 13, c: rapide ? ROUGE : VERT });
      raf = requestAnimationFrame(function (t) { dess(t); });
    }
    var dessin = dess; dess = function (ts) { if (ts && ts - t0 < 66) { raf = requestAnimationFrame(dess); return; } t0 = ts || 0; dessin(ts); };
    function maj() {
      I.forEach(function (x, i) { V[i].textContent = x.value; });
      var age = +I[0].value, r = +I[1].value, s = seuil(age);
      el.querySelector("[data-r]").innerHTML = (age < 12 ? age + " mois" : Math.floor(age / 12) + " an(s) " + (age % 12 ? age % 12 + " mois" : "")) + " : respiration rapide à partir de <b>" + s + "</b> par minute. " + (r >= s ? "<b style='color:" + ROUGE + "'>Signe de danger : centre de santé sans attendre.</b>" : "Pas de respiration rapide ; surveiller les autres signes.");
    }
    I.forEach(function (x) { x.addEventListener("input", maj); }); maj();
    try { if (window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches) dess(0), cancelAnimationFrame(raf); else raf = requestAnimationFrame(dess); } catch (e) { dess(0); }
  });
  VRT_A("1re-it-avverbi", 0, "La fabbrica degli avverbi : choisis un adjectif", function (el) {
    el.innerHTML = "<div style='display:flex;flex-wrap:wrap;gap:6px' data-b>" + AGG.map(function (a, k) { return "<button type='button' class='btn-l' data-k='" + k + "'>" + a[0] + "</button>"; }).join("") + "</div><svg viewBox='0 0 640 130' class='an-svg' data-s></svg><p class='labo-r' data-r></p>";
    function maj(k) {
      var v = avverbio(AGG[k]), s = "<rect width='640' height='130' fill='#F5F7FB'/>", cases = v[1] ? [[v[0], BLEU], [v[1], "#C2540A"], [v[2], VERT]] : [[v[0], BLEU], [v[2], VERT]];
      cases.forEach(function (c, i) { var w = 40 + c[0].length * 12, x = 20 + i * 215; s += "<rect x='" + x + "' y='40' width='" + Math.min(190, w) + "' height='50' rx='12' fill='" + c[1] + "'/>" + txt(x + Math.min(190, w) / 2, 72, c[0], { s: 18, c: "#fff" }) + (i < cases.length - 1 ? "<path d='M" + (x + Math.min(190, w) + 6) + " 65H" + (x + 205) + "' stroke='" + NUIT + "' stroke-width='2.5' marker-end='url(#itF)'/>" : ""); });
      s += txt(320, 118, v[3], { s: 12.5, c: GRIS });
      el.querySelector("[data-s]").innerHTML = "<defs>" + fleche("itF", NUIT) + "</defs>" + s;
      el.querySelector("[data-r]").innerHTML = "<b>" + v[0] + " → " + v[2] + "</b> (" + v[3] + ")";
      el.querySelectorAll("[data-k]").forEach(function (b) { b.setAttribute("aria-pressed", +b.dataset.k === k); });
    }
    el.querySelectorAll("[data-k]").forEach(function (b) { b.addEventListener("click", function () { maj(+b.dataset.k); }); });
    maj(0);
  });
  VRT_A("1re-it-accordo", 1, "Accordo, disaccordo o sfumatura ?", function (el) {
    exercice(el, ESPR.map(function (e) { return ["« " + e[0] + " » exprime : ___", [e[1], "accordo", "disaccordo", "sfumatura"].filter(function (x, i, a) { return a.indexOf(x) === i; }), e[1] === "accordo" ? "Formule d'accord." : e[1] === "disaccordo" ? "Formule de désaccord." : "Formule qui nuance."]; }), "Espressione seguente", "Espressione");
  });
})();
