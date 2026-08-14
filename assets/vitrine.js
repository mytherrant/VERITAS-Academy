/* ============================================================================
 *  VÉRITAS — Vitrine publique  ·  assets/vitrine.js
 *  © 2024-2026 Jacques Miterand TAKOU (Mythe Errant). Tous droits réservés.
 *
 *  Moteur de la page d'accueil publique. La page est PRÉ-RENDUE : les sept
 *  écrans existent en HTML dans le document, ce script ne fait que montrer,
 *  masquer et recalculer. Sans lui, la page reste lisible et indexable — ce
 *  qui n'était pas le cas de la maquette d'origine, qui exigeait React,
 *  ReactDOM et Babel (~3 Mo) depuis un CDN avant d'afficher le moindre mot.
 *
 *  Les données des régions dynamiques sont injectées dans window.VRT_DATA,
 *  extraites de la maquette à la construction (aucune ressaisie à la main).
 * ==========================================================================*/
(function () {
  'use strict';

  var D = window.VRT_DATA || {};
  var G = window.VRT_TPL || {};

  var S = {
    page: 'accueil', tab: 1, filtre: 0, moyen: 0, livr: 1, qte: 1,
    langue: 'fr', theme: 'clair', plus: false, burger: false,
    ia: false, trad: false, cit: 0, citOn: true, copie: false
  };

  /* ── Micro-moteur de gabarit ───────────────────────────────────────────
     Résout {{ chemin }} dans un fragment. Volontairement minimal : les
     gabarits sont générés par nous, pas saisis par un utilisateur. */
  function litter(tpl, item, alias) {
    // <sc-if value="{{ alias.prop }}"> … </sc-if> — présent dans les fragments
    // du tunnel de paiement (puce « choisi » du moyen et de la livraison).
    // Sans ce passage, la coche resterait figée sur le premier choix.
    var garde = 0;
    while (/<sc-if\b/.test(tpl) && garde++ < 50) {
      tpl = tpl.replace(/<sc-if[^>]*value="\{\{([^}]*)\}\}"[^>]*>([\s\S]*?)<\/sc-if>/,
        function (m, e, corps) {
          var parts = e.trim().split('.');
          var v = item;
          if (parts[0] !== alias) return '';
          for (var i = 1; i < parts.length; i++) { if (v == null) { v = null; break; } v = v[parts[i]]; }
          return v ? corps : '';
        });
    }
    return tpl.replace(/\{\{([^}]*)\}\}/g, function (m, e) {
      var parts = e.trim().split('.');
      if (parts[0] !== alias) return '';
      var v = item;
      for (var i = 1; i < parts.length; i++) { if (v == null) return ''; v = v[parts[i]]; }
      if (v === undefined || v === null) return '';
      return String(v).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
    });
  }

  /* Remplace en place les éléments d'une région par la liste fournie. */
  function rendre(region, liste) {
    var g = G[region];
    if (!g || !liste) return;
    var anciens = document.querySelectorAll('[data-vrt-item="' + region + '"]');
    if (!anciens.length) return;
    var parent = anciens[0].parentNode;
    var apres = anciens[anciens.length - 1].nextSibling;
    for (var i = 0; i < anciens.length; i++) parent.removeChild(anciens[i]);
    var tampon = document.createElement('div');
    var html = '';
    for (var j = 0; j < liste.length; j++) html += litter(g.tpl, liste[j], g.alias);
    tampon.innerHTML = html;
    while (tampon.firstChild) parent.insertBefore(tampon.firstChild, apres);
  }

  function poser(nom, valeur) {
    var el = document.querySelector('[data-vrt-val="' + nom + '"]');
    if (el) el.textContent = valeur;
  }

  /* ── Formatage FCFA, identique à la maquette ───────────────────────────── */
  function f(n) { return n.toLocaleString('fr-FR').replace(/ | /g, ' ') + ' F'; }

  /* ── Navigation entre les sept écrans ──────────────────────────────────── */
  function aller(page) {
    S.page = page; S.plus = false; S.burger = false;
    var secs = document.querySelectorAll('[data-vp]');
    for (var i = 0; i < secs.length; i++) {
      var actif = secs[i].getAttribute('data-vp') === page;
      if (actif) secs[i].removeAttribute('hidden'); else secs[i].setAttribute('hidden', '');
    }
    fermerMenus();
    try { window.scrollTo({ top: 0, behavior: 'smooth' }); } catch (e) { window.scrollTo(0, 0); }
    if (history.replaceState) history.replaceState(null, '', page === 'accueil' ? location.pathname : '#' + page);
    reveler();
    if (window.veritasTrack) window.veritasTrack('vitrine_page', { page: page });
  }

  function fermerMenus() {
    var d = document.getElementById('vrtPlus');
    if (d) d.hidden = !S.plus;
    var b = document.getElementById('vrtBurger');
    if (b) b.hidden = !S.burger;
  }

  /* ── Tunnel de paiement ────────────────────────────────────────────────── */
  function majPaiement() {
    rendre('moyensPaiement', D.moyensPaiement[S.moyen]);
    rendre('champsPaiement', D.champsPaiement[S.moyen]);
    rendre('optionsLivraison', D.optionsLivraison[S.livr]);
    var sc = D.scal['moyen' + S.moyen] || {};
    poser('titreFormulaire', sc.titreFormulaire || '');
    poser('noteSecurite', sc.noteSecurite || '');
    poser('libellePayer', sc.libellePayer || '');
    majTotaux();
  }

  function majTotaux() {
    var q = S.qte, frais = [0, 1000, 2500][S.livr];
    var st = 5000 * q, remise = 1500 * q;
    rendre('lignesTotal', [
      { libelle: 'Sous-total (' + q + ' article' + (q > 1 ? 's' : '') + ')', montant: f(st + remise), graisse: '400', couleur: '#4D5163' },
      { libelle: 'Remise catalogue', montant: '− ' + f(remise), graisse: '500', couleur: '#007E11' },
      { libelle: 'Frais de livraison', montant: frais === 0 ? 'Offerts' : f(frais), graisse: '400', couleur: '#4D5163' }
    ]);
    poser('quantite', String(q));
    poser('totalPayer', (st + frais).toLocaleString('fr-FR').replace(/ | /g, ' ') + ' F');
  }

  /* ── Passage du jour : français / anglais ──────────────────────────────── */
  function majLangue() {
    var sc = D.scal[S.langue] || {};
    poser('passage1', sc.passage1 || '');
    poser('passage2', sc.passage2 || '');
    poser('decryptage', sc.decryptage || '');
    rendre('partages', D.partages[S.langue]);
  }

  /* ── Thème sombre ──────────────────────────────────────────────────────── */
  function appliquerTheme(mode) {
    var el = document.getElementById('vrt-theme');
    if (!el) { el = document.createElement('style'); el.id = 'vrt-theme'; document.head.appendChild(el); }
    el.textContent = mode === 'sombre' ? (D.themeSombre || '') : '';
    try { localStorage.setItem('vrt_theme', mode); } catch (e) {}
  }

  /* ── Animations (reprises de la maquette, sans le runtime) ─────────────── */
  var io = null;
  function reveler() {
    if (matchMedia('(prefers-reduced-motion:reduce)').matches) {
      var t = document.querySelectorAll('[data-reveal]');
      for (var i = 0; i < t.length; i++) { t[i].style.opacity = '1'; t[i].style.transform = 'none'; }
      return;
    }
    if (!io && 'IntersectionObserver' in window) {
      io = new IntersectionObserver(function (es) {
        es.forEach(function (e) {
          if (!e.isIntersecting) return;
          var el = e.target, i = +(el.dataset.rdelay || 0);
          el.style.transition = 'opacity .5s ease ' + i + 'ms, transform .5s cubic-bezier(.16,1,.3,1) ' + i + 'ms';
          el.style.opacity = '1'; el.style.transform = 'none';
          io.unobserve(el);
        });
      }, { threshold: 0.12 });
    }
    if (!io) return;
    var els = document.querySelectorAll('[data-reveal]');
    for (var k = 0; k < els.length; k++) {
      var el = els[k];
      if (el.dataset.rdone) continue;
      if (el.closest('[data-vp][hidden]')) continue;
      el.dataset.rdone = '1';
      el.dataset.rdelay = String((k % 8) * 55);
      el.style.opacity = '0';
      el.style.transform = 'translateY(18px)';
      io.observe(el);
    }
    compter();
  }

  function compter() {
    var els = document.querySelectorAll('[data-count]');
    for (var i = 0; i < els.length; i++) (function (el) {
      if (el.dataset.cdone) return;
      el.dataset.cdone = '1';
      var cible = parseInt(el.dataset.count, 10) || 0, debut = performance.now(), duree = 1100;
      if (matchMedia('(prefers-reduced-motion:reduce)').matches) { el.textContent = cible.toLocaleString('fr-FR'); return; }
      (function pas(t) {
        var p = Math.min(1, (t - debut) / duree);
        el.textContent = Math.round(cible * (1 - Math.pow(1 - p, 3))).toLocaleString('fr-FR');
        if (p < 1) requestAnimationFrame(pas);
      })(debut);
    })(els[i]);
  }

  function parallaxe() {
    var nav = document.getElementById('vrtNav');
    if (nav) nav.style.boxShadow = window.scrollY > 12 ? '0 4px 18px rgba(0,17,54,.10)' : 'none';
    if (matchMedia('(prefers-reduced-motion:reduce)').matches) return;
    var px = document.querySelectorAll('[data-parallax]');
    for (var i = 0; i < px.length; i++) {
      var el = px[i], r = el.getBoundingClientRect();
      var k = parseFloat(el.getAttribute('data-parallax')) || 0;
      el.style.transform = 'translate3d(0,' + ((window.innerHeight / 2 - (r.top + r.height / 2)) * k).toFixed(1) + 'px,0)';
    }
  }

  /* ── Barre compacte sous 1000 px ───────────────────────────────────────── */
  function mesurer() {
    var compact = window.innerWidth < 1000;
    document.documentElement.setAttribute('data-vrt-compact', compact ? '1' : '0');
    if (!compact && S.burger) { S.burger = false; fermerMenus(); }
  }

  /* ── Répartiteur d'actions ─────────────────────────────────────────────── */
  var A = {
    goAccueil: function () { aller('accueil'); },
    goElearning: function () { aller('elearning'); },
    goParents: function () { aller('parents'); },
    goEnseignants: function () { aller('enseignants'); },
    goTarifs: function () { aller('tarifs'); },
    goBoutique: function () { aller('boutique'); },
    commanderVedette: function () { aller('paiement'); },
    m__commander: function () { aller('paiement'); },
    // Entrées de menu et cartes : la destination est portée par data-go,
    // écrit à la construction depuis la maquette.
    u__aller: destination, pm__aller: destination,
    pl__aller: destination, mm__aller: destination,
    basculerPlus: function () { S.plus = !S.plus; fermerMenus(); },
    basculerBurger: function () { S.burger = !S.burger; fermerMenus(); },
    o__aller: function (el) {
      var i = indexDe(el, 'onglets');
      if (i < 0) return;
      S.tab = i + 1;
      rendre('onglets', D.onglets[i]);
      rendre('services', D.services[i]);
      reveler();
    },
    f__aller: function (el) {
      var i = indexDe(el, 'filtres');
      if (i < 0) return;
      S.filtre = i;
      rendre('filtres', D.filtres[i]);
    },
    mp__choisir: function (el) {
      var i = indexDe(el, 'moyensPaiement');
      if (i < 0) return;
      S.moyen = i; majPaiement();
    },
    ol__choisir: function (el) {
      var i = indexDe(el, 'optionsLivraison');
      if (i < 0) return;
      S.livr = i; majPaiement();
    },
    ajouterArticle: function () { S.qte = Math.min(S.qte + 1, 9); majTotaux(); },
    retirerArticle: function () { S.qte = Math.max(S.qte - 1, 1); majTotaux(); },
    mettreFr: function () { S.langue = 'fr'; S.trad = false; majLangue(); },
    mettreEn: function () { S.langue = 'en'; S.trad = false; majLangue(); },
    basculerTraducteur: function () {
      S.trad = !S.trad; S.ia = false;
      if (S.trad) { S.langue = S.langue === 'fr' ? 'en' : 'fr'; majLangue(); }
      panneau('vrtTrad', S.trad); panneau('vrtIA', false);
    },
    basculerTheme: function () {
      S.theme = S.theme === 'clair' ? 'sombre' : 'clair';
      appliquerTheme(S.theme);
    },
    basculerIA: function () { S.ia = !S.ia; S.trad = false; panneau('vrtIA', S.ia); panneau('vrtTrad', false); },
    ouvrirIA: function () { S.ia = true; panneau('vrtIA', true); },
    nouvelleCitation: function () {
      S.cit = (S.cit + 1) % (D.citations || [{}]).length; S.citOn = true;
      var c = D.citations[S.cit] || {};
      poser('citationTexte', c.t || ''); poser('citationAuteur', '— ' + (c.a || ''));
      panneau('vrtCit', true);
    },
    fermerCitation: function () { S.citOn = false; panneau('vrtCit', false); },
    copierPassage: function () {
      var sc = D.scal[S.langue] || {};
      var txt = '« ' + sc.passage1 + ' ' + sc.passage2 + ' »\n— Le Tube Digestif, Alobwed’Epie\nPassage du jour · VÉRITAS';
      var fini = function () {
        poser('texteBoutonCopie', 'Copié !');
        setTimeout(function () { poser('texteBoutonCopie', 'Copier le passage'); }, 2400);
      };
      if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(txt).then(fini, fini);
      else fini();
    },
    rien: function () {},
    payer: payer
  };

  /* ══════════════════════════════════════════════════════════════════════
     PAIEMENT RÉEL
     ──────────────────────────────────────────────────────────────────────
     Le bouton « Payer » était un no-op : le tunnel calculait un total puis
     ne faisait rien. On rejoue ici, en autonome, le parcours que l'appli
     suit déjà (voir _payCampayProbe / _payInitCampay dans app.js) — sans
     charger app.js, qui pèse 3,4 Mo.

     CamerPay est un parcours par REDIRECTION : le payeur choisit son moyen
     et saisit ses coordonnées sur la page hébergée du prestataire. C'est
     pour cela qu'aucun numéro de carte n'est demandé ici, et qu'il ne faut
     jamais en demander : les champs « Numéro de carte / Cryptogramme » de la
     maquette sont décoratifs, et les collecter nous ferait manipuler des
     données de carte sans en avoir ni le droit ni le besoin.
     ══════════════════════════════════════════════════════════════════════ */

  /* L'ordre suit celui des moyens affichés dans le tunnel. Ces quatre
     valeurs sont exactement celles que le serveur accepte ; toute autre
     chaîne fait répondre « Méthode inconnue ». */
  var MOYENS = ['mtn_momo', 'orange_money', 'stripe', 'paypal'];

  function apiBase() {
    try { if (location.protocol.indexOf('http') === 0) return location.origin + '/api'; } catch (e) {}
    return '';
  }

  /* Référence : VT + AAMMJJ + 4 caractères. Elle sert de clé d'idempotence
     côté serveur — deux clics sur « Payer » ne créent donc pas deux
     transactions, le second récupère l'URL déjà obtenue. */
  function nouvelleRef() {
    var d = new Date(), p = function (n) { return ('0' + n).slice(-2); };
    var al = '', C = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    for (var i = 0; i < 4; i++) al += C.charAt(Math.floor(Math.random() * C.length));
    return 'VT' + String(d.getFullYear()).slice(2) + p(d.getMonth() + 1) + p(d.getDate()) + '-' + al;
  }

  /* Sonde de configuration, mise en cache 10 minutes par onglet. La clé est
     la MÊME que celle de l'application (_vrtCampayCap2) : les deux surfaces
     partagent donc le même cache et la même rotation de jeton. */
  function sonder() {
    try {
      var brut = sessionStorage.getItem('_vrtCampayCap2');
      if (brut) {
        var c = JSON.parse(brut);
        if (c && (Date.now() - c._t) < 600000) return Promise.resolve(c);
      }
    } catch (e) {}
    var base = apiBase();
    if (!base) return Promise.resolve(null);
    return fetch(base + '/payment_camerpay.php?action=config', { method: 'GET' })
      .then(function (r) { return r.ok ? r.json() : null; })
      .then(function (d) {
        if (!d || !d.ok) return null;
        d._t = Date.now();
        try { sessionStorage.setItem('_vrtCampayCap2', JSON.stringify(d)); } catch (e) {}
        return d;
      })
      .catch(function () { return null; });   // hors ligne : repli silencieux
  }

  function montantTotal() { return 5000 * S.qte + [0, 1000, 2500][S.livr]; }

  function libelleCommande() {
    return 'Cahier VÉRITAS × ' + S.qte + ' — livraison ' + ['retrait', 'Douala', 'régions'][S.livr];
  }

  /* Message d'attente : la vitrine n'a pas le toast() de l'application, on
     écrit donc dans le libellé du bouton, qui est déjà une région pilotée. */
  function direAuPayeur(txt) { poser('libellePayer', txt); }

  var paiementEnCours = false;

  function payer() {
    if (paiementEnCours) return;                 // double-clic : une seule transaction
    var montant = montantTotal();
    if (!(montant > 0)) return;

    /* ⚠️ La fenêtre DOIT s'ouvrir pendant le clic, pas dans le .then() :
       un window.open() différé est bloqué par tous les navigateurs. On ouvre
       donc vide tout de suite et on y pose l'URL quand le serveur répond. Si
       le blocage survient malgré tout, on bascule l'onglet courant plutôt
       que de laisser le payeur dans une impasse. */
    var fen = null;
    try { fen = window.open('', '_blank'); } catch (e) { fen = null; }

    paiementEnCours = true;
    var libelleInitial = (D.scal['moyen' + S.moyen] || {}).libellePayer || 'Payer';
    direAuPayeur('Ouverture du paiement sécurisé…');

    var echec = function (msg) {
      paiementEnCours = false;
      direAuPayeur(libelleInitial);
      if (fen) { try { fen.close(); } catch (e) {} }
      alert(msg + '\n\nVous pouvez aussi commander par WhatsApp au +237 697 637 739.');
    };

    sonder().then(function (cfg) {
      if (!cfg) return echec('Le paiement en ligne est momentanément indisponible.');
      if (cfg.canCollect === false) return echec('Le paiement en ligne n\'est pas ouvert pour le moment.');

      var jeton = cfg.publicInitToken || '';
      if (!jeton) return echec('Le paiement en libre-service n\'est pas activé.');

      var ref = nouvelleRef();
      var fichier = cfg.file || 'payment_camerpay.php';

      var envoyer = function (tok, second) {
        return fetch(apiBase() + '/' + fichier + '?action=init', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + tok },
          body: JSON.stringify({
            ref: ref,
            montant: montant,
            label: libelleCommande(),
            intent: 'cart',                 // panier : aucun accès numérique à ouvrir
            methode: MOYENS[S.moyen] || '',
            lignes: [{ nom: 'Cahier VÉRITAS', qte: S.qte, pu: 5000 },
                     { nom: 'Livraison', qte: 1, pu: [0, 1000, 2500][S.livr] }]
          })
        })
        /* On conserve le code HTTP : un 401 ne se traite pas comme les
           autres erreurs, et .then(r => r.json()) le jetterait. */
        .then(function (r) {
          return r.json().then(
            function (j) { j._http = r.status; return j; },
            function () { return { error: 'Réponse illisible du serveur', _http: r.status }; }
          );
        })
        .then(function (data) {
          /* 401 : le cas normal n'est pas une attaque, c'est une ROTATION du
             jeton public pendant que notre sonde dormait en cache. Sans ce
             rattrapage, tout visiteur ayant ouvert la page avant la rotation
             se heurte à un mur pendant dix minutes — sur l'écran même où il
             allait payer. On purge, on re-sonde, on rejoue UNE fois. */
          if (data._http === 401 && !second) {
            try { sessionStorage.removeItem('_vrtCampayCap2'); } catch (e) {}
            return sonder().then(function (c2) {
              if (!c2 || !c2.publicInitToken) { echec('Session de paiement expirée. Rechargez la page.'); return; }
              return envoyer(c2.publicInitToken, true);
            });
          }
          if (data.error) return echec(data.error);
          if (!data.pay_url) return echec('Le serveur n\'a pas renvoyé de page de paiement.');

          if (window.veritasTrack) window.veritasTrack('paiement_init', { ref: ref, montant: montant });
          if (fen) { fen.location = data.pay_url; }
          else { location.href = data.pay_url; }   // fenêtre bloquée : on bascule l'onglet
          paiementEnCours = false;
          direAuPayeur(libelleInitial);
        });
      };

      return envoyer(jeton, false);
    }).catch(function () { echec('Le paiement n\'a pas pu être lancé.'); });
  }

  function destination(el) {
    var cible = el && el.getAttribute && el.getAttribute('data-go');
    if (!cible) { var p = el && el.closest && el.closest('[data-go]'); cible = p && p.getAttribute('data-go'); }
    if (cible) aller(cible);
  }

  function panneau(id, ouvert) {
    var el = document.getElementById(id);
    if (el) el.hidden = !ouvert;
  }

  function indexDe(el, region) {
    var item = el && el.closest('[data-vrt-item="' + region + '"]');
    if (!item) return -1;
    var tous = document.querySelectorAll('[data-vrt-item="' + region + '"]');
    return Array.prototype.indexOf.call(tous, item);
  }

  window.VRT = {
    act: function (nom, el, ev) {
      if (ev && ev.preventDefault) ev.preventDefault();
      var fn = A[nom];
      if (fn) fn(el, ev);
    },
    etat: S
  };

  /* ── Démarrage ─────────────────────────────────────────────────────────── */
  function demarrer() {
    mesurer();
    window.addEventListener('resize', mesurer);
    window.addEventListener('scroll', parallaxe, { passive: true });
    parallaxe();
    reveler();

    try {
      var t = localStorage.getItem('vrt_theme');
      if (t === 'sombre') { S.theme = 'sombre'; appliquerTheme('sombre'); }
    } catch (e) {}

    // Écran d'arrivée depuis l'ancre (#tarifs, #boutique…)
    var h = (location.hash || '').replace('#', '');
    if (h && document.querySelector('[data-vp="' + h + '"]')) aller(h);

    /* Le hash était lu UNE SEULE FOIS, au démarrage. Conséquence : un lien
       <a href="#tarifs"> changeait l'adresse sans changer d'écran — le
       visiteur cliquait, l'URL bougeait, la page restait. C'est ce qui
       obligeait à renvoyer ces liens vers app.html, et donc ce qui
       fabriquait la « double interface ». Avec cette écoute, une ancre
       interne devient un vrai lien : elle fonctionne au clic, au bouton
       Retour du navigateur, et quand on la colle dans la barre d'adresse. */
    window.addEventListener('hashchange', function () {
      var n = (location.hash || '').replace('#', '');
      if (!n) { if (S.page !== 'accueil') aller('accueil'); return; }
      if (n === S.page) return;                                   // déjà là : ne pas re-rendre
      if (document.querySelector('[data-vp="' + n + '"]')) aller(n);
    });

    // Rotation des citations, comme dans la maquette : toutes les 45 s.
    setInterval(function () {
      if (!S.citOn) return;
      S.cit = (S.cit + 1) % (D.citations || [{}]).length;
      var c = D.citations[S.cit] || {};
      poser('citationTexte', c.t || ''); poser('citationAuteur', '— ' + (c.a || ''));
    }, 45000);

    // Fermer les menus au clic extérieur.
    document.addEventListener('click', function (e) {
      if (S.plus && !e.target.closest('#vrtPlusWrap')) { S.plus = false; fermerMenus(); }
    });
    document.addEventListener('keydown', function (e) {
      if (e.key !== 'Escape') return;
      S.plus = S.burger = S.ia = S.trad = false;
      fermerMenus(); panneau('vrtIA', false); panneau('vrtTrad', false);
    });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', demarrer);
  else demarrer();
})();
