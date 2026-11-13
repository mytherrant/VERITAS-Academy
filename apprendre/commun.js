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

  /* ════════ RÉGLAGES DE L'ADMINISTRATION (13/11/2026) ════════
     Écran « Apprendre » du tableau de bord (app.js, pgApprendreAdmin) : tout ce
     qui suit peut y être modifié sans toucher au code. Les réglages arrivent par
     /api/apprendre_config.php (window.VRT_APP_CFG, chargé avant ce fichier).
     Aperçu : la page ouverte depuis l'écran admin avec ?apercu=1 lit le
     BROUILLON (localStorage, même origine) au lieu des réglages publiés, et
     le garde pour tout l'onglet (sessionStorage). Sans réglage : rien ne change. */
  var CFG = (function () {
    var c = W.VRT_APP_CFG, ap = false;
    try {
      if (/[?&]apercu=1(&|$)/.test(W.location.search)) W.sessionStorage.setItem("vrt_app_apercu", "1");
      if (/[?&]apercu=0(&|$)/.test(W.location.search)) W.sessionStorage.removeItem("vrt_app_apercu");
      if (W.sessionStorage.getItem("vrt_app_apercu") === "1") {
        var b = W.localStorage.getItem("vrt_app_cfg_apercu");
        if (b) { c = JSON.parse(b); ap = true; }
      }
    } catch (e) { }
    c = (c && typeof c === "object") ? c : {};
    c._apercu = ap;
    return c;
  })();
  function obj(x) { return x && typeof x === "object" && !Array.isArray(x) ? x : {}; }
  function arr(x) { return Array.isArray(x) ? x : []; }
  function txt(x) { return typeof x === "string" ? x.trim() : (typeof x === "number" ? String(x) : ""); }
  /* Une couleur choisie dans l'admin donne les quatre teintes d'une matière. */
  function nuance(hex, k) {
    var n = parseInt(hex.slice(1), 16), r = n >> 16, g = n >> 8 & 255, b = n & 255, cible = k > 0 ? 255 : 0, a = Math.abs(k);
    function c(v) { return ("0" + Math.round(v + (cible - v) * a).toString(16)).slice(-2); }
    return "#" + c(r) + c(g) + c(b);
  }
  (function reglerMatieresClasses() {
    var cm = obj(CFG.matieres), cc = obj(CFG.classes);
    MATIERES.forEach(function (m) {
      var o = obj(cm[m.id]);
      if (txt(o.nom)) m.nom = txt(o.nom);
      if (/^#[0-9a-f]{6}$/i.test(o.couleur || "")) m.t = [o.couleur, nuance(o.couleur, .86), nuance(o.couleur, .45), nuance(o.couleur, -.4)];
      m.masque = o.visible === false;
    });
    MATIERES = MATIERES.filter(function (m) { return !m.masque; });   // PAR_ID garde toutes les matières : rien ne casse
    CLASSES = CLASSES.filter(function (c) { return obj(cc[c]).visible !== false; });
  })();
  function classeOuverte(c) { return CLASSES.indexOf(c) >= 0; }
  /* Leçons : masquer, corriger (titre, contenu, quiz…), en ajouter.
     Une leçon payante (verrou) ne reçoit que ses champs d'en-tête : son contenu
     vit sur le serveur, l'écraser ici casserait la suite réservée aux abonnés. */
  (function reglerLecons() {
    var LE = W.VRT_LECONS = W.VRT_LECONS || {}, mod = obj(CFG.lecons);
    var ENTETE = ["titre", "accroche", "cle"], CORPS = ["intro", "objectifs", "revision", "exo", "quiz", "examen"];
    Object.keys(mod).forEach(function (id) {
      var o = obj(mod[id]), L = LE[id]; if (!L) return;
      if (o.masquer) { delete LE[id]; return; }
      ENTETE.forEach(function (k) { if (txt(o[k])) L[k] = txt(o[k]); });
      if (+o.duree > 0) L.duree = +o.duree;
      var verrou = L.verrou || arr(L.parties).some(function (p) { return p && p.verrou; });
      if (verrou) return;
      CORPS.forEach(function (k) { if (o[k] === false) delete L[k]; else if (o[k] != null) L[k] = o[k]; });
      if (Array.isArray(o.parties)) {
        var orig = arr(L.parties);
        L.parties = o.parties.map(function (p) {
          p = obj(p); var base = (p.src >= 0 && orig[p.src]) ? orig[p.src] : {}, n = {};
          Object.keys(base).forEach(function (k) { n[k] = base[k]; });   // garde schémas et animations
          ["t", "html", "retenir"].forEach(function (k) { if (p[k] != null) n[k] = p[k]; });
          return n;
        });
      }
    });
    arr(CFG.nouvelles).forEach(function (n, i) {
      n = obj(n); var id = txt(n.id);
      if (!id || n.masquer || !txt(n.c) || !txt(n.m) || !txt(n.titre) || LE[id]) return;
      LE[id] = { c: txt(n.c), m: txt(n.m), cle: txt(n.cle), rang: +n.rang || undefined, titre: txt(n.titre), duree: +n.duree || 15,
        accroche: txt(n.accroche), intro: txt(n.intro), objectifs: arr(n.objectifs).map(txt).filter(Boolean),
        parties: arr(n.parties).map(function (p) { p = obj(p); return { t: txt(p.t), html: String(p.html || ""), retenir: p.retenir ? String(p.retenir) : undefined }; }),
        revision: arr(n.revision).map(String).filter(Boolean), exo: String(n.exo || ""),
        quiz: arr(n.quiz).map(obj).filter(function (q) { return txt(q.q) && arr(q.r).length > 1; }).map(function (q) { return { q: txt(q.q), r: arr(q.r).map(txt), b: Math.max(0, Math.min(arr(q.r).length - 1, +q.b || 0)), e: txt(q.e) }; }),
        examen: (n.examen && txt(n.examen.t) && txt(n.examen.href)) ? { t: txt(n.examen.t), href: txt(n.examen.href) } : undefined,
        ordre: 5000 + i, ajout: true };
    });
    Object.keys(LE).forEach(function (k) { var L = LE[k]; if (!classeOuverte(L.c) || (PAR_ID[L.m] && PAR_ID[L.m].masque)) delete LE[k]; });
  })();

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
      var L = LE[k], m = PAR_ID[L.m]; L.id = k;
      if (!m || !(L.cle || L.rang)) { if (!L.n) L.n = 900 + (L.ordre || 0); return; }   // leçon ajoutée hors progression (admin)
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
    var oc = obj(CFG.offre);
    if (oc.cahiers === false) return null;
    var perso = arr(CFG.cahiers).filter(function (x) { x = obj(x); return x.c === c && x.m === m; })[0];
    if (perso) return perso.masquer || !txt(perso.h) ? null : { h: txt(perso.h), t: txt(perso.t) || "Mon cahier", d: txt(perso.d) };
    return cahierDefaut(c, m);
  }
  function cahierDefaut(c, m) {
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
  /* ════════ OFFRES (grille du 12/11/2026) ════════
     Trois formules côte à côte, chacune avec ce qu'elle apporte, pour que
     l'élève compare et choisisse ; à côté, l'accompagnement humain (suivi
     particulier en ligne, répétitions à domicile) sur devis.
     Prix : ceux publiés par le serveur (data-vrt-prix), repli sur le catalogue.
     ctx : "lecon" (fin du cours), "quiz" (sous le bilan), "matiere", "accueil" */
  /* Avantages = table des droits du serveur (vrt_droits_formules, 12/11/2026). */
  var FORMULES = [
    { g: "starter", nom: "Starter", pour: "Pour suivre l'année", mois: "1 200", an: "10 000",
      av: ["Toutes les leçons de 1 classe", "Épreuves, annales et examens blancs", "5 questions par jour au tuteur", "10 fiches PDF par semaine", "2 labos premium à l'essai par semaine"],
      non: ["Labos premium (2 à l'essai)", "Bulletins blancs notés"] },
    { g: "pro", nom: "Pro", pour: "Pour l'année d'examen", mois: "1 600", an: "13 500",
      av: ["Toutes les leçons de 1 classe", "30 questions par jour au tuteur", "20 fiches PDF par semaine", "Tous les labos virtuels premium", "Bulletins blancs : copies notées sur 20"],
      non: ["Classes virtuelles en direct"] },
    { g: "elite", nom: "Élite", pour: "Pour viser la mention", mois: "2 000", an: "16 500",
      av: ["2 classes : la tienne + celle d'avant", "100 questions par jour au tuteur", "40 fiches PDF par semaine", "Classes virtuelles en direct", "Entretien d'orientation sur rendez-vous"],
      non: [] }
  ];
  /* Formules : nom, public, prix de repli, avantages, masquage — réglés dans l'admin. */
  (function reglerFormules() {
    var cf = obj(CFG.formules);
    FORMULES.forEach(function (f) {
      var o = obj(cf[f.g]);
      ["nom", "pour", "mois", "an"].forEach(function (k) { if (txt(o[k])) f[k] = txt(o[k]); });
      if (Array.isArray(o.av)) f.av = o.av.map(txt).filter(Boolean);
      if (Array.isArray(o.non)) f.non = o.non.map(txt).filter(Boolean);
      f.masque = o.masquer === true;
    });
    FORMULES = FORMULES.filter(function (f) { return !f.masque; });
  })();
  var WA_VERITAS = (txt(CFG.whatsapp) || "237697637739").replace(/[^0-9]/g, "");
  /* **gras** saisi dans l'admin → <b>, le reste échappé. */
  function gras(s) { return esc(s).replace(/\*\*([^*]+)\*\*/g, "<b>$1</b>"); }
  var HUMAIN = { nom: "Avec un professeur", pour: "Quand il faut quelqu'un à côté",
    points: ["**Suivi particulier en ligne** : un professeur attitré, des séances en visio, des devoirs corrigés",
             "**Répétitions à domicile** : un enseignant chez toi, à Douala et environs",
             "Fréquence, matières et durée selon tes besoins"],
    tarif: "Tarif sur devis, réponse sous 24 h.", bouton: "Demander un devis",
    lien: "/decouvrir/repetitions-domicile-douala.html", lienT: "En savoir plus" };
  (function () {
    var h = obj(obj(CFG.offre).humain);
    ["nom", "pour", "tarif", "bouton", "lien", "lienT"].forEach(function (k) { if (txt(h[k])) HUMAIN[k] = txt(h[k]); });
    if (Array.isArray(h.points) && h.points.length) HUMAIN.points = h.points.map(txt).filter(Boolean);
  })();
  function carteFormule(f, conseillee) {
    var idM = "abo_" + f.g + "_m", idA = "abo_" + f.g + "_a";
    return '<div class="fo' + (conseillee ? " fo-c" : "") + '">' +
      (conseillee ? '<span class="fo-badge">Conseillée pour toi</span>' : "") +
      '<p class="fo-nom">' + esc(f.nom) + '</p><p class="fo-pour">' + esc(f.pour) + '</p>' +
      '<p class="fo-prix"><b data-vrt-prix="' + idM + '">' + prixConnu(idM, f.mois) + '</b> F<small> / mois</small></p>' +
      '<p class="fo-an">ou <a href="/app.html#abonnement?plan=' + idA + '"><b><span data-vrt-prix="' + idA + '">' + prixConnu(idA, f.an) + '</span> F l\'année</b></a>, payée en une fois</p>' +
      '<ul class="fo-av">' + f.av.map(function (x) { return "<li>" + esc(x) + "</li>"; }).join("") +
        f.non.map(function (x) { return '<li class="fo-non">' + esc(x) + "</li>"; }).join("") + '</ul>' +
      '<a class="fo-btn" href="/app.html#abonnement?plan=' + idM + '">Choisir ' + esc(f.nom) + '</a></div>';
  }
  function carteHumain(c, m) {
    var txt = "Bonjour VÉRITAS, je souhaite un devis pour un accompagnement" + (c ? " en " + c : "") + (m ? " (" + m + ")" : "") + " : suivi particulier en ligne / répétitions à domicile. Ville et quartier : ";
    return '<div class="fo fo-h"><p class="fo-nom">' + esc(HUMAIN.nom) + '</p><p class="fo-pour">' + esc(HUMAIN.pour) + '</p>' +
      '<ul class="fo-av fo-av-h">' + HUMAIN.points.map(function (x) { return "<li>" + gras(x) + "</li>"; }).join("") + '</ul>' +
      '<p class="fo-an">' + esc(HUMAIN.tarif) + '</p>' +
      '<a class="fo-btn fo-btn-h" href="https://wa.me/' + WA_VERITAS + '?text=' + encodeURIComponent(txt) + '" target="_blank" rel="noopener">' + esc(HUMAIN.bouton) + '</a>' +
      (HUMAIN.lien ? '<a class="fo-lien" href="' + esc(HUMAIN.lien) + '">' + esc(HUMAIN.lienT) + '</a>' : '') + '</div>';
  }
  function offre(c, m, ctx) {
    var oc = obj(CFG.offre);
    if (oc.actif === false) return "";
    var cah = cahierPour(c, m), ex = examen(c), tt = obj(oc.titres);
    var titre = txt(tt[ctx]) || { lecon: "Pour aller plus loin", quiz: "Continue sur ta lancée", matiere: "En attendant les prochaines leçons", accueil: "Aller plus loin avec VÉRITAS" }[ctx] || "Pour aller plus loin";
    var conseil = ex ? (txt(oc.conseilExamen) || "pro") : (txt(oc.conseilAutre) || "starter"), ens = obj(oc.enseignant);
    return '<aside class="offre offre-' + ctx + '" aria-label="' + esc(titre) + '"><p class="offre-t">' + esc(titre) + '</p>' +
      '<h2 class="offre-h">' + esc(txt(oc.titre) || "Choisis ta formule") + '</h2>' +
      '<div class="offre-grille"><div class="offre-plans">' +
      FORMULES.map(function (f) { return carteFormule(f, f.g === conseil); }).join("") +
      '</div>' + (oc.humainActif === false ? "" : carteHumain(c, m)) + '</div>' +
      (txt(oc.note) ? '<p class="offre-n">' + gras(txt(oc.note)) + '</p>' : '<p class="offre-n">Payer l\'année en une fois revient à un peu plus de huit mois (Starter : 10 000 F au lieu de 14 400 F). Plusieurs enfants ? La <a href="/app.html#abonnement?plan=abo_famille_m">formule Famille</a> couvre jusqu\'à 4 enfants au niveau Élite pour <span data-vrt-prix="abo_famille_m">' + prixConnu("abo_famille_m", "6 000") + '</span> F par mois. Paiement Orange Money ou MTN MoMo, sans engagement.</p>') +
      (cah ? lienOffre(cah.h, cah.t, cah.d, PICTO_LIVRE) : "") +
      (ens.actif === false ? "" : lienOffre(txt(ens.h) || "/app.html#tarifs", txt(ens.t) || "Enseignant ? Les formules multi-classes", txt(ens.d) || "3 classes, 6 classes ou toutes, dès 2 500 F par mois : leçons à projeter, fiches à distribuer, épreuves corrigées.", PICTO_CLE)) +
      '</aside>';
  }
  /* Les bonnes réponses étaient rangées en 1ʳᵉ ou 2ᵉ position (3ᵉ : 5 fois sur 177) :
     on mélange l'ordre à l'affichage, l'indice de la bonne réponse suit. */
  function melanger(q) {
    var ordre = q.r.map(function (_, k) { return k; });
    for (var i = ordre.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)), t = ordre[i]; ordre[i] = ordre[j]; ordre[j] = t; }
    return { r: ordre.map(function (k) { return q.r[k]; }), b: ordre.indexOf(q.b) };
  }

  /* ---------- ressources du site reliées à la progression (ressources.js) ---------- */
  /* 13/11/2026 « Mets les annales au début (anciens sujets) » : M'entraîner d'abord, les annales en tête. */
  var GROUPES = [["entrainer", "M'entraîner", "i-target", "Annales, épreuves, labos, compositions, jeux"], ["apprendre", "Comprendre et apprendre", "i-book-open", "Cours, œuvres, méthodes, corrigés"],
                 ["suivi", "Où j'en suis", "i-gauge", "Notes, coefficients, orientation"], ["aide", "Besoin d'aide", "i-message", "Questions, repères, calendrier"]];
  var FAMILLES = [
    ["epreuve", "Annales et épreuves", "i-pen", "Les anciens sujets de l'examen, corrigés, puis des sujets complets pour t'entraîner.", "entrainer"],
    ["notes", "Notes et orientation", "i-calculator", "Où tu en es, ce qui compte vraiment, la série qui t'attend.", "suivi"],
    ["methode", "Méthodes et examens", "i-feather", "Les méthodes attendues le jour de l'épreuve.", "apprendre"],
    ["cours", "Cours rédigés", "i-book-open", "Les leçons complètes déjà disponibles pour ta classe.", "apprendre"],
    ["oeuvre", "Œuvres au programme", "i-book", "Analyse, résumé, carte mentale et QCM.", "apprendre"],
    ["scene", "Scènes vivantes", "i-play", "Une situation courte où tu choisis la bonne réponse.", "apprendre"],
    ["corrige", "Mon cahier et ses corrigés", "i-clipboard-check", "Le cahier de l'année, corrigé séquence par séquence.", "apprendre"],
    ["fichier", "Documents du catalogue", "i-file-text", "Les documents déposés par le centre pour ta classe.", "apprendre"],
    ["labo", "Laboratoires", "i-flask", "Manipuler, observer, conclure : l'expérience reliée à ta leçon.", "entrainer"],
    ["direct", "Compositions en direct", "i-clock", "Chronométrées, corrigées dès la remise.", "entrainer"],
    ["jeu", "Jeux et défis", "i-gamepad", "Réviser en jouant, se mesurer aux élèves de son cycle.", "entrainer"],
    ["aide", "Aide et repères", "i-message", "Pour poser une question ou situer ce que tu apprends.", "aide"]
  ];
  var TONS = [["#1E499B", "#EDF2FB"], ["#0E7C86", "#E9F5F6"], ["#5B4FA8", "#F0EDF9"], ["#B03A6E", "#FBEFF4"], ["#007E11", "#EAF6EC"], ["#C24E00", "#FDF1E8"]];
  function ton(i) { var t = TONS[i % TONS.length]; return "--k:" + t[0] + ";--kp:" + t[1]; }
  /* Les titres saisis dans l'administration peuvent contenir des émojis : jamais affichés ici. */
  var RE_EMO = /[\u{1F000}-\u{1FAFF}\u{2190}-\u{21FF}\u{2300}-\u{23FF}\u{2460}-\u{24FF}\u{25A0}-\u{27BF}\u{2900}-\u{297F}\u{2B00}-\u{2BFF}\u{3030}\u{303D}\u{FE0F}\u{20E3}\u{200D}]/gu;
  function net(s) { return String(s == null ? "" : s).replace(RE_EMO, "").replace(/\s{2,}/g, " ").trim(); }
  var LIB_F = {}; FAMILLES.forEach(function (f, i) { f[5] = ton(i); LIB_F[f[0]] = f; });
  /* 13/11/2026 « regroupe les pages » : trois petites familles fondues dans leur voisine. */
  var FUSION = { orientation: "notes", cahier: "corrige", defis: "jeu" };
  function famDe(t) { return FUSION[t] || t; }
  /* Rubriques, familles et ressources réglées dans l'admin (13/11/2026). */
  var FAM_MASQ = {};
  (function reglerFamilles() {
    var cg = obj(CFG.groupes), cf = obj(CFG.familles);
    GROUPES.forEach(function (g) { var o = obj(cg[g[0]]); if (txt(o.nom)) g[1] = txt(o.nom); if (txt(o.desc)) g[3] = txt(o.desc); });
    FAMILLES.forEach(function (f) {
      var o = obj(cf[f[0]]);
      if (txt(o.nom)) f[1] = txt(o.nom); if (txt(o.desc)) f[3] = txt(o.desc);
      if (GROUPES.some(function (g) { return g[0] === o.groupe; })) f[4] = o.groupe;
      if (o.visible === false) FAM_MASQ[f[0]] = 1;
    });
    for (var i = FAMILLES.length - 1; i >= 0; i--) if (FAM_MASQ[FAMILLES[i][0]]) FAMILLES.splice(i, 1);
  })();
  (function reglerRessources() {
    var R0 = W.VRT_RES = W.VRT_RES || { items: {}, lec: {}, mat: {}, cl: {} }, mod = obj(CFG.ressources), parti = {};
    ["items", "lec", "mat", "cl"].forEach(function (k) { R0[k] = R0[k] || {}; });
    Object.keys(mod).forEach(function (id) {
      var o = obj(mod[id]), it = R0.items[id]; if (!it) return;
      if (o.masquer) { parti[id] = 1; return; }
      ["ti", "d", "u"].forEach(function (k) { if (txt(o[k])) it[k] = txt(o[k]); });
      if (o.ab === 0 || o.ab === 1) it.ab = o.ab;
    });
    arr(CFG.ressourcesAjout).forEach(function (n) {
      n = obj(n); var id = txt(n.id);
      if (!id || n.masquer || !txt(n.ti) || !txt(n.u)) return;
      R0.items[id] = { t: LIB_F[n.t] ? n.t : "aide", ti: txt(n.ti), d: txt(n.d), u: txt(n.u), ab: n.ab ? 1 : 0 };
      function poser(tab, k) { (tab[k] = tab[k] || []); if (tab[k].indexOf(id) < 0) (n.debut ? tab[k].unshift(id) : tab[k].push(id)); }
      arr(n.classes).forEach(function (c) {
        if (txt(n.m) && +n.n > 0) poser(R0.lec, c + "|" + n.m + "|" + (+n.n));
        else if (txt(n.m)) poser(R0.mat, c + "|" + n.m);
        else poser(R0.cl, c);
      });
    });
    Object.keys(R0.items).forEach(function (id) { var it = R0.items[id]; it.t = famDe(it.t); if (FAM_MASQ[it.t]) parti[id] = 1; });
    Object.keys(parti).forEach(function (id) { delete R0.items[id]; });
    ["lec", "mat", "cl"].forEach(function (k) {
      Object.keys(R0[k]).forEach(function (cle) { R0[k][cle] = R0[k][cle].filter(function (id) { return R0.items[id]; }); });
    });
  })();
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
  function gratuitDabord(ids) { var R0 = RES(); function r(id) { var it = R0.items[id] || {}; return it.an ? 0 : it.ab ? 2 : 1; }   /* annales, puis gratuit, puis payant */
    function an(id) { var m = /_(\d{4})$/.exec(id); return R0.items[id] && R0.items[id].an ? (m ? +m[1] : 9999) : 0; }   /* session la plus récente d'abord */
    return ids.map(function (id, k) { return [id, k]; }).sort(function (a, b) { return r(a[0]) - r(b[0]) || an(b[0]) - an(a[0]) || a[1] - b[1]; }).map(function (a) { return a[0]; }); }
  /* Une ressource gratuite par famille, dans l'ordre où elle donne envie. */
  /* 13/11/2026 : les méthodes d'examen d'abord (demande de Jacques) : c'est ce que l'élève de chaque classe doit voir en premier. */
  var ORDRE_GOUT = ["epreuve", "methode", "corrige", "oeuvre", "direct", "jeu", "labo", "scene", "cours", "notes"];
  function selectionGratuite(ids, n) {
    var R0 = RES(), vu = {}, o = [];
    ORDRE_GOUT.forEach(function (f) { if (o.length >= n) return; var ok = function (i) { var it = R0.items[i]; return it && !it.ab && it.t === f && !vu[i]; }, id = ids.find(function (i) { return ok(i) && R0.items[i].an; }) || ids.find(ok); if (id) { vu[id] = 1; o.push(id); } });
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
  /* « Met seulement 2 éléments les plus actuels ou pertinents, puis le bouton
     voir plus pour éviter de surcharger » (Jacques, 12/11/2026).
     replier(liste, n) : n premiers enfants visibles, les autres derrière un
     bouton « Voir plus (k) » qui les déplie (et « Voir moins » les replie).
     Idempotent : rappelé après un nouveau rendu, il remplace son bouton. */
  function replier(liste, n, nom) {
    if (!liste) return;
    var enf = [].slice.call(liste.children), reste = enf.length - n;
    if (liste._vpBtn && liste._vpBtn.parentNode) liste._vpBtn.parentNode.removeChild(liste._vpBtn);
    enf.forEach(function (e, i) { e.hidden = i >= n; });
    if (reste <= 0) return;
    var b = document.createElement("button");
    b.type = "button"; b.className = "voir-plus"; b.setAttribute("aria-expanded", "false");
    var lib = function (ouvert) { return ouvert ? "Voir moins" : "Voir plus" + (nom ? " de " + nom : "") + " (" + reste + ")"; };
    b.textContent = lib(false);
    b.onclick = function () {
      var ouvert = b.getAttribute("aria-expanded") !== "true";
      enf.forEach(function (e, i) { if (i >= n) e.hidden = !ouvert; });
      b.setAttribute("aria-expanded", String(ouvert)); b.textContent = lib(ouvert);
    };
    liste.parentNode.insertBefore(b, liste.nextSibling);
    liste._vpBtn = b;
  }
  /* ════════ Habillage réglé dans l'admin : bandeau, fermeture, textes (13/11/2026) ════════ */
  /* Textes : « remplacer ce texte par celui-ci », sur toutes les pages d'Apprendre,
     y compris ce qui est dessiné après coup (MutationObserver sur les ajouts). */
  var REMPL = arr(CFG.textes).map(obj).filter(function (r) { return txt(r.de) && typeof r.vers === "string" && r.actif !== false; })
    .map(function (r) { return [txt(r.de), r.vers]; });
  function remplacerDans(racine) {
    if (!REMPL.length || !racine) return;
    if (racine.nodeType === 3) { remplacerNoeud(racine); return; }
    if (racine.nodeType !== 1 || /^(SCRIPT|STYLE|TEXTAREA|INPUT)$/.test(racine.tagName)) return;
    var w = document.createTreeWalker(racine, 4, null), n, l = [];
    while ((n = w.nextNode())) l.push(n);
    l.forEach(remplacerNoeud);
    [].forEach.call(racine.querySelectorAll ? racine.querySelectorAll("[placeholder],[title],[aria-label]") : [], function (e) {
      ["placeholder", "title", "aria-label"].forEach(function (a) { var v = e.getAttribute(a); if (v) { var v2 = remplacerTexte(v); if (v2 !== v) e.setAttribute(a, v2); } });
    });
  }
  function remplacerTexte(v) { REMPL.forEach(function (r) { if (v.indexOf(r[0]) >= 0) v = v.split(r[0]).join(r[1]); }); return v; }
  function remplacerNoeud(n) {
    var p = n.parentNode; if (!p || /^(SCRIPT|STYLE|TEXTAREA)$/.test(p.nodeName)) return;
    var v = n.nodeValue, v2 = remplacerTexte(v); if (v2 !== v) n.nodeValue = v2;
  }
  function habiller() {
    var b = obj(CFG.bandeau), corps = document.body; if (!corps) return;
    if (CFG.ferme && !CFG._apercu) {
      corps.innerHTML = '<main style="max-width:640px;margin:12vh auto;padding:24px;font-family:Poppins,Arial,sans-serif;text-align:center;color:#142554">' +
        '<h1 style="font-size:1.6rem;margin:0 0 12px">' + esc(txt(CFG.fermeTitre) || "Apprendre revient très vite") + '</h1>' +
        '<p style="font-size:1.05rem;line-height:1.6">' + gras(txt(CFG.fermeTexte) || "Nous mettons à jour les cours. Reviens dans quelques instants.") + '</p>' +
        '<p><a href="/" style="color:#1E499B;font-weight:600">Retour à l\'accueil VÉRITAS</a></p></main>';
      return;
    }
    if (b.actif && txt(b.texte)) {
      var TONS_B = { info: ["#1E499B", "#fff"], or: ["#FFC93C", "#142554"], vert: ["#007E11", "#fff"], alerte: ["#B42318", "#fff"] }, t = TONS_B[b.ton] || TONS_B.info;
      var el = document.createElement(txt(b.lien) ? "a" : "div");
      el.className = "vrt-bandeau-admin"; if (txt(b.lien)) el.href = txt(b.lien);
      el.style.cssText = "display:block;padding:9px 16px;text-align:center;font:600 14px/1.45 Poppins,Arial,sans-serif;text-decoration:none;background:" + t[0] + ";color:" + t[1];
      el.innerHTML = gras(txt(b.texte)) + (txt(b.lien) ? " ›" : "");
      corps.insertBefore(el, corps.firstChild);
    }
    if (CFG._apercu) {
      var ap = document.createElement("div");
      ap.style.cssText = "position:fixed;right:12px;bottom:12px;z-index:99999;background:#142554;color:#FFC93C;padding:8px 12px;border-radius:10px;font:600 13px Poppins,Arial,sans-serif;box-shadow:0 4px 16px rgba(0,0,0,.25)";
      ap.innerHTML = 'Aperçu du brouillon' + (CFG.ferme ? ' (Apprendre est FERMÉ au public)' : '') + ' · <a href="?apercu=0" style="color:#fff">quitter</a>';
      corps.appendChild(ap);
    }
    if (REMPL.length) {
      document.title = remplacerTexte(document.title);
      remplacerDans(corps);
      if (W.MutationObserver) new MutationObserver(function (ms) {
        ms.forEach(function (m) { [].forEach.call(m.addedNodes, remplacerDans); });
      }).observe(corps, { childList: true, subtree: true });
    }
  }
  if (typeof document !== "undefined") {
    if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", habiller); else habiller();
  }

  W.VRT.app = { cfg: CFG, FORMULES: FORMULES, HUMAIN: HUMAIN, WA: WA_VERITAS, cahierDefaut: cahierDefaut, replier: replier, titreL: titreL, si: si, net: net, ton: ton, GROUPES: GROUPES, chargerCatalogue: chargerCatalogue, FAMILLES: FAMILLES, famDe: famDe, resLecon: resLecon, resDeMatiere: resDeMatiere, resClasse: resClasse, gratuitDabord: gratuitDabord, selectionGratuite: selectionGratuite, leconsDeRes: leconsDeRes, carteRes: carteRes, pastilles: pastilles, MATIERES: MATIERES, PAR_ID: PAR_ID, CLASSES: CLASSES, lire: lire, ecrire: ecrire, noterJour: noterJour, serie: serie,
    marquerLu: marquerLu, noterQuiz: noterQuiz, teinter: teinter, ico: ico, icoM: icoM, pic: pic, etoiles: etoiles, esc: esc, slug: slug, rail: rail, chiffreSerie: chiffreSerie, scenesPour: scenesPour, jour: jour,
    exporterImage: exporterImage, offre: offre, cahierPour: cahierPour, melanger: melanger, boutonsImage: boutonsImage, filigraneCanvas: filigraneCanvas };
})(window);
