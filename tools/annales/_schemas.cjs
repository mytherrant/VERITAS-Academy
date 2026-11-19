/* Schémas des annales, redessinés en SVG d'après les scans officiels (exactitude, poids).
   Chaque fonction rend un <svg> ; tools/annales.cjs remplace <!--schema:nom--> dans les sources.
   Couleur : currentColor (s'adapte au thème) ; les tracés « à compléter » restent ceux du sujet. */
"use strict";
const f = n => Math.round(n * 10) / 10;
const svg = (w, h, corps, titre) => '<svg class="ax-svg" viewBox="0 0 ' + w + " " + h + '" width="' + w + '" role="img" aria-label="' + titre.replace(/"/g, "&quot;") + '" xmlns="http://www.w3.org/2000/svg"><title>' + titre + "</title>" +
  '<g fill="none" stroke="currentColor" stroke-width="1.6" shape-rendering="geometricPrecision" text-rendering="geometricPrecision" stroke-linejoin="round" stroke-linecap="round" font-size="14" font-family="inherit">' + corps + "</g></svg>";
const L = (a, b, x = "") => '<line x1="' + f(a[0]) + '" y1="' + f(a[1]) + '" x2="' + f(b[0]) + '" y2="' + f(b[1]) + '"' + x + "/>";
const P = (pts, x = "") => '<polyline points="' + pts.map(p => f(p[0]) + "," + f(p[1])).join(" ") + '"' + x + "/>";
const T = (p, s, x = "") => '<text x="' + f(p[0]) + '" y="' + f(p[1]) + '" fill="currentColor" stroke="none"' + x + ">" + s + "</text>";
const POINTILLE = ' stroke-dasharray="5 4"';
// petit carré d'angle droit au sommet O, entre les directions u et v (unitaires)
const droit = (O, u, v, k = 10) => P([[O[0] + u[0] * k, O[1] + u[1] * k], [O[0] + (u[0] + v[0]) * k, O[1] + (u[1] + v[1]) * k], [O[0] + v[0] * k, O[1] + v[1] * k]]);
const unit = (a, b) => { const d = Math.hypot(b[0] - a[0], b[1] - a[1]); return [(b[0] - a[0]) / d, (b[1] - a[1]) / d]; };
// codage d'égalité (traits perpendiculaires au milieu du segment)
const code = (a, b, n = 2) => { const m = [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2], u = unit(a, b), v = [-u[1], u[0]]; let s = "";
  for (let i = 0; i < n; i++) { const c = [m[0] + u[0] * (i - (n - 1) / 2) * 5, m[1] + u[1] * (i - (n - 1) / 2) * 5]; s += L([c[0] - v[0] * 6, c[1] - v[1] * 6], [c[0] + v[0] * 6, c[1] + v[1] * 6]); } return s; };

const S = {};

// BEPC 2026 maths : triangle ABC rectangle en B, AE = 2, AC = 8, angle BAC = 30°, (EF) // (BC).
// Pointe de flèche pleine en p, orientée depuis q.
function fleche(p, q, t) { t = t || 7; const u = unit(q, p), n = [-u[1], u[0]];
  return '<path d="M' + f(p[0]) + ' ' + f(p[1]) + 'L' + f(p[0] - t * u[0] + t / 2 * n[0]) + ' ' + f(p[1] - t * u[1] + t / 2 * n[1]) + 'L' + f(p[0] - t * u[0] - t / 2 * n[0]) + ' ' + f(p[1] - t * u[1] - t / 2 * n[1]) + 'Z" fill="currentColor" stroke="none"/>'; }

S["bepc-2026-maths-triangle"] = () => {
  const k = 28, A = [70, 24], B = [70, 24 + 4 * Math.sqrt(3) * k], C = [70 + 4 * k, B[1]], E = [70, 24 + 2 * k];
  const F = [70 + 4 * k * (2 * k) / (B[1] - 24), E[1]];
  return svg(250, 250, L(A, B) + L(B, C) + L(A, C) + L(E, F) + droit(B, [0, -1], [1, 0]) +
    '<path d="M70 52 A 28 28 0 0 1 84 48.3"/>' + T([74, 76], "30°", ' font-size="11"') +
    L([48, A[1]], [48, E[1]], ' stroke-width="1"') + fleche([48, A[1]], [48, E[1]]) + fleche([48, E[1]], [48, A[1]]) + T([8, 56], "2 cm") +
    L([A[0] + 14, A[1] - 6], [C[0] + 14, C[1] - 6], ' stroke-width="1"') + fleche([C[0] + 14, C[1] - 6], [A[0] + 14, A[1] - 6]) + fleche([A[0] + 14, A[1] - 6], [C[0] + 14, C[1] - 6]) + T([150, 110], "8 cm") +
    T([62, 18], "A") + T([56, E[1] + 5], "E") + T([F[0] + 9, F[1] + 5], "F") + T([58, B[1] + 16], "B") + T([C[0] + 4, C[1] + 16], "C"),
    "Triangle ABC rectangle en B ; E sur [AB] avec AE = 2 cm ; F sur [AC] avec (EF) parallèle à (BC) ; AC = 8 cm ; angle BAC = 30°.");
};

// BEPC 2024 maths : cercle (C) de centre O circonscrit à ABC rectangle en C (AB = 5, BC = 3, AC = 4), AE = 4, (EF) // (BC), M sur le cercle.
S["bepc-2024-maths-cercle"] = () => {
  const k = 38, O = [150, 125], r = 2.5 * k, B = [O[0] - r, O[1]], A = [O[0] + r, O[1]];
  const C = [B[0] + 3 * k * 0.6, B[1] - 3 * k * 0.8], E = [A[0] - 4 * k, O[1]], F = [A[0] + 0.8 * (C[0] - A[0]), A[1] + 0.8 * (C[1] - A[1])];
  const M = [O[0] + r * Math.cos(Math.PI / 3), O[1] + r * Math.sin(Math.PI / 3)];
  return svg(300, 240, '<circle cx="' + O[0] + '" cy="' + O[1] + '" r="' + r + '"/>' + L(B, A) + L(B, C) + L(C, A) + L(E, F) +
    L(B, M, POINTILLE) + L(C, M, POINTILLE) + droit(C, unit(C, B), unit(C, A)) + droit(F, unit(F, A), unit(F, E), 8) +
    '<circle cx="' + O[0] + '" cy="' + O[1] + '" r="2.5" fill="currentColor"/>' +
    T([B[0] - 16, B[1] + 5], "B") + T([A[0] + 6, A[1] + 5], "A") + T([C[0] - 6, C[1] - 8], "C") + T([E[0] - 4, E[1] + 18], "E") +
    T([F[0] + 2, F[1] - 8], "F") + T([O[0] - 4, O[1] + 18], "O") + T([M[0] + 6, M[1] + 10], "M") + T([O[0] + r - 6, O[1] - r + 22], "(C)"),
    "Cercle (C) de centre O, de diamètre [AB], circonscrit au triangle ABC rectangle en C ; E sur [AB], F sur [AC] avec (EF) parallèle à (BC) ; M point du cercle.");
};

// BEPC 2024 maths : pyramide régulière SABCD, hauteur SM, section EFGH par le plan parallèle à la base passant par N (milieu de [SM]).
S["bepc-2024-maths-pyramide"] = () => {
  const A = [30, 232], B = [172, 252], C = [236, 198], D = [94, 178], M = [(A[0] + C[0]) / 2, (A[1] + C[1]) / 2], S0 = [M[0], 28];
  const mi = (p) => [(p[0] + S0[0]) / 2, (p[1] + S0[1]) / 2], E = mi(A), F = mi(B), G = mi(C), H = mi(D), N = mi(M);
  return svg(270, 270, L(S0, A) + L(S0, B) + L(S0, C) + L(S0, D, POINTILLE) + L(A, B) + L(B, C) + L(C, D, POINTILLE) + L(D, A, POINTILLE) +
    L(E, F) + L(F, G) + L(G, H, POINTILLE) + L(H, E, POINTILLE) + L(S0, M, POINTILLE) + L(A, C, ' stroke-width="1"') + L(B, D, ' stroke-width="1"') + L(E, G, ' stroke-width="1"') + L(H, F, ' stroke-width="1"') +
    '<circle cx="' + f(N[0]) + '" cy="' + f(N[1]) + '" r="2.5" fill="currentColor"/><circle cx="' + f(M[0]) + '" cy="' + f(M[1]) + '" r="2.5" fill="currentColor"/>' +
    T([S0[0] - 4, S0[1] - 8], "S") + T([A[0] - 16, A[1] + 6], "A") + T([B[0] - 2, B[1] + 18], "B") + T([C[0] + 6, C[1] + 4], "C") + T([D[0] - 16, D[1] - 2], "D") +
    T([E[0] - 16, E[1] + 4], "E") + T([F[0] + 4, F[1] + 14], "F") + T([G[0] + 6, G[1]], "G") + T([H[0] - 16, H[1] - 2], "H") + T([N[0] + 4, N[1] + 17], "N", ' font-size="13"') + T([M[0] - 14, M[1] + 18], "M"),
    "Pyramide régulière SABCD à base carrée, de hauteur SM ; la section EFGH est obtenue par un plan parallèle à la base passant par N, milieu de [SM].");
};

// Probatoire D 2025 maths : champ formé des rectangles ABCD et BEFG ; EF = 120 m, FG = 30 m ; AB = DC = CG.
S["proba-2025-maths-d-champ"] = () => {
  // Proportions relevées sur le scan (725 × 273 px, réduites à 0,4) ; seuls [DC] et [CG] portent le codage.
  const A = [24, 22], D = [256, 22], C = [256, 66], G = [314, 66], F = [314, 131], E = [24, 131], B = [24, 66];
  return svg(350, 156, P([A, D, C, G, F, E, A]) + L(B, C, ' stroke-dasharray="1.5 2.5" stroke-width="1.2"') + code(D, C) + code(C, G) +
    droit(A, [1, 0], [0, 1], 8) + droit(D, [-1, 0], [0, 1], 8) + droit(C, [0, -1], [1, 0], 8) + droit(G, [-1, 0], [0, 1], 8) + droit(F, [-1, 0], [0, -1], 8) + droit(E, [1, 0], [0, -1], 8) +
    T([10, 22], "A", ' font-size="12"') + T([262, 22], "D", ' font-size="12"') + T([10, 70], "B", ' font-size="12"') + T([250, 82], "C", ' font-size="12"') + T([320, 70], "G", ' font-size="12"') + T([10, 148], "E", ' font-size="12"') + T([318, 148], "F", ' font-size="12"') +
    T([169, 146], "120 m", ' font-size="12" text-anchor="middle"') + T([320, 104], "30 m", ' font-size="12"'),
    "Le champ de Bolo : le rectangle ABCD posé sur le rectangle BEFG ; EF = 120 m, FG = 30 m ; DC = CG (même codage).");
};

// Oscillogramme sur quadrillage : nx × ny divisions ; courbe y = amp·sin(2π(x − x0)/T) en divisions.
function oscillo(nx, ny, amp, per, x0, xs, titre, axes) {
  const c = 26, W = nx * c, H = ny * c, ox = 16, oy = 14, my = oy + H / 2;
  let g = '<g stroke-width="0.8" opacity="0.55">';
  for (let i = 0; i <= nx; i++) g += L([ox + i * c, oy], [ox + i * c, oy + H]);
  for (let j = 0; j <= ny; j++) g += L([ox, oy + j * c], [ox + W, oy + j * c]);
  g += "</g>";
  const pts = []; for (let x = xs[0]; x <= xs[1] + 1e-9; x += 0.05) pts.push([ox + x * c, my - amp * c * Math.sin(2 * Math.PI * (x - x0) / per)]);
  let ax = "";
  if (axes) ax = L([ox + axes * c, oy + H + 6], [ox + axes * c, oy - 10], ' stroke-width="1.2"') + P([[ox + axes * c - 4, oy - 4], [ox + axes * c, oy - 12], [ox + axes * c + 4, oy - 4]]) +
    L([ox - 6, my], [ox + W + 14, my], ' stroke-width="1.2"') + P([[ox + W + 8, my - 4], [ox + W + 16, my], [ox + W + 8, my + 4]]) + T([ox + axes * c + 6, oy - 2], "U (V)", ' font-size="12"') + T([ox + W - 8, my + 18], "t (s)", ' font-size="12"');
  return svg(W + 2 * ox + 14, H + 2 * oy + 4, g + ax + P(pts, ' stroke-width="2.2"'), titre);
}
// BEPC 2024 PCT : 10 × 8 divisions, sinusoïde de période 4 div et d'amplitude 2 div (balayage 0,005 s/div, sensibilité 110√2 V/div).
S["bepc-2024-pct-oscillogramme"] = () => oscillo(10, 8, 2, 4, -0.14, [0, 10], "Oscillogramme de la tension du secteur : une période occupe 4 divisions horizontales et la tension maximale 2 divisions verticales.");
// BEPC 2025 PCT : 14 × 10 divisions, sinusoïde de période 4 div et d'amplitude 5 div (2 V/div ; 5 ms/div).
S["bepc-2025-pct-oscillogramme"] = () => oscillo(14, 10, 5, 4, 0, [0, 12], "Oscillogramme d'une tension alternative sinusoïdale : une période occupe 4 divisions horizontales et la tension maximale 5 divisions verticales.", 6);

// Boîte de Pétri avec n colonies (positions régulières, reproductibles).
// Boîte de Pétri vue en perspective, comme sur le scan : ovale + rebord intérieur ; colonies placées à la main
// (positions relatives au centre, en unités du demi-grand axe) d'après le décompte du document.
const COLONIES = {
  3: [[0, -0.55], [-0.45, 0.35], [0.45, 0.3]],
  5: [[-0.6, -0.15], [0.05, -0.35], [0.55, -0.6], [-0.2, 0.6], [0.5, 0.45]],
  10: [[-0.35, -0.7], [0.3, -0.7], [-0.75, -0.2], [-0.1, -0.2], [0.45, -0.25], [0.8, 0.1], [-0.5, 0.25], [0.2, 0.2], [-0.2, 0.7], [0.45, 0.65]]
};
function petri(cx, cy, n) {
  // Cercle de la boîte + arc du couvercle décalé vers le bas, visible en haut (comme sur le scan) ; colonies = ronds pleins.
  const r = 28, d = 4, a1 = -Math.PI * 0.86, a2 = -Math.PI * 0.14, rr = r - 1;
  let s = '<circle cx="' + cx + '" cy="' + cy + '" r="' + r + '"/>' +
    '<path d="M' + f(cx + rr * Math.cos(a1)) + ' ' + f(cy + d + rr * Math.sin(a1)) + 'A' + rr + ' ' + rr + ' 0 0 1 ' + f(cx + rr * Math.cos(a2)) + ' ' + f(cy + d + rr * Math.sin(a2)) + '" stroke-width="1.2"/>';
  (COLONIES[n] || []).forEach(([u, v]) => { s += '<circle cx="' + f(cx + u * 19) + '" cy="' + f(cy + 2 + v * 19) + '" r="3.3" fill="currentColor" stroke="none"/>'; });
  return s;
}
// Tableau à cases : colonnes xs (bords), lignes ys (bords).
const grille = (xs, ys) => { let s = ""; xs.forEach(x => { s += L([x, ys[0]], [x, ys[ys.length - 1]], ' stroke-width="1"'); }); ys.forEach(y => { s += L([xs[0], y], [xs[xs.length - 1], y], ' stroke-width="1"'); }); return s; };
// BEPC 2025 SVT : expériences A et B (document 2), deux tableaux comme sur le sujet.
S["bepc-2025-svt-cultures"] = () => {
  const xs = [4, 152, 254, 356, 458], c = i => (xs[i + 1] + xs[i + 2]) / 2, fs = ' font-size="11"', fb = ' font-size="11" font-weight="700"', mid = ' text-anchor="middle"', fin = ' stroke-width="1"';
  // Expérience A
  let g = grille(xs, [56, 136, 216]) + L([xs[0], 4], [xs[4], 4], fin) + L([xs[1], 30], [xs[4], 30], fin) + L([xs[0], 4], [xs[0], 56], fin) + L([xs[4], 4], [xs[4], 56], fin) + L([xs[1], 4], [xs[1], 56], fin) +
    L([xs[2], 4], [xs[2], 30], fin) + L([xs[3], 4], [xs[3], 30], fin) + L([xs[0], 4], [xs[1], 56], fin) +
    L([xs[0], 216], [xs[0], 236], fin) + L([xs[4], 216], [xs[4], 236], fin) + L([xs[0], 236], [xs[4], 236], fin);
  g += T([146, 18], "Température", fb + ' text-anchor="end"') + T([10, 40], "Aspect", fb) + T([10, 52], "des cultures", fb);
  ["−18 °C", "37 °C", "100 °C"].forEach((l, i) => { g += T([c(i), 22], l, fb + mid); });
  g += T([305, 41], "On dépose des bactéries par étalement dans les trois", fb + mid) + T([305, 53], "boîtes de Pétri", fb + mid);
  g += T([10, 92], "En début de", fb) + T([10, 106], "culture", fb) + T([10, 172], "En fin de culture", fb) + T([10, 186], "(3 jours plus tard)", fb);
  g += T([c(0), 67], "Boîte de Pétri", ' font-size="9.5" font-weight="700"' + mid);
  [3, 3, 3].forEach((n, i) => { g += petri(c(i), 100, n); }); [3, 5, 0].forEach((n, i) => { g += petri(c(i), 178, n); });
  g += '<circle cx="186" cy="226" r="3.3" fill="currentColor" stroke="none"/>' + T([194, 230], ": colonies bactériennes", fb) + T([231, 256], "Expérience A", ' font-size="13" font-weight="700"' + mid);
  // Expérience B
  const o = 272;
  g += grille(xs, [o, o + 96, o + 182]);
  g += T([10, o + 16], "Début de", fb) + T([10, o + 29], "l'expérience", fb) + T([10, o + 48], "(colonies issues de 3", fs) + T([10, o + 61], "jours de culture à", fs) + T([10, o + 74], "différentes", fs) + T([10, o + 87], "températures)", fs);
  g += T([10, o + 114], "Fin de l'expérience", fb) + T([10, o + 133], "(milieux de cultures", fs) + T([10, o + 146], "obtenus après un jour", fs) + T([10, o + 159], "de plus)", fs);
  ["−18 °C", "37 °C", "100 °C"].forEach((l, i) => { g += T([c(i), o + 13], "Milieu obtenu à", fb + mid) + T([c(i), o + 26], l, fb + mid) + T([c(i), o + 110], "37 °C", fb + mid); });
  [3, 5, 0].forEach((n, i) => { g += petri(c(i), o + 60, n); }); [10, 10, 0].forEach((n, i) => { g += petri(c(i), o + 146, n); });
  g += T([231, o + 204], "Expérience B", ' font-size="13" font-weight="700"' + mid);
  return svg(462, o + 212, g, "Document 2. Expérience A : à −18 °C, 3 colonies au début et à la fin ; à 37 °C, de 3 à 5 colonies ; à 100 °C, 3 colonies au début et aucune à la fin. Expérience B, à 37 °C pendant un jour : le milieu venu de −18 °C passe de 3 à 10 colonies, celui venu de 37 °C de 5 à 10, celui venu de 100 °C reste sans colonie.");
};

// BEPC 2026 SVT : évolution de l'infection par le VIH (lymphocytes T4 et charge virale).
S["bepc-2026-svt-vih"] = () => {
  // Repères relevés sur le scan (pixels) : semaines 0 → 155, 12 → 300 ; années 1 → 370, 11 → 735 ; 0 → 352, 1100 → 175.
  const S_ = w => 155 + w * 145 / 12, A_ = a => 370 + (a - 1) * 36.5, Y = v => 352 - v * 0.161, x0 = 128, x1 = 778, fs = ' font-size="10"', fb = ' font-size="10" font-weight="700"';
  let g = L([x0, 352], [x1, 352], ' stroke-width="1.4"') + L([x0, 352], [x0, 170], ' stroke-width="1.4"') + L([x1, 352], [x1, 170], ' stroke-width="1.4"');
  for (let v = 0; v <= 1100; v += 100) g += L([x0 - 4, Y(v)], [x0, Y(v)], ' stroke-width="1"') + T([x0 - 7, Y(v) + 3.5], String(v), ' font-size="9" text-anchor="end"');
  [2, 3, 4, 5, 6].forEach((l, i) => { const y = 352 - i * 38.5; g += L([x1, y], [x1 + 4, y], ' stroke-width="1"') + T([x1 + 7, y + 4], '10<tspan dy="-5" font-size="7">' + l + "</tspan>", fs); });
  [0, 3, 6, 9, 12].forEach(w => { g += T([S_(w), 366], String(w), ' font-size="9" text-anchor="middle"'); });
  for (let a = 1; a <= 11; a++) g += T([A_(a), 366], String(a), ' font-size="9" text-anchor="middle"');
  const coupe = (x, y) => '<path d="M' + f(x - 6) + " " + f(y + 6) + " l6 -12 M" + f(x) + " " + f(y + 6) + ' l6 -12" stroke-width="1.2"/>';
  g += coupe(335, 352) + coupe(335, 300) + coupe(335, 247);
  g += T([210, 381], "Semaines", fb + ' text-anchor="middle"') + T([550, 381], "Années", fb + ' text-anchor="middle"');
  g += T([x0 - 34, 150], "Nombre de", fb) + T([x0 - 34, 162], "lymphocytes T4", fb) + T([x1 + 2, 150], "Charge", fb) + T([x1 + 2, 162], "virale", fb);
  // Nombre de lymphocytes T4 (tirets) et charge virale (trait plein), relevés point par point
  const T4 = [[160, 1130], [S_(3), 820], [S_(4.5), 540], [S_(5), 510], [S_(6), 520], [S_(9), 610], [S_(12), 680], [A_(2), 600], [A_(4), 450], [A_(6), 300], [A_(8), 150], [A_(9), 75], [A_(9.7), 18], [A_(10), 6], [A_(10.4), 3], [A_(10.8), 3]];
  const CV = [[S_(1.1), 25], [S_(3), 520], [S_(5), 900], [S_(6), 960], [S_(7), 760], [S_(8.5), 355], [S_(9), 325], [S_(12), 315], [A_(2), 340], [A_(4), 380], [A_(6), 420], [A_(7.5), 455], [A_(8.2), 485], [A_(9), 630], [A_(9.9), 850], [A_(10.6), 1060]];
  const lisse = pts => { let d = "M" + f(pts[0][0]) + " " + f(Y(pts[0][1])); for (let i = 1; i < pts.length; i++) { const p0 = pts[Math.max(i - 2, 0)], p1 = pts[i - 1], p2 = pts[i], p3 = pts[Math.min(i + 1, pts.length - 1)];
    const c1 = [p1[0] + (p2[0] - p0[0]) / 6, Math.min(352, Y(p1[1]) + (Y(p2[1]) - Y(p0[1])) / 6)], c2 = [p2[0] - (p3[0] - p1[0]) / 6, Math.min(352, Y(p2[1]) - (Y(p3[1]) - Y(p1[1])) / 6)];
    d += "C" + f(c1[0]) + " " + f(c1[1]) + " " + f(c2[0]) + " " + f(c2[1]) + " " + f(p2[0]) + " " + f(Y(p2[1])); } return d; };
  g += '<path d="' + lisse(T4) + '"' + POINTILLE + ' stroke-width="1.8"/><path d="' + lisse(CV) + '" stroke-width="2.4"/>';
  // Phases et annotations du sujet
  const crochet = (xa, xb, y) => P([[xa, y + 5], [xa, y], [xb, y], [xb, y + 5]], ' stroke-width="1.4"');
  g += crochet(S_(1.5), S_(8), 186) + T([S_(4.7), 172], "Première", fb + ' text-anchor="middle"') + T([S_(4.7), 183], "infection", fb + ' text-anchor="middle"');
  g += crochet(S_(8.3), A_(7.7), 208) + T([A_(3.2), 204], "Latence clinique", fb + ' text-anchor="middle"');
  g += crochet(A_(7.7), A_(10.6), 166) + T([A_(9.1), 162], "Sida déclaré", fb + ' text-anchor="middle"');
  g += T([A_(9.2), 188], "Maladies", fb + ' text-anchor="middle"') + T([A_(9.2), 199], "opportunistes", fb + ' text-anchor="middle"') + L([A_(9.4), 204], [A_(9.9), 228], ' stroke-width="1.2"');
  g += T([A_(7.5), 238], "symptômes", fb + ' text-anchor="middle"') + T([A_(7.5), 249], "généraux", fb + ' text-anchor="middle"') + L([A_(7.6), 254], [A_(7.6), 274], ' stroke-width="1.6"');
  g += T([A_(10.5), 178], "Mort", fb);
  g += L([x1 + 50, 196], [x1 + 74, 196], POINTILLE + ' stroke-width="1.8"') + T([x1 + 80, 194], "Nombre de", fb) + T([x1 + 80, 205], "lymphocytes T4", fb) + L([x1 + 50, 220], [x1 + 74, 220], ' stroke-width="2.4"') + T([x1 + 80, 224], "Charge virale", fb);
  return svg(900, 250, '<g transform="translate(-90 -138)">' + g + "</g>", "Document 1 : après la première infection, la charge virale culmine vers la 6e semaine puis retombe ; pendant la latence clinique, elle augmente lentement et le nombre de lymphocytes T4 diminue ; au stade sida déclaré (vers la 8e année), les LT4 tombent jusqu'à zéro vers la 10e année et la charge virale monte jusqu'à la mort.");
};

// Chromosome métaphasique en X : deux chromatides réunies au centromère (ic = position du centromère depuis le haut, 0-1).
const LONG = { 1: 30, 2: 29, 3: 26, 4: 25, 5: 24, 6: 23, 7: 22, 8: 20, 9: 20, 10: 19, 11: 19, 12: 19, 13: 15, 14: 14, 15: 14, 16: 13, 17: 12, 18: 11, 19: 10, 20: 10, 21: 8, 22: 8, X: 21, Y: 9 };
const IC = n => [1, 3, 16, 19, 20].includes(n) ? 0.5 : [13, 14, 15, 21, 22, "Y"].includes(n) ? 0.14 : 0.36;
function chromosome(cx, base, n) {
  const h = LONG[n], top = base - h, yc = top + h * IC(n), e = 0.9, o = 2.6;   // e : demi-écart au centromère ; o : écartement des extrémités
  const bras = (sx) => '<path d="M' + f(cx + sx * o) + ' ' + f(top + 1.4) + 'L' + f(cx + sx * e) + ' ' + f(yc) + 'L' + f(cx + sx * o) + ' ' + f(base - 1.4) + '"/>';
  return '<g stroke-width="2.4" stroke-linecap="round">' + bras(-1) + bras(1) + "</g>";
}
// Groupe de chromosomes homologues (k exemplaires) ; renvoie {svg, w}.
function paire(x, base, n, k) { let g = ""; for (let i = 0; i < k; i++) g += chromosome(x + 3.4 + i * 8.2, base, n); return { g, w: (k - 1) * 8.2 + 6.8 }; }
// Ovale net autour d'un groupe : englobe chromosomes ET numéro, marge régulière.
const entoure = (x, w, base, h) => '<ellipse cx="' + f(x + w / 2) + '" cy="' + f(base - h / 2 + 5) + '" rx="' + f(w / 2 + 7) + '" ry="' + f(h / 2 + 11) + '" stroke-width="1.2"/>';
// Caryotype classé par groupes A à G sous accolades (document 2 de 2026).
function caryotypeGroupes(ox, oy, ext, sexe, entourer, nom) {
  const W = 196, num = (x, w, base, t) => T([x + w / 2, base + 9], t, ' font-size="7.5" text-anchor="middle"');
  let g = "";
  const accolade = (x1, x2, y, lettre) => P([[x1, y + 4], [x1, y], [x2, y], [x2, y + 4]], ' stroke-width="1"') + T([(x1 + x2) / 2, y - 2], lettre, ' font-size="8" font-weight="700" text-anchor="middle"');
  const rang = (groupes, base, pas) => { const yb = base - Math.max(...groupes.map(gr => LONG[gr[1][0]])) - 7 - (groupes.some(gr => gr[1].includes(entourer)) ? 6 : 0); groupes.forEach(([lettre, nums, x]) => { let cx = ox + x; const x1 = cx;
    nums.forEach(n => { const k = ext[n] || 2, r = paire(cx, base, n, k); g += r.g + num(cx, r.w, base, String(n));
      if (entourer === n) g += entoure(cx, r.w, base, LONG[n]); cx += r.w + pas; });
    g += accolade(x1 - 2, cx - pas + 2, yb, lettre); }); };
  rang([["A", [1, 2, 3], 8], ["B", [4, 5], 128]], oy + 54, 14);
  rang([["C", [6, 7, 8, 9, 10, 11, 12], 8]], oy + 112, 11.4);
  rang([["D", [13, 14, 15], 8], ["E", [16, 17, 18], 76], ["F", [19, 20], 144]], oy + 160, 7);
  rang([["G", [21, 22], 8]], oy + 206, 8);
  // gonosomes, sous le groupe E comme sur le sujet
  let x = ox + 92; const x0 = x, yS = oy + 210;
  [...sexe].forEach(l => { g += chromosome(x + 3.4, yS, l) + T([x + 3.4, yS + 9], l, ' font-size="7.5" text-anchor="middle"'); x += 8.2; });
  if (entourer === "sexe") g += entoure(x0, x - x0 - 1.4, yS, LONG.X);
  return g + '<rect x="' + ox + '" y="' + (oy + 4) + '" width="' + W + '" height="230" stroke-width="1.2"/>' + T([ox + W / 2, oy + 252], nom, ' font-weight="700" font-size="13" text-anchor="middle" text-decoration="underline"');
}
// Caryotype en rangées simples (document 1 de 2024) : 1-5 / 6-12 / 13-15 et 16-18 / 19-20, 21-22 et X Y.
function caryotypeRangs(ox, oy, sexe, nom) {
  let g = ""; const num = (x, w, base, t) => T([x + w / 2, base + 10], t, ' font-size="8" text-anchor="middle"');
  const rang = (nums, base, x, pas) => { let cx = ox + x; nums.forEach(n => { const r = paire(cx, base, n, 2); g += r.g + num(cx, r.w, base, String(n)); cx += r.w + pas; }); return cx; };
  rang([1, 2, 3], oy + 48, 10, 16); rang([4, 5], oy + 48, 134, 16);
  rang([6, 7, 8, 9, 10, 11, 12], oy + 98, 10, 12.6);
  rang([13, 14, 15], oy + 138, 10, 14); rang([16, 17, 18], oy + 138, 116, 14);
  rang([19, 20], oy + 176, 10, 14); rang([21, 22], oy + 176, 116, 14);
  let x = ox + 176; [...sexe].forEach(l => { g += chromosome(x, oy + 176, l) + T([x, oy + 186], l, ' font-size="8" text-anchor="middle"'); x += 9; });
  return g + '<rect x="' + ox + '" y="' + (oy + 4) + '" width="214" height="192" stroke-width="1.2"/>' + T([ox + 107, oy + 214], nom, ' font-weight="700" font-size="13" text-anchor="middle"');
}
// BEPC 2026 SVT : caryotypes de K (XXY), T (trisomie 21) et Z (trisomie 21 et un seul X), d'après le corrigé national ;
// comme sur le sujet, seuls les gonosomes de K et de Z et la paire 21 de T sont entourés.
S["bepc-2026-svt-caryotypes"] = () => [
  [caryotypeGroupes(4, 0, {}, "XXY", "sexe", "Caryotype de K"), "Caryotype de K : 22 paires d'autosomes normales et trois chromosomes sexuels XXY (entourés)."],
  [caryotypeGroupes(4, 0, { 21: 3 }, "XY", 21, "Caryotype de T"), "Caryotype de T : trois chromosomes 21 (entourés), chromosomes sexuels XY."],
  [caryotypeGroupes(4, 0, { 21: 3 }, "X", "sexe", "Caryotype de Z"), "Caryotype de Z : trois chromosomes 21 et un seul chromosome sexuel X (entouré)."]
].map(([g, t]) => svg(208, 262, g, t).replace('width="208"', 'width="240"')).join("");
// BEPC 2024 SVT : caryotype avec trois gonosomes XXY.
S["bepc-2024-svt-caryotype"] = () => svg(222, 222, caryotypeRangs(4, 0, "XXY", "Document 1"), "Document 1 (schéma) : caryotype de 22 paires d'autosomes normales et de trois chromosomes sexuels, deux X et un Y.");

// BEPC 2025 histoire : frise graduée de 1880 à 1980.
S["bepc-2025-histoire-frise"] = () => {
  let g = P([[20, 40], [400, 40], [400, 32], [424, 52], [400, 72], [400, 64], [20, 64], [20, 40]]);
  [1880, 1900, 1920, 1940, 1960, 1980].forEach((a, i) => { const x = 46 + i * 66; g += L([x, 40], [x, 64]) + T([x - 15, 28], String(a), ' font-size="13" font-weight="600"'); });
  return svg(440, 84, g, "Frise chronologique graduée de 1880 à 1980, de vingt ans en vingt ans, à reproduire.");
};

// Probatoire C-E 2025 maths : carré ABCD de côté a, I et J milieux de [AB] et [BC] ; segments DI, DJ, (AC), (IJ).
S["proba-2025-maths-ce-carre"] = () => {
  const a = 150, A = [30, 190], B = [30 + a, 190], C = [30 + a, 40], D = [30, 40], I = [30 + a / 2, 190], J = [30 + a, 115], it = ' font-style="italic" font-family="Times New Roman,serif" font-size="16"';
  return svg(220, 220, P([A, B, C, D, A], ' stroke-width="1.1"') + L(A, C) + L(B, D) + L(D, I) + L(D, J) + L(I, J) +
    T([14, 204], "A", it) + T([B[0] + 4, 204], "B", it) + T([C[0] + 4, 40], "C", it) + T([12, 40], "D", it) + T([I[0] - 3, 210], "I", it) + T([J[0] + 6, J[1] + 5], "J", it) + T([101, 32], "a", it),
    "Carré ABCD de côté a ; I milieu de [AB], J milieu de [BC] ; segments [DI], [DJ], [IJ] et les diagonales [AC] et [BD].");
};
// Probatoire C-E 2025 maths : le ring, surface carrée de 7,8 m de côté ; A et B sommets opposés.
S["proba-2025-maths-ce-ring"] = () => {
  // Comme sur le sujet : surface carrée vue en perspective, bords avant épais ; flèches vers le titre et la légende.
  const A = [40, 92], H = [180, 50], B = [320, 92], K = [180, 134], fb = ' font-size="13" font-weight="700"', mid = ' text-anchor="middle"';
  const arr = (p, q) => L(p, q, ' stroke-width="1.2"') + fleche(q, p, 6);
  return svg(360, 190, L(A, H, ' stroke-width="1.2"') + L(H, B, ' stroke-width="1.2"') + L(A, K, ' stroke-width="6" stroke-linecap="butt" opacity="0.8"') + L(K, B, ' stroke-width="6" stroke-linecap="butt" opacity="0.8"') +
    T([180, 18], "Ring de boxe", fb + mid) + arr([180, 24], [180, 48]) + T([22, 97], "A", fb) + T([328, 97], "B", fb) +
    arr([262, 112], [262, 158]) + T([180, 178], "Surface carrée de 7,8 m de côté", ' font-size="12" font-weight="700"' + mid),
    "Le ring de boxe : surface carrée de 7,8 m de côté, posée au sol ; A et B sont deux sommets opposés.");
};
// Corrigé : courbe de f(x) = x − 1 + 1/(x − 1) sur ]1 ; +∞[, asymptotes (Δ) : x = 1 et (D) : y = x − 1.
S["proba-2025-maths-ce-courbe"] = () => {
  const ox = 40, oy = 230, u = 30, X = x => ox + x * u, Y = y => oy - y * u;
  let g = '<g stroke-width="0.6" opacity="0.4">'; for (let i = -1; i <= 8; i++) g += L([X(i), Y(-1)], [X(i), Y(7)]); for (let j = -1; j <= 7; j++) g += L([X(-1), Y(j)], [X(8), Y(j)]); g += "</g>";
  g += L([X(-1), Y(0)], [X(8), Y(0)], ' stroke-width="1.2"') + L([X(0), Y(-1)], [X(0), Y(7)], ' stroke-width="1.2"') + T([X(1) + 3, Y(0) + 14], "1", ' font-size="11"') + T([X(-0.4), Y(1) + 4], "1", ' font-size="11"') + T([X(-0.4), Y(0) + 14], "O", ' font-size="11"');
  g += L([X(1), Y(-1)], [X(1), Y(7)], POINTILLE) + T([X(1) - 34, Y(6.6)], "(Δ)") + L([X(0), Y(-1)], [X(8), Y(7)], POINTILLE) + T([X(6.6), Y(5)], "(D)");
  const pts = []; for (let x = 1.15; x <= 8; x += 0.05) { const y = x - 1 + 1 / (x - 1); if (y <= 7) pts.push([X(x), Y(y)]); }
  g += P(pts, ' stroke-width="2.2"') + '<circle cx="' + X(2) + '" cy="' + Y(2) + '" r="2.5" fill="currentColor"/>' + T([X(1.55), Y(5)], "(C<tspan font-size=\"9\" dy=\"3\">f</tspan>)");
  return svg(300, 270, g, "Courbe de f sur ]1 ; +∞[ : elle descend de +∞ jusqu'au minimum (2 ; 2), puis remonte en se rapprochant de la droite (D) : y = x − 1 ; la droite (Δ) : x = 1 est asymptote verticale.");
};

// Probatoire A-ABI 2025 maths (corrigé) : courbes de f(x) = x² − 2x − 3 et de −f sur [−2 ; 4], unité 1 cm.
S["proba-2025-maths-a-courbes"] = () => {
  const u = 22, ox = 30 + 3 * u, oy = 20 + 6 * u, X = x => ox + x * u, Y = y => oy - y * u, fs = ' font-size="11"';
  let g = '<g stroke-width="0.6" opacity="0.4">'; for (let i = -3; i <= 5; i++) g += L([X(i), Y(6)], [X(i), Y(-6)]); for (let j = -6; j <= 6; j++) g += L([X(-3), Y(j)], [X(5), Y(j)]); g += "</g>";
  g += L([X(-3), Y(0)], [X(5.3), Y(0)], ' stroke-width="1.2"') + fleche([X(5.4), Y(0)], [X(5), Y(0)], 6) + L([X(0), Y(-6)], [X(0), Y(6.3)], ' stroke-width="1.2"') + fleche([X(0), Y(6.4)], [X(0), Y(6)], 6);
  g += T([X(0) - 12, Y(0) + 14], "O", fs) + T([X(1) - 3, Y(0) + 14], "I", fs) + T([X(0) - 12, Y(1) + 4], "J", fs);
  const fn = x => x * x - 2 * x - 3, p1 = [], p2 = [];
  for (let x = -2; x <= 4.0001; x += 0.05) { p1.push([X(x), Y(fn(x))]); p2.push([X(x), Y(-fn(x))]); }
  g += P(p1, ' stroke-width="2.2"') + P(p2, ' stroke-width="2"' + POINTILLE);
  [[-2, 5], [1, -4], [4, 5]].forEach(([x, y]) => { g += '<circle cx="' + X(x) + '" cy="' + Y(y) + '" r="2.4" fill="currentColor"/><circle cx="' + X(x) + '" cy="' + Y(-y) + '" r="2.4" fill="currentColor"/>'; });
  g += T([X(4.12), Y(5.55)], "(C<tspan font-size=\"8\" dy=\"3\">f</tspan>)", fs) + T([X(4.14), Y(-5.6)], "(C<tspan font-size=\"8\" dy=\"3\">−f</tspan>)", fs);
  return svg(X(5.6) + 10, Y(-6) + 14, g, "Courbe de f, parabole de sommet (1 ; −4) passant par (−2 ; 5) et (4 ; 5), et courbe de −f, sa symétrique par rapport à l'axe des abscisses, de sommet (1 ; 4).");
};

// Probatoire A-ABI 2024 maths (corrigé) : f(x) = (x − 1)/(x + 2) sur [−6 ; −2[ ∪ ]−2 ; 4], asymptote x = −2, tangente (T) : y = 3x/4 − 1/2.
S["proba-2024-maths-a-courbe"] = () => {
  const u = 24, xa = -7, xb = 5, ya = -6, yb = 6, X = x => 14 + (x - xa) * u, Y = y => 10 + (yb - y) * u, fs = ' font-size="11"';
  let g = '<g stroke-width="0.6" opacity="0.4">'; for (let i = xa; i <= xb; i++) g += L([X(i), Y(ya)], [X(i), Y(yb)]); for (let j = ya; j <= yb; j++) g += L([X(xa), Y(j)], [X(xb), Y(j)]); g += "</g>";
  g += L([X(xa), Y(0)], [X(xb) + 8, Y(0)], ' stroke-width="1.2"') + fleche([X(xb) + 10, Y(0)], [X(xb), Y(0)], 6) + L([X(0), Y(ya)], [X(0), Y(yb) - 8], ' stroke-width="1.2"') + fleche([X(0), Y(yb) - 10], [X(0), Y(yb)], 6);
  g += T([X(0) - 12, Y(0) - 4], "O", fs) + T([X(1) - 3, Y(0) + 14], "1", fs) + T([X(0) - 12, Y(1) + 4], "1", fs);
  const fn = x => (x - 1) / (x + 2), b1 = [], b2 = [];
  for (let x = -6; x < -2; x += 0.02) { const y = fn(x); if (y <= yb) b1.push([X(x), Y(y)]); }
  for (let x = -1.98; x <= 4.0001; x += 0.02) { const y = fn(x); if (y >= ya) b2.push([X(x), Y(y)]); }
  g += L([X(-2), Y(ya)], [X(-2), Y(yb)], POINTILLE + ' stroke-width="1.4"') + T([X(-2) + 4, Y(yb) + 14], "x = −2", fs);
  g += L([X(xa), Y(0.75 * xa - 0.5)], [X(xb), Y(0.75 * xb - 0.5)], ' stroke-width="1.4"') + T([X(3.3), Y(2.4)], "(T)", fs);
  g += P(b1, ' stroke-width="2.2"') + P(b2, ' stroke-width="2.2"') + T([X(-5.6), Y(2.6)], "(C)", fs) + T([X(2.2), Y(-0.6)], "(C)", fs);
  [[-6, 7 / 4], [4, 0.5], [0, -0.5]].forEach(([x, y]) => { g += '<circle cx="' + f(X(x)) + '" cy="' + f(Y(y)) + '" r="2.4" fill="currentColor"/>'; });
  return svg(X(xb) + 24, Y(ya) + 12, g, "Courbe de f(x) = (x − 1)/(x + 2) : deux branches croissantes, de (−6 ; 7/4) vers +∞ à gauche de l'asymptote x = −2, puis de −∞ vers (4 ; 1/2) ; tangente (T) : y = 3x/4 − 1/2 au point (0 ; −1/2).");
};

// Probatoire C-E 2024 maths : tétraèdre régulier ABCD, I milieu de [BC], H projeté orthogonal de A sur (BCD) ; coordonnées relevées sur le scan.
S["proba-2024-maths-ce-tetraedre"] = () => {
  const k = 0.55, Q = (x, y) => [x * k, y * k], A = Q(230, 55), B = Q(55, 218), C = Q(145, 445), D = Q(415, 350), I = Q(100, 331), H = Q(233, 338);
  const it = ' font-style="italic" font-family="Times New Roman,serif" font-size="15"', pt = ' stroke-dasharray="1.6 3" stroke-width="1.3"';
  return svg(250, 262, L(A, B) + L(A, C) + L(A, D) + L(B, C) + L(C, D) + L(B, D, ' stroke-dasharray="6 4" stroke-width="1.4"') +
    L(A, I, pt) + L(A, H, pt) + L(I, D, pt) + P([[H[0], H[1] - 7], [H[0] + 6, H[1] - 7], [H[0] + 6, H[1] - 1]], pt) +
    T([A[0] - 5, A[1] - 7], "A", it) + T([B[0] - 16, B[1] + 4], "B", it) + T([C[0] - 4, C[1] + 18], "C", it) + T([D[0] + 6, D[1] + 6], "D", it) + T([I[0] - 13, I[1] + 6], "I", it) + T([H[0] - 5, H[1] + 17], "H", it),
    "Tétraèdre régulier ABCD ; I milieu de [BC] ; H projeté orthogonal de A sur le plan (BCD), situé sur [ID] ; segments [AI], [AH] et [ID] en pointillés, arête [BD] cachée.");
};
// Corrigé C-E 2024 : courbe de g, restriction de f(x) = (4x² − 4x − 2)/(2x − 3) à [1 ; 3/2[ ∪ ]3/2 ; +∞[ ; asymptotes x = 3/2 et (D) : y = 2x + 1.
S["proba-2024-maths-ce-courbe"] = () => {
  const u = 26, xa = -3, xb = 5, ya = -2, yb = 9.5, X = x => 22 + (x - xa) * u, Y = y => 12 + (yb - y) * u, fs = ' font-size="11"';
  let g = ""; for (let i = xa; i <= 4; i++) if (i) g += L([X(i), Y(0) - 3], [X(i), Y(0) + 3], ' stroke-width="1"'); for (let j = ya; j <= 9; j++) if (j) g += L([X(0) - 3, Y(j)], [X(0) + 3, Y(j)], ' stroke-width="1"');
  g += L([X(xa), Y(0)], [X(xb) + 6, Y(0)], ' stroke-width="1.2"') + fleche([X(xb) + 8, Y(0)], [X(xb), Y(0)], 6) + L([X(0), Y(ya)], [X(0), Y(yb) - 4], ' stroke-width="1.2"') + fleche([X(0), Y(yb) - 6], [X(0), Y(9)], 6);
  for (let i = xa; i <= 4; i++) if (i) g += T([X(i) - 3, Y(0) + 14], String(i).replace("-", "−"), fs);
  for (let j = ya; j <= 9; j++) if (j) g += T([X(0) - 14, Y(j) + 4], String(j).replace("-", "−"), fs);
  g += T([X(0) + 3, Y(0) + 14], "0", fs) + T([X(xb) - 2, Y(0) + 16], "x", fs) + T([X(0) - 12, Y(yb) + 6], "y", fs);
  const fn = x => 2 * x + 1 + 1 / (2 * x - 3), b1 = [], b2 = [];
  for (let x = 1; x < 1.5; x += 0.002) { const y = fn(x); if (y >= ya) b1.push([X(x), Y(y)]); }
  for (let x = 1.502; x <= 4.3; x += 0.004) { const y = fn(x); if (y <= 9.3) b2.push([X(x), Y(y)]); }
  g += L([X(1.5), Y(ya)], [X(1.5), Y(yb)], ' stroke-width="1.4"');
  g += L([X(-1.5), Y(-2)], [X(4.15), Y(9.3)], ' stroke-width="1.5"') + T([X(2.05), Y(4.75)], "(D)", fs);
  g += L([X(1), Y(0)], [X(1), Y(2)], POINTILLE + ' stroke-width="1"') + L([X(0), Y(6)], [X(1), Y(6)], POINTILLE + ' stroke-width="1"') + L([X(2), Y(0)], [X(2), Y(6)], POINTILLE + ' stroke-width="1"') +
    L([X(0) + 2, Y(2)], [X(2) - 2, Y(2)], ' stroke-width="1"') + fleche([X(0), Y(2)], [X(1), Y(2)], 6) + fleche([X(2), Y(2)], [X(1), Y(2)], 6) +
    L([X(1) + 2, Y(6)], [X(3) - 2, Y(6)], ' stroke-width="1"') + fleche([X(1), Y(6)], [X(2), Y(6)], 6) + fleche([X(3), Y(6)], [X(2), Y(6)], 6);
  g += P(b1, ' stroke-width="2.2"') + P(b2, ' stroke-width="2.2"');
  return svg(X(xb) + 20, Y(ya) + 10, g, "Courbe de g : branche de gauche partant de (1 ; 2) et descendant vers −∞ près de x = 3/2 ; branche de droite venant de +∞, de minimum (2 ; 6), puis se rapprochant de l'asymptote oblique (D) : y = 2x + 1.");
};

// Probatoire D-TI 2024 maths, situation : espace rectangulaire au bord de la rivière, clôture en pointillés sur trois côtés.
S["proba-2024-maths-d-cloture"] = () => {
  const pt = ' stroke-dasharray="2 3" stroke-width="2"';
  return svg(300, 96, T([150, 14], "Clôture", ' font-size="12" font-style="italic" text-anchor="middle"') +
    P([[118, 54], [118, 22], [182, 22], [182, 54]], pt) +
    '<rect x="4" y="56" width="292" height="22" fill="currentColor" fill-opacity="0.28" stroke="none"/>' + T([86, 72], "Rivière", ' font-size="12" font-style="italic"'),
    "Espace rectangulaire au bord d'une rivière rectiligne : la clôture, en pointillés, borde trois côtés ; le côté ouvert à l'eau n'a pas de clôture.");
};
// Corrigé D-TI 2024, exercice 1 : ABC rectangle en A (AB = 4 ; AC = 3 sur la figure du corrigé), I milieu de [BC], G milieu de [AI],
// (Σ) cercle de centre G passant par A, (Σ') son image par la rotation de centre A et d'angle −π/2.
S["proba-2024-maths-d-cercles"] = () => {
  const u = 52, O = [70, 176], Q = (x, y) => [O[0] + x * u, O[1] - y * u], A = Q(0, 0), B = Q(4, 0), C = Q(0, 3), I = Q(2, 1.5), G = Q(1, 0.75), G2 = Q(0.75, -1), r = 1.25 * u;
  const pt = p => '<circle cx="' + f(p[0]) + '" cy="' + f(p[1]) + '" r="2.6" fill="currentColor" stroke="none"/>';
  return svg(300, 316, L(A, B) + L(A, C) + L(B, C) + L(A, I) +
    '<circle cx="' + f(G[0]) + '" cy="' + f(G[1]) + '" r="' + r + '"/><circle cx="' + f(G2[0]) + '" cy="' + f(G2[1]) + '" r="' + r + '"/>' +
    code(C, I, 2) + code(I, B, 2) + code(A, G, 1) + code(G, I, 1) + pt(A) + pt(G) + pt(I) + pt(G2) +
    T([A[0] - 14, A[1] + 2], "A", ' font-size="12"') + T([B[0] + 4, B[1] + 12], "B", ' font-size="12"') + T([C[0] - 4, C[1] - 8], "C", ' font-size="12"') +
    T([I[0] + 2, I[1] - 8], "I", ' font-size="12"') + T([G[0] - 12, G[1] - 8], "G", ' font-size="12"') + T([G2[0] + 2, G2[1] + 14], "G'", ' font-size="12"') +
    T([12, 128], "(Σ)", ' font-size="13" font-style="italic"') + T([16, 258], "(Σ')", ' font-size="13" font-style="italic"'),
    "Triangle ABC rectangle en A ; I milieu de [BC] ; G milieu de [AI] ; cercle (Σ) de centre G passant par A ; cercle (Σ') de centre G', image de G par la rotation de centre A et d'angle −π/2, de même rayon.");
};
// Corrigé D-TI 2024, exercice 2 : (Cf) : y = −x³ + 3x² en trait plein et (Cg), son image par la translation de vecteur i, en tirets.
S["proba-2024-maths-d-courbes"] = () => {
  const u = 34, xa = -2.5, xb = 5.5, ya = -2.5, yb = 5.5, X = x => 14 + (x - xa) * u, Y = y => 10 + (yb - y) * u, fs = ' font-size="10"';
  let g = '<g stroke-width="0.6" opacity="0.35" stroke-dasharray="1.5 2.5">'; for (let i = xa; i <= xb; i += 0.5) g += L([X(i), Y(ya)], [X(i), Y(yb)]); for (let j = ya; j <= yb; j += 0.5) g += L([X(xa), Y(j)], [X(xb), Y(j)]); g += "</g>";
  g += L([X(xa), Y(0)], [X(xb), Y(0)], ' stroke-width="1.2"') + L([X(0), Y(ya)], [X(0), Y(yb)], ' stroke-width="1.2"');
  [-2, -1, 1, 2, 5].forEach(i => { g += T([X(i) - 3, Y(0) + 13], String(i).replace("-", "−"), fs); });
  [-2, -1, 1, 2, 3, 4, 5].forEach(j => { g += T([X(0) - 13, Y(j) + 4], String(j).replace("-", "−"), fs); });
  g += T([X(0) - 10, Y(0) + 13], "0", fs);
  const cf = x => -x * x * x + 3 * x * x, b = d => { const p = []; for (let x = -1.25 + d; x <= 3.45 + d; x += 0.01) { const y = cf(x - d); if (y <= 5.2 && y >= ya) p.push([X(x), Y(y)]); } return p; };
  g += P(b(1), ' stroke-dasharray="7 5" stroke-width="2"') + P(b(0), ' stroke-width="2.2"');
  g += L([X(1.4), Y(4)], [X(2.6), Y(4)], ' stroke-width="1"') + fleche([X(1.4), Y(4)], [X(2), Y(4)], 6) + fleche([X(2.6), Y(4)], [X(2), Y(4)], 6);
  g += T([X(-1.95), Y(2.4)], "(Cf)", ' font-size="11" font-style="italic"') + T([X(4.1), Y(2.05)], "(Cg)", ' font-size="11" font-style="italic"');
  return svg(X(xb) + 12, Y(ya) + 10, g, "Courbes (Cf) d'équation y = −x³ + 3x², en trait plein, minimum 0 en x = 0 et maximum 4 en x = 2 ; et (Cg), en tirets, son image par la translation de vecteur i : minimum 0 en x = 1, maximum 4 en x = 3.");
};
// Corrigé D-TI 2024, exercice 4 : polygone des fréquences cumulées croissantes (en %).
S["proba-2024-maths-d-polygone"] = () => {
  const ux = 34, uy = 2.6, X = x => 34 + x * ux, Y = y => 12 + (102 - y) * uy, fs = ' font-size="9"';
  let g = '<g stroke-width="0.6" opacity="0.35" stroke-dasharray="1.5 2.5">'; for (let i = 0; i <= 8.5; i += 0.5) g += L([X(i), Y(0)], [X(i), Y(102)]); for (let j = 0; j <= 100; j += 2.5) g += L([X(0), Y(j)], [X(8.5), Y(j)]); g += "</g>";
  g += L([X(-0.3), Y(0)], [X(8.7), Y(0)], ' stroke-width="1.2"') + fleche([X(8.9), Y(0)], [X(8.7), Y(0)], 6) + L([X(0), Y(-2)], [X(0), Y(103)], ' stroke-width="1.2"') + fleche([X(0), Y(104)], [X(0), Y(103)], 6);
  for (let i = 1; i <= 8; i++) g += T([X(i) - 3, Y(0) + 13], String(i), fs);
  for (let j = 5; j <= 100; j += 5) g += T([X(0) - 20, Y(j) + 3], String(j), fs);
  g += T([X(0) - 9, Y(0) + 13], "0", fs) + T([X(8.6), Y(0) + 14], "x", fs);
  g += P([[0, 0], [1, 10], [2, 25], [3, 45], [4, 65], [8, 100]].map(([x, y]) => [X(x), Y(y)]), ' stroke-width="1.8"');
  return svg(X(9) + 10, Y(0) + 22, g, "Polygone des fréquences cumulées croissantes : points (0 ; 0), (1 ; 10), (2 ; 25), (3 ; 45), (4 ; 65) et (8 ; 100), temps en heures en abscisse et fréquences cumulées en % en ordonnée.");
};

// ——— Probatoire 2025, physique et chimie ———
// Formule chimique en texte : les chiffres qui suivent une lettre ou « ) » passent en indice.
const F = (p, s, x = "") => T(p, s.replace(/([A-Za-z)])(\d+)/g, '$1<tspan dy="4" font-size="10">$2</tspan><tspan dy="-4"></tspan>'), x);
// Physique C-E 2025 : générateur U, diode D1 (tension U1), R1 et R2 en dérivation.
S["proba-2025-physique-ce-circuit"] = () => {
  const h = 30, b = 120, fs = ' font-size="13"';
  let g = P([[40, 62], [40, h], [130, h]]) + P([[40, 86], [40, b], [270, b], [270, h], [176, h]]);
  g += L([26, 62], [54, 62], ' stroke-width="1.4"') + L([33, 86], [47, 86], ' stroke-width="5"') + T([20, 58], "+", fs) + T([22, 102], "−", fs);
  g += L([66, 108], [66, 52], ' stroke-width="1.2"') + fleche([66, 46], [66, 60], 7) + T([74, 84], "U", ' font-size="14" font-weight="700"');
  g += L([60, h], [96, h]) + fleche([100, h], [90, h], 8) + T([84, 22], "I", fs);
  g += '<path d="M130 18 L130 42 L162 30 Z" fill="none"/>' + L([162, 18], [162, 42]) + L([162, h], [176, h]) + T([136, 12], "D<tspan dy=\"4\" font-size=\"9\">1</tspan>", fs);
  g += L([172, 50], [130, 50], ' stroke-width="1.2"') + fleche([124, 50], [134, 50], 7) + T([144, 68], "U<tspan dy=\"4\" font-size=\"9\">1</tspan>", ' font-size="13" font-style="italic"');
  const zz = x => { let p = [[x, 52]], y = 52; for (let i = 0; i < 6; i++) { y += 5; p.push([x + (i % 2 ? -6 : 6), y]); } p.push([x, y + 4]); return L([x, h], [x, 52]) + P(p) + L([x, y + 4], [x, b]); };
  g += zz(215) + zz(270) + T([224, 76], "R<tspan dy=\"4\" font-size=\"9\">1</tspan>", fs) + T([279, 76], "R<tspan dy=\"4\" font-size=\"9\">2</tspan>", fs);
  return svg(300, 136, g, "Circuit : générateur de tension U ; diode D1 parcourue par le courant I, de tension U1 ; puis les résistors R1 et R2 montés en dérivation.");
};
// Physique C-E 2025 : treuil (poulie de rayon r sur l'axe (Δ) du moteur), charge suspendue au fil.
S["proba-2025-physique-ce-treuil"] = () => {
  const C = [110, 70], fs = ' font-size="12" font-style="italic"';
  return svg(310, 236, L([18, 70], [236, 70], POINTILLE + ' stroke-width="1"') + '<ellipse cx="110" cy="70" rx="32" ry="56" stroke-width="2"/>' +
    '<circle cx="110" cy="70" r="3.5" fill="currentColor" stroke="none"/>' + T([160, 64], "(Δ)", ' font-size="12"') +
    '<rect x="238" y="60" width="62" height="20"/>' + T([244, 96], "Moteur", fs) +
    '<path d="M40 56 A 10 14 0 1 0 40 84"/>' + fleche([40, 56], [34, 62], 6) +
    L([78, 70], [78, 186]) + '<rect x="62" y="186" width="32" height="44" fill="currentColor" fill-opacity="0.75"/>' + T([102, 214], "Charge", fs),
    "Treuil : poulie de rayon r montée sur l'axe (Δ) de l'arbre du moteur ; le fil enroulé sur la poulie soulève la charge.");
};
// Physique C-E 2025, document 1 : pendule sur un plan incliné (vue de côté et vue en perspective).
S["proba-2025-physique-ce-pendule"] = () => {
  const fs = ' font-size="12"', M = [118, 138];
  let g = L([20, 22], [44, 10], ' stroke-width="3"') + L([32, 16], M) + '<circle cx="118" cy="138" r="6" fill="currentColor" stroke="none"/>' +
    L(M, [136, 168], ' stroke-width="2"') + fleche([139, 173], [130, 158], 8) + T([142, 176], "P<tspan dy=\"4\" font-size=\"9\">1</tspan>", ' font-size="12" font-style="italic"') + L([140, 160], [150, 160], ' stroke-width="0.9"') +
    T([96, 172], "α", fs) + T([76, 54], "Fil de longueur ℓ", fs) + T([6, 112], "Table inclinée", fs) + T([132, 136], "Mobile", fs);
  const A = [196, 46], B = [356, 46], E = [196, 116], D = [236, 162], Cc = [416, 162], H = [356, 116];
  g += P([A, B, Cc, D, A], ' stroke-width="1.8"') + L(A, E) + L(E, D) + L(E, H, POINTILLE + ' stroke-width="1"') + L(B, H, POINTILLE + ' stroke-width="1"') + L(H, Cc, POINTILLE + ' stroke-width="1"');
  g += L([262, 56], [300, 124], ' stroke-width="1.6"') + '<circle cx="300" cy="126" r="6" fill="currentColor" stroke="none"/>' + L([262, 56], [276, 120], ' stroke-dasharray="2 3" stroke-width="1"');
  g += T([282, 104], "θ", fs) + T([222, 132], "α", fs) + L([300, 126], [300, 166], ' stroke-width="2"') + fleche([300, 172], [300, 160], 8) + T([306, 180], "P", ' font-size="12" font-style="italic"') + L([306, 168], [314, 168], ' stroke-width="0.9"');
  return svg(430, 186, g, "Document 1 : pendule de longueur ℓ posé sur une table inclinée d'un angle α ; écarté d'un angle θ de sa position d'équilibre ; poids P et sa composante P1 = P sin α le long du plan.");
};
// Physique C-E 2025, document 2 : profil spectral de l'étoile 71 Tauri (maximum vers 470 nm).
S["proba-2025-physique-ce-spectre"] = () => {
  const X = l => 34 + (l - 370) * 0.62, Y = v => 182 - v * 20, fs = ' font-size="10"';
  let g = '<g stroke-width="0.7" opacity="0.5">'; for (let l = 400; l <= 750; l += 50) g += L([X(l), Y(0)], [X(l), Y(8.3)]); for (let v = 1; v <= 8; v++) g += L([X(370), Y(v)], [X(770), Y(v)]); g += "</g>";
  g += L([X(370), Y(0)], [X(782), Y(0)], ' stroke-width="1.2"') + fleche([X(790), Y(0)], [X(780), Y(0)], 7) + L([X(370), Y(0)], [X(370), Y(8.7)], ' stroke-width="1.2"') + fleche([X(370), Y(9.1)], [X(370), Y(8.6)], 7);
  for (let l = 400; l <= 750; l += 50) g += T([X(l) - 8, Y(0) + 13], String(l), fs);
  g += T([X(372) + 4, 12], "Intensité lumineuse", ' font-size="11"') + T([X(745), Y(0) - 8], "λ(nm)", ' font-size="11"');
  const pts = [[375, 0.3], [380, 1.0], [390, 2.6], [400, 3.8], [410, 4.5], [420, 5.4], [430, 6.1], [440, 6.6], [450, 6.9], [455, 5.6], [459, 6.9], [465, 7.6], [470, 8.0], [478, 7.5], [486, 6.1], [490, 4.6], [494, 6.4], [499, 5.2], [504, 6.1], [514, 5.3], [530, 5.0], [560, 4.6], [600, 3.9], [650, 3.2], [685, 2.9], [690, 2.5], [695, 2.9], [720, 2.6], [728, 2.2], [734, 2.6], [750, 2.3]];
  g += P(pts.map(([l, v]) => [X(l), Y(v)]), ' stroke-width="1.6"');
  return svg(X(790) + 12, Y(0) + 20, g, "Document 2 : profil spectral de l'étoile 71 Tauri, intensité lumineuse en fonction de la longueur d'onde de 400 à 750 nm ; l'intensité est maximale vers 470 nm puis décroît lentement vers le rouge.");
};
// Physique D-TI 2025 : barrage hydroélectrique, hauteur de chute h jusqu'à la turbine.
S["proba-2025-physique-d-barrage"] = () => {
  const fs = ' font-size="13" font-weight="700"';
  let g = '<rect x="40" y="40" width="20" height="130" fill="currentColor" fill-opacity="0.75" stroke="none"/>' + L([60, 6], [60, 170]) + L([84, 6], [138, 116]) + L([20, 170], [320, 170]);
  g += '<path d="M138 116 Q 200 104 250 110 T 320 104 L 320 170 L 138 170 Z" fill="currentColor" fill-opacity="0.18" stroke="none"/>';
  g += L([28, 40], [28, 140], ' stroke-width="1.2"') + fleche([28, 36], [28, 48], 7) + fleche([28, 144], [28, 132], 7) + L([22, 40], [40, 40], POINTILLE + ' stroke-width="1"') + L([22, 140], [160, 140], POINTILLE + ' stroke-width="1"') + T([10, 96], "h", fs);
  g += '<circle cx="180" cy="140" r="14"/><circle cx="180" cy="140" r="3" fill="currentColor" stroke="none"/>';
  for (let k = 0; k < 10; k++) { const a = k * Math.PI / 5; g += L([180 + 14 * Math.cos(a), 140 + 14 * Math.sin(a)], [180 + 21 * Math.cos(a + 0.3), 140 + 21 * Math.sin(a + 0.3)], ' stroke-width="1.2"'); }
  g += P([[262, 100], [272, 22], [282, 100]], ' stroke-width="1.2"') + L([264, 80], [280, 80]) + L([266, 60], [278, 60]) + L([268, 40], [276, 40]) + L([264, 80], [278, 60], ' stroke-width="0.8"') + L([280, 80], [266, 60], ' stroke-width="0.8"') + L([258, 22], [286, 22]);
  g += '<path d="M258 22 Q 218 46 190 126" stroke-width="1"/><path d="M286 22 Q 304 18 320 14" stroke-width="1"/>';
  return svg(330, 180, g, "Barrage hydroélectrique : l'eau de la retenue tombe d'une hauteur h jusqu'à la turbine, qui entraîne l'alternateur ; une ligne électrique part vers la ville.");
};
// Chimie C-D-E 2025, exercice 2, question 1 : composés à nommer.
S["proba-2025-chimie-noms"] = () => {
  const fs = ' font-size="14"';
  let g = T([4, 46], "a)", fs) + T([44, 18], "H", fs) + T([96, 18], "H", fs) + L([52, 22], [62, 34], ' stroke-width="1.2"') + L([96, 22], [86, 34], ' stroke-width="1.2"') +
    T([60, 46], "C=C", fs) + L([62, 50], [54, 60], ' stroke-width="1.2"') + F([36, 74], "CH3", fs) + L([90, 50], [98, 60], ' stroke-width="1.2"') + F([96, 74], "CH−CH3", fs) + L([104, 78], [104, 88], ' stroke-width="1.2"') + F([96, 102], "CH3", fs);
  g += T([200, 46], "b)", fs) + F([222, 46], "CH3−CH−CH2−C−H", fs) + L([258, 52], [258, 62], ' stroke-width="1.2"') + F([250, 78], "CH3", fs) + T([318, 16], "O", fs) + L([321, 22], [321, 32]) + L([325, 22], [325, 32]);
  return svg(400, 110, g, "a) H et H du même côté de la double liaison C=C, portée d'un côté par CH3, de l'autre par CH(CH3)–CH3. b) CH3–CH(CH3)–CH2–CHO.");
};
// Chimie C-D-E 2025, exercice 2, question 2 : classe des alcools.
S["proba-2025-chimie-alcools"] = () => {
  const fs = ' font-size="14"', v = (x, y1, y2) => L([x, y1], [x, y2], ' stroke-width="1.2"');
  let g = T([4, 52], "a)", fs) + F([28, 52], "CH3−C−CH2−OH", fs) + F([66, 20], "CH3", fs) + v(74, 25, 38) + v(74, 57, 70) + F([66, 86], "CH3", fs);
  g += T([226, 52], "b)", fs) + F([250, 52], "CH3−C−OH", fs) + F([288, 20], "CH3", fs) + v(296, 25, 38) + v(296, 57, 70) + F([288, 86], "CH3", fs);
  return svg(380, 96, g, "a) CH3–C(CH3)2–CH2–OH. b) CH3–C(CH3)2–OH.");
};
// Chimie C-D-E 2025, situation : formule du 1,4-dichlorobenzène (PDB).
S["proba-2025-chimie-pdb"] = () => {
  const c = [110, 46], r = 30; let hex = []; for (let k = 0; k < 6; k++) { const a = k * Math.PI / 3; hex.push([c[0] + r * Math.cos(a), c[1] + r * Math.sin(a)]); }
  hex.push(hex[0]);
  return svg(220, 92, P(hex) + '<circle cx="110" cy="46" r="17"/>' + L([c[0] - r, 46], [58, 46]) + L([c[0] + r, 46], [162, 46]) +
    T([38, 51], "Cl", ' font-size="14"') + T([164, 51], "Cl", ' font-size="14"'),
    "1,4-dichlorobenzène : noyau benzénique portant deux atomes de chlore en positions opposées (para).");
};
// Corrigé chimie 2025 : conformation chaise du cyclohexane.
S["proba-2025-chimie-chaise"] = () => {
  return svg(200, 96, P([[30, 66], [74, 76], [118, 58], [170, 36], [126, 26], [82, 44], [30, 66]], ' stroke-width="1.8"'),
    "Cyclohexane en conformation chaise : six atomes de carbone, deux sommets opposés hors du plan moyen, l'un vers le haut, l'autre vers le bas.");
};

