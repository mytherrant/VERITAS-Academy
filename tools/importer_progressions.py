"""Importe les progressions nationales de français (ESG et EST, 2026-2027)
dans l'Atelier, datées par le calendrier scolaire officiel.

Entrées
  - les deux fichiers Word compilés par Jacques (« Projets nationaux ESG.docx »,
    « Projets nationaux EST.docx ») : 6 séquences par classe, contenus semaine
    par semaine, tâche d'intégration (S4), évaluation (S5), remédiation (S6) ;
  - CALENDRIER_SCOLAIRE dans app.js (arrêté conjoint MINEDUB/MINESEC) : les six
    séquences officielles datées, les interruptions, les fériés, les journées.

Sortie
  plateforme/progressions.js — window.VRT_PROGRESSIONS = { calendrier, classes }.
  Fichier GÉNÉRÉ : ne pas le retoucher à la main, relancer ce script.

Les Word ne sont pas dans le dépôt (documents de travail) ; leur empreinte
sha1 est inscrite dans le module, pour savoir de quelle version il vient.

    python tools/importer_progressions.py "<ESG.docx>" "<EST.docx>"
    python tools/importer_progressions.py --calendrier-seul   (garde CI : recalcule
        le calendrier depuis app.js et vérifie qu'il est identique au module)
"""
import sys, io, os, re, json, zipfile, html, hashlib, subprocess, datetime

RACINE = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SORTIE = os.path.join(RACINE, 'plateforme', 'progressions.js')

# ── 1. Le calendrier, lu à la SOURCE (app.js) ──────────────────────────────
MOIS = {'jan': 1, 'janv': 1, 'janvier': 1, 'fev': 2, 'fevr': 2, 'fevrier': 2, 'mars': 3, 'avr': 4, 'avril': 4,
        'mai': 5, 'juin': 6, 'juil': 7, 'juillet': 7, 'aout': 8, 'sept': 9, 'septembre': 9, 'oct': 10, 'octobre': 10,
        'nov': 11, 'novembre': 11, 'dec': 12, 'decembre': 12}

def sans_accents(t):
    import unicodedata
    return ''.join(c for c in unicodedata.normalize('NFD', t) if unicodedata.category(c) != 'Mn')

def lire_calendrier_brut():
    """Le même découpage que tools/build_vitrine.js : commentaires de ligne
    retirés AVANT de compter les accolades (les apostrophes des commentaires
    passeraient pour des chaînes)."""
    src = io.open(os.path.join(RACINE, 'app.js'), encoding='utf-8').read()
    i = src.index('var CALENDRIER_SCOLAIRE={')
    brut = '\n'.join(l for l in src[i:i + 40000].split('\n') if not re.match(r'^\s*//', l))
    d = brut.index('{'); prof = 0; chaine = None; j = d
    while j < len(brut):
        c = brut[j]; p = brut[j - 1]
        if chaine:
            if c == chaine and p != '\\': chaine = None
        elif c in '\'"`': chaine = c
        elif c == '{': prof += 1
        elif c == '}':
            prof -= 1
            if not prof: j += 1; break
        j += 1
    js = 'process.stdout.write(JSON.stringify((' + brut[d:j] + ')))'
    out = subprocess.check_output(['node'], input=js.encode('utf-8'))
    return json.loads(out.decode('utf-8'))

def dates_fr(t, annee_defaut=None):
    """Toutes les dates d'une mention française : « Ven. 26 et lun. 29 Mars
    2027 » → deux dates ; « Du 14 Sept. au 12 Oct. 2026 » → intervalle."""
    s = sans_accents(t).lower()
    s = re.sub(r'\b1er\b', '1', s)
    an = re.findall(r'\b(20\d\d)\b', s)
    annee = int(an[-1]) if an else annee_defaut
    jetons = re.findall(r'\b(\d{1,2})\b\s*(?:(' + '|'.join(sorted(MOIS, key=len, reverse=True)) + r')\b\.?)?(?:\s*(20\d\d))?', s)
    res = []; mois_suivant = None
    for jj, mm, aa in reversed(jetons):          # on lit de droite à gauche : « 26 et 29 Mars » → mois de 29
        if mm: mois_suivant = MOIS[mm]
        if aa: annee = int(aa)
        if mois_suivant and annee:
            try: res.append(datetime.date(annee, mois_suivant, int(jj)))
            except ValueError: pass
    return list(reversed(res))

def iso(d): return d.isoformat()

