# Textes de l'affaire de Saint-Étienne (« Le feu de Ferréol »).
# Source unique des textes : lu par verifier_textes.py (contrôles + document
# lisible) puis, à l'étape 5, converti en data.json pour le jeu.
#
# Balises : {{p:id|texte}} personne, {{l:id|texte}} lieu, {{d:id|texte}} pièce.
# Notes du carnet : (fiche, étiquette, texte). Étiquette vide = pas d'étiquette.

AFFAIRE = dict(
    titre="Le feu de Ferréol",
    sous_titre="Une enquête du Bureau des affaires occultes",
    annee=1993,
    pistes_accordees=16,
)

DOCUMENTS = {
    "lettre_fantome": "La lettre du « fantôme »",
    "dossier_ferreol": "Le dossier Ferréol de la mairie",
    "sci_delombre": "SCI Delombre",
    "facture_tel": "Facture de la ligne du gardien",
    "carte_vallenot": "Carte de visite de Vallenot",
    "facture_delombre": "Facture de la SCI Delombre",
    "cigarillos": "Les cigarillos de Vallenot",
    "constat": "Le rapport de police",
    "dossier_bleu": "Le dossier bleu de Bernard",
    "releves_faure": "Les relevés bancaires de Bernard",
    "carnet_versements": "Le carnet de Bernard",
    "ticket_consigne": "Le ticket de consigne",
    "copie_faure": "Le sac de la consigne",
    "megots": "Quatre mégots de cigarillo",
    "compta_ferrand": "Le livre de caisse de Ferrand",
    "agenda_ferrand": "L'agenda de chantier de Ferrand",
    "recu_berthet": "Le reçu déchiré",
    "livre_police": "Le livre de police de Berthet",
    "registre_decharge": "Le registre de la décharge",
    "liasses": "Les liasses du coffre",
}

INTRO = """Jeudi 18 novembre 1993, quatrième étage du siège, à Lyon.

La lettre est arrivée au courrier du matin, entre deux soucoupes volantes au-dessus du Vercors et une abonnée qui voit la Vierge dans une tache d'humidité. Karim l'a mise de côté. Enveloppe kraft, cachet de Saint-Étienne, lundi 15. Écriture en capitales, au stylo bille, appuyée au point de trouer le papier.

{{d:lettre_fantome|« AU JOURNAL. DEPUIS UN MOIS LE FEU EST REVENU À LA FORGE DE FERRÉOL. ON LE VOIT LA NUIT DEPUIS LA RUE DE LA MONTAT, ROUGE, COMME AU TEMPS DES COULÉES. C'EST LE FONDEUR DE 1911. ON L'A LAISSÉ DANS LA FONTE ET ON A COULÉ LA PIÈCE QUAND MÊME. IL REVIENT CHAQUE FOIS QU'ON TOUCHE À L'USINE. FERRÉOL NE SERA PAS UN PARKING. IL Y AURA D'AUTRES MORTS. UN ANCIEN DE CHEZ FERRÉOL. »}}

À dix heures, Odile descend avec le Stéphanois du jour, plié à la page des faits divers. {{p:faure|Bernard Faure}}, 52 ans, chargé de mission au service d'urbanisme de la {{l:mairie|mairie}}, retrouvé mort mercredi matin au pied d'un escalier de l'ancienne {{l:site_ferreol|Manufacture Ferréol}}. La {{l:commissariat|police}} conclut à une chute accidentelle. Quatorze lignes, pas de photo.

Jean-Loup Sarrazin a lu les deux par-dessus l'épaule d'Odile. « Un fantôme qui annonce un mort, et le mort qui arrive. C'est une page, ça. On est d'accord ? »

Mathilde plie la lettre en quatre et la glisse dans son sac. « Admettons. »

Le soir même, vous prenez vos quartiers dans un bureau vide de la {{l:redaction|rédaction du Stéphanois}}, rue de la République. Le radiateur fait plus de bruit que de chaleur."""

INTRO_NOTES = [
    ("p:faure", "Version officielle", "Retrouvé mort le mercredi 17 novembre au matin, au pied d'un escalier de Ferréol. La police conclut à une chute accidentelle."),
    ("d:lettre_fantome", "", "Postée à Saint-Étienne le lundi 15 novembre, la veille de la mort de Faure. Signée « un ancien de chez Ferréol »."),
    ("l:site_ferreol", "La légende", "Selon la lettre, un « feu » y brille la nuit depuis un mois, et un fondeur y est mort en 1911."),
]

PISTES = {}

def piste(pid, texte, notes=()):
    PISTES[pid] = dict(texte=texte.strip(), notes=list(notes))

# =========================================================== RÉDACTION

piste("archives", """
Le service documentation du Stéphanois tient dans une pièce sans fenêtre, entre la chaufferie et les archives photo. La chemise « Ferréol » contient onze coupures.

Avril : une pleine page, {{p:roussillon|Marcel Roussillon}}, adjoint à l'urbanisme, devant la forge, casque de chantier sur la tête. Le projet est porté par le {{l:cabinet_vallenot|Groupe Vallenot}}, de {{p:vallenot|Hervé Vallenot}}. Juillet : trois lignes en page 9, le budget « réévalué pour tenir compte de la dépollution ». Septembre : l'entreprise {{l:siege_ferrand|Ferrand Frères}}, de {{p:ferrand|Roger Ferrand}}, décroche aussi le {{l:parking_relais|parking-relais de Bellevue}}.

Une brève de mai cite un opposant, {{p:chaptal|Marcel Chaptal}}, ancien délégué CGT de la forge : « On ne transforme pas un cimetière en pépinière. » Le journaliste précise qu'on le trouve tous les jours au {{l:cheval_noir|Cheval Noir}}.
""", [
    ("l:site_ferreol", "Le projet", "Reconversion en pépinière d'entreprises, annoncée en avril 1993. Budget « réévalué » en juillet pour la dépollution."),
    ("p:vallenot", "", "Porte le projet Ferréol avec le Groupe Vallenot."),
    ("p:ferrand", "", "Ferrand Frères : gros œuvre de Ferréol, et du parking-relais de Bellevue depuis septembre."),
    ("p:chaptal", "", "Ancien délégué CGT de la forge, opposé au projet : « On ne transforme pas un cimetière en pépinière. »"),
])

piste("roche", """
{{p:roche|Daniel Roche}} ne se lève pas de son fauteuil. Il a gardé son imperméable, comme s'il allait repartir d'une minute à l'autre depuis 1971. « Alors c'est vous, les Lyonnais. Les fantômes. » Il tapote un paquet de Gitanes sur le bureau sans en sortir une.

Mathilde : « Faure vous avait appelé, la semaine dernière. »

« Moi ? Des appels de cinglés, j'en prends dix par jour. Trente ans de métier, je les reconnais à la première phrase. » Il revient à sa machine à écrire. « Faure, c'est un accident. Le petit {{p:lacour|Lacour}} a constaté, le commissaire a signé. Allez donc photographier vos revenants. »
""", [
    ("p:roche", "", "Dit ne pas se souvenir d'un appel de Faure."),
    ("p:lacour", "", "Médecin qui a constaté le décès de Faure, selon Roche."),
])

