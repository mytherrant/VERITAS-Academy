// Banc manuel des Scènes vivantes : à coller dans la console d'une scène (ou à injecter par un pilote de navigateur).
// Joue la scène jusqu'au bilan en résolvant chaque arrêt et chaque atelier, puis ouvre le laboratoire et le quiz.
// Renvoie un rapport { etapes, bilan, labo, quiz, erreurs }.
window.__bancScene = async function(){
  var S = window.SCENE, N = function(){ return document.getElementById('bSuiv'); }, err = [], dodo = function(ms){ return new Promise(function(r){ setTimeout(r, ms); }); };
  window.addEventListener('error', function(e){ err.push(String(e.message)); });
  for(var g = 0; g < 120 && document.getElementById('bilan').hidden; g++){
    var idx = +document.getElementById('compteur').textContent.split('/')[0] - 1, e = S.etapes[idx];
    if(e.t === 'question' || e.t === 'choix'){ var b = document.querySelectorAll('.sc-opt'), k = e.t === 'question' ? e.options.findIndex(function(o){ return o.ok; }) : 0; if(b[k] && !b[k].disabled){ b[k].click(); } }
    if(e.t === 'atelier'){
      if(e.mode === 'tri'){ e.items.forEach(function(it, k){ var x = document.querySelector('.sc-tri-l .sc-mini[data-k="' + k + '"][data-n="' + it.cat + '"]'); if(x){ x.click(); } }); }
      if(e.mode === 'balance'){ e.args.forEach(function(a, k){ var x = document.querySelector('.sc-tri-l .sc-mini[data-k="' + k + '"][data-n="' + a.cote + '"]'); if(x){ x.click(); } }); }
      if(e.mode === 'ordre'){ e.items.forEach(function(_, k){ var x = document.querySelector('.sc-puce[data-k="' + k + '"]'); if(x){ x.click(); } }); }
      if(e.mode === 'vote'){ var o = document.querySelector('.sc-opt'); if(o){ o.click(); } }
      if(e.mode === 'monnaie'){ var reste = e.cible; e.pieces.slice().sort(function(a, b){ return b - a; }).forEach(function(v){ while(reste >= v){ document.querySelector('.sc-piece[data-v="' + v + '"]').click(); reste -= v; } }); }
      if(e.mode === 'chemin'){ if(window.__chemin){ window.__chemin(e); } }
      var v = document.getElementById('aVerif'); if(v){ v.click(); }
    }
    if(N().disabled && !(e.t === 'atelier' && e.mode === 'chemin')){ err.push('bloqué à ' + (idx + 1) + ' (' + e.t + (e.mode ? ' ' + e.mode : '') + ')'); break; }
    if(e.t === 'atelier' && e.mode === 'chemin' && N().disabled){ document.getElementById('bPrec').click(); await dodo(10); N().click(); }
    N().click(); if(!N().disabled && document.getElementById('bilan').hidden){ N().click(); }
  }
  var rapport = { etapes: S.etapes.length, bilan: !document.getElementById('bilan').hidden, score: (document.querySelector('.sc-medaille .rond') || {}).textContent };
  var lab = document.querySelector('[data-vue=labo]');
  if(lab){ lab.click(); var badges = []; document.querySelectorAll('.sc-scen').forEach(function(b){ b.click(); badges.push(document.getElementById('lBadge').textContent); }); rapport.labo = badges; document.querySelector('[data-vue=scene]').click(); }
  document.querySelector('[data-modal=quiz]').click(); var bons = 0, Q = S.quiz || [];
  for(var q = 0; q < Q.length; q++){ var k2 = Q[q].options.findIndex(function(o){ return o.ok; }); document.querySelectorAll('#modalC .sc-opt')[k2].click(); document.getElementById('mSuiv').click(); }
  rapport.quiz = (document.querySelector('#modalC .rond') || {}).textContent;
  document.getElementById('modalX').click();
  rapport.erreurs = err;
  return rapport;
};
