# Carte des pistes de l'affaire de Nyons (« Le noyé de l'Ouvèze »).
# Source unique : ce fichier produit 3-carte-des-pistes.md et vérifie la
# cohérence de l'enquête (accès aux pistes, chemin de référence, recoupements).
#   python3 carte.py
#
# Nouveautés par rapport à Saint-Étienne :
#   des_le=n          la piste n'apparaît qu'après n pistes dépensées (le calendrier :
#                     4 créneaux par jour, donc 8 = lundi 9 h, 12 = mardi 9 h)
#   jusqu_a=n         la piste disparaît après n pistes dépensées si on ne l'a pas lue
#                     (quelqu'un quitte la ville)
#   gratuit=True      la lire ne coûte pas de piste (un courrier qui arrive)
#   requiert_puzzle   il faut avoir résolu ce puzzle (le tableau de Karim, le portrait)

import sys, pathlib

ICI = pathlib.Path(__file__).parent

QUARTIERS = {
    "vieille_ville": "Les Forts",
    "centre": "Centre",
    "pont_roman": "Le Pont roman",
    "digue": "La Digue",
    "les_pilles": "Les Pilles",
    "vaison": "Vaison-la-Romaine",
}

LIEUX = {
    "agence": ("Agence du Drômois", "centre"),
    "gendarmerie": ("Brigade de gendarmerie", "centre"),
    "arcades": ("Café des Arcades", "centre"),
    "cabinet_sauvan": ("Cabinet du Dr Sauvan", "centre"),
    "pharmacie": ("Pharmacie du Pont", "centre"),
    "hotel": ("Hôtel de la Place", "centre"),
    "maison_garcin": ("Maison d'Hélène Garcin", "vieille_ville"),
    "pension": ("Pension des Forts", "vieille_ville"),
    "moulin": ("Moulin Chabert", "pont_roman"),
    "canal": ("Le canal du Moulin", "pont_roman"),
    "pont": ("Le Pont roman", "pont_roman"),
    "boulodrome": ("Boulodrome de la Digue", "digue"),
    "camping_municipal": ("Camping municipal", "digue"),
    "ferme_tardieu": ("Ferme Tardieu", "les_pilles"),
    "camping_saules": ("Camping des Saules", "vaison"),
    "memorial": ("Mémorial de la crue", "vaison"),
}

PERSONNES = {
    "garcin": ("Jacques Garcin", "maison_garcin"),
    "royer": ("Lucien Royer", "ferme_tardieu"),
    "helene": ("Hélène Garcin", "maison_garcin"),
    "chabert": ("Aimé Chabert", "moulin"),
    "firmin": ("Firmin Achard", "pension"),
    "sandrine": ("Sandrine Mollet", "camping_municipal"),
    "montagne": ("Adjudant-chef Montagne", "gendarmerie"),
    "sauvan": ("Dr Anne Sauvan", "cabinet_sauvan"),
    "gaston": ("Gaston Rey, cantonnier", "boulodrome"),
    "fredo": ("Fredo, serveur aux Arcades", "arcades"),
    "josiane": ("Josiane Pellegrin", "moulin"),
    "isnard": ("Norbert Isnard, aiguadier", "canal"),
    "tardieu": ("Raoul Tardieu", "ferme_tardieu"),
    "gisele": ("Gisèle Arnaud", "agence"),
    "vasseur": ("Jean-Claude Vasseur", "hotel"),
    "rosa": ("Rosa Bérenger", "memorial"),
    "roux": ("Mme Roux, pharmacienne", "pharmacie"),
}

# Adresses à chercher au Minitel : connaître le nom ne suffit pas.
MINITEL = {"tardieu": "Tardieu Raoul, arboriculteur, Les Pilles", "sauvan": "Dr A. Sauvan, Nyons"}
# Royer n'a pas de téléphone : on ne trouve la ferme qu'en passant par Tardieu.
SANS_ADRESSE = ["royer"]

# Connu dès l'intro : la lettre anonyme, la page du concours, la brève sur la noyade.
DEPART = ["l:agence", "l:moulin", "l:gendarmerie", "l:boulodrome",
          "p:garcin", "p:chabert", "p:royer", "p:tardieu", "p:helene", "d:lettre_anonyme", "d:photo_concours"]

