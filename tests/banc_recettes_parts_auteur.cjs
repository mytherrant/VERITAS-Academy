#!/usr/bin/env node
/* ════════════════════════════════════════════════════════════════════════════
   tests/banc_recettes_parts_auteur.cjs — LES ÉCRANS LISENT L'ARGENT REÇU
   © 2024-2026 Jacques Miterand TAKOU (Mythe Errant).

     node tests/banc_recettes_parts_auteur.cjs

   ─── CE QU'IL PROTÈGE ───────────────────────────────────────────────────────
   tests/banc_recettes_livres.php garde le REGISTRE : ce que le serveur inscrit
   au paiement confirmé. Ce banc-ci garde ce que les ÉCRANS en font — l'espace
   auteur, la gestion des auteurs et le bilan financier —, qui calculaient les
   ventes comme `vendu × prix` :
     · le prix du jour réécrivait le passé ;
     · les remises étaient ignorées ;
     · le numérique et les livres sans stock ne comptaient pas.

   ─── LE CONTRAT, MESURÉ ET NON RELU ─────────────────────────────────────────
   Un registre est produit par le VRAI api/_recettes_lib.php (PHP, dans un
   dossier jetable), puis lu par la VRAIE fonction `_bookRecette` extraite
   d'app.js. Si un côté renomme un champ (`recette`, `anterieur`), l'autre lit
   zéro sans lever d'erreur : c'est ce silence que le banc attrape.

   ─── POUR LE FAIRE ROUGIR (éprouvé le 17/09/2026, chiffres mesurés) ─────────
     · rétablir `b.vendu*b.prix` dans l'un des six calculs           1 au rouge (①)
     · `_bookRecette` qui oublie `anterieur`                          1 au rouge (③)
     · renommer `recette` en `montant` dans vrt_rec_par_livre()       3 au rouge (③)
   Les mutations d'app.js se font sur une COPIE (BANC_APP_JS) : d'autres
   sessions peuvent écrire dans le fichier partagé au même moment.
   ══════════════════════════════════════════════════════════════════════════ */
'use strict';

const fs = require('fs');
const os = require('os');
const path = require('path');
const { execFileSync } = require('child_process');

const RACINE = path.resolve(__dirname, '..');
/* BANC_APP_JS : lire une COPIE d'app.js pour l'éprouver par mutation sans
   écrire dans le fichier partagé — d'autres sessions peuvent y travailler au
   même moment, et une mutation posée sous leurs pieds serait leur bug. */
const APP = fs.readFileSync(process.env.BANC_APP_JS || path.join(RACINE, 'app.js'), 'utf8');
const STATS = fs.readFileSync(path.join(RACINE, 'api', 'stats.php'), 'utf8');

let vert = 0, rouge = 0;
const ok = (quoi, cond, detail) => {
  if (cond) { vert++; console.log('  \x1b[32m✓\x1b[0m ' + quoi); }
  else { rouge++; console.log('  \x1b[31m✗\x1b[0m ' + quoi + (detail ? '\n      \x1b[33m' + detail + '\x1b[0m' : '')); }
};
const titre = t => console.log('\n\x1b[1m' + t + '\x1b[0m');

/** Le texte d'une fonction d'app.js, de sa déclaration à l'accolade fermante en colonne 0. */
function extraire(debut) {
  const i = APP.indexOf(debut);
  if (i < 0) return null;
  const m = /\r?\n\}\r?\n/.exec(APP.slice(i));
  return m ? APP.slice(i, i + m.index + m[0].length) : null;
}

// ─────────────────────────────────────────────────────────────────────────
titre('① Le calcul fautif a disparu des six écrans');
{
  const restes = (APP.match(/\.vendu\s*\*\s*b\.prix/g) || []).length;
  ok('plus aucun `vendu × prix` dans les parts d’auteur ni le bilan', restes === 0, `${restes} occurrence(s)`);
  const sites = (APP.match(/_bookRecette\(b\)/g) || []).length;
  ok('les six calculs passent par _bookRecette()', sites >= 6, `${sites} appel(s)`);
}

