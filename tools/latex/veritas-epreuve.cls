% veritas-epreuve.cls — gabarit LaTeX des épreuves VÉRITAS EDUCATION
% Compilé par Tectonic (XeTeX) via tools/latex/compiler.cjs.
% Une seule source produit l'énoncé ET le corrigé : les environnements
% « solution » ne sortent que lorsque \VRTmode vaut « corrige ».
\NeedsTeXFormat{LaTeX2e}
\ProvidesClass{veritas-epreuve}[2026/11/15 Epreuves VERITAS]
\LoadClass[11pt,a4paper]{article}

% ── Mode (énoncé / corrigé) ────────────────────────────────────────────
\providecommand\VRTmode{enonce}
\newif\ifVRTcorrige
\def\VRT@corrige{corrige}
\ifx\VRTmode\VRT@corrige \VRTcorrigetrue \fi

% ── Langue, polices ────────────────────────────────────────────────────
\RequirePackage{fontspec}
\RequirePackage{amsmath,amssymb}
\RequirePackage{unicode-math}
\RequirePackage[french]{babel}
\setmainfont{texgyretermes}[
  Extension=.otf, UprightFont=*-regular, BoldFont=*-bold,
  ItalicFont=*-italic, BoldItalicFont=*-bolditalic]
\setsansfont{texgyreheros}[
  Extension=.otf, UprightFont=*-regular, BoldFont=*-bold,
  ItalicFont=*-italic, BoldItalicFont=*-bolditalic]
\setmathfont{texgyretermes-math.otf}

% ── Page ───────────────────────────────────────────────────────────────
\RequirePackage[a4paper,top=25mm,bottom=15mm,left=15mm,right=15mm,
  headheight=13mm,headsep=4mm,footskip=8mm]{geometry}
\RequirePackage{graphicx}
\RequirePackage{xcolor}
\RequirePackage{tikz}
\RequirePackage{pgfplots}
\pgfplotsset{compat=1.18,/pgf/number format/.cd,use comma,1000 sep={\,}}
\usetikzlibrary{calc,angles,quotes,arrows.meta,patterns}
\RequirePackage[most]{tcolorbox}
\RequirePackage{enumitem}
\RequirePackage{fancyhdr}
\RequirePackage{lastpage}
\RequirePackage{needspace}
\RequirePackage{environ}
\RequirePackage{array,tabularx,booktabs,colortbl}
\RequirePackage{microtype}

% Charte du site (bleu LWS, titres encre, or réservé à l'action)
\definecolor{vrtbleu}{HTML}{1E499B}
\definecolor{vrtprofond}{HTML}{0C2A6A}
\definecolor{vrtencre}{HTML}{001136}
\definecolor{vrtcorps}{HTML}{4D5163}
\definecolor{vrtfond}{HTML}{EEF3FB}
\definecolor{vrtor}{HTML}{FFC93C}
\definecolor{vrtvert}{HTML}{1B6B45}

\setlength\parindent{0pt}
\setlength\parskip{4pt plus 1pt}
\setlist{nosep,leftmargin=*,topsep=2pt,itemsep=2pt}
\setlist[enumerate,1]{label=\textbf{\arabic*.},leftmargin=7mm}
\setlist[enumerate,2]{label=\textbf{\alph*)},leftmargin=7mm}

