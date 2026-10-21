# Textes de l'affaire de Nyons (« Le noyé de l'Ouvèze »).
# Source unique des textes : lu par verifier_textes.py (contrôles + document
# lisible) puis converti en data.json par construire.py.
#
# Balises : {{p:id|texte}} personne, {{l:id|texte}} lieu, {{d:id|texte}} pièce.
# Notes du carnet : (fiche, étiquette, texte). Étiquette vide = pas d'étiquette.

AFFAIRE = dict(
    titre="Le noyé de l'Ouvèze",
    sous_titre="Une enquête du Bureau des affaires occultes",
    annee=1994,
    pistes_accordees=20,
    journal="Le Drômois",
    date_une="Samedi 25 juin 1994",
    prix_une="4,80 F",
    localite="NYONS (26)",
    meteo="soleil",
    jours=["Vendredi 17 juin", "Samedi 18 juin", "Lundi 20 juin", "Mardi 21 juin", "Mercredi 22 juin"],
    creneaux=["9 h", "11 h", "14 h", "16 h"],
    bouclage="Jeudi 23 juin, 18 h : bouclage",
)

DOCUMENTS = {
    "lettre_anonyme": "La lettre anonyme",
    "photo_concours": "La photo du Grand Prix de la Digue",
    "coupure_1992": "La photo de Garcin en 1992",
    "lettre_chabert": "La lettre du meunier",
    "cles_moulin": "Les clés du moulin",
    "portrait_robot": "Le portrait-robot",
    "lampe": "La lampe du camping des Saules",
    "pv": "Le procès-verbal des gendarmes",
    "analyse": "L'analyse du laboratoire",
    "assurance": "L'assurance-vie de Jacques Garcin",
    "mandats": "Les mandats à L. Royer",
    "carnet_firmin": "Le carnet de Firmin Achard",
    "brouillon": "Le brouillon du meunier",
    "feuille_concours": "La feuille d'inscription du Grand Prix",
    "carte_thierry": "La carte postale de Thierry",
    "boules": "Les boules gravées J.G.",
    "photo_famille": "La photo de famille",
    "temoignage_karim": "Ce que Karim a vu aux Saules",
}

INTRO = """Jeudi 16 juin 1994, quatrième étage du siège, à Lyon. Il fait déjà trente degrés à dix heures, et le ventilateur d'Odile brasse du papier.

La lettre est arrivée au courrier du matin. Une feuille de cahier à petits carreaux, une écriture d'écolière, ronde, appliquée. Pliée dedans, une page du Drômois du 2 juin. Dans un coin de la page, des taches rouge sombre, comme du jus. Cachet de la poste : Nyons, mardi 14.

{{d:lettre_anonyme|« Monsieur le journaliste des Affaires occultes. Vous écrivez sur les fantômes, alors venez à Nyons. Regardez la photo. L'homme de droite, c'est Jacques Garcin. Il s'est noyé dans l'Ouvèze le 22 septembre 1992, son nom est sur la plaque à Vaison. Maintenant il joue aux boules. Ici tout le monde le dit : la rivière rend ses morts. Le meunier Chabert a juré qu'il l'avait vu emporter. Le meunier a menti. Demandez-lui pourquoi. »}}

La page, c'est {{d:photo_concours|la photo des vainqueurs du Grand Prix de la Digue}}, au {{l:boulodrome|boulodrome de Nyons}}. Deux hommes en maillot de corps, une coupe entre eux. La légende dit {{p:tardieu|Raoul Tardieu}} et {{p:royer|Lucien Royer}}. Royer a tourné la tête au moment du flash. On voit une oreille, une joue, une casquette.

À onze heures, Odile remonte avec un fax de l'agence de Valence. Une brève du Drômois du matin. « Nyons : le meunier noyé dans le canal. » {{p:chabert|Aimé Chabert}}, 63 ans, propriétaire du {{l:moulin|moulin à huile}} du quartier du Pont roman, a été retrouvé à l'aube contre la grille du canal. Les {{l:gendarmerie|gendarmes}} concluent à un accident. Dernière ligne : « Aimé Chabert avait été, en 1992, le témoin de la mort héroïque de {{p:garcin|Jacques Garcin}}, emporté par la crue de l'Ouvèze en portant secours à des campeurs. {{p:helene|Sa veuve, Hélène}}, vit à Nyons. »

Karim a lu la lettre trois fois. « Elle a écrit mardi. Il est mort mercredi soir. »

Jean-Loup Sarrazin passe la tête par la porte. « Une rivière qui rend ses morts. C'est l'été, les gens veulent frissonner à la plage. Vous partez ce soir. » Paul plie la page du journal en deux, sans quitter la photo des yeux. « Admettons. »

Trois heures d'autoroute, puis la route de la vallée de l'Eygues. Il fait nuit quand vous arrivez. Les fenêtres de la voiture sont ouvertes, ça sent le tilleul et la lavande coupée, et les cigales n'ont pas encore compris que le soleil est couché. L'{{l:agence|agence du Drômois}}, avenue Henri-Rochier, est une ancienne mercerie. Le rideau de fer est à moitié baissé. Un ventilateur tourne au plafond, et sur le bureau qu'on vous a laissé, quelqu'un a posé une corbeille d'abricots."""

INTRO_NOTES = [
    ("p:chabert", "Version officielle", "Retrouvé noyé le jeudi 16 juin à l'aube, contre la grille du canal du Moulin. Les gendarmes concluent à un accident."),
    ("p:garcin", "Version officielle", "Mort le 22 septembre 1992 dans la crue de l'Ouvèze, en portant secours à des campeurs. Le meunier Chabert l'a vu emporter."),
    ("p:royer", "", "Vainqueur du Grand Prix de la Digue avec Raoul Tardieu. Selon la lettre anonyme, ce serait Jacques Garcin."),
    ("d:lettre_anonyme", "", "Postée à Nyons le mardi 14 juin, la veille de la mort du meunier. Écriture ronde, papier à carreaux. Des taches rouges, comme du jus, sur la page jointe."),
]

PISTES = {}

def piste(pid, texte, notes=()):
    PISTES[pid] = dict(texte=texte.strip(), notes=list(notes))

# =========================================================== AGENCE DU DRÔMOIS

piste("gisele", """
{{p:gisele|Gisèle Arnaud}} est la correspondante du Drômois à Nyons depuis vingt-deux ans. Elle couvre les conseils municipaux, les comices, les mariages et les concours de boules. Elle a apporté un cake au citron « pour les Lyonnais » et elle vous regarde le manger.

« La photo, c'est moi. Le dimanche 29 mai, à la Digue. C'est la première fois qu'on me reprend en page régionale. » Elle sourit, puis elle ne sourit plus. « Il a tourné la tête juste quand j'ai déclenché. Je n'ai pas fait exprès, il faut me croire. Je ne savais pas, pour Garcin. »

Depuis le 2 juin, dit-elle, on ne parle que de ça. À Vaison surtout. « Ils ont tous perdu quelqu'un, là-bas. Et maintenant ils voient leurs morts partout. {{p:rosa|Rosa Bérenger}}, une veuve de la crue, jure qu'elle a vu son mari jeudi dernier, au marché, devant le banc du fromager. Elle passe ses journées au {{l:memorial|mémorial}}, près du pont romain de Vaison. Elle dit que la rivière rend ses morts. Les gens commencent à le répéter. »

Elle baisse la voix, alors qu'il n'y a personne d'autre dans l'agence. « Et il y a ce vieux monsieur, à la pension des Forts. Il est venu le 2 juin acheter trois exemplaires du journal. Trois. Il m'a demandé à quelle heure exactement j'avais pris la photo. Je lui ai dit vers six heures. Il m'a dit : non, à six heures moins douze, regardez l'ombre du platane. » Elle a vérifié. Il avait raison.

« Il s'appelle {{p:firmin|Achard}}, je crois. Il joue aux boules, mais je ne l'ai jamais vu gagner. »
""", [
    ("d:photo_concours", "", "Prise par Gisèle Arnaud le dimanche 29 mai vers 17 h 48, à la Digue. Royer a tourné la tête au moment du déclenchement."),
    ("p:rosa", "", "Veuve de la crue de 1992. Dit avoir vu son mari mort au marché de Vaison. « La rivière rend ses morts. »"),
    ("p:firmin", "", "Vieux joueur de boules, à la pension des Forts. A acheté trois exemplaires du journal du 2 juin et calculé l'heure de la photo à la minute près."),
])

piste("odile", """
Odile rappelle dans l'heure. Puis le fax de l'agence se met à cracher du papier thermique, qui s'enroule par terre comme une langue.

[[fax]]

Paul pose le doigt sur la photo de Garcin, puis sur celle de Royer, la page du concours. On ne voit rien sur la seconde. Une oreille. Une joue. « Il était moustachu, en 1992. »

Karim, lui, a souligné deux noms dans la liste des victimes, sans savoir pourquoi. « Roanne. C'est à côté de chez nous, Roanne. »
""", [
    ("p:garcin", "En 1992", "Gérant du camping des Saules, en amont de Vaison. Né à Givors en 1944. Moustachu sur la photo du journal de 1992."),
    ("p:chabert", "Son témoignage", "« Je l'ai vu partir vers la caravane du fond. L'eau l'a pris. » Le Drômois du 25 septembre 1992."),
    ("d:coupure_1992", "", "Le Drômois du 25 septembre 1992 : « Le héros du camping des Saules ». La photo de Garcin, moustache, cheveux bruns."),
    ("l:camping_saules", "", "Camping de Jacques Garcin au bord de l'Ouvèze, en amont de Vaison. Détruit par la crue du 22 septembre 1992."),
    ("l:memorial", "Les victimes", "Parmi les morts de la crue : Thierry Mollet, 26 ans, et Nathalie Brun, 24 ans, de Roanne, retrouvés à Roaix trois jours après."),
])

piste("lettre_chabert", """
Lundi matin, le {{d:lettre_chabert|fax}} sonne avant que vous ayez fini le café. Odile a écrit en haut de la première page, au feutre : « Arrivé à Valence vendredi, au courrier des lecteurs. Ils l'ont mis de côté. Ils ne savaient pas quoi en faire. Moi, si. »

[[fax]]

Personne ne dit rien pendant un moment. Le ventilateur tourne. Karim relit la dernière phrase à voix basse.

Paul allume sa cigarette, pour une fois, et la laisse se consumer dans le cendrier sans y toucher.
""", [
    ("d:lettre_chabert", "", "Postée à Valence par Aimé Chabert le mercredi 15 juin, le jour de sa mort. Il avoue avoir menti en 1992 et annonce qu'il parlera aux gendarmes le jeudi."),
    ("p:chabert", "Sa lettre", "« J'ai menti en 1992. Jacques n'est pas mort. Je le dirai jeudi aux gendarmes. »"),
    ("p:helene", "Selon Chabert", "« Hélène le sait, je le lui ai dit dimanche. » Elle savait que le meunier parlerait le jeudi."),
])

piste("confrontation", """
Paul a demandé à Gisèle de vous prêter l'arrière-boutique de l'agence, là où on range les vieux numéros. Une table, quatre chaises, des piles de journaux jaunis jusqu'au plafond. Il les fait venir un par un, à une heure d'intervalle, sans leur dire qui d'autre viendra. Karim écrit tout, mot pour mot, sur un grand bloc à dessin.

{{p:helene|Hélène Garcin}} vient en tailleur clair, son sac sur les genoux, et ne s'assoit pas au fond de la chaise. {{p:royer|Lucien Royer}} vient parce que Tardieu le lui a dit, casquette à la main, et regarde la porte. {{p:firmin|Firmin Achard}} arrive à l'heure exacte, et le fait remarquer. {{p:sandrine|Sandrine Mollet}} vient entre deux journées de cueillette, les doigts rouges, et répond à la table plutôt qu'à Paul.

Paul leur pose à tous la même question : mercredi soir, vers dix heures, où étiez-vous, qu'aviez-vous sur vous, et pourquoi étiez-vous dehors ?

En partant, Sandrine se retourne vers Karim, pas vers Paul. « L'homme à qui j'ai rendu la boule, à moins vingt, sous le réverbère de la Digue. Je l'avais vu jouer tout l'après-midi, de loin. Les cheveux courts, gris. Le front haut, avec des rides, trois. Une moustache, je crois. Enfin. Je ne sais plus. Je l'ai tellement regardé sur le journal, cet homme-là. Le menton carré. Je ne l'ai pas regardé dans les yeux. »

Karim a recopié les déclarations au propre, à côté de ce que dit le dossier des gendarmes. Il a tracé les grilles. « Il y en a un qui ment. Tout ce qu'il dit est faux. Les trois autres disent vrai. »
""", [
    ("p:sandrine", "Le portrait", "Décrit l'homme à qui elle a rendu la boule, mercredi à 22 h 40 : cheveux courts et gris, front haut ridé, « une moustache, je crois », menton carré. Elle l'avait vu jouer de jour."),
])

