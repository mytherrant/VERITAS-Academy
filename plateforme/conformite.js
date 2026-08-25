/* ============================================================================
   VÉRITAS — Garde-fou de conformité MINESEC
   ----------------------------------------------------------------------------
   Deux couches, volontairement séparées :

   COUCHE 1 — contrôles déterministes (ce fichier, hors ligne, instantanés).
     Ils ne portent que sur ce qui est MESURABLE : longueur d'un texte, total
     d'un barème, nombre de sujets au choix, présence d'une formulation bannie,
     champs obligatoires d'un gabarit. Aucun jugement de goût. Ils tournent à
     chaque frappe sans rien coûter.

   COUCHE 2 — analyse Ambassa (api/ia_proxy.php). Elle juge ce qui ne se
     compte pas : une question qui n'évalue pas ce qu'elle prétend, un corpus
     qui ne contient pas le fait de langue annoncé, un axe de lecture qui n'en
     est pas un. Elle coûte un appel : elle se déclenche à la demande, jamais
     en boucle.

   POURQUOI DEUX COUCHES. Une IA qui répond « conforme » sur une longueur de
   texte qu'elle n'a pas comptée est pire qu'inutile : elle donne une caution
   fausse. Tout ce qui se compte se compte ici, en dur, et le résultat est
   FOURNI à Ambassa dans son contexte pour qu'elle ne le recalcule pas.

   Sévérités :
     'bloquant' — contredit une règle officielle vérifiée. On le dit fort.
     'ecart'    — s'écarte de la norme sans la contredire formellement.
     'conseil'  — recommandation du programme, jamais une faute.
   Une structure de confiance 'a_verifier' ne produit JAMAIS de 'bloquant' :
   on ne reproche pas à un enseignant de s'écarter d'une règle incertaine.
   ========================================================================= */

