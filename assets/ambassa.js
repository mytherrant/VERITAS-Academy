/* ============================================================================
 *  PROFESSEUR AMBASSA — LE TUTEUR, PRÉSENT SUR TOUTE SURFACE
 *
 *  Jacques : « remets l'ancienne IA avec son avatar et ses fonctionnalités,
 *  câble-la partout, et elle doit être en permanence à l'écran — on peut la
 *  solliciter à tout moment. »
 *
 *  Où elle était, et pourquoi ça ne suffisait pas :
 *    · l'APPLICATION a le tuteur complet (app.js, `mAgentAmbassa`) : avatar,
 *      huit tâches, historique, quotas. Mais il faut être DANS l'application,
 *      et l'ouvrir depuis un menu ;
 *    · la VITRINE a un panneau de discussion, sur l'accueil SEULEMENT, et
 *      seulement une fois qu'on l'a déplié ;
 *    · les 115 pages statiques (corrigés, œuvres, niveaux, parcours…) — celles
 *      où Google dépose la majorité des visiteurs — n'avaient RIEN.
 *
 *  Ce fichier est donc autonome : aucune dépendance à vitrine.js ni à app.js,
 *  parce qu'aucun des deux n'est chargé partout. Il pose un lanceur flottant
 *  (l'avatar) toujours visible, et un panneau qui reprend les huit tâches de
 *  `AMBASSA_TACHES`.
 *
 *  UNE RÈGLE IMPORTANTE : si `window.mAgentAmbassa` existe — donc si on est
 *  dans l'application — le lanceur ouvre CE tuteur-là, l'original, avec son
 *  historique et ses formulaires. On ne réimplémente pas par-dessus ce qui
 *  existe déjà en mieux ; on lui donne juste une porte d'entrée permanente.
 *
 *  Coût : la clé IA reste au serveur (api/ia_proxy.php), qui borne déjà par IP
 *  (15/min, 300/jour) et porte un plafond global de dépense. Le compteur
 *  hebdomadaire ci-dessous n'est qu'un garde-fou d'INTERFACE, pour tenir la
 *  promesse « 3 questions offertes par semaine » et amener à l'abonnement.
 *  Il est contournable — c'est normal, ce n'est pas lui la sécurité.
 * ==========================================================================*/
