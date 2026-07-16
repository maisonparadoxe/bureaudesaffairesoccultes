// Copie embarquée de data.json, pour un fonctionnement sans serveur (ouverture directe du fichier).
window.GAME_DATA_FALLBACK = {
  "meta": {
    "title": "L'Affaire des Hauts Fourneaux",
    "subtitle": "Une enquête du Stéphanois",
    "city": "Saint-Étienne",
    "year": 1993,
    "totalLeads": 13,
    "intro": "Novembre 1993. La rédaction du Stéphanois tourne au ralenti depuis que Manufrance a fermé ses portes et que la moitié de la ville pointe au chômage. Ce matin, un coup de fil a changé la donne : Bernard Faure, chargé de mission à l'urbanisme, a été retrouvé mort au pied d'un escalier de l'ancienne Manufacture Ferréol, le site industriel que la mairie voulait transformer en pépinière d'entreprises. La police parle d'accident. Vous, vous vous souvenez qu'il vous avait appelés trois jours plus tôt, la voix tendue, pour dire qu'il avait « des documents à vous montrer ». Vous disposez de 13 pistes pour comprendre ce qui s'est réellement passé avant que l'affaire ne soit classée.",
    "briefing": "Menez des entretiens auprès des personnes impliquées ou des investigations sur les lieux liés à l'affaire. Chaque piste consultée pour la première fois coûte une unité sur votre total ; relire une piste déjà découverte est gratuit. Quand vous manquerez de pistes, ou que vous penserez tenir le fin mot de l'histoire, vous devrez choisir trois lieux où porter l'accusation."
  },
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
      "name": "Mairie — Service Urbanisme",
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
  "annuaire": [
    {
      "name": "Faure Bernard",
      "role": "Chargé de mission urbanisme (victime)",
      "locationId": "domicile_faure"
    },
    {
      "name": "Faure Colette",
      "role": "Veuve de Bernard Faure",
      "locationId": "domicile_faure"
    },
    {
      "name": "Roussillon Marcel",
      "role": "Adjoint au maire, urbanisme",
      "locationId": "mairie"
    },
    {
      "name": "Bensaïd Ahmed",
      "role": "Gardien du site Ferréol",
      "locationId": "site_ferreol"
    },
    {
      "name": "Chaptal Marcel",
      "role": "Ancien syndicaliste CGT",
      "locationId": "cheval_noir"
    },
    {
      "name": "Vallenot Hervé",
      "role": "Promoteur, Groupe Vallenot",
      "locationId": "cabinet_vallenot"
    },
    {
      "name": "Ferrand Roger",
      "role": "Gérant, Ferrand Frères BTP",
      "locationId": "siege_ferrand"
    },
    {
      "name": "Igier Bernard",
      "role": "Lieutenant de police",
      "locationId": "commissariat"
    }
  ],
  "clues": [
    {
      "id": "c_redaction_inv",
      "locationId": "redaction",
      "type": "investigation",
      "title": "Les archives du journal",
      "text": "Vous ressortez les coupures de presse des derniers mois. Le projet de reconversion de la Manufacture Ferréol en pépinière d'entreprises a été annoncé en grande pompe par la mairie en avril, porté par le Groupe Vallenot. Un entrefilet daté de juillet note, sans s'y attarder, que le budget alloué a doublé entre l'annonce et le vote au conseil municipal, « pour tenir compte de la dépollution du site ». Aucun article ne mentionne d'appel d'offres public. Un nom revient dans les remerciements de l'inauguration du chantier : Ferrand Frères, l'entreprise de travaux chargée du gros œuvre."
    },
    {
      "id": "c_mairie_entretien",
      "locationId": "mairie",
      "type": "entretien",
      "title": "Marcel Roussillon, adjoint à l'urbanisme",
      "text": "Roussillon vous reçoit entre deux portes, visiblement pressé. « Bernard Faure ? Un bon agent, un peu à cran ces dernières semaines, mais rien d'alarmant. » Il balaie vos questions sur le budget du projet Ferréol d'un revers de main : « Les dossiers de dépollution industrielle, c'est toujours plus cher que prévu, vous savez comment sont les vieilles usines. » Quand vous insistez sur l'absence d'appel d'offres, il regarde sa montre. « Je vous laisse, j'ai le maire dans dix minutes. » Il n'a pas répondu à la question."
    },
    {
      "id": "c_mairie_investigation",
      "locationId": "mairie",
      "type": "investigation",
      "title": "Le dossier de reconversion",
      "text": "Une employée du service, agacée par les cadences depuis le départ de Faure, vous laisse consulter le dossier « Ferréol » sans trop de vigilance. Le budget est effectivement passé de 4 à 8,2 millions de francs en trois mois, validé par une simple délibération signée Roussillon, sans mise en concurrence. La ligne « études et honoraires de conseil » de 1,3 million de francs est versée à une structure nommée SCI Delombre, dont vous ne trouvez trace nulle part ailleurs dans les dossiers municipaux."
    },
    {
      "id": "c_domicile_entretien",
      "locationId": "domicile_faure",
      "type": "entretien",
      "title": "Colette Faure, la veuve",
      "text": "Colette Faure vous fait entrer, les yeux rouges. « Il ne dormait plus depuis trois semaines. Il recevait des coups de fil le soir, il sortait sur le palier pour répondre, je n'entendais jamais rien. » Elle marque un silence. « La dernière fois, avant-hier, il m'a dit : si jamais il m'arrivait quelque chose, il fallait que le journal récupère le dossier bleu de son bureau. Je n'ai pas voulu y croire. » Elle ne sait pas ce que contient ce dossier, ni où Bernard comptait vous le remettre."
    },
    {
      "id": "c_domicile_investigation",
      "locationId": "domicile_faure",
      "type": "investigation",
      "title": "Le bureau de Bernard Faure",
      "text": "Dans le tiroir du bureau, sous une pile de factures, vous trouvez un classeur bleu défraîchi. Il contient des photocopies de bons de commande Ferrand Frères largement supérieurs aux prix du marché, ainsi qu'un post-it manuscrit : « Vallenot sait. Ferrand couvre. Voir SCI Delombre — qui est derrière ? » Coincé entre deux pages, un mot déchiré porte une note griffonnée à la hâte : « Usine Ferréol, 22h, apporter le dossier. » Rien n'indique qui avait fixé ce rendez-vous."
    },
    {
      "id": "c_ferreol_entretien",
      "locationId": "site_ferreol",
      "type": "entretien",
      "title": "Ahmed Bensaïd, gardien du site",
      "text": "Le gardien vous ouvre la grille sans enthousiasme. « Le soir où le monsieur de la mairie est tombé, j'ai entendu des voix en bas, du côté de l'ancien atelier de forge. Deux hommes qui gueulaient. Je ne suis pas descendu, c'est pas mon rôle. » Il ajoute, plus bas : « Ce qui est bizarre, c'est que le chantier est censé être à l'arrêt, en attente d'un jugement du tribunal administratif. Sauf que des camions de chez Ferrand viennent livrer du matériel de nuit, depuis un mois. »"
    },
    {
      "id": "c_ferreol_investigation",
      "locationId": "site_ferreol",
      "type": "investigation",
      "title": "Repérage du chantier",
      "text": "Malgré le gel officiel des travaux, une dalle de béton fraîche a été coulée dans l'aile est, là où l'escalier de la victime a cédé. Près d'une benne, vous récupérez un bon de livraison Ferrand Frères daté de la nuit de la mort de Faure, portant la mention manuscrite « Dépose matériel + RF sur place ». L'escalier lui-même a une marche descellée qui ne semble pas due à l'usure : les fixations arrachées sont propres, comme désolidarisées récemment."
    },
    {
      "id": "c_chevalnoir_entretien",
      "locationId": "cheval_noir",
      "type": "entretien",
      "title": "Marcel Chaptal, ancien syndicaliste",
      "text": "Chaptal, un ancien de la Manufacture, vous parle à voix basse au comptoir. « Ferréol, ça a toujours été un panier de crabes entre le patronat du bâtiment et la mairie. Ferrand, je l'ai vu une fois à une réunion publique, complètement bourré, se vanter d'avoir des « amis qui ferment les yeux, place de l'Hôtel de Ville ». Personne n'a relevé, ici tout le monde a besoin de ces chantiers pour bouffer. » Il refuse de témoigner officiellement : « J'ai encore un fils qui bosse dans le BTP, moi. »"
    },
    {
      "id": "c_vallenot_entretien",
      "locationId": "cabinet_vallenot",
      "type": "entretien",
      "title": "Hervé Vallenot, le promoteur",
      "text": "Vallenot vous reçoit dans un bureau impeccable, tout sourire. « Le projet Ferréol est une chance pour cette ville, et je comprends que ça dérange les nostalgiques. » Sur le dépassement de budget, il botte en touche : « La dépollution d'un site industriel, c'est technique, je vous invite à interroger la mairie. » Quand vous prononcez le nom de Ferrand, un léger tic agite sa mâchoire. « Roger fait du bon travail. Allez donc lui poser vos questions à lui, s'il a le temps de vous recevoir entre deux chantiers. »"
    },
    {
      "id": "c_vallenot_investigation",
      "locationId": "cabinet_vallenot",
      "type": "investigation",
      "title": "Le bureau de Vallenot",
      "text": "Une secrétaire distraite vous laisse patienter seuls quelques minutes dans le bureau. Sur un classeur mal refermé, vous photographiez une facture de « conseil en stratégie urbaine » émise par la SCI Delombre à hauteur de 1,3 million de francs, sans le moindre livrable joint. Le nom du gérant de la SCI, illisible sur le tampon, est manuscrit en marge : « M. Delombre — beau-frère MR ». Les initiales correspondent à celles de Marcel Roussillon."
    },
    {
      "id": "c_ferrand_entretien",
      "locationId": "siege_ferrand",
      "type": "entretien",
      "title": "Roger Ferrand, patron de BTP",
      "text": "Ferrand vous reçoit debout, dans un hangar qui sent le gasoil. Costaud, la poignée de main écrasante. « J'étais chez moi, le soir où ce type est tombé, comme tous les soirs. » Quand vous mentionnez les livraisons nocturnes sur le site Ferréol malgré le gel du chantier, son ton change brusquement : « Vous insinuez quoi, là ? Je fais mon métier, je livre du matériel, c'est pas un crime. » Il vous raccompagne vers la sortie sans vous laisser reformuler la question."
    },
    {
      "id": "c_ferrand_investigation",
      "locationId": "siege_ferrand",
      "type": "investigation",
      "title": "La comptabilité de Ferrand Frères",
      "text": "Un registre de virements laissé en évidence sur un bureau vide montre trois versements vers la SCI Delombre, pour un total proche du montant facturé côté Vallenot. Un agenda de chantier note, à la date de la mort de Faure : « 22h, Ferréol, urgent — M. l'urbaniste veut tout arrêter. RF sur place. » La page du lendemain est arrachée."
    },
    {
      "id": "c_parking_investigation",
      "locationId": "parking_relais",
      "type": "investigation",
      "title": "Le chantier du parking-relais",
      "text": "Autre chantier municipal, autre surprise : le parking-relais de Bellevue, également confié à Ferrand Frères sur recommandation du Groupe Vallenot, présente lui aussi une ligne « études » facturée à la SCI Delombre. Le montage semble être une pratique installée depuis plusieurs marchés, bien au-delà du seul dossier Ferréol — mais rien ici ne relie directement ce chantier à la mort de Bernard Faure."
    },
    {
      "id": "c_commissariat_entretien",
      "locationId": "commissariat",
      "type": "entretien",
      "title": "Lieutenant Igier, un contact au commissariat",
      "text": "Igier, que vous connaissez depuis vos débuts au journal, accepte de parler off. « Entre nous : le rapport a été bouclé en deux jours, chute accidentelle, dossier classé sans autopsie approfondie. D'habitude, pour un fonctionnaire retrouvé mort sur un chantier, on prend plus de précautions. » Il ajoute, mal à l'aise : « On m'a fait comprendre, en haut lieu, qu'il valait mieux ne pas s'attarder sur cette affaire. Je ne vous ai rien dit. »"
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
      "text": "Face aux preuves que vous alignez sur son bureau — le dossier bleu, les factures de la SCI Delombre, le bon de livraison nocturne — Marcel Roussillon craque et reconnaît le montage de surfacturation via la société de son beau-frère. Confronté séparément, Hervé Vallenot lâche Roger Ferrand pour sauver sa société. Ferrand, pris de court, finit par admettre s'être rendu sur le site Ferréol le soir du drame pour empêcher Faure de tout révéler : la dispute a mal tourné. Votre article, publié en une du Stéphanois, provoque la démission de Roussillon, la mise en examen de Ferrand pour homicide involontaire et l'ouverture d'une enquête sur l'ensemble des marchés du Groupe Vallenot. RÉUSSITE MAJEURE."
    },
    {
      "set": [
        "mairie",
        "cabinet_vallenot",
        "site_ferreol"
      ],
      "points": 3,
      "text": "Vous démontez sans peine le système de surfacturation entre la mairie et le Groupe Vallenot, et vos relevés du chantier confirment des travaux illégaux. Mais sans avoir confronté Roger Ferrand directement, vous n'avez aucun élément qui le relie personnellement à la mort de Faure : votre article expose un scandale financier retentissant, Roussillon est écarté, mais l'affaire de la mort de Bernard Faure reste classée en accident. Le responsable de sa mort ne sera jamais inquiété. ÉCHEC : la vérité sur l'essentiel vous échappe."
    },
    {
      "set": [
        "mairie",
        "siege_ferrand",
        "site_ferreol"
      ],
      "points": 6,
      "text": "Confronté au dossier bleu et au bon de livraison, Roger Ferrand s'effondre et reconnaît sa dispute avec Faure la nuit du drame. Roussillon, pris à revers par la mise en cause directe de Ferrand, admet le montage de la SCI Delombre pour limiter sa propre exposition pénale. Votre article fait grand bruit : Ferrand est mis en examen pour homicide involontaire, Roussillon démissionne. Sans les preuves comptables saisies chez Vallenot, celui-ci s'en tire en plaidant l'ignorance et conserve son entreprise intacte. RÉUSSITE : la ville respire, mais un responsable garde les mains libres."
    },
    {
      "set": [
        "cabinet_vallenot",
        "siege_ferrand",
        "site_ferreol"
      ],
      "points": 5,
      "text": "Vallenot et Ferrand, confrontés ensemble aux preuves matérielles du chantier, finissent par se dénoncer mutuellement : Ferrand pour la mort de Faure, Vallenot pour le système de surfacturation. Votre article aboutit à leur mise en examen. Mais sans être jamais confronté directement, Marcel Roussillon nie tout lien avec la SCI Delombre de son beau-frère et conserve son siège d'adjoint, se contentant de déplorer publiquement « des pratiques qu'il ignorait totalement ». RÉUSSITE : les auteurs directs tombent, le protecteur politique reste en place."
    }
  ],
  "interventionFallback": {
    "text": "Vos accusations, mal ciblées, ne trouvent pas de prise : les personnes ou lieux que vous avez choisis n'ont pas de lien assez direct avec l'affaire pour que votre dossier tienne. Votre article paraît, mais sans preuve suffisamment solide, il est démenti dès le lendemain par un communiqué de la mairie, et l'affaire Faure retombe dans l'oubli. ÉCHEC.",
    "points": 0
  }
};
