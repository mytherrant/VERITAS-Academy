#!/usr/bin/env node
/* ════════════════════════════════════════════════════════════════════════════
   tests/banc_cartes_survol.cjs — UNE CARTE SURVOLÉE NE DISPARAÎT PAS
   © 2024-2026 Jacques Miterand TAKOU (Mythe Errant).

       node tests/banc_cartes_survol.cjs

   ─── LE DÉFAUT ──────────────────────────────────────────────────────────────

   Signalé par Jacques le 13/09/2026, capture à l'appui : sur /corriges/, « les
   onglets disparaissent quand la souris s'y approche ». Sa capture montrait la
   rangée du premier cycle réduite à la seule carte de 6ᵉ ; 5ᵉ, 4ᵉ et 3ᵉ avaient
   disparu. Mesuré en production : après un passage de la souris, les QUATRE
   cartes étaient à `opacity:0`, décalées de 16 px vers le bas.

   `assets/veritas-pages.css` fait apparaître les cartes au défilement avec une
   animation pilotée par la vue (`animation-timeline: view()`), dont la première
   image est `opacity:0; translateY(16px)`. Le soulèvement au survol utilisait
   AUSSI `transform`. Pour que les deux ne se contrarient pas, une règle coupait
   la ligne de temps au survol :

       .card:hover, .cta a:hover { animation-timeline: none }

   Mais retirer la ligne de temps ne LIBÈRE pas une animation : sans temps
   résolu, et avec `fill-mode: both`, elle reste figée sur sa première image.
   Chaque carte touchée par la souris devenait invisible. Et la feuille sert
   133 pages — le défaut ne se limitait pas à /corriges/.

   ─── LE CORRECTIF QUE CE BANC GARDE ───────────────────────────────────────

   Le conflit se règle à la source : l'animation anime la propriété
   `translate`, le survol la propriété `transform`. Deux propriétés distinctes
   se composent au lieu de s'écraser ; il n'y a plus rien à couper.

   ─── DEUX ÉTAGES ────────────────────────────────────────────────────────────
   ① lit la feuille (partout, CI comprise). ② et ③ pilotent un vrai Chromium :
   `animation-timeline` n'existe que là, et un contrôle qui ne fait que relire
   le CSS dirait que la règle est écrite, pas qu'elle se comporte. Sans
   Playwright ou sans serveur, ces étages se sautent en le disant.

   ─── ÉPROUVÉ PAR MUTATION (13/09/2026) ──────────────────────────────────────
   · état d'origine rétabli (règle fautive + keyframes sur `transform`)
       → 4 au rouge, dont ③ : « 0/4 cartes visibles » après le passage de la
         souris — la capture de Jacques, reproduite dans un vrai Chromium ;
   · keyframes seuls remis sur `transform` (sans la règle fautive)
       → 2 au rouge, dont ② : « soulevée de 0 px ». C'est la raison pour
         laquelle la règle fautive avait été écrite : sans elle, l'animation
         (fill `both`, `transform:none`) écrase le soulèvement du survol.

   ⚠️ Ce que la mutation a appris : pendant un survol MAINTENU, l'opacité se
   mesure à 1 — c'est le BALAYAGE (③) qui fait disparaître les cartes, parce que
   la ligne de temps est coupée puis rétablie à chaque entrée et sortie. Un banc
   qui ne testerait que le survol immobile serait resté vert sur le défaut.
   ════════════════════════════════════════════════════════════════════════════ */
'use strict';
const fs = require('fs');
const path = require('path');

const RACINE = path.dirname(__dirname);
const CSS = fs.readFileSync(path.join(RACINE, 'assets', 'veritas-pages.css'), 'utf8');

let vert = 0, rouge = 0;
const ok = (quoi, cond) => {
  if (cond) { vert++; console.log('  \x1b[32m✓\x1b[0m ' + quoi); }
  else      { rouge++; console.log('  \x1b[31m✗\x1b[0m ' + quoi); }
};
const titre = (t) => console.log('\n\x1b[1m' + t + '\x1b[0m');

/* On retire les commentaires avant d'analyser : le commentaire qui documente le
   défaut CITE l'ancienne règle, et un contrôle naïf la prendrait pour du code. */
