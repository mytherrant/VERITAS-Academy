#!/usr/bin/env node
/* Messages de la semaine — Atelier de Français.
 *
 * Lit la banque (ATELIER_MESSAGES_ESSAI.md, ATELIER_MESSAGES_PROGRAMME.md,
 * ATELIER_MESSAGES_SERIE2.md), choisit les messages de la semaine par rotation
 * et écrit, pour chaque créneau, UN message prêt à copier accompagné de ses
 * liens de partage (WhatsApp, Telegram, Facebook) :
 *   promo/semaine/<lundi>.md    à lire ou copier
 *   promo/semaine/<lundi>.html  à ouvrir : un bouton par réseau, un bouton « Copier »
 *
 * Rien n'est publié : chaque lien ouvre le réseau avec le message prérempli,
 * et c'est l'utilisateur qui choisit le groupe et envoie.
 *
 *   node promo/message_semaine.cjs                    semaine en cours, 3 messages
 *   node promo/message_semaine.cjs --par-semaine=2    2 messages (lundi, jeudi)
 *   node promo/message_semaine.cjs --date=2026-11-02
 *   node promo/message_semaine.cjs --liste            calendrier complet
 */
'use strict';
const fs = require('fs');
const path = require('path');

const DIR = __dirname;
const SOURCES = ['ATELIER_MESSAGES_ESSAI.md', 'ATELIER_MESSAGES_PROGRAMME.md', 'ATELIER_MESSAGES_SERIE2.md'];
const DEBUT = new Date(Date.UTC(2026, 9, 19)); /* lundi 19/10/2026 = semaine 0 */
const JOUR = 24 * 3600 * 1000;
/* Décalage en jours depuis le lundi, selon le nombre de messages par semaine. */
const CRENEAUX = { 1: [0], 2: [0, 3], 3: [0, 2, 4] };
const NOMS_JOURS = ['lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi'];

/* Une section = un titre « ## 1. … », « ### P1. … » ou « ### X1. … » suivi des
   blocs WhatsApp et Facebook. Les sections réservées à Jacques (« Points
   relevés », « Sources ») n'ont pas ces blocs et sont donc ignorées. */