piste("portrait", """
Yves a sorti d'une valise un vieux kit de portrait-robot, acheté à une vente de la police en 1981 : des planches de traits imprimés sur du calque, qu'on superpose. Il les étale sur le bureau, sous le ventilateur, et pose une agrafeuse sur chaque pile pour qu'elles ne s'envolent pas.

« Deux témoins. Sandrine l'a vu jouer en plein jour, de loin, et le soir sous un réverbère. Karim l'a vu à un mètre, à la bougie, avec la peur. Chacun se trompe sur quelque chose. Les gens se trompent toujours sur quelque chose. Il faut juste savoir sur quoi, et pourquoi. »

Il vous tend les calques.
""", [])

# =========================================================== GENDARMERIE

piste("montagne", """
L'adjudant-chef {{p:montagne|Montagne}} vous reçoit debout, derrière le comptoir de la brigade, comme on reçoit des gens qui viennent déclarer un vélo volé. Il a une moustache taillée au millimètre et une tasse « Club taurin de Nyons ».

« Le Bureau des affaires occultes. » Il le dit lentement, pour que vous entendiez comme ça sonne. « Un homme de soixante-trois ans, qui boit, qui vit seul, qui sort au bord de son canal à minuit, et qui tombe dedans. 1,8 gramme. Ça n'a rien d'occulte. Point. »

Une analyse toxicologique ? « Pour quoi faire ? On sait ce qu'il a bu : du marc. La bouteille était sur la table. » Personne ne l'a poussé, dit-il, il n'y a pas une trace de lutte, pas un témoin. Le revenant ? « Ça, c'est pour votre journal. Moi, je n'ai pas de rubrique fantômes. »

Il vous raccompagne. Sur le pas de la porte, il ajoute quand même, à mi-voix : « Le constat, c'est le {{p:sauvan|Dr Sauvan}} qui l'a fait. Elle pose des questions, elle aussi. Elle est jeune. »
""", [
    ("p:montagne", "", "Conclut à un accident : 1,8 g d'alcool, une chute dans le canal. Pas d'analyse toxicologique. « Personne ne l'a poussé. »"),
    ("p:chabert", "Selon les gendarmes", "Mort accidentelle : ivre, il est tombé dans le canal en sortant par la porte du bief."),
    ("p:sauvan", "", "A constaté le décès d'Aimé Chabert. « Elle pose des questions », selon l'adjudant-chef."),
])

piste("dossier", """
« Vous voulez lire le dossier ? Lisez-le. Il n'y a rien à cacher, c'est un accident. » L'adjudant-chef vous installe dans un bureau vide avec une chemise cartonnée et la ferme derrière vous. Elle ne fait que neuf pages.

Le {{d:pv|procès-verbal}} est daté du jeudi 16 juin, 6 h 30. Le corps a été trouvé à 5 h 10 par {{p:isnard|l'aiguadier du canal}}, contre la grille, deux cents mètres en aval du moulin. Constat du {{p:sauvan|Dr Sauvan}}. Au moulin, la porte de la rue était fermée à clé. Le trousseau de Chabert pendait au clou, à l'intérieur. La porte qui donne sur le bief était ouverte, et la vanne aussi : « la victime l'aura ouverte elle-même, en état d'ivresse ». Personne ne l'a poussé, conclut le rédacteur. Sur la berge du {{l:canal|canal}}, en amont, une {{d:lampe|lampe de poche}} en métal, encore allumée, la pile presque à plat. Sur le manche, une étiquette Dymo : « CAMPING DES SAULES · ACCUEIL ».

L'enquête de voisinage tient sur une page. Quatre personnes dehors, mercredi vers 22 h : {{p:helene|Mme Hélène Garcin}}, au {{l:arcades|café des Arcades}} ; « un homme avec des boules », dont personne ne sait le nom ; « le vieux monsieur de la pension », {{p:firmin|M. Achard}} ; et « une saisonnière », {{p:sandrine|Sandrine Mollet}}, qui loge au {{l:camping_municipal|camping municipal}}.

Et quatre déclarations recueillies, chacune de trois lignes :
{{p:gaston|Gaston Rey}}, cantonnier : vers 22 h, une femme seule près du boulodrome de la Digue.
{{p:fredo|Le serveur des Arcades}} : sa cliente de 22 h « a regardé la porte toute la soirée ».
{{p:josiane|Josiane Pellegrin}}, femme de ménage : M. Chabert lui a dit mercredi qu'il devait « s'expliquer avec quelqu'un, au canal, ce soir ».
Et la lampe, trouvée sur la berge : celui qui la tenait était au canal.

Personne n'a fait le lien entre la lampe et le {{l:camping_saules|camping des Saules}}. Ou personne n'a voulu.
""", [
    ("d:pv", "", "Porte du moulin fermée à clé, trousseau de Chabert au clou à l'intérieur, porte du bief ouverte, vanne ouverte « par la victime ». Corps trouvé à 5 h 10 contre la grille."),
    ("d:lampe", "", "Trouvée allumée sur la berge du canal, en amont du moulin. Étiquette Dymo : « CAMPING DES SAULES · ACCUEIL ». Celui qui la tenait était au canal."),
    ("p:helene", "Mercredi soir", "Au café des Arcades vers 22 h, selon l'enquête de voisinage."),
    ("p:gaston", "", "Vers 22 h mercredi, a vu une femme seule près du boulodrome de la Digue."),
    ("p:fredo", "", "Sa cliente de 22 h, aux Arcades, « a regardé la porte toute la soirée » : elle attendait quelqu'un."),
    ("p:josiane", "", "Chabert lui a dit mercredi qu'il devait « s'expliquer avec quelqu'un, au canal, ce soir »."),
    ("p:sandrine", "", "Saisonnière, loge au camping municipal. Dehors mercredi vers 22 h."),
    ("p:firmin", "Mercredi soir", "Dehors vers 22 h, selon l'enquête de voisinage."),
])

# =========================================================== CABINET DU DR SAUVAN

piste("sauvan", """
Le cabinet du {{p:sauvan|Dr Anne Sauvan}} est au premier étage, au-dessus d'un marchand de tissus provençaux. Elle a trente-deux ans, les cheveux attachés avec un crayon, et elle fume à la fenêtre entre deux patients en soufflant dehors, comme si ça ne comptait pas.

« Je ne signe pas ce que je ne sais pas. J'ai écrit noyade. J'ai écrit alcool. Je n'ai pas écrit accident, c'est le gendarme qui l'a écrit. » Elle tire sur sa cigarette. « La mort, c'est entre onze heures du soir et une heure du matin. Pas avant onze heures, ça, je le signe. »

Ce qui la gêne, ce sont les mains. « Un noyé se débat. Il s'agrippe aux herbes, il se casse les ongles sur le béton, il a de la vase partout. Lui, rien. Des mains propres. Pas une écorchure. Il n'a pas lutté. » Elle écrase la cigarette sur le rebord. « Il dormait quand il est entré dans l'eau. Un homme qui a bu un litre de marc peut dormir, d'accord. Mais pas si profond. »

L'adjudant-chef n'a pas voulu d'analyse. Elle a gardé un tube de sang au réfrigérateur, et elle l'a envoyé vendredi à un laboratoire de Lyon, à ses frais. « Le résultat, mardi. Repassez mardi. Et ne le dites pas à Montagne, il serait vexé. »
""", [
    ("p:sauvan", "", "Décès d'Aimé Chabert entre 23 h et 1 h, pas avant 23 h. Pas de trace de lutte : « Il dormait quand il est entré dans l'eau. »"),
    ("p:chabert", "Selon le Dr Sauvan", "Mort après 23 h, sans se débattre. Le Dr Sauvan a fait analyser son sang à Lyon : résultat le mardi 21."),
])

piste("labo", """
Le Dr Sauvan a le papier du laboratoire à la main quand vous entrez. Elle ne vous fait pas asseoir.

{{d:analyse|Rapport d'analyse}}, laboratoire Mérieux, Lyon. Alcoolémie : 1,8 g. Et une ligne de plus : nitrazépam, à une concentration « compatible avec une prise de plusieurs comprimés dans les heures précédant le décès ».

« Du Mogadon. Un somnifère. On le prescrit aux insomniaques, aux veuves, aux gens qui ont peur la nuit. Avec un litre de marc, il ne pouvait plus lever un bras. » Elle replie la feuille. « Il n'en prenait pas, je suis son médecin depuis quatre ans. Quelqu'un le lui a donné. »

Elle n'a pas besoin qu'on lui pose la question suivante. « Dans le centre, il n'y a qu'une pharmacie qui en délivre beaucoup. La {{l:pharmacie|pharmacie du Pont}}. {{p:roux|Mme Roux}}. Elle ne vous dira rien. Enfin, elle vous dira qu'elle ne dit rien, et après elle parlera. »

Elle porte le rapport à la gendarmerie cet après-midi. « Montagne sera vexé. Tant pis. »
""", [
    ("d:analyse", "", "Sang d'Aimé Chabert : 1,8 g d'alcool et du nitrazépam (Mogadon) à forte dose, pris quelques heures avant la mort."),
    ("p:chabert", "Le laboratoire", "Drogué au Mogadon avant d'entrer dans l'eau. Il n'en prenait pas."),
])

# =========================================================== PHARMACIE DU PONT

piste("pharmacie", """
{{p:roux|Mme Roux}} porte une blouse amidonnée et des lunettes au bout d'une chaîne. Derrière elle, des bocaux en faïence et une affiche contre les coups de soleil.

« Je ne parle pas de mes clients. Jamais. » Elle range trois boîtes sur une étagère, très soigneusement. « Le Mogadon, j'en délivre à une vingtaine de personnes. Des gens âgés, surtout. Et des gens qui ont eu un malheur. »

Elle se tourne vers la vitrine. « Une seule de ces personnes est venue jeudi dernier, à huit heures et demie, avant même que j'aie remonté le store. Pour renouveler son ordonnance, dix jours en avance. Elle m'a dit qu'elle avait renversé la boîte dans l'évier. Je lui ai dit que ce n'était pas grave. » Elle reste un moment sans rien dire. « Elle a eu un grand malheur, en 1992. Je ne vous ai pas dit son nom. »

Elle n'a pas besoin de le dire. Il n'y a qu'une veuve de 1992 à Nyons qu'on appelle « elle » en baissant la voix.
""", [
    ("p:roux", "", "Une cliente, veuve de 1992, est venue le jeudi 16 juin à 8 h 30 renouveler son Mogadon dix jours en avance : « J'ai renversé la boîte dans l'évier. »"),
    ("p:helene", "Le Mogadon", "Selon la pharmacienne, a renouvelé son Mogadon en avance le jeudi 16 au matin, le lendemain de la mort du meunier."),
])

# =========================================================== HÔTEL DE LA PLACE