# Rôles : E = essentielle (sur le chemin de référence), U = utile (recoupe, confirme),
#         X = élimine un suspect, F = fausse piste
PISTES = [
    # ---------------- Agence du Drômois ----------------
    dict(id="gisele", lieu="agence", type="entretien", bouton="Parler à Gisèle Arnaud, la correspondante",
         titre="Gisèle Arnaud, correspondante", role="U",
         contenu="Elle a pris la photo du concours le 29 mai. Royer a tourné la tête. Depuis, à Vaison, on dit que la rivière rend ses morts : "
                 "Rosa Bérenger jure avoir vu son mari au marché. Un vieux monsieur de la pension est venu acheter trois exemplaires du journal du 2 juin.",
         revele=["p:gisele", "p:rosa", "l:memorial", "p:firmin"]),
    dict(id="odile", lieu="agence", type="investigation", bouton="Appeler Odile aux archives du groupe",
         titre="Odile et la crue de 1992", role="E",
         contenu="Le Drômois du 25 septembre 1992 : « Le héros du camping des Saules ». Le témoignage d'Aimé Chabert. La photo de Garcin, moustache. "
                 "La liste des victimes, dont Thierry Mollet et Nathalie Brun, de Roanne. Garcin est né à Givors.",
         revele=["l:camping_saules", "l:memorial", "d:coupure_1992"], repond={"Q4": "La version officielle : Garcin est mort en allant chercher la caravane du fond."}),
    dict(id="lettre_chabert", lieu="agence", type="investigation", bouton="Lire le fax d'Odile : un courrier pour la rédaction",
         titre="La lettre du meunier", role="E", des_le=8, gratuit=True,
         contenu="Postée par Chabert le mercredi 15 juin à Valence, arrivée vendredi, faxée lundi. « J'ai menti en 1992. Jacques n'est pas mort. "
                 "Je le dirai jeudi aux gendarmes. Hélène le sait, je le lui ai dit dimanche. S'il m'arrive quelque chose, ce ne sera pas la rivière. »",
         revele=["d:lettre_chabert"], repond={"Q2": "Chabert allait parler jeudi, et Hélène le savait.", "Q4": "Chabert a menti en 1992."}),
    dict(id="confrontation", lieu="agence", type="entretien", bouton="Faire venir les quatre témoins du mercredi soir",
         titre="Le tableau de Karim", role="E", requiert=["dossier"],
         contenu="Paul les fait venir un par un : Hélène Garcin, Lucien Royer, Firmin Achard, Sandrine Mollet. Karim note les déclarations. "
                 "Sandrine décrit l'homme à qui elle a rendu la boule à 22 h 40. À vous de remplir le tableau.",
         revele=["p:helene", "p:royer", "p:firmin", "p:sandrine"],
         puzzle=dict(type="Tableau de recoupement", objet="Quatre témoins, un menteur",
                     solution="Royer ment : il était au canal avec la lampe. Hélène était aux Arcades avec les clés du moulin.",
                     donne=["d:cles_moulin"], aide="Karim montre que Royer et Sandrine disent tous les deux avoir eu la boule.")),
    dict(id="portrait", lieu="agence", type="investigation", bouton="Composer le portrait-robot avec Yves",
         titre="Le portrait-robot", role="E", requiert=["confrontation", "poursuite"],
         contenu="Deux témoins : Sandrine, qui l'a vu jouer de jour et lui a rendu sa boule, et Karim, qui l'a vu à la lueur d'une bougie. "
                 "Chacun se trompe sur un trait. Le portrait fini, Yves le pose à côté de la photo de Garcin en 1992.",
         revele=[], repond={"Q3": "Le visage de Royer, moustache en moins, est celui de Garcin."},
         puzzle=dict(type="Portrait-robot", objet="Six traits, deux témoins qui ne sont pas d'accord",
                     solution="Cheveux courts et gris, front haut et ridé, yeux enfoncés, nez cassé, bouche fine sans moustache, menton carré à fossette.",
                     donne=["d:portrait_robot"], aide="Yves tranche les deux désaccords : la moustache vient du journal de 1992, le blanc vient de la bougie.")),

    # ---------------- Gendarmerie ----------------
    dict(id="montagne", lieu="gendarmerie", type="entretien", bouton="Rencontrer l'adjudant-chef Montagne",
         titre="L'adjudant-chef Montagne", role="F",
         contenu="« Un ivrogne qui tombe dans un canal, ça n'a rien d'occulte. » 1,8 g d'alcool. Pas d'analyse : « Pour quoi faire ? » "
                 "C'est le Dr Sauvan qui a constaté le décès.",
         revele=["p:montagne", "p:sauvan"]),
    dict(id="dossier", lieu="gendarmerie", type="investigation", bouton="Lire le dossier, puisqu'il n'y a rien à cacher",
         titre="Le dossier de la gendarmerie", role="E",
         contenu="Porte du moulin fermée à clé, trousseau de Chabert au clou à l'intérieur, porte du bief ouverte, vanne ouverte. "
                 "Une lampe de poche sur la berge, marquée « Camping des Saules ». L'enquête de voisinage : quatre personnes dehors vers 22 h, et quatre faits sûrs.",
         revele=["d:lampe", "d:pv", "p:helene", "p:firmin", "p:sandrine", "p:gaston", "p:fredo", "p:josiane", "p:sauvan",
                 "l:arcades", "l:canal", "l:camping_saules"],
         repond={"Q1": "La vanne a été ouverte cette nuit-là, alors que le trousseau du meunier était resté au clou."}),

    # ---------------- Cabinet du Dr Sauvan ----------------
    dict(id="sauvan", lieu="cabinet_sauvan", type="entretien", bouton="Consulter le Dr Sauvan",
         titre="Le Dr Sauvan", role="E",
         contenu="Mort entre 23 h et 1 h, pas avant. Pas de vase sous les ongles, pas d'écorchures : « Un noyé se débat. Lui, non. Il dormait. » "
                 "Elle a gardé un tube de sang et l'a envoyé à un laboratoire de Lyon, à ses frais. Résultat mardi.",
         revele=["p:sauvan"], repond={"Q1": "Chabert est mort après 23 h, endormi."}),
    dict(id="labo", lieu="cabinet_sauvan", type="investigation", bouton="Rappeler le Dr Sauvan pour l'analyse",
         titre="L'analyse du laboratoire", role="U", requiert=["sauvan"], des_le=12,
         contenu="Du nitrazépam, à forte dose, avec l'alcool. Du Mogadon : « Un somnifère de vieille dame. On en vend à la pharmacie du Pont. »",
         revele=["d:analyse", "l:pharmacie", "p:roux"], repond={"Q1": "Chabert a été drogué au Mogadon."}),

    # ---------------- Pharmacie ----------------
    dict(id="pharmacie", lieu="pharmacie", type="entretien", bouton="Parler à la pharmacienne",
         titre="Mme Roux, pharmacienne", role="U", requiert=["labo"],
         contenu="Elle ne parle pas de ses clients. Puis elle dit que Mme Garcin est venue le jeudi 16 à 8 h 30 renouveler son Mogadon, dix jours en avance : "
                 "« Elle avait renversé la boîte dans l'évier. »",
         revele=["p:roux"], repond={"Q1": "Hélène a renouvelé son Mogadon en avance le lendemain matin."}),

    # ---------------- Hôtel ----------------
    dict(id="vasseur", lieu="hotel", type="entretien", bouton="Rencontrer l'inspecteur de la Mutuelle",
         titre="Jean-Claude Vasseur, de la Mutuelle rhodanienne", role="U",
         contenu="1,4 million versé à Hélène en décembre 1993. Si Garcin est vivant, tout doit être remboursé. Si la veuve savait, c'est l'escroquerie : la prison. "
                 "Chabert l'a appelé le 14 juin pour savoir ce que risque un faux témoin.",
         revele=["p:vasseur", "d:assurance"], repond={"Q2": "Si Garcin est vivant, Hélène perd 1,4 million et risque la prison."}),

    # ---------------- Café des Arcades ----------------
    dict(id="fredo", lieu="arcades", type="entretien", bouton="Parler au serveur",
         titre="Fredo, serveur aux Arcades", role="U",
         contenu="Mme Garcin, mercredi, une menthe à l'eau, les yeux sur la porte. Partie à 22 h 45 sans finir son verre, vers le pont roman. "
                 "« Le vieux de la pension, lui, il lit son journal sur le pont tous les soirs. »",
         revele=["p:fredo", "p:helene", "p:firmin", "l:pont"], repond={"Q1": "Hélène a quitté les Arcades à 22 h 45, vers le pont roman."}),

    # ---------------- Maison d'Hélène Garcin ----------------
    dict(id="helene", lieu="maison_garcin", type="entretien", bouton="Rendre visite à Hélène Garcin",
         titre="Hélène Garcin, la veuve", role="E",
         contenu="« Jacques est mort. La rivière ne rend rien. » Elle a fait suspendre le journal. Mercredi, elle attendait aux Arcades « une amie qui n'est pas venue », "
                 "puis elle est rentrée. Les clés du moulin ? Rendues à Aimé en mai. Un monsieur de la Mutuelle est à l'hôtel de la Place.",
         revele=["p:helene", "p:vasseur", "l:hotel"]),
    dict(id="maison", lieu="maison_garcin", type="investigation", bouton="Revenir quand Hélène est à la boutique",
         titre="La maison des Garcin", role="E", requiert=["helene"],
         contenu="Julien, le fils, vous fait entrer. Dans le secrétaire : la lettre de la Mutuelle (1,4 million), "
                 "et un carnet de souches de mandats, 1 500 francs par mois depuis novembre 1992, à « L. Royer, poste restante, Buis-les-Baronnies ».",
         revele=["d:assurance", "d:mandats"], repond={"Q5": "Hélène envoie de l'argent à « L. Royer » depuis novembre 1992.", "Q2": "1,4 million de la Mutuelle."}),
    dict(id="helene2", suite="helene", bouton_seul="Interroger Hélène Garcin sur l'heure de son départ", titre_seul="Hélène Garcin, face à l'heure",
         lieu="maison_garcin", type="entretien", bouton="Revenir voir Hélène avec l'heure de son départ",
         titre="Hélène, second entretien", role="U", requiert_un=["fredo", "isnard"],
         contenu="Elle ne nie pas longtemps. Elle est allée au moulin « parler à Aimé », la porte était fermée, elle est repartie. Elle a encore les clés de la boutique. "
                 "Elle ne demande pas ce que vous savez. Elle demande si les enfants seront au courant.",
         revele=[], repond={"Q1": "Hélène est allée au moulin vers 23 h, avec ses clés."}),

    # ---------------- Pension des Forts ----------------
    dict(id="firmin", lieu="pension", type="entretien", bouton="Payer un pastis à Firmin Achard",
         titre="Firmin Achard", role="F", jusqu_a=12,
         contenu="Un vieil homme en chemise blanche, boules de pétanque dans une sacoche de cuir. Il donne l'heure à la minute près, et ne dit rien d'utile. "
                 "« Je prends le frais sur le pont, comme tous les vieux. » Il part mardi.",
         revele=["p:firmin", "l:pont"]),
    dict(id="chambre_firmin", lieu="pension", type="investigation", bouton="Ouvrir l'enveloppe laissée par M. Achard",
         titre="Les notes de Firmin Achard", role="U", des_le=12,
         contenu="Parti ce matin. Il a laissé pour le Bureau un carnet à couverture noire, une salamandre dans les flammes sur la première page. "
                 "Mercredi 15 : deux hommes sur la berge à 22 h 05, l'homme aux boules part en courant à 22 h 32, "
                 "une femme entre au moulin avec une clé à 23 h 05, la vanne gronde à 23 h 12, elle ressort seule à 23 h 27.",
         revele=["d:carnet_firmin"], repond={"Q1": "Une femme est entrée au moulin à 23 h 05 et en est ressortie seule.", "BONUS": "La salamandre sur le carnet de Firmin."}),

    # ---------------- Moulin Chabert ----------------
    dict(id="josiane", lieu="moulin", type="entretien", bouton="Parler à Josiane, la femme de ménage",
         titre="Josiane Pellegrin, femme de ménage", role="U",
         contenu="Les deux verres rincés, retournés sur l'égouttoir : « Monsieur Aimé n'a jamais rincé un verre de sa vie. » "
                 "Samedi 11, une jeune femme est venue crier. Et Mme Hélène a toujours sa clé de la boutique, « pardi, elle y travaille ».",
         revele=["p:josiane", "p:sandrine"], repond={"Q1": "Quelqu'un a bu avec Chabert au moulin, puis a rincé les verres."}),
    dict(id="moulin", lieu="moulin", type="investigation", bouton="Visiter le moulin",
         titre="Le moulin Chabert", role="U",
         contenu="La salle des meules, la bouteille de marc, le clou du trousseau, la petite porte, la porte du bief et la passerelle. "
                 "Dans la corbeille du bureau, un brouillon déchiré : « En septembre 1992, j'ai menti aux gendarmes. Jacques… »",
         revele=["d:brouillon", "l:canal"], repond={"Q4": "Chabert a écrit qu'il avait menti en 1992."}),

    # ---------------- Canal ----------------
    dict(id="isnard", lieu="canal", type="entretien", bouton="Trouver l'aiguadier du canal",
         titre="Norbert Isnard, aiguadier", role="E",
         contenu="La vanne du moulin a été ouverte vers 23 h 10 : son niveau l'a enregistré. Le cadenas était refermé. « Ça s'ouvre pas sans clé. » "
                 "Deux clés : la sienne, et celle du trousseau du moulin, qui a une copie, à la boutique.",
         revele=["p:isnard"], repond={"Q1": "La vanne a été ouverte et refermée à clé vers 23 h 10, avec la copie de la boutique."}),
    dict(id="berge", lieu="canal", type="investigation", bouton="Examiner la berge",
         titre="La berge du canal", role="U",
         contenu="L'herbe couchée là où on a trouvé la lampe, deux paires de chaussures. D'ici, on voit le parapet du pont roman : "
                 "quelqu'un, là-haut, voit tout le canal et la porte du bief.",
         revele=["l:pont"]),

    # ---------------- Pont roman ----------------
    dict(id="pont", lieu="pont", type="investigation", bouton="Monter sur le pont roman",
         titre="Le pont roman", role="U",
         contenu="Sur le parapet, de la cendre de pipe, et un Drômois du 15 juin plié en quatre. Gravé à la pointe dans la pierre, tout frais, un petit lézard dans des flammes.",
         revele=["p:firmin"]),

    # ---------------- Boulodrome ----------------
    dict(id="gaston", lieu="boulodrome", type="entretien", bouton="Parler au cantonnier",
         titre="Gaston Rey, cantonnier", role="U",
         contenu="Royer « tire à la lyonnaise, les bras tendus, on voit qu'il est pas d'ici ». Il travaille chez Tardieu, aux Pilles. "
                 "Mercredi vers 22 h, une femme seule cherchait quelque chose par terre, avec un briquet.",
         revele=["p:gaston", "l:ferme_tardieu", "p:sandrine"]),
    dict(id="inscription", lieu="boulodrome", type="investigation", bouton="Consulter la feuille d'inscription du concours",
         titre="La feuille du Grand Prix", role="U",
         contenu="Doublette n° 23 : Tardieu R., et à côté, de sa main, « Ga » raturé, puis « Royer L. ». Il a commencé à écrire un autre nom.",
         revele=["d:feuille_concours"], repond={"Q3": "Royer a commencé à signer « Ga »."}),

    # ---------------- Camping municipal ----------------
    dict(id="sandrine", lieu="camping_municipal", type="entretien", bouton="Aller voir Sandrine Mollet",
         titre="Sandrine Mollet, saisonnière", role="U",
         contenu="Les doigts rouges de jus de cerise. Elle est de Roanne, elle fait les saisons. Mercredi soir, elle cherchait sa montre sur la Digue. "
                 "Elle ne regarde jamais en face.",
         revele=["p:sandrine"], repond={"Q6": "Les doigts tachés de jus de cerise, comme la page envoyée au Bureau."}),
    dict(id="tente", lieu="camping_municipal", type="investigation", bouton="Jeter un œil à la tente de Sandrine",
         titre="La tente de Sandrine", role="F",
         contenu="Épinglée à la toile, la photo de Garcin découpée dans le journal de 1992, les yeux grattés au couteau. Un papier : « Chabert, moulin, samedi ». "
                 "Une boîte à montre vide, marquée « Thierry ». Un bloc de papier à lettres, et un stylo bille qui troue le papier.",
         revele=[], repond={"Q6": "Le même papier que la lettre anonyme."}),
    dict(id="sandrine2", suite="sandrine", bouton_seul="Parler de Thierry Mollet à Sandrine", titre_seul="Sandrine Mollet et son frère",
         lieu="camping_municipal", type="entretien", bouton="Revenir voir Sandrine pour Thierry Mollet",
         titre="Sandrine, second entretien", role="E", requiert_un=["odile", "tente", "plaque"],
         contenu="Thierry était son frère. Elle a reconnu Garcin sur la photo, elle est allée voir Chabert le samedi, elle a écrit au Bureau. "
                 "La dernière carte postale de Thierry : « On est au fond, sous les saules. Le patron a dit qu'on ferait l'inscription demain. »",
         revele=["d:carte_thierry"], repond={"Q6": "Sandrine a écrit la lettre au Bureau.", "Q4": "La caravane de Thierry n'était pas inscrite au registre."}),

    # ---------------- Ferme Tardieu ----------------
    dict(id="tardieu", lieu="ferme_tardieu", type="entretien", bouton="Rencontrer Raoul Tardieu",
         titre="Raoul Tardieu, arboriculteur", role="X",
         contenu="Royer travaille chez lui depuis mars 1993, payé en liquide. Mercredi, Tardieu a entendu sa mobylette rentrer à 23 h. "
                 "« Le soir, il part vers Vaison. Au camping des Saules, à ce qu'on dit. »",
         revele=["p:tardieu", "p:royer", "l:camping_saules"], repond={"Q1": "Royer était rentré aux Pilles à 23 h."}),
    dict(id="royer", lieu="ferme_tardieu", type="entretien", bouton="Parler à Lucien Royer",
         titre="Lucien Royer", role="U",
         contenu="Casquette, mains abîmées. « Je m'appelle Royer. Je suis de Givors. » Le canal ? Jamais. Mercredi, il cherchait une boule oubliée sur la Digue.",
         revele=["p:royer"]),
    dict(id="royer2", suite="royer", bouton_seul="Confronter Lucien Royer à son mensonge", titre_seul="Lucien Royer, face au tableau",
         lieu="ferme_tardieu", type="entretien", bouton="Revenir voir Royer avec le tableau de Karim",
         titre="Royer, second entretien", role="E", requiert_puzzle=["confrontation"],
         contenu="Il était au canal. « Aimé voulait tout dire. » Il dit Aimé, pas Chabert. Il l'a supplié d'attendre. À 22 h 30, il a vu quelqu'un sur le pont, "
                 "il a lâché la lampe et il est parti. « Quand je suis parti, il était vivant. Il pleurait. »",
         revele=[], repond={"Q1": "Chabert était vivant à 22 h 30, quand Royer est parti."}),
    dict(id="royer3", suite="royer2", bouton_seul="Montrer le portrait-robot à Lucien Royer", titre_seul="Lucien Royer, face au portrait",
         lieu="ferme_tardieu", type="entretien", bouton="Montrer le portrait-robot à Royer",
         titre="Jacques Garcin", role="E", requiert=["royer2"], requiert_puzzle=["portrait"],
         contenu="Il enlève sa casquette. Il est Jacques Garcin. La caravane du 31, oubliée. Aimé l'a trouvé dans la boue et a menti pour lui. "
                 "Le lendemain, il a appelé Hélène depuis Malaucène. Elle a dit : « Tu es mort. Reste mort. » Il n'encaisse plus ses mandats.",
         revele=["p:garcin"], repond={"Q3": "Royer avoue être Garcin.", "Q4": "Il a oublié la caravane du 31 ; Chabert a menti pour lui.",
                                      "Q5": "Hélène sait depuis le lendemain de la crue."}),
    dict(id="cabanon", lieu="ferme_tardieu", type="investigation", bouton="Fouiller le cabanon de Royer",
         titre="Le cabanon de Royer", role="U", requiert=["royer"],
         contenu="Un lit de camp, une photo de deux enfants. Trois boules lyonnaises en bronze, gravées « J.G. ». "
                 "Dans une boîte à sucre, dix-neuf mandats non encaissés, expéditeur « H. Garcin, Nyons ».",
         revele=["d:boules", "d:mandats"], repond={"Q3": "Les boules de Royer sont gravées J.G.", "Q5": "Hélène envoie les mandats, il ne les encaisse pas."}),

    # ---------------- Camping des Saules ----------------
    dict(id="poursuite", lieu="camping_saules", type="investigation", bouton="Guetter la nuit au camping des Saules",
         titre="La nuit aux Saules", role="E", requiert_un=["tardieu", "rosa"],
         contenu="Karim et Yves attendent dans les ruines. Une mobylette, une bougie dans un bocal posée à l'emplacement 31. "
                 "Karim voit son visage à la flamme. Puis il faut décider, vite : rester caché, le suivre, lui barrer la route ou lui sauter dessus.",
         revele=[],
         puzzle=dict(type="Poursuite en temps limité", objet="Un choix, huit secondes",
                     solution="Aucune mauvaise réponse : chaque choix apprend autre chose. Lui sauter dessus coûte une journée (Karim en garde à vue).",
                     donne=["d:temoignage_karim"], aide="Sans réponse, Karim reste caché.")),
    dict(id="ruines", lieu="camping_saules", type="investigation", bouton="Visiter les ruines en plein jour",
         titre="Les ruines du camping", role="U",
         contenu="Le bloc sanitaire sans toit, le panneau de l'accueil. Au fond, sous les saules, une croix de branches et deux prénoms gravés : Thierry, Nathalie. "
                 "Des fleurs fraîches. Quelqu'un sait exactement où était la caravane.",
         revele=[], repond={"Q4": "Quelqu'un vient fleurir l'emplacement exact de la caravane."}),

    # ---------------- Mémorial ----------------
    dict(id="rosa", lieu="memorial", type="entretien", bouton="Parler à Rosa Bérenger",
         titre="Rosa Bérenger", role="F",
         contenu="Son mari Marius est mort dans la crue. Elle l'a vu au marché, jeudi dernier. « La rivière rend ses morts, monsieur. » "
                 "La nuit, elle voit une lumière au camping des Saules.",
         revele=["p:rosa", "l:camping_saules"]),
    dict(id="plaque", lieu="memorial", type="investigation", bouton="Lire la plaque du souvenir",
         titre="La plaque du souvenir", role="U",
         contenu="Les noms des morts de 1992. « Jacques Garcin, mort en portant secours », avec un médaillon : la photo, la moustache. "
                 "Plus bas : Thierry Mollet, Nathalie Brun. Un bouquet, une carte : « Pardon. » Sans signature.",
         revele=["d:coupure_1992"], repond={"Q3": "La photo de Garcin en 1992, pour comparer."}),
]

