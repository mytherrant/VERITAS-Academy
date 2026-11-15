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
      if (j && j.token) poser(j.token);
      if (j && j.raison === "connexion") poser("");
      cb({ raison: (j && j.raison) || "reseau", classe: j && j.classe, classes: (j && j.classes) || [], max: j && j.max });
    }).catch(function () { cb({ raison: "reseau" }); });
  }

  var MSG = {
    connexion: "Choisis une formule pour lire la suite. Déjà abonné ? Connecte-toi juste en dessous.",
    identifiants: "Identifiant ou mot de passe incorrect. Vérifie-les puis réessaie.",
    abonnement: "Ton compte n'a pas encore de formule active. Choisis-en une pour lire la suite.",
    non_depose: "Ta formule est bien active, mais cette leçon n'est pas encore disponible sur le serveur. Reviens un peu plus tard.",
    debit: "Trop de demandes en même temps depuis ce réseau. Réessaie dans une minute.",
    reseau: "La connexion a échoué. Vérifie ta connexion internet puis recharge la page.",
    classe_a_choisir: "",
    classe_hors_formule: ""
  };
  /* « 1re-c » → « 1re C », « tle » → « Terminale » : la classe telle que l'élève la nomme. */
  function libClasse(c) {
    c = String(c || "");
    var g = { "tle": "Terminale", "1re": "Première", "2nde": "Seconde" }[c];
    if (g) return g;
    var m = /^(2nde|1re|tle)-([a-z])$/.exec(c);
    if (m) return (m[1] === "tle" ? "Tle" : m[1]) + " " + m[2].toUpperCase();
    return c;
  }
  /* Classes de la formule (12/11/2026) : Starter et Pro en ouvrent 1, Élite 2,
     Famille 4, les formules enseignant 3, 6 ou toutes. */
  function blocClasse(etat, A) {
    var pris = (etat.classes || []).map(libClasse), n = +etat.max || 1, ici = libClasse(etat.classe);
    var liste = pris.length ? " Déjà retenue" + (pris.length > 1 ? "s" : "") + " : " + A.esc(pris.join(", ")) + "." : "";
    if (etat.raison === "classe_a_choisir") {
      var reste = n - pris.length;
      return '<p class="mur-m">Ta formule ouvre <b>' + n + ' classe' + (n > 1 ? "s" : "") + '</b>.' + liste +
        ' Ajouter la <b>' + A.esc(ici) + '</b> ? Il te restera ' + (reste - 1) + ' place' + (reste - 1 > 1 ? "s" : "") + '. Une classe retenue peut être changée après 30 jours.</p>' +
        '<p><button type="button" class="btn-l" data-mur-retenir>Ajouter la ' + A.esc(ici) + ' à ma formule</button></p>';
    }
    return '<p class="mur-m">Cette leçon est en <b>' + A.esc(ici) + '</b>, et ta formule ouvre ' + n + ' classe' + (n > 1 ? "s" : "") + '.' + liste +
      ' Pour en ajouter, passe à une formule qui en couvre plus : Élite (2 classes), Famille (4 enfants) ou, pour un enseignant, Prof 3 classes, 6 classes ou toutes classes.</p>' +
      ((etat.classes || []).length ? '<p class="mur-m">Tu as changé de classe ? Une classe retenue depuis plus de 30 jours peut être remplacée : ' +
        etat.classes.map(function (c) { return '<button type="button" class="btn-l" data-mur-liberer="' + A.esc(c) + '">Libérer la ' + A.esc(libClasse(c)) + '</button>'; }).join(" ") +
        '</p><p class="mur-m" data-mur-lib-msg hidden></p>' : '');
  }

  function mur(L, etat, A) {
    var fermees = L.parties.filter(function (p) { return p.verrou; });
    var form = (etat.raison === "connexion" || etat.raison === "identifiants")
      ? '<details class="mur-cx"' + (etat.raison === "identifiants" ? " open" : "") + '><summary>Déjà abonné ? Je me connecte</summary>' +
        '<form class="mur-f" data-mur-form><label>Identifiant<input name="login" autocomplete="username" required></label>' +
        '<label>Mot de passe<input name="password" type="password" autocomplete="current-password" required></label>' +
        '<button type="submit" class="btn-l">Lire la suite</button></form></details>'
      : "";   /* 14/11/2026 : replié sous l'offre, ouvert d'office après un identifiant refusé */
    return '<section class="mur" aria-label="Suite réservée aux abonnés"><p class="mur-t">' + CADENAS + (/^classe_/.test(etat.raison) ? 'Cette classe n\'est pas encore dans ta formule' : 'La suite de cette leçon est réservée aux abonnés') + '</p>' +
      (/^classe_/.test(etat.raison) ? blocClasse(etat, A) : '<p class="mur-m" data-mur-msg>' + A.esc(MSG[etat.raison] || MSG.reseau) + '</p>') +
      fermees.filter(function (p) { return p.illus; }).map(function (p) { return '<figure class="illus mur-schema">' + p.illus.svg + '<figcaption><b>Schéma offert</b> · ' + A.esc(p.t) + ' — ' + A.esc(p.illus.legende || "") + '</figcaption></figure>'; }).join("") +
      (fermees.length ? '<ol class="mur-l">' + fermees.map(function (p) { return '<li>' + CADENAS + A.esc(p.t) + '</li>'; }).join("") + '</ol>' : "") +
      '<p class="mur-p">Avec ' + (L.labo ? 'un labo à manipuler, ' : '') + 'un entraînement corrigé au format de l\'examen, la fiche de révision et un quiz de ' + (L.nq || 0) + ' questions corrigées.</p>' +
      (form ? form : "") + A.offre(L.c, L.m, "lecon") + '</section>';
  }

  /* Formulaire : un seul envoi à la fois, et rechargement une fois le jeton posé. */
  function brancher(racine, L) {
    var r = racine.querySelector("[data-mur-retenir]");
    if (r) r.addEventListener("click", function () {
      if (r.disabled) return;
      r.disabled = true;
      poste({ id: L.id, token: jeton(), retenir: true }).then(function (j) {
        if (j && j.token) poser(j.token);
        W.location.reload();
      }).catch(function () { r.disabled = false; });
    });
    [].forEach.call(racine.querySelectorAll("[data-mur-liberer]"), function (b) {
      b.addEventListener("click", function () {
        if (b.disabled) return;
        b.disabled = true;
        poste({ action: "liberer", classe: b.getAttribute("data-mur-liberer"), id: L.id, token: jeton() }).then(function (j) {
          if (j && j.ok) { W.location.reload(); return; }
          var m = racine.querySelector("[data-mur-lib-msg]");
          if (m) { m.hidden = false; m.textContent = "Cette classe a été retenue il y a moins de 30 jours : elle ne peut pas encore être remplacée."; }
          b.disabled = false;
        }).catch(function () { b.disabled = false; });
      });
    });
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
