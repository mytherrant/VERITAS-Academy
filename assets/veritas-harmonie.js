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
  var EXCLU = 'nav.vrt-hab,footer.vrt-hab,#vrtNav,[data-vh-ignore],svg,input,textarea,select,option,'
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
    el.setAttribute('data-vh', 't');
    el.style.setProperty('font-size', Math.round(cible * 2) / 2 + 'px', 'important');
  }

  /* Rond plein → anneau. Rond = carré de 26 à 90 px, rayon ≥ moitié ; plein =
     fond non blanc OU dégradé ; il porte une icône ou un numéro court. */
  function anneau(el, cs) {
    if (el.hasAttribute('data-vh-anneau')) return;
    var w = el.offsetWidth, h = el.offsetHeight;
    if (w < 26 || w > 90 || Math.abs(w - h) > 2) return;
    if (!(cs.borderTopLeftRadius.indexOf('%') > 0 ? parseFloat(cs.borderTopLeftRadius) >= 50 : parseFloat(cs.borderTopLeftRadius) >= w / 2 - 1)) return;
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
    el.setAttribute('data-vh-anneau', '1');
    el.style.setProperty('background', sombre() ? 'transparent' : '#fff', 'important');
    el.style.setProperty('border', '3px solid ' + teinte, 'important');
    el.style.setProperty('box-sizing', 'border-box', 'important');
    el.style.setProperty('color', num ? teinte : (sombre() ? '#F2F5FC' : '#001136'), 'important');
    el.style.setProperty('box-shadow', 'none', 'important');
  }

  function passe(racine) {
    var els = (racine || document.body).querySelectorAll('*');
    for (var i = 0; i < els.length; i++) {
      var el = els[i];
      if (el.closest(EXCLU)) continue;
      if (el.closest('[data-vp]') && document.getElementById('vrt-secondaires')) continue; // la vitrine a sa feuille
      if (el.hasAttribute('data-vh') && el.hasAttribute('data-vh-anneau')) continue;
      var cs = getComputedStyle(el);
      if (cs.position === 'fixed' && el !== racine) continue;          // bulles flottantes
      /* Un élément MASQUÉ au rendu (onglet fermé, carte pas encore révélée)
         a déjà sa taille calculée : on le relève quand même. L'anneau, lui,
         se mesure — il attend que l'élément soit affiché (voir demarrer). */
      if (texteDirect(el)) relever(el, cs);
      if (/^(SPAN|DIV|I|B)$/.test(el.tagName) && cs.display !== 'none') anneau(el, cs);
    }
  }

  /* Seconde passe, complète, 800 ms après la DERNIÈRE modification : des
     médaillons reçoivent leur forme d'un autre script (veritas-medaillons.js,
     les .vm-med de l'application) ou d'une animation d'entrée, APRÈS leur
     insertion — mesurés trop tôt, ils restaient pleins. */
  var tRattrapage = 0;
  function rattraper() {
    clearTimeout(tRattrapage);
    tRattrapage = setTimeout(function () { try { passe(document.body); } catch (e) { window.__vrtHarmonieErreur = String(e && e.message || e); } }, 800);
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
        if (!lot.length) passe(document.body);
        else lot.forEach(function (c) { if (c.isConnected) { passe(c); if (!c.closest(EXCLU)) { var cs = getComputedStyle(c); if (texteDirect(c)) relever(c, cs); anneau(c, cs); } } });
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
