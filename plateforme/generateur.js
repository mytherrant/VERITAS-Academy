/* ============================================================================
   VÉRITAS — Composition d'épreuves par Ambassa (mode hybride)
   ----------------------------------------------------------------------------
   Les enseignants ne veulent plus composer une épreuve question par question :
   ils veulent qu'Ambassa la rédige EN ENTIER, puis la relire et la corriger.
   Ce module fait ce travail, sans rien retirer au composeur collaboratif :
   tout ce qu'Ambassa produit atterrit dans les mêmes champs que ce qu'un
   collègue saisit à la main, marqué « à relire », modifiable par l'équipe.

   TROIS COUCHES, dans cet ordre :

   1. LE PLAN — calculé ICI, jamais demandé à l'IA. Il dérive de la structure
      officielle (minesec.js) : ce qui porte sur le texte, ce qui est un sujet
      au choix, combien vaut chaque bloc, combien de mots le texte support.
      Une IA qui décide elle-même qu'un BEPC vaut 25 points, ou qu'une série C
      a trois sujets, est pire qu'inutile.

   2. LA RÉDACTION — Ambassa. Elle reçoit le plan, le texte support, et sa
      « formation MINESEC » : le référentiel (structures, grilles, verbes de
      consigne par niveau, formulations proscrites, formules de corrigé) et
      des questions RÉELLES du corpus officiel pour la même classe, qui lui
      montrent le ton et le format attendus. Elle rédige questions, corrigé
      et sujets.

   3. LE CONTRÔLE — ICI encore. On recale le barème au point près sur le plan,
      on recompte les mots d'un résumé, on traque les formulations bannies.
      Ce qui ne passe pas est renvoyé UNE fois à Ambassa pour réécriture ; ce
      qui résiste est signalé à l'enseignant, jamais maquillé.

   Le texte support est CHOISI dans le corpus, jamais inventé : un sujet MINESEC
   porte sur un texte authentique, référencé. Seul le texte fautif d'une
   correction orthographique est fabriqué, et il l'est À PARTIR d'un texte
   authentique du corpus.
   ========================================================================= */

