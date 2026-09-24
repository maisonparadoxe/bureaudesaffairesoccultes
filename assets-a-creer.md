# Assets à créer

Tous les sons et toutes les images que le jeu sait afficher ou jouer, avec leur nom exact, leur format et leur contenu. Ce document remplace `sons-et-musiques.md`.

**Comment ça marche :** déposez chaque fichier dans le bon dossier, sous le nom exact indiqué, à côté de `index.html`. Le jeu le prend en compte au prochain chargement de la page. **Un fichier absent ne bloque rien :** le jeu garde son affichage actuel (silhouette, couleur unie) ou reste silencieux. Vous pouvez donc avancer dans l'ordre que vous voulez.

**Attention aux noms :** tout en minuscules, sans accents, sans espaces, avec des tirets. `ferreol-nuit.mp3`, pas `Ferréol nuit.MP3`.

```
index.html
audio/
  interface/  outils/  puzzles/  ambiances/  musiques/
img/
  portraits/  equipe/  lieux/  pieces/  plans/  textures/
  salamandre.png
  logo.png
  menu-fond.jpg
  icone.png  (provisoire, déjà fournie)
```

## Priorités

Si vous ne deviez en faire qu'une partie, dans cet ordre :

1. **L'écran titre :** `img/logo.png`, `img/menu-fond.jpg` et `audio/musiques/menu.mp3`. C'est la première impression du jeu.
2. **Les sons entendus à chaque piste :** `page`, `tampon`, `stylo`, `appareil-photo`, les trois frappes de machine à écrire, `punaise`, `fiche`, `agrafeuse`.
3. **Le Minitel** (9 sons).
4. **Les portraits des 6 personnages principaux :** Ferrand, Vallenot, Colette, Bensaïd, Chaptal, Roussillon.
5. **Les ambiances** de Ferréol (les deux versions), de la rédaction et du Cheval Noir, plus la pluie.
6. **La texture de papier** `papier.jpg` : elle change à elle seule toute l'apparence du jeu.
7. **Le thème principal** et le leitmotiv de la salamandre.
8. Tout le reste.

---

# Partie 1 : les sons (68 fichiers)

## Consignes communes

- **Format :** `.mp3`, 44,1 kHz, 128 kbit/s. Les ambiances peuvent être en mono.
- **Volume :** tous les fichiers normalisés au même niveau (par exemple −16 LUFS pour les ambiances et musiques, crête à −3 dB pour les effets). Le joueur règle ensuite trois volumes séparés.
- **Effets :** coupés court, sans silence au début (le son doit partir dès le clic).
- **Boucles :** les fichiers marqués « boucle » doivent se répéter sans coupure audible.
- **Ni voix ni chanson de l'époque.**
- **Sons trouvés en ligne :** vérifiez la licence de chacun (idéalement libre de droits, CC0). Notez la source : elle devra figurer dans les crédits.

## 1.1 Interface (`audio/interface/`) : 21 fichiers

