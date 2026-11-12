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
                                   "acces": [{"centre_id": A, "role": "enseignant"}]}, adm)
verifier("compte enseignant avec matières", c == 200, r)
ens_id = ens_id or r["id"]
# Centres indépendants : un compte = un centre. Deux centres sur un compte → refus (même pour l'admin qui le crée).
c, r = req("comptes/enregistrer", {"id": ens_id, "identifiant": "prof.maths", "nom": "Essomba Paul",
                                   "acces": [{"centre_id": A, "role": "enseignant"}, {"centre_id": Bc, "role": "enseignant"}]}, adm)
verifier("un compte dans les deux centres est refusé (centres indépendants)", c == 422 and "indépendants" in r.get("error", ""), r)
# La même personne à B : un compte séparé. Sans identifiant, il se déduit du nom ; déjà pris → suffixe du centre.
ens_b = exist.get("prof.maths.b", "")
c, r = req("comptes/enregistrer", {"id": ens_b, "identifiant": "prof.maths.b", "nom": "Essomba Paul", "acces": [{"centre_id": Bc, "role": "enseignant"}]}, adm)
verifier("même enseignant à B : compte séparé", c == 200, r)
ens_b = ens_b or r["id"]
nom_x = "ZOGO" + uuid.uuid4().hex[:5].upper() + " Luc"
c, r1 = req("comptes/enregistrer", {"nom": nom_x, "acces": [{"centre_id": A, "role": "enseignant"}]}, adm)
c2, r2 = req("comptes/enregistrer", {"nom": nom_x, "acces": [{"centre_id": Bc, "role": "enseignant"}]}, adm)
verifier("identifiants distincts, le second porte le centre", c == 200 and c2 == 200 and r1["identifiant"] != r2["identifiant"]
         and r2["identifiant"].startswith(r1["identifiant"] + "."), (r1, r2))
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
         if not int(c["supprime"]) and c["enseignant_id"] in (ens_id, ens_b)]
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
    cr(Bc, clB, h(base + 1), h(base + 2), ens_id),      # 2 compte du centre A dans B → refus
    cr(Bc, clB, h(base + 2), h(base + 4), ens_b),       # 3 son compte de B, même heure qu'à A : comptes séparés → accepté
    cr(A, clA, h(base + 5), h(base + 4), ""),           # 4 fin avant début → refus
    cr(A, clB, h(base + 6), h(base + 7), ""),           # 5 classe d'un autre centre → refus
    cr(A, clA, h(base + 6), h(base + 7), idB),          # 6 pas enseignant → refus
    cr(A, clA, h(base + 2), h(base + 3), ens_id),       # 7 bout à bout → accepté
]}, adm)
res = r["resultats"]
verifier("créneau valide accepté", res[0]["ok"] is True, res[0])
verifier("classe déjà en cours : refus explicite", res[1]["ok"] is False and "déjà cours" in res[1].get("erreur", ""), res[1])
verifier("le compte du centre A ne reçoit pas de cours à B", res[2]["ok"] is False, res[2])
verifier("son compte de B reçoit son cours de B (centres indépendants)", res[3]["ok"] is True, res[3])
verifier("heures à l'envers refusées", res[4]["ok"] is False, res[4])
verifier("classe d'un autre centre refusée", res[5]["ok"] is False, res[5])
verifier("non-enseignant refusé comme enseignant", res[6]["ok"] is False, res[6])
verifier("créneaux bout à bout acceptés", res[7]["ok"] is True, res[7])
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
# Demande de Jacques (03/11/2026) : chaque partenaire inscrit, encaisse et gère les enseignants de SON centre.
_, r = req("sync/pousser", {"ops": [{"op": op(), "t": "eleves", "id": "el-" + uuid.uuid4().hex[:12], "champs": fiche(A, clA, "Partenaire" + uuid.uuid4().hex[:4].upper(), "Inscrit")}]}, actA)
verifier("un actionnaire inscrit un élève dans SON centre", r["resultats"][0]["ok"] is True, r)
_, r = req("sync/pousser", {"ops": [{"op": op(), "t": "eleves", "id": "el-" + uuid.uuid4().hex[:12], "champs": fiche(Bc, clB, "Intrus", "Act")}]}, actA)
verifier("un actionnaire n'inscrit pas d'élève dans l'autre centre", r["resultats"][0]["ok"] is False, r)

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

