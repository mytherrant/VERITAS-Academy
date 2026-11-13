/* Fichier GÉNÉRÉ par tools/build_apprendre_payant.cjs. Charge les leçons de la classe affichée. */
(function(){var D={"1re A":"b3e7de00","1re C":"482fb901","1re D":"5c20512b","3e":"b6a23dfb","Tle A":"42bb7fb8","Tle C":"318b4130","Tle D":"0cb6be9b"},q=new URLSearchParams(location.search),c=q.get("c"),i=q.get("id")||"",m=/^(3e|1re-[acd]|tle-[acd])-/.exec(i);
if(m&&!c){c=m[1].replace(/^(1re|tle)-(.)/,function(x,a,b){return (a==="tle"?"Tle":"1re")+" "+b.toUpperCase()})}
if(!c){try{c=JSON.parse(localStorage.getItem("vrt_app_classe")||"null")}catch(e){}}
if(!c&&!i)c="3e";
if(c&&D[c])document.write('<script src="apercus-'+c.toLowerCase().replace(/\s+/g,"-")+'.js?v='+D[c]+'"><\/script>');})();
