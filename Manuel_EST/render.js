/* =====================================================================
   VÉRITAS — Manuel pédagogique « Ngum a Jemea » (David Mbanga Eyombwan)
   Moteur de rendu DOCX (A5) — théâtre — Centre VÉRITAS, Tle
   ===================================================================== */
const docx = require("docx");
const {
  Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
  AlignmentType, LevelFormat, BorderStyle, WidthType, ShadingType,
  HeadingLevel, TableOfContents, PageNumber, PageBreak, Header, Footer
} = docx;

/* ---------- Charte ---------- */
const FONT="Cambria", FONT_TIT="Cambria";
const BLEU="1F3864", BLEU_CLAIR="2E5496", OR="9C6B1B", GRIS_TXT="3B3B3B";
const FILL_TXT="F3F1EA";   // fond des extraits
const FILL_AST="DCE6F4";   // repère / astuce
const FILL_MET="FBEAD2";   // boîte à outils / méthode
const FILL_CUL="E7F0E1";   // culture
const FILL_OBJ="F3E6C6";   // objectif
const FILL_SAV="DAEEEC";   // le saviez-vous ?
const FILL_LEX="ECE7F3";   // lexique
const FILL_Q="F4F4F4", FILL_PLAN="EFEAF4";

/* ---------- Page A5 ---------- */
const A5_W=8391, A5_H=11906;
const MARG={ top:1080, bottom:1080, left:970, right:970 };
const CW=A5_W-MARG.left-MARG.right; // 6451

/* ---------- Helpers ---------- */
function runs(content, base){
  base=base||{};
  if(!Array.isArray(content)) content=[content];
  return content.map(c=>{
    if(typeof c==="string") return new TextRun(Object.assign({text:c}, base));
    const {t}=c, rest=Object.assign({}, base, c); delete rest.t;
    return new TextRun(Object.assign({text:t}, rest));
  });
}
function P(content, o){
  o=o||{};
  const op={ children: runs(content,{font:FONT,size:o.size||21,color:o.color||GRIS_TXT,bold:o.bold,italics:o.italics}),
    spacing:{ after:o.after!=null?o.after:120, before:o.before||0, line:o.line||264 } };
  if(o.justify) op.alignment=AlignmentType.JUSTIFIED;
  if(o.align) op.alignment=o.align;
  if(o.indent) op.indent=o.indent;
  return new Paragraph(op);
}
function spacer(h){ return new Paragraph({ children:[new TextRun("")], spacing:{after:h||80} }); }

function partTitle(num, titre){
  const k=[];
  k.push(new Paragraph({ pageBreakBefore:true, spacing:{before:480,after:60}, alignment:AlignmentType.CENTER,
    children:[ new TextRun({text:num, font:FONT_TIT, size:22, color:OR, bold:true, allCaps:true, characterSpacing:60}) ] }));
  k.push(new Paragraph({ heading:HeadingLevel.HEADING_1, alignment:AlignmentType.CENTER, spacing:{before:0,after:80},
    children:[ new TextRun({text:titre, font:FONT_TIT, size:36, color:BLEU, bold:true}) ] }));
  k.push(new Paragraph({ alignment:AlignmentType.CENTER, spacing:{after:240},
    border:{ bottom:{style:BorderStyle.SINGLE, size:12, color:OR, space:6} },
    children:[ new TextRun({text:"* * *", font:FONT_TIT, size:22, color:OR, bold:true, characterSpacing:40}) ] }));
  return k;
}
function H1c(titre){ // titre centré H1 sans numéro de partie (avant-propos…)
  return new Paragraph({ pageBreakBefore:true, heading:HeadingLevel.HEADING_1, alignment:AlignmentType.CENTER,
    children:[ new TextRun({text:titre, font:FONT_TIT, size:36, bold:true, color:BLEU}) ] });
}
function H2(titre){ return new Paragraph({ heading:HeadingLevel.HEADING_2, pageBreakBefore:true, spacing:{before:0,after:60},
  children:[ new TextRun({text:titre, font:FONT_TIT, size:28, bold:true, color:BLEU}) ] }); }