piste("vasseur", """
{{p:vasseur|Jean-Claude Vasseur}}, inspecteur des sinistres à la Mutuelle rhodanienne, occupe la meilleure table de la terrasse de l'hôtel de la Place, sous le seul parasol qui tienne debout. Costume gris, cravate desserrée de deux centimètres, une calculette solaire posée sur ses dossiers.

« Le Bureau des affaires occultes. On m'avait dit. » Il commande deux diabolos menthe sans vous demander. « Moi, je suis le Bureau des affaires très concrètes. »

Le contrat est simple, dit-il. {{d:assurance|Assurance-vie}} de Jacques Garcin, souscrite en 1988. Jugement déclaratif de décès en juillet 1993, à Carpentras. 1,4 million de francs versés à la veuve en décembre. « Elle a racheté la maison de ses parents, rue des Grands-Forts. Elle a placé le reste pour les études des enfants. Une femme très sérieuse. »

« Si Garcin est vivant, tout doit revenir à la Mutuelle. Tout. La maison, les placements. Et si la veuve savait qu'il était vivant, ce n'est plus un remboursement, c'est une escroquerie. Le tribunal correctionnel. » Il tapote la calculette. « La prison, possiblement. »

Il a été envoyé après la photo du 2 juin, quand quelqu'un a téléphoné à son agence d'Avignon. Une voix de jeune femme, qui n'a pas donné son nom. Et il y a autre chose. « Le meunier m'a appelé lui-même, le mardi 14. Il voulait savoir ce que risque un témoin qui a fait une fausse déclaration. Je lui ai dit de venir me voir. Il devait venir jeudi. » Il soupire. « Je crois qu'il faisait chanter la veuve, si vous voulez mon avis. Un pauvre type qui avait des dettes et un secret. On en voit tous les jours. »
""", [
    ("d:assurance", "", "Assurance-vie de Jacques Garcin : 1,4 million de francs versés à Hélène en décembre 1993. Si Garcin est vivant, tout doit être remboursé ; si la veuve savait, c'est une escroquerie."),
    ("p:vasseur", "", "Inspecteur de la Mutuelle rhodanienne, à Nyons depuis la photo du 2 juin. Une jeune femme anonyme a appelé son agence."),
    ("p:chabert", "Selon Vasseur", "A appelé la Mutuelle le mardi 14 pour savoir ce que risque un faux témoin. Devait venir le jeudi. Vasseur le soupçonne de faire chanter la veuve."),
])

# =========================================================== CAFÉ DES ARCADES

piste("fredo", """
{{p:fredo|Fredo}} essuie les tables de la terrasse sous les arcades avec un torchon qui a connu des jours meilleurs. Il tutoie tout le monde, Paul compris.

« Mme Garcin ? Mercredi, oui. Elle s'est assise là, à neuf heures et demie, à la table du coin. Une menthe à l'eau. Elle regardait la porte. Pas la place, la porte. Chaque fois que quelqu'un entrait, elle levait la tête. » Il plie le torchon en quatre. « Elle attendait quelqu'un, c'est sûr. Quelqu'un qui est pas venu. »

Elle est partie à onze heures moins le quart. « Je m'en souviens parce qu'elle avait pas fini son verre, et qu'elle a laissé un billet de vingt pour une menthe à l'eau. Elle est partie par là. » Il montre la rue qui descend vers l'est. « Vers le pont roman. Pas vers chez elle. Chez elle, c'est en haut, aux Forts. »

« Le vieux de la pension, M. Achard, lui il lit son journal sur le {{l:pont|pont roman}} tous les soirs, de neuf heures jusqu'à pas d'heure. Tu peux régler ta montre dessus. Mercredi, pareil. »
""", [
    ("p:fredo", "Mercredi soir", "Hélène Garcin aux Arcades de 21 h 30 à 22 h 45, une menthe à l'eau, les yeux sur la porte. Partie sans finir son verre, vers le pont roman, pas vers chez elle."),
    ("p:helene", "Selon Fredo", "A quitté les Arcades à 22 h 45, en direction du pont roman."),
    ("p:firmin", "Selon Fredo", "Lit son journal sur le pont roman tous les soirs, de 21 h « jusqu'à pas d'heure ». Mercredi aussi."),
])

# =========================================================== MAISON D'HÉLÈNE GARCIN

piste("helene", """
La maison est en haut des Forts, rue des Grands-Forts, là où les ruelles deviennent des escaliers couverts. Volets bleus, un laurier en pot, un vélo d'adolescent contre le mur. {{p:helene|Hélène Garcin}} vous ouvre avant que vous ayez frappé. Elle vous avait vus monter.

Elle vous sert de l'eau fraîche dans des verres à pied, sur un plateau. Elle est très calme. Elle parle de l'huile d'olive de Nyons, la seule en France à avoir une appellation, de la récolte de l'hiver dernier, du prix au litre. Quand Paul pose la page du concours sur la table, elle ne la regarde pas.

« Jacques est mort, monsieur. La rivière ne rend rien. Je le sais, j'ai attendu trois semaines au bord de l'eau qu'elle me le rende. » Elle repose son verre. « J'ai fait suspendre l'abonnement au Drômois. Les enfants n'ont pas à voir ça. »

Mercredi soir ? Elle était aux Arcades. « J'attendais une amie, qui n'est pas venue. Je suis rentrée. » Elle travaille à la boutique du moulin depuis l'an dernier : « Aimé me l'avait proposé. Il était bon pour nous. » Les clés du moulin ? « Je les lui ai rendues en mai. La boutique ferme l'été, on ne presse qu'en hiver. »

En vous raccompagnant, elle ajoute, du même ton : « Un monsieur de la Mutuelle est venu me voir. Il est descendu à l'{{l:hotel|hôtel de la Place}}. {{p:vasseur|M. Vasseur}}. Vous devriez parler ensemble, vous vous entendriez bien. »
""", [
    ("p:helene", "", "« Jacques est mort. La rivière ne rend rien. » A fait suspendre son abonnement au Drômois après la photo."),
    ("p:helene", "Mercredi soir", "Dit avoir attendu aux Arcades « une amie qui n'est pas venue », puis être rentrée chez elle."),
    ("p:helene", "Les clés", "Dit avoir rendu les clés du moulin à Aimé Chabert en mai. Travaille à la boutique du moulin depuis 1993."),
    ("p:vasseur", "", "Inspecteur de la Mutuelle, descendu à l'hôtel de la Place. Est venu voir Hélène."),
])

piste("maison", """
Vous revenez le lendemain, à l'heure où Hélène tient la boutique d'huile du marché couvert. C'est {{p:helene|son fils}} Julien qui ouvre, seize ans, un walkman autour du cou. Il dit que sa mère n'est pas là. Paul dit qu'il le sait. Julien hésite, puis il s'écarte. « Vous êtes ceux du journal. Pour mon père. » Ce n'est pas une question.

Il vous montre la chambre du fond, celle de son père. Tout est resté comme au camping : la carte de la vallée de l'Ouvèze punaisée au mur, une coupe de pétanque, la photo de mariage. « Maman ne veut pas qu'on y touche. Elle y va le soir. Elle ferme la porte. »

Dans le salon, le secrétaire n'est pas fermé à clé. La lettre de la Mutuelle rhodanienne, décembre 1993 : versement de 1 400 000 francs au titre de l'{{d:assurance|assurance-vie}}. Et sous la lettre, un carnet de souches de la Poste. Des {{d:mandats|mandats}}, un par mois, le 5, depuis le 5 novembre 1992. 1 500 francs chaque fois. Destinataire : « L. Royer, poste restante, 26170 Buis-les-Baronnies ». Les dernières souches sont de mai et de juin 1994.

Julien est resté dans l'encadrement de la porte. « C'est qui, Royer ? » Personne ne lui répond. Il remet son casque sur ses oreilles sans mettre la musique.
""", [
    ("d:assurance", "La lettre", "Lettre de la Mutuelle de décembre 1993 : 1 400 000 F versés à Hélène Garcin. Rangée dans le secrétaire."),
    ("d:mandats", "", "Souches de mandats postaux : 1 500 F le 5 de chaque mois depuis novembre 1992, à « L. Royer, poste restante, Buis-les-Baronnies ». Dans le secrétaire d'Hélène."),
    ("p:helene", "Les mandats", "Envoie 1 500 F par mois à « L. Royer » depuis novembre 1992, deux mois après la crue."),
])

piste("helene2", """
Hélène vous reçoit cette fois dans la cuisine, sans plateau. Paul pose les heures sur la table, une par une, comme des cartes. Les Arcades quittées à onze heures moins le quart, vers le pont. La vanne ouverte avec une clé.

Elle ne nie pas longtemps. Elle rectifie. « Je suis allée au moulin, oui. Je voulais parler à Aimé. Il n'était pas venu aux Arcades. La porte était fermée, il n'a pas répondu. Je suis repartie. » Elle a les clés de la boutique, oui. « Je ne les ai pas rendues. Je vous ai menti parce que je savais ce que vous alliez penser. »

« De quoi vouliez-vous lui parler ? » Elle regarde la fenêtre, où on voit, très loin, la ligne de la vallée. « De mon mari. »

Elle ne demande pas ce que vous savez. Elle ne demande pas si on la soupçonne. Elle demande seulement, à la fin, si les enfants seront au courant de ce qui sera écrit samedi.
""", [
    ("p:helene", "Second entretien", "Reconnaît être allée au moulin vers 23 h « parler à Aimé », et avoir encore les clés de la boutique. Dit que la porte était fermée et qu'elle est repartie."),
])

# =========================================================== PENSION DES FORTS

piste("firmin", """
La pension des Forts a six chambres et une terrasse sous une treille. {{p:firmin|Firmin Achard}} y est installé depuis le 30 mai, à la table du fond, une sacoche de cuir à ses pieds avec trois boules de pétanque dedans. Chemise blanche boutonnée jusqu'au col malgré la chaleur, un Drômois plié sur la table, une pipe éteinte.

Il accepte le pastis. Il vous regarde un par un, Paul, Yves, Karim, comme on regarde des boules avant de choisir laquelle jouer.

« Je prends le frais sur le pont, le soir, comme tous les vieux de France. » Mercredi ? « De neuf heures moins quatre à minuit dix. » Il n'a rien vu. « J'ai vu l'eau. Elle était basse. Elle est toujours basse en juin, ici. » Il parle de la rivière comme d'une personne qu'on connaît depuis longtemps et dont on se méfie un peu.

Karim lui demande s'il croit aux revenants. Firmin le regarde longtemps. « Je crois aux gens qui reviennent. Ce n'est pas la même chose. »

Il repart mardi, dit-il. Il a sa chambre jusqu'au lundi soir. « Après, vous savez où me trouver. » Personne ne le sait.
""", [
    ("p:firmin", "", "À Nyons depuis le 30 mai, à la pension des Forts. Dit avoir pris le frais sur le pont roman mercredi de 20 h 56 à 0 h 10, et n'avoir rien vu « que l'eau »."),
    ("p:firmin", "Son départ", "Quitte Nyons le mardi 21 juin au matin."),
])

piste("chambre_firmin", """
La patronne de la pension vous arrête dans l'escalier. « M. Achard est parti ce matin, à six heures, avec sa sacoche. Il a payé jusqu'à la fin du mois. Il a laissé ça pour vous. Il a dit : pour les journalistes de Lyon, ils viendront mardi. » Elle tend une grande enveloppe kraft, fermée à la cire.

Dedans, un {{d:carnet_firmin|carnet}} à couverture de toile noire. Sur la première page, un tampon à l'encre rouge, très ancien : une salamandre dans les flammes. Et en dessous, à la plume : « Le revenant de l'Ouvèze. Ouvert le 30 mai 1994. »

L'écriture est fine, penchée, régulière comme une partition. Chaque ligne commence par une heure.

« 2 juin. La photo. Ce n'est pas un mort. C'est un vivant qui a tourné la tête. »
« 11 juin. Une jeune femme sort du moulin en pleurant. Le meunier reste longtemps sur la passerelle. »
« 15 juin. 21 h 41. La veuve s'assoit aux Arcades. 21 h 58. Le meunier sort par la porte du bief et marche vers l'amont. 22 h 05. Deux hommes sur la berge, une lampe. Le meunier pleure. 22 h 32. L'homme aux boules me voit. Il laisse tomber la lampe, qui reste allumée dans l'herbe, et il part en courant vers la Digue. 22 h 50. Le meunier rentre au moulin par le bief. 23 h 05. Une femme entre par la petite porte de la rue, avec une clé. La veuve. 23 h 12. La vanne gronde, le bief se remplit. 23 h 27. Elle ressort seule, ferme à clé, reste au parapet. Elle ne pleure pas. Le meunier ne ressort pas. »
« 16 juin. Il n'y a pas de revenant à Nyons. Il y a une veuve. »

La dernière page est blanche, sauf une ligne : « Ce que vous ferez de ceci ne nous regarde pas. »
""", [
    ("d:carnet_firmin", "", "Carnet de Firmin Achard, une salamandre dans les flammes en première page. Note minute par minute la nuit du 15 juin, depuis le pont roman."),
    ("p:helene", "Selon Firmin", "Entre au moulin par la petite porte à 23 h 05, avec une clé. La vanne gronde à 23 h 12. Ressort seule à 23 h 27 et ferme à clé."),
    ("p:royer", "Selon Firmin", "Sur la berge avec le meunier de 22 h 05 à 22 h 32, puis s'enfuit en lâchant la lampe. Le meunier rentre vivant au moulin à 22 h 50."),
    ("p:firmin", "Le carnet", "Surveillait le moulin depuis le 30 mai. A tout vu le 15 juin et n'a prévenu personne. « Ce que vous ferez de ceci ne nous regarde pas. »"),
])

