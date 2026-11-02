"""Banc de l'API VÉRITAS Gestion (étape 1) — isolement des centres, rôles, règles, idempotence."""
import json, re, sys, urllib.request, urllib.error

B = sys.argv[1] if len(sys.argv) > 1 else "http://127.0.0.1:8000/api"
JETON_INSTALL = "jeton-local-de-test-0123456789"
echecs = []

def req(route, corps=None, jeton=None, fichier="index.php"):
    url = f"{B}/{fichier}" + (f"?r={route}" if route else "")
    data = json.dumps(corps).encode("utf-8") if corps is not None else None
    r = urllib.request.Request(url, data=data, method="POST" if data else "GET")
    r.add_header("Content-Type", "application/json")
    if jeton: r.add_header("Authorization", "Bearer " + jeton)
    try:
        with urllib.request.urlopen(r) as rep: return rep.status, json.loads(rep.read())
    except urllib.error.HTTPError as e: return e.code, json.loads(e.read() or b"{}")

def verifier(nom, cond, detail=""):
    print(("  OK   " if cond else "  ÉCHEC ") + nom + ("" if cond else f"  → {detail}"))
    if not cond: echecs.append(nom)

def connexion(ident, mdp):
    c, r = req("auth/connexion", {"identifiant": ident, "mdp": mdp, "appareil": "banc"})
    assert c == 200, r
    return r["session"]["jeton"]

req(None, {"jeton": JETON_INSTALL, "action": "installer"}, fichier="install.php")
req(None, {"jeton": JETON_INSTALL, "action": "admin", "identifiant": "jacques", "mdp": "MotDePasse-Test-2026", "nom": "Jacques"}, fichier="install.php")
adm = connexion("jacques", "MotDePasse-Test-2026")
_, t = req("sync/tirer", jeton=adm)
centres = {c["nom_court"]: c["id"] for c in t["lignes"]["centres"]}
A, Bc = centres["Ndog-passi III"], centres["Ndog-passi II"]
# Au moins les deux centres d'origine (d'autres peuvent avoir été ouverts depuis).
verifier("admin voit les deux centres d'origine", len(centres) >= 2, centres)

def compte(jeton, ident, nom, acces, admin=False):
    return req("comptes/enregistrer", {"identifiant": ident, "nom": nom, "admin_global": admin,
                                       "acces": [{"centre_id": c, "role": r} for c, r in acces]}, jeton)

# Comptes déjà créés lors d'un passage précédent : on réinitialise leur mot de passe.
_, lst = req("comptes", jeton=adm)
exist = {c["identifiant"]: c["id"] for c in lst["comptes"]}
def mdp_de(ident, nom, acces):
    if ident in exist: return req("comptes/mdp", {"id": exist[ident]}, adm)[1]["mdp"]
    c, r = compte(adm, ident, nom, acces); assert c == 200, r; return r["mdp"]

respA = connexion("resp.a", mdp_de("resp.a", "Responsable Ndog-passi III", [(A, "responsable")]))
actA  = connexion("action.a", mdp_de("action.a", "Actionnaire Élodie", [(A, "actionnaire")]))
secB  = connexion("sec.b", mdp_de("sec.b", "Secrétaire Béatrice", [(Bc, "secretaire")]))

_, t = req("sync/tirer", jeton=respA)
verifier("responsable A ne voit que A", [c["id"] for c in t["lignes"]["centres"]] == [A], t["lignes"]["centres"])
_, t = req("sync/tirer", jeton=secB)
verifier("secrétaire B ne voit que B", [c["id"] for c in t["lignes"]["centres"]] == [Bc])
verifier("secrétaire B ne lit pas les actionnaires", "actionnaires" not in t["lignes"] or t["lignes"]["actionnaires"] == [])

c, r = compte(respA, "intrus.b", "Intrus", [(Bc, "secretaire")])
verifier("responsable A ne peut pas créer de compte dans B", c == 403, r)
c, r = compte(respA, "resp.a2", "Second responsable", [(A, "responsable")])
verifier("responsable A ne peut pas créer de responsable", c == 403, r)
c, r = compte(respA, "admin2", "Faux admin", [(A, "secretaire")], admin=True)
verifier("responsable A ne peut pas créer d'admin", c == 403, r)
c, r = compte(respA, "sec.a." + str(len(exist)), "Secrétaire Aïcha", [(A, "secretaire")])
verifier("responsable A crée une secrétaire dans A", c == 200 and r.get("mdp"), r)
c, r = req("comptes", jeton=secB)
verifier("une secrétaire ne liste pas les comptes", c == 403, r)
c, r = req("journal", jeton=secB)
verifier("une secrétaire ne lit pas le journal", c == 403, r)
c, r = req("journal", {"centre": Bc}, jeton=respA)
verifier("responsable A ne lit pas le journal de B", c == 403 or all(l["centre_id"] != Bc for l in r.get("lignes", [])), r)