% ── Métadonnées de l'épreuve ───────────────────────────────────────────
\newcommand\VRT@set[2]{\expandafter\def\csname VRT@#1\endcsname{#2}}
\newcommand\classe[1]{\VRT@set{classe}{#1}}
\newcommand\matiere[1]{\VRT@set{matiere}{#1}}
\newcommand\epreuve[1]{\VRT@set{epreuve}{#1}}
\newcommand\duree[1]{\VRT@set{duree}{#1}}
\newcommand\coefficient[1]{\VRT@set{coef}{#1}}
\newcommand\annee[1]{\VRT@set{annee}{#1}}
\newcommand\code[1]{\VRT@set{code}{#1}}
% « ÉPREUVE DE MATHÉMATIQUES » mais « ÉPREUVE D'ANGLAIS » : \prefixe{D'} devant voyelle.
\newcommand\prefixe[1]{\VRT@set{prefixe}{#1}}\prefixe{DE }
% Épreuve en langue étrangère : ni espace avant « ! ? : ; » ni guillemets à la française.
% (babel-french n'espace alors que là où la source a déjà mis une espace.)
\newcommand\langueetrangere{\frenchsetup{AutoSpacePunctuation=false}}
\classe{}\matiere{}\epreuve{}\duree{}\coefficient{}\annee{2026-2027}\code{}

\newcommand\VRT@nature{\ifVRTcorrige Corrigé\else Énoncé\fi}

% ── En-tête et pied de page ────────────────────────────────────────────
\pagestyle{fancy}
\fancyhf{}
\renewcommand\headrulewidth{.6pt}
\renewcommand\headrule{{\color{vrtbleu}\hrule height\headrulewidth width\headwidth}}
\fancyhead[L]{\includegraphics[height=11mm]{veritas-logo-hd.png}}
\fancyhead[R]{\begin{tabular}[b]{@{}r@{}}
  \textcolor{vrtencre}{\small\bfseries VÉRITAS EDUCATION — Épreuves \VRT@annee{} — Classe de \VRT@classe}\\[-1pt]
  \textcolor{vrtcorps}{\footnotesize \ifx\VRT@code\@empty\VRT@epreuve\else\VRT@code\fi{} — \VRT@matiere{} — \VRT@nature{} — durée : \VRT@duree}
  \end{tabular}}
\fancyfoot[L]{\textcolor{vrtcorps}{\footnotesize © VÉRITAS EDUCATION · veritas-school.com}}
\fancyfoot[R]{\textcolor{vrtcorps}{\footnotesize Page \thepage{} / \pageref{LastPage}}}
\fancypagestyle{plain}{}

% ── Bloc titre ─────────────────────────────────────────────────────────
\newcommand\titreepreuve{%
  % Sans cadre ni fond (consigne de Jacques, 16/11) : du texte centré, un filet fin.
  \begin{center}
    {\color{vrtbleu}\scshape\small \VRT@epreuve}\par\smallskip
    {\color{vrtencre}\LARGE\bfseries ÉPREUVE \VRT@prefixe\MakeUppercase{\VRT@matiere}\ifVRTcorrige{} — CORRIGÉ\fi}\par\smallskip
    {\color{vrtcorps}\small Classe de \VRT@classe{} — durée : \VRT@duree{}%
      \ifx\VRT@coef\@empty\else{} — coefficient : \VRT@coef\fi}\par\medskip
    {\color{vrtcorps!35}\rule{.3\linewidth}{.4pt}}
  \end{center}}

% ── Consignes ──────────────────────────────────────────────────────────
\newenvironment{consignes}{\par\small
  {\color{vrtencre}\bfseries Consignes.}\ }{\par\medskip}

% ── Exercices et parties ───────────────────────────────────────────────
\newcounter{exercice}
\newcommand\exercice[2][]{%
  \needspace{8\baselineskip}\refstepcounter{exercice}\par\medskip
  \noindent\begin{tikzpicture}
    \node[text=vrtbleu,font=\sffamily\bfseries\small,inner sep=4pt,anchor=west]
      (e) {EXERCICE \theexercice};
    \node[anchor=west,font=\bfseries\color{vrtencre}] at (e.east) {\ #1};
    \node[anchor=east,font=\small\color{vrtbleu}] at ([xshift=\linewidth-1pt]e.west) {#2};
    \draw[vrtbleu,line width=.6pt] (e.south west)--([xshift=\linewidth-1pt]e.south west);
  \end{tikzpicture}\par\smallskip}

\newcommand\partie[1]{\needspace{6\baselineskip}\par\medskip
  {\color{vrtbleu}\sffamily\bfseries\large #1}\par\smallskip}

% Encadré de document (texte, données…)
\newtcolorbox{support}[1][]{enhanced,colback=white,colframe=vrtcorps!40,boxrule=.5pt,arc=0pt,
  left=6pt,right=6pt,fontupper=\small,#1}

% ── Corrigé ────────────────────────────────────────────────────────────
\ifVRTcorrige
  \newtcolorbox{solution}{enhanced,breakable,colback=white,frame hidden,
    boxrule=0pt,arc=0pt,left=6pt,right=0pt,top=3pt,bottom=3pt,
    fontupper=\small,before skip=4pt,after skip=6pt}
  \newcommand\bareme[1]{\hfill{\color{vrtvert}\footnotesize\bfseries[#1]}}
\else
  \NewEnviron{solution}{}
  \newcommand\bareme[1]{}
\fi

% Figures : traits et repères assortis au texte
\tikzset{every picture/.append style={line cap=round,line join=round},
  figure/.style={line width=.7pt,color=vrtencre},
  point/.style={circle,fill=vrtencre,inner sep=1.1pt}}
\pgfplotsset{every axis/.append style={axis lines=middle,grid=both,
  grid style={vrtcorps!20,line width=.3pt},tick label style={font=\footnotesize},
  axis line style={-{Stealth[length=2mm]}}}}

% Corrigé rédigé d'un bloc après le sujet (épreuves séquentielles) :
% absent de l'énoncé, précédé d'un saut de page dans le corrigé.
\ifVRTcorrige
  \NewEnviron{corrige}{\clearpage
    \begin{center}{\color{vrtencre}\large\bfseries CORRIGÉ ET BARÈME}\par\smallskip
      {\color{vrtcorps!35}\rule{.3\linewidth}{.4pt}}\end{center}\par\BODY}
\else
  \NewEnviron{corrige}{}
\fi

% Points d'une question, poussés en fin de ligne
\newcommand\pts[1]{\unskip\nobreak\hfill\penalty50\hskip1em\null\nobreak\hfill
  {\color{vrtbleu}\small\bfseries #1}\parfillskip=0pt\par}
% Titre interne (« Exercice 2 (2,5 points) », « Situation », « Tâches »)
\newcommand\soustitre[1]{\par\needspace{4\baselineskip}\medskip
  {\color{vrtencre}\bfseries #1}\par\nopagebreak\smallskip}
% Symboles mathématiques écrits dans le texte (√, −, ≤, ℝ…) : police de maths
% de la même famille, pour qu'ils s'accordent au texte.
\newfontfamily\VRTsym{texgyretermes-math.otf}
\newcommand\sym[1]{{\VRTsym #1}}

% ── Griffe VÉRITAS : nos offres et nos contacts, en bas de la dernière page ─
\newcommand\griffe{%
  \par\needspace{8\baselineskip}\nopagebreak\vspace{14pt plus 1fill}\nopagebreak
  \noindent\begin{tcolorbox}[enhanced,colback=white,frame hidden,arc=0pt,
      borderline north={.4pt}{0pt}{vrtcorps!35},left=0pt,right=0pt,top=6pt,bottom=0pt,boxsep=0pt,
      fontupper=\footnotesize\color{vrtcorps}]
    \begin{tabularx}{\linewidth}{@{}X@{\hspace{10pt}}>{\raggedleft\arraybackslash}p{.36\linewidth}@{}}
      {\color{vrtencre}\normalsize\bfseries VÉRITAS EDUCATION}\newline
      {\color{vrtbleu}Centre d'Excellence Scolaire}\par\smallskip
      Préparation aux examens (BEPC, Probatoire, BAC, GCE)~· Préparation aux
      concours~· Cours à domicile et au centre~· Cours en ligne, épreuves et
      annales corrigées~· Orientation scolaire
      &
      {\color{vrtencre}\bfseries Nous contacter}\newline
      WhatsApp : 697~63~77~39\newline
      contact@veritas-school.com\newline
      {\color{vrtbleu}\bfseries veritas-school.com}
    \end{tabularx}
  \end{tcolorbox}\par}
% Posée AVANT les crochets de fin (lastpage y range son étiquette) : sinon la
% griffe se compte hors de « Page n / N ».
\let\VRT@finDocument\enddocument
\def\enddocument{\griffe\VRT@finDocument}

\AtBeginDocument{\color{vrtencre}}
\endinput
