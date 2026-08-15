/**
 * render.js — fabrique les fichiers à imprimer et à partager.
 *
 *   node promo/render.js            tout
 *   node promo/render.js eleve      seulement les pièces dont le nom contient « eleve »
 *
 * Sortie dans promo/rendu/ :
 *   · les affiches A4 en PDF vectoriel (pour l'imprimeur : net à n'importe quel zoom)
 *     ET en PNG 300 dpi (pour une photocopie ou un envoi WhatsApp) ;
 *   · les statuts et carrés en PNG à la taille exacte attendue par WhatsApp.
 *
 * Aucune dépendance npm : on pilote le Chrome déjà installé sur la machine.
 */

const { execFileSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const RACINE   = __dirname;
const AFFICHES = path.join(RACINE, 'affiches');
const RENDU    = path.join(RACINE, 'rendu');

/* Chrome, puis Edge en secours — les deux partagent le même moteur et les
   mêmes options de rendu. */
const CANDIDATS = [
  'C:/Program Files/Google/Chrome/Application/chrome.exe',
  'C:/Program Files (x86)/Google/Chrome/Application/chrome.exe',
  'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
  'C:/Program Files/Microsoft/Edge/Application/msedge.exe',
  '/usr/bin/google-chrome',
  '/usr/bin/chromium',
];

/* A4 à 96 dpi = 794 × 1123 px. Un facteur d'échelle de 3 donne ~288 dpi :
   au-dessus, le PNG dépasse 20 Mo sans gain visible à l'impression. */
const PIECES = [
  { fichier: 'affiche-eleve.html',      l:  794, h: 1123, echelle: 3, pdf: true },
  { fichier: 'affiche-enseignant.html', l:  794, h: 1123, echelle: 3, pdf: true },
  { fichier: 'affiche-parent.html',     l:  794, h: 1123, echelle: 3, pdf: true },
  { fichier: 'statut-corriges.html',    l: 1080, h: 1920, echelle: 1 },
  { fichier: 'statut-prix.html',        l: 1080, h: 1920, echelle: 1 },
  { fichier: 'statut-enseignant.html',  l: 1080, h: 1920, echelle: 1 },
  { fichier: 'carre-chiffre.html',      l: 1080, h: 1080, echelle: 1 },
  { fichier: 'carre-prix.html',         l: 1080, h: 1080, echelle: 1 },
];

function trouverNavigateur() {
  const trouve = CANDIDATS.find((c) => fs.existsSync(c));
  if (!trouve) {
    console.error('Aucun Chrome ni Edge trouvé. Chemins essayés :');
    CANDIDATS.forEach((c) => console.error('  ' + c));
    process.exit(1);
  }
  return trouve;
}

/* Chrome n'accepte pas un chemin Windows brut comme URL : il lui faut une
   URL file:// avec les espaces encodés (« Mythe Errant », « Claude code »). */
function versUrlFichier(p) {
  return 'file:///' + p.replace(/\\/g, '/').split('/').map(encodeURIComponent).join('/');
}

function lancer(navigateur, args) {
  execFileSync(navigateur, args, { stdio: ['ignore', 'ignore', 'pipe'] });
}

function main() {
  const navigateur = trouverNavigateur();
  const filtre = process.argv[2];
  fs.mkdirSync(RENDU, { recursive: true });

  const aFaire = PIECES.filter((p) => fs.existsSync(path.join(AFFICHES, p.fichier)))
                       .filter((p) => !filtre || p.fichier.includes(filtre));

  if (!aFaire.length) {
    console.error(filtre ? `Aucune pièce ne correspond à « ${filtre} ».` : 'Aucune pièce à rendre.');
    process.exit(1);
  }

  console.log('Navigateur : ' + navigateur + '\n');

  for (const piece of aFaire) {
    const url  = versUrlFichier(path.join(AFFICHES, piece.fichier));
    const base = piece.fichier.replace(/\.html$/, '');
    const communs = [
      '--headless=new', '--disable-gpu', '--no-sandbox', '--hide-scrollbars',
      // Laisse le temps aux polices Google de descendre avant la capture.
      '--virtual-time-budget=8000',
    ];

    const png = path.join(RENDU, base + '.png');
    lancer(navigateur, communs.concat([
      `--force-device-scale-factor=${piece.echelle}`,
      `--window-size=${piece.l},${piece.h}`,
      `--screenshot=${png}`,
      url,
    ]));
    const ko = Math.round(fs.statSync(png).size / 1024);
    console.log(`  ✓ ${base}.png   ${piece.l * piece.echelle} × ${piece.h * piece.echelle} px   ${ko} Ko`);

    if (piece.pdf) {
      const pdf = path.join(RENDU, base + '.pdf');
      lancer(navigateur, communs.concat([
        '--no-pdf-header-footer',
        `--print-to-pdf=${pdf}`,
        url,
      ]));
      console.log(`  ✓ ${base}.pdf   A4 vectoriel   ${Math.round(fs.statSync(pdf).size / 1024)} Ko`);
    }
  }

  console.log('\nFichiers écrits dans ' + RENDU);
  console.log('Les PDF vont à l\'imprimeur, les PNG sur WhatsApp.');
}

main();
