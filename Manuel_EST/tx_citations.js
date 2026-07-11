/* =====================================================================
   Banque de citations littéraires classées par thème — VERBATIM
   Source : DJAMEN Georges William, Aide au traitement — Dissertation
   littéraire (« Grenier de citations », 155 citations). OCR nettoyé
   (numérotation, coquilles évidentes) ; le libellé et l'attribution
   sont conservés mot pour mot.
   ===================================================================== */

const engagement = { theme:"L’engagement littéraire et le rôle de l’écrivain",
  question:"Quel est le but de l’art ? Pourquoi écrit-on ? Quelle est la fonction de l’écrivain ?",
  cits:[
    ["Rendre la vertu aimable, le vice odieux, le ridicule saillant, voilà le projet de tout homme honnête qui prend la plume.","Diderot"],
    ["Le rôle de l’écrivain ou sa mission envers le public est de combattre l’injustice partout où elle se trouve.","Jean-Paul Sartre"],
    ["Si la littérature existe, c’est parce que la société est malade.","Jean-Paul Sartre"],
    ["L’écrivain engagé sait que la parole est action ; il sait que dévoiler, c’est changer, et qu’on ne peut changer qu’en projetant de changer.","Jean-Paul Sartre"],
    ["Il n’y a d’art que par et pour autrui.","Jean-Paul Sartre"],
    ["Corriger les hommes est l’unique fin que l’on doit se proposer en écrivant.","La Bruyère"],
    ["L’art pour l’art peut être beau ; mais l’art pour le progrès est plus beau encore.","Victor Hugo"],
    ["La poésie n’est pas un ornement, elle est un instrument.","Victor Hugo"],
    ["Inquiéter, tel est mon rôle.","André Gide"],
    ["La véritable fonction de l’écrivain est d’inquiéter.","Malraux"],
    ["Honte à qui peut chanter pendant que Rome brûle.","Alphonse de Lamartine"],
    ["Un livre doit remuer les plaies, en provoquer même. Un livre doit être un danger.","Emil Cioran"],
    ["Ma bouche sera la bouche des malheurs qui n’ont point de bouche, ma voix la liberté de celles qui s’affaissent au cachot du désespoir.","Aimé Césaire"],
    ["Le monde romanesque est la correction de ce monde-ci selon le désir profond de l’homme.","Albert Camus"],
  ]};

const artPourArt = { theme:"L’art pour l’art et la beauté",
  question:"Comment doit-on écrire ? La littérature doit-elle être utile ou belle ?",
  cits:[
    ["Il n’y a de vraiment beau que ce qui ne peut servir à rien ; tout ce qui est utile est laid.","Théophile Gautier"],
    ["Dès qu’une chose devient belle, elle cesse d’être utile.","Théophile Gautier"],
    ["L’artiste ne met rien au-dessus de l’art, et il s’aperçoit vite qu’il ne peut créer que pour rien.","Alain Robbe-Grillet"],
    ["La forme seule conserve les œuvres de l’esprit.","Mistral"],
    ["On n’est pas écrivain pour avoir choisi de dire certaines choses, mais pour avoir choisi de les dire d’une certaine façon.","Jean-Paul Sartre"],
    ["Le beau ne fleurit que sur l’utile.","Alain"],
    ["La littérature, c’est la pensée accédant à la beauté.","Charles Du Bos"],
  ]};

const reel = { theme:"Le réel : l’œuvre comme reflet de la vie",
  question:"D’où naissent les écrits d’un auteur ? Quelles sont ses sources d’inspiration ?",
  cits:[
    ["Le roman c’est la vie de tous les jours dans le langage de tous les jours.","Michel Butor"],
    ["Le roman a la prétention de nous peindre la vie sociale.","François Mauriac"],
    ["Opposer l’art à la vie est absurde, parce qu’on ne peut faire l’art qu’avec la vie.","André Gide"],
    ["L’art se nourrit de la vie pour produire autre chose qui est l’œuvre.","Nelly Cormeau"],
    ["Je suis moi-même la matière première de mes livres.","Montaigne"],
    ["Le roman est une histoire qui se promène le long de la rue.","Stendhal"],
  ]};

