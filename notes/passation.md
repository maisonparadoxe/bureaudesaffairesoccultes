# Bureau des affaires occultes : note de passation

État du projet au 28 septembre 2026, à lire avant de commencer une nouvelle affaire. Cette note résume les décisions prises pendant la création de la première enquête, « Le feu de Ferréol » (Saint-Étienne), puis pendant la conception de la deuxième (Nyons).

## 1. Le jeu en bref

- **Principe :** enquête textuelle dans le navigateur, inspirée de *Sherlock Holmes Détective Conseil* et de *Bureau of Investigation*.
- **Cadre :** France, **années 1990**. Chaque affaire a sa propre date (Ferréol : novembre 1993 ; Nyons : juin 1994). Les enquêtes sont regroupées sous l'étiquette « Années 1990 » (le tampon du logo), pour pouvoir un jour ouvrir d'autres époques (passé ou futur). Rien d'autre dans l'interface commune ne doit porter une année précise.
- **L'équipe :** le joueur incarne **toute l'équipe** du Bureau des affaires occultes : **Paul Moreau** (chef), Yves Barral (photographe), Karim Haddou (stagiaire), Odile Perrichon (documentaliste). Ce n'est pas Paul seul. Il parle dans les entretiens, mais le « vous » désigne le groupe.
  - **Paul Moreau** remplace Mathilde Vernet (ancienne cheffe, première version). Le changement est fait partout : textes, note de service, questionnaire, portrait `img/equipe/paul.jpg`.
  - **Ses tics :** il affirme faux pour se faire corriger (« Vous étiez à Ferréol mardi soir, donc. ») et répond « Admettons. » quand il n'est pas convaincu. Imperméable, cigarette qu'il ne rallume pas. Les témoins l'appellent « monsieur ».
  - **Attention aux prénoms :** « Paul » est réservé au chef. Le frère mort de Roger Ferrand s'appelle désormais André.
- **Commande :** le groupe de presse Sarrazin (14 quotidiens régionaux) publie chaque samedi une page « Les Affaires occultes ». Le bouclage a lieu le jeudi à 18 h.
- **Chaque affaire :** une façade occulte, une vérité humaine. Le ton est sombre, parfois proche de l'horreur. Pas de surnaturel avéré, sauf le fil rouge.
- **Studio :** Maison Paradoxe. Les crédits n'affichent que « Un jeu · Maison Paradoxe ».
- **En ligne :** https://maisonparadoxe.github.io/bureaudesaffairesoccultes/

## 2. Le fil rouge : la salamandre et les Gardiens du seuil

- **Le signe :** une salamandre dans les flammes, devise *Nutrisco et extinguo*. Lecture possible : « je nourris le vrai feu, j'éteins le faux ».
- **Ce qu'elle est (jamais dit au joueur avant longtemps) :** l'emblème des **Gardiens du seuil**, un ordre très ancien qui enquête en secret, depuis des siècles, sur le surnaturel et sur ceux qui prétendent l'être. Les Gardiens sont **neutres** : ni bons ni mauvais, ils défendent le seuil sans prendre parti. Le joueur doit longtemps douter de leur camp.
- **Roussillon (Ferréol) :** il a hérité de la chevalière sans en connaître le sens. Il n'est pas un Gardien. C'est ce qui explique que le joueur ait d'abord vu le signe au doigt d'un homme corrompu.
- **Épilogue de Ferréol :** le lundi 29 novembre 1993, une carte de bristol arrive au Bureau (salamandre, devise). Odile : « Je l'ai déjà vue quelque part. » Elle ne dit pas où.
- **Règle :** la salamandre revient dans chaque affaire, sans être expliquée trop tôt. Chaque apparition doit en montrer une facette différente.

## 3. Mécaniques existantes

