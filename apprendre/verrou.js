/* VÉRITAS — Apprendre : suite des leçons réservée aux abonnés.
   Le début (objectifs, première partie) est dans les fichiers publics ; le reste
   n'existe que sur le serveur et arrive par api/apprendre.php. Une réponse de refus
   ne se retente jamais : l'hébergeur bannit une IP pour trop de requêtes refusées. */
(function (W) {
  "use strict";
  var API = "/api/apprendre.php", CLE = "vrt_app_jeton";
  var CADENAS = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/></svg>';

  function jeton() { try { return W.localStorage.getItem(CLE) || W.sessionStorage.getItem("_vrtCT") || ""; } catch (e) { return ""; } }
  function poser(t) { try { if (t) W.localStorage.setItem(CLE, t); else W.localStorage.removeItem(CLE); } catch (e) { } }
  function poste(corps) {
    return fetch(API, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(corps) })
      .then(function (r) { return r.json(); });
  }
  function fusionner(L, s) {
    L.parties = [L.parties[0]].concat(s.parties || []);
    L.revision = s.revision || []; L.exo = s.exo || ""; L.quiz = s.quiz || []; L.verrou = false;
  }

  /* cb(null) : leçon complète ; cb({raison}) : on affiche le début et le mur. */
  function ouvrir(L, cb) {
    var t = jeton();
    if (!t) { cb({ raison: "connexion" }); return; }
    poste({ id: L.id, token: t }).then(function (j) {
      if (j && j.ok && j.suite) { fusionner(L, j.suite); cb(null); return; }
      if (j && j.raison === "connexion") poser("");
      cb({ raison: (j && j.raison) || "reseau" });
    }).catch(function () { cb({ raison: "reseau" }); });
  }

  var MSG = {
    connexion: "Connecte-toi pour lire la suite si tu as une formule, ou choisis-en une.",
    identifiants: "Identifiant ou mot de passe incorrect. Vérifie-les puis réessaie.",
    abonnement: "Ton compte n'a pas encore de formule active. Choisis-en une pour lire la suite.",
    non_depose: "Ta formule est bien active, mais cette leçon n'est pas encore disponible sur le serveur. Reviens un peu plus tard.",
    debit: "Trop de demandes en même temps depuis ce réseau. Réessaie dans une minute.",
    reseau: "La connexion a échoué. Vérifie ta connexion internet puis recharge la page."
  };

  function mur(L, etat, A) {
    var fermees = L.parties.filter(function (p) { return p.verrou; });
    var form = (etat.raison === "connexion" || etat.raison === "identifiants")
      ? '<form class="mur-f" data-mur-form><label>Identifiant<input name="login" autocomplete="username" required></label>' +
        '<label>Mot de passe<input name="password" type="password" autocomplete="current-password" required></label>' +
        '<button type="submit" class="btn-l">Lire la suite</button></form>'
      : "";
    return '<section class="mur" aria-label="Suite réservée aux abonnés"><p class="mur-t">' + CADENAS + 'La suite de cette leçon est réservée aux abonnés</p>' +
      '<p class="mur-m" data-mur-msg>' + A.esc(MSG[etat.raison] || MSG.reseau) + '</p>' +
      (fermees.length ? '<ol class="mur-l">' + fermees.map(function (p) { return '<li>' + CADENAS + A.esc(p.t) + '</li>'; }).join("") + '</ol>' : "") +
      '<p class="mur-p">Avec ' + (L.labo ? 'un labo à manipuler, ' : '') + 'un entraînement corrigé au format de l\'examen, la fiche de révision et un quiz de ' + (L.nq || 0) + ' questions corrigées.</p>' +
      form + A.offre(L.c, L.m, "lecon") + '</section>';
  }

  /* Formulaire : un seul envoi à la fois, et rechargement une fois le jeton posé. */
  function brancher(racine, L) {
    var f = racine.querySelector("[data-mur-form]");
    if (!f) return;
    f.addEventListener("submit", function (ev) {
      ev.preventDefault();
      var b = f.querySelector("button"), m = racine.querySelector("[data-mur-msg]");
      if (b.disabled) return;
      b.disabled = true;
      poste({ id: L.id, login: f.login.value.trim(), password: f.password.value }).then(function (j) {
        if (j && j.token) poser(j.token);
        if (j && j.ok) { W.location.reload(); return; }
        if (j && j.raison === "abonnement") { W.location.reload(); return; }
        m.textContent = MSG[(j && j.raison) || "reseau"] || MSG.reseau; b.disabled = false;
      }).catch(function () { m.textContent = MSG.reseau; b.disabled = false; });
    });
  }

  W.VRT = W.VRT || {};
  W.VRT.verrou = { ouvrir: ouvrir, mur: mur, brancher: brancher, CADENAS: CADENAS };
})(window);
