<?php
/**
 * api/_oeuvres_auteurs.php — QUI A ÉCRIT QUOI, dans l'index des œuvres.
 * ---------------------------------------------------------------------------
 * POURQUOI CE FICHIER EXISTE
 *
 * L'index `oeuvres_index.db` porte, dans sa colonne `files.author`, la valeur
 * « Œuvre au programme MINESEC » pour LES 115 œuvres. Ce n'est pas un auteur,
 * c'est une étiquette de collection. Le passage du jour affichait donc le titre
 * à la place de la signature, et « Œuvre au programme MINESEC » en dessous —
 * un extrait d'Assèze l'Africaine ne portait nulle part le nom de Calixthe
 * Beyala.
 *
 * Le vrai nom vit dans le TITRE, qui est en réalité un nom de FICHIER, et les
 * formes s'y contredisent :
 *     « Coeur du Sahel - Djaili Amadou Amal »        → auteur APRÈS le tiret
 *     « Antoine Nguidjol - Cameroun nation en péril » → auteur AVANT le tiret
 *     « EZA BOTO, Ville cruelle »                     → auteur avant la virgule
 *     « Branle-Bas en Noir et Blanc (Mongo Beti) »    → auteur entre parenthèses
 *     « Assèze l'Africaine »                          → aucun auteur
 *
 * Aucune règle automatique ne survit à ça : elle attribuerait « Cameroun nation
 * en péril » à un auteur nommé « Antoine Nguidjol - Cameroun nation en péril »,
 * ou pire, signerait un texte du nom de quelqu'un d'autre. Attribuer un extrait
 * au mauvais auteur est la faute qu'on ne rattrape pas — d'où cette table
 * écrite à la main.
 *
 * RÈGLE DE PRUDENCE : une œuvre dont l'auteur n'est pas certain reste à ''.
 * L'affichage retombe alors sur le titre seul, exactement comme avant. Mieux
 * vaut pas de signature qu'une signature fausse.
 *
 * ⚠️ RELECTURE ATTENDUE — cette table est une attribution éditoriale. Les
 * entrées vides sont à compléter, les autres à confirmer.
 *
 * CLÉ : le nom de fichier réduit aux lettres et chiffres, sans accents ni
 * ponctuation (voir oa_cle()). Ça résiste aux « @EpubsFR », « (Z-Library) »,
 * aux accents mal encodés et aux doubles espaces des noms de fichiers.
 */

/** Réduit un nom de fichier à une clé stable : minuscules, sans accent ni signe. */
function oa_cle($s)
{
    $s = (string) $s;
    if (function_exists('iconv')) {
        $t = @iconv('UTF-8', 'ASCII//TRANSLIT//IGNORE', $s);
        if ($t !== false) { $s = $t; }
    }
    $s = strtolower($s);
    return preg_replace('/[^a-z0-9]+/', '', $s);
}

/**
 * Table : clé → [auteur, titre affichable].
 * Un auteur vide ('') = non attribué, on n'invente pas.
 */
