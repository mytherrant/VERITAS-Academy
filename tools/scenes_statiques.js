/* Scènes vivantes lisibles par les moteurs et les IA — scenes/*.html
 *
 * POURQUOI (06/11/2026, visibilité IA et moteurs)
 * Une scène est une page de 12 Ko dont tout le contenu vit dans
 * window.SCENE et n'apparaît qu'après JavaScript. Un robot (ChatGPT,
 * Perplexity, Claude, Googlebot au premier passage) n'y lisait que le titre et
 * « Cette scène a besoin de JavaScript ». Les 101 scènes n'étaient en outre
 * dans AUCUN sitemap ni dans llms.txt.
 *
 * CE QUE FAIT LE SCRIPT (idempotent)
 *   · avant </head> : <!-- scene-tete --> … <!-- /scene-tete --> : adresse
 *     canonique, aperçu de partage (Open Graph), JSON-LD LearningResource ;
 *   · avant </body>, APRÈS les scripts : <!-- scene-texte --> … : la scène
 *     en texte (récit, répliques, extraits marqués, remarques, questions avec
 *     la bonne réponse, ateliers, quiz, à retenir) dans un <details> replié.
 *     scene.js remplace le contenu de <body> pendant son exécution ; le
 *     parseur n'a pas encore lu ce bloc à ce moment-là, il l'ajoute donc
 *     ENSUITE, sous la scène. Aucun changement du moteur (ni de ?v=) requis ;
 *   · scenes/sitemap-scenes.xml (accueil des scènes + chaque scène).
 * Source unique : window.SCENE de chaque page. Une scène corrigée se
 * répercute au prochain passage (--controle en CI).
 *
 *    node tools/scenes_statiques.js            # écrit
 *    node tools/scenes_statiques.js --controle # code 1 si un fichier changerait
 */
'use strict';
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const RACINE = path.join(__dirname, '..');
const DOSSIER = path.join(RACINE, 'scenes');
const BASE = 'https://veritas-school.com/';
const IMAGE = BASE + 'og-image.jpg';
const CONTROLE = process.argv.includes('--controle');

const esc = s => String(s == null ? '' : s)
  .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const net = s => String(s == null ? '' : s).replace(/\s+/g, ' ').trim();
const jsonLd = o => JSON.stringify(o).replace(/</g, '\\u003c');

// Les avertissements du moteur, relus dans scene.js pour ne jamais diverger.
const MOTEUR = fs.readFileSync(path.join(DOSSIER, 'scene.js'), 'utf8');
function constante(nom) {
  const m = MOTEUR.match(new RegExp('var ' + nom + " = ('(?:[^'\\\\]|\\\\.)*'(?:\\s*\\+\\s*'(?:[^'\\\\]|\\\\.)*')*)"));
  if (!m) throw new Error('scenes_statiques : ' + nom + ' introuvable dans scene.js');
  return vm.runInNewContext(m[1]);
}
const AVERT_OEUVRE = constante('AVERT_OEUVRE');
const AVERT_LIBRE = constante('AVERT_LIBRE');

const NIVEAUX = { '6e': '6ᵉ', '5e': '5ᵉ', '4e': '4ᵉ', '3e': '3ᵉ', '2nde': 'Seconde', '1re': 'Première', 'Tle': 'Terminale' };
const niveau = n => NIVEAUX[n] || n || '';

function lireScene(page) {
  const m = page.match(/<script>\s*(window\.SCENE\s*=[\s\S]*?)<\/script>/);
  if (!m) return null;
  const ctx = { window: {} };
  vm.runInNewContext(m[1], ctx);
  return ctx.window.SCENE || null;
}