const code = CSS.replace(/\/\*[\s\S]*?\*\//g, '');

titre('① La feuille ne peut plus figer une carte');
const kf = (code.match(/@keyframes\s+vrt-monter\s*\{([\s\S]*?\})\s*\}/) || [])[1] || '';
ok('l’animation d’apparition a été trouvée', kf.length > 0);
ok('elle anime `translate`, pas `transform`',
   /translate\s*:/.test(kf) && !/transform\s*:/.test(kf));
ok('aucune règle ne coupe la ligne de temps au survol',
   !/:hover[^{]*\{[^}]*animation-timeline\s*:\s*none/.test(code));
ok('le soulèvement au survol reste sur `transform` (les deux se composent)',
   /\.wrap \.grid > \.card:hover[^{]*\{[^}]*transform\s*:\s*translateY/.test(code));

let chromium = null;
try { ({ chromium } = require('playwright')); } catch (e) { /* absent */ }

function bilan() {
  console.log('\n' + '─'.repeat(68));
  if (rouge === 0) {
    console.log('\x1b[32m\x1b[1m  ✓ ' + vert + '/' + vert + ' — une carte survolée reste là.\x1b[0m');
    process.exit(0);
  }
  console.log('\x1b[31m\x1b[1m  ✗ ' + rouge + ' au rouge sur ' + (vert + rouge) + '.\x1b[0m');
  process.exit(1);
}

if (!chromium) {
  console.log('\n\x1b[33m  Playwright absent — ② et ③ sautés.\x1b[0m');
  bilan();
} else {
  (async () => {
    const BASE = process.env.VRT_BASE || 'http://localhost:8000';
    let nav = null;
    try {
      nav = await chromium.launch();
      const p = await (await nav.newContext({ viewport: { width: 1900, height: 985 } })).newPage();
      await p.goto(BASE + '/corriges/', { waitUntil: 'domcontentloaded', timeout: 30000 });
      await p.waitForTimeout(2500);
      const SEL = '.wrap .grid > .card';
      const n = await p.evaluate((s) => document.querySelectorAll(s).length, SEL);
      if (n < 2) throw new Error('moins de 2 cartes sur /corriges/');

      titre('② Pendant le survol, la carte reste visible et se soulève');
      const lire = (k) => p.evaluate(([s, i]) => {
        const e = document.querySelectorAll(s)[i], c = getComputedStyle(e);
        return { op: +c.opacity, top: e.getBoundingClientRect().top };
      }, [SEL, k]);
      const repos = await lire(1);
      const b = await p.evaluate((s) => {
        const r = document.querySelectorAll(s)[1].getBoundingClientRect();
        return { x: r.left + r.width / 2, y: r.top + r.height / 2 };
      }, SEL);
      await p.mouse.move(b.x, b.y, { steps: 6 });
      await p.waitForTimeout(600);
      const sous = await lire(1);
      ok('opacité pendant le survol = 1 (mesurée : ' + sous.op + ')', sous.op === 1);
      ok('la carte se soulève (' + Math.round(repos.top - sous.top) + ' px)', repos.top - sous.top >= 3);

      titre('③ Après un balayage de la rangée, aucune carte n’a disparu');
      const r0 = await p.evaluate((s) => document.querySelectorAll(s)[0].getBoundingClientRect(), SEL);
      for (let x = r0.left + 20; x < 1500; x += 60) {
        await p.mouse.move(x, r0.top + r0.height / 2, { steps: 3 });
        await p.waitForTimeout(40);
      }
      await p.mouse.move(5, 5);
      await p.waitForTimeout(600);
      const cachees = await p.evaluate((s) => [...document.querySelectorAll(s)]
        .slice(0, 4).filter((e) => +getComputedStyle(e).opacity < 1).length, SEL);
      ok('cartes encore visibles sur la première rangée (' + (4 - cachees) + '/4)', cachees === 0);
    } catch (e) {
      console.log('\n\x1b[33m  Étage navigateur sauté : ' + String(e.message).slice(0, 80) + '\x1b[0m');
      console.log('\x1b[33m  (serveur local requis : php -S localhost:8000 -t .)\x1b[0m');
    }
    if (nav) await nav.close();
    bilan();
  })();
}
