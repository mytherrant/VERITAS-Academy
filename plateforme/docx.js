/* ============================================================================
   VÉRITAS — Export Word (.docx) sans dépendance
   ----------------------------------------------------------------------------
   Pourquoi un vrai .docx et pas un HTML renommé en .doc : le HTML renommé
   s'ouvre dans Word mais déclenche un avertissement de format, perd la mise en
   page à la réouverture, et surtout ne donne pas de vraie cellule d'en-tête où
   déposer un logo. L'enseignant qui exporte veut mettre le blason de son
   établissement et changer l'intitulé : il lui faut un document Word normal.

   Un .docx est un ZIP contenant du XML. On l'écrit en mode « stocké » (aucune
   compression) : c'est parfaitement valide, cela évite d'embarquer un
   compresseur, et le fichier reste petit puisqu'il ne contient que du texte.

   Ce que l'export produit :
     - un tableau d'en-tête à trois cellules — établissement · logo · session —
       dont la cellule du milieu est vide et légendée, prête à recevoir l'image ;
     - le titre, la classe, la durée, le coefficient et la consigne ;
     - chaque texte support avec sa référence ;
     - les questions numérotées, avec leur barème s'il est renseigné ;
     - un pied rappelant le total.
   ========================================================================= */

(function (root) {
  'use strict';

  /* ---------------------------------------------------------------- ZIP */

  var TABLE_CRC = (function () {
    var t = new Int32Array(256), c, i, k;
    for (i = 0; i < 256; i++) {
      c = i;
      for (k = 0; k < 8; k++) c = (c & 1) ? (0xEDB88320 ^ (c >>> 1)) : (c >>> 1);
      t[i] = c;
    }
    return t;
  })();

  function crc32(octets) {
    var c = -1;
    for (var i = 0; i < octets.length; i++) c = TABLE_CRC[(c ^ octets[i]) & 0xFF] ^ (c >>> 8);
    return (c ^ -1) >>> 0;
  }

  function utf8(s) {
    return new TextEncoder().encode(s);
  }

  function ecrire32(tab, pos, v) {
    tab[pos] = v & 0xFF; tab[pos + 1] = (v >>> 8) & 0xFF;
    tab[pos + 2] = (v >>> 16) & 0xFF; tab[pos + 3] = (v >>> 24) & 0xFF;
  }
  function ecrire16(tab, pos, v) {
    tab[pos] = v & 0xFF; tab[pos + 1] = (v >>> 8) & 0xFF;
  }

  /* fichiers = [{nom, contenu}] — contenu en chaîne UTF-8 */
  function zipStocke(fichiers) {
    var entrees = fichiers.map(function (f) {
      var nom = utf8(f.nom), data = utf8(f.contenu);
      return { nom: nom, data: data, crc: crc32(data) };
    });

    var tailleLocale = entrees.reduce(function (a, e) { return a + 30 + e.nom.length + e.data.length; }, 0);
    var tailleCentrale = entrees.reduce(function (a, e) { return a + 46 + e.nom.length; }, 0);
    var out = new Uint8Array(tailleLocale + tailleCentrale + 22);

    var pos = 0, debuts = [];
    entrees.forEach(function (e) {
      debuts.push(pos);
      ecrire32(out, pos, 0x04034b50);        // signature d'en-tête local
      ecrire16(out, pos + 4, 20);            // version minimale
      ecrire16(out, pos + 6, 0x0800);        // drapeau : noms en UTF-8
      ecrire16(out, pos + 8, 0);             // méthode 0 = stocké
      ecrire16(out, pos + 10, 0);            // heure
      ecrire16(out, pos + 12, 0x2158);       // date (1"er" janvier 2026, arbitraire mais valide)
      ecrire32(out, pos + 14, e.crc);
      ecrire32(out, pos + 18, e.data.length);
      ecrire32(out, pos + 22, e.data.length);
      ecrire16(out, pos + 26, e.nom.length);
      ecrire16(out, pos + 28, 0);
      pos += 30;
      out.set(e.nom, pos); pos += e.nom.length;
      out.set(e.data, pos); pos += e.data.length;
    });

    var debutCentral = pos;
    entrees.forEach(function (e, i) {
      ecrire32(out, pos, 0x02014b50);
      ecrire16(out, pos + 4, 20);
      ecrire16(out, pos + 6, 20);
      ecrire16(out, pos + 8, 0x0800);
      ecrire16(out, pos + 10, 0);
      ecrire16(out, pos + 12, 0);
      ecrire16(out, pos + 14, 0x2158);
      ecrire32(out, pos + 16, e.crc);
      ecrire32(out, pos + 20, e.data.length);
      ecrire32(out, pos + 24, e.data.length);
      ecrire16(out, pos + 28, e.nom.length);
      ecrire16(out, pos + 30, 0);
      ecrire16(out, pos + 32, 0);
      ecrire16(out, pos + 34, 0);
      ecrire16(out, pos + 36, 0);
      ecrire32(out, pos + 38, 0);
      ecrire32(out, pos + 42, debuts[i]);
      pos += 46;
      out.set(e.nom, pos); pos += e.nom.length;
    });

    ecrire32(out, pos, 0x06054b50);
    ecrire16(out, pos + 4, 0);
    ecrire16(out, pos + 6, 0);
    ecrire16(out, pos + 8, entrees.length);
    ecrire16(out, pos + 10, entrees.length);
    ecrire32(out, pos + 12, pos - debutCentral);
    ecrire32(out, pos + 16, debutCentral);
    ecrire16(out, pos + 20, 0);

    return out;
  }

  /* ------------------------------------------------------- XML WordprocessingML */

  function esc(s) {
    return String(s == null ? '' : s)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;').replace(/'/g, '&apos;')
      /* Word refuse les caractères de contrôle : on les retire plutôt que de
         produire un fichier que Word déclarera corrompu. */
      .replace(/[\x00-\x08\x0b\x0c\x0e-\x1f]/g, '');
  }

  /* Un paragraphe. o = {gras, italique, taille (demi-points), align, couleur,
     espaceAvant, espaceApres, bordureBas, indent} */
  function p(texte, o) {
    o = o || {};
    var pPr = '<w:pPr>';
    if (o.align) pPr += '<w:jc w:val="' + o.align + '"/>';
    if (o.indent) pPr += '<w:ind w:left="' + o.indent + '"/>';
    pPr += '<w:spacing w:before="' + (o.espaceAvant || 0) + '" w:after="' + (o.espaceApres == null ? 100 : o.espaceApres) + '"/>';
    if (o.bordureBas) pPr += '<w:pBdr><w:bottom w:val="single" w:sz="8" w:space="4" w:color="14375F"/></w:pBdr>';
    pPr += '</w:pPr>';

    var rPr = '<w:rPr>';
    if (o.gras) rPr += '<w:b/>';
    if (o.italique) rPr += '<w:i/>';
    if (o.couleur) rPr += '<w:color w:val="' + o.couleur + '"/>';
    rPr += '<w:sz w:val="' + (o.taille || 22) + '"/><w:szCs w:val="' + (o.taille || 22) + '"/>';
    rPr += '</w:rPr>';

    /* Les sauts de ligne du texte source deviennent des <w:br/> : sans cela un
       texte de corpus arriverait dans Word en un seul bloc illisible. */
    var morceaux = String(texte == null ? '' : texte).split('\n');
    var runs = morceaux.map(function (m, i) {
      return (i ? '<w:r>' + rPr + '<w:br/></w:r>' : '') +
             '<w:r>' + rPr + '<w:t xml:space="preserve">' + esc(m) + '</w:t></w:r>';
    }).join('');

    return '<w:p>' + pPr + runs + '</w:p>';
  }

  function cellule(contenu, largeur, fond) {
    return '<w:tc><w:tcPr><w:tcW w:w="' + largeur + '" w:type="dxa"/>' +
      (fond ? '<w:shd w:val="clear" w:fill="' + fond + '"/>' : '') +
      '<w:vAlign w:val="center"/></w:tcPr>' + contenu + '</w:tc>';
  }

  function tableauEntete(ep) {
    var bord = '<w:tblBorders>' +
      ['top', 'left', 'bottom', 'right', 'insideH', 'insideV'].map(function (c) {
        return '<w:' + c + ' w:val="single" w:sz="6" w:space="0" w:color="C9D6E4"/>';
      }).join('') + '</w:tblBorders>';

    var gauche = p(ep.etab || 'Nom de l’établissement', { gras: true, taille: 22, align: 'center', espaceApres: 40 }) +
                 p(ep.ville || '', { taille: 18, align: 'center', couleur: '5A6678', espaceApres: 0 });

    var milieu = p('[ Déposez ici le logo de votre établissement ]', {
      italique: true, taille: 16, align: 'center', couleur: '9AA5B5', espaceAvant: 120, espaceApres: 120
    });

    var droite = p('Année scolaire', { taille: 16, align: 'center', couleur: '5A6678', espaceApres: 40 }) +
                 p(ep.annee || '20.. – 20..', { gras: true, taille: 22, align: 'center', espaceApres: 0 });

    return '<w:tbl><w:tblPr><w:tblW w:w="9640" w:type="dxa"/>' + bord + '</w:tblPr>' +
      '<w:tr>' + cellule(gauche, 3400) + cellule(milieu, 2840, 'F7F9FC') + cellule(droite, 3400) + '</w:tr>' +
      '</w:tbl>' + p('', { espaceApres: 120 });
  }

  function ligneInfos(ep) {
    var bits = [];
    if (ep.classe) bits.push('Classe : ' + ep.classe);
    if (ep.duree) bits.push('Durée : ' + ep.duree);
    if (ep.coeff) bits.push('Coefficient : ' + ep.coeff);
    bits.push('Note : /' + (ep.total || 20));
    return p(bits.join('        '), { taille: 20, align: 'center', couleur: '3A4658', espaceApres: 160 });
  }

  /* ------------------------------------------------------------------ document */

  function construireDocument(ep, textes) {
    var corps = [];

    corps.push(tableauEntete(ep));
    corps.push(p(ep.titre || 'Épreuve de français', { gras: true, taille: 30, align: 'center', couleur: '14375F', espaceApres: 60 }));
    if (ep.sousTitre) corps.push(p(ep.sousTitre, { taille: 20, align: 'center', couleur: '5A6678', espaceApres: 80 }));
    corps.push(ligneInfos(ep));
    if (ep.consigne) corps.push(p(ep.consigne, { italique: true, taille: 20, align: 'center', couleur: '5A6678', espaceApres: 220 }));

    (textes || []).forEach(function (t, i) {
      corps.push(p('TEXTE ' + (i + 1) + (t.mots ? '  ·  ' + t.mots + ' mots' : ''),
        { gras: true, taille: 20, couleur: '1A72BB', espaceAvant: 200, espaceApres: 80, bordureBas: true }));
      corps.push(p(t.texte || '', { taille: 22, align: 'both', espaceApres: 80 }));
      if (t.reference) corps.push(p('— ' + t.reference, { italique: true, taille: 18, align: 'right', couleur: '5A6678', espaceApres: 160 }));

      [['I. Compréhension du texte', t.comp], ['II. Connaissance et maniement de la langue', t.expl]]
        .forEach(function (paire) {
          var titre = paire[0], liste = paire[1] || [];
          if (!liste.length) return;
          corps.push(p(titre, { gras: true, taille: 20, couleur: '14375F', espaceAvant: 120, espaceApres: 80 }));
          liste.forEach(function (q, k) {
            var pts = (q.points == null || q.points === '') ? '' : '   (' + q.points + ' pt' + (parseFloat(q.points) > 1 ? 's' : '') + ')';
            corps.push(p((k + 1) + '. ' + (q.texte || q) + pts, { taille: 21, indent: 260, espaceApres: 70 }));
          });
        });
    });

    if (ep.totalBareme != null) {
      corps.push(p('Total : ' + ep.totalBareme + ' / ' + (ep.total || 20) + ' points',
        { gras: true, taille: 20, align: 'right', couleur: '14375F', espaceAvant: 200, espaceApres: 0 }));
    }
    corps.push(p(ep.pied || 'Épreuve composée avec Corpus & Épreuves — Centre VÉRITAS',
      { taille: 15, align: 'center', couleur: '9AA5B5', espaceAvant: 320, espaceApres: 0 }));

    return '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>' +
      '<w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">' +
      '<w:body>' + corps.join('') +
      '<w:sectPr><w:pgSz w:w="11906" w:h="16838"/>' +
      '<w:pgMar w:top="1134" w:right="1134" w:bottom="1134" w:left="1134" w:header="708" w:footer="708" w:gutter="0"/>' +
      '</w:sectPr></w:body></w:document>';
  }

  var CONTENT_TYPES =
    '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>' +
    '<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">' +
    '<Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>' +
    '<Default Extension="xml" ContentType="application/xml"/>' +
    '<Override PartName="/word/document.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/>' +
    '<Override PartName="/word/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.styles+xml"/>' +
    '</Types>';

  var RELS =
    '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>' +
    '<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">' +
    '<Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="word/document.xml"/>' +
    '</Relationships>';

  var DOC_RELS =
    '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>' +
    '<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">' +
    '<Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles" Target="styles.xml"/>' +
    '</Relationships>';

  /* Une police unique déclarée par défaut : sans styles.xml, Word applique sa
     police d'interface et le rendu diffère d'un poste à l'autre. */
  var STYLES =
    '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>' +
    '<w:styles xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">' +
    '<w:docDefaults><w:rPrDefault><w:rPr>' +
    '<w:rFonts w:ascii="Cambria" w:hAnsi="Cambria" w:cs="Cambria"/>' +
    '<w:sz w:val="22"/><w:szCs w:val="22"/><w:lang w:val="fr-FR"/>' +
    '</w:rPr></w:rPrDefault></w:docDefaults>' +
    '<w:style w:type="paragraph" w:default="1" w:styleId="Normal"><w:name w:val="Normal"/></w:style>' +
    '</w:styles>';

  /* --------------------------------------------------------------- API */

  function construire(ep, textes) {
    return zipStocke([
      { nom: '[Content_Types].xml', contenu: CONTENT_TYPES },
      { nom: '_rels/.rels', contenu: RELS },
      { nom: 'word/_rels/document.xml.rels', contenu: DOC_RELS },
      { nom: 'word/document.xml', contenu: construireDocument(ep, textes) },
      { nom: 'word/styles.xml', contenu: STYLES }
    ]);
  }

  function nomFichier(titre) {
    var base = String(titre || 'epreuve')
      .normalize ? String(titre || 'epreuve').normalize('NFD').replace(/[\u0300-\u036f]/g, '') : String(titre || 'epreuve');
    base = base.replace(/[^A-Za-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 60);
    return (base || 'epreuve') + '.docx';
  }

  function telecharger(ep, textes) {
    var octets = construire(ep, textes);
    var blob = new Blob([octets], {
      type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    });
    var url = URL.createObjectURL(blob);
    var a = document.createElement('a');
    a.href = url;
    a.download = nomFichier(ep.titre);
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(function () { URL.revokeObjectURL(url); }, 2000);
    return blob.size;
  }

  root.VRT_DOCX = { construire: construire, telecharger: telecharger, nomFichier: nomFichier, zipStocke: zipStocke, crc32: crc32 };

  if (typeof module !== 'undefined' && module.exports) module.exports = root.VRT_DOCX;

})(typeof window !== 'undefined' ? window : this);