# Messages aux parents (étape 4) : trace « message préparé », modèles par centre.
_, r = req("sync/pousser", {"ops": [{"op": op(), "t": "presences", "id": p0, "champs": {"notifie": "2026-11-02 18:05:00 whatsapp", "statut": "justifie"}}]}, secB)
verifier("trace d'un message sur une absence ancienne : permise", r["resultats"][0]["ok"] is True, r)
_, r = req("sync/pousser", {"ops": [{"op": op(), "t": "presences", "id": p0, "champs": {"notifie": "n'importe quoi"}}]}, secB)
verifier("trace de message mal formée : refusée", r["resultats"][0]["ok"] is False, r)
_, r = req("sync/pousser", {"ops": [{"op": op(), "t": "presences", "id": p0, "champs": {"notifie": "2026-11-02 18:06:00 sms", "statut": "present", "arrivee": "16:00"}}]}, secB)
verifier("la trace ne sert pas de passe-droit au verrou des 2 jours", r["resultats"][0]["ok"] is False, r)
_, r = req("sync/pousser", {"ops": [{"op": op(), "t": "centres", "id": A, "champs": {"msg_absence": "Bonjour {parent}, {eleve} absent le {date}."}}]}, adm)
_, t = req("sync/tirer", jeton=respA)
verifier("modèle de message du centre enregistré et synchronisé", next(c for c in t["lignes"]["centres"] if c["id"] == A)["msg_absence"].startswith("Bonjour {parent}"), r)
req("sync/pousser", {"ops": [{"op": op(), "t": "centres", "id": A, "champs": {"msg_absence": ""}}]}, adm)

# ── Finances (étape 5) ──
_, r = req("sync/pousser", {"ops": [{"op": op(), "t": "classes", "id": clA, "champs": {"inscription": 2500, "mensualite": 7500}}]}, respA)
verifier("le responsable fixe les tarifs de sa classe", r["resultats"][0]["ok"] is True, r)
_, r = req("sync/pousser", {"ops": [{"op": op(), "t": "classes", "id": clA, "champs": {"mensualite": 100}}]}, actA)
verifier("un actionnaire ne change pas les tarifs", r["resultats"][0]["ok"] is False and "tarifs" in r["resultats"][0].get("erreur", ""), r)
_, r = req("sync/pousser", {"ops": [{"op": op(), "t": "classes", "id": clA, "champs": {"niveau": "1ère", "inscription": 2500, "mensualite": 7500}}]}, actA)
verifier("… mais modifie la classe si les tarifs restent les mêmes", r["resultats"][0]["ok"] is True, r)
req("sync/pousser", {"ops": [{"op": op(), "t": "centres", "id": Bc, "champs": {"inscription_option": 4000, "inscription_option_libelle": "avec Mon cahier de français"}}]}, adm)
_, r = req("sync/pousser", {"ops": [
    {"op": op(), "t": "eleves", "id": el1, "champs": {"inscription_due": 4000}},
    {"op": op(), "t": "eleves", "id": el1, "champs": {"mensualite_due": 3000}},
]}, secB)
verifier("la secrétaire choisit l'option d'inscription prévue (4 000 F)", r["resultats"][0]["ok"] is True, r["resultats"][0])
verifier("la secrétaire n'accorde pas de remise", r["resultats"][1]["ok"] is False and "responsable" in r["resultats"][1].get("erreur", ""), r["resultats"][1])
_, r = req("sync/pousser", {"ops": [{"op": op(), "t": "eleves", "id": el1, "champs": {"mensualite_due": 5000, "remise_motif": "Fratrie"}}]}, adm)
verifier("l'admin accorde une remise motivée", r["resultats"][0]["ok"] is True, r)

