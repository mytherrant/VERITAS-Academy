/* Scènes vivantes — VÉRITAS
 * Lecteur de scènes dialoguées, avec décors animés, émotions, jauges et ateliers.
 * Chaque page pose window.SCENE puis charge decors.js et ce fichier.
 *
 * Étapes (S.etapes) :
 *   recit · dit · pense · vers     — texte ; `cite` = extrait authentique, mot pour mot
 *   question                        — choix noté (options[].ok)
 *   choix                           — « Et si… ? » : l'élève décide pour un personnage
 *   remarque                        — analyse
 *   atelier                         — ordre · tri · monnaie · chemin · vote · balance
 * Clés communes : entre, sort, decor, ambiance, jauges {id: valeur}, emo, objet {i, lib}
 * Les répliques sont écrites pour la leçon ; seule une étape portant `cite`
 * reproduit le texte de l'auteur. */
(function(){
  'use strict';
  var S = window.SCENE;
  // Sans SCENE, le fichier sert de bibliothèque : window.VRT_PERSO.iso(perso) rend un personnage.
  if(!S){ S = { etapes: [], personnages: {} }; window.VRT_SANS_SCENE = true; }

  var AVERT_OEUVRE = 'Scène imaginée d’après l’œuvre pour la leçon : les répliques ne sont pas de l’auteur. '
    + 'Seuls les passages marqués « Extrait de l’œuvre » sont cités mot pour mot.';
  var AVERT_LIBRE = 'Dialogue fictif écrit pour la leçon. Les faits et les dates cités sont exacts.';
  var EMO = { colere:'colere', joie:'joie', triste:'triste', peur:'peur', surpris:'aide', fier:'fier', amour:'amour', doute:'doute' };

  var etapes = S.etapes || [];
  var persos = S.personnages || {};
  var ordre = Object.keys(persos);
  var jauges = S.jauges || [];
  var i = 0, auto = false, voix = false, role = '';
  var reponses = {};             // index d'étape -> {ok, k, fait}
  var frappe = null, minuterie = null, decorCourant = null, presentsAvant = {};

  function esc(s){
    return String(s == null ? '' : s).replace(/[&<>"']/g, function(c){
      return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c];
    });
  }
  function $(id){ return document.getElementById(id); }
  function initiales(nom){
    var m = String(nom).replace(/^(M\.|Mme|Le|La|Les|L’|Père|Madame|Monsieur)\s+/i, '').trim();
    return m.charAt(0).toUpperCase();
  }
  function cle(){ return 'vrt_scene_' + (S.id || location.pathname); }
  function lire(k){ try{ return localStorage.getItem(k); }catch(e){ return null; } }
  function ecrire(k, v){ try{ localStorage.setItem(k, v); return true; }catch(e){ return false; } }
  function melange(a){ a = a.slice(); for(var k = a.length - 1; k > 0; k--){ var j = Math.floor(Math.random() * (k + 1)), t = a[k]; a[k] = a[j]; a[j] = t; } return a; }

  /* ---------- Avatars dessinés ----------
   * p.look = { peau, cheveux, couleurCheveux, habit, col, barbe, moustache, vieux, lunettes, coiffe, couleurCoiffe }
   * peau : fonce | brun | mat | clair
   * cheveux : court | ras | long | tresses | chignon | boucles | perruque | aucun
   * coiffe : couronne | casque | foulard | bonnet | toque | voile | kepi | chechia */
  var PEAUX = { tresfonce:'#3B2414', fonce:'#5C3A21', brun:'#8D5524', mat:'#C68642', clair:'#F1C9A5', pale:'#F7DCCB' };
  function avatar(p){
    var L = p.look || {}, peau = PEAUX[L.peau] || PEAUX.brun;
    var ch = L.vieux ? '#D9D9D9' : (L.couleurCheveux || (L.peau === 'clair' ? '#6B4A2B' : '#1E1410'));
    var habit = L.habit || '#2B3A67', s = '';
    var cheveux = L.cheveux || 'court';
    if(cheveux === 'long' || cheveux === 'perruque'){ s += '<path d="M17 30 Q16 14 32 12 Q48 14 47 30 L49 48 L15 48 Z" fill="' + ch + '"/>'; }
    if(cheveux === 'tresses'){ s += '<path d="M19 28 L17 46 M45 28 L47 46" stroke="' + ch + '" stroke-width="4" stroke-linecap="round"/>'; }
    s += '<path d="M10 64 Q12 46 32 45 Q52 46 54 64 Z" fill="' + habit + '"/>';
    s += '<rect x="28" y="36" width="8" height="9" rx="3" fill="' + peau + '"/>';
    if(L.col){ s += '<path d="M27 46 L32 52 L37 46" fill="none" stroke="' + L.col + '" stroke-width="2"/>'; }
    if(L.medaille){ s += '<circle cx="24" cy="54" r="3.2" fill="#E8B923" stroke="#A97F10" stroke-width=".8"/><path d="M22.5 49 L24 51 L25.5 49" stroke="#C0392B" stroke-width="2" fill="none"/>'; }
    s += '<ellipse cx="32" cy="28" rx="11" ry="12.5" fill="' + peau + '"/>';
    if(cheveux === 'court' || cheveux === 'long' || cheveux === 'tresses'){ s += '<path d="M21 26 Q21 14 32 14.5 Q43 14 43 26 Q38 19 32 19.5 Q26 19 21 26 Z" fill="' + ch + '"/>'; }
    if(cheveux === 'ras'){ s += '<path d="M21.5 24 Q22 15 32 15 Q42 15 42.5 24 Q37 18.5 32 18.5 Q27 18.5 21.5 24 Z" fill="' + ch + '" opacity=".85"/>'; }
    if(cheveux === 'boucles'){ s += '<path d="M20 26 Q17 13 32 12 Q47 13 44 26 Q42 18 32 18 Q22 18 20 26 Z" fill="' + ch + '"/><circle cx="21" cy="21" r="3" fill="' + ch + '"/><circle cx="43" cy="21" r="3" fill="' + ch + '"/>'; }
    if(cheveux === 'chignon'){ s += '<circle cx="32" cy="12" r="5" fill="' + ch + '"/><path d="M21 26 Q21 14 32 14.5 Q43 14 43 26 Q38 19 32 19.5 Q26 19 21 26 Z" fill="' + ch + '"/>'; }
    if(cheveux === 'perruque'){ s += '<path d="M20 28 Q18 13 32 13 Q46 13 44 28 Q40 18 32 18.5 Q24 18 20 28 Z" fill="' + ch + '"/><circle cx="19" cy="34" r="4" fill="' + ch + '"/><circle cx="45" cy="34" r="4" fill="' + ch + '"/><circle cx="18" cy="41" r="4" fill="' + ch + '"/><circle cx="46" cy="41" r="4" fill="' + ch + '"/>'; }
    s += '<circle cx="27.8" cy="28" r="1.3" fill="#1A1210"/><circle cx="36.2" cy="28" r="1.3" fill="#1A1210"/>';
    s += '<path d="M25.5 24.6 Q27.8 23.6 30 24.4 M34 24.4 Q36.2 23.6 38.5 24.6" stroke="' + (L.vieux ? '#BDBDBD' : '#1A1210') + '" stroke-width=".9" fill="none" stroke-linecap="round"/>';
    if(L.vieux){ s += '<path d="M24.5 31.5 Q26 32.5 27 31.8 M37 31.8 Q38 32.5 39.5 31.5" stroke="rgba(0,0,0,.25)" stroke-width=".7" fill="none"/>'; }
    if(L.barbe){ s += '<path d="M22 30 Q22 42 32 42.5 Q42 42 42 30 Q40 37 32 37.5 Q24 37 22 30 Z" fill="' + ch + '"/>'; }
    if(L.moustache){ s += '<path d="M28 33.2 Q32 31.6 36 33.2" stroke="' + ch + '" stroke-width="1.8" fill="none" stroke-linecap="round"/>'; }
    s += '<ellipse class="sc-bouche" cx="32" cy="34.6" rx="2.6" ry="1" fill="#5A2626"/>';
    if(L.lunettes){ s += '<g fill="none" stroke="#222" stroke-width="1"><circle cx="27.8" cy="28" r="3.2"/><circle cx="36.2" cy="28" r="3.2"/><path d="M31 28 L33 28"/></g>'; }
    var cf = L.coiffe, cc = L.couleurCoiffe;
    if(cf === 'couronne'){ s += '<path d="M22 18 L22 11 L26.5 15 L32 8.5 L37.5 15 L42 11 L42 18 Z" fill="#E8B923" stroke="#A97F10" stroke-width=".8"/>'; }
    if(cf === 'casque'){ s += '<path d="M18 21 Q19 9 32 8.5 Q45 9 46 21 Z" fill="' + (cc || '#E9E3CF') + '"/><rect x="15" y="20" width="34" height="3" rx="1.5" fill="' + (cc || '#D8D0B6') + '"/>'; }
    if(cf === 'foulard'){ s += '<path d="M19.5 25 Q18 10 32 9.5 Q46 10 44.5 25 Q40 17.5 32 17.5 Q24 17.5 19.5 25 Z" fill="' + (cc || '#C0397C') + '"/><path d="M41 12 Q49 9 47 18 Q44 14 41 15 Z" fill="' + (cc || '#C0397C') + '"/>'; }
    if(cf === 'bonnet'){ s += '<path d="M20 22 Q20 9 32 9 Q44 9 44 22 Z" fill="' + (cc || '#7B2D26') + '"/>'; }
    if(cf === 'chechia'){ s += '<path d="M22 21 L23 11 Q32 8 41 11 L42 21 Z" fill="' + (cc || '#B22222') + '"/>'; }
    if(cf === 'toque'){ s += '<rect x="22" y="7" width="20" height="13" rx="2" fill="' + (cc || '#1E1E1E') + '"/><rect x="18" y="18.5" width="28" height="3" rx="1.5" fill="' + (cc || '#1E1E1E') + '"/>'; }
    if(cf === 'kepi'){ s += '<path d="M21 20 L22 11 L42 11 L43 20 Z" fill="' + (cc || '#2F3B2F') + '"/><path d="M20 20 L44 20 L46 23 L20 23 Z" fill="#111"/>'; }
    if(cf === 'voile'){ s += '<path d="M18 30 Q17 10 32 10 Q47 10 46 30 L48 48 L16 48 Z" fill="' + (cc || '#EDE6D6') + '" opacity=".95"/><ellipse cx="32" cy="28.5" rx="10" ry="11.5" fill="' + peau + '"/><circle cx="27.8" cy="28" r="1.3" fill="#1A1210"/><circle cx="36.2" cy="28" r="1.3" fill="#1A1210"/><ellipse class="sc-bouche" cx="32" cy="34.6" rx="2.6" ry="1" fill="#5A2626"/>'; }
    if(p.groupe){ s = '<g opacity=".75" transform="translate(-13 6) scale(.8)">' + s + '</g><g opacity=".75" transform="translate(25 6) scale(.8)">' + s + '</g>' + s; }
    return '<svg viewBox="0 0 64 64" aria-hidden="true"><defs><clipPath id="cl-' + p._k + '"><circle cx="32" cy="32" r="32"/></clipPath></defs>'
      + '<g clip-path="url(#cl-' + p._k + ')"><rect width="64" height="64" fill="' + esc(p.couleur || '#4C6FBF') + '"/>' + s + '</g></svg>';
  }

  /* ---------- Icônes au trait (style du jeu d'icônes du site : 24 × 24, trait 1,75) ---------- */
  var IC = {
    scene: '<path d="M20.2 6 3 11l-.9-2.4c-.3-1.1.3-2.2 1.3-2.5l13.5-4c1.1-.3 2.2.3 2.5 1.3Z"/><path d="m6.2 5.3 3.1 3.9"/><path d="m12.4 3.4 3.1 4"/><path d="M3 11h18v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2Z"/>',
    labo: '<path d="M10 2v7.5a2 2 0 0 1-.2.9L4.7 20.5a1 1 0 0 0 .9 1.5h12.8a1 1 0 0 0 .9-1.5l-5.1-10.1a2 2 0 0 1-.2-.9V2"/><path d="M8.5 2h7"/><path d="M7 16h10"/>',
    quiz: '<rect x="8" y="2" width="8" height="4" rx="1"/><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><path d="m9 14 2 2 4-4"/>',
    aide: '<circle cx="12" cy="12" r="10"/><path d="M9.1 9a3 3 0 0 1 5.8 1c0 2-3 3-3 3"/><path d="M12 17h.01"/>',
    voix: '<path d="M11 5 6 9H2v6h4l5 4V5z"/><path d="M15.5 8.5a5 5 0 0 1 0 7"/><path d="M19 5a10 10 0 0 1 0 14"/>',
    muet: '<path d="M11 5 6 9H2v6h4l5 4V5z"/><path d="m22 9-6 6"/><path d="m16 9 6 6"/>',
    lecture: '<polygon points="6 3 20 12 6 21 6 3"/>',
    gauche: '<path d="m12 19-7-7 7-7"/><path d="M19 12H5"/>',
    droite: '<path d="M5 12h14"/><path d="m12 5 7 7-7 7"/>',
    haut: '<path d="M12 19V5"/><path d="m5 12 7-7 7 7"/>',
    rejouer: '<path d="M3 12a9 9 0 1 0 9-9 9.8 9.8 0 0 0-6.7 2.7L3 8"/><path d="M3 3v5h5"/>',
    comparer: '<path d="M8 3 4 7l4 4"/><path d="M4 7h16"/><path d="m16 21 4-4-4-4"/><path d="M20 17H4"/>',
    colere: '<polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>',
    joie: '<path d="m12 3-1.9 5.8a2 2 0 0 1-1.3 1.3L3 12l5.8 1.9a2 2 0 0 1 1.3 1.3L12 21l1.9-5.8a2 2 0 0 1 1.3-1.3L21 12l-5.8-1.9a2 2 0 0 1-1.3-1.3Z"/>',
    triste: '<path d="M12 22a7 7 0 0 0 7-7c0-2-1-3.9-3-5.5s-3.5-4-4-6.5c-.5 2.5-2 4.9-4 6.5C6 11.1 5 13 5 15a7 7 0 0 0 7 7z"/>',
    peur: '<path d="m21.7 18-8-14a2 2 0 0 0-3.5 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.7-3"/><path d="M12 9v4"/><path d="M12 17h.01"/>',
    fier: '<circle cx="12" cy="8" r="6"/><path d="M15.5 12.9 17 22l-5-3-5 3 1.5-9.1"/>',
    amour: '<path d="M19 14c1.5-1.5 3-3.2 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.8 0-3 .5-4.5 2-1.5-1.5-2.7-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4 3 5.5l7 7Z"/>',
    doute: '<circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/><circle cx="5" cy="12" r="1"/>',
    livre: '<path d="M12 7v14"/><path d="M3 18a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h5a4 4 0 0 1 4 4 4 4 0 0 1 4-4h5a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1h-6a3 3 0 0 0-3 3 3 3 0 0 0-3-3z"/>',
    document: '<path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/><path d="M14 2v4a2 2 0 0 0 2 2h4"/><path d="M16 13H8"/><path d="M16 17H8"/><path d="M10 9H8"/>',
    cle: '<circle cx="7.5" cy="15.5" r="5.5"/><path d="m21 2-9.6 9.6"/><path d="m15.5 7.5 3 3L22 7l-3-3"/>',
    lettre: '<rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-9 5.7a2 2 0 0 1-2 0L2 7"/>',
    bateau: '<path d="M22 18H2a4 4 0 0 0 4 4h12a4 4 0 0 0 4-4Z"/><path d="M21 14 10 2 3 14h18Z"/><path d="M10 2v16"/>',
    plume: '<path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z"/>',
    flamme: '<path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.4-.5-2-1-3-1.1-2.1-.2-4.1 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.2.4-2.3 1-3a2.5 2.5 0 0 0 2.5 2.5z"/>',
    telephone: '<rect x="5" y="2" width="14" height="20" rx="2"/><path d="M12 18h.01"/>',
    bourse: '<path d="M19 7V4a1 1 0 0 0-1-1H5a2 2 0 0 0 0 4h15a1 1 0 0 1 1 1v4h-3a2 2 0 0 0 0 4h3a1 1 0 0 0 1-1v-2a1 1 0 0 0-1-1"/><path d="M3 5v14a2 2 0 0 0 2 2h15a1 1 0 0 0 1-1v-4"/>',
    fruit: '<path d="M12 21c1.5 0 2.8 1 4 1 3 0 6-8 6-12.2A4.9 4.9 0 0 0 17 5c-2.2 0-4 1.4-5 2-1-.6-2.8-2-5-2a4.9 4.9 0 0 0-5 4.8C2 14 5 22 8 22c1.2 0 2.5-1 4-1Z"/><path d="M10 2c1 .5 2 2 2 5"/>',
    gateau: '<path d="M20 21v-8a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8"/><path d="M4 16s.5-1 2-1 2.5 2 4 2 2.5-2 4-2 2.5 2 4 2 2-1 2-1"/><path d="M2 21h20"/><path d="M7 8v3"/><path d="M12 8v3"/><path d="M17 8v3"/>',
    joyau: '<path d="M6 3h12l4 6-10 13L2 9Z"/><path d="M11 3 8 9l4 13 4-13-3-6"/><path d="M2 9h20"/>',
    pieces: '<circle cx="8" cy="8" r="6"/><path d="M18.1 10.4A6 6 0 1 1 10.3 18"/><path d="M7 6h1v4"/>',
    vase: '<path d="M8 2h8"/><path d="M9 2v3c-2.5 1.5-4 4-4 7a7 7 0 0 0 14 0c0-3-1.5-5.5-4-7V2"/>',
    couronne: '<path d="m2 4 3 12h14l3-12-6 7-4-7-4 7-6-7z"/><path d="M5 20h14"/>',
    groupe: '<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.9"/><path d="M16 3.1a4 4 0 0 1 0 7.8"/>',
    personne: '<path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>',
    balance: '<path d="m16 16 3-8 3 8c-.9.6-1.9 1-3 1s-2.1-.4-3-1Z"/><path d="m2 16 3-8 3 8c-.9.6-1.9 1-3 1s-2.1-.4-3-1Z"/><path d="M7 21h10"/><path d="M12 3v18"/><path d="M3 7h2c2 0 5-1 7-2 2 1 5 2 7 2h2"/>',
    oeil: '<path d="M9.9 4.2A9 9 0 0 1 12 4c7 0 10 8 10 8a13 13 0 0 1-1.7 2.7"/><path d="M6.6 6.6A13.5 13.5 0 0 0 2 12s3 8 10 8a9.7 9.7 0 0 0 5.4-1.6"/><path d="m2 2 20 20"/>',
    porte: '<path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/>',
    nuage: '<path d="M17.5 19H9a7 7 0 1 1 6.7-9h1.8a4.5 4.5 0 1 1 0 9Z"/>',
    porteVoix: '<path d="m3 11 18-5v12L3 14v-3z"/><path d="M11.6 16.8a3 3 0 1 1-5.8-1.6"/>',
    ecole: '<path d="m4 6 8-4 8 4"/><path d="m18 10 4 2v8a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2v-8l4-2"/><path d="M14 22v-4a2 2 0 0 0-4 0v4"/><path d="M18 5v17"/><path d="M6 5v17"/>',
    lune: '<path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/>',
    panier: '<circle cx="8" cy="21" r="1"/><circle cx="19" cy="21" r="1"/><path d="M2 2h3l2.7 12.4a2 2 0 0 0 2 1.6h9.7a2 2 0 0 0 2-1.6L23 6H6"/>',
    bouee: '<circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="4"/><path d="m4.9 4.9 4.3 4.3"/><path d="m14.8 9.2 4.3-4.3"/><path d="m14.8 14.8 4.3 4.3"/><path d="m9.2 14.8-4.3 4.3"/>',
    vagues: '<path d="M2 6c.6.5 1.2 1 2.5 1C7 7 7 5 9.5 5c2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1"/><path d="M2 12c.6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1"/><path d="M2 18c.6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1"/>',
    de: '<rect x="3" y="3" width="18" height="18" rx="2"/><path d="M16 8h.01"/><path d="M8 8h.01"/><path d="M8 16h.01"/><path d="M16 16h.01"/><path d="M12 12h.01"/>',
    course: '<circle cx="13" cy="4" r="2"/><path d="m7 21 3-6 3 3 3-6"/><path d="M6 12l3-4 4 1 3 3h3"/>',
    statue: '<path d="M3 22h18"/><path d="M6 18V11"/><path d="M10 18V11"/><path d="M14 18V11"/><path d="M18 18V11"/><path d="m12 2 8 5H4z"/>',
    diplome: '<path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/>',
    poing: '<path d="M18 11V6a2 2 0 0 0-4 0v5"/><path d="M14 10V4a2 2 0 0 0-4 0v6"/><path d="M10 10.5V6a2 2 0 0 0-4 0v8"/><path d="M18 8a2 2 0 1 1 4 0v6a8 8 0 0 1-8 8h-2c-2.8 0-4.5-.9-6-2.4l-3.6-3.6a2 2 0 0 1 2.8-2.8L7 15"/>',
    signature: '<path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z"/>'
  };
  var EMOJI_IC = { '📖':'livre', '🤔':'aide', '🤐':'muet', '👑':'couronne', '🤝':'groupe', '🙈':'oeil', '🚪':'porte', '🐐':'pieces', '🦁':'couronne', '🙏':'amour',
    '⚖️':'balance', '🛶':'bateau', '🌫️':'nuage', '🗣️':'porteVoix', '👥':'groupe', '✉️':'lettre', '👴':'personne', '📜':'document', '✍️':'plume', '🏫':'ecole',
    '📢':'porteVoix', '🔇':'muet', '😴':'lune', '🛒':'panier', '😠':'colere', '🛟':'bouee', '🌊':'vagues', '🎲':'de', '🏃':'course', '🗿':'statue', '🌙':'lune',
    '👩‍🏫':'personne', '🧒':'personne', '🎓':'diplome', '✊':'poing', '🕯️':'flamme', '🔥':'flamme', '🍍':'fruit', '🥭':'fruit', '👛':'bourse', '📱':'telephone',
    '🎂':'gateau', '🐘':'joyau', '🗝️':'cle', '🏅':'fier', '🏺':'vase', '📄':'document', '🕯':'flamme' };
  function ico(nom, cls){
    var p = IC[nom] || IC[EMOJI_IC[nom]];
    if(!p){ return ''; }
    return '<svg class="ic' + (cls ? ' ' + cls : '') + '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + p + '</svg>';
  }

  /* ---------- Personnages en 3D isométrique (SVG, sans bibliothèque) ----------
   * Même fiche `look` que l'avatar rond. Trois faces visibles par volume :
   * dessus (clair), face gauche (ombre), face droite (lumière). */
  function teinte(hex, f){
    var h = String(hex).replace('#', '');
    if(h.length === 3){ h = h.replace(/(.)/g, '$1$1'); }
    var n = parseInt(h, 16), r = n >> 16 & 255, g = n >> 8 & 255, b = n & 255;
    function m(c){ return Math.round(f < 0 ? c * (1 + f) : c + (255 - c) * f); }
    return 'rgb(' + m(r) + ',' + m(g) + ',' + m(b) + ')';
  }
  function poly(pts, c){ return '<polygon points="' + pts + '" fill="' + c + '" stroke="' + c + '" stroke-width="1.6" stroke-linejoin="round"/>'; }
  function boite(x, y, l, p, h, c){ // prisme iso : sommet arrière (x,y), largeur l (droite), profondeur p (gauche), hauteur h
    var A = x + ',' + y, B = (x + l) + ',' + (y + l / 2), C = x + l - p + ',' + (y + l / 2 + p / 2), D = (x - p) + ',' + (y + p / 2);
    var B2 = (x + l) + ',' + (y + l / 2 + h), C2 = (x + l - p) + ',' + (y + l / 2 + p / 2 + h), D2 = (x - p) + ',' + (y + p / 2 + h);
    return poly(D + ' ' + C + ' ' + C2 + ' ' + D2, teinte(c, -.28)) + poly(C + ' ' + B + ' ' + B2 + ' ' + C2, c) + poly(A + ' ' + B + ' ' + C + ' ' + D, teinte(c, .22));
  }
  var METIERS = {
    medecin:    { tenue: 'blouse', habit: '#F4F6FA', chemise: '#7FA7D9', bas: '#2B3A55', extra: ['stetho'] },
    infirmier:  { habit: '#5AA9C9', bas: '#4B93B2', coiffe: 'calot', extra: ['badge'] },
    policier:   { habit: '#1E3A6E', bas: '#14254A', coiffe: 'kepi', couleurCoiffe: '#14254A', extra: ['badge', 'ceinture'] },
    soldat:     { habit: '#5B6B3A', bas: '#4A5830', coiffe: 'beret', couleurCoiffe: '#3A4A28', extra: ['ceinture', 'epaulettes'] },
    enseignant: { habit: '#7A5A3A', bas: '#3A3A44', tenue: 'costume', col: '#2F5E9E', objet: 'livre' },
    pretre:     { tenue: 'boubou', habit: '#1A1A1A', extra: ['col_romain', 'croix'] },
    juge:       { tenue: 'boubou', habit: '#121212', extra: ['jabot'], objet: 'dossier' },
    paysan:     { habit: '#9C6B3A', bas: '#4A3A2A', coiffe: 'chapeau', objet: 'houe' },
    commercant: { habit: '#C2551F', bas: '#3A3A44', extra: ['tablier'] },
    cuisinier:  { habit: '#F4F4F4', bas: '#2B2B2B', coiffe: 'toque_chef', extra: ['tablier'] },
    eleve:      { habit: '#F4F6FA', bas: '#1E499B', extra: ['cartable'] },
    ouvrier:    { habit: '#E07B39', bas: '#2B3A55', coiffe: 'casque_chantier', extra: ['gilet'] }
  };
  function iso(p){
    // Personnage « flat isométrique » : silhouette élancée vue de trois quarts, sans traits du visage,
    // deux tons par pièce (ombre à gauche), ombre douce au sol. viewBox 80 × 200, pieds vers y = 186.
    var L = p.look || {};
    if(L.metier && METIERS[L.metier]){ L = Object.assign({}, METIERS[L.metier], L); }
    var X = L.extra || [], a = function(n){ return X.indexOf(n) >= 0; };
    var peau = PEAUX[L.peau] || PEAUX.brun, peauO = teinte(peau, -.22);
    var ch = L.vieux ? '#D6D6D6' : (L.couleurCheveux || (L.peau === 'clair' ? '#6B4A2B' : '#1E1410')), chO = teinte(ch, -.25);
    var habit = L.habit || '#2B3A67', habitO = teinte(habit, -.25);
    var tenue = L.tenue || 'pantalon';
    var bas = L.bas || (tenue === 'costume' ? habit : teinte(habit, -.55));
    var cheveux = L.cheveux || 'court', cf = L.coiffe, cc = L.couleurCoiffe;
    function P(d, c, cls){ return '<path' + (cls ? ' class="' + cls + '"' : '') + ' d="' + d + '" fill="' + c + '"/>'; }
    var s = '<ellipse class="iso-socle" cx="40" cy="187" rx="25" ry="8"/>';
    s += '<g class="iso-corps">';
    // jambes (ou bas de robe longue)
    var jambe = (tenue === 'robe' || tenue === 'jupe') ? peau : bas;
    if(tenue !== 'boubou'){
      s += '<g class="iso-jb">' + P('M31.5 106 L39 106 L37.6 179 L33 179 Z', teinte(jambe, -.2)) + P('M31 178.5 h7.2 q3 0 3.6 2.6 v1.6 h-11.3 z', '#1F2233') + '</g>'
        + '<g class="iso-jf">' + P('M39 107 L48 107 L47.2 181 L41.8 181 Z', jambe) + P('M41 180.5 h7.4 q3.6 0 4.3 2.8 v1.6 h-12.2 z', '#2A2E44') + '</g>';
    } else {
      s += P('M30 178.5 h7.2 q3 0 3.6 2.6 v1.6 h-11.3 z', '#1F2233') + P('M42 180.5 h7.4 q3.6 0 4.3 2.8 v1.6 h-12.2 z', '#2A2E44');
    }
    // cheveux longs : derrière le corps
    if(cheveux === 'long' || cheveux === 'tresses'){ s += P('M30.5 40 Q30 30 41 30 Q51.5 30 50.5 42 L50 68 Q43 72 31 67 Z', chO); }
    if(cheveux === 'perruque'){ s += P('M27 42 Q26 28 41 28 Q55 28 54 42 Q57 52 54 60 Q56 68 49 70 L33 70 Q25 68 27 60 Q24 52 27 42 Z', chO); }
    if(cf === 'voile'){ s += P('M28.5 46 Q28 29 40.5 29 Q53.5 29 52.5 46 L55 70 Q41 76 26 70 Z', teinte(cc || '#EDE6D6', -.12)); }
    if(a('cartable')){ s += P('M26 66 L34 64 L34 98 L24 100 Z', '#C0392B') + P('M24 74 L28 73 L28 95 L24 96 Z', '#962D22'); }
    if(L.objet === 'houe'){ s += '<path d="M27 80 L23 182" stroke="#8A5A2B" stroke-width="2.4" stroke-linecap="round"/>' + P('M21 176 L31 180 L30 184 L19 181 Z', '#8A8F9C'); }
    // bras arrière
    s += P('M26.5 68 Q25 90 25.6 110 L31 110 Q31 91 32.5 70 Z', habitO) + '<ellipse cx="28.3" cy="113" rx="3.2" ry="3.8" fill="' + peauO + '"/>';
    if(L.objet === 'dossier' || L.objet === 'livre'){ s += P('M20 96 L31 99 L29 125 L18 122 Z', L.objet === 'livre' ? '#7A2E2E' : '#2B3A55') + P('M31 99 L32.5 99.6 L30.6 125.4 L29 125 Z', '#E9E3CF'); }
    if(L.objet === 'sac'){ s += '<path d="M24 114 Q28 104 32 114" fill="none" stroke="#4A4A55" stroke-width="1.6"/>' + P('M21.5 114 L34.5 114 L35.5 128 L20.5 128 Z', '#8A8F9C') + P('M21.5 114 L26 114 L25 128 L20.5 128 Z', '#6E7385'); }
    if(L.objet === 'lettre'){ s += P('M22 106 L32 108 L31 116 L21 114 Z', '#FFF7E0') + '<path d="M22 106 L26.6 111.6 L32 108" fill="none" stroke="#C9982E" stroke-width=".9"/>'; }
    // buste selon la tenue
    if(tenue === 'robe'){ s += P('M28 68 Q30 61.5 40 61 Q50 61.5 52 68 L50 104 L56 150 L24 150 L30 104 Z', habit) + P('M28 68 Q30 61.5 37 61.2 L35 104 L32 150 L24 150 L30 104 Z', habitO); }
    else if(tenue === 'jupe'){ s += P('M28 68 Q30 61.5 40 61 Q50 61.5 52 68 L50 106 L30 106 Z', habit) + P('M28 68 Q30 61.5 37 61.2 L35 106 L30 106 Z', habitO) + P('M29.5 104 L50.5 104 L54 140 L26 140 Z', bas) + P('M29.5 104 L35 104 L33 140 L26 140 Z', teinte(bas, -.2)); }
    else if(tenue === 'blouse'){
      var ch2 = L.chemise || '#7FA7D9';
      s += P('M27.5 68 Q30 61.5 40 61 Q50 61.5 52.5 68 L54 142 L26 142 Z', habit) + P('M27.5 68 Q30 61.5 37 61.2 L35 142 L26 142 Z', habitO)
        + P('M38.6 62 L43.4 62 L42.6 112 L39.4 112 Z', ch2) + P('M40.3 64 L41.7 64 L42.1 76 L41 78.4 L39.9 76 Z', '#8E2A3C')
        + '<path d="M38.4 62 L37.6 142 M43.6 62 L44.6 142" stroke="' + teinte(habit, -.12) + '" stroke-width="1"/>'
        + P('M46 100 L51 100 L51 106 L46 106 Z', teinte(habit, -.1));
    }
    else if(tenue === 'boubou'){ s += P('M27 68 Q30 61.5 40 61 Q50 61.5 53 68 L57 180 L23 180 Z', habit) + P('M27 68 Q30 61.5 37 61.2 L35 180 L23 180 Z', habitO) + '<path d="M37 64 L40.5 78 L44 64" fill="none" stroke="' + teinte(habit, .35) + '" stroke-width="1.6"/>'; }
    else { s += P('M28 68 Q30 61.5 40 61 Q50 61.5 52 68 L50.5 110 L29.5 110 Z', habit) + P('M28 68 Q30 61.5 37 61.2 L35.5 110 L29.5 110 Z', habitO); }
    if(tenue === 'costume'){ s += P('M37.5 62 L41 76 L44.5 62 Z', '#F4F2EC') + P('M40.2 64 L41.8 64 L42.3 76 L41 79 L39.7 76 Z', L.col || '#8E2A3C'); }
    else if(L.col){ s += '<path d="M37 62.5 L40.8 68 L44.6 62.5" fill="none" stroke="' + L.col + '" stroke-width="2" stroke-linejoin="round"/>'; }
    if(a('tablier')){ s += P('M33 76 L49 76 L51 140 L31 140 Z', L.metier === 'cuisinier' ? '#FFFFFF' : '#E9DFC7') + '<path d="M33 76 L37 64 M49 76 L45 64" stroke="' + (L.metier === 'cuisinier' ? '#DDD' : '#C9B98F') + '" stroke-width="1.4"/>'; }
    if(a('gilet')){ s += P('M29 70 L51 70 L50.4 108 L29.6 108 Z', '#F2C12E') + '<path d="M29.4 88 L50.6 88 M29.6 96 L50.4 96" stroke="#E8ECF2" stroke-width="2.4"/>' + P('M37.5 62 L44 62 L44 70 L37.5 70 Z', habit); }
    if(a('ceinture')){ s += '<rect x="29.6" y="100" width="21" height="3.4" fill="#1A1A1A"/><rect x="39" y="99.6" width="3.6" height="4.2" fill="#C9982E"/>'; }
    if(a('epaulettes')){ s += P('M28 66 Q30 63 35 63 L35 66.5 Z', '#C9982E') + P('M46 63 Q50 63 52.4 66.5 L46 66.5 Z', '#C9982E'); }
    if(a('badge')){ s += P('M45 74 L49 74 L49 78 L47 80 L45 78 Z', '#E8B923'); }
    if(a('stetho')){ s += '<path d="M37.4 63 Q35.6 76 40.6 80 Q45.4 76 44 63" stroke="#2A2E44" fill="none" stroke-width="1.3"/><circle cx="40.6" cy="81.2" r="1.8" fill="#9AA3B2"/>'; }
    if(a('col_romain')){ s += '<rect x="38.2" y="61" width="5" height="2.6" rx="1" fill="#FFFFFF"/>'; }
    if(a('croix')){ s += '<path d="M41 70 L41 79 M38.4 73 L43.6 73" stroke="#E8B923" stroke-width="1.6" stroke-linecap="round"/>'; }
    if(a('jabot')){ s += P('M38 62 L44 62 L43 72 L41 74 L39 72 Z', '#FFFFFF'); }
    if(L.medaille){ s += '<circle cx="46" cy="78" r="2.6" fill="#E8B923"/><path d="M45 72 L46 75.5 L47 72" stroke="#C0392B" stroke-width="1.6" fill="none"/>'; }
    // bras avant (geste quand le personnage parle)
    s += '<g class="iso-bras">' + P('M47.5 68 Q52.5 72 53 92 L52.6 110 L47.2 110 Q47 92 45.8 74 Z', habit) + '<ellipse cx="50" cy="113.5" rx="3.3" ry="3.9" fill="' + peau + '"/></g>';
    s += '<g class="iso-geste">' + P('M47.5 68 Q52.5 72 53.6 88 L48.6 90 Q47 80 45.8 74 Z', habit)
      + P('M48.4 86.4 L53.6 88.2 L62.4 81.2 L59.6 77.4 Z', habit) + P('M48.4 86.4 L51 87.4 L60.6 79.6 L59.6 77.4 Z', habitO)
      + '<ellipse cx="63.4" cy="78.4" rx="4.2" ry="2.3" transform="rotate(-24 63.4 78.4)" fill="' + peau + '"/><path d="M61 76.6 L62 73.8" stroke="' + peau + '" stroke-width="1.8" stroke-linecap="round"/></g>';
    // cou
    s += P('M37 50 L44 50 L44 63 Q40.5 65 37 63 Z', peauO) + P('M40.5 50 L44 50 L44 63 Q42.3 64 40.5 64 Z', peau);
    // tête
    s += '<g class="iso-tete">';
    if(cheveux === 'afro'){ cheveux = 'boucles'; }
    if(cheveux === 'boucles'){ s += '<circle cx="39.5" cy="40" r="11.5" fill="' + chO + '"/>'; }
    if(cheveux === 'queue'){ s += P('M33 36 Q24 42 27 60 Q30 54 31.5 44 Z', chO); }
    if(cheveux === 'carre'){ s += P('M30.5 40 Q30 30.5 41 30.5 Q51.5 30.5 50.8 42 L50.6 53 Q44 55.5 31 53.5 Z', chO); }
    s += '<ellipse cx="40.5" cy="44" rx="9" ry="10.5" fill="' + peau + '"/>';
    s += P('M40.5 33.5 Q31.5 33.5 31.5 44 Q31.5 54.5 40.5 54.5 Q36 50 36 44 Q36 37 40.5 33.5 Z', peauO);
    s += '<ellipse cx="34.6" cy="45.2" rx="1.9" ry="2.6" fill="' + teinte(peau, -.35) + '"/>';
    s += P('M48.8 43 Q51 45.4 49.2 47.2 Z', peau);
    // visage de trois quarts : l'œil proche est plus grand, l'œil lointain près du profil
    var cil = L.vieux ? '#CFCFCF' : teinte(ch, -.1);
    s += '<ellipse cx="44.4" cy="42.8" rx="1.05" ry="1.4" fill="#1A1210"/><ellipse cx="48.3" cy="42.5" rx=".85" ry="1.25" fill="#1A1210"/>'
      + '<circle cx="44.7" cy="42.3" r=".35" fill="#fff"/><circle cx="48.55" cy="42" r=".3" fill="#fff"/>'
      + '<path d="M42.9 39.9 Q44.4 39.1 45.9 39.6 M47.3 39.4 Q48.4 39 49.3 39.6" stroke="' + cil + '" stroke-width=".9" fill="none" stroke-linecap="round"/>'
      + '<ellipse cx="44" cy="47.2" rx="1.8" ry="1" fill="#E8836B" opacity=".25"/>';
    s += '<path d="M44.8 50.4 Q46.3 51.3 47.8 50.2" stroke="#6B2424" stroke-width=".9" fill="none" stroke-linecap="round"/>';
    s += '<ellipse class="sc-bouche" cx="46.3" cy="50.6" rx="1.5" ry=".7" fill="#6B2424"/>';
    if(L.barbe){ s += P('M32.8 46 Q33.5 57.5 41 57.5 Q48.6 57 49.3 48.6 Q46 52.6 41.5 52.6 Q36.6 52.4 32.8 46 Z', ch); }
    if(L.moustache){ s += P('M43.2 48.6 Q46.5 47.4 49 48.8 Q46.2 50 43.2 48.6 Z', ch); }
    if(L.lunettes){ s += '<g fill="none" stroke="#1A1A1A" stroke-width=".8"><circle cx="44.4" cy="42.8" r="2.3"/><circle cx="48.4" cy="42.6" r="1.7"/><path d="M46.7 42.7 L46.8 42.7 M42.1 42.6 L35.5 42"/></g>'; }
    // chevelure (avant)
    var nu = cf === 'voile' || cf === 'foulard' || cf === 'toque' || cf === 'casque' || cf === 'toque_chef' || cf === 'casque_chantier' || cf === 'chapeau';
    if(!nu){
      if(cheveux === 'court' || cheveux === 'long' || cheveux === 'tresses' || cheveux === 'chignon' || cheveux === 'queue' || cheveux === 'carre'){ s += P('M31.2 45 Q30 32 41 32 Q51.2 32 50 41 Q46.5 37.3 40.5 37.8 Q36 38.4 34.5 47 Z', ch) + P('M31.2 45 Q30.4 35 36 33 Q34.6 38.6 34.5 47 Z', chO); }
      if(cheveux === 'ras'){ s += P('M31.6 43 Q31.2 33.6 41 33.4 Q50 33.6 49.8 40 Q46 36.6 40.5 37 Q35.8 37.6 34.2 44 Z', teinte(ch, .05)); }
      if(cheveux === 'chignon'){ s += '<circle cx="34.5" cy="34.5" r="4.6" fill="' + ch + '"/>'; }
      if(cheveux === 'tresses'){ s += '<path d="M31 50 L30 72 M33.5 52 L33 74" stroke="' + ch + '" stroke-width="2.6" stroke-linecap="round"/>'; }
      if(cheveux === 'boucles'){ s += P('M29 44 Q27.5 28.5 40.5 28.6 Q53 28.6 51.5 40 Q46.5 35.8 40.5 36.4 Q35 37 34 46 Z', ch); }
      if(cheveux === 'perruque'){ s += P('M28.8 46 Q27.6 30 41 30 Q53.2 30 51.2 41 Q47 36 40.5 36.8 Q35.4 37.4 34 50 Z', ch) + '<circle cx="30" cy="55" r="4.2" fill="' + ch + '"/><circle cx="30.5" cy="63" r="4.2" fill="' + chO + '"/>'; }
    }
    // coiffes
    if(cf === 'couronne'){ s += P('M31 37.5 L31 29 L34.6 33 L38 26.5 L41.4 32 L44.8 26.5 L48.2 33 L51 29 L51 37.5 Q41 34.5 31 37.5 Z', '#E8B923') + P('M31 37.5 L31 29 L34.6 33 L36 37 Q33 37 31 37.5 Z', '#C29514') + '<circle cx="41.4" cy="34.3" r="1.3" fill="#C0392B"/>'; }
    if(cf === 'casque'){ var kc = cc || '#E9E3CF'; s += '<ellipse cx="41" cy="38.6" rx="14.5" ry="3.6" fill="' + teinte(kc, -.15) + '"/>' + P('M30 38.4 Q30.6 25.5 41 25.5 Q51.4 25.5 52 38.4 Z', kc) + P('M30 38.4 Q30.6 25.5 38 25.6 Q34 30 34.6 38.4 Z', teinte(kc, -.12)); }
    if(cf === 'toque'){ var tc = cc || '#1E1E1E'; s += '<ellipse cx="41" cy="35.5" rx="12.5" ry="3.2" fill="' + teinte(tc, .12) + '"/>' + P('M33.4 35 L34 19.5 Q41 17.5 48 19.5 L48.6 35 Z', tc) + '<rect x="33.6" y="30" width="14.8" height="2.6" fill="#7A2E2E"/>'; }
    if(cf === 'bonnet'){ var bc = cc || '#7B2D26'; s += P('M30.6 40 Q30.4 28 41 28 Q51.6 28 51.4 40 Q41 36.5 30.6 40 Z', bc) + P('M30.6 40 Q30.4 29.5 37 28.3 Q34.4 33 34.6 38.6 Z', teinte(bc, -.2)); }
    if(cf === 'chechia'){ var hc = cc || '#B22222'; s += P('M32 38.5 L33 27.5 Q41 25.5 49 27.5 L50 38.5 Q41 36 32 38.5 Z', hc) + '<path d="M41 26 Q46 25 47 31" stroke="#111" stroke-width="1.1" fill="none"/>'; }
    if(cf === 'kepi'){ var pc = cc || '#2F3B2F'; s += P('M31.5 38.5 L32.5 28 L49.5 28 L50.5 38.5 Z', pc) + P('M44 38 L55 38.5 L54 40.5 L44 40 Z', '#111'); }
    if(cf === 'foulard'){ var fc = cc || '#C0397C'; s += P('M30.2 44 Q28.4 25.5 40.8 25 Q53.4 25 51.4 41 Q46.5 35.8 40.6 36 Q35.4 36.6 33.4 45 Z', fc) + P('M30.2 44 Q28.8 28 37 25.6 Q34 32 33.4 45 Z', teinte(fc, -.2)) + '<ellipse cx="45.5" cy="25.5" rx="4.5" ry="3.2" fill="' + teinte(fc, .15) + '"/>'; }
    if(cf === 'beret'){ var rc = cc || '#3A4A28'; s += P('M30.6 39 Q30 29.6 42 29.6 Q53.4 30.4 51.6 37.2 Q41 34.4 30.6 39 Z', rc) + P('M30.6 39 Q30.4 31 37 29.9 Q34.6 34 34.4 37.6 Z', teinte(rc, -.2)) + '<circle cx="48" cy="33" r="1.4" fill="#C9982E"/>'; }
    if(cf === 'calot'){ s += P('M33 35.4 L34 29.6 L48 29.6 L49 35.4 Q41 33.6 33 35.4 Z', '#FFFFFF'); }
    if(cf === 'toque_chef'){ s += P('M32.4 37.6 L33 27 Q29 21 35.4 19.4 Q40 14.6 45.6 19.4 Q52 21 49 27 L49.6 37.6 Q41 35.6 32.4 37.6 Z', '#FAFAFA') + P('M32.4 37.6 L33 27 Q29 21 35.4 19.4 Q34 27 36 37 Z', '#E3E6EC'); }
    if(cf === 'casque_chantier'){ s += '<ellipse cx="41.4" cy="37.6" rx="13" ry="3" fill="#D9A40F"/>' + P('M30.6 37.4 Q31 26 41.2 26 Q51.6 26 51.8 37.4 Z', '#F2C12E') + '<path d="M41.2 26 L41.2 37" stroke="#D9A40F" stroke-width="2"/>'; }
    if(cf === 'chapeau'){ var hc2 = cc || '#D8B46A'; s += '<ellipse cx="41" cy="36.6" rx="16.5" ry="4.2" fill="' + teinte(hc2, -.12) + '"/>' + P('M33.4 36.4 Q33.4 26.6 41.2 26.6 Q49 26.6 49 36.4 Z', hc2) + '<rect x="33.4" y="33" width="15.6" height="2.4" fill="#7A2E2E"/>'; }
    if(cf === 'voile'){ var vc = cc || '#EDE6D6'; s += P('M29.6 50 Q28.6 30.5 40.6 30.5 Q52.6 30.5 51.8 44 Q49 36.6 42.4 36.6 Q37 37.4 36.4 46 Q37.4 55.2 44 56.6 Q38 61 29.6 50 Z', vc) + P('M29.6 50 Q28.8 33 36 31.2 Q33.6 38 34 52 Z', teinte(vc, -.14)); }
    s += '</g></g>';
    if(p.groupe){
      s = '<g transform="translate(-16 6) scale(.86)" opacity=".75">' + s + '</g><g transform="translate(27 6) scale(.86)" opacity=".75">' + s + '</g><g transform="translate(6 0)">' + s + '</g>';
    }
    return '<svg class="iso" viewBox="0 0 80 200" aria-hidden="true">' + s + '</svg>';
  }

  /* ---------- Squelette ---------- */
  function construire(){
    document.title = S.titre + ' — Scènes vivantes | VÉRITAS';
    var sur = [S.discipline, S.niveau, S.oeuvre ? S.oeuvre + (S.auteur ? ' · ' + S.auteur : '') : ''].filter(Boolean).join(' · ');
    // la première moitié de la distribution regarde à droite, la seconde à gauche : ils se font face
    var troupe = ordre.map(function(k, n){
      var p = persos[k]; p._k = k;
      return '<div class="sc-perso absent' + (n >= ordre.length / 2 ? ' face-g' : '') + '" id="p-' + esc(k) + '">'
        + '<div class="sc-avatar" aria-hidden="true">' + (p.look || p.groupe ? iso(p) : '<span class="sc-init" style="background:' + esc(p.couleur || '#1E499B') + '">' + esc(p.init || initiales(p.nom)) + '</span>') + '</div>'
        + '<div class="sc-nom">' + esc(p.nom) + '</div></div>';
    }).join('');
    var options = ordre.map(function(k){ return '<option value="' + esc(k) + '">' + esc(persos[k].nom) + '</option>'; }).join('');
    var jg = jauges.map(function(j){
      return '<div class="sc-j" id="j-' + esc(j.id) + '"><div class="sc-j-l"><span>' + esc(j.nom) + '</span><b>0</b></div>'
        + '<div class="sc-j-t"><i style="background:' + esc(j.couleur || 'var(--v-or)') + ';transform:scaleX(0)"></i></div></div>';
    }).join('');

    document.body.innerHTML =
      '<div class="sc-marque"><div class="sc-marque-in"><a href="index.html"><img src="../assets/veritas-logo.png" alt="" width="38" height="38"><b>VÉRITAS</b></a>'
      + '<i class="sc-sep"></i><span>Scènes vivantes</span></div></div>'
      + '<main class="sc-wrap">'
      + '<header class="sc-tete"><a class="sc-retour" href="index.html" aria-label="Toutes les scènes">' + ico('gauche') + '</a>'
      + '<div><div class="sc-sur">' + esc(sur) + '</div><h1 class="sc-titre">' + esc(S.titre) + '</h1></div></header>'
      + '<p class="sc-avert">' + esc(S.avertissement || (S.oeuvre ? AVERT_OEUVRE : AVERT_LIBRE)) + '</p>'
      + '<nav class="sc-onglets" role="tablist">'
      +   '<button class="sc-onglet on" role="tab" aria-selected="true" data-vue="scene">' + ico('scene') + 'La scène</button>'
      +   (S.labo ? '<button class="sc-onglet" role="tab" aria-selected="false" data-vue="labo">' + ico('labo') + 'Laboratoire</button>' : '')
      +   '<button class="sc-onglet" data-modal="quiz">' + ico('quiz') + 'Quiz</button>'
      +   '<button class="sc-onglet" data-modal="guide">' + ico('aide') + 'Guide</button>'
      + '</nav>'
      + '<section id="vueLabo" class="sc-labo" hidden></section>'
      + '<div id="vueScene">'
      + '<section class="sc-scene" aria-label="Scène">'
      +   '<div class="sc-plateau"><div class="sc-decor" id="decor"></div><div class="sc-amb" id="amb"></div>'
      +   '<div class="sc-lieu"><span><b>Lieu</b> · <span id="lieu"></span></span><span id="moment"></span></div>'
      +   '<div id="objet"></div><div class="sc-troupe">' + troupe + '</div></div>'
      +   (jg ? '<div class="sc-jauges">' + jg + '</div>' : '')
      +   '<div class="sc-bulle" id="bulle" aria-live="polite"></div>'
      + '</section>'
      + '<div class="sc-barre"><i id="barre"></i></div>'
      + '<div class="sc-cmd">'
      +   '<button class="sc-btn" id="bPrec" aria-label="Étape précédente">' + ico('gauche') + '<span class="lib">Retour</span></button>'
      +   '<button class="sc-btn" id="bVoix" aria-pressed="false" title="Lecture à voix haute">' + ico('voix') + '<span class="lib">Lire</span></button>'
      +   '<button class="sc-btn" id="bAuto" aria-pressed="false" title="Défilement automatique">' + ico('lecture') + '<span class="lib">Auto</span></button>'
      +   '<span class="sc-compteur" id="compteur"></span>'
      +   '<button class="sc-btn principal" id="bSuiv">Suivant</button>'
      + '</div>'
      + '<label class="sc-role">Jouer un rôle en classe :<select id="role"><option value="">— personne —</option>' + options + '</select></label>'
      + '<details class="sc-panneau"><summary><b>Objectif et texte de la scène</b></summary>'
      +   '<p class="sc-objectif">' + esc(S.objectif || '') + '</p>' + (S.programme ? '<p class="sc-prog"><b>Au programme</b> · ' + esc(S.programme) + '</p>' : '') + '<div class="sc-script" id="scriptTxt"></div></details>'
      + '<section class="sc-panneau sc-bilan" id="bilan" hidden></section>'
      + '</div>'
      + '</main>'
      + '<div class="sc-modal" id="modal" hidden><div class="sc-modal-in" role="dialog" aria-modal="true" aria-labelledby="modalT"><button class="sc-fermer" id="modalX" aria-label="Fermer">×</button><div id="modalC"></div></div></div>';

    document.querySelectorAll('.sc-onglet').forEach(function(b){
      b.onclick = function(){
        if(b.getAttribute('data-modal')){ ouvrirModal(b.getAttribute('data-modal')); return; }
        var v = b.getAttribute('data-vue');
        document.querySelectorAll('.sc-onglet[data-vue]').forEach(function(o){ var on = o === b; o.classList.toggle('on', on); o.setAttribute('aria-selected', on ? 'true' : 'false'); });
        $('vueScene').hidden = v !== 'scene';
        $('vueLabo').hidden = v !== 'labo';
        if(v === 'labo'){ taire(); clearTimeout(minuterie); LABO.ouvrir(); }
      };
    });
    $('modalX').onclick = fermerModal;
    $('modal').onclick = function(ev){ if(ev.target === this){ fermerModal(); } };
    document.addEventListener('keydown', function(ev){ if(ev.key === 'Escape' && !$('modal').hidden){ fermerModal(); } });

    $('bPrec').onclick = function(){ aller(i - 1); };
    $('bSuiv').onclick = suivant;
    $('bAuto').onclick = function(){ auto = !auto; marquer(this, auto); if(auto){ planifier(); } else { clearTimeout(minuterie); } };
    $('bVoix').onclick = function(){ voix = !voix; marquer(this, voix); if(voix){ parler(etapes[i]); } else { taire(); } };
    if(!('speechSynthesis' in window)){ $('bVoix').hidden = true; }
    $('role').onchange = function(){ role = this.value; afficher(true); };
    document.addEventListener('keydown', function(e){
      if($('vueScene').hidden || !$('modal').hidden){ return; }
      if(e.target && /^(TEXTAREA|SELECT|INPUT|BUTTON)$/.test(e.target.tagName) && e.key === ' '){ return; }
      if(e.target && /^(TEXTAREA|SELECT|INPUT)$/.test(e.target.tagName)){ return; }
      if(e.key === 'ArrowRight' || e.key === ' '){ e.preventDefault(); suivant(); }
      else if(e.key === 'ArrowLeft'){ e.preventDefault(); aller(i - 1); }
    });
    $('scriptTxt').innerHTML = etapes.map(function(e){
      if(e.t === 'dit' || e.t === 'pense' || e.t === 'vers'){
        var p = persos[e.qui] || {nom: e.qui || ''};
        return '<p><b>' + esc(p.nom) + '</b>' + (e.jeu ? ' <i>(' + esc(e.jeu) + ')</i>' : '') + (e.t === 'pense' ? ' <i>(en pensée)</i>' : '') + ' — ' + esc(e.txt) + '</p>';
      }
      if(e.t === 'recit'){ return '<p class="r">' + esc(e.txt) + '</p>'; }
      return '';
    }).join('');
  }
  function marquer(b, on){ b.classList.toggle('on', on); b.setAttribute('aria-pressed', on ? 'true' : 'false'); }

  /* ---------- État rejoué jusqu'à l'étape n ---------- */
  function etat(n){
    var st = { pr:{}, decor:S.decor, amb:S.ambiance || '', lieu:S.lieu || '', moment:S.moment || '', j:{} };
    jauges.forEach(function(j){ st.j[j.id] = j.val || 0; });
    for(var k = 0; k <= n; k++){
      var e = etapes[k];
      (e.entre || []).forEach(function(q){ st.pr[q] = true; });
      if(e.qui && e.t !== 'choix'){ st.pr[e.qui] = true; }
      if(k < n){ (e.sort || []).forEach(function(q){ st.pr[q] = false; }); }
      if(e.decor){ st.decor = e.decor; }
      if(e.ambiance != null){ st.amb = e.ambiance; }
      if(e.lieu){ st.lieu = e.lieu; }
      if(e.moment){ st.moment = e.moment; }
      // un atelier ne fait bouger les jauges qu'une fois réussi
      if(e.jauges && (e.t !== 'atelier' || k in reponses)){ for(var id in e.jauges){ st.j[id] = e.jauges[id]; } }
      var r = reponses[k];
      if(r && e.options && e.options[r.k] && e.options[r.k].jauges){
        var jj = e.options[r.k].jauges;
        for(var id2 in jj){ st.j[id2] = Math.max(0, Math.min(100, (st.j[id2] || 0) + jj[id2])); }
      }
    }
    return st;
  }

  /* ---------- Navigation ---------- */
  function bloque(){
    var e = etapes[i];
    if(!e){ return false; }
    if(e.t === 'question' || e.t === 'choix' || e.t === 'atelier'){ return !(i in reponses); }
    return false;
  }
  function suivant(){
    if(frappe){ finirFrappe(); return; }
    if(bloque()){ return; }
    if(i >= etapes.length - 1){ montrerBilan(); return; }
    aller(i + 1);
  }
  function aller(n){
    if(n < 0 || n >= etapes.length){ return; }
    i = n;
    $('bilan').hidden = true;
    afficher();
  }

  function afficher(memeEtape){
    var e = etapes[i], st = etat(i);
    finirFrappe(true); taire(); clearTimeout(minuterie);
    // décor, ambiance
    if(st.decor !== decorCourant){
      decorCourant = st.decor;
      var D = window.VRT_DECORS || {}, f = D[st.decor];
      $('decor').innerHTML = f ? f() : '';
    }
    var amb = $('amb');
    amb.className = 'sc-amb' + (st.amb ? ' ' + st.amb + ' on' : '');
    amb.innerHTML = st.amb === 'orage' ? '<div class="sc-pluie"></div><div class="sc-eclair"></div>' : '';
    $('lieu').textContent = st.lieu; $('moment').textContent = st.moment;
    // accessoire
    $('objet').innerHTML = e.objet ? '<div class="sc-objet">' + ico(e.objet.i)  + esc(e.objet.lib || '') + '</div>' : '';
    // personnages
    var parle = (e.t === 'dit' || e.t === 'pense' || e.t === 'vers') ? e.qui : null;
    ordre.forEach(function(k){
      var el = $('p-' + k), etait = !!presentsAvant[k];
      el.className = 'sc-perso' + (ordre.indexOf(k) >= ordre.length / 2 ? ' face-g' : '') + (st.pr[k] ? ' present' : ' absent')
        + (st.pr[k] && !etait && !memeEtape ? ' arrive' : '')
        + (parle === k ? ' parle' + (e.t === 'pense' ? ' muet' : '') : '')
        + (parle === k && e.emo ? ' emo-' + e.emo : '')
        + (role === k ? ' toi' : '');
      var b = el.querySelector('.sc-emo'); if(b){ b.remove(); }
      if(parle === k && e.emo && EMO[e.emo]){ el.insertAdjacentHTML('afterbegin', '<span class="sc-emo" aria-hidden="true">' + ico(EMO[e.emo]) + '</span>'); }
    });
    presentsAvant = st.pr;
    // jauges
    jauges.forEach(function(j){
      var el = $('j-' + j.id); if(!el){ return; }
      var v = Math.round(st.j[j.id] || 0), b = el.querySelector('b'), ancien = +b.textContent;
      b.textContent = v;
      el.querySelector('i').style.transform = 'scaleX(' + (v / 100) + ')';
      el.classList.remove('bouge'); if(v !== ancien){ void el.offsetWidth; el.classList.add('bouge'); }
    });
    // bulle
    var h = '';
    if(e.t === 'dit' || e.t === 'pense' || e.t === 'vers'){
      var p = persos[e.qui] || {nom: e.qui || ''};
      h = '<div class="sc-bulle-qui"><b>' + esc(p.nom) + '</b>'
        + (e.t === 'pense' ? '<span class="sc-jeu">en pensée</span>' : '')
        + (e.jeu ? '<span class="sc-jeu">' + esc(e.jeu) + '</span>' : '')
        + (role && role === e.qui ? '<span class="sc-badge">À toi de lire</span>' : '') + '</div>'
        + '<div class="sc-texte' + (e.t === 'pense' ? ' pensee' : '') + (e.t === 'vers' ? ' vers' : '') + '" id="txt"' + (/^ar/.test(p.langue || S.langue || '') ? ' dir="rtl" lang="ar"' : '') + '></div>'
        + langues(e)
        + (e.cite ? '<span class="sc-cite">' + esc(e.cite) + '</span>' : '');
    } else if(e.t === 'recit'){
      h = '<div class="sc-texte recit" id="txt"></div>' + langues(e) + (e.cite ? '<span class="sc-cite">' + esc(e.cite) + '</span>' : '');
    } else if(e.t === 'remarque'){
      h = '<div class="sc-remarque"><h3 class="sc-h3">' + esc(e.titre || 'Ce que la scène montre') + '</h3><div class="sc-texte">' + esc(e.txt) + '</div></div>';
    } else if(e.t === 'question' || e.t === 'choix'){
      h = '<div><h3 class="sc-h3">' + (e.t === 'choix' ? 'Et si… ? À toi de décider' : 'Arrêt sur image') + '</h3><p class="sc-q">' + esc(e.q) + '</p><div class="sc-options">'
        + e.options.map(function(o, k){ return '<button class="sc-opt" data-k="' + k + '">' + esc(o.txt) + '</button>'; }).join('')
        + '</div><div id="retourQ"></div></div>';
    } else if(e.t === 'atelier'){
      h = '<div class="sc-atelier"><h3 class="sc-h3">' + esc(e.titre || 'Atelier') + '</h3><p class="sc-consigne">' + esc(e.consigne || '') + '</p><div id="zone"></div><div id="retourQ"></div></div>';
    }
    $('bulle').innerHTML = h;
    if(e.t === 'question' || e.t === 'choix'){ brancherQuestion(e); }
    if(e.t === 'atelier' && ATELIERS[e.mode]){ ATELIERS[e.mode](e, $('zone')); }
    if($('txt')){ taper(e.txt); }
    $('barre').style.transform = 'scaleX(' + ((i + 1) / etapes.length) + ')';
    $('compteur').textContent = (i + 1) + ' / ' + etapes.length;
    $('bPrec').disabled = i === 0;
    majSuivant();
    if(voix && !(role && e.qui === role)){ parler(e); }
    if(auto){ planifier(); }
  }
  function majSuivant(){
    $('bSuiv').disabled = bloque();
    $('bSuiv').innerHTML = (i >= etapes.length - 1 ? 'Bilan' : 'Suivant') + ico('droite');
  }
  function valider(ok, k, txt, classe){
    if(!(i in reponses)){ reponses[i] = { ok: !!ok, k: k }; }
    var r = $('retourQ');
    if(r && txt){ r.className = 'sc-retour-q' + (classe ? ' ' + classe : ''); r.innerHTML = txt; }
    afficherJauges();
    majSuivant();
    if(auto){ planifier(); }
  }

  /* ---------- Effet machine à écrire ---------- */
  function taper(txt){
    var el = $('txt'); txt = String(txt);
    if(window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches){ el.textContent = txt; taireBouche(); return; }
    var t0 = 0, vit = 60;
    frappe = { el: el, txt: txt, raf: 0 };
    function pas(ts){
      if(!frappe){ return; }
      if(!t0){ t0 = ts; }
      var n = Math.min(txt.length, Math.floor((ts - t0) / 1000 * vit));
      el.textContent = txt.slice(0, n);
      if(n < txt.length){ frappe.raf = requestAnimationFrame(pas); } else { frappe = null; taireBouche(); }
    }
    frappe.raf = requestAnimationFrame(pas);
  }
  function finirFrappe(silence){
    if(!frappe){ return; }
    cancelAnimationFrame(frappe.raf);
    if(!silence){ frappe.el.textContent = frappe.txt; taireBouche(); }
    frappe = null;
  }
  function taireBouche(){ var el = document.querySelector('.sc-perso.parle'); if(el){ el.classList.add('muet'); } }

  /* ---------- Questions et choix ---------- */
  function brancherQuestion(e){
    var boutons = document.querySelectorAll('.sc-opt');
    function montrer(k){
      var o = e.options[k];
      boutons.forEach(function(b, j){
        b.disabled = true;
        if(e.t === 'choix'){ if(j === k){ b.classList.add('choisi'); } }
        else if(e.options[j].ok){ b.classList.add('ok'); }
        else if(j === k){ b.classList.add('ko'); }
      });
      if(e.t === 'choix'){
        return '<b>Conséquence. </b>' + esc(o.consequence || '') + (e.oeuvre ? '<div class="sc-oeuvre"><b>Dans l’œuvre : </b>' + esc(e.oeuvre) + '</div>' : '');
      }
      return '<b>' + (o.ok ? 'Juste. ' : 'Pas tout à fait. ') + '</b>' + esc(o.retour || e.explication || '');
    }
    boutons.forEach(function(b){
      b.onclick = function(){
        var k = +b.getAttribute('data-k'), o = e.options[k];
        var txt = montrer(k);
        valider(e.t === 'choix' ? true : o.ok, k, txt, e.t === 'choix' ? 'neutre' : (o.ok ? '' : 'faux'));
        if(e.t === 'choix'){ afficherJauges(); }
      };
    });
    if(i in reponses){
      var t = montrer(reponses[i].k), o = e.options[reponses[i].k], r = $('retourQ');
      r.className = 'sc-retour-q' + (e.t === 'choix' ? ' neutre' : (o.ok ? '' : ' faux')); r.innerHTML = t;
    }
  }
  function afficherJauges(){
    var st = etat(i);
    jauges.forEach(function(j){
      var el = $('j-' + j.id); if(!el){ return; }
      var v = Math.round(st.j[j.id] || 0), b = el.querySelector('b');
      if(+b.textContent !== v){ el.classList.remove('bouge'); void el.offsetWidth; el.classList.add('bouge'); }
      b.textContent = v; el.querySelector('i').style.transform = 'scaleX(' + (v / 100) + ')';
    });
  }

  /* ---------- Ateliers ---------- */
  function fini(e){ return i in reponses; }
  var ATELIERS = {
    // Remettre dans l'ordre : e.items (ordre juste)
    ordre: function(e, z){
      var pris = [], essais = 0, items = e.items, tir = melange(items.map(function(_, k){ return k; }));
      if(fini(e)){ pris = items.map(function(_, k){ return k; }); }
      function rendre(etatCases){
        z.innerHTML = '<div class="sc-puces">' + tir.map(function(k){
            return '<button class="sc-puce' + (pris.indexOf(k) >= 0 ? ' prise' : '') + '" data-k="' + k + '">' + esc(items[k]) + '</button>'; }).join('') + '</div>'
          + '<div class="sc-frise">' + items.map(function(_, n){
            var k = pris[n];
            return '<div class="sc-case' + (k == null ? ' vide' : '') + (etatCases ? ' ' + etatCases[n] : '') + '" data-n="' + n + '">' + (k == null ? 'Touche une étiquette…' : esc(items[k])) + '</div>'; }).join('') + '</div>'
          + (fini(e) ? '' : '<div class="sc-actions"><button class="sc-mini or" id="aVerif">Vérifier</button><button class="sc-mini" id="aVider">Recommencer</button>' + (essais >= 2 ? '<button class="sc-mini" id="aSol">Voir la solution</button>' : '') + '</div>');
        z.querySelectorAll('.sc-puce').forEach(function(b){ b.onclick = function(){ if(pris.length < items.length){ pris.push(+b.getAttribute('data-k')); rendre(); } }; });
        z.querySelectorAll('.sc-case').forEach(function(c){ c.onclick = function(){ if(fini(e)){ return; } var n = +c.getAttribute('data-n'); if(pris[n] != null){ pris.splice(n, 1); rendre(); } }; });
        var v = $('aVerif');
        if(v){ v.onclick = function(){
          if(pris.length < items.length){ $('retourQ').className = 'sc-retour-q faux'; $('retourQ').innerHTML = '<b>Il manque des étapes. </b>Place toutes les étiquettes.'; return; }
          essais++;
          var etats = pris.map(function(k, n){ return k === n ? 'ok' : 'ko'; }), bons = etats.filter(function(s){ return s === 'ok'; }).length;
          if(bons === items.length){ rendre(etats); valider(essais === 1, 0, '<b>Bravo. </b>' + esc(e.bravo || 'L’ordre est juste.'), ''); }
          else { rendre(etats); $('retourQ').className = 'sc-retour-q faux'; $('retourQ').innerHTML = '<b>' + bons + ' / ' + items.length + ' bien placées. </b>Touche une case rouge pour la retirer, puis recommence.'; }
        }; }
        var vd = $('aVider'); if(vd){ vd.onclick = function(){ pris = []; rendre(); }; }
        var so = $('aSol'); if(so){ so.onclick = function(){ pris = items.map(function(_, k){ return k; }); rendre(items.map(function(){ return 'ok'; })); valider(false, 0, '<b>Solution. </b>' + esc(e.bravo || ''), 'neutre'); }; }
      }
      rendre(fini(e) ? items.map(function(){ return 'ok'; }) : null);
    },
    // Classer : e.cats [..], e.items [{txt, cat}]
    tri: function(e, z){
      var choix = {};
      if(fini(e)){ e.items.forEach(function(it, k){ choix[k] = it.cat; }); }
      function rendre(corr){
        z.innerHTML = '<div class="sc-tri">' + e.items.map(function(it, k){
            var c = corr ? (choix[k] === it.cat ? ' ok' : ' ko') : '';
            return '<div class="sc-tri-l' + c + '"><span>' + esc(it.txt) + '</span>' + e.cats.map(function(cat, n){
              return '<button class="sc-mini' + (choix[k] === n ? ' sel' : '') + '" data-k="' + k + '" data-n="' + n + '">' + esc(cat) + '</button>'; }).join('') + '</div>'; }).join('') + '</div>'
          + (fini(e) ? '' : '<div class="sc-actions"><button class="sc-mini or" id="aVerif">Vérifier</button></div>');
        z.querySelectorAll('.sc-tri-l .sc-mini').forEach(function(b){ b.onclick = function(){ if(fini(e)){ return; } choix[b.getAttribute('data-k')] = +b.getAttribute('data-n'); rendre(); }; });
        var v = $('aVerif');
        if(v){ v.onclick = function(){
          var n = Object.keys(choix).length, bons = e.items.filter(function(it, k){ return choix[k] === it.cat; }).length;
          if(n < e.items.length){ $('retourQ').className = 'sc-retour-q faux'; $('retourQ').innerHTML = '<b>Classe toutes les phrases. </b>'; return; }
          rendre(true);
          if(bons === e.items.length){ valider(!e._essai, 0, '<b>Bravo. </b>' + esc(e.bravo || ''), ''); }
          else { e._essai = true; $('retourQ').className = 'sc-retour-q faux'; $('retourQ').innerHTML = '<b>' + bons + ' / ' + e.items.length + '. </b>Corrige les lignes en rouge.'; }
        }; }
      }
      rendre(fini(e));
    },
    // Payer une somme : e.cible, e.pieces [valeurs], e.devise
    monnaie: function(e, z){
      var tas = [];
      function total(){ return tas.reduce(function(a, b){ return a + b; }, 0); }
      function rendre(){
        z.innerHTML = '<div class="sc-caisse"><span>' + esc(e.libelle || 'Tu donnes') + '</span><b>' + total() + ' ' + esc(e.devise || 'F') + '</b></div>'
          + '<div class="sc-pieces">' + e.pieces.map(function(v){ return '<button class="sc-piece' + (v >= 500 && e.billets ? ' billet' : '') + '" data-v="' + v + '" aria-label="' + v + '">' + v + '</button>'; }).join('') + '</div>'
          + '<div class="sc-plateau-pieces">' + tas.map(function(v){ return '<span>' + v + '</span>'; }).join('') + '</div>'
          + (fini(e) ? '' : '<div class="sc-actions"><button class="sc-mini or" id="aVerif">Payer</button><button class="sc-mini" id="aVider">Reprendre</button></div>');
        z.querySelectorAll('.sc-piece').forEach(function(b){ b.onclick = function(){ if(fini(e)){ return; } tas.push(+b.getAttribute('data-v')); rendre(); }; });
        var v = $('aVerif');
        if(v){ v.onclick = function(){
          var t = total();
          if(t === e.cible){ valider(!e._essai, 0, '<b>Exact. </b>' + esc(e.bravo || ''), ''); rendre(); }
          else { e._essai = true; $('retourQ').className = 'sc-retour-q faux'; $('retourQ').innerHTML = '<b>' + (t > e.cible ? 'Trop : ' : 'Pas assez : ') + t + ' ' + esc(e.devise || 'F') + '. </b>' + esc(e.aide || ''); }
        }; }
        var vd = $('aVider'); if(vd){ vd.onclick = function(){ tas = []; rendre(); }; }
      }
      if(fini(e)){ tas = [e.cible]; }
      rendre();
    },
    // Suivre un itinéraire : e.plan (lignes de texte : # mur, . couloir, B but, D départ, lettres = salles)
    chemin: function(e, z){
      function libCommande(t){ return String(t).replace(/[\u2190-\u21FF\u2794-\u27BF\u2B00-\u2BFF]\uFE0F?/g, '').trim(); }
      var P = e.plan, H = P.length, W = P[0].length, C = 40, x, y, dir = e.dir || 0; // 0 N, 1 E, 2 S, 3 O
      var bx, by, DX = [0, 1, 0, -1], DY = [-1, 0, 1, 0];
      P.forEach(function(l, r){ for(var c = 0; c < W; c++){ if(l[c] === 'D'){ x = c; y = r; } if(l[c] === 'B'){ bx = c; by = r; } } });
      var x0 = x, y0 = y, d0 = dir;
      // Une lettre étiquetée (hors D et B) est une salle : on ne la traverse pas.
      function salle(ch){ return ch !== 'B' && ch !== 'D' && !!(e.etiquettes && e.etiquettes[ch]); }
      function libre(c, r){ return r >= 0 && r < H && c >= 0 && c < W && P[r][c] !== '#' && !salle(P[r][c]); }
      function dessin(){
        var s = '<svg class="sc-carte" viewBox="0 0 ' + (W * C) + ' ' + (H * C) + '" role="img" aria-label="Plan">', vu = {};
        P.forEach(function(l, r){ for(var c = 0; c < W; c++){
          var ch = l[c], X = c * C, Y = r * C;
          if(ch === '#'){ s += '<rect x="' + X + '" y="' + Y + '" width="' + C + '" height="' + C + '" fill="#142554"/>'; }
          else if(salle(ch)){ s += '<rect x="' + X + '" y="' + Y + '" width="' + C + '" height="' + C + '" fill="#4C6FBF"/>'; }
          else { s += '<rect x="' + X + '" y="' + Y + '" width="' + C + '" height="' + C + '" fill="' + (ch === 'B' ? '#FFC93C' : '#F4F6FB') + '" stroke="#DDE3EF"/>'; }
        } });
        P.forEach(function(l, r){ for(var c = 0; c < W; c++){
          var ch = l[c];
          if(e.etiquettes && e.etiquettes[ch] && !vu[ch]){
            vu[ch] = 1;
            var n = 1; while(c + n < W && l[c + n] === ch){ n++; }
            s += '<text x="' + ((c + n / 2) * C) + '" y="' + (r * C + C / 2 + 4) + '" text-anchor="middle" font-size="10" font-weight="700" fill="' + (salle(ch) ? '#fff' : '#142554') + '">' + esc(e.etiquettes[ch]) + '</text>';
          }
        } });
        s += '<g class="pion" id="pion" style="transform:translate(' + (x * C + C / 2) + 'px,' + (y * C + C / 2) + 'px)"><g id="pionR" style="transform:rotate(' + (dir * 90) + 'deg);transition:transform .35s"><circle r="13" fill="#C2551F" stroke="#fff" stroke-width="3"/><path d="M0 -9 L6 3 L-6 3 Z" fill="#fff"/></g></g></svg>';
        return s;
      }
      function rendre(){
        z.innerHTML = dessin() + (fini(e) ? '' : '<div class="sc-actions">' + e.commandes.map(function(c, k){ return '<button class="sc-mini' + (k === 0 ? ' or' : '') + '" data-a="' + c.act + '">' + ico({ avance: 'haut', gauche: 'gauche', droite: 'droite' }[c.act]) + esc(libCommande(c.lib)) + '</button>'; }).join('') + '<button class="sc-mini" id="aVider">' + ico('rejouer') + 'Départ</button></div>');
        z.querySelectorAll('[data-a]').forEach(function(b){ b.onclick = function(){ agir(b.getAttribute('data-a')); }; });
        var vd = $('aVider'); if(vd){ vd.onclick = function(){ x = x0; y = y0; dir = d0; e._essai = true; rendre(); }; }
      }
      function agir(a){
        if(a === 'gauche'){ dir = (dir + 3) % 4; }
        else if(a === 'droite'){ dir = (dir + 1) % 4; }
        else if(a === 'avance'){
          var nx = x + DX[dir], ny = y + DY[dir];
          if(libre(nx, ny)){ x = nx; y = ny; } else { $('retourQ').className = 'sc-retour-q faux'; $('retourQ').innerHTML = '<b>' + esc(e.mur || 'Un mur !') + '</b>'; }
        }
        $('pion').style.transform = 'translate(' + (x * C + C / 2) + 'px,' + (y * C + C / 2) + 'px)';
        $('pionR').style.transform = 'rotate(' + (dir * 90) + 'deg)';
        if(x === bx && y === by){ valider(!e._essai, 0, '<b>' + esc(e.bravo || 'Arrivé !') + '</b>', ''); setTimeout(rendre, 500); }
      }
      if(fini(e)){ x = bx; y = by; }
      rendre();
    },
    // Voter : e.options, e.classe (voix des autres)
    vote: function(e, z){
      function rendre(k){
        var voix = e.classe.slice(); if(k != null){ voix[k]++; }
        var tot = voix.reduce(function(a, b){ return a + b; }, 0), max = Math.max.apply(null, voix);
        z.innerHTML = '<div class="sc-options">' + e.options.map(function(o, n){ return '<button class="sc-opt' + (k === n ? ' choisi' : '') + '" data-k="' + n + '"' + (k != null ? ' disabled' : '') + '>' + esc(o) + '</button>'; }).join('') + '</div>'
          + (k != null ? '<div class="sc-urne">' + e.options.map(function(o, n){ return '<div class="sc-urne-l">' + esc(o) + ' — <b>' + voix[n] + ' voix</b>' + (voix[n] === max ? ' ' + ico('fier') : '') + '<div class="sc-urne-t"><i data-v="' + (voix[n] / tot) + '"></i></div></div>'; }).join('') + '</div>' : '');
        z.querySelectorAll('.sc-opt').forEach(function(b){ b.onclick = function(){ var n = +b.getAttribute('data-k'); rendre(n); valider(true, n, '<b>Résultat. </b>' + esc(e.bilan || ''), 'neutre'); }; });
        requestAnimationFrame(function(){ requestAnimationFrame(function(){ z.querySelectorAll('.sc-urne-t i').forEach(function(b){ b.style.transform = 'scaleX(' + b.getAttribute('data-v') + ')'; }); }); });
      }
      rendre(fini(e) ? reponses[i].k : null);
    },
    // Balance d'arguments : e.cotes [g, d], e.args [{txt, cote, poids}]
    balance: function(e, z){
      var pose = {};
      if(fini(e)){ e.args.forEach(function(a, k){ pose[k] = a.cote; }); }
      function poids(c){ var s = 0; e.args.forEach(function(a, k){ if(pose[k] === c){ s += (a.poids || 1); } }); return s; }
      function rendre(corr){
        var g = poids(0), d = poids(1), ang = Math.max(-14, Math.min(14, (d - g) * 4));
        var rad = ang * Math.PI / 180, dyG = -Math.sin(rad) * 150, dyD = Math.sin(rad) * 150;
        z.innerHTML = '<svg class="sc-balance" viewBox="0 0 440 200" aria-hidden="true">'
          + '<rect x="212" y="60" width="16" height="120" rx="4" fill="#142554"/><rect x="160" y="176" width="120" height="12" rx="6" fill="#142554"/>'
          + '<g class="fleau" style="transform:rotate(' + ang + 'deg)"><rect x="60" y="55" width="320" height="10" rx="5" fill="#C9982E"/></g>'
          + '<circle cx="220" cy="60" r="10" fill="#FFC93C"/>'
          + '<g class="plat" style="transform:translateY(' + dyG + 'px)"><path d="M70 64 L50 120 M70 64 L90 120" stroke="#8a7a50" stroke-width="2"/><path d="M36 120 L104 120 Q70 150 36 120 Z" fill="#FFC93C"/><text x="70" y="168" text-anchor="middle" font-size="14" font-weight="700" fill="currentColor">' + esc(e.cotes[0]) + ' · ' + g + '</text></g>'
          + '<g class="plat" style="transform:translateY(' + dyD + 'px)"><path d="M370 64 L350 120 M370 64 L390 120" stroke="#8a7a50" stroke-width="2"/><path d="M336 120 L404 120 Q370 150 336 120 Z" fill="#FFC93C"/><text x="370" y="168" text-anchor="middle" font-size="14" font-weight="700" fill="currentColor">' + esc(e.cotes[1]) + ' · ' + d + '</text></g>'
          + '</svg><div class="sc-tri">' + e.args.map(function(a, k){
            var c = corr ? (pose[k] === a.cote ? ' ok' : ' ko') : '';
            return '<div class="sc-tri-l' + c + '"><span>' + esc(a.txt) + '</span>' + e.cotes.map(function(cote, n){ return '<button class="sc-mini' + (pose[k] === n ? ' sel' : '') + '" data-k="' + k + '" data-n="' + n + '">' + esc(cote) + '</button>'; }).join('') + '</div>'; }).join('') + '</div>'
          + (fini(e) ? '' : '<div class="sc-actions"><button class="sc-mini or" id="aVerif">Vérifier</button></div>');
        z.querySelectorAll('.sc-tri-l .sc-mini').forEach(function(b){ b.onclick = function(){ if(fini(e)){ return; } pose[b.getAttribute('data-k')] = +b.getAttribute('data-n'); rendre(); }; });
        var v = $('aVerif');
        if(v){ v.onclick = function(){
          if(Object.keys(pose).length < e.args.length){ $('retourQ').className = 'sc-retour-q faux'; $('retourQ').innerHTML = '<b>Place tous les arguments sur la balance.</b>'; return; }
          var bons = e.args.filter(function(a, k){ return pose[k] === a.cote; }).length;
          rendre(true);
          if(bons === e.args.length){ valider(!e._essai, 0, '<b>Bravo. </b>' + esc(e.bravo || ''), ''); }
          else { e._essai = true; $('retourQ').className = 'sc-retour-q faux'; $('retourQ').innerHTML = '<b>' + bons + ' / ' + e.args.length + '. </b>Corrige les lignes en rouge.'; }
        }; }
      }
      rendre(fini(e));
    }
  };

  // Scènes de langue : prononciation (pinyin, translittération) et traduction repliée, pour chercher le sens avant de le lire
  function langues(e){
    return (e.pron ? '<div class="sc-pron">' + esc(e.pron) + '</div>' : '')
      + (e.trad ? '<details class="sc-trad"><summary>Traduction</summary><p>' + esc(e.trad) + '</p></details>' : '');
  }

  /* ---------- Voix et défilement ---------- */
  /* Voix alternées : chaque personnage reçoit sa voix, déduite de son allure (femme ou homme, aîné, élève),
     et sa hauteur propre, pour rester reconnaissable même quand l'appareil n'a qu'une voix installée.
     p.voix = 'f' | 'h' et p.age = 'jeune' | 'adulte' | 'aine' forcent le choix. Le récit a sa voix à lui. */
  var VOIX_F = /hortense|julie|denise|eloise|brigitte|coralie|jacqueline|josephine|amelie|amélie|sylvie|vivienne|celeste|céleste|yvette|ariane|charline|audrey|aurelie|aurélie|marie|virginie|zira|hazel|susan|sonia|libby|maisie|mia|aria|jenny|samantha|karen|serena|emma|ava|hedda|katja|amala|seraphina|helena|laura|elvira|sabina|paulina|monica|female|femme|woman/i;
  var VOIX_H = /paul|henri|claude|remy|rémy|jerome|jérôme|alain|yves|antoine|fabrice|maurice|gerard|gérard|guillaume|nicolas|mathieu|david|mark|george|ryan|guy|thomas|daniel|alex|stefan|conrad|killian|pablo|alvaro|álvaro|raul|raúl|jorge|\bmale|homme|\bman\b/i;
  var voixAttrib = {}, tourVoix = 0;
  function profilVoix(p){
    var L = p.look || {}, g = p.voix === 'f' || p.voix === 'h' ? p.voix : null;
    if(!g){
      g = /^(La |Mme|Madame|Mère|Grand-mère|Tante|Reine|Princesse|Sœur|Mademoiselle|Mlle|Frau)/i.test(p.nom || '')
        || L.tenue === 'robe' || L.tenue === 'jupe' || /^(chignon|tresses|queue)$/.test(L.cheveux || '') || /^(foulard|voile)$/.test(L.coiffe || '') ? 'f' : 'h';
    }
    var age = p.age || (L.vieux ? 'aine' : (L.metier === 'eleve' || /élève|lycéen|apprenti|jeunes filles|frérot|\b1\d ans\b/i.test(p.nom || '')) ? 'jeune' : 'adulte');
    return { g: g, age: age };
  }
  function voixDispo(lang){
    var pre = String(lang).slice(0, 2).toLowerCase();
    return speechSynthesis.getVoices().filter(function(v){ return String(v.lang).toLowerCase().replace('_', '-').indexOf(pre) === 0; });
  }
  function reglerVoix(cle, p, lang){
    // une attribution par personnage et par langue, stable pendant toute la scène
    var k = cle + '|' + lang;
    if(voixAttrib[k]){ return voixAttrib[k]; }
    var toutes = voixDispo(lang);
    var r = { voix: null, pitch: 1, rate: S.debit || 0.95 };
    if(cle === '_recit'){
      // le récit : une voix posée, de préférence une que les personnages n'utilisent pas
      r.voix = toutes.filter(function(v){ return !VOIX_F.test(v.name) && VOIX_H.test(v.name); })[0] || toutes[0] || null;
      r.pitch = 0.95; r.rate = (S.debit || 0.95) - 0.03;
    } else {
      var pr = profilVoix(p), rang = ordre.indexOf(cle);
      var meme = toutes.filter(function(v){ return pr.g === 'f' ? VOIX_F.test(v.name) : VOIX_H.test(v.name); });
      var pool = meme.length ? meme : toutes;
      // deux personnages du même genre prennent deux voix différentes quand l'appareil en a plusieurs
      var memesAvant = ordre.slice(0, Math.max(rang, 0)).filter(function(c){ return profilVoix(persos[c]).g === pr.g; }).length;
      r.voix = pool.length ? pool[memesAvant % pool.length] : null;
      var base = pr.g === 'f' ? (meme.length ? 1.05 : 1.3) : (meme.length ? 0.95 : 0.75);
      if(pr.age === 'aine'){ base -= 0.12; r.rate -= 0.07; }
      if(pr.age === 'jeune'){ base += 0.15; r.rate += 0.05; }
      // un léger écart propre à chacun : deux voix identiques restent distinctes à l'oreille
      base += ((memesAvant % 3) - 1) * 0.08;
      r.pitch = Math.max(0.4, Math.min(1.8, base));
    }
    voixAttrib[k] = r;
    return r;
  }
  if('speechSynthesis' in window && speechSynthesis.addEventListener){
    speechSynthesis.addEventListener('voiceschanged', function(){ voixAttrib = {}; });
  }
  function parler(e){
    if(!voix || !e || !('speechSynthesis' in window)){ return; }
    var t = e.t === 'question' || e.t === 'choix' ? e.q : (e.t === 'atelier' ? e.consigne : e.txt);
    if(!t){ return; }
    var u = new SpeechSynthesisUtterance(t);
    var parole = e.t === 'dit' && e.qui && persos[e.qui];
    u.lang = (e.t === 'question' || e.t === 'choix' || e.t === 'atelier' || e.t === 'remarque') ? (S.langueConsignes || 'fr-FR')
      : e.t === 'recit' ? (S.langueRecit || S.langue || 'fr-FR')
      : ((e.qui && persos[e.qui] && persos[e.qui].langue) || S.langue || 'fr-FR');
    var r = reglerVoix(parole ? e.qui : '_recit', parole ? persos[e.qui] : null, u.lang);
    if(r.voix){ u.voice = r.voix; }
    u.pitch = r.pitch; u.rate = r.rate;
    var tour = ++tourVoix, etape = i;
    // en défilement automatique, on passe à la suite à la fin de la réplique, pas au bout d'un minuteur
    u.onend = function(){ if(tour === tourVoix && auto && etape === i){ clearTimeout(minuterie); minuterie = setTimeout(function(){ if(auto && etape === i && !bloque()){ suivant(); } }, 700); } };
    speechSynthesis.cancel(); speechSynthesis.speak(u);
  }
  function taire(){ tourVoix++; if('speechSynthesis' in window){ speechSynthesis.cancel(); } }
  function planifier(){
    clearTimeout(minuterie);
    if(bloque()){ return; }
    var e = etapes[i], mots = String(e.txt || e.q || '').split(/\s+/).length;
    var lu = voix && 'speechSynthesis' in window && !(role && e.qui === role);
    // voix active : la fin de la réplique fait avancer ; ce minuteur long n'est qu'un filet si elle ne se signale pas
    minuterie = setTimeout(function(){ if(auto){ suivant(); } }, lu ? Math.max(9000, mots * 900) : Math.max(2800, mots * 430));
  }

  /* ---------- Bilan ---------- */
  function montrerBilan(){
    taire(); clearTimeout(minuterie); auto = false; marquer($('bAuto'), false);
    var notes = etapes.map(function(e, k){ return (e.t === 'question' || (e.t === 'atelier' && e.mode !== 'vote')) ? k : -1; }).filter(function(k){ return k >= 0; });
    var bons = notes.filter(function(k){ return reponses[k] && reponses[k].ok; }).length;
    var pct = notes.length ? Math.round(bons / notes.length * 100) : 100;
    var titre = pct >= 85 ? 'Lecteur d’or' : pct >= 60 ? 'Lecteur attentif' : 'En chemin';
    var B = S.bilan || {};
    var h = '<h2>Bilan de la scène</h2>'
      + (notes.length ? '<div class="sc-medaille"><div class="rond">' + pct + '%</div><p><b>' + titre + '</b><br>' + bons + ' réussite' + (bons > 1 ? 's' : '') + ' du premier coup sur ' + notes.length + ' arrêts sur image et ateliers.</p></div>' : '')
      + (B.retenir && B.retenir.length ? '<h3 class="sc-h3">À retenir</h3><ul>' + B.retenir.map(function(r){ return '<li>' + esc(r) + '</li>'; }).join('') + '</ul>' : '')
      + (B.ecrire ? '<h3 class="sc-h3">À toi d’écrire</h3><p class="sc-objectif">' + esc(B.ecrire) + '</p>'
          + '<textarea id="redac" placeholder="Écris ici. Ton texte reste sur cet appareil."></textarea><div class="sc-note-enr" id="noteEnr"></div>' : '')
      + '<div class="sc-cmd" style="margin-top:12px"><button class="sc-btn" id="bRejouer">' + ico('rejouer') + 'Rejouer</button>'
      + '<a class="sc-btn principal" href="index.html" style="text-decoration:none">Autres scènes' + ico('droite') + '</a></div>';
    var bl = $('bilan');
    bl.innerHTML = h; bl.hidden = false;
    bl.scrollIntoView({ behavior: 'smooth', block: 'start' });
    $('bRejouer').onclick = function(){ reponses = {}; etapes.forEach(function(e){ delete e._essai; }); presentsAvant = {}; aller(0); window.scrollTo({ top: 0, behavior: 'smooth' }); };
    var ta = $('redac');
    if(ta){
      ta.value = lire(cle()) || '';
      var t;
      ta.oninput = function(){
        clearTimeout(t);
        t = setTimeout(function(){ $('noteEnr').textContent = ecrire(cle(), ta.value) ? 'Enregistré sur cet appareil.' : 'Impossible d’enregistrer ici : copie ton texte avant de quitter.'; }, 500);
      };
    }
  }

  /* ---------- Laboratoire (simulation libre) ----------
   * S.labo = { titre, intro, persos:[clés], curseurs:[{id, nom, val, bas, haut, lecture:{bas, milieu, haut}}],
   *   scenarios:[{nom, icone, valeurs}] (le premier = « comme dans l'œuvre »),
   *   liens:[{a, b, type, lib, base, poids:{id: coef}}],
   *   issue: function(v) → {niveau:'ok'|'moyen'|'ko', badge, recit, apres, themes:[…]} } */
  var COUL_LIEN = { confiance:'#D99A00', amour:'#D6336C', conflit:'#D43F2E', domination:'#7B5CD6', alliance:'#1F9D5B', peur:'#E07B39' };
  var LABO = {
    v: null, cote: false, pret: false,
    ouvrir: function(){
      var L = S.labo; if(!L){ return; }
      if(!this.pret){ this.v = this.depart(); this.construire(); this.pret = true; }
      this.maj();
    },
    depart: function(){ var v = {}; S.labo.curseurs.forEach(function(c){ v[c.id] = c.val; }); return v; },
    construire: function(){
      var L = S.labo, self = this;
      var keys = L.persos || ordre;
      $('vueLabo').innerHTML =
        '<div class="sc-labo-tete"><h2>' + esc(L.titre || 'Laboratoire des personnages') + '</h2><p>' + esc(L.intro || '') + '</p>'
        + '<ol class="sc-etapes-l"><li>Choisis un scénario</li><li>Bouge les curseurs</li><li>Lis ce qui change dans l’histoire</li></ol>'
        + '<div class="sc-scenarios">' + (L.scenarios || []).map(function(s, k){ return '<button class="sc-scen" data-k="' + k + '">' + (s.icone ? ico(s.icone) : '') + esc(s.nom) + '</button>'; }).join('') + '</div></div>'
        + '<div class="sc-labo-grille">'
        +   '<div class="sc-l-col"><h3 class="sc-h3">Réglages <button class="sc-lien" id="lReset">' + ico('rejouer') + 'Réinitialiser</button></h3>'
        +     L.curseurs.map(function(c){
                return '<div class="sc-curseur"><div class="sc-c-l"><b>' + esc(c.nom) + '</b><output id="o-' + esc(c.id) + '"></output></div>'
                  + '<input type="range" min="0" max="100" step="1" id="r-' + esc(c.id) + '" aria-label="' + esc(c.nom) + '">'
                  + '<div class="sc-c-b"><span>' + esc(c.bas || '') + '</span><span>' + esc(c.haut || '') + '</span></div></div>';
              }).join('')
        +   '</div>'
        +   '<div class="sc-l-col sc-l-centre"><div class="sc-l-badge" id="lBadge"></div>'
        +     '<svg class="sc-reseau" id="lRes" viewBox="0 0 420 330" role="img" aria-label="Réseau des personnages"></svg>'
        +     '<div class="sc-legende">' + Object.keys(COUL_LIEN).filter(function(t){ return (L.liens || []).some(function(l){ return l.type === t; }); }).map(function(t){ return '<span><i style="background:' + COUL_LIEN[t] + '"></i>' + esc({ confiance:'confiance', amour:'amour', conflit:'conflit', domination:'domination', alliance:'alliance', peur:'peur' }[t]) + '</span>'; }).join('') + '</div>'
        +     '<button class="sc-mini" id="lCote" aria-pressed="false">' + ico('comparer') + 'Côte à côte avec l’œuvre</button><div id="lCoteZ"></div>'
        +   '</div>'
        +   '<div class="sc-l-col"><h3 class="sc-h3">Ce qui se passe</h3><div id="lIssue"></div><h3 class="sc-h3">Lecture des réglages</h3><div id="lLect"></div><h3 class="sc-h3">Et après ?</h3><p class="sc-l-apres" id="lApres"></p></div>'
        + '</div>';
      // positions des personnages sur une ellipse
      var n = keys.length, svgP = '';
      this.pos = {};
      keys.forEach(function(k, j){
        var ang = -Math.PI / 2 + j * 2 * Math.PI / n;
        self.pos[k] = { x: 210 + Math.cos(ang) * 150, y: 165 + Math.sin(ang) * 115 };
      });
      var liens = (L.liens || []).map(function(l, j){
        var a = self.pos[l.a], b = self.pos[l.b]; if(!a || !b){ return ''; }
        return '<line id="lk' + j + '" x1="' + a.x + '" y1="' + a.y + '" x2="' + b.x + '" y2="' + b.y + '" stroke="' + COUL_LIEN[l.type || 'confiance'] + '" stroke-linecap="round"/>'
          + '<text id="lt' + j + '" x="' + ((a.x + b.x) / 2) + '" y="' + ((a.y + b.y) / 2 - 6) + '" text-anchor="middle" class="sc-l-lib">' + esc(l.lib || '') + '</text>';
      }).join('');
      keys.forEach(function(k){
        var p = persos[k], q = self.pos[k]; if(!p){ return; }
        svgP += '<g class="sc-noeud" id="nd-' + esc(k) + '" style="transform:translate(' + q.x + 'px,' + q.y + 'px)"><circle r="33" fill="' + esc(p.couleur || '#1E499B') + '"/>'
          + (p.look || p.groupe ? avatar(Object.assign({}, p, { _k: 'l' + k })).replace('<svg ', '<svg x="-31" y="-31" width="62" height="62" ')
              : '<text y="8" text-anchor="middle" class="sc-l-init">' + esc(p.init || initiales(p.nom)) + '</text>')
          + '<text y="50" text-anchor="middle" class="sc-l-nom">' + esc(p.nom.split(',')[0]) + '</text></g>';
      });
      $('lRes').innerHTML = liens + svgP;
      L.curseurs.forEach(function(c){
        var r = $('r-' + c.id);
        r.oninput = function(){ self.v[c.id] = +r.value; self.marquerScen(-1); self.maj(); };
      });
      document.querySelectorAll('.sc-scen').forEach(function(b){
        b.onclick = function(){ var s = L.scenarios[+b.getAttribute('data-k')]; self.v = self.depart(); /* chaque scénario repart des réglages de départ */ for(var id in s.valeurs){ self.v[id] = s.valeurs[id]; } self.marquerScen(+b.getAttribute('data-k')); self.maj(); };
      });
      $('lReset').onclick = function(){ self.v = self.depart(); self.marquerScen(-1); self.maj(); };
      $('lCote').onclick = function(){ self.cote = !self.cote; marquer(this, self.cote); self.maj(); };
    },
    marquerScen: function(k){ document.querySelectorAll('.sc-scen').forEach(function(b, j){ b.classList.toggle('on', j === k); }); },
    force: function(l, v){
      var f = l.base == null ? .5 : l.base;
      for(var id in (l.poids || {})){ f += l.poids[id] * ((v[id] || 0) / 100); }
      return Math.max(0, Math.min(1, f));
    },
    maj: function(){
      var L = S.labo, v = this.v, self = this;
      L.curseurs.forEach(function(c){
        $('r-' + c.id).value = v[c.id];
        $('o-' + c.id).textContent = v[c.id];
        $('r-' + c.id).style.setProperty('--p', v[c.id] + '%');
      });
      (L.liens || []).forEach(function(l, j){
        var f = self.force(l, v), ln = $('lk' + j), tx = $('lt' + j);
        if(!ln){ return; }
        ln.setAttribute('stroke-width', (1 + f * 10).toFixed(1));
        ln.setAttribute('opacity', (.12 + f * .88).toFixed(2));
        if(tx){ tx.setAttribute('opacity', f > .35 ? 1 : 0); }
      });
      var is = L.issue(v) || {};
      var b = $('lBadge');
      b.className = 'sc-l-badge ' + (is.niveau || 'moyen');
      b.textContent = is.badge || '';
      b.classList.remove('pulse'); void b.offsetWidth; b.classList.add('pulse');
      $('lIssue').innerHTML = '<p class="sc-l-recit">' + esc(is.recit || '') + '</p>'
        + (is.themes && is.themes.length ? '<div class="sc-l-themes">' + is.themes.map(function(t){ return '<span>' + esc(t) + '</span>'; }).join('') + '</div>' : '');
      $('lLect').innerHTML = L.curseurs.filter(function(c){ return c.lecture; }).map(function(c){
        var x = v[c.id], t = x >= 65 ? c.lecture.haut : x <= 35 ? c.lecture.bas : (c.lecture.milieu || '');
        return t ? '<div class="sc-l-carte"><b>' + esc(c.nom) + ' · ' + x + '</b><p>' + esc(t) + '</p></div>' : '';
      }).join('');
      $('lApres').textContent = is.apres || '';
      // côte à côte
      var z = $('lCoteZ');
      if(this.cote && L.scenarios && L.scenarios[0]){
        var ref = Object.assign(this.depart(), L.scenarios[0].valeurs), r = L.issue(ref) || {};
        // même issue : on ne répète pas deux fois le même texte
        z.innerHTML = r.badge === is.badge
          ? '<div class="sc-cote"><div class="pareil"><h4>Dans l’œuvre et dans ton scénario</h4><span class="sc-l-badge ' + (r.niveau || 'moyen') + '">' + esc(r.badge || '') + '</span><p>Même issue que dans l’œuvre. Bouge un curseur ou choisis un « Et si… ? » pour voir une autre histoire.</p></div></div>'
          : '<div class="sc-cote"><div><h4>Dans l’œuvre</h4><span class="sc-l-badge ' + (r.niveau || 'moyen') + '">' + esc(r.badge || '') + '</span><p>' + esc(r.recit || '') + '</p></div>'
            + '<div><h4>Ton scénario</h4><span class="sc-l-badge ' + (is.niveau || 'moyen') + '">' + esc(is.badge || '') + '</span><p>' + esc(is.recit || '') + '</p></div></div>';
      } else { z.innerHTML = ''; }
    }
  };

  /* ---------- Quiz et guide (fenêtres) ---------- */
  function questionsQuiz(){
    if(S.quiz && S.quiz.length){ return S.quiz; }
    return etapes.filter(function(e){ return e.t === 'question'; }).map(function(e){ return { q: e.q, options: e.options }; });
  }
  function ouvrirModal(quoi){
    var c = $('modalC');
    if(quoi === 'guide'){
      c.innerHTML = '<h2 id="modalT">Mode d’emploi</h2>'
        + '<ol class="sc-guide"><li><b>' + ico('scene') + 'La scène</b> se joue réplique après réplique : « Suivant », la flèche → ou la barre d’espace. Les personnages entrent, réagissent, et les <b>jauges</b> évoluent avec l’histoire.</li>'
        + '<li><b>Arrêts sur image</b> et <b>ateliers</b> (remettre dans l’ordre, classer, peser des arguments…) bloquent la suite jusqu’à ta réponse.</li>'
        + '<li><b>Et si… ?</b> Tu décides à la place d’un personnage, tu vois la conséquence, puis ce qui se passe vraiment dans l’œuvre.</li>'
        + (S.labo ? '<li><b>' + ico('labo') + 'Le laboratoire</b> : règle les traits des personnages avec les curseurs ; le réseau des relations, l’issue et l’analyse changent en direct. Essaie les scénarios tout prêts et compare « côte à côte » avec l’œuvre.</li>' : '')
        + '<li><b>' + ico('quiz') + 'Le quiz</b> : cinq questions pour vérifier ce que tu as retenu.</li>'
        + '<li><b>En classe</b> : « Jouer un rôle » désigne un élève pour lire les répliques d’un personnage  ; le bouton « Lire » lit le texte à voix haute.</li></ol>'
        + (S.guide ? '<p class="sc-objectif">' + esc(S.guide) + '</p>' : '')
        + '<p class="sc-avert">' + esc(S.avertissement || (S.oeuvre ? AVERT_OEUVRE : AVERT_LIBRE)) + '</p>'
        + '<button class="sc-btn principal" id="mOk">J’ai compris</button>';
      $('modal').hidden = false; $('mOk').onclick = fermerModal; $('mOk').focus();
      return;
    }
    var Q = questionsQuiz(), k = 0, bons = 0;
    function poser(){
      if(k >= Q.length){
        c.innerHTML = '<h2 id="modalT">Résultat du quiz</h2><div class="sc-medaille"><div class="rond">' + bons + '/' + Q.length + '</div><p><b>' + (bons === Q.length ? 'Sans faute !' : bons >= Q.length / 2 ? 'Bien joué.' : 'Rejoue la scène et réessaie.') + '</b></p></div>'
          + '<div class="sc-actions"><button class="sc-mini or" id="mRe">' + ico('rejouer') + 'Recommencer</button><button class="sc-mini" id="mFin">Fermer</button></div>';
        $('mRe').onclick = function(){ k = 0; bons = 0; poser(); }; $('mFin').onclick = fermerModal;
        return;
      }
      var q = Q[k];
      c.innerHTML = '<h2 id="modalT">Quiz · question ' + (k + 1) + ' / ' + Q.length + '</h2><p class="sc-q">' + esc(q.q) + '</p><div class="sc-options">'
        + q.options.map(function(o, j){ return '<button class="sc-opt" data-j="' + j + '">' + esc(o.txt) + '</button>'; }).join('') + '</div><div id="mRet"></div>';
      c.querySelectorAll('.sc-opt').forEach(function(b){
        b.onclick = function(){
          var j = +b.getAttribute('data-j'), o = q.options[j];
          if(o.ok){ bons++; }
          c.querySelectorAll('.sc-opt').forEach(function(x, n){ x.disabled = true; if(q.options[n].ok){ x.classList.add('ok'); } else if(n === j){ x.classList.add('ko'); } });
          $('mRet').innerHTML = '<div class="sc-retour-q' + (o.ok ? '' : ' faux') + '"><b>' + (o.ok ? 'Juste. ' : 'Non. ') + '</b>' + esc(o.retour || '') + '</div><div class="sc-actions"><button class="sc-mini or" id="mSuiv">' + (k + 1 < Q.length ? 'Question suivante' : 'Voir le résultat') + ico('droite') + '</button></div>';
          $('mSuiv').onclick = function(){ k++; poser(); }; $('mSuiv').focus();
        };
      });
    }
    poser();
    $('modal').hidden = false;
  }
  function fermerModal(){ $('modal').hidden = true; }

  window.VRT_PERSO = { iso: iso, avatar: avatar, icone: ico };
  if(window.VRT_SANS_SCENE){ return; }
  construire();
  aller(0);
})();