// ——— Probatoire 2025, SVTEEHB ———
const etoile = (x, y, r = 5) => { let p = ""; for (let k = 0; k < 8; k++) { const a = k * Math.PI / 4; p += L([x, y], [x + r * Math.cos(a), y + r * Math.sin(a)], ' stroke-width="1.2"'); } return p + '<circle cx="' + f(x) + '" cy="' + f(y) + '" r="2.2" fill="currentColor" stroke="none"/>'; };
// SVT C-TI 2025 : le phénomène de subduction (plaque océanique sous plaque continentale).
S["proba-2025-svt-c-subduction"] = () => {
  const fs = ' font-size="10"', fb = ' font-size="11" font-weight="700"', f9 = ' font-size="9"';
  // surface continentale : plateau vers y = 60, puis pente jusqu'au prisme d'accrétion
  const surf = x => (x < 200 ? 60 : 64 + (x - 200) * 0.48);
  let g = L([300, 62], [548, 62], ' stroke-width="1"');
  g += '<path d="M40 60 L104 58 L116 40 L124 40 L136 58 L200 64 Q 250 70 280 100 L300 112"/>';
  // croûte continentale (croix) entre la surface et le Moho, hors pluton, cheminée et chambre magmatique
  for (let x = 52; x <= 262; x += 26) for (let y = 80; y <= 150; y += 22) {
    if (y < surf(x) + 14) continue;
    if (x > 56 && x < 104 && y < 130) continue;
    if (x > 100 && x < 144) continue;
    if (x > 232 && y > 132) continue;
    g += T([x - 3, y], "+", f9);
  }
  g += L([40, 166], [292, 166], POINTILLE + ' stroke-width="1"');
  g += '<path d="M66 82 Q 58 100 70 118 Q 84 126 92 110 Q 98 92 86 80 Q 76 72 66 82 Z" stroke-width="1.4"/>' + T([72, 104], "+", f9);
  g += '<path d="M118 44 L118 92 Q 104 104 112 122 Q 122 134 116 150 L92 158 Q 82 176 96 186 L110 196 Q 70 210 86 226 Q 120 232 160 212 Q 186 196 170 176 Q 156 168 150 158 Q 132 150 132 124 Q 138 104 124 92 L124 44" stroke-width="1.4"/>';
  g += '<rect x="118" y="160" width="44" height="14" fill="none" stroke-width="1"/>' + T([122, 171], "MAGMA", ' font-size="9" font-weight="700"');
  // plaque plongeante : surface, Moho (tirets), base ; plus épaisse près de la dorsale
  const haut = "M548 62 Q 420 64 340 104 Q 300 128 280 160 Q 250 220 222 330";
  const moho = "M548 80 Q 430 96 360 126 Q 320 150 300 188 Q 276 244 252 330";
  const bas = "M548 118 Q 440 130 380 150 Q 340 175 320 214 Q 300 270 280 330";
  g += '<path d="' + haut + '" stroke-width="1.6"/><path d="' + bas + '" stroke-width="1.6"/><path d="' + moho + '"' + POINTILLE + ' stroke-width="1"/>';
  g += '<path d="M296 112 L308 96 L330 98 L322 112" stroke-width="1"/>'; for (let k = 0; k < 4; k++) g += L([302 + k * 6, 110], [308 + k * 6, 98], ' stroke-width="0.8"');
  g += '<path d="M528 62 L534 50 M528 62 L522 50 M528 62 L540 72 M528 62 L516 72" stroke-width="1"/>';
  [[302, 140], [290, 160], [278, 180], [264, 206], [252, 236], [242, 266], [232, 300]].forEach(([x, y]) => { g += etoile(x, y); });
  g += '<rect x="182" y="184" width="26" height="14" stroke-width="1"/>' + T([186, 195], "eau", f9) + L([256, 196], [212, 192], ' stroke-width="0.9"') + fleche([210, 192], [220, 193], 6) + '<path d="M182 196 Q 168 210 150 214" stroke-width="0.9"/>' + fleche([148, 215], [158, 212], 6);
  // sens du mouvement de la plaque
  [[470, 140, 448, 148], [356, 196, 346, 214], [318, 290, 312, 308]].forEach(([a, b, c, d]) => { g += L([a, b], [c, d], ' stroke-width="1"') + fleche([c, d], [a, b], 6); });
  g += etoile(452, 296) + T([462, 300], "séismes", fs);
  g += T([426, 178], "ASTHÉNOSPHÈRE", fb) + T([52, 250], "ASTHÉNOSPHÈRE", fb) + L([44, 236], [232, 236], ' stroke-width="0.8"');
  g += T([436, 81], "croûte océanique", f9) + T([436, 112], "manteau supérieur", f9);
  g += T([96, 12], "roches volcaniques", fs) + L([122, 16], [120, 38], ' stroke-width="0.7"') + T([270, 12], "prisme d'accrétion", fs) + L([316, 16], [316, 96], ' stroke-width="0.7"');
  g += T([400, 12], "dorsale médio-océanique —", fs) + T([400, 26], "zone d'accrétion", fb) + L([528, 30], [528, 48], ' stroke-width="0.7"') + fleche([528, 56], [528, 46], 5);
  g += T([356, 252], "plongement de la plaque", fs) + T([356, 263], "lithosphérique", fs) + L([354, 254], [318, 254], ' stroke-width="0.7"') + fleche([314, 254], [324, 254], 5);
  g += T([132, 280], "lithosphère", fs) + T([132, 291], "océanique", fs) + L([228, 288], [276, 302], ' stroke-width="1.2"') + L([184, 286], [226, 288], ' stroke-width="0.7"');
  g += T([150, 322], "Moho", fs) + L([178, 318], [246, 318], ' stroke-width="0.7"') + fleche([250, 318], [240, 318], 5);
  // repère de la lithosphère continentale (accolade verticale) et légendes de gauche, dans une marge de 72 px
  const M = 72;
  g += L([30, 58], [30, 232], ' stroke-width="1"') + fleche([30, 54], [30, 64], 5) + fleche([30, 236], [30, 226], 5);
  let marge = "";
  [["pluton", "granitique", 92, 70], ["croûte", "continentale", 128, 50], ["Moho", "", 166, 40], ["manteau", "supérieur", 200, 40]].forEach(([a, b, y, x2]) => {
    marge += T([0, b ? y - 2 : y + 3], a, f9) + (b ? T([0, y + 8], b, f9) : "") + L([58, y], [M + x2, y], ' stroke-width="0.7"');
  });
  marge += T([0, 252], "lithosphère", f9) + T([0, 262], "continentale", f9) + L([54, 250], [M + 26, 232], ' stroke-width="0.7"');
  return svg(560 + M, 334, marge + '<g transform="translate(' + M + ' 0)">' + g + "</g>", "Subduction : la plaque océanique, formée à la dorsale médio-océanique, plonge sous la plaque continentale ; foyers des séismes le long du plan de plongement ; l'eau libérée par la plaque plongeante favorise la formation du magma qui alimente pluton granitique et volcan ; prisme d'accrétion au contact des deux plaques.");
};
// SVT D 2025, document 1 : étapes de la diagenèse (sédiment meuble → roche cohérente).
S["proba-2025-svt-d-diagenese"] = () => {
  const fs = ' font-size="11"', fb = ' font-size="11" font-weight="700"';
  const grain = (x, y, sombre) => '<ellipse cx="' + f(x) + '" cy="' + f(y) + '" rx="14" ry="11"' + (sombre ? ' fill="currentColor" fill-opacity="0.55"' : "") + "/>";
  let g = "";
  for (let i = 0; i < 3; i++) for (let j = 0; j < 3; j++) g += grain(92 + i * 34, 34 + j * 28);
  g += T([4, 70], "Sédiment", fb) + T([4, 82], "meuble", fs) + T([140, 12], "Grains de sable", ' font-size="10" font-weight="700"') + L([138, 12], [110, 30], ' stroke-width="0.7"') + L([150, 16], [128, 32], ' stroke-width="0.7"') + T([100, 124], "État 1", fb);
  for (let i = 0; i < 3; i++) for (let j = 0; j < 3; j++) g += grain(326 + i * 26 + (j % 2) * 12, 52 + j * 20);
  g += L([352, 6], [352, 22], ' stroke-width="3"') + fleche([352, 30], [352, 20], 8) + L([352, 132], [352, 116], ' stroke-width="3"') + fleche([352, 108], [352, 118], 8);
  g += '<path d="M180 64 Q 240 58 300 76" stroke-width="1.2"/>' + T([228, 98], "Étape A", fb);
  g += '<path d="M300 104 Q 270 136 236 150" stroke-width="1.2"/>' + fleche([230, 152], [242, 147], 7);
  for (let i = 0; i < 3; i++) for (let j = 0; j < 3; j++) g += grain(150 + i * 26 + (j % 2) * 12, 164 + j * 20, j === 0);
  [[96, 172], [96, 196]].forEach(([x, y]) => { g += '<path d="M' + x + " " + y + " q 6 -4 12 0 t 12 0 t 12 0" + '" stroke-width="1"/>' + fleche([x + 42, y], [x + 34, y], 6); });
  [[234, 158], [234, 214]].forEach(([x, y]) => { g += '<path d="M' + x + " " + y + " q 6 -4 12 0 t 12 0 t 12 0" + '" stroke-width="1"/>' + fleche([x + 42, y], [x + 34, y], 6); });
  g += T([236, 190], "circulation d'eau sursaturée", ' font-size="10" font-weight="700"') + T([150, 236], "État 2", fb);
  g += L([196, 226], [262, 252], ' stroke-width="1.2"') + fleche([268, 254], [258, 250], 7) + T([200, 258], "Étape B", fb);
  g += '<path d="M282 230 L404 226 L410 300 L280 304 Z" fill="currentColor" fill-opacity="0.3" stroke-width="1.2"/>';
  for (let i = 0; i < 4; i++) for (let j = 0; j < 3; j++) g += grain(298 + i * 30 + (j % 2) * 8, 244 + j * 22, j === 0);
  g += T([354, 220], "ciment", ' font-size="10" font-weight="700"') + L([366, 222], [372, 234], ' stroke-width="0.7"') + T([300, 320], "État 3", fb) + T([346, 320], "Roche cohérente", fs);
  return svg(440, 326, g, "Diagenèse : état 1, sédiment meuble (grains de sable séparés) ; étape A, tassement sous pression ; état 2, grains rapprochés traversés par une eau sursaturée ; étape B ; état 3, grains liés par un ciment : roche cohérente.");
};
// SVT D 2025, document 5 : mouvements atmosphériques et océaniques dans les zones côtières.
S["proba-2025-svt-d-oceans"] = () => {
  const fb = ' font-size="12" font-weight="700"', fs = ' font-size="10" font-weight="700"';
  let g = '<rect x="2" y="2" width="456" height="246" stroke-width="1.2"/>' + T([10, 20], "Région A", ' font-size="14" font-weight="700"') + T([376, 20], "Région B", ' font-size="14" font-weight="700"');
  g += T([10, 40], "Basse pression", fb) + T([10, 54], "Climat humide", fb) + T([120, 38], "Précipitations", fs) + T([340, 40], "Haute pression", fb) + T([340, 54], "Climat sec", fb);
  const nuage = (x, y) => '<path d="M' + x + " " + y + " q -2 -12 10 -12 q 4 -10 16 -6 q 10 -4 14 6 q 10 0 8 12 Z" + '" stroke-width="1.1"/>' + [0, 8, 16, 24].map(d => L([x + 4 + d, y + 4], [x + 2 + d, y + 12], ' stroke-width="0.8" stroke-dasharray="2 2"')).join("");
  g += nuage(46, 82) + nuage(122, 76);
  g += T([188, 66], "Vents alizés", ' font-size="13" font-weight="700"');
  for (let x = 340; x > 160; x -= 50) g += L([x, 80], [x - 30, 80], ' stroke-width="1.2"') + fleche([x - 34, 80], [x - 26, 80], 6);
  g += '<path d="M2 96 Q 30 88 60 96 L380 96 Q 410 92 420 70 Q 432 44 446 34" stroke-width="1.6"/>';
  for (let x = 330; x > 110; x -= 50) g += L([x, 104], [x - 28, 104], ' stroke-width="1"') + fleche([x - 32, 104], [x - 24, 104], 5);
  g += '<path d="M60 96 Q 70 110 72 140 L76 226 L80 140 Q 90 160 200 164 Q 260 162 290 150 Q 300 144 310 150 Q 340 162 356 160 L360 216 L364 140 Q 368 110 380 96" stroke-width="1.6"/>';
  g += '<path d="M84 110 Q 96 138 120 144" stroke-width="1.4"/>' + fleche([126, 146], [114, 142], 6) + '<path d="M136 148 Q 200 150 290 132" stroke-width="1.4"/>' + fleche([296, 131], [284, 134], 6) + '<path d="M300 130 Q 344 132 366 104" stroke-width="1.4"/>' + fleche([369, 100], [362, 110], 6);
  g += L([96, 140], [270, 124], ' stroke-dasharray="1.5 3" stroke-width="1"') + T([150, 128], "Thermocline", ' font-size="10" font-weight="700" transform="rotate(-6 150 128)"') + T([296, 124], "Upwelling", fs) + T([284, 176], "Dorsale", ' font-size="9" font-weight="700"');
  g += T([52, 238], "Fosse", ' font-size="9" font-style="italic" font-weight="700"') + T([368, 214], "Fosse", ' font-size="9" font-style="italic" font-weight="700"') + L([68, 84], [68, 104], ' stroke-width="1"');
  return svg(460, 250, g, "Mouvements atmosphériques et océaniques : les vents alizés soufflent de la région B (haute pression, climat sec) vers la région A (basse pression, climat humide, précipitations) ; ils entraînent les eaux de surface vers la région A ; les eaux profondes remontent près de la région B (upwelling) ; thermocline, dorsale et fosses.");
};
// Corrigé SVT D 2025 : courbes hodochrones des ondes P et S (données du document 2).
S["proba-2025-svt-d-hodochrones"] = () => {
  const X = d => 44 + d * 0.028, Y = t => 300 - t * 10.4, fs = ' font-size="10"';
  let g = '<g stroke-width="0.6" opacity="0.4">'; for (let d = 2000; d <= 12000; d += 2000) g += L([X(d), Y(0)], [X(d), Y(27)]); for (let t = 5; t <= 25; t += 5) g += L([X(0), Y(t)], [X(12400), Y(t)]); g += "</g>";
  g += L([X(0), Y(0)], [X(12600), Y(0)], ' stroke-width="1.2"') + fleche([X(12800), Y(0)], [X(12600), Y(0)], 7) + L([X(0), Y(0)], [X(0), Y(27.6)], ' stroke-width="1.2"') + fleche([X(0), Y(28.2)], [X(0), Y(27.6)], 7);
  for (let d = 2000; d <= 12000; d += 2000) g += T([X(d) - 14, Y(0) + 14], String(d), fs);
  for (let t = 5; t <= 25; t += 5) g += T([X(0) - 18, Y(t) + 4], String(t), fs);
  g += T([X(0) - 6, Y(0) + 14], "0", fs) + T([X(7000), Y(0) + 30], "Distance à l'épicentre (km)", fs) + T([X(0) + 6, Y(28)], "Durée du trajet (min)", fs);
  const P = [[0, 0], [1112, 2.4], [5049, 8 + 14 / 60], [11332, 13.8]], Sw = [[0, 0], [1112, 4 + 17 / 60], [5049, 14 + 49 / 60], [11332, 25 + 20 / 60]];
  const courbe = pts => { const q = pts.map(([d, t]) => [X(d), Y(t)]); let c = "M" + f(q[0][0]) + " " + f(q[0][1]); for (let i = 0; i < q.length - 1; i++) { const a = q[Math.max(0, i - 1)], b = q[i], e = q[i + 1], n = q[Math.min(q.length - 1, i + 2)]; c += " C" + f(b[0] + (e[0] - a[0]) / 6) + " " + f(b[1] + (e[1] - a[1]) / 6) + " " + f(e[0] - (n[0] - b[0]) / 6) + " " + f(e[1] - (n[1] - b[1]) / 6) + " " + f(e[0]) + " " + f(e[1]); } return c; };
  g += '<path d="' + courbe(Sw) + '" stroke-width="2"/><path d="' + courbe(P) + '" stroke-width="2" stroke-dasharray="7 4"/>';
  [...P.slice(1), ...Sw.slice(1)].forEach(([d, t]) => { g += '<circle cx="' + f(X(d)) + '" cy="' + f(Y(t)) + '" r="3" fill="currentColor" stroke="none"/>'; });
  g += T([X(11332) - 6, Y(25.33) - 8], "ondes S", ' font-size="11" font-weight="700"') + T([X(11332) - 6, Y(13.8) - 8], "ondes P", ' font-size="11" font-weight="700"');
  return svg(X(12800) + 14, Y(0) + 36, g, "Courbes hodochrones : durée du trajet en fonction de la distance à l'épicentre ; ondes S (trait plein) passant par 4 min 17 s à 1 112 km, 14 min 49 s à 5 049 km, 25 min 20 s à 11 332 km ; ondes P (tirets) passant par 2 min 24 s, 8 min 14 s et 13 min 48 s ; les ondes P arrivent toujours les premières.");
};
// Corrigé SVT D 2025 : mécanisme de l'effet de serre.
S["proba-2025-svt-d-serre"] = () => {
  const fs = ' font-size="10"';
  let g = '<circle cx="40" cy="36" r="20" stroke-width="1.6"/>'; for (let k = 0; k < 8; k++) { const a = k * Math.PI / 4; g += L([40 + 24 * Math.cos(a), 36 + 24 * Math.sin(a)], [40 + 31 * Math.cos(a), 36 + 31 * Math.sin(a)]); }
  g += T([22, 82], "Soleil", ' font-size="11" font-weight="700"');
  g += '<rect x="80" y="84" width="330" height="34" fill="currentColor" fill-opacity="0.12" stroke-dasharray="4 3" stroke-width="1"/>' + T([298, 106], "gaz à effet de serre", ' font-size="10" font-weight="700"') + T([168, 106], "atmosphère", fs);
  g += '<path d="M60 210 Q 230 196 400 210 L400 236 L60 236 Z" fill="currentColor" fill-opacity="0.25" stroke-width="1.4"/>' + T([196, 230], "Terre", ' font-size="11" font-weight="700"');
  g += L([64, 58], [150, 200], ' stroke-width="2"') + fleche([154, 206], [148, 196], 8) + T([30, 150], "rayonnement", fs) + T([30, 161], "solaire", fs);
  g += L([90, 50], [128, 92], ' stroke-width="1.2"') + L([128, 92], [168, 52], ' stroke-width="1.2"') + fleche([172, 48], [164, 56], 7) + T([150, 40], "réfléchi", fs);
  g += '<path d="M220 200 Q 230 150 250 96" stroke-width="1.6"/>' + fleche([252, 90], [249, 100], 7) + T([156, 146], "infrarouge", fs) + T([156, 157], "émis par le sol", fs);
  g += '<path d="M262 96 Q 280 150 290 198" stroke-width="1.6"/>' + fleche([291, 204], [289, 194], 7) + T([298, 160], "infrarouge renvoyé", fs) + T([298, 171], "vers le sol", fs);
  g += L([320, 84], [346, 26], ' stroke-width="1.2" stroke-dasharray="4 3"') + fleche([348, 20], [345, 30], 7) + T([352, 34], "vers l'espace", fs);
  return svg(440, 240, g, "Effet de serre : le rayonnement solaire traverse l'atmosphère et réchauffe le sol ; le sol émet un rayonnement infrarouge ; les gaz à effet de serre en absorbent une partie et la renvoient vers le sol, le reste part vers l'espace.");
};
// Sciences A-ABI 2025, document 1 : caryotype d'une cellule reproductrice (un chromosome par numéro, 1 à 22 et Y),
// en grille de cinq colonnes comme sur le scan. Tracés relevés sur le scan (repère 870 × 500, réduit à 60 %).
S["proba-2025-sciences-caryotype"] = () => {
  const C = [ // [numéro, épaisseur, points du tracé, position du numéro]
    [1, 20, [[140, 32], [95, 60], [78, 95], [84, 120], [100, 130]], [62, 150]],
    [2, 18, [[328, 45], [265, 78], [320, 125]], [272, 150]],
    [3, 15, [[525, 45], [462, 72], [505, 102]], [465, 146]],
    [4, 16, [[602, 40], [598, 85], [602, 118]], [628, 145]],
    [5, 18, [[828, 42], [802, 62], [812, 92], [838, 108]], [805, 141]],
    [6, 16, [[110, 180], [72, 192], [58, 212], [66, 232], [78, 235]], [50, 253]],
    [7, 20, [[235, 172], [232, 200], [238, 230]], [262, 250]],
    [8, 18, [[405, 178], [415, 205], [408, 232]], [440, 253]],
    [9, 16, [[585, 175], [578, 200], [588, 225]], [612, 250]],
    [10, 16, [[835, 178], [800, 188], [808, 208], [830, 220]], [805, 250]],
    [11, 16, [[70, 277], [66, 300], [75, 325]], [72, 353]],
    [12, 18, [[282, 277], [278, 300], [290, 328]], [258, 353]],
    [13, 14, [[462, 293], [468, 325]], [445, 353]],
    [14, 18, [[600, 288], [585, 310], [590, 328]], [615, 348]],
    [15, 18, [[808, 285], [800, 305], [818, 325]], [805, 353]],
    [16, 16, [[72, 368], [64, 385], [76, 402]], [55, 423]],
    [17, 18, [[272, 372], [262, 388], [275, 405]], [250, 423]],
    [18, 16, [[435, 378], [440, 398]], [465, 426]],
    ["Y", 14, [[828, 410], [832, 397], [848, 395]], [862, 433]],
    [19, 16, [[45, 445], [40, 462]], [70, 490]],
    [20, 16, [[305, 450], [292, 460], [302, 472]], [285, 493]],
    [21, 16, [[442, 452], [445, 468]], [470, 496]],
    [22, 18, [[648, 450], [650, 462]], [628, 488]]];
  let g = "";
  C.forEach(([n, ep, pts, lab]) => {
    g += '<polyline points="' + pts.map(p => p.join(",")).join(" ") + '" stroke-width="' + f(ep * 1.4) + '" stroke-linecap="round" stroke-linejoin="round"/>';
    g += T(lab, String(n), ' font-size="22" font-weight="700" text-anchor="middle"');
  });
  return svg(522, 302, '<g transform="scale(0.6)">' + g + "</g>", "Document 1 : caryotype d'une cellule humaine : un seul chromosome de chaque numéro, de 1 à 22, et un chromosome Y, soit 23 chromosomes.");
};

