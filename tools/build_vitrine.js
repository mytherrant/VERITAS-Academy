/* Construit vitrine.html — page statique, sans React/Babel/support.js.
 *
 * Principe : on PRÉ-REND les sept écrans en HTML réel (donc indexables et
 * lisibles sans JS), et on n'embarque de JS que pour ce qui doit réellement
 * changer sous le doigt : navigation, onglets, thème, langue, tunnel de
 * paiement. Les fragments de gabarit des régions dynamiques partent dans des
 * <script type="text/x-vrt-tpl"> et sont ré-étendus par un moteur de ~70
 * lignes — pas un runtime de 3 Mo.
 */
const fs = require('fs');
const path = require('path');

const SRC = process.argv[2];
const OUT = process.argv[3];
const raw = fs.readFileSync(SRC, 'utf8');
const lines = raw.split(/\r?\n/);

const startIdx = lines.findIndex(l => l.startsWith('<div style="background:#fff"'));
const endIdx = lines.findIndex(l => l.trim() === '</x-dc>');
const template = lines.slice(startIdx, endIdx).join('\n');
const sprite = raw.match(/<svg width="0" height="0"[\s\S]*?<\/svg>/)[0];
const styleBlock = raw.match(/<style>([\s\S]*?)<\/style>/)[1];
const jsonld = raw.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/)[1];

// ── Composant ──────────────────────────────────────────────────────────────
const scriptStart = lines.findIndex(l => l.includes('data-dc-script'));
const scriptEnd = lines.length - 1 - [...lines].reverse().findIndex(l => l.trim() === '</script>');
const classSrc = lines.slice(scriptStart + 1, scriptEnd).join('\n');
const harness = `
class DCLogic {
  constructor(props){ this.props = props || {}; }
  setState(){}
}
${classSrc}
module.exports = Component;
`;
const tmp = path.join(__dirname, '_component.js');
fs.writeFileSync(tmp, harness);
delete require.cache[tmp];
const Component = require(tmp);

function valsFor(state) {
  const c = new Component({});
  c.state = Object.assign({}, c.state, state);
  return c.renderVals();
}

// ── Régions dynamiques : listes ré-étendues côté client ────────────────────
const LISTES_DYN = new Set([
  'onglets', 'services', 'filtres', 'moyensPaiement', 'champsPaiement',
  'optionsLivraison', 'lignesTotal', 'partages'
]);
// Scalaires réévalués côté client (position texte uniquement)
const SCALAIRES_DYN = new Set([
  'titreFormulaire', 'noteSecurite', 'libellePayer', 'totalPayer', 'quantite',
  'passage1', 'passage2', 'decryptage', 'texteBoutonCopie',
  'citationTexte', 'citationAuteur'
]);
const PAGES = ['accueil', 'tarifs', 'boutique', 'parents', 'elearning', 'enseignants', 'paiement'];
const FLAG2PAGE = {
  estAccueil: 'accueil', estTarifs: 'tarifs', estBoutique: 'boutique',
  estParents: 'parents', estElearning: 'elearning', estEnseignants: 'enseignants',
  estPaiement: 'paiement'
};

let hoverRules = [], hoverSeen = new Map();
function hoverClass(decls) {
  if (hoverSeen.has(decls)) return hoverSeen.get(decls);
  const cls = 'vh' + (hoverSeen.size + 1);
  hoverSeen.set(decls, cls);
  hoverRules.push('.' + cls + ':hover{' + decls + '}');
  return cls;
}
const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

function resolve(expr, scope) {
  expr = expr.trim();
  if (expr === 'true') return true;
  if (expr === 'false') return false;
  let v = scope;
  for (const p of expr.split('.')) { if (v == null) return undefined; v = v[p]; }
  return v;
}

function matchBlock(html, from, tag) {
  const open = new RegExp('<' + tag + '\\b', 'g'), close = new RegExp('</' + tag + '>', 'g');
  let depth = 1, pos = from;
  while (depth > 0) {
    open.lastIndex = pos; close.lastIndex = pos;
    const o = open.exec(html), c = close.exec(html);
    if (!c) throw new Error('balise ' + tag + ' non fermée');
    if (o && o.index < c.index) { depth++; pos = o.index + 1; }
    else { depth--; pos = c.index + 1; if (!depth) return { start: c.index, end: c.index + tag.length + 3 }; }
  }
}

const NAV_CLASSE = { navLarge: 'vrt-large', navCompacte: 'vrt-compact' };
const PANNEAUX = {
  plusOuvert: 'vrtPlus', burgerOuvert: 'vrtBurger',
  iaOuverte: 'vrtIA', traducteurOuvert: 'vrtTrad', citationVisible: 'vrtCit'
};