QUESTIONS = {
    "Q1": "Qui a tué Aimé Chabert ? (Hélène Garcin, qui l'endort et le pousse dans le bief)",
    "Q2": "Pourquoi ? (Chabert allait tout dire, et elle aurait perdu l'assurance-vie)",
    "Q3": "Qui est Lucien Royer ? (Jacques Garcin)",
    "Q4": "Que s'est-il passé le soir de la crue ? (Garcin a oublié la caravane ; Chabert a menti)",
    "Q5": "Qui savait que Garcin était vivant ? (Hélène, depuis le premier jour)",
    "Q6": "Qui a écrit au Bureau ? (Sandrine Mollet)",
    "BONUS": "Qui porte la salamandre ? (Firmin Achard)",
}

# Le chemin de référence : le plus court pour répondre à tout.
# La lettre du meunier, gratuite, arrive le lundi : elle ne compte pas.
REFERENCE = ["dossier", "confrontation", "tardieu", "poursuite", "portrait", "royer2", "royer3",
             "isnard", "sauvan", "helene", "lettre_chabert", "maison", "odile", "sandrine2"]

PISTES_ACCORDEES = 20
PAR_JOUR = 4

# ------------------------------------------------------------------ contrôles
P = {c["id"]: c for c in PISTES}
erreurs = []