- **Pistes :** 16 pistes accordées. Le chemin de référence (« le chemin le plus court ») en utilise 12. Au-delà, chaque piste coûte 2 points.
- **Calendrier :** 4 créneaux par jour (9 h, 11 h, 14 h, 16 h), du vendredi au mercredi, puis le bouclage le jeudi à 18 h. Le clocher sonne à chaque nouveau jour. Il pleut à certains créneaux seulement (`calendar.rain`).
- **Entités colorées :** personnes en bleu, lieux en vert, pièces en violet. Un lieu ou une personne n'est connu qu'une fois mentionné dans une piste (syntaxe `{{p:id|texte}}`, `{{l:id|texte}}`, `{{d:id|texte}}`).
- **Entretiens de suite :** « Revenir voir X ». On peut confronter quelqu'un sans l'avoir vu avant : le bouton et le titre s'adaptent (`bouton_seul`, `titre_seul`). Une fois la personne confrontée, le premier entretien disparaît.
- **Minitel 3611 :** l'annuaire répond pour n'importe quel nom, mais une adresse ne débloque le lieu que si l'enquête a déjà parlé de la personne. Liste rouge, SCI introuvable et prénoms seuls donnent des réponses spécifiques.
- **Carnet :** une page par personne, lieu et pièce, avec portrait. Les notes s'y accumulent et se barrent quand elles sont contredites.
- **Puzzles (Saint-Étienne) :** reçu déchiré à reconstituer, facture téléphonique où trouver l'appel suspect, coffre à code. Une aide existe pour chacun ; elle coûte une piste.
- **Le tableau de Karim (puzzle de type `grille`, prêt pour Nyons) :** plusieurs témoins, une grille par catégorie, un seul témoin ment et tout ce qu'il dit est faux. Les grilles sont un **brouillon jamais vérifié** (décision du 2 octobre) : une case se touche une fois pour une croix, deux fois pour un rond ; un rond barre le reste de sa ligne et de sa colonne, et un nouveau rond remplace l'ancien. Seules comptent les réponses aux **questions de Paul** (`questions` dans les données ; pour Nyons : qui ment, où était-il à 22 h, qu'avait Hélène dans son sac). Une mauvaise réponse coûte une piste (« Admettons. »). La première aide donne un indice, la seconde la solution, chacune coûte une piste. Code : `tableau.js` ; essai hors du jeu : `outils/essai-tableau.html`. L'unicité de la solution se vérifie avec `nyons/outils/verifier_confrontation.py`.
- **Fin : l'article à trous** (remplace l'ancien QCM depuis le 28 septembre, inspiré de *The Case of the Golden Idol*). Paul « tape » la page du samedi ; le joueur remplit les blancs avec les mots découverts. Quatre couleurs : personne (bleu), lieu (vert), pièce (prune), **action** (ambre, nouvelle famille de mots : « fait chanter », « pousse »…). On touche un blanc, puis un mot. Tous les blancs doivent être remplis (pas de blanc vide : les phrases perdraient leur sens).
  - **Relecture de Jean-Loup, trois passages au plus.** Passage 1 faux : il marque en rouge les paragraphes qui ne tiennent pas, sans dire quel blanc. Passage 2 faux : il marque les blancs faux. Passage 3 : l'article part tel quel. Points gardés : 100 %, 80 %, 60 % selon le passage. On peut aussi envoyer la dernière version relue sans la corriger.
  - **Données :** dans `textes.py`, `ACTIONS` (les mots d'action), `DEBLOCAGE_ACTIONS` (quelle piste débloque quel mot ; attention à ne pas débloquer trop tôt un mot qui dévoile un retournement), `LIEUX_ARTICLE` (comment un lieu s'écrit dans une phrase), `ARTICLE` (paragraphes, blancs `[[type:id|Q1]]`), `POINTS`, `RELECTURE`. Chaque blanc est rattaché à une question (Q1 à Q6, BONUS) : les fins et les compléments se décident comme avant.
  - **Contrôles :** `verifier.js` vérifie que chaque blanc peut être rempli juste avec le chemin de référence et qu'il y a au moins deux mots possibles par blanc.
  - Puis 4 fins selon les réponses, la une du journal, le bilan paragraphe par paragraphe, et l'épilogue avec la salamandre.