| Fichier | Durée | Contenu | Quand il est joué |
| --- | --- | --- | --- |
| `clic.mp3` | < 0,2 s | Clic sec et discret, comme un interrupteur de lampe de bureau. | Choix d'une ville, réglage du volume. |
| `page.mp3` | 0,5 s | Une feuille de papier qu'on tourne. | Relire une piste, changer d'onglet ou de fiche dans le carnet. |
| `page-journal.mp3` | 1 s | Une grande page de journal qu'on déplie, ample et froissée. | Ouverture d'une affaire, questionnaire, une de fin. |
| `tampon.mp3` | 0,4 s | Un tampon encreur écrasé sur du papier, avec le petit rebond du manche. | Le tampon « Lu » sur chaque piste. |
| `stylo.mp3` | 0,8 s | Un stylo bille qui gratte deux ou trois mots sur un bloc. | Début d'un entretien. |
| `appareil-photo.mp3` | 0,8 s | Déclencheur d'un reflex argentique, puis le levier d'avance du film. | Début d'une investigation. |
| `machine-ecrire-touche-1.mp3` | < 0,15 s | Une frappe de machine à écrire mécanique. | Pendant que le texte d'un entretien s'affiche. |
| `machine-ecrire-touche-2.mp3` | < 0,15 s | Une autre frappe, légèrement différente (autre touche). | Idem, tiré au hasard. |
| `machine-ecrire-touche-3.mp3` | < 0,15 s | Une troisième frappe, un peu plus lourde. | Idem, tiré au hasard. |
| `machine-ecrire-sonnette.mp3` | 0,6 s | La petite sonnette de fin de ligne, suivie ou non du retour du chariot. | À chaque fin de paragraphe tapé. |
| `fax.mp3` | 3 à 4 s | Un télécopieur thermique qui imprime : grincement régulier, papier qui avance. | Le fax des archives d'Odile. |
| `punaise.mp3` | 0,3 s | Une punaise enfoncée dans du liège. | Un nouveau lieu apparaît sur le plan. |
| `fiche.mp3` | 0,5 s | Une fiche cartonnée glissée dans un fichier rotatif. | Un nouveau personnage entre dans l'annuaire. |
| `agrafeuse.mp3` | 0,3 s | Un coup d'agrafeuse de bureau. | Une nouvelle pièce entre au dossier. |
| `crayon-note.mp3` | 0,5 s | Un crayon qui souligne un mot d'un trait rapide. | Une fiche du carnet reçoit une note ; choix d'une réponse au questionnaire. |
| `rature.mp3` | 0,5 s | Un stylo qui barre une ligne d'un trait appuyé. | Une déclaration est contredite et se barre dans le carnet. |
| `deblocage.mp3` | 0,6 s | Un tiroir de bureau en métal qu'on ouvre. | Un second entretien devient possible. |
| `carte-depliee.mp3` | 1 s | Une carte routière qu'on déplie. | Début de l'enquête. |
| `clocher.mp3` | 3 à 5 s | Un clocher d'église au loin, quelques coups. | Chaque nouvelle journée d'enquête. |
| `horloge.mp3` | 4 à 5 s | Tic-tac d'une pendule de bureau. | Une fois, quand il ne reste que 3 pistes. |
| `plus-de-pistes.mp3` | 2 s | Un téléphone de bureau à sonnerie mécanique qui sonne deux fois, puis s'arrête. | Plus aucune piste disponible. |

## 1.2 Outils (`audio/outils/`) : 10 fichiers

| Fichier | Durée | Contenu | Quand il est joué |
| --- | --- | --- | --- |
| `minitel-allumage.mp3` | 1 s | Claquement de l'interrupteur, léger sifflement du tube cathodique qui chauffe. | Ouverture du Minitel. |
| `minitel-connexion.mp3` | 3 à 5 s | Le sifflement caractéristique du modem qui se connecte. | Juste après l'allumage. |
| `minitel-touche-1.mp3` | < 0,15 s | Une frappe sur un clavier en plastique un peu mou. | Chaque lettre tapée. |
| `minitel-touche-2.mp3` | < 0,15 s | Une autre frappe, légèrement différente. | Idem, tiré au hasard. |
| `minitel-touche-3.mp3` | < 0,15 s | Une troisième frappe. | Idem, tiré au hasard. |
| `minitel-envoi.mp3` | 0,3 s | La touche Envoi, plus lourde que les autres. | Validation d'une recherche. |
| `minitel-resultat.mp3` | 0,3 s | Un petit bip aigu. | Une réponse s'affiche. |
| `minitel-rien.mp3` | 0,5 s | Un bip grave, ou deux bips. | Aucun abonné trouvé. |
| `minitel-deconnexion.mp3` | 1 s | La touche Connexion/Fin, puis un court grésillement. | Fermeture du Minitel. |
| `carnet-ouvrir.mp3` | 0,6 s | Un carnet à spirale qu'on ouvre. | Ouverture du carnet de l'enquête. |

