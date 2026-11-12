/* Leçons rédigées VÉRITAS — langues vivantes, langues et cultures nationales, orientation-conseil. */
VRT_L("3e-en-articles", {
  c: "3e", m: "anglais", cle: "Definite and indefinite articles", titre: "Definite and indefinite articles: a, an, the", duree: 15,
  accroche: "A mango, an orange, the market: three little words, many rules.",
  intro: "« I bought <em>a</em> mango at <em>the</em> market. » In English, small words called articles tell us if we are speaking about something new or something we already know.",
  objectifs: ["use a / an correctly", "use the for known or unique things", "know when to use no article"],
  parties: [
    { t: "A or an?", html:
      "<p>We use <strong>a / an</strong> with a singular countable noun mentioned for the first time.</p><ul><li><strong>a</strong> before a consonant <em>sound</em>: a book, a university (« you »), a European.</li><li><strong>an</strong> before a vowel <em>sound</em>: an apple, an hour (the h is silent), an honest man.</li></ul>",
      retenir: "Listen to the SOUND, not the letter: a uniform, an hour." },
    { t: "The", html:
      "<p>We use <strong>the</strong> when the listener knows which thing we mean:</p><ul><li>it was mentioned before: <em>I saw a taxi. The taxi was yellow.</em></li><li>it is unique: <em>the sun, the moon, the President of the Republic</em> ;</li><li>with superlatives: <em>the tallest girl in the class</em> ;</li><li>with rivers, oceans, some countries: <em>the Wouri, the Atlantic, the United States</em>.</li></ul>",
      illus: { legende: "First mention: a. Second mention: the.", svg:
      "<svg viewBox='0 0 460 150' role='img' aria-label='First mention a, second mention the'><rect x='10' y='20' width='200' height='110' rx='16' fill='#FBE4EE' stroke='#6E1F43' stroke-width='2'/><text x='110' y='56' text-anchor='middle' font-size='17' fill='#142554'>I saw <tspan font-weight='700' fill='#B03A6E'>a</tspan> taxi.</text><text x='110' y='92' text-anchor='middle' font-size='13' fill='#636A80'>new information</text><path d='M216 75h28' stroke='#142554' stroke-width='3'/><rect x='250' y='20' width='200' height='110' rx='16' fill='#FFF6DA' stroke='#6B4E00' stroke-width='2'/><text x='350' y='56' text-anchor='middle' font-size='17' fill='#142554'><tspan font-weight='700' fill='#9A6F00'>The</tspan> taxi was yellow.</text><text x='350' y='92' text-anchor='middle' font-size='13' fill='#636A80'>known information</text></svg>" },
      retenir: "New → a / an. Known or unique → the." },
    { t: "No article", html:
      "<p>No article with plural or uncountable nouns used in general, with most countries, cities, languages and school subjects:</p><ul><li><em>Children like sweets.</em> <em>Water is important.</em></li><li><em>Cameroon, Douala, English, mathematics.</em></li></ul><div class='attention'><b>French speakers, watch out!</b>« J'aime <u>les</u> mangues » = I like mangoes (no article).</div>",
      retenir: "General statements in the plural: no article." }
  ],
  revision: ["a + consonant sound, an + vowel sound.", "the: already mentioned, unique, superlative.", "the + rivers and oceans: the Wouri, the Atlantic.", "No article for general plurals, countries, languages, subjects."],
  exo: "<p>Fill in with a, an, the or Ø: 1. ___ elephant is ___ biggest land animal. 2. I like ___ football. 3. She is ___ honest girl. <em>(An / the ; Ø ; an)</em></p>",
  quiz: [
    { q: "___ hour ago.", r: ["A", "An", "The"], b: 1, e: "The h is silent: vowel sound." },
    { q: "___ Wouri is a river in Douala.", r: ["A", "The", "Ø"], b: 1, e: "Rivers take the." },
    { q: "I like ___ mangoes.", r: ["the", "a", "Ø"], b: 2, e: "General statement in the plural: no article." }
  ]
});

VRT_L("3e-en-present", {
  c: "3e", m: "anglais", cle: "Revise the present tenses", titre: "Revise the present tenses: simple and continuous", duree: 15,
  accroche: "Every day I walk to school; right now I am writing. Two presents, two uses.",
  intro: "English has two present tenses. One talks about habits and facts, the other about what is happening now.",
  objectifs: ["form the simple present and the present continuous", "choose the right tense", "recognise time markers"],
  parties: [
    { t: "The simple present", html:
      "<p>For <strong>habits, routines and general truths</strong>.</p><p class='formule'>I / you / we / they play — he / she / it plays</p><ul><li>Negative: <em>She does not (doesn't) play.</em></li><li>Question: <em>Does she play?</em></li><li>Markers: every day, always, usually, often, sometimes, never.</li></ul>",
      retenir: "He, she, it: add -s! (He goes, she watches, it flies.)" },
    { t: "The present continuous", html:
      "<p>For <strong>actions happening now</strong> or temporary situations.</p><p class='formule'>am / is / are + verb-ing</p><ul><li><em>I am reading. They are playing.</em></li><li>Markers: now, right now, at the moment, look!, listen!</li></ul>",
      illus: { legende: "Habit (always) or now (at this moment)?", svg:
      "<svg viewBox='0 0 460 140' role='img' aria-label='Timeline simple present and present continuous'><line x1='20' y1='80' x2='440' y2='80' stroke='#142554' stroke-width='2'/><g fill='#E79BBE'><circle cx='60' cy='80' r='7'/><circle cx='120' cy='80' r='7'/><circle cx='180' cy='80' r='7'/><circle cx='280' cy='80' r='7'/><circle cx='340' cy='80' r='7'/><circle cx='400' cy='80' r='7'/></g><rect x='212' y='58' width='36' height='44' rx='8' fill='#FFC93C'/><text x='230' y='120' text-anchor='middle' font-size='13' font-weight='700' fill='#9A6F00'>NOW</text><text x='120' y='40' text-anchor='middle' font-size='13' fill='#B03A6E'>I walk to school every day.</text><text x='330' y='40' text-anchor='middle' font-size='13' fill='#9A6F00'>I am writing now.</text></svg>" },
      retenir: "Habit → simple present. Now → present continuous." },
    { t: "Verbs that don't like -ing", html:
      "<p>State verbs are usually not used in the continuous: <em>know, like, love, want, need, understand, believe</em>.</p><div class='attention'><b>Wrong / Right</b><s>I am knowing</s> → I know. <s>She is wanting rice</s> → She wants rice.</div>",
      retenir: "Feelings and thoughts: simple present." }
  ],
  revision: ["Simple present: habits, facts; -s with he/she/it.", "do/does for negatives and questions.", "Present continuous: am/is/are + -ing, for now.", "State verbs (know, like, want…) stay simple."],
  exo: "<p>Put the verbs in the correct tense: 1. Look! The baby (sleep). 2. My father (work) in Garoua. 3. I (not understand) this word. <em>(is sleeping ; works ; don't understand)</em></p>",
  quiz: [
    { q: "She ___ to church every Sunday.", r: ["go", "goes", "is going"], b: 1, e: "Habit + she: goes." },
    { q: "Listen! Somebody ___ .", r: ["sings", "is singing", "sing"], b: 1, e: "Listen! = happening now." },
    { q: "I ___ the answer.", r: ["know", "am knowing", "knowing"], b: 0, e: "Know is a state verb." }
  ]
});

VRT_L("3e-de-verbes", {
  c: "3e", m: "allemand", cle: "Conjuguer les verbes faibles", titre: "Les verbes faibles (réguliers) au présent", duree: 15,
  accroche: "spielen, lernen, kaufen : un seul modèle pour des centaines de verbes.",
  intro: "En allemand, la plupart des verbes sont « faibles » : ils se conjuguent tous sur le même modèle. Une fois le modèle connu, tu peux en conjuguer des centaines.",
  objectifs: ["conjuguer un verbe faible au présent", "connaître les cas particuliers en -t, -d, -n", "utiliser les verbes dans une phrase"],
  parties: [
    { t: "Le modèle", html:
      "<p>On enlève <strong>-en</strong> de l'infinitif pour obtenir le radical (<em>spielen</em> → <em>spiel-</em>), puis on ajoute les terminaisons.</p><div class='tab-scroll'><table><thead><tr><th>Pronom</th><th>Terminaison</th><th>spielen (jouer)</th></tr></thead><tbody><tr><th>ich</th><td>-e</td><td>ich spiel<b>e</b></td></tr><tr><th>du</th><td>-st</td><td>du spiel<b>st</b></td></tr><tr><th>er / sie / es</th><td>-t</td><td>er spiel<b>t</b></td></tr><tr><th>wir</th><td>-en</td><td>wir spiel<b>en</b></td></tr><tr><th>ihr</th><td>-t</td><td>ihr spiel<b>t</b></td></tr><tr><th>sie / Sie</th><td>-en</td><td>sie spiel<b>en</b></td></tr></tbody></table></div>",
      retenir: "e – st – t – en – t – en : la chanson des terminaisons." },
    { t: "Les cas particuliers", html:
      "<ul><li>Radical en <strong>-t</strong> ou <strong>-d</strong> : on ajoute un <strong>e</strong> pour prononcer : du arbeit<b>e</b>st, er arbeit<b>e</b>t, ihr find<b>e</b>t.</li><li>Infinitif en <strong>-eln</strong> / <strong>-ern</strong> : wir/sie prennent seulement <strong>-n</strong> : wir wander<b>n</b>, sie sammel<b>n</b>.</li></ul>",
      retenir: "arbeiten → du arbeitest : le e rend la prononciation possible." },
    { t: "En situation", html:
      "<div class='ex'><b>Beispiele</b><em>Ich lerne Deutsch. — Du kaufst Bananen auf dem Markt. — Wir spielen Fußball nach der Schule.</em></div><p>Verbes faibles utiles : lernen (apprendre), kaufen (acheter), wohnen (habiter), machen (faire), sagen (dire), fragen (demander), hören (écouter), kochen (cuisiner).</p>",
      retenir: "Le verbe conjugué est toujours en 2ᵉ position dans la phrase déclarative." }
  ],
  revision: ["Radical = infinitif sans -en.", "Terminaisons : -e, -st, -t, -en, -t, -en.", "Radical en -t/-d : du arbeitest, er arbeitet.", "Verbe conjugué en 2ᵉ position."],
  exo: "<p>Conjugue au présent : 1. du (wohnen) in Yaoundé. 2. er (arbeiten) viel. 3. wir (kaufen) Brot. <em>(wohnst ; arbeitet ; kaufen)</em></p>",
  quiz: [
    { q: "du ___ (lernen)", r: ["lernt", "lernst", "lernen"], b: 1, e: "du → -st." },
    { q: "er ___ (arbeiten)", r: ["arbeitt", "arbeitet", "arbeiten"], b: 1, e: "Radical en -t : on ajoute -e-." },
    { q: "Quelle est la terminaison de « ich » ?", r: ["-e", "-t", "-en"], b: 0, e: "ich spiele, ich lerne." }
  ]
});