pay = lambda: "pa-" + uuid.uuid4().hex[:20]
pa1, pa2 = pay(), pay()
_, r = req("sync/pousser", {"ops": [
    {"op": op(), "t": "paiements", "id": pa1, "champs": {"centre_id": Bc, "eleve_id": el1, "montant": 7500, "date": jj(auj), "mode": "especes"}},
    {"op": op(), "t": "paiements", "id": pa2, "champs": {"centre_id": Bc, "eleve_id": el1, "montant": 2000, "date": jj(auj), "mode": "om", "reference": "MP2611.1234"}},
    {"op": op(), "t": "paiements", "id": pay(), "champs": {"centre_id": Bc, "eleve_id": el1, "montant": 0, "date": jj(auj), "mode": "especes"}},
    {"op": op(), "t": "paiements", "id": pay(), "champs": {"centre_id": Bc, "eleve_id": el1, "montant": 500, "date": jj(auj), "mode": "bitcoin"}},
    {"op": op(), "t": "paiements", "id": pay(), "champs": {"centre_id": Bc, "eleve_id": el1, "montant": 500, "date": jj(auj + datetime.timedelta(days=1)), "mode": "especes"}},
    {"op": op(), "t": "paiements", "id": pay(), "champs": {"centre_id": Bc, "eleve_id": el1, "montant": 500, "date": jj(auj - datetime.timedelta(days=6)), "mode": "especes"}},
    {"op": op(), "t": "paiements", "id": pay(), "champs": {"centre_id": Bc, "eleve_id": "el-inconnu-0000", "montant": 500, "date": jj(auj), "mode": "especes"}},
]}, secB)
res = r["resultats"]
verifier("versements encaissés par la secrétaire", res[0]["ok"] is True and res[1]["ok"] is True, res[:2])
verifier("montant nul refusé", res[2]["ok"] is False, res[2])
verifier("mode de paiement inconnu refusé", res[3]["ok"] is False, res[3])
verifier("versement daté du lendemain refusé", res[4]["ok"] is False, res[4])
verifier("versement de plus de 2 jours refusé à la secrétaire", res[5]["ok"] is False, res[5])
verifier("élève inconnu refusé", res[6]["ok"] is False, res[6])
_, t = req("sync/tirer", jeton=secB)
pp = {p["id"]: p for p in t["lignes"].get("paiements", [])}
idSecB = next(c["id"] for c in req("comptes", jeton=adm)[1]["comptes"] if c["identifiant"] == "sec.b")
verifier("numéro de reçu posé par le serveur (AAAA-NNNN)", bool(re.match(r"^\d{4}-\d{4}$", pp.get(pa1, {}).get("numero") or "")), pp.get(pa1))
verifier("numéros de reçu consécutifs", int(pp[pa2]["numero"][5:]) == int(pp[pa1]["numero"][5:]) + 1, (pp[pa1]["numero"], pp[pa2]["numero"]))
verifier("« encaissé par » = la personne connectée", pp[pa1]["encaisse_par"] == idSecB, pp[pa1]["encaisse_par"])

_, r = req("sync/pousser", {"ops": [
    {"op": op(), "t": "paiements", "id": pa1, "champs": {"montant": 750}},
    {"op": op(), "t": "paiements", "id": pa1, "champs": {"annule": 1, "motif_annulation": "Erreur de saisie"}},
    {"op": op(), "t": "paiements", "id": pa1, "champs": {"envoye_le": "2026-11-02 18:10:00 whatsapp"}},
    {"op": op(), "t": "paiements", "id": pa1, "suppr": True},
]}, secB)
res = r["resultats"]
verifier("un versement ne se modifie pas", res[0]["ok"] is False and "ne se modifie pas" in res[0].get("erreur", ""), res[0])
verifier("la secrétaire n'annule pas un versement", res[1]["ok"] is False, res[1])
verifier("trace « reçu envoyé » permise", res[2]["ok"] is True, res[2])
verifier("un versement ne se supprime pas", res[3]["ok"] is False, res[3])
_, r = req("sync/pousser", {"ops": [
    {"op": op(), "t": "paiements", "id": pa2, "champs": {"annule": 1, "motif_annulation": ""}},
    {"op": op(), "t": "paiements", "id": pa2, "champs": {"annule": 1, "motif_annulation": "Doublon de saisie"}},
    {"op": op(), "t": "paiements", "id": pa2, "champs": {"annule": 1, "motif_annulation": "Encore une fois"}},
    {"op": op(), "t": "paiements", "id": pay(), "champs": {"centre_id": Bc, "eleve_id": el1, "montant": 500, "date": jj(auj - datetime.timedelta(days=6)), "mode": "especes"}},
]}, adm)
res = r["resultats"]
verifier("annulation sans motif refusée", res[0]["ok"] is False, res[0])
verifier("annulation motivée par l'admin", res[1]["ok"] is True, res[1])
verifier("pas de double annulation", res[2]["ok"] is False, res[2])
verifier("l'admin saisit un versement ancien", res[3]["ok"] is True, res[3])
_, t = req("sync/tirer", jeton=actA)
verifier("l'actionnaire A ne voit pas les versements de B", all(p["centre_id"] == A for p in t["lignes"].get("paiements", [])))
prof = connexion("prof.maths", req("comptes/mdp", {"id": ens_id}, adm)[1]["mdp"])
_, t = req("sync/tirer", jeton=prof)
verifier("un enseignant ne voit aucun versement", not t["lignes"].get("paiements"), len(t["lignes"].get("paiements", [])))