## 1.3 Puzzles (`audio/puzzles/`) : 9 fichiers

| Fichier | Durée | Contenu | Quand il est joué |
| --- | --- | --- | --- |
| `papier-deplacer.mp3` | 0,4 s | Un morceau de papier mouillé qu'on fait glisser sur une table. | Mauvais morceau du reçu. |
| `papier-emboiter.mp3` | 0,3 s | Un petit bruit mat et satisfaisant. | Bon morceau du reçu. |
| `listing.mp3` | 1 s | Du papier listing à bandes perforées qu'on déplie. | Ouverture de la facture détaillée. |
| `feutre-entourer.mp3` | 0,5 s | Un feutre qui entoure un mot en crissant. | Clic sur une ligne de la facture. |
| `coffre-molette.mp3` | < 0,1 s | Un cran de molette de coffre, sec et métallique. | Chaque chiffre tourné. |
| `coffre-ouvert.mp3` | 1,5 s | Le déclic du pêne, puis une petite porte lourde qui pivote. | Code juste. |
| `coffre-erreur.mp3` | 0,6 s | Une poignée qu'on force et qui ne cède pas. | Code faux. |
| `puzzle-reussi.mp3` | 1 à 2 s | Discret, pas un jingle de jeu vidéo : par exemple une note de piano feutrée. | Tout puzzle résolu. |
| `aide.mp3` | 0,8 s | Un raclement de gorge, ou une chaise qu'on tire. | Un membre de l'équipe résout le puzzle à votre place. |

## 1.4 Ambiances (`audio/ambiances/`) : 17 fichiers

Toutes **en boucle**, 30 à 60 secondes, très discrètes : elles ne doivent jamais couvrir la lecture. Elles s'enchaînent en fondu.

