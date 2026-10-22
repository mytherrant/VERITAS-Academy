
class DCLogic {
  constructor(props){ this.props = props || {}; }
  setState(){}
}
class Component extends DCLogic {
  state = { page: 'accueil', tab: 1, plus: false, langue: 'fr', theme: 'clair', ia: false, trad: false, cit: 0, citOn: true, copie: false };

  PASSAGES = {
    fr: {
      p1: 'Attendre et voir venir. Oui, attendre et voir venir. Tout ce que je venais de voir, c\u2019\u00e9tait mon homme que Sorraya emportait avec elle dans ses bagages.',
      p2: 'Grand-m\u00e8re aurait dit : \u00ab Courage ! \u00bb Du courage justement, mes concitoyens en eurent besoin.',
      dec: 'La r\u00e9p\u00e9tition ouvre le r\u00e9cit sur l\u2019attente, et le proverbe de la grand-m\u00e8re fait basculer le drame intime vers le politique. Rep\u00e8re ce glissement : il porte toute la satire du roman.'
    },
    en: {
      p1: 'To wait and see. Yes, to wait and see. All I had just witnessed was my man, whom Sorraya was carrying away with her in her luggage.',
      p2: 'Grandmother would have said: \u201cCourage!\u201d Courage was exactly what my fellow citizens needed.',
      dec: 'The repetition opens the narrative on waiting, and the grandmother\u2019s proverb tips a private drama into a political one. Track that shift \u2014 it carries the whole satire of the novel.'
    }
  };

  /* ── Le catalogue de la boutique ──────────────────────────────────────────
     Chaque titre porte DE QUOI DESSINER SA COUVERTURE. Avant, les neuf cartes
     recadraient la même photo de groupe (assets/photo-manuels.webp) : la carte
     du 6ᵉ montrait le 6ᵉ et le 5ᵉ, celle du 5ᵉ le 5ᵉ et le 4ᵉ. Une vignette de
     135 px le laissait passer ; une couverture de 262 px, non.

     Ordre de préséance, lu par le gabarit :
       1. `couv`      — une VRAIE image de couverture (une seule existe
                        aujourd'hui : le cahier de 6ᵉ) ;
       2. `couvRoman` — composition littéraire (fond profond, titre en serif) ;
       3. `couvCahier`— composition d'après la maquette imprimée réelle.
     Poser une image dans `couv` suffit à remplacer la composition.

     `couvTeinte` est la couleur de l'IMPRIMÉ (6ᵉ vert, 5ᵉ bleu, 4ᵉ violet,
     examens orange/rouge, relevés sur la photo du catalogue) ; `teinte` reste
     l'accent de la CARTE, choisi pour le rythme de la page. Les deux ne se
     confondent pas : l'une décrit le produit, l'autre la mise en page. */
  CATALOGUE_MANUELS = [
    { niv: 'Roman', teinte: '#A84200', fondA: '#F3E7D8', fondB: '#FBF6EF', categorie: 'Littérature', etiquette: 'Nouveau', etiquetteFond: '#007E11', exos: '144 pages · 8 chapitres', lien: 'app.html#livre?id=tubedigestif', mention: 'lecture en ligne, sans téléchargement', titre: 'Le Tube digestif', type: 'Roman de Mythe Errant · 10 pages offertes', prix: '1 000 F',
      format: 'ebook', formatNom: 'E-book', formatCls: 'vbq-fmt-ebook',
      /* La VRAIE couverture, depuis le 28/08/2026. `couvRoman` — la
         composition typographique navy — etait un pis-aller ne du jour ou
         l'image manquait et rendait un 404. Il est RETIRE, pas garde en
         repli : le gabarit enchaine deux `sc-if` independants, sans
         « sinon », si bien que les deux se dessinaient l'une sous l'autre.
         Mesure avant correction : 1 image + 1 composition sur la meme
         carte. Un repli qui s'affiche EN PLUS n'est pas un repli. */
      couv: 'uploads/oeuvres/tubedigestif.jpg' },

    { niv: '6ᵉ', teinte: '#1E499B', fondA: '#E4EBF7', fondB: '#F2F5FB', categorie: 'Cahier d’exercices', etiquette: '', etiquetteFond: '#A84200', exos: '', papier: true, mention: 'corrigés en ligne inclus', commander: () => this._go('paiement'), titre: 'Cahier d’exercices — Français 6ᵉ', type: 'Cahier · 463 exercices corrigés', prix: '3 000 F',
      format: 'papier', formatNom: 'Papier', formatCls: 'vbq-fmt-papier',
      couv: 'assets/cahier-6e.webp' },

    { niv: '5ᵉ', teinte: '#0E7C86', fondA: '#E1EFEE', fondB: '#F1F8F6', categorie: 'Cahier d’exercices', etiquette: '', etiquetteFond: '#A84200', exos: '', papier: true, mention: 'corrigés en ligne inclus', commander: () => this._go('paiement'), titre: 'Cahier d’exercices — Français 5ᵉ', type: 'Cahier · 443 exercices corrigés', prix: '3 000 F',
      format: 'papier', formatNom: 'Papier', formatCls: 'vbq-fmt-papier',
      couvCahier: true, couvTeinte: '#1B5FAE', couvHaut: 'Mon cahier de', couvTitre: 'Français', couvNiv: '5ᵉ', couvRuban: '100 % conforme au programme' },

    { niv: '4ᵉ', teinte: '#5B4FA8', fondA: '#ECE7F7', fondB: '#F6F3FC', categorie: 'Cahier d’exercices', etiquette: '', etiquetteFond: '#A84200', exos: '', papier: true, mention: 'corrigés en ligne inclus', commander: () => this._go('paiement'), titre: 'Cahier d’exercices — Français 4ᵉ', type: 'Cahier · 364 exercices corrigés', prix: '3 000 F',
      format: 'papier', formatNom: 'Papier', formatCls: 'vbq-fmt-papier',
      couvCahier: true, couvTeinte: '#7A2E86', couvHaut: 'Mon cahier de', couvTitre: 'Français', couvNiv: '4ᵉ', couvRuban: '100 % conforme au programme' },

    { niv: '3ᵉ', teinte: '#A84200', fondA: '#FBEBDB', fondB: '#FDF6EF', categorie: 'Spécial examen', etiquette: 'Best-seller', etiquetteFond: '#5B4FA8', exos: '', papier: true, mention: 'corrigés en ligne inclus', commander: () => this._go('paiement'), titre: 'Spécial BEPC — Français', type: 'Cahier + annales · 476 exercices', prix: '4 000 F',
      format: 'papier', formatNom: 'Papier', formatCls: 'vbq-fmt-papier',
      couvCahier: true, couvTeinte: '#C85A18', couvHaut: 'Spécial', couvTitre: 'BEPC', couvNiv: '3ᵉ', couvRuban: 'Cahier + annales corrigées' },

    { niv: '2ⁿᵈᵉ', teinte: '#1E499B', fondA: '#E4EBF7', fondB: '#F2F5FB', categorie: 'Cahier d’exercices', etiquette: '', etiquetteFond: '#A84200', exos: '', papier: true, mention: 'corrigés en ligne inclus', commander: () => this._go('paiement'), titre: 'Cahier d’exercices — Français 2ⁿᵈᵉ', type: 'Cahier · 709 exercices corrigés', prix: '3 500 F',
      format: 'papier', formatNom: 'Papier', formatCls: 'vbq-fmt-papier',
      couvCahier: true, couvTeinte: '#0E7C86', couvHaut: 'Mon cahier de', couvTitre: 'Français', couvNiv: '2ⁿᵈᵉ', couvRuban: '100 % conforme au programme' },

    { niv: '1ʳᵉ', teinte: '#B03A6E', fondA: '#F7E4EC', fondB: '#FCF3F7', categorie: 'Spécial examen', etiquette: '', etiquetteFond: '#A84200', exos: '', papier: true, mention: 'corrigés en ligne inclus', commander: () => this._go('paiement'), titre: 'Spécial Probatoire — Français', type: 'Cahier + annales · 664 exercices', prix: '4 500 F',
      format: 'papier', formatNom: 'Papier', formatCls: 'vbq-fmt-papier',
      couvCahier: true, couvTeinte: '#B03A6E', couvHaut: 'Spécial', couvTitre: 'Probatoire', couvNiv: '1ʳᵉ', couvRuban: 'Cahier + annales corrigées' },

    { niv: 'Tˡᵉ', teinte: '#0E7C86', fondA: '#E1EFEE', fondB: '#F1F8F6', categorie: 'Spécial examen', etiquette: 'Le plus vendu', etiquetteFond: '#A84200', exos: '', papier: true, mention: 'corrigés en ligne inclus', commander: () => this._go('paiement'), titre: 'Spécial BAC — Français', type: 'Cahier + annales corrigées', prix: '5 000 F',
      format: 'papier', formatNom: 'Papier', formatCls: 'vbq-fmt-papier',
      couvCahier: true, couvTeinte: '#B02A26', couvHaut: 'Spécial', couvTitre: 'BAC', couvNiv: 'Tˡᵉ', couvRuban: 'Cahier + annales corrigées' },

    { niv: '3ᵉ → Tˡᵉ', teinte: '#5B4FA8', fondA: '#ECE7F7', fondB: '#F6F3FC', categorie: 'Étude d’œuvre', etiquette: 'Nouveau', etiquetteFond: '#007E11', exos: 'Fiches + sujets', papier: true, mention: 'corrigés en ligne inclus', commander: () => this._go('paiement'), titre: 'Le Tube Digestif — étude intégrale', type: 'Étude d’œuvre · fiches et sujets', prix: '2 500 F',
      format: 'papier', formatNom: 'Papier', formatCls: 'vbq-fmt-papier',
      couvCahier: true, couvTeinte: '#5B4FA8', couvHaut: 'Étude de l’œuvre', couvTitre: 'Le Tube digestif', couvNiv: '3ᵉ → Tˡᵉ', couvRuban: 'Fiches et sujets corrigés' }
  ];

