/* ============================================================================
 *  VÉRITAS — Harmonie de lecture sur TOUTES les surfaces · assets/veritas-harmonie.js
 *  © 2024-2026 Jacques Miterand TAKOU (Mythe Errant). Tous droits réservés.
 *
 *  25/10/2026 — « Applique ces changements à toutes les pages, pas uniquement
 *  la vitrine. Il ne faut pas qu'on sente le déphasage en passant d'une page
 *  à l'autre. N'oublie pas l'Atelier de Français » (Jacques).
 *
 *  La vitrine a reçu deux règles (tools/vitrine_lisibilite.cjs) :
 *    1. aucun texte courant sous 15 px — chaque taille plus petite gagne 2 px ;
 *    2. un seul dessin d'icône : l'ANNEAU (rond blanc, filet de 3 px teinté,
 *       icône bleu nuit) — plus de rond plein, pâle ou en dégradé.
 *
 *  POURQUOI UN SCRIPT ET PAS UNE FEUILLE. Mesuré le 25/10 à 390 px : 40 à
 *  55 % des textes de l'application sous 15 px (9 à 14,5 px), dans des styles
 *  écrits EN LIGNE par app.js au moment du rendu, ou par une dizaine de
 *  classes de trois feuilles différentes ; l'Atelier a sa propre feuille.
 *  Une règle par surface divergerait à la première retouche — c'est le
 *  déphasage qu'on veut supprimer. Ce module mesure ce qui est RÉELLEMENT
 *  affiché et applique la même règle partout, y compris aux sections que
 *  l'application dessine après coup (MutationObserver, regroupé par image).
 *
 *  CE QU'IL NE TOUCHE PAS : la barre et le pied communs (déjà réglés), les
 *  boutons flottants, les couvertures de livres dessinées en CSS, le texte
 *  des SVG, les champs de saisie, et tout ce qui porte [data-vh-ignore].
 *  Idempotent : un élément traité porte data-vh.
 * ==========================================================================*/