// ——— BAC 2025 ———
// Repère orthonormé quadrillé commun : unité u px, x de xa à xb, y de ya à yb ; renvoie {g, X, Y}.
function repere(u, xa, xb, ya, yb, m = 24) {
  const X = x => m + (x - xa) * u, Y = y => 10 + (yb - y) * u, fs = ' font-size="10"';
  let g = '<g stroke-width="0.5" opacity="0.35">';
  for (let i = Math.ceil(xa); i <= xb; i++) g += L([X(i), Y(ya)], [X(i), Y(yb)]);
  for (let j = Math.ceil(ya); j <= yb; j++) g += L([X(xa), Y(j)], [X(xb), Y(j)]);
  g += "</g>" + L([X(xa), Y(0)], [X(xb) + 4, Y(0)], ' stroke-width="1.2"') + fleche([X(xb) + 8, Y(0)], [X(xb), Y(0)], 6) +
    L([X(0), Y(ya)], [X(0), Y(yb) - 4], ' stroke-width="1.2"') + fleche([X(0), Y(yb) - 8], [X(0), Y(yb)], 6);
  for (let i = Math.ceil(xa); i <= xb; i++) if (i) g += T([X(i) - 3, Y(0) + 12], String(i).replace("-", "−"), fs);
  for (let j = Math.ceil(ya); j <= yb; j++) if (j) g += T([X(0) - 13, Y(j) + 4], String(j).replace("-", "−"), fs);
  g += T([X(0) - 10, Y(0) + 12], "O", fs);
  return { g, X, Y, W: X(xb) + 14, H: Y(ya) + 12 };
}
const point = (X, Y, x, y, nom, dx = 5, dy = -5) => '<circle cx="' + f(X(x)) + '" cy="' + f(Y(y)) + '" r="2.6" fill="currentColor" stroke="none"/>' + T([X(x) + dx, Y(y) + dy], nom, ' font-size="12" font-style="italic"');
// Corrigé maths D-TI 2025, exercice 3 : A, B, C, D, H et H' ; cercle (C2) de centre H'(1 ; −1), rayon 2√2 ; lieu : cercle de centre B, rayon 4.
S["bac-2025-maths-dti-cercles"] = () => {
  const R = repere(26, -6.5, 5.5, -4.5, 6.5), { X, Y } = R, u = 26, pt = ' stroke-width="1.1" stroke-dasharray="2 3"';
  let g = R.g;
  g += L([X(-1), Y(5)], [X(-1), Y(1)], ' stroke-width="1.4"') + L([X(-1), Y(5)], [X(3), Y(1)], ' stroke-width="1.4"') + L([X(-1), Y(1)], [X(3), Y(1)], ' stroke-width="1.4"');
  g += L([X(-1), Y(1)], [X(3), Y(5)], pt) + L([X(-1), Y(1)], [X(1), Y(-1)], pt);
  g += code([X(-1), Y(5)], [X(1), Y(3)], 2) + code([X(1), Y(3)], [X(3), Y(1)], 2) + code([X(-1), Y(1)], [X(1), Y(-1)], 2);
  g += '<circle cx="' + f(X(1)) + '" cy="' + f(Y(3)) + '" r="' + f(2 * Math.SQRT2 * u) + '" stroke-width="1.2"/>';
  g += '<circle cx="' + f(X(1)) + '" cy="' + f(Y(-1)) + '" r="' + f(2 * Math.SQRT2 * u) + '" stroke-width="1.8"/>';
  g += '<circle cx="' + f(X(-1)) + '" cy="' + f(Y(1)) + '" r="' + f(4 * u) + '" stroke-width="1.8" stroke-dasharray="7 4"/>';
  g += point(X, Y, -1, 5, "A", -14, -4) + point(X, Y, -1, 1, "B", -14, -4) + point(X, Y, 3, 1, "C", 6, 14) + point(X, Y, 3, 5, "D", 6, -5) + point(X, Y, 1, 3, "H", 6, -5) + point(X, Y, 1, -1, "H'", 6, 4);
  g += T([X(3.9), Y(3.3)], "(C1)", ' font-size="12" font-style="italic"') + T([X(3.6), Y(-2.8)], "(C2)", ' font-size="12" font-style="italic"');
  g += T([X(-6.3), Y(-3.7)], "Lieu géométrique des points M", ' font-size="11" font-style="italic"') + L([X(-4.6), Y(-3.3)], [X(-3.9), Y(-2.3)], ' stroke-width="0.8"');
  return svg(R.W, R.H, g, "Triangle ABC rectangle isocèle en B, avec A(−1 ; 5), B(−1 ; 1), C(3 ; 1) ; D(3 ; 5) ; H(1 ; 3) milieu de [AC] et H'(1 ; −1) ; cercle (C1) de centre H, cercle (C2) de centre H' et de rayon 2√2, et lieu des points M : cercle de centre B et de rayon 4, en tirets.");
};
// Corrigé maths D-TI 2025, exercice 4 : courbe de f(x) = x ln x − x, f(0) = 0 ; minimum (1 ; −1), coupe l'axe en e ; tangente verticale en O.
S["bac-2025-maths-dti-courbe"] = () => {
  const R = repere(38, -0.6, 7.3, -1.6, 6.2), { X, Y } = R;
  let g = R.g; const p = [[X(0), Y(0)]];
  for (let x = 0.002; x <= 7.2; x += 0.01) { const y = x * Math.log(x) - x; if (y <= 6.1) p.push([X(x), Y(y)]); }
  g += P(p, ' stroke-width="2.2"');
  g += L([X(0.25), Y(-1)], [X(1.75), Y(-1)], ' stroke-width="1"') + fleche([X(0.2), Y(-1)], [X(1), Y(-1)], 6) + fleche([X(1.8), Y(-1)], [X(1), Y(-1)], 6) + L([X(1), Y(0)], [X(1), Y(-1)], POINTILLE + ' stroke-width="1"');
  g += '<circle cx="' + f(X(Math.E)) + '" cy="' + f(Y(0)) + '" r="2.6" fill="currentColor" stroke="none"/>' + T([X(Math.E) - 4, Y(0) - 7], "e", ' font-size="12" font-style="italic"');
  g += T([X(4.6), Y(2.2)], "(C<tspan font-size=\"9\" dy=\"3\">f</tspan>)", ' font-size="12" font-style="italic"');
  return svg(R.W, R.H, g, "Courbe de f : part de l'origine avec une tangente verticale, descend jusqu'au minimum (1 ; −1) où la tangente est horizontale, remonte, coupe l'axe des abscisses en x = e ≈ 2,72, puis croît vers +∞.");
};
// Chimie C-D-E 2025, exercice 2.3 : acide 2-méthylbutanoïque (formule semi-développée du sujet).
S["bac-2025-chimie-acide"] = () => {
  const fs = ' font-size="14"', tiret = x => L([x, 45], [x + 12, 45], ' stroke-width="1.2"');
  let g = F([4, 50], "CH3", fs) + tiret(34) + F([50, 50], "CH2", fs) + tiret(82) + T([98, 50], "CH", fs) + tiret(122) + T([138, 50], "C", fs);
  g += L([107, 55], [107, 66], ' stroke-width="1.2"') + F([96, 82], "CH3", fs);
  g += L([148, 38], [166, 18], ' stroke-width="1.2"') + L([152, 41], [170, 21], ' stroke-width="1.2"') + T([168, 16], "O", fs) + L([148, 52], [166, 70], ' stroke-width="1.2"') + T([164, 84], "OH", fs);
  return svg(200, 92, g, "Acide 2-méthylbutanoïque : CH3–CH2–CH(CH3)–COOH.");
};
// Chimie C-D-E 2025, exercice 2.4 : anhydride éthanoïque + phénylamine → X + acide éthanoïque.
S["bac-2025-chimie-anhydride"] = () => {
  const fs = ' font-size="14"', v = (x, y1, y2) => L([x - 2, y1], [x - 2, y2], ' stroke-width="1.1"') + L([x + 2, y1], [x + 2, y2], ' stroke-width="1.1"');
  let g = F([4, 52], "CH3 − C", fs) + T([60, 16], "O", fs) + L([64, 22], [56, 38], ' stroke-width="1.2"') + L([70, 22], [80, 38], ' stroke-width="1.2"') + F([76, 52], "C − CH3", fs);
  g += v(56, 58, 72) + T([51, 88], "O", fs) + v(81, 58, 72) + T([76, 88], "O", fs);
  g += F([150, 52], "+  C6H5 − NH2", fs) + L([262, 47], [298, 47], ' stroke-width="1.4"') + fleche([304, 47], [294, 47], 7) + T([330, 52], "X", fs) + F([372, 52], "+  CH3 − COOH", fs);
  return svg(486, 96, g, "Anhydride éthanoïque CH3–CO–O–CO–CH3 + C6H5–NH2 → X + CH3–COOH.");
};
// Corrigé chimie 2025 : les deux énantiomères de l'acide 2-méthylbutanoïque (représentation de Cram), de part et d'autre d'un miroir.
S["bac-2025-chimie-enantiomeres"] = () => {
  const fs = ' font-size="13"';
  const molecule = (cx, s) => {
    const cy = 64, h = [cx + s * 34, cy + 6], e = [cx + s * 18, cy + 38], m = [cx - s * 30, cy + 28];
    let g = L([cx, cy - 8], [cx, cy - 34], ' stroke-width="1.4"') + L([cx - s * 4, cy + 6], m, ' stroke-width="1.4"');
    for (let k = 1; k <= 4; k++) { const t = k / 5; g += L([cx + s * (6 + 22 * t), cy + 2 + 4 * t - 3], [cx + s * (6 + 22 * t), cy + 2 + 4 * t + 3], ' stroke-width="1.2"'); }
    g += '<path d="M' + f(cx + s * 3) + " " + f(cy + 6) + " L" + f(e[0] - 4) + " " + f(e[1] - 4) + " L" + f(e[0] + 4) + " " + f(e[1] - 6) + ' Z" fill="currentColor" stroke="none"/>';
    g += T([cx, cy + 4], "C", fs + ' font-weight="700" text-anchor="middle"') + T([cx, cy - 40], s > 0 ? "COOH" : "HOOC", fs + ' text-anchor="middle"');
    g += T([h[0] + s * 4, h[1] + 4], "H", fs + (s > 0 ? "" : ' text-anchor="end"')) + F([m[0] - (s > 0 ? 32 : -4), m[1] + 14], "CH3", fs) + F([e[0] - 14, e[1] + 18], "C2H5", fs);
    return g;
  };
  return svg(360, 132, molecule(90, 1) + molecule(270, -1) + L([180, 4], [180, 104], ' stroke-width="1.4"') + T([180, 124], "miroir", ' font-size="12" text-anchor="middle"'),
    "Les deux énantiomères de l'acide 2-méthylbutanoïque en représentation de Cram : autour du carbone asymétrique, COOH en haut, CH3 dans le plan, H en arrière (traits pointillés) et C2H5 en avant (triangle plein), images l'un de l'autre dans un miroir.");
};

