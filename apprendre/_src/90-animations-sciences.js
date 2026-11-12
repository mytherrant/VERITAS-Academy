/* Schémas animés et manipulables — sciences. Chaque fonction reçoit le conteneur et y dessine.
   Règles : transform/opacity uniquement pour les boucles ; tout reste lisible sans animation. */
(function () {
  var NS = "http://www.w3.org/2000/svg";
  function curseur(lab, min, max, pas, val, unite) {
    return "<label class='an-cur'><span>" + lab + " <b data-v>" + val + "</b>" + (unite || "") + "</span><input type='range' min='" + min + "' max='" + max + "' step='" + pas + "' value='" + val + "'></label>";
  }
  function f(x, d) { return (Math.round(x * Math.pow(10, d || 2)) / Math.pow(10, d || 2)).toString().replace(".", ","); }

  /* ---------- Thalès : la parallèle glisse, les rapports restent égaux ---------- */
  VRT_A("3e-maths-thales", 1, "Fais glisser la parallèle (MN)", function (el) {
    el.innerHTML = "<svg viewBox='0 0 420 240' class='an-svg'><path d='M60 220 L360 220 L150 25 Z' fill='#DBE8FE' stroke='#142554' stroke-width='2.5' stroke-linejoin='round'/><path data-p fill='#FFC93C' fill-opacity='.45'/><line data-l stroke='#1E499B' stroke-width='3'/><circle data-m r='5' fill='#142554'/><circle data-n r='5' fill='#142554'/><text data-tm font-size='17' font-weight='700' fill='#142554'>M</text><text data-tn font-size='17' font-weight='700' fill='#142554'>N</text><g font-size='17' font-weight='700' fill='#142554'><text x='143' y='18'>A</text><text x='40' y='238'>B</text><text x='366' y='238'>C</text></g></svg>" +
      curseur("Position de M sur [AB] : AM/AB =", 0.15, 0.95, 0.01, 0.5) +
      "<div class='an-res'><span>AM/AB = <b data-r1></b></span><span>AN/AC = <b data-r2></b></span><span>MN/BC = <b data-r3></b></span></div><p class='an-note'>Les trois rapports restent égaux tant que (MN) est parallèle à (BC).</p>";
    var A = [150, 25], B = [60, 220], C = [360, 220], r = el.querySelector("input");
    function maj() {
      var k = +r.value, M = [A[0] + k * (B[0] - A[0]), A[1] + k * (B[1] - A[1])], N = [A[0] + k * (C[0] - A[0]), A[1] + k * (C[1] - A[1])];
      var q = function (s) { return el.querySelector("[" + s + "]"); };
      q("data-l").setAttribute("x1", M[0] - 30); q("data-l").setAttribute("y1", M[1]); q("data-l").setAttribute("x2", N[0] + 30); q("data-l").setAttribute("y2", N[1]);
      q("data-p").setAttribute("d", "M" + A + " L" + M + " L" + N + " Z");
      q("data-m").setAttribute("cx", M[0]); q("data-m").setAttribute("cy", M[1]); q("data-n").setAttribute("cx", N[0]); q("data-n").setAttribute("cy", N[1]);
      q("data-tm").setAttribute("x", M[0] - 22); q("data-tm").setAttribute("y", M[1] - 6); q("data-tn").setAttribute("x", N[0] + 8); q("data-tn").setAttribute("y", N[1] - 6);
      ["data-r1", "data-r2", "data-r3"].forEach(function (s) { q(s).textContent = f(k); });
      q("data-v").textContent = f(k);
    }
    r.addEventListener("input", maj); maj();
  });

  /* ---------- Racine carrée : l'aire change, le côté suit ---------- */
  VRT_A("3e-maths-racines", 0, "Choisis l'aire du carré", function (el) {
    el.innerHTML = "<svg viewBox='0 0 420 220' class='an-svg'><rect data-c x='40' y='20' fill='#DBE8FE' stroke='#142554' stroke-width='2.5' rx='3' style='transition:width .25s,height .25s'/><text data-a x='0' y='0' text-anchor='middle' font-size='22' font-weight='700' fill='#142554'></text><text x='250' y='80' font-size='17' fill='#142554'>côté = √aire</text><text data-s x='250' y='116' font-size='26' font-weight='700' fill='#1E499B'></text><text data-e x='250' y='150' font-size='14' fill='#636A80'></text></svg>" + curseur("Aire :", 1, 144, 1, 49, " m²");
    var r = el.querySelector("input");
    function maj() {
      var a = +r.value, s = Math.sqrt(a), px = 16 + s * 14.5, c = el.querySelector("[data-c]");
      c.setAttribute("width", px); c.setAttribute("height", px);
      var t = el.querySelector("[data-a]"); t.setAttribute("x", 40 + px / 2); t.setAttribute("y", 20 + px / 2 + 8); t.textContent = px > 60 ? a : "";
      el.querySelector("[data-s]").textContent = "√" + a + " = " + (Number.isInteger(s) ? s : "≈ " + f(s));
      el.querySelector("[data-e]").textContent = Number.isInteger(s) ? a + " est un carré parfait (" + s + " × " + s + ")" : "entre " + Math.floor(s) + " et " + Math.ceil(s);
      el.querySelector("[data-v]").textContent = a;
    }
    r.addEventListener("input", maj); maj();
  });

  /* ---------- Atome : électrons en orbite, Z réglable (couches K et L) ---------- */
  var ELEM = ["", "H Hydrogène", "He Hélium", "Li Lithium", "Be Béryllium", "B Bore", "C Carbone", "N Azote", "O Oxygène", "F Fluor", "Ne Néon", "Na Sodium"];
  VRT_A("3e-pct-atome", 0, "Choisis un élément et regarde ses électrons", function (el) {
    el.innerHTML = "<div class='an-atome'><svg viewBox='0 0 300 300' class='an-svg' style='max-width:320px;margin:auto'><circle cx='150' cy='150' r='62' fill='none' stroke='#8FB0EE' stroke-dasharray='4 6'/><circle cx='150' cy='150' r='104' fill='none' stroke='#8FB0EE' stroke-dasharray='4 6'/><circle cx='150' cy='150' r='138' fill='none' stroke='#8FB0EE' stroke-dasharray='4 6'/><g data-noyau></g><g class='an-orb an-k' data-k></g><g class='an-orb an-l' data-l></g><g class='an-orb an-m' data-mm></g></svg>" +
      "<div class='an-res'><span><b data-nom></b></span><span>Z = <b data-z></b></span><span>Couches : <b data-c></b></span></div></div>" + curseur("Numéro atomique Z :", 1, 11, 1, 3);
    var r = el.querySelector("input");
    function pts(g, n, rad) {
      g.innerHTML = ""; for (var i = 0; i < n; i++) { var a = 2 * Math.PI * i / n, c = document.createElementNS(NS, "circle");
        c.setAttribute("cx", 150 + rad * Math.cos(a)); c.setAttribute("cy", 150 + rad * Math.sin(a)); c.setAttribute("r", 8); c.setAttribute("fill", "#FFC93C"); c.setAttribute("stroke", "#142554"); c.setAttribute("stroke-width", "1.5"); g.appendChild(c); }
    }
    function maj() {
      var z = +r.value, k = Math.min(z, 2), l = Math.min(Math.max(z - 2, 0), 8), m = Math.max(z - 10, 0), no = el.querySelector("[data-noyau]");
      no.innerHTML = ""; var n = z * 2, s = 0;
      for (var i = 0; i < n; i++) { var a = i * 2.4, rr = 5 * Math.sqrt(i), c = document.createElementNS(NS, "circle");
        c.setAttribute("cx", 150 + rr * Math.cos(a)); c.setAttribute("cy", 150 + rr * Math.sin(a)); c.setAttribute("r", 6); c.setAttribute("fill", i % 2 ? "#8C9BC0" : "#D9472B"); no.appendChild(c); s++; }
      pts(el.querySelector("[data-k]"), k, 62); pts(el.querySelector("[data-l]"), l, 104); pts(el.querySelector("[data-mm]"), m, 138);
      el.querySelector("[data-nom]").textContent = ELEM[z]; el.querySelector("[data-z]").textContent = z + " protons, " + z + " électrons";
      el.querySelector("[data-c]").textContent = "K" + k + (l ? " L" + l : "") + (m ? " M" + m : ""); el.querySelector("[data-v]").textContent = z;
    }
    r.addEventListener("input", maj); maj();
  });

  /* ---------- pH : choisir une solution, l'aiguille et le papier réagissent ---------- */
  var SOL = [["Jus de citron", 2], ["Vinaigre", 3], ["Jus d'orange", 4], ["Eau de pluie", 6], ["Eau pure", 7], ["Sang", 7.4], ["Eau de mer", 8], ["Bicarbonate", 9], ["Eau savonneuse", 10], ["Eau de javel", 12]];
  VRT_A("3e-pct-ph", 1, "Teste une solution au papier pH", function (el) {
    el.innerHTML = "<div class='an-choix'>" + SOL.map(function (s, i) { return "<button type='button' data-i='" + i + "'>" + s[0] + "</button>"; }).join("") + "</div>" +
      "<svg viewBox='0 0 440 150' class='an-svg'><defs><linearGradient id='phg2' x1='0' x2='1'><stop offset='0' stop-color='#D9472B'/><stop offset='.35' stop-color='#FFC93C'/><stop offset='.5' stop-color='#7FCB8C'/><stop offset='.75' stop-color='#8FB0EE'/><stop offset='1' stop-color='#5B4FA8'/></linearGradient></defs><rect x='20' y='60' width='400' height='26' rx='13' fill='url(#phg2)'/><g font-size='12' fill='#142554' text-anchor='middle'><text x='20' y='104'>0</text><text x='220' y='104'>7</text><text x='420' y='104'>14</text></g><g data-aig style='transition:transform .6s cubic-bezier(.2,.8,.2,1)'><path d='M0 30 L-9 50 L9 50 Z' fill='#142554'/></g><rect data-pap x='170' y='116' width='100' height='26' rx='4' stroke='#142554' style='transition:fill .6s'/><text x='280' y='134' font-size='13' fill='#636A80'>papier pH</text></svg><div class='an-res'><span>pH ≈ <b data-ph>?</b></span><span><b data-nat>Choisis une solution</b></span></div>";
    function couleur(p) { var c = ["#D9472B", "#E8713A", "#F29A3A", "#FFC93C", "#D6D24A", "#A9CF5E", "#7FCB8C", "#6FBF9A", "#7DB2C8", "#8FB0EE", "#8C8FD8", "#7B6FC4", "#6A5CB6", "#5B4FA8", "#4A3F94"]; return c[Math.round(p)]; }
    el.querySelectorAll(".an-choix button").forEach(function (b) {
      b.addEventListener("click", function () {
        el.querySelectorAll(".an-choix button").forEach(function (x) { x.setAttribute("aria-pressed", x === b); });
        var s = SOL[+b.dataset.i], p = s[1];
        el.querySelector("[data-aig]").style.transform = "translateX(" + (20 + p / 14 * 400) + "px)";
        el.querySelector("[data-pap]").setAttribute("fill", couleur(p));
        el.querySelector("[data-ph]").textContent = f(p, 1);
        el.querySelector("[data-nat]").textContent = p < 7 ? "acide" : p === 7 ? "neutre" : "basique";
      });
    });
    el.querySelector("[data-aig]").style.transform = "translateX(220px)"; el.querySelector("[data-pap]").setAttribute("fill", "#F3F0EA");
  });

  /* ---------- ADN : zoom en 4 étapes + double hélice qui tourne ---------- */
  VRT_A("3e-svt-adn", 2, "Zoome de la cellule jusqu'au gène", function (el) {
    var ET = [
      ["Cellule", "Une cellule du corps : au centre, le noyau.", "<circle cx='210' cy='110' r='90' fill='#E0F5E5' stroke='#00520B' stroke-width='2.5'/><circle cx='222' cy='104' r='36' fill='#7FCB8C' stroke='#00520B' stroke-width='2.5'/><circle cx='150' cy='150' r='8' fill='#C7E8CE'/><circle cx='270' cy='160' r='6' fill='#C7E8CE'/>"],
      ["Noyau", "Dans le noyau, au moment de la division : 46 chromosomes.", "<circle cx='210' cy='110' r='96' fill='#7FCB8C' fill-opacity='.4' stroke='#00520B' stroke-width='2.5'/>" + (function () { var s = ""; for (var i = 0; i < 18; i++) { var a = i * 0.9, r = 18 + i * 3.6, x = 210 + r * Math.cos(a), y = 110 + r * Math.sin(a) * .8; s += "<g transform='translate(" + x + " " + y + ") rotate(" + (i * 37) + ")'><path d='M-4 -12 L4 12 M4 -12 L-4 12' stroke='#007E11' stroke-width='5' stroke-linecap='round'/></g>"; } return s; })()],
      ["Chromosome", "Un chromosome : deux chromatides reliées au centre.", "<g stroke='#007E11' stroke-width='26' stroke-linecap='round'><path d='M170 30 L250 190'/><path d='M250 30 L170 190'/></g><circle cx='210' cy='110' r='12' fill='#00520B'/>"],
      ["ADN et gène", "Déroulé, le chromosome est une double hélice d'ADN ; un gène en est un segment.", "<g class='an-helice'>" + (function () { var s = ""; for (var i = 0; i <= 24; i++) { var x = 40 + i * 14.5, y1 = 110 + 50 * Math.sin(i * 0.52), y2 = 110 - 50 * Math.sin(i * 0.52); s += "<line x1='" + x + "' y1='" + y1 + "' x2='" + x + "' y2='" + y2 + "' stroke='" + (i > 9 && i < 15 ? "#FFC93C" : "#8FB0EE") + "' stroke-width='3'/><circle cx='" + x + "' cy='" + y1 + "' r='4' fill='#1E499B'/><circle cx='" + x + "' cy='" + y2 + "' r='4' fill='#007E11'/>"; } return s; })() + "</g><text x='225' y='210' text-anchor='middle' font-size='14' font-weight='700' fill='#9A6F00'>un gène</text>"]
    ], cur = 0;
    el.innerHTML = "<div class='an-etapes'>" + ET.map(function (e, i) { return "<button type='button' data-i='" + i + "'>" + (i + 1) + ". " + e[0] + "</button>"; }).join("") + "</div><svg viewBox='0 0 420 220' class='an-svg an-zoom' data-sv></svg><p class='an-note' data-t></p>";
    function aff(i) {
      cur = i; var sv = el.querySelector("[data-sv]"); sv.classList.remove("an-in"); void sv.getBBox; sv.innerHTML = ET[i][2];
      requestAnimationFrame(function () { sv.classList.add("an-in"); });
      el.querySelector("[data-t]").textContent = ET[i][1];
      el.querySelectorAll(".an-etapes button").forEach(function (b, k) { b.setAttribute("aria-pressed", k === i); });
    }
    el.querySelectorAll(".an-etapes button").forEach(function (b) { b.addEventListener("click", function () { aff(+b.dataset.i); }); });
    aff(0);
  });

  /* ---------- Ressemblances : choisir les allèles, le caractère change ---------- */
  VRT_A("3e-svt-ressemblances", 1, "Combine les caractères d'un visage", function (el) {
    el.innerHTML = "<div class='an-choix' data-g='lobe'><span>Lobe :</span><button type='button' aria-pressed='true' data-v='libre'>libre</button><button type='button' data-v='attache'>attaché</button></div>" +
      "<div class='an-choix' data-g='yeux'><span>Yeux :</span><button type='button' aria-pressed='true' data-v='#5A3A1E'>marron foncé</button><button type='button' data-v='#8A5A2B'>marron clair</button><button type='button' data-v='#3B6B4A'>verts</button></div>" +
      "<div class='an-choix' data-g='cheveux'><span>Cheveux :</span><button type='button' aria-pressed='true' data-v='crepus'>crépus</button><button type='button' data-v='lisses'>lisses</button></div>" +
      "<svg viewBox='0 0 300 230' class='an-svg' style='max-width:300px;margin:auto'><g data-ch></g><ellipse cx='150' cy='125' rx='70' ry='85' fill='#B9824F'/><g data-or></g><circle data-y1 cx='124' cy='112' r='7'/><circle data-y2 cx='176' cy='112' r='7'/><path d='M130 160 Q150 175 170 160' stroke='#5E2F0E' stroke-width='4' fill='none' stroke-linecap='round'/></svg>" +
      "<p class='an-note'>Tous ces visages sont humains (caractères de l'espèce) mais chacun est unique (caractères individuels).</p>";
    var etat = { lobe: "libre", yeux: "#5A3A1E", cheveux: "crepus" };
    function dess() {
      el.querySelector("[data-y1]").setAttribute("fill", etat.yeux); el.querySelector("[data-y2]").setAttribute("fill", etat.yeux);
      el.querySelector("[data-or]").innerHTML = "<path d='M80 110 q-24 4 -18 34 q6 22 " + (etat.lobe === "libre" ? "18 24 q10 4 8 -10" : "18 16") + "' fill='#A8723F' stroke='#5E2F0E' stroke-width='2'/><path d='M220 110 q24 4 18 34 q-6 22 " + (etat.lobe === "libre" ? "-18 24 q-10 4 -8 -10" : "-18 16") + "' fill='#A8723F' stroke='#5E2F0E' stroke-width='2'/>";
      var ch = ""; if (etat.cheveux === "crepus") { for (var i = 0; i < 26; i++) { var a = Math.PI + i / 25 * Math.PI; ch += "<circle cx='" + (150 + 76 * Math.cos(a)) + "' cy='" + (110 + 86 * Math.sin(a) * .9) + "' r='14' fill='#1E1A17'/>"; } }
      else ch = "<path d='M78 120 Q80 30 150 32 Q220 30 222 120 L210 80 Q150 50 90 80 Z' fill='#1E1A17'/>";
      el.querySelector("[data-ch]").innerHTML = ch;
    }
    el.querySelectorAll(".an-choix").forEach(function (g) { g.querySelectorAll("button").forEach(function (b) { b.addEventListener("click", function () { g.querySelectorAll("button").forEach(function (x) { x.setAttribute("aria-pressed", x === b); }); etat[g.dataset.g] = b.dataset.v; dess(); }); }); });
    dess();
  });

  /* ---------- IA : l'élève entraîne une mini-IA (mangue ou avocat) ---------- */
  VRT_A("6e-info-ia", 1, "Entraîne ta propre mini-IA", function (el) {
    var ex = [], test = null;
    el.innerHTML = "<p class='an-note' style='margin-top:0'>Montre-lui des fruits et dis ce que c'est. Elle compare ensuite un fruit inconnu à ceux qu'elle a vus (couleur et forme).</p><div class='an-choix'><button type='button' data-f='m'>+ une mangue</button><button type='button' data-f='a'>+ un avocat</button><button type='button' data-t>Tester un fruit inconnu</button><button type='button' data-z>Tout effacer</button></div><svg viewBox='0 0 420 200' class='an-svg' data-sv><text x='14' y='20' font-size='12' fill='#636A80'>jaune ←  couleur  → vert</text><text x='14' y='194' font-size='12' fill='#636A80'>rond ↑ forme ↓ allongé</text></svg><div class='an-res'><span>Exemples : <b data-n>0</b></span><span data-r>Ajoute au moins 2 exemples de chaque fruit.</span></div>";
    var sv = el.querySelector("[data-sv]");
    function point(x, y, f, test) { var g = document.createElementNS(NS, "g"); g.setAttribute("transform", "translate(" + x + " " + y + ")"); g.innerHTML = test ? "<circle r='13' fill='#fff' stroke='#142554' stroke-width='2' stroke-dasharray='3 3'/><text y='5' text-anchor='middle' font-size='14' font-weight='700' fill='#142554'>?</text>" : (f === "m" ? "<ellipse rx='14' ry='10' fill='#FFC93C' stroke='#9A6F00'/>" : "<ellipse rx='9' ry='13' fill='#7FCB8C' stroke='#00520B'/>"); g.setAttribute("class", "an-pop"); sv.appendChild(g); return g; }
    function hasard(f) { return f === "m" ? [60 + Math.random() * 150, 40 + Math.random() * 70] : [210 + Math.random() * 180, 100 + Math.random() * 80]; }
    el.querySelectorAll("[data-f]").forEach(function (b) { b.addEventListener("click", function () { var p = hasard(b.dataset.f); ex.push([p[0], p[1], b.dataset.f]); point(p[0], p[1], b.dataset.f); el.querySelector("[data-n]").textContent = ex.length; }); });
    el.querySelector("[data-t]").addEventListener("click", function () {
      var nm = ex.filter(function (e) { return e[2] === "m"; }).length, na = ex.length - nm, r = el.querySelector("[data-r]");
      if (nm < 2 || na < 2) { r.textContent = "Pas assez d'exemples : une IA sans données ne sait rien."; return; }
      if (test) test.remove(); var p = [40 + Math.random() * 360, 40 + Math.random() * 140]; test = point(p[0], p[1], "", true);
      var d = ex.map(function (e) { return [Math.hypot(e[0] - p[0], e[1] - p[1]), e[2]]; }).sort(function (a, b) { return a[0] - b[0]; }).slice(0, 3);
      var m = d.filter(function (x) { return x[1] === "m"; }).length; r.innerHTML = "Prédiction : <b>" + (m >= 2 ? "mangue" : "avocat") + "</b> (" + Math.round(Math.max(m, 3 - m) / 3 * 100) + " % de ses 3 voisins les plus proches)";
    });
    el.querySelector("[data-z]").addEventListener("click", function () { ex = []; test = null; sv.querySelectorAll("g").forEach(function (g) { g.remove(); }); el.querySelector("[data-n]").textContent = 0; el.querySelector("[data-r]").textContent = "Ajoute au moins 2 exemples de chaque fruit."; });
  });

  /* ---------- Ordinateur : cliquer un composant pour voir son rôle ---------- */
  VRT_A("6e-info-composants", 1, "Clique sur un élément de l'ordinateur", function (el) {
    var R = { clavier: ["Clavier", "Entrée", "Tu tapes du texte et des commandes."], souris: ["Souris", "Entrée", "Tu pointes, tu cliques, tu fais glisser."], uc: ["Unité centrale", "Traitement", "Le processeur calcule, la mémoire vive garde le travail en cours, le disque conserve les fichiers."], ecran: ["Écran", "Sortie", "Il affiche ce que l'ordinateur produit."], imprimante: ["Imprimante", "Sortie", "Elle met sur papier un document."], hp: ["Haut-parleurs", "Sortie", "Ils diffusent le son."] };
    el.innerHTML = "<svg viewBox='0 0 460 220' class='an-svg an-pc'><g data-k='ecran' tabindex='0' role='button' aria-label='Écran'><rect x='150' y='16' width='170' height='110' rx='8' fill='#E4E9F2' stroke='#0C2A6A' stroke-width='2.5'/><rect x='162' y='28' width='146' height='86' rx='4' fill='#DBE8FE'/><path d='M222 126v14h26v-14' fill='#8C9BC0'/></g><g data-k='uc' tabindex='0' role='button' aria-label='Unité centrale'><rect x='26' y='30' width='90' height='150' rx='8' fill='#0C2A6A'/><rect x='40' y='46' width='62' height='10' rx='3' fill='#FFC93C'/><circle cx='71' cy='156' r='9' fill='none' stroke='#FFC93C' stroke-width='2'/></g><g data-k='clavier' tabindex='0' role='button' aria-label='Clavier'><rect x='140' y='160' width='190' height='40' rx='6' fill='#E4E9F2' stroke='#0C2A6A' stroke-width='2.5'/><path d='M152 172h166M152 182h166M170 192h130' stroke='#8C9BC0' stroke-width='5' stroke-dasharray='10 4'/></g><g data-k='souris' tabindex='0' role='button' aria-label='Souris'><rect x='346' y='160' width='30' height='44' rx='15' fill='#E4E9F2' stroke='#0C2A6A' stroke-width='2.5'/><path d='M361 160v14' stroke='#0C2A6A' stroke-width='2'/></g><g data-k='imprimante' tabindex='0' role='button' aria-label='Imprimante'><rect x='350' y='60' width='96' height='50' rx='8' fill='#E4E9F2' stroke='#0C2A6A' stroke-width='2.5'/><rect x='368' y='44' width='60' height='18' fill='#fff' stroke='#0C2A6A' stroke-width='2'/><rect x='368' y='100' width='60' height='22' fill='#fff' stroke='#0C2A6A' stroke-width='2'/></g><g data-k='hp' tabindex='0' role='button' aria-label='Haut-parleurs'><rect x='122' y='70' width='22' height='44' rx='6' fill='#8C9BC0' stroke='#0C2A6A' stroke-width='2'/><circle cx='133' cy='100' r='6' fill='#0C2A6A'/></g></svg><div class='an-fiche' data-f><b>Clique sur un élément</b><span>Écran, clavier, souris, unité centrale, imprimante ou haut-parleurs.</span></div>";
    el.querySelectorAll("[data-k]").forEach(function (g) {
      function choisir() { el.querySelectorAll("[data-k]").forEach(function (x) { x.classList.toggle("an-sel", x === g); }); var r = R[g.dataset.k]; el.querySelector("[data-f]").innerHTML = "<b>" + r[0] + "</b><em class='an-tag an-" + (r[1] === "Entrée" ? "in" : r[1] === "Sortie" ? "out" : "uc") + "'>" + r[1] + "</em><span>" + r[2] + "</span>"; }
      g.addEventListener("click", choisir); g.addEventListener("keydown", function (e) { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); choisir(); } });
    });
  });
})();
