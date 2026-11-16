/* lecteur-pdf.js — lecteur PDF VÉRITAS (pdf.js 4.10.38 servi par le site).
 *
 * Affiche des PDF compilés en LaTeX page par page, avec des onglets par livrable
 * (Énoncé, Corrigé, Guide de correction…) et une barre : « Page n / N »,
 * zoom − % +, ouvrir dans un onglet, télécharger.
 *
 *   VRTLecteurPDF.monter(elementOuId, {
 *     documents: [ { titre:'Énoncé', url:'/…/enonce.pdf' },
 *                  { titre:'Corrigé', url:'/…/corrige.pdf', telechargeable:false } ],
 *     // Document réservé : charger() → Promise<ArrayBuffer> (requête authentifiée),
 *     // appelée au premier affichage de l'onglet ; fichier = nom proposé au téléchargement.
 *     telechargeable: true,     // défaut pour tous les documents
 *     hauteur: '78vh'           // hauteur de la zone des pages
 *   });
 *
 * ES5 + un import() dynamique (pdf.js 4 est un module). Pages rendues à la
 * demande (IntersectionObserver), nettes sur écran haute densité.
 */
(function () {
  'use strict';
  var BASE = '/assets/vendor/pdfjs-4.10.38/';
  var libPromesse = null;

  function lib() {
    if (window.pdfjsLib && window.pdfjsLib.getDocument) return Promise.resolve(window.pdfjsLib);
    if (!libPromesse) {
      libPromesse = import(BASE + 'pdf.min.js').then(function () {
        var L = window.pdfjsLib;
        if (!L || !L.getDocument) throw new Error('Lecteur PDF indisponible');
        if (!L.GlobalWorkerOptions.workerSrc) L.GlobalWorkerOptions.workerSrc = BASE + 'pdf.worker.min.js';
        return L;
      });
      libPromesse.catch(function () { libPromesse = null; });
    }
    return libPromesse;
  }

  var CSS = '' +
    '.vlp{font-family:Poppins,system-ui,sans-serif;color:#001136}' +
    '.vlp-onglets{display:flex;gap:4px;overflow-x:auto;border-bottom:1px solid #DCE3EF;margin-bottom:12px;scrollbar-width:thin}' +
    '.vlp-onglet{flex:0 0 auto;background:none;border:0;border-bottom:2px solid transparent;padding:10px 14px;font:inherit;font-size:15px;color:#1E499B;cursor:pointer;white-space:nowrap}' +
    '.vlp-onglet[aria-selected="true"]{color:#001136;font-weight:600;border-bottom-color:#001136}' +
    '.vlp-cadre{border-radius:10px;overflow:hidden;background:#525659}' +
    '.vlp-barre{display:flex;align-items:center;gap:6px;background:#2B2F36;color:#fff;padding:8px 10px 8px 14px;font-size:14px}' +
    '.vlp-page{flex:1;font-variant-numeric:tabular-nums;white-space:nowrap}' +
    '.vlp-zoom{min-width:52px;text-align:center;font-variant-numeric:tabular-nums}' +
    '.vlp-bt{display:inline-flex;align-items:center;justify-content:center;width:34px;height:34px;border:0;border-radius:8px;background:none;color:#fff;cursor:pointer;text-decoration:none}' +
    '.vlp-bt:hover,.vlp-bt:focus-visible{background:rgba(255,255,255,.12);outline:none}' +
    '.vlp-bt[disabled]{opacity:.35;cursor:default;background:none}' +
    '.vlp-bt svg{width:18px;height:18px;stroke:currentColor;fill:none;stroke-width:2;stroke-linecap:round;stroke-linejoin:round}' +
    '.vlp-pages{position:relative;overflow:auto;padding:12px 8px;display:flex;flex-direction:column;align-items:center;gap:12px;overscroll-behavior:contain}' +
    '.vlp-feuille{position:relative;background:#fff;box-shadow:0 1px 4px rgba(0,0,0,.35);flex:0 0 auto}' +
    '.vlp-feuille canvas{display:block;width:100%;height:100%}' +
    '.vlp-msg{color:#fff;padding:40px 16px;text-align:center;font-size:14px}' +
    '@media (max-width:600px){.vlp-barre{padding:6px 6px 6px 10px;gap:2px}.vlp-bt{width:32px;height:32px}.vlp-pages{padding:8px 4px}}';

  function injecterCSS() {
    if (document.getElementById('vlp-css')) return;
    var s = document.createElement('style');
    s.id = 'vlp-css';
    s.textContent = CSS;
    document.head.appendChild(s);
  }

  var ICONES = {
    moins: '<svg viewBox="0 0 24 24"><path d="M5 12h14"/></svg>',
    plus: '<svg viewBox="0 0 24 24"><path d="M12 5v14M5 12h14"/></svg>',
    ouvrir: '<svg viewBox="0 0 24 24"><path d="M14 4h6v6M20 4l-9 9M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5"/></svg>',
    telecharger: '<svg viewBox="0 0 24 24"><path d="M12 4v11M7 10l5 5 5-5M5 20h14"/></svg>'
  };

  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }

  function Lecteur(racine, opts) {
    this.racine = racine;
    this.docs = (opts.documents || []).filter(function (d) { return d && (d.url || d.charger); });
    this.telechargeable = opts.telechargeable !== false;
    this.hauteur = opts.hauteur || '78vh';
    this.pdf = null;
    this.zoom = 0;           // 0 = largeur de la zone (« ajusté »), sinon facteur
    this.ajuste = 1;         // facteur calculé pour l'ajustement à la largeur
    this.jeton = 0;          // invalide les rendus d'un document précédent
    this.construire();
    if (this.docs.length) this.choisir(0);
  }

  Lecteur.prototype.construire = function () {
    var self = this;
    var onglets = this.docs.length > 1
      ? '<div class="vlp-onglets" role="tablist">' + this.docs.map(function (d, i) {
          return '<button type="button" class="vlp-onglet" role="tab" data-i="' + i + '">' + esc(d.titre || ('Document ' + (i + 1))) + '</button>';
        }).join('') + '</div>'
      : '';
    this.racine.innerHTML = '<div class="vlp">' + onglets +
      '<div class="vlp-cadre">' +
        '<div class="vlp-barre">' +
          '<span class="vlp-page" aria-live="polite">Page – / –</span>' +
          '<button type="button" class="vlp-bt" data-a="moins" aria-label="Réduire">' + ICONES.moins + '</button>' +
          '<span class="vlp-zoom">100 %</span>' +
          '<button type="button" class="vlp-bt" data-a="plus" aria-label="Agrandir">' + ICONES.plus + '</button>' +
          '<a class="vlp-bt" data-a="ouvrir" target="_blank" rel="noopener" aria-label="Ouvrir dans un nouvel onglet">' + ICONES.ouvrir + '</a>' +
          '<a class="vlp-bt" data-a="telecharger" aria-label="Télécharger">' + ICONES.telecharger + '</a>' +
        '</div>' +
        '<div class="vlp-pages" style="height:' + esc(this.hauteur) + '"></div>' +
      '</div></div>';
    var q = function (s) { return self.racine.querySelector(s); };
    this.elPage = q('.vlp-page');
    this.elZoom = q('.vlp-zoom');
    this.elPages = q('.vlp-pages');
    this.elOuvrir = q('[data-a="ouvrir"]');
    this.elTelecharger = q('[data-a="telecharger"]');
    q('[data-a="moins"]').addEventListener('click', function () { self.zoomer(-1); });
    q('[data-a="plus"]').addEventListener('click', function () { self.zoomer(1); });
    Array.prototype.forEach.call(this.racine.querySelectorAll('.vlp-onglet'), function (b) {
      b.addEventListener('click', function () { self.choisir(+b.getAttribute('data-i')); });
    });
    this.elPages.addEventListener('scroll', function () { self.majPageCourante(); }, { passive: true });
    var largeur = this.elPages.clientWidth;
    if (window.ResizeObserver) {
      new ResizeObserver(function () {
        var l = self.elPages.clientWidth;
        if (Math.abs(l - largeur) > 4 && self.pdf && !self.zoom) { largeur = l; self.disposer(); }
      }).observe(this.elPages);
    }
  };

  Lecteur.prototype.choisir = function (i) {
    var self = this, d = this.docs[i];
    if (!d) return;
    Array.prototype.forEach.call(this.racine.querySelectorAll('.vlp-onglet'), function (b) {
      b.setAttribute('aria-selected', String(+b.getAttribute('data-i') === i));
    });
    var dl = d.telechargeable == null ? this.telechargeable : d.telechargeable;
    this.elOuvrir.style.display = 'none';
    this.elTelecharger.style.display = 'none';
    var jeton = ++this.jeton;
    if (this.pdf) { this.pdf.destroy(); this.pdf = null; }
    this.elPages.innerHTML = '<div class="vlp-msg">Chargement…</div>';
    this.elPage.textContent = 'Page – / –';
    // Document réservé : `charger()` le demande au serveur (requête authentifiée) et
    // renvoie ses octets ; on les garde pour l'onglet, l'ouverture et le téléchargement.
    var source = d.charger
      ? (d._octets ? Promise.resolve(d._octets) : Promise.resolve(d.charger()).then(function (b) { d._octets = b; return b; }))
      : Promise.resolve(null);
    var lien = function () {
      if (d.url) return d.url;
      if (!d._lien && d._octets) d._lien = URL.createObjectURL(new Blob([d._octets], { type: 'application/pdf' }));
      return d._lien || '';
    };
    source.then(function () {
      if (jeton !== self.jeton) return;
      var u = lien();
      if (u && dl) {
        self.elOuvrir.href = u;
        self.elTelecharger.href = u;
        self.elTelecharger.setAttribute('download', d.fichier || ((d.url || '').split('/').pop().split('?')[0] || 'document.pdf'));
        self.elOuvrir.style.display = '';
        self.elTelecharger.style.display = '';
      }
    });
    source.then(function (octets) {
      return lib().then(function (L) {
        // pdf.js garde (et vide) le tampon qu'on lui confie : il reçoit une copie.
        return L.getDocument(octets ? { data: octets.slice(0), isEvalSupported: false } : { url: d.url, isEvalSupported: false }).promise;
      });
    }).then(function (pdf) {
      if (jeton !== self.jeton) { pdf.destroy(); return; }
      self.pdf = pdf;
      return pdf.getPage(1).then(function (p1) {
        self.base = p1.getViewport({ scale: 1 });
        self.disposer();
      });
    }).catch(function (e) {
      if (jeton !== self.jeton) return;
      // Un refus du serveur porte son propre message (e.message, posé par charger()).
      self.elPages.innerHTML = '<div class="vlp-msg">' + (d.charger
        ? esc(e && e.message ? e.message : 'Impossible d’afficher ce document. Réessaie dans un instant.')
        : 'Impossible d’afficher ce document. <a style="color:#FFC93C" href="' + esc(d.url) + '" target="_blank" rel="noopener">L’ouvrir directement</a>') + '</div>';
      if (window.console) console.warn('[lecteur-pdf]', e);
    });
  };

  Lecteur.prototype.echelle = function () {
    var dispo = Math.max(200, this.elPages.clientWidth - 16);
    this.ajuste = Math.min(dispo / this.base.width, 1.6);
    return this.zoom || this.ajuste;
  };

  // Crée les feuilles vides à la bonne taille, puis rend celles qui sont visibles.
  Lecteur.prototype.disposer = function () {
    var self = this, pdf = this.pdf;
    if (!pdf) return;
    var e = this.echelle();
    var w = Math.floor(this.base.width * e), h = Math.floor(this.base.height * e);
    var ratio = this.elPages.scrollHeight ? this.elPages.scrollTop / this.elPages.scrollHeight : 0;
    this.elZoom.textContent = Math.round(e * 100 / 1.333) + ' %';  // 100 % = taille imprimée (96/72)
    if (this.obs) this.obs.disconnect();
    this.elPages.innerHTML = '';
    this.feuilles = [];
    for (var n = 1; n <= pdf.numPages; n++) {
      var f = document.createElement('div');
      f.className = 'vlp-feuille';
      f.style.width = w + 'px';
      f.style.height = h + 'px';
      f.setAttribute('data-n', n);
      this.elPages.appendChild(f);
      this.feuilles.push(f);
    }
    this.elPages.scrollTop = ratio * this.elPages.scrollHeight;
    var echelleRendu = e, jeton = this.jeton;
    this.obs = new IntersectionObserver(function (entrees) {
      entrees.forEach(function (en) {
        if (!en.isIntersecting || en.target.getAttribute('data-e') === String(echelleRendu)) return;
        en.target.setAttribute('data-e', String(echelleRendu));
        self.rendre(+en.target.getAttribute('data-n'), en.target, echelleRendu, jeton);
      });
    }, { root: this.elPages, rootMargin: '600px 0px' });
    this.feuilles.forEach(function (f) { self.obs.observe(f); });
    this.majPageCourante();
  };

  Lecteur.prototype.rendre = function (n, feuille, e, jeton) {
    var self = this;
    this.pdf.getPage(n).then(function (page) {
      if (jeton !== self.jeton) return;
      var dpr = Math.min(window.devicePixelRatio || 1, 3);
      var vp = page.getViewport({ scale: e * dpr });
      var c = document.createElement('canvas');
      c.width = Math.floor(vp.width);
      c.height = Math.floor(vp.height);
      c.setAttribute('aria-label', 'Page ' + n);
      return page.render({ canvasContext: c.getContext('2d'), viewport: vp }).promise.then(function () {
        if (jeton !== self.jeton || feuille.getAttribute('data-e') !== String(e)) return;
        feuille.innerHTML = '';
        feuille.appendChild(c);
      });
    }).catch(function (err) { if (window.console) console.warn('[lecteur-pdf] page ' + n, err); });
  };

  Lecteur.prototype.zoomer = function (sens) {
    if (!this.pdf) return;
    var paliers = [0.5, 0.67, 0.8, 0.9, 1, 1.1, 1.25, 1.5, 1.75, 2, 2.5, 3].map(function (p) { return p * 1.333; });
    var cur = this.zoom || this.ajuste, i;
    if (sens > 0) { for (i = 0; i < paliers.length && paliers[i] <= cur + 0.01; i++); this.zoom = paliers[Math.min(i, paliers.length - 1)]; }
    else { for (i = paliers.length - 1; i >= 0 && paliers[i] >= cur - 0.01; i--); this.zoom = paliers[Math.max(i, 0)]; }
    this.disposer();
  };

  Lecteur.prototype.majPageCourante = function () {
    if (!this.pdf || !this.feuilles) return;
    var haut = this.elPages.scrollTop + this.elPages.clientHeight / 3, n = 1;
    for (var i = 0; i < this.feuilles.length; i++) {
      if (this.feuilles[i].offsetTop <= haut) n = i + 1; else break;
    }
    this.elPage.textContent = 'Page ' + n + ' / ' + this.pdf.numPages;
  };

  window.VRTLecteurPDF = {
    monter: function (cible, opts) {
      var el = typeof cible === 'string' ? document.getElementById(cible) : cible;
      if (!el) return null;
      injecterCSS();
      return new Lecteur(el, opts || {});
    }
  };
})();
