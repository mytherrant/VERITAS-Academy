/* ════════════════════════════════════════════════════════════════════════════
   livrets/cahier.js — LE CAHIER OÙ L'ÉLÈVE ÉCRIT
   © 2024-2026 Jacques Miterand TAKOU (Mythe Errant). Tous droits réservés.

   Un seul moteur pour TOUS les cahiers. Il reçoit les blocs d'un document et
   en fait une page où l'on répond, où le travail se garde, et où le professeur
   peut annoter exercice par exercice.

   ── LA CLÉ D'UN EXERCICE, ET POURQUOI ELLE COMPTE ─────────────────────────
   Chaque champ porte une clé « <ouvrage>/s<séquence>/l<leçon>/<empreinte de la
   consigne>/r<run> » : OÙ l'on est dans le cahier, et CE QUE dit l'exercice.

   Le moteur d'origine numérotait les champs dans l'ordre où il les dessinait
   (« a1 », « a2 », « a3 »…). Tant que le document ne bouge pas, cela marche.
   Ajoutez un exercice au milieu de la séquence 2, et tout ce qui suit se
   décale d'un cran : l'élève rouvre son cahier et retrouve ses réponses sous
   les mauvaises questions, l'annotation du professeur désigne un autre
   exercice que celui qu'il a lu, et personne ne comprend pourquoi. Un cahier
   scolaire se corrige entre deux rentrées : la clé doit survivre à ça.

   Mesuré sur un vrai cahier de 2ⁿᵈᵉ (55 champs), en ajoutant UN exercice :
     compteur d'affichage → 55 réponses sur 55 changent d'exercice ;
     indice de bloc       → 38 changent, 17 disparaissent ;
     clé ci-dessus        → 55 intactes.
   Voir tests/banc_cles_cahier.cjs, qui refait ce calcul à chaque déploiement.

   ── CE QUI SE PASSE QUAND LA CONNEXION TOMBE ──────────────────────────────
   L'élève travaille depuis un téléphone, au Cameroun. La ligne coupe. Donc :
   on écrit D'ABORD sur l'appareil, à chaque frappe (différé de 400 ms), et on
   envoie au serveur ensuite, par paquets, en ne poussant QUE ce qui a changé.
   Une réponse n'est jamais perdue parce qu'une requête a échoué — elle attend
   dans la file et repart au prochain envoi.

   ── CE QU'IL N'EST PAS ────────────────────────────────────────────────────
   Il ne décide pas des droits. Le contenu arrive d'api/livret.php après code
   valide ; les réponses vont à api/cahier.php, qui tranche qui écrit quoi.
   ════════════════════════════════════════════════════════════════════════ */
