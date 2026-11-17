#!/usr/bin/env node
/* Épreuves séquentielles → PDF vectoriels compilés en LaTeX (énoncé + corrigé).

     node tools/latex/sequentielles_pdf.cjs <sources> <ftp> [--tout] [id…]

   <sources> = sources privées (apprendre_prive/sequentielles), hors dépôt : le sujet
   complet et le corrigé n'entrent jamais dans le dépôt PUBLIC.
   Écrit <ftp>/uploads/protected/apprendre/<id>-enonce.pdf et <id>-corrige.pdf, à déposer
   par FTP à côté de <id>.json. api/apprendre.php les sert sous le même verrou que la suite
   du sujet (abonné dont la formule couvre la classe, ou achat à l'unité).

   Par défaut : les épreuves publiées (tools/sequentielles/_liste.json). Un PDF plus récent
   que sa source et que le gabarit n'est pas recompilé. --tout recompile tout. */
'use strict';
const fs = require('fs');
const path = require('path');
const { compiler } = require('./compiler.cjs');

const R = path.resolve(__dirname, '..', '..');
const ARGS = process.argv.slice(2);
const TOUT = ARGS.includes('--tout');
const [src, ftp, ...ids] = ARGS.filter(a => !a.startsWith('--'));
if (!src || !ftp) { console.error('Usage : node tools/latex/sequentielles_pdf.cjs <sources> <ftp> [--tout] [id…]'); process.exit(2); }
const SORTIE = path.join(ftp, 'uploads/protected/apprendre');
const CLASSES = { '3e': '3e', '1re A': '1re-a', '1re C': '1re-c', '1re D': '1re-d', 'Tle A': 'tle-a', 'Tle C': 'tle-c', 'Tle D': 'tle-d' };