def cles_connues(lues):
    k = set(DEPART)
    for cid in lues:
        k.update(P[cid]["revele"])
        k.add("l:" + P[cid]["lieu"])
        pz = P[cid].get("puzzle")
        if pz: k.update(pz["donne"])   # puzzle résolu (ou aide demandée)
    for key in list(k):
        if key.startswith("p:") and key[2:] not in SANS_ADRESSE:
            k.add("l:" + PERSONNES[key[2:]][1])   # le joueur tape le nom au Minitel si besoin
    return k

def depensees(lues):
    return sum(1 for cid in lues if not P[cid].get("gratuit"))

def accessible(cid, lues, temps=None):
    c = P[cid]
    t = depensees(lues) if temps is None else temps
    if "l:" + c["lieu"] not in cles_connues(lues): return False
    if any(x.get("suite") == cid and x["id"] in lues for x in PISTES): return False
    if any(r not in lues for r in c.get("requiert", [])): return False
    if c.get("requiert_un") and not any(r in lues for r in c["requiert_un"]): return False
    if any(r not in lues for r in c.get("requiert_puzzle", [])): return False   # puzzle résolu quand la piste est lue
    if c.get("des_le") is not None and t < c["des_le"]: return False
    if c.get("jusqu_a") is not None and t >= c["jusqu_a"]: return False
    return True

