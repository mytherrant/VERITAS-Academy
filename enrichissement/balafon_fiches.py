# -*- coding: utf-8 -*-
"""
Fiches 1 à 3 du cahier « Balafon ».

Les poèmes viennent de `balafon_extraits.py`, produit depuis le fichier
source : aucun verset n'est retapé ici. Chaque fiche porte sur un poème
**entier** — c'est l'unité qui compte en poésie, non la longueur.

Fiche 1  À Kong-Fu-Tseu     « Lettres à mes amis »
Fiche 2  Marcinelle, 1956   l'oratorio de la catastrophe
Fiche 3  New York           l'Afrique et l'Amérique noire
"""
import balafon_extraits as X

SRC = X.SRC


def _src(cle):
    return SRC + X.REFERENCES[cle][2] + "."


# ═══════════════════════════════════════════════════ FICHE 1 — À KONG-FU-TSEU
F1 = dict(
    titre="Fiche 1 — « À Kong-Fu-Tseu »",
    repere=X.REPERES["B1"],
    extrait=X.B1,
    source=_src("B1"),
    disposition="vers",

    objectif="Étudier le poème qui ouvre le recueil, et comprendre comment "
             "une lettre en vers peut refuser un préjugé sans jamais accuser "
             "personne.",

    lexique=[
        ["Kong-Fu-Tseu", "Confucius, philosophe chinois du VIᵉ siècle avant "
                         "notre ère. Le poète lui écrit comme à un ami."],
        ["le Levant", "l'Orient, le côté où le soleil se lève. Le Couchant, "
                      "c'est l'Occident — ici, l'Afrique du poète."],
        ["la pagode", "temple d'Extrême-Orient, à toits superposés."],
        ["la conque", "grand coquillage dont on tire un son ; ici, une "
                      "embarcation de bambou."],
        ["le poto-poto", "en Afrique centrale, la boue, la terre détrempée."],
        ["éthiopique", "d'Éthiopie ; par extension, africain, noir."],
        ["le Danger jaune", "expression raciste du début du XXᵉ siècle, qui "
                            "présentait l'Asie comme une menace pour "
                            "l'Occident."],
        ["le calice", "coupe de la messe ; aussi, la coupe de la souffrance."],
        ["Zi-Ka-Wé", "quartier de Shanghai, siège d'une mission jésuite."],
    ],

    situation="C'est le premier poème du recueil, en tête de la section "
              "« Lettres à mes amis ». Un poète africain écrit à Confucius, "
              "c'est-à-dire à la Chine tout entière, et par elle à l'Asie. "
              "Rien n'est encore dit du christianisme ni de l'Afrique-Mère : "
              "le livre commence par une main tendue. Il faut faire remarquer "
              "aux élèves que ce choix d'ouverture engage tout le volume — un "
              "recueil qui commence par une lettre annonce qu'il s'adressera "
              "à quelqu'un jusqu'au bout.",

    mouvements=[
        "**Les questions du seuil.** Le poème s'ouvre sur une série de "
        "« Quelle… », « Quels… », « Quelles… » : avant d'écrire, le poète "
        "demande où poser ce qu'il apporte.",
        "**L'identification par la litanie.** « Tu m'as ouvert ta Chine » : "
        "s'ensuit une longue reprise en « Je suis » — le Bouddha, la pagode, "
        "la conque, le Fouji-Yama, Hong-Kong, Macao. L'Afrique se fait Asie.",
        "**L'offrande et la prière.** « Tu es mon calice », « Tu es mon "
        "offrande », « Tu es mon pardon » : le registre devient religieux, et "
        "le mouvement s'inverse — ce n'est plus « je suis toi » mais « tu es "
        "à moi ».",
        "**Le refus du préjugé et la communion.** « tu n'es plus pour moi le "
        "Danger jaune » ; puis la table partagée, le pain, la coupe, et le "
        "dernier vers : « Nous voici cheminant la main dans la main. »",
    ],

    axes=[
        ("Une lettre, non un discours", [
            "**Le poème est bâti sur une apostrophe tenue de bout en bout.** "
            "« Kong-Fu-Tseu mon ami », « Tu m'as ouvert », « je te salue » : "
            "le destinataire est présent à chaque instant. Ce n'est pas un "
            "poème sur la Chine, c'est un poème adressé à la Chine.",
            "**Le pronom « tu » fait tout le travail.** Comptez-en les "
            "occurrences : il revient plus souvent que « je ». Un texte de "
            "revendication aurait multiplié les « je » ; celui-ci donne la "
            "première place à l'autre.",
            "**La formule qui revient trois fois.** « Tu m'as ouvert toutes "
            "grandes / Les portes du Levant », puis « les portes de ton "
            "Levant », puis « La porte de ton mystère ». La reprise se "
            "resserre : des portes au pluriel, on passe à une seule porte, et "
            "de la géographie au mystère. C'est le mouvement du poème en "
            "trois mots.",
            "**Ce que la forme épistolaire permet.** On ne discute pas avec "
            "un ami comme avec un adversaire. Le poème peut ainsi congédier "
            "un préjugé sans polémique — il le nomme et passe outre.",
        ]),
        ("La litanie « Je suis » : devenir l'autre pour le comprendre", [
            "**Une reprise qui structure tout le deuxième mouvement.** « Je "
            "suis le Bouddha de granit », « Je suis la pagode », « Je suis la "
            "conque de bambou », « Je suis le Fouji-Yama », « Je suis les "
            "Philippines », « Je suis Hong-Kong », « Je suis Macao ». "
            "Relevez-les : il y en a une dizaine.",
            "**Ce n'est pas une comparaison, c'est une identification.** Le "
            "poète n'écrit pas « je suis comme la pagode » : il écrit « je "
            "suis la pagode ». Le verbe être, sans outil de comparaison, "
            "abolit la distance.",
            "**L'énumération va du monument au territoire.** Bouddha, pagode, "
            "conque, puis fleuves, puis îles, puis nations entières. "
            "L'identification s'élargit à mesure : c'est une **gradation**.",
            "**Le retournement du milieu.** Après avoir dit « je suis toi », "
            "le poète dit « tu es mon calice », « tu es mon offrande », « tu "
            "es mon pardon ». L'échange est complet : chacun est devenu le "
            "bien de l'autre. Faire relever aux élèves l'endroit exact où le "
            "poème bascule.",
        ]),
        ("Congédier un préjugé, partager un repas", [
            "**Le préjugé est cité pour être écarté.** « et tu n'es plus pour "
            "moi le Danger jaune dressé contre le fragile roseau de mes "
            "rêves ». Le poème ne fait pas semblant d'ignorer l'expression : "
            "il la reprend, puis la nie par « ne… plus ».",
            "**Le mot « jaune » est retourné en trois vers.** Il désignait "
            "une menace ; il devient « le fruit mûr entre mes mains », « mon "
            "Levant », « mon crépuscule ». Le même adjectif change de valeur "
            "sous nos yeux : c'est le geste le plus fin du poème.",
            "**La communion est concrète, non symbolique.** « Ce matin, nous "
            "nous sommes assis à la table du Seigneur, / Nous avons partagé "
            "le même pain, / Bu à la même coupe ». Trois notations, trois "
            "gestes ordinaires. La fraternité n'est pas proclamée, elle est "
            "faite.",
            "**Le dernier vers dit une égalité de position.** « Et nous "
            "voici, côte à côte, depuis toujours, / Sous le firmament, "
            "portant le poids du monde, Nous voici cheminant la main dans la "
            "main. » Côte à côte, non l'un devant l'autre. « Depuis "
            "toujours » : l'amitié n'a pas commencé, elle est reconnue.",
        ]),
    ],

    forme=[
        "**Le verset, non le vers compté.** Aucune ligne n'a la même longueur "
        "que la précédente. Comparez « Je suis la pagode, » — quatre mots — "
        "et le verset qui décrit les soupirs et la tornade, qui en fait plus "
        "de trente. Ne comptez pas les syllabes : mesurez les longueurs à "
        "l'œil, et demandez ce que produit l'alternance.",
        "**Le rythme vient des reprises.** « Tu m'as ouvert » (trois fois), "
        "« Je suis » (une dizaine), « Toi, mon… » (trois fois de suite). En "
        "l'absence de mètre, ce sont ces retours qui font la scansion.",
        "**L'apostrophe encadre le poème.** « ô mon Levant » au deuxième "
        "verset, « Kong-Fu-Tseu mon ami » avant la fin. Le destinataire est "
        "nommé à l'ouverture et à la clôture.",
        "**Un vocabulaire à deux sources, jamais séparées.** La pagode et le "
        "calice, le bambou et l'autel, le lotus et le pardon. Aucun verset ne "
        "sépare les deux registres : le mot chrétien et le mot asiatique "
        "voisinent dans la même phrase.",
        "**Le champ lexical de l'ouverture traverse tout.** Portes, ouvrir, "
        "porte du mystère, mains, table. Le poème est une porte qui s'ouvre, "
        "et il le dit six fois.",
        "**Une remarque de lecture à voix haute.** Les versets longs se lisent "
        "d'un souffle, les courts se détachent. Faire lire « Je suis la "
        "pagode, » seul, après un verset de trente mots : les élèves "
        "entendent immédiatement ce que le blanc typographique produit.",
    ],

    encadres=[
        ("methode", "Lire un poème en versets", [
            "Quatre gestes, dans l'ordre. Ils valent pour tout le recueil :",
            "- **Mesurer, ne pas compter.** On ne compte pas les syllabes "
            "d'un verset. On regarde quelles lignes sont longues, lesquelles "
            "sont courtes, et où l'alternance change.",
            "- **Chercher les reprises.** Un mot, un groupe, une "
            "construction : c'est là qu'est le rythme.",
            "- **Repérer les blancs.** Une ligne isolée après un long verset "
            "produit un silence. Le blanc typographique fait partie du texte.",
            "- **Lire à voix haute, à deux.** Ce qui ne se voit pas s'entend "
            "aussitôt.",
        ]),
        ("saviez", "Pourquoi Confucius, et pas un poète chinois ?", [
            "Mveng n'écrit pas à un écrivain : il écrit au fondateur d'une "
            "sagesse, mort vingt-cinq siècles plus tôt. Choisir Confucius, "
            "c'est s'adresser à ce que la Chine a de plus ancien, non à son "
            "actualité.",
            "Le poème mentionne pourtant la Chine de son temps — « Toi Chine "
            "rouge » — et l'interroge sur ses blessures : « Dis-nous quels "
            "éléphants d'acier ont brouté tes jardins de bambou ». L'ami "
            "antique et le pays contemporain sont tenus ensemble. C'est un "
            "bon point de départ pour un exposé d'histoire.",
        ]),
    ],

    plan=[
        ("Introduction",
         "Publié en 1972, *Balafon* est le grand recueil poétique d'Engelbert "
         "Mveng, prêtre jésuite, historien et artiste camerounais. Le volume "
         "s'ouvre sur une section intitulée « Lettres à mes amis », dont "
         "« À Kong-Fu-Tseu » est la première pièce : une longue adresse en "
         "versets, où l'Afrique écrit à Confucius, c'est-à-dire à l'Asie. "
         "**Comment un poème adressé peut-il défaire un préjugé sans jamais "
         "accuser personne ?** On étudiera d'abord la forme épistolaire qui "
         "gouverne le texte, puis la litanie par laquelle le poète devient "
         "l'autre, enfin le renversement du préjugé en communion."),
        ("I. Une lettre, non un discours", [
            "**A. Une apostrophe tenue de bout en bout.** « Kong-Fu-Tseu mon "
            "ami », « Tu m'as ouvert », « je te salue » : le destinataire est "
            "toujours là.",
            "**B. La primauté du « tu ».** Le pronom de l'autre l'emporte sur "
            "celui du poète — l'inverse d'un texte de revendication.",
            "**C. La formule qui se resserre.** Des « portes du Levant » à "
            "« la porte de ton mystère » : la reprise conduit de la "
            "géographie à l'intime.",
        ]),
        ("II. Devenir l'autre : la litanie « Je suis »", [
            "**A. Une dizaine de reprises.** Bouddha, pagode, conque, "
            "Fouji-Yama, Hong-Kong, Macao : l'énumération s'élargit du "
            "monument au territoire.",
            "**B. L'identification, non la comparaison.** Le verbe être sans "
            "outil de comparaison abolit la distance.",
            "**C. Le retournement.** « Tu es mon calice », « mon offrande », "
            "« mon pardon » : après s'être fait l'autre, le poète le reçoit.",
        ]),
        ("III. Du préjugé à la table partagée", [
            "**A. Le préjugé nommé puis nié.** « tu n'es plus pour moi le "
            "Danger jaune » : la citation permet la réfutation.",
            "**B. Le mot « jaune » retourné.** De menace, il devient fruit "
            "mûr, Levant, crépuscule.",
            "**C. Une fraternité en gestes.** Le pain, la coupe, la main dans "
            "la main : la communion se dit par des actes ordinaires.",
        ]),
        ("Conclusion",
         "Le poème liminaire de *Balafon* donne au recueil son geste "
         "fondateur : écrire à l'autre plutôt que contre lui. La forme "
         "épistolaire, la litanie de l'identification et le retournement du "
         "préjugé y concourent au même effet — abolir une distance sans nier "
         "ce qui la fondait. On le rapprochera de « À Roland-Roger », adressé "
         "cette fois à l'Europe, où le même geste devra affronter une "
         "histoire autrement lourde."),
    ],

    ouverture="À rapprocher de « À Roland-Roger » et de « Moteczuma », les "
              "deux autres lettres du recueil : on verra si le geste "
              "d'ouverture tient quand le destinataire est l'Europe "
              "colonisatrice ou l'Amérique détruite. Et, hors du recueil, des "
              "poèmes de Senghor adressés à l'Europe : la comparaison éclaire "
              "ce que Mveng garde de la Négritude et ce qu'il en déplace.",

    comprendre=[
        "À qui ce poème est-il adressé ? Relevez les deux vers où le "
        "destinataire est nommé.",
        "Quelle formule le poète répète-t-il trois fois pour dire ce que la "
        "Chine lui a offert ?",
        "Relevez cinq groupes commençant par « Je suis ». À quoi le poète "
        "s'identifie-t-il ?",
        "Quel préjugé le poète déclare-t-il abandonner ? Citez le vers.",
        "Que partagent les deux amis dans les derniers versets ? Relevez "
        "trois gestes.",
    ],

    analyser=[
        "a) Comptez les occurrences de « Tu m'as ouvert ». b) Ce qui est "
        "ouvert est-il le même à chaque fois ? c) Que montre cette "
        "progression ?",
        "a) Relevez tous les groupes en « Je suis ». b) Comment appelle-t-on "
        "la reprise d'un même mot en tête de plusieurs lignes ? c) Pourquoi "
        "le poète emploie-t-il le verbe *être* plutôt que *ressembler à* ?",
        "« Jaune tu es le fruit mûr entre mes mains modelé depuis des "
        "millénaires ». a) Quel mot est repris du vers précédent ? b) Quelle "
        "valeur avait-il ? Quelle valeur reçoit-il ici ? c) Comment "
        "nomme-t-on ce travail sur un mot ?",
        "a) Relevez les mots du vocabulaire chrétien, puis ceux du "
        "vocabulaire asiatique. b) Sont-ils séparés dans le poème, ou mêlés ? "
        "c) Que traduit ce mélange sur la pensée du poète ?",
        "Mesurez la longueur des cinq derniers versets, en mots. a) Quel est "
        "le plus court ? b) Où se trouve-t-il ? c) Que produit sa brièveté à "
        "cet endroit ?",
        "« Nous voici cheminant la main dans la main. » a) Analysez la "
        "position des deux personnes. b) Comparez avec « côte à côte » du "
        "vers précédent. c) Pourquoi le poème ne se termine-t-il pas sur une "
        "affirmation d'égalité, mais sur une image de marche ?",
    ],

    parcours1=[
        "a) Recopiez les trois occurrences de « Tu m'as ouvert » avec ce qui "
        "les suit, l'une sous l'autre.",
        "b) Apprenez les quatre derniers versets et récitez-les en marquant "
        "le silence après « côte à côte ».",
    ],

    parcours2=[
        "a) Montrez que le poème opère un double mouvement — l'Afrique se "
        "fait Asie, puis l'Asie devient le bien de l'Afrique — et repérez le "
        "verset exact où il bascule.",
        "b) « Un poème qui s'adresse à quelqu'un ne peut pas l'accuser. » "
        "Discutez cette affirmation en une vingtaine de lignes, à partir de "
        "ce texte et d'un autre de votre choix.",
    ],

    synthese="Le poème nomme le préjugé qu'il refuse. Aurait-il été plus fort "
             "en l'ignorant ?",

    examen="**Vers le commentaire composé.** Rédigez entièrement le premier "
           "centre d'intérêt du plan ci-dessus, en trois sous-centres. Chaque "
           "sous-centre s'ouvre par une idée directrice, s'appuie sur deux "
           "citations exactes, et nomme l'outil d'analyse avant d'en donner "
           "l'effet. On attend de 300 à 350 mots.",
)


