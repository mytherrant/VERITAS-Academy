/* Scènes vivantes — décors animés (SVG, 800 × 260).
 * Animations par classes .an-* (transform / opacity seulement, voir scene.css). */
(function(){
  'use strict';
  function svg(fond, corps){
    return '<svg viewBox="0 0 800 260" preserveAspectRatio="xMidYMax slice" aria-hidden="true"><defs>' + G + fond + '</defs>' + corps + FINI + '</svg>';
  }
  function ciel(id, haut, bas){ return '<linearGradient id="' + id + '" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="' + haut + '"/><stop offset="1" stop-color="' + bas + '"/></linearGradient>'; }
  function nuages(op){
    return '<g opacity="' + (op || .6) + '"><g class="an-nuage"><ellipse cx="0" cy="50" rx="46" ry="14" fill="#fff"/><ellipse cx="30" cy="42" rx="30" ry="14" fill="#fff"/></g>'
      + '<g class="an-nuage" style="animation-delay:-18s"><ellipse cx="0" cy="80" rx="38" ry="11" fill="#fff"/><ellipse cx="24" cy="73" rx="24" ry="11" fill="#fff"/></g></g>';
  }
  function oiseaux(c){ c = c || '#142554';
    return '<g class="an-oiseau"><path d="M0 0 q6 -6 12 0 q6 -6 12 0" stroke="' + c + '" stroke-width="2.4" fill="none"/></g>'
      + '<g class="an-oiseau" style="animation-delay:-6s"><path d="M0 20 q5 -5 10 0 q5 -5 10 0" stroke="' + c + '" stroke-width="2" fill="none"/></g>'; }
  function palmier(x, y, s){ return palmier2(x, y, s); }
  function foule(y, c, n){ var s = '', k; for(k = 0; k < (n || 16); k++){ var x = 20 + k * 50 + (k % 2) * 12; s += '<circle cx="' + x + '" cy="' + (y - 34) + '" r="10" fill="' + c + '"/><path d="M' + (x - 15) + ' ' + y + ' Q' + x + ' ' + (y - 34) + ' ' + (x + 15) + ' ' + y + ' Z" fill="' + c + '"/>'; } return s; }
  function case_(x, y, s){ s = s || 1; return '<g transform="translate(' + x + ' ' + y + ') scale(' + s + ')">' + maison(-40, 0, 80, 50, { mur:'#B4793F', brique:true, porte:30, toit:'paille', rh:46 }) + '</g>'; }
  function lampe(x, y){ return '<g transform="translate(' + x + ' ' + y + ')"><rect x="-8" y="0" width="16" height="22" rx="3" fill="#8a6a2a"/><ellipse class="an-flamme" cx="0" cy="-6" rx="5" ry="10" fill="#FFC93C"/><circle cx="0" cy="-4" r="38" fill="#FFC93C" opacity=".12"/></g>'; }
  function etoiles(n){ var s = '', k; for(k = 0; k < (n || 24); k++){ s += '<circle class="an-etoile" style="animation-delay:-' + (k % 5) * 0.6 + 's" cx="' + ((k * 97) % 800) + '" cy="' + (10 + (k * 37) % 110) + '" r="' + (k % 3 ? 1.2 : 1.8) + '" fill="#fff"/>'; } return s; }

  /* ---------- Rendu modernisé (13/11/2026) ----------
   * Une seule lumière pour tous les décors : soleil en haut à gauche. Chaque
   * décor reçoit la même finition (lumière rasante, grain fin, vignette) et
   * les objets posent une ombre de contact au sol. Les matières (tôle
   * ondulée, paille, brique, crépi éclaboussé de latérite) sont des motifs
   * SVG partagés. Rien d'anachronique : ni voiture ni poteau électrique, car
   * un même décor sert à des scènes de 1290, 1929, 1961 ou d'aujourd'hui. */
  var GRAIN = 'data:image/png;base64,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';
  var G = '<radialGradient id="vgOmb"><stop offset="0" stop-color="#1A1208" stop-opacity=".55"/><stop offset="1" stop-color="#1A1208" stop-opacity="0"/></radialGradient>'
    + '<radialGradient id="vgVig" cx=".5" cy=".42" r=".8"><stop offset=".55" stop-color="#0A0F1E" stop-opacity="0"/><stop offset="1" stop-color="#0A0F1E" stop-opacity=".34"/></radialGradient>'
    + '<linearGradient id="vgLum" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#FFF3D6" stop-opacity=".6"/><stop offset=".5" stop-color="#FFFFFF" stop-opacity="0"/><stop offset="1" stop-color="#1A1030" stop-opacity=".28"/></linearGradient>'
    + '<pattern id="vgGrain" width="64" height="64" patternUnits="userSpaceOnUse"><image href="' + GRAIN + '" width="64" height="64"/></pattern>'
    + '<pattern id="vgTole" width="6" height="10" patternUnits="userSpaceOnUse"><rect width="2" height="10" fill="#fff" opacity=".24"/><rect x="3.4" width="1.6" height="10" fill="#000" opacity=".2"/></pattern>'
    + '<pattern id="vgPaille" width="7" height="7" patternUnits="userSpaceOnUse" patternTransform="rotate(12)"><path d="M0 7 L3.5 0 M3.5 7 L7 0" stroke="#4E3812" stroke-width="1" opacity=".45"/></pattern>'
    + '<pattern id="vgBrique" width="24" height="10" patternUnits="userSpaceOnUse"><path d="M0 .5 H24 M0 5.5 H24 M6 .5 V5.5 M18 5.5 V10" stroke="#2A1608" stroke-width=".8" opacity=".16" fill="none"/></pattern>'
    + '<pattern id="vgBambou" width="9" height="40" patternUnits="userSpaceOnUse"><rect width="4" height="40" fill="#fff" opacity=".14"/><rect x="7.5" width="1.5" height="40" fill="#000" opacity=".22"/><rect y="19" width="9" height="1.5" fill="#000" opacity=".18"/></pattern>'
    + '<pattern id="vgRayure" width="28" height="10" patternUnits="userSpaceOnUse"><rect width="14" height="10" fill="#fff" opacity=".38"/></pattern>'
    + '<linearGradient id="vgTronc" x1="0" x2="1"><stop offset="0" stop-color="#3A2312"/><stop offset=".55" stop-color="#6E4828"/><stop offset="1" stop-color="#4A2E18"/></linearGradient>'
    + '<linearGradient id="vgMur" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#000" stop-opacity=".2"/><stop offset=".22" stop-color="#000" stop-opacity="0"/><stop offset=".86" stop-color="#7A3A14" stop-opacity="0"/><stop offset="1" stop-color="#7A3A14" stop-opacity=".32"/></linearGradient>';
  var FINI = '<rect width="800" height="260" fill="url(#vgLum)" style="mix-blend-mode:soft-light"/>'
    + '<rect width="800" height="260" fill="url(#vgGrain)" opacity=".1" style="mix-blend-mode:overlay"/>'
    + '<rect width="800" height="260" fill="url(#vgVig)"/>';
  function hasard(graine){ var s = graine; return function(){ s = (s * 9301 + 49297) % 233280; return s / 233280; }; }
  function nuance(hex, f){
    var h = String(hex).replace('#', ''), n = parseInt(h, 16), r = n >> 16 & 255, g = n >> 8 & 255, b = n & 255;
    function m(c){ return Math.round(f < 0 ? c * (1 + f) : c + (255 - c) * f); }
    return 'rgb(' + m(r) + ',' + m(g) + ',' + m(b) + ')';
  }
  function ombre(cx, cy, rx, ry, op){ return '<ellipse cx="' + cx + '" cy="' + cy + '" rx="' + rx + '" ry="' + ry + '" fill="url(#vgOmb)" opacity="' + (op || 1) + '"/>'; }
  function soleil(cx, cy, c){ c = c || '#FFF4C2';
    return '<circle cx="' + cx + '" cy="' + cy + '" r="110" fill="' + c + '" opacity=".14"/><circle cx="' + cx + '" cy="' + cy + '" r="58" fill="' + c + '" opacity=".28"/><circle class="an-soleil" cx="' + cx + '" cy="' + cy + '" r="26" fill="' + c + '"/>'; }
  function ciel3(id, haut, milieu, bas){ return '<linearGradient id="' + id + '" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="' + haut + '"/><stop offset=".6" stop-color="' + milieu + '"/><stop offset="1" stop-color="' + bas + '"/></linearGradient>'; }
  function collines(y, h, c, graine, op){
    var r = hasard(graine), d = 'M0 ' + y, x = -40;
    while(x < 800){ var w = 90 + r() * 140, hh = h * (.45 + r() * .7); d += ' Q' + (x + w / 2).toFixed(0) + ' ' + (y - hh * 2).toFixed(0) + ' ' + (x + w).toFixed(0) + ' ' + y; x += w; }
    return '<path d="' + d + ' L800 260 L0 260 Z" fill="' + c + '" opacity="' + (op || 1) + '"/>'; }
  function lisiere(y, c, graine, n){ // ligne d'arbres lointains
    var r = hasard(graine), s = '', k;
    for(k = 0; k < (n || 30); k++){ var x = k * 800 / (n || 30) + r() * 14, rr = 12 + r() * 16; s += '<circle cx="' + x.toFixed(0) + '" cy="' + (y - rr * .6).toFixed(0) + '" r="' + rr.toFixed(0) + '"/>'; }
    return '<g fill="' + c + '">' + s + '<rect x="0" y="' + (y - 4) + '" width="800" height="' + (264 - y) + '"/></g>'; }
  function sol(id, y, c1, c2, graine, herbe){
    var r = hasard(graine), s = '<linearGradient id="' + id + '" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="' + c1 + '"/><stop offset="1" stop-color="' + c2 + '"/></linearGradient>'
      + '<rect x="0" y="' + y + '" width="800" height="' + (260 - y) + '" fill="url(#' + id + ')"/>', k;
    for(k = 0; k < 90; k++){ var t = r(), yy = y + 3 + t * t * (257 - y), sc = .4 + t * 1.6, x = r() * 800;
      s += '<ellipse cx="' + x.toFixed(0) + '" cy="' + yy.toFixed(1) + '" rx="' + (sc * (1 + r() * 2)).toFixed(1) + '" ry="' + (sc * .6).toFixed(1) + '" fill="' + (r() < .5 ? '#2A1606' : '#FFF4DC') + '" opacity="' + (.1 + r() * .14).toFixed(2) + '"/>';
      if(herbe && k % 3 === 0){ var hx = r() * 800; s += '<path d="M' + hx.toFixed(0) + ' ' + yy.toFixed(0) + ' l-' + (3 * sc).toFixed(1) + ' -' + (6 * sc).toFixed(1) + ' M' + hx.toFixed(0) + ' ' + yy.toFixed(0) + ' l0 -' + (8 * sc).toFixed(1) + ' M' + hx.toFixed(0) + ' ' + yy.toFixed(0) + ' l' + (3 * sc).toFixed(1) + ' -' + (6 * sc).toFixed(1) + '" stroke="' + herbe + '" stroke-width="' + (.8 * sc).toFixed(1) + '" stroke-linecap="round" opacity=".7"/>'; } }
    return s; }
  function arbre(x, y, s, pal, graine, fleurs){
    pal = pal || ['#2A5628', '#3A7334', '#559140', '#86BC5E'];
    var r = hasard(graine || 7), c = '', cy = y - 105 * s;
    function couche(n, ex, ey, rmin, rmax, coul, dx, dy, op){
      for(var k = 0; k < n; k++){ c += '<circle cx="' + (x + (dx + (r() - .5) * 2 * ex) * s).toFixed(1) + '" cy="' + (cy + (dy + (r() - .5) * 2 * ey) * s).toFixed(1) + '" r="' + ((rmin + r() * (rmax - rmin)) * s).toFixed(1) + '" fill="' + coul + '"' + (op ? ' opacity="' + op + '"' : '') + '/>'; } }
    couche(15, 96, 26, 26, 40, pal[0], 6, 14); couche(15, 86, 24, 22, 34, pal[1], 0, 0); couche(10, 64, 18, 14, 24, pal[2], -18, -14); couche(18, 66, 18, 1.6, 3.6, pal[3], -22, -20, .55);
    if(fleurs){ couche(26, 84, 26, 2.5, 5, fleurs, 0, -4, .95); }
    var t = '<path d="M' + (x - 11 * s) + ' ' + y + ' Q' + (x - 6 * s) + ' ' + (y - 40 * s) + ' ' + (x - 4 * s) + ' ' + (y - 82 * s) + ' L' + (x + 5 * s) + ' ' + (y - 82 * s) + ' Q' + (x + 7 * s) + ' ' + (y - 40 * s) + ' ' + (x + 12 * s) + ' ' + y + ' Z" fill="url(#vgTronc)"/>'
      + '<path d="M' + x + ' ' + (y - 62 * s) + ' Q' + (x - 26 * s) + ' ' + (y - 80 * s) + ' ' + (x - 48 * s) + ' ' + (y - 96 * s) + ' M' + x + ' ' + (y - 70 * s) + ' Q' + (x + 30 * s) + ' ' + (y - 86 * s) + ' ' + (x + 52 * s) + ' ' + (y - 98 * s) + '" stroke="#4A2E18" stroke-width="' + (5 * s).toFixed(1) + '" stroke-linecap="round" fill="none"/>';
    return ombre(x + 26 * s, y + 3, 125 * s, 13 * s, .75) + t + '<g class="an-feuille">' + c + '</g>'; }
  function bananier(x, y, s){
    var f = [[-160, 52, '#3E7A2E'], [-122, 60, '#4C8C36'], [-84, 50, '#5A9A3E'], [-48, 62, '#4C8C36'], [-14, 56, '#3E7A2E'], [22, 44, '#8A8A3A']], g = '';
    f.forEach(function(v){ g += '<g transform="rotate(' + v[0] + ' 0 -66)"><path d="M0 -66 Q' + v[1] * .5 + ' ' + (-66 - v[1] * .34) + ' ' + v[1] + ' ' + (-66 - v[1] * .08) + ' Q' + v[1] * .5 + ' ' + (-66 + v[1] * .06) + ' 0 -66 Z" fill="' + v[2] + '"/><path d="M0 -66 Q' + v[1] * .5 + ' ' + (-66 - v[1] * .16) + ' ' + v[1] + ' ' + (-66 - v[1] * .08) + '" stroke="#2A4E1C" stroke-width="1" fill="none" opacity=".6"/></g>'; });
    return '<g transform="translate(' + x + ' ' + y + ') scale(' + s + ')">' + ombre(8, 2, 34, 5, .6) + '<path d="M-5 0 Q-4 -36 -3 -68 L3 -68 Q4 -36 6 0 Z" fill="#6B7F38"/><path d="M-1 -60 L-1 0" stroke="#4E5E28" stroke-width="1.4"/><g class="an-feuille">' + g + '</g></g>'; }
  function palmier2(x, y, s){
    var anneaux = '', k, fr = '';
    for(k = 1; k < 9; k++){ anneaux += '<path d="M' + (-4 + k * .3) + ' ' + (-k * 12) + ' l' + (8 - k * .4) + ' 1" stroke="#3A2614" stroke-width="1.2" opacity=".55"/>'; }
    // palmes : limbe effilé et retombant, folioles en peigne sous la nervure
    [[-176, 74, 26], [-150, 80, 30], [-118, 64, 18], [-62, 66, 18], [-30, 82, 30], [-4, 74, 26], [-92, 50, 8]].forEach(function(v, i){
      var L = v[1], d = v[2], c = i % 2 ? '#2F6B32' : '#3E8040', peigne = '';
      for(var t = .12; t < .96; t += .07){ var px = L * t, py = -18 * Math.sin(t * Math.PI) + d * t * t; peigne += 'M' + px.toFixed(1) + ' ' + py.toFixed(1) + ' l' + (2 - 4 * t).toFixed(1) + ' ' + (9 - 4 * t).toFixed(1) + ' '; }
      fr += '<g transform="translate(2 -108) rotate(' + v[0] + ')"><path d="M0 0 Q' + (L * .5) + ' ' + (-26) + ' ' + L + ' ' + d + ' Q' + (L * .5) + ' -10 0 2 Z" fill="' + c + '"/>'
        + '<path d="' + peigne + '" stroke="' + c + '" stroke-width="2.6" stroke-linecap="round"/><path d="M0 0 Q' + (L * .5) + ' -20 ' + L + ' ' + d + '" stroke="#24502A" stroke-width="1.2" fill="none"/></g>'; });
    return '<g transform="translate(' + x + ' ' + y + ') scale(' + s + ')">' + ombre(22, 2, 50, 6, .6) + '<path d="M-5 0 Q6 -60 -1 -110 L4 -110 Q12 -60 5 0 Z" fill="url(#vgTronc)"/>' + anneaux + '<g class="an-feuille">' + fr + '<circle cx="2" cy="-106" r="5" fill="#5A3A1A"/></g></g>'; }
  /* Maison vue de face. o : mur, toit ('tole' | 'paille'), brique, porte (décalage), fen [décalages], rh (hauteur du toit) */
  var nMaison = 0;
  function maison(x, y, w, h, o){
    o = o || {}; var top = y - h, ov = o.ov || 10, rh = o.rh || h * .5, id = 'mz' + (nMaison++), s = '';
    var toit = 'M' + (x - ov) + ' ' + (top + 3) + ' L' + (x + w + ov) + ' ' + (top + 3) + ' L' + (x + w * .8) + ' ' + (top - rh) + ' L' + (x + w * .2) + ' ' + (top - rh) + ' Z';
    if(o.toit === 'paille'){ toit = 'M' + (x - ov - 4) + ' ' + (top + 6) + ' L' + (x + w + ov + 4) + ' ' + (top + 6) + ' L' + (x + w / 2) + ' ' + (top - rh) + ' Z'; }
    s += '<path d="M' + x + ' ' + y + ' L' + (x + w) + ' ' + y + ' L' + (x + w + 34) + ' ' + (y + 9) + ' L' + (x + 22) + ' ' + (y + 9) + ' Z" fill="#1A1208" opacity=".16"/>';
    s += '<rect x="' + x + '" y="' + top + '" width="' + w + '" height="' + h + '" fill="' + (o.mur || '#E6DAC0') + '"/>' + (o.brique ? '<rect x="' + x + '" y="' + top + '" width="' + w + '" height="' + h + '" fill="url(#vgBrique)"/>' : '') + (o.bambou ? '<rect x="' + x + '" y="' + top + '" width="' + w + '" height="' + h + '" fill="url(#vgBambou)"/>' : '')
      + '<rect x="' + x + '" y="' + top + '" width="' + w + '" height="' + h + '" fill="url(#vgMur)"/>';
    (o.fen || []).forEach(function(dx){ var fy = top + h * .28, fw = 26, fh = Math.min(24, h * .34);
      s += '<rect x="' + (x + dx - 2) + '" y="' + (fy - 2) + '" width="' + (fw + 4) + '" height="' + (fh + 4) + '" fill="' + nuance(o.mur || '#E6DAC0', .35) + '"/><rect x="' + (x + dx) + '" y="' + fy + '" width="' + fw + '" height="' + fh + '" fill="' + (o.volet || '#3F6B5A') + '"/>';
      for(var k = 3; k < fh; k += 4){ s += '<rect x="' + (x + dx + 1) + '" y="' + (fy + k) + '" width="' + (fw - 2) + '" height="1.4" fill="#000" opacity=".28"/>'; }
      s += '<rect x="' + (x + dx + fw / 2 - .5) + '" y="' + fy + '" width="1" height="' + fh + '" fill="#000" opacity=".35"/>'; });
    if(o.porte !== undefined){ var ph = Math.min(40, h * .66), px = x + o.porte;
      s += '<rect x="' + (px - 2) + '" y="' + (y - ph - 2) + '" width="24" height="' + (ph + 2) + '" fill="' + nuance(o.mur || '#E6DAC0', .3) + '"/><rect x="' + px + '" y="' + (y - ph) + '" width="20" height="' + ph + '" fill="' + (o.bois || '#5A3A22') + '"/>'
        + '<path d="M' + (px + 6.5) + ' ' + (y - ph) + ' V' + y + ' M' + (px + 13.5) + ' ' + (y - ph) + ' V' + y + '" stroke="#000" stroke-width=".8" opacity=".3"/><circle cx="' + (px + 16) + '" cy="' + (y - ph / 2) + '" r="1.3" fill="#C9A15A"/>'; }
    s += '<rect x="' + x + '" y="' + top + '" width="' + w + '" height="9" fill="#000" opacity=".16"/>';
    if(o.toit === 'paille'){
      s += '<path d="' + toit + '" fill="#B48C4C"/><path d="' + toit + '" fill="url(#vgPaille)"/>'
        + '<path d="M' + (x - ov - 4) + ' ' + (top + 6) + [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map(function(k){ var xx = x - ov - 4 + (w + 2 * ov + 8) * (k + .5) / 12; return ' L' + xx.toFixed(0) + ' ' + (top + 11 + (k % 2) * 3); }).join('') + ' L' + (x + w + ov + 4) + ' ' + (top + 6) + ' Z" fill="#8E6A34"/>'
        + '<path d="M' + (x + w / 2) + ' ' + (top - rh) + ' L' + (x + w + ov + 4) + ' ' + (top + 6) + ' L' + (x + w / 2 + 6) + ' ' + (top + 6) + ' Z" fill="#000" opacity=".14"/>';
    } else {
      s += '<clipPath id="' + id + '"><path d="' + toit + '"/></clipPath><path d="' + toit + '" fill="' + (o.tole || '#8F969B') + '"/><g clip-path="url(#' + id + ')"><rect x="' + (x - ov) + '" y="' + (top - rh) + '" width="' + (w + 2 * ov) + '" height="' + (rh + 4) + '" fill="url(#vgTole)"/>'
        + '<rect x="' + (x + w * .12) + '" y="' + (top - rh) + '" width="' + (w * .18) + '" height="' + (rh + 4) + '" fill="#9A4E22" opacity=".42"/><rect x="' + (x + w * .58) + '" y="' + (top - rh * .5) + '" width="' + (w * .26) + '" height="' + (rh + 4) + '" fill="#8A4420" opacity=".32"/>'
        + '<rect x="' + (x - ov) + '" y="' + (top - rh) + '" width="' + (w + 2 * ov) + '" height="' + (rh * .35) + '" fill="#fff" opacity=".16"/></g>'
        + '<rect x="' + (x - ov) + '" y="' + (top + 1) + '" width="' + (w + 2 * ov) + '" height="3" fill="#000" opacity=".25"/>';
    }
    return s; }

  window.VRT_DECORS = {
    // Place de cérémonie coloniale : soleil, mât, cercle de chaux, foule
    place: function(){ return svg(ciel('cP', '#F7B54A', '#FBE3A6'),
      '<rect width="800" height="260" fill="url(#cP)"/><circle class="an-soleil" cx="690" cy="52" r="34" fill="#FFF4C2"/><circle cx="690" cy="52" r="60" fill="#FFF4C2" opacity=".25"/>' + nuages(.35)
      + collines(160, 14, '#C9A06A', 121, .6) + '<g opacity=".55">' + foule(178, '#5B3A1E', 17) + '</g>' + sol('sP', 176, '#DDB57A', '#C49558', 123) + ombre(108, 192, 26, 4, .8) + ombre(670, 178, 110, 8, .7)
      + '<rect x="92" y="40" width="5" height="150" fill="#3a3a3a"/><g class="an-drapeau"><rect x="97" y="42" width="22" height="34" fill="#1F3A8A"/><rect x="119" y="42" width="22" height="34" fill="#fff"/><rect x="141" y="42" width="22" height="34" fill="#C0392B"/></g>'
      + '<rect x="560" y="130" width="190" height="46" fill="#7A2E2E"/><rect x="560" y="122" width="190" height="10" fill="#E9E3CF"/><path d="M560 122 L655 96 L750 122 Z" fill="#E9E3CF"/>'
      + '<ellipse cx="400" cy="232" rx="170" ry="20" fill="none" stroke="#fff" stroke-width="5" stroke-dasharray="14 8"/>'); },
    // Salon du XVIIe siècle : rideaux, lustre, table nappée, porte
    salon17: function(){
      function fenetre(x){ return '<rect x="' + (x - 4) + '" y="26" width="118" height="158" fill="#D9C08A"/><rect x="' + x + '" y="30" width="110" height="150" fill="#8FA9CF"/><rect x="' + x + '" y="30" width="110" height="60" fill="#B9CBE4"/>'
        + '<path d="M' + (x + 55) + ' 30 V180 M' + x + ' 80 H' + (x + 110) + ' M' + x + ' 130 H' + (x + 110) + '" stroke="#D9C08A" stroke-width="3"/>'
        + '<path d="M' + (x - 14) + ' 22 Q' + (x + 26) + ' 108 ' + (x + 6) + ' 194 L' + (x - 22) + ' 194 L' + (x - 22) + ' 22 Z" fill="#8E2A3C"/><path d="M' + (x + 124) + ' 22 Q' + (x + 84) + ' 108 ' + (x + 104) + ' 194 L' + (x + 132) + ' 194 L' + (x + 132) + ' 22 Z" fill="#7A2233"/>'
        + '<path d="M' + (x - 22) + ' 22 Q' + (x + 26) + ' 108 ' + (x + 6) + ' 194" stroke="#C9982E" stroke-width="2" fill="none" opacity=".6"/><rect x="' + (x - 28) + '" y="16" width="166" height="9" rx="3" fill="#C9982E"/>'
        + '<path d="M' + (x + 110) + ' 60 L' + (x + 230) + ' 205 L' + (x + 150) + ' 205 L' + x + ' 150 Z" fill="#FFF0C8" opacity=".09"/>'; }
      var lames = [-300, -150, 0, 150, 300, 450, 600, 750, 900, 1050].map(function(xb){ var x2 = 400 + (xb - 400) * .55; return '<path d="M' + x2.toFixed(0) + ' 200 L' + xb + ' 260" stroke="#2A170C" stroke-width="1.2" opacity=".35"/>'; }).join('');
      var boiserie = [0, 1, 2, 3, 4, 5, 6, 7].map(function(k){ return '<rect x="' + (12 + k * 100) + '" y="152" width="80" height="40" fill="none" stroke="#C9A86A" stroke-width="1.6" opacity=".45"/>'; }).join('');
      return svg('<linearGradient id="cSm" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#4A3658"/><stop offset="1" stop-color="#6A5277"/></linearGradient><linearGradient id="cSp" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#5A3820"/><stop offset="1" stop-color="#3A2212"/></linearGradient><linearGradient id="cSn" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#8E2234"/><stop offset="1" stop-color="#6A1626"/></linearGradient>',
      '<rect width="800" height="200" fill="url(#cSm)"/><rect y="146" width="800" height="54" fill="#5A3F2A"/>' + boiserie + '<rect y="144" width="800" height="5" fill="#C9A86A" opacity=".6"/><rect width="800" height="14" fill="#C9A86A" opacity=".35"/>'
      + fenetre(90) + fenetre(600)
      + '<rect x="350" y="62" width="100" height="76" fill="#C9982E"/><rect x="357" y="69" width="86" height="62" fill="#3A2A22"/><ellipse cx="400" cy="96" rx="20" ry="24" fill="#6A5040"/><path d="M372 131 Q400 104 428 131 Z" fill="#2A1A14"/>'
      + '<rect width="800" height="60" y="200" fill="url(#cSp)"/>' + lames + '<rect y="198" width="800" height="4" fill="#2A170C" opacity=".4"/>'
      + '<rect x="0" y="0" width="800" height="260" fill="#FFD98A" opacity=".04"/><circle cx="400" cy="40" r="120" fill="#FFE2A0" opacity=".12"/>'
      + '<g class="an-tangage" style="animation-duration:6s"><path d="M400 0 L400 26" stroke="#C9982E" stroke-width="2"/><path d="M356 40 Q400 24 444 40 Q400 54 356 40 Z" fill="#C9982E"/><path d="M370 44 Q400 60 430 44" stroke="#E8C66A" stroke-width="1.5" fill="none"/>' + [366, 383, 400, 417, 434].map(function(x){ return '<rect x="' + (x - 1.5) + '" y="33" width="3" height="6" fill="#F4EBD8"/><ellipse class="an-flamme" cx="' + x + '" cy="29" rx="2.5" ry="5" fill="#FFE08A"/>'; }).join('') + '</g>'
      + ombre(400, 238, 200, 10, .9) + '<rect x="250" y="150" width="300" height="12" rx="3" fill="#6B3E1E"/><path d="M240 150 L560 150 L580 236 L220 236 Z" fill="url(#cSn)"/>'
      + '<path d="M240 150 L560 150 L566 164 L234 164 Z" fill="#C9982E" opacity=".75"/><path d="M300 166 Q310 200 296 236 M400 166 Q406 200 400 236 M500 166 Q490 200 504 236" stroke="#000" stroke-width="2" opacity=".14" fill="none"/>'
      + '<path d="M384 150 L388 136 L392 150 Z" fill="#E8E2D2"/><rect x="398" y="140" width="8" height="10" fill="#C9982E"/><ellipse class="an-flamme" cx="402" cy="136" rx="2.2" ry="4.5" fill="#FFE08A"/>'
      + '<rect x="741" y="66" width="60" height="139" fill="#C9A86A" opacity=".5"/><rect x="745" y="70" width="52" height="135" fill="#5A3A22"/><rect x="751" y="78" width="40" height="52" fill="none" stroke="#3A2414" stroke-width="2"/><rect x="751" y="140" width="40" height="56" fill="none" stroke="#3A2414" stroke-width="2"/><circle cx="756" cy="140" r="3" fill="#C9982E"/>'); },
    // Village yorouba : arbre odan, cases, mur de l'école
    village: function(){ return svg(ciel3('cV', '#6FB6E2', '#BFE1EF', '#EEF2DC'),
      '<rect width="800" height="260" fill="url(#cV)"/>' + soleil(705, 46) + nuages(.75) + oiseaux('#2A3A55')
      + collines(150, 26, '#9DB9B0', 3, .9) + collines(165, 20, '#7FA08A', 11) + lisiere(176, '#5B8A52', 5, 34)
      + bananier(520, 178, .9) + palmier2(770, 178, .78) + bananier(258, 180, .7)
      + sol('sV', 175, '#C88A50', '#A9652F', 21, '#6E8A3A')
      + '<path d="M330 260 Q380 210 392 176 L404 176 Q430 212 520 260 Z" fill="#D9A46C" opacity=".55"/>'
      + maison(40, 182, 200, 68, { mur:'#ECE2CA', fen:[14], porte:168, rh:26, ov:12 })
      + '<rect x="88" y="128" width="80" height="22" fill="#2E4A3A" stroke="#E8DCC0" stroke-width="2"/><text x="128" y="143.5" text-anchor="middle" font-size="11" fill="#fff" font-family="Georgia">ÉCOLE</text>'
      + '<g class="an-fumee"><circle cx="668" cy="120" r="9" fill="#E8E4DA"/></g><g class="an-fumee" style="animation-delay:-1.8s"><circle cx="668" cy="120" r="9" fill="#D6D0C4"/></g>'
      + maison(568, 184, 82, 44, { mur:'#B8773E', brique:true, porte:30, toit:'paille', rh:46 })
      + maison(672, 188, 70, 38, { mur:'#A9693A', brique:true, porte:10, fen:[38], rh:18, tole:'#8C8F90' })
      + '<g transform="translate(640 190)">' + ombre(4, 1, 14, 3, .7) + '<path d="M-7 0 L-5 -16 L5 -16 L7 0 Z" fill="#6B4425"/><rect x="-1" y="-34" width="2.4" height="22" rx="1" fill="#8A6A44" transform="rotate(8 0 -16)"/></g>'
      + arbre(382, 190, 1, null, 4)); },
    // Fleuve : jungle, eau qui coule, vapeur fumant
    fleuve: function(){ return svg(ciel('cF', '#4D6B5A', '#C9C9A0'),
      '<rect width="800" height="260" fill="url(#cF)"/><path d="M0 120 Q60 70 120 110 Q170 60 230 105 Q290 65 350 112 L350 160 L0 160 Z" fill="#1F3D2A"/><path d="M450 112 Q520 62 590 105 Q650 58 720 100 Q760 80 800 96 L800 160 L450 160 Z" fill="#1F3D2A"/>'
      + '<rect x="0" y="150" width="800" height="110" fill="#5E5A3A"/><g class="an-eau" opacity=".5">' + [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(function(k){ return '<path d="M' + (k * 80) + ' ' + (180 + (k % 3) * 22) + ' q20 -6 40 0 t40 0" stroke="#D9D2A8" stroke-width="2" fill="none"/>'; }).join('') + '</g>'
      + '<g class="an-tangage"><rect x="300" y="168" width="200" height="22" rx="6" fill="#E9E3CF"/><rect x="340" y="146" width="110" height="22" fill="#C9C1A6"/><rect x="420" y="112" width="14" height="36" fill="#3A3A3A"/><path d="M296 190 L504 190 L490 202 L310 202 Z" fill="#3A2A1A"/></g>'
      + '<circle class="an-fumee" cx="427" cy="104" r="10" fill="#ddd"/><circle class="an-fumee" style="animation-delay:-1.7s" cx="427" cy="104" r="10" fill="#ccc"/>'); },
    // Salon de deuil, Europe : fenêtre au crépuscule, piano, bougie
    deuil: function(){
      return svg('<linearGradient id="cDm" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#1C1A2A"/><stop offset="1" stop-color="#2C283C"/></linearGradient><linearGradient id="cDf" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#3E4E86"/><stop offset=".7" stop-color="#7A6A9A"/><stop offset="1" stop-color="#C98A6A"/></linearGradient>',
      '<rect width="800" height="260" fill="url(#cDm)"/><rect y="170" width="800" height="35" fill="#22202E"/>'
      + '<rect x="514" y="24" width="162" height="172" fill="#3A3448"/><rect x="520" y="30" width="150" height="160" fill="url(#cDf)"/>' + '<path d="M520 170 Q556 150 596 166 Q636 146 670 166 L670 190 L520 190 Z" fill="#2A2840"/>'
      + '<rect x="590" y="30" width="6" height="160" fill="#2A2638"/><rect x="520" y="105" width="150" height="6" fill="#2A2638"/><path d="M670 60 L760 205 L640 205 L520 140 Z" fill="#8E86B8" opacity=".07"/>'
      + '<path d="M500 18 Q540 100 526 200 L504 200 Z M690 18 Q650 100 664 200 L686 200 Z" fill="#14121C"/>'
      + '<rect x="372" y="54" width="86" height="104" fill="#8A6A2A"/><rect x="380" y="62" width="70" height="88" fill="#4A4652"/><ellipse cx="415" cy="96" rx="17" ry="21" fill="#6E6A74"/><path d="M392 150 Q415 118 438 150 Z" fill="#33303A"/>'
      + '<path d="M372 54 L398 54 L372 80 Z M458 54 L432 54 L458 80 Z" fill="#0A0A0E"/><path d="M405 54 Q415 66 425 54" stroke="#0A0A0E" stroke-width="4" fill="none"/>'
      + '<rect y="205" width="800" height="55" fill="#17151F"/>' + [-200, 0, 200, 400, 600, 800, 1000].map(function(xb){ return '<path d="M' + (400 + (xb - 400) * .5) + ' 205 L' + xb + ' 260" stroke="#000" opacity=".35"/>'; }).join('')
      + ombre(250, 214, 140, 7, .9) + '<rect x="110" y="166" width="280" height="10" fill="#2A2032"/><path d="M116 176 L384 176 L376 212 L124 212 Z" fill="#1E1826"/><rect x="128" y="176" width="244" height="5" fill="#E8E2D2" opacity=".85"/>'
      + '<g transform="translate(250 166)"><path d="M-14 0 L-10 -18 L10 -18 L14 0 Z" fill="#3A3448"/><circle cx="-8" cy="-26" r="7" fill="#E8E2D2"/><circle cx="4" cy="-30" r="8" fill="#F2EEE4"/><circle cx="10" cy="-22" r="6" fill="#D9D2E4"/><path d="M-2 -18 L-6 -30 M4 -18 L6 -32" stroke="#3E5E3A" stroke-width="1.5"/></g>'
      + lampe(160, 146) + lampe(340, 146)); },
    // Intérieur d'une maison douala, la nuit : lampe-tempête, fenêtre, lune
    case_nuit: function(){
      var r = hasard(151), planches = '', k;
      for(k = 0; k < 20; k++){ planches += '<rect x="' + (k * 40) + '" y="0" width="40" height="204" fill="' + ['#4A2E1A', '#55361F', '#4E3220', '#5A3A22'][k % 4] + '"/><rect x="' + (k * 40) + '" y="0" width="2" height="204" fill="#22140A"/>'
        + '<path d="M' + (k * 40 + 12 + r() * 14) + ' ' + (r() * 150).toFixed(0) + ' q4 10 0 22" stroke="#2E1C0E" stroke-width="1.2" fill="none" opacity=".6"/>'; }
      return svg('<radialGradient id="cCl" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="#FFC24A" stop-opacity=".55"/><stop offset=".45" stop-color="#FF9A2A" stop-opacity=".18"/><stop offset="1" stop-color="#FF9A2A" stop-opacity="0"/></radialGradient>',
      planches + '<rect width="800" height="204" fill="#0A0604" opacity=".35"/>'
      + '<rect x="552" y="32" width="146" height="116" fill="#2A190E"/><rect x="560" y="40" width="130" height="100" fill="#0F1A3A"/><circle cx="640" cy="80" r="18" fill="#F4F1D0"/><circle cx="640" cy="80" r="34" fill="#F4F1D0" opacity=".12"/>'
      + '<g opacity=".8">' + etoiles(6).replace(/cx="(\d+)"/g, function(m, x){ return 'cx="' + (565 + (+x % 120)) + '"'; }).replace(/cy="(\d+)"/g, function(m, y){ return 'cy="' + (45 + (+y % 90)) + '"'; }) + '</g>'
      + '<path d="M560 40 V140 M690 40 V140" stroke="#3A2414" stroke-width="10"/><path d="M690 140 L760 204 L700 204 L640 140 Z" fill="#C9D6F0" opacity=".05"/>'
      + '<rect x="70" y="60" width="64" height="44" fill="#E8DCC0" opacity=".85"/><rect x="74" y="64" width="56" height="10" fill="#B0302A"/><path d="M76 82 H128 M76 90 H128 M76 98 H128" stroke="#4A3A2A" stroke-width="1" opacity=".5"/>'
      + '<rect y="204" width="800" height="56" fill="#24160C"/><rect y="204" width="800" height="3" fill="#000" opacity=".4"/>'
      + '<path d="M60 248 L380 248 L360 218 L80 218 Z" fill="#A8864A" opacity=".55"/><path d="M80 218 L360 218 M70 233 L370 233" stroke="#6E5428" stroke-width="1" opacity=".6"/>'
      + ombre(220, 228, 120, 8, 1) + '<rect x="120" y="208" width="200" height="14" rx="3" fill="#B98A4A"/><rect x="120" y="208" width="200" height="4" rx="2" fill="#D9AA6A"/><path d="M130 222 V236 M310 222 V236" stroke="#6B4425" stroke-width="5"/>'
      + '<ellipse cx="160" cy="207" rx="16" ry="4" fill="#E8E2D8"/><ellipse cx="160" cy="206" rx="11" ry="2.4" fill="#C9C2B4"/><ellipse cx="272" cy="207" rx="13" ry="4" fill="#3E7AB8"/>'
      + '<circle cx="220" cy="170" r="150" fill="url(#cCl)"/>' + lampe(220, 186)
      + '<rect x="0" y="0" width="800" height="260" fill="#FF9A2A" opacity=".04"/>'); },
    // Tribunal colonial
    tribunal: function(){
      var fen = [70, 640].map(function(x){ return '<rect x="' + (x - 4) + '" y="20" width="98" height="168" fill="#5A3A22"/><rect x="' + x + '" y="24" width="90" height="160" fill="#9DB0C8"/><path d="M' + x + ' 64 Q' + (x + 45) + ' 20 ' + (x + 90) + ' 64" fill="#5A3A22"/><path d="M' + (x + 45) + ' 24 V184 M' + x + ' 104 H' + (x + 90) + ' M' + x + ' 144 H' + (x + 90) + '" stroke="#5A3A22" stroke-width="3"/>'
        + '<path d="M' + (x + 90) + ' 60 L' + (x + 240) + ' 210 L' + (x + 170) + ' 210 L' + x + ' 140 Z" fill="#F4EAD0" opacity=".08"/>'; }).join('');
      var lambris = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map(function(k){ return '<rect x="' + (6 + k * 80) + '" y="140" width="68" height="56" fill="none" stroke="#2A1A0E" stroke-width="2" opacity=".5"/>'; }).join('');
      var balustre = ''; for(var x = 30; x < 780; x += 18){ if(x > 330 && x < 470){ continue; } balustre += '<rect x="' + x + '" y="206" width="6" height="22" rx="2" fill="#6B4425"/>'; }
      return svg('<linearGradient id="cTm" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#4E4A44"/><stop offset="1" stop-color="#6A645A"/></linearGradient><linearGradient id="cTb" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#6B4425"/><stop offset="1" stop-color="#3E2614"/></linearGradient>',
      '<rect width="800" height="200" fill="url(#cTm)"/><rect y="136" width="800" height="64" fill="#4A2E1A"/>' + lambris + '<rect y="134" width="800" height="4" fill="#8A6A3A"/>' + fen
      + '<circle cx="400" cy="46" r="26" fill="#8A6A3A"/><circle cx="400" cy="46" r="21" fill="#5A3A22"/><path d="M400 30 V62 M386 36 H414" stroke="#C9A86A" stroke-width="2"/><path d="M386 36 L380 50 Q386 54 392 50 Z M414 36 L408 50 Q414 54 420 50 Z" fill="#C9A86A"/>'
      + '<rect y="200" width="800" height="60" fill="#2E2A26"/>' + [-200, 0, 200, 400, 600, 800, 1000].map(function(xb){ return '<path d="M' + (400 + (xb - 400) * .5) + ' 200 L' + xb + ' 260" stroke="#000" opacity=".3"/>'; }).join('')
      + ombre(400, 186, 210, 9, .9) + '<rect x="220" y="62" width="360" height="12" fill="#7A5030"/><rect x="230" y="74" width="340" height="110" fill="url(#cTb)"/>'
      + [0, 1, 2, 3].map(function(k){ return '<rect x="' + (246 + k * 82) + '" y="92" width="70" height="78" fill="none" stroke="#2A1A0E" stroke-width="2" opacity=".55"/><rect x="' + (250 + k * 82) + '" y="96" width="62" height="70" fill="#fff" opacity=".04"/>'; }).join('')
      + '<rect x="330" y="50" width="40" height="14" fill="#EDE6D6"/><rect x="380" y="52" width="40" height="12" fill="#EDE6D6"/><path d="M332 54 H366 M332 58 H360" stroke="#555" stroke-width=".8" opacity=".5"/><rect x="430" y="54" width="10" height="9" rx="1" fill="#2A1A0E"/>'
      + '<rect x="24" y="200" width="756" height="8" fill="#7A5030"/>' + balustre + '<rect x="24" y="226" width="306" height="6" fill="#5A3A22"/><rect x="470" y="226" width="310" height="6" fill="#5A3A22"/>'
      + lampe(600, 60)); },
    // Agora grecque : colonnes, olivier, soleil
    agora: function(){ return svg(ciel('cA', '#8EC5E8', '#F3EBD6'),
      '<rect width="800" height="260" fill="url(#cA)"/><circle class="an-soleil" cx="120" cy="50" r="26" fill="#FFF1B8"/>' + nuages(.7) + collines(186, 14, '#B9B48A', 131, .7)
      + '<path d="M420 70 L620 70 L520 36 Z" fill="#E9E1CC"/><rect x="420" y="70" width="200" height="10" fill="#DDD3BA"/>' + [430, 470, 510, 550, 590].map(function(x){ return '<rect x="' + x + '" y="80" width="20" height="110" fill="#F2EBD8"/><rect x="' + (x + 13) + '" y="80" width="7" height="110" fill="#000" opacity=".12"/><rect x="' + (x + 3) + '" y="80" width="3" height="110" fill="#fff" opacity=".5"/>'; }).join('')
      + '<rect x="418" y="190" width="204" height="6" fill="#DDD3BA"/>' + sol('sA', 190, '#DCCDA8', '#C4B188', 133) + ombre(560, 198, 120, 7, .7)
      + arbre(166, 194, .62, ['#55663A', '#6A7D48', '#82955A', '#A9B87E'], 135)); },
    // Port de Douala, 1884 : Wouri, voiliers, palmiers, cases
    port: function(){ return VRT_port(false); },
    port_drapeau: function(){ return VRT_port(true); },
    // Salle de classe
    classe: function(){
      var t = (window.SCENE && window.SCENE.tableau) || ['', ''];
      t = t.map(function(x){ return String(x).replace(/[&<>]/g, function(c){ return { '&':'&amp;', '<':'&lt;', '>':'&gt;' }[c]; }); });
      var fuite = [ -400, -200, 0, 140, 280, 400, 520, 660, 800, 1000, 1200 ].map(function(xb){ var x2 = 400 + (xb - 400) * .571; return '<path d="M' + x2.toFixed(0) + ' 200 L' + xb + ' 260" stroke="#6E5A3A" stroke-width="1" opacity=".22"/>'; }).join('');
      function claustra(x, y){ var s = '<rect x="' + (x - 3) + '" y="' + (y - 3) + '" width="86" height="96" fill="#CFC4A8"/><rect x="' + x + '" y="' + y + '" width="80" height="90" fill="#BFE0F2"/>', i, j;
        for(i = 0; i < 4; i++){ for(j = 0; j < 4; j++){ s += '<rect x="' + (x + i * 20) + '" y="' + (y + j * 22.5) + '" width="20" height="22.5" fill="none" stroke="#D8CDB2" stroke-width="5"/>'; } }
        return s + '<rect x="' + x + '" y="' + y + '" width="80" height="90" fill="#fff" opacity=".18"/>'; }
      function table(x){ return ombre(x + 70, 206, 80, 6, .8) + '<path d="M' + (x + 4) + ' 196 V206 M' + (x + 126) + ' 196 V206" stroke="#2E2E30" stroke-width="3"/>'
        + '<path d="M' + x + ' 186 L' + (x + 130) + ' 186 L' + (x + 136) + ' 180 L' + (x + 6) + ' 180 Z" fill="#A47A4A"/><rect x="' + x + '" y="186" width="130" height="10" fill="#6E4C2C"/>'
        + '<rect x="' + (x + 18) + '" y="181" width="16" height="4" fill="#E8E2D2" transform="skewX(-30)"/><rect x="' + (x + 84) + '" y="181" width="18" height="4" fill="#3D6FB6" transform="skewX(-30)"/>'; }
      return svg('<linearGradient id="cKm" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#E6DDC6"/><stop offset="1" stop-color="#EFE8D6"/></linearGradient><linearGradient id="cKs" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#B9A57E"/><stop offset="1" stop-color="#9C8660"/></linearGradient><linearGradient id="cKt" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#2A4D39"/><stop offset="1" stop-color="#1D3628"/></linearGradient>',
      '<rect width="800" height="200" fill="url(#cKm)"/><rect y="150" width="800" height="50" fill="#4E7E70"/><rect y="148" width="800" height="3" fill="#3B6458"/>'
      + '<rect width="800" height="14" fill="#CFC5AA"/><rect x="250" y="4" width="84" height="5" rx="2" fill="#FFFDF2"/><rect x="466" y="4" width="84" height="5" rx="2" fill="#FFFDF2"/><ellipse cx="292" cy="10" rx="70" ry="12" fill="#FFFBE6" opacity=".25"/><ellipse cx="508" cy="10" rx="70" ry="12" fill="#FFFBE6" opacity=".25"/>'
      + claustra(98, 40) + claustra(622, 40)
      + '<path d="M0 0 L70 16 L70 200 L0 232 Z" fill="#D6CBB0"/><path d="M800 0 L730 16 L730 200 L800 232 Z" fill="#CFC3A6"/>'
      + '<path d="M14 44 L56 52 L56 132 L14 146 Z" fill="#BFE0F2"/><path d="M786 44 L744 52 L744 132 L786 146 Z" fill="#BFE0F2"/>'
      + [0, 1, 2, 3, 4, 5, 6].map(function(k){ return '<path d="M14 ' + (56 + k * 13) + ' L56 ' + (62 + k * 10.5) + ' M786 ' + (56 + k * 13) + ' L744 ' + (62 + k * 10.5) + '" stroke="#8C9AA2" stroke-width="2"/>'; }).join('')
      + '<path d="M56 52 L56 132 L300 260 L170 260 Z" fill="#FFF3CF" opacity=".16"/><path d="M744 52 L744 132 L500 260 L630 260 Z" fill="#FFF3CF" opacity=".12"/>'
      + '<path d="M0 232 L70 200 L730 200 L800 232 L800 260 L0 260 Z" fill="url(#cKs)"/>' + fuite + [212, 228, 248].map(function(y){ return '<path d="M0 ' + y + ' H800" stroke="#6E5A3A" stroke-width="1" opacity=".18"/>'; }).join('')
      + '<rect x="192" y="22" width="416" height="136" rx="5" fill="#7A5634"/><rect x="200" y="30" width="400" height="120" fill="url(#cKt)"/>'
      + '<ellipse cx="300" cy="110" rx="70" ry="22" fill="#fff" opacity=".05"/><ellipse cx="520" cy="60" rx="60" ry="16" fill="#fff" opacity=".05"/>'
      + '<rect x="196" y="150" width="408" height="7" fill="#5E4026"/><rect x="250" y="148" width="14" height="3" fill="#F4F1E8"/><rect x="272" y="148.5" width="9" height="2.6" fill="#F2C6C6"/>'
      + '<text x="400" y="80" text-anchor="middle" font-size="22" fill="#E9F0E9" font-family="Georgia">' + t[0] + '</text><text x="400" y="112" text-anchor="middle" font-size="15" fill="#C9D9C9" font-family="Georgia">' + (t[1] || '') + '</text>'
      + [80, 250, 420, 590].map(table).join('')); },
    // Marché : étals, auvents rayés, fruits
    marche: function(){
      function tas(x, y, c, n){ var s = '', k, rang = 0, i = 0; while(i < n){ var dans = 4 - rang; for(k = 0; k < dans && i < n; k++, i++){ var cx = x + (k - (dans - 1) / 2) * 9, cy = y - rang * 7.5;
          s += '<circle cx="' + cx + '" cy="' + cy + '" r="5" fill="' + c + '"/><circle cx="' + (cx - 1.6) + '" cy="' + (cy - 1.8) + '" r="1.5" fill="#fff" opacity=".45"/>'; } rang++; } return s; }
      function plantain(x, y){ var s = ''; for(var k = 0; k < 6; k++){ s += '<path d="M' + (x + k * 3) + ' ' + y + ' q-6 -14 4 -24" stroke="' + (k % 2 ? '#C9B23A' : '#9AAE3A') + '" stroke-width="5" stroke-linecap="round" fill="none"/>'; } return s; }
      function ananas(x, y){ return '<ellipse cx="' + x + '" cy="' + (y - 9) + '" rx="7" ry="10" fill="#D49A2A"/><path d="M' + (x - 6) + ' ' + (y - 14) + ' l12 8 M' + (x - 6) + ' ' + (y - 6) + ' l12 -8" stroke="#8A5A10" stroke-width=".8"/><path d="M' + x + ' ' + (y - 18) + ' l-5 -10 M' + x + ' ' + (y - 18) + ' l0 -12 M' + x + ' ' + (y - 18) + ' l5 -10" stroke="#3E7A2E" stroke-width="2.4" stroke-linecap="round"/>'; }
      function cuvette(x, y, c){ return '<path d="M' + (x - 16) + ' ' + (y - 9) + ' L' + (x + 16) + ' ' + (y - 9) + ' L' + (x + 12) + ' ' + y + ' L' + (x - 12) + ' ' + y + ' Z" fill="' + c + '"/><ellipse cx="' + x + '" cy="' + (y - 9) + '" rx="16" ry="3" fill="' + nuance(c, .3) + '"/>'; }
      function etal(x, c, k){ var y = 192, s = ombre(x + 90, y + 3, 100, 8, .8);
        s += '<path d="M' + (x + 4) + ' ' + y + ' V' + (y - 104) + ' M' + (x + 156) + ' ' + y + ' V' + (y - 104) + '" stroke="#5A3A1E" stroke-width="4"/>';
        var bache = 'M' + (x - 10) + ' ' + (y - 110) + ' Q' + (x + 80) + ' ' + (y - 96) + ' ' + (x + 170) + ' ' + (y - 110) + ' L' + (x + 164) + ' ' + (y - 90) + ' Q' + (x + 80) + ' ' + (y - 80) + ' ' + (x - 4) + ' ' + (y - 90) + ' Z';
        s += '<path d="' + bache + '" fill="' + c + '"/><path d="' + bache + '" fill="url(#vgRayure)"/><path d="M' + (x - 4) + ' ' + (y - 90) + ' Q' + (x + 80) + ' ' + (y - 80) + ' ' + (x + 164) + ' ' + (y - 90) + '" stroke="#000" stroke-width="2" opacity=".2" fill="none"/>';
        s += '<rect x="' + x + '" y="' + (y - 46) + '" width="160" height="8" fill="#9A6A3A"/><rect x="' + x + '" y="' + (y - 38) + '" width="160" height="38" fill="' + ['#2E5E9A', '#B03A2E', '#2E7A5A'][k] + '"/><rect x="' + x + '" y="' + (y - 38) + '" width="160" height="38" fill="url(#vgRayure)" opacity=".4"/><rect x="' + x + '" y="' + (y - 38) + '" width="160" height="6" fill="#000" opacity=".18"/>';
        if(k === 0){ s += tas(x + 30, y - 52, '#D2382A', 9) + tas(x + 76, y - 52, '#7A3A6A', 9) + ananas(x + 112, y - 46) + ananas(x + 130, y - 46); }
        if(k === 1){ s += plantain(x + 18, y - 47) + plantain(x + 48, y - 47) + cuvette(x + 102, y - 46, '#3E8EC8') + tas(x + 102, y - 58, '#E8C23A', 6) + cuvette(x + 138, y - 46, '#E0573A'); }
        if(k === 2){ s += tas(x + 28, y - 52, '#E8862A', 9) + cuvette(x + 74, y - 46, '#2E9A6A') + tas(x + 74, y - 58, '#C9302A', 6) + tas(x + 122, y - 52, '#B98A5A', 9); }
        return s; }
      var foule2 = '', r = hasard(9), k;
      for(k = 0; k < 22; k++){ var fx = 10 + k * 37 + r() * 10, fh = 30 + r() * 12, fc = ['#3A2A1A', '#5A3A2A', '#2E2A3A', '#4A2E1E'][k % 4], tc = ['#C0392B', '#E8A413', '#1F6F78', '#7B5CD6', '#2E7A5A'][k % 5];
        foule2 += '<path d="M' + (fx - 13) + ' 196 Q' + fx + ' ' + (196 - fh) + ' ' + (fx + 13) + ' 196 Z" fill="' + tc + '"/><circle cx="' + fx + '" cy="' + (196 - fh - 6) + '" r="8" fill="' + fc + '"/>' + (k % 3 === 0 ? '<path d="M' + (fx - 9) + ' ' + (196 - fh - 9) + ' Q' + fx + ' ' + (196 - fh - 22) + ' ' + (fx + 9) + ' ' + (196 - fh - 9) + ' Z" fill="' + tc + '"/>' : ''); }
      return svg(ciel3('cM', '#78C2EA', '#CBE6F0', '#F6EDD6'),
      '<rect width="800" height="260" fill="url(#cM)"/>' + soleil(110, 40) + nuages(.75) + lisiere(150, '#7FA58A', 13, 26)
      + maison(-10, 168, 170, 66, { mur:'#E2D2AE', fen:[30, 110], rh:22 }) + maison(640, 166, 180, 70, { mur:'#D8C49A', fen:[40, 120], rh:24, tole:'#9AA0A2' })
      + '<g opacity=".55">' + foule2 + '</g>' + sol('sM', 190, '#C79B62', '#A97E48', 31)
      + '<g transform="translate(470 190)">' + ombre(0, 2, 60, 6, .7) + '<path d="M0 0 V-96" stroke="#555" stroke-width="2.4"/><path d="M-62 -84 Q0 -120 62 -84 Q31 -90 0 -86 Q-31 -90 -62 -84 Z" fill="#E8A413"/><path d="M-62 -84 Q-31 -90 0 -86 L0 -114 Z" fill="#C0392B"/><path d="M0 -86 Q31 -90 62 -84 L0 -114 Z" fill="#1F6F78"/></g>'
      + etal(40, '#C0392B', 0) + etal(300, '#1F6F78', 1) + etal(590, '#E8A413', 2)
      + '<g transform="translate(250 214)">' + ombre(0, 2, 18, 3, .7) + '<path d="M-14 0 L-11 -18 L11 -18 L14 0 Z" fill="#B88A4A"/><path d="M-11 -12 H11 M-12 -6 H12" stroke="#7A5428" stroke-width="1.2"/></g>'); },
    // Couloir d'école
    couloir: function(){
      var VP = [400, 120], lignes = [-400, -150, 100, 300, 500, 700, 950, 1200].map(function(xb){ var x2 = VP[0] + (xb - VP[0]) * (200 - VP[1]) / (260 - VP[1]); return '<path d="M' + x2.toFixed(0) + ' 200 L' + xb + ' 260" stroke="#7E7668" stroke-width="1" opacity=".35"/>'; }).join('');
      return svg('<linearGradient id="cOm" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#E9E4D8"/><stop offset="1" stop-color="#F3EFE6"/></linearGradient><linearGradient id="cOs" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#C9C0B0"/><stop offset="1" stop-color="#A89E8C"/></linearGradient>',
      '<rect width="800" height="200" fill="url(#cOm)"/><rect y="150" width="800" height="50" fill="#9EB8C4"/><rect y="148" width="800" height="3" fill="#7E98A6"/>'
      + '<rect width="800" height="12" fill="#D8D2C4"/>' + [140, 400, 660].map(function(x){ return '<rect x="' + (x - 40) + '" y="3" width="80" height="5" rx="2" fill="#FFFDF2"/><ellipse cx="' + x + '" cy="12" rx="80" ry="14" fill="#FFFBE6" opacity=".3"/>'; }).join('')
      + '<rect width="800" height="60" y="200" fill="url(#cOs)"/>' + lignes + [214, 232, 254].map(function(y){ return '<path d="M0 ' + y + ' H800" stroke="#7E7668" stroke-width="1" opacity=".25"/>'; }).join('')
      + '<ellipse cx="400" cy="222" rx="300" ry="10" fill="#fff" opacity=".18"/>'
      + [80, 300, 520].map(function(x, k){ return ombre(x + 50, 202, 60, 4, .6) + '<rect x="' + (x - 6) + '" y="64" width="92" height="136" fill="#D8D0BE"/><rect x="' + x + '" y="70" width="80" height="130" fill="#6B4A2E"/><rect x="' + x + '" y="70" width="40" height="130" fill="#fff" opacity=".05"/>'
        + '<rect x="' + (x + 14) + '" y="84" width="22" height="36" fill="#BFD6E2" opacity=".85"/><rect x="' + (x + 44) + '" y="84" width="22" height="36" fill="#BFD6E2" opacity=".85"/><rect x="' + (x + 8) + '" y="134" width="64" height="56" fill="none" stroke="#4E341E" stroke-width="2"/><rect x="' + (x + 64) + '" y="136" width="10" height="4" rx="2" fill="#C9A15A"/>'
        + '<rect x="' + (x - 6) + '" y="44" width="92" height="20" rx="3" fill="#142554"/><text x="' + (x + 40) + '" y="58" text-anchor="middle" font-size="10" fill="#FFC93C" font-family="Arial" font-weight="bold">' + ['AULA 3', 'INFORMÁTICA', 'BIBLIOTECA'][k] + '</text>'; }).join('')
      + '<rect x="196" y="96" width="62" height="44" fill="#C9A86A"/><rect x="200" y="100" width="54" height="36" fill="#E9DCC0"/><rect x="204" y="104" width="18" height="12" fill="#F2F2F2" transform="rotate(-4 213 110)"/><rect x="228" y="106" width="20" height="14" fill="#FFE9A8" transform="rotate(5 238 113)"/><rect x="206" y="120" width="22" height="12" fill="#CFE4F2"/>'
      + ombre(450, 202, 50, 4, .7) + '<rect x="410" y="174" width="84" height="6" fill="#8A6A44"/><path d="M416 180 V200 M488 180 V200" stroke="#3A3A3A" stroke-width="3"/>'
      + '<g transform="translate(624 200)">' + ombre(4, 1, 18, 3, .7) + '<path d="M-10 0 L-8 -18 L8 -18 L10 0 Z" fill="#A85A3A"/><g class="an-feuille"><path d="M0 -18 Q-20 -46 -16 -62 M0 -18 Q-4 -50 4 -70 M0 -18 Q14 -44 22 -58 M0 -18 Q-12 -36 -24 -40 M0 -18 Q12 -32 26 -34" stroke="#3E7A2E" stroke-width="5" stroke-linecap="round" fill="none"/></g></g>'
      + '<path d="M690 200 L690 180 L715 180 L715 160 L740 160 L740 140 L765 140 L765 120 L800 120 L800 200 Z" fill="#B0A898"/><path d="M690 180 H715 M715 160 H740 M740 140 H765 M765 120 H800" stroke="#8A8272" stroke-width="2"/><path d="M684 160 L800 90" stroke="#6B6B6B" stroke-width="3"/>'); },
    // Bar de Douala, années 1970 : comptoir, bouteilles, ventilateur
    bar: function(){
      var bouteilles = ''; [0, 1].forEach(function(e){ for(var k = 0; k < 11; k++){ var x = 72 + k * 34, h = 26 + (k * 7 + e * 3) % 9, y = (e ? 110 : 60) - h, c = ['#2E6A34', '#7A2E22', '#B88A2A', '#3A4E7A', '#5A3A1A'][(k + e * 2) % 5];
        bouteilles += '<rect x="' + x + '" y="' + y + '" width="13" height="' + h + '" rx="3" fill="' + c + '"/><rect x="' + (x + 4) + '" y="' + (y - 8) + '" width="5" height="9" fill="' + c + '"/><rect x="' + (x + 2) + '" y="' + (y + 4) + '" width="3" height="' + (h - 8) + '" rx="1.5" fill="#fff" opacity=".28"/><rect x="' + (x + 1) + '" y="' + (y + h * .45) + '" width="11" height="7" fill="#EDE2C8" opacity=".85"/>'; } });
      var tabouret = function(x){ return ombre(x, 222, 18, 3, .9) + '<rect x="' + (x - 14) + '" y="186" width="28" height="6" rx="3" fill="#9A2A2A"/><path d="M' + (x - 10) + ' 192 L' + (x - 13) + ' 222 M' + (x + 10) + ' 192 L' + (x + 13) + ' 222 M' + (x - 11) + ' 208 H' + (x + 11) + '" stroke="#B8B8B8" stroke-width="2.4"/>'; };
      var suspension = function(x){ return '<path d="M' + x + ' 0 V40" stroke="#222" stroke-width="1.5"/><path d="M' + (x - 14) + ' 52 L' + (x - 6) + ' 40 L' + (x + 6) + ' 40 L' + (x + 14) + ' 52 Z" fill="#C97A2A"/><ellipse cx="' + x + '" cy="53" rx="7" ry="3" fill="#FFE6A0"/><path d="M' + (x - 14) + ' 53 L' + (x - 70) + ' 190 L' + (x + 70) + ' 190 L' + (x + 14) + ' 53 Z" fill="#FFD27A" opacity=".08"/>'; };
      return svg('<linearGradient id="cBm" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#3A1F2E"/><stop offset="1" stop-color="#5A2E3E"/></linearGradient><linearGradient id="cBc" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#8A5A30"/><stop offset="1" stop-color="#4E2E16"/></linearGradient>',
      '<rect width="800" height="260" fill="url(#cBm)"/><rect y="118" width="800" height="52" fill="#4A2434"/>' + [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15].map(function(k){ return '<rect x="' + (k * 52) + '" y="118" width="26" height="52" fill="#fff" opacity=".03"/>'; }).join('')
      + '<rect x="54" y="18" width="392" height="104" fill="#2A1520" opacity=".6"/><rect x="60" y="60" width="380" height="8" fill="#6B4425"/><rect x="60" y="110" width="380" height="8" fill="#6B4425"/>' + bouteilles
      + '<rect x="560" y="26" width="150" height="40" rx="8" fill="none" stroke="#FFC93C" stroke-width="3"/><rect x="560" y="26" width="150" height="40" rx="8" fill="#FFC93C" opacity=".08"/><text x="635" y="54" text-anchor="middle" font-size="20" fill="#FFC93C" font-family="Georgia" class="an-etoile" style="animation-duration:1.8s">BAR</text>'
      + '<rect x="560" y="84" width="60" height="80" fill="#E8D8B4" opacity=".9" transform="rotate(-3 590 124)"/><rect x="566" y="92" width="48" height="40" fill="#2E6A8A" transform="rotate(-3 590 112)"/><rect x="650" y="90" width="56" height="70" fill="#C9302A" opacity=".85" transform="rotate(2 678 125)"/>'
      + '<g transform="translate(300 20)"><circle r="5" fill="#888"/><g class="an-tourne"><path d="M0 0 L-52 -6 Q-56 0 -52 6 Z M0 0 L52 6 Q56 0 52 -6 Z" fill="#B8B0A0"/></g></g>'
      + suspension(130) + suspension(470)
      + '<rect y="170" width="800" height="90" fill="#2A1520"/>' + [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16].map(function(k){ return '<path d="M' + (k * 50) + ' 170 L' + (k * 50 - 60 + k * 7) + ' 260" stroke="#000" opacity=".22"/>'; }).join('') + [190, 214, 246].map(function(y){ return '<path d="M0 ' + y + ' H800" stroke="#000" opacity=".2"/>'; }).join('')
      + ombre(300, 184, 280, 8, .9) + '<rect x="40" y="146" width="520" height="8" fill="#B07A44"/><rect x="40" y="154" width="520" height="30" fill="url(#cBc)"/>' + [0, 1, 2, 3, 4, 5].map(function(k){ return '<rect x="' + (52 + k * 86) + '" y="158" width="74" height="22" fill="none" stroke="#2A1608" stroke-width="1.5" opacity=".5"/>'; }).join('')
      + '<rect x="40" y="181" width="520" height="3" fill="#C9A15A" opacity=".6"/><path d="M120 146 L124 134 L132 134 L136 146 Z" fill="#D9E8F0" opacity=".7"/><rect x="420" y="130" width="10" height="16" rx="2" fill="#2E6A34"/>'
      + tabouret(150) + tabouret(260) + tabouret(370) + tabouret(480)
      + ombre(690, 222, 50, 4, .9) + '<ellipse cx="690" cy="176" rx="46" ry="8" fill="#B07A44"/><path d="M690 184 V222 M672 222 H708" stroke="#3A2A1A" stroke-width="4"/><rect x="676" y="164" width="9" height="12" rx="2" fill="#B88A2A"/><path d="M700 168 L703 176 L697 176 Z" fill="#D9E8F0"/>'); },
    // Aube sur la mer : le soleil se lève, les étoiles s'effacent
    aube: function(){ return svg(ciel('cU', '#1B2A55', '#F2A65A'),
      '<rect width="800" height="260" fill="url(#cU)"/><g opacity=".7">' + etoiles(20) + '</g><g class="an-lever"><circle cx="400" cy="190" r="46" fill="#FFD27A"/><circle cx="400" cy="190" r="80" fill="#FFD27A" opacity=".25"/></g>'
      + '<rect x="0" y="190" width="800" height="70" fill="#20365F"/><g class="an-eau" opacity=".4">' + [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(function(k){ return '<path d="M' + (k * 80) + ' ' + (205 + (k % 3) * 14) + ' q20 -5 40 0 t40 0" stroke="#FFD27A" stroke-width="2" fill="none"/>'; }).join('') + '</g>'); },
    // Le monde et le balafon : globe qui tourne, lettres qui volent
    monde: function(){ return svg(ciel('cW', '#142554', '#2B4A8A'),
      '<rect width="800" height="260" fill="url(#cW)"/><g opacity=".6">' + etoiles(26) + '</g>'
      + '<circle cx="400" cy="110" r="78" fill="#2E6B8A"/><g class="an-tourne" style="animation-duration:24s"><ellipse cx="400" cy="110" rx="30" ry="78" fill="none" stroke="#9CD0E8" stroke-width="1.5"/><ellipse cx="400" cy="110" rx="60" ry="78" fill="none" stroke="#9CD0E8" stroke-width="1"/></g><path d="M322 110 L478 110 M330 80 L470 80 M330 140 L470 140" stroke="#9CD0E8" stroke-width="1"/>'
      + [[380, 100, '180px', '-60px'], [410, 120, '-210px', '-40px'], [395, 90, '120px', '70px']].map(function(l, k){ return '<g class="an-lettre" style="--dx:' + l[2] + ';--dy:' + l[3] + ';animation-delay:-' + k * 2.3 + 's"><rect x="' + l[0] + '" y="' + l[1] + '" width="26" height="18" rx="2" fill="#FFF7E0"/><path d="M' + l[0] + ' ' + l[1] + ' l13 10 l13 -10" stroke="#C9982E" fill="none" stroke-width="1.5"/></g>'; }).join('')
      + '<g transform="translate(250 205)">' + [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(function(k){ return '<rect x="' + k * 28 + '" y="' + (k % 2 ? 4 : 0) + '" width="22" height="' + (30 - k) + '" rx="3" fill="' + (k % 2 ? '#B4793F' : '#8A5A2B') + '"/>'; }).join('') + '<rect x="-10" y="34" width="320" height="6" fill="#5B3A1E"/></g>'); },
    // Plage de Grand-Bassam : vagues, cocotiers, oiseaux
    plage: function(){ return svg(ciel('cG', '#F2B47A', '#F7E1C1'),
      '<rect width="800" height="260" fill="url(#cG)"/><circle cx="600" cy="120" r="40" fill="#FFE1A6" opacity=".9"/>' + oiseaux('#4a3a3a')
      + '<rect x="0" y="140" width="800" height="60" fill="#3E7BA8"/><g class="an-eau" opacity=".5">' + [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(function(k){ return '<path d="M' + (k * 80) + ' ' + (154 + (k % 3) * 12) + ' q20 -5 40 0 t40 0" stroke="#E8F2FA" stroke-width="2" fill="none"/>'; }).join('') + '</g>'
      + '<path d="M0 196 Q200 186 400 194 T800 192 L800 260 L0 260 Z" fill="#E9CFA0"/>' + palmier(110, 210, 1) + palmier(690, 214, .85)); },
    // Rue de Yaoundé, années 1970 : maisons basses, poteaux, taxi
    rue: function(){
      var mais = [[14, 176, 74, '#E4CFA4', 'tole', [24, 116], 70], [212, 166, 86, '#D6B286', 'tole', [20, 120], 56], [404, 180, 70, '#E8D8B4', 'tole', [30, 134], 74], [604, 170, 82, '#D2AC7C', 'tole', [26, 122], 60]];
      return svg(ciel3('cR', '#86C4EA', '#CDE5EF', '#F4E8CF'),
      '<rect width="800" height="260" fill="url(#cR)"/>' + soleil(640, 38) + nuages(.75) + collines(150, 18, '#A9C2B6', 17, .8) + lisiere(160, '#7FA07A', 23, 28)
      + arbre(196, 192, .62, null, 19) + palmier2(590, 192, .62)
      + mais.map(function(m){ return maison(m[0], 192, 170, m[2], { mur:m[3], fen:m[5], porte:m[6], rh:20, tole:['#8F969B', '#9C8F82', '#868E94', '#99908A'][Math.round(m[0] / 200) % 4] }); }).join('')
      + sol('sR', 192, '#B08E64', '#8E6E48', 41)
      + '<rect x="0" y="192" width="800" height="7" fill="#C9B08A"/><rect x="0" y="199" width="800" height="2" fill="#5E4A30" opacity=".35"/>'
      + '<g transform="translate(372 196)">' + ombre(4, 1, 16, 3, .7) + '<path d="M-9 0 L-7 -14 L7 -14 L9 0 Z" fill="#B0563A"/><circle cx="-4" cy="-20" r="7" fill="#3E7A2E"/><circle cx="4" cy="-22" r="8" fill="#4C8C36"/></g>'); },
    // Forêt (contes) : grands arbres, lucioles
    foret: function(){ return svg(ciel3('cE', '#16301F', '#2E5634', '#5E8A4A'),
      '<rect width="800" height="260" fill="url(#cE)"/>' + lisiere(150, '#1E3A24', 101, 22) + lisiere(176, '#24462A', 103, 26)
      + arbre(90, 214, 1.15, ['#16341A', '#1E4422', '#2A5A2C', '#4E7E3E'], 105) + arbre(560, 216, 1.25, ['#16341A', '#1E4422', '#2A5A2C', '#4E7E3E'], 107)
      + bananier(300, 214, .9) + arbre(720, 212, .95, ['#1A3A1E', '#244A26', '#326432', '#5A8A46'], 109)
      + sol('sE', 205, '#2E4A22', '#1E3418', 111, '#4E7A3A')
      + '<g opacity=".1"><path d="M220 0 L240 0 L310 210 L262 210 Z" fill="#E8F0B0"/><path d="M455 0 L466 0 L505 210 L478 210 Z" fill="#E8F0B0"/></g>'
      + [0, 1, 2, 3, 4, 5, 6, 7].map(function(k){ return '<circle class="an-etoile" style="animation-delay:-' + k * 0.4 + 's" cx="' + (60 + k * 95) + '" cy="' + (120 + (k % 3) * 22) + '" r="2.5" fill="#F7F08A"/>'; }).join('')); },
    // Cour du village (chefferie, palabre) : grand arbre, tabourets, cases
    chefferie: function(){
      function poteau(x, y, h){ var s = '<rect x="' + (x - 5) + '" y="' + (y - h) + '" width="10" height="' + h + '" fill="#6B4425"/>', k;
        for(k = 0; k < h - 8; k += 12){ s += '<path d="M' + (x - 5) + ' ' + (y - h + k + 2) + ' l5 6 l5 -6" stroke="#E8C27A" stroke-width="1.6" fill="none"/><rect x="' + (x - 5) + '" y="' + (y - h + k + 9) + '" width="10" height="2" fill="#A0302A"/>'; }
        return s + '<rect x="' + (x - 3) + '" y="' + (y - h) + '" width="3" height="' + h + '" fill="#fff" opacity=".12"/>'; }
      function tabouret(x){ return ombre(x + 15, 211, 18, 3, .8) + '<path d="M' + x + ' 196 Q' + (x + 13) + ' 192 ' + (x + 26) + ' 196 L' + (x + 23) + ' 199 L' + (x + 21) + ' 206 L' + (x + 24) + ' 210 L' + (x + 2) + ' 210 L' + (x + 5) + ' 206 L' + (x + 3) + ' 199 Z" fill="#6B4425"/><ellipse cx="' + (x + 13) + '" cy="196" rx="13" ry="2.6" fill="#8E6238"/><rect x="' + (x + 9) + '" y="200" width="8" height="5" fill="#3A2412"/>'; }
      return svg(ciel3('cH', '#7FBCE2', '#C4E2EE', '#F2E6C9'),
      '<rect width="800" height="260" fill="url(#cH)"/>' + soleil(120, 44) + nuages(.65)
      + collines(140, 34, '#A4BDB8', 29, .9) + collines(160, 24, '#86A592', 37) + lisiere(176, '#5E8A56', 43, 30)
      + bananier(214, 182, .8) + palmier2(250, 184, .7)
      + sol('sH', 180, '#C49058', '#A87240', 51, '#6E8A3A')
      + [0, 1, 2, 3, 4, 5].map(function(k){ return '<path d="M' + (260 + k * 50) + ' 222 q20 -4 40 0" stroke="#D9AA72" stroke-width="2" opacity=".35" fill="none"/>'; }).join('')
      + maison(40, 188, 126, 56, { mur:'#8A5A30', bambou:true, porte:52, toit:'paille', rh:96, ov:14, bois:'#3A2412' }) + poteau(88, 188, 40) + poteau(118, 188, 40)
      + maison(640, 188, 108, 50, { mur:'#B8773E', brique:true, porte:44, toit:'paille', rh:70, ov:12 })
      + arbre(400, 192, 1.05, ['#2A5226', '#376E31', '#4E8A3A', '#7FB458'], 61)
      + [300, 360, 440, 500].map(tabouret).join('')); },
    // Ville de Tanga / quartier colonial : rues, maisons à étage, poussière
    ville: function(){
      function immeuble(x, w, et, mur, volet){ var base = 190, eh = 44, top = base - et * eh, s = '<path d="M' + x + ' ' + base + ' L' + (x + w) + ' ' + base + ' L' + (x + w + 30) + ' ' + (base + 8) + ' L' + (x + 20) + ' ' + (base + 8) + ' Z" fill="#1A1208" opacity=".16"/>', e, k;
        s += '<rect x="' + x + '" y="' + top + '" width="' + w + '" height="' + (base - top) + '" fill="' + mur + '"/><rect x="' + x + '" y="' + top + '" width="' + w + '" height="' + (base - top) + '" fill="url(#vgMur)"/>';
        s += '<rect x="' + (x - 4) + '" y="' + (top - 8) + '" width="' + (w + 8) + '" height="8" fill="' + nuance(mur, -.25) + '"/><rect x="' + (x - 4) + '" y="' + top + '" width="' + (w + 8) + '" height="3" fill="#000" opacity=".18"/>';
        for(k = 0; k < Math.floor(w / 46); k++){ var ax = x + 10 + k * 46;
          s += '<path d="M' + ax + ' ' + base + ' V' + (base - 26) + ' Q' + (ax + 17) + ' ' + (base - 42) + ' ' + (ax + 34) + ' ' + (base - 26) + ' V' + base + ' Z" fill="#3A2A1E" opacity=".82"/>'; }
        for(e = 1; e < et; e++){ var ey = base - (e + 1) * eh;
          for(k = 0; k < Math.floor(w / 46); k++){ var wx = x + 12 + k * 46;
            s += '<rect x="' + wx + '" y="' + (ey + 8) + '" width="30" height="28" fill="#2E3A44"/><rect x="' + (wx - 7) + '" y="' + (ey + 8) + '" width="8" height="28" fill="' + volet + '"/><rect x="' + (wx + 29) + '" y="' + (ey + 8) + '" width="8" height="28" fill="' + volet + '"/>'
              + '<rect x="' + (wx + 4) + '" y="' + (ey + 37) + '" width="5" height="' + (eh - 37) + '" fill="#000" opacity=".06"/>'; }
          if(e === 1){ s += '<rect x="' + (x - 6) + '" y="' + (ey + 36) + '" width="' + (w + 12) + '" height="4" fill="' + nuance(mur, -.3) + '"/>';
            for(k = x - 4; k < x + w + 4; k += 7){ s += '<rect x="' + k + '" y="' + (ey + 24) + '" width="1.6" height="12" fill="#2A2A2A" opacity=".75"/>'; }
            s += '<rect x="' + (x - 6) + '" y="' + (ey + 23) + '" width="' + (w + 12) + '" height="2" fill="#2A2A2A" opacity=".8"/>'; } }
        return s; }
      return svg(ciel3('cY', '#A9C9DA', '#D9DCCB', '#EAD9B4'),
      '<rect width="800" height="260" fill="url(#cY)"/>' + soleil(700, 42, '#FFF0C8') + nuages(.5) + collines(150, 16, '#B9C2AE', 71, .7)
      + immeuble(20, 200, 3, '#E9E1CC', '#3F6B5A') + immeuble(244, 196, 2, '#E3CFA8', '#8A4A2A') + immeuble(462, 200, 3, '#DCD6C4', '#2E5A7A')
      + arbre(700, 192, .78, ['#2E5A2A', '#3D7535', '#4E8A3E', '#7FB458'], 81, '#E2502A') + palmier2(214, 192, .62)
      + sol('sY', 190, '#B48E5E', '#957049', 91)
      + '<rect x="0" y="190" width="800" height="8" fill="#CDB896"/><rect x="0" y="198" width="800" height="3" fill="#5A4630" opacity=".45"/>'); }
  };
  function VRT_port(drapeau){
    return svg(ciel('cW2', '#86C1E0', '#EFE6CF'),
      '<rect width="800" height="260" fill="url(#cW2)"/>' + nuages(.8) + oiseaux() + '<rect x="0" y="150" width="800" height="110" fill="#5C8DA8"/>'
      + '<g class="an-eau" opacity=".45">' + [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(function(k){ return '<path d="M' + (k * 80) + ' ' + (170 + (k % 3) * 22) + ' q20 -5 40 0 t40 0" stroke="#E8F2FA" stroke-width="2" fill="none"/>'; }).join('') + '</g>'
      + '<g class="an-tangage"><path d="M520 176 L680 176 L660 196 L540 196 Z" fill="#4A2F17"/><rect x="596" y="70" width="5" height="106" fill="#3A2A1A"/><path d="M601 76 L660 150 L601 150 Z" fill="#F5F0E1"/><path d="M596 84 L548 150 L596 150 Z" fill="#EDE6D6"/></g>'
      + '<path d="M0 150 L300 150 L330 172 L0 172 Z" fill="#C9A26A"/>' + palmier(60, 160, .8) + case_(200, 158, .6)
      + (drapeau ? '<rect x="268" y="40" width="5" height="114" fill="#3a3a3a"/><g class="an-drapeau"><rect x="273" y="42" width="54" height="11" fill="#111"/><rect x="273" y="53" width="54" height="11" fill="#fff"/><rect x="273" y="64" width="54" height="11" fill="#C0392B"/></g>' : ''));
  }
})();