function texteBloc(S, fichier) {
  const persos = S.personnages || {};
  const nom = k => (persos[k] && persos[k].nom) || k || '';
  const o = [];
  const p = (h) => o.push(h);
  const trad = e => (e.pron ? ' <i>(' + esc(e.pron) + ')</i>' : '') + (e.trad ? ' — <i>' + esc(e.trad) + '</i>' : '');

  p('<!-- scene-texte -->');
  p('<details id="scene-texte" style="max-width:860px;margin:28px auto 40px;padding:0 16px;font:15px/1.6 Poppins,system-ui,sans-serif;color:#0C2A6A">');
  p('<summary style="cursor:pointer;font-weight:600;padding:12px 0">Lire la scène en texte</summary>');
  p('<article lang="' + esc(S.langueRecit || 'fr') + '">');
  p('<h2>' + esc(S.titre) + '</h2>');
  const sur = [S.discipline, niveau(S.niveau), S.oeuvre ? S.oeuvre + (S.auteur ? ' · ' + S.auteur : '') : ''].filter(Boolean).join(' · ');
  p('<p><b>' + esc(sur) + '</b></p>');
  p('<p><i>' + esc(S.avertissement || (S.oeuvre ? AVERT_OEUVRE : AVERT_LIBRE)) + '</i></p>');
  if (S.objectif) p('<h3>Objectif</h3><p>' + esc(S.objectif) + '</p>');
  if (S.programme) p('<p>Programme : ' + esc(S.programme) + '</p>');
  if (S.lieu || S.moment) p('<p>Lieu : ' + esc([S.lieu, S.moment].filter(Boolean).join(' · ')) + '</p>');
  const ks = Object.keys(persos);
  if (ks.length) p('<h3>Personnages</h3><ul>' + ks.map(k => '<li>' + esc(nom(k)) + '</li>').join('') + '</ul>');
  if (S.fiche) {
    const f = S.fiche;
    p('<h3>L’œuvre</h3>');
    if (f.accroche) p('<p>' + esc(f.accroche) + '</p>');
    if (f.resume) p('<p>' + esc(f.resume) + '</p>');
    if ((f.personnages || []).length) p('<ul>' + f.personnages.map(x => '<li><b>' + esc(x.nom) + '</b>' + (x.role ? ' — ' + esc(x.role) : '') + '</li>').join('') + '</ul>');
    if ((f.themes || []).length) p('<p>Thèmes : ' + esc(f.themes.join(', ')) + '</p>');
  }

  p('<h3>La scène</h3>');
  (S.etapes || []).forEach(e => {
    const cite = e.cite ? '<br><small>Extrait de l’œuvre — ' + esc(e.cite) + '</small>' : '';
    if (e.t === 'recit') {
      p(e.cite ? '<blockquote><p>' + esc(e.txt) + trad(e) + cite + '</p></blockquote>' : '<p>' + esc(e.txt) + trad(e) + '</p>');
    } else if (e.t === 'dit' || e.t === 'pense' || e.t === 'vers') {
      const qui = '<b>' + esc(nom(e.qui)) + '</b>' + (e.t === 'pense' ? ' (en pensée)' : '') + (e.jeu ? ' <i>(' + esc(e.jeu) + ')</i>' : '');
      const txt = e.t === 'vers' ? esc(e.txt).replace(/\n/g, '<br>') : esc(e.txt);
      p(e.cite || e.t === 'vers'
        ? '<blockquote><p>' + qui + ' :<br>' + txt + trad(e) + cite + '</p></blockquote>'
        : '<p>' + qui + ' : ' + txt + trad(e) + '</p>');
    } else if (e.t === 'remarque') {
      p('<h4>' + esc(e.titre || 'Ce que la scène montre') + '</h4><p>' + esc(e.txt) + '</p>');
    } else if (e.t === 'question') {
      const bonne = (e.options || []).find(x => x.ok);
      p('<p><b>Question :</b> ' + esc(e.q) + '</p><ul>' + (e.options || []).map(x => '<li>' + esc(x.txt) + (x.ok ? ' <b>(bonne réponse)</b>' : '') + '</li>').join('') + '</ul>'
        + (bonne && bonne.retour ? '<p>' + esc(bonne.retour) + '</p>' : ''));
    } else if (e.t === 'choix') {
      p('<p><b>À toi de décider :</b> ' + esc(e.q) + '</p><ul>' + (e.options || []).map(x => '<li>' + esc(x.txt) + (x.consequence ? ' — ' + esc(x.consequence) : '') + '</li>').join('') + '</ul>');
    } else if (e.t === 'atelier') {
      p('<h4>' + esc(e.titre || 'Atelier') + '</h4>' + (e.consigne ? '<p>' + esc(e.consigne) + '</p>' : ''));
      if ((e.cats || []).length && (e.items || []).length) {
        p('<ul>' + e.cats.map((c, i) => '<li><b>' + esc(c) + '</b> : ' + esc(e.items.filter(x => x.cat === i).map(x => net(x.txt)).join(' ; ')) + '</li>').join('') + '</ul>');
      } else if ((e.items || []).length) {
        p('<ol>' + e.items.map(x => '<li>' + esc(typeof x === 'string' ? x : (x.txt || x.lib || '')) + '</li>').join('') + '</ol>');
      }
      if (e.bravo) p('<p>' + esc(e.bravo) + '</p>');
    }
  });

  if ((S.quiz || []).length) {
    p('<h3>Quiz</h3><ol>' + S.quiz.map(q => {
      const b = (q.options || []).find(x => x.ok);
      return '<li>' + esc(q.q) + (b ? ' — <b>' + esc(b.txt) + '</b>' + (b.retour ? ' ' + esc(b.retour) : '') : '') + '</li>';
    }).join('') + '</ol>');
  }
  const B = S.bilan || {};
  if ((B.retenir || []).length) p('<h3>À retenir</h3><ul>' + B.retenir.map(x => '<li>' + esc(x) + '</li>').join('') + '</ul>');
  if (B.ecrire) p('<h3>À écrire</h3><p>' + esc(B.ecrire) + '</p>');
  p('<p><a href="index.html">Toutes les Scènes vivantes</a> · <a href="' + esc(fichier) + '">Jouer la scène</a></p>');
  p('</article>', '</details>');
  p('<!-- /scene-texte -->');
  return o.join('\n');
}

