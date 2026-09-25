/* ============================================================================
 *  VÉRITAS — Médaillons d'icône sur les cartes  ·  assets/veritas-medaillons.js
 *  © 2024-2026 Jacques Miterand TAKOU (Mythe Errant). Tous droits réservés.
 *
 *  POURQUOI CE FICHIER EXISTE
 *  Relevé le 20/08/2026 : 196 cartes sur les 151 pages statiques, dont 167
 *  sans la moindre icône. Une grille de quatre cartes blanches que seul leur
 *  titre distingue n'offre à l'œil aucun point d'accroche — le « monotone,
 *  fade » constaté par Jacques.
 *
 *  POURQUOI ICI ET PAS DANS LES GABARITS
 *  Ces pages viennent de sources différentes (tools/build_corriges.py,
 *  tools/build_seo.cjs, pages écrites à la main), et se répartissent sur DEUX
 *  feuilles de style — 85 pages sur veritas-pages.css, 55 sur
 *  veritas-refonte.css. Reprendre chaque générateur, c'est quatre chantiers
 *  et des pages oubliées. Une passe au chargement les couvre toutes du même
 *  geste, et couvrira celles qu'on ajoutera demain.
 *
 *  POURQUOI UN FICHIER À PART, ET PAS DANS veritas-ui.js
 *  veritas-ui.js n'est chargé que par 83 des 151 pages, et il embarque bien
 *  d'autres comportements — dont le bouton WhatsApp flottant. L'ajouter aux
 *  68 pages restantes leur imposerait des changements que personne n'a
 *  demandés. Ce module-ci ne fait qu'une chose, n'écoute aucun événement et
 *  n'ajoute aucun élément flottant : on peut le poser partout sans risque.
 *
 *  Le médaillon est PUREMENT DÉCORATIF (aria-hidden) : rien de ce qui compte
 *  pour le référencement ou la lecture d'écran n'en dépend.
 * ==========================================================================*/
