/* VÉRITAS — Apprendre : le tuteur IA (Prof. Ambassa) au pied de chaque leçon.
   L'élève pose une question sur la leçon qu'il lit ; la question part vers
   api/ia_proxy.php avec le texte de la leçon (ce que l'élève voit, rien de plus)
   et le jeton du compte, sa place dans la progression MINESEC (déjà vu / à venir),
   ses objectifs et sa compétence APC. Le serveur ajoute le calibrage de la classe
   et de la matière (ia_calibrage_tuteur). Le SERVEUR fixe aussi le quota du jour d'après la formule
   (table des droits, vrt_droits_formules) : 2 questions par jour sans compte,
   5 avec un compte gratuit ou Starter, 30 en Pro, 100 en Élite et Famille,
   40 / 80 / 150 pour les formules enseignant. Rien n'est compté ici : un
   compteur dans le navigateur se remet à zéro d'un clic.
   Une réponse de refus (429) ne se retente jamais : l'hébergeur bannit une IP
   à six refus par minute, et une classe entière partage une IP. */
(function (W) {
  "use strict";
  var API = "/api/ia_proxy.php", MAXQ = 600, MAXCTX = 7000;
  var PALIERS = { anon: "sans compte", free: "compte gratuit", starter: "Starter", pro: "Pro", elite: "Élite", famille: "Famille",
    prof3: "Prof 3 classes", prof6: "Prof 6 classes", proftout: "Prof toutes classes", teach: "Enseignant", admin: "Administration" };
  var IDEES = ["Explique-moi cette leçon autrement", "Donne-moi un exemple tiré de la vie au Cameroun", "Pose-moi un petit exercice et corrige-le"];

  function jeton() { try { return W.localStorage.getItem("vrt_app_jeton") || W.sessionStorage.getItem("_vrtCT") || ""; } catch (e) { return ""; } }

  /* Texte brut d'un fragment HTML de la leçon (formules et schémas SVG exclus). */
  function texte(html) {
    var d = document.createElement("div");
    d.innerHTML = String(html || "");
    [].forEach.call(d.querySelectorAll("svg,script,style"), function (n) { n.remove(); });
    return (d.textContent || "").replace(/\s+/g, " ").trim();
  }

  /* La leçon telle que l'élève la voit : un abonné envoie la leçon entière,
     un visiteur seulement le début public — le tuteur ne livre pas la suite payante. */
  function contexte(L, M) {
    var t = ["LEÇON : " + L.titre, "CLASSE : " + L.c, "MATIÈRE : " + (M && M.nom || L.m)];
    if (L.chap) t.push("CHAPITRE : " + L.chap);
    if (L.objectifs) t.push("OBJECTIFS : " + L.objectifs.map(texte).join(" ; "));
    if (L.intro) t.push(texte(L.intro));
    (L.parties || []).forEach(function (p) {
      if (p.verrou) return;
      t.push("— " + p.t + " — " + texte(p.html) + (p.retenir ? " À retenir : " + texte(p.retenir) : ""));
    });
    if (!L.verrou && L.revision && L.revision.length) t.push("FICHE DE RÉVISION : " + L.revision.map(texte).join(" ; "));
    var s = t.join("\n");
    return s.length > MAXCTX ? s.slice(0, MAXCTX) + "…" : s;
  }

  /* PLACE DE LA LEÇON DANS LA PROGRESSION HARMONISÉE (VRT_PROG, MINESEC) :
     les leçons déjà vues (ce que l'élève est censé savoir) et celles qui
     suivent (à ne pas supposer acquises). Les séances d'intégration,
     d'évaluation et de remédiation ne sont pas des notions : on les saute. */
  var PAS_NOTION = /int[ée]gration|[ée]valuation|r[ée]m[ée]diation|revision|révision/i;
  function progression(L, M) {
    var out = { avant: [], apres: [], chap: L.chap || "", officiel: L.officiel || "", rang: L.n && L.n < 900 ? L.n : 0 };
    if (!out.rang || !M || !M.minesec) return out;
    var P = (W.VRT_PROG || {})[L.c] || {}, liste = [];
    M.minesec.some(function (cle) {
      var t = [];
      (P[cle] || []).forEach(function (ch) { (ch[1] || []).forEach(function (l) { t.push({ n: l[0], t: String(l[1] || ""), ch: ch[0] }); }); });
      if (t.some(function (x) { return x.n === out.rang; })) { liste = t; return true; }
      return false;
    });
    var i = -1;
    liste.forEach(function (x, k) { if (i < 0 && x.n === out.rang) i = k; });
    if (i < 0) return out;
    function court(x) { return x.t.length > 110 ? x.t.slice(0, 110) + "…" : x.t; }
    out.avant = liste.slice(0, i).filter(function (x) { return !PAS_NOTION.test(x.t); }).slice(-6).map(court);
    out.apres = liste.slice(i + 1).filter(function (x) { return !PAS_NOTION.test(x.t); }).slice(0, 3).map(court);
    return out;
  }

  /* Consignes PROPRES À LA LEÇON. Le niveau de la classe, l'examen visé et les
     critères de la matière sont ajoutés par le serveur (ia_calibrage_tuteur). */
  function consignes(L, M) {
    var pg = progression(L, M), t = [];
    t.push("TUTEUR DE LEÇON — espace Apprendre de VÉRITAS.");
    t.push("Tu réponds à un élève de " + L.c + " qui lit la leçon « " + L.titre + " » (" + (M && M.nom || L.m) + ").");
    t.push("PROGRAMME (progression harmonisée MINESEC) :");
    if (pg.chap) t.push("• Module / chapitre : " + pg.chap);
    if (pg.officiel) t.push("• Leçon " + pg.rang + " de la progression : " + pg.officiel);
    if (L.objectifs && L.objectifs.length) t.push("• Objectifs : à la fin, l'élève sait " + L.objectifs.map(texte).join(" ; ") + ".");
    if (L.apc) t.push("• Compétence visée (APC) — situation de vie : " + texte(L.apc.situation) + " Tâche : " + texte(L.apc.tache));
    t.push("PROGRESSION :");
    t.push(pg.avant.length ? "• Déjà vu cette année (prérequis utilisables) : " + pg.avant.join(" | ") : "• Début de la progression de la matière : ne suppose aucun acquis de cette année.");
    if (pg.apres.length) t.push("• À venir (ne pas supposer acquis) : " + pg.apres.join(" | "));
    t.push("RÈGLES :");
    t.push("• Appuie-toi d'abord sur le texte de la leçon fourni en contexte : mêmes définitions, mêmes notations, même vocabulaire.");
    t.push("• Tutoiement bienveillant ; termine par une courte question ou un mini-défi pour vérifier que l'élève a compris.");
    t.push("• Si la question sort de la leçon ou de l'école, réponds brièvement puis ramène l'élève à la leçon.");
    t.push("• Mise en forme simple : paragraphes, listes « - », **gras** pour les mots-clés. Pas de tableau, pas de LaTeX : écris les formules en clair (x², √, ≤).");
    return t.join("\n");
  }

  /* L'échange précédent accompagne la question suivante (« explique encore »,
     « et pour la question 2 ? ») : sans lui, le tuteur repart de zéro. */
  function avecSuite(question, dernier) {
    if (!dernier) return question;
    var r = String(dernier.r || "");
    return "ÉCHANGE PRÉCÉDENT — l'élève : « " + dernier.q.slice(0, 300) + " » ; toi : « " + (r.length > 700 ? r.slice(0, 700) + "…" : r) + " »\n\n" +
      "NOUVELLE QUESTION DE L'ÉLÈVE : " + question;
  }

  /* Rendu SÛR de la réponse : tout est échappé, puis seuls **gras**, listes et paragraphes sont rétablis. */
  function rendu(s, esc) {
    var lignes = esc(String(s || "").trim()).split(/\n/), out = [], liste = false;
    lignes.forEach(function (l) {
      l = l.replace(/\*\*(.+?)\*\*/g, "<b>$1</b>").replace(/^#{1,4}\s*/, "");
      var m = /^\s*(?:[-•*]|\d+[.)])\s+(.*)$/.exec(l);
      if (m) { if (!liste) { out.push("<ul>"); liste = true; } out.push("<li>" + m[1] + "</li>"); return; }
      if (liste) { out.push("</ul>"); liste = false; }
      if (l.trim()) out.push("<p>" + l + "</p>");
    });
    if (liste) out.push("</ul>");
    return out.join("");
  }

  function libQuota(q) {
    if (!q || typeof q.limit !== "number") return "";
    var nom = PALIERS[q.tier] || q.tier || "";
    if (q.limit < 0) return "Questions illimitées (" + nom + ").";
    var reste = Math.max(0, q.limit - (q.used || 0));
    return "Il te reste " + reste + " question" + (reste > 1 ? "s" : "") + " aujourd'hui sur " + q.limit + " (" + nom + ").";
  }

  function monter(racine, L, M, A) {
    if (!racine || !L) return;
    var esc = A.esc, connecte = !!jeton();
    var sec = document.createElement("section");
    sec.className = "tuteur";
    sec.setAttribute("aria-labelledby", "tuteurT");
    sec.innerHTML =
      '<div class="tuteur-t"><img src="../ambassa-avatar.png" alt="" width="44" height="44" loading="lazy">' +
      '<div><h2 id="tuteurT">Une question sur la leçon ?</h2><p>Le Prof. Ambassa, ton tuteur IA, t\'explique autrement, avec un exemple ou un exercice corrigé.</p></div></div>' +
      '<div class="tuteur-idees">' + IDEES.map(function (i) { return '<button type="button" class="btn-l" data-idee>' + esc(i) + '</button>'; }).join("") + '</div>' +
      '<form class="tuteur-f" novalidate><label class="vsr" for="tuteurQ">Ta question</label>' +
      '<textarea id="tuteurQ" rows="3" maxlength="' + MAXQ + '" placeholder="Ex. : je ne comprends pas la deuxième partie, peux-tu me la réexpliquer ?"></textarea>' +
      '<div class="tuteur-b"><span class="tuteur-n" aria-live="polite">' + (connecte ? "" : "Sans compte : 2 questions par jour. Connecte-toi pour en avoir plus.") + '</span>' +
      '<button type="submit" class="tuteur-go">Demander</button></div></form>' +
      '<div class="tuteur-r" aria-live="polite" hidden></div>';
    racine.appendChild(sec);

    var f = sec.querySelector("form"), q = sec.querySelector("textarea"), go = sec.querySelector(".tuteur-go"),
        rep = sec.querySelector(".tuteur-r"), note = sec.querySelector(".tuteur-n"), bloque = false, dernier = null;

    [].forEach.call(sec.querySelectorAll("[data-idee]"), function (b) {
      b.addEventListener("click", function () { q.value = b.textContent; q.focus(); });
    });

    function afficher(html, classe) { rep.hidden = false; rep.className = "tuteur-r" + (classe ? " " + classe : ""); rep.innerHTML = html; }

    f.addEventListener("submit", function (ev) {
      ev.preventDefault();
      var question = q.value.trim();
      if (go.disabled || bloque) return;
      if (question.length < 3) { q.focus(); return; }
      go.disabled = true; go.textContent = "Ambassa réfléchit…";
      afficher('<p class="tuteur-att">Le Prof. Ambassa prépare sa réponse…</p>');
      var corps = { prompt: avecSuite(question.slice(0, MAXQ), dernier), sysPrompt: consignes(L, M), ragContext: contexte(L, M),
        action: "apprendre_tuteur", classe: L.c, matiere: L.m, userId: "", plan: connecte ? "compte" : "anon" };
      var t = jeton(); if (t) corps.token = t;
      fetch(API, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(corps) })
        .then(function (r) { return r.json().catch(function () { return {}; }).then(function (j) { return { code: r.status, j: j || {} }; }); })
        .then(function (o) {
          var j = o.j;
          if (o.code === 200 && j.text) {
            afficher('<p class="tuteur-qui">Ta question : ' + esc(question) + '</p>' + rendu(j.text, esc) +
              '<p class="tuteur-pied">Réponse générée par une IA : vérifie-la avec ton cours.</p>');
            note.textContent = j.cached ? "Réponse déjà validée par un enseignant : elle ne compte pas dans ton quota." : libQuota(j.quota);
            q.value = ""; dernier = { q: question, r: j.text };
            q.placeholder = "Une autre question ? Le tuteur se souvient de sa dernière réponse.";
            return;
          }
          if (o.code === 429) {
            /* Quota du jour atteint (ou débit trop rapide) : on n'insiste pas. */
            bloque = /quota|essais/i.test(j.error || "");
            afficher('<p>' + esc(j.error || "Trop de questions d'un coup. Attends une minute avant de recommencer.") + '</p>' +
              (bloque ? A.offre(L.c, L.m, "lecon") : ""), "tuteur-ko");
            if (bloque) { q.disabled = true; note.textContent = "Ton quota de questions est épuisé pour aujourd'hui."; }
            return;
          }
          afficher('<p>' + esc(j.error || "Le Prof. Ambassa est momentanément indisponible. Réessaie dans quelques instants.") + '</p>', "tuteur-ko");
        })
        .catch(function () { afficher("<p>La connexion a échoué. Vérifie ta connexion internet puis réessaie.</p>", "tuteur-ko"); })
        .then(function () { go.disabled = bloque; go.textContent = "Demander"; });
    });
  }

  W.VRT = W.VRT || {};
  W.VRT.tuteur = { monter: monter, contexte: contexte, consignes: consignes, progression: progression, avecSuite: avecSuite, rendu: rendu, libQuota: libQuota };
})(window);
