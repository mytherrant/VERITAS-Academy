/* ============================================================================
   VÉRITAS — Lecture des textes à importer dans l'Atelier · plateforme/lecteur-textes.js
   ----------------------------------------------------------------------------
   25/10/2026 — « Fais que l'importation des textes soit en Word, texte ou PDF.
   CSV et JSON ne sont pas des formats communs pour les enseignants de
   français » (Jacques). L'import n'acceptait que du JSON ou du CSV à colonnes
   (`type`, `words`, `subkind`…) : un enseignant qui a ses textes dans Word
   ne pouvait rien importer.

   Formats lus :
     · Word (.docx) et LibreOffice (.odt) — ce sont des ZIP de XML : on lit
       l'archive et on la décompresse avec le navigateur (DecompressionStream),
       sans bibliothèque ;
     · PDF — par pdf.js (Mozilla, Apache 2.0), hébergé sur le site et chargé
       SEULEMENT quand un PDF est choisi (1,8 Mo que personne d'autre ne paie) ;
     · texte brut (.txt).
   L'ancien Word (.doc) est un format binaire fermé : on demande de
   l'enregistrer en .docx plutôt que d'en extraire un texte faux.

   Découpage : un fichier = un texte ; une ligne « --- » (ou « *** ») sépare
   plusieurs textes. La première ligne courte (≤ 90 caractères, sans point
   final) devient le titre ; une dernière ligne « — Auteur, Œuvre » ou
   « (Auteur, Œuvre) » devient la référence, et l'auteur ce qui précède la
   virgule.
   ========================================================================= */