def calendrier():
    c = lire_calendrier_brut()
    seqs = []
    for t in c['trimestres']:
        t0 = dates_fr(t['debut'])[0]; t1 = dates_fr(t['fin'])[0]
        def dans_trimestre(txt):
            # « 25 Jan » sans année : l'année qui place la date DANS le trimestre
            # (le 2e trimestre va du 30 nov. 2026 au 05 mars 2027).
            for y in (t0.year, t1.year):
                d = dates_fr(txt, y)[0]
                if t0 <= d <= t1: return d
            return dates_fr(txt, t0.year)[0]
        for s in t['seqs']:
            deb = dans_trimestre(s['debut'])
            fin = dans_trimestre(s['fin'])
            seqs.append({'num': s['num'], 'debut': iso(deb), 'fin': iso(fin), 'trimestre': t['num'], 'examens': s.get('examens', '')})
    vac = []
    for v in c['vacances']:
        d = dates_fr(v['debut']); f = dates_fr(v['fin'])
        if d and f: vac.append({'label': v['label'], 'debut': iso(d[0]), 'fin': iso(f[0])})
    fer = []
    for x in c['feries']:
        for d in dates_fr(x['date']):
            fer.append({'date': iso(d), 'nom': x['nom'], 'note': x.get('note', '')})
    jou = []
    for x in c['journees']:
        ds = dates_fr(x['date'])
        if not ds: continue
        e = {'date': iso(ds[0]), 'nom': x['nom']}
        if len(ds) > 1 and re.match(r'\s*du\b', sans_accents(x['date']).lower()): e['fin'] = iso(ds[-1])
        jou.append(e)
    exa = [{'nom': e['nom'], 'periode': e['date'], 'niveaux': e.get('niveaux', '')} for e in c.get('examens_nationaux', [])]
    return {'annee': c['annee'], 'version': c['version'], 'source': c['source'],
            'sequences': seqs, 'vacances': vac, 'feries': fer, 'journees': jou, 'examens': exa}

def semaines_de(seq, cal):
    """Les six semaines de travail d'une séquence : du lundi de son début, on
    saute toute semaine dont la majorité des jours de classe tombe en
    vacances. Les fériés sont notés sur la semaine où ils tombent."""
    d = datetime.date.fromisoformat(seq['debut']); fin = datetime.date.fromisoformat(seq['fin'])
    lundi = d - datetime.timedelta(days=d.weekday())
    vac = [(datetime.date.fromisoformat(v['debut']), datetime.date.fromisoformat(v['fin']), v['label']) for v in cal['vacances']]
    out = []
    while lundi <= fin and len(out) < 6:
        jours = [lundi + datetime.timedelta(days=k) for k in range(5)]
        en_vac = [j for j in jours if any(a < j < b for a, b, _ in vac)]
        if len(en_vac) >= 3:
            lundi += datetime.timedelta(days=7); continue
        vend = lundi + datetime.timedelta(days=4)
        f = [x['nom'] for x in cal['feries'] if lundi.isoformat() <= x['date'] <= vend.isoformat()]
        out.append({'debut': max(lundi, d).isoformat(), 'fin': min(vend, fin).isoformat(), 'feries': f})
        lundi += datetime.timedelta(days=7)
    return out

# ── 2. Les progressions, lues dans le Word ──────────────────────────────────
def blocs_docx(chemin):
    x = zipfile.ZipFile(chemin).read('word/document.xml').decode('utf-8')
    def texte(fr):
        fr = re.sub(r'<w:tab/>', ' ', fr); fr = re.sub(r'<w:br[^>]*/>', ' ', fr)
        # un paragraphe par ligne dans une cellule : on garde la séparation
        ps = re.findall(r'<w:p[ >].*?</w:p>', fr, flags=re.S) or [fr]
        t = '\n'.join(html.unescape(''.join(re.findall(r'<w:t[^>]*>([^<]*)</w:t>', q))).strip() for q in ps)
        return re.sub(r'[  ]+', ' ', t).strip()
    for m in re.finditer(r'<w:tbl>.*?</w:tbl>|<w:p[ >].*?</w:p>', x, flags=re.S):
        b = m.group(0)
        if b.startswith('<w:tbl>'):
            # tableaux imbriqués : on prend les lignes du tableau de premier niveau
            lignes = []
            for tr in re.findall(r'<w:tr[ >].*?</w:tr>', b, flags=re.S):
                lignes.append([texte(tc) for tc in re.findall(r'<w:tc>.*?</w:tc>', tr, flags=re.S)])
            yield ('t', lignes)
        else:
            t = texte(b)
            if t: yield ('p', t)

