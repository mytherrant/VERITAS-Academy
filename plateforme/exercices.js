/* ============================================================================
   VÉRITAS — Génération d'exercices complémentaires
   ----------------------------------------------------------------------------
   Trois familles, et deux façons de les produire :

     • QCM et vrai/faux  → l'IA Ambassa. Il faut comprendre le texte pour
       fabriquer un distracteur plausible ; aucune règle mécanique ne le fait.

     • Mots mêlés, anagrammes, mots à trous → calculés ICI, sans appel réseau.
       Une grille de mots mêlés est un problème de placement, pas de langue :
       la faire produire par une IA coûterait un appel pour un résultat moins
       sûr (mots mal placés, grille incohérente). Le lexique vient du texte
       lui-même, donc l'exercice reste ancré dans le corpus travaillé.

   Le vocabulaire est toujours tiré du TEXTE de l'élève : un jeu de mots sur un
   lexique étranger au texte ne révise rien.
   ========================================================================= */

(function (root) {
  'use strict';

  /* ------------------------------------------------------------------
     LEXIQUE — extraction des mots exploitables d'un texte
     ------------------------------------------------------------------ */

  /* Mots-outils : ils sont fréquents et n'apprennent rien. On les écarte
     plutôt que de fabriquer une grille pleine de « dans », « pour », « avec ». */
  var OUTILS = ('le la les un une des de du au aux et ou mais donc or ni car que qui quoi dont '
    + 'ce cet cette ces son sa ses leur leurs mon ma mes ton ta tes notre nos votre vos '
    + 'je tu il elle on nous vous ils elles se me te lui y en '
    + 'dans sur sous pour par avec sans vers chez entre depuis pendant avant apres '
    + 'est sont etait etaient ete avoir etre fait faire dit dire plus moins tres bien '
    + 'tout tous toute toutes meme aussi alors ainsi comme quand si non oui ne pas '
    + 'cela celui celle ceux qu il elle').split(/\s+/);

  function sansAccent(m) {
    var t = String(m || '').toLowerCase();
    return t.normalize ? t.normalize('NFD').replace(/[\u0300-\u036f]/g, '') : t;
  }

  /* Renvoie les mots du texte dignes d'un exercice : assez longs, non outils,
     sans doublon, et dans l'ordre de leur première apparition (l'élève les
     retrouve dans l'ordre du texte, ce qui aide). */
  function lexique(texte, opts) {
    opts = opts || {};
    var min = opts.min || 5, max = opts.max || 12, combien = opts.combien || 12;
    var vus = {}, out = [];
    var mots = String(texte || '').split(/[^A-Za-zÀ-ÖØ-öø-ÿ'’-]+/);
    for (var i = 0; i < mots.length; i++) {
      var m = mots[i];
      if (!m) continue;
      /* Couper l'elision : « l'odeur » doit donner « odeur », pas « lodeur ».
         Sans cela la grille propose des mots qui n'existent pas. */
      var propre = m.replace(/^(?:[ldjnscmt]|qu)['’]/i, '').replace(/^[-'’]+|[-'’]+$/g, '');
      if (propre.length < min || propre.length > max) continue;
      var cle = sansAccent(propre);
      if (OUTILS.indexOf(cle) >= 0) continue;
      if (/[0-9]/.test(propre)) continue;
      if (vus[cle]) continue;
      vus[cle] = 1;
      out.push(propre);
      if (out.length >= combien) break;
    }
    return out;
  }

  /* ------------------------------------------------------------------
     MOTS MÊLÉS
     ------------------------------------------------------------------
     Placement en huit directions, avec recoupement autorisé quand les
     lettres coïncident. On tente plusieurs fois par mot puis on abandonne
     CE mot : mieux vaut une grille de huit mots bien placés qu'une grille
     de douze où trois se chevauchent mal.
     ------------------------------------------------------------------ */

  var DIRECTIONS = [[1, 0], [0, 1], [1, 1], [-1, 1], [-1, 0], [0, -1], [-1, -1], [1, -1]];
  var ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

  function normPourGrille(m) {
    return sansAccent(m).toUpperCase().replace(/[^A-Z]/g, '');
  }

  function motsMeles(mots, taille, alea) {
    alea = alea || Math.random;
    var propres = (mots || []).map(normPourGrille).filter(function (m) { return m.length >= 3; });
    /* Les plus longs d'abord : ils sont les plus durs à caser. */
    propres.sort(function (a, b) { return b.length - a.length; });
    var n = taille || Math.max(10, Math.min(16, (propres[0] || '').length + 3));

    var grille = [];
    for (var y = 0; y < n; y++) { grille.push(new Array(n).fill('')); }

    var places = [];
    propres.forEach(function (mot) {
      if (mot.length > n) return;
      for (var essai = 0; essai < 220; essai++) {
        var d = DIRECTIONS[Math.floor(alea() * DIRECTIONS.length)];
        var x0 = Math.floor(alea() * n), y0 = Math.floor(alea() * n);
        var xf = x0 + d[0] * (mot.length - 1), yf = y0 + d[1] * (mot.length - 1);
        if (xf < 0 || xf >= n || yf < 0 || yf >= n) continue;
        var ok = true;
        for (var i = 0; i < mot.length; i++) {
          var c = grille[y0 + d[1] * i][x0 + d[0] * i];
          if (c !== '' && c !== mot[i]) { ok = false; break; }
        }
        if (!ok) continue;
        for (var j = 0; j < mot.length; j++) grille[y0 + d[1] * j][x0 + d[0] * j] = mot[j];
        places.push({ mot: mot, x: x0, y: y0, dx: d[0], dy: d[1] });
        return;
      }
    });

    /* Remplissage : lettres au hasard, mais on évite de recréer par accident
       un mot de la liste — ce serait une réponse fantôme. */
    for (var yy = 0; yy < n; yy++) {
      for (var xx = 0; xx < n; xx++) {
        if (grille[yy][xx] === '') grille[yy][xx] = ALPHABET[Math.floor(alea() * 26)];
      }
    }
    return { taille: n, grille: grille, places: places,
             motsPlaces: places.map(function (p) { return p.mot; }),
             motsEcartes: propres.filter(function (m) {
               return !places.some(function (p) { return p.mot === m; });
             }) };
  }

  /* ------------------------------------------------------------------
     ANAGRAMMES ET MOTS À TROUS
     ------------------------------------------------------------------ */

  function melanger(mot, alea) {
    alea = alea || Math.random;
    var l = mot.split(''), i, j, t, essais = 0;
    do {
      for (i = l.length - 1; i > 0; i--) {
        j = Math.floor(alea() * (i + 1));
        t = l[i]; l[i] = l[j]; l[j] = t;
      }
      essais++;
      /* Un « anagramme » identique au mot d'origine n'en est pas un. */
    } while (l.join('') === mot && essais < 12);
    return l.join('');
  }

  function anagrammes(mots, alea) {
    return (mots || []).filter(function (m) { return m.length >= 4; })
      .map(function (m) { return { melange: melanger(m.toUpperCase(), alea), reponse: m }; });
  }

  /* Texte à trous : on retire les mots choisis et on donne l'étiquette. */
  function motsATrous(texte, mots) {
    var t = String(texte || '');
    var retires = [];
    (mots || []).forEach(function (m, i) {
      var re = new RegExp('(^|[^A-Za-zÀ-ÖØ-öø-ÿ])(' + m.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + ')([^A-Za-zÀ-ÖØ-öø-ÿ]|$)');
      if (re.test(t)) {
        t = t.replace(re, '$1' + '……(' + (i + 1) + ')……' + '$3');
        retires.push({ numero: i + 1, reponse: m });
      }
    });
    return { texte: t, reponses: retires };
  }

  /* ------------------------------------------------------------------
     QCM ET VRAI/FAUX — par l'IA
     ------------------------------------------------------------------ */

  function promptQCM(textes, options) {
    options = options || {};
    var combien = options.combien || 6;
    var classe = options.classe || '';
    var l = [];
    l.push('Tu es Ambassa, professeur de français au MINESEC (Cameroun).');
    l.push('Fabrique ' + combien + ' questions à choix multiple sur le ou les textes ci-dessous'
      + (classe ? ', pour une classe de ' + classe : '') + '.');
    l.push('');
    l.push('RÈGLES IMPÉRATIVES :');
    l.push('1. La réponse doit se trouver DANS le texte. Aucune question de culture générale.');
    l.push('2. Quatre propositions par question, une seule correcte.');
    l.push('3. Les trois distracteurs doivent être plausibles : tirés du texte ou du même champ lexical. Une proposition absurde ne teste rien.');
    l.push('4. Pas de « toutes les réponses » ni de « aucune des réponses ».');
    l.push('5. Formule les questions avec un verbe de consigne du programme : relève, identifie, explique, justifie. Évite « Pourquoi » et « Comment », absents des sujets officiels.');
    l.push('6. Varie les niveaux : repérage, analyse, interprétation.');
    l.push('');
    (textes || []).forEach(function (t, i) {
      l.push('--- Texte ' + (i + 1) + ' — ' + (t.reference || t.author || 'sans référence'));
      l.push(String(t.text || '').slice(0, 2400));
    });
    l.push('');
    l.push('RÉPONDS EN JSON STRICT, sans texte autour :');
    l.push('{"qcm":[{"question":"…","propositions":["…","…","…","…"],"bonne":0,"niveau":"reperage|analyse|interpretation","justification":"…"}]}');
    return l.join('\n');
  }

  function promptVraiFaux(textes, options) {
    options = options || {};
    var combien = options.combien || 8;
    var l = [];
    l.push('Tu es Ambassa, professeur de français au MINESEC (Cameroun).');
    l.push('Fabrique ' + combien + ' affirmations vrai/faux sur le ou les textes ci-dessous.');
    l.push('');
    l.push('RÈGLES IMPÉRATIVES :');
    l.push('1. Chaque affirmation se vérifie DANS le texte, mot pour mot ou par déduction immédiate.');
    l.push('2. Équilibre à peu près les vraies et les fausses.');
    l.push('3. Une affirmation fausse doit l’être clairement, jamais par un détail ambigu.');
    l.push('4. Pour chaque affirmation, cite le passage qui tranche.');
    l.push('');
    (textes || []).forEach(function (t, i) {
      l.push('--- Texte ' + (i + 1) + ' — ' + (t.reference || t.author || 'sans référence'));
      l.push(String(t.text || '').slice(0, 2400));
    });
    l.push('');
    l.push('RÉPONDS EN JSON STRICT, sans texte autour :');
    l.push('{"vraiFaux":[{"affirmation":"…","vrai":true,"preuve":"…"}]}');
    return l.join('\n');
  }

  /* L'IA encadre souvent son JSON. On récupère le premier objet équilibré
     plutôt que de faire confiance au format annoncé. */
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

  /* Validation : on refuse ce qui ne tient pas debout plutôt que de
     l'afficher à l'enseignant comme si c'était bon. */
  function validerQCM(o) {
    var l = (o && o.qcm) || [];
    return l.filter(function (q) {
      return q && typeof q.question === 'string' && q.question.trim().length > 6
        && Array.isArray(q.propositions) && q.propositions.length === 4
        && q.propositions.every(function (p) { return typeof p === 'string' && p.trim(); })
        && typeof q.bonne === 'number' && q.bonne >= 0 && q.bonne < 4;
    });
  }

  function validerVraiFaux(o) {
    var l = (o && o.vraiFaux) || [];
    return l.filter(function (q) {
      return q && typeof q.affirmation === 'string' && q.affirmation.trim().length > 6
        && typeof q.vrai === 'boolean';
    });
  }

  function appeler(prompt, opts) {
    opts = opts || {};
    var url = opts.url || '/api/ia_proxy.php';
    var entetes = { 'Content-Type': 'application/json' };
    if (opts.token) entetes['Authorization'] = 'Bearer ' + opts.token;
    return fetch(url, {
      method: 'POST', headers: entetes,
      body: JSON.stringify({ action: opts.action || 'exercices_minesec', prompt: prompt,
                             max_tokens: opts.max || 1600, temperature: 0.35 })
    }).then(function (r) {
      if (r.status === 402) throw new Error('quota');
      if (!r.ok) throw new Error('http_' + r.status);
      return r.json();
    }).then(function (j) {
      return extraireJSON(j.text || j.reponse || j.response || j.content || '');
    });
  }

  function genererQCM(textes, opts) {
    return appeler(promptQCM(textes, opts), opts).then(validerQCM);
  }
  function genererVraiFaux(textes, opts) {
    return appeler(promptVraiFaux(textes, opts), opts).then(validerVraiFaux);
  }

  /* ------------------------------------------------------------------
     RÉSUMÉ ET ANALYSE — la contraction du programme
     ------------------------------------------------------------------
     Le résumé se fait au quart, l'analyse au tiers : ce ne sont pas deux
     noms pour la même chose. Le résumé conserve l'ordre de l'auteur et son
     système d'énonciation ; l'analyse autorise la réorganisation mais impose
     la distanciation. On demande donc explicitement l'un OU l'autre, et on
     donne la cible en mots — c'est ce que le barème sanctionne.
     ------------------------------------------------------------------ */

  function compterMots(t) {
    var x = String(t || '').trim();
    return x ? x.split(/\s+/).filter(Boolean).length : 0;
  }

  function promptResume(texte, options) {
    options = options || {};
    var mode = options.mode === 'analyse' ? 'analyse' : 'resume';
    var n = compterMots(texte);
    var cible = Math.round(mode === 'analyse' ? n / 3 : n / 4);
    var marge = Math.max(5, Math.round(cible * 0.1));
    var l = [];
    l.push('Tu es Ambassa, professeur de français au MINESEC (Cameroun).');
    l.push(mode === 'analyse'
      ? 'Produis une ANALYSE du texte ci-dessous, réduite au tiers.'
      : 'Produis un RÉSUMÉ du texte ci-dessous, réduit au quart.');
    l.push('');
    l.push('CONTRAINTES DU PROGRAMME :');
    l.push('- Texte de départ : ' + n + ' mots. Cible : ' + cible + ' mots, marge de plus ou moins ' + marge + '.');
    if (mode === 'analyse') {
      l.push('- DISTANCIATION OBLIGATOIRE : style indirect, pronoms et temps modifiés, verbes introducteurs (« l’auteur affirme », « il souligne »).');
      l.push('- La réorganisation selon la logique argumentative est autorisée.');
    } else {
      l.push('- Conserver l’ORDRE de l’auteur et son SYSTÈME D’ÉNONCIATION : même personne, même temps de référence.');
      l.push('- Pas de commentaire, pas de jugement, aucun ajout.');
    }
    l.push('- Supprimer exemples, redondances et illustrations ; garder la thèse et les articulations logiques.');
    l.push('- Reformuler : ne pas recopier des phrases entières du texte.');
    l.push('');
    l.push('TEXTE');
    l.push(String(texte || '').slice(0, 3200));
    l.push('');
    l.push('RÉPONDS EN JSON STRICT, sans texte autour :');
    l.push('{"texte":"…","nombreMots":0,"plan":["idée 1","idée 2"],"remarque":"…"}');
    return l.join('\n');
  }

  /* Le nombre de mots annoncé par l'IA n'est pas fiable : on le recompte. */
  function validerResume(o, texteSource, mode) {
    if (!o || typeof o.texte !== 'string' || o.texte.trim().length < 20) return null;
    var n = compterMots(texteSource);
    var cible = Math.round(mode === 'analyse' ? n / 3 : n / 4);
    var reel = compterMots(o.texte);
    var marge = Math.max(5, Math.round(cible * 0.1));
    return {
      texte: o.texte.trim(),
      plan: Array.isArray(o.plan) ? o.plan : [],
      remarque: typeof o.remarque === 'string' ? o.remarque : '',
      motsSource: n, cible: cible, marge: marge, mots: reel,
      dansLaMarge: Math.abs(reel - cible) <= marge,
      mode: mode
    };
  }

  /* ------------------------------------------------------------------
     OBJECTIF DE LEÇON — le moule APC en trois temps
     ------------------------------------------------------------------ */

  function promptObjectif(cours, gabarit, corpus, interdits) {
    var l = [];
    l.push('Tu es Ambassa, professeur de français au MINESEC (Cameroun).');
    l.push('Propose l’objectif d’apprentissage de la leçon décrite ci-dessous, dans le moule de l’approche par les compétences.');
    l.push('');
    l.push('LE MOULE, EN TROIS TEMPS SÉPARÉS :');
    l.push('1. AGIR COMPÉTENT — un verbe d’action observable, à l’infinitif. Ce que l’élève FAIT.');
    l.push('2. CONTEXTE — la situation de vie dans laquelle cet agir se déploie.');
    l.push('3. FONCTION SOCIALE — à quoi cela sert dans la vie réelle. C’est ce qui rend l’objectif APC.');
    l.push('');
    l.push('FORMULATIONS INTERDITES par le programme, ne les emploie sous aucune forme :');
    l.push((interdits || []).join(' · '));
    l.push('Évite aussi les verbes non observables : connaître, comprendre, savoir, apprécier.');
    l.push('');
    l.push('LEÇON');
    l.push('Type : ' + ((gabarit && gabarit.nom) || 'non précisé'));
    if (gabarit && gabarit.phases) l.push('Phases : ' + gabarit.phases.map(function (p) { return p.nom; }).join(' → '));
    l.push('Titre : ' + ((cours && cours.title) || '(sans titre)'));
    l.push('Classe : ' + ((cours && cours.classe) || '?'));
    if (cours && cours.regle) l.push('Règle visée : ' + cours.regle);
    if (corpus && corpus.text) {
      l.push('Corpus support (' + (corpus.words || compterMots(corpus.text)) + ' mots) :');
      l.push(String(corpus.text).slice(0, 1400));
    }
    l.push('');
    l.push('RÉPONDS EN JSON STRICT, sans texte autour :');
    l.push('{"agir":"…","contexte":"…","fonction":"…","competence":"…","justification":"…"}');
    return l.join('\n');
  }

  /* On signale un objectif qui emploie une formulation bannie : le proposer
     sans rien dire reviendrait à faire écrire par l'IA la faute qu'on traque
     par ailleurs. */
  function validerObjectif(o, interdits) {
    if (!o || typeof o.agir !== 'string' || o.agir.trim().length < 4) return null;
    var tout = [o.agir, o.contexte, o.fonction, o.competence].join(' ').toLowerCase();
    var sansAcc = tout.normalize ? tout.normalize('NFD').replace(/[\u0300-\u036f]/g, '') : tout;
    var fautif = (interdits || []).filter(function (m) {
      var x = String(m).toLowerCase();
      var y = x.normalize ? x.normalize('NFD').replace(/[\u0300-\u036f]/g, '') : x;
      return sansAcc.indexOf(y) >= 0;
    });
    return {
      agir: String(o.agir || '').trim(),
      contexte: String(o.contexte || '').trim(),
      fonction: String(o.fonction || '').trim(),
      competence: String(o.competence || '').trim(),
      justification: String(o.justification || '').trim(),
      interditsTrouves: fautif
    };
  }

  function genererResume(texte, opts) {
    opts = opts || {};
    var mode = opts.mode === 'analyse' ? 'analyse' : 'resume';
    return appeler(promptResume(texte, opts), opts)
      .then(function (o) { return validerResume(o, texte, mode); });
  }

  function genererObjectif(cours, gabarit, corpus, interdits, opts) {
    return appeler(promptObjectif(cours, gabarit, corpus, interdits), opts)
      .then(function (o) { return validerObjectif(o, interdits); });
  }

  /* ------------------------------------------------------------------
     ASSISTANT — questions generales d'un enseignant
     ------------------------------------------------------------------
     Ce n'est pas un moteur de recherche : Ambassa repond en professeur du
     MINESEC, avec le referentiel de la plateforme sous les yeux. On le lui
     donne explicitement, sinon elle repondrait sur le programme francais de
     France, qui ne dit ni les memes durees, ni les memes baremes.

     On borne aussi la longueur : un enseignant qui pose une question entre
     deux cours veut trois paragraphes, pas un cours magistral.
     ------------------------------------------------------------------ */

  function promptAssistant(question, contexte, historique) {
    var l = [];
    l.push('Tu es Ambassa, professeur de français et inspecteur pédagogique au MINESEC (Cameroun).');
    l.push('Un collègue enseignant te pose une question. Réponds-lui comme à un pair : précis, court, utilisable tout de suite.');
    l.push('');
    l.push('RÈGLES :');
    l.push('- Le cadre est le programme MINESEC du Cameroun. Si une notion porte un autre sens ailleurs, dis-le.');
    l.push('- Trois paragraphes au plus. Pas d’introduction ni de conclusion de politesse.');
    l.push('- Quand la question porte sur une épreuve, donne la durée, le coefficient et le barème s’ils sont connus.');
    l.push('- Si tu n’es pas sûr, dis-le franchement et renvoie à la circulaire de la session. Ne fabrique jamais un barème.');
    l.push('- Termine par une ligne « À FAIRE : » avec un geste concret, quand la question s’y prête.');
    if (contexte) {
      l.push('');
      l.push('RÉFÉRENTIEL DE LA PLATEFORME (fais foi sur les structures) :');
      l.push(contexte);
    }
    if (historique && historique.length) {
      l.push('');
      l.push('ÉCHANGE PRÉCÉDENT :');
      historique.slice(-4).forEach(function (m) {
        l.push((m.role === 'moi' ? 'Le collègue : ' : 'Toi : ') + String(m.texte || '').slice(0, 700));
      });
    }
    l.push('');
    l.push('QUESTION');
    l.push(String(question || '').slice(0, 900));
    l.push('');
    l.push('RÉPONDS EN JSON STRICT, sans texte autour :');
    l.push('{"reponse":"…","aFaire":"…","incertain":false}');
    return l.join('\n');
  }

  function validerReponse(o) {
    if (!o || typeof o.reponse !== 'string' || o.reponse.trim().length < 10) return null;
    return {
      reponse: o.reponse.trim(),
      aFaire: typeof o.aFaire === 'string' ? o.aFaire.trim() : '',
      incertain: !!o.incertain
    };
  }

  function demander(question, contexte, historique, opts) {
    return appeler(promptAssistant(question, contexte, historique),
                   Object.assign({ max: 900 }, opts || {}))
      .then(validerReponse);
  }

  root.VRT_EXERCICES = {
    lexique: lexique,
    promptAssistant: promptAssistant, validerReponse: validerReponse, demander: demander,
    promptResume: promptResume, validerResume: validerResume, genererResume: genererResume,
    promptObjectif: promptObjectif, validerObjectif: validerObjectif, genererObjectif: genererObjectif,
    compterMots: compterMots,
    motsMeles: motsMeles,
    anagrammes: anagrammes,
    motsATrous: motsATrous,
    promptQCM: promptQCM,
    promptVraiFaux: promptVraiFaux,
    extraireJSON: extraireJSON,
    validerQCM: validerQCM,
    validerVraiFaux: validerVraiFaux,
    genererQCM: genererQCM,
    genererVraiFaux: genererVraiFaux
  };

  if (typeof module !== 'undefined' && module.exports) module.exports = root.VRT_EXERCICES;

})(typeof window !== 'undefined' ? window : this);