function H2nb(titre){ return new Paragraph({ heading:HeadingLevel.HEADING_2, spacing:{before:160,after:60},
  children:[ new TextRun({text:titre, font:FONT_TIT, size:28, bold:true, color:BLEU}) ] }); }
function H3(titre){ return new Paragraph({ heading:HeadingLevel.HEADING_3, keepNext:true, spacing:{before:160,after:40},
  children:[ new TextRun({text:titre, font:FONT_TIT, size:23, bold:true, color:BLEU_CLAIR}) ] }); }
function rubrique(txt){ return new Paragraph({ keepNext:true, spacing:{before:100,after:30},
  children:[ new TextRun({text:txt, font:FONT_TIT, size:21, bold:true, color:OR, allCaps:true, characterSpacing:20}) ] }); }

/* ---------- Bloc « texte » (extrait de théâtre) ---------- */
function proseBlock(items){
  const paras=[];
  items.forEach(it=>{
    if(typeof it==="string"){ // didascalie courte si entre parenthèses, sinon réplique simple
      if(/^\s*\(.*\)\s*$/.test(it)) it={d:it}; else it={t:it};
    }
    if(it.d){ paras.push(new Paragraph({ spacing:{after:50,line:250}, indent:{left:200,right:120},
      children:[ new TextRun({text:it.d, font:FONT, size:18, italics:true, color:"6B6B6B"}) ] })); }
    if(it.p){ paras.push(new Paragraph({ spacing:{before:70,after:8}, keepNext:true,
      children:[ new TextRun({text:it.p, font:FONT_TIT, size:18, bold:true, color:BLEU, allCaps:true, characterSpacing:20}),
                 it.pd? new TextRun({text:"  "+it.pd, font:FONT, size:17, italics:true, color:"6B6B6B"}) : new TextRun("") ] })); }
    if(it.t){ paras.push(new Paragraph({ spacing:{after:50,line:256}, alignment:AlignmentType.JUSTIFIED, indent:{left:180},
      children: runs(it.t,{font:FONT,size:20,color:"23252B"}) })); }
  });
  const cell=new TableCell({ width:{size:CW,type:WidthType.DXA}, shading:{fill:FILL_TXT,type:ShadingType.CLEAR},
    borders:{ left:{style:BorderStyle.SINGLE,size:18,color:OR}, top:{style:BorderStyle.NONE}, bottom:{style:BorderStyle.NONE}, right:{style:BorderStyle.NONE} },
    margins:{top:140,bottom:140,left:170,right:140}, children:paras });
  return new Table({ width:{size:CW,type:WidthType.DXA}, columnWidths:[CW], rows:[ new TableRow({children:[cell]}) ] });
}

/* ---------- Encadré ---------- */
function encadre(titre, corps, type){
  const map={
    methode:{fill:FILL_MET, accent:OR, badge:"BOÎTE À OUTILS"},
    culture:{fill:FILL_CUL, accent:"4F7A3A", badge:"CULTURE"},
    objectif:{fill:FILL_OBJ, accent:"9C6B1B", badge:"OBJECTIF PÉDAGOGIQUE"},
    saviez:{fill:FILL_SAV, accent:"2E7D77", badge:"LE SAVIEZ-VOUS ?"},
    repere:{fill:FILL_AST, accent:BLEU_CLAIR, badge:"REPÈRE"},
    astuce:{fill:FILL_AST, accent:BLEU_CLAIR, badge:"ASTUCE"},
  };
  const s=map[type]||map.repere;
  const inner=[];
  inner.push(new Paragraph({ spacing:{after:50},
    children:[ new TextRun({text:s.badge+"  ", font:FONT_TIT, size:16, bold:true, color:s.accent, allCaps:true, characterSpacing:30}),
               new TextRun({text:titre, font:FONT_TIT, size:21, bold:true, color:s.accent}) ] }));
  (Array.isArray(corps)?corps:[corps]).forEach(c=>{
    if(typeof c==="object" && c.li){
      inner.push(new Paragraph({ numbering:{reference:"box-bullets",level:0}, spacing:{after:30,line:252},
        children: runs(c.li,{font:FONT,size:20,color:GRIS_TXT}) }));
    } else {
      inner.push(new Paragraph({ spacing:{after:40,line:256}, alignment:AlignmentType.JUSTIFIED,
        children: runs(c,{font:FONT,size:20,color:GRIS_TXT}) }));
    }
  });
  const cell=new TableCell({ width:{size:CW,type:WidthType.DXA}, shading:{fill:s.fill,type:ShadingType.CLEAR},
    borders:{ top:{style:BorderStyle.SINGLE,size:4,color:s.accent}, bottom:{style:BorderStyle.SINGLE,size:4,color:s.accent},
              left:{style:BorderStyle.SINGLE,size:16,color:s.accent}, right:{style:BorderStyle.SINGLE,size:4,color:s.accent} },
    margins:{top:120,bottom:120,left:160,right:150}, children:inner });
  return new Table({ width:{size:CW,type:WidthType.DXA}, columnWidths:[CW], rows:[ new TableRow({children:[cell]}) ] });
}

