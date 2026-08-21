/* ============================================================================
   VÉRITAS — Mise en forme des textes de corpus
   ----------------------------------------------------------------------------
   Les 562 textes sont stockés en un seul bloc, sans aucun saut de ligne. Pour
   les 88 textes de type DIALOGUE, cela colle toutes les répliques les unes aux
   autres : l'élève ne voit plus qui parle. Il faut donc retrouver les coupures
   à l'affichage.

   RÈGLE ABSOLUE : on n'ajoute QUE des sauts de ligne. Aucun mot, aucun signe,
   aucune lettre n'est ajouté, retiré ni déplacé — ce sont des textes d'auteur,
   et le contrôle `verifierIntegrite()` en bas de ce fichier le prouve en
   comparant les deux chaînes une fois toutes les espaces retirées.

   Comment on distingue une réplique d'une incise, le tiret cadratin servant
   aux deux (mesuré sur le corpus réel) :
     • 412 tirets suivent une ponctuation forte  → réplique, on coupe
     • 405 tirets suivent une minuscule ou une virgule → incise, on ne coupe pas
       (« il partit — sans un mot — vers la ville »)
     • les deux-points introduisent une réplique  → on coupe
   ========================================================================= */

(function (root) {
  'use strict';

  /* Ponctuation qui ferme une phrase ou introduit une prise de parole. */
  var AVANT_REPLIQUE = /[.!?…:»"”)\]]$/;

  /* Insère un saut de ligne devant chaque tiret de réplique. */
  function formaterDialogue(txt) {
    var s = String(txt == null ? '' : txt);
    if (s.indexOf('—') < 0 && s.indexOf('–') < 0) return s;

    var out = '';
    var i = 0;
    while (i < s.length) {
      var c = s[i];
      if (c !== '—' && c !== '–') { out += c; i++; continue; }

      /* Ce qui précède, espaces ôtées. */
      var j = out.length - 1;
      while (j >= 0 && /\s/.test(out[j])) j--;
      var precedent = j >= 0 ? out[j] : '';
      var suivant = s.slice(i + 1, i + 3);

      /* Une réplique commence par une majuscule ou un guillemet ouvrant après
         le tiret ; sans cela on a affaire à un tiret de liste ou d'incise. */
      var ouvreReplique = /^\s+[«"“A-ZÀÂÄÇÉÈÊËÎÏÔÖÙÛÜŸŒÆ]/.test(suivant + ' ');

      if (ouvreReplique && (precedent === '' || AVANT_REPLIQUE.test(precedent))) {
        /* On retire les espaces déjà écrites devant le tiret, on pose le saut
           de ligne, puis le tiret : le contenu est identique, seul le blanc
           change de nature. */
        out = out.replace(/[ \t]+$/, '');
        if (out !== '' && out[out.length - 1] !== '\n') out += '\n';
        out += c;
        i++;
        continue;
      }
      out += c;
      i++;
    }
    return out;
  }

  /* Découpe en paragraphes prêts à rendre. Chaque entrée dit si c'est une
     réplique, pour que l'affichage puisse la traiter autrement. */
  function paragraphes(txt) {
    var s = formaterDialogue(txt);
    return s.split('\n').map(function (l) {
      var t = l.trim();
      return { texte: t, replique: /^[—–]/.test(t) };
    }).filter(function (o) { return o.texte !== ''; });
  }

  /* Preuve que la mise en forme n'a rien touché d'autre que les blancs. */
  function verifierIntegrite(txt) {
    var sansBlanc = function (x) { return String(x).replace(/\s+/g, ''); };
    return sansBlanc(formaterDialogue(txt)) === sansBlanc(txt);
  }

  /* Extrait court pour les listes : on coupe sur une frontière de mot et on
     signale la coupe, plutôt que de trancher au milieu d'un mot. */
  function extrait(txt, n) {
    var s = String(txt == null ? '' : txt).replace(/\s+/g, ' ').trim();
    n = n || 180;
    if (s.length <= n) return s;
    var c = s.slice(0, n);
    var esp = c.lastIndexOf(' ');
    if (esp > n * 0.6) c = c.slice(0, esp);
    return c + '…';
  }

  root.VRT_TEXTE = {
    formaterDialogue: formaterDialogue,
    paragraphes: paragraphes,
    verifierIntegrite: verifierIntegrite,
    extrait: extrait
  };

  if (typeof module !== 'undefined' && module.exports) module.exports = root.VRT_TEXTE;

})(typeof window !== 'undefined' ? window : this);