function teteBloc(S, url, description) {
  const ld = {
    '@context': 'https://schema.org',
    '@type': 'LearningResource',
    name: S.titre,
    description: description,
    url: url,
    inLanguage: S.langue || 'fr',
    learningResourceType: 'Simulation interactive',
    educationalLevel: niveau(S.niveau),
    about: S.discipline,
    teaches: net(S.objectif),
    isAccessibleForFree: true,
    interactivityType: 'active',
    provider: { '@type': 'EducationalOrganization', name: 'Centre VÉRITAS', url: BASE },
    isPartOf: { '@type': 'CollectionPage', name: 'Scènes vivantes', url: BASE + 'scenes/' }
  };
  if (S.oeuvre) ld.isBasedOn = { '@type': 'Book', name: S.oeuvre, author: S.auteur ? { '@type': 'Person', name: S.auteur } : undefined };
  const titre = S.titre + ' — Scènes vivantes | VÉRITAS';
  return [
    '<!-- scene-tete -->',
    '<link rel="canonical" href="' + esc(url) + '">',
    '<meta property="og:type" content="website">',
    '<meta property="og:title" content="' + esc(titre) + '">',
    '<meta property="og:description" content="' + esc(description) + '">',
    '<meta property="og:url" content="' + esc(url) + '">',
    '<meta property="og:image" content="' + IMAGE + '">',
    '<meta property="og:locale" content="fr_FR">',
    '<meta name="twitter:card" content="summary_large_image">',
    '<script type="application/ld+json">' + jsonLd(ld) + '</script>',
    '<!-- /scene-tete -->'
  ].join('\n');
}

function poser(page, debut, fin, bloc, avant) {
  const i = page.indexOf(debut), j = page.indexOf(fin);
  if (i >= 0 && j > i) return page.slice(0, i) + bloc + page.slice(j + fin.length);
  const k = page.lastIndexOf(avant);
  if (k < 0) return null;
  return page.slice(0, k) + bloc + '\n' + page.slice(k);
}