(function (root) {
  'use strict';

  var PDFJS = '/assets/vendor/pdfjs-4.10.38/';

  function ext(nom) { var m = /\.([a-z0-9]+)$/i.exec(nom || ''); return m ? m[1].toLowerCase() : ''; }

  /* ── ZIP minimal : répertoire central → une entrée → octets décompressés ── */
  function u16(v, o) { return v.getUint16(o, true); }
  function u32(v, o) { return v.getUint32(o, true); }
  async function entreeZip(buf, chemin) {
    var v = new DataView(buf), n = buf.byteLength, eocd = -1;
    for (var i = n - 22; i >= Math.max(0, n - 65557); i--) if (u32(v, i) === 0x06054b50) { eocd = i; break; }
    if (eocd < 0) throw new Error('fichier abîmé (archive illisible)');
    var nb = u16(v, eocd + 10), off = u32(v, eocd + 16);
    var dec = new TextDecoder();
    for (var k = 0; k < nb; k++) {
      if (u32(v, off) !== 0x02014b50) break;
      var meth = u16(v, off + 10), taille = u32(v, off + 20), lnom = u16(v, off + 28),
          lext = u16(v, off + 30), lcom = u16(v, off + 32), loc = u32(v, off + 42);
      var nom = dec.decode(new Uint8Array(buf, off + 46, lnom));
      if (nom === chemin) {
        var debut = loc + 30 + u16(v, loc + 26) + u16(v, loc + 28);
        var brut = new Uint8Array(buf, debut, taille);
        if (meth === 0) return brut;
        if (meth !== 8) throw new Error('compression non prise en charge');
        if (typeof DecompressionStream === 'undefined') throw new Error('navigateur trop ancien pour lire ce fichier — mettez-le à jour, ou copiez le texte dans l’onglet « Coller »');
        var flux = new Blob([brut]).stream().pipeThrough(new DecompressionStream('deflate-raw'));
        return new Uint8Array(await new Response(flux).arrayBuffer());
      }
      off += 46 + lnom + lext + lcom;
    }
    throw new Error('contenu introuvable dans le fichier');
  }

  // Paragraphes d'un XML Word / OpenDocument, sans les balises.
  function paragraphes(xml, balisePara, baliseTexte, tab, saut) {
    var doc = new DOMParser().parseFromString(xml, 'application/xml');
    var out = [];
    var ps = doc.getElementsByTagName(balisePara);
    for (var i = 0; i < ps.length; i++) {
      var t = '';
      (function parcourir(n) {
        for (var c = n.firstChild; c; c = c.nextSibling) {
          if (c.nodeType === 3) { if (n.nodeName === baliseTexte || baliseTexte === '*') t += c.nodeValue; continue; }
          if (c.nodeName === tab) t += '\t';
          else if (c.nodeName === saut) t += '\n';
          else parcourir(c);
        }
      })(ps[i]);
      out.push(t.replace(/ /g, ' '));
    }
    return out.join('\n');
  }

  async function lireDocx(buf) {
    var xml = new TextDecoder().decode(await entreeZip(buf, 'word/document.xml'));
    return paragraphes(xml, 'w:p', 'w:t', 'w:tab', 'w:br');
  }
  async function lireOdt(buf) {
    var xml = new TextDecoder().decode(await entreeZip(buf, 'content.xml'));
    var doc = new DOMParser().parseFromString(xml, 'application/xml'), out = [];
    var tout = doc.getElementsByTagName('*');
    for (var i = 0; i < tout.length; i++) {
      var nm = tout[i].nodeName;
      if (nm === 'text:p' || nm === 'text:h') out.push((tout[i].textContent || '').replace(/ /g, ' '));
    }
    return out.join('\n');
  }

  var pdfjs = null;
  async function lirePdf(buf) {
    if (!pdfjs) {
      pdfjs = await import(PDFJS + 'pdf.min.js');
      pdfjs.GlobalWorkerOptions.workerSrc = PDFJS + 'pdf.worker.min.js';
    }
    var doc = await pdfjs.getDocument({ data: new Uint8Array(buf), isEvalSupported: false }).promise;
    var pages = [];
    for (var p = 1; p <= doc.numPages; p++) {
      var tc = await (await doc.getPage(p)).getTextContent(), ligne = '', lignes = [];
      tc.items.forEach(function (it) {
        ligne += it.str;
        if (it.hasEOL) { lignes.push(ligne); ligne = ''; }
      });
      if (ligne) lignes.push(ligne);
      pages.push(lignes.join('\n'));
    }
    var texte = pages.join('\n');
    if (texte.replace(/\s/g, '').length < 20) throw new Error('ce PDF ne contient pas de texte lisible (document scanné ?) — essayez la version Word, ou copiez le texte dans « Coller »');
    return texte;
  }

  /* PDF et Word coupent souvent une phrase en fin de ligne : on recolle les
     lignes d'un même paragraphe (ligne qui ne finit pas par une ponctuation
     forte suivie d'une ligne qui commence en minuscule). Les vers d'un poème
     commencent d'ordinaire par une majuscule : ils restent séparés. */
  function recoller(t) {
    return t.replace(/\r/g, '').replace(/[ \t]+\n/g, '\n')
      .replace(/([^\n.!?:;»"…])\n(?=[a-zàâäçéèêëîïôöùûüœ])/g, '$1 ')
      .replace(/-\n(?=[a-zàâäçéèêëîïôöùûü])/g, '')
      .replace(/\n{3,}/g, '\n\n').trim();
  }

  function decouper(texte, nomFichier) {
    var base = (nomFichier || '').replace(/\.[^.]+$/, '').replace(/[_-]+/g, ' ').trim();
    var blocs = recoller(texte).split(/\n\s*(?:-{3,}|\*{3,}|_{3,})\s*\n/).map(function (b) { return b.trim(); }).filter(Boolean);
    return blocs.map(function (b, i) {
      var lignes = b.split('\n').map(function (l) { return l.trim(); });
      while (lignes.length && !lignes[0]) lignes.shift();
      var titre = '';
      if (lignes.length > 2 && lignes[0].length <= 90 && !/[.!?]$/.test(lignes[0])) titre = lignes.shift();
      while (lignes.length && !lignes[0]) lignes.shift();
      var reference = '', auteur = '';
      var der = lignes.length ? lignes[lignes.length - 1] : '';
      var m = /^[—–-]\s*(.{3,160})$/.exec(der) || /^\((.{3,160})\)\.?$/.exec(der);
      if (m && lignes.length > 1) { reference = m[1].trim(); lignes.pop(); auteur = reference.split(',')[0].trim(); }
      var corps = lignes.join('\n').trim();
      return {
        text: corps,
        title: titre || (blocs.length > 1 ? (base + ' — ' + (i + 1)) : base),
        author: auteur, reference: reference
      };
    }).filter(function (r) { return r.text.length > 0; });
  }

  async function lireFichier(file) {
    var e = ext(file.name);
    if (e === 'doc') throw new Error('l’ancien format Word (.doc) ne peut pas être lu ici : ouvrez le fichier dans Word et « Enregistrer sous » au format .docx');
    if (e === 'txt' || e === 'md') return decouper(await file.text(), file.name);
    var buf = await file.arrayBuffer();
    if (e === 'docx') return decouper(await lireDocx(buf), file.name);
    if (e === 'odt') return decouper(await lireOdt(buf), file.name);
    if (e === 'pdf') return decouper(await lirePdf(buf), file.name);
    return null;   // .json / .csv : laissés au lecteur historique
  }

  root.VRT_LECTEUR = { lireFichier: lireFichier, decouper: decouper, ext: ext };
})(window);