# =========================================================== MOULIN CHABERT

piste("josiane", """
{{p:josiane|Josiane Pellegrin}} vient encore au moulin tous les matins arroser les géraniums de la cour. « Personne d'autre le fera. » Elle a soixante-dix ans, un tablier à fleurs, et elle appelle le mort « Monsieur Aimé ».

Mercredi, il était « tout chose ». Il lui a dit qu'il devait s'expliquer avec quelqu'un, au canal, le soir. « Il m'a pas dit qui. Il m'a dit : Josiane, demain, je fais une chose que j'aurais dû faire il y a deux ans. »

Jeudi matin, les gendarmes partis, elle est entrée. « Les deux verres à marc, sur l'égouttoir, rincés, retournés. Monsieur Aimé a jamais rincé un verre de sa vie. Jamais. Ça faisait trente ans que je les rinçais pour lui. » Elle l'a dit aux gendarmes. L'adjudant a noté « deux verres ».

Et le samedi d'avant, le 11, une jeune femme est venue. « Une saisonnière, avec les doigts rouges des cerises. Elle criait dans la cour, elle lui mettait un journal sous le nez. Elle disait : vous l'avez vu mourir ? Vous l'avez vu ? Monsieur Aimé répondait rien. » Elle se signe. « Elle s'appelle {{p:sandrine|Mollet}}, je crois. Elle a dit son nom en partant, comme on jette quelque chose. »

Les clés ? « Mme Hélène a sa clé de la boutique, pardi, elle y travaille. Elle l'a toujours. »
""", [
    ("p:josiane", "Les verres", "Jeudi matin, deux verres à marc rincés et retournés sur l'égouttoir. « Monsieur Aimé n'a jamais rincé un verre de sa vie. » Quelqu'un a bu avec lui."),
    ("p:josiane", "Les clés", "Selon elle, Hélène a toujours sa clé de la boutique du moulin."),
    ("p:sandrine", "Selon Josiane", "Est venue crier au moulin le samedi 11 juin, un journal à la main : « Vous l'avez vu mourir ? »"),
    ("p:chabert", "Selon Josiane", "Mercredi : « Demain, je fais une chose que j'aurais dû faire il y a deux ans. »"),
])

piste("moulin", """
Le moulin Chabert est une grande bâtisse de pierre au bord du canal, avec une roue arrêtée et une boutique fermée par un rideau. Josiane vous ouvre la salle des meules. Il y fait frais comme dans une cave, ça sent l'olive écrasée de l'hiver et la pierre mouillée.

Sur la table, la bouteille de marc est encore là, aux trois quarts vide. Le clou du trousseau, près de la petite porte de la rue. Au fond, la porte du bief donne sur une passerelle de planches au-dessus de l'eau. À côté, la grande roue de fer de la vanne, et une chaîne avec un cadenas en laiton, refermé.

Dans le bureau, la corbeille n'a pas été vidée. Yves en sort une feuille déchirée en deux, puis froissée. L'écriture tremble. {{d:brouillon|« Messieurs les gendarmes. En septembre 1992, j'ai menti. Jacques Garcin n'a pas été emporté par l'eau. Je l'ai retrouvé la nuit, dans la colline, vivant, et il m'a demandé de dire qu'il était mort. Je l'ai fait parce que c'était mon ami et parce qu'il avait déjà assez »}} La phrase s'arrête là.

Sur la passerelle, Karim se penche au-dessus du bief. L'eau est noire, rapide, et elle ne fait presque pas de bruit.
""", [
    ("d:brouillon", "", "Brouillon déchiré trouvé dans la corbeille du meunier : « En septembre 1992, j'ai menti. Jacques Garcin n'a pas été emporté. Je l'ai retrouvé vivant, et il m'a demandé de dire qu'il était mort. »"),
    ("l:moulin", "", "La petite porte de la rue, le clou du trousseau, la porte du bief, la passerelle et la vanne fermée par un cadenas en laiton."),
])

# =========================================================== CANAL DU MOULIN

piste("isnard", """
{{p:isnard|Norbert Isnard}} est aiguadier du canal depuis 1961. C'est lui qui ouvre et ferme les martelières, qui distribue l'eau aux jardins selon les jours et les heures, et qui retire de la grille, le matin, les branches, les chats crevés et, une fois en trente-trois ans, un homme. Il parle en litres-seconde.

« La vanne du moulin, en juin, elle est fermée. On presse pas en juin. » Mercredi, à 23 h 10, le niveau du partiteur, en aval, a baissé d'un coup de quatre centimètres. Il vous montre le rouleau de papier de son limnigraphe, un trait d'encre bleue qui fait une marche. « Quelqu'un a ouvert la vanne du moulin. L'eau a filé dans le bief. Ça fait du courant, là-dedans, quand c'est ouvert. Un homme qui tombe, il remonte pas. »

Le cadenas ? Refermé, sur la chaîne, en position ouverte. « Les gendarmes disent que c'est Aimé, saoul. Mais le cadenas, il se referme pas sans la clé, c'est un modèle de l'association. Et le trousseau d'Aimé, il était au clou, dedans, les gendarmes l'ont écrit. » Il hausse les épaules. « Alors on me dira avec quelle clé. »

Il n'en existe que deux, dit-il. « La mienne, que voilà. » Il la montre, pendue à son cou par un lacet. « Et celle du trousseau du moulin. Qui a une copie, à la boutique, pour quand Aimé était pas là. »
""", [
    ("p:isnard", "La vanne", "La vanne du moulin a été ouverte mercredi vers 23 h 10 : le niveau du canal a baissé de 4 cm d'un coup. Le cadenas a été refermé, ce qui demande une clé."),
    ("p:isnard", "Les clés", "Deux clés seulement : la sienne, qu'il porte au cou, et celle du trousseau du moulin, dont une copie est à la boutique."),
    ("p:chabert", "Selon Isnard", "Son trousseau était au clou, à l'intérieur : il n'a pas pu refermer le cadenas de la vanne lui-même."),
])

piste("berge", """
L'herbe de la berge, en amont du moulin, a été couchée sur un mètre carré, et elle ne s'est pas relevée. Yves photographie deux sortes d'empreintes dans la terre sèche du bord : des souliers de ville, ressemelés, et des chaussures de travail à grosses crampons.

Paul se retourne. D'ici, on voit tout : le canal jusqu'au moulin, la passerelle du bief, la petite porte de la rue. Et au-dessus, le dos d'âne du {{l:pont|pont roman}}, son parapet de pierre, la silhouette d'un réverbère. « Quelqu'un, là-haut, voit tout. Et personne ne le voit, avec la lumière dans le dos. »
""", [
    ("l:canal", "La berge", "Herbe couchée là où on a trouvé la lampe : deux hommes, des souliers de ville et des chaussures de travail. Le pont roman domine toute la scène."),
])

# =========================================================== PONT ROMAN

piste("pont", """
Le pont roman enjambe l'Eygues d'une seule arche, si haute qu'on a l'impression de monter une colline. Au sommet, on voit le canal, le moulin, la Digue, et toute la vieille ville en gradins.

Sur le parapet, à l'endroit où la pierre est la plus usée, un petit tas de cendre de pipe que le vent n'a pas encore emporté. Coincé dans une fente, un Drômois du mercredi 15 juin, plié en quatre, la page des boules en dessus.

Et gravé dans la pierre tendre, à la pointe d'un couteau, si petit qu'il faut se pencher : un lézard dans des flammes. Les traits sont frais. La poussière de pierre est encore blanche dans le creux.

Karim passe le doigt dessus. « On l'a déjà vu, ça. » Paul ne répond pas. Il regarde le moulin, en bas. D'ici, on voit la petite porte de la rue comme si on était devant.
""", [
    ("l:pont", "", "De la cendre de pipe et un Drômois du 15 juin sur le parapet. Une salamandre dans les flammes gravée au couteau, toute fraîche. On voit la petite porte du moulin comme si on était devant."),
    ("p:firmin", "Le pont", "Quelqu'un fumait la pipe et lisait le journal du 15 juin sur le pont. Et a gravé une salamandre dans la pierre."),
])

# =========================================================== BOULODROME DE LA DIGUE

piste("gaston", """
{{p:gaston|Gaston Rey}} est cantonnier de la ville et secrétaire de la Boule nyonsaise, ce qui revient à passer ses journées à la Digue, entre les platanes et le râteau. Il raconte tout comme une partie : qui pointe, qui tire, qui a fait un carreau.

« Royer ? Lucien, des Pilles. Il travaille chez Tardieu, à la {{l:ferme_tardieu|ferme}}, au-dessus de la route. Il joue pas mal, mais il tire à la lyonnaise, les bras tendus, trois pas d'élan. On voit qu'il est pas d'ici. Le soir, des fois, il vient tout seul avec des grosses boules, des vraies lyonnaises, en bronze, et il joue contre personne. »

Il a vu la photo. « Tout le monde dit que c'est Garcin. Moi je dis que Garcin, il jouait à la pétanque comme tout le monde. » Il réfléchit. « Enfin. Garcin, il était de Givors. »

Mercredi, vers dix heures, en fermant le cabanon du club, il a vu une {{p:sandrine|femme}} seule sur le terrain, qui cherchait par terre avec un briquet. « Une jeune, une saisonnière. Je lui ai demandé si elle avait perdu quelque chose. Elle m'a dit oui, sans dire quoi. »
""", [
    ("p:gaston", "Royer", "Royer travaille chez Tardieu, aux Pilles. Tire « à la lyonnaise ». Vient parfois seul le soir jouer avec des boules lyonnaises en bronze."),
    ("p:royer", "Ses boules", "Joue à la lyonnaise, un jeu du Lyonnais. Garcin était de Givors."),
    ("p:sandrine", "Selon Gaston", "Mercredi vers 22 h, seule sur le boulodrome de la Digue, cherchait quelque chose par terre avec un briquet."),
])

piste("inscription", """
Gaston sort du cabanon du club un classeur à anneaux. La {{d:feuille_concours|feuille d'inscription}} du Grand Prix de la Digue, dimanche 29 mai, trente-deux doublettes. Chacun a écrit son nom de sa main.

Doublette n° 23. « TARDIEU Raoul », en capitales penchées. Et à côté, d'une autre écriture : deux lettres, « Ga », barrées d'un trait si appuyé qu'il a troué le papier. Puis, juste après : « ROYER L. »

Gaston n'avait jamais remarqué. « Il a commencé à écrire autre chose. Comme quand on signe un chèque avec le nom de sa femme. »
""", [
    ("d:feuille_concours", "", "Feuille d'inscription du 29 mai, doublette n° 23 : Royer a d'abord écrit « Ga », l'a barré, puis a écrit « ROYER L. »"),
    ("p:royer", "La feuille", "A commencé à signer « Ga », puis s'est repris."),
])

# =========================================================== CAMPING MUNICIPAL