(function (global) {
  'use strict';

  var API = '/api/cahier.php';
  var DIFFERE_LOCAL   = 400;    // ms avant d'écrire sur l'appareil
  var DIFFERE_SERVEUR = 2500;   // ms avant de pousser au serveur
  var MAX_REPONSE     = 6000;   // doit rester égal au plafond serveur

  function esc(s) {
    return String(s == null ? '' : s)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  /* ── LA CLÉ D'UN EXERCICE ────────────────────────────────────────────────
     Elle est faite de DEUX choses : où l'on est dans le cahier (séquence,
     leçon) et ce que l'exercice DIT.

     Trois façons de nommer un champ, de la pire à la bonne :
       1. un compteur d'affichage (« a1, a2, a3… ») — ce que faisait le moteur
          d'origine. Insérez un exercice en séquence 2 : tout se décale.
       2. l'indice du bloc dans le tableau (« b14 ») — indépendant de l'ordre
          d'AFFICHAGE, mais toujours positionnel : une insertion décale encore
          tout ce qui suit. C'était ma première version, et elle ne valait pas
          beaucoup mieux.
       3. séquence + leçon + EMPREINTE DE LA CONSIGNE. Ajouter, retirer ou
          déplacer un exercice ne touche à rien d'autre : chaque réponse reste
          attachée à SA question. C'est ce qui est fait ici, et c'est ce que
          demandait le cahier des charges (« identifiant stable
          niveau/séquence/leçon/bloc/run »).

     Corollaire assumé : réécrire la consigne d'un exercice détache la réponse
     qui y était. C'est le bon comportement — la question n'est plus la même,
     et laisser l'ancienne réponse sous une nouvelle question tromperait
     l'élève comme le professeur.

     L'empreinte est un FNV-1a 32 bits en base 36 : cinq à sept caractères,
     assez pour ne pas se cogner à l'intérieur d'une leçon, et calculable en
     JavaScript sans dépendance ni appel asynchrone (`crypto.subtle` est une
     promesse, inutilisable au milieu d'un rendu synchrone). */
  function empreinte(texte) {
    var t = String(texte || '')
      .replace(/\s+/g, ' ')          // la mise en page ne fait pas la question
      .trim().toLowerCase().slice(0, 400);
    var h = 0x811c9dc5;
    for (var i = 0; i < t.length; i++) {
      h ^= t.charCodeAt(i);
      h = (h + ((h << 1) + (h << 4) + (h << 7) + (h << 8) + (h << 24))) >>> 0;
    }
    return h.toString(36);
  }

  /** Le texte que porte un bloc, runs compris — c'est lui qui identifie. */
  function texteDuBloc(b) {
    if (!b) return '';
    if (b.txt) return String(b.txt);
    var s = '';
    (b.r || []).forEach(function (r) { if (r && r.t) s += r.t + ' '; });
    if (s) return s;
    /* UNE GRILLE N'A PAS DE TEXTE, ET C'EST UN PIÈGE.
       Un bloc sans texte hérite de l'empreinte de son voisin (voir
       `calculerCles`) : il tombe donc dans la même portée que l'exercice qui
       le précède et fait avancer son compteur de doublons d'un cran. Poser une
       grille entre deux exercices dont les consignes sont identiques —
       « Complète la grille », deux fois dans la même leçon — décalait donc les
       clés des suivants, et quatorze réponses déjà écrites se détachaient de
       leur exercice. Mesuré sur les quinze cahiers avant/après.
       Une grille a de quoi s'identifier : ses mots à trouver, ses définitions.
       On les lui donne, elle prend sa propre empreinte, et elle ne dérange
       plus personne. */
    /* Une carte mentale et un document n'ont pas de `txt` non plus : ils
       portent une LÉGENDE. Sans elle, ils héritaient de l'empreinte du bloc
       précédent — même piège que les grilles, mêmes réponses détachées. */
    if (b.cap) return 'cap ' + String(b.cap);
    if (b.mots && b.mots.length) return 'mm ' + b.mots.join(' ');
    if (b.horiz || b.verti) {
      var d = [];
      (b.horiz || []).concat(b.verti || []).forEach(function (x) {
        if (x && x.d) d.push(x.d);
      });
      if (d.length) return 'mc ' + d.join(' ');
    }
    return String(b.title || b.titre || '');
  }

  /* ── Rendu d'une suite de « runs » ────────────────────────────────────────
     Un run est un morceau de texte avec son habillage : gras, italique, notion
     mise en évidence, nom de personnage, didascalie, entrée de lexique. Un run
     `{tail:1}` ou `{rule:1}` n'est PAS du texte : c'est une ligne à compléter,
     donc un champ de saisie. C'est là que le cahier devient un cahier. */
  function rendreRuns(runs, cleBloc, champs) {
    var h = '';
    (runs || []).forEach(function (r, i) {
      if (!r || typeof r !== 'object') return;
      if (r.tail || r.fill || r.rule) {
        var cle = cleBloc + '/r' + i;
        champs.push(cle);
        h += '<span class="ch-champ" data-cle="' + esc(cle) + '"></span>';
        return;
      }
      if (r.br) { h += '<br>'; return; }
      var t = esc(r.t || '');
      if (!t) return;
      if (r.b)  t = '<strong>' + t + '</strong>';
      if (r.i)  t = '<em>' + t + '</em>';
      if (r.kw) t = '<span class="ch-kw">' + t + '</span>';
      if (r.pc) t = '<span class="ch-pc">' + t + '</span>';
      if (r.dd) t = '<span class="ch-dd">' + t + '</span>';
      if (r.lx) t = '<span class="ch-lx">' + t + '</span>';
      h += t;
    });
    return h;
  }

  /* ══════════════════════════════════════════════════════════════════════════
     LA MANIPULATION DES MOTS
     ════════════════════════

     « Les corpus mettent en évidence, PAR LA COULEUR, les notions étudiées,
     afin de rendre visible ce que l'on apprend. » — avant-propos du livret
     imprimé, et c'est le geste pédagogique central du cahier : on ne demande
     pas seulement « repère les connecteurs », on les fait VOIR dans le texte.
     À l'écran, le corpus arrivait en un seul gris : la leçon disait de repérer
     quelque chose qui n'était nulle part visible.

     CE QU'ON COLORE, ET D'APRÈS QUOI
     Le titre de la leçon en cours. « Les connecteurs logiques » arme la règle
     des connecteurs ; « La phrase négative » celle de la négation. C'est la
     table `REGLES_NOTION`, reprise de `notionRules()` de la maquette. S'y
     ajoutent partout les verbes de parole, les mots entre guillemets et les
     noms propres — ce que la maquette passe en `{dialogue, proper, quoted}`.

     DEUX PRÉCAUTIONS
     ① On travaille sur le texte DÉJÀ échappé. Les motifs ne contiennent ni
        `&` ni `<` ni `>` ni guillemet droit : ils ne peuvent donc pas tomber
        au milieu d'une entité, et on n'a jamais de texte brut en main.
     ② Pas de `lookbehind` (`(?<=…)`) alors que la maquette en utilise un. Un
        moteur qui ne le connaît pas — Safari d'avant 16.4, encore courant sur
        les iPhone d'occasion — lève une erreur de SYNTAXE au chargement du
        fichier, pas à l'exécution : tout le cahier serait mort d'un coup, chez
        ces gens-là seulement. On capture donc le contexte dans un groupe et on
        décale l'index à la main.
     ══════════════════════════════════════════════════════════════════════ */

  /* Quelle notion colorer, pour quel titre de leçon. Le motif est une CHAÎNE :
     il est compilé une fois par bloc, avec `gi`. */
  var REGLES_NOTION = [
    [/connecteur|coordination|liaison|articulation/i,
     "mais|ou\\b|et\\b|donc|or\\b|ni\\b|car\\b|puis|ensuite|enfin|cependant|toutefois|pourtant|ainsi|d'abord", 'n'],
    [/n[ée]gation|phrase n[ée]gative/i,
     "ne\\b|n'|point\\b|pas\\b|plus\\b|jamais|rien\\b|personne|aucun[e]?|nulle?|gu[eè]re", 'n'],
    [/communication/i,
     "[eé]metteur|r[eé]cepteur|message|canal|code\\b|r[eé]f[eé]rent|feed-?back", 'v'],
    [/comparatif|superlatif|comparaison/i,
     "le plus|le moins|la plus|la moins|plus\\b|moins\\b|aussi\\b|meilleur[e]?|pire\\b|autant", 'v'],
    [/spatio|indices|temporel/i,
     "hier|aujourd'hui|demain|ici\\b|l[aà]-bas|ensuite|puis\\b|alors|maintenant|autrefois|bient[oô]t", 'v'],
    [/discours (direct|indirect)|dialogue|paroles? rapport/i,
     "dit\\b|r[eé]pondit|s'[eé]cria|demanda|murmura|ajouta|affirma|s'exclama", 'v'],
    [/lettre|formules? finale|correspondance/i,
     "Monsieur|Madame|Excellence", 'u'],
    [/lettre|formules? finale|correspondance/i,
     "veuillez agr[eé]er|prie d'agr[eé]er|l'expression de mes|salutations distingu[eé]es|Objet", 'k'],
    [/types? de phrases?|ponctuation/i,
     "interrogative|d[eé]clarative|imp[eé]rative|exclamative|injonctive", 'n'],
    [/registre|niveaux? de langue/i,
     "familier|courant|soutenu|litt[eé]raire", 'n']
  ];

  var VERBES_PAROLE = "dit|r[eé]pondit|s'[eé]cria|demanda|murmura|ajouta|cria|reprit|songea|pensa"
    + "|s'exclama|affirma|d[eé]clara|r[eé]pliqua|soupira|lan[çc]a|interrogea|poursuivit|gronda|questionna";

  /* Les mots qui commencent une phrase sans être des noms propres. Sans cette
     liste, « Il » et « Le » en tête de phrase partiraient en violet, et le
     texte entier virerait au sapin de Noël. */
  var PAS_UN_NOM = ('il ils elle elles je tu nous vous on le la les un une des du de ce cet cette ces '
    + 'mon ma mes ton ta tes son sa ses notre nos votre vos leur leurs et ou mais donc or ni car dans '
    + 'sur sous avec sans pour par chez vers avant apres après pendant depuis quand tout toute tous '
    + 'toutes rien personne aucun quel quelle quels quelles qui que quoi dont où alors ainsi puis '
    + 'ensuite enfin cependant toutefois pourtant aussi très tres plus moins autant comme si oui non '
    + 'chaque plusieurs certains certaines cet').split(' ');

  function marquer(texteEchappe, titreLecon, options) {
    var t = String(texteEchappe || '');
    if (!t) return t;
    var opts = options || {};
    var titre = String(titreLecon || '');
    var zones = [];

    function ramasser(re, genre, groupe) {
      var m, garde = 0;
      re.lastIndex = 0;
      while ((m = re.exec(t)) && ++garde < 4000) {
        if (!m[0].length) { re.lastIndex++; continue; }
        var mot = groupe ? m[groupe] : m[0];
        if (!mot) continue;
        var debut = m.index + (groupe ? m[0].indexOf(mot) : 0);
        if (genre === 'p' && PAS_UN_NOM.indexOf(mot.split(/\s/)[0].toLowerCase()) >= 0) continue;
        zones.push({ d: debut, f: debut + mot.length, g: genre });
      }
    }

    for (var i = 0; i < REGLES_NOTION.length; i++) {
      if (REGLES_NOTION[i][0].test(titre)) {
        ramasser(new RegExp(REGLES_NOTION[i][1], 'gi'), REGLES_NOTION[i][2]);
      }
    }
    if (opts.dialogue) ramasser(new RegExp('\\b(?:' + VERBES_PAROLE + ')\\b', 'gi'), 'v');
    if (opts.cite)     ramasser(/«[^»]{1,160}»/g, 'q');
    /* Au lycée, ce sont les OUTILS qui comptent — ils passent avant les noms
       propres, sinon « Métaphore » en tête de phrase partirait en violet de
       nom propre au lieu du vert des outils. */
    if (opts.outils) {
      ramasser(new RegExp('\\b(?:' + OUTILS_LITT + ')\\b', 'gi'), 't');
      ramasser(new RegExp('(?:' + ETAPES_LITT + ')', 'gi'), 'e');
      ramasser(/[①-⑳]/g, 'c');
    }
    if (opts.propre)   ramasser(/([a-zà-ÿ0-9,'’]\s)([A-ZÀ-Ý][a-zà-ÿ'’-]{2,}(?:\s[A-ZÀ-Ý][a-zà-ÿ'’-]{2,}){0,2})/g, 'p', 2);

    if (!zones.length) return t;

    /* Premier arrivé, premier servi : deux marquages qui se chevauchent
       produiraient des balises croisées, et le navigateur recollerait les
       morceaux à sa façon. On garde le plus long à égalité de départ. */
    zones.sort(function (a, b) { return a.d - b.d || b.f - a.f; });
    var out = '', fin = 0, rang = 0;
    for (var z = 0; z < zones.length; z++) {
      if (zones[z].d < fin) continue;
      /* Les intitulés de démarche prennent les quatre couleurs à tour de rôle,
         comme dans le livre : c'est ce qui fait qu'un plan de commentaire —
         « Axe 1 », « Axe 2 », « Problématique » — se distingue d'un coup
         d'œil au lieu de former un bloc d'une seule teinte. */
      var g = zones[z].g === 'e' ? 'e' + (rang++ % 4) : zones[z].g;
      out += t.slice(fin, zones[z].d)
          +  '<span class="ch-m' + g + '">' + t.slice(zones[z].d, zones[z].f) + '</span>';
      fin = zones[z].f;
    }
    return out + t.slice(fin);
  }

  /* Blocs qui appellent une réponse écrite, même sans run `{tail}`.
     Une question sans ligne pointillée reste une question : l'élève doit
     pouvoir y répondre. Sans cette liste, les documents où les pointillés
     n'ont pas été balisés seraient muets — on afficherait un cahier qu'on ne
     peut pas remplir, ce qui est exactement le reproche fait à la version
     imprimée mise en ligne telle quelle. */
  var BLOCS_A_REPONSE = { question: 1, exercice: 1, taskBody: 1, consigne: 1, hwBody: 1 };

  /* Blocs de CORRIGÉ. Ils ne sont rendus que si le document les fournit —
     c'est le serveur qui décide de les envoyer ou non, selon la règle de
     déverrouillage. Le client ne les cache pas : ce qui est caché côté client
     se lit en trois clics dans les outils de développement.

     `retientC` et `retC` figuraient ici : c'était une erreur de lecture des
     sources. Ces deux-là portent le CONTENU de l'encadré « Je retiens » —
     209 blocs dans le seul Bord de 1ʳᵉ, 133 dans le cahier de 1ʳᵉ A. Les
     traiter en corrigés repliait la leçon derrière « Voir la correction » :
     l'élève achetait un cahier dont la règle à retenir était escamotée. */
  var BLOCS_CORRIGE = { corrige: 1, reponse: 1 };

  var ETIQUETTES = {
    module: 'Module', sequence: 'Séquence', semaine: 'Semaine', lecon: 'Leçon',
    section: 'Section', competence: 'Compétence', objectif: 'Objectif',
    epreuve: 'Épreuve', part: 'Partie'
  };

  /* Divisions de tête. Elles remettent le compteur de leçon à zéro et font
     tourner la couleur. Les sources ne s'accordent pas sur le mot : les Bords
     disent `module`, les cahiers du 2ⁿᵈ cycle `seq` et `part`, le 1er cycle
     `sequence`. Toutes désignent la même chose, et en oublier une revient à
     ranger tout un cahier sous une seule séquence. */
  var DIVISIONS = { module: 1, sequence: 1, seq: 1, part: 1, semaine: 1, sem: 1, section: 1 };
  var SOUS_DIVISIONS = { lecon: 1, epreuve: 1, disc: 1 };

  /* ══════════════════════════════════════════════════════════════════════════
     LES REPÈRES DU CAHIER IMPRIMÉ, PORTÉS À L'ÉCRAN
     ═══════════════════════════════════════════════

     L'acheteur a le cahier de papier ouvert à côté du téléphone. Jusqu'ici la
     page en ligne était une colonne blanche et bleu marine : mêmes mots, aucun
     des repères par lesquels on se retrouve dans le livre. Il fallait relire
     pour savoir où l'on était.

     On reprend donc des maquettes `Livret <classe>.dc.html` TOUT CE QUI SITUE,
     à la couleur près — c'est ce qui fait qu'on reconnaît la même page :
       · les six teintes de module (rose, sarcelle, vert, orange, violet, brique),
       · la pastille de rubrique, sa couleur de famille et son icône,
       · le badge de discipline sous le titre de leçon,
       · le NUMÉRO de l'exercice dans son rond — c'est par lui que le
         professeur dit « faites le 4 », et il manquait complètement,
       · le papier réglé des espaces d'écriture.

     Et on ne reprend RIEN de ce qui appartient au papier : le corps 13 px,
     l'interligne 1,16 et les deux colonnes de la maquette A4 sont illisibles
     sur un écran de téléphone. Même livre, autre support.

     ── POURQUOI ON DEVINE LA FAMILLE AU LIEU DE LA LIRE ──────────────────────
     La maquette imprimée reçoit `cat:'observe'` dans ses données. Le
     convertisseur (`tools/normaliser_cahiers.py`) ne garde pas ce champ : il
     aplatit la rubrique en un simple libellé de texte. On pourrait le lui
     faire garder — mais les quinze cahiers sont DÉJÀ déposés sur le serveur,
     et chacun est un fichier de plusieurs centaines de kilo-octets à
     re-téléverser par FTP. Deviner la famille depuis le libellé donne le même
     résultat sur les cahiers déjà vendus, sans rien redéployer. Le jour où le
     convertisseur transmettra `cat`, le champ explicite l'emportera : c'est
     `familleDe()` qui décide, et elle regarde `b.cat` d'abord.
     ══════════════════════════════════════════════════════════════════════ */

  /* Les têtes de division qui font TOURNER la couleur. `DIVISIONS` ci-dessus
     ne peut pas servir : elle contient `semaine`, et la couleur changeait donc
     à chaque semaine — vingt-quatre fois dans le cahier de 6ᵉ, alors que le
     livre imprimé en compte six, une par module. On ne touche pas à
     `DIVISIONS` pour autant : elle sert aussi à calculer la CLÉ des exercices,
     et la modifier détacherait toutes les réponses déjà écrites. */
  var TETES = { module: 1, sequence: 1, seq: 1, part: 1, section: 1 };
  var SEMAINES = { semaine: 1, sem: 1 };
  var RUBRIQUES = { rubrique: 1, rubriqueH: 1, rubriqueB: 1 };

  /* Les neuf familles d'exercice du livre, chacune sa couleur et son icône.
     L'ordre est celui de la priorité : « Méthode d'expression écrite » est un
     travail d'écriture avant d'être une méthode.

     Le collège intitule ses rubriques à la première personne (« Je repère »),
     le lycée nomme la nature de l'exercice en tête d'énoncé (« Repérage — »).
     Les deux formes sont dans la même table : c'est la même famille, donc la
     même couleur, et un élève qui passe de la 3ᵉ à la 2ⁿᵈᵉ ne réapprend pas
     un code. */
  var FAMILLES = [
    ['qcm',       /\bqcm\b|choix multiple/i],
    ['intrus',    /intrus/i],
    ['link',      /je relie|je classe|j'associe|je range|appari|classement|association/i],
    ['game',      /\bjeux?\b|mots crois|mots m[êe]l|charade|devinette|rébus/i],
    ['oral',      /oral|expos[ée]\b/i],
    ['write',     /production|expression écrite|je produis|je rédige|j'écris|rédaction|ta production|j'imagine|je raconte|argumentation/i],
    ['transform', /je transforme|je manipule|je conjugue|je ponctue|je corrige|je complète|je remets|j'insère|j'enrichis|je mets au|réécriture|registre courant|du familier|dictée|transformation|remise en ordre|complétion|correction|substitution|manipulation/i],
    ['observe',   /je repère|j'observe|je découvre|je comprends|je distingue|je relève|j'analyse|je lis\b|lecture méthodique|fiche synthèse|compréhension du texte|repérage|analyse|interprétation|observation|identification|relevé/i],
    ['mobilise',  /je mobilise|bilan|vers le b|vers le p|épreuve|barème|évaluation|autoéval|maniement de la langue|synthèse|méthode/i],
    ['exerce',    /je m'exerce|exercices?\b|je m'entra[îi]ne|consolidation/i]
  ];

  /* Le domaine de la leçon, tel qu'il est imprimé sous son titre. Ancré au
     début : « Production écrite » juste après un titre de leçon EST la
     discipline, la même chaîne dix blocs plus loin est un intertitre
     d'exercices. C'est la position qui tranche, pas le mot. */
  var DISCIPLINES = [
    ['gram', /^(grammaire|langue\b|langue française|fait de langue)/i],
    ['conj', /^conjugaison/i],
    ['orth', /^orthographe/i],
    ['voca', /^(vocabulaire|lexique)/i],
    ['oral', /^(expression orale|oral\b|communication orale)/i],
    ['ecri', /^(expression écrite|production écrite|écriture|rédaction)/i],
    ['lect', /^(lecture|littérature|[œo]euvre|fiche synthèse|texte \d)/i],
    ['meth', /^(méthode|méthodologie|fiche.?méthode)/i]
  ];

  /* « Je retiens », « L'essentiel à retenir » : la règle de la leçon. Dans le
     livre c'est un encadré bleu à onglet, jamais une suite de paragraphes. */
  var RETIENS_RE = /^(je retiens|l'essentiel|à retenir|retenons|la règle)/i;

  function familleDe(b, libelle) {
    if (b && b.cat) return String(b.cat);          // le jour où la source le dira
    var t = String(libelle || '');
    for (var i = 0; i < FAMILLES.length; i++) if (FAMILLES[i][1].test(t)) return FAMILLES[i][0];
    return '';
  }

  function disciplineDe(libelle) {
    var t = String(libelle || '').trim();
    if (t.length > 34) return '';                  // un titre, pas un domaine
    for (var i = 0; i < DISCIPLINES.length; i++) if (DISCIPLINES[i][1].test(t)) return DISCIPLINES[i][0];
    return '';
  }

  /* Les icônes du livre, au trait près : ce sont les mêmes fichiers SVG que la
     maquette d'impression dessine en tête de chaque rubrique. Écrites à la
     main plutôt que chargées : une police d'icônes, c'est 40 Ko de plus sur
     une ligne à 2 G, pour douze dessins. */
  var ICONES = {
    search: '<circle cx="7" cy="7" r="4.3"/><line x1="10.3" y1="10.3" x2="14.5" y2="14.5"/>',
    swap:   '<path d="M3.4 6.2A5 5 0 0 1 12.6 6"/><polyline points="3 3.4 3 6.4 6 6.4"/>'
          + '<path d="M12.6 9.8A5 5 0 0 1 3.4 10"/><polyline points="13 12.6 13 9.6 10 9.6"/>',
    check:  '<circle cx="8" cy="8" r="6"/><polyline points="5 8.2 7.2 10.4 11 5.8"/>',
    link:   '<path d="M6.6 9.4a2.4 2.4 0 0 1 0-3.4l1.6-1.6a2.4 2.4 0 0 1 3.4 3.4l-.9.9"/>'
          + '<path d="M9.4 6.6a2.4 2.4 0 0 1 0 3.4l-1.6 1.6a2.4 2.4 0 0 1-3.4-3.4l.9-.9"/>',
    cross:  '<circle cx="8" cy="8" r="6"/><line x1="5.5" y1="5.5" x2="10.5" y2="10.5"/>'
          + '<line x1="10.5" y1="5.5" x2="5.5" y2="10.5"/>',
    chat:   '<path d="M2.5 4.2h11a1 1 0 0 1 1 1v5a1 1 0 0 1-1 1H7l-3 2.6V11.2H2.5a1 1 0 0 1-1-1v-5a1 1 0 0 1 1-1z"/>',
    pencil: '<path d="M11 2.4l2.6 2.6-7.7 7.7-3.1.5.5-3.1z"/><line x1="9.6" y1="3.8" x2="12.2" y2="6.4"/>',
    dice:   '<rect x="2.4" y="2.4" width="11.2" height="11.2" rx="2.6"/>'
          + '<circle cx="6" cy="6" r="1" fill="currentColor" stroke="none"/>'
          + '<circle cx="10" cy="10" r="1" fill="currentColor" stroke="none"/>'
          + '<circle cx="6" cy="10" r="1" fill="currentColor" stroke="none"/>'
          + '<circle cx="10" cy="6" r="1" fill="currentColor" stroke="none"/>',
    list:   '<line x1="5.5" y1="4" x2="14" y2="4"/><line x1="5.5" y1="8" x2="14" y2="8"/>'
          + '<line x1="5.5" y1="12" x2="14" y2="12"/>'
          + '<circle cx="2.6" cy="4" r="1" fill="currentColor" stroke="none"/>'
          + '<circle cx="2.6" cy="8" r="1" fill="currentColor" stroke="none"/>'
          + '<circle cx="2.6" cy="12" r="1" fill="currentColor" stroke="none"/>',
    target: '<circle cx="8" cy="8" r="5.6"/><circle cx="8" cy="8" r="2.4"/>',
    bulb:   '<path d="M8 2.2a3.9 3.9 0 0 0-2.4 7c.4.3.6.7.6 1.2v.5h3.6v-.5c0-.5.2-.9.6-1.2A3.9 3.9 0 0 0 8 2.2z"/>'
          + '<line x1="6.5" y1="13.4" x2="9.5" y2="13.4"/>',
    star:   '<path d="M8 2.4l1.6 3.3 3.6.5-2.6 2.5.6 3.6L8 11.1 4.8 12.8l.6-3.6L2.8 6.7l3.6-.5z"/>',
    book:   '<path d="M2.5 3.5h4a2 2 0 0 1 1.5.7A2 2 0 0 1 9.5 3.5h4v9h-4a2 2 0 0 0-1.5.7A2 2 0 0 0 6.5 12.5h-4z"/>'
          + '<line x1="8" y1="4.2" x2="8" y2="13"/>',
    wrench: '<path d="M13 3.2a3.4 3.4 0 0 1-4.4 4.4L3.6 12.6a1.3 1.3 0 0 1-1.8-1.8l5-5A3.4 3.4 0 0 1 11.2 1.4z"/>'
  };
  var ICONE_DE = {
    observe: 'search', transform: 'swap', qcm: 'check', link: 'link', intrus: 'cross',
    oral: 'chat', write: 'pencil', game: 'dice', mobilise: 'list', exerce: 'check'
  };

  /* ── LA BOÎTE QU'UNE IMAGE DOIT RÉSERVER ─────────────────────────────────
     Les cartes mentales sont des SVG à `viewBox` mais SANS `width` ni
     `height` : dans une balise `<img>`, un tel fichier n'a aucune taille
     intrinsèque, et `height:auto` le réduit à zéro pixel de haut. Avec un
     chargement différé, cela se referme sur soi — une image de zéro pixel
     n'entre jamais dans l'écran, donc ne se charge jamais, donc reste à zéro.
     Mesuré sur téléphone : la carte mentale n'apparaissait pas du tout, sans
     une erreur nulle part.
     On transmet donc les proportions relevées à la publication. Le navigateur
     réserve la bonne hauteur avant d'avoir lu le fichier — et la page ne
     sursaute plus au chargement, ce qui compte autant sur une ligne lente. */
  function mesures(b) {
    var l = parseInt(b.w, 10), h = parseInt(b.h, 10);
    return (l > 0 && h > 0) ? ' width="' + l + '" height="' + h + '"' : '';
  }

  function icone(nom) {
    var p = ICONES[nom];
    if (!p) return '';
    return '<svg class="ch-ico" viewBox="0 0 16 16" width="14" height="14" fill="none" '
         + 'stroke="currentColor" stroke-width="1.8" stroke-linecap="round" '
         + 'stroke-linejoin="round" aria-hidden="true" focusable="false">' + p + '</svg>';
  }

  /* ══════════════════════════════════════════════════════════════════════════
     TROIS COLLECTIONS, TROIS MAQUETTES — ET C'EST VOULU
     ═════════════════════════════════════════════════

     Les quinze ouvrages ne sont pas une série : ce sont trois collections, et
     chacune a été maquettée pour son public. Les habiller pareil à l'écran
     aurait effacé le travail d'édition, et donné à l'élève de Terminale la
     couverture de son petit frère de 6ᵉ.

       COLLÈGE (6ᵉ→3ᵉ, `Livret <classe>.dc.html`)
         Baloo 2 arrondi, Lora pour les textes, six teintes de module
         (rose, sarcelle, vert, orange, violet, brique), pastilles à icônes.
         Un cahier d'enfant : rond, coloré, balisé.

       LYCÉE (2ⁿᵈᵉ, 1ʳᵉ, Tˡᵉ, Tˡᵉ S&T, `Livret Activités <classe>.dc.html`)
         Nunito et Source Serif 4, HUIT teintes indexées sur le numéro de
         séquence — la 0 (évaluation diagnostique) et la 7 (sujets d'examen)
         ont la leur. Les outils d'analyse littéraire (métaphore, anaphore,
         champ lexical, passé simple…) ressortent en vert profond dans les
         énoncés : c'est le vocabulaire que l'épreuve exige.
         Un cahier de lycéen : sobre, dense, technique.

       BORD (bord-6ᵉ→bord-Tˡᵉ, `Cahier de français <classe>.dc.html`)
         EB Garamond et Poppins, les six couleurs de module du livre relié.
         C'est l'ouvrage de référence, celui qu'on garde : il a la tenue d'un
         livre, pas d'un cahier d'exercices.

     Le thème se choisit sur le SLUG de l'ouvrage, qui est aussi ce que le
     serveur a vendu — il n'y a donc rien à deviner ni à configurer. */
  function familleOuvrage(slug) {
    var s = String(slug || '').toLowerCase().replace(/^apercu-/, '');
    if (s.indexOf('bord-') === 0) return 'bord';
    if (/^(2nde|1ere|1ère|tle|est)/.test(s)) return 'lycee';
    return 'college';
  }

  /* ── « MODULE », PAS « SÉQUENCE », DE LA 6ᵉ À LA 3ᵉ ───────────────────────
     Le programme du 1er cycle est découpé en MODULES, et les quatre livrets
     l'impriment ainsi — « MODULE 1 · La vie quotidienne ». Leur source, elle,
     nomme le bloc `sequence`, et l'écran recopiait ce mot-là : l'élève lisait
     « séquence » sur son téléphone et « module » sur la page qu'il avait sous
     les yeux. Deux mots pour la même chose, dans le même cahier.
     On corrige à l'AFFICHAGE et non dans les données : le mot juste arrive
     ainsi aux cahiers déjà déposés sur le serveur, sans rien re-téléverser.
     La 2ⁿᵈᵉ et le lycée gardent « Séquence », qui est leur mot ; les Bords
     gardent le leur, imprimé « Séquence » dans le livre relié. */
  var DIT_MODULE = { '6e': 1, '5e': 1, '4e': 1, '3e': 1 };

  function motDeDivision(y, slug) {
    var s = String(slug || '').toLowerCase().replace(/^apercu-/, '');
    if (y === 'sequence' && DIT_MODULE[s]) return 'Module';
    return ETIQUETTES[y] || 'Séquence';
  }

  /* Les polices propres à chaque collection. Elles sont chargées À LA DEMANDE,
     quand on sait quel cahier s'ouvre : charger les onze familles des trois
     maquettes sur chaque page ferait payer à un élève de 6ᵉ les polices du
     livre de Terminale — sur une ligne à 2 G, cela se compte en secondes.
     Klee One (l'écriture manuscrite) et Source Sans 3 (l'interface) sont
     communes et restent dans la coquille HTML. */
  var POLICES = {
    college: 'Baloo+2:wght@700;800&family=Lora:ital,wght@0,400;0,500;1,400',
    lycee:   'Nunito:wght@700;800;900&family=Source+Serif+4:ital,opsz,wght@0,8..60,400;0,8..60,600;1,8..60,400&family=Caveat:wght@600;700',
    bord:    'EB+Garamond:ital,wght@0,400;0,600;1,400&family=Poppins:wght@500;600;700'
  };

  function assurerPolices(fam) {
    /* Hors navigateur (les bancs tournent sous Node), il n'y a pas de `head`
       où poser la balise, et rien à charger : on sort sans bruit. */
    if (typeof document === 'undefined' || !document.head || !POLICES[fam]) return;
    var id = 'ch-polices-' + fam;
    if (document.getElementById(id)) return;
    var l = document.createElement('link');
    l.id = id;
    l.rel = 'stylesheet';
    l.href = 'https://fonts.googleapis.com/css2?family=' + POLICES[fam] + '&display=swap';
    document.head.appendChild(l);
  }

  /* ── LES OUTILS D'ANALYSE, AU LYCÉE ──────────────────────────────────────
     Repris mot pour mot de la maquette 2ⁿᵈᵉ–Tˡᵉ (`_emph`). Ce ne sont pas des
     mots ordinaires : ce sont les termes que le correcteur du baccalauréat
     cherche dans une copie. Les faire ressortir dans l'énoncé, c'est apprendre
     à les reconnaître — et c'est ce que fait le livre imprimé. */
  var OUTILS_LITT = "comparaisons?(?: filées?)?|métaphores?(?: filées?)?|personnifications?"
    + "|allégories?|allitérations?|assonances?|oxymores?|antith[eè]ses?|chiasmes?|hyperboles?"
    + "|litotes?|euphémismes?|anaphores?|énumérations?|gradations?|périphrases?|métonymies?"
    + "|synecdoques?|enjambements?|contre-rejets?|rejets?|césures?|champ lexical"
    + "|tonalité(?: lyrique| pathétique| tragique| comique| épique| satirique| polémique| didactique)?"
    + "|lyrisme|participes?(?: présents?| passés?)?|points? de suspension|questions? rhétoriques?"
    + "|apostrophes?|répétitions?|parallélismes?|connecteurs?(?: logiques?)?|adversatif|négations?"
    + "|présent de vérité générale|passé simple|imparfait|subjonctif|conditionnel|impératif";

  /* Les intitulés de la démarche (Axe 1, Problématique, Champs lexicaux…).
     Dans le livre ils prennent à tour de rôle quatre couleurs : c'est ce qui
     fait qu'un plan de commentaire se lit d'un coup d'œil. */
  var ETAPES_LITT = "Sous-centres?\\s*\\d+(?:\\.\\d+)?|Axe\\s*\\d+|Arguments?\\s*\\d+|Parties?\\s*\\d+"
    + "|Qui parle\\s*\\?|[ÀA] qui\\s*\\?|Champs? lexicaux?|Figures? de style|Effets? de rythme"
    + "|Jeux de sonorités|Références? au texte|Problématique|Démarche|Idée générale|Transitions?"
    + "|Conclusion|Introduction|Th[eè]se|Antith[eè]se";

  /** Deux textes disent-ils la même chose ? On compare le fond, pas la forme :
   *  la casse, les espaces et la ponctuation de bord ne font pas la phrase. */
  function meme(a, b) {
    var n = function (s) {
      return String(s || '').toLowerCase().replace(/\s+/g, ' ')
        .replace(/^[\s—–:.\-]+|[\s—–:.\-]+$/g, '').trim();
    };
    var x = n(a), z = n(b);
    return !!x && x === z;
  }

  /** Retire d'un repère le mot que la pastille dit déjà. */
  function sansMot(no, mot) {
    no = String(no || '').trim();
    if (mot && no.toLowerCase().indexOf(String(mot).toLowerCase()) === 0) {
      no = no.slice(String(mot).length).replace(/^[\s·:.—-]+/, '');
    }
    return no;
  }

  /** Le repère d'une division, sans le mot que la pastille dit déjà.
   *  « Leçon Leçon 1 » : le 1er cycle range le libellé entier dans `no`. */
  function repere(b, mot) {
    return sansMot(String((b && (b.no || b.n || b.num)) || ''), mot);
  }

  function Cahier(opts) {
    this.ouvrage = String(opts.ouvrage || '');
    this.token   = String(opts.token || '');
    this.hote    = opts.hote;
    this.blocs   = opts.blocs || [];
    this.lecture = !!opts.lecture;          // vue enseignant : on n'écrit pas
    this.champs  = [];
    this.reponses    = {};
    this.annotations = {};
    this.enAttente   = {};                  // ce qui n'est pas encore parti
    this.LS = 'vrt-cahier-' + this.ouvrage;
    this._tLocal = null;
    this._tServeur = null;
    this._envoiEnCours = false;
    this.aCorriges = false;         // le serveur le dira au chargement
    this.corriges = {};             // ceux déjà ouverts, pour ne pas les redemander
  }

  Cahier.prototype.cleLocale = function () { return this.LS; };

  /* ── Démarrage ────────────────────────────────────────────────────────────
     On lit D'ABORD l'appareil, on affiche, PUIS on demande au serveur. Ainsi
     l'élève voit son travail immédiatement, même hors ligne, et la réponse du
     serveur ne fait que compléter. L'inverse — attendre le réseau pour
     afficher — donne un cahier vide pendant plusieurs secondes, et vide tout
     court quand la ligne est coupée. */
  Cahier.prototype.demarrer = function () {
    var self = this;
    try {
      var brut = localStorage.getItem(this.LS);
      if (brut) {
        var d = JSON.parse(brut);
        this.reponses    = d.reponses || {};
        this.annotations = d.annotations || {};
        this.enAttente   = d.enAttente || {};
      }
    } catch (e) { /* stockage refusé : on continue, en mémoire */ }

    this.protegerContenu();
    this.rendre();
    this.charger().then(function () { self.pousser(); });
    // Un dernier envoi quand la page se ferme : le différé de 2,5 s ne doit
    // pas coûter la dernière phrase écrite.
    global.addEventListener('pagehide', function () { self.pousser(true); });
    global.addEventListener('visibilitychange', function () {
      if (document.visibilityState === 'hidden') self.pousser(true);
    });
  };

  /* ── DISSUASION DE COPIE ──────────────────────────────────────────────────
     `livrets/liseur.js` — le feuilletage page par page — porte ces gardes
     depuis toujours. Le moteur du cahier, lui, n'en avait AUCUNE : ni clic
     droit, ni sélection, ni Ctrl+S/P/U. Or c'est lui qui sert désormais
     quatorze des quinze ouvrages vendus. Le produit le plus large du
     catalogue était le moins gardé, et rien ne le disait.

     CE QUE ÇA VAUT, ET IL FAUT LE DIRE À L'ACHETEUR COMME À L'AUTEUR :
     rien de tout cela ne résiste à une photo de l'écran avec un second
     téléphone, ni à un navigateur en mode développeur. Ces gardes dissuadent
     le partage OPPORTUNISTE — le camarade qui fait Ctrl+A / Ctrl+C — et rien
     de plus. Ce qui protège réellement est ailleurs, et existe déjà : le
     contenu n'est servi qu'après un code valide (`api/livret.php`), le jeton
     est lié au poste, le quota d'appareils est de trois, la révocation est
     immédiate, et le FILIGRANE NOMINATIF rend traçable toute capture qui
     circule. Une protection annoncée comme infaillible se retourne contre
     celui qui l'annonce.

     JAMAIS SUR LES CHAMPS DE RÉPONSE. C'est la règle explicite du cahier des
     charges, et elle est de bon sens : un élève doit pouvoir sélectionner,
     couper, coller et corriger CE QU'IL ÉCRIT. Bloquer le clic droit dans son
     propre brouillon, c'est lui retirer le correcteur orthographique et le
     presse-papier de son téléphone pour protéger un texte qui est le sien. */
  Cahier.prototype.protegerContenu = function () {
    var hote = this.hote;
    if (!hote || hote.getAttribute('data-garde')) return;
    hote.setAttribute('data-garde', '1');

    var saisie = function (t) {
      if (!t || !t.closest) return false;
      return !!t.closest('textarea, input, select, [contenteditable="true"]');
    };

    hote.addEventListener('contextmenu', function (e) {
      if (!saisie(e.target)) e.preventDefault();
    });
    hote.addEventListener('copy', function (e) {
      if (!saisie(e.target)) e.preventDefault();
    });
    hote.addEventListener('dragstart', function (e) {
      if (!saisie(e.target)) e.preventDefault();
    });

    /* Ctrl/Cmd + S, P, U. On l'écoute sur le DOCUMENT — un raccourci clavier
       ne vise pas un élément, il vise la page — mais on laisse passer quand le
       curseur est dans un champ : Ctrl+P y sert encore à imprimer sa copie,
       ce qui est un droit de l'élève sur son propre travail. */
    document.addEventListener('keydown', function (e) {
      if (!(e.ctrlKey || e.metaKey)) return;
      var k = String(e.key || '').toLowerCase();
      if (k !== 's' && k !== 'p' && k !== 'u') return;
      if (saisie(document.activeElement)) return;
      e.preventDefault();
    });
  };

  Cahier.prototype.charger = function () {
    var self = this;
    if (!this.token) return Promise.resolve();
    return fetch(API, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'charger', token: this.token })
    }).then(function (r) { return r.ok ? r.json() : null; })
      .then(function (j) {
        if (!j || !j.ok) return;
        /* Le serveur ne PIÉTINE pas ce qui n'est pas encore parti : une
           réponse écrite hors ligne et pas encore synchronisée doit survivre
           au chargement, sinon travailler sans réseau revient à ne rien
           écrire. */
        var s = j.reponses || {};
        for (var k in s) {
          if (!Object.prototype.hasOwnProperty.call(self.enAttente, k)) self.reponses[k] = s[k];
        }
        self.annotations = j.annotations || {};
        self.aCorriges = (j.corriges || 0) > 0;
        self.sauverLocal();
        /* Une réponse écrite sur un AUTRE appareil, dans une boîte que cette
           page a cessé de dessiner (voir `consignesMuettes` dans `rendre`) :
           `peupler()` ne la ferait apparaître nulle part, faute d'endroit où
           la mettre. On redessine — une seule fois, au chargement, avant que
           l'élève n'ait commencé à écrire. */
        var orphelines = (self.consignesMuettes || []).some(function (k) {
          return String(self.reponses[k] || '').trim();
        });
        if (orphelines) self.rendre(); else self.peupler();
      })
      .catch(function () { /* hors ligne : l'appareil fait foi */ });
  };

  Cahier.prototype.sauverLocal = function () {
    try {
      localStorage.setItem(this.LS, JSON.stringify({
        reponses: this.reponses, annotations: this.annotations,
        enAttente: this.enAttente, maj: Date.now()
      }));
    } catch (e) { this.voyant('Mémoire de l’appareil pleine', 'alerte'); }
  };

  /* ── Envoi au serveur ─────────────────────────────────────────────────────
     On n'envoie QUE la file d'attente. Pousser tout le cahier à chaque frappe
     ferait passer 200 Ko sur une ligne qui en supporte mal 20, et écraserait
     les réponses saisies pendant que la requête était en vol. */
  Cahier.prototype.pousser = function (immediat) {
    var self = this;
    if (this.lecture || !this.token) return;
    clearTimeout(this._tServeur);
    var faire = function () {
      if (self._envoiEnCours) { self._tServeur = setTimeout(faire, 1200); return; }
      var lot = self.enAttente;
      if (!Object.keys(lot).length) return;
      self.enAttente = {};                  // on vide AVANT : ce qui s'écrit
      self._envoiEnCours = true;            // pendant l'envoi part au suivant
      self.voyant('Enregistrement…', 'encours');
      fetch(API, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'enregistrer', token: self.token, reponses: lot })
      }).then(function (r) { return r.json().then(function (j) { return { s: r.status, j: j }; }); })
        .then(function (rep) {
          self._envoiEnCours = false;
          if (rep.j && rep.j.ok) {
            self.voyant('Enregistré', 'ok');
            if ((rep.j.tronquees || []).length) {
              self.voyant('Une réponse dépasse ' + MAX_REPONSE + ' caractères et a été raccourcie', 'alerte');
            }
            self.sauverLocal();
          } else {
            // L'envoi a échoué : le lot RETOURNE dans la file. Sans cela, une
            // erreur serveur effacerait définitivement le travail de l'élève.
            for (var k in lot) if (!(k in self.enAttente)) self.enAttente[k] = lot[k];
            self.sauverLocal();
            self.voyant((rep.j && rep.j.error) || 'Enregistrement différé', 'alerte');
          }
        })
        .catch(function () {
          self._envoiEnCours = false;
          for (var k in lot) if (!(k in self.enAttente)) self.enAttente[k] = lot[k];
          self.sauverLocal();
          self.voyant('Hors ligne — ton travail est gardé sur l’appareil', 'attente');
        });
    };
    if (immediat) faire(); else this._tServeur = setTimeout(faire, DIFFERE_SERVEUR);
  };

  Cahier.prototype.voyant = function (texte, etat) {
    var el = document.getElementById('ch-voyant');
    if (!el) return;
    el.textContent = texte;
    el.className = 'ch-voyant ch-' + (etat || 'ok');
    if (etat === 'ok') {
      clearTimeout(this._tVoyant);
      this._tVoyant = setTimeout(function () { el.textContent = ''; el.className = 'ch-voyant'; }, 2200);
    }
  };

  Cahier.prototype.noter = function (cle, valeur) {
    var self = this;
    if (valeur.length > MAX_REPONSE) valeur = valeur.slice(0, MAX_REPONSE);
    this.reponses[cle] = valeur;
    this.enAttente[cle] = valeur;
    clearTimeout(this._tLocal);
    this._tLocal = setTimeout(function () { self.sauverLocal(); }, DIFFERE_LOCAL);
    this.pousser();
  };

  // ── Rendu ─────────────────────────────────────────────────────────────────
  /* ── LE CALCUL DES CLÉS, SÉPARÉ DU RENDU ─────────────────────────────────
     Extrait exprès de `rendre()` : c'est la règle la plus importante du
     moteur, et une règle qui ne se teste qu'à travers un navigateur ne se
     teste pas souvent. Ici elle est PURE — des blocs entrent, des clés
     sortent — donc `tests/banc_cles_cahier.cjs` l'éprouve en une seconde,
     sans DOM, et le rendu ne peut pas diverger puisqu'il consomme ce
     résultat. */
  function calculerCles(ouvrage, blocs) {
    /* `vus` compte les consignes identiques DANS un même contexte. Il était
       remis à zéro à chaque leçon — ce qui suppose que deux leçons ne portent
       jamais le même repère. Faux sur les Bords : leurs blocs `lecon` n'ont pas
       toujours de numéro, le contexte retombe alors sur la même chaîne, et le
       compteur repartait de zéro dans un contexte qu'il avait déjà vu.
       Mesuré sur le Bord de 3ᵉ : 117 clés en double sur 1 312 — donc 117
       endroits où deux exercices se partageaient une réponse, le second
       écrasant le premier.
       On indexe donc par contexte, et on ne remet plus rien à zéro : le
       suffixe reste borné au couple (séquence, leçon), comme prévu, mais il ne
       peut plus se réinitialiser sous lui-même. */
    var ctxSeq = '0', ctxLecon = '0', vus = {}, out = [], dernierEmp = '';
    (blocs || []).forEach(function (b) {
      if (!b || typeof b !== 'object') { out.push(null); return; }
      var y = b.y || b.t || '';
      if (DIVISIONS[y]) {
        ctxSeq = String(b.no || b.n || b.num || empreinte(texteDuBloc(b)));
        ctxLecon = '0';
      } else if (SOUS_DIVISIONS[y]) {
        ctxLecon = String(b.no || b.n || b.num || empreinte(texteDuBloc(b)));
      }
      /* La clé : OÙ l'on est + CE QUE dit l'exercice. Si deux consignes sont
         rigoureusement identiques dans la MÊME leçon (cela arrive :
         « Justifie ta réponse. » deux fois), on suffixe par l'ordre
         d'apparition — la collision reste bornée à ces deux-là, au lieu de
         décaler tout le cahier comme le ferait un compteur. */
      /* Un bloc SANS texte — l'espace d'écriture qui suit une question —
         n'a rien à quoi accrocher son empreinte. Lui en calculer une sur la
         chaîne vide les rendrait tous identiques dans la leçon, et le seul
         élément distinctif serait leur rang : on retomberait exactement sur
         le compteur d'affichage qu'on a écarté plus haut.
         Il hérite donc de l'empreinte du bloc précédent, dont il EST la
         réponse. La clé se lit alors « l'espace d'écriture de la question X »,
         et elle survit à l'insertion d'un exercice ailleurs. */
      var brut = texteDuBloc(b);
      var emp = brut ? empreinte(brut) : (dernierEmp || empreinte(''));
      if (brut) dernierEmp = emp;
      var portee = ctxSeq + '|' + ctxLecon + '|' + emp;
      vus[portee] = (vus[portee] || 0) + 1;
      out.push(ouvrage + '/s' + ctxSeq + '/l' + ctxLecon + '/' + emp
             + (vus[portee] > 1 ? '_' + vus[portee] : ''));
    });
    return out;
  }

  /* Ce qui vit À L'INTÉRIEUR d'un encadré (« Je retiens », « Outil »…). Tout
     autre bloc le referme : sans cette règle, la règle de la leçon avalerait
     l'exercice qui la suit. */
  var CORPS_CARTE = { retC: 1, retientC: 1, outilC: 1, boxBody: 1, def: 1, astuce: 1 };

  /* Les têtes d'encadré. Elles NE FERMENT PAS l'encadré courant au passage :
     c'est leur propre branche qui décide — soit elle en ouvre un autre (et
     ferme donc le précédent), soit elle constate qu'il y en a déjà un et se
     tait. Les compter comme des blocs étrangers produisait une boîte vide :
     les cahiers du lycée annoncent la règle deux fois (« L'essentiel à
     retenir » puis « Je retiens »), la première fermait, la seconde rouvrait,
     et il restait entre les deux un encadré à en-tête sans une ligne dedans. */
  var TETES_CARTE = { retT: 1, retientT: 1, outilT: 1, boxHead: 1, taskHead: 1 };

  Cahier.prototype.rendre = function () {
    var self = this, h = '', champs = [];
    var blocs = this.blocs;
    var cles = calculerCles(this.ouvrage, blocs);

    /* COULEUR PAR MODULE — reprise des cahiers imprimés, où chaque module a la
       sienne. Ce n'est pas de l'ornement : sur un cahier de 200 écrans, la
       teinte dit « tu es toujours dans le module 3 » sans qu'on ait à remonter
       au titre. On compte les modules dans l'ORDRE où ils passent, plutôt que
       de lire leur numéro : un cahier qui commence par un module 0 (évaluation
       diagnostique) ou qui saute un numéro garderait sinon une couleur
       incohérente. Six teintes, puis on recommence — les six du livre.

       Elle tourne sur `TETES`, PAS sur `DIVISIONS` : cette dernière contient
       `semaine`, et la couleur changeait donc à chaque semaine — vingt-quatre
       fois dans le cahier de 6ᵉ pour six couleurs imprimées. L'élève qui
       comparait avec son livre voyait deux teintes différentes pour la même
       page. `DIVISIONS` reste intouchée : elle sert au calcul des clés. */
    var seqRang = 0, seqVue = null;

    /* L'état de lecture, tenu d'un bloc au suivant :
         famille  la rubrique en cours. Elle colore les exercices qui suivent,
                  comme dans le livre où le rond du numéro prend la couleur de
                  sa section ;
         carte    l'encadré ouvert, à refermer dès qu'un bloc étranger arrive ;
         saute    les blocs déjà consommés par un voisin (le domaine d'une
                  leçon est le bloc suivant : on le lit d'avance). */
    var famille = '', carte = '', saute = {}, leconTitre = '';
    /* Les consignes dont on a tu la boîte de réponse — voir plus bas. */
    var muettes = [];

    /* La collection décide de la maquette : polices, palette, densité. Elle est
       posée sur l'hôte, d'où la feuille de style la lit pour tout ce qui suit
       (`.ch-hote[data-fam="lycee"] …`). Le banc Node donne un hôte factice sans
       `setAttribute` : on ne suppose donc pas qu'il existe. */
    var fam = familleOuvrage(this.ouvrage);
    var lycee = (fam === 'lycee');
    assurerPolices(fam);
    if (this.hote && this.hote.setAttribute) this.hote.setAttribute('data-fam', fam);

    function fermerCarte() { if (carte) { h += '</div></div>'; carte = ''; } }
    /* `data-seq` sur l'encadré, et pas seulement sur les titres : au lycée, la
       maquette teinte « Je retiens » de la couleur de SA séquence. Sans cet
       attribut, la variable `--seq` n'existe pas sur la carte et le repli bleu
       s'appliquait à toutes — les huit séquences avaient le même encadré. */
    function ouvrirCarte(genre, titre, ic, teinte) {
      fermerCarte();
      carte = genre;
      h += '<div class="ch-carte" data-carte="' + genre + '" data-seq="' + (teinte || 1) + '">'
        +  '<div class="ch-carte-t">' + (ic ? icone(ic) : '') + '<span>' + titre + '</span></div>'
        +  '<div class="ch-carte-c">';
    }
    function sansPrefixe(s, re) { return String(s).replace(re, ''); }

    /* Ce qu'on met en couleur dépend de la collection, parce que ce qu'on
       apprend n'est pas le même. Au collège : qui parle (noms propres) et
       comment (verbes de parole) — on apprend à lire un récit. Au lycée : les
       outils d'analyse et les étapes de la démarche — on apprend à commenter.
       Un bloc à `runs` porte déjà ses mises en évidence, posées à la source :
       les recouvrir d'une seconde couche croiserait les balises. */
    function colorer(b, html, extra) {
      if (b.r) return html;
      var o = lycee ? { outils: 1, cite: 1 } : { dialogue: 1, propre: 1 };
      if (extra) for (var k in extra) if (extra.hasOwnProperty(k)) o[k] = extra[k];
      return marquer(html, leconTitre, o);
    }

    blocs.forEach(function (b, i) {
      if (!b || typeof b !== 'object' || saute[i]) return;
      var y = b.y || b.t || '';
      var cleBloc = cles[i];
      if (TETES[y]) {
        var sig = y + '/' + String(b.no || b.n || b.num || i);
        if (sig !== seqVue) {
          seqVue = sig;
          /* La teinte suit le NUMÉRO du module quand il y en a un, pas le rang
             d'apparition. Les deux donnent la même chose dans un cahier
             complet (module 1 = rose, module 2 = sarcelle…), mais pas dans un
             extrait : l'aperçu gratuit de 6ᵉ commence au module 2 et sortait
             donc en rose, quand le livre que le visiteur a sous les yeux est
             sarcelle. Sans numéro exploitable — un module « 0 » d'évaluation
             diagnostique, un intitulé en toutes lettres — on reprend le
             compteur, qui au moins ne répète pas deux fois la même couleur. */
          var num = parseInt(String(b.no || b.n || b.num || ''), 10);
          if (lycee) {
            /* Huit teintes au lycée, indexées sur le NUMÉRO : la séquence 0
               (évaluation diagnostique) et la 7 (sujets d'examen) ont la leur
               dans le livre, et ce sont justement les deux qu'un élève cherche
               en premier. */
            seqRang = (num >= 0 && num <= 7) ? num : ((seqRang + 1) % 8);
          } else {
            seqRang = (num >= 1) ? ((num - 1) % 6) + 1 : (seqRang % 6) + 1;
          }
        }
      }
      var teinte = lycee ? seqRang : (seqRang || 1);
      var corps = b.r ? rendreRuns(b.r, cleBloc, champs) : esc(b.txt || '');
      var titre = esc(b.title || b.titre || '') || corps;

      if (carte && !CORPS_CARTE[y] && !TETES_CARTE[y]) fermerCarte();

      /* ── LA TÊTE DE MODULE ────────────────────────────────────────────────
         Dans le livre, elle occupe toute la largeur : un grand chiffre blanc
         sur la couleur du module, le mot « Module », le titre. C'est le repère
         le plus fort de la double page — celui qu'on cherche du pouce en
         feuilletant. Il n'existait pas à l'écran : une pastille de 11 px. */
      if (TETES[y]) {
        famille = '';
        var motM = motDeDivision(y, self.ouvrage);
        /* Le repère se nettoie des DEUX mots : la source du 1er cycle range
           « Séquence 1 » dans `no`, et l'on affiche « Module ». Sans cela on
           lirait « MODULE Séquence 1 ». */
        var noM = sansMot(sansMot(repere(b, motM), 'Séquence'), 'Module');
        /* « SÉQUENCE 2 » comme titre de la séquence 2 : les cahiers du lycée
           recopient le libellé dans le titre. Affiché tel quel, on lisait deux
           fois la même chose, en gros, l'une sous l'autre. */
        var brutM = String(b.title || b.titre || '').trim();
        var titreM = /^(s[ée]quence|module|partie|section)\s*\d*$/i.test(brutM) ? '' : titre;
        h += '<section class="ch-module" data-seq="' + teinte + '">'
          +  '<span class="ch-module-no">' + (esc(noM) || '❖') + '</span>'
          +  '<span class="ch-module-mot">' + esc(motM) + '</span>'
          +  (titreM ? '<h2 class="ch-module-t">' + titreM + '</h2>' : '')
          +  '</section>';
        return;
      }

      if (SEMAINES[y]) {
        famille = '';
        var noS = repere(b, 'Semaine');
        h += '<div class="ch-semaine" data-seq="' + teinte + '">'
          +  '<span class="ch-semaine-no">Semaine' + (noS ? ' ' + esc(noS) : '') + '</span>'
          +  '<span class="ch-semaine-t">' + titre + '</span></div>';
        return;
      }

      /* ── LE TITRE DE LEÇON, ET SON DOMAINE ────────────────────────────────
         Le domaine (Grammaire, Conjugaison, Lecture…) est TOUJOURS le bloc
         suivant dans les sources ; il tombait donc à l'écran en intertitre
         orphelin SOUS le titre, à l'envers du livre. On le lit d'avance et on
         le pose au-dessus, dans son badge de couleur, comme il est imprimé. */
      if (SOUS_DIVISIONS[y]) {
        famille = '';
        /* Le titre de la leçon arme la coloration des notions dans les corpus
           qui suivent : « Les connecteurs logiques » fait ressortir les
           connecteurs, « La phrase négative » les négations. */
        leconTitre = String(b.title || b.titre || b.txt || '') + ' ' + texteDuBloc(b);
        var motL = ETIQUETTES[y] || 'Leçon';
        var noL = repere(b, motL);
        var dom = '', domCl = '', apres = blocs[i + 1];
        if (apres && RUBRIQUES[apres.y || apres.t] && !apres.r) {
          domCl = disciplineDe(apres.txt);
          if (domCl) { dom = String(apres.txt || ''); saute[i + 1] = 1; }
        }
        h += '<div class="ch-lecon" data-seq="' + teinte + '">'
          +  '<div class="ch-lecon-h">'
          +    (dom ? '<span class="ch-disc" data-disc="' + domCl + '">' + esc(dom) + '</span>' : '')
          +    '<span class="ch-lecon-no">' + esc(motL) + (noL ? ' ' + esc(noL) : '') + '</span>'
          +  '</div>'
          +  '<h3 class="ch-lecon-t">' + titre + '</h3></div>';
        return;
      }

      if (y === 'competence') {
        h += '<div class="ch-competence" data-seq="' + teinte + '">'
          +  '<span class="ch-competence-l">Compétence visée</span>'
          +  '<p>' + corps + '</p></div>';
        return;
      }

      if (y === 'objectif') {
        h += '<p class="ch-objectif"><span class="ch-objectif-l">' + icone('target')
          +  '<span>Objectif</span></span>' + corps + '</p>';
        return;
      }

      /* ── LA RUBRIQUE ──────────────────────────────────────────────────────
         « Je repère », « Je transforme », « QCM »… : dans le livre, une
         pastille colorée à icône, et sa couleur se retrouve sur le numéro de
         chaque exercice qui suit. C'est le fil qu'on suit des yeux.
         Un libellé qui n'est pas une famille (« Adjectif ou complément du
         nom ? », le titre d'un texte) reste un intertitre : lui coller une
         pastille vive au hasard ferait un cahier bariolé, pas un cahier
         organisé. */
      if (RUBRIQUES[y]) {
        var brut = String(b.txt || '').trim() || texteDuBloc(b);
        if (RETIENS_RE.test(brut)) {
          /* « L'essentiel à retenir » n'est pas toujours un titre : les cahiers
             du lycée le posent APRÈS les règles, comme un marqueur de fin. On
             ouvrait alors un encadré vide, juste sous celui qui venait de se
             fermer — deux boîtes bleues à la suite, la seconde sans un mot.
             On n'ouvre donc que si ce qui suit est bien un corps d'encadré ;
             sinon on tait le libellé, que la carte affiche déjà en titre. */
          var apresR = blocs[i + 1], yApresR = apresR && (apresR.y || apresR.t);
          if (yApresR && (CORPS_CARTE[yApresR] || yApresR === 'retT' || yApresR === 'retientT')) {
            ouvrirCarte('retiens', corps, 'bulb', teinte);
          }
          return;
        }
        var fam = familleDe(b, brut);
        famille = fam;
        if (fam && brut.length <= 46) {
          h += '<div class="ch-rubrique" data-cat="' + fam + '" data-seq="' + teinte + '">'
            +  icone(ICONE_DE[fam] || 'search') + '<span>' + corps + '</span></div>';
        } else {
          h += '<div class="ch-inter" data-seq="' + teinte + '">' + corps + '</div>';
        }
        return;
      }

      /* Le corpus : dans le livre, un encadré ambre qui dit « voici la matière
         que tu vas manipuler ». Il se confondait avec un texte ordinaire. */
      if (y === 'corpus') {
        h += '<div class="ch-corpus" data-seq="' + teinte + '">'
          +  '<span class="ch-corpus-l">' + icone('book') + '<span>Corpus</span></span>'
          +  '<div class="ch-corpus-c">'
          +  colorer(b, corps)
          +  '</div></div>';
        return;
      }
      /* ── UN TEXTE, UN ENCADRÉ ─────────────────────────────────────────────
         Les sources découpent un extrait en autant de blocs `texte` qu'il a de
         paragraphes — trois pour la page de Lucien Leuwen. Rendus séparément,
         cela donnait trois cadres empilés là où le livre n'en imprime qu'un :
         le lecteur croyait à trois textes, et les filets hachaient l'extrait
         au milieu des phrases.
         On rassemble donc les blocs qui se suivent dans un seul encadré, un
         paragraphe par bloc. Le premier porte la couleur du module ; les
         autres sont consommés au passage (`saute`). */
      if (y === 'texte' || y === 'corps' || y === 'texteT') {
        var corpsT = '<p>' + colorer(b, corps) + '</p>';
        for (var j = i + 1; j < blocs.length; j++) {
          var v = blocs[j], yv = v && (v.y || v.t);
          if (yv !== 'texte' && yv !== 'corps' && yv !== 'texteT') break;
          saute[j] = 1;
          var cv = v.r ? rendreRuns(v.r, cles[j], champs) : esc(v.txt || '');
          if (cv) corpsT += '<p>' + colorer(v, cv) + '</p>';
        }
        h += '<div class="ch-texte" data-seq="' + teinte + '">' + corpsT + '</div>';
        return;
      }
      if (y === 'source') { h += '<p class="ch-source">' + corps + '</p>'; return; }
      /* ── LES DOCUMENTS ICONOGRAPHIQUES ────────────────────────────────────
         37 blocs `image` dans les quinze cahiers, et AUCUN ne s'affichait.
         Deux causes distinctes, toutes deux silencieuses :
           · 31 viennent des Bords, où la source nomme le fichier dans `img`
             (« image4 ») et pas dans `src` — le moteur cherchait `src`, ne
             trouvait rien, et n'écrivait rien ;
           · 6 viennent des cahiers du lycée, où `src` est un chemin RELATIF
             (« images/1e-image-tele.jpg ») qui, depuis /livrets/cahier.html,
             pointe sur /livrets/images/… — un dossier qui n'est pas déployé.
         Les fichiers existent (≈ 3,5 Mo dans ~/Desktop/Collaboratif), ils ne
         sont simplement déposés nulle part.

         Tant qu'ils ne le sont pas, on ne pose PAS de balise `<img>` : elle
         donnerait l'icône d'image cassée au milieu d'un cahier payé, ce qui se
         lit comme une panne du site. On affiche la LÉGENDE, qui décrit le
         document (« Document 1 — dessin de presse : la télévision, l'examen et
         le dialogue entre générations ») : l'élève sait au moins de quoi parle
         la consigne qui le renvoie à ce document. Le jour où les fichiers sont
         en ligne, `src` devient absolu et l'image prend la place de sa
         légende — rien d'autre à changer ici. */
      /* ── LA CARTE MENTALE ─────────────────────────────────────────────────
         Treize schémas vectoriels dormaient dans les sources sans être
         rattachés à aucun ouvrage vendu : douze cartes mentales et le schéma
         de la communication de Jakobson. Du contenu produit que personne ne
         pouvait voir. Ils sont maintenant posés sous le titre de la leçon qui
         enseigne la notion, dans les douze cahiers où cette leçon existe.

         Ils sont EMBARQUÉS (SVG en `data:`) et non servis par une URL : quelques
         kilo-octets, nets à n'importe quel zoom, et présents hors ligne — une
         carte mentale se regarde justement quand on révise, souvent sans
         réseau. Un clic l'ouvre en grand : à 360 px de large, un schéma à six
         branches ne se lit pas autrement. */
      if (y === 'carte' && b.src) {
        h += '<figure class="ch-mentale" data-seq="' + teinte + '">'
          +  '<span class="ch-mentale-l">' + icone('target') + '<span>Carte mentale</span></span>'
          +  '<button type="button" class="ch-mentale-b" aria-label="Agrandir la carte mentale">'
          +  '<img alt="' + esc(b.cap || '') + '"' + mesures(b)
          +  ' src="' + esc(b.src) + '"></button>'
          +  (b.cap ? '<figcaption>' + esc(b.cap) + '</figcaption>' : '')
          +  '</figure>';
        return;
      }

      if (y === 'image')  {
        var src = String(b.src || '');
        var utilisable = /^(https?:)?\/\/|^\/|^data:/.test(src);
        var leg = esc(b.cap || b.legende || '');
        if (utilisable) {
          h += '<figure class="ch-figure"><img alt="' + leg + '"' + mesures(b)
            +  ' src="' + esc(src) + '">'
            +  (leg ? '<figcaption>' + leg + '</figcaption>' : '') + '</figure>';
        } else if (leg) {
          h += '<figure class="ch-figure ch-figure-absente">'
            +  '<figcaption>' + icone('book') + '<span>' + leg + '</span></figcaption>'
            +  '</figure>';
        }
        return;
      }
      if (y === 'table' && b.rows) {
        h += '<div class="ch-tw"><table class="ch-table">';
        b.rows.forEach(function (ligne, li) {
          h += '<tr>';
          (ligne || []).forEach(function (c, ci) {
            var cle = cleBloc + '/c' + li + '_' + ci;
            if (c && c.tail) { champs.push(cle); h += '<td><span class="ch-champ" data-cle="' + esc(cle) + '"></span></td>'; }
            else h += '<td>' + (c && c.r ? rendreRuns(c.r, cleBloc, champs) : esc(c && c.t || c || '')) + '</td>';
          });
          h += '</tr>';
        });
        h += '</table></div>'; return;
      }
      /* ── L'ESPACE OÙ L'ÉLÈVE ÉCRIT ──────────────────────────────────
         `{y:'lines', n:5}` = les cinq lignes pointillées du cahier imprimé.
         C'est le bloc le PLUS fréquent des cahiers du 2ⁿᵈ cycle (361 sur
         2 385 en 1ʳᵉ, 366 en Tˡᵉ S&T) et le moteur n'en faisait rien : la
         page s'affichait, la question se lisait, et il n'y avait nulle part
         où répondre. Un cahier qu'on ne peut pas remplir n'est pas un cahier
         interactif — c'est un PDF avec des couleurs. */
      if (y === 'lines' || y === 'ligne') {
        var nl = Math.max(1, Math.min(40, parseInt(b.n, 10) || 3));
        champs.push(cleBloc);
        h += '<span class="ch-champ ch-champ-lignes" data-lignes="' + nl
          +  '" data-cle="' + esc(cleBloc) + '"></span>';
        return;
      }

      /* QCM — les propositions viennent du document, la bonne réponse non.
         Elle reste dans la charge de l'enseignant : un QCM dont la clé de
         correction voyage avec les propositions se corrige tout seul dans
         l'onglet réseau. On enregistre le libellé choisi, pas un indice :
         réordonner les propositions ne doit pas changer la réponse rendue. */
      if (y === 'qcm' && b.options && b.options.length) {
        var nom = 'q' + empreinte(cleBloc);
        h += '<div class="ch-qcm" data-cle="' + esc(cleBloc) + '">';
        champs.push(cleBloc);
        b.options.forEach(function (o) {
          h += '<label class="ch-opt"><input type="radio" name="' + esc(nom) + '" '
            +  'value="' + esc(o) + '"><span>' + esc(o) + '</span></label>';
        });
        h += '</div>';
        return;
      }

      /* Appariement : « relie chaque élément de gauche à celui de droite ».
         Sur un téléphone on ne trace pas de trait — on choisit. Chaque entrée
         de gauche porte donc sa liste déroulante des entrées de droite. */
      if (y === 'appariement' && b.gauche && b.droite) {
        h += '<div class="ch-rel">';
        b.gauche.forEach(function (g, gi) {
          var cle = cleBloc + '/g' + gi;
          champs.push(cle);
          h += '<div class="ch-rel-l"><span>' + esc(g) + '</span>'
            +  '<select class="ch-rel-s" data-cle="' + esc(cle) + '">'
            +  '<option value="">—</option>';
          b.droite.forEach(function (d) {
            h += '<option value="' + esc(d) + '">' + esc(d) + '</option>';
          });
          h += '</select></div>';
        });
        h += '</div>';
        return;
      }

      /* ── LES MOTS CROISÉS ─────────────────────────────────────────────────
         Une case par lettre, et on écrit dedans. Chaque case porte sa propre
         clé (`…/c<ligne>_<colonne>`) : la grille se remplit en plusieurs fois,
         d'un appareil à l'autre, comme le reste du cahier — et le professeur
         voit ce que l'élève a posé, case par case.
         `null` = case noire (rien à écrire), `{}` = case blanche, `{num:4}` =
         case blanche qui porte le numéro d'une définition. */
      if (y === 'motscroises' && b.cases && b.cases.length) {
        h += '<div class="ch-jeu" data-seq="' + teinte + '" data-jeu="croises">'
          +  '<span class="ch-jeu-l">' + icone('dice') + '<span>Mots croisés</span></span>'
          +  '<div class="ch-grille-tw"><table class="ch-grille"><tbody>';
        b.cases.forEach(function (ligne, li) {
          h += '<tr>';
          (ligne || []).forEach(function (c, ci) {
            if (!c) { h += '<td class="ch-case-noire"></td>'; return; }
            var cle = cleBloc + '/c' + li + '_' + ci;
            champs.push(cle);
            h += '<td class="ch-case">'
              +  (c.num ? '<i>' + esc(c.num) + '</i>' : '')
              +  '<input class="ch-case-i" maxlength="1" autocomplete="off" '
              +  'autocapitalize="characters" spellcheck="false" '
              +  'aria-label="Case ' + (li + 1) + ', ' + (ci + 1) + '" '
              +  'data-cle="' + esc(cle) + '"></td>';
          });
          h += '</tr>';
        });
        h += '</tbody></table></div>';
        [['horiz', 'Horizontalement'], ['verti', 'Verticalement']].forEach(function (p) {
          var lot = b[p[0]];
          if (!lot || !lot.length) return;
          h += '<div class="ch-defs"><span class="ch-defs-t">' + p[1] + '</span>';
          lot.forEach(function (d) {
            h += '<p><b>' + esc(d.n) + '.</b> ' + esc(d.d) + '</p>';
          });
          h += '</div>';
        });
        h += '</div>';
        return;
      }

      /* ── LES MOTS MÊLÉS ───────────────────────────────────────────────────
         Sur papier on entoure les mots au crayon. À l'écran, on touche les
         lettres : chaque case se marque et se démarque, et la liste des mots
         se coche à mesure qu'on les trouve. Deux états, deux clés — les
         lettres marquées et les mots trouvés — enregistrés comme une réponse
         ordinaire, donc conservés et visibles par le professeur. */
      if (y === 'motsmeles' && b.grille && b.grille.length) {
        var cleCases = cleBloc + '/cases', cleMots = cleBloc + '/mots';
        champs.push(cleCases); champs.push(cleMots);
        h += '<div class="ch-jeu" data-seq="' + teinte + '" data-jeu="meles">'
          +  '<span class="ch-jeu-l">' + icone('search') + '<span>Mots mêlés</span></span>'
          +  '<div class="ch-grille-tw"><table class="ch-meles" data-cle="' + esc(cleCases) + '"><tbody>';
        b.grille.forEach(function (ligne, li) {
          h += '<tr>';
          String(ligne).split('').forEach(function (lettre, ci) {
            h += '<td><button type="button" class="ch-lettre" data-rc="' + li + '_' + ci + '">'
              +  esc(lettre) + '</button></td>';
          });
          h += '</tr>';
        });
        h += '</tbody></table></div>';
        if (b.mots && b.mots.length) {
          h += '<div class="ch-mots" data-cle="' + esc(cleMots) + '">'
            +  '<span class="ch-mots-t">Mots à retrouver</span><div class="ch-mots-l">';
          b.mots.forEach(function (m) {
            h += '<button type="button" class="ch-mot" data-mot="' + esc(m) + '">' + esc(m) + '</button>';
          });
          h += '</div></div>';
        }
        h += '</div>';
        return;
      }

      if (BLOCS_CORRIGE[y]) {
        h += '<details class="ch-corrige"><summary>Voir la correction</summary>'
          +  '<div>' + corps + '</div></details>'; return;
      }
      /* ── LES ENCADRÉS DE LA LEÇON ─────────────────────────────────────────
         « Je retiens » est UN encadré bleu à onglet dans le livre, avec ses
         règles à puce et ses exemples dedans. À l'écran, ses 202 morceaux (rien
         que pour la 6ᵉ) tombaient en autant de petites boîtes grises
         indépendantes : l'élève ne voyait plus où la règle commençait ni où
         elle finissait. On rouvre donc un seul encadré et on y range la suite,
         jusqu'au premier bloc qui n'en fait pas partie. */
      /* Les cahiers du lycée annoncent l'encadré DEUX FOIS : une rubrique
         « L'essentiel à retenir », puis un `retT` « Je retiens ». Ouvrir un
         second encadré aurait donné deux boîtes emboîtées dont la première
         reste vide. Celui qui est déjà ouvert suffit. */
      if (y === 'retT' || y === 'retientT') {
        if (carte !== 'retiens') ouvrirCarte('retiens', corps || 'L’essentiel à retenir', 'bulb', teinte);
        return;
      }
      if (y === 'outilT') { ouvrirCarte('outil', corps || 'Outil', 'wrench', teinte); return; }
      if (y === 'boxHead' || y === 'taskHead') {
        var bk = String(b.bk || '').replace(/[^a-z]/gi, '') || 'encadre';
        ouvrirCarte(bk, corps || 'À retenir', bk === 'astuce' ? 'bulb' : 'book', teinte);
        return;
      }
      if (y === 'retC' || y === 'retientC') {
        if (carte !== 'retiens') ouvrirCarte('retiens', 'L’essentiel à retenir', 'bulb', teinte);
        /* Dans la règle, ce sont les exemples entre guillemets qu'on met en
           avant : c'est là que la notion se montre. */
        h += '<p class="ch-regle">'
          +  colorer(b, corps, { cite: 1 }) + '</p>';
        return;
      }
      if (y === 'outilC' || y === 'boxBody') {
        if (!carte) ouvrirCarte('encadre', 'À retenir', 'book', teinte);
        h += '<p class="ch-regle">' + corps + '</p>'; return;
      }

      /* L'astuce : dans le livre, une carte à la main, en Patrick Hand, avec
         ses anneaux de classeur sur le bord. C'est le bloc que les élèves
         lisent en premier — il mérite de se voir. */
      if (y === 'astuce') {
        h += '<div class="ch-astuce" data-seq="' + teinte + '"><span class="ch-astuce-l">' + icone('bulb')
          +  '<span>Astuce</span></span><p>'
          +  sansPrefixe(corps, /^\s*astuce\s*[—:-]\s*/i) + '</p></div>';
        return;
      }

      /* `def` porte trois choses selon la source : un exemple, les critères de
         réussite d'une tâche, ou une définition. Le convertisseur les a
         confondues ; leur texte, lui, les distingue encore. Chacune a sa forme
         dans le livre, et les mélanger revenait à faire trois fois la même
         boîte grise. */
      if (y === 'def') {
        var d = String(b.txt || '') || texteDuBloc(b);
        if (/^\s*crit[èe]res?\s+de\s+r[ée]ussite/i.test(d)) {
          fermerCarte();
          h += '<div class="ch-criteres" data-seq="' + teinte + '"><span class="ch-criteres-l">' + icone('check')
            +  '<span>Critères de réussite</span></span><p>'
            +  sansPrefixe(corps, /^\s*crit[èe]res?\s+de\s+r[ée]ussite\s*[—:-]\s*/i) + '</p></div>';
          return;
        }
        if (/^\s*ex(emple|\.)/i.test(d)) {
          h += '<div class="ch-exemple" data-seq="' + teinte + '"><span class="ch-exemple-l">' + icone('star')
            +  '<span>Exemple</span></span><p>'
            +  sansPrefixe(corps, /^\s*ex(emples?|\.)\s*[—:-]\s*/i) + '</p></div>';
          return;
        }
        h += '<div class="ch-def" data-seq="' + teinte + '">' + colorer(b, corps, { cite: 1 }) + '</div>'; return;
      }

      /* Le sujet de production : dans le livre, un encadré rose à filet, suivi
         de son papier réglé. C'est le devoir de la séquence — il ne doit pas se
         confondre avec un exercice de dix secondes. */
      if (y === 'sujet') {
        fermerCarte();
        h += '<div class="ch-sujet" data-seq="' + teinte + '">'
          +  '<span class="ch-sujet-l">' + icone('pencil') + '<span>Sujet</span></span>'
          +  '<p>' + corps + '</p></div>';
        return;
      }

      /* ── LA CONSIGNE QUI ANNONCE L'EXERCICE SUIVANT ───────────────────────
         Dans le livre elle est en italique au-dessus du groupe d'exercices,
         sans ligne à remplir. Ici elle était traitée comme une question à part
         entière : on posait DEUX espaces de réponse pour une seule question,
         un vide sous la consigne puis un autre sous l'exercice. La consigne
         n'en reçoit donc plus quand l'exercice la suit immédiatement — et
         seulement dans ce cas, sinon une consigne isolée deviendrait une
         question sans nulle part où répondre. */
      if (y === 'consigne') {
        var suiv = blocs[i + 1], ySuiv = suiv && (suiv.y || suiv.t);
        /* Quand la source range LA MÊME phrase dans `consigne` et dans `body`,
           on la lisait deux fois de suite, en italique puis en romain, à deux
           centimètres d'écart. Elle n'apporte rien la seconde fois : on ne
           garde que l'exercice, qui porte le numéro et la réponse. */
        if (ySuiv && BLOCS_A_REPONSE[ySuiv]
            && meme(texteDuBloc(b), texteDuBloc(suiv))) return;
        /* SAUF si quelqu'un y a déjà écrit. La boîte était là depuis la mise en
           vente ; un élève de 5ᵉ a très bien pu s'en servir — c'est celle qui
           tombait juste sous la consigne. La retirer ferait disparaître son
           travail de l'écran (il reste sur le serveur, mais il ne le sait pas,
           et c'est pire). On note ces consignes tues : quand les réponses du
           serveur arriveront, `charger()` redessinera si l'une d'elles est
           habitée. */
        if (ySuiv && ySuiv !== 'consigne' && BLOCS_A_REPONSE[ySuiv]
            && !String(self.reponses[cleBloc + '/rep'] || '').trim()) {
          muettes.push(cleBloc + '/rep');
          h += '<p class="ch-lead">' + corps + '</p>';
          return;
        }
      }

      /* ── QUESTION / EXERCICE / TÂCHE : LE CŒUR DU CAHIER ──────────────────
         Le NUMÉRO manquait. Il est pourtant la seule chose par laquelle un
         professeur désigne un exercice — « faites le 4 » — et le seul point
         commun visible entre l'écran et la page de papier. Il est dans les
         données (467 des 492 exercices de 6ᵉ le portent) et le moteur le
         jetait. Il revient dans son rond, à la couleur de sa rubrique. */
      if (BLOCS_A_REPONSE[y]) {
        var cleRep = cleBloc + '/rep';
        var dejaChamp = champs.some(function (c) { return c.indexOf(cleBloc + '/r') === 0; });
        var noE = String(b.no || b.n || b.num || '').trim();
        var corpsE = corps, tag = '', famE = famille;
        /* Les cahiers du lycée n'ont pas de rubriques : ils nomment la nature
           de l'exercice EN TÊTE de l'énoncé — « 🔍 Repérage — », « 🔬 Analyse — »,
           « ✍️ Production — ». Laissée dans le texte, cette étiquette se lisait
           comme un début de phrase ; sortie, elle rend au lycéen le repère que
           la pastille donne au collégien, et elle dit la famille de l'exercice,
           donc sa couleur. */
        if (!b.r) {
          /* ── « Exercice 2 · Analyse — … » ────────────────────────────────
             Les cahiers du lycée écrivent le numéro DANS la phrase et ne
             remplissent pas `no` : 592 exercices de 1ʳᵉ, Tˡᵉ et Tˡᵉ S&T
             affichaient donc un rond à puce « • » pendant que « Exercice 2 » se
             perdait au fil du texte, en corps courant. Le repère par lequel un
             professeur désigne un exercice — « faites le 2 » — était le seul mot
             qu'on ne voyait pas. On le sort de la phrase et on le met dans le
             rond, comme au collège. */
          var mno = corpsE.match(
            /^\s*(?:exercices?|exos?|questions?)\s*(?:n[°os]?\s*)?(\d+)\s*[·:.—–-]?\s+/i);
          var apresNo = false;
          if (mno) {
            if (!noE) noE = mno[1];
            corpsE = corpsE.slice(mno[0].length);
            apresNo = true;
          } else {
            /* Les QUESTIONS du 2ⁿᵈ cycle numérotent plus sobrement encore :
               « 1. Qui sont les émetteurs… ». Trois cent treize dans le seul
               cahier de 1ʳᵉ, toutes à puce anonyme. Le point d'appel derrière
               le chiffre et la majuscule qui suit distinguent un numéro de
               question d'une date ou d'une décimale — sans cette garde, un
               énoncé commençant par « 1999. Cette année-là… » perdrait son
               premier mot. */
            var mnum = corpsE.match(/^\s*(\d{1,2})\s*[.)°]\s+(?=[«"A-ZÀ-Ý])/);
            if (mnum) {
              if (!noE) noE = mnum[1];
              corpsE = corpsE.slice(mnum[0].length);
            }
          }
          /* Puis la nature de l'exercice. Hors de ce contexte on EXIGE le
             pictogramme de tête : sans lui, « Recopie et complète. — a) … »
             deviendrait une étiquette, et l'énoncé perdrait son premier membre.
             Juste après « Exercice N · », en revanche, la source annonce
             toujours la nature — on accepte donc un simple mot, mais un mot
             SEUL : lettres, espaces et parenthèses, rien d'autre, pour qu'une
             phrase entière ne s'y glisse pas. */
          var mt = apresNo
            ? corpsE.match(/^\s*([A-ZÀ-Ý][A-Za-zÀ-ÿ' ()-]{1,30}?)\s*[—–]\s+/)
            : corpsE.match(/^\s*[^ -ɏ\s‐-‧]{1,4}\s*([A-ZÀ-Ý][^—–<\n]{1,36}?)\s*[—–]\s+/);
          if (mt && mt[1]) {
            tag = mt[1].trim();
            corpsE = corpsE.slice(mt[0].length);
            famE = familleDe(null, tag) || famille;
          }
        }
        h += '<div class="ch-exo" data-seq="' + teinte + '"'
          +  (famE ? ' data-cat="' + famE + '"' : '')
          +  ' data-bloc="' + esc(cleBloc) + '">'
          +  '<div class="ch-exo-h">'
          +    '<span class="ch-exo-no">' + (noE ? esc(noE) : '•') + '</span>'
          /* L'énoncé aussi : c'est là que « relève les métaphores » nomme
             l'outil que l'élève doit reconnaître. */
          +    '<div class="ch-consigne">'
          +      (tag ? '<span class="ch-exo-tag">' + tag + '</span> ' : '')
          +      colorer(b, corpsE, { propre: 0 }) + '</div>'
          +  '</div>';
        /* Un bloc qui porte déjà ses pointillés n'a pas besoin d'une zone en
           plus : on ne double pas le champ de réponse.

           Et pas davantage quand l'espace réglé arrive AU BLOC SUIVANT — c'est
           la forme normale des cahiers du lycée (`exercice` puis `lines`), et
           on posait par-dessus une seconde boîte de quatre lignes vides. Sur le
           2ⁿᵈᵉ, cela faisait une grande zone blanche entre chaque énoncé et son
           papier réglé : de quoi croire que le cahier était mal chargé.
           Même prudence que pour les consignes : si quelqu'un y a déjà écrit,
           on garde la boîte plutôt que d'escamoter son travail. */
        var apresE = blocs[i + 1], yApresE = apresE && (apresE.y || apresE.t);
        /* Un QCM, un appariement ou une grille de jeu SONT la réponse : ils
           arrivent au bloc suivant et se remplissent eux-mêmes. Poser en plus
           une boîte de texte laissait une grande zone blanche entre l'énoncé
           et ses propositions — l'élève cherchait où répondre alors que la
           réponse était juste dessous. */
        var ligneSuit = (yApresE === 'lines' || yApresE === 'ligne'
                      || yApresE === 'qcm' || yApresE === 'appariement'
                      || yApresE === 'motsmeles' || yApresE === 'motscroises')
                     && !String(self.reponses[cleRep] || '').trim();
        if (ligneSuit) muettes.push(cleRep);
        if (!dejaChamp && !ligneSuit) {
          champs.push(cleRep);
          h += '<span class="ch-champ ch-champ-large" data-cle="' + esc(cleRep) + '"></span>';
        }
        /* La zone d'annotation vise le BLOC, pas un champ.
           Elle visait d'abord le champ, et l'élève ne voyait rien : le
           professeur annote « 2nde/s…/l1/w4vhkr/r2 » (le champ), tandis que la
           zone cherchait « 2nde/s…/l1/w4vhkr » (le bloc). Deux clés voisines,
           aucun rapprochement, et un mot du professeur invisible — le genre de
           défaut dont personne ne se plaint parce que personne ne sait qu'il
           manque quelque chose. Un exercice peut d'ailleurs porter plusieurs
           champs : `peupler()` ramasse donc tout ce qui commence par la clé du
           bloc. */
        h += '<div class="ch-corr" data-pour="' + esc(cleBloc) + '"></div>'
          +  '<div class="ch-annot" data-pour="' + esc(cleBloc) + '"></div>'
          +  '</div>';
        return;
      }
      if (corps) h += '<p class="ch-p">' + corps + '</p>';
    });
    /* Un cahier peut se terminer sur sa règle : l'encadré resté ouvert
       laisserait deux balises non fermées, et le navigateur les recollerait où
       il veut. On referme. */
    fermerCarte();

    this.champs = champs;
    this.consignesMuettes = muettes;
    this.hote.innerHTML = h;
    this.peupler();
  };

  /* Remplit les champs et branche la saisie. Séparé du rendu : le serveur
     répond APRÈS le premier affichage, et il ne faut surtout pas redessiner
     toute la page à ce moment-là — l'élève est peut-être déjà en train
     d'écrire, et il perdrait le curseur au milieu d'une phrase. */
  Cahier.prototype.peupler = function () {
    var self = this;
    var places = this.hote.querySelectorAll('.ch-champ');
    Array.prototype.forEach.call(places, function (place) {
      var cle = place.getAttribute('data-cle');
      var champ = place.querySelector('textarea');
      if (!champ) {
        champ = document.createElement('textarea');
        champ.className = 'ch-saisie';
        champ.setAttribute('data-cle', cle);
        /* Autant de lignes que le cahier imprimé en offrait. Une question
           qui laissait douze lignes en attend une réponse développée ; la
           réduire à deux lignes dit à l'élève d'être bref, ce que l'auteur
           n'a pas voulu. */
        champ.rows = parseInt(place.getAttribute('data-lignes'), 10)
                  || (place.classList.contains('ch-champ-large') ? 4 : 2);
        champ.spellcheck = false;
        champ.setAttribute('aria-label', 'Ta réponse');
        if (self.lecture) champ.readOnly = true;
        else champ.addEventListener('input', function () {
          self.noter(cle, champ.value);
          champ.style.height = 'auto';
          champ.style.height = champ.scrollHeight + 'px';
        });
        place.appendChild(champ);
      }
      var v = self.reponses[cle] || '';
      // Ne JAMAIS écraser un champ en cours de frappe.
      if (document.activeElement !== champ && champ.value !== v) champ.value = v;
    });

    /* QCM et appariements. Ils enregistrent par la même porte que le texte
       (`noter`), donc ils suivent l'élève d'un appareil à l'autre et le
       professeur les annote comme le reste — sans quoi une moitié du cahier
       serait sauvegardée et l'autre non, ce que personne ne pourrait deviner. */
    Array.prototype.forEach.call(this.hote.querySelectorAll('.ch-qcm'), function (g) {
      var cle = g.getAttribute('data-cle');
      var choix = self.reponses[cle] || '';
      Array.prototype.forEach.call(g.querySelectorAll('input[type=radio]'), function (r) {
        if (r.value === choix) r.checked = true;
        if (self.lecture) { r.disabled = true; return; }
        if (r.getAttribute('data-lie')) return;
        r.setAttribute('data-lie', '1');
        r.addEventListener('change', function () { if (r.checked) self.noter(cle, r.value); });
      });
    });
    Array.prototype.forEach.call(this.hote.querySelectorAll('.ch-rel-s'), function (sel) {
      var cle = sel.getAttribute('data-cle');
      var v = self.reponses[cle] || '';
      if (document.activeElement !== sel && sel.value !== v) sel.value = v;
      if (self.lecture) { sel.disabled = true; return; }
      if (sel.getAttribute('data-lie')) return;
      sel.setAttribute('data-lie', '1');
      sel.addEventListener('change', function () { self.noter(cle, sel.value); });
    });

    /* ── LES MOTS CROISÉS ────────────────────────────────────────────────────
       Une case = une lettre = une réponse enregistrée, comme n'importe quel
       champ du cahier. La grille se remplit donc en plusieurs fois, survit à
       la fermeture de la page, et suit l'élève d'un appareil à l'autre.
       La saisie avance toute seule à la case suivante : sur un téléphone,
       viser une case de 30 px entre deux lettres est le meilleur moyen de
       renoncer à l'exercice. */
    var cases = this.hote.querySelectorAll('.ch-case-i');
    Array.prototype.forEach.call(cases, function (inp, rang) {
      var cle = inp.getAttribute('data-cle');
      var v = self.reponses[cle] || '';
      if (document.activeElement !== inp && inp.value !== v) inp.value = v;
      if (self.lecture) { inp.readOnly = true; return; }
      if (inp.getAttribute('data-lie')) return;
      inp.setAttribute('data-lie', '1');
      inp.addEventListener('input', function () {
        inp.value = inp.value.toUpperCase().slice(0, 1);
        self.noter(cle, inp.value);
        if (inp.value && cases[rang + 1]) cases[rang + 1].focus();
      });
      /* Effacer une case vide renvoie à la précédente — sinon on reste bloqué
         sur une case déjà vide et l'on croit le clavier cassé. */
      inp.addEventListener('keydown', function (e) {
        if (e.key === 'Backspace' && !inp.value && cases[rang - 1]) cases[rang - 1].focus();
      });
    });

    /* ── AGRANDIR UNE CARTE MENTALE ──────────────────────────────────────────
       Un schéma à six branches ne se lit pas dans une colonne de 360 px. Le
       clic bascule une classe, et la feuille de style s'occupe du reste : pas
       de fenêtre modale à construire, rien à refermer si le JavaScript tombe.
       La touche Échap referme aussi — sur un ordinateur, c'est le geste
       attendu, et sans lui on se retrouve prisonnier d'une image. */
    Array.prototype.forEach.call(this.hote.querySelectorAll('.ch-mentale-b'), function (btn) {
      if (btn.getAttribute('data-lie')) return;
      btn.setAttribute('data-lie', '1');
      btn.addEventListener('click', function () {
        var fig = btn.parentNode;
        var ouvert = fig.classList.toggle('ch-mentale-grand');
        btn.setAttribute('aria-label', ouvert ? 'Réduire la carte mentale'
                                              : 'Agrandir la carte mentale');
        if (ouvert) { btn.scrollLeft = 0; btn.scrollTop = 0; }
      });
      /* Agrandie, l'image déborde et se fait glisser du doigt — le clic sur
         elle sert donc à déplacer, plus à refermer. On referme en touchant le
         fond noir autour, ce que tout le monde essaie en premier. */
      btn.parentNode.addEventListener('click', function (e) {
        var fig = btn.parentNode;
        if (e.target !== fig) return;
        fig.classList.remove('ch-mentale-grand');
        btn.setAttribute('aria-label', 'Agrandir la carte mentale');
      });
    });
    /* `global` est `window` dans un navigateur, l'objet global de Node sur le
       banc — et celui-là n'écoute pas les touches. On ne suppose donc pas
       qu'il sait le faire : `rendre()` appelle `peupler()`, et les bancs
       appellent `rendre()`. */
    if (!this._echapLie && typeof global.addEventListener === 'function') {
      this._echapLie = 1;
      var hote = this.hote;
      global.addEventListener('keydown', function (e) {
        if (e.key !== 'Escape') return;
        Array.prototype.forEach.call(hote.querySelectorAll('.ch-mentale-grand'),
          function (f) { f.classList.remove('ch-mentale-grand'); });
      });
    }

    /* ── LES MOTS MÊLÉS ──────────────────────────────────────────────────────
       Sur papier on entoure au crayon ; ici on touche les lettres. Les cases
       marquées et les mots trouvés sont deux réponses ordinaires, séparées par
       des espaces — donc lisibles par le professeur et transportées comme le
       reste. On n'écrit pas de JSON dans une réponse : le serveur plafonne à
       6 000 signes et une structure imbriquée finirait tronquée sans bruit. */
    Array.prototype.forEach.call(this.hote.querySelectorAll('.ch-meles'), function (g) {
      var cle = g.getAttribute('data-cle');
      var marquees = (self.reponses[cle] || '').split(/\s+/);
      Array.prototype.forEach.call(g.querySelectorAll('.ch-lettre'), function (btn) {
        var rc = btn.getAttribute('data-rc');
        btn.setAttribute('aria-pressed', marquees.indexOf(rc) >= 0 ? 'true' : 'false');
        if (self.lecture) { btn.disabled = true; return; }
        if (btn.getAttribute('data-lie')) return;
        btn.setAttribute('data-lie', '1');
        btn.addEventListener('click', function () {
          var on = btn.getAttribute('aria-pressed') === 'true';
          btn.setAttribute('aria-pressed', on ? 'false' : 'true');
          var lot = [];
          Array.prototype.forEach.call(g.querySelectorAll('.ch-lettre'), function (b2) {
            if (b2.getAttribute('aria-pressed') === 'true') lot.push(b2.getAttribute('data-rc'));
          });
          self.noter(cle, lot.join(' '));
        });
      });
    });
    Array.prototype.forEach.call(this.hote.querySelectorAll('.ch-mots'), function (z) {
      var cle = z.getAttribute('data-cle');
      var trouves = (self.reponses[cle] || '').split(/\s+/);
      Array.prototype.forEach.call(z.querySelectorAll('.ch-mot'), function (btn) {
        var mot = btn.getAttribute('data-mot');
        btn.setAttribute('aria-pressed', trouves.indexOf(mot) >= 0 ? 'true' : 'false');
        if (self.lecture) { btn.disabled = true; return; }
        if (btn.getAttribute('data-lie')) return;
        btn.setAttribute('data-lie', '1');
        btn.addEventListener('click', function () {
          var on = btn.getAttribute('aria-pressed') === 'true';
          btn.setAttribute('aria-pressed', on ? 'false' : 'true');
          var lot = [];
          Array.prototype.forEach.call(z.querySelectorAll('.ch-mot'), function (b2) {
            if (b2.getAttribute('aria-pressed') === 'true') lot.push(b2.getAttribute('data-mot'));
          });
          self.noter(cle, lot.join(' '));
        });
      });
    });

    /* ── LA CORRECTION, APRÈS AVOIR CHERCHÉ ──────────────────────────────────
       Le bouton n'apparaît QUE si le serveur a dit que cet ouvrage a des
       corrections type (`aCorriges`). Les livrets du 2ⁿᵈ cycle n'en portent
       aucune dans leur source : y afficher un bouton qui répond toujours
       « aucune correction » se lirait comme une panne du site, pas comme une
       propriété du cahier.
       Le bouton n'est pas non plus un verrou : il ne cache rien. Le corrigé
       n'est PAS dans la page — il faut aller le chercher, et c'est le serveur
       qui décide de le donner ou non. */
    Array.prototype.forEach.call(this.hote.querySelectorAll('.ch-corr'), function (z) {
      if (!self.aCorriges) { z.innerHTML = ''; return; }
      var pour = z.getAttribute('data-pour');
      if (self.corriges[pour]) {
        z.className = 'ch-corr ch-corr-ouvert';
        z.innerHTML = '<span class="ch-corr-titre">Correction</span><p>'
                    + esc(self.corriges[pour]) + '</p>';
        return;
      }
      if (z.getAttribute('data-lie')) return;
      z.setAttribute('data-lie', '1');
      z.className = 'ch-corr';
      z.innerHTML = '<button type="button" class="ch-corr-btn">Voir la correction</button>'
                  + '<span class="ch-corr-msg"></span>';
      z.querySelector('.ch-corr-btn').addEventListener('click', function () {
        self.demanderCorrige(pour, z);
      });
    });

    // Annotations du professeur, posées sur l'exercice qu'elles visent.
    var zones = this.hote.querySelectorAll('.ch-annot');
    Array.prototype.forEach.call(zones, function (z) {
      var pour = z.getAttribute('data-pour');
      // Le professeur annote un CHAMP ; l'exercice peut en compter plusieurs.
      // On ramasse donc la clé du bloc ET toutes celles qui en descendent,
      // sans quoi son mot resterait invisible (constaté au banc du 26/08).
      var lot = [];
      for (var k in self.annotations) {
        if (k === pour || k.indexOf(pour + '/') === 0) lot.push(self.annotations[k]);
      }
      if (!lot.length) { z.innerHTML = ''; z.className = 'ch-annot'; return; }
      z.className = 'ch-annot ch-annot-pleine';
      z.innerHTML = lot.map(function (a) {
        return '<span class="ch-annot-titre">Ton enseignant</span>'
          + (a.note != null ? '<span class="ch-note">' + esc(a.note) + '/20</span>' : '')
          + '<p>' + esc(a.texte || '') + '</p>';
      }).join('');
    });
  };

  /* ── Demander la correction d'un exercice ─────────────────────────────────
     Deux refus possibles, et il faut les DIRE différemment, sinon l'élève ne
     sait pas s'il doit travailler ou s'il n'y a rien à attendre :
       403 « cherche »  → il n'a pas encore répondu. C'est la règle, pas une
                          panne : on l'invite à répondre d'abord.
       404 « aucun »    → cet exercice n'a pas de correction type — une
                          production écrite n'en a pas, et n'en aura jamais.
     On vérifie aussi côté client avant d'appeler : demander au serveur de
     refuser ce qu'on sait déjà refusé, c'est une requête pour rien sur une
     ligne qui compte chacune des siennes. Le serveur reste seul juge — ce
     contrôle-ci n'est qu'une politesse. */
  Cahier.prototype.demanderCorrige = function (item, zone) {
    var self = this;
    var msg = zone.querySelector('.ch-corr-msg');
    var btn = zone.querySelector('.ch-corr-btn');
    var repondu = false;
    for (var k in this.reponses) {
      if (!String(this.reponses[k] || '').trim()) continue;
      if (k === item || k.indexOf(item + '/') === 0 || item.indexOf(k + '/') === 0) { repondu = true; break; }
    }
    if (!repondu) {
      if (msg) msg.textContent = 'Réponds d’abord — la correction s’ouvre ensuite.';
      return;
    }
    if (btn) { btn.disabled = true; btn.textContent = 'Ouverture…'; }
    fetch(API, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'corrige', token: this.token, item: item })
    }).then(function (r) { return r.json().then(function (j) { return { s: r.status, j: j }; }); })
      .then(function (rep) {
        if (rep.j && rep.j.ok && rep.j.corrige) {
          self.corriges[item] = rep.j.corrige;
          self.peupler();
          return;
        }
        if (btn) { btn.disabled = false; btn.textContent = 'Voir la correction'; }
        if (msg) msg.textContent = (rep.j && rep.j.error) || 'Correction indisponible.';
      })
      .catch(function () {
        if (btn) { btn.disabled = false; btn.textContent = 'Voir la correction'; }
        if (msg) msg.textContent = 'Hors ligne — réessaie quand la connexion revient.';
      });
  };

  global.VRTCahier = Cahier;
  /* Exposé pour le banc : `tests/banc_cles_cahier.cjs` éprouve la règle des
     clés sans navigateur. Ce n'est pas une porte dérobée — c'est une fonction
     pure, sans état, qui ne lit ni n'écrit rien. */
  global.VRTCahierCles = calculerCles;
  global.VRTCahierEmpreinte = empreinte;
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = { Cahier: Cahier, calculerCles: calculerCles, empreinte: empreinte };
  }
})(typeof window !== 'undefined' ? window : globalThis);
