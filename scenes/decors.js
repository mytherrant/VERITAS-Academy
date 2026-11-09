/* Scènes vivantes — décors animés (SVG, 800 × 260).
 * Animations par classes .an-* (transform / opacity seulement, voir scene.css). */
(function(){
  'use strict';
  function svg(fond, corps){
    return '<svg viewBox="0 0 800 260" preserveAspectRatio="xMidYMax slice" aria-hidden="true"><defs>' + fond + '</defs>' + corps + '</svg>';
  }
  function ciel(id, haut, bas){ return '<linearGradient id="' + id + '" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="' + haut + '"/><stop offset="1" stop-color="' + bas + '"/></linearGradient>'; }
  function nuages(op){
    return '<g opacity="' + (op || .6) + '"><g class="an-nuage"><ellipse cx="0" cy="50" rx="46" ry="14" fill="#fff"/><ellipse cx="30" cy="42" rx="30" ry="14" fill="#fff"/></g>'
      + '<g class="an-nuage" style="animation-delay:-18s"><ellipse cx="0" cy="80" rx="38" ry="11" fill="#fff"/><ellipse cx="24" cy="73" rx="24" ry="11" fill="#fff"/></g></g>';
  }
  function oiseaux(c){ c = c || '#142554';
    return '<g class="an-oiseau"><path d="M0 0 q6 -6 12 0 q6 -6 12 0" stroke="' + c + '" stroke-width="2.4" fill="none"/></g>'
      + '<g class="an-oiseau" style="animation-delay:-6s"><path d="M0 20 q5 -5 10 0 q5 -5 10 0" stroke="' + c + '" stroke-width="2" fill="none"/></g>'; }
  function palmier(x, y, s){ s = s || 1;
    return '<g transform="translate(' + x + ' ' + y + ') scale(' + s + ')"><path d="M0 0 Q6 -60 2 -110" stroke="#5B3A1E" stroke-width="7" fill="none"/>'
      + '<g class="an-feuille"><path d="M2 -110 Q-40 -120 -70 -90 Q-35 -105 2 -106 Z M2 -110 Q40 -125 72 -96 Q38 -108 2 -106 Z M2 -110 Q-20 -140 -50 -140 Q-20 -128 2 -108 Z M2 -110 Q24 -142 56 -138 Q24 -128 2 -108 Z" fill="#2F6B3A"/></g></g>'; }
  function foule(y, c, n){ var s = '', k; for(k = 0; k < (n || 16); k++){ var x = 20 + k * 50 + (k % 2) * 12; s += '<circle cx="' + x + '" cy="' + (y - 34) + '" r="10" fill="' + c + '"/><path d="M' + (x - 15) + ' ' + y + ' Q' + x + ' ' + (y - 34) + ' ' + (x + 15) + ' ' + y + ' Z" fill="' + c + '"/>'; } return s; }
  function case_(x, y, s){ s = s || 1;
    return '<g transform="translate(' + x + ' ' + y + ') scale(' + s + ')"><rect x="-40" y="-50" width="80" height="50" fill="#B4793F"/><path d="M-52 -48 L0 -96 L52 -48 Z" fill="#7A5A2E"/><rect x="-10" y="-30" width="20" height="30" fill="#4A2F17"/></g>'; }
  function lampe(x, y){ return '<g transform="translate(' + x + ' ' + y + ')"><rect x="-8" y="0" width="16" height="22" rx="3" fill="#8a6a2a"/><ellipse class="an-flamme" cx="0" cy="-6" rx="5" ry="10" fill="#FFC93C"/><circle cx="0" cy="-4" r="38" fill="#FFC93C" opacity=".12"/></g>'; }
  function etoiles(n){ var s = '', k; for(k = 0; k < (n || 24); k++){ s += '<circle class="an-etoile" style="animation-delay:-' + (k % 5) * 0.6 + 's" cx="' + ((k * 97) % 800) + '" cy="' + (10 + (k * 37) % 110) + '" r="' + (k % 3 ? 1.2 : 1.8) + '" fill="#fff"/>'; } return s; }

  window.VRT_DECORS = {
    // Place de cérémonie coloniale : soleil, mât, cercle de chaux, foule
    place: function(){ return svg(ciel('cP', '#F7B54A', '#FBE3A6'),
      '<rect width="800" height="260" fill="url(#cP)"/><circle class="an-soleil" cx="690" cy="52" r="34" fill="#FFF4C2"/><circle cx="690" cy="52" r="60" fill="#FFF4C2" opacity=".25"/>' + nuages(.35)
      + '<rect x="0" y="170" width="800" height="90" fill="#D9B074"/>' + '<g opacity=".55">' + foule(178, '#5B3A1E', 17) + '</g>'
      + '<rect x="92" y="40" width="5" height="150" fill="#3a3a3a"/><g class="an-drapeau"><rect x="97" y="42" width="22" height="34" fill="#1F3A8A"/><rect x="119" y="42" width="22" height="34" fill="#fff"/><rect x="141" y="42" width="22" height="34" fill="#C0392B"/></g>'
      + '<rect x="560" y="130" width="190" height="46" fill="#7A2E2E"/><rect x="560" y="122" width="190" height="10" fill="#E9E3CF"/><path d="M560 122 L655 96 L750 122 Z" fill="#E9E3CF"/>'
      + '<ellipse cx="400" cy="232" rx="170" ry="20" fill="none" stroke="#fff" stroke-width="5" stroke-dasharray="14 8"/>'); },
    // Salon du XVIIe siècle : rideaux, lustre, table nappée, porte
    salon17: function(){ return svg(ciel('cS', '#3B2A4D', '#5E4A6E'),
      '<rect width="800" height="260" fill="url(#cS)"/><rect x="0" y="200" width="800" height="60" fill="#3A2618"/>'
      + '<g opacity=".9"><rect x="90" y="30" width="110" height="150" fill="#9DB4D6"/><path d="M80 24 Q120 110 96 190 L70 190 L70 24 Z M210 24 Q170 110 194 190 L220 190 L220 24 Z" fill="#8E2A3C"/>'
      + '<rect x="600" y="30" width="110" height="150" fill="#9DB4D6"/><path d="M590 24 Q630 110 606 190 L580 190 L580 24 Z M720 24 Q680 110 704 190 L730 190 L730 24 Z" fill="#8E2A3C"/></g>'
      + '<g class="an-tangage" style="animation-duration:6s"><path d="M400 0 L400 26" stroke="#C9982E" stroke-width="2"/><path d="M360 40 Q400 26 440 40 Q400 52 360 40 Z" fill="#C9982E"/>' + [366, 383, 400, 417, 434].map(function(x){ return '<ellipse class="an-flamme" cx="' + x + '" cy="32" rx="2.5" ry="5" fill="#FFE08A"/>'; }).join('') + '</g>'
      + '<rect x="250" y="150" width="300" height="12" rx="3" fill="#6B3E1E"/><path d="M240 150 L560 150 L580 236 L220 236 Z" fill="#7E1F2E"/><path d="M240 150 L560 150 L566 162 L234 162 Z" fill="#C9982E" opacity=".7"/>'
      + '<rect x="745" y="70" width="52" height="135" fill="#5A3A22"/><circle cx="756" cy="140" r="3" fill="#C9982E"/>'); },
    // Village yorouba : arbre odan, cases, mur de l'école
    village: function(){ return svg(ciel('cV', '#7EC3E8', '#E8F3D9'),
      '<rect width="800" height="260" fill="url(#cV)"/>' + nuages(.8) + oiseaux() + '<rect x="0" y="175" width="800" height="85" fill="#C98F4E"/>'
      + case_(600, 180, .9) + case_(700, 185, .75) + '<rect x="40" y="110" width="200" height="70" fill="#E9DFC7"/><rect x="40" y="104" width="200" height="10" fill="#8A6A3A"/><rect x="70" y="128" width="80" height="34" fill="#2E4A3A"/><text x="110" y="150" text-anchor="middle" font-size="11" fill="#fff" font-family="Georgia">ÉCOLE</text>'
      + '<g class="an-feuille"><rect x="372" y="90" width="20" height="100" fill="#5B3A1E"/><ellipse cx="382" cy="78" rx="110" ry="52" fill="#3E7A3A"/><ellipse cx="330" cy="92" rx="60" ry="34" fill="#356B32"/><ellipse cx="440" cy="94" rx="64" ry="34" fill="#46883F"/></g>'); },
    // Fleuve : jungle, eau qui coule, vapeur fumant
    fleuve: function(){ return svg(ciel('cF', '#4D6B5A', '#C9C9A0'),
      '<rect width="800" height="260" fill="url(#cF)"/><path d="M0 120 Q60 70 120 110 Q170 60 230 105 Q290 65 350 112 L350 160 L0 160 Z" fill="#1F3D2A"/><path d="M450 112 Q520 62 590 105 Q650 58 720 100 Q760 80 800 96 L800 160 L450 160 Z" fill="#1F3D2A"/>'
      + '<rect x="0" y="150" width="800" height="110" fill="#5E5A3A"/><g class="an-eau" opacity=".5">' + [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(function(k){ return '<path d="M' + (k * 80) + ' ' + (180 + (k % 3) * 22) + ' q20 -6 40 0 t40 0" stroke="#D9D2A8" stroke-width="2" fill="none"/>'; }).join('') + '</g>'
      + '<g class="an-tangage"><rect x="300" y="168" width="200" height="22" rx="6" fill="#E9E3CF"/><rect x="340" y="146" width="110" height="22" fill="#C9C1A6"/><rect x="420" y="112" width="14" height="36" fill="#3A3A3A"/><path d="M296 190 L504 190 L490 202 L310 202 Z" fill="#3A2A1A"/></g>'
      + '<circle class="an-fumee" cx="427" cy="104" r="10" fill="#ddd"/><circle class="an-fumee" style="animation-delay:-1.7s" cx="427" cy="104" r="10" fill="#ccc"/>'); },
    // Salon de deuil, Europe : fenêtre au crépuscule, piano, bougie
    deuil: function(){ return svg(ciel('cD', '#1C1A2A', '#2E2A3E'),
      '<rect width="800" height="260" fill="url(#cD)"/><rect x="520" y="30" width="150" height="160" fill="#3E4A78"/><rect x="590" y="30" width="6" height="160" fill="#1C1A2A"/><rect x="520" y="105" width="150" height="6" fill="#1C1A2A"/>'
      + '<rect x="0" y="205" width="800" height="55" fill="#141220"/><path d="M80 150 L300 150 Q320 150 320 170 L320 186 L80 186 Z" fill="#0A0A10"/><rect x="92" y="186" width="8" height="30" fill="#0A0A10"/><rect x="300" y="186" width="8" height="30" fill="#0A0A10"/>'
      + '<rect x="380" y="60" width="70" height="90" fill="none" stroke="#C9982E" stroke-width="4"/><circle cx="415" cy="96" r="16" fill="#555"/>' + lampe(470, 150)); },
    // Intérieur d'une maison douala, la nuit : lampe-tempête, fenêtre, lune
    case_nuit: function(){ return svg(ciel('cC', '#3A2516', '#5A3A22'),
      '<rect width="800" height="260" fill="url(#cC)"/>' + [0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map(function(k){ return '<rect x="' + k * 80 + '" y="0" width="3" height="200" fill="#2A190E"/>'; }).join('')
      + '<rect x="560" y="40" width="130" height="100" fill="#0F1A3A"/><circle cx="640" cy="80" r="18" fill="#F4F1D0"/>' + '<g opacity=".8">' + etoiles(6).replace(/cx="(\d+)"/g, function(m, x){ return 'cx="' + (565 + (+x % 120)) + '"'; }).replace(/cy="(\d+)"/g, function(m, y){ return 'cy="' + (45 + (+y % 90)) + '"'; }) + '</g>'
      + '<rect x="0" y="200" width="800" height="60" fill="#2A190E"/><rect x="120" y="210" width="200" height="16" rx="3" fill="#B98A4A"/>' + lampe(220, 180)); },
    // Tribunal colonial
    tribunal: function(){ return svg(ciel('cT', '#2A2A30', '#45454F'),
      '<rect width="800" height="260" fill="url(#cT)"/><rect x="230" y="70" width="340" height="110" fill="#4A2E1A"/><rect x="220" y="62" width="360" height="12" fill="#6B4425"/>'
      + '<rect x="330" y="50" width="40" height="14" fill="#EDE6D6"/><rect x="380" y="52" width="40" height="12" fill="#EDE6D6"/><rect x="0" y="200" width="800" height="60" fill="#1E1E24"/>' + lampe(600, 60)); },
    // Agora grecque : colonnes, olivier, soleil
    agora: function(){ return svg(ciel('cA', '#8EC5E8', '#F3EBD6'),
      '<rect width="800" height="260" fill="url(#cA)"/><circle class="an-soleil" cx="120" cy="50" r="26" fill="#FFF1B8"/>' + nuages(.7)
      + '<path d="M420 70 L620 70 L520 36 Z" fill="#E9E1CC"/><rect x="420" y="70" width="200" height="10" fill="#DDD3BA"/>' + [430, 470, 510, 550, 590].map(function(x){ return '<rect x="' + x + '" y="80" width="20" height="110" fill="#F2EBD8"/>'; }).join('')
      + '<rect x="0" y="190" width="800" height="70" fill="#D8C9A3"/><g class="an-feuille"><rect x="160" y="120" width="12" height="74" fill="#6B5232"/><ellipse cx="166" cy="110" rx="56" ry="30" fill="#7D8F4A"/></g>'); },
    // Port de Douala, 1884 : Wouri, voiliers, palmiers, cases
    port: function(){ return VRT_port(false); },
    port_drapeau: function(){ return VRT_port(true); },
    // Salle de classe
    classe: function(){
      var t = (window.SCENE && window.SCENE.tableau) || ['', ''];
      t = t.map(function(x){ return String(x).replace(/[&<>]/g, function(c){ return { '&':'&amp;', '<':'&lt;', '>':'&gt;' }[c]; }); });
      return svg(ciel('cK', '#E9E3D3', '#F6F1E6'),
      '<rect width="800" height="260" fill="url(#cK)"/><rect x="200" y="30" width="400" height="120" rx="6" fill="#23432F" stroke="#8A6A3A" stroke-width="8"/>'
      + '<text x="400" y="80" text-anchor="middle" font-size="22" fill="#E9F0E9" font-family="Georgia">' + t[0] + '</text><text x="400" y="112" text-anchor="middle" font-size="15" fill="#C9D9C9" font-family="Georgia">' + (t[1] || '') + '</text>'
      + '<rect x="40" y="40" width="110" height="90" fill="#BFE0F2"/><rect x="650" y="40" width="110" height="90" fill="#BFE0F2"/><rect x="0" y="200" width="800" height="60" fill="#B59A72"/>' + [80, 250, 420, 590].map(function(x){ return '<rect x="' + x + '" y="186" width="130" height="10" fill="#7A5A32"/>'; }).join('')); },
    // Marché : étals, auvents rayés, fruits
    marche: function(){ return svg(ciel('cM', '#8FD0F0', '#FBEED2'),
      '<rect width="800" height="260" fill="url(#cM)"/>' + nuages(.8) + '<rect x="0" y="190" width="800" height="70" fill="#C79B62"/>'
      + [60, 330, 600].map(function(x, k){ var c = ['#C0392B', '#1F6F78', '#E8A413'][k];
        return '<rect x="' + x + '" y="110" width="150" height="80" fill="#8A5A2B"/><path d="M' + (x - 10) + ' 80 L' + (x + 160) + ' 80 L' + (x + 150) + ' 110 L' + x + ' 110 Z" fill="' + c + '"/>'
          + [0, 1, 2, 3].map(function(n){ return '<rect x="' + (x + n * 40) + '" y="80" width="20" height="30" fill="#fff" opacity=".55"/>'; }).join('')
          + [0, 1, 2, 3, 4].map(function(n){ return '<circle cx="' + (x + 20 + n * 27) + '" cy="124" r="11" fill="' + ['#F2A33A', '#E2C044', '#6BA84F', '#E07B39', '#F2D04A'][n] + '"/>'; }).join(''); }).join('')
      + '<g opacity=".45">' + foule(200, '#3A2A1A', 16) + '</g>'); },
    // Couloir d'école
    couloir: function(){ return svg(ciel('cO', '#E6E1D6', '#F4F0E8'),
      '<rect width="800" height="260" fill="url(#cO)"/><path d="M0 200 L800 200 L800 260 L0 260 Z" fill="#B8AFA0"/>' + [80, 300, 520].map(function(x, k){ return '<rect x="' + x + '" y="70" width="80" height="130" fill="#6B4A2E"/><rect x="' + (x + 8) + '" y="44" width="64" height="20" rx="3" fill="#142554"/><text x="' + (x + 40) + '" y="58" text-anchor="middle" font-size="10" fill="#FFC93C" font-weight="700">' + ['AULA 3', 'INFORMÁTICA', 'BIBLIOTECA'][k] + '</text>'; }).join('')
      + '<path d="M690 200 L690 180 L715 180 L715 160 L740 160 L740 140 L765 140 L765 120 L800 120 L800 200 Z" fill="#9C9384"/>'); },
    // Bar de Douala, années 1970 : comptoir, bouteilles, ventilateur
    bar: function(){ return svg(ciel('cB', '#3A1F2E', '#5A2E3E'),
      '<rect width="800" height="260" fill="url(#cB)"/><rect x="560" y="26" width="150" height="40" rx="8" fill="none" stroke="#FFC93C" stroke-width="3"/><text x="635" y="54" text-anchor="middle" font-size="20" fill="#FFC93C" font-family="Georgia" class="an-etoile" style="animation-duration:1.8s">BAR</text>'
      + '<rect x="60" y="60" width="380" height="8" fill="#6B4425"/><rect x="60" y="110" width="380" height="8" fill="#6B4425"/>' + [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(function(k){ return '<rect x="' + (72 + k * 34) + '" y="' + (k % 2 ? 76 : 80) + '" width="12" height="' + (k % 2 ? 34 : 30) + '" rx="3" fill="' + ['#3E7A3A', '#8A3B2E', '#C9982E'][k % 3] + '"/>'; }).join('')
      + '<g transform="translate(300 20)"><g class="an-tourne"><rect x="-50" y="-3" width="100" height="6" rx="3" fill="#ccc"/><rect x="-3" y="-50" width="6" height="100" rx="3" fill="#ccc" opacity=".0"/></g></g>'
      + '<rect x="0" y="170" width="800" height="90" fill="#2A1520"/><rect x="40" y="150" width="520" height="30" fill="#6B4425"/>'); },
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
    rue: function(){ return svg(ciel('cR', '#9FD0EC', '#F4E8CF'),
      '<rect width="800" height="260" fill="url(#cR)"/>' + nuages(.8) + [20, 210, 420, 610].map(function(x, k){ return '<rect x="' + x + '" y="' + (90 + (k % 2) * 16) + '" width="170" height="' + (100 - (k % 2) * 16) + '" fill="' + ['#E7D3A8', '#D9B98A', '#EAD9B4', '#D5B07E'][k] + '"/><path d="M' + (x - 6) + ' ' + (92 + (k % 2) * 16) + ' L' + (x + 176) + ' ' + (92 + (k % 2) * 16) + ' L' + (x + 160) + ' ' + (74 + (k % 2) * 16) + ' L' + (x + 10) + ' ' + (74 + (k % 2) * 16) + ' Z" fill="#8A8F96"/><rect x="' + (x + 30) + '" y="140" width="30" height="40" fill="#5A3A22"/><rect x="' + (x + 100) + '" y="130" width="40" height="26" fill="#9DB4D6"/>'; }).join('')
      + '<rect x="0" y="190" width="800" height="70" fill="#9A7A56"/><rect x="0" y="214" width="800" height="4" fill="#C9B08A"/>'); },
    // Forêt (contes) : grands arbres, lucioles
    foret: function(){ return svg(ciel('cE', '#1E3A2A', '#5E8A4A'),
      '<rect width="800" height="260" fill="url(#cE)"/>' + [40, 170, 330, 520, 680].map(function(x, k){ return '<rect x="' + x + '" y="40" width="' + (26 + k % 2 * 10) + '" height="170" fill="#3A2A18"/><ellipse class="an-feuille" cx="' + (x + 14) + '" cy="40" rx="90" ry="54" fill="' + (k % 2 ? '#2D5A2A' : '#356B32') + '"/>'; }).join('')
      + '<rect x="0" y="200" width="800" height="60" fill="#2A4A22"/>' + [0, 1, 2, 3, 4, 5, 6, 7].map(function(k){ return '<circle class="an-etoile" style="animation-delay:-' + k * 0.4 + 's" cx="' + (60 + k * 95) + '" cy="' + (120 + (k % 3) * 22) + '" r="2.5" fill="#F7F08A"/>'; }).join('')); },
    // Cour du village (chefferie, palabre) : grand arbre, tabourets, cases
    chefferie: function(){ return svg(ciel('cH', '#8CC7E6', '#F2E6C9'),
      '<rect width="800" height="260" fill="url(#cH)"/>' + nuages(.7) + '<rect x="0" y="180" width="800" height="80" fill="#B9854A"/>' + case_(110, 186, .9) + case_(690, 186, .9)
      + '<g class="an-feuille"><rect x="390" y="96" width="22" height="94" fill="#5B3A1E"/><ellipse cx="400" cy="84" rx="120" ry="50" fill="#3E7A3A"/></g>'
      + [300, 360, 440, 500].map(function(x){ return '<rect x="' + x + '" y="196" width="26" height="14" rx="3" fill="#6B4425"/>'; }).join('')); },
    // Ville de Tanga / quartier colonial : rues, maisons à étage, poussière
    ville: function(){ return svg(ciel('cY', '#C7B58A', '#EAD9B4'),
      '<rect width="800" height="260" fill="url(#cY)"/>' + [30, 250, 470].map(function(x){ return '<rect x="' + x + '" y="60" width="190" height="130" fill="#E9E1CC"/><rect x="' + x + '" y="56" width="190" height="8" fill="#A0503A"/>' + [0, 1, 2].map(function(n){ return '<rect x="' + (x + 20 + n * 58) + '" y="80" width="34" height="30" fill="#4A6A8A"/><rect x="' + (x + 20 + n * 58) + '" y="130" width="34" height="30" fill="#4A6A8A"/>'; }).join(''); }).join('')
      + palmier(735, 200, .8) + '<rect x="0" y="190" width="800" height="70" fill="#B08A5A"/>'); }
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
