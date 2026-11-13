/* VÉRITAS — Apprendre : le tuteur IA (Prof. Ambassa) au pied de chaque leçon.
   L'élève pose une question sur la leçon qu'il lit ; la question part vers
   api/ia_proxy.php avec le texte de la leçon (ce que l'élève voit, rien de plus)
   et le jeton du compte. Le SERVEUR fixe le quota du jour d'après la formule
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

  function consignes(L, M) {
    return "TUTEUR DE LEÇON — espace Apprendre de VÉRITAS.\n" +
      "Tu réponds à un élève de " + L.c + " qui lit la leçon « " + L.titre + " » (" + (M && M.nom || L.m) + ").\n" +
      "• Appuie-toi d'abord sur le texte de la leçon fourni en contexte ; reste au niveau de la classe.\n" +
      "• Réponds en 200 mots au plus, phrases courtes, tutoiement bienveillant.\n" +
      "• Si l'élève demande un exercice, donne l'énoncé puis le corrigé détaillé.\n" +
      "• Si la question sort de la leçon ou de l'école, réponds brièvement puis ramène-le à la leçon.\n" +
      "• N'invente rien : si tu n'es pas sûr, dis-le.\n" +
      "• Mise en forme simple : paragraphes, listes « - », **gras** pour les mots-clés. Pas de tableau, pas de LaTeX.";
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
        rep = sec.querySelector(".tuteur-r"), note = sec.querySelector(".tuteur-n"), bloque = false;

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
      var corps = { prompt: question.slice(0, MAXQ), sysPrompt: consignes(L, M), ragContext: contexte(L, M),
        action: "apprendre_tuteur", userId: "", plan: connecte ? "compte" : "anon" };
      var t = jeton(); if (t) corps.token = t;
      fetch(API, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(corps) })
        .then(function (r) { return r.json().catch(function () { return {}; }).then(function (j) { return { code: r.status, j: j || {} }; }); })
        .then(function (o) {
          var j = o.j;
          if (o.code === 200 && j.text) {
            afficher('<p class="tuteur-qui">Ta question : ' + esc(question) + '</p>' + rendu(j.text, esc) +
              '<p class="tuteur-pied">Réponse générée par une IA : vérifie-la avec ton cours.</p>');
            note.textContent = j.cached ? "Réponse déjà validée par un enseignant : elle ne compte pas dans ton quota." : libQuota(j.quota);
            q.value = "";
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
  W.VRT.tuteur = { monter: monter, contexte: contexte, rendu: rendu, libQuota: libQuota };
})(window);
