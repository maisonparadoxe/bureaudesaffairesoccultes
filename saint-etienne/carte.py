# Carte des pistes de l'affaire de Saint-Étienne (« Le feu de Ferréol »).
# Source unique : ce fichier produit 3-carte-des-pistes.md et vérifie la
# cohérence de l'enquête (accès aux pistes, chemin idéal, recoupements).
#   python3 carte.py

import json, sys, pathlib

ICI = pathlib.Path(__file__).parent

QUARTIERS = {
    "centre": "Centre-ville",
    "chateaucreux": "Châteaucreux",
    "tarentaize": "Tarentaize",
    "soleil": "Le Soleil",
    "zone_industrielle": "Zone industrielle",
    "montreynaud": "Montreynaud",
    "vallee_gier": "Vallée du Gier",
    "bellevue": "Bellevue",
}

LIEUX = {
    "redaction": ("Rédaction du Stéphanois", "centre"),
    "mairie": ("Mairie, service urbanisme", "centre"),
    "cabinet_vallenot": ("Cabinet Groupe Vallenot", "centre"),
    "commissariat": ("Commissariat central", "centre"),
    "cabinet_lacour": ("Cabinet du Dr Lacour", "centre"),
    "consigne_gare": ("Consigne de la gare de Châteaucreux", "chateaucreux"),
    "domicile_faure": ("Domicile des Faure", "tarentaize"),
    "site_ferreol": ("Ancienne Manufacture Ferréol", "soleil"),
    "cheval_noir": ("Café Le Cheval Noir", "soleil"),
    "siege_ferrand": ("Ferrand Frères BTP", "zone_industrielle"),
    "cite_mounier": ("Cité de Montreynaud, chez Mounier", "montreynaud"),
    "casse_berthet": ("Casse Berthet", "vallee_gier"),
    "decharge": ("Décharge agréée de la Croix-de-l'Orme", "vallee_gier"),
    "parking_relais": ("Chantier du parking-relais", "bellevue"),
}

PERSONNES = {
    "faure": ("Bernard Faure", "domicile_faure"),
    "colette": ("Colette Faure", "domicile_faure"),
    "ferrand": ("Roger Ferrand", "siege_ferrand"),
    "simone": ("Simone Ferrand", "siege_ferrand"),
    "vallenot": ("Hervé Vallenot", "cabinet_vallenot"),
    "roussillon": ("Marcel Roussillon", "mairie"),
    "bensaid": ("Ahmed Bensaïd", "site_ferreol"),
    "chaptal": ("Marcel Chaptal", "cheval_noir"),
    "jeannot": ("Jeannot, patron du Cheval Noir", "cheval_noir"),
    "mounier": ("Gérard Mounier", "cite_mounier"),
    "lacour": ("Dr Pierre Lacour", "cabinet_lacour"),
    "berthet": ("Lucien Berthet", "casse_berthet"),
    "igier": ("Lieutenant Bernard Igier", "commissariat"),
    "roche": ("Daniel Roche", "redaction"),
}

# Adresses à chercher au Minitel (action gratuite) : connaître le nom ne suffit pas.
MINITEL = {"berthet": "Casse Berthet, Rive-de-Gier", "mounier": "G. Mounier, Montreynaud", "lacour": "Dr P. Lacour, cours Fauriel"}

# Connu dès l'intro (la lettre du « fantôme » y est donnée en entier, gratuitement).
DEPART = ["l:redaction", "l:site_ferreol", "l:mairie", "l:commissariat", "p:faure"]