for c in PISTES:
    if c["lieu"] not in LIEUX: erreurs.append(f"{c['id']} : lieu inconnu {c['lieu']}")
    for r in c.get("requiert", []) + c.get("requiert_un", []) + c.get("requiert_puzzle", []):
        if r not in P: erreurs.append(f"{c['id']} : requiert une piste inconnue {r}")
    for key in c["revele"] + (c.get("puzzle") or {}).get("donne", []):
        t, i = key.split(":")
        if (t == "l" and i not in LIEUX) or (t == "p" and i not in PERSONNES):
            erreurs.append(f"{c['id']} : révèle {key} inconnu")
for pid, (_, lieu) in PERSONNES.items():
    if lieu not in LIEUX: erreurs.append(f"personne {pid} : lieu inconnu")

# tout est atteignable (en jouant tôt ce qui disparaît, tard ce qui arrive tard)
lues = []
change = True
while change:
    change = False
    for c in PISTES:
        if c["id"] not in lues and accessible(c["id"], lues, temps=min(depensees(lues), 11) if c.get("jusqu_a") else 99):
            lues.append(c["id"]); change = True
for c in PISTES:
    if c["id"] not in lues: erreurs.append(f"piste inaccessible : {c['id']}")
k = cles_connues(lues)
for l in LIEUX:
    if "l:" + l not in k: erreurs.append(f"lieu jamais révélé : {l}")