// Physique D 2025 (BAC), exercice 2.1 : forces appliquées au corps (S) sur le plan horizontal.
const vecteur = (p, nom, x = "") => T(p, nom, ' font-size="13" font-style="italic"' + x) + L([p[0] - 1, p[1] - 12], [p[0] + 9, p[1] - 12], ' stroke-width="0.9"') + fleche([p[0] + 11, p[1] - 12], [p[0] + 5, p[1] - 12], 4);
S["bac-2025-physique-d-forces"] = () => {
  let g = L([20, 50], [220, 50], ' stroke-width="1.8"');
  for (let x = 30; x <= 214; x += 14) g += L([x, 51], [x - 9, 62], ' stroke-width="1.1"');
  g += '<rect x="113" y="38" width="13" height="12" fill="currentColor" stroke="none"/>';
  g += L([119.5, 38], [119.5, 12]) + fleche([119.5, 6], [119.5, 16], 7) + vecteur([126, 18], "R");
  g += L([119.5, 50], [119.5, 72]) + fleche([119.5, 79], [119.5, 70], 7) + vecteur([126, 82], "P");
  g += L([126, 44], [174, 44]) + fleche([181, 44], [172, 44], 7) + vecteur([160, 36], "F");
  g += L([113, 44], [68, 44]) + fleche([61, 44], [70, 44], 7) + vecteur([70, 36], "f");
  return svg(240, 90, g, "Le corps ponctuel (S) sur le plan horizontal : poids P vers le bas, réaction R vers le haut, force motrice F dans le sens du mouvement, force de frottement f en sens opposé.");
};
// Physique D 2025 (BAC), exercice 3.2 : plan incliné AB (β = 30°), saut à partir de B, sol en B'C.
S["bac-2025-physique-d-plan"] = () => {
  const A = [45, 205], B = [175, 130], u = unit(A, B), fs = ' font-size="14"';
  let g = L(A, B, ' stroke-width="1.8"') + L(A, [175, 205], POINTILLE + ' stroke-width="1"');
  g += L(B, [B[0] + u[0] * 70, B[1] + u[1] * 70], ' stroke-width="1.6"') + fleche([B[0] + u[0] * 80, B[1] + u[1] * 80], [B[0] + u[0] * 70, B[1] + u[1] * 70], 8);
  g += '<path d="M73 205 A 28 28 0 0 0 69.2 191"/>' + T([78, 200], "β", fs);
  g += L([175, 318], [175, 22]) + fleche([175, 14], [175, 24], 8) + T([156, 24], "y", fs);
  g += L(B, [322, 130]) + fleche([330, 130], [320, 130], 8) + T([322, 152], "x", fs);
  g += L([174, 318], [356, 318], ' stroke-width="1.8"'); for (let x = 184; x <= 356; x += 13) g += L([x, 319], [x - 9, 330], ' stroke-width="1.1"');
  g += '<circle cx="105" cy="170" r="5" fill="currentColor" stroke="none"/>' + T([88, 156], "(S)", fs);
  g += '<circle cx="300" cy="318" r="3" fill="currentColor" stroke="none"/>' + T([296, 308], "C", fs) + T([20, 210], "A", fs) + T([180, 152], "B", fs) + T([150, 314], "B’", fs);
  g += vecteur([196, 102], "V<tspan dy=\"4\" font-size=\"9\">B</tspan>");
  g += L([258, 28], [258, 54], ' stroke-width="1.4"') + fleche([258, 62], [258, 52], 7) + vecteur([266, 44], "g");
  return svg(370, 340, g, "Le solide (S) monte le plan AB incliné de β sur l'horizontale passant par A ; en B il quitte le plan avec la vitesse VB ; repère (B, x, y) d'origine B ; il retombe en C sur le sol horizontal passant par B', à la verticale sous B.");
};
// Physique D 2025 (BAC), corrigé 2.3 : construction de Fresnel (1 cm pour 10 mm, ici 20 px par cm).
S["bac-2025-physique-d-fresnel"] = () => {
  const O = [40, 140], k = 20, fs = ' font-size="13"', M1 = [O[0] + 5 * k, O[1]], M = [O[0] + 5 * k, O[1] - 5 * k];
  let g = L([20, 140], [200, 140], ' stroke-width="1"') + fleche([206, 140], [198, 140], 6) + T([190, 158], "Δ", fs);
  g += L(O, [M1[0] - 6, M1[1]], ' stroke-width="2"') + fleche(M1, O, 9) + L(M1, [M[0], M[1] + 6], ' stroke-width="2"') + fleche(M, M1, 9);
  g += L(O, [M[0] - 4.5, M[1] + 4.5], ' stroke-width="2.4"') + fleche(M, O, 10) + droit(M1, [-1, 0], [0, -1], 8);
  g += '<path d="M66 140 A 26 26 0 0 0 58.4 121.6"/>' + T([70, 132], "π/4", ' font-size="11"');
  g += T([24, 156], "O", fs) + T([56, 160], "OM₁ = 5 cm (x₁)", ' font-size="11"') + T([146, 92], "M₁M = 5 cm (x₂)", ' font-size="11"') + T([8, 64], "OM ≈ 7,1 cm (x)", ' font-size="11"') + T([144, 36], "M", fs) + T([144, 156], "M₁", fs);
  return svg(260, 170, g, "Construction de Fresnel : le vecteur OM1 de 5 cm (x1, phase 0) sur l'axe origine des phases, puis M1M de 5 cm perpendiculaire (x2, avance de phase π/2) ; la résultante OM mesure environ 7,1 cm et fait un angle π/4 avec l'axe.");
};