# Rôles : E = essentielle (sur le chemin idéal), U = utile (recoupe, confirme),
#         X = élimine un suspect, F = fausse piste
PISTES = [
    # ---------------- Rédaction ----------------
    dict(id="archives", lieu="redaction", type="investigation", bouton="Fouiller les archives du journal",
         titre="Les archives du Stéphanois", role="U",
         contenu="Articles sur le projet Ferréol : budget doublé en juillet, Ferrand Frères au gros œuvre, le Groupe Vallenot porte le projet, "
                 "même attelage sur le parking-relais. Une brève cite Marcel Chaptal, ancien de la CGT, opposé au projet, « qu'on trouve au Cheval Noir ».",
         revele=["l:cabinet_vallenot", "l:siege_ferrand", "l:parking_relais", "p:vallenot", "p:ferrand", "p:chaptal"]),
    dict(id="roche", lieu="redaction", type="entretien", bouton="Parler à Daniel Roche",
         titre="Daniel Roche, chef des faits divers", role="F",
         contenu="Hostile aux « Lyonnais ». Nie avoir reçu l'appel de Faure. Glisse que c'est « le petit Lacour » qui a constaté le décès.",
         revele=["p:roche", "p:lacour"]),
    dict(id="standard", lieu="redaction", type="investigation", bouton="Consulter le cahier du standard",
         titre="Le cahier de la standardiste", role="U", requiert=["roche"],
         contenu="Samedi 13 novembre, 16 h 40 : « M. Faure, urbanisme, pour les faits divers. Passé à M. Roche. » L'appel a duré quatre minutes.",
         revele=[]),
    dict(id="roche2", lieu="redaction", type="entretien", bouton="Revenir voir Roche avec le cahier",
         titre="Roche, second entretien", role="U", requiert=["standard"],
         contenu="Il finit par s'en souvenir. Faure lui a demandé : « C'est combien, pour vous, un dossier comme ça ? » Il a raccroché, persuadé d'avoir affaire à un escroc. "
                 "Il reconnaît aussi que le Groupe Vallenot achète une pleine page chaque semaine.",
         revele=[], repond={"Q2": "Faure voulait vendre son dossier, pas le donner."}),
    dict(id="odile", lieu="redaction", type="investigation", bouton="Appeler Odile aux archives du groupe",
         titre="Odile et le fondeur de 1911", role="U",
         contenu="La légende du fondeur tombé dans la coulée en 1911, articles d'époque à l'appui. On n'a jamais retrouvé le corps. "
                 "Et une brève de 1987 : Paul Ferrand, frère de Roger, mort écrasé sous une banche. C'est la piste de Karim pour le fantôme ; la date de la mort de Paul (14 mars 1987) servira pour le coffre.",
         revele=[]),
    dict(id="tirages", lieu="redaction", type="investigation", bouton="Récupérer les tirages d'Yves",
         titre="Les tirages d'Yves", role="E", requiert=["reperage"],
         contenu="Photos prises le 17 au matin : le slogan « FERRÉOL NE SERA PAS UN PARKING » sur le mur est, peinture encore brillante, coulures fraîches. "
                 "Les mêmes mots que dans la lettre du « fantôme ».",
         revele=[], repond={"Q6": "Même formule que la lettre, peinte la nuit du drame."}),

    # ---------------- Mairie ----------------
    dict(id="roussillon", lieu="mairie", type="entretien", bouton="Rencontrer Marcel Roussillon",
         titre="Marcel Roussillon, adjoint à l'urbanisme", role="F",
         contenu="Jamais « je », toujours « on ». Il précise de lui-même qu'« on était en conseil jusqu'à dix heures et demie » ce soir-là, ce qu'on ne lui demandait pas. "
                 "Chevalière en or gravée d'une salamandre.",
         revele=["p:roussillon"], repond={"BONUS": "La salamandre sur la chevalière de Roussillon."}),
    dict(id="dossier", lieu="mairie", type="investigation", bouton="Consulter le dossier Ferréol",
         titre="Le dossier de reconversion", role="E",
         contenu="Plan de dépollution : 3 000 tonnes de terres polluées à évacuer vers la décharge agréée de la Croix-de-l'Orme. "
                 "Budget passé de 4 à 8,2 millions de francs, délibération signée Roussillon, 1,3 million versé à la SCI Delombre.",
         revele=["p:roussillon", "l:decharge", "d:dossier_ferreol", "d:sci_delombre"], repond={"Q4": "3 000 tonnes prévues."}),
    dict(id="conseil", lieu="mairie", type="investigation", bouton="Lire le compte rendu du conseil municipal",
         titre="Le conseil municipal du 16 novembre", role="X",
         contenu="Séance levée à 22 h 30. Roussillon est intervenu à 22 h 15 sur le budget des cantines. Il ne pouvait pas être à Ferréol.",
         revele=[]),
    dict(id="facture_tel", lieu="mairie", type="investigation", bouton="Demander la facture de la ligne du site",
         titre="La facture détaillée de la cabane du gardien", role="U", requiert=["bensaid2"],
         contenu="La ligne de la cabane est payée par la ville. Une trentaine d'appels sur le mois, dont un seul la nuit : mardi 16 novembre, 22 h 24, 3 minutes, vers un radiotéléphone.",
         revele=["d:facture_tel"], repond={"Q3": "Quelqu'un a appelé un radiotéléphone depuis le site, juste après la chute."},
         puzzle=dict(type="Comparer des documents", objet="Une trentaine d'appels sur la facture",
                     solution="Le joueur repère l'appel de 22 h 24 et reconnaît le numéro de la carte de visite de Vallenot.",
                     donne=[], aide="Karim épluche la facture et entoure l'appel de 22 h 24.",
                     note="Ne s'affiche comme résolu que si le joueur a aussi la carte de Vallenot.")),

    # ---------------- Cabinet Vallenot ----------------
    dict(id="vallenot", lieu="cabinet_vallenot", type="entretien", bouton="Rencontrer Hervé Vallenot",
         titre="Hervé Vallenot, le promoteur", role="U",
         contenu="Tout est « beau ». Dit ne connaître le dossier que de loin. Le 16 au soir : dîner seul, sa femme était à Lyon. "
                 "En partant, il vous tend sa carte, avec son numéro de radiotéléphone.",
         revele=["p:vallenot", "d:carte_vallenot"], repond={"Q3": "Le numéro du radiotéléphone de Vallenot."}),
    dict(id="bureau_vallenot", lieu="cabinet_vallenot", type="investigation", bouton="Profiter de l'absence de la secrétaire",
         titre="Le bureau de Vallenot", role="E",
         contenu="Une facture de 1,3 million de la SCI Delombre, sans livrable. Et sur le bureau, une boîte de cigarillos hollandais à embout de plastique blanc.",
         revele=["d:facture_delombre", "d:cigarillos"], repond={"Q3": "Les mêmes cigarillos que les mégots trouvés près du corps."}),

    # ---------------- Commissariat ----------------
    dict(id="igier", lieu="commissariat", type="entretien", bouton="Retrouver Igier au café d'en face",
         titre="Le lieutenant Igier", role="U",
         contenu="Dossier bouclé en deux jours, sans photos. Il vous montre le constat : « victime au pied de l'escalier ». Certificat signé par le Dr Lacour.",
         revele=["p:igier", "p:lacour", "d:constat"], repond={"Q3": "Le constat place le corps au pied de l'escalier."}),
    dict(id="igier2", lieu="commissariat", type="entretien", bouton="Revenir voir Igier avec l'aveu du médecin",
         titre="Igier, second entretien", role="E", requiert=["lacour2"],
         contenu="Il lâche le morceau : le 17 à 8 h 10, le commissaire Borel a reçu un appel de la mairie. « L'adjoint Roussillon en personne. Il fallait que ça reste un accident. »",
         revele=[], repond={"Q5": "Roussillon a appelé le commissaire pour faire classer l'affaire."}),

    # ---------------- Cabinet Lacour ----------------
    dict(id="lacour", lieu="cabinet_lacour", type="entretien", bouton="Consulter le Dr Lacour",
         titre="Le Dr Lacour", role="F",
         contenu="« Mort sur le coup. Rien d'inhabituel. C'est très classique. » Il a été appelé à 7 h. Il regarde beaucoup sa montre.",
         revele=["p:lacour"]),
    dict(id="lacour2", lieu="cabinet_lacour", type="entretien", bouton="Revenir voir Lacour avec le témoignage du gardien",
         titre="Lacour, second entretien", role="E", requiert=["bensaid2"],
         contenu="Quand vous lui dites où Bensaïd a trouvé le corps, il cède. Décès entre minuit et une heure, pas à 22 h. « Il n'est pas mort sur le coup. Il a mis longtemps. » "
                 "Le commissaire lui a demandé d'écrire autre chose.",
         revele=[], repond={"Q3": "Faure a survécu près de deux heures après sa chute.", "Q5": "Le commissaire a fait modifier le certificat."}),

    # ---------------- Domicile Faure ----------------
    dict(id="colette", lieu="domicile_faure", type="entretien", bouton="Rendre visite à Colette Faure",
         titre="Colette Faure, la veuve", role="U",
         contenu="Bernard est parti à 19 h le 16, « une réunion », avec le dossier bleu. Elle dit ne pas savoir ce qu'il contenait. "
                 "Il faisait des heures « pour la petite, à la fac à Lyon ».",
         revele=["p:colette", "d:dossier_bleu"]),
    dict(id="bureau_faure", lieu="domicile_faure", type="investigation", bouton="Fouiller le bureau de Bernard",
         titre="Le bureau de Bernard Faure", role="U",
         contenu="Le dossier bleu n'y est plus. Des relevés bancaires : crédit immobilier en retard jusqu'en juillet, puis soudain à jour, dépôts en liquide chaque mois. "
                 "Son agenda : « Mardi 16, 22 h, F. »",
         revele=["d:releves_faure"], repond={"Q2": "De l'argent liquide arrive chaque mois depuis août."}),
    dict(id="colette2", lieu="domicile_faure", type="entretien", bouton="Revenir voir Colette avec les retraits « B.F. »",
         titre="Colette, second entretien", role="E", requiert=["compta"],
         contenu="Elle sort de sa boîte à couture le carnet de Bernard : « R.F. 30 » en août, septembre, octobre, puis « R.F. 200 ? » en novembre. "
                 "Et un ticket de consigne de la gare, trouvé dans son portefeuille.",
         revele=["d:carnet_versements", "d:ticket_consigne", "l:consigne_gare"], repond={"Q2": "Faure notait les sommes reçues de R.F. et en exigeait 200 000."}),

    # ---------------- Consigne de la gare ----------------
    dict(id="consigne", lieu="consigne_gare", type="investigation", bouton="Ouvrir la consigne",
         titre="La consigne de Châteaucreux", role="U",
         contenu="Un sac de sport : photocopies des bons de la décharge, photos au flash de camions Ferrand la nuit, et un tableau de la main de Faure : « Prévu 3 000 t. Évacué 400 t. Reste ? »",
         revele=["d:copie_faure"], repond={"Q4": "Faure avait fait le calcul : 2 600 tonnes manquent.", "Q2": "Faure gardait ses preuves en lieu sûr."}),

    # ---------------- Site Ferréol ----------------
    dict(id="bensaid", lieu="site_ferreol", type="entretien", bouton="Parler au gardien",
         titre="Ahmed Bensaïd, le gardien", role="U",
         contenu="Des voix vers 22 h, « je suis pas descendu ». Des camions la nuit depuis un mois. « Pour l'histoire de l'usine, voyez Marcel Chaptal, au Cheval Noir. »",
         revele=["p:bensaid", "p:chaptal", "l:cheval_noir"]),
    dict(id="reperage", lieu="site_ferreol", type="investigation", bouton="Faire le tour du site",
         titre="Repérage du chantier", role="E",
         contenu="Une dalle toute fraîche dans l'aile est, sur la zone de l'escalier. Des projecteurs de chantier et des câbles (les « lueurs » des riverains). "
                 "Un panneau « Groupe Vallenot, Ferrand Frères ». Un bon de livraison signé G. Mounier, chef d'équipe. "
                 "Au portail arrière, des traces de camion plateau et un reçu déchiré en quatre. Sur le mur est, un slogan à la peinture. Yves photographie tout.",
         revele=["p:vallenot", "p:ferrand", "p:mounier", "l:cabinet_vallenot", "l:siege_ferrand"],
         puzzle=dict(type="Recoller des morceaux", objet="Le reçu déchiré en quatre",
                     solution="Reçu de la Casse Berthet, Rive-de-Gier, « fonte, 1,2 t », daté du 16/11.",
                     donne=["p:berthet"], aide="Yves recolle le reçu à votre place."),
         repond={"Q4": "Une dalle neuve coulée sur un chantier à l'arrêt."}),
    dict(id="bensaid2", lieu="site_ferreol", type="entretien", bouton="Revenir voir Bensaïd avec le livre de police",
         titre="Bensaïd, second entretien", role="E", requiert=["livre"],
         contenu="Il avoue la ferraille, puis tout le reste. À 22 h 40, une Safrane bleu nuit près de l'entrée. À 6 h 30, Faure près de la porte, pas au pied de l'escalier, les yeux ouverts. "
                 "Quatre mégots de cigarillo à côté de lui, qu'il a gardés dans une boîte d'allumettes. Sa cabane avait été ouverte, le téléphone mal raccroché. C'est le Dr Lacour qui est venu à 7 h. Et « le vieux Chaptal, du Cheval Noir » traînait le long du mur est vers 21 h.",
         revele=["d:megots", "p:lacour", "p:chaptal", "l:cheval_noir"], repond={"Q3": "Faure s'est traîné vers la porte ; une Safrane ; des mégots près du corps."}),
    dict(id="porte", lieu="site_ferreol", type="investigation", bouton="Examiner le sol près de la porte",
         titre="Près de la porte de l'atelier", role="U", requiert=["bensaid2"],
         contenu="Hors de la dalle neuve, dans la poussière de calamine : des traces de doigts sur deux mètres, vers la porte. Un ongle cassé dans une rainure du sol.",
         revele=[], repond={"Q3": "Faure était vivant et conscient après sa chute."}),

    # ---------------- Cheval Noir ----------------
    dict(id="chaptal", lieu="cheval_noir", type="entretien", bouton="Payer un verre à Marcel Chaptal",
         titre="Marcel Chaptal", role="U",
         contenu="Il raconte le fondeur de 1911 comme s'il y était. Le soir du 16 ? « Au comptoir toute la soirée. Demandez à Jeannot. »",
         revele=["p:chaptal", "p:jeannot"]),
    dict(id="jeannot", lieu="cheval_noir", type="entretien", bouton="Parler au patron",
         titre="Jeannot, patron du Cheval Noir", role="U",
         contenu="« Marcel ? Parti vers huit heures, revenu vers dix heures, les mains pleines de peinture blanche. Il m'a dit de dire qu'il était là. »",
         revele=["p:jeannot"]),
    dict(id="chaptal2", lieu="cheval_noir", type="entretien", bouton="Revenir voir Chaptal",
         titre="Chaptal, second entretien", role="E", requiert_un=["tirages", "jeannot"],
         contenu="Il avoue le slogan, la lettre du fantôme et deux lettres de menaces à Faure. Ce soir-là, il a vu la 405 grise de Faure vers 21 h, "
                 "puis à 21 h 50 le camion benne de Ferrand, « le patron lui-même au volant, jamais il conduit, lui ».",
         revele=[], repond={"Q6": "Chaptal a écrit la lettre du fantôme.", "Q1": "Ferrand arrive au site à 21 h 50, seul."}),

    # ---------------- Ferrand Frères ----------------
    dict(id="ferrand", lieu="siege_ferrand", type="entretien", bouton="Rencontrer Roger Ferrand",
         titre="Roger Ferrand", role="U",
         contenu="Il répond par des questions. « J'étais chez moi. Demandez à ma femme, elle est au bureau du fond. »",
         revele=["p:ferrand", "p:simone"]),
    dict(id="compta", lieu="siege_ferrand", type="investigation", bouton="Jeter un œil à la comptabilité",
         titre="La comptabilité de Ferrand Frères", role="E",
         contenu="Trois virements à la SCI Delombre. Des retraits en liquide notés « B.F. » : 30 000 francs en août, septembre, octobre, et 50 000 le 16 novembre. "
                 "Dans l'agenda : « Mardi 16, Ferréol 22 h ». Dans le poêle, des cendres de carton bleu et une agrafe de classeur.",
         revele=["d:compta_ferrand", "d:agenda_ferrand"],
         repond={"Q1": "Ferrand avait rendez-vous à Ferréol à 22 h, avec 50 000 francs.", "Q2": "Ferrand versait de l'argent à « B.F. »."}),
    dict(id="coffre", lieu="siege_ferrand", type="investigation", bouton="Examiner le coffre derrière le calendrier",
         titre="Le coffre de Roger Ferrand", role="U", requiert=["compta"],
         contenu="Un petit coffre à combinaison caché derrière le calendrier des Postes. À l'intérieur : 50 000 francs en liasses, les bandes de la banque datées du 16 novembre 1993. "
                 "L'argent que Ferrand a apporté à Ferréol et qu'il a remporté.",
         revele=["d:liasses"], repond={"Q1": "Ferrand a retiré 50 000 francs le jour même et les a rapportés.", "Q2": "Le dernier paiement n'a jamais été versé."},
         puzzle=dict(type="Trouver un code", objet="Le coffre à combinaison (4 chiffres)",
                     solution="1403 : la date de la mort de Paul Ferrand, donnée par les archives d'Odile. Sur le calendrier, un 14 mars entouré au feutre noir.",
                     donne=[], aide="Simone laisse échapper le code, contre une piste.", obligatoire=True)),
    dict(id="simone", lieu="siege_ferrand", type="entretien", bouton="Parler à Simone Ferrand",
         titre="Simone Ferrand", role="U",
         contenu="« Roger est rentré à neuf heures, comme d'habitude. » Tout ce qu'elle dit commence par « Roger dit ». Elle mentionne Gérard Mounier, le chef d'équipe de nuit.",
         revele=["p:simone", "p:mounier", "l:cite_mounier"]),
    dict(id="simone2", lieu="siege_ferrand", type="entretien", bouton="Revenir voir Simone",
         titre="Simone, second entretien", role="U", requiert_un=["chaptal2", "mounier", "berthet2"],
         contenu="Elle ne dément pas franchement. Elle raconte que Roger est rentré vers 23 h 20, et qu'il a lavé lui-même son pantalon dans la nuit. « Il fait jamais ça. »",
         revele=[], repond={"Q1": "L'alibi de Ferrand tombe."}),

    # ---------------- Mounier ----------------
    dict(id="mounier", lieu="cite_mounier", type="entretien", bouton="Aller voir Gérard Mounier",
         titre="Gérard Mounier, chef d'équipe", role="U",
         contenu="« Je sais rien, je fais ce qu'on me dit. » Il laisse échapper que mardi, « le patron a dit de pas venir ». Pour la première fois depuis un mois.",
         revele=["p:mounier"], repond={"Q1": "Ferrand a écarté son équipe le soir du drame."}),
    dict(id="mounier2", lieu="cite_mounier", type="entretien", bouton="Revenir voir Mounier avec les tonnages",
         titre="Mounier, second entretien", role="U", requiert_un=["registre", "consigne"],
         contenu="Il comprend qu'il portera le chapeau. Depuis octobre, son équipe enterre des terres noires sous des dalles, la nuit. "
                 "La nuit du 17, avant de couler la dalle sur la zone de l'escalier, il a vu des traînées sombres. « Le patron a dit : coule. »",
         revele=[], repond={"Q4": "Les terres sont enterrées sous les dalles, sur ordre de Ferrand."}),

    # ---------------- Casse Berthet ----------------
    dict(id="berthet", lieu="casse_berthet", type="entretien", bouton="Parler à Lucien Berthet",
         titre="Lucien Berthet, ferrailleur", role="F",
         contenu="« Ferréol ? J'y ai jamais mis les pieds, l'ami. » Il parle de tout au poids et au prix du kilo.",
         revele=["p:berthet"]),
    dict(id="livre", lieu="casse_berthet", type="investigation", bouton="Consulter le livre de police",
         titre="Le livre de police de la casse", role="E",
         contenu="Le registre obligatoire des ferrailleurs : « 16/11/93, 21 h 30, site Ferréol, A.B., fonte, 1,2 t ». A.B. : Ahmed Bensaïd.",
         revele=["d:livre_police"]),
    dict(id="berthet2", lieu="casse_berthet", type="entretien", bouton="Revenir voir Berthet avec son registre",
         titre="Berthet, second entretien", role="U", requiert=["livre"],
         contenu="« Bon, j'y étais. » De 21 h 30 à 22 h 30, au portail arrière. Vers 22 h 10, un cri, puis plus rien. Le camion benne de Ferrand était garé dans la cour.",
         revele=[], repond={"Q1": "Un cri vers 22 h 10, le camion de Ferrand sur place."}),

    # ---------------- Décharge ----------------
    dict(id="registre", lieu="decharge", type="investigation", bouton="Consulter le registre des entrées",
         titre="Le registre de la décharge", role="E",
         contenu="Chantier Ferréol, Ferrand Frères : 400 tonnes reçues au total, en juillet et août. Plus rien depuis septembre.",
         revele=["d:registre_decharge"], repond={"Q4": "Seulement 400 tonnes sont arrivées à la décharge."}),

    # ---------------- Parking-relais ----------------
    dict(id="parking", lieu="parking_relais", type="investigation", bouton="Visiter le chantier",
         titre="Le chantier du parking-relais", role="F",
         contenu="Même attelage, même ligne « études » payée à la SCI Delombre. Ça confirme le système de corruption, pas le meurtre.",
         revele=["d:sci_delombre"]),
]