/* ---------- Lexique (table 2 colonnes : Terme | Sens) ---------- */
function lexique(titre, entries){
  const COLS=[1850, CW-1850];
  const bd={style:BorderStyle.SINGLE,size:2,color:"C9C9C9"};
  const borders={top:bd,bottom:bd,left:bd,right:bd};
  function cell(content,w,o){ o=o||{};
    return new TableCell({ width:{size:w,type:WidthType.DXA}, borders,
      shading:o.fill?{fill:o.fill,type:ShadingType.CLEAR}:undefined,
      margins:{top:50,bottom:50,left:100,right:100}, verticalAlign:docx.VerticalAlign.CENTER,
      children:[ new Paragraph({ spacing:{after:0,line:236}, children: runs(content,{font:FONT,size:o.size||18,color:o.color||GRIS_TXT,bold:o.bold,italics:o.italics}) }) ] });
  }
  const head=new TableRow({ tableHeader:true, children:[
    cell(titre||"Terme",COLS[0],{fill:"2E7D77",color:"FFFFFF",bold:true,size:17}),
    cell("Sens / explication",COLS[1],{fill:"2E7D77",color:"FFFFFF",bold:true,size:17}),
  ]});
  const body=entries.map((e,i)=> new TableRow({ children:[
    cell(e.t,COLS[0],{bold:true,italics:true,color:BLEU_CLAIR,fill:(i%2)?"F4F1F8":null}),
    cell(e.d,COLS[1],{fill:(i%2)?"F4F1F8":null}),
  ]}));
  return new Table({ width:{size:CW,type:WidthType.DXA}, columnWidths:COLS, rows:[head,...body] });
}

/* ---------- Tableau d'analyse ---------- */
function analysisTable(rows){
  const COLS=[1120,1740,1740,1851];
  const bd={style:BorderStyle.SINGLE,size:2,color:"C9C9C9"};
  const borders={top:bd,bottom:bd,left:bd,right:bd};
  function cell(content,w,o){ o=o||{};
    return new TableCell({ width:{size:w,type:WidthType.DXA}, borders,
      shading:o.fill?{fill:o.fill,type:ShadingType.CLEAR}:undefined,
      margins:{top:50,bottom:50,left:90,right:90}, verticalAlign:docx.VerticalAlign.CENTER,
      children:[ new Paragraph({ spacing:{after:0,line:228}, children: runs(content,{font:FONT,size:o.size||17,color:o.color||GRIS_TXT,bold:o.bold,italics:o.italics}) }) ] });
  }
  const head=new TableRow({ tableHeader:true, children:[
    cell("Outil",COLS[0],{fill:BLEU,color:"FFFFFF",bold:true,size:16}),
    cell("Indice textuel",COLS[1],{fill:BLEU,color:"FFFFFF",bold:true,size:16}),
    cell("Analyse",COLS[2],{fill:BLEU,color:"FFFFFF",bold:true,size:16}),
    cell("Interprétation",COLS[3],{fill:BLEU,color:"FFFFFF",bold:true,size:16}),
  ]});
  const body=rows.map((r,i)=>{ const f=(i%2)?"F3F1EA":null;
    return new TableRow({ children:[
      cell(r.outil,COLS[0],{bold:true,color:BLEU_CLAIR,fill:f}),
      cell(r.indice,COLS[1],{italics:true,color:"23252B",fill:f}),
      cell(r.analyse,COLS[2],{fill:f}),
      cell(r.interpretation,COLS[3],{fill:f}),
    ]});
  });
  return new Table({ width:{size:CW,type:WidthType.DXA}, columnWidths:COLS, rows:[head,...body] });
}

