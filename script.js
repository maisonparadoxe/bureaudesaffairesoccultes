(function () {
  "use strict";

  const app = document.getElementById("app");
  const SAVE_PREFIX = "stephanois-save-"; // + cityId + "-" + caseId, per-case in-progress save
  const PROGRESS_KEY = "stephanois-progress-v1"; // global: completed cases + career points

  const state = {
    data: null, // { gameTitle, cities: [...] }
    progress: null, // { completedCases: { "cityId:caseId": { completed, bestScore } } }
    view: "citySelect",
    previousView: "citySelect",
    currentCityId: null,
    currentCaseId: null,
    leadsRemaining: 0,
    readClueIds: new Set(),
    started: false,
    savedGame: null,
    selectedQuartier: null,
    selectedLocationId: null,
    interventionSelection: [],
    lastResult: null,
    ending: null
  };

  // ---------------------------------------------------------------
  // Helpers: data lookup
  // ---------------------------------------------------------------

  function getCity(cityId) {
    return state.data.cities.find((c) => c.id === cityId);
  }

  function getCase(cityId, caseId) {
    const city = getCity(cityId);
    if (!city) return null;
    return city.cases.find((c) => c.id === caseId);
  }

  function currentCity() {
    return getCity(state.currentCityId);
  }

  function currentCase() {
    return getCase(state.currentCityId, state.currentCaseId);
  }

  function caseKey(cityId, caseId) {
    return cityId + ":" + caseId;
  }

  function byId(list, id) {
    return list.find((x) => x.id === id);
  }

  function locationById(id) {
    return byId(currentCase().locations, id);
  }

  function quartierById(id) {
    return byId(currentCase().quartiers, id);
  }

  function characterById(id) {
    return byId(currentCase().characters, id);
  }

  function cluesForLocation(locationId) {
    return currentCase().clues.filter((c) => c.locationId === locationId);
  }

  function clueFor(locationId, type) {
    return currentCase().clues.find(
      (c) => c.locationId === locationId && c.type === type
    );
  }

  // ---------------------------------------------------------------
  // Progress (career points + completed cases), persists across all
  // cities/cases. Separate from the per-case "in progress" save.
  // ---------------------------------------------------------------

  function defaultProgress() {
    return { completedCases: {}, playerName: null, avatarAccent: "red" };
  }

  function loadProgress() {
    try {
      const raw = localStorage.getItem(PROGRESS_KEY);
      if (!raw) return defaultProgress();
      const parsed = JSON.parse(raw);
      return Object.assign(defaultProgress(), parsed);
    } catch (e) {
      return defaultProgress();
    }
  }

  function saveProgress() {
    try {
      localStorage.setItem(PROGRESS_KEY, JSON.stringify(state.progress));
    } catch (e) {
      // ignore (private browsing, etc.)
    }
  }

  function recordCaseCompletion(cityId, caseId, points) {
    const key = caseKey(cityId, caseId);
    const existing = state.progress.completedCases[key];
    const bestScore = existing ? Math.max(existing.bestScore, points) : points;
    state.progress.completedCases[key] = { completed: true, bestScore: bestScore };
    saveProgress();
  }

  function careerPoints() {
    let total = 0;
    Object.values(state.progress.completedCases).forEach((entry) => {
      total += entry.bestScore;
    });
    return total;
  }

  function isCaseUnlocked(city, index) {
    if (index === 0) return true;
    const prevCase = city.cases[index - 1];
    const key = caseKey(city.id, prevCase.id);
    const entry = state.progress.completedCases[key];
    return !!(entry && entry.completed);
  }

  function cityCompletedCount(city) {
    return city.cases.filter((cs) => {
      const entry = state.progress.completedCases[caseKey(city.id, cs.id)];
      return entry && entry.completed;
    }).length;
  }

  // ---------------------------------------------------------------
  // Fiche de l'enquêteur (rang, statistiques, badges)
  // ---------------------------------------------------------------

  const RANKS = [
    { min: 0, title: "Stagiaire" },
    { min: 7, title: "Journaliste" },
    { min: 14, title: "Journaliste confirmé" },
    { min: 21, title: "Grand reporter" },
    { min: 28, title: "Rédacteur en chef" }
  ];

  function currentRank() {
    const pts = careerPoints();
    let rank = RANKS[0];
    RANKS.forEach((r) => {
      if (pts >= r.min) rank = r;
    });
    return rank.title;
  }

  function totalCasesCompleted() {
    return Object.values(state.progress.completedCases).filter((e) => e.completed)
      .length;
  }

  function totalCasesAvailable() {
    let total = 0;
    state.data.cities.forEach((city) => {
      if (city.status === "available") total += city.cases.length;
    });
    return total;
  }

  function bestScoreEver() {
    let best = null;
    Object.values(state.progress.completedCases).forEach((e) => {
      if (best === null || e.bestScore > best) best = e.bestScore;
    });
    return best;
  }

  function computeBadges() {
    const badges = [];
    const completed = totalCasesCompleted();
    const best = bestScoreEver();
    if (completed >= 1) {
      badges.push({ label: "Premier article publié", detail: "Une affaire menée jusqu'au bout." });
    }
    if (best !== null && best === 7) {
      badges.push({ label: "Réussite majeure", detail: "Une enquête résolue à la perfection (7/7)." });
    }
    if (completed >= 2) {
      badges.push({ label: "Plume assidue", detail: "Deux affaires ou plus menées à terme." });
    }
    const availableCities = state.data.cities.filter((c) => c.status === "available");
    const allDone = availableCities.every(
      (c) => c.cases.length > 0 && cityCompletedCount(c) === c.cases.length
    );
    if (allDone && availableCities.length > 0) {
      badges.push({ label: "Ville bouclée", detail: "Toutes les affaires disponibles d'une ville résolues." });
    }
    return badges;
  }

  function playerName() {
    return state.progress.playerName || "Enquêteur anonyme";
  }

  function setPlayerName(name) {
    state.progress.playerName = name.trim() ? name.trim() : null;
    saveProgress();
  }

  function setAvatarAccent(accent) {
    state.progress.avatarAccent = accent;
    saveProgress();
  }

  // Stylized press-badge avatar (a generic illustrated silhouette
  // (not a real person), recolored via the chosen accent.
  function buildAvatarSVG(size) {
    const accent = (state.progress && state.progress.avatarAccent) || "red";
    return (
      '<svg viewBox="0 0 100 100" width="' +
      size +
      '" height="' +
      size +
      '" xmlns="http://www.w3.org/2000/svg" class="avatar-svg avatar-accent-' +
      accent +
      '">' +
      '<circle cx="50" cy="50" r="48" class="avatar-badge-bg"/>' +
      '<path d="M20 88 C20 66 34 58 50 58 C66 58 80 66 80 88 Z" class="avatar-coat"/>' +
      '<circle cx="50" cy="42" r="17" class="avatar-head"/>' +
      '<path d="M31 36 C31 24 69 24 69 36 L69 32 C60 26 40 26 31 32 Z" class="avatar-band"/>' +
      '<path d="M28 33 L72 33 L66 26 L34 26 Z" class="avatar-band"/>' +
      '<rect x="46" y="70" width="8" height="14" rx="1" class="avatar-tie"/>' +
      "</svg>"
    );
  }

  // ---------------------------------------------------------------
  // Per-case in-progress save (leads used, clues read, etc.)
  // ---------------------------------------------------------------

  function saveGame() {
    if (!state.started) return;
    try {
      const payload = {
        savedAt: new Date().toISOString(),
        leadsRemaining: state.leadsRemaining,
        readClueIds: Array.from(state.readClueIds),
        selectedQuartier: state.selectedQuartier,
        selectedLocationId: state.selectedLocationId,
        interventionSelection: state.interventionSelection,
        view: state.view === "intro" ? "quartier" : state.view,
        ending: state.ending
      };
      localStorage.setItem(
        SAVE_PREFIX + state.currentCityId + "-" + state.currentCaseId,
        JSON.stringify(payload)
      );
    } catch (e) {
      // ignore
    }
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
    } catch (e) {
      // ignore
    }
  }

  function resumeSavedGame() {
    const saved = state.savedGame;
    if (!saved) return;
    state.started = true;
    state.leadsRemaining = saved.leadsRemaining;
    state.readClueIds = new Set(saved.readClueIds || []);
    state.selectedQuartier =
      saved.selectedQuartier || currentCase().quartiers[0].id;
    state.selectedLocationId = saved.selectedLocationId || null;
    state.interventionSelection = saved.interventionSelection || [];
    state.ending = saved.ending || null;
    state.view = state.ending ? "ending" : saved.view || "quartier";
    state.lastResult = null;
    render();
  }

  // ---------------------------------------------------------------
  // Text tagging: {{p:...}} person, {{l:...}} lieu, {{d:...}} document
  // ---------------------------------------------------------------

  function escapeHtml(str) {
    return str
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");
  }

  const TAG_CLASS = { p: "tag-person", l: "tag-lieu", d: "tag-doc" };

  function renderTaggedText(text) {
    const escaped = escapeHtml(text);
    return escaped.replace(/\{\{(p|l|d):([^}]+)\}\}/g, (match, type, content) => {
      return '<span class="' + TAG_CLASS[type] + '">' + content + "</span>";
    });
  }

  // ---------------------------------------------------------------
  // Character reveal logic (annuaire fills in progressively)
  // ---------------------------------------------------------------

  function revealedCharacterIds() {
    const revealed = new Set();
    currentCase().characters.forEach((ch) => {
      if (ch.alwaysRevealed) revealed.add(ch.id);
    });
    currentCase().clues.forEach((clue) => {
      if (state.readClueIds.has(clue.id) && clue.revealsCharacters) {
        clue.revealsCharacters.forEach((id) => revealed.add(id));
      }
    });
    return revealed;
  }

  // ---------------------------------------------------------------
  // Data loading
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
    loadData()
      .then((data) => {
        state.data = data;
        state.progress = loadProgress();
        render();
      })
      .catch((err) => {
        app.innerHTML =
          '<p style="font-family:monospace;padding:40px;">Erreur de chargement des données : ' +
          err.message +
          "</p>";
      });
  }

  // ---------------------------------------------------------------
  // Rendering — top level dispatch
  // ---------------------------------------------------------------

  function render() {
    if (state.started && state.view !== "citySelect" && state.view !== "caseSelect") {
      saveGame();
    }

    app.innerHTML = "";
    app.appendChild(renderMasthead());

    if (state.view === "citySelect") {
      app.appendChild(renderCitySelect());
    } else if (state.view === "caseSelect") {
      app.appendChild(renderCaseSelect());
    } else if (state.view === "intro") {
      app.appendChild(renderIntro());
    } else if (state.view === "intervention") {
      app.appendChild(renderIntervention());
    } else if (state.view === "ending") {
      app.appendChild(renderEnding());
    } else if (state.view === "profile") {
      app.appendChild(renderProfile());
    } else {
      app.appendChild(renderMainGrid());
    }

    app.appendChild(renderFootnote());
  }

  function renderMasthead() {
    const el = document.createElement("div");
    el.className = "masthead";

    const titles = document.createElement("div");
    titles.className = "masthead-titles";

    if (state.view === "citySelect" || state.view === "caseSelect" || state.view === "profile") {
      titles.innerHTML =
        '<p class="kicker">Le Stéphanois, dossiers d\'enquête</p><h1>' +
        (state.view === "caseSelect"
          ? currentCity().name
          : state.view === "profile"
          ? "Fiche de l'enquêteur"
          : state.data.gameTitle) +
        "</h1>";
    } else {
      const cs = currentCase();
      titles.innerHTML =
        '<p class="kicker">' +
        currentCity().name +
        ", " +
        cs.year +
        '</p><h1>' +
        cs.title +
        '</h1><p class="subtitle">' +
        cs.subtitle +
        "</p>";
    }
    el.appendChild(titles);

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
      el.appendChild(profileBtn);
    }

    if (state.view === "citySelect") {
      const pts = document.createElement("div");
      pts.className = "lead-counter career";
      pts.innerHTML =
        '<span class="num">' +
        careerPoints() +
        '</span><span class="label">points de carrière</span>';
      el.appendChild(pts);
    } else if (state.started && state.view !== "caseSelect" && state.view !== "profile") {
      const low = state.leadsRemaining <= 3;
      const counter = document.createElement("div");
      counter.className = "lead-counter" + (low ? " low" : "");
      counter.innerHTML =
        '<span class="num">' +
        state.leadsRemaining +
        '</span><span class="label">pistes restantes</span>';
      el.appendChild(counter);
    }

    return el;
  }

  // ---------------------------------------------------------------
  // City select screen
  // ---------------------------------------------------------------

  function renderCitySelect() {
    const wrap = document.createElement("div");

    const intro = document.createElement("p");
    intro.className = "select-intro";
    intro.textContent =
      "Choisissez une ville pour consulter les affaires qui vous y attendent. De nouvelles villes s'ouvriront au fil de votre carrière de journaliste.";
    wrap.appendChild(intro);

    const grid = document.createElement("div");
    grid.className = "city-grid";

    state.data.cities.forEach((city) => {
      const card = document.createElement("button");
      const available = city.status === "available";
      card.className = "city-card" + (available ? "" : " locked");

      if (available) {
        const done = cityCompletedCount(city);
        const total = city.cases.length;
        card.innerHTML =
          '<span class="city-name">' +
          city.name +
          '</span><span class="city-status">' +
          done +
          "/" +
          total +
          " affaire" +
          (total > 1 ? "s" : "") +
          " terminée" +
          (done > 1 ? "s" : "") +
          "</span>";
        card.addEventListener("click", () => {
          state.currentCityId = city.id;
          state.view = "caseSelect";
          render();
        });
      } else {
        card.innerHTML =
          '<span class="city-name">' +
          city.name +
          '</span><span class="city-status locked-tag">🔒 Bientôt disponible</span>';
        card.disabled = true;
      }
      grid.appendChild(card);
    });

    wrap.appendChild(grid);
    return wrap;
  }

  // ---------------------------------------------------------------
  // Case select screen
  // ---------------------------------------------------------------

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

      let statusText = "À découvrir";
      if (entry && entry.completed) {
        statusText = "Terminée : meilleur score " + entry.bestScore + "/7";
      } else if (!unlocked) {
        statusText = "🔒 Terminez l'affaire précédente pour débloquer";
      }

      card.innerHTML =
        '<span class="case-title">' +
        cs.title +
        '</span><span class="case-subtitle">' +
        cs.subtitle +
        '</span><span class="case-status">' +
        statusText +
        "</span>";

      if (unlocked) {
        card.addEventListener("click", () => {
          openCase(city.id, cs.id);
        });
      } else {
        card.disabled = true;
      }
      list.appendChild(card);
    });

    wrap.appendChild(list);
    return wrap;
  }

  function openCase(cityId, caseId) {
    state.currentCityId = cityId;
    state.currentCaseId = caseId;
    const cs = getCase(cityId, caseId);
    state.leadsRemaining = cs.totalLeads;
    state.readClueIds = new Set();
    state.started = false;
    state.selectedQuartier = null;
    state.selectedLocationId = null;
    state.interventionSelection = [];
    state.lastResult = null;
    state.ending = null;
    state.savedGame = loadSavedGame(cityId, caseId);
    state.view = "intro";
    render();
  }

  // ---------------------------------------------------------------
  // Intro screen
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
      "<h2>Dossier ouvert</h2><p>" +
      cs.intro +
      '</p><p class="briefing">' +
      cs.briefing +
      "</p>";

    const btnRow = document.createElement("div");
    btnRow.style.display = "flex";
    btnRow.style.gap = "12px";
    btnRow.style.flexWrap = "wrap";

    if (state.savedGame) {
      const resumeBtn = document.createElement("button");
      resumeBtn.className = "start-btn";
      const savedDate = new Date(state.savedGame.savedAt);
      resumeBtn.textContent =
        "Reprendre l'enquête (" +
        (cs.totalLeads - state.savedGame.leadsRemaining) +
        " pistes déjà lues)";
      resumeBtn.addEventListener("click", resumeSavedGame);
      btnRow.appendChild(resumeBtn);

      const noteEl = document.createElement("p");
      noteEl.className = "briefing";
      noteEl.style.marginTop = "10px";
      noteEl.textContent =
        "Dernière sauvegarde : " +
        savedDate.toLocaleDateString("fr-FR") +
        " à " +
        savedDate.toLocaleTimeString("fr-FR");
      card.appendChild(noteEl);
    }

    const btn = document.createElement("button");
    btn.className = state.savedGame ? "end-early-btn" : "start-btn";
    btn.textContent = state.savedGame
      ? "Nouvelle tentative (efface la sauvegarde)"
      : "Commencer l'enquête";
    btn.addEventListener("click", () => {
      clearSavedGame(state.currentCityId, state.currentCaseId);
      state.savedGame = null;
      state.leadsRemaining = cs.totalLeads;
      state.readClueIds = new Set();
      state.started = true;
      state.view = "quartier";
      state.selectedQuartier = cs.quartiers[0].id;
      state.selectedLocationId = null;
      state.interventionSelection = [];
      state.lastResult = null;
      state.ending = null;
      render();
    });
    btnRow.appendChild(btn);
    card.appendChild(btnRow);
    wrap.appendChild(card);
    return wrap;
  }

  // ---------------------------------------------------------------
  // Main investigation grid (map + sidebar + content)
  // ---------------------------------------------------------------

  function renderMainGrid() {
    const wrap = document.createElement("div");
    wrap.appendChild(renderCityMap());

    const grid = document.createElement("div");
    grid.className = "main-grid";
    grid.appendChild(renderSidebar());
    grid.appendChild(renderContentPanel());
    wrap.appendChild(grid);
    return wrap;
  }

  // ---------------- Plan cliquable ----------------

  const ZONE_RECTS = {
    bellevue: { x: 320, y: 20, w: 280, h: 110 },
    tarentaize: { x: 40, y: 170, w: 220, h: 190 },
    centre: { x: 300, y: 170, w: 300, h: 190 },
    zone_industrielle: { x: 640, y: 170, w: 220, h: 190 },
    soleil: { x: 170, y: 400, w: 520, h: 170 }
  };

  const LOCATION_COORDS = {
    redaction: { x: 380, y: 225 },
    mairie: { x: 480, y: 225 },
    cabinet_vallenot: { x: 430, y: 305 },
    commissariat: { x: 530, y: 305 },
    domicile_faure: { x: 150, y: 265 },
    site_ferreol: { x: 280, y: 470 },
    cheval_noir: { x: 460, y: 470 },
    siege_ferrand: { x: 750, y: 265 },
    parking_relais: { x: 460, y: 78 }
  };

  function locationVisited(locationId) {
    return cluesForLocation(locationId).some((c) => state.readClueIds.has(c.id));
  }

  function buildCityMapSVG() {
    let zonesSvg = "";
    currentCase().quartiers.forEach((q) => {
      const r = ZONE_RECTS[q.id];
      if (!r) return;
      const selected = state.selectedQuartier === q.id ? " zone-selected" : "";
      zonesSvg +=
        '<g data-zone="' +
        q.id +
        '" class="zone-group' +
        selected +
        '" tabindex="0" role="button" aria-label="Quartier ' +
        q.name +
        '">' +
        '<rect x="' +
        r.x +
        '" y="' +
        r.y +
        '" width="' +
        r.w +
        '" height="' +
        r.h +
        '" rx="18" class="zone-shape"/>' +
        '<text x="' +
        (r.x + r.w / 2) +
        '" y="' +
        (r.y + 26) +
        '" class="zone-label" text-anchor="middle">' +
        q.name.toUpperCase() +
        "</text></g>";
    });

    let pinsSvg = "";
    currentCase().locations.forEach((loc) => {
      const c = LOCATION_COORDS[loc.id];
      if (!c) return;
      const visited = locationVisited(loc.id);
      const active = state.selectedLocationId === loc.id;
      pinsSvg +=
        '<g data-loc="' +
        loc.id +
        '" class="pin-group' +
        (visited ? " pin-visited" : "") +
        (active ? " pin-active" : "") +
        '" tabindex="0" role="button" aria-label="' +
        loc.name +
        (visited ? " (déjà exploré)" : "") +
        '">' +
        '<circle cx="' +
        c.x +
        '" cy="' +
        c.y +
        '" r="20" class="pin-hitarea"/>' +
        (active
          ? '<circle cx="' + c.x + '" cy="' + c.y + '" r="17" class="pin-ring"/>'
          : "") +
        '<circle cx="' +
        c.x +
        '" cy="' +
        c.y +
        '" r="11" class="pin-circle"/>' +
        "<title>" +
        loc.name +
        (visited ? " (déjà exploré)" : "") +
        "</title></g>";
    });

    return (
      '<svg viewBox="0 0 900 600" xmlns="http://www.w3.org/2000/svg" class="city-map-svg">' +
      zonesSvg +
      pinsSvg +
      "</svg>"
    );
  }

  function handleMapActivate(el) {
    const pinEl = el.closest("[data-loc]");
    if (pinEl) {
      const locId = pinEl.getAttribute("data-loc");
      const loc = locationById(locId);
      state.selectedQuartier = loc.quartier;
      state.selectedLocationId = locId;
      state.view = "location";
      state.lastResult = null;
      render();
      return;
    }
    const zoneEl = el.closest("[data-zone]");
    if (zoneEl) {
      state.selectedQuartier = zoneEl.getAttribute("data-zone");
      state.selectedLocationId = null;
      state.view = "quartier";
      state.lastResult = null;
      render();
    }
  }

  function renderCityMap() {
    const wrap = document.createElement("div");
    wrap.className = "city-map-wrap";
    wrap.innerHTML =
      '<h3 class="map-title">Plan de ' +
      currentCity().name +
      '</h3>' +
      buildCityMapSVG() +
      '<div class="map-legend">' +
      '<span class="legend-item"><i class="dot dot-todo"></i>Lieu à explorer</span>' +
      '<span class="legend-item"><i class="dot dot-visited"></i>Déjà exploré</span>' +
      '<span class="legend-item"><i class="dot dot-active"></i>Lieu sélectionné</span>' +
      "</div>" +
      '<p class="map-mobile-hint">← Faites glisser pour voir tout le plan →</p>';

    wrap.addEventListener("click", (e) => handleMapActivate(e.target));
    wrap.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        handleMapActivate(e.target);
      }
    });

    return wrap;
  }

  // ---------------- Sidebar ----------------

  function renderSidebar() {
    const sidebar = document.createElement("div");
    sidebar.className = "sidebar";

    const hQ = document.createElement("h3");
    hQ.textContent = "Quartiers";
    sidebar.appendChild(hQ);

    currentCase().quartiers.forEach((q) => {
      const btn = document.createElement("button");
      btn.className =
        "nav-item" +
        (state.view === "quartier" && state.selectedQuartier === q.id
          ? " active"
          : "");
      btn.textContent = q.name;
      btn.addEventListener("click", () => {
        state.view = "quartier";
        state.selectedQuartier = q.id;
        state.lastResult = null;
        render();
      });
      sidebar.appendChild(btn);
    });

    const hL = document.createElement("h3");
    hL.textContent =
      "Lieux : " + (quartierById(state.selectedQuartier) || {}).name;
    sidebar.appendChild(hL);

    currentCase()
      .locations.filter((l) => l.quartier === state.selectedQuartier)
      .forEach((l) => {
        const btn = document.createElement("button");
        btn.className =
          "nav-item" +
          (state.view === "location" && state.selectedLocationId === l.id
            ? " active"
            : "");
        btn.textContent = l.name;
        btn.addEventListener("click", () => {
          state.view = "location";
          state.selectedLocationId = l.id;
          state.lastResult = null;
          render();
        });
        sidebar.appendChild(btn);
      });

    const hOutils = document.createElement("h3");
    hOutils.textContent = "Outils";
    sidebar.appendChild(hOutils);

    const journalBtn = document.createElement("button");
    journalBtn.className = "annuaire-btn journal-btn";
    journalBtn.textContent = "Carnet de l'enquête";
    journalBtn.addEventListener("click", () => {
      state.view = "journal";
      render();
    });
    sidebar.appendChild(journalBtn);

    const annuaireBtn = document.createElement("button");
    annuaireBtn.className = "annuaire-btn";
    annuaireBtn.textContent = "Consulter l'annuaire";
    annuaireBtn.addEventListener("click", () => {
      state.view = "annuaire";
      render();
    });
    sidebar.appendChild(annuaireBtn);

    const endBtn = document.createElement("button");
    endBtn.className = "end-early-btn";
    endBtn.textContent = "Passer à l'intervention";
    endBtn.addEventListener("click", () => {
      state.view = "intervention";
      state.interventionSelection = [];
      render();
    });
    sidebar.appendChild(endBtn);

    const exitBtn = document.createElement("button");
    exitBtn.className = "end-early-btn";
    exitBtn.textContent = "← Retour aux affaires";
    exitBtn.addEventListener("click", () => {
      state.view = "caseSelect";
      render();
    });
    sidebar.appendChild(exitBtn);

    const saveNote = document.createElement("p");
    saveNote.className = "briefing";
    saveNote.style.fontSize = "11px";
    saveNote.style.marginTop = "14px";
    saveNote.style.borderTop = "1px dashed var(--muted)";
    saveNote.style.paddingTop = "10px";
    saveNote.textContent = "Sauvegarde automatique activée sur cet appareil.";
    sidebar.appendChild(saveNote);

    const clearBtn = document.createElement("button");
    clearBtn.className = "end-early-btn";
    clearBtn.style.marginTop = "8px";
    clearBtn.textContent = "Effacer la sauvegarde de cette affaire";
    clearBtn.addEventListener("click", () => {
      if (window.confirm("Effacer la sauvegarde de cette affaire et revenir à l'accueil ?")) {
        clearSavedGame(state.currentCityId, state.currentCaseId);
        state.savedGame = null;
        state.started = false;
        state.view = "intro";
        state.readClueIds = new Set();
        state.leadsRemaining = currentCase().totalLeads;
        state.selectedQuartier = null;
        state.selectedLocationId = null;
        state.interventionSelection = [];
        state.lastResult = null;
        state.ending = null;
        render();
      }
    });
    sidebar.appendChild(clearBtn);

    return sidebar;
  }

  // ---------------- Content panel ----------------

  function renderContentPanel() {
    const panel = document.createElement("div");
    panel.className = "content-panel";

    if (state.view === "annuaire") {
      panel.appendChild(renderAnnuaire());
      return panel;
    }

    if (state.view === "journal") {
      panel.appendChild(renderJournal());
      return panel;
    }

    if (!state.selectedLocationId) {
      const hint = document.createElement("div");
      hint.className = "location-card";
      hint.innerHTML =
        "<p>Choisissez un lieu dans le quartier « " +
        (quartierById(state.selectedQuartier) || {}).name +
        " » pour mener un entretien ou une investigation.</p>";
      panel.appendChild(hint);
      return panel;
    }

    panel.appendChild(renderLocationCard());
    return panel;
  }

  function renderLocationCard() {
    const loc = locationById(state.selectedLocationId);
    const card = document.createElement("div");
    card.className = "location-card";

    const header = document.createElement("div");
    header.className = "location-header";
    header.innerHTML =
      '<p class="quartier-tag">' +
      quartierById(loc.quartier).name +
      "</p><h2>" +
      loc.name +
      '</h2><p class="address">' +
      loc.address +
      "</p>";
    card.appendChild(header);

    const buttonsWrap = document.createElement("div");
    buttonsWrap.className = "lead-buttons";

    ["entretien", "investigation"].forEach((type) => {
      const clue = clueFor(loc.id, type);
      const btn = document.createElement("button");
      const label = type === "entretien" ? "Mener un entretien" : "Investiguer";
      if (!clue) {
        btn.className = "lead-btn disabled";
        btn.textContent = label;
        btn.disabled = true;
      } else {
        btn.className = "lead-btn";
        const already = state.readClueIds.has(clue.id);
        btn.innerHTML =
          label + (already ? '<span class="already-read">déjà lu, gratuit</span>' : "");
        btn.addEventListener("click", () => {
          selectClue(clue);
        });
      }
      buttonsWrap.appendChild(btn);
    });

    card.appendChild(buttonsWrap);

    if (state.lastResult) {
      card.appendChild(renderClueResult(state.lastResult));
    }

    return card;
  }

  function selectClue(clue) {
    const alreadyRead = state.readClueIds.has(clue.id);
    if (!alreadyRead) {
      if (state.leadsRemaining <= 0) {
        state.lastResult = {
          title: "Plus de pistes disponibles",
          text:
            "Vous n'avez plus aucune piste à consacrer à une nouvelle découverte. Relisez vos notes ou passez à l'intervention.",
          empty: true
        };
        render();
        return;
      }
      const before = revealedCharacterIds();
      state.leadsRemaining -= 1;
      state.readClueIds.add(clue.id);
      const after = revealedCharacterIds();
      const newChars = Array.from(after).filter((id) => !before.has(id));
      state.lastResult = {
        title: clue.title,
        text: clue.text,
        empty: false,
        newCharacters: newChars.map((id) => characterById(id).name)
      };
    } else {
      state.lastResult = { title: clue.title, text: clue.text, empty: false, newCharacters: [] };
    }
    render();
  }

  function renderClueResult(result) {
    const box = document.createElement("div");
    if (result.empty) {
      box.className = "empty-clue";
      box.textContent = result.text;
      return box;
    }
    box.className = "clue-result";
    let html =
      '<div class="clue-title">' +
      result.title +
      "</div><p>" +
      renderTaggedText(result.text) +
      '</p><div class="stamp">Lu</div>';

    if (result.newCharacters && result.newCharacters.length > 0) {
      html +=
        '<p class="new-contact">📇 Nouveau contact dans l\'annuaire : ' +
        result.newCharacters.join(", ") +
        "</p>";
    }
    box.innerHTML = html;
    return box;
  }

  // ---------------- Journal de l'enquête ----------------

  function renderJournal() {
    const wrap = document.createElement("div");
    wrap.className = "location-card journal-card";

    const cs = currentCase();
    wrap.innerHTML =
      '<h2>Carnet de l\'enquête</h2>' +
      '<div class="journal-recap">' +
      '<p class="journal-recap-label">Rappel de l\'affaire</p>' +
      "<p>" +
      renderTaggedText(cs.intro) +
      "</p></div>";

    const readIds = Array.from(state.readClueIds);
    if (readIds.length === 0) {
      const empty = document.createElement("p");
      empty.className = "briefing";
      empty.style.marginTop = "16px";
      empty.textContent =
        "Aucune piste consultée pour l'instant. Vos entretiens et investigations apparaîtront ici au fur et à mesure.";
      wrap.appendChild(empty);
      return wrap;
    }

    const heading = document.createElement("p");
    heading.className = "journal-recap-label";
    heading.style.marginTop = "20px";
    heading.textContent = "Pistes explorées, dans l'ordre";
    wrap.appendChild(heading);

    const list = document.createElement("div");
    list.className = "journal-list";

    readIds.forEach((clueId, index) => {
      const clue = byId(cs.clues, clueId);
      if (!clue) return;
      const loc = locationById(clue.locationId);
      const entry = document.createElement("div");
      entry.className = "journal-entry";
      entry.innerHTML =
        '<div class="journal-entry-head">' +
        '<span class="journal-index">' +
        (index + 1) +
        '</span><span class="journal-loc">' +
        loc.name +
        " · " +
        (clue.type === "entretien" ? "Entretien" : "Investigation") +
        '</span></div>' +
        '<div class="clue-title">' +
        clue.title +
        "</div><p>" +
        renderTaggedText(clue.text) +
        "</p>";
      const goBtn = document.createElement("button");
      goBtn.className = "journal-goto";
      goBtn.textContent = "Retourner sur place";
      goBtn.addEventListener("click", () => {
        state.selectedQuartier = loc.quartier;
        state.selectedLocationId = loc.id;
        state.view = "location";
        state.lastResult = null;
        render();
      });
      entry.appendChild(goBtn);
      list.appendChild(entry);
    });

    wrap.appendChild(list);
    return wrap;
  }

  // ---------------- Annuaire ----------------

  function renderAnnuaire() {
    const card = document.createElement("div");
    card.className = "location-card";
    card.innerHTML = "<h2>Annuaire</h2>";

    const revealed = revealedCharacterIds();
    const visibleChars = currentCase().characters.filter((ch) => revealed.has(ch.id));

    if (visibleChars.length === 0) {
      const empty = document.createElement("p");
      empty.className = "briefing";
      empty.textContent =
        "Aucun contact identifié pour l'instant. Menez vos premiers entretiens et investigations pour faire apparaître des noms ici.";
      card.appendChild(empty);
      return card;
    }

    const list = document.createElement("div");
    list.className = "annuaire-list";

    visibleChars.forEach((entry) => {
      const row = document.createElement("div");
      row.className = "annuaire-entry";
      const loc = entry.locationId ? locationById(entry.locationId) : null;
      row.innerHTML =
        '<span class="name tag-person">' +
        entry.name +
        '</span><span class="role">' +
        entry.role +
        (loc ? " · " + loc.name : "") +
        "</span>";
      if (loc) {
        const goBtn = document.createElement("button");
        goBtn.textContent = "Aller sur place";
        goBtn.addEventListener("click", () => {
          state.selectedQuartier = loc.quartier;
          state.selectedLocationId = loc.id;
          state.view = "location";
          state.lastResult = null;
          render();
        });
        row.appendChild(goBtn);
      }
      list.appendChild(row);
    });

    card.appendChild(list);
    return card;
  }

  // ---------------------------------------------------------------
  // Intervention
  // ---------------------------------------------------------------

  function renderIntervention() {
    const wrap = document.createElement("div");
    const panel = document.createElement("div");
    panel.className = "intervention-panel";
    panel.innerHTML =
      "<h2>Phase d'intervention</h2><p>Vous estimez en savoir assez, ou vous n'avez plus de pistes. Choisissez exactement <strong>trois lieux</strong> où porter votre accusation avant publication.</p>";

    const grid = document.createElement("div");
    grid.className = "target-grid";

    currentCase().locations.forEach((loc) => {
      const card = document.createElement("button");
      const selected = state.interventionSelection.includes(loc.id);
      card.className = "target-card" + (selected ? " selected" : "");
      card.innerHTML =
        '<span class="name">' +
        loc.name +
        '</span><span class="addr">' +
        loc.address +
        "</span>";
      card.addEventListener("click", () => {
        toggleInterventionTarget(loc.id);
      });
      grid.appendChild(card);
    });

    panel.appendChild(grid);

    const confirmBtn = document.createElement("button");
    confirmBtn.className = "confirm-btn";
    confirmBtn.textContent =
      "Publier l'accusation (" +
      state.interventionSelection.length +
      "/3 lieux choisis)";
    confirmBtn.disabled = state.interventionSelection.length !== 3;
    confirmBtn.addEventListener("click", resolveIntervention);
    panel.appendChild(confirmBtn);

    wrap.appendChild(panel);
    return wrap;
  }

  function toggleInterventionTarget(locId) {
    const idx = state.interventionSelection.indexOf(locId);
    if (idx >= 0) {
      state.interventionSelection.splice(idx, 1);
    } else if (state.interventionSelection.length < 3) {
      state.interventionSelection.push(locId);
    }
    render();
  }

  function resolveIntervention() {
    const cs = currentCase();
    const selection = state.interventionSelection.slice().sort();
    const combo = cs.interventionCombos.find((c) => {
      const set = c.set.slice().sort();
      return (
        set.length === selection.length &&
        set.every((v, i) => v === selection[i])
      );
    });

    if (combo) {
      state.ending = { points: combo.points, text: combo.text };
    } else {
      const validCount = selection.filter((id) =>
        cs.interventionTargets.includes(id)
      ).length;
      const fallback = cs.interventionFallback;
      state.ending = {
        points: Math.max(fallback.points, validCount * 2 - 1),
        text: fallback.text
      };
    }

    recordCaseCompletion(state.currentCityId, state.currentCaseId, state.ending.points);
    clearSavedGame(state.currentCityId, state.currentCaseId);
    state.view = "ending";
    render();
  }

  function renderEnding() {
    const wrap = document.createElement("div");
    const page = document.createElement("div");
    page.className = "ending-page";

    const points = state.ending.points;
    let verdict = "ÉCHEC";
    if (points === 7) verdict = "RÉUSSITE MAJEURE";
    else if (points >= 4) verdict = "RÉUSSITE";

    page.innerHTML =
      '<p class="score-tag">Dossier classé, Le Stéphanois</p><h2>Verdict de l\'intervention</h2><p class="score-line">Score final : ' +
      points +
      " / 7 · Points de carrière cumulés : " +
      careerPoints() +
      '</p><p>' +
      renderTaggedText(state.ending.text) +
      '</p><div class="verdict">' +
      verdict +
      "</div>";

    const btnRow = document.createElement("div");
    btnRow.style.display = "flex";
    btnRow.style.gap = "12px";
    btnRow.style.flexWrap = "wrap";

    const backBtn = document.createElement("button");
    backBtn.className = "restart-btn";
    backBtn.textContent = "Retour aux affaires";
    backBtn.addEventListener("click", () => {
      state.view = "caseSelect";
      render();
    });
    btnRow.appendChild(backBtn);

    const restart = document.createElement("button");
    restart.className = "restart-btn";
    restart.textContent = "Retenter cette affaire";
    restart.addEventListener("click", () => {
      const cs = currentCase();
      state.leadsRemaining = cs.totalLeads;
      state.readClueIds = new Set();
      state.started = false;
      state.view = "intro";
      state.selectedQuartier = null;
      state.selectedLocationId = null;
      state.interventionSelection = [];
      state.lastResult = null;
      state.ending = null;
      state.savedGame = null;
      render();
    });
    btnRow.appendChild(restart);

    page.appendChild(btnRow);
    wrap.appendChild(page);
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
      state.view = state.previousView || "citySelect";
      render();
    });
    wrap.appendChild(backBtn);

    const card = document.createElement("div");
    card.className = "profile-card";

    const header = document.createElement("div");
    header.className = "profile-header";

    const bigAvatar = document.createElement("div");
    bigAvatar.className = "profile-avatar";
    bigAvatar.innerHTML = buildAvatarSVG(120);
    header.appendChild(bigAvatar);

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
    rankTag.textContent = currentRank() + " · Le Stéphanois";
    idBlock.appendChild(rankTag);

    const swatches = document.createElement("div");
    swatches.className = "avatar-swatches";
    [
      { id: "red", label: "Rouge tampon" },
      { id: "gold", label: "Or vieilli" },
      { id: "steel", label: "Vert acier" }
    ].forEach((opt) => {
      const sw = document.createElement("button");
      sw.className =
        "avatar-swatch avatar-swatch-" +
        opt.id +
        (state.progress.avatarAccent === opt.id ? " selected" : "");
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

    const statsGrid = document.createElement("div");
    statsGrid.className = "profile-stats-grid";
    const best = bestScoreEver();
    const stats = [
      { label: "Points de carrière", value: careerPoints() },
      {
        label: "Affaires résolues",
        value: totalCasesCompleted() + " / " + totalCasesAvailable()
      },
      { label: "Meilleur score obtenu", value: best === null ? "N/A" : best + " / 7" }
    ];
    stats.forEach((s) => {
      const box = document.createElement("div");
      box.className = "profile-stat";
      box.innerHTML =
        '<span class="profile-stat-value">' +
        s.value +
        '</span><span class="profile-stat-label">' +
        s.label +
        "</span>";
      statsGrid.appendChild(box);
    });
    card.appendChild(statsGrid);

    const citiesHeading = document.createElement("h3");
    citiesHeading.className = "profile-section-heading";
    citiesHeading.textContent = "Villes couvertes";
    card.appendChild(citiesHeading);

    const cityProgressList = document.createElement("div");
    cityProgressList.className = "profile-city-list";
    state.data.cities
      .filter((c) => c.status === "available")
      .forEach((c) => {
        const row = document.createElement("div");
        row.className = "profile-city-row";
        row.innerHTML =
          '<span class="tag-lieu">' +
          c.name +
          "</span><span>" +
          cityCompletedCount(c) +
          " / " +
          c.cases.length +
          " affaire" +
          (c.cases.length > 1 ? "s" : "") +
          " résolue" +
          (cityCompletedCount(c) > 1 ? "s" : "") +
          "</span>";
        cityProgressList.appendChild(row);
      });
    card.appendChild(cityProgressList);

    const badgesHeading = document.createElement("h3");
    badgesHeading.className = "profile-section-heading";
    badgesHeading.textContent = "Distinctions";
    card.appendChild(badgesHeading);

    const badges = computeBadges();
    if (badges.length === 0) {
      const noBadge = document.createElement("p");
      noBadge.className = "briefing";
      noBadge.textContent =
        "Aucune distinction pour l'instant, terminez une première affaire pour commencer à en gagner.";
      card.appendChild(noBadge);
    } else {
      const badgeList = document.createElement("div");
      badgeList.className = "profile-badge-list";
      badges.forEach((b) => {
        const badge = document.createElement("div");
        badge.className = "profile-badge";
        badge.innerHTML =
          '<span class="profile-badge-label">🏅 ' +
          b.label +
          '</span><span class="profile-badge-detail">' +
          b.detail +
          "</span>";
        badgeList.appendChild(badge);
      });
      card.appendChild(badgeList);
    }

    wrap.appendChild(card);
    return wrap;
  }

  function renderFootnote() {
    const el = document.createElement("div");
    el.className = "footnote";
    el.textContent =
      "Enquête fictive inspirée de la mécanique de Bureau of Investigation (personnages et faits imaginaires).";
    return el;
  }

  init();
})();