QUESTIONS = {
    "Q1": "Qui a fait tomber Bernard Faure ? (Roger Ferrand)",
    "Q2": "Pourquoi Faure était-il sur le site ce soir-là ? (pour toucher un dernier paiement de son chantage)",
    "Q3": "Qui a empêché qu'on appelle les secours ? (Hervé Vallenot)",
    "Q4": "Où se trouvent les terres polluées ? (sous les dalles neuves du site)",
    "Q5": "Qui a fait classer l'affaire ? (Marcel Roussillon)",
    "Q6": "Qui a écrit la lettre du fantôme ? (Marcel Chaptal)",
    "BONUS": "Qui porte la salamandre ? (Roussillon)",
}

# La « solution de Mathilde » : le chemin le plus court pour répondre à tout.
MATHILDE = ["reperage", "livre", "bensaid2", "bureau_vallenot", "lacour2", "igier2",
            "compta", "colette2", "dossier", "registre", "tirages", "chaptal2"]

PISTES_ACCORDEES = 16

# ------------------------------------------------------------------ contrôles
P = {c["id"]: c for c in PISTES}
erreurs = []

def cles_connues(lues):
    k = set(DEPART)
    for cid in lues:
        k.update(P[cid]["revele"])
        k.add("l:" + P[cid]["lieu"])
    for cid in lues:
        pz = P[cid].get("puzzle")
        if pz: k.update(pz["donne"])   # puzzle résolu (ou aide demandée)
    for key in list(k):
        if key.startswith("p:"):
            k.add("l:" + PERSONNES[key[2:]][1])   # le joueur tape le nom au Minitel si besoin
    return k

