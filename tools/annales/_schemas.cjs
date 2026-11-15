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

module.exports = S;