piste("sandrine", """
Le camping municipal est au bord de l'Eygues, sous les peupliers. En juin, c'est le camping des saisonniers : des tentes canadiennes, des 4L, des cordes à linge entre les arbres. {{p:sandrine|Sandrine Mollet}} rentre de la cueillette à quatre heures, une caisse vide sur l'épaule. Elle a vingt-quatre ans et les doigts rouges jusqu'aux poignets.

« Je fais les cerises. Après, les abricots. Après, la lavande. Je fais les saisons. » Elle est de Roanne. Elle ne regarde jamais en face. Elle parle à la caisse, à la tente, au peuplier.

Mercredi soir, elle était sur la Digue. « J'avais perdu ma montre l'après-midi. J'y suis retournée la chercher. Je l'ai pas trouvée. » Elle a trouvé une boule à la place, « une grosse, pas une boule de pétanque ». Elle hausse les épaules. « Les gens perdent des choses. »

Quand Karim lui demande si elle connaissait Aimé Chabert, elle rentre dans sa tente et referme la fermeture éclair. De dedans, elle dit : « C'est pas vos oignons. »
""", [
    ("p:sandrine", "", "Saisonnière de Roanne, 24 ans. « Je fais les saisons. » Les doigts rouges de jus de cerise, comme les taches sur la page envoyée au Bureau."),
    ("p:sandrine", "Mercredi soir", "Sur la Digue, à chercher sa montre perdue l'après-midi. A trouvé une grosse boule à la place."),
])

piste("tente", """
Sandrine est aux vergers. La tente n'est pas fermée, juste nouée. Paul ne dit pas d'y aller. Il ne dit pas de ne pas y aller.

À l'intérieur, un sac de couchage, une lampe frontale, des magazines. Épinglée à la toile, au-dessus de l'oreiller, une photo découpée dans un journal de 1992 : Jacques Garcin, moustache, la légende « Le héros du camping des Saules ». Les yeux ont été grattés au couteau, jusqu'à trouer le papier.

Sur la caisse qui sert de table, un bloc de papier à petits carreaux, et un stylo bille. Une feuille arrachée, où on lit, en écriture ronde : « Chabert, moulin, samedi ». Et une boîte à montre en carton, vide. Sur le couvercle, au feutre : « Thierry, 20 ans ».

Yves regarde la photo aux yeux grattés plus longtemps que le reste. Il ne la photographie pas.
""", [
    ("p:sandrine", "Sa tente", "La photo de Garcin de 1992 épinglée au-dessus de son lit, les yeux grattés au couteau. Une note : « Chabert, moulin, samedi »."),
    ("p:sandrine", "Le papier", "Un bloc de papier à petits carreaux et un stylo bille, comme pour la lettre anonyme. Une boîte à montre vide, marquée « Thierry, 20 ans »."),
])

piste("sandrine2", """
Sandrine est assise sur la caisse, devant la tente, et elle vous attend. Elle a compris en voyant Paul arriver. Pour la première fois, elle le regarde en face.

« Thierry, c'était mon frère. » Elle le dit sans pleurer. Elle a dû le dire souvent dans sa tête. « La montre, c'était la sienne, pour ses vingt ans. Je l'ai perdue mercredi, sur la Digue, en le regardant jouer, lui. » Elle ne dit pas Garcin. Elle dit lui.

Elle a reconnu Garcin sur la photo du 2 juin. « Ça fait vingt mois que je regarde sa tête tous les soirs. Le héros qui est mort en voulant sauver mon frère. » Elle est allée voir Chabert le samedi. Elle a crié. Il n'a rien dit, « mais il a pleuré, et un homme qui a dit la vérité, il pleure pas ». Et c'est elle qui a écrit au Bureau. « Les gendarmes, ils m'auraient prise pour une folle. Vous, les fantômes, c'est votre métier. »

Elle sort de son portefeuille une {{d:carte_thierry|carte postale}} usée aux coins. Le pont romain de Vaison. Au dos, l'écriture de Thierry, datée du 21 septembre 1992 : « Arrivés tard. On est au fond, sous les saules, au calme. Le patron est sympa, il a dit qu'on ferait l'inscription demain. Bises à maman. »

« Il les avait pas inscrits. Il évacuait avec la liste. Ils étaient pas sur la liste. » Elle range la carte. « Je voulais qu'il dise la vérité, le meunier. Pas qu'il meure. »
""", [
    ("p:sandrine", "Second entretien", "Sœur de Thierry Mollet, mort dans la crue. A reconnu Garcin sur la photo, est allée voir Chabert le samedi 11, et a écrit la lettre anonyme au Bureau."),
    ("d:carte_thierry", "", "Carte de Thierry Mollet, 21 septembre 1992 : « On est au fond, sous les saules. Le patron a dit qu'on ferait l'inscription demain. » La caravane n'était pas sur la liste."),
    ("p:garcin", "Le soir de la crue", "Selon Sandrine, n'avait pas inscrit la caravane de Thierry et Nathalie. Il évacuait le camping avec la liste."),
])

# =========================================================== FERME TARDIEU

piste("tardieu", """
La ferme Tardieu est à la sortie des Pilles, au-dessus de la route, entre des rangées de cerisiers et d'abricotiers serrés comme des soldats. {{p:tardieu|Raoul Tardieu}} trie des cerises sous un hangar de tôle, une radio posée sur une caisse. Il se plaint de tout : de la grêle de mai, des prix de Rungis, des saisonniers qui partent au bout de trois jours.

« Lucien ? C'est le seul qui reste. » Royer est arrivé en mars 1993, à pied, avec un sac. Il a demandé du travail. Tardieu le paie en liquide. « Les papiers, je lui ai pas demandé, et il m'en a pas proposé. Un bon ouvrier, il vous parle pas de ses papiers. » Il dort dans le {{l:ferme_tardieu|cabanon}}, au fond du verger.

Mercredi soir ? « Il est parti vers neuf heures avec la mob. Il est rentré à onze heures, j'ai entendu le moteur, je dormais pas, j'ai mal au dos. » Onze heures pile ? « Les informations de la radio commençaient. »

Le soir, souvent, Lucien part vers Vaison. « Au {{l:camping_saules|camping des Saules}}, à ce qu'on m'a dit, celui qui a été emporté. Il y a plus rien là-bas. Je lui ai jamais demandé ce qu'il y fait. »

En vous raccompagnant à la voiture, il crache par terre. « La photo, c'est moi qui l'ai inscrit au concours. Il voulait pas. Il voulait vraiment pas. »
""", [
    ("p:tardieu", "", "Emploie Royer depuis mars 1993, payé en liquide, sans papiers. L'a inscrit au Grand Prix « alors qu'il ne voulait vraiment pas »."),
    ("p:royer", "Mercredi soir", "Selon Tardieu, parti des Pilles en mobylette vers 21 h, rentré à 23 h pile (le journal de la radio commençait)."),
    ("p:royer", "Le soir", "Part souvent le soir vers Vaison, au camping des Saules, en ruine depuis la crue."),
])

piste("royer", """
{{p:royer|Lucien Royer}} taille un abricotier, au bout d'un rang, sans se retourner quand vous approchez. Casquette de toile, chemise ouverte, des avant-bras de manœuvre. Quand il se retourne enfin, il garde la casquette bas sur les yeux et le soleil dans le dos.

« Je m'appelle Royer. Lucien. Je suis de Givors. » Il le dit comme une leçon. La photo ? « J'aime pas les photos. » Le canal ? « J'y ai jamais mis les pieds. Je suis pas de la ville, moi. » Mercredi soir, il est descendu à Nyons chercher une boule qu'il avait oubliée l'après-midi sur la Digue. « Une lyonnaise. Ça coûte cher. Rien d'autre. »

Il parle peu. Il dit « les gones » pour parler des enfants de Tardieu, comme on dit à Lyon.

Paul lui demande s'il a de la famille. Royer regarde l'abricotier. « Plus maintenant. » Puis il remonte sur son escabeau.
""", [
    ("p:royer", "", "« Je m'appelle Royer. Lucien. Je suis de Givors. » Dit « les gones » pour les enfants, comme à Lyon. « De la famille ? Plus maintenant. »"),
    ("p:royer", "Mercredi soir", "Dit n'avoir jamais mis les pieds au canal, et être seulement descendu chercher sur la Digue une boule oubliée."),
])

piste("royer2", """
Paul pose le tableau de Karim sur le capot de la voiture, au bout du rang d'abricotiers. Il ne dit rien. Il attend.

Royer regarde longtemps les petites croix et les petits ronds. Puis il enlève ses gants. « J'étais au canal. » Il s'assoit sur le marchepied de l'escabeau. « Aimé voulait tout dire aux gendarmes, le lendemain. Il m'avait donné rendez-vous là, sur la berge, à dix heures. J'avais pris la lampe. » Il dit Aimé. Il ne dit pas Chabert, ni le meunier.

« Je lui ai demandé d'attendre. Juste un peu. Que j'y aille moi-même, plutôt. Il pleurait. Il disait qu'il pouvait plus. Il disait qu'il m'avait toujours protégé, et que ça le tuait. »

À dix heures et demie, il a vu quelqu'un sur le pont roman, une silhouette, immobile, qui regardait. « J'ai eu peur. J'ai lâché la lampe et je suis parti en courant. Je suis allé chercher ma boule sur la Digue, une fille me l'a rendue. Après je suis rentré. »

Il relève la tête. « Quand je suis parti, il était vivant. Il pleurait, assis dans l'herbe. Je vous le jure sur la tête de mes gones. » Il s'arrête net. Il a dit mes.
""", [
    ("p:royer", "Second entretien", "Était au canal avec Chabert de 22 h à 22 h 30, avec la lampe. Chabert voulait tout dire aux gendarmes. Royer a fui en voyant une silhouette sur le pont. « Quand je suis parti, il était vivant. »"),
    ("p:royer", "Le lapsus", "Appelle le meunier « Aimé ». Jure « sur la tête de mes gones », alors qu'il dit ne plus avoir de famille."),
])

piste("royer3", """
Royer regarde le portrait-robot, puis la photo de 1992 qu'Yves pose à côté. Il enlève sa casquette. Ses cheveux sont gris, coupés court. Il a le front de la photo, le nez, le menton. Il ne lui manque que la moustache.

« Je m'appelle {{p:garcin|Jacques Garcin}}. »

Il raconte sans s'arrêter, comme si le texte attendait depuis vingt mois. Le couple de Roanne arrivé tard, le 21 au soir, l'emplacement 31 au fond sous les saules, « je leur ai dit qu'on verrait l'inscription le lendemain ». Le 22, la pluie, l'eau qui monte, l'évacuation avec la liste, tout le monde dehors, « tout le monde sur la liste ». Et à six heures, au milieu du parking, il s'est souvenu. « J'ai couru. Il y avait plus de fond du camping. Il y avait plus de saules. Il y avait que l'eau. »

Il a poussé sa voiture dans le courant au gué. Il est monté dans la colline. Aimé l'a trouvé à deux heures du matin, assis dans la boue. « Je lui ai dit : dis que je suis mort. Il l'a dit. Il a fait de moi un héros, ce con. Il voulait m'aider. »

Le lendemain soir, il a appelé Hélène, d'une cabine à Malaucène. « Je lui ai tout dit. Elle m'a écouté jusqu'au bout. Et puis elle a dit : Tu es mort. Reste mort. Et elle a raccroché. » Les mandats sont arrivés en novembre, à la poste restante de Buis. Il a encaissé les trois premiers, « l'hiver, pour manger ». Plus jamais après.

Il remet sa casquette. « Faites ce que vous voulez de moi. Mais j'ai pas tué Aimé. Je l'aimais. C'était le seul qui savait. »
""", [
    ("p:garcin", "Ses aveux", "Lucien Royer est Jacques Garcin. Le 22 septembre 1992, il a oublié la caravane du 31, non inscrite. Il a poussé sa voiture dans le courant et disparu. Chabert a menti pour lui."),
    ("p:helene", "Selon Garcin", "Il l'a appelée le 23 septembre 1992 depuis Malaucène. « Tu es mort. Reste mort. » Elle sait depuis le premier jour."),
    ("p:royer", "Ses aveux", "C'est Jacques Garcin. Il a encaissé les trois premiers mandats d'Hélène, plus aucun ensuite."),
])

