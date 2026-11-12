/* VÉRITAS — Apprendre : socle commun (matières, rail, mémoire locale). Prototype 06/11/2026.
   La mémoire (leçons lues, quiz, série de jours) reste dans CE navigateur : confort de l'élève,
   rien n'est envoyé. Toute lecture/écriture est protégée (navigation privée, stockage bloqué). */
(function (W) {
  "use strict";
  var ICO = "../assets/veritas-matieres.svg?v=20261110g"; /* versionné : un ancien sprite en cache n'a pas les nouvelles icônes */

  // id, nom affiché, icône, teinte (m, pale, moyen, foncé), noms MINESEC, préfixes de scènes vivantes
  var MATIERES = [
    ["francais", "Français", "m-francais", ["#1E499B", "#DBE8FE", "#8FB0EE", "#142554"], ["Français"], []],
    ["anglais", "Anglais", "m-anglais", ["#B03A6E", "#FBE4EE", "#E79BBE", "#6E1F43"], ["Anglais"], ["anglais"]],
    ["maths", "Mathématiques", "m-maths", ["#0E7C86", "#DDF2F4", "#7CCCD3", "#0A4F55"], ["Mathématiques"], []],
    ["pct", "Physique-chimie-techno", "m-pct-violet", ["#5B4FA8", "#EAE7F7", "#ADA4DE", "#352C72"], ["PCT"], []],
    ["physique", "Physique", "m-pct-violet", ["#5B4FA8", "#EAE7F7", "#ADA4DE", "#352C72"], ["Physique"], []],
    ["chimie", "Chimie", "m-pct-orange", ["#C24E00", "#FDEBDD", "#F5B57A", "#6B2A00"], ["Chimie"], []],
    ["svt", "SVT", "m-svt", ["#007E11", "#E0F5E5", "#7FCB8C", "#00520B"], ["SVTEEHB", "SVT"], []],
    ["histoire", "Histoire", "m-histoire", ["#A84200", "#FFF3E4", "#F5B57A", "#6B2A00"], ["Histoire"], ["histoire"]],
    ["geo", "Géographie", "m-geo", ["#1E499B", "#DBE8FE", "#8FB0EE", "#142554"], ["Géographie"], ["geo"]],
    ["ecm", "ECM", "m-ecm", ["#9A6F00", "#FFF6DA", "#FFC93C", "#6B4E00"], ["ECM"], ["ecm"]],
    ["philo", "Philosophie", "m-philo", ["#5B4FA8", "#EAE7F7", "#ADA4DE", "#352C72"], ["Philosophie"], ["philo"]],
    ["info", "Informatique", "m-info", ["#0C2A6A", "#E4E9F2", "#8C9BC0", "#071A45"], ["Informatique", "Informatique TIC", "Informatique Fondamentale"], []],
    ["allemand", "Allemand", "m-langues-bleu", ["#1E499B", "#DBE8FE", "#8FB0EE", "#142554"], ["Allemand"], ["allemand"]],
    ["espagnol", "Espagnol", "m-langues-orange", ["#C24E00", "#FDEBDD", "#F5B57A", "#6B2A00"], ["Espagnol"], ["espagnol"]],
    ["italien", "Italien", "m-langues-vert", ["#007E11", "#E0F5E5", "#7FCB8C", "#00520B"], ["Italien"], ["italien"]],
    ["chinois", "Chinois", "m-langues", ["#B03A6E", "#FBE4EE", "#E79BBE", "#6E1F43"], ["Chinois"], ["chinois"]],
    ["arabe", "Arabe", "m-langues-teal", ["#0E7C86", "#DDF2F4", "#7CCCD3", "#0A4F55"], ["Arabe"], ["arabe"]],
    ["ln", "Langues nationales", "m-lcn", ["#A84200", "#FFF3E4", "#F5B57A", "#6B2A00"], ["Langues nationales"], ["langues-nationales"]],
    ["cultures", "Cultures nationales", "m-lcn-violet", ["#5B4FA8", "#EAE7F7", "#ADA4DE", "#352C72"], ["Cultures nationales"], ["cultures"]],
    ["latin", "Latin", "m-antique", ["#0C2A6A", "#E4E9F2", "#8C9BC0", "#071A45"], ["Latin"], []],
    ["grec", "Grec", "m-antique-teal", ["#0E7C86", "#DDF2F4", "#7CCCD3", "#0A4F55"], ["Grec"], []],
    ["sciences", "Sciences", "m-svt", ["#007E11", "#E0F5E5", "#7FCB8C", "#00520B"], ["Sciences"], []],
    ["eps", "EPS", "m-eps", ["#A84200", "#FFF3E4", "#F5B57A", "#6B2A00"], ["Education physique et Sportive"], []],
    ["arts", "Arts", "m-arts", ["#5B4FA8", "#EAE7F7", "#ADA4DE", "#352C72"], ["Arts"], []],
    ["tm", "Travail manuel", "m-tm", ["#007E11", "#E0F5E5", "#7FCB8C", "#00520B"], ["Travail manuel (Artisanat)", "Travail manuel (Production Vegetale)", "Travail manuel (Production Animale)", "Travail manuel"], []],
    ["esf", "Économie sociale et familiale", "m-esf", ["#B03A6E", "#FBE4EE", "#E79BBE", "#6E1F43"], ["Économie Sociale et Familiale"], []],
    ["orientation", "Orientation-conseil", "m-orient", ["#0E7C86", "#DDF2F4", "#7CCCD3", "#0A4F55"], ["Orientation Conseil"], ["orientation"]]
  ].map(function (a) { return { id: a[0], nom: a[1], ico: a[2], t: a[3], minesec: a[4], scenes: a[5] }; });
  var PAR_ID = {}; MATIERES.forEach(function (m) { PAR_ID[m.id] = m; });

  var CLASSES = ["6e", "5e", "4e", "3e", "2nde A", "2nde C", "1re A", "1re C", "1re D", "Tle A", "Tle C", "Tle D"];
  var CLASSE_SCENE = { "3e": "3e", "1re A": "1re", "1re C": "1re", "1re D": "1re", "Tle A": "tle", "Tle C": "tle", "Tle D": "tle" };

  /* ---------- mémoire locale ---------- */
  function lire(k, def) { try { var v = W.localStorage.getItem("vrt_app_" + k); return v ? JSON.parse(v) : def; } catch (e) { return def; } }
  function ecrire(k, v) { try { W.localStorage.setItem("vrt_app_" + k, JSON.stringify(v)); } catch (e) { } }
  function jour(d) { d = d || new Date(); return d.getFullYear() + "-" + ("0" + (d.getMonth() + 1)).slice(-2) + "-" + ("0" + d.getDate()).slice(-2); }
  function noterJour() {
    var j = lire("jours", []), a = jour();
    if (j.indexOf(a) < 0) { j.push(a); j = j.slice(-60); ecrire("jours", j); }
    return serie();
  }
  function serie() {
    var j = lire("jours", []), n = 0, d = new Date();
    if (j.indexOf(jour(d)) < 0) d.setDate(d.getDate() - 1);           // la série tient jusqu'à ce soir
    while (j.indexOf(jour(d)) >= 0) { n++; d.setDate(d.getDate() - 1); }
    return n;
  }
  function marquerLu(id) { var l = lire("lus", {}); l[id] = Date.now(); ecrire("lus", l); ecrire("derniere", id); }
  function noterQuiz(id, bons, total) { var q = lire("quiz", {}); var p = q[id]; if (!p || bons >= p[0]) q[id] = [bons, total]; ecrire("quiz", q); }

  /* ---------- habillage ---------- */
  /* L'interface garde le bleu et l'or VÉRITAS ; la teinte de la matière ne colore que son icône (--mt). */
  function teinter(m) {
    var r = document.documentElement.style;
    r.setProperty("--mt", m.t[0]); r.setProperty("--mt-pale", m.t[1]);
  }
  function ico(id, taille) { taille = taille || 26; return '<svg width="' + taille + '" height="' + taille + '" aria-hidden="true"><use href="' + ICO + '#' + id + '"/></svg>'; }
  /* Pictogrammes d'interface (pas d'émoji) : SVG au trait, couleur = currentColor. */
  var PIC = {
    fiole: '<path d="M9 3h6M10 3v6.2L4.8 18a2 2 0 0 0 1.7 3h11a2 2 0 0 0 1.7-3L14 9.2V3"/><path d="M7.5 15h9"/>',
    manette: '<rect x="3" y="7" width="18" height="11" rx="4"/><path d="M8 11v3M6.5 12.5h3M15.5 12h.01M18 14h.01"/>',
    epees: '<path d="M14.5 17.5 3 6V3h3l11.5 11.5M13 19l6-6M16 16l4 4M9.5 6.5 11 5l-1-2h-3M5 14l-2 2 1 1M8 17l-1 1 3 3 1-1"/>',
    chrono: '<circle cx="12" cy="14" r="7"/><path d="M12 10v4l2.5 2M9.5 3h5M12 3v4"/>',
    boussole: '<circle cx="12" cy="12" r="9"/><path d="m15.5 8.5-2 5-5 2 2-5z"/>',
    calcul: '<rect x="5" y="3" width="14" height="18" rx="2"/><path d="M8 7h8M8.5 12h.01M12 12h.01M15.5 12h.01M8.5 16h.01M12 16h.01M15.5 16h.01"/>',
    cible: '<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1"/>',
    doc: '<path d="M6 3h8l4 4v14H6zM14 3v4h4M9 12h6M9 16h6"/>',
    plume: '<path d="M20 4c-7 0-13 4-13 11v2l-3 3M7 17h4c5 0 9-5 9-13M10 13l5-5"/>',
    coche2: '<rect x="4" y="4" width="16" height="16" rx="3"/><path d="m8 12 3 3 5-6"/>',
    aide: '<circle cx="12" cy="12" r="9"/><path d="M9.5 9.5a2.5 2.5 0 1 1 3.5 2.3c-.7.3-1 .8-1 1.5v.4M12 17h.01"/>',
    fleche: '<path d="M4 12h15M13 6l6 6-6 6"/>',
    cadenas: '<rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/>',
    flamme: '<path d="M12 21c-3.9 0-6.5-2.6-6.5-6.2 0-3.6 2.7-5.6 3.9-9.3.2-.6.9-.7 1.3-.2C13.4 8.8 18.5 10.8 18.5 15c0 3.5-2.7 6-6.5 6z" fill="#FFC93C" stroke="#C24E00"/><path d="M12 21c-1.6 0-2.8-1.1-2.8-2.7 0-1.8 1.6-2.6 2.3-4.4 1.4 1.4 3.3 2.4 3.3 4.4 0 1.6-1.2 2.7-2.8 2.7z" fill="#C24E00" stroke="none"/>',
    horloge: '<circle cx="12" cy="12" r="8.5"/><path d="M12 7.5V12l3 2"/>',
    masques: '<path d="M3.5 5.5c3-1.4 6.2-1.4 9.2 0v5.2c0 3.2-2 5.6-4.6 5.6S3.5 13.9 3.5 10.7z" fill="#E4ECFA"/><path d="M6 9.4h1.2M9.4 9.4h1.2M6.2 12.6c1 .9 3.2.9 4.2 0"/><path d="M11.8 9.2c3-1.2 6-1 8.7.6v4.9c0 3.1-1.9 5.5-4.4 5.5-1.9 0-3.4-1.3-4.1-3.2" fill="#FFF3CC"/><path d="M14.3 13.1h1.1M17.5 13.6h1.1M14.6 17.2c.9-.8 2.9-.6 3.8.3"/>',
    coche: '<circle cx="12" cy="12" r="8.5"/><path d="m8.3 12.3 2.5 2.5 5-5.2"/>',
    croix: '<circle cx="12" cy="12" r="8.5"/><path d="m9 9 6 6M15 9l-6 6"/>',
    crayon: '<path d="M4 20h4L19 9a2.8 2.8 0 0 0-4-4L4 16z"/><path d="m13.5 6.5 4 4"/>',
    haut: '<path d="M12 19V5M6 11l6-6 6 6"/>', bas: '<path d="M12 5v14M6 13l6 6 6-6"/>',
    dupliquer: '<rect x="8" y="8" width="12" height="12" rx="2"/><path d="M4 16V6a2 2 0 0 1 2-2h10"/>',
    lien: '<path d="M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1"/>',
    corbeille: '<path d="M4 7h16M10 11v6M14 11v6M6 7l1 12.5A1.5 1.5 0 0 0 8.5 21h7a1.5 1.5 0 0 0 1.5-1.5L18 7M9 7V4.5A1.5 1.5 0 0 1 10.5 3h3A1.5 1.5 0 0 1 15 4.5V7"/>',
    importer: '<path d="M12 4v11M7 10l5 5 5-5M5 20h14"/>',
    lecture: '<circle cx="12" cy="12" r="9.5" fill="currentColor" stroke="none"/><path d="M10 8.2v7.6l6-3.8z" fill="#fff" stroke="none"/>',
    cadeau: '<rect x="3" y="8" width="18" height="4" rx="1"/><path d="M12 8v13M19 12v7a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-7M7.5 8a2.5 2.5 0 0 1 0-5C11 3 12 8 12 8s1-5 4.5-5a2.5 2.5 0 0 1 0 5"/>',
    etoile: '<path d="m12 3 2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1-4.4-4.3 6.1-.9z"/>',
    livre: '<path d="M3 5.5c2.7-.9 5.6-.6 8.2 1v13c-2.6-1.6-5.5-1.9-8.2-1zM21 5.5c-2.7-.9-5.6-.6-8.2 1v13c2.6-1.6 5.5-1.9 8.2-1z"/>'
  };
  function pic(nom, taille, extra) { return '<svg class="pic" width="' + (taille || 16) + '" height="' + (taille || 16) + '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"' + (extra || "") + '>' + (PIC[nom] || "") + '</svg>'; }
  function etoiles(n) { var s = ""; for (var i = 0; i < 3; i++) s += pic("etoile", 30, ' style="color:' + (i < n ? "#D9A21B" : "#DCE1EA") + ';fill:' + (i < n ? "#FFC93C" : "#EEF1F6") + '"'); return '<span class="etoiles" role="img" aria-label="' + n + ' étoile' + (n > 1 ? "s" : "") + ' sur 3">' + s + '</span>'; }

  /* Les langues partagent une icône : une étiquette les distingue (DE, ES, IT, 中, ع, LN, CU). */
  var ETIQ = { latin: "LA", grec: "GR", sciences: "SC", allemand: "DE", espagnol: "ES", italien: "IT", chinois: "中", arabe: "ع", ln: "LN", cultures: "CU" };
  function icoM(m, taille) { return ico(m.ico, taille) + (ETIQ[m.id] ? '<span class="etiq" aria-hidden="true">' + ETIQ[m.id] + '</span>' : ''); }
  function esc(s) { return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; }); }
  function slug(s) { return String(s).normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, ""); }

  /* rail : matières présentes dans la progression de la classe */
  function rail(el, classe, courante) {
    var prog = (W.VRT_PROG || {})[classe] || {};
    var dispo = MATIERES.filter(function (m) { return m.minesec.some(function (n) { return prog[n]; }) || (W.VRT_LECONS && Object.keys(W.VRT_LECONS).some(function (k) { var L = W.VRT_LECONS[k]; return L.m === m.id && L.c === classe; })); });
    el.innerHTML = '<a class="niv" href="index.html?c=' + encodeURIComponent(classe) + '" title="Changer de classe">' + esc(classe).replace(" ", "<br>") + '</a>' +
      dispo.map(function (m) {
        return '<a class="rm" style="--c:' + m.t[0] + ';--cp:' + m.t[1] + '" href="matiere.html?c=' + encodeURIComponent(classe) + '&m=' + m.id + '" title="' + esc(m.nom) + '"' + (m.id === courante ? ' aria-current="page"' : '') + '>' + icoM(m, 28) + '<span class="vsr">' + esc(m.nom) + '</span></a>';
      }).join("");
  }
  function chiffreSerie(el) { var n = serie(); if (!el) return; el.hidden = n < 1; el.innerHTML = pic("flamme", 18) + n + ' jour' + (n > 1 ? 's' : '') + '<span class="vsr"> de suite</span>'; el.title = n + " jour" + (n > 1 ? "s" : "") + " d'apprentissage de suite"; }

  /* scènes vivantes liées : explicites, sinon par classe + matière */
  function scenesPour(L) {
    if (L.scenes && L.scenes.length) return L.scenes;
    var m = PAR_ID[L.m], pre = CLASSE_SCENE[L.c];
    if (!m || !pre || !W.VRT_SCENES) return [];
    return W.VRT_SCENES.filter(function (s) { return m.scenes.some(function (p) { return s.indexOf(pre + "-" + p + "-") === 0; }); }).slice(0, 2);
  }

  /* Rattache chaque leçon rédigée à sa place dans la progression : L.cle = début du titre officiel.
     n = rang dans la progression de la matière (1, 2, 3…), chap = intitulé du chapitre. */
  (function rattacher() {
    var LE = W.VRT_LECONS || {}, PR = W.VRT_PROG || {};
    function norm(s) { return String(s).normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase().replace(/[’']/g, "'").replace(/\s+/g, " ").trim(); }
    Object.keys(LE).forEach(function (k) {
      var L = LE[k], m = PAR_ID[L.m]; L.id = k; if (!m || !(L.cle || L.rang)) return;
      var p = PR[L.c] || {};
      m.minesec.forEach(function (s) {
        (p[s] || []).forEach(function (ch) {
          ch[1].forEach(function (l) {
            if (!L.chap && (L.rang ? l[0] === L.rang : norm(l[1]).indexOf(norm(L.cle)) >= 0)) { L.n = l[0]; L.chap = ch[0]; L.officiel = l[1]; }
          });
        });
      });
      if (!L.n) L.n = 900 + (L.ordre || 0);   // non trouvée : placée en fin, signalée par le banc
    });
  })();

  /* ════════ FILIGRANE VÉRITAS sur tout export (07/11/2026) ════════
     Même langage que app.js (applyWatermark) : « VÉRITAS » en diagonale très léger +
     bandeau bas bleu nuit « © VÉRITAS · veritas-school.com » et la date d'export.
     1) Impression / PDF : calque fixe (répété sur chaque page imprimée), invisible à l'écran.
     2) Images : le schéma est rendu dans un canvas, filigrané, puis enregistré en PNG. */
  var SITE = "veritas-school.com";
  function dateExport() { var d = new Date(); return d.toLocaleDateString("fr-FR") + " à " + d.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" }); }

  function filigraneImpression() {
    if (document.getElementById("vrtFiligrane")) return;
    var f = document.createElement("div"); f.id = "vrtFiligrane"; f.className = "vrt-filigrane"; f.setAttribute("aria-hidden", "true");
    f.innerHTML = '<svg width="100%" height="100%"><defs><pattern id="vrtFil" width="300" height="190" patternUnits="userSpaceOnUse" patternTransform="rotate(-28)">' +
      '<text x="10" y="70" font-family="Poppins,Arial,sans-serif" font-size="30" font-weight="600" fill="#1E499B" fill-opacity=".07">VÉRITAS</text>' +
      '<text x="160" y="160" font-family="Poppins,Arial,sans-serif" font-size="13" fill="#1E499B" fill-opacity=".07">' + SITE + '</text></pattern></defs>' +
      '<rect width="100%" height="100%" fill="url(#vrtFil)"/></svg>';
    var p = document.createElement("div"); p.id = "vrtPiedImpr"; p.className = "vrt-pied-impr"; p.setAttribute("aria-hidden", "true");
    document.body.appendChild(f); document.body.appendChild(p);
    function maj() { p.innerHTML = "<b>© VÉRITAS</b> · " + SITE + " · " + esc(document.title.split(" | ")[0]) + " · imprimé le " + dateExport() + " · reproduction interdite"; }
    maj(); W.addEventListener("beforeprint", maj);
  }

  function filigraneCanvas(ctx, Wd, H) {
    ctx.save(); ctx.globalAlpha = .06; ctx.fillStyle = "#1E499B"; ctx.font = "600 30px Poppins,Arial,sans-serif";
    ctx.translate(Wd / 2, H / 2); ctx.rotate(-Math.PI / 7);
    for (var y = -H * 1.3; y < H * 1.3; y += 150) for (var x = -Wd * 1.3; x < Wd * 1.3; x += 280) ctx.fillText("VÉRITAS", x + ((y / 150) % 2 ? 140 : 0), y);
    ctx.restore();
    var bH = 46; ctx.save(); ctx.fillStyle = "#0C2A6A"; ctx.fillRect(0, H - bH, Wd, bH);
    ctx.fillStyle = "#FFC93C"; ctx.font = "600 17px Poppins,Arial,sans-serif"; ctx.textBaseline = "middle"; ctx.textAlign = "left"; ctx.fillText("© VÉRITAS · " + SITE, 20, H - bH / 2);
    ctx.fillStyle = "rgba(255,255,255,.8)"; ctx.font = "14px Poppins,Arial,sans-serif"; ctx.textAlign = "right"; ctx.fillText("Exporté le " + dateExport(), Wd - 20, H - bH / 2);
    ctx.restore();
  }

  /* Enregistre un schéma SVG en PNG filigrané (2× pour la netteté). */
  function exporterImage(svg, titre) {
    var r = svg.getBoundingClientRect(), vb = svg.viewBox && svg.viewBox.baseVal, w0 = vb && vb.width ? vb.width : r.width, h0 = vb && vb.height ? vb.height : r.height;
    var k = Math.max(2, 900 / w0), Wd = Math.round(w0 * k), Hs = Math.round(h0 * k), haut = 70, bas = 46, marge = 30, H = Hs + haut + bas + marge;
    var clone = svg.cloneNode(true); clone.setAttribute("xmlns", "http://www.w3.org/2000/svg"); clone.setAttribute("width", Wd); clone.setAttribute("height", Hs);
    clone.querySelectorAll("text").forEach(function (t) { if (!t.getAttribute("font-family")) t.setAttribute("font-family", "Poppins,Arial,sans-serif"); });
    var url = "data:image/svg+xml;charset=utf-8," + encodeURIComponent(new XMLSerializer().serializeToString(clone));
    var img = new Image();
    img.onload = function () {
      var c = document.createElement("canvas"); c.width = Wd; c.height = H; var ctx = c.getContext("2d");
      ctx.fillStyle = "#fff"; ctx.fillRect(0, 0, Wd, H);
      ctx.fillStyle = "#001136"; ctx.font = "600 24px Poppins,Arial,sans-serif"; ctx.textBaseline = "middle";
      var t = String(titre || "Schéma VÉRITAS").trim(), max = Wd - 48;   /* titre trop long : points de suspension à la largeur */
      if (ctx.measureText(t).width > max) { while (t.length > 4 && ctx.measureText(t + "…").width > max) t = t.slice(0, -1); t = t.replace(/[\s,;:]+$/, "") + "…"; }
      ctx.fillText(t, 24, haut / 2 + 4);
      ctx.fillStyle = "#FFC93C"; ctx.fillRect(24, haut - 10, 60, 4);
      ctx.drawImage(img, 0, haut, Wd, Hs);
      filigraneCanvas(ctx, Wd, H);
      c.toBlob(function (b) { if (!b) return; var a = document.createElement("a"); a.href = URL.createObjectURL(b); a.download = "veritas-" + (slug(titre) || "schema").slice(0, 50) + ".png"; document.body.appendChild(a); a.click(); setTimeout(function () { URL.revokeObjectURL(a.href); a.remove(); }, 1500); }, "image/png");
    };
    img.onerror = function () { if (W.VRT.jeu) W.VRT.jeu.toast("<b>Image indisponible</b><span>Ce schéma ne peut pas être exporté.</span>"); };
    img.src = url;
  }
  /* Ajoute « Enregistrer l'image » sous chaque illustration et chaque schéma animé d'un conteneur. */
  function boutonsImage(racine) {
    (racine || document).querySelectorAll("figure.illus, .anim").forEach(function (f) {
      if (f.querySelector(".btn-img")) return;
      var svg = f.querySelector("svg:not(.pic)"); if (!svg) return;
      var cap = f.querySelector("figcaption"), titre = (cap && cap.textContent) || (f.querySelector(".anim-t") || {}).textContent || document.title.split(" | ")[0];
      var b = document.createElement("button"); b.type = "button"; b.className = "btn-img"; b.innerHTML = pic("importer", 12) + "Image";
      b.title = "Enregistrer l'image (PNG avec filigrane VÉRITAS)"; b.setAttribute("aria-label", "Enregistrer l'image");
      b.addEventListener("click", function () { var s = f.querySelector("svg:not(.pic)"); if (s) exporterImage(s, titre); });
      (f.classList.contains("anim") ? f.querySelector(".anim-c") || f : f).appendChild(b);
    });
  }
  if (typeof document !== "undefined") {   /* hors navigateur (bancs Node) : pas de filigrane à poser */
    if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", filigraneImpression); else filigraneImpression();
  }

  /* ── Offres (08/11/2026) : Apprendre ne menait à AUCUN abonnement ni cahier. Les libellés
     reprennent ceux de l'écran « Abonnements » de la vitrine (/#tarifs) : ne rien y promettre
     qu'il ne promet pas. Prix des cahiers : ceux des pages livrets/. ── */
  function examen(c) { return /^(3e|1re|Tle)/.test(c || ""); }
  function cahierPour(c, m) {
    c = c || ""; var col = { "6e": "6e", "5e": "5e", "4e": "4e", "3e": "3e" }[c];
    if (m === "francais") {
      if (col) return { h: "/livrets/" + col + ".html", t: "Mon cahier de français " + c, d: "Le cahier interactif de l'année, leçon par leçon : 1 500 F l'année." };
      var st = /C|D/.test(c.split(" ")[1] || "");
      var niv = /^2nde/.test(c) ? "2nde" : /^1re/.test(c) ? "1ere" : /^Tle/.test(c) ? "tle" : "";
      if (niv) return { h: "/livrets/" + (st ? "est-" : "") + niv + ".html", t: "Mon cahier de français " + c, d: "Le cahier interactif de l'année, leçon par leçon : 1 500 F l'année." };
    }
    if (m === "philo") {
      if (/^Tle/.test(c)) return { h: "/livrets/cahier-philo-tle.html", t: "Mon livret de philosophie, Terminale", d: "Cours, textes et sujets de dissertation de l'année : 1 500 F l'année." };
      if (/^1re/.test(c)) return { h: "/livrets/cahier-philo-1ere.html", t: "Mon livret de philosophie, Première", d: "Cours, textes et sujets de l'année : 1 500 F l'année." };
    }
    return null;
  }
  var PICTO_LIVRE = '<svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M2 4h7a3 3 0 0 1 3 3v13a2 2 0 0 0-2-2H2zM22 4h-7a3 3 0 0 0-3 3v13a2 2 0 0 1 2-2h8z"/></svg>';
  var PICTO_CLE = '<svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 2l3 6.5 7 .8-5.2 4.7 1.5 6.9L12 17.4 5.7 20.9l1.5-6.9L2 9.3l7-.8z"/></svg>';
  /* Tarifs publiés par api/public_data.php (ceux que le serveur exigera au paiement). */
  var TARIFS = null;
  function fmtF(n) { return String(Math.round(n)).replace(/\B(?=(\d{3})+(?!\d))/g, " "); }
  function prixConnu(id, repli) { var p = TARIFS && TARIFS[id]; return p ? fmtF(p) : repli; }
  function poserTarifs() {
    if (!TARIFS) return;
    [].forEach.call(document.querySelectorAll("[data-vrt-prix]"), function (el) { var p = TARIFS[el.getAttribute("data-vrt-prix")]; if (p) el.textContent = fmtF(p); });
  }
  try {
    fetch("/api/public_data.php", { credentials: "omit" }).then(function (r) { return r.json(); }).then(function (j) {
      var pl = (j && j.elearning_plans) || [], t = {};   // même source que la vitrine (assets/vitrine.js, poserFormules)
      pl.forEach(function (p) { if (p && p.id && +p.prix > 0 && p.actif !== false) t[p.id] = +p.prix; });
      if (Object.keys(t).length) { TARIFS = t; poserTarifs(); }
    }).catch(function () {});
  } catch (e) { }
  function lienOffre(h, t, d, picto, cl) {
    return '<a class="offre-l' + (cl ? " " + cl : "") + '" href="' + h + '">' + picto + '<span><b>' + esc(t) + '</b><small>' + esc(d) + '</small></span><span class="chev" aria-hidden="true">›</span></a>';
  }
  /* ctx : "lecon" (fin du cours), "quiz" (sous le bilan), "matiere", "accueil" */
  function offre(c, m, ctx) {
    var cah = cahierPour(c, m), ex = examen(c);
    var abo = ex
      ? lienOffre("/#tarifs", "Formule Pro : l'année d'examen", "§PRO§ F par mois : tous les cours de la classe, épreuves et annales corrigées, labos virtuels, bulletins blancs, 30 questions par jour au tuteur.", PICTO_CLE, "or")
      : lienOffre("/#tarifs", "Formule Starter : dès §STARTER§ F par mois", "Tous les cours de la classe, les œuvres au programme, épreuves et annales corrigées, 5 questions par jour au tuteur.", PICTO_CLE, "or");
    /* 11/11/2026 : prix écrits en dur (1 000 F, 2 000 F) quand le catalogue dit
       1 200 F et 2 400 F. Ils suivent désormais le tarif publié par le serveur —
       celui que l'octroi exige — et retombent sur le catalogue sinon. */
    abo = abo.replace("§STARTER§", '<span data-vrt-prix="abo_starter_m">' + prixConnu("abo_starter_m", "1 200") + '</span>')
             .replace("§PRO§", '<span data-vrt-prix="abo_pro_m">' + prixConnu("abo_pro_m", "1 200") + '</span>');
    var titre = { lecon: "Pour aller plus loin", quiz: "Continue sur ta lancée", matiere: "En attendant les prochaines leçons", accueil: "Aller plus loin avec VÉRITAS" }[ctx] || "Pour aller plus loin";
    return '<aside class="offre offre-' + ctx + '" aria-label="' + titre + '"><p class="offre-t">' + titre + '</p>' +
      (cah ? lienOffre(cah.h, cah.t, cah.d, PICTO_LIVRE) : "") + abo +
      '<p class="offre-n">Payée d\'un coup, l\'année revient à dix mois : deux mois offerts.</p></aside>';
  }
  /* Les bonnes réponses étaient rangées en 1ʳᵉ ou 2ᵉ position (3ᵉ : 5 fois sur 177) :
     on mélange l'ordre à l'affichage, l'indice de la bonne réponse suit. */
  function melanger(q) {
    var ordre = q.r.map(function (_, k) { return k; });
    for (var i = ordre.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)), t = ordre[i]; ordre[i] = ordre[j]; ordre[j] = t; }
    return { r: ordre.map(function (k) { return q.r[k]; }), b: ordre.indexOf(q.b) };
  }

  /* ---------- ressources du site reliées à la progression (ressources.js) ---------- */
  var GROUPES = [["suivi", "Où j'en suis", "i-gauge", "Notes, coefficients, orientation"], ["apprendre", "Comprendre et apprendre", "i-book-open", "Cours, œuvres, méthodes, corrigés"],
                 ["entrainer", "M'entraîner", "i-target", "Labos, épreuves, compositions, jeux"], ["aide", "Besoin d'aide", "i-message", "Questions, repères, calendrier"]];
  var FAMILLES = [
    ["notes", "Notes et coefficients", "i-calculator", "Savoir où tu en es et ce qui compte vraiment.", "suivi"],
    ["orientation", "Orientation", "i-compass", "Choisir sa série, sa filière, son école.", "suivi"],
    ["cours", "Cours rédigés", "i-book-open", "Les leçons complètes déjà disponibles pour ta classe.", "apprendre"],
    ["methode", "Méthodes et examens", "i-feather", "Les méthodes attendues le jour de l'épreuve.", "apprendre"],
    ["oeuvre", "Œuvres au programme", "i-book", "Analyse, résumé, carte mentale et QCM.", "apprendre"],
    ["scene", "Scènes vivantes", "i-play", "Une situation courte où tu choisis la bonne réponse.", "apprendre"],
    ["cahier", "Mon cahier", "i-notebook", "Le cahier interactif de l'année.", "apprendre"],
    ["corrige", "Corrigés du cahier", "i-clipboard-check", "Séquence par séquence, exercice par exercice.", "apprendre"],
    ["fichier", "Documents du catalogue", "i-file-text", "Les documents déposés par le centre pour ta classe.", "apprendre"],
    ["labo", "Laboratoires", "i-flask", "Manipuler, observer, conclure : l'expérience reliée à ta leçon.", "entrainer"],
    ["direct", "Compositions en direct", "i-clock", "Chronométrées, corrigées dès la remise.", "entrainer"],
    ["epreuve", "Épreuves et annales", "i-pen", "T'entraîner sur des sujets complets.", "entrainer"],
    ["jeu", "Jeux", "i-gamepad", "Réviser en jouant, sur les notions de ta classe.", "entrainer"],
    ["defis", "Battles et défis", "i-award", "Se mesurer aux élèves de son cycle, travailler à plusieurs.", "entrainer"],
    ["aide", "Aide et repères", "i-message", "Pour poser une question ou situer ce que tu apprends.", "aide"]
  ];
  var TONS = [["#1E499B", "#EDF2FB"], ["#0E7C86", "#E9F5F6"], ["#5B4FA8", "#F0EDF9"], ["#B03A6E", "#FBEFF4"], ["#007E11", "#EAF6EC"], ["#C24E00", "#FDF1E8"]];
  function ton(i) { var t = TONS[i % TONS.length]; return "--k:" + t[0] + ";--kp:" + t[1]; }
  /* Les titres saisis dans l'administration peuvent contenir des émojis : jamais affichés ici. */
  var RE_EMO = /[\u{1F000}-\u{1FAFF}\u{2190}-\u{21FF}\u{2300}-\u{23FF}\u{2460}-\u{24FF}\u{25A0}-\u{27BF}\u{2900}-\u{297F}\u{2B00}-\u{2BFF}\u{3030}\u{303D}\u{FE0F}\u{20E3}\u{200D}]/gu;
  function net(s) { return String(s == null ? "" : s).replace(RE_EMO, "").replace(/\s{2,}/g, " ").trim(); }
  var LIB_F = {}; FAMILLES.forEach(function (f, i) { f[5] = ton(i); LIB_F[f[0]] = f; });
  function RES() { return W.VRT_RES || { items: {}, lec: {}, mat: {}, cl: {} }; }
  function resLecon(c, m, n) { return RES().lec[c + "|" + m + "|" + n] || []; }
  function resDeMatiere(c, m) {
    var R0 = RES(), o = (R0.mat[c + "|" + m] || []).slice(), p = c + "|" + m + "|";
    Object.keys(R0.lec).forEach(function (k) { if (k.indexOf(p) === 0) R0.lec[k].forEach(function (i) { if (o.indexOf(i) < 0) o.push(i); }); });
    return o;
  }
  function resClasse(c) {
    var R0 = RES(), o = (R0.cl[c] || []).slice(), p = c + "|";
    Object.keys(R0.mat).concat(Object.keys(R0.lec)).forEach(function (k) { if (k.indexOf(p) === 0) (R0.mat[k] || R0.lec[k]).forEach(function (i) { if (o.indexOf(i) < 0) o.push(i); }); });
    return o;
  }
  function leconsDeRes(id) {
    var R0 = RES(), o = [];
    Object.keys(R0.lec).forEach(function (k) {
      if (R0.lec[k].indexOf(id) < 0) return;
      var p = k.split("|"), c = p[0], m = p[1], n = +p[2], t = "";
      (PAR_ID[m] ? PAR_ID[m].minesec : []).forEach(function (s) { (((W.VRT_PROG || {})[c] || {})[s] || []).forEach(function (ch) { ch[1].forEach(function (l) { if (l[0] === n) t = l[1]; }); }); });
      o.push({ c: c, m: m, n: n, t: t });
    });
    return o;
  }
  /* Fiches du catalogue : seul le serveur sait si un document existe. Lecture à chaque visite ;
     si le serveur ne répond pas, la section n'apparaît pas. */
  var CL_CAT = { "6ème": ["6e"], "5ème": ["5e"], "4ème": ["4e"], "3ème": ["3e"], "2nde": ["2nde A", "2nde C"], "1ère": ["1re A", "1re C", "1re D"], "1ère A": ["1re A"], "1ère C": ["1re C"], "1ère D": ["1re D"], "Terminale": ["Tle A", "Tle C", "Tle D"], "Tle A": ["Tle A"], "Tle C": ["Tle C"], "Tle D": ["Tle D"] };
  var MAT_CAT = { "Mathématiques": ["maths"], "Français": ["francais"], "Littérature": ["francais"], "Anglais": ["anglais"], "SVT": ["svt"], "Physique-Chimie": ["pct", "physique", "chimie"], "Histoire-Géo": ["histoire", "geo"], "Histoire-Géographie": ["histoire", "geo"], "Philosophie": ["philo"], "Informatique": ["info"] };
  function chargerCatalogue(fin) {
    if (!W.fetch) return;
    W.fetch("/api/public_data.php", { credentials: "same-origin" }).then(function (r) { return r.ok ? r.json() : null; }).then(function (j) {
      var R0 = RES(), n = 0; ((j && j.elearning_contenus) || []).forEach(function (x) {
        if (x.dispo !== true || x.externalUrl || x.resPedago) return;   /* déjà proposée dans Épreuves ou Cours */
        var id = "cat_" + x.id, cs = CL_CAT[x.classe] || [], ms = MAT_CAT[x.matiere] || [];
        if (!cs.length || !ms.length) return;
        R0.items[id] = { t: "fichier", ti: net(x.titre), d: net(x.apercu || x.desc || ""), u: "/app.html#fiche?id=" + encodeURIComponent(x.id), ab: x.gratuit ? 0 : 1 };
        cs.forEach(function (c) { ms.forEach(function (m) { var k = c + "|" + m; if (leconsExiste(c, m)) { (R0.mat[k] = R0.mat[k] || []); if (R0.mat[k].indexOf(id) < 0) R0.mat[k].push(id); n++; } }); });
      });
      if (n && fin) fin();
    }).catch(function () { });
  }
  function leconsExiste(c, m) { var p = (W.VRT_PROG || {})[c] || {}; return PAR_ID[m] && PAR_ID[m].minesec.some(function (s) { return p[s]; }); }
  /* icônes du site : même sprite et même trait que la vitrine et les pages publiques */
  function si(nom, taille) { taille = taille || 20; return '<svg class="si" width="' + taille + '" height="' + taille + '" aria-hidden="true" focusable="false"><use href="/assets/veritas-icons.svg#' + nom + '"/></svg>'; }
  /* « -Mouvement… - Mouvement… », « n Langue… », « 39 : Langue… », « 0rthographe », « Titres des leçons » :
     scories de la fiche source. Les rangs ne changent pas ; une ligne d'en-tête renvoie "" et n'est pas affichée. */
  function titreL(t) {
    t = String(t || "").replace(/\s+/g, " ").replace(/\s+([,.;:!?])\s*$/, "").replace(/\s+,/g, ",").trim();
    if (/^(titres? des le[çc]ons|chapitres?)$/i.test(t) || !/[A-Za-zÀ-ÿ]{3}/.test(t)) return "";
    /* « LA VIE QUOTIDIENNE : produire… » : intitulé de module en capitales, ramené en minuscules */
    t = t.replace(/^([A-ZÉÈÀÂÊÎÔÛÇ’' -]{10,})(\s*:)/, function (_, a, b) { return a.charAt(0) + a.slice(1).toLowerCase() + b; });
    t = t.replace(/^0(?=[a-zé])/i, "O").replace(/^n\s+(?=[A-ZÉ])/, "").replace(/^\d+\s*:\s*(?=[A-ZÉ])/, "");
    if (/^-\s*\S/.test(t)) t = t.replace(/^-\s*/, "").replace(/\s+-\s*(?=[A-ZÉÈÀ])/g, " · ");
    return t.charAt(0).toUpperCase() + t.slice(1);
  }
  /* 11/11/2026 : le gratuit se voit (pastille verte), le payant garde son cadenas. */
  function marque(it) { return it.ab ? '<span class="res-tag ab">' + si("i-lock", 12) + 'Abonnement</span>' : it.compte ? '<span class="res-tag gr">Gratuit · avec un compte</span>' : '<span class="res-tag gr">Gratuit</span>'; }
  /* Le gratuit d'abord : l'élève goûte, l'envie vient, l'abonnement suit. Ordre stable sinon. */
  function gratuitDabord(ids) { var R0 = RES(); return ids.map(function (id, k) { return [id, k]; }).sort(function (a, b) { var x = (R0.items[a[0]] || {}).ab ? 1 : 0, y = (R0.items[b[0]] || {}).ab ? 1 : 0; return x - y || a[1] - b[1]; }).map(function (a) { return a[0]; }); }
  /* Une ressource gratuite par famille, dans l'ordre où elle donne envie. */
  var ORDRE_GOUT = ["corrige", "oeuvre", "methode", "direct", "jeu", "labo", "epreuve", "scene", "defis", "cours", "orientation", "notes"];
  function selectionGratuite(ids, n) {
    var R0 = RES(), vu = {}, o = [];
    ORDRE_GOUT.forEach(function (f) { if (o.length >= n) return; var id = ids.find(function (i) { var it = R0.items[i]; return it && !it.ab && it.t === f && !vu[i]; }); if (id) { vu[id] = 1; o.push(id); } });
    return o;
  }
  function carteRes(id) {
    var it = RES().items[id]; if (!it) return "";
    var f = LIB_F[it.t] || LIB_F.aide;
    return '<a class="res-c" href="' + esc(it.u) + '" style="' + f[5] + '"><span class="res-p">' + si(f[2], 22) + '</span><span class="res-x"><strong>' + esc(net(it.ti)) + '</strong>' + (it.d ? '<small>' + esc(net(it.d)) + '</small>' : '') + marque(it) + '</span></a>';
  }
  function pastilles(ids) {
    return ids.length ? '<div class="res-pa">' + ids.map(function (id) {
      var it = RES().items[id]; if (!it) return ""; var f = LIB_F[it.t] || LIB_F.aide;
      return '<a href="' + esc(it.u) + '" title="' + esc(net(it.ti)) + '" style="' + f[5] + '">' + si(f[2], 14) + '<span>' + esc(COURT[it.t] || f[1]) + '</span>' + (it.ab ? si("i-lock", 11) : '') + '</a>';
    }).join("") + '</div>' : "";
  }
  var COURT = { labo: "Labo", jeu: "Jeu", cours: "Cours", methode: "Méthode", oeuvre: "Œuvre", epreuve: "Épreuve", direct: "En direct" };

  W.VRT = W.VRT || {};
  W.VRT.app = { titreL: titreL, si: si, net: net, ton: ton, GROUPES: GROUPES, chargerCatalogue: chargerCatalogue, FAMILLES: FAMILLES, resLecon: resLecon, resDeMatiere: resDeMatiere, resClasse: resClasse, gratuitDabord: gratuitDabord, selectionGratuite: selectionGratuite, leconsDeRes: leconsDeRes, carteRes: carteRes, pastilles: pastilles, MATIERES: MATIERES, PAR_ID: PAR_ID, CLASSES: CLASSES, lire: lire, ecrire: ecrire, noterJour: noterJour, serie: serie,
    marquerLu: marquerLu, noterQuiz: noterQuiz, teinter: teinter, ico: ico, icoM: icoM, pic: pic, etoiles: etoiles, esc: esc, slug: slug, rail: rail, chiffreSerie: chiffreSerie, scenesPour: scenesPour, jour: jour,
    exporterImage: exporterImage, offre: offre, cahierPour: cahierPour, melanger: melanger, boutonsImage: boutonsImage, filigraneCanvas: filigraneCanvas };
})(window);
