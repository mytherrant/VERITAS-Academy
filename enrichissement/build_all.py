# -*- coding: utf-8 -*-
"""
Reconstruit les cahiers d'œuvre intégrale enrichis.

    python enrichissement/build_all.py            → tous les cahiers disponibles
    python enrichissement/build_all.py vieuxnegre → un seul
"""
import os
import sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import builder

# Cahiers dont l'oeuvre est un poeme. La longueur d'un extrait n'y est pas un
# critere : « Le Vase brise » fait cent trente mots et se commente entier.
# L'unite qui compte est semantique, non quantitative.
POESIE = {"sauvages", "stances", "balafon"}

CAHIERS = {
    "vieuxnegre": ("Manuel_VieuxNegreMedaille_Etude_Integrale.docx",
                   ["vieuxnegre_fiches", "vieuxnegre_fiches2"],
                   "vieuxnegre_modeles", "vieuxnegre_devoirs"),
    "lionperle": ("Manuel_LionEtLaPerle_Etude_Integrale.docx",
                  ["lionperle_fiches", "lionperle_fiches2"],
                  "lionperle_modeles", "lionperle_devoirs"),
    "ngum": ("Manuel_NgumAJemea_Etude_Integrale.docx",
             ["ngum_fiches", "ngum_fiches2"], "ngum_modeles", "ngum_devoirs"),
    "capitoline": ("Manuel_Capitoline_Etude_Integrale.docx",
                   ["capitoline_fiches", "capitoline_fiches2"],
                   "capitoline_modeles", "capitoline_devoirs"),
    "tenebres": ("Manuel_AuCoeurDesTenebres_Etude_Integrale.docx",
                 ["tenebres_fiches", "tenebres_fiches2", "tenebres_fiches3"],
                 "tenebres_modeles", "tenebres_devoirs"),
}

# Cahiers ecrits de zero : ils n'ont pas de version anterieure a relire, donc
# pas de conversion markdown. Leur paratexte vient de <cahier>_front.INFOS et
# l'assemblage passe par builder.build_neuf.
CAHIERS_NEUFS = {
    "tartuffe": ("Manuel_Tartuffe_Etude_Integrale.docx", "tartuffe_front",
                 ["tartuffe_fiches", "tartuffe_fiches2"],
                 "tartuffe_modeles", "tartuffe_devoirs"),
    "sauvages": ("Manuel_PoemesSauvages_Etude_Integrale.docx", "sauvages_front",
                 ["sauvages_fiches", "sauvages_fiches2"],
                 "sauvages_modeles", "sauvages_devoirs"),
    "stances": ("Manuel_StancesEtPoemes_Etude_Integrale.docx", "stances_front",
                ["stances_fiches", "stances_fiches2"],
                "stances_modeles", "stances_devoirs"),
    "balafon": ("Manuel_Balafon_Etude_Integrale.docx", "balafon_front",
                ["balafon_fiches", "balafon_fiches2"],
                "balafon_modeles", "balafon_devoirs"),
}


def fiches_de(*modules):
    """Récupère la liste des six fiches, quel que soit le nom des constantes."""
    out = []
    for mod in modules:
        listes = [v for k, v in vars(mod).items()
                  if k.startswith("FICHES") and isinstance(v, list)]
        if listes:
            out += max(listes, key=len)
        else:
            out += [v for k, v in sorted(vars(mod).items())
                    if len(k) == 2 and k[0] == "F" and isinstance(v, dict)]
    return out


def _charger(noms, cle):
    mods = {}
    for m in noms:
        try:
            mods[m] = __import__(m)
        except ImportError:
            print("— %s : module %s absent, cahier ignore" % (cle, m))
            return None
    return mods


def construire_neuf(cle):
    nom, mf, mods_fiches, mm, md = CAHIERS_NEUFS[cle]
    mods = _charger(list(mods_fiches) + [mf, mm, md], cle)
    if mods is None:
        return False
    fiches = fiches_de(*[mods[m] for m in mods_fiches])
    if len(fiches) != 6:
        print("— %s : %d fiches trouvees (6 attendues)" % (cle, len(fiches)))
    mo, de = mods[mm], mods[md]
    builder.build_neuf(nom, mods[mf].INFOS, fiches, mo.COMMENTAIRES, mo.DISSERTATIONS,
                       de.DEVOIR1, de.DEVOIR1_CORRIGE, de.DEVOIR2, de.DEVOIR2_CORRIGE,
                       de.ENCADRES_DEVOIRS, cle=cle)
    builder.controle_extraits(nom, 0 if cle in POESIE else 300)
    return True


def construire(cle):
    if cle in CAHIERS_NEUFS:
        return construire_neuf(cle)
    nom, mods_fiches, mm, md = CAHIERS[cle]
    mods = {}
    for m in list(mods_fiches) + [mm, md]:
        try:
            mods[m] = __import__(m)
        except ImportError:
            print("— %s : module %s absent, cahier ignoré" % (cle, m))
            return False
    fiches = fiches_de(*[mods[m] for m in mods_fiches])
    if len(fiches) != 6:
        print("— %s : %d fiches trouvées (6 attendues)" % (cle, len(fiches)))
    mo, de = mods[mm], mods[md]
    builder.build(nom, fiches, mo.COMMENTAIRES, mo.DISSERTATIONS,
                  de.DEVOIR1, de.DEVOIR1_CORRIGE, de.DEVOIR2, de.DEVOIR2_CORRIGE,
                  de.ENCADRES_DEVOIRS, cle=cle)
    builder.controle_extraits(nom, 0 if cle in POESIE else 300)
    return True


if __name__ == "__main__":
    connus = list(CAHIERS) + list(CAHIERS_NEUFS)
    cibles = sys.argv[1:] or connus
    faits = sum(construire(c) for c in cibles if c in connus)
    print("\n%d cahier(s) reconstruit(s)." % faits)