// ─────────────────────────────────────────────────────────────────────────
titre('② Chaque écran demande les recettes réelles');
for (const page of ['function pgMyBooks(){', 'function pgAuthorsMgmt(){', 'function pgFinance(){', 'function printBilan(){']) {
  const src = extraire(page);
  ok(page.replace('function ', '').replace('(){', '()') + ' appelle _recettesLivres()',
     !!src && /_recettesLivres\(\)/.test(src), src ? '' : 'fonction introuvable');
}
ok('stats.php ne livre les recettes qu’à l’administration (hash_equals sur API_SECRET)',
   /isset\(\$_GET\['recettes'\]\)[\s\S]{0,300}hash_equals\(API_SECRET, \$tok\)/.test(STATS));

// ─────────────────────────────────────────────────────────────────────────
titre('③ Le registre du serveur, lu par le navigateur');
{
  const srcR = extraire('function _bookRecette(b){');
  ok('_bookRecette() lisible dans app.js', !!srcR);

  /* Un registre produit par le VRAI serveur, dans un dossier jetable. */
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'vrt_rec_parts_'));
  let livres = null;
  try {
    const code = [
      "define('VRT_REC_DIR', " + JSON.stringify(tmp.replace(/\\/g, '/')) + ");",
      "require " + JSON.stringify(path.join(RACINE, 'api', '_recettes_lib.php').replace(/\\/g, '/')) + ";",
      // Un livre au passé : vendu 10 fois à 1 000 F avant le registre, puis 900 F remisés.
      "vrt_rec_enregistrer('P-1', 'bk_passe', 900, 'book', ['vendu' => 10, 'prix' => 1000]);",
      // Un livre neuf : deux ventes, dont une remisée.
      "vrt_rec_enregistrer('N-1', 'bk_neuf', 1500, 'book', ['vendu' => 0, 'prix' => 1500]);",
      "vrt_rec_enregistrer('N-2', 'bk_neuf', 1350, 'book', ['vendu' => 1, 'prix' => 1500]);",
      "echo json_encode(vrt_rec_par_livre());",
    ].join('\n');
    livres = JSON.parse(execFileSync('php', ['-r', code], { cwd: RACINE, encoding: 'utf8' }));
  } catch (e) {
    ok('le registre serveur se produit et se lit', false, e.message.split('\n')[0]);
  } finally {
    try { fs.rmSync(tmp, { recursive: true, force: true }); } catch (e) {}
  }

  if (srcR && livres) {
    const window = { _VRT_RECETTES: livres };
    const recette = new Function('window', srcR + '\nreturn _bookRecette;')(window);

    const passe = { id: 'bk_passe', vendu: 11, prix: 1000 };
    ok('livre au passé : 10 000 F figés + 900 F réellement encaissés = 10 900 F',
       recette(passe) === 10900, `lu : ${recette(passe)}`);

    const neuf = { id: 'bk_neuf', vendu: 2, prix: 1500 };
    ok('livre neuf : 1 500 + 1 350 (remisé) = 2 850 F — l’ancien calcul disait 3 000',
       recette(neuf) === 2850, `lu : ${recette(neuf)}`);

    neuf.prix = 4000;
    ok('le prix passe à 4 000 F : la recette ne bouge pas (2 850 F)',
       recette(neuf) === 2850, `lu : ${recette(neuf)}`);

    const inconnu = { id: 'bk_hors_registre', vendu: 3, prix: 1200 };
    ok('livre sans vente enregistrée : l’estimation d’avant subsiste (3 × 1 200)',
       recette(inconnu) === 3600, `lu : ${recette(inconnu)}`);

    const sansRegistre = new Function('window', srcR + '\nreturn _bookRecette;')({ _VRT_RECETTES: null });
    ok('registre indisponible (pas de secret, réseau coupé) : l’écran ne tombe pas',
       sansRegistre(neuf) === 2 * 4000, `lu : ${sansRegistre(neuf)}`);
  }
}

console.log('\n' + (rouge === 0
  ? `\x1b[32m\x1b[1m  ✓ ${vert}/${vert} — les écrans lisent l’argent reçu.\x1b[0m\n`
  : `\x1b[31m\x1b[1m  ✗ ${rouge} au rouge sur ${vert + rouge}.\x1b[0m\n`));
process.exit(rouge === 0 ? 0 : 1);