// Ajoute un attribut au premier tag d'un fragment
function marquer(frag, attr) {
  return frag.replace(/<([a-zA-Z][a-zA-Z0-9-]*)/, (m, t) => '<' + t + ' ' + attr);
}

// Ajoute une classe au premier tag, en préservant celles déjà présentes
function marquerClasse(frag, cls) {
  const t = frag.trim();
  const fin = t.indexOf('>');
  const tete = t.slice(0, fin);
  if (/\sclass="/.test(tete)) {
    return t.slice(0, fin).replace(/\sclass="([^"]*)"/, (m, c) => ' class="' + c + ' ' + cls + '"') + t.slice(fin);
  }
  return marquer(t, 'class="' + cls + '"');
}

const fragments = {};   // nom de liste → gabarit brut (pour le client)
let handlers = new Set();

function expand(html, scope, opts) {
  opts = opts || {};
  let out = '', i = 0;
  while (i < html.length) {
    const nIf = html.indexOf('<sc-if', i), nFor = html.indexOf('<sc-for', i);
    let next = -1, kind = null;
    if (nIf >= 0 && (nFor < 0 || nIf < nFor)) { next = nIf; kind = 'if'; }
    else if (nFor >= 0) { next = nFor; kind = 'for'; }
    if (next < 0) { out += interpolate(html.slice(i), scope, opts); break; }
    out += interpolate(html.slice(i, next), scope, opts);
    const tag = kind === 'if' ? 'sc-if' : 'sc-for';
    const openEnd = html.indexOf('>', next);
    const attrs = html.slice(next, openEnd);
    const blk = matchBlock(html, openEnd + 1, tag);
    const body = html.slice(openEnd + 1, blk.start);

    if (kind === 'if') {
      const m = attrs.match(/value="\{\{([^}]*)\}\}"/);
      const nom = m ? m[1].trim() : '';
      if (NAV_CLASSE[nom]) {
        // Barre large / barre compacte : les DEUX partent dans le document,
        // et c'est une media query qui tranche. Aucun JS n'est nécessaire
        // pour franchir le seuil de 1000 px — donc aucun clignotement.
        out += marquerClasse(expand(body, scope, opts), NAV_CLASSE[nom]);
      } else if (PANNEAUX[nom]) {
        // Panneaux repliés (menu « Plus », burger, tuteur, traducteur,
        // citation) : rendus une fois, masqués, ouverts par le script.
        const p = PANNEAUX[nom];
        out += marquer(expand(body, scope, opts).trim(), 'id="' + p + '" hidden');
      } else if (FLAG2PAGE[nom]) {
        // Écran : on rend TOUS les écrans, masqués sauf l'actif.
        const page = FLAG2PAGE[nom];
        const actif = page === (scope.__page || 'accueil');
        out += '<section data-vp="' + page + '"' + (actif ? '' : ' hidden') + '>'
             + expand(body, scope, opts) + '</section>';
      } else if (resolve(nom, scope)) {
        out += expand(body, scope, opts);
      }
    } else {
      const lm = attrs.match(/list="\{\{([^}]*)\}\}"/);
      const am = attrs.match(/as="([^"]*)"/);
      const nomListe = lm ? lm[1].trim() : '';
      const alias = am ? am[1] : 'it';
      const dyn = LISTES_DYN.has(nomListe);
      if (dyn && !fragments[nomListe]) fragments[nomListe] = { alias, body };
      const list = resolve(nomListe, scope) || [];
      (Array.isArray(list) ? list : []).forEach((item, idx) => {
        const s2 = Object.assign(Object.create(scope), { [alias]: item, [alias + 'Index']: idx });
        let frag = expand(body, s2, opts);
        if (dyn) frag = marquer(frag, 'data-vrt-item="' + nomListe + '"');
        out += frag;
      });
      if (dyn && (!Array.isArray(list) || !list.length)) {
        out += '<span data-vrt-anchor="' + nomListe + '" hidden></span>';
      }
    }
    i = blk.end;
  }
  return out;
}