(function (root) {
  'use strict';

  /* ------------------------------------------------------------------
     OUTILS
     ------------------------------------------------------------------ */

  function norm(s) {
    var t = String(s || '').toLowerCase();
    if (t.normalize) t = t.normalize('NFD').replace(/[̀-ͯ]/g, '');
    return t.replace(/['’‘`]/g, ' ').replace(/\s+/g, ' ').trim();
  }

  function compterMots(t) {
    var x = String(t || '').trim();
    return x ? x.split(/\s+/).filter(Boolean).length : 0;
  }

  /* Le proxy borne le prompt en OCTETS (strlen PHP) : un « é » en vaut deux. */
  function octets(s) {
    s = String(s || '');
    if (typeof TextEncoder !== 'undefined') return new TextEncoder().encode(s).length;
    return unescape(encodeURIComponent(s)).length;
  }

  function arrondir(x, pas) {
    pas = pas || 0.5;
    return Math.round(Math.round(x / pas) * pas * 100) / 100;
  }

  function nombre(x) {
    var v = parseFloat(String(x == null ? '' : x).replace(',', '.'));
    return isFinite(v) ? v : null;
  }

  function M(opts) {
    return (opts && opts.minesec) || root.MINESEC;
  }

  /* ------------------------------------------------------------------
     1. LE PLAN DE L'ÉPREUVE
     ------------------------------------------------------------------ */

  /* Nature d'une partie ou d'un segment de consigne, d'après son intitulé. */
  function classer(titre) {
    var t = norm(titre);
    if (/presentation/.test(t)) return 'presentation';
    if (/fautif|correction orthographique/.test(t)) return 'fautif';
    if (/^dictee|dictee$/.test(t)) return 'dictee';
    if (/commentaire/.test(t)) return 'commentaire';
    if (/dissertation|culture generale|culture litteraire/.test(t)) return 'dissertation';
    if (/lettre/.test(t)) return 'lettre';
    if (/rapport|compte rendu/.test(t)) return 'rapport';
    if (/resume|contraction|analyse \(au|analyse au/.test(t)) return 'resume';
    if (/discussion/.test(t)) return 'discussion';
    if (/synthese/.test(t)) return 'synthese';
    if (/essai/.test(t)) return 'essai';
    if (/situation de communication/.test(t)) return 'encadre';
    if (/situation|expression|production/.test(t)) return 'expression';
    if (/comprehension/.test(t)) return 'comp';
    return 'langue';
  }

  /* « Résumé au ¼ /9 · Discussion /9 · Présentation /2 » → segments notés. */
  function segmentsConsigne(consigne) {
    var out = [];
    String(consigne || '').split(/\s*·\s*/).forEach(function (s) {
      var m = s.match(/^(.*?)\s*\/\s*(\d+(?:[.,]\d+)?)\s*\.?$/);
      if (m && m[1].trim()) out.push({ titre: m[1].trim(), points: nombre(m[2]) });
    });
    return out;
  }

  var LIBELLES = {
    resume: 'Résumé du texte', discussion: 'Discussion', synthese: 'Esprit de synthèse',
    essai: 'Essai', expression: 'Expression écrite', presentation: 'Présentation de la copie',
    dissertation: 'Dissertation', commentaire: 'Commentaire composé', lettre: 'Lettre administrative',
    rapport: 'Rapport ou compte rendu', fautif: 'Texte fautif à corriger', dictee: 'Dictée'
  };

  /* Le plan dit, pour une structure officielle :
       support     'texte' | 'fautif' | 'dictee' | 'aucun'
       comp        { points, rubriques:[{titre,points}] }   questions de compréhension
       expl        { points, rubriques:[{titre,points}] }   questions de langue
       productions [{genre,titre,points}]                    consignes d'écriture SUR le texte
       sujets      [{genre,titre,points,auChoix,consigne}]   sujets hors questions
       total       le total attendu (celui du garde-fou)
     La somme comp + expl + productions + sujets non « au choix » = total. */
  function planEpreuve(struct, opts) {
    var ref = M(opts);
    var plan = {
      code: struct ? struct.code : '', nom: struct ? struct.nom : '',
      support: 'aucun',
      texteSupport: struct ? ((ref && ref.texteSupportPour ? ref.texteSupportPour(struct, opts && opts.classe) : struct.texteSupport) || null) : null,
      comp: { points: 0, rubriques: [] }, expl: { points: 0, rubriques: [] },
      productions: [], sujets: [], total: ref ? ref.totalAttendu(struct) : 20,
      encadre: struct ? (struct.encadreSituation || null) : null
    };
    if (!struct) return plan;
    var grille = (struct.grille && ref && ref.grille(struct.grille)) || null;
    /* Parties DE LA CLASSE : la 2nde note la contraction 8 + 10 + 2 (guide du
       2nd cycle), la 1ère et la Terminale 9 + 9 + 2 (Draft EST). */
    var parties = (ref && ref.partiesPour ? ref.partiesPour(struct, opts && opts.classe) : struct.parties) || [];
    var auChoix = (struct.sujetsAuChoix || 1) > 1;

    /* Répartit une liste de segments notés dans le plan (bloc portant sur le texte). */
    function verser(segments) {
      segments.forEach(function (s) {
        var g = classer(s.titre), p = s.points || 0;
        if (g === 'comp') { plan.comp.points += p; plan.comp.rubriques.push({ titre: s.titre, points: p }); }
        else if (g === 'langue') {
          /* « Langue, 4 rubriques × 2 pts /8 » : les rubriques officielles. */
          var r4 = /4 rubriques/.test(norm(s.titre)) && ref && ref.grille('langue4rub2');
          if (r4 && p === 8) {
            r4.criteres.forEach(function (c) { plan.expl.rubriques.push({ titre: c.nom, points: c.points }); });
          } else plan.expl.rubriques.push({ titre: s.titre, points: p });
          plan.expl.points += p;
        }
        else if (g === 'presentation') plan.sujets.push({ genre: 'presentation', titre: LIBELLES.presentation, points: p, auChoix: false });
        else if (g === 'encadre') { /* 0 point : décrit l'encadré, pas un bloc noté */ }
        else plan.productions.push({ genre: g, titre: LIBELLES[g] || s.titre, points: p });
      });
    }

    if (!auChoix) {
      var g0 = parties.length === 1 ? classer(parties[0].titre) : '';
      if (g0 === 'fautif') {
        plan.support = 'fautif';
        plan.sujets.push({ genre: 'fautif', titre: LIBELLES.fautif, points: parties[0].points || 20, auChoix: false,
                           consigne: parties[0].consigne || '' });
        return plan;
      }
      if (g0 === 'dictee') {
        plan.support = 'dictee';
        plan.sujets.push({ genre: 'dictee', titre: LIBELLES.dictee, points: parties[0].points || 20, auChoix: false });
        return plan;
      }
      var surTexte = parties.some(function (p) { var g = classer(p.titre); return g === 'comp' || g === 'langue'; });
      if (!struct.texteSupport && !surTexte) {
        /* Expression écrite sans texte : une situation-problème. */
        parties.forEach(function (p) {
          var g = classer(p.titre);
          if (g === 'encadre' || !p.points) return;
          plan.sujets.push({ genre: g === 'langue' || g === 'comp' ? 'expression' : g,
                             titre: g === 'expression' ? 'Situation-problème' : (LIBELLES[g] || p.titre),
                             points: p.points, auChoix: false, consigne: p.consigne || '' });
        });
        return plan;
      }
      plan.support = 'texte';
      /* Étude de texte dont le descriptif ne fixe pas la longueur (CAP
         industriel) : la norme de l'étude de texte du même niveau. */
      if (!plan.texteSupport) plan.texteSupport = { min: 150, max: 300, unite: 'mots', nature: 'texte contemporain de compréhension aisée' };
      /* Parties officielles portant sur le texte. Une partie seule et riche
         (« Exploitation de texte » /20) se décompose par sa consigne. */
      var segs = [];
      parties.forEach(function (p) {
        var sc = segmentsConsigne(p.consigne);
        var somme = sc.reduce(function (a, s) { return a + (s.points || 0); }, 0);
        if (sc.length > 1 && Math.abs(somme - (p.points || 0)) < 0.01) segs = segs.concat(sc);
        else segs.push({ titre: p.titre, points: p.points || 0 });
      });
      verser(segs);
      /* L'étude de texte du 1er cycle : 2 rubriques de 10 sans détail. */
      if (plan.comp.rubriques.length === 1) plan.comp.rubriques = [];
      if (plan.expl.rubriques.length === 1) plan.expl.rubriques = [];
      return plan;
    }

    /* Sujets au choix : le premier porte sur le texte quand il y en a un,
       les suivants sont des sujets de rédaction à 20 points chacun. */
    parties.forEach(function (p, i) {
      if (i === 0 && struct.texteSupport) {
        plan.support = 'texte';
        var sc = segmentsConsigne(p.consigne);
        var somme = sc.reduce(function (a, s) { return a + (s.points || 0); }, 0);
        if (!(sc.length > 1 && Math.abs(somme - (p.points || 0)) < 0.01) && grille && grille.criteres) {
          sc = grille.criteres.map(function (c) { return { titre: c.nom, points: c.points }; });
        }
        verser(sc);
        if (plan.comp.rubriques.length === 1) plan.comp.rubriques = [];
        if (plan.expl.rubriques.length === 1) plan.expl.rubriques = [];
        plan.sujetTexte = p.titre;
        return;
      }
      var g = classer(p.titre);
      plan.sujets.push({ genre: (g === 'langue' || g === 'comp') ? 'dissertation' : g,
                         titre: p.titre, points: p.points || 20, auChoix: true, consigne: p.consigne || '' });
    });
    return plan;
  }

  /* Total effectivement noté : questions + sujets imposés. Quand TOUS les
     sujets sont au choix et qu'aucune question ne porte sur un texte (BP,
     ENIET 3e année), le candidat traite un seul sujet : c'est lui qui fait
     la note. */
  function totalNote(ptsQuestions, sujets) {
    var t = ptsQuestions || 0, imposes = 0, maxChoix = 0;
    (sujets || []).forEach(function (s) {
      var p = nombre(s.pts != null ? s.pts : s.points) || 0;
      if (s.auChoix) maxChoix = Math.max(maxChoix, p); else imposes += p;
    });
    t += imposes;
    if (!t && maxChoix) t = maxChoix;
    return Math.round(t * 100) / 100;
  }

  /* Les blocs notés du plan, avec leur cible : c'est sur eux que le barème
     sera recalé, au demi-point près. */
  function blocsDuPlan(plan) {
    var b = [];
    if (plan.comp.points) {
      if (plan.comp.rubriques.length) plan.comp.rubriques.forEach(function (r, i) { b.push({ cle: 'c' + i, kind: 'comp', titre: r.titre, points: r.points }); });
      else b.push({ cle: 'comp', kind: 'comp', titre: 'Compréhension', points: plan.comp.points });
    }
    if (plan.expl.points) {
      if (plan.expl.rubriques.length) plan.expl.rubriques.forEach(function (r, i) { b.push({ cle: 'r' + i, kind: 'expl', titre: r.titre, points: r.points }); });
      else b.push({ cle: 'expl', kind: 'expl', titre: 'Langue', points: plan.expl.points });
    }
    plan.productions.forEach(function (p, i) { b.push({ cle: 'p' + i, kind: 'expl', titre: p.titre, points: p.points, production: p.genre }); });
    return b;
  }

  /* ------------------------------------------------------------------
     2. LE CHOIX DU TEXTE SUPPORT
     ------------------------------------------------------------------ */

  /* Les classes et les niveaux du corpus ne s'écrivent pas pareil : « 1ère »
     et « 1ere - Tle », « Terminale technique » et « Tle F/AF/CI - STT ». On
     ramène les deux à des jetons comparables. */
  function jetonsNiveau(s) {
    var t = norm(s), out = [];
    var m = t.match(/\b([3-6])e\b/g);
    if (m) m.forEach(function (x) { out.push(x.charAt(0)); });
    if (/2nde|seconde/.test(t)) out.push('2nde');
    if (/1ere|premiere/.test(t)) out.push('1ere');
    if (/\btle\b|terminale/.test(t)) out.push('tle');
    if (/technique|stt|\bf\b|af|ci|bt|cap|bep|\bbp\b|eniet|capiet/.test(t)) out.push('tech');
    return out;
  }

  /* Classes du technique sans équivalent dans le corpus : on les rapproche
     du niveau le plus voisin plutôt que de ne rien proposer. */
  function niveauxCibles(classe) {
    var j = jetonsNiveau(classe);
    var t = norm(classe);
    if (/4e annee technique|cap/.test(t)) return ['3', 'tech'];
    if (/eniet 1|bep|\bbp\b/.test(t)) return ['3', '2nde', 'tech'];
    if (/eniet|capiet/.test(t)) return ['2nde', '1ere', 'tech'];
    return j.length ? j : [];
  }

  var TYPES_PREFERES = {
    resume: ['ARGUMENTATIF', 'EXPLICATIF'],
    discussion: ['ARGUMENTATIF', 'EXPLICATIF'],
    synthese: ['ARGUMENTATIF', 'EXPLICATIF'],
    essai: ['ARGUMENTATIF', 'EXPLICATIF'],
    fautif: ['NARRATIF', 'DESCRIPTIF', 'EXPLICATIF'],
    dictee: ['NARRATIF', 'DESCRIPTIF'],
    commentaire: ['POÉTIQUE', 'NARRATIF', 'DESCRIPTIF']
  };

  /* Classe le corpus pour une épreuve. On ne filtre pas en dur : un texte
     un peu hors longueur vaut mieux que rien quand le corpus est maigre pour
     une classe ; mais il passe derrière tout ce qui est dans la norme.
     opts : classe, theme, exclure (numéros déjà travaillés), genre, bornes
     {min,max}, alea. */
  /* SCORIES D'OCR. Quelques textes du domaine public gardent des lettrines
     détachées de leur mot (« qu'ils euvent faire. p Avant que… ») : une
     consonne minuscule isolée, qui n'existe pas en français. Mesuré le
     27/09/2026 sur les 1 014 textes libres : 6 textes dépassent 0,8 %
     (tous des maximes), le suivant est à 0,3 % (un « t » cité). Ambassa ne
     les choisit plus d'elle-même ; l'équipe peut toujours les ajouter. */
  function scoriesOCR(texte) {
    var w = String(texte || '').split(/\s+/).filter(Boolean);
    if (w.length < 40) return 0;
    var n = 0;
    w.forEach(function (x) { if (/^[b-df-hj-np-tv-xz]$/.test(x)) n++; });
    return n / w.length;
  }

  function classerTextes(all, opts) {
    opts = opts || {};
    var cibles = niveauxCibles(opts.classe || '');
    var bornes = opts.bornes || null;
    var types = TYPES_PREFERES[opts.genre] || opts.types || null;
    var motsTheme = norm(opts.theme || '').split(' ').filter(function (w) { return w.length > 3; });
    var exclure = {};
    (opts.exclure || []).forEach(function (n) { exclure[n] = 1; });
    var alea = opts.alea || Math.random;
    var out = [];
    /* LES TEXTES SUIVENT L'ABONNEMENT. Le serveur marque chaque fiche selon
       la formule du compte (`_libre === false` : fermée pour lui). Ambassa ne
       compose QUE sur des textes ouverts ; mais on compte les fiches fermées
       qui auraient convenu (bon niveau, longueur officielle), pour pouvoir
       dire à l'enseignant ce que sa formule lui laisse de côté. */
    var fermesConformes = 0;
    (all || []).forEach(function (f) {
      if (f && f._libre === false) {
        var nf = f.words || compterMots(f.text);
        var jf = jetonsNiveau(f.level);
        var bonNiveau = !cibles.length || cibles.some(function (c) { return c !== 'tech' && jf.indexOf(c) >= 0; });
        if (bonNiveau && (!bornes || (nf >= bornes.min && nf <= bornes.max))) fermesConformes++;
        return;
      }
      if (!f) return;
      if (!f.text && !f._partiel) return;
      if (scoriesOCR(f.text) > 0.008) return;
      var score = 0, raisons = [];
      var jn = jetonsNiveau(f.level);
      var commun = cibles.filter(function (c) { return jn.indexOf(c) >= 0 && c !== 'tech'; });
      if (commun.length) { score += 30; raisons.push('niveau ' + (f.level || '')); }
      else if (cibles.length && jn.length) score -= 25;
      if (cibles.indexOf('tech') >= 0 && jn.indexOf('tech') >= 0) score += 6;
      var n = f.words || compterMots(f.text);
      if (bornes) {
        if (n >= bornes.min && n <= bornes.max) { score += 40; raisons.push(n + ' mots (norme ' + bornes.min + '-' + bornes.max + ')'); }
        else {
          var ecartMots = n < bornes.min ? bornes.min - n : n - bornes.max;
          score -= Math.min(60, Math.round(ecartMots / Math.max(10, bornes.min) * 60));
        }
      }
      if (types && types.indexOf(String(f.type || '').toUpperCase()) >= 0) { score += 12; raisons.push(String(f.type).toLowerCase()); }
      /* CONTRACTION (Probatoire / BAC) : un texte ARGUMENTATIF OU EXPLICATIF
         en français contemporain (Draft EST ; précision de Jacques, 16/10/2026 :
         l'explicatif vaut l'argumentatif, à égalité). Le bonus de type ne suffisait pas : une
         scène de théâtre de Labiche (XIXᵉ s., typée « explicatif ») passait
         devant, faute d'argumentatif assez long (16/10/2026). */
      if (opts.genre === 'resume' || opts.genre === 'discussion') {
        var ty = String(f.type || '').toUpperCase();
        if (ty === 'ARGUMENTATIF') score += 35;
        else if (ty === 'EXPLICATIF') score += 35;
        else score -= 45;
        if (/th[ée][aâ]tre|sc[eè]ne|acte\s+[ivx]/i.test(String(f.title || '') + ' ' + String(f.reference || ''))) score -= 40;
        if (bornes && /contemporain/.test(norm(bornes.nature || '')) && f.src === 'libre') score -= 30;
      }
      if (motsTheme.length) {
        var hay = norm([f.group, f.faits, f.title, f.text].join(' '));
        var touches = motsTheme.filter(function (w) { return hay.indexOf(w) >= 0; }).length;
        if (touches) { score += 10 * touches; raisons.push('thème'); }
      }
      if (f.subkind === 'evaluation') score += 4;
      if (exclure[f.n]) score -= 20;
      /* Un peu de hasard entre textes équivalents : « Régénérer » doit
         pouvoir proposer autre chose que le même texte à chaque fois. */
      score += alea() * 6;
      out.push({ f: f, score: score, raisons: raisons, mots: n });
    });
    out.sort(function (a, b) { return b.score - a.score; });
    out.fermesConformes = fermesConformes;
    return out;
  }

  /* Deux jeux de questions RÉELLES du corpus officiel pour la même classe :
     c'est l'entraînement d'Ambassa. Elle y voit la forme exacte d'une
     question MINESEC — numérotation, verbes, longueur — plutôt que de la
     deviner. On évite le texte support lui-même (ses questions sont données
     à part) et on privilégie les fiches d'évaluation. */
  function exemplesOfficiels(all, classe, exclureN, combien) {
    var cibles = niveauxCibles(classe || '');
    var liste = (all || []).filter(function (f) {
      if (!f || f.n === exclureN || !f.comprehension || !f.exploitation) return false;
      if (!cibles.length) return true;
      var jn = jetonsNiveau(f.level);
      return cibles.some(function (c) { return c !== 'tech' && jn.indexOf(c) >= 0; });
    });
    liste.sort(function (a, b) {
      return (b.subkind === 'evaluation') - (a.subkind === 'evaluation') || a.n - b.n;
    });
    /* On répartit dans la liste plutôt que de prendre les deux premiers :
       deux fiches voisines portent souvent le même module. */
    var k = combien || 2, out = [];
    for (var i = 0; i < k && liste.length; i++) {
      out.push(liste[Math.floor(i * liste.length / k)]);
    }
    return out;
  }

  /* ------------------------------------------------------------------
     3. LA FORMATION D'AMBASSA — son référentiel MINESEC
     ------------------------------------------------------------------
     Envoyée en consigne système : elle ne compte pas dans le plafond du
     prompt, qui reste ainsi disponible pour le texte support. */

  /* Les œuvres au programme vivent dans le référentiel (MINESEC.oeuvres,
     relevé du 16/10/2026 sur le programme et la bibliothèque de Jacques). */
  function oeuvresDe(ref, classe) {
    return ref && ref.oeuvresDe ? ref.oeuvresDe(classe) : [];
  }
  function en2nde(ref, classe) {
    return !!(ref && ref.cleClasse && ref.cleClasse(classe) === '2nde');
  }

  /* Le second cycle compose au VOUVOIEMENT (« Résumez », « Discutez »,
     « Vous montrerez ») : c'est la langue des sujets de Probatoire et de
     BAC. Le premier cycle garde la 2e personne du singulier. */
  function secondCycle(struct, classe) {
    var c = norm((struct && struct.cycle) || '') + ' ' + norm(classe || '');
    return /second|2nde|seconde|1ere|premiere|terminale|\btle\b/.test(c);
  }

  /* Une épreuve « de réflexion » : contraction, commentaire, dissertation —
     des SUJETS, pas un questionnaire sur le texte. */
  function epreuveDeReflexion(plan) {
    return !!plan && !plan.comp.points && !plan.expl.points
      && (plan.productions.length || plan.sujets.some(function (s) { return /commentaire|dissertation|essai/.test(s.genre); }));
  }

  /* Barèmes des GRILLES OFFICIELLES (Draft EST, corrigés harmonisés OBC),
     relevés le 16/10/2026. Une seule source : la formation les montre à
     Ambassa, la validation les REPOSE quand son corrigé les tronque ou les
     fausse — on ne signale pas à l'enseignant ce qu'on sait réparer. */
  var BAREMES = {
    resume: 'Barème : compréhension et pertinence 3 pts (texte réduit 1, fidélité au texte 1, proportions respectées 1) + cohérence et technique 3 pts (ordre des idées et système d’énonciation 1, enchaînement et connecteurs 1, idées convergentes 1) + expression 3 pts (vocabulaire personnel 1, orthographe et grammaire 1, syntaxe 1)',
    resume2nde: 'Barème : compréhension 3 pts (fidélité au texte 1,5, reformulation exacte des idées 1,5) + technique du résumé 3 pts (chronologie des idées et système d’énonciation 1, cohérence et cohésion 1, limites du nombre de mots 1) + expression 2 pts (accords et vocabulaire 1, syntaxe, temps et modes 1)',
    discussion2nde: 'Barème : compréhension du sujet 4 pts (thèse reformulée, développée et illustrée 2, antithèse développée 2) + organisation et cohérence 3 pts (enchaînement logique 1,5, cohésion 1,5) + expression 3 pts (accords et vocabulaire 1,5, syntaxe, temps et modes 1,5)',
    discussion: 'Barème : compréhension et pertinence 3 pts (type de production 1, reformulation et problématique 1, arguments et exemples pertinents 1) + organisation et cohérence 3 pts (introduction-développement-conclusion 1, enchaînement et connecteurs 1, cohésion 1) + expression 3 pts (vocabulaire 1, orthographe 1, syntaxe 1)',
    commentaire2nde: 'Barème : compréhension et pertinence 6 pts (centres d’intérêt dégagés 2, plan détaillé pertinent lié aux faits de langue 4) + organisation et cohérence 6 pts (progression des idées 3, congruence centre d’intérêt – idées – moyens d’expression 3) + expression 6 pts (vocabulaire et orthographe 3, syntaxe, temps et modes 3) + originalité et présentation 2 pts',
    commentaire: 'Barème : compréhension et pertinence 6 pts (idées directrices pertinentes 2, arguments adéquats 2, illustrations justes 2) + organisation et cohérence 6 pts (congruence 2, articulation par connecteurs 2, progression vers le thème structurateur 2) + expression 6 pts (vocabulaire 2, orthographe et grammaire 2, syntaxe, temps et modes 2) + originalité et présentation 2 pts',
    dissertation: 'Barème : compréhension et pertinence 6 pts (type de production 2, reformulation et problématique 2, arguments et exemples pertinents 2) + organisation et cohérence 6 pts (structure 2, enchaînement et connecteurs 2, convergence 2) + expression 6 pts (vocabulaire 2, orthographe 2, syntaxe, temps et modes 2) + originalité et présentation 2 pts'
  };

  function formationMinesec(struct, plan, classe, exemples, opts) {
    var ref = M(opts);
    var l = [];
    var vous = secondCycle(struct, classe);
    var reflexion = epreuveDeReflexion(plan);
    /* Sans plan, on ne sait pas : on garde TOUTES les exigences du
       questionnaire plutôt que d'en perdre en silence (banc ①, 16/10). */
    var avecQuestions = !plan || !!(plan.comp.points || plan.expl.points);
    l.push('RÔLE : tu composes, pour un collègue du MINESEC (Cameroun), une ÉPREUVE DE FRANÇAIS prête à être relue puis imprimée. Tu travailles comme un inspecteur concepteur de sujets d’examen : sobre, précis, conforme au Draft EST et aux corrigés harmonisés OBC.');
    l.push('');
    l.push('EXIGENCES MINESEC — elles font foi sur toute autre habitude :');
    if (struct) {
      l.push('- Épreuve : ' + struct.nom + ' (' + struct.examen + ', ' + struct.cycle + '). Durée ' + struct.duree + ', coefficient ' + struct.coeff + ', ' + struct.sujetsAuChoix + ' sujet(s) au choix.');
      if ((struct.sujetsAuChoix || 1) > 1) {
        l.push('- STRUCTURE : « Le candidat traitera l’un des ' + struct.sujetsAuChoix + ' sujets au choix. » Chaque sujet est COMPLET et noté sur 20 ; aucun n’est obligatoire, il n’y a ni « première partie » ni « seconde partie ». La consigne générale reprend cette phrase mot pour mot.');
      }
      var tsp = (plan && plan.texteSupport) || struct.texteSupport;
      if (tsp) l.push('- Texte support : ' + tsp.min + ' à ' + tsp.max + ' mots' + (tsp.nature ? ', ' + tsp.nature : '') + '.');
      if (struct.grille === 'langue4rub5' || struct.grille === 'resumeLangue1082') {
        l.push('- ÉPREUVE DE LANGUE (Draft EST ; ' + 'guide pédagogique du 2nd cycle' + ') : « Les questions posées renvoient au repérage, à l’analyse et à l’interprétation. » Dans chaque rubrique, TROIS sous-questions dans cet ordre : a. REPÉRER ou IDENTIFIER le fait de langue dans le texte (« Relevez… », « Identifiez… ») ; b. L’ANALYSER — nature, fonction, construction, valeur (« Précisez la nature… », « Analysez la construction… ») ; c. L’INTERPRÉTER — l’effet de sens qu’il produit dans CE texte (« Interprétez… », « Dégagez l’effet… »).');
        l.push('  Aucune question théorique (ni définition, ni règle à réciter). Les questions portent OBLIGATOIREMENT sur les contenus enseignés et sur des aspects importants du texte ; les phrases visées se citent entre « » mot pour mot.'
          + (en2nde(ref, classe) ? ' En 2nde : 5 à 6 questions au total, sur les rubriques significatives du texte.' : ' En 1ère et en Terminale : les QUATRE rubriques sont obligatoires.'));
        l.push('  Corrigé de chaque sous-question : la réponse attendue, précise, avec la citation exacte ; pour c., l’effet de sens rédigé en une ou deux phrases.');
      }
      (struct.parties || []).forEach(function (p) {
        l.push('- Partie « ' + p.titre + ' »' + (p.points ? ' /' + p.points : '') + (p.consigne ? ' : ' + p.consigne : ''));
      });
      (struct.interdits || []).forEach(function (x) { l.push('- INTERDIT : ' + x); });
      if (struct.note) l.push('- À savoir : ' + struct.note);
      /* Une structure incertaine se DIT à Ambassa, pour qu'il s'y tienne ;
         l'Atelier l'affiche déjà à l'enseignant : pas d'écho en remarques. */
      if (struct.avertissement) l.push('- RÉSERVE OFFICIELLE (déjà affichée à l’enseignant, ne la recopie pas dans "remarques") : ' + struct.avertissement);
      (struct.consignesRedaction || []).forEach(function (x) { l.push('- ' + x); });
    }
    var g = struct && struct.grille && ref ? ref.grille(struct.grille) : null;
    if (g) {
      l.push('- Grille de correction « ' + g.nom + ' » : ' + g.criteres.map(function (c) {
        return c.nom + ' ' + c.points + (c.nombre ? ' × ' + c.nombre : '');
      }).join(' ; ') + (g.note ? '. ' + g.note : '') + '.');
    }
    l.push('- Langue des consignes : ' + (vous
      ? 'VOUVOIEMENT, comme aux examens du second cycle (« Résumez », « Discutez », « Vous montrerez », « Vous appuierez votre réflexion… »). Jamais « tu ».'
      : '2e personne du singulier, comme aux épreuves du premier cycle (« Relève », « Explique »).'));

    /* ── Questionnaire sur le texte : seulement s'il y en a un ── */
    var q = ref && ref.questionnement;
    if (q && avecQuestions) {
      l.push('');
      l.push('QUESTIONNEMENT (mesuré sur les 3 372 questions du corpus officiel) :');
      q.niveaux.forEach(function (nv) {
        l.push('- ' + nv.nom + ' : ' + nv.role + ' Verbes : ' + nv.verbes.map(function (v) { return v.v; }).join(', ') + '. Ex. : ' + nv.exemple);
      });
      l.push('- Progression obligatoire : du repérage vers l’interprétation. Équilibre des points : repérage ' + q.equilibre.reperage.join('-') + ' %, analyse ' + q.equilibre.analyse.join('-') + ' %, interprétation ' + q.equilibre.interpretation.join('-') + ' %.');
      l.push('- Chaque question commence par un verbe de consigne à l’impératif ou par « Quel/Quelle ». Une question = une tâche vérifiable.');
    }
    var bannies = [];
    if (ref && ref.formulations) bannies = bannies.concat(ref.formulations.questionsBannies || []);
    if (q) bannies = bannies.concat(q.aEviter || []);
    if (bannies.length && avecQuestions) {
      l.push('- FORMULATIONS PROSCRITES, sous aucune forme : ' + bannies.map(function (b) { return '« ' + b.motif + ' »'; }).join(', ') + '.');
    }
    if (avecQuestions) l.push('- La partie langue évalue l’USAGE (repérer, transformer, remplacer, réécrire) sur des phrases DU TEXTE, citées entre guillemets. Jamais de définition ni de règle à réciter.');
    if (ref && ref.formulations && ref.formulations.formulesCorrige) {
      var fc = ref.formulations.formulesCorrige;
      l.push('- Formules du corrigé harmonisé, à placer à la FIN du corrigé concerné (pas dans les remarques) : « ' + fc.bepc + ' » (1er cycle) ; « ' + fc.dissertation + ' » (sujets de réflexion) ; « ' + fc.commentaire + ' » (commentaire).');
    }
    if (ref && ref.formulations && ref.formulations.consignesGenerales) {
      ref.formulations.consignesGenerales.forEach(function (x) { l.push('- ' + x); });
    }
    if (exemples && exemples.length && avecQuestions) {
      l.push('');
      l.push('EXEMPLES RÉELS du corpus officiel pour cette classe — imite leur forme, pas leur contenu :');
      exemples.forEach(function (f, i) {
        l.push('Exemple ' + (i + 1) + ' (' + (f.level || '') + ', ' + String(f.type || '').toLowerCase() + ')');
        l.push('  Compréhension : ' + String(f.comprehension).slice(0, 420));
        l.push('  Langue et production : ' + String(f.exploitation).slice(0, 420));
      });
    }

    /* ── Sujets de réflexion du second cycle : guide pédagogique du second
       cycle (IGE) et Draft EST. Les barèmes sont ceux des GRILLES
       OFFICIELLES (3 critères × 3 pts pour le résumé et la discussion ;
       6/6/6/2 pour le commentaire et la dissertation), relevées le
       16/10/2026 dans les documents de Jacques. ── */
    var seconde = en2nde(ref, classe);
    if (reflexion || (plan && plan.sujets.some(function (s) { return /commentaire|dissertation/.test(s.genre); }))) {
      l.push('');
      l.push('SUJETS DE RÉFLEXION — guide pédagogique du second cycle et Draft EST :');
      if (plan && plan.productions.some(function (p) { return p.genre === 'resume'; })) {
        var tsc = plan.texteSupport;
        var ptsR = seconde ? 8 : 9;
        l.push('- CONTRACTION DE TEXTE (résumé ou analyse /' + ptsR + ') : texte ARGUMENTATIF OU EXPLICATIF d’actualité, sans grande difficulté de compréhension (jeunesse, immigration, chômage, sports et loisirs, TIC…)' + (tsc ? ', de ' + tsc.min + ' à ' + tsc.max + ' mots' : '') + '. Le libellé dit la NATURE du travail, le NOMBRE EXACT de mots du texte et la réduction : « Ce texte compte N mots. Résumez-le au quart de sa longueur, soit environ X mots, ou analysez-le au tiers, soit environ Y mots. Une marge de 10 % en plus ou en moins est admise. Vous indiquerez à la fin de votre travail le nombre de mots employés. »');
        l.push('  Résumé : ordre des idées ET système d’énonciation de l’auteur conservés. Analyse : système énonciatif CHANGÉ (distanciation), ordre libre, liens logiques mis en évidence. Techniques : pronominalisation, nominalisation, phrase complexe réduite (relative → adjectif, complétive → groupe nominal, circonstancielle → groupe prépositionnel).');
        l.push('  Corrigé : (1) thème, thèse, système d’énonciation et structure argumentative du texte ; (2) les idées essentielles, numérotées dans l’ordre de l’auteur ; (3) un RÉSUMÉ MODÈLE rédigé au quart, avec son nombre de mots entre parenthèses ; (4) « ' + (seconde ? BAREMES.resume2nde : BAREMES.resume) + ' ».');
      }
      if (plan && plan.productions.some(function (p) { return p.genre === 'discussion'; })) {
        l.push('- DISCUSSION (/' + (seconde ? 10 : 9) + ') — mini-dissertation qui prend appui sur le texte : le libellé formule, À PARTIR DU TEXTE, une question qui pose un problème dont le texte éclaire au moins un aspect. Elle porte SOIT sur un problème abordé dans le texte, SOIT sur un passage précis — alors cité MOT POUR MOT entre « ». Puis : « Vous exprimerez un avis argumenté, en vous appuyant sur votre expérience et sur vos lectures. » Ce n’est pas une reprise du texte. AUCUNE limite de mots.');
        l.push('  Corrigé : reformulation du sujet et problématique, plan détaillé (thèse puis antithèse, arguments et exemples précis), introduction RÉDIGÉE ; « ' + (seconde ? BAREMES.discussion2nde : BAREMES.discussion) + ' ».');
      }
      if (plan && plan.sujets.some(function (s) { return s.genre === 'commentaire'; })) {
        if (seconde) {
          l.push('- COMMENTAIRE COMPOSÉ EN 2NDE (/20) : TEXTE 2, EXTRAIT D’UNE ŒUVRE INTÉGRALE AU PROGRAMME de la classe, de 200 à 250 mots (20 à 30 lignes ou vers ayant une unité de sens). Le sujet le situe dans l’œuvre (titre, auteur), sans rien inventer de l’intrigue. En 2nde on s’arrête au PLAN DÉTAILLÉ. La consigne ne recopie pas le texte : « 1. Exprimez le thème du texte. 2. Dégagez deux ou trois centres d’intérêt et présentez-les en plan détaillé : idées directrices, idées secondaires, moyens d’expression. »');
          l.push('  Corrigé : le thème ; pour chaque centre d’intérêt, ses idées directrices, ses idées secondaires et leurs moyens d’expression (procédé nommé + citation EXACTE) ; « ' + BAREMES.commentaire2nde + ' ».');
        } else {
          l.push('- COMMENTAIRE COMPOSÉ (/20) : TEXTE 2, EXTRAIT D’UNE ŒUVRE INTÉGRALE AU PROGRAMME de la classe, de 200 à 250 mots (20 à 30 lignes ou une vingtaine de vers). Exercice écrit, entièrement rédigé, « composé » : il regroupe en deux ou trois centres d’intérêt au lieu de suivre le texte, sans séparer le fond de la forme. La consigne ne recopie PAS le texte (il est imprimé à part) et reste non contraignante : « Vous ferez de ce texte un commentaire composé. Vous pourrez, par exemple, montrer comment … et analyser … » — deux ou trois centres d’intérêt complémentaires.');
          l.push('  Corrigé : situation du texte, thème et problématique, introduction RÉDIGÉE, plan détaillé en deux ou trois centres d’intérêt où chaque idée s’appuie sur un procédé nommé et une citation EXACTE, conclusion ; « ' + BAREMES.commentaire + ' ».');
        }
      }
      if (plan && plan.sujets.some(function (s) { return s.genre === 'dissertation'; })) {
        l.push('- DISSERTATION (/20) : un JUGEMENT ou une OPINION sur un problème littéraire, artistique ou général (monde contemporain), suivi d’une CONSIGNE (« Vous expliquerez, puis discuterez… », « Vous apprécierez… »). Le type de sujet — dialectique, analytique ou mixte — commande le plan. N’attribue JAMAIS une phrase à un auteur réel si tu n’es pas certain de ses mots : formule une affirmation non attribuée (« On a pu dire que… »). Évite les sujets rebattus sans angle.');
        l.push('  Corrigé : analyse des termes et problématique ; introduction RÉDIGÉE (amener le sujet, le citer, poser le problème, annoncer le plan) ; plan détaillé illustré d’exemples tirés des œuvres au programme de la classe (liste ci-dessous) ; conclusion (rappel de la problématique, bilan, ouverture) ; « ' + BAREMES.dissertation + ' ».');
      }
      l.push('- PRÉSENTATION ET PERFECTIONNEMENT (/2) : mise en page, propreté, lisibilité de toute la copie — elle ne se rédige pas comme un sujet.');
      l.push('- VÉRIFIÉ AUTOMATIQUEMENT après toi, et signalé à l’enseignant : le résumé modèle est RECOMPTÉ mot à mot (écris-le en un seul paragraphe suivi de « (N mots) ») ; chaque ligne « Barème : … » est ADDITIONNÉE (les points hors parenthèses doivent faire 9 ou 20) ; tout tutoiement est refusé ; toute œuvre d’une autre classe est refusée ; toute citation attribuée à un auteur est signalée « à vérifier ».');
    }

    /* ── Les œuvres au programme de la classe ── */
    var oeuvres = oeuvresDe(ref, classe);
    if (oeuvres.length) {
      l.push('');
      l.push('ŒUVRES INTÉGRALES AU PROGRAMME (' + classe + ') : ' + oeuvres.map(function (o) {
        return '« ' + o.titre + ' », ' + o.auteur + (o.genre ? ' (' + o.genre + ')' : '');
      }).join(' ; ') + '.');
      l.push('- Un sujet, un exemple ou un corrigé qui renvoie à une œuvre étudiée ne cite QUE celles-ci, jamais une œuvre d’une autre classe — aucune œuvre du 1er cycle au 2nd cycle.');
      l.push('- Ne recopie aucun passage d’une œuvre de mémoire ; n’invente ni épisode ni personnage : seul le texte fourni se cite mot pour mot. D’une œuvre, n’évoque que ce dont tu es sûr (genre, thème, situation générale).');
    }

    l.push('');
    if (avecQuestions) {
      l.push('RÉDACTION DES QUESTIONS (chaque point est vérifié automatiquement ; une question qui échoue est renvoyée en réécriture) :');
      l.push('- UNE question = UNE tâche vérifiable. Seules les rubriques de langue se scindent en « a. » puis « b. ».');
      l.push('- Aucune question en double, aucune question qui réponde à une autre.');
      l.push('- Aucune question théorique : ni « donne la définition », ni « énonce la règle », ni « qu’est-ce que ». On fait MANIPULER la langue sur une phrase citée.');
      l.push('- Toute consigne de production précise la LONGUEUR attendue (nombre de lignes ou de mots) et le TYPE de texte.');
    }
    l.push('- CITATIONS : toute citation entre « » est recopiée MOT POUR MOT depuis le texte support. Jamais de citation approximative, jamais de citation inventée.');
    l.push('');
    l.push('CORRIGÉ : une réponse attendue RÉDIGÉE, précise et fondée sur le texte (citations entre guillemets). Dès qu’un élément vaut plus d’un point, termine son corrigé par une ligne « Barème : … » qui ventile les points, dont la somme égale les points de l’élément.');
    l.push('FORME : texte brut, sans aucune mise en forme Markdown — pas d’astérisques, pas de dièses. Listes avec « - », plans avec « I. », « A. », « 1. ».');
    l.push('REMARQUES : trois points au plus, propres à CETTE épreuve (une citation à vérifier, une date incertaine, un passage du texte coupé). Ne recopie jamais les règles ci-dessus ni les formules du corrigé.');
    l.push('Ne fabrique JAMAIS un fait, une date ou une citation d’auteur. Si une information te manque, écris « à vérifier ».');

    /* ── MÉTHODE DE CONCEPTION (20/10/2026) ──────────────────────────────
       Relevée sur des sujets de concours relus et validés (guide de
       correction, annexe aux intervenants) : ce qui fait qu'un sujet se
       corrige vite et sans litige. Ambassa produisait le sujet et le
       corrigé ; le correcteur devait encore inventer les critères, les
       plafonds et les repères — c'est là que deux correcteurs divergent. */
    l.push('');
    l.push('MÉTHODE DE CONCEPTION — ce qui rend un sujet corrigeable sans litige :');
    l.push('- Avant d’écrire, vérifie que chaque question porte sur un aspect IMPORTANT du texte et sur une notion déjà étudiée. Aucune question sur un détail anecdotique, aucune sur une notion exclue.');
    l.push('- Une seule difficulté par question, et une seule réponse juste possible pour les questions de repérage et d’analyse.');
    if (reflexion || (plan && plan.sujets.some(function (s) { return /commentaire|dissertation|essai|discussion/.test(s.genre || ''); }))) {
      l.push('- SUJET DE RÉFLEXION : la thèse ou la citation proposée est attribuée (auteur, œuvre, et passage s’il est connu). La consigne ORIENTE la réflexion par une ou deux questions directrices (« Vous vous demanderez notamment si… »), sans jamais livrer le plan.');
      l.push('- Dans le corrigé d’un sujet de réflexion : la problématique en une phrase, un plan détaillé possible (I., A., 1.), les exemples attendus de l’œuvre ou de la culture de l’élève, et le principal contresens à éviter.');
    }
    if (plan && plan.productions && plan.productions.some(function (x) { return x.genre === 'resume'; })) {
      l.push('- RÉSUMÉ OU CONTRACTION : la consigne donne le nombre de mots visé, la tolérance (10 % en plus ou en moins) et demande d’indiquer le nombre de mots employés à la fin. Le corrigé propose un résumé modèle qui respecte cette longueur, dans l’ordre et l’énonciation du texte (jamais « l’auteur dit »).');
    }
    l.push('- Pour chaque question, le corrigé nomme le CONTRESENS ou l’erreur la plus probable, et ce qu’elle coûte.');
    l.push('');
    l.push('GUIDE DE CORRECTION (clé "guide" du JSON) — court et chiffré, au plus 8 critères :');
    l.push('- "criteres" : un critère par partie notée (compréhension, langue, production, chaque sujet), avec ses points (la somme égale le total de l’épreuve), "attendu" (les éléments qui rapportent les points, en une ou deux phrases) et "reperes" (les PLAFONDS : « contresens sur la thèse : 2 au plus », « paraphrase : moitié des points », « hors sujet : 0 »).');
    l.push('- "penalites" : deux à quatre règles chiffrées et plafonnées — langue (ex. au-delà de cinq fautes, 0,5 point par tranche de cinq, dans la limite de 2 points), longueur, présentation.');
    l.push('- "niveaux" : le profil d’une copie dans chaque tranche, une phrase chacune : "16 à 20", "12 à 15,5", "8 à 11,5", "0 à 7,5".');
    l.push('- "erreurs" : trois à cinq erreurs prévisibles des élèves de cette classe, et le critère où chacune se sanctionne — sans les cumuler.');
    l.push('NOTE AU RELECTEUR (clé "note") — trois à cinq lignes en tout : "choix" (pourquoi ce texte et ce sujet : lien avec la séquence, structure, difficulté visée), "perimetre" (notions évaluées), "points" (deux à quatre points précis sur lesquels le relecteur doit trancher : une question dont tu doutes, un barème discutable, une référence à vérifier).');
    l.push('Classe visée : ' + (classe || 'non précisée') + '.');
    return l.join('\n');
  }

  /* ------------------------------------------------------------------
     4. LA COMMANDE — le prompt proprement dit
     ------------------------------------------------------------------ */

  var PLAFOND_PROMPT = 7600;   // octets ; le proxy refuse au-delà de 8 000

  function consignesProduction(genre, texteMots) {
    if (genre === 'resume') {
      var quart = Math.round(texteMots / 4), tiers = Math.round(texteMots / 3);
      return 'consigne de contraction, au vouvoiement, en reprenant ces nombres EXACTS : « Ce texte compte ' + texteMots
        + ' mots. Résumez-le au quart de sa longueur, soit environ ' + quart + ' mots, ou analysez-le au tiers, soit environ ' + tiers
        + ' mots. Une marge de 10 % en plus ou en moins est tolérée. Vous indiquerez à la fin le nombre de mots employés. » ;'
        + ' corrigé : idées essentielles numérotées, RÉSUMÉ MODÈLE d’environ ' + quart + ' mots (nombre de mots entre parenthèses), ligne « Barème : … » sur 9';
    }
    if (genre === 'discussion') return 'sujet de discussion, au vouvoiement, FORMULÉ À PARTIR DU TEXTE : une question sur un problème qu’il aborde, ou sur un passage précis (alors cité MOT POUR MOT entre « »), puis « Vous exprimerez un avis argumenté, en vous appuyant sur votre expérience et sur vos lectures. » — sans limite de mots, et pas une reprise du texte ;'
      + ' corrigé : problématique, plan détaillé, introduction rédigée, ligne « Barème : … »';
    if (genre === 'synthese') return 'résumé partiel ou esprit de synthèse sur une partie précise du texte, avec un nombre de mots imposé';
    if (genre === 'essai') return 'sujet d’essai de culture générale lié au thème du texte : le candidat donne son opinion sur un problème précis';
    return 'situation-problème d’expression écrite liée au thème du texte : contexte (situation de vie), tâche, type de texte attendu, longueur, puis trois consignes numérotées 1-2-3';
  }

  function consignesSujet(s, classe) {
    switch (s.genre) {
      case 'dissertation': return 'libellé de dissertation au vouvoiement : une AFFIRMATION non attribuée (ou une citation dont tu es CERTAIN de l’auteur et des mots), un problème précis et non rebattu, puis la consigne (« Vous appuierez votre réflexion sur les œuvres étudiées et sur vos lectures personnelles ») ; corrigé : introduction rédigée, plan détaillé illustré par les œuvres au programme, conclusion, ligne « Barème : … » sur 20 (6 + 6 + 6 + 2)';
      case 'commentaire': if (en2nde(M(), classe)) return 'consigne de commentaire composé de 2nde sur le TEXTE 2, au vouvoiement, SANS recopier le texte : « 1. Exprimez le thème du texte. 2. Dégagez deux ou trois centres d’intérêt et présentez-les en plan détaillé : idées directrices, idées secondaires, moyens d’expression. » ; corrigé : thème, centres d’intérêt détaillés avec procédés et citations exactes, ligne « Barème : … » sur 20 (6 + 6 + 6 + 2)';
        return 'consigne de commentaire composé sur le TEXTE 2, au vouvoiement, SANS recopier le texte (il est imprimé à part) : « Vous ferez de ce texte un commentaire composé. Vous pourrez, par exemple, montrer comment … et analyser … » (deux axes) ; corrigé : introduction rédigée, plan en deux axes avec procédés et citations exactes, conclusion, ligne « Barème : … » sur 20 (6 + 6 + 6 + 2)';
      case 'lettre': return 'situation de communication professionnelle et consigne de rédaction d’une lettre administrative (destinataire, objet, contraintes)';
      case 'rapport': return 'situation professionnelle et consigne de rédaction d’un rapport ou d’un compte rendu';
      case 'essai': return 'sujet d’essai de culture générale sur un problème socioprofessionnel ou socioculturel';
      case 'fautif': return 'le texte source RECOPIÉ avec exactement 15 fautes injectées selon la grille (5 de grammaire/conjugaison à 2 pts, 4 d’accent/majuscule à 0,5 pt, 4 d’orthographe simple à 1 pt, 2 d’orthographe à incidence sémantique à 2 pts) ; le corrigé liste chaque faute : « mot fautif → forme correcte (nature, points) »';
      case 'dictee': return 'aucun texte à rédiger (la dictée est le texte source) ; dans le corrigé, liste les 10 difficultés orthographiques et grammaticales du texte et propose le barème de retrait de points';
      case 'presentation': return '';
      default: return 'situation-problème d’évaluation des compétences : un ENCADRÉ de mise en situation'
        + ' (40 à 50 mots, situation de vie camerounaise), puis la tâche et une consigne en trois temps numérotés 1-2-3 (type de texte, longueur, contraintes)';
    }
  }

  function promptEpreuve(ctx) {
    var plan = ctx.plan;
    var textePrincipal = (ctx.textes || []).filter(function (t) { return t.role === 'support' || t.role === 'fautif' || t.role === 'dictee'; })[0] || null;
    var mots = textePrincipal ? (textePrincipal.words || compterMots(textePrincipal.text)) : 0;
    var blocs = blocsDuPlan(plan);
    var l = [];
    l.push('Compose l’épreuve suivante et réponds en JSON strict.');
    l.push('Épreuve : ' + (plan.nom || 'épreuve de français') + ' — classe ' + (ctx.classe || '?') + (ctx.serie ? ', série ' + ctx.serie : '') + '. Total : ' + plan.total + ' points.');
    if (ctx.theme) l.push('Thème ou domaine de vie souhaité par l’enseignant : ' + ctx.theme + '.');
    /* Assistant de composition (19/10/2026) : le cadre, ce qui a été fait en
       classe, l'œuvre, et surtout ce qu'il NE FAUT PAS évaluer. Une notion
       pas encore vue qui tombe à l'épreuve, c'est une copie sanctionnée pour
       un cours que l'élève n'a pas eu. */
    if (ctx.cadre) l.push('Cadre : ' + ctx.cadre + (ctx.borne ? ', programme borné au ' + ctx.borne : '') + '.');
    if (ctx.programmeFait && ctx.programmeFait.length) l.push('Leçons déjà faites en classe (le sujet s’y appuie) : ' + ctx.programmeFait.join(' ; ') + '.');
    if (ctx.oeuvre) l.push('Œuvre au programme étudiée : ' + ctx.oeuvre + ' — privilégie-la pour les sujets qui portent sur une œuvre ; n’en invente aucune citation.');
    if (ctx.cadre && /maison|vacances/i.test(ctx.cadre)) l.push('DEVOIR FAIT HORS DE LA CLASSE : dans "guide.erreurs", ajoute les indices d’une copie rédigée par une IA ou recopiée (citations introuvables dans l’œuvre ou le texte, épisodes inexistants, langue uniformément lisse sans aucune trace de brouillon, plan identique à une copie voisine) et la conduite à tenir : convoquer l’élève pour qu’il explique sa démarche, sans annoter la copie.');
    if (ctx.exclusions && ctx.exclusions.length) l.push('NOTIONS EXCLUES — ne les utilise pas, même implicitement, ni dans les questions ni dans le corrigé : ' + ctx.exclusions.join(' ; ') + '.');
    /* Sujets au choix (Probatoire / BAC) : le sujet sur le texte en est UN,
       pas une « première partie obligatoire » (audit 16/10/2026). */
    var nbChoix = plan.sujets.filter(function (s) { return s.auChoix; }).length + (plan.sujetTexte ? 1 : 0);
    if (plan.sujetTexte && nbChoix > 1) {
      l.push('STRUCTURE : ' + nbChoix + ' sujets au choix, chacun noté sur 20. "consigne" = exactement « Le candidat traitera l’un des ' + nbChoix
        + ' sujets au choix. » Le SUJET 1 (' + plan.sujetTexte + ') porte sur le TEXTE 1 : ses consignes vont dans "questions", bloc par bloc ; les autres sujets vont dans "sujets".');
    }

    if (plan.support === 'texte' && blocs.length) {
      l.push('');
      l.push((plan.sujetTexte && nbChoix > 1 ? 'SUJET 1 SUR LE TEXTE 1' : 'QUESTIONS SUR LE TEXTE 1') + ' — respecte ce barème bloc par bloc :');
      blocs.forEach(function (b) {
        if (b.production) {
          l.push('- bloc "' + b.cle + '" (' + b.titre + ', ' + b.points + ' pts, liste ' + b.kind + ') : UNE seule consigne — ' + consignesProduction(b.production, mots) + '.');
        } else {
          var rubLangue = b.kind === 'expl' && plan.expl.rubriques.length > 1;
          if (rubLangue) {
            l.push('- bloc "' + b.cle + '" (' + b.titre + ', ' + b.points + ' pts) : TROIS items, dans cet ordre — 1) repérage ou identification, 2) analyse, 3) interprétation de l’effet de sens —, chacun sur la MÊME phrase ou le même fait du texte. Dans "q", la consigne seule : ni titre de rubrique, ni numéro, ni lettre, ni « (N pts) » — l’Atelier les pose.');
          } else {
            var nbq = b.points <= 2 ? 1 : b.points <= 5 ? 2 : b.points <= 8 ? 3 : 4;
            l.push('- bloc "' + b.cle + '" (' + b.titre + ', ' + b.points + ' pts, liste ' + b.kind + ') : ' + nbq + ' à ' + (nbq + 1) + ' questions'
              + (b.kind === 'comp' ? ', du repérage vers l’interprétation.' : ', manipulations de langue sur des phrases citées du texte.'));
          }
        }
      });
    }
    var fixes = ctx.fixes || null;
    if (fixes) {
      l.push('');
      l.push('QUESTIONS DÉJÀ ÉCRITES PAR L’ÉQUIPE — ne les réécris PAS. Renvoie-les à l’identique, dans le même ordre, en ajoutant seulement "pts", "niveau" et "corrige" :');
      Object.keys(fixes).forEach(function (n) {
        ['comp', 'expl'].forEach(function (k) {
          (fixes[n][k] || []).forEach(function (q, i) { l.push('  texte ' + n + ' / ' + k + ' / ' + (i + 1) + ' : ' + q); });
        });
      });
    }
    var aRediger = plan.sujets.filter(function (s) { return s.genre !== 'presentation'; });
    if (aRediger.length) {
      l.push('');
      l.push('SUJETS À RÉDIGER (tableau "sujets", dans cet ordre) :');
      aRediger.forEach(function (s, i) {
        l.push('- sujet ' + (i + 1) + ' — ' + s.titre + ' (' + s.points + ' pts' + (s.auChoix ? ', au choix' : '') + ') : ' + consignesSujet(s, ctx.classe) + '.');
      });
    }

    (ctx.textes || []).forEach(function (t, i) {
      var etiquette = t.role === 'commentaire' ? 'TEXTE 2 (pour le commentaire composé)'
        : t.role === 'fautif' ? 'TEXTE SOURCE (à recopier en y injectant les fautes)'
        : t.role === 'dictee' ? 'TEXTE DE LA DICTÉE' : 'TEXTE ' + (i + 1);
      l.push('');
      l.push('--- ' + etiquette + ' — n° ' + t.n + ', ' + (t.words || compterMots(t.text)) + ' mots — ' + (t.reference || t.author || 'référence non fournie'));
      var brut = String(t.text || ''), coupe = t._coupe || 6000;
      l.push(brut.slice(0, coupe) + (brut.length > coupe
        ? ' […] (texte coupé pour l\u2019envoi : ne pose aucune question sur la partie non transmise)' : ''));
      if (t.role === 'support' && t.comprehension && !fixes) {
        l.push('(Questions officielles déjà associées à ce texte, à reprendre, améliorer ou remplacer : ' + String(t.comprehension).slice(0, 300) + ' / ' + String(t.exploitation || '').slice(0, 300) + ')');
      }
    });

    l.push('');
    l.push('FORMAT DE RÉPONSE — JSON strict, sans texte autour, sans ```:');
    l.push('{"titre":"…","consigne":"consigne générale courte",'
      + '"questions":[{"texte":1,"liste":"comp|expl","bloc":"c0|comp|r0|expl|p0…","q":"énoncé","pts":1.5,"niveau":"reperage|analyse|interpretation|production","corrige":"réponse attendue"}],'
      + '"sujets":[{"texte":"énoncé complet du sujet","corrige":"attentes et plan possible"}],'
      + '"grille":[{"critere":"…","points":6,"indicateurs":"…"}],'
      + '"guide":{"criteres":[{"critere":"…","points":4,"attendu":"…","reperes":"…"}],"penalites":["…"],'
      + '"niveaux":{"16 à 20":"…","12 à 15,5":"…","8 à 11,5":"…","0 à 7,5":"…"},"erreurs":["…"]},'
      + '"note":{"choix":"…","perimetre":"…","points":["…"]},'
      + '"remarques":"ce que l’enseignant doit vérifier"}');
    return l.join('\n');
  }

  /* Coupe le texte support s'il le faut pour tenir dans le plafond, en le
     disant dans le texte même : Ambassa ne doit pas poser une question sur
     une fin qu'elle n'a pas lue. */
  function ajusterPrompt(ctx) {
    var p = promptEpreuve(ctx);
    var garde = 0;
    while (octets(p) > PLAFOND_PROMPT && garde < 12) {
      garde++;
      var trop = octets(p) - PLAFOND_PROMPT;
      /* D'abord le texte du commentaire, qui n'a besoin que de son amorce ;
         une fois réduit au minimum, c'est au tour du texte support. */
      var longueur = function (t) { return t._coupe || Math.min(6000, String(t.text || '').length); };
      var cible = (ctx.textes || []).filter(function (t) { return t.role === 'commentaire' && longueur(t) > 400; })[0]
        || (ctx.textes || []).filter(function (t) { return longueur(t) > 400; })[0];
      if (!cible) break;
      cible._coupe = Math.max(400, longueur(cible) - Math.ceil(trop * 0.8) - 40);
      p = promptEpreuve(ctx);
    }
    return p;
  }

  /* ------------------------------------------------------------------
     5. LE CONTRÔLE DE CE QU'AMBASSA RENVOIE
     ------------------------------------------------------------------ */

  function extraireJSON(txt) {
    var s = String(txt || '');
    var i = s.indexOf('{');
    if (i < 0) throw new Error('reponse_illisible');
    var depth = 0, inStr = false, esc = false;
    for (var k = i; k < s.length; k++) {
      var c = s[k];
      if (inStr) {
        if (esc) esc = false;
        else if (c === '\\') esc = true;
        else if (c === '"') inStr = false;
        continue;
      }
      if (c === '"') inStr = true;
      else if (c === '{') depth++;
      else if (c === '}') { depth--; if (!depth) return JSON.parse(s.slice(i, k + 1)); }
    }
    throw new Error('reponse_tronquee');
  }

  /* Répartit `cible` points sur des items en gardant leurs proportions
     relatives, au demi-point (au quart si nécessaire), sans jamais tomber
     à zéro ; le reliquat va au plus gros item. */
  function repartir(items, cible) {
    if (!items.length) return [];
    var bruts = items.map(function (x) { var v = nombre(x); return v && v > 0 ? v : null; });
    var connus = bruts.filter(function (v) { return v !== null; });
    var moyenne = connus.length ? connus.reduce(function (a, b) { return a + b; }, 0) / connus.length : 1;
    bruts = bruts.map(function (v) { return v === null ? moyenne : v; });
    var somme = bruts.reduce(function (a, b) { return a + b; }, 0) || 1;
    var pas = (cible / items.length) < 1 ? 0.25 : 0.5;
    var out = bruts.map(function (v) { return Math.max(pas, arrondir(v * cible / somme, pas)); });
    var total = out.reduce(function (a, b) { return a + b; }, 0);
    var reste = Math.round((cible - total) * 100) / 100;
    var garde = 0;
    while (Math.abs(reste) > 0.001 && garde < 200) {
      garde++;
      var iMax = 0;
      for (var i = 1; i < out.length; i++) if (out[i] > out[iMax]) iMax = i;
      if (reste > 0) { out[iMax] = Math.round((out[iMax] + reste) * 100) / 100; reste = 0; }
      else {
        var retrait = Math.min(-reste, out[iMax] - pas);
        if (retrait <= 0) break;
        out[iMax] = Math.round((out[iMax] - retrait) * 100) / 100;
        reste = Math.round((reste + retrait) * 100) / 100;
      }
    }
    return out;
  }

  function motsBannis(opts) {
    var ref = M(opts);
    var l = [];
    if (ref && ref.formulations) l = l.concat(ref.formulations.questionsBannies || []);
    if (ref && ref.questionnement) l = l.concat(ref.questionnement.aEviter || []);
    return l.slice().sort(function (a, b) { return b.motif.length - a.motif.length; });
  }

  function motifBanni(q, bannies) {
    var nq = ' ' + norm(q) + ' ';
    for (var i = 0; i < bannies.length; i++) {
      var m = norm(bannies[i].motif);
      /* « comment » isolé, pas « commentaire » ni « commentez ». */
      if (new RegExp('(^|[^a-z])' + m.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '([^a-z]|$)').test(nq)) return bannies[i].motif;
    }
    return '';
  }

  /* Formes théoriques que le référentiel commun ne liste pas encore : la
     partie langue évalue l'USAGE, pas la définition. Propres au générateur,
     pour ne pas changer le garde-fou que les enseignants voient déjà. */
  var THEORIQUES = ['donne la definition', 'donnez la definition', 'definis le ', 'definis la ',
    'definis les ', 'enonce la regle', 'enoncez la regle', 'quelle est la regle', 'qu est ce que'];

  /* Texte comparable : minuscules, sans accents, apostrophes et ponctuation
     réduites à des espaces. Une citation « l'odeur » doit retrouver
     « l’odeur » dans le texte. */
  function plat(s) {
    return ' ' + norm(s).replace(/[^a-z0-9]+/g, ' ').trim() + ' ';
  }

  /* Citations d'une question ou d'un corrigé : le contenu des « … » et des
     "…" (les guillemets droits servent aussi). */
  function citations(q) {
    var out = [], re = /«\s*([^»]{1,240}?)\s*»|"([^"]{1,240}?)"/g, m;
    while ((m = re.exec(String(q || '')))) out.push((m[1] || m[2] || '').trim());
    return out.filter(function (c) { return c.length > 1; });
  }

  /* Défauts d'une question, du plus grave au moins grave. Chacun porte un
     `motif` (affiché) et une `consigne` (envoyée à Ambassa pour réécriture). */
  function diagnostiquer(q, contexte, opts) {
    var d = [], ref = M(opts);
    var banni = motifBanni(q, contexte.bannies || motsBannis(opts));
    if (banni) d.push({ code: 'banni', motif: banni, consigne: 'supprime la formulation « ' + banni + ' » ; fais relever puis justifier' });
    var nq = ' ' + norm(q) + ' ';
    for (var i = 0; i < THEORIQUES.length; i++) {
      if (nq.indexOf(' ' + THEORIQUES[i]) >= 0) {
        d.push({ code: 'theorique', motif: 'question théorique', consigne: 'remplace la question théorique par une manipulation sur une phrase citée du texte' });
        break;
      }
    }
    if (contexte.texte) {
      var tp = plat(contexte.texte);
      var fausses = citations(q).filter(function (c) { var pc = plat(c); return pc.trim() && tp.indexOf(pc) < 0; });
      if (fausses.length) d.push({ code: 'citation', motif: 'citation absente du texte : « ' + fausses[0].slice(0, 60) + ' »',
        consigne: 'la citation « ' + fausses[0].slice(0, 80) + ' » n’existe pas dans le texte : cite un passage recopié mot pour mot du texte fourni' });
    }
    if (!consigneReconnue(q, ref)) {
      d.push({ code: 'consigne', motif: 'aucun verbe de consigne reconnu', consigne: 'commence par un verbe de consigne du programme (relève, identifie, explique, justifie, transforme, réécris, rédige…) ou par « Quel/Quelle »' });
    }
    /* La discussion n'a PAS de limite de mots (Draft EST) : on ne lui en
       réclame pas. Elle doit en revanche citer le texte, mot pour mot. */
    if (contexte.production && contexte.production !== 'resume' && contexte.production !== 'discussion' && !LONGUEUR.test(norm(q))) {
      d.push({ code: 'longueur', motif: 'longueur attendue non précisée', consigne: 'précise la longueur attendue (nombre de lignes ou de mots) et le type de texte' });
    }
    /* La discussion porte « soit sur un problème abordé dans le texte, soit
       sur un passage précis » (guide du 2nd cycle) : citer n'est PAS
       obligatoire. L'exiger (règle du 16/10 matin) était plus strict que le
       texte officiel — corrigé le soir même. Une citation, si elle est faite,
       reste vérifiée mot pour mot (code « citation »). */
    if (contexte.vous && tutoie(q)) {
      d.push({ code: 'tutoiement', motif: 'tutoiement au second cycle', consigne: 'réécris la consigne au vouvoiement (« Relevez », « Vous montrerez »), comme aux examens du second cycle' });
    }
    return d;
  }

  /* ÉNONCÉ NETTOYÉ (16/10/2026, capture de Jacques, Langue française) :
     Ambassa recopiait dans la question l'en-tête de rubrique et les points
     (« I. Communication (5 points)\n1. a. Relève … (1,5 pts) »), puis notre
     préfixe s'ajoutait au sien (« I. Communication — b. 1. b. Interprète »).
     Les points vivent dans leur champ ; la rubrique et la lettre, c'est le
     préfixe qui les pose. On retire donc, en tête, tout titre de rubrique
     connu et toute numérotation, et en queue l'annonce des points. */
  function nettoyerEnonce(q, titres) {
    var t = String(q || '').replace(/\r/g, '');
    for (var tour = 0; tour < 4; tour++) {
      var avant = t;
      (titres || []).forEach(function (ti) {
        var nt = norm(ti), nq = norm(t);
        if (nt && nq.indexOf(nt) === 0) {
          // On coupe à la même longueur de caractères que le titre d'origine.
          t = t.slice(ti.length).replace(/^\s*\(\s*\d+(?:[.,]\d+)?\s*(?:pts?|points?)\s*\)/i, '');
        }
      });
      t = t.replace(/^[\s—–:\-]+/, '')
        .replace(/^\(?\d{1,2}[.)]\s*(?=\S)/, '')
        .replace(/^\(?[a-d][.)]\s+/i, '');
      if (t === avant) break;
    }
    t = t.replace(/\s*\(\s*\d+(?:[.,]\d+)?\s*(?:pts?|points?)\s*\)\s*$/i, '')
      .replace(/\s*\n\s*/g, ' ').replace(/\s{2,}/g, ' ').trim();
    return t || String(q || '').trim();
  }

  /* Vouvoiement d'une consigne (2nd cycle) : le verbe qui OUVRE chaque
     phrase, et les possessifs « ta, ton, tes ». Hors citations, qui se
     recopient mot pour mot. Une réécriture par Ambassa coûte un appel —
     et l'essai épuisé n'en a plus. */
  var VOUS = {
    ecris: 'écrivez', mets: 'mettez', decoupe: 'découpez', situe: 'situez', choisis: 'choisissez', fais: 'faites',
    repere: 'repérez', transpose: 'transposez', construis: 'construisez', prepare: 'préparez', propose: 'proposez',
    dis: 'dites', donne: 'donnez', indique: 'indiquez', precise: 'précisez', trouve: 'trouvez', encadre: 'encadrez',
    conjugue: 'conjuguez', accorde: 'accordez', remplace: 'remplacez', complete: 'complétez', souligne: 'soulignez',
    releve: 'relevez', redige: 'rédigez', montre: 'montrez', imagine: 'imaginez', commente: 'commentez',
    discute: 'discutez', compare: 'comparez', emploie: 'employez', utilise: 'utilisez', ajoute: 'ajoutez',
    supprime: 'supprimez', reduis: 'réduisez', developpe: 'développez', justifie: 'justifiez', explique: 'expliquez',
    identifie: 'identifiez', nomme: 'nommez', cite: 'citez', recopie: 'recopiez', transforme: 'transformez',
    reecris: 'réécrivez', etudie: 'étudiez', interprete: 'interprétez', deduis: 'déduisez', apprecie: 'appréciez',
    prolonge: 'prolongez', poursuis: 'poursuivez', raconte: 'racontez', decris: 'décrivez', compose: 'composez',
    lis: 'lisez', observe: 'observez', associe: 'associez', distingue: 'distinguez', retrouve: 'retrouvez',
    delimite: 'délimitez', formule: 'formulez', presente: 'présentez', enumere: 'énumérez', reconstitue: 'reconstituez',
    prouve: 'prouvez', resume: 'résumez', analyse: 'analysez'
  };
  function vouvoyer(q) {
    var morceaux = String(q || '').split(/(«[^»]*»|"[^"]*")/);
    return morceaux.map(function (m, i) {
      if (i % 2) return m;   // citation : intacte
      return m
        .replace(/(^|[.!?:;]\s+|\n\s*|—\s*|\b(?:puis|et|ensuite)\s+)([A-Za-zÀ-ÿ]+)(?=[\s,-]|$)/g, function (tout, av, mot, pos, chaine) {
          var cle = norm(mot);
          if (!VOUS[cle]) return tout;
          /* Les mots qui sont AUSSI des noms ou des adjectifs (« Résumé au
             quart », « Analyse au tiers », « Présente… ») : on n'accorde que
             s'ils sont suivis d'un déterminant ou d'un pronom complément —
             « Analyse le rôle », « Résume-le ». Un mot en « é » n'est jamais
             un impératif. */
          if (/é$/.test(mot)) return tout;
          if (AMBIGUS_SG.concat(['presente', 'compose', 'imagine', 'observe']).indexOf(cle) >= 0) {
            var suite = chaine.slice(pos + tout.length);
            if (!/^(?:-(?:le|la|les|en)\b|\s+(?:le|la|les|l['’]|ce|cet|cette|ces|un|une|des|du|en|chaque|deux|trois|quatre|cinq|dix|votre|vos|ta|ton|tes|son|sa|ses)\b)/i.test(suite)) return tout;
          }
          var pl = VOUS[cle];
          if (mot.charAt(0) === mot.charAt(0).toUpperCase()) pl = pl.charAt(0).toUpperCase() + pl.slice(1);
          return av + pl;
        })
        .replace(/\b([Tt])(a|on)\s+(?=[a-zà-ÿ])/g, function (t0, T) { return (T === 'T' ? 'V' : 'v') + 'otre '; })
        .replace(/\b([Tt])es\s+(?=[a-zà-ÿ])/g, function (t0, T) { return (T === 'T' ? 'V' : 'v') + 'os '; })
        .replace(/-(le|la|les|en)\b/g, '-$1');
    }).join('');
  }

  /* Tutoiement HORS citation : le second cycle compose au vouvoiement.
     « ton » est exclu (« le ton ironique du texte ») ; « résumé »,
     « analyse », « compte », « classe », « forme » aussi, qui ouvrent une
     consigne comme NOMS (« Analyse au tiers… »). Les impératifs vont par
     paires singulier/pluriel dans IMPERATIFS : le singulier est au rang pair. */
  var AMBIGUS_SG = ['resume', 'analyse', 'compte', 'classe', 'forme', 'range'];
  function tutoie(s) {
    var brut = String(s || '').replace(/«[^»]*»|"[^"]*"/g, ' ');
    // « Résume-le », « Analyse-le » : ici le mot ambigu est bien un verbe.
    if (/(?:^|[.!?:;]\s+)(?:r[ée]sume|analyse|compte|classe|forme|range)-(?:le|la|les|en)(?![a-zà-ÿ])/i.test(brut.trim())) return true;
    var t = norm(brut);
    if (/(^|[^a-z])(tu|toi|te|ta|tes|tien|tienne)([^a-z]|$)/.test(t)) return true;
    /* Le premier mot de CHAQUE phrase : « Ce texte compte 560 mots.
       Résume-le… » tutoie à la deuxième phrase. */
    return t.replace(/^.*?—\s*/, '').split(/[.!?:;]\s+|\n+/).some(function (ph) {
      var w = ph.replace(/^\s*[a-d0-9][.)]\s*/, '').replace(/[^a-z0-9 ]+/g, ' ').trim().split(/\s+/)[0] || '';
      var i = IMPERATIFS.indexOf(w);
      return i >= 0 && i % 2 === 0 && AMBIGUS_SG.indexOf(w) < 0;
    });
  }

  /* Une question commence par une consigne reconnaissable : un verbe du
     référentiel (niveauQuestion), un impératif courant des sujets réels, ou
     un tour interrogatif. Mesuré sur les 6 084 questions du corpus libre :
     le référentiel seul en laissait 16,8 % sans consigne reconnue (« Découpe
     le texte… », « Écris une scène… », « Qui parle… ») — autant de fausses
     alertes, donc d'appels de réécriture gaspillés. */
  var IMPERATIFS = ('ecris ecrivez mets mettez decoupe decoupez situe situez choisis choisissez fais faites repere reperez '
    + 'transpose transposez construis construisez prepare preparez compte comptez propose proposez dis dites donne donnez '
    + 'indique indiquez precise precisez trouve trouvez encadre encadrez conjugue conjuguez accorde accordez remplace remplacez '
    + 'complete completez souligne soulignez releve relevez resume resumez redige redigez montre montrez imagine imaginez '
    + 'analyse analysez commente commentez discute discutez compare comparez classe classez range rangez emploie employez '
    + 'utilise utilisez forme formez ajoute ajoutez supprime supprimez reduis reduisez developpe developpez justifie justifiez '
    + 'explique expliquez identifie identifiez nomme nommez cite citez recopie recopiez transforme transformez reecris reecrivez '
    + 'etudie etudiez interprete interpretez deduis deduisez apprecie appreciez prolonge prolongez poursuis poursuivez raconte racontez '
    + 'decris decrivez compose composez lis lisez observe observez associe associez distingue distinguez retrouve retrouvez '
    + 'delimite delimitez formule formulez presente presentez enumere enumerez reconstitue reconstituez prouve prouvez').split(' ');
  var INTERROGATIFS = ['quel', 'quelle', 'quels', 'quelles', 'qui', 'que', 'quoi', 'combien', 'ou', 'quand', 'lequel', 'laquelle',
    'lesquels', 'lesquelles', 'a qui', 'a quoi', 'a quel', 'a quelle', 'a quels', 'a quelles', 'de qui', 'de quoi', 'en quoi', 'par qui', 'dans quel', 'dans quelle', 'est ce', 'y a t il'];
  function consigneReconnue(q, ref) {
    if (ref && ref.niveauQuestion && ref.niveauQuestion(q)) return true;
    /* On retire ce qui précède la consigne : rubrique (« I. Communication — »),
       lettre (« a. »), numéro, citation d'amorce suivie de deux-points. */
    var t = norm(q).replace(/^.*?—\s*/, '').replace(/^[a-d0-9][.)]\s*/, '');
    if (/^«[^»]*»\s*[:.]?\s*/.test(t)) t = t.replace(/^«[^»]*»\s*[:.]?\s*/, '');
    t = t.replace(/[^a-z0-9 ]+/g, ' ').replace(/\s+/g, ' ').trim();
    var premier = t.split(' ')[0] || '';
    if (IMPERATIFS.indexOf(premier) >= 0) return true;
    for (var i = 0; i < INTERROGATIFS.length; i++) {
      if (t === INTERROGATIFS[i] || t.indexOf(INTERROGATIFS[i] + ' ') === 0) return true;
    }
    /* Une consigne peut suivre une mise en situation : « Dans le deuxième
       paragraphe, relève… ». On cherche alors un impératif dans les dix
       premiers mots. */
    var debut = t.split(' ').slice(0, 10);
    if (debut.some(function (w) { return IMPERATIFS.indexOf(w) >= 0; })) return true;
    /* « À partir de l’affirmation de l’auteur : « …trente mots… », discutez
       ce point de vue » : la citation repoussait le verbe hors des dix
       premiers mots (16/10/2026). On cherche le verbe hors citations. */
    var horsCit = norm(String(q || '').replace(/«[^»]*»|"[^"]*"/g, ' ')).replace(/[^a-z0-9 ]+/g, ' ').replace(/\s+/g, ' ').trim().split(' ').slice(0, 16);
    if (horsCit.some(function (w) { return IMPERATIFS.indexOf(w) >= 0; })) return true;
    /* Le second cycle libelle aussi au FUTUR : « Vous discuterez ce point de
       vue », « Vous ferez de ce texte un commentaire composé » (Draft EST).
       Refusé, chaque discussion de BAC partait en réécriture (16/10). */
    return /(^| )vous (?:[a-z]+ ){0,2}[a-z]{2,}(?:erez|irez|rez)( |$)/.test(t.split(' ').slice(0, 14).join(' '));
  }

  /* Une longueur de production : un nombre (en chiffres ou en lettres) suivi
     d'une unité. « Rédige un texte de quinze lignes », « en 200 mots
     environ », « une vingtaine de répliques ». */
  var LONGUEUR = new RegExp('(\\d+|une? |deux|trois|quatre|cinq|six|sept|huit|neuf|dix|onze|douze|treize|quatorze|quinze|seize|vingt|trente|quarante|cinquante|cent|dizaine|quinzaine|vingtaine|trentaine|demi)'
    + '[^.;]{0,25}?(ligne|mot|page|paragraphe|replique|vers|strophe)');

  /* Deux questions qui disent la même chose : mêmes mots pleins à 80 %. */
  function semblables(a, b) {
    var ma = plat(a).split(' ').filter(function (w) { return w.length > 3; });
    var mb = plat(b).split(' ').filter(function (w) { return w.length > 3; });
    if (ma.length < 3 || mb.length < 3) return false;
    var commun = ma.filter(function (w) { return mb.indexOf(w) >= 0; }).length;
    return commun / Math.max(ma.length, mb.length) >= 0.8;
  }

  /* Texte brut : Ambassa rendait du Markdown (« **Compréhension :** »,
     « # Plan ») qui s'imprimait tel quel dans le corrigé Word (16/10/2026). */
  function sansMarkdown(s) {
    return String(s == null ? '' : s)
      .replace(/\*\*([^*\n]+)\*\*/g, '$1').replace(/__([^_\n]+)__/g, '$1')
      .replace(/^#{1,6}\s*/gm, '').replace(/^(\s*)\*\s+/gm, '$1- ');
  }
  function propre(s, max) {
    return sansMarkdown(s).replace(/\s+\n/g, '\n').trim().slice(0, max || 4000);
  }
  /* Les remarques ne sont pas un écho du référentiel : la réserve officielle
     et les formules du corrigé harmonisé sont déjà affichées ailleurs. On ne
     garde que ce qui est propre à CETTE épreuve. */
  function nettoyerRemarques(txt, struct, ref) {
    var deja = [];
    if (struct) {
      if (struct.avertissement) deja.push(struct.avertissement);
      (struct.formulesCorrige || []).forEach(function (x) { deja.push(x); });
      if (struct.note) deja.push(struct.note);
    }
    if (ref && ref.formulations) {
      (ref.formulations.consignesGenerales || []).forEach(function (x) { deja.push(x); });
      var fc = ref.formulations.formulesCorrige || {};
      Object.keys(fc).forEach(function (k) { deja.push(fc[k]); });
    }
    var plats = deja.map(function (x) { return plat(x).slice(0, 60); }).filter(function (x) { return x.length > 20; });
    // Sans lookbehind : de vieux navigateurs Android ne le connaissent pas.
    var phrases = String(txt || '').replace(/([.!?])\s+/g, '$1\n').split(/\n+/).map(function (x) { return x.trim(); }).filter(Boolean);
    var gardees = phrases.filter(function (ph) {
      var p0 = plat(ph);
      /* Longueur des textes, texte « coupé » ou « incomplet » : l'Atelier le
         MESURE et coupe lui-même pour l'envoi. Ambassa, qui ne voit que
         l'extrait transmis, se trompait (« légèrement court, mais dans la
         marge » pour 381 mots au lieu de 550). */
      if (/ (mots|longueur|court|courte|long|longue|coupe|coupee|tronque|incomplet|incomplete|marge) /.test(p0) && / texte /.test(p0)) return false;
      return !plats.some(function (d) { return p0.indexOf(d.slice(0, 40)) >= 0 || d.indexOf(p0.slice(0, 40)) >= 0; });
    });
    return gardees.slice(0, 4).join(' ').slice(0, 600);
  }

  /* Transforme la réponse brute en épreuve applicable, et dresse la liste
     de ce qui a été vérifié. Ne jette pas une réponse imparfaite : ce qui
     manque est dit, l'enseignant complète. */
  function validerEpreuve(o, ctx, opts) {
    var plan = ctx.plan;
    var bannies = motsBannis(opts);
    var blocs = blocsDuPlan(plan);
    var cleValides = {};
    blocs.forEach(function (b) { cleValides[b.cle] = b; });
    var support = (ctx.textes || []).filter(function (t) { return t.role === 'support'; });
    var vousQ = secondCycle(ctx.struct, ctx.classe);
    var numParRang = {};
    support.forEach(function (t, i) { numParRang[i + 1] = t.n; numParRang[t.n] = t.n; });
    var res = {
      titre: propre(o && o.titre, 160), consigne: propre(o && o.consigne, 600),
      questions: {}, sujets: [], grille: [], remarques: nettoyerRemarques(propre(o && o.remarques, 900), ctx.struct, M(opts)),
      controles: [], aReparer: []
    };
    support.forEach(function (t) { res.questions[t.n] = { comp: [], expl: [] }; });

    /* --- questions --- */
    var brutes = (o && Array.isArray(o.questions)) ? o.questions : [];
    if (ctx.fixes) {
      /* Mode « compléter » : les énoncés de l'équipe font foi, on ne prend
         d'Ambassa que les points, le niveau et le corrigé, rang par rang. */
      Object.keys(ctx.fixes).forEach(function (n) {
        res.questions[n] = { comp: [], expl: [] };
        ['comp', 'expl'].forEach(function (k) {
          var venues = brutes.filter(function (x) { return x && String(x.liste) === k && (numParRang[x.texte] || support[0] && support[0].n) == n; });
          (ctx.fixes[n][k] || []).forEach(function (q, i) {
            var v = venues[i] || {};
            res.questions[n][k].push({ q: q, pts: nombre(v.pts), niveau: String(v.niveau || ''), corrige: propre(v.corrige, 9000), bloc: k, fixe: true });
          });
        });
      });
    } else {
      brutes.forEach(function (x) {
        if (!x || typeof x.q !== 'string' || x.q.trim().length < 6) return;
        var n = numParRang[x.texte] || (support[0] && support[0].n);
        if (!n || !res.questions[n]) return;
        var bloc = cleValides[x.bloc] ? x.bloc : null;
        var k = bloc ? cleValides[bloc].kind : (x.liste === 'comp' ? 'comp' : 'expl');
        if (!bloc) {
          /* Bloc absent ou inventé : on le rattache au premier bloc du bon côté. */
          var b0 = blocs.filter(function (b) { return b.kind === k && !b.production; })[0] || blocs.filter(function (b) { return b.kind === k; })[0];
          bloc = b0 ? b0.cle : k;
        }
        res.questions[n][k].push({ q: propre(x.q, 900), pts: nombre(x.pts), niveau: String(x.niveau || ''), corrige: propre(x.corrige, 9000), bloc: bloc });
      });
      /* UN BLOC DE PRODUCTION = UNE CONSIGNE. Ambassa glissait la
         « Présentation de la copie » dans le bloc du résumé : 9 points
         coupés en 7,5 + 1,5, un item III « Ce texte compte 381 mots.
         Présentation… » et un faux « aucun résumé modèle » (16/10/2026).
         La présentation est un sujet à part, notée à part. */
      var aPresentation = plan.sujets.some(function (s) { return s.genre === 'presentation'; });
      Object.keys(res.questions).forEach(function (n) {
        ['comp', 'expl'].forEach(function (k) {
          var vusProd = {};
          res.questions[n][k] = res.questions[n][k].filter(function (it) {
            if (aPresentation && /^\W*(?:[IVX]+\.\s*)?pr[ée]sentation\b|pr[ée]sentation (?:et perfectionnement )?de (?:la|votre) copie/i.test(it.q)) return false;
            var b = cleValides[it.bloc];
            if (!b || !b.production) return true;
            if (vusProd[it.bloc]) return false;
            vusProd[it.bloc] = 1;
            return true;
          });
        });
      });
      var titresRub = blocs.map(function (b) { return b.titre; });
      Object.keys(res.questions).forEach(function (n) {
        ['comp', 'expl'].forEach(function (k) {
          res.questions[n][k].forEach(function (it) {
            it.q = nettoyerEnonce(it.q, titresRub);
            if (vousQ) it.q = vouvoyer(it.q);
          });
        });
      });
      /* Préfixe de rubrique : dans la liste plate du composeur, « I.
         Communication — a. … » doit rester lisible une fois imprimé. */
      Object.keys(res.questions).forEach(function (n) {
        ['comp', 'expl'].forEach(function (k) {
          var vus = {};
          res.questions[n][k].forEach(function (it) {
            var b = cleValides[it.bloc];
            var multi = b && ((k === 'expl' && plan.expl.rubriques.length > 1) || (k === 'comp' && plan.comp.rubriques.length > 1));
            if (multi && !b.production) {
              vus[it.bloc] = (vus[it.bloc] || 0) + 1;
              var lettre = String.fromCharCode(96 + vus[it.bloc]);
              var sansPrefixe = it.q.replace(/^\s*[a-d][.)]\s*/i, '');
              if (norm(sansPrefixe).indexOf(norm(b.titre)) !== 0) it.q = b.titre + ' — ' + lettre + '. ' + sansPrefixe;
            }
          });
          /* Les productions ferment la liste de langue, comme sur les sujets réels. */
          if (k === 'expl') {
            res.questions[n][k].sort(function (a, b2) {
              return ((cleValides[a.bloc] && cleValides[a.bloc].production) ? 1 : 0) - ((cleValides[b2.bloc] && cleValides[b2.bloc].production) ? 1 : 0);
            });
          }
        });
      });
    }

    /* --- sujets --- */
    var brutsS = (o && Array.isArray(o.sujets)) ? o.sujets : [];
    var iS = 0;
    plan.sujets.forEach(function (s) {
      if (s.genre === 'presentation') {
        res.sujets.push({ genre: s.genre, titre: s.titre, texte: 'Propreté, lisibilité, marges, absence de ratures.', pts: s.points, auChoix: false, corrige: '' });
        return;
      }
      var v = brutsS[iS++] || {};
      var texte = propre(typeof v === 'string' ? v : v.texte, 5000);
      if (vousQ) texte = vouvoyer(texte);
      res.sujets.push({ genre: s.genre, titre: s.titre, texte: texte, pts: s.points, auChoix: !!s.auChoix, corrige: propre(v.corrige, 16000) });
    });
    /* La dictée n'a rien à rédiger : son « sujet » est le texte lui-même.
       On IMPOSE la mention, même si Ambassa a écrit quelque chose : ce champ
       s'imprime sur la feuille du candidat, et une IA qui y recopierait le
       texte de la dictée (ou ses difficultés) donnerait la réponse. */
    res.sujets.forEach(function (s) {
      if (s.genre === 'dictee') s.texte = 'Dictée lue par l’examinateur (le texte figure au corrigé, réservé à l’enseignant).';
    });

    /* --- grille --- */
    (o && Array.isArray(o.grille) ? o.grille : []).forEach(function (g) {
      if (g && g.critere) res.grille.push({ critere: propre(g.critere, 160), points: nombre(g.points), indicateurs: propre(g.indicateurs, 500) });
    });

    /* --- guide de correction et note au relecteur (20/10/2026) ---
       Bornés comme le reste : une réponse trop bavarde ne doit pas remplir
       l'écran de l'enseignant. Absents, ils restent absents — le guide se
       pré-remplit alors depuis le barème, comme avant. */
    var gd = o && o.guide && typeof o.guide === 'object' ? o.guide : null;
    var liste = function (x, n, max) { return (Array.isArray(x) ? x : (x ? [x] : [])).map(function (y) { return propre(y, max); }).filter(Boolean).slice(0, n); };
    if (gd) {
      var niv = {};
      ['16 à 20', '12 à 15,5', '8 à 11,5', '0 à 7,5'].forEach(function (t) { if (gd.niveaux && gd.niveaux[t]) niv[t] = propre(gd.niveaux[t], 300); });
      res.guide = {
        criteres: (Array.isArray(gd.criteres) ? gd.criteres : []).filter(function (c) { return c && c.critere; }).slice(0, 8).map(function (c) {
          return { critere: propre(c.critere, 160), points: nombre(c.points), attendu: propre(c.attendu, 500), reperes: propre(c.reperes, 400) }; }),
        penalites: liste(gd.penalites, 5, 300), niveaux: niv, erreurs: liste(gd.erreurs, 7, 300)
      };
      if (!res.guide.criteres.length && !res.guide.penalites.length && !res.guide.erreurs.length) res.guide = null;
    }
    var nt = o && o.note && typeof o.note === 'object' ? o.note : null;
    if (nt) {
      res.note = { choix: propre(nt.choix, 600), perimetre: propre(nt.perimetre, 400), points: liste(nt.points, 5, 300) };
      if (!res.note.choix && !res.note.perimetre && !res.note.points.length) res.note = null;
    }

    /* --- barème : recalé bloc par bloc sur le plan --- */
    if (ctx.fixes) {
      var tous = [];
      Object.keys(res.questions).forEach(function (n) { ['comp', 'expl'].forEach(function (k) { res.questions[n][k].forEach(function (it) { tous.push(it); }); }); });
      var horsQ = plan.sujets.filter(function (s) { return !s.auChoix; }).reduce(function (a, s) { return a + s.points; }, 0);
      var cibleQ = Math.max(0, plan.total - horsQ);
      if (tous.length && cibleQ) repartir(tous.map(function (it) { return it.pts; }), cibleQ).forEach(function (p, i) { tous[i].pts = p; });
    } else {
      blocs.forEach(function (b) {
        var its = [];
        Object.keys(res.questions).forEach(function (n) { res.questions[n][b.kind].forEach(function (it) { if (it.bloc === b.cle) its.push(it); }); });
        if (!its.length) {
          res.controles.push({ ok: false, libelle: 'Bloc « ' + b.titre + ' » (' + b.points + ' pts) : aucune question rédigée — à compléter.' });
          return;
        }
        repartir(its.map(function (it) { return it.pts; }), b.points).forEach(function (p, i) { its[i].pts = p; });
      });
    }

    reparerReflexion(res, ctx, cleValides);

    /* --- contrôles déterministes --- */
    var nbQ = 0, total = 0, parNiveau = {}, corrigesManquants = 0, baremesNonVentiles = 0, citationsCorrige = 0;
    var ref = M(opts);
    var vues = [];
    Object.keys(res.questions).forEach(function (n) {
      var tx = (support.filter(function (t) { return String(t.n) === String(n); })[0] || {}).text || '';
      ['comp', 'expl'].forEach(function (k) {
        res.questions[n][k].forEach(function (it, i) {
          nbQ++; total += it.pts || 0;
          var nv = ref && ref.niveauQuestion ? ref.niveauQuestion(it.q) : null;
          if (nv) parNiveau[nv.id] = (parNiveau[nv.id] || 0) + (it.pts || 0);
          if (!it.corrige) corrigesManquants++;
          else if ((it.pts || 0) > 1 && !/bar[eè]me|\d+(?:[.,]\d+)?\s*pts?\b/i.test(it.corrige)) baremesNonVentiles++;
          if (it.corrige && tx) {
            var tpc = plat(tx);
            citationsCorrige += citations(it.corrige).filter(function (c) { var pc = plat(c); return pc.trim().split(' ').length >= 3 && tpc.indexOf(pc) < 0; }).length;
          }
          /* Les énoncés de l'équipe (mode « compléter ») ne sont jamais
             réécrits : on ne touche pas au travail d'un collègue. */
          if (it.fixe) return;
          var b = cleValides[it.bloc];
          var defauts = diagnostiquer(it.q, { texte: tx, bannies: bannies, production: b && b.production, vous: vousQ }, opts);
          var double = vues.filter(function (v) { return semblables(v, it.q); })[0];
          if (double) defauts.push({ code: 'doublon', motif: 'question en double', consigne: 'cette question répète « ' + double.slice(0, 70) + ' » : fais évaluer un autre aspect du texte' });
          vues.push(it.q);
          if (defauts.length) res.aReparer.push({ n: n, kind: k, i: i, q: it.q, motif: defauts[0].motif, defauts: defauts, production: b && b.production, vous: vousQ });
        });
      });
    });
    total = totalNote(total, res.sujets);
    res.total = total;
    res.controles.push({ ok: Math.abs(total - plan.total) < 0.001,
      libelle: 'Barème : ' + total + ' / ' + plan.total + ' points' + (Math.abs(total - plan.total) < 0.001 ? '' : ' — à ajuster') });
    if (plan.support === 'texte') {
      res.controles.push({ ok: nbQ > 0, libelle: nbQ + ' question(s) rédigée(s) sur le texte' });
    }
    res.controles.push(libelleEnonces(res.aReparer, false));
    if (nbQ) {
      res.controles.push({ ok: !corrigesManquants && !baremesNonVentiles,
        libelle: corrigesManquants ? corrigesManquants + ' question(s) sans corrigé — à compléter'
          : baremesNonVentiles ? baremesNonVentiles + ' corrigé(s) sans barème ventilé — à préciser'
          : 'Corrigé rédigé et barème ventilé pour chaque question' });
      if (citationsCorrige) res.controles.push({ ok: false, libelle: citationsCorrige + ' citation(s) du corrigé introuvable(s) dans le texte — à vérifier' });
    }
    var sujetsVides = res.sujets.filter(function (s) { return s.genre !== 'presentation' && !s.texte; });
    if (plan.sujets.length) {
      res.controles.push({ ok: !sujetsVides.length,
        libelle: sujetsVides.length ? sujetsVides.length + ' sujet(s) non rédigé(s) — à compléter' : res.sujets.filter(function (s) { return s.genre !== 'presentation'; }).length + ' sujet(s) rédigé(s)' });
    }
    /* La progression repérage → interprétation ne vaut que pour des QUESTIONS
       (compréhension, langue). Une contraction (résumé + discussion) n'en a
       pas : « repérage 0 %, progression incomplète » y était un faux défaut. */
    if (total > 0 && Object.keys(parNiveau).length && plan.support === 'texte' && ref && ref.questionnement
        && (plan.comp.points || plan.expl.points)) {
      var tq = Object.keys(parNiveau).reduce(function (a, k2) { return a + parNiveau[k2]; }, 0) || 1;
      var rep = Math.round((parNiveau.reperage || 0) / tq * 100);
      var inter = Math.round((parNiveau.interpretation || 0) / tq * 100);
      var eq = ref.questionnement.equilibre || {};
      var hors = [];
      if (eq.reperage && (rep < eq.reperage[0] - 10 || rep > eq.reperage[1] + 10)) hors.push('repérage ' + eq.reperage.join('-') + ' %');
      if (eq.interpretation && inter < Math.max(1, eq.interpretation[0] - 5)) hors.push('interprétation ≥ ' + eq.interpretation[0] + ' %');
      res.controles.push({ ok: rep > 0 && inter > 0 && !hors.length,
        libelle: 'Niveaux : repérage ' + rep + ' %, interprétation ' + inter + ' % des points classés'
          + (!(rep > 0 && inter > 0) ? ' — progression incomplète' : hors.length ? ' — hors des repères (' + hors.join(', ') + ')' : '') });
    }
    /* Texte fautif : il doit rester le texte source, fautes en plus. */
    res.sujets.forEach(function (s) {
      if (s.genre !== 'fautif' || !s.texte) return;
      var src = (ctx.textes || []).filter(function (t) { return t.role === 'fautif'; })[0];
      var ms = src ? (src.words || compterMots(src.text)) : 0, mf = compterMots(s.texte);
      var fautes = (s.corrige.match(/→|->/g) || []).length;
      res.controles.push({ ok: ms && Math.abs(mf - ms) <= Math.max(6, ms * 0.1),
        libelle: 'Texte fautif : ' + mf + ' mots (source : ' + ms + ')' });
      res.controles.push({ ok: fautes === 15, libelle: fautes + ' faute(s) listée(s) au corrigé (15 attendues)' });
    });
    /* Résumé : le nombre de mots attendu doit figurer dans la consigne. */
    var sp = support[0];
    var vous = secondCycle(ctx.struct, ctx.classe);
    if (sp) {
      var mots = sp.words || compterMots(sp.text);
      Object.keys(res.questions).forEach(function (n) {
        res.questions[n].expl.forEach(function (it) {
          var b = cleValides[it.bloc];
          if (b && b.production === 'resume' && it.q.indexOf(String(mots)) < 0) {
            /* Le nombre de mots du texte DOIT figurer dans la consigne : le
               candidat ne recompte pas 550 mots. */
            it.q = 'Ce texte compte ' + mots + ' mots. ' + it.q.replace(/^\s*Ce texte compte \d+ mots\.\s*/i, '')
              + (/\d/.test(it.q) ? '' : ' (résumé d’environ ' + Math.round(mots / 4) + ' mots, analyse d’environ ' + Math.round(mots / 3)
                 + ' mots, à 10 % près. ' + (vous ? 'Vous indiquerez' : 'Indique') + ' le nombre de mots employés.)');
          }
        });
      });
      /* Le texte de la contraction : argumentatif ou explicatif, contemporain, 550 à 650
         mots (Draft EST). On dit précisément ce qui manque, et quoi faire. */
      if (plan.productions.some(function (p) { return p.genre === 'resume'; }) && plan.texteSupport) {
        var bo = plan.texteSupport, typ = String(sp.type || '').toUpperCase();
        var okLong = mots >= bo.min && mots <= bo.max, okType = typ === 'ARGUMENTATIF' || typ === 'EXPLICATIF';
        if (!okLong || !okType) {
          res.controles.push({ ok: false, libelle: 'Texte de la contraction : ' + (okType ? typ.toLowerCase() : (typ ? typ.toLowerCase() : 'type inconnu') + ' au lieu d’argumentatif ou explicatif')
            + ', ' + mots + ' mots' + (okLong ? '' : ' au lieu de ' + bo.min + '-' + bo.max)
            + ' — remplacez-le par un texte argumentatif ou explicatif contemporain de ' + bo.min + ' à ' + bo.max + ' mots (onglet Corpus, « Importer un corpus »).' });
        }
      }
    }
    /* La consigne générale d'une épreuve à sujets au choix est la phrase du
       descriptif, pas une paraphrase (« deux parties dont une obligatoire »). */
    var nbAuChoix = plan.sujets.filter(function (s) { return s.auChoix; }).length + (plan.sujetTexte ? 1 : 0);
    if (plan.sujetTexte && nbAuChoix > 1) res.consigne = 'Le candidat traitera l’un des ' + nbAuChoix + ' sujets au choix.';
    exigencesReflexion(res, ctx, cleValides, opts);
    return res;
  }

  /* ------------------------------------------------------------------
     5 bis. EXIGENCES DES SUJETS DE RÉFLEXION (16/10/2026)
     ------------------------------------------------------------------
     La formation DEMANDE à Ambassa un résumé modèle au quart, un barème
     sur 9 ou sur 20, le vouvoiement, les seules œuvres de la classe. Rien
     de cela n'était VÉRIFIÉ : une IA qui écrit « (162 mots) » sous un
     résumé de 230 mots passait. Comme pour le résumé de l'Atelier, on
     recompte : Ambassa ne s'auto-certifie pas. */

  /* Le résumé modèle d'un corrigé : le paragraphe qui précède la DERNIÈRE
     mention « (N mots) ». Renvoie { annonce, compte } ou null. */
  function resumeModele(corrige) {
    var s = String(corrige || ''), re = /\(\s*(?:environ\s+|soit\s+)?(\d{2,4})\s*mots?\s*\)/gi, m, der = null;
    while ((m = re.exec(s))) {
      // « (150 mots) » dans la ligne du barème n'est pas le résumé modèle.
      var debut = s.lastIndexOf('\n', m.index) + 1, fin = s.indexOf('\n', m.index);
      if (!/bar[eè]me/i.test(s.slice(debut, fin < 0 ? s.length : fin))) der = m;
    }
    if (!der) return null;
    var avant = s.slice(0, der.index).split(/\n/).map(function (x) { return x.trim(); }).filter(Boolean);
    var para = avant.length ? avant[avant.length - 1] : '';
    // « Résumé modèle : … » — l'étiquette ne compte pas.
    para = para.replace(/^(?:\(?\d\)?[.)]?\s*)?(?:-\s*)?r[ée]sum[ée][^:«]{0,30}:\s*/i, '').replace(/^[«"]\s*|\s*[»"]\s*$/g, '');
    return { annonce: parseInt(der[1], 10), compte: compterMots(para), debut: der.index, fin: der.index + der[0].length };
  }

  /* Somme d'une ligne « Barème : … » : les nombres suivis de « pt(s) » ou
     « point(s) » HORS parenthèses (les parenthèses ventilent un critère,
     elles ne s'ajoutent pas). Renvoie null s'il n'y a pas de barème chiffré. */
  function sommeBareme(corrige) {
    var lignes = String(corrige || '').split(/\n/).filter(function (x) { return /bar[eè]me/i.test(x); });
    if (!lignes.length) return null;
    var l = lignes[lignes.length - 1].replace(/^.*?bar[eè]me\s*(?:[:\-—]|sur\s+\d+\s*[:\-—]?)?/i, '');
    var prof = 0, plat0 = '';
    for (var i = 0; i < l.length; i++) {
      var c = l.charAt(i);
      if (c === '(') prof++;
      else if (c === ')') prof = Math.max(0, prof - 1);
      else if (!prof) plat0 += c;
    }
    // Parenthèse jamais refermée = ligne TRONQUÉE (« … (vocabulaire 1, o ») :
    // ses totaux visibles ne prouvent rien.
    if (prof) return NaN;
    var re = /(\d+(?:[.,]\d+)?)\s*(?:pts?|points?)\b/gi, m, tot = 0, vu = 0;
    while ((m = re.exec(plat0))) { tot += parseFloat(m[1].replace(',', '.')); vu++; }
    return vu ? Math.round(tot * 100) / 100 : null;
  }

  /* Titres des œuvres au programme des AUTRES classes que celle-ci. */
  function oeuvresHorsClasse(ref, classe) {
    if (!ref || !ref.oeuvres || !ref.cleClasse) return [];
    var cle = ref.cleClasse(classe), out = [];
    Object.keys(ref.oeuvres).forEach(function (k) {
      if (k === cle) return;
      ref.oeuvres[k].forEach(function (o) { out.push({ titre: o.titre, classe: k }); });
    });
    return out;
  }

  /* Une citation attribuée à un nom propre : « … » — Victor Hugo ;
     « … » (Senghor) ; comme l'écrit Mongo Beti… */
  function attributions(s) {
    var t = String(s || ''), out = [], m;
    var NOM = '([A-ZÀ-Ý][a-zà-ÿ\'’-]+(?:\\s+(?:de\\s+|d’|d\')?[A-ZÀ-Ý][a-zà-ÿ\'’-]+){0,2})';
    var re1 = new RegExp('»\\s*(?:[,(—–-]\\s*)+' + NOM, 'g');
    var re2 = new RegExp('(?:écrit|écrivait|affirme|affirmait|déclare|déclarait|disait|soutient|pensait|selon)\\s+' + NOM, 'g');
    var EXCLUS = /^(Vous|Expliquez|Discutez|Commentez|Appréciez|Montrez|Analysez|En|Le|La|Les|Un|Une|Dans|Pour|Par|Ce|Cette|Il|Elle|On)$/;
    [re1, re2].forEach(function (re) {
      while ((m = re.exec(t))) { var nom = m[1].trim(); if (!EXCLUS.test(nom.split(/\s+/)[0])) out.push(nom); }
    });
    return out;
  }

  /* Le sujet recopie-t-il le texte support ? Douze mots consécutifs du
     texte retrouvés dans le sujet suffisent à le dire. */
  function recopie(sujet, texte) {
    var ps = plat(sujet), mt = plat(texte).trim().split(' ');
    if (mt.length < 24) return false;
    for (var i = 0; i + 12 <= mt.length; i += 6) {
      if (ps.indexOf(' ' + mt.slice(i, i + 12).join(' ') + ' ') >= 0) return true;
    }
    return false;
  }

  /* Recale une citation sur le texte : Ambassa écrit « les élites
     occidentales » quand le texte dit « ces élites occidentales ». Si un
     passage du texte reprend au moins 85 % de ses mots dans l'ordre, on
     substitue le passage EXACT (règle du verbatim). Sinon, null : la
     citation reste signalée. */
  function recaler(cit, texte) {
    var c = String(cit || '');
    if (/\[|…|\.\.\./.test(c)) return null;
    var cw = plat(c).trim().split(' ').filter(Boolean), n = cw.length;
    if (n < 4) return null;
    var src = String(texte || ''), mots = [], re = /\S+/g, m;
    while ((m = re.exec(src))) {
      plat(m[0]).trim().split(' ').filter(Boolean).forEach(function (w) { mots.push({ w: w, d: m.index, f: m.index + m[0].length }); });
    }
    var best = null;
    for (var i = 0; i < mots.length; i++) {
      if (mots[i].w !== cw[0] && (i + 1 >= mots.length || mots[i + 1].w !== cw[1])) continue;
      for (var L = Math.max(3, n - 2); L <= n + 2 && i + L <= mots.length; L++) {
        var j = 0, k = 0, com = 0;
        while (j < n && k < L) {
          if (cw[j] === mots[i + k].w) { com++; j++; k++; }
          else if (k + 1 < L && cw[j] === mots[i + k + 1].w) k++;
          else j++;
        }
        var score = com / Math.max(n, L);
        if (score >= 0.85 && (!best || score > best.score)) best = { score: score, d: mots[i].d, f: mots[i + L - 1].f };
      }
    }
    if (!best) return null;
    var exact = src.slice(best.d, best.f).replace(/^[«"“\s]+|[»"”\s]+$/g, '').replace(/[,;:]$/, '');
    // Le point final du texte ne s'ajoute pas à une citation qui n'en avait pas.
    return /[.!?]$/.test(c.trim()) ? exact : exact.replace(/\.$/, '');
  }
  function recalerCitations(str, texte) {
    var tp = plat(texte), nb = 0;
    if (!str || !texte) return { s: str, nb: 0 };
    var out = String(str).replace(/«\s*([^»]{1,400}?)\s*»/g, function (tout, c) {
      if (tp.indexOf(plat(c)) >= 0) return tout;
      var r = recaler(c, texte);
      if (!r) return tout;
      nb++;
      return '« ' + r + ' »';
    });
    return { s: out, nb: nb };
  }

  /* PASSE DE RÉPARATION — avant les contrôles. Ce qui se répare sans
     l'enseignant se répare : il ne reçoit que ce qui demande son jugement
     (16/10/2026 : neuf alertes sur une épreuve dont sept étaient de la
     mécanique — barèmes tronqués, nombre de mots faux, citation à un mot
     près). Chaque réparation est consignée dans `res.reparations`. */
  function reparerReflexion(res, ctx, cleValides) {
    var plan = ctx.plan, notes = [];
    var sp = (ctx.textes || []).filter(function (t) { return t.role === 'support'; })[0];
    var com = (ctx.textes || []).filter(function (t) { return t.role === 'commentaire'; })[0];
    var seconde = en2nde(M(), ctx.classe);
    var nbCit = 0, nbBar = 0, nbMots = 0;
    function poserBareme(corrige, ligne) {
      var garde = String(corrige || '').split('\n').filter(function (l) { return !/bar[eè]me/i.test(l); }).join('\n').replace(/\s+$/, '');
      return garde + '\n' + ligne;
    }
    Object.keys(res.questions || {}).forEach(function (n) {
      var tx = (ctx.textes || []).filter(function (t) { return String(t.n) === String(n); })[0];
      var texte = tx ? tx.text : (sp && sp.text);
      ['comp', 'expl'].forEach(function (k) {
        (res.questions[n][k] || []).forEach(function (it) {
          if (!it.fixe) { var rq = recalerCitations(it.q, texte); it.q = rq.s; nbCit += rq.nb; }
          var rc = recalerCitations(it.corrige, texte); it.corrige = rc.s; nbCit += rc.nb;
          var b = cleValides[it.bloc];
          if (!b || !b.production || !it.corrige) return;
          var off = it.pts === 8 && b.production === 'resume' ? BAREMES.resume2nde
            : it.pts === 10 && b.production === 'discussion' ? BAREMES.discussion2nde
            : it.pts === 9 ? BAREMES[b.production] : null;
          if (off && sommeBareme(it.corrige) !== it.pts) { it.corrige = poserBareme(it.corrige, off); nbBar++; }
          if (b.production === 'resume') {
            var rm = resumeModele(it.corrige);
            if (rm && Math.abs(rm.compte - rm.annonce) > Math.max(2, rm.annonce * 0.03)) {
              it.corrige = it.corrige.slice(0, rm.debut) + '(' + rm.compte + ' mots)' + it.corrige.slice(rm.fin);
              nbMots++;
            }
          }
        });
      });
    });
    res.sujets.forEach(function (s) {
      if (!s.corrige || s.genre === 'presentation') return;
      if (s.genre === 'commentaire' && com) {
        var rc = recalerCitations(s.corrige, com.text); s.corrige = rc.s; nbCit += rc.nb;
        /* Le texte recopié dans la consigne : on garde ce qui le SUIT. */
        var t = String(com.text || '').trim(), fin = t.slice(-40), i = String(s.texte || '').lastIndexOf(fin);
        /* Seulement si le sujet COMMENCE par le texte : une consigne qui en
           cite la fin (« Montrez comment « … » ») ne doit pas être amputée. */
        var amorce = plat(t.slice(0, 60)).trim();
        var commence = amorce.length > 20 && plat(s.texte).slice(0, amorce.length + 40).indexOf(amorce) >= 0;
        if (t.length >= 80 && i >= 0 && commence) {
          var reste = s.texte.slice(i + fin.length).replace(/^[\s»"”.…]+/, '').trim();
          if (reste.length > 30) s.texte = reste;
        }
      }
      var off2 = s.genre === 'commentaire' ? (seconde ? BAREMES.commentaire2nde : BAREMES.commentaire)
        : s.genre === 'dissertation' ? BAREMES.dissertation : null;
      if (off2 && s.pts === 20 && sommeBareme(s.corrige) !== 20) { s.corrige = poserBareme(s.corrige, off2); nbBar++; }
    });
    if (nbBar) notes.push(nbBar + ' barème(s) officiel(s) reposé(s) (absent, tronqué ou faux dans le corrigé d’Ambassa)');
    if (nbMots) notes.push('nombre de mots du résumé modèle recompté et corrigé');
    if (nbCit) notes.push(nbCit + ' citation(s) recalée(s) mot pour mot sur le texte');
    res.reparations = notes;
    if (notes.length) res.controles.push({ ok: true, libelle: 'Réparé automatiquement : ' + notes.join(' ; ') + '.' });
  }

  /* Les trois opérations d'une question de langue (Draft EST : « repérage,
     analyse, interprétation »). Le classement général des verbes laissait
     « Repérez », « Analysez », « Dégagez l'effet » sans niveau et rangeait
     « Précisez la nature » au repérage : la langue a le sien. */
  function operationLangue(q) {
    var t = norm(String(q || '').replace(/«[^»]*»/g, ' ')).replace(/^.*?—\s*/, '').replace(/^[a-d][.)]\s*/, '');
    if (/^(interpretez|interprete|degagez|degage)\b|\b(effet|effets|valeur expressive|role)\b|^(que|qu) (traduit|revele|exprime|suggere)|^montrez (le role|l effet|ce que)|^a quoi sert/.test(t)) return 'interpretation';
    if (/^(analysez|analyse|precisez|donnez|expliquez|justifiez|transformez|reecrivez|remplacez|transposez|decomposez|indiquez|caracterisez|classez)\b|\b(nature|fonction|construction|valeur|mode|temps|type de phrase|forme)\b/.test(t)) return 'analyse';
    if (/^(relevez|releve|identifiez|identifie|reperez|repere|citez|soulignez|retrouvez|encadrez|nommez)\b/.test(t)) return 'reperage';
    return '';
  }
  function exigencesLangue(res, ctx, cleValides) {
    var plan = ctx.plan, struct = ctx.struct;
    if (!struct || !/langue4rub|resumeLangue/.test(struct.grille || '') || !secondCycle(struct, ctx.classe)) return;
    var manque = [];
    Object.keys(cleValides).forEach(function (cle) {
      var b = cleValides[cle];
      if (b.production || b.kind !== 'expl' || plan.expl.rubriques.length < 2) return;
      var vus = {};
      Object.keys(res.questions || {}).forEach(function (n) {
        (res.questions[n].expl || []).forEach(function (it) { if (it.bloc === cle) vus[operationLangue(it.q)] = 1; });
      });
      if (!Object.keys(vus).length) return;   // bloc vide : déjà signalé
      var m = ['reperage', 'analyse', 'interpretation'].filter(function (o) { return !vus[o]; });
      if (m.length) manque.push(b.titre.replace(/^[IVX]+\.\s*/, '') + ' (sans ' + m.map(function (o) { return o === 'reperage' ? 'repérage' : o === 'interpretation' ? 'interprétation' : o; }).join(', ') + ')');
    });
    res.controles.push({ ok: !manque.length, libelle: manque.length
      ? 'Langue : chaque rubrique doit aller du repérage à l’analyse puis à l’interprétation — à reprendre : ' + manque.join(' ; ') + '.'
      : 'Langue : repérage, analyse et interprétation dans chaque rubrique' });
  }

  /* Le texte du commentaire composé : un extrait d'une œuvre AU PROGRAMME
     de la classe (règle de Jacques, 16/10/2026). Reconnu à son titre ou à
     sa référence. */
  function texteDeLOeuvre(f, ref, classe) {
    var l = ref && ref.oeuvresDe ? ref.oeuvresDe(classe) : [];
    var h = plat([f && f.title, f && f.reference, f && f.author].join(' '));
    return l.filter(function (o) {
      var mots = plat(o.titre).trim().split(' ').filter(function (w) { return w.length > 3; });
      return mots.length && mots.every(function (w) { return h.indexOf(' ' + w + ' ') >= 0; });
    })[0] || null;
  }

  function exigencesReflexion(res, ctx, cleValides, opts) {
    exigencesLangue(res, ctx, cleValides);
    var comT = (ctx.textes || []).filter(function (t) { return t.role === 'commentaire'; })[0];
    if (comT && ctx.plan.sujets.some(function (s) { return s.genre === 'commentaire'; })) {
      var oe = texteDeLOeuvre(comT, M(opts), ctx.classe);
      var liste = (M(opts).oeuvresDe ? M(opts).oeuvresDe(ctx.classe) : []).map(function (o) { return '« ' + o.titre + ' »'; }).join(', ');
      res.controles.push({ ok: !!oe, libelle: oe
        ? 'Commentaire composé : extrait de « ' + oe.titre + ' », œuvre au programme'
        : 'Commentaire composé : le texte n’est pas tiré d’une œuvre au programme de la classe (' + (liste || 'liste à renseigner') + ') — importez un extrait de 20 à 30 lignes de l’une d’elles.' });
    }
    var plan = ctx.plan, ref = M(opts);
    var vous = secondCycle(ctx.struct, ctx.classe);
    var sp = (ctx.textes || []).filter(function (t) { return t.role === 'support'; })[0];
    var mots = sp ? (sp.words || compterMots(sp.text)) : 0;

    /* ① Productions sur le texte : résumé modèle recompté, barème additionné. */
    Object.keys(res.questions || {}).forEach(function (n) {
      (res.questions[n].expl || []).forEach(function (it) {
        var b = cleValides[it.bloc];
        if (!b || !b.production || !it.corrige) return;
        if (b.production === 'resume' && mots) {
          var quart = Math.round(mots / 4), rm = resumeModele(it.corrige);
          if (!rm) {
            res.controles.push({ ok: false, libelle: 'Corrigé du résumé : aucun résumé modèle suivi de son nombre de mots « (N mots) » — à rédiger (environ ' + quart + ' mots).' });
          } else {
            var horsMarge = Math.abs(rm.compte - quart) > quart * 0.1;
            res.controles.push({ ok: !horsMarge,
              libelle: 'Résumé modèle : ' + rm.compte + ' mots recomptés pour ' + quart + ' attendus'
                + (horsMarge ? ' — hors de la marge de 10 % (' + Math.ceil(quart * 0.9) + ' à ' + Math.floor(quart * 1.1) + '), à reprendre' : ', dans la marge de 10 %') });
          }
        }
        var sb = sommeBareme(it.corrige);
        if (it.pts && sb !== null && Math.abs(sb - it.pts) > 0.001) {
          res.controles.push({ ok: false, libelle: 'Barème du corrigé « ' + b.titre + ' » : ' + sb + ' points ventilés pour ' + it.pts + ' — à rectifier.' });
        }
      });
    });

    /* ② Sujets rédigés : barème complet, texte non recopié, vouvoiement. */
    var com = (ctx.textes || []).filter(function (t) { return t.role === 'commentaire'; })[0];
    res.sujets.forEach(function (s) {
      if (s.genre === 'presentation' || !s.texte) return;
      if (/commentaire|dissertation|essai/.test(s.genre) && s.corrige) {
        var sb = sommeBareme(s.corrige);
        if (sb === null) res.controles.push({ ok: false, libelle: 'Corrigé « ' + s.titre + ' » : aucune ligne « Barème : … » chiffrée — à ajouter.' });
        else if (s.pts && Math.abs(sb - s.pts) > 0.001) res.controles.push({ ok: false, libelle: 'Corrigé « ' + s.titre + ' » : barème de ' + sb + ' points pour un sujet sur ' + s.pts + ' — à rectifier.' });
      }
      if (s.genre === 'commentaire' && com && recopie(s.texte, com.text)) {
        res.controles.push({ ok: false, libelle: 'Sujet de commentaire : des passages du texte y sont recopiés — il est déjà imprimé à part ; ne gardez que la consigne.' });
      }
      if (vous && tutoie(s.texte)) {
        res.controles.push({ ok: false, libelle: 'Sujet « ' + s.titre + ' » : tutoiement — le second cycle compose au vouvoiement (« Vous montrerez… »).' });
      }
      /* Une citation attribuée à un auteur réel ne s'imprime pas sans
         vérification : Ambassa a déjà prêté des mots à des écrivains. */
      if (/dissertation|essai/.test(s.genre)) {
        var at = attributions(s.texte);
        if (at.length) res.controles.push({ ok: false, libelle: 'Sujet « ' + s.titre + ' » : citation attribuée à ' + at[0] + ' — vérifiez l’auteur et les mots exacts dans l’œuvre avant d’imprimer, ou reformulez en affirmation non attribuée.' });
      }
    });

    /* ③ Les œuvres citées sont celles de LA classe — jamais celles d'une
       autre, jamais une œuvre du 1er cycle au 2nd (règle du 04/10). */
    var hors = oeuvresHorsClasse(ref, ctx.classe);
    if (hors.length && ref.oeuvresDe && ref.oeuvresDe(ctx.classe).length) {
      var tout = [];
      res.sujets.forEach(function (s) { tout.push(s.texte, s.corrige); });
      Object.keys(res.questions || {}).forEach(function (n) {
        ['comp', 'expl'].forEach(function (k) { (res.questions[n][k] || []).forEach(function (it) { tout.push(it.q, it.corrige); }); });
      });
      var p0 = plat(tout.join(' \n '));
      var vus = hors.filter(function (o) { var pt = plat(o.titre); return pt.trim().length > 5 && p0.indexOf(pt) >= 0; });
      if (vus.length) {
        res.controles.push({ ok: false, libelle: 'Œuvre hors programme de la classe : « ' + vus[0].titre + ' » (' + vus[0].classe + ')' + (vus.length > 1 ? ' et ' + (vus.length - 1) + ' autre(s)' : '') + ' — remplacez par une œuvre au programme.' });
      }
    }
  }

  function libelleEnonces(aReparer, apresReecriture) {
    if (!aReparer.length) {
      return { cle: 'enonces', ok: true, libelle: apresReecriture
        ? 'Énoncés conformes (réécrits automatiquement par Ambassa)'
        : 'Énoncés conformes : verbes de consigne, citations exactes, aucune formulation proscrite ni doublon' };
    }
    var motifs = {};
    aReparer.forEach(function (r) { (r.defauts || [{ motif: r.motif }]).forEach(function (d) { motifs[d.code || d.motif] = d.code === 'citation' ? 'citation absente du texte' : d.motif; }); });
    var liste = Object.keys(motifs).map(function (k) { return motifs[k]; }).slice(0, 4).join(', ');
    return { cle: 'enonces', ok: false, libelle: aReparer.length + ' question(s) à reprendre (' + liste + ')' + (apresReecriture ? ' — reformulez-les' : '') };
  }

  /* Réécriture ciblée des questions refusées par le contrôle. Le texte
     support est joint quand une citation est en cause : on ne peut pas
     demander de citer juste sans montrer ce qu'il faut citer. */
  function promptReparation(aReparer, texte) {
    var l = [];
    l.push('Réécris chaque question ci-dessous pour la rendre conforme au MINESEC. Garde la même tâche, le même niveau et la même difficulté ; corrige seulement ce qui est signalé.');
    aReparer.forEach(function (r, i) {
      var consignes = (r.defauts || [{ consigne: 'supprime la formulation « ' + r.motif + ' »' }]).map(function (d) { return d.consigne; }).join(' ; ');
      l.push((i + 1) + '. ' + r.q);
      l.push('   → À corriger : ' + consignes + '.');
    });
    var besoinTexte = texte && aReparer.some(function (r) { return (r.defauts || []).some(function (d) { return d.code === 'citation'; }); });
    if (besoinTexte) {
      l.push('');
      l.push('TEXTE SUPPORT (les citations se recopient ici, mot pour mot) :');
      l.push(String(texte).slice(0, 3800));
    }
    l.push('');
    l.push('JSON strict : {"questions":["question 1 réécrite","question 2 réécrite"]}');
    return l.join('\n');
  }

  /* Une réécriture n'est acceptée que si elle passe TOUT le contrôle — pas
     seulement le défaut qui l'avait fait refuser. */
  function appliquerReparation(res, o, opts, textes) {
    var liste = (o && Array.isArray(o.questions)) ? o.questions : [];
    var bannies = motsBannis(opts);
    var restant = [];
    res.aReparer.forEach(function (r, i) {
      var q = typeof liste[i] === 'string' ? liste[i].trim() : '';
      var tx = (textes && textes[r.n]) || '';
      /* La réécriture repasse le contrôle COMPLET de son bloc : une discussion
         réécrite sans citation, ou une consigne réécrite en tutoyant, reste
         refusée. */
      var prod = r.production || ((r.defauts || []).some(function (d) { return d.code === 'longueur'; }) ? 'expression' : null);
      if (q.length > 6 && !diagnostiquer(q, { texte: tx, bannies: bannies, production: prod, vous: !!r.vous }, opts).length) res.questions[r.n][r.kind][r.i].q = q;
      else restant.push(r);
    });
    res.aReparer = restant;
    res.controles = res.controles.map(function (c) {
      return c.cle === 'enonces' ? libelleEnonces(restant, true) : c;
    });
    return res;
  }

  /* ------------------------------------------------------------------
     6. APPEL
     ------------------------------------------------------------------ */

  function appeler(prompt, sys, opts) {
    opts = opts || {};
    var entetes = { 'Content-Type': 'application/json' };
    if (opts.token) entetes['Authorization'] = 'Bearer ' + opts.token;
    var corps = { action: 'epreuve_minesec', prompt: prompt, sysPrompt: sys || '',
                  max_tokens: opts.max || 6000, temperature: 0.3 };
    if (opts.token) corps.token = opts.token;
    /* DÉLAI DE GARDE. Le proxy essaie jusqu'à deux modèles de 60 s chacun,
       puis les replis : au-delà de 150 s, plus rien n'arrivera. Sans ce
       garde, un serveur muet laissait le bouton sur « Ambassa compose… »
       pour toujours, sans un mot. */
    var coupe = (typeof AbortController !== 'undefined') ? new AbortController() : null;
    var minuterie = coupe ? setTimeout(function () { try { coupe.abort(); } catch (e) {} }, opts.delai || 150000) : null;
    var desarmer = function () { if (minuterie) clearTimeout(minuterie); };
    return (opts.fetch || fetch)(opts.url || '/api/ia_proxy.php', {
      method: 'POST', headers: entetes, body: JSON.stringify(corps),
      signal: coupe ? coupe.signal : undefined
    }).then(function (r) {
      desarmer();
      if (r.status === 402 || r.status === 429) throw new Error('quota');
      if (!r.ok) throw new Error('http_' + r.status);
      return r.json();
    }).then(function (j) {
      return extraireJSON(j.text || j.reponse || j.response || j.content || '');
    }, function (e) {
      desarmer();
      if (e && e.name === 'AbortError') throw new Error('delai');
      throw e;
    });
  }

  /* Compose une épreuve. `ctx` : plan, struct, classe, serie, theme, textes
     (avec `role`), fixes (mode compléter), exemples. `opts.reparer` : une
     fonction qui dit si l'on peut dépenser un appel de plus pour réécrire
     les questions fautives (le quota se décide chez l'appelant). */
  function composer(ctx, opts) {
    opts = opts || {};
    var sys = formationMinesec(ctx.struct, ctx.plan, ctx.classe, ctx.exemples, opts);
    var prompt = ajusterPrompt(ctx);
    return appeler(prompt, sys, opts).then(function (o) {
      var res = validerEpreuve(o, ctx, opts);
      if (!res.aReparer.length || !opts.reparer) return res;
      /* `reparer` peut répondre tout de suite (booléen) ou plus tard
         (promesse) : l'Atelier demande l'accord au SERVEUR de quota. */
      return Promise.resolve(opts.reparer()).then(function (accord) {
        if (!accord) return res;
        if (opts.etape) opts.etape('Ambassa réécrit ' + res.aReparer.length + ' question(s) non conforme(s)…');
        /* Le proxy refuse deux appels du même compte à moins de 2 s. */
        return new Promise(function (ok) { setTimeout(ok, opts.pause == null ? 2300 : opts.pause); })
          .then(function () {
            var principal = (ctx.textes || []).filter(function (t) { return t.role === 'support'; })[0];
            return appeler(promptReparation(res.aReparer, principal && principal.text), sys, Object.assign({}, opts, { max: 1500 }));
          })
          .then(function (o2) {
            var parN = {};
            (ctx.textes || []).forEach(function (t) { if (t.role === 'support') parN[t.n] = t.text || ''; });
            return appliquerReparation(res, o2, opts, parN);
          });
      }).catch(function () { return res; });
    });
  }

  root.VRT_GENERATEUR = {
    scoriesOCR: scoriesOCR, operationLangue: operationLangue, texteDeLOeuvre: texteDeLOeuvre, nettoyerEnonce: nettoyerEnonce, vouvoyer: vouvoyer, tutoie: tutoie,
    classer: classer, segmentsConsigne: segmentsConsigne, planEpreuve: planEpreuve, blocsDuPlan: blocsDuPlan, totalNote: totalNote,
    jetonsNiveau: jetonsNiveau, niveauxCibles: niveauxCibles, classerTextes: classerTextes,
    exemplesOfficiels: exemplesOfficiels, formationMinesec: formationMinesec,
    promptEpreuve: promptEpreuve, ajusterPrompt: ajusterPrompt, octets: octets, PLAFOND_PROMPT: PLAFOND_PROMPT,
    extraireJSON: extraireJSON, repartir: repartir, motifBanni: motifBanni, motsBannis: motsBannis,
    diagnostiquer: diagnostiquer, citations: citations, semblables: semblables, consigneReconnue: consigneReconnue,
    validerEpreuve: validerEpreuve, promptReparation: promptReparation, appliquerReparation: appliquerReparation,
    composer: composer, compterMots: compterMots, TYPES_PREFERES: TYPES_PREFERES
  };
  if (typeof module !== 'undefined' && module.exports) module.exports = root.VRT_GENERATEUR;
})(typeof window !== 'undefined' ? window : globalThis);
