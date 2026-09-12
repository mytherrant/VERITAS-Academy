#!/usr/bin/env node
/* ════════════════════════════════════════════════════════════════════════════
   tests/banc_remise_whatsapp.cjs — L'ACHETEUR REPART AVEC SON CODE
   © 2024-2026 Jacques Miterand TAKOU (Mythe Errant).

       node tests/banc_remise_whatsapp.cjs

   ─── CE QU'IL PROTÈGE, ET POURQUOI ──────────────────────────────────────────

   ① LE BOUTON QUI REND LE CODE PORTABLE.
   La référence d'achat vit dans le `localStorage` de l'appareil qui a payé.
   Téléphone perdu, cache vidé, achat depuis un cybercafé : l'acheteur n'a plus
   aucun chemin vers son code. Les canaux de remise automatique existent
   (api/_notify_lib.php sait faire mail, WhatsApp Cloud API et SMS) mais aucun
   n'est activé, et celui qui l'est par défaut — le courriel — réclame une
   adresse qu'on ne laisse presque jamais : ici on paie avec un téléphone.
   Le bouton « M'envoyer le code sur WhatsApp » ne coûte rien et ne dépend de
   personne : il ouvre WhatsApp avec le message écrit, l'acheteur se l'envoie,
   et le code vit désormais dans une conversation qu'il retrouvera partout.

   ② LES SEPT ÉLÉMENTS DU TUNNEL QUI RENDAIENT SANS STYLE.
   `BTN` est posé dans `style="' + BTN + '"`. Il contenait `font-family:"Baloo
   2"` : ce guillemet double FERMAIT l'attribut, et tout ce qui suivait —
   graisse, taille, remplissage, rayon, curseur — était jeté par l'analyseur.
   Mesuré au navigateur le 12/09/2026, AVANT correctif :

       « Payer 1 500 FCFA »   → 17 px de haut, Arial 13 px, remplissage 1px 6px
       « Retrouver mon code » → idem
       « Ouvrir mon livret »  → idem

   `TTL`, la constante des titres, portait le MÊME guillemet — trouvé par le
   contrôle ② et non à l'œil. Quatre titres de plus rendaient en Arial 13 px.

   Le bouton de PAIEMENT du tunnel de vente rendait donc comme un filet de
   texte rouge. Invisible à la lecture — la feuille est correcte, c'est sa POSE
   qui ne l'était pas — et visible du premier coup d'œil à l'écran.

   ─── DEUX ÉTAGES, ET LE SECOND PEUT MANQUER ────────────────────────────────
   ① à ⑦ lisent les fichiers : ils tournent partout, CI comprise. ⑧ et ⑨
   pilotent un vrai navigateur et mesurent le style CALCULÉ — la seule preuve
   qu'un attribut n'a pas été tronqué. Sans Playwright, le banc s'arrête après
   ⑦ en le disant, et ne fait pas échouer la CI pour une absence d'outil.

   ─── ÉPROUVÉ PAR MUTATION (12/09/2026) ──────────────────────────────────────
   · guillemets doubles rétablis dans BTN      → 4 au rouge (② + les 3 de ⑨,
                                                 mesurés à 17 px et en Arial)
   · plafond de longueur porté à 99999         → 1 au rouge (④)
   · numéro codé en dur dans le lien wa.me     → 2 au rouge (③)
   · bouton WhatsApp retiré du rendu           → 2 au rouge (①)

   Le contrôle ② EXISTE GRÂCE À CES MUTATIONS. Écrit d'abord pour nommer `BTN`,
   il a été élargi à TOUTE constante de style — et il a aussitôt trouvé `TTL`,
   qui portait le même guillemet et que personne n'avait vu. Quatre titres de
   plus sortaient en Arial 13 px : celui du tunnel d'achat, « Paiement en
   cours », « Retrouver mon code » et « Ton code d'accès ». Sept éléments du
   tunnel au total, et non trois. Un banc qui vise la RÈGLE plutôt que le cas
   connu trouve ce que l'auteur du correctif n'a pas cherché.
   ════════════════════════════════════════════════════════════════════════════ */
'use strict';
const fs = require('fs');
const path = require('path');

const RACINE = path.dirname(__dirname);
const GATE = fs.readFileSync(path.join(RACINE, 'livrets', 'gate.js'), 'utf8');

