/* Fichier GÉNÉRÉ par tools/build_apprendre_payant.cjs. Charge les leçons de la classe affichée. */
(function(){var D={"1re A":"92332d92","1re C":"2e460920","1re D":"e0d9df17","3e":"cd6340a8","Tle A":"25ed7b2c","Tle C":"4f3906df","Tle D":"624cd019"},q=new URLSearchParams(location.search),c=q.get("c"),i=q.get("id")||"",m=/^(3e|1re-[acd]|tle-[acd])-/.exec(i);
if(m&&!c){c=m[1].replace(/^(1re|tle)-(.)/,function(x,a,b){return (a==="tle"?"Tle":"1re")+" "+b.toUpperCase()})}
if(!c){try{c=JSON.parse(localStorage.getItem("vrt_app_classe")||"null")}catch(e){}}
if(!c&&!i)c="3e";
if(c&&D[c])document.write('<script src="apercus-'+c.toLowerCase().replace(/\s+/g,"-")+'.js?v='+D[c]+'"><\/script>');})();
