/* Leçons APPROFONDIES — premier cycle, lot 1 (17/11/2026) : critères de divisibilité (6e), PGCD (5e),
   décomposition en facteurs premiers (4e). Même gabarit que 11-approfondies-lot4.js : situation de vie suivie partie
   après partie, hypothèses tranchées, planches 2D et 3D, simulation, situation résolue, quiz de 10 questions.
   Remplacement EN PLACE des versions courtes (05-sciences-2.js, 06-premieres-lecons.js) : même identifiant, même rang,
   fiche APC et « examen » repris. Les simulations sont déclarées à la fin du fichier (VRT_A). */
(function () {
  "use strict";
  var NUIT = "#001136", BLEU = "#1E499B", GRIS = "#4D5163", VERT = "#17784D", ORANGE = "#C2540A";

  /* ── outils de dessin 2D ── */
  function txt(x, y, t, o) {
    o = o || {};
    return "<text x='" + x + "' y='" + y + "' text-anchor='" + (o.a || "middle") + "' font-size='" + (o.s || 12) + "' font-weight='" + (o.w || 700) + "' fill='" + (o.c || NUIT) + "'" + (o.i ? " font-style='italic'" : "") + ">" + t + "</text>";
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
  function omb(id) { return "<radialGradient id='" + id + "'><stop offset='0' stop-color='#001136' stop-opacity='.28'/><stop offset='1' stop-color='#001136' stop-opacity='0'/></radialGradient>"; }
  function fleche(id, c) { return "<marker id='" + id + "' markerWidth='10' markerHeight='10' refX='7' refY='5' orient='auto'><path d='M0 1L8 5L0 9Z' fill='" + c + "'/></marker>"; }
  function svg(w, h, alt, defs, corps) {
    return "<svg viewBox='0 0 " + w + " " + h + "' role='img' aria-label='" + alt + "' font-family='Inter,Arial,sans-serif'><rect width='" + w + "' height='" + h + "' fill='#fff'/><defs>" + defs + "</defs>" + corps +
      "<text x='" + (w - 6) + "' y='" + (h - 5) + "' font-size='8' text-anchor='end' fill='#8A93A6'>Planche VÉRITAS</text></svg>";
  }
  function alea(g) { return function () { g = (g * 16807) % 2147483647; return (g - 1) / 2147483646; }; }
  function ancien(id) { return window.VRT_LECONS[id]; }
  function remplacer(id, o) {
    var a = ancien(id);
    if (a) ["apc", "examen", "rang", "cle", "scenes"].forEach(function (k) { if (a[k] != null && o[k] == null) o[k] = a[k]; });
    VRT_L(id, o);
    if (a) o.ordre = a.ordre;
  }
  function q(qq, bonne, f1, f2, e) { return { q: qq, r: [bonne, f1, f2], b: 0, e: e }; }
  function partie(old, i) { return old && old.parties[i] ? old.parties[i].html : ""; }
  /* silhouette debout (y = centre de la tête), environ 92 px de haut */
  function perso(x, y, peau, habit, bas, s) {
    bas = bas || "#2E3445";
    return "<g transform='translate(" + x + " " + y + ") scale(" + (s || 1) + ")'><ellipse cx='0' cy='84' rx='18' ry='4' fill='#001136' opacity='.18'/>" +
      "<rect x='-9' y='44' width='8' height='36' rx='3' fill='" + bas + "'/><rect x='1' y='44' width='8' height='36' rx='3' fill='" + bas + "'/>" +
      "<ellipse cx='-6' cy='81' rx='7' ry='3.5' fill='#1F2328'/><ellipse cx='6' cy='81' rx='7' ry='3.5' fill='#1F2328'/>" +
      "<path d='M-13 46L-16 18C-16 13 -12 11 -6 10H6C12 11 16 13 16 18L13 46Z' fill='" + habit + "'/>" +
      "<path d='M-15 16L-20 40' stroke='" + habit + "' stroke-width='7' stroke-linecap='round'/><path d='M15 16L20 40' stroke='" + habit + "' stroke-width='7' stroke-linecap='round'/>" +
      "<circle cx='-20' cy='42' r='3.6' fill='" + peau + "'/><circle cx='20' cy='42' r='3.6' fill='" + peau + "'/>" +
      "<rect x='-3.5' y='5' width='7' height='7' fill='" + peau + "'/><ellipse cx='0' cy='-2' rx='9' ry='10.5' fill='" + peau + "'/>" +
      "<path d='M-9 -4C-10 -14 -4 -13.5 0 -13.5S10 -14 9 -4C7 -9 -7 -9 -9 -4Z' fill='#1B1410'/></g>";
  }
  var PEAU = ["#6B4226", "#8A5A36", "#5A3620", "#7A4B2C"];

  /* ═══════════════════════ 6e MATHS — LES CRITÈRES DE DIVISIBILITÉ ═══════════════════════ */
  var V_OLD = ancien("6e-maths-divisibilite");
  /* un beignet doré (2D) */
  function beignet(id, x, y, r) {
    return "<g transform='translate(" + x + " " + y + ")'><ellipse cx='0' cy='" + (r * .7) + "' rx='" + r + "' ry='" + (r * .28) + "' fill='url(#" + id + "o)'/><circle r='" + r + "' fill='url(#" + id + "b)'/><circle cx='" + (-r * .3) + "' cy='" + (-r * .35) + "' r='" + (r * .28) + "' fill='#fff' opacity='.35'/></g>";
  }
  function defsBeignet(id) { return rad(id + "b", ["#F6C66A", "#D98A2B", "#9A5418"]) + omb(id + "o"); }
  /* un sachet transparent fermé, avec n beignets visibles */
  function sachet(id, x, y, n, lab) {
    var s = "<g transform='translate(" + x + " " + y + ")'><path d='M4 10Q0 60 6 86H70Q76 60 72 10Z' fill='#EAF4FB' fill-opacity='.85' stroke='#8FB3CF'/><path d='M14 6h48l-4 8H18z' fill='#C62828'/>", i;
    for (i = 0; i < Math.min(n, 10); i++) s += beignet(id, 18 + (i % 3) * 20, 30 + Math.floor(i / 3) * 16, 8);
    return s + (lab ? txt(38, 102, lab, { s: 11.5, c: GRIS }) : "") + "</g>";
  }
  /* boulier 3D : une tige par chiffre de 1 260, autant de perles que la valeur du chiffre */
  function boulier3D() {
    var o = [], chiffres = [1, 2, 6, 0], coul = ["#C62828", "#1E499B", "#17784D", "#8A93A6"], i, k;
    o.push({ f: "boite", c: [0, -8, 0], d: [460, 14, 150], coul: "#7A4A22", dessus: "#A8703A" });
    o.push({ f: "boite", c: [-215, 90, 0], d: [16, 190, 24], coul: "#8A5A2D", dessus: "#B07A43" });
    o.push({ f: "boite", c: [215, 90, 0], d: [16, 190, 24], coul: "#8A5A2D", dessus: "#B07A43" });
    o.push({ f: "boite", c: [0, 188, 0], d: [446, 12, 24], coul: "#8A5A2D", dessus: "#B07A43" });
    for (i = 0; i < 4; i++) {
      var x = -150 + i * 100;
      o.push({ f: "cylindre", c: [x, 0, 0], r: 3, h: 182, n: 10, coul: "#C9CDD4", dessus: "#E3E6EA" });
      for (k = 0; k < chiffres[i]; k++) o.push({ f: "sphere", c: [x, 14 + k * 26, 0], r: 12.5, coul: coul[i], ec: [0, k * 6, 0] });
    }
    return o;
  }

  remplacer("6e-maths-divisibilite", {
    c: "6e", m: "maths", titre: "Les critères de divisibilité", duree: 30,
    accroche: "1 260 beignets à mettre en sachets sans en laisser un seul : par 2, 3, 5, 9 ou 10 ? Sans poser une seule division.",
    intro: "La kermesse du CES de Bafia te sert de fil rouge : à chaque partie, un indice t'aide à trancher entre trois réponses.",
    objectifs: ["dire ce que signifie « divisible par »", "appliquer les critères par 2, 5, 10, 100 et 1 000", "appliquer les critères par 3 et par 9", "justifier une réponse avec le critère utilisé"],
    enquete: {
      titre: "Les beignets de la kermesse",
      svg: (function () {
        var id = "dvk", s = "<rect width='640' height='220' fill='#FFF6E8'/><rect y='170' width='640' height='50' fill='#E8D3AE'/>", R = alea(11), i;
        s += "<path d='M0 0H640V26H0z' fill='#1E499B'/>" + txt(320, 18, "KERMESSE DU CES DE BAFIA", { s: 12.5, c: "#fff" });
        s += "<rect x='40' y='110' width='300' height='16' rx='3' fill='#8A5A2D'/><rect x='52' y='126' width='10' height='46' fill='#6B4423'/><rect x='318' y='126' width='10' height='46' fill='#6B4423'/>";
        s += "<ellipse cx='190' cy='106' rx='130' ry='16' fill='#C9A576'/>";
        for (i = 0; i < 70; i++) s += beignet(id, 80 + (i % 14) * 16 + R() * 5, 100 - Math.floor(i / 14) * 9 + R() * 3, 8);
        s += perso(390, 92, PEAU[0], "#E86A2E", "#3A2A20") + perso(450, 98, PEAU[1], "#2F6DB5", "#24324A", .9);
        s += sachet(id, 510, 96, 9, "9 par sachet ?");
        s += "<rect x='372' y='34' width='240' height='34' rx='12' fill='#fff' stroke='#E3DCCB'/>" + txt(492, 56, "1 260 beignets à emballer", { s: 13, c: "#8A6200" });
        return svg(640, 220, "Une table de kermesse couverte de beignets, deux élèves et un sachet de neuf beignets", defsBeignet(id), s);
      })(),
      legende: "Samedi de kermesse au CES de Bafia : le stand des beignets de Madame Mballa.",
      contexte: "<p>Madame Mballa a frit <strong>1 260 beignets</strong> pour la kermesse. Elle veut les vendre en <strong>sachets identiques</strong>, sans qu'il reste un seul beignet. Elle a des sachets pour <strong>2, 3, 5, 9 ou 10</strong> beignets.</p><p>Ndongo propose de poser cinq divisions. Aïcha affirme : « 1 260 se termine par 0, donc il se divise par n'importe quel nombre. »</p>",
      documents: [{ t: "Les sachets du stand", html: "<table class='donnees'><tr><td>Sachet de 2</td><td>100 F</td></tr><tr><td>Sachet de 3, de 5 ou de 9</td><td>150 F, 250 F, 450 F</td></tr><tr><td>Sachet de 10</td><td>500 F</td></tr></table>" }],
      question: "Avec quelles tailles de sachet peut-on emballer les 1 260 beignets sans reste ?",
      tache: "Décide, pour chaque taille, en appliquant un critère et en écrivant « car… ».",
      hypotheses: [
        "Il faut poser les cinq divisions, il n'y a pas d'autre moyen.",
        "« 1 260 se termine par 0 » : il se divise par n'importe quel nombre.",
        "Les critères suffisent : le dernier chiffre pour 2, 5 et 10, la somme des chiffres pour 3 et 9."
      ]
    },
    parties: [
      { t: "Le vocabulaire", html: partie(V_OLD, 0) +
        "<div class='astuce'><b>Pourquoi des critères ?</b>Un critère est un raccourci : il répond à la question « le reste est-il nul ? » en regardant seulement les chiffres du nombre, sans poser la division.</div>",
        planches: [{ type: "2D", titre: "Divisible ou pas : il reste quelque chose ?", legende: "12 beignets en sachets de 3 : rien ne reste, 12 est divisible par 3. En sachets de 5 : il en reste 2, 12 n'est pas divisible par 5.", svg: (function () {
          var id = "dv6a", s = "", i;
          s += txt(160, 24, "12 beignets, sachets de 3", { s: 13, c: VERT });
          for (i = 0; i < 4; i++) s += sachet(id, 10 + i * 78, 34, 3);
          s += txt(160, 158, "reste : 0  →  divisible", { s: 13, c: VERT });
          s += txt(480, 24, "12 beignets, sachets de 5", { s: 13, c: ORANGE });
          for (i = 0; i < 2; i++) s += sachet(id, 340 + i * 78, 34, 5);
          s += beignet(id, 530, 80, 9) + beignet(id, 556, 84, 9) + "<path d='M520 104Q543 118 566 104' stroke='" + ORANGE + "' stroke-width='2' fill='none'/>";
          s += txt(480, 158, "reste : 2  →  pas divisible", { s: 13, c: ORANGE });
          return svg(640, 175, "Douze beignets en sachets de trois sans reste, puis en sachets de cinq avec un reste de deux", defsBeignet(id), s);
        })() }],
        fil: { html: "<p>Poser cinq divisions de 1 260, c'est long et on peut se tromper. Ce qui compte, c'est seulement de savoir si le <strong>reste est nul</strong> : les critères le disent en quelques secondes.</p>", verdicts: [[0, "rejetee", "Poser chaque division marche, mais les critères répondent sans calcul long."]] },
        retenir: "Divisible = reste nul. Un critère évite de poser la division." },

      { t: "Les critères : le dernier chiffre, la somme des chiffres", html: partie(V_OLD, 1),
        planches: [{ type: "2D", titre: "Deux familles de critères", legende: "À gauche, on regarde le chiffre des unités ; à droite, on additionne tous les chiffres.", svg: (function () {
          var s = "<rect x='10' y='10' width='300' height='210' rx='14' fill='#EEF4FC' stroke='#C9D8EE'/><rect x='330' y='10' width='300' height='210' rx='14' fill='#FFF6E3' stroke='#F2DFA6'/>";
          s += txt(160, 38, "Le dernier chiffre", { s: 15, c: BLEU }) + txt(480, 38, "La somme des chiffres", { s: 15, c: "#8A6200" });
          s += "<rect x='60' y='60' width='200' height='56' rx='10' fill='#fff' stroke='#C9D8EE'/>" + txt(120, 98, "1 26", { s: 30, a: "middle" }) + "<rect x='170' y='66' width='38' height='44' rx='8' fill='" + BLEU + "'/>" + txt(189, 98, "0", { s: 30, c: "#fff" });
          s += txt(160, 146, "par 2 : 0, 2, 4, 6, 8", { s: 12.5 }) + txt(160, 168, "par 5 : 0 ou 5", { s: 12.5 }) + txt(160, 190, "par 10 : 0", { s: 12.5 });
          [["1", 380], ["2", 430], ["6", 480], ["0", 530]].forEach(function (c) { s += "<rect x='" + (c[1] - 18) + "' y='62' width='36' height='44' rx='8' fill='#fff' stroke='#E3C77A'/>" + txt(c[1], 94, c[0], { s: 26 }); });
          s += txt(480, 132, "1 + 2 + 6 + 0 = 9", { s: 17, c: "#8A6200" }) + txt(480, 162, "9 est dans la table de 3 et de 9", { s: 12.5 }) + txt(480, 186, "donc 1 260 est divisible par 3 et par 9", { s: 12.5, c: VERT });
          return svg(640, 232, "Le chiffre des unités de 1 260 et la somme de ses chiffres, égale à 9", "", s);
        })() }, { type: "3d", titre: "Le boulier de 1 260", legende: "Une tige par chiffre : 1 perle, 2 perles, 6 perles, aucune. En tout 9 perles, la somme des chiffres. Le curseur soulève les perles pour mieux les compter.",
          modele: { h: 340, rx: -24, ry: 24, echelle: 0.6, dy: 30, alt: "Boulier à quatre tiges portant 1, 2, 6 et 0 perles, soit neuf perles", eclate: "Soulever les perles", jouer: "Compter les perles", objets: boulier3D(),
            etiquettes: [{ p: [-150, 30, 0], t: "milliers : 1" }, { p: [-50, 50, 0], t: "centaines : 2" }, { p: [50, 150, 0], t: "dizaines : 6", cote: "d" }, { p: [150, 20, 0], t: "unités : 0", cote: "d" }] } }],
        fil: { html: "<p>1 260 se termine par <strong>0</strong> : il est divisible par <strong>2</strong>, par <strong>5</strong> et par <strong>10</strong>. La somme de ses chiffres vaut <strong>1 + 2 + 6 + 0 = 9</strong> : il est divisible par <strong>3</strong> et par <strong>9</strong>. Mais finir par 0 ne suffit pas pour 3 : 10 se termine par 0 et n'est pas divisible par 3.</p>", verdicts: [[1, "rejetee", "Finir par 0 donne 2, 5 et 10, pas « n'importe quel nombre » : 10 n'est pas divisible par 3, et 1 260 ne l'est pas par 8."]] },
        retenir: "2, 5, 10 : le dernier chiffre. 3 et 9 : la somme des chiffres." },

      { t: "Justifier sa réponse", html: partie(V_OLD, 2) +
        "<div class='ex'><b>Rédaction pour la kermesse</b>« 1 260 est divisible par 9 <strong>car</strong> 1 + 2 + 6 + 0 = 9 et 9 est divisible par 9. On peut faire 1 260 ÷ 9 = <strong>140 sachets</strong> de 9. »</div>",
        planches: [{ type: "2D", titre: "Combien de sachets pour chaque taille ?", legende: "1 260 ÷ 2 = 630 ; ÷ 3 = 420 ; ÷ 5 = 252 ; ÷ 9 = 140 ; ÷ 10 = 126. Toutes les tailles conviennent, sans reste.", svg: (function () {
          var id = "dv6c", s = "", T = [[2, 630], [3, 420], [5, 252], [9, 140], [10, 126]], i;
          T.forEach(function (t, k) {
            var x = 14 + k * 125;
            s += "<rect x='" + x + "' y='14' width='112' height='184' rx='12' fill='#F7FAF7' stroke='#BFDCC9'/>";
            s += sachet(id, x + 18, 24, Math.min(t[0], 9));
            s += txt(x + 56, 140, "sachets de " + t[0], { s: 12, c: GRIS }) + txt(x + 56, 168, t[1] + " sachets", { s: 15, c: VERT }) + txt(x + 56, 188, "reste 0 ✓", { s: 11.5, c: VERT });
          });
          return svg(640, 210, "Cinq tailles de sachet et le nombre de sachets obtenus pour 1 260 beignets", defsBeignet(id), s);
        })() }],
        fil: { html: "<p>Les critères tranchent pour les cinq tailles : <strong>toutes conviennent</strong>. Madame Mballa peut choisir selon ses clients : 140 sachets de 9 à 450 F rapportent 63 000 F, comme 126 sachets de 10 à 500 F.</p>", verdicts: [[2, "validee", "Dernier chiffre 0 : 2, 5, 10. Somme des chiffres 9 : 3 et 9. Les cinq tailles conviennent."]] },
        retenir: "On écrit toujours « … est divisible par … car … »." },
      { t: "Entraînement", html: "<div class='integ'><h3>Partie A : évaluation des ressources</h3><p><strong>Question de cours.</strong> Quel critère permet de savoir si un nombre est divisible par 9 ?</p><details><summary>Voir la réponse</summary><p>La somme de ses chiffres doit être divisible par 9.</p></details><p><strong>Exercice.</strong> 2 745 est-il divisible par 2 ? par 3 ? par 5 ? par 9 ? Justifie.</p><details><summary>Voir la réponse</summary><p>Pas par 2 (il se termine par 5, chiffre impair). Par 5 oui (il se termine par 5). 2 + 7 + 4 + 5 = 18 : divisible par 3 et par 9.</p></details>" +
        "<h3>Partie B : évaluation des compétences</h3><p><strong>Situation.</strong> La coopérative scolaire de Mbalmayo a reçu 2 340 cahiers à distribuer en paquets identiques de 2, 4, 5, 9 ou 10.</p><p><strong>Tâche.</strong> Quels paquets permettent de tout distribuer sans reste ? Justifie avec les critères.</p><details><summary>Voir une réponse attendue</summary><p>2 340 se termine par 0 : paquets de 2, 5 et 10 possibles. 2 + 3 + 4 + 0 = 9 : paquets de 9 possibles. Par 4 : 2 340 ÷ 4 = 585, le reste est nul, mais le critère par 4 n'est pas au programme : on le vérifie en posant la division.</p></details></div>",
        retenir: "Savoir-être : organiser un partage équitable." }
    ],
    denouement: {
      titre: "Cinq tailles possibles, sans une seule division posée",
      etapes: [
        "Divisible veut dire « reste nul » : les critères le disent sans poser la division (indice 1).",
        "1 260 se termine par 0 : divisible par 2, par 5 et par 10 (indice 2).",
        "1 + 2 + 6 + 0 = 9 : divisible par 3 et par 9 (indice 2).",
        "Pour chaque taille, on rédige « … car … » et on calcule le nombre de sachets (indice 3)."
      ],
      reponse: "<p>Madame Mballa peut utiliser <strong>toutes les tailles de sachet</strong>. 1 260 est divisible par 2, par 5 et par 10 <strong>car</strong> il se termine par 0 ; il est divisible par 3 et par 9 <strong>car</strong> la somme de ses chiffres, 1 + 2 + 6 + 0 = 9, est divisible par 3 et par 9. Aïcha avait tort : se terminer par 0 ne garantit pas la divisibilité par n'importe quel nombre (10 n'est pas divisible par 3). Elle obtient 630 sachets de 2, 420 de 3, 252 de 5, 140 de 9 ou 126 de 10.</p>",
      transfert: "<p>L'an prochain, elle prévoit 1 455 beignets. Quelles tailles conviennent ? <em>(Se termine par 5 : par 5 oui, par 2 et 10 non. 1 + 4 + 5 + 5 = 15 : par 3 oui, par 9 non.)</em></p>"
    },
    revision: V_OLD ? V_OLD.revision : [],
    exo: V_OLD ? V_OLD.exo : "",
    quiz: [
      q("« 72 est divisible par 9 » signifie :", "le reste de 72 ÷ 9 est 0", "72 se termine par 9", "72 est plus grand que 9", "Divisible = reste nul : 72 = 9 × 8."),
      q("Quel nombre est divisible par 2 ?", "3 548", "1 235", "777", "Il se termine par 8, chiffre pair."),
      q("Quel nombre est divisible par 5 ?", "4 605", "4 562", "4 563", "Il se termine par 5."),
      q("Un nombre est divisible par 10 s'il se termine par :", "0", "0 ou 5", "un chiffre pair", "Exemples : 30, 4 500."),
      q("La somme des chiffres de 4 572 vaut :", "18", "16", "4 572", "4 + 5 + 7 + 2 = 18."),
      q("4 572 est-il divisible par 9 ?", "Oui, car 4 + 5 + 7 + 2 = 18", "Non, car il se termine par 2", "Oui, car il est pair", "18 est dans la table de 9."),
      q("12 est divisible par 3. Est-il divisible par 9 ?", "Non : 1 + 2 = 3", "Oui", "On ne peut pas savoir", "Divisible par 9 entraîne divisible par 3, pas l'inverse."),
      q("1 260 se termine par 0. Il est donc sûrement divisible par :", "2, 5 et 10", "tous les nombres", "3 et 9", "Le dernier chiffre ne dit rien pour 3 et 9."),
      q("Combien de sachets de 9 avec 1 260 beignets ?", "140", "126", "1 251", "1 260 ÷ 9 = 140."),
      q("Quelle rédaction est correcte ?", "« 315 est divisible par 5 car il se termine par 5 »", "« 315 est divisible par 5 »", "« 315 car 5 »", "On donne la conclusion ET le critère.")
    ]
  });

  /* ═══════════════════════ 5e MATHS — LE PGCD DE DEUX ENTIERS ═══════════════════════ */
  var P_OLD = ancien("5e-maths-pgcd");
  /* sol de la classe (360 × 240 cm) pavé de dalles carrées de côté c, vu de dessus ; échelle k px / cm */
  function sol2D(x, y, c, k, lab) {
    var W = 360 * k, H = 240 * k, s = "<g transform='translate(" + x + " " + y + ")'><rect width='" + W + "' height='" + H + "' fill='#F3EEE6' stroke='" + NUIT + "' stroke-width='2'/>", i, j, nx = 360 / c, ny = 240 / c;
    for (i = 0; i < Math.ceil(nx); i++) for (j = 0; j < Math.ceil(ny); j++) {
      var w = Math.min(c, 360 - i * c) * k, h = Math.min(c, 240 - j * c) * k, coupe = w < c * k - 0.1 || h < c * k - 0.1;
      s += "<rect x='" + (i * c * k).toFixed(1) + "' y='" + (j * c * k).toFixed(1) + "' width='" + w.toFixed(1) + "' height='" + h.toFixed(1) + "' fill='" + (coupe ? "#F6C9B8" : ((i + j) % 2 ? "#D7C4A3" : "#E8D9BC")) + "' stroke='#9E8763' stroke-width='1'/>";
    }
    return s + (lab ? txt(W / 2, H + 18, lab, { s: 12.5 }) : "") + "</g>";
  }
  function carrelage3D() {
    var o = [], c = 120, i, j;
    o.push({ f: "boite", c: [0, -10, 0], d: [400, 10, 280], coul: "#8F8A80", dessus: "#B9B3A8", div: false });
    for (i = 0; i < 3; i++) for (j = 0; j < 2; j++) {
      o.push({ f: "boite", c: [-120 + i * c, 0, -60 + j * c], d: [c - 4, 6, c - 4], coul: "#B79A6E", dessus: (i + j) % 2 ? "#D7C4A3" : "#EADCBF", div: false, ec: [0, 30 + (i + j) * 18, 0] });
    }
    return o;
  }

  remplacer("5e-maths-pgcd", {
    c: "5e", m: "maths", titre: "Le PGCD de deux entiers naturels", duree: 30,
    accroche: "Une salle de 360 cm sur 240 cm, des dalles carrées les plus grandes possibles, sans en couper une seule.",
    intro: "Le carrelage de la salle de 5e du lycée de Bertoua te sert de fil rouge : à chaque partie, un indice t'aide à trancher entre trois réponses.",
    objectifs: ["lister les diviseurs d'un entier", "trouver les diviseurs communs à deux entiers", "déterminer le PGCD et l'utiliser dans un problème", "reconnaître deux nombres premiers entre eux et simplifier une fraction"],
    enquete: {
      titre: "Le carrelage de la salle de 5e",
      svg: (function () {
        var s = "<rect width='640' height='220' fill='#F5F0E8'/>";
        s += "<path d='M40 190L180 70H600L620 190Z' fill='#E8D9BC' stroke='#9E8763'/><path d='M180 70V18H600V70' fill='#EEF1F5' stroke='#C9CFD8'/><rect x='300' y='26' width='180' height='34' fill='#1F3B2B'/>";
        s += perso(110, 106, PEAU[2], "#2F6DB5", "#24324A") + perso(160, 112, PEAU[3], "#E86A2E", "#3A2A20", .9);
        s += "<g transform='translate(470 120)'><rect width='70' height='70' fill='#EADCBF' stroke='#9E8763'/><rect x='80' y='20' width='50' height='50' fill='#D7C4A3' stroke='#9E8763'/></g>";
        s += "<rect x='380' y='84' width='240' height='30' rx='10' fill='#fff' stroke='#E3DCCB'/>" + txt(500, 104, "sol : 360 cm × 240 cm", { s: 13, c: "#8A6200" });
        return svg(640, 220, "Une salle de classe au sol nu, deux élèves et des dalles carrées de deux tailles", "", s);
      })(),
      legende: "Au lycée bilingue de Bertoua, l'APEE rénove la salle de 5e pendant les vacances de Pâques.",
      contexte: "<p>Le sol de la salle mesure <strong>360 cm</strong> sur <strong>240 cm</strong>. Le maçon veut des <strong>dalles carrées toutes identiques</strong>, posées sans en couper aucune, et les <strong>plus grandes possible</strong> : moins de dalles, moins de joints, moins de travail.</p><p>Elvis a vu au magasin des dalles de <strong>60 cm</strong>. Sa sœur Manuela propose des dalles de <strong>240 cm</strong> : « une seule rangée et c'est fini ».</p>",
      documents: [{ t: "Le devis du maçon", html: "<table class='donnees'><tr><td>Dalle carrée (toutes tailles)</td><td>sur commande</td></tr><tr><td>Pose</td><td>1 500 F par dalle</td></tr></table>" }],
      question: "Quelle est la plus grande dalle carrée qui recouvre exactement le sol, et combien en faut-il ?",
      tache: "Liste les diviseurs de 360 et de 240, repère les diviseurs communs, puis choisis le plus grand.",
      hypotheses: [
        "Des dalles de 240 cm (Manuela) : la plus grande dalle possible, c'est la largeur de la salle.",
        "Des dalles de 60 cm (Elvis) : elles tombent juste dans les deux sens.",
        "Il existe une dalle plus grande que 60 cm qui tombe juste dans les deux sens : le PGCD de 360 et 240."
      ]
    },
    parties: [
      { t: "Diviseurs et diviseurs communs", html: partie(P_OLD, 0) +
        "<div class='astuce'><b>Pourquoi des diviseurs ?</b>Une dalle de côté c tombe juste sur une longueur L si c <strong>divise</strong> L : on aligne L ÷ c dalles sans en couper. Pour le sol, c doit diviser <strong>360 et 240</strong> : c'est un diviseur <strong>commun</strong>.</div>",
        planches: [{ type: "2D", titre: "Des dalles qui tombent juste… ou pas", legende: "Dalles de 240 cm : elles débordent sur la longueur de 360 cm (la partie rose est à couper). Dalles de 60 cm : 6 sur la longueur, 4 sur la largeur, aucune coupe.", svg: (function () {
          var s = sol2D(20, 30, 240, 0.72, "dalles de 240 cm : 360 ÷ 240 ne tombe pas juste") + sol2D(340, 30, 60, 0.72, "dalles de 60 cm : 6 × 4 = 24 dalles");
          s += txt(150, 20, "360 cm", { s: 12, c: GRIS }) + txt(470, 20, "360 cm", { s: 12, c: GRIS });
          return svg(640, 230, "Le sol pavé de dalles de 240 cm avec une coupe, puis de dalles de 60 cm sans coupe", "", s);
        })() }],
        fil: { html: "<p>Une dalle de 240 cm tient dans la largeur (240 ÷ 240 = 1) mais pas dans la longueur : 360 ÷ 240 = 1 reste 120. Il faudrait couper. <strong>240 ne divise pas 360</strong> : ce n'est pas un diviseur commun.</p>", verdicts: [[0, "rejetee", "240 ne divise pas 360 : il faudrait couper les dalles sur la longueur."]] },
        retenir: "Une dalle tombe juste si son côté divise les deux dimensions." },

      { t: "Le PGCD", html: partie(P_OLD, 1) +
        "<div class='ex'><b>Pour la salle</b>Diviseurs de 240 : 1, 2, 3, 4, 5, 6, 8, 10, 12, 15, 16, 20, 24, 30, 40, 48, 60, 80, <strong>120</strong>, 240.<br>Diviseurs de 360 : 1, 2, 3, 4, 5, 6, 8, 9, 10, 12, 15, 18, 20, 24, 30, 36, 40, 45, 60, 72, 90, <strong>120</strong>, 180, 360.<br>Le plus grand diviseur commun : <strong>PGCD(360 ; 240) = 120</strong>.</div>",
        planches: [{ type: "2D", titre: "Les diviseurs communs, du plus petit au plus grand", legende: "Chaque pastille est un diviseur commun de 360 et 240, donc une taille de dalle possible. La plus grande est 120.", svg: (function () {
          var D = [1, 2, 3, 4, 5, 6, 8, 10, 12, 15, 20, 24, 30, 40, 60, 120], s = "", i;
          s += "<path d='M30 120H620' stroke='#C9D2E3' stroke-width='2'/>";
          D.forEach(function (d, k) {
            var x = 40 + k * 37, r = 9 + Math.sqrt(d) * 1.4, big = d === 120, mid = d === 60;
            s += "<circle cx='" + x + "' cy='120' r='" + r.toFixed(1) + "' fill='" + (big ? VERT : mid ? "#F2B53A" : "#DCE6F5") + "' stroke='" + (big ? VERT : BLEU) + "'/>" + txt(x, 124 + (r > 16 ? 0 : 0), d, { s: d > 99 ? 10.5 : 11, c: big ? "#fff" : NUIT });
          });
          s += txt(594, 70, "PGCD = 120", { s: 15, c: VERT }) + "<path d='M594 78V96' stroke='" + VERT + "' stroke-width='2'/>";
          s += txt(470, 186, "60 : possible, mais pas le plus grand", { s: 11.5, c: "#8A6200" });
          return svg(640, 210, "Les seize diviseurs communs de 360 et 240 alignés, le plus grand étant 120", "", s);
        })() }],
        fil: { html: "<p>60 est bien un diviseur commun (360 = 60 × 6 et 240 = 60 × 4) : les dalles d'Elvis tombent juste. Mais ce n'est <strong>pas le plus grand</strong> : 120 divise aussi 360 et 240. Le maçon veut les plus grandes dalles : il lui faut le <strong>PGCD</strong>.</p>", verdicts: [[1, "rejetee", "60 cm convient, mais 120 cm convient aussi et c'est plus grand."]] },
        retenir: "PGCD = le plus grand des diviseurs communs." },

      { t: "Premiers entre eux et fractions", html: partie(P_OLD, 2),
        planches: [{ type: "3d", titre: "Six dalles de 120 cm", legende: "360 ÷ 120 = 3 dalles sur la longueur, 240 ÷ 120 = 2 sur la largeur : 3 × 2 = 6 dalles. Le curseur soulève les dalles pour les compter.",
          modele: { h: 340, rx: -32, ry: 28, echelle: 0.82, alt: "Le sol de la classe recouvert de six grandes dalles carrées de 120 centimètres", eclate: "Soulever les dalles", jouer: "Poser les dalles", objets: carrelage3D(),
            etiquettes: [{ p: [-120, 10, -60], t: "120 cm × 120 cm" }, { p: [120, 10, 60], t: "3 × 2 = 6 dalles", cote: "d" }] } },
          { type: "2D", titre: "Le même sol, deux carrelages", legende: "Avec 60 cm : 24 dalles et 36 000 F de pose. Avec 120 cm : 6 dalles et 9 000 F de pose.", svg: (function () {
            var s = sol2D(20, 20, 60, 0.72, "60 cm : 24 dalles, 36 000 F") + sol2D(340, 20, 120, 0.72, "120 cm : 6 dalles, 9 000 F");
            return svg(640, 220, "Le sol en vingt-quatre dalles de 60 cm et en six dalles de 120 cm", "", s);
          })() }],
        fil: { html: "<p>Avec des dalles de <strong>120 cm</strong>, on en pose 3 sur la longueur et 2 sur la largeur : <strong>6 dalles</strong>, et la pose coûte 6 × 1 500 = <strong>9 000 F</strong> au lieu de 24 × 1 500 = 36 000 F avec des dalles de 60 cm. Et 360/240 = 3/2 : 3 et 2 sont premiers entre eux.</p>", verdicts: [[2, "validee", "PGCD(360 ; 240) = 120 : 6 dalles de 120 cm, sans coupe."]] },
        retenir: "PGCD = 1 : premiers entre eux, fraction irréductible." },
      { t: "Entraînement", html: "<div class='integ'><h3>Partie A : évaluation des ressources</h3><p><strong>Question de cours.</strong> Que signifie PGCD ?</p><details><summary>Voir la réponse</summary><p>Plus Grand Commun Diviseur.</p></details><p><strong>Exercice.</strong> Calcule PGCD(48 ; 60), puis simplifie 48/60.</p><details><summary>Voir la réponse</summary><p>Diviseurs communs : 1, 2, 3, 4, 6, 12. PGCD = 12, et 48/60 = 4/5.</p></details>" +
        "<h3>Partie B : évaluation des compétences</h3><p><strong>Situation.</strong> Un tailleur de Maroua a un pagne de 150 cm sur 90 cm. Il veut le découper en carrés identiques, les plus grands possible, sans chute.</p><p><strong>Tâche.</strong> Quelle taille de carré ? Combien de carrés ?</p><details><summary>Voir une réponse attendue</summary><p>PGCD(150 ; 90) = 30 : des carrés de 30 cm, 5 sur la longueur et 3 sur la largeur, soit 15 carrés.</p></details></div>",
        retenir: "Savoir-être : économiser la matière et le travail." }
    ],
    denouement: {
      titre: "Six dalles de 120 cm",
      etapes: [
        "Le côté de la dalle doit diviser 360 et 240 : c'est un diviseur commun ; 240 ne divise pas 360 (indice 1).",
        "Les diviseurs communs vont de 1 à 120 ; 60 en fait partie mais n'est pas le plus grand (indice 2).",
        "PGCD(360 ; 240) = 120 : 3 dalles × 2 dalles = 6 dalles (indice 3).",
        "Pose : 6 × 1 500 F = 9 000 F (indice 3)."
      ],
      reponse: "<p>Le côté d'une dalle qui tombe juste doit diviser à la fois 360 et 240. Les diviseurs communs de 360 et 240 sont 1, 2, 3, 4, 5, 6, 8, 10, 12, 15, 20, 24, 30, 40, 60 et 120 ; le plus grand est <strong>PGCD(360 ; 240) = 120</strong>. Le maçon pose donc des dalles de <strong>120 cm</strong> : 360 ÷ 120 = 3 sur la longueur et 240 ÷ 120 = 2 sur la largeur, soit <strong>6 dalles</strong>, pour 9 000 F de pose. Les dalles de 240 cm ne tombent pas juste, et celles de 60 cm conviennent mais ne sont pas les plus grandes.</p>",
      transfert: "<p>La salle voisine mesure 420 cm sur 300 cm. Quelle dalle choisir, et combien en faut-il ? <em>(PGCD(420 ; 300) = 60 : 7 × 5 = 35 dalles de 60 cm.)</em></p>"
    },
    revision: P_OLD ? P_OLD.revision : [],
    exo: P_OLD ? P_OLD.exo : "",
    quiz: [
      q("Un diviseur commun de 12 et 18 est :", "6", "36", "5", "12 = 6 × 2 et 18 = 6 × 3."),
      q("PGCD(18 ; 24) = ?", "6", "3", "72", "Diviseurs communs : 1, 2, 3, 6."),
      q("PGCD(360 ; 240) = ?", "120", "60", "240", "120 divise 360 et 240, et aucun plus grand ne les divise tous les deux."),
      q("Une dalle de 240 cm tombe-t-elle juste sur 360 cm ?", "Non : 360 = 240 × 1 + 120", "Oui", "Seulement dans un sens", "240 ne divise pas 360."),
      q("Combien de dalles de 120 cm pour un sol de 360 cm × 240 cm ?", "6", "3", "12", "3 sur la longueur × 2 sur la largeur."),
      q("8 et 15 sont…", "premiers entre eux", "multiples l'un de l'autre", "tous deux premiers", "PGCD(8 ; 15) = 1, même si 8 et 15 ne sont pas premiers."),
      q("Simplifier 24/36 au maximum :", "2/3", "12/18", "4/6", "On divise par le PGCD 12."),
      q("Le PGCD de deux nombres est toujours :", "un diviseur de chacun des deux", "un multiple des deux", "plus grand que les deux", "C'est un diviseur commun."),
      q("PGCD(7 ; 21) = ?", "7", "1", "21", "7 divise 21."),
      q("48 roses et 60 tulipes en bouquets identiques, le plus possible : combien de bouquets ?", "12", "6", "24", "PGCD(48 ; 60) = 12 : 4 roses et 5 tulipes par bouquet.")
    ]
  });

  /* ═══════════════════════ 4e MATHS — DÉCOMPOSITION EN PRODUIT DE FACTEURS PREMIERS ═══════════════════════ */
  var F_OLD = ancien("4e-maths-facteurs-premiers");
  /* une formation rectangulaire de n rangées de m élèves (2D, vue de dessus) */
  function formation2D(x, y, n, m, pas, coul) {
    var s = "<g transform='translate(" + x + " " + y + ")'>", i, j;
    for (i = 0; i < n; i++) for (j = 0; j < m; j++) s += "<circle cx='" + (j * pas).toFixed(1) + "' cy='" + (i * pas).toFixed(1) + "' r='" + (pas * 0.36).toFixed(1) + "' fill='" + coul + "'/>";
    return s + "</g>";
  }
  /* défilé 3D : 18 rangées de 20 élèves (casquettes et chemises) */
  function defile3D() {
    var o = [], i, j, n = 18, m = 20, e = 18;
    o.push({ f: "boite", c: [0, -6, 0], d: [m * e + 60, 6, n * e + 60], coul: "#7E8A6A", dessus: "#9AA884" });
    for (i = 0; i < n; i++) for (j = 0; j < m; j++) {
      var x = (j - (m - 1) / 2) * e, z = (i - (n - 1) / 2) * e, ec = [0, 0, (i - (n - 1) / 2) * 3];
      o.push({ f: "cylindre", c: [x, 0, z], r: 5, h: 16, n: 8, coul: i % 2 ? "#2F6DB5" : "#F2F4F7", dessus: "#E3E6EA", ec: ec });
      o.push({ f: "sphere", c: [x, 21, z], r: 4.6, coul: "#6B4226", ec: ec });
    }
    o.push({ f: "boite", c: [0, 26, -(n * e) / 2 - 50], d: [160, 52, 20], coul: "#C62828", dessus: "#E04848" });
    return o;
  }

  remplacer("4e-maths-facteurs-premiers", {
    c: "4e", m: "maths", titre: "Décomposer un nombre en produit de facteurs premiers", duree: 35,
    accroche: "360 élèves pour le défilé du 20 mai, en rectangle parfait : combien de façons de les ranger ?",
    intro: "Le défilé du lycée de Kribi te sert de fil rouge : à chaque partie, un indice t'aide à trancher entre trois réponses.",
    objectifs: ["reconnaître un nombre premier", "décomposer un entier en produit de facteurs premiers", "utiliser la décomposition pour trouver les diviseurs d'un nombre", "simplifier une fraction grâce à la décomposition"],
    enquete: {
      titre: "Le défilé du 20 mai",
      svg: (function () {
        var s = "<rect width='640' height='220' fill='#EAF4FB'/><rect y='150' width='640' height='70' fill='#9AA884'/>";
        s += "<rect x='420' y='60' width='190' height='90' fill='#E3E6EA' stroke='#B9C0CA'/><path d='M410 60L515 30L620 60Z' fill='#C62828'/>" + txt(515, 110, "TRIBUNE", { s: 13, c: GRIS });
        [["#17784D", 0], ["#C62828", 1], ["#F2C230", 2]].forEach(function (c) { s += "<rect x='" + (470 + c[1] * 30) + "' y='40' width='30' height='20' fill='" + c[0] + "'/>"; });
        s += "<path d='M485 50l2.5 5 5.5.5-4 3.6 1.2 5.4-5.2-2.8-5.2 2.8 1.2-5.4-4-3.6 5.5-.5z' fill='#F2C230' transform='translate(15 -6) scale(.8)'/>";
        s += formation2D(40, 160, 4, 18, 18, "#2F6DB5");
        s += perso(370, 74, PEAU[1], "#17784D", "#24324A");
        s += "<rect x='40' y='30' width='300' height='34' rx='12' fill='#fff' stroke='#C9D8EE'/>" + txt(190, 52, "360 élèves, rangées égales", { s: 13, c: BLEU });
        return svg(640, 220, "Des élèves en rangées devant une tribune aux couleurs du Cameroun, et le surveillant général", "", s);
      })(),
      legende: "Lycée de Kribi, le 19 mai : la répétition générale du défilé de la fête nationale.",
      contexte: "<p>Le surveillant général doit faire défiler <strong>360 élèves</strong> en <strong>rectangle complet</strong> : toutes les rangées ont le même nombre d'élèves, et il n'y a personne en trop. Il veut connaître <strong>toutes les dispositions possibles</strong> (nombre de rangées × élèves par rangée) pour choisir la plus belle.</p><p>Bertrand pense qu'il y en a « une dizaine ». Ruth veut essayer chaque nombre de rangées, de 1 à 360.</p>",
      documents: [{ t: "Les contraintes", html: "<table class='donnees'><tr><td>Élèves</td><td>360</td></tr><tr><td>Rangées</td><td>toutes égales, sans élève en trop</td></tr></table>" }],
      question: "Combien de dispositions rectangulaires (rangées × élèves par rangée) sont possibles avec 360 élèves ?",
      tache: "Décompose 360 en produit de facteurs premiers, puis construis tous ses diviseurs.",
      hypotheses: [
        "« Une dizaine » (Bertrand), en essayant quelques nombres au hasard.",
        "Il faut essayer chacun des nombres de 1 à 360 (Ruth), il n'y a pas plus rapide.",
        "La décomposition 360 = 2³ × 3² × 5 donne tous les diviseurs, donc toutes les dispositions."
      ]
    },
    parties: [
      { t: "Les nombres premiers", html: partie(F_OLD, 0),
        planches: [{ type: "2D", titre: "Le crible : les nombres premiers jusqu'à 50", legende: "On barre les multiples de 2, de 3, de 5 et de 7 (sauf eux-mêmes) : il reste les 15 nombres premiers inférieurs à 50.", svg: (function () {
          var s = "", n, P = function (k) { if (k < 2) return false; for (var d = 2; d * d <= k; d++) if (k % d === 0) return false; return true; };
          for (n = 1; n <= 50; n++) {
            var i = (n - 1) % 10, j = Math.floor((n - 1) / 10), x = 20 + i * 60, y = 16 + j * 42, p = P(n);
            s += "<rect x='" + x + "' y='" + y + "' width='54' height='36' rx='8' fill='" + (p ? "#E8F5EC" : "#F4F5F8") + "' stroke='" + (p ? VERT : "#D5DAE3") + "'/>" + txt(x + 27, y + 24, n, { s: 15, c: p ? VERT : "#A2AABA" });
            if (!p && n > 1) s += "<path d='M" + (x + 8) + " " + (y + 30) + "L" + (x + 46) + " " + (y + 6) + "' stroke='#C9CFD8' stroke-width='1.6'/>";
          }
          return svg(640, 232, "Les nombres de 1 à 50, les nombres premiers en vert, les autres barrés", "", s);
        })() }],
        fil: { html: "<p>Les briques de base sont les <strong>nombres premiers</strong> : 2, 3, 5, 7, 11… Essayer des nombres « au hasard » risque d'en oublier : il faut une méthode qui n'en oublie aucun.</p>", verdicts: [[0, "rejetee", "Au hasard, on en oublie : il faut une méthode complète."]] },
        retenir: "Premier = deux diviseurs exactement : 1 et lui-même." },

      { t: "La méthode des divisions successives", html: partie(F_OLD, 1),
        planches: [{ type: "2D", titre: "L'arbre de 360", legende: "On casse 360 en deux facteurs, puis chaque facteur, jusqu'à n'avoir que des nombres premiers (en vert) : 360 = 2 × 2 × 2 × 3 × 3 × 5 = 2³ × 3² × 5.", svg: (function () {
          var N = [[320, 30, "360", 0], [200, 90, "36", 0], [440, 90, "10", 0], [140, 150, "6", 0], [260, 150, "6", 0], [400, 150, "2", 1], [480, 150, "5", 1], [90, 210, "2", 1], [170, 210, "3", 1], [230, 210, "2", 1], [310, 210, "3", 1]];
          var E = [[0, 1], [0, 2], [1, 3], [1, 4], [2, 5], [2, 6], [3, 7], [3, 8], [4, 9], [4, 10]], s = "";
          E.forEach(function (e) { s += "<path d='M" + N[e[0]][0] + " " + (N[e[0]][1] + 14) + "L" + N[e[1]][0] + " " + (N[e[1]][1] - 16) + "' stroke='#9AA4B6' stroke-width='2'/>"; });
          N.forEach(function (n) { s += "<circle cx='" + n[0] + "' cy='" + n[1] + "' r='19' fill='" + (n[3] ? VERT : "#fff") + "' stroke='" + (n[3] ? VERT : BLEU) + "' stroke-width='2'/>" + txt(n[0], n[1] + 5, n[2], { s: 14, c: n[3] ? "#fff" : NUIT }); });
          s += "<rect x='420' y='196' width='200' height='34' rx='10' fill='#FFF8E6' stroke='#F2DFA6'/>" + txt(520, 218, "360 = 2³ × 3² × 5", { s: 15, c: "#8A6200" });
          return svg(640, 245, "Arbre de décomposition de 360 en facteurs premiers 2, 2, 2, 3, 3 et 5", "", s);
        })() }],
        fil: { html: "<p>Décomposé, 360 s'écrit <strong>2³ × 3² × 5</strong>. Tout diviseur de 360 est fait <strong>des mêmes briques</strong> : 0 à 3 fois le 2, 0 à 2 fois le 3, 0 ou 1 fois le 5. Inutile d'essayer les 360 nombres : on <strong>construit</strong> les diviseurs.</p>", verdicts: [[1, "rejetee", "Essayer 360 nombres est inutile : la décomposition fabrique directement tous les diviseurs."]] },
        retenir: "On divise par 2, puis 3, puis 5, 7… tant que c'est possible." },

      { t: "Construire les diviseurs, simplifier une fraction", html:
        "<div class='prop'><b>Tous les diviseurs de 360</b>On choisit combien de 2 (0, 1, 2 ou 3 : <strong>4 choix</strong>), combien de 3 (0, 1 ou 2 : <strong>3 choix</strong>), combien de 5 (0 ou 1 : <strong>2 choix</strong>). Cela fait 4 × 3 × 2 = <strong>24 diviseurs</strong>.</div>" +
        "<div class='ex'><b>La liste</b>1, 2, 3, 4, 5, 6, 8, 9, 10, 12, 15, 18, 20, 24, 30, 36, 40, 45, 60, 72, 90, 120, 180, 360.</div>" + partie(F_OLD, 2),
        planches: [{ type: "3d", titre: "Le défilé en 18 rangées de 20", legende: "Une des 24 dispositions : 18 rangées de 20 élèves (18 × 20 = 360). Le curseur écarte les rangées pour les compter.",
          modele: { h: 360, rx: -30, ry: 22, echelle: 0.62, alt: "Trois cent soixante élèves en dix-huit rangées de vingt devant une tribune", eclate: "Écarter les rangées", jouer: "Compter les rangées", objets: defile3D(),
            etiquettes: [{ p: [-171, 20, -153], t: "20 élèves par rangée" }, { p: [171, 20, 153], t: "18 rangées", cote: "d" }] } },
          { type: "2D", titre: "Les 24 diviseurs de 360, rangés par paires", legende: "Chaque paire donne une disposition et sa « tournée » : 1 × 360, 2 × 180, 3 × 120… jusqu'à 18 × 20. Douze paires, donc 24 dispositions si l'on distingue rangées et colonnes.", svg: (function () {
            var P = [[1, 360], [2, 180], [3, 120], [4, 90], [5, 72], [6, 60], [8, 45], [9, 40], [10, 36], [12, 30], [15, 24], [18, 20]], s = "";
            P.forEach(function (p, k) {
              var x = 18 + (k % 6) * 104, y = 18 + Math.floor(k / 6) * 104;
              s += "<rect x='" + x + "' y='" + y + "' width='96' height='92' rx='12' fill='#F5F8FD' stroke='#C9D8EE'/>" + txt(x + 48, y + 26, p[0] + " × " + p[1], { s: 15, c: BLEU });
              var r = Math.min(p[0], 6), c = Math.min(p[1], 12);
              s += formation2D(x + 48 - (c - 1) * 3.4, y + 44, r, c, 6.8, k === 11 ? VERT : "#7FA6D9");
            });
            return svg(640, 230, "Les douze paires de diviseurs de 360, chacune avec une petite formation", "", s);
          })() }],
        fil: { html: "<p>360 a <strong>24 diviseurs</strong>, donc <strong>24 dispositions</strong> : 1 rangée de 360, 2 de 180… 18 rangées de 20, 20 rangées de 18… jusqu'à 360 rangées de 1. Le surveillant choisit 18 rangées de 20, presque un carré.</p>", verdicts: [[2, "validee", "360 = 2³ × 3² × 5 : 4 × 3 × 2 = 24 diviseurs, donc 24 dispositions."]] },
        retenir: "Les diviseurs d'un nombre sont faits de ses facteurs premiers." },
      F_OLD && F_OLD.parties[3] ? F_OLD.parties[3] : { t: "Entraînement", html: "" }
    ],
    denouement: {
      titre: "24 dispositions, dont 18 rangées de 20",
      etapes: [
        "Les briques des nombres sont les nombres premiers ; au hasard, on en oublie (indice 1).",
        "Divisions successives : 360 = 2³ × 3² × 5 (indice 2).",
        "Un diviseur choisit 0 à 3 fois le 2, 0 à 2 fois le 3, 0 ou 1 fois le 5 : 4 × 3 × 2 = 24 (indice 3).",
        "La disposition la plus proche du carré : 18 rangées de 20 (indice 3)."
      ],
      reponse: "<p>On décompose 360 en produit de facteurs premiers : 360 = 2 × 2 × 2 × 3 × 3 × 5 = <strong>2³ × 3² × 5</strong>. Un diviseur de 360 s'obtient en choisissant combien de fois il contient 2 (0 à 3), 3 (0 à 2) et 5 (0 ou 1) : 4 × 3 × 2 = <strong>24 diviseurs</strong>. Chaque diviseur d est un nombre de rangées possible, avec 360 ÷ d élèves par rangée : il y a donc <strong>24 dispositions</strong>. La plus proche d'un carré est <strong>18 rangées de 20 élèves</strong>. Bertrand sous-estimait, et Ruth n'avait pas besoin d'essayer les 360 nombres.</p>",
      transfert: "<p>L'an prochain, le lycée aura 420 élèves. Décompose 420 et compte les dispositions. <em>(420 = 2² × 3 × 5 × 7 : 3 × 2 × 2 × 2 = 24 dispositions, dont 20 rangées de 21.)</em></p>"
    },
    revision: F_OLD ? F_OLD.revision : [],
    exo: F_OLD ? F_OLD.exo : "",
    quiz: [
      q("Un nombre premier a :", "exactement deux diviseurs", "un seul diviseur", "trois diviseurs", "1 et lui-même."),
      q("Lequel est premier ?", "23", "21", "27", "21 = 3 × 7 ; 27 = 3³."),
      q("1 est-il premier ?", "Non : il n'a qu'un seul diviseur", "Oui", "Seulement en 4e", "Il faut exactement deux diviseurs."),
      q("La décomposition de 360 est :", "2³ × 3² × 5", "2 × 180", "6² × 10", "On ne garde que des facteurs premiers."),
      q("La décomposition de 84 est :", "2² × 3 × 7", "4 × 21", "2 × 42", "84 = 2 × 2 × 3 × 7."),
      q("Combien de diviseurs a 360 = 2³ × 3² × 5 ?", "24", "6", "10", "4 × 3 × 2 = 24."),
      q("Combien de dispositions rectangulaires pour 360 élèves ?", "24", "12", "360", "Autant que de diviseurs."),
      q("Le seul nombre premier pair est :", "2", "4", "0", "Tous les autres pairs sont divisibles par 2."),
      q("84/126 simplifiée au maximum vaut :", "2/3", "42/63", "14/21", "On supprime les facteurs communs 2 × 3 × 7 = 42."),
      q("Pour décomposer, on divise d'abord par :", "le plus petit nombre premier possible", "le plus grand diviseur", "10", "2, puis 3, puis 5, 7…")
    ]
  });

  /* ═══════════════════════ SIMULATIONS ═══════════════════════ */
  function $(el, s) { return el.querySelector(s); }
  function curseur(lib, min, max, pas, val, unite) {
    return "<label class='labo-c'><span>" + lib + " : <b data-v>" + val + "</b>" + (unite || "") + "</span><input type='range' min='" + min + "' max='" + max + "' step='" + pas + "' value='" + val + "'></label>";
  }

  /* Divisibilité : emballer les beignets en sachets de b */
  VRT_A("6e-maths-divisibilite", 0, "Emballe les beignets : reste-t-il quelque chose ?", function (el) {
    el.innerHTML = "<div style='display:flex;flex-wrap:wrap;gap:8px 18px'>" + curseur("Beignets", 10, 1500, 1, 1260) + curseur("Beignets par sachet", 2, 12, 1, 9) + "</div><svg viewBox='0 0 640 120' class='an-svg' data-s></svg><p class='labo-r' data-r></p>";
    var I = el.querySelectorAll("input"), V = el.querySelectorAll("[data-v]"), sv = $(el, "[data-s]");
    function crit(a, b) {
      var u = a % 10, som = String(a).split("").reduce(function (x, c) { return x + (+c); }, 0);
      if (b === 2) return "dernier chiffre " + u + (u % 2 ? " (impair)" : " (pair)");
      if (b === 5) return "dernier chiffre " + u;
      if (b === 10) return "dernier chiffre " + u;
      if (b === 3 || b === 9) return "somme des chiffres " + som;
      return "pas de critère au programme : on pose la division";
    }
    function maj() {
      var a = +I[0].value, b = +I[1].value, qq = Math.floor(a / b), r = a % b, s = "<defs>" + rad("dsb", ["#F6C66A", "#D98A2B", "#9A5418"]) + "</defs>", k, n = Math.min(qq, 28);
      V[0].textContent = a; V[1].textContent = b;
      for (k = 0; k < n; k++) s += "<rect x='" + (8 + (k % 15) * 42) + "' y='" + (8 + Math.floor(k / 15) * 44) + "' width='36' height='38' rx='7' fill='#EAF4FB' stroke='#8FB3CF'/><circle cx='" + (26 + (k % 15) * 42) + "' cy='" + (27 + Math.floor(k / 15) * 44) + "' r='9' fill='url(#dsb)'/>";
      for (k = 0; k < r; k++) s += "<circle cx='" + (16 + k * 22) + "' cy='108' r='8' fill='url(#dsb)'/>";
      sv.innerHTML = s + (qq > n ? "<text x='632' y='108' font-size='12' font-weight='700' text-anchor='end' fill='" + GRIS + "'>… " + qq + " sachets en tout</text>" : "");
      $(el, "[data-r]").innerHTML = (r ? "<b>" + a + " n'est pas divisible par " + b + "</b> : il reste " + r + " beignet" + (r > 1 ? "s" : "") + "." : "<b>" + a + " est divisible par " + b + "</b> : " + qq + " sachets, reste 0.") + " Critère : " + crit(a, b) + ".";
    }
    I[0].addEventListener("input", maj); I[1].addEventListener("input", maj); maj();
  });

  /* PGCD : choisir la taille des dalles */
  VRT_A("5e-maths-pgcd", 0, "Choisis la taille des dalles", function (el) {
    var T = [10, 20, 30, 40, 45, 60, 72, 80, 90, 120, 180, 240];
    el.innerHTML = "<div style='display:flex;flex-wrap:wrap;gap:6px' data-b>" + T.map(function (t) { return "<button type='button' class='btn-l' data-t='" + t + "'>" + t + " cm</button>"; }).join("") + "</div><svg viewBox='0 0 640 290' class='an-svg' data-s></svg><p class='labo-r' data-r>Touche une taille de dalle.</p>";
    var sv = $(el, "[data-s]");
    function maj(c) {
      sv.innerHTML = sol2D(140, 10, c, 1).replace("<g transform='translate(140 10)'>", "<g transform='translate(140 10) scale(1)'>");
      el.querySelectorAll("[data-t]").forEach(function (b) { b.classList.toggle("on", +b.getAttribute("data-t") === c); b.setAttribute("aria-pressed", +b.getAttribute("data-t") === c ? "true" : "false"); });
      var ok = 360 % c === 0 && 240 % c === 0, n = ok ? (360 / c) * (240 / c) : 0;
      $(el, "[data-r]").innerHTML = ok ? "<b>" + c + " cm tombe juste</b> : " + (360 / c) + " × " + (240 / c) + " = " + n + " dalles, " + (n * 1500).toLocaleString("fr-FR") + " F de pose." + (c === 120 ? " <b>C'est le PGCD : la plus grande dalle possible.</b>" : " Une dalle plus grande tomberait-elle juste ?")
        : "<b>" + c + " cm ne tombe pas juste</b> : " + (360 % c ? "360 = " + c + " × " + Math.floor(360 / c) + " + " + (360 % c) : "") + (360 % c && 240 % c ? " et " : "") + (240 % c ? "240 = " + c + " × " + Math.floor(240 / c) + " + " + (240 % c) : "") + ". Les dalles roses seraient à couper.";
    }
    el.querySelectorAll("[data-t]").forEach(function (b) { b.addEventListener("click", function () { maj(+b.getAttribute("data-t")); }); });
    maj(60);
  });

  /* Facteurs premiers : l'arbre d'un nombre au choix et ses dispositions */
  VRT_A("4e-maths-facteurs-premiers", 1, "Décompose un nombre : l'arbre se construit tout seul", function (el) {
    el.innerHTML = curseur("Nombre d'élèves", 2, 600, 1, 360) + "<svg viewBox='0 0 640 120' class='an-svg' data-s></svg><p class='labo-r' data-r></p>";
    var I = $(el, "input"), V = $(el, "[data-v]"), sv = $(el, "[data-s]"), SUP = { 2: "²", 3: "³", 4: "⁴", 5: "⁵", 6: "⁶", 7: "⁷", 8: "⁸", 9: "⁹" };
    function maj() {
      var n = +I.value, x = n, d = 2, f = [], steps = [], s = "";
      V.textContent = n;
      while (x > 1) { if (x % d === 0) { steps.push([x, d]); f.push(d); x /= d; } else d++; }
      steps.forEach(function (st, k) {
        var xx = 14 + k * 70; if (xx > 600) return;
        s += "<rect x='" + xx + "' y='18' width='60' height='34' rx='8' fill='#fff' stroke='" + BLEU + "'/><text x='" + (xx + 30) + "' y='41' font-size='14' font-weight='700' text-anchor='middle' fill='" + NUIT + "'>" + st[0] + "</text>";
        s += "<circle cx='" + (xx + 30) + "' cy='84' r='16' fill='" + VERT + "'/><text x='" + (xx + 30) + "' y='89' font-size='13' font-weight='700' text-anchor='middle' fill='#fff'>" + st[1] + "</text><path d='M" + (xx + 30) + " 52V68' stroke='#9AA4B6' stroke-width='2'/>";
      });
      sv.innerHTML = s;
      var c = {}; f.forEach(function (p) { c[p] = (c[p] || 0) + 1; });
      var ecr = Object.keys(c).map(function (p) { return p + (c[p] > 1 ? (SUP[c[p]] || "^" + c[p]) : ""); }).join(" × ");
      var nd = Object.keys(c).reduce(function (a, p) { return a * (c[p] + 1); }, 1);
      var pres = 1; for (var k = 1; k * k <= n; k++) if (n % k === 0) pres = k;
      $(el, "[data-r]").innerHTML = "<b>" + n + " = " + (f.length === 1 ? n + " (nombre premier)" : ecr) + "</b> · " + nd + " diviseurs, donc " + nd + " dispositions · la plus proche du carré : <b>" + pres + " rangées de " + (n / pres) + "</b>" + (f.length === 1 ? " · un nombre premier ne se range qu'en une seule ligne !" : "");
    }
    I.addEventListener("input", maj); maj();
  });
})();
