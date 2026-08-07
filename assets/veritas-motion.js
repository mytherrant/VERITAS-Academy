/* ═══════════════════════════════════════════════════════════════════════════
   VÉRITAS — Promotion des barres de filtres en onglets flottants  v1.15.2
   ───────────────────────────────────────────────────────────────────────────
   Couche d'AMÉLIORATION PROGRESSIVE. Elle ne crée aucune fonctionnalité : si ce
   fichier ne se charge pas, les filtres restent exactement ce qu'ils étaient.
   Elle ne réécrit jamais un gestionnaire `onclick` — elle habille, elle ne
   détourne pas.

   Pourquoi du JS alors que le reste est en CSS : les boutons de filtre portent
   leurs styles EN LIGNE (fond, rayon, couleur), et un style en ligne l'emporte
   sur une feuille. Plutôt que de couvrir app.css de `!important`, on retire les
   quelques propriétés en conflit et on laisse la feuille reprendre la main.
   C'est aussi la seule façon de savoir quel onglet est actif : l'information
   n'existe que dans le fond en ligne du bouton.

   DEUX PIÈGES DE CET ENVIRONNEMENT, appris à la dure :
   • `requestAnimationFrame` ne s'exécute PAS dans un onglet d'arrière-plan. Un
     verrou « une passe par image » n'y serait jamais relâché et la barre
     resterait figée au retour. Tout ici est synchrone.
   • `#vContent` est reconstruit à chaque navigation (et l'accueil se rend
     plusieurs fois). Tout doit donc être IDEMPOTENT et rejouable.
   ═══════════════════════════════════════════════════════════════════════════ */