piste("standard", """
La standardiste, Mme Peyrache, garde tout dans des cahiers d'écolier, un par mois. Elle vous laisse feuilleter novembre en surveillant son tableau, où trois voyants clignotent en même temps.

Samedi 13, d'une écriture penchée : « 16 h 40. M. Faure, urbanisme, demande les faits divers. Passé à M. Roche. » Dans la marge, au crayon, la durée, qu'elle note toujours pour la facturation interne : « 4 min ».

« M. Roche ? Oui, il l'a pris. Il a même fermé sa porte. »
""", [
    ("p:faure", "Au téléphone", "A appelé le Stéphanois le samedi 13 novembre à 16 h 40. Appel passé à Daniel Roche."),
    ("p:roche", "", "A parlé 4 minutes avec Faure, porte fermée."),
])

piste("roche2", """
Vous posez la photocopie du cahier sur la machine à écrire de {{p:roche|Roche}}. Il la regarde un moment. « Quatre minutes. Bon. » Il allume enfin une Gitane.

« Il ne voulait pas un article, votre Faure. Il m'a demandé : "C'est combien, pour vous, un dossier comme ça ?" Combien. Trente ans de métier, on ne m'avait jamais fait le coup. J'ai raccroché. »

Mathilde : « Et vous n'en avez parlé à personne. »

« À qui ? Le {{l:cabinet_vallenot|Groupe Vallenot}} nous achète une pleine page tous les jeudis. Vous voulez que j'écrive qu'un fonctionnaire vend des papiers sur Ferréol ? »
""", [
    ("p:faure", "Au téléphone", "A demandé à Roche : « C'est combien, pour vous, un dossier comme ça ? »"),
    ("p:roche", "", "Le Groupe Vallenot achète une pleine page de publicité au Stéphanois chaque jeudi."),
])

piste("odile", """
Odile décroche à la deuxième sonnerie, depuis Lyon. « Ferréol. Je vous faxe ce que j'ai. » Vingt-deux minutes plus tard, le télécopieur de la rédaction se met à grincer.

[[fax]]

Karim lit la page encore tiède par-dessus votre épaule. « Non mais attends. Il y a genre soixante pour cent des apparitions qui tombent près d'un anniversaire. »
""", [
    ("l:site_ferreol", "1911", "Étienne Vial, fondeur de 19 ans, tombé dans la coulée le 3 février 1911. La coulée n'a pas été arrêtée."),
    ("p:ferrand", "Son frère", "Paul Ferrand, 39 ans, mort écrasé sous une banche le 14 mars 1987. Roger a refusé de parler au journaliste."),
])

piste("tirages", """
Yves a fait parler le laborantin. Le 17 au matin, le photographe de permanence est allé à Ferréol pour le fait divers. Le journal n'a rien publié, mais la planche contact est restée dans un tiroir.

Yves la pose sous la lampe et vous tend son compte-fils. Vue numéro sept : le mur est, à huit heures. Sur les lettres blanches, la peinture brille encore. Deux coulures descendent jusqu'au trottoir, un pot vide est posé contre le mur.

Mathilde sort de son sac la lettre du fantôme et la pose à côté de la planche. Yves regarde l'une, puis l'autre. « Ferréol ne sera pas un parking. » Il répète, plus lentement : « Pas un parking. »
""", [
    ("l:site_ferreol", "Mur est", "Le 17 à 8 h, la peinture du slogan était encore fraîche. Un pot vide contre le mur."),
])

# =========================================================== MAIRIE

piste("roussillon", """
{{p:roussillon|Marcel Roussillon}} reçoit debout, porte ouverte sur le couloir. À l'annulaire droit, une chevalière en or gravée d'une salamandre dans les flammes. Il la fait tourner en parlant.

« On regrette beaucoup Bernard Faure, dans les services. Un agent sérieux. » Sur le budget : « On a suivi l'avis technique. La dépollution, ça ne se commande pas. »

Vous n'avez encore rien demandé sur mardi soir. « Et pour la soirée, on était en conseil municipal jusqu'à dix heures et demie. Tout le monde pourra vous le dire. »

Un carillon sonne dans le couloir. Il se lève avant vous.
""", [
    ("p:roussillon", "", "Porte une chevalière en or gravée d'une salamandre dans les flammes."),
    ("p:roussillon", "Mardi 16", "Dit, sans qu'on le lui demande, avoir été en conseil municipal jusqu'à 22 h 30."),
])

piste("dossier", """
Une employée du service, les yeux rouges, vous laisse le {{d:dossier_ferreol|dossier Ferréol}} le temps d'aller chercher un café. « C'était son dossier, à M. Faure. »

Le plan de dépollution tient en douze pages : 3 000 tonnes de terres chargées d'hydrocarbures et de métaux, à évacuer vers la {{l:decharge|décharge agréée de la Croix-de-l'Orme}}. Le budget passe de 4 à 8,2 millions de francs par une délibération de juillet, signée {{p:roussillon|M. Roussillon}}, sans appel d'offres. Une ligne « études et honoraires » de 1,3 million, à l'ordre d'une {{d:sci_delombre|SCI Delombre}} dont le nom n'apparaît nulle part ailleurs.

Dans la marge de la page des tonnages, quelqu'un a écrit au crayon, puis gommé. Il reste la trace d'un point d'interrogation.
""", [
    ("d:dossier_ferreol", "Tonnage", "3 000 tonnes de terres polluées à évacuer vers la décharge de la Croix-de-l'Orme."),
    ("d:dossier_ferreol", "Budget", "Passé de 4 à 8,2 millions de francs en juillet, sans appel d'offres. Délibération signée Roussillon."),
    ("d:sci_delombre", "", "1,3 million de francs d'« études et honoraires » sur Ferréol. Aucune autre trace à la mairie."),
])

piste("conseil", """
Le compte rendu du conseil municipal du mardi 16 novembre est déjà tapé, photocopié, agrafé.

Ouverture de la séance à 18 h 30. Budget des cantines scolaires : intervention de {{p:roussillon|M. Roussillon}} à 22 h 15, trois paragraphes sur le prix du repas. Levée de la séance à 22 h 30.

Dans la marge d'un exemplaire, un conseiller d'opposition a griffonné : « Roussillon parti en courant, pas resté au pot. »
""", [
    ("p:roussillon", "Mardi 16", "Intervient au conseil municipal à 22 h 15. Séance levée à 22 h 30. Parti vite, sans rester au pot."),
])

piste("facture_tel", """
Au service comptabilité, un employé vous sort la {{d:facture_tel|facture détaillée}} de la ligne 77 33 61 08, « cabane de gardiennage, site Ferréol », payée par la ville. Octobre et novembre tiennent sur deux feuillets de listing à bandes perforées.

Une trentaine d'appels, presque tous en journée, vers la mairie ou vers Ferrand Frères. L'employé a déjà tourné les talons. Karim fait glisser son doigt le long des colonnes.
""", [])

# =========================================================== VALLENOT

