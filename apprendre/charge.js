/* Fichier GÉNÉRÉ par tools/build_apprendre_payant.cjs. Charge les leçons de la classe affichée. */
(function(){var D={"1re A":"3da29fd1","1re C":"9b47bd40","1re D":"7f4eeadd","3e":"fc67dc0d","Tle A":"0fd5da9d","Tle C":"637696d7","Tle D":"6a1f3afb","4e":"c2aff62f"},q=new URLSearchParams(location.search),c=q.get("c"),i=q.get("id")||"",m=/^(6e|5e|4e|3e|2nde-[ac]|1re-[acd]|tle-[acd])-/.exec(i);
if(m&&!c){c=m[1].replace(/^(2nde|1re|tle)-(.)/,function(x,a,b){return (a==="tle"?"Tle":a)+" "+b.toUpperCase()})}
if(!c){try{c=JSON.parse(localStorage.getItem("vrt_app_classe")||"null")}catch(e){}}
if(!c&&!i)c="3e";
if(c&&D[c])document.write('<script src="apercus-'+c.toLowerCase().replace(/\s+/g,"-")+'.js?v='+D[c]+'"><\/script>');})();