def accessible(cid, lues):
    c = P[cid]
    if "l:" + c["lieu"] not in cles_connues(lues):
        return False
    if any(r not in lues for r in c.get("requiert", [])):
        return False
    if c.get("requiert_un") and not any(r in lues for r in c["requiert_un"]):
        return False
    return True

# références
for c in PISTES:
    if c["lieu"] not in LIEUX: erreurs.append(f"{c['id']} : lieu inconnu {c['lieu']}")
    for r in c.get("requiert", []) + c.get("requiert_un", []):
        if r not in P: erreurs.append(f"{c['id']} : requiert une piste inconnue {r}")
    for key in c["revele"]:
        t, i = key.split(":")
        if (t == "l" and i not in LIEUX) or (t == "p" and i not in PERSONNES):
            erreurs.append(f"{c['id']} : révèle {key} inconnu")
for pid, (_, lieu) in PERSONNES.items():
    if lieu not in LIEUX: erreurs.append(f"personne {pid} : lieu inconnu")

# tout est atteignable
lues = []
change = True
while change:
    change = False
    for c in PISTES:
        if c["id"] not in lues and accessible(c["id"], lues):
            lues.append(c["id"]); change = True
for c in PISTES:
    if c["id"] not in lues: erreurs.append(f"piste inaccessible : {c['id']}")