piste("vallenot", """
{{p:vallenot|Hervé Vallenot}} vous reçoit debout devant une maquette du projet : des arbres en éponge verte, de petits personnages qui ne vont nulle part. La pièce sent le cigarillo froid. « Ferréol, c'est un beau projet. Une belle opération pour la ville. »

Sur Faure, il baisse la voix d'un demi-ton. « Un drame. Je le connaissais de loin, ce sont les services qui suivaient le dossier. »

Mathilde : « Vous étiez à Ferréol mardi soir, donc. »

« Mardi ? J'étais chez moi. Seul, ma femme était chez sa mère, à Lyon. Soirée télé. » Il sourit. « Rien de très passionnant. »

Vous demandez qui a coulé la dalle neuve. « Ça, c'est technique. Voyez avec Roger Ferrand. »

En vous raccompagnant, il glisse une {{d:carte_vallenot|carte de visite}} dans la poche de Mathilde. Groupe Vallenot, Hervé Vallenot, président. Radiotéléphone : 07 42 18 63. « Pour votre beau papier. N'hésitez pas. »
""", [
    ("p:vallenot", "Mardi 16", "Dit avoir passé la soirée seul chez lui, sa femme chez sa mère à Lyon."),
    ("p:vallenot", "", "Dit ne connaître le dossier Ferréol que « de loin »."),
    ("d:carte_vallenot", "", "Hervé Vallenot, président. Radiotéléphone : 07 42 18 63."),
])

piste("bureau_vallenot", """
La secrétaire descend chercher le courrier et laisse la porte entrouverte.

Sur un classeur mal refermé, une {{d:facture_delombre|facture de la SCI Delombre}} : « Conseil en stratégie urbaine, projet Ferréol, 1 300 000 F ». Pas de rapport, pas d'annexe, réglée comptant, signée Maurice Delombre, gérant.

Sur le bureau en noyer de {{p:vallenot|Vallenot}}, à côté du radiotéléphone dans sa sacoche, un cendrier de cristal et une {{d:cigarillos|boîte de cigarillos}} hollandais, entamée. Les cigarillos ont un embout de plastique blanc.

Par la fenêtre, dans la cour, une Safrane bleu nuit est garée en épi.
""", [
    ("d:facture_delombre", "", "1,3 million de francs de « conseil en stratégie urbaine », sans rapport ni annexe. Signée Maurice Delombre, gérant."),
    ("d:cigarillos", "", "Cigarillos hollandais à embout de plastique blanc, sur le bureau de Vallenot."),
    ("p:vallenot", "Sa voiture", "Une Safrane bleu nuit, garée dans la cour du cabinet."),
])

# =========================================================== COMMISSARIAT

piste("igier", """
{{p:igier|Igier}} vous donne rendez-vous au comptoir du café d'en face, jamais au commissariat. « Le 17 à 6 h 40, la patrouille s'est transportée sur les lieux, où elle a constaté… » Il s'interrompt, repose sa tasse. « Bon. On est arrivés, il était mort, on a appelé le médecin. »

Il fait glisser vers vous une photocopie du {{d:constat|rapport}}. « Victime découverte au pied de l'escalier métallique. » Pas de croquis, pas de photos. Le certificat de décès est signé du {{p:lacour|Dr Pierre Lacour}}.

« C'est pas moi qui ai tapé le rapport. Le commissaire Borel l'a fait lui-même, dans la matinée. D'habitude, un fonctionnaire mort sur un chantier, on prend plus de gants. Là, non. »
""", [
    ("d:constat", "", "« Victime découverte au pied de l'escalier métallique. » Sans croquis ni photos. Tapé par le commissaire Borel lui-même."),
    ("p:lacour", "", "A signé le certificat de décès de Faure."),
])

piste("igier2", """
Quand vous lui répétez ce que {{p:lacour|Lacour}} vous a dit, {{p:igier|Igier}} regarde longtemps le fond de sa tasse. « L'heure du décès a été établie par… » Il s'arrête. « Non. Écoutez. »

« Le 17 à 8 h 10, le commissaire a reçu un appel. J'étais dans son bureau. Il a dit "Oui, monsieur l'adjoint" trois fois et il a raccroché. Après, il m'a demandé de ne pas m'embêter avec la position du corps. »

Il pose un billet sur le comptoir. « C'était {{p:roussillon|Roussillon}}. Vous ne tenez pas ça de moi. »
""", [
    ("p:roussillon", "Mercredi 17", "Le commissaire Borel reçoit un appel à 8 h 10 et répond « Oui, monsieur l'adjoint ». Selon Igier, c'était Roussillon."),
    ("d:constat", "", "Après cet appel, le commissaire a demandé à Igier de « ne pas s'embêter avec la position du corps »."),
])

# =========================================================== LACOUR

piste("lacour", """
Le cabinet du {{p:lacour|Dr Lacour}} sent l'éther et la moquette humide. Il vous reçoit entre deux patients, sans vous faire asseoir.

« Mort sur le coup, j'imagine. Une chute de quatre mètres sur de l'acier, c'est très classique. Rien d'alarmant. » Il regarde sa montre, puis la pendule.

Mathilde : « Vous êtes arrivé vers six heures, donc. »

« Sept heures. On m'a appelé à sept heures moins le quart. Tout était très classique. Ça arrive, ces choses-là, sur les chantiers. »
""", [
    ("p:lacour", "", "Appelé à 6 h 45, arrivé à Ferréol à 7 h. Parle de « mort sur le coup »."),
])

piste("lacour2", """
Vous racontez à {{p:lacour|Lacour}} ce qu'a vu le gardien : le corps près de la porte, à deux mètres de l'escalier, les yeux ouverts. Il ferme la porte du cabinet. Il ne dit plus « classique ».

« La rigidité, les lividités… Il est mort entre minuit et une heure. Pas à dix heures. » Il enlève ses lunettes. « Il n'est pas mort sur le coup. Il a mis longtemps. Deux heures, peut-être. Il a dû avoir froid. »

Mathilde : « Et vous avez écrit "mort immédiate". »

« Le commissaire était là. Il m'a dit qu'une famille n'a pas besoin de lire ce genre de détails. J'ai soixante et un ans, madame. »
""", [
    ("p:faure", "Heure de la mort", "Entre minuit et une heure, selon le Dr Lacour. Pas sur le coup."),
    ("p:lacour", "", "A écrit « mort immédiate » à la demande du commissaire."),
])

# =========================================================== DOMICILE FAURE

piste("colette", """
{{p:colette|Colette Faure}} vous fait entrer dans une cuisine où tout est rangé, sauf une pile de courrier qu'elle n'ouvre pas. « Bernard part toujours à huit heures. Partait. »

Mardi, il a dit qu'il avait une réunion. Il est sorti à sept heures du soir avec son {{d:dossier_bleu|dossier bleu}}, « celui qu'il ne lâchait plus depuis l'été ». Ce qu'il y avait dedans ? « Je ne sais pas. Des papiers du travail. »

Sur le frigo, sous un aimant en forme de Vierge de Fourvière, la photo d'une jeune fille devant un amphithéâtre. « La petite. En droit, à Lyon. Il fait des heures pour elle. Faisait. »
""", [
    ("p:faure", "Mardi 16", "Parti de chez lui à 19 h, « pour une réunion », avec son dossier bleu."),
    ("d:dossier_bleu", "", "Bernard ne le lâchait plus depuis l'été. Colette dit ignorer ce qu'il contenait."),
    ("p:colette", "", "Leur fille fait son droit à Lyon."),
])

