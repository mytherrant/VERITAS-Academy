#!/usr/bin/env node
/* tools/controle_scenes_programme.cjs — les Scènes vivantes citent-elles les BONNES leçons ?
 *
 * Chaque scène annonce « Progression harmonisée 1re · leçon 21 (les fêtes traditionnelles) ».
 * Ce contrôle relit la progression officielle MINESEC 2026-2027 (apprendre/progressions.js,
 * source minesec-ige.com) et vérifie, pour chaque leçon, TD, TP ou dossier cité, que le
 * numéro désigne bien le sujet annoncé, dans la classe et la discipline de la scène.
 * Constat du 13/11/2026 : 21 scènes citaient le bon sujet sous un mauvais numéro (les
 * fiches officielles numérotent aussi les TD et dossiers). Sort en code 1 au moindre écart.
 *   node tools/controle_scenes_programme.cjs
 */
const fs=require('fs'),vm=require('vm'),path=require('path');const R=path.join(__dirname,'..')+'/';
global.window=global;require(R+'apprendre/progressions.js');const P=window.VRT_PROG;
const MAT={'Français':['Français'],'Éducation à la citoyenneté et à la morale':['ECM'],'Espagnol':['Espagnol'],'Allemand':['Allemand'],'Histoire':['Histoire'],'Géographie':['Géographie'],'Anglais':['Anglais'],'Philosophie':['Philosophie'],'Italien':['Italien'],'Chinois':['Chinois'],'Orientation-conseil':['Orientation Conseil'],'Langues nationales':['Langues nationales'],'Cultures nationales':['Cultures nationales'],'Arabe':['Arabe']};
function classes(n){n=(n||'').trim();if(/^Terminale|^Tle/.test(n))return Object.keys(P).filter(k=>/^Tle/.test(k));if(/^1re|^Premi/.test(n))return Object.keys(P).filter(k=>/^1re/.test(k));if(/^2nde/.test(n))return Object.keys(P).filter(k=>/^2nde/.test(k));const m=n.match(/\d+e/g);return m?m:[];}
const norm=s=>s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g,'').replace(/[^a-z0-9 ]/g,' ');
const STOP=new Set('les des une un de du la le et en a au aux d l sur dans par pour leur leurs the and of to in a an on with its their'.split(' '));
const mots=s=>new Set(norm(s).split(/\s+/).filter(w=>w.length>2&&!STOP.has(w)));
function sim(a,b){const A=mots(a),B=mots(b);if(!A.size)return 1;let c=0;A.forEach(w=>{if(B.has(w)||[...B].some(x=>x.startsWith(w.slice(0,5))&&w.length>4))c++});return c/A.size;}
const out=[];let nRef=0,nOk=0;
for(const f of fs.readdirSync(R+'scenes').filter(f=>f.endsWith('.html'))){
 const h=fs.readFileSync(R+'scenes/'+f,'utf8');const m=h.match(/<script>\s*(window\.SCENE\s*=[\s\S]*?)<\/script>/);if(!m)continue;
 const ctx={window:{}};try{vm.runInNewContext(m[1],ctx)}catch(e){out.push(f+' PARSE '+e.message);continue}const Sc=ctx.window.SCENE;if(!Sc||!Sc.programme)continue;
 const cl=classes(Sc.niveau),mats=MAT[Sc.discipline]||[];
 if(!/Progression harmonis/.test(Sc.programme)){out.push(f+' | sans réf. progression | '+Sc.programme.slice(0,90));continue;}
 if(!cl.length||!mats.length){out.push(f+' | niveau/discipline non reconnus: '+Sc.niveau+' / '+Sc.discipline);continue;}
 const re=/(?:le[cç]ons?|lessons?)\s+([\d\s,\-–et and]+?)\s*\(([^)]*)\)/gi;let r;
 while((r=re.exec(Sc.programme))){nRef++;const nums=[];r[1].replace(/(\d+)\s*[-–]\s*(\d+)|(\d+)/g,(_,a,b,c)=>{if(a){for(let i=+a;i<=+b;i++)nums.push(i)}else nums.push(+c)});
  let best=0,bestT='',where='';
  for(const c of cl)for(const mt of mats){const L=(P[c]||{})[mt];if(!L)continue;const all=[];L.forEach(u=>(u[1]||[]).forEach(x=>all.push(x)));
   const t=nums.map(n=>{const x=all.find(y=>y[0]===n);return x?x[1]:''}).join(' / ');const s=sim(r[2],t);
   if(s>best){best=s;bestT=t;where=c+' '+mt;}}
  // proposition : la ou les leçons officielles dont l'intitulé correspond le mieux
  const props=[];for(const c of cl)for(const mt of mats){const L=(P[c]||{})[mt];if(!L)continue;L.forEach(u=>(u[1]||[]).forEach(x=>{const s2=sim(r[2],String(x[1]));if(s2>=.5)props.push(c+' '+mt+' n°'+x[0]+' «'+String(x[1]).slice(0,60)+'» '+s2.toFixed(2));}));}
  const uniq=[...new Set(props.map(x=>x.replace(/^\S+ \S+ /,'').replace(/^(?:\S+ )*?(n°)/,'$1')))];
  if(best>=.34)nOk++;else out.push(f+' | '+Sc.niveau+' '+Sc.discipline+' | leçon '+nums.join(',')+' «'+r[2].slice(0,60)+'» ≠ '+(where||'?')+' «'+bestT.slice(0,90)+'» ('+best.toFixed(2)+')'+(uniq.length?' → officiel : '+uniq.slice(0,3).join(' | '):''));}
}
console.log('références vérifiées',nRef,'conformes',nOk);out.forEach(x=>console.log(x));
// TD / TP / dossiers : l'étiquette officielle (« TD2 : … », « Dossier 3 : … ») doit exister et parler du même sujet
let nL=0;const outL=[];
for(const f of fs.readdirSync(R+'scenes').filter(f=>f.endsWith('.html'))){
 const h=fs.readFileSync(R+'scenes/'+f,'utf8');const m=h.match(/<script>\s*(window\.SCENE\s*=[\s\S]*?)<\/script>/);if(!m)continue;
 const ctx={window:{}};try{vm.runInNewContext(m[1],ctx)}catch(e){continue}const Sc=ctx.window.SCENE;if(!Sc||!Sc.programme||!/Progression harmonis/.test(Sc.programme))continue;
 const cl=classes(Sc.niveau),mats=MAT[Sc.discipline]||[];const re=/\b(TD|TP|dossiers?)\s*([\d\-– ]+?)\s*\(([^)]*)\)/gi;let r;
 while((r=re.exec(Sc.programme))){nL++;const lab=r[1].toLowerCase().startsWith('dossier')?'dossier':r[1].toLowerCase();const nums=[];r[2].replace(/(\d+)\s*[-–]\s*(\d+)|(\d+)/g,(_,a,b,c)=>{if(a){for(let i=+a;i<=+b;i++)nums.push(i)}else nums.push(+c)});
  let best=0,bt='';for(const c of cl)for(const mt of mats){const L=(P[c]||{})[mt];if(!L)continue;L.forEach(u=>(u[1]||[]).forEach(x=>{const t=String(x[1]);const mm=t.match(/^\s*(TD|TP|Dossier)\s*(\d+)/i);if(mm&&mm[1].toLowerCase()===lab&&nums.includes(+mm[2])){const s=sim(r[3],t);if(s>=best){best=s;bt=c+' '+mt+' n°'+x[0]+' «'+t.slice(0,70)+'»';}}}));}
  if(best<.34)outL.push(f+' | '+r[0].slice(0,90)+' ≠ '+(bt||'étiquette introuvable'));}}
console.log('TD/TP/dossiers vérifiés',nL,'écarts',outL.length);outL.forEach(x=>console.log(x));
if(out.length||outL.length){console.error('\n✗ Des scènes citent une leçon qui ne correspond pas à la progression officielle (apprendre/progressions.js).');process.exit(1);}
console.log('✓ Chaque leçon citée par une scène correspond à la progression officielle.');
