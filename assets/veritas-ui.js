/* ============================================================
   VÉRITAS — comportements communs des pages statiques
   © 2026 Mythe Errant · Centre VÉRITAS
   Aucun appel réseau, aucune dépendance externe.
     • Tout ouvrir / Tout fermer les corrigés
     • Mode lecture accessible (dyslexie / confort visuel), mémorisé
     • Écoute audio des énoncés (synthèse vocale du navigateur, fr-FR)
     • Année courante dans le pied de page
   ============================================================ */
(function () {
  'use strict';
  var LS_A11Y = 'vrt_a11y';

  /* ── Tout ouvrir / tout fermer ─────────────────────────── */
  function bindToggleAll() {
    document.querySelectorAll('[data-all]').forEach(function (b) {
      b.addEventListener('click', function () {
        var open = b.getAttribute('data-all') === 'open';
        var scope = b.closest('section') || document;
        scope.querySelectorAll('details.sol').forEach(function (d) { d.open = open; });
      });
    });
  }

  /* ── Mode lecture accessible ───────────────────────────── */
  function setA11y(on, btn) {
    document.body.classList.toggle('a11y', !!on);
    if (btn) btn.setAttribute('aria-pressed', on ? 'true' : 'false');
    try { localStorage.setItem(LS_A11Y, on ? '1' : '0'); } catch (e) { /* mode privé */ }
  }
  function bindA11y() {
    var btn = document.querySelector('[data-a11y]');
    var on = false;
    try { on = localStorage.getItem(LS_A11Y) === '1'; } catch (e) { /* mode privé */ }
    if (on) setA11y(true, btn);
    if (!btn) return;
    btn.addEventListener('click', function () {
      setA11y(!document.body.classList.contains('a11y'), btn);
    });
  }

  /* ── Écoute audio (synthèse vocale) ────────────────────── */
  var synth = window.speechSynthesis || null;
  var current = null;

  function frenchVoice() {
    if (!synth) return null;
    var v = synth.getVoices() || [];
    for (var i = 0; i < v.length; i++) {
      if (/^fr(-|_|$)/i.test(v[i].lang || '')) return v[i];
    }
    return null;
  }

  function stopSpeech() {
    if (synth) { try { synth.cancel(); } catch (e) { /* ignore */ } }
    document.body.classList.remove('speaking');
    document.querySelectorAll('.ex.reading').forEach(function (n) { n.classList.remove('reading'); });
    document.querySelectorAll('[data-speak]').forEach(function (b) {
      b.setAttribute('aria-pressed', 'false');
      b.textContent = b.dataset.labelOff || '🔊 Écouter';
    });
    current = null;
  }

  /** Lit à voix haute les CORRIGÉS du bloc demandé.
   *  Les énoncés ne sont pas publiés en ligne (ils sont dans le cahier) : on lit
   *  donc le repère (« Exercice 3 ») puis sa correction, en ouvrant chaque bloc
   *  au fur et à mesure pour que l'élève suive des yeux. */
  function speakScope(root, btn) {
    if (!synth) return;
    var nodes = root.querySelectorAll('.ex');
    if (!nodes.length) return;
    var textes = [];
    nodes.forEach(function (ex) {
      var q = ex.querySelector('.q');
      var corps = ex.querySelector('details.sol .body');
      if (!corps) return;
      var txt = (q ? q.innerText.trim() + '. ' : '') + corps.innerText.trim();
      if (txt) textes.push({ el: ex, txt: txt, det: ex.querySelector('details.sol') });
    });
    if (!textes.length) return;

    var i = 0;
    var voice = frenchVoice();
    document.body.classList.add('speaking');
    btn.setAttribute('aria-pressed', 'true');
    btn.dataset.labelOff = btn.dataset.labelOff || btn.textContent;
    btn.textContent = '⏹ Arrêter la lecture';

    function next() {
      if (i >= textes.length) { stopSpeech(); return; }
      var item = textes[i++];
      document.querySelectorAll('.ex.reading').forEach(function (n) { n.classList.remove('reading'); });
      if (item.det) { item.det.open = true; }      // le corrigé lu doit être visible
      if (item.el) {
        item.el.classList.add('reading');
        item.el.scrollIntoView({ block: 'center', behavior: 'smooth' });
      }
      var u = new SpeechSynthesisUtterance(item.txt);
      u.lang = 'fr-FR';
      if (voice) u.voice = voice;
      u.rate = 0.95;
      u.onend = next;
      u.onerror = function () { stopSpeech(); };
      current = u;
      synth.speak(u);
    }
    next();
  }

  function bindSpeak() {
    var btns = document.querySelectorAll('[data-speak]');
    if (!btns.length) return;
    if (!synth) { btns.forEach(function (b) { b.remove(); }); return; }
    // Certains navigateurs ne peuplent les voix qu'après cet événement.
    if (typeof synth.onvoiceschanged !== 'undefined') { synth.onvoiceschanged = function () {}; }
    btns.forEach(function (b) {
      b.addEventListener('click', function () {
        if (document.body.classList.contains('speaking')) { stopSpeech(); return; }
        var sel = b.getAttribute('data-speak');
        var root = sel && sel !== 'page' ? document.querySelector(sel) : document;
        speakScope(root || document, b);
      });
    });
    window.addEventListener('beforeunload', stopSpeech);
  }

  /* ── Partage (le canal réel entre élèves : WhatsApp) ───── */
  function bindShare() {
    var btn = document.querySelector('[data-share]');
    if (!btn) return;
    var titre = document.title.split(' | ')[0];
    btn.addEventListener('click', function () {
      var url = location.href;
      if (navigator.share) {
        navigator.share({ title: titre, url: url }).catch(function () { /* annulé */ });
        return;
      }
      if (navigator.clipboard) {
        navigator.clipboard.writeText(url).then(function () {
          var old = btn.textContent;
          btn.textContent = 'Lien copié';
          setTimeout(function () { btn.textContent = old; }, 2000);
        }).catch(function () { fallback(url, titre); });
        return;
      }
      fallback(url, titre);
    });
    function fallback(url, t) {
      window.open('https://wa.me/?text=' + encodeURIComponent(t + ' — ' + url), '_blank', 'noopener');
    }
  }

  /* ── Espace élève : révélation au scroll ────────────────
     Le masquage n'est activé qu'ici (classe .has-js) et un filet de sécurité
     découvre tout au bout d'1,2 s, quoi qu'il arrive. Aucune information ne
     doit dépendre du bon vouloir d'un observateur. */
  function reveals() {
    /* Les pages de contenu (corrigés, Constellation, Espace Manuels) n'ont
       pas de .rv dans leur balisage : on marque ici les blocs qui gagnent à
       entrer en scène. Le filet de sécurité plus bas s'applique à eux comme
       aux autres — rien ne peut rester caché. */
    document.querySelectorAll('.card, .cta a, .orbit a, .loupe, .step')
      .forEach(function (b) { b.classList.add('rv'); });
    var blocs = document.querySelectorAll('.rv');
    if (!blocs.length) return;
    var doux = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (doux || !('IntersectionObserver' in window)) {
      blocs.forEach(function (b) { b.classList.add('rv-on'); });
      return;
    }
    document.body.classList.add('has-js');
    var io = new IntersectionObserver(function (entrees) {
      entrees.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add('rv-on'); io.unobserve(e.target); }
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.06 });
    blocs.forEach(function (b, i) {
      b.style.transitionDelay = Math.min(i * 60, 240) + 'ms';
      io.observe(b);
    });
    setTimeout(function () {                       // filet : rien ne reste caché
      document.querySelectorAll('.rv:not(.rv-on)').forEach(function (b) { b.classList.add('rv-on'); });
    }, 1200);
  }

  /* ── Espace élève : onglets qui suivent la lecture ──────── */
  function onglets() {
    var barre = document.querySelector('.tabs');
    if (!barre) return;
    var liens = [].slice.call(barre.querySelectorAll('a[href^="#"]'));
    var cibles = liens.map(function (a) { return document.querySelector(a.getAttribute('href')); });
    function actif(id) {
      liens.forEach(function (a) {
        a.setAttribute('aria-current', a.getAttribute('href') === '#' + id ? 'true' : 'false');
      });
    }
    if ('IntersectionObserver' in window) {
      var io = new IntersectionObserver(function (entrees) {
        entrees.forEach(function (e) { if (e.isIntersecting) actif(e.target.id); });
      }, { rootMargin: '-18% 0px -70% 0px' });
      cibles.forEach(function (c) { if (c) io.observe(c); });
    }
    // Décalage du scroll : la barre collante ne doit pas manger le titre visé.
    liens.forEach(function (a) {
      a.addEventListener('click', function (ev) {
        var c = document.querySelector(a.getAttribute('href'));
        if (!c) return;
        ev.preventDefault();
        var y = c.getBoundingClientRect().top + window.pageYOffset - barre.offsetHeight - 12;
        window.scrollTo({ top: y, behavior: 'smooth' });
        actif(c.id);
        if (history.replaceState) history.replaceState(null, '', a.getAttribute('href'));
      });
    });
  }

  /* ── Compteurs qui montent (chiffres réels, jamais inventés) ── */
  function compteurs() {
    var els = document.querySelectorAll('[data-compte]');
    if (!els.length) return;
    var doux = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    els.forEach(function (el) {
      var cible = parseInt(el.getAttribute('data-compte'), 10) || 0;
      var fmt = function (n) { return n.toLocaleString('fr-FR').replace(/ /g, ' '); };
      // On écrit d'ABORD la valeur finale : dans un onglet d'arrière-plan,
      // requestAnimationFrame ne s'exécute pas et le compteur resterait bloqué
      // sur 0 — un chiffre faux coûte plus cher qu'une animation perdue.
      el.textContent = fmt(cible);
      if (doux || document.visibilityState === 'hidden') return;
      var t0 = null, duree = 900;
      function pas(ts) {
        if (t0 === null) t0 = ts;
        var p = Math.min((ts - t0) / duree, 1);
        el.textContent = fmt(Math.round(cible * (1 - Math.pow(1 - p, 3))));
        if (p < 1) requestAnimationFrame(pas);
      }
      requestAnimationFrame(pas);
    });
  }

  /* ── Année du pied de page ─────────────────────────────── */
  function year() {
    var y = document.getElementById('y');
    if (y) y.textContent = new Date().getFullYear();
  }

  /* ── Bouton WhatsApp flottant ───────────────────────────
     L'application le porte déjà (.vfx-fab dans app.css), mais les 64 pages
     statiques ne chargent pas app.css : un visiteur qui arrive par Google sur
     un corrigé ou sur la Constellation n'avait donc aucun moyen de poser sa
     question. On l'injecte ici, avec la même promesse de délai que dans
     l'application — une promesse chiffrée n'a de valeur que si elle est
     partout la même.
     Le message est pré-rempli avec le titre de la page : côté VÉRITAS, on sait
     d'où vient la question sans avoir à la demander. */
  var WA_NUM = '237697637739';
  function fabWhatsApp() {
    if (document.querySelector('.vrt-wa-fab')) return;
    var titre = (document.title || '').split('—')[0].trim().substring(0, 70);
    var msg = 'Bonjour VÉRITAS. Je consulte « ' + titre + ' » et j\'ai une question.';
    var a = document.createElement('a');
    a.className = 'vrt-wa-fab';
    a.href = 'https://wa.me/' + WA_NUM + '?text=' + encodeURIComponent(msg);
    a.target = '_blank';
    a.rel = 'noopener';
    a.setAttribute('aria-label', 'Poser une question sur WhatsApp — réponse sous 2 h les jours ouvrés');
    a.innerHTML = '<span class="ic" aria-hidden="true">💬</span>'
                + '<span class="tx">Une question ?<small>Réponse sous 2 h · jours ouvrés</small></span>';
    document.body.appendChild(a);
  }

  function init() {
    bindToggleAll(); bindA11y(); bindSpeak(); bindShare(); year();
    reveals(); onglets(); compteurs();          // habillage de l'espace élève
    fabWhatsApp();
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else { init(); }
})();