piste("bureau_faure", """
Le bureau de Bernard est une ancienne chambre d'enfant, papier peint à ballons sous les étagères. Le tiroir où Colette pensait trouver le dossier bleu est vide.

Dans une chemise « Banque », les {{d:releves_faure|relevés du Crédit Agricole}}. Le prêt immobilier est en retard de trois échéances en juin, puis tout est régularisé en août. Chaque mois depuis, un dépôt en espèces : 29 000 francs en août, 29 500 en septembre, 30 000 en octobre.

Sur l'agenda de bureau, à la date du mardi 16, une seule ligne : « 22 h, F. »
""", [
    ("d:releves_faure", "", "Prêt en retard de trois échéances en juin, régularisé en août. Dépôts en espèces : 29 000 F en août, 29 500 F en septembre, 30 000 F en octobre."),
    ("p:faure", "Mardi 16", "Sur son agenda : « 22 h, F. »"),
])

piste("colette2", """
Vous posez sur la toile cirée la photocopie des retraits « B.F. ». {{p:colette|Colette Faure}} la lit deux fois, sans rien dire. Puis elle se lève, ouvre sa boîte à couture et sort de sous les bobines un {{d:carnet_versements|petit carnet à spirale}}.

« Bernard note tout. Notait. Même les pleins d'essence. »

Sur une page, quatre lignes au stylo bille. « R.F. 30 » en août, en septembre, en octobre. En novembre : « R.F. 200 ? », le point d'interrogation repassé plusieurs fois.

« J'ai trouvé les enveloppes en septembre. Dans une boîte à chaussures, au-dessus de l'armoire. J'ai rien demandé. On avait le crédit, la petite à Lyon… »

Elle pose aussi sur la table un {{d:ticket_consigne|ticket orange}} numéroté. « C'était dans son portefeuille. Je sais pas à quoi ça sert. » C'est un ticket de la consigne à bagages de la {{l:consigne_gare|gare de Châteaucreux}}.

Au bout de la table, le couvert de Bernard est toujours mis.
""", [
    ("d:carnet_versements", "", "« R.F. 30 » en août, septembre et octobre. « R.F. 200 ? » en novembre."),
    ("p:colette", "Ce qu'elle cachait", "A trouvé des enveloppes de billets en septembre, dans une boîte à chaussures."),
    ("d:ticket_consigne", "", "Consigne à bagages de la gare de Châteaucreux. Trouvé dans le portefeuille de Bernard."),
])

piste("consigne", """
La consigne à bagages de {{l:consigne_gare|Châteaucreux}} est un guichet au bout du hall, sous l'horloge. Le préposé regarde le ticket, soupire, et revient avec un sac de sport bleu, celui d'un club de handball.

Dedans, une enveloppe kraft : la {{d:copie_faure|copie d'un dossier}}. Des photocopies des bons de pesée de la décharge. Douze photos au flash de camions bennes Ferrand Frères, de nuit, dans la cour de Ferréol. Et un tableau écrit à la main : « Prévu : 3 000 t. Évacué : 400 t. Reste : ? »

Au fond du sac, une paire de chaussettes de rechange et un paquet de biscuits entamé. Karim regarde les chaussettes plus longtemps que les documents.
""", [
    ("d:copie_faure", "", "Photocopies des bons de pesée de la décharge. Douze photos de camions Ferrand la nuit à Ferréol. Tableau : « Prévu : 3 000 t. Évacué : 400 t. Reste : ? »"),
])

# =========================================================== FERRÉOL

piste("bensaid", """
{{p:bensaid|Ahmed Bensaïd}} ouvre le portail sans un mot de trop. Vingt ans de gardiennage.

« Il se pourrait que j'aie entendu des voix, monsieur le journaliste. Vers dix heures. Du côté de l'atelier de forge. Je suis pas descendu, c'est pas mon rôle. »

Les camions ? « Il se pourrait qu'il y en ait eu, la nuit. Depuis un mois. Ceux de chez Ferrand. »

Mathilde : « Vous avez vu qui conduisait, donc. »

« Non, madame. Je regarde pas ce qui me regarde pas. » Il vous raccompagne. « Pour l'histoire de l'usine, voyez plutôt {{p:chaptal|Marcel Chaptal}}. Il est tous les jours au {{l:cheval_noir|Cheval Noir}}. »
""", [
    ("p:bensaid", "Mardi 16", "Dit avoir entendu des voix vers 22 h, du côté de l'atelier de forge. « Je suis pas descendu. »"),
    ("l:site_ferreol", "La nuit", "Des camions de Ferrand y viennent la nuit depuis un mois, selon le gardien."),
])

piste("reperage", """
Le panneau à l'entrée annonce un chantier gelé depuis septembre. Maître d'ouvrage : {{l:cabinet_vallenot|Groupe Vallenot}}, {{p:vallenot|H. Vallenot}}. Gros œuvre : {{l:siege_ferrand|Ferrand Frères}}, {{p:ferrand|R. Ferrand}}.

Dans l'aile est, une dalle de béton neuve couvre le pied de l'escalier métallique, encore sombre d'humidité. Tout autour, le sol est noir de calamine et de terre retournée. Contre un pilier, deux projecteurs de chantier sur trépied et un groupe électrogène, câbles enroulés avec soin. Sous une palette, un bon de livraison : « Béton, 8 m³, 17/11/93, réceptionné {{p:mounier|G. Mounier}} ».

Au portail arrière, des traces de pneus jumelés dans la boue, et quatre morceaux de papier collés par la pluie contre le grillage.

Sur le mur d'enceinte, côté est, en lettres blanches d'un mètre de haut : FERRÉOL NE SERA PAS UN PARKING.

Yves fait trois photos du mur, deux de la dalle, une des projecteurs.
""", [
    ("l:site_ferreol", "Aile est", "Dalle de béton neuve au pied de l'escalier, sur un chantier gelé depuis septembre."),
    ("l:site_ferreol", "La nuit", "Deux projecteurs de chantier et un groupe électrogène dans l'atelier."),
    ("l:site_ferreol", "Mur est", "Slogan en lettres blanches : « FERRÉOL NE SERA PAS UN PARKING »."),
    ("p:mounier", "", "A réceptionné 8 m³ de béton à Ferréol le 17 novembre."),
])