VRT_L("3e-de-prepositions", {
  c: "3e", m: "allemand", cle: "prépositions exprimant la direction et la position", titre: "Wo? Wohin? Les prépositions de position et de direction", duree: 20,
  accroche: "Das Buch liegt auf dem Tisch… Ich lege das Buch auf den Tisch.",
  intro: "« Où est le livre ? » et « Où vas-tu le mettre ? » ne se disent pas de la même façon en allemand. Neuf prépositions changent de cas selon la question.",
  objectifs: ["connaître les prépositions mixtes", "choisir entre datif et accusatif", "décrire une pièce ou un trajet"],
  parties: [
    { t: "Les neuf prépositions mixtes", html:
      "<p><strong>in</strong> (dans), <strong>an</strong> (contre, au bord de), <strong>auf</strong> (sur), <strong>über</strong> (au-dessus de), <strong>unter</strong> (sous), <strong>vor</strong> (devant), <strong>hinter</strong> (derrière), <strong>neben</strong> (à côté de), <strong>zwischen</strong> (entre).</p>",
      illus: { legende: "Position du ballon par rapport à la boîte.", svg:
      "<svg viewBox='0 0 460 190' role='img' aria-label='Prépositions de lieu autour d une boîte'><rect x='170' y='70' width='120' height='80' rx='6' fill='#FBE4EE' stroke='#6E1F43' stroke-width='2.5'/><g fill='#FFC93C' stroke='#9A6F00' stroke-width='2'><circle cx='230' cy='112' r='11'/><circle cx='230' cy='58' r='11'/><circle cx='230' cy='20' r='11'/><circle cx='230' cy='170' r='11'/><circle cx='140' cy='120' r='11'/><circle cx='320' cy='120' r='11'/></g><g font-size='13' font-weight='700' fill='#142554'><text x='246' y='116'>in</text><text x='246' y='62'>auf</text><text x='246' y='24'>über</text><text x='246' y='174'>unter</text><text x='70' y='124'>neben</text><text x='338' y='124'>neben</text></g><text x='20' y='182' font-size='12' fill='#636A80'>(vor = devant, hinter = derrière, zwischen = entre)</text></svg>" },
      retenir: "Neuf prépositions : in, an, auf, über, unter, vor, hinter, neben, zwischen." },
    { t: "Wo? → datif ; Wohin? → accusatif", html:
      "<ul><li><strong>Wo?</strong> (où ? position, pas de déplacement) → <strong>datif</strong> : <em>Das Heft liegt auf <b>dem</b> Tisch.</em></li><li><strong>Wohin?</strong> (où vas-tu ? direction, déplacement) → <strong>accusatif</strong> : <em>Ich lege das Heft auf <b>den</b> Tisch.</em></li></ul><div class='tab-scroll'><table><thead><tr><th></th><th>masculin</th><th>féminin</th><th>neutre</th><th>pluriel</th></tr></thead><tbody><tr><th>datif (wo?)</th><td>dem</td><td>der</td><td>dem</td><td>den …n</td></tr><tr><th>accusatif (wohin?)</th><td>den</td><td>die</td><td>das</td><td>die</td></tr></tbody></table></div>",
      retenir: "Mouvement vers un lieu = accusatif ; on est déjà là = datif." },
    { t: "Les contractions", html:
      "<p>in + dem = <strong>im</strong> ; an + dem = <strong>am</strong> ; in + das = <strong>ins</strong> ; an + das = <strong>ans</strong>.</p><div class='ex'><b>Beispiele</b><em>Ich bin im Klassenzimmer. — Ich gehe ins Klassenzimmer. — Wir sind am Strand von Kribi.</em></div>",
      retenir: "im / ins : je suis dans / je vais dans." }
  ],
  revision: ["in, an, auf, über, unter, vor, hinter, neben, zwischen.", "Wo? → datif (dem, der, dem, den).", "Wohin? → accusatif (den, die, das, die).", "im, am, ins, ans."],
  exo: "<p>Complète : 1. Die Katze schläft unter ___ Bett (n). 2. Ich stelle die Flasche auf ___ Tisch (m). 3. Er geht ___ Kino. <em>(dem ; den ; ins)</em></p>",
  quiz: [
    { q: "Ich gehe ___ Schule (f). (wohin?)", r: ["in die", "in der", "im"], b: 0, e: "Direction : accusatif féminin die." },
    { q: "Das Buch liegt auf ___ Tisch (m).", r: ["den", "dem", "der"], b: 1, e: "Position : datif masculin dem." },
    { q: "in + das = ?", r: ["im", "ins", "ans"], b: 1, e: "ins = in das." }
  ]
});

VRT_L("3e-es-familia", {
  c: "3e", m: "espagnol", cle: "Arbre généalogique", titre: "Mi familia : présenter sa famille", duree: 15,
  accroche: "Mi abuela, mis primos, mi tía : toute la famille en espagnol.",
  intro: "Présenter sa famille est l'un des premiers actes de communication. Apprends le vocabulaire, les possessifs et les verbes pour parler des tiens.",
  objectifs: ["nommer les membres de la famille", "utiliser les adjectifs possessifs", "présenter sa famille à l'oral"],
  parties: [
    { t: "El vocabulario", html:
      "<div class='tab-scroll'><table><thead><tr><th>Español</th><th>Français</th><th>Español</th><th>Français</th></tr></thead><tbody><tr><td>el padre / la madre</td><td>le père / la mère</td><td>el abuelo / la abuela</td><td>le grand-père / la grand-mère</td></tr><tr><td>el hermano / la hermana</td><td>le frère / la sœur</td><td>el tío / la tía</td><td>l'oncle / la tante</td></tr><tr><td>el hijo / la hija</td><td>le fils / la fille</td><td>el primo / la prima</td><td>le cousin / la cousine</td></tr><tr><td>los padres</td><td>les parents</td><td>el sobrino</td><td>le neveu</td></tr></tbody></table></div>",
      illus: { legende: "Un arbre généalogique sur trois générations.", svg:
      "<svg viewBox='0 0 460 200' role='img' aria-label='Arbre généalogique'><g stroke='#6E1F43' stroke-width='2' fill='none'><path d='M160 40h140M230 40v40M120 80h220M120 80v30M340 80v30M120 140v20M80 160h80M80 160v10M160 160v10'/></g><g font-size='12' text-anchor='middle'><rect x='100' y='22' width='70' height='28' rx='14' fill='#FBE4EE'/><text x='135' y='41' fill='#142554'>el abuelo</text><rect x='290' y='22' width='72' height='28' rx='14' fill='#FBE4EE'/><text x='326' y='41' fill='#142554'>la abuela</text><rect x='80' y='108' width='80' height='28' rx='14' fill='#FFF6DA'/><text x='120' y='127' fill='#142554'>mi padre</text><rect x='298' y='108' width='84' height='28' rx='14' fill='#FFF6DA'/><text x='340' y='127' fill='#142554'>mi tía</text><rect x='40' y='170' width='80' height='26' rx='13' fill='#B03A6E'/><text x='80' y='188' fill='#fff' font-weight='700'>yo</text><rect x='126' y='170' width='80' height='26' rx='13' fill='#E79BBE'/><text x='166' y='188' fill='#142554'>mi hermana</text><rect x='300' y='150' width='80' height='26' rx='13' fill='#E79BBE'/><text x='340' y='168' fill='#142554'>mi primo</text></g><path d='M340 136v14' stroke='#6E1F43' stroke-width='2'/></svg>" },
      retenir: "Le masculin pluriel désigne le groupe : los padres = le père et la mère." },
    { t: "Los posesivos", html:
      "<p><strong>mi / mis</strong> (mon, ma / mes), <strong>tu / tus</strong> (ton, ta / tes), <strong>su / sus</strong> (son, sa, leur / ses, leurs), <strong>nuestro, -a, -os, -as</strong> (notre / nos), <strong>vuestro…</strong> (votre / vos).</p><div class='ex'><b>Ejemplos</b><em>Mi madre se llama Ngono. Mis hermanos viven en Bafoussam. Nuestra casa es grande.</em></div>",
      retenir: "mi hermano, mis hermanos : le possessif s'accorde avec ce qui est possédé." },
    { t: "Presentar a su familia", html:
      "<p>Phrases utiles : <em>Somos cinco en casa. — Tengo dos hermanos y una hermana. — Mi padre es profesor y mi madre es comerciante. — Mi abuela vive en el pueblo.</em></p><div class='attention'><b>Attention</b>Avec les personnes, on met <strong>a</strong> devant le COD : <em>Quiero mucho <b>a</b> mi abuela.</em></div>",
      retenir: "tener (tengo, tienes, tiene…) pour dire combien de frères et sœurs on a." }
  ],
  revision: ["padre, madre, hermano, abuelo, tío, primo…", "mi/mis, tu/tus, su/sus, nuestro…", "Tengo dos hermanos.", "a devant un COD de personne."],
  exo: "<p>Présente ta famille en six phrases en espagnol (nombre, noms, métiers, lieu de vie).</p>",
  quiz: [
    { q: "« Mes cousins » se dit…", r: ["mi primos", "mis primos", "su primos"], b: 1, e: "mis + pluriel." },
    { q: "La hermana de mi padre es mi…", r: ["abuela", "tía", "prima"], b: 1, e: "La sœur du père : la tante." },
    { q: "Tengo dos ___ (frères).", r: ["hermanas", "hermanos", "hijos"], b: 1, e: "hermanos = frères (ou frères et sœurs)." }
  ]
});

VRT_L("3e-es-medico", {
  c: "3e", m: "espagnol", cle: "Consultations médicales", titre: "En el médico : la consultation et le superlatif", duree: 15,
  accroche: "Me duele la cabeza… ¡Es la peor gripe del año!",
  intro: "Chez le médecin, il faut savoir dire où on a mal. Et pour décrire, le superlatif est bien utile.",
  objectifs: ["nommer les parties du corps", "dire où l'on a mal avec doler", "former le superlatif"],
  parties: [
    { t: "¿Qué te duele?", html:
      "<p>Le verbe <strong>doler</strong> se construit comme <em>gustar</em> : <em>me duele</em> + singulier, <em>me duelen</em> + pluriel.</p><ul><li><em>Me duele la cabeza.</em> (la tête)</li><li><em>Me duele el estómago.</em> (le ventre)</li><li><em>Me duelen los pies.</em> (les pieds)</li><li><em>Tengo fiebre / tos / gripe.</em> (fièvre, toux, grippe)</li></ul>",
      illus: { legende: "El cuerpo : quelques parties du corps.", svg:
      "<svg viewBox='0 0 460 220' role='img' aria-label='Silhouette avec parties du corps en espagnol'><g fill='#FBE4EE' stroke='#6E1F43' stroke-width='2'><circle cx='230' cy='40' r='24'/><rect x='200' y='66' width='60' height='80' rx='16'/><rect x='168' y='70' width='22' height='74' rx='11'/><rect x='270' y='70' width='22' height='74' rx='11'/><rect x='204' y='146' width='22' height='64' rx='11'/><rect x='234' y='146' width='22' height='64' rx='11'/></g><g font-size='13' fill='#142554'><text x='290' y='38'>la cabeza</text><text x='60' y='100'>el brazo</text><text x='296' y='112'>el estómago</text><text x='290' y='200'>la pierna</text><text x='70' y='210'>el pie</text></g><g stroke='#B03A6E' stroke-width='1.5'><path d='M254 40h32M120 104h50M260 108h34M258 196h30M118 206h86'/></g></svg>" },
      retenir: "me duele la cabeza / me duelen los ojos." },
    { t: "En la consulta", html:
      "<div class='ex'><b>Diálogo</b><em>— Buenos días, doctor. — Buenos días, ¿qué le pasa? — Me duele la garganta y tengo fiebre. — ¿Desde cuándo? — Desde ayer. — Tome este jarabe tres veces al día y descanse.</em></div>",
      retenir: "« Desde cuándo » = depuis quand." },
    { t: "El superlativo", html:
      "<ul><li>Relatif : <strong>el / la / los / las más</strong> + adjectif + <strong>de</strong> : <em>Es el hospital más grande de la ciudad.</em></li><li>Absolu : adjectif + <strong>-ísimo</strong> : <em>cansado → cansadísimo, grande → grandísimo</em>.</li><li>Irréguliers : <em>bueno → el mejor ; malo → el peor</em>.</li></ul>",
      retenir: "el más… de ; -ísimo ; el mejor / el peor." }
  ],
  revision: ["me duele + singulier ; me duelen + pluriel.", "tengo fiebre, tos, gripe.", "el más grande de… ; grandísimo.", "el mejor / el peor."],
  exo: "<p>Écris un dialogue de six répliques entre un médecin et un élève qui a mal au ventre.</p>",
  quiz: [
    { q: "« J'ai mal aux pieds »", r: ["Me duele los pies", "Me duelen los pies", "Tengo los pies"], b: 1, e: "Pluriel : duelen." },
    { q: "Superlatif absolu de « cansado » :", r: ["cansadísimo", "más cansado", "el cansado"], b: 0, e: "-ísimo." },
    { q: "« Le meilleur élève de la classe »", r: ["el más bueno alumno", "el mejor alumno de la clase", "el bueno alumno"], b: 1, e: "bueno → mejor." }
  ]
});