  /* ── Boutique : les categories sortent du CATALOGUE, pas d'une liste ──────
     La barre de filtres etait ecrite a la main (sept pastilles) et ne filtrait
     rien ; trois de ses categories ne correspondaient a aucun article. Ici,
     une categorie n'existe que si un titre la porte, et le compteur compte ce
     qui est reellement affiche. Ajouter un manuel de mathematiques au
     catalogue fera apparaitre sa pastille tout seul. */
  get categoriesBoutique() {
    const ICO = {
      'Cahier d\u2019exercices': '#lc-book',
      'Sp\u00e9cial examen': '#lc-clipboard',
      '\u00c9tude d\u2019\u0153uvre': '#lc-bookopen',
      'Litt\u00e9rature': '#lc-bookopen',
      'Guide enseignant': '#lc-presentation'
    };
    const LIB = {
      'Cahier d\u2019exercices': 'Cahiers d\u2019exercices',
      'Sp\u00e9cial examen': 'Annales d\u2019examen',
      '\u00c9tude d\u2019\u0153uvre': '\u00c9tudes d\u2019\u0153uvres',
      'Litt\u00e9rature': 'Litt\u00e9rature',
      'Guide enseignant': 'Guides enseignants'
    };
    const vues = [];
    for (const m of this.CATALOGUE_MANUELS) {
      const c = String(m.categorie || '').trim();
      if (c && vues.indexOf(c) < 0) vues.push(c);
    }
    const base = [{ cle: '', nom: 'Tout le catalogue', ico: '#lc-basket' }].concat(
      vues.map(c => ({ cle: c, nom: LIB[c] || c, ico: ICO[c] || '#lc-book' })));
    /* ── Le FORMAT, deuxième dimension de tri ────────────────────────────
       Le catalogue est mixte : des cahiers qu'on reçoit, des livres qu'on
       lit en ligne. C'est la première question du visiteur devant la
       grille, et rien ne permettait d'y répondre — un e-book se distinguait
       d'un cahier uniquement par le libellé de son bouton, tout en bas de
       la carte. Ces deux pastilles sont indexées comme les autres : elles
       passent par le même compteur, le même pré-calcul, le même clic. Le
       préfixe « @ » les distingue d'une catégorie éditoriale ; une clé de
       catégorie ne peut pas commencer par là, elle vient du catalogue.
       Une pastille n'apparaît que si un titre porte ce format : catalogue
       sans e-book, pas de pastille « Lecture en ligne ». */
    const formats = [];
    if (this.CATALOGUE_MANUELS.some(m => m.format === 'papier'))
      formats.push({ cle: '@papier', nom: 'Livres papier', ico: '#lc-shop' });
    if (this.CATALOGUE_MANUELS.some(m => m.format === 'ebook'))
      formats.push({ cle: '@ebook', nom: 'Lecture en ligne', ico: '#lc-bookopen' });
    return base.concat(formats);
  }

  /* ── Les chiffres du bandeau, COMPTÉS ──────────────────────────────────
     La maquette annonçait « 134 titres au catalogue » et « 4 000 F prix
     moyen » sur une boutique qui en contient neuf, à 3 278 F de moyenne.
     Le même 134 était recopié dans deux autres bandeaux de chiffres. Sur une
     page qui encaisse, un nombre inventé est ce qu'un enseignant vérifie en
     premier — et c'est vérifiable en trois secondes : il compte les cartes.
     On les calcule donc, ici, à partir du catalogue lui-même. */
  get nbTitresCat() { return String(this.CATALOGUE_MANUELS.length); }

  get prixMoyenCat() {
    const p = this.CATALOGUE_MANUELS
      .map(m => parseInt(String(m.prix).replace(/[^0-9]/g, ''), 10))
      .filter(n => n > 0);
    if (!p.length) return '—';
    const moy = Math.round(p.reduce((a, b) => a + b, 0) / p.length);
    // Arrondi à la centaine : « 3 278 F » affiche une précision que la
    // moyenne d'un catalogue de neuf titres n'a pas.
    return (Math.round(moy / 100) * 100).toLocaleString('fr-FR').replace(/ | /g, ' ') + ' F';
  }

  get manuelsFiltres() {
    const cats = this.categoriesBoutique;
    const i = Math.min(Math.max((this.state && this.state.filtre) || 0, 0), cats.length - 1);
    const cle = cats[i].cle;
    if (!cle) return this.CATALOGUE_MANUELS;
    if (cle.charAt(0) === '@') return this.CATALOGUE_MANUELS.filter(m => m.format === cle.slice(1));
    return this.CATALOGUE_MANUELS.filter(m => m.categorie === cle);
  }

  CITATIONS = [
    { t: 'Le g\u00e9nie, c\u2019est un pour cent d\u2019inspiration et quatre-vingt-dix-neuf pour cent de transpiration.', a: 'Thomas Edison' },
    { t: 'Ce n\u2019est pas parce que les choses sont difficiles que nous n\u2019osons pas ; c\u2019est parce que nous n\u2019osons pas qu\u2019elles sont difficiles.', a: 'S\u00e9n\u00e8que' },
    { t: 'L\u2019\u00e9ducation est l\u2019arme la plus puissante pour changer le monde.', a: 'Nelson Mandela' },
    { t: 'Un peu chaque jour vaut mieux que beaucoup un seul jour.', a: 'Proverbe' },
    { t: 'La chance sourit \u00e0 l\u2019esprit pr\u00e9par\u00e9.', a: 'Louis Pasteur' },
    { t: 'Tomber sept fois, se relever huit.', a: 'Proverbe japonais' }
  ];

  componentDidMount(){
    this._wire();
    this._onResize = () => {
      const compact = window.innerWidth < 1000;
      const court = window.innerHeight < 700;
      if (compact !== this.state.compact || court !== this.state.court) this.setState({ compact, court, burger: false, ia: false, trad: false });
    };
    this._onResize();
    window.addEventListener('resize', this._onResize);
    this._citTimer = setInterval(() => {
      this.setState(s => ({ cit: (s.cit + 1) % this.CITATIONS.length, citOn: true }));
    }, 45000);
  }

  componentWillUnmount(){
    clearInterval(this._citTimer); clearTimeout(this._copieTimer);
    clearTimeout(this._revTimer1); clearTimeout(this._revTimer2);
    window.removeEventListener('resize', this._onResize);
    if (this._reveler) { window.removeEventListener('scroll', this._reveler); window.removeEventListener('resize', this._reveler); }
  }

  _appliquerTheme(mode){
    let el = document.getElementById('vrt-theme');
    if (!el) { el = document.createElement('style'); el.id = 'vrt-theme'; document.head.appendChild(el); }
    el.textContent = mode !== 'sombre' ? '' : `
      body{background:#0A1428!important}
      [style*="background:#fff"],[style*="background:#FAFBFE"],[style*="background:#FCFDFE"],[style*="background:#F7F9FD"]{background:#132241!important}
      [style*="background:#F4F5F8"],[style*="background:#F4F6FB"],[style*="background:#EFF2F7"],[style*="background:#F5F9FF"]{background:#0F1B33!important}
      [style*="background:rgba(255,255,255,.96)"]{background:rgba(13,25,48,.96)!important}
      [style*="radial-gradient(1100px"],[style*="radial-gradient(900px"]{background:#0C1730!important}
      [style*="linear-gradient(180deg,#FBF8F1"]{background:#0C1730!important}
      [style*="color:#001136"]{color:#EEF3FC!important}
      [style*="color:#0C2A6A"]{color:#DCE6F8!important}
      [style*="color:#4D5163"],[style*="color:#6B5A42"]{color:#B6C2D8!important}
      [style*="color:#6E7385"],[style*="color:#9BA6BE"]{color:#8D9AB4!important}
      [style*="border:1px solid transparent"],[style*="border:1px solid transparent"],[style*="border:1px solid transparent"]{border-color:#24334F!important}
      [style*=""],[style*=""]{border-bottom-color:#24334F!important}
      [style*=""]{border-top-color:#24334F!important}
      [style*="border-left:4px solid"]{border-left-color:#FFC93C!important}
      input,input::placeholder{color:#C7D2E6!important}
    `;
  }
  componentDidUpdate(){ this._wire(); }

