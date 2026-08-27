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
  'optionsLivraison', 'lignesTotal', 'partages',
  // La grille de la boutique : sans elle, la barre de filtres repeignait ses
  // pastilles et laissait la meme grille — un filtre qui s'allume sans rien
  // filtrer est un mensonge d'interface.
  'manuels'
]);
// Scalaires réévalués côté client (position texte uniquement)
const SCALAIRES_DYN = new Set([
  'nbManuels',
  'titreFormulaire', 'noteSecurite', 'libellePayer', 'totalPayer', 'quantite',
  'passage1', 'passage2', 'decryptage', 'texteBoutonCopie', 'dateDuJour',
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
// sa tuile n'est donc plus construite du tout (voir le filtre ci-dessous).
// L'angle de l'anneau DOIT suivre le taux : la maquette affichait 300° (83 %)
// derrière un « __ % ». Un anneau qui contredit son nombre est pire qu'un trou.
// `effectif` = nombre de candidats présentés. Un taux sans dénominateur ne se
// vérifie pas : « 100 % de réussite » sur deux candidats et sur quarante ne
// disent pas la même chose, et c'est la forme d'annonce que le marché associe
// aux centres qui gonflent leurs chiffres. Laisser `effectif` à null n'invente
// rien — la tuile s'affiche alors comme avant, sans la mention.
// ⚠️ À RENSEIGNER PAR LE CENTRE, à partir des procès-verbaux de proclamation.
const TAUX_REELS = {
  'BEPC':         { taux: 100, effectif: null },
  'Probatoire':   { taux: 69,  effectif: null },
  'Baccalauréat': { taux: 61,  effectif: null }
};
let tauxManquants = [];
vals.reussites = vals.reussites.filter(r => {
  // Un examen sans résultat mesuré ne reçoit PLUS de tuile vide.
  // Jusqu'au 27/08/2026 il en recevait une, portant le gabarit « __ % » de la
  // maquette sous le mot « DE RÉUSSITE ». Le trou se voyait — mais il se lisait
  // comme un oubli, et jetait le doute sur les trois taux voisins. Le taux du
  // GCE n'existe pas encore : la bonne réponse est de ne rien annoncer.
  if (TAUX_REELS[r.examen] === undefined) { tauxManquants.push(r.examen); return false; }
  return true;
}).map(r => {
  const { taux: t, effectif } = TAUX_REELS[r.examen];
  const deg = Math.round(t / 100 * 360);
  const creux = r.anneau.match(/,(#[0-9A-Fa-f]{6}) \d+deg/);
  const fond = (creux ? creux[1] : '#E7EDF8');
  return Object.assign({}, r, {
    taux: t + ' %',
    /* Le dénominateur rejoint la ligne de détail dès qu'il est connu :
       « Séries A, C, D et technique » devient « … · 31 candidats présentés ». */
    detail: effectif ? r.detail + ' · ' + effectif + ' candidat'
                       + (effectif > 1 ? 's' : '') + ' présenté'
                       + (effectif > 1 ? 's' : '')
                     : r.detail,
    /* L'anneau reste ÉCRIT REMPLI ici — c'est ce que voit un visiteur sans
       JavaScript, et c'est ce que lit un moteur de recherche. Les trois
       variables qui suivent permettent à vitrine.js de le rejouer depuis zéro
       à l'entrée dans l'écran ; sans JS, elles ne servent simplement à rien. */
    anneau: 'conic-gradient(' + r.teinte + ' 0deg ' + deg + 'deg,' + fond + ' ' + deg + 'deg 360deg);'
          + '--vr-cible:' + deg + 'deg;--vr-teinte:' + r.teinte + ';--vr-creux:' + fond
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
// Domaine réel du site. Déclaré ici parce que les corrections du corps en ont
// besoin ; `DOMAINE`, plus bas, sert l'assemblage de l'en-tête et vaut pareil.
const SITE = 'https://veritas-school.com';
/* ⚠️ AUCUNE de ces destinations ne doit être « app.html » TOUT COURT.
   La coquille (VERITAS_v1.2.html) ouvre sur une garde anti-double-accueil :
   tout visiteur ANONYME qui demande /app.html sans ancre ni paramètre est
   renvoyé à « / ». Un lien nu se faisait donc avaler au premier clic — le
   visiteur revenait à la vitrine, recliquait, et ça marchait. C'est le pire
   des bugs : intermittent en apparence, parfaitement déterministe en fait.
   Les quatre portes d'entrée de l'application (Connexion ×2, Mon compte,
   Rechercher) étaient précisément dans ce cas. Chaque destination porte
   désormais une ancre que la garde laisse passer ET que le routeur d'app.js
   (_vtHashRouter) sait ouvrir. */
const ANCRES = {
  '#creer-compte': APP + '#inscription',    // route ajoutée au routeur en même temps
  '#compte': APP + '#connexion',            // _ouvrirConnexion() ramène un connecté chez lui
  '#connexion': APP + '#connexion',
  /* La loupe ne cherchait rien : elle ouvrait l'accueil de l'application. Un
     premier correctif l'a envoyée vers /corriges/ — c'était encore de la
     navigation, pas une recherche. Or l'application POSSÈDE une recherche de
     site, mRecherche(), jusque-là enterrée derrière le panneau « Naviguer ».
     Elle est maintenant adressable par ancre, donc atteignable d'ici. */
  '#recherche': APP + '#recherche',
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
  /* ── Ce qui sort LÉGITIMEMENT vers l'application ────────────────────────
     Aucun équivalent dans la vitrine : ces parcours vivent dans l'app. */
  '#partenariat': APP + '#partenariat',
  '#candidature': APP + '#partenariat',
  '#cagnotte': APP + '#cagnotte',
  '#corriges': 'corriges/',
  '#bareme': 'corriges/',
  '#offert': 'corriges/',
  '#whatsapp': 'https://wa.me/237' + TEL.slice(4),
  '#appel': 'tel:' + TEL,
  /* Ces trois-là n'avaient AUCUNE destination : le pied de page annonçait
     « Mentions légales » et « CGV », l'écran enseignants « Lire la charte
     pédagogique », et les trois liens ne menaient nulle part. Sur un site qui
     encaisse, des CGV absentes ne sont pas un détail de finition. Les pages
     existent désormais dans legal/. */
  '#mentions': 'legal/mentions-legales.html',
  '#cgv': 'legal/cgv.html',
  '#confidentialite': 'legal/confidentialite.html',
  '#charte': 'legal/charte-pedagogique.html'
};
// Sans destination dans le dépôt : on NE fabrique rien, on laisse et on signale.
const SANS_DESTINATION = [];

/* Un lien vers une page absente est pire qu'un lien mort visible : il promet
   des CGV et rend un 404. On vérifie sur DISQUE, à la construction. */
for (const cible of Object.values(ANCRES)) {
  if (/^(https?:|tel:|mailto:|#)/.test(cible)) continue;
  let chemin = cible.split('#')[0].split('?')[0];
  if (chemin === '') continue;                                   // ancre pure
  // app.html n'existe pas dans le dépôt : deploy.yml le fabrique depuis la
  // coquille. C'est celle-ci qu'il faut vérifier.
  if (chemin === 'app.html') chemin = 'VERITAS_v1.2.html';
  if (chemin.endsWith('/')) chemin += 'index.html';
  const f = path.join(process.cwd(), chemin);
  if (!fs.existsSync(f)) {
    throw new Error('Ancre branchée sur « ' + cible + ' », qui n\'existe pas dans le dépôt. '
      + 'Créer la page ou retirer la destination — pas de lien vers un 404.');
  }
}

/* ══════════════════════════════════════════════════════════════════════════
   « DÉCOUVRIR » : VINGT CARTES, UNE SEULE DESTINATION — ET LA MAUVAISE
   ────────────────────────────────────────────────────────────────────────────
   Les cartes de « Tout ce dont l'élève a besoin » portaient toutes le même
   href="#detail" — un jeton de maquette, pas une adresse. Il était traduit
   globalement en « #boutique ». Deux conséquences, mesurées au navigateur :

     · les 4 cartes du PREMIER onglet menaient à la librairie, y compris
       « Labos virtuels » et « Jeux pédagogiques », qui ne s'y vendent pas ;
     · les 16 autres — rendues au clic par le moteur client, depuis le gabarit
       et non depuis ce HTML — gardaient « #detail » TEL QUEL. Or aucun écran
       ne porte data-vp="detail" : le routeur ignore l'ancre et la page ne
       bouge pas. Seize boutons « Découvrir » qui ne découvraient rien.

   Le second cas est le plus instructif : corriger le HTML rendu ne corrige
   que ce qui est visible au chargement. Tout ce qu'un gabarit reconstruit au
   clic doit être corrigé DANS LE GABARIT. D'où les deux passes ci-dessous —
   celle-ci pour les cartes déjà écrites, `dest` (plus bas) pour les autres.

   La table est indexée par TITRE : c'est ce que la maquette peut changer sans
   prévenir, et une carte inconnue arrête la construction plutôt que de partir
   avec un lien mort.
   ══════════════════════════════════════════════════════════════════════════ */
const DEST_SERVICES = {
  /* Apprendre */
  'Cours par séquence':      '#elearning',
  'Œuvres au programme':     'oeuvres/',
  'Labos virtuels':          '#elearning',
  'Jeux pédagogiques':       '#elearning',
  /* S'entraîner */
  'Épreuves & annales':      APP + '#epreuves',
  'Corrigés des cahiers':    'corriges/',
  'Bulletins blancs':        '#elearning',
  'Concours blancs':         '#elearning',
  /* Se faire aider */
  'Professeur Ambassa':      '#elearning',
  'Classes virtuelles':      '#elearning',
  'Orientation':             'parcours/',
  'Support WhatsApp':        'https://wa.me/237' + TEL.slice(4),
  /* Vie scolaire */
  'Espace Parents':          '#parents',
  'Cagnotte de scolarité':   APP + '#cagnotte',
  'Boutique de manuels':     '#boutique',
  'Certificats vérifiables': APP + '#verifier-certificat',
  /* Répétitions — la carte EST la description (prix compris) ; « Découvrir »
     ne peut mener qu'à quelqu'un à qui parler, pas à une page de plus. */
  'Répétitions au centre':   APP + '#contact',
  'Répétitions à domicile':  APP + '#contact',
  'Cours de rattrapage':     APP + '#contact',
  'Préparation examens':     APP + '#contact'
};

/* Mêmes règles de vérification que pour ANCRES : une destination sur disque
   doit exister, sinon on promet un 404. */
for (const cible of Object.values(DEST_SERVICES)) {
  if (/^(https?:|tel:|mailto:|#)/.test(cible)) continue;
  let chemin = cible.split('#')[0].split('?')[0];
  if (chemin === '') continue;
  if (chemin === 'app.html') chemin = 'VERITAS_v1.2.html';
  if (chemin.endsWith('/')) chemin += 'index.html';
  if (!fs.existsSync(path.join(process.cwd(), chemin))) {
    throw new Error('Carte « Découvrir » branchée sur « ' + cible + ' », absente du dépôt.');
  }
}

/* Passe 1 — les cartes de l'onglet ouvert, DÉJÀ écrites dans le corps.
   `dest` n'existe pas dans les données de la maquette : celle-ci rend donc un
   href VIDE, qu'on remplit ici. On lit le titre porté par la carte elle-même —
   sa position dans le fichier ne prouve rien, son titre si. */
{
  let posees = 0;
  corps = corps.replace(
    /<h3([^>]*)>([^<]+)<\/h3>([\s\S]{0,900}?)href=""/g,
    (tout, attrs, titre, milieu) => {
      const cible = DEST_SERVICES[titre.trim()];
      if (!cible) return tout;                       // pas une carte de service
      posees++;
      return '<h3' + attrs + '>' + titre + '</h3>' + milieu + 'href="' + cible + '"';
    });
  console.log('découvrir   : ' + posees + ' carte(s) rendue(s) branchée(s) sur leur destination');
}

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
  /* Le repère portait la couleur de bordure en dur. La passe « plus de traits »
     l'a rendue transparente, et le conteneur n'a plus été trouvé : le tableau
     comparatif partait sans sa classe .vtab, donc sans défilement sur mobile.
     Le garde-fou plus bas a fait son travail — il a crié. On ne dépend plus de
     la couleur : seuls la forme du conteneur et son contenu comptent. */
  const AVANT_RE = /<div style="border:1px solid (?:#[0-9A-Fa-f]{3,6}|transparent);border-radius:14px;overflow:hidden">/;
  let vus = 0, coiffes = 0;
  const AVANT_G = new RegExp(AVANT_RE.source, 'g');
  const morceaux = corps.split(AVANT_G);
  const ouvertures = corps.match(AVANT_G) || [];
  corps = morceaux.map((part, i) => {
    if (i === 0) return part;
    vus++;
    // `part` est ce qui SUIT le conteneur : on y cherche l'en-tête.
    const estGrillePlans = part.slice(0, 700).includes('Fonctionnalité');
    if (estGrillePlans) { coiffes++; return '<div class="vtab">' + part; }
    return ouvertures[i - 1] + part;          // laissé tel quel, couleur d'origine
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
  'decouvrir/', '#parents', APP + '#partenariat', 'campus/', APP + '#verifier-certificat'
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
corps = brancherEnOrdre(corps, '#lien', FOOTER, 'du pied de page');

/* ── Le calendrier scolaire, lu à la SOURCE ────────────────────────────────
   CALENDRIER_SCOLAIRE (app.js) porte l'arrêté conjoint MINEDUB/MINESEC
   2026-2027 : trois trimestres, six séquences, les interruptions et les
   périodes d'examens. On le LIT plutôt que de le recopier — une date recopiée
   diverge au premier amendement, et personne ne s'en aperçoit.
   Le bloc est pré-rendu : il s'affiche sans JS et Google l'indexe. */
function lireCalendrier() {
  const src = fs.readFileSync(path.join(process.cwd(), 'app.js'), 'utf8');
  const i = src.indexOf('var CALENDRIER_SCOLAIRE={');
  if (i < 0) throw new Error('CALENDRIER_SCOLAIRE introuvable dans app.js — bloc calendrier impossible.');

  /* ⚠️ LES COMMENTAIRES D'ABORD, LE COMPTAGE ENSUITE.
     Premier essai : compter les accolades directement sur la source. Il
     s'arrêtait au milieu du tableau `journees`, sur une erreur de syntaxe
     incompréhensible. La cause est en français : les commentaires du
     calendrier contiennent des apostrophes — « fixées par l'arrêté conjoint ».
     Le compteur y voyait l'OUVERTURE d'une chaîne, cherchait sa fermeture
     jusqu'à la prochaine apostrophe venue, et ne comptait plus rien de juste.
     On travaille donc sur une copie privée de ses commentaires de ligne. */
  const brut = src.slice(i, i + 40000);
  const propre = brut.split('\n')
    .filter(l => !/^\s*\/\//.test(l))
    .join('\n');

  const d = propre.indexOf('{');
  let prof = 0, j = d, chaine = null;
  for (; j < propre.length; j++) {
    const c = propre[j], p = propre[j - 1];
    if (chaine) { if (c === chaine && p !== '\\') chaine = null; continue; }
    if (c === '\'' || c === '"' || c === '`') { chaine = c; continue; }
    if (c === '{') prof++;
    else if (c === '}') { prof--; if (!prof) { j++; break; } }
  }
  if (prof !== 0) throw new Error('CALENDRIER_SCOLAIRE : accolades déséquilibrées — extraction refusée.');

  // Notre propre fichier, littéral d'objet pur : évaluation directe.
  const cal = eval('(' + propre.slice(d, j) + ')');
  if (!cal || !cal.annee || !Array.isArray(cal.trimestres) || !cal.trimestres.length) {
    throw new Error('CALENDRIER_SCOLAIRE : forme inattendue (année ou trimestres manquants).');
  }
  return cal;
}

/* Les séquences ne portent que jour + mois (« 07 Sept ») ; l'année vient du
   trimestre qui les contient. Sans cette résolution, « en ce moment » désigne
   n'importe quoi dès janvier. */
const MOIS = { jan:0, fév:1, fev:1, mars:2, avr:3, mai:4, juin:5, juil:6, août:7, aout:7, sept:8, oct:9, nov:10, déc:11, dec:11 };
function isoDe(txt, anneeDebut, anneeFin) {
  /* Les dates du calendrier ne suivent pas UN format mais plusieurs :
     « 07 Sept 2026 », « 18 Déc 2026 (15h30) », et surtout
     « Lun. 03 au Ven. 21 Mai 2027 » — un intervalle avec jours de semaine.
     Une expression qui exige « nombre puis mois » collés échoue sur le
     troisième : elle lit « 03 au » et rend une chaîne vide, donc la ligne ne
     peut jamais être désignée comme prochaine échéance.
     On prend donc le PREMIER nombre, puis le PREMIER nom de mois qui suit,
     même séparé par d'autres mots. */
  /* ⚠️ LE POINT EST OBLIGATOIRE dans ce filtre, il n'est pas décoratif.
     Sans lui, « \b(mar) » mord sur le début de « MARS » : « 25 Mars 2027 »
     devenait « 25 s 2027 », plus aucun mois reconnaissable, et la ligne
     perdait sa date pivot. Les jours de semaine sont TOUJOURS abrégés avec un
     point dans l'arrêté (« Lun. », « Ven. »), les mois jamais. */
  const s = String(txt).replace(/\b(?:lun|mar|mer|jeu|ven|sam|dim)\.\s*/gi, '');
  const mJour = s.match(/(\d{1,2})/);
  if (!mJour) return '';
  const apres = s.slice(mJour.index + mJour[1].length);
  const mMois = apres.match(/([A-Za-zéèûôîàÉÈ]{3,})/);
  if (!mMois) return '';
  const m = [null, mJour[1], mMois[1]];
  const mo = MOIS[m[2].toLowerCase().replace(/\.$/, '')];
  if (mo === undefined) return '';
  // Septembre→décembre = année de rentrée ; janvier→août = année suivante.
  const an = mo >= 8 ? anneeDebut : anneeFin;
  return an + '-' + String(mo + 1).padStart(2, '0') + '-' + String(+m[1]).padStart(2, '0');
}

function blocCalendrier() {
  const C = lireCalendrier();
  const [a1, a2] = String(C.annee).split('-').map(Number);
  const ENCRE = '#001136', GRIS = '#4D5163';

  /* ── DATES CLÉS, et rien d'autre ─────────────────────────────────────────
     Première version : les trois trimestres, leurs six séquences, les
     interruptions et les cinq périodes d'examens. Exact, sourcé… et beaucoup
     trop long pour une page d'accueil — sur téléphone, le bloc faisait plus
     de deux écrans à lui seul. L'accueil annonce, il ne détaille pas.

     On garde donc SIX repères et un lien vers le calendrier complet, qui
     existe déjà dans l'application (showCalendrier, app.js) et qui est
     désormais atteignable par ancre. Les six sont DÉRIVÉS de l'objet, jamais
     retapés : rentrée, les trois interruptions, les compositions de fin
     d'année et la période des examens officiels du secondaire. */
  const cles = [];
  const t1 = C.trimestres[0];
  if (t1) cles.push({ q: 'Rentrée des classes', d: t1.debut, ton: 'debut' });
  (C.vacances || []).forEach(v => cles.push({
    q: v.label.replace(/\s*\([^)]*\)/, ''),
    d: v.debut.replace(/\s*\([^)]*\)/, '') + ' → ' + v.fin.replace(/\s*\([^)]*\)/, ''),
    ton: 'pause'
  }));
  const compo = (C.examens_nationaux || []).find(e => /Compositions/i.test(e.nom));
  if (compo) cles.push({ q: 'Compositions de fin d\u2019année', d: compo.date, ton: 'exam' });
  const offi = (C.examens_nationaux || []).find(e => /Secondaires/i.test(e.nom));
  if (offi) cles.push({ q: 'Examens officiels · BEPC, Probatoire, BAC, GCE', d: offi.date, ton: 'exam' });

  if (cles.length < 4) throw new Error('Calendrier : moins de 4 dates clés extraites — vérifier CALENDRIER_SCOLAIRE.');

  const lignes = cles.map(c => {
    const iso = isoDe(String(c.d).split('→')[0], a1, a2);
    return '<li class="vcle vcle-' + c.ton + '" data-jour="' + iso + '">'
         + '<span class="vcle-q">' + esc(c.q) + '</span>'
         + '<span class="vcle-d">' + esc(c.d) + '</span></li>';
  }).join('');

  /* Les actualités sont un CONTENEUR VIDE : rien n'est écrit ici. Si
     news_proxy.php ne répond pas, l'aside reste masqué et la colonne
     disparaît — on n'affiche pas une rubrique d'actualités sans actualité. */
  const onglets = [['minesec', 'MINESEC'], ['bourses', 'Bourses'],
                   ['education', 'Éducation'], ['grandes_ecoles', 'Grandes écoles']]
    .map(([k, l], i) => '<button type="button" class="vnews-tab' + (i ? '' : ' on') + '" data-cat="' + k + '"'
        + ' onclick="VRT.act(\'actus\',this,event)">' + l + '</button>').join('');

  return '<!-- CALENDRIER & ACTUALITÉS -->\n'
    + '<section style="padding:48px 0 10px" data-reveal>'
    +   '<div style="max-width:1170px;margin:0 auto;padding:0 24px">'
    +     '<div style="margin-bottom:20px">'
    +       '<h2 style="font:600 27px/36px Poppins,sans-serif;color:' + ENCRE + ';margin:0 0 6px">L\u2019année scolaire ' + esc(C.annee) + '</h2>'
    +       '<p style="margin:0;font-size:15px;color:' + GRIS + '">Les dates à retenir, d\u2019après l\u2019arrêté conjoint MINEDUB/MINESEC — et ce qui bouge en ce moment côté MINESEC, bourses et concours.</p>'
    +     '</div>'
    +     '<div class="vcal-grid">'
    +       '<div class="vcal-box vcal-box-cles">'
    +         '<ul class="vcles">' + lignes + '</ul>'
    +         '<p class="vcal-note">' + esc(C.note || '') + '</p>'
    +         '<a class="vcal-lien vlien-anim" href="app.html#calendrier">Voir le calendrier complet'
    +           '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><use href="#lc-arrow-right"></use></svg>'
    +         '</a>'
    +       '</div>'
    +       '<aside class="vnews" id="vrtNews" hidden>'
    +         '<div class="vnews-hd"><h3>Actualités</h3><div class="vnews-tabs">' + onglets + '</div></div>'
    +         '<ul class="vnews-liste" id="vrtNewsListe"></ul>'
    +         '<p class="vnews-src">Fil d\u2019actualité public — VÉRITAS n\u2019en est pas l\u2019auteur.</p>'
    +       '</aside>'
    +     '</div>'
    +   '</div>'
    + '</section>';
}

/* ════════════════════════════════════════════════════════════════════════════
   CORRECTION 2 bis — DEUX BLOCS RETIRÉS, UN BLOC UTILE À LA PLACE
   ────────────────────────────────────────────────────────────────────────────
   Demande de Jacques, captures d'écran mobiles à l'appui.

   • « Les corrigés de ma classe » (section NIVEAUX) : sept cartes empilées, une
     par ligne, chacune haute comme un demi-écran sur téléphone pour n'annoncer
     qu'un nombre. Le menu « Plus » et le pied de page mènent déjà aux mêmes
     sept pages ; la bande ne faisait que consommer l'écran le plus précieux.

   • « Ce que chaque plan débloque » : la grille comparative se disloquait sous
     420 px — pastilles « Oui » flottant au-dessus de leur ligne, « Illimité »
     coupé net. Une grille de cinq colonnes ne tient pas sur un téléphone, et
     personne ne compare cinq colonnes au pouce.

   À la place : le CALENDRIER SCOLAIRE officiel et les ACTUALITÉS MINESEC /
   BOURSES. C'est ce que ce public vient chercher entre deux séquences, et les
   deux sources existent déjà dans le dépôt — rien n'est inventé :
     · le calendrier vient de CALENDRIER_SCOLAIRE (app.js), qui cite l'arrêté
       conjoint MINEDUB/MINESEC 2026-2027 ;
     · les actualités viennent de api/news_proxy.php, qui sert déjà quatre flux
       (education, minesec, grandes_ecoles, bourses).
   Le calendrier est PRÉ-RENDU ici (indexable, lisible sans JS) ; les actualités
   sont chargées à l'affichage et le bloc DISPARAÎT si le flux ne répond pas —
   règle maison : pas de données, pas d'affichage.
   ══════════════════════════════════════════════════════════════════════════ */
{
  // ── Retrait 1 : la section NIVEAUX, bornée par les marqueurs de la maquette
  const dN = corps.indexOf('<!-- NIVEAUX -->');
  const fN = corps.indexOf('<!-- RÉASSURANCE -->', dN);
  if (dN < 0 || fN < 0) {
    throw new Error('Retrait NIVEAUX : marqueurs introuvables — la maquette a changé, vérifier AVANT de déployer.');
  }
  const avantN = corps.length;
  corps = corps.slice(0, dN) + blocCalendrier() + '\n    ' + corps.slice(fN);
  console.log('niveaux     : section retirée (' + (fN - dN) + ' octets) → calendrier + actualités');

  // ── Retrait 2 : la grille comparative des plans
  const ancre = corps.indexOf('Ce que chaque plan');
  if (ancre < 0) {
    throw new Error('Retrait du tableau : titre introuvable — la maquette a changé, vérifier AVANT de déployer.');
  }
  const dT = corps.lastIndexOf('<section', ancre);
  const fT = corps.indexOf('</section>', ancre);
  if (dT < 0 || fT < 0) throw new Error('Retrait du tableau : bornes de section introuvables.');
  // Garde-fou : la section ne doit contenir QUE ce tableau. Si elle en contient
  // un second (la maquette aurait fusionné deux blocs), on refuse de couper.
  const tranche = corps.slice(dT, fT);
  if ((tranche.match(/<section\b/g) || []).length !== 1) {
    throw new Error('Retrait du tableau : la section englobe autre chose — coupe refusée.');
  }
  corps = corps.slice(0, dT) + corps.slice(fT + '</section>'.length);
  console.log('plans       : grille comparative retirée (' + (fT + 10 - dT) + ' octets)');
  console.log('total       : ' + (avantN - corps.length) + ' octets nets retirés du corps');
}

/* ══════════════════════════════════════════════════════════════════════════
   CORRECTION 2 bis — LE MENU « PLUS » REPREND TOUS LES ANCIENS ONGLETS
   ──────────────────────────────────────────────────────────────────────────
   La maquette proposait quatre entrées : catalogue, corrigés, abonnements,
   boutique. Or l'ancienne navigation visiteur en comptait dix-sept
   (_vtHashRouter, app.js) plus une dizaine de hubs statiques. Tout le reste
   — présentation, actualités, résultats, photos, orientation, cagnotte,
   trophées, classement, partenaires, certificats, annales, évaluations,
   œuvres, programmes, outils, Campus… — n'était atteignable par AUCUN menu.
   Les pages existaient, elles étaient déployées, et plus personne ne pouvait
   y arriver autrement qu'en connaissant l'URL.

   Deux défauts de câblage au passage, tous deux dans les quatre entrées
   d'origine : « Corrigés des cahiers » ouvrait l'écran e-learning (donc deux
   entrées différentes menaient au même endroit, et les corrigés n'étaient
   nulle part), et le menu ne signalait pas quelles entrées quittent la
   vitrine.

   Le modèle ci-dessous est la SEULE source : le panneau de bureau et le menu
   mobile en sont tous deux dérivés, ils ne peuvent donc plus diverger.

   TROIS groupes de NEUF, et ce n'est pas un caprice de symétrie : le panneau
   tient en trois colonnes de 218 px (590 px au total), la seule largeur qui
   ne soit jamais coupée à droite quand on l'ancre sous le bouton « Plus ».
   Un quatrième groupe repartait sur une deuxième rangée, seul et à gauche,
   et faisait déborder le panneau en hauteur. Si une entrée s'ajoute un jour,
   la retirer d'ailleurs ou repasser à deux colonnes — mais ne pas laisser
   une rangée orpheline.
   ══════════════════════════════════════════════════════════════════════════ */
/* ══════════════════════════════════════════════════════════════════════════
   CLASSEMENT PAR INTERFACE DE RÔLE (et non plus par thème)
   ──────────────────────────────────────────────────────────────────────────
   Le menu était rangé par thème (Apprendre / Le centre / Boutique). Un parent
   qui cherchait le suivi de son enfant devait deviner qu'il était sous
   « Boutique et communauté », à côté des manuels. On range désormais par
   DESTINATAIRE : chacun trouve sa colonne et n'a plus à lire les autres.

   La cinquième colonne « Le centre » n'est pas un quatrième rôle : elle
   regroupe ce qui n'appartient à PERSONNE en particulier (qui nous sommes,
   actualités, contact). La forcer dans un rôle aurait menti sur son public.

   `g:1` = l'entrée exige un compte inscrit quand le mur est ACTIVÉ
   (DB.accessGate.actif, OFF par défaut). Les pages publiques qui ramènent le
   trafic de Google — corrigés, œuvres, niveaux, outils, découvrir, manuels,
   constellation, campus — n'en portent JAMAIS : les murer reviendrait à se
   couper de l'acquisition. Le cadenas affiché ici est une INDICATION de
   lisibilité, pas une sécurité : le vrai contrôle est côté application
   (_gateActif) et côté serveur. Un cadenas absent ne déverrouille rien.
   ══════════════════════════════════════════════════════════════════════════ */
const MENU = [
  { titre: 'Élève', sous: 'Apprendre et réviser', entrees: [
    { t: 'Catalogue e-learning', d: 'Matières, œuvres, séquences', i: 'lc-book',        c: '#1E499B', f: '#DBE8FE', vp: 'elearning', g: 1 },
    { t: 'Corrigés des cahiers', d: 'Accès libre, par séquence',   i: 'lc-checkcircle', c: '#007E11', f: '#E0F5E5', h: 'corriges/' },
    { t: 'Annales corrigées',    d: 'BEPC, Probatoire, BAC, GCE',  i: 'lc-doc',         c: '#5B4FA8', f: '#EAE7F7', h: APP + '#epreuves', g: 1 },
    { t: 'Évaluations en ligne', d: 'Entraînement chronométré',    i: 'lc-clock',       c: '#A84200', f: '#FFF3E4', h: APP + '#evaluations', g: 1 },
    { t: 'Œuvres au programme',  d: 'Analyses et fiches',          i: 'lc-bookopen',    c: '#1E499B', f: '#DBE8FE', h: 'oeuvres/' },
    { t: 'Programmes par classe',d: 'De la 6ᵉ à la Terminale',     i: 'lc-graduation',  c: '#0E7C86', f: '#DDF2F4', h: 'niveaux/' },
    { t: 'Outils gratuits',      d: 'Calculateurs de moyenne',     i: 'lc-calculator',  c: '#007E11', f: '#E0F5E5', h: 'outils/' }
  ]},
  { titre: 'Parent', sous: 'Suivre et soutenir', entrees: [
    { t: 'Résultats aux examens',d: 'Taux de réussite',            i: 'lc-trending',    c: '#007E11', f: '#E0F5E5', h: APP + '#resultats' },
    { t: 'Orientation',          d: 'Choisir sa série',            i: 'lc-compass',     c: '#0E7C86', f: '#DDF2F4', h: APP + '#orientation' },
    { t: 'Matières et coefficients', d: 'Poids réels, orientation',i: 'lc-scale',       c: '#5B4FA8', f: '#EAE7F7', h: 'parcours/' },
    { t: 'Cagnotte de scolarité',d: 'Faire financer son année',    i: 'lc-gift',        c: '#A84200', f: '#FFF3E4', h: APP + '#cagnotte' },
    { t: 'Trophées VÉRITAS',     d: 'Vote gratuit et unique',      i: 'lc-trophy',      c: '#B8860B', f: '#FFF6DA', h: APP + '#trophees' },
    { t: 'Classement junior',    d: 'Le tableau d’honneur',        i: 'lc-award',       c: '#5B4FA8', f: '#EAE7F7', h: APP + '#leaderboard-junior' }
  ]},
  { titre: 'Enseignant', sous: 'Enseigner et publier', entrees: [
    { t: 'Ressources et cours',  d: 'Leçons interactives',         i: 'lc-presentation',c: '#B03A6E', f: '#FBE4EE', h: 'ressources/' },
    { t: 'Corrigés du cahier papier', d: 'La page des QR codes',   i: 'lc-qr',          c: '#1E499B', f: '#DBE8FE', h: 'manuels.html' },
    { t: 'Boutique de manuels',  d: 'Cahiers et études d’œuvres',  i: 'lc-shop',        c: '#A84200', f: '#FFF3E4', vp: 'boutique' },
    { t: 'Abonnements',          d: 'Dès 1 000 FCFA / mois',       i: 'lc-wallet',      c: '#5B4FA8', f: '#EAE7F7', vp: 'tarifs' },
    { t: 'Vérifier un certificat',d: 'Authentifier une distinction',i: 'lc-shield',     c: '#1E499B', f: '#DBE8FE', h: APP + '#verifier-certificat' }
  ]},
  { titre: 'Partenaire', sous: 'Diffuser et représenter', entrees: [
    { t: 'Devenir partenaire',   d: '9 formules, marges revendeur',i: 'lc-users',       c: '#B03A6E', f: '#FBE4EE', h: APP + '#partenariat' },
    { t: 'Nos partenaires',      d: 'Ceux qui nous accompagnent',  i: 'lc-handshake',   c: '#0E7C86', f: '#DDF2F4', h: APP + '#nos-partenaires' },
    { t: 'VÉRITAS Campus',       d: 'Pour les établissements',     i: 'lc-university',  c: '#0C2A6A', f: '#E4E9F2', h: 'campus/' },
    { t: 'Constellation VÉRITAS',d: 'Tout l’écosystème',           i: 'lc-sparkles',    c: '#B03A6E', f: '#FBE4EE', h: 'constellation.html' }
  ]},
  { titre: 'Le centre', sous: 'Nous connaître', entrees: [
    /* ⚠️ PAS `app.html#presentation`. Vérifié dans le code (app.js, vShowSec) et
     en production : cette ancre ne rend pas une page « qui nous sommes », elle
     rend L'ACCUEIL DE L'APPLICATION — pastille de marque, promesse, les quatre
     portes de rôle, vidéo, fil d'actualités. 6 223 caractères de seconde page
     d'accueil. C'est la « deuxième page » que l'on croyait avoir supprimée :
     elle ne revenait pas par le service de `/`, mais par cette entrée de menu.
     La vitrine EST la présentation désormais ; l'entrée pointe donc sur le hub
     éditorial qui présente réellement le centre. */
    { t: 'Présentation',         d: 'Qui nous sommes',             i: 'lc-building',    c: '#1E499B', f: '#DBE8FE', h: 'decouvrir/' },
    { t: 'Actualités',           d: 'Ce qui se passe au centre',   i: 'lc-megaphone',   c: '#A84200', f: '#FFF3E4', h: APP + '#actualites' },
    { t: 'Photos',               d: 'La vie du centre',            i: 'lc-star',        c: '#B03A6E', f: '#FBE4EE', h: APP + '#photos' },
    { t: 'Nous contacter',       d: 'Douala · réponse sous 2 h',   i: 'lc-message',     c: '#1E499B', f: '#DBE8FE', h: APP + '#contact' },
    { t: 'S’inscrire',           d: 'Créer un compte gratuit',     i: 'lc-user',        c: '#A84200', f: '#FFF3E4', h: APP + '#inscription' }
  ]}
];

const ICO_MENU = (id, c) => '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="' + c
  + '" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><use href="#' + id + '"/></svg>';

/* Une entrée = un <a> si elle QUITTE la vitrine, un <button> si elle change
   d'écran ici. La distinction n'est pas cosmétique : un <a> se copie, s'ouvre
   dans un onglet et se donne à Google ; un bouton non. */
function entreeHTML(e) {
  /* Le cadenas n'apparaît QUE si l'entrée est murée. Il est rendu en dur dans
     le HTML plutôt que posé par script : la page doit rester lisible et
     honnête sans JavaScript. `aria-hidden` sur le pictogramme, l'information
     part dans le title — un lecteur d'écran n'annonce pas « cadenas », il
     annonce ce que le cadenas veut dire. */
  const verrou = e.g
    ? '<span class="vmn-l" title="Réservé aux membres inscrits">'
      + '<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" aria-hidden="true">'
      + '<rect x="4" y="11" width="16" height="10" rx="2"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/></svg>'
      + '<span class="vsr">Réservé aux membres inscrits</span></span>'
    : '';
  const dedans = '<span class="vmn-p" style="background:' + e.f + '">' + ICO_MENU(e.i, e.c) + '</span>'
    + '<span class="vmn-x">' + esc(e.t) + '<small>' + esc(e.d) + '</small></span>' + verrou;
  return e.vp
    ? '<button type="button" class="vmn-i" onclick="VRT.act(\'pl__aller\',this,event)" data-go="' + e.vp + '">' + dedans + '</button>'
    : '<a class="vmn-i" href="' + e.h + '">' + dedans + '</a>';
}

{
  const colonnes = MENU.map(g =>
    '<div class="vmn-col"><p class="vmn-t">' + esc(g.titre) + (g.sous ? '<small>' + esc(g.sous) + '</small>' : '') + '</p>'
    + g.entrees.map(entreeHTML).join('') + '</div>').join('');

  /* On remplace le CONTENU du panneau, pas le panneau : vitrine.js pilote
     #vrtPlus par son identifiant et le pont de survol CSS le cible par
     `*:has(> #vrtPlus)`. Changer la balise casserait les deux. */
  const deb = corps.indexOf('<div id="vrtPlus"');
  if (deb < 0) throw new Error('Panneau #vrtPlus introuvable — la maquette a changé.');
  const ouv = corps.indexOf('>', deb);
  let prof = 0, fin = -1;
  for (let k = ouv + 1; k < corps.length; k++) {
    if (corps.startsWith('<div', k)) prof++;
    else if (corps.startsWith('</div>', k)) { if (prof === 0) { fin = k; break; } prof--; }
  }
  if (fin < 0) throw new Error('Panneau #vrtPlus non refermé — maquette inattendue.');
  corps = corps.slice(0, deb)
    + '<div id="vrtPlus" class="vmn" hidden role="menu" aria-label="Toutes les rubriques">' + colonnes + '</div>'
    + corps.slice(fin + '</div>'.length);

  /* Menu mobile : les mêmes entrées, en une colonne, à la suite des raccourcis
     existants. Sous 1000 px le panneau de bureau n'est jamais montré — sans
     cet ajout, tout ce qui précède serait invisible sur téléphone, c'est-à-dire
     pour la majorité du public. */
  const dbB = corps.indexOf('<div id="vrtBurger"');
  if (dbB < 0) throw new Error('Menu mobile #vrtBurger introuvable — la maquette a changé.');
  const ouvB = corps.indexOf('>', dbB);
  let profB = 0, finB = -1;
  for (let k = ouvB + 1; k < corps.length; k++) {
    if (corps.startsWith('<div', k)) profB++;
    else if (corps.startsWith('</div>', k)) { if (profB === 0) { finB = k; break; } profB--; }
  }
  if (finB < 0) throw new Error('Menu mobile #vrtBurger non refermé — maquette inattendue.');
  const suite = '<div class="vmn vmn-mob">' + MENU.map(g =>
    '<div class="vmn-col"><p class="vmn-t">' + esc(g.titre) + (g.sous ? '<small>' + esc(g.sous) + '</small>' : '') + '</p>'
    + g.entrees.map(entreeHTML).join('') + '</div>').join('') + '</div>';
  corps = corps.slice(0, finB) + suite + corps.slice(finB);

  console.log('menu Plus   : ' + MENU.reduce((n, g) => n + g.entrees.length, 0)
    + ' entrées en ' + MENU.length + ' groupes (bureau + mobile)');
}

/* ══════════════════════════════════════════════════════════════════════════
   CORRECTION 2 ter — L'ACCUEIL SE RÉPÉTAIT, ET S'OUVRAIT SUR LES CAHIERS
   ──────────────────────────────────────────────────────────────────────────
   Compté sur la page livrée, pas estimé : les QUATRE mêmes chiffres
   (3 854 exercices · 56 pages libres · 134 titres · 7 niveaux) étaient
   affichés TROIS fois — dans le bandeau d'accroche, dans le second bandeau,
   puis dans une frise dédiée. La ressource offerte était proposée trois fois
   elle aussi. Et une section « Ils travaillent avec le centre » montrait au
   visiteur trois cartouches portant « témoignage à recueillir » : on affichait
   nos emplacements vides. La règle du produit est pourtant tenue partout
   ailleurs — pas de données, pas de bloc.

   L'ordre posait un second problème : après l'accroche, la page enchaînait
   sur les corrigés des cahiers. Le cahier est UN produit ; les publics du
   centre sont quatre — élèves, parents, enseignants, partenaires. Le bloc des
   publics remonte donc juste après l'accroche, et il gagne sa quatrième
   porte : les partenaires n'étaient joignables qu'au bas de la page.
   ══════════════════════════════════════════════════════════════════════════ */
function decouperSections(html) {
  const out = [];
  let i = 0;
  while ((i = html.indexOf('<section', i)) >= 0) {
    const j = html.indexOf('>', i);
    let prof = 0, fin = -1;
    for (let k = j + 1; k < html.length; k++) {
      if (html.startsWith('<section', k)) prof++;
      else if (html.startsWith('</section>', k)) {
        if (prof === 0) { fin = k + '</section>'.length; break; }
        prof--;
      }
    }
    if (fin >= 0) out.push({ deb: i, fin, html: html.slice(i, fin) });
    i = i + 1;   // ⚠️ +1 et non `fin` : voir la note sur les sections imbriquées
  }
  return out;
}

/* Repérage par CONTENU, jamais par position : une section insérée en amont
   décalerait tous les indices sans que rien ne le signale. Chaque opération
   exige UNE correspondance et une seule — zéro ou deux, on arrête tout. */
function sectionUnique(marqueur, quoi) {
  const s = decouperSections(corps)
    .filter(x => x.html.includes(marqueur))
    .sort((a, b) => a.html.length - b.html.length);
  if (s.length && s[0].html.length > 60 * 1024) {
    throw new Error('Accueil - ' + quoi + ' : la plus petite section trouvee fait '
      + (s[0].html.length / 1024).toFixed(0) + ' Ko : c\'est un ecran, pas un bloc. Preciser le repere.');
  }
  if (s.length < 1) {
    throw new Error('Accueil — ' + quoi + ' : ' + s.length + ' section(s) contiennent « '
      + marqueur + ' ». La maquette a changé, vérifier AVANT de déployer.');
  }
  return s[0];
}
function supprimerSection(marqueur, quoi) {
  const s = sectionUnique(marqueur, quoi);
  corps = corps.slice(0, s.deb) + corps.slice(s.fin);
  console.log('accueil     : − ' + quoi + ' (' + (s.html.length / 1024).toFixed(1) + ' Ko)');
}
function deplacerSectionApres(marqueur, marqueurCible, quoi) {
  const s = sectionUnique(marqueur, quoi);
  const bloc = s.html;
  corps = corps.slice(0, s.deb) + corps.slice(s.fin);
  const cible = sectionUnique(marqueurCible, quoi + ' (destination)');
  corps = corps.slice(0, cible.fin) + bloc + corps.slice(cible.fin);
  console.log('accueil     : ↑ ' + quoi);
}

supprimerSection('niveaux couverts',
  'frise de chiffres (3ᵉ répétition de 3 854 / 56 / 134 / 7)');
supprimerSection('Prenez une ressource, gratuitement, maintenant',
  'appel « ressource offerte » (déjà dans l’accroche et à l’étape 2)');
supprimerSection('Emplacements réservés',
  'témoignages vides (« témoignage à recueillir » × 3)');

/* ── CHIFFRES INVENTÉS : la règle du produit ne souffre pas d'exception ────
   « Série de 12 jours », « Niveau 7 · 780/1 000 XP », « Terminale A4 ·
   Douala — 2 480 pts », « Abonnement le plus choisi : Pro » : rien de tout
   cela n'est calculé, ni calculable. Ce sont des valeurs de maquette, et
   elles se présentaient au visiteur comme l'activité réelle du centre.
   La règle tenue partout ailleurs sur ce produit — les anneaux de réussite
   vides pour le GCE faute de donnée, les témoignages non affichés faute
   d'avis — l'interdit. Les jeux et les quiz existent, eux : ils restent
   annoncés dans « Tout ce dont l'élève a besoin », qui ne prétend rien
   chiffrer. Le jour où un vrai classement sera calculé, la section pourra
   revenir avec ses données. */
/* La section revient — c'est la condition posée juste au-dessus : « le jour où
   un vrai classement sera calculé ». Il l'est désormais (api/public_data.php,
   vrt_pd_classement), agrégé par classe, borné à la semaine, et VIDE tant
   qu'aucun score n'existe.

   On ne restaure pas les chiffres pour autant : ils étaient faux, ils le
   restent. La colonne de gauche — titre, promesse, pastilles, appel à l'action
   — n'affirme aucune donnée et revient telle quelle. Les deux cartes de droite
   sont neutralisées : la série et les XP d'un visiteur anonyme n'existent pas
   (il n'a pas de compte), et le podium est vidé puis confié à #vrtPodium, que
   vitrine.js masque tant que le serveur ne renvoie rien.

   Résultat : le panneau stimule à nouveau, sans rien prétendre. */
(function restaurerGamification(){
  const s = sectionUnique('Série de 12 jours', 'panneau de gamification');
  let bloc = s.html;

  // 1. Progression personnelle : aucun visiteur anonyme n'a de série ni de XP.
  bloc = bloc.replace('Série de 12 jours', 'Ta série de révision')
             .replace('Ne casse pas la chaîne', 'Elle démarre à ton premier quiz')
             .replace('+240 XP', 'À gagner')
             .replace('Niveau 7 · Grammaire', 'Ta progression')
             .replace('780 / 1 000 XP', 'dès le 1ᵉʳ quiz');

  // 2. Jauge de progression ramenée à zéro : une barre remplie aux trois
  //    quarts est une affirmation chiffrée comme une autre.
  bloc = bloc.replace(/(<div[^>]*style="[^"]*)width:\s*7[0-9](?:\.\d+)?%/i, '$1width:0%');

  // 3. Podium : on retire les trois lignes inventées et on laisse le conteneur,
  //    que vitrine.js remplira — ou masquera.
  /*  Les rangs ne sont pas des <li> mais des <div> imbriqués : on remonte donc
      depuis chaque « N NNN pts » jusqu'au <div> qui ouvre sa ligne, et on
      retire la ligne entière. Découper au premier <div> venu emporterait la
      carte complète — d'où le comptage de profondeur. */
  let garde = 0;
  while (/\d[\s  ]?\d{3}\s*pts/.test(bloc) && garde++ < 12) {
    const m = bloc.match(/\d[\s  ]?\d{3}\s*pts/);
    const pos = m.index;
    let deb = -1, prof = 0;
    for (let k = pos; k >= 0; k--) {
      if (bloc.startsWith('</div>', k)) prof++;
      else if (bloc.startsWith('<div', k)) { if (prof === 0) { deb = k; break; } prof--; }
    }
    if (deb < 0) break;
    let p = 0, fin = -1;
    for (let k = bloc.indexOf('>', deb) + 1; k < bloc.length; k++) {
      if (bloc.startsWith('<div', k)) p++;
      else if (bloc.startsWith('</div>', k)) { if (p === 0) { fin = k + 6; break; } p--; }
    }
    if (fin < 0) break;
    bloc = bloc.slice(0, deb) + bloc.slice(fin);
  }
  if (/\d[\s  ]?\d{3}\s*pts/.test(bloc)) {
    throw new Error('Podium : un score inventé subsiste après nettoyage — refus de construire.');
  }

  // Le conteneur porte l'identifiant ET l'attribut hidden : sans JavaScript, ou
  // si le serveur ne répond pas, rien de faux ne s'affiche.
  bloc = bloc.replace('Battle de la semaine',
    'Battle de la semaine</b><small style="display:block;font:400 12px Poppins,sans-serif;color:#6E7385">Le classement s\'affiche dès les premiers points</small><b style="display:none">');

  const cle = 'Battle de la semaine';
  const iCarte = bloc.indexOf(cle);
  if (iCarte > 0) {
    // Remonter jusqu'au <div> ouvrant de la carte pour l'envelopper d'un id.
    const avant = bloc.lastIndexOf('<div', iCarte);
    if (avant > 0) {
      /* On enveloppe EXACTEMENT la carte, en cherchant sa balise fermante par
         comptage de profondeur. Envelopper « du début de la carte jusqu'à la
         fin du bloc » paraissait équivalent : ça ne l'est pas. Cette queue
         contient les fermetures des DIV ancêtres, donc plus de </div> que de
         <div> — le navigateur refermait #vrtPodium bien avant la fin, et la
         liste atterrissait DEHORS. Mesuré : olDansPodium=false, podium allumé
         mais vide.

         La liste est vide à la construction, et c'est voulu : vitrine.js la
         remplit depuis public_data.php, ou laisse le conteneur masqué. */
      let prof2 = 0, finCarte = -1;
      for (let k = bloc.indexOf('>', avant) + 1; k < bloc.length; k++) {
        if (bloc.startsWith('<div', k)) prof2++;
        else if (bloc.startsWith('</div>', k)) { if (prof2 === 0) { finCarte = k; break; } prof2--; }
      }
      if (finCarte < 0) throw new Error('Podium : carte non refermée — maquette inattendue.');
      bloc = bloc.slice(0, avant)
           + '<div id="vrtPodium" hidden>'
           + bloc.slice(avant, finCarte)
           + '<ol class="vpod-list"></ol>'
           + '</div></div>'
           + bloc.slice(finCarte + '</div>'.length);
    }
  }

  corps = corps.slice(0, s.deb) + bloc + corps.slice(s.fin);
  console.log('accueil     : ↺ panneau « Apprendre en jouant » restauré (chiffres neutralisés, podium branché)');
})();
supprimerSection('Palmarès de la semaine',
  'palmarès hebdomadaire (« manuel à la une », « abonnement le plus choisi » : non calculés)');

/* ── DEUX ACCROCHES POUR UNE PAGE ──────────────────────────────────────────
   La page ouvrait sur « Réussir son année avec les vrais programmes
   camerounais » (titre, promesse de prix, deux appels à l'action), puis
   recommençait 30 Ko plus bas avec « Cette année, ton enfant comprend
   enfin… » — même promesse, mêmes chiffres, deux appels à l'action de plus.
   Deux fois la même page d'accueil dans la même page d'accueil. */
supprimerSection('Rentrée 2026 · le centre ouvre ses portes',
  'seconde accroche (doublon du bandeau d’ouverture)');

/* ── LE CAHIER, TROIS FOIS ─────────────────────────────────────────────────
   « Les corrigés de ma classe », puis la carte « Cours par séquence » de
   « Tout ce dont l'élève a besoin », puis une section entière « Séquence par
   séquence, comme au tableau ». Trois fois la même promesse au même
   visiteur. On garde les deux premières — l'une est gratuite et sert
   d'entrée, l'autre situe le cours dans l'ensemble de l'offre. */
supprimerSection('Séquence par séquence, comme au tableau',
  'section « le programme, pas un résumé » (3ᵉ énoncé de l’offre cahiers)');

/* ── LES PARTENAIRES, DEUX FOIS ────────────────────────────────────────────
   Depuis que le bloc des publics porte une carte « Partenaires » — avec ses
   quatre promesses et son lien vers les neuf formules —, la section
   « Travailler avec VÉRITAS » du bas de page dit exactement la même chose,
   aux mêmes personnes, avec les mêmes destinations. La carte est en haut,
   dans le bloc qui structure la page ; la section est en bas, après tout le
   reste. C'est la carte qui reste. */
/* ══════════════════════════════════════════════════════════════════════════
   LES DEUX PHOTOGRAPHIES DE L'ACCUEIL — REMISES, SANS LEURS PANNEAUX
   ────────────────────────────────────────────────────────────────────────────
   La coupe de « Séquence par séquence, comme au tableau » (3ᵉ énoncé de l'offre
   cahiers, voir plus haut) a emporté avec elle la SECTION ENTIÈRE des blocs
   alternés — donc les deux seules photographies de la page : la séance de cours
   et l'élève au travail. Les fichiers sont restés déployés
   (assets/photo-classe.webp, assets/photo-eleve.webp) et n'étaient plus
   référencés nulle part : une page d'accueil sans un seul visage.

   Demande de Jacques : « insère les photos et non les anciens panneaux
   supprimés. » Elles reviennent donc SEULES, en bande, juste après « Un centre
   à Douala, une plateforme dans sa poche » — dont elles illustrent exactement
   les deux moitiés, et dont les libellés ci-dessous ne font que reprendre les
   mots. Aucun chiffre, aucun témoignage, rien qui demande à être vérifié : les
   panneaux supprimés ne reviennent pas par la fenêtre.
   ══════════════════════════════════════════════════════════════════════════ */
{
  const s = sectionUnique('Un centre à Douala', 'photos de l’accueil (ancrage)');
  const photo = (fichier, alt, libelle, position, duree) =>
      '<figure class="vphoto">'
    +   '<img src="assets/' + fichier + '" alt="' + alt + '" loading="lazy" decoding="async"'
    +        ' style="object-position:' + position + ';animation-duration:' + duree + '">'
    +   '<figcaption><span>' + libelle + '</span></figcaption>'
    + '</figure>';
  const bande = '\n    <!-- LES DEUX PHOTOS -->\n'
    + '    <section class="vphotos" aria-label="Le centre et la plateforme en images">\n'
    + '      <div class="vphotos-in">\n'
    + '        ' + photo('photo-classe.webp', 'Séance de cours au Centre VÉRITAS',
                        'Au centre, à Douala', '50% 45%', '24s') + '\n'
    + '        ' + photo('photo-eleve.webp', 'Élève travaillant avec la plateforme VÉRITAS',
                        'Sur la plateforme, partout', '50% 30%', '28s') + '\n'
    + '      </div>\n'
    + '    </section>\n';
  corps = corps.slice(0, s.fin) + bande + corps.slice(s.fin);
  console.log('accueil     : + les 2 photos (photo-classe, photo-eleve) après « Un centre à Douala »');
}

supprimerSection('Neuf programmes de partenariat',
  'section « Travailler avec VÉRITAS » (doublon de la carte Partenaires)');
deplacerSectionApres("Trois portes d'entrée", 'Un répétiteur coûte',
  'bloc des publics remonté juste après l’accroche');

/* ── QUATRIÈME PUBLIC : LES PARTENAIRES ────────────────────────────────────
   Le centre s'adresse à quatre publics — élèves, parents, enseignants,
   partenaires. Les trois premiers avaient leur onglet dans la barre et leur
   carte dans le bloc d'entrée ; les partenaires n'avaient ni l'un ni l'autre,
   alors qu'ils portent neuf programmes et une part du chiffre d'affaires. Ils
   n'étaient joignables qu'au bas de l'accueil, après quinze sections.

   La carte est CLONÉE sur celle des enseignants plutôt que réécrite : même
   structure, mêmes classes de survol, même géométrie. Une carte écrite à la
   main aurait dérivé au premier remaniement de la maquette. On ne substitue
   que ce qui distingue le public — photo, teinte, textes, destination. */
{
  const REPERE = 'grid-template-columns:repeat(3,1fr);gap:22px;align-items:stretch';
  const ig = corps.indexOf(REPERE);
  if (ig < 0) throw new Error('Bloc des publics : grille à trois colonnes introuvable.');
  const debG = corps.lastIndexOf('<div', ig);
  let prof = 0, finG = -1;
  for (let k = corps.indexOf('>', ig) + 1; k < corps.length; k++) {
    if (corps.startsWith('<div', k)) prof++;
    else if (corps.startsWith('</div>', k)) { if (prof === 0) { finG = k + 6; break; } prof--; }
  }
  if (finG < 0) throw new Error('Bloc des publics : grille non refermée.');
  const grille = corps.slice(debG, finG);

  // Cartes de premier niveau, dans l'ordre : Élèves, Parents, Enseignants.
  const dedans = grille.slice(grille.indexOf('>') + 1, grille.length - 6);
  const cartes = [];
  let p = 0, d = -1;
  for (let k = 0; k < dedans.length; k++) {
    if (dedans.startsWith('<div', k)) { if (p === 0) d = k; p++; }
    else if (dedans.startsWith('</div>', k)) { p--; if (p === 0) cartes.push({ d, f: k + 6 }); }
  }
  if (cartes.length !== 3) throw new Error('Bloc des publics : ' + cartes.length + ' cartes au lieu de 3.');

  const modele = dedans.slice(cartes[2].d, cartes[2].f);
  const remplacer = (s, de, vers, quoi) => {
    if (!s.includes(de)) throw new Error('Carte Partenaires : « ' + quoi + ' » introuvable dans le modèle.');
    return s.split(de).join(vers);
  };
  let carte = modele;
  /* L'extension dépend de l'ordre des corrections : la conversion en WebP
     passe APRÈS ce bloc, la maquette porte donc encore des .png ici. On
     accepte les deux plutôt que de dépendre d'un ordre d'exécution. */
  if (!/assets\/photo-enseignant\.(png|webp)/.test(carte)) {
    throw new Error('Carte Partenaires : photo du modèle introuvable.');
  }
  carte = carte.replace(/assets\/photo-enseignant\.(png|webp)/g, 'assets/photo-groupe.$1');
  carte = remplacer(carte, 'Enseignant encadrant des élèves', 'Partenaires et libraires du réseau VÉRITAS', 'aria-label');
  carte = remplacer(carte, '#lc-presentation', '#lc-handshake', 'picto');
  carte = remplacer(carte, '#C9508B', '#A84200', 'teinte claire');
  carte = remplacer(carte, '#8E2B57', '#8A3700', 'teinte sombre');
  carte = remplacer(carte, '#B03A6E', '#A84200', 'teinte d’accent');
  carte = remplacer(carte, '>Enseignants<', '>Partenaires<', 'titre');
  carte = remplacer(carte, 'Publiez vos corrigés sous votre nom et encadrez les candidats aux examens.',
    'Libraires, inspecteurs, influenceurs, établissements : neuf façons de porter VÉRITAS et d’en vivre.', 'accroche');
  carte = remplacer(carte, 'Votre savoir, signé et payé', 'Votre réseau, votre revenu', 'sur-titre');
  carte = remplacer(carte, 'Rédiger des corrigés rémunérés', 'Revendre les cahiers avec une marge', 'puce 1');
  carte = remplacer(carte, 'Animer des classes virtuelles', 'Commission sur chaque abonnement apporté', 'puce 2');
  carte = remplacer(carte, 'Composer des épreuves blanches', 'Équiper un établissement avec Campus', 'puce 3');
  carte = remplacer(carte, 'Suivre ses élèves en année d’examen', 'Formations rémunérées et kit de campagne', 'puce 4');
  carte = remplacer(carte, 'Sur candidature', '9 formules', 'mention');
  /* La destination sort de la vitrine : un <a>, pas un bouton. Les neuf
     programmes vivent dans l'application, il n'existe pas d'écran partenaire
     ici — et un lien se copie, s'ouvre dans un onglet et s'indexe. */
  carte = carte.replace(
    /<button type="button" onclick="VRT\.act\('u__aller',this,event\)" data-go="enseignants"([^>]*)>Rejoindre le réseau/,
    '<a href="' + APP + '#partenariat"$1>Voir les 9 formules');
  /* ⚠️ FERMER LE LIEN — et le vérifier, pas l'espérer.
     La version précédente visait /<\/button>\s*<\/div>\s*<\/div>\s*$/ : un
     motif ancré en FIN de chaîne qui ne correspondait pas à la structure
     réelle (il reste un <div> de plus après). Le remplacement échouait donc en
     silence, et l'ouvrant <a> partait sans fermeture.

     Conséquence observée en production : tout ce qui SUIT ce bouton — le
     bandeau des matières, le bloc calendrier, les sections suivantes — se
     retrouvait AVALÉ par le lien, et héritait de son fond orange #A84200.
     Une page où un tiers du contenu est un seul lien géant.

     La garde qui suivait ne voyait rien : elle cherchait le texte d'origine
     (« Rejoindre le réseau »), qui avait bel et bien disparu. Elle vérifiait
     la moitié faite du travail. On ferme donc le PREMIER </button> qui suit le
     lien converti, et on vérifie l'ÉQUILIBRE. */
  const posLien = carte.indexOf('<a href="' + APP + '#partenariat"');
  if (posLien < 0) throw new Error('Carte Partenaires : lien converti introuvable.');
  const posFin = carte.indexOf('</button>', posLien);
  if (posFin < 0) throw new Error('Carte Partenaires : aucun </button> à convertir après le lien.');
  carte = carte.slice(0, posFin) + '</a>' + carte.slice(posFin + '</button>'.length);

  if (carte.includes('Rejoindre le réseau') || carte.includes('data-go="enseignants"')) {
    throw new Error('Carte Partenaires : le bouton d’appel n’a pas été converti en lien.');
  }
  {
    const o = (carte.match(/<a\b/g) || []).length, c = (carte.match(/<\/a>/g) || []).length;
    const bo = (carte.match(/<button\b/g) || []).length, bc = (carte.match(/<\/button>/g) || []).length;
    if (o !== c || bo !== bc) {
      throw new Error('Carte Partenaires : balises déséquilibrées (<a> ' + o + '/' + c
        + ', <button> ' + bo + '/' + bc + ') — le lien avalerait le reste de la page.');
    }
  }

  const grilleNeuve = grille
    .replace(REPERE, 'grid-template-columns:repeat(4,1fr);gap:18px;align-items:stretch')
    .slice(0, grille.indexOf('>') + 1 + cartes[2].f) + carte
    + grille.slice(grille.indexOf('>') + 1 + cartes[2].f);
  corps = corps.slice(0, debG) + grilleNeuve + corps.slice(finG);

  // Les intitulés annonçaient trois portes : ils en annoncent quatre.
  corps = corps.split("Trois portes d'entrée").join('Quatre publics, quatre portes');
  corps = corps.split("Trois raisons de s'y mettre ce soir plutôt que la veille de l'examen")
               .join('Élèves, parents, enseignants, partenaires : chacun son espace');
  console.log('accueil     : + carte « Partenaires » (4ᵉ public) et intitulés accordés');
}

/* ── Barre de navigation : le quatrième public y entre aussi ───────────────
   Élèves, Parents, Enseignants… et rien pour les partenaires, alors que la
   barre est le seul repère permanent de la page. */
{
  const btnEns = corps.match(/<button type="button" onclick="VRT\.act\('goEnseignants',this,event\)"[^>]*>Enseignants<\/button>/);
  if (!btnEns) throw new Error('Barre de navigation : bouton « Enseignants » introuvable.');
  const lien = btnEns[0]
    .replace('<button type="button"', '<a')
    .replace(/ onclick="[^"]*"/, '')
    .replace(' data-go="enseignants"', ' href="' + APP + '#partenariat"')
    .replace('>Enseignants</button>', ';text-decoration:none>Partenaires</a>')
    .replace('white-space:nowrap;transition:color .18s,border-color .18s;text-decoration:none',
             'white-space:nowrap;text-decoration:none;transition:color .18s,border-color .18s');
  corps = corps.replace(btnEns[0], btnEns[0] + lien);
  console.log('barre       : + onglet « Partenaires »');
}

/* ══════════════════════════════════════════════════════════════════════════
   CORRECTION 2 quinquies — ON NE DÉNIGRE PAS UN SERVICE QU'ON REND
   ──────────────────────────────────────────────────────────────────────────
   La maquette vendait la plateforme CONTRE les répétiteurs : « Un répétiteur
   coûte 25 000 F par mois et rate des séances », « Moins cher qu'un
   répétiteur », « 25× moins qu'un répétiteur ». Or le centre PROPOSE les
   répétitions et l'accompagnement à domicile — c'est même une entrée de son
   propre menu (« Répétitions »). On dépréciait donc, en page d'accueil, une
   prestation qu'un parent peut commander dans la page suivante.

   Le comparatif est remplacé par ce qui est vrai et vendeur des deux côtés :
   la plateforme est ouverte à toute heure pour 1 000 F, et le répétiteur se
   déplace quand l'élève a besoin de quelqu'un à côté de lui. Deux offres qui
   se complètent, pas une qui écrase l'autre.
   ══════════════════════════════════════════════════════════════════════════ */
{
  const RETOUCHES = [
    ['Un répétiteur coûte 25 000 F par mois et rate des séances. VÉRITAS coûte 1 000 F, ouvre à toute heure et couvre la 6',
     'La plateforme ouvre à toute heure pour 1 000 F par mois et couvre la 6',
     'accroche du bandeau'],
    ['Moins cher qu’un répétiteur', 'Le suivi, sans quitter la maison', 'sur-titre de la carte Parents'],
    ['33 F par jour — 25× moins qu’un répétiteur', '33 F par jour, et un répétiteur à domicile en option',
     'mention de prix']
  ];
  let faites = 0;
  for (const [de, vers, quoi] of RETOUCHES) {
    if (!corps.includes(de)) { console.warn('⚠ répétitions : « ' + quoi + ' » introuvable — déjà corrigé ou maquette changée.'); continue; }
    corps = corps.split(de).join(vers);
    faites++;
  }
  console.log('répétitions : ' + faites + '/' + RETOUCHES.length + ' formulations dénigrantes remplacées');
}

/* ── CORRECTION 2 quater : la loupe doit annoncer ce qu'elle fait ──────────
   Elle est désormais branchée sur /corriges/ (voir ANCRES). Son intitulé
   accessible disait « Rechercher » tout court : un lecteur d'écran annonçait
   une recherche de site qui n'existe pas. On nomme la destination réelle. */
{
  const avant = corps;
  corps = corps.replace(/aria-label="Rechercher"/g,
                        'aria-label="Rechercher dans tout le site" title="Rechercher dans tout le site"');
  if (corps === avant) console.warn('⚠ loupe : intitulé « Rechercher » introuvable — vérifier la maquette.');
}

/* ── CORRECTION 2 ter : le partage Facebook pointait un domaine inexistant ──
   La maquette partageait « veritas-centre.cm/passage-du-jour » : ce domaine
   n'est pas le nôtre (veritas-school.com) et cette page n'existe nulle part.
   Chaque partage Facebook produisait donc un lien mort — sur un site dont
   l'acquisition passe en grande partie par le partage. */
{
  const avant = corps;
  corps = corps.replace(/https%3A%2F%2Fveritas-centre\.cm%2Fpassage-du-jour/g,
                        encodeURIComponent(SITE + '/'));
  corps = corps.replace(/https:\/\/veritas-centre\.cm/g, SITE);
  if (corps === avant) console.warn('⚠ partage : veritas-centre.cm introuvable — déjà corrigé ou maquette changée.');
}

/* ── CORRECTION 2 quater : pas de lecteur vidéo sans vidéo ─────────────────
   La maquette place un <video src="assets/temoignage.mp4"> sur l'accueil. Ce
   fichier n'existe pas dans le dépôt (le MP4 livré n'a jamais été identifié
   ni validé) : le visiteur voyait un cadre noir avec des commandes inertes,
   et le serveur répondait 404. Règle déjà tenue ailleurs sur ce produit — pas
   de données, pas de bloc : la section entière est retirée tant que le
   fichier est absent, et revient d'elle-même le jour où il est déposé. */
{
  const VIDEO = path.join(process.cwd(), 'assets', 'temoignage.mp4');
  if (!fs.existsSync(VIDEO)) {
    const marque = '<!-- TÉMOIGNAGE VIDÉO -->';
    const i = corps.indexOf(marque);
    if (i < 0) {
      console.warn('⚠ témoignage vidéo : repère introuvable — le lecteur 404 est peut-être encore là.');
    } else {
      const fin = corps.indexOf('</section>', i);
      if (fin < 0) throw new Error('Section témoignage vidéo non refermée — maquette inattendue.');
      corps = corps.slice(0, i) + corps.slice(fin + '</section>'.length);
      console.log('vidéo       : assets/temoignage.mp4 absent → section témoignage retirée');
    }
  }
}

/* ── Le bandeau défilant des matières, contraint à l'écran ─────────────────
   Mesuré à 375 px : le lien qui enveloppe la piste s'étalait sur 4 083 px, sa
   fenêtre de découpe sur 2 419. Rien ne se voyait — les ancêtres clipsent —
   mais scrollWidth valait 4 083 pour un écran de 375, et la piste défilait
   dans le vide. On pose la classe ici ; la feuille fait le reste. */
{
  let n = 0;
  corps = corps.replace(/(<div style="background:#0C2A6A;overflow:hidden;padding:14px 0[^"]*")/g,
    (m) => { n++; return m.replace('<div ', '<div class="vmarq" '); });
  if (n !== 1) console.warn('⚠ bandeau défilant : ' + n + ' conteneur(s) contraint(s) au lieu de 1.');
  else console.log('bandeau     : piste défilante contrainte à la largeur de l\'écran');
}

/* ── TITRES BICOLORES ──────────────────────────────────────────────────────
   Les grands titres sortaient de la maquette en une seule encre (#001136).
   À 27 px sur fond clair, cela donne un bandeau uniforme que l'œil saute. On
   alterne l'encre profonde et le bleu de marque : la SECONDE moitié du titre
   passe en #1E499B.

   Trois précautions, parce qu'un titre est ce que Google lit en premier :
     · la coupure se fait ICI, à la construction — jamais au JavaScript. Un
       titre découpé côté client serait indexé en morceaux ;
     · elle tombe sur une FRONTIÈRE DE MOT, au plus près du milieu, jamais au
       milieu d'un mot ;
     · un titre de moins de trois mots est laissé tel quel : couper « Nos
       résultats » en deux couleurs ne crée pas un rythme, seulement du bruit.
   Le texte du titre est intégralement conservé — on n'ajoute que deux
   <span>, donc aucun caractère ne disparaît (vérifié par le compteur). */
{
  let faits = 0, laisses = 0;
  corps = corps.replace(/(<h2 style="font:600 2[0-9](?:\.\d)?px[^"]*")>([^<]{6,120})<\/h2>/g,
    (m, ouvre, texte) => {
      // Un titre déjà écrit en encre CLAIRE (color:#fff) est posé sur un fond
      // SOMBRE. Le bicolore le repeindrait en #001136 + #1E499B — deux encres
      // sombres, donc INVISIBLES sur ce fond. Bug vu en production : les
      // bandeaux « Le compte parent ne coûte rien » et « Chaque semaine sans
      // réviser… » avaient leur titre effacé. On les laisse en une seule encre.
      if (/color:\s*#fff(f{3})?\b|color:\s*white\b/i.test(ouvre)) { laisses++; return m; }
      const mots = texte.trim().split(/\s+/);
      if (mots.length < 3) { laisses++; return m; }
      // Coupure au mot dont la position est la plus proche du milieu.
      let cible = Math.round(texte.length / 2), pos = 0, coupe = 1, ecart = 1e9;
      for (let i = 0; i < mots.length - 1; i++) {
        pos += mots[i].length + 1;
        const e = Math.abs(pos - cible);
        if (e < ecart) { ecart = e; coupe = i + 1; }
      }
      const a = mots.slice(0, coupe).join(' '), b = mots.slice(coupe).join(' ');
      // L'encre d'accent TOURNE d'un titre a l'autre. Toutes les secondes
      // moities partageaient le meme bleu : sur une page qui aligne une
      // quinzaine de grands titres, un accent que l'on retrouve partout
      // n'accentue plus rien. Quatre encres de la charte se succedent, donc
      // deux titres voisins n'ont jamais la meme. La rotation suit l'ORDRE
      // D'APPARITION dans le document : elle est donc stable d'un build a
      // l'autre tant que la maquette ne bouge pas.
      const encre = 'vt-b' + ((faits % 4) + 1);
      faits++;
      return ouvre + '><span class="vt-a">' + a + '</span> <span class="vt-b ' + encre + '">' + b + '</span></h2>';
    });
  console.log('titres      : ' + faits + ' bicolores, ' + laisses + ' laissés d\'une seule encre (trop courts)');
}

/* ── Les anneaux de résultats deviennent animables ─────────────────────────
   Le générateur vient d'écrire les trois variables (--vr-cible, --vr-teinte,
   --vr-creux) dans l'attribut style. Il reste à poser la prise pour le script
   et pour la feuille : une classe. On ne la met QUE sur les pastilles qui
   portent réellement un conic-gradient — le motif est assez précis pour ne
   désigner qu'elles, et le compteur alerte si la maquette change. */
{
  let n = 0;
  corps = corps.replace(/<span style="(position:relative;width:132px[^"]*conic-gradient[^"]*)"/g,
    (m, st) => { n++; return '<span class="vring" style="' + st + '"'; });
  if (n === 0) console.warn('⚠ anneaux : aucune pastille de résultat trouvée — animation inactive.');
  else console.log('anneaux     : ' + n + ' pastilles rendues animables');

  // La carte qui contient l'anneau reçoit sa propre classe (survol + halo).
  let c = 0;
  corps = corps.replace(/<div data-reveal style="(background:#fff;border:1px solid #E4E7EF;border-radius:16px;padding:28px 24px;text-align:center[^"]*)" class="([^"]*)"/g,
    (m, st, cls) => { c++; return '<div data-reveal style="' + st + '" class="' + cls + ' vres-carte"'; });
  if (c) console.log('résultats   : ' + c + ' cartes reliées au survol');
}

// ── CORRECTION 3 : images en WebP ──────────────────────────────────────────
// Les neuf photos livrées en PNG pesaient 5,99 Mo à elles seules — dont
// 1,75 Mo pour la seule image du bandeau. Rien de tout cela n'est du dessin
// au trait : ce sont des photos, que le PNG encode très mal. Même définition,
// même rendu, 598 Ko au total. Le logo reste en PNG : il sert aussi de favicon.
corps = corps.replace(/(assets\/(?!veritas-logo)[a-z0-9-]+)\.png/g, '$1.webp');

// ── CORRECTION 3 bis : dimensions intrinsèques et chargement différé ───────
// Mesuré le 27/08/2026 au premier chargement : CLS 0,399 pour un seuil « bon »
// à 0,10. UNE SEULE image sur quinze portait un couple width/height — le
// navigateur ne pouvait donc réserver aucune place avant l'arrivée du fichier,
// et le contenu sautait sous les doigts du lecteur. Au rechargement, tout en
// cache, le CLS retombe à 0 : c'est donc précisément le PREMIER visiteur,
// celui qu'on paie pour faire venir, qui encaissait le défaut.
//
// Les dimensions sont LUES DANS LES FICHIERS, jamais recopiées à la main :
// une valeur écrite en dur se désynchronise dès qu'on remplace une photo, et
// une mauvaise proportion déforme l'image au lieu de la caler.
// Douze photos sur quinze sont par ailleurs sous la ligne de flottaison et
// étaient chargées en priorité normale ; seule celle du bandeau ne doit PAS
// être différée — c'est l'élément LCP.
{
  const dimsDe = (fichier) => {
    const p = path.join(__dirname, '..', fichier);
    if (!fs.existsSync(p)) return null;
    const d = fs.readFileSync(p);
    if (d.length > 24 && d.slice(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a])))
      return { w: d.readUInt32BE(16), h: d.readUInt32BE(20) };          // PNG
    if (d.length > 30 && d.slice(0, 4).toString() === 'RIFF' && d.slice(8, 12).toString() === 'WEBP') {
      const t = d.slice(12, 16).toString();
      if (t === 'VP8 ') return { w: d.readUInt16LE(26) & 0x3fff, h: d.readUInt16LE(28) & 0x3fff };
      if (t === 'VP8L') { const b = d.readUInt32LE(21); return { w: (b & 0x3fff) + 1, h: ((b >> 14) & 0x3fff) + 1 }; }
      if (t === 'VP8X') return { w: d.readUIntLE(24, 3) + 1, h: d.readUIntLE(27, 3) + 1 };
    }
    return null;
  };

  let posees = 0, differees = 0, introuvables = [];
  let rang = 0;
  corps = corps.replace(/<img\b[^>]*>/g, (tag) => {
    const src = (tag.match(/src="([^"]+)"/) || [])[1];
    // Les gabarits ré-étendus côté client ({{ m.couv }}) portent déjà leurs
    // dimensions, écrites dans la maquette : on ne peut pas les mesurer ici.
    if (!src || src.includes('{{')) return tag;
    rang++;
    let out = tag;
    if (!/\bwidth=/.test(out) && !/\bheight=/.test(out)) {
      const d = dimsDe(src);
      if (d) { out = out.replace(/^<img\b/, `<img width="${d.w}" height="${d.h}"`); posees++; }
      else introuvables.push(src);
    }
    // Le bandeau est le premier <img> du document et l'élément LCP probable :
    // le différer retarderait exactement ce qu'on cherche à accélérer.
    if (!/\bloading=/.test(out)) {
      if (rang <= 2) out = out.replace(/^<img\b/, '<img fetchpriority="high" decoding="async"');
      else { out = out.replace(/^<img\b/, '<img loading="lazy" decoding="async"'); differees++; }
    }
    return out;
  });
  if (introuvables.length) {
    throw new Error('Images introuvables sur le disque, dimensions impossibles à poser : '
      + [...new Set(introuvables)].join(', ') + '. Une image manquante ici serait aussi une image manquante en production.');
  }
  console.log('images      : ' + posees + ' couples width/height posés · ' + differees + ' différées');
}

/* Ce rapport criait au loup : il comptait comme « sans destination » les
   références au sprite SVG (<use href="#lc-…">, #pay-…, #du-…, #brand-…) et
   les ancres qui désignent un ÉCRAN de la vitrine (#tarifs, #boutique…),
   lesquelles fonctionnent depuis que vitrine.js écoute hashchange. Résultat :
   vingt-trois « anomalies » à chaque construction, dont zéro vraie — donc un
   rapport que plus personne ne lit. On ne signale que ce qui est réellement
   mort. */
/* ── Un lien sortant s'ouvre à côté, pas à la place ────────────────────────
   « Écrire sur WhatsApp » était le seul lien externe de la vitrine sans
   target : le visiteur quittait le site pour de bon, et son fil de lecture
   avec. Les trois liens de PARTAGE l'avaient déjà — celui du contact non,
   parce qu'il ne vient pas du même endroit de la maquette (il est posé par la
   table ANCRES, qui ne fabrique qu'une adresse).
   rel="noopener" va avec : sans lui, la page ouverte garde une prise sur la
   nôtre via window.opener. */
{
  let ouverts = 0;
  corps = corps.replace(/<a\s([^>]*href="https?:\/\/[^"]+"[^>]*)>/g, (tout, attrs) => {
    if (/target=/.test(attrs)) return tout;
    if (/href="https?:\/\/(www\.)?veritas-school\.com/.test(attrs)) return tout;  // chez nous
    ouverts++;
    return '<a ' + attrs + ' target="_blank" rel="noopener">';
  });
  if (ouverts) console.log('liens sortants : ' + ouverts + ' ouvert(s) dans un nouvel onglet (+ rel=noopener)');
}

/* Garde-fou : « #detail » ne désigne AUCUN écran. S'il en reste un, c'est
   qu'une carte a échappé à la table — on refuse de livrer le lien mort. */
if (corps.indexOf('href="#detail"') >= 0) {
  throw new Error('Un href="#detail" a survécu au branchement des cartes « Découvrir » : '
    + 'aucun écran ne porte data-vp="detail", le clic ne ferait rien.');
}
{
  const vides = (corps.match(/href=""[^>]*>Découvrir/g) || []).length;
  if (vides) {
    throw new Error(vides + ' lien(s) « Découvrir » sans adresse. Un titre de carte a changé '
      + 'dans la maquette sans entrée correspondante dans DEST_SERVICES.');
  }
}

const ancresRestantes = (function () {
  const idsSprite = new Set([...(sprite.match(/<symbol id="([^"]+)"/g) || [])]
    .map(s => s.replace(/.*id="/, '').replace(/"$/, '')));
  return [...new Set((corps.match(/href="#([a-zA-Z0-9-]+)"/g) || []))]
    .map(h => h.slice(7, -1))
    .filter(id => !idsSprite.has(id))                       // pictogramme du sprite
    .filter(id => !PAGES.includes(id))                      // écran de la vitrine
    .map(id => '#' + id);
})();

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
const D = { onglets: [], services: [], filtres: [], manuels: [], moyensPaiement: [], champsPaiement: [], optionsLivraison: [], partages: {}, scal: {} };
const clean = o => JSON.parse(JSON.stringify(o, (k, v) => typeof v === 'function' ? undefined : v));

/* Le NOMBRE d'onglets appartient à la maquette : on le lit, on ne le fige pas.
   Il était écrit « t <= 4 » en dur. La maquette en propose CINQ — ses variantes
   de cartes sont indexées 1 à 5 — et la cinquième, « Répétitions », n'a donc
   jamais été extraite : l'onglet s'affichait, le clic vidait la zone.
   Ce sont pourtant de vraies prestations du centre (répétitions au centre et à
   domicile, rattrapage, préparation aux examens), avec leurs tarifs. Un chiffre
   en dur dans un transpileur est une hypothèse sur des données qu'on ne
   contrôle pas ; ici elle était fausse et silencieuse. */
const NB_ONGLETS = (function () {
  const v = valsFor({ page: 'accueil', tab: 1 });
  const n = (v.onglets || []).length;
  if (!n) throw new Error('Onglets introuvables dans la maquette — extraction impossible.');
  return n;
})();
for (let t = 1; t <= NB_ONGLETS; t++) {
  const v = valsFor({ page: 'accueil', tab: t });
  if (!v.services || !v.services.length) {
    throw new Error('Onglet ' + t + ' (' + ((v.onglets || [])[t - 1] || {}).nom
      + ') : aucune carte. Un onglet qui vide la zone au clic ne doit pas partir en production.');
  }
  D.onglets.push(clean(v.onglets));
  /* Passe 2 — le GABARIT. Ces cartes-là sont reconstruites au clic sur un
     onglet : sans destination dans la donnée, elles repartiraient avec le
     « #detail » de la maquette, c'est-à-dire nulle part. Une carte inconnue
     de la table arrête la construction : mieux vaut ne pas déployer qu'un
     bouton « Découvrir » qui ne découvre rien. */
  D.services.push(clean(v.services).map(c => {
    const cible = DEST_SERVICES[String(c.titre || '').trim()];
    if (!cible) {
      throw new Error('Carte de service « ' + c.titre + ' » sans destination. '
        + 'Ajouter une entrée dans DEST_SERVICES — sinon son « Découvrir » est mort.');
    }
    c.dest = cible;
    return c;
  }));
}
/* Le nombre de filtres appartient au CATALOGUE, pas a ce fichier : il vaut
   « toutes les categories reellement portees par un titre, plus Tout le
   catalogue ». Ecrit en dur (« i < 7 »), il aurait fige sept pastilles pour
   quatre categories reelles — et l'ajout d'un manuel de mathematiques demain
   n'aurait rien change a l'ecran. Meme lecon que NB_ONGLETS ci-dessus. */
const NB_FILTRES = (function () {
  const n = (valsFor({ page: 'boutique', filtre: 0 }).filtres || []).length;
  if (!n) throw new Error('Filtres de boutique introuvables — extraction impossible.');
  return n;
})();
for (let i = 0; i < NB_FILTRES; i++) {
  const v = valsFor({ page: 'boutique', filtre: i });
  D.filtres.push(clean(v.filtres));
  D.manuels.push(clean(v.manuels));
  D.scal['filtre' + i] = { nbManuels: v.nbManuels };
  if (i > 0 && (!v.manuels || !v.manuels.length)) {
    throw new Error('Filtre « ' + (v.filtres[i] || {}).nom + ' » : aucun titre. '
      + 'Une pastille qui ne peut rien montrer ne doit pas partir en production.');
  }
}
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

/* ══════════════════════════════════════════════════════════════════════════
   LE TUNNEL DEMANDAIT UN NUMÉRO DE CARTE — ET NE L'ENVOYAIT NULLE PART
   ──────────────────────────────────────────────────────────────────────────
   Trois défauts, du plus grave au plus sournois :

   1. « Numéro de carte » et « Cryptogramme » étaient de vrais <input> sur une
      page qui n'est pas certifiée pour cela. Un visiteur y SAISIT son numéro
      de carte et son cryptogramme. Nous n'avons ni le droit ni le besoin de
      les recevoir : CamerPay est une passerelle par REDIRECTION, la carte se
      saisit sur SA page. Ces champs, en plus d'être une faute, obligeaient à
      tout retaper une fois arrivé chez le prestataire.
   2. Aucun champ ne portait d'identifiant : rien n'était lisible, donc rien
      n'était envoyé. Un paiement partait avec un nom et un téléphone VIDES —
      de l'argent encaissé sans savoir de qui.
   3. On facturait 1 000 ou 2 500 F de livraison sans jamais demander OÙ
      livrer. Le champ d'adresse n'apparaît que si une livraison est choisie.

   Les libellés du prestataire sont réécrits en conséquence : promettre « vos
   données de carte transitent chiffrées » sur un formulaire qui n'en demande
   plus serait un mensonge de plus, dans l'autre sens.
   ══════════════════════════════════════════════════════════════════════════ */
{
  const NOM = { champ: 'vpNom', label: 'Nom et prénom', exemple: 'NGO BELL Marie',
                ico: '#lc-user', colonne: 'span 2', auto: 'name', type: 'text' };
  const TEL = { champ: 'vpTel', label: 'Numéro Mobile Money', exemple: '6 XX XX XX XX',
                ico: '#lc-smartphone', colonne: 'span 1', auto: 'tel', type: 'tel' };
  const TEL2 = { champ: 'vpTel2', label: 'Confirmer le numéro', exemple: '6 XX XX XX XX',
                 ico: '#lc-checkcircle', colonne: 'span 1', auto: 'tel', type: 'tel' };
  const TELC = { champ: 'vpTel', label: 'Téléphone', exemple: '6 XX XX XX XX',
                 ico: '#lc-smartphone', colonne: 'span 1', auto: 'tel', type: 'tel' };
  const MAIL = { champ: 'vpMail', label: 'Adresse e-mail (pour le reçu)', exemple: 'marie@exemple.cm',
                 ico: '#lc-mail', colonne: 'span 1', auto: 'email', type: 'email' };
  // Mobile Money (0 = MTN, 1 = Orange) · Carte (2) et PayPal (3) : même trio.
  D.champsPaiement = [[NOM, TEL, TEL2], [NOM, TEL, TEL2], [NOM, TELC, MAIL], [NOM, TELC, MAIL]];
  // Ajouté par le client quand la livraison n'est pas un retrait au centre.
  D.champLivraison = [{ champ: 'vpAdr', label: 'Adresse de livraison', ico: '#lc-mappin',
                        exemple: 'Quartier, rue, point de repère', colonne: 'span 2',
                        auto: 'street-address', type: 'text' }];

  /* Le domaine fantôme se cachait AUSSI dans les données ─────────────────
     La correction du corps ne suffisait pas : les boutons de partage sont
     une région dynamique, leurs URLs vivent donc dans VRT_DATA et sont
     ré-étendues par le client. Vérifié en production après déploiement — le
     corps était propre, le partage Facebook renvoyait toujours vers
     veritas-centre.cm/passage-du-jour, un domaine qui n'est pas le nôtre et
     une page qui n'existe pas. Contrôle : on relit le JSON sérialisé, pas
     seulement le HTML. */
  {
    const avant = JSON.stringify(D.partages);
    const propre = avant
      .replace(/https%3A%2F%2Fveritas-centre\.cm%2Fpassage-du-jour/g, encodeURIComponent(SITE + '/'))
      .replace(/https:\\?\/\\?\/veritas-centre\.cm/g, SITE);
    D.partages = JSON.parse(propre);
    if (avant !== propre) console.log('partage     : domaine veritas-centre.cm corrigé dans les données');
  }

  const REDIR = 'Vous serez redirigé vers la page sécurisée de notre prestataire pour régler. '
              + 'Aucune donnée bancaire n’est saisie ni conservée sur ce site.';
  D.scal.moyen2 = { titreFormulaire: 'Vos coordonnées', noteSecurite: REDIR, libellePayer: 'Payer par carte' };
  D.scal.moyen3 = { titreFormulaire: 'Vos coordonnées', noteSecurite: REDIR, libellePayer: 'Payer avec PayPal' };

  /* Le gabarit rendait un <input> sans identifiant, sans type et sans valeur :
     impossible à relire, impossible à repeupler après un re-rendu. On le
     qualifie ici, une fois, pour les quatre variantes. */
  const g = gabarits.champsPaiement;
  if (!g || !/<input type="text"/.test(g.tpl)) {
    throw new Error('Tunnel : gabarit des champs de paiement introuvable ou déjà modifié.');
  }
  g.tpl = g.tpl.replace('<input type="text"',
    '<input id="{{ cp.champ }}" name="{{ cp.champ }}" type="{{ cp.type }}" autocomplete="{{ cp.auto }}" value="{{ cp.valeur }}"');
  console.log('tunnel      : champs carte/CVV retirés, nom + téléphone + adresse identifiés');
}

/* ── BANDE UTILITAIRE RETIRÉE (demande Jacques, 14/08/2026) ────────────────
   La même bande existait en DEUX exemplaires : dans la coquille applicative et
   ici, dans la maquette. Retirer celle de l'application ne changeait donc rien
   à ce que voit un visiteur qui arrive sur « / ».

   Ses quatre mentions sont toutes reprises ailleurs, à l'écran, en même temps :
     · « Centre d'Excellence Scolaire — Douala » → sous la marque, dans la barre
       immédiatement en dessous ;
     · « Programme MINESEC · 6ᵉ à Terminale » → la pastille de l'accroche, qui
       dit « Programme MINESEC · général, technique & GCE » trois centimètres
       plus bas ;
     · « WhatsApp · réponse sous 2 h » → le bouton flottant, sur toutes les
       pages, et le bloc contact ;
     · « Mon compte » → le bouton Connexion de la barre principale.
   Sur un téléphone, elle se repliait sur trois lignes : une centaine de pixels
   du premier écran — le plus cher de tout le site — pour ne rien apprendre. */
{
  const d = corps.indexOf('<!-- BANDE UTILITAIRE -->');
  const f = corps.indexOf('<!-- BARRE PRINCIPALE -->', d);
  if (d < 0 || f < 0) {
    console.warn('⚠ bande utilitaire : marqueurs introuvables — la maquette a changé.');
  } else {
    corps = corps.slice(0, d) + corps.slice(f);
    console.log('bande util. : retirée de la vitrine (' + (f - d) + ' octets, 4 mentions redondantes)');
  }
}

/* ── Fermetures orphelines héritées de la maquette ─────────────────────────
   L'export de l'outil de design sort avec 7 <ul> pour 8 </ul> : une fermeture
   sans ouverture, juste après la carte du plan Élite. Le navigateur l'ignore,
   donc rien ne se voyait — mais elle empêche tout contrôle d'équilibre sérieux,
   et un contrôle qu'on doit désactiver ne protège plus de rien. On la retire
   ici plutôt que dans la maquette : le fichier livré n'est pas à nous, et il
   peut être remplacé par une nouvelle version à tout moment. */
/* ── Résidus de gabarit : les directives non développées ───────────────────
   La maquette pilote ses répétitions par <sc-for> et ses conditions par
   <sc-if>. Le transpileur les développe… sauf trois fermetures, qui partaient
   telles quelles dans la page livrée : 1 </sc-for> et 2 </sc-if>, sans balise
   ouvrante correspondante. Ce sont des éléments inconnus du navigateur, donc
   des fermetures qu'il ignore — mais elles n'ont rien à faire dans un document
   servi, elles brouillent toute lecture de la structure, et c'est en les
   croisant qu'on perd du temps à chercher un défaut de nesting ailleurs. */
{
  const avant = corps.length;
  corps = corps.replace(/<\/?(sc-for|sc-if|sc-else|x-dc)\b[^>]*>/g, '');
  if (avant !== corps.length) {
    console.log('maquette    : directives <sc-*> résiduelles retirées (' + (avant - corps.length) + ' octets)');
  }
}

/* ⚠️ `div` a été ESSAYÉ dans cette liste, puis retiré. Retirer deux </div>
   « orphelins » rééquilibrait bien le compte global, mais déplaçait
   l'imbrication : les écrans suivants changeaient de niveau, et le défaut
   visé — « Questions fréquentes » affiché sur tous les écrans — restait
   intact. Un compte équilibré ne dit rien de l'arborescence réelle. Le vrai
   correctif est plus bas : on rattache la section orpheline à son écran. */
for (const bal of ['ul', 'ol', 'li']) {
  const re = new RegExp('<' + bal + '\\b|</' + bal + '>', 'g');
  let m, prof = 0, orphelines = [];
  while ((m = re.exec(corps))) {
    if (m[0][1] === '/') { prof--; if (prof < 0) { orphelines.push(m.index); prof = 0; } }
    else prof++;
  }
  // On retire par la fin, pour que les positions restent valides.
  for (let k = orphelines.length - 1; k >= 0; k--) {
    corps = corps.slice(0, orphelines[k]) + corps.slice(orphelines[k] + bal.length + 3);
  }
  if (orphelines.length) console.log('maquette    : ' + orphelines.length + ' </' + bal + '> orpheline(s) retirée(s)');
}

/* ── LE PIED DE PAGE N'ÉTAIT PAS EN DERNIER ────────────────────────────────
   Signalé par Jacques : « quand je clique sur commander un livre, ceci vient
   s'afficher au début » — un grand vide et les mentions légales, à la place du
   tunnel. Puis, quand j'ai cru que c'était le défilement : « chez moi ça
   s'affiche AVANT et non après ». Il avait raison, et c'était la bonne piste.

   Mesuré dans le navigateur : le pied de page est à 289 px, l'écran du tunnel
   à 1 725 px — `paiementEstAPRESLePied: true`. L'écran s'affichait bien, mais
   SOUS le pied de page. Rien à voir avec le défilement : un problème d'ordre
   dans le document, hérité du déséquilibre de <div> de la maquette, qui laisse
   la dernière section s'échapper du conteneur principal.

   On ne rafistole pas l'imbrication — déjà essayé pour la FAQ, ça déplace les
   écrans sans rien régler. On DÉPLACE le pied de page à la fin du corps, où il
   doit être de toute façon. Un seul mouvement, et tous les écrans qui auraient
   pu s'échapper repassent devant lui. */
{
  const d = corps.indexOf('<footer');
  if (d < 0) {
    console.warn('⚠ pied de page : <footer> introuvable — placement non vérifié.');
  } else {
    const f = corps.indexOf('</footer>', d);
    if (f < 0) {
      console.warn('⚠ pied de page : </footer> introuvable — déplacement annulé.');
    } else {
      const fin = f + '</footer>'.length;
      const pied = corps.slice(d, fin);
      const reste = corps.slice(0, d) + corps.slice(fin);
      // Y avait-il vraiment quelque chose après lui ? Sinon, ne rien toucher.
      const apres = corps.slice(fin).trim();
      if (apres === '') {
        console.log('pied de page: déjà en dernier — rien à déplacer');
      } else {
        corps = reste.replace(/\s*$/, '') + '\n' + pied + '\n';
        const ecransApres = (apres.match(/<section data-vp="/g) || []).length;
        console.log('pied de page: déplacé en fin de corps (' + ecransApres
          + ' écran(s) se trouvai(en)t derrière lui)');
      }
    }
  }
}

/* ── Contrôle : autant de jeux de cartes que d'onglets ─────────────────────
   Le déséquilibre a déjà coûté un onglet muet en production (« Répétitions »,
   cinq onglets pour quatre jeux extraits). L'extraction est maintenant pilotée
   par la maquette ; ce contrôle vérifie qu'elle a bien tout pris. */
{
  const nOng = (D.onglets && D.onglets[0] ? D.onglets[0].length : 0);
  const nSrv = (D.services || []).length;
  if (nOng !== nSrv) {
    throw new Error('Onglets : ' + nOng + ' intitulé(s) pour ' + nSrv
      + ' jeu(x) de cartes. Un onglet sans contenu vide la zone au clic — construction ANNULÉE.');
  }
  console.log('onglets     : ' + nOng + ' onglets, ' + nSrv + ' jeux de cartes — appariés');
}

/* ── LA FAQ APPARTENAIT À TOUS LES ÉCRANS, DONC À AUCUN ────────────────────
   Signalé par Jacques : « Questions fréquentes » s'affichait dans e-learning.
   Mesuré dans le navigateur — la chaîne d'ancêtres du titre est `h2 < div <
   section < body` : sa section est un FRÈRE des écrans, pas un enfant. Le
   dernier enfant réel de l'écran des abonnements est le paragraphe « Le plan
   Pro… » : l'écran se referme juste après, et tout ce qui suit devient
   visible en permanence.

   On ne redresse pas l'imbrication de la maquette — essayé, ça déplace les
   écrans suivants sans rien régler. On DÉCLARE simplement l'appartenance :
   `aller()` montre et masque TOUTES les balises portant le data-vp demandé,
   donc une seconde section marquée « tarifs » suit exactement le sort de
   l'écran des abonnements. Deux lignes, aucun déplacement de balise. */
{
  const q = corps.indexOf('Questions fréquentes');
  if (q < 0) {
    console.warn('⚠ FAQ : titre introuvable — la maquette a changé.');
  } else {
    const d = corps.lastIndexOf('<section', q);
    if (d < 0 || corps.slice(d, q).includes('data-vp')) {
      console.warn('⚠ FAQ : section déjà rattachée ou introuvable — rien à faire.');
    } else {
      corps = corps.slice(0, d) + '<section data-vp="tarifs" hidden' + corps.slice(d + '<section'.length);
      console.log('faq         : section rattachee a l ecran des abonnements');
    }
  }
}

/* ── ÉQUILIBRE DES BALISES — le contrôle qui manquait ──────────────────────
   Un <a> laissé ouvert ne casse rien de visible : le navigateur referme tout
   seul, très loin, et le reste de la page devient un lien géant qui prend la
   couleur du bouton. Aucune erreur, aucun avertissement — on ne le voit qu'en
   remarquant un aplat orange sous un bloc qui n'en demandait pas.
   Vécu le 14/08/2026 : le bouton « Voir les 9 formules » avalait le bandeau
   des matières ET le bloc calendrier. On refuse désormais de produire ça. */
{
  const paires = [['a', /<a\b/g, /<\/a>/g], ['button', /<button\b/g, /<\/button>/g],
                  ['section', /<section\b/g, /<\/section>/g], ['ul', /<ul\b/g, /<\/ul>/g]];
  /* `div` est SURVEILLÉ mais n'ANNULE PAS la construction. La maquette sort avec
     deux </div> de trop — un défaut de son export, pas du nôtre. Les retirer
     rééquilibre le compte mais DÉPLACE l'imbrication : les écrans suivants
     changent de niveau et le défaut visé reste intact. Essayé, mesuré, abandonné
     au profit du rattachement de section plus haut.
     Un avertissement documente l'écart connu ; une erreur bloquerait tout
     déploiement pour un défaut qu'on a choisi de contourner autrement. */
  {
    const o = (corps.match(/<div\b/g) || []).length;
    const c = (corps.match(/<\/div>/g) || []).length;
    if (o !== c) {
      console.warn('⚠ <div> : ' + o + ' ouvrant(s) pour ' + c + ' fermant(s) — écart connu de la maquette, non bloquant.');
    }
  }
  const fautes = [];
  for (const [nom, ro, rc] of paires) {
    const o = (corps.match(ro) || []).length, c = (corps.match(rc) || []).length;
    if (o !== c) fautes.push('<' + nom + '> ' + o + ' ouvrant(s) pour ' + c + ' fermant(s)');
  }
  if (fautes.length) {
    throw new Error('Balises déséquilibrées dans le corps : ' + fautes.join(' · ')
      + '. Une balise ouverte avale tout ce qui suit — construction ANNULÉE.');
  }
  console.log('balises     : <a>, <button>, <section> et <ul> équilibrés');
}

/* ══════════════════════════════════════════════════════════════════════════
   FENTES PILOTÉES PAR LE PANNEAU ADMIN — data-vrt-pub
   ──────────────────────────────────────────────────────────────────────────
   assets/vitrine.js sait depuis longtemps remplir n'importe quel élément
   portant data-vrt-pub="chemin.dans.la.reponse" avec la valeur servie par
   api/public_data.php — et api/public_data.php sert publicInfo EN ENTIER,
   donc tous les champs du panneau « Portail visiteur ».

   Il n'y avait AUCUNE fente dans la maquette. Compté, pas supposé :
   `grep -c data-vrt-pub vitrine.html` rendait 0. Le mécanisme était écrit,
   fonctionnel, et branché sur rien. Jacques modifiait les horaires ou
   l'adresse dans l'administration, enregistrait, et l'accueil ne bougeait pas
   — sans erreur, sans message, sans moyen de comprendre.

   On équipe donc les valeurs qui CHANGENT dans la vie d'un centre. Le texte
   pré-rendu reste la valeur par défaut : sans JavaScript, hors ligne, ou si
   l'API ne répond pas, la page reste juste et indexable. La fente ne fait que
   RECOUVRIR quand l'administration a posé quelque chose.

   Chaque ancre est obligatoire : si la maquette change et qu'un motif ne se
   retrouve plus, la construction ÉCHOUE. Une fente silencieusement perdue
   ramènerait exactement le bug qu'on corrige ici.
   ══════════════════════════════════════════════════════════════════════════ */
{
  const FENTES = [
    // [ chemin public_data, texte pré-rendu à équiper, à quoi ça sert ]
    ['publicInfo.horaires', 'Lundi → samedi, 8 h – 19 h', 'horaires d’ouverture'],
    ['publicInfo.adresse',  'Centre VÉRITAS, Douala',     'adresse du centre'],
  ];

  for (const [chemin, texte, quoi] of FENTES) {
    // On vise le <b> qui PORTE ce texte, pas le texte nu : poser l'attribut sur
    // un nœud de texte est impossible, et remplacer la chaîne seule casserait
    // la mise en page.
    const motif = new RegExp('(<b\\b[^>]*)(>' + texte.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '</b>)');
    if (!motif.test(corps)) {
      throw new Error('Fente « ' + chemin + ' » (' + quoi + ') : le texte « ' + texte
        + ' » est introuvable dans la maquette. Il a changé — mettez à jour ce motif, '
        + 'sinon l’administration ne pilotera plus ce champ SANS que rien ne le signale.');
    }
    corps = corps.replace(motif, '$1 data-vrt-pub="' + chemin + '"$2');
  }

  const posees = (corps.match(/data-vrt-pub="/g) || []).length;
  if (posees !== FENTES.length) {
    throw new Error('Fentes : ' + posees + ' posée(s) pour ' + FENTES.length + ' attendue(s).');
  }
  console.log('fentes admin: ' + posees + ' (' + FENTES.map(f => f[0]).join(', ') + ')');
}

/* ══════════════════════════════════════════════════════════════════════════
   LES TROIS BOUTONS FLOTTANTS — une famille, pas trois accidents
   ──────────────────────────────────────────────────────────────────────────
   « Les icônes sont grossières et pas esthétiques » (Jacques, 25/08/2026).
   Ce n'est pas qu'une affaire de goût : trois défauts se mesurent.

   1. DEUX FAMILLES DE FORMES. Les utilitaires font 50 px de côté pour 16 px
      de rayon (ratio 0,32) ; le bouton Ambassa 62 pour 18 (ratio 0,29). Deux
      squircles proches mais différents, empilés verticalement : l'œil lit un
      défaut d'alignement sans savoir le nommer.
   2. ANNEAU NON CONCENTRIQUE. La pastille pulsée d'Ambassa est posée en
      `inset:-5px` avec le MÊME rayon que le bouton. Un contour décalé vers
      l'extérieur doit voir son rayon augmenter d'autant pour rester parallèle :
      à rayon égal, les quatre coins se pincent. C'est ce pincement qu'on lit
      comme « grossier ».
   3. TRAITS TROP ÉPAIS. `stroke-width:2` sur un pictogramme de 22 px donne un
      rapport trait/taille de 1/11, là où les jeux d'icônes soignés tiennent
      1/14 à 1/16. D'où des symboles lourds et un peu baveux.

   Correction : le cercle. Il supprime la question du rayon (donc les deux
   défauts géométriques d'un coup), et c'est la forme attendue d'un groupe
   d'actions flottantes. On ajoute ce qui manquait pour qu'ils se détachent du
   contenu au lieu d'y être collés : un filet d'un pixel, une ombre à deux
   niveaux (contact + portée), et un flou d'arrière-plan. Les couleurs de
   marque ne bougent pas.
   ══════════════════════════════════════════════════════════════════════════ */
{
  const RETOUCHES = [
    // [ ce qu'on cherche, ce qu'on pose, à quoi ça sert ]
    ['width:50px;height:50px;border-radius:16px;border:1px solid transparent;background:#FAFBFE;',
     'width:46px;height:46px;border-radius:50%;border:1px solid rgba(12,42,106,.10);'
     + 'background:rgba(255,255,255,.94);-webkit-backdrop-filter:blur(10px);backdrop-filter:blur(10px);',
     'utilitaires (thème, traducteur) : ronds, filet + flou'],

    ['box-shadow:0 6px 16px rgba(0,17,54,.06);transition:transform .18s,box-shadow .18s,color .18s',
     'box-shadow:0 1px 2px rgba(0,17,54,.07),0 8px 22px rgba(0,17,54,.10);'
     + 'transition:transform .18s,box-shadow .18s,color .18s',
     'ombre à deux niveaux (contact + portée)'],

    ['width:62px;height:62px;border-radius:18px;border:0;background:linear-gradient(135deg,#7C6BD6,#5B4FA8);',
     'width:58px;height:58px;border-radius:50%;border:0;background:linear-gradient(150deg,#8272DD,#5B4FA8);',
     'Ambassa : rond, dégradé adouci'],

    ['box-shadow:0 12px 30px rgba(91,79,168,.44)',
     'box-shadow:0 2px 4px rgba(91,79,168,.20),0 12px 28px rgba(91,79,168,.30)',
     'Ambassa : ombre allégée'],

    ['position:absolute;inset:-5px;border-radius:18px;border:2px solid rgba(124,107,214,.4)',
     'position:absolute;inset:-5px;border-radius:50%;border:1.5px solid rgba(124,107,214,.38)',
     'anneau pulsé : enfin concentrique'],
  ];

  for (const [de, vers, quoi] of RETOUCHES) {
    if (!corps.includes(de)) {
      throw new Error('Boutons flottants — « ' + quoi +' » : le style attendu est introuvable. '
        + 'La maquette a changé : mettez ce motif à jour, sinon la retouche saute en silence '
        + 'et les boutons repartent tels quels.');
    }
    corps = corps.split(de).join(vers);
  }

  /* Les traits : 2 px, c'était le rapport trait/taille qui alourdissait tout.
     On ne touche qu'aux pictogrammes DE CES boutons, repérés par leur taille —
     le reste de la page garde ses réglages. */
  let traits = 0;
  corps = corps.replace(/width="(22|27)" height="\1" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"/g,
    (m, t) => { traits++; return m.replace('stroke-width="2"', 'stroke-width="1.7"')
                            .replace('width="' + t + '" height="' + t + '"',
                                     t === '22' ? 'width="21" height="21"' : 'width="25" height="25"'); });
  console.log('boutons flot: ' + RETOUCHES.length + ' retouches · ' + traits + ' pictogramme(s) affiné(s)');
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
/* ── Blocs écrits par nous, hors maquette ───────────────────────
   Calendrier scolaire, actualités, titres bicolores et animations. Dans un
   fichier à part (tools/vitrine-bloc.css) parce qu'ils n'appartiennent pas à
   la maquette : celle-ci sort en styles EN LIGNE, ce qui impose des
   !important partout ; nos blocs s'écrivent en classes, normalement.
   L'ancien CSS du tableau comparatif a disparu avec le tableau. */
${fs.readFileSync(path.join(__dirname, 'vitrine-bloc.css'), 'utf8')}

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

/* ── Menu « Plus » : toutes les rubriques ──────────────────────────────────
   Le panneau d'origine tenait quatre entrées dans 236 px. Il en porte
   maintenant vingt-sept, groupées : il faut des colonnes, sinon la liste
   dépasse l'écran et on perd ce qu'on venait de gagner.

   Largeurs choisies pour que le panneau NE SOIT JAMAIS coupé. Il est ancré
   sur le bouton « Plus », qui se trouve autour du tiers gauche de la barre :
   trois colonnes de 218 px (≈ 690 px) tiennent à partir de 1200 px de
   fenêtre, deux colonnes en dessous. Sous 1000 px le panneau n'est plus
   affiché du tout — c'est le menu mobile qui prend le relais, et il reçoit
   les mêmes entrées. */
/* MÉGA-MENU PLEINE LARGEUR (v1.19.31). Barre fixée SOUS l'en-tête, fond
   pleine largeur (technique du padding-inline : le bloc s'étend d'un bord à
   l'autre, le CONTENU reste centré à 1160 px). Trois colonnes ÉGALES qui
   s'étalent sur toute la largeur — plus de panneau étroit ancré à gauche, plus
   de descriptions tronquées.

   Ancrage : #vrtNav porte un backdrop-filter, qui fait de lui le BLOC CONTENANT
   des descendants position:fixed. « top:100% » = exactement le bas du nav, et
   s'ajuste tout seul quand le nav se compacte au défilement — aucun JS requis.
   Repli @supports pour les rares navigateurs sans backdrop-filter (le bloc
   contenant redevient alors le viewport, où le nav commence à 0 → 76 px). */
.vmn{position:fixed;left:0;right:0;top:100%;
  background:#fff;border-top:1px solid #EEF1F7;border-bottom:1px solid #E1E6F0;
  box-shadow:0 26px 52px rgba(12,28,74,.16);z-index:59;
  padding:24px max(24px,calc((100vw - 1160px)/2)) 30px;
  display:grid;grid-template-columns:repeat(5,minmax(0,1fr));gap:2px 30px;
  max-height:min(80vh,540px);overflow-y:auto;overscroll-behavior:contain;
  animation:vmnDown .26s cubic-bezier(.22,1,.36,1)}
@supports not ((backdrop-filter:blur(1px)) or (-webkit-backdrop-filter:blur(1px))){ .vmn{top:76px} }
/* Cinq colonnes de rôle tiennent au-delà de 1240 px. En dessous on passe à
   trois puis à deux : une colonne de rôle écrasée sous ~200 px coupe les
   libellés (« Matières et coefficients »), et un menu illisible ne range
   rien. Le classement par rôle survit à chaque palier — seul le nombre de
   colonnes change, jamais l'ordre des groupes. */
@media (max-width:1239.98px){ .vmn{grid-template-columns:repeat(3,minmax(0,1fr))} }
@media (max-width:1023.98px){ .vmn{grid-template-columns:repeat(2,minmax(0,1fr));gap:2px 30px;padding-left:24px;padding-right:24px} }
@keyframes vmnDown{from{opacity:0;transform:translateY(-10px)}to{opacity:1;transform:none}}
.vmn-col{display:flex;flex-direction:column;gap:1px;min-width:0}
.vmn-t{margin:8px 0 6px;padding:0 12px 6px;font:700 11px Poppins,sans-serif;
  letter-spacing:1px;text-transform:uppercase;color:#5B4FA8;border-bottom:1px solid #F0F2F8}
/* Le sous-titre dit à qui la colonne s'adresse, en minuscules et sans
   interlettrage : il se lit comme une phrase, pas comme une deuxième
   étiquette qui concurrencerait le nom du rôle. */
.vmn-t small{display:block;margin-top:3px;font:400 11px Poppins,sans-serif;
  letter-spacing:0;text-transform:none;color:#8A8FA3}
/* Bandeau d'annonces piloté par l'admin (« Portail visiteur → Bandeau
   défilant »). Inséré par vitrine.js seulement s'il y a un message : pas de
   barre vide. Navy plein plutôt qu'un jaune d'alerte — c'est une information
   du centre, pas un avertissement, et l'accueil est déjà clair. */
/* Podium du panneau « Apprendre en jouant ». Rempli par vitrine.js depuis les
   scores réels ; le conteneur reste masqué tant qu'il n'y en a aucun. */
.vpod-list{list-style:none;margin:12px 0 0;padding:0;display:flex;flex-direction:column;gap:7px}
.vpod-l{display:flex;align-items:center;gap:11px;padding:10px 13px;border-radius:12px;
  background:#F7F9FD;font:500 14px Poppins,sans-serif;color:#12203F}
.vpod-l:first-child{background:#FFF8E6}
.vpod-r{flex:0 0 auto;width:25px;height:25px;border-radius:50%;color:#fff;
  display:inline-flex;align-items:center;justify-content:center;font:700 12.5px Poppins,sans-serif}
.vpod-n{flex:1 1 auto;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.vpod-p{flex:0 0 auto;font:700 13.5px Poppins,sans-serif;color:#A84200}

.vann{display:flex;align-items:center;justify-content:center;gap:9px;
  padding:9px 20px;background:linear-gradient(90deg,#0C2A6A,#1E499B);color:#fff;
  font:500 13.5px/1.45 Poppins,sans-serif;text-align:center;position:relative;z-index:58}
.vann-p{flex:0 0 auto;display:inline-flex;align-items:center;justify-content:center;
  width:22px;height:22px;border-radius:7px;background:rgba(255,255,255,.16);color:#FFC93C}
.vann-x{animation:vannIn .5s cubic-bezier(.22,1,.36,1);min-width:0}
@keyframes vannIn{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:none}}
@media (prefers-reduced-motion:reduce){ .vann-x{animation:none} }
@media (max-width:600px){ .vann{font-size:12.5px;padding:8px 14px} }

/* Texte réservé aux lecteurs d'écran : présent dans l'arbre d'accessibilité,
   invisible à l'œil. On masque par clip-path et non par display:none, qui le
   retirerait aussi de l'annonce vocale. */
.vsr{position:absolute!important;width:1px;height:1px;margin:-1px;padding:0;
  overflow:hidden;clip-path:inset(50%);white-space:nowrap;border:0}
.vmn-l{flex:0 0 auto;margin-left:auto;display:inline-flex;align-items:center;
  justify-content:center;width:19px;height:19px;border-radius:6px;
  background:#F1F0FA;color:#5B4FA8}
.vmn-i:hover .vmn-l{background:#E4E1F6}
.vmn-i{display:flex;align-items:center;gap:11px;padding:9px 12px;border:0;border-radius:11px;
  background:none;cursor:pointer;text-align:left;text-decoration:none;width:100%;
  font:500 14px Poppins,sans-serif;color:#12203F;
  transition:background .16s ease,color .16s ease,transform .16s ease}
.vmn-i:hover,.vmn-i:focus-visible{background:#F3F6FC;color:#1E499B;outline:none;transform:translateX(3px)}
.vmn-i:focus-visible{box-shadow:0 0 0 2px #1E499B inset}
.vmn-i:hover .vmn-p{transform:scale(1.1) rotate(-3deg)}
.vmn-p{width:34px;height:34px;border-radius:10px;display:flex;align-items:center;
  justify-content:center;flex:0 0 auto;transition:transform .18s cubic-bezier(.34,1.56,.64,1)}
.vmn-x{display:flex;flex-direction:column;line-height:1.35;min-width:0}
.vmn-x small{font:400 12px Poppins,sans-serif;color:#6E7385;margin-top:1px}
@media (prefers-reduced-motion:reduce){ .vmn{animation:none} .vmn-i,.vmn-p{transition:none} .vmn-i:hover{transform:none} .vmn-i:hover .vmn-p{transform:none} }

/* Version mobile : dans le tiroir, donc en flux, une seule colonne, sans
   ombre ni cadre — le tiroir en porte déjà. */
.vmn-mob{position:static;display:block;border:0;box-shadow:none;padding:4px 0 0;
  max-height:none;overflow:visible;animation:none;background:none;
  border-top:1px solid #E4E7EF;margin-top:8px}
.vmn-mob .vmn-col{margin-bottom:2px}

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

/* ── Grands écrans : reprendre la place laissée vide ───────────────────────
   La maquette est calibrée pour 1170 px. Sur un écran de 1 600, cela laisse
   430 px de blanc — deux bandes de 215 px de part et d'autre, alors que les
   grilles de cartes, elles, se serrent.

   On relève donc le plafond des COQUILLES DE MISE EN PAGE, et d'elles seules.
   Les blocs de prose de la maquette (620 à 820 px) ne sont pas touchés, et
   c'est délibéré : au-delà d'environ 75 caractères par ligne, l'œil perd le
   début de la ligne suivante. Élargir un paragraphe ne rend pas la lecture
   plus confortable, il la rend plus pénible. Ce qui gagne à s'étaler, ce sont
   les grilles ; ce qui gagne à rester étroit, c'est le texte suivi.

   Le seuil est à 1 440 px : au-dessous, 1170 + gouttières occupe déjà
   l'écran. */
@media (min-width:1440px){
  [style*="max-width:1170px"]{max-width:1330px!important}
}
@media (min-width:1760px){
  [style*="max-width:1170px"]{max-width:1440px!important}
}
`;

const page = `<!DOCTYPE html>
<html lang="fr">
<head>
<meta charset="utf-8">
<!-- ── Politique de sécurité du contenu ───────────────────────────────────
     La coquille applicative doit tout autoriser en https: (CDN jsPDF/xlsx,
     moteurs d'IA, emojis distants). La vitrine, elle, ne charge QUE ses
     propres fichiers plus Google Fonts — et c'est la page qui encaisse. Elle
     mérite donc la politique la plus stricte du site, pas l'absence de
     politique qu'elle avait. « unsafe-inline » reste indispensable pour les
     styles (toute la maquette est en styles en ligne) et pour le bloc
     VRT_DATA ; un nonce est impossible sur un fichier statique servi tel
     quel. « connect-src 'self' » suffit : le seul appel réseau du script est
     /api/payment_camerpay.php, sur la même origine. -->
<meta http-equiv="Content-Security-Policy" content="default-src 'self'; base-uri 'self'; object-src 'none'; form-action 'self'; frame-src 'none'; img-src 'self' data:; media-src 'self'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; script-src 'self' 'unsafe-inline'; connect-src 'self'">
<meta name="referrer" content="strict-origin-when-cross-origin">
${metaBrut}
<!-- PWA : « / » sert désormais la vitrine. Sans ce lien, le site cessait
     d'être installable depuis sa propre page d'accueil — le manifeste
     n'était déclaré que par app.html, où plus personne n'arrive d'abord. -->
<link rel="manifest" href="/manifest.webmanifest">
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
<!-- 🛡️ Bouclier anti-robots. CHARGÉ TÔT ET SANS defer, À DESSEIN : il
     enveloppe window.fetch, et doit donc être en place avant que le moindre
     script n'appelle l'API. En defer, les premiers appels partiraient sans
     lui et un défi les ferait échouer au lieu d'être rejoué.
     Il ne se manifeste JAMAIS lors d'une visite normale : le serveur ne
     réclame de preuve qu'au-delà d'un débit anormal. -->
<script src="assets/veritas-shield.js?v=${VERSION_ASSETS}"></script>
</head>
<body>
${sprite}
${corps}
<script>window.VRT_DATA=${JSON.stringify(D)};window.VRT_TPL=${JSON.stringify(gabarits)};</script>
<script src="assets/vitrine.js?v=${VERSION_ASSETS}" defer></script>
<!-- Le tuteur, présent sur les sept écrans : le lanceur est en position fixe,
     il survit donc au changement d'écran (aller() ne touche qu'aux data-vp). -->
<script src="assets/ambassa.js?v=${VERSION_ASSETS}" defer></script>
<!-- Service worker : enregistré par app.html seulement jusqu'ici. Or depuis
     que « / » sert la vitrine, un visiteur peut très bien ne jamais ouvrir
     l'application — il n'avait donc ni mode hors ligne ni proposition
     d'installation. L'enregistrement est différé après « load » : il ne doit
     pas disputer la bande passante au premier rendu, sur un public en
     données mobiles. Portée « / » : le même worker sert les deux surfaces. -->
<script>
if ('serviceWorker' in navigator) {
  window.addEventListener('load', function () {
    navigator.serviceWorker.register('/sw.js', { scope: '/' }).catch(function () { /* refusé : la page marche sans */ });
  });
}
</script>
</body>
</html>
`;
if (OUT) { fs.writeFileSync(OUT, page); console.log('écrit      :', OUT, '—', page.length, 'octets'); }

console.log('');
console.log('── Corrections ──');
console.log('taux réels  : BEPC 100 % · Probatoire 69 % · BAC 61 % (anneaux recalculés)');
console.log('taux MANQUANTS (aucune tuile construite) :', tauxManquants.join(', ') || 'aucun');
console.log('ancres branchées :', Object.keys(ANCRES).length + 2, 'familles');
console.log('ancres SANS destination :', ancresRestantes.join(' ') || 'aucune');
console.log('');
console.log('corps      :', corps.length, 'octets');
console.log('fragments  :', Object.keys(fragments).join(', '));
console.log('handlers   :', [...handlers].join(', '));
console.log('hover      :', hoverRules.length, 'règles');
console.log('sections   :', (corps.match(/data-vp="/g) || []).length);