VRT_L("1re-it-avverbi", {
  c: "1re A", m: "italien", cle: "La formation des adverbes en -mente", titre: "Gli avverbi in -mente", duree: 15,
  accroche: "lento → lentamente, facile → facilmente : la recette des adverbes.",
  intro: "Comme le français ajoute « -ment » (lentement), l'italien forme beaucoup d'adverbes avec <strong>-mente</strong>. Quelques règles suffisent.",
  objectifs: ["former un adverbe en -mente", "appliquer les règles de -le / -re", "connaître les adverbes irréguliers"],
  parties: [
    { t: "La règle", html:
      "<ul><li>Adjectif en <strong>-o</strong> : on part du féminin en -a : <em>lento → lenta → lentamente ; sicuro → sicuramente</em>.</li><li>Adjectif en <strong>-e</strong> : on ajoute -mente : <em>veloce → velocemente ; forte → fortemente</em>.</li><li>Adjectif en <strong>-le</strong> ou <strong>-re</strong> : le e tombe : <em>facile → facilmente ; regolare → regolarmente</em>.</li></ul>",
      illus: { legende: "Trois chemins pour un adverbe.", svg:
      "<svg viewBox='0 0 460 160' role='img' aria-label='Formation des adverbes'><g font-size='14' fill='#142554'><rect x='10' y='14' width='440' height='38' rx='10' fill='#FBE4EE'/><text x='24' y='38'>lent<tspan font-weight='700'>o</tspan> → lent<tspan fill='#B03A6E' font-weight='700'>a</tspan> → lenta<tspan fill='#B03A6E' font-weight='700'>mente</tspan></text><rect x='10' y='62' width='440' height='38' rx='10' fill='#FFF6DA'/><text x='24' y='86'>veloc<tspan font-weight='700'>e</tspan> → veloce<tspan fill='#9A6F00' font-weight='700'>mente</tspan></text><rect x='10' y='110' width='440' height='38' rx='10' fill='#DDF2F4'/><text x='24' y='134'>facil<tspan font-weight='700' text-decoration='line-through'>e</tspan> → facil<tspan fill='#0E7C86' font-weight='700'>mente</tspan></text></g></svg>" },
      retenir: "-o → -amente ; -e → -emente ; -le/-re → -lmente / -rmente." },
    { t: "Les irréguliers", html:
      "<p><strong>buono → bene</strong>, <strong>cattivo → male</strong>, <strong>migliore → meglio</strong>, <strong>peggiore → peggio</strong>.</p><div class='ex'><b>Esempi</b><em>Parla bene l'italiano. — Oggi sto meglio. — Ha giocato male.</em></div>",
      retenir: "bene, male, meglio, peggio : à apprendre par cœur." },
    { t: "En contexte", html:
      "<p><em>I giovani devono rispettare <b>sinceramente</b> i genitori. — Il dialogo tra generazioni si costruisce <b>pazientemente</b>.</em></p>",
      retenir: "L'adverbe se place souvent juste après le verbe." }
  ],
  revision: ["lento → lentamente.", "veloce → velocemente.", "facile → facilmente.", "bene, male, meglio, peggio."],
  exo: "<p>Forme l'adverbe : rapido, gentile, particolare, triste. <em>(rapidamente, gentilmente, particolarmente, tristemente)</em></p>",
  quiz: [
    { q: "regolare → ?", r: ["regolaremente", "regolarmente", "regolaramente"], b: 1, e: "-re : le e tombe." },
    { q: "buono → ?", r: ["buonamente", "bene", "meglio"], b: 1, e: "Irrégulier." },
    { q: "sicuro → ?", r: ["sicuramente", "sicuromente", "sicurmente"], b: 0, e: "Féminin sicura + mente." }
  ]
});

VRT_L("1re-it-accordo", {
  c: "1re A", m: "italien", cle: "Exprimer l'accord et le désaccord", titre: "Esprimere accordo e disaccordo", duree: 15,
  accroche: "Sono d'accordo… oppure no ! Débattre poliment en italien.",
  intro: "Dans un débat sur la délinquance juvénile ou les conflits de générations, il faut savoir approuver, nuancer et contredire poliment.",
  objectifs: ["exprimer l'accord", "exprimer le désaccord et la nuance", "donner son opinion"],
  parties: [
    { t: "Dire son accord", html:
      "<ul><li><em>Sono d'accordo con te / con Lei.</em></li><li><em>Hai ragione.</em> (tu as raison)</li><li><em>Certo ! / Esatto ! / Proprio così.</em></li></ul>",
      retenir: "essere d'accordo con qualcuno." },
    { t: "Dire son désaccord, nuancer", html:
      "<ul><li><em>Non sono d'accordo. — Non è vero. — Hai torto.</em></li><li>Nuancer : <em>Sì, però… — Da una parte…, dall'altra… — Dipende.</em></li></ul>",
      illus: { legende: "Du plein accord au désaccord total.", svg:
      "<svg viewBox='0 0 460 120' role='img' aria-label='Échelle de l accord au désaccord'><rect x='20' y='50' width='420' height='16' rx='8' fill='#FBE4EE'/><g fill='#B03A6E'><circle cx='30' cy='58' r='9'/><circle cx='230' cy='58' r='9' fill='#FFC93C'/><circle cx='430' cy='58' r='9' fill='#6E1F43'/></g><g font-size='13' text-anchor='middle' fill='#142554'><text x='60' y='36'>Sono d'accordo!</text><text x='230' y='36'>Sì, però… / Dipende</text><text x='400' y='36'>Non sono d'accordo</text><text x='60' y='96' fill='#636A80'>accord</text><text x='230' y='96' fill='#636A80'>nuance</text><text x='400' y='96' fill='#636A80'>désaccord</text></g></svg>" },
      retenir: "« Sì, però… » : la nuance est souvent plus convaincante." },
    { t: "Donner son opinion", html:
      "<p><em>Secondo me… — Per me… — Penso che + subjonctif : Penso che i genitori <b>abbiano</b> un ruolo importante.</em></p>",
      retenir: "Penso che, credo che + congiuntivo." }
  ],
  revision: ["Sono d'accordo / Non sono d'accordo.", "Hai ragione / Hai torto.", "Sì, però… ; Dipende.", "Secondo me ; Penso che + subjonctif."],
  exo: "<p>Réagis en italien (3 phrases) : « I giovani di oggi non rispettano più gli anziani. »</p>",
  quiz: [
    { q: "« Tu as raison »", r: ["Hai torto", "Hai ragione", "Sei d'accordo"], b: 1, e: "ragione = raison." },
    { q: "Pour nuancer, on dit…", r: ["Certo!", "Sì, però…", "Esatto!"], b: 1, e: "Oui, mais…" },
    { q: "« Penso che » est suivi…", r: ["de l'indicatif", "du subjonctif", "de l'infinitif"], b: 1, e: "Opinion : congiuntivo." }
  ]
});

VRT_L("1re-zh-budan", {
  c: "1re A", m: "chinois", cle: "不但……而且", titre: "不但……而且 et 第一……第二 : enchaîner ses idées", duree: 15,
  accroche: "Non seulement… mais aussi… : deux structures pour bien argumenter en chinois.",
  intro: "Pour parler de la solidarité familiale, il faut enchaîner les idées. Deux structures très utiles : 不但……而且…… et 第一……第二…….",
  objectifs: ["employer 不但……而且……", "ordonner des idées avec 第一、第二", "les utiliser à l'oral et à l'écrit"],
  parties: [
    { t: "不但……而且……", html:
      "<p><strong>不但</strong> (bùdàn) … <strong>而且</strong> (érqiě) … = « non seulement… mais aussi… ».</p><div class='ex'><b>例子</b>他<b>不但</b>会说汉语，<b>而且</b>会说英语。<br><em>Tā bùdàn huì shuō Hànyǔ, érqiě huì shuō Yīngyǔ.</em><br>Il parle non seulement chinois, mais aussi anglais.</div>",
      illus: { legende: "Deux idées reliées : la seconde renforce la première.", svg:
      "<svg viewBox='0 0 460 120' role='img' aria-label='Structure budan erqie'><rect x='10' y='30' width='90' height='50' rx='12' fill='#B03A6E'/><text x='55' y='62' text-anchor='middle' font-size='20' fill='#fff' font-weight='700'>不但</text><rect x='106' y='30' width='110' height='50' rx='12' fill='#FBE4EE'/><text x='161' y='61' text-anchor='middle' font-size='14' fill='#142554'>idée 1</text><rect x='232' y='30' width='90' height='50' rx='12' fill='#FFC93C'/><text x='277' y='62' text-anchor='middle' font-size='20' fill='#142554' font-weight='700'>而且</text><rect x='328' y='30' width='122' height='50' rx='12' fill='#FFF6DA'/><text x='389' y='61' text-anchor='middle' font-size='14' fill='#142554'>idée 2 (plus forte)</text></svg>" },
      retenir: "不但 A，而且 B : B ajoute quelque chose à A." },
    { t: "第一……第二……", html:
      "<p><strong>第一</strong> (dì yī, premièrement), <strong>第二</strong> (dì èr, deuxièmement), <strong>第三</strong> (dì sān)… : le préfixe 第 transforme un nombre en ordinal.</p><div class='ex'><b>例子</b><b>第一</b>，家人要互相帮助；<b>第二</b>，孩子要尊重父母。<br><em>Dì yī, jiārén yào hùxiāng bāngzhù ; dì èr, háizi yào zūnzhòng fùmǔ.</em><br>Premièrement, la famille doit s'entraider ; deuxièmement, les enfants doivent respecter leurs parents.</div>",
      retenir: "第 + nombre = ordinal : 第一, 第二, 第三." },
    { t: "Vocabulaire de la famille", html:
      "<p>家 jiā (famille, maison) — 爸爸 bàba — 妈妈 māma — 哥哥 gēge (grand frère) — 姐姐 jiějie (grande sœur) — 帮助 bāngzhù (aider) — 尊重 zūnzhòng (respecter).</p>",
      retenir: "Toujours noter le pinyin avec les tons." }
  ],
  revision: ["不但 A，而且 B = non seulement A mais aussi B.", "第一、第二、第三 = premièrement, deuxièmement…", "家 jiā, 帮助 bāngzhù, 尊重 zūnzhòng."],
  exo: "<p>Écris deux phrases avec 不但……而且…… sur ta famille ou ton école.</p>",
  quiz: [
    { q: "不但……而且…… signifie…", r: ["si… alors…", "non seulement… mais aussi…", "parce que… donc…"], b: 1, e: "bùdàn… érqiě…" },
    { q: "« Deuxièmement » se dit…", r: ["二第", "第二", "第一"], b: 1, e: "第 + 二." },
    { q: "帮助 (bāngzhù) signifie…", r: ["aider", "respecter", "famille"], b: 0, e: "尊重 = respecter." }
  ]
});