  _wire(){
    const anim = this.props.animations || 'riche';
    if (anim === 'aucune') {
      document.querySelectorAll('[data-reveal]').forEach(el => { el.dataset.rvu = '1'; el.style.opacity = '1'; el.style.transform = 'none'; });
      return;
    }
    this._noPara = anim !== 'riche';
    const nav = document.getElementById('vrtNav');
    if (!this._scroll) {
      this._scroll = () => {
        if (nav) nav.style.boxShadow = window.scrollY > 12 ? '0 4px 18px rgba(0,17,54,.10)' : 'none';
        const px = this._noPara ? [] : document.querySelectorAll('[data-parallax]');
        px.forEach(el => {
          const r = el.getBoundingClientRect();
          const k = parseFloat(el.getAttribute('data-parallax')) || 0;
          const d = (window.innerHeight / 2 - (r.top + r.height / 2)) * k;
          el.style.transform = 'translate3d(0,' + d.toFixed(1) + 'px,0)';
        });
      };
      window.addEventListener('scroll', this._scroll, { passive: true });
    }
    this._scroll();

    // Révélation au défilement, mesurée à chaque passe : aucune dépendance
    // à un observateur posé une seule fois (React remonte les nœuds).
    if (!this._reveler) {
      this._reveler = () => {
        const hauteur = window.innerHeight || 800;
        document.querySelectorAll('[data-reveal]').forEach(el => {
          if (el.dataset.rvu) return;
          const r = el.getBoundingClientRect();
          if (r.top < hauteur - 60 && r.bottom > 0) {
            el.dataset.rvu = '1';
            const d = +(el.dataset.rdelay || 0);
            el.style.transition = 'opacity .55s ease ' + d + 'ms, transform .55s cubic-bezier(.16,1,.3,1) ' + d + 'ms';
            el.style.opacity = '1';
            el.style.transform = 'none';
          }
        });
      };
      window.addEventListener('scroll', this._reveler, { passive: true });
      window.addEventListener('resize', this._reveler);
    }
    document.querySelectorAll('[data-reveal]').forEach((el, i) => {
      if (el.dataset.rprep) return;
      el.dataset.rprep = '1';
      el.dataset.rdelay = String((i % 8) * 55);
      el.style.opacity = '0';
      el.style.transform = 'translateY(18px)';
    });
    this._reveler();
    // filets de sécurité : rien ne peut rester masqué
    clearTimeout(this._revTimer1); clearTimeout(this._revTimer2);
    this._revTimer1 = setTimeout(this._reveler, 260);
    this._revTimer2 = setTimeout(() => {
      document.querySelectorAll('[data-reveal]').forEach(el => {
        if (el.dataset.rvu) return;
        el.dataset.rvu = '1';
        el.style.transition = 'opacity .45s ease';
        el.style.opacity = '1';
        el.style.transform = 'none';
      });
    }, 1600);
    document.querySelectorAll('[data-count]').forEach(el => {
      if (el.dataset.cdone) return;
      el.dataset.cdone = '1';
      const target = parseInt(el.dataset.count, 10) || 0;
      const start = performance.now(), dur = 1100;
      const fmt = n => n.toLocaleString('fr-FR');
      const step = t => {
        const p = Math.min(1, (t - start) / dur);
        el.textContent = fmt(Math.round(target * (1 - Math.pow(1 - p, 3))));
        if (p < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    });
  }

  componentWillUnmount(){
    if (this._scroll) window.removeEventListener('scroll', this._scroll);
    if (this._io) this._io.disconnect();
  }

  _go(page){ this.setState({ page, plus: false, burger: false }); window.scrollTo({ top: 0, behavior: 'smooth' }); }

  _ongletsData(){
    return [
      { nom: 'Apprendre', ico: '#lc-book' },
      { nom: 'S\u2019entra\u00eener', ico: '#lc-clipboard' },
      { nom: 'Se faire aider', ico: '#lc-brain' },
      { nom: 'Vie scolaire', ico: '#lc-building' },
      { nom: 'R\u00e9p\u00e9titions', ico: '#lc-presentation' }
    ];
  }

  _servicesData(){
    return {
      1: [
        { ico: '#lc-bookopen', titre: 'Cours par s\u00e9quence', desc: 'Six s\u00e9quences par niveau : le\u00e7ons de langue, groupements de textes, m\u00e9thodes r\u00e9dig\u00e9es comme au tableau.', prix: 'Inclus d\u00e8s {PRIX:abo_starter_m|1 000} F', fond: '#DBE8FE', teinte: '#1E499B' },
        { ico: '#lc-book', titre: '\u0152uvres au programme', desc: '\u00c9tude int\u00e9grale : r\u00e9sum\u00e9 par chapitre, personnages, axes de lecture, sujets de dissertation.', prix: 'Inclus d\u00e8s {PRIX:abo_starter_m|1 000} F', fond: '#EEE9F8', teinte: '#5B4FA8' },
        { ico: '#lc-atom', titre: 'Labos virtuels', desc: 'Exp\u00e9riences de PCT et SVT simul\u00e9es, pour les \u00e9tablissements sans laboratoire \u00e9quip\u00e9.', prix: 'Plan Pro', fond: '#E3F1EE', teinte: '#0E7C86' },
        { ico: '#lc-doc', titre: 'Mon cahier en ligne', desc: 'Le cahier de papier, rempli à l’écran : on écrit dedans, le travail se garde, et la correction s’ouvre dès qu’on a cherché.', prix: '1 500 F', fond: '#FDECEF', teinte: '#B03A6E' },
        { ico: '#lc-game', titre: 'Jeux p\u00e9dagogiques', desc: 'R\u00e9visions actives : quiz chronom\u00e9tr\u00e9s, associations, cartes m\u00e9moire par mati\u00e8re.', prix: 'Gratuit', fond: '#E0F5E5', teinte: '#007E11' }
      ],
      2: [
        { ico: '#lc-clipboard', titre: '\u00c9preuves & annales', desc: 'BEPC, Probatoire, BAC et GCE avec corrig\u00e9s mod\u00e8les et bar\u00e8me d\u00e9taill\u00e9.', prix: 'Gratuit', fond: '#DBE8FE', teinte: '#1E499B' },
        { ico: '#lc-checkcircle', titre: 'Corrig\u00e9s des cahiers', desc: '9 709 exercices corrig\u00e9s, ceux des cahiers imprim\u00e9s du centre, consultables sans compte.', prix: 'Gratuit', fond: '#E0F5E5', teinte: '#007E11' },
        { ico: '#lc-clipboard', titre: 'Bulletins blancs', desc: 'Devoirs surveill\u00e9s comme en classe, not\u00e9s, avec position dans la promotion.', prix: 'Plan Pro', fond: '#FFF3E4', teinte: '#A84200' },
        { ico: '#lc-trophy', illu: '#du-trophy', titre: 'Concours blancs', desc: 'Sessions d\u2019entra\u00eenement chronom\u00e9tr\u00e9es en conditions d\u2019examen, corrig\u00e9es sous 48 h.', prix: 'Plan \u00c9lite', fond: '#EEE9F8', teinte: '#5B4FA8' }
      ],
      3: [
        { ico: '#lc-brain', titre: 'Professeur Ambassa', desc: 'Le tuteur IA form\u00e9 sur le programme : il explique la m\u00e9thode plut\u00f4t que de donner la r\u00e9ponse.', prix: '3 questions offertes / semaine', fond: '#EEE9F8', teinte: '#5B4FA8' },
        { ico: '#lc-presentation', titre: 'Classes virtuelles', desc: 'S\u00e9ances en direct avec un enseignant du r\u00e9seau, en petit groupe, le soir et le week-end.', prix: 'Plan \u00c9lite', fond: '#DBE8FE', teinte: '#1E499B' },
        { ico: '#lc-compass', titre: 'Orientation', desc: 'Choix de s\u00e9rie, fili\u00e8res apr\u00e8s le BAC, concours d\u2019entr\u00e9e : fiches et entretien conseil.', prix: 'Sur rendez-vous', fond: '#E3F1EE', teinte: '#0E7C86' },
        { ico: '#lc-headphones', titre: 'Support WhatsApp', desc: 'Une \u00e9quipe humaine \u00e0 Douala, r\u00e9ponse sous 2 h les jours ouvr\u00e9s.', prix: 'Gratuit', fond: '#E0F5E5', teinte: '#007E11' }
      ],
      4: [
        { ico: '#lc-users', titre: 'Espace Parents', desc: 'Notes, absences, tranches r\u00e9gl\u00e9es et restantes, visibles depuis le t\u00e9l\u00e9phone.', prix: 'Gratuit', fond: '#E3F1EE', teinte: '#0E7C86' },
        { ico: '#lc-card', titre: 'Cagnotte de scolarit\u00e9', desc: 'Un proche \u00e0 l\u2019\u00e9tranger r\u00e8gle une tranche par carte ou PayPal ; re\u00e7u envoy\u00e9 aux deux parties.', prix: 'Sans frais c\u00f4t\u00e9 famille', fond: '#FFF3E4', teinte: '#A84200' },
        { ico: '#lc-basket', titre: 'Boutique de manuels', desc: 'Cahiers d\u2019exercices et guides du centre, livr\u00e9s \u00e0 Douala et Yaound\u00e9.', prix: 'D\u00e8s 2 500 F', fond: '#DBE8FE', teinte: '#1E499B' },
        { ico: '#lc-shield', titre: 'Certificats v\u00e9rifiables', desc: 'Chaque attestation porte un code de contr\u00f4le consultable en ligne par l\u2019employeur ou l\u2019\u00e9cole.', prix: 'Inclus', fond: '#E0F5E5', teinte: '#007E11' }
      ],
      5: [
        { ico: '#lc-users', titre: 'R\u00e9p\u00e9titions au centre', desc: 'Petits groupes de six \u00e9l\u00e8ves maximum, au centre \u00e0 Douala, apr\u00e8s les cours et le samedi matin.', prix: 'D\u00e8s 10 000 F / mois', fond: '#DBE8FE', teinte: '#1E499B' },
        { ico: '#lc-home', titre: 'R\u00e9p\u00e9titions \u00e0 domicile', desc: 'Un enseignant du r\u00e9seau se d\u00e9place chez vous, deux \u00e0 quatre s\u00e9ances par semaine.', prix: 'D\u00e8s 30 000 F / mois', fond: '#FFF3E4', teinte: '#A84200' },
        { ico: '#lc-presentation', titre: 'Cours de rattrapage', desc: 'Remise \u00e0 niveau cibl\u00e9e sur une mati\u00e8re, pendant les vacances ou avant un examen.', prix: 'Stage d\u00e8s 20 000 F', fond: '#E3F1EE', teinte: '#0E7C86' },
        { ico: '#lc-trophy', illu: '#du-trophy', titre: 'Pr\u00e9paration examens', desc: 'Programme intensif BEPC, Probatoire, BAC et GCE : m\u00e9thode, annales, concours blancs.', prix: 'Sur devis', fond: '#EEE9F8', teinte: '#5B4FA8' }
      ]
    };
  }

  renderVals(){
    const p = this.state.page, t = this.state.tab;
    const onglets = this._ongletsData().map((o, i) => {
      const actif = t === i + 1;
      return {
        nom: o.nom, ico: o.ico, aller: () => this.setState({ tab: i + 1 }),
        fond: actif ? '#F4F6FB' : 'transparent',
        texte: actif ? '#0C2A6A' : '#6E7385',
        teinte: actif ? '#1E499B' : '#9BA6BE',
        graisse: actif ? 600 : 500,
        trait: actif ? '#1E499B' : 'transparent'
      };
    });
    return {
      services: this._servicesData()[t] || [],
      voirAvis: this.props.afficherAvis !== false,

      // ── Passage du jour : langue, copie, partage ──
      dateDuJour: new Date().toLocaleDateString('fr-FR', { day: 'numeric', month: 'long' }),
      passage1: this.PASSAGES[this.state.langue].p1,
      passage2: this.PASSAGES[this.state.langue].p2,
      decryptage: this.PASSAGES[this.state.langue].dec,
      mettreFr: () => this.setState({ langue: 'fr', trad: false }),
      mettreEn: () => this.setState({ langue: 'en', trad: false }),
      fondFr: this.state.langue === 'fr' ? '#1E499B' : 'transparent',
      texteFr: this.state.langue === 'fr' ? '#fff' : '#4D5163',
      fondEn: this.state.langue === 'en' ? '#1E499B' : 'transparent',
      texteEn: this.state.langue === 'en' ? '#fff' : '#4D5163',
      fondFrDock: this.state.langue === 'fr' ? '#F0F5FF' : '#fff',
      texteFrDock: this.state.langue === 'fr' ? '#1E499B' : '#4D5163',
      bordFr: this.state.langue === 'fr' ? '#1E499B' : '#E4E7EF',
      fondEnDock: this.state.langue === 'en' ? '#F0F5FF' : '#fff',
      texteEnDock: this.state.langue === 'en' ? '#1E499B' : '#4D5163',
      bordEn: this.state.langue === 'en' ? '#1E499B' : '#E4E7EF',
      copierPassage: () => {
        const t = this.PASSAGES[this.state.langue];
        const txt = '\u00ab ' + t.p1 + ' ' + t.p2 + ' \u00bb\n\u2014 Le Tube Digestif, Alobwed\u2019Epie\nPassage du jour \u00b7 V\u00c9RITAS';
        const fini = () => {
          this.setState({ copie: true });
          clearTimeout(this._copieTimer);
          this._copieTimer = setTimeout(() => this.setState({ copie: false }), 2400);
        };
        if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(txt).then(fini, fini);
        else fini();
      },
      texteBoutonCopie: this.state.copie ? 'Copi\u00e9 !' : 'Copier le passage',
      icoCopie: this.state.copie ? '#lc-checkcircle' : '#lc-copy',
      fondCopie: this.state.copie ? '#E0F5E5' : '#fff',
      texteCopie: this.state.copie ? '#007E11' : '#1E499B',
      bordCopie: this.state.copie ? '#7BD99C' : '#1E499B',
      partages: (() => {
        const t = this.PASSAGES[this.state.langue];
        const txt = encodeURIComponent('\u00ab ' + t.p1 + ' \u00bb \u2014 Le Tube Digestif, Alobwed\u2019Epie | Passage du jour V\u00c9RITAS');
        const url = encodeURIComponent('https://veritas-centre.cm/passage-du-jour');
        return [
          { nom: 'WhatsApp', ico: '#brand-whatsapp', fond: '#E7F7EC', teinte: '#007E11', url: 'https://wa.me/?text=' + txt },
          { nom: 'Facebook', ico: '#brand-facebook', fond: '#E7EFFC', teinte: '#1E499B', url: 'https://www.facebook.com/sharer/sharer.php?u=' + url },
          { nom: 'X', ico: '#brand-x', fond: '#ECEEF3', teinte: '#001136', url: 'https://twitter.com/intent/tweet?text=' + txt },
          { nom: 'E-mail', ico: '#lc-mail', fond: '#FDF0E2', teinte: '#A84200', url: 'mailto:?subject=Passage%20du%20jour%20V%C3%89RITAS&body=' + txt }
        ];
      })(),

      // ── Outils flottants ──
      iaOuverte: this.state.ia && !this.state.court,
      basculerIA: () => this.setState(s => ({ ia: !s.ia, trad: false })),
      ouvrirIA: () => this.setState({ ia: true }),
      suggestionsIA: ['M\u00e9thode de la dissertation', 'Expliquer ce passage', '\u00c9quation du second degr\u00e9'],
      traducteurOuvert: this.state.trad && !this.state.court,
      basculerTraducteur: () => this.setState(s => ({ trad: !s.trad, ia: false })),
      basculerTheme: () => {
        const mode = this.state.theme === 'clair' ? 'sombre' : 'clair';
        this._appliquerTheme(mode);
        this.setState({ theme: mode });
      },
      icoTheme: this.state.theme === 'clair' ? '#lc-moon' : '#lc-sun',
      citationVisible: this.state.citOn && !this.state.court,
      citationTexte: this.CITATIONS[this.state.cit].t,
      citationAuteur: '\u2014 ' + this.CITATIONS[this.state.cit].a,
      fermerCitation: () => this.setState({ citOn: false }),
      nouvelleCitation: () => this.setState(s => ({ cit: (s.cit + 1) % this.CITATIONS.length, citOn: true })),
      session: String(new Date().getFullYear()),
      reassurance: [
        { txt: 'Essai offert, sans carte bancaire', ico: '#lc-gift', teinte: '#A84200' },
        { txt: 'R\u00e9siliable en un message', ico: '#lc-checkcircle', teinte: '#007E11' },
        { txt: 'MTN MoMo & Orange Money', ico: '#lc-smartphone', teinte: '#1E499B' },
        { txt: 'Programme MINESEC officiel', ico: '#lc-shield', teinte: '#5B4FA8' },
        { txt: 'Support WhatsApp sous 2 h', ico: '#lc-message', teinte: '#0E7C86' }
      ],

      // ── Boutique ──
      /* Le compteur etait ecrit « 9 » a la main pour huit titres, et la barre
         de filtres ne filtrait rien : cliquer « Mathematiques » repeignait la
         pastille et laissait la meme grille (mesure du 19/08/2026 : zone
         identique au caractere pres). Trois des sept categories ne
         correspondaient d'ailleurs a aucun article du catalogue. On lit donc
         desormais les CATEGORIES DANS LE CATALOGUE : une categorie sans titre
         n'apparait pas, et le compteur compte ce qui est vraiment affiche. */
      nbManuels: String(this.manuelsFiltres.length),
      nbTitresCat: this.nbTitresCat,
      prixMoyenCat: this.prixMoyenCat,
      filtres: (() => {
        const f = this.categoriesBoutique;
        const actif = Math.min(Math.max(this.state.filtre || 0, 0), f.length - 1);
        return f.map((x, i) => ({
          nom: x.nom, ico: x.ico,
          aller: () => this.setState({ filtre: i }),
          fond: i === actif ? '#FFF3E4' : '#fff',
          bord: i === actif ? '#A84200' : '#E4E7EF',
          texte: i === actif ? '#A84200' : '#4D5163',
          graisse: i === actif ? '600' : '400'
        }));
      })(),
      argumentsLivre: [
        { titre: 'Exercices corrig\u00e9s', desc: 'Chaque \u00e9nonc\u00e9 trait\u00e9 pas \u00e0 pas', ico: '#lc-checkcircle' },
        { titre: '\u0152uvres au programme', desc: '\u00c9tudes int\u00e9grales incluses', ico: '#lc-bookopen' },
        { titre: 'Annales du BAC', desc: 'Sessions corrig\u00e9es et comment\u00e9es', ico: '#lc-clipboard' }
      ],
      livraison: [
        { titre: 'Livraison 48 h', desc: 'Douala et Yaound\u00e9, remise en main propre par notre coursier.', ico: '#lc-truck', fond: '#DBE8FE', teinte: '#1E499B' },
        { titre: 'Retrait au centre', desc: 'Gratuit, du lundi au samedi de 8 h \u00e0 19 h, sans rendez-vous.', ico: '#lc-building', fond: '#E3F1EE', teinte: '#0E7C86' },
        { titre: 'Paiement Mobile Money', desc: 'MTN MoMo et Orange Money, ou carte pour les proches \u00e0 l\u2019\u00e9tranger.', ico: '#lc-smartphone', fond: '#FFF3E4', teinte: '#A84200' },
        { titre: 'Corrig\u00e9s offerts', desc: 'Le QR en pr\u00e9face ouvre la version en ligne, \u00e0 vie et sans compte.', ico: '#lc-qr', fond: '#EEE9F8', teinte: '#5B4FA8' }
      ],

      // ── Paiement ──
      estPaiement: p === 'paiement',
      goBoutique: () => this._go('boutique'),
      commanderVedette: () => this._go('paiement'),
      quantite: String(this.state.qte || 1),
      ajouterArticle: () => this.setState(s => ({ qte: Math.min((s.qte || 1) + 1, 9) })),
      retirerArticle: () => this.setState(s => ({ qte: Math.max((s.qte || 1) - 1, 1) })),
      etapesPaiement: [
        { n: '1', titre: 'Panier', desc: 'Article s\u00e9lectionn\u00e9', fond: '#007E11', bord: '#007E11', texte: '#fff', titreCouleur: '#001136', trait: '#007E11' },
        { n: '2', titre: 'Paiement', desc: 'Choix du moyen', fond: '#1E499B', bord: '#1E499B', texte: '#fff', titreCouleur: '#001136', trait: '#E4E7EF' },
        { n: '3', titre: 'Re\u00e7u', desc: 'Num\u00e9rot\u00e9 avec QR', fond: '#fff', bord: '#E4E7EF', texte: '#9BA6BE', titreCouleur: '#9BA6BE', trait: 'transparent' }
      ],
      legal: [
        { cle: 'RCCM', val: 'CM-DLA-03-2026-B12-00729' },
        { cle: 'NIU', val: 'M072618875274L' },
        { cle: 'Capital', val: '999 000 FCFA' },
        { cle: 'Si\u00e8ge', val: 'Douala, Cameroun' }
      ],
      sequence: [
        { ico: '#lc-book', teinte: '#5B8AD9', titre: 'Le programme officiel', desc: 'S\u00e9quence par s\u00e9quence, conforme au MINESEC \u2014 g\u00e9n\u00e9ral, technique et GCE.', retard: '0s' },
        { ico: '#lc-clipboard', teinte: '#FFC93C', titre: '9 709 exercices corrig\u00e9s', desc: 'Chaque \u00e9nonc\u00e9 avec sa d\u00e9marche d\u00e9taill\u00e9e, pas seulement la r\u00e9ponse.', retard: '3s' },
        { ico: '#lc-brain', teinte: '#B3A6E8', titre: 'Le tuteur qui explique', desc: 'Professeur Ambassa r\u00e9pond \u00e0 toute heure, en fran\u00e7ais comme en anglais.', retard: '6s' },
        { ico: '#lc-users', teinte: '#7BD1CE', titre: 'Les parents suivent', desc: 'Notes, absences et tranches r\u00e9gl\u00e9es \u2014 visibles le jour m\u00eame.', retard: '9s' }
      ],
      orbite: [
        { ico: '#lc-graduation', teinte: '#FFC93C', x: '50%', y: '0%' },
        { ico: '#lc-users', teinte: '#7BD1CE', x: '100%', y: '50%' },
        { ico: '#lc-presentation', teinte: '#5B8AD9', x: '50%', y: '100%' },
        { ico: '#lc-smartphone', teinte: '#B3A6E8', x: '0%', y: '50%' }
      ],
      reperesOeuvre: ['R\u00e9sum\u00e9 par chapitre', 'Fiches personnages', 'Sujets de dissertation corrig\u00e9s'],
      marquesPaiement: [
        { nom: 'MTN Mobile Money', ico: '#pay-mtn' },
        { nom: 'Orange Money', ico: '#pay-orange' },
        { nom: 'Visa', ico: '#pay-visa' },
        { nom: 'Mastercard', ico: '#pay-mc' },
        { nom: 'PayPal', ico: '#pay-paypal' },
        { nom: 'Stripe', ico: '#pay-stripe' }
      ],
      moyensPaiement: (() => {
        const m = [
          { nom: 'MTN Mobile Money', desc: 'Le plus utilis\u00e9 \u00b7 confirmation imm\u00e9diate', ico: '#lc-smartphone', marque: '#pay-mtn', teinte: '#A84200', pastille: '#FFF3E4' },
          { nom: 'Orange Money', desc: 'Confirmation par SMS en 30 secondes', ico: '#lc-coins', marque: '#pay-orange', teinte: '#FF7900', pastille: '#FDF0E2' },
          { nom: 'Carte bancaire', desc: 'Visa et Mastercard \u00b7 depuis l\u2019\u00e9tranger', ico: '#lc-card', marque: '#pay-visa', teinte: '#1A1F71', pastille: '#DBE8FE' },
          { nom: 'PayPal', desc: 'Pour la diaspora \u00b7 conversion automatique', ico: '#lc-globe', marque: '#pay-paypal', teinte: '#003087', pastille: '#EEE9F8' }
        ];
        const actif = this.state.moyen === undefined ? 0 : this.state.moyen;
        return m.map((x, i) => ({
          ...x, actif: i === actif,
          choisir: () => this.setState({ moyen: i }),
          fond: i === actif ? '#F7FAFF' : '#fff',
          bord: i === actif ? x.teinte : '#E4E7EF'
        }));
      })(),
      titreFormulaire: (this.state.moyen === undefined ? 0 : this.state.moyen) >= 2 ? 'Vos informations de carte' : 'Votre num\u00e9ro Mobile Money',
      champsPaiement: (this.state.moyen === undefined ? 0 : this.state.moyen) >= 2
        ? [
            { label: 'Nom sur la carte', exemple: 'NGO BELL Marie', ico: '#lc-user', colonne: 'span 2' },
            { label: 'Num\u00e9ro de carte', exemple: '4242 4242 4242 4242', ico: '#lc-card', colonne: 'span 2' },
            { label: 'Expiration', exemple: '09 / 28', ico: '#lc-clock', colonne: 'span 1' },
            { label: 'Cryptogramme', exemple: '123', ico: '#lc-lock', colonne: 'span 1' }
          ]
        : [
            { label: 'Nom du titulaire', exemple: 'NGO BELL Marie', ico: '#lc-user', colonne: 'span 2' },
            { label: 'Num\u00e9ro Mobile Money', exemple: '6 XX XX XX XX', ico: '#lc-smartphone', colonne: 'span 1' },
            { label: 'Confirmer le num\u00e9ro', exemple: '6 XX XX XX XX', ico: '#lc-checkcircle', colonne: 'span 1' }
          ],
      noteSecurite: (this.state.moyen === undefined ? 0 : this.state.moyen) >= 2
        ? 'Vos donn\u00e9es de carte transitent chiffr\u00e9es vers notre prestataire de paiement. Le centre ne les stocke jamais.'
        : 'Vous recevrez une demande de confirmation sur votre t\u00e9l\u00e9phone. Saisissez votre code secret directement sur le combin\u00e9, jamais sur ce site.',
      optionsLivraison: (() => {
        const o = [
          { nom: 'Retrait au centre', desc: 'Douala \u00b7 lundi \u2192 samedi, 8 h \u2013 19 h', prix: 'Gratuit', prixCouleur: '#007E11', frais: 0 },
          { nom: 'Livraison Douala', desc: 'Sous 48 h ouvr\u00e9es, par coursier', prix: '1 000 F', prixCouleur: '#001136', frais: 1000 },
          { nom: 'Livraison Yaound\u00e9 et r\u00e9gions', desc: 'Sous 3 \u00e0 5 jours, par agence de transport', prix: '2 500 F', prixCouleur: '#001136', frais: 2500 }
        ];
        const actif = this.state.livr === undefined ? 1 : this.state.livr;
        return o.map((x, i) => ({
          ...x, actif: i === actif,
          choisir: () => this.setState({ livr: i }),
          fond: i === actif ? '#F5F9FF' : '#fff',
          bord: i === actif ? '#1E499B' : '#E4E7EF',
          puce: i === actif ? '#1E499B' : '#C7CEDC'
        }));
      })(),
      /* \u26a0\ufe0f AUCUN MONTANT N'EST FIG\u00c9 AU BUILD.
         Ces deux blocs calculaient un sous-total de 5 000 F l'unit\u00e9, une
         \u00ab Remise catalogue \u00bb de 1 500 F et un total de 6 000 F \u2014 les chiffres
         d'un produit qui n'existe dans aucun catalogue. Le tunnel les servait
         tels quels jusqu'\u00e0 ce que le visiteur touche \u00e0 quoi que ce soit.
         C'est vitrine.js qui les reconstruit d\u00e9sormais, \u00e0 partir du PRIX R\u00c9EL
         de l'article cliqu\u00e9 (voir `prixUnitaire` / `majTotaux`). Ce qui sort
         d'ici n'est donc qu'une valeur d'attente, et une valeur d'attente ne
         doit annoncer aucun prix : un montant affich\u00e9 est une promesse, m\u00eame
         quand il ne dure qu'un instant. */
      lignesTotal: [
        { libelle: 'Sous-total', montant: '\u2014', graisse: '400', couleur: '#4D5163' },
        { libelle: 'Frais de livraison', montant: '\u2014', graisse: '400', couleur: '#4D5163' }
      ],
      totalPayer: '\u2014',
      libellePayer: (this.state.moyen === undefined ? 0 : this.state.moyen) >= 2 ? 'Payer par carte' : 'Payer par Mobile Money',
      payer: () => {},
      garanties: [
        'Re\u00e7u num\u00e9rot\u00e9 avec QR de v\u00e9rification',
        'Corrig\u00e9s en ligne accessibles \u00e0 vie',
        '\u00c9change sous 7 jours si le cahier est ab\u00eem\u00e9'
      ],
      motsRotatifs: (() => {
        const mots = [
          { mot: 'comprend enfin.', couleur: '#FFC93C' },
          { mot: 'r\u00e9vise tout seul.', couleur: '#7BD99C' },
          { mot: 'ose lever la main.', couleur: '#9FC2FF' },
          { mot: 'passe son examen.', couleur: '#F0A6C8' }
        ];
        const par = 3.4, total = mots.length * par;
        return mots.map((m, i) => ({ ...m, duree: total + 's', retard: (i * par) + 's' }));
      })(),
      confettis: (() => {
        const cs = ['#FFC93C', '#7BD99C', '#9FC2FF', '#F0A6C8', '#FF9D4D'];
        return Array.from({ length: 14 }, (_, i) => ({
          x: (5 + i * 6.7).toFixed(1) + '%',
          t: (5 + (i % 4) * 2) + 'px',
          r: i % 3 === 0 ? '2px' : '50%',
          c: cs[i % cs.length],
          d: (7 + (i % 5) * 1.6).toFixed(1) + 's',
          dl: (i * 0.9).toFixed(1) + 's'
        }));
      })(),
      promoStats: [
        { n: '9709', quoi: 'exercices corrig\u00e9s', ico: '#lc-checkcircle', retard: '.5s' },
        { n: '7', quoi: 'niveaux, 6\u1d49 \u2192 T\u02e1\u1d49', ico: '#lc-graduation', retard: '.62s' },
        { n: this.nbTitresCat, quoi: 'titres au catalogue', ico: '#lc-book', retard: '.74s' },
        { n: '24', quoi: 'heures sur 24, le tuteur r\u00e9pond', ico: '#lc-brain', retard: '.86s' }
      ],
      reussites: [
        { examen: 'BEPC', taux: '__ %', detail: 'Candidats de 3\u1d49 accompagn\u00e9s par le centre', teinte: '#1E499B', anneau: 'conic-gradient(#1E499B 0deg 300deg,#E7EDF8 300deg 360deg)' },
        { examen: 'Probatoire', taux: '__ %', detail: 'S\u00e9ries A, C, D et technique', teinte: '#0E7C86', anneau: 'conic-gradient(#0E7C86 0deg 288deg,#E1EFEE 288deg 360deg)' },
        { examen: 'Baccalaur\u00e9at', taux: '__ %', detail: 'G\u00e9n\u00e9ral et enseignement technique', teinte: '#A84200', anneau: 'conic-gradient(#A84200 0deg 306deg,#FBEBDB 306deg 360deg)' },
        { examen: 'GCE O/A Level', taux: '__ %', detail: 'Sous-syst\u00e8me anglophone', teinte: '#5B4FA8', anneau: 'conic-gradient(#5B4FA8 0deg 279deg,#ECE7F7 279deg 360deg)' }
      ],
      videos: [
        { titre: 'Le budget d\u2019une ann\u00e9e de Terminale', qui: 'Parent d\u2019\u00e9l\u00e8ve \u00b7 Douala', duree: '1:48' },
        { titre: 'Comment je r\u00e9vise avec les corrig\u00e9s', qui: '\u00c9l\u00e8ve de 1\u02b3\u1d49 C \u00b7 Yaound\u00e9', duree: '2:31' },
        { titre: 'R\u00e9diger un corrig\u00e9 pour V\u00c9RITAS', qui: 'Enseignante de fran\u00e7ais', duree: '3:05' }
      ],
      ruban: (() => {
        const base = [
          { txt: 'Fran\u00e7ais', ico: '#lc-bookopen' }, { txt: 'Math\u00e9matiques', ico: '#lc-calculator' },
          { txt: 'PCT', ico: '#lc-atom' }, { txt: 'SVT', ico: '#lc-leaf' },
          { txt: 'Histoire-G\u00e9o', ico: '#lc-map' }, { txt: 'Anglais', ico: '#lc-languages' },
          { txt: 'Philosophie', ico: '#lc-scale' }, { txt: 'ECM & Informatique', ico: '#lc-monitor' },
          { txt: 'BEPC', ico: '#lc-award' }, { txt: 'Probatoire', ico: '#lc-award' },
          { txt: 'BAC', ico: '#lc-graduation' }, { txt: 'GCE', ico: '#lc-graduation' }
        ];
        return base.concat(base);
      })(),
      badges: [
        { txt: 'Quiz chronom\u00e9tr\u00e9s', ico: '#lc-clock' },
        { txt: 'S\u00e9ries de bonnes r\u00e9ponses', ico: '#lc-flame' },
        { txt: 'Badges \u00e0 d\u00e9bloquer', ico: '#lc-award' },
        { txt: 'Battles entre classes', ico: '#lc-swords' }
      ],
      classement: [
        { rang: '1', qui: 'Terminale A4 \u00b7 Douala', pts: '2 480 pts', fond: '#FFF8E6', teinte: '#A84200' },
        { rang: '2', qui: '1\u02b3\u1d49 C \u00b7 Yaound\u00e9', pts: '2 315 pts', fond: '#F4F6FB', teinte: '#1E499B' },
        { rang: '3', qui: '3\u1d49 Bilingue \u00b7 Bafoussam', pts: '2 190 pts', fond: '#F2F8F4', teinte: '#007E11' }
      ],
      palmares: [
        { rubrique: 'Manuel \u00e0 la une', titre: 'Math\u00e9matiques 3\u1d49', detail: 'Cahier d\u2019exercices \u00b7 sp\u00e9cial BEPC', illu: '#du-book', ico: '#lc-book', illu: '#du-book', fond: '#EAF1FF', teinte: '#A84200', aller: () => this._go('boutique') },
        { rubrique: 'Battle de la semaine', titre: '10 QCM \u00b7 Gagne ton prix !', detail: 'G\u00e9n\u00e9ral, technique & anglophone \u2014 abonnement & manuel \u00e0 gagner', ico: '#lc-swords', illu: '#du-swords', fond: '#FFF6E2', teinte: '#A84200', aller: () => { location.href = '/plan.html#eleve'; } },
        { rubrique: 'Abonnement le plus choisi', titre: 'Pro \u00b7 2 000 FCFA / mois', detail: '2 mois offerts \u00e0 l\u2019ann\u00e9e \u2014 tout le contenu de la classe', ico: '#lc-rocket', illu: '#du-rocket', fond: '#EEE9F8', teinte: '#5B4FA8', aller: () => this._go('tarifs') }
      ],
      partenariats: [
        { num: '01', nom: 'Inspecteur', desc: 'Comit\u00e9s de validation, formations r\u00e9mun\u00e9r\u00e9es et co-r\u00e9daction des manuels du centre.', gain: 'Formations r\u00e9mun\u00e9r\u00e9es', ico: '#lc-clipboard', illu: '#du-clipboard', teinte: '#1E499B', fond: '#EAF1FF', cta: 'Devenir partenaire' },
        { num: '02', nom: 'Influenceur', desc: 'Code promo personnel, commission sur chaque vente et acc\u00e8s anticip\u00e9 aux nouveaut\u00e9s.', gain: 'Commission sur ventes', ico: '#lc-megaphone', illu: '#du-megaphone', teinte: '#B03A6E', fond: '#FBE9F1', cta: 'Devenir partenaire' },
        { num: '03', nom: 'Librairie', desc: 'Marges attractives sur le catalogue, supports publicitaires et accompagnement marketing.', gain: 'Marges revendeur', ico: '#lc-basket', illu: '#du-basket', teinte: '#A84200', fond: '#FFF3E4', cta: 'Devenir partenaire' },
        { num: '04', nom: 'Partenaire', desc: 'Universit\u00e9, sponsor, chef d\u2019\u00e9tablissement : neuf formules de collaboration au choix.', gain: '9 formules', ico: '#lc-handshake', illu: '#du-handshake', teinte: '#0E7C86', fond: '#E3F1EE', cta: 'Voir le partenariat' }
      ],
      navLarge: !this.state.compact,
      navCompacte: !!this.state.compact,
      burgerOuvert: !!this.state.burger,
      basculerBurger: () => this.setState(s => ({ burger: !s.burger })),
      fondBurger: this.state.burger ? '#1E499B' : '#fff',
      texteBurger: this.state.burger ? '#fff' : '#001136',
      menuMobile: [
        { nom: '\u00c9l\u00e8ves', desc: 'Cours, corrig\u00e9s, tuteur IA', ico: '#lc-graduation', fond: '#DBE8FE', teinte: '#1E499B', aller: () => this._go('elearning') },
        { nom: 'Parents', desc: 'Notes, absences, scolarit\u00e9', ico: '#lc-users', fond: '#E3F1EE', teinte: '#0E7C86', aller: () => { location.href = '/plan.html#parent'; } },
        { nom: 'Enseignants', desc: 'Publier et encadrer', ico: '#lc-presentation', fond: '#FBE9F1', teinte: '#B03A6E', aller: () => { location.href = '/plan.html#enseignant'; } },
        { nom: 'Catalogue E-Learning', desc: 'Mati\u00e8res et \u0153uvres', ico: '#lc-book', fond: '#DBE8FE', teinte: '#1E499B', aller: () => this._go('elearning') },
        { nom: 'Abonnements', desc: 'D\u00e8s {PRIX:abo_starter_m|1 000} FCFA / mois', ico: '#lc-wallet', fond: '#EEE9F8', teinte: '#5B4FA8', aller: () => this._go('tarifs') },
        { nom: 'Boutique de manuels', desc: 'Cahiers et \u00e9tudes d\u2019\u0153uvres', ico: '#lc-basket', fond: '#FFF3E4', teinte: '#A84200', aller: () => this._go('boutique') },
        { nom: 'Accueil', desc: 'Revenir \u00e0 la page d\u2019accueil', ico: '#lc-home', fond: '#F4F5F8', teinte: '#4D5163', aller: () => this._go('accueil') }
      ],
      plusOuvert: this.state.plus,
      basculerPlus: () => this.setState(s => ({ plus: !s.plus })),
      plusLiens: [
        { nom: 'Catalogue E-Learning', desc: 'Mati\u00e8res, \u0153uvres, s\u00e9quences', ico: '#lc-book', fond: '#DBE8FE', teinte: '#1E499B', aller: () => this._go('elearning') },
        { nom: 'Corrig\u00e9s des cahiers', desc: '9 709 exercices, acc\u00e8s libre', ico: '#lc-checkcircle', fond: '#E0F5E5', teinte: '#007E11', aller: () => this._go('elearning') },
        { nom: 'Abonnements', desc: 'D\u00e8s {PRIX:abo_starter_m|1 000} FCFA / mois', ico: '#lc-wallet', fond: '#EEE9F8', teinte: '#5B4FA8', aller: () => this._go('tarifs') },
        { nom: 'Boutique de manuels', desc: 'Cahiers et \u00e9tudes d\u2019\u0153uvres', ico: '#lc-shop', fond: '#FFF3E4', teinte: '#A84200', aller: () => this._go('boutique') }
      ],
      /* Ces trois cartes menaient aux sections de la vitrine, qui sont des
         pages de PRESENTATION : elearning ne porte aucun lien sortant,
         parents en porte 2, enseignants 3. Les panneaux de plan.html en
         portent 22, 20 et 14, vers les ressources reellement publiees.
         Signale par Jacques le 31/08/2026 : « ceci renvoie toujours vers
         e-learning ». La destination vit maintenant dans vitrine.js
         (goEleves / goParents / goEnseignants). */
      publics: [
        {
          titre: '\u00c9l\u00e8ves', slogan: 'Ta moyenne se joue ce soir', photo: 'assets/photo-examen.png', alt: '\u00c9l\u00e8ves en composition', cadrage: '50% 45%', voile: 'rgba(30,73,155,.55)', ico: '#lc-graduation', teinte: '#1E499B', a: '#1E499B', b: '#0C2A6A',
          phrase: 'Le programme de sa classe, les corrig\u00e9s et un tuteur qui r\u00e9pond \u00e0 20 h un dimanche.',
          points: ['Cours par s\u00e9quence, conformes au MINESEC', '9 709 exercices corrig\u00e9s, 6\u1d49 \u2192 T\u02e1\u1d49', '\u00c9preuves BEPC, Probatoire, BAC et GCE', 'Professeur Ambassa, le tuteur IA'],
          acces: 'D\u00e8s 1 000 F / mois', cta: 'Espace \u00c9l\u00e8ve', aller: () => this._go('elearning')
        },
        {
          titre: 'Parents', slogan: 'Moins cher qu\u2019un r\u00e9p\u00e9titeur', photo: 'assets/photo-parents.png', alt: 'Parents et enfant devant l\u2019ordinateur', cadrage: '50% 30%', voile: 'rgba(14,124,134,.55)', ico: '#lc-users', teinte: '#0E7C86', a: '#0E7C86', b: '#0A4E58',
          phrase: 'Les notes, les absences et les tranches r\u00e9gl\u00e9es, depuis votre t\u00e9l\u00e9phone.',
          points: ['Bulletins et moyennes par s\u00e9quence', 'Absences et retards le jour m\u00eame', 'Scolarit\u00e9 : tranches et re\u00e7us num\u00e9rot\u00e9s', 'Cagnotte pour payer depuis l\u2019\u00e9tranger'],
          acces: 'Compte gratuit', cta: 'Espace Parents', aller: () => this._go('parents')
        },
        {
          titre: 'Enseignants', slogan: 'Votre savoir, sign\u00e9 et pay\u00e9', photo: 'assets/photo-enseignant.png', alt: 'Enseignant encadrant des \u00e9l\u00e8ves', cadrage: '50% 30%', voile: 'rgba(176,58,110,.55)', ico: '#lc-presentation', teinte: '#B03A6E', a: '#C9508B', b: '#8E2B57',
          phrase: 'Publiez vos corrig\u00e9s sous votre nom et encadrez les candidats aux examens.',
          points: ['R\u00e9diger des corrig\u00e9s r\u00e9mun\u00e9r\u00e9s', 'Animer des classes virtuelles', 'Composer des \u00e9preuves blanches', 'Suivre ses \u00e9l\u00e8ves en ann\u00e9e d\u2019examen'],
          acces: 'Sur candidature', cta: 'Rejoindre le r\u00e9seau', aller: () => this._go('enseignants')
        }
      ],
      onglets: onglets,
      rien: () => {},
      estAccueil: p === 'accueil', estTarifs: p === 'tarifs', estBoutique: p === 'boutique',
      estParents: p === 'parents', estElearning: p === 'elearning', estEnseignants: p === 'enseignants',
      estTab1: t === 1, estTab2: t === 2, estTab3: t === 3, estTab4: t === 4,
      tab1: () => this.setState({ tab: 1 }), tab2: () => this.setState({ tab: 2 }),
      tab3: () => this.setState({ tab: 3 }), tab4: () => this.setState({ tab: 4 }),
      goAccueil: () => this._go('accueil'), goTarifs: () => this._go('tarifs'),
      goBoutique: () => this._go('boutique'), goParents: () => this._go('parents'),
      goElearning: () => this._go('elearning'), goEnseignants: () => this._go('enseignants'),
      niveaux: [
        { cls: '6ᵉ', nb: '1685', exam: '' }, { cls: '5ᵉ', nb: '1656', exam: '' },
        { cls: '4ᵉ', nb: '1113', exam: '' }, { cls: '3ᵉ', nb: '476', exam: 'BEPC' },
        { cls: '2ⁿᵈᵉ', nb: '1220', exam: '' }, { cls: '1ʳᵉ', nb: '1329', exam: 'PROBATOIRE' },
        { cls: 'Tˡᵉ', nb: '1881', exam: 'BAC' }
      ],
      chiffres: [
        { n: '9709', quoi: 'exercices corrig\u00e9s', det: 'cahiers 6\u1d49 \u2192 T\u02e1\u1d49', ico: '#lc-checkcircle' },
        { n: '56', quoi: 'pages en acc\u00e8s libre', det: 'sans cr\u00e9er de compte', ico: '#lc-bookopen' },
        { n: this.nbTitresCat, quoi: 'titres au catalogue', det: 'cahiers, \u00e9tudes, guides', ico: '#lc-book' },
        { n: '7', quoi: 'niveaux couverts', det: 'de la 6\u1d49 \u00e0 la Terminale', ico: '#lc-university' }
      ],
      raisons: [
        { ico: '#lc-university', titre: 'Le programme officiel, pas un cours import\u00e9', desc: 'Chaque le\u00e7on suit le r\u00e9f\u00e9rentiel MINESEC de la classe : m\u00eames s\u00e9quences, m\u00eames \u0153uvres, m\u00eames formats d\u2019\u00e9preuve qu\u2019au lyc\u00e9e.', fond: '#DBE8FE', teinte: '#1E499B' },
        { ico: '#lc-users', titre: '\u00c9crit par des enseignants du secondaire', desc: 'Les corrig\u00e9s sont r\u00e9dig\u00e9s puis relus par le comit\u00e9 p\u00e9dagogique du centre. Chaque ressource porte le nom de son auteur.', fond: '#E0F5E5', teinte: '#007E11' },
        { ico: '#lc-smartphone', titre: 'Pens\u00e9 pour un t\u00e9l\u00e9phone et un forfait modeste', desc: 'Pages l\u00e9g\u00e8res, lecture hors connexion des fiches, paiement Mobile Money : ce que les familles utilisent d\u00e9j\u00e0.', fond: '#FFF3E4', teinte: '#A84200' }
      ],
      etapes: [
        /* \u00ab Nom, classe, num\u00e9ro de t\u00e9l\u00e9phone. Trente secondes \u00bb \u00e9tait faux :
           le formulaire en demande onze, mot de passe compris. Une promesse
           d\u00e9mentie par l\u2019\u00e9cran suivant co\u00fbte plus qu\u2019une minute annonc\u00e9e. */
        { n: '1', titre: 'Cr\u00e9ez le compte', desc: 'Nom, classe, num\u00e9ro WhatsApp et un mot de passe. Une minute, aucune carte demand\u00e9e.' },
        { n: '2', titre: 'Prenez la ressource offerte', desc: 'Un cours entier, une \u00e9preuve corrig\u00e9e ou une \u00e9tude d\u2019\u0153uvre \u2014 l\u2019\u00e9l\u00e8ve choisit.' },
        { n: '3', titre: 'Abonnez-vous seulement si c\u2019est convaincant', desc: 'MTN MoMo ou Orange Money. {PRIX:abo_starter_m|1 000} F par mois, r\u00e9siliable en un message, sans frais.' }
      ],
      avis: [
        { qui: 'Parent d\u2019\u00e9l\u00e8ve de 3\u1d49', ou: 'Douala' },
        { qui: 'Enseignante de fran\u00e7ais', ou: 'r\u00e9seau V\u00c9RITAS' },
        { qui: '\u00c9l\u00e8ve de Terminale', ou: 'session 2026' }
      ],
      plans: [
        { groupe: 'starter', id: 'abo_starter_m', idAn: 'abo_starter_a', pour: '\u00c9l\u00e8ve', nom: 'Starter', prix: '1 000', an: '10 000', ancien: '12 000', eco: '2 mois offerts', unite: 'par mois', ia: '5 questions au tuteur / jour', ancrage: 'Le programme de sa classe, dans sa poche', ancrageFond: '#E3F1EE', teinte2: '#7BD1CE', delai: '.5s', ruban: '', teinte: '#0E7C86', ombre: 'none', cta: 'Choisir Starter', av: ['Tous les cours de la classe', '\u0152uvres au programme', '\u00c9preuves et annales corrig\u00e9es', 'Suivi des r\u00e9sultats'], sans: ['Classes virtuelles'] },
        { groupe: 'pro', id: 'abo_pro_m', idAn: 'abo_pro_a', pour: 'Ann\u00e9e d\u2019examen', nom: 'Pro', prix: '2 000', an: '20 000', ancien: '24 000', eco: '2 mois offerts', unite: 'par mois', ia: '30 questions au tuteur / jour', ancrage: 'L\u2019ann\u00e9e o\u00f9 tout se joue', ancrageFond: '#DBE8FE', teinte2: '#FFC93C', delai: '1s', ruban: 'Le plus choisi', teinte: '#1E499B', ombre: '0 22px 50px rgba(30,73,155,.22)', cta: 'Choisir Pro', av: ['Tout Starter', 'Labos virtuels PCT & SVT', 'Bulletins blancs not\u00e9s', 'Fiches de r\u00e9vision imprimables'], sans: [] },
        { groupe: 'elite', id: 'abo_elite_m', idAn: 'abo_elite_a', pour: 'Accompagnement', nom: '\u00c9lite', prix: '3 000', an: '30 000', ancien: '36 000', eco: '2 mois offerts', unite: 'par mois', ia: 'Tuteur IA sans limite', ancrage: 'Une ann\u00e9e d\u2019examen accompagn\u00e9e de bout en bout', ancrageFond: '#EEE9F8', teinte2: '#B03A6E', delai: '1.5s', ruban: '', teinte: '#5B4FA8', ombre: 'none', cta: 'Choisir \u00c9lite', av: ['Tout Pro', 'Classes virtuelles en direct', 'Concours blancs corrig\u00e9s', 'Entretien d\u2019orientation'], sans: [] },
        { groupe: 'famille', id: 'abo_famille_m', idAn: 'abo_famille_a', pour: 'Toute la famille', nom: 'Famille', prix: '10 000', an: '100 000', ancien: '120 000', eco: '2 mois offerts', unite: 'par mois', ia: 'Jusqu\u2019\u00e0 4 enfants, niveau \u00c9lite', ancrage: 'Un seul paiement pour toute la fratrie', ancrageFond: '#FFF3E4', teinte2: '#FFC93C', delai: '2s', ruban: '', teinte: '#A84200', ombre: 'none', cta: 'Choisir Famille', av: ['Jusqu\u2019\u00e0 4 enfants', 'Chaque enfant au niveau \u00c9lite', 'Suivi parent : notes et progression', 'Tuteur IA sans limite pour chacun'], sans: [] }
      ],
      comparatif: [
        { quoi: 'Corrig\u00e9s des cahiers (9 709 exercices)', free: 'Oui', starter: 'Oui', pro: 'Oui', elite: 'Oui', famille: 'Oui' },
        { quoi: 'Cours par s\u00e9quence', free: '\u2014', starter: 'Sa classe', pro: 'Sa classe', elite: 'Tous niveaux', famille: 'Tous niveaux' },
        { quoi: 'Questions au tuteur IA', free: '3 / semaine', starter: '5 / jour', pro: '30 / jour', elite: 'Illimit\u00e9', famille: 'Illimit\u00e9' },
        { quoi: 'Labos virtuels PCT & SVT', free: '\u2014', starter: '\u2014', pro: 'Oui', elite: 'Oui', famille: 'Oui' },
        { quoi: 'Bulletins blancs not\u00e9s', free: '\u2014', starter: '\u2014', pro: 'Oui', elite: 'Oui', famille: 'Oui' },
        { quoi: 'Classes virtuelles en direct', free: '\u2014', starter: '\u2014', pro: '\u2014', elite: '4 / mois', famille: '4 / mois' },
        { quoi: 'Enfants couverts', free: '1', starter: '1', pro: '1', elite: '1', famille: 'Jusqu\u2019\u00e0 4' }
      ],
      faq: [
        { q: 'Faut-il une carte bancaire pour s\u2019abonner ?', r: 'Non. MTN MoMo et Orange Money suffisent. La carte et PayPal existent surtout pour les proches qui paient depuis l\u2019\u00e9tranger.' },
        { q: 'L\u2019abonnement est-il engageant ?', r: 'Non. Au mois, il s\u2019arr\u00eate quand vous cessez de renouveler. \u00c0 l\u2019ann\u00e9e, vous payez dix mois pour douze. Aucun frais de r\u00e9siliation.' },
        { q: 'Un ami m\u2019a donn\u00e9 un code : \u00e0 quoi sert-il ?', r: 'Saisissez-le \u00e0 l\u2019inscription ou au paiement : vous payez 10 % de moins sur vos abonnements et achats dans l\u2019application, sans limite de dur\u00e9e. Et votre propre code, partag\u00e9 \u00e0 votre tour, vous rapporte 10 % de ce que paient vos amis.' },
        { q: 'Un abonnement couvre combien d\u2019enfants ?', r: 'Starter, Pro et \u00c9lite couvrent un \u00e9l\u00e8ve. La formule Famille couvre jusqu\u2019\u00e0 quatre enfants pour un seul paiement. Le compte parent, lui, est gratuit.' },
        { q: 'Que se passe-t-il si je ne renouvelle pas ?', r: 'Le compte reste ouvert et les ressources gratuites restent accessibles. Les contenus premium se referment jusqu\u2019au prochain paiement.' },
        { q: 'Les corrig\u00e9s gratuits vont-ils devenir payants ?', r: 'Non. Les corrig\u00e9s des cahiers imprim\u00e9s restent en acc\u00e8s libre : ils accompagnent un cahier d\u00e9j\u00e0 achet\u00e9.' },
        { q: 'Comment obtenir un re\u00e7u ?', r: 'Chaque paiement g\u00e9n\u00e8re un re\u00e7u num\u00e9rot\u00e9, imprimable, avec un QR de v\u00e9rification. Il arrive aussi par WhatsApp.' }
      ],
      manuels: this.manuelsFiltres,
      parentsLignes: [
        { q: '\u00ab Je ne sais pas ce qu\u2019il fait en classe. \u00bb', r: 'Les notes de chaque s\u00e9quence, mati\u00e8re par mati\u00e8re, avec la moyenne et la position dans la promotion.' },
        { q: '\u00ab Est-il all\u00e9 au cours ce matin ? \u00bb', r: 'Les absences et retards sont enregistr\u00e9s par l\u2019\u00e9tablissement et visibles le jour m\u00eame.' },
        { q: '\u00ab Combien reste-t-il \u00e0 payer ? \u00bb', r: 'Le d\u00e9tail des tranches r\u00e9gl\u00e9es et restantes, avec le re\u00e7u num\u00e9rot\u00e9 de chaque paiement.' },
        { q: '\u00ab Je suis \u00e0 l\u2019\u00e9tranger, comment payer ? \u00bb', r: 'La cagnotte accepte carte et PayPal ; le paiement s\u2019impute directement sur la scolarit\u00e9 de l\u2019enfant.' },
        { q: '\u00ab Ce certificat est-il authentique ? \u00bb', r: 'Chaque attestation porte un code de contr\u00f4le v\u00e9rifiable en ligne, sans compte.' }
      ],
      parentsCartes: [
        { ico: '#lc-chart', titre: 'Bulletins et moyennes', desc: 'Notes par s\u00e9quence, moyenne pond\u00e9r\u00e9e, \u00e9volution sur l\u2019ann\u00e9e et bulletin t\u00e9l\u00e9chargeable.', fond: '#DBE8FE', teinte: '#1E499B' },
        { ico: '#lc-wallet', titre: 'Scolarit\u00e9 et re\u00e7us', desc: 'Tranches, \u00e9ch\u00e9ances, historique des paiements et re\u00e7us num\u00e9rot\u00e9s imprimables.', fond: '#E0F5E5', teinte: '#007E11' },
        { ico: '#lc-message', titre: 'Lien avec le centre', desc: 'Messages de l\u2019\u00e9tablissement, convocations et rendez-vous, re\u00e7us sur WhatsApp.', fond: '#E3F1EE', teinte: '#0E7C86' }
      ],
      matieres: [
        { nom: 'Fran\u00e7ais', desc: 'Le\u00e7ons de langue, m\u00e9thodes, groupements de textes, \u0153uvres.', compte: '6\u1d49 \u2192 T\u02e1\u1d49', ico: '#lc-bookopen', fond: '#DBE8FE', teinte: '#1E499B' },
        { nom: 'Math\u00e9matiques', desc: 'Cours, exercices gradu\u00e9s et corrig\u00e9s d\u00e9taill\u00e9s.', compte: '6\u1d49 \u2192 T\u02e1\u1d49', ico: '#lc-calculator', fond: '#E0F5E5', teinte: '#007E11' },
        { nom: 'PCT', desc: 'Physique, chimie, technologie \u2014 avec labos virtuels.', compte: '6\u1d49 \u2192 T\u02e1\u1d49', ico: '#lc-atom', fond: '#E3F1EE', teinte: '#0E7C86' },
        { nom: 'SVT', desc: 'Sciences de la vie et de la Terre, sch\u00e9mas annot\u00e9s.', compte: '6\u1d49 \u2192 T\u02e1\u1d49', ico: '#lc-leaf', fond: '#EEE9F8', teinte: '#5B4FA8' },
        { nom: 'Histoire-G\u00e9o', desc: 'Rep\u00e8res, cartes et \u00e9tudes de documents.', compte: '6\u1d49 \u2192 T\u02e1\u1d49', ico: '#lc-map', fond: '#FFF3E4', teinte: '#A84200' },
        { nom: 'Anglais', desc: 'Grammar, comprehension, essay writing.', compte: '6\u1d49 \u2192 T\u02e1\u1d49', ico: '#lc-languages', fond: '#DBE8FE', teinte: '#1E499B' },
        { nom: 'Philosophie', desc: 'Notions, m\u00e9thode de la dissertation et du commentaire.', compte: '1\u02b3\u1d49 \u2192 T\u02e1\u1d49', ico: '#lc-scale', fond: '#EEE9F8', teinte: '#5B4FA8' },
        { nom: 'ECM & Informatique', desc: '\u00c9ducation \u00e0 la citoyennet\u00e9 et bases informatiques.', compte: '6\u1d49 \u2192 T\u02e1\u1d49', ico: '#lc-monitor', fond: '#E0F5E5', teinte: '#007E11' }
      ],
      oeuvres: [
        { titre: 'Le Tube Digestif', cadrage: '12% 50%', auteur: 'Alobwed\u2019Epie', classe: '3\u1d49 \u2192 T\u02e1\u1d49', fond: 'repeating-linear-gradient(135deg,#EEE9F8 0 10px,#F6F3FC 10px 20px)', couv: 'uploads/oeuvres/tubedigestif.jpg' },
        { titre: 'Capitoline', cadrage: '38% 50%', auteur: 'P.-C. Ombete Bela', classe: 'Seconde', fond: 'repeating-linear-gradient(135deg,#E4EBF7 0 10px,#F2F5FB 10px 20px)', couv: 'uploads/oeuvres/oeuvre-capitoline.jpg' },
        { titre: 'Ngum a Jemea', cadrage: '64% 50%', auteur: 'David Mbanga Eyombwan', classe: 'Terminale', fond: 'repeating-linear-gradient(135deg,#E3F1EE 0 10px,#F1F8F6 10px 20px)', couv: 'uploads/oeuvres/oeuvre-ngum.jpg' },
        { titre: 'Balafon', cadrage: '88% 50%', auteur: 'Engelbert Mveng', classe: 'Premiere', fond: 'repeating-linear-gradient(135deg,#F3E7D8 0 10px,#FBF6EF 10px 20px)', couv: 'uploads/oeuvres/oeuvre-balafon.jpg' }
      ],
      modules: [
        { titre: 'Professeur Ambassa', desc: 'Le tuteur IA du centre : il questionne, corrige la m\u00e9thode et cite le programme au lieu de donner la r\u00e9ponse.', acces: '3 questions offertes / semaine', ico: '#lc-brain', a: '#5B4FA8', b: '#2E2470' },
        { titre: 'Labos virtuels', desc: 'Exp\u00e9riences de PCT et de SVT simul\u00e9es pas \u00e0 pas, pour travailler la manipulation sans laboratoire.', acces: 'Plan Pro', ico: '#lc-flask', a: '#0E7C86', b: '#0A4E58' },
        { titre: 'Classes virtuelles', desc: 'S\u00e9ances en direct en petit groupe avec un enseignant du r\u00e9seau, le soir et le week-end.', acces: 'Plan \u00c9lite', ico: '#lc-presentation', a: '#1E499B', b: '#0C2A6A' }
      ],
      ensCartes: [
        { ico: '#lc-doc', titre: 'R\u00e9diger des corrig\u00e9s', desc: 'Vous prenez un cahier de votre mati\u00e8re et r\u00e9digez les corrig\u00e9s ; le comit\u00e9 relit puis publie sous votre nom.', fond: '#FBE9F1', teinte: '#B03A6E' },
        { ico: '#lc-presentation', titre: 'Animer des classes virtuelles', desc: 'S\u00e9ances en direct de 60 minutes, petits groupes, planning que vous choisissez.', fond: '#DBE8FE', teinte: '#1E499B' },
        { ico: '#lc-clipboard', titre: 'Composer des \u00e9preuves', desc: '\u00c9preuves blanches BEPC, Probatoire, BAC et GCE, avec bar\u00e8me et corrig\u00e9 mod\u00e8le.', fond: '#E0F5E5', teinte: '#007E11' },
        { ico: '#lc-trophy', illu: '#du-trophy', titre: 'Encadrer les candidats', desc: 'Suivi personnalis\u00e9 des \u00e9l\u00e8ves en ann\u00e9e d\u2019examen, du diagnostic \u00e0 la session.', fond: '#FFF3E4', teinte: '#A84200' }
      ],
      ensEtapes: [
        { n: '1', titre: 'Candidature', desc: 'Dipl\u00f4mes, mati\u00e8re, niveaux enseign\u00e9s et un \u00e9chantillon de corrig\u00e9.' },
        { n: '2', titre: 'Entretien', desc: 'Un \u00e9change de 30 minutes avec le comit\u00e9 p\u00e9dagogique du centre.' },
        { n: '3', titre: 'Ressource test', desc: 'Une premi\u00e8re ressource r\u00e9dig\u00e9e, relue et annot\u00e9e avant publication.' },
        { n: '4', titre: 'Collaboration', desc: 'Vous choisissez vos cahiers et vos cr\u00e9neaux ; r\u00e9mun\u00e9ration \u00e0 la ressource valid\u00e9e.' }
      ],
      footCols: [
        { titre: 'Apprendre', liens: ['Catalogue E-Learning', 'Corrigés des cahiers', 'Mes matières', 'Épreuves & annales', 'Œuvres au programme'] },
        { titre: 'Services', liens: ['Boutique de manuels', 'Abonnements', 'Professeur Ambassa', 'Labos virtuels', 'Cagnotte de scolarité'] },
        { titre: 'Le centre', liens: ['Qui nous sommes', 'Espace Parents', 'Réseau enseignants', 'Partenaires', 'VÉRITAS Campus', 'Vérifier un certificat'] }
      ]
    };
  }
}
module.exports = Component;
