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

  /* ── Année du pied de page ─────────────────────────────── */
  function year() {
    var y = document.getElementById('y');
    if (y) y.textContent = new Date().getFullYear();
  }

  function init() { bindToggleAll(); bindA11y(); bindSpeak(); bindShare(); year(); }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else { init(); }
})();
