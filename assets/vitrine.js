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
    payer: function () {}
  };

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