// Physique C 2025 (BAC), exercice 2.1 : abscisse angulaire θ(t) du pendule simple (θm = π/15 rad, T = 2 s).
S["bac-2025-physique-c-pendule"] = () => {
  const X = t => 50 + t * 110, Y = v => 130 - v * 22, fs = ' font-size="13"';
  let g = '<g stroke-width="0.7" opacity="0.5">'; for (let k = 0; k <= 20; k++) g += L([X(k / 5), Y(4)], [X(k / 5), Y(-4)]); for (let v = -4; v <= 4; v++) g += L([X(0), Y(v)], [X(4), Y(v)]); g += "</g>";
  g += L([X(0), Y(0)], [X(4.25), Y(0)], ' stroke-width="1.2"') + fleche([X(4.32), Y(0)], [X(4.2), Y(0)], 7) + L([X(0), Y(-4)], [X(0), Y(5.1)], ' stroke-width="1.2"') + fleche([X(0), Y(5.5)], [X(0), Y(5)], 7);
  for (let t = 1; t <= 4; t++) g += L([X(t), Y(0) - 5], [X(t), Y(0) + 5], ' stroke-width="2.4"');
  g += T([X(1) + 5, Y(0) - 6], "1", ' font-size="12"') + T([X(0) - 14, Y(0) + 5], "0", fs) + T([X(4.05), Y(0) - 10], "t (s)", fs) + T([X(0) + 10, 18], "θ (rad)", fs);
  g += T([X(0) - 26, Y(4) - 4], "π", ' font-size="12"') + L([X(0) - 30, Y(4) + 1], [X(0) - 14, Y(4) + 1], ' stroke-width="1"') + T([X(0) - 30, Y(4) + 14], "15", ' font-size="12"');
  const pts = []; for (let k = 0; k <= 160; k++) { const t = k / 40; pts.push([X(t), Y(4 * Math.cos(Math.PI * t))]); }
  g += P(pts, ' stroke-width="2"');
  return svg(X(4.32) + 30, Y(-4) + 10, g, "Abscisse angulaire θ du pendule en fonction du temps : sinusoïde partant de son maximum π/15 rad à t = 0, minimum à t = 1 s, de nouveau maximale à t = 2 s, puis à t = 4 s ; graduation de 1 s sur l'axe des temps.");
};
// Physique C 2025 (BAC), exercice 2.4 : rails de Laplace, barre MN dans le champ B sortant.
S["bac-2025-physique-c-rails"] = () => {
  const fs = ' font-size="13"';
  let g = L([30, 40], [380, 40]) + L([30, 210], [380, 210]) + L([30, 40], [30, 70]) + '<rect x="23" y="70" width="14" height="44"/>' + L([30, 114], [30, 142]) + '<circle cx="30" cy="160" r="18"/>' + L([30, 178], [30, 210]);
  g += L([0, 172], [0, 150], ' stroke-width="1.2"') + fleche([0, 144], [0, 154], 6) + T([-14, 165], "E", fs) + T([4, 98], "R", fs);
  g += fleche([110, 40], [100, 40], 7) + T([66, 30], "I = 1 A", ' font-size="12"');
  g += L([230, 14], [230, 236], ' stroke-width="2"') + T([240, 22], "M", fs) + T([240, 234], "N", fs);
  g += '<rect x="110" y="72" width="270" height="88" stroke-dasharray="2 3" stroke-width="1.4"/>';
  g += '<circle cx="300" cy="120" r="9"/><circle cx="300" cy="120" r="2.5" fill="currentColor" stroke="none"/>' + vecteur([314, 126], "B");
  g += L([396, 78], [396, 154], ' stroke-width="1.2"') + fleche([396, 72], [396, 82], 6) + fleche([396, 160], [396, 150], 6) + T([404, 122], "d", fs);
  return svg(440, 246, '<g transform="translate(20 0)">' + g + "</g>", "Rails de Laplace : deux rails horizontaux reliés à gauche par un générateur E et un résistor R ; le courant I = 1 A circule dans le rail supérieur vers la droite ; la barre MN, verticale, coupe les rails ; la zone en pointillés, de largeur d, est celle du champ magnétique B sortant du plan.");
};
// Physique C 2025 (BAC), document 1 : intensité efficace I en fonction de la fréquence N (résonance vers 500 Hz).
S["bac-2025-physique-c-resonance"] = () => {
  const X = n => 50 + (n - 300) * 0.9, Y = v => 240 - v * 2, fs = ' font-size="11"';
  let g = '<g stroke-width="0.7" opacity="0.5">'; for (let n = 300; n <= 740; n += 20) g += L([X(n), Y(0)], [X(n), Y(100)]); for (let v = 10; v <= 100; v += 10) g += L([X(300), Y(v)], [X(740), Y(v)]); g += "</g>";
  g += L([X(300), Y(0)], [X(760), Y(0)], ' stroke-width="1.2"') + fleche([X(770), Y(0)], [X(758), Y(0)], 7) + L([X(300), Y(0)], [X(300), Y(108)], ' stroke-width="1.2"') + fleche([X(300), Y(113)], [X(300), Y(106)], 7);
  for (let n = 300; n <= 700; n += 100) g += T([X(n) - 10, Y(0) + 14], String(n), fs);
  g += T([X(300) - 26, Y(100) + 4], "100", fs) + T([X(300) - 18, Y(50) + 4], "50", fs) + T([X(300) - 12, Y(0) + 4], "0", fs) + T([X(300) + 6, Y(108)], "I (mA)", fs) + T([X(735), Y(0) - 6], "N (Hz)", fs);
  // points relevés sur le scan, lissés en Catmull-Rom
  const R = [[311, 17], [369, 18], [400, 22], [425, 32], [445, 50], [462, 70], [478, 88], [490, 97], [500, 100], [510, 97], [524, 87], [540, 73], [560, 58], [600, 40], [646, 29], [702, 20], [737, 16]].map(([n, v]) => [X(n), Y(v)]);
  let d = 'M' + f(R[0][0]) + ' ' + f(R[0][1]);
  for (let i = 0; i < R.length - 1; i++) { const p0 = R[Math.max(i - 1, 0)], p1 = R[i], p2 = R[i + 1], p3 = R[Math.min(i + 2, R.length - 1)];
    d += 'C' + f(p1[0] + (p2[0] - p0[0]) / 6) + ' ' + f(p1[1] + (p2[1] - p0[1]) / 6) + ' ' + f(p2[0] - (p3[0] - p1[0]) / 6) + ' ' + f(p2[1] - (p3[1] - p1[1]) / 6) + ' ' + f(p2[0]) + ' ' + f(p2[1]); }
  g += '<path d="' + d + '" stroke-width="2"/>';
  return svg(X(770) + 10, Y(0) + 22, g, "Document 1 : intensité efficace I (en mA) en fonction de la fréquence N (en Hz), de 300 à 740 Hz ; la courbe passe par un maximum de 100 mA pour N = 500 Hz.");
};
// Physique C 2025 (BAC), corrigé 3.1.1 : circuit RLC série alimenté par le GBF, avec l'ampèremètre.
S["bac-2025-physique-c-rlc"] = () => {
  const fs = ' font-size="12"';
  let g = L([30, 30], [70, 30]) + '<rect x="70" y="22" width="40" height="16"/>' + T([82, 16], "R", fs) + L([110, 30], [150, 30]);
  g += '<path d="M150 30 q6 -14 12 0 q6 -14 12 0 q6 -14 12 0 q6 -14 12 0"/>' + T([150, 14], "(L, r)", fs) + L([198, 30], [240, 30]);
  g += L([240, 30], [240, 66]) + L([228, 66], [252, 66], ' stroke-width="2.2"') + L([228, 74], [252, 74], ' stroke-width="2.2"') + L([240, 74], [240, 120]) + T([258, 74], "C", fs);
  g += L([240, 120], [170, 120]) + '<circle cx="155" cy="120" r="15"/>' + T([149, 125], "A", ' font-size="13" font-weight="700"') + L([140, 120], [30, 120]);
  g += L([30, 120], [30, 93]) + '<circle cx="30" cy="75" r="18"/>' + '<path d="M18 75 q6 -10 12 0 q6 10 12 0" stroke-width="1.2"/>' + L([30, 57], [30, 30]) + T([54, 80], "GBF", fs);
  return svg(280, 136, g, "Montage série : le GBF, le conducteur ohmique R, la bobine (L, r), le condensateur C et l'ampèremètre A, branchés les uns à la suite des autres.");
};
// Physique C 2025 (BAC), corrigé 2.4.1 : force de Laplace sur la tige MN (courant de M vers N, B sortant).
S["bac-2025-physique-c-laplace"] = () => {
  const fs = ' font-size="13"';
  let g = L([130, 14], [130, 186], ' stroke-width="2"') + T([140, 22], "M", fs) + T([140, 184], "N", fs);
  g += L([150, 70], [150, 112], ' stroke-width="1.4"') + fleche([150, 120], [150, 110], 7) + T([158, 100], "I", ' font-size="13" font-style="italic"');
  g += '<circle cx="200" cy="100" r="9"/><circle cx="200" cy="100" r="2.5" fill="currentColor" stroke="none"/>' + vecteur([214, 106], "B");
  g += L([130, 100], [60, 100], ' stroke-width="2.2"') + fleche([50, 100], [62, 100], 10) + vecteur([62, 88], "F");
  return svg(250, 200, g, "Force de Laplace sur la tige MN : le courant I descend de M vers N, le champ B sort du plan ; la force F, appliquée au milieu de la portion plongée dans le champ, est horizontale et dirigée vers la gauche, du côté du générateur.");
};

// SVT D 2025 (BAC), document 3 : étapes de la fécondation chez les Spermaphytes (A', B', C').
S["bac-2025-svt-d-spermaphytes"] = () => {
  const fs = ' font-size="11"', fin = ' stroke-width="0.8"', pt = (x, y, r = 2.2) => '<circle cx="' + f(x) + '" cy="' + f(y) + '" r="' + r + '" fill="currentColor" stroke="none"/>';
  // A' : grain de pollen qui germe
  let g = '<path d="M112 128 A 52 52 0 1 1 132 112" stroke-width="2.6"/>';
  for (let k = 0; k < 15; k++) { const a = Math.PI * (0.78 + k * 0.1), c = [86 + 52 * Math.cos(a), 78 + 52 * Math.sin(a)], u = [Math.cos(a), Math.sin(a)];
    g += P([[c[0] - u[1] * 3, c[1] + u[0] * 3], [c[0] + u[0] * 7, c[1] + u[1] * 7], [c[0] + u[1] * 3, c[1] - u[0] * 3]], ' fill="currentColor" stroke-width="0.6"'); }
  g += '<path d="M112 128 C 116 150, 112 180, 114 222 Q 121 232 128 222 C 129 182, 133 150, 132 112" stroke-width="1.2"/>';
  g += '<ellipse cx="119" cy="112" rx="5" ry="9" transform="rotate(-25 119 112)" fill="currentColor" fill-opacity="0.55" stroke-width="0.8"/>' + '<ellipse cx="121" cy="204" rx="5" ry="10" stroke-dasharray="2 2" stroke-width="1"/>';
  g += L([125, 110], [178, 92], fin) + T([182, 88], "noyau", fs) + T([182, 101], "reproducteur", fs) + L([130, 150], [178, 150], fin) + T([182, 154], "tube pollinique", fs) + L([127, 204], [178, 204], fin) + T([182, 208], "noyau végétatif", fs) + T([96, 262], "A’", ' font-size="13"');
  // B' : deux tubes polliniques, deux anthérozoïdes, noyau végétatif qui dégénère
  const tube = x => '<path d="M' + (x - 11) + ' 34 L' + (x - 11) + ' 222 Q' + x + ' 236 ' + (x + 11) + ' 222 L' + (x + 11) + ' 34" stroke-width="1.2" stroke-dasharray="6 3"/>';
  g += tube(310) + tube(410);
  g += pt(309, 108, 2.6) + pt(311, 138, 2.6) + pt(408, 126, 2.6) + pt(410, 152, 2.6);
  for (let k = 0; k < 22; k++) g += pt(302 + (k * 37 % 17), 196 + (k * 23 % 28), 1.5);
  g += L([318, 108], [338, 122], fin) + L([400, 128], [384, 126], fin) + T([340, 124], "anthéro-", fs) + T([340, 137], "zoïdes", fs);
  g += L([422, 70], [470, 70], fin) + T([474, 66], "tube", fs) + T([474, 79], "pollinique", fs) + L([418, 214], [470, 214], fin) + T([474, 210], "noyau", fs) + T([474, 223], "végétatif", fs) + T([352, 262], "B’", ' font-size="13"');
  // C' : sac embryonnaire atteint par le tube pollinique
  g += '<ellipse cx="610" cy="140" rx="48" ry="104" stroke-width="1.6"/>';
  g += '<path d="M604 6 L604 52 M616 6 L616 52" stroke-width="1.2"/>' + '<rect x="604" y="6" width="12" height="40" fill="currentColor" fill-opacity="0.35" stroke="none"/>';
  g += '<path d="M572 64 Q 590 46 608 66 Q 594 80 572 64 Z M612 66 Q 630 46 648 64 Q 626 80 612 66 Z" stroke-width="1"/>' + '<circle cx="610" cy="78" r="12" stroke-width="1"/>' + pt(610, 78, 4) + pt(590, 64, 1.8) + pt(630, 64, 1.8);
  g += '<circle cx="610" cy="140" r="10" fill="currentColor" fill-opacity="0.5" stroke-width="1"/>' + pt(606, 137, 2.4) + pt(614, 143, 2.4);
  g += '<path d="M572 206 L610 196 L648 206 M590 201 L596 236 M630 201 L624 236" stroke-width="1"/>' + pt(590, 216, 1.8) + pt(610, 222, 1.8) + pt(630, 216, 1.8);
  g += L([618, 22], [668, 22], fin) + T([672, 26], "tube pollinique", fs) + L([620, 140], [668, 150], fin) + T([672, 154], "noyaux du sac", fs) + L([640, 172], [668, 182], fin) + T([672, 186], "sac embryonnaire", fs) + T([600, 262], "C’", ' font-size="13"');
  return svg(770, 272, g, "Document 3 : A', un grain de pollen germe ; son tube pollinique contient le noyau végétatif en tête et le noyau reproducteur encore dans le grain. B', deux tubes polliniques allongés ; le noyau reproducteur a donné deux anthérozoïdes, le noyau végétatif dégénère au fond du tube. C', le tube pollinique atteint le sac embryonnaire, qui contient l'oosphère près du micropyle et les noyaux du sac au centre.");
};
// SVT D 2025 (BAC), corrigé : schéma d'interprétation du sarcomère au repos et contracté.
const sarcomere = (y0, za, zb, titre) => {
  const fs = ' font-size="11"', ma = 150, mb = 290, act = 100;
  let g = T([12, y0 - 6], titre, ' font-size="12" font-weight="700"');
  g += L([za, y0 + 4], [za, y0 + 96], ' stroke-width="2.6"') + L([zb, y0 + 4], [zb, y0 + 96], ' stroke-width="2.6"');
  for (const y of [y0 + 14, y0 + 38, y0 + 62, y0 + 86]) g += L([za, y], [za + act, y], ' stroke-width="1.4"') + L([zb, y], [zb - act, y], ' stroke-width="1.4"');
  for (const y of [y0 + 26, y0 + 50, y0 + 74]) { g += L([ma, y], [mb, y], ' stroke-width="4.5"'); for (let x = ma + 6; x <= mb - 6; x += 10) { if (Math.abs(x - 220) < 10) continue; const d = x < 220 ? -4 : 4; g += L([x, y - 2], [x + d, y - 7], ' stroke-width="1"') + L([x, y + 2], [x + d, y + 7], ' stroke-width="1"'); } }
  const cote = (a, b, y, nom) => (b - a > 12 ? L([a + 2, y], [b - 2, y], ' stroke-width="0.9"') + fleche([a, y], [a + 6, y], 5) + fleche([b, y], [b - 6, y], 5) : "") + T([(a + b) / 2 - nom.length * 2.8, y - 4], nom, fs);
  g += cote(ma, mb, y0 + 114, "bande A") + cote(za, ma, y0 + 114, "½ I") + cote(mb, zb, y0 + 114, "½ I");
  g += cote(za + act, zb - act, y0 - 4, zb - za - 2 * act > 12 ? "zone H" : "");
  g += cote(za, zb, y0 + 134, "sarcomère");
  return g;
};
S["bac-2025-svt-d-sarcomeres"] = () => {
  const fs = ' font-size="11"', fin = ' stroke-width="0.8"';
  let g = sarcomere(24, 70, 370, "Au repos") + sarcomere(204, 115, 325, "En activité (contracté)");
  g += L([372, 32], [420, 20], fin) + T([424, 22], "strie Z", fs) + L([340, 62], [420, 52], fin) + T([424, 54], "filament fin d'actine", fs) + L([284, 74], [420, 84], fin) + T([424, 88], "filament épais de myosine", fs);
  return svg(560, 360, g, "Schéma d'interprétation d'un sarcomère, entre deux stries Z. Au repos : les filaments fins d'actine, fixés aux stries Z, laissent au centre une zone H ; la bande A a la longueur des filaments épais de myosine ; les demi-bandes I sont larges. En activité : les filaments d'actine ont glissé entre les filaments de myosine vers le centre ; le sarcomère est plus court, les bandes I sont réduites, la zone H a presque disparu, la bande A garde la même longueur.");
};

// Probatoire 2025 histoire A-ABI, document 3 : le Cameroun après la guerre de 1914-1916 (carte redessinée d'après le scan,
// mêmes tracés et mêmes libellés : bande sous mandat anglais hachurée, limites de la zone restituée à l'AEF en pointillés).
S["proba-2025-histoire-a-carte"] = () => {
  const PL = (pts, x = "") => P(pts, x), G = ' font-weight="700"', PT = ' stroke-dasharray="2 5" stroke-width="3"', TIR = ' stroke-dasharray="11 7" stroke-width="2.6"';
  const lac = [[270, 26], [278, 16], [298, 17], [309, 10], [326, 12], [333, 30], [331, 46], [347, 52], [362, 61], [398, 64], [404, 88], [384, 96], [364, 102], [352, 114], [326, 118], [307, 108], [300, 94], [284, 74], [270, 48], [270, 26]];
  const ouest = [[318, 118], [322, 135], [305, 160], [292, 185], [282, 205], [276, 230], [272, 255], [275, 272], [262, 290], [245, 310], [220, 330], [200, 345], [175, 365], [150, 390], [125, 410], [100, 435], [80, 460], [62, 490], [50, 520], [48, 545]];
  const est = [[65, 555], [80, 530], [95, 500], [115, 480], [140, 465], [165, 450], [185, 435], [200, 415], [215, 385], [230, 355], [240, 330], [250, 315], [268, 298], [285, 275], [292, 250], [298, 225], [310, 205], [330, 190], [352, 170], [345, 150], [330, 130], [330, 118]];
  const bande = ouest.concat(est);
  const guinee = [[22, 550], [62, 550], [68, 586], [76, 592], [88, 587], [90, 612], [100, 627], [104, 642], [104, 700], [102, 735], [92, 745], [88, 790], [84, 824], [30, 800], [22, 550]];
  const mandatFr = [[360, 100], [380, 145], [372, 176], [380, 205], [400, 238], [425, 260], [455, 285], [465, 302], [468, 332], [471, 362], [480, 400], [490, 430], [498, 452], [500, 476], [512, 500], [536, 530], [570, 545], [590, 572], [593, 585]];
  const aefNord = [[422, 259], [408, 257], [330, 262], [326, 280], [345, 300], [370, 320], [395, 345], [415, 370], [420, 386], [410, 410], [398, 440], [380, 455], [360, 470], [362, 492], [370, 522], [385, 560], [405, 590], [430, 620], [452, 640], [455, 668], [446, 700], [452, 722], [470, 770], [486, 810], [500, 848], [510, 866]];
  const aefEst = [[593, 585], [570, 590], [530, 600], [522, 640], [524, 690], [530, 722], [538, 752], [540, 800], [526, 832], [510, 866]];
  const sudHaut = [[180, 678], [250, 684], [330, 690], [420, 702], [450, 712]], sudBas = [[92, 774], [170, 765], [250, 750], [320, 740], [390, 726], [450, 712]];
  const chari = [[380, 145], [394, 170], [400, 198], [414, 214], [450, 215], [480, 222], [496, 215], [512, 226], [530, 246], [546, 280], [558, 286], [580, 268], [602, 282], [632, 282]];
  const congo1 = [[630, 520], [610, 555], [596, 580], [595, 620], [580, 668], [566, 700], [560, 740], [550, 772], [544, 802], [541, 822]];
  const congo2 = [[636, 702], [602, 726], [590, 742], [580, 780], [570, 810], [546, 840], [510, 866]];
  const motif = '<defs><pattern id="ax-hach-angl" width="7" height="7" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><path d="M0 0V7M0 0H7" stroke="currentColor" stroke-width="2.4"/></pattern></defs>';
  // dessin à l'échelle 0,8 dans un cadre de 520 px : il s'adapte au téléphone au lieu de défiler (seuil ax-large : 600 px)
  return svg(520, 698, motif + '<g transform="scale(0.8)">' +
    '<rect x="4" y="4" width="642" height="864" stroke-width="4"/>' +
    '<polygon points="' + bande.map(p => p.join(",")).join(" ") + '" fill="url(#ax-hach-angl)" stroke="none" opacity=".75"/>' +
    PL(est, ' stroke-dasharray="7 5" stroke-width="2"') + PL(ouest, ' stroke-width="1.2" opacity=".55"') +
    PL(lac, ' stroke-width="4"') + PL(guinee, ' stroke-width="4"') +
    PL(mandatFr, TIR) + PL(aefNord, PT) + PL(aefEst, PT) + PL([[180, 678], [184, 730], [170, 762]], TIR) + PL(sudHaut, TIR) + PL(sudBas, TIR) +
    PL(chari, ' stroke-width="2.2"') + PL(congo1, ' stroke-width="2.2"') + PL(congo2, ' stroke-width="2.2"') +
    // titre et légende
    '<rect x="4" y="4" width="262" height="92"  stroke-width="1.6"/>' +
    T([12, 40], "Le Cameroun après la", ' font-size="22"' + G) + T([12, 78], "guerre de 1914-1916", ' font-size="22"' + G) +
    PL([[16, 176], [44, 176]], PT) + T([54, 167], "Zone restituée à", ' font-size="17"' + G) + T([54, 190], "l'AEF", ' font-size="17"' + G) +
    '<rect x="14" y="216" width="36" height="28" fill="url(#ax-hach-angl)" stroke-width="1.2"/>' + T([62, 228], "Le Cameroun sous", ' font-size="15"' + G) + T([62, 247], "mandat Anglais", ' font-size="15"' + G) +
    // libellés de la carte
    T([350, 46], "Lac Tchad", ' font-size="27"' + G) + T([470, 158], "Tchad", ' font-size="27"' + G) +
    T([0, 0], "Chari", ' font-size="17" transform="translate(514 214) rotate(52)"') +
    T([233, 182], "Dikoa", ' font-size="19"' + G) + T([188, 298], "Yola", ' font-size="19"' + G) + '<circle cx="246" cy="291" r="3.5" fill="currentColor" stroke="none"/>' +
    T([18, 348], "Nigéria", ' font-size="30"' + G) +
    T([197, 510], "Cameroun", ' font-size="21"' + G) + T([130, 540], "sous mandat Français", ' font-size="21"' + G) +
    T([92, 582], "Buea", ' font-size="19"' + G) + '<circle cx="206" cy="621" r="3.5" fill="currentColor" stroke="none"/>' + T([216, 627], "Yaoundé", ' font-size="19"' + G) +
    T([32, 690], "Guinée", ' font-size="14"' + G) + T([27, 710], "espagnole", ' font-size="14"' + G) +
    T([0, 0], "Congo", ' font-size="17" transform="translate(568 768) rotate(-62)"') +
    // nord et échelle
    L([585, 76], [585, 34], ' stroke-width="2"') + fleche([585, 30], [585, 50], 10) + T([578, 94], "N", ' font-size="17"' + G) +
    L([214, 836], [306, 836], ' stroke-width="5"') + T([207, 826], "0", ' font-size="19"') + T([304, 828], "200 km", ' font-size="17"') + "</g>",
    "Document 3 : carte du Cameroun après la guerre de 1914-1916 : une bande étroite à l'ouest, le long du Nigéria, de Buea à Dikoa, sous mandat anglais ; le reste du territoire, avec Yaoundé, sous mandat français ; une zone restituée à l'AEF à l'est et au sud ; la Guinée espagnole au sud-ouest.");
};