function oa_table()
{
    return [
        // ── Calixthe Beyala ──────────────────────────────────────────────
        'assezelafricaine'                      => ['Calixthe Beyala', "Assèze l'Africaine"],
        'amourssauvages'                        => ['Calixthe Beyala', 'Amours sauvages'],
        'balletnoirachateaurouge'               => ['Calixthe Beyala', 'Ballet noir à Château-Rouge'],
        'cestlesoleilquimabruleecalixthebeyala' => ['Calixthe Beyala', "C'est le soleil qui m'a brûlée"],
        'commentcuisinersonmarialafricaine'     => ['Calixthe Beyala', "Comment cuisiner son mari à l'africaine"],
        'ebookcalixthebeyalalechristselonlafrique' => ['Calixthe Beyala', "Le Christ selon l'Afrique"],
        'lechristselonlafrique'                 => ['Calixthe Beyala', "Le Christ selon l'Afrique"],
        'femmenuefemmenoire'                    => ['Calixthe Beyala', 'Femme nue, femme noire'],
        'lhommequimoffraitleciel'               => ['Calixthe Beyala', "L'homme qui m'offrait le ciel"],
        'lapetitefilledureverbere'              => ['Calixthe Beyala', 'La Petite Fille du réverbère'],
        'lepetitprincedebelleville'             => ['Calixthe Beyala', 'Le Petit Prince de Belleville'],
        'leromandepauline'                      => ['Calixthe Beyala', 'Le roman de Pauline'],
        'lesarbresenparlentencore'              => ['Calixthe Beyala', 'Les arbres en parlent encore'],
        'leshonneursperdus'                     => ['Calixthe Beyala', 'Les Honneurs perdus'],
        'mamanaunamant'                         => ['Calixthe Beyala', 'Maman a un amant'],
        'laplantation'                          => ['Calixthe Beyala', 'La Plantation'],

        // ── Mongo Beti (et son pseudonyme Eza Boto) ──────────────────────
        'branlebasennoiretblancmongobeti'       => ['Mongo Beti', 'Branle-bas en noir et blanc'],
        'laruinepresquecocassedunpolichinellemongobeti' => ['Mongo Beti', "La Ruine presque cocasse d'un polichinelle"],
        'lepauvrechristdebombamongobeti'        => ['Mongo Beti', 'Le Pauvre Christ de Bomba'],
        'perpetueetlhabitudedumalheurbetimongo' => ['Mongo Beti', "Perpétue et l'habitude du malheur"],
        'ezabotovillecruelle'                   => ['Eza Boto', 'Ville cruelle'],

        // ── Patrice Nganang ──────────────────────────────────────────────
        'lajoiedevivreromannganangalainpatricelechat' => ['Patrice Nganang', 'La Joie de vivre'],
        'patricenganangmontplaisantepubsfr'     => ['Patrice Nganang', 'Mont plaisant'],
        'nganangpatriceempreintesdecrabe'       => ['Patrice Nganang', 'Empreintes de crabe'],

        // ── Djaïli Amadou Amal ───────────────────────────────────────────
        'coeurdusaheldjailiamadouamal'          => ['Djaïli Amadou Amal', 'Cœur du Sahel'],
        'djailiamadouamalwalaande'              => ['Djaïli Amadou Amal', 'Walaandé'],
        'ebookdjailiamadouamallesimpatientes'   => ['Djaïli Amadou Amal', 'Les Impatientes'],
        'leharemduroidjailiamadouamalzlibrary'  => ['Djaïli Amadou Amal', 'Le Harem du roi'],

        // ── Max Lobe ─────────────────────────────────────────────────────
        '39ruedeberne'                          => ['Max Lobe', '39 rue de Berne'],
        'ebookmaxlobelapromessedesaphallexcellence' => ['Max Lobe', "La Promesse de sa Phall'Excellence"],
        'latrinitebantoue'                      => ['Max Lobe', 'La Trinité bantoue'],
        'ladansedesperesmaxlobezlibrary'        => ['Max Lobe', 'La danse des pères'],

        // ── Eugène Ébodé ─────────────────────────────────────────────────
        'brulantetaitleregarddepicasso'         => ['Eugène Ébodé', 'Brûlant était le regard de Picasso'],
        'habillerlecielebodeeugeneepubsfr'      => ['Eugène Ébodé', 'Habiller le ciel'],
        'larosedanslebusjaune'                  => ['Eugène Ébodé', 'La Rose dans le bus jaune'],
        'souverainemagnifique'                  => ['Eugène Ébodé', 'Souveraine magnifique'],
        'zamzamebodeeugenezlibrary'             => ['Eugène Ébodé', 'Zam-Zam'],

        // ── Mutt-Lon ─────────────────────────────────────────────────────
        'ceuxquisortentdanslanuit'              => ['Mutt-Lon', 'Ceux qui sortent dans la nuit'],
        'laprocessiondescharognardsmuttlon'     => ['Mutt-Lon', 'La procession des charognards'],
        'les700aveuglesdebafia'                 => ['Mutt-Lon', 'Les 700 aveugles de Bafia'],

        // ── Francis Bebey ────────────────────────────────────────────────
        'francisbebeylefilsdagatamoudio'        => ['Francis Bebey', "Le Fils d'Agatha Moudio"],
        'lalunedansunseautoutrougefrancisbebeyepubsfr' => ['Francis Bebey', 'La Lune dans un seau tout rouge'],
        'lapoupeeashantifrancisbebeyepubsfr'    => ['Francis Bebey', 'La Poupée ashanti'],

        // ── Gaston-Paul Effa ─────────────────────────────────────────────
        'gastonpauleffalenfantquetuasetemarcheacotedetoiepubsfr' => ['Gaston-Paul Effa', "L'enfant que tu as été marche à côté de toi"],
        'laverticaleducrigastonpauleffazlibrary' => ['Gaston-Paul Effa', 'La verticale du cri'],
        'lesparfumselementairesgastonpauleffaetczlibrary' => ['Gaston-Paul Effa', 'Les parfums élémentaires'],
        'maromangastonpauleffajanuary11998parisbgrasset9782246' => ['Gaston-Paul Effa', 'Mâ'],

        // ── Patrice Kayo ─────────────────────────────────────────────────
        'pkayofablesdesmontagnes'               => ['Patrice Kayo', 'Fables des montagnes'],
        'patricekayovepredesjoursdedoute'       => ['Patrice Kayo', 'Vêpres des jours de doute'],
        'patricekayohymneetsagessesuivideparolesintimes' => ['Patrice Kayo', 'Hymne et sagesse, suivi de Paroles intimes'],

        // ── Hemley Boum ──────────────────────────────────────────────────
        // Le nom de fichier porte « Hemley Bloom » : coquille du dépôt, pas un
        // autre auteur. On rétablit l'orthographe exacte.
        'hemleybloomlerevedupecheurepublivres'  => ['Hemley Boum', 'Le Rêve du pêcheur'],
        'lesmaquisards'                         => ['Hemley Boum', 'Les Maquisards'],

        // ── Guillaume Oyono Mbia ─────────────────────────────────────────
        'chroniquesdemvoutessi2guillaumeoyonombia1971editionscleyaou' => ['Guillaume Oyono Mbia', 'Chroniques de Mvoutessi 2'],
        'troispretendantsunmaribestmbiaguillaumeoyono20000929poc' => ['Guillaume Oyono Mbia', 'Trois prétendants… un mari'],

        // ── Séverin Cécile Abega ─────────────────────────────────────────
        'leseintestprisseverincecileabegaepubsfr' => ['Séverin Cécile Abega', "Le sein t'est pris"],
        'bimaneslesseverincecileabegaepubsfr'   => ['Séverin Cécile Abega', 'Les Bimanes'],

        // ── Autres auteurs, une œuvre chacun ─────────────────────────────
        'aucoeurdestenebresjosephconrad'        => ['Joseph Conrad', 'Au cœur des ténèbres'],
        'moliereletartuffeepubsfr'              => ['Molière', 'Le Tartuffe'],
        'sullyprudhommestancesetpoemesepubsfr'  => ['Sully Prudhomme', 'Stances et poèmes'],
        'lelionetlaperle'                       => ['Wole Soyinka', 'Le Lion et la Perle'],
        'levieuxnegreetlamedaille'              => ['Ferdinand Oyono', 'Le Vieux Nègre et la Médaille'],
        'elleseradejaspeetdecorailwerewereliking' => ['Werewere Liking', 'Elle sera de jaspe et de corail'],
        'engelbertmvengbalafon'                 => ['Engelbert Mveng', 'Balafon'],
        'etquemonregnearriveleonoramianoefflorescence2022thequilomb' => ['Léonora Miano', 'Et que mon règne arrive'],
        'imbolombuevoicivenirlesreveurs'        => ['Imbolo Mbue', 'Voici venir les rêveurs'],
        'jeanpliyalarbrefetiche'                => ['Jean Pliya', "L'Arbre fétiche"],
        'leparadisdunordjressombaparisfrance1996presenceafrica' => ['J. R. Essomba', 'Le Paradis du Nord'],
        'lemoabicinema'                         => ['Blick Bassy', 'Le Moabi Cinéma'],
        'osvaldelewatlesaquatiquesepubsfr'      => ['Osvalde Lewat', 'Les Aquatiques'],
        'lettresdemacambuserphilombeweliborg'   => ['René Philombe', 'Lettres de ma cambuse'],
        'ngumajemeadedmbangaeyombwan'           => ['D. Mbanga Eyombwan', 'Ngum a Jemea'],
        'petitjoenfantdesruesdeemngolle'        => ['Evelyne Mpoudi Ngollé', 'Petit Jo, enfant des rues'],
        'auvessourisromancollectioncritsfrenchnangabernard1934co' => ['Bernard Nanga', 'Les Chauves-souris'],
        'lhommedelaruepabemongoepubsfr'         => ['Pabé Mongo', "L'Homme de la rue"],
        'pabemongopereinconnu'                  => ['Pabé Mongo', 'Père inconnu'],
        'gombogerarddelteilzlibrary'            => ['Gérard Delteil', 'Gombo'],
        'commeunereineernisepubsfr'             => ['Ernis', 'Comme une reine'],
        'etrefleurirkiyemiszlibrary'            => ['Kiyémis', 'Et, refleurir'],
        'kiyemisjesuisvotrepirecauchemarepubsfr' => ['Kiyémis', 'Je suis votre pire cauchemar !'],
        'charlescedrictsimiclandestinementvotreepubsfr' => ['Charles Cédric Tsimi', 'Clandestinement vôtre'],
        'chocolatelegoutamerdelacultureducacaosamymangazlibrary' => ['Samy Manga', 'Chocolaté'],
        'gastonkelmanjesuisnoiretjenaimepaslemaniocepublivres' => ['Gaston Kelman', "Je suis noir et je n'aime pas le manioc"],
        'davidmassomapandongnkumwamle8enotable' => ['David Massoma Pandong', "N'kum Wam, le 8e notable"],
        'mapassionafricaineclaudenjikebergeretparis1998franceloisirs' => ['Claude Njiké-Bergeret', 'Ma passion africaine'],
        'mangwelouneladanseuseduroinjoyaromanhenrinicodpoitiers10' => ['Henri Nicod', 'Mangweloune, la danseuse du roi Njoya'],
        'masquesnegresenobelinga1972editionscleyaounde7532bf3cad8b7' => ['Eno Belinga', 'Masques nègres'],
        'lecriplurielpauldakeyo2019panafrikaencoeditionavecnena9' => ['Paul Dakeyo', 'Le cri pluriel'],
        'laforetillumineesuiviedebouledechagrinstheatregervaismendoze' => ['Gervais Mendo Ze', 'La forêt illuminée, suivie de Boule de chagrins'],
        'ulrichcabreletiennelonguevillebozaepublivres' => ['Ulrich Cabrel et Étienne Longueville', 'Boza !'],
        'lacroixdusuddejngoue'                  => ['J. Ngoué', 'La Croix du Sud'],

        // ── Attribution NON ÉTABLIE — à compléter après vérification ──────
        // Ces œuvres tournent dans le passage du jour sous leur seul titre.
        // Ne rien écrire ici tant que l'auteur n'est pas confirmé.
        'afanedemendi'              => ['', 'Afane de Mendi'],
        'agisdunseulcoeur'            => ['', "Agis d'un seul cœur"],
        'confidences'               => ['', 'Confidences'],
        'jusquanouvelavis'          => ['', "Jusqu'à nouvel avis"],
        'leschantsdelaforet'        => ['', 'Les Chants de la forêt'],
        'lasaisondesprunes'         => ['', 'La saison des prunes'],
        'latraverseedemontparnasse' => ['', 'La traversée de Montparnasse'],
        'lebaldesprinces'           => ['', 'Le Bal des princes'],
        'lebusdanslaville'          => ['', 'Le Bus dans la ville'],
        'lestribusdecapitoline'     => ['', 'Les Tribus de Capitoline'],
        'lescontesdekorotoumou'     => ['', 'Les contes de Korotoumou'],
    ];
}