dep = lambda: "de-" + uuid.uuid4().hex[:20]
d1, d2 = dep(), dep()
_, r = req("sync/pousser", {"ops": [
    {"op": op(), "t": "depenses", "id": d1, "champs": {"centre_id": Bc, "date": jj(auj), "libelle": "Craies et marqueurs", "categorie": "fournitures", "montant": 3500, "mode": "especes"}},
    {"op": op(), "t": "depenses", "id": dep(), "champs": {"centre_id": Bc, "date": jj(auj), "libelle": "Loyer", "categorie": "loyer", "montant": 50000, "statut": "validee"}},
]}, secB)
verifier("dépense saisie « en attente »", r["resultats"][0]["ok"] is True, r["resultats"][0])
verifier("la secrétaire ne valide pas une dépense", r["resultats"][1]["ok"] is False, r["resultats"][1])
_, r = req("sync/pousser", {"ops": [
    {"op": op(), "t": "depenses", "id": d1, "champs": {"statut": "refusee"}},
    {"op": op(), "t": "depenses", "id": d1, "champs": {"statut": "validee"}},
    {"op": op(), "t": "depenses", "id": d1, "champs": {"montant": 9999}},
    {"op": op(), "t": "depenses", "id": d1, "suppr": True},
]}, adm)
res = r["resultats"]
verifier("refus sans motif refusé", res[0]["ok"] is False, res[0])
verifier("l'admin valide la dépense", res[1]["ok"] is True, res[1])
verifier("dépense validée : figée", res[2]["ok"] is False and res[3]["ok"] is False, res[2:])
_, r = req("sync/pousser", {"ops": [{"op": op(), "t": "depenses", "id": d2, "champs": {"centre_id": A, "date": jj(auj), "libelle": "Électricité", "categorie": "electricite", "montant": 12000}}]}, respA)
_, r = req("sync/pousser", {"ops": [{"op": op(), "t": "depenses", "id": d2, "champs": {"statut": "validee"}}]}, respA)
verifier("un responsable ne valide pas sa propre dépense", r["resultats"][0]["ok"] is False, r)
# Demande de Jacques (10/11/2026) : une dépense est validée par le trésorier du centre ou l'administrateur.
_, lst = req("comptes", jeton=adm)
ids = {c["identifiant"]: c["id"] for c in lst["comptes"]}
_, t = req("sync/tirer", jeton=adm)
tres_avant = next(c for c in t["lignes"]["centres"] if c["id"] == A).get("tresorier_id") or ""
fixer_tres = lambda uid: req("sync/pousser", {"ops": [{"op": op(), "t": "centres", "id": A, "champs": {"tresorier_id": uid}}]}, adm)
dt = dep()
req("sync/pousser", {"ops": [{"op": op(), "t": "depenses", "id": dt, "champs": {"centre_id": A, "date": jj(auj), "libelle": "Craie", "categorie": "fournitures", "montant": 200, "mode": "especes"}}]}, actA)
fixer_tres(ids["action.a"])
_, r = req("sync/pousser", {"ops": [{"op": op(), "t": "depenses", "id": dt, "champs": {"statut": "validee"}}]}, respA)
verifier("un responsable qui n'est pas trésorier ne valide pas", r["resultats"][0]["ok"] is False and "trésorier" in r["resultats"][0].get("erreur", ""), r)
_, r = req("sync/pousser", {"ops": [{"op": op(), "t": "depenses", "id": dt, "champs": {"statut": "validee"}}]}, actA)
verifier("le trésorier ne valide pas sa propre dépense (l'admin le fait)", r["resultats"][0]["ok"] is False and "administrateur" in r["resultats"][0].get("erreur", ""), r)
fixer_tres(ids["resp.a"])
_, r = req("sync/pousser", {"ops": [{"op": op(), "t": "depenses", "id": dt, "champs": {"statut": "validee"}}]}, respA)
verifier("le trésorier du centre valide la dépense d'un autre", r["resultats"][0]["ok"] is True, r)
fixer_tres(tres_avant)
_, t = req("sync/tirer", jeton=adm)
dd = next(x for x in t["lignes"]["depenses"] if x["id"] == d1)
verifier("validation tracée (par qui, quand)", dd["statut"] == "validee" and dd["valide_par"] and dd["valide_le"], dd)

