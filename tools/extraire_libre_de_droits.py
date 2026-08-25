# -*- coding: utf-8 -*-
"""Extrait le repertoire LIBRE DE DROITS du .docx vers le JSON servi par l'API.

Pourquoi ce second repertoire
-----------------------------
Le repertoire MINESEC (1 040 textes) puise dans la litterature contemporaine,
africaine et camerounaise : excellent pour la classe, mais chaque extrait y
reste PROTEGE. Celui-ci n'emploie que des oeuvres dont les droits
patrimoniaux sont eteints -- auteur mort avant 1956 ET ecrivant en francais
(aucune traduction : le traducteur est un auteur). Il est imprimable et
vendable sans redevance. L'audit amont le certifie : 0 auteur hors domaine
public, 0 traduction, 1003/1003 textes retrouves mot pour mot.

Forme d'une fiche
-----------------
    <cycle>     PREMIER CYCLE — Classes de 6e...
    <groupe>    Module 1 — La vie quotidienne
    <usage>     Corpus de lecon  (2 textes, 105-106 mots)
    TEXTE 1  ·  DESCRIPTIF  ·  106 mots  ·  3e
    <le texte integral, un ou plusieurs paragraphes>
    <Auteur, Titre>
    Faits de langue reperes : ...
    Comprehension : ...
    Exploitation : ...

Deux pieges payes cher sur le premier repertoire
------------------------------------------------
1. La boucle qui lit le corps d'une fiche doit s'arreter a la PREMIERE ligne
   etrangere. Sinon elle avale l'en-tete de cycle ou de sous-section qui
   suit, et le classement se fige sur la valeur precedente -- symptome : un
   seul cycle, deux usages sur cinq. Ici, le corps s'arrete a « Faits de
   langue » : la ligne juste avant est la reference, tout ce qui precede est
   le texte. C'est le seul repere qui ne depende d'aucune mise en forme.
2. La console Windows est en cp1252 : afficher un caractere accentue ou une
   lettre superieure (le « e » de 6e) leve UnicodeEncodeError et interrompt
   le script. On n'imprime QUE de l'ASCII ; le detail va dans un rapport
   UTF-8.

  python tools/extraire_libre_de_droits.py [chemin.docx]
"""
import html
import io
import json
import os
import re
import sys
import zipfile

RACINE = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DOCX = sys.argv[1] if len(sys.argv) > 1 else os.path.join(
    os.path.expanduser('~'), 'Desktop', 'Corpus',
    'Repertoire_corpus_LIBRE_DE_DROITS.docx')
SORTIE = os.path.join(RACINE, 'api', 'data', 'corpus_libre.json')
RAPPORT = os.path.join(RACINE, 'api', 'data', '_corpus_libre_rapport.txt')

RE_TETE = re.compile(r'^TEXTE\s+(\d+)\s*·\s*([A-ZÉÈÀÊÎÔÛÇ\'\- ]+?)\s*·\s*(\d+)\s*mots\s*·\s*(.+)$')
RE_CYCLE = re.compile(r'^(PREMIER CYCLE|SECOND CYCLE|ENSEIGNEMENT SECONDAIRE TECHNIQUE|FORMES ET TEXTES FONCTIONNELS)\b')
RE_GROUPE = re.compile(r'^((?:Module|Séquence|Axe)\s+(\d+)\s+—\s+.+)$')
# Les formes fonctionnelles n'ont pas de numero : « Le texte poétique », etc.
RE_FORME = re.compile(r'^(Le texte poétique|La lettre privée|La lettre officielle et administrative|Le texte informatif de presse|Le texte théâtral)\s*$')
RE_USAGE = re.compile(r'^(.+?)\s*\(\s*\d+\s+textes?,')
RE_FAITS = re.compile(r'^Faits de langue repérés\s*:\s*(.*)$')
RE_COMP = re.compile(r'^Compréhension\s*:\s*(.*)$')
RE_EXPL = re.compile(r'^Exploitation\s*:\s*(.*)$')


def paragraphes(chemin):
    z = zipfile.ZipFile(chemin)
    xml = z.read('word/document.xml').decode('utf-8')
    out = []
    for p in re.findall(r'<w:p[ >].*?</w:p>', xml, re.S):
        # Un <w:br/> ou <w:tab/> vaut un espace : sinon deux mots se collent.
        p = re.sub(r'<w:(?:br|tab)\s*/>', ' ', p)
        t = ''.join(re.findall(r'<w:t[^>]*>(.*?)</w:t>', p, re.S))
        out.append(re.sub(r'\s+', ' ', html.unescape(t)).strip())
    return out


