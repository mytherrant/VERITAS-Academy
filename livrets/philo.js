/* ══════════════════════════════════════════════════════════════════════════
   livrets/philo.js — LECTEUR DES LIVRETS DE PHILOSOPHIE (Terminale, Première)
   © 2026 Les Enseignants de VÉRITAS. Tous droits réservés.

   Les livrets arrivent en HTML déjà mis en page (tools/philo_html.py, depuis
   les sources LaTeX du livret imprimé) : ce lecteur n'invente aucune
   présentation, il range. Une leçon à la fois, un sommaire, la suivante.

   Deux charges, une seule forme : `window.PHILO_DOC`.
     • l'aperçu gratuit, public (livrets/extrait-<slug>.js) : l'avant-propos
       et DEUX leçons ; les autres sections n'y ont que leur titre ;
     • l'ouvrage complet, servi par api/livret.php après le code (gate.js).
   Sans code, on ouvre l'aperçu tout de suite : c'est la vitrine. Le cadenas
   d'une leçon fermée mène au paiement, pas à une page d'erreur.

   Ce que l'élève écrit (lignes, cases, grilles) reste sur SON appareil
   (localStorage) : c'est un cahier de brouillon, pas une copie rendue.
   ES5, aucune bibliothèque. Dépend de gate.js pour le code et le paiement.
   ══════════════════════════════════════════════════════════════════════════ */