piste("cabanon", """
Le cabanon de Royer est au bout du verger, une cabane de pierres sèches avec une porte en planches et pas de serrure. Un lit de camp, une bassine, un réchaud, un calendrier des Postes de 1993 qu'il n'a pas changé.

Sur une étagère, une photo sans cadre, tenue par une punaise : deux enfants sur une plage de galets, un garçon et une fille. Sous le lit, une sacoche de cuir. Dedans, quatre {{d:boules|boules lyonnaises}} en bronze, lourdes comme des pavés, dans des cases de feutre. Sur chacune, gravées à la main, deux initiales : « J.G. »

Dans une boîte à sucre en fer, sur l'étagère, une liasse de {{d:mandats|mandats}} postaux, jamais encaissés. Dix-neuf. Expéditeur : « H. Garcin, Nyons ». Sous l'élastique, un mot plié, une écriture de femme, très droite : « Pour ton silence. Pour le mien. »

Yves photographie la photo des enfants, puis il la remet exactement où elle était, avec la même punaise, dans le même trou.
""", [
    ("d:boules", "", "Quatre boules lyonnaises en bronze sous le lit de Royer, gravées « J.G. »."),
    ("d:mandats", "Dans le cabanon", "Dix-neuf mandats jamais encaissés, expéditeur « H. Garcin, Nyons ». Un mot : « Pour ton silence. Pour le mien. »"),
    ("p:royer", "Son cabanon", "Une photo de deux enfants, un garçon et une fille. Des boules gravées J.G. Les mandats d'Hélène Garcin."),
])

# =========================================================== CAMPING DES SAULES

piste("poursuite", """
Il est onze heures du soir. Karim et Yves sont accroupis derrière le mur de l'ancien bloc sanitaire du camping des Saules, qui n'a plus de toit. La lune éclaire les dalles des emplacements, les tuyaux tordus, le lit de galets où l'Ouvèze coule à peine, si basse qu'on pourrait la traverser en chaussettes. Les cigales se sont tues. On entend les grillons, et une chouette.

À onze heures vingt, une mobylette, sans phare. Elle s'arrête à l'entrée. Un homme marche jusqu'au fond, sous ce qui reste des saules. Il pose par terre un bocal de verre et allume une bougie dedans. Il s'accroupit devant. Il est à deux mètres de Karim.

La flamme lui éclaire le visage par en dessous.
""", [])

piste("ruines", """
En plein jour, le camping des Saules ressemble à une ville bombardée en miniature. Les dalles des emplacements numérotés, le bloc sanitaire sans toit, un panneau rouillé « ACCUEIL · RECEPTION · EMPFANG » qui tient par un seul boulon. La végétation a repris partout, sauf sur les dalles.

Au fond, près de la rivière, là où il ne reste que des souches de saules arrachées, une croix faite de deux branches liées avec du fil de fer. Devant, un bocal avec un fond de bougie. Des fleurs des champs, coquelicots et lavande, coupées depuis un jour ou deux. Sur la croix, deux prénoms gravés au couteau, avec soin : « Thierry · Nathalie ».

Yves cherche le numéro de l'emplacement. La borne est tombée dans l'herbe. Il la relève : 31.

« Les plaques du mémorial donnent les noms, dit Paul. Elles ne disent pas où était la caravane. Celui qui vient ici le sait à un mètre près. »
""", [
    ("l:camping_saules", "Les ruines", "À l'emplacement 31, au fond sous les saules, une croix de branches gravée « Thierry · Nathalie », des fleurs fraîches et une bougie. Quelqu'un sait exactement où était la caravane."),
])

# =========================================================== MÉMORIAL DE LA CRUE

piste("rosa", """
{{p:rosa|Rosa Bérenger}} est assise sur le banc qui fait face au mémorial, à l'ombre, un éventail publicitaire dans une main et un chapelet dans l'autre. Elle a soixante-huit ans, un accent italien qu'elle n'a pas perdu en cinquante ans de Vaucluse, et une photo de son mari dans son sac, qu'elle sort avant qu'on la lui demande.

« Marius. Quarante et un ans de mariage. La rivière l'a pris dans la cave, il était descendu chercher le vin. » Elle range la photo. « Jeudi dernier, je l'ai vu au marché. Devant le fromager. Il portait sa veste. Il m'a regardée, et il est parti. »

Elle ne pleure pas. Elle explique, patiemment, comme à des enfants. « Depuis la photo dans le journal, tout le monde le sait. La rivière rend ses morts, monsieur. Elle a gardé Garcin deux ans, et elle l'a rendu. Elle rendra les autres. »

Paul ne la contredit pas. Karim note tout.

« Et la nuit, il y a de la lumière au {{l:camping_saules|camping des Saules}}. Une petite lumière, au fond. Je la vois de ma fenêtre, j'habite la route de Malaucène. C'est eux. Ils reviennent là où ils sont partis. »
""", [
    ("p:rosa", "", "Veuve de Marius, mort dans la crue. Dit l'avoir vu au marché le jeudi 9 juin. « La rivière rend ses morts. Elle a rendu Garcin. »"),
    ("l:camping_saules", "Selon Rosa", "La nuit, une petite lumière brille au fond du camping en ruine."),
])

piste("plaque", """
Le mémorial est une stèle de pierre blanche au bord de l'Ouvèze, près du pont romain de Vaison, qui a tenu en 1992 quand tout le reste partait. Les noms sont gravés en colonnes, par ordre alphabétique. Il y a toujours des fleurs.

À la lettre G : « Jacques GARCIN, 1944-1992, mort en portant secours ». C'est le seul nom qui porte une mention. Dans un médaillon de porcelaine, la {{d:coupure_1992|photo}} du journal de 1992 : un homme moustachu aux cheveux bruns, le front haut, le nez de travers, le menton carré.

À la lettre M : « Thierry MOLLET, 1966-1992 ». À la lettre B : « Nathalie BRUN, 1968-1992 ».

Sous le médaillon de Garcin, un bouquet de lavande, frais, attaché avec un élastique. Une carte de fleuriste sans en-tête, glissée dedans, avec un seul mot au stylo : « Pardon. » Pas de signature. Paul la retourne. Rien au dos.
""", [
    ("d:coupure_1992", "Le médaillon", "Sur la plaque de Vaison, la photo de Garcin en 1992 : moustache, cheveux bruns, front haut, nez de travers, menton carré."),
    ("l:memorial", "La plaque", "« Jacques GARCIN, mort en portant secours », le seul nom avec une mention. Plus bas, Thierry Mollet et Nathalie Brun. Un bouquet avec une carte : « Pardon. »"),
])

# =========================================================== PUZZLES

DESCRIPTION_SANDRINE = ("Je l'ai regardé jouer tout l'après-midi, de loin, en plein soleil. Et le soir, je lui ai rendu sa boule sous le réverbère. "
                        "Les cheveux courts, gris. Le front haut, avec des rides, trois. Une moustache, je crois. Enfin. Je l'ai tellement regardé sur le journal, cet homme-là. "
                        "Le menton carré. Je ne l'ai pas regardé dans les yeux.")
DESCRIPTION_KARIM = ("Je l'ai vu à deux mètres, à la flamme de la bougie. Les cheveux blancs, tout blancs. Les yeux enfoncés, comme deux trous. "
                     "Le nez cassé, de travers, comme un boxeur. Pas de moustache : rasé de près, il avait une coupure de rasoir sur la joue. "
                     "Le menton carré, avec une fossette.")