(function () {
  'use strict';

  if (window.__ambassaPose) return;            // idempotent : une seule instance
  window.__ambassaPose = true;

  var AVATAR = '/ambassa-avatar.png';
  var MAX_SEM = 3;
  var enCours = false;
  var outilActif = '';
  var ouvert = false;

  /* Les huit tâches de l'agent (app.js, AMBASSA_TACHES) : mêmes intitulés,
     mêmes couleurs, même ordre — c'est la même IA, pas une cousine. Le champ
     `p` cadre la demande : l'élève ne tape que son sujet. */
  var TACHES = [
    { id: 'quiz',      c: '#3C8DFF', t: 'Générer un quiz',        d: 'QCM, vrai-faux, questions ouvertes',
      ph: 'Sur quel chapitre, et quelle classe ?',
      p: 'Prépare un QUIZ de 5 questions (QCM à 4 options, une seule correcte, puis la correction) conforme au programme MINESEC sur : ' },
    { id: 'corrige',   c: '#3A8F73', t: 'Générer un corrigé',     d: 'Pour un sujet, un exercice, un QCM',
      ph: 'Colle le sujet ou l’exercice…',
      p: 'Rédige le CORRIGÉ complet, étape par étape, conforme aux grilles harmonisées MINESEC, du sujet suivant : ' },
    { id: 'fiche',     c: '#6C56A6', t: 'Fiche de révision',      d: 'Les points clés d’un chapitre',
      ph: 'Quelle notion veux-tu réviser ?',
      p: 'Rédige une FICHE DE RÉVISION synthétique (définitions, points-clés, méthode, exemple, piège d’examen) conforme au programme MINESEC sur : ' },
    { id: 'diff',      c: '#F59E0B', t: 'Exercices différenciés', d: 'Facile, moyen, difficile',
      ph: 'Sur quel thème ?',
      p: 'Propose des EXERCICES DIFFÉRENCIÉS sur le même thème, en trois niveaux (facile, moyen, difficile), avec les corrigés, conformes au programme MINESEC. Thème : ' },
    { id: 'remed',     c: '#C37199', t: 'Remédiation',            d: 'Reprendre une notion mal comprise',
      ph: 'Quelle notion bloque ?',
      p: 'Construis une ACTIVITÉ DE REMÉDIATION pour un élève en difficulté : diagnostic des erreurs typiques, explication reprise à la base, puis trois exercices progressifs. Notion : ' },
    { id: 'eval',      c: '#AE5353', t: 'Évaluation notée',       d: 'Sujet + barème + corrigé',
      ph: 'Quel chapitre, quelle classe ?',
      p: 'Compose une ÉVALUATION NOTÉE prête à imprimer (sujet, barème détaillé sur 20, corrigé) conforme aux formats MINESEC sur : ' },
    { id: 'doc',       c: '#6366F1', t: 'Analyser un document',   d: 'Colle un texte, l’IA travaille dessus',
      ph: 'Colle ton texte ici…',
      p: 'Analyse le document suivant à des fins pédagogiques : résumé, axes de lecture, trois questions de compréhension avec leurs réponses. Document : ' },
    { id: 'translate', c: '#0EA5E9', t: 'Traduction expliquée',   d: 'FR ↔ EN, vocabulaire commenté',
      ph: 'Quel passage traduire ?',
      p: 'Traduis le passage suivant (français ↔ anglais selon la langue d’origine) puis explique le vocabulaire et les tournures difficiles. Passage : ' }
  ];

  /* ── Quota d'interface ──────────────────────────────────────────────────*/
  function cleSemaine() {
    var d = new Date(), j1 = new Date(d.getFullYear(), 0, 1);
    var s = Math.ceil((((d - j1) / 86400000) + j1.getDay() + 1) / 7);
    return 'vrt_ia_sem_' + d.getFullYear() + '_' + s;
  }
  function quotaRestant() {
    try { return Math.max(0, MAX_SEM - (parseInt(localStorage.getItem(cleSemaine()) || '0', 10) || 0)); }
    catch (e) { return MAX_SEM; }
  }
  function quotaConsommer() {
    try {
      var k = cleSemaine();
      localStorage.setItem(k, String((parseInt(localStorage.getItem(k) || '0', 10) || 0) + 1));
    } catch (e) {}
  }

  function apiBase() {
    try { if (location.protocol.indexOf('http') === 0) return location.origin + '/api'; } catch (e) {}
    return '';
  }

  function el(tag, style, txt) {
    var n = document.createElement(tag);
    if (style) n.style.cssText = style;
    if (txt != null) n.textContent = txt;
    return n;
  }

  /* ── Le lanceur : l'avatar, toujours là ─────────────────────────────────
     `position:fixed` + marges de sécurité iOS (env(safe-area-inset-*)) pour
     ne pas se loger sous la barre du navigateur mobile. z-index élevé mais
     pas absurde : au-dessus du contenu, sous une éventuelle modale de
     paiement de l'application (qui monte à 9999). */
  function poserStyle() {
    if (document.getElementById('amb-css')) return;
    var s = document.createElement('style');
    s.id = 'amb-css';
    s.textContent = [
      '.amb-fab{position:fixed;right:calc(18px + env(safe-area-inset-right,0px));',
      '  bottom:calc(18px + env(safe-area-inset-bottom,0px));z-index:9000;',
      '  display:flex;align-items:center;gap:10px;background:none;border:0;padding:0;cursor:pointer}',
      '.amb-fab-av{width:60px;height:60px;border-radius:50%;overflow:hidden;flex:0 0 auto;',
      '  background:linear-gradient(135deg,#FFE082,#FFC93C);border:3px solid #fff;',
      '  box-shadow:0 10px 30px rgba(20,37,84,.34);position:relative}',
      '.amb-fab-av img{width:100%;height:100%;object-fit:cover;display:block}',
      '.amb-fab-b{position:absolute;right:-2px;top:-2px;width:15px;height:15px;border-radius:50%;',
      '  background:#22C55E;border:2.5px solid #fff}',
      '.amb-fab-l{background:#fff;color:#142554;border:1px solid #E4E7EF;border-radius:100px;',
      '  padding:9px 15px;font:600 13px Poppins,system-ui,sans-serif;white-space:nowrap;',
      '  box-shadow:0 8px 22px rgba(20,37,84,.16)}',
      '@media (max-width:640px){.amb-fab-l{display:none}.amb-fab-av{width:54px;height:54px}}',
      '.amb-fab:focus-visible{outline:3px solid #1E499B;outline-offset:4px;border-radius:100px}',
      /* Panneau */
      '.amb-pan{position:fixed;right:calc(18px + env(safe-area-inset-right,0px));',
      '  bottom:calc(92px + env(safe-area-inset-bottom,0px));z-index:9001;width:min(440px,calc(100vw - 36px));',
      '  max-height:min(740px,calc(100vh - 118px));display:flex;flex-direction:column;background:#fff;',
      '  border:1px solid #E4E7EF;border-radius:18px;overflow:hidden;box-shadow:0 26px 70px rgba(20,37,84,.3);',
      '  font-family:Poppins,system-ui,sans-serif}',
      '@media (max-width:640px){.amb-pan{right:10px;left:10px;width:auto;bottom:84px;max-height:calc(100vh - 110px)}}',
      '.amb-hd{background:linear-gradient(135deg,#142554,#6C56A6);color:#fff;padding:14px 16px;',
      '  display:flex;align-items:center;gap:12px;flex:0 0 auto}',
      '.amb-hd-av{width:46px;height:46px;border-radius:50%;overflow:hidden;flex:0 0 auto;',
      '  background:linear-gradient(135deg,#FFE082,#FFC93C);border:2px solid rgba(255,255,255,.5)}',
      '.amb-hd-av img{width:100%;height:100%;object-fit:cover;display:block}',
      '.amb-hd-x{margin-left:auto;background:rgba(255,255,255,.16);border:0;color:#fff;width:32px;height:32px;',
      '  border-radius:50%;cursor:pointer;font-size:18px;line-height:1;flex:0 0 auto}',
      /* ── Les huit outils ne mangent plus la réponse ──────────────────────
         La grille occupait ~260 px en « flex:0 0 auto », soit plus de la
         moitié du panneau : la réponse du tuteur se retrouvait comprimée dans
         la bande qui restait, à faire défiler trois lignes à la fois. Elle se
         replie donc dès le premier échange, et se rouvre par son bandeau. */
      '.amb-outbar{display:flex;align-items:center;gap:8px;padding:9px 14px 0;flex:0 0 auto}',
      '.amb-outbar button{display:flex;align-items:center;gap:6px;background:#F7F8FB;border:1px solid #E4E7EF;',
      '  border-radius:100px;padding:5px 12px;cursor:pointer;font:600 11.5px Poppins,sans-serif;color:#5B4FA8}',
      '.amb-outbar button:hover{background:#F3F0FB;border-color:#6C56A6}',
      '.amb-outbar .amb-chev{transition:transform .18s;font-size:9px;line-height:1}',
      '.amb-outbar button[aria-expanded="false"] .amb-chev{transform:rotate(-90deg)}',
      '.amb-out{display:grid;grid-template-columns:1fr 1fr;gap:7px;padding:12px 14px 4px;flex:0 0 auto}',
      '.amb-out[hidden]{display:none}',
      '.amb-out button{display:flex;flex-direction:column;align-items:flex-start;gap:2px;text-align:left;',
      '  background:#fff;border:1.5px solid #E4E7EF;border-radius:11px;padding:8px 10px;cursor:pointer;',
      '  font:600 12px Poppins,sans-serif;color:#142554;transition:border-color .15s,background .15s}',
      '.amb-out button small{font:400 10.5px Poppins,sans-serif;color:#6E7385;line-height:1.35}',
      '.amb-out button[aria-pressed="true"]{background:#F3F0FB;border-color:#6C56A6}',
      '.amb-msgs{flex:1 1 auto;overflow-y:auto;padding:12px 14px;display:flex;flex-direction:column;gap:9px;',
      '  background:#F7F8FB;min-height:130px}',
      '.amb-b-u{align-self:flex-end;max-width:86%;background:linear-gradient(135deg,#7C6BD6,#5B4FA8);color:#fff;',
      '  border-radius:12px;border-bottom-right-radius:4px;padding:9px 12px;font:400 13px/1.6 Poppins,sans-serif;',
      '  white-space:pre-wrap}',
      '.amb-b-a{align-self:flex-start;max-width:96%;background:#fff;border:1px solid #EFF2F7;color:#3A3F52;',
      '  border-radius:12px;border-top-left-radius:4px;padding:12px 14px;font:400 13.5px/1.72 Poppins,sans-serif;',
      '  white-space:normal}',
      /* ── Mise en forme des réponses ──────────────────────────────────────
         Le tuteur répond en markdown (titres, listes, gras) et tout arrivait
         en un seul pavé gris : les étapes d'une méthode, les exemples et la
         règle à retenir avaient exactement le même poids. On rend donc la
         structure — sans jamais passer par innerHTML (voir rendreReponse).
         La bulle « en cours » garde pre-wrap ; le rendu, lui, fabrique ses
         propres blocs. */
      '.amb-b-a.amb-brut{white-space:pre-wrap}',
      '.amb-b-a p{margin:0 0 9px}',
      '.amb-b-a p:last-child{margin-bottom:0}',
      '.amb-b-a .amb-h{display:block;margin:13px 0 6px;font:600 14px/1.45 Poppins,sans-serif;color:#142554}',
      '.amb-b-a .amb-h:first-child{margin-top:0}',
      '.amb-b-a .amb-h2{font-size:13.5px;color:#5B4FA8}',
      '.amb-b-a strong{font-weight:600;color:#142554}',
      '.amb-b-a ul,.amb-b-a ol{margin:0 0 9px;padding-left:19px}',
      '.amb-b-a li{margin:0 0 4px}',
      '.amb-b-a li::marker{color:#5B4FA8;font-weight:700}',
      '.amb-b-a code{background:#F3F0FB;color:#4B3F8F;border-radius:5px;padding:1px 5px;',
      '  font:500 12.5px ui-monospace,Menlo,Consolas,monospace}',
      '.amb-b-a hr{border:0;border-top:1px solid #EAEDF4;margin:11px 0}',
      /* Le point à retenir : un liseré doré, la couleur que VÉRITAS réserve à
         ce qui compte. C'est ce que l'élève doit revoir la veille du devoir. */
      '.amb-b-a .amb-cle{display:block;margin:10px 0;padding:9px 12px;background:#FFFBF0;',
      '  border-left:3px solid #FFC93C;border-radius:0 8px 8px 0;color:#4A3720}',
      '.amb-bas{flex:0 0 auto;border-top:1px solid #EFF2F7;padding:10px 12px;background:#fff}',
      '.amb-row{display:flex;gap:8px;align-items:flex-end}',
      '.amb-row textarea{flex:1;resize:none;border:1px solid #E4E7EF;border-radius:11px;padding:9px 11px;',
      '  font:400 13px/1.5 Poppins,sans-serif;color:#142554;max-height:96px;min-height:38px}',
      '.amb-row button{background:#5B4FA8;color:#fff;border:0;border-radius:11px;padding:0 15px;height:38px;',
      '  font:600 13px Poppins,sans-serif;cursor:pointer;flex:0 0 auto}',
      '.amb-q{margin-top:7px;font:400 11px Poppins,sans-serif;color:#6E7385}',
      '.amb-q a{color:#5B4FA8;font-weight:600}',
      '@media (prefers-reduced-motion:no-preference){',
      '  @keyframes amb-in{from{opacity:0;transform:translateY(10px) scale(.98)}to{opacity:1;transform:none}}',
      '  .amb-pan{animation:amb-in .18s ease-out}}'
    ].join('\n');
    document.head.appendChild(s);
  }

  /* Ouvre ou replie la grille des huit outils. Sans argument : bascule. */
  function basculerOutils(etat) {
    var g = document.getElementById('amb-out');
    var b = document.getElementById('amb-outbtn');
    if (!g || !b) return;
    var cible = (etat === undefined) ? (b.getAttribute('aria-expanded') !== 'true') : !!etat;
    g.hidden = !cible;
    b.setAttribute('aria-expanded', cible ? 'true' : 'false');
  }

  /* ── Enrichissement d'une ligne : **gras** et `code` ─────────────────────
     On découpe et on assemble des nœuds de TEXTE : le contenu de l'IA n'est
     jamais interprété comme du balisage, donc rien à échapper et rien à
     injecter. C'est la même garantie que l'ancien textContent, en plus lisible. */
  function enrichir(noeud, texte) {
    var reste = String(texte || '');
    var re = /\*\*([^*\n]+)\*\*|`([^`\n]+)`/;
    var m;
    while ((m = re.exec(reste)) !== null) {
      if (m.index > 0) noeud.appendChild(document.createTextNode(reste.slice(0, m.index)));
      var n;
      if (m[1] != null) { n = document.createElement('strong'); n.textContent = m[1]; }
      else { n = document.createElement('code'); n.textContent = m[2]; }
      noeud.appendChild(n);
      reste = reste.slice(m.index + m[0].length);
    }
    if (reste) noeud.appendChild(document.createTextNode(reste));
  }

  /* ── Rendu d'une réponse du tuteur ───────────────────────────────────────
     Ambassa répond en markdown : titres, listes numérotées, gras, séparateurs.
     Tout cela arrivait en un seul bloc de texte gris de treize pixels — les
     étapes d'une méthode, l'exemple et la règle à retenir pesaient pareil, et
     l'élève devait tout relire pour retrouver l'essentiel. On rebâtit donc la
     structure en DOM.
     Repli de sûreté : si le texte ne produit aucun bloc (réponse vide, format
     inattendu), on repose le texte brut plutôt que d'afficher une bulle vide. */
  function rendreReponse(cible, texte) {
    if (!cible) return;
    while (cible.firstChild) { cible.removeChild(cible.firstChild); }
    cible.className = 'amb-b-a';

    var lignes = String(texte || '').replace(/\r\n?/g, '\n').split('\n');
    var liste = null, para = [];

    function viderPara() {
      if (!para.length) return;
      var txt = para.join(' ');
      var p = document.createElement('p');
      /* Le point à retenir mérite d'être vu sans relire : liseré doré. */
      if (/^(à retenir|a retenir|retiens|l['’]essentiel|en résumé|en resume)\b/i.test(txt)) {
        p.className = 'amb-cle';
      }
      enrichir(p, txt);
      cible.appendChild(p);
      para = [];
    }

    for (var i = 0; i < lignes.length; i++) {
      var t = lignes[i].trim();
      if (!t) { viderPara(); liste = null; continue; }

      if (/^(-{3,}|_{3,}|\*{3,})$/.test(t)) {
        viderPara(); liste = null;
        cible.appendChild(document.createElement('hr'));
        continue;
      }

      var mh = t.match(/^(#{1,6})\s+(.+)$/);
      if (mh) {
        viderPara(); liste = null;
        var h = document.createElement('span');
        h.className = 'amb-h' + (mh[1].length >= 3 ? ' amb-h2' : '');
        enrichir(h, mh[2].replace(/\s*#+\s*$/, ''));
        cible.appendChild(h);
        continue;
      }

      /* Une ligne entièrement en gras sert de titre : le modèle écrit souvent
         « **Étape 1 — la situation d'énonciation** » sans dièse. */
      var mg = t.match(/^\*\*([^*]+)\*\*:?$/);
      if (mg) {
        viderPara(); liste = null;
        var h2 = document.createElement('span');
        h2.className = 'amb-h amb-h2';
        h2.textContent = mg[1];
        cible.appendChild(h2);
        continue;
      }

      var mu = t.match(/^[-*•]\s+(.+)$/);
      var mo = t.match(/^\d+[.)]\s+(.+)$/);
      if (mu || mo) {
        viderPara();
        var type = mu ? 'ul' : 'ol';
        if (!liste || liste.tagName.toLowerCase() !== type) {
          liste = document.createElement(type);
          cible.appendChild(liste);
        }
        var li = document.createElement('li');
        enrichir(li, mu ? mu[1] : mo[1]);
        liste.appendChild(li);
        continue;
      }

      liste = null;
      para.push(t);
    }
    viderPara();

    if (!cible.firstChild) {
      cible.className = 'amb-b-a amb-brut';
      cible.textContent = texte;
    }
  }

  function bulle(role, texte) {
    var z = document.getElementById('amb-msgs');
    if (!z) return null;
    var b = el('div', '', texte);
    /* Les bulles posées en clair (accueil, avertissements, quota) gardent
       pre-wrap : leurs retours à la ligne sont voulus. rendreReponse retire
       « amb-brut » quand il reconstruit une réponse en blocs. */
    b.className = (role === 'user') ? 'amb-b-u' : 'amb-b-a amb-brut';
    z.appendChild(b);
    z.scrollTop = z.scrollHeight;
    return b;
  }

  function majQuota() {
    var q = document.getElementById('amb-quota');
    if (!q) return;
    var r = quotaRestant();
    q.textContent = r > 0
      ? ('Il te reste ' + r + ' question' + (r > 1 ? 's' : '') + ' offerte' + (r > 1 ? 's' : '') + ' cette semaine.')
      : 'Questions offertes épuisées cette semaine — l’abonnement en donne 30 par jour.';
  }

  function envoyer() {
    var champ = document.getElementById('amb-in');
    if (!champ) return;
    var q = (champ.value || '').trim();
    if (!q || enCours) return;
    if (q.length > 2000) q = q.slice(0, 2000);

    var base = apiBase();
    if (!base) { bulle('bot', '⚠️ Le tuteur a besoin d’une connexion Internet.'); return; }
    if (quotaRestant() <= 0) {
      champ.value = '';
      bulle('bot', 'Tu as utilisé tes 3 questions offertes de la semaine. Le Professeur Ambassa répond 30 fois par jour avec un abonnement — rendez-vous sur la page des abonnements.');
      return;
    }

    champ.value = '';
    /* Dès qu'une vraie conversation commence, la grille cède la place à la
       réponse : c'est elle qu'on vient lire. Le bandeau la rouvre en un clic. */
    basculerOutils(false);
    bulle('user', q);
    enCours = true;
    var bouton = document.getElementById('amb-send');
    if (bouton) { bouton.disabled = true; bouton.style.opacity = '.55'; }
    var rep = bulle('bot', '…');
    if (rep) rep.setAttribute('aria-busy', 'true');

    var tache = null;
    for (var i = 0; i < TACHES.length; i++) if (TACHES[i].id === outilActif) tache = TACHES[i];
    var envoi = tache ? (tache.p + q) : q;

    fetch(base + '/ia_proxy.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'omit',
      body: JSON.stringify({
        prompt: envoi, plan: 'anon', userId: '',
        sysPrompt: 'Tu es le Professeur Ambassa, professeur camerounais : clair, exigeant, chaleureux. '
                 + 'Tu suis le programme MINESEC (BEPC, Probatoire, BAC, GCE). Tu réponds en français.'
      })
    })
      .then(function (r) {
        return r.json().then(function (j) { return { ok: r.ok, status: r.status, j: j }; },
                             function () { return { ok: r.ok, status: r.status, j: {} }; });
      })
      .then(function (res) {
        enCours = false;
        var b = document.getElementById('amb-send');
        if (b) { b.disabled = false; b.style.opacity = ''; }
        var j = res.j || {};
        /* JAMAIS innerHTML sur du texte d'IA : une réponse n'est pas du balisage
           de confiance. rendreReponse met la réponse en forme en fabriquant des
           nœuds, et le texte du modèle n'entre que par textContent — la mise en
           forme a donc changé, la garantie non. */
        if (rep) rep.removeAttribute('aria-busy');
        if (res.ok && j.text) {
          rendreReponse(rep, j.text);
          var z = document.getElementById('amb-msgs');
          if (z) z.scrollTop = z.scrollHeight;
          quotaConsommer(); majQuota();
        }
        else if (res.status === 429) { if (rep) rep.textContent = '⚠️ ' + (j.error || 'Trop de questions d’un coup — patiente une minute.'); }
        else if (rep) { rep.textContent = j.error ? ('⚠️ ' + j.error) : '⚠️ Le Professeur Ambassa est momentanément indisponible.'; }
      })
      .catch(function () {
        enCours = false;
        var b = document.getElementById('amb-send');
        if (b) { b.disabled = false; b.style.opacity = ''; }
        if (rep) { rep.removeAttribute('aria-busy'); rep.textContent = '⚠️ Connexion interrompue. Réessaie.'; }
      });
  }

  function choisirOutil(t, btn) {
    outilActif = (outilActif === t.id) ? '' : t.id;
    var tous = document.querySelectorAll('.amb-out button');
    for (var i = 0; i < tous.length; i++) tous[i].setAttribute('aria-pressed', 'false');
    var champ = document.getElementById('amb-in');
    if (outilActif) {
      btn.setAttribute('aria-pressed', 'true');
      if (champ) { champ.placeholder = t.ph; try { champ.focus(); } catch (e) {} }
      bulle('bot', t.t + ' — ' + t.d + '. Dis-moi le sujet, je m’occupe du reste.');
    } else if (champ) {
      champ.placeholder = 'Pose ta question au Professeur Ambassa…';
    }
  }

  function construirePanneau() {
    var p = el('div');
    p.className = 'amb-pan';
    p.id = 'amb-pan';
    p.setAttribute('role', 'dialog');
    p.setAttribute('aria-label', 'Professeur Ambassa, tuteur pédagogique');

    var hd = el('div'); hd.className = 'amb-hd';
    var av = el('div'); av.className = 'amb-hd-av';
    var im = document.createElement('img'); im.src = AVATAR; im.alt = ''; av.appendChild(im);
    var tit = el('div');
    tit.appendChild(el('div', 'font:800 15px Poppins,sans-serif', 'Professeur Ambassa'));
    tit.appendChild(el('div', 'font:400 11px Poppins,sans-serif;opacity:.82', 'Agent IA pédagogique · MINESEC'));
    var x = el('button', '', '×'); x.className = 'amb-hd-x'; x.setAttribute('aria-label', 'Fermer');
    x.addEventListener('click', fermer);
    hd.appendChild(av); hd.appendChild(tit); hd.appendChild(x);

    /* Bandeau de bascule des outils. Il porte le compte (« 8 outils ») parce
       qu'une fois la grille repliée, rien ne dirait plus qu'elle existe. */
    var barre = el('div'); barre.className = 'amb-outbar';
    var bascule = document.createElement('button');
    bascule.type = 'button'; bascule.id = 'amb-outbtn';
    bascule.setAttribute('aria-expanded', 'true');
    bascule.setAttribute('aria-controls', 'amb-out');
    bascule.appendChild(el('span', '', '▾')).className = 'amb-chev';
    bascule.appendChild(document.createTextNode(TACHES.length + ' outils'));
    bascule.addEventListener('click', function () { basculerOutils(); });
    barre.appendChild(bascule);

    var outils = el('div'); outils.className = 'amb-out'; outils.id = 'amb-out';
    TACHES.forEach(function (t) {
      var b = document.createElement('button');
      b.type = 'button';
      b.setAttribute('aria-pressed', 'false');
      b.style.borderLeft = '3px solid ' + t.c;
      b.appendChild(document.createTextNode(t.t));
      b.appendChild(el('small', '', t.d));
      b.addEventListener('click', function () { choisirOutil(t, b); });
      outils.appendChild(b);
    });

    var msgs = el('div'); msgs.className = 'amb-msgs'; msgs.id = 'amb-msgs';
    msgs.setAttribute('aria-live', 'polite');

    var bas = el('div'); bas.className = 'amb-bas';
    var row = el('div'); row.className = 'amb-row';
    var ta = document.createElement('textarea');
    ta.id = 'amb-in'; ta.rows = 1;
    ta.placeholder = 'Pose ta question au Professeur Ambassa…';
    ta.setAttribute('aria-label', 'Votre question');
    ta.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); envoyer(); }
    });
    var send = document.createElement('button');
    send.type = 'button'; send.id = 'amb-send'; send.textContent = 'Envoyer';
    send.addEventListener('click', envoyer);
    row.appendChild(ta); row.appendChild(send);
    var q = el('div', '', ''); q.className = 'amb-q'; q.id = 'amb-quota';
    bas.appendChild(row); bas.appendChild(q);

    p.appendChild(hd); p.appendChild(barre); p.appendChild(outils);
    p.appendChild(msgs); p.appendChild(bas);
    document.body.appendChild(p);

    bulle('bot', 'Bonjour ! Je suis le Professeur Ambassa. Choisis un outil ci-dessus, ou pose directement ta question — programme camerounais, de la 6ᵉ à la Terminale.');
    majQuota();
    return p;
  }

  function fermer() {
    var p = document.getElementById('amb-pan');
    if (p && p.parentNode) p.parentNode.removeChild(p);
    ouvert = false;
    var f = document.querySelector('.amb-fab');
    if (f) { f.setAttribute('aria-expanded', 'false'); try { f.focus(); } catch (e) {} }
  }

  function ouvrir() {
    /* Dans l'APPLICATION, le tuteur complet existe déjà : historique, formulaires
       par tâche, quotas serveur par palier. On lui passe la main plutôt que de
       poser un second tuteur, plus pauvre, par-dessus. */
    if (typeof window.mAgentAmbassa === 'function') { window.mAgentAmbassa(); return; }
    if (ouvert) { fermer(); return; }
    construirePanneau();
    ouvert = true;
    ajusterPosition();
    var f = document.querySelector('.amb-fab');
    if (f) f.setAttribute('aria-expanded', 'true');
    var ta = document.getElementById('amb-in');
    if (ta) { try { ta.focus(); } catch (e) {} }
  }

  /* La page porte-t-elle déjà un bouton qui ouvre Ambassa ? */
  /* ⚠️ 28/08/2026 — cette garde ne voyait PAS la porte de l'application.
     Elle cherchait un aria-label ÉGAL à « Professeur Ambassa ». Or le bouton
     posé par app.html (`#vAmbassaFab`, dans #VISITOR, coin bas-GAUCHE) porte
     « Poser une question au Professeur Ambassa, l'assistant IA », et n'a pas
     d'`onclick` inline — il écoute au JavaScript. Aucun des trois sélecteurs
     ne le trouvait : ambassa.js se croyait seul et posait sa pastille
     « Besoin d'aide ? » à droite. Deux avatars du même tuteur à l'écran, un
     dans chaque coin — visible sur l'espace enseignant.
     On reconnaît désormais la porte par son identifiant, par un aria-label
     qui MENTIONNE Ambassa, ou par l'appel à `mAgentAmbassa`.
     `:not(.amb-fab)` est indispensable : sans lui, la pastille d'ambassa.js
     se reconnaîtrait elle-même — son propre aria-label dit « Ouvrir le
     Professeur Ambassa » — et `surveillerPorte()` la supprimerait aussitôt
     après l'avoir posée, sur les pages qui n'ont aucune autre porte. */
  function porteDeLaPage() {
    var candidats = document.querySelectorAll(
      '#vAmbassaFab, button[aria-label*="Ambassa"]:not(.amb-fab),'
      + ' [onclick*="basculerIA"], [onclick*="ouvrirIA"], [onclick*="mAgentAmbassa"]'
    );
    /* Une porte MASQUÉE n'est pas une porte. `#vAmbassaFab` vit dans #VISITOR,
       que l'application cache sur l'écran de connexion : s'en remettre à sa
       seule présence dans le DOM priverait cet écran de tout accès au tuteur.
       On mesure donc la boîte plutôt que de supposer — `offsetParent` ne
       conviendrait pas, il vaut null pour tout élément en position fixe. */
    for (var i = 0; i < candidats.length; i++) {
      var r = candidats[i].getBoundingClientRect();
      if (r.width > 0 && r.height > 0) return candidats[i];
    }
    return null;
  }

  /* ── Le doublon revenait par la petite porte : le TEMPS ───────────────────
     La vérification ci-dessous ne se faisait qu'une fois, au démarrage. Or la
     porte de la vitrine n'est pas dans le HTML : c'est vitrine.js qui la rend.
     Quand l'accueil met un peu plus longtemps à se construire — machine lente,
     réseau lent, tout ce qui est la règle et non l'exception à Douala —
     ambassa.js regarde AVANT qu'elle existe, ne trouve rien, et pose sa propre
     pastille. Les deux avatars apparaissent alors ensemble, en bas de l'écran,
     pour un seul et même tuteur. Le défaut est intermittent : invisible sur un
     poste rapide, permanent sur un autre.
     On continue donc de surveiller pendant quelques secondes, et on s'efface
     dès que la vraie porte arrive. */
  function surveillerPorte() {
    var essais = 0;
    var t = setInterval(function () {
      essais++;
      if (porteDeLaPage()) {
        var f = document.querySelector('.amb-fab');
        if (f && f.parentNode) { f.parentNode.removeChild(f); }
        window.__ambassaDelegue = 'vitrine';
        clearInterval(t);
      } else if (essais >= 16) {          // ~8 s : au-delà, la page n'en a pas
        clearInterval(t);
      }
    }, 500);
  }

  function poserLanceur() {
    if (document.querySelector('.amb-fab')) return;

    /* La page a-t-elle DÉJÀ sa porte vers Ambassa ?
       La règle « déléguer au tuteur d'origine » ne couvrait que l'APPLICATION
       (`window.mAgentAmbassa`). Or la VITRINE a, elle aussi, son propre bouton
       Ambassa — l'avatar de la colonne flottante, qui appelle
       `VRT.act('basculerIA')`. Sur l'accueil, les deux se posaient au même
       endroit : la pastille « Besoin d'aide ? » d'ambassa.js (201 × 60, z 9000)
       recouvrait exactement le FAB de la vitrine (62 × 62). Deux avatars
       superposés pour un seul tuteur.
       Une page qui sait déjà ouvrir Ambassa n'a pas besoin d'une seconde
       porte : on s'efface. `window.__ambassaDelegue` reste vrai pour que
       `ouvrir()` sache vers quoi router. */
    if (porteDeLaPage()) { window.__ambassaDelegue = 'vitrine'; return; }

    var b = document.createElement('button');
    b.type = 'button';
    b.className = 'amb-fab';
    b.setAttribute('aria-label', 'Ouvrir le Professeur Ambassa, tuteur pédagogique');
    b.setAttribute('aria-expanded', 'false');

    var lab = el('span', '', 'Besoin d’aide ?');
    lab.className = 'amb-fab-l';
    var av = el('span'); av.className = 'amb-fab-av';
    var img = document.createElement('img');
    /* PAS de loading="lazy" ici : le lanceur est en position fixe, donc visible
       dès le premier écran. Marqué paresseux, le navigateur diffère la requête
       et l'avatar reste vide — mesuré : naturalWidth = 0 après une seconde. */
    img.alt = ''; img.decoding = 'async'; img.src = AVATAR;
    av.appendChild(img);
    av.appendChild(el('span')).className = 'amb-fab-b';

    b.appendChild(lab); b.appendChild(av);
    b.addEventListener('click', ouvrir);
    document.body.appendChild(b);
    surveillerPorte();
  }

  /* Échap ferme le panneau : un dialogue qui ne se ferme qu'à la souris est un
     dialogue qui piège l'utilisateur au clavier. */
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && ouvert) fermer();
  });

  /* ── Ne pas se poser SUR un bouton flottant qui existe déjà ─────────────
     Deux autres pastilles occupent déjà le coin bas-droit, au même z-index :
       · .vrt-wa-fab — le WhatsApp des pages statiques (veritas-pages.css,
         right:16px, bottom:18px) ;
       · .vfx-fab    — son équivalent dans l'application (app.css).
     Mesuré sur /corriges/ à 375 px : les deux se superposaient exactement,
     `elementsFromPoint` au centre du lanceur renvoyait le lien WhatsApp.

     Ambassa est le nouveau venu : c'est donc lui qui monte d'un cran, plutôt
     que de déplacer un bouton présent sur 62 pages et dans l'application. Il
     reste le plus visible des deux — il est plus grand et porte un visage.
     Le second passage à 700 ms n'est pas de la superstition : veritas-ui.js
     injecte SA pastille au DOMContentLoaded lui aussi, l'ordre entre deux
     scripts `defer` n'est pas garanti selon la page. */
  function ajusterPosition() {
    var f = document.querySelector('.amb-fab');
    if (!f) return;
    var autre = document.querySelector('.vrt-wa-fab, .vfx-fab');
    if (!autre) return;
    var h = Math.round(autre.getBoundingClientRect().height) || 46;
    f.style.bottom = 'calc(' + (18 + h + 12) + 'px + env(safe-area-inset-bottom,0px))';
    var p = document.getElementById('amb-pan');
    if (p) p.style.bottom = 'calc(' + (92 + h + 12) + 'px + env(safe-area-inset-bottom,0px))';

    /* ── Deux pastilles bavardes dans le même coin ────────────────────────
       Empilées, « Besoin d'aide ? » (199 px) et « Une question ? Réponse
       sous 2 h » (212 px) forment un bloc de plus de 130 px de haut collé au
       bord droit, qui recouvre le début des cartes — constaté sur la page des
       corrigés, où il masquait « Premier cycle ». Deux invitations à écrire
       côte à côte se concurrencent, en plus, au lieu de s'ajouter.
       Quand la page porte déjà sa propre pastille à étiquette, Ambassa garde
       son avatar — rond, reconnaissable, 60 px — et laisse tomber la sienne.
       L'étiquette revient dès que l'autre disparaît. */
    var etiq = f.querySelector('.amb-fab-l');
    if (etiq) {
      var large = Math.round(autre.getBoundingClientRect().width) > 90;
      etiq.style.display = large ? 'none' : '';
    }
  }

  function demarrer() {
    poserStyle(); poserLanceur(); ajusterPosition();
    setTimeout(ajusterPosition, 700);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', demarrer);
  else demarrer();

  /* Porte d'entrée pour le reste du site : un bouton « Demander à Ambassa »
     n'importe où peut appeler window.ambassaOuvrir(). */
  window.ambassaOuvrir = ouvrir;
})();
