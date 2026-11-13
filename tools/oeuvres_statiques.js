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
const STYLE = '<!-- oeuvre-style -->\n<style>'
  + 'body:has(#vrtNav) .wrap article h2{font-size:24px!important;font-weight:700!important;line-height:1.3!important}'
  + 'body:has(#vrtNav) .wrap article h2>svg.vi{width:46px!important;height:46px!important;padding:10px!important;border-width:2.5px!important}'
  + 'body:has(#vrtNav) .wrap article h3{font-size:20px!important;font-weight:700!important;color:#1E499B!important;margin:28px 0 8px!important;display:flex;align-items:baseline;gap:10px;text-align:left!important}'
  + 'body:has(#vrtNav) .wrap article h3::before{content:"";flex:0 0 10px;height:10px;border-radius:50%;background:#FFC93C;transform:translateY(-2px)}'
  + 'body:has(#vrtNav) .wrap article p,body:has(#vrtNav) .wrap article li{font-size:18px!important;line-height:1.75!important}'
  + '@media (max-width:600px){body:has(#vrtNav) .wrap article p{text-align:left!important}body:has(#vrtNav) .wrap article h2{font-size:22px!important}body:has(#vrtNav) .wrap article h2>svg.vi{width:42px!important;height:42px!important;padding:9px!important}body:has(#vrtNav) .wrap article h3{font-size:19px!important}}'
  + '.lecons{display:grid;gap:12px;margin:8px 0 6px}'
  + '.lecon{background:#FFF8E5;border-radius:14px;padding:14px 16px}'
  + '.lecon strong{display:block;font-size:18.5px;color:#001136;margin-bottom:4px}'
  + 'body:has(#vrtNav) .wrap article .lecon p{margin:0;text-align:left!important;font-size:17px!important}'
  + '.envie{background:#EEF3FC;border-radius:16px;padding:18px 18px 8px;margin:10px 0 4px}'
  + 'body:has(#vrtNav) .wrap article .envie p{text-align:left!important}'
  + '.envie .defi{background:#fff;border-radius:12px;padding:12px 14px}'
  + ':root[data-vrt-theme="sombre"] .lecon,:root[data-vrt-theme="sombre"] .envie,:root[data-vrt-theme="sombre"] .envie .defi{background:#132241}'
  + ':root[data-vrt-theme="sombre"] .lecon strong{color:#F2F5FC}'
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

