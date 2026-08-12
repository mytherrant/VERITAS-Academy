/* ════════════════════════════════════════════════════════════════════════
   VÉRITAS — APLATISSEMENT DES DÉGRADÉS EN LIGNE
   Fichier : assets/theme-lws.js   ·   compagnon de assets/theme-lws.css
   ────────────────────────────────────────────────────────────────────────
   POURQUOI CE FICHIER EXISTE

   theme-lws.css éteint TOUS les dégradés de la vitrine (« background-image:
   none ») pour revenir aux aplats du modèle. Le balayage CSS suffit pour
   les dégradés déclarés dans une feuille : on leur redonne un aplat par
   classe, à la main.

   Il ne suffit PAS pour ceux que le JS de rendu pose en style en ligne :
   ils sont éteints eux aussi, mais l'élément n'a alors plus AUCUN fond. Un
   bandeau bleu à texte blanc devient du blanc sur blanc.

   Deviner la couleur depuis le CSS a été tenté (`[style*="#142554"]`) puis
   abandonné : un sélecteur d'attribut ne distingue pas un dégradé navy
   d'une couleur de TEXTE navy sur fond clair, et repeignait en bleu des
   blocs qui devaient rester blancs.

   La seule source fiable est le dégradé lui-même. Ce script lit sa
   PREMIÈRE couleur non transparente et la repose en aplat. Aucun
   heuristique, aucun réglage à maintenir : la couleur vient de la donnée.

   Coût : un parcours du DOM de la vitrine, plus un observateur qui ne
   réagit qu'aux ajouts de nœuds. Négligeable devant les 3,4 Mo d'app.js.
   ════════════════════════════════════════════════════════════════════════ */