// Maths A-ABI 2025 (BAC), exercice 3 : courbe de f(x) = 1/x + ln x et son asymptote x = 0 (axe des ordonnées).
S["bac-2025-maths-a-courbe"] = () => {
  const R = repere(38, -0.6, 6.4, -0.6, 5.4), { X, Y } = R;
  let g = R.g; const p = [];
  for (let x = 0.17; x <= 6.3; x += 0.01) p.push([X(x), Y(1 / x + Math.log(x))]);
  g += P(p, ' stroke-width="2.2"');
  g += L([X(0.4), Y(1)], [X(1.6), Y(1)], ' stroke-width="1"') + L([X(1), Y(0)], [X(1), Y(1)], POINTILLE + ' stroke-width="1"');
  for (const x of [0.25, 0.5, 2, 3]) g += point(X, Y, x, 1 / x + Math.log(x), "", 0, 0);
  g += T([X(0) + 6, Y(5.1)], "x = 0", ' font-size="11" font-style="italic"');
  g += T([X(4.4), Y(2.1)], "(C)", ' font-size="12" font-style="italic"');
  return svg(R.W, R.H, g, "Courbe (C) de f(x) = 1/x + ln x : elle descend depuis +∞ le long de l'axe des ordonnées (asymptote verticale x = 0), atteint son minimum 1 en x = 1 avec une tangente horizontale, puis croît lentement vers +∞ ; points placés : (0,25 ; 2,6), (0,5 ; 1,3), (2 ; 1,2), (3 ; 1,4).");
};
// Géographie C-D-TI 2025 (BAC), document 2 : part de l'Afrique dans le commerce mondial de marchandises (en %), source OMC.
S["bac-2025-geo-cdti-afrique"] = () => {
  const x0 = 46, y0 = 276, u = 24, fs = ' font-size="12"';
  let g = L([x0, y0], [x0, y0 - 8.4 * u]) + fleche([x0, y0 - 8.4 * u - 6], [x0, y0 - 8.4 * u], 6) + L([x0, y0], [x0 + 300, y0]);
  for (let k = 0; k <= 8; k++) g += L([x0 - 4, y0 - k * u], [x0, y0 - k * u], ' stroke-width="1"') + T([x0 - 16, y0 - k * u + 4], String(k), ' font-size="11"');
  g += T([x0 + 10, y0 - 8.4 * u + 4], "En %", fs);
  [["1953", 6.5], ["1973", 4.8], ["1993", 2.5], ["2013", 3.3]].forEach(([a, v], i) => {
    const x = x0 + 22 + i * 70;
    g += '<rect x="' + x + '" y="' + f(y0 - v * u) + '" width="40" height="' + f(v * u) + '" fill="currentColor" fill-opacity="0.18"/>';
    g += T([x + 20, y0 - v * u - 6], String(v).replace(".", ",") + " %", fs + ' text-anchor="middle"') + T([x + 20, y0 + 16], a, fs + ' text-anchor="middle"');
  });
  g += T([180, 16], "Part de l'Afrique dans le commerce", ' font-size="12" font-weight="700" text-anchor="middle"') + T([180, 32], "mondial de marchandises", ' font-size="12" font-weight="700" text-anchor="middle"');
  return svg(360, 300, g, "Histogramme : part de l'Afrique dans le commerce mondial de marchandises, en pourcentage : 6,5 % en 1953, 4,8 % en 1973, 2,5 % en 1993, 3,3 % en 2013 (source : OMC).");
};
// Corrigé : diagramme en bâtons des densités (échelle 1 cm pour 10 hab./km²).
S["bac-2025-geo-cdti-densites"] = () => {
  const x0 = 56, y0 = 330, u = 2.1, fs = ' font-size="12"';
  let g = L([x0, y0], [x0, y0 - 145 * u]) + fleche([x0, y0 - 145 * u - 6], [x0, y0 - 145 * u], 6) + L([x0, y0], [x0 + 330, y0]) + fleche([x0 + 336, y0], [x0 + 326, y0], 6);
  for (let k = 0; k <= 120; k += 20) g += L([x0 - 4, y0 - k * u], [x0, y0 - k * u], ' stroke-width="1"') + T([x0 - 8, y0 - k * u + 4], String(k), ' font-size="11" text-anchor="end"');
  g += T([x0 + 10, y0 - 145 * u + 4], "Densité (hab./km²)", fs);
  [["Littoral", 124], ["Nord-Ouest", 99.9], ["Centre", 44.8], ["Nord", 26]].forEach(([r, v], i) => {
    const x = x0 + 30 + i * 76;
    g += '<rect x="' + x + '" y="' + f(y0 - v * u) + '" width="34" height="' + f(v * u) + '" fill="currentColor" fill-opacity="0.18"/>';
    g += T([x + 17, y0 - v * u - 6], String(v).replace(".", ","), fs + ' text-anchor="middle"') + T([x + 17, y0 + 16], r, fs + ' text-anchor="middle"');
  });
  g += T([x0 + 330, y0 + 32], "Régions", fs + ' text-anchor="end"');
  return svg(400, 370, g, "Diagramme en bâtons des densités de population : Littoral 124, Nord-Ouest 99,9, Centre 44,8 et Nord 26 habitants au km² ; à l'échelle 1 cm pour 10 hab./km², les bâtons mesurent 12,4 cm, 9,99 cm, 4,48 cm et 2,6 cm.");
};
// Maths C-E 2025 (BAC), partie B : l'espace aménagé par le Maire (figure du sujet : quadrillage, O, I, J, K ;
// mêmes positions que sur le scan, où J est à 5 carreaux de O et I à 4 carreaux).
S["bac-2025-maths-ce-espace"] = () => {
  const c = 18, ox = 3 * c + 8, oy = 14 * c + 8, X = k => ox + k * c, Y = k => oy - k * c;
  let g = '<g stroke-width="0.8" stroke-dasharray="1.5 2.5" opacity="0.6">';
  for (let i = -3; i <= 7; i++) g += L([X(i), Y(-2)], [X(i), Y(14)]);
  for (let j = -2; j <= 14; j++) g += L([X(-3), Y(j)], [X(7), Y(j)]);
  g += "</g>" + L([X(-3), Y(0)], [X(7), Y(0)], ' stroke-width="1"') + L([X(0), Y(-2)], [X(0), Y(14)], ' stroke-width="1"');
  const J = [X(0), Y(5)], K = [X(4), Y(10.7)];
  g += L([X(0), Y(0)], [X(4), Y(0)], ' stroke-width="2.2"') + L([X(4), Y(0)], K, ' stroke-width="2.2"') + L([X(0), Y(0)], J, ' stroke-width="2.2"');
  g += '<path d="M' + J[0] + ' ' + J[1] + ' Q ' + f(X(1.9)) + ' ' + f(Y(7.4)) + ' ' + K[0] + ' ' + K[1] + '" stroke-width="2.2"/>';
  g += '<path d="M' + f(X(-3)) + ' ' + f(Y(1.6)) + ' Q ' + f(X(-1.4)) + ' ' + f(Y(3.4)) + ' ' + J[0] + ' ' + J[1] + '" stroke-width="1" stroke-dasharray="3 3"/>';
  const fs = ' font-size="13" font-style="italic"';
  g += T([X(0) - 14, Y(0) + 15], "O", fs) + T([X(4) - 3, Y(0) + 15], "I", fs) + T([X(0) - 13, J[1] + 4], "J", fs) + T([K[0] - 14, K[1] - 4], "K", fs) + T([X(0) - 12, Y(13.4)], "y", fs) + T([X(6.6), Y(0) + 15], "x", fs);
  g += T([X(-3), Y(-2) + 22], "1 unité = 100 m", ' font-size="12"');
  return svg(X(7) + 10, Y(-2) + 30, g, "Figure du sujet : sur un quadrillage, l'espace aménagé est limité par le segment [OI] sur l'axe des abscisses, le segment [IK] vertical, le segment [OJ] sur l'axe des ordonnées et l'arc JK de la courbe (Γ) ; 1 unité = 100 m.");
};
// Corrigé exercice 2 : la parabole (C) d'équation y = x² et son image (Γ) par la rotation de centre O et d'angle π/4.
S["bac-2025-maths-ce-paraboles"] = () => {
  const R = repere(64, -2.6, 2.2, -0.9, 3.3), { X, Y } = R, r2 = Math.SQRT1_2;
  let g = R.g; const c = [], G = [];
  for (let t = -1.75; t <= 1.75; t += 0.02) c.push([X(t), Y(t * t)]);
  for (let t = -1.35; t <= 1.62; t += 0.02) G.push([X(r2 * (t - t * t)), Y(r2 * (t + t * t))]);
  g += P(c, ' stroke-width="2.2"') + P(G, ' stroke-width="2.2" stroke-dasharray="7 4"');
  g += L([X(-2.6), Y(-0.25)], [X(2.2), Y(-0.25)], ' stroke-width="1" stroke-dasharray="2 4"');
  g += L([X(-0.55), Y(-0.9)], [X(2.2), Y(2.2 - Math.SQRT2 / 4)], ' stroke-width="1" stroke-dasharray="2 4"');
  g += point(X, Y, 0, 0.25, "F", 6, -4) + point(X, Y, -Math.SQRT2 / 8, Math.SQRT2 / 8, "F'", -22, -4);
  g += T([X(1.45), Y(2.5)], "(C)", ' font-size="13" font-style="italic"') + T([X(-2.3), Y(1.3)], "(Γ)", ' font-size="13" font-style="italic"');
  g += T([X(1.25), Y(-0.25) + 14], "(D)", ' font-size="12" font-style="italic"') + T([X(1.55), Y(1.0)], "(D')", ' font-size="12" font-style="italic"');
  return svg(R.W, R.H, g, "La parabole (C) : y = x², de sommet O, de foyer F(0 ; 1/4) et de directrice (D) : y = −1/4 ; en pointillés, son image (Γ) par la rotation de centre O et d'angle π/4, de même sommet O, d'axe la droite y = −x, de foyer F'(−√2/8 ; √2/8) et de directrice (D') : x − y − √2/4 = 0.");
};
// Probatoire 2024 chimie C-D-E, partie B : la lampe à acétylène (figure du sujet).
S["proba-2024-chimie-lampe"] = () => {
  const fs = ' font-size="13"', fb = ' font-size="13" font-weight="700"';
  let g = P([[150, 50], [250, 50], [278, 205], [122, 205], [150, 50]], ' stroke-width="1.6"');
  g += '<polygon points="140,105 260,105 266,135 134,135" fill="currentColor" fill-opacity="0.3" stroke-width="1.2"/>';
  g += L([200, 135], [200, 142], ' stroke-width="1.2"') + '<circle cx="200" cy="147" r="4" fill="none" stroke-width="1.2"/>';
  g += '<polygon points="140,198 136,182 152,170 168,180 164,198" fill="currentColor" fill-opacity="0.55" stroke-width="1"/>';
  g += '<polygon points="174,198 168,182 182,166 204,166 214,182 206,198" fill="currentColor" fill-opacity="0.55" stroke-width="1"/>';
  g += L([132, 170], [64, 82], ' stroke-width="1.4"') + L([138, 176], [70, 88], ' stroke-width="1.4"');
  g += '<path d="M60 80 Q48 70 54 56 Q62 66 66 58 Q72 72 60 80Z" fill="currentColor" fill-opacity="0.25" stroke-width="1.2"/>';
  g += L([96, 28], [72, 50], ' stroke-width="1"') + fleche([68, 54], [76, 46], 6) + T([92, 22], "flamme", fb);
  g += L([124, 66], [90, 92], ' stroke-width="1"') + fleche([84, 96], [94, 89], 6) + T([116, 60], "bec", fb);
  g += L([320, 120], [268, 120], ' stroke-width="1"') + fleche([262, 120], [272, 120], 6) + T([324, 112], "Réserve", fb) + T([324, 130], "d'eau", fb);
  g += L([320, 180], [216, 182], ' stroke-width="1"') + fleche([210, 182], [220, 182], 6) + T([324, 172], "Carbure de", fb) + T([324, 190], "calcium", fb);
  g += T([200, 232], "Lampe à acétylène", fb + ' text-anchor="middle"');
  return svg(410, 242, g, "Lampe à acétylène : un récipient contenant en haut une réserve d'eau, qui goutte sur des morceaux de carbure de calcium placés au fond ; le gaz produit monte par un tube jusqu'au bec, où brûle la flamme.");
};
// Corrigé : dispositif de dosage des ions Fe2+ par le permanganate de potassium.
S["proba-2024-chimie-dosage"] = () => {
  const fs = ' font-size="12"';
  let g = L([40, 20], [40, 290], ' stroke-width="2"') + '<rect x="14" y="288" width="160" height="8" stroke-width="1.4"/>' + L([40, 70], [96, 70], ' stroke-width="1.6"');
  g += '<rect x="96" y="20" width="14" height="170" stroke-width="1.4"/>' + '<rect x="97" y="40" width="12" height="149" fill="currentColor" fill-opacity="0.35" stroke="none"/>';
  for (let y = 40; y <= 180; y += 10) g += L([110, y], [y % 50 === 0 ? 102 : 105, y], ' stroke-width="0.7"');
  g += P([[96, 190], [101, 205], [101, 214]], ' stroke-width="1.4"') + P([[110, 190], [105, 205], [105, 214]], ' stroke-width="1.4"') + '<rect x="96" y="196" width="18" height="6" stroke-width="1"/>';
  g += P([[70, 222], [70, 282], [136, 282], [136, 222]], ' stroke-width="1.6"') + '<rect x="71" y="244" width="64" height="37" fill="currentColor" fill-opacity="0.12" stroke="none"/>' + '<rect x="94" y="276" width="18" height="4" fill="currentColor" stroke="none"/>';
  g += '<rect x="58" y="284" width="90" height="4" stroke-width="1"/>';
  g += L([122, 30], [168, 30], ' stroke-width="0.9"') + T([172, 26], "burette graduée : solution de permanganate", fs) + T([172, 42], "de potassium, C₀ = 0,1 mol/L", fs);
  g += L([132, 199], [168, 178], ' stroke-width="0.9"') + T([172, 182], "robinet", fs);
  g += L([136, 258], [168, 246], ' stroke-width="0.9"') + T([172, 242], "bécher : Vr = 20 mL de solution de", fs) + T([172, 258], "sulfate de fer II acidifiée (H₂SO₄)", fs);
  g += L([112, 279], [168, 272], ' stroke-width="0.9"') + T([172, 276], "barreau aimanté", fs) + L([148, 286], [168, 300], ' stroke-width="0.9"') + T([172, 306], "agitateur magnétique", fs);
  return svg(470, 318, g, "Dispositif de dosage : une burette graduée, fixée à un support, contient la solution de permanganate de potassium ; en dessous, un bécher contient 20 mL de la solution de sulfate de fer II acidifiée, agitée par un barreau aimanté posé sur un agitateur magnétique.");
};
// Corrigé partie B : synthèse de l'acétylène au laboratoire (eau sur carbure de calcium, gaz recueilli sur l'eau).
S["proba-2024-chimie-synthese"] = () => {
  const fs = ' font-size="12"';
  let g = '<path d="M70 72 L58 40 L102 40 L90 72 Z" stroke-width="1.4"/>' + '<rect x="59" y="46" width="42" height="12" fill="currentColor" fill-opacity="0.15" stroke="none"/>' + L([80, 72], [80, 108], ' stroke-width="1.4"') + '<rect x="74" y="84" width="12" height="6" stroke-width="1"/>';
  g += '<path d="M66 112 L66 130 Q30 150 34 185 Q40 215 80 215 Q120 215 126 185 Q130 150 94 130 L94 112 Z" stroke-width="1.6"/>';
  g += '<polygon points="56,206 62,192 76,196 72,208" fill="currentColor" fill-opacity="0.55" stroke="none"/><polygon points="82,208 86,194 102,196 100,209" fill="currentColor" fill-opacity="0.55" stroke="none"/>';
  g += P([[90, 112], [90, 100], [218, 100], [218, 222], [250, 222], [250, 192]], ' stroke-width="1.6"');
  g += '<rect x="200" y="160" width="140" height="70" stroke-width="1.6"/>' + '<rect x="201" y="176" width="138" height="53" fill="currentColor" fill-opacity="0.12" stroke="none"/>';
  g += '<path d="M236 214 L236 128 Q236 120 244 120 L256 120 Q264 120 264 128 L264 214" stroke-width="1.4"/>' + '<rect x="237" y="150" width="26" height="64" fill="currentColor" fill-opacity="0.12" stroke="none"/>';
  g += L([110, 46], [150, 30], ' stroke-width="0.9"') + T([154, 28], "ampoule de coulée (eau)", fs);
  g += L([108, 200], [150, 250], ' stroke-width="0.9"') + T([110, 262], "ballon : carbure de calcium CaC₂", fs);
  g += L([170, 100], [178, 74], ' stroke-width="0.9"') + T([158, 68], "tube à dégagement", fs);
  g += L([264, 134], [300, 110], ' stroke-width="0.9"') + T([304, 104], "éprouvette retournée :", fs) + T([304, 120], "acétylène C₂H₂", fs);
  g += L([330, 200], [360, 212], ' stroke-width="0.9"') + T([344, 228], "cuve à eau", fs);
  return svg(460, 272, g, "Montage de synthèse de l'acétylène : l'eau d'une ampoule de coulée tombe goutte à goutte sur le carbure de calcium contenu dans un ballon ; le gaz formé passe par un tube à dégagement et se recueille dans une éprouvette retournée sur une cuve à eau.");
};
// Probatoire 2024 physique C-E, exercice 3.1 : descente du parachutiste (document du sujet).
S["proba-2024-physique-ce-parachute"] = () => {
  const fs = ' font-size="11"', fb = ' font-size="11" font-weight="700"';
  let g = L([30, 30], [330, 30], ' stroke-width="1.4"') + fleche([338, 30], [328, 30], 7);
  g += '<path d="M40 30 l14 -4 l6 4 l-6 4 Z" fill="currentColor" stroke="none"/><path d="M262 30 l14 -4 l6 4 l-6 4 Z" fill="currentColor" stroke="none"/>';
  g += '<path d="M100 30 Q190 34 230 110 Q262 168 300 205 Q318 222 340 226" stroke-width="2"/>';
  g += L([100, 30], [100, 110], ' stroke-width="1"') + fleche([100, 114], [100, 104], 6) + fleche([100, 26], [100, 36], 6) + T([106, 74], "h", ' font-size="12" font-style="italic"');
  g += L([100, 110], [222, 110], ' stroke-width="0.9" stroke-dasharray="4 3"') + T([222, 126], "Ouverture du parachute", fb + ' text-anchor="end"');
  g += '<circle cx="230" cy="110" r="5" stroke-width="1.4"/>';
  g += L([20, 228], [345, 228], ' stroke-width="1.8"') + T([24, 222], "Sol terrestre", fb);
  g += L([70, 17], [97, 27], ' stroke-width="0.9"') + T([6, 13], "Le parachutiste sort de l'avion à l'instant t₀", fs);
  g += T([120, 164], "Trajectoire du", fs) + T([120, 177], "parachutiste", fs) + L([196, 166], [254, 158], ' stroke-width="0.9"');
  g += T([262, 70], "À l'instant t₁", fs) + L([270, 76], [238, 104], ' stroke-width="0.9"') + fleche([235, 107], [242, 100], 5);
  return svg(360, 240, g, "Document : l'avion vole horizontalement ; le parachutiste le quitte à l'instant t₀, décrit une trajectoire courbe vers le bas ; à l'instant t₁, une hauteur h plus bas que le point de sortie, le parachute s'ouvre ; il atteint ensuite le sol terrestre.");
};
// Probatoire 2024 physique C-E, partie II : le circuit (bornes A et B, ampèremètre, moteur M, résistor R).
S["proba-2024-physique-ce-circuit"] = () => {
  const fs = ' font-size="13" font-weight="700"';
  let g = P([[30, 90], [30, 40], [124, 40]]) + '<circle cx="144" cy="40" r="20" stroke-width="1.6"/>' + T([138, 45], "A", fs) + P([[164, 40], [240, 40], [240, 88]]);
  g += '<circle cx="240" cy="110" r="22" stroke-width="1.6"/>' + T([231, 115], "M", fs) + P([[240, 132], [240, 180], [180, 180]]);
  g += '<rect x="100" y="168" width="80" height="24" stroke-width="1.6"/>' + T([134, 210], "R", fs) + P([[100, 180], [30, 180], [30, 128]]);
  g += '<circle cx="30" cy="92" r="3" fill="currentColor" stroke="none"/><circle cx="30" cy="126" r="3" fill="currentColor" stroke="none"/>' + T([38, 97], "A", fs) + T([38, 131], "B", fs);
  g += L([144, 62], [144, 76], ' stroke-width="1"') + fleche([144, 80], [144, 72], 5) + T([150, 78], "I", ' font-size="12" font-style="italic"');
  return svg(280, 220, g, "Circuit électrique : entre les bornes A et B de l'alimentation sont branchés en série un ampèremètre, le moteur M et un résistor R.");
};
// Probatoire 2024 physique D-TI, partie II : le manège (figure du sujet).
S["proba-2024-physique-dti-manege"] = () => {
  const fs = ' font-size="12" font-weight="700"';
  let g = L([10, 210], [180, 210], ' stroke-width="1.8"');
  g += '<path d="M180 210 Q196 210 198 180 L204 60 Q210 20 222 20 Q234 20 240 60 L248 180 Q250 210 268 210 L380 210" stroke-width="1.8"/>';
  g += L([216, 18], [380, 18], ' stroke-width="1.2"') + L([360, 22], [360, 206], ' stroke-width="1.1"') + fleche([360, 18], [360, 28], 7) + fleche([360, 210], [360, 200], 7) + T([368, 108], "h", ' font-size="14" font-weight="700"');
  g += L([186, 170], [192, 72], ' stroke-width="1.1"') + fleche([192, 64], [191.5, 74], 6) + L([254, 74], [260, 172], ' stroke-width="1.1"') + fleche([260, 180], [259.5, 170], 6);
  g += T([40, 204], "A", fs) + T([168, 204], "B", fs) + T([216, 12], "C", fs) + T([272, 204], "D", fs);
  g += T([24, 226], "Départ", fs) + T([150, 230], "Propulsion", fs);
  return svg(392, 240, g, "Le manège : la locomotive part de A, est propulsée sur la portion rectiligne horizontale AB, monte jusqu'au sommet C situé à la hauteur h au-dessus de la voie, puis redescend vers D.");
};
// Probatoire 2024 SVT D, document 1 : mode d'action du VIH dans une cellule cible (libellés du sujet).
S["proba-2024-svt-d-vih"] = () => {
  const fs = ' font-size="11"', fb = ' font-size="11" font-weight="700"', num = (p, n) => T(p, n, ' font-size="14" font-weight="700"');
  const virion = (cx, cy, r) => { let v = '<circle cx="' + cx + '" cy="' + cy + '" r="' + r + '" stroke-width="1.4"/>' + '<rect x="' + (cx - r * 0.45) + '" y="' + (cy - r * 0.45) + '" width="' + r * 0.9 + '" height="' + r * 0.9 + '" stroke-width="1.1"/>';
    for (let a = 0; a < 360; a += 45) { const t = a * Math.PI / 180; v += L([cx + Math.cos(t) * r, cy + Math.sin(t) * r], [cx + Math.cos(t) * (r + 5), cy + Math.sin(t) * (r + 5)], ' stroke-width="1.2"'); }
    return v + P([[cx - r * 0.3, cy - r * 0.2], [cx - r * 0.1, cy + r * 0.2], [cx + r * 0.1, cy - r * 0.2], [cx + r * 0.3, cy + r * 0.2]], ' stroke-width="1"'); };
  const helice = (x1, x2, y) => { let h = ""; for (let x = x1; x < x2; x += 14) h += '<path d="M' + x + ' ' + (y - 4) + ' Q' + (x + 7) + ' ' + (y + 8) + ' ' + (x + 14) + ' ' + (y - 4) + '" stroke-width="1.2"/><path d="M' + x + ' ' + (y + 4) + ' Q' + (x + 7) + ' ' + (y - 8) + ' ' + (x + 14) + ' ' + (y + 4) + '" stroke-width="1.2"/>'; return h; };
  let g = '<path d="M80 250 Q80 92 280 86 Q480 92 482 250 Q482 418 280 424 Q80 418 80 250Z" stroke-width="2"/>';
  g += virion(118, 104, 20) + L([136, 94], [300, 26], ' stroke-width="0.9"') + T([304, 30], "ARN viral", fb) + num([150, 136], "1");
  g += '<path d="M98 160 l-10 -10 M98 160 l-2 -14 M98 160 l6 8" stroke-width="1.8"/>' + T([14, 176], "CD-4", fb) + L([48, 172], [84, 160], ' stroke-width="0.9"') + fleche([89, 158], [81, 161], 5);
  g += '<path d="M236 92 Q250 64 270 64 Q290 64 302 92" stroke-width="1.4"/>' + L([262, 94], [258, 118], ' stroke-width="1"') + L([274, 94], [278, 118], ' stroke-width="1"') + num([308, 74], "2");
  g += T([186, 142], "ARN viral", fb) + L([248, 138], [312, 138], ' stroke-width="1.4"') + T([182, 160], "ADN viral", fb) + L([248, 152], [312, 152], ' stroke-width="1.4"') + L([248, 158], [312, 158], ' stroke-width="1.4" stroke-dasharray="2 2"') + num([318, 152], "3");
  g += T([360, 136], "cytoplasme de la", fb) + T([360, 150], "cellule hôte", fb);
  g += '<ellipse cx="282" cy="268" rx="152" ry="84" stroke-width="1.4" stroke-dasharray="10 4"/><ellipse cx="282" cy="268" rx="144" ry="77" stroke-width="1" stroke-dasharray="10 4"/>';
  g += T([340, 268], "Noyau", ' font-size="13" font-weight="700"');
  g += num([238, 218], "4") + T([292, 214], "intégrase", fb) + L([290, 210], [270, 226], ' stroke-width="0.9"') + helice(160, 300, 232) + L([300, 232], [340, 232], ' stroke-width="2.2"') + L([300, 172], [300, 196], ' stroke-width="1"') + fleche([300, 202], [300, 194], 5);
  g += T([150, 254], "ADN de la", fb) + T([150, 266], "cellule hôte", fb);
  g += helice(160, 300, 288) + T([304, 292], "ADN viral", fb);
  g += num([166, 314], "5") + T([182, 306], "transcription de l'ADN", fb) + T([182, 318], "viral en ARN", fb) + L([330, 296], [330, 318], ' stroke-width="1"') + fleche([330, 324], [330, 316], 5) + L([300, 330], [380, 330], ' stroke-width="1.3"') + T([352, 324], "ARN", fb);
  g += L([424, 230], [492, 206], ' stroke-width="0.9"') + T([496, 210], "pore nucléaire", fb) + L([432, 262], [492, 240], ' stroke-width="0.9"') + T([496, 244], "enveloppe nucléaire", fb);
  g += '<ellipse cx="252" cy="372" rx="12" ry="7" stroke-width="1.3"/>' + L([214, 378], [300, 378], ' stroke-width="1.3"') + T([150, 376], "ribosome", fb) + L([196, 372], [238, 372], ' stroke-width="0.9"') + L([270, 368], [296, 354], ' stroke-width="1.2"') + num([300, 360], "6") + T([316, 358], "protéine virale", fb) + T([316, 370], "en formation", fb);
  g += L([262, 386], [266, 406], ' stroke-width="1"') + fleche([267, 412], [266, 404], 5) + num([292, 400], "7") + T([306, 390], "assemblage des", fb) + T([306, 402], "constituants viraux", fb);
  g += virion(222, 420, 14) + virion(290, 425, 14) + virion(456, 396, 15) + virion(504, 426, 15) + virion(452, 448, 15) + num([370, 458], "8");
  g += T([12, 404], "Lymphocyte", fb) + L([78, 400], [96, 380], ' stroke-width="0.9"') + fleche([100, 376], [94, 383], 5);
  return svg(626, 470, g, "Document 1 : cycle du VIH dans un lymphocyte. 1 : le virus (ARN viral) se fixe sur le récepteur CD-4 ; 2 : il pénètre dans la cellule ; 3 : l'ARN viral est copié en ADN viral dans le cytoplasme ; 4 : l'ADN viral s'intègre, grâce à l'intégrase, à l'ADN de la cellule hôte dans le noyau ; 5 : transcription de l'ADN viral en ARN ; 6 : un ribosome fabrique les protéines virales ; 7 : assemblage des constituants viraux ; 8 : de nouveaux virus bourgeonnent et quittent la cellule.");
};
// Corrigé SVT D 2024 : vitesse de la réaction enzymatique en fonction de la concentration en lactose.
S["proba-2024-svt-d-enzyme"] = () => {
  const x0 = 46, y0 = 252, ux = 26, uy = 6, X = c => x0 + c * ux, Y = v => y0 - v * uy, fs = ' font-size="11"';
  let g = '<g stroke-width="0.5" opacity="0.35">';
  for (let c = 1; c <= 12; c++) g += L([X(c), Y(0)], [X(c), Y(36)]);
  for (let v = 4; v <= 36; v += 4) g += L([X(0), Y(v)], [X(12.5), Y(v)]);
  g += "</g>" + L([X(0), Y(0)], [X(12.8), Y(0)], ' stroke-width="1.2"') + fleche([X(13.1), Y(0)], [X(12.8), Y(0)], 6) + L([X(0), Y(0)], [X(0), Y(37)], ' stroke-width="1.2"') + fleche([X(0), Y(38.3)], [X(0), Y(37)], 6);
  for (let c = 1; c <= 12; c++) g += T([X(c) - 3, Y(0) + 14], String(c), fs);
  for (let v = 4; v <= 36; v += 4) g += T([X(0) - 20, Y(v) + 4], String(v), fs);
  const pts = [[0, 0], [1, 5], [2, 12.5], [4, 22], [6, 30], [7, 32], [9, 32], [11, 32], [12, 32]];
  g += P(pts.map(([c, v]) => [X(c), Y(v)]), ' stroke-width="2"');
  for (const [c, v] of pts) g += '<circle cx="' + f(X(c)) + '" cy="' + f(Y(v)) + '" r="3" fill="currentColor" stroke="none"/>';
  g += L([X(0), Y(32)], [X(7), Y(32)], ' stroke-width="0.9" stroke-dasharray="4 3"') + T([X(8), Y(32) - 8], "Vmax = 32", ' font-size="12" font-weight="700"');
  g += T([X(0) + 6, Y(38)], "Vitesse (unités relatives)", fs) + T([X(8.6), Y(0) + 30], "[lactose] (u.a.)", fs);
  return svg(X(13.4) + 6, Y(0) + 38, g, "Courbe de la vitesse de la réaction en fonction de la concentration en substrat : la vitesse croît presque proportionnellement jusqu'à la concentration 6 (30 unités), puis atteint un plateau à 32 unités à partir de la concentration 7.");
};
// Probatoire 2024 SVT C-TI : vitesse des ondes P et S en fonction de la profondeur (document du sujet, mêmes valeurs lues sur le scan).
function sismique() {
  const x0 = 60, y0 = 250, ux = 0.075, uy = 16, X = d => x0 + d * ux, Y = v => y0 - v * uy, fs = ' font-size="11"';
  let g = L([X(0), Y(0)], [X(6450), Y(0)], ' stroke-width="1.2"') + L([X(0), Y(0)], [X(0), Y(15)], ' stroke-width="1.2"') + fleche([X(0), Y(15.6)], [X(0), Y(15)], 6) + L([X(6371), Y(0)], [X(6371), Y(15)], ' stroke-width="1.2"') + fleche([X(6371), Y(15.6)], [X(6371), Y(15)], 6);
  for (let v = 2; v <= 14; v += 2) g += L([X(0) - 4, Y(v)], [X(0), Y(v)], ' stroke-width="1"') + T([X(0) - 20, Y(v) + 4], String(v), fs) + L([X(6371), Y(v)], [X(6371) + 4, Y(v)], ' stroke-width="1"') + T([X(6371) + 8, Y(v) + 4], String(v), fs);
  for (let d = 1000; d <= 6000; d += 1000) g += L([X(d), Y(0)], [X(d), Y(0) + 4], ' stroke-width="1"') + T([X(d) - 14, Y(0) + 16], (d / 1000) + " 000", fs);
  g += T([X(6371) + 4, Y(0) + 16], "(km)", fs) + '<text transform="translate(18 ' + Y(5) + ') rotate(-90)" fill="currentColor" stroke="none" font-size="11">Vitesse sismique (km/s)</text>';
  const P1 = [[0, 6], [15, 6.4], [30, 8.1], [70, 8.3], [100, 7.8], [150, 8.1], [220, 8.6], [400, 9.1], [450, 9.6], [600, 10.2], [670, 10.8], [1200, 11.4], [2000, 12.6], [2890, 13.7]];
  const P2 = [[2890, 8.0], [3500, 9.0], [4200, 9.8], [5150, 10.3], [5150, 10.9], [5600, 11.1], [6000, 11.1], [6371, 11.3]];
  const S1 = [[0, 3.4], [15, 3.7], [30, 4.6], [70, 4.7], [100, 4.3], [200, 4.5], [400, 5.0], [600, 5.6], [670, 6.0], [1200, 6.4], [2000, 6.9], [2890, 7.3]];
  const S2 = [[5150, 0], [5150, 3.6], [6371, 3.6]];
  const p = a => P(a.map(([d, v]) => [X(d), Y(v)]), ' stroke-width="1.8"');
  g += p(P1) + L([X(2890), Y(13.7)], [X(2890), Y(8.0)], ' stroke-width="1.8"') + p(P2) + p(S1) + L([X(2890), Y(7.3)], [X(2890), Y(0)], ' stroke-width="1.8"') + p(S2);
  g += T([X(1500), Y(12.4)], "P", ' font-size="12" font-weight="700"') + T([X(4100), Y(10.2)], "P", ' font-size="12" font-weight="700"') + T([X(1500), Y(7.0)], "S", ' font-size="12" font-weight="700"') + T([X(5700), Y(3.9)], "S", ' font-size="12" font-weight="700"');
  return { g, X, Y, W: X(6371) + 40, H: Y(0) + 26 };
}
S["proba-2024-svt-c-sismique"] = () => {
  const R = sismique();
  return svg(R.W, R.H, R.g, "Vitesse des ondes sismiques P et S en fonction de la profondeur : les ondes P passent d'environ 6 à 13,7 km/s jusqu'à 2 900 km, chutent brusquement à 8 km/s, remontent à 10,3 km/s vers 5 150 km puis à 11 km/s ; les ondes S passent de 3,4 à 7,3 km/s jusqu'à 2 900 km, disparaissent entre 2 900 et 5 150 km, puis réapparaissent à 3,6 km/s jusqu'au centre (6 371 km). Une zone de ralentissement apparaît vers 100 km.");
};
// Corrigé : le graphe avec les discontinuités, et en dessous la coupe du globe (de la surface au centre).
S["proba-2024-svt-c-coupe"] = () => {
  const R = sismique(), { X, Y } = R, fs = ' font-size="11"', fb = ' font-size="11" font-weight="700"';
  let g = R.g;
  for (const [d, n] of [[30, "Moho"], [2890, "Gutenberg"], [5150, "Lehmann"]]) g += L([X(d), Y(15)], [X(d), Y(0) + 110], ' stroke-width="1" stroke-dasharray="4 3"') + T([X(d) + 3, Y(14.6)], n, fb);
  const y1 = Y(0) + 46, y2 = y1 + 60;
  g += '<rect x="' + X(0) + '" y="' + y1 + '" width="' + (X(6371) - X(0)) + '" height="60" stroke-width="1.4"/>';
  g += '<rect x="' + X(0) + '" y="' + y1 + '" width="' + (X(30) - X(0) + 1) + '" height="60" fill="currentColor" stroke="none"/>';
  g += '<rect x="' + X(100) + '" y="' + y1 + '" width="' + (X(250) - X(100)) + '" height="60" fill="currentColor" fill-opacity="0.12" stroke="none"/>';
  g += '<rect x="' + X(2890) + '" y="' + y1 + '" width="' + (X(5150) - X(2890)) + '" height="60" fill="currentColor" fill-opacity="0.18" stroke="none"/>';
  g += '<rect x="' + X(5150) + '" y="' + y1 + '" width="' + (X(6371) - X(5150)) + '" height="60" fill="currentColor" fill-opacity="0.35" stroke="none"/>';
  for (const d of [670, 2890, 5150]) g += L([X(d), y1], [X(d), y2], ' stroke-width="1.4"');
  g += L([X(15), y2], [X(15), y2 + 8], ' stroke-width="0.9"') + T([X(0), y2 + 20], "croûte", fs) + L([X(175), y2], [X(900), y2 + 8], ' stroke-width="0.9"') + T([X(900), y2 + 20], "LVZ (asthénosphère)", fs);
  g += L([X(400), y1], [X(400), y1 - 6], ' stroke-width="0.9"') + T([X(150), y1 - 9], "manteau sup.", fs) + T([X(1050), y1 + 34], "manteau inférieur", fb) + T([X(3500), y1 + 26], "noyau externe", fb) + T([X(3500), y1 + 42], "(liquide)", fs) + T([X(5200), y1 + 26], "noyau", fb) + T([X(5200), y1 + 40], "interne", fb) + T([X(5200), y1 + 54], "(solide)", fs);
  g += T([X(0), y2 + 36], "surface", fs) + T([X(6371) - 30, y2 + 36], "centre", fs);
  return svg(R.W, y2 + 44, g, "Le graphe des vitesses sismiques et, en dessous, une coupe du globe de la surface au centre : croûte jusqu'au Moho (vers 30 km), manteau supérieur avec la zone de faible vitesse (LVZ, asthénosphère) vers 100 à 250 km, manteau inférieur jusqu'à la discontinuité de Gutenberg (2 900 km), noyau externe liquide jusqu'à la discontinuité de Lehmann (5 150 km), noyau interne solide jusqu'au centre (6 371 km).");
};
// BEPC 2023 maths, exercice 3 : histogramme des âges (effectifs 2, 3, 7, 6, 7, 5 pour les classes de 8 à 14 ans).
S["bepc-2023-maths-histogramme"] = () => {
  const x0 = 34, y0 = 214, ux = 38, uy = 26, X = a => x0 + (a - 8) * ux, Y = n => y0 - n * uy, fs = ' font-size="11"';
  let g = '<defs><pattern id="ax-hach-b23" width="6" height="6" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><path d="M0 0V6" stroke="currentColor" stroke-width="1.6"/></pattern></defs>';
  g += '<g stroke-width="0.6" stroke-dasharray="3 3" opacity="0.5">';
  for (let n = 1; n <= 7; n++) g += L([x0, Y(n)], [X(14) + 6, Y(n)]);
  g += "</g>";
  [2, 3, 7, 6, 7, 5].forEach((n, i) => { g += '<rect x="' + X(8 + i) + '" y="' + Y(n) + '" width="' + ux + '" height="' + n * uy + '" fill="url(#ax-hach-b23)" stroke-width="1.4"/>'; });
  g += L([x0, y0], [X(14) + 10, y0], ' stroke-width="1.4"') + L([x0, y0], [x0, Y(7.6)], ' stroke-width="1.4"');
  for (let n = 0; n <= 7; n++) g += T([x0 - 12, Y(n) + 4], String(n), fs);
  for (let a = 8; a <= 14; a++) g += T([X(a) - 6, y0 + 15], String(a), fs);
  g += T([x0 + 4, Y(7.6) + 2], "Effectifs", fs) + T([X(10.4), y0 + 30], "Âge en années", fs);
  return svg(X(14) + 22, y0 + 38, g, "Histogramme des âges des 30 enfants, classes d'amplitude 1 de 8 à 14 ans : effectifs 2 pour [8 ; 9[, 3 pour [9 ; 10[, 7 pour [10 ; 11[, 6 pour [11 ; 12[, 7 pour [12 ; 13[, 5 pour [13 ; 14[.");
};
// BEPC 2023 maths, géométrie exercice 2 : triangle EFG rectangle en E, M sur [EF], N sur [EG], (MN) // (FG).
S["bepc-2023-maths-triangle"] = () => {
  const k = 26, E = [40, 200], F = [40, 200 - 6 * k], G = [40 + 8 * k, 200], M = [40, 200 - 1.5 * k], N = [40 + 2 * k, 200], fs = ' font-size="13" font-style="italic"';
  let g = L(E, F) + L(F, G) + L(G, E) + L(M, N) + droit(E, [0, -1], [1, 0]);
  g += T([F[0] - 4, F[1] - 8], "F", fs) + T([E[0] - 16, E[1] + 6], "E", fs) + T([G[0] + 6, G[1] + 5], "G", fs) + T([M[0] - 18, M[1] + 4], "M", fs) + T([N[0] - 4, N[1] + 16], "N", fs);
  return svg(270, 224, g, "Triangle EFG rectangle en E ; M sur [EF] et N sur [EG], avec EF = 6 cm, EG = 8 cm, EM = 1,5 cm, EN = 2 cm.");
};
// BEPC 2023 maths, géométrie exercice 3 : grand cône de sommet S coupé par un plan parallèle à la base (centre O', rayon O'B).
S["bepc-2023-maths-cone"] = () => {
  const S0 = [110, 20], O = [110, 200], O2 = [110, 80], R = 80, r = R / 3, fs = ' font-size="13" font-style="italic"';
  let g = L(S0, [O[0] - R, O[1]]) + L(S0, [O[0] + R, O[1]]);
  g += '<path d="M' + (O[0] - R) + " " + O[1] + " A " + R + " 20 0 0 0 " + (O[0] + R) + " " + O[1] + '"/>' + '<path d="M' + (O[0] - R) + " " + O[1] + " A " + R + " 20 0 0 1 " + (O[0] + R) + " " + O[1] + '"' + POINTILLE + "/>";
  g += '<ellipse cx="' + O2[0] + '" cy="' + O2[1] + '" rx="' + r + '" ry="7" stroke-width="1.2"/>';
  g += L(S0, O, POINTILLE + ' stroke-width="1"') + L(O, [O[0] + R, O[1]], POINTILLE + ' stroke-width="1"') + L(O2, [O2[0] + r, O2[1]], POINTILLE + ' stroke-width="1"');
  for (const p of [S0, O, O2]) g += '<circle cx="' + p[0] + '" cy="' + p[1] + '" r="2.4" fill="currentColor" stroke="none"/>';
  g += T([S0[0] - 4, S0[1] - 6], "S", fs) + T([O2[0] + r + 6, O2[1] + 4], "B", fs) + T([O2[0] - r - 22, O2[1] + 4], "O'", fs) + T([O[0] - 6, O[1] - 6], "O", fs) + T([O[0] + R + 6, O[1] + 4], "A", fs);
  return svg(230, 232, g, "Grand cône de révolution de sommet S, de base le disque de centre O et de rayon [OA], coupé par un plan parallèle à la base passant par O' et B ; SO'/SO = 1/3.");
};
// BEPC 2023 PCT : sinusoïde de période 8 div et d'amplitude 3 div, partant de l'axe des tensions (10 V/div ; 5 ms/div).
S["bepc-2023-pct-oscillogramme"] = () => oscillo(18, 8, 3, 8, 1, [1, 17], "Oscillogramme d'une tension alternative sinusoïdale : une période occupe 8 divisions horizontales et la tension maximale 3 divisions verticales.", 1);
// Corrigé BEPC 2023 PCT : transmission par poulies et courroie, roue motrice E (120 mm) et roue réceptrice S (20 mm).
S["bepc-2023-pct-poulies"] = () => {
  const E = [90, 90], RE = 72, S0 = [300, 90], RS = 12, fs = ' font-size="13" font-weight="700"';
  const a = Math.asin((RE - RS) / (S0[0] - E[0])), t = [Math.sin(a), Math.cos(a)];
  let g = '<circle cx="' + E[0] + '" cy="' + E[1] + '" r="' + RE + '" stroke-width="1.8"/><circle cx="' + S0[0] + '" cy="' + S0[1] + '" r="' + RS + '" stroke-width="1.8"/>';
  g += L([E[0] + RE * t[0], E[1] - RE * t[1]], [S0[0] + RS * t[0], S0[1] - RS * t[1]], ' stroke-width="2"') + L([E[0] + RE * t[0], E[1] + RE * t[1]], [S0[0] + RS * t[0], S0[1] + RS * t[1]], ' stroke-width="2"');
  g += '<circle cx="' + E[0] + '" cy="' + E[1] + '" r="3" fill="currentColor" stroke="none"/><circle cx="' + S0[0] + '" cy="' + S0[1] + '" r="2.5" fill="currentColor" stroke="none"/>';
  g += T([E[0] - 70, 186], "E : roue motrice, 120 mm", ' font-size="11"') + T([S0[0] - 120, 186], "S : roue réceptrice, 20 mm", ' font-size="11"') + T([E[0] - 5, E[1] - 8], "E", fs) + T([S0[0] - 5, S0[1] - 18], "S", fs);
  return svg(380, 196, g, "Transmission par courroie : la grande roue motrice E (diamètre 120 mm), liée au moteur, entraîne la petite roue réceptrice S (diamètre 20 mm), qui tourne six fois plus vite.");
};
// Probatoire 2026 sciences A-ABI : mécanisme des réactions allergiques (1er contact : étapes 1 à 5 ; 2e contact : étapes 1 et 2).
S["proba-2026-sciences-allergie"] = () => {
  const fs = ' font-size="12"', lignes = (x, y, t, x2 = "") => t.map((l, i) => T([x, y + i * 15], l, fs + x2)).join("");
  const num = (x, y, n) => '<circle cx="' + x + '" cy="' + y + '" r="9" stroke-width="1.2"/>' + T([x - 3.6, y + 4.5], n, ' font-size="12" font-weight="700"');
  const fl = (a, b) => L(a, b, ' stroke-width="2"') + fleche(b, a, 9);
  const noyau = (x, y, rx, ry) => '<ellipse cx="' + x + '" cy="' + y + '" rx="' + rx + '" ry="' + ry + '" fill="currentColor" stroke="none" opacity=".75"/>';
  const lympho = (x, y, nom, nx, ny) => '<ellipse cx="' + x + '" cy="' + y + '" rx="20" ry="14"/>' + noyau(x, y, 9, 6) + T([nx, ny], nom, ' font-size="11" font-weight="700"');
  const ige = (x, y, a) => { const r = a * Math.PI / 180, u = [Math.cos(r), Math.sin(r)], n = [-u[1], u[0]], b = [x + 7 * u[0], y + 7 * u[1]];
    return L([x, y], b, ' stroke-width="1.3"') + L(b, [b[0] + 5 * u[0] + 4 * n[0], b[1] + 5 * u[1] + 4 * n[1]], ' stroke-width="1.3"') + L(b, [b[0] + 5 * u[0] - 4 * n[0], b[1] + 5 * u[1] - 4 * n[1]], ' stroke-width="1.3"'); };
  const granules = (x, y, r, k) => { let g = ""; for (let i = 0; i < k; i++) { const a = i * 2.4, d = r * (0.35 + 0.5 * ((i * 37) % 10) / 10); g += '<circle cx="' + f(x + d * Math.cos(a)) + '" cy="' + f(y + d * Math.sin(a)) + '" r="2.6" fill="currentColor" stroke="none"/>'; } return g; };
  const masto = (x, y, igE) => { let g = '<circle cx="' + x + '" cy="' + y + '" r="32"/>' + noyau(x, y, 10, 8) + granules(x, y, 28, 16);
    if (igE) for (let a = -150; a <= 150; a += 50) { const r = a * Math.PI / 180; g += ige(x + 32 * Math.cos(r), y + 32 * Math.sin(r), a); } return g; };
  const allergene = (x, y) => '<ellipse cx="' + x + '" cy="' + y + '" rx="4" ry="5.5" stroke-width="1.2"/>';
  const macro = (x, y) => '<path d="M' + (x - 26) + " " + y + "c0-14 8-26 20-24c6-10 22-8 26 2c12 2 14 18 6 26c4 12-8 22-20 18c-8 8-24 6-26-6c-10-2-12-12-6-16z" + '"/>' + noyau(x + 2, y + 4, 8, 7) +
    '<circle cx="' + (x - 12) + '" cy="' + (y - 6) + '" r="3.5" stroke-width="1.1"/><circle cx="' + (x + 16) + '" cy="' + (y - 8) + '" r="3.5" stroke-width="1.1"/>';
  let g = "";
  // cadres
  g += '<rect x="6" y="6" width="848" height="408" stroke-width="1"/>' + '<rect x="16" y="16" width="190" height="24" stroke-width="1"/>' + T([24, 33], "1<tspan baseline-shift=\"super\" font-size=\"8\">er</tspan> contact avec l'antigène", ' font-size="13" font-weight="700"');
  g += '<rect x="646" y="16" width="200" height="24" stroke-width="1"/>' + T([654, 33], "2<tspan baseline-shift=\"super\" font-size=\"8\">ème</tspan> contact avec l'antigène", ' font-size="13" font-weight="700"');
  // 1 : entrée de l'allergène (silhouette)
  g += '<circle cx="70" cy="226" r="16"/><path d="M38 286c0-26 14-40 32-40s32 14 32 40z"/>' + allergene(64, 206) + allergene(78, 202);
  g += num(30, 318, "1") + lignes(46, 314, ["Entrée de l'allergène", "dans l'organisme"]);
  g += fl([70, 196], [96, 132]);
  // 2 : captation par les macrophages
  g += macro(130, 90) + num(104, 150, "2") + lignes(120, 146, ["Captation de", "l'allergène par les", "macrophages"]);
  g += fl([176, 70], [232, 80]);
  // 3 : présentation aux lymphocytes
  g += macro(262, 90) + lympho(318, 66, "LB", 344, 52) + lympho(306, 118, "LTh", 296, 148);
  g += num(250, 168, "3") + lignes(266, 164, ["Présentation de", "l'allergène aux", "lymphocytes"]);
  g += fl([346, 100], [400, 128]);
  // 4 : production des IgE par le LB
  g += lympho(432, 140, "LB", 424, 118);
  for (const [dx, dy, a] of [[34, -6, -20], [42, 10, 10], [30, 22, 50], [50, -18, -60], [56, 24, 30]]) g += ige(432 + dx, 140 + dy, a);
  g += num(396, 200, "4") + lignes(412, 196, ["Production des anticorps", "(IgE) dirigés contre", "l'allergène"]);
  g += fl([432, 246], [362, 262]);
  // 5 : fixation des IgE sur les mastocytes
  g += masto(318, 268, true) + num(386, 296, "5") + lignes(402, 292, ["Fixation des IgE à la", "surface des mastocytes"]);
  g += fl([300, 312], [290, 344]);
  g += lignes(206, 362, ["Sensibilisation des mastocytes", "à une activation au prochain", "contact avec l'allergène"], ' font-weight="700"');
  // séparation des deux contacts
  g += L([560, 60], [560, 400], ' stroke-width="1" stroke-dasharray="4 4"');
  // 2e contact : 1 captation des allergènes par les IgE fixés
  g += masto(640, 150, true);
  for (const [x, y] of [[592, 104], [624, 92], [668, 98], [694, 128], [700, 176], [586, 198], [672, 206], [604, 140]]) g += allergene(x, y);
  g += T([566, 80], "Allergène", ' font-size="12" font-weight="700"') + P([[588, 86], [588, 96]], ' stroke-width="1"');
  g += num(578, 246, "1") + lignes(594, 242, ["Captation des", "allergènes par les", "IgE fixés sur les", "mastocytes"], ' font-weight="700"');
  g += fl([706, 150], [740, 150]);
  // 2 : libération des médiateurs (dégranulation)
  g += '<path d="M790 118c-22 0-34 16-32 34c2 14 10 22 22 24l-4 10 10-6 4 12 6-12 10 6-2-12c14-6 22-18 20-32c-2-14-14-24-34-24z"/>' + noyau(792, 140, 10, 8) + granules(788, 150, 14, 6);
  for (const [x, y] of [[776, 196], [786, 204], [798, 198], [782, 214], [794, 216], [806, 208]]) g += '<circle cx="' + x + '" cy="' + y + '" r="2.6" fill="currentColor" stroke="none"/>';
  for (const [x, y] of [[752, 104], [830, 108], [840, 150], [760, 176]]) g += allergene(x, y);
  g += num(712, 246, "2") + lignes(728, 242, ["Libération des", "médiateurs de", "l'inflammation par", "les mastocytes"], ' font-weight="700"');
  g += fl([790, 310], [790, 352]);
  g += T([690, 384], "Réactions allergiques", ' font-size="15" font-weight="700"');
  return svg(860, 420, g, "Mécanisme des réactions allergiques. Premier contact avec l'antigène : 1 entrée de l'allergène dans l'organisme ; 2 captation de l'allergène par les macrophages ; 3 présentation de l'allergène aux lymphocytes (LTh, LB) ; 4 production des anticorps (IgE) dirigés contre l'allergène ; 5 fixation des IgE à la surface des mastocytes, d'où la sensibilisation des mastocytes à une activation au prochain contact avec l'allergène. Deuxième contact : 1 captation des allergènes par les IgE fixés sur les mastocytes ; 2 libération des médiateurs de l'inflammation par les mastocytes, d'où les réactions allergiques.");
};
// >>> proba-2026-svt-d
// Probatoire 2026 SVT D, document 1 : brise de mer (le jour) et brise de terre (la nuit).
const brise26 = (nuit) => {
  const fs = ' font-size="11"', lig = (x, y, t, a = "") => t.map((l, i) => T([x, y + i * 13], l, fs + a)).join("");
  const large = (pts, fin) => P(pts, ' stroke-width="7" stroke-linecap="butt" opacity=".45"') + fleche(fin[1], fin[0], 14);
  const herbe = (x, y) => { let h = ""; for (let i = 0; i < 9; i++) h += L([x + i * 7, y], [x + i * 7 + 8, y - 12 - (i % 3) * 4], ' stroke-width="1.6"'); return h + L([x - 4, y], [x + 66, y], ' stroke-width="2"'); };
  const vagues = (x, y, n) => { let v = ""; for (let i = 0; i < n; i++) v += '<path d="M' + (x + i * 24) + " " + y + " q12 12 24 0" + '" stroke-width="1.4"/>'; return v; };
  let g = "";
  if (!nuit) {
    // gauche = continent (A, l'air chaud monte), droite = mer (B, l'air froid descend) ; brise de mer : mer → continent au sol
    g += large([[92, 180], [92, 70], [110, 46], [200, 40]], [[180, 40], [212, 42]]) + lig(10, 124, ["L'air chaud", "monte"]);
    g += lig(124, 22, ["L'air qui monte se déplace", "vers la mer où il refroidit"]);
    g += large([[240, 52], [262, 70], [262, 176]], [[262, 160], [262, 186]]) + lig(272, 120, ["Air froid condense", "et tombe"]);
    g += L([226, 120], [150, 120], ' stroke-width="5" opacity=".6"') + fleche([140, 120], [152, 120], 12) + T([150, 108], "BRISE DE MER", ' font-size="11" font-weight="700"');
    g += P([[250, 200], [200, 214], [130, 206]], ' stroke-width="7" stroke-linecap="butt" opacity=".45"') + fleche([116, 198], [132, 207], 14) + lig(150, 168, ["L'air froid se déplace", "rapidement"], ' font-size="10"');
    g += T([70, 196], "A", ' font-size="15" font-weight="700"') + T([274, 196], "B", ' font-size="15" font-weight="700"');
    g += herbe(80, 222) + T([10, 236], "Continent", ' font-size="13" font-weight="700"') + vagues(200, 228, 5) + T([300, 222], "Mer", ' font-size="13" font-weight="700"');
    g += T([150, 262], "Le jour", ' font-size="13" font-weight="700"');
    g += '<circle cx="340" cy="40" r="14" stroke-width="1.4"/>';
    for (let a = 0; a < 360; a += 45) { const t = a * Math.PI / 180; g += L([340 + 19 * Math.cos(t), 40 + 19 * Math.sin(t)], [340 + 26 * Math.cos(t), 40 + 26 * Math.sin(t)], ' stroke-width="1.4"'); }
    return svg(380, 272, g, "Le jour : sur le continent (A), l'air chaud monte, puis se déplace vers la mer où il refroidit ; au-dessus de la mer (B), l'air froid condense et tombe, puis se déplace rapidement vers le continent : c'est la brise de mer.");
  }
  // la nuit : gauche = continent (C, l'air froid descend), droite = mer (D, l'air chaud monte) ; brise de terre : continent → mer au sol
  g += large([[300, 180], [300, 70], [282, 46], [192, 40]], [[212, 40], [180, 42]]) + lig(312, 124, ["L'air chaud", "monte"]);
  g += lig(160, 22, ["L'air qui monte se déplace", "vers la terre où il refroidit"]);
  g += large([[152, 52], [130, 70], [130, 176]], [[130, 160], [130, 186]]) + lig(30, 112, ["L'air froid", "se condense", "et tombe"]);
  g += L([160, 120], [236, 120], ' stroke-width="5" opacity=".6"') + fleche([246, 120], [234, 120], 12) + T([164, 108], "BRISE DE TERRE", ' font-size="11" font-weight="700"');
  g += P([[146, 196], [196, 212], [256, 206]], ' stroke-width="7" stroke-linecap="butt" opacity=".45"') + fleche([270, 202], [254, 207], 14) + lig(178, 186, ["L'air froid se déplace", "rapidement"], ' font-size="10"');
  g += T([116, 200], "C", ' font-size="15" font-weight="700"') + T([276, 200], "D", ' font-size="15" font-weight="700"');
  g += herbe(100, 226) + T([20, 252], "Continent", ' font-size="13" font-weight="700"') + vagues(204, 232, 5) + T([318, 228], "Mer", ' font-size="13" font-weight="700"');
  g += T([196, 266], "La nuit", ' font-size="13" font-weight="700"');
  g += '<path d="M46 26 a18 18 0 1 0 14 30 a14 14 0 1 1 -14 -30z" stroke-width="1.6"/>';
  return svg(380, 272, g, "La nuit : au-dessus de la mer (D), l'air chaud monte, puis se déplace vers la terre où il refroidit ; sur le continent (C), l'air froid se condense et tombe, puis se déplace rapidement vers la mer : c'est la brise de terre.");
};
S["proba-2026-svt-d-brises"] = () => brise26(false) + brise26(true);