for p in PERSONNES:
    if "p:" + p not in k: erreurs.append(f"personne jamais révélée : {p}")

# le chemin de référence est jouable dans l'ordre et répond à tout
faites = []
for cid in REFERENCE:
    if not accessible(cid, faites): erreurs.append(f"chemin de référence : {cid} pas encore accessible à ce moment")
    faites.append(cid)
for q in QUESTIONS:
    if q != "BONUS" and not any(q in P[c].get("repond", {}) for c in REFERENCE):
        erreurs.append(f"chemin de référence : aucune réponse à {q}")
if depensees(REFERENCE) >= PISTES_ACCORDEES:
    erreurs.append("le chemin de référence consomme toutes les pistes accordées")

for c in PISTES:
    if c.get("puzzle") and not c["puzzle"].get("aide"):
        erreurs.append(f"{c['id']} : puzzle sans aide, il pourrait bloquer l'enquête")
for q in QUESTIONS:
    src = [c["id"] for c in PISTES if q in c.get("repond", {})]
    if q != "BONUS" and len(src) < 2: erreurs.append(f"{q} : une seule source ({src})")

# ------------------------------------------------------------------ document
ROLE = {"E": "Essentielle", "U": "Utile", "X": "Élimine un suspect", "F": "Fausse piste"}
JOURS = ["vendredi", "samedi", "lundi", "mardi", "mercredi"]
nom = lambda key: (LIEUX[key[2:]][0] if key[0] == "l" else PERSONNES[key[2:]][0] if key[0] == "p" else key[2:].replace("_", " "))

