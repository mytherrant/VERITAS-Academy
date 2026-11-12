# -*- coding: utf-8 -*-
"""tools/philo_tex.py — LaTeX des livrets de philosophie -> HTML fidèle.

Module de tools/philo_livrets.py (qui l'appelle) ; utilisable seul :
    python tools/philo_tex.py <build_dir> <sortie.json> <niveau: tle|1ere>

Le corps (body.tex) est lu par un petit analyseur TeX : chaque macro du
préambule (main.tex) reçoit son équivalent HTML, dessiné par philo.css.
Sortie : une liste de sections {id, kind, num, titre, sous, couleur, html}
et un sommaire.
"""
import html as H
import json
import re
import sys

sys.stdout.reconfigure(encoding='utf-8')

# ───────────────────────────────────────────────────────────── couleurs
NAMED = {
    'ink': '1F2230', 'muted': '5F6472', 'acc': '7F2A4C', 'accfill': 'B03A6A',
    'hcol': '7F2A4C', 'tabodd': 'F4F4F7', 'tabeven': 'FFFFFF', 'rulec': 'C9CBD3',
    'dark': '1F2230', 'ulc': '8A3C22', 'hilite': 'FFF1B8', 'tagc': 'B7791F',
    'boxc': 'F4F4F7', 'tmpc': 'B7791F', 'calloutline': 'D19A2A', 'c1': 'C0532F',
    'c2': 'B7791F', 'c3': '6A4C9C', 'c4': '2D7D4F', 'c5': 'B03A6A', 'c6': '1D6A96',
    'c7': '1E7F78', 'paper': 'FFFFFF', 'cream': 'FFF5DA', 'tabline': 'C9B8A6',
    'white': 'FFFFFF', 'black': '000000', 'red': 'FF0000',
}


def hx(h):
    h = h.strip().lstrip('#')
    return tuple(int(h[i:i + 2], 16) for i in (0, 2, 4))


def tohex(rgb):
    return ''.join('%02X' % max(0, min(255, round(c))) for c in rgb)


def mix(a, b, p):
    """xcolor a!p!b : p % de a, le reste de b."""
    A, B = hx(a), hx(b)
    return tohex([A[i] * p / 100 + B[i] * (100 - p) / 100 for i in range(3)])


def color_expr(expr, C):
    """Évalue une expression xcolor : nom, nom!p, nom!p!nom2, [HTML]."""
    expr = expr.strip()
    parts = expr.split('!')
    base = C.get(parts[0], NAMED.get(parts[0]))
    if base is None:
        if re.fullmatch(r'[0-9A-Fa-f]{6}', parts[0]):
            base = parts[0].upper()
        else:
            return None
    i = 1
    while i < len(parts):
        p = float(parts[i])
        other = 'FFFFFF'
        if i + 1 < len(parts):
            o = parts[i + 1]
            other = C.get(o, NAMED.get(o, 'FFFFFF'))
            i += 2
        else:
            i += 1
        base = mix(base, other, p)
    return base


# ───────────────────────────────────────────────────────────── jetons
def tokenize(src):
    toks = []
    i, n = 0, len(src)
    buf = []

    def flush():
        if buf:
            toks.append(('t', ''.join(buf)))
            buf.clear()
    while i < n:
        c = src[i]
        if c == '\\':
            if i + 1 < n and src[i + 1].isalpha():
                j = i + 1
                while j < n and src[j].isalpha():
                    j += 1
                name = src[i + 1:j]
                if j < n and src[j] == '*' and name in ('vspace', 'hspace', 'section'):
                    j += 1
                flush()
                toks.append(('cs', name))
                # espaces après un mot de contrôle : avalées
                while j < n and src[j] in ' \t':
                    j += 1
                if j < n and src[j] == '\n':
                    # un seul retour à la ligne est aussi avalé (sauf ligne vide)
                    if not (j + 1 < n and src[j + 1] == '\n'):
                        j += 1
                i = j
                continue
            if i + 1 < n:
                d = src[i + 1]
                flush()
                if d == '\\':
                    toks.append(('cs', '\\'))
                elif d in '{}%&$#_ ':
                    buf.append(d)
                    i += 2
                    continue
                elif d == ',':
                    buf.append(' ')
                    i += 2
                    continue
                elif d == '-':
                    i += 2
                    continue
                elif d == '/':
                    i += 2
                    continue
                else:
                    toks.append(('cs', d))
                i += 2
                continue
        if c == '%':
            j = src.find('\n', i)
            i = n if j < 0 else j + 1
            continue
        if c in '{}&':
            flush()
            toks.append((c, c))
            i += 1
            continue
        if c == '~':
            buf.append(' ')
            i += 1
            continue
        if c == '\n':
            # ligne vide = paragraphe
            j = i
            nl = 0
            while j < n and src[j] in '\n \t':
                if src[j] == '\n':
                    nl += 1
                j += 1
            if nl >= 2:
                flush()
                toks.append(('par', ''))
            else:
                buf.append(' ')
            i = j
            continue
        buf.append(c)
        i += 1
    flush()
    return toks


