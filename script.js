(function () {
  "use strict";

  const app = document.getElementById("app");
  const SAVE_PREFIX = "bao-save-"; // + cityId + "-" + caseId : partie en cours
  const PROGRESS_KEY = "stephanois-progress-v1"; // carrière : affaires terminées
  const A = window.BAOAudio || { play() {}, playOneOf() {}, playQuick() {}, setAmbience() {}, setMusic() {}, setWeather() {}, silence() {}, settings: {}, set() {} };

  // Réglages visuels (animations, pluie, lumière du jour)
  const VIS_KEY = "bao-visuel-v1";
  const reducedMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const vis = { anim: !reducedMotion, grandTexte: false };
  try {
    Object.assign(vis, JSON.parse(localStorage.getItem(VIS_KEY) || "{}"));
  } catch (e) {}
  function setVis(key, value) {
    vis[key] = value;
    try {
      localStorage.setItem(VIS_KEY, JSON.stringify(vis));
    } catch (e) {}
  }
  const mapImages = {}; // cityId -> true si img/plans/<ville>.jpg existe

  const state = {
    data: null,
    progress: null,
    view: "menu",
    previousView: "menu",
    currentCityId: null,
    currentCaseId: null,
    leadsRemaining: 0,
    readClueIds: new Set(),
    minitelFound: new Set(), // index des entrées Minitel trouvées
    puzzlesSolved: new Set(),
    puzzlesHelped: new Set(),
    answers: {}, // article : id du trou -> "type:id" du mot posé
    attempts: 0, // relectures de Jean-Loup déjà faites
    review: null, // dernier retour de Jean-Loup
    lastSubmitted: null, // la version relue en dernier
    activeBlank: null,
    started: false,
    savedGame: null,
    selectedQuartier: null,
    selectedLocationId: null,
    lastResult: null,
    ending: null,
    journalTab: "p",
    journalEntity: null,
    lastReadClueId: null,
    freshClueIds: new Set(), // pistes qui viennent d'apparaître
    minitelLog: [],
    showAudio: false
  };

  // ---------------------------------------------------------------
  // Accès aux données
  // ---------------------------------------------------------------

  const getCity = (cityId) => state.data.cities.find((c) => c.id === cityId);
  function getCase(cityId, caseId) {
    const city = getCity(cityId);
    return city ? city.cases.find((c) => c.id === caseId) : null;
  }
  const currentCity = () => getCity(state.currentCityId);
  const currentCase = () => getCase(state.currentCityId, state.currentCaseId);
  const caseKey = (cityId, caseId) => cityId + ":" + caseId;
  const byId = (list, id) => (list || []).find((x) => x.id === id);
  const locationById = (id) => byId(currentCase().locations, id);
  const quartierById = (id) => byId(currentCase().quartiers, id);
  const characterById = (id) => byId(currentCase().characters, id);
  const documentById = (id) => byId(currentCase().documents, id);
  const clueById = (id) => byId(currentCase().clues, id);
  const actionById = (id) => byId(currentCase().actions, id);
  const puzzleOf = (clue) => (clue && clue.puzzle ? (currentCase().puzzles || {})[clue.puzzle] : null);
  const cluesForLocation = (locationId) => currentCase().clues.filter((c) => c.locationId === locationId);
  const leadsUsed = () => currentCase().totalLeads - state.leadsRemaining;

  function maxScore(cs) {
    return cs.maxPoints || (cs.questions || []).reduce((s, q) => s + q.points, 0) || 7;
  }

  // ---------------------------------------------------------------
  // Progression (carrière) et sauvegarde de la partie en cours
  // ---------------------------------------------------------------

  function defaultProgress() {
    return { completedCases: {}, playerName: null, avatarAccent: "red" };
  }

  function loadProgress() {
    try {
      return Object.assign(defaultProgress(), JSON.parse(localStorage.getItem(PROGRESS_KEY) || "{}"));
    } catch (e) {
      return defaultProgress();
    }
  }

  function saveProgress() {
    try {
      localStorage.setItem(PROGRESS_KEY, JSON.stringify(state.progress));
    } catch (e) {}
  }

  function recordCaseCompletion(cityId, caseId, points, rank) {
    const key = caseKey(cityId, caseId);
    const existing = state.progress.completedCases[key];
    const best = existing && existing.bestScore > points ? existing : { bestScore: points, bestRank: rank };
    state.progress.completedCases[key] = { completed: true, bestScore: best.bestScore, bestRank: best.bestRank };
    saveProgress();
  }

  function existingCaseEntries() {
    const out = [];
    state.data.cities.forEach((city) =>
      city.cases.forEach((cs) => {
        const e = state.progress.completedCases[caseKey(city.id, cs.id)];
        if (e && e.completed) out.push(Object.assign({ cs: cs }, e));
      })
    );
    return out;
  }

  const careerPoints = () => existingCaseEntries().reduce((s, e) => s + e.bestScore, 0);

  function isCaseUnlocked(city, index) {
    if (index === 0) return true;
    const e = state.progress.completedCases[caseKey(city.id, city.cases[index - 1].id)];
    return !!(e && e.completed);
  }

  function cityCompletedCount(city) {
    return city.cases.filter((cs) => {
      const e = state.progress.completedCases[caseKey(city.id, cs.id)];
      return e && e.completed;
    }).length;
  }

  const RANKS = [
    { min: 0, title: "Stagiaire" },
    { min: 50, title: "Journaliste" },
    { min: 120, title: "Journaliste confirmé" },
    { min: 200, title: "Grand reporter" },
    { min: 300, title: "Rédacteur en chef" }
  ];

  function currentRank() {
    const pts = careerPoints();
    return RANKS.filter((r) => pts >= r.min).pop().title;
  }

  function totalCasesAvailable() {
    return state.data.cities.filter((c) => c.status === "available").reduce((s, c) => s + c.cases.length, 0);
  }

  function computeBadges() {
    const entries = existingCaseEntries();
    const badges = [];
    if (entries.length >= 1) badges.push({ label: "Premier article publié", detail: "Une affaire menée jusqu'au bout." });
    if (entries.some((e) => e.bestRank === "Réussite majeure"))
      badges.push({ label: "Réussite majeure", detail: "Une enquête résolue presque sans faute." });
    if (entries.length >= 2) badges.push({ label: "Plume assidue", detail: "Deux affaires ou plus menées à terme." });
    return badges;
  }

  function setPlayerName(name) {
    state.progress.playerName = name.trim() ? name.trim() : null;
    saveProgress();
  }

  function setAvatarAccent(accent) {
    state.progress.avatarAccent = accent;
    saveProgress();
  }

  function buildAvatarSVG(size) {
    const accent = (state.progress && state.progress.avatarAccent) || "red";
    return (
      '<svg viewBox="0 0 100 100" width="' + size + '" height="' + size +
      '" xmlns="http://www.w3.org/2000/svg" class="avatar-svg avatar-accent-' + accent + '">' +
      '<circle cx="50" cy="50" r="48" class="avatar-badge-bg"/>' +
      '<path d="M20 88 C20 66 34 58 50 58 C66 58 80 66 80 88 Z" class="avatar-coat"/>' +
      '<circle cx="50" cy="42" r="17" class="avatar-head"/>' +
      '<path d="M31 36 C31 24 69 24 69 36 L69 32 C60 26 40 26 31 32 Z" class="avatar-band"/>' +
      '<path d="M28 33 L72 33 L66 26 L34 26 Z" class="avatar-band"/>' +
      '<rect x="46" y="70" width="8" height="14" rx="1" class="avatar-tie"/>' +
      "</svg>"
    );
  }

  function saveGame() {
    if (!state.started) return;
    try {
      localStorage.setItem(
        SAVE_PREFIX + state.currentCityId + "-" + state.currentCaseId,
        JSON.stringify({
          savedAt: new Date().toISOString(),
          leadsRemaining: state.leadsRemaining,
          readClueIds: Array.from(state.readClueIds),
          minitelFound: Array.from(state.minitelFound),
          puzzlesSolved: Array.from(state.puzzlesSolved),
          puzzlesHelped: Array.from(state.puzzlesHelped),
          answers: state.answers,
          attempts: state.attempts,
          review: state.review,
          lastSubmitted: state.lastSubmitted,
          selectedQuartier: state.selectedQuartier,
          selectedLocationId: state.selectedLocationId,
          view: ["intro", "minitel"].includes(state.view) ? "quartier" : state.view,
          ending: state.ending
        })
      );
    } catch (e) {}
  }

  function loadSavedGame(cityId, caseId) {
    try {
      const raw = localStorage.getItem(SAVE_PREFIX + cityId + "-" + caseId);
      return raw ? JSON.parse(raw) : null;
    } catch (e) {
      return null;
    }
  }

  function clearSavedGame(cityId, caseId) {
    try {
      localStorage.removeItem(SAVE_PREFIX + cityId + "-" + caseId);
    } catch (e) {}
  }

  // La partie en cours la plus récente, toutes affaires confondues
  function latestSave() {
    let best = null;
    state.data.cities.forEach((city) =>
      city.cases.forEach((cs) => {
        const s = loadSavedGame(city.id, cs.id);
        if (s && !s.ending && (!best || s.savedAt > best.save.savedAt)) best = { cityId: city.id, caseId: cs.id, cs: cs, city: city, save: s };
      })
    );
    return best;
  }

  function continueLatest() {
    const last = latestSave();
    if (!last) return;
    state.currentCityId = last.cityId;
    state.currentCaseId = last.caseId;
    state.savedGame = last.save;
    A.play("interface/page-journal");
    resumeSavedGame();
  }

  function eraseAllProgress() {
    try {
      Object.keys(localStorage)
        .filter((k) => k.indexOf(SAVE_PREFIX) === 0 || k === PROGRESS_KEY)
        .forEach((k) => localStorage.removeItem(k));
    } catch (e) {}
    state.progress = defaultProgress();
    state.started = false;
    state.savedGame = null;
  }

  function timeAgo(iso) {
    const min = Math.round((Date.now() - new Date(iso).getTime()) / 60000);
    if (min < 2) return "à l'instant";
    if (min < 60) return "il y a " + min + " min";
    const h = Math.round(min / 60);
    if (h < 24) return "il y a " + h + " h";
    const d = Math.round(h / 24);
    return "il y a " + d + " jour" + (d > 1 ? "s" : "");
  }

  function resetCaseState() {
    const cs = currentCase();
    state.leadsRemaining = cs.totalLeads;
    state.readClueIds = new Set();
    state.minitelFound = new Set();
    state.puzzlesSolved = new Set();
    state.puzzlesHelped = new Set();
    state.answers = {};
    state.attempts = 0;
    state.review = null;
    state.lastSubmitted = null;
    state.activeBlank = null;
    state.selectedQuartier = cs.quartiers[0].id;
    state.selectedLocationId = null;
    state.lastResult = null;
    state.ending = null;
    state.lastReadClueId = null;
    state.freshClueIds = new Set();
    state.minitelLog = [];
    state.journalEntity = null;
    state.lastPuzzleResult = null;
    state.lastPuzzleFresh = null;
  }

  function resumeSavedGame() {
    const s = state.savedGame;
    if (!s) return;
    resetCaseState();
    state.started = true;
    state.leadsRemaining = s.leadsRemaining;
    state.readClueIds = new Set(s.readClueIds || []);
    state.minitelFound = new Set(s.minitelFound || []);
    state.puzzlesSolved = new Set(s.puzzlesSolved || []);
    state.puzzlesHelped = new Set(s.puzzlesHelped || []);
    state.answers = s.answers && !s.answers.Q1 ? s.answers : {};
    state.attempts = s.attempts || 0;
    state.review = s.review || null;
    state.lastSubmitted = s.lastSubmitted || null;
    state.selectedQuartier = s.selectedQuartier || currentCase().quartiers[0].id;
    state.selectedLocationId = s.selectedLocationId || null;
    state.ending = s.ending || null;
    state.view = state.ending ? "ending" : s.view || "quartier";
    render();
    scrollToTop();
  }

  // ---------------------------------------------------------------
  // Balises dans les textes : {{p:id|texte}} {{l:id|texte}} {{d:id|texte}}
  // ---------------------------------------------------------------

  const TAG_RE = /\{\{(p|l|d):([^}|]+)(?:\|([^}]+))?\}\}/g;
  const TAG_CLASS = { p: "tag-person", l: "tag-lieu", d: "tag-doc" };

  function escapeHtml(str) {
    return String(str).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  }

  function parseTags(text) {
    const out = [];
    String(text || "").replace(TAG_RE, (m, type, a, b) => {
      if (b !== undefined) out.push({ type: type, id: a.trim() });
      return m;
    });
    return out;
  }

  // opts.fresh : Set "type:id" découverts à l'instant ; opts.links : noms cliquables
  function renderTaggedText(text, opts) {
    opts = opts || {};
    return escapeHtml(text || "").replace(TAG_RE, (m, type, a, b) => {
      const hasId = b !== undefined;
      const id = hasId ? a.trim() : null;
      const label = hasId ? b : a;
      let cls = TAG_CLASS[type];
      let attrs = "";
      if (hasId && opts.fresh && opts.fresh.has(type + ":" + id)) cls += " tag-new";
      if (hasId && opts.links) {
        if (type === "l" && locationById(id) && opts.knowledge && opts.knowledge.l.has(id)) {
          cls += " tag-link";
          attrs = ' data-goto-loc="' + id + '" role="button" tabindex="0" title="Aller : ' + escapeHtml(locationById(id).name) + '"';
        } else if ((type === "p" && characterById(id)) || (type === "d" && documentById(id))) {
          cls += " tag-link";
          attrs = ' data-open-entity="' + type + ":" + id + '" role="button" tabindex="0" title="Ouvrir la fiche du carnet"';
        }
      }
      return '<span class="' + cls + '"' + attrs + ">" + label + "</span>";
    });
  }

  // Paragraphes : ligne vide = nouveau paragraphe, retour simple = saut de ligne
  function renderParagraphs(text, opts) {
    opts = opts || {};
    return String(text || "")
      .trim()
      .split(/\n\s*\n/)
      .map((p) =>
        p.trim() === "[[fax]]"
          ? faxHTML(opts.fax || "", opts)
          : "<p>" + renderTaggedText(p.trim(), opts).replace(/\n/g, "<br>") + "</p>"
      )
      .join("");
  }

  // Une page de fax thermique. Imprimée ligne par ligne la première fois.
  function faxHTML(text, opts) {
    const paras = String(text).split(/\n\s*\n/).map((b) => "<p>" + renderTaggedText(b.trim(), opts).replace(/\n/g, "<br>") + "</p>");
    return '<div class="fax' + (opts.printFax ? " fax-printing" : "") + '"><div class="fax-edge"></div><div class="fax-paper">' + paras.join("") + "</div></div>";
  }

  function colorLegendHTML() {
    return (
      '<div class="tag-legend"><span class="tag-person">Personnes</span>' +
      '<span class="tag-lieu">Lieux</span><span class="tag-doc">Pièces du dossier</span></div>'
    );
  }

  // ---------------------------------------------------------------
  // Ce que le joueur connaît, et les pistes qui lui sont ouvertes.
  // Tout est recalculé à partir des pistes lues, des puzzles résolus et
  // des recherches Minitel : la sauvegarde n'a rien d'autre à stocker.
  // ---------------------------------------------------------------

  function computeKnowledge() {
    const cs = currentCase();
    const k = { p: new Set(), l: new Set(), d: new Set(), a: new Set() };
    const absorb = (text) => parseTags(text).forEach((t) => k[t.type].add(t.id));

    cs.characters.forEach((ch) => ch.alwaysRevealed && k.p.add(ch.id));
    cs.locations.forEach((loc) => loc.alwaysRevealed && k.l.add(loc.id));
    absorb(cs.intro);

    cs.clues.forEach((clue) => {
      if (!state.readClueIds.has(clue.id)) return;
      k.l.add(clue.locationId);
      absorb(clue.text);
      (clue.revealsCharacters || []).forEach((id) => k.p.add(id));
      (clue.revealsLocations || []).forEach((id) => k.l.add(id));
      (clue.revealsActions || []).forEach((id) => k.a.add(id));
      const pz = puzzleOf(clue);
      if (pz && state.puzzlesSolved.has(clue.puzzle)) absorb(pz.result);
    });

    // Une adresse trouvée au Minitel ne mène quelque part que si l'enquête a déjà parlé
    // de cette personne. Si elle en parle plus tard, l'adresse notée sert aussitôt.
    (cs.minitel || []).forEach((entry, i) => {
      if (!state.minitelFound.has(i)) return;
      if (entry.about && !k[entry.about[0]].has(entry.about.slice(2))) return;
      (entry.reveals || []).forEach((key) => k[key[0]].add(key.slice(2)));
    });

    // Connaître quelqu'un, c'est savoir où le trouver, sauf s'il faut
    // chercher son adresse au Minitel.
    k.p.forEach((id) => {
      const ch = characterById(id);
      if (ch && ch.locationId && !ch.minitel) k.l.add(ch.locationId);
    });

    k.p = new Set(Array.from(k.p).filter((id) => characterById(id)));
    k.l = new Set(Array.from(k.l).filter((id) => locationById(id)));
    k.d = new Set(Array.from(k.d).filter((id) => documentById(id)));
    k.a = new Set(Array.from(k.a).filter((id) => actionById(id)));
    return k;
  }

  // Un entretien de suite peut se faire sans le premier : il porte alors un autre titre,
  // et une fois fait, le premier entretien n'a plus lieu d'être.
  function followUpRead(clue) {
    return currentCase().clues.some((c) => c.follows === clue.id && state.readClueIds.has(c.id));
  }
  function clueTitle(clue) {
    return clue.follows && clue.titleAlone && !state.readClueIds.has(clue.follows) ? clue.titleAlone : clue.title;
  }
  function clueButton(clue) {
    if (clue.follows && clue.buttonAlone && !state.readClueIds.has(clue.follows)) return clue.buttonAlone;
    return clue.button || clue.title;
  }

  function clueAvailable(clue, k) {
    if (!k.l.has(clue.locationId)) return false;
    if (!state.readClueIds.has(clue.id) && followUpRead(clue)) return false;
    if ((clue.requires || []).some((r) => !state.readClueIds.has(r))) return false;
    if (clue.requiresAny && !clue.requiresAny.some((r) => state.readClueIds.has(r))) return false;
    return true;
  }

  function availableClueIds(k) {
    return new Set(currentCase().clues.filter((c) => clueAvailable(c, k)).map((c) => c.id));
  }

  // Toutes les notes connues du carnet, avec leur source et leur état (barrée ou non)
  function knownFacts() {
    const cs = currentCase();
    const out = [];
    const push = (f, source, clueId) =>
      out.push({
        about: f.about,
        label: f.label || "",
        text: f.text,
        source: source,
        clueId: clueId,
        struck: (f.struckBy || []).some((id) => state.readClueIds.has(id))
      });
    (cs.introNotes || []).forEach((f) => push(f, "L'intro", null));
    Array.from(state.readClueIds).forEach((id) => {
      const clue = clueById(id);
      if (!clue) return;
      (clue.facts || []).forEach((f) => push(f, clueTitle(clue), clue.id));
      const pz = puzzleOf(clue);
      if (pz && state.puzzlesSolved.has(clue.puzzle)) (pz.facts || []).forEach((f) => push(f, pz.title, clue.id));
    });
    return out;
  }

  // Photographie de l'état, pour savoir ce qu'une action vient de changer
  function snapshot() {
    const k = computeKnowledge();
    const facts = knownFacts();
    return { k: k, avail: availableClueIds(k), facts: facts.length, struck: facts.filter((f) => f.struck).length };
  }

  // Ce qui a changé entre deux photographies ; joue les sons correspondants
  function diff(before, after, defer) {
    const fresh = [];
    const names = { p: [], l: [], d: [], a: [] };
    ["p", "l", "d", "a"].forEach((type) => {
      after.k[type].forEach((id) => {
        if (before.k[type].has(id)) return;
        fresh.push(type + ":" + id);
        const obj = type === "p" ? characterById(id) : type === "l" ? locationById(id) : type === "d" ? documentById(id) : actionById(id);
        names[type].push(obj.name);
      });
    });
    // Seuls les vrais déblocages (seconds entretiens, pièces à revenir voir) sont signalés
    const unlocked = Array.from(after.avail).filter((id) => {
      const c = clueById(id);
      return !before.avail.has(id) && !state.readClueIds.has(id) && (c.requires || c.requiresAny);
    });
    unlocked.forEach((id) => state.freshClueIds.add(id));

    // Un seul son pour signaler les découvertes : le plus important
    const sound = unlocked.length ? "interface/deblocage"
      : names.l.length ? "interface/punaise"
      : names.p.length ? "interface/fiche"
      : names.d.length ? "interface/agrafeuse"
      : names.a.length ? "interface/crayon-note"
      : after.struck > before.struck ? "interface/rature"
      : after.facts > before.facts ? "interface/crayon-note"
      : null;
    if (sound && !defer) A.play(sound, 350);

    return {
      sound: sound,
      fresh: fresh,
      newCharacters: names.p,
      newLocations: names.l,
      newDocuments: names.d,
      newActions: names.a,
      unlocked: unlocked.map((id) => clueButton(clueById(id))),
      struck: after.struck - before.struck
    };
  }

  function goToLocation(locId) {
    const loc = locationById(locId);
    if (!loc) return;
    state.selectedQuartier = loc.quartier;
    state.selectedLocationId = locId;
    state.view = "location";
    state.lastResult = null;
    render();
    scrollToPanel();
  }

  function scrollToPanel() {
    const panel = document.querySelector(".content-panel");
    if (panel && panel.scrollIntoView) panel.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  // Change d'écran (carte, outil...) : sans ça, sur mobile, on atterrit
  // au beau milieu de l'écran précédent au lieu de voir le nouveau depuis
  // le début.
  function scrollToTop() {
    window.scrollTo({ top: 0, left: 0, behavior: vis.anim ? "smooth" : "auto" });
  }

  // ---------------------------------------------------------------
  // Chargement
  // ---------------------------------------------------------------

  function loadData() {
    return fetch("data.json")
      .then((res) => {
        if (!res.ok) throw new Error("fetch failed");
        return res.json();
      })
      .catch(() => {
        if (window.GAME_DATA_FALLBACK) return window.GAME_DATA_FALLBACK;
        throw new Error("Aucune donnée disponible");
      });
  }

  function init() {
    document.addEventListener(
      "error",
      (e) => {
        const t = e.target;
        if (!t || t.tagName !== "IMG" || !t.hasAttribute("data-remove-on-error")) return;
        const parent = t.closest("[data-remove-parent]");
        if (parent) parent.remove();
        else {
          const holder = t.parentElement;
          t.remove();
          if (holder && holder.classList.contains("portrait")) holder.classList.add("portrait-empty");
        }
      },
      true
    );
    initRain();
    const activate = (e) => {
      if (!state.started) return;
      const ent = e.target.closest("[data-open-entity]");
      if (ent) {
        e.preventDefault();
        openJournalEntity(ent.getAttribute("data-open-entity"));
        return;
      }
      const tag = e.target.closest("[data-goto-loc]");
      if (tag) {
        e.preventDefault();
        goToLocation(tag.getAttribute("data-goto-loc"));
      }
    };
    app.addEventListener("click", activate);
    app.addEventListener("keydown", (e) => {
      if ((e.key === "Enter" || e.key === " ") && e.target.closest("[data-open-entity],[data-goto-loc]")) activate(e);
    });

    loadData()
      .then((data) => {
        state.data = data;
        state.progress = loadProgress();
        data.cities.forEach((city) => {
          const im = new Image();
          im.onload = () => {
            mapImages[city.id] = true;
            if (state.currentCityId === city.id) render();
          };
          im.src = "img/plans/" + city.id + ".jpg";
        });
        render();
      })
      .catch((err) => {
        app.innerHTML = '<p style="font-family:monospace;padding:40px;">Erreur de chargement des données : ' + err.message + "</p>";
      });
  }

  // ---------------------------------------------------------------
  // Rendu général
  // ---------------------------------------------------------------

  const CASE_VIEWS = ["quartier", "location", "journal", "annuaire", "minitel"];

  const OUT_OF_CASE = ["menu", "prologue", "options", "credits", "citySelect", "caseSelect", "profile"];

  function render() {
    if (state.started && !OUT_OF_CASE.includes(state.view)) saveGame();

    app.innerHTML = "";
    document.body.classList.toggle("menu-mode", state.view === "menu");
    document.body.classList.toggle("texte-grand", !!vis.grandTexte);

    if (state.view === "menu") {
      app.appendChild(renderMenu());
      syncAudio();
      return;
    }
    app.appendChild(renderMasthead());

    if (state.view === "prologue") app.appendChild(renderPrologue());
    else if (state.view === "options") app.appendChild(renderOptions());
    else if (state.view === "credits") app.appendChild(renderCredits());
    else if (state.view === "citySelect") app.appendChild(renderCitySelect());
    else if (state.view === "caseSelect") app.appendChild(renderCaseSelect());
    else if (state.view === "intro") app.appendChild(renderIntro());
    else if (state.view === "questionnaire") app.appendChild(renderQuestionnaire());
    else if (state.view === "ending") app.appendChild(renderEnding());
    else if (state.view === "profile") app.appendChild(renderProfile());
    else app.appendChild(renderMainGrid());

    app.appendChild(renderFootnote());
    syncAudio();
  }

  function syncAudio() {
    const v = state.view;
    const inCase = state.started && CASE_VIEWS.concat(["questionnaire"]).includes(v);
    const raining = inCase && currentCase() && isRaining();
    rain.on = raining && vis.anim;
    A.setWeather(raining ? "pluie-vitre" : null);
    const ck = inCase && vis.anim ? clockInfo() : null;
    document.body.dataset.moment = ck ? ck.moment : "";
    if (v === "menu" || v === "options" || v === "credits") {
      A.setMusic("menu");
      A.setAmbience(null);
      A.setWeather("pluie-vitre");
      rain.on = vis.anim;
    } else if (v === "prologue") {
      A.setMusic("theme-principal");
      A.setAmbience("bureau-lyon");
      A.setWeather("pluie-vitre");
      rain.on = vis.anim;
    } else if (v === "citySelect" || v === "caseSelect" || v === "profile") {
      A.setMusic("theme-principal");
      A.setAmbience(null);
    } else if (v === "intro") {
      A.setMusic("intro-affaire", false);
      A.setAmbience("bureau-lyon");
    } else if (v === "questionnaire") {
      A.setMusic("questionnaire");
      A.setAmbience("redaction");
    } else if (v === "ending") {
      const end = state.ending && byId(currentCase().endings, state.ending.endingId);
      A.setMusic(end ? end.music : null, false);
      A.setAmbience(null);
    } else if (CASE_VIEWS.includes(v)) {
      A.setMusic(state.leadsRemaining <= 3 ? "tension" : "enquete-fond");
      let amb = null;
      if (v === "location" && state.selectedLocationId) {
        const loc = locationById(state.selectedLocationId);
        amb = loc && loc.ambience;
        const shown = state.lastResult && state.lastResult.clueId && clueById(state.lastResult.clueId);
        if (shown && shown.ambience) amb = shown.ambience;
      }
      if (amb || v === "location") A.setAmbience(amb);
    }
  }

  function renderMasthead() {
    const el = document.createElement("div");
    el.className = "masthead";

    const titles = document.createElement("div");
    titles.className = "masthead-titles";
    if (OUT_OF_CASE.includes(state.view)) {
      const T = { caseSelect: currentCity() && currentCity().name, profile: "Fiche de l'enquêteur", options: "Options", credits: "Crédits", prologue: "Note de service" };
      titles.innerHTML = '<p class="kicker">Bureau des affaires occultes</p><h1>' + (T[state.view] || "Choisir une ville") + "</h1>";
    } else {
      const cs = currentCase();
      titles.innerHTML =
        '<p class="kicker">' + currentCity().name + ", " + cs.year + "</p><h1>" + cs.title + '</h1><p class="subtitle">' + cs.subtitle + "</p>";
    }
    el.appendChild(titles);

    const tools = document.createElement("div");
    tools.className = "masthead-tools";

    const menuBtn = document.createElement("button");
    menuBtn.className = "menu-btn";
    menuBtn.title = "Menu principal (la partie est sauvegardée)";
    menuBtn.textContent = "☰ Menu";
    menuBtn.addEventListener("click", () => {
      A.play("interface/clic");
      state.showAudio = false;
      state.view = "menu";
      render();
      window.scrollTo(0, 0);
    });
    tools.appendChild(menuBtn);

    const soundBtn = document.createElement("button");
    soundBtn.className = "sound-btn";
    soundBtn.title = "Réglages du son";
    soundBtn.setAttribute("aria-label", "Réglages du son");
    soundBtn.textContent = A.settings.muted ? "🔇" : "🔊";
    soundBtn.addEventListener("click", () => {
      state.showAudio = !state.showAudio;
      render();
    });
    tools.appendChild(soundBtn);

    if (state.view !== "profile") {
      const profileBtn = document.createElement("button");
      profileBtn.className = "profile-btn";
      profileBtn.title = "Voir la fiche de l'enquêteur";
      profileBtn.setAttribute("aria-label", "Voir la fiche de l'enquêteur");
      profileBtn.innerHTML = buildAvatarSVG(40);
      profileBtn.addEventListener("click", () => {
        state.previousView = state.view;
        state.view = "profile";
        render();
      });
      tools.appendChild(profileBtn);
    }

    if (state.view === "citySelect") {
      const pts = document.createElement("div");
      pts.className = "lead-counter career";
      pts.innerHTML = '<span class="num">' + careerPoints() + '</span><span class="label">points de carrière</span>';
      tools.appendChild(pts);
    } else if (state.started && CASE_VIEWS.concat(["questionnaire"]).includes(state.view)) {
      if (state.leadsRemaining <= 0 && state.view !== "questionnaire") {
        const write = document.createElement("button");
        write.className = "lead-counter lead-counter-article";
        write.innerHTML = '<span class="num">0</span><span class="label">Rédiger l\'article →</span>';
        write.addEventListener("click", () => {
          A.play("interface/page-journal");
          state.view = "questionnaire";
          render();
          window.scrollTo(0, 0);
        });
        tools.appendChild(write);
      } else {
        const counter = document.createElement("div");
        counter.className = "lead-counter" + (state.leadsRemaining <= 3 ? " low" : "");
        counter.innerHTML =
          '<span class="num">' + state.leadsRemaining + '</span><span class="label">piste' + (state.leadsRemaining > 1 ? "s" : "") + " avant le bouclage</span>";
        tools.appendChild(counter);
      }
      const ck = clockInfo();
      if (ck) {
        const clock = document.createElement("div");
        clock.className = "clock clock-" + ck.moment;
        clock.innerHTML = '<span class="clock-face" aria-hidden="true"></span><span>' + escapeHtml(ck.label) + "</span>";
        el.appendChild(clock);
      }
    }
    el.appendChild(tools);

    if (state.showAudio) el.appendChild(renderAudioPanel());
    return el;
  }

  function renderAudioPanel(inline) {
    const box = document.createElement("div");
    box.className = "audio-panel" + (inline ? " audio-panel-inline" : "");
    const s = A.settings;
    box.innerHTML =
      '<label class="audio-row"><input type="checkbox" data-k="muted"' + (s.muted ? " checked" : "") + "> Couper tous les sons</label>" +
      [
        ["effets", "Effets"],
        ["ambiances", "Ambiances"],
        ["musique", "Musique"]
      ]
        .map(
          ([k, l]) =>
            '<label class="audio-row"><span>' + l + '</span><input type="range" min="0" max="1" step="0.05" data-k="' + k + '" value="' + (s[k] || 0) + '"></label>'
        )
        .join("") +
      '<label class="audio-row"><input type="checkbox" data-v="anim"' + (vis.anim ? " checked" : "") + "> Animations, pluie et lumière du jour</label>" +
      '<p class="audio-note">Les sons ne sont joués que si les fichiers sont présents dans le dossier audio.</p>';
    box.querySelectorAll("input[data-v]").forEach((inp) =>
      inp.addEventListener("change", () => {
        setVis(inp.getAttribute("data-v"), inp.checked);
        render();
      })
    );
    box.querySelectorAll("input[data-k]").forEach((inp) =>
      inp.addEventListener("input", () => {
        const k = inp.getAttribute("data-k");
        A.set(k, inp.type === "checkbox" ? inp.checked : parseFloat(inp.value));
        if (k === "muted") render();
        else if (k === "effets") A.play("interface/clic");
      })
    );
    return box;
  }

  // ---------------------------------------------------------------
  // Menu principal, options, crédits
  // ---------------------------------------------------------------

  // Logo : img/logo.png s'il existe, sinon un logo composé en texte
  function logoHTML() {
    return (
      '<div class="logo" role="img" aria-label="Bureau des affaires occultes">' +
      '<img src="img/logo.png" alt="" class="logo-img" data-remove-on-error>' +
      '<div class="logo-text"><span class="logo-top">Bureau des</span><span class="logo-main">Affaires</span><span class="logo-main">occultes</span>' +
      '<span class="logo-stamp">France · Années 1990</span></div></div>'
    );
  }

  function renderMenu() {
    const wrap = document.createElement("div");
    wrap.className = "menu-screen";
    const last = latestSave();
    wrap.innerHTML =
      '<figure class="menu-fond" data-remove-parent><img src="img/menu-fond.jpg" alt="" data-remove-on-error></figure>' +
      '<div class="menu-lamp" aria-hidden="true"></div>' +
      '<div class="menu-inner">' + logoHTML() +
      '<nav class="menu-list" aria-label="Menu principal"></nav></div>';
    const nav = wrap.querySelector(".menu-list");

    const item = (label, sub, fn, disabled) => {
      const b = document.createElement("button");
      b.className = "menu-item";
      b.disabled = !!disabled;
      b.innerHTML = '<span class="menu-label">' + label + "</span>" + (sub ? '<span class="menu-sub">' + escapeHtml(sub) + "</span>" : "");
      b.addEventListener("click", () => {
        A.play("interface/clic");
        fn();
      });
      nav.appendChild(b);
      return b;
    };

    item(
      "Continuer",
      last ? last.cs.title + " · " + (last.cs.totalLeads - last.save.leadsRemaining) + " pistes lues · " + timeAgo(last.save.savedAt) : "Aucune enquête en cours",
      continueLatest,
      !last
    );
    item("Nouvelle partie", state.progress.prologueSeen ? "Choisir une ville et une affaire" : "Prendre connaissance du dossier", () => {
      A.play("interface/page");
      state.view = state.progress.prologueSeen ? "citySelect" : "prologue";
      render();
      window.scrollTo(0, 0);
    });
    item("Options", "Son, animations, taille du texte", () => {
      state.previousView = "menu";
      state.view = "options";
      render();
    });
    item("Fiche de l'enquêteur", currentRank() + " · " + careerPoints() + " points", () => {
      state.previousView = "menu";
      state.view = "profile";
      render();
    });
    item("Crédits", "", () => {
      state.view = "credits";
      render();
    });

    const foot = document.createElement("p");
    foot.className = "menu-foot";
    foot.textContent = "Sauvegarde automatique dans ce navigateur.";
    wrap.querySelector(".menu-inner").appendChild(foot);
    return wrap;
  }

  function renderPrologue() {
    const P = state.data.prologue;
    const wrap = document.createElement("div");
    wrap.className = "prologue";
    if (!P) return wrap;
    const first = !state.progress.prologueSeen;

    const memo = document.createElement("article");
    memo.className = "memo";
    memo.innerHTML =
      '<header class="memo-head"><p class="memo-entete">' + escapeHtml(P.entete) + '</p><p class="memo-titre">Note de service</p></header>' +
      '<dl class="memo-meta">' +
      [["Date", P.date], ["De", P.de], ["À", P.a], ["Copie", P.copie], ["Objet", P.objet]]
        .map(([k, v]) => "<dt>" + k + "</dt><dd>" + escapeHtml(v) + "</dd>")
        .join("") +
      '</dl><div class="memo-corps">' + P.corps.map((x) => "<p>" + escapeHtml(x) + "</p>").join("") +
      '<p class="memo-signature">' + escapeHtml(P.signature) + "</p></div>" +
      '<p class="memo-annotation">' + escapeHtml(P.annotation) + "</p>";
    wrap.appendChild(memo);

    const team = document.createElement("section");
    team.className = "equipe";
    team.innerHTML =
      '<h2 class="equipe-titre">Le Bureau des affaires occultes</h2><div class="equipe-grille">' +
      P.equipe
        .map(
          (m) =>
            '<div class="equipe-fiche">' + portraitHTML({ id: m.id, name: m.nom, portrait: "img/equipe/" + m.id + ".jpg" }, "large") +
            '<div><h3>' + escapeHtml(m.nom) + '</h3><p class="equipe-role">' + escapeHtml(m.role) + "</p><p>" + escapeHtml(m.texte) + "</p></div></div>"
        )
        .join("") +
      '</div><p class="equipe-vous">' + escapeHtml(P.vous) + "</p>";
    wrap.appendChild(team);

    const row = document.createElement("div");
    row.className = "btn-row";
    const go = document.createElement("button");
    go.className = "start-btn";
    go.textContent = first ? "Accepter le dossier" : "Choisir une ville";
    go.addEventListener("click", () => {
      state.progress.prologueSeen = true;
      saveProgress();
      A.play("interface/tampon");
      state.view = "citySelect";
      render();
      window.scrollTo(0, 0);
    });
    row.appendChild(go);
    const back = backToMenuButton();
    back.style.marginBottom = "0";
    row.appendChild(back);
    wrap.appendChild(row);

    // La première fois, la note se tape à la machine
    if (first && vis.anim) {
      memo.classList.add("clue-typing");
      team.classList.add("equipe-cachee");
      setTimeout(() => {
        typewrite(memo.querySelector(".memo-corps"), memo);
        const reveal = () => team.classList.remove("equipe-cachee");
        const obs = new MutationObserver(() => {
          if (!memo.classList.contains("typing-active")) {
            reveal();
            obs.disconnect();
          }
        });
        obs.observe(memo, { attributes: true, attributeFilter: ["class"] });
      }, 300);
    }
    return wrap;
  }

  function backToMenuButton(label) {
    const b = document.createElement("button");
    b.className = "end-early-btn back-btn";
    b.textContent = label || "← Menu principal";
    b.addEventListener("click", () => {
      state.view = "menu";
      render();
    });
    return b;
  }

  function renderOptions() {
    const wrap = document.createElement("div");
    wrap.appendChild(backToMenuButton(state.started && state.previousView !== "menu" ? "← Retour" : "← Menu principal"));
    if (state.started && state.previousView !== "menu") {
      wrap.firstChild.onclick = () => {
        state.view = state.previousView;
        render();
      };
    }
    const card = document.createElement("div");
    card.className = "options-card";

    const h1 = document.createElement("h2");
    h1.textContent = "Son";
    card.appendChild(h1);
    card.appendChild(renderAudioPanel(true));

    const red = document.createElement("label");
    red.className = "audio-row";
    red.innerHTML = '<input type="checkbox"' + (A.settings.reduits ? " checked" : "") + "> Effets sonores réduits (seulement le tampon et la sonnette)";
    red.querySelector("input").addEventListener("change", (e) => A.set("reduits", e.target.checked));
    card.appendChild(red);

    const h2 = document.createElement("h2");
    h2.textContent = "Lecture";
    card.appendChild(h2);
    const txt = document.createElement("label");
    txt.className = "audio-row";
    txt.innerHTML = '<input type="checkbox"' + (vis.grandTexte ? " checked" : "") + "> Texte plus grand pour les pistes et le carnet";
    txt.querySelector("input").addEventListener("change", (e) => {
      setVis("grandTexte", e.target.checked);
      render();
    });
    card.appendChild(txt);

    const h3 = document.createElement("h2");
    h3.textContent = "Progression";
    card.appendChild(h3);
    const p = document.createElement("p");
    p.className = "options-note";
    p.textContent =
      "Votre progression est sauvegardée automatiquement dans ce navigateur, sur cet ordinateur. Elle disparaît si vous videz les données de navigation.";
    card.appendChild(p);
    const erase = document.createElement("button");
    erase.className = "danger-btn";
    erase.textContent = "Effacer toute ma progression";
    erase.addEventListener("click", () => {
      if (window.confirm("Effacer toutes les enquêtes en cours, les affaires terminées, les scores et la fiche de l'enquêteur ? Cette action est définitive.")) {
        eraseAllProgress();
        state.view = "menu";
        render();
      }
    });
    card.appendChild(erase);
    wrap.appendChild(card);
    return wrap;
  }

  function renderCredits() {
    const wrap = document.createElement("div");
    wrap.appendChild(backToMenuButton());
    const card = document.createElement("div");
    card.className = "options-card credits";
    const c = state.data.credits || [];
    card.innerHTML =
      logoHTML() +
      c.map((sec) => "<h2>" + escapeHtml(sec.title) + "</h2>" + sec.lines.map((l) => "<p>" + escapeHtml(l) + "</p>").join("")).join("") +
      '<p class="options-note">Enquête fictive. Personnages, entreprises et faits sont imaginaires.</p>';
    wrap.appendChild(card);
    return wrap;
  }

  // ---------------------------------------------------------------
  // Choix de la ville et de l'affaire
  // ---------------------------------------------------------------

  function renderCitySelect() {
    const wrap = document.createElement("div");
    const row = document.createElement("div");
    row.className = "btn-row top-row";
    row.appendChild(backToMenuButton());
    const memo = document.createElement("button");
    memo.className = "end-early-btn back-btn";
    memo.textContent = "Relire la note de service";
    memo.addEventListener("click", () => {
      A.play("interface/page");
      state.view = "prologue";
      render();
    });
    row.appendChild(memo);
    wrap.appendChild(row);
    const intro = document.createElement("p");
    intro.className = "select-intro";
    intro.textContent =
      "Choisissez une ville pour consulter les affaires qui vous y attendent. De nouvelles villes s'ouvriront au fil de votre carrière de journaliste.";
    wrap.appendChild(intro);

    const grid = document.createElement("div");
    grid.className = "city-grid";
    state.data.cities.forEach((city) => {
      const card = document.createElement("button");
      const available = city.status === "available" && city.cases.length > 0;
      card.className = "city-card" + (available ? "" : " locked");
      if (available) {
        const done = cityCompletedCount(city);
        const total = city.cases.length;
        card.innerHTML =
          '<span class="city-name">' + city.name + '</span><span class="city-status">' + done + "/" + total +
          " affaire" + (total > 1 ? "s" : "") + " terminée" + (done > 1 ? "s" : "") + "</span>";
        card.addEventListener("click", () => {
          A.play("interface/clic");
          state.currentCityId = city.id;
          state.view = "caseSelect";
          render();
        });
      } else {
        card.innerHTML = '<span class="city-name">' + city.name + '</span><span class="city-status locked-tag">🔒 Bientôt disponible</span>';
        card.disabled = true;
      }
      grid.appendChild(card);
    });
    wrap.appendChild(grid);
    return wrap;
  }

  function renderCaseSelect() {
    const wrap = document.createElement("div");
    const backBtn = document.createElement("button");
    backBtn.className = "end-early-btn back-btn";
    backBtn.textContent = "← Retour aux villes";
    backBtn.addEventListener("click", () => {
      state.view = "citySelect";
      render();
    });
    wrap.appendChild(backBtn);

    const city = currentCity();
    const list = document.createElement("div");
    list.className = "case-list";
    city.cases.forEach((cs, index) => {
      const unlocked = isCaseUnlocked(city, index);
      const entry = state.progress.completedCases[caseKey(city.id, cs.id)];
      const card = document.createElement("button");
      card.className = "case-card" + (unlocked ? "" : " locked");
      let status = "À découvrir";
      if (entry && entry.completed) status = "Terminée : meilleur score " + entry.bestScore + " / " + maxScore(cs) + (entry.bestRank ? " (" + entry.bestRank + ")" : "");
      else if (!unlocked) status = "🔒 Terminez l'affaire précédente pour débloquer";
      card.innerHTML =
        '<span class="case-title">' + cs.title + '</span><span class="case-subtitle">' + cs.subtitle + '</span><span class="case-status">' + status + "</span>";
      if (unlocked) card.addEventListener("click", () => openCase(city.id, cs.id));
      else card.disabled = true;
      list.appendChild(card);
    });
    wrap.appendChild(list);
    return wrap;
  }

  function openCase(cityId, caseId) {
    state.currentCityId = cityId;
    state.currentCaseId = caseId;
    resetCaseState();
    state.started = false;
    state.savedGame = loadSavedGame(cityId, caseId);
    state.view = "intro";
    A.play("interface/page-journal");
    render();
  }

  // ---------------------------------------------------------------
  // Intro
  // ---------------------------------------------------------------

  function renderIntro() {
    const wrap = document.createElement("div");
    const backBtn = document.createElement("button");
    backBtn.className = "end-early-btn back-btn";
    backBtn.textContent = "← Retour aux affaires";
    backBtn.addEventListener("click", () => {
      state.view = "caseSelect";
      render();
    });
    wrap.appendChild(backBtn);

    const cs = currentCase();
    const card = document.createElement("div");
    card.className = "intro-card";
    card.innerHTML =
      "<h2>Dossier ouvert</h2>" + renderParagraphs(cs.intro) + '<p class="briefing">' + escapeHtml(cs.briefing) + "</p>" + colorLegendHTML();

    const btnRow = document.createElement("div");
    btnRow.className = "btn-row";

    if (state.savedGame) {
      const resumeBtn = document.createElement("button");
      resumeBtn.className = "start-btn";
      resumeBtn.textContent = "Reprendre l'enquête (" + (cs.totalLeads - state.savedGame.leadsRemaining) + " pistes déjà lues)";
      resumeBtn.addEventListener("click", resumeSavedGame);
      btnRow.appendChild(resumeBtn);
    }

    const btn = document.createElement("button");
    btn.className = state.savedGame ? "end-early-btn" : "start-btn";
    btn.textContent = state.savedGame ? "Nouvelle tentative (efface la sauvegarde)" : "Commencer l'enquête";
    btn.addEventListener("click", () => {
      clearSavedGame(state.currentCityId, state.currentCaseId);
      state.savedGame = null;
      resetCaseState();
      state.started = true;
      state.view = "quartier";
      A.play("interface/carte-depliee");
      render();
      scrollToTop();
    });
    btnRow.appendChild(btn);
    card.appendChild(btnRow);

    if (state.savedGame) {
      const d = new Date(state.savedGame.savedAt);
      const note = document.createElement("p");
      note.className = "briefing";
      note.textContent = "Dernière sauvegarde : " + d.toLocaleDateString("fr-FR") + " à " + d.toLocaleTimeString("fr-FR");
      card.appendChild(note);
    }
    wrap.appendChild(card);
    return wrap;
  }

  // ---------------------------------------------------------------
  // Écran d'enquête : plan + barre latérale + panneau
  // ---------------------------------------------------------------

  // Sur mobile, la carte ne s'affiche qu'aux endroits où elle sert vraiment
  // (choisir un quartier / un lieu) : ailleurs (carnet, annuaire, minitel,
  // équipe), elle ne ferait qu'ajouter un long scroll avant le vrai contenu.
  const VUES_AVEC_CARTE = ["quartier", "location"];

  function renderMainGrid() {
    const wrap = document.createElement("div");
    const k = computeKnowledge();
    const mapWrap = renderCityMap(k);
    if (!VUES_AVEC_CARTE.includes(state.view)) mapWrap.classList.add("map-secondaire");
    wrap.appendChild(mapWrap);
    const grid = document.createElement("div");
    grid.className = "main-grid";
    grid.appendChild(renderSidebar(k));
    grid.appendChild(renderContentPanel(k));
    wrap.appendChild(grid);
    return wrap;
  }

  // ---------------- Plan ----------------

  function computeGenericZoneRects(cs) {
    const n = cs.quartiers.length;
    const margin = 20;
    const cols = Math.max(1, Math.ceil(Math.sqrt(n)));
    const rows = Math.max(1, Math.ceil(n / cols));
    const cellW = (900 - margin * 2) / cols;
    const cellH = (600 - margin * 2) / rows;
    const rects = {};
    cs.quartiers.forEach((q, i) => {
      rects[q.id] = q.rect || { x: margin + (i % cols) * cellW + 12, y: margin + Math.floor(i / cols) * cellH + 12, w: cellW - 24, h: cellH - 24 };
    });
    return rects;
  }

  function computeGenericLocationCoords(cs, rects) {
    const coords = {};
    cs.quartiers.forEach((q) => {
      const r = rects[q.id];
      const locs = cs.locations.filter((l) => l.quartier === q.id);
      const cols = Math.max(1, Math.ceil(Math.sqrt(locs.length)));
      const rows = Math.max(1, Math.ceil(locs.length / cols));
      locs.forEach((loc, i) => {
        coords[loc.id] = loc.map || {
          x: r.x + (r.w / cols) * ((i % cols) + 0.5),
          y: r.y + 34 + Math.max(20, (r.h - 34) / rows) * (Math.floor(i / cols) + 0.5)
        };
      });
    });
    return coords;
  }

  function locationVisited(locationId) {
    return cluesForLocation(locationId).some((c) => state.readClueIds.has(c.id));
  }

  // Plan dessiné : quartiers aux vrais contours, décor de la ville, quadrillage et cartouche.
  function buildPlanSVG(k) {
    const cs = currentCase();
    const P = cs.plan;
    const esc = escapeHtml;
    const angles = [8, -14, 22, -4, 15, -22, 3, -10, 18];
    let defs = "";
    let zones = "";
    cs.quartiers.forEach((q, i) => {
      defs +=
        '<pattern id="ilots-' + q.id + '" width="30" height="22" patternUnits="userSpaceOnUse" patternTransform="rotate(' + angles[i % angles.length] + ')">' +
        '<rect x="2" y="2" width="12" height="8" class="ilot"/><rect x="17" y="2" width="11" height="8" class="ilot"/>' +
        '<rect x="2" y="13" width="7" height="7" class="ilot"/><rect x="12" y="13" width="16" height="7" class="ilot"/></pattern>';
      const hasKnown = cs.locations.some((l) => l.quartier === q.id && k.l.has(l.id));
      zones +=
        '<g data-zone="' + q.id + '" class="zone-group' + (state.selectedQuartier === q.id ? " zone-selected" : "") + (hasKnown ? "" : " zone-empty") + (q.outside ? " zone-dehors" : "") +
        '" tabindex="0" role="button" aria-label="Quartier ' + esc(q.name) + '">' +
        '<path d="' + q.shape + '" class="zone-fond"/><path d="' + q.shape + '" fill="url(#ilots-' + q.id + ')" class="zone-ilots"/>' +
        '<path d="' + q.shape + '" class="zone-shape"/>' +
        '<text x="' + q.label.x + '" y="' + q.label.y + '" class="zone-label" text-anchor="middle"' +
        (q.label.angle ? ' transform="rotate(' + q.label.angle + " " + q.label.x + " " + q.label.y + ')"' : "") + ">" + esc(q.name.toUpperCase()) + "</text></g>";
    });
    let decor = "";
    let decorLabels = "";
    (P.decor || []).forEach((d, i) => {
      if (d.type === "road") decor += '<path d="' + d.d + '" class="plan-route-bord"/><path d="' + d.d + '" class="plan-route"/>';
      if (d.type === "tram") decor += '<path d="' + d.d + '" class="plan-tram"/>';
      if (d.type === "rail") decor += '<path d="' + d.d + '" class="plan-rail"/><path d="' + d.d + '" class="plan-rail-traverses"/>';
      if (d.type === "river") decor += '<path d="' + d.d + '" class="plan-riviere"/>';
      if (d.label && d.at)
        decorLabels +=
          '<text x="' + d.at[0] + '" y="' + d.at[1] + '" class="plan-legende plan-legende-' + d.type + '" transform="rotate(' + (d.angle || 0) + " " + d.at[0] + " " + d.at[1] + ')">' + esc(d.label) + "</text>";
    });
    // Quadrillage des plans-guides : colonnes A à F, lignes 1 à 6
    let grille = '<rect x="12" y="12" width="876" height="576" class="plan-cadre"/><rect x="20" y="20" width="860" height="560" class="plan-cadre-fin"/>';
    for (let c = 1; c < 6; c++) grille += '<line x1="' + (20 + c * 860 / 6) + '" y1="20" x2="' + (20 + c * 860 / 6) + '" y2="580" class="plan-grille"/>';
    for (let r = 1; r < 6; r++) grille += '<line x1="20" y1="' + (20 + r * 560 / 6) + '" x2="880" y2="' + (20 + r * 560 / 6) + '" class="plan-grille"/>';
    "ABCDEF".split("").forEach((l, c) => {
      const x = 20 + (c + 0.5) * 860 / 6;
      grille += '<text x="' + x + '" y="18" class="plan-repere" text-anchor="middle">' + l + '</text><text x="' + x + '" y="589" class="plan-repere" text-anchor="middle">' + l + "</text>";
    });
    for (let r = 0; r < 6; r++) {
      const y = 20 + (r + 0.5) * 560 / 6 + 3;
      grille += '<text x="16" y="' + y + '" class="plan-repere" text-anchor="middle">' + (r + 1) + '</text><text x="884" y="' + y + '" class="plan-repere" text-anchor="middle">' + (r + 1) + "</text>";
    }
    const cartouche =
      '<g class="plan-cartouche"><rect x="46" y="40" width="236" height="112"/><rect x="51" y="45" width="226" height="102" class="plan-cartouche-fin"/>' +
      '<text x="164" y="76" text-anchor="middle" class="plan-titre">' + esc(P.title || "") + "</text>" +
      '<text x="164" y="94" text-anchor="middle" class="plan-sous-titre">' + esc(P.subtitle || "") + "</text>" +
      '<g transform="translate(164 128)" class="plan-rose"><path d="M0,-16 L4,0 L0,16 L-4,0 Z"/><path d="M-16,0 L0,-3 L16,0 L0,3 Z" class="plan-rose-clair"/>' +
      '<text x="0" y="-18" text-anchor="middle">N</text></g></g>';
    const coords = {};
    cs.locations.forEach((l) => (coords[l.id] = l.map));
    let pins = "";
    cs.locations.forEach((loc) => {
      if (!k.l.has(loc.id)) return;
      const c = coords[loc.id];
      const visited = locationVisited(loc.id);
      const active = state.selectedLocationId === loc.id;
      const hasNew = cluesForLocation(loc.id).some((cl) => state.freshClueIds.has(cl.id) && clueAvailable(cl, k) && !state.readClueIds.has(cl.id));
      const court = loc.short || loc.name.replace(/^(Ancienne |Café |Cabinet du |Cabinet |Chantier du |Consigne de la gare de )/, "").replace(/,.*$/, "");
      pins +=
        '<g data-loc="' + loc.id + '" class="pin-group' + (visited ? " pin-visited" : "") + (active ? " pin-active" : "") + (hasNew ? " pin-new" : "") +
        '" tabindex="0" role="button" aria-label="' + esc(loc.name) + '"><circle cx="' + c.x + '" cy="' + c.y + '" r="20" class="pin-hitarea"/>' +
        (active ? '<circle cx="' + c.x + '" cy="' + c.y + '" r="15" class="pin-ring"/>' : "") +
        '<circle cx="' + (c.x + 1.5) + '" cy="' + (c.y + 2) + '" r="8" class="pin-ombre"/>' +
        '<circle cx="' + c.x + '" cy="' + c.y + '" r="8" class="pin-circle"/><circle cx="' + (c.x - 2.5) + '" cy="' + (c.y - 2.5) + '" r="2.2" class="pin-reflet"/>' +
        (hasNew ? '<circle cx="' + (c.x + 9) + '" cy="' + (c.y - 9) + '" r="4.5" class="pin-badge"/>' : "") +
        '<text x="' + c.x + '" y="' + (c.y + 21) + '" text-anchor="middle" class="pin-nom">' + esc(court) + "</text>" +
        "<title>" + esc(loc.name) + (visited ? " (déjà exploré)" : "") + "</title></g>";
    });
    const bg = mapImages[state.currentCityId]
      ? '<image href="img/plans/' + state.currentCityId + '.jpg" x="0" y="0" width="900" height="600" preserveAspectRatio="xMidYMid slice" class="map-image"/>'
      : "";
    return (
      '<svg viewBox="0 0 900 600" xmlns="http://www.w3.org/2000/svg" class="city-map-svg plan-dessine' + (bg ? " has-map-image" : "") + '"><defs>' + defs + "<clipPath id=\"plan-cadre\"><rect x=\"20\" y=\"20\" width=\"860\" height=\"560\"/></clipPath></defs>" +
      '<rect x="0" y="0" width="900" height="600" class="plan-papier"/>' + bg + zones + '<g class="plan-decor" clip-path="url(#plan-cadre)">' + decor + decorLabels + "</g>" + grille + cartouche + pins + "</svg>"
    );
  }

  function buildCityMapSVG(k) {
    const cs = currentCase();
    if (cs.plan && cs.quartiers.every((q) => q.shape)) return buildPlanSVG(k);
    const rects = computeGenericZoneRects(cs);
    const coords = computeGenericLocationCoords(cs, rects);
    let zones = "";
    cs.quartiers.forEach((q) => {
      const r = rects[q.id];
      zones +=
        '<g data-zone="' + q.id + '" class="zone-group' + (state.selectedQuartier === q.id ? " zone-selected" : "") +
        '" tabindex="0" role="button" aria-label="Quartier ' + q.name + '"><rect x="' + r.x + '" y="' + r.y + '" width="' + r.w +
        '" height="' + r.h + '" rx="18" class="zone-shape"/><text x="' + (r.x + r.w / 2) + '" y="' + (r.y + 26) +
        '" class="zone-label" text-anchor="middle">' + q.name.toUpperCase() + "</text></g>";
    });
    let pins = "";
    cs.locations.forEach((loc) => {
      if (!k.l.has(loc.id)) return;
      const c = coords[loc.id];
      const visited = locationVisited(loc.id);
      const active = state.selectedLocationId === loc.id;
      const hasNew = cluesForLocation(loc.id).some((cl) => state.freshClueIds.has(cl.id) && clueAvailable(cl, k) && !state.readClueIds.has(cl.id));
      pins +=
        '<g data-loc="' + loc.id + '" class="pin-group' + (visited ? " pin-visited" : "") + (active ? " pin-active" : "") + (hasNew ? " pin-new" : "") +
        '" tabindex="0" role="button" aria-label="' + loc.name + '"><circle cx="' + c.x + '" cy="' + c.y + '" r="20" class="pin-hitarea"/>' +
        (active ? '<circle cx="' + c.x + '" cy="' + c.y + '" r="17" class="pin-ring"/>' : "") +
        '<circle cx="' + c.x + '" cy="' + c.y + '" r="11" class="pin-circle"/>' +
        (hasNew ? '<circle cx="' + (c.x + 10) + '" cy="' + (c.y - 10) + '" r="5" class="pin-badge"/>' : "") +
        "<title>" + loc.name + (visited ? " (déjà exploré)" : "") + "</title></g>";
    });
    const bg = mapImages[state.currentCityId]
      ? '<image href="img/plans/' + state.currentCityId + '.jpg" x="0" y="0" width="900" height="600" preserveAspectRatio="xMidYMid slice" class="map-image"/>'
      : "";
    return '<svg viewBox="0 0 900 600" xmlns="http://www.w3.org/2000/svg" class="city-map-svg' + (bg ? " has-map-image" : "") + '">' + bg + zones + pins + "</svg>";
  }

  function renderCityMap(k) {
    const wrap = document.createElement("div");
    wrap.className = "city-map-wrap";
    wrap.innerHTML =
      '<h3 class="map-title">Plan de ' + currentCity().name + '<span class="map-count">' + k.l.size + " lieu" + (k.l.size > 1 ? "x" : "") +
      " connu" + (k.l.size > 1 ? "s" : "") + "</span></h3>" + buildCityMapSVG(k) +
      '<div class="map-legend"><span class="legend-item"><i class="dot dot-todo"></i>Lieu à explorer</span>' +
      '<span class="legend-item"><i class="dot dot-visited"></i>Déjà exploré</span>' +
      '<span class="legend-item"><i class="dot dot-new"></i>Nouvelle piste</span></div>' +
      '<p class="map-mobile-hint">← Faites glisser pour voir tout le plan →</p>';
    const handle = (el) => {
      const pin = el.closest("[data-loc]");
      if (pin) return goToLocation(pin.getAttribute("data-loc"));
      const zone = el.closest("[data-zone]");
      if (zone) {
        state.selectedQuartier = zone.getAttribute("data-zone");
        state.selectedLocationId = null;
        state.view = "quartier";
        state.lastResult = null;
        render();
      }
    };
    wrap.addEventListener("click", (e) => handle(e.target));
    wrap.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        handle(e.target);
      }
    });
    return wrap;
  }

  // ---------------- Barre latérale ----------------

  function renderSidebar(k) {
    const cs = currentCase();
    const sidebar = document.createElement("div");
    sidebar.className = "sidebar";

    const h = (txt) => {
      const el = document.createElement("h3");
      el.textContent = txt;
      sidebar.appendChild(el);
    };
    const button = (cls, label, fn) => {
      const b = document.createElement("button");
      b.className = cls;
      b.innerHTML = label;
      b.addEventListener("click", fn);
      sidebar.appendChild(b);
      return b;
    };

    h("Quartiers");
    cs.quartiers.forEach((q) => {
      const count = cs.locations.filter((l) => l.quartier === q.id && k.l.has(l.id)).length;
      button(
        "nav-item" + (state.view === "quartier" && state.selectedQuartier === q.id ? " active" : "") + (count === 0 ? " nav-empty" : ""),
        escapeHtml(q.name) + (count ? '<span class="nav-count">' + count + "</span>" : ""),
        () => {
          state.view = "quartier";
          state.selectedQuartier = q.id;
          state.lastResult = null;
          render();
          scrollToTop();
        }
      );
    });

    h("Lieux : " + ((quartierById(state.selectedQuartier) || {}).name || ""));
    const here = cs.locations.filter((l) => l.quartier === state.selectedQuartier && k.l.has(l.id));
    if (!here.length) {
      const none = document.createElement("p");
      none.className = "nav-none";
      none.textContent = "Personne ne vous a encore parlé d'un lieu dans ce quartier.";
      sidebar.appendChild(none);
    }
    here.forEach((l) =>
      button("nav-item tag-lieu-nav" + (state.view === "location" && state.selectedLocationId === l.id ? " active" : ""), escapeHtml(l.name), () => goToLocation(l.id))
    );

    h("Outils");
    button("annuaire-btn equipe-btn", "L'équipe du Bureau", () => {
      A.play("interface/page");
      state.view = "equipe";
      render();
      scrollToPanel();
    });
    button("annuaire-btn journal-btn", "Carnet de l'enquête", () => {
      A.play("outils/carnet-ouvrir");
      state.view = "journal";
      render();
      scrollToPanel();
    });
    button("annuaire-btn", "Consulter l'annuaire (" + k.p.size + ")", () => {
      A.play("interface/page");
      state.view = "annuaire";
      render();
      scrollToPanel();
    });
    button("annuaire-btn minitel-btn", "Minitel · 3611", () => {
      state.view = "minitel";
      A.play("outils/minitel-allumage");
      A.play("outils/minitel-connexion", 600);
      render();
      scrollToPanel();
    });

    const legend = document.createElement("div");
    legend.innerHTML = colorLegendHTML();
    sidebar.appendChild(legend.firstChild);

    button("end-early-btn article-btn", "Rédiger l'article", () => {
      A.play("interface/page-journal");
      state.view = "questionnaire";
      render();
      window.scrollTo(0, 0);
    });
    button("end-early-btn", "← Retour aux affaires", () => {
      state.view = "caseSelect";
      render();
      scrollToTop();
    });

    const note = document.createElement("p");
    note.className = "briefing save-note";
    note.textContent = "Sauvegarde automatique activée sur cet appareil.";
    sidebar.appendChild(note);

    button("end-early-btn", "Effacer la sauvegarde de cette affaire", () => {
      if (window.confirm("Effacer la sauvegarde de cette affaire et revenir à l'accueil ?")) {
        clearSavedGame(state.currentCityId, state.currentCaseId);
        state.savedGame = null;
        state.started = false;
        resetCaseState();
        state.view = "intro";
        render();
      }
    });
    return sidebar;
  }

  // ---------------- Panneau principal ----------------

  function renderContentPanel(k) {
    const panel = document.createElement("div");
    panel.className = "content-panel";
    if (state.view === "annuaire") panel.appendChild(renderAnnuaire(k));
    else if (state.view === "journal") panel.appendChild(renderJournal(k));
    else if (state.view === "minitel") panel.appendChild(renderMinitel(k));
    else if (state.view === "equipe") panel.appendChild(renderEquipe(k));
    else if (!state.selectedLocationId || !k.l.has(state.selectedLocationId)) {
      const hint = document.createElement("div");
      hint.className = "location-card";
      hint.innerHTML =
        "<p>Choisissez un lieu dans le quartier « " + escapeHtml((quartierById(state.selectedQuartier) || {}).name || "") +
        " » pour mener un entretien ou une investigation. D'autres adresses apparaîtront au fil de vos découvertes.</p>";
      panel.appendChild(hint);
    } else panel.appendChild(renderLocationCard(k));
    return panel;
  }

  function renderLocationCard(k) {
    const loc = locationById(state.selectedLocationId);
    const card = document.createElement("div");
    card.className = "location-card";
    card.innerHTML =
      '<div class="location-header">' + optionalImageHTML("img/lieux/" + loc.id + ".jpg", "loc-photo") +
      '<p class="quartier-tag">' + quartierById(loc.quartier).name + '</p><h2 class="location-name">' + loc.name +
      '</h2><p class="address">' + loc.address + "</p></div>";

    const list = document.createElement("div");
    list.className = "lead-buttons";
    const clues = cluesForLocation(loc.id).filter((c) => clueAvailable(c, k));
    if (!clues.length) {
      const none = document.createElement("p");
      none.className = "briefing";
      none.textContent = "Rien à faire ici pour l'instant.";
      list.appendChild(none);
    }
    clues.forEach((clue) => {
      const read = state.readClueIds.has(clue.id);
      const btn = document.createElement("button");
      const isNew = state.freshClueIds.has(clue.id) && !read;
      btn.className =
        "lead-btn lead-" + (clue.type === "entretien" ? "entretien" : "investigation") + (read ? " lead-read" : "") + (isNew ? " lead-new" : "") +
        (state.lastResult && state.lastResult.clueId === clue.id ? " lead-current" : "");
      btn.innerHTML =
        '<span class="lead-kind">' + (clue.type === "entretien" ? "Entretien" : "Investigation") + "</span>" +
        '<span class="lead-label">' + escapeHtml(clueButton(clue)) + "</span>" +
        (read ? '<span class="already-read">déjà lu, gratuit</span>' : isNew ? '<span class="new-tag">nouveau</span>' : "");
      const who = clue.speaker && characterById(clue.speaker);
      if (who) {
        btn.classList.add("lead-avec-portrait");
        btn.insertAdjacentHTML("afterbegin", portraitHTML(who, "mini"));
      }
      btn.addEventListener("click", () => selectClue(clue));
      list.appendChild(btn);
    });
    card.appendChild(list);

    if (state.lastResult) card.appendChild(renderClueResult(state.lastResult, k));
    return card;
  }

  function selectClue(clue) {
    const already = state.readClueIds.has(clue.id);
    if (!already) {
      if (state.leadsRemaining <= 0) {
        A.play("interface/plus-de-pistes");
        state.lastResult = {
          empty: true,
          text: "L'heure du bouclage est passée : vous ne pouvez plus ouvrir de nouvelle piste. Relisez vos notes, consultez le carnet, puis rédigez votre article."
        };
        render();
        return;
      }
      const before = snapshot();
      const prevUsed = leadsUsed();
      state.leadsRemaining -= 1;
      afterLeadSpent(prevUsed);
      state.readClueIds.add(clue.id);
      state.freshClueIds.delete(clue.id);
      state.lastReadClueId = clue.id;
      const after = snapshot();

      // Le tampon, la sonnette et le son des découvertes viennent à la fin de la lecture
      if (clue.type !== "entretien") A.play("interface/appareil-photo");
      if (clue.mood === "silence") A.silence(3200);
      if (clue.salamandre) A.play("musiques/salamandre", 1200);
      if (state.leadsRemaining === 3) A.play("interface/horloge", 1500);
      if (state.leadsRemaining === 0) A.play("interface/plus-de-pistes", 1800);

      const d = diff(before, after, true);
      state.lastResult = Object.assign({ clueId: clue.id, first: true }, d);
    } else {
      A.play("interface/page");
      state.lastResult = { clueId: clue.id, first: false, fresh: [] };
    }
    render();
    const res = document.querySelector(".clue-result");
    if (res && res.scrollIntoView) res.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function discoveriesHTML(r) {
    const lines = [];
    const join = (arr, cls) => '<span class="' + cls + '">' + arr.map(escapeHtml).join('</span>, <span class="' + cls + '">') + "</span>";
    if (r.newCharacters && r.newCharacters.length) lines.push('<span class="disc-label">Annuaire</span>' + join(r.newCharacters, "tag-person"));
    if (r.newLocations && r.newLocations.length) lines.push('<span class="disc-label">Sur le plan</span>' + join(r.newLocations, "tag-lieu"));
    if (r.newDocuments && r.newDocuments.length) lines.push('<span class="disc-label">Au dossier</span>' + join(r.newDocuments, "tag-doc"));
    if (r.newActions && r.newActions.length) lines.push('<span class="disc-label">Pour l\'article</span>' + join(r.newActions, "tag-action"));
    if (r.struck) lines.push('<span class="disc-label">Au carnet</span>' + r.struck + " déclaration" + (r.struck > 1 ? "s" : "") + " contredite" + (r.struck > 1 ? "s" : "") + ", barrée" + (r.struck > 1 ? "s" : ""));
    if (r.unlocked && r.unlocked.length) lines.push('<span class="disc-label">Nouvelle piste</span>' + r.unlocked.map((u) => "« " + escapeHtml(u) + " »").join(", "));
    if (!lines.length) return "";
    return '<div class="discoveries"><p class="discoveries-head">Nouveau</p>' + lines.map((l) => '<p class="disc-line">' + l + "</p>").join("") + "</div>";
  }

  function renderClueResult(r, k) {
    const box = document.createElement("div");
    if (r.empty) {
      box.className = "empty-clue";
      box.textContent = r.text;
      return box;
    }
    const clue = clueById(r.clueId);
    const animate = r.first && !r.animated && vis.anim;
    r.animated = true; // un nouveau rendu ne rejoue pas l'animation
    const silence = animate && clue.mood === "silence";
    const typing = animate && !silence && clue.type === "entretien";
    const fax = animate && !!clue.fax;
    box.className = "clue-result" + (silence ? " clue-silence" : "") + (typing ? " clue-typing" : "");
    const who = clue.speaker && characterById(clue.speaker);
    box.innerHTML =
      (who
        ? '<div class="clue-tete">' + portraitHTML(who, "moyen") + '<div><div class="clue-title">' + escapeHtml(clueTitle(clue)) +
          '</div><p class="clue-qui"><span class="tag-person">' + escapeHtml(who.name) + "</span> · " + escapeHtml(who.role || "") + "</p></div></div>"
        : '<div class="clue-title">' + escapeHtml(clueTitle(clue)) + "</div>") +
      '<div class="clue-text">' +
      renderParagraphs(clue.text, { fresh: new Set(r.fresh || []), links: true, knowledge: k, fax: clue.fax, printFax: fax }) +
      '</div><div class="stamp">Lu</div>' + discoveriesHTML(r);
    // Fin de lecture : sonnette (si le texte a été tapé), tampon « Lu », puis le son des découvertes
    const endSounds = (typed) => {
      if (r.endPlayed) return;
      r.endPlayed = true;
      let t = 0;
      if (typed) { A.play("interface/machine-ecrire-sonnette"); t = 450; }
      A.play("interface/tampon", t);
      if (r.sound) A.play(r.sound, t + 550);
    };
    if (typing) setTimeout(() => typewrite(box.querySelector(".clue-text"), box, () => endSounds(true)), 0);
    else if (animate) setTimeout(() => endSounds(false), silence ? 2600 : 700);
    if (fax) {
      A.play("interface/fax", 300);
      if (!typing) setTimeout(() => A.play("interface/fax", 2600), 0);
    }
    const pz = puzzleOf(clue);
    if (pz) box.appendChild(renderPuzzle(clue, pz, k));
    return box;
  }

  // ---------------------------------------------------------------
  // Machine à écrire : le texte d'un entretien s'affiche lettre par lettre.
  // Un clic (ou une touche) affiche tout d'un coup.
  // ---------------------------------------------------------------

  function typewrite(el, box, onDone) {
    if (!el) return;
    const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT, {
      acceptNode: (n) => (n.parentElement.closest(".fax") ? NodeFilter.FILTER_REJECT : NodeFilter.FILTER_ACCEPT)
    });
    const nodes = [];
    while (walker.nextNode()) nodes.push({ node: walker.currentNode, text: walker.currentNode.nodeValue });
    if (!nodes.length) return;
    nodes.forEach((n) => (n.node.nodeValue = ""));
    box.classList.add("typing-active");
    let i = 0;
    let pos = 0;
    const keys = ["interface/machine-ecrire-touche-1", "interface/machine-ecrire-touche-2", "interface/machine-ecrire-touche-3"];
    let timer = null;
    let done = false;
    let tick = 0;
    const finish = () => {
      if (done) return;
      done = true;
      clearInterval(timer);
      if (onDone) onDone();
      nodes.forEach((n) => (n.node.nodeValue = n.text));
      box.classList.remove("typing-active");
      box.removeEventListener("click", finish);
      document.removeEventListener("keydown", finish);
    };
    box.addEventListener("click", finish);
    document.addEventListener("keydown", finish);
    timer = setInterval(() => {
      if (!el.isConnected) return finish();
      for (let step = 0; step < 4 && i < nodes.length; step++) {
        const n = nodes[i];
        pos++;
        n.node.nodeValue = n.text.slice(0, pos);
        if (pos >= n.text.length) {
          i++;
          pos = 0;
        }
      }
      if (tick++ % 2 === 0) A.playQuick(keys, 120, 0.6);
      if (i >= nodes.length) finish();
    }, 16);
  }

  // ---------------------------------------------------------------
  // Pluie sur la vitre (affaires où il pleut) : visible dans les marges,
  // jamais sur le texte.
  // ---------------------------------------------------------------

  const rain = { canvas: null, on: false, drops: [], beads: [] };

  function initRain() {
    const c = document.createElement("canvas");
    c.id = "pluie";
    c.setAttribute("aria-hidden", "true");
    document.body.insertBefore(c, document.body.firstChild);
    rain.canvas = c;
    const resize = () => {
      c.width = window.innerWidth;
      c.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);
    for (let i = 0; i < 90; i++) rain.drops.push({ x: Math.random(), y: Math.random(), v: 0.9 + Math.random() * 0.8, l: 10 + Math.random() * 18 });
    for (let i = 0; i < 26; i++) rain.beads.push({ x: Math.random(), y: Math.random(), r: 1.5 + Math.random() * 3, v: Math.random() < 0.3 ? 0.02 + Math.random() * 0.08 : 0 });
    const ctx = c.getContext("2d");
    const tick = () => {
      requestAnimationFrame(tick);
      if (!rain.on || document.hidden) {
        if (c.style.opacity !== "0") c.style.opacity = "0";
        return;
      }
      c.style.opacity = "1";
      const w = c.width;
      const h = c.height;
      ctx.clearRect(0, 0, w, h);
      const night = document.body.classList.contains("menu-mode");
      ctx.strokeStyle = night ? "rgba(190, 200, 215, 0.16)" : "rgba(70, 80, 90, 0.18)";
      ctx.lineWidth = 1;
      rain.drops.forEach((d) => {
        d.y += (d.v * 9) / h;
        if (d.y > 1.05) {
          d.y = -0.05;
          d.x = Math.random();
        }
        ctx.beginPath();
        ctx.moveTo(d.x * w, d.y * h);
        ctx.lineTo(d.x * w - 2, d.y * h + d.l);
        ctx.stroke();
      });
      rain.beads.forEach((b) => {
        b.y += b.v / 100;
        if (b.y > 1.05) {
          b.y = -0.05;
          b.x = Math.random();
        }
        ctx.beginPath();
        ctx.fillStyle = "rgba(255, 255, 255, 0.28)";
        ctx.arc(b.x * w, b.y * h, b.r, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.fillStyle = "rgba(40, 45, 50, 0.12)";
        ctx.arc(b.x * w + b.r * 0.3, b.y * h + b.r * 0.4, b.r * 0.8, 0, Math.PI * 2);
        ctx.fill();
      });
    };
    tick();
  }

  // ---------------------------------------------------------------
  // L'heure qui tourne : chaque piste avance le calendrier jusqu'au bouclage
  // ---------------------------------------------------------------

  const MOMENTS = ["matin", "matinee", "apres-midi", "soir"];

  function clockInfo() {
    const cal = currentCase().calendar;
    if (!cal) return null;
    const used = leadsUsed();
    const perDay = cal.slots.length;
    if (state.leadsRemaining <= 0) return { label: cal.deadline, moment: "nuit", day: cal.days.length };
    const day = Math.min(Math.floor(used / perDay), cal.days.length - 1);
    const slot = used % perDay;
    return { label: cal.days[day] + ", " + cal.slots[slot], moment: MOMENTS[Math.min(slot, MOMENTS.length - 1)], day: day };
  }

  // Il pleut à certains moments de l'enquête seulement (calendar.rain : numéros de créneaux)
  function isRaining() {
    const cs = currentCase();
    if (cs.weather !== "pluie") return false;
    const cal = cs.calendar;
    if (!cal || !cal.rain) return true;
    return cal.rain.includes(Math.min(leadsUsed(), cal.days.length * cal.slots.length));
  }

  // À appeler après chaque piste dépensée : la cloche sonne à chaque nouvelle journée
  function afterLeadSpent(prevUsed) {
    const cal = currentCase().calendar;
    if (!cal) return;
    const per = cal.slots.length;
    if (Math.floor(leadsUsed() / per) > Math.floor(prevUsed / per) && state.leadsRemaining > 0) A.play("interface/clocher", 1200);
  }

  // ---------------------------------------------------------------
  // Puzzles
  // ---------------------------------------------------------------

  function renderPuzzle(clue, pz, k) {
    const box = document.createElement("div");
    box.className = "puzzle puzzle-" + pz.type;
    const solved = state.puzzlesSolved.has(clue.puzzle);
    box.innerHTML = '<p class="puzzle-head">' + escapeHtml(pz.title) + "</p>";

    if (solved) {
      if (state.puzzlesHelped.has(clue.puzzle)) box.innerHTML += '<p class="puzzle-help-text">' + escapeHtml(pz.help) + "</p>";
      box.innerHTML += '<div class="puzzle-result">' + renderParagraphs(pz.result, { links: true, knowledge: k, fresh: new Set((state.lastPuzzleFresh || [])) }) + "</div>";
      if (state.lastPuzzleResult && state.lastPuzzleResult.id === clue.puzzle) box.innerHTML += discoveriesHTML(state.lastPuzzleResult);
      return box;
    }

    const instr = document.createElement("p");
    instr.className = "puzzle-instructions";
    instr.textContent = pz.instructions;
    box.appendChild(instr);

    const area = document.createElement("div");
    area.className = "puzzle-area";
    box.appendChild(area);
    const feedback = document.createElement("p");
    feedback.className = "puzzle-feedback";
    box.appendChild(feedback);

    if (pz.type === "fragments") buildFragments(clue, pz, area, feedback);
    else if (pz.type === "line") buildLine(clue, pz, area, feedback);
    else if (pz.type === "code") buildCode(clue, pz, area, feedback);

    const help = document.createElement("button");
    help.className = "puzzle-help";
    help.textContent = state.leadsRemaining > 0 ? "Demander de l'aide à l'équipe (coûte une piste)" : "Plus de piste disponible pour demander de l'aide";
    help.disabled = state.leadsRemaining <= 0;
    help.addEventListener("click", () => {
      if (state.leadsRemaining <= 0) return;
      const prevUsed = leadsUsed();
      state.leadsRemaining -= 1;
      afterLeadSpent(prevUsed);
      state.puzzlesHelped.add(clue.puzzle);
      A.play("puzzles/aide");
      solvePuzzle(clue);
    });
    box.appendChild(help);
    return box;
  }

  function solvePuzzle(clue) {
    const before = snapshot();
    state.puzzlesSolved.add(clue.puzzle);
    const after = snapshot();
    A.play("puzzles/puzzle-reussi", 200);
    const d = diff(before, after);
    state.lastPuzzleResult = Object.assign({ id: clue.puzzle }, d);
    state.lastPuzzleFresh = d.fresh;
    render();
  }

  // Le reçu : cliquer les morceaux dans le bon ordre
  function buildFragments(clue, pz, area, feedback) {
    const n = pz.pieces.length;
    const order = pz.pieces.map((_, i) => i);
    // mélange déterministe, jamais dans l'ordre
    const shuffled = order.slice().sort((a, b) => ((a * 7 + 3) % n) - ((b * 7 + 3) % n));
    if (shuffled.every((v, i) => v === i)) shuffled.reverse();
    const placed = [];

    const assembled = document.createElement("div");
    assembled.className = "frag-assembled";
    const pile = document.createElement("div");
    pile.className = "frag-pile";
    area.appendChild(assembled);
    area.appendChild(pile);

    const draw = () => {
      assembled.innerHTML = placed.length
        ? placed.map((i) => '<span class="frag frag-placed">' + escapeHtml(pz.pieces[i]) + "</span>").join("")
        : '<span class="frag-empty">Le reçu se reconstitue ici</span>';
      pile.innerHTML = "";
      shuffled.forEach((i, pos) => {
        if (placed.includes(i)) return;
        const b = document.createElement("button");
        b.className = "frag";
        b.style.transform = "rotate(" + [-7, 5, -3, 8, -5][pos % 5] + "deg)";
        b.textContent = pz.pieces[i];
        b.addEventListener("click", () => {
          if (i === placed.length) {
            placed.push(i);
            A.play("puzzles/papier-emboiter");
            feedback.textContent = "";
            if (placed.length === n) solvePuzzle(clue);
            else draw();
          } else {
            A.play("puzzles/papier-deplacer");
            b.classList.remove("frag-wrong");
            void b.offsetWidth;
            b.classList.add("frag-wrong");
            feedback.textContent = "Ce morceau ne vient pas là.";
          }
        });
        pile.appendChild(b);
      });
    };
    draw();
  }

  // La facture : trouver la ligne qui détonne
  function buildLine(clue, pz, area, feedback) {
    A.play("puzzles/listing");
    const table = document.createElement("div");
    table.className = "listing";
    table.innerHTML = '<div class="listing-row listing-head"><span>Date</span><span>Heure</span><span>Numéro appelé</span><span>Durée</span></div>';
    pz.lines.forEach((line) => {
      const row = document.createElement("button");
      row.className = "listing-row";
      row.innerHTML = "<span>" + line.date + "</span><span>" + line.heure + "</span><span>" + line.numero + "</span><span>" + line.duree + "</span>";
      row.addEventListener("click", () => {
        A.play("puzzles/feutre-entourer");
        if (!line.qui) {
          solvePuzzle(clue);
        } else {
          table.querySelectorAll(".listing-row").forEach((r) => r.classList.remove("listing-picked"));
          row.classList.add("listing-picked");
          feedback.textContent = "Le " + line.date + " à " + line.heure + " : un appel ordinaire, vers " + line.qui + ".";
        }
      });
      table.appendChild(row);
    });
    area.appendChild(table);
  }

  // Le coffre : quatre molettes
  function buildCode(clue, pz, area, feedback) {
    const digits = new Array(pz.digits || 4).fill(0);
    const wheels = document.createElement("div");
    wheels.className = "code-wheels";
    const draw = () => {
      wheels.innerHTML = "";
      digits.forEach((d, i) => {
        const w = document.createElement("div");
        w.className = "code-wheel";
        const up = document.createElement("button");
        up.textContent = "▲";
        up.setAttribute("aria-label", "Chiffre " + (i + 1) + " plus");
        const val = document.createElement("span");
        val.className = "code-digit";
        val.textContent = d;
        const down = document.createElement("button");
        down.textContent = "▼";
        down.setAttribute("aria-label", "Chiffre " + (i + 1) + " moins");
        up.addEventListener("click", () => {
          digits[i] = (digits[i] + 1) % 10;
          A.play("puzzles/coffre-molette");
          draw();
        });
        down.addEventListener("click", () => {
          digits[i] = (digits[i] + 9) % 10;
          A.play("puzzles/coffre-molette");
          draw();
        });
        w.appendChild(up);
        w.appendChild(val);
        w.appendChild(down);
        wheels.appendChild(w);
      });
    };
    draw();
    const open = document.createElement("button");
    open.className = "code-open";
    open.textContent = "Tourner la poignée";
    open.addEventListener("click", () => {
      if (digits.join("") === String(pz.code)) {
        A.play("puzzles/coffre-ouvert");
        solvePuzzle(clue);
      } else {
        A.play("puzzles/coffre-erreur");
        feedback.textContent = "La poignée ne cède pas.";
      }
    });
    area.appendChild(wheels);
    area.appendChild(open);
  }

  // ---------------------------------------------------------------
  // Minitel
  // ---------------------------------------------------------------

  function normalize(s) {
    return String(s || "")
      .toLowerCase()
      .normalize("NFD")
      .replace(/[̀-ͯ]/g, "")
      .replace(/[^a-z ]/g, " ")
      .replace(/\s+/g, " ")
      .trim();
  }

  function minitelSearch(query) {
    const q = normalize(query);
    const entries = currentCase().minitel || [];
    if (!q) return -1;
    return entries.findIndex((e) => e.keys.some((key) => q === key || q.split(" ").includes(key) || (key.includes(" ") && q.includes(key))));
  }

  function renderMinitel(k) {
    const wrap = document.createElement("div");
    wrap.className = "minitel";
    const screen = document.createElement("div");
    screen.className = "minitel-screen";
    screen.innerHTML =
      '<div class="minitel-top"><span>3611</span><span>ANNUAIRE ÉLECTRONIQUE</span><span>0,37 F/min</span></div>' +
      '<div class="minitel-log">' +
      (state.minitelLog.length
        ? state.minitelLog.map((l) => '<div class="minitel-entry' + (l.found ? " minitel-found" : "") + '">' + l.lines.map((x) => "<div>" + escapeHtml(x) + "</div>").join("") + "</div>").join("")
        : '<div class="minitel-entry"><div>NOM :</div><div>LOCALITÉ : SAINT-ÉTIENNE (42)</div><div class="minitel-dim">Tapez un nom, puis ENVOI.</div></div>') +
      "</div>";
    const form = document.createElement("form");
    form.className = "minitel-form";
    form.innerHTML = '<span class="minitel-prompt">NOM ▸</span><input type="text" autocomplete="off" spellcheck="false" maxlength="30" aria-label="Nom à chercher"><button type="submit">ENVOI</button>';
    const input = form.querySelector("input");
    input.addEventListener("input", () => A.playOneOf(["outils/minitel-touche-1", "outils/minitel-touche-2", "outils/minitel-touche-3"]));
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const query = input.value;
      if (!query.trim()) return;
      A.play("outils/minitel-envoi");
      const i = minitelSearch(query);
      const before = snapshot();
      let lines;
      let found = false;
      if (i < 0) {
        lines = ["> " + query.toUpperCase(), "AUCUN ABONNÉ NE CORRESPOND", "À VOTRE DEMANDE."];
        A.play("outils/minitel-rien", 500);
      } else {
        const entry = currentCase().minitel[i];
        lines = ["> " + query.toUpperCase()].concat(entry.lines);
        found = (entry.reveals || []).length > 0;
        state.minitelFound.add(i);
        if (found && entry.about && !before.k[entry.about[0]].has(entry.about.slice(2))) {
          found = false;
          lines.push("(Ce nom n'apparaît nulle part dans votre dossier.)");
        }
        A.play("outils/minitel-resultat", 500);
      }
      const after = snapshot();
      const d = diff(before, after);
      state.minitelLog.unshift({ lines: lines, found: found, d: d });
      state.minitelLog = state.minitelLog.slice(0, 4);
      render();
      const inp = document.querySelector(".minitel-form input");
      if (inp) inp.focus();
    });
    screen.appendChild(form);
    wrap.appendChild(screen);

    const last = state.minitelLog[0];
    if (last && last.d) {
      const extra = document.createElement("div");
      extra.innerHTML = discoveriesHTML(last.d);
      if (extra.firstChild) wrap.appendChild(extra.firstChild);
    }

    const close = document.createElement("button");
    close.className = "end-early-btn minitel-close";
    close.textContent = "Déconnexion";
    close.addEventListener("click", () => {
      A.play("outils/minitel-deconnexion");
      state.view = state.selectedLocationId ? "location" : "quartier";
      render();
    });
    wrap.appendChild(close);
    setTimeout(() => {
      const inp = wrap.querySelector("input");
      if (inp) inp.focus();
    }, 50);
    return wrap;
  }

  // ---------------------------------------------------------------
  // Carnet de l'enquête
  // ---------------------------------------------------------------

  function entityOf(key) {
    const i = String(key || "").indexOf(":");
    const type = i > 0 ? key.slice(0, i) : "";
    const id = i > 0 ? key.slice(i + 1) : "";
    let obj = null;
    if (type === "p") obj = characterById(id);
    if (type === "l") obj = locationById(id);
    if (type === "d") obj = documentById(id);
    return { key: key, type: type, id: id, obj: obj };
  }

  function cluesMentioning(key) {
    const ent = entityOf(key);
    return currentCase().clues.filter(
      (c) =>
        state.readClueIds.has(c.id) &&
        (parseTags(c.text).some((t) => t.type === ent.type && t.id === ent.id) || (c.facts || []).some((f) => f.about === key))
    );
  }

  function characterMet(ch) {
    return currentCase().clues.some((c) => {
      if (!state.readClueIds.has(c.id) || c.type !== "entretien" || c.locationId !== ch.locationId) return false;
      const first = parseTags(c.text).find((t) => t.type === "p");
      return first && first.id === ch.id;
    });
  }

  function initialsOf(name) {
    return String(name).replace(/\(.*\)/, "").split(/[\s-]+/).filter(Boolean).slice(0, 2).map((w) => w.charAt(0).toUpperCase()).join("");
  }

  // Portrait : img/portraits/<id>.jpg s'il existe, sinon une silhouette avec les initiales
  function portraitHTML(ch, size) {
    const src = ch.portrait || "img/portraits/" + ch.id + ".jpg";
    return (
      '<div class="portrait portrait-' + size + ' portrait-empty"><svg viewBox="0 0 60 90" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">' +
      '<rect width="60" height="90" class="ph-bg"/><circle cx="30" cy="34" r="12" class="ph-shape"/>' +
      '<path d="M6 90 C6 66 17 55 30 55 C43 55 54 66 54 90 Z" class="ph-shape"/>' +
      '<text x="30" y="85" text-anchor="middle" class="ph-initials">' + escapeHtml(initialsOf(ch.name)) + "</text></svg>" +
      '<img src="' + escapeHtml(src) + '" alt="' + escapeHtml(ch.name) + '" data-remove-on-error></div>'
    );
  }

  // Une image facultative : retirée de la page si le fichier n'existe pas
  function optionalImageHTML(src, cls) {
    return '<figure class="' + cls + '" data-remove-parent><img src="' + escapeHtml(src) + '" alt="" data-remove-on-error></figure>';
  }

  function openJournalEntity(key) {
    const ent = entityOf(key);
    if (!ent.obj) return;
    A.play("interface/page");
    state.view = "journal";
    state.journalTab = ent.type;
    state.journalEntity = key;
    state.lastResult = null;
    render();
    scrollToPanel();
  }

  function renderJournal(k) {
    const cs = currentCase();
    const facts = knownFacts();
    const wrap = document.createElement("div");
    wrap.className = "location-card carnet";
    const lists = {
      p: cs.characters.filter((x) => k.p.has(x.id)),
      l: cs.locations.filter((x) => k.l.has(x.id)),
      d: (cs.documents || []).filter((x) => k.d.has(x.id))
    };
    const tabs = [
      { id: "p", label: "Personnes", n: lists.p.length, cls: "tag-person" },
      { id: "l", label: "Lieux", n: lists.l.length, cls: "tag-lieu" },
      { id: "d", label: "Pièces", n: lists.d.length, cls: "tag-doc" },
      { id: "pistes", label: "Pistes lues", n: state.readClueIds.size, cls: "" }
    ];
    let html = '<h2 class="carnet-title">Carnet de l\'enquête</h2><div class="carnet-tabs" role="tablist">';
    tabs.forEach((t) => {
      html +=
        '<button class="carnet-tab' + (state.journalTab === t.id ? " active" : "") + '" data-tab="' + t.id + '" role="tab"><span class="' + t.cls + '">' + t.label +
        '</span><span class="carnet-tab-n">' + t.n + "</span></button>";
    });
    wrap.innerHTML = html + "</div>";
    wrap.querySelectorAll(".carnet-tab").forEach((b) =>
      b.addEventListener("click", () => {
        A.play("interface/page");
        state.journalTab = b.getAttribute("data-tab");
        state.journalEntity = null;
        render();
      })
    );

    if (state.journalTab === "pistes") {
      wrap.appendChild(renderJournalPistes(k));
      return wrap;
    }
    const type = state.journalTab;
    const list = lists[type] || [];
    if (!list.length) {
      const empty = document.createElement("p");
      empty.className = "briefing";
      empty.textContent = "Rien dans cette partie du carnet pour l'instant.";
      wrap.appendChild(empty);
      return wrap;
    }
    let current = entityOf(state.journalEntity);
    if (!current.obj || current.type !== type || !list.includes(current.obj)) current = entityOf(type + ":" + list[0].id);

    const body = document.createElement("div");
    body.className = "carnet-body";
    const index = document.createElement("div");
    index.className = "carnet-index";
    list.forEach((obj) => {
      const key = type + ":" + obj.id;
      const mine = facts.filter((f) => f.about === key);
      const fresh = mine.some((f) => f.clueId && f.clueId === state.lastReadClueId);
      const b = document.createElement("button");
      b.className = "carnet-entry" + (key === current.key ? " active" : "");
      b.innerHTML =
        (type === "p" ? portraitHTML(obj, "mini") : "") + '<span class="carnet-entry-name ' + TAG_CLASS[type] + '">' + escapeHtml(obj.name) + "</span>" +
        '<span class="carnet-entry-n' + (fresh ? " fresh" : "") + '">' + (mine.length ? mine.length + " note" + (mine.length > 1 ? "s" : "") : "") + "</span>";
      b.addEventListener("click", () => {
        A.play("interface/page");
        state.journalEntity = key;
        render();
      });
      index.appendChild(b);
    });
    body.appendChild(index);
    body.appendChild(renderJournalPage(current, facts, k));
    wrap.appendChild(body);
    return wrap;
  }

  function renderJournalPage(ent, facts, k) {
    const page = document.createElement("div");
    page.className = "carnet-page carnet-page-" + ent.type;
    const obj = ent.obj;
    let head = '<div class="carnet-page-head">';
    if (ent.type === "p") {
      const loc = obj.locationId ? locationById(obj.locationId) : null;
      const locKnown = loc && k.l.has(loc.id);
      head +=
        portraitHTML(obj, "large") + '<div class="carnet-id"><h3 class="tag-person">' + escapeHtml(obj.name) + '</h3><p class="carnet-role">' + escapeHtml(obj.role) + "</p>" +
        (locKnown
          ? '<p class="carnet-where">On le trouve : <span class="tag-lieu tag-link" data-goto-loc="' + loc.id + '" role="button" tabindex="0">' + escapeHtml(loc.name) + "</span></p>"
          : loc ? '<p class="carnet-where carnet-dim">Adresse inconnue. Essayez le Minitel.</p>' : "") +
        (characterMet(obj) ? '<span class="carnet-stamp">Interrogé</span>' : "") + "</div>";
    } else if (ent.type === "l") {
      head +=
        optionalImageHTML("img/lieux/" + obj.id + ".jpg", "piece-photo") +
        '<div class="carnet-id"><h3 class="tag-lieu">' + escapeHtml(obj.name) + '</h3><p class="carnet-role">' + escapeHtml((quartierById(obj.quartier) || {}).name || "") + " · " +
        escapeHtml(obj.address) + "</p>" + (locationVisited(obj.id) ? '<span class="carnet-stamp">Visité</span>' : "") + "</div>";
    } else {
      head += optionalImageHTML("img/pieces/" + obj.id + ".jpg", "piece-photo") +
        '<div class="carnet-id"><h3 class="tag-doc">' + escapeHtml(obj.name) + '</h3><p class="carnet-role">Pièce du dossier</p></div>';
    }
    head += "</div>";

    const mine = facts.filter((f) => f.about === ent.key);
    let notes = '<p class="journal-recap-label">Ce que vous savez</p>';
    if (!mine.length) notes += '<p class="carnet-nothing">Rien de plus que ce nom, pour l\'instant.</p>';
    else {
      notes += '<ul class="carnet-notes">';
      mine.forEach((f) => {
        notes +=
          '<li class="carnet-note' + (f.clueId && f.clueId === state.lastReadClueId ? " fresh" : "") + (f.struck ? " struck" : "") + '">' +
          (f.label ? '<span class="carnet-label">' + escapeHtml(f.label) + "</span>" : "") +
          '<span class="carnet-text">' + renderTaggedText(f.text, { links: true, knowledge: k }) + "</span>" +
          '<span class="carnet-source">' + escapeHtml(f.source) + (f.struck ? " · contredit depuis" : "") + "</span></li>";
      });
      notes += "</ul>";
    }
    const seen = cluesMentioning(ent.key);
    if (seen.length) notes += '<p class="journal-recap-label" style="margin-top:18px">Cité dans</p><p class="carnet-seen">' + seen.map((c) => escapeHtml(clueTitle(c))).join(" · ") + "</p>";
    page.innerHTML = head + notes;

    const target = ent.type === "l" ? obj.id : ent.type === "p" ? obj.locationId : null;
    if (target && k.l.has(target)) {
      const go = document.createElement("button");
      go.className = "journal-goto";
      go.textContent = "Aller sur place";
      go.addEventListener("click", () => goToLocation(target));
      page.appendChild(go);
    }
    return page;
  }

  function renderJournalPistes(k) {
    const cs = currentCase();
    const wrap = document.createElement("div");
    wrap.innerHTML =
      '<div class="journal-recap"><p class="journal-recap-label">Rappel de l\'affaire</p>' + renderParagraphs(cs.intro, { links: true, knowledge: k }) + "</div>";
    const ids = Array.from(state.readClueIds);
    if (!ids.length) {
      const empty = document.createElement("p");
      empty.className = "briefing";
      empty.textContent = "Aucune piste consultée pour l'instant.";
      wrap.appendChild(empty);
      return wrap;
    }
    const list = document.createElement("div");
    list.className = "journal-list";
    ids.forEach((id, i) => {
      const clue = clueById(id);
      if (!clue) return;
      const loc = locationById(clue.locationId);
      const entry = document.createElement("div");
      entry.className = "journal-entry";
      entry.innerHTML =
        '<div class="journal-entry-head"><span class="journal-index">' + (i + 1) + '</span><span class="journal-loc">' + escapeHtml(loc.name) + " · " +
        (clue.type === "entretien" ? "Entretien" : "Investigation") + '</span></div><div class="clue-title">' + escapeHtml(clueTitle(clue)) + "</div>" +
        renderParagraphs(clue.text, { links: true, knowledge: k, fax: clue.fax });
      const go = document.createElement("button");
      go.className = "journal-goto";
      go.textContent = "Retourner sur place";
      go.addEventListener("click", () => goToLocation(loc.id));
      entry.appendChild(go);
      list.appendChild(entry);
    });
    wrap.appendChild(list);
    return wrap;
  }

  // ---------------- Annuaire ----------------

  function renderAnnuaire(k) {
    const card = document.createElement("div");
    card.className = "location-card";
    card.innerHTML = "<h2>Annuaire</h2>";
    const chars = currentCase().characters.filter((ch) => k.p.has(ch.id));
    const list = document.createElement("div");
    list.className = "annuaire-list";
    chars.forEach((ch) => {
      const loc = ch.locationId ? locationById(ch.locationId) : null;
      const known = loc && k.l.has(loc.id);
      const row = document.createElement("div");
      row.className = "annuaire-entry";
      row.innerHTML =
        '<span class="name tag-person">' + escapeHtml(ch.name) + '</span><span class="role">' + escapeHtml(ch.role) +
        (known ? ' · <span class="tag-lieu">' + escapeHtml(loc.name) + "</span>" : loc ? " · adresse à chercher au Minitel" : "") + "</span>";
      const fiche = document.createElement("button");
      fiche.textContent = "Fiche";
      fiche.addEventListener("click", () => openJournalEntity("p:" + ch.id));
      row.appendChild(fiche);
      if (known) {
        const go = document.createElement("button");
        go.textContent = "Aller sur place";
        go.addEventListener("click", () => goToLocation(loc.id));
        row.appendChild(go);
      }
      list.appendChild(row);
    });
    card.appendChild(list);
    return card;
  }

  // À tout moment de l'enquête, on peut revoir qui compose l'équipe du
  // Bureau (portraits, rôles) sans devoir rouvrir la note de service.
  function renderEquipe(k) {
    const P = state.data.prologue;
    const card = document.createElement("div");
    card.className = "location-card";
    card.innerHTML = "<h2>L'équipe du Bureau</h2>";
    if (!P || !P.equipe || !P.equipe.length) return card;
    const grille = document.createElement("div");
    grille.className = "equipe-grille equipe-grille-jeu";
    grille.innerHTML = P.equipe
      .map(
        (m) =>
          '<div class="equipe-fiche">' + portraitHTML({ id: m.id, name: m.nom, portrait: "img/equipe/" + m.id + ".jpg" }, "large") +
          '<div><h3>' + escapeHtml(m.nom) + '</h3><p class="equipe-role">' + escapeHtml(m.role) + "</p><p>" + escapeHtml(m.texte) + "</p></div></div>"
      )
      .join("");
    card.appendChild(grille);
    return card;
  }

  // ---------------------------------------------------------------
  // Questionnaire et fin
  // ---------------------------------------------------------------

  // ---------------------------------------------------------------
  // L'article à trous : le joueur écrit la page du samedi avec les mots
  // qu'il a trouvés. Jean-Loup relit (trois essais au plus), puis
  // l'article part à l'imprimerie.
  // ---------------------------------------------------------------

  const TYPE_NOM = { p: "personne", l: "lieu", d: "pièce", a: "action" };
  const TYPE_CLASS = { p: "tag-person", l: "tag-lieu", d: "tag-doc", a: "tag-action" };

  function articleBlanks(cs) {
    const out = [];
    (cs.article || []).forEach((par) => par.parts.forEach((x) => typeof x === "object" && out.push(Object.assign({ par: par }, x))));
    return out;
  }

  // Le nom d'un mot dans la liste
  function wordLabel(type, id) {
    if (type === "p") { const c = characterById(id); return c ? c.label || c.name : id; }
    if (type === "l") { const l = locationById(id); return l ? l.name : id; }
    if (type === "d") { const d = documentById(id); return d ? d.name : id; }
    const a = actionById(id);
    return a ? a.name : id;
  }

  // Le même mot, tel qu'il s'écrit au milieu d'une phrase de l'article
  function wordInText(type, id) {
    if (type === "l") { const l = locationById(id); return l ? l.inArticle || l.name : id; }
    const w = wordLabel(type, id);
    if (type === "d" && !/^[A-Z]{2}/.test(w)) return w.charAt(0).toLowerCase() + w.slice(1);
    return w;
  }

  function knownWords(k, type) {
    return Array.from(k[type])
      .map((id) => ({ id: id, label: wordLabel(type, id) }))
      .sort((a, b) => a.label.localeCompare(b.label, "fr"));
  }

  const isRight = (answers, b) => answers[b.id] === b.type + ":" + b.answer;

  function renderQuestionnaire() {
    const cs = currentCase();
    const k = computeKnowledge();
    const blanks = articleBlanks(cs);
    const factors = cs.attemptFactors || [1, 0.8, 0.6];
    if (!state.activeBlank || !blanks.some((b) => b.id === state.activeBlank)) {
      const first = blanks.find((b) => !state.answers[b.id]) || blanks[0];
      state.activeBlank = first ? first.id : null;
    }
    const active = blanks.find((b) => b.id === state.activeBlank);
    const rv = state.review || {};
    const wrongPars = new Set(rv.pars || []);
    const wrongBlanks = new Set(rv.blanks || []);
    const attempt = state.attempts + 1;

    const wrap = document.createElement("div");
    const panel = document.createElement("div");
    panel.className = "intervention-panel article-redac";
    panel.innerHTML =
      "<h2>Rédiger l'article</h2><p>Le bouclage approche. Paul tape l'article ; à vous de remplir les blancs avec ce que l'enquête a trouvé. " +
      "Chaque couleur attend un type de mot. Touchez un blanc, puis un mot. Jean-Loup relit avant l'imprimerie : trois passages au plus, " +
      "et moins il en faut, plus l'article rapporte (" + factors.map((f) => Math.round(f * 100) + " %").join(", ") + "). " +
      "Vous avez lu " + leadsUsed() + " piste" + (leadsUsed() > 1 ? "s" : "") + " ; chaque piste au-delà de " + cs.referenceLeads + " coûte " + cs.penaltyPerExtraLead + " points.</p>" +
      '<div class="tag-legend article-legende"><span class="tag-person">Personne</span><span class="tag-lieu">Lieu</span><span class="tag-doc">Pièce</span><span class="tag-action">Action</span></div>';

    if (rv.message) {
      const note = document.createElement("div");
      note.className = "relecture";
      note.innerHTML = '<p class="relecture-qui">Relecture de Jean-Loup · passage ' + state.attempts + " sur 3</p><p>" + escapeHtml(rv.message) + "</p>";
      panel.appendChild(note);
    }

    // La copie
    const copy = document.createElement("div");
    copy.className = "copie";
    copy.innerHTML = '<p class="copie-rubrique">Les Affaires occultes · brouillon</p>';
    (cs.article || []).forEach((par) => {
      const p = document.createElement("p");
      p.className = "copie-par" + (wrongPars.has(par.id) ? " copie-par-faux" : "") + (par.bonus ? " copie-par-bonus" : "");
      let html = par.bonus ? '<span class="copie-bonus">Bonus</span> ' : "";
      par.parts.forEach((x) => {
        if (typeof x === "string") { html += escapeHtml(x); return; }
        const val = state.answers[x.id];
        const cls = "trou trou-" + x.type + (val ? " trou-rempli" : "") + (x.id === state.activeBlank ? " trou-actif" : "") + (wrongBlanks.has(x.id) ? " trou-faux" : "");
        const txt = val ? wordInText(val.split(":")[0], val.slice(2)) : TYPE_NOM[x.type];
        html += '<button type="button" class="' + cls + '" data-blank="' + x.id + '" aria-label="Blanc : ' + TYPE_NOM[x.type] + '">' + escapeHtml(txt) + "</button>";
      });
      if (wrongPars.has(par.id)) html += ' <span class="copie-marge">ne tient pas</span>';
      p.innerHTML = html;
      copy.appendChild(p);
    });
    copy.querySelectorAll("[data-blank]").forEach((b) =>
      b.addEventListener("click", () => {
        state.activeBlank = b.getAttribute("data-blank");
        A.play("interface/page");
        render();
      })
    );
    panel.appendChild(copy);

    // Les mots trouvés, pour le blanc sélectionné
    if (active) {
      const bank = document.createElement("div");
      bank.className = "banque banque-" + active.type;
      const words = knownWords(k, active.type);
      bank.innerHTML =
        '<p class="banque-titre">Mots trouvés · <span class="' + TYPE_CLASS[active.type] + '">' + TYPE_NOM[active.type] + "s</span>" +
        (words.length ? "" : " : aucun pour l'instant") + "</p>";
      const list = document.createElement("div");
      list.className = "banque-mots";
      words.forEach((w) => {
        const key = active.type + ":" + w.id;
        const b = document.createElement("button");
        b.type = "button";
        b.className = "mot mot-" + active.type + (state.answers[active.id] === key ? " mot-pose" : "");
        b.textContent = w.label;
        b.addEventListener("click", () => {
          state.answers[active.id] = key;
          if (state.review && state.review.blanks) state.review.blanks = state.review.blanks.filter((x) => x !== active.id);
          A.play("interface/crayon-note");
          const next = blanks.find((x) => !state.answers[x.id]);
          state.activeBlank = next ? next.id : active.id;
          saveGame();
          render();
        });
        list.appendChild(b);
      });
      if (state.answers[active.id]) {
        const clear = document.createElement("button");
        clear.type = "button";
        clear.className = "mot mot-retirer";
        clear.textContent = "Effacer ce blanc";
        clear.addEventListener("click", () => {
          delete state.answers[active.id];
          A.play("interface/rature");
          saveGame();
          render();
        });
        list.appendChild(clear);
      }
      bank.appendChild(list);
      panel.appendChild(bank);
    }

    // Les boutons
    const missing = blanks.filter((b) => !state.answers[b.id]).length;
    const row = document.createElement("div");
    row.className = "btn-row";
    const submit = document.createElement("button");
    submit.className = "confirm-btn";
    submit.disabled = missing > 0;
    submit.textContent = missing
      ? "Encore " + missing + " blanc" + (missing > 1 ? "s" : "") + " à remplir"
      : attempt >= 3 ? "Dernier passage : envoyer à l'imprimerie" : "Faire relire par Jean-Loup (passage " + attempt + " sur 3)";
    submit.addEventListener("click", () => {
      if (attempt >= 3 && !window.confirm("Dernier passage : l'article part à l'imprimerie tel quel. On y va ?")) return;
      submitArticle();
    });
    row.appendChild(submit);
    if (state.lastSubmitted && state.attempts > 0) {
      const keep = document.createElement("button");
      keep.className = "end-early-btn";
      keep.style.width = "auto";
      keep.style.marginTop = "0";
      keep.textContent = "Envoyer la version déjà relue (" + Math.round(factors[state.attempts - 1] * 100) + " % des points)";
      keep.addEventListener("click", () => {
        if (!window.confirm("Envoyer la version relue au passage " + state.attempts + ", sans vos corrections depuis ?")) return;
        publishArticle(state.lastSubmitted, state.attempts);
      });
      row.appendChild(keep);
    }
    const back = document.createElement("button");
    back.className = "end-early-btn";
    back.style.width = "auto";
    back.style.marginTop = "0";
    back.textContent = "← Reprendre l'enquête";
    back.addEventListener("click", () => {
      state.view = "quartier";
      render();
    });
    row.appendChild(back);
    const carnet = document.createElement("button");
    carnet.className = "end-early-btn";
    carnet.style.width = "auto";
    carnet.style.marginTop = "0";
    carnet.textContent = "Ouvrir le carnet";
    carnet.addEventListener("click", () => {
      state.view = "journal";
      render();
    });
    row.appendChild(carnet);
    panel.appendChild(row);
    wrap.appendChild(panel);
    return wrap;
  }

  // Un passage chez Jean-Loup
  function submitArticle() {
    const cs = currentCase();
    const blanks = articleBlanks(cs);
    const attempt = state.attempts + 1;
    const wrong = blanks.filter((b) => !b.par.bonus && !isRight(state.answers, b));
    state.lastSubmitted = Object.assign({}, state.answers);
    if (!wrong.length || attempt >= 3) {
      state.attempts = attempt;
      publishArticle(state.answers, attempt);
      return;
    }
    state.attempts = attempt;
    const pars = Array.from(new Set(wrong.map((b) => b.par.id)));
    state.review = {
      message: attempt === 1 ? (pars.length > 1 && cs.review.essai1_pluriel) || cs.review.essai1 : cs.review.essai2,
      pars: pars,
      blanks: attempt >= 2 ? wrong.map((b) => b.id) : []
    };
    A.play("interface/rature");
    saveGame();
    render();
    window.scrollTo(0, 0);
  }

  // L'article part à l'imprimerie : score et fin
  function publishArticle(answers, attempt) {
    const cs = currentCase();
    const blanks = articleBlanks(cs);
    const factor = (cs.attemptFactors || [1, 0.8, 0.6])[Math.max(0, attempt - 1)] || 0.6;
    const right = {};
    let points = 0;
    blanks.forEach((b) => {
      const ok = isRight(answers, b);
      if (right[b.q] === undefined) right[b.q] = true;
      if (!ok) right[b.q] = false;
      if (ok) points += b.points;
    });
    points = Math.round(points * factor);
    const extra = Math.max(0, leadsUsed() - cs.referenceLeads);
    const penalty = extra * cs.penaltyPerExtraLead;
    const total = Math.max(0, points - penalty);
    const rank = (cs.ranks.find((r) => total >= r.min) || cs.ranks[cs.ranks.length - 1]).label;
    const ending = cs.endings.find((e) => Object.keys(e.when).every((q) => right[q] === e.when[q])) || cs.endings[cs.endings.length - 1];
    const allRight = blanks.every((b) => b.par.bonus || isRight(answers, b));
    state.ending = {
      endingId: ending.id, right: right, answers: Object.assign({}, answers), points: points, penalty: penalty, total: total, rank: rank,
      leads: leadsUsed(), attempt: attempt, factor: factor, review: allRight ? cs.review.juste : attempt >= 3 ? cs.review.essai3 : ""
    };
    recordCaseCompletion(state.currentCityId, state.currentCaseId, total, rank);
    clearSavedGame(state.currentCityId, state.currentCaseId);
    state.view = "ending";
    A.play("interface/tampon");
    A.play("interface/page-journal", 400);
    render();
    window.scrollTo(0, 0);
  }

  // Le bilan de l'article, paragraphe par paragraphe (écran de fin)
  function articleReportHTML(cs, e) {
    return (cs.article || [])
      .map((par) => {
        let ok = true;
        let pts = 0;
        let html = "";
        par.parts.forEach((x) => {
          if (typeof x === "string") { html += escapeHtml(x); return; }
          const val = e.answers[x.id];
          const good = val === x.type + ":" + x.answer;
          if (good) pts += x.points;
          else ok = false;
          const rightTxt = wordInText(x.type, x.answer);
          html += good
            ? '<span class="' + TYPE_CLASS[x.type] + '">' + escapeHtml(rightTxt) + "</span>"
            : '<s class="bilan-faux">' + escapeHtml(val ? wordInText(val.split(":")[0], val.slice(2)) : "…") + '</s> <span class="' + TYPE_CLASS[x.type] + '">' + escapeHtml(rightTxt) + "</span>";
        });
        return (
          '<li class="' + (ok ? "ok" : "ko") + '"><span class="score-mark">' + (ok ? "✔" : "✘") + "</span><span><strong>" + escapeHtml(par.title) +
          (par.bonus ? " (bonus)" : "") + "</strong><br><small class=\"bilan-texte\">" + html + '</small></span><span class="score-pts">+' + Math.round(pts * e.factor) + "</span></li>"
        );
      })
      .join("");
  }

  function renderEnding() {
    const cs = currentCase();
    const e = state.ending;
    const ending = byId(cs.endings, e.endingId);
    const wrap = document.createElement("div");

    const paper = document.createElement("article");
    paper.className = "une";
    const complements = ["Q4", "Q5", "Q6"]
      .filter((q) => cs.complements && cs.complements[q])
      .map((q) => "<p>" + escapeHtml(e.right[q] ? cs.complements[q].right : cs.complements[q].wrong) + "</p>")
      .join("");
    paper.innerHTML =
      '<header class="une-head"><div class="une-title">Le Stéphanois</div><div class="une-meta"><span>Samedi 27 novembre 1993</span><span>4,50 F</span></div></header>' +
      '<p class="une-rubrique">Les Affaires occultes · ' + escapeHtml(ending.title) + "</p>" +
      '<h2 class="une-headline">' + escapeHtml(ending.headline) + "</h2>" +
      '<p class="une-byline">Par le Bureau des affaires occultes · Photos Yves Barral</p>' +
      '<div class="une-body">' + renderParagraphs(ending.text) + complements + "</div>";
    wrap.appendChild(paper);

    if (e.review) {
      const jl = document.createElement("p");
      jl.className = "relecture relecture-fin";
      jl.textContent = e.review;
      wrap.insertBefore(jl, paper);
    }

    const score = document.createElement("div");
    score.className = "score-card";
    score.innerHTML =
      "<h3>Votre article</h3>" +
      '<ul class="score-list">' + articleReportHTML(cs, e) +
      "</ul>" +
      (e.attempt ? '<p class="score-line">Envoyé au passage ' + e.attempt + " sur 3 : " + Math.round(e.factor * 100) + " % des points</p>" : "") +
      '<p class="score-line">Pistes lues : ' + e.leads + " (référence : " + cs.referenceLeads + ")" + (e.penalty ? " · pénalité −" + e.penalty : "") + "</p>" +
      '<p class="score-total">' + e.total + " / " + maxScore(cs) + ' <span class="score-rank">' + escapeHtml(e.rank) + "</span></p>" +
      '<details class="solution"><summary>Ce qui s\'est vraiment passé</summary><p>' + escapeHtml(cs.solution || "") + "</p><p class='solution-path'>Le chemin le plus court : " +
      (cs.referencePath || []).map((id) => { const c = clueById(id); return escapeHtml(c.follows && c.titleAlone && !cs.referencePath.includes(c.follows) ? c.titleAlone : c.title); }).join(" → ") + "</p></details>";
    wrap.appendChild(score);

    if (cs.epilogue) {
      const epi = document.createElement("div");
      epi.className = "epilogue";
      epi.innerHTML =
        '<div class="epilogue-card" aria-hidden="true"><img src="img/salamandre.png" alt="" data-remove-on-error><svg viewBox="0 0 60 84" width="52" height="72">' +
        '<path d="M14 72 C20 62 22 66 26 58 C30 66 34 62 30 74 C38 66 44 70 44 76 L14 76 Z" fill="#B98B2A" opacity="0.8"/>' +
        '<path d="M30 10 C40 14 38 26 30 30 C22 34 20 44 30 48 C40 52 40 60 32 64" fill="none" stroke="#2A2620" stroke-width="5" stroke-linecap="round"/>' +
        '<circle cx="29" cy="9" r="4.5" fill="#2A2620"/>' +
        '<path d="M35 20 l8 -4 M25 22 l-8 -3 M33 42 l8 3 M24 40 l-8 4" stroke="#2A2620" stroke-width="3" stroke-linecap="round"/>' +
        '</svg></div>' + renderParagraphs(cs.epilogue);
      wrap.appendChild(epi);
      setTimeout(() => A.play("musiques/salamandre"), 2500);
    }

    const row = document.createElement("div");
    row.className = "btn-row";
    const back = document.createElement("button");
    back.className = "restart-btn";
    back.textContent = "Retour aux affaires";
    back.addEventListener("click", () => {
      state.view = "caseSelect";
      render();
    });
    const again = document.createElement("button");
    again.className = "restart-btn";
    again.textContent = "Retenter cette affaire";
    again.addEventListener("click", () => {
      resetCaseState();
      state.started = false;
      state.savedGame = null;
      state.view = "intro";
      render();
    });
    row.appendChild(back);
    row.appendChild(again);
    wrap.appendChild(row);
    return wrap;
  }

  // ---------------------------------------------------------------
  // Fiche de l'enquêteur
  // ---------------------------------------------------------------

  function renderProfile() {
    const wrap = document.createElement("div");
    const backBtn = document.createElement("button");
    backBtn.className = "end-early-btn back-btn";
    backBtn.textContent = "← Retour";
    backBtn.addEventListener("click", () => {
      state.view = state.previousView || "menu";
      render();
    });
    wrap.appendChild(backBtn);

    const card = document.createElement("div");
    card.className = "profile-card";
    const header = document.createElement("div");
    header.className = "profile-header";
    const big = document.createElement("div");
    big.className = "profile-avatar";
    big.innerHTML = buildAvatarSVG(120);
    header.appendChild(big);

    const idBlock = document.createElement("div");
    idBlock.className = "profile-id-block";
    const nameInput = document.createElement("input");
    nameInput.type = "text";
    nameInput.className = "profile-name-input";
    nameInput.placeholder = "Nom de l'enquêteur";
    nameInput.value = state.progress.playerName || "";
    nameInput.maxLength = 40;
    nameInput.addEventListener("change", () => {
      setPlayerName(nameInput.value);
      render();
    });
    idBlock.appendChild(nameInput);
    const rankTag = document.createElement("p");
    rankTag.className = "profile-rank";
    rankTag.textContent = currentRank() + " · Bureau des affaires occultes";
    idBlock.appendChild(rankTag);
    const swatches = document.createElement("div");
    swatches.className = "avatar-swatches";
    [
      { id: "red", label: "Rouge tampon" },
      { id: "gold", label: "Or vieilli" },
      { id: "steel", label: "Vert acier" }
    ].forEach((opt) => {
      const sw = document.createElement("button");
      sw.className = "avatar-swatch avatar-swatch-" + opt.id + (state.progress.avatarAccent === opt.id ? " selected" : "");
      sw.title = opt.label;
      sw.setAttribute("aria-label", "Choisir la couleur : " + opt.label);
      sw.addEventListener("click", () => {
        setAvatarAccent(opt.id);
        render();
      });
      swatches.appendChild(sw);
    });
    idBlock.appendChild(swatches);
    header.appendChild(idBlock);
    card.appendChild(header);

    const entries = existingCaseEntries();
    const best = entries.length ? Math.max.apply(null, entries.map((e) => e.bestScore)) : null;
    const stats = document.createElement("div");
    stats.className = "profile-stats-grid";
    [
      { label: "Points de carrière", value: careerPoints() },
      { label: "Affaires résolues", value: entries.length + " / " + totalCasesAvailable() },
      { label: "Meilleur score", value: best === null ? "N/A" : best }
    ].forEach((s) => {
      const box = document.createElement("div");
      box.className = "profile-stat";
      box.innerHTML = '<span class="profile-stat-value">' + s.value + '</span><span class="profile-stat-label">' + s.label + "</span>";
      stats.appendChild(box);
    });
    card.appendChild(stats);

    const bh = document.createElement("h3");
    bh.className = "profile-section-heading";
    bh.textContent = "Distinctions";
    card.appendChild(bh);
    const badges = computeBadges();
    if (!badges.length) {
      const p = document.createElement("p");
      p.className = "briefing";
      p.textContent = "Aucune distinction pour l'instant. Terminez une première affaire pour commencer à en gagner.";
      card.appendChild(p);
    } else {
      const bl = document.createElement("div");
      bl.className = "profile-badge-list";
      badges.forEach((b) => {
        const el = document.createElement("div");
        el.className = "profile-badge";
        el.innerHTML = '<span class="profile-badge-label">🏅 ' + b.label + '</span><span class="profile-badge-detail">' + b.detail + "</span>";
        bl.appendChild(el);
      });
      card.appendChild(bl);
    }
    wrap.appendChild(card);
    return wrap;
  }

  function renderFootnote() {
    const el = document.createElement("div");
    el.className = "footnote";
    el.textContent = "Enquête fictive. Personnages, entreprises et faits sont imaginaires.";
    return el;
  }

  function initOrientationHint() {
    try {
      if (sessionStorage.getItem("orientationHintDismissed") === "1") document.body.classList.add("orientation-hint-dismissed");
    } catch (e) {}
    const btn = document.getElementById("orientation-hint-dismiss");
    if (btn)
      btn.addEventListener("click", () => {
        try {
          sessionStorage.setItem("orientationHintDismissed", "1");
        } catch (e) {}
        document.body.classList.add("orientation-hint-dismissed");
      });
  }

  initOrientationHint();
  init();
})();