# ── Tranches de numéros de reçu (reçus numérotés hors ligne) ──
_, r1 = req("recus/tranche", {"centre": Bc}, secB)
_, r2 = req("recus/tranche", {"centre": Bc}, secB)
verifier("tranches de 20 numéros rendues au téléphone", r1.get("tranches") and all(t["fin"] - t["debut"] == 19 for t in r1["tranches"]), r1)
verifier("pas d'accaparement : pas de nouvelle tranche tant qu'il reste des numéros libres", len(r2["tranches"]) == len(r1["tranches"]) and r2["libres"] >= 10, (r1.get("libres"), r2.get("libres")))
_, ra2 = req("recus/tranche", {"centre": Bc}, adm)
fins_secB = max(t["fin"] for t in r2["tranches"])
toutes = r2["tranches"] + ra2["tranches"]
chevauchent = [(a["debut"], a["fin"], b["debut"], b["fin"]) for i, a in enumerate(toutes) for b in toutes[i + 1:] if not (a["fin"] < b["debut"] or b["fin"] < a["debut"])]
verifier("aucune tranche ne chevauche une autre (deux comptes)", not chevauchent, chevauchent[:3])
# Numéros libres de la secrétaire (ceux déjà servis aux passages précédents sont écartés).
_, tt = req("sync/tirer", jeton=adm)
servis = {p["numero"] for p in tt["lignes"].get("paiements", []) if p["centre_id"] == Bc}
libres_secB = [t["prefixe"] + "-" + str(n).zfill(4) for t in r2["tranches"] for n in range(t["debut"], t["fin"] + 1) if t["prefixe"] + "-" + str(n).zfill(4) not in servis]
t1 = {"prefixe": libres_secB[0][:4], "debut": int(libres_secB[0][5:])}
t2 = {"fin": max(max(x["fin"] for x in r2["tranches"]), max(x["fin"] for x in ra2["tranches"]))}
c, r = req("recus/tranche", {"centre": A}, secB)
verifier("pas de tranche dans un centre où l'on n'encaisse pas", c == 403, r)
num = lambda t, k: t["prefixe"] + "-" + str(t["debut"] + k).zfill(4)
pt, pd, ph, pa = pay(), pay(), pay(), pay()
_, r = req("sync/pousser", {"ops": [
    {"op": op(), "t": "paiements", "id": pt, "champs": {"centre_id": Bc, "eleve_id": el1, "numero": num(t1, 0), "montant": 1000, "date": jj(auj), "mode": "especes"}},
    {"op": op(), "t": "paiements", "id": pd, "champs": {"centre_id": Bc, "eleve_id": el1, "numero": num(t1, 0), "montant": 1000, "date": jj(auj), "mode": "especes"}},
    {"op": op(), "t": "paiements", "id": ph, "champs": {"centre_id": Bc, "eleve_id": el1, "numero": "2627-9999", "montant": 1000, "date": jj(auj), "mode": "especes"}},
]}, secB)
res = r["resultats"]
verifier("reçu numéroté hors ligne depuis sa tranche : accepté", res[0]["ok"] is True, res[0])
# L'argent a été reçu : un numéro en conflit (même compte sur deux appareils…) ne fait JAMAIS perdre le versement.
verifier("numéro de tranche déjà utilisé : versement gardé, renuméroté", res[1]["ok"] is True, res[1])
verifier("numéro hors de ses tranches : versement gardé, renuméroté", res[2]["ok"] is True, res[2])
_, r = req("sync/pousser", {"ops": [{"op": op(), "t": "paiements", "id": pa, "champs": {"centre_id": Bc, "eleve_id": el1, "numero": libres_secB[1], "montant": 1000, "date": jj(auj), "mode": "especes"}}]}, adm)
verifier("la tranche d'un autre compte : versement gardé, renuméroté", r["resultats"][0]["ok"] is True, r)
_, t = req("sync/tirer", jeton=adm)
pp = {p["id"]: p for p in t["lignes"]["paiements"]}
nums = [pp[x]["numero"] for x in (pt, pd, ph, pa)]
verifier("renumérotés : numéros tous différents", len(set(nums)) == 4, nums)
verifier("renuméroté : pas le numéro d'une autre tranche", pp[pa]["numero"] != libres_secB[1] and pp[ph]["numero"] != "2627-9999", nums)
verifier("renuméroté : la note garde la trace du numéro proposé", "renuméroté" in (pp[pd].get("note") or ""), pp[pd].get("note"))
# Ces trois versements de test sont annulés : ils ne faussent pas les comptes vérifiés plus loin.
req("sync/pousser", {"ops": [{"op": op(), "t": "paiements", "id": x, "champs": {"annule": 1, "motif_annulation": "versement de test"}} for x in (pd, ph, pa)]}, adm)
c, r = req("recus/tranche", {"centre": "cl-inexistant-centre"}, adm)
verifier("tranche pour un centre inexistant : refusée", c == 404, (c, r))
# Lot avec une opération malformée : elle seule est refusée, les autres passent.
pm = pay()
_, r = req("sync/pousser", {"ops": [
    {"op": op(), "t": "eleves", "id": el1, "champs": {"quartier": ["pas", "un", "texte"]}},
    {"op": op(), "t": "eleves", "id": "EL-MAJUSCULES-1", "champs": {"centre_id": Bc, "nom": "X"}},
    {"op": op(), "t": "paiements", "id": pm, "champs": {"centre_id": Bc, "eleve_id": el1, "montant": 500, "date": jj(auj), "mode": "especes"}},
]}, adm)
res = r["resultats"]
verifier("valeur non scalaire : refusée sans faire tomber le lot", res[0]["ok"] is False and res[2]["ok"] is True, res)
verifier("identifiant en majuscules refusé (clés identiques sous MySQL)", res[1]["ok"] is False, res[1])
ps = pay()
req("sync/pousser", {"ops": [{"op": op(), "t": "paiements", "id": ps, "champs": {"centre_id": Bc, "eleve_id": el1, "montant": 1000, "date": jj(auj), "mode": "especes"}}]}, adm)
_, t = req("sync/tirer", jeton=adm)
pp = {p["id"]: p for p in t["lignes"]["paiements"]}
verifier("le numéro gardé est celui de la tranche", pp[pt]["numero"] == num(t1, 0), pp[pt]["numero"])
verifier("la numérotation du serveur saute les tranches réservées", int(pp[ps]["numero"][5:]) > t2["fin"], (pp[ps]["numero"], t2["fin"]))