class Stream:
    def __init__(self, toks):
        self.t = toks
        self.i = 0

    def eof(self):
        return self.i >= len(self.t)

    def peek(self):
        return self.t[self.i] if self.i < len(self.t) else (None, None)

    def next(self):
        tok = self.t[self.i]
        self.i += 1
        return tok

    def skip_ws(self):
        while not self.eof():
            k, v = self.peek()
            if k == 't' and v.strip() == '':
                self.i += 1
            else:
                break

    def group(self):
        """Argument obligatoire : liste de jetons (sans les accolades)."""
        self.skip_ws()
        k, v = self.next()
        if k != '{':
            if k == 't':
                # un seul caractère
                if len(v) > 1:
                    self.t.insert(self.i, ('t', v[1:]))
                return [('t', v[0])]
            return [(k, v)]
        out, d = [], 1
        while True:
            k, v = self.next()
            if k == '{':
                d += 1
            elif k == '}':
                d -= 1
                if d == 0:
                    return out
            out.append((k, v))

    def opt(self):
        """Argument optionnel [..] au niveau 0, ou None."""
        save = self.i
        k, v = self.peek()
        if k == 't' and v.startswith('['):
            out, d = [], 0
            # on reconstruit en texte en traversant les groupes
            first = True
            while not self.eof():
                k, v = self.next()
                if k == 't':
                    s = v[1:] if first else v
                    first = False
                    if d == 0 and ']' in s:
                        j = s.index(']')
                        if s[:j]:
                            out.append(('t', s[:j]))
                        rest = s[j + 1:]
                        if rest:
                            self.t.insert(self.i, ('t', rest))
                        return out
                    if s:
                        out.append(('t', s))
                    continue
                first = False
                if k == '{':
                    d += 1
                elif k == '}':
                    d -= 1
                out.append((k, v))
            self.i = save
        return None

    def raw(self, toks=None):
        return ''.join(v if k != 'cs' else '\\' + v for k, v in (toks if toks is not None else []))


def detok(toks):
    s = []
    for k, v in toks:
        if k == 'cs':
            s.append('\\' + v + ' ')
        else:
            s.append(v)
    return ''.join(s)


def plain(toks):
    """Texte brut d'un argument (pour titres, ancres)."""
    s = []
    for k, v in toks:
        if k == 't':
            s.append(v)
        elif k == 'cs' and v == 'ldots':
            s.append('…')
    return re.sub(r'\s+', ' ', ''.join(s)).strip()


def esc(s):
    return H.escape(s, quote=False)


MARQUE = '\x00SEC:%s\x00'
FA = {}  # codepoints utilisés (sous-ensemble de police)


def fai(code, regular=False):
    cp = int(code, 16)
    FA.setdefault('r' if regular else 's', set()).add(cp)
    return '<i class="fa%s" aria-hidden="true">&#x%X;</i>' % ('r' if regular else '', cp)


# ───────────────────────────────────────────────────────────── rendu
class R:
    def __init__(self, niveau):
        self.niveau = niveau
        self.C = {'hcol': '7F2A4C', 'acc': '7F2A4C', 'accfill': 'B03A6A',
                  'tagc': 'B7791F', 'boxc': 'F4F4F7', 'hilite': 'FFF1B8'}
        self.copyfont = 'dev'
        self.copytagc = '7B5DB5'
        self.chapkind = 'CHAPITRE'
        self.chapkindname = 'Chapitre'
        self.sections = []
        self.cur = None
        self.toc = []
        self.labels = {}
        self.unknown = {}
        self.nlines = 0
        self.cur = None
        self.new_section('front', '', 'Avant-propos', '', '')

    # -- sections
    def new_section(self, kind, num, titre, sous, couleur):
        """Ouvre une section. Le HTML n'y est PAS rangé ici : on pose une
        borne dans le flux (MARQUE), et le découpage se fait à la fin, sur le
        HTML complet — quelle que soit la profondeur d'imbrication LaTeX où
        le titre a été rencontré."""
        sid = 's%d' % (len(self.sections) + 1)
        self.cur = {'id': sid, 'kind': kind, 'num': num, 'titre': titre,
                    'sous': sous, 'couleur': couleur, 'parts': []}
        self.sections.append(self.cur)
        self.pending = sid
        return sid

    def emit(self, s):
        self.cur['parts'].append(s)

    def col(self, name):
        return self.C.get(name, NAMED.get(name, '1F2230'))

    # -- conversion d'une liste de jetons en HTML « en ligne »
    def inline(self, toks):
        out = Out(self)
        out.run(Stream(list(toks)), inline=True)
        return ''.join(out.buf) + ''.join(out.p)

    def block(self, toks):
        out = Out(self)
        out.run(Stream(list(toks)))
        return out.html()


