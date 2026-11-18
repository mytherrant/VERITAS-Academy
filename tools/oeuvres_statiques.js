/* Analyses d'œuvres en HTML statique — oeuvres/*.html
 *
 * POURQUOI (05/11/2026, visibilité IA et moteurs)
 * Chaque page d'œuvre pesait 80 Ko, mais un robot n'y lisait qu'un résumé de
 * trois lignes, cinq thèmes et une citation : l'analyse complète (axes,
 * personnages, citations expliquées, procédés, questions de contrôle) vit dans
 * chunks/litt-oeuvres.js et ne s'affiche qu'après JavaScript, dans
 * l'application. Or ni Googlebot à son premier passage, ni ChatGPT, Claude ou
 * Perplexity n'exécutent ce JavaScript : pour eux, VÉRITAS n'avait presque rien
 * à dire sur Ville cruelle. Une page mince n'est jamais citée.
 *
 * CE QUE FAIT LE SCRIPT (idempotent)
 *   · dans <article>, juste avant le bouton « Analyse complète », il pose
 *     <!-- oeuvre-statique --> … <!-- /oeuvre-statique --> : fiche d'identité,
 *     axes de lecture, personnages, style, contexte, l'analyse de VÉRITAS,
 *     citations expliquées, procédés d'écriture, questions de contrôle ;
 *   · avant </head>, <!-- oeuvre-ld --> … <!-- /oeuvre-ld --> : FAQPage tirée
 *     des questions de contrôle + LearningResource (classe, examen).
 * La source unique reste chunks/litt-oeuvres.js : une analyse corrigée dans
 * l'application se répercute ici au prochain passage (--controle en CI).
 * Le quiz interactif et la carte mentale restent dans l'application : c'est
 * ce que le bouton propose.
 *
 *    node tools/oeuvres_statiques.js            # écrit
 *    node tools/oeuvres_statiques.js --controle # code 1 si une page changerait
 */
'use strict';
const fs = require('fs');
const path = require('path');

const RACINE = path.join(__dirname, '..');
const DOSSIER = path.join(RACINE, 'oeuvres');
const BASE = 'https://veritas-school.com/';
const CONTROLE = process.argv.includes('--controle');

global.window = { LITT_OEUVRES: {} };
require(path.join(RACINE, 'chunks', 'litt-oeuvres.js'));
const OEUVRES = global.window.LITT_OEUVRES;

