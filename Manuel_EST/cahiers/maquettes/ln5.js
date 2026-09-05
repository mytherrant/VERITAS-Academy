/* Numérotation des lignes des extraits, toutes les 5 lignes.
   Passe UNIQUE (deux au maximum, la seconde seulement si la première a eu lieu
   avant la mise en page définitive). Aucun MutationObserver, aucun hook resize
   ou beforeprint : sur un document de plusieurs centaines de milliers de nœuds
   ces rappels saturaient le thread principal.
   Les paragraphes portent déjà position:relative dans le HTML généré. */
(function () {
  var STEP = 5;
  var FONT = "'Nunito',system-ui,sans-serif";
  var passes = 0;

  function rowsOf(para) {
    var rects = [];
    var walker = document.createTreeWalker(para, NodeFilter.SHOW_TEXT, null);
    var node;
    while ((node = walker.nextNode())) {
      var pn = node.parentNode;
      if (pn && pn.nodeType === 1 && pn.hasAttribute('data-ln-tag')) continue;
      if (!node.nodeValue || !node.nodeValue.trim()) continue;
      try {
        var r = document.createRange();
        r.selectNodeContents(node);
        rects = rects.concat(Array.prototype.slice.call(r.getClientRects()));
      } catch (e) {}
    }
    rects.sort(function (a, b) { return (a.top - b.top) || (a.left - b.left); });
    var rows = [];
    for (var k = 0; k < rects.length; k++) {
      if (rects[k].height < 5) continue;
      var t = Math.round(rects[k].top);
      var last = rows[rows.length - 1];
      if (!last || Math.abs(last.top - t) > 3) rows.push({ top: t, left: Math.round(rects[k].left) });
    }
    return rows;
  }

  function numberCard(card) {
    var paras = card.querySelectorAll('[data-ln-p]');
    var line = 0, plan = [], total = 0;
    for (var p = 0; p < paras.length; p++) {
      var rows = rowsOf(paras[p]), tags = [];
      total += rows.length;
      for (var j = 0; j < rows.length; j++) {
        line++;
        if (line % STEP === 0) tags.push({ n: line, top: rows[j].top, left: rows[j].left });
      }
      plan.push([paras[p], tags]);
    }
    if (paras.length && total === 0) return false;      // pas encore paginé
    for (var q = 0; q < plan.length; q++) {
      var para = plan[q][0], tags2 = plan[q][1];
        var old = para.querySelectorAll('[data-ln-tag]');
      for (var o = 0; o < old.length; o++) old[o].remove();
      if (!tags2.length) continue;
      var frags = para.getClientRects();
      var origin = frags.length ? frags[0] : para.getBoundingClientRect();
      var frag = document.createDocumentFragment();
      for (var t2 = 0; t2 < tags2.length; t2++) {
        var tag = document.createElement('span');
        tag.setAttribute('data-ln-tag', '');
        tag.setAttribute('aria-hidden', 'true');
        tag.textContent = String(tags2[t2].n);
        tag.setAttribute('style',
          'position:absolute;width:16px;text-align:right;pointer-events:none;user-select:none;' +
          'font-family:' + FONT + ';font-size:9px;font-weight:700;color:#a9a096;' +
          'left:' + Math.round(tags2[t2].left - origin.left - 25) + 'px;' +
          'top:' + Math.round(tags2[t2].top - origin.top + 2) + 'px');
        frag.appendChild(tag);
      }
      para.appendChild(frag);
    }
    return true;
  }

  // traitement par petits lots : le thread principal reste disponible
  var MAX = 4, empty = 0;
  function run() {
    if (passes >= MAX) return;
    var list = Array.prototype.slice.call(document.querySelectorAll('[data-extract]'));
    // contenu pas encore monté par le runtime : on retente sans consommer de passe
    if (!list.length) { empty++; if (empty < 12) setTimeout(run, 700); return; }
    passes++;
    var idx = 0, missed = 0;
    (function chunk() {
      var t0 = Date.now();
      while (idx < list.length && Date.now() - t0 < 40) {
        if (!numberCard(list[idx])) missed++;
        idx++;
      }
      if (idx < list.length) { setTimeout(chunk, 0); return; }
      if (missed && passes < MAX) setTimeout(run, 800);
    })();
  }

  function start() {
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(function () { setTimeout(run, 400); });
    else setTimeout(run, 600);
  }
  if (document.readyState === 'complete') start();
  else window.addEventListener('load', start);
})();