VRT_L("1re-zh-ruguo", {
  c: "1re A", m: "chinois", cle: "如果", titre: "如果……那么/就…… : exprimer la condition", duree: 15,
  accroche: "如果你努力，就会成功 : si tu travailles, tu réussiras.",
  intro: "Pour donner un conseil ou parler des conséquences d'un acte (par exemple la délinquance juvénile), on utilise la condition.",
  objectifs: ["construire une phrase conditionnelle", "choisir entre 那么 et 就", "donner un conseil"],
  parties: [
    { t: "La structure", html:
      "<p><strong>如果</strong> (rúguǒ, si) + condition，(<strong>那么</strong> nàme) + sujet + <strong>就</strong> (jiù) + conséquence.</p><div class='ex'><b>例子</b><b>如果</b>明天下雨，我们<b>就</b>不去。<br><em>Rúguǒ míngtiān xià yǔ, wǒmen jiù bú qù.</em><br>S'il pleut demain, nous n'irons pas.</div>",
      illus: { legende: "Condition → conséquence.", svg:
      "<svg viewBox='0 0 460 110' role='img' aria-label='Si condition alors conséquence'><rect x='10' y='30' width='80' height='46' rx='12' fill='#B03A6E'/><text x='50' y='60' text-anchor='middle' font-size='20' fill='#fff' font-weight='700'>如果</text><rect x='96' y='30' width='130' height='46' rx='12' fill='#FBE4EE'/><text x='161' y='58' text-anchor='middle' font-size='14' fill='#142554'>condition</text><path d='M232 53h30' stroke='#142554' stroke-width='3'/><rect x='268' y='30' width='60' height='46' rx='12' fill='#FFC93C'/><text x='298' y='60' text-anchor='middle' font-size='20' fill='#142554' font-weight='700'>就</text><rect x='334' y='30' width='116' height='46' rx='12' fill='#FFF6DA'/><text x='392' y='58' text-anchor='middle' font-size='14' fill='#142554'>conséquence</text></svg>" },
      retenir: "就 se place APRÈS le sujet de la seconde proposition." },
    { t: "Donner un conseil", html:
      "<p><em>如果你有问题，就问老师。</em> Rúguǒ nǐ yǒu wèntí, jiù wèn lǎoshī. — Si tu as un problème, demande au professeur.</p>",
      retenir: "如果 + 有问题 : très utile en classe !" },
    { t: "Les nombres et 有的……有的……", html:
      "<p><strong>有的</strong>……<strong>有的</strong>…… = « certains… d'autres… » : <em>学生有的喜欢看书，有的喜欢运动。</em> Certains élèves aiment lire, d'autres le sport.</p>",
      retenir: "有的 A，有的 B : pour décrire un groupe varié." }
  ],
  revision: ["如果 + condition，(那么) + sujet + 就 + conséquence.", "就 après le sujet.", "有的……有的…… = certains… d'autres…"],
  exo: "<p>Donne trois conseils à un camarade avec 如果……就…….</p>",
  quiz: [
    { q: "如果 signifie…", r: ["si", "mais", "parce que"], b: 0, e: "rúguǒ = si." },
    { q: "Où se place 就 ?", r: ["Avant le sujet", "Après le sujet de la conséquence", "En fin de phrase"], b: 1, e: "我们就不去." },
    { q: "有的……有的…… veut dire…", r: ["tous…", "certains… d'autres…", "aucun…"], b: 1, e: "Pour un groupe varié." }
  ]
});

VRT_L("tle-ar-khabar", {
  c: "Tle A", m: "arabe", cle: "Les types d", titre: "Les types d'attribut (أنواع الخبر)", duree: 15,
  accroche: "الطالبُ مجتهدٌ : la phrase nominale et ses attributs.",
  intro: "En arabe, la phrase nominale (الجملة الاسمية) se compose d'un sujet (المبتدأ) et d'un attribut (الخبر). Cet attribut peut prendre trois formes.",
  objectifs: ["reconnaître المبتدأ et الخبر", "distinguer les trois types de خبر", "construire des phrases nominales"],
  parties: [
    { t: "La phrase nominale", html:
      "<p dir='rtl' lang='ar' class='formule'>الطالبُ مجتهدٌ</p><p>« L'élève est travailleur. » <strong>الطالبُ</strong> est le sujet (المبتدأ), <strong>مجتهدٌ</strong> est l'attribut (الخبر). Les deux sont au cas sujet (مرفوع).</p>",
      retenir: "مبتدأ + خبر = phrase nominale ; tous deux مرفوع." },
    { t: "Les trois types de خبر", html:
      "<div class='tab-scroll'><table><thead><tr><th>Type</th><th>Exemple</th><th>Sens</th></tr></thead><tbody>" +
      "<tr><th>خبر مفرد (un mot)</th><td dir='rtl' lang='ar'>الجوُّ جميلٌ</td><td>Le temps est beau.</td></tr>" +
      "<tr><th>خبر جملة (une phrase)</th><td dir='rtl' lang='ar'>الطالبُ يقرأُ الدرسَ</td><td>L'élève lit la leçon. (phrase verbale)</td></tr>" +
      "<tr><th></th><td dir='rtl' lang='ar'>الطالبُ أبوه طبيبٌ</td><td>L'élève, son père est médecin. (phrase nominale)</td></tr>" +
      "<tr><th>خبر شبه جملة</th><td dir='rtl' lang='ar'>الكتابُ على الطاولةِ</td><td>Le livre est sur la table. (préposition + nom)</td></tr>" +
      "<tr><th></th><td dir='rtl' lang='ar'>المعلّمُ أمامَ السبّورةِ</td><td>Le maître est devant le tableau. (adverbe de lieu)</td></tr></tbody></table></div>",
      illus: { legende: "Un sujet, trois façons de le compléter.", svg:
      "<svg viewBox='0 0 460 170' role='img' aria-label='Types de khabar'><rect x='330' y='62' width='120' height='46' rx='12' fill='#B03A6E'/><text x='390' y='92' text-anchor='middle' font-size='18' fill='#fff' font-weight='700'>المبتدأ</text><g stroke='#6E1F43' stroke-width='2'><path d='M330 85 L230 30M330 85 L230 85M330 85 L230 140'/></g><g font-size='14' text-anchor='middle' fill='#142554'><rect x='20' y='12' width='210' height='36' rx='10' fill='#FBE4EE'/><text x='125' y='35'>خبر مفرد — un mot</text><rect x='20' y='67' width='210' height='36' rx='10' fill='#FFF6DA'/><text x='125' y='90'>خبر جملة — une phrase</text><rect x='20' y='122' width='210' height='36' rx='10' fill='#DDF2F4'/><text x='125' y='145'>خبر شبه جملة</text></g></svg>" },
      retenir: "مفرد, جملة (اسمية أو فعلية), شبه جملة." },
    { t: "Le lien avec le sujet", html:
      "<p>Quand le خبر est une phrase, elle contient un pronom qui renvoie au sujet (الرابط) : dans <span dir='rtl' lang='ar'>الطالبُ أبوه طبيبٌ</span>, le pronom <span dir='rtl' lang='ar'>ـه</span> (« son ») renvoie à الطالب.</p>",
      retenir: "Phrase-attribut = pronom de rappel obligatoire." }
  ],
  revision: ["Phrase nominale = مبتدأ + خبر.", "خبر مفرد : un mot.", "خبر جملة : phrase verbale ou nominale, avec pronom de rappel.", "خبر شبه جملة : préposition + nom ou adverbe de lieu/temps."],
  exo: "<p>Donne le type de خبر : <span dir='rtl' lang='ar'>البيتُ كبيرٌ — الأمُّ تطبخُ — القلمُ في الحقيبةِ</span>. <em>(مفرد ; جملة فعلية ; شبه جملة)</em></p>",
  quiz: [
    { q: "Dans الجوُّ جميلٌ, le خبر est…", r: ["مفرد", "جملة", "شبه جملة"], b: 0, e: "Un seul mot : جميلٌ." },
    { q: "الكتابُ على الطاولةِ : quel type ?", r: ["مفرد", "شبه جملة", "جملة فعلية"], b: 1, e: "Préposition + nom." },
    { q: "Le cas du مبتدأ est…", r: ["منصوب", "مرفوع", "مجرور"], b: 1, e: "Le sujet est au nominatif." }
  ]
});

VRT_L("tle-ar-verbes", {
  c: "Tle A", m: "arabe", cle: "Les verbes intransitifs et transitifs", titre: "Verbes intransitifs et transitifs (اللازم والمتعدي)", duree: 15,
  accroche: "جلسَ الولدُ / كتبَ الطالبُ الدرسَ : avec ou sans complément.",
  intro: "Certains verbes se suffisent à eux-mêmes, d'autres demandent un complément d'objet direct (المفعول به).",
  objectifs: ["distinguer الفعل اللازم et الفعل المتعدي", "repérer المفعول به", "rendre un verbe transitif"],
  parties: [
    { t: "Le verbe intransitif (اللازم)", html:
      "<p>Il n'a pas de complément d'objet : <span dir='rtl' lang='ar'>جلسَ الولدُ</span> (l'enfant s'est assis), <span dir='rtl' lang='ar'>نامَ الطفلُ</span> (le bébé a dormi).</p>",
      retenir: "اللازم : le sens est complet avec le sujet." },
    { t: "Le verbe transitif (المتعدي)", html:
      "<p>Il a un complément d'objet direct, au cas direct (منصوب) : <span dir='rtl' lang='ar'>كتبَ الطالبُ الدرسَ</span> (l'élève a écrit la leçon). Certains en ont deux : <span dir='rtl' lang='ar'>أعطى الأبُ الولدَ كتاباً</span> (le père a donné un livre à l'enfant).</p>",
      illus: { legende: "Verbe + sujet (+ complément).", svg:
      "<svg viewBox='0 0 460 140' role='img' aria-label='Verbe intransitif et transitif'><g font-size='18' text-anchor='middle' font-weight='700'><rect x='300' y='14' width='140' height='42' rx='12' fill='#B03A6E'/><text x='370' y='42' fill='#fff'>جلسَ الولدُ</text><rect x='300' y='80' width='140' height='42' rx='12' fill='#B03A6E'/><text x='370' y='108' fill='#fff'>كتبَ الطالبُ</text><rect x='150' y='80' width='120' height='42' rx='12' fill='#FFC93C'/><text x='210' y='108' fill='#142554'>الدرسَ</text></g><g font-size='13' fill='#636A80'><text x='20' y='40'>لازم : pas de complément</text><text x='20' y='106'>متعدٍّ → مفعول به</text></g></svg>" },
      retenir: "المفعول به est منصوب (fatha)." },
    { t: "Rendre un verbe transitif", html:
      "<p>On peut rendre transitif un verbe intransitif avec la forme IV (أفعل) ou la forme II (فعّل) : <span dir='rtl' lang='ar'>جلسَ</span> → <span dir='rtl' lang='ar'>أجلسَ الأبُ الولدَ</span> (le père a fait asseoir l'enfant).</p>",
      retenir: "Forme IV ou II : « faire faire »." }
  ],
  revision: ["اللازم : sans complément.", "المتعدي : avec مفعول به منصوب.", "Certains verbes ont deux compléments (أعطى).", "Formes II et IV pour rendre transitif."],
  exo: "<p>Classe : <span dir='rtl' lang='ar'>ذهبَ — قرأَ — ضحكَ — فتحَ</span>. <em>(لازم : ذهب، ضحك ; متعدٍّ : قرأ، فتح)</em></p>",
  quiz: [
    { q: "نامَ الطفلُ : le verbe est…", r: ["لازم", "متعدٍّ"], b: 0, e: "Pas de complément." },
    { q: "Le مفعول به est au cas…", r: ["مرفوع", "منصوب", "مجرور"], b: 1, e: "Cas direct." },
    { q: "أجلسَ est la forme…", r: ["I", "IV", "X"], b: 1, e: "Forme IV : أفعل." }
  ]
});

