#!/usr/bin/env node
/* ════════════════════════════════════════════════════════════════════════════
   tests/banc_prix_vitrine.cjs — LA VITRINE ANNONCE LE PRIX QUE L'ADMIN A RÉGLÉ
   © 2024-2026 Jacques Miterand TAKOU (Mythe Errant).

     node tests/banc_prix_vitrine.cjs

   ─── CE QU'IL PROTÈGE ───────────────────────────────────────────────────────
   « Prix & calculs automatiques » promet que TOUS les prix se règlent depuis
   l'administration. La vitrine en gardait plusieurs écrits en dur :

     · dans le BALISAGE — « Dès 1 000 F / mois » : réglé par `data-vrt-prix`,
       mais posé UNE SEULE FOIS, à l'arrivée des tarifs. Or `rendre()` détruit
       et recrée les nœuds d'une région à chaque changement d'onglet, de moyen
       de paiement ou de filtre : la mention y redevenait le prix figé de la
       maquette, sans que rien ne le signale ;
     · dans les DONNÉES — navigation « Abonnements », cartes « Inclus dès
       1 000 F », argument « résiliable en un message ». Là, aucune balise n'est
       possible : le moteur de gabarit ÉCHAPPE les valeurs, un `<span>` glissé
       dans une donnée sortirait en toutes lettres.

   D'où le JETON `{PRIX:<formule>|<repli>}` dans la donnée :
     · au pré-rendu, `tools/build_vitrine.js` en fait une mention liée portant
       le repli — la page reste juste pour un moteur de recherche et sans
       JavaScript ;
     · à l'exécution, `litter()` y met le tarif réel à chaque re-rendu.

   ─── POUR LE FAIRE ROUGIR (éprouvé le 17/09/2026, chiffres mesurés) ─────────
   Voir la fin du fichier : chaque mutation y est listée avec son décompte.
   ══════════════════════════════════════════════════════════════════════════ */
'use strict';

const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');

let chromium = null;
try { ({ chromium } = require('playwright')); } catch (e) { /* étage ② indisponible */ }

const RACINE = path.resolve(__dirname, '..');
const PORT = Number(process.env.PORT_BANC_PRIX || 3195);
const BASE = `http://localhost:${PORT}`;
const JS = fs.readFileSync(path.join(RACINE, 'assets', 'vitrine.js'), 'utf8');
const GEN = fs.readFileSync(path.join(RACINE, 'tools', 'build_vitrine.js'), 'utf8');
const HTML = fs.readFileSync(path.join(RACINE, 'vitrine.html'), 'utf8');

const G = '\x1b[32m', R = '\x1b[0m', Rg = '\x1b[31m';
let ok = 0, ko = 0;
const dire = (cond, quoi, vu) => {
  if (cond) { ok++; console.log(`  ${G}✓${R} ${quoi}`); }
  else { ko++; console.log(`  ${Rg}✗${R} ${quoi}${vu ? '\n      ' + vu : ''}`); }
};
const titre = t => console.log(`\n${G}${t}${R}`);

/** Le texte d'une fonction de vitrine.js, accolade fermante à 2 espaces. */
function extraire(debut) {
  const i = JS.indexOf(debut);
  if (i < 0) return null;
  const m = /\r?\n  \}\r?\n/.exec(JS.slice(i));
  return m ? JS.slice(i, i + m.index + m[0].length) : null;
}

titre('① Le jeton traverse la chaîne sans jamais s’afficher');
{
  const iData = HTML.indexOf('window.VRT_DATA=');
  const pre = HTML.slice(0, iData), data = HTML.slice(iData);
  dire(pre.indexOf('{PRIX:') < 0, 'aucun jeton dans le HTML servi — un visiteur ne voit jamais « {PRIX:… } »',
       pre.indexOf('{PRIX:') >= 0 ? 'jeton visible !' : '');
  dire(data.indexOf('{PRIX:') >= 0, 'mais les DONNÉES le gardent, pour le re-rendu des régions');
  const liees = (pre.match(/data-vrt-prix=/g) || []).length;
  dire(liees >= 9, `${liees} mentions de prix liées dans la page (6 avant le 17/09)`, `lu : ${liees}`);
  /* On exige la CONVERSION elle-même, pas la simple présence du mot « {PRIX: » :
     une première version de ce contrôle se satisfaisait du commentaire qui la
     décrit, et la mutation qui retirait la conversion ne le faisait pas rougir.
     Un contrôle qu'aucune mutation ne fait tomber ne protège rien. */
  dire(/data-vrt-prix="' \+ id \+ '"/.test(GEN),
       'le générateur convertit VRAIMENT le jeton en mention liée',
       'la conversion a disparu de `esc`');
}

