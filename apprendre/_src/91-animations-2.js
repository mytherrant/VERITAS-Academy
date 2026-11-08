/* Schémas animés et manipulables — lot 2. Mêmes règles : transform/opacity, lisible sans animation. */
(function () {
  var NS = "http://www.w3.org/2000/svg";
  function cur(lab, min, max, pas, val, u) { return "<label class='an-cur'><span>" + lab + " <b data-v>" + val + "</b>" + (u || "") + "</span><input type='range' min='" + min + "' max='" + max + "' step='" + pas + "' value='" + val + "'></label>"; }
  function q(el, s) { return el.querySelector(s); }

  /* ---------- 6e : testeur de divisibilité ---------- */
  VRT_A("6e-maths-divisibilite", 1, "Tape un nombre : les critères se vérifient tout seuls", function (el) {
    el.innerHTML = "<label class='an-cur'><span>Ton nombre</span><input type='number' min='0' max='99999999' value='2745' style='width:100%;font:600 22px Poppins,sans-serif;padding:8px 12px;border:1px solid #E6EAF2;border-radius:10px'></label><div class='an-grille' data-g></div><p class='an-note' data-s></p>";
    var inp = q(el, "input");
    function maj() {
      var n = Math.max(0, Math.floor(+inp.value || 0)), s = String(n), som = s.split("").reduce(function (a, c) { return a + +c; }, 0), u = s.slice(-1);
      var T = [["2", n % 2 === 0, "dernier chiffre " + u + (n % 2 === 0 ? " pair" : " impair")], ["5", n % 5 === 0, "se termine par " + u], ["10", n % 10 === 0, "se termine par " + u], ["3", n % 3 === 0, "somme des chiffres " + som], ["9", n % 9 === 0, "somme des chiffres " + som]];
      q(el, "[data-g]").innerHTML = T.map(function (t) { return "<div class='an-carte " + (t[1] ? "an-oui" : "an-non") + "'><b>÷ " + t[0] + "</b><span>" + (t[1] ? VRT.app.pic("coche", 16) + " oui" : VRT.app.pic("croix", 16) + " non") + "</span><small>" + t[2] + "</small></div>"; }).join("");
      q(el, "[data-s]").textContent = s.length > 1 ? "Somme des chiffres : " + s.split("").join(" + ") + " = " + som : "";
    }
    inp.addEventListener("input", maj); maj();
  });

  /* ---------- 5e : PGCD, diviseurs qui s'allument ---------- */
  VRT_A("5e-maths-pgcd", 1, "Choisis deux nombres : leurs diviseurs communs s'allument", function (el) {
    el.innerHTML = cur("a =", 2, 60, 1, 24) + cur("b =", 2, 60, 1, 36).replace("data-v", "data-w") + "<div data-l></div><div class='an-res'><span>PGCD = <b data-p></b></span><span data-r></span></div>";
    var r = el.querySelectorAll("input");
    function div(n) { var d = []; for (var i = 1; i <= n; i++) if (n % i === 0) d.push(i); return d; }
    function maj() {
      var a = +r[0].value, b = +r[1].value, da = div(a), db = div(b), co = da.filter(function (x) { return db.indexOf(x) >= 0; }), p = co[co.length - 1];
      q(el, "[data-v]").textContent = a; q(el, "[data-w]").textContent = b;
      function ligne(n, d) { return "<p style='margin:8px 0 4px;font-size:13px;color:#4D5163'>Diviseurs de " + n + "</p><div class='an-chips'>" + d.map(function (x) { return "<span class='" + (x === p ? "an-pg" : co.indexOf(x) >= 0 ? "an-co" : "") + "'>" + x + "</span>"; }).join("") + "</div>"; }
      q(el, "[data-l]").innerHTML = ligne(a, da) + ligne(b, db);
      q(el, "[data-p]").textContent = p; q(el, "[data-r]").textContent = p === 1 ? a + " et " + b + " sont premiers entre eux" : a + "/" + b + " = " + (a / p) + "/" + (b / p) + " (fraction irréductible)";
    }
    r[0].addEventListener("input", maj); r[1].addEventListener("input", maj); maj();
  });

  /* ---------- 4e : boussoles autour d'un aimant (champ de dipôle) ---------- */
  VRT_A("4e-pct-aimants", 1, "Déplace l'aimant : les boussoles s'orientent", function (el) {
    el.innerHTML = "<svg viewBox='0 0 460 260' class='an-svg' data-sv style='touch-action:none;cursor:grab'></svg><p class='an-note'>Fais glisser l'aimant (ou utilise les flèches du clavier). L'aiguille rouge indique le Nord de chaque boussole : elle pointe vers le pôle Sud de l'aimant.</p>";
    var sv = q(el, "[data-sv]"), ax = 230, ay = 130, boussoles = [];
    for (var i = 0; i < 7; i++) for (var j = 0; j < 4; j++) {
      var g = document.createElementNS(NS, "g"), x = 40 + i * 63, y = 35 + j * 63;
      g.innerHTML = "<circle r='15' fill='#fff' stroke='#C9CFDD' stroke-width='1.5'/><g data-a style='transition:transform .25s'><path d='M0 -12 L4 0 L-4 0Z' fill='#D9472B'/><path d='M0 12 L4 0 L-4 0Z' fill='#8C9BC0'/></g>";
      g.setAttribute("transform", "translate(" + x + " " + y + ")"); sv.appendChild(g); boussoles.push([x, y, g.querySelector("[data-a]")]);
    }
    var aim = document.createElementNS(NS, "g"); aim.setAttribute("tabindex", "0"); aim.setAttribute("role", "slider"); aim.setAttribute("aria-label", "Aimant, déplaçable");
    aim.innerHTML = "<rect x='-50' y='-14' width='50' height='28' rx='4' fill='#D9472B'/><rect x='0' y='-14' width='50' height='28' rx='4' fill='#1E499B'/><text x='-25' y='5' text-anchor='middle' font-size='14' font-weight='600' fill='#fff'>N</text><text x='25' y='5' text-anchor='middle' font-size='14' font-weight='600' fill='#fff'>S</text>";
    sv.appendChild(aim);
    function champ(px, py) { /* pôle N (+) à gauche, pôle S (−) à droite */
      var bx = 0, by = 0;[[ax - 40, ay, 1], [ax + 40, ay, -1]].forEach(function (p) { var dx = px - p[0], dy = py - p[1], d = Math.pow(dx * dx + dy * dy, 1.5) + 1; bx += p[2] * dx / d; by += p[2] * dy / d; });
      return Math.atan2(by, bx) * 180 / Math.PI + 90;
    }
    function maj() { aim.setAttribute("transform", "translate(" + ax + " " + ay + ")"); boussoles.forEach(function (b) { b[2].style.transform = "rotate(" + champ(b[0], b[1]) + "deg)"; }); }
    function pt(e) { var r = sv.getBoundingClientRect(); return [(e.clientX - r.left) / r.width * 460, (e.clientY - r.top) / r.height * 260]; }
    var drag = false;
    aim.addEventListener("pointerdown", function (e) { drag = true; aim.setPointerCapture(e.pointerId); });
    aim.addEventListener("pointermove", function (e) { if (!drag) return; var p = pt(e); ax = Math.max(55, Math.min(405, p[0])); ay = Math.max(20, Math.min(240, p[1])); maj(); });
    aim.addEventListener("pointerup", function () { drag = false; });
    aim.addEventListener("keydown", function (e) { var d = { ArrowLeft: [-15, 0], ArrowRight: [15, 0], ArrowUp: [0, -15], ArrowDown: [0, 15] }[e.key]; if (d) { e.preventDefault(); ax = Math.max(55, Math.min(405, ax + d[0])); ay = Math.max(20, Math.min(240, ay + d[1])); maj(); } });
    maj();
  });

  /* ---------- 4e : élodée, bulles selon la lumière ---------- */
  VRT_A("4e-svt-photosynthese", 2, "Règle la lampe et compte les bulles", function (el) {
    el.innerHTML = "<svg viewBox='0 0 460 240' class='an-svg'><circle data-lampe cx='70' cy='60' r='26' fill='#FFC93C'/><g data-rayons stroke='#FFC93C' stroke-width='3' stroke-linecap='round'><path d='M110 60h40M100 90l30 22M100 30l30-22'/></g><rect x='190' y='40' width='200' height='190' rx='12' fill='#EDF2FB' stroke='#9FBEEA' stroke-width='2'/><rect x='190' y='60' width='200' height='170' fill='#DBE8FE' opacity='.7'/><path d='M290 228 C285 190 300 160 290 120 C282 95 295 80 290 70' stroke='#007E11' stroke-width='5' fill='none'/><g fill='#86D094'><ellipse cx='278' cy='200' rx='12' ry='4'/><ellipse cx='303' cy='175' rx='12' ry='4'/><ellipse cx='279' cy='150' rx='12' ry='4'/><ellipse cx='302' cy='122' rx='12' ry='4'/><ellipse cx='281' cy='96' rx='12' ry='4'/></g><g data-b></g></svg>" + cur("Intensité lumineuse :", 0, 10, 1, 6) + "<div class='an-res'><span>Bulles de dioxygène : <b data-n>0</b> par minute</span></div>";
    var r = q(el, "input"), gb = q(el, "[data-b]"), t = null;
    function bulle() {
      var c = document.createElementNS(NS, "circle"); c.setAttribute("cx", 286 + Math.random() * 10); c.setAttribute("cy", 72); c.setAttribute("r", 3 + Math.random() * 2); c.setAttribute("fill", "#fff"); c.setAttribute("stroke", "#1E499B"); c.setAttribute("class", "an-bulle"); gb.appendChild(c); setTimeout(function () { c.remove(); }, 1600);
    }
    function maj() {
      var v = +r.value; q(el, "[data-v]").textContent = v; q(el, "[data-n]").textContent = v * 6;
      q(el, "[data-lampe]").setAttribute("opacity", 0.25 + v / 13); q(el, "[data-rayons]").setAttribute("opacity", v / 10);
      clearInterval(t); if (v > 0 && !matchMedia("(prefers-reduced-motion: reduce)").matches) t = setInterval(bulle, 1100 - v * 95);
    }
    r.addEventListener("input", maj); maj();
  });

  /* ---------- Tle C : 8 bits cliquables ---------- */
  VRT_A("tle-maths-binaire", 0, "Allume les bits : le nombre décimal se calcule", function (el) {
    el.innerHTML = "<div class='an-bits' data-b></div><div class='an-res'><span>Écriture binaire : <b data-bin></b></span><span>Valeur décimale : <b data-dec></b></span></div><p class='an-note' data-s></p>";
    var bits = [0, 0, 0, 0, 1, 1, 0, 1];
    function rendre() {
      q(el, "[data-b]").innerHTML = bits.map(function (b, i) { var p = 7 - i; return "<button type='button' aria-pressed='" + !!b + "' data-i='" + i + "'><b>" + b + "</b><small>2<sup>" + p + "</sup> = " + Math.pow(2, p) + "</small></button>"; }).join("");
      var dec = bits.reduce(function (a, b, i) { return a + b * Math.pow(2, 7 - i); }, 0), termes = bits.map(function (b, i) { return b ? Math.pow(2, 7 - i) : 0; }).filter(Boolean);
      q(el, "[data-bin]").textContent = (bits.join("").replace(/^0+(?=.)/, "")) + "₂"; q(el, "[data-dec]").textContent = dec;
      q(el, "[data-s]").textContent = termes.length ? termes.join(" + ") + " = " + dec : "Tous les bits sont éteints : 0.";
      el.querySelectorAll("[data-i]").forEach(function (b) { b.addEventListener("click", function () { bits[+b.dataset.i] ^= 1; rendre(); }); });
    }
    rendre();
  });

  /* ---------- Tle D : globule rouge et cellule végétale selon la concentration ---------- */
  VRT_A("tle-svt-osmose", 1, "Change la concentration du milieu", function (el) {
    el.innerHTML = "<svg viewBox='0 0 460 200' class='an-svg'><g transform='translate(115 95)'><ellipse data-gr rx='60' ry='60' fill='#F2A595' stroke='#B4321E' stroke-width='3' style='transition:all .5s'/><ellipse data-gr2 rx='30' ry='14' fill='#E8806C' opacity='.6' style='transition:all .5s'/></g><text x='115' y='190' text-anchor='middle' font-size='13' fill='#001136'>globule rouge</text><g transform='translate(340 95)'><rect x='-75' y='-65' width='150' height='130' rx='6' fill='#E0F5E5' stroke='#004A0A' stroke-width='4'/><rect data-cyto x='-68' y='-58' width='136' height='116' rx='10' fill='#C9E7CF' stroke='#007E11' stroke-width='1.5' style='transition:all .5s'/><rect data-vac x='-50' y='-42' width='100' height='84' rx='26' fill='#DBE8FE' stroke='#1E499B' style='transition:all .5s'/></g><text x='340' y='190' text-anchor='middle' font-size='13' fill='#001136'>cellule végétale</text></svg>" + cur("NaCl dans le milieu :", 0, 30, 1, 9, " g/L") + "<div class='an-res'><span>Milieu <b data-m></b></span><span data-e></span></div>";
    var r = q(el, "input");
    function maj() {
      var c = +r.value, k = Math.max(-1, Math.min(1, (9 - c) / 9)); /* + : hypotonique, − : hypertonique */
      q(el, "[data-v]").textContent = c;
      var gr = q(el, "[data-gr]"), eclate = c <= 2;
      gr.setAttribute("rx", eclate ? 0 : 60 + k * 14); gr.setAttribute("ry", eclate ? 0 : (k >= 0 ? 60 + k * 14 : 60 + k * 26)); gr.setAttribute("stroke-dasharray", k < -.3 ? "6 4" : "none");
      q(el, "[data-gr2]").setAttribute("opacity", eclate ? 0 : .6);
      var s = k >= 0 ? 1 : 1 + k * .45, cy = q(el, "[data-cyto]"), va = q(el, "[data-vac]");
      cy.setAttribute("width", 136 * s); cy.setAttribute("height", 116 * s); cy.setAttribute("x", -68 * s); cy.setAttribute("y", -58 * s);
      var sv = k >= 0 ? 1 + k * .25 : 1 + k * .7; va.setAttribute("width", 100 * sv); va.setAttribute("height", 84 * sv); va.setAttribute("x", -50 * sv); va.setAttribute("y", -42 * sv);
      q(el, "[data-m]").textContent = c < 8 ? "hypotonique" : c > 10 ? "hypertonique" : "isotonique";
      q(el, "[data-e]").textContent = c <= 2 ? "Hémolyse : le globule éclate ; la cellule végétale est turgescente." : c < 8 ? "L'eau entre : le globule gonfle, la vacuole se remplit." : c > 10 ? "L'eau sort : le globule se ratatine, plasmolyse de la cellule végétale." : "Équilibre : pas de mouvement net d'eau.";
    }
    r.addEventListener("input", maj); maj();
  });

  /* ---------- 4e grec : alphabet cliquable ---------- */
  var GR = [["Α α", "alpha", "a", "alphabet"], ["Β β", "bêta", "b", "biologie (βίος)"], ["Γ γ", "gamma", "g", "géographie (γῆ)"], ["Δ δ", "delta", "d", "démocratie (δῆμος)"], ["Ε ε", "epsilon", "e bref", "écologie"], ["Ζ ζ", "zêta", "dz", "zoologie (ζῷον)"], ["Η η", "êta", "ê long", "hémisphère"], ["Θ θ", "thêta", "th", "théâtre (θέατρον)"], ["Ι ι", "iota", "i", "idée"], ["Κ κ", "kappa", "k", "cinéma (κίνημα)"], ["Λ λ", "lambda", "l", "logique (λόγος)"], ["Μ μ", "mu", "m", "musique (μουσική)"], ["Ν ν", "nu", "n", "nautique (ναῦς)"], ["Ξ ξ", "xi", "ks", "xénophobe (ξένος)"], ["Ο ο", "omicron", "o bref", "orthographe"], ["Π π", "pi", "p", "politique (πόλις)"], ["Ρ ρ", "rhô", "r", "rhétorique"], ["Σ σ ς", "sigma", "s", "symphonie"], ["Τ τ", "tau", "t", "téléphone (τῆλε)"], ["Υ υ", "upsilon", "u (ü)", "hydraulique (ὕδωρ)"], ["Φ φ", "phi", "ph", "philosophie (φίλος)"], ["Χ χ", "khi", "kh", "chronologie (χρόνος)"], ["Ψ ψ", "psi", "ps", "psychologie (ψυχή)"], ["Ω ω", "oméga", "ô long", "horoscope (ὥρα)"]];
  VRT_A("4e-gr-alphabet", 1, "Clique une lettre : nom, son et un mot français", function (el) {
    el.innerHTML = "<div class='an-grec'>" + GR.map(function (g, i) { return "<button type='button' data-i='" + i + "'>" + g[0].split(" ")[1] + "</button>"; }).join("") + "</div><div class='an-fiche' data-f><b>Choisis une lettre</b><span>Les 24 lettres, de l'alpha à l'oméga.</span></div>";
    el.querySelectorAll("[data-i]").forEach(function (b) { b.addEventListener("click", function () {
      el.querySelectorAll("[data-i]").forEach(function (x) { x.setAttribute("aria-pressed", x === b); }); var g = GR[+b.dataset.i];
      q(el, "[data-f]").innerHTML = "<b style='font-size:28px'>" + g[0] + "</b><span><strong>" + g[1] + "</strong> · se prononce « " + g[2] + " »</span><span>Dans un mot français : <em>" + g[3] + "</em></span>";
    }); });
  });

  /* ---------- 3e arts : la lampe tourne, l'ombre suit ---------- */
  VRT_A("3e-arts-ombre", 0, "Déplace la lampe autour de la sphère", function (el) {
    el.innerHTML = "<svg viewBox='0 0 460 260' class='an-svg'><defs><radialGradient id='sph' data-g cx='35%' cy='35%' r='75%'><stop offset='0' stop-color='#fff'/><stop offset='.35' stop-color='#C9CFDD'/><stop offset='.8' stop-color='#4D5163'/><stop offset='1' stop-color='#1E2333'/></radialGradient></defs><rect x='0' y='190' width='460' height='70' fill='#F5F7FB'/><ellipse data-ombre cx='270' cy='205' rx='70' ry='14' fill='#001136' opacity='.35'/><circle cx='230' cy='140' r='60' fill='url(#sph)'/><g data-lampe><circle r='16' fill='#FFC93C' stroke='#9A6F00' stroke-width='2'/><path d='M0 -26v-8M18 -18l6-6M-18 -18l-6-6' stroke='#FFC93C' stroke-width='3' stroke-linecap='round'/></g><text data-t1 font-size='12' fill='#C24E00'>ombre propre</text><text data-t2 font-size='12' fill='#001136'>ombre portée</text></svg>" + cur("Position de la lampe :", 10, 170, 1, 45, "°");
    var r = q(el, "input");
    function maj() {
      var a = +r.value * Math.PI / 180, lx = 230 - Math.cos(a) * 170, ly = 140 - Math.sin(a) * 120;
      q(el, "[data-v]").textContent = r.value;
      q(el, "[data-lampe]").setAttribute("transform", "translate(" + lx + " " + ly + ")");
      var g = q(el, "[data-g]"); g.setAttribute("cx", (50 - Math.cos(a) * 25) + "%"); g.setAttribute("cy", (50 - Math.sin(a) * 25) + "%");
      var hauteur = Math.max(0.15, Math.sin(a)), long = 60 / hauteur, dir = Math.cos(a) >= 0 ? 1 : -1;
      var om = q(el, "[data-ombre]"); om.setAttribute("rx", Math.min(220, 40 + long * .6)); om.setAttribute("cx", 230 + dir * Math.min(200, long * .7));
      var t1 = q(el, "[data-t1]"); t1.setAttribute("x", 230 + dir * 30); t1.setAttribute("y", 150 + 10);
      var t2 = q(el, "[data-t2]"); t2.setAttribute("x", Math.max(10, Math.min(380, 230 + dir * Math.min(200, long * .7) - 30))); t2.setAttribute("y", 240);
    }
    r.addEventListener("input", maj); maj();
  });

  /* ---------- 6e EPS : la piste, cliquer les éléments ---------- */
  VRT_A("6e-eps-piste", 0, "Clique sur la piste pour nommer ses parties", function (el) {
    var R = { corde: ["La corde", "Bord intérieur de la piste ; le couloir 1 la longe."], couloir: ["Un couloir", "Bande de 1,22 m environ ; le coureur doit y rester."], droite: ["Ligne droite", "Deux lignes droites sur un tour."], virage: ["Virage", "Deux virages ; plus long dans les couloirs extérieurs."], arrivee: ["Ligne d'arrivée", "Commune à toutes les courses."], sens: ["Sens de course", "Inverse des aiguilles d'une montre : la corde est à gauche."] };
    el.innerHTML = "<svg viewBox='0 0 460 240' class='an-svg an-pc'><g data-k='couloir' tabindex='0' role='button' aria-label='Couloir'><rect x='30' y='20' width='400' height='200' rx='100' fill='#E8806C'/></g><g stroke='#fff' stroke-width='1.2' fill='none'>" + [0, 1, 2, 3, 4, 5, 6, 7].map(function (i) { var d = 12 * i; return "<rect x='" + (30 + d * .5) + "' y='" + (20 + d * .5) + "' width='" + (400 - d) + "' height='" + (200 - d) + "' rx='" + (100 - d * .5) + "'/>"; }).join("") + "</g><g data-k='corde' tabindex='0' role='button' aria-label='Corde'><rect x='78' y='68' width='304' height='104' rx='52' fill='#86D094' stroke='#fff' stroke-width='4'/></g><g data-k='droite' tabindex='0' role='button' aria-label='Ligne droite'><rect x='140' y='22' width='180' height='44' fill='transparent'/></g><g data-k='virage' tabindex='0' role='button' aria-label='Virage'><rect x='32' y='60' width='50' height='120' fill='transparent'/></g><g data-k='arrivee' tabindex='0' role='button' aria-label='Ligne d arrivée'><rect x='318' y='172' width='8' height='48' fill='#fff' stroke='#001136'/></g><g data-k='sens' tabindex='0' role='button' aria-label='Sens de course'><path d='M200 120 a30 30 0 1 0 60 0' fill='none' stroke='#001136' stroke-width='4' marker-end='url(#fs)'/></g><defs><marker id='fs' viewBox='0 0 10 10' refX='6' refY='5' markerWidth='6' markerHeight='6' orient='auto'><path d='M0 0l10 5-10 5z' fill='#001136'/></marker></defs></svg><div class='an-fiche' data-f><b>Clique sur un élément</b><span>Corde, couloir, ligne droite, virage, ligne d'arrivée, sens de course.</span></div>";
    el.querySelectorAll("[data-k]").forEach(function (g) { function f() { el.querySelectorAll("[data-k]").forEach(function (x) { x.classList.toggle("an-sel", x === g); }); var r = R[g.dataset.k]; q(el, "[data-f]").innerHTML = "<b>" + r[0] + "</b><span>" + r[1] + "</span>"; } g.addEventListener("click", f); g.addEventListener("keydown", function (e) { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); f(); } }); });
  });

  /* ---------- 6e EPS : coureur en coordination croisée ---------- */
  VRT_A("6e-eps-bras-jambes", 0, "Observe la coordination croisée", function (el) {
    el.innerHTML = "<svg viewBox='0 0 300 240' class='an-svg' style='max-width:320px;margin:auto'><g transform='translate(150 40)' stroke-linecap='round' stroke-width='9' fill='none'><circle cx='0' cy='0' r='16' fill='#F5B57A' stroke='none'/><path d='M0 18 L4 92' stroke='#0C2A6A'/><g class='an-membre an-bd'><path d='M2 30 L-22 60 L-6 84' stroke='#1E499B'/></g><g class='an-membre an-bg'><path d='M2 30 L26 58 L44 44' stroke='#D9472B'/></g><g class='an-membre an-jd'><path d='M4 92 L-18 140 L-40 170' stroke='#D9472B'/></g><g class='an-membre an-jg'><path d='M4 92 L30 136 L22 182' stroke='#1E499B'/></g></g><text x='20' y='230' font-size='12' fill='#1E499B'>■ bras gauche + jambe droite</text><text x='170' y='230' font-size='12' fill='#D9472B'>■ bras droit + jambe gauche</text></svg><p class='an-note'>Même couleur = membres qui avancent ensemble : un bras et la jambe opposée.</p>";
  });

  /* ---------- Tle A sciences : zoom du microscope ---------- */
  VRT_A("tle-sc-microscopie", 1, "Change d'objectif : ×4, ×10, ×40", function (el) {
    el.innerHTML = "<div class='an-choix'><span>Objectif :</span><button type='button' data-z='4'>×4</button><button type='button' data-z='10' aria-pressed='true'>×10</button><button type='button' data-z='40'>×40</button><span style='margin-left:8px'>Oculaire ×10</span></div><div class='an-oculaire'><svg viewBox='0 0 300 300' data-sv><g data-champ style='transition:transform .5s;transform-origin:150px 150px'>" + (function () { var s = ""; for (var i = 0; i < 9; i++) for (var j = 0; j < 7; j++) { var x = i * 40 - 30 + (j % 2) * 20, y = j * 52 - 30; s += "<rect x='" + x + "' y='" + y + "' width='40' height='52' fill='#F4E6EE' stroke='#9C5B7C' stroke-width='1.5'/><ellipse cx='" + (x + 24) + "' cy='" + (y + 20) + "' rx='5' ry='4' fill='#9C5B7C' opacity='.8'/>"; } return s; })() + "</g></svg></div><div class='an-res'><span>Grossissement total : <b data-g>×100</b></span><span data-t></span></div>";
    function z(v) {
      el.querySelectorAll("[data-z]").forEach(function (b) { b.setAttribute("aria-pressed", +b.dataset.z === v); });
      q(el, "[data-champ]").style.transform = "scale(" + ({ 4: .45, 10: 1, 40: 3.2 }[v]) + ")";
      q(el, "[data-g]").textContent = "×" + v * 10;
      q(el, "[data-t]").textContent = { 4: "On repère la zone à observer.", 10: "On distingue les cellules et leurs parois.", 40: "On voit le noyau de chaque cellule." }[v];
    }
    el.querySelectorAll("[data-z]").forEach(function (b) { b.addEventListener("click", function () { z(+b.dataset.z); }); }); z(10);
  });

  /* ---------- Tle A sciences : organites cliquables ---------- */
  VRT_A("tle-sc-organites", 1, "Clique sur un organite", function (el) {
    var R = { noyau: ["Noyau", "Contient l'ADN et dirige la cellule ; enveloppe percée de pores."], mito: ["Mitochondrie", "Respiration cellulaire : produit l'énergie."], golgi: ["Appareil de Golgi", "Modifie, emballe et expédie les protéines."], ret: ["Réticulum endoplasmique", "Synthèse et transport des molécules ; porte des ribosomes."], lyso: ["Lysosome", "Digestion à l'intérieur de la cellule."], memb: ["Membrane plasmique", "Limite la cellule et contrôle les échanges."] };
    el.innerHTML = "<svg viewBox='0 0 460 260' class='an-svg an-pc'><g data-k='memb' tabindex='0' role='button' aria-label='Membrane'><ellipse cx='230' cy='130' rx='215' ry='118' fill='#FBEFF4' stroke='#B03A6E' stroke-width='4'/></g><g data-k='noyau' tabindex='0' role='button' aria-label='Noyau'><circle cx='220' cy='125' r='52' fill='#ECE8F8' stroke='#5B4FA8' stroke-width='3' stroke-dasharray='10 3'/><circle cx='230' cy='118' r='16' fill='#5B4FA8'/></g><g data-k='mito' tabindex='0' role='button' aria-label='Mitochondrie'><ellipse cx='95' cy='90' rx='38' ry='17' fill='#FDEBDD' stroke='#C24E00' stroke-width='2.5'/><path d='M66 90 q8 -12 14 0 t14 0 t14 0 t14 0' fill='none' stroke='#C24E00' stroke-width='2'/><ellipse cx='350' cy='190' rx='34' ry='15' fill='#FDEBDD' stroke='#C24E00' stroke-width='2.5'/></g><g data-k='golgi' tabindex='0' role='button' aria-label='Appareil de Golgi'><g fill='none' stroke='#0E7C86' stroke-width='5' stroke-linecap='round'><path d='M320 70 q30 12 60 0'/><path d='M318 84 q32 12 64 0'/><path d='M322 98 q28 12 56 0'/></g></g><g data-k='ret' tabindex='0' role='button' aria-label='Réticulum'><path d='M150 200 q20 -18 40 0 t40 0 t40 0' fill='none' stroke='#1E499B' stroke-width='5'/><g fill='#1E499B'><circle cx='160' cy='195' r='3'/><circle cx='200' cy='205' r='3'/><circle cx='240' cy='195' r='3'/></g></g><g data-k='lyso' tabindex='0' role='button' aria-label='Lysosome'><circle cx='110' cy='180' r='13' fill='#E0F5E5' stroke='#007E11' stroke-width='2.5'/><circle cx='380' cy='130' r='11' fill='#E0F5E5' stroke='#007E11' stroke-width='2.5'/></g></svg><div class='an-fiche' data-f><b>Clique sur un organite</b><span>Noyau, mitochondrie, appareil de Golgi, réticulum, lysosome, membrane.</span></div>";
    el.querySelectorAll("[data-k]").forEach(function (g) { function f(e) { if (e) e.stopPropagation(); el.querySelectorAll("[data-k]").forEach(function (x) { x.classList.toggle("an-sel", x === g); }); var r = R[g.dataset.k]; q(el, "[data-f]").innerHTML = "<b>" + r[0] + "</b><span>" + r[1] + "</span>"; } g.addEventListener("click", f); g.addEventListener("keydown", function (e) { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); f(e); } }); });
  });
})();
