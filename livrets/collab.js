/* ══════════════════════════════════════════════════════════════════════════
   livrets/collab.js — CLIENT DU VOLET COLLABORATIF
   © 2024-2026 Jacques Miterand TAKOU (Mythe Errant). Tous droits réservés.

   Partagé par la page de devoir (/d/) et la console enseignant (/livrets/prof.html).
   Dépend de gate.js pour les jetons (un seul mécanisme d'authentification) et
   n'ajoute aucune bibliothèque : ES5, pas de compilation.
   ══════════════════════════════════════════════════════════════════════════ */
(function () {
  'use strict';

  var API = '/api/collab.php';

  function post(corps) {
    return fetch(API, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'omit',
      cache: 'no-store',
      body: JSON.stringify(corps)
    }).then(function (r) {
      return r.json().catch(function () { return {}; }).then(function (j) {
        if (!r.ok || !j.ok) {
          // Idem gate.js : un 200 qui n'est pas notre JSON doit se dire
          // en francais, pas en code HTTP.
          var e = new Error(j.error || (r.ok ? 'Reponse inattendue du serveur — reessaie dans un instant.'
                                             : 'Le serveur a repondu ' + r.status + '.'));
          e.tag = j.code || 'serveur';
          throw e;
        }
        return j;
      });
    }, function () {
      var e = new Error('Connexion impossible. Vérifie ton réseau.');
      e.tag = 'net';
      throw e;
    });
  }

  /** Jeton de livret rangé par gate.js, pour une classe et une nature données. */
  function jeton(classe, kind) {
    try { return localStorage.getItem('vrt-livret-' + classe + '-' + (kind || 'livret')) || ''; }
    catch (e) { return ''; }
  }

  /** Le premier jeton enseignant trouvé, toutes classes confondues : la console
   *  ne sait pas d'avance quel guide le professeur a déverrouillé. */
  function jetonProf() {
    var cl = ['6e', '5e', '4e', '3e', '2nde'];
    for (var i = 0; i < cl.length; i++) {
      var t = jeton(cl[i], 'guide');
      if (t) return { token: t, classe: cl[i] };
    }
    return null;
  }

  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }

  function dateFr(ts) {
    if (!ts) return '';
    var d = new Date(ts * 1000);
    return d.toLocaleDateString('fr-FR', { day: '2-digit', month: 'long', year: 'numeric' });
  }

  /* ── Résolution d'un renvoi au cahier ───────────────────────────────────────
     LE VOLET COLLABORATIF PARLAIT UNE LANGUE MORTE. Tout ce qui suit lisait
     `window.BOOKLET.sequences[].weeks[].items[].flow[]` et repérait un exercice
     par son RANG — `s0.w1.i2.f3`. Ce modèle a disparu le 28/08/2026, quand tous
     les cahiers ont été ramenés à une liste plate de blocs (`CAHIER_BLOCS`).
     Depuis, `refResoudre()` rendait `null` à tous les coups et `livre()`, dans
     la console enseignant, ne trouvait jamais rien : l'enseignant qui a payé son
     guide lisait « Le livret n'est pas encore chargé. Réessayez dans un
     instant » — indéfiniment, pour une attente qui n'aurait jamais fini.
     Personne ne l'a signalé ; le message avait l'air d'un contretemps.

     ON NE REPÈRE PLUS UN EXERCICE PAR SON RANG. Le rang était déjà le mauvais
     choix : ajouter un exercice en tête de leçon décalait toutes les références
     des devoirs déjà distribués, et l'élève ouvrait un autre exercice que celui
     qu'on lui avait donné. `cahier.js` a résolu ce problème pour les réponses —
     une clé stable, faite du contexte et de l'empreinte de l'énoncé, éprouvée
     par `tests/banc_cles_cahier.cjs`. On prend la sienne, telle quelle
     (`window.VRTCahierCles`), au lieu d'en écrire une seconde : le devoir
     désigne alors l'exercice sous le nom exact où l'élève range sa réponse.

     Le serveur ne stocke QUE cette clé : l'énoncé n'est jamais recopié hors du
     cahier, donc un devoir ne peut pas servir à en extraire le contenu. La
     résolution se fait ici, dans les données que l'élève a déjà — c'est-à-dire
     seulement s'il a payé.                                                     */

  /** Les blocs du cahier ouvert, quel que soit l'ouvrage. */
  function blocs() {
    var B = window.CAHIER_BLOCS;
    return Array.isArray(B) ? B : null;
  }

  /** Un bloc du cahier est-il un exercice (et non un titre, un corpus, une
   *  définition) ? Les accessoires — QCM, appariement, lignes — appartiennent à
   *  l'exercice qui les précède ; ils ne se donnent pas séparément. */
  function estExercice(bloc) {
    return !!bloc && bloc.y === 'exercice' && String(bloc.txt || '').trim().length > 8;
  }

  /* Le contexte (séquence · semaine · leçon) d'un exercice ne vit pas dans le
     bloc : il vit dans les titres qui le précèdent. On balaie donc une fois, et
     on garde ce qu'on a croisé en chemin. */
  function inventaire() {
    var B = blocs();
    if (!B) return null;
    if (inventaire._pour === B) return inventaire._out;   // même tableau = même résultat
    var cles = (typeof window.VRTCahierCles === 'function')
      ? window.VRTCahierCles(ouvrageCourant(), B) : null;
    var seq = null, sem = null, lec = null, out = [];
    B.forEach(function (b, i) {
      if (!b || typeof b !== 'object') return;
      if (b.y === 'sequence') { seq = b; sem = null; lec = null; return; }
      if (b.y === 'semaine')  { sem = b; return; }
      if (b.y === 'lecon')    { lec = b; return; }
      if (!estExercice(b)) return;
      out.push({
        cle: cles ? cles[i] : String(i),
        rang: i,
        consigne: String(b.txt || ''),
        num: b.no || '',
        sequence: seq ? ((seq.no ? 'Séq. ' + seq.no + ' — ' : '') + (seq.title || '')) : '',
        seqNo: seq ? String(seq.no || '') : '',
        semaine: sem ? ((sem.no ? 'Sem. ' + sem.no + ' — ' : '') + (sem.title || '')) : '',
        semNo: sem ? String(sem.no || '') : '',
        lecon: lec ? ((lec.no ? lec.no + ' · ' : '') + (lec.title || '')) : ''
      });
    });
    inventaire._pour = B; inventaire._out = out;
    return out;
  }

  /* L'ouvrage sert de préfixe aux clés — c'est ce qui empêche une clé de 6ᵉ
     d'ouvrir un exercice de 5ᵉ. `cahier.html?o=<slug>` le porte dans l'URL ;
     ailleurs (console enseignant, page de devoir) on prend la classe annoncée. */
  var _ouvrage = '';
  function ouvrageCourant(v) {
    if (v) _ouvrage = String(v);
    if (!_ouvrage) {
      try { _ouvrage = new URLSearchParams(location.search).get('o') || ''; } catch (e) { _ouvrage = ''; }
    }
    return _ouvrage;
  }

  function refResoudre(ref) {
    var inv = inventaire();
    if (!inv || !ref) return null;
    for (var i = 0; i < inv.length; i++) if (inv[i].cle === ref) return inv[i];
    return null;
  }

  /** Libellé lisible d'une référence, pour l'aperçu et la console.
   *  Une référence de l'ANCIEN format (`s0.w1.i2`) ne se résout plus — le
   *  modèle qu'elle désignait n'existe pas. On le dit, au lieu d'afficher un
   *  repère inventé : le devoir garde de toute façon son `repere` en clair,
   *  écrit au moment où il a été composé. */
  function refRepere(ref, classe) {
    var r = refResoudre(ref);
    if (!r) return 'Exercice du livret';
    return (classe ? classe + ' · ' : '')
         + (r.sequence ? r.sequence + ' · ' : '')
         + (r.lecon || '')
         + (r.num ? ' · Exercice ' + r.num : '');
  }

  /* ── Parrainage ────────────────────────────────────────────────────────────
     Le lien partagé porte ?p=<identifiant du parrain>. On le retient pour
     l'attribuer si la visite se transforme en achat. Rien d'autre n'est stocké
     sur le visiteur : ni cookie, ni empreinte.                                */
  function parrainLire() {
    try {
      var u = new URLSearchParams(location.search).get('p');
      if (u) { sessionStorage.setItem('vrt-parrain', u); return u; }
      return sessionStorage.getItem('vrt-parrain') || '';
    } catch (e) { return ''; }
  }

  /** Mon identifiant de parrain = celui de mon code (élève OU enseignant). */
  function monId(classe) {
    var t = jeton(classe, 'livret') || jeton(classe, 'guide');
    if (!t) return '';
    try {
      var p = JSON.parse(atob(t.split('.')[0].replace(/-/g, '+').replace(/_/g, '/')));
      return p.id || '';
    } catch (e) { return ''; }
  }

  function lienPartage(token, classe) {
    var id = monId(classe);
    return 'https://veritas-school.com/d/?t=' + encodeURIComponent(token) + (id ? '&p=' + encodeURIComponent(id) : '');
  }

  window.VRTCollab = {
    post: post,
    jeton: jeton,
    jetonProf: jetonProf,
    esc: esc,
    dateFr: dateFr,
    refResoudre: refResoudre,
    refRepere: refRepere,
    estExercice: estExercice,
    inventaire: inventaire,
    ouvrage: ouvrageCourant,
    parrainLire: parrainLire,
    monId: monId,
    lienPartage: lienPartage,

    /** Signale la visite d'un lien parrainé (sans bloquer l'affichage). */
    noterVisite: function () {
      var p = parrainLire();
      if (!p) return;
      try { if (sessionStorage.getItem('vrt-visite-notee') === p) return; } catch (e) {}
      post({ action: 'parrain_visite', parrain: p })
        .then(function () { try { sessionStorage.setItem('vrt-visite-notee', p); } catch (e) {} })
        .catch(function () {});
    },

    /** À appeler après un retrait de code réussi : crédite le parrain. */
    convertir: function (ref) {
      var p = parrainLire();
      if (!p || !ref) return Promise.resolve();
      return post({ action: 'parrain_convertir', ref: ref, parrain: p }).catch(function () {});
    }
  };
})();