| Fichier | Contenu |
| --- | --- |
| `bureau-lyon.mp3` | Le bureau du quatrième étage à Lyon : une photocopieuse qui chauffe, un néon qui grésille, la ville au loin. (Écran d'intro.) |
| `redaction.mp3` | Une rédaction : machines à écrire au loin, un téléphone qui sonne dans un autre bureau, un radiateur qui cogne. |
| `mairie.mp3` | Un couloir administratif : pas sur du carrelage, une porte qui se ferme, un carillon lointain. |
| `cabinet-vallenot.mp3` | Un bureau feutré : une horloge, la circulation assourdie derrière une double fenêtre. |
| `commissariat.mp3` | Un café-bar le matin : percolateur, tasses, conversations indistinctes (Igier donne ses rendez-vous au café d'en face). |
| `cabinet-lacour.mp3` | Une salle d'attente de médecin : une pendule, quelqu'un qui tousse, un magazine qu'on feuillette. |
| `consigne-gare.mp3` | Un hall de gare : annonces lointaines inintelligibles, chariots, un train qui freine. |
| `domicile-faure.mp3` | Une cuisine silencieuse : un frigo qui ronronne, une horloge. Presque rien. |
| `ferreol.mp3` | Une grande usine vide : vent dans les tôles, une goutte d'eau qui tombe, un corbeau. |
| `ferreol-nuit.mp3` | La même usine, plus sombre : le bourdonnement d'un groupe électrogène au loin, le vent. Pour les scènes de la nuit du drame. |
| `cheval-noir.mp3` | Un bistrot populaire : verres, zinc, un baby-foot au fond, une radio très bas. |
| `ferrand.mp3` | Un hangar de BTP : un compresseur, une radio qui grésille, le bip d'un chariot élévateur qui recule. |
| `cite-mounier.mp3` | Une cage d'escalier d'immeuble : écho, une porte qui claque à un autre étage, une télé derrière une porte. |
| `casse-berthet.mp3` | Une casse en plein air : grue qui grince, ferraille qu'on laisse tomber, rivière au loin. |
| `decharge.mp3` | Un grand espace ouvert : un engin de chantier au loin, des corbeaux. |
| `parking-relais.mp3` | Un chantier actif : grue, marteau-piqueur au loin, bétonnière. |
| `pluie-vitre.mp3` | De la pluie sur une vitre, régulière, sans orage. Se superpose aux autres ambiances pendant toute l'enquête. |

## 1.5 Musiques (`audio/musiques/`) : 11 fichiers

Style d'ensemble : une formation jazz feutrée (contrebasse, piano électrique, balais) mêlée à des nappes sombres (cordes frottées, drones). Peu de notes, beaucoup d'espace.

| Fichier | Durée | Boucle | Contenu et moment |
| --- | --- | --- | --- |
| `menu.mp3` | 1 min 30 à 3 min | oui | La musique de l'écran titre, sous la pluie : la plus soignée du jeu, c'est la première chose qu'on entend. Nocturne, un piano électrique seul ou presque, une contrebasse qui entre plus tard. Joue aussi sur les écrans Options et Crédits. |
| `theme-principal.mp3` | 1 à 2 min | oui | Le thème du jeu, mélancolique, contrebasse et piano électrique, en variation plus sobre que la musique du menu. Choix de la ville et de l'affaire, fiche de l'enquêteur. |
| `intro-affaire.mp3` | 40 à 60 s | non | Plus tendu, s'éteint doucement. Pendant la lecture de l'intro. |
| `enquete-fond.mp3` | 2 à 3 min | oui | Une nappe presque imperceptible sous les ambiances pendant l'enquête. Si elle gêne en test, laissez-la vide. |
| `tension.mp3` | 1 min | oui | Une pulsation grave, une note tenue. Remplace la nappe quand il reste 3 pistes ou moins. |
| `questionnaire.mp3` | 1 à 2 min | oui | Suspendu, peu de notes. Pendant le questionnaire. |
| `fin-une.mp3` | 40 à 60 s | non | Soulagement sans triomphe : l'affaire reste triste. |
| `fin-martyr.mp3` | 40 à 60 s | non | Amer. |
| `fin-promoteur.mp3` | 40 à 60 s | non | Inquiétant. |
| `fin-dementi.mp3` | 40 à 60 s | non | Sombre, sec. |
| `salamandre.mp3` | 5 à 8 s | non | Le leitmotiv : 4 ou 5 notes, par exemple une boîte à musique légèrement désaccordée. Joué quand la salamandre apparaît (la chevalière de Roussillon, l'épilogue). Il reviendra dans toutes les affaires : prenez le temps de le trouver. |

---

# Partie 2 : les images (60 fichiers)

## Consignes communes

- **Format :** `.jpg` (qualité 80 %) pour les images, `.png` seulement là où c'est indiqué (transparence).
- **Poids :** visez moins de 250 Ko par image, pour que le jeu reste rapide sur téléphone.
- **Style d'ensemble :** l'univers des objets de 1993 (papier, photos argentiques, encre). Teintes sépia et gris, pas de couleurs vives. Même style pour toutes les images d'une même famille.
- **Pas de personne réelle reconnaissable,** pas de logo ni de marque réelle.
- **Les tailles** sont données en pixels. Le jeu recadre automatiquement ; gardez le sujet principal au centre.

## 2.1 Portraits (`img/portraits/`) : 14 fichiers

**Format :** JPG, **600 × 900 px** (format 2:3, celui de ChatGPT : l'image de 1024 × 1536 qu'il produit se réduit sans recadrage), vertical, sujet cadré en buste, visage au tiers supérieur. Le jeu les affiche comme une photo punaisée (grande dans la fiche du carnet, minuscule dans la liste).
**Style retenu :** photo de presse argentique en noir et blanc, 1993. Grain fort, flash direct avec ombre portée, mur gris clair uni, tirage un peu abîmé. Visages ordinaires, jamais retouchés. **Déjà fait :** `ferrand.jpg`, qui sert de référence de style.

**Prompt de base pour ChatGPT** (garder le bloc STYLE identique, ne changer que le bloc PERSONNAGE, et générer tous les portraits d'une affaire dans la même conversation) :

```
Photographie argentique en noir et blanc, prise en France en novembre 1993.
Portrait vertical (format 2:3), cadré en buste, le visage dans le tiers supérieur de l'image, regard vers l'objectif ou légèrement à côté.

STYLE :
- Film Kodak Tri-X 400 poussé, grain très visible, contrastes durs, noirs profonds.
- Flash direct un peu trop fort, comme une photo de presse régionale prise à la va-vite. Ombre portée nette derrière le sujet.
- Fond : un mur gris clair uni, légèrement sale, sans aucun décor.
- Aucun sourire de pose. Une expression naturelle, comme si la personne n'avait pas envie d'être photographiée.
- Défauts d'un vrai tirage : léger flou de bougé, petites poussières, bords du tirage légèrement irréguliers.
- Peau réaliste avec pores, rides et imperfections. Surtout pas de peau lisse ni de retouche.
- Vêtements, coiffure et accessoires strictement de 1993, typiques de la France de province.
- Aucun texte, aucun logo, aucune marque visible. Rien de moderne.
- Ne pas ressembler à une personne réelle ou connue.

PERSONNAGE :
[Nom, âge, métier. Deux ou trois traits physiques précis. Vêtements. Une attitude ou un détail qui raconte quelque chose. Mains posées l'une sur l'autre ou bras le long du corps.]
```


| Fichier | Personnage | À représenter |
| --- | --- | --- |
| `faure.jpg` | Bernard Faure, 52 ans, la victime | Fonctionnaire soigné mais fatigué, lunettes, cravate desserrée. Photo de service un peu raide. |
| `colette.jpg` | Colette Faure, 49 ans, la veuve | Secrétaire médicale, cheveux courts, cardigan, visage tenu mais épuisé. |
| `ferrand.jpg` | Roger Ferrand, 47 ans, patron de BTP | Massif, grandes mains, bleu de travail propre, mâchoire serrée, regard qui ne cède pas. |
| `simone.jpg` | Simone Ferrand, 44 ans, son épouse | Comptable, tenue stricte, lunettes au bout d'une chaînette, regard de côté. |
| `vallenot.jpg` | Hervé Vallenot, 44 ans, promoteur | Costume clair, sourire commercial, bronzage d'hiver, cigarillo entre les doigts. |
| `roussillon.jpg` | Marcel Roussillon, 58 ans, adjoint | Élu en costume sombre, raie sur le côté, chevalière visible à la main droite. |
| `bensaid.jpg` | Ahmed Bensaïd, 56 ans, gardien | Blouson de gardien, casquette, moustache, visage digne et fatigué. |
| `chaptal.jpg` | Marcel Chaptal, 67 ans, ancien syndicaliste | Vieil ouvrier, casquette, visage buriné, un reste de peinture blanche sous les ongles. |
| `jeannot.jpg` | Jeannot, patron du Cheval Noir | Tablier de bistrot, torchon sur l'épaule, gros sourcils, la soixantaine. |
| `mounier.jpg` | Gérard Mounier, 39 ans, chef d'équipe | Survêtement, traits tirés d'un homme qui travaille de nuit, regard inquiet. |
| `lacour.jpg` | Dr Pierre Lacour, 61 ans, médecin | Blouse ou veste en tweed, lunettes demi-lune, air de vouloir que tout soit « classique ». |
| `berthet.jpg` | Lucien Berthet, 50 ans, ferrailleur | Bleu de chauffe taché, gants, bonnet, sourire roublard. |
| `igier.jpg` | Lieutenant Bernard Igier, 35 ans | Blouson de cuir, rasé de près, regard prudent, jeune pour son grade. |
| `roche.jpg` | Daniel Roche, 50 ans, chef des faits divers | Imperméable, cigarette derrière l'oreille, moue méprisante. |

## 2.2 L'équipe du Bureau (`img/equipe/`) : 4 fichiers

**Format :** identique aux portraits, JPG **600 × 900 px**, même style. Ils s'affichent sur les fiches de l'équipe, sous la note de service du début de partie.

| Fichier | Personnage | À représenter |
| --- | --- | --- |
| `mathilde.jpg` | Mathilde Vernet, cheffe du Bureau | La quarantaine, imperméable, cigarette pas allumée entre les doigts. Regard direct, un peu de défi. Dix ans de rubrique police-justice derrière elle. |
| `yves.jpg` | Yves Barral, photographe | La cinquantaine, barbe grise mal taillée, gilet de reporter, un boîtier argentique autour du cou. Il regarde à côté de l'objectif. |
| `karim.jpg` | Karim Haddou, stagiaire | Vingt-trois ans, blouson en jean, carnet à spirale dans la poche. Sourire poli, l'air de ne pas encore savoir où il a mis les pieds. |
| `odile.jpg` | Odile Perrichon, documentaliste | Soixante ans, lunettes au bout du nez, chaînette, gilet de laine. Assise devant des rayonnages de classeurs. Le visage de quelqu'un qui n'oublie rien. |

## 2.3 Photos des lieux (`img/lieux/`) : 14 fichiers

**Format :** JPG, **1200 × 600 px** (2 pour 1), horizontal. Le jeu les affiche en tête de chaque lieu, dans un cadre blanc de tirage photo.
**Style conseillé :** photos argentiques d'Yves, noir et blanc ou sépia, grain visible, lumière de novembre. Pas de personnage au premier plan.

| Fichier | Lieu | À représenter |
| --- | --- | --- |
| `redaction.jpg` | Rédaction du Stéphanois | Une salle de rédaction de 1993 : bureaux encombrés, machines à écrire, un radiateur en fonte. |
| `mairie.jpg` | Mairie, service urbanisme | Un couloir administratif, portes vitrées, plans punaisés au mur. |
| `cabinet_vallenot.jpg` | Cabinet Groupe Vallenot | Un bureau moderne, moquette, une maquette d'architecte sous plexiglas. |
| `commissariat.jpg` | Commissariat central | La façade d'un commissariat, et le café-bar d'en face. |
| `cabinet_lacour.jpg` | Cabinet du Dr Lacour | Une salle d'attente défraîchie, chaises en plastique, une plante verte. |
| `consigne_gare.jpg` | Consigne de la gare de Châteaucreux | Un guichet de consigne à bagages au fond d'un hall de gare. |
| `domicile_faure.jpg` | Domicile des Faure | Une cuisine en formica, toile cirée, un couvert mis. |
| `site_ferreol.jpg` | Ancienne Manufacture Ferréol | Une grande forge désaffectée, verrières cassées, un escalier métallique. |
| `cheval_noir.jpg` | Café Le Cheval Noir | Un bistrot de quartier, zinc, néon, un baby-foot. |
| `siege_ferrand.jpg` | Ferrand Frères BTP | Un hangar d'entreprise de BTP, engins, un bureau vitré au fond. |
| `cite_mounier.jpg` | Cité de Montreynaud | Une tour d'immeuble des années 70 sous la pluie. |
| `casse_berthet.jpg` | Casse Berthet | Une casse au bord d'une rivière, carcasses de voitures, une grue. |
| `decharge.jpg` | Décharge de la Croix-de-l'Orme | Un site d'enfouissement, talus de terre, un pont-bascule avec sa guérite. |
| `parking_relais.jpg` | Chantier du parking-relais | Un chantier actif, grues, banches, un Algeco. |

## 2.4 Pièces du dossier (`img/pieces/`) : 20 fichiers

**Format :** JPG, **600 × 600 px**, carré. Le jeu les affiche comme une photo posée dans la fiche de la pièce, dans le carnet.
**Style conseillé :** l'objet photographié à plat, sur un bureau ou un fond neutre, lumière de lampe de bureau. Les textes visibles doivent correspondre à ceux du jeu (voir `saint-etienne/5-textes.md`).

| Fichier | Pièce | À représenter |
| --- | --- | --- |
| `lettre_fantome.jpg` | La lettre du « fantôme » | Lettre en capitales au stylo bille, enveloppe kraft cachetée à Saint-Étienne. |
| `dossier_ferreol.jpg` | Le dossier Ferréol de la mairie | Chemise cartonnée « FERRÉOL » ouverte sur un tableau de tonnages. |
| `sci_delombre.jpg` | SCI Delombre | Un tampon de société ou un en-tête « SCI DELOMBRE ». |
| `facture_tel.jpg` | Facture de la ligne du gardien | Listing à bandes perforées, une ligne entourée au feutre. |
| `carte_vallenot.jpg` | Carte de visite de Vallenot | Carte « Groupe Vallenot · Hervé Vallenot, président · Radiotéléphone 07 42 18 63 ». |
| `facture_delombre.jpg` | Facture de la SCI Delombre | Facture « Conseil en stratégie urbaine · 1 300 000 F ». |
| `cigarillos.jpg` | Les cigarillos de Vallenot | Une boîte métallique de cigarillos entamée, embouts en plastique blanc (sans marque réelle). |
| `constat.jpg` | Le rapport de police | Un rapport tapé à la machine, tampon, « au pied de l'escalier » lisible. |
| `dossier_bleu.jpg` | Le dossier bleu de Bernard | Un classeur bleu au carton ramolli. |
| `releves_faure.jpg` | Les relevés bancaires de Bernard | Relevés bancaires, dépôts en espèces surlignés. |
| `carnet_versements.jpg` | Le carnet de Bernard | Petit carnet à spirale : « R.F. 30 », « R.F. 200 ? ». |
| `ticket_consigne.jpg` | Le ticket de consigne | Ticket orange numéroté de la consigne de Châteaucreux. |
| `copie_faure.jpg` | Le sac de la consigne | Sac de sport bleu ouvert, enveloppe kraft, photos au flash de camions la nuit. |
| `megots.jpg` | Quatre mégots de cigarillo | Une boîte d'allumettes ouverte contenant quatre mégots à embout blanc. |
| `compta_ferrand.jpg` | Le livre de caisse de Ferrand | Grand livre de caisse ouvert, colonne « B.F. ». |
| `agenda_ferrand.jpg` | L'agenda de chantier de Ferrand | Agenda ouvert au 16 novembre : « Ferréol 22 h » au crayon. |
| `recu_berthet.jpg` | Le reçu déchiré | Un reçu reconstitué, quatre morceaux recollés au ruban adhésif. |
| `livre_police.jpg` | Le livre de police de Berthet | Registre de ferrailleur, écriture maladroite, une ligne « Ferréol ». |
| `registre_decharge.jpg` | Le registre de la décharge | Fiches de pesée agrafées, total « 400 t » souligné. |
| `liasses.jpg` | Les liasses du coffre | Cinq liasses de billets de 200 F dans un petit coffre, bandes datées. |

## 2.5 Le plan de Saint-Étienne (`img/plans/`) : 1 fichier

**`saint_etienne.jpg`** · JPG, **1800 × 1200 px**.
Une carte routière stylisée de 1993, pliée (traces de pliure), couleurs passées. Le jeu dessine par-dessus, en transparence, les quartiers et les punaises. **Placez les quartiers aux emplacements ci-dessous** (coordonnées en pixels sur l'image 1800 × 1200, depuis le coin en haut à gauche) :

| Quartier | Rectangle (x, y, largeur, hauteur) |
| --- | --- |
| Le Soleil | 660, 40, 520, 300 |
| Montreynaud | 1240, 40, 480, 260 |
| Tarentaize | 80, 400, 460, 340 |
| Centre-ville | 600, 400, 600, 380 |
| Châteaucreux | 1260, 360, 460, 280 |
| Zone industrielle | 80, 800, 520, 340 |
| Bellevue | 660, 840, 540, 300 |
| Vallée du Gier | 1260, 700, 460, 440 |

Ce n'est pas une carte exacte de la ville, mais une carte « de jeu » : les proportions n'ont pas besoin d'être justes, seulement lisibles. Laissez les zones assez claires pour que les punaises restent visibles.

## 2.6 Textures (`img/textures/`) : 3 fichiers

Toutes **raccordables** (tileable) : le bord droit continue le bord gauche, le haut continue le bas.

| Fichier | Taille | Contenu |
| --- | --- | --- |
| `fond.jpg` | 1024 × 1024 | Le fond de l'écran : un sous-main en cuir ou un bureau en bois sombre. C'est lui qu'on voit dans les marges, sous la pluie. |
| `papier.jpg` | 1024 × 1024 | Le papier des cartes et des panneaux : kraft **très clair**, grain léger. Il doit rester assez clair pour que le texte se lise parfaitement. |
| `journal.jpg` | 1024 × 1024 | Du papier journal : blanc cassé, fibres légères, sans texte. Pour la une de fin. |

## 2.7 Écran titre et icône : 4 fichiers

| Fichier | Format | Contenu |
| --- | --- | --- |
| `img/salamandre.png` | PNG transparent, 400 × 560 | La carte de l'épilogue : une salamandre dans les flammes, dessinée à l'encre noire, très fine, style gravure ancienne. Fond transparent (le jeu pose la carte sur du bristol crème). Ce dessin reviendra dans toutes les affaires. |
| `img/menu-fond.jpg` | JPG, 1920 × 1080 | Le fond de l'écran titre : un bureau de rédaction la nuit, vu de près. Une lampe de bureau allumée, un dossier kraft marqué « AFFAIRES OCCULTES », une machine à écrire, une fenêtre sombre ruisselante de pluie. Image assez sombre (le jeu l'assombrit encore un peu), avec une zone centrale calme où s'affichent le logo et le menu. La pluie animée du jeu passe par-dessus. |
| `img/logo.png` | PNG transparent, 1200 × 500 | Le logo du jeu, « Bureau des affaires occultes ». Clair sur fond transparent, car il s'affiche sur le fond sombre de l'écran titre. Style machine à écrire ou lettrage de presse des années 90, avec un tampon rouge « France · 1993 » si vous le souhaitez. Tant qu'il est absent, le jeu affiche un logo en texte. Il apparaît aussi dans les crédits. |
| `img/icone.png` | PNG, 256 × 256 | L'icône de l'onglet du navigateur. **Une icône provisoire est déjà fournie** (une salamandre claire sur fond sombre) : remplacez-la simplement par la vôtre, sous le même nom. Doit rester lisible en tout petit (16 × 16). |

---

## Récapitulatif

| Famille | Dossier | Nombre |
| --- | --- | --- |
| Sons d'interface | `audio/interface/` | 21 |
| Sons des outils | `audio/outils/` | 10 |
| Sons des puzzles | `audio/puzzles/` | 9 |
| Ambiances | `audio/ambiances/` | 17 |
| Musiques | `audio/musiques/` | 11 |
| Portraits | `img/portraits/` | 14 |
| L'équipe du Bureau | `img/equipe/` | 4 |
| Photos des lieux | `img/lieux/` | 14 |
| Pièces du dossier | `img/pieces/` | 20 |
| Plan | `img/plans/` | 1 |
| Textures | `img/textures/` | 3 |
| Écran titre et icône | `img/` | 4 |
| **Total** | | **128** (68 sons, 60 images, dont l'icône provisoire déjà fournie) |

Pour vérifier qu'un fichier est bien pris en compte : ouvrez le jeu, allez à l'endroit où il doit apparaître ou se faire entendre, et rechargez la page si besoin (Ctrl + F5).