function interpolate(chunk, scope, opts) {
  chunk = chunk.replace(/onClick="\{\{([^}]*)\}\}"/g, (m, e) => {
    const nom = e.trim(); handlers.add(nom);
    // Les entrées de menu portent leur destination DANS la fonction
    // (`() => this._go('parents')`). On la lit à la source plutôt que de
    // la redeviner côté client : une entrée ajoutée demain suivra toute seule.
    let extra = '';
    const fn = resolve(nom, scope);
    if (typeof fn === 'function') {
      const cible = /_go\(\s*'([a-z]+)'\s*\)/.exec(String(fn));
      if (cible) extra = ' data-go="' + cible[1] + '"';
    }
    return 'onclick="VRT.act(\'' + nom.replace(/\./g, '__') + '\',this,event)"' + extra;
  });
  chunk = chunk.replace(/\s*style-hover="([^"]*)"/g, (m, d) => ' data-vh="' + hoverClass(d) + '"');
  chunk = chunk.replace(/\s*hint-[a-z-]+="[^"]*"/g, '');
  chunk = chunk.replace(/\{\{([^}]*)\}\}/g, (m, e) => {
    const nom = e.trim();
    const v = resolve(nom, scope);
    if (typeof v === 'function') return '';
    const txt = v === undefined || v === null ? '' : esc(v);
    if (SCALAIRES_DYN.has(nom) && !opts.brut) return '<span data-vrt-val="' + nom + '">' + txt + '</span>';
    return txt;
  });
  return chunk;
}

function fusionnerHover(html) {
  return html.replace(/<([a-zA-Z][a-zA-Z0-9-]*)((?:[^>"]|"[^"]*")*?)\sdata-vh="([^"]+)"((?:[^>"]|"[^"]*")*?)>/g,
    (m, tag, a, cls, b) => {
      const reste = a + b;
      if (/\sclass="/.test(reste)) return '<' + tag + reste.replace(/\sclass="([^"]*)"/, (mm, c) => ' class="' + c + ' ' + cls + '"') + '>';
      return '<' + tag + a + ' class="' + cls + '"' + b + '>';
    });
}

// ── Rendu ──────────────────────────────────────────────────────────────────
const vals = valsFor({ page: 'accueil', compact: false });
vals.__page = 'accueil';

