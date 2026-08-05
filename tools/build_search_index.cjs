#!/usr/bin/env node
/**
 * tools/build_search_index.cjs — Index de recherche VÉRITAS
 *
 * Construit chunks/index-recherche.js à partir des modules chargés à la
 * demande. L'index ne contient que ce qu'il faut pour AFFICHER un résultat et
 * SAVOIR quoi ouvrir : un libellé, un type, une clé. Aucun contenu.
 *
 * Pourquoi un index séparé : les catalogues pèsent 1,1 Mo et ne sont plus
 * chargés au démarrage. Sans index, une recherche exigerait de tout
 * télécharger. Là, ~10 Ko suffisent pour chercher dans tout le catalogue, et
 * seul le module du résultat choisi est téléchargé.
 *
 * À relancer après toute modification d'un catalogue :
 *   node tools/build_search_index.cjs
 */
const fs = require('fs');
const path = require('path');

const RACINE = path.resolve(__dirname, '..');
const DOSSIER = path.join(RACINE, 'chunks');

function chargerModule(fichier) {
  const p = path.join(DOSSIER, fichier);
  if (!fs.existsSync(p)) return null;
  const bac = { window: {}, Object: Object, Array: Array };
  bac.window.LITT_OEUVRES = {};
  bac.window.JEUX_CATALOGUE = [];
  const code = fs.readFileSync(p, 'utf8');
  try {
    new Function('window', 'Object', 'Array', code)(bac.window, Object, Array);
  } catch (e) {
    console.error('  ⚠ ' + fichier + ' : ' + e.message);
    return null;
  }
  return bac.window;
}

const entrees = [];
function ajouter(type, cle, libelle, extra) {
  const l = String(libelle || '').trim();
  if (!l) return;
  const e = { t: type, k: String(cle), l: l.slice(0, 90) };
  if (extra) e.s = String(extra).slice(0, 50);
  entrees.push(e);
}

// ── Œuvres au programme ──
const wLitt = chargerModule('litt-oeuvres.js');
if (wLitt && wLitt.LITT_OEUVRES) {
  Object.keys(wLitt.LITT_OEUVRES).forEach(k => {
    const o = wLitt.LITT_OEUVRES[k] || {};
    ajouter('oeuvre', k, o.titre || k, [o.auteur, o.classe].filter(Boolean).join(' · '));
  });
}

// ── Jeux éducatifs ──
const wJeux = chargerModule('jeux.js');
if (wJeux && wJeux.JEUX_CATALOGUE) {
  wJeux.JEUX_CATALOGUE.forEach(j => {
    if (j && j.id) ajouter('jeu', j.id, j.titre || j.nom || j.id, [j.matiere, j.niveau].filter(Boolean).join(' · '));
  });
}

// ── Laboratoires virtuels ──
const wLabo = chargerModule('labo.js');
if (wLabo && wLabo.LABO_DB) {
  wLabo.LABO_DB.forEach(l => {
    if (l && l.id) ajouter('labo', l.id, l.titre || l.nom || l.id, l.matiere || l.categorie || '');
  });
}

// ── Ressources pédagogiques ──
const wRes = chargerModule('ressources-pedago.js');
if (wRes && wRes._RESSOURCES_PEDAGO) {
  Object.keys(wRes._RESSOURCES_PEDAGO).forEach(k => {
    const r = wRes._RESSOURCES_PEDAGO[k] || {};
    ajouter('ressource', k, r.titre || k, r.matiere || '');
  });
}

// ── Contenus e-learning livrés ──
const wSeed = chargerModule('elearning-seed.js');
if (wSeed && wSeed._VRT_ELEARNING_SEED) {
  wSeed._VRT_ELEARNING_SEED.forEach(c => {
    if (c && c.id) ajouter('contenu', c.id, c.titre || c.id, [c.matiere, c.classe].filter(Boolean).join(' · '));
  });
}

// ── Corrigés en ligne (pages statiques déjà déployées) ──
const dossierCorriges = path.join(RACINE, 'corriges');
if (fs.existsSync(dossierCorriges)) {
  for (const niveau of fs.readdirSync(dossierCorriges)) {
    const sousDossier = path.join(dossierCorriges, niveau);
    if (!fs.statSync(sousDossier).isDirectory()) continue;
    for (const f of fs.readdirSync(sousDossier)) {
      if (!f.endsWith('.html')) continue;
      const html = fs.readFileSync(path.join(sousDossier, f), 'utf8');
      const m = html.match(/<title>([^<]+)<\/title>/i);
      const titre = m ? m[1].split('|')[0].trim() : niveau + ' — ' + f;
      ajouter('corrige', 'corriges/' + niveau + '/' + f, titre, 'Corrigés');
    }
  }
}

const sortie = '/* VÉRITAS — index de recherche. GÉNÉRÉ, ne pas éditer à la main.\n'
  + '   Source : tools/build_search_index.cjs · ' + entrees.length + ' entrées.\n'
  + '   Ne contient que libellé + type + clé : chercher dans tout le catalogue\n'
  + '   coûte ' + Math.round(JSON.stringify(entrees).length / 1024) + ' Ko au lieu des 1,1 Mo des modules. */\n'
  + 'window._VRT_INDEX = ' + JSON.stringify(entrees) + ';\n'
  + 'window._VRT_INDEX_OK = true;\n';

fs.writeFileSync(path.join(DOSSIER, 'index-recherche.js'), sortie);

const parType = {};
entrees.forEach(e => parType[e.t] = (parType[e.t] || 0) + 1);
console.log('chunks/index-recherche.js — ' + entrees.length + ' entrées, '
  + (sortie.length / 1024).toFixed(1) + ' Ko');
Object.keys(parType).sort().forEach(t => console.log('   ' + String(parType[t]).padStart(4) + '  ' + t));
