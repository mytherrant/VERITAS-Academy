/* ============================================================================
   VÉRITAS — BLOC DE CONVERSION DES PAGES SEO
   Fichier : assets/veritas-convert.js   ·   © 2026 Mythe Errant · Centre VÉRITAS

   ── POURQUOI ──────────────────────────────────────────────────────────────
   Mesure faite sur /corriges/ (la page d'entrée SEO la plus forte du site,
   4 212 exercices corrigés, 5,8 écrans) : 21 liens, dont DEUX seulement
   menaient ailleurs que dans l'arborescence des corrigés — tous les deux vers
   la même page, au 4,9ᵉ et au 5,7ᵉ écran, sous les libellés « Voir Hub » et
   « Espace Manuels ». Aucun lien vers la plateforme, vers un compte, vers un
   abonnement. Un visiteur venu de Google prenait le corrigé et repartait.
   Les pages /niveaux/, /oeuvres/ et /outils/ sont dans le même cas.

   ── CE QUE FAIT CE FICHIER ────────────────────────────────────────────────
   Il ajoute, avant le pied de page, UN bloc qui part de ce que la personne
   vient d'obtenir gratuitement et lui dit ce qui existe ensuite. Le message
   est choisi selon la rubrique (corrigés, programme, œuvres, outils…) :
   un même argumentaire recopié six fois ne parle à personne.

   ── RÈGLES TENUES ─────────────────────────────────────────────────────────
     · aucun chiffre inventé — les prix sont lus sur /api/public_data.php ;
       si l'appel échoue, la ligne de prix n'est simplement pas affichée ;
     · le « par mois » est une DIVISION du prix réel, et le texte dit d'où
       elle vient ;
     · aucune rareté fabriquée, aucun compte à rebours, aucun témoignage ;
     · les corrigés restent gratuits et ne republient aucun énoncé — le bloc
       ne le laisse jamais entendre ;
     · autonome : aucune dépendance, aucun style hérité. Ces pages n'ont pas
       toutes le même socle CSS (corriges/ charge veritas-pages.css, niveaux/
       et oeuvres/ n'ont aucune feuille externe).
   ========================================================================= */