import uuid
op = lambda: "op-" + uuid.uuid4().hex[:20]
_, r = req("sync/pousser", {"ops": [{"op": op(), "t": "centres", "id": A, "champs": {"nom": "Pirate"}}]}, respA)
verifier("responsable ne modifie pas la fiche centre", r["resultats"][0]["ok"] is False, r)
idJ, idX = "act-" + uuid.uuid4().hex[:12], "act-" + uuid.uuid4().hex[:12]
o1 = op()
# On repart d'un centre B sans actionnaire pour un test reproductible.
_, t = req("sync/tirer", jeton=adm)
nettoyage = [{"op": op(), "t": "actionnaires", "id": a["id"], "suppr": True}
             for a in t["lignes"].get("actionnaires", []) if a["centre_id"] == Bc and not int(a["supprime"])]
if nettoyage: req("sync/pousser", {"ops": nettoyage}, adm)
_, r = req("sync/pousser", {"ops": [
    {"op": o1, "t": "actionnaires", "id": idJ, "champs": {"centre_id": Bc, "nom": "Jacques", "part_centiemes": 6000}},
    {"op": op(), "t": "actionnaires", "id": idX, "champs": {"centre_id": Bc, "nom": "Associé", "part_centiemes": 5000}},
    {"op": o1, "t": "actionnaires", "id": idJ, "champs": {"centre_id": Bc, "nom": "Jacques", "part_centiemes": 6000}},
]}, adm)
res = r["resultats"]
verifier("part de 60 % acceptée", res[0]["ok"] is True, res)
verifier("total > 100 % refusé", res[1]["ok"] is False and "100" in res[1].get("erreur", ""), res)
verifier("opération rejouée appliquée une seule fois", res[2].get("deja") is True, res)
_, r = req("sync/pousser", {"ops": [{"op": op(), "t": "actionnaires", "id": idJ, "champs": {"part_centiemes": 4000}}]}, secB)
verifier("secrétaire B ne modifie pas les parts", r["resultats"][0]["ok"] is False, r)

_, t = req("sync/tirer", jeton=actA)
verifier("actionnaire A ne voit pas les parts de B", all(a["centre_id"] == A for a in t["lignes"].get("actionnaires", [])))
rev = t["rev"]
_, t2 = req("sync/tirer", {"depuis": rev + 10_000_000}, jeton=adm)
verifier("tirage incrémental : rien de neuf après la révision", all(not v for v in t2["lignes"].values()), t2)

c, r = req("moi")
verifier("sans jeton : 401", c == 401)
c, r = req("auth/connexion", {"identifiant": "inconnu." + uuid.uuid4().hex[:6], "mdp": "faux"})  # pas « jacques » : on ne verrouille pas le compte du banc
verifier("mauvais mot de passe : 401", c == 401)
r2 = urllib.request.Request(f"{B}/index.php?r=moi/mdp", data="{ pas du json".encode(), method="POST")
r2.add_header("Content-Type", "application/json"); r2.add_header("Authorization", "Bearer " + adm)
try: urllib.request.urlopen(r2); code = 200
except urllib.error.HTTPError as e: code = e.code
verifier("JSON illisible : 400 explicite", code == 400)

# Révocation : la session d'un compte désactivé tombe immédiatement.
_, lst = req("comptes", jeton=adm)
idB = next(c["id"] for c in lst["comptes"] if c["identifiant"] == "sec.b")
req("comptes/enregistrer", {"id": idB, "identifiant": "sec.b", "nom": "Secrétaire Béatrice", "actif": False,
                            "acces": [{"centre_id": Bc, "role": "secretaire"}]}, adm)
c, _ = req("moi", jeton=secB)
verifier("compte désactivé : session coupée", c == 401, c)
req("comptes/enregistrer", {"id": idB, "identifiant": "sec.b", "nom": "Secrétaire Béatrice", "actif": True,
                            "acces": [{"centre_id": Bc, "role": "secretaire"}]}, adm)