RE_SEQ = re.compile(r'S[ÉE]QUENCE\s+DIDACTIQUE\s*N\s*[°º o]?\s*(\d+)', re.I)
RE_SEM = re.compile(r'^\s*(?:S\s*(\d)\b|(\d)\s*(?:e|è|ème|eme|ère|ere|re|er)?\s*/?\s*semaine|(p)ère\s+semaine|(\d)\s*e\s*semaine)', re.I)

def num_semaine(c0):
    """Numéro de la semaine d'une ligne de tableau. Les documents portent des
    coquilles de saisie : « père semaine », « 1ière », « 1lère », « 5èmsemaine »,
    « ^ème semaine » (sans chiffre : -1 = la suivante de la précédente)."""
    c = c0.replace('\n', ' ').strip()
    m = re.match(r'^S\s*(\d)\b', c)
    if m: return int(m.group(1))
    t = re.sub(r'[^a-z0-9]', '', sans_accents(c).lower())
    m = re.match(r'^(\d)[a-z]{0,6}semaine', t)
    if m: return int(m.group(1))
    if t.startswith('peresemaine'): return 1
    if t in ('emesemaine', 'esemaine', 'eresemaine', 'emsemaine'): return -1
    return None

def nettoyer(t):
    t = re.sub(r'\s*\n\s*', ' ', t).strip()
    t = re.sub(r'\s+', ' ', t)
    return t.strip(' .;')

# Coquilles de saisie des Word, relevées dans l'Atelier le 21/10/2026 :
# « argumentati f1h », « subjoncti f », « circonstancielle s de »,
# « pronominau1h », « paragraphe () 1h ». Une lettre isolée détachée d'un
# mot long se recolle ; un volume horaire collé se décolle.
RECOLLER = re.compile(r'\b([A-Za-zÀ-ÿ]{5,}) ([sfx])(?=\s|\d|$|[,;)])')
DECOLLER = re.compile(r'([A-Za-zÀ-ÿ\)])(\d+\s*[hH])\b')
MOTS = {'pronominau ': 'pronominaux ', 'pronominau(': 'pronominaux (',
        # relevées le 21/10/2026 : une lettre détachée que la règle générale ne peut pas
        # recoller sans risque (« le », « e », « t » sont aussi des mots)
        'Villecruell e': 'Ville cruelle', 'socioculturel le': 'socioculturelle',
        'environnemen t': 'environnement'}

def nettoyer_contenu(t):
    t = nettoyer(t)
    t = RECOLLER.sub(r'\1\2', t)
    t = DECOLLER.sub(r'\1 \2', t)
    for a, b in MOTS.items(): t = t.replace(a, b)
    t = re.sub(r'\(\s*\)', '', t)
    t = re.sub(r'\s+', ' ', t).strip(' .;')
    return t

def cle_contenu(t):
    # deux saisies du même cours (« (1h) » / « 1h », « Dissertation: » /
    # « Dissertation : ») ne font qu'un contenu
    k = sans_accents(t).lower()
    k = re.sub(r'\(?\s*\d+\s*h\s*\)?', ' ', k)
    k = re.sub(r'\(hors horaire\)', ' ', k)
    return re.sub(r'[^a-z0-9]+', ' ', k).strip()

HEURE_SEULE = re.compile(r'^\(?\s*\d+\s*h\s*\)?$', re.I)

SAVOIR_ETRE = re.compile(r"l[’']observation|esprit critique|la curiosit|l[’']humilit", re.I)
SITUATIONS = re.compile(r'^\s*(?:\d+\s*[-.)]\s*)?(?:[ÉE]crire|Parler|Lire)\s*(?:/\s*\w+\s*)?pour\b', re.I)
OUTIL = re.compile(r'^(?:Enseignement des savoirs notionnels|Int[ée]gration|[ÉE]valuation|Compte[- ]?rendu.*|Apprentissage de l.int[ée]gration|Exemples? de t[âa]ches? d.int[ée]gration|X)$', re.I)

def type_semaine(n, texte):
    # Le canevas national est FIXE : S1-S3 ressources, S4 intégration, S5
    # évaluation, S6 compte rendu et remédiation. Le déduire des mots de la
    # ligne classait une S1 en « intégration » parce que sa colonne
    # « Exemples de situations d'intégration » portait le mot.
    return {4: 'integration', 5: 'evaluation', 6: 'remediation'}.get(n, 'ressources')

