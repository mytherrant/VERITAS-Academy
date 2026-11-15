/* VÉRITAS — Annales : « Télécharger en PDF » et « Composer en direct », réservés aux abonnés.
   Copié tel quel par tools/annales.cjs dans ressources/annales/annales.js (ne pas éditer la copie).
   L'abonnement se vérifie sur le serveur (api/apprendre.php, action « droits », même jeton
   qu'Apprendre). Le sujet et le corrigé restent publics : seuls ces deux outils sont réservés.
   Un refus ne se retente pas en boucle : l'hébergeur bannit une IP trop souvent refusée. */
(function (W, D) {
  "use strict";
  var API = "/api/apprendre.php", CLE = "vrt_app_jeton", CACHE = "vrt_ax_abo", OUT = D.querySelector(".ax-outils");
  if (!OUT) return;
  var ID = OUT.getAttribute("data-id"), TITRE = OUT.getAttribute("data-titre") || D.title, DUREE = +OUT.getAttribute("data-min") || 120,
    META = OUT.getAttribute("data-meta") || "", K_COPIE = "vrt_ax_copie_" + ID, K_HIST = "vrt_ax_hist";

  function esc(s) { return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; }); }
  function lsGet(k) { try { return W.localStorage.getItem(k); } catch (e) { return null; } }
  function lsSet(k, v) { try { if (v == null) W.localStorage.removeItem(k); else W.localStorage.setItem(k, v); } catch (e) { } }
  function ssGet(k) { try { return W.sessionStorage.getItem(k); } catch (e) { return null; } }
  function ssSet(k, v) { try { W.sessionStorage.setItem(k, v); } catch (e) { } }
  function jeton() { return lsGet(CLE) || ssGet("_vrtCT") || ""; }

  /* ── Vérification de l'abonnement (mise en cache 30 min dans l'onglet) ── */
  function abonne(droits) { return !!droits && ((droits.groupes || []).length > 0 || droits.classes === -1); }
  function verifier(corps, cb) {
    fetch(API, { method: "POST", headers: { "Content-Type": "application/json" }, credentials: "same-origin", body: JSON.stringify(corps) })
      .then(function (r) { return r.json(); })
      .then(function (j) {
        if (j && j.token) lsSet(CLE, j.token);
        if (j && j.raison === "connexion") lsSet(CLE, null);
        if (j && j.ok) { var ok = abonne(j.droits); ssSet(CACHE, JSON.stringify({ ok: ok, t: Date.now() })); cb(ok ? null : "abonnement"); return; }
        cb((j && j.raison) || "reseau");
      })
      .catch(function () { cb("reseau"); });
  }
  /* ── Épreuves séquentielles (data-suite="1") : la page ne porte que le premier exercice.
     La suite du sujet et le corrigé viennent du serveur (api/apprendre.php, même verrou que
     les leçons : formule active ET classe couverte), puis s'insèrent dans la page. ── */
  var SUITE = OUT.getAttribute("data-suite") === "1", CHARGEE = false;
  function injecter(s) {
    var S = D.querySelector(".ax-sujet"), V = D.querySelector(".sq-verrou"), Z = D.getElementById("sqCorrige");
    if (S && s && s.sujet) { var d = D.createElement("div"); d.className = "sq-suite"; d.innerHTML = s.sujet; S.appendChild(d); }
    if (V) V.parentNode.removeChild(V);
    if (Z && s && s.corrige) Z.innerHTML = '<details class="ax-cache"><summary>Afficher le corrigé (après avoir traité le sujet)</summary><div class="ax-corrige">' + s.corrige + "</div></details>";
    CHARGEE = true;
  }
  function charger(corps, suite) {
    occupe(true);
    corps.id = ID;
    fetch(API, { method: "POST", headers: { "Content-Type": "application/json" }, credentials: "same-origin", body: JSON.stringify(corps) })
      .then(function (r) { return r.json(); })
      .then(function (j) {
        occupe(false);
        if (j && j.token) lsSet(CLE, j.token);
        if (j && j.raison === "connexion") lsSet(CLE, null);
        if (j && j.ok && j.suite) { fermer(); injecter(j.suite); suite(); return; }
        var r = (j && j.raison) || "reseau";
        if (r === "classe_a_choisir") {
          var f = fenetre("<h3>Choisir cette classe</h3><p class=\"ax-fen-m\">Ta formule ouvre " + esc(j.max) + " classe" + (j.max > 1 ? "s" : "") + ". Ouvrir cette épreuve retient la classe <b>" + esc(String(j.classe || "").replace(/^tle/, "Tle").replace(/-([a-z])$/, function (m, l) { return " " + l.toUpperCase(); })) + "</b> pour au moins 30 jours.</p>" +
            '<button class="ax-btn ax-plein" type="button" data-ok="1">Retenir cette classe</button><button class="ax-btn" type="button" data-ok="0">Annuler</button>');
          f.querySelector("[data-ok='1']").addEventListener("click", function () { corps.retenir = true; charger(corps, suite); });
          f.querySelector("[data-ok='0']").addEventListener("click", fermer);
          return;
        }
        if (r === "classe_hors_formule" || r === "non_depose") { fenetre("<h3>Réservé aux abonnés</h3><p class=\"ax-fen-m\">" + esc(MSG[r]) + "</p>"); return; }
        mur(r, suite);
      })
      .catch(function () { occupe(false); mur("reseau", suite); });
  }
  /* ── Achat à l'unité, sans compte (150 F : l'épreuve et son corrigé) ──
     Le navigateur tire une clé secrète ; le serveur de paiement n'en garde que
     l'empreinte, et api/apprendre.php (action « achat ») ne rouvre l'épreuve qu'à
     qui présente la référence ET la clé. Les deux restent sur cet appareil. */
  var PRIX = +OUT.getAttribute("data-prix") || 150, PAY = "/api/payment_camerpay.php", K_ACHAT = "vrt_sq_achat_" + ID, SUIVI = null;
  function achatLu() { try { var a = JSON.parse(lsGet(K_ACHAT) || "null"); return a && a.ref && a.cle ? a : null; } catch (e) { return null; } }
  function cleNeuve() {
    var b = new Uint8Array(24), h = "";
    (W.crypto || W.msCrypto).getRandomValues(b);
    for (var i = 0; i < b.length; i++) h += ("0" + b[i].toString(16)).slice(-2);
    return h;
  }
  function refNeuve() {
    var d = new Date(), p = function (n) { return (n < 10 ? "0" : "") + n; }, a = "ABCDEFGHJKMNPQRSTUVWXYZ23456789", s = "";
    for (var i = 0; i < 6; i++) s += a.charAt(Math.floor(Math.random() * a.length));
    return "SQ" + String(d.getFullYear()).slice(2) + p(d.getMonth() + 1) + p(d.getDate()) + "-" + s;
  }
  /* Rouvre l'épreuve achetée sur cet appareil. `silencieux` : au chargement de la page,
     un achat encore en attente ne doit pas ouvrir de fenêtre. */
  function reprendre(suite, silencieux) {
    var a = achatLu(); if (!a) return false;
    fetch(API, { method: "POST", headers: { "Content-Type": "application/json" }, credentials: "same-origin",
      body: JSON.stringify({ action: "achat", id: ID, ref: a.ref, cle: a.cle }) })
      .then(function (r) { return r.json(); })
      .then(function (j) {
        if (j && j.ok && j.suite) { arreterSuivi(); fermer(); injecter(j.suite); if (suite) suite(); return; }
        var r = (j && j.raison) || "reseau";
        /* Un paiement abandonné reste « en attente » : passé 30 minutes on l'oublie,
           sinon il barrerait la route à l'abonné qui veut se connecter. */
        if (r === "achat_en_attente" && Date.now() - (+a.t || 0) > 30 * 60 * 1000) {
          lsSet(K_ACHAT, null); arreterSuivi(); if (!silencieux) mur("connexion", suite); return;
        }
        if (r === "achat_en_attente") { if (!silencieux) attente(a); suivre(suite); return; }
        arreterSuivi();
        if (r === "achat_invalide") { lsSet(K_ACHAT, null); if (!silencieux) mur("connexion", suite); return; }
        if (!silencieux) fenetre("<h3>Paiement reçu</h3><p class=\"ax-fen-m\">" + esc(r === "non_depose" ? MSG.non_depose
          : "Ton paiement doit être vérifié par notre équipe. Écris-nous sur WhatsApp au 697 63 77 39 avec ta référence " + a.ref + " : ton épreuve sera ouverte rapidement.") + "</p>");
      })
      .catch(function () { if (!silencieux) mur("reseau", suite); });
    return true;
  }
  function suivre(suite) {
    if (SUIVI) return;
    var debut = Date.now();
    SUIVI = setInterval(function () {
      if (Date.now() - debut > 15 * 60 * 1000) { arreterSuivi(); return; }   // le payeur reviendra : la reprise se fait au chargement
      reprendre(suite, true);
    }, 6000);
  }
  function arreterSuivi() { if (SUIVI) { clearInterval(SUIVI); SUIVI = null; } }
  function attente(a) {
    fenetre("<h3>Paiement en cours</h3><p class=\"ax-fen-m\">Valide le paiement de " + PRIX + " F sur ton téléphone (MTN MoMo ou Orange Money). " +
      "Cette page s'ouvrira toute seule dès qu'il sera confirmé.</p><p class=\"ax-fen-m\"><small>Référence : " + esc(a.ref) + "</small></p>");
  }
  function acheter(tel, bouton, suite) {
    /* Onglet ouvert PENDANT le geste : après les allers-retours réseau, le
       navigateur bloquerait la fenêtre (même leçon que les cahiers). */
    var fen = null; try { fen = W.open("", "_blank"); } catch (e) { fen = null; }
    var fermerFen = function () { if (fen) { try { fen.close(); } catch (e) { } fen = null; } };
    var a = { ref: refNeuve(), cle: cleNeuve(), t: Date.now() };
    bouton.disabled = true; bouton.textContent = "Préparation du paiement…";
    fetch(PAY + "?action=config", { cache: "no-store" })
      .then(function (r) { return r.json(); })
      .then(function (c) {
        if (!c || c.horsService || !c.selfService || !c.publicInitToken) throw new Error("Le paiement automatique est momentanément indisponible. Réessaie un peu plus tard, ou choisis une formule d'abonnement.");
        return fetch(PAY + "?action=init", { method: "POST", headers: { "Content-Type": "application/json", "Authorization": "Bearer " + c.publicInitToken },
          body: JSON.stringify({ montant: PRIX, ref: a.ref, label: "Épreuve — " + TITRE, intent: "sequentielle", targetId: ID, clientTel: tel, cle: a.cle,
            accountId: "" }) });
      })
      .then(function (r) { return r.json(); })
      .then(function (j) {
        if (!j || !j.pay_url) throw new Error((j && j.error) || "Le paiement n'a pas pu démarrer. Réessaie.");
        lsSet(K_ACHAT, JSON.stringify(a));
        var ouverte = false;
        if (fen) { try { fen.location.replace(j.pay_url); ouverte = fen.closed === false; } catch (e) { ouverte = false; } }
        if (!ouverte) { fermerFen(); location.href = j.pay_url; return; }   // au retour, la page reprend l'achat toute seule
        attente(a); suivre(suite);
      })
      .catch(function (e) {
        fermerFen(); bouton.disabled = false; bouton.textContent = "Acheter pour " + PRIX + " F";
        var m = bouton.parentNode.querySelector(".sq-achat-err"); if (m) m.textContent = e && e.message ? e.message : MSG.reseau;
      });
  }
  function achatHtml() {
    return '<form class="sq-achat"><p><b>Sans abonnement :</b> cette épreuve complète et son corrigé pour <b>' + PRIX + " F</b>, par MTN MoMo ou Orange Money.</p>" +
      '<input name="t" inputmode="tel" autocomplete="tel" placeholder="Ton numéro (6XX XX XX XX)" required>' +
      '<button class="ax-btn ax-plein" type="submit">Acheter pour ' + PRIX + ' F</button><p class="sq-achat-err" role="alert"></p></form>';
  }
  function brancherAchat(f, suite) {
    var fa = f.querySelector(".sq-achat"); if (!fa) return;
    fa.addEventListener("submit", function (e) {
      e.preventDefault();
      var tel = String(this.t.value || "").replace(/\D/g, "").replace(/^237/, "");
      var err = this.querySelector(".sq-achat-err");
      if (!/^6\d{8}$/.test(tel)) { err.textContent = "Numéro attendu : 9 chiffres commençant par 6."; return; }
      err.textContent = ""; acheter(tel, this.querySelector("button"), suite);
    });
  }
  function exiger(suite) {
    /* La suite servie par le serveur vaut preuve d'abonnement (formule active, classe couverte). */
    if (SUITE && !CHARGEE && achatLu()) { reprendre(suite, false); return; }
    if (SUITE) { if (CHARGEE) { suite(); return; } var tj = jeton(); if (!tj) mur("connexion", suite); else charger({ token: tj }, suite); return; }
    var c = null; try { c = JSON.parse(ssGet(CACHE) || "null"); } catch (e) { }
    if (c && c.ok && Date.now() - c.t < 30 * 60 * 1000) { suite(); return; }
    var t = jeton();
    if (!t) { mur("connexion", suite); return; }
    occupe(true);
    verifier({ action: "droits", id: "annales", token: t }, function (raison) { occupe(false); if (!raison) suite(); else mur(raison, suite); });
  }
  function occupe(o) { [].forEach.call(OUT.querySelectorAll("button"), function (b) { b.disabled = o; }); }

  /* ── Fenêtre (mur d'abonnement, choix du PDF) ── */
  var MSG = {
    connexion: "Le téléchargement en PDF et la composition en direct sont réservés aux abonnés. Déjà abonné ? Connecte-toi.",
    identifiants: "Identifiant ou mot de passe incorrect. Vérifie-les puis réessaie.",
    abonnement: "Ton compte n'a pas encore de formule active. Choisis-en une pour télécharger les sujets et composer en direct.",
    debit: "Trop de demandes depuis ce réseau. Réessaie dans une minute.",
    classe_hors_formule: "Ta formule ne couvre pas cette classe : toutes ses places de classe sont déjà prises. Change de formule pour ouvrir une classe de plus.",
    non_depose: "Cette épreuve est en cours de mise en ligne. Réessaie un peu plus tard.",
    reseau: "La connexion a échoué. Vérifie ta connexion internet puis réessaie."
  };
  function fenetre(html) {
    fermer();
    var f = D.createElement("div"); f.className = "ax-fen"; f.id = "axFen";
    f.innerHTML = '<div class="ax-fen-b" role="dialog" aria-modal="true"><button class="ax-x" type="button" aria-label="Fermer">×</button>' + html + "</div>";
    f.addEventListener("click", function (e) { if (e.target === f || e.target.classList.contains("ax-x")) fermer(); });
    D.body.appendChild(f);
    var b = f.querySelector("input,button:not(.ax-x)"); if (b) b.focus();
    return f;
  }
  function fermer() { var f = D.getElementById("axFen"); if (f) f.parentNode.removeChild(f); }
  function mur(raison, suite) {
    var m = SUITE && raison === "connexion" ? "La suite du sujet, son corrigé, le PDF et la composition en direct s'ouvrent avec un abonnement, ou en achetant cette seule épreuve." : MSG[raison] || MSG.reseau;
    var f = fenetre('<h3>' + (SUITE ? "Abonnés ou achat à l'unité" : "Réservé aux abonnés") + '</h3><p class="ax-fen-m">' + esc(m) + "</p>" +
      (SUITE ? achatHtml() : "") +
      '<a class="ax-btn' + (SUITE ? "" : " ax-plein") + '" href="/app.html#abonnement">Choisir une formule</a>' +
      '<form class="ax-log"><p>Déjà abonné ?</p><input name="l" autocomplete="username" placeholder="Identifiant ou téléphone" required>' +
      '<input name="p" type="password" autocomplete="current-password" placeholder="Mot de passe" required><button class="ax-btn" type="submit">Me connecter</button></form>');
    if (SUITE) brancherAchat(f, suite);
    f.querySelector(".ax-log").addEventListener("submit", function (e) {
      e.preventDefault();
      var l = this.l.value.trim(), p = this.p.value, bt = this.querySelector("button");
      if (!l || !p) return;
      bt.disabled = true; bt.textContent = "Vérification…";
      if (SUITE && !CHARGEE) { charger({ login: l, password: p }, suite); return; }
      verifier({ action: "droits", id: "annales", login: l, password: p }, function (r) {
        if (!r) { fermer(); suite(); return; }
        mur(r, suite);
      });
    });
  }

  /* ── PDF : la fenêtre d'impression du navigateur, en vectoriel (net et léger) ── */
  function imprimer(avecCorrige, copie) {
    var S = D.querySelector(".ax-sujet"), C = D.querySelector(".ax-corrige"), old = D.getElementById("axImp");
    if (old) old.parentNode.removeChild(old);
    var z = D.createElement("div"); z.id = "axImp";
    z.innerHTML = '<div class="ax-imp-t"><b>VÉRITAS</b><span>' + esc(TITRE) + "</span><small>" + esc(META) + "</small></div>" +
      '<section class="ax-imp-s"><h2>Sujet</h2></section>' +
      (copie != null ? '<section class="ax-imp-c"><h2>Ma copie</h2><div class="ax-imp-copie"></div></section>' : "") +
      (avecCorrige ? '<section class="ax-imp-c"><h2>Corrigé</h2></section>' : "") +
      '<div class="ax-imp-p">veritas-school.com · Annales corrigées</div>';
    if (S) z.querySelector(".ax-imp-s").appendChild(S.cloneNode(true));
    if (copie != null) z.querySelector(".ax-imp-copie").textContent = copie || "(copie vide)";
    if (avecCorrige && C) z.querySelectorAll(".ax-imp-c")[copie != null ? 1 : 0].appendChild(C.cloneNode(true));
    D.body.appendChild(z);
    D.documentElement.classList.add("ax-impression");
    var fin = function () { D.documentElement.classList.remove("ax-impression"); if (z.parentNode) z.parentNode.removeChild(z); W.removeEventListener("afterprint", fin); };
    W.addEventListener("afterprint", fin);
    setTimeout(function () { W.print(); }, 60);
  }
  function choixPdf() {
    var f = fenetre('<h3>Télécharger en PDF</h3><p class="ax-fen-m">Dans la fenêtre qui s\'ouvre, choisis <b>« Enregistrer au format PDF »</b> comme imprimante.</p>' +
      '<button class="ax-btn ax-plein" type="button" data-c="0">Le sujet seul</button><button class="ax-btn" type="button" data-c="1">Le sujet et son corrigé</button>');
    [].forEach.call(f.querySelectorAll("[data-c]"), function (b) { b.addEventListener("click", function () { var c = b.getAttribute("data-c") === "1"; fermer(); imprimer(c); }); });
  }

  /* ── Composer en direct : chronomètre à la durée officielle, copie enregistrée, corrigé à la fin ── */
  var MODE = null;
  function hms(s) { s = Math.max(0, Math.round(s)); var h = Math.floor(s / 3600), m = Math.floor(s % 3600 / 60), x = s % 60; return (h ? h + " h " : "") + (m < 10 && h ? "0" : "") + m + " min " + (x < 10 ? "0" : "") + x + " s"; }
  function etatCopie() { try { return JSON.parse(lsGet(K_COPIE) || "null"); } catch (e) { return null; } }
  function composer() {
    var e = etatCopie(), S = D.querySelector(".ax-sujet");
    if (e && e.fin) e = null;   // une copie rendue ne se reprend pas : on recommence
    var debut = e && e.debut ? e.debut : Date.now(), texte = e && e.texte || "";
    lsSet(K_COPIE, JSON.stringify({ debut: debut, texte: texte }));
    var z = D.createElement("div"); z.className = "ax-direct"; z.id = "axDirect";
    z.innerHTML = '<div class="ax-d-barre"><div class="ax-d-t"><b>' + esc(TITRE) + '</b><small>Durée de l\'épreuve : ' + (Math.floor(DUREE / 60) ? Math.floor(DUREE / 60) + " h" : "") + (DUREE % 60 ? " " + DUREE % 60 + " min" : "") + "</small></div>" +
      '<div class="ax-d-chrono" aria-live="polite"><span>Temps restant</span><b id="axChrono">' + hms(DUREE * 60) + "</b></div>" +
      '<div class="ax-d-act"><button class="ax-btn" type="button" id="axQuit">Quitter</button><button class="ax-btn ax-plein" type="button" id="axRendre">Rendre ma copie</button></div></div>' +
      '<div class="ax-d-onglets" role="tablist"><button type="button" class="on" data-o="s">Sujet</button><button type="button" data-o="c">Ma copie</button></div>' +
      '<div class="ax-d-corps"><div class="ax-d-sujet" data-p="s"></div><div class="ax-d-copie" data-p="c"><label for="axCopie">Ma copie <small>(enregistrée sur cet appareil au fil de la frappe)</small></label>' +
      '<textarea id="axCopie" spellcheck="true" placeholder="Rédige tes réponses ici, exercice par exercice. Pour les calculs et les schémas, travaille aussi au brouillon."></textarea></div></div>';
    if (S) z.querySelector(".ax-d-sujet").appendChild(S.cloneNode(true));
    D.body.appendChild(z); D.documentElement.classList.add("ax-direct-on");
    var ta = z.querySelector("#axCopie"); ta.value = texte;
    ta.addEventListener("input", function () { lsSet(K_COPIE, JSON.stringify({ debut: debut, texte: ta.value })); });
    [].forEach.call(z.querySelectorAll("[data-o]"), function (b) {
      b.addEventListener("click", function () {
        [].forEach.call(z.querySelectorAll("[data-o]"), function (x) { x.classList.toggle("on", x === b); });
        z.querySelector(".ax-d-corps").setAttribute("data-vue", b.getAttribute("data-o"));
      });
    });
    var ch = z.querySelector("#axChrono"), alerte = false;
    function tic() {
      var reste = DUREE * 60 - (Date.now() - debut) / 1000;
      ch.textContent = hms(reste);
      if (reste <= 600 && !alerte) { alerte = true; ch.parentNode.classList.add("ax-alerte"); }
      if (reste <= 0) rendre(true);
    }
    MODE = setInterval(tic, 1000); tic();
    /* Quitter n'arrête pas le chronomètre (comme à l'examen) : la copie reste enregistrée et se reprend. */
    z.querySelector("#axQuit").addEventListener("click", quitter);
    z.querySelector("#axRendre").addEventListener("click", function () { rendre(false); });
    function rendre(temps) {
      clearInterval(MODE); MODE = null;
      var duree = Math.min(DUREE * 60, Math.round((Date.now() - debut) / 1000));
      lsSet(K_COPIE, JSON.stringify({ debut: debut, texte: ta.value, fin: Date.now() }));
      bilan(ta.value, duree, temps);
    }
  }
  function quitter() {
    if (MODE) { clearInterval(MODE); MODE = null; }
    var z = D.getElementById("axDirect"); if (z) z.parentNode.removeChild(z);
    D.documentElement.classList.remove("ax-direct-on");
    maj();
  }
  function bilan(texte, duree, temps) {
    var z = D.getElementById("axDirect"), C = D.querySelector(".ax-corrige");
    z.querySelector(".ax-d-chrono").innerHTML = "<span>" + (temps ? "Temps écoulé" : "Copie rendue") + "</span><b>" + esc(hms(duree)) + "</b>";
    z.querySelector(".ax-d-act").innerHTML = '<button class="ax-btn" type="button" id="axPdfC">Copie et corrigé en PDF</button><button class="ax-btn ax-plein" type="button" id="axFin">Terminer</button>';
    z.querySelector(".ax-d-onglets").innerHTML = '<button type="button" class="on" data-o="s">Corrigé</button><button type="button" data-o="c">Ma copie</button>';
    var corps = z.querySelector(".ax-d-corps"); corps.removeAttribute("data-vue");
    var g = corps.querySelector(".ax-d-sujet"); g.innerHTML = ""; if (C) g.appendChild(C.cloneNode(true));
    var dr = corps.querySelector(".ax-d-copie");
    dr.innerHTML = '<p class="ax-d-lib">Ma copie</p><div class="ax-d-lue"></div>' +
      '<form class="ax-note"><label for="axNote">Ma note, une fois corrigé avec le barème</label><div><input id="axNote" type="number" min="0" max="20" step="0.25" inputmode="decimal" placeholder="—"> / 20 <button class="ax-btn" type="submit">Enregistrer</button></div><p class="ax-hist"></p></form>';
    dr.querySelector(".ax-d-lue").textContent = texte || "(copie vide)";
    [].forEach.call(z.querySelectorAll("[data-o]"), function (b) {
      b.addEventListener("click", function () {
        [].forEach.call(z.querySelectorAll("[data-o]"), function (x) { x.classList.toggle("on", x === b); });
        corps.setAttribute("data-vue", b.getAttribute("data-o"));
      });
    });
    var form = dr.querySelector(".ax-note");
    function hist() {
      var H = []; try { H = JSON.parse(lsGet(K_HIST) || "[]"); } catch (e) { }
      var mien = H.filter(function (h) { return h.id === ID; });
      form.querySelector(".ax-hist").textContent = mien.length ? "Tes notes sur ce sujet : " + mien.map(function (h) { return String(h.n).replace(".", ",") + "/20 (" + h.d + ")"; }).join(" · ") : "";
    }
    hist();
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var n = parseFloat(String(form.querySelector("input").value).replace(",", "."));
      if (!(n >= 0 && n <= 20)) return;
      var H = []; try { H = JSON.parse(lsGet(K_HIST) || "[]"); } catch (er) { }
      H.push({ id: ID, n: n, d: new Date().toLocaleDateString("fr-FR"), s: duree });
      lsSet(K_HIST, JSON.stringify(H.slice(-200))); hist();
    });
    z.querySelector("#axPdfC").addEventListener("click", function () { imprimer(true, texte); });
    z.querySelector("#axFin").addEventListener("click", quitter);
  }

  /* ── Barre d'outils ── */
  function maj() {
    var e = etatCopie(), b = OUT.querySelector("[data-a=direct]");
    if (b) b.lastChild.textContent = e && e.debut && !e.fin ? "Reprendre ma composition" : "Composer en direct";
  }
  OUT.querySelector("[data-a=pdf]").addEventListener("click", function () { exiger(choixPdf); });
  OUT.querySelector("[data-a=direct]").addEventListener("click", function () { exiger(composer); });
  var LIB = D.querySelector("[data-a=suite]");
  var voir = function () { var x = D.querySelector(".sq-suite"); if (x && x.scrollIntoView) x.scrollIntoView({ behavior: "smooth", block: "start" }); };
  if (LIB) LIB.addEventListener("click", function () { exiger(voir); });
  var ACH = D.querySelector("[data-a=acheter]");
  if (ACH) ACH.addEventListener("click", function () { if (CHARGEE) { voir(); return; } if (!reprendre(voir, false)) mur("connexion", voir); });
  D.addEventListener("keydown", function (e) { if (e.key === "Escape") fermer(); });
  maj();
  /* Épreuve déjà achetée sur cet appareil (ou paiement qui vient d'aboutir, retour de la
     page de paiement) : elle se rouvre sans rien demander. */
  if (SUITE && achatLu()) reprendre(null, true);
})(window, document);
