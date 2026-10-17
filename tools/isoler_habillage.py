#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
VÉRITAS — isoler l'habillage de la vitrine des feuilles de l'application
=======================================================================

tools/habiller_pages.py pose dans l'application (#VISITOR) la barre, le
bandeau, le pied et les bulles de la vitrine. Mais l'application porte ses
propres feuilles — app.css, theme-lws.css, veritas-refonte-app.css… — écrites
pour TOUT ce qui vit dans #VISITOR, souvent en `#VISITOR#VISITOR#VISITOR …
!important`. Mesuré le 17/10/2026, élément par élément contre la vitrine :
le pied passait de #001136 à #0C2A6A, la police de base de 16 à 17 px, les
pastilles du bandeau perdaient leurs capitales et leur filet, chaque bouton
de la barre prenait 44 px de haut et un rayon de 10 px. L'utilisateur voyait
« presque » la vitrine — exactement le déphasage qu'on voulait supprimer.

On n'empile pas de contre-règles : on EXCLUT l'habillage de ces feuilles.
Chaque sélecteur reçoit `:where(:not(.vrt-hab):not(.vrt-hab *))` sur son
sujet — spécificité nulle, donc la cascade de l'application ne bouge pas ;
seuls les éléments de l'habillage sortent de leur portée, et gardent les
styles de la vitrine (styles en ligne, veritas-habillage.css, thème sombre).

POURQUOI AU DÉPLOIEMENT, ET PAS AU CHARGEMENT. Réécrire les 4 494 règles dans
le navigateur coûte ~150 ms sur un ordinateur — plusieurs centaines sur un
téléphone d'entrée de gamme, à chaque visite. Ici, c'est fait une fois, sur
les copies de deploy/ : les sources restent lisibles, et une règle ajoutée
demain est couverte sans que personne n'ait à y penser.

Usage :
    python tools/isoler_habillage.py deploy        # CI, après habiller_pages
    python tools/isoler_habillage.py <dossier>     # essai local sur une copie
"""
import os
import re
import sys

# :where() — spécificité NULLE. Un :not() nu ajoutait (0,2,0) à toutes les
# règles réécrites, mais pas aux <style> que les fonctions de rendu écrivent
# dans la page : ceux-ci perdaient des duels qu'ils gagnaient. Mesuré le
# 17/10 sur « Pour vous, enseignant » : texte navy sur bandeau navy.
# Avec :where(), la cascade de l'application est exactement celle d'avant.
X = ':where(:not(.vrt-hab):not(.vrt-hab *))'

# At-rules dont le bloc contient des RÈGLES (on y descend) ; toutes les autres
# (@keyframes, @font-face, @page, @property…) contiennent des déclarations
# ou des sélecteurs d'images clés, qu'on recopie tels quels.
CONTENANTS = ('media', 'supports', 'container', 'layer', 'document', '-moz-document', 'scope')

PSEUDO_ELEMENT = re.compile(r'::|:(?:before|after|first-line|first-letter)\b', re.I)


def _decouper(sel, sep):
    """Découpe `sel` sur `sep` au niveau 0 (hors (), [], chaînes)."""
    parts, cur, d, q = [], '', 0, None
    for ch in sel:
        if q:
            cur += ch
            if ch == q:
                q = None
            continue
        if ch in '"\'':
            q = ch
        elif ch in '([':
            d += 1
        elif ch in ')]':
            d -= 1
        elif ch in sep and d == 0:
            parts.append(cur)
            cur = ''
            continue
        cur += ch
    parts.append(cur)
    return parts


def _sujet_debut(sel):
    """Indice où commence le DERNIER composé (après le dernier combinateur)."""
    d, q, debut = 0, None, 0
    i = 0
    while i < len(sel):
        ch = sel[i]
        if q:
            if ch == q:
                q = None
        elif ch in '"\'':
            q = ch
        elif ch in '([':
            d += 1
        elif ch in ')]':
            d -= 1
        elif d == 0 and ch in ' >+~\t\n':
            debut = i + 1
        i += 1
    return debut


def _au_niveau_zero(compose, motif):
    """Première occurrence de `motif` hors parenthèses dans `compose`."""
    d = 0
    for m in motif.finditer(compose):
        d = compose[:m.start()].count('(') - compose[:m.start()].count(')')
        if d == 0:
            return m.start()
    return -1


def isoler_selecteur(sel):
    s = sel.strip()
    if not s or ':not(.vrt-hab)' in s:
        return s
    debut = _sujet_debut(s)
    compose = s[debut:]
    p = _au_niveau_zero(compose, PSEUDO_ELEMENT)
    if p >= 0:
        return s[:debut] + compose[:p] + X + compose[p:]
    return s + X


def isoler_prelude(prelude):
    tete = prelude[:len(prelude) - len(prelude.lstrip())]
    corps = prelude.strip()
    if not corps:
        return prelude
    return tete + ', '.join(isoler_selecteur(p) for p in _decouper(corps, ','))


def isoler_css(css):
    out = []
    i, n = 0, len(css)
    pile = ['regles']          # 'regles' : on lit des préludes ; 'brut' : on recopie
    prelude = ''

    def vider_prelude():
        nonlocal prelude
        out.append(prelude)
        prelude = ''

    while i < n:
        ch = css[i]
        # Commentaires et chaînes : recopiés tels quels.
        if css.startswith('/*', i):
            j = css.find('*/', i + 2)
            j = n if j < 0 else j + 2
            if pile[-1] == 'regles':
                prelude += css[i:j]
            else:
                out.append(css[i:j])
            i = j
            continue
        if ch in '"\'':
            j = i + 1
            while j < n and css[j] != ch:
                j += 2 if css[j] == '\\' else 1
            j = min(j + 1, n)
            if pile[-1] == 'regles':
                prelude += css[i:j]
            else:
                out.append(css[i:j])
            i = j
            continue

        if pile[-1] == 'brut':
            out.append(ch)
            if ch == '{':
                pile.append('brut')
            elif ch == '}':
                pile.pop()
            i += 1
            continue

        # Contexte « règles »
        if ch == '{':
            p = prelude
            nu = re.sub(r'/\*[\s\S]*?\*/', '', p).strip()
            if nu.startswith('@'):
                nom = re.match(r'@([\w-]+)', nu)
                nom = nom.group(1).lower() if nom else ''
                out.append(p + '{')
                pile.append('regles' if nom in CONTENANTS else 'brut')
            else:
                # Les commentaires d'un prélude ne portent pas de virgule utile :
                # on les garde devant le sélecteur réécrit.
                coms = ''.join(re.findall(r'/\*[\s\S]*?\*/', p))
                sans = re.sub(r'/\*[\s\S]*?\*/', '', p)
                out.append(coms + isoler_prelude(sans) + '{')
                pile.append('brut')
            prelude = ''
            i += 1
            continue
        if ch == ';' and prelude.strip().startswith('@'):
            prelude += ch          # @import …; @charset …;
            vider_prelude()
            i += 1
            continue
        if ch == '}':
            vider_prelude()
            out.append('}')
            if len(pile) > 1:
                pile.pop()
            i += 1
            continue
        prelude += ch
        i += 1
    vider_prelude()
    return ''.join(out)


# ── Coquille de l'application ───────────────────────────────────────────────
STYLE = re.compile(r'(<style\b[^>]*>)([\s\S]*?)(</style>)', re.I)
BLOC_HAB = re.compile(r'<!--vrt-habillage:([a-z]+)-->[\s\S]*?<!--/vrt-habillage:\1-->')
FEUILLE = re.compile(r'<link\b[^>]*rel="stylesheet"[^>]*href="(/[^"?#]+\.css)', re.I)


def isoler_coquille(html):
    """Les <style> de la coquille, SAUF ceux de l'habillage (CSS_APP vise
    justement nav.vrt-hab, et ne doit pas s'exclure lui-même)."""
    zones = [(m.start(), m.end()) for m in BLOC_HAB.finditer(html)]

    def rep(m):
        if any(a <= m.start() < b for a, b in zones):
            return m.group(0)
        return m.group(1) + isoler_css(m.group(2)) + m.group(3)
    return STYLE.sub(rep, html)


def feuilles_de(html):
    """Les feuilles locales que charge la coquille, hors habillage."""
    vues = []
    for href in FEUILLE.findall(html):
        if 'veritas-habillage' in href or href in vues:
            continue
        vues.append(href)
    return vues


def main():
    args = [a for a in sys.argv[1:] if not a.startswith('--')]
    if not args:
        raise SystemExit('usage : python tools/isoler_habillage.py <dossier de déploiement>')
    base = os.path.abspath(args[0])
    coquille = os.path.join(base, 'app.html')
    if not os.path.exists(coquille):
        raise SystemExit('isoler_habillage : %s introuvable.' % coquille)
    html = open(coquille, encoding='utf-8', newline='').read()
    if 'class="vrt-hab' not in html:
        print('isoler_habillage : app.html ne porte pas l\'habillage — rien à isoler.')
        return

    neuf = isoler_coquille(html)
    if neuf != html:
        open(coquille, 'w', encoding='utf-8', newline='').write(neuf)
    n = 0
    for href in feuilles_de(html):
        chemin = os.path.join(base, href.lstrip('/'))
        if not os.path.exists(chemin):
            raise SystemExit('isoler_habillage : feuille %s absente du déploiement.' % href)
        css = open(chemin, encoding='utf-8', newline='').read()
        iso = isoler_css(css)
        # Garde : on n'a touché qu'aux sélecteurs — autant d'accolades, et
        # chaque règle a gardé ses déclarations.
        if iso.count('{') != css.count('{') or iso.count('}') != css.count('}'):
            raise SystemExit('isoler_habillage : %s — accolades déséquilibrées après réécriture.' % href)
        if iso != css:
            open(chemin, 'w', encoding='utf-8', newline='').write(iso)
            n += 1
    print('isoler_habillage : coquille + %d feuille(s) isolée(s) de l\'habillage.' % n)


if __name__ == '__main__':
    main()