# ── Matières et emploi du temps (demande du 02/11/2026) ──
_, t = req("sync/tirer", jeton=adm)
mat = {m["nom"]: m["id"] for m in t["lignes"].get("matieres", [])}
verifier("matières usuelles installées", "Mathématiques" in mat and "Physique" in mat, list(mat)[:5])
_, lst = req("comptes", jeton=adm)
exist = {c["identifiant"]: c["id"] for c in lst["comptes"]}
ens_id = exist.get("prof.maths", "")
c, r = req("comptes/enregistrer", {"id": ens_id, "identifiant": "prof.maths", "nom": "Essomba Paul", "matieres": [mat["Mathématiques"], mat["Physique"]],
                                   "acces": [{"centre_id": A, "role": "enseignant"}, {"centre_id": Bc, "role": "enseignant"}]}, adm)
verifier("compte enseignant avec matières", c == 200, r)
ens_id = ens_id or r["id"]
c, r = req("comptes/enregistrer", {"identifiant": "prof.x" + uuid.uuid4().hex[:4], "nom": "X", "matieres": ["inexistante"],
                                   "acces": [{"centre_id": A, "role": "enseignant"}]}, adm)
verifier("matière inconnue refusée", c == 422, r)
_, lst = req("comptes", jeton=adm)
verifier("les matières reviennent dans la liste des comptes",
         sorted(next(u for u in lst["comptes"] if u["id"] == ens_id)["matieres"]) == sorted([mat["Mathématiques"], mat["Physique"]]))

clA, clB = "cl-" + uuid.uuid4().hex[:12], "cl-" + uuid.uuid4().hex[:12]
_, r = req("sync/pousser", {"ops": [{"op": op(), "t": "classes", "id": clA, "champs": {"centre_id": A, "nom": "1ère C " + clA[-4:], "niveau": "1ère"}}]}, actA)
verifier("un actionnaire crée une classe dans SON centre", r["resultats"][0]["ok"] is True, r)
_, r = req("sync/pousser", {"ops": [{"op": op(), "t": "classes", "id": "cl-" + uuid.uuid4().hex[:12], "champs": {"centre_id": A, "nom": "1ÈRE c " + clA[-4:].upper()}}]}, adm)
verifier("nom de classe en double refusé", r["resultats"][0]["ok"] is False, r)
_, r = req("sync/pousser", {"ops": [{"op": op(), "t": "classes", "id": clB, "champs": {"centre_id": Bc, "nom": "Tle D"}}]}, actA)
verifier("un actionnaire ne crée rien dans l'autre centre", r["resultats"][0]["ok"] is False, r)
req("sync/pousser", {"ops": [{"op": op(), "t": "classes", "id": clB, "champs": {"centre_id": Bc, "nom": "Tle D " + clB[-4:]}}]}, adm)
secB = connexion("sec.b", req("comptes/mdp", {"id": idB}, adm)[1]["mdp"])
_, r = req("sync/pousser", {"ops": [{"op": op(), "t": "classes", "id": "cl-" + uuid.uuid4().hex[:12], "champs": {"centre_id": Bc, "nom": "Intrus"}}]}, secB)
verifier("une secrétaire ne modifie pas l'emploi du temps", r["resultats"][0]["ok"] is False, r)

# Départ propre : on retire les créneaux laissés par les passages précédents (enseignant et classes du banc).
_, t = req("sync/tirer", jeton=adm)
vieux = [{"op": op(), "t": "creneaux", "id": c["id"], "suppr": True} for c in t["lignes"].get("creneaux", [])
         if not int(c["supprime"]) and c["enseignant_id"] == ens_id]
if vieux: req("sync/pousser", {"ops": vieux}, adm)
# Un jour et une heure tirés au hasard : le banc se rejoue sans heurter ses propres créneaux.
jour = 1 + int(uuid.uuid4().hex[:2], 16) % 7
base = int(uuid.uuid4().hex[:2], 16) % 13
h = lambda x: f"{x:02d}:{'30' if base % 2 else '15'}"
def cr(cid, cl, debut, fin, ens):
    return {"op": op(), "t": "creneaux", "id": "cr-" + uuid.uuid4().hex[:12],
            "champs": {"centre_id": cid, "classe_id": cl, "matiere_id": mat["Mathématiques"], "enseignant_id": ens,
                       "jour": jour, "debut": debut, "fin": fin, "salle": "S1"}}