/* ---------- Listes ---------- */
function bullets(items, ref){
  ref=ref||"bullets";
  return items.map(it=> new Paragraph({ numbering:{reference:ref,level:0}, spacing:{after:40,line:258}, alignment:AlignmentType.JUSTIFIED,
    children: runs(it,{font:FONT,size:21,color:GRIS_TXT}) }));
}

/* ---------- Questions ---------- */
function questions(fond, forme){
  const inner=[];
  inner.push(new Paragraph({ spacing:{after:40}, children:[ new TextRun({text:"Questions d’étude", font:FONT_TIT, size:21, bold:true, color:BLEU}) ] }));
  const block=(label,arr)=>{
    inner.push(new Paragraph({ spacing:{before:40,after:20}, children:[ new TextRun({text:label, font:FONT_TIT, size:20, bold:true, color:OR, italics:true}) ] }));
    arr.forEach(q=> inner.push(new Paragraph({ numbering:{reference:"q-numbers",level:0}, spacing:{after:26,line:252}, alignment:AlignmentType.JUSTIFIED,
      children: runs(q,{font:FONT,size:20,color:GRIS_TXT}) })));
  };
  block("Sur le fond (sens, personnages, thèmes)", fond);
  block("Sur la forme (procédés dramatiques, langue, style)", forme);
  const cell=new TableCell({ width:{size:CW,type:WidthType.DXA}, shading:{fill:FILL_Q,type:ShadingType.CLEAR},
    borders:{ top:{style:BorderStyle.DASHED,size:4,color:"BBBBBB"}, bottom:{style:BorderStyle.DASHED,size:4,color:"BBBBBB"},
              left:{style:BorderStyle.DASHED,size:4,color:"BBBBBB"}, right:{style:BorderStyle.DASHED,size:4,color:"BBBBBB"} },
    margins:{top:120,bottom:120,left:160,right:150}, children:inner });
  return new Table({ width:{size:CW,type:WidthType.DXA}, columnWidths:[CW], rows:[ new TableRow({children:[cell]}) ] });
}

/* ---------- Plan de commentaire ---------- */
function planBlock(plan){
  const inner=[];
  inner.push(new Paragraph({ spacing:{after:50}, children:[ new TextRun({text:"Proposition de plan de commentaire composé", font:FONT_TIT, size:21, bold:true, color:BLEU}) ] }));
  if(plan.amorce) inner.push(new Paragraph({ spacing:{after:60,line:254}, alignment:AlignmentType.JUSTIFIED,
    children:[ new TextRun({text:"Introduction — ", font:FONT, size:20, bold:true, color:OR}), ...runs(plan.amorce,{font:FONT,size:20,color:GRIS_TXT}) ] }));
  plan.parties.forEach(pt=>{
    inner.push(new Paragraph({ spacing:{before:60,after:24}, children:[ new TextRun({text:pt.titre, font:FONT_TIT, size:20, bold:true, color:BLEU_CLAIR}) ] }));
    (pt.sous||[]).forEach(s=> inner.push(new Paragraph({ indent:{left:240}, spacing:{after:22,line:250}, alignment:AlignmentType.JUSTIFIED,
      children: runs(s,{font:FONT,size:20,color:GRIS_TXT}) })));
  });
  if(plan.ouverture) inner.push(new Paragraph({ spacing:{before:60,after:0,line:254}, alignment:AlignmentType.JUSTIFIED,
    children:[ new TextRun({text:"Conclusion / ouverture — ", font:FONT, size:20, bold:true, color:OR}), ...runs(plan.ouverture,{font:FONT,size:20,color:GRIS_TXT}) ] }));
  const cell=new TableCell({ width:{size:CW,type:WidthType.DXA}, shading:{fill:FILL_PLAN,type:ShadingType.CLEAR},
    borders:{ top:{style:BorderStyle.SINGLE,size:4,color:"7B6BA8"}, bottom:{style:BorderStyle.SINGLE,size:4,color:"7B6BA8"},
              left:{style:BorderStyle.SINGLE,size:16,color:"7B6BA8"}, right:{style:BorderStyle.SINGLE,size:4,color:"7B6BA8"} },
    margins:{top:130,bottom:130,left:160,right:150}, children:inner });
  return new Table({ width:{size:CW,type:WidthType.DXA}, columnWidths:[CW], rows:[ new TableRow({children:[cell]}) ] });
}