function bloc(o) {
  const f = o.fiche || {};
  const out = ['<!-- oeuvre-statique -->', '<section class="oeuvre-statique" aria-label="Analyse de l’œuvre" style="text-align:left">'];

  const identite = [['Genre', f.genre], ['Forme', f.forme], ['Édition', f.edition], ['Époque', f.epoque],
    ['Mouvement', f.mouvement], ['Lieu', f.lieu]].filter(x => x[1]);
  if (identite.length) {
    out.push(h2('fiche', 'graduation', 'Fiche d’identité'));
    out.push('<ul>' + identite.map(x => '<li><strong>' + esc(x[0]) + ' :</strong> ' + esc(x[1]) + '</li>').join('') + '</ul>');
  }

  if ((f.axes || []).length) {
    out.push(h2('axes', 'target', lib(o, 'axes')));
    out.push('<ol>' + f.axes.map(a => '<li>' + esc(a) + '</li>').join('') + '</ol>');
  }

  const branches = ((o.carte || {}).branches || []).filter(b => !/^axes/i.test(b.label || ''));
  branches.forEach(b => {
    if (!(b.items || []).length) return;
    out.push('<h3>' + esc(b.label) + '</h3>');
    out.push('<ul>' + b.items.map(i => '<li>' + esc(i) + '</li>').join('') + '</ul>');
  });

  const an = o.analyse || {};
  if (an.contenu) {
    out.push(h2('analyse', 'bookopen', an.angle ? 'L’analyse : ' + net(an.angle) : 'L’analyse VÉRITAS'));
    out.push(analyseHtml(an.contenu));
  }

  if ((o.morales || []).length) {
    out.push(h2('lecons', 'heart', 'Les leçons de vie'));
    out.push('<div class="lecons">' + o.morales.map(m => '<div class="lecon"><strong>' + esc(m.t) + '</strong><p>' + esc(m.d) + '</p></div>').join('') + '</div>');
  }

  if ((o.citations || []).length) {
    out.push(h2('citations', 'pencil', lib(o, 'citations')));
    o.citations.forEach(c => {
      out.push('<figure class="cit"><blockquote>« ' + esc(net(c.texte)) + ' »</blockquote>'
        + (c.source ? '<figcaption>' + esc(c.source) + '</figcaption>' : '') + '</figure>');
      if ((c.figures || []).length) out.push('<p><strong>' + lib(o, 'figures') + '</strong> ' + esc(c.figures.join(' ; ')) + '.</p>');
      if (c.analyse) out.push('<p>' + esc(c.analyse) + '</p>');
      if (c.effet) out.push('<p><strong>' + lib(o, 'effet') + '</strong> ' + esc(c.effet) + '</p>');
    });
  }

  if ((o.techniques || []).length) {
    out.push(h2('procedes', 'pencil', lib(o, 'procedes')));
    o.techniques.forEach(t => {
      out.push('<h3>' + esc(t.nom) + '</h3>');
      if (t.def) out.push('<p>' + esc(t.def) + '</p>');
      // Un exemple qui contient déjà ses guillemets (ou qui décrit au lieu de citer) n'en reçoit pas d'autres.
      if (t.exemple) { const ex = net(t.exemple); out.push('<p><strong>Exemple :</strong> ' + (/[«»]/.test(ex) ? esc(ex) : '« ' + esc(ex) + ' »') + '</p>'); }
      if (t.effet) out.push('<p><strong>Effet :</strong> ' + esc(t.effet) + '</p>');
    });
  }

  if ((o.controle || []).length) {
    out.push(h2('questions', 'graduation', lib(o, 'questions')));
    o.controle.forEach(q => {
      out.push('<h3>' + esc(q.q) + '</h3><p>' + esc(q.r) + '</p>');
    });
  }

  const ev = o.envie;
  if (ev && ev.accroche) {
    out.push(h2('envie', 'compass', 'Envie de lire la suite ?'));
    out.push('<div class="envie"><p>' + esc(ev.accroche) + '</p>'
      + ((ev.questions || []).length ? '<p><strong>Les questions que tu vas te poser :</strong></p><ul>' + ev.questions.map(q => '<li>' + esc(q) + '</li>').join('') + '</ul>' : '')
      + (ev.defi ? '<p class="defi">' + esc(ev.defi) + '</p>' : '') + '</div>');
  }

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

/* Le haut de la page (résumé, thèmes) avait été écrit une fois pour toutes :
   il suit désormais la fiche, comme le reste. Les pictogrammes manquants
   rejoignent le sprite de la page. */
function haut(page, o) {
  const f = o.fiche || {};
  const titre = '(?:' + LIB.resume.map(t => t.replace(/[.*+?^${}()|[\]\\&’]/g, '.')).join('|') + '|Résumé &amp; présentation)';
  const reR = new RegExp('(<h2>' + '<svg class="vi"[^>]*><use href="#lc-bookopen"></use></svg> )' + titre + '</h2>\\s*<p>[\\s\\S]*?</p>');
  if (f.resume && reR.test(page)) page = page.replace(reR, (_, d) => d + esc(lib(o, 'resume')) + '</h2>\n<p>' + esc(net(f.resume)) + '</p>');
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
  let neuf = remplacer(page, '<!-- oeuvre-statique -->', '<!-- /oeuvre-statique -->', bloc(o), '<a class="cta"');
  if (neuf) neuf = remplacer(neuf, '<!-- oeuvre-ld -->', '<!-- /oeuvre-ld -->', ld(o, url), '</head>');
  if (neuf) neuf = remplacer(neuf, '<!-- oeuvre-style -->', '<!-- /oeuvre-style -->', STYLE, '</head>');
  if (neuf) neuf = haut(neuf, o);
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