_, r = req("sync/pousser", {"ops": [
    cr(A, clA, h(base), h(base + 2), ens_id),           # 0 accepté
    cr(A, clA, h(base + 1), h(base + 3), ""),           # 1 même classe, chevauchement → refus
    cr(Bc, clB, h(base + 1), h(base + 2), ens_id),      # 2 même enseignant dans l'AUTRE centre → refus
    cr(Bc, clB, h(base + 2), h(base + 4), ens_id),      # 3 bout à bout → accepté
    cr(A, clA, h(base + 5), h(base + 4), ""),           # 4 fin avant début → refus
    cr(A, clB, h(base + 6), h(base + 7), ""),           # 5 classe d'un autre centre → refus
    cr(A, clA, h(base + 6), h(base + 7), idB),          # 6 pas enseignant → refus
]}, adm)
res = r["resultats"]
verifier("créneau valide accepté", res[0]["ok"] is True, res[0])
verifier("classe déjà en cours : refus explicite", res[1]["ok"] is False and "déjà cours" in res[1].get("erreur", ""), res[1])
verifier("enseignant déjà pris dans l'AUTRE centre : refus", res[2]["ok"] is False and "déjà pris" in res[2].get("erreur", ""), res[2])
verifier("créneaux bout à bout acceptés", res[3]["ok"] is True, res[3])
verifier("heures à l'envers refusées", res[4]["ok"] is False, res[4])
verifier("classe d'un autre centre refusée", res[5]["ok"] is False, res[5])
verifier("non-enseignant refusé comme enseignant", res[6]["ok"] is False, res[6])
_, r = req("sync/pousser", {"ops": [cr(A, clA, h(base + 8), h(base + 9), ens_id)]}, actA)
verifier("un actionnaire pose un créneau dans son centre", r["resultats"][0]["ok"] is True, r)

_, t = req("sync/tirer", jeton=secB)
eq = t.get("equipe", [])
verifier("équipe synchronisée : centre B seulement", bool(eq) and all(e["centre_id"] == Bc for e in eq), eq[:2])
verifier("équipe : ni téléphone ni identifiant", all("tel" not in e and "identifiant" not in e for e in eq))
verifier("secrétaire B ne voit pas les créneaux de A", all(c["centre_id"] == Bc for c in t["lignes"].get("creneaux", [])))