# ── Photo du justificatif d'une dépense ──
import base64, urllib.request as ur
faux_jpeg = base64.b64encode(b"\xff\xd8\xff\xe0" + b"\x00" * 2000 + b"\xff\xd9").decode()
d3 = dep()
req("sync/pousser", {"ops": [{"op": op(), "t": "depenses", "id": d3, "champs": {"centre_id": Bc, "date": jj(auj), "libelle": "Rame de papier", "categorie": "fournitures", "montant": 2500}}]}, secB)
c, r = req("justificatif/deposer", {"id": d3, "jpeg": base64.b64encode(b"pas une image" * 100).decode()}, secB)
verifier("justificatif qui n'est pas une photo : refusé", c == 422, r)
c, r = req("justificatif/deposer", {"id": d3, "jpeg": faux_jpeg}, secB)
verifier("photo du justificatif déposée", c == 200 and r.get("justificatif"), r)
_, t = req("sync/tirer", jeton=adm)
verifier("la dépense signale son justificatif", next(x for x in t["lignes"]["depenses"] if x["id"] == d3)["justificatif"], "")
def lire_photo(jeton):
    q = ur.Request(f"{B}/index.php?r=justificatif/lire&id={d3}")
    q.add_header("Authorization", "Bearer " + jeton)
    try:
        with ur.urlopen(q) as rep: return rep.status, rep.headers.get("Content-Type"), len(rep.read())
    except urllib.error.HTTPError as e: return e.code, None, 0
c, ct, n = lire_photo(adm)
verifier("l'admin voit la photo (image/jpeg)", c == 200 and ct == "image/jpeg" and n > 2000, (c, ct, n))
c, _, _ = lire_photo(actA)
verifier("un actionnaire d'un autre centre ne voit pas la photo", c == 403, c)
req("sync/pousser", {"ops": [{"op": op(), "t": "depenses", "id": d3, "champs": {"statut": "validee"}}]}, adm)
c, r = req("justificatif/deposer", {"id": d3, "jpeg": faux_jpeg}, secB)
verifier("dépense validée : justificatif figé", c == 409, r)

# ── Enseignants (étape 6) : contrat, présence, heures, paie ──
clE = "cl-" + uuid.uuid4().hex[:12]
crE = "cr-" + uuid.uuid4().hex[:12]
req("sync/pousser", {"ops": [
    {"op": op(), "t": "classes", "id": clE, "champs": {"centre_id": A, "nom": "Ens " + clE[-5:]}},
    {"op": op(), "t": "creneaux", "id": crE, "champs": {"centre_id": A, "classe_id": clE, "matiere_id": mat["Mathématiques"], "enseignant_id": ens_id, "jour": auj.isoweekday(), "debut": "22:00", "fin": "23:00", "salle": ""}},
]}, adm)
# Contrats laissés par les passages précédents : on repart sans contrat actif.
_, t = req("sync/tirer", jeton=adm)
vieux = [{"op": op(), "t": "contrats", "id": x["id"], "champs": {"actif": 0}} for x in t["lignes"].get("contrats", []) if x["utilisateur_id"] == ens_id and x["centre_id"] == A and int(x["actif"])]
if vieux: req("sync/pousser", {"ops": vieux}, adm)
co1 = "co-" + uuid.uuid4().hex[:12]
_, r = req("sync/pousser", {"ops": [
    {"op": op(), "t": "contrats", "id": co1, "champs": {"centre_id": A, "utilisateur_id": ens_id, "mode": "heure", "taux": 2000}},
    {"op": op(), "t": "contrats", "id": "co-" + uuid.uuid4().hex[:12], "champs": {"centre_id": A, "utilisateur_id": ens_id, "mode": "heure", "taux": 9000}},
    {"op": op(), "t": "contrats", "id": "co-" + uuid.uuid4().hex[:12], "champs": {"centre_id": A, "utilisateur_id": idB, "mode": "heure", "taux": 2000}},
]}, respA)
res = r["resultats"]
verifier("le responsable fixe le contrat d'un enseignant", res[0]["ok"] is True, res[0])
verifier("un seul contrat actif par enseignant et centre", res[1]["ok"] is False, res[1])
verifier("pas de contrat pour un non-enseignant", res[2]["ok"] is False, res[2])
_, r = req("sync/pousser", {"ops": [{"op": op(), "t": "contrats", "id": co1, "champs": {"centre_id": Bc, "taux": 99999}}]}, actA)
verifier("un actionnaire ne fixe pas la rémunération dans l'autre centre", r["resultats"][0]["ok"] is False, r)

