#!/usr/bin/env node
/* ════════════════════════════════════════════════════════════════════════════
   tools/rendu_couvertures.cjs — LA COUVERTURE D'UN CAHIER QUI N'EN A PAS
   © 2024-2026 Jacques Miterand TAKOU (Mythe Errant).

     node tools/rendu_couvertures.cjs            # tous les Bords sans couverture
     node tools/rendu_couvertures.cjs 3e tle     # ceux-là seulement
     node tools/rendu_couvertures.cjs --controle # dit ce qu'il ferait

   POURQUOI CE SCRIPT EXISTE
   `tools/couvertures.py` part d'un fichier image livré par la maquette. Cinq
   cahiers n'en ont pas : les Bords de 4ᵉ, 3ᵉ, 2ⁿᵈᵉ, 1ʳᵉ et Tˡᵉ. Leur
   couverture n'existe nulle part sous forme d'image — c'est la page de titre
   du document, composée en HTML.

   Trois issues, deux mauvaises :
     • ne rien mettre — cinq rectangles gris dans une boutique de quinze
       produits payants ;
     • reprendre la couverture du LIVRET du même niveau — c'est un autre
       produit, vendu séparément : l'acheteur croirait commander celui-là ;
     • recomposer la page de titre à partir de ses propres éléments. C'est ce
       qui est fait ici.

   CE QUE CETTE COUVERTURE EST, ET CE QU'ELLE N'EST PAS
   Elle n'invente rien : le titre, les deux auteurs et l'illustration sont lus
   dans `content<niveau>.js`, la source du cahier. Ce sont les mots du livre.
   Mais ce n'est PAS une couverture dessinée par un maquettiste : c'est une
   page de titre mise en forme selon la charte LWS du site. À dire tel quel à
   Jacques — le jour où il fera dessiner de vraies couvertures, elles
   remplaceront celles-ci en déposant un fichier, sans toucher au code.

   UN PIÈGE PAYÉ D'AVANCE
   La première tentative photographiait le haut du document rendu. Mesuré :
   la découpe au format d'une couverture (1:1,414) descendait jusqu'au
   sommaire, et la carte de la boutique montrait une table des matières. Un
   document qui coule sur 115 000 pixels n'a pas de « première page » à
   découper — il faut composer.
   ════════════════════════════════════════════════════════════════════════ */
'use strict';
const fs = require('fs');
const os = require('os');
const path = require('path');
const { execFileSync } = require('child_process');
const { chromium } = require('playwright');

const RACINE = path.resolve(__dirname, '..');
const SOURCE = path.join(os.homedir(), 'Desktop', 'Collaboratif', 'Bords de 6e en Tle');
const SORTIE = path.join(RACINE, 'uploads', 'oeuvres');

/* slug du catalogue → fichier de contenu et dossier d'images.
   Les Bords de 6ᵉ et 5ᵉ ont déjà leur couverture en fichier (`6e.png`,
   `5e.png`) : on ne les refait pas, la maquette d'origine vaut mieux. */
const BORDS = {
  'bord-4e':   { contenu: 'content4e.js',  images: 'images4e' },
  'bord-3e':   { contenu: 'content3e.js',  images: 'images3e' },
  'bord-2nde': { contenu: 'content2nde.js', images: 'images2nde' },
  'bord-1ere': { contenu: 'content1e.js',  images: 'images1e' },
  'bord-tle':  { contenu: 'contentTle.js', images: 'imagesTle' },
};

/* Une teinte par niveau, reprise des couleurs de séquence des cahiers. Deux
   cahiers voisins dans la grille ne portent jamais la même : sur une page de
   quinze vignettes, la couleur est ce qui permet de retrouver le sien. */
const TEINTES = {
  'bord-4e': '#456B1E', 'bord-3e': '#0E6B63', 'bord-2nde': '#2C4E8F',
  'bord-1ere': '#9A6413', 'bord-tle': '#7A3070',
};

// Mêmes dimensions que tools/couvertures.py : deux chaînes de production
// donneraient deux formats, et la grille de la boutique s'en verrait.
const LARGEUR = 1200, HAUTEUR = 1600, VIG_L = 460, VIG_H = 613;

function lireBlocs(fichier) {
  const s = fs.readFileSync(fichier, 'utf8').replace(/^﻿/, '').trim();
  const i = s.indexOf('export default');
  const corps = i === 0 ? s.slice('export default'.length) : s.slice(s.indexOf('=') + 1);
  return JSON.parse(corps.trim().replace(/;$/, ''));
}

/* Le titre du cahier tel que le livre l'écrit. Les runs portent `s:1` pour un
   exposant — « 1ère » s'y écrit en trois morceaux. On les recolle en
   conservant l'exposant : « 1ere A » à plat sur une couverture, c'est une
   faute de composition que personne ne pardonne à un livre de français. */
