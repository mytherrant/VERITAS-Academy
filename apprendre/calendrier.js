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
  /* Réglages de l'écran admin « Apprendre » (13/11/2026) : dates d'examen,
     échéances ajoutées ou masquées, salons de la classe virtuelle. */
  var CC = (A && A.cfg && A.cfg.calendrier && typeof A.cfg.calendrier === "object") ? A.cfg.calendrier : {};
  var ISO = /^\d{4}-\d{2}-\d{2}$/;

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
  Object.keys(SESSION).forEach(function (nom) {
    var o = (CC.session || {})[nom]; if (!o || typeof o !== "object") return;
    var S = SESSION[nom];
    if (ISO.test(o.ecritDe || "")) S.ecrit[0] = o.ecritDe;
    if (ISO.test(o.ecritA || "")) S.ecrit[1] = o.ecritA;
    if (ISO.test(o.facDe || "")) S.fac[0] = o.facDe;
    if (o.facT) S.fac[1] = String(o.facT);
    if (ISO.test(o.finDe || "")) S.fin[0] = o.finDe;
    if (ISO.test(o.finA || "")) S.fin[1] = o.finA;
    if (o.finT) S.fin[2] = String(o.finT);
  });

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
    (Array.isArray(CC.ajout) ? CC.ajout : []).forEach(function (e) {
      if (!e || !e.t || !ISO.test(e.de || "")) return;
      if (Array.isArray(e.classes) && e.classes.length && e.classes.indexOf(c) < 0) return;
      L.push({ t: String(e.t), de: d(e.de, e.h || "07:30"), a: ISO.test(e.a || "") ? d(e.a, "15:30") : null,
               ico: e.vac ? "i-star" : (e.ico || "i-calendar"), q: e.q === "examen" || e.q === "inter" ? e.q : "tous", vac: e.vac ? 1 : 0 });
    });
    var masq = Array.isArray(CC.masquer) ? CC.masquer : [];
    if (masq.length) L = L.filter(function (e) { return masq.indexOf(e.t) < 0; });
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
    if (now > d("2027-06-11", "15:30")) return { t: "Cours terminés · examens officiels et grandes vacances", p: 100 };
    for (var j = 0; j < TRIMESTRES.length; j++) if (now >= TRIMESTRES[j].de && now <= TRIMESTRES[j].a)
      return { t: TRIMESTRES[j].n + (TRIMESTRES[j].n === 1 ? "ᵉʳ" : "ᵉ") + " trimestre · entre deux séquences", p: Math.min(p, 100) };
    return { t: "Entre deux trimestres", p: Math.min(p, 100) };
  }

  function si(n, t) { return A ? A.si(n, t) : ""; }

  /* ---------- 1. calendrier + compte à rebours ---------- */
  var minuteur = null;
  function calendrier(el, c) {
    var now = new Date(), ex = examen(c), L = echeances(c), sit = situation(now);
    var venir = L.filter(function (e) { return (e.a || e.de) > now; });
    /* Le grand compteur : l'examen pour une classe d'examen, sinon les prochaines vacances. */
    var cible = ex ? venir.filter(function (e) { return e.cle; })[0] : venir.filter(function (e) { return e.vac; })[0];
    cible = cible || venir[0];
    /* Une échéance déjà ouverte (épreuves, vacances) : on compte jusqu'à sa fin. */
    var enCours = cible && cible.de <= now && cible.a && cible.a > now;
    var min = function (t) { return t.charAt(0).toLowerCase() + t.slice(1); };
    var titre = !cible ? "Bonne fin d'année"
      : enCours ? (cible.vac ? "Bonnes " + min(cible.t) + " · reprise dans" : "En cours · fin dans")
      : ex && cible.cle ? "Avant le " + ex.nom
      : cible.vac ? "Avant les " + min(cible.t)
      : "Prochaine étape : " + min(cible.t);
    var note = ex
      ? "Décision n° 966/26/MINESEC du 1ᵉʳ oct. 2026, session 2027."
      : "Classe de " + c + " : pas d'examen officiel cette année, mais six séquences et des compositions qui comptent pour le passage.";
    var proch = venir.filter(function (e) { return e !== cible; }).slice(0, 5);
    el.innerHTML =
      '<div class="cal-g">' +
      '<div class="cal-cpt"' + (cible ? ' data-cible="' + (enCours ? cible.a : cible.de).getTime() + '"' : "") + '>' +
        '<p class="cal-sur">' + si("i-clock", 16) + ' ' + esc(titre) + '</p>' +
        (cible ? '<div class="cal-chiffres" role="timer" aria-live="off"><span class="cal-u-j"><b data-u="j">–</b><small>jours</small></span><span><b data-u="h">–</b><small>heures</small></span><span><b data-u="m">–</b><small>min</small></span><span><b data-u="s">–</b><small>s</small></span></div>' +
          trajet(now, enCours ? cible.de : RENTREE, enCours ? cible.a : cible.de, enCours) +
          '<p class="cal-quand">' + si(cible.vac ? "i-star" : "i-calendar", 16) + '<span>' + esc(cible.t) + ' · ' + periode(cible) + '</span></p>' : '<p class="cal-quand">Rentrée 2027-2028 le 6 sept. 2027.</p>') +
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
  /* Le chemin parcouru vers l'échéance (11/11/2026) : de la rentrée à la
     cible, ou du début à la fin d'une échéance déjà ouverte. */
  function trajet(now, de, a, enCours) {
    if (!(a > de)) return "";
    var p = Math.max(0, Math.min(100, Math.round((now - de) / (a - de) * 100)));
    return '<div class="cal-trajet"><div class="cal-trajet-b" role="progressbar" aria-valuenow="' + p + '" aria-valuemin="0" aria-valuemax="100" aria-label="Chemin parcouru"><i style="width:' + p + '%"></i></div>' +
      '<small>' + (enCours ? p + ' % écoulé' : p + ' % du chemin depuis la rentrée') + '</small></div>';
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
      u.s.classList.remove("tic"); void u.s.offsetWidth; u.s.classList.add("tic");
      if (!r) clearInterval(minuteur);
    }
    maj(); minuteur = setInterval(maj, 1000);
  }

  /* ---------- 2. actualités MINESEC ---------- */
  var cache = {};
  function flux(cat) {
    if (cache[cat]) return cache[cat];
    /* 10 s au plus par flux : un flux qui pend ne doit pas laisser l'encart
       sur « Chargement… » ni retenir les actualités du ministère. */
    var lent = new Promise(function (ok) { setTimeout(function () { ok([]); }, 10000); });
    return (cache[cat] = Promise.race([lent, fetch("/api/news_proxy.php?cat=" + cat, { credentials: "omit" })
      .then(function (r) { return r.ok ? r.json() : { items: [] }; })
      .then(function (j) { return (j && j.items) || []; })
      .catch(function () { return []; })]));
  }
  /* Date d'un article : `ts` (secondes, serveur depuis le 11/11/2026), sinon « jj/mm/aaaa ». */
  function quand(x) {
    if (x.ts) return +x.ts * 1000;
    var m = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(x.date || "");
    return m ? new Date(+m[3], +m[2] - 1, +m[1], 12).getTime() : 0;
  }
  function lien(u) { return /^https?:\/\//i.test(u || "") ? u : ""; }
  function actus(el, c) {
    var ex = examen(c), demande = c;
    el.innerHTML = '<p class="act-att">Chargement des actualités…</p>';
    Promise.all([flux("minesec"), ex ? flux(ex.cat) : Promise.resolve([])]).then(function (r) {
      if (demande !== el.getAttribute("data-classe")) return;   // classe changée entre-temps
      /* 11/11/2026 — « Juste les informations pertinentes et plus récentes »
         (Jacques) : en novembre, l'encart montrait les résultats du bac de
         juillet. On ne garde que les 45 derniers jours, on écarte l'actualité
         des AUTRES examens, on fusionne les doublons (même sujet, autre
         journal) et on classe du plus récent au plus ancien. */
      var LIMITE = Date.now() - 45 * 864e5, vus = {}, tout = [];
      var cle = function (t) { return String(t || "").toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9 ]/g, " ").split(/\s+/).filter(function (w) { return w.length > 3; }).slice(0, 6).sort().join(" "); };
      r[1].concat(r[0]).map(function (x) { return { x: x, t: x ? quand(x) : 0 }; })
        .sort(function (a, b) { return b.t - a.t; })                // le plus récent d'abord : c'est lui qui reste d'un doublon
        .forEach(function (o) {
          var x = o.x;
          if (!x || !x.title || !lien(x.link) || !o.t || o.t < LIMITE) return;   // trop ancien, ou sans date
          var mien = ex && ex.mots.test(x.title), autre = !mien && AUTRES.test(x.title);
          if (autre) return;                                       // l'examen d'une autre classe
          var k = cle(x.title); if (vus[k]) return; vus[k] = 1;
          tout.push({ x: x, t: o.t, mien: mien });
        });
      var L = tout.slice(0, 6);
      if (!L.length) {
        el.innerHTML = '<p class="act-vide">Pas d\'actualité récente' + (ex ? ' sur le ' + esc(ex.nom) + ' ni' : '') + ' sur le ministère ces dernières semaines. Les communiqués officiels restent sur <a href="https://www.minesec.gov.cm" target="_blank" rel="noopener">minesec.gov.cm</a>.</p>';
        return;
      }
      el.innerHTML = '<ul class="act-l">' + L.map(function (o) {
        var x = o.x;
        return '<li><a href="' + esc(lien(x.link)) + '" target="_blank" rel="noopener">' +
          (o.mien ? '<span class="act-tag">' + esc(ex.nom) + '</span>' : "") +
          '<b>' + esc(x.title) + '</b><small>' + esc([x.source, x.date].filter(Boolean).join(" · ")) + '</small></a></li>';
      }).join("") + '</ul>' +
      '<p class="act-src">' + "Les 45 derniers jours, du plus récent au plus ancien" + (ex ? ", " + esc(ex.nom) + " et ministère" : "") + ". " + 'Sources de presse ; le texte officiel fait foi sur <a href="https://www.minesec.gov.cm" target="_blank" rel="noopener">minesec.gov.cm</a>.</p>';
      // Les 2 plus récentes, le reste derrière « Voir plus » (12/11/2026).
      if (W.VRT && W.VRT.app && W.VRT.app.replier) W.VRT.app.replier(el.querySelector(".act-l"), 2, "actualités");
    });
  }

  /* ---------- 3. classe virtuelle ---------- */
  function classeVirtuelle(el, c) {
    var ex = examen(c), salons = (Array.isArray(CC.salons) && CC.salons.length) ? CC.salons.map(String) : ["Général", "Annonces", "Français", "Mathématiques", "Sciences"];
    if (CC.cvMasquer) { el.innerHTML = ""; el.hidden = true; return; }
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

  /* ---------- 4. LA SEMAINE DE LA PROGRESSION (26/11/2026) ----------
     « L'apprenant voit ce qu'il va apprendre cette semaine, selon la
     progression et la matière » (Jacques, sur le modèle d'une plateforme
     d'établissement qui préremplit le cahier de textes d'après la progression).

     Les fiches MINESEC (VRT_PROG) donnent le RANG des leçons, jamais leur
     semaine. On la calcule donc, de façon déterministe :
       · les semaines de cours sont celles des séquences 1 à 5 (la 6ᵉ porte les
         compositions de fin d'année), vacances de Noël et de Pâques retirées ;
       · la dernière semaine de chaque séquence est la semaine d'évaluation ;
       · il reste 25 semaines de cours (5 par séquence) : les leçons de chaque
         progression y sont réparties dans l'ordre, à parts égales.
     Un écart réglable par l'admin (cfg.calendrier.decalage, en semaines) décale
     tout le plan si les classes sont en avance ou en retard sur ce rythme.
     C'est une ESTIMATION, et l'écran le dit : la semaine réelle d'une classe
     dépend de son professeur. */
  var JOUR = 86400000;
  /* Lundis des semaines entièrement chômées (cf. echeances()). */
  var VACANCES = [["Vacances de Noël", d("2026-12-21"), d("2027-01-04")], ["Vacances de Pâques", d("2027-03-29"), d("2027-04-12")]];
  var NB_COURS = 0;
  var SEMAINES = (function () {
    var L = [];
    TRIMESTRES.forEach(function (T) {
      T.seq.forEach(function (s) {
        if (s[0] > 5) return;
        var fin = d(s[2], "23:59").getTime(), propres = [];
        for (var t = d(s[1]).getTime(); t <= fin; t += 7 * JOUR) {
          var de = new Date(t), v = VACANCES.filter(function (x) { return de >= x[1] && de < x[2]; })[0];
          var w = { de: de, a: new Date(t + 5 * JOUR), seq: s[0], type: v ? "vac" : "cours", vac: v ? v[0] : "" };
          L.push(w); if (!v) propres.push(w);
        }
        propres[propres.length - 1].type = "eval";
        propres.forEach(function (w, i) { w.rang = i + 1; w.sur = propres.length - 1; if (w.type === "cours") w.k = NB_COURS++; });
      });
    });
    return L;
  })();
  var DECALAGE = Math.round(Number(CC.decalage) || 0);

  /* La semaine de `now` (heure du Cameroun), ou ce qui l'entoure. */
  function semaineDe(now) {
    now = now || new Date();
    if (now < SEMAINES[0].de) return { etat: "avant", w: SEMAINES[0] };
    for (var i = 0; i < SEMAINES.length; i++) {
      var w = SEMAINES[i];
      if (now >= w.de && now < new Date(w.de.getTime() + 7 * JOUR)) return { etat: w.type, w: w, i: i };
    }
    return { etat: "apres", w: SEMAINES[SEMAINES.length - 1] };
  }
  /* Première semaine de cours à partir de l'indice i (pour les vacances). */
  function prochainCours(i) { for (var j = i; j < SEMAINES.length; j++) if (SEMAINES[j].type === "cours") return SEMAINES[j]; return null; }

  /* Index des leçons rédigées : classe|matière|rang → identifiants. */
  var REDIGEES = null;
  function redigee(c, m, L) {
    if (!REDIGEES) {
      REDIGEES = {};
      var LE = W.VRT_LECONS || {};
      Object.keys(LE).forEach(function (k) { var x = LE[k]; if (x && x.n) (REDIGEES[x.c + "|" + x.m + "|" + x.n] = REDIGEES[x.c + "|" + x.m + "|" + x.n] || []).push(k); });
    }
    var ids = REDIGEES[c + "|" + m + "|" + L.n] || [];
    if (ids.length > 1) {   // PCT, SVT… : deux progressions, deux rangs 1 ; on départage par l'intitulé
      var LE2 = W.VRT_LECONS, juste = ids.filter(function (k) { return LE2[k].officiel === L.o; });
      if (juste.length) return juste[0];
    }
    return ids[0] || "";
  }

  /* Plan d'une matière : un tableau de NB_COURS semaines, chacune portant ses leçons. */
  var PLANS = {};
  function plan(c, m) {
    var cle = c + "|" + m;
    if (PLANS[cle]) return PLANS[cle];
    var M = A && A.PAR_ID[m], P = (W.VRT_PROG || {})[c] || {}, sem = [];
    for (var i = 0; i < NB_COURS; i++) sem.push([]);
    if (M) M.minesec.forEach(function (s) {
      var lst = [];
      (P[s] || []).forEach(function (ch) { ch[1].forEach(function (l) { var t = A.titreL(l[1]); if (t) lst.push({ n: l[0], t: t, o: l[1], chap: ch[0] }); }); });
      lst.forEach(function (L, j) {
        L.k = Math.min(NB_COURS - 1, Math.max(0, Math.floor(j * NB_COURS / lst.length) + DECALAGE));
        L.id = redigee(c, m, L);
        sem[L.k].push(L);
      });
    });
    return (PLANS[cle] = sem);
  }

  /* Rang (k) de la première semaine de cours qui n'est pas encore passée. */
  function kCourant(now) {
    var s = semaineDe(now);
    if (s.etat === "avant") return 0;
    if (s.etat === "apres") return NB_COURS;
    if (s.etat === "cours") return s.w.k;
    var p = prochainCours(s.i); return p ? p.k : NB_COURS;
  }
  /* « Où j'en suis » : les leçons RÉDIGÉES des semaines passées, lues ou non. */
  /* Le retard ne porte que sur les 3 dernières semaines, et seulement dans une
     matière que l'élève a commencée : un nouveau venu lisait « 183 leçons à
     rattraper » en 3ᵉ, de quoi décourager au lieu d'entraîner. */
  var FENETRE = 3;
  function bilan(c, m, now) {
    var P = plan(c, m), k = kCourant(now), lus = A ? A.lire("lus", {}) : {}, dues = [], enRetard = [];
    var commence = P.some(function (w) { return w.some(function (L) { return L.id && lus[L.id]; }); });
    for (var i = 0; i < Math.min(k, NB_COURS); i++) P[i].forEach(function (L) {
      if (!L.id) return;
      dues.push(L);
      if (commence && i >= k - FENETRE && !lus[L.id]) enRetard.push(L);
    });
    return { dues: dues, retard: enRetard, cette: k < NB_COURS ? P[k] : [], commence: commence };
  }

  /* Astuces vraies et générales — méthode de travail et technique d'épreuve.
     Aucune statistique, aucun chiffre de réussite : la règle du produit. */
  var ASTUCES = [
    "Lis la leçon la veille du cours : en classe, tu comprends au lieu de découvrir.",
    "Refais le quiz deux jours après la leçon : ce que tu retrouves sans aide, tu le garderas.",
    "Après une leçon, écris en trois lignes ce que tu as retenu, sans regarder. Ce qui manque, relis-le.",
    "Un exercice corrigé refait seul vaut mieux que trois corrigés simplement lus.",
    "Travaille 25 minutes, fais 5 minutes de pause : ta concentration tient mieux que sur deux heures d'affilée.",
    "Note tes erreurs dans un carnet : c'est ta meilleure liste de révision avant l'évaluation.",
    "Explique la leçon à quelqu'un : là où tu bloques, c'est le point à revoir.",
    "Le jour de l'épreuve, lis tout le sujet avant d'écrire, puis commence par ce que tu maîtrises le mieux.",
    "Garde dix minutes à la fin de chaque épreuve pour te relire : accords, unités, signes.",
    "Entraîne-toi sur des sujets des années passées, chronomètre en main, dans la durée réelle de l'épreuve.",
    "Dissertation, commentaire : prépare l'introduction et la conclusion au brouillon avant de rédiger.",
    "En maths et en sciences, encadre tes résultats et écris toujours l'unité.",
    "Une copie aérée se corrige mieux : saute une ligne entre les parties, numérote les questions."
  ];
  var MOTIVE = {
    cours: ["Une leçon par jour, et ta semaine est bouclée avant samedi.", "Ce que tu lis cette semaine, ton professeur l'expliquera : tu auras une longueur d'avance.", "Petit pas chaque jour, grande avance à l'évaluation."],
    eval: ["Semaine d'évaluation : c'est maintenant que tes révisions paient.", "Relis tes fiches, refais les quiz ratés, et dors bien la veille."],
    vac: ["Les vacances, c'est aussi le moment de rattraper sans pression.", "Repose-toi, puis jette un œil à ce qui t'attend à la reprise."],
    avant: ["Prends de l'avance : découvre les premières leçons de l'année."],
    apres: ["Le programme est bouclé : place aux révisions et aux sujets d'examen."]
  };
  function tirage(liste, graine) { var h = 0; for (var i = 0; i < graine.length; i++) h = (h * 31 + graine.charCodeAt(i)) >>> 0; return liste[h % liste.length]; }
  function courtD(t) { var x = new Date(t.getTime() + 3600000); return x.getUTCDate() + (x.getUTCDate() === 1 ? "ᵉʳ" : "") + " " + MOIS[x.getUTCMonth()]; }

  /* En-tête illustré, au dessin des chapitres de la page matière (modele.css,
     .chap-n) : tuile en dégradé de la teinte, point doré, icône d'origine du
     site (veritas-icons.svg), surtitre en capitales, titre souligné. */
  function entete(ico, k, sur, titre, sous, tag) {
    tag = tag || "h2";
    return '<div class="vt" style="--k:' + k + '"><span class="vt-n">' + si(ico, 24) + '</span><div class="vt-x">' + (sur ? '<small>' + esc(sur) + '</small>' : '') +
      '<' + tag + '>' + esc(titre) + '</' + tag + '>' + (sous ? '<p>' + esc(sous) + '</p>' : '') + '</div></div>';
  }
  var ICO_ETAT = { cours: ["i-calendar", "#1E499B"], eval: ["i-clipboard-check", "#B03A6E"], vac: ["i-sparkle", "#0E7C86"], avant: ["i-school", "#1E499B"], apres: ["i-graduation", "#5B4FA8"] };

  /* ---------- 5. « MA SEMAINE » (accueil d'Apprendre) ---------- */
  function maSemaine(el, c) {
    if (!el || !A || !NB_COURS) return;
    var now = new Date(), s = semaineDe(now), lus = A.lire("lus", {}), qz = A.lire("quiz", {}), LE = W.VRT_LECONS || {};
    var ex = examen(c), k = kCourant(now);
    /* Les matières de la classe qui ont une progression. */
    var mats = mesMatieres(c);
    if (!mats.length) { el.hidden = true; return; }
    var titre, sous;
    if (s.etat === "cours") { titre = "Cette semaine"; sous = "Du " + courtD(s.w.de) + " au " + courtD(s.w.a) + " · séquence " + s.w.seq + " · semaine " + s.w.rang + " sur " + s.w.sur; }
    else if (s.etat === "eval") { titre = "Semaine d'évaluation"; sous = "Du " + courtD(s.w.de) + " au " + courtD(s.w.a) + " · fin de la séquence " + s.w.seq + " : on révise"; }
    else if (s.etat === "vac") { var r = prochainCours(s.i); titre = s.w.vac; sous = r ? "Reprise le lundi " + courtD(r.de) + " : voici ce qui t'attend" : ""; }
    else if (s.etat === "avant") { titre = "La rentrée approche"; sous = "Rentrée le lundi " + courtD(SEMAINES[0].de) + " : voici les premières leçons"; }
    else { titre = "Programme de l'année bouclé"; sous = "Place aux révisions et aux sujets d'examen"; }

    var lignes = [], nbSem = 0, nbLues = 0, nbRetard = 0, verrous = 0;
    mats.forEach(function (m) {
      var b = bilan(c, m.id, now); nbRetard += b.retard.length;
      var st = 'style="--c:' + m.t[0] + ';--cp:' + m.t[1] + '"', base = "matiere.html?c=" + encodeURIComponent(c) + "&m=" + m.id;
      if (s.etat === "eval" || s.etat === "apres") {
        /* Révision : les leçons rédigées de la séquence qui se termine (ou de toute l'année). */
        var de = s.etat === "apres" ? 0 : NB_COURS, a = 0;
        if (s.etat === "eval") SEMAINES.forEach(function (w) { if (w.seq === s.w.seq && w.type === "cours") { de = Math.min(de, w.k); a = Math.max(a, w.k + 1); } });
        else a = NB_COURS;
        var red = []; plan(c, m.id).slice(de, a).forEach(function (x) { x.forEach(function (L) { if (L.id) red.push(L); }); });
        if (!red.length) return;
        var lu = red.filter(function (L) { return lus[L.id]; }).length, ratee = red.filter(function (L) { var q = qz[L.id]; return q && q[0] < Math.ceil(q[1] * .6); })[0];
        var cible = ratee || red.filter(function (L) { return !lus[L.id]; })[0] || red[0];
        lignes.push('<a class="ms-l" ' + st + ' href="lecon.html?id=' + cible.id + '"><span class="ms-m">' + A.icoM(m, 26) + '</span><span class="ms-x"><small>' + esc(m.nom) + '</small><b>' +
          (ratee ? 'Refais le quiz : ' + esc(ratee.t) : lu < red.length ? 'À revoir : ' + esc(cible.t) : 'Tout est lu : refais un quiz') + '</b><em>' + red.length + ' leçon' + (red.length > 1 ? 's' : '') + ' à réviser · ' + lu + ' lue' + (lu > 1 ? 's' : '') + '</em></span><span class="ms-e' + (lu === red.length ? ' ok' : '') + '">' + (lu === red.length ? 'Prêt' : 'Réviser') + '</span></a>');
        return;
      }
      var kk = s.etat === "vac" ? (prochainCours(s.i) || {}).k : s.etat === "avant" ? 0 : k;
      var L0 = plan(c, m.id)[kk] || [];
      if (!L0.length) return;
      nbSem += L0.length;
      L0.forEach(function (L) { if (L.id && lus[L.id]) nbLues++; if (L.id && LE[L.id].verrou) verrous++; });
      var L = L0.filter(function (x) { return x.id && !lus[x.id]; })[0] || L0.filter(function (x) { return x.id; })[0] || L0[0];
      var href = L.id ? "lecon.html?id=" + L.id : base + "#l" + L.n;
      var etat = !L.id ? '<span class="ms-e av">Au programme</span>'
        : lus[L.id] ? '<span class="ms-e ok">' + (qz[L.id] ? 'Quiz ' + qz[L.id][0] + '/' + qz[L.id][1] : 'Lue') + '</span>'
        : LE[L.id].verrou ? '<span class="ms-e red">Début offert</span>' : '<span class="ms-e">À lire</span>';
      lignes.push('<a class="ms-l" ' + st + ' href="' + href + '"><span class="ms-m">' + A.icoM(m, 26) + '</span><span class="ms-x"><small>' + esc(m.nom) + '</small><b>' + esc(L.t) + '</b>' +
        (L0.length > 1 ? '<em>et ' + (L0.length - 1) + ' autre' + (L0.length > 2 ? 's' : '') + ' leçon' + (L0.length > 2 ? 's' : '') + ' cette semaine</em>' : '') + '</span>' + etat + '</a>');
    });

    var puces = [];
    if (nbSem) puces.push('<span class="ms-p"><b>' + nbSem + '</b> leçon' + (nbSem > 1 ? 's' : '') + (s.etat === "vac" ? ' à la reprise' : s.etat === "avant" ? ' pour commencer' : ' cette semaine') + '</span>');
    if (nbLues) puces.push('<span class="ms-p ok"><b>' + nbLues + '</b> déjà lue' + (nbLues > 1 ? 's' : '') + '</span>');
    if (nbRetard) puces.push('<span class="ms-p re"><b>' + nbRetard + '</b> leçon' + (nbRetard > 1 ? 's' : '') + ' à rattraper</span>');
    if (ex) { var S = SESSION[ex.nom], j = jours(d(S.ecrit[0], "07:30") - now); if (j > 0) puces.push('<span class="ms-p ex">J-' + j + ' avant le ' + esc(ex.nom) + '</span>'); }

    var graine = c + (s.w ? s.w.de.toISOString().slice(0, 10) : "");
    var astuce = tirage(ASTUCES, graine), motive = tirage(MOTIVE[s.etat] || MOTIVE.cours, graine + "m");
    /* L'abonnement, au moment où il sert : quand une leçon de CETTE semaine ne montre que son début. */
    var cta = verrous
      ? '<div class="ms-ab">' + entete("i-key", "#5B4FA8", "Abonnement", "Débloque ta semaine", "", "h3") + '<p><b>Cette semaine, ' + verrous + ' leçon' + (verrous > 1 ? 's ne montrent' : ' ne montre') + ' que ' + (verrous > 1 ? 'leur' : 'son') + ' début.</b> Avec l\'abonnement, tu lis chaque leçon en entier, toute l\'année, et tu ne prends jamais de retard.</p><a class="ms-go" href="/app.html#abonnement">Je débloque ma semaine</a></div>'
      : '<div class="ms-ab doux">' + entete("i-award", "#5B4FA8", "Abonnement", "Va plus loin", "", "h3") + '<p>Envie d\'aller plus loin que la leçon ? Découvre ce que l\'abonnement ajoute pour ta classe.</p><a class="ms-go" href="/#tarifs">Voir l\'abonnement</a></div>';

    var ie = ICO_ETAT[s.etat] || ICO_ETAT.cours;
    el.innerHTML = '<div class="ms-t">' + entete(ie[0], ie[1], "Ma semaine", titre, sous) +
      (puces.length ? '<div class="ms-ps">' + puces.join("") + '</div>' : '') + '</div>' +
      '<p class="ms-mot">' + esc(motive) + '</p>' +
      (lignes.length ? '<div class="ms-g">' + lignes.join("") + '</div>' : '<p class="ms-vide">Rien de prévu pour ta classe cette semaine.</p>') +
      '<div class="ms-pied"><div class="ms-as">' + entete("i-lightbulb", "#B8860B", "Astuce de la semaine", "Le bon réflexe", "", "h3") + '<p>' + esc(astuce) + '</p></div>' + cta + '</div>' +
      '<p class="ms-note">Semaine estimée d\'après la progression officielle du MINESEC et le calendrier 2026-2027 : ton professeur peut avoir un peu d\'avance ou de retard.</p>';
    el.hidden = false;
    if (A.replier) A.replier(el.querySelector(".ms-g"), 6, "matières");
  }

  /* ---------- 6. MON EMPLOI DU TEMPS DE RÉVISION (26/11/2026) ----------
     « Fais-lui une proposition d'emploi du temps pour mieux réviser ; il peut
     le régler selon ses cours à l'école » (Jacques).
     Proposition calculée à partir de « Ma semaine » : chaque leçon de la
     semaine donne une lecture (20 min) et, si elle est rédigée, un quiz
     (10 min) ; les leçons en retard s'ajoutent (3 au plus). L'élève règle :
       · ses créneaux, jour par jour (heure et durée, ou repos) ;
       · les jours où chaque matière a cours à l'école : la lecture se place
         alors LA VEILLE du cours, le quiz le lendemain.
     Tout reste dans ce navigateur (A.lire / A.ecrire), comme la progression. */
  var JOURS = ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"];
  var JOURS_L = ["lundi", "mardi", "mercredi", "jeudi", "vendredi", "samedi", "dimanche"];
  var EDT_DEFAUT = [{ h: "17:00", min: 60 }, { h: "17:00", min: 60 }, { h: "15:00", min: 60 }, { h: "17:00", min: 60 }, { h: "17:00", min: 45 }, { h: "09:00", min: 90 }, { h: "16:00", min: 45 }];
  function reglages() {
    var r = A.lire("edt", null);
    if (!r || !Array.isArray(r.jours) || r.jours.length !== 7) r = { jours: EDT_DEFAUT.slice(), cours: {} };
    r.cours = r.cours && typeof r.cours === "object" ? r.cours : {};
    return r;
  }
  /* « Mes matières » : en 3ᵉ, la progression en compte 22 (latin, allemand,
     chinois…) ; personne ne les suit toutes. Par défaut, le tronc commun ;
     l'élève ajoute ses options dans les réglages. */
  var TRONC = ["francais", "anglais", "maths", "pct", "physique", "chimie", "svt", "histoire", "geo", "ecm", "philo", "info", "sciences"];
  function mesMatieres(c) {
    var R = reglages(), sel = Array.isArray(R.mats) && R.mats.length ? R.mats : TRONC;
    var dispo = A.MATIERES.filter(function (m) { return plan(c, m.id).some(function (x) { return x.length; }); });
    var r = dispo.filter(function (m) { return sel.indexOf(m.id) >= 0; });
    return r.length ? r : dispo;
  }
  function dureeL(m) { return m >= 60 ? Math.floor(m / 60) + " h" + (m % 60 ? " " + (m % 60) : "") : m + " min"; }
  function heures() { var L = []; for (var h = 6; h <= 21; h++) { L.push(("0" + h).slice(-2) + ":00"); L.push(("0" + h).slice(-2) + ":30"); } return L; }

  /* Les tâches de la semaine, dans l'ordre des matières. */
  function taches(c, now) {
    var s = semaineDe(now), LE = W.VRT_LECONS || {}, lus = A.lire("lus", {}), T = [];
    var mats = mesMatieres(c);
    var k = s.etat === "vac" ? (prochainCours(s.i) || {}).k : s.etat === "avant" ? 0 : kCourant(now);
    var retard = [];
    mats.forEach(function (m) {
      var base = "matiere.html?c=" + encodeURIComponent(c) + "&m=" + m.id;
      if (s.etat === "eval") {
        var red = []; SEMAINES.forEach(function (w) { if (w.seq === s.w.seq && w.type === "cours") plan(c, m.id)[w.k].forEach(function (L) { if (L.id) red.push(L); }); });
        red.filter(function (L) { return !lus[L.id]; }).concat(red.filter(function (L) { return lus[L.id]; })).slice(0, 1).forEach(function (L) {
          T.push({ m: m, cle: "r" + L.id, t: "Réviser : " + L.t, h: "lecon.html?id=" + L.id, min: 20, type: "rev" });
        });
        return;
      }
      if (k === undefined || k >= NB_COURS) return;
      plan(c, m.id)[k].slice(0, ["francais", "maths", "anglais"].indexOf(m.id) >= 0 ? 2 : 1).forEach(function (L) {
        T.push({ m: m, cle: "l" + (L.id || m.id + L.n), t: (L.id ? "Lire : " : "Découvrir : ") + L.t, h: L.id ? "lecon.html?id=" + L.id : base + "#l" + L.n, min: 20, type: "lire" });
        if (L.id && LE[L.id] && LE[L.id].quiz && LE[L.id].quiz.length) T.push({ m: m, cle: "q" + L.id, t: "Quiz : " + L.t, h: "lecon.html?id=" + L.id + "#quiz", min: 10, type: "quiz" });
      });
      bilan(c, m.id, now).retard.forEach(function (L) { retard.push({ m: m, cle: "t" + L.id, t: "Rattraper : " + L.t, h: "lecon.html?id=" + L.id, min: 20, type: "ratt" }); });
    });
    return T.concat(retard.slice(0, 3));
  }

  /* Placement : lecture la veille du cours, quiz le lendemain, le reste en tourniquet. */
  function placer(T, R) {
    var jours = R.jours.map(function (j) { return { cap: j && j.min ? j.min : 0, t: [] }; }), reste = [];
    function poser(tache, ordre) {
      for (var i = 0; i < ordre.length; i++) { var j = jours[ordre[i]]; if (j.cap >= tache.min) { j.cap -= tache.min; j.t.push(tache); tache.jour = ordre[i]; return true; } }
      return false;
    }
    function autour(d0) { var o = [d0]; for (var e = 1; e < 7; e++) { o.push((d0 - e + 7) % 7); o.push((d0 + e) % 7); } return o.filter(function (x, i, a) { return a.indexOf(x) === i; }); }
    var lecture = {};
    T.forEach(function (x) {
      var cours = R.cours[x.m.id];
      if (x.type === "lire" && cours && cours.length) {
        var veille = (Math.min.apply(null, cours) + 6) % 7;
        if (poser(x, autour(veille))) { lecture[x.cle.slice(1)] = x.jour; return; }
      }
      if (x.type === "quiz" && lecture[x.cle.slice(1)] !== undefined) {
        if (poser(x, autour((lecture[x.cle.slice(1)] + 2) % 7))) return;
      }
      x._libre = true;
    });
    /* Tourniquet : on alterne les matières, un jour après l'autre. */
    var libres = T.filter(function (x) { return x._libre; }), d = 0;
    libres.forEach(function (x) {
      var ok = false;
      for (var e = 0; e < 7 && !ok; e++) { var j = (d + e) % 7; if (jours[j].cap >= x.min) { ok = poser(x, [j]); d = (j + 1) % 7; } }
      if (!ok) reste.push(x);
      delete x._libre;
    });
    return { jours: jours, reste: reste };
  }

  function edtRevision(el, c) {
    if (!el || !A || !NB_COURS) return;
    var now = new Date(), s = semaineDe(now), R = reglages(), T = taches(c, now);
    if (!T.length) { el.hidden = true; return; }
    var P = placer(T, R), cleSem = (s.w ? s.w.de.toISOString().slice(0, 10) : "x") + "|" + c, fait = A.lire("edtFait", {});
    var auj = (new Date(now.getTime() + 3600000).getUTCDay() + 6) % 7;
    var lundi = s.etat === "vac" ? (prochainCours(s.i) || s.w).de : s.w.de;
    var tot = T.length, nf = T.filter(function (x) { return fait[cleSem + "|" + x.cle]; }).length;
    var cols = P.jours.map(function (j, i) {
      var r = R.jours[i], dt = new Date(lundi.getTime() + i * JOUR);
      var tete = '<div class="edt-h"><b>' + JOURS[i] + ' ' + new Date(dt.getTime() + 3600000).getUTCDate() + '</b><small>' + (r && r.min ? r.h.replace(":", " h ") + ' · ' + dureeL(r.min) : 'repos') + '</small></div>';
      var corps = j.t.length ? j.t.map(function (x) {
        var k = cleSem + "|" + x.cle, ok = !!fait[k];
        return '<label class="edt-t' + (ok ? ' fait' : '') + '" style="--c:' + x.m.t[0] + ';--cp:' + x.m.t[1] + '"><input type="checkbox" data-edt="' + esc(k) + '"' + (ok ? ' checked' : '') + '>' +
          '<span><small>' + esc(x.m.nom) + ' · ' + x.min + ' min</small><a href="' + x.h + '">' + esc(x.t) + '</a></span></label>';
      }).join("") : '<p class="edt-v">' + (r && r.min ? 'Créneau libre : refais un quiz au choix.' : 'Repos. Profites-en.') + '</p>';
      return '<div class="edt-j' + (i === auj && s.etat !== "vac" && s.etat !== "avant" ? ' auj' : '') + (r && r.min ? '' : ' off') + '">' + tete + corps + '</div>';
    }).join("");

    var M = mesMatieres(c), TOUTES = A.MATIERES.filter(function (m) { return plan(c, m.id).some(function (x) { return x.length; }); });
    var H = heures();
    var reg = '<details class="edt-reg"><summary>' + si("i-tool", 18) + 'Régler mon emploi du temps</summary>' +
      '<div class="edt-rg"><div><p class="edt-rt">Mes créneaux de révision</p>' + JOURS_L.map(function (n, i) {
        var r = R.jours[i];
        return '<div class="edt-rl"><span>' + n.charAt(0).toUpperCase() + n.slice(1) + '</span><select data-edt-h="' + i + '" aria-label="Heure du ' + n + '"><option value="">Pas de révision</option>' +
          H.map(function (h) { return '<option' + (r && r.min && r.h === h ? ' selected' : '') + '>' + h + '</option>'; }).join("") + '</select>' +
          '<select data-edt-m="' + i + '" aria-label="Durée du ' + n + '"' + (r && r.min ? '' : ' disabled') + '>' + [30, 45, 60, 90, 120].map(function (m) { return '<option value="' + m + '"' + (r && r.min === m ? ' selected' : '') + '>' + dureeL(m) + '</option>'; }).join("") + '</select></div>';
      }).join("") + '</div>' +
      '<div><p class="edt-rt">Mes matières</p><p class="edt-ri">Touche une matière pour l\'ajouter ou la retirer de ta semaine.</p><div class="edt-mats">' +
      TOUTES.map(function (m) { return '<button type="button" data-edt-mat="' + m.id + '" style="--c:' + m.t[0] + ';--cp:' + m.t[1] + '" aria-pressed="' + M.some(function (x) { return x.id === m.id; }) + '">' + esc(m.nom) + '</button>'; }).join("") + '</div>' +
      '<p class="edt-rt" style="margin-top:14px">Mes cours à l\'école</p><p class="edt-ri">Touche les jours où tu as chaque matière : tu liras la leçon la veille et feras le quiz après le cours.</p>' +
      M.map(function (m) {
        var cj = R.cours[m.id] || [];
        return '<div class="edt-rm"><span style="--c:' + m.t[0] + '">' + esc(m.nom) + '</span><span class="edt-ch">' + JOURS.slice(0, 6).map(function (n, i) {
          return '<button type="button" data-edt-c="' + m.id + '" data-j="' + i + '" aria-pressed="' + (cj.indexOf(i) >= 0) + '">' + n.charAt(0) + '</button>';
        }).join("") + '</span></div>';
      }).join("") + '</div></div>' +
      '<button type="button" class="edt-raz" data-edt-raz>Revenir à la proposition</button></details>';

    el.innerHTML = '<div class="ms-t">' + entete("i-clock", "#0E7C86", "Mon emploi du temps de révision", s.etat === "eval" ? "Ma semaine de révision" : "Ma semaine, heure par heure",
      "Une proposition faite d'après tes leçons de la semaine. Règle-la selon tes cours à l'école.") +
      '<div class="ms-ps"><span class="ms-p' + (nf === tot ? ' ok' : '') + '"><b>' + nf + '/' + tot + '</b> fait' + (nf > 1 ? 's' : '') + '</span></div></div>' +
      '<p class="ms-mot">' + esc(nf === tot ? "Semaine bouclée. Tu peux être fier de toi." : nf ? "Bien parti : coche au fur et à mesure, c'est motivant de voir la colonne se remplir." : "Un créneau fixe chaque jour devient vite une habitude : tu n'auras plus à te forcer.") + '</p>' +
      '<div class="edt-g">' + cols + '</div>' +
      (P.reste.length ? '<p class="edt-reste"><b>' + P.reste.length + ' tâche' + (P.reste.length > 1 ? 's' : '') + ' sans créneau</b> (' + P.reste.slice(0, 2).map(function (x) { return '<a href="' + x.h + '">' + esc(x.m.nom) + '</a>'; }).join(", ") + (P.reste.length > 2 ? '…' : '') + ') : allonge un créneau ou ajoute un jour.</p>' : '') +
      reg;
    el.hidden = false;

    /* Écouteurs : posés une fois, délégués. */
    if (!el.getAttribute("data-edt-ok")) {
      el.setAttribute("data-edt-ok", "1");
      var refaire = function () { var o = el.querySelector(".edt-reg"), ouvert = o && o.open; edtRevision(el, el.getAttribute("data-classe")); maSemaine(document.getElementById("maSemaine"), el.getAttribute("data-classe")); var n = el.querySelector(".edt-reg"); if (n && ouvert) n.open = true; };
      el.addEventListener("change", function (e) {
        var t = e.target, R2 = reglages();
        if (t.hasAttribute("data-edt")) { var f = A.lire("edtFait", {}); if (t.checked) f[t.getAttribute("data-edt")] = 1; else delete f[t.getAttribute("data-edt")]; A.ecrire("edtFait", f); refaire(); return; }
        if (t.hasAttribute("data-edt-h")) { var i = +t.getAttribute("data-edt-h"); R2.jours[i] = t.value ? { h: t.value, min: (R2.jours[i] && R2.jours[i].min) || 60 } : null; A.ecrire("edt", R2); refaire(); return; }
        if (t.hasAttribute("data-edt-m")) { var i2 = +t.getAttribute("data-edt-m"); if (R2.jours[i2]) { R2.jours[i2].min = +t.value; A.ecrire("edt", R2); refaire(); } }
      });
      el.addEventListener("click", function (e) {
        var b = e.target.closest ? e.target.closest("[data-edt-c],[data-edt-raz],[data-edt-mat]") : null; if (!b) return;
        var R3 = reglages();
        if (b.hasAttribute("data-edt-raz")) { A.ecrire("edt", { jours: EDT_DEFAUT.slice(), cours: {} }); refaire(); return; }
        if (b.hasAttribute("data-edt-mat")) {
          var cl = el.getAttribute("data-classe"), ids = mesMatieres(cl).map(function (x) { return x.id; }), id = b.getAttribute("data-edt-mat");
          ids = ids.indexOf(id) >= 0 ? ids.filter(function (x) { return x !== id; }) : ids.concat([id]);
          if (!ids.length) return;
          R3.mats = ids; A.ecrire("edt", R3); refaire(); return;
        }
        var m = b.getAttribute("data-edt-c"), j = +b.getAttribute("data-j"), L = R3.cours[m] || [];
        R3.cours[m] = L.indexOf(j) >= 0 ? L.filter(function (x) { return x !== j; }) : L.concat([j]);
        A.ecrire("edt", R3); refaire();
      });
    }
    el.setAttribute("data-classe", c);
  }

  W.VRT = W.VRT || {};
  W.VRT.annee = { SESSION: SESSION, rendre: rendre, echeances: echeances, examen: examen, situation: situation,
    SEMAINES: SEMAINES, NB_COURS: NB_COURS, semaineDe: semaineDe, plan: plan, bilan: bilan, kCourant: kCourant, maSemaine: maSemaine, edtRevision: edtRevision };
})(window);