pe = "pe" + auj.strftime("%Y%m%d") + crE
_, r = req("sync/pousser", {"ops": [{"op": op(), "t": "presences_ens", "id": pe, "champs": {"centre_id": A, "creneau_id": crE, "date": jj(auj), "statut": "present", "arrivee": "22:00"}}]}, prof)
verifier("l'enseignant ne se pointe pas lui-même", r["resultats"][0]["ok"] is False, r)
hier = auj - datetime.timedelta(days=1)
_, r = req("sync/pousser", {"ops": [
    {"op": op(), "t": "presences_ens", "id": pe, "champs": {"centre_id": A, "creneau_id": crE, "date": jj(auj), "statut": "present", "arrivee": "22:10", "depart": "22:50"}},
    {"op": op(), "t": "presences_ens", "id": "pe" + hier.strftime("%Y%m%d") + crE, "champs": {"centre_id": A, "creneau_id": crE, "date": jj(hier), "statut": "present"}},
    {"op": op(), "t": "presences_ens", "id": "pe" + auj.strftime("%Y%m%d") + crE + "x", "champs": {"centre_id": A, "creneau_id": crE, "date": jj(auj), "statut": "remplace", "remplacant_id": idB}},
]}, respA)
res = r["resultats"]
verifier("le responsable pointe l'enseignant", res[0]["ok"] is True, res[0])
verifier("créneau pointé un autre jour que le sien : refusé", res[1]["ok"] is False, res[1])
verifier("remplaçant qui n'est pas enseignant : refusé", res[2]["ok"] is False, res[2])
_, t = req("sync/tirer", jeton=prof)
pes = next((x for x in t["lignes"].get("presences_ens", []) if x["id"] == pe), {})
verifier("retard de l'enseignant et minutes faites calculés (10 min, 40 min)", pes.get("statut") == "retard" and int(pes.get("retard_min", 0)) == 10 and int(pes.get("minutes", 0)) == 40, pes)
verifier("l'enseignant lit son propre contrat", any(x["id"] == co1 for x in t["lignes"].get("contrats", [])), "")
verifier("… mais pas les versements des élèves", not t["lignes"].get("paiements"), "")
pa = "py-" + uuid.uuid4().hex[:12]
_, r = req("sync/pousser", {"ops": [{"op": op(), "t": "paies", "id": pa, "champs": {"centre_id": A, "enseignant_id": ens_id, "mois": auj.strftime("%Y-%m"), "montant": 1334, "date": jj(auj), "mode": "momo"}}]}, respA)
verifier("le responsable verse la paie", r["resultats"][0]["ok"] is True, r)
_, r = req("sync/pousser", {"ops": [{"op": op(), "t": "paies", "id": pa, "champs": {"montant": 99999}}, {"op": op(), "t": "paies", "id": pa, "suppr": True}]}, respA)
verifier("une paie ne se modifie ni ne se supprime", all(not x["ok"] for x in r["resultats"]), r)
_, t = req("sync/tirer", jeton=prof)
verifier("l'enseignant voit sa paie", any(x["id"] == pa for x in t["lignes"].get("paies", [])), "")
_, t = req("sync/tirer", jeton=secB)
verifier("une secrétaire d'un autre centre ne voit ni contrats ni paies", not t["lignes"].get("contrats") and not t["lignes"].get("paies"), "")

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
# Demande de Jacques (04/11/2026) : l'enseignant fait l'appel de toute classe de SON centre.
verifier("l'enseignant fait aussi l'appel d'une autre classe de son centre", r["resultats"][1]["ok"] is True, r["resultats"][1])
# Un enseignant du seul centre A ne fait pas l'appel dans B.
_, rc = req("comptes/enregistrer", {"id": exist.get("prof.a.seul", ""), "identifiant": "prof.a.seul", "nom": "Prof A Seul", "acces": [{"centre_id": A, "role": "enseignant"}]}, adm)
profA = connexion("prof.a.seul", req("comptes/mdp", {"id": exist.get("prof.a.seul", "") or rc["id"]}, adm)[1]["mdp"])
_, r = req("sync/pousser", {"ops": [{"op": op(), "t": "seances", "id": sid(auj, clX) + "p", "champs": {"centre_id": Bc, "classe_id": clX, "date": jj(auj), "debut": "16:00", "fin": "18:00"}}]}, profA)
verifier("un enseignant du seul centre A ne fait pas l'appel dans B", r["resultats"][0]["ok"] is False, r["resultats"][0])
_, r = req("sync/pousser", {"ops": [{"op": op(), "t": "seances", "id": sid(auj, clX) + "x", "champs": {"centre_id": Bc, "classe_id": clX, "date": jj(auj), "debut": "16:00", "fin": "18:00"}}]}, actA)
verifier("un actionnaire ne fait pas l'appel dans l'autre centre", r["resultats"][0]["ok"] is False, r)
_, r = req("sync/pousser", {"ops": [{"op": op(), "t": "seances", "id": sid(auj, clU), "champs": {"centre_id": A, "classe_id": clU, "date": jj(auj), "debut": "16:00", "fin": "18:00"}}]}, actA)
verifier("un actionnaire fait l'appel dans SON centre", r["resultats"][0]["ok"] is True, r)