const imaginaire = { theme:"L’imaginaire : création, fiction et subjectivité",
  question:"L’œuvre copie-t-elle le réel, ou le recrée-t-elle ?",
  cits:[
    ["Toute œuvre d’art est un beau mensonge.","Stendhal"],
    ["Une œuvre d’art est un coin de création vu à travers un tempérament.","Émile Zola"],
    ["La mission de l’art n’est pas de copier la nature, mais de l’exprimer. Tu n’es pas un vil copiste mais un poète.","Balzac"],
    ["En littérature, le vrai n’est pas concevable.","Paul Valéry"],
    ["Le théâtre n’est pas le pays du réel, c’est le pays du vrai.","Victor Hugo"],
    ["Écrire, c’est transfigurer la réalité.","Henri Lopes"],
    ["Non, ni le réel seul, ni l’imagination toute seule, mais l’imagination à partir du réel.","Albert Camus"],
    ["L’art conteste le réel, mais ne se dérobe pas à lui.","Albert Camus"],
    ["L’œuvre d’art la plus accomplie serait celle qui se tiendrait à égale distance de l’idéalisme et du réalisme.","André Gide"],
  ]};

const temps = { theme:"La temporalité et l’intemporalité des œuvres",
  question:"Les œuvres littéraires sont-elles éternelles ? Qu’est-ce qui les pérennise ?",
  cits:[
    ["Toute création authentique est un don à l’avenir.","Albert Camus"],
    ["Les œuvres du passé sont bonnes pour le passé, elles ne sont pas bonnes pour nous.","Antonin Artaud"],
    ["Il n’y a pas de chefs-d’œuvre dans l’éternité, il n’y a que des œuvres dans le temps.","Henri de Montherlant"],
    ["Puisque l’écrivain n’a aucun moyen de s’évader, nous voulons qu’il embrasse étroitement son époque : elle est sa chance unique.","Jean-Paul Sartre"],
    ["Les très grands livres sont absolument sans dates.","Claude Roy"],
    ["Le journaliste s’occupe du temps qui passe, l’écrivain du temps qui dure.","Jean d’Ormesson"],
  ]};

const lecture = { theme:"Le livre, la lecture et le lecteur",
  question:"Pour qui écrit-on ? Que faut-il lire ? À quoi sert la lecture ?",
  cits:[
    ["Tout homme qui sait lire est un être sauvé.","Victor Hugo"],
    ["Un livre est une fenêtre par laquelle on s’évade.","Julien Green"],
    ["Ceux qui brûlent des livres finissent tôt ou tard par brûler les hommes.","Heinrich Heine"],
    ["Les meilleurs livres sont ceux dont les lecteurs écrivent plus de la moitié.","André Gide"],
    ["Je n’ai jamais eu de chagrin qu’une heure de lecture n’ait dissipé.","Montesquieu"],
    ["On ne lit jamais un livre : on se lit à travers des livres, soit pour se découvrir, soit pour se contrôler.","Romain Rolland"],
  ]};

const auteurHeros = { theme:"L’auteur, son œuvre et son héros",
  question:"Le personnage est-il le reflet de l’auteur ? Comment doit être un héros ?",
  cits:[
    ["L’écrivain doit être aussi absent de son œuvre que Dieu dans la sienne.","Gustave Flaubert"],
    ["Nous sommes convaincus que les grands écrivains ont mis leur histoire dans leurs ouvrages. On ne peint que son cœur en l’attribuant à un autre, et la meilleure partie du génie se compose de souvenirs.","Chateaubriand"],
    ["Quand je parle de moi, je parle de vous.","Victor Hugo"],
    ["Chaque homme porte en soi la forme particulière de l’humaine condition.","Montaigne"],
    ["Un héros, c’est celui qui fait ce qu’il peut, tandis que les autres ne le font pas.","Romain Rolland"],
    ["Mon avis est que l’on ne peut créer des personnages que lorsqu’on a beaucoup étudié les hommes.","Dumas fils"],
    ["À travers le roman se voient ou se cachent les maladies du corps social.","Maurice Nadeau"],
  ]};

const THEMES = [engagement, artPourArt, reel, imaginaire, temps, lecture, auteurHeros];

module.exports = { THEMES, engagement, artPourArt, reel, imaginaire, temps, lecture, auteurHeros };