class Out:
    """Accumule du HTML ; gère les paragraphes."""

    def __init__(self, r):
        self.r = r
        self.buf = []      # blocs terminés
        self.p = []        # paragraphe en cours
        self.pcls = ''

    def html(self):
        self.endp()
        return ''.join(self.buf)

    def add(self, s):
        self.p.append(s)

    def endp(self):
        txt = ''.join(self.p)
        if txt.strip():
            cls = (' class="%s"' % self.pcls) if self.pcls else ''
            self.buf.append('<p%s>%s</p>' % (cls, txt.strip()))
        self.p = []
        self.pcls = ''

    def blk(self, s):
        self.endp()
        self.buf.append(s)

    def borne(self):
        sid = getattr(self.r, 'pending', None)
        if sid:
            self.blk(MARQUE % sid)
            self.r.pending = None

    # ---------------------------------------------------------------
    def run(self, S, inline=False):
        r = self.r
        while not S.eof():
            k, v = S.next()
            if k == 't':
                self.add(esc(v))
            elif k == 'par':
                if inline:
                    self.add('<br>')
                else:
                    self.endp()
            elif k == '{':
                # groupe anonyme : on le rend en ligne
                S.i -= 1
                g = S.group()
                self.add(r.inline(g))
            elif k == '}':
                pass
            elif k == '&':
                self.add(' ')
            elif k == 'cs':
                self.macro(v, S, inline)

    def macro(self, name, S, inline):
        r = self.r
        C = r.C
        g = S.group
        # ---------- ignorées (mise en page papier)
        if name in ('needspace',):
            g()
            return
        if name in ('penalty',):
            # \penalty0
            k, v = S.peek()
            if k == 't':
                m = re.match(r'-?\d+', v)
                if m:
                    S.next()
                    if v[m.end():]:
                        S.t.insert(S.i, ('t', v[m.end():]))
            return
        if name in ('relax', 'nopagebreak', 'noindent', 'centering', 'raggedright',
                    'phantomsection', 'par', 'begingroup', 'endgroup', 'nobreak',
                    'hfill', 'null', 'allowbreak', 'selectfont', 'hline',
                    'arraybackslash', 'tabjust', 'textheight', 'baselineskip',
                    'linewidth', 'itshape'):
            if name == 'par' and not inline:
                self.endp()
            if name == 'hfill':
                self.add(' ')
            return
        if name in ('vspace', 'vspace*', 'addvspace'):
            g()
            return
        if name in ('setlength', 'arrayrulecolor', 'arrayrulewidth'):
            g()
            if name == 'setlength':
                g()
            return
        if name == 'label':
            lab = plain(g())
            self.add('<a id="%s"></a>' % anchor(lab))
            r.labels[lab] = r.cur['id']
            return
        if name == 'addtoc':
            lvl = plain(g())
            t = g()
            aid = 't%d' % (len(r.toc) + 1)
            r.toc.append({'niv': lvl, 'titre': plain_inline(r, t), 'sec': r.cur['id'], 'ancre': aid})
            self.add('<a id="%s"></a>' % aid)
            return
        if name in ('enspace', 'quad', 'qquad'):
            self.add(' ')
            return
        if name == '\\':
            o = S.opt()
            self.add('<br>')
            return
        if name == 'ldots':
            k, v = S.peek()
            if k == '{':
                S.group()
            self.add('…')
            return
        # ---------- couleurs
        if name == 'definecolor':
            nm = plain(g()); model = plain(g()); val = plain(g())
            if model == 'HTML':
                C[nm] = val.upper()
            return
        if name == 'setc':
            nm = plain(g()); val = plain(g())
            C[nm] = val.upper()
            return
        if name == 'colorlet':
            nm = plain(g()); ex = plain(g())
            c = color_expr(ex, C)
            if c:
                C[nm] = c
            return
        if name == 'def':
            k, v = S.next()   # \nom
            body = g()
            if k == 'cs':
                if v == 'copyfont':
                    f = detok(body)
                    r.copyfont = 'kalam' if 'kalam' in f else ('dev' if 'devfont' in f else 'rm')
                elif v == 'copytagc':
                    r.copytagc = plain(body)
                elif v == 'chapkind':
                    r.chapkind = plain(body)
                elif v == 'chapkindname':
                    r.chapkindname = plain(body)
            return
        if name in ('kalam', 'rmfamily', 'devfont', 'copyfont', 'copytagc', 'chapkind', 'chapkindname'):
            if name == 'chapkind':
                self.add(esc(r.chapkind))
            return
        if name == 'textcolor':
            o = S.opt()
            spec = plain(g())
            body = g()
            c = spec.upper() if o is not None else color_expr(spec, C)
            self.add('<span style="color:#%s">%s</span>' % (c or '1F2230', r.inline(body)))
            return
        if name == 'color':
            o = S.opt()
            g()
            return
        # ---------- typographie en ligne
        if name == 'textbf':
            self.add('<b>%s</b>' % r.inline(g()))
            return
        if name in ('textit', 'emph'):
            self.add('<i>%s</i>' % r.inline(g()))
            return
        if name == 'textsc':
            self.add('<span class="sc">%s</span>' % r.inline(g()))
            return
        if name == 'textsuperscript':
            self.add('<sup>%s</sup>' % r.inline(g()))
            return
        if name == 'ulw':
            self.add('<u class="ulw">%s</u>' % r.inline(g()))
            return
        if name == 'numlab':
            self.add('<span class="numlab" style="color:#%s">%s</span>' % (r.col('acc'), r.inline(g())))
            return
        if name == 'hnum':
            self.add('<span class="hnum">%s</span> ' % r.inline(g()))
            return
        if name == 'fai':
            self.add(fai(plain(g())))
            return
        if name == 'fair':
            self.add(fai(plain(g()), True))
            return
        if name in ('cbox', 'cbx'):
            self.add('<input type="checkbox" class="cb" style="color:#%s" aria-label="case à cocher">' % r.col('acc'))
            return
        if name == 'relpt':
            self.add('<span class="relpt" style="border-color:#%s"></span>' % r.col('acc'))
            return
        if name == 'dotline':
            self.add('<span class="dotline" contenteditable="true"></span>')
            return
        if name == 'pageref':
            lab = plain(g())
            self.add('<a class="pref" href="#%s" data-lab="%s">voir</a>' % (anchor(lab), esc(lab)))
            return
        if name == 'rule':
            o = S.opt(); w = plain(g()); h = plain(g())
            m = re.match(r'([\d.]+)mm', h)
            if m:
                self.add('<span style="display:inline-block;height:%.1fmm"></span>' % float(m.group(1)))
            return
        if name == 'rephead':
            self.add('<b class="rephead">%s</b>' % r.inline(g()))
            return
        if name == 'rephdr':
            self.add('')
            return
        if name == 'tabhead':
            self.add('<span class="th">%s</span>' % r.inline(g()))
            return
        if name == 'hdrcolor':
            self.add('<!--hdr:%s-->' % plain(g()))
            return
        if name == 'makebox':
            S.opt(); S.opt()
            self.add(r.inline(g()))
            return
        # ---------- titres
        if name == 'pagetitle':
            t = g()
            titre = plain_inline(r, t)
            if r.cur['parts'] or r.cur['kind'] != 'front':
                r.new_section('page', '', titre, '', r.col('accfill'))
            else:
                r.cur['titre'] = titre
            r.toc.append({'niv': 'section', 'titre': titre, 'sec': r.cur['id']})
            self.borne()
            self.blk('<h1 class="pagetitle" style="color:#%s">%s</h1>%s' % (r.col('accfill'), r.inline(t), ornament(r.col('hcol'))))
            return
        if name == 'hzero':
            g(); t = g()
            if re.search(r'Corrigés(\s+des|\s*$)', plain_inline(r, t)):
                r.new_section('corrige', '', 'Corrigés', '', r.col('acc'))
                r.toc.append({'niv': 'section', 'titre': 'Corrigés', 'sec': r.cur['id']})
                self.borne()
            self.blk('<h2 class="hzero" style="color:#%s">%s</h2>%s' % (r.col('hcol'), r.inline(t), ornament(r.col('hcol'))))
            return
        if name in ('hone', 'htwo', 'hthree'):
            ic = g(); t = g()
            if name == 'hone' and re.search(r'Corrigés\s+des', plain_inline(r, t)):
                r.new_section('corrige', '', 'Corrigés', '', r.col('acc'))
                r.toc.append({'niv': 'section', 'titre': 'Corrigés', 'sec': r.cur['id']})
                self.borne()
            lv = {'hone': 'h3', 'htwo': 'h4', 'hthree': 'h5'}[name]
            ich = r.inline(ic)
            self.blk('<%s class="%s" style="color:#%s">%s%s</%s>' % (
                lv, name, r.col('hcol'), ('<span class="hico">%s</span>' % ich) if ich.strip() else '',
                r.inline(t), lv))
            return
        if name == 'hprob':
            t = g()
            self.blk('%s<div class="hprob" style="background:#%s">%s</div>' % (ornament(r.col('hcol')), r.col('acc'), r.inline(t)))
            return
        if name == 'partpage':
            t = g(); d = g()
            titre = plain_inline(r, t)
            r.new_section('part', '', titre, '', r.col('dark'))
            r.C['acc'] = '7F2A4C'; r.C['accfill'] = 'B03A6A'; r.C['hcol'] = '7F2A4C'
            r.toc.append({'niv': 'part', 'titre': titre, 'sec': r.cur['id']})
            self.borne()
            self.blk('<div class="partpage"><div class="kick">VÉRITAS • LA RÉUSSITE ASSURÉE</div>'
                     '<div class="ptitle">%s</div><div class="pdesc">%s</div>%s</div>'
                     % (r.inline(t), r.inline(d), strip7()))
            return
        if name == 'chapbanner':
            hexc = plain(g()); num = plain(g()); t = g(); sub = g()
            acc = mix(hexc, '000000', 78)
            r.C['acc'] = acc; r.C['accfill'] = hexc; r.C['hcol'] = acc
            titre = plain_inline(r, t)
            r.new_section('chap', num, titre, plain_inline(r, sub), hexc)
            r.cur['genre'] = r.chapkindname
            r.toc.append({'niv': 'section', 'titre': '%s %s — %s' % (r.chapkindname, num, titre), 'sec': r.cur['id']})
            self.borne()
            self.blk('<div class="chapbanner" style="background:#%s"><div class="chnum" style="background:#%s">'
                     '<span>%s</span><b>%s</b></div><div class="chtxt"><div class="chtitle">%s</div>'
                     '<div class="chsub">%s</div></div></div>'
                     % (hexc, mix(hexc, '000000', 70), esc(r.chapkind), esc(num), r.inline(t), r.inline(sub)))
            return
        if name == 'authorbox':
            a = g(); nm = g(); w = g(); note = g()
            self.blk('<div class="authorbox" style="border-color:#%s;background:#%s"><div class="abk" style="color:#%s">ŒUVRE AU PROGRAMME · %s</div>'
                     '<div class="abname" style="color:#%s">%s</div>%s<div class="abw">%s</div><div class="abn">%s</div></div>'
                     % (r.col('acc'), r.col('boxc'), r.col('acc'), r.inline(a), r.col('hcol'), r.inline(nm), ornament(r.col('hcol')), r.inline(w), r.inline(note)))
            return
        if name == 'theselabel':
            bg = plain(g()); fg = plain(g()); t = g()
            self.blk('<div class="theselabel" style="background:#%s;color:#%s">%s %s</div>' % (bg, fg, fai('F0DA'), r.inline(t)))
            return
        if name == 'badge':
            c = plain(g()); t = g()
            self.blk('<div class="badgewrap"><span class="badge" style="background:#%s">%s</span></div>' % (c, r.inline(t)))
            return
        if name == 'tablesub':
            t = g()
            self.blk('<div class="tablesub" style="border-top-color:#%s;background:#%s;color:#%s">%s %s</div>'
                     % (r.col('acc'), mix(r.col('acc'), 'FFFFFF', 13), r.col('acc'), fai('F0DA'), r.inline(t).upper()))
            return
        if name == 'exo':
            c = plain(g()); ic = g(); num = g(); t = g()
            ich = r.inline(ic)
            self.blk('<div class="exo"><span class="exob" style="background:#%s">%s%s</span><div class="exot">%s</div></div>'
                     % (c, (ich + ' ') if ich.strip() else '', r.inline(num), r.inline(t)))
            return
        if name == 'qcm':
            t = g()
            self.blk('<label class="qcm"><input type="checkbox" class="cb" style="color:#%s"><span>%s</span></label>' % (r.col('acc'), r.inline(t)))
            return
        if name == 'subline':
            a = g(); b = g()
            self.blk('<div class="subline"><span class="sl">%s</span><div>%s</div></div>' % (r.inline(a), r.inline(b)))
            return
        if name == 'source':
            self.blk('<div class="source">%s</div>' % r.inline(g()))
            return
        if name == 'sepparts':
            self.blk('<hr class="sepparts" style="border-color:#%s">' % mix(r.col('hcol'), 'FFFFFF', 65))
            return
        if name == 'separgs':
            self.blk('<hr class="separgs">')
            return
        if name == 'isep':
            self.add('<hr class="isep">')
            return
        if name == 'ornament':
            self.blk(ornament(r.col('hcol')))
            return
        if name == 'lignes':
            n = int(plain(g()) or 1)
            self.blk(lignes(r, n))
            return
        if name == 'grillerep':
            items = [x.strip() for x in plain(g()).split(',')]
            self.blk('<div class="grillerep">%s</div>' % ''.join(
                '<div class="gcell"><span style="color:#%s">%s</span><input aria-label="réponse %s"></div>' % (r.col('acc'), esc(x), esc(x)) for x in items))
            return
        if name == 'chrono':
            n = int(plain(g()) or 1)
            boxes = ('<span class="charr" style="color:#%s">%s</span>' % (r.col('acc'), fai('F061'))).join(
                '<input class="chbox" style="border-color:#%s" aria-label="rang">' % r.col('acc') for _ in range(n))
            self.blk('<div class="chrono"><div class="chl" style="color:#%s">Ordre chronologique :</div><div class="chb">%s</div></div>' % (r.col('acc'), boxes))
            return
        if name == 'cocheliste':
            rows = split_rows(g())
            cells = []
            for row in rows:
                for cell in split_cells(row):
                    h = r.inline(cell).strip()
                    if h:
                        cells.append('<label class="coche">%s</label>' % h)
            self.blk('<div class="cocheliste" style="background:#%s">%s</div>' % (r.col('boxc'), ''.join(cells)))
            return
        if name == 'tabrow':
            self.blk(tabrow(r, g(), g(), g()))
            return
        if name in ('stackrow',):
            a = g(); b = g()
            self.blk('<div class="stackrow"><div class="srh" style="color:#%s;border-bottom-color:#%s">%s</div><div class="srb">%s</div></div>'
                     % (r.col('acc'), mix(r.col('acc'), 'FFFFFF', 35), r.inline(a), r.block(b)))
            return
        if name in ('copypar', 'copytrans'):
            lab = g(); t = g()
            self.blk('<div class="cpar%s"><span class="cplab" style="background:#%s">%s</span><div class="cptxt">%s</div></div>'
                     % (' trans' if name == 'copytrans' else '', r.col('acc'), r.inline(lab), r.inline(t)))
            return
        if name == 'copywrite':
            lab = g(); n = int(plain(g()) or 1)
            self.blk('<div class="cpar"><span class="cplab" style="background:#%s">%s</span><div class="cptxt">%s</div></div>'
                     % (r.col('acc'), r.inline(lab), lignes(r, n)))
            return
        if name == 'sautelignes':
            self.blk('<div class="saute" style="color:#%s">%s %s</div>' % (r.col('acc'), fai('F338'), r.inline(g())))
            return
        if name == 'copyintro':
            self.blk('<p class="copyintro">%s</p>' % r.inline(g()))
            return
        if name == 'corr':
            a = g(); b = g()
            self.blk('<p class="corr"><b style="color:#%s">%s</b> %s</p>' % (r.col('acc'), r.inline(a), r.inline(b)))
            return
        if name == 'bibsec':
            self.blk('<h4 class="bibsec" style="color:#%s">%s</h4>' % (r.col('acc'), r.inline(g())))
            return
        if name == 'bib':
            a = g(); b = g(); c = g()
            self.blk('<p class="bib"><b>%s</b>, <i>%s</i>, %s.</p>' % (r.inline(a), r.inline(b), r.inline(c)))
            return
        if name == 'item':
            o = S.opt()
            self.add('<!--item:%s-->' % (r.inline(o) if o is not None else ''))
            return
        if name == 'begin':
            env = plain(g())
            self.env(env, S)
            return
        if name == 'end':
            g()
            return
        if name in ('newcommand', 'renewcommand'):
            # définitions locales (biblio) : on saute
            k, v = S.next()
            if k == '{':
                S.i -= 1; S.group()
            while True:
                o = S.opt()
                if o is None:
                    break
            g()
            return
        if name in ('lato', 'nunb', 'bfseries', 'clearpage', 'fontsize', 'hangindent', 'hangafter',
                    'parskip', 'parindent', 'curmark', 'hrule'):
            if name == 'fontsize':
                g(); g()
            return
        r.unknown[name] = r.unknown.get(name, 0) + 1

    # ---------------------------------------------------------------
    def env(self, env, S):
        r = self.r
        body = take_env(S, env)
        if env == 'multicols':
            bs = Stream(body)
            bs.group()                      # {2}
            pre = bs.opt()
            if pre:
                self.endp()
                o = Out(r); o.run(Stream(pre)); self.blk(o.html())
            o = Out(r); o.run(bs); self.blk(o.html())
            return
        if env in ('puces', 'numeros'):
            self.blk(liste(r, body, env))
            return
        if env in ('callout', 'notebox', 'citebox', 'orientation'):
            bs = Stream(body)
            tag = None
            if env in ('callout', 'notebox'):
                o = bs.opt()
                if o:
                    m = re.search(r'tag=\{(.*)\}', detok(o), re.S)
                    if m:
                        tag = r.inline(tokenize(m.group(1)))
            bg = r.col('cream') if env == 'callout' else r.col('boxc')
            inner = Out(r); inner.run(bs)
            tagh = ''
            if tag:
                tagh = '<span class="tag" style="background:#%s">%s</span>' % (r.col('tagc'), tag)
            if env == 'orientation':
                tagh = '<span class="tag" style="background:#%s">%s ORIENTATION</span>' % (r.col('acc'), fai('F14E'))
            self.blk('<div class="box %s%s" style="background:#%s">%s%s</div>' % (
                env, ' tagged' if tagh else '', bg, tagh, inner.html()))
            return
        if env == 'texte':
            bs = Stream(body); bs.opt()
            inner = Out(r); inner.run(bs)
            self.blk('<div class="texte" style="border-top-color:#%s"><span class="quo" style="color:#%s">%s</span>%s</div>'
                     % (mix(r.col('acc'), 'FFFFFF', 55), mix(r.col('acc'), 'FFFFFF', 45), fai('F10D'), inner.html()))
            return
        if env == 'stacktab':
            bs = Stream(body)
            a = bs.group(); b = bs.group()
            inner = Out(r); inner.run(bs)
            self.blk('<div class="stacktab"><div class="sth" style="background:#%s">%s / %s</div>%s</div>'
                     % (r.col('tagc'), r.inline(a), r.inline(b), inner.html()))
            return
        if env == 'tabbloc':
            bs = Stream(body); bs.opt()
            inner = Out(r); inner.run(bs)
            self.blk('<div class="tabbloc">%s</div>' % inner.html())
            return
        if env == 'copie':
            bs = Stream(body)
            t = bs.opt()
            inner = Out(r); inner.run(bs)
            head = ''
            if t:
                head = '<div class="badgewrap"><span class="badge" style="background:#%s">%s</span></div>' % (r.copytagc, r.inline(t))
            self.blk('%s<div class="copie f-%s">%s</div>' % (head, r.copyfont, inner.html()))
            return
        if env in ('relierwide', 'relier'):
            bs = Stream(body)
            a = bs.group(); b = bs.group()
            rest = body[bs.i:]
            rows = split_rows(rest)
            hh = ''
            if plain(a) or plain(b):
                hh = '<div class="rel rh" style="color:#%s"><div>%s</div><div></div><div></div><div></div><div>%s</div></div>' % (r.col('acc'), r.inline(a), r.inline(b))
            body_rows = []
            for row in rows:
                cells = split_cells(row)
                if not any(plain(c) or detok(c).strip() for c in cells):
                    continue
                cells = (cells + [[]] * 5)[:5]
                body_rows.append('<div class="rel">%s</div>' % ''.join('<div>%s</div>' % r.inline(c) for c in cells))
            self.blk('<div class="relier">%s%s</div>' % (hh, ''.join(body_rows)))
            return
        if env == 'tabularx':
            bs = Stream(body)
            bs.group(); spec = bs.group()
            rows = split_rows(body[bs.i:])
            trs = []
            for row in rows:
                cells = split_cells(row)
                if not any(detok(c).strip() for c in cells):
                    continue
                hdr = any(k == 'cs' and v == 'rephdr' for c in cells for k, v in c)
                m = re.search(r'\\rule\s*\{0pt\}\{([\d.]+)mm\}', detok(row))
                if m:
                    trs.append('<tr style="height:%smm">%s</tr>' % (m.group(1), ''.join('<td></td>' for _ in cells)))
                    continue
                trs.append('<tr%s>%s</tr>' % (' class="rh" style="background:#%s"' % r.col('acc') if hdr else '',
                                              ''.join('<td>%s</td>' % r.inline(c) for c in cells)))
            self.blk('<table class="tabx">%s</table>' % ''.join(trs))
            return
        if env == 'corriges':
            inner = Out(r); inner.run(Stream(body))
            self.blk('<div class="corriges">%s</div>' % inner.html())
            return
        if env in ('center',):
            inner = Out(r); inner.run(Stream(body))
            self.blk('<div style="text-align:center">%s</div>' % inner.html())
            return
        r.unknown['env:' + env] = r.unknown.get('env:' + env, 0) + 1
        inner = Out(r); inner.run(Stream(body)); self.blk(inner.html())