# ═════════════════════════════════════════════════ FICHE 2 — MARCINELLE, 1956
F2 = dict(
    titre="Fiche 2 — « Marcinelle, 1956 »",
    repere=X.REPERES["B2"],
    extrait=X.B2,
    source=_src("B2"),
    disposition="vers",

    objectif="Étudier un poème à plusieurs voix, et comprendre pourquoi un "
             "texte sur une catastrophe peut refuser d'accuser.",

    lexique=[
        ["Marcinelle", "commune de Belgique. Le 8 août 1956, un incendie dans "
                       "la mine du Bois du Cazier y fit des centaines de "
                       "morts, en majorité des ouvriers immigrés."],
        ["Requiescant in pace", "« Qu'ils reposent en paix » : formule latine "
                               "des funérailles."],
        ["liminaire", "qui est au seuil, au commencement."],
        ["hercynien", "se dit de très anciennes forêts et montagnes "
                      "d'Europe."],
        ["Basuto", "peuple d'Afrique australe ; le Katanga est une région "
                   "minière du Congo."],
        ["hallier", "buisson épais."],
        ["taraudant", "qui perce en tournant, comme une vis."],
        ["Jéricho", "ville dont les murailles, dans la Bible, tombent au son "
                    "des trompettes."],
        ["conflagration", "embrasement, explosion générale."],
    ],

    situation="Le poème porte une date et un lieu : le 8 août 1956, un "
              "incendie dans la mine du Bois du Cazier, à Marcinelle en "
              "Belgique, tue des centaines d'ouvriers, pour beaucoup des "
              "immigrés. Mveng en fait un **oratorio** — une œuvre à "
              "plusieurs voix, avec des chœurs. Les indications « Prélude », "
              "« Chœur », « Chœurs et tam-tams » ne sont pas décoratives : "
              "elles distribuent la parole. Il faut le faire lire à plusieurs "
              "élèves, en alternance, dès la première séance.",

    mouvements=[
        "**Le prélude, et un refus.** Le poème s'ouvre sur un mot seul — "
        "« Prélude. » — puis sur « Non ! ». Le premier geste du texte est un "
        "refus, avant même qu'on sache ce qui est refusé.",
        "**Le premier chœur : ne pas troubler le silence.** « Que nulle voix, "
        "dans le sanctuaire de vos nuits / Ne trouble ce silence plus saint "
        "que ma prière ! » Le poète demande la permission de parler.",
        "**La demande de paix.** « Paix ! » ouvre une longue invocation sur "
        "les seuils défoncés, les foyers éteints, les cœurs troués.",
        "**Le procès refusé.** « Allons-nous T'accuser au tribunal des "
        "hommes ? » Suit une longue série de « Pourquoi », puis un « Non ! » "
        "qui les annule tous.",
        "**Le chœur de l'espérance.** « Car il faut bien / Que le feu brûle "
        "encore dans les foyers du monde » : ce qui vient après la nuit.",
        "**La clôture.** Le refrain « POUR QUE DESCENDE TA PAIX SUR LA TERRE "
        "DES HOMMES ! » revient, puis se transforme en « POUR QUE REPOSE EN "
        "PAIX / CETTE TERRE DES HOMMES. »",
    ],

    axes=[
        ("Un poème qui distribue la parole", [
            "**Les indications de voix sont dans le texte.** « Prélude. », "
            "« Chœur. », « Chœurs et tam-tams. » : le poème est écrit pour "
            "être dit à plusieurs. C'est un **oratorio**, forme musicale et "
            "religieuse.",
            "**Le « nous » l'emporte sur le « je ».** « Nous voulons être "
            "seulement », « Nous ne dirons pas », « Nous disons ». Une "
            "catastrophe collective appelle une voix collective : le poète "
            "s'efface derrière le chœur.",
            "**Un « je » subsiste pourtant, et il est modeste.** « Que ma "
            "voix, / À vos voix si fraternelle - / Ne viole l'heure liminaire "
            "du repos ! » Le poète demande la permission de joindre sa voix "
            "aux autres. Faire relever aux élèves ce déplacement.",
            "**Les tam-tams entrent avec le dernier chœur.** L'indication "
            "« Chœurs et tam-tams » place l'instrument africain dans une "
            "liturgie de deuil européenne. Le poème ne dit pas cette "
            "rencontre : il la fait entendre.",
        ]),
        ("Le refus d'accuser, et ce qu'il coûte", [
            "**La question est posée franchement.** « Allons-nous T'accuser "
            "au tribunal des hommes ? » Le poème envisage le procès de Dieu, "
            "et il le nomme.",
            "**Les griefs sont énoncés avant d'être retirés.** Suivent des "
            "« Pourquoi » qui n'épargnent rien : le paradis devenu « caveau "
            "glouton des innocents », les gouvernements, les finances, les "
            "machines, « la meute de la faim ». C'est un réquisitoire "
            "complet.",
            "**Puis tout est annulé d'un mot.** « Non ! Nous ne dirons "
            "pas : » — et le poème choisit le silence : « Nous ne "
            "proférerons que ce silence parmi le flamboiement de nos nuits "
            "sans étoiles. »",
            "**Ce refus n'est pas une soumission.** Ce qui remplace "
            "l'accusation n'est pas l'acceptation, mais une exigence : « Au "
            "pied de ton Calvaire / Nous dresserons le flambeau de notre être "
            "consumé POUR QUE DESCENDE TA PAIX SUR LA TERRE DES HOMMES ! » Le "
            "poème ne demande pas pardon, il demande la paix. La nuance est "
            "décisive et un devoir doit la faire.",
        ]),
        ("De la mort des mineurs à la paix du monde", [
            "**Le poème élargit sans quitter les morts.** Après Marcinelle "
            "viennent « les mineurs Basuto », « ceux du Katanga », « les "
            "peuples de fourmis creusant les Cordillères », « ceux du monde "
            "entier ». La catastrophe belge devient celle de tous les hommes "
            "qui descendent sous terre.",
            "**Le dernier chœur nomme le monde contemporain.** Les banques "
            "sabotées, les canons du Canal, les Océans « Gonflés d'atomiques "
            "conflagrations », les peuples opprimés, les tribus décimées. "
            "Nous sommes en pleine guerre froide, et le poème le dit.",
            "**Le refrain se transforme à la fin.** « POUR QUE DESCENDE TA "
            "PAIX SUR LA TERRE DES HOMMES » devient « POUR QUE REPOSE EN "
            "PAIX / CETTE TERRE DES HOMMES ». La formule des funérailles — "
            "*requiescat in pace* — s'applique désormais à la terre entière. "
            "C'est la trouvaille du poème, et elle est terrible.",
            "**L'espérance n'est pas gaie.** « Que croulent à l'horizon les "
            "murs de Jéricho » : ce qu'on attend, c'est un écroulement. Les "
            "élèves confondent souvent espérance et optimisme ; ce poème "
            "permet de les distinguer.",
        ]),
    ],

    forme=[
        "**Les capitales portent le refrain.** « POUR QUE DESCENDE TA PAIX "
        "SUR LA TERRE DES HOMMES ! » est imprimé en majuscules, deux fois. "
        "Dans un poème sans mètre, la typographie remplace la scansion : ce "
        "qui est en capitales se dit plus fort.",
        "**La ponctuation expressive est massive.** Comptez les points "
        "d'exclamation, les tirets isolés, les « Non ! » seuls sur leur "
        "ligne. Le texte est une partition autant qu'un poème.",
        "**Les versets très courts créent les silences.** « Paix ! », "
        "« Mais », « Non ! », « Il faut » : posés seuls, ils obligent le "
        "lecteur à s'arrêter. Faire compter aux élèves combien de lignes font "
        "moins de trois mots.",
        "**L'anaphore du « Pourquoi ».** Elle organise tout le mouvement du "
        "procès. Puis elle est interrompue net par « Non ! » : la figure "
        "s'arrête, et cet arrêt est le sens du passage.",
        "**Le parallélisme des « Il faut ».** « Que germent les moissons, / "
        "Que le pain cuise, / Que le vin fasse fleurir les lèvres "
        "desséchées » : trois subjonctifs, trois besoins élémentaires. Le "
        "pain et le vin sont aussi ceux de la messe — le double sens est "
        "voulu.",
        "**Une image à relever pour elle-même.** « Sous l'indifférence des "
        "buildings-termitières » : le mot composé rapproche la ville moderne "
        "et la termitière africaine. En trois syllabes, le poème juge une "
        "civilisation.",
    ],

    encadres=[
        ("saviez", "Ce qui s'est passé au Bois du Cazier", [
            "Le 8 août 1956, un incendie se déclare dans la mine du Bois du "
            "Cazier, à Marcinelle, en Belgique. Les morts se comptent par "
            "centaines. La majorité d'entre eux sont des travailleurs "
            "immigrés, venus travailler sous terre loin de chez eux.",
            "Le poème ne raconte rien de cela : ni la date exacte, ni le "
            "nombre, ni le déroulement. Il ne garde que le nom du lieu, "
            "l'année, et la formule des funérailles. Un exposé peut utilement "
            "raconter les faits, puis se demander pourquoi le poète les a "
            "tus.",
        ]),
        ("methode", "Analyser un texte à plusieurs voix", [
            "Quand un poème porte des indications de voix, trois questions "
            "s'imposent, et elles rapportent des points :",
            "- **Qui parle ?** Relever chaque changement de locuteur.",
            "- **Qui est visé ?** Le chœur s'adresse-t-il aux morts, à Dieu, "
            "aux vivants ? Cela change à chaque partie.",
            "- **Qu'est-ce qui n'est pas dit, et par qui ?** Ici, le poème "
            "est bâti sur ce qu'il refuse de proférer.",
            "Ne jamais traiter un oratorio comme un monologue : ce serait "
            "manquer sa forme même.",
        ]),
    ],

    plan=[
        ("Introduction",
         "Le 8 août 1956, un incendie dans la mine du Bois du Cazier, à "
         "Marcinelle en Belgique, tue des centaines d'ouvriers, pour beaucoup "
         "immigrés. Engelbert Mveng en tire, dans *Balafon* (1972), non pas "
         "un récit mais un **oratorio** : un poème à plusieurs voix, ponctué "
         "d'indications de chœur, qui refuse d'accuser et demande la paix. "
         "**Comment un poème peut-il dire une catastrophe sans la raconter, "
         "et pleurer des morts sans désigner de coupable ?** Nous étudierons "
         "d'abord la distribution de la parole, puis le procès refusé, enfin "
         "l'élargissement qui fait de Marcinelle le deuil du monde entier."),
        ("I. Un poème qui distribue la parole", [
            "**A. Un oratorio, non un monologue.** Les indications « Prélude », "
            "« Chœur », « Chœurs et tam-tams » sont dans le texte.",
            "**B. La primauté du « nous ».** Le poète s'efface derrière le "
            "chœur ; son « je » ne demande que la permission de parler.",
            "**C. L'entrée des tam-tams.** L'instrument africain rejoint une "
            "liturgie de deuil européenne : la rencontre est faite, non "
            "commentée.",
        ]),
        ("II. Le procès refusé", [
            "**A. La question est posée.** « Allons-nous T'accuser au "
            "tribunal des hommes ? »",
            "**B. Le réquisitoire est énoncé.** L'anaphore des « Pourquoi » "
            "n'épargne ni les gouvernements, ni les machines, ni la faim.",
            "**C. Puis annulé d'un mot.** « Non ! » interrompt la figure ; le "
            "silence remplace l'accusation, mais la demande de paix demeure — "
            "ce n'est pas une soumission.",
        ]),
        ("III. De Marcinelle à la terre des hommes", [
            "**A. L'élargissement aux mineurs du monde.** Basuto, Katanga, "
            "Cordillères : le deuil belge devient universel.",
            "**B. Le monde contemporain nommé.** Banques, canons, « Océans "
            "gonflés d'atomiques conflagrations » : la guerre froide entre "
            "dans le poème.",
            "**C. Le refrain retourné.** De « POUR QUE DESCENDE TA PAIX » à "
            "« POUR QUE REPOSE EN PAIX / CETTE TERRE DES HOMMES » : la "
            "formule des funérailles s'applique à la terre entière.",
        ]),
        ("Conclusion",
         "En choisissant l'oratorio, Mveng donne à une catastrophe minière la "
         "forme d'une liturgie, et à des ouvriers immigrés la dignité d'un "
         "chœur. Le poème refuse le réquisitoire qu'il a lui-même formulé, "
         "non par résignation, mais parce qu'il attend autre chose qu'une "
         "condamnation : la paix. On le rapprochera de « New York », où la "
         "même exigence de paix s'adresse cette fois à une ville vivante."),
    ],

    ouverture="À rapprocher de « New York », qui reprend le mot « paix » "
              "comme un refrain, et de « Moteczuma », autre poème des peuples "
              "détruits. Pour élargir, on comparera avec un chant funèbre "
              "traditionnel : là aussi, un chœur prête sa voix aux morts.",

    comprendre=[
        "Quel événement le titre désigne-t-il ? En quelle année ?",
        "Relevez toutes les indications de voix présentes dans le poème.",
        "Quelle question le chœur envisage-t-il de poser à Dieu ? Citez le "
        "vers.",
        "Quelle réponse le poème donne-t-il finalement à cette question ?",
        "Quelle phrase revient en majuscules ? Comment est-elle transformée à "
        "la fin ?",
    ],

    analyser=[
        "a) Relevez les cinq groupes commençant par « Pourquoi ». b) Comment "
        "appelle-t-on cette reprise ? c) Par quel mot est-elle interrompue, "
        "et que produit cette interruption ?",
        "a) Comparez les deux versions du refrain en majuscules. b) Quels "
        "mots changent ? c) Le sens est-il le même ? Justifiez précisément.",
        "« Sous l'indifférence des buildings-termitières ». a) De quels deux "
        "mots ce composé est-il fait ? b) À quels mondes appartiennent-ils ? "
        "c) Quel jugement porte ce rapprochement ?",
        "a) Relevez les versets de moins de trois mots. b) Où se "
        "trouvent-ils ? c) Que produisent-ils dans un poème sans mètre "
        "régulier ?",
        "« Que germent les moissons, / Que le pain cuise, / Que le vin fasse "
        "fleurir les lèvres desséchées ». a) À quel mode sont ces verbes ? "
        "b) Ces trois biens ont-ils un second sens ? Lequel ? c) Pourquoi ce "
        "double sens convient-il au poème ?",
        "Le poème ne dit ni le nombre des morts, ni la cause de l'incendie. "
        "a) Que dit-il à la place ? b) Que gagne-t-il à ce silence ? c) Que "
        "perd-il ?",
    ],

    parcours1=[
        "a) Recopiez le poème en marquant d'une couleur chaque changement de "
        "voix.",
        "b) Lisez à trois, à voix haute : un récitant, deux chœurs. Notez où "
        "vous devez ralentir.",
    ],

    parcours2=[
        "a) Démontrez que le poème formule un réquisitoire complet avant de "
        "le retirer, et dites ce que ce retrait produit sur le lecteur.",
        "b) « Le silence est une réponse plus forte que l'accusation. » "
        "Discutez cette formule à partir du poème, en une trentaine de "
        "lignes.",
    ],

    synthese="Le poème refuse d'accuser après avoir tout dit de ce qu'il "
             "pourrait reprocher. Ce refus vous paraît-il un renoncement ou "
             "une exigence plus haute ?",

    examen="**Vers la dissertation.** « La poésie ne peut rien contre le "
           "malheur ; elle peut seulement l'empêcher d'être muet. » Vous "
           "discuterez cette affirmation en vous appuyant sur « Marcinelle, "
           "1956 » et sur vos lectures personnelles. On attend une "
           "introduction rédigée et un plan détaillé en trois parties.",
)