VRT_L("6e-ln-carte", {
  c: "6e", m: "ln", cle: "La carte linguistique du Cameroun", titre: "La carte linguistique du Cameroun", duree: 15,
  scenes: ["1re-langues-nationales-salutations-aines"],
  accroche: "Plus de 250 langues dans un seul pays : un trésor à connaître.",
  intro: "Le Cameroun compte plus de 250 langues nationales. Elles ne sont pas réparties au hasard : elles appartiennent à de grandes familles.",
  objectifs: ["connaître le nombre approximatif de langues", "nommer les grandes familles", "situer quelques langues"],
  parties: [
    { t: "Une grande diversité", html:
      "<p>Les linguistes recensent <strong>plus de 250 langues</strong> au Cameroun. À côté des deux langues officielles (français et anglais), ces langues nationales sont parlées en famille, au marché, dans les cérémonies. Certaines servent de langue véhiculaire dans une région (le fulfulde au Nord, l'ewondo autour de Yaoundé, le duala sur la côte).</p>",
      retenir: "Plus de 250 langues nationales + 2 langues officielles." },
    { t: "Les grandes familles", html:
      "<ul><li><strong>Langues bantoues</strong> : au Sud et au Centre (ewondo, bulu, duala, basaa…).</li><li><strong>Langues des Grassfields</strong> (semi-bantoues) : à l'Ouest et au Nord-Ouest (ghomálá', medumba, fe'efe'e, lamnso'…).</li><li><strong>Langues adamawa-oubanguiennes</strong> : dans l'Adamaoua et l'Est (mbum, gbaya…).</li><li><strong>Langues tchadiques</strong> : dans l'Extrême-Nord (mafa, giziga…).</li><li>Le <strong>fulfulde</strong> (famille atlantique) et l'<strong>arabe choa</strong> au Nord ; le <strong>kanuri</strong> près du lac Tchad.</li></ul>",
      retenir: "Bantou au Sud, Grassfields à l'Ouest, tchadique à l'Extrême-Nord." },
    { t: "Quatre grandes aires culturelles", html:
      "<p>On regroupe souvent les peuples du Cameroun en <strong>quatre grandes aires culturelles</strong> : des ensembles qui partagent des traditions, des modes de vie et souvent des langues proches.</p><ul><li><strong>Soudano-sahélienne</strong> (Adamaoua, Nord, Extrême-Nord) : les <strong>Peuls</strong> (Foulbé), mais aussi les Mafa, Toupouri, Massa, Mboum, Gbaya…</li><li><strong>Grassfields</strong> (Ouest, Nord-Ouest) : Bamiléké, Bamoun, Tikar, Nso, Kom…</li><li><strong>Sawa</strong> (la côte : Littoral, Sud-Ouest, littoral du Sud) : Duala, Bakweri, Batanga, Bakoko…</li><li><strong>Fang-Béti</strong> (Centre, Sud, Est) : Ewondo, Bulu, Eton, Fang… ; on y rattache souvent les peuples de l'Est (Maka, Baka…).</li></ul>",
      illus: { legende: "Carte des quatre grandes aires culturelles du Cameroun (limites approximatives : les peuples se mêlent aux frontières).", svg:
      "<svg viewBox='0 0 345 480' role='img' aria-label='Carte des quatre grandes aires culturelles du Cameroun : soudano-sahélienne au nord, Grassfields à l&#39;ouest, sawa sur la côte, fang-béti au centre, au sud et à l&#39;est'><defs><clipPath id='cmr-aires'><path d='M135.8 449.4L83.1 449.4L76.3 446L75.5 442.4L76.3 433.5L78.9 418.9L81.8 412.7L79.5 406L80.6 405.1L79.2 404.9L74.6 398.5L69.2 394.4L76.2 390.9L68.5 392L69.2 390.6L65.3 383.2L67.3 385.7L70 386L67.3 384.4L67.6 381.6L68.3 381L69.9 382.4L71 381.6L73.5 382.8L73.5 381.6L70.5 379.6L74 378.5L74 377.7L70 378.4L68.2 377.6L73.8 370.8L71.6 372.3L71.3 371.4L68.6 374.8L66.6 375.5L62.6 371.6L61.6 372.9L64.8 376.4L63.2 376.8L61 374.8L60.5 375.7L62.6 379.3L57.9 379.5L55.8 377.4L56.6 374.8L53.6 377.6L52 377.5L51.5 375.2L48.6 375.3L42.5 372L43.3 367.3L40.5 363.3L39.5 357.6L41.2 353.9L39.7 355.2L39.7 352.5L37.6 350.4L38.5 354.2L35.7 351.9L36.2 353.3L35.3 354.4L32.7 352.8L30 346.5L29.6 348.6L32.6 355.5L26.9 356.3L27.6 354.7L25.7 355.7L24.2 354.9L25.9 351.4L24.9 351.9L24.3 350.3L26.7 347.9L28.2 340.1L34 330.6L35.7 329.6L37.7 315.4L39.9 312.2L36.5 307.9L38.2 305.9L37.5 302.8L40.6 299.8L43 300.2L43.2 298.5L54.5 287.9L57.2 283.4L60.5 282.4L61.6 280.1L65.5 278.3L67.6 275.4L71.2 274.7L75 264.2L78.3 264.5L89.1 255.7L91.8 260.8L103.1 261L104.8 257.9L106.3 250.7L108.1 254.3L116.4 258.2L119.5 264.7L124.5 266.3L126.2 276.1L127.6 278.6L136.8 278.3L138.5 277L139.7 273.1L143.4 271.5L145.7 266.4L144.4 263L145.4 260.9L150.5 256.3L152.5 256.1L155.2 253.1L157.4 253L158.1 251.9L152.4 245.5L163.7 233L163.5 227.2L170.7 217L170.1 212.2L172.2 208.1L171.8 200.6L173.5 198.9L176 199L178.8 196.2L177.4 191.6L185 191.8L189 189.6L191 186L193.5 185.6L194.8 182.7L195.4 172.1L198.4 165.5L196.7 160.8L201.8 157L210.3 154.3L213 144L210.8 140.3L212.3 137.1L211.7 134.2L212.3 132.8L217.5 131.7L220.4 128.5L220.1 126.2L223.8 111.1L232.3 98.3L232.4 95.3L241.4 84.9L248.7 86.5L265.1 76.5L266.7 74.5L266.9 70.8L263.7 67.6L267 59.3L266.1 54.8L268.6 48.5L266.4 48.7L261.6 42.5L249.7 41.2L249.3 34.2L244.7 12.9L258.9 12.7L262.3 17.2L261.6 21L264 23.3L264.1 25.4L265 26.2L266.1 25.6L268.6 27.4L270.4 27.2L270.6 29.9L271.3 28.8L272.7 30.7L274.7 30.4L276.4 36.2L275.9 37.7L277 38.1L278.3 42.9L277.9 49.9L280.4 52.3L282.3 51.6L283.9 52.6L283.4 53.8L285.2 57.2L284 57.3L283.6 59.9L286.3 64.7L284.6 69.6L287.3 74.8L284.3 79.4L284.4 83.6L282.7 88.7L283.3 96.2L285 100.1L284.4 104.2L287.9 111.1L287.4 115.1L290.6 116.5L293.9 123.6L300.7 130.7L308.9 136.3L299.3 138.8L288 136.5L283.2 138.3L277.9 137.6L272.9 139.2L259.7 136.2L249.4 136.9L247 141.9L240 149.9L255 166.2L256 169.3L273.7 183.5L277.9 185L280.2 188.9L284 190.2L289.2 196.8L295.6 210.6L299.4 222.4L304.2 224.3L303.7 230.8L298.6 238.5L299 240.4L290.7 246.1L289.3 252.4L287.3 254.2L283.6 264.4L279.1 267.6L273.1 280.7L272.9 283.3L270.7 285.7L263.4 288.4L259 294L257.6 294.4L260.7 299.2L263.3 299.8L265.4 299L266.7 301.4L267.3 306.5L265.6 311.7L266.7 316.2L265.9 319.6L262.9 324.4L267.6 327.7L268.6 330.3L268.4 336.1L270.7 351.1L273.1 354.2L281.6 359.5L284.4 364.3L285.4 371.1L289.4 373.5L285.6 375.4L282.9 375L285.3 380.6L288.7 385.6L313 411.7L318.2 412.1L320.7 416.8L322.6 416.8L324.9 420.5L323.9 427.5L326 427.9L325.2 435.6L326.3 440.4L329.9 447.1L327.9 448.7L325.7 448.2L324.2 455L327.9 466.6L324.3 469.8L322.2 465.1L317.2 464.2L309.9 458.7L301 457L295.3 459.1L290.3 454.4L287.9 454.4L284.9 456.8L280.7 454.6L280.4 455.6L277.6 455.7L278.1 453.6L276.1 451.3L275.6 453L272.6 453.4L272.4 452L271 452L271.9 451.5L270.6 451L270.7 452L267.4 450.5L264.4 447.6L263.6 449.5L259.6 450.7L254.9 449.2L214.1 449.6L213.8 446.3L209 444.7L204.1 446.2L194.8 445.5L192.5 446.6L175.5 443.4L170.8 444.8L153.5 444.8L149.2 443.1L137.1 444L135.8 449.4Z'/></clipPath></defs><rect width='345' height='480' fill='#EAF4FB'/><g fill='#636A80'><text x='59.6' y='192' font-size='9' font-weight='600' text-anchor='middle'>NIGERIA</text><text x='309.7' y='88' font-size='9' font-weight='600' text-anchor='middle'>TCHAD</text><text x='317.6' y='260' font-size='9' font-weight='600' text-anchor='middle'>RCA</text><text x='297.8' y='466' font-size='9' font-weight='600' text-anchor='middle'>CONGO</text><text x='158.8' y='466' font-size='9' font-weight='600' text-anchor='middle'>GABON</text><text x='99.3' y='466' font-size='9' font-weight='600' text-anchor='middle'>GUINÉE ÉQ.</text></g><text x='18' y='420' font-size='9' fill='#2E6DA4' font-style='italic'>océan</text><text x='18' y='431' font-size='9' fill='#2E6DA4' font-style='italic'>Atlantique</text><path d='M135.8 449.4L83.1 449.4L76.3 446L75.5 442.4L76.3 433.5L78.9 418.9L81.8 412.7L79.5 406L80.6 405.1L79.2 404.9L74.6 398.5L69.2 394.4L76.2 390.9L68.5 392L69.2 390.6L65.3 383.2L67.3 385.7L70 386L67.3 384.4L67.6 381.6L68.3 381L69.9 382.4L71 381.6L73.5 382.8L73.5 381.6L70.5 379.6L74 378.5L74 377.7L70 378.4L68.2 377.6L73.8 370.8L71.6 372.3L71.3 371.4L68.6 374.8L66.6 375.5L62.6 371.6L61.6 372.9L64.8 376.4L63.2 376.8L61 374.8L60.5 375.7L62.6 379.3L57.9 379.5L55.8 377.4L56.6 374.8L53.6 377.6L52 377.5L51.5 375.2L48.6 375.3L42.5 372L43.3 367.3L40.5 363.3L39.5 357.6L41.2 353.9L39.7 355.2L39.7 352.5L37.6 350.4L38.5 354.2L35.7 351.9L36.2 353.3L35.3 354.4L32.7 352.8L30 346.5L29.6 348.6L32.6 355.5L26.9 356.3L27.6 354.7L25.7 355.7L24.2 354.9L25.9 351.4L24.9 351.9L24.3 350.3L26.7 347.9L28.2 340.1L34 330.6L35.7 329.6L37.7 315.4L39.9 312.2L36.5 307.9L38.2 305.9L37.5 302.8L40.6 299.8L43 300.2L43.2 298.5L54.5 287.9L57.2 283.4L60.5 282.4L61.6 280.1L65.5 278.3L67.6 275.4L71.2 274.7L75 264.2L78.3 264.5L89.1 255.7L91.8 260.8L103.1 261L104.8 257.9L106.3 250.7L108.1 254.3L116.4 258.2L119.5 264.7L124.5 266.3L126.2 276.1L127.6 278.6L136.8 278.3L138.5 277L139.7 273.1L143.4 271.5L145.7 266.4L144.4 263L145.4 260.9L150.5 256.3L152.5 256.1L155.2 253.1L157.4 253L158.1 251.9L152.4 245.5L163.7 233L163.5 227.2L170.7 217L170.1 212.2L172.2 208.1L171.8 200.6L173.5 198.9L176 199L178.8 196.2L177.4 191.6L185 191.8L189 189.6L191 186L193.5 185.6L194.8 182.7L195.4 172.1L198.4 165.5L196.7 160.8L201.8 157L210.3 154.3L213 144L210.8 140.3L212.3 137.1L211.7 134.2L212.3 132.8L217.5 131.7L220.4 128.5L220.1 126.2L223.8 111.1L232.3 98.3L232.4 95.3L241.4 84.9L248.7 86.5L265.1 76.5L266.7 74.5L266.9 70.8L263.7 67.6L267 59.3L266.1 54.8L268.6 48.5L266.4 48.7L261.6 42.5L249.7 41.2L249.3 34.2L244.7 12.9L258.9 12.7L262.3 17.2L261.6 21L264 23.3L264.1 25.4L265 26.2L266.1 25.6L268.6 27.4L270.4 27.2L270.6 29.9L271.3 28.8L272.7 30.7L274.7 30.4L276.4 36.2L275.9 37.7L277 38.1L278.3 42.9L277.9 49.9L280.4 52.3L282.3 51.6L283.9 52.6L283.4 53.8L285.2 57.2L284 57.3L283.6 59.9L286.3 64.7L284.6 69.6L287.3 74.8L284.3 79.4L284.4 83.6L282.7 88.7L283.3 96.2L285 100.1L284.4 104.2L287.9 111.1L287.4 115.1L290.6 116.5L293.9 123.6L300.7 130.7L308.9 136.3L299.3 138.8L288 136.5L283.2 138.3L277.9 137.6L272.9 139.2L259.7 136.2L249.4 136.9L247 141.9L240 149.9L255 166.2L256 169.3L273.7 183.5L277.9 185L280.2 188.9L284 190.2L289.2 196.8L295.6 210.6L299.4 222.4L304.2 224.3L303.7 230.8L298.6 238.5L299 240.4L290.7 246.1L289.3 252.4L287.3 254.2L283.6 264.4L279.1 267.6L273.1 280.7L272.9 283.3L270.7 285.7L263.4 288.4L259 294L257.6 294.4L260.7 299.2L263.3 299.8L265.4 299L266.7 301.4L267.3 306.5L265.6 311.7L266.7 316.2L265.9 319.6L262.9 324.4L267.6 327.7L268.6 330.3L268.4 336.1L270.7 351.1L273.1 354.2L281.6 359.5L284.4 364.3L285.4 371.1L289.4 373.5L285.6 375.4L282.9 375L285.3 380.6L288.7 385.6L313 411.7L318.2 412.1L320.7 416.8L322.6 416.8L324.9 420.5L323.9 427.5L326 427.9L325.2 435.6L326.3 440.4L329.9 447.1L327.9 448.7L325.7 448.2L324.2 455L327.9 466.6L324.3 469.8L322.2 465.1L317.2 464.2L309.9 458.7L301 457L295.3 459.1L290.3 454.4L287.9 454.4L284.9 456.8L280.7 454.6L280.4 455.6L277.6 455.7L278.1 453.6L276.1 451.3L275.6 453L272.6 453.4L272.4 452L271 452L271.9 451.5L270.6 451L270.7 452L267.4 450.5L264.4 447.6L263.6 449.5L259.6 450.7L254.9 449.2L214.1 449.6L213.8 446.3L209 444.7L204.1 446.2L194.8 445.5L192.5 446.6L175.5 443.4L170.8 444.8L153.5 444.8L149.2 443.1L137.1 444L135.8 449.4Z' fill='#9FD3A0'/><g clip-path='url(#cmr-aires)'><path d='M-35.7 -24L361.3 -24L361.3 300L305.7 300L266 312L222.3 296L174.7 300L139 276L123.1 244L91.3 244L59.6 260L-35.7 260Z' fill='#F3C77A'/><path d='M-35.7 260L59.6 260L91.3 244L123.1 244L139 276L131 312L119.1 336L99.3 338L83.4 330L71.5 324L-35.7 320Z' fill='#B9A6E0'/><path d='M-35.7 320L71.5 324L83.4 330L99.3 338L119.1 336L107.2 360L103.2 388L89.3 416L85.4 496L-35.7 496Z' fill='#86CDE0'/></g><path d='M135.8 449.4L83.1 449.4L76.3 446L75.5 442.4L76.3 433.5L78.9 418.9L81.8 412.7L79.5 406L80.6 405.1L79.2 404.9L74.6 398.5L69.2 394.4L76.2 390.9L68.5 392L69.2 390.6L65.3 383.2L67.3 385.7L70 386L67.3 384.4L67.6 381.6L68.3 381L69.9 382.4L71 381.6L73.5 382.8L73.5 381.6L70.5 379.6L74 378.5L74 377.7L70 378.4L68.2 377.6L73.8 370.8L71.6 372.3L71.3 371.4L68.6 374.8L66.6 375.5L62.6 371.6L61.6 372.9L64.8 376.4L63.2 376.8L61 374.8L60.5 375.7L62.6 379.3L57.9 379.5L55.8 377.4L56.6 374.8L53.6 377.6L52 377.5L51.5 375.2L48.6 375.3L42.5 372L43.3 367.3L40.5 363.3L39.5 357.6L41.2 353.9L39.7 355.2L39.7 352.5L37.6 350.4L38.5 354.2L35.7 351.9L36.2 353.3L35.3 354.4L32.7 352.8L30 346.5L29.6 348.6L32.6 355.5L26.9 356.3L27.6 354.7L25.7 355.7L24.2 354.9L25.9 351.4L24.9 351.9L24.3 350.3L26.7 347.9L28.2 340.1L34 330.6L35.7 329.6L37.7 315.4L39.9 312.2L36.5 307.9L38.2 305.9L37.5 302.8L40.6 299.8L43 300.2L43.2 298.5L54.5 287.9L57.2 283.4L60.5 282.4L61.6 280.1L65.5 278.3L67.6 275.4L71.2 274.7L75 264.2L78.3 264.5L89.1 255.7L91.8 260.8L103.1 261L104.8 257.9L106.3 250.7L108.1 254.3L116.4 258.2L119.5 264.7L124.5 266.3L126.2 276.1L127.6 278.6L136.8 278.3L138.5 277L139.7 273.1L143.4 271.5L145.7 266.4L144.4 263L145.4 260.9L150.5 256.3L152.5 256.1L155.2 253.1L157.4 253L158.1 251.9L152.4 245.5L163.7 233L163.5 227.2L170.7 217L170.1 212.2L172.2 208.1L171.8 200.6L173.5 198.9L176 199L178.8 196.2L177.4 191.6L185 191.8L189 189.6L191 186L193.5 185.6L194.8 182.7L195.4 172.1L198.4 165.5L196.7 160.8L201.8 157L210.3 154.3L213 144L210.8 140.3L212.3 137.1L211.7 134.2L212.3 132.8L217.5 131.7L220.4 128.5L220.1 126.2L223.8 111.1L232.3 98.3L232.4 95.3L241.4 84.9L248.7 86.5L265.1 76.5L266.7 74.5L266.9 70.8L263.7 67.6L267 59.3L266.1 54.8L268.6 48.5L266.4 48.7L261.6 42.5L249.7 41.2L249.3 34.2L244.7 12.9L258.9 12.7L262.3 17.2L261.6 21L264 23.3L264.1 25.4L265 26.2L266.1 25.6L268.6 27.4L270.4 27.2L270.6 29.9L271.3 28.8L272.7 30.7L274.7 30.4L276.4 36.2L275.9 37.7L277 38.1L278.3 42.9L277.9 49.9L280.4 52.3L282.3 51.6L283.9 52.6L283.4 53.8L285.2 57.2L284 57.3L283.6 59.9L286.3 64.7L284.6 69.6L287.3 74.8L284.3 79.4L284.4 83.6L282.7 88.7L283.3 96.2L285 100.1L284.4 104.2L287.9 111.1L287.4 115.1L290.6 116.5L293.9 123.6L300.7 130.7L308.9 136.3L299.3 138.8L288 136.5L283.2 138.3L277.9 137.6L272.9 139.2L259.7 136.2L249.4 136.9L247 141.9L240 149.9L255 166.2L256 169.3L273.7 183.5L277.9 185L280.2 188.9L284 190.2L289.2 196.8L295.6 210.6L299.4 222.4L304.2 224.3L303.7 230.8L298.6 238.5L299 240.4L290.7 246.1L289.3 252.4L287.3 254.2L283.6 264.4L279.1 267.6L273.1 280.7L272.9 283.3L270.7 285.7L263.4 288.4L259 294L257.6 294.4L260.7 299.2L263.3 299.8L265.4 299L266.7 301.4L267.3 306.5L265.6 311.7L266.7 316.2L265.9 319.6L262.9 324.4L267.6 327.7L268.6 330.3L268.4 336.1L270.7 351.1L273.1 354.2L281.6 359.5L284.4 364.3L285.4 371.1L289.4 373.5L285.6 375.4L282.9 375L285.3 380.6L288.7 385.6L313 411.7L318.2 412.1L320.7 416.8L322.6 416.8L324.9 420.5L323.9 427.5L326 427.9L325.2 435.6L326.3 440.4L329.9 447.1L327.9 448.7L325.7 448.2L324.2 455L327.9 466.6L324.3 469.8L322.2 465.1L317.2 464.2L309.9 458.7L301 457L295.3 459.1L290.3 454.4L287.9 454.4L284.9 456.8L280.7 454.6L280.4 455.6L277.6 455.7L278.1 453.6L276.1 451.3L275.6 453L272.6 453.4L272.4 452L271 452L271.9 451.5L270.6 451L270.7 452L267.4 450.5L264.4 447.6L263.6 449.5L259.6 450.7L254.9 449.2L214.1 449.6L213.8 446.3L209 444.7L204.1 446.2L194.8 445.5L192.5 446.6L175.5 443.4L170.8 444.8L153.5 444.8L149.2 443.1L137.1 444L135.8 449.4Z' fill='none' stroke='#6B2A00' stroke-width='1.6' stroke-linejoin='round'/><path d='M50.4 362L55.4 371L45.4 371Z' fill='#6B2A00'/><g fill='#142554'><text x='232.3' y='194' font-size='10.5' font-weight='800' text-anchor='middle'>SOUDANO-</text><text x='232.3' y='206' font-size='10.5' font-weight='800' text-anchor='middle'>SAHÉLIENNE</text><text x='232.3' y='218' font-size='8.5' font-weight='600' text-anchor='middle'>Peuls et peuples du Nord</text><text x='89.3' y='278' font-size='9.5' font-weight='800' text-anchor='middle'>GRASSFIELDS</text><text x='53.6' y='342' font-size='10.5' font-weight='800' text-anchor='middle'>SAWA</text><text x='206.4' y='406' font-size='11' font-weight='800' text-anchor='middle'>FANG-BÉTI</text></g><g font-size='8.5' fill='#142554'><rect x='140.2' y='377.7' width='7' height='7' fill='#C0392B'/><text x='148.7' y='384.7' text-anchor='start'>Yaoundé</text><circle cx='71.5' cy='375.2' r='2.6' fill='#142554'/><text x='76.5' y='378.7' text-anchor='start'>Douala</text><circle cx='100' cy='316.8' r='2.6' fill='#142554'/><text x='105' y='320.3' text-anchor='start'>Bafoussam</text><circle cx='89.7' cy='297.6' r='2.6' fill='#142554'/><text x='84.7' y='301.1' text-anchor='end'>Bamenda</text><circle cx='225.5' cy='243.2' r='2.6' fill='#142554'/><text x='230.5' y='246.7' text-anchor='start'>Ngaoundéré</text><circle cx='218.4' cy='164' r='2.6' fill='#142554'/><text x='223.4' y='167.5' text-anchor='start'>Garoua</text><circle cx='254.9' cy='112.4' r='2.6' fill='#142554'/><text x='259.9' y='115.9' text-anchor='start'>Maroua</text><circle cx='229.5' cy='352.8' r='2.6' fill='#142554'/><text x='234.5' y='356.3' text-anchor='start'>Bertoua</text><circle cx='129' cy='420' r='2.6' fill='#142554'/><text x='134' y='423.5' text-anchor='start'>Ebolowa</text><circle cx='79.8' cy='418.4' r='2.6' fill='#142554'/><text x='74.8' y='421.9' text-anchor='end'>Kribi</text></g><g font-size='8' fill='#142554'><rect x='12' y='14' width='7' height='7' fill='#C0392B'/><text x='22' y='20.5'>capitale</text><path d='M15.5 32l4 7h-8z' fill='#6B2A00'/><text x='22' y='38.5'>mont Cameroun</text></g></svg>" },
      retenir: "Quatre aires culturelles : soudano-sahélienne (Nord), Grassfields (Ouest), sawa (côte), fang-béti (Centre, Sud, Est)." },
    { t: "Écrire nos langues", html:
      "<p>Pour écrire toutes ces langues avec les mêmes règles, des linguistes camerounais ont adopté en 1979 l'<strong>Alphabet général des langues camerounaises (AGLC)</strong>. Il note les voyelles, les consonnes et les <strong>tons</strong>.</p>",
      retenir: "AGLC : un alphabet commun pour toutes nos langues." }
  ],
  revision: ["Plus de 250 langues nationales.", "Familles : bantoue, Grassfields, adamawa-oubanguienne, tchadique, fulfulde, arabe choa, kanuri.", "Quatre aires culturelles : soudano-sahélienne, Grassfields, sawa, fang-béti.", "Langues véhiculaires régionales.", "AGLC (1979) pour les écrire."],
  exo: "<p>Interroge tes parents : quelle langue parlent-ils ? À quelle famille appartient-elle ? Dans quelle région est-elle parlée ?</p>",
  quiz: [
    { q: "Combien de langues nationales environ ?", r: ["Une vingtaine", "Plus de 250", "Exactement 10"], b: 1, e: "Une des plus grandes diversités d'Afrique." },
    { q: "L'ewondo est une langue…", r: ["bantoue", "tchadique", "européenne"], b: 0, e: "Comme le bulu et le duala." },
    { q: "Que signifie AGLC ?", r: ["Association générale des lycées camerounais", "Alphabet général des langues camerounaises", "Atlas géographique"], b: 1, e: "Adopté en 1979." },
    { q: "Les Duala et les Bakweri appartiennent à l'aire culturelle…", r: ["soudano-sahélienne", "sawa", "des Grassfields"], b: 1, e: "Les peuples de la côte." }
  ]
});

