/* Fichier GÉNÉRÉ par tools/build_apprendre_payant.cjs. Charge les leçons de la classe affichée. */
(function(){var D={"1re A":"06b7acaf","1re C":"8a147c2d","1re D":"f5ca6693","3e":"1a3543ec","Tle A":"f22fc61d","Tle C":"7a73650b","Tle D":"e633ba75"},q=new URLSearchParams(location.search),c=q.get("c"),i=q.get("id")||"",m=/^(3e|1re-[acd]|tle-[acd])-/.exec(i);
if(m&&!c){c=m[1].replace(/^(1re|tle)-(.)/,function(x,a,b){return (a==="tle"?"Tle":"1re")+" "+b.toUpperCase()})}
if(!c){try{c=JSON.parse(localStorage.getItem("vrt_app_classe")||"null")}catch(e){}}
if(!c&&!i)c="3e";
if(c&&D[c])document.write('<script src="apercus-'+c.toLowerCase().replace(/\s+/g,"-")+'.js?v='+D[c]+'"><\/script>');})();