k = cles_connues(lues)
for l in LIEUX:
    if "l:" + l not in k: erreurs.append(f"lieu jamais révélé : {l}")
for p in PERSONNES:
    if "p:" + p not in k: erreurs.append(f"personne jamais révélée : {p}")

# le chemin de Mathilde est jouable dans l'ordre et répond à tout
faites = []
for cid in MATHILDE:
    if not accessible(cid, faites): erreurs.append(f"chemin de Mathilde : {cid} pas encore accessible à ce moment")
    faites.append(cid)
for q in QUESTIONS:
    if q != "BONUS" and not any(q in P[c].get("repond", {}) for c in MATHILDE):
        erreurs.append(f"chemin de Mathilde : aucune réponse à {q}")
if len(MATHILDE) >= PISTES_ACCORDEES:
    erreurs.append("le chemin de Mathilde consomme toutes les pistes accordées")

for c in PISTES:
    if c.get("puzzle") and not c["puzzle"].get("aide"):
        erreurs.append(f"{c['id']} : puzzle sans aide, il pourrait bloquer l'enquête")

# chaque question a au moins 2 sources, et aucune piste seule ne répond à tout
for q in QUESTIONS:
    src = [c["id"] for c in PISTES if q in c.get("repond", {})]
    if q != "BONUS" and len(src) < 2: erreurs.append(f"{q} : une seule source ({src})")