// ── CORRECTION 1 : taux de réussite réels ──────────────────────────────────
// Source unique : DB.statsVitrine (app.js, defaultDB). Le GCE n'y figure pas —
// on laisse donc son anneau vide plutôt que d'inventer un chiffre.
// L'angle de l'anneau DOIT suivre le taux : la maquette affichait 300° (83 %)
// derrière un « __ % ». Un anneau qui contredit son nombre est pire qu'un trou.
const TAUX_REELS = { 'BEPC': 100, 'Probatoire': 69, 'Baccalauréat': 61 };
let tauxManquants = [];
vals.reussites = vals.reussites.map(r => {
  const t = TAUX_REELS[r.examen];
  if (t === undefined) {
    tauxManquants.push(r.examen);
    // Anneau VIDÉ : la maquette le laissait rempli à 279° (77 %) sous un
    // « __ % ». Un cercle aux trois quarts plein affirme un résultat que
    // personne n'a mesuré — le trou doit se voir comme un trou.
    const creux = (r.anneau.match(/,(#[0-9A-Fa-f]{6}) \d+deg/) || [])[1] || '#E7EDF8';
    return Object.assign({}, r, { anneau: creux });
  }
  const deg = Math.round(t / 100 * 360);
  const creux = r.anneau.match(/,(#[0-9A-Fa-f]{6}) \d+deg/);
  return Object.assign({}, r, {
    taux: t + ' %',
    anneau: 'conic-gradient(' + r.teinte + ' 0deg ' + deg + 'deg,' + (creux ? creux[1] : '#E7EDF8') + ' ' + deg + 'deg 360deg)'
  });
});

let corps = expand(template, vals);
corps = fusionnerHover(corps);

// ── CORRECTION 2 : destinations réelles des liens ──────────────────────────
// Les CTA de la maquette pointaient tous vers des ancres provisoires. On les
// branche sur ce qui existe VRAIMENT : les hash reconnus par le routeur de
// l'application (app.js, _vtHashRouter) et les pages statiques du dépôt.
const APP = 'app.html';
const TEL = '+237697637739';
const ANCRES = {
  '#creer-compte': APP + '#contact',        // l'app place son « S'inscrire » dans contact
  '#compte': APP,
  '#connexion': APP,
  '#recherche': APP,
  '#contact': APP + '#contact',
  '#aide': APP + '#contact',
  /* ── Ce qui RESTE dans la vitrine ──────────────────────────────────────
     Ces quatre-là partaient vers app.html alors que la vitrine possède ses
     PROPRES écrans tarifs, elearning, boutique et parents. Le visiteur
     quittait donc une page claire en Poppins pour l'écran visiteur de
     l'application, d'une tout autre facture, en passant par un splash plein
     écran. C'était ça, la « double interface » — pas un problème de style
     mais de câblage : 25 liens sur 44 n'avaient aucune raison de sortir. */
  '#souscrire': '#tarifs',
  '#compte-parent': '#parents',
  '#matiere': '#elearning',
  '#detail': '#boutique',
  /* ── Ce qui sort LÉGITIMEMENT vers l'application ────────────────────────
     Aucun équivalent dans la vitrine : ces parcours vivent dans l'app. */
  '#partenariat': APP + '#partenariat',
  '#candidature': APP + '#partenariat',
  '#cagnotte': APP + '#cagnotte',
  '#corriges': 'corriges/',
  '#bareme': 'corriges/',
  '#offert': 'corriges/',
  '#whatsapp': 'https://wa.me/237' + TEL.slice(4),
  '#appel': 'tel:' + TEL
};
// Sans destination dans le dépôt : on NE fabrique rien, on laisse et on signale.
const SANS_DESTINATION = ['#mentions', '#cgv', '#charte'];

for (const [ancre, cible] of Object.entries(ANCRES)) {
  corps = corps.split('href="' + ancre + '"').join('href="' + cible + '"');
}

/* ── Tableau comparatif : une accroche pour pouvoir le styler ──────────────
   « Ce que chaque plan débloque » sort de la maquette en styles EN LIGNE et
   sans une seule classe : impossible à reprendre en CSS, et il détonnait à
   côté des panneaux d'abonnement — filets gris, aplat blanc, colonnes sans
   identité. On lui pose une classe ici, et la feuille fait le reste. Les
   règles doivent porter !important : une déclaration en ligne l'emporte
   toujours sur une feuille, quelle que soit la spécificité. */
{
  /* Deux conteneurs portent CE MÊME style en ligne : la grille des plans et
     le tableau « Votre inquiétude / Notre réponse ». Les coiffer tous les
     deux appliquerait à un tableau de deux colonnes des règles écrites pour
     cinq. On ne se repère donc pas sur le style — qui ne distingue rien —
     mais sur le contenu : seule la grille des plans ouvre sur la colonne
     « Fonctionnalité ». */
  const AVANT = '<div style="border:1px solid #E4E7EF;border-radius:14px;overflow:hidden">';
  let vus = 0, coiffes = 0;
  corps = corps.split(AVANT).map((part, i, tous) => {
    if (i === 0) return part;
    vus++;
    // `part` est ce qui SUIT le conteneur : on y cherche l'en-tête.
    const estGrillePlans = part.slice(0, 700).includes('Fonctionnalité');
    if (estGrillePlans) { coiffes++; return '<div class="vtab">' + part; }
    return AVANT + part;                      // laissé tel quel
  }).join('');
  if (coiffes !== 1) {
    console.warn('⚠ tableau comparatif : ' + coiffes + ' grille(s) de plans coiffée(s) sur '
      + vus + ' conteneur(s) — la maquette a changé, vérifier AVANT de déployer.');
  }

  /* Les cellules de valeur n'ont ni classe ni structure : on les qualifie par
     leur CONTENU, seul repère disponible. Le motif de style est assez
     particulier (`font-size:14px` + `text-align:center`) pour ne désigner que
     ce tableau — vérifié par le compteur ci-dessous, qui alerte si la
     maquette change et que la transformation ne mord plus. */
  let cellules = 0;
  corps = corps.replace(
    /<span style="font-size:14px;color:(#[0-9A-Fa-f]{6});text-align:center([^"]*)">([^<]*)<\/span>/g,
    (m, coul, reste, val) => {
      const t = val.trim();
      const cls = (t === '—' || t === '-' || t === '') ? 'vtab-non'
                : (t.toLowerCase() === 'oui') ? 'vtab-oui'
                : 'vtab-val';
      cellules++;
      return '<span class="' + cls + '" style="color:' + coul + ';text-align:center' + reste + '">' + val + '</span>';
    });
  if (cellules === 0) {
    console.warn('⚠ tableau comparatif : aucune cellule qualifiée — les pastilles ne seront pas rendues.');
  } else {
    console.log('tableau     : ' + cellules + ' cellules qualifiées');
  }
}

// Cartes de niveau : sept cartes, sept pages SEO, dans le même ordre.
const NIVEAUX = ['6eme', '5eme', '4eme', '3eme', 'seconde', 'premiere', 'terminale']
  .map(n => 'niveaux/francais-' + n + '.html');
// Pied de page : trois colonnes de cinq liens, dans l'ordre du gabarit.
// Même règle qu'au-dessus : ce que la vitrine sait afficher reste dans la
// vitrine. Le pied de page envoyait sept liens sur quinze vers l'application
// pour des écrans qui existent ici.
const FOOTER = [
  '#elearning', 'corriges/', '#elearning', APP + '#epreuves', 'oeuvres/',
  '#boutique', '#tarifs', '#elearning', '#elearning', APP + '#cagnotte',
  APP + '#presentation', '#parents', APP + '#partenariat', 'campus/', APP + '#verifier-certificat'
];

function brancherEnOrdre(html, ancre, cibles, quoi) {
  const n = html.split('href="' + ancre + '"').length - 1;
  if (n !== cibles.length) {
    throw new Error('Câblage ' + quoi + ' : ' + n + ' ancres ' + ancre + ' pour '
      + cibles.length + ' destinations. La maquette a changé — vérifier l\'ordre AVANT de déployer.');
  }
  let i = 0;
  return html.split('href="' + ancre + '"').reduce((acc, part, idx) =>
    idx === 0 ? part : acc + 'href="' + cibles[i++] + '"' + part, '');
}
corps = brancherEnOrdre(corps, '#niveau', NIVEAUX, 'des niveaux');
corps = brancherEnOrdre(corps, '#lien', FOOTER, 'du pied de page');

// ── CORRECTION 3 : images en WebP ──────────────────────────────────────────
// Les neuf photos livrées en PNG pesaient 5,99 Mo à elles seules — dont
// 1,75 Mo pour la seule image du bandeau. Rien de tout cela n'est du dessin
// au trait : ce sont des photos, que le PNG encode très mal. Même définition,
// même rendu, 598 Ko au total. Le logo reste en PNG : il sert aussi de favicon.
corps = corps.replace(/(assets\/(?!veritas-logo)[a-z0-9-]+)\.png/g, '$1.webp');

const ancresRestantes = [...new Set((corps.match(/href="#(?!lc-)[a-z-]+"/g) || []))];

// Le menu mobile n'est rendu que si compact ; on le génère à part.
const valsCompact = valsFor({ page: 'accueil', compact: true });
valsCompact.__page = 'accueil';

// ── Gabarits des régions dynamiques ────────────────────────────────────────
// On applique dès maintenant les transformations statiques (survol, onclick)
// et on laisse les {{ }} : c'est le moteur client qui les résoudra.
const gabarits = {};
for (const [nom, f] of Object.entries(fragments)) {
  let b = f.body;
  b = b.replace(/onClick="\{\{([^}]*)\}\}"/g, (m, e) => 'onclick="VRT.act(\'' + e.trim().replace(/\./g, '__') + '\',this,event)"');
  b = b.replace(/\s*style-hover="([^"]*)"/g, (m, d) => ' class="' + hoverClass(d) + '"');
  b = b.replace(/\s*hint-[a-z-]+="[^"]*"/g, '');
  b = marquer(b.trim(), 'data-vrt-item="' + nom + '"');
  gabarits[nom] = { alias: f.alias, tpl: b };
}

// ── Variantes de données ───────────────────────────────────────────────────
// Précalculées depuis la logique d'origine : aucune reformulation à la main,
// donc aucun risque de dérive entre la maquette et la page livrée.
const D = { onglets: [], services: [], filtres: [], moyensPaiement: [], champsPaiement: [], optionsLivraison: [], partages: {}, scal: {} };
const clean = o => JSON.parse(JSON.stringify(o, (k, v) => typeof v === 'function' ? undefined : v));

for (let t = 1; t <= 4; t++) {
  const v = valsFor({ page: 'accueil', tab: t });
  D.onglets.push(clean(v.onglets));
  D.services.push(clean(v.services));
}
for (let i = 0; i < 7; i++) D.filtres.push(clean(valsFor({ page: 'boutique', filtre: i }).filtres));
for (let m = 0; m < 4; m++) {
  const v = valsFor({ page: 'paiement', moyen: m });
  D.moyensPaiement.push(clean(v.moyensPaiement));
  D.champsPaiement.push(clean(v.champsPaiement));
  D.scal['moyen' + m] = { titreFormulaire: v.titreFormulaire, noteSecurite: v.noteSecurite, libellePayer: v.libellePayer };
}
for (let l = 0; l < 3; l++) D.optionsLivraison.push(clean(valsFor({ page: 'paiement', livr: l }).optionsLivraison));
for (const lg of ['fr', 'en']) {
  const v = valsFor({ page: 'accueil', langue: lg });
  D.partages[lg] = clean(v.partages);
  D.scal[lg] = { passage1: v.passage1, passage2: v.passage2, decryptage: v.decryptage };
}
{
  const c = new Component({});
  D.citations = clean(c.CITATIONS);
  D.themeSombre = (() => {
    // On récupère la feuille sombre telle qu'écrite dans la maquette.
    let capt = '';
    const faux = { getElementById: () => null, createElement: () => ({ set textContent(v) { capt = v; } }), head: { appendChild() {} } };
    const g = global.document; global.document = faux;
    try { c._appliquerTheme('sombre'); } finally { global.document = g; }
    return capt;
  })();
}

fs.writeFileSync(path.join(__dirname, '_corps.html'), corps);
fs.writeFileSync(path.join(__dirname, '_gabarits.json'), JSON.stringify(gabarits));
fs.writeFileSync(path.join(__dirname, '_data.json'), JSON.stringify(D));
fs.writeFileSync(path.join(__dirname, '_hover.css'), hoverRules.join('\n'));
fs.writeFileSync(path.join(__dirname, '_meta.json'), JSON.stringify({
  handlers: [...handlers], sections: PAGES, hoverRules: hoverRules.length,
  fragments: Object.keys(fragments), tailleCorps: corps.length
}, null, 1));
// ── Assemblage de la page ──────────────────────────────────────────────────
const DOMAINE = 'https://veritas-school.com';

// Le cache-buster DOIT être numérique : l'étape « Aligner les cache-busters »
// de la CI ne réécrit que les motifs `.js?v=<chiffres>`. Un jeton littéral
// serait parti tel quel en production, et .htaccess sert les assets en
// « immutable, max-age=1 an » — la correction suivante ne serait jamais
// arrivée jusqu'aux visiteurs déjà venus. On reprend la version de la coquille.
const VERSION_ASSETS = (function () {
  const shell = fs.readFileSync(path.join(process.cwd(), 'VERITAS_v1.2.html'), 'utf8').slice(0, 200000);
  const m = shell.match(/app\.js\?v=([0-9.]+)/);
  if (!m) throw new Error('Version de la coquille introuvable dans VERITAS_v1.2.html');
  return m[1];
})();
const metaBrut = lines.slice(lines.findIndex(l => l.trim() === '<helmet>') + 1,
                             lines.findIndex(l => l.trim() === '<style>'))
  .filter(l => /^<(meta|link|title)/.test(l.trim()))
  // Domaine réel du site : sans www. La maquette pointait www.veritas-school.com,
  // qui ne répond pas — canonical, og:url et les deux images en héritaient.
  .map(l => l.replace(/https:\/\/www\.veritas-school\.com/g, DOMAINE))
  // og:image / twitter:image visaient assets/hero-eleves.png. On pointe la
  // bannière de partage du site, og-image.jpg, que la CI déploie déjà et que
  // tous les aperçus (WhatsApp, Facebook) savent lire — le WebP reste mal
  // géré par certains robots d'aperçu.
  .map(l => l.replace(/(og:image|twitter:image)(.*)\/assets\/hero-eleves\.png/, '$1$2/og-image.jpg'))
  .join('\n');

const cssBascule = `
/* ── Tableau comparatif, traité comme les panneaux d'abonnement ────────────
   Même langage : pas de filet, la couleur portée par le fond, une colonne
   par plan qui garde SA teinte de bout en bout, et les valeurs en pastilles
   plutôt qu'en texte nu. Le !important est ici obligatoire et non
   négociable : le tableau sort de la maquette avec ses styles en ligne, qui
   priment sur toute feuille. */
.vtab{border:0!important;border-radius:18px!important;overflow:hidden!important;
  box-shadow:0 6px 16px rgba(0,17,54,.06)!important;background:#fff!important}
.vtab>div{border-bottom:0!important;gap:10px!important}

/* En-tête : aplat profond, libellés en capitales blanches — l'écho direct du
   bandeau des panneaux d'abonnement. */
.vtab>div:first-child{background:#0C2A6A!important;padding:16px 22px!important}
.vtab>div:first-child span{color:#fff!important;font-weight:600!important;
  letter-spacing:.6px!important;text-transform:uppercase!important;font-size:11.5px!important}

/* Une ligne sur deux teintée : c'est ce qui remplace le filet pour guider
   l'œil jusqu'au bout de la ligne, sur un tableau à cinq colonnes. */
.vtab>div:nth-child(odd):not(:first-child){background:#F8FAFD!important}
.vtab>div:not(:first-child):hover{background:#EDF2FB!important;transition:background .18s}

/* Colonnes 4 et 5 : les deux plans payants gardent leur teinte sur toute la
   hauteur, pour qu'on suive une offre du regard sans compter les colonnes. */
.vtab>div:not(:first-child)>span:nth-child(4){background:rgba(30,73,155,.055)}
.vtab>div:not(:first-child)>span:nth-child(5){background:rgba(91,79,168,.06)}
.vtab>div>span:nth-child(4),.vtab>div>span:nth-child(5){
  margin:-15px 0;padding:15px 4px!important;align-self:stretch;display:flex;
  align-items:center;justify-content:center}
.vtab>div:first-child>span:nth-child(4),.vtab>div:first-child>span:nth-child(5){margin:-16px 0;padding:16px 4px!important}

/* Intitulé de ligne à gauche, valeurs centrées : 15 px, jamais moins. */
.vtab>div>span{font-size:15px!important}
.vtab>div:not(:first-child)>span:first-child{font-weight:500!important;color:#16233F!important}

/* Le tiret « non inclus » s'efface, le « Oui » s'affirme : on doit lire ce
   qu'on GAGNE, pas ce qui manque. */
/* Le tiret « non inclus » doit rester DISCRET sans devenir invisible. Mesuré
   à #B6BCC9 : 1,82:1 sur blanc — à ce niveau on ne distingue plus un tiret
   d'une cellule vide, et l'information « ce plan ne l'inclut pas » se perd.
   #5F6478 tient 4,5:1 y compris sur la ligne teintée (#ECF0F8), où #6E7385 retombait à 4,13 tout en restant nettement en retrait du « Oui ». */
.vtab .vtab-non{color:#5F6478!important;font-size:17px!important}
.vtab .vtab-oui{display:inline-flex;align-items:center;justify-content:center;
  min-width:30px;height:30px;border-radius:100px;background:#E6F4E9;
  color:#0A5B14!important;font-weight:600!important;font-size:13.5px!important}
.vtab .vtab-val{display:inline-block;padding:5px 12px;border-radius:100px;
  background:#EDF2FB;color:#1E499B!important;font-weight:500!important;font-size:13.5px!important}

@media (max-width:760px){
  .vtab>div{grid-template-columns:1.6fr repeat(4,1fr)!important;padding:12px 13px!important}
  .vtab>div>span{font-size:13.5px!important}
  .vtab>div:first-child span{font-size:10.5px!important;letter-spacing:.3px!important}
}

/* ── Le tableau en thème sombre ────────────────────────────────────────────
   Indispensable, et pas optionnel : le thème sombre de la maquette repère
   les surfaces par [style*="background:#fff"], c'est-à-dire dans l'attribut
   style. Le tableau tirant désormais son fond d'une CLASSE, il serait resté
   blanc pendant que le texte s'éclaircit — gris pâle sur blanc. On s'accroche
   à data-vrt-theme, posé sur <html> par appliquerTheme(). */
[data-vrt-theme="sombre"] .vtab{background:#101E3C!important;box-shadow:none!important}
[data-vrt-theme="sombre"] .vtab>div:nth-child(odd):not(:first-child){background:#14244A!important}
[data-vrt-theme="sombre"] .vtab>div:not(:first-child){background:#101E3C!important}
[data-vrt-theme="sombre"] .vtab>div:not(:first-child):hover{background:#1A2C57!important}
[data-vrt-theme="sombre"] .vtab>div:not(:first-child)>span{color:#D8E0F0!important}
[data-vrt-theme="sombre"] .vtab>div:not(:first-child)>span:first-child{color:#F2F5FB!important}
[data-vrt-theme="sombre"] .vtab>div:not(:first-child)>span:nth-child(4){background:rgba(90,140,235,.14)}
[data-vrt-theme="sombre"] .vtab>div:not(:first-child)>span:nth-child(5){background:rgba(150,135,235,.16)}
/* Les pastilles s'inversent : fond soutenu, texte clair — l'inverse du mode
   clair, sinon un vert pâle sur bleu nuit disparaît. */
[data-vrt-theme="sombre"] .vtab .vtab-oui{background:#14532D;color:#B7F0C6!important}
[data-vrt-theme="sombre"] .vtab .vtab-val{background:#1E3566;color:#CBDCFA!important}
[data-vrt-theme="sombre"] .vtab .vtab-non{color:#5E6B85!important}

/* ── Titre à mots tournants ────────────────────────────────────────────────
   La maquette empilait les quatre mots au lieu de les faire tourner : chaque
   mot reçoit un cycle de 13,6 s décalé d'un quart, mais la règle d'origine le
   gardait opaque de 12 % à 88 % — soit 10,3 s de visibilité sur 13,6. Les
   quatre se chevauchaient donc en permanence, et le titre était illisible.
   Un mot par quart de cycle, la sensation cinétique est conservée. */
@keyframes vwordIn{
  0%{opacity:0;transform:translateY(100%)}
  2%,20%{opacity:1;transform:translateY(0)}
  25%,100%{opacity:0;transform:translateY(-100%)}
}

/* Barre large / compacte : bascule à 1000 px, en CSS pur. */
.vrt-compact{display:none!important}
@media (max-width:999.98px){
  .vrt-large{display:none!important}
  .vrt-compact{display:flex!important}
}
[hidden]{display:none!important}

/* ── Le menu « Plus » s'ouvre au survol ────────────────────────────────────
   Trois choses à savoir avant de toucher à cette règle.

   1. Le mot-clé important est OBLIGATOIRE ici. La ligne [hidden] juste
      au-dessus ferme le panneau avec la même arme : sans important en face,
      la règle de survol perd l'arbitrage, en silence.

   2. On s'accroche au PARENT via :has(), faute de conteneur. Le panneau est
      positionné en absolu, mais l'élément #vrtPlusWrap que vitrine.js
      interroge dans son gestionnaire de clic extérieur n'existe pas dans la
      page — :has(> #vrtPlus) désigne donc le vrai parent, quel qu'il soit.
      Là où :has() n'est pas connu (Chrome antérieur à 105, encore présent
      sur une partie du parc Android d'ici), la règle est simplement ignorée
      et le clic continue de fonctionner : l'ouverture au survol est un
      confort, jamais la seule porte d'entrée.

   3. Réservé aux pointeurs FINS. Sur un écran tactile, un menu qui s'ouvre au
      survol piège l'utilisateur : la première frappe ouvre au lieu de
      naviguer, et rien n'indique qu'il faut frapper deux fois. La demande
      était « au pointeur de la souris » — la media query dit exactement
      cela. */
@media (hover:hover) and (pointer:fine){
  *:has(> #vrtPlus):hover > #vrtPlus[hidden]{display:flex!important}
  /* Pont de survol : sans lui, les quelques pixels entre le bouton et le
     panneau referment le menu en cours de trajet. */
  *:has(> #vrtPlus){position:relative}
  *:has(> #vrtPlus)::after{content:'';position:absolute;left:0;right:0;top:100%;height:10px}
}

/* ── Couche responsive ─────────────────────────────────────────────────────
   La maquette ne contient AUCUNE media query en dehors de
   prefers-reduced-motion : toute la mise en page tient dans des styles inline
   calibrés pour 1170 px, et les grilles ne se replient jamais. Mesuré à
   390 px avant correctif : 738 px de large réels, soit un débordement
   horizontal de 348 px sur la quasi-totalité des sections.

   On cible les styles inline par sélecteur d'attribut — c'est déjà la
   technique qu'emploie le thème sombre de la maquette. minmax(0,1fr) est
   indispensable : sans lui, une grille refuse de descendre sous la largeur
   min-content de son contenu et déborde à nouveau.

   Le public de VÉRITAS consulte majoritairement au téléphone ; livrer la
   vitrine sans cette couche revenait à livrer un site illisible. */
@media (max-width:999.98px){
  [style*="grid-template-columns"]{grid-template-columns:repeat(2,minmax(0,1fr))!important}
  [style*="max-width:1170px"]{padding-left:20px!important;padding-right:20px!important}
  img{max-width:100%;height:auto}
}
@media (max-width:700px){
  [style*="grid-template-columns"]{grid-template-columns:minmax(0,1fr)!important}
  [style*="max-width:1170px"]{padding-left:16px!important;padding-right:16px!important}
}
`;

const page = `<!DOCTYPE html>
<html lang="fr">
<head>
<meta charset="utf-8">
${metaBrut}
<script type="application/ld+json">${jsonld
  .replace(/https:\/\/www\.veritas-school\.com/g, DOMAINE)
  // L'adresse publique du centre est contact@veritas-school.com (index.php,
  // pages statiques). La maquette exposait le Gmail personnel de Jacques dans
  // les données structurées, donc dans les résultats de recherche.
  .replace(/"jacquesmytheerrant@gmail\.com"/, '"contact@veritas-school.com"')}</script>
<style>
${styleBlock}
${cssBascule}
${hoverRules.join('\n')}
</style>
</head>
<body>
${sprite}
${corps}
<script>window.VRT_DATA=${JSON.stringify(D)};window.VRT_TPL=${JSON.stringify(gabarits)};</script>
<script src="assets/vitrine.js?v=${VERSION_ASSETS}" defer></script>
</body>
</html>
`;
if (OUT) { fs.writeFileSync(OUT, page); console.log('écrit      :', OUT, '—', page.length, 'octets'); }

console.log('');
console.log('── Corrections ──');
console.log('taux réels  : BEPC 100 % · Probatoire 69 % · BAC 61 % (anneaux recalculés)');
console.log('taux MANQUANTS (laissés vides) :', tauxManquants.join(', ') || 'aucun');
console.log('ancres branchées :', Object.keys(ANCRES).length + 2, 'familles');
console.log('ancres SANS destination :', ancresRestantes.join(' ') || 'aucune');
console.log('');
console.log('corps      :', corps.length, 'octets');
console.log('fragments  :', Object.keys(fragments).join(', '));
console.log('handlers   :', [...handlers].join(', '));
console.log('hover      :', hoverRules.length, 'règles');
console.log('sections   :', (corps.match(/data-vp="/g) || []).length);