VRT_L("4e-ln-tons", {
  c: "4e", m: "ln", cle: "Les tons de la langue", titre: "Les tons de nos langues", duree: 15,
  scenes: ["1re-langues-nationales-singulier-pluriel"],
  accroche: "Même syllabe, autre hauteur, autre sens : bienvenue dans les langues à tons.",
  intro: "Dans la plupart des langues camerounaises, la hauteur de la voix sur une syllabe peut changer le sens d'un mot. C'est le <strong>ton</strong>.",
  objectifs: ["définir le ton", "reconnaître les tons de base", "les noter selon l'AGLC"],
  parties: [
    { t: "Qu'est-ce qu'un ton ?", html:
      "<p>Le ton est la <strong>hauteur musicale</strong> d'une syllabe. Dans une langue à tons, deux mots peuvent avoir les mêmes voyelles et les mêmes consonnes et ne différer que par le ton. Ton enseignant te donnera des exemples dans la langue étudiée en classe.</p>",
      retenir: "Changer le ton peut changer le mot." },
    { t: "Les tons et leur notation (AGLC)", html:
      "<div class='tab-scroll'><table><thead><tr><th>Ton</th><th>Signe</th><th>Exemple</th></tr></thead><tbody><tr><th>haut</th><td>accent aigu</td><td>á</td></tr><tr><th>bas</th><td>accent grave</td><td>à</td></tr><tr><th>moyen</th><td>trait (macron)</td><td>ā</td></tr><tr><th>montant (bas → haut)</th><td>caron</td><td>ǎ</td></tr><tr><th>descendant (haut → bas)</th><td>accent circonflexe</td><td>â</td></tr></tbody></table></div>",
      illus: { legende: "La hauteur de la voix sur la syllabe « ba ».", svg:
      "<svg viewBox='0 0 460 170' role='img' aria-label='Courbes des tons'><g stroke='#E6E0D4'><path d='M20 40h420M20 80h420M20 120h420'/></g><g font-size='12' fill='#636A80'><text x='22' y='36'>haut</text><text x='22' y='76'>moyen</text><text x='22' y='116'>bas</text></g><g stroke-width='5' stroke-linecap='round' fill='none'><path d='M70 40h50' stroke='#A84200'/><path d='M150 120h50' stroke='#A84200'/><path d='M230 80h50' stroke='#A84200'/><path d='M310 120 L360 40' stroke='#0E7C86'/><path d='M390 40 L440 120' stroke='#0E7C86'/></g><g font-size='18' text-anchor='middle' font-weight='700' fill='#142554'><text x='95' y='160'>bá</text><text x='175' y='160'>bà</text><text x='255' y='160'>bā</text><text x='335' y='160'>bǎ</text><text x='415' y='160'>bâ</text></g></svg>" },
      retenir: "Haut ´, bas `, moyen ¯, montant ˇ, descendant ˆ." },
    { t: "S'entraîner", html:
      "<ol><li>Écoute un mot prononcé par ton enseignant.</li><li>Fredonne-le sur « la-la » pour entendre la mélodie.</li><li>Trace la courbe avec la main (haut, bas, montée, descente).</li><li>Note le ton avec le bon signe.</li></ol>",
      retenir: "Fredonner la mélodie aide à entendre les tons." }
  ],
  revision: ["Ton = hauteur d'une syllabe.", "Il peut changer le sens d'un mot.", "AGLC : á haut, à bas, ā moyen, ǎ montant, â descendant."],
  exo: "<p>Avec ton enseignant, trouve dans la langue étudiée deux mots qui ne diffèrent que par le ton, et note-les.</p>",
  quiz: [
    { q: "Le ton haut se note…", r: ["à", "á", "ā"], b: 1, e: "Accent aigu." },
    { q: "Un ton montant va…", r: ["du haut vers le bas", "du bas vers le haut", "reste plat"], b: 1, e: "Noté ǎ (caron)." },
    { q: "Dans une langue à tons, le ton peut…", r: ["changer le sens du mot", "ne rien changer", "remplacer les voyelles"], b: 0, e: "D'où l'importance de bien le noter." }
  ]
});