(function () {
  'use strict';
  if (window.__vrtHarmonie) return;
  window.__vrtHarmonie = true;

  var PLANCHER = 15;          // en dessous, le texte est relevé
  var GAIN = 2;               // de combien
  // .vrt-hab : TOUS les blocs communs (barre, bandeau, pied, bulles), réglés
  // une fois pour toutes sur la vitrine — ils restent identiques partout.
  var EXCLU = '.vrt-hab,#vrtNav,[data-vh-ignore],svg,input,textarea,select,option,'
            + '[class*="couv"],.vbq-couv,code,pre,kbd,.mono';

  function rgb(c) {
    var m = String(c || '').match(/[\d.]+/g);
    return m && m.length >= 3 ? [+m[0], +m[1], +m[2], m.length > 3 ? +m[3] : 1] : null;
  }
  function lum(c) {
    return c.slice(0, 3).map(function (x) { x /= 255; return x <= 0.03928 ? x / 12.92 : Math.pow((x + 0.055) / 1.055, 2.4); })
      .reduce(function (a, v, i) { return a + v * [0.2126, 0.7152, 0.0722][i]; }, 0);
  }
  function hex(c) { return '#' + c.slice(0, 3).map(function (x) { return ('0' + Math.round(x).toString(16)).slice(-2); }).join(''); }
  /* Teinte d'une pastille pâle : la même couleur, assombrie jusqu'à un
     contraste lisible sur blanc (≈ les six teintes de la vitrine). */
  function fonce(c) {
    var k = 1, t = c.slice(0, 3);
    while (lum(t) > 0.12 && k > 0.2) { k -= 0.05; t = c.slice(0, 3).map(function (x) { return x * k; }); }
    // Une pastille presque grise reste bleu VÉRITAS plutôt qu'un gris sale.
    var s = Math.max.apply(null, c.slice(0, 3)) - Math.min.apply(null, c.slice(0, 3));
    return s < 40 ? '#1E499B' : hex(t);
  }
  function sombre() { return document.documentElement.getAttribute('data-vrt-theme') === 'sombre'; }

  function texteDirect(el) {
    for (var n = el.firstChild; n; n = n.nextSibling) if (n.nodeType === 3 && n.textContent.trim().length > 1) return true;
    return false;
  }

  /* LIRE PUIS ÉCRIRE. La première version alternait lecture (getComputedStyle,
     offsetWidth) et écriture de style élément par élément : chaque écriture
     invalidait la mise en page, la lecture suivante en forçait un recalcul
     complet — quadratique sur ~10 000 éléments. Sur la CI (2 cœurs), la page
     se FIGEAIT au-delà de 45 s ; un téléphone d'entrée de gamme aurait souffert
     pareil. Les deux fonctions ci-dessous ne font plus que DÉCIDER ; `passe`
     applique tout en une seule écriture groupée. */
  var aEcrire = [];
  function poser(el, prop, val) { aEcrire.push([el, prop, val]); }

  function relever(el, cs) {
    if (el.hasAttribute('data-vh')) return;
    var fs = parseFloat(cs.fontSize);
    if (!(fs > 0) || fs >= PLANCHER) return;
    /* +2 px ne suffisait pas : 10,5 px devenait 12,5. Le texte courant monte
       d'un coup au plancher de 15 px ; une ÉTIQUETTE (capitales espacées :
       « DE RÉUSSITE », « NOUVEAU ») au moins de 2 px, sans descendre sous
       13 px — à 15 px elle ferait éclater sa pastille. */
    var etiquette = cs.textTransform === 'uppercase' || parseFloat(cs.letterSpacing) > 0.6;
    var cible = etiquette ? Math.max(13, fs + GAIN) : Math.max(PLANCHER, fs + GAIN);
    poser(el, 'data-vh', 't');
    poser(el, 'font-size', Math.round(cible * 2) / 2 + 'px');
  }

  /* Rond plein → anneau. Rond = carré de 26 à 90 px, rayon ≥ moitié ; plein =
     fond non blanc OU dégradé ; il porte une icône ou un numéro court. */
  function anneau(el, cs) {
    if (el.hasAttribute('data-vh-anneau')) return;
    var w = el.offsetWidth, h = el.offsetHeight;
    if (w < 26 || w > 90 || Math.abs(w - h) > 2) return;
    var rayon = cs.borderTopLeftRadius.indexOf('%') > 0 ? parseFloat(cs.borderTopLeftRadius) / 100 * w : parseFloat(cs.borderTopLeftRadius);
    var rond = rayon >= w / 2 - 1;
    /* Carré ARRONDI qui ne porte qu'une icône (la tuile du haut de l'Atelier,
       56 px, rayon 16) : même famille de pictogramme, même anneau. Un carré
       qui porte du texte reste un carré (pastille, étiquette, bouton). */
    var carreIcone = !rond && rayon >= w * 0.2 && el.children.length === 1 && el.children[0].tagName.toLowerCase() === 'svg' && !el.textContent.trim();
    if (!rond && !carreIcone) return;
    if (el.tagName === 'IMG' || el.querySelector('img')) return;                    // avatar, logo
    if (/^(A|BUTTON)$/.test(el.tagName) && cs.position === 'fixed') return;
    var icone = el.querySelector('svg');
    var num = !icone && /^\s*\d{1,2}\s*$/.test(el.textContent);
    if (!icone && !num) return;
    var bg = rgb(cs.backgroundColor), img = cs.backgroundImage;
    var teinte;
    if (img && img !== 'none') {
      var m = img.match(/rgba?\([^)]*\)/);
      if (!m || img.indexOf('url(') >= 0) return;
      teinte = hex(rgb(m[0]));
    } else {
      if (!bg || bg[3] < 0.5) return;
      var L = lum(bg);
      if (L > 0.97) return;                                                        // déjà blanc
      if (L >= 0.55) {                                                             // pastille pâle
        /* La couleur du TEXTE du rond n'est la teinte que si elle est
           franchement colorée : dans l'Atelier, elle est gris ardoise et
           l'icône porte sa propre couleur — l'anneau sortait gris foncé. */
        var ic = rgb(cs.color);
        var satur = ic ? Math.max(ic[0], ic[1], ic[2]) - Math.min(ic[0], ic[1], ic[2]) : 0;
        // À défaut, la couleur de l'icône elle-même (trait du SVG).
        var tsvg = null;
        if (icone) {
          var cs2 = getComputedStyle(icone), st = rgb(cs2.stroke !== 'none' ? cs2.stroke : cs2.color);
          if (st && (Math.max(st[0], st[1], st[2]) - Math.min(st[0], st[1], st[2])) > 60 && lum(st) < 0.45) tsvg = hex(st);
        }
        teinte = ic && lum(ic) < 0.3 && satur > 60 ? hex(ic) : (tsvg || fonce(bg));
      } else {
        teinte = hex(bg);                                                          // rond plein foncé
      }
    }
    poser(el, 'data-vh-anneau', '1');
    poser(el, 'background', sombre() ? 'transparent' : '#fff');
    poser(el, 'border', '3px solid ' + teinte);
    poser(el, 'box-sizing', 'border-box');
    poser(el, 'color', num ? teinte : (sombre() ? '#F2F5FC' : '#001136'));
    poser(el, 'box-shadow', 'none');
    if (carreIcone) poser(el, 'border-radius', '50%');
  }

  /* 25/10/2026 — « Renforce le gras sur les titres et sous-titres, et les
     couleurs, partout dans l'application » (Jacques). Titres (h1, h2) en 800
     bleu nuit, sous-titres (h3, h4, titres de cartes .ct de l'application)
     en 700 bleu VÉRITAS. On ne remplace qu'une couleur NEUTRE (gris, noir) :
     un titre déjà teinté, ou blanc sur un fond sombre, garde la sienne. */
  var SOUS_TITRE = /(^|\s)(ct|card-title|vsec-t|sec-title|stitle)(\s|$)/;
  function titre(el, cs) {
    if (el.hasAttribute('data-vh-titre')) return;
    var niv = /^H[12]$/.test(el.tagName) ? 1 : 2;
    var poids = parseFloat(cs.fontWeight) || 400, cible = niv === 1 ? 800 : 700;
    var c = rgb(cs.color), neutre = c && (Math.max(c[0], c[1], c[2]) - Math.min(c[0], c[1], c[2])) < 30 && lum(c) < 0.3;
    if (poids >= cible && !neutre) return;
    poser(el, 'data-vh-titre', '1');
    if (poids < cible) poser(el, 'font-weight', String(cible));
    if (neutre && !sombre()) poser(el, 'color', niv === 1 ? '#001136' : '#1E499B');
  }

  function examiner(el) {
    if (el.closest(EXCLU)) return;
    if (el.closest('[data-vp]') && document.getElementById('vrt-secondaires')) return; // la vitrine a sa feuille
    var direct = texteDirect(el), rond = /^(SPAN|DIV|I|B)$/.test(el.tagName) && !el.hasAttribute('data-vh-anneau');
    var estTitre = (/^H[1-4]$/.test(el.tagName) || SOUS_TITRE.test(typeof el.className === 'string' ? el.className : '')) && !el.hasAttribute('data-vh-titre');
    if (!(direct && !el.hasAttribute('data-vh')) && !rond && !estTitre) return;    // rien à décider : aucune lecture
    var cs = getComputedStyle(el);
    if (cs.position === 'fixed') return;                              // bulles flottantes
    /* Un élément MASQUÉ au rendu (onglet fermé, carte pas encore révélée)
       a déjà sa taille calculée : on le relève quand même. L'anneau, lui,
       se mesure — il attend que l'élément soit affiché. */
    if (direct) relever(el, cs);
    if (estTitre) titre(el, cs);
    if (rond && cs.display !== 'none') anneau(el, cs);
  }

  function passe(racines) {
    aEcrire = [];
    (racines || [document.body]).forEach(function (r) {
      if (!r || !r.isConnected || r.nodeType !== 1) return;
      examiner(r);
      var els = r.getElementsByTagName('*');
      for (var i = 0; i < els.length; i++) examiner(els[i]);
    });
    // Une seule écriture groupée : aucune lecture entre deux écritures.
    for (var k = 0; k < aEcrire.length; k++) {
      var w = aEcrire[k];
      if (w[1].indexOf('data-') === 0) w[0].setAttribute(w[1], w[2]);
      else w[0].style.setProperty(w[1], w[2], 'important');
    }
    aEcrire = [];
  }

  /* Seconde passe, complète, 800 ms après la DERNIÈRE modification : des
     médaillons reçoivent leur forme d'un autre script (veritas-medaillons.js,
     les .vm-med de l'application) ou d'une animation d'entrée, APRÈS leur
     insertion — mesurés trop tôt, ils restaient pleins. */
  var tRattrapage = 0;
  function rattraper() {
    clearTimeout(tRattrapage);
    tRattrapage = setTimeout(function () { try { passe(null); } catch (e) { window.__vrtHarmonieErreur = String(e && e.message || e); } }, 800);
  }

  var enAttente = false, cibles = [];
  function planifier(n) {
    rattraper();
    if (n && n.nodeType === 1) cibles.push(n);
    if (enAttente) return;
    enAttente = true;
    requestAnimationFrame(function () {
      enAttente = false;
      var lot = cibles.splice(0);
      try {
        passe(lot.length ? lot : null);
      } catch (e) { window.__vrtHarmonieErreur = String(e && e.message || e); }
    });
  }

  function demarrer() {
    planifier();
    window.addEventListener('load', function () { setTimeout(rattraper, 700); });
    try {
      new MutationObserver(function (ms) {
        for (var i = 0; i < ms.length; i++) for (var j = 0; j < ms[i].addedNodes.length; j++) planifier(ms[i].addedNodes[j]);
      }).observe(document.body, { childList: true, subtree: true });
      /* Ce qui apparaît sans rien ajouter au document (onglet, accordéon,
         révélation au défilement) : une passe après chaque clic, et sur
         l'élément qui finit une animation ou une transition. */
      document.addEventListener('click', function () { setTimeout(function () { planifier(); }, 350); }, true);
      document.addEventListener('animationend', function (e) { planifier(e.target); }, true);
      document.addEventListener('transitionend', function (e) { if (e.propertyName === 'opacity' || e.propertyName === 'transform') planifier(e.target); }, true);
      // Bascule clair/sombre : le fond des anneaux suit.
      new MutationObserver(function () {
        var s = sombre();
        document.querySelectorAll('[data-vh-anneau]').forEach(function (el) {
          el.style.setProperty('background', s ? 'transparent' : '#fff', 'important');
        });
      }).observe(document.documentElement, { attributes: true, attributeFilter: ['data-vrt-theme'] });
    } catch (e) {}
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', demarrer);
  else demarrer();
})();
