(function () {
  "use strict";

  const app = document.getElementById("app");
  const SAVE_KEY = "hauts-fourneaux-save-v1";

  const state = {
    savedGame: null, // populated at load time if a save exists, offered on the intro screen
    data: null,
    leadsRemaining: 0,
    readClueIds: new Set(),
    started: false,
    view: "intro", // intro | quartier | location | annuaire | intervention | ending
    selectedQuartier: null,
    selectedLocationId: null,
    interventionSelection: [],
    lastResult: null, // { title, text, empty } shown after picking a clue
    ending: null
  };

  function byId(list, id) {
    return list.find((x) => x.id === id);
  }

  function locationById(id) {
    return byId(state.data.locations, id);
  }

  function quartierById(id) {
    return byId(state.data.quartiers, id);
  }

  function cluesForLocation(locationId) {
    return state.data.clues.filter((c) => c.locationId === locationId);
  }

  function clueFor(locationId, type) {
    return state.data.clues.find(
      (c) => c.locationId === locationId && c.type === type
    );
  }

  // ---------------------------------------------------------------
  // Data loading: try fetch('data.json') first (works when served
  // over http/https), fall back to the embedded copy in data.js so
  // the game still works when the file is opened directly (file://).
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

  // ---------------------------------------------------------------
  // Save / load (localStorage). This is a standalone downloaded page
  // running in the player's own browser, so localStorage is fine here
  // (unlike Claude.ai artifacts, which can't use it).
  // ---------------------------------------------------------------
  function saveGame() {
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
      localStorage.setItem(SAVE_KEY, JSON.stringify(payload));
    } catch (e) {
      // localStorage unavailable (private browsing, etc.) — fail silently
    }
  }

  function loadSavedGame() {
    try {
      const raw = localStorage.getItem(SAVE_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch (e) {
      return null;
    }
  }

  function clearSavedGame() {
    try {
      localStorage.removeItem(SAVE_KEY);
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
    state.selectedQuartier = saved.selectedQuartier || state.data.quartiers[0].id;
    state.selectedLocationId = saved.selectedLocationId || null;
    state.interventionSelection = saved.interventionSelection || [];
    state.ending = saved.ending || null;
    state.view = state.ending ? "ending" : saved.view || "quartier";
    state.lastResult = null;
    render();
  }

  function init() {
    loadData()
      .then((data) => {
        state.data = data;
        state.leadsRemaining = data.meta.totalLeads;
        state.savedGame = loadSavedGame();
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
  // Rendering
  // ---------------------------------------------------------------

  function render() {
    if (state.started) saveGame();

    app.innerHTML = "";
    app.appendChild(renderMasthead());

    if (state.view === "intro") {
      app.appendChild(renderIntro());
    } else if (state.view === "intervention") {
      app.appendChild(renderIntervention());
    } else if (state.view === "ending") {
      app.appendChild(renderEnding());
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
    titles.innerHTML =
      '<p class="kicker">' +
      state.data.meta.city +
      ", " +
      state.data.meta.year +
      '</p><h1>' +
      state.data.meta.title +
      '</h1><p class="subtitle">' +
      state.data.meta.subtitle +
      "</p>";
    el.appendChild(titles);

    if (state.started) {
      const counter = document.createElement("div");
      const low = state.leadsRemaining <= 3;
      counter.className = "lead-counter" + (low ? " low" : "");
      counter.innerHTML =
        '<span class="num">' +
        state.leadsRemaining +
        '</span><span class="label">pistes restantes</span>';
      el.appendChild(counter);
    }

    return el;
  }

  function renderIntro() {
    const wrap = document.createElement("div");
    const card = document.createElement("div");
    card.className = "intro-card";
    card.innerHTML =
      "<h2>Dossier ouvert</h2><p>" +
      state.data.meta.intro +
      '</p><p class="briefing">' +
      state.data.meta.briefing +
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
        (state.data.meta.totalLeads - state.savedGame.leadsRemaining) +
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
      ? "Nouvelle enquête (efface la sauvegarde)"
      : "Commencer l'enquête";
    btn.addEventListener("click", () => {
      clearSavedGame();
      state.savedGame = null;
      state.leadsRemaining = state.data.meta.totalLeads;
      state.readClueIds = new Set();
      state.started = true;
      state.view = "quartier";
      state.selectedQuartier = state.data.quartiers[0].id;
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

  // ---------------------------------------------------------------
  // Plan cliquable (carte schématique de la ville, façon plateau de
  // jeu — pas une carte géographique réelle). Cliquer une zone
  // sélectionne le quartier ; cliquer un pion sélectionne le lieu.
  // ---------------------------------------------------------------

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
    state.data.quartiers.forEach((q) => {
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
    state.data.locations.forEach((loc) => {
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
        (visited ? " — déjà exploré" : "") +
        '">' +
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
      '<h3 class="map-title">Plan de Saint-Étienne</h3>' +
      buildCityMapSVG() +
      '<div class="map-legend">' +
      '<span class="legend-item"><i class="dot dot-todo"></i>Lieu à explorer</span>' +
      '<span class="legend-item"><i class="dot dot-visited"></i>Déjà exploré</span>' +
      '<span class="legend-item"><i class="dot dot-active"></i>Lieu sélectionné</span>' +
      "</div>";

    wrap.addEventListener("click", (e) => handleMapActivate(e.target));
    wrap.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        handleMapActivate(e.target);
      }
    });

    return wrap;
  }

  function renderSidebar() {
    const sidebar = document.createElement("div");
    sidebar.className = "sidebar";

    const hQ = document.createElement("h3");
    hQ.textContent = "Quartiers";
    sidebar.appendChild(hQ);

    state.data.quartiers.forEach((q) => {
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
    hL.textContent = "Lieux — " + (quartierById(state.selectedQuartier) || {}).name;
    sidebar.appendChild(hL);

    state.data.locations
      .filter((l) => l.quartier === state.selectedQuartier)
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
    clearBtn.textContent = "Effacer la sauvegarde";
    clearBtn.addEventListener("click", () => {
      if (window.confirm("Effacer la sauvegarde et revenir à l'accueil ?")) {
        clearSavedGame();
        state.savedGame = null;
        state.started = false;
        state.view = "intro";
        state.readClueIds = new Set();
        state.leadsRemaining = state.data.meta.totalLeads;
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

  function renderContentPanel() {
    const panel = document.createElement("div");
    panel.className = "content-panel";

    if (state.view === "annuaire") {
      panel.appendChild(renderAnnuaire());
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
          label + (already ? '<span class="already-read">déjà lu — gratuit</span>' : "");
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
      state.leadsRemaining -= 1;
      state.readClueIds.add(clue.id);
    }
    state.lastResult = { title: clue.title, text: clue.text, empty: false };
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
    box.innerHTML =
      '<div class="clue-title">' +
      result.title +
      "</div><p>" +
      result.text +
      '</p><div class="stamp">Lu</div>';
    return box;
  }

  function renderAnnuaire() {
    const card = document.createElement("div");
    card.className = "location-card";
    card.innerHTML = "<h2>Annuaire</h2>";

    const list = document.createElement("div");
    list.className = "annuaire-list";

    state.data.annuaire.forEach((entry) => {
      const loc = locationById(entry.locationId);
      const row = document.createElement("div");
      row.className = "annuaire-entry";
      row.innerHTML =
        '<span class="name">' +
        entry.name +
        '</span><span class="role">' +
        entry.role +
        " — " +
        loc.name +
        "</span>";
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
      list.appendChild(row);
    });

    card.appendChild(list);
    return card;
  }

  function renderIntervention() {
    const wrap = document.createElement("div");
    const panel = document.createElement("div");
    panel.className = "intervention-panel";
    panel.innerHTML =
      "<h2>Phase d'intervention</h2><p>Vous estimez en savoir assez — ou vous n'avez plus de pistes. Choisissez exactement <strong>trois lieux</strong> où porter votre accusation avant publication.</p>";

    const grid = document.createElement("div");
    grid.className = "target-grid";

    state.data.locations.forEach((loc) => {
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
    const selection = state.interventionSelection.slice().sort();
    const combo = state.data.interventionCombos.find((c) => {
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
        state.data.interventionTargets.includes(id)
      ).length;
      const fallback = state.data.interventionFallback;
      state.ending = {
        points: Math.max(fallback.points, validCount * 2 - 1),
        text: fallback.text
      };
    }
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
      '<p class="score-tag">Dossier classé — Le Stéphanois</p><h2>Verdict de l\'intervention</h2><p class="score-line">Score final : ' +
      points +
      " / 7</p><p>" +
      state.ending.text +
      '</p><div class="verdict">' +
      verdict +
      "</div>";

    const restart = document.createElement("button");
    restart.className = "restart-btn";
    restart.textContent = "Recommencer l'enquête";
    restart.addEventListener("click", () => {
      clearSavedGame();
      state.savedGame = null;
      state.leadsRemaining = state.data.meta.totalLeads;
      state.readClueIds = new Set();
      state.started = false;
      state.view = "intro";
      state.selectedQuartier = null;
      state.selectedLocationId = null;
      state.interventionSelection = [];
      state.lastResult = null;
      state.ending = null;
      render();
    });
    page.appendChild(restart);

    wrap.appendChild(page);
    return wrap;
  }

  function renderFootnote() {
    const el = document.createElement("div");
    el.className = "footnote";
    el.textContent =
      "Enquête fictive inspirée de la mécanique de Bureau of Investigation — personnages et faits imaginaires.";
    return el;
  }

  init();
})();
