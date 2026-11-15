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

module.exports = S;
