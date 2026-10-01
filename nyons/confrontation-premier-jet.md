# Nyons : la confrontation du canal (premier jet)

Mécanique façon *Murdle* pour « Le noyé de l'Ouvèze ». Les noms des personnages sont validés.

## Où elle se place

Le meunier est retrouvé noyé dans le canal le jeudi 16 juin au matin. Il est mort dans la nuit du mercredi 15. Vers le milieu de l'enquête (le dimanche ou le lundi), le Bureau sait que quatre personnes étaient dehors, près du centre, ce mercredi vers 22 h. Paul les fait revenir une par une. Karim recopie leurs déclarations dans un **tableau de recoupement**, et c'est au joueur de le remplir.

La question posée au joueur : **à 22 h, qui était où, avec quoi, pour quelle raison, et qui ment ?**

## Les quatre témoins

- **Hélène Garcin**, la veuve du disparu (la coupable, mais pas à 22 h).
- **Lucien Royer**, l'homme de la photo du concours de pétanque. C'est le disparu sous un autre nom (le revenant).
- **Firmin Achard**, vieux joueur de boules, discret. C'est le Gardien de la salamandre.
- **Sandrine Mollet**, saisonnière aux cerises.

**Lieux :** la berge du canal, le pont roman, le boulodrome de la Digue, le café des Arcades.
**Objets :** une lampe de poche, les clés du moulin, le journal du jour (avec la photo), une boule lyonnaise.
**Raisons d'être dehors** (à la place des mobiles de *Murdle*) : venir s'expliquer avec quelqu'un, attendre quelqu'un, surveiller quelqu'un, chercher un objet perdu.

## Les déclarations

Un seul des quatre ment, et tout ce qu'il dit est faux. Les trois autres disent vrai.

- **Hélène Garcin :** « J'ai passé la soirée au café des Arcades. Demandez à qui vous voulez. »
- **Lucien Royer :** « Le canal ? Je n'y ai pas mis les pieds de la soirée. »
  « J'avais mes boules avec moi, comme tous les soirs. Je ne les quitte pas. »
  « Si je suis sorti, c'est pour chercher une boule que j'avais oubliée sur la Digue. Rien d'autre. »
- **Firmin Achard :** « Une lampe ? À mon âge, je connais chaque pierre de ce pays. »
  « Je n'étais ni au bord de l'eau, ni sur la Digue. »
  « Je ne cherchais rien, et je n'attendais personne. »
- **Sandrine Mollet :** « La boule lyonnaise, c'est moi qui l'avais. Je l'ai ramassée par terre, elle traînait. »
  « Madame Garcin n'avait pas le journal. Elle a fait suspendre l'abonnement après la photo, tout le monde le sait. »

## Les indices matériels (toujours vrais)

Ils viennent de pistes ordinaires et s'inscrivent dans le Carnet.

1. **Le cantonnier de la Digue** a vu une femme seule près du boulodrome vers 22 h.
2. **Les gendarmes** ont retrouvé une lampe de poche sur la berge du canal. Celui qui la tenait était donc au canal.
3. **Le serveur des Arcades :** sa cliente de 22 h « a regardé la porte toute la soirée ». La personne aux Arcades attendait quelqu'un.
4. **La femme de ménage du meunier :** il lui avait dit qu'il devait « s'expliquer avec quelqu'un, au canal, ce soir ». La personne au canal venait s'expliquer.

## La solution

| Témoin | Lieu à 22 h | Objet | Raison d'être dehors |
|---|---|---|---|
| Hélène Garcin | café des Arcades | clés du moulin | attendre quelqu'un |
| Lucien Royer | berge du canal | lampe de poche | venir s'expliquer |
| Firmin Achard | pont roman | journal du jour | surveiller quelqu'un |
| Sandrine Mollet | boulodrome de la Digue | boule lyonnaise | chercher un objet perdu |

**Le menteur est Lucien Royer.**

Le raisonnement attendu :

1. Royer et Sandrine disent tous les deux avoir eu la boule lyonnaise. Ils ne peuvent pas dire vrai tous les deux, donc le menteur est l'un des deux. Hélène et Firmin disent vrai.
2. Hélène était aux Arcades. Firmin n'était ni au canal ni sur la Digue, donc il était au pont.
3. Une femme était à la Digue (indice 1). Hélène est aux Arcades, donc c'est Sandrine.
4. Il ne reste que le canal pour Royer. Il dit n'y avoir jamais mis les pieds : c'est lui qui ment, et Sandrine dit vrai.
5. La lampe était au canal (indice 2), donc c'est Royer qui l'avait. La boule est à Sandrine. Hélène n'avait pas le journal, donc elle avait les clés du moulin, et Firmin le journal.
6. Aux Arcades, on attendait (indice 3) : c'est Hélène. Au canal, on venait s'expliquer (indice 4) : c'est Royer, qui prétendait chercher une boule. Firmin ne cherchait rien et n'attendait personne, donc il surveillait. Il reste « chercher un objet perdu » pour Sandrine.

J'ai vérifié par programme qu'il n'existe qu'une seule solution et un seul menteur (`outils/verifier_confrontation.py`, qui teste toutes les combinaisons).

## Ce que ça apporte à l'histoire

- **Le menteur n'est pas le coupable.** Résoudre la grille confirme la fausse piste : Royer était au canal et il l'a caché. On apprendra plus tard que le meunier est mort vers 23 h, après le départ de Royer. C'est exactement « tout l'accuse, il n'a pas tué », et ça apprend au joueur à se méfier de sa propre déduction.
- **La vraie piste est cachée dans une déclaration vraie.** Hélène a un alibi solide à 22 h, mais elle avait les clés du moulin dans son sac. Pourquoi la veuve d'un autre a-t-elle les clés du meunier ? C'est un détail que le joueur attentif garde pour plus tard.
- **La salamandre :** Firmin était sur le pont roman avec le journal, et il surveillait quelqu'un. De là-haut, on voit la berge du canal : il a vu la lumière de la lampe. Ses notes, trouvées plus tard, le confirmeront.
- **Hélène attendait quelqu'un,** avec les clés du moulin. Qui ? Elle dira « une amie qui n'est jamais venue ». La vérité viendra plus tard.
- **Sandrine cherchait un objet perdu** (sa montre, sur le terrain de l'après-midi), et elle a ramassé la boule de Royer à la place.
- **La boule lyonnaise** (le marqueur de l'homme venu d'ailleurs) n'était plus entre les mains de Royer. Il l'avait perdue sur la Digue, ce qui donne une piste pour la poursuite.

## À l'écran

- Le **tableau de Karim** s'ouvre depuis le Carnet. Il compte trois petites grilles de 4×4 (témoins × lieux, témoins × objets, témoins × raisons). Elles tiennent en largeur sur un téléphone, empilées l'une sous l'autre. On touche une case pour mettre une croix, et une deuxième fois pour un rond.
- Les déclarations et les indices matériels s'affichent au-dessus, avec les couleurs habituelles.
- Pour valider, le joueur désigne le menteur et remplit la soirée. Une erreur ne bloque rien : Paul répond « Admettons. » et l'équipe perd un créneau.
- **Une aide existe** et coûte une piste, comme pour les puzzles de Saint-Étienne. Elle donne l'étape 1 du raisonnement.
- **Une bonne réponse** débloque « Revenir voir Lucien Royer » (on le confronte à son mensonge) et ajoute les clés du moulin au Carnet comme pièce.

**Décidé le 1er octobre 2026 :** le menteur est le revenant (Lucien Royer) ; une troisième grille « raison d'être dehors » remplace les mobiles ; les noms sont validés.
