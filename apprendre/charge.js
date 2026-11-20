/* Fichier GÉNÉRÉ par tools/build_apprendre_payant.cjs. Charge les leçons de la classe affichée. */
(function(){var D={"1re A":"e16a0ce6","1re C":"f5d8f821","1re D":"84b851cb","3e":"4e787976","Tle A":"5bc7a047","Tle C":"5ae7f5e1","Tle D":"9973e277"},q=new URLSearchParams(location.search),c=q.get("c"),i=q.get("id")||"",m=/^(3e|1re-[acd]|tle-[acd])-/.exec(i);
if(m&&!c){c=m[1].replace(/^(1re|tle)-(.)/,function(x,a,b){return (a==="tle"?"Tle":"1re")+" "+b.toUpperCase()})}
if(!c){try{c=JSON.parse(localStorage.getItem("vrt_app_classe")||"null")}catch(e){}}
if(!c&&!i)c="3e";
if(c&&D[c])document.write('<script src="apercus-'+c.toLowerCase().replace(/\s+/g,"-")+'.js?v='+D[c]+'"><\/script>');})();