# ── Inscriptions (étape 2) ──
suffixe = uuid.uuid4().hex[:5].upper()
el1, el2, el3, el4 = ("el-" + uuid.uuid4().hex[:12] for _ in range(4))
fiche = lambda cid, cl, nom, pre, **x: dict({"centre_id": cid, "classe_id": cl, "nom": nom, "prenoms": pre}, **x)
_, r = req("sync/pousser", {"ops": [
    {"op": op(), "t": "eleves", "id": el1, "champs": fiche(Bc, clB, "NDONGO" + suffixe, "Clarisse", sexe="F", parent_nom="M. Ndongo", parent_tel="+237 697 63 77 39")},
    {"op": op(), "t": "eleves", "id": el2, "champs": fiche(Bc, clB, "ndongo" + suffixe.lower(), "CLARISSE")},                       # doublon → refus
    {"op": op(), "t": "eleves", "id": el3, "champs": fiche(Bc, clB, "Ndongo" + suffixe, "clarisse", doublon_ok=1)},                 # homonyme confirmé
    {"op": op(), "t": "eleves", "id": el4, "champs": fiche(Bc, clB, "ABENA" + suffixe, "Junior", parent_tel="12 34")},            # téléphone invalide
    {"op": op(), "t": "eleves", "id": "el-" + uuid.uuid4().hex[:12], "champs": fiche(Bc, clA, "Autre" + suffixe, "Centre")},        # classe d'un autre centre
]}, secB)
res = r["resultats"]
verifier("la secrétaire inscrit un élève dans son centre", res[0]["ok"] is True, res[0])
verifier("doublon refusé (casse et ordre ignorés)", res[1]["ok"] is False and "Déjà inscrit" in res[1].get("erreur", ""), res[1])
verifier("homonyme confirmé accepté", res[2]["ok"] is True, res[2])
verifier("téléphone invalide refusé", res[3]["ok"] is False and "Téléphone" in res[3].get("erreur", ""), res[3])
verifier("classe d'un autre centre refusée", res[4]["ok"] is False, res[4])
_, t = req("sync/tirer", jeton=secB)
e1 = next((e for e in t["lignes"]["eleves"] if e["id"] == el1), {})
e3 = next((e for e in t["lignes"]["eleves"] if e["id"] == el3), {})
verifier("matricule posé par le serveur (AAAA-NNNN)", bool(re.match(r"^\d{4}-\d{4}$", e1.get("matricule") or "")), e1.get("matricule"))
verifier("matricules distincts et croissants", (e3.get("matricule") or "") > (e1.get("matricule") or "z"), (e1.get("matricule"), e3.get("matricule")))
verifier("téléphone ramené à 9 chiffres", e1.get("parent_tel") == "697637739", e1.get("parent_tel"))
verifier("date d'inscription et statut par défaut", bool(e1.get("date_inscription")) and e1.get("statut") == "actif", e1)
_, r = req("sync/pousser", {"ops": [{"op": op(), "t": "eleves", "id": el1, "champs": {"quartier": "Ndogpassi", "matricule": "PIRATE"}}]}, secB)
_, t = req("sync/tirer", jeton=secB)
e1 = next(e for e in t["lignes"]["eleves"] if e["id"] == el1)
verifier("modifier une fiche ne redéclenche pas le contrôle de doublon", r["resultats"][0]["ok"] is True, r)
verifier("le matricule ne se modifie pas depuis le téléphone", e1["matricule"] != "PIRATE", e1["matricule"])
_, t = req("sync/tirer", jeton=respA)
verifier("le responsable A ne voit pas les élèves de B", all(e["centre_id"] == A for e in t["lignes"].get("eleves", [])))
_, r = req("sync/pousser", {"ops": [{"op": op(), "t": "eleves", "id": "el-" + uuid.uuid4().hex[:12], "champs": fiche(A, clA, "Intrus", "Act")}]}, actA)
verifier("un actionnaire n'inscrit pas d'élève", r["resultats"][0]["ok"] is False, r)

# ── Jours et horaires des cours ──
hA = "ho-" + uuid.uuid4().hex[:12]
_, r = req("sync/pousser", {"ops": [
    {"op": op(), "t": "horaires", "id": hA, "champs": {"centre_id": A, "jour": 3, "debut": "14:30", "fin": "18:00", "niveaux": ""}},
    {"op": op(), "t": "horaires", "id": "ho-" + uuid.uuid4().hex[:12], "champs": {"centre_id": A, "jour": 2, "debut": "16:00", "fin": "18:00", "niveaux": "3e,Inventé"}},
    {"op": op(), "t": "horaires", "id": "ho-" + uuid.uuid4().hex[:12], "champs": {"centre_id": A, "jour": 2, "debut": "18:00", "fin": "16:00", "niveaux": "3e"}},
    {"op": op(), "t": "horaires", "id": "ho-" + uuid.uuid4().hex[:12], "champs": {"centre_id": Bc, "jour": 2, "debut": "16:00", "fin": "18:00", "niveaux": "3e"}},
]}, actA)
res = r["resultats"]
verifier("un actionnaire fixe les horaires de son centre", res[0]["ok"] is True, res[0])
verifier("niveau inconnu refusé", res[1]["ok"] is False and "Niveau" in res[1].get("erreur", ""), res[1])
verifier("plage à l'envers refusée", res[2]["ok"] is False, res[2])
verifier("pas d'horaires dans l'autre centre", res[3]["ok"] is False, res[3])
_, r = req("sync/pousser", {"ops": [{"op": op(), "t": "horaires", "id": hA, "champs": {"fin": "18:30"}}]}, secB)
verifier("une secrétaire ne change pas les horaires", r["resultats"][0]["ok"] is False, r)
req("sync/pousser", {"ops": [{"op": op(), "t": "horaires", "id": hA, "suppr": True}]}, adm)