(function () {
  'use strict';

  var MARQUE = 'data-vm-ok';

  // Réglage système : on n'installe pas la cascade si l'utilisateur a demandé
  // moins d'animation. Les onglets flottants, eux, restent — c'est de la
  // structure, pas de la décoration.
  var sobre = window.matchMedia &&
              window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ── Luminance : sert à repérer l'onglet actif ────────────────────────────
     Dans toutes ces barres, l'actif est le seul à fond sombre (navy) ; les
     autres sont sur un bleu très pâle. On compare donc les clartés plutôt que
     de coder en dur une liste de couleurs, qui a déjà changé deux fois. */
  function clarte(couleur) {
    var m = /rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?/.exec(couleur || '');
    if (!m) return 1;
    if (m[4] !== undefined && parseFloat(m[4]) < 0.25) return 1; // transparent = clair
    return (0.2126 * +m[1] + 0.7152 * +m[2] + 0.0722 * +m[3]) / 255;
  }

  /* ── Une rangée est-elle une barre de filtres ? ───────────────────────────
     Signature volontairement étroite : uniquement des <button> SANS classe, en
     pilule (rayon en ligne), au moins trois. Elle attrape les filtres des
     labos, des épreuves et des jeux, et laisse tranquilles les rangées
     d'action (.vfx-cta, .vp-tool), qui ont, elles, des classes. */
  function estBarreDeFiltres(rangee) {
    var enfants = [].slice.call(rangee.children);
    if (enfants.length < 3) return null;
    var boutons = [], intrus = 0;
    for (var i = 0; i < enfants.length; i++) {
      var e = enfants[i];
      if (e.tagName !== 'BUTTON') {
        // La barre des jeux commence par un <div> d'étiquette. On tolère ces
        // intrus tant qu'ils ne sont pas eux-mêmes cliquables et restent
        // minoritaires — sinon on retomberait sur des rangées d'action.
        if (e.querySelector('button, a, input, select')) return null;
        intrus++;
        continue;
      }
      if (e.className) return null;                    // bouton stylé par classe → pas un filtre
      if (!/border-radius/.test(e.getAttribute('style') || '')) return null;
      boutons.push(e);
    }
    if (boutons.length < 3 || intrus >= boutons.length) return null;

    // DERNIER FILTRE, et le plus important. Une rangée de pilules sans classe
    // n'est pas forcément une barre de filtres : les boutons de partage du
    // « Passage du jour » (WhatsApp, Facebook, X, Copier) ont exactement la même
    // forme — et se sont retrouvés promus en onglets, avec « X » marqué actif.
    //
    // Ce qui les sépare : une barre de filtres a une couleur DOMINANTE, celle
    // de l'état inactif, partagée par presque tous ses onglets. Les boutons de
    // partage portent chacun la couleur de leur marque, donc aucune dominante.
    var fonds = boutons.map(function (b) { return getComputedStyle(b).backgroundColor; });
    var tally = {}, dominante = 0;
    fonds.forEach(function (f) { tally[f] = (tally[f] || 0) + 1; if (tally[f] > dominante) dominante = tally[f]; });
    if (dominante / boutons.length < 0.6) return null;

    return boutons;
  }

  var EN_CONFLIT = ['background', 'background-color', 'color', 'padding',
                    'border-radius', 'font-size', 'font-weight', 'border',
                    'transition', 'cursor'];

  function promouvoir(rangee) {
    var boutons = estBarreDeFiltres(rangee);
    if (!boutons) return false;

    // Repérer l'actif AVANT de toucher aux styles : l'information disparaît
    // avec le fond en ligne.
    //
    // Première version : « le plus sombre est l'actif ». Faux sur la page des
    // épreuves, dont les filtres marquent l'actif autrement. La règle qui tient
    // sur les trois pages est celle de l'INTRUS : dans une barre de filtres,
    // tous les onglets partagent le même fond sauf un — celui qui est
    // sélectionné. On tranche donc par la minorité, pas par la couleur, ce qui
    // reste vrai quelle que soit la palette retenue demain.
    var fonds = boutons.map(function (b) { return getComputedStyle(b).backgroundColor; });
    var compte = {};
    fonds.forEach(function (f) { compte[f] = (compte[f] || 0) + 1; });
    var actif = -1;
    var uniques = Object.keys(compte).filter(function (f) { return compte[f] === 1; });
    if (uniques.length === 1 && boutons.length >= 3) {
      actif = fonds.indexOf(uniques[0]);
    } else {
      // Repli : aucun intrus net (barre à deux styles, ou tous identiques) —
      // on retombe sur la clarté, qui suffit pour les labos.
      var clartes = fonds.map(clarte);
      var mini = Math.min.apply(null, clartes);
      if (mini < 0.45) actif = clartes.indexOf(mini);
    }

    rangee.classList.add('vftabs');
    rangee.setAttribute(MARQUE, '1');
    rangee.style.removeProperty('flex-wrap');   // la barre défile, elle ne passe plus à la ligne

    boutons.forEach(function (b, i) {
      EN_CONFLIT.forEach(function (p) { b.style.removeProperty(p); });
      b.classList.add('vftab');
      if (i === actif) b.classList.add('is-on');
      b.setAttribute('role', 'tab');
      b.setAttribute('aria-selected', i === actif ? 'true' : 'false');
    });

    brancherBords(rangee);
    return true;
  }

  /* ── Où la barre doit-elle se coller ? ────────────────────────────────────
     `position:sticky` se cale sur le conteneur de DÉFILEMENT, pas sur la
     fenêtre — et dans le portail visiteur ce conteneur est un div interne qui
     commence sous l'en-tête. Un `top` écrit en dur (48 px) plaçait donc la
     barre 19 px trop bas, avec du contenu qui défilait dans l'interstice.
     On mesure : bas de la nav − haut du conteneur + une respiration. */
  function calerSousLaNav(barre) {
    // 1. Le conteneur de défilement réel. Il change selon la largeur d'écran :
    //    #vContent au-delà du seuil « bureau », un div englobant en dessous.
    var scroller = barre.parentElement;
    while (scroller && scroller !== document.body) {
      var ov = getComputedStyle(scroller).overflowY;
      if ((ov === 'auto' || ov === 'scroll') &&
          scroller.scrollHeight > scroller.clientHeight + 4) break;
      scroller = scroller.parentElement;
    }
    if (!scroller || scroller === document.body) return;

    var haut = 6;
    var nav = document.querySelector('.vnav');
    if (nav) {
      var n = nav.getBoundingClientRect(), b = barre.getBoundingClientRect();
      // 2. La nav ne gêne que si elle passe VRAIMENT au-dessus de la barre.
      //    Au-delà de ~900 px elle devient une colonne latérale (185 px de
      //    large, toute la hauteur) : lui réserver sa hauteur aurait poussé les
      //    onglets 550 px plus bas. On ne la compte que si elle chevauche la
      //    barre horizontalement.
      var chevaucheEnLargeur = n.right > b.left + 20 && n.left < b.right - 20;
      if (chevaucheEnLargeur) {
        // On additionne le `top` collant de la nav et sa HAUTEUR, au lieu de
        // lire sa position à l'écran : mesurée trop tôt — avant que la nav
        // n'ait pris sa place — celle-ci donnait 134 au lieu de 55, et la
        // valeur restait figée, laissant 85 px de vide sous la barre.
        // Ces deux grandeurs-ci ne dépendent ni du défilement ni du moment.
        var collant = parseFloat(getComputedStyle(nav).top) || 0;
        haut = Math.round(collant + n.height) + 6;
      }
    }
    if (haut >= 0 && haut < 200) barre.style.top = haut + 'px';
  }

  /* ── Fondus d'extrémité ───────────────────────────────────────────────────
     `reste` est mis en cache : c'est la seule mesure qui coûte un calcul de
     mise en page. Au défilement on ne lit que scrollLeft. Aucun rAF. */
  function mesurer(barre) {
    barre._reste = barre.scrollWidth - barre.clientWidth;
    etat(barre);
  }
  function etat(barre) {
    var reste = barre._reste;
    if (reste === undefined) return mesurer(barre);
    var x = barre.scrollLeft;
    barre.classList.toggle('at-start', reste <= 2 || x <= 2);
    barre.classList.toggle('at-end',   reste <= 2 || x >= reste - 2);
  }
  function brancherBords(barre) {
    calerSousLaNav(barre);
    if (barre._bordsOk) { mesurer(barre); return; }
    barre._bordsOk = true;
    barre.addEventListener('scroll', function () { etat(barre); }, { passive: true });
    window.addEventListener('resize', function () {
      calerSousLaNav(barre); mesurer(barre);
    }, { passive: true });
    mesurer(barre);
  }

  /* ── Cascade d'entrée des cartes ──────────────────────────────────────────
     Plafonnée à 8 rangs : au-delà, l'attente se remarque plus que l'effet. */
  function cascade(racine) {
    if (sobre) return;
    var grilles = racine.querySelectorAll('.acc-ess, .vp-grid');
    grilles.forEach(function (g) {
      // Le marqueur était posé sur la GRILLE. Or l'app remplace ses enfants au
      // re-rendu : la grille restait marquée « faite » pendant que les cartes
      // neuves, elles, n'avaient plus aucune classe — la cascade s'éteignait
      // après le premier rendu, sans rien signaler. On interroge donc les
      // enfants, seuls porteurs de la vérité.
      var enfants = [].slice.call(g.children);
      if (!enfants.length || enfants[0].classList.contains('vm-stagger')) return;
      enfants.forEach(function (c, i) {
        c.style.setProperty('--vm-i', Math.min(i, 8));
        c.classList.add('vm-stagger');
      });
    });
  }

  /* ── Reflet or sur les appels à l'action ──────────────────────────────────
     Réservé aux boutons OR (le CTA principal). Le mettre partout le banaliserait
     et ferait clignoter la page ; sur un seul bouton par écran, il attire l'œil
     là où on veut qu'il aille. */
  function reflets(racine) {
    if (sobre) return;
    racine.querySelectorAll('button, .btn').forEach(function (b) {
      if (b.classList.contains('vm-shine')) return;
      // Le CTA or est le plus souvent un DÉGRADÉ, pas un fond plein : ne lire
      // que backgroundColor ne trouvait rien du tout.
      var cs = getComputedStyle(b);
      var source = /gradient/.test(cs.backgroundImage) ? cs.backgroundImage : cs.backgroundColor;
      var m = /rgba?\((\d+),\s*(\d+),\s*(\d+)/.exec(source);
      if (!m) return;
      // or #FFC93C ≈ rgb(255,201,60), or clair #FFD86E ≈ rgb(255,216,110)
      if (+m[1] > 235 && +m[2] > 175 && +m[2] < 232 && +m[3] < 130) {
        b.classList.add('vm-shine');
      }
    });
  }

  /* ── Entrée de section ────────────────────────────────────────────────────
     `#vContent` change de contenu sans que rien ne le signale. Une montée de
     10 px suffit. On relance l'animation en retirant puis remettant la classe —
     un reflow forcé entre les deux, sinon le navigateur ne la rejoue pas. */
  var dernierRendu = '';
  function entree(zone) {
    if (sobre) return;
    var signature = (zone.firstElementChild && zone.firstElementChild.className) + '|' + zone.children.length;
    if (signature === dernierRendu) return;
    dernierRendu = signature;
    zone.classList.remove('vm-enter');
    void zone.offsetWidth;
    zone.classList.add('vm-enter');
  }

  /* ── Passage complet, idempotent ──────────────────────────────────────────
     L'observateur est débranché pendant qu'on écrit : sans cela nos propres
     modifications le rappelleraient en boucle. */
  var observateur = null;
  var enCours = false;

  function passe() {
    if (enCours) return;
    enCours = true;
    if (observateur) observateur.disconnect();
    try {
      var zone = document.getElementById('vContent');
      if (zone) {
        zone.querySelectorAll('div').forEach(function (d) {
          if (d.hasAttribute(MARQUE)) return;
          promouvoir(d);
        });
        cascade(zone);
        reflets(zone);
        entree(zone);
      }
    } catch (e) {
      // Une couche décorative ne doit jamais empêcher la page de fonctionner.
      if (window.console && console.debug) console.debug('[veritas-motion]', e);
    }
    if (observateur) brancherObservateur();
    enCours = false;
  }

  var minuteur = null;
  function passeDifferee() {
    clearTimeout(minuteur);
    minuteur = setTimeout(passe, 90);   // le rendu d'une section arrive par salves
  }

  function brancherObservateur() {
    var zone = document.getElementById('vContent');
    if (!zone) return;
    if (!observateur) observateur = new MutationObserver(passeDifferee);
    observateur.observe(zone, { childList: true, subtree: true });
  }

  function demarrer() {
    passe();
    brancherObservateur();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', demarrer, { once: true });
  } else {
    demarrer();
  }
  // Filet : la coquille peut créer #vContent après coup.
  setTimeout(demarrer, 1500);

  window._vmRefresh = passe;   // point d'entrée manuel, utile en console
})();
