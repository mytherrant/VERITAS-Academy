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
const net = s => String(s == null ? '' : s).replace(/\s+/g, ' ').trim();

// Même icône que les h2 existants de la page : le sprite #lc-* est déjà là.
const ico = id => '<svg class="vi" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" '
  + 'stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><use href="#lc-' + id + '"></use></svg>';
const h2 = (id, icone, titre) => '<h2 id="' + id + '">' + ico(icone) + ' ' + esc(titre) + '</h2>';

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
    const lignes = bloc.split('\n').map(l => l.trim()).filter(Boolean);
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
    out.push(h2('axes', 'target', 'Axes de lecture'));
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

  if ((o.citations || []).length) {
    out.push(h2('citations', 'pencil', 'Citations expliquées'));
    o.citations.forEach(c => {
      out.push('<figure class="cit"><blockquote>« ' + esc(net(c.texte)) + ' »</blockquote>'
        + (c.source ? '<figcaption>' + esc(c.source) + '</figcaption>' : '') + '</figure>');
      if ((c.figures || []).length) out.push('<p><strong>Procédés :</strong> ' + esc(c.figures.join(' ; ')) + '.</p>');
      if (c.analyse) out.push('<p>' + esc(c.analyse) + '</p>');
      if (c.effet) out.push('<p><strong>Effet sur le lecteur :</strong> ' + esc(c.effet) + '</p>');
    });
  }

  if ((o.techniques || []).length) {
    out.push(h2('procedes', 'pencil', 'Procédés d’écriture à connaître'));
    o.techniques.forEach(t => {
      out.push('<h3>' + esc(t.nom) + '</h3>');
      if (t.def) out.push('<p>' + esc(t.def) + '</p>');
      if (t.exemple) out.push('<p><strong>Exemple :</strong> « ' + esc(net(t.exemple)) + ' »</p>');
      if (t.effet) out.push('<p><strong>Effet :</strong> ' + esc(t.effet) + '</p>');
    });
  }

  if ((o.controle || []).length) {
    out.push(h2('questions', 'graduation', 'Questions de compréhension corrigées'));
    o.controle.forEach(q => {
      out.push('<h3>' + esc(q.q) + '</h3><p>' + esc(q.r) + '</p>');
    });
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