(function () {
  'use strict';

  if (window.__vrtConvertDone) return;
  window.__vrtConvertDone = true;

  var SITE = 'https://veritas-school.com';

  /* ── Le message, par rubrique ─────────────────────────────────────────
     Chaque entrée nomme d'abord le service rendu GRATUITEMENT, puis ce que
     l'abonnement ajoute. On demande après avoir donné, jamais avant. */
  var MSG = {
    corriges: {
      libre: 'Les corrigés des cahiers sont gratuits, sans compte, et le resteront.',
      titre: 'Vous avez la correction. L\'entraînement, lui, se prépare.',
      corps: 'Un corrigé montre le chemin une fois. Ce qui fait la différence en salle d\'examen, '
           + 'c\'est le nombre de sujets réellement traités avant. L\'abonnement ouvre les épreuves '
           + 'séquentielles des grands lycées avec leur correction détaillée, les anciens sujets '
           + 'nationaux, et les cours rédigés matière par matière.',
      ctaB: { t: 'Voir les abonnements', h: SITE + '/#tarifs' },
      ctaS: { t: 'Commander le cahier papier', h: SITE + '/manuels.html' }
    },
    niveaux: {
      libre: 'Le programme officiel de chaque classe est consultable librement.',
      titre: 'Savoir ce qu\'il faut réviser ne dit pas encore comment.',
      corps: 'Le programme donne la liste des notions. Il ne donne ni la façon dont elles tombent '
           + 'à l\'examen, ni le niveau attendu. L\'abonnement apporte les épreuves corrigées de la '
           + 'classe, les cours en PDF et les fiches de révision — le programme, mais traité.',
      ctaB: { t: 'Voir les abonnements', h: SITE + '/#tarifs' },
      ctaS: { t: 'Le cahier de ma classe', h: SITE + '/manuels.html' }
    },
    oeuvres: {
      libre: 'L\'analyse des œuvres au programme est en accès libre, avec les cartes mentales.',
      titre: 'Connaître l\'œuvre est une chose. La traiter en trois heures en est une autre.',
      corps: 'Le jour de l\'épreuve, on ne vous demande pas de résumer le livre : on vous demande '
           + 'un commentaire ou une dissertation, sur un sujet précis, en temps limité. '
           + 'L\'abonnement donne les sujets déjà tombés sur ces œuvres, leur corrigé, et la '
           + 'méthode qui va avec.',
      ctaB: { t: 'Voir les abonnements', h: SITE + '/#tarifs' },
      ctaS: { t: 'Le cahier d\'étude de l\'œuvre', h: SITE + '/manuels.html' }
    },
    outils: {
      libre: 'La moyenne, les points manquants et le planning de révision sont gratuits.',
      titre: 'Calculer sa moyenne montre où l\'on en est. La faire monter demande autre chose.',
      corps: 'L\'outil vous dit qu\'il manque trois points en français. Il ne vous dit pas comment '
           + 'les prendre. L\'abonnement ouvre les épreuves corrigées et les cours de la matière '
           + 'concernée, pour que le prochain devoir ne ressemble pas au précédent.',
      ctaB: { t: 'Voir les abonnements', h: SITE + '/#tarifs' },
      ctaS: { t: 'Découvrir la plateforme', h: SITE + '/' }
    },
    _defaut: {
      libre: 'L\'essentiel de VÉRITAS est gratuit et sans compte : corrigés, œuvres, outils, tuteur IA.',
      titre: 'Et si on allait au bout du travail ?',
      corps: 'Les épreuves des grands lycées avec leur correction, les cours rédigés, les anciens '
           + 'sujets d\'examen et un enseignant du centre joignable sur WhatsApp sont réunis dans '
           + 'l\'abonnement.',
      ctaB: { t: 'Voir les abonnements', h: SITE + '/#tarifs' },
      ctaS: { t: 'Découvrir la plateforme', h: SITE + '/' }
    }
  };

  function contexte() {
    var p = (location.pathname || '').toLowerCase();
    if (p.indexOf('/corriges') === 0 || p.indexOf('/corriges') > -1) return 'corriges';
    if (p.indexOf('/niveaux') > -1) return 'niveaux';
    if (p.indexOf('/oeuvres') > -1) return 'oeuvres';
    if (p.indexOf('/outils') > -1) return 'outils';
    return '_defaut';
  }

  function fcfa(n) {
    return String(Math.round(n)).replace(/\B(?=(\d{3})+(?!\d))/g, ' ') + ' FCFA';
  }

  /* ── Styles. Portée stricte au bloc : ces pages ont des socles CSS
        différents (ou aucun), rien ne doit fuir vers leur mise en page. ── */
  function styles() {
    if (document.getElementById('vrtc-css')) return;
    var s = document.createElement('style');
    s.id = 'vrtc-css';
    s.textContent = [
      // Bloc d'action = fond BLEU. Les pages SEO sont entièrement blanches ;
      // un bloc clair de plus s'y serait dissous. Aucun trait de bordure :
      // c'est le contraste de fond qui sépare, pas une ligne.
      '.vrtc{margin:44px auto;max-width:920px;padding:0 20px;',
      '  font-family:Poppins,system-ui,-apple-system,"Segoe UI",Roboto,Helvetica,Arial,sans-serif;',
      '  -webkit-font-smoothing:antialiased}',
      '.vrtc-in{background:linear-gradient(135deg,#142554 0%,#1E3A8A 55%,#2450A8 100%);',
      '  border:0; border-radius:16px; padding:30px 32px;',
      '  box-shadow:0 14px 34px rgba(20,37,84,.18)}',
      '.vrtc-libre{display:flex;gap:9px;align-items:flex-start;margin:0 0 14px;',
      '  font-size:13.5px;line-height:1.55;color:#7BE8C2;font-weight:500}',
      '.vrtc-libre svg{width:16px;height:16px;flex:0 0 16px;margin-top:2px;fill:none;',
      '  stroke:#7BE8C2;stroke-width:2.2;stroke-linecap:round;stroke-linejoin:round}',
      '.vrtc-t{margin:0 0 12px;font-size:25px;line-height:1.24;font-weight:600;color:#fff}',
      '.vrtc-d{margin:0 0 18px;font-size:15.5px;line-height:1.72;color:#D3DEF2}',
      '.vrtc-prix{display:none;margin:0 0 20px;padding:12px 16px;',
      '  background:rgba(255,255,255,.08); border:0; border-radius:9px;',
      '  font-size:15px;color:#E8EEF9}',
      '.vrtc-prix b{font-weight:600;color:#FFC93C}',
      '.vrtc-act{display:flex;flex-wrap:wrap;gap:12px;align-items:center}',
      '.vrtc-b{display:inline-block;padding:14px 26px;border-radius:9px;font-size:15px;',
      '  font-weight:600;text-decoration:none;border:0;transition:background .16s}',
      '.vrtc-b1{background:#FFC93C;color:#142554}',
      '.vrtc-b1:hover{background:#FFD86E}',
      '.vrtc-b2{background:rgba(255,255,255,.12);color:#fff}',
      '.vrtc-b2:hover{background:rgba(255,255,255,.20)}',
      '.vrtc-res{display:flex;align-items:center;gap:7px;margin-top:16px;',
      '  font-size:12.5px;color:#C8D6EE}',
      '.vrtc-res svg{width:14px;height:14px;flex:0 0 14px;fill:none;stroke:#C8D6EE;',
      '  stroke-width:2;stroke-linecap:round;stroke-linejoin:round}',
      '@media (max-width:620px){',
      '  .vrtc{margin:32px auto;padding:0 16px}',
      '  .vrtc-in{padding:23px 20px}',
      '  .vrtc-t{font-size:20px}.vrtc-d{font-size:14.5px}',
      '  .vrtc-b{width:100%;text-align:center}}',
    ].join('');
    document.head.appendChild(s);
  }

  function ico(d) {
    return '<svg viewBox="0 0 24 24" aria-hidden="true">' + d + '</svg>';
  }
  var I_CHECK  = ico('<polyline points="20 6 9 17 4 12"/>');
  var I_SHIELD = ico('<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>');

  function construire() {
    var m = MSG[contexte()];
    var d = document.createElement('aside');
    d.className = 'vrtc';
    d.setAttribute('aria-label', 'Aller plus loin avec VÉRITAS');
    d.innerHTML =
        '<div class="vrtc-in">'
      +   '<p class="vrtc-libre">' + I_CHECK + '<span>' + m.libre + '</span></p>'
      +   '<h2 class="vrtc-t">' + m.titre + '</h2>'
      +   '<p class="vrtc-d">' + m.corps + '</p>'
      +   '<p class="vrtc-prix" id="vrtc-prix"></p>'
      +   '<div class="vrtc-act">'
      +     '<a class="vrtc-b vrtc-b1" href="' + m.ctaB.h + '">' + m.ctaB.t + ' →</a>'
      +     '<a class="vrtc-b vrtc-b2" href="' + m.ctaS.h + '">' + m.ctaS.t + '</a>'
      +   '</div>'
      +   '<p class="vrtc-res">' + I_SHIELD
      +     '<span>Mobile Money (MTN / Orange) · sans engagement · aucune reconduction automatique</span></p>'
      + '</div>';
    return d;
  }

  /* Prix RÉELS. Aucune valeur n'est écrite en dur ici : si l'appel échoue
     (hors ligne, page ouverte en local), la ligne reste masquée — mieux vaut
     pas de prix qu'un prix périmé. */
  function prix() {
    if (!window.fetch) return;
    fetch(SITE + '/api/public_data.php', { cache: 'no-store' })
      .then(function (r) { return r.ok ? r.json() : null; })
      .then(function (j) {
        if (!j || !j.elearning_plans) return;
        var p = j.elearning_plans
          .filter(function (x) { return x && x.actif !== false && Number(x.prix) > 0; })
          .sort(function (a, b) { return Number(a.prix) - Number(b.prix); })[0];
        if (!p) return;
        var el = document.getElementById('vrtc-prix');
        if (!el) return;
        var v = Number(p.prix), txt = 'À partir de <b>' + fcfa(v) + '</b>';
        if (/an|année|scolaire/i.test(String(p.duree || '')) && v >= 1000) {
          txt += ' pour l\'année — soit <b>' + fcfa(Math.round(v / 10 / 50) * 50)
              +  ' par mois</b> sur les 10 mois de l\'année scolaire';
        }
        el.innerHTML = txt;
        el.style.display = 'block';
      })
      .catch(function () { /* silence : pas de prix plutôt qu'un prix faux */ });
  }

  function poser() {
    if (document.querySelector('.vrtc')) return;
    styles();
    var bloc = construire();
    // Avant le pied de page s'il y en a un, sinon en fin de corps.
    var foot = document.querySelector('footer.bot') || document.querySelector('footer');
    if (foot && foot.parentNode) foot.parentNode.insertBefore(bloc, foot);
    else document.body.appendChild(bloc);
    prix();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', poser);
  } else {
    poser();
  }
})();
