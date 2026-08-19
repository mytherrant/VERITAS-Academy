/* ══════════════════════════════════════════════════════════════════════════
   livrets/liseur.js — LISEUR DES OUVRAGES EN MODE « LECTURE »
   © 2024-2026 Jacques Miterand TAKOU (Mythe Errant). Tous droits réservés.

   Pour les ouvrages qui ne se remplissent pas mais se lisent : Bords, cahiers
   d'œuvre intégrale, cahiers EST. Le fichier d'origine (PDF ou .docx) ne quitte
   JAMAIS le serveur — la page ne reçoit que des images, une par une, et chacune
   porte le filigrane de l'acheteur (api/livret.php, action page).

   L'aperçu gratuit est servi SANS code : c'est l'entonnoir. Le mur tombe à la
   page suivante, pas avant — on montre la valeur, on ne donne pas la marchandise.

   Dépend de gate.js pour le code et le paiement. ES5, aucune bibliothèque.
   ══════════════════════════════════════════════════════════════════════════ */
(function () {
  'use strict';

  var API = '/api/livret.php';
  var S = { slug: '', titre: '', pages: 0, libres: 0, page: 1, ouvert: false, prix: 0 };

  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }
  function el(id) { return document.getElementById(id); }

  function post(corps) {
    return fetch(API, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      credentials: 'omit', cache: 'no-store', body: JSON.stringify(corps)
    }).then(function (r) {
      return r.json().catch(function () { return {}; }).then(function (j) {
        if (!r.ok || !j.ok) {
          var e = new Error(j.error || (r.ok ? 'Réponse inattendue du serveur.'
                                             : 'Le serveur a répondu ' + r.status + '.'));
          e.tag = j.code || 'serveur';
          throw e;
        }
        return j;
      });
    }, function () { throw new Error('Connexion impossible. Vérifie ton réseau.'); });
  }

  /** URL d'une page. Le jeton n'y figure que s'il est nécessaire : les pages
   *  d'aperçu se servent sans rien, et une URL sans jeton ne se périme pas. */
  function urlPage(n) {
    var u = API + '?o=' + encodeURIComponent(S.slug) + '&p=' + n;
    if (n > S.libres) {
      var t = '';
      try { t = localStorage.getItem('vrt-livret-' + S.slug + '-livret') || ''; } catch (e) {}
      if (t) u += '&token=' + encodeURIComponent(t);
    }
    return u;
  }

  // ── Habillage ─────────────────────────────────────────────────────────────
  var CSS = ''
    + '#lis{position:fixed;inset:0;z-index:120;background:#1f2b38;display:flex;flex-direction:column;'
    + 'font-family:"Source Sans 3",system-ui,sans-serif}'
    + '#lis-bar{display:flex;align-items:center;gap:10px;flex-wrap:wrap;background:#16202b;color:#fff;'
    + 'padding:9px 14px;font-size:13.5px}'
    + '#lis-bar b{font-family:"Baloo 2",sans-serif;font-size:15px}'
    + '#lis-vue{flex:1;overflow:auto;display:flex;align-items:flex-start;justify-content:center;padding:16px}'
    + '#lis-img{max-width:100%;max-height:none;box-shadow:0 12px 40px -12px rgba(0,0,0,.6);'
    + 'border-radius:4px;background:#fff;-webkit-user-select:none;user-select:none;-webkit-user-drag:none}'
    + '.lis-b{border:none;border-radius:8px;padding:6px 13px;font:inherit;font-weight:700;font-size:13px;'
    + 'cursor:pointer;background:#2b8ac6;color:#fff}'
    + '.lis-b.g{background:rgba(255,255,255,.14)}'
    + '.lis-b:disabled{opacity:.4;cursor:default}'
    + '#lis-mur{max-width:420px;margin:auto;background:#fff;border-radius:18px;padding:30px 26px;text-align:center}'
    + '#lis-mur .p{font-family:"Baloo 2",sans-serif;font-weight:800;font-size:30px;color:#c0453f;margin:10px 0 2px}'
    + '#lis-bouclier{position:absolute;inset:0;backdrop-filter:blur(14px);background:rgba(31,43,56,.55);'
    + 'display:none;align-items:center;justify-content:center;color:#fff;font-weight:700;font-size:15px;'
    + 'text-align:center;padding:24px}'
    + '@media print{#lis{display:none !important}}';

  function habiller() {
    var st = document.createElement('style');
    st.textContent = CSS;
    document.head.appendChild(st);

    var d = document.createElement('div');
    d.id = 'lis';
    d.innerHTML = ''
      + '<div id="lis-bar">'
      + '<b>' + esc(S.titre) + '</b>'
      + '<span id="lis-num" style="opacity:.8"></span>'
      + '<span style="flex:1"></span>'
      + '<button class="lis-b g" id="lis-prec">‹ Précédente</button>'
      + '<button class="lis-b" id="lis-suiv">Suivante ›</button>'
      + '<button class="lis-b g" id="lis-code">J\'ai un code</button>'
      + '</div>'
      + '<div id="lis-vue"><img id="lis-img" alt=""></div>'
      + '<div id="lis-bouclier">Lecture mise en pause — revenez sur cette fenêtre pour continuer.</div>';
    document.body.appendChild(d);

    el('lis-prec').onclick = function () { aller(S.page - 1); };
    el('lis-suiv').onclick = function () { aller(S.page + 1); };
    el('lis-code').onclick = saisirCode;

    document.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowLeft') aller(S.page - 1);
      if (e.key === 'ArrowRight' || e.key === ' ') aller(S.page + 1);
      // Ctrl+S / Ctrl+P / Ctrl+U : dissuasif, pas infaillible — et on le dit.
      var k = (e.key || '').toLowerCase();
      if ((e.ctrlKey || e.metaKey) && (k === 's' || k === 'p' || k === 'u')) e.preventDefault();
    });
    document.addEventListener('contextmenu', function (e) { e.preventDefault(); });
    document.addEventListener('dragstart', function (e) { e.preventDefault(); });

    // Bouclier à la perte de focus : gêne la capture d'écran par un tiers logiciel.
    var b = el('lis-bouclier');
    window.addEventListener('blur', function () { b.style.display = 'flex'; });
    window.addEventListener('focus', function () { b.style.display = 'none'; });
  }

  function aller(n) {
    if (n < 1 || (S.pages && n > S.pages)) return;
    // Le mur tombe à la première page non offerte, tant qu'aucun code n'est posé.
    if (n > S.libres && !S.ouvert) { mur(n); return; }
    S.page = n;
    // Le mur a remplacé tout #lis-vue : l'image n'existe plus. La recréer, sinon
    // l'élève qui vient de saisir son code reste devant un écran vide — le pire
    // moment possible pour un blocage, il vient de payer.
    var img = el('lis-img');
    if (!img) {
      img = document.createElement('img');
      img.id = 'lis-img';
      img.alt = '';
    }
    el('lis-vue').innerHTML = '';
    el('lis-vue').appendChild(img);
    img.src = urlPage(n);
    img.onerror = function () {
      el('lis-vue').innerHTML = '<p style="color:#fff;padding:30px">Cette page n\'a pas pu être '
        + 'chargée. Si ton accès vient d\'expirer, ressaisis ton code.</p>';
    };
    maj();
    // Pré-chargement de la suivante : la lecture ne doit pas attendre le réseau.
    if (n + 1 <= S.pages && (n + 1 <= S.libres || S.ouvert)) {
      var pre = new Image(); pre.src = urlPage(n + 1);
    }
  }

  function maj() {
    el('lis-num').textContent = 'Page ' + S.page + (S.pages ? ' / ' + S.pages : '')
      + (!S.ouvert && S.libres ? ' · aperçu gratuit jusqu\'à ' + S.libres : '');
    el('lis-prec').disabled = S.page <= 1;
    el('lis-suiv').disabled = !!(S.pages && S.page >= S.pages);
    el('lis-code').style.display = S.ouvert ? 'none' : '';
  }

  function mur(n) {
    el('lis-vue').innerHTML = '<div id="lis-mur">'
      + '<div style="font-size:38px">📕</div>'
      + '<div style="font-family:\'Baloo 2\',sans-serif;font-weight:800;font-size:21px;color:#1f2b38;'
      + 'margin:8px 0 4px">Fin de l\'aperçu</div>'
      + '<div style="font-size:14px;color:#5c666f;line-height:1.55">Les ' + S.libres + ' premières pages '
      + 'sont offertes. L\'ouvrage complet en compte ' + (S.pages || '…') + '.</div>'
      + '<div class="p">' + (S.prix ? S.prix.toLocaleString('fr-FR') : '1 500') + ' FCFA</div>'
      + '<div style="font-size:12px;color:#98a1aa;margin-bottom:14px">l\'année scolaire · '
      + 'Orange Money, MTN MoMo ou carte</div>'
      + '<button class="lis-b" id="lis-acheter" style="width:100%;padding:12px;font-size:15px">'
      + 'Obtenir l\'ouvrage</button>'
      + '<button class="lis-b g" id="lis-code2" style="width:100%;padding:10px;margin-top:8px;'
      + 'background:#eef1f5;color:#334">J\'ai déjà un code</button>'
      + '<div id="lis-msg" style="font-size:12.5px;color:#c0453f;min-height:18px;margin-top:8px"></div>'
      + '<button class="lis-b g" id="lis-retour" style="background:transparent;color:#98a1aa;margin-top:4px">'
      + '‹ Revenir à l\'aperçu</button>'
      + '</div>';
    el('lis-acheter').onclick = function () { window.VRTLivret.acheter(); };
    el('lis-code2').onclick = saisirCode;
    el('lis-retour').onclick = function () { aller(S.libres || 1); };
    maj();
  }

  function saisirCode() {
    var m = el('lis-msg');
    var code = window.prompt('Saisis ton code d\'accès (VRT-…)');
    if (!code) return;
    window.VRTLivret.unlock(code).then(function () {
      S.ouvert = true;
      aller(S.page > S.libres ? S.page : S.libres + 1);
    }).catch(function (e) {
      if (m) m.textContent = e.message || 'Code refusé.';
      else window.alert(e.message || 'Code refusé.');
    });
  }

  window.VRTLiseur = {
    ouvrir: function (slug, titre, pagesLibres) {
      S.slug = slug; S.titre = titre; S.libres = pagesLibres || 0;
      window.VRTLivret.config({ classe: slug, kind: 'livret', titre: titre });
      window.VRTLivret.onOuvert = function () { S.ouvert = true; aller(S.libres + 1); };
      habiller();
      aller(1);

      // La fiche dit combien de pages et jusqu'où va l'aperçu. Publique : c'est
      // la vitrine, pas le contenu.
      post({ action: 'ouvrage', o: slug }).then(function (r) {
        S.pages = r.ouvrage.pages || 0;
        S.libres = r.ouvrage.pagesLibres || S.libres;
        S.prix = r.ouvrage.prix || 0;
        maj();
      }).catch(function () { /* la fiche est un confort, pas une condition */ });

      // Un code déjà posé sur cet appareil rouvre l'ouvrage sans rien demander.
      window.VRTLivret.resume().then(function () {
        S.ouvert = true; maj();
      }).catch(function () {});
    }
  };
})();