def take_env(S, env):
    out, d = [], 1
    while not S.eof():
        k, v = S.next()
        if k == 'cs' and v in ('begin', 'end'):
            save = S.i
            nm = plain(S.group())
            if nm == env:
                d += 1 if v == 'begin' else -1
                if d == 0:
                    return out
            out.append((k, v)); out.append(('{', '{')); out.extend(tokenize(nm)); out.append(('}', '}'))
            continue
        out.append((k, v))
    return out


def split_top(toks, sep):
    res, cur, d = [], [], 0
    i = 0
    while i < len(toks):
        k, v = toks[i]
        if k == '{':
            d += 1
        elif k == '}':
            d -= 1
        if d == 0 and sep(k, v):
            res.append(cur); cur = []
            # avaler un [..] après \\
            if k == 'cs' and v == '\\' and i + 1 < len(toks) and toks[i + 1][0] == 't' and toks[i + 1][1].startswith('['):
                s = toks[i + 1][1]
                j = s.find(']')
                if j >= 0:
                    rest = s[j + 1:]
                    toks = toks[:i + 1] + ([('t', rest)] if rest else []) + toks[i + 2:]
            i += 1
            continue
        cur.append((k, v))
        i += 1
    res.append(cur)
    return res


def split_rows(toks):
    return split_top(toks, lambda k, v: k == 'cs' and v == '\\')