const ecrits = [], sm = [BASE + 'scenes/'];
let enEchec = 0;
const changer = (rel, neuf) => {
  const abs = path.join(RACINE, rel);
  const ancien = fs.existsSync(abs) ? fs.readFileSync(abs, 'utf8') : '';
  if (ancien.replace(/\r\n/g, '\n') === neuf.replace(/\r\n/g, '\n')) return;
  ecrits.push(rel);
  if (!CONTROLE) fs.writeFileSync(abs, neuf);
};

const fichiers = fs.readdirSync(DOSSIER).filter(f => f.endsWith('.html') && !f.startsWith('_') && f !== 'index.html').sort();
fichiers.forEach(f => {
  const page = fs.readFileSync(path.join(DOSSIER, f), 'utf8');
  const S = lireScene(page);
  if (!S) return; // personnages.html et autres pages sans scène
  const url = BASE + 'scenes/' + f;
  const dm = page.match(/<meta name="description" content="([^"]*)"/);
  const description = dm ? dm[1].replace(/&quot;/g, '"').replace(/&amp;/g, '&') : net(S.objectif);
  let neuf = poser(page, '<!-- scene-tete -->', '<!-- /scene-tete -->', teteBloc(S, url, description), '</head>');
  if (neuf) neuf = poser(neuf, '<!-- scene-texte -->', '<!-- /scene-texte -->', texteBloc(S, f), '</body>');
  if (!neuf) { console.error('scenes_statiques : ' + f + ' sans </head> ou </body>'); enEchec++; return; }
  changer('scenes/' + f, neuf);
  sm.push(url);
});

// Accueil des scènes : adresse canonique et aperçu de partage.
{
  const page = fs.readFileSync(path.join(DOSSIER, 'index.html'), 'utf8');
  const dm = page.match(/<meta name="description" content="([^"]*)"/);
  const d = dm ? dm[1] : '';
  const url = BASE + 'scenes/';
  const ld = { '@context': 'https://schema.org', '@type': 'CollectionPage', name: 'Scènes vivantes', url: url, description: d.replace(/&quot;/g, '"').replace(/&amp;/g, '&'), inLanguage: 'fr',
    isAccessibleForFree: true, provider: { '@type': 'EducationalOrganization', name: 'Centre VÉRITAS', url: BASE },
    mainEntity: { '@type': 'ItemList', numberOfItems: sm.length - 1, itemListElement: sm.slice(1).map((u, i) => ({ '@type': 'ListItem', position: i + 1, url: u })) } };
  const bloc = ['<!-- scene-tete -->', '<link rel="canonical" href="' + url + '">', '<meta property="og:type" content="website">',
    '<meta property="og:title" content="Scènes vivantes | VÉRITAS">', '<meta property="og:description" content="' + d + '">',
    '<meta property="og:url" content="' + url + '">', '<meta property="og:image" content="' + IMAGE + '">', '<meta property="og:locale" content="fr_FR">',
    '<meta name="twitter:card" content="summary_large_image">', '<script type="application/ld+json">' + jsonLd(ld) + '</script>', '<!-- /scene-tete -->'].join('\n');
  const neuf = poser(page, '<!-- scene-tete -->', '<!-- /scene-tete -->', bloc, '</head>');
  if (!neuf) { console.error('scenes_statiques : index.html sans </head>'); enEchec++; } else changer('scenes/index.html', neuf);
}

changer('scenes/sitemap-scenes.xml', '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'
  + sm.map((u, i) => '<url><loc>' + u + '</loc><changefreq>' + (i ? 'monthly' : 'weekly') + '</changefreq><priority>' + (i ? '0.6' : '0.8') + '</priority></url>').join('\n')
  + '\n</urlset>\n');

if (enEchec) process.exit(1);
if (CONTROLE) {
  if (ecrits.length) { console.log('scènes périmées (' + ecrits.length + ') : lancer node tools/scenes_statiques.js — ' + ecrits.slice(0, 5).join(', ')); process.exit(1); }
  console.log('scènes à jour (' + (sm.length - 1) + ' scènes)');
} else {
  console.log('scenes_statiques : ' + ecrits.length + ' fichier(s) écrit(s), ' + (sm.length - 1) + ' scènes au sitemap');
}