def cle_classe(lib, systeme):
    s = sans_accents(lib).lower()
    s = re.sub(r'\s+', ' ', s).strip()
    return systeme.lower() + '-' + re.sub(r'[^a-z0-9]+', '-', s).strip('-')

def atelier_de(lib, systeme):
    """La classe telle que l'Atelier la nomme, pour relier une épreuve à sa
    progression ; '' quand l'Atelier n'a pas d'équivalent exact."""
    s = sans_accents(lib).lower()
    for k, v in (('6', '6e'), ('5', '5e'), ('4', '4e'), ('3', '3e')):
        if re.match(r'^' + k + r'\s*(e|eme)\b', s) and 'annee' not in s: return v
    if 'seconde' in s or s.startswith('2nde'): return '2nde'
    if 'premiere' in s or s.startswith('1ere') and 'annee' not in s: return '1ère'
    if 'terminale' in s: return 'Terminale'
    return ''

def libelle_classe(brut):
    t = re.split(r'P[ÉE]RIODE|ANN[ÉE]E SCOLAIRE|Établissement|Etablissement|VOLUME', brut)[0]
    t = re.sub(r'\s+', ' ', t).strip(' :|.-')
    t = re.sub(r'^(?:NIVEAU|Classe|CLASSE|Niveau)\s*:?\s*', '', t).strip(' :|')
    return t

def joli_libelle(lib):
    """« 1ème Année TI » → « 1re année TI » ; « PREMIERE LITTERAIRE » →
    « Première littéraire » ; pluriels des en-têtes ramenés au singulier."""
    t = re.sub(r'\s+', ' ', lib).strip()
    if t.isupper() and len(t) > 4:
        t = t.lower()
    t = sans_accents_garde(t)
    t = re.sub(r'^1\s*(?:è|e)?\s*(?:me|re|ère|ere)?\s*(?=ann)', '1re ', t, flags=re.I)
    t = re.sub(r'^(\d)\s*(?:è|e)\s*(?:me)?\s*(?=ann)', r'\1e ', t, flags=re.I)
    t = re.sub(r'\bann[ée]e\s*', 'année ', t, flags=re.I).strip()
    t = re.sub(r'^(\d)\s*(?:ème|eme|e)$', r'\1e', t)
    t = re.sub(r'^(premi[eè]re|terminale|seconde)s\b', r'\1', t, flags=re.I)
    t = re.sub(r'\b(litt[ée]raire|scientifique)s\b', r'\1', t, flags=re.I)
    t = re.sub(r'(?i)^premiere', 'Première', t); t = re.sub(r'(?i)^seconde', 'Seconde', t); t = re.sub(r'(?i)^terminale', 'Terminale', t)
    t = re.sub(r'(?i)\blitteraire\b', 'littéraire', t)
    t = re.sub(r'(?i)\b(aca|acc|cg|fig|ses|stt|ti|bt|af|f)\b', lambda m: m.group(1).upper(), t)
    t = re.sub(r'\s*:\s*', ' ', t); t = re.sub(r'\s*-\s*', '-', t); t = re.sub(r'\s+', ' ', t).strip(' ,')
    return t[0].upper() + t[1:] if t else t

def sans_accents_garde(t):
    return t

def canon(lib):
    s = sans_accents(joli_libelle(lib)).lower()
    s = re.sub(r'[^a-z0-9]+', ' ', s).strip()
    s = re.sub(r'\b(\w{4,}?)s\b', r'\1', s)   # pluriels ; « SES » reste « ses »
    s = re.sub(r'\b(\d)(?:re|e)\b', r'\1', s)
    return s

def valide(lib):
    c = canon(lib)
    return bool(re.search(r'\b[3-6]\b$|annee|seconde|premiere|terminale', c))