def main():
    if not os.path.isfile(DOCX):
        print('KO  fichier introuvable :', DOCX.encode('ascii', 'replace').decode())
        return 1
    L = paragraphes(DOCX)

    cycle = groupe = usage = ''
    groupKind = ''
    groupNum = 0
    fiches = []
    alertes = []
    i = 0
    # PAS DE SAUT DU SOMMAIRE. La première tentative sautait tout ce qui
    # précède « TEXTE 1 » — or les en-têtes du CORPS (PREMIER CYCLE, puis
    # Module 1) se trouvent juste avant la première fiche : on les perdait,
    # et 300 fiches se retrouvaient sans cycle. Le sommaire porte les mêmes
    # en-têtes, mais aucune fiche ne le suit : les valeurs qu'il pose sont
    # écrasées par celles du corps avant qu'un seul texte ne soit lu.

    while i < len(L):
        ligne = L[i]
        if not ligne:
            i += 1
            continue

        m = RE_CYCLE.match(ligne)
        if m:
            cycle = m.group(1)
            i += 1
            continue
        m = RE_GROUPE.match(ligne)
        if m:
            groupe = m.group(1)
            groupKind = groupe.split()[0]
            groupNum = int(m.group(2))
            i += 1
            continue
        m = RE_FORME.match(ligne)
        if m:
            groupe = m.group(1)
            groupKind = 'Forme'
            groupNum = 0
            i += 1
            continue

        m = RE_TETE.match(ligne)
        if not m:
            # Une ligne « X (n textes, a-b mots) » annonce l'emploi qui suit.
            u = RE_USAGE.match(ligne)
            if u:
                usage = u.group(1).strip().lower()
            i += 1
            continue

        # ── Une fiche ────────────────────────────────────────────────────
        num, typ, mots, niveau = int(m.group(1)), m.group(2).strip(), int(m.group(3)), m.group(4).strip()
        i += 1
        corps = []
        # ARRET A LA PREMIERE LIGNE ETRANGERE (piège 1). « Faits de langue »
        # ferme le corps ; une tête de fiche ou de section le ferme aussi,
        # ce qui évite d'avaler tout le document si un bloc est incomplet.
        while i < len(L):
            l2 = L[i]
            if not l2:
                i += 1
                continue
            if RE_FAITS.match(l2) or RE_TETE.match(l2) or RE_CYCLE.match(l2) \
               or RE_GROUPE.match(l2) or RE_FORME.match(l2) or RE_USAGE.match(l2):
                break
            corps.append(l2)
            i += 1

        if len(corps) < 2:
            alertes.append('fiche %d : corps trop court (%d ligne(s))' % (num, len(corps)))
            continue
        reference = corps[-1]
        texte = ' '.join(corps[:-1]).strip()

        faits = comp = expl = ''
        for _ in range(3):
            if i >= len(L):
                break
            l3 = L[i]
            mf, mc, me = RE_FAITS.match(l3), RE_COMP.match(l3), RE_EXPL.match(l3)
            if mf:
                faits = mf.group(1).strip()
            elif mc:
                comp = mc.group(1).strip()
            elif me:
                expl = me.group(1).strip()
            else:
                break
            i += 1

        auteur, titre = (reference.split(',', 1) + [''])[:2]
        fiches.append({
            'n': num, 'type': typ, 'words': mots, 'level': niveau,
            'cycle': cycle, 'group': groupe, 'groupKind': groupKind,
            'groupNum': groupNum,
            'subkind': 'evaluation' if 'valuation' in usage else 'corpus',
            'usage': usage, 'text': texte, 'reference': reference,
            'author': auteur.strip(), 'title': titre.strip(),
            'faits': faits, 'comprehension': comp, 'exploitation': expl,
        })

    # ── Contrôles ────────────────────────────────────────────────────────
    if not fiches:
        print('KO  aucune fiche reconnue')
        return 1
    nums = [f['n'] for f in fiches]
    if len(set(nums)) != len(nums):
        alertes.append('numeros en double : %d fiches, %d numeros distincts'
                       % (len(nums), len(set(nums))))
    for f in fiches:
        reel = len(f['text'].split())
        # Le comptage du generateur peut differer d'un cheveu (apostrophes,
        # traits d'union) : on ne s'alarme qu'au-dela de 12 %.
        if f['words'] and abs(reel - f['words']) > max(8, f['words'] * 0.12):
            alertes.append('fiche %d : %d mots annonces, %d comptes' % (f['n'], f['words'], reel))
        if not f['text']:
            alertes.append('fiche %d : texte vide' % f['n'])
        if not f['cycle'] or not f['group']:
            alertes.append('fiche %d : classement incomplet (%s / %s)'
                           % (f['n'], f['cycle'] or '?', f['group'] or '?'))

    cycles = {}
    groupes = {}
    usages = {}
    types = {}
    for f in fiches:
        cycles[f['cycle']] = cycles.get(f['cycle'], 0) + 1
        groupes[f['group']] = groupes.get(f['group'], 0) + 1
        usages[f['usage']] = usages.get(f['usage'], 0) + 1
        types[f['type']] = types.get(f['type'], 0) + 1

    io.open(SORTIE, 'w', encoding='utf-8').write(
        json.dumps(fiches, ensure_ascii=False, separators=(',', ':')))

    lignes = ['RAPPORT D\'EXTRACTION — REPERTOIRE LIBRE DE DROITS', '=' * 60,
              'fiches extraites : %d' % len(fiches), '',
              'CYCLES']
    for k, v in sorted(cycles.items()):
        lignes.append('  %-45s %4d' % (k or '(vide)', v))
    lignes += ['', 'GROUPES (%d)' % len(groupes)]
    for k, v in sorted(groupes.items()):
        lignes.append('  %-45s %4d' % (k or '(vide)', v))
    lignes += ['', 'EMPLOIS (%d)' % len(usages)]
    for k, v in sorted(usages.items()):
        lignes.append('  %-45s %4d' % (k or '(vide)', v))
    lignes += ['', 'TYPES']
    for k, v in sorted(types.items()):
        lignes.append('  %-45s %4d' % (k, v))
    lignes += ['', 'ALERTES (%d)' % len(alertes)] + ['  ' + a for a in alertes[:60]]
    io.open(RAPPORT, 'w', encoding='utf-8').write('\n'.join(lignes))

    print('OK  %d fiches -> api/data/corpus_libre.json' % len(fiches))
    print('    cycles %d | groupes %d | emplois %d | types %d'
          % (len(cycles), len(groupes), len(usages), len(types)))
    print('    alertes : %d  (detail dans api/data/_corpus_libre_rapport.txt)' % len(alertes))
    return 0


if __name__ == '__main__':
    sys.exit(main())