/* ---------- Rendu d'un extrait étudié (objectif + 5 étapes) ---------- */
function renderExtrait(ex){
  const out=[];
  out.push(H2(ex.num+". "+ex.titre));
  if(ex.objectif) out.push(encadre("Objectif pédagogique", [ex.objectif], "objectif"));

  out.push(H3("Étape 1 — Situation de l’extrait"));
  if(ex.repere) out.push(new Paragraph({ spacing:{after:60}, children:[ new TextRun({text:ex.repere, font:FONT, size:20, italics:true, color:OR}) ] }));
  (ex.situation||[]).forEach(p=> out.push(P(p,{justify:true})));

  out.push(H3("Étape 2 — Le texte"));
  out.push(proseBlock(ex.texte));
  out.push(spacer(40));

  if(ex.hypotheses && ex.hypotheses.length){
    out.push(H3("Étape 3 — Observation et hypothèses de lecture"));
    ex.hypotheses.forEach(p=> out.push(P(p,{justify:true})));
  }

  out.push(H3("Étape 4 — Axes de lecture (fond et forme)"));
  if(ex.structure && ex.structure.length){
    out.push(rubrique("Mouvements de l’extrait"));
    ex.structure.forEach(m=> out.push(new Paragraph({ spacing:{after:40,line:258}, alignment:AlignmentType.JUSTIFIED, indent:{left:240},
      children:[ new TextRun({text:m.borne+" — ", font:FONT, size:20, bold:true, color:BLEU_CLAIR}), ...runs(m.desc,{font:FONT,size:20,color:GRIS_TXT}) ] })));
  }
  (ex.lecture||[]).forEach(ax=>{
    out.push(rubrique(ax.axe));
    ax.paras.forEach(p=> out.push(P(p,{justify:true})));
    if(ax.encadre) out.push(encadre(ax.encadre.titre, ax.encadre.corps, ax.encadre.type));
  });
  if(ex.tableau && ex.tableau.length){
    out.push(rubrique("Tableau d’analyse — outil · indice · analyse · interprétation"));
    out.push(analysisTable(ex.tableau)); out.push(spacer(40));
  }
  if(ex.encadres) ex.encadres.forEach(e=> out.push(encadre(e.titre, e.corps, e.type)));
  if(ex.lex) out.push(lexique(ex.lex.titre, ex.lex.entries));

  out.push(H3("Étape 5 — Bilan, questions et plan de commentaire"));
  if(ex.bilan) (Array.isArray(ex.bilan)?ex.bilan:[ex.bilan]).forEach(p=> out.push(P(p,{justify:true})));
  if(ex.questions) out.push(questions(ex.questions.fond, ex.questions.forme));
  if(ex.plan){ out.push(spacer(40)); out.push(planBlock(ex.plan)); }
  return out;
}

/* ---------- Rendu d'un modèle rédigé ---------- */
function renderModele(m){
  const out=[];
  out.push(H2(m.titre));
  if(m.consigne) out.push(encadre("Sujet", m.consigne, "methode"));
  if(m.chapeau) m.chapeau.forEach(p=> out.push(P(p,{justify:true,italics:true})));
  m.sections.forEach(s=>{
    if(s.h) out.push(H3(s.h));
    (s.paras||[]).forEach(p=> out.push(P(p,{justify:true})));
    if(s.encadre) out.push(encadre(s.encadre.titre, s.encadre.corps, s.encadre.type));
  });
  return out;
}

