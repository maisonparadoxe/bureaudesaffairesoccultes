# Bureau des affaires occultes : note de passation

État du projet au 28 septembre 2026, à lire avant de commencer une nouvelle affaire. Cette note résume les décisions prises pendant la création de la première enquête, « Le feu de Ferréol » (Saint-Étienne).

## 1. Le jeu en bref

- **Principe :** enquête textuelle dans le navigateur, inspirée de *Sherlock Holmes Détective Conseil* et de *Bureau of Investigation*.
- **Cadre :** France, 1993. Le joueur incarne **toute l'équipe** du Bureau des affaires occultes : Mathilde Vernet (cheffe), Yves Barral (photographe), Karim Haddou (stagiaire), Odile Perrichon (documentaliste). Ce n'est pas Mathilde seule. Elle parle dans les entretiens, mais le « vous » désigne le groupe.
- **Commande :** le groupe de presse Sarrazin (14 quotidiens régionaux) publie chaque samedi une page « Les Affaires occultes ». Le bouclage a lieu le jeudi à 18 h.
- **Chaque affaire :** une façade occulte, une vérité humaine. Le ton est sombre, parfois proche de l'horreur. Pas de surnaturel avéré, sauf le fil rouge.
- **Fil rouge de la série :** la salamandre (chevalière de Roussillon, carte de bristol dans l'épilogue, devise *Nutrisco et extinguo*). Elle doit revenir dans chaque affaire, sans être expliquée trop tôt.
- **Studio :** Maison Paradoxe. Les crédits n'affichent que « Un jeu · Maison Paradoxe ».
- **En ligne :** https://maisonparadoxe.github.io/bureaudesaffairesoccultes/

## 2. Mécaniques existantes

- **Pistes :** 16 pistes accordées. Le parcours de référence (« le chemin le plus court ») en utilise 12. Au-delà, chaque piste coûte 2 points.
- **Calendrier :** 4 créneaux par jour (9 h, 11 h, 14 h, 16 h), du vendredi au mercredi, puis le bouclage le jeudi à 18 h. Le clocher sonne à chaque nouveau jour. Il pleut à certains créneaux seulement (`calendar.rain`).
- **Entités colorées :** personnes en bleu, lieux en vert, pièces en violet. Un lieu ou une personne n'est connu qu'une fois mentionné dans une piste (syntaxe `{{p:id|texte}}`, `{{l:id|texte}}`, `{{d:id|texte}}`).
- **Entretiens de suite :** « Revenir voir X ». On peut confronter quelqu'un sans l'avoir vu avant : le bouton et le titre s'adaptent (`bouton_seul`, `titre_seul`). Une fois la personne confrontée, le premier entretien disparaît.
- **Minitel 3611 :** l'annuaire répond pour n'importe quel nom, mais une adresse ne débloque le lieu que si l'enquête a déjà parlé de la personne. Liste rouge, SCI introuvable et prénoms seuls donnent des réponses spécifiques.
- **Carnet :** une page par personne, lieu et pièce, avec portrait. Les notes s'y accumulent et se barrent quand elles sont contredites.
- **Puzzles (Saint-Étienne) :** reçu déchiré à reconstituer, facture téléphonique où trouver l'appel suspect, coffre à code. Une aide existe pour chacun ; elle coûte une piste.
- **Fin :** questionnaire (6 questions et un bonus), 4 fins selon les réponses, une du journal, puis l'épilogue avec la salamandre.
- **Autour :** menu principal, sauvegarde automatique, options (volumes, coupure du son, effets réduits, animations, texte plus grand), note de service au premier lancement, fiche de l'enquêteur (points de carrière).

## 3. Idées gardées pour les prochaines affaires

- **Portrait-robot** (idée validée, pas encore faite) : un témoin décrit quelqu'un, le joueur compose un visage (front, yeux, nez, bouche, menton, coiffure), puis le rapproche d'un suspect. Le témoin se trompe sur un seul trait, pour une raison qu'on découvre. À construire autour de l'affaire, pas plaqué dessus.
- **Pas de reconnaissance de voix :** pas d'enregistrements vocaux possibles.
- **Chaque affaire doit apporter au moins une mécanique nouvelle,** pour que le joueur ne sente pas que seule l'histoire change.

## 4. Direction artistique

- **Portraits :** photo de presse argentique noir et blanc, 1993. Kodak Tri-X poussé, flash direct, ombre portée à droite, mur gris clair, tirage abîmé. Visages ordinaires, jamais retouchés. **Mains hors champ.** Format 2:3, 600 × 900. Prompt de base dans `assets-a-creer.md` ; `img/portraits/ferrand.jpg` sert de référence de style. Générés avec ChatGPT, un à la fois, validés ensemble.
- **Musique :** jazz noir feutré (Fender Rhodes, contrebasse, balais), nappes sombres. Générée avec Suno (abonnement payant pour les droits commerciaux), en Cover du morceau `menu.mp3` pour garder le thème. Les musiques bouclent en fondu automatiquement : un morceau Suno avec une vraie fin convient.
- **Sons :** Pixabay ou Freesound en CC0. Fournis bruts, puis coupés et égalisés par Claude.
- **Écriture :** pas de tournures « typiques d'IA », pas de tirets cadratins. Chaque personnage a ses tics de langage, sans cliché.
- **Plan de ville :** dessiné par le jeu (quartiers en tracés SVG, décor, quadrillage A-F / 1-6, cartouche). La géographie doit être juste dans les grandes lignes : vérifier les quartiers réels.

## 5. Organisation des fichiers

- **Le jeu (seul ce qui est publié) :** `index.html`, `style.css`, `tags.css`, `carnet.css`, `jeu.css`, `script.js`, `audio.js`, `data.json`, `data.js`, `img/`, `audio/`.
- **L'atelier d'une ville (`saint-etienne/`, ne pas publier) :** `1-verite.md` (la solution), `2-personnages.md`, `carte.py` (structure : lieux, personnes, pistes, déblocages, Minitel, contrôles), `textes.py` (tous les textes), `verifier_textes.py`, `construire.py` (écrit l'affaire dans `data.json`). Une nouvelle ville = un nouveau dossier sur ce modèle.
- **Chaîne de construction :** `python3 carte.py`, puis `python3 verifier_textes.py`, puis `python3 construire.py`, puis `node outils/verifier.js` (qui contrôle tout et régénère `data.js`).
- **Ne jamais modifier `data.json` à la main :** il est reconstruit.
- **Nyons** est déjà déclarée dans `data.json` avec le statut `coming_soon`, comme les autres villes.
- **Assets :** `assets-a-creer.md` tient la liste à jour de ce qui est fait et de ce qui manque.

## 6. Méthode de travail qui a bien marché

1. Écrire d'abord la vérité complète (chronologie, qui a fait quoi, pourquoi), puis les personnages avec ce qu'ils savent, cachent et mentent.
2. Construire la carte des pistes (déblocages, chemin le plus court, contrôle que tout est accessible), avant d'écrire les textes.
3. Écrire les textes, les vérifier, construire, puis rejouer l'affaire en test automatique.
4. Assets en dernier, un à la fois, validés ensemble.
5. Pendant le développement, ne pas renvoyer de zip complet à chaque fois : l'utilisateur demande le dossier quand il le souhaite.
