/* Leçons GRATUITES — Histoire de 6e, lot 3 (24/11/2026) : rangs 12 (Méroé, Kouch, Axoum), 14 (la Grèce antique),
   16 (la Chine). Même gabarit que 36- et 37-histoire-6e : situation-problème résolue en étapes et formules,
   2 planches 2D, 1 planche 3D, simulation, entraînement, quiz de 10. */
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



  /* ═══════════════ RANG 12 : MÉROÉ, KOUCH, AXOUM ═══════════════ */
  function meroe3D() {
    var o = [{ f: "boite", c: [0, -6, 0], d: [500, 6, 280], coul: "#D8B47A", dessus: "#E6C48A" }];
    function pyr(x, z, s, h, c1, c2) {
      var A = [x - s, 0, z - s], B = [x + s, 0, z - s], C = [x + s, 0, z + s], D = [x - s, 0, z + s], T = [x, h, z];
      o.push({ f: "poly", pts: [A, B, T], coul: c1 }); o.push({ f: "poly", pts: [B, C, T], coul: c2 }); o.push({ f: "poly", pts: [C, D, T], coul: c2 }); o.push({ f: "poly", pts: [D, A, T], coul: c1 });
      o.push({ f: "boite", c: [x, 10, z - s - 10], d: [s * 0.9, 20, 16], coul: c2, dessus: c1 });
    }
    pyr(-150, 40, 34, 110, "#B5834E", "#9A6A3A"); pyr(-60, 70, 28, 92, "#B5834E", "#9A6A3A"); pyr(20, 30, 38, 124, "#C08A52", "#A0703E");
    o.push({ f: "cylindre", c: [150, 0, -40], r: 22, h: 46, n: 14, coul: "#7A4A2A" });
    o.push({ f: "cylindre", c: [150, 46, -40], r: 10, h: 10, n: 12, coul: "#E8842C" });
    o.push({ f: "boite", c: [190, 8, -80], d: [50, 16, 30], coul: "#2E3445", dessus: "#4D5163" });
    o.push({ f: "boite", c: [120, 4, -110], d: [70, 8, 26], coul: "#3F3F48", dessus: "#55555E" });
    o.push({ f: "boite", c: [0, 2, -130], d: [500, 4, 30], coul: "#3F78B8", dessus: "#5A93D0" });
    return o;
  }
  VRT_L("6e-histoire-meroe-axoum", {
    c: "6e", m: "histoire", cle: "Méroé, Kouch, Axoum", titre: "Kouch, Méroé et Axoum : les royaumes du haut Nil", duree: 30,
    accroche: "« Les pyramides, c'est seulement l'Égypte ! » Pourtant, le pays qui compte le plus de pyramides au monde n'est pas l'Égypte, mais le Soudan. Qui les a construites ?",
    intro: "Un documentaire regardé en classe à Bertoua te sert de fil rouge : à chaque partie, un indice t'aide à trancher entre trois idées sur les royaumes du haut Nil.",
    objectifs: ["situer Kouch, Méroé et Axoum sur la carte et dans le temps", "expliquer comment Kouch a dominé l'Égypte", "décrire la puissance de Méroé : pyramides, fer, écriture", "présenter Axoum : commerce, monnaie, stèles, christianisme"],
    enquete: {
      titre: "Le documentaire de Bertoua",
      svg: svg(640, 220, "Salle de classe : un écran montre un champ de pyramides pointues dans le désert du Soudan ; trois élèves débattent", lin("meC", ["#FBEFD8", "#EEDBB2"], true),
        "<rect width='640' height='220' fill='url(#meC)'/><rect y='186' width='640' height='34' fill='#C9A06E'/><rect x='200' y='16' width='240' height='140' rx='8' fill='#1F2328'/><rect x='210' y='26' width='220' height='120' fill='#F4E2B8'/>" +
        "<path d='M230 146L250 80L270 146Z' fill='#B5834E'/><path d='M280 146L305 64L330 146Z' fill='#A0703E'/><path d='M340 146L360 88L380 146Z' fill='#B5834E'/><path d='M390 146L408 96L426 146Z' fill='#A0703E'/>" +
        perso(100, 98, "#5A3A1E", "#C2540A", "#2E3445") + perso(530, 98, "#6B4423", "#1E499B", "#2E3445") + perso(590, 104, "#4A2E18", "#17784D", "#2E3445") +
        bulle(14, 40, 180, "Ça, c'est l'Égypte !", "#F7C948") + bulle(450, 40, 180, "Non, c'est le Soudan !", "#9FC3E8")),
      legende: "À Bertoua, la classe de 6e regarde un documentaire sur les pyramides de Méroé, au Soudan.",
      contexte: "<p>Pendant le documentaire, un champ de petites pyramides pointues apparaît. Ramatou s'écrie : « C'est l'Égypte ! » Le professeur répond que ces pyramides se trouvent au Soudan, à Méroé. Didier hausse les épaules : « Alors ce sont des copies faites par des Égyptiens. » Christelle, elle, pense que ces peuples « vivaient dans l'ombre de l'Égypte et n'ont rien inventé ». Le professeur leur confie une enquête sur les royaumes du haut Nil.</p>",
      documents: [{ t: "Une dynastie venue du sud", html: "<p>Au VIIIe siècle av. J.-C., les rois de Kouch, venus de Napata, conquièrent l'Égypte. Pendant près d'un siècle, ils règnent comme pharaons sur les deux pays : c'est la XXVe dynastie, celle des « pharaons noirs ».</p>" },
        { t: "Méroé, la ville du fer", html: "<p>Autour des ruines de Méroé, les archéologues ont trouvé d'énormes amas de scories, les déchets laissés par la fonte du minerai de fer.</p>" }],
      question: "Les royaumes de Kouch, Méroé et Axoum n'étaient-ils que des copies de l'Égypte, ou des puissances africaines originales ?",
      tache: "Situe ces royaumes, explique comment Kouch a dominé l'Égypte, puis présente les créations de Méroé et d'Axoum.",
      hypotheses: ["Les pyramides du Soudan ont été construites par les Égyptiens.", "Ces royaumes vivaient dans l'ombre de l'Égypte et n'ont rien inventé.", "Kouch, Méroé et Axoum sont des royaumes africains puissants : ils ont dominé l'Égypte, travaillé le fer, inventé une écriture, frappé monnaie et commercé jusqu'en Inde."]
    },
    parties: [
      { t: "Kouch, le royaume qui domina l'Égypte", html: def("Kouch", "Royaume de Nubie, au sud de l'Égypte, le long du haut Nil (dans l'actuel Soudan). Ses capitales successives furent Kerma, Napata puis Méroé.") +
          "<ul><li><strong>La Nubie</strong> est riche en or, en ivoire, en ébène : l'Égypte la convoite et l'occupe pendant des siècles.</li><li>Au <strong>VIIIe siècle av. J.-C.</strong>, le rapport s'inverse : les rois de Kouch conquièrent l'Égypte. Piânkhy (Piye) puis Taharqa règnent comme pharaons.</li><li>Cette <strong>XXVe dynastie</strong> dure près d'un siècle, jusqu'à ce que les Assyriens la chassent d'Égypte.</li></ul>" +
          formule("durée d'un règne ou d'une dynastie = date de début − date de fin (av. J.-C.)") +
          ex("La XXVe dynastie règne sur l'Égypte d'environ 747 à 656 av. J.-C. : 747 − 656 = 91 ans, près d'un siècle.", "Calculer la durée de la XXVe dynastie") +
          attention("Avant J.-C., les dates diminuent avec le temps : on soustrait la plus petite de la plus grande pour trouver la durée."),
        planches: [P2("Trois royaumes du haut Nil", "Du nord au sud, puis vers l'est : Kouch et Méroé dans l'actuel Soudan, Axoum dans les hautes terres de l'Éthiopie et de l'Érythrée, près de la mer Rouge.",
          colonnes("Les royaumes du haut Nil", [{ t: "Kouch (Napata)", c: "#C2540A", l: ["Soudan actuel", "domine l'Égypte", "XXVe dynastie", "≈ 747-656 av. J.-C."] }, { t: "Méroé", c: "#7B3F99", l: ["Soudan actuel", "pyramides, fer", "écriture méroïtique", "≈ 300 av. J.-C.-350"] }, { t: "Axoum", c: "#1E499B", l: ["Éthiopie, Érythrée", "mer Rouge, monnaie", "stèles géantes", "≈ Ier-VIIe siècle"] }], 230, "Tableau des trois royaumes du haut Nil"))],
        fil: { html: "<p>Les pyramides du Soudan n'ont pas été bâties par des Égyptiens : ce sont les rois de <strong>Kouch</strong> qui ont, au contraire, conquis l'Égypte et régné sur elle comme pharaons. Ils ont repris l'idée de la pyramide en lui donnant leur propre forme, plus petite et plus pointue.</p>", verdicts: [[0, "rejetee", "Ce sont les rois de Kouch qui ont conquis l'Égypte, et leurs pyramides ont leur style propre."]] },
        retenir: "Kouch : royaume de Nubie ; XXVe dynastie (≈ 747-656 av. J.-C.) ; les pharaons venus du sud." },
      { t: "Méroé, une puissance du fer et de l'écriture", html: "<ul><li>Vers <strong>300 av. J.-C.</strong>, la capitale de Kouch s'installe durablement à <strong>Méroé</strong>, plus au sud.</li><li><strong>Le fer</strong> : les Méroïtes fondent le minerai dans des fourneaux ; les amas de scories montrent une vraie industrie du fer (outils, armes).</li><li><strong>Les pyramides</strong> : des centaines de pyramides aux pentes raides abritent les tombes des rois et des reines. Le Soudan compte plus de pyramides que l'Égypte.</li><li><strong>Les candaces</strong> : plusieurs reines puissantes gouvernent Méroé.</li><li><strong>L'écriture méroïtique</strong> : on sait la lire à voix haute, mais on ne comprend pas encore toute la langue.</li></ul>" +
          def("Scorie", "Déchet pierreux qui reste après la fonte d'un minerai de métal. Un gros amas de scories prouve une production importante.") +
          ex("Plus le tas de scories est gros, plus on a fondu de minerai : à Méroé, ces amas forment de véritables collines autour de la ville.", "Lire un tas de scories") +
          savais("Au Cameroun aussi, on a fondu le fer très tôt : des fourneaux et des scories anciens ont été retrouvés dans plusieurs régions, notamment dans l'Ouest et le Nord.") +
          astuce("Pour retenir Méroé, pense à « trois P » : Pyramides pointues, Puissance du fer, Pouvoir des reines candaces."),
        planches: [{ type: "3d", titre: "Méroé : les pyramides et le fourneau", legende: "Tourne le site : trois pyramides pointues aux pentes raides, chacune avec sa petite chapelle à l'avant ; plus loin, un fourneau où l'on fond le minerai de fer, des tas de scories sombres, et le Nil au premier plan.", modele: { h: 340, rx: -16, ry: 30, echelle: 0.72, alt: "Trois pyramides pointues, un fourneau de fer et des tas de scories près d'un fleuve", objets: meroe3D(), etiquettes: [{ p: [20, 124, 30], t: "pyramide royale", cote: "g" }, { p: [150, 56, -40], t: "fourneau à fer", cote: "d" }, { p: [190, 16, -80], t: "scories", cote: "d" }, { p: [-100, 4, -130], t: "le Nil", cote: "g" }] } }],
        fil: { html: "<p>Christelle se trompe : Méroé n'a pas seulement imité l'Égypte. Elle a développé une grande <strong>industrie du fer</strong>, inventé sa propre <strong>écriture</strong> et donné le pouvoir à des reines, les candaces. C'est une civilisation africaine originale.</p>", verdicts: [[1, "rejetee", "Fer, écriture méroïtique, reines candaces : Méroé a ses propres créations."]] },
        retenir: "Méroé : capitale vers 300 av. J.-C. ; fer et scories ; pyramides pointues ; candaces ; écriture méroïtique." },
      { t: "Axoum, le royaume de la mer Rouge", html: "<ul><li><strong>Axoum</strong>, dans les hautes terres de l'Éthiopie et de l'Érythrée, est puissant du Ier au VIIe siècle apr. J.-C.</li><li><strong>Le commerce</strong> : par son port d'Adoulis, sur la mer Rouge, Axoum échange l'ivoire, l'or et l'encens avec l'Égypte romaine, l'Arabie et l'Inde.</li><li><strong>La monnaie</strong> : Axoum frappe ses propres pièces d'or, d'argent et de bronze.</li><li><strong>Les stèles</strong> : d'immenses pierres taillées d'un seul bloc marquent les tombes royales ; la plus grande dépassait 30 m.</li><li>Vers <strong>350</strong>, le roi <strong>Ezana</strong> conquiert Méroé ; il se convertit au <strong>christianisme</strong>, qui devient religion du royaume.</li></ul>" +
          formule("âge d'un monument apr. J.-C. = 2026 − date de construction") +
          ex("Si une grande stèle d'Axoum a été dressée vers 300 apr. J.-C., elle a environ 2026 − 300 = 1 726 ans.", "Calculer l'âge d'une stèle") +
          attention("Une stèle n'est pas une pyramide : c'est un monument dressé, haut et étroit, taillé dans un seul bloc de pierre."),
        planches: [P2("Les créations d'Axoum", "Ce qui faisait la puissance d'Axoum : un port, une monnaie, des stèles et une religion d'État.",
          colonnes("La puissance d'Axoum", [{ t: "Commerce", c: "#1E499B", l: ["port d'Adoulis", "mer Rouge", "→ Arabie, Inde, Rome"] }, { t: "Monnaie", c: "#B07A00", l: ["pièces d'or", "d'argent, de bronze", "→ un État organisé"] }, { t: "Stèles", c: "#4D5163", l: ["un seul bloc", "plus de 30 m", "→ tombes royales"] }, { t: "Christianisme", c: "#7B3F99", l: ["roi Ezana", "vers 350", "→ religion d'État"] }], 220, "Commerce, monnaie, stèles et christianisme à Axoum"))],
        fil: { html: "<p>Les royaumes du haut Nil sont bien des <strong>puissances africaines</strong> : Kouch a régné sur l'Égypte, Méroé a maîtrisé le fer et l'écriture, Axoum a commercé jusqu'en Inde, frappé sa monnaie et dressé des stèles géantes. Leur histoire n'est pas une copie de celle de l'Égypte.</p>", verdicts: [[2, "validee", "Domination de l'Égypte, fer, écriture, monnaie, commerce lointain : des royaumes africains originaux."]] },
        retenir: "Axoum : Ier-VIIe siècle ; port d'Adoulis ; monnaie ; stèles géantes ; roi Ezana chrétien vers 350." },
      { t: "Entraînement au format de l'examen", html: integ("Les « pharaons noirs » de la XXVe dynastie venaient du royaume de…", ["Axoum", "Kouch", "Carthage", "Ghana"], "Kouch", "Venus de Napata, ils ont régné sur l'Égypte au VIIIe et au VIIe siècle av. J.-C.", "Cite deux créations de Méroé et deux créations d'Axoum.", "Méroé : l'industrie du fer, l'écriture méroïtique, des pyramides pointues. Axoum : une monnaie d'or, d'argent et de bronze, des stèles géantes, le port d'Adoulis.", "Un camarade affirme que l'Afrique ancienne, en dehors de l'Égypte, n'a connu ni rois puissants ni écriture.", "En t'appuyant sur ta leçon, rédige quelques lignes pour lui répondre.", "C'est faux. Les rois de Kouch ont conquis l'Égypte et régné comme pharaons au VIIIe siècle av. J.-C. Méroé a inventé sa propre écriture, l'écriture méroïtique, et développé une grande industrie du fer. Axoum frappait sa monnaie, commerçait avec l'Inde par la mer Rouge et dressait des stèles de plus de 30 m. Ces royaumes africains étaient puissants et inventifs."), retenir: "Savoir-être : fierté éclairée du patrimoine africain et respect de la vérité historique." }
    ],
    denouement: { titre: "Les conclusions de l'enquête", etapes: ["Kouch a conquis l'Égypte et régné près d'un siècle (indice 1).", "Méroé a ses créations : fer, écriture, pyramides pointues, reines candaces (indice 2).", "Axoum commerce jusqu'en Inde, frappe monnaie et devient chrétien (indice 3)."],
      formules: [F("Durée av. J.-C.", "durée = date de début − date de fin", "747 − 656 = 91 ans (XXVe dynastie)"), F("Âge d'un monument", "âge = 2026 − date apr. J.-C.", "2026 − 300 = 1 726 ans"), F("Comparer", "Kouch / Méroé / Axoum : lieu, dates, créations", "Soudan, Soudan, Éthiopie-Érythrée")],
      reponse: "<p>Les pyramides vues dans le documentaire se trouvent à Méroé, au Soudan, et ce ne sont pas des copies égyptiennes. Elles ont été construites par les rois et les reines du royaume de Kouch, en Nubie, qui avaient même conquis l'Égypte au VIIIe siècle av. J.-C. et régné sur elle pendant près d'un siècle (XXVe dynastie). Installée à Méroé vers 300 av. J.-C., la capitale de Kouch développe une grande industrie du fer, comme le prouvent les amas de scories, invente sa propre écriture et donne le pouvoir à des reines, les candaces. Plus à l'est, Axoum, en Éthiopie et en Érythrée, commerce par la mer Rouge avec l'Arabie et l'Inde, frappe sa monnaie et dresse des stèles géantes ; vers 350, son roi Ezana se convertit au christianisme. Ces royaumes sont des puissances africaines originales.</p>",
      transfert: "<p>Le Cameroun a aussi une longue histoire du fer. Cherche, dans ta région, un forgeron ou un objet en fer ancien, et explique comment on obtient le fer à partir du minerai.</p>" },
    revision: ["<strong>Kouch</strong> : royaume de Nubie (Soudan), capitales Kerma, Napata, Méroé.", "XXVe dynastie : les rois de Kouch règnent sur l'Égypte (≈ 747-656 av. J.-C.).", "Méroé : fer et scories, pyramides pointues, reines candaces, écriture méroïtique.", "Axoum : Éthiopie et Érythrée, Ier-VIIe siècle, port d'Adoulis.", "Axoum : monnaie, stèles géantes, roi Ezana chrétien vers 350.", "Durée av. J.-C. = date de début − date de fin."],
    exo: "<p>Range du plus ancien au plus récent : conversion d'Ezana, XXVe dynastie, installation de la capitale à Méroé. <em>(XXVe dynastie ; Méroé vers 300 av. J.-C. ; Ezana vers 350 apr. J.-C.)</em></p>",
    quiz: [q("Le royaume de Kouch se trouvait…", "en Nubie, dans l'actuel Soudan", "au Cameroun", "en Grèce", "Au sud de l'Égypte, le long du haut Nil."), q("La XXVe dynastie égyptienne était formée de rois…", "venus de Kouch", "venus de Grèce", "venus de Chine", "Les « pharaons noirs »."), q("La XXVe dynastie a duré environ…", "91 ans", "9 ans", "910 ans", "747 − 656 = 91."), q("Méroé est célèbre pour…", "son industrie du fer", "ses gratte-ciel", "ses rizières", "Les amas de scories le prouvent."), q("Les candaces de Méroé étaient…", "des reines", "des pyramides", "des pièces de monnaie", "Des reines puissantes."), q("L'écriture méroïtique est aujourd'hui…", "lisible à voix haute mais pas entièrement comprise", "totalement inconnue", "la même que les hiéroglyphes", "On lit les sons, pas toute la langue."), q("Le pays qui compte le plus de pyramides est…", "le Soudan", "la France", "le Japon", "Grâce aux pyramides de Kouch et de Méroé."), q("Axoum commerçait surtout par…", "la mer Rouge", "l'océan Pacifique", "le lac Tchad", "Par son port d'Adoulis."), q("Le roi d'Axoum qui se convertit au christianisme est…", "Ezana", "Taharqa", "Khéops", "Vers 350 apr. J.-C."), q("Une stèle d'Axoum est…", "une grande pierre dressée d'un seul bloc", "une pyramide", "une monnaie", "La plus grande dépassait 30 m.")],
    apc: apc("Un camarade croit que les pyramides n'existent qu'en Égypte et que l'Afrique ancienne n'a rien inventé d'autre.", "Présenter les royaumes de Kouch, Méroé et Axoum et leurs créations.")
  });
  VRT_A("6e-histoire-meroe-axoum", 1, "Kouch, Méroé ou Axoum ? Retrouve le bon royaume", function (el) {
    exercice(el, [["Les rois qui conquièrent l'Égypte au VIIIe siècle av. J.-C. viennent de ___.", ["Kouch", "Axoum", "Méroé"], "Ils forment la XXVe dynastie."], ["La ville entourée de collines de scories de fer est ___.", ["Méroé", "Axoum", "Napata"], "L'industrie du fer y était importante."], ["Le royaume qui frappe des pièces d'or et commerce avec l'Inde est ___.", ["Axoum", "Kouch", "Méroé"], "Par le port d'Adoulis."], ["Les reines puissantes appelées candaces gouvernaient ___.", ["Méroé", "Axoum", "l'Égypte"], "Kandake, la reine."], ["Les stèles géantes d'un seul bloc de pierre se trouvent à ___.", ["Axoum", "Méroé", "Napata"], "Elles marquent les tombes royales."], ["Le roi chrétien Ezana règne sur ___.", ["Axoum", "Kouch", "Méroé"], "Vers 350 apr. J.-C."]], "Indice suivant", "Royaume");
  });

  /* ═══════════════ RANG 14 : LA GRÈCE ANTIQUE ═══════════════ */
  function temple3D() {
    var o = [{ f: "boite", c: [0, -6, 0], d: [480, 6, 280], coul: "#B8A88A", dessus: "#CFC2A6" }];
    o.push({ f: "boite", c: [0, 6, 0], d: [340, 12, 180], coul: "#E8E2D4", dessus: "#F2EDE2" });
    o.push({ f: "boite", c: [0, 18, 0], d: [320, 12, 160], coul: "#E0D9C8", dessus: "#ECE6D8" });
    for (var i = 0; i < 8; i++) { o.push({ f: "cylindre", c: [-140 + i * 40, 24, -70], r: 9, h: 100, n: 12, coul: "#F2EDE2" }); o.push({ f: "cylindre", c: [-140 + i * 40, 24, 70], r: 9, h: 100, n: 12, coul: "#E6E0D2" }); }
    [-30, 30].forEach(function (z) { o.push({ f: "cylindre", c: [-140, 24, z], r: 9, h: 100, n: 12, coul: "#ECE6D8" }); o.push({ f: "cylindre", c: [140, 24, z], r: 9, h: 100, n: 12, coul: "#E6E0D2" }); });
    o.push({ f: "boite", c: [0, 130, 0], d: [320, 12, 160], coul: "#DCD4C2", dessus: "#E8E2D4" });
    o.push({ f: "poly", pts: [[-160, 136, -80], [160, 136, -80], [0, 172, -80]], coul: "#E8E2D4" });
    o.push({ f: "poly", pts: [[-160, 136, 80], [160, 136, 80], [0, 172, 80]], coul: "#D4CCB8" });
    o.push({ f: "poly", pts: [[-160, 136, -80], [0, 172, -80], [0, 172, 80], [-160, 136, 80]], coul: "#C9A660" });
    o.push({ f: "poly", pts: [[160, 136, -80], [0, 172, -80], [0, 172, 80], [160, 136, 80]], coul: "#B8954F" });
    return o;
  }
  VRT_L("6e-histoire-grece", {
    c: "6e", m: "histoire", cle: "La Grèce antique", titre: "La Grèce antique : cités, démocratie et savoirs", duree: 30,
    accroche: "Élection du délégué de classe à Garoua : « On vote comme dans la démocratie d'Athènes ! » « Alors les filles n'ont pas le droit de voter ! » Qu'était vraiment la démocratie grecque ?",
    intro: "L'élection du délégué d'une classe de 6e de Garoua te sert de fil rouge : à chaque partie, un indice t'aide à trancher entre trois idées sur la démocratie athénienne.",
    objectifs: ["décrire le monde grec : des cités indépendantes", "expliquer le fonctionnement de la démocratie athénienne et ses limites", "présenter les apports grecs : philosophie, sciences, théâtre, jeux Olympiques", "calculer une proportion de citoyens"],
    enquete: {
      titre: "L'élection du délégué",
      svg: svg(640, 220, "Salle de classe : une urne posée sur le bureau, des élèves lèvent la main ; au tableau, le mot démocratie et un temple grec dessiné à la craie", lin("grC", ["#E6EEF8", "#F4F1EA"], true),
        "<rect width='640' height='220' fill='url(#grC)'/><rect y='186' width='640' height='34' fill='#C9A06E'/><rect x='180' y='16' width='280' height='110' fill='#2E4A3A' stroke='#6B4423' stroke-width='5'/>" +
        txt(320, 44, "DÉMOCRATIE = « pouvoir du peuple »", { s: 13, c: "#F7C948" }) + "<path d='M260 112h120M270 112V72M290 112V72M310 112V72M330 112V72M350 112V72M370 112V72M262 72h116L320 54Z' fill='none' stroke='#F4F1EA' stroke-width='2.5'/>" +
        "<rect x='296' y='150' width='48' height='36' fill='#DCEBF5' stroke='#1E499B' stroke-width='2'/><rect x='312' y='146' width='16' height='4' fill='#1F2328'/>" +
        perso(110, 96, "#5A3A1E", "#7B3F99", "#2E3445") + "<path d='M126 110L136 70' stroke='#7B3F99' stroke-width='7' stroke-linecap='round'/>" + perso(520, 96, "#6B4423", "#1E499B", "#2E3445") + perso(590, 102, "#4A2E18", "#C2540A", "#2E3445") +
        bulle(14, 30, 180, "Comme à Athènes !", "#F7C948") + bulle(450, 30, 180, "Et les filles, alors ?", "#9FC3E8")),
      legende: "À Garoua, une classe de 6e élit son délégué en s'inspirant de la démocratie athénienne.",
      contexte: "<p>Pour élire leur délégué, les élèves de 6e B veulent « voter comme les Athéniens ». Moussa est sûr que « dans la Grèce antique, tout le monde votait, comme chez nous ». Aïssatou rit : « Pas du tout, à Athènes, seul le roi décidait ! » Leur professeure d'histoire leur donne deux documents et une question : la démocratie athénienne était-elle vraiment le pouvoir de tous ?</p>",
      documents: [{ t: "La population d'Athènes au Ve siècle av. J.-C. (estimations)", html: "<p>Environ 40 000 citoyens, sur une population totale d'environ 280 000 personnes : les citoyens, leurs femmes et leurs enfants, les étrangers domiciliés (métèques) et un grand nombre d'esclaves.</p>" },
        { t: "L'Ecclésia", html: "<p>L'assemblée des citoyens se réunit sur la colline de la Pnyx. Chaque citoyen peut y prendre la parole et voter les lois à main levée.</p>" }],
      question: "La démocratie d'Athènes donnait-elle le pouvoir à tous les habitants ?",
      tache: "Présente le monde des cités grecques, explique le fonctionnement et les limites de la démocratie athénienne, puis dis ce que nous devons aux Grecs.",
      hypotheses: ["À Athènes, tous les habitants votaient, hommes et femmes, comme aujourd'hui.", "À Athènes, un roi décidait seul de tout.", "À Athènes, les citoyens votaient les lois eux-mêmes, mais les citoyens n'étaient qu'une minorité : les femmes, les étrangers et les esclaves étaient exclus."]
    },
    parties: [
      { t: "Le monde grec, un monde de cités", html: def("Cité (polis)", "Petit État indépendant formé d'une ville et des campagnes qui l'entourent, avec ses propres lois, ses dieux protecteurs et son armée. Athènes et Sparte sont les plus célèbres.") +
          "<ul><li>La Grèce est un pays de montagnes et d'îles : les cités sont nombreuses et souvent rivales.</li><li>Les Grecs partagent pourtant une même <strong>langue</strong>, les mêmes <strong>dieux</strong> (Zeus, Athéna…) et les mêmes <strong>jeux</strong>.</li><li><strong>Les jeux Olympiques</strong>, organisés à Olympie en l'honneur de Zeus à partir de 776 av. J.-C., réunissent tous les quatre ans des athlètes de toutes les cités.</li><li>Les cités fondent des colonies tout autour de la Méditerranée.</li></ul>" +
          ex("Athènes et Sparte sont toutes deux grecques, mais très différentes : Athènes devient une démocratie tournée vers le commerce et les arts ; Sparte, dirigée par deux rois et un conseil d'anciens, forme surtout des soldats.", "Deux cités, deux façons de vivre") +
          astuce("Pour retenir ce qui unit les Grecs, pense à « LDJ » : la Langue, les Dieux, les Jeux."),
        planches: [P2("Athènes et Sparte", "Deux cités grecques voisines et rivales, organisées de façon très différente.",
          colonnes("Deux cités grecques", [{ t: "Athènes", c: "#1E499B", l: ["démocratie", "assemblée des citoyens", "commerce, port du Pirée", "philosophie, théâtre", "→ Parthénon"] }, { t: "Sparte", c: "#C62828", l: ["deux rois", "conseil d'anciens", "éducation militaire", "dès 7 ans", "→ soldats redoutés"] }], 240, "Tableau comparant Athènes et Sparte"))],
        fil: { html: "<p>Aïssatou se trompe pour Athènes : ce n'est pas un roi qui gouverne, ce sont les citoyens réunis en assemblée. Mais elle n'a pas tout à fait tort pour la Grèce : <strong>chaque cité a son régime</strong>, et Sparte, elle, a des rois. Il n'y a pas « une » Grèce politique, mais des cités.</p>", verdicts: [[1, "rejetee", "À Athènes, ce sont les citoyens qui votent les lois, pas un roi."]] },
        retenir: "La Grèce : des cités indépendantes (Athènes, Sparte) ; une langue, des dieux, des jeux communs (Olympie, 776 av. J.-C.)." },
      { t: "La démocratie athénienne et ses limites", html: def("Démocratie", "Du grec dêmos (le peuple) et kratos (le pouvoir) : régime où le pouvoir appartient aux citoyens, qui votent les lois et choisissent leurs dirigeants.") +
          "<ul><li>À la fin du <strong>VIe siècle av. J.-C.</strong>, Clisthène donne le pouvoir à l'ensemble des citoyens ; au <strong>Ve siècle</strong>, Périclès renforce la démocratie.</li><li><strong>L'Ecclésia</strong> : l'assemblée des citoyens vote les lois, la guerre et la paix.</li><li><strong>La Boulè</strong> : un conseil de 500 citoyens, tirés au sort, prépare les lois.</li><li><strong>Les limites</strong> : seuls sont citoyens les hommes libres, nés de père et de mère athéniens, âgés de 18 ans au moins. Les femmes, les métèques (étrangers) et les esclaves sont exclus.</li></ul>" +
          formule("part des citoyens = nombre de citoyens ÷ population totale × 100") +
          ex("40 000 citoyens sur 280 000 habitants : 40 000 ÷ 280 000 × 100 ≈ 14 %. Environ un habitant sur sept seulement pouvait voter.", "Calculer la part des citoyens") +
          attention("La démocratie athénienne est une invention capitale, mais elle n'est pas la nôtre : aujourd'hui, au Cameroun, femmes et hommes majeurs votent à égalité."),
        planches: [{ type: "3d", titre: "Un temple grec : le Parthénon", legende: "Tourne le temple : un socle à degrés, des colonnes de marbre tout autour, un toit à deux pentes et des frontons triangulaires. Le Parthénon fut bâti sur l'Acropole d'Athènes au Ve siècle av. J.-C. en l'honneur d'Athéna, protectrice de la cité.", modele: { h: 340, rx: -14, ry: 30, echelle: 0.68, alt: "Temple grec en marbre clair avec colonnes, toit à deux pentes et frontons", objets: temple3D(), etiquettes: [{ p: [0, 172, -80], t: "fronton", cote: "g" }, { p: [-140, 80, -70], t: "colonnes de marbre", cote: "g" }, { p: [140, 18, -82], t: "socle à degrés", cote: "d" }] } }],
        fil: { html: "<p>Moussa se trompe aussi : à Athènes, seule une minorité vote. Avec environ 40 000 citoyens pour 280 000 habitants, à peine <strong>14 %</strong> des habitants participent. Les femmes, les étrangers et les esclaves n'ont aucun droit politique.</p>", verdicts: [[0, "rejetee", "Environ 14 % seulement des habitants étaient citoyens : femmes, métèques et esclaves étaient exclus."]] },
        retenir: "Démocratie : pouvoir du peuple ; Ecclésia, Boulè ; citoyens = hommes libres nés de parents athéniens ; environ 14 % des habitants." },
      { t: "Ce que nous devons aux Grecs", html: "<ul><li><strong>La philosophie</strong> : Socrate, Platon et Aristote cherchent à comprendre le monde et la vie bonne par la raison.</li><li><strong>Les sciences</strong> : Thalès et Pythagore en géométrie (le théorème de Pythagore), Hippocrate en médecine (le serment des médecins).</li><li><strong>Le théâtre</strong> : tragédies et comédies jouées dans de grands théâtres en plein air.</li><li><strong>L'architecture</strong> : temples à colonnes comme le Parthénon.</li><li><strong>Les mots</strong> : démocratie, politique, géographie, théâtre, olympique viennent du grec.</li></ul>" +
          formule("triangle rectangle (Pythagore) : a² + b² = c²") +
          ex("Avec une corde de côtés 3, 4 et 5 : 3² + 4² = 9 + 16 = 25 = 5². C'est le triangle rectangle que les Égyptiens utilisaient déjà ; Pythagore et ses disciples en donnent la règle générale.", "Un héritage de calcul") +
          savais("Les Grecs reconnaissaient leur dette envers l'Égypte : plusieurs de leurs savants, comme Thalès ou Pythagore, y auraient voyagé pour apprendre."),
        planches: [P2("L'héritage grec dans notre vie", "Des mots, des savoirs et des institutions grecques que nous utilisons encore chaque jour.",
          colonnes("Ce que nous devons aux Grecs", [{ t: "Politique", c: "#1E499B", l: ["démocratie", "vote, assemblée", "→ élections"] }, { t: "Savoirs", c: "#17784D", l: ["philosophie", "géométrie, médecine", "→ l'école"] }, { t: "Arts", c: "#B07A00", l: ["théâtre", "temples à colonnes", "→ monuments"] }, { t: "Sport", c: "#C62828", l: ["jeux Olympiques", "776 av. J.-C.", "→ JO modernes"] }], 210, "L'héritage grec en politique, savoirs, arts et sport"))],
        fil: { html: "<p>La classe a la réponse : Athènes a inventé la <strong>démocratie</strong>, le vote des lois par les citoyens eux-mêmes ; mais c'était une démocratie limitée à une minorité d'hommes libres. Aujourd'hui, l'élection du délégué ouverte à tous, filles et garçons, va plus loin que celle d'Athènes.</p>", verdicts: [[2, "validee", "Une démocratie inventée à Athènes, mais réservée à une minorité de citoyens."]] },
        retenir: "Philosophie (Socrate, Platon, Aristote) ; sciences (Thalès, Pythagore, Hippocrate) ; théâtre ; Parthénon ; mots grecs." },
      { t: "Entraînement au format de l'examen", html: integ("À Athènes, les lois étaient votées par…", ["un roi", "l'Ecclésia, l'assemblée des citoyens", "les esclaves", "les femmes"], "L'Ecclésia, l'assemblée des citoyens", "Les citoyens y votaient à main levée.", "Qui était exclu de la citoyenneté athénienne ? Calcule la part des citoyens si l'on compte 30 000 citoyens sur 250 000 habitants.", "Les femmes, les métèques (étrangers) et les esclaves. 30 000 ÷ 250 000 × 100 = 12 % des habitants.", "Un élève déclare : « La démocratie d'Athènes était parfaite, il faut faire exactement comme elle. »", "Rédige quelques lignes pour nuancer son avis.", "Athènes a inventé la démocratie : les citoyens votaient eux-mêmes les lois à l'Ecclésia, ce qui était nouveau et précieux. Mais seuls les hommes libres nés de parents athéniens étaient citoyens, environ un habitant sur sept : les femmes, les étrangers et les esclaves étaient exclus. Il faut garder l'idée du vote et de la discussion, mais l'ouvrir à tous, comme dans nos élections où filles et garçons votent à égalité."), retenir: "Savoir-être : sens civique, respect du vote et de l'égalité entre filles et garçons." }
    ],
    denouement: { titre: "Ce que la classe a décidé", etapes: ["Athènes est une cité parmi d'autres ; ce ne sont pas des rois qui y décident (indice 1).", "Seuls les citoyens votent : environ 14 % des habitants (indice 2).", "La classe garde l'idée d'Athènes mais vote à égalité, filles et garçons (indice 3)."],
      formules: [F("Définir", "démocratie = dêmos (peuple) + kratos (pouvoir)", "le pouvoir des citoyens"), F("Calculer la part des citoyens", "part = citoyens ÷ population × 100", "40 000 ÷ 280 000 × 100 ≈ 14 %"), F("Comparer", "Athènes : hommes libres citoyens ; aujourd'hui : tous les électeurs", "filles et garçons votent pour le délégué")],
      reponse: "<p>La démocratie d'Athènes ne donnait pas le pouvoir à tous les habitants. La Grèce antique était formée de cités indépendantes ; à Athènes, depuis Clisthène et Périclès, ce n'est pas un roi qui gouverne : les citoyens votent eux-mêmes les lois à l'Ecclésia et un conseil de 500 citoyens tirés au sort prépare ces lois. Mais seuls les hommes libres nés de parents athéniens étaient citoyens : environ 40 000 sur 280 000 habitants, soit 14 %. Les femmes, les métèques et les esclaves étaient exclus. Athènes nous a légué la démocratie, la philosophie, les sciences, le théâtre et les jeux Olympiques ; l'élection du délégué de la 6e B, ouverte aux filles comme aux garçons, reprend son idée en la rendant plus juste.</p>",
      transfert: "<p>Dans ta classe, 18 élèves sur 60 ont voté pour le délégué. Calcule la participation en pourcentage, puis compare-la à la part des citoyens à Athènes.</p>" },
    revision: ["<strong>Cité (polis)</strong> : petit État indépendant (Athènes, Sparte).", "Ce qui unit les Grecs : langue, dieux, jeux Olympiques (776 av. J.-C.).", "Démocratie : dêmos + kratos ; Clisthène, Périclès ; Ecclésia, Boulè.", "Citoyens : hommes libres nés de parents athéniens ; ≈ 14 % des habitants.", "Exclus : femmes, métèques, esclaves.", "Héritage : philosophie, Pythagore (a² + b² = c²), Hippocrate, théâtre, Parthénon."],
    exo: "<p>Calcule la part des citoyens : 35 000 citoyens sur 250 000 habitants. <em>(35 000 ÷ 250 000 × 100 = 14 %.)</em></p>",
    quiz: [q("Une cité grecque (polis) est…", "un petit État indépendant", "un temple", "un roi", "Une ville et ses campagnes, avec ses lois."), q("Démocratie signifie…", "pouvoir du peuple", "pouvoir d'un roi", "pouvoir des dieux", "Dêmos + kratos."), q("L'assemblée des citoyens d'Athènes s'appelle…", "l'Ecclésia", "le Sénat", "l'Olympe", "Elle se réunit sur la Pnyx."), q("Étaient exclus de la citoyenneté athénienne…", "les femmes, les métèques et les esclaves", "tous les hommes", "seulement les enfants de riches", "Seuls les hommes libres nés de parents athéniens votaient."), q("40 000 citoyens sur 280 000 habitants, c'est environ…", "14 %", "40 %", "70 %", "40 000 ÷ 280 000 × 100."), q("Les premiers jeux Olympiques datent de…", "776 av. J.-C.", "1960", "3100 av. J.-C.", "À Olympie, en l'honneur de Zeus."), q("Sparte était surtout connue pour…", "ses soldats", "ses philosophes", "ses pyramides", "Une éducation militaire dès 7 ans."), q("Le Parthénon est…", "un temple dédié à Athéna", "un stade", "une pyramide", "Sur l'Acropole d'Athènes."), q("Socrate, Platon et Aristote sont des…", "philosophes", "rois", "athlètes", "Ils réfléchissent par la raison."), q("Le théorème de Pythagore s'écrit…", "a² + b² = c²", "a + b = c", "a × b = c", "Dans un triangle rectangle.")],
    apc: apc("Des élèves veulent élire leur délégué « comme à Athènes » sans savoir comment fonctionnait cette démocratie.", "Expliquer la démocratie athénienne, ses limites et son héritage.")
  });
  VRT_A("6e-histoire-grece", 1, "Citoyen ou non ? Qui vote à Athènes ?", function (el) {
    exercice(el, [["Périclès, homme libre né de parents athéniens, ___ à l'Ecclésia.", ["vote", "ne vote pas", "vote seulement en temps de guerre"], "Il est citoyen."], ["Aspasie, une femme d'Athènes, ___ à l'Ecclésia.", ["ne vote pas", "vote", "vote une fois par an"], "Les femmes sont exclues."], ["Un marchand venu de Milet, installé à Athènes (métèque), ___.", ["ne vote pas", "vote", "préside l'assemblée"], "Les étrangers sont exclus."], ["Un esclave qui travaille dans les mines ___.", ["ne vote pas", "vote", "vote s'il est riche"], "Les esclaves n'ont aucun droit politique."], ["30 000 citoyens sur 300 000 habitants, c'est ___ des habitants.", ["10 %", "30 %", "3 %"], "30 000 ÷ 300 000 × 100."], ["Le conseil de 500 citoyens tirés au sort s'appelle la ___.", ["Boulè", "Pnyx", "polis"], "Elle prépare les lois."]], "Personne suivante", "Personne");
  });

  /* ═══════════════ RANG 16 : LA CHINE ═══════════════ */
  function muraille3D() {
    var o = [{ f: "boite", c: [0, -6, 0], d: [520, 6, 260], coul: "#6F8F4A", dessus: "#86A85C" }];
    for (var k = 0; k < 7; k++) {
      var x = -210 + k * 70, y = Math.sin(k * 0.9) * 18 + 20;
      o.push({ f: "boite", c: [x, y / 2, 0], d: [72, y + 40, 34], coul: "#9A8A72", dessus: "#B8A88A" });
      o.push({ f: "boite", c: [x - 28, y / 2 + 26, -16], d: [8, 10, 4], coul: "#8A7A62" });
      o.push({ f: "boite", c: [x + 28, y / 2 + 26, -16], d: [8, 10, 4], coul: "#8A7A62" });
    }
    [-210, 0, 210].forEach(function (x) { o.push({ f: "boite", c: [x, 50, 0], d: [52, 80, 52], coul: "#8A7A62", dessus: "#A0907A" }); o.push({ f: "poly", pts: [[x - 34, 90, -34], [x + 34, 90, -34], [x, 120, 0]], coul: "#8B3A2A" }); o.push({ f: "poly", pts: [[x + 34, 90, -34], [x + 34, 90, 34], [x, 120, 0]], coul: "#6B2A1E" }); });
    o.push({ f: "boite", c: [140, 4, -100], d: [40, 8, 16], coul: "#F4F1EA", dessus: "#FBF8F2" });
    return o;
  }
  VRT_L("6e-histoire-chine", {
    c: "6e", m: "histoire", cle: "La Chine", titre: "La Chine ancienne : l'empire, ses savoirs et ses inventions", duree: 30,
    accroche: "« Tout ce qui est fabriqué en Chine est récent ! » Pourtant, le papier de ton cahier, la boussole de ta géographie et la soie ont été inventés en Chine il y a très longtemps. Comment ?",
    intro: "Une discussion au marché Mokolo de Yaoundé, devant un étal de produits chinois, te sert de fil rouge : à chaque partie, un indice t'aide à trancher entre trois idées sur la Chine ancienne.",
    objectifs: ["situer la Chine ancienne et la naissance de l'empire", "décrire le pouvoir du premier empereur Qin Shi Huangdi", "présenter la pensée de Confucius", "connaître les grandes inventions chinoises et la route de la soie"],
    enquete: {
      titre: "L'étal du marché Mokolo",
      svg: svg(640, 220, "Marché : un étal avec cahiers, boussoles et rouleaux de tissu de soie ; deux enfants discutent avec une commerçante", lin("chC", ["#FBEFD8", "#F4EDE1"], true),
        "<rect width='640' height='220' fill='url(#chC)'/><rect y='186' width='640' height='34' fill='#8B6B4A'/><path d='M160 70h320l-30 -40H190Z' fill='#C62828'/><rect x='170' y='120' width='300' height='66' fill='#6B4423'/>" +
        "<rect x='190' y='100' width='50' height='22' fill='#F4F1EA' stroke='#9AA3AF'/><circle cx='280' cy='110' r='14' fill='#F4F1EA' stroke='#B07A00' stroke-width='3'/><path d='M280 100l4 10l-4 10l-4 -10Z' fill='#C62828'/><rect x='320' y='96' width='60' height='26' rx='13' fill='#7B3F99'/><rect x='390' y='96' width='60' height='26' rx='13' fill='#1E8A8A'/>" +
        perso(90, 98, "#5A3A1E", "#17784D", "#2E3445") + perso(540, 92, "#6B4423", "#C2540A", "#4D5163") + perso(600, 104, "#4A2E18", "#1E499B", "#2E3445") +
        bulle(10, 30, 170, "C'est tout récent !", "#F7C948") + bulle(470, 26, 160, "Inventé il y a 2 000 ans !", "#9FC3E8")),
      legende: "Au marché Mokolo de Yaoundé, devant un étal de cahiers, de boussoles et de tissus de soie.",
      contexte: "<p>Au marché Mokolo, Hervé et sa petite sœur Nina achètent des cahiers et une boussole pour l'école. Hervé déclare : « La Chine, c'est un pays moderne : avant, il n'y avait rien là-bas. » Nina pense au contraire que « la Chine a toujours été gouvernée par un seul et même empereur, depuis le début du monde ». La commerçante sourit : « Le papier de ton cahier et la boussole ont été inventés en Chine, il y a très longtemps. »</p>",
      documents: [{ t: "Le premier empereur", html: "<p>En 221 av. J.-C., le roi de Qin met fin à la guerre entre les royaumes chinois et prend le titre de Qin Shi Huangdi, « premier empereur ». Il unifie l'écriture, les poids et mesures et la monnaie.</p>" },
        { t: "Une invention", html: "<p>Selon la tradition chinoise, un fonctionnaire nommé Cai Lun présente à l'empereur, vers 105 apr. J.-C., une méthode pour fabriquer du papier avec des fibres d'écorce, de chanvre et de vieux chiffons.</p>" }],
      question: "La Chine ancienne a-t-elle une histoire et des inventions dont nous profitons encore aujourd'hui ?",
      tache: "Situe la naissance de l'empire chinois, présente le premier empereur et Confucius, puis les grandes inventions chinoises.",
      hypotheses: ["La Chine n'a pas d'histoire ancienne : tout y est récent.", "La Chine a toujours été gouvernée par un seul empereur, depuis le début.", "La Chine a une très longue histoire : des royaumes rivaux unifiés en 221 av. J.-C. par un premier empereur, une pensée (Confucius) et des inventions (papier, soie, boussole) que nous utilisons encore."]
    },
    parties: [
      { t: "La naissance de l'empire chinois", html: def("Empire", "Grand État réunissant plusieurs territoires et peuples sous l'autorité d'un seul souverain, l'empereur.") +
          "<ul><li>La civilisation chinoise naît dans les vallées de grands fleuves, le <strong>Huang He</strong> (fleuve Jaune) et le <strong>Yangzi</strong>.</li><li>Pendant des siècles, plusieurs <strong>royaumes</strong> rivaux se font la guerre (période des Royaumes combattants).</li><li>En <strong>221 av. J.-C.</strong>, le roi de Qin les unifie et devient <strong>Qin Shi Huangdi</strong>, le premier empereur ; le nom « Chine » viendrait de « Qin ».</li><li>Il <strong>unifie</strong> l'écriture, la monnaie, les poids et mesures et fait relier des murailles pour protéger le nord : c'est l'ancêtre de la Grande Muraille.</li><li>Dans son tombeau, une <strong>armée de soldats en terre cuite</strong>, des milliers de statues grandeur nature, garde l'empereur.</li></ul>" +
          formule("durée entre une date av. J.-C. et une date apr. J.-C. = date av. + date apr. − 1") +
          ex("De l'unification (221 av. J.-C.) à 2026 : 221 + 2 026 − 1 = 2 246 ans.", "Calculer l'âge de l'empire chinois") +
          attention("La Grande Muraille actuelle, en briques, a surtout été reconstruite bien plus tard, sous la dynastie Ming (XIVe-XVIIe siècle) ; celle du premier empereur était faite de terre damée."),
        planches: [{ type: "3d", titre: "Une portion de la Grande Muraille", legende: "Tourne la muraille : elle suit le relief des collines, avec un chemin de ronde crénelé et des tours de guet à intervalles réguliers. Les soldats y surveillaient les frontières du nord et transmettaient les alertes par des signaux de fumée.", modele: { h: 340, rx: -18, ry: 28, echelle: 0.7, alt: "Muraille crénelée qui ondule sur des collines vertes, avec trois tours de guet au toit rouge", objets: muraille3D(), etiquettes: [{ p: [0, 120, 0], t: "tour de guet", cote: "d" }, { p: [-140, 46, -18], t: "chemin de ronde crénelé", cote: "g" }, { p: [140, 10, -100], t: "signal d'alerte", cote: "d" }] } }],
        fil: { html: "<p>Hervé se trompe : la Chine a une histoire très ancienne. Mais Nina aussi : il n'y a pas eu « un seul empereur depuis le début ». Pendant longtemps, des royaumes rivaux se sont battus, avant que le roi de Qin ne les <strong>unifie en 221 av. J.-C.</strong>, il y a plus de 2 200 ans.</p>", verdicts: [[1, "rejetee", "L'empire naît en 221 av. J.-C., après des siècles de royaumes rivaux."]] },
        retenir: "Fleuve Jaune et Yangzi ; Royaumes combattants ; 221 av. J.-C. : Qin Shi Huangdi, premier empereur ; unification ; armée de terre cuite." },
      { t: "Confucius et l'organisation de l'empire", html: def("Confucius", "Penseur chinois (551-479 av. J.-C.) qui enseigne le respect des parents et des anciens, la politesse, l'étude et le devoir de bien gouverner par l'exemple.") +
          "<ul><li>Pour Confucius, une société est en ordre quand chacun tient son rôle avec respect : le souverain envers son peuple, les enfants envers leurs parents.</li><li>Sous la dynastie <strong>Han</strong>, ses idées guident l'État : les <strong>fonctionnaires</strong> lettrés sont choisis pour leurs connaissances.</li><li>Plus tard, des <strong>concours</strong> d'État recrutent ces fonctionnaires sur leurs examens.</li></ul>" +
          ex("Saluer les anciens, respecter ses parents, travailler à l'école pour servir sa communauté : ces valeurs, très présentes dans nos familles camerounaises, sont aussi au cœur de l'enseignement de Confucius.", "Des valeurs partagées") +
          astuce("Pour retenir Confucius, pense à « RPE » : Respect, Politesse, Étude.") +
          savais("Les caractères chinois sont des signes qui représentent des mots ou des idées ; un lettré devait en connaître plusieurs milliers."),
        planches: [P2("La société selon Confucius", "Cinq relations qui, selon Confucius, doivent être réglées par le respect et le devoir de chacun.",
          colonnes("Les cinq relations de Confucius", [{ t: "Souverain-sujet", c: "#C62828", l: ["gouverner", "par l'exemple"] }, { t: "Parents-enfants", c: "#1E499B", l: ["piété filiale", "respect"] }, { t: "Époux-épouse", c: "#7B3F99", l: ["devoirs", "réciproques"] }, { t: "Aîné-cadet", c: "#B07A00", l: ["conseil", "et écoute"] }, { t: "Amis", c: "#17784D", l: ["fidélité", "confiance"] }], 190, "Les cinq relations de la société selon Confucius"))],
        fil: { html: "<p>L'empire chinois tient aussi grâce à une <strong>pensée</strong> : celle de Confucius, qui donne des règles de respect et de bon gouvernement, et à des fonctionnaires lettrés. La Chine ancienne n'est pas seulement une armée : c'est une civilisation de l'écrit et du savoir.</p>", verdicts: [] },
        retenir: "Confucius (551-479 av. J.-C.) : respect, politesse, étude ; dynastie Han ; fonctionnaires lettrés, concours." },
      { t: "Les inventions chinoises et la route de la soie", html: "<ul><li><strong>La soie</strong> : un tissu fin tiré du cocon du ver à soie, longtemps gardé secret.</li><li><strong>Le papier</strong> : vers 105 apr. J.-C., selon la tradition, Cai Lun perfectionne sa fabrication.</li><li><strong>La boussole</strong> : une aiguille aimantée qui indique le nord, d'abord utilisée pour l'orientation, puis pour la navigation.</li><li><strong>Plus tard</strong> : l'imprimerie, la poudre, la porcelaine.</li><li><strong>La route de la soie</strong> : à partir du IIe siècle av. J.-C., sous les Han, des caravanes relient la Chine à la Méditerranée et transportent la soie, le papier, les idées.</li></ul>" +
          formule("vitesse moyenne d'une caravane = distance ÷ durée du voyage") +
          ex("Une caravane qui parcourt 30 km par jour met 6 000 ÷ 30 = 200 jours pour faire 6 000 km, plus de six mois de voyage.", "Le temps d'une caravane") +
          attention("La route de la soie n'est pas une route unique : c'est un réseau de pistes et de relais, et personne ne la parcourait d'un bout à l'autre ; les marchandises passaient de marchand en marchand."),
        planches: [P2("Les inventions chinoises dans ta vie", "Quatre inventions chinoises très anciennes que tu utilises encore, directement ou dans des objets modernes.",
          colonnes("Des inventions venues de Chine", [{ t: "Papier", c: "#1E499B", l: ["vers 105 apr. J.-C.", "→ ton cahier"] }, { t: "Soie", c: "#7B3F99", l: ["ver à soie", "→ tissus fins"] }, { t: "Boussole", c: "#C62828", l: ["aiguille aimantée", "→ la géographie"] }, { t: "Imprimerie", c: "#17784D", l: ["caractères", "→ tes livres"] }], 200, "Papier, soie, boussole et imprimerie inventés en Chine"))],
        fil: { html: "<p>La commerçante a raison : le <strong>papier</strong> du cahier, la <strong>boussole</strong> et la <strong>soie</strong> sont des inventions chinoises vieilles de près de 2 000 ans ou plus, diffusées dans le monde par la route de la soie. La Chine a une très longue histoire et nous en profitons chaque jour.</p>", verdicts: [[0, "rejetee", "Papier, soie, boussole : des inventions chinoises très anciennes."], [2, "validee", "Une longue histoire, un empire unifié en 221 av. J.-C., Confucius et des inventions encore utilisées."]] },
        retenir: "Soie ; papier (≈ 105 apr. J.-C.) ; boussole ; puis imprimerie, poudre, porcelaine ; route de la soie (IIe siècle av. J.-C.)." },
      { t: "Entraînement au format de l'examen", html: integ("Le premier empereur de Chine s'appelle…", ["Confucius", "Qin Shi Huangdi", "Cai Lun", "Périclès"], "Qin Shi Huangdi", "Il unifie la Chine en 221 av. J.-C.", "Cite trois inventions chinoises et dis à quoi elles servent.", "Le papier (écrire), la soie (tissu fin), la boussole (s'orienter, naviguer) ; aussi l'imprimerie (livres), la poudre, la porcelaine.", "Ton cousin dit que les Chinois n'ont jamais rien inventé et ne font que copier.", "En t'appuyant sur ta leçon, rédige quelques lignes pour lui répondre.", "C'est faux. La Chine ancienne a inventé la soie, le papier (vers 105 apr. J.-C.), la boussole, puis l'imprimerie et la porcelaine. Ces inventions se sont répandues dans le monde par la route de la soie. Le papier de nos cahiers et la boussole de nos cours de géographie viennent de Chine. Il ne faut pas juger un peuple sur des idées toutes faites."), retenir: "Savoir-être : ouverture aux autres civilisations et refus des préjugés." }
    ],
    denouement: { titre: "Ce que Hervé et Nina ont appris", etapes: ["La Chine unifiée en 221 av. J.-C., après des siècles de royaumes rivaux (indice 1).", "Une civilisation de l'écrit, guidée par Confucius et ses fonctionnaires lettrés (indice 2).", "Des inventions anciennes encore utilisées : papier, soie, boussole (indice 3)."],
      formules: [F("Dater", "durée = date av. + date apr. − 1", "221 + 2 026 − 1 = 2 246 ans"), F("Mesurer un voyage", "durée = distance ÷ distance par jour", "6 000 ÷ 30 = 200 jours"), F("Relier au présent", "invention ancienne → objet d'aujourd'hui", "papier → cahier ; boussole → géographie")],
      reponse: "<p>La Chine a une très longue histoire. Sa civilisation est née dans les vallées du fleuve Jaune et du Yangzi ; après des siècles de guerres entre royaumes rivaux, le roi de Qin unifie le pays en 221 av. J.-C. et devient Qin Shi Huangdi, le premier empereur : il unifie l'écriture, la monnaie, les poids et mesures, fait relier des murailles au nord et se fait enterrer avec une armée de soldats en terre cuite. La pensée de Confucius, qui enseigne le respect, la politesse et l'étude, guide ensuite l'État et ses fonctionnaires lettrés. La Chine ancienne a inventé la soie, le papier, la boussole, puis l'imprimerie et la porcelaine, diffusés dans le monde par la route de la soie. Le papier du cahier d'Hervé et sa boussole sont donc les héritiers d'inventions vieilles de près de deux mille ans.</p>",
      transfert: "<p>Fais la liste de cinq objets de ta maison. Pour chacun, cherche s'il descend d'une invention chinoise, égyptienne, grecque ou africaine que tu as étudiée cette année.</p>" },
    revision: ["<strong>Empire</strong> : grand État sous l'autorité d'un empereur.", "Fleuve Jaune et Yangzi ; Royaumes combattants.", "221 av. J.-C. : Qin Shi Huangdi unifie la Chine (écriture, monnaie, mesures, murailles, armée de terre cuite).", "Confucius (551-479 av. J.-C.) : respect, politesse, étude ; fonctionnaires lettrés.", "Inventions : soie, papier (≈ 105 apr. J.-C.), boussole, imprimerie, poudre, porcelaine.", "Route de la soie : réseau de pistes depuis le IIe siècle av. J.-C."],
    exo: "<p>Combien d'années séparent l'unification de la Chine (221 av. J.-C.) de l'invention du papier par Cai Lun (vers 105 apr. J.-C.) ? <em>(221 + 105 − 1 = 325 ans.)</em></p>",
    quiz: [q("La civilisation chinoise est née près…", "du fleuve Jaune et du Yangzi", "du Nil", "du lac Tchad", "Deux grands fleuves de Chine."), q("La Chine est unifiée en…", "221 av. J.-C.", "1960", "3100 av. J.-C.", "Par le roi de Qin."), q("Le premier empereur s'appelle…", "Qin Shi Huangdi", "Confucius", "Ezana", "« Premier empereur »."), q("Dans le tombeau du premier empereur, on a trouvé…", "une armée de soldats en terre cuite", "des pyramides", "un temple grec", "Des milliers de statues grandeur nature."), q("Confucius enseigne surtout…", "le respect, la politesse et l'étude", "la guerre", "la navigation", "551-479 av. J.-C."), q("Le papier a été perfectionné, selon la tradition, vers…", "105 apr. J.-C.", "2026", "776 av. J.-C.", "Par Cai Lun."), q("La boussole sert à…", "indiquer le nord", "écrire", "tisser", "Une aiguille aimantée."), q("La soie est tirée…", "du cocon du ver à soie", "du coton", "de l'écorce", "Un secret longtemps gardé."), q("La route de la soie reliait…", "la Chine à la Méditerranée", "la Chine au Cameroun", "la Grèce à l'Égypte", "Un réseau de pistes et de relais."), q("De 221 av. J.-C. à 2026, il s'est écoulé…", "2 246 ans", "1 805 ans", "2 247 ans", "221 + 2 026 − 1.")],
    apc: apc("Un enfant pense que la Chine n'a pas d'histoire ancienne et que ses produits sont tous récents.", "Présenter l'empire chinois, Confucius et les inventions chinoises encore utilisées.")
  });
  VRT_A("6e-histoire-chine", 2, "Invention chinoise ou pas ? Trie les objets", function (el) {
    exercice(el, [["Le papier de ton cahier est une invention ___.", ["chinoise", "grecque", "égyptienne"], "Perfectionné vers 105 apr. J.-C."], ["Le papyrus est une invention ___.", ["égyptienne", "chinoise", "grecque"], "Ne confonds pas papier et papyrus."], ["La boussole est une invention ___.", ["chinoise", "grecque", "méroïtique"], "Une aiguille aimantée qui indique le nord."], ["La démocratie est une invention ___.", ["grecque", "chinoise", "égyptienne"], "Née à Athènes."], ["La soie est une invention ___.", ["chinoise", "égyptienne", "grecque"], "Tirée du cocon du ver à soie."], ["Le calendrier de 365 jours vient d'abord de l'Égypte ___.", ["ancienne", "de Qin", "de Sparte"], "12 × 30 + 5 jours."]], "Objet suivant", "Objet");
  });
})();