# ── Appel et ponctualité (étape 3) ──
import datetime
auj = datetime.date.today()
jj = lambda d: d.strftime("%Y-%m-%d")
sid = lambda d, cl: "sa" + d.strftime("%Y%m%d") + cl
# Une classe neuve par passage : le banc se rejoue sans retrouver ses feuilles d'hier.
clX = "cl-" + uuid.uuid4().hex[:12]
req("sync/pousser", {"ops": [{"op": op(), "t": "classes", "id": clX, "champs": {"centre_id": Bc, "nom": "Appel " + clX[-5:]}}]}, adm)
s1 = sid(auj, clX)
pid = lambda: "pr-" + uuid.uuid4().hex[:20]
p1, p3 = pid(), pid()
_, r = req("sync/pousser", {"ops": [
    {"op": op(), "t": "seances", "id": s1, "champs": {"centre_id": Bc, "classe_id": clX, "date": jj(auj), "debut": "16:00", "fin": "18:00", "statut": "ouverte"}},
    {"op": op(), "t": "presences", "id": p1, "champs": {"centre_id": Bc, "seance_id": s1, "eleve_id": el1, "statut": "present", "arrivee": "16:03"}},
    {"op": op(), "t": "presences", "id": p3, "champs": {"centre_id": Bc, "seance_id": s1, "eleve_id": el3, "statut": "present", "arrivee": "16:20"}},
    {"op": op(), "t": "presences", "id": pid(), "champs": {"centre_id": Bc, "seance_id": s1, "eleve_id": el1, "statut": "absent"}},           # 2e pointage
    {"op": op(), "t": "presences", "id": pid(), "champs": {"centre_id": Bc, "seance_id": s1, "eleve_id": el3, "statut": "present", "arrivee": "17:00", "depart": "16:30"}},
    {"op": op(), "t": "seances", "id": sid(auj + datetime.timedelta(days=1), clX), "champs": {"centre_id": Bc, "classe_id": clX, "date": jj(auj + datetime.timedelta(days=1)), "debut": "16:00", "fin": "18:00"}},
]}, secB)
res = r["resultats"]
verifier("la secrétaire ouvre la feuille du jour", res[0]["ok"] is True, res[0])
verifier("pointage à l'heure accepté", res[1]["ok"] is True and res[2]["ok"] is True, res[1:3])
verifier("un seul pointage par élève et par feuille", res[3]["ok"] is False and "déjà pointé" in res[3].get("erreur", ""), res[3])
verifier("départ avant l'arrivée refusé", res[4]["ok"] is False, res[4])
verifier("pas d'appel pour un jour à venir", res[5]["ok"] is False, res[5])
_, t = req("sync/tirer", jeton=secB)
pr = {p["id"]: p for p in t["lignes"].get("presences", [])}
verifier("3 min de retard (tolérance 5) : présent", pr.get(p1, {}).get("statut") == "present" and int(pr[p1]["retard_min"]) == 0, pr.get(p1))
verifier("20 min de retard : statut « retard » posé par le serveur", pr.get(p3, {}).get("statut") == "retard" and int(pr[p3]["retard_min"]) == 20, pr.get(p3))
_, r = req("sync/pousser", {"ops": [{"op": op(), "t": "presences", "id": p1, "champs": {"statut": "present", "arrivee": "16:45"}}]}, secB)
_, t = req("sync/tirer", jeton=secB)
p1s = next(p for p in t["lignes"]["presences"] if p["id"] == p1)
verifier("corriger l'heure d'arrivée recalcule le retard", p1s["statut"] == "retard" and int(p1s["retard_min"]) == 45, p1s)

