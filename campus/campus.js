/* ============================================================
   VÉRITAS Campus — Client white-label (theming + API + démo)
   © 2024-2026 Jacques Miterand TAKOU (Mythe Errant).
   ============================================================ */
(function () {
  'use strict';

  var CFG = window.CAMPUS_CONFIG || {};
  // Endpoint du backend (config.js : apiBase '' = même origine ; sinon URL complète).
  var CAMPUS_API = (CFG.apiBase || '') + '/api/campus/index.php';

  /* ── Établissements de DÉMONSTRATION (utilisés quand le backend PHP est absent,
        ex. preview local). Prouvent le white-label : changer d'école rehabille
        toute l'interface. En prod, loadConfig() utilise le vrai /tenant/config. ── */
  var MOCK = {
    demo: {
      tenant: { slug: 'demo', name: 'Collège Bilingue Démo', plan: 'pro', currency: 'XAF' },
      branding: {
        product_name: 'Collège Bilingue Démo', slogan: "L'excellence en deux langues",
        logo_url: '', primary_color: '#142554', accent_color: '#FFC93C', header_mode: 'sombre',
        contact_whatsapp: '+237 6XX XX XX XX'
      },
      modules: { frais: true, bulletins: true, sms: true, elearning: true, ia: true, jeux: true, discipline: true, emploi_temps: true, rh: true, boutique: true },
      academics: {
        sous_systemes: ['francophone', 'anglophone'], filieres: ['general', 'technique'],
        grading: { evals: [{ key: 'dev1', label: 'Devoir 1', weight: 50 }, { key: 'dev2', label: 'Devoir 2', weight: 50 }], distinctions: [{ label: 'Félicitations', en: 'Commendation', min: 16 }, { label: "Tableau d'honneur", en: 'Honour roll', min: 14 }, { label: 'Encouragements', en: 'Distinction', min: 12 }, { label: 'Avertissement travail', en: 'Academic warning', min: 8 }, { label: 'Blâme travail', en: 'Serious warning', min: 0 }] },
        sections: [
          { section_key: 'fr_general', sous_systeme: 'francophone', filiere: 'general', label: 'Francophone — Enseignement général', langue: 'fr', bareme: 20, grading_scale: 'sur_20', periodes: 'trimestre', enabled: true },
          { section_key: 'fr_technique', sous_systeme: 'francophone', filiere: 'technique', label: 'Francophone — Technique & professionnel', langue: 'fr', bareme: 20, grading_scale: 'sur_20', periodes: 'trimestre', enabled: true },
          { section_key: 'en_general', sous_systeme: 'anglophone', filiere: 'general', label: 'Anglophone — General Education', langue: 'en', bareme: 20, grading_scale: 'gce_letter', periodes: 'trimestre', enabled: true }
        ]
      }
    },
    lumiere: {
      tenant: { slug: 'lumiere', name: 'Institut La Lumière', plan: 'croissance', currency: 'XAF' },
      branding: {
        product_name: 'Institut La Lumière', slogan: 'Savoir, rigueur, réussite',
        logo_url: '', primary_color: '#0d5c46', accent_color: '#f4b740', header_mode: 'sombre',
        contact_whatsapp: '+237 6XX XX XX XX'
      },
      modules: { frais: true, bulletins: true, sms: true, elearning: false, ia: false, jeux: false, discipline: true, emploi_temps: true, rh: false, boutique: false },
      academics: {
        sous_systemes: ['francophone'], filieres: ['general'],
        grading: { evals: [{ key: 'cc', label: 'CC', weight: 20 }, { key: 'ds', label: 'DS', weight: 30 }, { key: 'sn', label: 'SN', weight: 50 }], distinctions: [{ label: 'Félicitations', en: 'Commendation', min: 17 }, { label: "Tableau d'honneur", en: 'Honour roll', min: 15 }, { label: 'Encouragements', en: 'Distinction', min: 13 }, { label: 'Avertissement travail', en: 'Academic warning', min: 9 }, { label: 'Blâme travail', en: 'Serious warning', min: 0 }] },
        sections: [
          { section_key: 'fr_general', sous_systeme: 'francophone', filiere: 'general', label: 'Francophone — Enseignement général', langue: 'fr', bareme: 20, grading_scale: 'sur_20', periodes: 'trimestre', enabled: true }
        ]
      }
    },
    horizon: {
      tenant: { slug: 'horizon', name: 'Horizon Bilingual College', plan: 'premium', currency: 'XAF' },
      branding: {
        product_name: 'Horizon Bilingual College', slogan: 'Shaping tomorrow’s leaders',
        logo_url: '', primary_color: '#3b1d6e', accent_color: '#19c3b2', header_mode: 'clair',
        contact_whatsapp: '+237 6XX XX XX XX'
      },
      modules: { frais: true, bulletins: true, sms: true, elearning: true, ia: true, jeux: true, discipline: true, emploi_temps: true, rh: true, boutique: true },
      academics: {
        sous_systemes: ['anglophone'], filieres: ['general', 'technique'],
        sections: [
          { section_key: 'en_general', sous_systeme: 'anglophone', filiere: 'general', label: 'Anglophone — General Education', langue: 'en', bareme: 20, grading_scale: 'gce_letter', periodes: 'trimestre', enabled: true },
          { section_key: 'en_technical', sous_systeme: 'anglophone', filiere: 'technique', label: 'Anglophone — Technical & Vocational', langue: 'en', bareme: 20, grading_scale: 'gce_letter', periodes: 'trimestre', enabled: true }
        ]
      }
    }
  };

  var MODULE_LABELS = {
    frais: '💳 Frais & reçus', bulletins: '📄 Bulletins', sms: '📲 SMS parents',
    elearning: '🎓 E-learning', ia: '🤖 IA Ambassa', jeux: '🎮 Jeux',
    discipline: '🛡️ Discipline', emploi_temps: '🗓️ Emploi du temps', rh: '👔 RH & paie', boutique: '🛍️ Boutique'
  };

  /* ── Résolution du slug (sous-domaine ou ?tenant=) ── */
  function tenantSlug() {
    if (CFG.fixedTenant) { return String(CFG.fixedTenant).toLowerCase().replace(/[^a-z0-9\-]/g, ''); }
    var q = new URLSearchParams(location.search).get('tenant');
    if (q) return q.toLowerCase().replace(/[^a-z0-9\-]/g, '');
    var host = location.hostname;
    var m = host.match(/^([a-z0-9\-]+)\.veritas-campus\.com$/i);
    if (m && m[1] !== 'www' && m[1] !== 'app') return m[1].toLowerCase();
    return '';
  }

  /* ── Helpers ── */
  function $(s, r) { return (r || document).querySelector(s); }
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function initials(name) { return (name || 'VC').trim().split(/\s+/).slice(0, 2).map(function (w) { return w[0]; }).join('').toUpperCase(); }
  function toast(msg) {
    var t = $('#toast'); if (!t) return;
    t.textContent = msg; t.classList.add('show');
    clearTimeout(toast._t); toast._t = setTimeout(function () { t.classList.remove('show'); }, 2600);
  }

  /* ── LE moteur white-label : applique le thème d'un établissement ── */
  function applyTenantTheme(cfg) {
    var b = cfg.branding || {};
    var root = document.documentElement;
    if (b.primary_color) root.style.setProperty('--ds-primary', b.primary_color);
    if (b.accent_color) root.style.setProperty('--ds-accent', b.accent_color);
    document.body.classList.toggle('theme-clair', b.header_mode === 'clair');
    document.body.classList.toggle('theme-sombre', b.header_mode !== 'clair');

    var name = b.product_name || (cfg.tenant && cfg.tenant.name) || 'VÉRITAS Campus';
    document.title = name + ' — VÉRITAS Campus';

    // Logos (image si fournie, sinon initiales)
    document.querySelectorAll('[data-brand-logo]').forEach(function (el) {
      if (b.logo_url) { el.innerHTML = '<img src="' + esc(b.logo_url) + '" alt="" style="width:100%;height:100%;border-radius:inherit;object-fit:cover">'; }
      else { el.textContent = initials(name); }
    });
    document.querySelectorAll('[data-brand-name]').forEach(function (el) { el.textContent = name; });
    document.querySelectorAll('[data-brand-slogan]').forEach(function (el) { el.textContent = b.slogan || ''; });
    document.querySelectorAll('[data-brand-plan]').forEach(function (el) { el.textContent = (cfg.tenant && cfg.tenant.plan) ? cfg.tenant.plan.toUpperCase() : ''; });

    renderModules(cfg.modules || {});
    renderSections((cfg.academics && cfg.academics.sections) || []);
  }

  function renderModules(modules) {
    var host = $('#modules'); if (!host) return;
    host.innerHTML = Object.keys(MODULE_LABELS).map(function (k) {
      var on = modules[k] !== false && (k in modules ? modules[k] : false);
      if (!(k in modules)) on = false;
      return '<span class="pill" data-off="' + (on ? '0' : '1') + '">' + MODULE_LABELS[k] + '</span>';
    }).join('');
  }

  function renderSections(sections) {
    var host = $('#sections'); if (!host) return;
    if (!sections.length) { host.innerHTML = '<p class="note">Aucune section académique active.</p>'; return; }
    host.innerHTML = sections.filter(function (s) { return s.enabled !== false; }).map(function (s) {
      var fr = s.sous_systeme === 'francophone';
      var scale = s.grading_scale === 'gce_letter' ? 'Notes GCE (A–U)' : (s.grading_scale === 'percentage' ? 'Sur 100' : 'Sur ' + (s.bareme || 20));
      return '<div class="sec ' + (fr ? 'fr' : 'en') + '">' +
        '<span class="tag">' + (fr ? 'Francophone' : 'Anglophone') + ' · ' + (s.filiere === 'technique' ? 'Technique' : (s.filiere === 'professionnel' ? 'Professionnel' : 'Général')) + '</span>' +
        '<b>' + esc(s.label) + '</b>' +
        '<small>' + scale + ' · ' + (s.periodes === 'semestre' ? 'Semestres' : 'Trimestres') + '</small>' +
        '</div>';
    }).join('');
  }

  /* ── API ── */
  function api(path, opts) {
    opts = opts || {};
    var headers = { 'Content-Type': 'application/json' };
    var slug = tenantSlug() || (window.CAMPUS_DEMO_SLUG || 'demo');
    headers['X-Tenant'] = slug;
    var tok = sessionStorage.getItem('cmp_token');
    if (tok) headers['Authorization'] = 'Bearer ' + tok;
    return fetch(CAMPUS_API + path, {
      method: opts.method || 'GET', headers: headers,
      body: opts.body ? JSON.stringify(opts.body) : undefined
    }).then(function (r) { return r.json(); });
  }

  /* ── Chargement config (vrai backend, repli démo) ── */
  function loadConfig() {
    var slug = tenantSlug();
    if (!slug && MOCK[window.CAMPUS_DEMO_SLUG || 'demo']) {
      // Pas de backend ciblé → mode démo direct.
      return Promise.resolve(MOCK[window.CAMPUS_DEMO_SLUG || 'demo']);
    }
    return api('/tenant/config').then(function (j) {
      if (j && j.ok) return j;
      throw new Error('config');
    }).catch(function () {
      return MOCK[slug] || MOCK.demo; // repli démo si l'API n'est pas joignable
    });
  }

  /* ── Démo : sélecteur d'établissement ── */
  function mountDemoSwitch() {
    var host = $('#demoSwitch'); if (!host) return;
    var keys = Object.keys(MOCK);
    host.innerHTML = '<b>👁️ Aperçu white-label —</b> <span class="note">chaque établissement a SA marque :</span> ' +
      keys.map(function (k) {
        return '<button data-slug="' + k + '" aria-pressed="' + (k === (window.CAMPUS_DEMO_SLUG || 'demo') ? 'true' : 'false') + '">' + esc(MOCK[k].branding.product_name) + '</button>';
      }).join('');
    host.addEventListener('click', function (e) {
      var btn = e.target.closest('button[data-slug]'); if (!btn) return;
      window.CAMPUS_DEMO_SLUG = btn.getAttribute('data-slug');
      host.querySelectorAll('button').forEach(function (b) { b.setAttribute('aria-pressed', b === btn ? 'true' : 'false'); });
      var cfg = MOCK[window.CAMPUS_DEMO_SLUG];
      applyTenantTheme(cfg);
      if (typeof window.onCampusConfig === 'function') { window.onCampusConfig(cfg); }
      toast('Thème appliqué : ' + cfg.branding.product_name);
    });
  }

  /* ── Login ── */
  function mountLogin() {
    var form = $('#loginForm'); if (!form) return;
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var email = $('#email').value.trim(), password = $('#password').value;
      if (!email || !password) { toast('E-mail et mot de passe requis.'); return; }
      api('/auth/login', { method: 'POST', body: { email: email, password: password } })
        .then(function (j) {
          if (j && j.ok) {
            sessionStorage.setItem('cmp_token', j.token);
            toast('Connexion réussie — bienvenue ' + (j.user.prenom || j.user.email));
          } else {
            toast((j && j.error) ? j.error : 'Identifiants invalides.');
          }
        })
        .catch(function () { toast('Backend indisponible (mode démo : aucune connexion réelle).'); });
    });
  }

  /* ── Boot page portail ── */
  function bootPortal() {
    mountDemoSwitch(); mountLogin();
    loadConfig().then(applyTenantTheme);
  }

  /* ── Boot générique des pages thémées (dashboard, documents) ── */
  function bootThemed() {
    mountDemoSwitch();
    loadConfig().then(function (cfg) {
      applyTenantTheme(cfg);
      if (typeof window.onCampusConfig === 'function') { window.onCampusConfig(cfg); }
    });
  }

  /* ── Profils & accès restreints (miroir de la grille de permissions backend) ── */
  var ROLE_CAPS = {
    admin: ['*'], proviseur: ['*'], directeur: ['*'],
    censeur: ['students.view', 'grades.enter', 'grades.validate', 'grades.override', 'attendance.manage', 'discipline.manage', 'documents.issue', 'comms.send', 'settings.manage', 'timetable.manage', 'audit.view'],
    prefet_etudes: ['students.view', 'grades.enter', 'grades.validate', 'grades.override', 'documents.issue', 'comms.send', 'timetable.manage', 'audit.view'],
    surveillant_general: ['students.view', 'attendance.manage', 'attendance.record', 'discipline.manage', 'documents.issue', 'comms.send', 'audit.view'],
    surveillant: ['students.view', 'attendance.manage', 'attendance.record', 'discipline.manage'],
    intendant: ['students.view', 'finance.manage', 'transport.manage', 'hr.manage', 'documents.issue', 'comms.send'],
    econome: ['students.view', 'finance.manage', 'hr.manage', 'documents.issue'],
    comptable: ['students.view', 'finance.manage'],
    secretaire: ['students.manage', 'students.view', 'library.manage', 'timetable.manage', 'documents.issue', 'comms.send'],
    bibliothecaire: ['students.view', 'library.manage'],
    vie_scolaire: ['students.view', 'attendance.manage', 'attendance.record', 'discipline.manage'],
    professeur: ['students.view', 'grades.enter', 'attendance.record'],
    eleve: ['self.view'], parent: ['self.view'], candidat: ['self.view'], entreprise: ['self.view']
  };
  var ROLE_LABELS = {
    admin: 'Direction', proviseur: 'Proviseur', directeur: 'Directeur', censeur: 'Censeur', prefet_etudes: 'Préfet des études',
    surveillant_general: 'Surveillant général', surveillant: 'Surveillant', intendant: 'Intendant', econome: 'Économe',
    comptable: 'Comptable', secretaire: 'Secrétaire', bibliothecaire: 'Bibliothécaire', vie_scolaire: 'Vie scolaire',
    professeur: 'Enseignant', eleve: 'Élève', parent: 'Parent', candidat: 'Candidat', entreprise: 'Entreprise'
  };
  var PROFILES = [
    { label: 'Direction / Administration', role: 'admin' }, { label: 'Censeur', role: 'censeur' },
    { label: 'Préfet des études', role: 'prefet_etudes' }, { label: 'Surveillant général', role: 'surveillant_general' },
    { label: 'Intendant / Comptable', role: 'intendant' }, { label: 'Secrétaire', role: 'secretaire' },
    { label: 'Bibliothécaire', role: 'bibliothecaire' }, { label: 'Enseignant', role: 'professeur' },
    { label: 'Élève / Étudiant', role: 'eleve' }, { label: 'Parent / Famille', role: 'parent' },
    { label: 'Candidat (admission)', role: 'candidat' }
  ];
  function roleCan(role, cap){ var c = ROLE_CAPS[role] || []; return c.indexOf('*') >= 0 || c.indexOf(cap) >= 0; }
  function currentRole(){ return sessionStorage.getItem('cmp_profile') || 'admin'; }

  // Exposition pour onboarding.html + autres pages
  window.CAMPUS = {
    api: api, applyTenantTheme: applyTenantTheme, loadConfig: loadConfig, mountDemoSwitch: mountDemoSwitch,
    toast: toast, MOCK: MOCK, MODULE_LABELS: MODULE_LABELS, esc: esc, initials: initials, $: $,
    ROLE_CAPS: ROLE_CAPS, ROLE_LABELS: ROLE_LABELS, PROFILES: PROFILES, roleCan: roleCan, currentRole: currentRole
  };

  document.addEventListener('DOMContentLoaded', function () {
    var page = document.body.getAttribute('data-page');
    if (page === 'portal') { bootPortal(); }
    else if (page === 'dashboard' || page === 'documents' || page === 'notes') { bootThemed(); }
  });
})();
