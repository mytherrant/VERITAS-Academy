// Validateur des données des Scènes vivantes : node scenes/_valider_scenes.js [fichier.html ...]
// Sans argument, vérifie toutes les scènes du dossier. Sort en code 1 au premier défaut trouvé.
const fs = require('fs'), path = require('path'), vm = require('vm');
const dir = __dirname;
const moteur = fs.readFileSync(path.join(dir, 'scene.js'), 'utf8');
const decors = fs.readFileSync(path.join(dir, 'decors.js'), 'utf8');
const ICONES = new Set((moteur.match(/^ {4}([a-zA-Z]+): '</gm) || []).map(l => l.trim().split(':')[0]));
const EMOJI = new Set((moteur.match(/'([^'\w\s]{1,12})':'[a-zA-Z]+'/g) || []).map(s => s.split("':")[0].slice(1)));
const DECORS = new Set((decors.match(/^ {4}([a-z_0-9]+): function/gm) || []).map(l => l.trim().split(':')[0]));
const MODES = new Set(['ordre', 'tri', 'monnaie', 'chemin', 'vote', 'balance']);
let defauts = 0;
const fichiers = process.argv.slice(2).length ? process.argv.slice(2).map(f => path.basename(f))
  : fs.readdirSync(dir).filter(f => f.endsWith('.html') && !/^(index|personnages)\.html$/.test(f));
for(const f of fichiers){
  const h = fs.readFileSync(path.join(dir, f), 'utf8'), D = [];
  const m = h.match(/<script>\s*(window\.SCENE[\s\S]*?)<\/script>/);
  if(!m){ console.log(f, ': pas de window.SCENE'); defauts++; continue; }
  const ctx = { window: {} };
  try{ vm.runInNewContext(m[1], ctx); }catch(e){ console.log(f, ': syntaxe —', e.message); defauts++; continue; }
  const S = ctx.window.SCENE, P = S.personnages || {}, cles = new Set(Object.keys(P));
  const ic = (i, ou) => { if(i && !ICONES.has(i) && !EMOJI.has(i)){ D.push(ou + ' : icône inconnue « ' + i + ' »'); } };
  if(!/scene\.js\?v=/.test(h) || !/decors\.js\?v=/.test(h)){ D.push('scripts du moteur absents'); }
  if(!DECORS.has(S.decor)){ D.push('décor inconnu « ' + S.decor + ' »'); }
  ['id', 'titre', 'discipline', 'niveau', 'objectif'].forEach(k => { if(!S[k]){ D.push('champ ' + k + ' manquant'); } });
  const jauges = new Set((S.jauges || []).map(j => j.id));
  (S.etapes || []).forEach((e, n) => {
    const ou = 'étape ' + (n + 1);
    if(e.decor && !DECORS.has(e.decor)){ D.push(ou + ' : décor inconnu ' + e.decor); }
    [].concat(e.entre || [], e.sort || []).forEach(k => { if(!cles.has(k)){ D.push(ou + ' : personnage inconnu ' + k); } });
    if(e.qui && !cles.has(e.qui)){ D.push(ou + ' : qui inconnu ' + e.qui); }
    Object.keys(e.jauges || {}).forEach(k => { if(!jauges.has(k)){ D.push(ou + ' : jauge inconnue ' + k); } });
    if(e.objet){ ic(e.objet.i, ou); }
    if(e.t === 'dit' && !e.qui){ D.push(ou + ' : réplique sans qui'); }
    if((e.t === 'dit' || e.t === 'recit' || e.t === 'remarque') && !e.txt){ D.push(ou + ' : texte vide'); }
    if(e.t === 'question' && (e.options || []).filter(o => o.ok).length !== 1){ D.push(ou + ' : question sans une seule bonne réponse'); }
    if(e.t === 'choix'){ (e.options || []).forEach(o => Object.keys(o.jauges || {}).forEach(k => { if(!jauges.has(k)){ D.push(ou + ' : jauge inconnue ' + k); } })); }
    if(e.t === 'atelier'){
      if(!MODES.has(e.mode)){ D.push(ou + ' : mode inconnu ' + e.mode); }
      if(e.mode === 'tri'){ (e.items || []).forEach(it => { if(!(it.cat >= 0 && it.cat < e.cats.length)){ D.push(ou + ' : catégorie hors limite'); } }); }
      if(e.mode === 'balance'){ (e.args || []).forEach(a => { if(!(a.cote === 0 || a.cote === 1)){ D.push(ou + ' : côté de balance invalide'); } }); }
      if(e.mode === 'vote' && (!e.classe || e.classe.length !== e.options.length)){ D.push(ou + ' : vote mal formé'); }
      if(e.mode === 'monnaie'){ let r = e.cible; e.pieces.slice().sort((a, b) => b - a).forEach(v => { while(r >= v){ r -= v; } }); if(r){ D.push(ou + ' : somme impossible à payer'); } }
      if(e.mode === 'ordre' && (e.items || []).length < 3){ D.push(ou + ' : ordre trop court'); }
    }
  });
  if((S.etapes || []).length < 12){ D.push('scène courte : ' + (S.etapes || []).length + ' étapes'); }
  const L = S.labo;
  if(L){
    const cur = new Set(L.curseurs.map(c => c.id));
    (L.persos || []).forEach(k => { if(!cles.has(k)){ D.push('labo : perso inconnu ' + k); } });
    (L.liens || []).forEach(l => { [l.a, l.b].forEach(k => { if(!cles.has(k)){ D.push('labo : lien vers ' + k); } }); Object.keys(l.poids || {}).forEach(k => { if(!cur.has(k)){ D.push('labo : poids inconnu ' + k); } }); });
    (L.scenarios || []).forEach(s => { ic(s.icone, 'scénario'); Object.keys(s.valeurs).forEach(k => { if(!cur.has(k)){ D.push('labo : scénario « ' + s.nom + ' » règle ' + k); } }); });
    if(typeof L.issue !== 'function'){ D.push('labo : issue manquante'); }
    else {
      // chaque scénario doit donner une issue lisible, et pas tous la même
      const base = {}; L.curseurs.forEach(c => { base[c.id] = c.val; });
      const badges = (L.scenarios || []).map(s => { try{ return L.issue(Object.assign({}, base, s.valeurs)).badge; }catch(e){ D.push('labo : issue plante — ' + e.message); return '?'; } });
      if(new Set(badges).size < Math.min(2, badges.length)){ D.push('labo : tous les scénarios donnent la même issue'); }
    }
  } else { D.push('pas de laboratoire'); }
  const Q = S.quiz || [];
  if(Q.length < 5){ D.push('quiz : ' + Q.length + ' questions'); }
  Q.forEach((q, n) => { if(q.options.filter(o => o.ok).length !== 1){ D.push('quiz ' + (n + 1) + ' : pas une seule bonne réponse'); } });
  if(!S.bilan || !(S.bilan.retenir || []).length){ D.push('bilan : rien à retenir'); }
  if(D.length){ defauts += D.length; console.log('✗ ' + f + '\n  - ' + D.join('\n  - ')); }
  else { console.log('✓ ' + f + ' (' + S.etapes.length + ' étapes)'); }
}
process.exit(defauts ? 1 : 0);