let vert = 0, rouge = 0;
const ok = (quoi, cond) => {
  if (cond) { vert++; console.log('  \x1b[32m✓\x1b[0m ' + quoi); }
  else      { rouge++; console.log('  \x1b[31m✗\x1b[0m ' + quoi); }
};
const titre = (t) => console.log('\n\x1b[1m' + t + '\x1b[0m');

/* ══ ① LE BOUTON EXISTE DANS LE RENDU ═════════════════════════════════════ */
titre('① Le code repart avec l’acheteur');
ok('l’écran de code propose l’envoi WhatsApp',
   /id="vrt-wa"/.test(GATE) && /M'envoyer le code sur WhatsApp/.test(GATE));
ok('un gestionnaire est posé sur ce bouton',
   /getElementById\('vrt-wa'\)\.onclick/.test(GATE));
ok('il n’apparaît que si le lien a pu être construit',
   /\+ \(lienWA\s*\n?\s*\?/.test(GATE) || /\(lienWA[\s\S]{0,40}\?/.test(GATE));

/* ══ ② AUCUN GUILLEMET DOUBLE DANS UNE CONSTANTE DE STYLE ═════════════════ */
titre('② Une constante de style ne referme pas son attribut');
/* La règle, et c'est elle qui compte : toute constante posée dans un
   `style="…"` doit être exempte de guillemet double. On les relève toutes
   plutôt que de nommer BTN — une quatrième constante créée demain serait
   soumise au même contrôle sans que personne y pense. */
const constantes = [...GATE.matchAll(/^\s*var (BTN\w*|INP|TTL|SUB) = ([\s\S]*?);\s*$/gm)];
ok('au moins quatre constantes de style relevées', constantes.length >= 4);
const fautives = constantes
  .filter(m => /"/.test(m[2].replace(/\\"/g, '')))
  .map(m => m[1]);
ok('aucune ne porte de guillemet double' + (fautives.length ? ' — fautive(s) : ' + fautives.join(', ') : ''),
   fautives.length === 0);
ok('la police reste déclarée (on n’a pas corrigé en la supprimant)',
   /font-family:\\'Baloo 2\\'/.test(GATE));

/* ══ ③ LE LIEN N'ENVOIE À PERSONNE D'AUTRE QU'À SOI ═══════════════════════ */
titre('③ Le lien laisse l’acheteur choisir son propre fil');
ok('wa.me est appelé SANS numéro de destinataire',
   /'https:\/\/wa\.me\/\?text='/.test(GATE));
ok('aucun numéro du centre n’est codé en dur dans le lien',
   !/wa\.me\/\d/.test(GATE));
ok('le message est encodé pour l’URL', /encodeURIComponent\(texte\)/.test(GATE));
ok('la fenêtre s’ouvre sans laisser la main sur la page du code',
   /window\.open\(lienWA, '_blank', 'noopener'\)/.test(GATE));

/* ══ ④ LA BORNE DE LONGUEUR ═══════════════════════════════════════════════ */
titre('④ Un pack établissement ne part pas tronqué');
/* On exécute les deux fonctions pour de vrai plutôt que de relire leur code :
   un plafond écrit n'est pas un plafond appliqué. */
/* Borne prise sur `function ecranCode(` SANS ses paramètres : la première
   version visait `ecranCode(r)` et a cessé de trouver la borne le jour où la
   fonction a pris un second argument. indexOf rendait -1, la découpe emportait
   tout le fichier, et le banc tombait sur une erreur de syntaxe au lieu de
   dire ce qui n'allait pas. Une borne de découpe ne doit pas dépendre d'une
   signature. */
const finBloc = GATE.indexOf('function ecranCode(');
if (finBloc < 0) { console.error('borne « function ecranCode( » introuvable'); process.exit(2); }
const bloc = GATE.slice(GATE.indexOf('function messageWhatsApp('), finBloc);
const fabrique = new Function('location',
  bloc + '\nreturn { messageWhatsApp, lienWhatsApp };');
const { messageWhatsApp, lienWhatsApp } =
  fabrique({ origin: 'https://veritas-school.com', pathname: '/livrets/6e.html' });

const unCode = messageWhatsApp('VRT-6E-K7D8-S8UU', '6e');
const lien1 = lienWhatsApp(unCode);
ok('un code unique produit un lien', lien1.length > 0);
ok('le message se retrouve intact après décodage',
   decodeURIComponent(lien1.split('text=')[1]) === unCode);
ok('le code figure bien dans le message', unCode.includes('VRT-6E-K7D8-S8UU'));
ok('le lien pour ouvrir le cahier y figure aussi',
   unCode.includes('https://veritas-school.com/livrets/6e.html'));

const lot = (n) => Array.from({ length: n }, (_, i) =>
  'VRT-6E-AAAA-' + String(i).padStart(4, '0')).join('\n');
ok('un lot de 40 codes passe encore', lienWhatsApp(messageWhatsApp(lot(40), '6e')).length > 0);
ok('un lot de 500 codes ne produit PAS de lien tronqué',
   lienWhatsApp(messageWhatsApp(lot(500), '6e')) === '');

/* ══ ⑤ LA REMISE AUTOMATIQUE : LE CANAL PAR DÉFAUT ════════════════════════ */
titre('⑤ Coller un jeton WhatsApp suffit à l’activer');
const NOTIFY = fs.readFileSync(path.join(RACINE, 'api', '_notify_lib.php'), 'utf8');
/* Le défaut valait « mail » seul : les identifiants Meta collés dans
   payment_config.php restaient sans effet tant qu'on n'avait pas trouvé AUSSI
   VRT_NOTIFY_CANAL. Un réglage qui en exige un second, non documenté là où l'on
   travaille, ne sera pas fait. */
/* On isole LA ligne du défaut plutôt que d'en deviner la forme à coups
   d'échappements : une regex trop précise cesse de mordre au premier
   reformatage, et un banc qui ne mord plus est pire qu'absent. */
const ligneDefaut = NOTIFY.split('\n')
  .filter(function (l) { return l.indexOf("defined('VRT_NOTIFY_CANAL')") >= 0; })
  .join(' ');
ok('la ligne du défaut a bien été trouvée', ligneDefaut.length > 0);
ok('le défaut essaie WhatsApp puis le courriel',
   ligneDefaut.indexOf("'whatsapp,mail'") >= 0);
ok('WhatsApp passe AVANT le courriel (on paie avec un téléphone)',
   ligneDefaut.indexOf("'mail,whatsapp'") < 0);
ok('le SMS reste hors du défaut — il se facture au message',
   ligneDefaut.indexOf('http') < 0);
ok('un canal non configuré sort proprement au lieu de jeter',
   /'msg' => 'VRT_WA_PHONE_ID \/ VRT_WA_TOKEN non configures'/.test(NOTIFY));

/* ══ ⑥ LA COPIE PAR E-MAIL, DEMANDÉE APRÈS COUP ═══════════════════════════ */
titre('⑥ L’acheteur peut ajouter son adresse après avoir été servi');
const LIVRET = fs.readFileSync(path.join(RACINE, 'api', 'livret.php'), 'utf8');
const blocCopie = LIVRET.slice(LIVRET.indexOf("if ($action === 'copie')"),
                               LIVRET.indexOf("lv_err(400, 'Action inconnue.'"));
ok('l’action existe côté serveur', blocCopie.length > 200);
/* LA garde qui compte : sans elle, deviner une référence ferait envoyer le
   code d'autrui à sa propre adresse. */
ok('elle exige le numéro payeur, pas seulement la référence',
   /vrt_livret_tel4_hash/.test(blocCopie) && /hash_equals/.test(blocCopie));
ok('elle refuse une adresse mal formée',
   /FILTER_VALIDATE_EMAIL/.test(blocCopie));
ok('elle est plafonnée comme `claim`',
   /lv_echecs_recents\(\) >= LV_MAX_ECHECS/.test(blocCopie));
ok('le code renvoyé vient de la VENTE, jamais de la requête',
   /\$v\['code'\]/.test(blocCopie) && !/\$in\['code'\]/.test(blocCopie));
ok('le client expose l’appel', /copie: function \(ref, tel, mail\)/.test(GATE));
ok('le champ ne s’affiche que si la référence est connue',
   /\(ctx && ctx\.ref/.test(GATE));
ok('le bouton se verrouille pendant l’envoi (pas de double remise)',
   /b\.disabled = true; b\.textContent = 'Envoi…'/.test(GATE));

/* ══ ⑦ L'ESSAI GRATUIT EST SUR LE CHEMIN DE L'ACHAT ═══════════════════════ */
titre('⑦ On peut essayer avant de payer');
/* `livrets/apercu.html` — deux leçons entières et gratuites — existe depuis
   longtemps, et `livrets/index.html` y mène 23 fois. Mais depuis l'unification
   de la boutique (30/08), la carte d'un cahier dépose l'acheteur sur la page de
   SON ouvrage, et ces pages-là n'y menaient pas une seule fois. Le seul chemin
   réel vers l'achat était donc le seul d'où l'essai avait disparu. */
ok('le tunnel propose de lire gratuitement', /id="vrt-essai"/.test(GATE));
ok('il mène à la page d’aperçu', /href="\/livrets\/apercu\.html"/.test(GATE));
ok('la page d’aperçu existe',
   fs.existsSync(path.join(RACINE, 'livrets', 'apercu.html')));
/* Elle doit RAMENER vers l'achat : un essai qui ne convertit pas est une fuite. */
const APERCU = fs.readFileSync(path.join(RACINE, 'livrets', 'apercu.html'), 'utf8');
ok('l’aperçu ramène vers l’achat', /Obtenir\s+(le cahier|mon code)/.test(APERCU));
/* Sous le bouton de paiement : celui qui est décidé ne doit pas être détourné. */
ok('le lien est placé APRÈS le bouton « Payer »',
   GATE.indexOf('id="vrt-essai"') > GATE.indexOf('id="vrt-go"'));

/* ══ ÉTAGE NAVIGATEUR ═════════════════════════════════════════════════════ */
let chromium = null;
try { ({ chromium } = require('playwright')); } catch (e) { /* absent */ }

if (!chromium) {
  console.log('\n\x1b[33m  Playwright absent — les contrôles ⑧ et ⑨ sont sautés.\x1b[0m');
  bilan();
} else {
  (async () => {
    const BASE = process.env.VRT_BASE || 'http://localhost:8000';
    const nav = await chromium.launch();
    try {
      const ctx = await nav.newContext({ viewport: { width: 430, height: 900 } });
      const p = await ctx.newPage();
      await p.goto(BASE + '/livrets/6e.html', { waitUntil: 'domcontentloaded', timeout: 45000 });
      await p.waitForTimeout(4000);

      titre('⑧ L’écran d’achat, mesuré dans le navigateur');
      const ouvert = await p.evaluate(() => {
        try { window.VRTLivret.acheter({}); return true; } catch (e) { return String(e); }
      });
      ok('le tunnel d’achat s’ouvre', ouvert === true);
      await p.waitForTimeout(1500);

      titre('⑨ Un bouton d’action n’est pas un filet de texte');
      const m = await p.evaluate(() => {
        const lire = (id) => {
          const e = document.getElementById(id);
          if (!e) return null;
          const c = getComputedStyle(e);
          return { h: e.offsetHeight, pad: c.padding, police: c.fontFamily.split(',')[0],
                   rayon: c.borderRadius };
        };
        return { payer: lire('vrt-go'), retrouver: lire('vrt-go2') };
      });
      /* 40 px : un bouton tactile. Le défaut mesuré en rendait 17. */
      ok('« Payer » dépasse 40 px de haut' + (m.payer ? ' (' + m.payer.h + ')' : ''),
         !!m.payer && m.payer.h >= 40);
      ok('« Payer » porte la police de la maquette' + (m.payer ? ' (' + m.payer.police + ')' : ''),
         !!m.payer && /Baloo/.test(m.payer.police));
      ok('« Payer » a son remplissage et son rayon',
         !!m.payer && m.payer.pad !== '1px 6px' && m.payer.rayon !== '0px');
      await ctx.close();
    } catch (e) {
      console.log('\n\x1b[31m  Étage navigateur interrompu : ' + String(e.message).slice(0, 90) + '\x1b[0m');
      console.log('  \x1b[33m(serveur local requis : php -S localhost:8000 -t .)\x1b[0m');
    }
    await nav.close();
    bilan();
  })();
}

function bilan() {
  console.log('\n' + '─'.repeat(68));
  if (rouge === 0) {
    console.log('\x1b[32m\x1b[1m  ✓ ' + vert + '/' + vert + " — l'acheteur repart avec son code.\x1b[0m");
    process.exit(0);
  }
  console.log('\x1b[31m\x1b[1m  ✗ ' + rouge + ' au rouge sur ' + (vert + rouge) + '.\x1b[0m');
  process.exit(1);
}
