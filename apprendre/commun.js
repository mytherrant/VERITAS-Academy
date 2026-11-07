/* VÉRITAS — Apprendre : socle commun (matières, rail, mémoire locale). Prototype 06/11/2026.
   La mémoire (leçons lues, quiz, série de jours) reste dans CE navigateur : confort de l'élève,
   rien n'est envoyé. Toute lecture/écriture est protégée (navigation privée, stockage bloqué). */
(function (W) {
  "use strict";
  var ICO = "../assets/veritas-matieres.svg?v=20261107i"; /* versionné : un ancien sprite en cache n'a pas les nouvelles icônes */

  // id, nom affiché, icône, teinte (m, pale, moyen, foncé), noms MINESEC, préfixes de scènes vivantes
  var MATIERES = [
    ["francais", "Français", "m-francais", ["#1E499B", "#DBE8FE", "#8FB0EE", "#142554"], ["Français"], []],
    ["anglais", "Anglais", "m-anglais", ["#B03A6E", "#FBE4EE", "#E79BBE", "#6E1F43"], ["Anglais"], ["anglais"]],
    ["maths", "Mathématiques", "m-maths", ["#0E7C86", "#DDF2F4", "#7CCCD3", "#0A4F55"], ["Mathématiques"], []],
    ["pct", "Physique-chimie-techno", "m-pct", ["#007E11", "#E0F5E5", "#7FCB8C", "#00520B"], ["PCT"], []],
    ["svt", "SVT", "m-svt", ["#007E11", "#E0F5E5", "#7FCB8C", "#00520B"], ["SVTEEHB", "SVT"], []],
    ["histoire", "Histoire", "m-histoire", ["#A84200", "#FFF3E4", "#F5B57A", "#6B2A00"], ["Histoire"], ["histoire"]],
    ["geo", "Géographie", "m-geo", ["#1E499B", "#DBE8FE", "#8FB0EE", "#142554"], ["Géographie"], ["geo"]],
    ["ecm", "ECM", "m-ecm", ["#9A6F00", "#FFF6DA", "#FFC93C", "#6B4E00"], ["ECM"], ["ecm"]],
    ["philo", "Philosophie", "m-philo", ["#5B4FA8", "#EAE7F7", "#ADA4DE", "#352C72"], ["Philosophie"], ["philo"]],
    ["info", "Informatique", "m-info", ["#0C2A6A", "#E4E9F2", "#8C9BC0", "#071A45"], ["Informatique", "Informatique TIC"], []],
    ["allemand", "Allemand", "m-langues", ["#B03A6E", "#FBE4EE", "#E79BBE", "#6E1F43"], ["Allemand"], ["allemand"]],
    ["espagnol", "Espagnol", "m-langues", ["#B03A6E", "#FBE4EE", "#E79BBE", "#6E1F43"], ["Espagnol"], ["espagnol"]],
    ["italien", "Italien", "m-langues", ["#B03A6E", "#FBE4EE", "#E79BBE", "#6E1F43"], ["Italien"], ["italien"]],
    ["chinois", "Chinois", "m-langues", ["#B03A6E", "#FBE4EE", "#E79BBE", "#6E1F43"], ["Chinois"], ["chinois"]],
    ["arabe", "Arabe", "m-langues", ["#B03A6E", "#FBE4EE", "#E79BBE", "#6E1F43"], ["Arabe"], ["arabe"]],
    ["ln", "Langues nationales", "m-lcn", ["#A84200", "#FFF3E4", "#F5B57A", "#6B2A00"], ["Langues nationales"], ["langues-nationales"]],
    ["cultures", "Cultures nationales", "m-lcn", ["#A84200", "#FFF3E4", "#F5B57A", "#6B2A00"], ["Cultures nationales"], ["cultures"]],
    ["latin", "Latin", "m-antique", ["#0C2A6A", "#E4E9F2", "#8C9BC0", "#071A45"], ["Latin"], []],
    ["grec", "Grec", "m-antique", ["#0C2A6A", "#E4E9F2", "#8C9BC0", "#071A45"], ["Grec"], []],
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
      var L = LE[k], m = PAR_ID[L.m]; L.id = k; if (!m || !L.cle) return;
      var p = PR[L.c] || {};
      m.minesec.forEach(function (s) {
        (p[s] || []).forEach(function (ch) {
          ch[1].forEach(function (l) {
            if (!L.chap && norm(l[1]).indexOf(norm(L.cle)) >= 0) { L.n = l[0]; L.chap = ch[0]; L.officiel = l[1]; }
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
      var b = document.createElement("button"); b.type = "button"; b.className = "btn-img"; b.innerHTML = pic("importer", 15) + " Enregistrer l'image";
      b.title = "Image PNG avec filigrane VÉRITAS";
      b.addEventListener("click", function () { var s = f.querySelector("svg:not(.pic)"); if (s) exporterImage(s, titre); });
      (f.classList.contains("anim") ? f.querySelector(".anim-c") || f : f).appendChild(b);
    });
  }
  if (typeof document !== "undefined") {   /* hors navigateur (bancs Node) : pas de filigrane à poser */
    if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", filigraneImpression); else filigraneImpression();
  }

  W.VRT = W.VRT || {};
  W.VRT.app = { MATIERES: MATIERES, PAR_ID: PAR_ID, CLASSES: CLASSES, lire: lire, ecrire: ecrire, noterJour: noterJour, serie: serie,
    marquerLu: marquerLu, noterQuiz: noterQuiz, teinter: teinter, ico: ico, icoM: icoM, pic: pic, etoiles: etoiles, esc: esc, slug: slug, rail: rail, chiffreSerie: chiffreSerie, scenesPour: scenesPour, jour: jour,
    exporterImage: exporterImage, boutonsImage: boutonsImage, filigraneCanvas: filigraneCanvas };
})(window);
