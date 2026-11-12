/* Pages publiques de l'Atelier de Français, de l'examen blanc et des
 * laboratoires virtuels — decouvrir/*.html et decouvrir/labos/*.html
 *
 * POURQUOI (05/11/2026, visibilité moteurs et IA)
 * Ces trois produits n'existaient pour un robot que sous trois formes :
 *   · l'Atelier (/plateforme/) : un gabarit d'application, « Bonjour
 *     {{ me.first }} », 1 Mo de moustaches sans une phrase lisible ;
 *   · l'examen blanc : une ancre, app.html#simulateur, invisible ;
 *   · les 30 laboratoires virtuels : app.html#labos, invisibles.
 * Ni Google ni ChatGPT ne pouvaient donc répondre « VÉRITAS » à « structure
 * de l'épreuve de français au BAC », « examen blanc BEPC en ligne » ou « TP
 * virtuel loi d'Ohm ». Ces pages leur donnent un texte réel à lire et à citer.
 *
 * D'OÙ VIENT LE TEXTE — rien n'est inventé ici :
 *   · structures d'épreuves : plateforme/minesec.js (le référentiel qui pilote
 *     déjà le composeur et le contrôle de conformité de l'Atelier) ;
 *   · épreuves de l'examen blanc : chunks/elearning-seed.js, filtrées comme
 *     _simEpreuves() (cat1, cat4, cat6) ; durées comme _dureeEpreuve() ;
 *   · laboratoires : chunks/labo.js. Les labos gratuits sont publiés en
 *     entier (théorie, protocole, questions corrigées) ; les labos des plans
 *     payants ne montrent que leur présentation et leur théorie.
 * Le gabarit (barre, menu, pied, feuilles de style) est celui des pages
 * Découvrir existantes : on remplace la tête et la carte, rien d'autre.
 *
 *    node tools/pages_decouverte.js            # écrit
 *    node tools/pages_decouverte.js --controle # code 1 si une page changerait
 */
'use strict';
const fs = require('fs');
const path = require('path');

const RACINE = path.join(__dirname, '..');
const DEC = path.join(RACINE, 'decouvrir');
const GABARIT = path.join(DEC, 'ia-pedagogique-prof-ambassa.html');
const BASE = 'https://veritas-school.com/';
const CONTROLE = process.argv.includes('--controle');

global.window = {};
require(path.join(RACINE, 'chunks', 'labo.js'));
require(path.join(RACINE, 'chunks', 'elearning-seed.js'));
const LABOS = global.window.LABO_DB;
const SEED = global.window._VRT_ELEARNING_SEED;
const MINESEC = require(path.join(RACINE, 'plateforme', 'minesec.js'));

