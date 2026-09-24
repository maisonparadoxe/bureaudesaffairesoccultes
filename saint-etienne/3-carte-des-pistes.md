# Le feu de Ferréol : la carte des pistes

Saint-Étienne, novembre 1993. Document de conception, jamais montré au joueur. À lire avec « 1-verite.md » et « 2-personnages.md ».

Généré par `carte.py`, qui vérifie aussi la cohérence de l'enquête. Pour modifier la carte, modifier `carte.py` puis le relancer.

## En chiffres

| | |
| --- | --- |
| Lieux | 14 (5 connus au départ) |
| Personnages | 14 |
| Pistes écrites | 39, dont 14 à débloquer |
| Rôle des pistes | 12 essentielles, 21 utiles, 1 qui élimine un suspect, 5 fausses pistes |
| Pistes accordées au joueur | 16 |
| Solution de Mathilde | 12 pistes |

## Ce que le joueur connaît au départ

L'intro contient la lettre du « fantôme » en entier (gratuite, relisible) et nomme Bernard Faure, la Manufacture Ferréol, la mairie et la police. Au départ, le plan montre donc 5 lieux : la rédaction, Ferréol, la mairie, le commissariat et le domicile des Faure.

## Les seconds entretiens (ce qui débloque quoi)

| Piste débloquée | Il faut avoir lu |
| --- | --- |
| Le cahier de la standardiste | Daniel Roche, chef des faits divers |
| Roche, second entretien | Le cahier de la standardiste |
| Les tirages d'Yves | Repérage du chantier |
| La facture détaillée de la cabane du gardien | Bensaïd, second entretien |
| Igier, second entretien | Lacour, second entretien |
| Lacour, second entretien | Bensaïd, second entretien |
| Colette, second entretien | La comptabilité de Ferrand Frères |
| Bensaïd, second entretien | Le livre de police de la casse |
| Près de la porte de l'atelier | Bensaïd, second entretien |
| Chaptal, second entretien | Les tirages d'Yves ou Jeannot, patron du Cheval Noir |
| Le coffre de Roger Ferrand | La comptabilité de Ferrand Frères |
| Simone, second entretien | Chaptal, second entretien ou Gérard Mounier, chef d'équipe ou Berthet, second entretien |
| Mounier, second entretien | Le registre de la décharge ou La consigne de Châteaucreux |
| Berthet, second entretien | Le livre de police de la casse |

## Les pistes, lieu par lieu

### Rédaction du Stéphanois (Centre-ville)

- **Fouiller les archives du journal** · investigation · Utile  
  Articles sur le projet Ferréol : budget doublé en juillet, Ferrand Frères au gros œuvre, le Groupe Vallenot porte le projet, même attelage sur le parking-relais. Une brève cite Marcel Chaptal, ancien de la CGT, opposé au projet, « qu'on trouve au Cheval Noir ».
  
  *Révèle :* Cabinet Groupe Vallenot, Ferrand Frères BTP, Chantier du parking-relais, Hervé Vallenot, Roger Ferrand, Marcel Chaptal.
- **Parler à Daniel Roche** · entretien · Fausse piste  
  Hostile aux « Lyonnais ». Nie avoir reçu l'appel de Faure. Glisse que c'est « le petit Lacour » qui a constaté le décès.
  
  *Révèle :* Daniel Roche, Dr Pierre Lacour.
- **Consulter le cahier du standard** · investigation · Utile · après : Daniel Roche, chef des faits divers  
  Samedi 13 novembre, 16 h 40 : « M. Faure, urbanisme, pour les faits divers. Passé à M. Roche. » L'appel a duré quatre minutes.
- **Revenir voir Roche avec le cahier** · entretien · Utile · après : Le cahier de la standardiste  
  Il finit par s'en souvenir. Faure lui a demandé : « C'est combien, pour vous, un dossier comme ça ? » Il a raccroché, persuadé d'avoir affaire à un escroc. Il reconnaît aussi que le Groupe Vallenot achète une pleine page chaque semaine.
  
  *Sert à :* Q2 (Faure voulait vendre son dossier, pas le donner.)
- **Appeler Odile aux archives du groupe** · investigation · Utile  
  La légende du fondeur tombé dans la coulée en 1911, articles d'époque à l'appui. On n'a jamais retrouvé le corps. Et une brève de 1987 : Paul Ferrand, frère de Roger, mort écrasé sous une banche. C'est la piste de Karim pour le fantôme ; la date de la mort de Paul (14 mars 1987) servira pour le coffre.