VRT_L("tle-cult-naissance", {
  c: "Tle A", m: "cultures", cle: "en rapport avec la naissance et la vie moderne", titre: "Naissance : pratiques traditionnelles et vie moderne", duree: 15,
  accroche: "Nom, rites, maternité : comment la tradition accueille un enfant aujourd'hui.",
  intro: "Dans les communautés camerounaises, la naissance n'est pas qu'un événement médical : elle fait entrer un enfant dans une famille et une lignée. Comment ces pratiques vivent-elles avec la vie moderne ?",
  objectifs: ["décrire des pratiques liées à la naissance", "analyser leurs rapports avec la vie moderne", "adopter une attitude critique et respectueuse"],
  parties: [
    { t: "Les pratiques traditionnelles", html:
      "<ul><li><strong>La protection de la femme enceinte</strong> : interdits alimentaires ou de comportement, conseils des aînées.</li><li><strong>L'accueil de l'enfant</strong> : présentation à la famille, au lignage ou aux ancêtres selon les communautés.</li><li><strong>Le nom</strong> : souvent choisi pour honorer un parent, rappeler une circonstance ou exprimer un vœu.</li><li><strong>La solidarité</strong> : la jeune mère est entourée et aidée pendant plusieurs semaines.</li></ul><p>Ces pratiques varient beaucoup d'une communauté à l'autre : on les étudie à partir de la communauté cible choisie en classe.</p>",
      retenir: "La naissance est un événement familial et communautaire." },
    { t: "La rencontre avec la vie moderne", html:
      "<ul><li>Les consultations prénatales et l'accouchement à l'hôpital réduisent la mortalité des mères et des enfants.</li><li>L'<strong>acte de naissance</strong> donne à l'enfant une existence juridique : sans lui, pas d'inscription aux examens officiels.</li><li>Certaines pratiques se maintiennent en s'adaptant : présentation de l'enfant à la famille après la sortie de la maternité, fête de nomination.</li></ul>",
      illus: { legende: "Tradition et modernité se complètent souvent.", svg:
      "<svg viewBox='0 0 460 150' role='img' aria-label='Tradition et modernité autour de la naissance'><circle cx='150' cy='75' r='62' fill='#FFF3E4' stroke='#A84200' stroke-width='2'/><circle cx='310' cy='75' r='62' fill='#DDF2F4' stroke='#0E7C86' stroke-width='2'/><g font-size='12' fill='#142554' text-anchor='middle'><text x='120' y='60'>présentation</text><text x='120' y='76'>à la famille</text><text x='120' y='96'>nomination</text><text x='340' y='60'>consultations</text><text x='340' y='76'>prénatales</text><text x='340' y='96'>acte de naissance</text><text x='230' y='70' font-weight='700'>solidarité</text><text x='230' y='86' font-weight='700'>familiale</text></g></svg>" },
      retenir: "Hôpital et acte de naissance : des droits pour l'enfant." },
    { t: "Garder un regard critique", html:
      "<p>On valorise ce qui protège et rassemble (la solidarité, la transmission du nom et de la langue) ; on questionne ce qui met la santé en danger (refus des soins, interdits nuisibles). Le dialogue avec les aînés permet de faire évoluer les pratiques sans les mépriser.</p>",
      retenir: "Respecter la tradition n'empêche pas de la faire évoluer." }
  ],
  revision: ["Naissance : événement familial et communautaire.", "Pratiques : protection de la mère, accueil, nom, solidarité.", "Modernité : soins, acte de naissance.", "Attitude : respect et esprit critique."],
  exo: "<p>Interroge une aînée de ta communauté sur les pratiques liées à la naissance ; présente-les en dix lignes et dis ce qui a changé.</p>",
  quiz: [
    { q: "À quoi sert l'acte de naissance ?", r: ["À rien", "À donner une existence juridique à l'enfant", "À choisir son prénom"], b: 1, e: "Indispensable pour l'école et les examens." },
    { q: "Une pratique traditionnelle fréquente :", r: ["la nomination de l'enfant", "le vote", "l'exportation"], b: 0, e: "Le nom honore souvent un parent." },
    { q: "Quelle attitude adopter ?", r: ["Tout rejeter", "Respect et esprit critique", "Tout accepter sans réfléchir"], b: 1, e: "Valoriser ce qui protège, questionner ce qui nuit." }
  ]
});