def split_cells(toks):
    return split_top(toks, lambda k, v: k == '&')


def plain_inline(r, toks):
    h = r.inline(toks)
    t = re.sub(r'<[^>]+>', '', h)
    return H.unescape(re.sub(r'\s+', ' ', t)).strip()


def anchor(lab):
    return 'L-' + re.sub(r'[^A-Za-z0-9_-]', '_', lab)


def ornament(c):
    return '<div class="ornament" style="--o:#%s"><i></i><b></b><i></i></div>' % mix(c, 'FFFFFF', 55)


def strip7():
    return '<div class="strip7">%s</div>' % ''.join('<i style="background:#%s"></i>' % NAMED['c%d' % i] for i in range(1, 8))


def lignes(r, n):
    r.nlines += 1
    return '<textarea class="lignes" rows="%d" data-k="%s-%d" aria-label="Ta réponse" spellcheck="true"></textarea>' % (n, r.cur['id'], r.nlines)


def liste(r, body, env):
    # découpe sur \item
    items, cur, d = [], None, 0
    for k, v in body:
        if k == '{':
            d += 1
        elif k == '}':
            d -= 1
        if d == 0 and k == 'cs' and v == 'item':
            cur = []
            items.append(cur)
            continue
        if cur is not None:
            cur.append((k, v))
    lis = []
    for it in items:
        S = Stream(it)
        lab = S.opt()
        o = Out(r); o.run(S)
        inner = o.html()
        # un paragraphe unique : on le met en ligne
        m = re.fullmatch(r'<p>(.*)</p>', inner, re.S)
        if m and '<p' not in m.group(1):
            inner = m.group(1)
        if env == 'puces':
            lis.append('<li><span class="pu" style="color:#%s">%s</span><div>%s</div></li>' % (r.col('acc'), fai('F111'), inner))
        else:
            lis.append('<li><span class="nu">%s</span><div>%s</div></li>' % (r.inline(lab) if lab else '', inner))
    return '<ul class="%s">%s</ul>' % (env, ''.join(lis))