- **Récupérer les tirages d'Yves** · investigation · Essentielle · après : Repérage du chantier  
  Photos prises le 17 au matin : le slogan « FERRÉOL NE SERA PAS UN PARKING » sur le mur est, peinture encore brillante, coulures fraîches. Les mêmes mots que dans la lettre du « fantôme ».
  
  *Sert à :* Q6 (Même formule que la lettre, peinte la nuit du drame.)

### Mairie, service urbanisme (Centre-ville)

- **Rencontrer Marcel Roussillon** · entretien · Fausse piste  
  Jamais « je », toujours « on ». Il précise de lui-même qu'« on était en conseil jusqu'à dix heures et demie » ce soir-là, ce qu'on ne lui demandait pas. Chevalière en or gravée d'une salamandre.
  
  *Révèle :* Marcel Roussillon.
  
  *Sert à :* BONUS (La salamandre sur la chevalière de Roussillon.)
- **Consulter le dossier Ferréol** · investigation · Essentielle  
  Plan de dépollution : 3 000 tonnes de terres polluées à évacuer vers la décharge agréée de la Croix-de-l'Orme. Budget passé de 4 à 8,2 millions de francs, délibération signée Roussillon, 1,3 million versé à la SCI Delombre.
  
  *Révèle :* Marcel Roussillon, Décharge agréée de la Croix-de-l'Orme, dossier ferreol, sci delombre.
  
  *Sert à :* Q4 (3 000 tonnes prévues.)
- **Lire le compte rendu du conseil municipal** · investigation · Élimine un suspect  
  Séance levée à 22 h 30. Roussillon est intervenu à 22 h 15 sur le budget des cantines. Il ne pouvait pas être à Ferréol.