# ------------------------------------------------------------------ document
ROLE = {"E": "Essentielle", "U": "Utile", "X": "Élimine un suspect", "F": "Fausse piste"}
nom = lambda key: (LIEUX[key[2:]][0] if key[0] == "l" else PERSONNES[key[2:]][0] if key[0] == "p" else key[2:].replace("_", " "))

md = []
md.append("# Le feu de Ferréol : la carte des pistes\n")
md.append("Saint-Étienne, novembre 1993. Document de conception, jamais montré au joueur. À lire avec « 1-verite.md » et « 2-personnages.md ».\n")
md.append("Généré par `carte.py`, qui vérifie aussi la cohérence de l'enquête. Pour modifier la carte, modifier `carte.py` puis le relancer.\n")

md.append("## En chiffres\n")
nb = {r: sum(1 for c in PISTES if c["role"] == r) for r in ROLE}
md.append("| | |\n| --- | --- |")
md.append(f"| Lieux | {len(LIEUX)} ({sum(1 for k in DEPART if k.startswith('l:')) + 1} connus au départ) |")
md.append(f"| Personnages | {len(PERSONNES)} |")
md.append(f"| Pistes écrites | {len(PISTES)}, dont {sum(1 for c in PISTES if c.get('requiert') or c.get('requiert_un'))} à débloquer |")
md.append(f"| Rôle des pistes | {nb['E']} essentielles, {nb['U']} utiles, {nb['X']} qui élimine un suspect, {nb['F']} fausses pistes |")
md.append(f"| Pistes accordées au joueur | {PISTES_ACCORDEES} |")
md.append(f"| Solution de Mathilde | {len(MATHILDE)} pistes |\n")