(function (root) {
  'use strict';

  var M = root.MINESEC;

  /* ---------- outils ---------- */

  /* Normalisation de comparaison. Les apostrophes deviennent des espaces :
     « Qu'est-ce qu'un COD ? », « Qu’est-ce qu’un COD ? » et « Qu est ce qu un »
     doivent tous tomber sur le même motif banni. Sans cela le contrôle rate
     précisément la forme que les enseignants écrivent. */
  function norm(s) {
    var t = String(s || '').toLowerCase();
    if (t.normalize) t = t.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    return t.replace(/['’‘`]/g, ' ').replace(/\s+/g, ' ').trim();
  }

  function compterMots(txt) {
    var t = String(txt || '').trim();
    if (!t) return 0;
    return t.split(/\s+/).filter(Boolean).length;
  }

  function ecart(severite, titre, detail, quoiFaire, ancre) {
    return { severite: severite, titre: titre, detail: detail || '', quoiFaire: quoiFaire || '', ancre: ancre || '' };
  }

  /* Une règle issue d'une structure incertaine ne peut pas bloquer. */
  function pondere(structure, severite) {
    if (!structure) return severite;
    if (structure.confiance === 'a_verifier' && severite === 'bloquant') return 'conseil';
    if (structure.confiance === 'standard' && severite === 'bloquant') return 'ecart';
    return severite;
  }

  /* ------------------------------------------------------------------
     CONTRÔLE D'UNE ÉPREUVE
     ------------------------------------------------------------------
     ep      : l'épreuve en cours d'édition
     textes  : les entrées de corpus effectivement sélectionnées
     qPoints : fonction (n, kind, idx) -> points attribués, ou null
     ------------------------------------------------------------------ */

  function verifierEpreuve(ep, textes, qListe, qPoints) {
    var out = [];
    if (!ep) return out;
    textes = textes || [];
    qListe = qListe || function () { return []; };
    qPoints = qPoints || function () { return null; };

    var struct = ep.epreuveCode ? M.epreuveParCode(ep.epreuveCode) : null;

    /* --- 0. Sans structure déclarée, on ne peut rien vérifier de sérieux --- */
    if (!struct) {
      out.push(ecart('conseil',
        'Aucune structure officielle rattachée',
        'Cette épreuve n’est rattachée à aucun examen ni série. Le garde-fou ne peut vérifier ni le barème, ni la longueur du texte, ni le nombre de sujets.',
        'Choisissez l’examen et la série dans les renseignements officiels.',
        'renseignements'));
    }

    /* --- 1. Renseignements officiels --- */
    if (!ep.etab) out.push(ecart('ecart', 'Établissement non renseigné', '', 'Renseignez l’en-tête : le sujet part à l’impression sans identification.', 'renseignements'));
    if (!ep.classe) out.push(ecart('ecart', 'Classe non renseignée', '', 'Sans classe, ni le barème ni la longueur des textes ne peuvent être jugés.', 'renseignements'));
    if (!ep.duree) out.push(ecart('conseil', 'Durée non renseignée', '', struct ? ('La norme prévoit ' + struct.duree + '.') : '', 'renseignements'));
    if (!ep.coeff) out.push(ecart('conseil', 'Coefficient non renseigné', '', struct ? ('La norme prévoit ' + struct.coeff + '.') : '', 'renseignements'));

    if (struct && ep.duree && struct.duree && norm(ep.duree) !== norm(struct.duree)) {
      out.push(ecart(pondere(struct, 'ecart'),
        'Durée différente de la norme',
        'Vous avez indiqué « ' + ep.duree + ' » ; ' + struct.nom + ' se compose en ' + struct.duree + '.',
        'Alignez la durée ou justifiez l’écart (devoir de séquence plutôt qu’examen).',
        'renseignements'));
    }
    if (struct && ep.coeff && struct.coeff && struct.coeff !== '—' && String(ep.coeff).trim() !== String(struct.coeff).trim()) {
      out.push(ecart(pondere(struct, 'ecart'),
        'Coefficient différent de la norme',
        'Vous avez indiqué ' + ep.coeff + ' ; la norme est ' + struct.coeff + '.',
        'Vérifiez sur la circulaire de la session.',
        'renseignements'));
    }

    /* --- 2. Aucun texte support --- */
    if (!textes.length) {
      out.push(ecart('bloquant', 'Aucun texte support',
        'Une épreuve de français s’appuie sur au moins un texte.',
        'Ajoutez un texte depuis le corpus.', 'textes'));
      return out;
    }

    /* --- 2 bis. Le contenu a-t-il suivi la metadonnee ? ---
       Le repertoire descend en deux temps : l'index (metadonnees + amorce de
       180 caracteres) puis le texte integral. Quand le second transfert
       echoue, `f.words` reste juste pendant que `f.text` n'est qu'une
       amorce -- et le controle de longueur ci-dessous, qui lit `f.words` en
       priorite, declare alors conforme un texte que l'epreuve ne contient
       pas. Il faut le dire AVANT de juger quoi que ce soit d'autre : tous
       les controles qui suivent portent sur un contenu absent. */
    textes.forEach(function (f, i) {
      if (!f || (!f._partiel && !f._syncKo)) return;
      var ferme = f._libre === false || f._syncKo === 'abonnement';
      out.push(ecart('bloquant',
        'Texte ' + (i + 1) + ' non synchronise : le contenu manque',
        ferme
          ? 'Ce texte n\u2019est pas compris dans votre abonnement : seule son amorce a ete recue.'
          : 'Seule l\u2019amorce de ce texte a ete recue ; son contenu integral n\u2019a pas pu etre telecharge.',
        ferme
          ? 'Retirez-le de l\u2019epreuve, ou souscrivez pour l\u2019ouvrir.'
          : 'Rouvrez la fiche du texte pour relancer son telechargement avant d\u2019imprimer.',
        'texte-' + f.n));
    });

    /* --- 3. Longueur du texte support ---
       `f.words` d'abord : c'est le comptage du repertoire, fait sur le texte
       entier. Il n'est digne de foi que si le contenu a suivi -- d'ou le
       controle 2 bis juste au-dessus, qui signale le cas contraire. */
    if (struct && struct.texteSupport) {
      var ts = struct.texteSupport;
      textes.forEach(function (f, i) {
        var n = f.words || compterMots(f.text);
        if (n < ts.min || n > ts.max) {
          out.push(ecart(pondere(struct, n < ts.min * 0.6 || n > ts.max * 1.6 ? 'bloquant' : 'ecart'),
            'Texte ' + (i + 1) + ' hors norme : ' + n + ' mots',
            struct.nom + ' demande un texte de ' + ts.min + ' à ' + ts.max + ' mots' + (ts.nature ? ' (' + ts.nature + ')' : '') + '.',
            n > ts.max ? 'Coupez le texte, en marquant les suppressions par […].'
                       : 'Choisissez un extrait plus long dans le corpus.',
            'texte-' + f.n));
        }
      });
    }

    /* --- 4. Nombre de sujets au choix --- */
    if (struct && struct.sujetsAuChoix > 1) {
      out.push(ecart('conseil',
        struct.sujetsAuChoix + ' sujets au choix attendus',
        struct.nom + ' propose ' + struct.sujetsAuChoix + ' sujets au choix au candidat. Le composeur produit pour l’instant un sujet unique.',
        'Composez les ' + struct.sujetsAuChoix + ' sujets, ou indiquez explicitement qu’il s’agit d’un devoir de séquence.',
        'structure'));
    }

    /* --- 5. Barème --- */
    var total = 0, sansPoints = 0, nbQ = 0;
    textes.forEach(function (f) {
      ['comp', 'expl'].forEach(function (kind) {
        qListe(f, kind).forEach(function (q, idx) {
          nbQ++;
          var p = qPoints(f.n, kind, idx);
          if (p === null || p === undefined || p === '') sansPoints++;
          else total += (parseFloat(p) || 0);
        });
      });
    });

    if (nbQ === 0) {
      out.push(ecart('bloquant', 'Aucune question',
        'Le sujet ne comporte aucune question.',
        'Ajoutez au moins les questions de compréhension.', 'questions'));
    } else if (sansPoints === nbQ) {
      out.push(ecart('ecart', 'Barème absent',
        'Aucune question ne porte de points. Un sujet MINESEC est noté sur 20.',
        'Renseignez les points de chaque question, ou appliquez un barème type.', 'bareme'));
    } else {
      if (sansPoints > 0) {
        out.push(ecart('ecart', sansPoints + ' question(s) sans points',
          'Le total ne peut pas être vérifié tant que toutes les questions ne sont pas notées.',
          'Complétez les points manquants.', 'bareme'));
      }
      var attendu = M.totalAttendu(struct);
      var arrondi = Math.round(total * 100) / 100;
      if (sansPoints === 0 && Math.abs(arrondi - attendu) > 0.001) {
        out.push(ecart('bloquant',
          'Le barème totalise ' + arrondi + ' points au lieu de ' + attendu,
          'Un sujet remis à un candidat doit tomber juste.',
          arrondi > attendu ? 'Retirez ' + (Math.round((arrondi - attendu) * 100) / 100) + ' point(s).'
                            : 'Ajoutez ' + (Math.round((attendu - arrondi) * 100) / 100) + ' point(s).',
          'bareme'));
      }
    }

    /* --- 6. Parties attendues --- */
    if (struct && struct.parties && struct.parties.length > 1 && struct.sujetsAuChoix === 1) {
      out.push(ecart('conseil',
        'Structure attendue : ' + struct.parties.map(function (p) { return p.titre; }).join(' · '),
        struct.parties.map(function (p) { return p.titre + (p.points ? ' /' + p.points : ''); }).join('  ·  '),
        'Vérifiez que votre sujet couvre chacune de ces parties.',
        'structure'));
    }

    /* --- 7. Formulations bannies dans les questions ---
       Motifs triés du plus long au plus court, et on s'arrête au premier qui
       touche : « analyse logique » et « analyse logiquement » désignent la même
       faute, la signaler deux fois pour une seule question la banalise. */
    /* Les motifs bannis du programme ET les tours mesures absents du corpus
       officiel (« Pourquoi… ? », « Comment… ? ») : ce sont deux sources, un
       seul controle. */
    var bannies = M.formulations.questionsBannies
      .concat((M.questionnement && M.questionnement.aEviter) || [])
      .slice().sort(function (a, b) { return b.motif.length - a.motif.length; });
    textes.forEach(function (f) {
      ['comp', 'expl'].forEach(function (kind) {
        qListe(f, kind).forEach(function (q, idx) {
          var nq = norm(q);
          for (var i = 0; i < bannies.length; i++) {
            if (nq.indexOf(norm(bannies[i].motif)) >= 0) {
              out.push(ecart('ecart',
                (kind === 'comp' ? 'Compréhension' : 'Langue et production')
                  + ', question ' + (idx + 1) + ' (texte n° ' + f.n + ') : « ' + bannies[i].motif + ' »',
                bannies[i].pourquoi,
                'Reformulez en consigne de repérage ou de manipulation.',
                'texte-' + f.n));
              break;
            }
          }
        });
      });
    });

    /* --- 7 bis. Équilibre des niveaux de questionnement ---
       Une épreuve faite uniquement de relevé ne classe pas les élèves ; une
       épreuve sans relevé décourage les plus faibles. On ne le dit qu'à titre
       de repère : c'est un usage, pas une règle écrite. */
    if (M.questionnement && nbQ >= 4) {
      var parNiveau = {}, classees = 0;
      textes.forEach(function (f) {
        ['comp', 'expl'].forEach(function (kind) {
          qListe(f, kind).forEach(function (q) {
            var nv = M.niveauQuestion(q);
            if (nv) { parNiveau[nv.id] = (parNiveau[nv.id] || 0) + 1; classees++; }
          });
        });
      });
      var manquants = M.questionnement.niveaux.filter(function (nv) { return !parNiveau[nv.id]; });
      if (classees >= 3 && manquants.length && manquants.length < 4) {
        out.push(ecart('conseil',
          'Aucune question de ' + manquants.map(function (nv) { return nv.nom.toLowerCase(); }).join(' ni de '),
          'Répartition actuelle : ' + M.questionnement.niveaux.map(function (nv) {
            return nv.nom + ' ' + (parNiveau[nv.id] || 0);
          }).join(' · ') + '.',
          'Ajoutez au moins une question de ' + manquants[0].nom.toLowerCase()
            + ' — par exemple : « ' + manquants[0].exemple + ' »',
          'questions'));
      }
      if (nbQ - classees > nbQ / 2) {
        out.push(ecart('conseil',
          (nbQ - classees) + ' question(s) sans verbe de consigne reconnu',
          'Les questions du corpus officiel commencent par un verbe qui dit à l’élève ce qu’il doit faire : relève, justifie, explique, rédige…',
          'Reformulez en commençant par un verbe d’action.',
          'questions'));
      }
    }

    /* --- 8. Interdits propres à la structure --- */
    if (struct && struct.interdits) {
      struct.interdits.forEach(function (t) {
        out.push(ecart('conseil', 'Règle de la série', t, '', 'structure'));
      });
    }

    /* --- 9. L'épreuve jumelle oubliée (A/ABI et C/D/E/TI) ---
       Une seule ligne par épreuve jumelle, quel que soit le nombre de séries
       concernées : répéter le même conseil quatre fois le rend invisible. */
    if (struct && struct.series) {
      var jumelles = {};
      struct.series.forEach(function (s) {
        M.epreuvesParSerie(s).forEach(function (a) {
          if (a.code === struct.code) return;
          if (!jumelles[a.code]) jumelles[a.code] = { ep: a, series: [] };
          jumelles[a.code].series.push(s);
        });
      });
      Object.keys(jumelles).forEach(function (code) {
        var j = jumelles[code];
        out.push(ecart('conseil',
          'Épreuve jumelle : ' + j.ep.nom,
          'En série ' + j.series.join(', ') + ', le candidat compose DEUX épreuves de français : « '
            + struct.nom + ' » et « ' + j.ep.nom + ' ».',
          'Prévoyez aussi « ' + j.ep.nom + ' » (' + j.ep.duree + ', coefficient ' + j.ep.coeff + ').',
          'structure'));
      });
    }

    /* --- 10. Avertissement de confiance --- */
    if (struct && struct.confiance === 'a_verifier') {
      out.push(ecart('conseil',
        'Structure à confirmer',
        struct.avertissement || 'Cette structure n’a pas pu être vérifiée sur un sujet officiel.',
        'Confirmez sur la circulaire de la session avant diffusion.',
        'structure'));
    }

    return out;
  }

  /* ------------------------------------------------------------------
     CONTRÔLE D'UN COURS
     ------------------------------------------------------------------ */

  function verifierCours(cours, corpusTexte) {
    var out = [];
    if (!cours) return out;
    var g = M.gabaritParId(cours.gabarit);

    if (!cours.title) out.push(ecart('ecart', 'Titre absent', '', 'Donnez un titre à la leçon.', 'entete'));
    if (!cours.classe) out.push(ecart('ecart', 'Classe non renseignée', '', 'La classe détermine l’horaire et le coefficient.', 'entete'));

    /* Horaire et coefficient du sous-cycle */
    if (cours.classe) {
      var sc = M.sousCycles.filter(function (s) {
        return s.classes.some(function (c) { return norm(c) === norm(cours.classe); });
      })[0];
      if (sc) {
        if (cours.coeff && String(cours.coeff).trim() !== sc.coeff) {
          out.push(ecart('ecart', 'Coefficient inhabituel en ' + cours.classe,
            sc.nom + ' : ' + sc.heures + ', coefficient ' + sc.coeff + '.',
            'Vérifiez le coefficient.', 'entete'));
        }
        out.push(ecart('conseil', sc.nom,
          sc.heures + ' · coefficient ' + sc.coeff + '. ' + sc.style, '', 'entete'));
      }
    }

    /* Objectif : formulations bannies */
    var obj = [cours.objAgir, cours.objContexte, cours.objFonction, cours.competence].join(' ');
    var objN = norm(obj);
    M.formulations.objectifsBannis.forEach(function (b) {
      if (objN.indexOf(norm(b.motif)) >= 0) {
        out.push(ecart('bloquant', 'Objectif : « ' + b.motif + ' » est banni',
          b.pourquoi,
          'Reformulez en compétence spécifique observable.', 'objectif'));
      }
    });
    if (g && g.objectifsInterdits) {
      g.objectifsInterdits.forEach(function (m) {
        if (objN.indexOf(norm(m)) >= 0) {
          out.push(ecart('bloquant', 'Objectif : « ' + m + ' » est banni en ' + g.nom,
            'Le programme l’exclut de ce type de leçon.',
            'Reformulez en compétence spécifique.', 'objectif'));
        }
      });
    }
    if (!cours.objAgir) {
      out.push(ecart('ecart', 'Objectif incomplet',
        'Le programme formule l’objectif en trois temps : agir compétent + contexte + fonction sociale.',
        'Renseignez au moins l’agir compétent.', 'objectif'));
    }

    /* Phases du gabarit */
    if (g) {
      var pc = cours.phaseContent || {};
      var vides = g.phases.filter(function (p, i) {
        var v = pc[i] || pc[p.nom];
        return !v || !String(v).trim();
      });
      if (vides.length) {
        out.push(ecart(vides.length === g.phases.length ? 'ecart' : 'conseil',
          vides.length + ' phase(s) non renseignée(s) sur ' + g.phases.length,
          'Phases attendues : ' + g.phases.map(function (p) { return p.nom; }).join(' → '),
          'Complétez : ' + vides.map(function (p) { return p.nom; }).join(', ') + '.',
          'phases'));
      }
    }

    /* Corpus de la leçon de langue */
    if (g && g.id === 'langue') {
      if (!corpusTexte || !String(corpusTexte).trim()) {
        out.push(ecart('bloquant', 'Leçon de langue sans corpus',
          'La démarche inductive part d’un corpus observé. Sans corpus, la leçon devient magistrale.',
          'Insérez un corpus court, d’auteur ou composé, contenant le fait de langue.', 'corpus'));
      } else {
        var n = compterMots(corpusTexte);
        if (n > 120) {
          out.push(ecart('conseil', 'Corpus de ' + n + ' mots',
            'Le programme demande un corpus COURT : il sert à observer une structure, pas à être lu.',
            'Resserrez sur les phrases qui portent le fait de langue.', 'corpus'));
        }
      }
      if (!cours.regle || !String(cours.regle).trim()) {
        out.push(ecart('ecart', 'Règle (« Je retiens ») absente',
          'La quatrième phase aboutit à une règle formulée par les élèves.',
          'Rédigez la règle telle qu’elle sera notée au tableau.', 'regle'));
      }
    }

    /* Lecture méthodique */
    if (g && g.id === 'lecture' && corpusTexte) {
      var nm = compterMots(corpusTexte);
      var ts = g.texteSupport;
      if (ts && (nm < ts.min || nm > ts.max)) {
        out.push(ecart('ecart', 'Texte de ' + nm + ' mots',
          'La lecture méthodique demande un texte de ' + ts.min + ' à ' + ts.max + ' mots. ' + (ts.note || ''),
          nm > ts.max ? 'Coupez en marquant les suppressions par […].' : 'Prenez un extrait plus long.',
          'corpus'));
      }
    }

    /* Activité d'intégration */
    if (g && g.champsObligatoires) {
      var manquants = g.champsObligatoires.filter(function (c) { return !cours[c] || !String(cours[c]).trim(); });
      var libelles = { intContexte: 'contexte', intTache: 'tâche', intProduction: 'production attendue', intConsignes: 'consignes', intContraintes: 'contraintes' };
      if (manquants.length) {
        out.push(ecart('ecart',
          'Situation d’intégration incomplète',
          'Il manque : ' + manquants.map(function (c) { return libelles[c] || c; }).join(', ') + '.',
          'Une situation d’intégration se décrit en cinq éléments ; sans eux l’élève ne sait pas ce qu’on attend.',
          'integration'));
      }
    }

    /* Interdits du gabarit */
    if (g && g.interdits) {
      g.interdits.forEach(function (t) { out.push(ecart('conseil', 'Règle du programme', t, '', 'phases')); });
    }

    return dedupe(out);
  }

  /* ---------- dédoublonnage ---------- */
  function dedupe(list) {
    var vus = {}, out = [];
    list.forEach(function (e) {
      var k = e.severite + '|' + e.titre + '|' + e.detail;
      if (!vus[k]) { vus[k] = 1; out.push(e); }
    });
    return out;
  }

  /* ---------- synthèse pour l'affichage ---------- */
  function resume(ecarts) {
    var b = 0, e = 0, c = 0;
    (ecarts || []).forEach(function (x) {
      if (x.severite === 'bloquant') b++;
      else if (x.severite === 'ecart') e++;
      else c++;
    });
    return {
      bloquants: b, ecarts: e, conseils: c, total: b + e + c,
      conforme: b === 0 && e === 0,
      couleur: b ? '#c0392b' : (e ? '#c26a12' : '#1f9d55'),
      libelle: b ? (b + ' point(s) à corriger')
                 : (e ? (e + ' écart(s) à la norme') : 'Conforme au référentiel MINESEC')
    };
  }

  /* ------------------------------------------------------------------
     COUCHE 2 — analyse Ambassa
     ------------------------------------------------------------------
     On envoie à l'IA le RÉSULTAT des contrôles déterministes, pour qu'elle
     ne perde pas son temps (et sa fiabilité) à recompter des mots. On lui
     demande exactement ce qu'elle seule peut juger.
     ------------------------------------------------------------------ */

  function promptAmbassa(kind, objet, textes, ecartsLocaux) {
    var struct = objet && objet.epreuveCode ? M.epreuveParCode(objet.epreuveCode) : null;
    var g = objet && objet.gabarit ? M.gabaritParId(objet.gabarit) : null;

    var l = [];
    l.push('Tu es Ambassa, inspecteur pédagogique de français au MINESEC (Cameroun).');
    l.push('Tu relis le travail d’un collègue enseignant. Sois précis, bref et utile : chaque remarque doit être actionnable.');
    l.push('');
    l.push('LES CONTRÔLES MESURABLES SONT DÉJÀ FAITS. Ne recompte ni les mots ni les points.');
    l.push('Résultat des contrôles automatiques :');
    if (!ecartsLocaux || !ecartsLocaux.length) l.push('  (aucun écart mesurable)');
    else ecartsLocaux.forEach(function (e) { l.push('  - [' + e.severite + '] ' + e.titre + (e.detail ? ' — ' + e.detail : '')); });
    l.push('');

    if (kind === 'epreuve') {
      l.push('NORME APPLICABLE : ' + (struct ? (struct.nom + ' — ' + struct.duree + ', coefficient ' + struct.coeff
        + ', ' + struct.sujetsAuChoix + ' sujet(s) au choix. Parties : '
        + (struct.parties || []).map(function (p) { return p.titre + (p.points ? ' /' + p.points : ''); }).join(' · '))
        : 'aucune structure déclarée par l’enseignant.'));
      if (struct && struct.note) l.push('Précision : ' + struct.note);
      l.push('');
      l.push('SUJET SOUMIS');
      l.push('Titre : ' + (objet.title || '(sans titre)') + ' · Classe : ' + (objet.classe || '?'));
      l.push('Consigne générale : ' + (objet.consigne || '(aucune)'));
      (textes || []).forEach(function (f, i) {
        l.push('');
        l.push('--- Texte ' + (i + 1) + ' (' + (f.words || 0) + ' mots) — ' + (f.reference || f.author || 'sans référence'));
        l.push((f.text || '').slice(0, 2200));
        if (f.__comp && f.__comp.length) l.push('Questions de compréhension : ' + f.__comp.map(function (q, k) { return (k + 1) + ') ' + q; }).join(' '));
        if (f.__expl && f.__expl.length) l.push('Questions de langue / production : ' + f.__expl.map(function (q, k) { return (k + 1) + ') ' + q; }).join(' '));
      });
      l.push('');
      l.push('CE QUE TU DOIS JUGER, et rien d’autre :');
      l.push('1. Chaque question évalue-t-elle réellement ce que sa rubrique annonce ? (une question de « maniement de la langue » qui demande une définition n’en est pas une)');
      l.push('2. Les questions sont-elles au niveau de la classe indiquée ?');
      l.push('3. Le texte se prête-t-il aux questions posées : y trouve-t-on de quoi répondre ?');
      l.push('4. La progression des questions est-elle ordonnée (repérage avant interprétation) ?');
      l.push('5. Manque-t-il une partie exigée par la norme ci-dessus ?');
    } else {
      l.push('NORME APPLICABLE : ' + (g ? (g.nom + ' — démarche ' + (g.demarche || 'du programme') + ', phases : '
        + g.phases.map(function (p) { return p.nom; }).join(' → ')) : 'aucun gabarit déclaré.'));
      l.push('');
      l.push('LEÇON SOUMISE');
      l.push('Titre : ' + (objet.title || '(sans titre)') + ' · Classe : ' + (objet.classe || '?'));
      l.push('Objectif : ' + [objet.objAgir, objet.objContexte, objet.objFonction].filter(Boolean).join(' — '));
      if (objet.regle) l.push('Règle visée : ' + objet.regle);
      var pc = objet.phaseContent || {};
      if (g) g.phases.forEach(function (p, i) {
        l.push('• ' + p.nom + ' : ' + (String(pc[i] || pc[p.nom] || '(vide)').slice(0, 700)));
      });
      l.push('');
      l.push('CE QUE TU DOIS JUGER, et rien d’autre :');
      l.push('1. Le corpus contient-il effectivement le fait de langue visé ?');
      l.push('2. La démarche est-elle réellement inductive (l’élève découvre) ou déguise-t-elle un cours magistral ?');
      l.push('3. La règle formulée est-elle exacte et au niveau de la classe ?');
      l.push('4. Les exercices de consolidation réemploient-ils bien le fait étudié ?');
      l.push('5. L’objectif est-il formulé en agir compétent observable ?');
    }

    l.push('');
    l.push('RÉPONDS EN JSON STRICT, sans texte autour :');
    l.push('{"verdict":"conforme|reserves|non_conforme","ecarts":[{"severite":"bloquant|ecart|conseil","titre":"…","detail":"…","quoiFaire":"…"}],"pointsForts":["…"]}');
    l.push('Au maximum 6 écarts. Si tout va bien, renvoie une liste vide et dis-le dans pointsForts.');
    return l.join('\n');
  }

  /* Appelle Ambassa via le proxy serveur. La clé d'API ne quitte jamais le
     serveur : le navigateur ne voit que ce endpoint. */
  function analyserAvecAmbassa(kind, objet, textes, ecartsLocaux, opts) {
    opts = opts || {};
    var url = opts.url || '/api/ia_proxy.php';
    var prompt = promptAmbassa(kind, objet, textes, ecartsLocaux);
    var headers = { 'Content-Type': 'application/json' };
    if (opts.token) headers['Authorization'] = 'Bearer ' + opts.token;

    return fetch(url, {
      method: 'POST',
      headers: headers,
      body: JSON.stringify({
        action: 'conformite_minesec',
        prompt: prompt,
        max_tokens: 1200,
        temperature: 0.2
      })
    })
      .then(function (r) {
        if (r.status === 402) throw new Error('quota');
        if (!r.ok) throw new Error('http_' + r.status);
        return r.json();
      })
      .then(function (j) {
        var txt = j.text || j.reponse || j.response || j.content || '';
        return parseVerdict(txt);
      });
  }

  /* L'IA encadre souvent son JSON de ``` ou d'une phrase. On récupère le
     premier objet équilibré plutôt que de faire confiance au format. */
  function parseVerdict(txt) {
    var s = String(txt || '');
    var i = s.indexOf('{');
    if (i < 0) throw new Error('reponse_illisible');
    var depth = 0, fin = -1, inStr = false, esc = false;
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
      else if (c === '}') { depth--; if (!depth) { fin = k + 1; break; } }
    }
    if (fin < 0) throw new Error('reponse_tronquee');
    var o = JSON.parse(s.slice(i, fin));
    return {
      verdict: o.verdict || 'reserves',
      ecarts: (o.ecarts || []).map(function (e) {
        return ecart(
          ['bloquant', 'ecart', 'conseil'].indexOf(e.severite) >= 0 ? e.severite : 'conseil',
          e.titre || 'Remarque', e.detail || '', e.quoiFaire || '', 'ambassa');
      }),
      pointsForts: o.pointsForts || []
    };
  }

  root.CONFORMITE = {
    verifierEpreuve: verifierEpreuve,
    verifierCours: verifierCours,
    resume: resume,
    promptAmbassa: promptAmbassa,
    analyserAvecAmbassa: analyserAvecAmbassa,
    parseVerdict: parseVerdict,
    compterMots: compterMots
  };

})(typeof window !== 'undefined' ? window : this);
