# -*- coding: utf-8 -*-
"""Ajoute la rubrique 10 du cahier « Poèmes sauvages » à vers_examen."""
import io

BLOC = '''# ═══════════════════════════════════════════ POÈMES SAUVAGES (N'KOUMO)
# Cahier de seconde : la rubrique 10 vise la classe suivante et l'examen qui
# l'attend au bout, non le BAC.
SAUVAGES = dict(
    parcours=PARCOURS_SECONDE,
    titre_rubrique="10. Vers la Première — Vers le Probatoire",
    baremes=(BAREME_SECONDE_CC, BAREME_SECONDE_DISS),
    chapeau="Deux entraînements complets. Le premier est au format de l'épreuve de fin de "
            "seconde ; le second anticipe celui du Probatoire, que l'élève passera l'année "
            "suivante. Chacun propose un sujet de commentaire composé accompagné de son "
            "texte, et un sujet de dissertation, tous deux portant sur l'œuvre étudiée. Les "
            "pistes indiquées ne sont pas un corrigé : elles signalent ce qu'un devoir "
            "solide devrait exploiter.",
    premiere=dict(
        commentaire=dict(
            fiche=2,
            consigne="**Sans dissocier le fond de la forme, vous ferez de ce texte un "
                     "commentaire composé.** En vous appuyant sur les répétitions, les "
                     "énumérations, la ponctuation et la longueur des vers, vous montrerez, "
                     "entre autres, comment le poème passe d'un deuil personnel à une "
                     "accusation générale. Le plan comportera deux axes de deux "
                     "sous-parties.",
            pistes=[
                "L'hyperbole d'ouverture — « et mon jour meurt mille fois » — et ce qu'elle "
                "change à l'échelle du livre.",
                "La longue énumération de crimes, qui va des corps (« cramer les vies ») "
                "jusqu'aux rêves (« assassiner nos rêves posés sur les routes vives »).",
                "Le vers des villes : neuf noms, trois continents, aucune virgule. Montrer "
                "que l'égalité des deuils y est produite par la seule disposition des mots, "
                "sans argument.",
                "Les intrus de la liste : le mot « pleurs » glissé entre deux villes, "
                "l'alphabet, les onomatopées « kaka-kaka-kaka-kaka » et « boum boum boum ». "
                "Le vers cesse d'être du langage et devient bruit.",
                "Les trois questions « pendant combien de temps encore ? » : seules "
                "ponctuations fortes de l'extrait, et seule apparition du titre du livre — "
                "« les feux de brousse qui nous ceignent ».",
                "**Écueil à éviter** : commenter la liste sans la citer en entier. Le "
                "correcteur doit voir que le candidat a recopié le vers tel qu'il est.",
            ],
        ),
        dissertation=dict(
            sujet="« Ce qui manque à un texte compte autant que ce qu'il contient. » Cette "
                  "affirmation vous paraît-elle éclairer Poèmes sauvages éclairés au feu de "
                  "brousse ? Vous répondrez en vous appuyant sur l'œuvre et sur vos "
                  "lectures.",
            pistes=[
                "**I.** Ce qui manque dans ce livre est visible dès la première ligne : ni "
                "majuscule, ni point, ni rime, ni strophe régulière, ni titre de partie. "
                "Faire le relevé, avec des chiffres — cinq points d'interrogation dans "
                "quatre-vingt-douze pages.",
                "**II.** Chaque absence est remplacée : le « et » tient lieu de mètre, le "
                "blanc tient lieu de ponctuation, le vers d'un seul mot tient lieu de point. "
                "L'absence n'est donc pas un vide, c'est un déplacement.",
                "**III.** Il manque aussi des choses au récit : le poème ne raconte jamais "
                "l'attentat, ne nomme jamais les assaillants autrement que par un nom "
                "propre devenu symbole, ne donne aucun bilan chiffré. Ces silences-là sont "
                "des choix, et ils protègent les victimes du sort de statistiques.",
                "**Écueil à éviter** : conclure que « le poète a voulu faire moderne ». "
                "Chaque absence doit être reliée à un effet mesurable dans le texte.",
            ],
        ),
    ),
    probatoire=dict(
        commentaire=dict(
            fiche=6,
            consigne="**Faites le commentaire composé de ce texte.** Vous pourrez étudier, "
                     "entre autres, la manière dont un poème né d'un attentat parvient à "
                     "s'achever sur un appel, et le rôle qu'y jouent les vers d'un seul "
                     "mot.",
            pistes=[
                "« ce jour-là », deux fois : un futur annoncé sans jamais être daté.",
                "Le passage au subjonctif — « que nous mourrions », « que nous dansions » — "
                "qui dit le souhait et non le fait.",
                "Le vocabulaire du vivant : la faim, la sève, la gourmandise, le pili-pili, "
                "le baobab. Montrer qu'il s'oppose terme à terme aux corps morts des "
                "premières pages.",
                "« viens », quatre fois, dont trois vers d'un seul mot : un poème de "
                "quatre-vingt-douze pages qui s'achève sur une syllabe.",
                "Un impératif adressé à une morte : ce qui rend la fin bouleversante et non "
                "consolante.",
                "L'oiseau bleu du dernier vers, qui referme le motif ouvert à la première "
                "page, où des balles avaient pris la place des oiseaux dans le ciel.",
                "**Écueil à éviter** : lire cette fin comme un happy end. Rien n'est réparé ; "
                "un appel n'est pas une réponse.",
            ],
        ),
        dissertation=dict(
            sujet="« Le poète ne parle pas pour lui : il parle à la place de ceux qui ne "
                  "peuvent plus parler. » Discutez cette affirmation en vous appuyant sur "
                  "Poèmes sauvages éclairés au feu de brousse et sur les œuvres que vous "
                  "avez lues ou étudiées.",
            pistes=[
                "**I.** L'affirmation se vérifie largement : le livre est dédié à une morte, "
                "il porte son prénom plus de vingt fois, il rend la parole aux mères de "
                "Chibok en reprenant leur cri — « bring back our girls ».",
                "**II.** Mais parler à la place de quelqu'un est aussi une manière de le "
                "faire taire. Henrike ne dit jamais rien dans le livre : elle est regardée, "
                "nommée, appelée. Le poème le sait, et c'est pourquoi il finit par lui "
                "adresser un ordre plutôt qu'un discours : « viens ».",
                "**III.** Le partage exact n'est pas entre parler pour soi et parler pour "
                "les autres, mais entre parler à leur place et parler vers eux. Le « nous » "
                "du poème rassemble sans confisquer ; le « tu » maintient l'autre comme "
                "interlocuteur.",
                "**Ressource** : rapprocher d'un chant funèbre traditionnel de votre région, "
                "où le chanteur prête sa voix au mort. Comparer ce que les deux formes "
                "autorisent.",
            ],
        ),
    ),
)

'''


def main():
    p = "vers_examen.py"
    s = io.open(p, encoding="utf8").read()
    assert "SAUVAGES = dict(" not in s, "entree deja presente"
    ancre = "PAR_CAHIER = {"
    assert ancre in s
    s = s.replace(ancre, BLOC + ancre, 1)
    s = s.replace('    "tartuffe": TARTUFFE,\n}',
                  '    "tartuffe": TARTUFFE,\n    "sauvages": SAUVAGES,\n}', 1)
    io.open(p, "w", encoding="utf8").write(s)
    print("vers_examen.py : rubrique 10 du cahier Poemes sauvages ajoutee")


main()