piste("bensaid2", """
{{p:bensaid|Ahmed Bensaïd}} regarde longtemps la photocopie du {{d:livre_police|livre de police}}. Puis il ferme la porte de la cabane.

« Il se pourrait que… » Il s'arrête. « Non. J'étais au portail de derrière, avec {{p:berthet|Berthet}}. La fonte, ça part à la casse de toute façon. »

Ensuite il parle sans conditionnel, d'une traite, les mains à plat sur la table. « Vers onze heures moins vingt, en revenant, il y avait une voiture devant l'entrée. Une Safrane bleu nuit. Pas une voiture d'ici. Le matin, à six heures et demie, j'ai fait ma ronde. Le monsieur n'était pas au pied de l'escalier. Il était près de la porte. Il avait les yeux ouverts. Je les lui ai fermés. »

Il ouvre un tiroir et pose une boîte d'allumettes sur la table. Dedans, {{d:megots|quatre mégots}} de cigarillo à embout de plastique blanc. « Ils étaient à côté de lui. Je sais pas pourquoi je les ai gardés. »

Sur le pas de la porte, il ajoute : « Cette nuit-là, quelqu'un est entré dans ma cabane. Le téléphone pendait au bout du fil. Et le vieux {{p:chaptal|Chaptal}}, du {{l:cheval_noir|Cheval Noir}}, traînait le long du mur est vers neuf heures. C'est le docteur {{p:lacour|Lacour}} qui est venu, le matin. »
""", [
    ("p:bensaid", "Ce qu'il cachait", "Revend la ferraille du site à Berthet. Le 16 au soir, il était au portail arrière."),
    ("p:faure", "Le matin du 17", "Trouvé à 6 h 30 près de la porte, pas au pied de l'escalier. Les yeux ouverts."),
    ("d:megots", "", "Cigarillos à embout de plastique blanc, trouvés à côté du corps par le gardien."),
    ("l:site_ferreol", "Mardi 16", "Une Safrane bleu nuit devant l'entrée vers 22 h 40. Quelqu'un est entré dans la cabane du gardien et a utilisé le téléphone."),
    ("p:chaptal", "Mardi 16", "Vu le long du mur est vers 21 h, selon le gardien."),
])

piste("porte", """
Le gardien vous montre l'endroit, puis retourne dans sa cabane. Il ne veut pas regarder.

La dalle neuve s'arrête à deux mètres de la porte de l'atelier. Au-delà, le sol de brique est couvert d'une poussière noire de calamine que personne n'a balayée. On y distingue des traces de doigts, parallèles, qui partent du bord de la dalle et vont vers la porte. Elles s'arrêtent à cinquante centimètres du seuil.

Dans une rainure entre deux briques, Yves trouve un ongle cassé. Il le photographie sans flash, puis avec, et le laisse où il est.
""", [
    ("l:site_ferreol", "Près de la porte", "Traces de doigts dans la calamine, du bord de la dalle vers la porte. Elles s'arrêtent à 50 cm du seuil. Un ongle cassé entre deux briques."),
])

# =========================================================== CHEVAL NOIR

piste("chaptal", """
{{p:chaptal|Marcel Chaptal}} parle bas, le coude sur le zinc, un ballon de rouge qu'il ne finira pas. « Ferréol, mon gars, j'y suis entré l'année de la grande grève des mineurs, en quarante-huit. Trente ans à la forge. »

Le fondeur de 1911, il le raconte comme s'il y était. « On l'a laissé dans la coulée. La pièce est partie quand même. Elle doit rouler encore quelque part, la pièce. »

Le feu, la nuit ? « Tout le monde l'a vu, rue de la Montat. Demande. »

Et lui, mardi soir ? « Ici. Au comptoir, toute la soirée. Demande à {{p:jeannot|Jeannot}}. »
""", [
    ("p:chaptal", "Mardi 16", "Dit avoir passé la soirée au comptoir du Cheval Noir. « Demande à Jeannot. »"),
    ("l:site_ferreol", "La légende", "Selon Chaptal, tout le quartier voit le « feu » de la forge la nuit, depuis la rue de la Montat."),
])

piste("jeannot", """
{{p:jeannot|Jeannot}} essuie les verres un par un, à la lumière, sans se presser.

« Marcel ? Mardi ? » Il pose un verre, en prend un autre. « Il a pris sa première tournée à sept heures, sa deuxième à huit. La troisième, il l'a prise à dix heures passées. Entre les deux, pas de Marcel. »

Il baisse la voix. « Il est revenu avec les mains pleines de peinture blanche. Il m'a dit : "Si on te demande, j'étais là." Moi, je dis ce qu'on me demande. Vous me demandez. »
""", [
    ("p:chaptal", "Mardi 16", "Absent du Cheval Noir de 20 h à 22 h passées, selon Jeannot. Revenu les mains pleines de peinture blanche."),
])

piste("chaptal2", """
Quand vous lui parlez de la peinture, {{p:chaptal|Chaptal}} repose son verre. « Bon. Oui. C'est moi, le mur. Et la lettre. Et deux autres, à Faure, sans signature. Pour qu'il ait peur. Pour qu'il arrête avec son parking. »

Il frotte ses doigts. Il reste du blanc sous ses ongles. « Mardi, vers neuf heures, la voiture de Faure était dans l'impasse. Une 405 grise. Et à dix heures moins dix, le camion benne de chez Ferrand est arrivé. Avec le patron au volant, mon gars. {{p:ferrand|Ferrand}} lui-même, qui conduit jamais. Je suis parti. Je voulais pas qu'on me voie avec mon pot. »

Il regarde la rue. « Le fondeur, c'est des histoires. C'est moi qui les raconte. »
""", [
    ("p:chaptal", "Ce qu'il cachait", "A peint le slogan du mur est, écrit la lettre au Bureau et envoyé deux lettres anonymes à Faure."),
    ("p:ferrand", "Mardi 16", "Arrivé à Ferréol vers 21 h 50, seul au volant du camion benne, selon Chaptal."),
    ("p:faure", "Mardi 16", "Sa 405 grise était dans l'impasse des Fondeurs vers 21 h, selon Chaptal."),
])

# =========================================================== FERRAND FRÈRES

piste("ferrand", """
{{p:ferrand|Roger Ferrand}} ne s'assoit pas, vous non plus. Dans le hangar, un poste crache RTL sous le bruit d'un compresseur que personne ne coupe.

« Mardi soir ? Pourquoi, j'aurais dû être où ? »

Mathilde : « À Ferréol, avec Faure. »

« Et j'y aurais fait quoi, à Ferréol, sur un chantier gelé ? » Il essuie ses mains sur son bleu, lentement, une main puis l'autre. Son alliance serre un doigt gonflé. « J'étais chez moi. Demandez à {{p:simone|ma femme}}, elle est au bureau du fond. Vous croyez qu'elle va vous dire autre chose ? »
""", [
    ("p:ferrand", "Alibi", "Dit avoir passé la soirée du 16 chez lui. « Demandez à ma femme. »"),
])

piste("compta", """
Le bureau vitré du fond est vide : {{p:simone|Simone Ferrand}} est partie à la banque. Sur la table, le {{d:compta_ferrand|livre de caisse}} est ouvert à novembre.

Trois virements de 430 000 francs à la {{d:sci_delombre|SCI Delombre}}, en juin, en juillet et en septembre. Plus bas, dans la colonne des retraits en espèces, une écriture ronde de comptable :

12/08 · B.F. · 30 000
13/09 · B.F. · 30 000
12/10 · B.F. · 30 000
16/11 · B.F. · 50 000

Sur l'{{d:agenda_ferrand|agenda de chantier}}, à la date du mardi 16 novembre, au crayon et appuyé : « Ferréol 22 h ».

Dans un coin, un poêle à bois ronfle. Dans le cendrier, sous la cendre grise, un coin de carton bleu qui n'a pas brûlé et une agrafe de classeur tordue par la chaleur.

Le calendrier des Postes est accroché de travers. Derrière, on devine le métal d'une petite porte de coffre.
""", [
    ("d:compta_ferrand", "Retraits « B.F. »", "30 000 F les 12 août, 13 septembre et 12 octobre. 50 000 F le 16 novembre."),
    ("d:agenda_ferrand", "", "Mardi 16 novembre : « Ferréol 22 h »."),
    ("p:ferrand", "Le poêle", "Dans les cendres, un coin de carton bleu et une agrafe de classeur."),
    ("d:sci_delombre", "", "Trois virements de 430 000 F de Ferrand Frères, en juin, juillet et septembre."),
])

