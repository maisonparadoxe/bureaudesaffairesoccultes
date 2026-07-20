// Copie embarquée de data.json, pour un fonctionnement sans serveur (ouverture directe du fichier).
window.GAME_DATA_FALLBACK = {
  "gameTitle": "Bureau des affaires occultes",
  "cities": [
    {
      "id": "saint_etienne",
      "name": "Saint-Étienne",
      "status": "available",
      "cases": [
        {
          "id": "hauts_fourneaux",
          "title": "L'Affaire des Hauts Fourneaux",
          "subtitle": "Une enquête du Stéphanois",
          "year": 1993,
          "totalLeads": 13,
          "intro": "Novembre 1993. À la rédaction du Stéphanois, le radiateur fait plus de bruit que de chaleur, et ça fait trois ans que personne n'a de budget pour le remplacer. Depuis la fermeture de Manufrance, la moitié de la ville pointe au chômage, et les seules bonnes nouvelles qu'on imprime, ce sont les scores de l'ASSE. Ce matin, un coup de fil a changé la donne. Bernard Faure, chargé de mission à l'urbanisme, a été retrouvé mort au pied d'un escalier de l'ancienne Manufacture Ferréol, ce site industriel que la mairie voulait transformer en pépinière d'entreprises. La police parle d'accident, dossier classé avant même l'heure du déjeuner. Vous, vous vous souvenez qu'il vous avait appelés trois jours plus tôt, la voix tendue, pour dire qu'il avait « des documents à montrer ». Vous disposez de 13 pistes pour comprendre ce qui s'est réellement passé, avant que l'affaire ne retombe dans l'oubli comme tant d'autres.",
          "briefing": "Menez des entretiens auprès des personnes impliquées, ou des investigations sur les lieux liés à l'affaire. Chaque piste consultée pour la première fois coûte une unité sur votre total ; relire une piste déjà découverte ne coûte rien. Vous n'aurez pas le temps de tout explorer, et c'est voulu : un bon journaliste choisit ses pistes, il ne les épuise pas toutes. L'annuaire se remplit au fil de vos découvertes : un nom n'y apparaît que lorsqu'il a été mentionné ou rencontré. Quand vous manquerez de pistes, ou que vous penserez tenir le fin mot de l'histoire, il faudra choisir trois lieux où porter l'accusation.",
          "quartiers": [
            {
              "id": "centre",
              "name": "Centre-ville"
            },
            {
              "id": "soleil",
              "name": "Le Soleil"
            },
            {
              "id": "tarentaize",
              "name": "Tarentaize"
            },
            {
              "id": "zone_industrielle",
              "name": "Zone industrielle"
            },
            {
              "id": "bellevue",
              "name": "Bellevue"
            }
          ],
          "locations": [
            {
              "id": "redaction",
              "name": "Rédaction du Stéphanois",
              "quartier": "centre",
              "address": "12 rue de la République"
            },
            {
              "id": "mairie",
              "name": "Mairie, Service Urbanisme",
              "quartier": "centre",
              "address": "Place de l'Hôtel de Ville"
            },
            {
              "id": "domicile_faure",
              "name": "Domicile de Bernard Faure",
              "quartier": "tarentaize",
              "address": "8 rue des Creuses"
            },
            {
              "id": "site_ferreol",
              "name": "Ancien site Manufacture Ferréol",
              "quartier": "soleil",
              "address": "Impasse des Fondeurs"
            },
            {
              "id": "cheval_noir",
              "name": "Café Le Cheval Noir",
              "quartier": "soleil",
              "address": "45 rue de la Montat"
            },
            {
              "id": "cabinet_vallenot",
              "name": "Cabinet Groupe Vallenot",
              "quartier": "centre",
              "address": "3 avenue de la Libération"
            },
            {
              "id": "siege_ferrand",
              "name": "Siège Ferrand Frères BTP",
              "quartier": "zone_industrielle",
              "address": "Zone de la Rivière"
            },
            {
              "id": "parking_relais",
              "name": "Chantier du parking-relais",
              "quartier": "bellevue",
              "address": "Boulevard Thiers"
            },
            {
              "id": "commissariat",
              "name": "Commissariat central",
              "quartier": "centre",
              "address": "Rue Charles de Gaulle"
            }
          ],
          "characters": [
            {
              "id": "faure_bernard",
              "name": "Faure Bernard",
              "role": "Chargé de mission urbanisme (victime)",
              "locationId": "domicile_faure",
              "alwaysRevealed": true
            },
            {
              "id": "faure_colette",
              "name": "Faure Colette",
              "role": "Veuve de Bernard Faure",
              "locationId": "domicile_faure",
              "alwaysRevealed": false
            },
            {
              "id": "roussillon_marcel",
              "name": "Roussillon Marcel",
              "role": "Adjoint au maire, urbanisme",
              "locationId": "mairie",
              "alwaysRevealed": false
            },
            {
              "id": "bensaid_ahmed",
              "name": "Bensaïd Ahmed",
              "role": "Gardien du site Ferréol",
              "locationId": "site_ferreol",
              "alwaysRevealed": false
            },
            {
              "id": "chaptal_marcel",
              "name": "Chaptal Marcel",
              "role": "Ancien syndicaliste CGT",
              "locationId": "cheval_noir",
              "alwaysRevealed": false
            },
            {
              "id": "vallenot_herve",
              "name": "Vallenot Hervé",
              "role": "Promoteur, Groupe Vallenot",
              "locationId": "cabinet_vallenot",
              "alwaysRevealed": false
            },
            {
              "id": "ferrand_roger",
              "name": "Ferrand Roger",
              "role": "Gérant, Ferrand Frères BTP",
              "locationId": "siege_ferrand",
              "alwaysRevealed": false
            },
            {
              "id": "igier_bernard",
              "name": "Igier Bernard",
              "role": "Lieutenant de police",
              "locationId": "commissariat",
              "alwaysRevealed": false
            }
          ],
          "clues": [
            {
              "id": "c_redaction_inv",
              "locationId": "redaction",
              "type": "investigation",
              "title": "Les archives du journal",
              "revealsCharacters": [],
              "text": "Vous étalez sur la table les coupures des derniers mois, jaunies déjà malgré leur fraîcheur. En avril, une pleine page annonçait la reconversion de la {{l:Manufacture Ferréol}} en pépinière d'entreprises, photo du maire, casque de chantier vissé de travers sur la tête, sourire un peu trop grand pour être naturel. Un entrefilet de juillet, en page intérieure, glissé entre les résultats du comice agricole et une brève sur les inondations à Rive-de-Gier, note que le budget a doublé « pour tenir compte de la dépollution du site ». Personne n'a jugé utile d'y revenir. Dans la liste des remerciements de l'inauguration, un nom revient deux fois : {{l:Ferrand Frères}}, gros œuvre. Le {{l:Groupe Vallenot}} porte le projet. Aucune trace d'appel d'offres, nulle part."
            },
            {
              "id": "c_mairie_entretien",
              "locationId": "mairie",
              "type": "entretien",
              "title": "Marcel Roussillon, adjoint à l'urbanisme",
              "revealsCharacters": [
                "roussillon_marcel"
              ],
              "text": "{{p:Marcel Roussillon}} reçoit debout, la porte du bureau restée ouverte sur le couloir, une façon de dire que ça ne durera pas. Sur l'étagère derrière lui, une photo de l'inauguration du gymnase Jean Moulin, lui au deuxième rang, jamais au premier. « {{p:Faure}}, oui. Sérieux. Un peu raide ces derniers temps, mais on lui en demandait beaucoup. » Sur le budget du {{l:projet Ferréol}}, il ouvre les mains, paumes vers le plafond. « Techniquement, la dépollution d'un site comme celui-là, on découvre toujours des choses en cours de route. » Vous demandez pourquoi aucun appel d'offres n'apparaît dans les registres. Il regarde son stylo, le repose bien parallèle au bord du bureau. « Ça, il faudrait voir avec les services. » Un carillon sonne dans le couloir. Il se lève avant vous."
            },
            {
              "id": "c_mairie_investigation",
              "locationId": "mairie",
              "type": "investigation",
              "title": "Le dossier de reconversion",
              "revealsCharacters": [
                "roussillon_marcel"
              ],
              "text": "Une employée du service, à cran depuis qu'il a fallu remplacer {{p:Bernard Faure}} au pied levé, vous laisse feuilleter le {{d:dossier « Ferréol »}} pendant qu'elle va chercher un café. Le budget est passé de 4 à 8,2 millions de francs en trois mois, validé par une délibération signée {{p:Marcel Roussillon}}, sans la moindre mise en concurrence. Une ligne retient votre attention : « études et honoraires de conseil », 1,3 million de francs, versée à une structure au nom sec, {{d:SCI Delombre}}. Vous cherchez ce nom ailleurs dans les dossiers municipaux. Rien. Comme si la structure n'existait que pour cette seule ligne."
            },
            {
              "id": "c_domicile_entretien",
              "locationId": "domicile_faure",
              "type": "entretien",
              "title": "Colette Faure, la veuve",
              "revealsCharacters": [
                "faure_colette"
              ],
              "text": "{{p:Colette Faure}} vous fait entrer, machinalement, comme si elle recevait encore les collègues de son mari. « Il ne dormait plus. Il descendait répondre au téléphone sur le palier, pour que je n'entende pas, je crois. » Elle tourne son alliance autour de son doigt, sans s'en rendre compte. « Avant-hier, il m'a dit : si jamais il m'arrivait quelque chose, il fallait que le journal récupère le {{d:dossier bleu}}, dans son bureau. Je n'ai pas voulu entendre ça. » Elle s'arrête. « Je ne sais même pas ce qu'il y a dedans. »"
            },
            {
              "id": "c_domicile_investigation",
              "locationId": "domicile_faure",
              "type": "investigation",
              "title": "Le bureau de Bernard Faure",
              "revealsCharacters": [
                "vallenot_herve",
                "ferrand_roger"
              ],
              "text": "Le tiroir du bas coince, comme toujours dans les meubles de bureau de l'administration. Sous une pile de notes de frais jamais remboursées, un {{d:classeur bleu}}, le carton ramolli à force d'avoir été feuilleté. Les montants des bons de commande {{l:Ferrand Frères}} sont soulignés au stylo rouge, deux fois, comme s'il n'arrivait pas à y croire lui-même. Un post-it, écriture pressée : « {{p:Vallenot}} sait. {{p:Ferrand}} couvre. Voir {{d:SCI Delombre}}, qui est derrière ? » Coincé entre deux pages, un bout de papier arraché à la hâte : « {{l:Usine Ferréol}}, 22h, apporter dossier. » Pas de nom, pas de signature. Juste cette écriture qui ne ressemble déjà plus à celle des pages précédentes."
            },
            {
              "id": "c_ferreol_entretien",
              "locationId": "site_ferreol",
              "type": "entretien",
              "title": "Ahmed Bensaïd, gardien du site",
              "revealsCharacters": [
                "bensaid_ahmed",
                "ferrand_roger"
              ],
              "text": "{{p:Ahmed Bensaïd}} ouvre le portail sans un mot de trop. Vingt ans de gardiennage, ça apprend à ne pas se mêler de ce qui ne vous regarde pas. « Le soir où le monsieur de la mairie est tombé, j'ai entendu des voix, du côté de l'ancien {{l:atelier de forge}}. Deux hommes. Je suis pas descendu, c'est pas mon rôle. » Il hésite, puis reprend, plus bas, comme s'il se surprenait lui-même à le dire : « Je regarde pas ce qui me regarde pas. Mais des camions à minuit sur un chantier à l'arrêt, ça, je l'ai vu. Ceux de chez {{p:Ferrand}}. Depuis un mois. »"
            },
            {
              "id": "c_ferreol_investigation",
              "locationId": "site_ferreol",
              "type": "investigation",
              "title": "Repérage du chantier",
              "revealsCharacters": [],
              "text": "Le gel des travaux devait tout arrêter. Pourtant, dans l'aile est, une dalle de béton toute fraîche a été coulée, exactement là où l'escalier de la victime a cédé. Près d'une benne à moitié pleine, un {{d:bon de livraison}} {{l:Ferrand Frères}} traîne, daté de la nuit de la mort de {{p:Faure}}, une mention griffonnée au stylo bille : « Dépose matériel, RF sur place. » La marche descellée ne montre aucune trace de rouille ni d'usure. Les fixations arrachées sont propres, nettes, comme si on venait tout juste de les retirer."
            },
            {
              "id": "c_chevalnoir_entretien",
              "locationId": "cheval_noir",
              "type": "entretien",
              "title": "Marcel Chaptal, ancien syndicaliste",
              "revealsCharacters": [
                "chaptal_marcel",
                "ferrand_roger"
              ],
              "text": "{{p:Marcel Chaptal}} parle bas, le coude sur le zinc, un ballon de rouge qu'il ne finira pas. « Ferréol, mon gars, ça a toujours été un panier de crabes. Nous on trime, eux ils signent des papiers dans leur bureau chauffé. » Il rit, sans joie. « {{l:Ferréol}}, {{p:Ferrand}}, je l'ai vu une fois, complètement bourré, à une réunion publique, se vanter d'avoir des amis qui ferment les yeux, place de l'Hôtel de Ville. Personne a bronché. Ici, tout le monde a besoin de ces chantiers pour bouffer. » Il finit par refuser de témoigner officiellement. « J'ai encore un gars qui bosse dans le BTP, moi. Faut pas pousser. »"
            },
            {
              "id": "c_vallenot_entretien",
              "locationId": "cabinet_vallenot",
              "type": "entretien",
              "title": "Hervé Vallenot, le promoteur",
              "revealsCharacters": [
                "vallenot_herve",
                "ferrand_roger"
              ],
              "text": "{{p:Hervé Vallenot}} reçoit dans un bureau qui sent le café frais et le mobilier neuf, tout sourire, main tendue avant même que vous ayez ouvert la bouche. « {{l:Ferréol}}, c'est un vrai projet de ville, vous savez. Après, je comprends que les habitudes, ça se bouscule pas comme ça. » Sur le dépassement de budget, il écarte la question d'un geste léger, comme on chasse une mouche. « La dépollution, c'est technique, ça. Allez donc voir du côté de la mairie. » Quand vous prononcez le nom de {{p:Ferrand}}, le sourire tient bon, mais la mâchoire, elle, se crispe un quart de seconde. « {{p:Roger}} fait du bon travail. Allez lui poser vos questions, à lui, s'il a le temps entre deux chantiers. »"
            },
            {
              "id": "c_vallenot_investigation",
              "locationId": "cabinet_vallenot",
              "type": "investigation",
              "title": "Le bureau de Vallenot",
              "revealsCharacters": [
                "roussillon_marcel"
              ],
              "text": "La secrétaire s'absente deux minutes, le temps d'aller chercher un dossier, et deux minutes, c'est déjà beaucoup. Sur un classeur mal refermé, une {{d:facture de « conseil en stratégie urbaine »}} émise par la {{d:SCI Delombre}}, 1,3 million de francs, sans le moindre livrable en pièce jointe. Le nom du gérant, presque illisible sur le tampon, est noté à la main dans la marge : « M. Delombre, beau-frère MR. » Les initiales, vous les avez déjà lues ailleurs. Celles de {{p:Marcel Roussillon}}."
            },
            {
              "id": "c_ferrand_entretien",
              "locationId": "siege_ferrand",
              "type": "entretien",
              "title": "Roger Ferrand, patron de BTP",
              "revealsCharacters": [
                "ferrand_roger"
              ],
              "text": "{{p:Roger Ferrand}} ne s'assoit pas, vous non plus. Dans le hangar, un poste crache RTL en sourdine, noyé sous le bruit d'un compresseur que personne ne va couper pour vous. « J'étais chez moi. Comme tous les soirs. Demandez à ma femme. » Quand vous parlez des livraisons de nuit sur le {{l:site Ferréol}}, il s'essuie les mains sur son bleu de travail, lentement, une main puis l'autre. « Je livre du matériel, moi. Vous êtes en train de dire quoi, là, exactement ? » Il ne hausse pas la voix. Il n'en a pas besoin. Il a déjà fait deux pas vers la porte, et vous suivez."
            },
            {
              "id": "c_ferrand_investigation",
              "locationId": "siege_ferrand",
              "type": "investigation",
              "title": "La comptabilité de Ferrand Frères",
              "revealsCharacters": [],
              "text": "Sur un bureau qu'on dirait abandonné en plein milieu d'une journée de travail, un {{d:registre de virements}} traîne, grand ouvert. Trois versements vers la {{d:SCI Delombre}}, un total qui colle, au franc près, à la facture retrouvée chez {{p:Vallenot}}. Un {{d:agenda de chantier}}, à la date de la mort de {{p:Faure}} : « 22h, {{l:Ferréol}}, urgent, l'urbaniste veut tout arrêter. RF sur place. » La page du lendemain manque. Arrachée proprement, au ras de la reliure."
            },
            {
              "id": "c_parking_investigation",
              "locationId": "parking_relais",
              "type": "investigation",
              "title": "Le chantier du parking-relais",
              "revealsCharacters": [],
              "text": "Autre chantier municipal, même histoire. Le {{l:parking-relais de Bellevue}}, confié lui aussi à {{l:Ferrand Frères}} sur recommandation du {{l:Groupe Vallenot}}, présente la même ligne « études », facturée à la même {{d:SCI Delombre}}. Ce n'est donc pas un accident isolé, mais une mécanique bien huilée, répétée d'un marché à l'autre. Rien, ici, ne relie directement ce chantier à la mort de {{p:Bernard Faure}}. Mais ça ne vous rassure pas pour autant."
            },
            {
              "id": "c_commissariat_entretien",
              "locationId": "commissariat",
              "type": "entretien",
              "title": "Lieutenant Igier, un contact au commissariat",
              "revealsCharacters": [
                "igier_bernard"
              ],
              "text": "{{p:Igier}} vous retrouve au comptoir d'un café, jamais au commissariat, question d'habitude. « Entre nous, hein. Le dossier a été bouclé en deux jours. Chute accidentelle, tampon, classé. Pas d'autopsie poussée. » Il tourne sa cuillère dans un café qu'il ne boit pas. « D'habitude, un fonctionnaire retrouvé mort sur un chantier, on prend plus de gants. Là, non. » Il baisse la voix encore d'un cran. « On m'a fait comprendre qu'il valait mieux ne pas gratter. Je vous ai rien dit, hein. »"
            }
          ],
          "interventionTargets": [
            "mairie",
            "cabinet_vallenot",
            "siege_ferrand",
            "site_ferreol"
          ],
          "interventionCombos": [
            {
              "set": [
                "mairie",
                "cabinet_vallenot",
                "siege_ferrand"
              ],
              "points": 7,
              "text": "Face aux preuves étalées sur son bureau, le {{d:dossier bleu}}, les {{d:factures de la SCI Delombre}}, le {{d:bon de livraison}} de cette nuit-là, {{p:Marcel Roussillon}} finit par craquer et reconnaît le montage via la société de son beau-frère. Confronté séparément, {{p:Hervé Vallenot}} lâche {{p:Roger Ferrand}} sans hésiter, pour sauver ce qui peut encore l'être. {{p:Ferrand}}, pris de court, admet enfin s'être rendu sur le {{l:site Ferréol}} ce soir-là pour empêcher {{p:Faure}} de tout révéler. La dispute a mal tourné, dit-il, comme si ça suffisait à l'excuser. Votre article, publié en une du Stéphanois, provoque la démission de {{p:Roussillon}}, la mise en examen de {{p:Ferrand}} pour homicide involontaire, et l'ouverture d'une enquête sur l'ensemble des marchés du {{l:Groupe Vallenot}}. RÉUSSITE MAJEURE."
            },
            {
              "set": [
                "mairie",
                "cabinet_vallenot",
                "site_ferreol"
              ],
              "points": 3,
              "text": "Le système de surfacturation entre la mairie et le {{l:Groupe Vallenot}} ne résiste pas longtemps à vos questions, et vos relevés du chantier confirment des travaux menés en toute illégalité. Mais vous n'avez jamais confronté {{p:Roger Ferrand}} directement, et rien ne le relie, sur le papier, à la mort de {{p:Faure}}. Votre article fait grand bruit sur le plan financier, {{p:Roussillon}} est écarté, mais la mort de {{p:Bernard Faure}} reste classée en accident. Le responsable ne sera jamais inquiété. ÉCHEC : l'essentiel vous a échappé."
            },
            {
              "set": [
                "mairie",
                "siege_ferrand",
                "site_ferreol"
              ],
              "points": 6,
              "text": "Confronté au {{d:dossier bleu}} et au {{d:bon de livraison}}, {{p:Roger Ferrand}} finit par s'effondrer et reconnaît sa dispute avec {{p:Faure}}, cette nuit-là. {{p:Roussillon}}, pris à revers par la mise en cause directe de {{p:Ferrand}}, admet à son tour le montage de la {{d:SCI Delombre}}, histoire de limiter les dégâts pour lui-même. Votre article fait grand bruit : {{p:Ferrand}} est mis en examen pour homicide involontaire, {{p:Roussillon}} démissionne. Faute des preuves comptables saisies chez {{p:Vallenot}}, celui-ci plaide l'ignorance et garde son entreprise intacte. RÉUSSITE : la ville respire, mais un responsable a gardé les mains libres."
            },
            {
              "set": [
                "cabinet_vallenot",
                "siege_ferrand",
                "site_ferreol"
              ],
              "points": 5,
              "text": "{{p:Vallenot}} et {{p:Ferrand}}, confrontés ensemble aux preuves matérielles du chantier, finissent par se dénoncer mutuellement, chacun cherchant à sauver sa peau : {{p:Ferrand}} pour la mort de {{p:Faure}}, {{p:Vallenot}} pour le système de surfacturation. Votre article aboutit à leur mise en examen. Mais jamais confronté directement, {{p:Marcel Roussillon}} nie tout lien avec la {{d:SCI Delombre}} de son beau-frère et conserve son siège d'adjoint, se contentant de déplorer publiquement « des pratiques qu'il ignorait totalement ». RÉUSSITE : les auteurs directs tombent, le protecteur politique reste en place."
            }
          ],
          "interventionFallback": {
            "points": 0,
            "text": "Vos accusations, mal ciblées, ne trouvent pas de prise : les personnes ou les lieux que vous avez choisis n'ont pas de lien assez direct avec l'affaire pour que votre dossier tienne debout. Votre article paraît, mais faute de preuves suffisamment solides, il est démenti dès le lendemain par un communiqué de la mairie, et l'affaire Faure retombe dans l'oubli. ÉCHEC."
          }
        }
      ]
    },
    {
      "id": "nyons",
      "name": "Nyons",
      "status": "coming_next",
      "cases": []
    },
    {
      "id": "lyon",
      "name": "Lyon",
      "status": "coming_soon",
      "cases": []
    },
    {
      "id": "annecy",
      "name": "Annecy",
      "status": "coming_soon",
      "cases": []
    },
    {
      "id": "marseille",
      "name": "Marseille",
      "status": "coming_soon",
      "cases": []
    },
    {
      "id": "paris",
      "name": "Paris",
      "status": "coming_soon",
      "cases": []
    },
    {
      "id": "rennes",
      "name": "Rennes",
      "status": "coming_soon",
      "cases": []
    },
    {
      "id": "bordeaux",
      "name": "Bordeaux",
      "status": "coming_soon",
      "cases": []
    },
    {
      "id": "perpignan",
      "name": "Perpignan",
      "status": "coming_soon",
      "cases": []
    },
    {
      "id": "montpellier",
      "name": "Montpellier",
      "status": "coming_soon",
      "cases": []
    },
    {
      "id": "strasbourg",
      "name": "Strasbourg",
      "status": "coming_soon",
      "cases": []
    },
    {
      "id": "besancon",
      "name": "Besançon",
      "status": "coming_soon",
      "cases": []
    },
    {
      "id": "orleans",
      "name": "Orléans",
      "status": "coming_soon",
      "cases": []
    },
    {
      "id": "bourges",
      "name": "Bourges",
      "status": "coming_soon",
      "cases": []
    }
  ]
};
