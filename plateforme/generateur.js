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
      support: 'aucun', texteSupport: struct ? (struct.texteSupport || null) : null,
      comp: { points: 0, rubriques: [] }, expl: { points: 0, rubriques: [] },
      productions: [], sujets: [], total: ref ? ref.totalAttendu(struct) : 20,
      encadre: struct ? (struct.encadreSituation || null) : null
    };
    if (!struct) return plan;
    var grille = (struct.grille && ref && ref.grille(struct.grille)) || null;
    var parties = struct.parties || [];
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
    discussion: ['ARGUMENTATIF'],
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

  function formationMinesec(struct, plan, classe, exemples, opts) {
    var ref = M(opts);
    var l = [];
    l.push('RÔLE : tu composes, pour un collègue du MINESEC (Cameroun), une ÉPREUVE DE FRANÇAIS prête à être relue puis imprimée. Tu travailles comme un concepteur de sujets d’examen : sobre, précis, conforme aux textes officiels.');
    l.push('');
    l.push('EXIGENCES MINESEC — elles font foi sur toute autre habitude :');
    if (struct) {
      l.push('- Épreuve : ' + struct.nom + ' (' + struct.examen + ', ' + struct.cycle + '). Durée ' + struct.duree + ', coefficient ' + struct.coeff + ', ' + struct.sujetsAuChoix + ' sujet(s) au choix.');
      if (struct.texteSupport) l.push('- Texte support : ' + struct.texteSupport.min + ' à ' + struct.texteSupport.max + ' mots' + (struct.texteSupport.nature ? ', ' + struct.texteSupport.nature : '') + '.');
      (struct.parties || []).forEach(function (p) {
        l.push('- Partie « ' + p.titre + ' »' + (p.points ? ' /' + p.points : '') + (p.consigne ? ' : ' + p.consigne : ''));
      });
      (struct.interdits || []).forEach(function (x) { l.push('- INTERDIT : ' + x); });
      if (struct.note) l.push('- À savoir : ' + struct.note);
      /* Une structure incertaine se DIT : l'enseignant doit la confirmer sur
         la circulaire, et Ambassa doit le rappeler dans ses remarques. */
      if (struct.avertissement) l.push('- RÉSERVE OFFICIELLE (à reprendre dans "remarques") : ' + struct.avertissement);
      (struct.consignesRedaction || []).forEach(function (x) { l.push('- ' + x); });
    }
    var g = struct && struct.grille && ref ? ref.grille(struct.grille) : null;
    if (g) {
      l.push('- Grille de correction « ' + g.nom + ' » : ' + g.criteres.map(function (c) {
        return c.nom + ' ' + c.points + (c.nombre ? ' × ' + c.nombre : '');
      }).join(' ; ') + (g.note ? '. ' + g.note : '') + '.');
    }
    var q = ref && ref.questionnement;
    if (q) {
      l.push('');
      l.push('QUESTIONNEMENT (mesuré sur les 3 372 questions du corpus officiel) :');
      q.niveaux.forEach(function (nv) {
        l.push('- ' + nv.nom + ' : ' + nv.role + ' Verbes : ' + nv.verbes.map(function (v) { return v.v; }).join(', ') + '. Ex. : ' + nv.exemple);
      });
      l.push('- Progression obligatoire : du repérage vers l’interprétation. Équilibre des points : repérage ' + q.equilibre.reperage.join('-') + ' %, analyse ' + q.equilibre.analyse.join('-') + ' %, interprétation ' + q.equilibre.interpretation.join('-') + ' %.');
      l.push('- Chaque question commence par un verbe de consigne à l’impératif (2e personne du singulier) ou par « Quel/Quelle ». Une question = une tâche vérifiable.');
    }
    var bannies = [];
    if (ref && ref.formulations) bannies = bannies.concat(ref.formulations.questionsBannies || []);
    if (q) bannies = bannies.concat(q.aEviter || []);
    if (bannies.length) {
      l.push('- FORMULATIONS PROSCRITES, sous aucune forme : ' + bannies.map(function (b) { return '« ' + b.motif + ' »'; }).join(', ') + '.');
    }
    l.push('- La partie langue évalue l’USAGE (repérer, transformer, remplacer, réécrire) sur des phrases DU TEXTE, citées entre guillemets. Jamais de définition ni de règle à réciter.');
    if (ref && ref.formulations && ref.formulations.formulesCorrige) {
      var fc = ref.formulations.formulesCorrige;
      l.push('- Formules du corrigé harmonisé : « ' + fc.bepc + ' » (1er cycle) ; « ' + fc.dissertation + ' » (sujets de réflexion) ; « ' + fc.commentaire + ' » (commentaire).');
    }
    if (ref && ref.formulations && ref.formulations.consignesGenerales) {
      ref.formulations.consignesGenerales.forEach(function (x) { l.push('- ' + x); });
    }
    if (exemples && exemples.length) {
      l.push('');
      l.push('EXEMPLES RÉELS du corpus officiel pour cette classe — imite leur forme, pas leur contenu :');
      exemples.forEach(function (f, i) {
        l.push('Exemple ' + (i + 1) + ' (' + (f.level || '') + ', ' + String(f.type || '').toLowerCase() + ')');
        l.push('  Compréhension : ' + String(f.comprehension).slice(0, 420));
        l.push('  Langue et production : ' + String(f.exploitation).slice(0, 420));
      });
    }
    l.push('');
    l.push('RÉDACTION DES QUESTIONS (chaque point est vérifié automatiquement ; une question qui échoue est renvoyée en réécriture) :');
    l.push('- CITATIONS : toute citation entre « » est recopiée MOT POUR MOT depuis le texte support. Jamais de citation approximative, jamais de citation inventée.');
    l.push('- UNE question = UNE tâche vérifiable. Seules les rubriques de langue se scindent en « a. » puis « b. ».');
    l.push('- Aucune question en double, aucune question qui réponde à une autre.');
    l.push('- Aucune question théorique : ni « donne la définition », ni « énonce la règle », ni « qu\u2019est-ce que ». On fait MANIPULER la langue sur une phrase citée.');
    l.push('- Toute consigne de production précise la LONGUEUR attendue (nombre de lignes ou de mots) et le TYPE de texte.');
    l.push('');
    l.push('CORRIGÉ : pour chaque question, une réponse attendue RÉDIGÉE, précise et fondée sur le texte (citations entre guillemets). Dès qu\u2019une question vaut plus d\u2019un point, termine son corrigé par une ligne « Barème : … » qui ventile les points, dont la somme égale les points de la question (ex. : « Barème : 1 pt pour l\u2019idée principale + 0,5 pt × 2 justifications tirées du texte »). Pour un sujet de rédaction : les attentes (idées, plan possible), puis la grille critériée.');
    l.push('Ne fabrique JAMAIS un fait, une date ou une citation d’auteur. Si une information te manque, écris « à vérifier ».');
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
      return 'consigne de contraction : résumé au quart (environ ' + quart + ' mots) ou analyse au tiers (environ ' + tiers
        + ' mots), avec une marge de 10 % ; exige l’indication du nombre de mots employés';
    }
    if (genre === 'discussion') return 'sujet de discussion : un problème TIRÉ DU TEXTE, formulé comme une question ouverte ou une citation du texte suivie de « Discutez » ou « Dans quelle mesure… »';
    if (genre === 'synthese') return 'résumé partiel ou esprit de synthèse sur une partie précise du texte, avec un nombre de mots imposé';
    if (genre === 'essai') return 'sujet d’essai de culture générale lié au thème du texte : le candidat donne son opinion sur un problème précis';
    return 'situation-problème d’expression écrite liée au thème du texte : contexte (situation de vie), tâche, type de texte attendu, longueur, puis trois consignes numérotées 1-2-3';
  }

  function consignesSujet(s) {
    switch (s.genre) {
      case 'dissertation': return 'libellé de dissertation (citation d’auteur exacte OU affirmation), suivi d’une consigne explicite ; préciser le domaine ou le problème posé';
      case 'commentaire': return 'consigne de commentaire composé portant sur le TEXTE 2 fourni ; consigne non contraignante suggérant deux ou trois axes de lecture';
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

    if (plan.support === 'texte' && blocs.length) {
      l.push('');
      l.push('QUESTIONS SUR LE TEXTE 1 — respecte ce barème bloc par bloc :');
      blocs.forEach(function (b) {
        if (b.production) {
          l.push('- bloc "' + b.cle + '" (' + b.titre + ', ' + b.points + ' pts, liste ' + b.kind + ') : UNE seule consigne — ' + consignesProduction(b.production, mots) + '.');
        } else {
          var nbq = b.points <= 2 ? 1 : b.points <= 5 ? 2 : b.points <= 8 ? 3 : 4;
          l.push('- bloc "' + b.cle + '" (' + b.titre + ', ' + b.points + ' pts, liste ' + b.kind + ') : ' + nbq + ' à ' + (nbq + 1) + ' questions'
            + (b.kind === 'comp' ? ', du repérage vers l’interprétation.' : ', manipulations de langue sur des phrases citées du texte ; pour une rubrique de langue, une question « a. » de repérage/analyse puis une question « b. » d’interprétation.'));
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
        l.push('- sujet ' + (i + 1) + ' — ' + s.titre + ' (' + s.points + ' pts' + (s.auChoix ? ', au choix' : '') + ') : ' + consignesSujet(s) + '.');
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
      + '"grille":[{"critere":"…","points":6,"indicateurs":"…"}],"remarques":"ce que l’enseignant doit vérifier"}');
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
    if (contexte.production && contexte.production !== 'resume' && !LONGUEUR.test(norm(q))) {
      d.push({ code: 'longueur', motif: 'longueur attendue non précisée', consigne: 'précise la longueur attendue (nombre de lignes ou de mots) et le type de texte' });
    }
    return d;
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
    return debut.some(function (w) { return IMPERATIFS.indexOf(w) >= 0; });
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

  function propre(s, max) {
    return String(s == null ? '' : s).replace(/\s+\n/g, '\n').trim().slice(0, max || 4000);
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
    var numParRang = {};
    support.forEach(function (t, i) { numParRang[i + 1] = t.n; numParRang[t.n] = t.n; });
    var res = {
      titre: propre(o && o.titre, 160), consigne: propre(o && o.consigne, 600),
      questions: {}, sujets: [], grille: [], remarques: propre(o && o.remarques, 900),
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
            res.questions[n][k].push({ q: q, pts: nombre(v.pts), niveau: String(v.niveau || ''), corrige: propre(v.corrige, 1400), bloc: k, fixe: true });
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
        res.questions[n][k].push({ q: propre(x.q, 900), pts: nombre(x.pts), niveau: String(x.niveau || ''), corrige: propre(x.corrige, 1400), bloc: bloc });
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
      res.sujets.push({ genre: s.genre, titre: s.titre, texte: texte, pts: s.points, auChoix: !!s.auChoix, corrige: propre(v.corrige, 3000) });
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
          var defauts = diagnostiquer(it.q, { texte: tx, bannies: bannies, production: b && b.production }, opts);
          var double = vues.filter(function (v) { return semblables(v, it.q); })[0];
          if (double) defauts.push({ code: 'doublon', motif: 'question en double', consigne: 'cette question répète « ' + double.slice(0, 70) + ' » : fais évaluer un autre aspect du texte' });
          vues.push(it.q);
          if (defauts.length) res.aReparer.push({ n: n, kind: k, i: i, q: it.q, motif: defauts[0].motif, defauts: defauts });
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
    if (total > 0 && Object.keys(parNiveau).length && plan.support === 'texte' && ref && ref.questionnement) {
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
    if (sp) {
      var mots = sp.words || compterMots(sp.text);
      Object.keys(res.questions).forEach(function (n) {
        res.questions[n].expl.forEach(function (it) {
          var b = cleValides[it.bloc];
          if (b && b.production === 'resume' && !/\d/.test(it.q)) {
            it.q += ' (Texte de ' + mots + ' mots : résumé d’environ ' + Math.round(mots / 4) + ' mots, analyse d’environ ' + Math.round(mots / 3) + ' mots, à 10 % près. Indique le nombre de mots employés.)';
          }
        });
      });
    }
    return res;
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
      var prod = (r.defauts || []).some(function (d) { return d.code === 'longueur'; }) ? 'expression' : null;
      if (q.length > 6 && !diagnostiquer(q, { texte: tx, bannies: bannies, production: prod }, opts).length) res.questions[r.n][r.kind][r.i].q = q;
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
    scoriesOCR: scoriesOCR,
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
