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
    return s || String(b.title || b.titre || '');
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
        self.peupler();
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

  Cahier.prototype.rendre = function () {
    var self = this, h = '', champs = [];
    var cles = calculerCles(this.ouvrage, this.blocs);

    /* COULEUR PAR SÉQUENCE — reprise des cahiers imprimés, où chaque séquence
       a la sienne. Ce n'est pas de l'ornement : sur un cahier de 200 écrans,
       la teinte dit « tu es toujours dans la séquence 3 » sans qu'on ait à
       remonter au titre. On compte les séquences dans l'ORDRE où elles
       passent, plutôt que de lire leur numéro : un cahier qui commence par une
       séquence 0 (évaluation diagnostique) ou qui saute un numéro garderait
       sinon une couleur incohérente. Six teintes, puis on recommence. */
    var seqRang = 0, seqVue = null;

    this.blocs.forEach(function (b, i) {
      if (!b || typeof b !== 'object') return;
      var y = b.y || b.t || '';
      var cleBloc = cles[i];
      if (DIVISIONS[y]) {
        var sig = String(b.no || b.n || b.num || i);
        if (sig !== seqVue) { seqVue = sig; seqRang = (seqRang % 6) + 1; }
      }
      var teinte = seqRang || 1;
      var corps = b.r ? rendreRuns(b.r, cleBloc, champs) : esc(b.txt || '');

      if (ETIQUETTES[y]) {
        /* « Leçon Leçon 1 » — le repère des sources du 1er cycle est le
           libellé entier (« Leçon 1 »), pas le seul numéro, et la pastille y
           ajoutait le sien. On retire donc du repère le mot que la pastille
           dit déjà. Le faire ici plutôt qu'à la publication répare aussi les
           cahiers déjà déposés sur le serveur. */
        var no = String(b.no || b.n || '').trim();
        var mot = ETIQUETTES[y];
        if (no.toLowerCase().indexOf(mot.toLowerCase()) === 0) {
          no = no.slice(mot.length).replace(/^[\s·:.—-]+/, '');
        }
        h += '<h3 class="ch-titre ch-' + esc(y) + '" data-seq="' + teinte + '">'
          +  '<span class="ch-etq">' + esc(mot) + (no ? ' ' + esc(no) : '') + '</span>'
          +  '<span class="ch-titre-t">' + esc(b.title || b.titre || '')
          +  (corps ? ' ' + corps : '') + '</span></h3>';
        return;
      }
      if (y === 'rubriqueH' || y === 'rubrique' || y === 'rubriqueB') {
        h += '<div class="ch-rubrique" data-seq="' + teinte + '">' + corps + '</div>'; return;
      }
      if (y === 'texte' || y === 'corpus' || y === 'corps' || y === 'texteT') {
        h += '<div class="ch-texte" data-seq="' + teinte + '">' + corps + '</div>'; return;
      }
      if (y === 'source') { h += '<p class="ch-source">' + corps + '</p>'; return; }
      if (y === 'image')  {
        var src = b.src || b.d || '';
        h += src ? '<figure class="ch-figure"><img loading="lazy" alt="'
                 + esc(b.cap || '') + '" src="' + esc(src) + '"></figure>' : '';
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

      if (BLOCS_CORRIGE[y]) {
        h += '<details class="ch-corrige"><summary>Voir la correction</summary>'
          +  '<div>' + corps + '</div></details>'; return;
      }
      if (y === 'boxHead' || y === 'taskHead' || y === 'outilT' || y === 'astuce' || y === 'retientT' || y === 'retT') {
        h += '<div class="ch-encadre-t ch-bk-' + esc(b.bk || y) + '">' + corps + '</div>'; return;
      }
      if (y === 'boxBody' || y === 'outilC' || y === 'def'
          || y === 'retientC' || y === 'retC') {
        h += '<div class="ch-encadre-c">' + corps + '</div>'; return;
      }

      // Question / exercice / tâche : le cœur du cahier.
      if (BLOCS_A_REPONSE[y]) {
        var cleRep = cleBloc + '/rep';
        var dejaChamp = champs.some(function (c) { return c.indexOf(cleBloc + '/r') === 0; });
        h += '<div class="ch-exo" data-seq="' + teinte + '" data-bloc="' + esc(cleBloc) + '">'
          +  '<div class="ch-consigne">' + corps + '</div>';
        // Un bloc qui porte déjà ses pointillés n'a pas besoin d'une zone en
        // plus : on ne double pas le champ de réponse.
        if (!dejaChamp) {
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

    this.champs = champs;
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