def quand(c):
    out = []
    if c.get("des_le") is not None: out.append(f"à partir du {JOURS[c['des_le'] // PAR_JOUR]}")
    if c.get("jusqu_a") is not None: out.append(f"jusqu'au {JOURS[c['jusqu_a'] // PAR_JOUR - 1]} soir")
    if c.get("gratuit"): out.append("gratuite")
    return out

md = []
md.append("# Le noyé de l'Ouvèze : la carte des pistes\n")
md.append("Nyons, juin 1994. Document de conception, jamais montré au joueur. À lire avec « 1-verite.md » et « 2-personnages.md ».\n")
md.append("Généré par `carte.py`, qui vérifie aussi la cohérence de l'enquête. Pour modifier la carte, modifier `carte.py` puis le relancer.\n")

md.append("## En chiffres\n")
nb = {r: sum(1 for c in PISTES if c["role"] == r) for r in ROLE}
md.append("| | |\n| --- | --- |")
md.append(f"| Lieux | {len(LIEUX)} ({sum(1 for k in DEPART if k.startswith('l:')) + 1} connus au départ) |")
md.append(f"| Personnages | {len(PERSONNES)} |")
md.append(f"| Pistes écrites | {len(PISTES)}, dont {sum(1 for c in PISTES if c.get('requiert') or c.get('requiert_un') or c.get('requiert_puzzle'))} à débloquer et {sum(1 for c in PISTES if quand(c))} liées au calendrier |")
md.append(f"| Rôle des pistes | {nb['E']} essentielles, {nb['U']} utiles, {nb['X']} qui élimine un suspect, {nb['F']} fausses pistes |")
md.append(f"| Pistes accordées au joueur | {PISTES_ACCORDEES} (5 jours de 4 créneaux) |")
md.append(f"| Chemin de référence | {depensees(REFERENCE)} pistes, plus la lettre du meunier, gratuite |\n")

md.append("## Ce que le joueur connaît au départ\n")
md.append("L'intro contient la lettre anonyme en entier, la page du *Drômois* avec la photo du concours, et la brève sur la noyade. "
          "Le plan montre l'agence du *Drômois*, le moulin, la gendarmerie, le boulodrome de la Digue et la maison des Garcin. "
          "Tardieu se cherche au Minitel ; Royer n'a pas le téléphone.\n")