/**
 * Œuvres ÉCARTÉES du passage du jour.
 *
 * Le passage du jour est une vitrine de LECTURE : un extrait qui donne envie
 * d'ouvrir le livre. Un paragraphe d'essai politique, une enquête sur des
 * morts non élucidées ou un fichier dont le nom est resté « LARVOL~1 » n'y ont
 * rien à faire — et un élève de 6ᵉ tombant dessus n'y comprendrait rien.
 * Ces titres restent dans l'index (la recherche et le RAG y accèdent) ; ils ne
 * sont simplement jamais tirés comme passage du jour.
 */
function oa_exclus()
{
    return [
        'larvol1'      => 'nom de fichier illisible, contenu non identifié',
        'lpreq1'       => 'nom de fichier illisible, contenu non identifié',
        'commentairecompose' => 'document de méthode, pas une œuvre',
        'agisdunseulcoeur0001' => 'doublon de « Agis d\'un seul cœur »',
        'antoinenguidjolcamerounnationenperilepubsfr' => 'essai politique',
        'criseanglophonecamerounbouopdapierrekameepubsfr' => 'essai politique',
        'larevolteanglophoneessaisdelibertedeprisonetalainpatricenganan' => 'essai politique',
        'feboussiboulagalacrisedumuntu' => 'essai philosophique',
        'marcientowaessaisurlaproblematiquephilosobokxyz' => 'essai philosophique',
        'delamacdiocritacalaeurtmexcellence' => 'essai',
        'lafriquenoireestmalpartierenedumont' => 'essai économique',
        'lemalafricainaliougargahamanadjizlibrary' => 'essai',
        'rivieredesangenquetessurlesmortsnonelucideesquiarolk' => 'enquête criminelle',
        'titusedzoameditationsdeprisonepublivres' => 'témoignage politique',
    ];
}