- **Demander la facture de la ligne du site** · investigation · Utile · après : Bensaïd, second entretien  
  La ligne de la cabane est payée par la ville. Une trentaine d'appels sur le mois, dont un seul la nuit : mardi 16 novembre, 22 h 24, 3 minutes, vers un radiotéléphone.
  
  *Révèle :* facture tel.
  
  *Sert à :* Q3 (Quelqu'un a appelé un radiotéléphone depuis le site, juste après la chute.)

### Cabinet Groupe Vallenot (Centre-ville)

- **Rencontrer Hervé Vallenot** · entretien · Utile  
  Tout est « beau ». Dit ne connaître le dossier que de loin. Le 16 au soir : dîner seul, sa femme était à Lyon. En partant, il vous tend sa carte, avec son numéro de radiotéléphone.
  
  *Révèle :* Hervé Vallenot, carte vallenot.
  
  *Sert à :* Q3 (Le numéro du radiotéléphone de Vallenot.)
- **Profiter de l'absence de la secrétaire** · investigation · Essentielle  
  Une facture de 1,3 million de la SCI Delombre, sans livrable. Et sur le bureau, une boîte de cigarillos hollandais à embout de plastique blanc.
  
  *Révèle :* facture delombre, cigarillos.
  
  *Sert à :* Q3 (Les mêmes cigarillos que les mégots trouvés près du corps.)

### Commissariat central (Centre-ville)

- **Retrouver Igier au café d'en face** · entretien · Utile  
  Dossier bouclé en deux jours, sans photos. Il vous montre le constat : « victime au pied de l'escalier ». Certificat signé par le Dr Lacour.
  
  *Révèle :* Lieutenant Bernard Igier, Dr Pierre Lacour, constat.
  
  *Sert à :* Q3 (Le constat place le corps au pied de l'escalier.)
- **Revenir voir Igier avec l'aveu du médecin** · entretien · Essentielle · après : Lacour, second entretien  
  Il lâche le morceau : le 17 à 8 h 10, le commissaire Borel a reçu un appel de la mairie. « L'adjoint Roussillon en personne. Il fallait que ça reste un accident. »
  
  *Sert à :* Q5 (Roussillon a appelé le commissaire pour faire classer l'affaire.)

### Cabinet du Dr Lacour (Centre-ville)

- **Consulter le Dr Lacour** · entretien · Fausse piste  
  « Mort sur le coup. Rien d'inhabituel. C'est très classique. » Il a été appelé à 7 h. Il regarde beaucoup sa montre.
  
  *Révèle :* Dr Pierre Lacour.
- **Revenir voir Lacour avec le témoignage du gardien** · entretien · Essentielle · après : Bensaïd, second entretien  
  Quand vous lui dites où Bensaïd a trouvé le corps, il cède. Décès entre minuit et une heure, pas à 22 h. « Il n'est pas mort sur le coup. Il a mis longtemps. » Le commissaire lui a demandé d'écrire autre chose.
  
  *Sert à :* Q3 (Faure a survécu près de deux heures après sa chute.) ; Q5 (Le commissaire a fait modifier le certificat.)

### Consigne de la gare de Châteaucreux (Châteaucreux)

- **Ouvrir la consigne** · investigation · Utile  
  Un sac de sport : photocopies des bons de la décharge, photos au flash de camions Ferrand la nuit, et un tableau de la main de Faure : « Prévu 3 000 t. Évacué 400 t. Reste ? »
  
  *Révèle :* copie faure.
  
  *Sert à :* Q4 (Faure avait fait le calcul : 2 600 tonnes manquent.) ; Q2 (Faure gardait ses preuves en lieu sûr.)

### Domicile des Faure (Tarentaize)

- **Rendre visite à Colette Faure** · entretien · Utile  
  Bernard est parti à 19 h le 16, « une réunion », avec le dossier bleu. Elle dit ne pas savoir ce qu'il contenait. Il faisait des heures « pour la petite, à la fac à Lyon ».
  
  *Révèle :* Colette Faure, dossier bleu.
- **Fouiller le bureau de Bernard** · investigation · Utile  
  Le dossier bleu n'y est plus. Des relevés bancaires : crédit immobilier en retard jusqu'en juillet, puis soudain à jour, dépôts en liquide chaque mois. Son agenda : « Mardi 16, 22 h, F. »
  
  *Révèle :* releves faure.
  
  *Sert à :* Q2 (De l'argent liquide arrive chaque mois depuis août.)
- **Revenir voir Colette avec les retraits « B.F. »** · entretien · Essentielle · après : La comptabilité de Ferrand Frères  
  Elle sort de sa boîte à couture le carnet de Bernard : « R.F. 30 » en août, septembre, octobre, puis « R.F. 200 ? » en novembre. Et un ticket de consigne de la gare, trouvé dans son portefeuille.
  
  *Révèle :* carnet versements, ticket consigne, Consigne de la gare de Châteaucreux.
  
  *Sert à :* Q2 (Faure notait les sommes reçues de R.F. et en exigeait 200 000.)

### Ancienne Manufacture Ferréol (Le Soleil)

- **Parler au gardien** · entretien · Utile  
  Des voix vers 22 h, « je suis pas descendu ». Des camions la nuit depuis un mois. « Pour l'histoire de l'usine, voyez Marcel Chaptal, au Cheval Noir. »
  
  *Révèle :* Ahmed Bensaïd, Marcel Chaptal, Café Le Cheval Noir.
- **Faire le tour du site** · investigation · Essentielle  
  Une dalle toute fraîche dans l'aile est, sur la zone de l'escalier. Des projecteurs de chantier et des câbles (les « lueurs » des riverains). Un panneau « Groupe Vallenot, Ferrand Frères ». Un bon de livraison signé G. Mounier, chef d'équipe. Au portail arrière, des traces de camion plateau et un reçu déchiré en quatre. Sur le mur est, un slogan à la peinture. Yves photographie tout.
  
  *Révèle :* Hervé Vallenot, Roger Ferrand, Gérard Mounier, Cabinet Groupe Vallenot, Ferrand Frères BTP.
  
  *Sert à :* Q4 (Une dalle neuve coulée sur un chantier à l'arrêt.)
- **Revenir voir Bensaïd avec le livre de police** · entretien · Essentielle · après : Le livre de police de la casse  
  Il avoue la ferraille, puis tout le reste. À 22 h 40, une Safrane bleu nuit près de l'entrée. À 6 h 30, Faure près de la porte, pas au pied de l'escalier, les yeux ouverts. Quatre mégots de cigarillo à côté de lui, qu'il a gardés dans une boîte d'allumettes. Sa cabane avait été ouverte, le téléphone mal raccroché. C'est le Dr Lacour qui est venu à 7 h. Et « le vieux Chaptal, du Cheval Noir » traînait le long du mur est vers 21 h.
  
  *Révèle :* megots, Dr Pierre Lacour, Marcel Chaptal, Café Le Cheval Noir.
  
  *Sert à :* Q3 (Faure s'est traîné vers la porte ; une Safrane ; des mégots près du corps.)
- **Examiner le sol près de la porte** · investigation · Utile · après : Bensaïd, second entretien  
  Hors de la dalle neuve, dans la poussière de calamine : des traces de doigts sur deux mètres, vers la porte. Un ongle cassé dans une rainure du sol.
  
  *Sert à :* Q3 (Faure était vivant et conscient après sa chute.)

### Café Le Cheval Noir (Le Soleil)

- **Payer un verre à Marcel Chaptal** · entretien · Utile  
  Il raconte le fondeur de 1911 comme s'il y était. Le soir du 16 ? « Au comptoir toute la soirée. Demandez à Jeannot. »
  
  *Révèle :* Marcel Chaptal, Jeannot, patron du Cheval Noir.
- **Parler au patron** · entretien · Utile  
  « Marcel ? Parti vers huit heures, revenu vers dix heures, les mains pleines de peinture blanche. Il m'a dit de dire qu'il était là. »
  
  *Révèle :* Jeannot, patron du Cheval Noir.
- **Revenir voir Chaptal** · entretien · Essentielle · après : Les tirages d'Yves ou Jeannot, patron du Cheval Noir  
  Il avoue le slogan, la lettre du fantôme et deux lettres de menaces à Faure. Ce soir-là, il a vu la 405 grise de Faure vers 21 h, puis à 21 h 50 le camion benne de Ferrand, « le patron lui-même au volant, jamais il conduit, lui ».
  
  *Sert à :* Q6 (Chaptal a écrit la lettre du fantôme.) ; Q1 (Ferrand arrive au site à 21 h 50, seul.)

### Ferrand Frères BTP (Zone industrielle)

- **Rencontrer Roger Ferrand** · entretien · Utile  
  Il répond par des questions. « J'étais chez moi. Demandez à ma femme, elle est au bureau du fond. »
  
  *Révèle :* Roger Ferrand, Simone Ferrand.
- **Jeter un œil à la comptabilité** · investigation · Essentielle  
  Trois virements à la SCI Delombre. Des retraits en liquide notés « B.F. » : 30 000 francs en août, septembre, octobre, et 50 000 le 16 novembre. Dans l'agenda : « Mardi 16, Ferréol 22 h ». Dans le poêle, des cendres de carton bleu et une agrafe de classeur.
  
  *Révèle :* compta ferrand, agenda ferrand.
  
  *Sert à :* Q1 (Ferrand avait rendez-vous à Ferréol à 22 h, avec 50 000 francs.) ; Q2 (Ferrand versait de l'argent à « B.F. ».)
- **Examiner le coffre derrière le calendrier** · investigation · Utile · après : La comptabilité de Ferrand Frères  
  Un petit coffre à combinaison caché derrière le calendrier des Postes. À l'intérieur : 50 000 francs en liasses, les bandes de la banque datées du 16 novembre 1993. L'argent que Ferrand a apporté à Ferréol et qu'il a remporté.
  
  *Révèle :* liasses.
  
  *Sert à :* Q1 (Ferrand a retiré 50 000 francs le jour même et les a rapportés.) ; Q2 (Le dernier paiement n'a jamais été versé.)
- **Parler à Simone Ferrand** · entretien · Utile  
  « Roger est rentré à neuf heures, comme d'habitude. » Tout ce qu'elle dit commence par « Roger dit ». Elle mentionne Gérard Mounier, le chef d'équipe de nuit.
  
  *Révèle :* Simone Ferrand, Gérard Mounier, Cité de Montreynaud, chez Mounier.
- **Revenir voir Simone** · entretien · Utile · après : Chaptal, second entretien ou Gérard Mounier, chef d'équipe ou Berthet, second entretien  
  Elle ne dément pas franchement. Elle raconte que Roger est rentré vers 23 h 20, et qu'il a lavé lui-même son pantalon dans la nuit. « Il fait jamais ça. »
  
  *Sert à :* Q1 (L'alibi de Ferrand tombe.)

### Cité de Montreynaud, chez Mounier (Montreynaud)

- **Aller voir Gérard Mounier** · entretien · Utile  
  « Je sais rien, je fais ce qu'on me dit. » Il laisse échapper que mardi, « le patron a dit de pas venir ». Pour la première fois depuis un mois.
  
  *Révèle :* Gérard Mounier.
  
  *Sert à :* Q1 (Ferrand a écarté son équipe le soir du drame.)
- **Revenir voir Mounier avec les tonnages** · entretien · Utile · après : Le registre de la décharge ou La consigne de Châteaucreux  
  Il comprend qu'il portera le chapeau. Depuis octobre, son équipe enterre des terres noires sous des dalles, la nuit. La nuit du 17, avant de couler la dalle sur la zone de l'escalier, il a vu des traînées sombres. « Le patron a dit : coule. »
  
  *Sert à :* Q4 (Les terres sont enterrées sous les dalles, sur ordre de Ferrand.)

### Casse Berthet (Vallée du Gier)

- **Parler à Lucien Berthet** · entretien · Fausse piste  
  « Ferréol ? J'y ai jamais mis les pieds, l'ami. » Il parle de tout au poids et au prix du kilo.
  
  *Révèle :* Lucien Berthet.
- **Consulter le livre de police** · investigation · Essentielle  
  Le registre obligatoire des ferrailleurs : « 16/11/93, 21 h 30, site Ferréol, A.B., fonte, 1,2 t ». A.B. : Ahmed Bensaïd.
  
  *Révèle :* livre police.
- **Revenir voir Berthet avec son registre** · entretien · Utile · après : Le livre de police de la casse  
  « Bon, j'y étais. » De 21 h 30 à 22 h 30, au portail arrière. Vers 22 h 10, un cri, puis plus rien. Le camion benne de Ferrand était garé dans la cour.
  
  *Sert à :* Q1 (Un cri vers 22 h 10, le camion de Ferrand sur place.)

### Décharge agréée de la Croix-de-l'Orme (Vallée du Gier)

- **Consulter le registre des entrées** · investigation · Essentielle  
  Chantier Ferréol, Ferrand Frères : 400 tonnes reçues au total, en juillet et août. Plus rien depuis septembre.
  
  *Révèle :* registre decharge.
  
  *Sert à :* Q4 (Seulement 400 tonnes sont arrivées à la décharge.)

### Chantier du parking-relais (Bellevue)

- **Visiter le chantier** · investigation · Fausse piste  
  Même attelage, même ligne « études » payée à la SCI Delombre. Ça confirme le système de corruption, pas le meurtre.
  
  *Révèle :* sci delombre.

## Les puzzles

Résoudre un puzzle est gratuit, c'est ouvrir la piste qui coûte. En cas de blocage, un membre de l'équipe le résout contre une piste. Aucun puzzle ne peut bloquer l'enquête.

| Piste | Type | Objet | Solution | Aide |
| --- | --- | --- | --- | --- |
| La facture détaillée de la cabane du gardien | Comparer des documents | Une trentaine d'appels sur la facture | Le joueur repère l'appel de 22 h 24 et reconnaît le numéro de la carte de visite de Vallenot. | Karim épluche la facture et entoure l'appel de 22 h 24. |
| Repérage du chantier | Recoller des morceaux | Le reçu déchiré en quatre | Reçu de la Casse Berthet, Rive-de-Gier, « fonte, 1,2 t », daté du 16/11. | Yves recolle le reçu à votre place. |
| Le coffre de Roger Ferrand | Trouver un code | Le coffre à combinaison (4 chiffres) | 1403 : la date de la mort de Paul Ferrand, donnée par les archives d'Odile. Sur le calendrier, un 14 mars entouré au feutre noir. | Simone laisse échapper le code, contre une piste. |

## Le Minitel

Un outil permanent, gratuit : le joueur tape un nom pour obtenir une adresse. Pour la plupart des personnages, l'adresse est donnée dans la piste qui les nomme. Pour ceux-ci, il faut passer par le Minitel :

- **Lucien Berthet** : « Casse Berthet, Rive-de-Gier »
- **Gérard Mounier** : « G. Mounier, Montreynaud »
- **Dr Pierre Lacour** : « Dr P. Lacour, cours Fauriel »

## La solution de Mathilde

Le chemin le plus court pour répondre à toutes les questions : 12 pistes. Le joueur en a 16, soit 4 de marge pour les détours.

1. **Repérage du chantier** (Ancienne Manufacture Ferréol)
2. **Le livre de police de la casse** (Casse Berthet)
3. **Bensaïd, second entretien** (Ancienne Manufacture Ferréol)
4. **Le bureau de Vallenot** (Cabinet Groupe Vallenot)
5. **Lacour, second entretien** (Cabinet du Dr Lacour)
6. **Igier, second entretien** (Commissariat central)
7. **La comptabilité de Ferrand Frères** (Ferrand Frères BTP)
8. **Colette, second entretien** (Domicile des Faure)
9. **Le dossier de reconversion** (Mairie, service urbanisme)
10. **Le registre de la décharge** (Décharge agréée de la Croix-de-l'Orme)
11. **Les tirages d'Yves** (Rédaction du Stéphanois)
12. **Chaptal, second entretien** (Café Le Cheval Noir)

## Les recoupements, question par question

Chaque réponse s'appuie sur plusieurs pistes. Aucune piste ne donne seule une réponse complète.

### Q1. Qui a fait tomber Bernard Faure ? (Roger Ferrand)

- **Chaptal, second entretien** : Ferrand arrive au site à 21 h 50, seul.
- **La comptabilité de Ferrand Frères** : Ferrand avait rendez-vous à Ferréol à 22 h, avec 50 000 francs.
- **Le coffre de Roger Ferrand** : Ferrand a retiré 50 000 francs le jour même et les a rapportés.
- **Simone, second entretien** : L'alibi de Ferrand tombe.
- **Gérard Mounier, chef d'équipe** : Ferrand a écarté son équipe le soir du drame.
- **Berthet, second entretien** : Un cri vers 22 h 10, le camion de Ferrand sur place.

### Q2. Pourquoi Faure était-il sur le site ce soir-là ? (pour toucher un dernier paiement de son chantage)

- **Roche, second entretien** : Faure voulait vendre son dossier, pas le donner.
- **Le bureau de Bernard Faure** : De l'argent liquide arrive chaque mois depuis août.
- **Colette, second entretien** : Faure notait les sommes reçues de R.F. et en exigeait 200 000.
- **La consigne de Châteaucreux** : Faure gardait ses preuves en lieu sûr.
- **La comptabilité de Ferrand Frères** : Ferrand versait de l'argent à « B.F. ».
- **Le coffre de Roger Ferrand** : Le dernier paiement n'a jamais été versé.

### Q3. Qui a empêché qu'on appelle les secours ? (Hervé Vallenot)

- **La facture détaillée de la cabane du gardien** : Quelqu'un a appelé un radiotéléphone depuis le site, juste après la chute.
- **Hervé Vallenot, le promoteur** : Le numéro du radiotéléphone de Vallenot.
- **Le bureau de Vallenot** : Les mêmes cigarillos que les mégots trouvés près du corps.
- **Le lieutenant Igier** : Le constat place le corps au pied de l'escalier.
- **Lacour, second entretien** : Faure a survécu près de deux heures après sa chute.
- **Bensaïd, second entretien** : Faure s'est traîné vers la porte ; une Safrane ; des mégots près du corps.
- **Près de la porte de l'atelier** : Faure était vivant et conscient après sa chute.

### Q4. Où se trouvent les terres polluées ? (sous les dalles neuves du site)

- **Le dossier de reconversion** : 3 000 tonnes prévues.
- **La consigne de Châteaucreux** : Faure avait fait le calcul : 2 600 tonnes manquent.
- **Repérage du chantier** : Une dalle neuve coulée sur un chantier à l'arrêt.
- **Mounier, second entretien** : Les terres sont enterrées sous les dalles, sur ordre de Ferrand.
- **Le registre de la décharge** : Seulement 400 tonnes sont arrivées à la décharge.

### Q5. Qui a fait classer l'affaire ? (Marcel Roussillon)

- **Igier, second entretien** : Roussillon a appelé le commissaire pour faire classer l'affaire.
- **Lacour, second entretien** : Le commissaire a fait modifier le certificat.

### Q6. Qui a écrit la lettre du fantôme ? (Marcel Chaptal)

- **Les tirages d'Yves** : Même formule que la lettre, peinte la nuit du drame.
- **Chaptal, second entretien** : Chaptal a écrit la lettre du fantôme.

### BONUS. Qui porte la salamandre ? (Roussillon)

- **Marcel Roussillon, adjoint à l'urbanisme** : La salamandre sur la chevalière de Roussillon.

## Les fausses pistes

- **Daniel Roche, chef des faits divers** (fausse piste)
- **Marcel Roussillon, adjoint à l'urbanisme** (fausse piste)
- **Le conseil municipal du 16 novembre** (élimine un suspect)
- **Le Dr Lacour** (fausse piste)
- **Lucien Berthet, ferrailleur** (fausse piste)
- **Le chantier du parking-relais** (fausse piste)