const esc = s => String(s == null ? '' : s)
  .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
  .replace(/"/g, '&quot;').replace(/'/g, '&#x27;');
const net = s => String(s == null ? '' : s).replace(/[\u{1F000}-\u{1FAFF}\u{2600}-\u{2712}\u{2718}-\u{27BF}\u{FE0F}]/gu, '').replace(/\s+/g, ' ').trim();

// Même icône que les h2 existants de la page : le sprite #lc-* est déjà là.
const ico = id => '<svg class="vi" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" '
  + 'stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><use href="#lc-' + id + '"></use></svg>';
const h2 = (id, icone, titre) => '<h2 id="' + id + '">' + ico(icone) + ' ' + esc(titre) + '</h2>';

/* 13/11/2026 — « Trop compliqué pour la classe de 6e (kafkaïen, procédés du
   comique, figures de style...). Adapte au niveau des classes, langage simple,
   comique, captivant, didactique, avec beaucoup de leçons de morale » (Jacques).
   Au premier cycle d'entrée (6e, 5e), les intitulés parlent comme l'élève. */
const jeune = o => /^(6|5)/.test(String(o.classe || ''));
const LIB = {
  resume: ['Résumé & présentation', 'L’histoire en bref'],
  themes: ['Thèmes principaux', 'Ce que le livre nous apprend'],
  axes: ['Axes de lecture', 'Les grandes idées du livre'],
  citations: ['Citations expliquées', 'Les phrases à retenir'],
  procedes: ['Procédés d’écriture à connaître', 'Les astuces de l’écrivain'],
  questions: ['Questions de compréhension corrigées', 'Vérifie que tu as compris'],
  figures: ['Procédés :', 'Les astuces :'],
  effet: ['Effet sur le lecteur :', 'Ce que ça fait au lecteur :'],
};
const lib = (o, k) => LIB[k][jeune(o) ? 1 : 0];

/* Deux pictogrammes de plus dans le sprite de la page : cœur (leçons de vie)
   et boussole (envie de lire la suite). */
const SYMBOLES = {
  'lc-heart': '<symbol id="lc-heart" viewBox="0 0 24 24"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></symbol>',
  'lc-compass': '<symbol id="lc-compass" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"/></symbol>',
};

/* Hiérarchie (13/11/2026, « hiérarchise la taille des icônes, titres, sous-titres :
   tout prête à confusion ») : mesuré sur 6e-bimanes.html, les sous-titres (h3,
   19 px) avaient la taille du texte (19 px) et l'anneau des titres (60 px)
   écrasait tout. Trois paliers nets : titre de section 24 px + anneau 46 px ;
   sous-titre 20 px bleu avec pastille ; texte 18 px. #vrtNav (la barre
   d'habillage, présente sur chaque page d'œuvre) donne la spécificité d'un id :
   les règles de veritas-habillage.css (0,5,4 + !important) cèdent. */
// Dessin des leçons d'Apprendre (17/11/2026) : tools/oeuvres_statiques.css, commentaires retirés.
const VRT_CM = require(path.join(RACINE, 'apprendre', '_src', '00-carte-mentale.js'));
const OE_CSS = VRT_CM.css + '\n' + fs.readFileSync(path.join(__dirname, 'oeuvres_statiques.css'), 'utf8').replace(/\r/g, '').replace(/\/\*[\s\S]*?\*\//g, '').replace(/\n\s*\n/g, '\n').trim();
const STYLE = '<!-- oeuvre-style -->\n<style>'
  + OE_CSS
  + '.lecons{display:grid;gap:12px;margin:8px 0 6px}'
  + '.lecon{background:#FFF8E5;border-radius:14px;padding:14px 16px}'
  + '.lecon strong{display:block;font-size:18.5px;color:#001136;margin-bottom:4px}'
  + 'body:has(#vrtNav) .wrap article .lecon p{margin:0;text-align:left!important;font-size:17px!important}'
  + '.envie{background:#EEF3FC;border-radius:16px;padding:18px 18px 8px;margin:10px 0 4px}'
  + 'body:has(#vrtNav) .wrap article .envie p{text-align:left!important}'
  + '.envie .defi{background:#fff;border-radius:12px;padding:12px 14px}'
  + ':root[data-vrt-theme="sombre"] .lecon,:root[data-vrt-theme="sombre"] .envie,:root[data-vrt-theme="sombre"] .envie .defi{background:#132241}'
  + ':root[data-vrt-theme="sombre"] .lecon strong{color:#F2F5FC}'
  // Personnages en couleur, titres en italique bleu, auteur surligné (13/11/2026)
  + '.r-perso{color:#B03A6E;font-weight:700}'
  + '.r-titre{color:#1E499B;font-style:italic;font-weight:600}'
  + '.r-auteur{color:#001136;font-weight:700;background:linear-gradient(transparent 60%,#FFE08A 60%);padding:0 2px;border-radius:2px}'
  + ':root[data-vrt-theme="sombre"] .r-perso{color:#F49AC1}'
  + ':root[data-vrt-theme="sombre"] .r-titre{color:#9DBBF5}'
  + ':root[data-vrt-theme="sombre"] .r-auteur{color:#FFE08A;background:none}'
  + '</style>\n<!-- /oeuvre-style -->';

function examen(classe) {
  const c = String(classe || '').toLowerCase();
  if (/3/.test(c)) return 'BEPC';
  if (/1|premi/.test(c)) return 'Probatoire';
  if (/tle|termin/.test(c)) return 'BAC';
  return '';
}

function analyseHtml(contenu) {
  // Blocs séparés par une ligne vide. Une première ligne courte qui ouvre sur
  // un pictogramme ou en capitales (« 📖 SCÈNE — Le contrôle du cacao ») est
  // un intertitre ; le reste, des paragraphes.
  return String(contenu || '').split(/\n\s*\n/).map(bloc => {
    const lignes = bloc.split('\n').map(l => net(l)).filter(Boolean);
    if (!lignes.length) return '';
    let html = '';
    if (lignes.length > 1 && lignes[0].length <= 90
        && (/^[^\p{L}\p{N}«"]/u.test(lignes[0]) || /[A-ZÉÈÀ]{4,}/.test(lignes[0]))) {
      html += '<h3>' + esc(lignes.shift()) + '</h3>';
    }
    return html + lignes.map(l => '<p>' + esc(l) + '</p>').join('');
  }).join('\n');
}

// Teinte pâle calculée (le correcteur de contraste du site ne sait pas lire color-mix()).
const pale = (hex, a) => '#' + [1, 3, 5].map(i => Math.round(parseInt(hex.slice(i, i + 2), 16) * a + 255 * (1 - a)).toString(16).padStart(2, '0')).join('');

function bloc(o, cle, nom) {
  const f = o.fiche || {};
  const out = ['<!-- oeuvre-statique -->', '<section class="oeuvre-statique" aria-label="Analyse de l’œuvre" style="text-align:left">'];

  const identite = [['Genre', f.genre], ['Forme', f.forme], ['Édition', f.edition], ['Époque', f.epoque],
    ['Mouvement', f.mouvement], ['Lieu', f.lieu]].filter(x => x[1]);
  if (identite.length) {
    out.push(h2('fiche', 'graduation', 'Fiche d’identité'));
    out.push('<ul class="oe-fiche">' + identite.map(x => '<li><strong>' + esc(x[0]) + '</strong> ' + esc(x[1]) + '</li>').join('') + '</ul>');
  }

  if ((f.axes || []).length) {
    out.push(h2('axes', 'target', lib(o, 'axes')));
    out.push('<ol>' + f.axes.map(a => '<li>' + esc(a) + '</li>').join('') + '</ol>');
  }

  /* Carte mentale dessinée (17/11/2026, « enrichis et illustre ») : le centre et les branches
     de litt-oeuvres.js, en HTML (lisible au téléphone, indexé), couleurs de l'application. */
  const carte = o.carte || {}, branches = (carte.branches || []).filter(b => (b.items || []).length);
  if (branches.length) {
    const centre = String(carte.centre || o.titre || '').split('\n').map(net).filter(Boolean);
    out.push(h2('carte', 'compass', 'La carte mentale de l’œuvre'));
    /* 18/11/2026 « de vraies cartes mentales » : réseau en étoile (écran large) et en arbre (téléphone),
       dessiné par apprendre/_src/00-carte-mentale.js (même module que les leçons). */
    out.push(VRT_CM({ centre: centre, branches: branches.map(b => ({ label: net(b.label), color: b.color, items: b.items.map(net) })) }));
  }

  const an = o.analyse || {};
  if (an.contenu) {
    out.push(h2('analyse', 'bookopen', an.angle ? 'L’analyse : ' + net(an.angle) : 'L’analyse VÉRITAS'));
    out.push(valoriser(analyseHtml(an.contenu), o, cle, false));
  }

  if ((o.morales || []).length) {
    out.push(h2('lecons', 'heart', 'Les leçons de vie'));
    out.push('<div class="lecons oe-postits">' + o.morales.map(m => '<div class="lecon"><strong>' + esc(m.t) + '</strong><p>' + valoriser(esc(m.d), o, cle, false) + '</p></div>').join('') + '</div>');
  }

  if ((o.citations || []).length) {
    out.push(h2('citations', 'pencil', lib(o, 'citations')));
    o.citations.forEach(c => {
      out.push('<figure class="cit"><blockquote>« ' + esc(net(c.texte)) + ' »</blockquote>'
        + (c.source ? '<figcaption>' + esc(c.source) + '</figcaption>' : '') + '</figure>');
      const exp = [];
      if ((c.figures || []).length) exp.push('<p><strong>' + lib(o, 'figures') + '</strong> ' + esc(c.figures.join(' ; ')) + '.</p>');
      if (c.analyse) exp.push('<p>' + esc(c.analyse) + '</p>');
      if (c.effet) exp.push('<p><strong>' + lib(o, 'effet') + '</strong> ' + esc(c.effet) + '</p>');
      if (exp.length) out.push('<div class="oe-enc oe-expl"><strong>' + (jeune(o) ? 'Je comprends la citation' : 'Explication') + '</strong>' + exp.join('') + '</div>');
    });
  }

  if ((o.techniques || []).length) {
    out.push(h2('procedes', 'pencil', lib(o, 'procedes')));
    o.techniques.forEach(t => {
      out.push('<div class="oe-enc oe-proc"><strong>' + esc(t.nom) + '</strong>');
      if (t.def) out.push('<p>' + esc(t.def) + '</p>');
      // Un exemple qui contient déjà ses guillemets (ou qui décrit au lieu de citer) n'en reçoit pas d'autres.
      if (t.exemple) { const ex = net(t.exemple); out.push('<p><strong>Exemple :</strong> ' + (/[«»]/.test(ex) ? esc(ex) : '« ' + esc(ex) + ' »') + '</p>'); }
      if (t.effet) out.push('<p><strong>Effet :</strong> ' + esc(t.effet) + '</p>');
      out.push('</div>');
    });
  }

  if ((o.controle || []).length) {
    out.push(h2('questions', 'graduation', lib(o, 'questions')));
    o.controle.forEach(q => {
      out.push('<details class="oe-ctrl"><summary>' + esc(q.q) + '</summary><p>' + esc(q.r) + '</p></details>');
    });
  }

  // Quiz (17/11/2026) : les QCM de l'application, réponse et explication à déplier.
  const qcm = (o.qcm || []).filter(q => q && q.q && (q.opts || []).length && q.opts[q.ans] != null);
  if (qcm.length) {
    out.push(h2('quiz', 'target', 'Teste-toi : ' + qcm.length + ' questions'));
    qcm.forEach((q, k) => {
      out.push('<div class="oe-qcm"><p class="oe-qq"><span>' + (k + 1) + '</span>' + esc(net(q.q)) + '</p><ol class="oe-opts">'
        + q.opts.map(x => '<li>' + esc(net(x)) + '</li>').join('') + '</ol><details><summary>Voir la réponse</summary><p><strong>Réponse '
        + 'ABCDEFGH'[q.ans] + ' :</strong> ' + esc(net(q.opts[q.ans])) + (q.exp ? (/[.!?…»]$/.test(net(q.opts[q.ans])) ? ' ' : '. ') + esc(net(q.exp)) : '') + '</p></details></div>');
    });
  }

  const ev = o.envie;
  if (ev && ev.accroche) {
    out.push(h2('envie', 'compass', 'Envie de lire la suite ?'));
    out.push('<div class="envie"><p>' + valoriser(esc(ev.accroche), o, cle, false) + '</p>'
      + ((ev.questions || []).length ? '<p><strong>Les questions que tu vas te poser :</strong></p><ul>' + ev.questions.map(q => '<li>' + esc(q) + '</li>').join('') + '</ul>' : '')
      + (ev.defi ? '<p class="defi">' + esc(ev.defi) + '</p>' : '') + '</div>');
  }

  const k = ORDRE.indexOf(nom), prec = ORDRE[k - 1], suiv = ORDRE[k + 1];
  const lien = (n, cls, mot) => { const x = OEUVRES[CLE[n]]; return x ? '<a class="' + cls + '" href="/oeuvres/' + n + '">' + (cls === 'oe-suiv' ? '' : '<span class="oe-fl">‹</span>')
    + '<span><small>' + mot + ' · ' + esc(x.classe) + '</small>' + esc(x.titre) + '</span>' + (cls === 'oe-suiv' ? '<span class="oe-fl">›</span>' : '') + '</a>' : ''; };
  if (k >= 0 && (prec || suiv)) out.push('<nav class="oe-suite" aria-label="Œuvres voisines">' + (prec ? lien(prec, 'oe-prec', 'Œuvre précédente') : '') + (suiv ? lien(suiv, 'oe-suiv', 'Œuvre suivante') : '') + '</nav>');
  out.push('</section>', '<!-- /oeuvre-statique -->');
  return out.join('\n');
}

function ld(o, url) {
  const ex = examen(o.classe);
  const graphe = [{
    '@type': 'LearningResource',
    '@id': url + '#analyse',
    name: o.titre + ' — analyse, résumé et fiche de lecture',
    about: { '@type': 'Book', name: o.titre, author: { '@type': 'Person', name: o.auteur } },
    educationalLevel: o.classe,
    educationalAlignment: { '@type': 'AlignmentObject', alignmentType: 'educationalSubject',
      educationalFramework: 'Programme MINESEC (Cameroun)', targetName: 'Français — ' + o.classe },
    learningResourceType: ['Fiche de lecture', 'Analyse littéraire', 'Questions corrigées'],
    teaches: ((o.fiche || {}).axes || []).map(net),
    inLanguage: 'fr',
    isAccessibleForFree: true,
    url: url,
    publisher: { '@type': 'EducationalOrganization', name: 'Centre VÉRITAS', url: BASE },
  }];
  if (ex) graphe[0].competencyRequired = 'Préparation au ' + ex;
  if ((o.controle || []).length) {
    graphe.push({
      '@type': 'FAQPage', '@id': url + '#questions', inLanguage: 'fr',
      mainEntity: o.controle.map(q => ({ '@type': 'Question', name: net(q.q),
        acceptedAnswer: { '@type': 'Answer', text: net(q.r) } })),
    });
  }
  const js = JSON.stringify({ '@context': 'https://schema.org', '@graph': graphe }).replace(/</g, '\\u003c');
  return '<!-- oeuvre-ld -->\n<script type="application/ld+json">' + js + '</script>\n<!-- /oeuvre-ld -->';
}

function remplacer(page, debut, fin, neuf, avant) {
  const re = new RegExp(debut.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '[\\s\\S]*?'
    + fin.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
  if (re.test(page)) return page.replace(re, () => neuf);
  const i = page.indexOf(avant);
  if (i < 0) return null;
  return page.slice(0, i) + neuf + '\n' + page.slice(i);
}

/* 13/11/2026 — « personnages en couleur, titre de l'œuvre, auteur en évidence »
   (Jacques, capture du résumé des Bimanes). Les noms sont listés ici plutôt que
   balisés dans litt-oeuvres.js : le résumé reste du texte brut pour l'application,
   l'index de recherche et les données structurées. */
const PERSONNAGES = {
  '6e_bimanes': ['Tchakarias', 'Ana', 'Nomo', 'Dany', 'Ambombo', 'Serge', 'Mbah', 'Ahanda', 'Towa', 'Etoundi', 'Garba'],
  '6e_chants_foret': ['Kulu', 'Zee', 'Ndoe', 'Berne', 'Nkaa', 'Dzungo\'o', 'Mvomo', 'Zameyo Mebenga'],
  '6e_contes_korotoumou': ['Korotoumou', 'Lièvre', 'Hyène', 'Mamoung', 'Maï'],
  '5e_arbre_fetiche': ['Paul Lanta', 'Paul'],
  '5e_nkum_wam': ['N\'koum-wam', 'N\'koum Epié'],
  '5e_pere_inconnu': ['Frérot'],
  '4e_trois_pretendants': ['Juliette', 'Ndi', 'Mbia', 'Tchetgen', 'Abessôlô', 'Atangana'],
  '4e_coeur_sahel': ['Faydé', 'Kondem'],
  '3e_ville_cruelle': ['Banda'],
  '3e_marmite_koka': ['Bintsamou', 'Lemba'],
  '2nde_tribus_capitoline': ['Mathieu', 'Sophie Mbezele', 'Jacqueline', 'Médard'],
  '2nde_poemes_sauvages': ['Henrike Grohs'],
  '2nde_tartuffe': ['Tartuffe', 'Orgon', 'Elmire', 'Dorine', 'Cléante'],
  '1ere_coeur_tenebres': ['Marlow', 'Kurtz'],
  '1ere_lion_perle': ['Sidi', 'Lakunlé', 'Baroka'],
  'tle_vieux_negro': ['Meka'],
  'tle_ngum_jemea': ['Rudolph Dualla Manga Bell', 'Dualla Manga Bell', 'Manga Bell', 'Von Roehm'],
};
/* Entre guillemets mais PAS des titres : surnoms (couleur des personnages) et
   paroles citées (laissées telles quelles). */
const SURNOMS = new Set(['Manos', 'Song\' Lina', 'Moitié d\'homme', 'Tortue Aux-Cent-Astuces']);
const PAROLES = new Set(['Va-t\'en au bout de la queue', 'J\'aime mon pays']);
const reEsc = s => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
function auteurs(o) {
  const a = String(o.auteur || ''), v = new Set();
  const sans = a.replace(/\s*\(.*?\)\s*/g, ' ').trim();
  v.add(sans);
  (a.match(/\(([^)]+)\)/g) || []).forEach(p => v.add(p.slice(1, -1).trim()));
  const mots = sans.split(/\s+/);
  if (mots.length > 2) v.add(mots.slice(-2).join(' '));
  if (mots.length > 1 && mots[mots.length - 1].length > 3) v.add(mots[mots.length - 1]);
  return [...v].filter(Boolean);
}
/* Met en valeur un texte DÉJÀ échappé. Avec titres : « Titre court » (majuscule,
   au plus 6 mots, sans ponctuation finale) = titre de nouvelle, conte ou poème. */
function valoriser(html, o, cle, titres) {
  const classe = {};
  const ajoute = (txt, cls) => { const t = esc(txt); if (t && !(t in classe)) classe[t] = cls; };
  (PERSONNAGES[cle] || []).forEach(p => ajoute(p, 'r-perso'));
  auteurs(o).forEach(a => ajoute(a, 'r-auteur'));
  ajoute(o.titre, 'r-titre');
  const t0 = String(o.titre || '');
  ajoute(t0.charAt(0) + t0.slice(1).toLowerCase(), 'r-titre');   // « Ville Cruelle » écrit « Ville cruelle »
  const noms = Object.keys(classe).sort((x, y) => y.length - x.length);
  const L = '[A-Za-zÀ-ÖØ-öø-ÿ0-9]';
  const motif = (titres ? '«\\s?([^«»<>]{2,60}?)\\s?»|' : '')
    + '(?<!' + L + ')(' + noms.map(reEsc).join('|') + ')(?!' + L + ')';
  // Sensible à la casse : « balafon » (l'instrument) n'est pas « Balafon » (le recueil).
  return html.replace(new RegExp(motif, 'g'), (m, g1, g2) => {
    // Sans le groupe des titres, le nom est le PREMIER groupe capturé.
    const cite = titres ? g1 : undefined, nom = titres ? g2 : g1;
    if (cite !== undefined) {
      const c = cite.trim();
      const brut = c.replace(/&#x27;/g, '\'');
      if (PAROLES.has(brut)) return m;
      if (SURNOMS.has(brut)) return '« <span class="r-perso">' + c + '</span> »';
      const ok = /^[A-ZÀ-ÖØ-Þ]/.test(c) && c.split(/\s+/).length <= 6 && !/[.!?…,;:]$/.test(c);
      return ok ? '« <cite class="r-titre">' + c + '</cite> »' : m;
    }
    return '<span class="' + classe[nom] + '">' + nom + '</span>';
  });
}

/* Le haut de la page (résumé, thèmes) avait été écrit une fois pour toutes :
   il suit désormais la fiche, comme le reste. Les pictogrammes manquants
   rejoignent le sprite de la page. */
function haut(page, o, cle) {
  const f = o.fiche || {};
  const titre = '(?:' + LIB.resume.map(t => t.replace(/[.*+?^${}()|[\]\\&’]/g, '.')).join('|') + '|Résumé &amp; présentation)';
  const reR = new RegExp('(<h2>' + '<svg class="vi"[^>]*><use href="#lc-bookopen"></use></svg> )' + titre + '</h2>\\s*<p(?: class="r-resume")?>[\\s\\S]*?</p>');
  if (f.resume && reR.test(page)) page = page.replace(reR, (_, d) => d + esc(lib(o, 'resume')) + '</h2>\n<p class="r-resume">' + valoriser(esc(net(f.resume)), o, cle, true) + '</p>');
  const titreT = '(?:' + LIB.themes.map(t => t.replace(/[.*+?^${}()|[\]\\&’]/g, '.')).join('|') + ')';
  const reT = new RegExp('(<h2><svg class="vi"[^>]*><use href="#lc-target"></use></svg> )' + titreT + '</h2><ul>[\\s\\S]*?</ul>');
  if ((f.themes || []).length && reT.test(page)) page = page.replace(reT, (_, d) => d + esc(lib(o, 'themes')) + '</h2><ul>' + f.themes.map(t => '<li>' + esc(t) + '</li>').join('') + '</ul>');
  Object.keys(SYMBOLES).forEach(id => {
    if (page.includes('id="' + id + '"')) return;
    const i = page.indexOf('</symbol></svg>');
    if (i >= 0) page = page.slice(0, i + 9) + SYMBOLES[id] + page.slice(i + 9);
  });
  return page;
}

/* Ordre de lecture des œuvres (6e → Tle) pour « œuvre précédente / suivante ». */
const RANG = ['6e', '5e', '4e', '3e', '2nde', '1ere', 'tle'];
const CLE = {};
fs.readdirSync(DOSSIER).filter(n => n.endsWith('.html') && n !== 'index.html').forEach(n => {
  const m = fs.readFileSync(path.join(DOSSIER, n), 'utf8').match(/#oeuvre\?k=([a-z0-9_]+)/);
  if (m && OEUVRES[m[1]]) CLE[n] = m[1];
});
const ORDRE = Object.keys(CLE).sort((a, b) => (RANG.indexOf(a.split('-')[0]) - RANG.indexOf(b.split('-')[0])) || a.localeCompare(b));

/* En-tête (17/11/2026, « aligne sur les pages de cours ») : carte comme l'en-tête des leçons,
   couverture en médaille. Un <header> autour du titre empêche vitrine.js d'en faire le bandeau bleu. */
const PIC = { horloge: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>', livre: '<path d="M2 5h6a3 3 0 0 1 3 3v12a2 2 0 0 0-2-2H2zM22 5h-6a3 3 0 0 0-3 3v12a2 2 0 0 1 2-2h7z"/>', carte: '<circle cx="12" cy="12" r="3"/><path d="M12 3v6M12 15v6M3 12h6M15 12h6"/>', quiz: '<circle cx="12" cy="12" r="9"/><path d="M9.5 9a2.5 2.5 0 1 1 3.5 2.3c-.6.3-1 .9-1 1.6v.6M12 17h.01"/>', examen: '<path d="M22 10 12 5 2 10l10 5 10-5z"/><path d="M6 12v5c3 2 9 2 12 0v-5"/>' };
const pic = k => '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + PIC[k] + '</svg>';
function entete(page, o) {
  const re = /<!-- oeuvre-ent -->[\s\S]*?<!-- \/oeuvre-ent -->|<span class="badge">[^<]*<\/span>\s*<h1>[\s\S]*?<\/h1>\s*<div class="auteur">[\s\S]*?<\/div>\s*<img [^>]*class="cover"[^>]*>/;
  const m = page.match(re); if (!m) return page;
  const z = m[0];
  const badge = (z.match(/<span class="badge">([^<]*)<\/span>/) || [])[1] || '';
  const h1 = (z.match(/<h1>([\s\S]*?)<\/h1>/) || [])[1] || esc(o.titre);
  const aut = (z.match(/<div class="auteur">([\s\S]*?)<\/div>/) || [])[1] || '';
  const img = (z.match(/<img [^>]*class="cover"[^>]*>/) || [])[0] || '';
  const f = o.fiche || {}, ex = examen(o.classe);
  const mots = (JSON.stringify(f) + JSON.stringify(o.analyse || {}) + JSON.stringify(o.citations || []) + JSON.stringify(o.techniques || []) + JSON.stringify(o.controle || [])).split(/\s+/).length;
  const puces = ['<span>' + pic('horloge') + Math.max(5, Math.round(mots / 180)) + ' min de lecture</span>'];
  if (f.genre) puces.push('<span>' + pic('livre') + esc(net(f.genre)) + '</span>');
  if (ex) puces.push('<span>' + pic('examen') + 'Au programme du ' + ex + '</span>');
  if (((o.carte || {}).branches || []).length) puces.push('<a href="#carte">' + pic('carte') + 'Carte mentale</a>');
  if ((o.qcm || []).length) puces.push('<a href="#quiz">' + pic('quiz') + 'Quiz de ' + o.qcm.length + ' questions</a>');
  const h = '<!-- oeuvre-ent -->\n<header class="oe-ent"><div class="oe-ent-haut"><div class="oe-couv">' + img + '</div><div class="oe-tags"><span class="badge">' + badge + '</span>'
    + '<span class="oe-mat"><b>Français</b> · Œuvre intégrale · ' + esc(o.classe || '') + '</span></div></div>\n<h1>' + h1 + '</h1>\n<div class="auteur">' + aut + '</div>\n'
    + '<div class="oe-puces">' + puces.join('') + '</div></header>\n<!-- /oeuvre-ent -->';
  return page.replace(re, () => h);
}

let changees = 0, vues = 0;
const manquantes = [];
for (const nom of fs.readdirSync(DOSSIER).filter(n => n.endsWith('.html') && n !== 'index.html')) {
  const chemin = path.join(DOSSIER, nom);
  const page = fs.readFileSync(chemin, 'utf8');
  const m = page.match(/#oeuvre\?k=([a-z0-9_]+)/);
  const o = m && OEUVRES[m[1]];
  if (!o) { manquantes.push(nom); continue; }
  vues++;
  const url = BASE + 'oeuvres/' + nom;
  let neuf = remplacer(page, '<!-- oeuvre-statique -->', '<!-- /oeuvre-statique -->', bloc(o, m[1], nom), '<a class="cta"');
  if (neuf) neuf = remplacer(neuf, '<!-- oeuvre-ld -->', '<!-- /oeuvre-ld -->', ld(o, url), '</head>');
  if (neuf) neuf = remplacer(neuf, '<!-- oeuvre-style -->', '<!-- /oeuvre-style -->', STYLE, '</head>');
  if (neuf) neuf = haut(neuf, o, m[1]);
  if (neuf) neuf = entete(neuf, o);
  if (!neuf) { manquantes.push(nom + ' (gabarit)'); continue; }
  if (neuf !== page) {
    changees++;
    if (!CONTROLE) fs.writeFileSync(chemin, neuf);
  }
}

if (manquantes.length) {
  console.error('oeuvres_statiques : pages sans analyse rattachée :', manquantes.join(', '));
  process.exit(1);
}
if (CONTROLE) {
  if (changees) { console.error('oeuvres_statiques : ' + changees + ' page(s) périmée(s) — lancer node tools/oeuvres_statiques.js'); process.exit(1); }
  console.log('oeuvres_statiques : ' + vues + ' pages à jour');
} else {
  console.log('oeuvres_statiques : ' + vues + ' pages, ' + changees + ' écrite(s)');
}
