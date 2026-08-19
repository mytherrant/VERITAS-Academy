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

  /* ── Résolution d'un renvoi au livret ───────────────────────────────────────
     Format de référence : s<séquence>.w<semaine>.i<leçon>.f<exercice>.
     Le serveur ne stocke QUE cette référence : l'énoncé n'est jamais recopié
     hors du livret, donc un devoir ne peut pas servir à en extraire le contenu.
     La résolution se fait ici, dans les données que l'élève a déjà — c'est-à-dire
     seulement s'il a payé.                                                      */
  function refParse(ref) {
    var m = /^s(\d+)\.w(\d+)\.i(\d+)(?:\.f(\d+))?$/.exec(String(ref || ''));
    if (!m) return null;
    return { s: +m[1], w: +m[2], i: +m[3], f: m[4] === undefined ? null : +m[4] };
  }

  function refResoudre(ref) {
    var p = refParse(ref);
    if (!p) return null;
    var B = window.BOOKLET || window.BOOKLET_5E || window.BOOKLET_4E || window.BOOKLET_3E;
    if (!B || !B.sequences) return null;
    var seq = B.sequences[p.s];              if (!seq) return null;
    var sem = (seq.weeks || [])[p.w];        if (!sem) return null;
    var lec = (sem.items || [])[p.i];        if (!lec) return null;
    if (p.f === null) {
      return { titre: lec.title || '', consigne: '', lecon: lec.label || '', disc: lec.disc || '',
               semaine: sem.title || '', sequence: seq.title || '' };
    }
    var bloc = (lec.flow || [])[p.f];        if (!bloc) return null;
    // ⚠️ L'énoncé est dans `body`. `t` n'est PAS du texte : c'est un marqueur de
    // type ('exercise' / 'section'). L'afficher écrirait « exercise » à la place
    // de la question — vérifié sur les données réelles.
    return {
      titre: lec.title || '', consigne: bloc.body || bloc.consigne || '',
      num: bloc.num || '', cat: bloc.cat || '',
      lecon: lec.label || '', disc: lec.disc || '',
      semaine: sem.title || '', sequence: seq.title || ''
    };
  }

  /** Un bloc du livret est-il un exercice (et non un titre de section
   *  ni un corpus d'observation) ? */
  function estExercice(bloc) {
    return !!bloc && bloc.t === 'exercise' && String(bloc.body || '').trim().length > 8;
  }

  /** Libellé lisible d'une référence, pour l'aperçu et la console. */
  function refRepere(ref, classe) {
    var p = refParse(ref);
    if (!p) return 'Exercice du livret';
    var r = refResoudre(ref);
    var base = (classe ? classe + ' · ' : '') + 'Séq. ' + (p.s + 1) + ' · Sem. ' + (p.w + 1);
    if (!r) return base + ' · Exercice ' + ((p.f === null ? p.i : p.f) + 1);
    return base + ' · ' + (r.lecon || '') + (r.disc ? ' (' + r.disc + ')' : '')
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
    refParse: refParse,
    estExercice: estExercice,
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