function lireBanque(fichier) {
  const md = fs.readFileSync(path.join(DIR, fichier), 'utf8').replace(/\r\n/g, '\n');
  const sections = md.split(/^(?=#{2,3} [A-Z]?\d+\. )/m).slice(1);
  const out = [];
  for (const s of sections) {
    /* « 1. Point de méthode — `utm_campaign=astuces` » : le repère technique ne sert qu'au fichier source. */
    const titre = s.split('\n')[0].replace(/^#+ /, '').replace(/ — `[^`]*`$/, '').trim();
    const wa = bloc(s, '**WhatsApp**', '**Facebook**');
    if (!wa || !bloc(s, '**Facebook**', null)) continue;
    const src = (s.match(/^\*Sources? ?:[^\n]*\*$/m) || [''])[0].replace(/^\*|\*$/g, '');
    out.push({ id: titre.split('.')[0], titre, texte: wa, source: src || 'Source : ' + fichier });
  }
  return out;
}

/* Les lignes citées (« > ») qui suivent le marqueur, jusqu'au marqueur de fin. */
function bloc(section, debut, fin) {
  const i = section.indexOf(debut);
  if (i < 0) return '';
  let reste = section.slice(i + debut.length);
  if (fin) { const j = reste.indexOf(fin); if (j >= 0) reste = reste.slice(0, j); }
  const lignes = [];
  for (const l of reste.split('\n')) {
    if (/^>/.test(l)) lignes.push(l.replace(/^> ?/, ''));
    else if (lignes.length && l.trim() !== '') break;
  }
  return lignes.join('\n').trim();
}

/* Familles : essai, programme 1er cycle (P1-P12), programme 2nd cycle (P13+),
   examens (X), premier cycle (A), second cycle (B), textes supports (C).
   Chaque famille est étalée sur tout le cycle (le k-ième de n items est placé
   à la position (k + 0,5) / n) : on n'enchaîne pas trois grilles d'affilée et
   les petites familles ne s'épuisent pas dès les premières semaines. */
function famille(id) {
  if (/^\d/.test(id)) return 0;
  if (id[0] === 'P') return +id.slice(1) <= 12 ? 1 : 2;
  return 3 + 'XABC'.indexOf(id[0]);
}
function rotation() {
  const tous = SOURCES.flatMap(lireBanque);
  const groupes = {};
  tous.forEach(m => (groupes[famille(m.id)] = groupes[famille(m.id)] || []).push(m));
  const places = [];
  Object.keys(groupes).forEach(f => groupes[f].forEach((m, k) =>
    places.push({ m, cle: (k + 0.5) / groupes[f].length, f: +f })));
  return places.sort((a, b) => a.cle - b.cle || a.f - b.f).map(p => p.m);
}

const iso = d => d.toISOString().slice(0, 10);
const fr = d => d.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' });
function lundi(d) {
  const x = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
  x.setUTCDate(x.getUTCDate() - ((x.getUTCDay() + 6) % 7));
  return x;
}
const pourCanal = (txt, canal) => txt.replace(/utm_source=[a-z]+/g, 'utm_source=' + canal);
const LIEN = /https:\/\/veritas-school\.com\/\S+/;

/* WhatsApp et Telegram reçoivent le texte complet ; Facebook n'accepte qu'une
   adresse : le texte se colle dans la publication après ouverture. */
function liensPartage(texte) {
  const wa = pourCanal(texte, 'whatsapp');
  const tg = pourCanal(texte, 'telegram');
  const lienTg = (tg.match(LIEN) || [''])[0];
  const lienFb = ((pourCanal(texte, 'facebook')).match(LIEN) || [''])[0];
  return {
    whatsapp: 'https://wa.me/?text=' + encodeURIComponent(wa),
    telegram: 'https://t.me/share/url?url=' + encodeURIComponent(lienTg)
      + '&text=' + encodeURIComponent(tg.replace(lienTg, '').trim()),
    facebook: 'https://www.facebook.com/sharer/sharer.php?u=' + encodeURIComponent(lienFb)
  };
}

const esc = s => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

function pageHtml(titre, items) {
  const cartes = items.map((it, i) => `
  <article>
    <p class="quand">${esc(it.jour)} · message ${it.rang} sur ${it.total}</p>
    <h2>${esc(it.m.titre)}</h2>
    <pre id="t${i}">${esc(pourCanal(it.m.texte, 'whatsapp'))}</pre>
    <div class="actions">
      <a class="wa" href="${esc(it.liens.whatsapp)}" target="_blank" rel="noopener">WhatsApp</a>
      <a class="tg" href="${esc(it.liens.telegram)}" target="_blank" rel="noopener">Telegram</a>
      <a class="fb" href="${esc(it.liens.facebook)}" target="_blank" rel="noopener">Facebook</a>
      <button type="button" data-t="t${i}">Copier le texte</button>
    </div>
    <p class="src">${esc(it.m.source)}</p>
  </article>`).join('\n');
  return `<!doctype html>
<html lang="fr"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>${esc(titre)}</title>
<style>
  body{margin:0;background:#f5f6fa;color:#142554;font:16px/1.5 system-ui,sans-serif}
  main{max-width:720px;margin:0 auto;padding:24px 16px}
  h1{font-size:1.3rem;margin:0 0 4px}
  .aide{color:#555;margin:0 0 20px;font-size:.92rem}
  article{background:#fff;border:1px solid #dde1ea;border-radius:10px;padding:16px;margin-bottom:18px}
  .quand{margin:0;color:#777;font-size:.85rem}
  h2{font-size:1.05rem;margin:4px 0 10px}
  pre{white-space:pre-wrap;font:inherit;background:#fafbfd;border-left:3px solid #FFC93C;padding:10px 12px;margin:0 0 12px}
  .actions{display:flex;flex-wrap:wrap;gap:8px}
  .actions a,.actions button{border:0;border-radius:6px;padding:8px 14px;font:inherit;font-size:.92rem;color:#fff;text-decoration:none;cursor:pointer}
  .wa{background:#1f8f4e}.tg{background:#1c7fc0}.fb{background:#2d4f9e}
  .actions button{background:#142554}
  .src{margin:10px 0 0;color:#888;font-size:.8rem}
</style></head>
<body><main>
  <h1>${esc(titre)}</h1>
  <p class="aide">Chaque bouton ouvre le réseau avec le message prérempli : choisissez le groupe, relisez, envoyez. Pour Facebook, collez le texte copié dans la publication.</p>
${cartes}
</main>
<script>
document.querySelectorAll('button[data-t]').forEach(function(b){
  b.addEventListener('click',function(){
    var t=document.getElementById(b.getAttribute('data-t')).textContent;
    var ok=function(){b.textContent='Copié';setTimeout(function(){b.textContent='Copier le texte'},1500)};
    if(navigator.clipboard)navigator.clipboard.writeText(t).then(ok,function(){});
  });
});
</script>
</body></html>
`;
}

function main() {
  const args = process.argv.slice(2);
  const ordre = rotation();
  if (!ordre.length) { console.error('Banque vide : aucun message lisible.'); process.exit(1); }
  const p = args.find(x => x.startsWith('--par-semaine='));
  const parSemaine = p ? +p.slice(14) : 3;
  if (!CRENEAUX[parSemaine]) { console.error('--par-semaine vaut 1, 2 ou 3.'); process.exit(1); }
  const creneaux = CRENEAUX[parSemaine];

  if (args.includes('--liste')) {
    ordre.forEach((m, k) => {
      const s = Math.floor(k / parSemaine);
      const d = new Date(DEBUT.getTime() + (s * 7 + creneaux[k % parSemaine]) * JOUR);
      console.log(iso(d) + '  ' + m.titre);
    });
    console.log('\n' + ordre.length + ' messages · ' + parSemaine + ' par semaine · un cycle complet = '
      + Math.ceil(ordre.length / parSemaine) + ' semaines.');
    return;
  }

  const a = args.find(x => x.startsWith('--date='));
  const jour = a ? new Date(a.slice(7) + 'T12:00:00') : new Date();
  if (isNaN(jour)) { console.error('Date illisible : ' + a); process.exit(1); }
  const l = lundi(jour);
  const n = Math.floor((l - DEBUT) / (7 * JOUR));

  const items = creneaux.map((dec, k) => {
    const idx = (((n * parSemaine + k) % ordre.length) + ordre.length) % ordre.length;
    const d = new Date(l.getTime() + dec * JOUR);
    return { m: ordre[idx], rang: idx + 1, total: ordre.length, liens: liensPartage(ordre[idx].texte),
      jour: NOMS_JOURS[dec] + ' ' + fr(d) };
  });

  const titre = 'Messages de la semaine du ' + fr(l);
  const md = ['# ' + titre, '',
    '*Un message par créneau. Les liens ouvrent le réseau avec le texte prérempli ; '
    + 'pour Facebook, collez le texte dans la publication. À relire avant d\'envoyer.*', ''];
  items.forEach(it => {
    md.push('---', '', '## ' + it.jour[0].toUpperCase() + it.jour.slice(1) + ' — ' + it.m.titre, '',
      '*Message ' + it.rang + ' sur ' + it.total + ' · ' + it.m.source + '*', '',
      pourCanal(it.m.texte, 'whatsapp'), '',
      '**Partager :** [WhatsApp](' + it.liens.whatsapp + ') · [Telegram](' + it.liens.telegram
      + ') · [Facebook](' + it.liens.facebook + ')', '');
  });

  const dest = path.join(DIR, 'semaine');
  fs.mkdirSync(dest, { recursive: true });
  const base = path.join(dest, iso(l));
  fs.writeFileSync(base + '.md', md.join('\n'), 'utf8');
  fs.writeFileSync(base + '.html', pageHtml(titre, items), 'utf8');
  items.forEach(it => console.log(it.jour + ' · ' + it.m.titre));
  console.log('→ ' + path.relative(process.cwd(), base) + '.md / .html');
}

main();