function titreEtAuteurs(blocs) {
  let titre = '', sous = '', auteurs = [];
  for (const b of blocs.slice(0, 30)) {
    if (!b || typeof b !== 'object') continue;
    const runs = b.r || [];
    const html = runs.map((r) => {
      const t = String((r && r.t) || '').replace(/[&<>]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' }[c]));
      return r && r.s ? `<sup>${t}</sup>` : t;
    }).join('');
    if (b.y === 'cover' && !titre) titre = html.trim();
    else if (b.y === 'coversub' && !sous) sous = html.trim();
    else if (b.y === 'coverauth') {
      /* Le 2ⁿᵈᵉ réunit ses deux auteurs sur UNE ligne séparée d'un point
         médian, les autres en font deux blocs. On rend les deux formes à la
         même chose, sinon une couverture sur cinq n'aurait qu'un nom. */
      runs.map((r) => (r && r.t) || '').join('').split(/\s*[·•]\s*/)
        .map((x) => x.trim()).filter(Boolean)
        .forEach((nom) => { if (!auteurs.includes(nom)) auteurs.push(nom); });
    } else if (b.y === 'legal') break;   // la couverture s'arrête là
  }
  return { titre, sous, auteurs };
}

/* Le niveau, lu dans le slug plutôt que deviné dans le titre : celui du
   Bord de 2ⁿᵈᵉ ne le porte pas (« Mon Cahier de français », la classe étant
   dans le sous-titre), et l'extraire du texte aurait échoué sur ce seul-là —
   c'est-à-dire précisément sur celui qui en avait le plus besoin. */
const NIVEAUX = {
  'bord-6e': ['6ᵉ', 'sixième'], 'bord-5e': ['5ᵉ', 'cinquième'],
  'bord-4e': ['4ᵉ', 'quatrième'], 'bord-3e': ['3ᵉ', 'troisième'],
  'bord-2nde': ['2ⁿᵈᵉ', 'seconde'], 'bord-1ere': ['1ʳᵉ', 'première'],
  'bord-tle': ['Tˡᵉ', 'terminale'],
};

function gabarit({ titre, sous, auteurs, teinte, niveau, classe }) {
  /* Charte LWS imposée par le cahier des charges : Poppins, bleu #16284F,
     fond #F4F7FB, jamais de dégradé. La teinte du niveau tient le bandeau et
     le filet — « la couleur qualifie, elle n'inonde pas ».

     PAS D'ILLUSTRATION, ET C'EST UN CHOIX. Les documents portent bien des
     images, mais aucune n'est désignée comme couverture : sur le Bord de 1ʳᵉ
     elle est accrochée à la ligne d'un auteur, sur celui de 3ᵉ il n'y en a
     aucune, sur celui de 2ⁿᵈᵉ le dossier d'images n'existe pas. Prendre
     « image2 » au hasard, ce serait poser sur la vitrine d'un produit payant
     une figure tirée d'un exercice — et une fois sur trois, peut-être le
     portrait de quelqu'un. Cinq couvertures typographiques identiques de
     facture valent mieux que trois illustrées et deux nues. */
  return `<!doctype html><meta charset="utf-8">
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800&display=swap">
<style>
  *{box-sizing:border-box;margin:0}
  body{width:1200px;height:1600px;background:#fff;font-family:Poppins,system-ui,sans-serif;
       display:flex;flex-direction:column;overflow:hidden}
  .bandeau{background:${teinte};color:#fff;padding:38px 68px;font-size:27px;
       font-weight:600;letter-spacing:.05em;text-transform:uppercase}
  .corps{flex:1;padding:110px 72px 0;display:flex;flex-direction:column}
  h1{font-size:104px;line-height:1.02;font-weight:800;color:#16284F;letter-spacing:-.025em}
  h1 sup{font-size:.48em;vertical-align:super;line-height:0}
  .sous{margin-top:34px;font-size:36px;color:${teinte};font-weight:600;font-style:italic;line-height:1.35}
  .filet{margin-top:56px;height:8px;width:210px;background:${teinte};border-radius:4px}
  .marque{margin-top:40px;font-size:29px;color:#54606F;line-height:1.7}
  /* Le repère de niveau occupe le bas de la couverture. Sans lui, la première
     version laissait 600 px de blanc entre le filet et le pied : sur une
     étagère de quinze vignettes, elle ne se distinguait de rien. Il donne
     aussi ce qu'on cherche d'abord dans une librairie scolaire — la classe. */
  .niveau{margin-top:auto;margin-bottom:64px;align-self:flex-end;text-align:right}
  .niveau b{display:block;font-size:210px;line-height:.86;font-weight:800;
       color:${teinte};opacity:.13;letter-spacing:-.04em}
  .niveau span{display:block;margin-top:14px;font-size:26px;font-weight:600;
       letter-spacing:.16em;text-transform:uppercase;color:${teinte}}
  .pied{background:#F4F7FB;border-top:2px solid #E3E9F2;padding:52px 72px}
  .auteurs{font-size:32px;color:#1B2431;font-weight:500;line-height:1.55;letter-spacing:.02em}
  .prog{margin-top:18px;font-size:24px;color:#54606F}
</style>
<div class="bandeau">Centre VÉRITAS · Douala, Cameroun</div>
<div class="corps">
  <h1>${titre}</h1>
  ${sous ? `<div class="sous">${sous}</div>` : ''}
  <div class="filet"></div>
  <div class="marque">Le cahier complet — leçons, exercices<br>et corrigés modèles</div>
  <div class="niveau"><b>${niveau}</b><span>Classe de ${classe}</span></div>
</div>
<div class="pied">
  <div class="auteurs">${auteurs.map((a) => a.replace(/[&<>]/g, '')).join(' · ')}</div>
  <div class="prog">Conforme au programme MINESEC · Approche par les compétences</div>
</div>`;
}

(async () => {
  const args = process.argv.slice(2);
  const controle = args.includes('--controle');
  const demandes = args.filter((a) => !a.startsWith('--'));
  const cibles = Object.keys(BORDS).filter(
    (s) => !demandes.length || demandes.includes(s) || demandes.includes(s.replace(/^bord-/, '')));

  if (!fs.existsSync(SOURCE)) { console.log(`✗ source introuvable : ${SOURCE}`); process.exit(2); }
  fs.mkdirSync(SORTIE, { recursive: true });

  const nav = controle ? null : await chromium.launch();
  let faits = 0, rates = 0;

  for (const slug of cibles) {
    const spec = BORDS[slug];
    const fContenu = path.join(SOURCE, spec.contenu);
    if (!fs.existsSync(fContenu)) {
      console.log(`  ✗ ${slug.padEnd(11)} contenu absent : ${spec.contenu}`); rates++; continue;
    }
    const { titre, sous, auteurs } = titreEtAuteurs(lireBlocs(fContenu));
    if (!titre) {
      console.log(`  ✗ ${slug.padEnd(11)} aucun bloc « cover » dans ${spec.contenu}`); rates++; continue;
    }
    const propre = titre.replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();
    if (controle) {
      console.log(`  · ${slug.padEnd(11)} « ${propre} » — ${auteurs.length} auteur(s)`
        + `, sous-titre ${sous ? '« ' + sous.replace(/<[^>]+>/g, '') + ' »' : 'ABSENT'}`);
      continue;
    }

    const page = await nav.newPage({ viewport: { width: LARGEUR, height: HAUTEUR }, deviceScaleFactor: 1 });
    const [niveau, classe] = NIVEAUX[slug] || ['', ''];
    /* `waitUntil:'load'` attendait la feuille de Google Fonts. Le jour où le
       réseau traîne, le rendu échoue au bout de 30 s — et il a échoué. On
       n'attend donc plus le chargement complet de la page : on attend les
       POLICES, avec un plafond, et on DIT si elles ne sont pas arrivées.
       Une couverture composée en Arial n'est pas une couverture ratée à moitié,
       c'est une couverture ratée : mieux vaut le savoir que la publier. */
    await page.setContent(gabarit({ titre, sous, auteurs, niveau, classe,
                                    teinte: TEINTES[slug] || '#2C4E8F' }),
      { waitUntil: 'domcontentloaded' });
    await Promise.race([
      page.evaluate(() => document.fonts.ready),
      page.waitForTimeout(12000),
    ]);
    const poppins = await page.evaluate(() => document.fonts.check('800 100px Poppins'));
    if (!poppins) {
      console.log(`  ✗ ${slug.padEnd(11)} Poppins non chargée (réseau ?) — couverture NON produite`);
      await page.close(); rates++; continue;
    }
    await page.waitForTimeout(400);
    const tmp = path.join(SORTIE, `_tmp_${slug}.png`);
    await page.screenshot({ path: tmp, clip: { x: 0, y: 0, width: LARGEUR, height: HAUTEUR } });
    await page.close();

    execFileSync('python', ['-c', `
import sys
sys.stdout.reconfigure(encoding="utf-8", errors="replace")
from PIL import Image, ImageFilter
im = Image.open(${JSON.stringify(tmp)}).convert("RGB")
def sortir(im, l, h, dest):
    c = im.copy(); c.thumbnail((l, h), Image.LANCZOS)
    c = c.filter(ImageFilter.UnsharpMask(radius=0.7, percent=85, threshold=3))
    c.save(dest, "JPEG", quality=92, optimize=True, progressive=True, subsampling=0)
sortir(im, ${LARGEUR}, ${HAUTEUR}, ${JSON.stringify(path.join(SORTIE, `livret_${slug}.jpg`))})
sortir(im, ${VIG_L}, ${VIG_H}, ${JSON.stringify(path.join(SORTIE, `livret_${slug}_v.jpg`))})
`], { stdio: 'inherit' });
    fs.unlinkSync(tmp);
    const po = fs.statSync(path.join(SORTIE, `livret_${slug}.jpg`)).size;
    console.log(`  ✓ ${slug.padEnd(11)} « ${propre} » — ${Math.round(po / 1024)} Ko`);
    faits++;
  }

  if (nav) await nav.close();
  console.log(`\n${controle ? 'contrôle terminé' : `${faits} couverture(s) composée(s)`}`
    + (rates ? `, ${rates} en échec` : ''));
  process.exit(rates ? 1 : 0);
})();