/* ---------- Assemblage ---------- */
function buildDoc(children, meta){
  meta = meta || {};
  const TITLE = meta.title || "Français — Enseignement Secondaire Scientifique & Technique";
  const HDR   = meta.header || TITLE;
  return new Document({
    creator:"Centre VÉRITAS — Jacques Miterand TAKOU",
    title:TITLE,
    description:meta.description || "Document pédagogique du Centre VÉRITAS (programme MINESEC)",
    styles:{ default:{ document:{ run:{ font:FONT, size:21, color:GRIS_TXT } } },
      paragraphStyles:[
        { id:"Heading1", name:"Heading 1", basedOn:"Normal", next:"Normal", quickFormat:true,
          run:{ font:FONT_TIT, size:36, bold:true, color:BLEU }, paragraph:{ spacing:{before:240,after:120}, outlineLevel:0 } },
        { id:"Heading2", name:"Heading 2", basedOn:"Normal", next:"Normal", quickFormat:true,
          run:{ font:FONT_TIT, size:28, bold:true, color:BLEU }, paragraph:{ spacing:{before:200,after:80}, outlineLevel:1 } },
        { id:"Heading3", name:"Heading 3", basedOn:"Normal", next:"Normal", quickFormat:true,
          run:{ font:FONT_TIT, size:23, bold:true, color:BLEU_CLAIR }, paragraph:{ spacing:{before:140,after:40}, outlineLevel:2 } },
      ] },
    numbering:{ config:[
      { reference:"bullets", levels:[{level:0,format:LevelFormat.BULLET,text:"•",alignment:AlignmentType.LEFT,style:{paragraph:{indent:{left:360,hanging:220}}}}] },
      { reference:"box-bullets", levels:[{level:0,format:LevelFormat.BULLET,text:"–",alignment:AlignmentType.LEFT,style:{paragraph:{indent:{left:300,hanging:200}}}}] },
      { reference:"numbers", levels:[{level:0,format:LevelFormat.DECIMAL,text:"%1.",alignment:AlignmentType.LEFT,style:{paragraph:{indent:{left:360,hanging:240}}}}] },
      { reference:"q-numbers", levels:[{level:0,format:LevelFormat.DECIMAL,text:"%1.",alignment:AlignmentType.LEFT,style:{paragraph:{indent:{left:320,hanging:240}}}}] },
    ] },
    sections:[{
      properties:{ page:{ size:{width:A5_W,height:A5_H}, margin:MARG } },
      headers:{ default:new Header({ children:[ new Paragraph({
        border:{ bottom:{style:BorderStyle.SINGLE,size:4,color:"C9B27A",space:4} },
        tabStops:[{type:docx.TabStopType.RIGHT, position:CW}],
        children:[ new TextRun({text:HDR, font:FONT, size:16, color:"8A8A8A", italics:true}),
                   new TextRun({text:"\tCentre VÉRITAS", font:FONT, size:16, color:"8A8A8A", italics:true}) ] }) ] }) },
      footers:{ default:new Footer({ children:[ new Paragraph({ alignment:AlignmentType.CENTER,
        children:[ new TextRun({text:"— ", font:FONT, size:18, color:"8A8A8A"}),
                   new TextRun({ children:[PageNumber.CURRENT], font:FONT, size:18, color:"8A8A8A"}),
                   new TextRun({text:" —", font:FONT, size:18, color:"8A8A8A"}) ] }) ] }) },
      children,
    }],
  });
}
function write(children, path, meta){ return Packer.toBuffer(buildDoc(children, meta)).then(buf=>require("fs").writeFileSync(path,buf)); }

module.exports = {
  docx, Paragraph, TextRun, PageBreak, AlignmentType, HeadingLevel, TableOfContents,
  P, spacer, partTitle, H1c, H2, H2nb, H3, rubrique, proseBlock, encadre, lexique,
  analysisTable, bullets, questions, planBlock, renderExtrait, renderModele, buildDoc, write, runs,
  FONT, FONT_TIT, BLEU, BLEU_CLAIR, OR, GRIS_TXT, CW,
};