const esc = s => String(s == null ? '' : s)
  .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
  .replace(/"/g, '&quot;').replace(/'/g, '&#x27;');
const net = s => String(s == null ? '' : s).replace(/\s+/g, ' ').trim();
// Les données de l'application ouvrent leurs lignes par un pictogramme
// (« 1️⃣ MATÉRIEL », « ⚡ Loi d'Ohm ») : utile à l'écran, bruit pour un robot.
const sansPicto = s => String(s || '').replace(/^[\s\p{Extended_Pictographic}⃣️‍#*0-9]+(?=\p{L})/u, '').trim();
const slug = s => String(s).normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase()
  .replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 70);

const ORG = { '@type': 'EducationalOrganization', name: 'Centre VÉRITAS', url: BASE,
  address: { '@type': 'PostalAddress', addressLocality: 'Douala', addressCountry: 'CM' } };

// ── Gabarit ──────────────────────────────────────────────────────────────
const gab = fs.readFileSync(GABARIT, 'utf8');
const iWrap = gab.indexOf('<div class="wrap">');
const iFinWrap = gab.indexOf('\n</div>\n', gab.indexOf('<p class="rel">', iWrap));
if (iWrap < 0 || iFinWrap < 0) { console.error('pages_decouverte : gabarit Découvrir introuvable'); process.exit(1); }

function page({ chemin, titre, description, motsCles, ld, carte, rel }) {
  const url = BASE + chemin;
  let h = gab.slice(0, iWrap) + '<div class="wrap">' + carte + '\n' + (rel || '') + gab.slice(iFinWrap);
  const rempl = [
    [/<title>[\s\S]*?<\/title>/, '<title>' + esc(titre) + ' | VÉRITAS</title>'],
    [/<meta name="description" content="[^"]*">/, '<meta name="description" content="' + esc(description) + '">'],
    [/<meta name="keywords" content="[^"]*">/, '<meta name="keywords" content="' + esc(motsCles) + '">'],
    [/<link rel="canonical" href="[^"]*">/, '<link rel="canonical" href="' + url + '">'],
    [/<meta property="og:title" content="[^"]*">/, '<meta property="og:title" content="' + esc(titre) + '">'],
    [/<meta property="og:description" content="[^"]*">/, '<meta property="og:description" content="' + esc(description) + '">'],
    [/<meta property="og:url" content="[^"]*">/, '<meta property="og:url" content="' + url + '">'],
    [/<script type="application\/ld\+json">[\s\S]*?<\/script>/,
      '<script type="application/ld+json">' + JSON.stringify(Object.assign({ '@context': 'https://schema.org' }, ld))
        .replace(/</g, '\\u003c') + '</script>'],
  ];
  for (const [re, val] of rempl) {
    if (!re.test(h)) { console.error('pages_decouverte : balise absente du gabarit —', re); process.exit(1); }
    h = h.replace(re, () => val);
  }
  return h;
}

const h2 = t => '<h2>' + esc(t) + '</h2>';
const p = t => '<p>' + t + '</p>';
const cta = (href, texte, sous) => '<a class="cta" href="' + href + '">' + esc(texte)
  + (sous ? '<small>' + esc(sous) + '</small>' : '') + '</a>';
const faqLd = qs => ({ '@type': 'FAQPage', mainEntity: qs.map(([q, r]) => ({ '@type': 'Question', name: net(q),
  acceptedAnswer: { '@type': 'Answer', text: net(r) } })) });
const faqHtml = qs => qs.map(([q, r]) => '<h3>' + esc(q) + '</h3>' + p(esc(r))).join('\n');

// ═══ 1. ATELIER DE FRANÇAIS + STRUCTURES MINESEC ═══════════════════════════
function pageAtelier() {
  const E = MINESEC.epreuves;
  const examens = {};
  E.forEach(e => { (examens[e.examen] = examens[e.examen] || []).push(e); });
  const fiche = e => {
    const public_ = (e.series && e.series.length ? 'Séries ' + e.series.join(', ') : (e.classes || []).join(', '));
    const ts = e.texteSupport;
    let s = '<h3 id="' + esc(e.code.toLowerCase()) + '">' + esc(e.nom) + '</h3>';
    s += '<ul><li><strong>Public :</strong> ' + esc(public_ + ' — ' + e.cycle) + '</li>'
      + '<li><strong>Durée :</strong> ' + esc(e.duree) + (e.coeff && e.coeff !== '—' ? ' · <strong>coefficient</strong> ' + esc(e.coeff) : '') + '</li>'
      + (e.sujetsAuChoix > 1 ? '<li><strong>Sujets au choix :</strong> le candidat traite UN sujet sur ' + e.sujetsAuChoix + ' ; chaque sujet est noté sur 20.</li>' : '')
      + (ts ? '<li><strong>Texte support :</strong> ' + ts.min + ' à ' + ts.max + ' ' + esc(ts.unite) + (ts.nature ? ', ' + esc(ts.nature) : '') + (ts.note ? ' (' + esc(ts.note) + ')' : '') + '</li>' : '')
      + '</ul>';
    if ((e.parties || []).length) {
      s += '<ol>' + e.parties.map(pt => '<li><strong>' + esc(pt.titre) + (pt.points ? ' — ' + pt.points + ' points' : '') + '.</strong> '
        + esc(pt.consigne || '') + '</li>').join('') + '</ol>';
    }
    if ((e.interdits || []).length) s += p('<strong>À éviter :</strong> ' + esc(e.interdits.join(' ')));
    if (e.note) s += p('<em>' + esc(e.note) + '</em>');
    if (e.source) s += p('<small>Source : ' + esc(e.source) + (e.confiance === 'a_verifier' ? ' — à confirmer sur la circulaire de la session.' : '.') + '</small>');
    return s;
  };
  const sommaire = Object.keys(examens).map(x => '<li><a href="#' + slug(x) + '">' + esc(x) + '</a> — '
    + examens[x].length + ' épreuve' + (examens[x].length > 1 ? 's' : '') + '</li>').join('');
  const qs = [
    ['Qu’est-ce que l’Atelier de Français VÉRITAS ?', 'Un espace en ligne où les enseignants de français composent leurs épreuves et leurs cours conformes au programme MINESEC. L’IA Ambassa rédige l’épreuve complète (texte, questions, barème, corrigé) et l’enseignant la relit avant de l’exporter en Word.'],
    ['Combien de structures d’épreuves l’Atelier connaît-il ?', E.length + ' structures officielles : évaluations du premier cycle, BEPC, Probatoire et BAC des séries générales, enseignement technique (STT, SES, industriel, BP, BEP, CAP, CAPIET, ENIET).'],
    ['Que vérifie le contrôle de conformité ?', 'Que l’épreuve composée respecte la structure officielle : nombre de parties, barème qui totalise 20 points, longueur du texte support, sujets au choix, consignes interdites par le programme.'],
    ['Peut-on importer ses propres textes ?', 'Oui : Word (.docx), LibreOffice (.odt), PDF ou texte collé. Chaque fichier devient un texte du corpus, à côté du corpus MINESEC indexé par classe et par module.'],
    ['L’Atelier est-il réservé aux enseignants de Douala ?', 'Non. Il fonctionne en ligne pour tout enseignant de français du Cameroun, sur ordinateur comme sur téléphone, y compris en 3G.'],
  ];
  const carte = '<article class="card">\n<span class="badge">Enseignants · Programme MINESEC</span>\n'
    + '<h1>Atelier de Français : composer une épreuve conforme au MINESEC</h1>\n'
    + h2('Ce que fait l’Atelier')
    + p('L’<strong>Atelier de Français</strong> est l’espace de travail des enseignants de français sur VÉRITAS. On choisit la classe et l’examen ; l’<strong>IA Ambassa</strong> rédige l’épreuve complète — texte support, questions, barème, corrigé — en suivant le descriptif officiel ; l’enseignant relit, corrige et exporte en <strong>Word</strong>, prête à photocopier.')
    + '<ul><li><strong>' + E.length + ' structures d’épreuves officielles</strong>, du premier cycle au BAC et à l’enseignement technique</li>'
    + '<li><strong>Corpus de textes</strong> indexé par cycle, module, type de texte et longueur</li>'
    + '<li><strong>Contrôle de conformité</strong> : barème, parties, longueur du texte, consignes interdites</li>'
    + '<li><strong>Import</strong> de vos textes en Word, PDF ou texte collé</li>'
    + '<li><strong>Travail en équipe</strong> : un département compose, relit et valide ensemble</li>'
    + '<li><strong>Gabarits de leçon</strong> alignés sur les épreuves : ce qu’on enseigne est ce qui est noté</li></ul>\n'
    + cta('/plateforme/', 'Ouvrir l’Atelier de Français', 'Composer une épreuve de français conforme au programme MINESEC')
    + h2('Les ' + E.length + ' structures d’épreuves de français (MINESEC)')
    + p('Voici, épreuve par épreuve, ce que le référentiel de l’Atelier impose. C’est ce même référentiel qui guide Ambassa quand il compose et qui sert au contrôle de conformité.')
    + '<ul>' + sommaire + '</ul>\n'
    + Object.keys(examens).map(x => '<h2 id="' + slug(x) + '">' + esc(x) + '</h2>\n' + examens[x].map(fiche).join('\n')).join('\n')
    + h2('Questions fréquentes') + faqHtml(qs) + '\n'
    + cta('/plateforme/', 'Composer ma prochaine épreuve avec Ambassa', 'Essai gratuit, puis abonnement enseignant')
    + '\n</article>';
  return page({
    chemin: 'decouvrir/atelier-de-francais.html',
    titre: 'Atelier de Français : épreuves conformes MINESEC, structures BEPC, Probatoire, BAC',
    description: 'Composer une épreuve de français conforme au MINESEC : l’IA Ambassa rédige texte, questions, barème et corrigé. Les ' + E.length + ' structures officielles (BEPC, Probatoire, BAC, technique) : durée, coefficient, parties.',
    motsCles: 'épreuve de français MINESEC, structure épreuve BEPC français, structure épreuve BAC français, Probatoire français, composer une épreuve, enseignant de français Cameroun, Atelier de Français',
    ld: { '@graph': [
      { '@type': 'WebApplication', name: 'Atelier de Français — VÉRITAS', applicationCategory: 'EducationalApplication',
        operatingSystem: 'Web', url: BASE + 'plateforme/', inLanguage: 'fr', audience: { '@type': 'EducationalAudience', educationalRole: 'teacher' },
        description: 'Composeur d’épreuves de français conformes au programme MINESEC, avec IA, corpus et contrôle de conformité.', provider: ORG },
      Object.assign({ '@id': BASE + 'decouvrir/atelier-de-francais.html#faq' }, faqLd(qs)),
    ] },
    carte,
    rel: '<p class="rel"><a href="/decouvrir/">← Découvrir VÉRITAS</a> · <a href="/enseignant/">Espace enseignant</a> · <a href="/ressources/">Méthodes &amp; examens</a> · <a href="/decouvrir/examen-blanc-en-ligne.html">Examen blanc</a></p>',
  });
}

// ═══ 2. EXAMEN BLANC ═══════════════════════════════════════════════════════
function dureeMin(e) {
  if (+e.duree > 0) return +e.duree;
  return /\b(BAC|Baccalaur|Probatoire|GCE)\b/i.test(e.titre || '') ? 180 : 120;
}
function pageExamen() {
  const EP = SEED.filter(e => ['cat1', 'cat4', 'cat6'].includes(e.cat));
  const groupe = e => /BEPC/i.test(e.titre) ? 'BEPC' : /Probatoire/i.test(e.titre) ? 'Probatoire'
    : /\bBAC\b/i.test(e.titre) ? 'BAC' : e.cat === 'cat4' ? 'Corpus d’entraînement' : 'Épreuves de séquence';
  const ordre = ['BEPC', 'Probatoire', 'BAC', 'Épreuves de séquence', 'Corpus d’entraînement'];
  const G = {};
  EP.forEach(e => (G[groupe(e)] = G[groupe(e)] || []).push(e));
  const hm = m => Math.floor(m / 60) + ' h' + (m % 60 ? ' ' + (m % 60) : '');
  const liste = ordre.filter(g => G[g]).map(g => h2(g + ' — ' + G[g].length + ' sujet' + (G[g].length > 1 ? 's' : ''))
    + '<ul>' + G[g].map(e => '<li><strong>' + esc(sansPicto(e.titre)) + '</strong> — ' + esc(e.classe) + ', '
      + esc(e.matiere) + ' · ' + hm(dureeMin(e)) + (e.gratuit ? ' · <strong>gratuit</strong>' : '') + '</li>').join('') + '</ul>').join('\n');
  const qs = [
    ['Comment se passe un examen blanc sur VÉRITAS ?', 'L’élève choisit une épreuve de sa classe. Le sujet s’affiche avec un chronomètre réglé sur la durée de l’examen (2 heures, 3 heures pour le Probatoire, le BAC et le GCE) et un brouillon qui reste enregistré. Il compose sur papier comme le jour J.'],
    ['Quelles épreuves sont proposées ?', EP.length + ' sujets : BEPC, Probatoire, BAC (dont sujets officiels 2023 avec corrigé intégral) et épreuves de séquence de la 6ᵉ à la Terminale, en français, mathématiques, physique-chimie, SVT, histoire-géographie et anglais.'],
    ['L’examen blanc est-il gratuit ?', 'Une partie des sujets est gratuite (signalée dans la liste) ; les annales complètes s’ouvrent avec un abonnement, payable en MTN Mobile Money ou Orange Money.'],
    ['Faut-il installer une application ?', 'Non : tout fonctionne dans le navigateur, sur ordinateur ou téléphone.'],
  ];
  const carte = '<article class="card">\n<span class="badge">Élèves · BEPC · Probatoire · BAC</span>\n'
    + '<h1>Examen blanc en ligne : BEPC, Probatoire et BAC (Cameroun)</h1>\n'
    + h2('S’entraîner dans les conditions du jour J')
    + p('Le <strong>simulateur d’examen</strong> de VÉRITAS met l’élève face à un <strong>vrai sujet</strong>, avec un <strong>chronomètre</strong> réglé sur la durée officielle et un <strong>brouillon</strong> qui ne s’efface pas. À la fin du temps, il compare sa copie au corrigé et repère ce qui lui a coûté des points.')
    + '<ul><li><strong>' + EP.length + ' sujets</strong> de la 6ᵉ à la Terminale</li>'
    + '<li>Durée réelle : <strong>2 h</strong>, ou <strong>3 h</strong> pour le Probatoire, le BAC et le GCE</li>'
    + '<li>Choix de l’épreuve par <strong>classe</strong>, en commençant par la sienne</li>'
    + '<li>Corrigés harmonisés et <a href="/evaluations/">épreuves blanches en accès libre</a></li></ul>\n'
    + cta(BASE + 'app.html#simulateur', 'Lancer un examen blanc', 'Sujet officiel + chronomètre, sur téléphone ou ordinateur')
    + liste
    + h2('Questions fréquentes') + faqHtml(qs) + '\n'
    + p('Pour préparer l’épreuve de français, voir aussi les <a href="/ressources/bepc-francais.html">conseils BEPC</a>, <a href="/ressources/probatoire-francais.html">Probatoire</a> et <a href="/ressources/bac-francais.html">BAC</a>, et la <a href="/decouvrir/atelier-de-francais.html">structure officielle de chaque épreuve</a>.')
    + '\n</article>';
  return page({
    chemin: 'decouvrir/examen-blanc-en-ligne.html',
    titre: 'Examen blanc en ligne : BEPC, Probatoire, BAC — sujets et chronomètre',
    description: 'Simulateur d’examen VÉRITAS : ' + EP.length + ' sujets BEPC, Probatoire, BAC et épreuves de séquence (6ᵉ-Tˡᵉ), chronomètre à la durée officielle, brouillon et corrigés. Programme MINESEC.',
    motsCles: 'examen blanc en ligne, BEPC blanc, Probatoire blanc, BAC blanc Cameroun, simulateur examen, sujets BEPC corrigés, annales BAC Cameroun',
    ld: { '@graph': [
      { '@type': 'WebApplication', name: 'Simulateur d’examen VÉRITAS', applicationCategory: 'EducationalApplication', operatingSystem: 'Web',
        url: BASE + 'app.html#simulateur', inLanguage: 'fr', provider: ORG,
        description: 'Examens blancs chronométrés BEPC, Probatoire et BAC, programme MINESEC.' },
      { '@type': 'ItemList', name: 'Sujets de l’examen blanc', numberOfItems: EP.length,
        itemListElement: EP.map((e, i) => ({ '@type': 'ListItem', position: i + 1, name: sansPicto(e.titre) })) },
      faqLd(qs),
    ] },
    carte,
    rel: '<p class="rel"><a href="/decouvrir/">← Découvrir VÉRITAS</a> · <a href="/decouvrir/annales-epreuves-corrigees.html">Annales corrigées</a> · <a href="/evaluations/">Épreuves blanches</a> · <a href="/decouvrir/laboratoires-virtuels.html">Laboratoires virtuels</a></p>',
  });
}

// ═══ 3. LABORATOIRES VIRTUELS ══════════════════════════════════════════════
const labSlug = l => slug(l.titre);
function pageLabo(l) {
  const libre = l.gratuit === true;
  const theorie = String(l.theorie || '').split(/\n+/).map(x => sansPicto(x)).filter(Boolean).map(x => p(esc(x))).join('');
  const etapes = (l.experience || []).map(x => '<li>' + esc(sansPicto(x)) + '</li>').join('');
  const quiz = (l.quiz || []).filter(q => q.opts && q.opts[q.ans] != null);
  const qs = quiz.map(q => [q.q, 'Réponse : ' + q.opts[q.ans] + '. ' + (q.exp || '')]);
  let carte = '<article class="card">\n<span class="badge">Laboratoire virtuel · ' + esc(l.matiere) + ' · ' + esc(l.classe) + '</span>\n'
    + '<h1>' + esc(l.titre) + ' — TP virtuel (' + esc(l.classe) + ')</h1>\n'
    + p(esc(l.desc))
    + h2('Ce qu’il faut savoir') + theorie;
  if (libre && etapes) carte += h2('Le protocole, étape par étape') + '<ol>' + etapes + '</ol>';
  if (libre && qs.length) carte += h2('Testez-vous : questions corrigées') + faqHtml(qs);
  if (!libre) carte += p('<strong>Protocole complet et quiz corrigé</strong> : inclus dans les plans Pro, Élite et Famille.');
  carte += '\n' + cta(BASE + 'app.html#labos', 'Faire l’expérience en ligne', 'Laboratoire virtuel VÉRITAS — ' + l.matiere + ', programme MINESEC')
    + '\n</article>';
  const graphe = [{ '@type': 'LearningResource', name: l.titre, description: net(l.desc), learningResourceType: 'Laboratoire virtuel',
    educationalLevel: l.classe, about: l.matiere, inLanguage: /GCE/.test(l.titre) ? 'en' : 'fr', isAccessibleForFree: libre,
    url: BASE + 'decouvrir/labos/' + labSlug(l) + '.html', provider: ORG,
    educationalAlignment: { '@type': 'AlignmentObject', alignmentType: 'educationalSubject',
      educationalFramework: /GCE/.test(l.titre) ? 'GCE Board (Cameroon)' : 'Programme MINESEC (Cameroun)', targetName: l.matiere } }];
  if (libre && qs.length) graphe.push(faqLd(qs));
  return page({
    chemin: 'decouvrir/labos/' + labSlug(l) + '.html',
    titre: l.titre + ' — TP virtuel ' + l.matiere + ' (' + l.classe + ')',
    description: net(l.desc).slice(0, 150) + ' Laboratoire virtuel VÉRITAS, ' + l.classe + '.',
    motsCles: l.titre + ', TP virtuel ' + l.matiere + ', laboratoire virtuel Cameroun, ' + l.matiere + ' ' + l.classe + ', expérience en ligne',
    ld: { '@graph': graphe }, carte,
    rel: '<p class="rel"><a href="/decouvrir/laboratoires-virtuels.html">← Tous les laboratoires virtuels</a> · <a href="/decouvrir/examen-blanc-en-ligne.html">Examen blanc</a> · <a href="/decouvrir/">Découvrir VÉRITAS</a></p>',
  });
}
function pageLabos() {
  const M = {};
  LABOS.forEach(l => (M[l.matiere] = M[l.matiere] || []).push(l));
  const carte = '<article class="card">\n<span class="badge">Élèves · Sciences · Programme MINESEC et GCE</span>\n'
    + '<h1>Laboratoires virtuels : ' + LABOS.length + ' TP de physique, chimie, SVT et maths en ligne</h1>\n'
    + p('Beaucoup d’établissements n’ont pas de laboratoire équipé. Les <strong>laboratoires virtuels</strong> de VÉRITAS permettent de <strong>faire l’expérience</strong> à l’écran : on manipule, on mesure, on vérifie la loi, puis on se teste avec un quiz corrigé. Chaque TP reprend la théorie du programme et le protocole qu’on attend à l’examen.')
    + cta(BASE + 'app.html#labos', 'Ouvrir les laboratoires virtuels', LABOS.filter(l => l.gratuit).length + ' TP gratuits, les autres avec le plan Pro')
    + Object.keys(M).map(m => h2(m) + '<ul>' + M[m].map(l => '<li><a href="/decouvrir/labos/' + labSlug(l) + '.html"><strong>'
      + esc(l.titre) + '</strong></a> — ' + esc(l.classe) + (l.gratuit ? ' · gratuit' : '') + '. ' + esc(net(l.desc)) + '</li>').join('') + '</ul>').join('\n')
    + '\n</article>';
  return page({
    chemin: 'decouvrir/laboratoires-virtuels.html',
    titre: 'Laboratoires virtuels : ' + LABOS.length + ' TP en ligne (physique, chimie, SVT, maths)',
    description: LABOS.length + ' travaux pratiques virtuels conformes au programme camerounais : circuits électriques, acide-base, mitose, optique, probabilités, GCE… Théorie, protocole et quiz corrigé.',
    motsCles: 'laboratoire virtuel, TP virtuel physique, TP SVT en ligne, expérience chimie en ligne, laboratoire virtuel Cameroun, travaux pratiques MINESEC, GCE practical',
    ld: { '@graph': [{ '@type': 'CollectionPage', name: 'Laboratoires virtuels VÉRITAS', url: BASE + 'decouvrir/laboratoires-virtuels.html',
      provider: ORG, mainEntity: { '@type': 'ItemList', numberOfItems: LABOS.length,
        itemListElement: LABOS.map((l, i) => ({ '@type': 'ListItem', position: i + 1, name: l.titre,
          url: BASE + 'decouvrir/labos/' + labSlug(l) + '.html' })) } }] },
    carte,
    rel: '<p class="rel"><a href="/decouvrir/">← Découvrir VÉRITAS</a> · <a href="/decouvrir/examen-blanc-en-ligne.html">Examen blanc</a> · <a href="/decouvrir/jeux-educatifs-en-ligne.html">Jeux éducatifs</a></p>',
  });
}

// ── Écriture ─────────────────────────────────────────────────────────────
const sorties = [
  ['decouvrir/atelier-de-francais.html', pageAtelier()],
  ['decouvrir/examen-blanc-en-ligne.html', pageExamen()],
  ['decouvrir/laboratoires-virtuels.html', pageLabos()],
].concat(LABOS.map(l => ['decouvrir/labos/' + labSlug(l) + '.html', pageLabo(l)]));

const vus = new Set();
for (const [c] of sorties) { if (vus.has(c)) { console.error('pages_decouverte : deux pages à la même adresse —', c); process.exit(1); } vus.add(c); }

// Sitemap Découvrir : bloc balisé, le reste du fichier n'est pas touché.
const SM = path.join(DEC, 'sitemap-decouvrir.xml');
const sm = fs.readFileSync(SM, 'utf8');
const blocSm = '<!-- pages-decouverte -->\n' + sorties.map(([c]) => '<url><loc>' + BASE + c + '</loc><changefreq>monthly</changefreq><priority>'
  + (c.includes('/labos/') ? '0.6' : '0.8') + '</priority></url>').join('\n') + '\n<!-- /pages-decouverte -->';
const smNeuf = /<!-- pages-decouverte -->[\s\S]*?<!-- \/pages-decouverte -->/.test(sm)
  ? sm.replace(/<!-- pages-decouverte -->[\s\S]*?<!-- \/pages-decouverte -->/, () => blocSm)
  : sm.replace('</urlset>', blocSm + '\n</urlset>');
sorties.push(['decouvrir/sitemap-decouvrir.xml', smNeuf]);

let changees = [];
for (const [c, contenu] of sorties) {
  const abs = path.join(RACINE, c);
  const avant = fs.existsSync(abs) ? fs.readFileSync(abs, 'utf8') : null;
  if (avant === contenu) continue;
  changees.push(c);
  if (!CONTROLE) { fs.mkdirSync(path.dirname(abs), { recursive: true }); fs.writeFileSync(abs, contenu); }
}
// Une page de labo orpheline (labo retiré de labo.js) ne doit pas rester en ligne.
const dLab = path.join(DEC, 'labos');
if (fs.existsSync(dLab)) for (const n of fs.readdirSync(dLab)) {
  if (!vus.has('decouvrir/labos/' + n)) { changees.push('decouvrir/labos/' + n + ' (orpheline)'); if (!CONTROLE) fs.unlinkSync(path.join(dLab, n)); }
}
if (CONTROLE) {
  if (changees.length) { console.error('pages_decouverte : ' + changees.length + ' fichier(s) périmé(s) — lancer node tools/pages_decouverte.js\n  ' + changees.slice(0, 8).join('\n  ')); process.exit(1); }
  console.log('pages_decouverte : ' + sorties.length + ' fichiers à jour');
} else {
  console.log('pages_decouverte : ' + sorties.length + ' fichiers, ' + changees.length + ' écrit(s)');
}