piste("coffre", """
Le calendrier des Postes pend à un clou. Les pages de janvier à octobre ont été arrachées, sauf une, gardée derrière novembre : mars, avec le 14 entouré au feutre noir. Derrière, une petite porte de coffre scellée dans le parpaing, avec une molette à quatre chiffres.
""", [])

piste("simone", """
{{p:simone|Simone Ferrand}} tient la comptabilité dans un bureau vitré au fond du hangar, entre un classeur métallique et un ficus en plastique. « Roger dit que vous n'avez rien à faire ici. »

Mardi soir ? « Roger est rentré à neuf heures. Comme d'habitude. » Elle a répondu avant la fin de la question. « Roger dit que la saison est bonne, qu'on a du travail jusqu'au printemps. »

L'équipe de nuit ? « C'est {{p:mounier|Gérard Mounier}} qui s'en occupe. Roger dit qu'il faut pas parler aux journaux. »
""", [
    ("p:simone", "", "Affirme que Roger est rentré à 21 h le 16. A répondu avant la fin de la question."),
    ("p:mounier", "", "Chef de l'équipe de nuit de Ferrand Frères."),
])

piste("simone2", """
Vous lui dites que le camion de Ferrand était à Ferréol mardi soir. {{p:simone|Simone}} ne dément pas. Elle range un crayon, puis un autre.

« Roger dit… » Elle s'arrête. « Il est rentré à onze heures vingt. J'ai regardé le réveil. Il est allé dans la buanderie. Il a lavé son pantalon lui-même, à la main, dans l'évier. Il fait jamais ça. Il sait pas où on met la lessive. »

Elle regarde vers le hangar, où son mari parle fort au téléphone. « Il y avait de la poussière noire dans l'eau. »
""", [
    ("p:ferrand", "Alibi", "Rentré chez lui à 23 h 20 le 16, selon Simone. A lavé lui-même son pantalon dans la nuit. De la poussière noire dans l'eau."),
    ("p:simone", "", "Revient sur son témoignage : Roger n'était pas rentré à 21 h."),
])

# =========================================================== MOUNIER

piste("mounier", """
{{p:mounier|Gérard Mounier}} vous parle sur le palier du neuvième étage, en survêtement, la porte tirée derrière lui : sa femme dort, elle travaille de nuit à l'hôpital.

« Je sais rien, moi. Je fais ce qu'on me dit. » Le béton du 17 ? « Le patron a dit de couler, j'ai coulé. »

Mathilde : « Et le 16 au soir, vous étiez à Ferréol avec votre équipe, donc. »

« Non. Le patron a dit de pas venir, mardi. Pour une fois. » Il entend ce qu'il vient de dire. « Ça fait un mois qu'on y va toutes les nuits, et mardi, non. C'est tout. C'est le patron qui décide. »
""", [
    ("p:mounier", "Mardi 16", "« Le patron a dit de pas venir. » Pour la première fois en un mois."),
    ("p:mounier", "Mercredi 17", "A coulé la dalle neuve de Ferréol, sur ordre."),
])

piste("mounier2", """
Vous lui montrez les chiffres : 3 000 tonnes prévues, 400 arrivées à la décharge. {{p:mounier|Mounier}} s'assoit sur une marche. « Le patron a dit qu'on allait me mettre ça sur le dos. Je le savais. »

Depuis octobre, son équipe creuse la nuit dans l'aile est, verse la terre noire dans les fosses et coule une dalle par-dessus. « Ça sent le gasoil, cette terre. Ça brûle les mains. »

Il se tait, puis : « Le 17, avant de couler près de l'escalier, il y avait des traînées sombres par terre. J'ai demandé au patron. Il a dit : "Coule." »
""", [
    ("l:site_ferreol", "Sous les dalles", "Depuis octobre, l'équipe de nuit y enterre une terre noire qui sent le gasoil, sur ordre de Ferrand."),
    ("p:mounier", "Mercredi 17", "Avant de couler près de l'escalier, a vu des traînées sombres au sol. Ferrand : « Coule. »"),
])

# =========================================================== BERTHET

piste("berthet", """
La casse de {{p:berthet|Lucien Berthet}} occupe la cour d'une ancienne verrerie, au bord du Gier. Des carcasses de 4L, des radiateurs en fonte, une grue qui grince.

« Ferréol ? J'y ai jamais mis les pieds, l'ami. » Il vous fait visiter quand même. « Là, le cuivre, dix-huit francs le kilo. Là, l'alu. La fonte, ça vaut rien, l'ami. Un franc vingt, quand ça vaut. »

Il donne un coup de pied dans un tas de radiateurs. « Ferréol, c'est de la fonte. Vous voyez bien que ça m'intéresse pas. »
""", [
    ("p:berthet", "", "Dit n'avoir « jamais mis les pieds » à Ferréol. « La fonte, ça vaut rien. »"),
])

piste("livre", """
Les ferrailleurs doivent tenir un {{d:livre_police|livre de police}}, coté et paraphé par la gendarmerie. Celui de {{p:berthet|Berthet}} est posé sur le bureau de la guérite, sous une tasse sale. Berthet est dans la cour, à la grue.

L'écriture est lente, appliquée, pleine de fautes. « 16/11/93 · 21 h 30 · site Ferréol portail arière · vendeur A.B. · fonte 1,2 t · 1 440 F espèse. »

La même ligne revient le 2 et le 9 novembre. Toujours un mardi.
""", [
    ("d:livre_police", "", "« 16/11/93, 21 h 30, site Ferréol, portail arrière, vendeur A.B., fonte 1,2 t. » Même ligne les mardis 2 et 9 novembre."),
    ("p:berthet", "Mardi 16", "Au portail arrière de Ferréol à 21 h 30, selon son propre registre."),
])

piste("berthet2", """
{{p:berthet|Berthet}} voit le livre ouvert dans vos mains et coupe la grue. « Bon. J'y étais, l'ami. Tous les mardis. C'est pas du vol, c'est de la récupération. »

Mardi 16 : arrivé à neuf heures et demie, reparti à dix heures et demie. « Vers dix heures dix, il y a eu un cri dans l'usine. Un seul. Après, plus rien. Le gardien a dit que c'était les chats. »

Il crache par terre. « Dans la cour, il y avait le camion benne de chez Ferrand. Moteur tiède. J'ai mis la main sur le capot en passant. Réflexe. »
""", [
    ("l:site_ferreol", "Mardi 16", "Un cri vers 22 h 10, puis plus rien, selon Berthet. Le camion benne de Ferrand dans la cour, moteur tiède."),
    ("p:berthet", "Mardi 16", "Au portail arrière de 21 h 30 à 22 h 30."),
])

# =========================================================== DÉCHARGE, PARKING