def progressions(chemin, systeme):
    """Une CLASSE = une suite de séquences. Les mentions « NIVEAU » des
    documents portent des coquilles (« 1 », « 2ème Année » au milieu de la
    1re année…) : on ne s'y fie pas pour découper. Une nouvelle classe
    commence à l'en-tête « PROJET PÉDAGOGIQUE » ou dès qu'un numéro de
    séquence se répète ; son nom est celui que portent la MAJORITÉ de ses
    séquences."""
    runs = []; cur = None; seq = None; attendre = False
    def nouveau_run():
        nonlocal cur
        cur = {'labels': [], 'seqs': []}; runs.append(cur)
    for genre, b in blocs_docx(chemin):
        if genre == 'p':
            if re.match(r'^\s*PROJETS?\s+P[ÉE]DAGOGIQUES?\s+DES\s+CLASSES\s+DE', b, re.I):
                nouveau_run(); attendre = True; seq = None; continue
            m = RE_SEQ.search(b)
            if attendre and not m and not re.search(r'ANN[ÉE]E|D[ÉE]PARTEMENT|VOLUME|NIVEAU', b, re.I):
                cur['labels'].append(b); attendre = False; continue   # l'en-tête : 1 voix (il porte des coquilles)
            if m:
                n = int(m.group(1))
                if cur is None or any(s['num'] == n for s in cur['seqs']): nouveau_run()
                seq = {'num': n, 'module': '', 'competence': '', 'situations': [], 'semaines': [], 'integration': '', 'evaluation': ''}
                cur['seqs'].append(seq)
                mm = re.search(r'TITRE DU MODULE\s*:?\s*(.*)', b, re.I)
                if mm: seq['module'] = libelle_classe(mm.group(1))
                continue
            mm = re.match(r'^\s*(?:NIVEAU|Classe|CLASSE|Niveau)\s*:\s*(.+)', b)
            if mm:
                if cur is None: nouveau_run()
                cur['labels'] += [libelle_classe(mm.group(1))] * 2; continue   # « Classe : » de chaque séquence : 2 voix
            if seq is None: continue
            def suivante():
                # Une séquence sans en-tête « Séquence didactique N° » (coquille
                # des documents) : un nouveau titre de module ou une nouvelle
                # compétence, alors que la séquence courante a déjà ses semaines.
                nonlocal seq
                seq = {'num': seq['num'] + 1, 'module': '', 'competence': '', 'situations': [], 'semaines': [], 'integration': '', 'evaluation': ''}
                cur['seqs'].append(seq)
            mm = re.search(r'TITRE DU MODULE\s*:?\s*(.*)', b, re.I)
            if mm:
                if seq['module'] and seq['semaines']: suivante()
                seq['module'] = libelle_classe(mm.group(1)); continue
            mm = re.match(r'^\s*COMP[ÉE]TENCE ATTENDUE\s*:?\s*(.+)', b, re.I)
            if mm:
                if seq['competence'] and seq['semaines']: suivante()
                if not seq['competence']: seq['competence'] = nettoyer(mm.group(1))
                continue
            mm = re.match(r'^\s*Situations? possibles?\s*:?\s*(.+)', b, re.I)
            if mm and not seq['module']: seq['module'] = nettoyer(mm.group(1)); continue
        else:
            for row in b:
                if not row: continue
                if re.match(r'^\s*NIVEAU\s*:?\s*$', row[0], re.I) and len(row) > 1 and row[1]:
                    if cur is None: nouveau_run()
                    cur['labels'] += [row[1]]; attendre = False; continue
                if seq is None: continue
                n = num_semaine(row[0])
                if n is None: continue
                if n == -1: n = (seq['semaines'][-1]['n'] + 1) if seq['semaines'] else 1
                cells = [c for c in row[1:] if c and c.strip()]
                ty = type_semaine(n, ' '.join(row))
                contenus = []
                for c in cells:
                    c2 = nettoyer_contenu(c)
                    if not c2 or HEURE_SEULE.match(c2) or OUTIL.match(c2) or SAVOIR_ETRE.search(c2): continue
                    if SITUATIONS.match(c2):
                        for x in re.split(r'\s*(?=\d\s*[-.)]\s*(?:[ÉE]crire|Parler|Lire)\b)', c2):
                            x = nettoyer_contenu(re.sub(r'^\d\s*[-.)]\s*', '', x))
                            x = re.sub(r'\s*Exemples? de situations? d.int[ée]gration\s*$', '', x)
                            if x and x not in seq['situations']: seq['situations'].append(x)
                        continue
                    if any(cle_contenu(x) == cle_contenu(c2) for x in contenus): continue
                    contenus.append(c2)
                if ty == 'integration':
                    # la tâche : la cellule qui l'annonce, ou à défaut la plus longue
                    longs = [c for c in contenus if re.match(r'^(?:Int[ée]gration|T[âa]che|Expression [ée]crite)', c, re.I) or len(c) > 120]
                    if longs and not seq['integration']: seq['integration'] = max(longs, key=len)
                    contenus = [c for c in contenus if c not in longs]
                if ty == 'evaluation' and contenus and not seq['evaluation']:
                    seq['evaluation'] = ' ; '.join(contenus); contenus = []
                ex = next((s for s in seq['semaines'] if s['n'] == n), None)
                if ex: ex['contenus'] += [c for c in contenus if all(cle_contenu(c) != cle_contenu(x) for x in ex['contenus'])]
                else: seq['semaines'].append({'n': n, 'type': ty, 'contenus': contenus})
    classes = {}; ordre = []
    for r in runs:
        if not r['seqs']: continue
        labs = [l for l in r['labels'] if valide(l)]
        if not labs: continue
        votes = {}
        for l in labs: votes[canon(l)] = votes.get(canon(l), 0) + 1
        gagnant = max(votes, key=lambda k: (votes[k], len(k)))
        bruts = [joli_libelle(l) for l in labs if canon(l) == gagnant]
        lib = max(set(bruts), key=lambda x: (bruts.count(x), sum(ord(ch) > 127 for ch in x)))
        k = systeme.lower() + '-' + re.sub(r'\s+', '-', gagnant)
        if k not in classes:
            classes[k] = {'id': k, 'libelle': lib, 'systeme': systeme, 'atelier': atelier_de(lib, systeme), 'sequences': []}
            ordre.append(k)
        classes[k]['sequences'] += r['seqs']
    for k in ordre:
        par = {}
        for s in classes[k]['sequences']:
            s['semaines'].sort(key=lambda w: w['n'])
            if s['num'] not in par or len(json.dumps(s)) > len(json.dumps(par[s['num']])): par[s['num']] = s
        classes[k]['sequences'] = [par[n] for n in sorted(par)]
    return [classes[k] for k in ordre]