def colspec(spec):
    r"""Colonnes d'un \tabrow : poids X (\hsize=…) ou largeurs fixes, alignement."""
    s = detok(spec)
    cols, i, pre = [], 0, ''

    def grp(j):
        d, k = 0, j
        while k < len(s):
            if s[k] == '{':
                d += 1
            elif s[k] == '}':
                d -= 1
                if d == 0:
                    return s[j + 1:k], k + 1
            k += 1
        return s[j + 1:], len(s)
    while i < len(s):
        c = s[i]
        if c in '!@' and i + 1 < len(s) and s[i + 1] == '{':
            _, i = grp(i + 1)
            continue
        if c == '>' and i + 1 < len(s) and s[i + 1] == '{':
            pre, i = grp(i + 1)
            continue
        if c in 'mp' and i + 1 < len(s) and s[i + 1] == '{':
            w, i = grp(i + 1)
            w = w.replace(' ', '')
            w = w if re.match(r'[\d.]+(em|mm|cm|pt)$', w) else '1fr'
            cols.append((w, 'c' if 'centering' in pre else ''))
            pre = ''
            continue
        if c in 'Xclr':
            if c == 'X':
                hs = re.search(r'hsize\s*=\s*([\d.]+)', pre)
                w = '%.3ffr' % (float(hs.group(1)) if hs else 1.0)
            else:
                w = 'auto'
            cols.append((w, 'c' if ('centering' in pre or c == 'c') else ''))
            pre = ''
        i += 1
    return cols