piste("registre", """
La {{l:decharge|décharge de la Croix-de-l'Orme}} tient ses entrées sur des {{d:registre_decharge|fiches de pesée}} agrafées par chantier. Le préposé, qui ne reçoit pas souvent de visites, vous sort la chemise « Ferrand Frères, Ferréol ».

Vingt-deux fiches, toutes de juillet et d'août. En bas de la dernière, le total, souligné deux fois : 400 tonnes.

« Depuis septembre, plus rien de chez eux. Ils ont fini, je suppose. » Il feuillette encore. « C'est bizarre, pour un gros chantier comme ça. »
""", [
    ("d:registre_decharge", "", "Ferrand Frères, chantier Ferréol : 22 pesées en juillet et août, 400 tonnes au total. Plus rien depuis septembre."),
])

piste("parking", """
Le chantier du parking-relais de Bellevue avance, lui. Trois grues, des banches alignées, un panneau : maître d'ouvrage {{l:cabinet_vallenot|Groupe Vallenot}}, gros œuvre {{l:siege_ferrand|Ferrand Frères}}.

Le chef de chantier, jovial, vous montre le plan de financement punaisé dans son Algeco. Une ligne « études » de 900 000 francs, versée à la {{d:sci_delombre|SCI Delombre}}. « On n'a jamais vu personne de chez eux. Mais bon, on a les plans. » Il hausse les épaules et vous offre un café soluble.
""", [
    ("d:sci_delombre", "", "Touche aussi 900 000 F d'« études » sur le chantier du parking-relais."),
])

# =========================================================== PUZZLES

PUZZLES = {
    "reperage": dict(
        titre="Le reçu déchiré",
        consigne="Quatre morceaux de papier mouillé. Remettez-les dans l'ordre.",
        morceaux=["CASSE BERT", "HET · RIVE-DE-GIER", "Acheté à : A.B. · 16/11/93", "Fonte · 1,2 t · réglé espèces"],
        resultat="{{d:recu_berthet|Reçu}} de la casse de {{p:berthet|Lucien Berthet}}, à Rive-de-Gier. Acheté à : A.B., le 16/11/93. Fonte, 1,2 t, réglé espèces.",
        aide="Yves prend les morceaux, les pose sur son genou et les remet dans l'ordre en dix secondes.",
        notes=[("d:recu_berthet", "", "Casse Berthet, Rive-de-Gier. « Acheté à : A.B., 16/11/93. Fonte, 1,2 t. » Trouvé au portail arrière de Ferréol.")],
    ),
    "facture_tel": dict(
        titre="La facture détaillée",
        consigne="Une trentaine d'appels. Trouvez celui qui ne ressemble pas aux autres.",
        aide="Karim épluche la facture et entoure au feutre l'appel de 22 h 24.",
        resultat="Mardi 16 novembre, 22 h 24. Un appel de 3 minutes, depuis la cabane du gardien, vers le 07 42 18 63. Un numéro de radiotéléphone.",
        notes=[("d:facture_tel", "", "Mardi 16 novembre, 22 h 24 : un appel de 3 minutes depuis la cabane du gardien, vers le 07 42 18 63, un radiotéléphone.")],
    ),
    "coffre": dict(
        titre="Le coffre",
        consigne="Une molette à quatre chiffres.",
        solution="1403",
        indices="Le 14 mars entouré sur le calendrier. La date de la mort de Paul Ferrand, donnée par Odile.",
        resultat="""Le coffre s'ouvre. Dedans, cinq {{d:liasses|liasses de billets de 200 francs}}, chacune serrée par une bande de papier kraft tamponnée par la banque : « 16 NOV. 1993 ». Cinquante mille francs, pas un billet de moins.

Sous les liasses, un faire-part de décès bordé de noir. Paul Ferrand, 1948-1987.""",
        aide="Simone passe la tête par la porte du bureau. « Le 14 mars. C'est toujours le 14 mars, avec lui. »",
        notes=[
            ("d:liasses", "", "50 000 F en cinq liasses de billets de 200 F. Bandes de banque tamponnées « 16 NOV. 1993 ». Dans le coffre de Ferrand."),
            ("p:ferrand", "Son frère", "Garde dans son coffre le faire-part de Paul Ferrand, 1948-1987."),
        ],
    ),
}

# =========================================================== QUESTIONNAIRE

QUESTIONS = [
    dict(id="Q1", points=20, texte="Qui a fait tomber Bernard Faure ?",
         choix=["Roger Ferrand", "Hervé Vallenot", "Marcel Roussillon", "Marcel Chaptal", "Ahmed Bensaïd", "Personne, c'est un accident"],
         bonne="Roger Ferrand"),
    dict(id="Q2", points=20, texte="Pourquoi Bernard Faure était-il à Ferréol le 16 au soir ?",
         choix=["Pour remettre son dossier à la presse", "Pour toucher de l'argent de Roger Ferrand", "Pour constater des travaux illégaux", "Pour y retrouver Marcel Chaptal"],
         bonne="Pour toucher de l'argent de Roger Ferrand"),
    dict(id="Q3", points=20, texte="Qui a laissé Bernard Faure mourir sans appeler les secours ?",
         choix=["Roger Ferrand, seul", "Hervé Vallenot", "Marcel Roussillon", "Ahmed Bensaïd", "Personne, il est mort sur le coup"],
         bonne="Hervé Vallenot"),
    dict(id="Q4", points=10, texte="Où sont passées les 2 600 tonnes de terres polluées ?",
         choix=["Sous les dalles neuves de Ferréol", "Sous le parking-relais de Bellevue", "À la casse Berthet", "Nulle part : elles n'ont jamais existé"],
         bonne="Sous les dalles neuves de Ferréol"),
    dict(id="Q5", points=10, texte="Qui a fait classer l'affaire en accident ?",
         choix=["Marcel Roussillon", "Hervé Vallenot", "Le Dr Lacour, seul", "Le commissaire Borel, de sa propre initiative"],
         bonne="Marcel Roussillon"),
    dict(id="Q6", points=10, texte="Qui a écrit la lettre du « fantôme » ?",
         choix=["Marcel Chaptal", "Ahmed Bensaïd", "Bernard Faure", "Colette Faure"],
         bonne="Marcel Chaptal"),
    dict(id="BONUS", points=5, texte="Qui porte la salamandre ?",
         choix=["Marcel Roussillon", "Hervé Vallenot", "Roger Ferrand", "Le Dr Lacour"],
         bonne="Marcel Roussillon"),
]

SCORE = dict(
    pistes_de_reference=12,
    penalite_par_piste_en_plus=2,
    rangs=[(80, "Réussite majeure"), (60, "Réussite"), (40, "Demi-succès"), (0, "Échec")],
)

# =========================================================== FINS
# La fin dépend des trois questions principales. Des paragraphes s'ajoutent
# selon les réponses aux questions 4 à 6. Un épilogue commun clôt l'affaire.

