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
          "intro": "Novembre 1993. À la rédaction du Stéphanois, le radiateur fait plus de bruit que de chaleur, et ça fait trois ans que personne n'a de budget pour le remplacer. Depuis la fermeture de Manufrance, la moitié de la ville pointe au chômage, et les seules bonnes nouvelles qu'on imprime, ce sont les scores de l'ASSE. Ce matin, un coup de fil a changé la donne. Bernard Faure, chargé de mission à l'urbanisme, a été retrouvé mort au pied d'un escalier de l'ancienne Manufacture Ferréol, ce site industriel que la mairie voulait transformer en pépinière d'entreprises. La police parle d'accident, dossier classé avant même l'heure du déjeuner. Vous, vous vous souvenez qu'il vous avait appelés trois jours plus tôt, la voix tendue, pour dire qu'il avait « des documents à montrer ». Personne d'autre n'a reçu cet appel. À vous de comprendre ce qu'il voulait vous montrer, avant qu'un autre que vous ne décide que l'affaire est close.",
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
              "text": "{{p:Marcel Roussillon}} reçoit debout, la porte du bureau restée ouverte sur le couloir, une façon de dire que ça ne durera pas. Sur l'étagère derrière lui, une photo de l'inauguration du gymnase Jean Moulin, lui au deuxième rang, jamais au premier. « {{p:Faure}}, oui. Sérieux. Un peu raide ces derniers temps, mais on lui en demandait beaucoup. » Sur le budget du {{l:projet Ferréol}}, il ouvre les mains, paumes vers le plafond. « Techniquement, la dépollution d'un site industriel, ça réserve toujours des surprises en cours de route. » Vous demandez pourquoi aucun appel d'offres n'apparaît dans les registres. Il regarde son stylo, le repose bien parallèle au bord du bureau. « Ça, il faudrait voir avec les services. » Un carillon sonne dans le couloir. Il se lève avant vous."
            },
            {
              "id": "c_mairie_investigation",
              "locationId": "mairie",
              "type": "investigation",
              "title": "Le dossier de reconversion",
              "revealsCharacters": [
                "roussillon_marcel"
              ],
              "text": "Une employée du service, à cran depuis qu'il a fallu remplacer {{p:Bernard Faure}} au pied levé, vous laisse feuilleter le {{d:dossier « Ferréol »}} pendant qu'elle va chercher un café. Le budget est passé de 4 à 8,2 millions de francs en trois mois, validé par une délibération signée {{p:Marcel Roussillon}}, sans la moindre mise en concurrence. Une ligne retient votre attention : « études et honoraires de conseil », 1,3 million de francs, versée à une structure au nom sec, {{d:SCI Delombre}}. Vous cherchez ce nom ailleurs dans les dossiers municipaux. Rien. Une structure fantôme, qui n'existe, sur le papier, que pour cette seule ligne."
            },
            {
              "id": "c_domicile_entretien",
              "locationId": "domicile_faure",
              "type": "entretien",
              "title": "Colette Faure, la veuve",
              "revealsCharacters": [
                "faure_colette"
              ],
              "text": "{{p:Colette Faure}} vous fait entrer par automatisme, le geste d'une femme qui a reçu les collègues de son mari des dizaines de fois et n'a pas encore réappris à faire autrement. « Il ne dormait plus. Il descendait répondre au téléphone sur le palier, pour que je n'entende pas, je crois. » Elle tourne son alliance autour de son doigt, sans s'en rendre compte. « Avant-hier, il m'a dit : si jamais il m'arrivait quelque chose, il fallait que le journal récupère le {{d:dossier bleu}}, dans son bureau. Je n'ai pas voulu entendre ça. » Elle s'arrête. « Je ne sais même pas ce qu'il y a dedans. »"
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
              "text": "Le tiroir du bas coince. Un classique du mobilier de bureau fourni par l'administration, jamais vraiment d'aplomb. Sous une pile de notes de frais jamais remboursées, un {{d:classeur bleu}}, le carton ramolli à force d'avoir été feuilleté. Les montants des bons de commande {{l:Ferrand Frères}} sont soulignés au stylo rouge, et soulignés une seconde fois, le trait plus appuyé, celui d'un homme qui relit un chiffre en espérant s'être trompé. Un post-it, écriture pressée : « {{p:Vallenot}} sait. {{p:Ferrand}} couvre. Voir {{d:SCI Delombre}}, qui est derrière ? » Coincé entre deux pages, un bout de papier arraché à la hâte : « {{l:Usine Ferréol}}, 22h, apporter dossier. » Pas de nom, pas de signature. Juste cette écriture qui ne ressemble déjà plus à celle des pages précédentes."
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
              "text": "{{p:Ahmed Bensaïd}} ouvre le portail sans un mot de trop. Vingt ans de gardiennage, ça apprend à ne pas se mêler de ce qui ne vous regarde pas. « Le soir où le monsieur de la mairie est tombé, j'ai entendu des voix, du côté de l'ancien {{l:atelier de forge}}. Deux hommes. Je suis pas descendu, c'est pas mon rôle. » Il hésite, puis reprend, plus bas, la voix de quelqu'un qui s'entend dire une chose qu'il n'avait pas prévu de dire : « Je regarde pas ce qui me regarde pas. Mais des camions à minuit sur un chantier à l'arrêt, ça, je l'ai vu. Ceux de chez {{p:Ferrand}}. Depuis un mois. »"
            },
            {
              "id": "c_ferreol_investigation",
              "locationId": "site_ferreol",
              "type": "investigation",
              "title": "Repérage du chantier",
              "revealsCharacters": [],
              "text": "Le gel des travaux devait tout arrêter. Pourtant, dans l'aile est, une dalle de béton toute fraîche a été coulée, exactement là où l'escalier de la victime a cédé. Près d'une benne à moitié pleine, un {{d:bon de livraison}} {{l:Ferrand Frères}} traîne, daté de la nuit de la mort de {{p:Faure}}, une mention griffonnée au stylo bille : « Dépose matériel, RF sur place. » La marche descellée ne montre aucune trace de rouille ni d'usure. Les fixations arrachées sont propres, nettes, sans la moindre trace de rouille. Retirées récemment, pas usées par le temps."
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
              "text": "{{p:Hervé Vallenot}} reçoit dans un bureau qui sent le café frais et le mobilier neuf, tout sourire, main tendue avant même que vous ayez ouvert la bouche. « {{l:Ferréol}}, c'est un vrai projet de ville, vous savez. Après, je comprends que les habitudes, ça se bouscule pas comme ça. » Sur le dépassement de budget, il écarte la question d'un geste léger, celui qu'on réserve à une mouche plutôt qu'à une vraie objection. « La dépollution, c'est technique, ça. Allez donc voir du côté de la mairie. » Quand vous prononcez le nom de {{p:Ferrand}}, le sourire tient bon, mais la mâchoire, elle, se crispe un quart de seconde. « {{p:Roger}} fait du bon travail. Allez lui poser vos questions, à lui, s'il a le temps entre deux chantiers. »"
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
              "text": "Face aux preuves étalées sur son bureau, le {{d:dossier bleu}}, les {{d:factures de la SCI Delombre}}, le {{d:bon de livraison}} de cette nuit-là, {{p:Marcel Roussillon}} finit par craquer et reconnaît le montage via la société de son beau-frère. Confronté séparément, {{p:Hervé Vallenot}} lâche {{p:Roger Ferrand}} sans hésiter, pour sauver ce qui peut encore l'être. {{p:Ferrand}}, pris de court, admet enfin s'être rendu sur le {{l:site Ferréol}} ce soir-là pour empêcher {{p:Faure}} de tout révéler. La dispute a mal tourné, dit-il, sur le ton d'une explication qu'il croit suffisante pour excuser le reste. Votre article, publié en une du Stéphanois, provoque la démission de {{p:Roussillon}}, la mise en examen de {{p:Ferrand}} pour homicide involontaire, et l'ouverture d'une enquête sur l'ensemble des marchés du {{l:Groupe Vallenot}}. RÉUSSITE MAJEURE."
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
      "status": "available",
      "cases": [
        {
          "id": "puits_des_forts",
          "title": "Le Puits des Forts",
          "subtitle": "Une enquête du Pontias",
          "year": 1994,
          "totalLeads": 13,
          "intro": "Mars 1994. À Nyons, le printemps arrive plus tôt qu'ailleurs, les oliviers commencent à peine à bourgeonner et le marché du jeudi retrouve ses habitués sous les platanes. Mais depuis dix jours, une absence intrigue tout le quartier des Forts : Gaspard Reynier, l'antiquaire de la rue des Grands Forts, ne répond plus à sa porte. Sa gouvernante a donné l'alerte, la gendarmerie a jeté un œil rapide et conclu à un départ précipité, peut-être une fugue de vieil homme fatigué de sa propre collection. Vous, à la rédaction du Pontias, vous n'y croyez pas : Reynier n'a jamais quitté cette maison plus de deux jours d'affilée depuis vingt ans. Quelque part dans cette ville, quelqu'un sait exactement où il se trouve. Il faut juste le trouver avant qu'il ne soit trop tard pour lui.",
          "briefing": "Menez des entretiens auprès des personnes impliquées, ou des investigations sur les lieux liés à l'affaire. Chaque piste consultée pour la première fois coûte une unité sur votre total ; relire une piste déjà découverte ne coûte rien. Vous n'aurez pas le temps de tout explorer, et c'est voulu : un bon journaliste choisit ses pistes, il ne les épuise pas toutes. L'annuaire se remplit au fil de vos découvertes : un nom n'y apparaît que lorsqu'il a été mentionné ou rencontré. Quand vous manquerez de pistes, ou que vous penserez tenir le fin mot de l'histoire, il faudra choisir trois lieux où porter secours et confronter les responsables.",
          "quartiers": [
            {
              "id": "centre_ville",
              "name": "Centre-ville"
            },
            {
              "id": "quartier_forts",
              "name": "Quartier des Forts"
            },
            {
              "id": "rocher_maupas",
              "name": "Rocher du Maupas"
            },
            {
              "id": "bords_eygues",
              "name": "Bords de l'Eygues"
            },
            {
              "id": "alentours",
              "name": "Alentours"
            }
          ],
          "locations": [
            {
              "id": "redaction_pontias",
              "name": "Rédaction du Pontias",
              "quartier": "centre_ville",
              "address": "5 place des Arcades"
            },
            {
              "id": "gendarmerie",
              "name": "Brigade de gendarmerie",
              "quartier": "centre_ville",
              "address": "Avenue de la Digue"
            },
            {
              "id": "marche_jeudi",
              "name": "Étal de Roland Pastier, marché du jeudi",
              "quartier": "centre_ville",
              "address": "Place aux Platanes"
            },
            {
              "id": "maison_reynier",
              "name": "Maison Reynier",
              "quartier": "quartier_forts",
              "address": "14 rue des Grands Forts"
            },
            {
              "id": "boutique_delaroche",
              "name": "Antiquités Delaroche",
              "quartier": "quartier_forts",
              "address": "3 rue des Petits Forts"
            },
            {
              "id": "tour_randonne",
              "name": "Tour Randonne",
              "quartier": "rocher_maupas",
              "address": "Chemin de la Tour"
            },
            {
              "id": "pont_romain",
              "name": "Le Pont Roman",
              "quartier": "bords_eygues",
              "address": "Quai des Platanes"
            },
            {
              "id": "atelier_fontanet",
              "name": "Atelier Fontanet",
              "quartier": "alentours",
              "address": "Chemin de Venterol"
            }
          ],
          "characters": [
            {
              "id": "gaspard_reynier",
              "name": "Reynier Gaspard",
              "role": "Antiquaire, propriétaire de la maison des Grands Forts (disparu)",
              "locationId": "maison_reynier",
              "alwaysRevealed": true
            },
            {
              "id": "odette_sabatier",
              "name": "Sabatier Odette",
              "role": "Gouvernante de Gaspard Reynier",
              "locationId": "maison_reynier",
              "alwaysRevealed": false
            },
            {
              "id": "julien_reynier",
              "name": "Reynier Julien",
              "role": "Neveu et héritier présumé",
              "locationId": "pont_romain",
              "alwaysRevealed": false
            },
            {
              "id": "roland_pastier",
              "name": "Pastier Roland",
              "role": "Brocanteur, marché du jeudi",
              "locationId": "marche_jeudi",
              "alwaysRevealed": false
            },
            {
              "id": "elie_fontanet",
              "name": "Fontanet Élie",
              "role": "Restaurateur de meubles",
              "locationId": "atelier_fontanet",
              "alwaysRevealed": false
            },
            {
              "id": "basile_long",
              "name": "Long Basile",
              "role": "Ancien maçon, connaît les souterrains",
              "locationId": "tour_randonne",
              "alwaysRevealed": false
            },
            {
              "id": "antoine_delaroche",
              "name": "Delaroche Antoine",
              "role": "Antiquaire, rue des Petits Forts",
              "locationId": "boutique_delaroche",
              "alwaysRevealed": false
            },
            {
              "id": "vasseur",
              "name": "Adjudant Vasseur",
              "role": "Gendarmerie de Nyons",
              "locationId": "gendarmerie",
              "alwaysRevealed": false
            }
          ],
          "clues": [
            {
              "id": "c_redaction_inv",
              "locationId": "redaction_pontias",
              "type": "investigation",
              "title": "Les archives du Pontias",
              "revealsCharacters": [
                "antoine_delaroche",
                "elie_fontanet"
              ],
              "text": "Les archives du Pontias ne remontent pas bien loin, le journal n'a que huit ans d'existence, mais ça suffit. Un portrait flatteur, publié l'an dernier, présente {{p:Antoine Delaroche}} comme « le nouvel œil expert de la brocante nyonsaise », installé rue des Petits Forts depuis peu, déjà consulté par plusieurs collectionneurs de la région. Un autre article, plus modeste, consacré aux artisans du coin, cite {{p:Élie Fontanet}}, restaurateur de meubles à l'{{l:atelier}} du chemin de Venterol, « capable de redonner vie à n'importe quelle pièce du XVIIIe ». Aucun des deux articles ne mentionne {{p:Gaspard Reynier}}, pourtant propriétaire de la plus ancienne collection privée de la ville. Lui n'a jamais rien demandé à personne, et surtout pas qu'on parle de lui."
            },
            {
              "id": "c_gendarmerie_entretien",
              "locationId": "gendarmerie",
              "type": "entretien",
              "title": "Adjudant Vasseur",
              "revealsCharacters": [
                "vasseur"
              ],
              "text": "L'adjudant {{p:Vasseur}} vous reçoit dans un bureau où tout est rangé à angle droit, dossiers compris. « Monsieur Reynier n'est pas un homme jeune, et sa maison est pleine d'escaliers et de recoins. Nous privilégions l'hypothèse d'une chute, ou d'un malaise. » Vous demandez pourquoi personne n'a fouillé la cave en profondeur. « Nous avons constaté qu'elle était fermée à clé. Une porte fermée à clé, pour nous, ça n'indique pas une urgence. » Il referme le dossier, aligné bien droit sur le reste de la pile. « Si de nouveaux éléments apparaissent, nous rouvrirons le dossier. Officiellement. »"
            },
            {
              "id": "c_gendarmerie_investigation",
              "locationId": "gendarmerie",
              "type": "investigation",
              "title": "Les plans de défense passive",
              "revealsCharacters": [],
              "text": "Un vieux classeur, rangé au sous-sol du poste, contient les plans de défense passive établis après-guerre : caves, souterrains, abris recensés dans tout le centre ancien. Un plan jauni, à moitié déchiré, montre un réseau de galeries reliant plusieurs caves du {{l:quartier des Forts}} à un point unique, plus haut sur le plan, simplement annoté « Château ». La légende précise que plusieurs de ces passages ont été « comblés ou murés » dans les années 1960. Pas tous, semble-t-il."
            },
            {
              "id": "c_marche_entretien",
              "locationId": "marche_jeudi",
              "type": "entretien",
              "title": "Roland Pastier, brocanteur",
              "revealsCharacters": [
                "roland_pastier"
              ],
              "text": "{{p:Roland Pastier}} vend de tout sur son étal, des fers à repasser aux missels, et ne s'arrête jamais vraiment de parler, même à vous. « Reynier ? Un vrai connaisseur, celui-là, pas comme certains qui se prétendent experts sans avoir jamais soulevé un meuble de leur vie. » Il jette un œil mauvais vers la rue des Petits Forts. « {{p:Delaroche}}, tenez. Il m'a acheté trois fossiles la semaine dernière, pour une bouchée de pain, en me jurant qu'ils étaient sans intérêt. Je les ai revus en vitrine chez lui, étiquetés le triple. » Il hausse les épaules, philosophe. « Le commerce, c'est le commerce. »"
            },
            {
              "id": "c_marche_investigation",
              "locationId": "marche_jeudi",
              "type": "investigation",
              "title": "Sous l'étal",
              "revealsCharacters": [],
              "text": "En fouillant les caisses sous l'étal de {{p:Pastier}}, pendant qu'il négocie avec un client, vous tombez sur une petite ammonite fossilisée, encore enveloppée dans un morceau de papier journal. Au dos du papier, un tampon à moitié effacé : celui de la {{l:Maison Reynier}}. Ce n'est pas le genre d'objet qu'on laisse traîner dans une caisse à deux francs, à moins de ne pas savoir ce qu'on a entre les mains, ou de très bien le savoir et vouloir s'en débarrasser vite."
            },
            {
              "id": "c_maison_entretien",
              "locationId": "maison_reynier",
              "type": "entretien",
              "title": "Odette Sabatier, la gouvernante",
              "revealsCharacters": [
                "odette_sabatier",
                "julien_reynier"
              ],
              "text": "{{p:Odette Sabatier}} parle vite, beaucoup, et revient sans cesse en arrière, une phrase n'attendant jamais que la précédente soit vraiment finie. « Monsieur Reynier ne serait jamais parti sans prévenir, jamais, il me demandait toujours, même pour aller chercher le pain, enfin presque, il avait ses habitudes, vous comprenez, et puis il y a eu cette histoire avec son neveu, {{p:Julien}}, qui voulait vendre la maison, vendre tout, les meubles, la collection, tout, et Monsieur Reynier, ça l'a beaucoup contrarié, il en parlait la nuit, je l'entendais à travers le mur, il n'arrivait plus à dormir. » Elle s'arrête, essoufflée. « Vous croyez qu'il lui est arrivé quelque chose de grave ? »"
            },
            {
              "id": "c_maison_investigation",
              "locationId": "maison_reynier",
              "type": "investigation",
              "title": "La cave et le puits",
              "revealsCharacters": [],
              "text": "La cave sent la pierre humide et le salpêtre. Contre le mur du fond, un vieux puits, muré en apparence, mais la margelle porte des traces de corde toutes fraîches. Quelqu'un s'y est appuyé récemment. Ou y est descendu. Une échelle de meunier, habituellement posée contre la paroi, manque à l'appel. Sur l'établi voisin, un carnet à moitié rempli, de l'écriture serrée et précise d'un homme habitué à décrire des objets plutôt que des sentiments : « 14 mars. Le plateau Directoire du salon n'est plus le même. Le grain du bois ne ment pas. » Plus loin : « Si j'ai raison, je le saurai en descendant. B.L. m'a parlé d'un passage, autrefois. Personne ne me croira sans preuve. »"
            },
            {
              "id": "c_delaroche_entretien",
              "locationId": "boutique_delaroche",
              "type": "entretien",
              "title": "Antoine Delaroche, antiquaire",
              "revealsCharacters": [
                "antoine_delaroche"
              ],
              "text": "{{p:Antoine Delaroche}} reçoit dans une boutique où chaque objet semble avoir sa propre petite lumière, chaude, flatteuse. « Gaspard Reynier, quel dommage, un puriste, une autre époque. » Sur les fossiles achetés à {{p:Pastier}}, il sourit, presque désolé pour vous. « Le marché de la brocante, cher monsieur, c'est aussi savoir reconnaître ce que les autres ne voient pas. Ce n'est pas malhonnête, c'est de l'expertise. » Vous mentionnez le triplement du prix. Le sourire ne bouge pas d'un millimètre. « L'authentification a un coût. Le vôtre, de métier, ne fonctionne pas autrement, si vous y réfléchissez bien. »"
            },
            {
              "id": "c_delaroche_investigation",
              "locationId": "boutique_delaroche",
              "type": "investigation",
              "title": "L'arrière-boutique",
              "revealsCharacters": [
                "elie_fontanet"
              ],
              "text": "Derrière un rideau de velours qui sépare la boutique de l'arrière-salle, une pièce plus terne, sans les petites lumières chaudes du magasin. Sur une table, un plateau Directoire, presque identique à celui décrit dans le carnet de {{p:Reynier}}, sauf que le bois, sous la lampe, paraît trop neuf pour son vernis. Une facture, à moitié cachée sous un chiffon : {{d:atelier Fontanet}}, « restauration, finition d'époque », payée en liquide. Le mot « restauration » est souligné deux fois, avec l'humour discret de ceux qui savent exactement ce que le mot recouvre."
            },
            {
              "id": "c_tour_investigation",
              "locationId": "tour_randonne",
              "type": "investigation",
              "title": "Repérage depuis la tour",
              "revealsCharacters": [],
              "text": "Depuis le parvis de la {{l:Tour Randonne}}, la vue plonge sur les toits du {{l:quartier des Forts}}, sur le lacis de ruelles voûtées et, plus bas, sur l'ombre d'un renfoncement dans la roche, à moitié caché par un figuier sauvage. Une vieille grille rouillée, qu'on ne repère pas depuis la rue si on ne sait pas exactement où chercher, semble condamner une ouverture dans la paroi. Le genre d'endroit que personne ne remarque, sauf ceux qui le cherchent."
            },
            {
              "id": "c_tour_entretien",
              "locationId": "tour_randonne",
              "type": "entretien",
              "title": "Basile Long, ancien maçon",
              "revealsCharacters": [
                "basile_long"
              ],
              "text": "{{p:Basile Long}} reprend son souffle en haut des marches, une main sur la rambarde, l'autre sur sa casquette. « J'ai posé des pavés dans ce quartier pendant trente ans, alors les souterrains, j'en connais un rayon. » Il raconte, avec l'air de quelqu'un qui a déjà raconté ça cent fois : « Autrefois, les caves du bas de la rue des Grands Forts communiquaient entre elles, et avec le rocher, jusqu'au pied du château. On a muré la plupart des passages dans les années soixante, sécurité oblige. La plupart. » Vous mentionnez {{p:Gaspard Reynier}}. Il s'arrête de sourire. « Reynier, oui, il m'a posé des questions là-dessus, il y a pas longtemps. Je lui ai dit d'être prudent. Je crois pas qu'il m'ait écouté. »"
            },
            {
              "id": "c_pont_entretien",
              "locationId": "pont_romain",
              "type": "entretien",
              "title": "Julien Reynier, le neveu",
              "revealsCharacters": [
                "julien_reynier"
              ],
              "text": "{{p:Julien Reynier}} vous donne rendez-vous sur le {{l:Pont Roman}}, plutôt que chez son oncle, « question d'air », dit-il. Blouson en cuir, cigarette qu'il n'allume jamais vraiment. « Mon oncle et ses vieilleries, franchement, ça n'intéresse plus personne, sauf lui. Moi je dis, on vend, on partage, tout le monde est content. » Sur sa disparition, il hausse les épaules, mal à l'aise sous l'air détaché. « Il est parti sans un mot, ça lui ressemble pas, je veux dire, il est chiant, mais organisé. » Il regarde la rivière un moment. « Vous croyez pas qu'il s'est enfermé dans sa cave à bouder, quand même ? » Il rit, un peu trop fort pour que ce soit vraiment drôle."
            },
            {
              "id": "c_fontanet_entretien",
              "locationId": "atelier_fontanet",
              "type": "entretien",
              "title": "Élie Fontanet, restaurateur",
              "revealsCharacters": [
                "elie_fontanet"
              ],
              "text": "{{p:Élie Fontanet}} travaille sans lever les yeux, un pinceau fin à la main, penché sur une commode ouverte avec la concentration d'un chirurgien plutôt que d'un artisan pressé. « La restauration, c'est un métier de patience. On répare, on ne trahit pas l'objet. » Sur le plateau Directoire commandé par {{p:Delaroche}}, il se raidit à peine. « Je fais ce qu'on me demande. Une belle reproduction, ce n'est pas un crime, c'est un savoir-faire. » Vous insistez sur la facture, le mot souligné. Il pose enfin son pinceau. « Ce que les gens en font après, ça ne me regarde plus. Moi, je fabrique. »"
            },
            {
              "id": "c_fontanet_investigation",
              "locationId": "atelier_fontanet",
              "type": "investigation",
              "title": "Les moulages sous la bâche",
              "revealsCharacters": [],
              "text": "Dans un coin de l'atelier, sous une bâche, plusieurs moulages en résine attendent, à différents stades de finition : une ammonite, un encrier en bronze, un petit buste. Des copies, patientes, méticuleuses, presque plus soignées que les originaux qu'elles imitent. Un carnet de commandes traîne sur l'établi, des initiales en guise de clients : {{d:A.D.}}, trois fois ce mois-ci. Rien à côté qui ressemble à une commande de {{p:Reynier}} lui-même. Ce que fabrique {{p:Fontanet}}, personne ne le lui commande pour le garder."
            }
          ],
          "interventionTargets": [
            "maison_reynier",
            "boutique_delaroche",
            "atelier_fontanet",
            "tour_randonne"
          ],
          "interventionCombos": [
            {
              "set": [
                "maison_reynier",
                "boutique_delaroche",
                "atelier_fontanet"
              ],
              "points": 7,
              "text": "La descente dans le puits n'est pas facile, mais au bout de la galerie, recroquevillé contre la pierre froide, épuisé et à moitié déshydraté, {{p:Gaspard Reynier}} est bien vivant. Il ne dira que peu de mots avant l'arrivée des secours, mais ils suffisent : « Le plateau. Le mien n'était plus le mien. » Confronté au carnet retrouvé dans sa propre cave et au témoignage du principal intéressé, {{p:Antoine Delaroche}} s'effondre et reconnaît le trafic, la substitution méthodique des pièces authentiques par les copies d'{{p:Élie Fontanet}}, écoulées ensuite auprès de collectionneurs peu regardants. {{p:Fontanet}}, confronté à son tour, ne nie rien, presque soulagé de ne plus avoir à se taire. Votre article, publié en une du Pontias, provoque l'ouverture d'une enquête sur l'ensemble des ventes de {{p:Delaroche}} ces cinq dernières années. RÉUSSITE MAJEURE."
            },
            {
              "set": [
                "maison_reynier",
                "boutique_delaroche",
                "tour_randonne"
              ],
              "points": 6,
              "text": "{{p:Gaspard Reynier}}, retrouvé à temps au fond du puits, épuisé mais vivant, confirme ce que vous soupçonniez déjà : ses pièces étaient remplacées, une à une. Confronté directement, {{p:Antoine Delaroche}} finit par reconnaître le trafic, sans toutefois donner le nom de son fournisseur de copies, que vous n'avez pas eu l'occasion d'aller confronter vous-même. Votre article sauve un homme et expose un marchand indélicat. RÉUSSITE, même si {{p:Fontanet}} continuera sans doute, ailleurs, avec quelqu'un d'autre."
            },
            {
              "set": [
                "maison_reynier",
                "atelier_fontanet",
                "tour_randonne"
              ],
              "points": 5,
              "text": "{{p:Gaspard Reynier}} est secouru à temps, faible mais bien vivant. {{p:Élie Fontanet}}, confronté aux moulages retrouvés dans son atelier, finit par tout raconter, y compris le nom de son commanditaire. Mais sans être jamais confronté directement, {{p:Antoine Delaroche}} nie tout lien avec l'atelier, garde boutique ouverte et le sourire intact, et attend simplement que l'orage passe. RÉUSSITE : l'homme est sauvé, mais celui qui a organisé le trafic reste, pour l'instant, hors de portée."
            },
            {
              "set": [
                "boutique_delaroche",
                "atelier_fontanet",
                "tour_randonne"
              ],
              "points": 3,
              "text": "Votre article démonte méthodiquement le trafic entre {{p:Antoine Delaroche}} et {{p:Élie Fontanet}}, preuves à l'appui, un vrai scoop pour le Pontias. Mais personne n'est descendu dans le puits de la {{l:Maison Reynier}}. Ce n'est que deux jours plus tard, lors d'une fouille tardive de la gendarmerie, que {{p:Gaspard Reynier}} est retrouvé dans le souterrain, très affaibli, sauvé de justesse. Il s'en remettra, mais il aurait pu ne jamais en ressortir. ÉCHEC : la preuve la plus importante n'était pas dans un dossier, mais dans une cave."
            }
          ],
          "interventionFallback": {
            "points": 0,
            "text": "Le choix des lieux ne mène nulle part : rien de concret ne relie les endroits ou les personnes que vous avez retenus à ce qui s'est vraiment passé rue des Grands Forts, et personne n'est allé chercher Gaspard Reynier là où il se trouvait vraiment. Votre article paraît, flou, sans preuve solide, et l'affaire s'éteint doucement, faute de nouvel élément pour la relancer. ÉCHEC."
          }
        }
      ]
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
