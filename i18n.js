// Langue du jeu : français (langue d'origine) ou anglais.
//
// Le code écrit ses textes en français et les passe par t("…") : en anglais,
// t() renvoie la traduction ci-dessous ; un texte absent reste en français.
// Les données de l'enquête ont leur propre version anglaise (data-en.json,
// construite par outils/traduction.js).
//
// Le choix est gardé dans le navigateur. Au premier lancement, le jeu suit la
// langue du navigateur : français pour un navigateur en français, anglais sinon.
(function () {
  "use strict";

  const KEY = "bao-langue";
  let lang = null;
  try {
    lang = localStorage.getItem(KEY);
  } catch (e) {}
  if (lang !== "fr" && lang !== "en") {
    const nav = (navigator.languages && navigator.languages[0]) || navigator.language || "fr";
    lang = /^fr\b/i.test(nav) ? "fr" : "en";
  }

  const EN = {
    // Carrière
    "Stagiaire": "Intern",
    "Journaliste": "Reporter",
    "Journaliste confirmé": "Senior reporter",
    "Grand reporter": "Special correspondent",
    "Rédacteur en chef": "Editor-in-chief",
    "Premier article publié": "First article published",
    "Une affaire menée jusqu'au bout.": "A case seen through to the end.",
    "Réussite majeure": "Major success",
    "Réussite": "Success",
    "Demi-succès": "Partial success",
    "Échec": "Failure",
    "Une enquête résolue presque sans faute.": "A case solved almost without a mistake.",
    "Plume assidue": "Prolific pen",
    "Deux affaires ou plus menées à terme.": "Two or more cases seen through.",
    "à l'instant": "just now",
    "il y a {n} min": "{n} min ago",
    "il y a {n} h": "{n} h ago",
    "il y a {n} jour": "{n} day ago",
    "il y a {n} jours": "{n} days ago",

    // Textes balisés et légende
    "Aller : {lieu}": "Go to: {lieu}",
    "Ouvrir la fiche du carnet": "Open the notebook entry",
    "Personnes": "People",
    "Lieux": "Places",
    "Pièces du dossier": "Evidence",
    "L'intro": "The introduction",
    "Aucune donnée disponible": "No data available",
    "Erreur de chargement des données : ": "Error loading the data: ",

    // Bandeau
    "Fiche de l'enquêteur": "Investigator's record",
    "Options": "Options",
    "Crédits": "Credits",
    "Note de service": "Internal memo",
    "Bureau des affaires occultes": "Bureau of Occult Affairs",
    "Choisir une ville": "Choose a city",
    "Menu principal (la partie est sauvegardée)": "Main menu (your game is saved)",
    "☰ Menu": "☰ Menu",
    "Réglages du son": "Sound settings",
    "Voir la fiche de l'enquêteur": "View the investigator's record",
    "points de carrière": "career points",
    "Rédiger l'article →": "Write the article →",
    "piste avant le bouclage": "lead left before the deadline",
    "pistes avant le bouclage": "leads left before the deadline",

    // Son
    "Couper tous les sons": "Mute all sound",
    "Effets": "Effects",
    "Ambiances": "Ambience",
    "Musique": "Music",
    "Animations, pluie et lumière du jour": "Animations, rain and daylight",
    "Les sons ne sont joués que si les fichiers sont présents dans le dossier audio.": "Sounds only play if the files are in the audio folder.",

    // Logo de secours (si l'image manque)
    "Bureau des": "Bureau of",
    "Affaires": "Occult",
    "occultes": "Affairs",
    "France · Années 1990": "France · 1990s",

    // Menu principal
    "Menu principal": "Main menu",
    "Continuer": "Continue",
    "{n} piste lue": "{n} lead read",
    "{n} pistes lues": "{n} leads read",
    "Aucune enquête en cours": "No case in progress",
    "Nouvelle partie": "New game",
    "Choisir une ville et une affaire": "Choose a city and a case",
    "Prendre connaissance du dossier": "Read the brief",
    "Son, animations, taille du texte, langue": "Sound, animations, text size, language",
    "{n} point": "{n} point",
    "{n} points": "{n} points",
    "Sauvegarde automatique dans ce navigateur.": "Saved automatically in this browser.",

    // Note de service
    "Date": "Date",
    "De": "From",
    "À": "To",
    "Copie": "Copy",
    "Objet": "Subject",
    "Le Bureau des affaires occultes": "The Bureau of Occult Affairs",
    "Accepter le dossier": "Accept the assignment",
    "← Menu principal": "← Main menu",
    "← Retour": "← Back",

    // Options
    "Son": "Sound",
    "Effets sonores réduits (seulement le tampon et la sonnette)": "Fewer sound effects (only the stamp and the bell)",
    "Lecture": "Reading",
    "Texte plus grand pour les pistes et le carnet": "Larger text for leads and the notebook",
    "Progression": "Progress",
    "Votre progression est sauvegardée automatiquement dans ce navigateur, sur cet ordinateur. Elle disparaît si vous videz les données de navigation.":
      "Your progress is saved automatically in this browser, on this computer. It will be lost if you clear your browsing data.",
    "Effacer toute ma progression": "Erase all my progress",
    "Effacer toutes les enquêtes en cours, les affaires terminées, les scores et la fiche de l'enquêteur ? Cette action est définitive.":
      "Erase all cases in progress, completed cases, scores and the investigator's record? This cannot be undone.",
    "Enquête fictive. Personnages, entreprises et faits sont imaginaires.": "A work of fiction. All characters, companies and events are imaginary.",

    // Villes et affaires
    "Relire la note de service": "Reread the memo",
    "Choisissez une ville pour consulter les affaires qui vous y attendent. De nouvelles villes s'ouvriront au fil de votre carrière de journaliste.":
      "Choose a city to see the cases waiting for you there. New cities will open up as your career as a journalist progresses.",
    "🔒 Bientôt disponible": "🔒 Coming soon",
    "← Retour aux villes": "← Back to cities",
    "À découvrir": "Not yet played",
    "Terminée : meilleur score {score} / {max}": "Completed: best score {score} / {max}",
    "🔒 Terminez l'affaire précédente pour débloquer": "🔒 Complete the previous case to unlock",
    "← Retour aux affaires": "← Back to cases",
    "Dossier ouvert": "Case opened",
    "Reprendre l'enquête ({n} piste déjà lue)": "Resume the investigation ({n} lead already read)",
    "Reprendre l'enquête ({n} pistes déjà lues)": "Resume the investigation ({n} leads already read)",
    "Nouvelle tentative (efface la sauvegarde)": "Start again (erases the save)",
    "Commencer l'enquête": "Start the investigation",
    "Dernière sauvegarde : {date} à {heure}": "Last saved: {date} at {heure}",

    // Plan
    "Quartier {nom}": "District: {nom}",
    " (déjà exploré)": " (already explored)",
    "Plan de {ville}": "Map of {ville}",
    "{n} lieu connu": "{n} known place",
    "{n} lieux connus": "{n} known places",
    "Lieu à explorer": "Place to explore",
    "Déjà exploré": "Already explored",
    "Nouvelle piste": "New lead",
    "← Faites glisser pour voir tout le plan →": "← Swipe to see the whole map →",

    // Barre latérale
    "Quartiers": "Districts",
    "Lieux : {quartier}": "Places: {quartier}",
    "Personne ne vous a encore parlé d'un lieu dans ce quartier.": "Nobody has told you about a place in this district yet.",
    "Outils": "Tools",
    "L'équipe du Bureau": "The Bureau team",
    "Carnet de l'enquête": "Case notebook",
    "Consulter l'annuaire ({n})": "Open the directory ({n})",
    "Rédiger l'article": "Write the article",
    "Sauvegarde automatique activée sur cet appareil.": "Autosave is on for this device.",
    "Effacer la sauvegarde de cette affaire": "Erase this case's save",
    "Effacer la sauvegarde de cette affaire et revenir à l'accueil ?": "Erase this case's save and go back to the start?",
    "Carte": "Map",
    "Équipe": "Team",
    "Carnet": "Notebook",
    "Annuaire": "Directory",
    "Minitel": "Minitel",
    "Accès rapide": "Quick access",

    // Lieux et pistes
    "Choisissez un lieu dans le quartier « {quartier} » pour mener un entretien ou une investigation. D'autres adresses apparaîtront au fil de vos découvertes.":
      "Choose a place in the {quartier} district to carry out an interview or an investigation. More addresses will appear as you make discoveries.",
    "Rien à faire ici pour l'instant.": "Nothing to do here for now.",
    "Entretien": "Interview",
    "Investigation": "Investigation",
    "déjà lu, gratuit": "already read, free",
    "gratuit": "free",
    "En attente de l'enquête": "Waiting for the investigation",
    "Gardez cette page ouverte. Votre téléphone se transformera pendant l'enquête.": "Keep this page open. Your phone will change during the investigation.",
    "Le plan de la ville": "The town map",
    "Votre téléphone suit l'enquête.": "Your phone is following the investigation.",
    "Annuaire électronique": "Electronic directory",
    "coûte {n} pistes": "costs {n} leads",
    "Jouer avec votre téléphone ?": "Play with your phone?",
    "Scannez un QR code : le téléphone affiche la carte, les pistes et les entretiens, devient le Minitel et sert de chronomètre pendant les poursuites. Vous pouvez aussi tout jouer à la souris.": "Scan a QR code: your phone shows the map, the leads and the interviews, becomes the Minitel and acts as a stopwatch during chases. You can also play everything with the mouse.",
    "Afficher le QR code": "Show the QR code",
    "Jouer à la souris": "Play with the mouse",
    "Ne plus me le proposer": "Don't ask again",
    "Choisissez un lieu pour voir les pistes.": "Choose a place to see its leads.",
    "Cette scène se joue sur l'ordinateur.": "This scene is played on the computer.",
    "Téléphone relié": "Phone linked",
    "Relier un téléphone": "Link a phone",
    "Téléphone relié.": "Phone linked.",
    "Votre téléphone devient : {quoi}": "Your phone becomes: {quoi}",
    "le Minitel": "the Minitel",
    "le chronomètre": "the stopwatch",
    "Le téléphone ne peut pas ouvrir un jeu lancé depuis un fichier de l'ordinateur.": "The phone can't open a game started from a file on this computer.",
    "Pour jouer avec la manette, ouvrez la version en ligne du jeu :": "To play with the controller, open the online version of the game:",
    "Impossible de joindre le service de mise en relation. Vérifiez la connexion à internet, puis réessayez.": "Can't reach the matchmaking service. Check the internet connection, then try again.",
    "Un téléphone est relié.": "A phone is linked.",
    "Préparation du QR code…": "Preparing the QR code…",
    "Scannez ce code avec l'appareil photo du téléphone.": "Scan this code with the phone's camera.",
    "Gardez la page ouverte sur le téléphone : il se transformera selon la scène.": "Keep the page open on the phone: it will change with each scene.",
    "Le téléphone s'est déconnecté. Il se reliera de nouveau tout seul, ou scannez le code.": "The phone has disconnected. It will link again on its own, or scan the code.",
    "Le téléphone et l'ordinateur se parlent directement. Un service gratuit (PeerJS) les met seulement en relation.": "The phone and the computer talk to each other directly. A free service (PeerJS) only introduces them.",
    "Votre téléphone devient une manette : il se change en Minitel, en chronomètre pendant une poursuite… Le jeu reste jouable sans lui.": "Your phone becomes a controller: it turns into a Minitel, a stopwatch during a chase… The game is still playable without it.",
    "Déconnecter le téléphone": "Disconnect the phone",
    "Fermer": "Close",
    "Trop tard": "Too late",
    "Il se relève…": "He's getting up…",
    " (−{n})": " (−{n})",
    "Portrait-robot": "Identikit portrait",
    "Montrer le portrait aux témoins": "Show the portrait to the witnesses",
    "Il manque encore : {trait}.": "Still missing: {trait}.",
    "nouveau": "new",
    "L'heure du bouclage est passée : vous ne pouvez plus ouvrir de nouvelle piste. Relisez vos notes, consultez le carnet, puis rédigez votre article.":
      "The deadline has passed: you can't open any new leads. Reread your notes, check the notebook, then write your article.",
    "Sur le plan": "On the map",
    "Au dossier": "In the file",
    "Pour l'article": "For the article",
    "Au carnet": "In the notebook",
    "{n} déclaration contredite, barrée": "{n} statement contradicted, crossed out",
    "{n} déclarations contredites, barrées": "{n} statements contradicted, crossed out",
    "« {texte} »": "“{texte}”",
    "Nouveau": "New",
    "Lu": "Read",

    // Énigmes
    "Plus de piste disponible pour demander de l'aide": "No leads left to ask for help",
    "Demander un indice à Karim (coûte une piste)": "Ask Karim for a hint (costs one lead)",
    "Demander de l'aide à l'équipe (coûte une piste)": "Ask the team for help (costs one lead)",
    "Le reçu se reconstitue ici": "The receipt comes together here",
    "Ce morceau ne vient pas là.": "That piece doesn't go there.",
    "Heure": "Time",
    "Numéro appelé": "Number called",
    "Durée": "Duration",
    "Le {date} à {heure} : un appel ordinaire, vers {qui}.": "On {date} at {heure}: an ordinary call, to {qui}.",
    "Chiffre {n} plus": "Digit {n} up",
    "Chiffre {n} moins": "Digit {n} down",
    "Tourner la poignée": "Turn the handle",
    "La poignée ne cède pas.": "The handle won't give.",

    // Minitel : l'écran garde ses mentions d'origine (NOM, LOCALITÉ, ENVOI)
    "Tapez un nom, puis ENVOI.": "France's online directory, before the web. Type a surname, then ENVOI (send).",
    "Nom à chercher": "Surname to look up",
    "AUCUN ABONNÉ NE CORRESPOND": "NO SUBSCRIBER MATCHES",
    "À VOTRE DEMANDE.": "YOUR REQUEST.",
    "(Ce nom n'apparaît nulle part dans votre dossier.)": "(This name doesn't appear anywhere in your file.)",
    "Déconnexion": "Log off",

    // Carnet
    "Pièces": "Evidence",
    "Pistes lues": "Leads read",
    "Rien dans cette partie du carnet pour l'instant.": "Nothing in this part of the notebook yet.",
    "{n} note": "{n} note",
    "{n} notes": "{n} notes",
    "On le trouve : ": "Found at: ",
    "Adresse inconnue. Essayez le Minitel.": "Address unknown. Try the Minitel.",
    "Interrogé": "Questioned",
    "Visité": "Visited",
    "Pièce du dossier": "Evidence",
    "Ce que vous savez": "What you know",
    "Rien de plus que ce nom, pour l'instant.": "Nothing more than the name, for now.",
    " · contredit depuis": " · since contradicted",
    "Cité dans": "Mentioned in",
    "Aller sur place": "Go there",
    "Rappel de l'affaire": "Case summary",
    "Aucune piste consultée pour l'instant.": "No leads read yet.",
    "Retourner sur place": "Go back there",
    " · adresse à chercher au Minitel": " · look up the address on the Minitel",
    "Fiche": "Entry",

    // Article
    "personne": "person",
    "lieu": "place",
    "pièce": "evidence",
    "action": "action",
    "personnes": "people",
    "lieux": "places",
    "pièces": "evidence",
    "actions": "actions",
    "Le bouclage approche. Paul tape l'article ; à vous de remplir les blancs avec ce que l'enquête a trouvé. Chaque couleur attend un type de mot. Touchez un blanc, puis un mot. Jean-Loup relit avant l'imprimerie : trois passages au plus, et moins il en faut, plus l'article rapporte ({facteurs}).":
      "The deadline is close. Paul is typing up the article; it's up to you to fill in the blanks with what the investigation found. Each colour expects a type of word. Tap a blank, then a word. Jean-Loup reads it before it goes to the printers: three rounds at most, and the fewer it takes, the more the article earns ({facteurs}).",
    "{p} %": "{p}%",
    "Vous avez lu {n} piste ;": "You have read {n} lead;",
    "Vous avez lu {n} pistes ;": "You have read {n} leads;",
    "chaque piste au-delà de {ref} coûte {pen} points.": "each lead beyond {ref} costs {pen} points.",
    "Personne": "Person",
    "Lieu": "Place",
    "Pièce": "Evidence",
    "Action": "Action",
    "Relecture de Jean-Loup · passage {n} sur 3": "Jean-Loup's read-through · round {n} of 3",
    "Les Affaires occultes · brouillon": "Occult Affairs · draft",
    "Bonus": "Bonus",
    "Blanc : {type}": "Blank: {type}",
    "ne tient pas": "doesn't hold up",
    "Mots trouvés · ": "Words found · ",
    " : aucun pour l'instant": ": none yet",
    "Effacer ce blanc": "Clear this blank",
    "Encore {n} blanc à remplir": "{n} blank left to fill",
    "Encore {n} blancs à remplir": "{n} blanks left to fill",
    "Dernier passage : envoyer à l'imprimerie": "Last round: send to the printers",
    "Faire relire par Jean-Loup (passage {n} sur 3)": "Have Jean-Loup read it (round {n} of 3)",
    "Dernier passage : l'article part à l'imprimerie tel quel. On y va ?": "Last round: the article goes to the printers as it is. Shall we?",
    "Envoyer la version déjà relue ({p} % des points)": "Send the version already read ({p}% of the points)",
    "Envoyer la version relue au passage {n}, sans vos corrections depuis ?": "Send the version read in round {n}, without your changes since?",
    "← Reprendre l'enquête": "← Back to the investigation",
    "Ouvrir le carnet": "Open the notebook",
    " (bonus)": " (bonus)",

    // Fin
    "Samedi 27 novembre 1993": "Saturday 27 November 1993",
    "4,50 F": "4.50 F",
    "Les Affaires occultes · ": "Occult Affairs · ",
    "Par le Bureau des affaires occultes · Photos Yves Barral": "By the Bureau of Occult Affairs · Photographs by Yves Barral",
    "Votre article": "Your article",
    "Envoyé au passage {n} sur 3 : {p} % des points": "Sent in round {n} of 3: {p}% of the points",
    "Pistes lues : {n} (référence : {ref})": "Leads read: {n} (target: {ref})",
    " · pénalité −{n}": " · penalty −{n}",
    "Ce qui s'est vraiment passé": "What really happened",
    "Le chemin le plus court : ": "The shortest route: ",
    "Retour aux affaires": "Back to cases",
    "Retenter cette affaire": "Try this case again",

    // Fiche de l'enquêteur
    "Nom de l'enquêteur": "Investigator's name",
    "Rouge tampon": "Stamp red",
    "Or vieilli": "Old gold",
    "Vert acier": "Steel green",
    "Choisir la couleur : {couleur}": "Choose the colour: {couleur}",
    "Points de carrière": "Career points",
    "Affaires résolues": "Cases solved",
    "Meilleur score": "Best score",
    "N/A": "N/A",
    "Distinctions": "Distinctions",
    "Aucune distinction pour l'instant. Terminez une première affaire pour commencer à en gagner.":
      "No distinctions yet. Complete a first case to start earning them.",

    // Tableau de Karim (tableau.js)
    "Les déclarations": "The statements",
    "Ce qui est sûr": "What is certain",
    "oui": "yes",
    "non": "no",
    "vide": "empty",
    "Effacer le brouillon": "Clear the draft",
    "Les questions de Paul": "Paul's questions",
    "Répondre à Paul": "Answer Paul",
    "Paul attend vos réponses.": "Paul is waiting for your answers.",
    "Paul attend une réponse à chaque question.": "Paul is waiting for an answer to every question.",
    "« Admettons. » Paul n'est pas convaincu. Quelque chose ne tient pas.": "“Granted.” Paul isn't convinced. Something doesn't hold up.",

    // Page (index.html)
    "Le plan et les fiches se lisent mieux en mode paysage. Tournez votre téléphone si possible.":
      "The map and the notebook are easier to read in landscape. Turn your phone if you can.",
    "Continuer quand même": "Continue anyway"
  };

  const FR = {};
  Object.keys(EN).forEach((k) => (FR[EN[k]] = k));

  const fill = (s, vars) => (vars ? String(s).replace(/\{(\w+)\}/g, (m, k) => (vars[k] !== undefined ? vars[k] : m)) : s);

  function t(s, vars) {
    return fill(lang === "en" && EN[s] !== undefined ? EN[s] : s, vars);
  }

  // Le français met au singulier 0 et 1, l'anglais seulement 1
  function tp(n, one, many) {
    const single = lang === "en" ? n === 1 : n <= 1;
    return t(single ? one : many, { n: n });
  }

  // Un texte gardé dans une sauvegarde (le rang obtenu, par exemple) peut avoir
  // été écrit dans l'autre langue : on le remet dans la langue choisie.
  function stored(s) {
    if (lang === "en") return EN[s] !== undefined ? EN[s] : s;
    return FR[s] !== undefined ? FR[s] : s;
  }

  function set(code) {
    try {
      localStorage.setItem(KEY, code);
    } catch (e) {}
    location.reload();
  }

  window.BAOLang = { lang: lang, locale: lang === "en" ? "en-GB" : "fr-FR", t: t, tp: tp, stored: stored, set: set };

  // La page elle-même
  document.documentElement.lang = lang;
  if (lang === "en") {
    document.title = EN["Bureau des affaires occultes"];
    document.querySelectorAll(".orientation-hint-text, .orientation-hint-btn").forEach((el) => (el.textContent = t(el.textContent.trim())));
  }
})();