// Bases azotées de la maquette d'ARN (symboles du sujet) : x = bord gauche du corps, y = milieu ; dir = 1 forme à droite (comme au sujet).
const base26 = (x, y, b, w = 46, h = 26) => {
  const t = y - h / 2, bas = y + h / 2, d = x + w;
  if (b === "A") return '<path d="M' + x + " " + t + "H" + (d - 12) + "L" + d + " " + y + "L" + (d - 12) + " " + bas + "H" + x + 'Z"/>';
  if (b === "G") return '<path d="M' + (d + 4) + " " + t + "H" + x + "V" + bas + "H" + (d + 4) + "A" + (h / 2 + 1) + " " + (h / 2) + " 0 0 1 " + (d + 4) + " " + t + 'Z"/>';
  if (b === "U") return '<path d="M' + x + " " + t + "H" + d + "V" + bas + "H" + x + "L" + (x + 14) + " " + y + 'Z"/>';
  return '<path d="M' + (x + h / 2) + " " + t + "H" + d + "V" + bas + "H" + (x + h / 2) + "A" + (h / 2) + " " + (h / 2) + " 0 0 1 " + (x + h / 2) + " " + t + 'Z"/>';
};
S["proba-2026-svt-d-symboles"] = () => {
  const fs = ' font-size="13"';
  let g = '<circle cx="24" cy="24" r="13" stroke-width="2"/>' + T([44, 29], "= Acide phosphorique", fs);
  g += '<rect x="12" y="62" width="24" height="24" stroke-width="2"/>' + T([44, 79], "= Sucre (Ribose)", fs);
  g += L([12, 116], [36, 116], ' stroke-width="4"') + T([44, 121], "= liaison covalente", fs);
  [["A", 230], ["G", 320], ["U", 410], ["C", 500]].forEach(([b, x]) => { g += base26(x, 40, b, 56, 34) + T([x + 22, 84], b, ' font-size="16"'); });
  g += T([12, 156], "A : Adénine ;  C : Cytosine ;  T : Thymine ;  U : Uracile ;  G : Guanine", ' font-size="13" font-weight="700"');
  return svg(580, 168, g, "Symboles à utiliser pour la maquette : un cercle pour l'acide phosphorique, un carré pour le sucre (ribose), un trait pour la liaison covalente ; A : rectangle terminé en pointe ; G : rectangle échancré en arc de cercle ; U : rectangle à encoche en chevron ; C : rectangle arrondi d'un côté.");
};