FINS = [
    dict(id="une", condition="Q1, Q2 et Q3 justes", titre="La une", texte="""
Samedi 27 novembre, la page des Affaires occultes n'est pas en page 14. Elle est en une, sous un titre de Jean-Loup, qui n'aime pas qu'on lui dise non : « Ferréol : le fantôme avait un radiotéléphone ».

Roger Ferrand est mis en examen pour homicide involontaire. Il ne dit presque rien, sauf une phrase au juge, rapportée par Igier : « Je l'ai poussé. Après, c'est l'autre qui a décidé. » Hervé Vallenot est mis en examen pour non-assistance à personne en danger. Ses avocats parlent d'un « malentendu dramatique ». Le Groupe Vallenot annule sa page de publicité du jeudi.

L'article ne cache rien de Bernard Faure. Colette appelle la rédaction le lundi. Elle ne crie pas. Elle demande seulement si c'était nécessaire. Mathilde répond que oui. Elle raccroche, et reste longtemps sans rallumer sa cigarette.
"""),
    dict(id="martyr", condition="Q1 et Q3 justes, Q2 fausse", titre="Le martyr", texte="""
Samedi 27 novembre, l'article fait de Bernard Faure un lanceur d'alerte, mort pour avoir voulu dénoncer un scandale. Ferrand et Vallenot sont mis en examen. La ville organise une minute de silence devant la mairie.

Trois semaines plus tard, l'avocat de Ferrand produit devant le juge les relevés de Faure et les retraits « B.F. ». Un quotidien concurrent titre sur « le martyr qui se faisait payer ». Le Stéphanois publie un rectificatif en page 2. Jean-Loup ne dit rien, ce qui est pire.

Colette Faure ne répond plus au téléphone. Sur la tombe de Bernard, quelqu'un a laissé une enveloppe vide.
"""),
    dict(id="promoteur", condition="Q1 juste, Q3 fausse", titre="Le promoteur", texte="""
Samedi 27 novembre, l'article tient debout : Roger Ferrand a poussé Bernard Faure, et il est mis en examen pour homicide involontaire. Il se tait. Il se taira jusqu'au procès.

Personne ne parle de la Safrane, ni des quatre mégots. Hervé Vallenot se déclare « profondément choqué » et « solidaire de la famille ». Le jeudi suivant, sa page de publicité paraît comme d'habitude dans le Stéphanois, avec une photo de la maquette de Ferréol : des arbres en éponge verte, de petits personnages qui ne vont nulle part.

À Ferréol, quelqu'un a balayé la calamine près de la porte de l'atelier. Les traces de doigts ont disparu. Personne ne sait qui.
"""),
    dict(id="dementi", condition="Q1 fausse", titre="Le démenti", texte="""
L'article paraît le samedi 27 novembre. Le lundi, la mairie publie un communiqué : l'enquête de police a conclu à un accident, et « certains journalistes feraient mieux de s'en tenir aux fantômes ». Le Groupe Vallenot menace de retirer sa publicité de tous les titres du groupe.

Jean-Loup convoque Mathilde. La porte reste fermée une heure. En sortant, elle dit seulement : « Admettons. »

À Ferréol, la dalle a séché. Le chantier reprend en janvier.
"""),
]

FINS_COMPLEMENTS = {
    "Q4": ("Les terres polluées sont retrouvées sous les dalles : la préfecture fait tout rouvrir, et le chantier de Ferréol est arrêté pour deux ans.",
           "Personne ne soulève les dalles. La pépinière d'entreprises ouvre en 1995, sur 2 600 tonnes de terre qui sent le gasoil."),
    "Q5": ("Marcel Roussillon démissionne « pour raisons de santé ». Le commissaire Borel est muté à Montluçon.",
           "Marcel Roussillon est réélu en 1995. Il porte toujours sa chevalière."),
    "Q6": ("Marcel Chaptal ne sera pas poursuivi pour ses lettres. Il repeint lui-même le mur est, en blanc. Le fondeur ne revient plus.",
           "Le Bureau reçoit encore deux lettres du « fantôme » en décembre. Karim les garde dans un tiroir, au cas où."),
}

EPILOGUE = """Le lundi suivant, au courrier du Bureau, une enveloppe sans timbre, déposée à l'accueil du siège. Dedans, une carte de bristol blanc, sans un mot. Juste un dessin à l'encre, très fin : une salamandre dans les flammes. Au dos, une devise en latin : Nutrisco et extinguo.

Odile la regarde longtemps. « Je l'ai déjà vue quelque part. » Elle ne dit pas où."""


MANCHETTES = {
    "une": "Ferréol : le fantôme avait un radiotéléphone",
    "martyr": "Mort pour avoir voulu parler",
    "promoteur": "Ferréol : le patron de BTP mis en examen",
    "dementi": "Le fantôme de Ferréol n'a pas dit son dernier mot",
}

SOLUTION = """Bernard Faure faisait chanter Roger Ferrand, qui enterrait sous des dalles neuves les terres polluées qu'il était payé pour évacuer. Le mardi 16 novembre, Faure vient à Ferréol toucher un dernier paiement. Ils se disputent sur la passerelle de l'atelier de forge, et Ferrand le pousse. Faure survit à la chute. Ferrand appelle Hervé Vallenot depuis la cabane du gardien. Vallenot arrive, voit que Faure respire encore et refuse d'appeler les secours. Il fume quatre cigarillos à côté de lui, puis ils maquillent la chute et s'en vont. Faure meurt vers minuit en rampant vers la porte. Le lendemain, Marcel Roussillon fait classer l'affaire. La lettre du fantôme, elle, était de Marcel Chaptal."""

# (piste, rang de la note) : pistes dont la lecture barre cette note
CONTRADICTIONS = {
    ("intro", 0): ["bensaid2", "lacour2"],
    ("roche", 0): ["standard"],
    ("igier", 0): ["bensaid2"],
    ("lacour", 0): ["lacour2"],
    ("colette", 1): ["colette2"],
    ("bensaid", 0): ["bensaid2"],
    ("chaptal", 0): ["jeannot", "chaptal2"],
    ("ferrand", 0): ["simone2"],
    ("simone", 0): ["simone2"],
    ("berthet", 0): ["livre", "berthet2"],
}

SILENCE = ["bensaid2", "porte", "lacour2"]      # l'ambiance se coupe avant la révélation
SALAMANDRE = ["roussillon"]                    # joue le leitmotiv


# Pages de fax : remplacent la ligne [[fax]] dans le texte de la piste, et s'impriment à l'écran.
FAX = {
    "odile": """GROUPE SARRAZIN · SERVICE DES ARCHIVES · LYON
À : BUREAU DES AFFAIRES OCCULTES, AUX BONS SOINS DU STÉPHANOIS · 2 PAGES

LE STÉPHANOIS, 3 FÉVRIER 1911, PAGE 4, COLONNE DE DROITE
Accident à la forge Ferréol. Un fondeur de dix-neuf ans, Étienne Vial, est tombé hier dans la poche de coulée. La coulée n'a pas été arrêtée. La pièce, une roue de laminoir, est partie pour Le Creusot.

LE STÉPHANOIS, 14 MARS 1987, PAGE 11, EN BAS À GAUCHE
Montreynaud : un entrepreneur écrasé sous une banche. Paul Ferrand, 39 ans, cogérant de Ferrand Frères, est mort sur le chantier de la tour 12. Son frère Roger n'a pas souhaité s'exprimer.

(À la main, en bas de la page :) Rien d'autre sur Ferréol entre 1947 et 1990. Pas une ligne. Bizarre. O.""",
}
