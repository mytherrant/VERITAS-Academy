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
    ia: false, trad: false, cit: 0, citOn: true, copie: false,
    // Ce que le payeur a tapé. Survit aux re-rendus du tunnel (voir champsDuMoment).
    saisie: { vpNom: '', vpTel: '', vpTel2: '', vpMail: '', vpAdr: '' }
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
    /* ⚠️ DÉFILEMENT INSTANTANÉ, et surtout pas animé.
       Changer d'écran est une NAVIGATION : on doit arriver en haut, tout de
       suite. Avec un défilement animé, la séquence est la suivante — on est à
       5 000 px sur la boutique, on clique « Commander », l'écran du tunnel
       (plus court) s'affiche, le navigateur RABAT d'abord la position sur le
       nouveau maximum, c'est-à-dire tout en bas, puis commence à remonter.
       Pendant ces quelques centaines de millisecondes, le visiteur voit le
       pied de page — c'est exactement ce que montrait la capture de Jacques :
       un grand vide et les mentions légales, en réponse à « Commander ».
       `scroll-behavior:smooth` posé sur <html> imposait la même animation à
       cet appel : on tranche explicitement ici. */
    try { window.scrollTo({ top: 0, left: 0, behavior: 'instant' }); }
    catch (e) { window.scrollTo(0, 0); }
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

  /* ── Tunnel de paiement ──────────────────────────────────────────────────
     Ce que le payeur saisit vit ICI, pas dans le DOM. `rendre()` remplace les
     nœuds à chaque changement de moyen ou de livraison : une valeur laissée
     dans l'<input> serait effacée sous les doigts du payeur au moment même
     où il choisit sa livraison. On relit donc depuis S.saisie à chaque
     rendu, et un écouteur DÉLÉGUÉ (posé une seule fois sur le document)
     enregistre les frappes — un écouteur par champ ne survivrait pas au
     remplacement des nœuds. */
  function champsDuMoment() {
    var liste = (D.champsPaiement[S.moyen] || []).slice();
    // L'adresse n'a de sens que si l'on livre. On ne demande pas où livrer
    // à quelqu'un qui vient retirer au centre.
    if (S.livr > 0 && D.champLivraison) liste = liste.concat(D.champLivraison);
    return liste.map(function (c) {
      var o = {}; for (var k in c) if (Object.prototype.hasOwnProperty.call(c, k)) o[k] = c[k];
      o.valeur = S.saisie[c.champ] || '';
      return o;
    });
  }

  function majPaiement() {
    rendre('moyensPaiement', D.moyensPaiement[S.moyen]);
    rendre('champsPaiement', champsDuMoment());
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
    /* Repère de thème sur <html>.
       Le thème sombre de la maquette reconnaît les surfaces en cherchant une
       CHAÎNE dans les styles en ligne : [style*="background:#fff"], etc. Le
       procédé tient tant que rien ne bouge, mais il rate toute surface dont
       le fond vient d'une feuille et non d'un attribut — et il assombrit
       alors le texte sans assombrir son fond, ce qui donne du gris clair sur
       du blanc. Mesuré sur l'écran tarifs : 21 textes sous le seuil en mode
       sombre contre 10 en clair.
       Cet attribut donne une prise STABLE, indépendante du style en ligne,
       pour écrire de vraies règles sombres. */
    try { document.documentElement.setAttribute('data-vrt-theme', mode); } catch (e) {}
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
    basculerIA: function () { S.ia = !S.ia; S.trad = false; panneau('vrtIA', S.ia); panneau('vrtTrad', false); if (S.ia) { majIAQuota(); var i = document.getElementById('vrtIAInput'); if (i) try { i.focus(); } catch (e) {} } },
    ouvrirIA: function () { S.ia = true; panneau('vrtIA', true); majIAQuota(); var i = document.getElementById('vrtIAInput'); if (i) try { i.focus(); } catch (e) {} },
    ambassaEnvoyer: function () { ambassaEnvoyer(); },
    ambassaSuggestion: function (el) { ambassaSuggestion(el); },
    ambassaOutil: function (el) { ambassaOutil(el); },
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
    actus: function (el) {
      var cat = el && el.getAttribute('data-cat');
      if (!cat) return;
      var tabs = document.querySelectorAll('.vnews-tab');
      for (var i = 0; i < tabs.length; i++) tabs[i].classList.toggle('on', tabs[i] === el);
      chargerActus(cat);
    },
    payer: payer
  };

  /* ══════════════════════════════════════════════════════════════════════
     ACTUALITÉS — MINESEC, bourses, concours
     ──────────────────────────────────────────────────────────────────────
     Source : api/news_proxy.php, qui sert déjà quatre flux publics et les
     met en cache côté serveur. Rien n'est écrit à la main ici : si le flux
     ne répond pas, le bloc reste MASQUÉ. Une rubrique « Actualités » vide
     coûte plus cher qu'une rubrique absente — elle donne l'impression d'un
     site à l'abandon, sur la page qui doit inspirer le contraire.
     ══════════════════════════════════════════════════════════════════════ */
  var actusCache = {};

  function chargerActus(cat) {
    var liste = document.getElementById('vrtNewsListe');
    var bloc = document.getElementById('vrtNews');
    if (!liste || !bloc) return;

    if (actusCache[cat]) { poserActus(actusCache[cat]); return; }

    var base = apiBase();
    if (!base) return;                       // ouvert en file:// : pas d'API
    liste.innerHTML = '<li class="vnews-vide">Chargement…</li>';
    bloc.hidden = false;

    fetch(base + '/news_proxy.php?cat=' + encodeURIComponent(cat))
      .then(function (r) { return r.ok ? r.json() : null; })
      .then(function (d) {
        var items = (d && d.items) || [];
        actusCache[cat] = items;
        poserActus(items);
      })
      .catch(function () { poserActus([]); });
  }

  function poserActus(items) {
    var liste = document.getElementById('vrtNewsListe');
    var bloc = document.getElementById('vrtNews');
    if (!liste || !bloc) return;

    if (!items.length) {
      /* Aucun titre : on referme. Si AUCUNE catégorie n'a jamais répondu, la
         colonne disparaît et le calendrier reprend toute la largeur — la
         grille est en `1fr` dès qu'un seul enfant subsiste. */
      liste.innerHTML = '';
      bloc.hidden = true;
      return;
    }

    var html = '';
    for (var i = 0; i < items.length && i < 7; i++) {
      var it = items[i] || {};
      /* Liens SORTANTS vers la presse : `noopener` (l'onglet ouvert ne doit
         pas pouvoir réécrire le nôtre) et `nofollow` (nous ne cautionnons pas
         éditorialement des titres que nous n'avons pas écrits). */
      html += '<li><a href="' + ech(it.link || '#') + '" target="_blank" rel="noopener nofollow">'
            + '<span class="vnews-t">' + ech(it.title || '') + '</span>'
            + '<span class="vnews-m">' + ech(it.source || '') + (it.date ? ' · ' + ech(it.date) : '') + '</span>'
            + '</a></li>';
    }
    liste.innerHTML = html;
    bloc.hidden = false;
  }

  function ech(s) {
    return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;')
                    .replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }

  /* ── La prochaine date clé ───────────────────────────────────────────────
     Le bloc est pré-rendu : la page ne peut pas savoir, à la construction,
     quel jour on est. On met donc en avant ici la PREMIÈRE échéance encore à
     venir. Si l'année scolaire est terminée — toutes les dates passées — on
     n'en souligne aucune : mettre en avant une date écoulée serait pire que
     de n'en mettre aucune. */
  function marquerProchaineDate() {
    var lignes = document.querySelectorAll('.vcle[data-jour]');
    if (!lignes.length) return;
    var t = new Date(), au = t.getFullYear() + '-'
          + ('0' + (t.getMonth() + 1)).slice(-2) + '-' + ('0' + t.getDate()).slice(-2);
    for (var i = 0; i < lignes.length; i++) {
      var j = lignes[i].getAttribute('data-jour');
      if (j && j >= au) { lignes[i].classList.add('vcle-next'); return; }
    }
  }

  /* ── Anneaux de résultats ────────────────────────────────────────────────
     Ils sont écrits REMPLIS dans le HTML (voir build_vitrine.js) : sans JS,
     ils affichent le bon taux. On ne les remet à zéro que juste avant de les
     rejouer, et seulement quand ils entrent dans l'écran — remettre à zéro un
     anneau déjà visible ferait clignoter le chiffre. */
  function animerAnneaux() {
    var anneaux = document.querySelectorAll('.vring');
    if (!anneaux.length || !('IntersectionObserver' in window)) return;
    if (matchMedia('(prefers-reduced-motion:reduce)').matches) return;

    var obs = new IntersectionObserver(function (es) {
      es.forEach(function (e) {
        if (!e.isIntersecting) return;
        var el = e.target;
        el.classList.add('vring-anim');            // passe la main à la feuille
        // Deux images d'écart : le temps que --vr-deg:0 soit appliqué, sinon
        // la transition n'a pas d'état de départ et l'anneau saute.
        requestAnimationFrame(function () {
          requestAnimationFrame(function () { el.classList.add('vring-on'); });
        });
        obs.unobserve(el);
      });
    }, { threshold: 0.35 });

    for (var i = 0; i < anneaux.length; i++) obs.observe(anneaux[i]);
  }

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

  /* ── Contrôle des coordonnées ───────────────────────────────────────────
     Le tunnel encaissait sans savoir QUI paie ni OÙ livrer. Ces trois règles
     sont le minimum pour qu'une commande soit exécutable :
       · un nom, pour rapprocher le versement de la commande ;
       · un numéro camerounais valide (9 chiffres, ou 12 avec l'indicatif) —
         c'est aussi celui que le serveur normalise et renvoie au prestataire
         pour préremplir sa page ;
       · une adresse dès qu'on livre, puisqu'on la facture.
     La confirmation du numéro n'est pas un ornement : un chiffre inversé sur
     un numéro Mobile Money, et le paiement part chez quelqu'un d'autre. */
  function numeroNormalise(t) {
    var n = String(t || '').replace(/[^0-9]/g, '');
    if (n.length === 12 && n.indexOf('237') === 0) n = n.slice(3);
    return n;
  }

  function verifierSaisie() {
    var v = S.saisie;
    if ((v.vpNom || '').trim().length < 3) return { champ: 'vpNom', msg: 'Indiquez le nom de la personne qui commande.' };
    var tel = numeroNormalise(v.vpTel);
    if (!/^6[0-9]{8}$/.test(tel)) return { champ: 'vpTel', msg: 'Numéro camerounais attendu : 9 chiffres commençant par 6.' };
    // Le second champ n'existe que pour Mobile Money (moyens 0 et 1).
    if (S.moyen < 2 && numeroNormalise(v.vpTel2) !== tel) {
      return { champ: 'vpTel2', msg: 'Les deux numéros ne correspondent pas.' };
    }
    if (v.vpMail && !/^[^@\s]+@[^@\s]+\.[^@\s]{2,}$/.test(v.vpMail.trim())) {
      return { champ: 'vpMail', msg: 'Adresse e-mail invalide.' };
    }
    if (S.livr > 0 && (v.vpAdr || '').trim().length < 8) {
      return { champ: 'vpAdr', msg: 'Indiquez où livrer : quartier, rue, point de repère.' };
    }
    return null;
  }

  /* Le message se pose SOUS le champ fautif, pas dans une alerte : sur
     téléphone, une alerte masque le formulaire qu'elle commente. */
  function signalerChamp(id, msg) {
    var el = document.getElementById(id);
    if (!el) { alert(msg); return; }
    var boite = el.closest('label') || el.parentNode;
    var vieux = boite.querySelector('.vp-err');
    if (vieux) vieux.parentNode.removeChild(vieux);
    var p = document.createElement('span');
    p.className = 'vp-err';
    p.setAttribute('role', 'alert');
    p.style.cssText = 'font:400 12.5px Poppins,sans-serif;color:#B3261E;margin-top:2px';
    p.textContent = msg;
    boite.appendChild(p);
    el.style.borderColor = '#B3261E';
    el.setAttribute('aria-invalid', 'true');
    try { el.focus({ preventScroll: false }); } catch (e) { el.focus(); }
  }

  function effacerErreurs() {
    var es = document.querySelectorAll('.vp-err');
    for (var i = 0; i < es.length; i++) es[i].parentNode.removeChild(es[i]);
    var ins = document.querySelectorAll('[aria-invalid="true"]');
    for (var j = 0; j < ins.length; j++) {
      ins[j].removeAttribute('aria-invalid');
      ins[j].style.borderColor = '';
    }
  }

  /* Message d'attente : la vitrine n'a pas le toast() de l'application, on
     écrit donc dans le libellé du bouton, qui est déjà une région pilotée. */
  function direAuPayeur(txt) { poser('libellePayer', txt); }

  var paiementEnCours = false;

  function payer() {
    if (paiementEnCours) return;                 // double-clic : une seule transaction
    var montant = montantTotal();
    if (!(montant > 0)) return;

    /* Coordonnées AVANT tout : rien ne sert d'ouvrir une fenêtre de paiement
       pour une commande qu'on ne pourra ni rattacher à quelqu'un ni livrer. */
    effacerErreurs();
    var faute = verifierSaisie();
    if (faute) { signalerChamp(faute.champ, faute.msg); return; }

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
            /* Ces trois-là partaient VIDES : le centre encaissait sans savoir
               qui avait payé. Le serveur les enregistre dans l'état de la
               transaction et préremplit la page du prestataire avec. */
            clientNom: (S.saisie.vpNom || '').trim(),
            clientTel: numeroNormalise(S.saisie.vpTel),
            clientEmail: (S.saisie.vpMail || '').trim(),
            lignes: [{ nom: 'Cahier VÉRITAS', qte: S.qte, pu: 5000 },
                     { nom: 'Livraison ' + ['(retrait au centre)', 'Douala', 'régions'][S.livr]
                            + (S.livr > 0 ? ' — ' + (S.saisie.vpAdr || '').trim() : ''),
                       qte: 1, pu: [0, 1000, 2500][S.livr] }]
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

  /* ══════════════════════════════════════════════════════════════════════
     RETOUR DU PAYEUR — le point le plus coûteux de toute la refonte
     ──────────────────────────────────────────────────────────────────────
     Le serveur fixe l'adresse de retour à « <site>/#paiement?ref=VT… »
     (camerpayReturnUrl, payment_camerpay.php). Tant que « / » servait
     l'application, app.js la lisait (_payResumeFromHash). Depuis que « / »
     sert la vitrine, PLUS PERSONNE ne la lit : le payeur revient de la page
     du prestataire sur l'accueil, sans un mot. Il a payé et rien ne le dit —
     alors il repaie, ou il appelle. Cela vaut pour TOUS les paiements du
     site, pas seulement ceux du panier de la vitrine.

     On rejoue donc ici, en autonome, ce que fait l'application : on interroge
     `?action=status` jusqu'à ce que le serveur tranche. L'autorité reste le
     webhook côté serveur, re-vérifié auprès du prestataire ; cet écran ne
     fait que MONTRER l'issue, il n'ouvre aucun droit.
     ══════════════════════════════════════════════════════════════════════ */
  var suiviTimer = null;

  function panneauSuivi(ref, etat, texte, couleur) {
    var el = document.getElementById('vrtSuivi');
    if (!el) {
      el = document.createElement('div');
      el.id = 'vrtSuivi';
      el.setAttribute('role', 'status');
      el.setAttribute('aria-live', 'polite');
      el.style.cssText = 'position:fixed;left:50%;transform:translateX(-50%);bottom:22px;z-index:200;'
        + 'max-width:min(560px,calc(100vw - 24px));background:#fff;border:1px solid #E4E7EF;'
        + 'border-radius:14px;box-shadow:0 18px 40px rgba(0,17,54,.16);padding:16px 18px;'
        + 'font:400 14px Poppins,sans-serif;color:#16233F';
      document.body.appendChild(el);
    }
    el.innerHTML = '';
    var t = document.createElement('div');
    t.style.cssText = 'font-weight:600;color:' + couleur + ';margin-bottom:4px';
    t.textContent = etat;
    var p = document.createElement('div');
    p.style.cssText = 'line-height:1.55;color:#4D5163';
    p.textContent = texte;
    var r = document.createElement('div');
    r.style.cssText = 'margin-top:8px;font:400 12px Poppins,sans-serif;color:#8A90A2';
    r.textContent = 'Référence : ' + ref;
    var x = document.createElement('button');
    x.type = 'button';
    x.textContent = 'Fermer';
    x.style.cssText = 'margin-top:12px;border:1px solid #E4E7EF;background:#F6F8FC;border-radius:9px;'
      + 'padding:8px 14px;font:500 13px Poppins,sans-serif;color:#16233F;cursor:pointer';
    x.onclick = function () {
      if (suiviTimer) { clearTimeout(suiviTimer); suiviTimer = null; }
      el.parentNode.removeChild(el);
    };
    el.appendChild(t); el.appendChild(p); el.appendChild(r); el.appendChild(x);
  }

  function suivrePaiement(ref) {
    var base = apiBase();
    if (!base) return;
    var essais = 0;
    panneauSuivi(ref, 'Vérification de votre paiement…',
      'La confirmation vient de l’opérateur, pas de votre navigateur : cela peut prendre quelques secondes. Ne payez pas une seconde fois.',
      '#1E499B');
    var tour = function () {
      fetch(base + '/payment_camerpay.php?action=status&ref=' + encodeURIComponent(ref))
        .then(function (r) { return r.ok ? r.json() : null; })
        .then(function (d) {
          var st = d && d.status;
          if (st === 'paid' || st === 'success' || st === 'confirmed') {
            panneauSuivi(ref, '✓ Paiement confirmé',
              'Merci. Le centre a bien reçu votre règlement' + (d.sandbox ? ' (mode test)' : '')
              + '. Vous recevrez votre reçu ; en cas de question, écrivez au +237 697 637 739.', '#007E11');
            return;
          }
          if (st === 'failed' || st === 'cancelled' || st === 'expired') {
            panneauSuivi(ref, 'Paiement non abouti',
              (d && d.reason ? d.reason + ' ' : '') + 'Aucun montant n’a été prélevé. Vous pouvez réessayer ou commander par WhatsApp au +237 697 637 739.',
              '#B3261E');
            return;
          }
          /* Deux minutes de patience, puis on rend la main : au-delà, c'est
             le webhook qui tranchera, et faire tourner une boucle indéfinie
             sur un forfait mobile est une impolitesse. */
          if (++essais > 24) {
            panneauSuivi(ref, 'Vérification en cours côté opérateur',
              'Votre paiement est en cours de confirmation. Notez la référence ci-dessous : si rien n’arrive d’ici une heure, envoyez-la nous sur WhatsApp au +237 697 637 739.',
              '#C24E00');
            return;
          }
          suiviTimer = setTimeout(tour, 5000);
        })
        .catch(function () {
          if (++essais > 24) return;
          suiviTimer = setTimeout(tour, 5000);
        });
    };
    tour();
  }

  function lireRetourPaiement() {
    var h = String(location.hash || '');
    // Ancrage STRICT sur la forme produite par camerpayReturnUrl().
    var q = h.match(/^#?paiement\?(.+)$/);
    if (!q) return false;
    var m = ('&' + q[1]).match(/[?&]ref=([^&]+)/);
    if (!m) return false;
    var ref = '';
    try { ref = decodeURIComponent(m[1]); } catch (e) { ref = m[1]; }
    if (!ref) return false;
    // Le hash ne doit pas rouvrir l'écran à chaque F5.
    try { history.replaceState(null, '', location.pathname + location.search); } catch (e) {}
    suivrePaiement(ref);
    return true;
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

  /* ══════════════════════════════════════════════════════════════════════
     PROFESSEUR AMBASSA — le tuteur IA, sur l'accueil (v1.19.30)
     ──────────────────────────────────────────────────────────────────────
     Le widget de l'accueil était une MAQUETTE MORTE : le bouton « Envoyer »
     appelait VRT.act('rien'). On le branche ici sur le VRAI proxy serveur
     (api/ia_proxy.php) — le même que l'application. La clé IA reste côté
     serveur ; le client n'envoie qu'un prompt. Le serveur borne déjà les
     coûts (rate-limit par IP 15/min · 300/jour · plafond global). Ce compteur
     hebdomadaire local n'est qu'un garde-fou d'INTERFACE pour honorer la
     promesse « 3 questions offertes / semaine » et inviter à s'abonner ;
     l'anti-abus réel est côté serveur.
     ══════════════════════════════════════════════════════════════════════ */
  var IA_MAX_SEM = 3;          // questions offertes/semaine (aligné sur la copie)
  var iaEnCours = false;       // anti double-soumission

  function iaSemaineCle() {
    var d = new Date();
    var jour1 = new Date(d.getFullYear(), 0, 1);
    var sem = Math.ceil((((d - jour1) / 86400000) + jour1.getDay() + 1) / 7);
    return 'vrt_ia_sem_' + d.getFullYear() + '_' + sem;
  }
  function iaQuotaRestant() {
    try { var n = parseInt(localStorage.getItem(iaSemaineCle()) || '0', 10) || 0; return Math.max(0, IA_MAX_SEM - n); }
    catch (e) { return IA_MAX_SEM; }
  }
  function iaQuotaConsommer() {
    try { var k = iaSemaineCle(); var n = parseInt(localStorage.getItem(k) || '0', 10) || 0; localStorage.setItem(k, String(n + 1)); }
    catch (e) {}
  }
  function majIAQuota() {
    var el = document.getElementById('vrtIAQuota');
    if (!el) return;
    var r = iaQuotaRestant();
    el.textContent = r > 0
      ? ('Il te reste ' + r + ' question' + (r > 1 ? 's' : '') + ' cette semaine · 30/jour avec le plan Pro')
      : 'Questions offertes épuisées pour cette semaine · passe au plan Pro pour 30/jour';
  }
  function iaBulle(role, texte) {
    var msgs = document.getElementById('vrtIAMsgs');
    if (!msgs) return null;
    var el = document.createElement('div');
    if (role === 'user') {
      el.style.cssText = 'align-self:flex-end;max-width:85%;background:linear-gradient(135deg,#7C6BD6,#5B4FA8);color:#fff;border-radius:12px;border-bottom-right-radius:4px;padding:10px 13px;font:400 13.5px/1.6 Poppins,sans-serif;text-wrap:pretty;white-space:pre-wrap';
    } else {
      el.style.cssText = 'align-self:flex-start;max-width:92%;background:#fff;border:1px solid #EFF2F7;color:#4D5163;border-radius:12px;border-top-left-radius:4px;padding:11px 14px;font:400 13.5px/1.65 Poppins,sans-serif;text-wrap:pretty;white-space:pre-wrap';
    }
    el.textContent = texte; // JAMAIS innerHTML pour du texte IA → aucune injection possible
    msgs.appendChild(el);
    msgs.scrollTop = msgs.scrollHeight;
    return el;
  }
  function iaBulleQuota() {
    // Message de mur d'abonnement — contenu FIXE (aucune donnée utilisateur),
    // innerHTML sûr : on veut un lien cliquable vers les tarifs.
    var msgs = document.getElementById('vrtIAMsgs');
    if (!msgs) return;
    var el = document.createElement('div');
    el.style.cssText = 'align-self:stretch;background:linear-gradient(135deg,#FFF7ED,#FEF3E7);border:1px solid #FCD9B6;color:#7A4B1E;border-radius:12px;padding:12px 14px;font:400 13px/1.6 Poppins,sans-serif;text-wrap:pretty';
    el.innerHTML = 'Tu as utilisé tes <b>3 questions offertes de la semaine</b>. '
      + 'Le Professeur Ambassa répond sans limite (30/jour) avec un abonnement. '
      + '<button type="button" onclick="VRT.act(\'goTarifs\',this,event)" style="margin-top:8px;background:#5B4FA8;color:#fff;border:0;border-radius:9px;padding:8px 14px;font:600 12.5px Poppins,sans-serif;cursor:pointer">Voir les abonnements →</button>';
    msgs.appendChild(el);
    msgs.scrollTop = msgs.scrollHeight;
  }
  function ambassaEnvoyer() {
    var input = document.getElementById('vrtIAInput');
    if (!input) return;
    var q = (input.value || '').trim();
    if (!q || iaEnCours) return;
    if (q.length > 2000) q = q.slice(0, 2000);

    var base = apiBase();
    if (!base) { // ouvert en file:// ou hors ligne : pas d'API joignable
      iaBulle('bot', '⚠️ Le tuteur a besoin d\'une connexion Internet. Ouvre le site en ligne pour discuter avec le Professeur Ambassa.');
      return;
    }
    if (iaQuotaRestant() <= 0) { input.value = ''; iaBulleQuota(); return; }

    input.value = '';
    iaBulle('user', q);
    iaEnCours = true;
    var send = document.getElementById('vrtIASend');
    if (send) { send.disabled = true; send.style.opacity = '.55'; send.style.cursor = 'default'; }
    var bot = iaBulle('bot', '…'); // indicateur d'attente
    if (bot) bot.setAttribute('aria-busy', 'true');

    // Un outil actif (quiz, fiche, correction, méthode) CADRE la question ;
    // l'élève, lui, ne tape que son sujet.
    var envoi = (iaOutil && IA_OUTILS[iaOutil]) ? (IA_OUTILS[iaOutil].p + q) : q;

    fetch(base + '/ia_proxy.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt: envoi, plan: 'anon', userId: '' })
    })
      .then(function (r) { return r.json().then(function (j) { return { ok: r.ok, status: r.status, j: j }; }, function () { return { ok: r.ok, status: r.status, j: {} }; }); })
      .then(function (res) {
        iaEnCours = false;
        if (send) { send.disabled = false; send.style.opacity = ''; send.style.cursor = 'pointer'; }
        var j = res.j || {};
        if (bot) bot.removeAttribute('aria-busy');
        if (res.ok && j.text && !/legacy text API|deprecat/i.test(j.text)) {
          if (bot) bot.textContent = j.text;
          iaQuotaConsommer();
          majIAQuota();
        } else if (res.status === 429) {
          if (bot) bot.textContent = '⚠️ ' + (j.error || 'Trop de questions d\'un coup — patiente une minute puis réessaie.');
        } else if (bot) {
          bot.textContent = j.error
            ? ('⚠️ ' + j.error)
            : '⚠️ Le Professeur Ambassa est momentanément indisponible. Réessaie dans un instant.';
        }
      })
      .catch(function () {
        iaEnCours = false;
        if (send) { send.disabled = false; send.style.opacity = ''; send.style.cursor = 'pointer'; }
        if (bot) { bot.removeAttribute('aria-busy'); bot.textContent = '⚠️ Connexion interrompue. Vérifie ta connexion et réessaie.'; }
      });
  }
  function ambassaSuggestion(el) {
    var input = document.getElementById('vrtIAInput');
    if (!input || !el) return;
    input.value = (el.textContent || '').trim();
    ambassaEnvoyer();
  }

  /* Les OUTILS d'Ambassa (quiz, fiche, correction, méthode). Le tuteur de
     l'application sait faire tout cela ; sur l'accueil, on expose les mêmes
     usages en cadrant le prompt — même proxy, même quota, aucune clé exposée.
     Le mode reste actif jusqu'à ce qu'on en change : on l'annonce dans le fil
     pour que l'élève sache à quoi il parle. */
  var IA_OUTILS = {
    quiz:     { l: 'Quiz',     ph: 'Sur quel chapitre veux-tu un quiz ?',      an: 'Mode Quiz — dis-moi le chapitre et ta classe, je te prépare 5 questions.',
                p: 'Prépare un QUIZ de 5 questions (QCM à 4 options, une seule correcte) conforme au programme MINESEC sur : ' },
    fiche:    { l: 'Fiche',    ph: 'Quelle notion veux-tu réviser ?',          an: 'Mode Fiche — donne-moi la notion, je fais une fiche de révision.',
                p: 'Rédige une FICHE DE RÉVISION synthétique (définitions, points-clés, méthode, exemple, piège d\'examen) conforme au programme MINESEC sur : ' },
    corriger: { l: 'Corriger', ph: 'Colle ta réponse ou ta copie…',            an: 'Mode Correction — colle ta réponse, je corrige avec le barème.',
                p: 'CORRIGE la production suivante selon les grilles harmonisées MINESEC : donne une note indicative, les critères, ce qui est réussi, ce qui doit être repris, puis un conseil de méthode. Production de l\'élève : ' },
    methode:  { l: 'Méthode',  ph: 'Quel exercice te bloque ?',                an: 'Mode Méthode — dis-moi l\'exercice, je donne la démarche (pas la réponse).',
                p: 'Explique la MÉTHODE pas à pas (la démarche, pas la réponse toute faite) pour traiter : ' }
  };
  var iaOutil = '';
  function ambassaOutil(el) {
    var k = el && el.getAttribute ? el.getAttribute('data-outil') : '';
    var o = IA_OUTILS[k];
    if (!o) return;
    iaOutil = k;
    var input = document.getElementById('vrtIAInput');
    if (input) { input.placeholder = o.ph; try { input.focus(); } catch (e) {} }
    // Marquer visuellement l'outil actif.
    var barre = el.parentNode ? el.parentNode.querySelectorAll('[data-outil]') : [];
    for (var i = 0; i < barre.length; i++) {
      var on = barre[i] === el;
      barre[i].style.background = on ? '#5B4FA8' : '#fff';
      barre[i].style.color = on ? '#fff' : '#5B4FA8';
      barre[i].setAttribute('aria-pressed', on ? 'true' : 'false');
    }
    iaBulle('bot', o.an);
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
    marquerProchaineDate();
    animerAnneaux();
    /* Les actualités partent APRÈS le premier rendu : elles viennent d'un flux
       externe (via notre proxy), elles ne doivent pas retarder d'une
       milliseconde l'affichage de la page. L'onglet MINESEC est celui qui
       ouvre — c'est la source officielle. */
    setTimeout(function () { chargerActus('minesec'); }, 400);

    try {
      var t = localStorage.getItem('vrt_theme');
      if (t === 'sombre') { S.theme = 'sombre'; appliquerTheme('sombre'); }
    } catch (e) {}

    /* Le tunnel est pré-rendu dans le document avec les champs de la maquette :
       sans identifiant, donc illisibles, et pour l'un des moyens seulement.
       Un payeur les remplissait puis se voyait répondre « indiquez votre
       nom » sur le champ qu'il venait de remplir. On les remplace dès le
       démarrage par les champs réels — l'écran est caché à ce moment-là,
       personne ne voit le remplacement. */
    try { majPaiement(); } catch (e) {}

    /* Entrée = envoyer sa question au Professeur Ambassa. Écouteur délégué au
       document : le champ #vrtIAInput est pré-rendu (panneau simplement caché),
       mais la délégation reste robuste aux re-rendus éventuels. */
    document.addEventListener('keydown', function (e) {
      if (e.target && e.target.id === 'vrtIAInput' && e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        ambassaEnvoyer();
      }
    });

    /* Frappes du tunnel : un SEUL écouteur, délégué au document. Les champs
       sont détruits et recréés à chaque changement de moyen ou de livraison ;
       un écouteur posé sur l'élément ne leur survivrait pas. */
    document.addEventListener('input', function (e) {
      var id = e.target && e.target.id;
      if (id && Object.prototype.hasOwnProperty.call(S.saisie, id)) {
        S.saisie[id] = e.target.value;
        var boite = e.target.closest ? e.target.closest('label') : null;
        var err = boite && boite.querySelector('.vp-err');
        if (err) { err.parentNode.removeChild(err); e.target.style.borderColor = ''; e.target.removeAttribute('aria-invalid'); }
      }
    });

    // Retour du prestataire de paiement — AVANT le routage d'écran : le hash
    // « #paiement?ref=… » ne désigne pas un écran, il porte une issue.
    var retour = lireRetourPaiement();

    // Écran d'arrivée depuis l'ancre (#tarifs, #boutique…)
    var h = retour ? '' : (location.hash || '').replace('#', '');
    if (h && document.querySelector('[data-vp="' + h + '"]')) aller(h);

    /* Le hash était lu UNE SEULE FOIS, au démarrage. Conséquence : un lien
       <a href="#tarifs"> changeait l'adresse sans changer d'écran — le
       visiteur cliquait, l'URL bougeait, la page restait. C'est ce qui
       obligeait à renvoyer ces liens vers app.html, et donc ce qui
       fabriquait la « double interface ». Avec cette écoute, une ancre
       interne devient un vrai lien : elle fonctionne au clic, au bouton
       Retour du navigateur, et quand on la colle dans la barre d'adresse. */
    window.addEventListener('hashchange', function () {
      // Certains navigateurs mobiles réécrivent le hash sans recharger : le
      // retour de paiement peut donc arriver ici plutôt qu'au démarrage.
      if (lireRetourPaiement()) return;
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

/* ============================================================================
 *  BARRE DE RECHERCHE DE L'ACCUEIL  (v1.19.20)
 *
 *  L'accueil portait une vraie barre de recherche (v1.17, `acc-rech`, branchée
 *  sur mRecherche + index de 35 Ko). Elle vivait dans le rendu de l'accueil de
 *  l'APPLICATION — supprimé en v1.19.16. L'accueil, c'est désormais la vitrine,
 *  et il n'y restait qu'une loupe dans la barre du haut : une icône que l'on
 *  découvre au survol, pas un champ où l'on tape.
 *
 *  La vitrine est une page statique : elle ne charge pas app.js et n'a donc pas
 *  accès à mRecherche. Le champ transmet la requête par l'ancre
 *  (/app.html#recherche?q=…), motif déjà en service pour #livre?id=… ; app.js
 *  la relit et préremplit la modale au lieu de l'ouvrir vide.
 *
 *  Écrit ici, et non dans vitrine.html, parce que ce dernier est REGÉNÉRÉ par
 *  tools/build_vitrine.js depuis la maquette : une injection au runtime survit
 *  à toute reconstruction.
 * ==========================================================================*/
(function () {
  'use strict';

  var SUGGESTIONS = ['Ville cruelle', 'BEPC maths', 'Le Cid', 'équations', 'Probatoire français'];

  function lancer(q) {
    q = String(q || '').trim();
    // Sans requête, on ouvre quand même la recherche : l'utilisateur veut chercher.
    location.href = '/app.html#recherche' + (q ? '?q=' + encodeURIComponent(q) : '');
  }

  function construire() {
    var accueil = document.querySelector('[data-vp="accueil"]');
    if (!accueil || accueil.querySelector('.vrt-rech')) return;      // idempotent
    var h1 = accueil.querySelector('h1');
    if (!h1) return;
    var apres = h1.nextElementSibling;                                // le sous-titre
    if (!apres) return;

    var form = document.createElement('form');
    form.className = 'vrt-rech';
    form.setAttribute('role', 'search');
    form.innerHTML =
      '<label class="vrt-rech-box">'
      +   '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#6E7385" '
      +        'stroke-width="2" stroke-linecap="round" aria-hidden="true"><use href="#lc-search"></use></svg>'
      +   '<input type="search" id="vrtRechQ" autocomplete="off" '
      +          'aria-label="Rechercher une ressource sur VÉRITAS" '
      +          'placeholder="Chercher une œuvre, une matière, un sujet d\'examen…">'
      + '</label>'
      + '<button type="submit">Chercher</button>';

    var sug = document.createElement('div');
    sug.className = 'vrt-rech-sug';
    sug.innerHTML = '<span>Souvent cherché :</span>';
    SUGGESTIONS.forEach(function (s) {
      var b = document.createElement('button');
      b.type = 'button';
      b.textContent = s;
      b.addEventListener('click', function () { lancer(s); });
      sug.appendChild(b);
    });

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var el = document.getElementById('vrtRechQ');
      lancer(el ? el.value : '');
    });

    apres.parentNode.insertBefore(sug, apres.nextSibling);
    apres.parentNode.insertBefore(form, apres.nextSibling);
  }

  /* Les deux boutons « Rechercher » de la maquette appelaient VRT.act('rien') —
     un gestionnaire qui, comme son nom l'indique, ne faisait rien. Un champ qui
     ne répond pas est pire qu'un champ absent : on croit que le site n'a rien. */
  function reparerBoutonsMorts() {
    document.querySelectorAll('[onclick*="VRT.act(\'rien\'"]').forEach(function (btn) {
      btn.removeAttribute('onclick');
      btn.addEventListener('click', function (e) {
        e.preventDefault();
        var bloc = btn.closest('div, section') || document;
        var champ = bloc.querySelector('input[type="text"], input[type="search"]');
        lancer(champ ? champ.value : '');
      });
    });
  }

  /* Style injecté ici : la vitrine n'a AUCUNE feuille externe (tout est en
     ligne dans le document généré). Le poser depuis le script garde le
     composant d'un seul tenant — markup, comportement et apparence. */
  function poserStyle() {
    if (document.getElementById('vrt-rech-css')) return;
    var st = document.createElement('style');
    st.id = 'vrt-rech-css';
    st.textContent = [
      '.vrt-rech{display:flex;gap:10px;flex-wrap:wrap;max-width:560px;margin:0 0 14px}',
      '.vrt-rech-box{flex:1;min-width:240px;display:flex;align-items:center;gap:10px;',
        'background:#fff;border:1px solid #E4E7EF;border-radius:10px;padding:12px 15px;',
        'transition:border-color .18s,box-shadow .18s}',
      '.vrt-rech-box:focus-within{border-color:#1E499B;box-shadow:0 0 0 3px rgba(30,73,155,.13)}',
      '.vrt-rech-box svg{flex:0 0 auto}',
      '.vrt-rech input{border:0;outline:0;flex:1;min-width:0;background:transparent;',
        'font:400 15px Poppins,sans-serif;color:#001136}',
      '.vrt-rech input::-webkit-search-cancel-button{cursor:pointer}',
      '.vrt-rech button[type=submit]{padding:12px 24px;border:0;border-radius:10px;',
        'background:#1E499B;color:#fff;font:600 15px Poppins,sans-serif;cursor:pointer;',
        'transition:background .18s,transform .18s}',
      '.vrt-rech button[type=submit]:hover{background:#0C2A6A;transform:translateY(-1px)}',
      '.vrt-rech button[type=submit]:active{transform:translateY(0)}',
      '.vrt-rech-sug{display:flex;align-items:center;gap:8px;flex-wrap:wrap;margin:0 0 24px;',
        'font:400 13px Poppins,sans-serif;color:#6E7385}',
      '.vrt-rech-sug button{border:1px solid #E4E7EF;background:#fff;border-radius:100px;',
        'padding:5px 13px;font:500 13px Poppins,sans-serif;color:#1E499B;cursor:pointer;',
        'transition:background .18s,border-color .18s}',
      '.vrt-rech-sug button:hover{background:#F0F4FB;border-color:#DBE8FE}',
      /* Confort de lecture sur petit écran : le bouton passe pleine largeur
         plutôt que de comprimer le champ à quelques caractères. */
      '@media (max-width:560px){',
        '.vrt-rech{gap:8px}',
        '.vrt-rech-box{min-width:100%}',
        '.vrt-rech button[type=submit]{width:100%}',
        '.vrt-rech input{font-size:16px}',   /* 16px : évite le zoom auto iOS */
        '.vrt-rech-sug{margin-bottom:20px}',
      '}',
      '@media (prefers-reduced-motion:reduce){',
        '.vrt-rech *{transition:none!important;transform:none!important}',
      '}'
    ].join('');
    document.head.appendChild(st);
  }

  function demarrer() { try { poserStyle(); construire(); reparerBoutonsMorts(); } catch (e) {} }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', demarrer);
  else demarrer();
})();

/* ============================================================================
 *  TROIS DÉFAUTS DE L'ACCUEIL  (v1.19.20)
 *
 *  1. « Découvrir » menait TOUJOURS à la boutique. `rendre()` clone un gabarit
 *     pris sur la première carte du document — gabarit dont le lien vaut
 *     `#boutique` en dur. Toutes les cartes de tous les onglets en héritaient :
 *     « Répétitions au centre — dès 15 000 F/mois » ouvrait les cahiers, qui ne
 *     disent pas un mot des répétitions. Les données (VRT_DATA) ne portent aucun
 *     champ de destination : on route donc sur le SENS de la carte.
 *
 *  2. Le panneau d'actualités DISPARAISSAIT au premier échec du flux.
 *     `poserActus([])` fait `bloc.hidden = true` : une coupure réseau d'une
 *     seconde effaçait la colonne MINESEC pour toute la visite. Le flux est sain
 *     en production (12 titres au contrôle) — c'est la fragilité qu'on corrige.
 *
 *  3. Le prix de chaque carte prenait la teinte de la carte : bleu ici, orange
 *     là, sur deux cartes voisines de la même famille. Un prix n'est pas un
 *     accent décoratif — il se lit toujours de la même façon.
 * ==========================================================================*/
(function () {
  'use strict';

  /* ── 1 · Destination réelle de « Découvrir » ─────────────────────────────
     Table par mot-clé du TITRE de la carte. Une carte non listée garde son
     lien d'origine : on ne casse jamais ce qui marchait déjà. */
  var ROUTES = [
    [/r[ée]p[ée]tition|domicile|rattrapage|pr[ée]paration.*examen|soutien/i, '#parents'],
    [/certificat|attestation/i,                    '/app.html#verifier-certificat'],
    [/orientation|s[ée]rie/i,                      '/app.html#orientation'],
    [/cagnotte/i,                                  '/app.html#cagnotte'],
    [/troph[ée]e|palmar[èe]s/i,                    '/app.html#trophees'],
    [/[ée]preuve|annale|bepc|probatoire|\bbac\b/i, '/app.html#epreuves'],
    [/corrig[ée]/i,                                '/corriges/'],
    [/cours|s[ée]quence|œuvre|oeuvre|labo|jeu|quiz|e-?learning/i, '#elearning'],
    [/manuel|cahier|boutique|livre/i,              '#boutique'],
    [/abonnement|tarif|formule|pack/i,             '#tarifs']
  ];

  function carteDe(el) {
    var n = el;
    for (var i = 0; n && i < 6; i++, n = n.parentElement) {
      if (n.querySelector && n.querySelector('h3')) return n;
      if (n.getAttribute && n.getAttribute('data-vrt-item')) return n;
    }
    return null;
  }

  function destination(titre) {
    for (var i = 0; i < ROUTES.length; i++) if (ROUTES[i][0].test(titre)) return ROUTES[i][1];
    return null;
  }

  document.addEventListener('click', function (ev) {
    var a = ev.target && ev.target.closest ? ev.target.closest('a') : null;
    if (!a || !/^\s*D[ée]couvrir/i.test(a.textContent || '')) return;
    var carte = carteDe(a);
    var h3 = carte ? carte.querySelector('h3') : null;
    var titre = h3 ? (h3.textContent || '') : (carte ? carte.textContent || '' : '');
    var cible = destination(titre);
    if (!cible) return;                       // rien de mieux à proposer : on laisse
    ev.preventDefault();
    if (cible.charAt(0) === '#' && window.VRT && typeof window.VRT.act === 'function') {
      location.hash = cible;                  // écran interne de la vitrine
      var page = cible.slice(1);
      var secs = document.querySelectorAll('[data-vp="' + page + '"]');
      if (secs.length) { try { window.VRT.act('go' + page.charAt(0).toUpperCase() + page.slice(1), a, ev); } catch (e) {} }
      if (location.hash !== cible) location.hash = cible;
    } else {
      location.href = cible;
    }
  }, true);

  /* ── 2 · Le panneau d'actualités ne s'efface plus en silence ──────────── */
  function filetActus() {
    var bloc = document.getElementById('vrtNews');
    if (!bloc || !bloc.hidden) return;
    var liste = document.getElementById('vrtNewsListe');
    if (!liste) return;
    bloc.hidden = false;
    liste.innerHTML =
      '<li class="vnews-vide" style="font:400 14px/1.6 Poppins,sans-serif;color:#4D5163">'
      + 'Les actualités officielles ne répondent pas pour l\'instant. '
      + '<a href="https://www.minesec.gov.cm" target="_blank" rel="noopener nofollow" '
      + 'style="color:#1E499B;font-weight:600">Consulter le site du MINESEC</a>'
      + '</li>';
  }
  var bloc = document.getElementById('vrtNews');
  if (bloc && window.MutationObserver) {
    new MutationObserver(function () { filetActus(); })
      .observe(bloc, { attributes: true, attributeFilter: ['hidden'] });
  }
  setTimeout(filetActus, 4000);   // et un contrôle après le premier chargement

  /* ── 3 · Le prix se lit partout de la même façon ──────────────────────── */
  (function harmoniserPrix() {
    var st = document.createElement('style');
    st.id = 'vrt-prix-css';
    st.textContent =
      '[data-vrt-item] [style*="font:600 14px Poppins"],'
      + '[data-vrt-item] [style*="font:600 14px Poppins,sans-serif"]{'
      + 'color:#1E499B !important}';
    document.head.appendChild(st);
  })();
})();