PUZZLES = {
    # Le tableau de Karim : voir confrontation-premier-jet.md (validé le 1er octobre)
    "confrontation": dict(
        titre="Le tableau de Karim",
        consigne="Un seul des quatre ment, et tout ce qu'il dit est faux. Les autres disent vrai. Les grilles sont votre brouillon : seules comptent vos réponses aux questions de Paul.",
        temoins=[
            dict(id="helene", nom="Hélène Garcin", court="Hélène", role="la veuve"),
            dict(id="royer", nom="Lucien Royer", court="Royer", role="ouvrier agricole"),
            dict(id="firmin", nom="Firmin Achard", court="Firmin", role="joueur de boules"),
            dict(id="sandrine", nom="Sandrine Mollet", court="Sandrine", role="saisonnière"),
        ],
        declarations=[
            ("helene", "J'ai passé la soirée au café des Arcades. Demandez à qui vous voulez."),
            ("royer", "Le canal ? Je n'y ai pas mis les pieds de la soirée."),
            ("royer", "J'avais mes boules avec moi, comme tous les soirs. Je ne les quitte pas."),
            ("royer", "Si je suis sorti, c'est pour chercher une boule que j'avais oubliée sur la Digue. Rien d'autre."),
            ("firmin", "Une lampe ? À mon âge, je connais chaque pierre de ce pays."),
            ("firmin", "Je n'étais ni au bord de l'eau, ni sur la Digue."),
            ("firmin", "Je ne cherchais rien, et je n'attendais personne."),
            ("sandrine", "La boule lyonnaise, c'est moi qui l'avais. Je l'ai ramassée par terre, elle traînait."),
            ("sandrine", "Madame Garcin n'avait pas le journal. Elle a fait suspendre l'abonnement après la photo, tout le monde le sait."),
        ],
        indices=[
            ("Gaston Rey, cantonnier", "Vers 22 h, une femme seule près du boulodrome de la Digue."),
            ("Les gendarmes", "La lampe de poche a été trouvée sur la berge du canal : celui qui la tenait était au canal."),
            ("Fredo, serveur", "Sa cliente de 22 h aux Arcades a regardé la porte toute la soirée : la personne des Arcades attendait quelqu'un."),
            ("Josiane Pellegrin", "Le meunier devait « s'expliquer avec quelqu'un, au canal, ce soir » : la personne du canal venait s'expliquer."),
        ],
        categories=[
            dict(id="lieu", nom="Où, à 22 h", valeurs=[("canal", "La berge du canal", "Canal"), ("pont", "Le pont roman", "Pont"),
                                                     ("digue", "Le boulodrome de la Digue", "Digue"), ("arcades", "Le café des Arcades", "Arcades")]),
            dict(id="objet", nom="Avec quoi", valeurs=[("lampe", "Une lampe de poche", "Lampe"), ("cles", "Les clés du moulin", "Clés"),
                                                       ("journal", "Le journal du jour", "Journal"), ("boule", "Une boule lyonnaise", "Boule")]),
            dict(id="raison", nom="Pourquoi dehors", valeurs=[("expliquer", "Venir s'expliquer", "S'expliquer"), ("attendre", "Attendre quelqu'un", "Attendre"),
                                                             ("surveiller", "Surveiller quelqu'un", "Surveiller"), ("chercher", "Chercher un objet perdu", "Chercher")]),
        ],
        questions=[
            dict(id="menteur", texte="Qui ment ?", choix="temoins", reponse="royer"),
            dict(id="ou", texte="Où était le menteur à 22 h ?", choix="lieu", reponse="canal"),
            dict(id="sac", texte="Qu'avait Hélène Garcin dans son sac ?", choix="objet", reponse="cles"),
        ],
        solution=dict(menteur="royer",
                      lieu=dict(helene="arcades", royer="canal", firmin="pont", sandrine="digue"),
                      objet=dict(helene="cles", royer="lampe", firmin="journal", sandrine="boule"),
                      raison=dict(helene="attendre", royer="expliquer", firmin="surveiller", sandrine="chercher")),
        erreur="« Admettons. » Paul n'est pas convaincu. Quelque chose ne tient pas, et vous avez perdu une heure.",
        aide="Karim tapote deux lignes de son bloc. « Royer et Sandrine disent tous les deux qu'ils avaient la boule lyonnaise. Ils ne peuvent pas dire vrai tous les deux. Le menteur, c'est l'un des deux. »",
        resultat="""Paul hoche la tête. Lucien Royer a menti sur toute la ligne. À 22 h, il était sur la berge du canal, avec la lampe du camping des Saules, venu s'expliquer avec le meunier. Firmin surveillait depuis le pont roman, son journal à la main. Sandrine cherchait sa montre sur la Digue et y avait ramassé la boule de Royer.

Et Hélène Garcin attendait aux Arcades, avec dans son sac {{d:cles_moulin|les clés du moulin}}. Les clés qu'elle dit avoir rendues en mai.

« Admettons qu'il mente, dit Paul. Ça ne veut pas dire qu'il a tué. Ça veut dire qu'il était là. »""",
        notes=[
            ("p:royer", "Le tableau", "Ment sur tout. À 22 h, il était sur la berge du canal, avec la lampe, venu s'expliquer avec le meunier."),
            ("d:cles_moulin", "", "Dans le sac d'Hélène Garcin, aux Arcades, mercredi à 22 h. Elle dit les avoir rendues en mai."),
            ("p:helene", "Le tableau", "À 22 h aux Arcades, à attendre quelqu'un, avec les clés du moulin dans son sac."),
            ("p:firmin", "Le tableau", "À 22 h sur le pont roman, avec le journal du jour. Il surveillait quelqu'un."),
            ("p:sandrine", "Le tableau", "À 22 h sur la Digue, avec la boule lyonnaise de Royer. Elle cherchait un objet perdu."),
        ],
    ),

    "portrait": dict(
        titre="Le portrait-robot",
        consigne="Choisissez chaque trait d'après les deux témoins. Quand ils ne sont pas d'accord, demandez-vous lequel a pu se tromper, et pourquoi.",
        temoins=[("Sandrine", DESCRIPTION_SANDRINE), ("Karim", DESCRIPTION_KARIM)],
        traits=[
            dict(id="cheveux", nom="Cheveux", options=[("gris", "Courts, gris"), ("blancs", "Courts, blancs"), ("degarnis", "Dégarnis"), ("longs", "Longs, en arrière")]),
            dict(id="front", nom="Front", options=[("haut", "Haut, ridé"), ("bas", "Bas"), ("lisse", "Bombé, lisse")]),
            dict(id="yeux", nom="Yeux", options=[("enfonces", "Enfoncés"), ("ronds", "Ronds"), ("tombants", "Tombants")]),
            dict(id="nez", nom="Nez", options=[("droit", "Droit"), ("casse", "Cassé, de travers"), ("busque", "Busqué")]),
            dict(id="bouche", nom="Bouche", options=[("rasee", "Fine, rasée"), ("moustache", "Fine, avec moustache"), ("epaisse", "Épaisse, rasée")]),
            dict(id="menton", nom="Menton", options=[("carre", "Carré, à fossette"), ("fuyant", "Fuyant"), ("pointu", "Pointu")]),
        ],
        solution=dict(cheveux="gris", front="haut", yeux="enfonces", nez="casse", bouche="rasee", menton="carre"),
        erreur_un="Sandrine et Karim regardent le portrait. Ils ne sont pas d'accord avec vous sur un trait.",
        erreur_plusieurs="Sandrine et Karim regardent le portrait. Ils ne sont pas d'accord avec vous sur {n} traits.",
        aide="Yves reprend les calques. « Sandrine a ajouté la moustache du journal de 1992 : elle a regardé cette photo tous les soirs pendant vingt mois. Et à la bougie, le gris devient blanc. Je le sais, c'est mon métier. »",
        resultat="""Yves pose le {{d:portrait_robot|portrait}} à côté de la photo de 1992, celle du médaillon de Vaison. Il cache la moustache avec son pouce.

Le même front haut. Les mêmes yeux enfoncés. Le même nez cassé, de travers vers la gauche. La même fossette au menton. Il retire son pouce, le remet.

« Vingt mois, des cheveux gris et un coup de rasoir. C'est lui. »""",
        notes=[
            ("d:portrait_robot", "", "Cheveux courts et gris, front haut ridé, yeux enfoncés, nez cassé, bouche fine sans moustache, menton carré à fossette. Le visage de Garcin en 1992, sans la moustache."),
            ("p:royer", "Le portrait", "L'homme de la Digue et l'homme des Saules sont le même. Il a le visage de Jacques Garcin, moustache en moins."),
        ],
    ),

    "poursuite": dict(
        titre="Huit secondes",
        consigne="Il souffle la bougie et se relève. Il va repartir. Décidez, vite.",
        secondes=8,
        defaut="cacher",
        commun="Karim l'a vu à deux mètres, à la flamme. Plus tard, il en fera son {{d:temoignage_karim|témoignage}} pour Yves, mot pour mot : « " + DESCRIPTION_KARIM + " »",
        notes=[
            ("d:temoignage_karim", "", "« " + DESCRIPTION_KARIM + " »"),
            ("l:camping_saules", "La nuit", "Un homme vient la nuit en mobylette à l'emplacement 31, au fond sous les saules, et y allume une bougie."),
        ],
        options=[
            dict(id="cacher", bouton="Rester caché", texte="""Karim ne bouge pas. Yves non plus. L'homme reste debout un long moment dans le noir, la bougie éteinte à ses pieds. Puis il parle, tout bas, avec un accent qui n'est pas d'ici.

« Pardon, Thierry. Pardon, Nathalie. Je vous avais pas notés. J'avais dit demain. »

Il ramasse le bocal, il repart à pied vers la mobylette, et il s'en va sans allumer le phare.""",
                 notes=[("l:camping_saules", "Les mots de l'homme", "« Pardon, Thierry. Pardon, Nathalie. Je vous avais pas notés. J'avais dit demain. »")],
                 actions=["oublie"]),
            dict(id="suivre", bouton="Le suivre", texte="""Vous le laissez partir, puis Yves démarre la voiture tous feux éteints. La mobylette ne remonte pas vers les Pilles. Elle descend vers Vaison, passe le pont romain et s'arrête devant le {{l:memorial|mémorial}}.

L'homme reste debout devant la stèle. Puis il pose la main à plat sur un nom, à la lettre G, et il la laisse là longtemps, comme sur l'épaule de quelqu'un.

Quand il est reparti, Karim va voir. Sous sa main, il y avait : Jacques GARCIN.""",
                 notes=[("l:memorial", "La nuit", "L'homme des Saules s'arrête au mémorial et pose longtemps la main sur le nom de Jacques Garcin.")],
                 actions=["suit"]),
            dict(id="barrer", bouton="Lui barrer la route", texte="""Yves se lève et déclenche son flash en pleine figure. L'homme crie, se cache le visage dans le coude et part en courant à travers les souches, vers la rivière. Il laisse la mobylette, et une musette au pied de la croix.

Dedans, une gourde, un couteau, et une {{d:photo_famille|photo}} pliée en quatre, usée aux plis : un homme moustachu, une femme blonde, deux enfants, devant un panneau « Camping des Saules ». Au dos : « Été 1991 ».

Au matin, la mobylette a disparu. La photo d'Yves, développée le lendemain : un bras levé, un éclair blanc. Rien d'autre.""",
                 notes=[("d:photo_famille", "", "Dans la musette de l'homme des Saules : la famille Garcin devant le camping, « Été 1991 ».")],
                 actions=[]),
            dict(id="frapper", bouton="Lui sauter dessus", cout=4, texte="""Karim bondit. Il a fait du rugby au lycée, il le dit souvent. L'homme est plus lourd, plus vieux, plus fort. Ils roulent dans les galets. La casquette tombe. L'homme se dégage, frappe Karim une seule fois, à l'épaule, sans méchanceté, et disparaît dans le noir.

Deux minutes plus tard, des phares : une patrouille de la brigade de Vaison, appelée par une voisine qui voit « des lumières chez les morts ». Karim passe la nuit en garde à vue pour violences. Yves, dans le couloir, sur une chaise.

L'{{p:montagne|adjudant-chef Montagne}} vient les chercher le lendemain à midi. « Votre stagiaire a plaqué un homme dans un camping en ruine. Je n'ai pas de rubrique pour ça non plus. Point. » Dans la voiture, Karim sort de sa poche la casquette, qu'il a gardée. Sur la bande de cuir, à l'encre : « J.G. »

Vous avez perdu une journée.""",
                 notes=[("p:montagne", "Garde à vue", "A récupéré Karim le lendemain midi, après une nuit de garde à vue à Vaison pour violences."),
                        ("l:camping_saules", "La casquette", "Tombée pendant la bagarre. Sur la bande de cuir, à l'encre : « J.G. »")],
                 actions=[]),
        ],
        aide="Sans réponse, Karim reste caché.",
    ),
}

# =========================================================== L'ARTICLE À TROUS

ACTIONS = {
    "endort": "endort",
    "pousse": "pousse",
    "va_tout_dire": "va tout dire",
    "oublie": "oublie",
    "ment": "ment",
    "fait_chanter": "fait chanter",
    "suit": "suit",
    "protege": "protège",
    "menace": "menace",
}

# Piste lue -> mots d'action qu'elle fait entrer dans la liste.
# « endort » ne doit pas venir trop tôt : il dévoile la méthode.
DEBLOCAGE_ACTIONS = {
    "dossier": ["pousse"],
    "montagne": ["pousse"],
    "sauvan": ["endort"],
    "labo": ["endort"],
    "chambre_firmin": ["endort", "pousse"],
    "lettre_chabert": ["va_tout_dire", "ment"],
    "royer2": ["va_tout_dire", "protege"],
    "josiane": ["menace"],
    "moulin": ["ment"],
    "royer3": ["oublie", "ment"],
    "sandrine2": ["oublie"],
    "vasseur": ["fait_chanter"],
    "fredo": ["suit"],
    "tente": ["menace"],
}

LIEUX_ARTICLE = {
    "agence": "à l'agence du Drômois",
    "gendarmerie": "à la gendarmerie",
    "arcades": "au café des Arcades",
    "cabinet_sauvan": "au cabinet du Dr Sauvan",
    "pharmacie": "à la pharmacie du Pont",
    "hotel": "à l'hôtel de la Place",
    "maison_garcin": "chez Hélène Garcin",
    "pension": "à la pension des Forts",
    "moulin": "au moulin Chabert",
    "canal": "au bord du canal",
    "pont": "sur le pont roman",
    "boulodrome": "à la Digue",
    "camping_municipal": "au camping municipal",
    "ferme_tardieu": "à la ferme Tardieu",
    "camping_saules": "au camping des Saules",
    "memorial": "au mémorial de Vaison",
}

ARTICLE = [
    dict(id="crue", titre="Le soir de la crue", texte=(
        "Le 22 septembre 1992, quand l'Ouvèze monte, Jacques Garcin évacue son camping, la liste à la main. Mais il [[a:oublie|Q4]] "
        "la caravane du fond, où dorment Thierry Mollet et Nathalie Brun. Pour couvrir son ami, [[p:chabert|Q4]] [[a:ment|Q4]] aux gendarmes : "
        "il dit l'avoir vu emporté en portant secours.")),
    dict(id="revenant", titre="Le revenant", texte=(
        "L'homme de la photo du Grand Prix de la Digue, Lucien Royer, n'est autre que [[p:garcin|Q3]]. [[d:portrait_robot|Q3]] ne laisse aucun doute.")),
    dict(id="veuve", titre="La veuve", texte=(
        "[[p:helene|Q5]] le sait depuis le lendemain de la crue. Chaque mois, elle lui envoie [[d:mandats|Q5]].")),
    dict(id="mobile", titre="Le mobile", texte=(
        "En juin 1994, Aimé Chabert [[a:va_tout_dire|Q2]] aux gendarmes. Si Garcin est vivant, sa veuve doit rendre [[d:assurance|Q2]], et elle risque la prison.")),
    dict(id="canal", titre="La nuit du canal", texte=(
        "Le mercredi 15 juin, à 23 h, [[p:helene|Q1]] entre au moulin avec [[d:cles_moulin|Q1]]. Elle [[a:endort|Q1]] le meunier avec ses somnifères, "
        "puis le [[a:pousse|Q1]] dans le bief.")),
    dict(id="lettre", titre="La lettre", texte=(
        "La lettre qui a fait venir le Bureau à Nyons, c'est [[p:sandrine|Q6]] qui l'a écrite. Thierry Mollet était son frère.")),
    dict(id="salamandre", titre="La salamandre", bonus=True, texte=(
        "Sur le pont roman, quelqu'un a tout vu et n'a rien dit : [[p:firmin|BONUS]], dont le carnet porte une salamandre.")),
]

POINTS = {"Q1": 20, "Q2": 20, "Q3": 20, "Q4": 10, "Q5": 10, "Q6": 10, "BONUS": 5}

SCORE = dict(
    pistes_de_reference=13,
    penalite_par_piste_en_plus=2,
    essais=[1.0, 0.8, 0.6],
    rangs=[(80, "Réussite majeure"), (60, "Réussite"), (40, "Demi-succès"), (0, "Échec")],
)

RELECTURE = dict(
    juste="Jean-Loup lit l'article deux fois, au téléphone, Paul lisant à voix haute depuis la cabine de la place. Il ne dit rien pendant un long moment. Puis : « Ça tient. Envoyez. »",
    essai1="Jean-Loup a relu le fax. « Il y a un paragraphe qui ne tient pas. Je l'ai marqué. Je ne vous dis pas où ça cloche. »",
    essai1_pluriel="Jean-Loup a relu le fax. « Il y a des paragraphes qui ne tiennent pas. Je les ai marqués. Je ne vous dis pas où ça cloche. »",
    essai2="Jean-Loup soupire dans le combiné. « Là, et là. En rouge. Dernière chance. Au prochain fax, ça part tel quel. »",
    essai3="Jean-Loup ne relit même pas. « C'est l'heure. Ça part. »",
)