/* ── HTML (sous-ensemble des sources : p, h3, ol/ul/li, table, strong, em, sup, sub, br, span, div) ── */
const VIDES = new Set(['br', 'hr', 'img', 'col']);
function arbre(html) {
  const racine = { tag: '#', at: '', enfants: [] }, pile = [racine];
  const re = /<!--[\s\S]*?-->|<\/?([a-zA-Z][a-zA-Z0-9]*)([^>]*)>|([^<]+)/g;
  let m;
  while ((m = re.exec(html))) {
    const haut = pile[pile.length - 1];
    if (m[0].startsWith('<!--')) continue;
    if (m[3] !== undefined) { haut.enfants.push({ texte: m[3] }); continue; }
    const tag = m[1].toLowerCase();
    if (m[0].startsWith('</')) {
      const i = pile.map(n => n.tag).lastIndexOf(tag);
      if (i > 0) pile.length = i;
      continue;
    }
    const n = { tag, at: m[2] || '', enfants: [] };
    haut.enfants.push(n);
    if (!VIDES.has(tag) && !/\/\s*$/.test(m[2] || '')) pile.push(n);
  }
  return racine;
}
const ENT = { amp: '&', lt: '<', gt: '>', quot: '"', apos: "'", nbsp: '\u00a0', laquo: '«', raquo: '»', hellip: '…', ndash: '–', mdash: '—', rsquo: '’', lsquo: '‘', eacute: 'é', egrave: 'è', agrave: 'à', deg: '°', times: '×' };
const decoder = s => s.replace(/&(#x[0-9a-f]+|#\d+|[a-z]+);/gi, (t, e) =>
  e[0] === '#' ? String.fromCodePoint(e[1] === 'x' || e[1] === 'X' ? parseInt(e.slice(2), 16) : +e.slice(1)) : (ENT[e.toLowerCase()] ?? t));
const texteDe = n => n.texte !== undefined ? decoder(n.texte) : n.enfants.map(texteDe).join('');

/* ── Texte → LaTeX ── */
const EXP = { '⁰': '0', '¹': '1', '²': '2', '³': '3', '⁴': '4', '⁵': '5', '⁶': '6', '⁷': '7', '⁸': '8', '⁹': '9', '⁺': '+', '⁻': '\\sym{−}', 'ᵉ': 'e', 'ʳ': 'r', 'ᵈ': 'd', 'ˢ': 's', 'ᵗ': 't', 'ⁿ': 'n', 'ᵒ': 'o' };
const IND = { '₀': '0', '₁': '1', '₂': '2', '₃': '3', '₄': '4', '₅': '5', '₆': '6', '₇': '7', '₈': '8', '₉': '9', '₊': '+', '₋': '\\sym{−}' };
const SYM = /[√−≈≠≤≥∈∉∩∪⊂ℝℕℤℚ∅πα-ωΔΩΣΦ∞⊥∥∠⇔⇒⇐→←↔↦∀∃∑∫∂∆·]/;
function latex(s) {
  s = s.replace(/[\\{}$&#%_^~]/g, c => ({ '\\': '\\textbackslash{}', '{': '\\{', '}': '\\}', '$': '\\$', '&': '\\&', '#': '\\#', '%': '\\%', '_': '\\_', '^': '\\^{}', '~': '\\textasciitilde{}' })[c]);
  // Accent circonflexe combinant (angle B̂) posé sur la lettre qui précède.
  s = s.replace(/(\p{L})\u0302/gu, '\\^{$1}');
  s = s.replace(/[⁰¹²³⁴⁵⁶⁷⁸⁹⁺⁻ᵉʳᵈˢᵗⁿᵒ]+/g, r => '\\textsuperscript{' + [...r].map(c => EXP[c]).join('') + '}');
  s = s.replace(/[₀-₉₊₋]+/g, r => '\\textsubscript{' + [...r].map(c => IND[c]).join('') + '}');
  s = [...s].map(c => c === '·' ? c : SYM.test(c) ? '\\sym{' + c + '}' : c).join('');
  // Milliers (\u00ab 1 071 \u00bb, \u00ab 45 500 \u00bb) : espace fine ins\u00e9cable, le nombre ne se coupe plus.
  s = s.replace(/(\d)[ \u00a0\u202f](?=\d{3}(?!\d))/g, '$1\\,');
  return s.replace(/\u00a0/g, '~').replace(/\u202f/g, '\\,');
}

/* Barème simple « (1 pt) » ou composé « (0,5 pt × 2 = 1 pt) », « (0,5 pt + 0,25 pt × 2 = 1 pt) » :
   tous passent en marge droite. Sans cela, le composé restait du gras dans la phrase et la
   justification l'étirait sur toute la ligne. Il doit finir par une unité. */
const PTS = /^\(?\s*\d+(?:[,.]\d+)?\s*(?:pts?|points?|marks?|puntos?|Punkte?|P\.)?(?:\s*[×x*+=]\s*\d+(?:[,.]\d+)?\s*(?:pts?|points?|marks?|puntos?|Punkte?|P\.)?)*\s*\)?$/i;
const PTS_FIN = /(?:pts?|points?|marks?|puntos?|Punkte?|P\.)\s*\)?$/i;
const estBareme = s => PTS.test(s) && PTS_FIN.test(s);
const blanc = n => n.texte !== undefined && !n.texte.trim();
function enLigne(enfants) {
  return enfants.map(n => {
    if (n.texte !== undefined) return latex(decoder(n.texte).replace(/\s+/g, ' '));
    const c = enLigne(n.enfants);
    switch (n.tag) {
      case 'strong': case 'b': return c.trim() ? '\\textbf{' + c + '}' : c;
      case 'em': case 'i': return c.trim() ? '\\emph{' + c + '}' : c;
      case 'sup': return '\\textsuperscript{' + c + '}';
      case 'sub': return '\\textsubscript{' + c + '}';
      case 'br': return '\\newline ';
      case 'u': return '\\underline{' + c + '}';
      default: return c;
    }
  }).join('');
}
/** Contenu d'un paragraphe ou d'un item : les points en fin de ligne passent en marge droite. */
function ligne(enfants) {
  const e = enfants.slice();
  while (e.length && blanc(e[e.length - 1])) e.pop();
  const der = e[e.length - 1];
  if (der && (der.tag === 'strong' || der.tag === 'b') && estBareme(texteDe(der).trim())) {
    return enLigne(e.slice(0, -1)).trim() + '\\pts{' + latex(texteDe(der).trim()) + '}';
  }
  return enLigne(e).trim();
}
function seulGras(n) {
  const e = n.enfants.filter(x => !blanc(x));
  return e.length === 1 && (e[0].tag === 'strong' || e[0].tag === 'b');
}
function bloc(n) {
  if (n.texte !== undefined) { const t = decoder(n.texte).trim(); return t ? latex(t) + '\n\n' : ''; }
  switch (n.tag) {
    case 'h2': case 'h3': case 'h4': return '\\partie{' + enLigne(n.enfants).trim() + '}\n\n';
    case 'p': {
      if (seulGras(n)) return '\\soustitre{' + enLigne(n.enfants.filter(x => !blanc(x))[0].enfants).trim() + '}\n\n';
      const c = ligne(n.enfants);
      return c ? c + (/\\pts\{[^}]*\}$/.test(c) ? '\n' : '\n\n') : '';
    }
    case 'ol': case 'ul': {
      const env = n.tag === 'ol' ? 'enumerate' : 'itemize';
      const items = n.enfants.filter(x => x.tag === 'li').map(li => {
        // Un item peut contenir une liste ou un tableau : ces blocs-là sont rendus comme tels.
        const enLigneSeul = li.enfants.every(x => x.texte !== undefined || !['ol', 'ul', 'table', 'p', 'div'].includes(x.tag));
        // \item{} : un item qui commence par « [ » ne doit pas passer pour l'étiquette optionnelle.
        return '  \\item{} ' + (enLigneSeul ? ligne(li.enfants) : li.enfants.map(x => x.texte !== undefined || !['ol', 'ul', 'table', 'p', 'div'].includes(x.tag) ? enLigne([x]) : '\n' + bloc(x)).join('').trim());
      });
      return '\\begin{' + env + '}\n' + items.join('\n') + '\n\\end{' + env + '}\n\n';
    }
    case 'table': {
      const lignes = [];
      (function cherche(x) { x.enfants.forEach(y => { if (y.tag === 'tr') lignes.push(y); else if (y.enfants) cherche(y); }); })(n);
      const nc = Math.max(...lignes.map(tr => tr.enfants.filter(c => c.tag === 'td' || c.tag === 'th').length));
      const spec = '|' + Array(nc).fill('>{\\raggedright\\arraybackslash}X').join('|') + '|';
      const corps = lignes.map(tr => {
        const cells = tr.enfants.filter(c => c.tag === 'td' || c.tag === 'th');
        while (cells.length < nc) cells.push({ tag: 'td', enfants: [] });
        return cells.map(c => (c.tag === 'th' ? '\\textbf{' + enLigne(c.enfants).trim() + '}' : enLigne(c.enfants).trim())).join(' & ') + ' \\\\ \\hline';
      }).join('\n');
      return '\\begin{center}\\small\\renewcommand\\arraystretch{1.25}\n\\begin{tabularx}{\\linewidth}{' + spec + '}\\hline\n' + corps + '\n\\end{tabularx}\\end{center}\n\n';
    }
    case 'br': return '\n\n';
    case 'div': case 'section': case 'article': case 'blockquote': case 'span': case '#':
      return n.enfants.map(bloc).join('');
    default: {
      const c = enLigne([n]).trim();
      return c ? c + '\n\n' : '';
    }
  }
}

function classeTeX(c) {
  const m = /^(\d+)(e|re)(?:\s+([A-Z]))?$/.exec(c) || /^(T)(le)(?:\s+([A-Z]))?$/.exec(c);
  return m ? m[1] + '\\textsuperscript{' + m[2] + '}' + (m[3] ? '~' + m[3] : '') : latex(c);
}

/** Source privée → document LaTeX complet. */
function document(srcHtml, item) {
  const meta = JSON.parse((/<!--meta\s*(\{[\s\S]*?\})\s*-->/.exec(srcHtml) || [])[1] || '{}');
  const part = nom => { const m = new RegExp('<!--' + nom + '-->([\\s\\S]*?)<!--/' + nom + '-->').exec(srcHtml); return m ? m[1] : ''; };
  const sujet = part('sujet').replace('<!--coupe-->', ''), corrige = part('corrige');
  if (sujet.length < 300 || corrige.length < 300) throw new Error('sujet ou corrigé absent');
  const A = arbre(sujet);
  // En-tête de la source : « Évaluation n° 1 » | matière · classe | durée · coef.
  const ent = A.enfants.find(n => n.tag === 'div' && /sq-entete/.test(n.at));
  const spans = ent ? ent.enfants.filter(n => n.tag === 'span').map(texteDe) : [];
  A.enfants = A.enfants.filter(n => n !== ent);
  // Consignes : les paragraphes ordinaires qui précèdent le premier titre.
  const consignes = [];
  while (A.enfants.length) {
    const n = A.enfants[0];
    if (blanc(n)) { A.enfants.shift(); continue; }
    if (n.tag !== 'p' || seulGras(n)) break;
    consignes.push(A.enfants.shift());
  }
  const corps = A.enfants.map(bloc).join('').replace(/\n{3,}/g, '\n\n');
  const coef = meta.coef != null ? String(meta.coef) : '';
  return [
    '\\documentclass{veritas-epreuve}',
    '\\classe{' + classeTeX(meta.classe || item.classe) + '}',
    '\\matiere{' + latex(item.matiere) + '}',
    /^[AEÉÈIOUHaeéèiouh]/.test(item.matiere) ? "\\prefixe{D'}" : '',
    ['anglais', 'espagnol', 'allemand'].includes(item.m) ? '\\langueetrangere' : '',
    '\\epreuve{' + latex(spans[0] || (meta.seq === 'blanc' ? 'Examen blanc' : 'Évaluation n° ' + meta.seq)) + '}',
    '\\duree{' + latex(String(meta.duree || '')) + '}',
    coef ? '\\coefficient{' + latex(coef) + '}' : '',
    '\\begin{document}',
    '\\titreepreuve',
    // La source dit déjà « Consigne : … » : pas de second intitulé devant.
    consignes.length ? (/^\s*Consignes?\b/i.test(texteDe(consignes[0]))
      ? '{\\small ' + consignes.map(bloc).join('').trim() + '\\par}\\medskip\n'
      : '\\begin{consignes}\n' + consignes.map(bloc).join('').trim() + '\n\\end{consignes}\n') : '',
    corps,
    '\\begin{corrige}',
    arbre(corrige).enfants.map(bloc).join('').replace(/\n{3,}/g, '\n\n'),
    '\\end{corrige}',
    '\\end{document}', ''
  ].filter(x => x !== '').join('\n');
}

/* ── Épreuves à compiler ── */
const liste = JSON.parse(fs.readFileSync(path.join(R, 'tools/sequentielles/_liste.json'), 'utf8'));
const gabarit = Math.max(...['veritas-epreuve.cls', 'compiler.cjs', 'sequentielles_pdf.cjs'].map(f => fs.statSync(path.join(__dirname, f)).mtimeMs));
let faits = 0, sautes = 0, echecs = 0;
for (const item of liste) {
  if (ids.length && !ids.includes(item.id)) continue;
  const f = path.join(src, CLASSES[item.classe] || item.classe, item.m + '-' + (item.seq === 'blanc' ? 'blanc' : 's' + item.seq) + '.html');
  if (!fs.existsSync(f)) { console.error('✗ ' + item.id + ' : source absente (' + f + ')'); echecs++; continue; }
  const pdfs = ['enonce', 'corrige'].map(k => path.join(SORTIE, item.id + '-' + k + '.pdf'));
  const recent = pdfs.every(p => fs.existsSync(p) && fs.statSync(p).mtimeMs > Math.max(gabarit, fs.statSync(f).mtimeMs));
  if (recent && !TOUT) { sautes++; continue; }
  let tex;
  try { tex = document(fs.readFileSync(f, 'utf8'), item); } catch (e) { console.error('✗ ' + item.id + ' : ' + e.message); echecs++; continue; }
  const e = compiler(tex, item.id, SORTIE);
  if (e) echecs++; else faits++;
}
console.log(`\n${faits} épreuve(s) compilée(s), ${sautes} déjà à jour, ${echecs} en échec → ${SORTIE}`);
process.exit(echecs ? 1 : 0);
