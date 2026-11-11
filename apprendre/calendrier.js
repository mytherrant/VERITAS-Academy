/* VÉRITAS · Apprendre — « Mon année scolaire » (10/11/2026)
   Trois blocs qui suivent la classe choisie :
   1. le calendrier scolaire 2026-2027 et un compte à rebours ;
   2. les actualités MINESEC, celles de l'examen de la classe en tête ;
   3. l'entrée dans la classe virtuelle de la classe.
   Source des dates : arrêté conjoint MINEDUB/MINESEC fixant le calendrier de
   l'année scolaire 2026/2027 (mêmes données que CALENDRIER_SCOLAIRE d'app.js).
   Dates du BEPC, du Probatoire et du Baccalauréat : décision n° 966/26/MINESEC
   du 1er octobre 2026 fixant le calendrier des examens et concours de la
   session 2027 (séries A, ABI, AC, C, D, E, SH, TI ; EPS : article 3). */
(function (W) {
  "use strict";
  var A = W.VRT && W.VRT.app, esc = A ? A.esc : function (s) { return String(s); };

  /* Heure du Cameroun (UTC+1, sans heure d'été). */
  function d(iso, h) { return new Date(iso + "T" + (h || "00:00") + ":00+01:00"); }

  /* Session 2027 (décision n° 966/26/MINESEC). ecrit : épreuves écrites ;
     fac : épreuves facultatives ou oral ; fin : résultats ou délibérations. */
  var SESSION = {
    BEPC: { ecrit: ["2027-05-31", "2027-06-03"], fac: ["2027-06-04", "Oral du BEPC bilingue"],
            fin: ["2027-07-09", null, "Publication des résultats du BEPC (à confirmer par la DECC)"] },
    "Baccalauréat": { ecrit: ["2027-05-24", "2027-05-28"], fac: ["2027-05-28", "Épreuves facultatives du Baccalauréat"],
            fin: ["2027-07-08", "2027-07-10", "Délibérations du Baccalauréat"] },
    Probatoire: { ecrit: ["2027-06-07", "2027-06-11"], fac: ["2027-06-11", "Épreuves facultatives du Probatoire"],
            fin: ["2027-07-22", "2027-07-24", "Délibérations du Probatoire"] }
  };

  function examen(c) {
    if (c === "3e") return { nom: "BEPC", cat: "bepc", mots: /\bBEPC\b/i };
    if (/^1re/.test(c)) return { nom: "Probatoire", cat: "probatoire", mots: /probatoire/i, serie: c.slice(4) };
    if (/^Tle/.test(c)) return { nom: "Baccalauréat", cat: "bac", mots: /\bbac(calaur[ée]at)?\b/i, serie: c.slice(4) };
    return null;
  }
  /* Ce qui concerne un autre examen que celui de la classe passe après. */
  var AUTRES = /\b(BEPC|probatoire|bac(calaur[ée]at)?|CEP|GCE|concours d'entrée en 6)/i;

  var TRIMESTRES = [
    { n: 1, de: d("2026-09-07", "07:30"), a: d("2026-11-27", "15:30"), seq: [[1, "2026-09-07", "2026-10-16"], [2, "2026-10-19", "2026-11-27"]] },
    { n: 2, de: d("2026-11-30", "07:30"), a: d("2027-03-05", "15:30"), seq: [[3, "2026-11-30", "2027-01-22"], [4, "2027-01-25", "2027-03-05"]] },
    { n: 3, de: d("2027-03-08", "07:30"), a: d("2027-06-11", "15:30"), seq: [[5, "2027-03-08", "2027-04-30"], [6, "2027-05-03", "2027-06-11"]] }
  ];
  var RENTREE = d("2026-09-07", "07:30"), FIN = d("2027-07-30", "15:30");

  /* Échéances. q : "tous", "examen" (classes d'examen seulement), "inter" (autres classes).
     ico : icône de veritas-icons.svg. */
  function echeances(c) {
    var ex = examen(c), L = [
      { t: "Fin de la séquence 1", de: d("2026-10-16", "15:30"), ico: "i-clipboard-check", q: "tous" },
      { t: "Fin de la séquence 2 et du 1ᵉʳ trimestre", de: d("2026-11-27", "15:30"), ico: "i-clipboard-check", q: "tous" },
      { t: "Vacances de Noël", de: d("2026-12-18", "15:30"), a: d("2027-01-04", "07:30"), ico: "i-star", q: "tous", vac: 1 },
      { t: "Fin de la séquence 3", de: d("2027-01-22", "15:30"), ico: "i-clipboard-check", q: "tous" },
      { t: "Fin de la séquence 4 et du 2ᵉ trimestre", de: d("2027-03-05", "15:30"), ico: "i-clipboard-check", q: "tous" },
      { t: "Vacances de Pâques", de: d("2027-03-25", "15:30"), a: d("2027-04-12", "07:30"), ico: "i-star", q: "tous", vac: 1 },
      { t: "Épreuves zéro (examen blanc national)", de: d("2027-04-15", "07:30"), a: d("2027-04-16", "15:30"), ico: "i-pen", q: "examen" },
      { t: "Épreuves pratiques d'EPS (dates fixées par ta région)", de: d("2027-04-26", "07:30"), a: d("2027-05-07", "15:30"), ico: "i-award", q: "examen" },
      { t: "Fin de la séquence 5", de: d("2027-04-30", "15:30"), ico: "i-clipboard-check", q: "tous" },
      { t: ex ? "Compositions de fin d'année, au format de l'examen" : "Compositions de fin d'année", de: d("2027-05-03", "07:30"), a: d("2027-05-21", "15:30"), ico: "i-pen", q: "tous" },
      { t: "Grandes vacances", de: d("2027-06-11", "15:30"), a: d("2027-09-06", "07:30"), ico: "i-star", q: "inter", vac: 1 },
      { t: "Rentrée 2027-2028", de: d("2027-09-06", "07:30"), ico: "i-school", q: "tous" }
    ];
    if (ex) {
      var S = SESSION[ex.nom];
      L.push({ t: "Épreuves écrites du " + ex.nom + (ex.serie ? " série " + ex.serie : ""), de: d(S.ecrit[0], "07:30"), a: d(S.ecrit[1], "18:00"), ico: "i-graduation", q: "examen", cle: 1 });
      L.push({ t: S.fac[1], de: d(S.fac[0], "07:30"), ico: "i-pen", q: "examen" });
      L.push({ t: S.fin[2], de: d(S.fin[0], "08:00"), a: S.fin[1] ? d(S.fin[1], "18:00") : null, ico: "i-award", q: "examen" });
    }
    if (/^(1re|Tle)/.test(c)) L.push({ t: "Journée mondiale de la philosophie", de: d("2026-11-26", "07:30"), ico: "i-brain", q: "tous" });
    L.push({ t: "Semaine nationale du bilinguisme", de: d("2027-01-25", "07:30"), a: d("2027-01-29", "15:30"), ico: "i-globe", q: "tous" });
    L.push({ t: "Semaine de la jeunesse", de: d("2027-02-03", "07:30"), a: d("2027-02-11", "15:30"), ico: "i-users", q: "tous" });
    return L.filter(function (e) { return e.q === "tous" || (e.q === "examen") === !!ex; })
      .sort(function (x, y) { return x.de - y.de; });
  }

  var MOIS = ["janv.", "févr.", "mars", "avr.", "mai", "juin", "juil.", "août", "sept.", "oct.", "nov.", "déc."];
  function jj(t) { var x = new Date(t.getTime() + 3600000); return x.getUTCDate() + (x.getUTCDate() === 1 ? "ᵉʳ" : "") + " " + MOIS[x.getUTCMonth()] + (x.getUTCFullYear() !== 2026 && x.getUTCFullYear() !== 2027 ? "" : " " + x.getUTCFullYear()); }
  function periode(e) { return e.a ? "du " + jj(e.de) + " au " + jj(e.a) : jj(e.de); }
  function jours(ms) { return Math.max(0, Math.ceil(ms / 86400000)); }

  /* Où en est l'année : trimestre, séquence, interruption. */
  function situation(now) {
    if (now < RENTREE) return { t: "Avant la rentrée", p: 0 };
    if (now > FIN) return { t: "Année scolaire terminée", p: 100 };
    var p = Math.round((now - RENTREE) / (d("2027-06-11", "15:30") - RENTREE) * 100);
    for (var i = 0; i < TRIMESTRES.length; i++) {
      var T = TRIMESTRES[i];
      for (var k = 0; k < T.seq.length; k++) {
        var s = T.seq[k];
        if (now >= d(s[1], "07:30") && now <= d(s[2], "15:30")) {
          var vac = (now >= d("2026-12-18", "15:30") && now < d("2027-01-04", "07:30")) ? " · vacances de Noël"
                  : (now >= d("2027-03-25", "15:30") && now < d("2027-04-12", "07:30")) ? " · vacances de Pâques" : "";
          return { t: T.n + (T.n === 1 ? "ᵉʳ" : "ᵉ") + " trimestre · séquence " + s[0] + vac, p: Math.min(p, 100) };
        }
      }
    }
    return { t: "Entre deux trimestres", p: Math.min(p, 100) };
  }

  function si(n, t) { return A ? A.si(n, t) : ""; }

  /* ---------- 1. calendrier + compte à rebours ---------- */
  var minuteur = null;
  function calendrier(el, c) {
    var now = new Date(), ex = examen(c), L = echeances(c), sit = situation(now);
    var venir = L.filter(function (e) { return (e.a || e.de) > now; });
    /* Le grand compteur : l'examen pour une classe d'examen, sinon les prochaines vacances. */
    var cible = ex ? venir.filter(function (e) { return e.cle; })[0] : venir.filter(function (e) { return e.vac && e.de > now; })[0];
    cible = cible || venir[0];
    var titre = !cible ? "Bonne fin d'année" : ex && cible.cle ? "Avant le " + ex.nom : ex ? "Prochaine étape : " + cible.t.charAt(0).toLowerCase() + cible.t.slice(1) : "Avant les " + cible.t.charAt(0).toLowerCase() + cible.t.slice(1);
    var note = ex
      ? "Décision n° 966/26/MINESEC du 1ᵉʳ oct. 2026, session 2027."
      : "Classe de " + c + " : pas d'examen officiel cette année, mais six séquences et des compositions qui comptent pour le passage.";
    var proch = venir.filter(function (e) { return e !== cible; }).slice(0, 5);
    el.innerHTML =
      '<div class="cal-g">' +
      '<div class="cal-cpt"' + (cible ? ' data-cible="' + cible.de.getTime() + '"' : "") + '>' +
        '<p class="cal-sur">' + si("i-clock", 16) + ' ' + esc(titre) + '</p>' +
        (cible ? '<div class="cal-chiffres" role="timer" aria-live="off"><span><b data-u="j">–</b><small>jours</small></span><span><b data-u="h">–</b><small>heures</small></span><span><b data-u="m">–</b><small>min</small></span><span><b data-u="s">–</b><small>s</small></span></div>' +
          '<p class="cal-quand">' + esc(cible.t) + ' · ' + periode(cible) + '</p>' : '<p class="cal-quand">Rentrée 2027-2028 le 6 sept. 2027.</p>') +
        (note ? '<p class="cal-note">' + esc(note) + '</p>' : "") +
      '</div>' +
      '<div class="cal-an">' +
        '<p class="cal-sit"><b>' + esc(sit.t) + '</b><span>' + sit.p + ' % de l\'année</span></p>' +
        '<div class="cal-barre" role="progressbar" aria-valuenow="' + sit.p + '" aria-valuemin="0" aria-valuemax="100" aria-label="Avancement de l\'année scolaire"><i style="width:' + sit.p + '%"></i>' +
          TRIMESTRES.map(function (T) { return '<em style="left:' + Math.round((T.a - RENTREE) / (d("2027-06-11", "15:30") - RENTREE) * 100) + '%"></em>'; }).join("") + '</div>' +
        '<ul class="cal-l">' + proch.map(function (e) {
          var n = jours(e.de - now), en = e.de <= now;
          return '<li class="' + (e.vac ? "vac" : e.q === "examen" ? "exa" : "") + '"><span class="cal-i">' + si(e.ico, 18) + '</span><span class="cal-t"><b>' + esc(e.t) + '</b><small>' + periode(e) + '</small></span><span class="cal-j">' + (en ? "en cours" : n === 0 ? "aujourd'hui" : "J-" + n) + '</span></li>';
        }).join("") + '</ul>' +
        '<p class="cal-src">Arrêté conjoint MINEDUB/MINESEC, année scolaire 2026-2027' + (ex ? ' ; décision n° 966/26/MINESEC, examens 2027' : '') + '.</p>' +
      '</div></div>';
    tic(el);
  }
  function tic(el) {
    if (minuteur) clearInterval(minuteur);
    var box = el.querySelector("[data-cible]"); if (!box) return;
    var cible = +box.getAttribute("data-cible"), u = {};
    ["j", "h", "m", "s"].forEach(function (k) { u[k] = box.querySelector('[data-u="' + k + '"]'); });
    function maj() {
      var r = Math.max(0, cible - Date.now()), s = Math.floor(r / 1000);
      u.j.textContent = Math.floor(s / 86400); u.h.textContent = ("0" + Math.floor(s % 86400 / 3600)).slice(-2);
      u.m.textContent = ("0" + Math.floor(s % 3600 / 60)).slice(-2); u.s.textContent = ("0" + s % 60).slice(-2);
      if (!r) clearInterval(minuteur);
    }
    maj(); minuteur = setInterval(maj, 1000);
  }

  /* ---------- 2. actualités MINESEC ---------- */
  var cache = {};
  function flux(cat) {
    if (cache[cat]) return cache[cat];
    return (cache[cat] = fetch("/api/news_proxy.php?cat=" + cat, { credentials: "omit" })
      .then(function (r) { return r.ok ? r.json() : { items: [] }; })
      .then(function (j) { return (j && j.items) || []; })
      .catch(function () { return []; }));
  }
  function lien(u) { return /^https?:\/\//i.test(u || "") ? u : ""; }
  function actus(el, c) {
    var ex = examen(c), demande = c;
    el.innerHTML = '<p class="act-att">Chargement des actualités…</p>';
    Promise.all([flux("minesec"), ex ? flux(ex.cat) : Promise.resolve([])]).then(function (r) {
      if (demande !== el.getAttribute("data-classe")) return;   // classe changée entre-temps
      var vus = {}, tout = [];
      r[1].concat(r[0]).forEach(function (x) {
        var k = (x.title || "").toLowerCase().slice(0, 70); if (!x.title || !lien(x.link) || vus[k]) return; vus[k] = 1;
        var mien = ex && ex.mots.test(x.title), autre = !mien && AUTRES.test(x.title);
        tout.push({ x: x, rang: mien ? 0 : autre ? 2 : 1, mien: mien });
      });
      tout.sort(function (a, b) { return a.rang - b.rang; });
      var L = tout.slice(0, 6);
      if (!L.length) {
        el.innerHTML = '<p class="act-vide">Les actualités ne répondent pas pour l\'instant. Les communiqués officiels restent sur <a href="https://www.minesec.gov.cm" target="_blank" rel="noopener">minesec.gov.cm</a>.</p>';
        return;
      }
      el.innerHTML = '<ul class="act-l">' + L.map(function (o) {
        var x = o.x;
        return '<li><a href="' + esc(lien(x.link)) + '" target="_blank" rel="noopener">' +
          (o.mien ? '<span class="act-tag">' + esc(ex.nom) + '</span>' : "") +
          '<b>' + esc(x.title) + '</b><small>' + esc([x.source, x.date].filter(Boolean).join(" · ")) + '</small></a></li>';
      }).join("") + '</ul>' +
      '<p class="act-src">' + (ex ? "Le " + esc(ex.nom) + " d'abord, puis l'actualité du ministère. " : "") + 'Sources de presse ; le texte officiel fait foi sur <a href="https://www.minesec.gov.cm" target="_blank" rel="noopener">minesec.gov.cm</a>.</p>';
    });
  }

  /* ---------- 3. classe virtuelle ---------- */
  function classeVirtuelle(el, c) {
    var ex = examen(c), salons = ["Général", "Annonces", "Français", "Mathématiques", "Sciences"];
    el.innerHTML =
      '<div class="cv-t"><span class="cv-i">' + si("i-users", 26) + '</span><div><b>Classe virtuelle de ' + esc(c) + '</b>' +
      '<small>Tes enseignants et les élèves de ta classe, au même endroit.</small></div></div>' +
      '<ul class="cv-s">' + salons.map(function (s) { return '<li>' + esc(s) + '</li>'; }).join("") + '</ul>' +
      '<p class="cv-p">Pose une question sur une leçon, récupère les annonces et les corrigés' + (ex ? ", prépare le " + esc(ex.nom) + " à plusieurs" : "") + '. Réservée aux élèves inscrits au centre.</p>' +
      '<a class="cv-go" href="/app.html#classes?c=' + encodeURIComponent(c) + '">Entrer dans ma classe ›</a>' +
      '<a class="cv-sec" href="/app.html#connexion">Pas encore de compte ? Je me connecte</a>';
  }

  function rendre(c, ids) {
    var cal = document.getElementById(ids.cal), act = document.getElementById(ids.act), cv = document.getElementById(ids.cv);
    if (cal) calendrier(cal, c);
    if (act && act.getAttribute("data-classe") !== c) { act.setAttribute("data-classe", c); actus(act, c); }
    if (cv) classeVirtuelle(cv, c);
  }

  W.VRT = W.VRT || {};
  W.VRT.annee = { rendre: rendre, echeances: echeances, examen: examen, situation: situation };
})(window);