/**
 * Cherche une clé dans un tableau, par égalité PUIS par préfixe.
 *
 * Pourquoi le préfixe : une partie des noms de fichiers traîne un ISBN, une
 * date, un éditeur et une empreinte de dépôt —
 *   « Le cri pluriel -- Paul Dakeyo -- 2019 -- Panafrika … -- 9782379181450 …
 *     -- fa402085a785a4e6dc7a6ddecbf56f72 -- Anna's Archive »
 * soit 110 caractères de clé dont les 40 premiers suffisent à identifier
 * l'œuvre. Écrire ces suites dans la table serait illisible et se casserait
 * au moindre réencodage du dépôt.
 *
 * La correspondance LA PLUS LONGUE gagne : sans ça, « agisdunseulcoeur »
 * capterait aussi « agisdunseulcoeur0001 », son doublon.
 */
function oa_trouver($k, array $table)
{
    if (isset($table[$k])) { return $k; }
    $meilleur = null;
    foreach ($table as $cle => $_) {
        if ($cle !== '' && strpos($k, $cle) === 0) {
            if ($meilleur === null || strlen($cle) > strlen($meilleur)) { $meilleur = $cle; }
        }
    }
    return $meilleur;
}

/** Auteur + titre propres pour un nom de fichier. Auteur '' si non établi. */
function oa_pour($nomFichier)
{
    $t = oa_table();
    $k = oa_trouver(oa_cle($nomFichier), $t);
    if ($k !== null) {
        return ['auteur' => $t[$k][0], 'titre' => $t[$k][1]];
    }
    return ['auteur' => '', 'titre' => ''];
}

/** Ce nom de fichier est-il écarté du passage du jour ? */
function oa_est_exclu($nomFichier)
{
    return oa_trouver(oa_cle($nomFichier), oa_exclus()) !== null;
}