# =========================================================== FINS

FINS = [
    dict(id="une", condition="Q1, Q2 et Q3 justes", titre="La une", texte="""
Samedi 25 juin, la page des Affaires occultes est en une du Drômois, et reprise par les treize autres titres du groupe. Jean-Loup a choisi le titre lui-même : « Le noyé de l'Ouvèze était vivant, et sa veuve le savait ».

Hélène Garcin est mise en examen pour meurtre le lundi suivant, à Valence. Elle ne dit presque rien au juge. Elle demande seulement que ses enfants n'assistent pas au procès. Le Dr Sauvan témoigne. L'adjudant-chef Montagne est muté à Die.

Jacques Garcin se présente de lui-même à la gendarmerie de Vaison le mardi matin, à pied, avec un sac. Le parquet de Carpentras rouvre le dossier de la crue. Il n'a pas d'avocat, et il n'en veut pas.

Julien Garcin appelle le Bureau en juillet. Il ne crie pas. Il demande seulement à quoi ressemble son père, maintenant. Paul le lui dit, trait par trait, comme pour un portrait-robot.
"""),
    dict(id="sans_mobile", condition="Q1 et Q3 justes, Q2 fausse", titre="Le mobile", texte="""
Samedi 25 juin, l'article fait du bruit : la veuve du héros a tué le meunier, et le héros est vivant. Hélène Garcin est mise en examen.

Mais l'article se trompe sur le pourquoi, et son avocat le sait. À l'audience de septembre, il lit la page du samedi à voix haute, lentement, et demande au juge où est le mobile. Il n'y en a pas, dans ce qu'a écrit le Bureau. Hélène Garcin est remise en liberté sous contrôle judiciaire.

Elle reprend la boutique du moulin en novembre, pour la saison des olives. Les clients disent qu'elle est très digne.
"""),
    dict(id="legende", condition="Q1 juste, Q3 fausse", titre="La légende", texte="""
Samedi 25 juin, l'article tient sur un point : Aimé Chabert ne s'est pas noyé tout seul. Hélène Garcin est entendue, puis mise en examen.

Mais l'article ne dit pas qui est l'homme de la photo. Le revenant reste un revenant. Le lundi, Lucien Royer ne se présente pas aux vergers. Tardieu trouve le cabanon vide, la sacoche de boules partie, les mandats aussi.

À Vaison, la plaque dit toujours « mort en portant secours ». Rosa Bérenger continue de voir Marius au marché. Et la nuit, de sa fenêtre, elle ne voit plus de lumière au camping des Saules.
"""),
    dict(id="revenant", condition="Q1 : Royer ou Garcin", titre="Le revenant", texte="""
Samedi 25 juin, le titre de Jean-Loup fait le tour de la région : « Le revenant de l'Ouvèze a tué le meunier ». C'est exactement la page qu'il voulait. Les ventes du Drômois doublent.

Les gendarmes viennent chercher Lucien Royer aux Pilles le lundi matin. Il ne résiste pas. Il ne se défend pas. Il dit seulement qu'il s'appelle Jacques Garcin, et qu'il n'a pas tué Aimé. Personne ne l'écoute. On l'écoute encore moins quand on apprend ce qu'il a fait en 1992.

Hélène Garcin vend la maison des Forts en août, à un couple de Hollandais. Le Dr Sauvan envoie au juge le résultat de son analyse, et une lettre de quatre pages. Elle n'a jamais de réponse.
"""),
    dict(id="dementi", condition="Q1 fausse", titre="Le démenti", texte="""
L'article paraît le samedi 25 juin. Le lundi, la gendarmerie publie un communiqué : la mort d'Aimé Chabert est accidentelle, l'enquête est close, et « certains journalistes feraient mieux de s'en tenir aux fantômes ». L'adjudant-chef Montagne a écrit la dernière phrase lui-même.

Jean-Loup convoque Paul à Lyon. La porte reste fermée une heure. En sortant, il dit seulement : « Admettons. »

À Nyons, la vanne du moulin est fermée, le cadenas est neuf. L'été passe. On ne presse qu'en hiver.
"""),
]

FINS_COMPLEMENTS = {
    "Q4": ("La plaque de Vaison est refaite en octobre. La mention « mort en portant secours » disparaît, et le nom de Jacques Garcin avec elle. Sur la nouvelle pierre, quelqu'un a fait ajouter, sous les noms de Thierry Mollet et Nathalie Brun : « emplacement 31 ».",
           "À Vaison, la plaque dit toujours « mort en portant secours ». Chaque 22 septembre, quelqu'un y dépose un bouquet de lavande avec une carte : « Pardon. »"),
    "Q5": ("La Mutuelle rhodanienne porte plainte pour escroquerie. La maison des Forts est saisie. Julien et Claire partent vivre chez une grand-tante, à Dieulefit.",
           "La Mutuelle rhodanienne classe le dossier : rien ne prouve que la veuve savait. Jean-Claude Vasseur repart à Avignon avec sa calculette solaire."),
    "Q6": ("Sandrine Mollet repart à Roanne à la fin du mois. Gaston Rey a retrouvé la montre de Thierry sous un banc de la Digue. Il la lui a portée au camping, sans un mot, et il est reparti avant qu'elle ouvre la boîte.",
           "Sandrine Mollet est entendue trois fois par les gendarmes sur sa visite au moulin. Elle quitte Nyons avant les abricots, sans sa montre."),
}

# Si Karim a sauté sur l'homme des Saules (la poursuite) : un paragraphe de plus et des points en moins
FIN_BAGARRE = dict(
    titre="Le Bureau fait la une",
    texte="Le mardi, La Gazette du Vaucluse, un concurrent, titre en page 3 : « Un journaliste lyonnais agresse un ouvrier agricole dans un camping sinistré ». Jean-Loup découpe l'article et l'épingle au-dessus du bureau de Karim, à Lyon. Il y restera jusqu'à Noël.",
    penalite=10,
)

EPILOGUE = """Le lundi suivant, au courrier du Bureau, à Lyon, une carte de bristol blanc, timbrée de Nyons. La salamandre dans les flammes, à l'encre rouge. Au dos, d'une écriture fine et penchée : « Vos conclusions sont justes. Les nôtres aussi. F. A. »

Odile la pose à côté de celle de novembre. Les deux salamandres sont identiques, au trait près. Le soir, elle reste tard aux archives.

Le lendemain matin, il y a sur le bureau de Paul une coupure du Drômois du 3 août 1958, page des boules : « Nyons. Décès de M. Firmin Achard, 71 ans, figure de la Boule nyonsaise. » Pas de photo. Odile ne dit rien. Elle a souligné l'âge."""

MANCHETTES = {
    "une": "Le noyé de l'Ouvèze était vivant, et sa veuve le savait",
    "sans_mobile": "Nyons : la veuve du héros mise en examen",
    "legende": "Nyons : le meunier ne s'est pas noyé tout seul",
    "revenant": "Le revenant de l'Ouvèze a tué le meunier",
    "dementi": "Nyons : la rivière garde ses secrets",
}

SOLUTION = """Le 22 septembre 1992, Jacques Garcin évacue son camping des Saules avec la liste des inscrits, mais il a oublié d'y noter la caravane de Thierry Mollet et Nathalie Brun, arrivés la veille. Ils meurent. Garcin disparaît, et son ami Aimé Chabert, le meunier, jure l'avoir vu emporté en portant secours. Le lendemain, Garcin appelle sa femme, Hélène : « Tu es mort. Reste mort. » Elle touche 1,4 million d'assurance-vie et lui envoie des mandats pour qu'il se taise. Garcin vit aux Pilles sous le nom de Lucien Royer. En juin 1994, une photo de concours le trahit. Sandrine Mollet, la sœur de Thierry, le reconnaît, va crier chez Chabert et écrit au Bureau. Chabert décide de tout dire aux gendarmes le jeudi 16, et prévient Hélène. Le mercredi 15 à 22 h, il voit Garcin sur la berge du canal ; Garcin repart à 22 h 30, et Chabert est vivant. À 23 h 05, Hélène entre au moulin avec ses clés, endort Chabert avec son Mogadon dans un verre de marc, ouvre la vanne et le pousse dans le bief. Firmin Achard a tout vu depuis le pont roman, et n'a rien dit."""

# (piste, rang de la note) : pistes dont la lecture barre cette note
CONTRADICTIONS = {
    ("intro", 0): ["sauvan", "labo", "isnard"],
    ("intro", 1): ["royer3", "cabanon"],
    ("montagne", 0): ["sauvan", "labo"],
    ("montagne", 1): ["sauvan", "isnard"],
    ("dossier", 0): ["isnard"],
    ("helene", 0): ["royer3"],
    ("helene", 1): ["fredo", "helene2", "chambre_firmin"],
    ("helene", 2): ["josiane", "helene2"],
    ("royer", 0): ["royer3"],
    ("royer", 1): ["royer2"],
    ("firmin", 0): ["chambre_firmin"],
    ("sandrine", 0): ["sandrine2"],
    ("vasseur", 2): ["lettre_chabert", "royer2"],
}

SILENCE = ["royer3", "chambre_firmin", "labo"]   # l'ambiance se coupe avant la révélation
SALAMANDRE = ["chambre_firmin", "pont"]          # joue le leitmotiv
NUIT = {"poursuite": "saules-nuit"}              # ambiance propre à une piste

# Pages de fax : remplacent la ligne [[fax]] dans le texte de la piste, et s'impriment à l'écran.
FAX = {
    "odile": """GROUPE SARRAZIN · SERVICE DES ARCHIVES · LYON
À : BUREAU DES AFFAIRES OCCULTES, AUX BONS SOINS DU DRÔMOIS, NYONS · 2 PAGES

LE DRÔMOIS, 25 SEPTEMBRE 1992, PAGE 1
Le héros du camping des Saules. Jacques Garcin, 48 ans, né à Givors, gérant du camping des Saules en amont de Vaison, a été emporté mardi en fin d'après-midi alors qu'il retournait chercher les occupants d'une caravane, au fond du terrain. Son ami Aimé Chabert, meunier à Nyons, venu aider à l'évacuation : « Je l'ai vu partir vers la caravane du fond. L'eau l'a pris. Je n'ai rien pu faire. » Sa voiture a été retrouvée au gué, retournée. Le corps n'a pas été retrouvé. (Photo : J. Garcin à l'accueil du camping, été 1991.)

LE DRÔMOIS, 28 SEPTEMBRE 1992, PAGE 3, LISTE DES VICTIMES (EXTRAIT)
… Thierry MOLLET, 26 ans, et Nathalie BRUN, 24 ans, de Roanne, en vacances, retrouvés à Roaix …

(À la main, en bas de la page :) Sur la photo de 1991, il a la moustache et les cheveux bruns. Le nez a été cassé, et mal remis. O.""",
    "lettre_chabert": """AIMÉ CHABERT · MOULIN CHABERT · QUARTIER DU PONT ROMAN · 26110 NYONS
À LA RÉDACTION DU DRÔMOIS, VALENCE · POSTÉE LE 15 JUIN 1994

Messieurs,

Vous avez publié le 2 juin la photo d'un homme qui s'appelle Lucien Royer. C'est Jacques Garcin. Il n'est pas mort en 1992. J'ai menti aux gendarmes. Je ne l'ai pas vu emporter. Je l'ai retrouvé vivant, la nuit, dans la colline, et il m'a demandé de dire qu'il était mort. Je l'ai fait. Il n'est pas allé chercher la caravane du fond. Il l'avait oubliée.

Je le dirai jeudi aux gendarmes. Je l'écris aussi au journal, parce que c'est le journal qui a fait de lui un héros, et parce que j'ai peur de ne pas avoir le courage jeudi.

Hélène le sait. Je le lui ai dit dimanche. Elle m'a demandé d'attendre. Je n'attendrai plus.

S'il m'arrive quelque chose, ce ne sera pas la rivière.

Aimé Chabert""",
}