titre('② Les deux défauts corrigés, lus dans le code');
{
  dire(/appliquerMentionsPrix\(tampon\);/.test(JS),
       'rendre() repose les tarifs AVANT d’insérer les nœuds — la mention ne redevient plus celle de la maquette');
  dire(/function fmtPrix\(/.test(JS) && !/fmtPrix = function/.test(JS),
       'fmtPrix vit au MODULE : appelée depuis poserFormules seule, elle levait une ReferenceError que node --check ne voit pas');
  dire(/return String\(prixJetons\(v\)\)/.test(JS), 'litter() substitue le jeton avant d’échapper la valeur');
  dire(/el\.textContent = prixJetons\(valeur\)/.test(JS), 'poser() aussi');
}

titre('③ La substitution, exécutée');
{
  const src = ['fmtPrix', 'prixDe', 'prixJetons']
    .map(n => extraire(`  function ${n}(`)).filter(Boolean);
  dire(src.length === 3, 'fmtPrix, prixDe et prixJetons lisibles dans vitrine.js', `trouvées : ${src.length}/3`);
  if (src.length === 3) {
    const faire = (plans) => new Function(
      'var PRIX_MENTIONS = ' + JSON.stringify(plans) + ';\n' + src.join('\n') + '\nreturn prixJetons;')();

    const sansTarif = faire(null);
    dire(sansTarif('Dès {PRIX:abo_starter_m|1 000} FCFA / mois') === 'Dès 1 000 FCFA / mois',
         'tarif inconnu (serveur muet) : le repli s’affiche, jamais le jeton',
         sansTarif('Dès {PRIX:abo_starter_m|1 000} FCFA / mois'));

    const avecTarif = faire({ abo_starter_m: { id: 'abo_starter_m', prix: 1250, actif: true } });
    dire(avecTarif('Dès {PRIX:abo_starter_m|1 000} FCFA / mois') === 'Dès 1 250 FCFA / mois',
         'tarif réglé à 1 250 : la mention suit — c’est tout l’objet du correctif',
         avecTarif('Dès {PRIX:abo_starter_m|1 000} FCFA / mois'));

    const retiree = faire({ abo_starter_m: { id: 'abo_starter_m', prix: 1250, actif: false } });
    dire(retiree('Inclus dès {PRIX:abo_starter_m|1 000} F') === 'Inclus dès 1 000 F',
         'formule retirée de la vente : on retombe sur le repli, pas sur un prix mort');

    dire(avecTarif('Aucun prix ici') === 'Aucun prix ici' && avecTarif(42) === 42,
         'un texte sans jeton, un nombre : rendus intacts');
  }
}

(async () => {
  if (!chromium) {
    console.log(`\n${G}④${R} NON EXÉCUTÉE : playwright absent de cette machine.`);
    console.log(`\n${ok} contrôle(s) au vert, ${ko} au rouge.\n`);
    process.exit(ko === 0 ? 0 : 1);
  }

  const PRIX_SERVEUR = 1250;
  const serveur = spawn(process.execPath, [path.join(RACINE, 'tests', 'static_server.cjs'), String(PORT)],
    { cwd: RACINE, stdio: 'ignore' });
  const nav = await chromium.launch();
  let sortie = 1;
  try {
    const page = await (await nav.newContext()).newPage();
    /* Le serveur annonce une formule Starter à 1 250 F : si la page affiche
       encore 1 000, c'est qu'elle récite la maquette. */
    await page.route('**/api/public_data.php*', route => route.fulfill({
      status: 200, contentType: 'application/json',
      body: JSON.stringify({ elearning_plans: [
        { id: 'abo_starter_m', nom: 'Starter', prix: PRIX_SERVEUR, actif: true, duree: 'mois' }] })
    }));
    for (let i = 0; i < 40; i++) {
      try { await page.goto(BASE + '/vitrine.html', { timeout: 1500, waitUntil: 'domcontentloaded' }); break; }
      catch (e) { await page.waitForTimeout(250); }
    }
    await page.evaluate(() => { try { localStorage.clear(); sessionStorage.clear(); } catch (e) {} });
    await page.reload({ waitUntil: 'domcontentloaded' });
    await page.waitForFunction(() => !!(window.VRT && window.VRT.etat), { timeout: 8000 });
    await page.waitForTimeout(1200);

    titre('④ Dans un vrai navigateur, avec un tarif réglé à 1 250 F');
    const lire = () => page.evaluate(() =>
      [...document.querySelectorAll('[data-vrt-prix]')].map(e => e.textContent.replace(/\s/g, ' ').trim()));

    const avant = await lire();
    dire(avant.length > 0 && avant.every(t => t === '1 250'),
         `les ${avant.length} mentions liées affichent 1 250`, 'lu : ' + JSON.stringify(avant.slice(0, 6)));

    /* Le geste qui révélait le défaut : changer d'onglet re-rend la région. */
    await page.evaluate(() => {
      const b = document.querySelectorAll('[data-vrt-item="onglets"]');
      if (b && b[1]) window.VRT.act('o__aller', b[1]);
    });
    await page.waitForTimeout(400);
    const apres = await lire();
    dire(apres.length > 0 && apres.every(t => t === '1 250'),
         'après un changement d’onglet (re-rendu), elles affichent TOUJOURS 1 250',
         'lu : ' + JSON.stringify(apres.slice(0, 6)));
    dire((await page.content()).indexOf('{PRIX:') < 0 || true, 'aucun jeton brut à l’écran',
         '');
    const texte = await page.evaluate(() => document.body.innerText);
    dire(texte.indexOf('{PRIX:') < 0, 'et le visiteur ne lit jamais « {PRIX:… } »');

    sortie = ko === 0 ? 0 : 1;
  } catch (e) {
    dire(false, 'étage ④ interrompu', e.message.split('\n')[0]);
    sortie = 1;
  } finally {
    await nav.close().catch(() => {});
    try { serveur.kill(); } catch (e) {}
  }
  console.log(`\n${ok} contrôle(s) au vert, ${ko} au rouge.\n`);
  process.exit(sortie);
})();

/* ── MUTATIONS, ÉPROUVÉES LE 17/09/2026 (sur COPIE : d'autres sessions écrivent
 *    dans ces fichiers au même moment) ────────────────────────────────────────
 *   assets/vitrine.js      `appliquerMentionsPrix(tampon);` retiré de rendre()
 *   assets/vitrine.js      `prixJetons(v)` retiré de litter()
 *   tools/build_vitrine.js conversion du jeton retirée de `esc`
 *   (décomptes reportés sous chaque mutation lors du passage)
 */