def tabrow(r, rowc, spec, cells):
    rc = plain(rowc)
    cols = colspec(spec)
    cs = split_cells(cells)
    hdr = None
    html_cells = []
    for i, c in enumerate(cs):
        h = r.inline(c).strip()
        m = re.search(r'<!--hdr:([0-9A-Fa-f]{6})-->', h)
        if m:
            hdr = m.group(1)
            h = h.replace(m.group(0), '')
        al = cols[i][1] if i < len(cols) else ''
        html_cells.append('<div class="td%s">%s</div>' % (' c' if al else '', h))
    tpl = ' '.join(w for w, _ in cols) if len(cols) == len(cs) else ' '.join(['1fr'] * len(cs))
    bg = ''
    if rc == 'hdr':
        bg = '#' + (hdr or r.col('acc'))
        cls = 'tr hdr'
    else:
        bg = '#' + NAMED.get(rc, 'FFFFFF') if rc else ''
        cls = 'tr'
    return '<div class="%s" style="grid-template-columns:%s;%s">%s</div>' % (
        cls, tpl, ('background:%s' % bg) if bg else '', ''.join(html_cells))


def convertir(build, niveau):
    r = R(niveau)
    r.pending = None
    morceaux = []
    for f in ('body.tex', 'biblio.tex'):
        src = open(build + '/' + f, encoding='utf-8').read()
        o = Out(r)
        if f == 'biblio.tex':
            r.new_section('biblio', '', 'Bibliographie des titres phares', '', r.col('acc'))
            o.borne()
        o.run(Stream(tokenize(src)))
        morceaux.append(o.html())
    flux = ''.join(morceaux)
    # découpage aux bornes ; ce qui précède la première va à l'avant-propos
    parts = re.split('\x00SEC:(s\\d+)\x00', flux)
    par_id = {r.sections[0]['id']: parts[0]}
    for k in range(1, len(parts), 2):
        par_id[parts[k]] = par_id.get(parts[k], '') + parts[k + 1]
    secs = []
    for s in r.sections:
        h = par_id.get(s['id'], '')
        # une borne posée au milieu d'un paragraphe le coupe : on recolle
        h = re.sub(r'<p>\s*</p>', '', h)
        if not re.sub(r'<a id="[^"]*"></a>', '', h).strip():
            continue
        secs.append({k: s.get(k, '') for k in ('id', 'kind', 'num', 'titre', 'sous', 'couleur', 'genre')} | {'html': h})
    return r, secs


def run_one(o, S):
    """Traite UN élément de premier niveau (pour savoir à quelle section il va)."""
    k, v = S.next()
    if k == 't':
        o.add(esc(v))
    elif k == 'par':
        o.endp()
    elif k == '{':
        S.i -= 1
        o.add(o.r.inline(S.group()))
    elif k == 'cs':
        o.macro(v, S, False)


if __name__ == '__main__':
    build, sortie, niveau = sys.argv[1], sys.argv[2], sys.argv[3]
    r, secs = convertir(build, niveau)
    json.dump({'sections': secs, 'toc': r.toc, 'labels': r.labels,
               'fa': {k: sorted(v) for k, v in FA.items()}}, open(sortie, 'w', encoding='utf-8'), ensure_ascii=False)
    print('sections', len(secs), 'toc', len(r.toc), 'inconnues', r.unknown)
    print('taille html', sum(len(s['html']) for s in secs))