def sha1(p):
    return hashlib.sha1(open(p, 'rb').read()).hexdigest()[:12]

def generer(esg, est):
    cal = calendrier()
    classes = progressions(esg, 'ESG') + progressions(est, 'EST')
    seqcal = {s['num']: s for s in cal['sequences']}
    for c in classes:
        for s in c['sequences']:
            sc = seqcal.get(s['num'])
            if not sc: continue
            dates = semaines_de(sc, cal)
            for w in s['semaines']:
                if 1 <= w['n'] <= len(dates): w.update(dates[w['n'] - 1])
            s['debut'] = sc['debut']; s['fin'] = sc['fin']; s['trimestre'] = sc['trimestre']
    donnees = {'genere': 'tools/importer_progressions.py', 'annee': cal['annee'],
               'sources': {'ESG': os.path.basename(esg) + ' · sha1 ' + sha1(esg), 'EST': os.path.basename(est) + ' · sha1 ' + sha1(est),
                           'calendrier': cal['source']},
               'calendrier': cal, 'classes': classes}
    corps = json.dumps(donnees, ensure_ascii=False, separators=(',', ':'))
    entete = ('/* GÉNÉRÉ par tools/importer_progressions.py — ne pas éditer à la main.\n'
              '   Progressions nationales de français 2026-2027 (ESG, EST), datées par le\n'
              '   calendrier scolaire officiel (CALENDRIER_SCOLAIRE, app.js). */\n')
    js = entete + '(function (root) {\n  root.VRT_PROGRESSIONS = ' + corps + ';\n' \
         "  if (typeof module !== 'undefined' && module.exports) module.exports = root.VRT_PROGRESSIONS;\n" \
         "})(typeof window !== 'undefined' ? window : globalThis);\n"
    io.open(SORTIE, 'w', encoding='utf-8', newline='\n').write(js)
    return donnees

if __name__ == '__main__':
    if '--calendrier-seul' in sys.argv:
        src = io.open(SORTIE, encoding='utf-8').read()
        m = re.search(r'root\.VRT_PROGRESSIONS = (\{.*\});\n', src, re.S)
        actuel = json.loads(m.group(1))['calendrier']
        neuf = calendrier()
        if actuel != neuf:
            print('ÉCART : le calendrier du module ne suit plus CALENDRIER_SCOLAIRE (app.js). Relancer l\'import.')
            sys.exit(1)
        print('calendrier du module = CALENDRIER_SCOLAIRE (app.js)'); sys.exit(0)
    d = generer(sys.argv[1], sys.argv[2])
    print(len(d['classes']), 'classes ;', sum(len(c['sequences']) for c in d['classes']), 'séquences ;',
          os.path.getsize(SORTIE), 'octets')