// Document 5 : trois cellules immunitaires (échelles non respectées).
S["proba-2026-svt-d-cellules"] = () => {
  let g = "";
  // A : lymphocyte, gros noyau rond occupant presque toute la cellule
  g += '<circle cx="80" cy="90" r="56" stroke-width="1.8"/><circle cx="82" cy="92" r="46" fill="currentColor" stroke="none" opacity=".55"/>';
  // B : macrophage, contour irrégulier à pseudopodes, noyau réniforme (en fer à cheval)
  g += '<path d="M190 70c10-30 40-46 66-38c8-16 22-20 28-8c-6 4-8 10-2 16c26 6 40 30 34 52c14 2 20 14 10 20c-8-6-14-2-14 6c-4 30-30 46-58 44c-6 14-20 18-26 8c8-4 8-12 0-16c-30-6-46-34-38-60c-14-2-18-16-8-22c6 6 12 4 8-2z" stroke-width="1.8"/>';
  g += '<path d="M226 104c-6-26 16-44 40-38c20 4 30 24 22 40c-6-10-18-14-28-8c-10 6-12 18-8 28c-12 0-22-8-26-22z" fill="currentColor" stroke="none" opacity=".55"/>';
  // C : granulocyte (polynucléaire), noyau plurilobé et granulations
  g += '<circle cx="420" cy="90" r="56" stroke-width="1.8"/>';
  g += '<path d="M384 108c-6-18 6-30 18-26c-6-14 4-28 18-24c-2 14 8 16 16 10c12 8 8 22-2 24c14 4 20 20 10 30c-10 8-24 4-28-6c-6 12-22 14-30 4c-6-4-6-10-2-12z" fill="currentColor" stroke="none" opacity=".55"/>';
  for (let i = 0; i < 26; i++) { const a = i * 2.39, d = 18 + (i * 13) % 32; const x = 420 + d * Math.cos(a), y = 90 + d * Math.sin(a); g += '<circle cx="' + f(x) + '" cy="' + f(y) + '" r="2" stroke-width="1"/>'; }
  g += T([74, 176], "A", ' font-size="16" font-weight="700"') + T([248, 176], "B", ' font-size="16" font-weight="700"') + T([414, 176], "C", ' font-size="16" font-weight="700"');
  return svg(500, 186, g, "Document 5 : trois cellules immunitaires. A : petite cellule ronde au gros noyau arrondi, sans granulations ; B : grande cellule au contour irrégulier, au noyau arqué en fer à cheval, sans granulations ; C : cellule ronde au noyau plurilobé, avec des granulations.");
};

// Document 6 : cycle du VIH dans une cellule immunitaire et points d'action des antiviraux (STOP).
S["proba-2026-svt-d-vih"] = () => {
  const fs = ' font-size="11"', fb = ' font-size="11" font-weight="700"';
  const virus = (cx, cy, r) => { let v = '<circle cx="' + cx + '" cy="' + cy + '" r="' + r + '" stroke-width="1.4"/>' + L([cx - r * 0.35, cy], [cx + r * 0.35, cy], ' stroke-width="2.4"');
    for (let a = 0; a < 360; a += 30) { const t = a * Math.PI / 180; v += L([cx + Math.cos(t) * r, cy + Math.sin(t) * r], [cx + Math.cos(t) * (r + 5), cy + Math.sin(t) * (r + 5)], ' stroke-width="1.2"') + '<circle cx="' + f(cx + Math.cos(t) * (r + 6.5)) + '" cy="' + f(cy + Math.sin(t) * (r + 6.5)) + '" r="1.6" fill="currentColor" stroke="none"/>'; }
    return v; };
  const stop = (x, y) => '<rect x="' + (x - 16) + '" y="' + (y - 9) + '" width="32" height="18" rx="9" fill="currentColor" stroke="none" opacity=".8"/>' + '<text x="' + x + '" y="' + (y + 4) + '" text-anchor="middle" font-size="9" font-weight="700" fill="#fff" stroke="none">STOP</text>';
  const fl = (a, b) => L(a, b, ' stroke-width="1.2"') + fleche(b, a, 6);
  let g = "";
  // cellule immunitaire et son noyau
  g += '<path d="M90 230 Q100 120 260 112 Q420 106 470 200 Q520 320 360 360 Q200 392 120 330 Q76 290 90 230Z" stroke-width="1.6"/>';
  g += '<ellipse cx="270" cy="270" rx="78" ry="62" stroke-width="1.6" fill="currentColor" fill-opacity=".08"/>';
  g += T([280, 30], "Cellule immunitaire", fb) + L([330, 36], [330, 110], ' stroke-width="0.9"');
  // virus libre et sa légende
  g += virus(190, 40, 22);
  g += T([42, 22], "Enveloppe", fs) + L([96, 18], [168, 30], ' stroke-width="0.8"') + T([42, 46], "Matériel génétique", fs) + T([42, 59], "(molécule proche", fs) + T([42, 72], "de l'ADN, nommée ARN)", fs) + L([138, 42], [182, 40], ' stroke-width="0.8"');
  g += P([[38, 12], [34, 12], [34, 78], [38, 78]], ' stroke-width="1"') + L([26, 45], [34, 45], ' stroke-width="1"') + T([2, 49], "VIH", fb);
  g += fl([186, 66], [150, 118]);
  g += stop(136, 96);
  // entrée : virus fixé, ARN libéré puis copié en ADN
  g += virus(132, 146, 20) + T([158, 150], "ARN", fb) + fl([150, 160], [196, 178]) + stop(130, 186);
  g += L([200, 180], [222, 180], ' stroke-width="2.4"') + T([228, 176], "ADN", fb) + fl([240, 182], [256, 222]);
  // dans le noyau : intégration puis transcription
  g += stop(226, 246) + L([246, 262], [296, 262], ' stroke-width="2.4"') + '<rect x="234" y="257" width="74" height="10" stroke-width="1"/>' + stop(226, 290) + fl([272, 270], [272, 292]) + L([262, 300], [290, 300], ' stroke-width="2.4"') + T([294, 304], "ARNm", fb);
  g += '<path d="M310 290 Q340 230 380 196" stroke-width="1.2"/>' + fleche([384, 192], [376, 200], 6);
  // cytoplasme : brins d'ARN viral, protéines, assemblage
  g += L([392, 180], [416, 180], ' stroke-width="2.4"') + L([402, 192], [426, 192], ' stroke-width="2.4"') + L([392, 204], [416, 204], ' stroke-width="2.4"') + stop(446, 192);
  g += virus(388, 262, 18) + virus(438, 236, 18) + virus(462, 290, 18);
  g += '<rect x="372" y="322" width="150" height="40" stroke-width="1"/>' + T([380, 337], "3. Production de matériel", fb) + T([380, 351], "génétique viral et d'enveloppes", fb);
  // maturation et sortie
  g += virus(480, 150, 18) + virus(536, 130, 18) + virus(486, 68, 16);
  g += '<rect x="560" y="146" width="84" height="22" stroke-width="1"/>' + T([570, 161], "4. Maturation", fb) + fl([560, 156], [556, 140]);
  g += '<rect x="526" y="14" width="128" height="50" stroke-width="1"/>' + T([532, 29], "5. Sortie des", fb) + T([532, 43], "nouveaux virus et", fb) + T([532, 57], "mort de la cellule", fb) + fl([536, 110], [556, 70]);
  // légende STOP
  g += stop(40, 392) + T([62, 388], "Action des anti-virus", fs) + T([62, 401], "(tri-thérapie)", fs);
  return svg(660, 412, g, "Document 6 : multiplication du VIH dans une cellule immunitaire. Le virus (enveloppe et matériel génétique, une molécule proche de l'ADN nommée ARN) entre dans la cellule ; son ARN est copié en ADN, qui gagne le noyau et s'intègre à l'ADN de la cellule, puis est transcrit en ARNm ; 3 : production de matériel génétique viral et d'enveloppes ; 4 : maturation ; 5 : sortie des nouveaux virus et mort de la cellule. Les pastilles STOP marquent les étapes bloquées par les anti-virus (trithérapie) : entrée du virus, copie de l'ARN en ADN, intégration, transcription et maturation.");
};

// Corrigé : maquette de l'ARNm UAC CAU (six premiers nucléotides).
S["proba-2026-svt-d-maquette"] = () => {
  const bases = "UACCAU".split(""); let g = "";
  bases.forEach((b, i) => { const y = 30 + i * 56, P0 = [40, y], S0 = [64, y + 24];
    g += '<circle cx="' + P0[0] + '" cy="' + P0[1] + '" r="11" stroke-width="1.6"/>' + T([P0[0] - 4, P0[1] + 4], "P", ' font-size="11" font-weight="700"');
    g += L([P0[0] + 6, P0[1] + 9], [S0[0] - 4, S0[1] - 10], ' stroke-width="2.2"');
    g += '<rect x="' + (S0[0] - 10) + '" y="' + (S0[1] - 10) + '" width="20" height="20" stroke-width="1.6"/>' + T([S0[0] - 4, S0[1] + 4], "S", ' font-size="11" font-weight="700"');
    g += L([S0[0] + 10, S0[1]], [S0[0] + 34, S0[1]], ' stroke-width="2.2"') + (b === "U" || b === "C" ? '<g transform="matrix(-1 0 0 1 ' + (2 * (S0[0] + 56)) + ' 0)">' + base26(S0[0] + 34, S0[1], b, 44, 22) + "</g>" : base26(S0[0] + 34, S0[1], b, 44, 22)) + T([S0[0] + (b === "U" ? 46 : 52), S0[1] + 5], b, ' font-size="13" font-weight="700"');
    if (i < bases.length - 1) g += L([S0[0] - 4, S0[1] + 10], [44, y + 46], ' stroke-width="2.2"'); });
  return svg(170, 366, g, "Maquette de l'ARNm UAC CAU : une seule chaîne où chaque acide phosphorique (P) est lié au ribose (S) du nucléotide suivant ; chaque ribose porte une base : U, A, C, C, A, U ; la forme propre à chaque base est tournée vers l'extérieur.");
};
// <<< proba-2026-svt-d
// >>> proba-2026-chimie
// Noyau benzénique (hexagone à sommets haut et bas) ; renvoie [tracé, sommets 0..5 depuis le haut, sens horaire].
const benzene26 = (cx, cy, r) => { const v = []; for (let k = 0; k < 6; k++) { const a = -Math.PI / 2 + k * Math.PI / 3; v.push([cx + r * Math.cos(a), cy + r * Math.sin(a)]); }
  return [P(v.concat([v[0]])) + '<circle cx="' + cx + '" cy="' + cy + '" r="' + f(r * 0.58) + '"/>', v]; };
// Exercice 2, question 4 : hydratation du 2-méthylpropène.
S["proba-2026-chimie-hydratation"] = () => {
  const fs = ' font-size="14"';
  let g = F([10, 22], "H3C", fs) + L([36, 28], [50, 44], ' stroke-width="1.2"') + F([10, 86], "H3C", fs) + L([36, 72], [50, 56], ' stroke-width="1.2"');
  g += F([50, 55], "C=CH2", fs) + T([140, 55], "+", fs) + F([166, 55], "H2O", fs);
  g += L([214, 50], [290, 50], ' stroke-width="1.2"') + fleche([296, 50], [288, 50], 7) + F([232, 40], "H2SO4", ' font-size="12"') + T([314, 55], "A", fs);
  return svg(340, 96, g, "(CH3)2C=CH2 + H2O → A, en présence d'acide sulfurique : hydratation du 2-méthylpropène.");
};
// Exercice 3 : formule semi-développée de l'éthylbenzène.
S["proba-2026-chimie-ethylbenzene"] = () => { const [b, v] = benzene26(40, 40, 28);
  return svg(170, 80, b + L([v[1][0], v[1][1]], [v[1][0] + 18, v[1][1] - 6]) + F([v[1][0] + 20, v[1][1] - 2], "CH2−CH3", ' font-size="14"'), "Éthylbenzène : noyau benzénique portant un groupe éthyle –CH2–CH3."); };
// Corrigé : 2,4-dichloro-1-éthylbenzène (Cl en ortho et en para du groupe éthyle).
S["proba-2026-chimie-dichloro"] = () => { const [b, v] = benzene26(70, 70, 30), fs = ' font-size="14"';
  let g = b + L(v[0], [v[0][0], v[0][1] - 16]) + F([v[0][0] - 12, v[0][1] - 20], "CH2−CH3", fs);
  g += L(v[1], [v[1][0] + 16, v[1][1] - 9]) + T([v[1][0] + 18, v[1][1] - 6], "Cl", fs);
  g += L(v[3], [v[3][0], v[3][1] + 16]) + T([v[3][0] - 8, v[3][1] + 32], "Cl", fs);
  return svg(170, 140, g, "Composé B : noyau benzénique portant le groupe éthyle en position 1, un atome de chlore en position 2 (ortho) et un en position 4 (para) : 2,4-dichloro-1-éthylbenzène."); };
// Corrigé partie B : dispositif du dosage de l'eau oxygénée par le permanganate de potassium.
S["proba-2026-chimie-dosage"] = () => {
  const fs = ' font-size="12"';
  let g = L([40, 20], [40, 290], ' stroke-width="2"') + '<rect x="14" y="288" width="160" height="8" stroke-width="1.4"/>' + L([40, 70], [96, 70], ' stroke-width="1.6"');
  g += '<rect x="96" y="20" width="14" height="170" stroke-width="1.4"/>' + '<rect x="97" y="40" width="12" height="149" fill="currentColor" fill-opacity="0.35" stroke="none"/>';
  for (let y = 40; y <= 180; y += 10) g += L([110, y], [y % 50 === 0 ? 102 : 105, y], ' stroke-width="0.7"');
  g += P([[96, 190], [101, 205], [101, 214]], ' stroke-width="1.4"') + P([[110, 190], [105, 205], [105, 214]], ' stroke-width="1.4"') + '<rect x="96" y="196" width="18" height="6" stroke-width="1"/>';
  g += P([[70, 222], [70, 282], [136, 282], [136, 222]], ' stroke-width="1.6"') + '<rect x="71" y="252" width="64" height="29" fill="currentColor" fill-opacity="0.12" stroke="none"/>' + '<rect x="94" y="276" width="18" height="4" fill="currentColor" stroke="none"/>';
  g += '<rect x="58" y="284" width="90" height="4" stroke-width="1"/>';
  g += L([122, 30], [168, 30], ' stroke-width="0.9"') + T([172, 26], "burette graduée : solution violette de permanganate", fs) + T([172, 42], "de potassium, C₂ = 0,2 mol/L", fs);
  g += L([132, 199], [168, 178], ' stroke-width="0.9"') + T([172, 182], "robinet", fs);
  g += L([136, 262], [168, 246], ' stroke-width="0.9"') + T([172, 242], "bécher : V₁ = 10 mL d'eau oxygénée (pipette jaugée)", fs) + T([172, 258], "+ quelques gouttes d'acide sulfurique", fs);
  g += L([112, 279], [168, 274], ' stroke-width="0.9"') + T([172, 278], "barreau aimanté", fs) + L([148, 286], [168, 300], ' stroke-width="0.9"') + T([172, 306], "agitateur magnétique", fs);
  return svg(490, 318, g, "Dispositif de dosage : une burette graduée, fixée à un support, contient la solution de permanganate de potassium (0,2 mol/L) ; en dessous, un bécher contient 10 mL d'eau oxygénée acidifiée, agitée par un barreau aimanté posé sur un agitateur magnétique.");
};
// <<< proba-2026-chimie
module.exports = S;