(function () {
  'use strict';

  /* L'icône se déduit du titre de la carte. L'ordre compte : la première
     expression qui accroche gagne, donc le plus spécifique vient d'abord
     (« corrigé » avant « classe », « examen » avant « niveau »).
     LES ICÔNES DE LA VITRINE (Lucide, symboles `lc-*`) : Jacques demandait
     « les mêmes icônes dans le rond centré ». Elles vivent dans le sprite
     partagé, où tools/habiller_pages.py les recopie depuis vitrine.html. */
  var ICONES = [
    [/corrig|solution/i,                          'lc-checkcircle'],
    [/bepc|probatoire|\bbac\b|\bgce\b|examen/i,   'lc-award'],
    [/évaluation|evaluation|diagnostic|devoir|épreuve|epreuve|test\b/i, 'lc-target'],
    [/œuvre|oeuvre|roman|littérat|litterat/i,     'lc-bookopen'],
    [/méthode|methode|dissert|résumé|resume/i,    'lc-compass'],
    [/séquence|sequence|module|programme/i,       'lc-clipboard'],
    [/classe|niveau|6|5|4|3|2nde|1ʳᵉ|terminale/i, 'lc-graduation'],
    [/manuel|cahier|livret|livre/i,               'lc-book'],
    [/calcul|moyenne|outil/i,                     'lc-calculator'],
    [/jeu|quiz|défi|defi/i,                       'lc-game'],
    [/labo|expérience|experience|physique|svt/i,  'lc-flask'],
    [/enseignant|professeur|prof\b/i,             'lc-presentation'],
    [/parent|famille/i,                           'lc-users'],
    [/élève|eleve|apprenant/i,                    'lc-user'],
    [/abonnement|tarif|prix|payer|paiement/i,     'lc-wallet'],
    [/contact|message|question/i,                 'lc-message'],
    [/planning|calendrier|date/i,                 'lc-calendar'],
    [/vidéo|video|cours/i,                        'lc-monitor'],
    [/certificat|attestation|honneur/i,           'lc-award'],
    [/orientation|filière|filiere|série|serie/i,  'lc-map'],
    [/ambassa|\bia\b|tuteur/i,                    'lc-brain'],
    [/leçon|lecon|exercice|fiche|activité|activite/i, 'lc-doc'],
    [/mentions|cgv|conditions|confidentialité|charte|légal/i, 'lc-shield']
  ];

  /* Les médaillons déjà écrits par les générateurs portent les icônes de
     l'ancien jeu (`i-*`). On les remplace par leur équivalent de la vitrine ;
     une icône sans équivalent reste telle quelle plutôt que de devenir fausse. */
  var EQUIV = {
    'i-check': 'lc-checkcircle', 'i-clipboard-check': 'lc-clipboard', 'i-award': 'lc-award',
    'i-badge': 'lc-award', 'i-book-open': 'lc-bookopen', 'i-book': 'lc-book',
    'i-notebook': 'lc-clipboard', 'i-file-text': 'lc-doc', 'i-compass': 'lc-compass',
    'i-graduation': 'lc-graduation', 'i-calculator': 'lc-calculator', 'i-gamepad': 'lc-game',
    'i-flask': 'lc-flask', 'i-teacher': 'lc-presentation', 'i-users': 'lc-users',
    'i-backpack': 'lc-user', 'i-credit-card': 'lc-wallet', 'i-coins': 'lc-coins',
    'i-message': 'lc-message', 'i-calendar': 'lc-calendar', 'i-play': 'lc-monitor',
    'i-map': 'lc-map', 'i-bot': 'lc-brain', 'i-brain': 'lc-brain', 'i-target': 'lc-target',
    'i-search': 'lc-search', 'i-lock': 'lc-lock', 'i-key': 'lc-lock', 'i-download': 'lc-download',
    'i-globe': 'lc-globe', 'i-mail': 'lc-mail', 'i-star': 'lc-star', 'i-printer': 'lc-printer',
    'i-shield': 'lc-shield', 'i-clock': 'lc-clock', 'i-megaphone': 'lc-megaphone',
    'i-scale': 'lc-scale', 'i-home': 'lc-home', 'i-chart': 'lc-chart', 'i-sparkle': 'lc-sparkles',
    'i-phone': 'lc-smartphone', 'i-school': 'lc-building', 'i-arrow-right': 'lc-arrow-right'
  };

  /* Les six teintes de la vitrine, dans son ordre de rotation (voir
     .pl-c[data-f] dans plan.html) : deux cartes voisines n'ont jamais la
     même. Les couleurs elles-mêmes sont dans veritas-habillage.css. */
  var TEINTES = ['bleu', 'sarcelle', 'vert', 'violet', 'rose', 'brique'];
  var SPRITE = '/assets/veritas-icons.svg#';

  /* DEUX structures de bloc coexistent sur le site, une par famille de pages :
       · .card  + <h3>     — corrigés, Constellation, Espace Manuels
       · .tile  + <strong> — œuvres, ressources, niveaux, outils
     Les traiter ensemble est tout l'objet de l'harmonisation : sans ça, la
     moitié du site garde ses blocs nus et l'autre reçoit des médaillons. */
  /* Le fond du bloc est-il sombre ? On remonte les parents tant que le fond
     est transparent — une carte peut n'avoir aucun fond propre et hériter
     visuellement de celui de sa section. */
  function sombre(el) {
    var e = el, n = 0;
    while (e && n < 5) {
      var f = getComputedStyle(e).backgroundColor || '';
      var m = f.match(/[\d.]+/g);
      if (m && m.length >= 3 && (m.length < 4 || parseFloat(m[3]) > 0.5)) {
        var v = m.slice(0, 3).map(function (x) {
          x = x / 255;
          return x <= 0.03928 ? x / 12.92 : Math.pow((x + 0.055) / 1.055, 2.4);
        });
        return (0.2126 * v[0] + 0.7152 * v[1] + 0.0722 * v[2]) < 0.4;
      }
      e = e.parentElement; n++;
    }
    return false;
  }

  /* Le trait est porté par le <svg>, comme sur la vitrine : les symboles
     `lc-*` n'en ont aucun, à la différence des `i-*`. */
  function svgIcone(nom) {
    var ns = 'http://www.w3.org/2000/svg';
    var svg = document.createElementNS(ns, 'svg');
    svg.setAttribute('class', 'i');
    svg.setAttribute('viewBox', '0 0 24 24');
    svg.setAttribute('width', '20');
    svg.setAttribute('height', '20');
    svg.setAttribute('fill', 'none');
    svg.setAttribute('stroke', 'currentColor');
    svg.setAttribute('stroke-width', '2');
    svg.setAttribute('stroke-linecap', 'round');
    svg.setAttribute('stroke-linejoin', 'round');
    svg.setAttribute('focusable', 'false');
    var use = document.createElementNS(ns, 'use');
    use.setAttribute('href', SPRITE + nom);
    svg.appendChild(use);
    return svg;
  }

  function teinter(med, carte, rang) {
    if (sombre(carte)) { med.classList.add('sur-sombre'); return; }
    med.setAttribute('data-vm', TEINTES[rang % TEINTES.length]);
  }

  /* Quand le titre ne dit rien du genre de contenu (une tuile d'œuvre
     s'intitule « Les Bimanes »), c'est l'ADRESSE du lien qui le dit. */
  var ADRESSES = [
    [/\/oeuvres\//,    'lc-bookopen'],
    [/\/corriges\//,   'lc-checkcircle'],
    [/\/livrets\//,    'lc-book'],
    [/\/niveaux\//,    'lc-graduation'],
    [/\/outils\//,     'lc-calculator'],
    [/\/ressources\//, 'lc-doc'],
    [/\/evaluations\//, 'lc-target'],
    [/\/cours\//,      'lc-monitor'],
    [/\/decouvrir\//,  'lc-compass']
  ];
  function nomParAdresse(carte) {
    var a = carte.tagName === 'A' ? carte : carte.querySelector('a[href]');
    if (!a) return '';
    var h = a.pathname || a.getAttribute('href') || '';
    for (var k = 0; k < ADRESSES.length; k++) {
      if (ADRESSES[k][0].test(h)) return ADRESSES[k][1];
    }
    return '';
  }

  function nomPour(libelle) {
    for (var k = 0; k < ICONES.length; k++) {
      if (ICONES[k][0].test(libelle)) return ICONES[k][1];
    }
    return '';
  }

  function poser() {
    var cartes = document.querySelectorAll('.card, .tile');
    /* Deux temps. D'abord on décide de chaque carte ; ensuite on pose, dans
       l'ordre du document, pour que la rotation des teintes ne saute
       aucune carte. */
    var plan = [];
    for (var i = 0; i < cartes.length; i++) {
      var c = cartes[i];
      var deja = c.querySelector('.ico');
      if (deja) { plan.push({ c: c, deja: deja }); continue; }
      /* Le titre est un ENFANT DIRECT de la carte. Un querySelector libre
         attrapait le premier <strong> du texte : sur /niveaux/, le médaillon
         tombait au milieu de « La [rond] 3ème est une classe d'examen ». */
      var t = c.querySelector(':scope > h3, :scope > h2, :scope > h4, :scope > strong');
      if (!t) continue;
      var libelle = (t.textContent || '').trim();
      if (!libelle) continue;
      plan.push({ c: c, t: t, nom: nomPour(libelle) || nomParAdresse(c) });
    }

    /* Aucune évidence dans le titre : pas d'icône — un microscope au-dessus de
       « Méthodes & examens » dirait le faux. SAUF si les voisines de la même
       grille en portent une : une carte nue au milieu d'une rangée de
       médaillons décale tous les titres. Elle reçoit alors le pictogramme
       neutre du document. */
    for (var j = 0; j < plan.length; j++) {
      var e = plan[j];
      if (e.deja || e.nom) continue;
      var parent = e.c.parentElement, voisine = false;
      for (var k = 0; k < plan.length && !voisine; k++) {
        if (k !== j && plan[k].c.parentElement === parent && (plan[k].deja || plan[k].nom)) voisine = true;
      }
      if (voisine) e.nom = 'lc-doc';
    }

    var rang = 0;
    for (var m = 0; m < plan.length; m++) {
      var x = plan[m];
      if (x.deja) {
        /* Médaillon écrit par le générateur : même rond, même rotation,
           icône de la vitrine quand il en existe une. */
        var u = x.deja.querySelector('use');
        var ref = u ? (u.getAttribute('href') || u.getAttribute('xlink:href') || '') : '';
        var nomI = ref.split('#')[1] || '';
        if (EQUIV[nomI]) {
          var ancien = x.deja.querySelector('svg');
          if (ancien) x.deja.replaceChild(svgIcone(EQUIV[nomI]), ancien);
        }
        x.deja.setAttribute('aria-hidden', 'true');
        teinter(x.deja, x.c, rang++);
        continue;
      }
      if (!x.nom) continue;
      /* Sur un bloc à FOND SOMBRE, la teinte pâle de la vitrine disparaît :
         ces blocs existent (les tuiles d'appel « Outils gratuits »,
         « La Constellation VÉRITAS »). On y pose un médaillon neutre, que le
         CSS laisse en blanc translucide. */
      var med = document.createElement('span');
      med.className = 'ico';
      med.setAttribute('aria-hidden', 'true');
      med.appendChild(svgIcone(x.nom));
      teinter(med, x.c, rang++);
      x.c.insertBefore(med, x.t);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', poser);
  } else { poser(); }
})();