md.append("## Le calendrier\n")
md.append("Vendredi 17, samedi 18, lundi 20, mardi 21 (fête de la musique), mercredi 22 juin. Bouclage le jeudi 23 à 18 h, page le samedi 25. "
          "Certaines pistes dépendent du jour :\n")
for c in PISTES:
    if quand(c): md.append(f"- **{c['titre']}** : {', '.join(quand(c))}.")
md.append("")

md.append("## Les seconds entretiens (ce qui débloque quoi)\n")
md.append("| Piste débloquée | Il faut avoir lu |\n| --- | --- |")
for c in PISTES:
    cond = []
    if c.get("requiert"): cond.append(" et ".join(P[r]["titre"] for r in c["requiert"]))
    if c.get("requiert_un"): cond.append(" ou ".join(P[r]["titre"] for r in c["requiert_un"]))
    if c.get("requiert_puzzle"): cond.append(" et ".join(P[r]["titre"] + " (résolu)" for r in c["requiert_puzzle"]))
    if cond: md.append(f"| {c['titre']} | {' ; '.join(cond)} |")
md.append("")

md.append("## Les pistes, lieu par lieu\n")
for lid, (lnom, q) in LIEUX.items():
    md.append(f"### {lnom} ({QUARTIERS[q]})\n")
    for c in [c for c in PISTES if c["lieu"] == lid]:
        tete = f"**{c['bouton']}** · {c['type']} · {ROLE[c['role']]}"
        if c.get("requiert"): tete += f" · après : {', '.join(P[r]['titre'] for r in c['requiert'])}"
        if c.get("requiert_un"): tete += f" · après : {' ou '.join(P[r]['titre'] for r in c['requiert_un'])}"
        if c.get("requiert_puzzle"): tete += f" · puzzle résolu : {', '.join(P[r]['titre'] for r in c['requiert_puzzle'])}"
        if quand(c): tete += " · " + ", ".join(quand(c))
        md.append(f"- {tete}  \n  {c['contenu']}")
        if c["revele"]:
            md.append(f"  \n  *Révèle :* {', '.join(nom(k) for k in c['revele'])}.")
        if c.get("repond"):
            md.append(f"  \n  *Sert à :* " + " ; ".join(f"{q} ({t})" for q, t in c["repond"].items()))
    md.append("")

md.append("## Les puzzles\n")
md.append("Résoudre un puzzle est gratuit, c'est ouvrir la piste qui coûte. En cas de blocage, un membre de l'équipe aide contre une piste. Aucun puzzle ne peut bloquer l'enquête.\n")
md.append("| Piste | Type | Objet | Solution | Aide |\n| --- | --- | --- | --- | --- |")
for c in PISTES:
    pz = c.get("puzzle")
    if pz:
        md.append(f"| {c['titre']} | {pz['type']} | {pz['objet']} | {pz['solution']} | {pz['aide']} |")
md.append("")
md.append("## Le Minitel\n")
md.append("Pour ceux-ci, l'adresse ne se trouve qu'au Minitel :\n")
for pid, txt in MINITEL.items():
    md.append(f"- **{PERSONNES[pid][0]}** : « {txt} »")
md.append("")

md.append("## Le chemin de référence\n")
md.append(f"Le chemin le plus court pour répondre à toutes les questions : {depensees(REFERENCE)} pistes, plus la lettre du meunier qui arrive gratuitement le lundi. "
          f"Le joueur en a {PISTES_ACCORDEES}, soit {PISTES_ACCORDEES - depensees(REFERENCE)} de marge pour les détours.\n")
for i, cid in enumerate(REFERENCE, 1):
    c = P[cid]
    md.append(f"{i}. **{c['titre']}** ({LIEUX[c['lieu']][0]}){' · gratuite' if c.get('gratuit') else ''}")
md.append("")

md.append("## Les recoupements, question par question\n")
for q, texte in QUESTIONS.items():
    md.append(f"### {q}. {texte}\n")
    for c in PISTES:
        if q in c.get("repond", {}):
            md.append(f"- **{c['titre']}** : {c['repond'][q]}")
    md.append("")

md.append("## Les fausses pistes\n")
for c in PISTES:
    if c["role"] in ("F", "X"):
        md.append(f"- **{c['titre']}** ({ROLE[c['role']].lower()})")
md.append("")

(ICI / "3-carte-des-pistes.md").write_text("\n".join(md), encoding="utf-8")

print(f"{len(PISTES)} pistes, {len(LIEUX)} lieux, {len(PERSONNES)} personnages.")
print(f"Chemin de référence : {depensees(REFERENCE)} pistes (+ gratuites) sur {PISTES_ACCORDEES} accordées.")
for q in QUESTIONS:
    print(f"  {q} : {sum(1 for c in PISTES if q in c.get('repond', {}))} sources")
print(("ERREURS :\n  " + "\n  ".join(erreurs)) if erreurs else "Aucune erreur.")
sys.exit(1 if erreurs else 0)