- **Équipe du Bureau, accessible pendant l'enquête (depuis le 28 septembre) :** avant, l'équipe (Paul, Yves, Karim, Odile) n'apparaissait qu'une fois, sur la note de service, avant de choisir une ville. Un bouton « L'équipe du Bureau » a été ajouté dans la colonne de gauche, section Outils, au-dessus de « Carnet de l'enquête » — il ouvre à tout moment un écran avec les quatre portraits, rôles et bios (`renderEquipe`, vue `equipe`, réutilise les données `prologue.equipe` de `data.json` et le style `.equipe-grille` déjà existant).
- **Confort mobile (29 septembre) :** un audit sur écran 390×844 a montré deux frictions systématiques sur téléphone. 1) Aucun écran ne remontait en haut lors d'un changement de vue (démarrer l'enquête, ouvrir un outil, changer de quartier) : le joueur atterrissait au milieu de l'écran précédent. Corrigé avec deux fonctions, `scrollToTop()` (remonte en haut de la page — utilisée pour « Commencer l'enquête », reprise de sauvegarde, changement de quartier, retour aux affaires) et `scrollToPanel()` déjà existante (scrolle jusqu'au panneau de contenu — utilisée pour les 4 boutons Outils : Équipe, Carnet, Annuaire, Minitel). 2) La carte de la ville s'affichait en haut de CHAQUE écran d'enquête, y compris Carnet/Annuaire/Minitel/Équipe où elle n'a aucun rapport, obligeant à un long scroll avant d'atteindre le vrai contenu sur mobile. Corrigé en ajoutant une classe `map-secondaire` à la carte quand `state.view` n'est pas `quartier`/`location` (liste `VUES_AVEC_CARTE` dans `renderMainGrid`), masquée uniquement sur mobile via `@media (max-width: 760px) { .city-map-wrap.map-secondaire { display: none; } }` dans `jeu.css` — la carte reste affichée normalement sur desktop.
- **Barre d'outils fixe sur mobile (29 septembre, suite) :** troisième et dernière brique du confort mobile. Une barre `<nav class="mobile-tabbar">` fixée en bas d'écran (5 boutons : Carte, Équipe, Carnet, Annuaire, Minitel) est maintenant toujours visible sans scroller, sur les écrans d'enquête (`MOBILE_TABBAR_VIEWS` = pistes/lieu/carnet/annuaire/minitel/équipe). Elle est absente sur l'écran de l'article (la banque de mots y occupe déjà le bas d'écran) et sur les écrans hors-enquête. Onglet actif mis en évidence en rouge tampon. Masquée par défaut, affichée uniquement sous `@media (max-width: 760px)` — le desktop garde la colonne de gauche inchangée. `render()` bascule une classe `has-tabbar` sur `<body>` qui ajoute le padding-bottom nécessaire pour que le dernier bloc de contenu ne se cache pas sous la barre. Testé en Playwright (390×844) sur les 5 écrans + vérifié absente sur l'article + vérifié invisible en desktop (1280×900). Avec ça, les trois frictions mobiles identifiées le 29 septembre sont traitées.
- **Autour :** menu principal, sauvegarde automatique, options (volumes, coupure du son, effets réduits, animations, texte plus grand), note de service au premier lancement, fiche de l'enquêteur (points de carrière).

## 4. Idées gardées pour les prochaines affaires

- **Portrait-robot** (validé, utilisé à Nyons) : un témoin décrit quelqu'un, le joueur compose un visage (front, yeux, nez, bouche, menton, coiffure), puis le rapproche d'un suspect. Le témoin se trompe sur un trait, pour une raison qu'on découvre.
- **Pas de reconnaissance de voix :** pas d'enregistrements vocaux possibles.
- **Chaque affaire écrit son article à trous** (même système pour toutes les enquêtes).
- **Chaque affaire doit apporter au moins une mécanique nouvelle,** pour que le joueur ne sente pas que seule l'histoire change.
- **La jauge de rumeur** (en réserve) : une jauge à trois niveaux qui monte quand l'équipe pose des questions sur une rumeur au village, et déclenche des événements (inscription sur un mur, témoin qui se ferme). Pensée pour une affaire de sorcellerie de village, écartée pour Nyons.
- **La planche-contact d'Yves** (en réserve) : un outil pour examiner les photos d'un lieu à la loupe et y trouver des détails absents du texte.
- **Affaire en réserve, « La masco » :** un vieil oléiculteur qui se croit ensorcelé meurt empoisonné à l'arsenic (arsénite de soude des vignes) par sa fille, battue ; le village accuse une herboriste néo-rurale. Portrait-robot faussé par le préjugé, datation des doses par les lignes des ongles. Une excellente candidate pour une future affaire de village.

## 5. Direction artistique

