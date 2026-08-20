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
     (« corrigé » avant « classe », « examen » avant « niveau »). */
  var ICONES = [
    [/corrig|solution/i,                          'i-check'],
    [/bepc|probatoire|\bbac\b|\bgce\b|examen/i,   'i-award'],
    [/œuvre|oeuvre|roman|littérat|litterat/i,     'i-book-open'],
    [/méthode|methode|dissert|résumé|resume/i,    'i-compass'],
    [/séquence|sequence|module|programme/i,       'i-notebook'],
    [/classe|niveau|6|5|4|3|2nde|1ʳᵉ|terminale/i, 'i-graduation'],
    [/manuel|cahier|livret|livre/i,               'i-book'],
    [/calcul|moyenne|outil/i,                     'i-calculator'],
    [/jeu|quiz|défi|defi/i,                       'i-gamepad'],
    [/labo|expérience|experience|physique|svt/i,  'i-flask'],
    [/enseignant|professeur|prof\b/i,             'i-teacher'],
    [/parent|famille/i,                           'i-users'],
    [/élève|eleve|apprenant/i,                    'i-backpack'],
    [/abonnement|tarif|prix|payer|paiement/i,     'i-credit-card'],
    [/contact|message|question/i,                 'i-message'],
    [/planning|calendrier|date/i,                 'i-calendar'],
    [/vidéo|video|cours/i,                        'i-play'],
    [/certificat|attestation|honneur/i,           'i-badge'],
    [/orientation|filière|filiere|série|serie/i,  'i-map'],
    [/ambassa|\bia\b|tuteur/i,                    'i-bot']
  ];

  /* Quatre teintes en rotation, les mêmes que les puces des listes : une
     grille de cartes se lit alors comme une liste, avec le même rythme. */
  var TEINTES = ['', 'vert', 'or', 'violet'];

  /* DEUX structures de bloc coexistent sur le site, une par famille de pages :
       · .card  + <h3>     — corrigés, Constellation, Espace Manuels (85 pages)
       · .tile  + <strong> — œuvres, ressources, niveaux, outils  (55 pages)
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

  function poser() {
    var cartes = document.querySelectorAll('.card, .tile');
    var rang = 0;
    for (var i = 0; i < cartes.length; i++) {
      var c = cartes[i];
      if (c.querySelector('.ico')) { rang++; continue; }   // déjà pourvue
      var t = c.querySelector('h3, h2, h4, strong');
      if (!t) continue;
      var libelle = (t.textContent || '').trim();
      if (!libelle) continue;

      var nom = '';
      for (var k = 0; k < ICONES.length; k++) {
        if (ICONES[k][0].test(libelle)) { nom = ICONES[k][1]; break; }
      }
      /* Aucune évidence : la carte reste sans médaillon. Mieux vaut pas
         d'icône qu'une icône à contresens — un microscope au-dessus de
         « Méthodes & examens » dirait le faux. */
      if (!nom) continue;

      /* Sur un bloc à FOND SOMBRE, la teinte de charte devient illisible :
         un titre vert #007E11 sur du bleu nuit ne se lit plus, et l'anneau
         disparaît. Ces blocs existent (les tuiles d'appel « Outils gratuits »,
         « La Constellation VÉRITAS »). On y pose donc un médaillon neutre, que
         le CSS laisse en blanc — et le titre garde sa couleur d'origine. */
      var med = document.createElement('span');
      med.className = 'ico' + (sombre(c) ? ' sur-sombre' : (TEINTES[rang % 4] ? ' ' + TEINTES[rang % 4] : ''));
      med.setAttribute('aria-hidden', 'true');
      var svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
      svg.setAttribute('class', 'i');
      svg.setAttribute('focusable', 'false');
      var use = document.createElementNS('http://www.w3.org/2000/svg', 'use');
      use.setAttribute('href', '/assets/veritas-icons.svg#' + nom);
      svg.appendChild(use);
      med.appendChild(svg);
      c.insertBefore(med, t);
      rang++;
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', poser);
  } else { poser(); }
})();