(function () {
  'use strict';

  var racine = document.documentElement;
  var SLUG = racine.getAttribute('data-ouvrage') || '';
  var TITRE = racine.getAttribute('data-titre') || 'Livret de philosophie';
  var PRIX = parseInt(racine.getAttribute('data-prix') || '1500', 10);
  var S = { doc: null, extrait: true, i: 0, sommaire: false };

  function el(id) { return document.getElementById(id); }
  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }
  function prixLisible() { return PRIX.toLocaleString('fr-FR').replace(/ |\s/g, ' ') + ' F'; }

  // ── Coquille ─────────────────────────────────────────────────────────────
  function coquille() {
    var d = document.createElement('div');
    d.id = 'ph';
    d.innerHTML = ''
      + '<header id="ph-bar">'
      + '<button type="button" class="ph-b" id="ph-som" aria-label="Sommaire">'
      + '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"><path d="M4 6h16M4 12h16M4 18h16"/></svg>'
      + '<span>Sommaire</span></button>'
      + '<div id="ph-tit"><small>' + esc(TITRE) + '</small><b id="ph-sec"></b></div>'
      + '<button type="button" class="ph-b g" id="ph-prec" aria-label="Leçon précédente">‹</button>'
      + '<button type="button" class="ph-b g" id="ph-suiv" aria-label="Leçon suivante">›</button>'
      + '</header>'
      + '<div id="ph-offre" hidden><span><b>Aperçu gratuit</b> · deux leçons offertes, le reste du livret est sous cadenas.</span>'
      + '<button type="button" class="ph-cta" id="ph-acheter">Obtenir le livret — ' + prixLisible() + '</button>'
      + '<button type="button" class="ph-lien" id="ph-code">J’ai déjà un code</button></div>'
      + '<nav id="ph-nav" hidden><div id="ph-nav-t">Sommaire</div><div id="ph-nav-l"></div></nav>'
      + '<div id="ph-voile" hidden></div>'
      + '<main id="ph-main"><article id="ph-page" class="lp"></article><div id="ph-pied"></div></main>';
    document.body.appendChild(d);
    el('ph-som').onclick = function () { basculerSommaire(); };
    el('ph-voile').onclick = function () { basculerSommaire(false); };
    el('ph-prec').onclick = function () { aller(S.i - 1); };
    el('ph-suiv').onclick = function () { aller(S.i + 1); };
    el('ph-acheter').onclick = acheter;
    el('ph-code').onclick = saisirCode;
    document.addEventListener('keydown', function (e) {
      var t = e.target && e.target.tagName;
      if (t === 'TEXTAREA' || t === 'INPUT' || (e.target && e.target.isContentEditable)) return;
      if (e.key === 'ArrowLeft') aller(S.i - 1);
      if (e.key === 'ArrowRight') aller(S.i + 1);
      if (e.key === 'Escape') basculerSommaire(false);
    });
    window.addEventListener('hashchange', function () {
      var i = indexDe(location.hash.slice(1));
      if (i >= 0 && i !== S.i) afficher(i, false);
    });
    // Renvois internes (« voir » des tableaux) : la cible peut être dans une
    // autre leçon. On cherche la section qui la porte.
    document.addEventListener('click', function (e) {
      var a = e.target && e.target.closest ? e.target.closest('a.pref, a[data-sec]') : null;
      if (!a) return;
      e.preventDefault();
      var sec = a.getAttribute('data-sec');
      if (!sec) {
        var lab = a.getAttribute('data-lab');
        sec = (S.doc.labels || {})[lab] || '';
      }
      var i = indexDe(sec);
      if (i >= 0) { afficher(i, true, a.getAttribute('data-ancre') || ''); basculerSommaire(false); }
    });
  }

  function basculerSommaire(v) {
    S.sommaire = (v === undefined) ? !S.sommaire : !!v;
    el('ph-nav').hidden = !S.sommaire;
    el('ph-voile').hidden = !S.sommaire;
  }

  function indexDe(id) {
    var l = (S.doc && S.doc.sections) || [];
    for (var i = 0; i < l.length; i++) if (l[i].id === id) return i;
    return -1;
  }

  function nomSection(s) {
    if (s.kind === 'chap') return (s.genre || 'Chapitre') + ' ' + s.num + ' — ' + s.titre;
    return s.titre;
  }

  function sommaire() {
    var doc = S.doc, h = [], toc = doc.toc || [];
    for (var i = 0; i < toc.length; i++) {
      var t = toc[i], j = indexDe(t.sec), s = doc.sections[j];
      if (!s) continue;
      var ferme = !s.html;
      var cls = t.niv === 'part' ? 'p' : (t.niv === 'subsection' ? 'ss' : 's');
      h.push('<a href="#' + esc(s.id) + '" data-sec="' + esc(s.id) + '"'
        + (t.niv === 'subsection' ? ' data-ancre="' + esc(t.ancre || '') + '"' : '')
        + ' class="' + cls + (ferme ? ' ferme' : '') + (s.libre ? ' libre' : '') + '">'
        + esc(t.titre)
        + (ferme && t.niv !== 'subsection' ? ' <span class="cad" aria-label="sous cadenas">🔒</span>' : '')
        + (s.libre && t.niv !== 'subsection' && s.kind === 'chap' ? ' <span class="off">offert</span>' : '')
        + '</a>');
    }
    el('ph-nav-l').innerHTML = h.join('');
  }

  // ── Affichage d'une section ──────────────────────────────────────────────
  function aller(i) {
    var l = S.doc.sections;
    if (i < 0 || i >= l.length) return;
    afficher(i, true);
  }

  function afficher(i, pousser, ancre) {
    var s = S.doc.sections[i];
    S.i = i;
    var page = el('ph-page');
    if (s.html) {
      page.innerHTML = deplier(s.html);
      restaurer(page, s.id);
    } else {
      page.innerHTML = cadenas(s);
      var b = el('ph-cad-acheter');
      if (b) b.onclick = acheter;
      var c = el('ph-cad-code');
      if (c) c.onclick = saisirCode;
    }
    el('ph-sec').textContent = nomSection(s);
    el('ph-prec').disabled = i <= 0;
    el('ph-suiv').disabled = i >= S.doc.sections.length - 1;
    pied();
    if (pousser && location.hash.slice(1) !== s.id) {
      try { history.pushState(null, '', '#' + s.id); } catch (e) { location.hash = s.id; }
    }
    var cible = ancre ? document.getElementById(ancre) : null;
    if (cible) cible.scrollIntoView();
    else window.scrollTo(0, 0);
    try { localStorage.setItem('vrt-philo-' + SLUG + '-pos', s.id); } catch (e) {}
  }

  /* La charge voyage compactée (tools/philo_livrets.py, compacter) : une
     couleur en ligne s'y écrit `k=8A3C22`, un fond `kb=F4F4F7` — trois fois
     plus court que `style="color:#8A3C22"`, et l'aperçu gratuit doit tenir
     sous 120 Ko. On rend ici la forme que le navigateur comprend. */
  function deplier(h) {
    return h.replace(/ kb=([0-9A-F]{6})/g, ' style="background:#$1"')
            .replace(/ k=([0-9A-F]{6})/g, ' style="color:#$1"')
            .replace(/<textarea /g, '<textarea aria-label="Ta réponse" ')
            .replace(/<input type=checkbox /g, '<input type=checkbox aria-label="Case à cocher" ');
  }

  function pied() {
    var l = S.doc.sections, i = S.i, h = '';
    if (i > 0) h += '<a href="#' + esc(l[i - 1].id) + '" data-sec="' + esc(l[i - 1].id) + '" class="ph-pp">‹ ' + esc(nomSection(l[i - 1])) + '</a>';
    else h += '<span></span>';
    if (i < l.length - 1) h += '<a href="#' + esc(l[i + 1].id) + '" data-sec="' + esc(l[i + 1].id) + '" class="ph-ps">' + esc(nomSection(l[i + 1])) + ' ›</a>';
    el('ph-pied').innerHTML = h;
  }

  function cadenas(s) {
    var libres = [];
    for (var k = 0; k < S.doc.sections.length; k++) {
      var x = S.doc.sections[k];
      if (x.libre && x.kind === 'chap') libres.push('<a href="#' + esc(x.id) + '" data-sec="' + esc(x.id) + '">' + esc(nomSection(x)) + '</a>');
    }
    var bandeau = s.kind === 'chap'
      ? '<div class="chapbanner" style="background:#' + esc(s.couleur || '7F2A4C') + '"><div class="chnum" style="background:rgba(0,0,0,.22)"><span>'
        + esc((s.genre || 'Chapitre').toUpperCase()) + '</span><b>' + esc(s.num) + '</b></div><div class="chtxt"><div class="chtitle">'
        + esc(s.titre) + '</div><div class="chsub">' + esc(s.sous || '') + '</div></div></div>'
      : '<h1 class="pagetitle" style="color:#B03A6A">' + esc(s.titre) + '</h1>';
    return bandeau
      + '<div class="ph-cad"><div class="ph-cad-i" aria-hidden="true">🔒</div>'
      + '<h2>Cette partie est dans le livret complet</h2>'
      + '<p>L’aperçu gratuit ouvre l’avant-propos et deux leçons entières'
      + (libres.length ? ' : ' + libres.join(' et ') : '') + '. Le livret complet ouvre tout, '
      + 'corrigés compris, sur trois appareils, pour l’année scolaire.</p>'
      + '<button type="button" class="ph-cta" id="ph-cad-acheter">Obtenir le livret — ' + prixLisible() + '</button>'
      + '<button type="button" class="ph-lien" id="ph-cad-code">J’ai déjà un code</button>'
      + '<p class="ph-pay">Orange Money, MTN MoMo ou carte · le code arrive aussitôt par SMS et WhatsApp.</p></div>';
  }

  // ── Ce que l'élève écrit : gardé sur l'appareil ──────────────────────────
  function cleDe(sec) { return 'vrt-philo-' + SLUG + '-' + sec; }
  function restaurer(page, sec) {
    var champs = page.querySelectorAll('textarea, input, [contenteditable]');
    var sauve = {};
    try { sauve = JSON.parse(localStorage.getItem(cleDe(sec)) || '{}') || {}; } catch (e) { sauve = {}; }
    for (var n = 0; n < champs.length; n++) {
      (function (c, k) {
        var v = sauve[k];
        if (c.type === 'checkbox') c.checked = !!v;
        else if (c.isContentEditable) { if (v) c.textContent = v; }
        else if (v != null) c.value = v;
        var maj = function () {
          var o = {};
          try { o = JSON.parse(localStorage.getItem(cleDe(sec)) || '{}') || {}; } catch (e) { o = {}; }
          o[k] = c.type === 'checkbox' ? (c.checked ? 1 : 0) : (c.isContentEditable ? c.textContent : c.value);
          try { localStorage.setItem(cleDe(sec), JSON.stringify(o)); } catch (e) { /* stockage plein : on n'empêche pas d'écrire */ }
        };
        c.addEventListener(c.type === 'checkbox' ? 'change' : 'input', maj);
      })(champs[n], 'c' + n);
    }
  }

  // ── Code et paiement (gate.js) ───────────────────────────────────────────
  function acheter() { if (window.VRTLivret) window.VRTLivret.acheter({}); }

  function saisirCode() {
    var code = window.prompt('Saisis ton code d’accès (8 caractères, ex. ABCD-EFGH)');
    if (!code) return;
    window.VRTLivret.unlock(code).then(ouvrirComplet).catch(function (e) {
      window.alert((e && e.message) || 'Code refusé.');
    });
  }

  function demarrer(doc, extrait) {
    S.doc = doc;
    S.extrait = extrait;
    el('ph-offre').hidden = !extrait;
    sommaire();
    var i = indexDe(location.hash.slice(1));
    if (i < 0) {
      var pos = '';
      try { pos = localStorage.getItem('vrt-philo-' + SLUG + '-pos') || ''; } catch (e) {}
      i = Math.max(0, indexDe(pos));
    }
    afficher(i, false);
  }

  function ouvrirComplet() {
    var d = window.PHILO_DOC;
    if (!d || !d.sections || d._extrait) {
      window.alert('Le livret n’a pas pu être chargé. Ton code reste valable : réessaie dans un instant.');
      return;
    }
    demarrer(d, false);
  }

  function chargerExtrait() {
    return new Promise(function (ok, ko) {
      var s = document.createElement('script');
      s.src = '/livrets/extrait-' + SLUG + '.js?v=' + (racine.getAttribute('data-v') || '1');
      s.onload = function () { window.PHILO_DOC ? ok(window.PHILO_DOC) : ko(new Error('aperçu vide')); };
      s.onerror = function () { ko(new Error('aperçu introuvable')); };
      document.head.appendChild(s);
    });
  }

  function boot() {
    coquille();
    if (!window.VRTLivret) { chargerExtrait().then(function (d) { demarrer(d, true); }); return; }
    window.VRTLivret.config({ classe: SLUG, kind: 'livret', titre: TITRE });
    // Après un paiement réussi, gate.js déverrouille et nous rappelle ici.
    window.VRTLivret.onOuvert = ouvrirComplet;
    var veutAcheter = /[?&]achat=1(&|$)/.test(location.search);
    window.VRTLivret.resume().then(ouvrirComplet).catch(function () {
      chargerExtrait().then(function (d) { demarrer(d, true); },
        function () { el('ph-page').innerHTML = '<p>L’aperçu n’a pas pu être chargé. Vérifie ta connexion, puis recharge la page.</p>'; });
      if (veutAcheter) acheter();
    });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
})();