(function () {
  'use strict';

  var GRADIENT = /gradient\s*\(/i;

  /* Or de la maison. Il n'est plus banni — il est redevenu la couleur
     d'ACTION (boutons d'achat et d'inscription). Cette liste ne sert donc
     plus qu'à un cas : un dégradé DÉCORATIF dont la première couleur est
     dorée. L'aplatir en or peindrait un pavé jaune là où il n'y a rien à
     cliquer ; on lui substitue le bleu.
     ⚠️ Les DEUX écritures sont listées : `el.style.backgroundImage` renvoie
     la forme SÉRIALISÉE par le navigateur, où `#FFC93C` est déjà devenu
     `rgb(255, 201, 60)`. Un test uniquement hexadécimal ne voit rien. */
  var OR = new RegExp(
    '^(#ffc93c|#f5b800|#ffd86e|#e8b225|#c8961a'
    + '|rgba?\\(\\s*255,\\s*201,\\s*60[\\s,\\d.)]*'
    + '|rgba?\\(\\s*245,\\s*184,\\s*0[\\s,\\d.)]*'
    + '|rgba?\\(\\s*255,\\s*216,\\s*110[\\s,\\d.)]*'
    + '|rgba?\\(\\s*232,\\s*178,\\s*37[\\s,\\d.)]*'
    + '|rgba?\\(\\s*200,\\s*150,\\s*26[\\s,\\d.)]*)$', 'i');
  var BLEU = '#1E499B';

  /* Luminance perçue (0 = noir, 1 = blanc). Sert à décider, pour un or posé
     en ligne, s'il doit devenir bleu (sur fond clair) ou blanc (sur fond
     sombre). Remplacer l'or par du bleu partout produisait du #1E499B sur
     du #142554 : illisible. La couleur de remplacement ne peut donc pas
     être choisie dans la feuille de style — elle dépend du fond réel. */
  function luminance(couleur) {
    var m = String(couleur).match(/[\d.]+/g);
    if (!m || m.length < 3) return null;
    return (0.299 * +m[0] + 0.587 * +m[1] + 0.114 * +m[2]) / 255;
  }

  /* Le fond RÉELLEMENT PERÇU, alpha compris.

     La version précédente renvoyait la première couleur de fond non
     strictement transparente, telle quelle. Elle se trompait dès qu'un
     fond était semi-transparent — ce qui est la règle dans app.js, où les
     panneaux teintés s'écrivent `background:#0596690f` (un vert à 6 %).

     `luminance('rgba(5,150,105,0.06)')` vaut 0,398 : lu comme un vert
     SOMBRE, alors qu'à 6 % sur blanc il s'affiche menthe très clair
     (0,96). `corrigerCouleur` en concluait « fond sombre, donc encre
     blanche » et écrivait `color:#FFF !important` sur un panneau quasi
     blanc. Le filet de sécurité FABRIQUAIT le blanc sur blanc qu'il était
     censé empêcher : mesuré à 1,00 de contraste sur « 21 », « Gratuites »,
     « Premium », dans les deux thèmes.

     On compose donc la pile de fonds comme le ferait le moteur de rendu :
     on empile les couches semi-transparentes jusqu'à la première opaque
     (blanc par défaut si la page n'en pose aucune), puis on les fusionne
     de l'arrière vers l'avant. Le résultat est toujours une couleur
     opaque, donc une luminance juste. */
  function fondEffectif(el) {
    var couches = [], n = el;
    while (n && n.nodeType === 1) {
      var m = String(getComputedStyle(n).backgroundColor).match(/[\d.]+/g);
      if (m && m.length >= 3) {
        var a = m.length > 3 ? parseFloat(m[3]) : 1;
        if (a > 0) {
          couches.push([+m[0], +m[1], +m[2], a]);
          if (a >= 1) break;          /* opaque : inutile de remonter plus haut */
        }
      }
      n = n.parentElement;
    }
    var base = [255, 255, 255];
    if (couches.length && couches[couches.length - 1][3] >= 1) {
      base = couches.pop().slice(0, 3);
    }
    for (var i = couches.length - 1; i >= 0; i--) {
      var c = couches[i], al = c[3];
      base = [c[0] * al + base[0] * (1 - al),
              c[1] * al + base[1] * (1 - al),
              c[2] * al + base[2] * (1 - al)];
    }
    return 'rgb(' + Math.round(base[0]) + ',' + Math.round(base[1]) + ',' + Math.round(base[2]) + ')';
  }

  /* Couleurs posées en style EN LIGNE sur du texte ou un tracé SVG.
     Aucune règle CSS ne peut les corriger correctement : `[style*="…"]`
     les attrape, mais ignore sur quel fond elles sont posées. Ici, non.

     Deux cas, une seule règle : on remplace dès que la couleur est de l'or
     de l'ancienne charte (à bannir), OU que son contraste avec le fond
     réel est insuffisant — ce qui arrive mécaniquement après aplatissement
     d'un dégradé (du navy #142554 écrit pour un fond clair se retrouve sur
     du bleu #1E499B). Le remplacement suit la luminance : blanc sur fond
     sombre, bleu sur fond clair. */
  var ECART_MINI = 0.28;   /* écart de luminance en deçà duquel on corrige */

  function corrigerCouleur(el) {
    var s = getComputedStyle(el);
    /* Le fond pertinent est celui de l'élément LUI-MÊME, pas de son parent :
       un bandeau qui porte à la fois `background` et `color` pose son texte
       sur SON fond. Partir du parent renvoyait la couleur du bloc englobant
       — d'où un « color:#fff » sur bandeau navy jugé « posé sur du blanc »,
       donc remplacé par du bleu… sur du navy. `fondEffectif` remonte de
       toute façon aux ancêtres quand l'élément n'a pas de fond propre. */
    var lFond = luminance(fondEffectif(el));
    if (lFond === null) return;

    /* L'or n'est PLUS banni : il est redevenu la couleur d'action de la
       maison (cf. §1 et §20 de theme-lws.css). On ne le remplace donc plus
       par principe — seulement s'il échoue au contraste, comme n'importe
       quelle autre teinte. Un or sur navy passe le test et reste doré ;
       un or sur crème ne passe pas et bascule. */
    var aCorriger = ['color', 'fill', 'stroke'].filter(function (p) {
      var v = s[p] && String(s[p]).trim();
      if (!v || v === 'none') return false;
      var l = luminance(v);
      return l !== null && Math.abs(l - lFond) < ECART_MINI;
    });
    if (!aCorriger.length) return;

    var remplacement = lFond < 0.5 ? '#FFFFFF' : BLEU;
    aCorriger.forEach(function (p) {
      el.style.setProperty(p, remplacement, 'important');
    });
  }

  /* Extrait la première couleur exploitable d'une déclaration de dégradé.
     On saute `transparent` et les alphas nuls : dans
     `linear-gradient(90deg,transparent,#FFC93C,transparent)` la couleur qui
     porte le fond est la deuxième, pas la première. */
  function premiereCouleur(decl) {
    var jetons = decl.match(/#[0-9a-f]{3,8}\b|rgba?\([^)]*\)|hsla?\([^)]*\)/gi);
    if (!jetons) return null;
    for (var i = 0; i < jetons.length; i++) {
      var c = jetons[i].trim();
      if (/^transparent$/i.test(c)) continue;
      var alpha = c.match(/^rgba?\([^)]*,\s*([\d.]+)\s*\)$/i)
               || c.match(/^hsla?\([^)]*,\s*([\d.]+)\s*\)$/i);
      if (alpha && parseFloat(alpha[1]) < 0.12) continue;   // quasi invisible
      if (/^#[0-9a-f]{8}$/i.test(c) && parseInt(c.slice(7), 16) < 30) continue;
      return OR.test(c) ? BLEU : c;
    }
    return null;
  }

  function aplatir(el) {
    if (!el || el.nodeType !== 1 || el.dataset.lwsFlat) return;

    /* On lit le style EN LIGNE, pas le style calculé : la feuille a déjà
       forcé `background-image:none !important`, donc getComputedStyle ne
       renvoie plus rien d'utile. L'attribut, lui, est intact. */
    var decl = el.style.backgroundImage || el.style.background || '';
    if (!GRADIENT.test(decl)) return;

    el.dataset.lwsFlat = '1';

    /* Un fond déjà posé explicitement fait autorité : on ne l'écrase pas.
       Attention au piège qui a coûté une passe de débogage : quand le
       dégradé est écrit avec la propriété RACCOURCIE (`background:
       linear-gradient(…)`), le navigateur remet backgroundColor à la
       chaîne « initial » — ni vide, ni « transparent », ni « rgba(0,0,0,0) ».
       Un test naïf la prend pour une vraie couleur et saute l'élément. */
    var deja = (el.style.backgroundColor || '').trim();
    if (deja && !/^(initial|inherit|unset|revert|transparent|rgba\(0,\s*0,\s*0,\s*0\))$/i.test(deja)) return;

    var couleur = premiereCouleur(decl);
    if (!couleur) return;

    /* GARDE-FOU CLARTÉ — la règle du §25 de la feuille : dans la vitrine,
       aucun GRAND bloc n'est sombre. Les seuls aplats foncés admis sont la
       bande utilitaire, le bandeau d'annonce, le pied de page, les boutons
       et le cadre vidéo — tous stylés par des classes, aucun par un dégradé
       en ligne.

       Sans ce garde-fou, aplatir un dégradé navy repose fidèlement… du navy,
       et un bandeau de 678×97 px réapparaît en sombre au milieu d'une page
       claire (constaté sur « Palmarès de la semaine »). On lui substitue le
       gris de section, et le texte repasse en navy — la correction de
       contraste qui suit dans `passe()` s'en charge automatiquement.

       Un petit élément garde sa couleur : une pastille ou un bouton foncé
       de 40 px n'alourdit pas la page, il la ponctue. */
    var r = el.getBoundingClientRect();
    var grand = r.width > 200 && r.height > 60;
    var l = luminance(couleur);
    if (grand && l !== null && l < 0.45) {
      el.style.backgroundColor = '#F4F5F8';
      el.dataset.lwsEclairci = '1';
    } else {
      el.style.backgroundColor = couleur;
    }
  }

  function passe(racine) {
    var portail = racine || document.getElementById('VISITOR');
    if (!portail) return;

    /* 1. Aplatir d'abord : la correction de l'or lit le fond effectif, qui
          n'est juste qu'une fois les dégradés remplacés par leur aplat. */
    aplatir(portail);
    var deg = portail.querySelectorAll('[style*="gradient"]');
    for (var i = 0; i < deg.length; i++) aplatir(deg[i]);

    /* 2. Puis les couleurs en ligne, texte et tracés SVG. On ne balaie que
          les éléments qui EN DÉCLARENT une : inutile d'auditer les 868
          nœuds de la page à chaque re-rendu. */
    var teintes = portail.querySelectorAll(
      '[style*="color"],[style*="fill"],[style*="stroke"]');
    for (var j = 0; j < teintes.length; j++) corrigerCouleur(teintes[j]);

    /* 3. Le filet de sécurité — DANS LES DEUX THÈMES.
          Les étapes 1 et 2 ne regardent que les éléments qui DÉCLARENT une
          couleur en ligne. En thème sombre, l'encre claire n'est pas en
          ligne : elle vient d'une règle d'app.css posée sur #VISITOR, et
          elle est HÉRITÉE. Aucun de ces éléments n'entrait donc dans le
          balayage — d'où du blanc sur blanc mesuré à 1,00 de contraste
          (« Gratuites », « Premium », « VÉRITAS Academy »).

          Le §37 de theme-lws.css rejoue désormais les 59 jetons sombres à
          leur valeur claire, ce qui traite la cause côté jetons. Restent
          les règles qui écrivent une couleur EN DUR.

          MESURE, page des labos, éléments RÉELLEMENT VISIBLES :
              thème clair ..... 125 éléments sous 4,5:1
              thème sombre ....  70 éléments sous 4,5:1
          Le clair est le PLUS touché. « 21 », « Gratuites », « Premium »,
          « Chimie · Tle C/D » sont du blanc pur sur blanc pur (1,00) dans
          les DEUX thèmes : ces libellés étaient écrits pour un panneau
          sombre dont le fond a été aplati au blanc par la refonte, sans
          que l'encre suive. Réserver cette passe au thème sombre, comme je
          l'avais d'abord fait, laissait donc le pire cas en place.

          Elle ne lit que les éléments porteurs de texte, et `corrigerCouleur`
          sort immédiatement dès que l'écart de luminance est suffisant :
          un gris secondaire à 0,37 d'écart n'est pas touché, seul
          l'illisible l'est. */
    var noeuds = portail.querySelectorAll('*');
    for (var k = 0; k < noeuds.length; k++) {
      var el = noeuds[k];
      var porteDuTexte = false;
      for (var c = 0; c < el.childNodes.length; c++) {
        var n = el.childNodes[c];
        if (n.nodeType === 3 && n.textContent.trim().length > 1) { porteDuTexte = true; break; }
      }
      if (porteDuTexte) corrigerCouleur(el);
    }
  }

  /* La vitrine se re-rend à chaque changement de section (vShowSec) : sans
     observateur, seule la page d'accueil serait traitée. On n'écoute que
     les ajouts de nœuds — pas les attributs — pour ne pas boucler sur nos
     propres écritures de `background-color`. */
  function observer() {
    var portail = document.getElementById('VISITOR');
    if (!portail || !window.MutationObserver) return;
    var enAttente = false;
    new MutationObserver(function (mutations) {
      if (enAttente) return;
      for (var i = 0; i < mutations.length; i++) {
        if (mutations[i].addedNodes && mutations[i].addedNodes.length) {
          enAttente = true;
          requestAnimationFrame(function () { enAttente = false; passe(); });
          return;
        }
      }
    }).observe(portail, { childList: true, subtree: true });

    /* Le bouton de thème (`vrtToggleTheme`) bascule `data-theme` sur
       <html>. L'observateur ci-dessus n'écoute que les AJOUTS de nœuds :
       une bascule ne crée aucun nœud, donc rien ne se rejouait, et les
       aplats calculés sous l'ancien thème restaient en place. On écoute
       donc l'attribut, sur la racine — pas sur le portail, où il n'est
       pas posé. */
    new MutationObserver(function () {
      requestAnimationFrame(function () { passe(); });
    }).observe(document.documentElement, {
      attributes: true, attributeFilter: ['data-theme']
    });
  }

  function demarrer() {
    passe();
    observer();
    /* Deux rattrapages : app.js (~3,4 Mo, en `defer`) peut peindre la
       vitrine après nous, et certains blocs arrivent d'un fetch. Même
       idiome que _vChromeCompact() / _vAmbassaFab() dans la coquille. */
    setTimeout(passe, 1200);
    setTimeout(passe, 4000);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', demarrer);
  } else {
    demarrer();
  }
})();
