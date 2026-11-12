/* Fichier GÉNÉRÉ par tools/build_apprendre_payant.cjs. Charge les leçons de la classe affichée. */
(function(){var D={"1re A":"ed8a021c","1re C":"8b8b7293","1re D":"04702d41","3e":"272f0e50","Tle A":"b28166c0","Tle C":"76021bcb","Tle D":"d3a25c74"},q=new URLSearchParams(location.search),c=q.get("c"),i=q.get("id")||"",m=/^(3e|1re-[acd]|tle-[acd])-/.exec(i);
if(m&&!c){c=m[1].replace(/^(1re|tle)-(.)/,function(x,a,b){return (a==="tle"?"Tle":"1re")+" "+b.toUpperCase()})}
if(!c){try{c=JSON.parse(localStorage.getItem("vrt_app_classe")||"null")}catch(e){}}
if(!c&&!i)c="3e";
if(c&&D[c])document.write('<script src="apercus-'+c.toLowerCase().replace(/\s+/g,"-")+'.js?v='+D[c]+'"><\/script>');})();