md.append("## Ce que le joueur connaît au départ\n")
md.append("L'intro contient la lettre du « fantôme » en entier (gratuite, relisible) et nomme Bernard Faure, la Manufacture Ferréol, la mairie et la police. "
          "Au départ, le plan montre donc 5 lieux : la rédaction, Ferréol, la mairie, le commissariat et le domicile des Faure.\n")

md.append("## Les seconds entretiens (ce qui débloque quoi)\n")
md.append("| Piste débloquée | Il faut avoir lu |\n| --- | --- |")
for c in PISTES:
    if c.get("requiert") or c.get("requiert_un"):
        cond = " et ".join(P[r]["titre"] for r in c.get("requiert", [])) or " ou ".join(P[r]["titre"] for r in c["requiert_un"])
        md.append(f"| {c['titre']} | {cond} |")
md.append("")

md.append("## Les pistes, lieu par lieu\n")
for lid, (lnom, q) in LIEUX.items():
    md.append(f"### {lnom} ({QUARTIERS[q]})\n")
    for c in [c for c in PISTES if c["lieu"] == lid]:
        tete = f"**{c['bouton']}** · {c['type']} · {ROLE[c['role']]}"
        if c.get("requiert"): tete += f" · après : {', '.join(P[r]['titre'] for r in c['requiert'])}"
        if c.get("requiert_un"): tete += f" · après : {' ou '.join(P[r]['titre'] for r in c['requiert_un'])}"
        md.append(f"- {tete}  \n  {c['contenu']}")
        if c["revele"]:
            md.append(f"  \n  *Révèle :* {', '.join(nom(k) for k in c['revele'])}.")
        if c.get("repond"):
            md.append(f"  \n  *Sert à :* " + " ; ".join(f"{q} ({t})" for q, t in c["repond"].items()))
    md.append("")

