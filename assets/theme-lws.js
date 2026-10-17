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
  /* ── CONTRASTE AU SENS DES NORMES (17/10/2026) ──────────────────────────
     L'écart de luminance ci-dessous ne rattrape que l'encre « de la couleur
     du fond ». Il laissait passer, mesuré sur les écrans publics, du gris à
     2,3–2,9:1 (« 10 questions · 30 min », les prix, « Toutes classes ») et
     le vert WhatsApp à 1,98:1 sur blanc — rien de tout cela n'existe sur la
     vitrine, dont le gris le plus pâle (#6E7385) fait 4,9:1. On mesure donc
     le rapport WCAG, et sous le seuil (4,5:1, ou 3:1 pour un grand texte)
     on fonce — ou on éclaircit — LA MÊME teinte : un vert reste vert. */
  function lumW(c) {
    var v = c.map(function (x) { x /= 255; return x <= 0.03928 ? x / 12.92 : Math.pow((x + 0.055) / 1.055, 2.4); });
    return 0.2126 * v[0] + 0.7152 * v[1] + 0.0722 * v[2];
  }
  function rapport(a, b) {
    var x = lumW(a), y = lumW(b);
    return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05);
  }
  function relever(el, s) {
    var txt = false;
    for (var i = 0; i < el.childNodes.length; i++) {
      if (el.childNodes[i].nodeType === 3 && el.childNodes[i].textContent.trim().length > 1) { txt = true; break; }
    }
    if (!txt) return;
    var f = rgbDe(fondEffectif(el));
    var m = String(s.color).match(/[\d.]+/g);
    if (!f || !m || m.length < 3) return;
    var a = m.length > 3 ? +m[3] : 1;
    var c = [0, 1, 2].map(function (k) { return +m[k] * a + f[k] * (1 - a); });
    var taille = parseFloat(s.fontSize) || 16;
    var seuil = (taille >= 24 || (taille >= 18.6 && (+s.fontWeight || 400) >= 700)) ? 3 : 4.5;
    if (rapport(c, f) >= seuil) return;
    var clair = lumW(f) > 0.18;
    for (var n = 0; n < 24 && rapport(c, f) < seuil; n++) {
      c = clair ? c.map(function (x) { return x * 0.9; })
                : c.map(function (x) { return x + (255 - x) * 0.15; });
    }
    el.style.setProperty('color', 'rgb(' + c.map(Math.round).join(',') + ')', 'important');
  }

  /* « #1E499B », « #fff » ou « rgb(…) » → [r, g, b] ; null sinon. */
  function rgbDe(c) {
    if (!c) return null;
    c = String(c).trim();
    if (c.charAt(0) === '#') {
      var h = c.slice(1);
      if (h.length === 3 || h.length === 4) h = h.charAt(0) + h.charAt(0) + h.charAt(1) + h.charAt(1) + h.charAt(2) + h.charAt(2);
      if (h.length < 6) return null;
      return [parseInt(h.slice(0, 2), 16), parseInt(h.slice(2, 4), 16), parseInt(h.slice(4, 6), 16)];
    }
    var m = c.match(/[\d.]+/g);
    return m && m.length >= 3 ? [+m[0], +m[1], +m[2]] : null;
  }

  function fondEffectif(el) {
    var couches = [], n = el;
    while (n && n.nodeType === 1) {
      /* 17/10/2026 — un fond peut être un DÉGRADÉ venu d'une feuille (pas
         d'un style en ligne : `aplatir` ne le voit pas). Lu comme
         « transparent », il faisait juger du texte navy « posé sur du
         blanc » alors qu'il l'était sur du bleu nuit — « Rejoindre l'équipe
         VÉRITAS » (Pour vous, enseignant) était illisible en production.
         On prend sa première couleur, comme couche opaque. */
      var bi = getComputedStyle(n).backgroundImage;
      if (bi && bi !== 'none' && /gradient\(/i.test(bi)) {
        var pc = rgbDe(premiereCouleur(bi));
        if (pc) { couches.push([pc[0], pc[1], pc[2], 1]); break; }
      }
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
    if (!aCorriger.length) { relever(el, s); return; }

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

  /* 17/10/2026 — L'HABILLAGE DE LA VITRINE n'est pas à nous. La barre, le
     bandeau, le pied et les bulles (.vrt-hab, posés dans #VISITOR par
     tools/habiller_pages.py) doivent rester ceux de la vitrine au pixel
     près : aplatis ou « corrigés » ici, le bandeau perdait son dégradé et
     « Orange Money » passait du brique au blanc. */
  function horsHabillage(el) {
    return !(el.closest && el.closest('.vrt-hab'));
  }

  /* ═══ LA VITRINE DANS LE CONTENU (17/10/2026) ═══════════════════════════
     « N'oublie pas les icônes, les puces, les pastilles, les alternances de
     couleurs exactement comme sur la vitrine » (Jacques). Les écrans de
     l'application emploient déjà les icônes Lucide de la vitrine (lc-*),
     mais NUES : noires, toutes pareilles, posées au-dessus du titre. La
     vitrine, elle, les met dans un MÉDAILLON rond teinté, fait tourner six
     teintes de bloc en bloc, coche ses listes d'un disque de la teinte et
     arrondit ses pastilles. On ne réécrit pas les ~40 fonctions de rendu :
     on lit ce qu'elles produisent et on pose les classes vm-* (le dessin
     est dans theme-lws.css, § 40). Même ordre de teintes que
     assets/veritas-medaillons.js sur les pages statiques. */
  var TEINTES = ['bleu', 'sarcelle', 'vert', 'violet', 'rose', 'brique'];
  var HORS_CONTENU = 'button,.btn,input,select,textarea,label,nav,.vftab,.vftabs,[role="tablist"],[role="menu"],.vrt-hab,.vm-puce,.vfo-ligne-t';
  var EN_LIGNE = /^(H[1-6]|P|SPAN|B|STRONG|SMALL|EM|I|A|LABEL|LI|TD|TH|BUTTON)$/;
  var PUCE_TEXTE = /^[\s ]*[✓✔✅•·▸►→–\-]️?[\s ]*/;
  var NS = 'http://www.w3.org/2000/svg';

  function visible(el) { return !!(el.offsetWidth || el.offsetHeight); }
  function estIcone(n) {
    return n && n.nodeType === 1 && n.tagName.toLowerCase() === 'svg' && !!n.querySelector('use');
  }
  /* Un porte-icône : ne contient QUE des icônes (et des liants d'émoji). */
  function porteIcone(el) {
    var svgs = 0;
    for (var i = 0; i < el.childNodes.length; i++) {
      var n = el.childNodes[i];
      if (n.nodeType === 3) { if (n.textContent.replace(/[\s‍️]/g, '')) return false; }
      else if (estIcone(n)) svgs++;
      else if (n.nodeType === 1) return false;
    }
    return svgs >= 1 && svgs <= 3;
  }
  /* L'élément ouvre-t-il son bloc (rien de visible avant lui) ? */
  function enTete(el) {
    for (var n = el.parentNode.firstChild; n && n !== el; n = n.nextSibling) {
      if (n.nodeType === 3 && n.textContent.trim()) return false;
      if (n.nodeType === 1 && visible(n)) return false;
    }
    return true;
  }
  function estCarte(el) {
    if (!el || el.tagName === 'LI' || el.id === 'vContent') return false;
    var cs = getComputedStyle(el);
    if ((parseFloat(cs.borderTopLeftRadius) || 0) < 8) return false;
    var fond = cs.backgroundColor && !/rgba\(0, 0, 0, 0\)|transparent/.test(cs.backgroundColor);
    return fond || parseFloat(cs.borderTopWidth) > 0 || cs.boxShadow !== 'none';
  }
  function puce() {
    var s = document.createElement('span');
    s.className = 'vm-puce';
    s.setAttribute('aria-hidden', 'true');
    var svg = document.createElementNS(NS, 'svg');
    svg.setAttribute('viewBox', '0 0 24 24');
    svg.setAttribute('width', '13'); svg.setAttribute('height', '13');
    svg.setAttribute('fill', 'none'); svg.setAttribute('stroke', '#fff');
    svg.setAttribute('stroke-width', '3.2'); svg.setAttribute('stroke-linecap', 'round');
    svg.setAttribute('stroke-linejoin', 'round');
    var u = document.createElementNS(NS, 'use');
    u.setAttribute('href', '#lc-check');
    svg.appendChild(u); s.appendChild(svg);
    return s;
  }

  function vitriner(zone) {
    if (!zone) return;
    /* 1. MÉDAILLONS — l'icône de tête d'un bloc. */
    var meds = [];
    var cands = zone.querySelectorAll('div,span,svg');
    for (var i = 0; i < cands.length; i++) {
      var el = cands[i];
      if (el.classList.contains('vm-med')) { meds.push(el); continue; }
      if (el.closest(HORS_CONTENU) || el.closest('.vm-med')) continue;
      var bloc = el.parentElement;
      if (!bloc || bloc === zone || !visible(el)) continue;
      var tag = el.tagName.toLowerCase();
      if (tag === 'svg') {
        // Icône nue : seulement si elle ouvre un BLOC (pas une ligne de texte).
        if (!estIcone(el) || EN_LIGNE.test(bloc.tagName) || el.getBoundingClientRect().width < 16) continue;
      } else if (!porteIcone(el)) continue;
      if (!enTete(el) || !(bloc.textContent || '').trim()) continue;
      var med = el;
      if (tag === 'svg') {
        med = document.createElement('span');
        bloc.insertBefore(med, el); med.appendChild(el);
      } else {
        // Un émoji composé (👨‍🏫) avait donné DEUX icônes collées : la vitrine
        // n'en montre qu'une par médaillon.
        var svgs = med.querySelectorAll(':scope > svg');
        for (var k = 1; k < svgs.length; k++) svgs[k].remove();
        for (var t = med.childNodes.length - 1; t >= 0; t--) if (med.childNodes[t].nodeType === 3) med.removeChild(med.childNodes[t]);
      }
      med.classList.add('vm-med');
      med.setAttribute('aria-hidden', 'true');
      meds.push(med);
    }
    for (var m = 0; m < meds.length; m++) {
      var teinte = TEINTES[m % TEINTES.length];
      meds[m].setAttribute('data-vm', teinte);
      var c = meds[m].parentElement;
      // Une ligne (icône à gauche, libellé et valeur à droite) : contact,
      // avantages… Le médaillon se pose À CÔTÉ du texte, jamais au milieu.
      if (c && meds[m] === c.firstElementChild && c.children.length >= 2 && (c.tagName === 'LI' || !estCarte(c))) {
        var dc = getComputedStyle(c);
        if (c.tagName === 'LI' || (dc.display.indexOf('flex') >= 0 && dc.flexDirection.indexOf('row') === 0)) {
          c.classList.add('vm-ligne');
          c.setAttribute('data-vm', teinte);
          continue;
        }
      }
      if (c && !c.closest('li')) {
        c.setAttribute('data-vm', teinte);
        // Le titre de la carte : l'élément qui suit le médaillon, s'il est court.
        var ti = meds[m].nextElementSibling;
        if (ti && estCarte(c) && !/^H[12]$/.test(ti.tagName) && !ti.classList.contains('pgt') &&
            !ti.classList.contains('vm-titre') && !ti.closest(HORS_CONTENU) && !ti.querySelector('div,p,ul,button')) {
          var lt = (ti.textContent || '').trim().length;
          if (lt > 0 && lt <= 60) ti.classList.add('vm-titre');
        }
        if (getComputedStyle(c).textAlign === 'center') meds[m].classList.add('vm-centre');
        if (estCarte(c)) {
          c.classList.add('vm-carte');
          if (c.tagName === 'A' || c.hasAttribute('onclick') || c.getAttribute('role') === 'button') c.classList.add('vm-clic');
        }
      }
    }

    /* 1 bis. TITRES DES CARTES SANS MÉDAILLON (« Inscription au Centre
          VÉRITAS ») : la première ligne courte d'une carte est son titre. */
    var cartes = zone.querySelectorAll('.vcard,.card');
    for (var ct = 0; ct < cartes.length; ct++) {
      var t1 = cartes[ct].firstElementChild;
      if (!t1 || t1.classList.contains('vm-med') || t1.classList.contains('vm-ligne') || t1.classList.contains('pgt') ||
          /^H1$/.test(t1.tagName) || t1.closest(HORS_CONTENU) || t1.querySelector('div,p,ul,button,input')) continue;
      var l1 = (t1.textContent || '').trim().length;
      if (l1 > 0 && l1 <= 60) t1.classList.add('vm-titre');
    }

    /* 1 ter. TEXTE ÉCLATÉ EN COLONNES (18/10/2026). Un conteneur flexible
          en ligne dont le texte n'est pas enveloppé fait de CHAQUE morceau
          (« texte », <b>, « texte », <b>…) une colonne : le cadre « Aucun
          fichier n'est téléchargeable » de la fiche livre s'affichait en
          quatre colonnes sur téléphone. On regroupe chaque suite de texte et
          de balises en ligne dans un seul <span>. */
    var EN_LIGNE_FLUX = /^(B|STRONG|EM|I|A|SMALL|SPAN|CODE|MARK|U|S|SUP|SUB|BR)$/;
    var flex = zone.querySelectorAll('div,p,li,label,span,a');
    for (var fx = 0; fx < flex.length; fx++) {
      var fe = flex[fx];
      if (fe.closest('.vrt-hab') || fe.classList.contains('vm-flux')) continue;
      var aTexte = false, aBalise = false;
      for (var q = 0; q < fe.childNodes.length; q++) {
        var cn = fe.childNodes[q];
        if (cn.nodeType === 3 && cn.textContent.trim()) aTexte = true;
        else if (cn.nodeType === 1 && EN_LIGNE_FLUX.test(cn.tagName) && !cn.classList.contains('vm-med')) aBalise = true;
      }
      if (!aTexte || !aBalise) continue;
      var dcs = getComputedStyle(fe);
      if (dcs.display.indexOf('flex') < 0 || dcs.flexDirection.indexOf('row') !== 0) continue;
      var run = [], groupes = [];
      for (var q2 = 0; q2 < fe.childNodes.length; q2++) {
        var c2 = fe.childNodes[q2];
        var flux = c2.nodeType === 3 || (c2.nodeType === 1 && EN_LIGNE_FLUX.test(c2.tagName) && c2.tagName !== 'SPAN' || (c2.nodeType === 1 && c2.tagName === 'SPAN' && !c2.querySelector('svg') && !c2.classList.contains('vm-med')));
        if (flux) run.push(c2); else { if (run.length) groupes.push(run); run = []; }
      }
      if (run.length) groupes.push(run);
      groupes.forEach(function (g) {
        if (g.length < 2 || !g.some(function (n) { return n.nodeType === 3 && n.textContent.trim(); })) return;
        var sp = document.createElement('span');
        sp.className = 'vm-flux';
        g[0].parentNode.insertBefore(sp, g[0]);
        g.forEach(function (n) { sp.appendChild(n); });
      });
    }

    /* 2. PUCES — le disque coché de la teinte du bloc. */
    var lis = zone.querySelectorAll('li');
    for (var l = 0; l < lis.length; l++) {
      var li = lis[l];
      if (li.classList.contains('vm-li') || li.closest(HORS_CONTENU) || li.querySelector('.vm-med,button,input,select,a.btn')) continue;
      var ul = li.parentElement;
      if (!ul || ul.tagName === 'OL') continue;
      var premier = li.firstChild;
      while (premier && premier.nodeType === 3 && !premier.textContent.trim()) premier = premier.nextSibling;
      var marque = false;
      if (estIcone(premier)) { premier.remove(); marque = true; }
      else if (premier && premier.nodeType === 3 && PUCE_TEXTE.test(premier.textContent)) {
        premier.textContent = premier.textContent.replace(PUCE_TEXTE, ''); marque = true;
      } else if (getComputedStyle(ul).listStyleType !== 'none') marque = true;
      else {
        // Puce dessinée par une feuille (::before) : « Apportez les documents… »
        var av = getComputedStyle(li, '::before').content;
        if (av && av !== 'none' && av !== 'normal') marque = true;
      }
      if (!marque) continue;
      // Le reste du contenu passe dans un seul bloc, à droite de la puce.
      var corps = document.createElement('span');
      corps.className = 'vm-li-tx';
      while (li.firstChild) corps.appendChild(li.firstChild);
      li.appendChild(puce()); li.appendChild(corps);
      li.classList.add('vm-li');
      ul.classList.add('vm-ul');
    }

    /* 3. PASTILLES — la forme de la vitrine (on garde leur couleur : un
          « Gratuit » vert ou un « Premium » or disent quelque chose). */
    var pas = zone.querySelectorAll('[class*="badge"],[class*="tag"],[class*="chip"],[class*="pill"],[class*="pastille"],span[style*="border-radius"]');
    for (var p = 0; p < pas.length; p++) {
      var b = pas[p];
      if (b.classList.contains('vm-pas') || b.closest(HORS_CONTENU) || b.classList.contains('vm-med') || !visible(b)) continue;
      var tx = (b.textContent || '').trim();
      if (!tx || tx.length > 42 || b.querySelector('div,p,ul,img')) continue;
      var r = b.getBoundingClientRect();
      if (r.height > 34 || r.height < 14) continue;
      b.classList.add('vm-pas');
    }
  }

  window._vtVitriner = function () { try { vitriner(document.getElementById('vContent')); } catch (e) {} };
  window._vtPasseTheme = function () { try { passe(); } catch (e) {} };

  function passe(racine) {
    var portail = racine || document.getElementById('VISITOR');
    if (!portail) return;
    try { vitriner(document.getElementById('vContent')); } catch (e) {}

    /* 1. Aplatir d'abord : la correction de l'or lit le fond effectif, qui
          n'est juste qu'une fois les dégradés remplacés par leur aplat. */
    aplatir(portail);
    var deg = portail.querySelectorAll('[style*="gradient"]');
    for (var i = 0; i < deg.length; i++) if (horsHabillage(deg[i])) aplatir(deg[i]);

    /* 2. Puis les couleurs en ligne, texte et tracés SVG. On ne balaie que
          les éléments qui EN DÉCLARENT une : inutile d'auditer les 868
          nœuds de la page à chaque re-rendu. */
    var teintes = portail.querySelectorAll(
      '[style*="color"],[style*="fill"],[style*="stroke"]');
    for (var j = 0; j < teintes.length; j++) if (horsHabillage(teintes[j])) corrigerCouleur(teintes[j]);

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
      if (porteDuTexte && horsHabillage(el)) corrigerCouleur(el);
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