# ═══════════════════════════════════════════════════════ FICHE 3 — NEW YORK
F3 = dict(
    titre="Fiche 3 — « New York »",
    repere=X.REPERES["B3"],
    extrait=X.B3,
    source=_src("B3"),
    disposition="vers",

    objectif="Étudier un poème bâti sur un mot répété, et comprendre comment "
             "une ville peut être décrite comme un corps à réveiller.",

    lexique=[
        ["Likembe", "petit instrument à lamelles métalliques, pincées avec "
                    "les pouces ; on l'appelle aussi sanza."],
        ["parturition", "accouchement."],
        ["Black Panthers", "mouvement de lutte des Noirs américains, fondé en "
                           "1966."],
        ["Martin Luther King", "pasteur et militant américain des droits "
                              "civiques, assassiné en 1968."],
        ["Malcolm X", "militant noir américain, assassiné en 1965."],
        ["Armstrong", "Louis Armstrong, trompettiste et chanteur de jazz."],
        ["Cocody", "quartier d'Abidjan ; El-Mina est une ville côtière du "
                   "Ghana, ancien comptoir négrier."],
        ["Béhémoth", "bête monstrueuse du livre de Job ; ici, la ville."],
        ["initiatique", "qui fait entrer dans une communauté, par un rite."],
    ],

    situation="Daté de 1970, le poème appartient au moment où l'Amérique "
              "noire est en lutte : Martin Luther King a été assassiné deux "
              "ans plus tôt, Malcolm X cinq ans plus tôt, et les Black "
              "Panthers sont au cœur de l'actualité. Mveng n'écrit pas un "
              "reportage : il s'adresse à Manhattan comme à un être vivant et "
              "endormi, et lui annonce que la paix ne viendra pas sans "
              "l'Afrique. C'est le poème le plus dense du recueil en noms "
              "propres contemporains.",

    mouvements=[
        "**La ville fondée par l'Afrique.** « Ici la forêt vierge a la "
        "densité que j'ordonne verticale d'acier » : le gratte-ciel est "
        "présenté comme une forêt, et le « je » africain s'en dit "
        "l'ordonnateur.",
        "**La sommation.** « Likembe du Congo, entonnez… » : les instruments "
        "africains reçoivent l'ordre de faire entendre un nom sur « le désert "
        "des buildings ».",
        "**Le refrain de la paix, première série.** « La paix ne viendra pas "
        "sur toi, ô Manhattan, / Sans le surgissement de mes tribus » : suit "
        "l'énumération des figures noires américaines.",
        "**L'Atlantique cousu.** « Me voici Atlantique entre les deux "
        "Occidents cousant les franges du destin » : le poète se fait "
        "l'océan lui-même, et le raccommodeur.",
        "**Le refrain, seconde et troisième séries.** Les paix africaines — "
        "Cocody, El-Mina, les cocotiers, la lune —, puis la paix refusée à "
        "Manhattan sans « le vagissement initiatique de mes tam-tams ».",
    ],

    axes=[
        ("Une ville regardée comme un corps endormi", [
            "**Manhattan est traitée en personne.** Le poème l'apostrophe — "
            "« ô Manhattan » — et lui prête un sommeil, un front, un berceau, "
            "une nuit. C'est une **personnification** tenue de bout en bout.",
            "**Le vocabulaire de la naissance traverse le texte.** "
            "« parturition », « berceau », « maternelle », « vagissement "
            "initiatique », « ton nom nouveau ». La ville n'est pas décrite "
            "comme une puissance : elle est décrite comme un nouveau-né qui "
            "n'a pas encore crié.",
            "**Le gratte-ciel devient forêt.** « Ici la forêt vierge a la "
            "densité que j'ordonne verticale d'acier, horizontale de "
            "lianes ». L'image renverse le rapport habituel : ce n'est pas "
            "l'Afrique qui est comparée à la nature, c'est la ville "
            "américaine qui est ramenée à une forêt.",
            "**Le mot « Béhémoth » achève le portrait.** La bête monstrueuse "
            "du livre de Job, endormie. Une ville-monstre qui dort : c'est "
            "l'image finale du poème.",
        ]),
        ("Un refrain qui organise tout le poème", [
            "**« La paix » revient sans cesse.** Faites-en le relevé complet "
            "avec les élèves : le mot apparaît isolé — « La paix, la paix, la "
            "paix… » —, puis dans la formule « La paix ne viendra pas », "
            "reprise trois fois.",
            "**La formule est toujours négative.** Jamais « la paix "
            "viendra » : toujours « ne viendra pas… sans ». Le poème énonce "
            "une condition, non une promesse. C'est ce qui le distingue d'un "
            "vœu.",
            "**Ce qui suit « sans » change à chaque reprise.** D'abord les "
            "figures de la lutte — Black Panthers, blues, jazz, Martin Luther "
            "King, Malcolm X ; puis la voix d'Armstrong et le chant du coq ; "
            "enfin les tam-tams. On passe du politique au musical, puis au "
            "rituel.",
            "**La répétition du mot seul crée un rythme.** « La paix, la "
            "paix, la paix… » : trois fois, sans verbe. Dans un poème sans "
            "mètre, cette scansion tient lieu de refrain.",
        ]),
        ("L'Afrique au berceau de l'Amérique", [
            "**La thèse du poème est énoncée sans détour.** « Et sans "
            "l'Afrique sur le berceau de l'Amérique penchée et maternelle, / "
            "Sans mon Afrique, / Nul souffle de vie ne montera de ce "
            "berceau ! » L'Amérique est présentée comme l'enfant, l'Afrique "
            "comme la mère.",
            "**Les noms propres font la démonstration.** Le jazz, le blues, "
            "Armstrong : la culture américaine que le monde admire est "
            "d'origine africaine. Le poème ne l'argumente pas, il l'énumère — "
            "et l'énumération suffit.",
            "**L'Atlantique devient une couture.** « Me voici Atlantique "
            "entre les deux Occidents cousant les franges du destin, / Me "
            "voici unissant fil après fil / Mes langes déchirées par la "
            "fureur de tes ressacs. » L'océan de la traite négrière est "
            "retourné en lien : ce qui séparait rassemble.",
            "**Le mot « langes » est capital.** Un lange est un linge de "
            "nouveau-né. Déchiré par les ressacs, il rappelle la traversée "
            "forcée ; recousu fil après fil, il devient l'ouvrage du poète. "
            "Toute l'histoire de la déportation tient dans cette image, sans "
            "qu'un seul mot la nomme.",
        ]),
    ],

    forme=[
        "**Le verset s'allonge et se brise sans règle.** Un verset énumère "
        "sur trois lignes ; le suivant tient en trois mots — « Sans mon "
        "Afrique, ». Repérez ces ruptures : elles tombent toujours sur "
        "l'essentiel.",
        "**L'anaphore de « La paix ne viendra pas ».** Trois occurrences, à "
        "des distances inégales. La reprise crée l'attente, l'inégalité des "
        "distances empêche la monotonie.",
        "**Une apostrophe centrale.** « ô Manhattan » : le seul vocatif du "
        "poème, placé au moment où la condition est posée.",
        "**Les noms propres fonctionnent par accumulation.** Congo, Niger, "
        "Zambèze, Manhattan, Cocody, El-Mina : les fleuves africains et les "
        "lieux américains sont mêlés dans la même phrase. La géographie du "
        "poème est déjà son propos.",
        "**Les impératifs donnent le ton.** « entonnez », « forgez » : le "
        "poète ne décrit pas, il commande — à des instruments, ce qui est une "
        "audace.",
        "**Un mot composé à relever.** « buildings-termitières » n'est pas "
        "dans ce poème mais dans « Marcinelle » ; ici, c'est « le désert des "
        "buildings » et « le roc des crânes dénudés enveloppés de dollars ». "
        "Faire comparer les deux façons de dire la ville moderne.",
    ],

    encadres=[
        ("saviez", "1970 : ce que le poème a sous les yeux", [
            "Martin Luther King a été assassiné en 1968, Malcolm X en 1965. "
            "Le Black Panther Party, fondé en 1966, est au cœur de "
            "l'actualité américaine. Louis Armstrong, lui, est encore "
            "vivant : il mourra l'année suivante.",
            "Le poème cite ces noms sans les expliquer : il compte sur ce que "
            "son lecteur sait. Un exposé peut utilement rendre à chacun son "
            "histoire, puis se demander ce que produit leur mise en série — "
            "un pasteur, un militant, un trompettiste, un mouvement armé.",
        ]),
        ("astuce", "Faire le relevé d'un mot répété", [
            "Quand un mot revient, ne vous contentez pas de le noter. Faites "
            "un tableau à trois colonnes :",
            "**le mot** | **ce qui l'entoure** | **où il se trouve dans le "
            "poème**.",
            "Ici : « paix » seul, « paix » dans « ne viendra pas sans… », "
            "« paix atlantique ». Trois emplois différents, trois effets. "
            "C'est ce tableau, et non le simple comptage, qui fournit un "
            "sous-centre d'intérêt entier.",
        ]),
    ],

    plan=[
        ("Introduction",
         "Daté de 1970, « New York » appartient à *Balafon*, recueil publié "
         "en 1972 par le jésuite camerounais Engelbert Mveng. Le poème "
         "s'adresse à Manhattan au moment où l'Amérique noire est en lutte, "
         "deux ans après l'assassinat de Martin Luther King. En versets "
         "libres, il présente la ville comme un corps endormi et répète, "
         "comme un refrain, que la paix n'y viendra pas sans l'Afrique. "
         "**Comment un poème peut-il faire d'une ville toute-puissante un "
         "nouveau-né qui n'a pas encore crié ?** Nous étudierons d'abord la "
         "ville personnifiée, puis le refrain qui organise le texte, enfin la "
         "thèse d'une Afrique au berceau de l'Amérique."),
        ("I. Une ville regardée comme un corps endormi", [
            "**A. Une personnification tenue.** L'apostrophe « ô Manhattan », "
            "le sommeil, le front, la nuit.",
            "**B. Le champ lexical de la naissance.** Parturition, berceau, "
            "maternelle, vagissement : la ville est un enfant à naître.",
            "**C. Le renversement de l'image attendue.** Le gratte-ciel "
            "devient forêt vierge ; ce n'est pas l'Afrique qu'on ramène à la "
            "nature, c'est l'Amérique.",
        ]),
        ("II. Un refrain qui organise le poème", [
            "**A. « La paix », répété jusqu'à la scansion.** Le mot isolé "
            "trois fois, puis la formule reprise trois fois.",
            "**B. Une formule toujours négative.** « ne viendra pas… sans » : "
            "le poème pose une condition, il ne fait pas une promesse.",
            "**C. Une gradation dans les conditions.** Du politique — Black "
            "Panthers, Malcolm X — au musical, puis au rituel : les tam-tams.",
        ]),
        ("III. L'Afrique au berceau de l'Amérique", [
            "**A. Une thèse énoncée sans détour.** « Sans mon Afrique, / Nul "
            "souffle de vie ne montera de ce berceau ! »",
            "**B. Les noms propres pour preuve.** Le jazz, le blues, "
            "Armstrong : l'énumération tient lieu d'argument.",
            "**C. L'Atlantique retourné en couture.** L'océan de la traite "
            "devient le fil qui recoud « mes langes déchirées » : l'histoire "
            "de la déportation est dite sans être nommée.",
        ]),
        ("Conclusion",
         "Le poème inverse tous les rapports attendus : la ville la plus "
         "puissante du monde y est un enfant, la forêt vierge y est faite "
         "d'acier, et l'océan de la déportation y devient une couture. Cette "
         "inversion n'est pas un jeu : elle fonde la thèse du texte, selon "
         "laquelle l'Amérique doit à l'Afrique le souffle qui la fera vivre. "
         "On rapprochera ce poème de « Marcinelle, 1956 », où la même "
         "exigence de paix s'adressait cette fois à des morts."),
    ],

    ouverture="À rapprocher de « Marcinelle, 1956 », qui demande aussi la "
              "paix, et de « Moteczuma », adressé à l'autre Amérique, la "
              "précolombienne. Hors du recueil, on comparera avec « À New "
              "York » de Senghor : deux poètes africains devant la même "
              "ville, à quelques années de distance.",

    comprendre=[
        "À quelle ville le poème s'adresse-t-il ? Relevez le vers où elle est "
        "nommée directement.",
        "Quel mot est répété tout au long du poème ? Comptez ses occurrences.",
        "Citez trois noms de la lutte des Noirs américains présents dans le "
        "texte.",
        "À quoi le poète compare-t-il les gratte-ciel dans les premiers "
        "versets ?",
        "Selon le poème, que manque-t-il à New York pour connaître la paix ?",
    ],

    analyser=[
        "a) Relevez les trois phrases commençant par « La paix ne viendra "
        "pas ». b) Qu'est-ce qui change après « sans » à chaque fois ? "
        "c) Quelle progression ce changement dessine-t-il ?",
        "a) Relevez tous les mots appartenant au champ lexical de la "
        "naissance. b) Qui est l'enfant, qui est la mère ? c) En quoi cette "
        "répartition est-elle inattendue ?",
        "« Me voici unissant fil après fil / Mes langes déchirées par la "
        "fureur de tes ressacs. » a) Qu'est-ce qu'un lange ? b) Qui les a "
        "déchirées, et à quel épisode historique cela renvoie-t-il ? "
        "c) Pourquoi le poème ne nomme-t-il pas cet épisode ?",
        "a) Relevez les verbes à l'impératif. b) À qui sont-ils adressés ? "
        "c) Que produit le fait de commander à des instruments ?",
        "« ton sommeil de Béhémoth ». a) Cherchez qui est Béhémoth. b) Que "
        "dit cette comparaison de la ville ? c) Le poème la craint-il ou la "
        "plaint-il ? Justifiez.",
        "Comparez la longueur du verset qui énumère les figures noires et "
        "celle de « Sans mon Afrique, ». a) Combien de mots chacun ? b) Que "
        "produit ce contraste ? c) Sur quel mot le poème veut-il qu'on "
        "s'arrête ?",
    ],

    parcours1=[
        "a) Recopiez toutes les phrases contenant le mot « paix », l'une sous "
        "l'autre.",
        "b) Cherchez qui étaient Martin Luther King, Malcolm X et Louis "
        "Armstrong. Une phrase pour chacun.",
    ],

    parcours2=[
        "a) Montrez que le poème renverse trois rapports habituels — la ville "
        "et la forêt, la puissance et l'enfance, l'océan qui sépare et le fil "
        "qui coud —, et dites ce que ces renversements servent à établir.",
        "b) « Un poème n'a pas à citer l'actualité : elle vieillit plus vite "
        "que lui. » Discutez cette affirmation à partir de « New York », en "
        "une trentaine de lignes.",
    ],

    synthese="Le poème refuse la paix à Manhattan tant que l'Afrique n'y sera "
             "pas entendue. Est-ce une menace, une prophétie ou une prière ?",

    examen="**Vers le commentaire composé.** Rédigez entièrement le deuxième "
           "centre d'intérêt du plan ci-dessus, puis la conclusion. Vous "
           "citerez au moins une fois chacune des trois reprises du refrain. "
           "On attend de 400 à 450 mots.",
)

FICHES_BA_1_3 = [F1, F2, F3]
