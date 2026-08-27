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
     se lit en trois clics dans les outils de développement. */
  var BLOCS_CORRIGE = { retientC: 1, retC: 1, corrige: 1 };

  var ETIQUETTES = {
    module: 'Module', semaine: 'Semaine', lecon: 'Leçon', section: 'Section',
    competence: 'Compétence', objectif: 'Objectif', epreuve: 'Épreuve'
  };

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

    this.rendre();
    this.charger().then(function () { self.pousser(); });
    // Un dernier envoi quand la page se ferme : le différé de 2,5 s ne doit
    // pas coûter la dernière phrase écrite.
    global.addEventListener('pagehide', function () { self.pousser(true); });
    global.addEventListener('visibilitychange', function () {
      if (document.visibilityState === 'hidden') self.pousser(true);
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
    var ctxSeq = '0', ctxLecon = '0', vus = {}, out = [];
    (blocs || []).forEach(function (b) {
      if (!b || typeof b !== 'object') { out.push(null); return; }
      var y = b.y || b.t || '';
      if (y === 'module' || y === 'semaine' || y === 'sem' || y === 'section') {
        ctxSeq = String(b.no || b.n || b.num || empreinte(texteDuBloc(b)));
        ctxLecon = '0'; vus = {};
      } else if (y === 'lecon' || y === 'epreuve') {
        ctxLecon = String(b.no || b.n || b.num || empreinte(texteDuBloc(b)));
        vus = {};
      }
      /* La clé : OÙ l'on est + CE QUE dit l'exercice. Si deux consignes sont
         rigoureusement identiques dans la MÊME leçon (cela arrive :
         « Justifie ta réponse. » deux fois), on suffixe par l'ordre
         d'apparition — la collision reste bornée à ces deux-là, au lieu de
         décaler tout le cahier comme le ferait un compteur. */
      var emp = empreinte(texteDuBloc(b));
      vus[emp] = (vus[emp] || 0) + 1;
      out.push(ouvrage + '/s' + ctxSeq + '/l' + ctxLecon + '/' + emp
             + (vus[emp] > 1 ? '_' + vus[emp] : ''));
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
      if (y === 'module' || y === 'semaine' || y === 'sem' || y === 'section') {
        var sig = String(b.no || b.n || b.num || i);
        if (sig !== seqVue) { seqVue = sig; seqRang = (seqRang % 6) + 1; }
      }
      var teinte = seqRang || 1;
      var corps = b.r ? rendreRuns(b.r, cleBloc, champs) : esc(b.txt || '');

      if (ETIQUETTES[y]) {
        var no = b.no || b.n || '';
        h += '<h3 class="ch-titre ch-' + esc(y) + '" data-seq="' + teinte + '">'
          +  '<span class="ch-etq">' + esc(ETIQUETTES[y]) + (no ? ' ' + esc(no) : '') + '</span> '
          +  esc(b.title || b.titre || '') + (corps ? ' ' + corps : '') + '</h3>';
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
      if (BLOCS_CORRIGE[y]) {
        h += '<details class="ch-corrige"><summary>Voir la correction</summary>'
          +  '<div>' + corps + '</div></details>'; return;
      }
      if (y === 'boxHead' || y === 'taskHead' || y === 'outilT' || y === 'astuce' || y === 'retientT' || y === 'retT') {
        h += '<div class="ch-encadre-t ch-bk-' + esc(b.bk || y) + '">' + corps + '</div>'; return;
      }
      if (y === 'boxBody' || y === 'outilC' || y === 'def') {
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
        h += '<div class="ch-annot" data-pour="' + esc(cleBloc) + '"></div>'
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
        champ.rows = place.classList.contains('ch-champ-large') ? 4 : 2;
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