VRT_L("tle-cult-mort", {
  c: "Tle A", m: "cultures", cle: "en rapport avec la mort et la vie moderne", titre: "Funérailles : tradition et vie moderne", duree: 15,
  scenes: ["tle-cultures-funerailles-tradition-modernite", "tle-cultures-tam-tam-parleur"],
  accroche: "Deuil, veillée, funérailles : honorer les morts sans ruiner les vivants ?",
  intro: "Au Cameroun, les funérailles sont un moment majeur de la vie sociale. Elles honorent le défunt et rassemblent la communauté. Mais elles évoluent, et soulèvent des débats.",
  objectifs: ["décrire les étapes des rites funéraires", "identifier les changements liés à la vie moderne", "débattre de leurs coûts et de leur sens"],
  parties: [
    { t: "Les étapes", html:
      "<ol><li><strong>L'annonce du décès</strong> : autrefois par le tam-tam ou des messagers, aujourd'hui aussi par la radio, le téléphone et les réseaux sociaux.</li><li><strong>La veillée</strong> : chants, prières, témoignages.</li><li><strong>L'inhumation</strong>, souvent au village d'origine.</li><li><strong>Le deuil</strong> : comportements particuliers de la famille proche pendant une période.</li><li><strong>Les funérailles</strong> proprement dites, parfois des mois ou des années plus tard, selon les communautés.</li></ol>",
      retenir: "Les rites accompagnent le défunt et consolent les vivants." },
    { t: "Ce qui change", html:
      "<ul><li><strong>La morgue</strong> permet d'attendre le retour de la famille dispersée.</li><li><strong>Les cérémonies</strong> mêlent rites traditionnels et religieux.</li><li><strong>Le coût</strong> augmente : transport, réception, tenues, location de chaises et de bâches.</li></ul>",
      illus: { legende: "Le tam-tam d'annonce et le téléphone : deux messagers du deuil.", svg:
      "<svg viewBox='0 0 460 150' role='img' aria-label='Tam-tam et téléphone'><g transform='translate(100 20)'><ellipse cx='40' cy='12' rx='40' ry='12' fill='#F5B57A' stroke='#6B2A00' stroke-width='2'/><path d='M0 12c0 30 10 50 22 66l-4 30h44l-4-30c12-16 22-36 22-66' fill='#A84200' stroke='#6B2A00' stroke-width='2'/></g><path d='M230 40 c20 10 20 50 0 60M250 30 c30 15 30 65 0 80' fill='none' stroke='#9A6F00' stroke-width='3' stroke-linecap='round'/><rect x='300' y='20' width='60' height='110' rx='12' fill='#0C2A6A'/><rect x='308' y='32' width='44' height='76' rx='4' fill='#DDF2F4'/><circle cx='330' cy='118' r='5' fill='#FFC93C'/></svg>" },
      retenir: "Les moyens changent, le besoin de rassembler demeure." },
    { t: "Le débat", html:
      "<p>Faut-il limiter les dépenses des funérailles ? Pour les uns, elles sont une dette d'honneur envers le défunt et un ciment social. Pour les autres, elles appauvrissent les familles au détriment des vivants (scolarité, santé). De nombreuses communautés réfléchissent à des règles pour en réduire le coût.</p>",
      retenir: "Honorer les morts sans sacrifier les vivants : un équilibre à trouver." }
  ],
  revision: ["Étapes : annonce, veillée, inhumation, deuil, funérailles.", "Changements : morgue, religion, réseaux sociaux.", "Débat : sens et coût des funérailles."],
  exo: "<p>Prépare un exposé de deux minutes : « Les funérailles dans ma communauté hier et aujourd'hui ».</p>",
  quiz: [
    { q: "Moyen traditionnel d'annoncer un décès :", r: ["le tam-tam", "la télévision", "la poste"], b: 0, e: "Le tam-tam parleur transmettait les messages." },
    { q: "Pourquoi la morgue a-t-elle changé les funérailles ?", r: ["Elle permet d'attendre la famille dispersée", "Elle les a interdites", "Elle ne change rien"], b: 0, e: "Les familles vivent souvent loin du village." },
    { q: "Une critique fréquente des funérailles actuelles :", r: ["leur coût élevé", "leur brièveté", "leur absence"], b: 0, e: "Elles peuvent appauvrir les familles." }
  ]
});

VRT_L("tle-orient-temps", {
  c: "Tle A", m: "orientation", cle: "La gestion du temps", titre: "Gérer son temps en classe d'examen", duree: 15,
  scenes: ["tle-orientation-choisir-sa-filiere"],
  accroche: "24 heures, 7 matières, 1 bac : un emploi du temps qui marche.",
  intro: "L'année du baccalauréat passe vite. Ceux qui réussissent ne travaillent pas forcément plus : ils organisent mieux leur temps.",
  objectifs: ["faire le bilan de son emploi du temps", "construire un planning réaliste", "lutter contre la procrastination"],
  parties: [
    { t: "Faire le bilan", html:
      "<p>Pendant une semaine, note ce que tu fais heure par heure : cours, trajets, travaux domestiques, téléphone, sommeil, révisions. Tu découvriras souvent des « heures perdues » (réseaux sociaux, attentes).</p>",
      retenir: "On ne gère bien que ce que l'on mesure." },
    { t: "Construire un planning", html:
      "<ul><li>Bloque d'abord le <strong>sommeil</strong> (7 à 8 h) et les cours.</li><li>Prévois des séances courtes (40 à 50 min) suivies de pauses.</li><li>Donne plus de temps aux matières à <strong>fort coefficient</strong> et à celles où tu es faible.</li><li>Garde un temps libre pour le repos, le sport, la famille.</li></ul>",
      illus: { legende: "Exemple d'une soirée bien découpée.", svg:
      "<svg viewBox='0 0 460 120' role='img' aria-label='Planning d une soirée'><g font-size='11' text-anchor='middle'><rect x='10' y='40' width='80' height='40' rx='8' fill='#DDF2F4'/><text x='50' y='64' fill='#0A4F55'>16h-17h repos</text><rect x='94' y='40' width='100' height='40' rx='8' fill='#0E7C86'/><text x='144' y='64' fill='#fff'>17h-18h philo</text><rect x='198' y='40' width='30' height='40' rx='8' fill='#FFC93C'/><text x='213' y='64' fill='#142554'>pause</text><rect x='232' y='40' width='100' height='40' rx='8' fill='#0E7C86'/><text x='282' y='64' fill='#fff'>18h15 français</text><rect x='336' y='40' width='114' height='40' rx='8' fill='#E4E9F2'/><text x='393' y='64' fill='#0C2A6A'>dîner, famille</text></g><text x='10' y='104' font-size='12' fill='#636A80'>Séances de 45 à 50 min, pauses courtes, matières fortes en premier.</text></svg>" },
      retenir: "Un planning réaliste vaut mieux qu'un planning parfait jamais suivi." },
    { t: "Vaincre la procrastination", html:
      "<ul><li>Commence par une tâche de 5 minutes : le plus dur est de commencer.</li><li>Téléphone en mode silencieux et hors de portée pendant la séance.</li><li>Coche ce qui est fait : voir ses progrès motive.</li></ul>",
      retenir: "Commencer petit, mais commencer aujourd'hui." }
  ],
  revision: ["Bilan d'une semaine heure par heure.", "Sommeil et cours d'abord.", "Séances de 40 à 50 min + pauses.", "Priorité aux forts coefficients et aux faiblesses.", "Téléphone éloigné pendant le travail."],
  exo: "<p>Construis ton planning de la semaine prochaine (soirées et week-end) et affiche-le chez toi.</p>",
  quiz: [
    { q: "Combien d'heures de sommeil viser ?", r: ["4 à 5 h", "7 à 8 h", "12 h"], b: 1, e: "Le sommeil fixe les apprentissages." },
    { q: "Durée conseillée d'une séance de travail :", r: ["40 à 50 min", "4 heures sans pause", "10 min"], b: 0, e: "Suivie d'une pause courte." },
    { q: "Contre la procrastination :", r: ["attendre l'inspiration", "commencer par une tâche de 5 min", "tout faire la veille"], b: 1, e: "Le plus dur est de commencer." }
  ]
});

VRT_L("tle-orient-bac", {
  c: "Tle A", m: "orientation", cle: "La préparation à long terme", titre: "Préparer le baccalauréat à long terme", duree: 15,
  scenes: ["tle-orientation-entretien-affirmation"],
  accroche: "Le bac se gagne en octobre, pas la veille de l'examen.",
  intro: "Réussir le baccalauréat est un marathon. La préparation commence dès la rentrée, avec une méthode et des objectifs.",
  objectifs: ["se fixer des objectifs", "organiser les révisions sur l'année", "prendre soin de sa santé"],
  parties: [
    { t: "Se fixer des objectifs", html:
      "<p>Calcule la moyenne visée et fixe un objectif par matière, en tenant compte des <strong>coefficients</strong> de ta série. Un objectif doit être précis, mesurable et daté : « passer de 8 à 11 en philosophie au deuxième trimestre ».</p>",
      retenir: "Un objectif flou ne guide pas ; un objectif chiffré, oui." },
    { t: "Organiser l'année", html:
      "<ul><li><strong>Au fil des cours</strong> : relire chaque leçon le jour même, faire des fiches.</li><li><strong>Chaque mois</strong> : traiter un sujet d'examen par matière (annales corrigées).</li><li><strong>Aux congés</strong> : réviser les chapitres passés, combler les lacunes.</li><li><strong>Les deux derniers mois</strong> : sujets en conditions réelles, chronométrés.</li></ul>",
      illus: { legende: "Une montée progressive vers l'examen.", svg:
      "<svg viewBox='0 0 460 150' role='img' aria-label='Préparation progressive du baccalauréat'><path d='M20 130 L120 110 L220 85 L320 55 L430 20' fill='none' stroke='#0E7C86' stroke-width='4' stroke-linecap='round'/><g fill='#FFC93C' stroke='#0A4F55' stroke-width='2'><circle cx='20' cy='130' r='7'/><circle cx='120' cy='110' r='7'/><circle cx='220' cy='85' r='7'/><circle cx='320' cy='55' r='7'/><circle cx='430' cy='20' r='9'/></g><g font-size='11' fill='#142554'><text x='24' y='148'>rentrée : fiches</text><text x='110' y='132'>annales chaque mois</text><text x='190' y='108'>congés : lacunes</text><text x='270' y='78'>sujets chronométrés</text><text x='392' y='44' font-weight='700'>BAC</text></g></svg>" },
      retenir: "Régularité + annales = confiance le jour J." },
    { t: "Prendre soin de soi", html:
      "<p>Sommeil, alimentation équilibrée, activité physique, moments de détente : un corps en forme apprend mieux. En cas de stress, parle à un conseiller d'orientation, un enseignant ou un parent.</p>",
      retenir: "La santé fait partie de la préparation." }
  ],
  revision: ["Objectifs précis, chiffrés, datés.", "Relire chaque jour, faire des fiches.", "Une annale par mois et par matière.", "Sujets chronométrés en fin d'année.", "Santé et soutien : conseiller d'orientation."],
  exo: "<p>Écris tes trois objectifs du trimestre (matière, note visée, moyen d'y arriver).</p>",
  quiz: [
    { q: "Quand commence la préparation du bac ?", r: ["La veille", "Dès la rentrée", "Après les résultats"], b: 1, e: "C'est un marathon." },
    { q: "Un bon objectif est…", r: ["« faire mieux »", "chiffré et daté", "secret"], b: 1, e: "On peut alors mesurer ses progrès." },
    { q: "En fin d'année, on privilégie…", r: ["les sujets chronométrés", "les nouvelles leçons", "le repos complet"], b: 0, e: "Pour s'habituer au temps de l'épreuve." }
  ]
});
