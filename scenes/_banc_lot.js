// Banc par lot : joue chaque scène dans un cadre caché jusqu'au bilan (avec _banc_scenes.js) et rassemble les rapports.
// Usage, depuis une page du dossier scenes/ servie en http :
//   eval(await (await fetch('_banc_lot.js')).text()); await __bancLot(['tle-histoire-um-nyobe-onu', ...])
window.__bancLot = async function(pages){
  var banc = await (await fetch('_banc_scenes.js?x=' + Date.now())).text();
  var out = {}, ko = [];
  for(var n = 0; n < pages.length; n++){
    var p = pages[n], errs = [];
    var f = document.createElement('iframe');
    f.style.cssText = 'width:1000px;height:800px;position:fixed;left:-2000px;top:0';
    document.body.appendChild(f);
    await new Promise(function(r){ f.onload = r; f.src = p + '.html?b=' + Date.now(); });
    f.contentWindow.addEventListener('error', function(e){ errs.push(e.message); });
    await new Promise(function(r){ setTimeout(r, 250); });
    try{
      f.contentWindow.eval(banc);
      var r = await f.contentWindow.__bancScene();
      var e = r.erreurs.concat(errs);
      out[p] = r.score + ' · quiz ' + r.quiz + ' · labo ' + (r.labo || []).join(' / ') + (e.length ? ' · ERREURS ' + e.join(' ; ') : '');
      if(!r.bilan || e.length || r.score !== '100%' || !/^5\/5$/.test(r.quiz)){ ko.push(p); }
    }catch(x){ out[p] = 'PLANTÉ : ' + x.message; ko.push(p); }
    f.remove();
  }
  return { total: pages.length, ko: ko, detail: out };
};
