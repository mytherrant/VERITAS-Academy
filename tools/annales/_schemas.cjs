/* Schémas des annales, redessinés en SVG d'après les scans officiels (exactitude, poids).
   Chaque fonction rend un <svg> ; tools/annales.cjs remplace <!--schema:nom--> dans les sources.
   Couleur : currentColor (s'adapte au thème) ; les tracés « à compléter » restent ceux du sujet. */
"use strict";
const f = n => Math.round(n * 10) / 10;
const svg = (w, h, corps, titre) => '<svg class="ax-svg" viewBox="0 0 ' + w + " " + h + '" width="' + w + '" role="img" aria-label="' + titre.replace(/"/g, "&quot;") + '" xmlns="http://www.w3.org/2000/svg"><title>' + titre + "</title>" +
  '<g fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round" stroke-linecap="round" font-size="14" font-family="inherit">' + corps + "</g></svg>";
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
S["bepc-2026-maths-triangle"] = () => {
  const k = 28, A = [70, 24], B = [70, 24 + 4 * Math.sqrt(3) * k], C = [70 + 4 * k, B[1]], E = [70, 24 + 2 * k];
  const F = [70 + 4 * k * (2 * k) / (B[1] - 24), E[1]];
  return svg(250, 250, L(A, B) + L(B, C) + L(A, C) + L(E, F) + droit(B, [0, -1], [1, 0]) +
    '<path d="M70 52 A 28 28 0 0 1 84 48.3"/>' + T([74, 76], "30°", ' font-size="11"') +
    L([48, A[1]], [48, E[1]], ' stroke-width="1"') + L([43, A[1]], [53, A[1]], ' stroke-width="1"') + L([43, E[1]], [53, E[1]], ' stroke-width="1"') + T([8, 56], "2 cm") +
    L([A[0] + 14, A[1] - 6], [C[0] + 14, C[1] - 6], ' stroke-width="1"') + T([150, 110], "8 cm") +
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
    L(E, F) + L(F, G) + L(G, H, POINTILLE) + L(H, E, POINTILLE) + L(S0, M, POINTILLE) + L(A, C, POINTILLE + ' stroke-width="1"') + L(B, D, POINTILLE + ' stroke-width="1"') +
    '<circle cx="' + f(N[0]) + '" cy="' + f(N[1]) + '" r="2.5" fill="currentColor"/><circle cx="' + f(M[0]) + '" cy="' + f(M[1]) + '" r="2.5" fill="currentColor"/>' +
    T([S0[0] - 4, S0[1] - 8], "S") + T([A[0] - 16, A[1] + 6], "A") + T([B[0] - 2, B[1] + 18], "B") + T([C[0] + 6, C[1] + 4], "C") + T([D[0] - 16, D[1] - 2], "D") +
    T([E[0] - 16, E[1] + 4], "E") + T([F[0] + 4, F[1] + 14], "F") + T([G[0] + 6, G[1]], "G") + T([H[0] - 16, H[1] - 2], "H") + T([N[0] + 6, N[1] - 4], "N") + T([M[0] + 6, M[1] + 14], "M"),
    "Pyramide régulière SABCD à base carrée, de hauteur SM ; la section EFGH est obtenue par un plan parallèle à la base passant par N, milieu de [SM].");
};

// Probatoire D 2025 maths : champ formé des rectangles ABCD et BEFG ; EF = 120 m, FG = 30 m ; AB = DC = CG.
S["proba-2025-maths-d-champ"] = () => {
  const A = [24, 24], D = [196, 24], B = [24, 64], C = [196, 64], G = [238, 64], E = [24, 154], F = [238, 154];
  return svg(300, 190, P([A, D, C, G, F, E, A]) + L(B, C, POINTILLE + ' stroke-width="1"') + code(D, C) + code(C, G) + code(A, B) +
    droit(A, [1, 0], [0, 1], 8) + droit(D, [-1, 0], [0, 1], 8) + droit(C, [0, -1], [1, 0], 8) + droit(G, [-1, 0], [0, 1], 8) + droit(F, [-1, 0], [0, -1], 8) + droit(E, [1, 0], [0, -1], 8) +
    T([10, 22], "A") + T([200, 20], "D") + T([10, 70], "B") + T([186, 82], "C") + T([244, 66], "G") + T([10, 168], "E") + T([244, 168], "F") +
    T([116, 174], "120 m") + T([246, 114], "30 m"),
    "Le champ de Bolo : le rectangle ABCD posé sur le rectangle BEFG ; EF = 120 m, FG = 30 m ; AB, DC et CG portent le même codage.");
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
function petri(cx, cy, n, r = 22) {
  let s = '<circle cx="' + cx + '" cy="' + cy + '" r="' + r + '"/>';
  for (let i = 0; i < n; i++) { const a = i * 2.39996, d = 4 + 13 * Math.sqrt((i + 0.5) / Math.max(n, 3)); s += '<circle cx="' + f(cx + d * Math.cos(a)) + '" cy="' + f(cy + d * Math.sin(a)) + '" r="3" fill="currentColor" stroke="none"/>'; }
  return s;
}
// BEPC 2025 SVT : expériences A et B (document 2).
S["bepc-2025-svt-cultures"] = () => {
  const col = [196, 268, 340], lab = ["−18 °C", "37 °C", "100 °C"];
  let g = T([20, 22], "Expérience A", ' font-weight="600"') + T([20, 196], "Expérience B", ' font-weight="600"');
  lab.forEach((l, i) => { g += T([col[i] - 20, 44], l, ' font-size="12"'); });
  g += T([20, 82], "Début de", ' font-size="12"') + T([20, 96], "culture", ' font-size="12"') + T([20, 144], "Fin de culture", ' font-size="12"') + T([20, 158], "(3 jours plus tard)", ' font-size="12"');
  [3, 3, 3].forEach((n, i) => { g += petri(col[i], 86, n); }); [3, 5, 0].forEach((n, i) => { g += petri(col[i], 146, n); });
  g += T([col[0] - 40, 214], "Milieux obtenus à :", ' font-size="11"'); lab.forEach((l, i) => { g += T([col[i] - 20, 230], l, ' font-size="12"'); });
  g += T([20, 256], "Début : colonies issues", ' font-size="12"') + T([20, 270], "de 3 jours de culture", ' font-size="12"') + T([20, 318], "Fin : à 37 °C,", ' font-size="12"') + T([20, 332], "un jour de plus", ' font-size="12"');
  [3, 5, 0].forEach((n, i) => { g += petri(col[i], 262, n); }); [10, 10, 0].forEach((n, i) => { g += petri(col[i], 326, n); });
  g += T([20, 364], "• : colonies bactériennes", ' font-size="12"');
  return svg(380, 376, g, "Document 2. Expérience A : à −18 °C, 3 colonies au début et à la fin ; à 37 °C, de 3 à 5 colonies ; à 100 °C, 3 colonies au début et aucune à la fin. Expérience B, à 37 °C pendant un jour : le milieu venu de −18 °C passe de 3 à une dizaine de colonies, celui venu de 37 °C de 5 à une dizaine, celui venu de 100 °C reste sans colonie.");
};

// BEPC 2026 SVT : évolution de l'infection par le VIH (lymphocytes T4 et charge virale).
S["bepc-2026-svt-vih"] = () => {
  const x0 = 56, x1 = 396, y0 = 236, y1 = 36, X = t => t <= 12 ? x0 + t / 12 * 70 : x0 + 80 + (t - 12) / (11 * 52) * (x1 - x0 - 80);   // t en semaines
  const yT4 = n => y0 - n / 1100 * (y0 - y1), yCV = l => y0 - (l - 1) / 5.6 * (y0 - y1);   // l = log10 de la charge
  const an = a => 12 + a * 52;
  const T4 = [[0, 1000], [2, 820], [4, 560], [6, 520], [8, 600], [10, 680], [12, 720], [an(2), 620], [an(4), 470], [an(6), 340], [an(8), 220], [an(9), 120], [an(10), 20]];
  const CV = [[0, 1], [2, 3.5], [4, 5.6], [5, 6], [6, 5.3], [7, 4], [9, 3.4], [12, 3.3], [an(2), 3.4], [an(4), 3.55], [an(6), 3.75], [an(7.5), 4], [an(8.5), 4.6], [an(9.5), 5.6], [an(10.3), 6.4]];
  let g = L([x0, y0], [x1, y0]) + L([x0, y0], [x0, y1 - 8]) + L([x1, y0], [x1, y1 - 8]);
  [0, 200, 400, 600, 800, 1000].forEach(v => { g += L([x0 - 4, yT4(v)], [x0, yT4(v)]) + T([x0 - 36, yT4(v) + 4], String(v), ' font-size="10"'); });
  [2, 3, 4, 5, 6].forEach(l => { g += L([x1, yCV(l)], [x1 + 4, yCV(l)]) + T([x1 + 6, yCV(l) + 4], "10<tspan dy=\"-5\" font-size=\"8\">" + l + "</tspan>", ' font-size="10"'); });
  [0, 3, 6, 9, 12].forEach(s => { g += L([X(s), y0], [X(s), y0 + 4]) + T([X(s) - 4, y0 + 15], String(s), ' font-size="10"'); });
  for (let a = 1; a <= 11; a++) g += L([X(an(a)), y0], [X(an(a)), y0 + 4]) + T([X(an(a)) - 4, y0 + 15], String(a), ' font-size="10"');
  g += '<path d="M' + (X(12) + 3) + " " + (y0 - 6) + " l6 12 M" + (X(12) + 8) + " " + (y0 - 6) + ' l6 12" stroke-width="1.2"/>';
  g += T([x0 + 6, y0 + 30], "Semaines", ' font-size="11"') + T([X(an(4)), y0 + 30], "Années", ' font-size="11"');
  g += T([4, 20], "Nombre de LT4", ' font-size="11"') + T([4, 32], "(par mm³)", ' font-size="10"') + T([x1 - 46, 20], "Charge virale", ' font-size="11"');
  g += P(T4.map(([t, n]) => [X(t), yT4(n)]), POINTILLE + ' stroke-width="2"') + P(CV.map(([t, l]) => [X(t), yCV(l)]), ' stroke-width="2.2"');
  g += T([x0 + 2, y1 + 10], "Primo-infection", ' font-size="10"') + T([X(an(2)), y1 + 34], "Latence clinique", ' font-size="10"') + T([X(an(8.4)), y1 + 2], "Sida déclaré", ' font-size="10"');
  g += L([X(an(8.2)), y1 + 6], [X(an(11)), y1 + 6], ' stroke-width="1"') + L([X(12), y1 + 38], [X(an(8)), y1 + 38], ' stroke-width="1"');
  g += L([x0 + 150, y0 + 44], [x0 + 176, y0 + 44], POINTILLE + ' stroke-width="2"') + T([x0 + 182, y0 + 48], "nombre de LT4", ' font-size="11"') + L([x0 + 280, y0 + 44], [x0 + 306, y0 + 44], ' stroke-width="2.2"') + T([x0 + 312, y0 + 48], "charge virale", ' font-size="11"');
  return svg(440, 290, g, "Document 1 : après la primo-infection, la charge virale culmine vers la 6e semaine puis retombe ; pendant la latence clinique, elle reste basse et les LT4 diminuent lentement ; au stade sida déclaré (vers la 8e année), les LT4 tombent sous 200 jusqu'à zéro vers la 10e année et la charge virale dépasse 10⁶ jusqu'à la mort.");
};

// Caryotype schématique : 22 paires + gonosomes ; ext = { numéro: nombre de chromosomes }, sexe = chaîne ("XY", "XXY", "X").
function caryotype(ox, oy, ext, sexe, nom) {
  const haut = n => 32 - (n - 1) * 1.1, W = 4, PAS = 5.5, ECART = 7;
  const chrom = (x, y, h) => '<rect x="' + f(x) + '" y="' + f(y - h) + '" width="' + W + '" height="' + f(h) + '" rx="2" fill="currentColor" fill-opacity="0.25" stroke-width="1"/>' + L([x - 1, y - h * 0.62], [x + W + 1, y - h * 0.62], ' stroke-width="1"');
  const rangs = [[1, 2, 3, 4, 5], [6, 7, 8, 9, 10, 11, 12], [13, 14, 15, 16, 17, 18, 19, 20], [21, 22]];
  let g = "";
  rangs.forEach((r, i) => { const y = oy + 46 + i * 52; let x = ox + 8;
    r.forEach(n => { const k = ext[n] || 2, x0 = x; for (let c = 0; c < k; c++) g += chrom(x + c * PAS, y, haut(n));
      const w = (k - 1) * PAS + W; g += T([x0 + w / 2 - (n > 9 ? 5 : 3), y + 11], String(n), ' font-size="8"');
      if (n === 21 && ext.cercle21) g += '<ellipse cx="' + f(x0 + w / 2) + '" cy="' + f(y - 12) + '" rx="' + f(w / 2 + 6) + '" ry="22" stroke-width="1.1"/>';
      x += w + ECART; });
    if (i === 3) { x += 12; const x0 = x; [...sexe].forEach(l => { g += chrom(x, y, l === "Y" ? 12 : 26) + T([x - 1, y + 11], l, ' font-size="8"'); x += PAS + 2; });
      if (ext.cercleSexe) { const w = x - x0 - 2; g += '<ellipse cx="' + f(x0 + w / 2) + '" cy="' + f(y - 12) + '" rx="' + f(w / 2 + 6) + '" ry="22" stroke-width="1.1"/>'; } } });
  return g + '<rect x="' + ox + '" y="' + (oy + 4) + '" width="140" height="222" stroke-width="1"/>' + T([ox + 22, oy + 244], nom, ' font-weight="600" font-size="13"');
}
// BEPC 2026 SVT : caryotypes de K (XXY), T (trisomie 21) et Z (trisomie 21 et un seul X), d'après le corrigé national.
S["bepc-2026-svt-caryotypes"] = () => svg(450, 256, caryotype(4, 0, { cercleSexe: 1 }, "XXY", "Caryotype de K") + caryotype(154, 0, { 21: 3, cercle21: 1 }, "XY", "Caryotype de T") + caryotype(304, 0, { 21: 3, cercle21: 1, cercleSexe: 1 }, "X", "Caryotype de Z"),
  "Document 2 (schéma) : caryotype de K, trois chromosomes sexuels XXY ; caryotype de T, trois chromosomes 21 ; caryotype de Z, trois chromosomes 21 et un seul chromosome sexuel X. Les paires anormales sont entourées.");
// BEPC 2024 SVT : caryotype avec trois gonosomes XXY.
S["bepc-2024-svt-caryotype"] = () => svg(156, 256, caryotype(4, 0, {}, "XXY", "Document 1"), "Document 1 (schéma) : caryotype de 22 paires d'autosomes normales et de trois chromosomes sexuels, deux X et un Y.");

// BEPC 2025 histoire : frise graduée de 1880 à 1980.
S["bepc-2025-histoire-frise"] = () => {
  let g = P([[20, 40], [400, 40], [400, 32], [424, 52], [400, 72], [400, 64], [20, 64], [20, 40]]);
  [1880, 1900, 1920, 1940, 1960, 1980].forEach((a, i) => { const x = 46 + i * 66; g += L([x, 40], [x, 64]) + T([x - 15, 28], String(a), ' font-size="13" font-weight="600"'); });
  return svg(440, 84, g, "Frise chronologique graduée de 1880 à 1980, de vingt ans en vingt ans, à reproduire.");
};

module.exports = S;