md.append("## Les puzzles\n")
md.append("Résoudre un puzzle est gratuit, c'est ouvrir la piste qui coûte. En cas de blocage, un membre de l'équipe le résout contre une piste. Aucun puzzle ne peut bloquer l'enquête.\n")
md.append("| Piste | Type | Objet | Solution | Aide |\n| --- | --- | --- | --- | --- |")
for c in PISTES:
    pz = c.get("puzzle")
    if pz:
        md.append(f"| {c['titre']} | {pz['type']} | {pz['objet']} | {pz['solution']} | {pz['aide']} |")
md.append("")
md.append("## Le Minitel\n")
md.append("Un outil permanent, gratuit : le joueur tape un nom pour obtenir une adresse. Pour la plupart des personnages, l'adresse est donnée dans la piste qui les nomme. "
          "Pour ceux-ci, il faut passer par le Minitel :\n")
for pid, txt in MINITEL.items():
    md.append(f"- **{PERSONNES[pid][0]}** : « {txt} »")
md.append("")

md.append("## La solution de Mathilde\n")
md.append(f"Le chemin le plus court pour répondre à toutes les questions : {len(MATHILDE)} pistes. Le joueur en a {PISTES_ACCORDEES}, soit {PISTES_ACCORDEES - len(MATHILDE)} de marge pour les détours.\n")
for i, cid in enumerate(MATHILDE, 1):
    c = P[cid]
    md.append(f"{i}. **{c['titre']}** ({LIEUX[c['lieu']][0]})")
md.append("")

md.append("## Les recoupements, question par question\n")
md.append("Chaque réponse s'appuie sur plusieurs pistes. Aucune piste ne donne seule une réponse complète.\n")
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
print(f"Chemin de Mathilde : {len(MATHILDE)} pistes sur {PISTES_ACCORDEES} accordées.")
for q in QUESTIONS:
    print(f"  {q} : {sum(1 for c in PISTES if q in c.get('repond', {}))} sources")
print(("ERREURS :\n  " + "\n  ".join(erreurs)) if erreurs else "Aucune erreur.")
sys.exit(1 if erreurs else 0)