- **Portraits :** photo de presse argentique noir et blanc, années 1990. Kodak Tri-X poussé, flash direct, ombre portée à droite, mur gris clair, tirage abîmé. Visages ordinaires, jamais retouchés. **Mains hors champ.** Format 2:3, 600 × 900. Prompt de base dans `assets-a-creer.md` (la date du prompt s'adapte à chaque affaire) ; `img/portraits/ferrand.jpg` sert de référence de style. Générés avec ChatGPT, un à la fois, validés ensemble.
- **Logo :** carte de papier kraft, lettrage machine à écrire, tampon rouge « France · Années 1990 » (`img/logo.png`, PNG transparent 1200 × 690).
- **Musique :** jazz noir feutré (Fender Rhodes, contrebasse, balais), nappes sombres. Générée avec Suno (abonnement payant pour les droits commerciaux), en Cover du morceau `menu.mp3` pour garder le thème. Les musiques bouclent en fondu automatiquement : un morceau Suno avec une vraie fin convient.
- **Sons :** Pixabay ou Freesound en CC0. Fournis bruts, puis coupés et égalisés par Claude.
- **Écriture :** pas de tournures « typiques d'IA », pas de tirets cadratins. Chaque personnage a ses tics de langage, sans cliché.
- **Plan de ville :** dessiné par le jeu (quartiers en tracés SVG, décor, quadrillage A-F / 1-6, cartouche). La géographie doit être juste dans les grandes lignes : vérifier les quartiers réels.

## 6. Organisation des fichiers

- **Le jeu (seul ce qui est publié) :** `index.html`, `style.css`, `tags.css`, `carnet.css`, `jeu.css`, `script.js`, `audio.js`, `data.json`, `data.js`, `img/`, `audio/`.
- **L'atelier d'une ville (`saint-etienne/`, ne pas publier) :** `1-verite.md` (la solution), `2-personnages.md`, `carte.py` (structure : lieux, personnes, pistes, déblocages, Minitel, contrôles, chemin de référence `REFERENCE`), `textes.py` (tous les textes), `verifier_textes.py`, `construire.py` (écrit l'affaire dans `data.json`). Une nouvelle ville = un nouveau dossier sur ce modèle.
- **Chaîne de construction :** `python3 carte.py`, puis `python3 verifier_textes.py`, puis `python3 construire.py`, puis `node outils/verifier.js` (qui contrôle tout et régénère `data.js`).
- **Ne jamais modifier `data.json` à la main :** il est reconstruit.
- **`construire.py` ne touche qu'à sa ville.** Celui de Saint-Étienne ne vide plus Nyons (corrigé le 28 septembre). Il écrit encore la note de service et les crédits, communs à tout le jeu : quand Nyons aura son propre `construire.py`, il faudra sortir ces deux blocs dans un script commun (par exemple `outils/commun.py`), pour qu'une seule source les écrive.
- **Nyons** est déjà déclarée dans `data.json` avec le statut `coming_soon`, comme les autres villes.
- **Assets :** `assets-a-creer.md` tient la liste à jour de ce qui est fait et de ce qui manque.

## 7. Méthode de travail qui a bien marché

1. Écrire d'abord la vérité complète (chronologie, qui a fait quoi, pourquoi), puis les personnages avec ce qu'ils savent, cachent et mentent.
2. Construire la carte des pistes (déblocages, chemin le plus court, contrôle que tout est accessible), avant d'écrire les textes.
3. Écrire les textes, les vérifier, construire, puis rejouer l'affaire en test automatique.
4. Assets en dernier, un à la fois, validés ensemble.
5. Pendant le développement, ne pas renvoyer de zip complet à chaque fois : l'utilisateur demande le dossier quand il le souhaite.

## 8. Chantiers ouverts

- **Synchronisation :** la référence du jeu est le dépôt GitHub `maisonparadoxe/bureaudesaffairesoccultes` (publié sur GitHub Pages). Le dossier local `C:\Users\Pascal\Documents\MaisonParadoxe\bureau-affaires-occultes` en est une copie : le mettre à jour en même temps que le dépôt.
- **Ce que `script.js` suppose encore de Saint-Étienne (à rendre propre à chaque affaire avant Nyons) :**
  - l'écran d'accueil du Minitel affiche « LOCALITÉ : SAINT-ÉTIENNE (42) » ;
  - la une de fin affiche « Le Stéphanois » et « Samedi 27 novembre 1993 » ;
  - la pluie est la seule météo prévue (`weather: "pluie"`) : Nyons aura besoin d'une autre (soleil, vent, cigales) ;
  - l'écran d'intro et la note de service jouent l'ambiance « bureau-lyon » avec la pluie sur la vitre : ça reste juste pour Lyon, mais pas forcément en juin.
  Il suffira de lire ces valeurs dans l'affaire (`cs.journal`, `cs.dateUne`, `cs.localite`, `cs.weather`), avec les valeurs actuelles par défaut.

## 9. Nyons : décisions prises (conception en cours, rien d'écrit)

- **Date :** fin juin 1994. Proposition de calendrier, à confirmer : enquête du vendredi 17 au mercredi 22 juin, bouclage le jeudi 23, page le samedi 25. La fête de la musique tombe le mardi 21.
- **Affaire retenue : « Le noyé de l'Ouvèze ».** Arrière-plan réel : la crue de l'Ouvèze à Vaison-la-Romaine, le 22 septembre 1992. Les victimes et le camping de l'histoire sont inventés ; la catastrophe est traitée avec gravité.
  - **Le disparu :** gérant d'un petit camping au bord de l'Ouvèze. Le soir de la crue, il a évacué ses campeurs, mais il a oublié une caravane, et ses occupants sont morts. Il n'a pas supporté de l'avoir oubliée. Il a poussé sa voiture dans le courant et disparu. Ni monstre ni héros.
  - **Le faux témoignage :** son ami le meunier de Nyons a déclaré l'avoir vu emporté en aidant des campeurs. Le disparu est devenu un héros local, son nom est sur une plaque. Il a été déclaré mort par jugement, et l'assurance-vie a été versée à sa femme.
  - **Le déclencheur :** en juin 1994, le quotidien Sarrazin local publie la photo des vainqueurs d'un concours de pétanque. On y reconnaît le mort, sous un autre nom. Quelques jours plus tard, le meunier est retrouvé noyé dans le canal.
  - **La coupable : la veuve.** Elle savait depuis le début que son mari était vivant. Le meunier menaçait de tout dire, donc l'assurance, la maison, l'avenir des enfants. Le revenant est une fausse piste parfaite : tout l'accuse, il n'a pas tué.
  - **La façade :** « la rivière rend ses morts ». Des gens de Vaison croient revoir d'autres disparus.
- **Ambiance :** été naissant, cigales (elles commencent fin juin), chaleur, lumière dure, pétanque. La boule lyonnaise sert de marqueur de personnage (un homme venu d'ailleurs). Pas de moulin en activité : on presse les olives en hiver ; en juin, ce sont les cerises, les abricots, le marché du jeudi, les concours de boules.
- **Mécaniques nouvelles :**
  - **Portrait-robot à deux témoins :** la saisonnière (ou le témoin du concours) et Karim, qui voit le revenant pendant la poursuite. Chacun se trompe sur un trait différent (l'un contaminé par la photo de l'avis de recherche, l'autre par la nuit et la peur) ; en les croisant, le joueur retrouve le vrai visage.
  - **Une scène de poursuite** (une seule par affaire au maximum) : une nuit, au camping dévasté ou sous le pont roman, choix en temps limité : se cacher (on voit son visage), le poursuivre (plaque, démarche), lui barrer la route (il fuit, un témoin disparaît), frapper ou lancer une boule (Karim arrêté, un jour perdu, et la fin « Le Bureau fait la une » où l'article est annulé). Pas d'arme, pas de corps à cacher, pas de game over sec. Aucune issue ne bloque la solution.
  - **La jauge de rumeur n'est pas retenue** pour Nyons.
- **Confrontation façon *Murdle* (validée le 1er octobre) :** quatre témoins le soir de la mort du meunier, un seul ment, le joueur remplit le tableau de recoupement de Karim. Le menteur est le revenant. Trois grilles : lieu, objet, raison d'être dehors (à la place des mobiles). Premier jet dans `nyons/confrontation-premier-jet.md` ; le tableau est jouable dans `outils/essai-tableau.html`.
- **Salamandre à Nyons :** un Gardien discret parmi les personnages secondaires (piste : un vieux joueur de boules ou le curé), qui a enquêté sur le revenant avant le Bureau. Le joueur trouve ses notes, et elles sont justes. À préciser.