# Verrou des 2 jours : la secrétaire ne réécrit pas l'histoire, mais peut justifier.
vieux = auj - datetime.timedelta(days=5)
s0 = sid(vieux, clX)
p0 = pid()
_, r = req("sync/pousser", {"ops": [{"op": op(), "t": "seances", "id": s0, "champs": {"centre_id": Bc, "classe_id": clX, "date": jj(vieux), "debut": "16:00", "fin": "18:00"}}]}, secB)
verifier("feuille de plus de 2 jours : refusée à la secrétaire", r["resultats"][0]["ok"] is False, r)
_, r = req("sync/pousser", {"ops": [
    {"op": op(), "t": "seances", "id": s0, "champs": {"centre_id": Bc, "classe_id": clX, "date": jj(vieux), "debut": "16:00", "fin": "18:00"}},
    {"op": op(), "t": "presences", "id": p0, "champs": {"centre_id": Bc, "seance_id": s0, "eleve_id": el1, "statut": "absent"}},
]}, adm)
verifier("l'admin corrige un appel ancien", all(x["ok"] for x in r["resultats"]), r)
_, r = req("sync/pousser", {"ops": [{"op": op(), "t": "presences", "id": p0, "champs": {"statut": "present", "arrivee": "16:00"}}]}, secB)
verifier("la secrétaire ne transforme pas une vieille absence en présence", r["resultats"][0]["ok"] is False, r)
_, r = req("sync/pousser", {"ops": [{"op": op(), "t": "presences", "id": p0, "champs": {"statut": "justifie", "motif": "Certificat médical"}}]}, secB)
verifier("la secrétaire justifie une vieille absence", r["resultats"][0]["ok"] is True, r)
_, r = req("sync/pousser", {"ops": [{"op": op(), "t": "presences", "id": p1, "suppr": True}]}, secB)
verifier("la secrétaire ne supprime pas un pointage", r["resultats"][0]["ok"] is False, r)
_, r = req("sync/pousser", {"ops": [{"op": op(), "t": "presences", "id": p1, "suppr": True}]}, adm)
_, r = req("sync/pousser", {"ops": [{"op": op(), "t": "presences", "id": p1, "champs": {"centre_id": Bc, "seance_id": s1, "eleve_id": el1, "statut": "present", "arrivee": "16:00"}}]}, secB)
_, t = req("sync/tirer", jeton=secB)
p1s = next(p for p in t["lignes"]["presences"] if p["id"] == p1)
verifier("pointage effacé puis refait : la ligne revit", r["resultats"][0]["ok"] is True and int(p1s["supprime"]) == 0 and p1s["statut"] == "present", (r, p1s))

# Élève d'un autre centre, enseignant hors de ses classes.
_, r = req("sync/pousser", {"ops": [{"op": op(), "t": "presences", "id": pid(), "champs": {"centre_id": Bc, "seance_id": s1, "eleve_id": "el-inexistant-000"}}]}, secB)
verifier("élève inconnu du centre refusé", r["resultats"][0]["ok"] is False, r)
clT, clU = "cl-" + uuid.uuid4().hex[:12], "cl-" + uuid.uuid4().hex[:12]
jourAuj = auj.isoweekday()
req("sync/pousser", {"ops": [
    {"op": op(), "t": "classes", "id": clT, "champs": {"centre_id": A, "nom": "Prof " + clT[-5:]}},
    {"op": op(), "t": "classes", "id": clU, "champs": {"centre_id": A, "nom": "Autre " + clU[-5:]}},
    {"op": op(), "t": "creneaux", "id": "cr-" + uuid.uuid4().hex[:12], "champs": {"centre_id": A, "classe_id": clT, "matiere_id": mat["Mathématiques"],
        "enseignant_id": ens_id, "jour": jourAuj, "debut": "23:00", "fin": "23:30", "salle": ""}},
]}, adm)
prof = connexion("prof.maths", req("comptes/mdp", {"id": ens_id}, adm)[1]["mdp"])
_, r = req("sync/pousser", {"ops": [
    {"op": op(), "t": "seances", "id": sid(auj, clT), "champs": {"centre_id": A, "classe_id": clT, "date": jj(auj), "debut": "23:00", "fin": "23:30"}},
    {"op": op(), "t": "seances", "id": sid(auj, clU), "champs": {"centre_id": A, "classe_id": clU, "date": jj(auj), "debut": "16:00", "fin": "18:00"}},
]}, prof)
verifier("l'enseignant fait l'appel de SA classe du jour", r["resultats"][0]["ok"] is True, r["resultats"][0])
verifier("l'enseignant ne pointe pas une classe où il n'a pas cours", r["resultats"][1]["ok"] is False, r["resultats"][1])
_, r = req("sync/pousser", {"ops": [{"op": op(), "t": "seances", "id": sid(auj, clX) + "x", "champs": {"centre_id": Bc, "classe_id": clX, "date": jj(auj), "debut": "16:00", "fin": "18:00"}}]}, actA)
verifier("un actionnaire ne fait pas l'appel", r["resultats"][0]["ok"] is False, r)

_, j = req("journal", {"limite": 200}, jeton=adm)
actions = {l["action"] for l in j["lignes"]}
verifier("journal : créations, refus de connexion, comptes", {"creation", "connexion_echec", "compte_cree"} <= actions, actions)

print(f"\n{len(echecs)} échec(s)" if echecs else "\nTout est vert.")
sys.exit(1 if echecs else 0)
