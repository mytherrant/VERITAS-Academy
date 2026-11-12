# -*- coding: utf-8 -*-
"""
Régénère les sources .py des modules de contenu à partir du bytecode
conservé dans __pycache__, après la perte des fichiers .py.

Les .pyc contiennent toutes les constantes de chaînes : le contenu rédigé
(extraits, analyses, commentaires, dissertations, devoirs) est intégralement
récupérable. Seul le code exécutable (docxkit, builder) doit être réécrit.
"""
import glob
import importlib.machinery
import importlib.util
import os
import sys

PC = os.path.join(os.path.dirname(os.path.abspath(__file__)), "__pycache__")
ICI = os.path.dirname(os.path.abspath(__file__))
TAG = ".cpython-314.pyc"

# Ordre de sortie des clés, pour retrouver la lisibilité des sources d'origine.
ORDRE = ["numero", "titre", "repere", "extrait", "source", "objectif", "situation",
         "mouvements", "axes", "forme", "encadres", "plan", "comprendre", "analyser",
         "parcours1", "parcours2", "synthese", "examen", "ouverture",
         "sujet", "avertissement", "corps", "encadre",
         "entete", "consigne_generale", "sujets", "support", "source_support",
         "consignes", "bareme", "intro", "blocs", "grille", "cloture",
         "questions", "reponses", "grille_prod"]


def charge(nom):
    f = os.path.join(PC, nom + TAG)
    ldr = importlib.machinery.SourcelessFileLoader(nom, f)
    spec = importlib.util.spec_from_file_location(nom, f, loader=ldr)
    mod = importlib.util.module_from_spec(spec)
    sys.modules[nom] = mod
    spec.loader.exec_module(mod)
    return mod


def litteral(v, ind=0):
    """Sérialise une valeur en source Python lisible."""
    p = " " * ind
    if isinstance(v, str):
        if "\n" in v and '"""' not in v and not v.endswith('"'):
            return '"""' + v + '"""'
        return repr(v)
    if isinstance(v, (int, float, bool)) or v is None:
        return repr(v)
    if isinstance(v, tuple):
        return ("(\n" + "".join(p + "    " + litteral(x, ind + 4) + ",\n" for x in v)
                + p + ")")
    if isinstance(v, list):
        return ("[\n" + "".join(p + "    " + litteral(x, ind + 4) + ",\n" for x in v)
                + p + "]")
    if isinstance(v, dict):
        cles = sorted(v, key=lambda k: ORDRE.index(k) if k in ORDRE else 99)
        return ("dict(\n"
                + "".join(p + "    " + k + "=" + litteral(v[k], ind + 4) + ",\n"
                          for k in cles)
                + p + ")")
    raise TypeError("type non sérialisable : %r" % type(v))


def main():
    faits, mots = 0, 0
    for f in sorted(glob.glob(os.path.join(PC, "*.pyc"))):
        nom = os.path.basename(f).split(".")[0]
        if nom in ("docxkit", "builder", "_recover"):
            continue
        mod = charge(nom)
        doc = (mod.__doc__ or nom).strip()
        lignes = ["# -*- coding: utf-8 -*-",
                  '"""' + doc + '\n\nSource régénérée depuis le bytecode '
                  'après la perte des fichiers .py.\n"""', ""]
        for cle in [k for k in dir(mod) if not k.startswith("_")]:
            val = getattr(mod, cle)
            if callable(val) or isinstance(val, type(sys)):
                continue
            lignes.append(cle + " = " + litteral(val) + "\n")
            mots += len(str(val).split())
        open(os.path.join(ICI, nom + ".py"), "w", encoding="utf8").write(
            "\n".join(lignes))
        faits += 1
        print("   %-26s réécrit" % nom)
    print("\n%d modules régénérés (~%d mots de contenu)" % (faits, mots))


if __name__ == "__main__":
    main()