# ── Pouvoirs de l'admin : droits retirés à un partenaire, appliqués par le serveur ──
_, lst = req("comptes", jeton=adm)
ra = next(u for u in lst["comptes"] if u["identifiant"] == "resp.a")
base = {"id": ra["id"], "identifiant": "resp.a", "nom": ra["nom"], "tel": ra.get("tel") or "", "actif": True,
        "acces": [{"centre_id": c, "role": r} for c, r in ra["acces"].items()], "matieres": ra.get("matieres", [])}
c, r = req("comptes/enregistrer", dict(base, restrictions=["tarifs.fixer", "caisse.corriger"]), adm)
verifier("l'admin retire deux droits à un responsable", c == 200, r)
_, moi = req("moi", jeton=respA)
verifier("le partenaire voit ses droits retirés (profil)", sorted(moi.get("restrictions", [])) == ["caisse.corriger", "tarifs.fixer"], moi.get("restrictions"))
_, r = req("sync/pousser", {"ops": [{"op": op(), "t": "classes", "id": clA, "champs": {"mensualite": 9000}}]}, respA)
verifier("droit retiré : le responsable ne fixe plus les tarifs", r["resultats"][0]["ok"] is False, r)
_, r = req("sync/pousser", {"ops": [{"op": op(), "t": "eleves", "id": "el-" + uuid.uuid4().hex[:12], "champs": {"centre_id": A, "classe_id": clA, "nom": "LIBRE" + suffixe, "prenoms": "Droit"}}]}, respA)
verifier("… mais garde ses autres droits (inscrire)", r["resultats"][0]["ok"] is True, r)
c, r = req("comptes/enregistrer", {"id": ra["id"], "identifiant": "resp.a", "nom": ra["nom"], "acces": base["acces"], "restrictions": []}, respA)
verifier("un partenaire ne se rend pas ses droits lui-même", c == 403, r)
c, r = req("comptes/enregistrer", dict(base, restrictions=["pouvoir.inventé"]), adm)
verifier("capacité inconnue refusée", c == 422, r)
# Lecture seule : tous les droits retirables ôtés → il lit, n'écrit plus rien.
c, r = req("comptes/enregistrer", dict(base, restrictions=moi["retirables"]), adm)
_, r = req("sync/pousser", {"ops": [{"op": op(), "t": "eleves", "id": "el-" + uuid.uuid4().hex[:12], "champs": {"centre_id": A, "classe_id": clA, "nom": "BLOQUE" + suffixe, "prenoms": "Lecture"}}]}, respA)
_, t = req("sync/tirer", jeton=respA)
verifier("lecture seule : plus aucune écriture", r["resultats"][0]["ok"] is False, r)
verifier("lecture seule : la lecture du centre reste possible", any(cc["id"] == A for cc in t["lignes"]["centres"]) and not t["lignes"].get("paiements"), "")
c, r = req("comptes", jeton=respA)
verifier("lecture seule : plus d'accès aux comptes", c == 403, c)
req("comptes/enregistrer", dict(base, restrictions=[]), adm)
_, r = req("sync/pousser", {"ops": [{"op": op(), "t": "classes", "id": clA, "champs": {"mensualite": 7500}}]}, respA)
verifier("droits rendus : le responsable refixe les tarifs", r["resultats"][0]["ok"] is True, r)

_, j = req("journal", {"limite": 200}, jeton=adm)
actions = {l["action"] for l in j["lignes"]}
verifier("journal : créations, refus de connexion, comptes", {"creation", "connexion_echec", "compte_cree"} <= actions, actions)

print(f"\n{len(echecs)} échec(s)" if echecs else "\nTout est vert.")
sys.exit(1 if echecs else 0)
