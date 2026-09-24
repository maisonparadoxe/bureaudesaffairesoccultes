// ===================================================================
// Sons du jeu. Les fichiers sont cherchés dans audio/<dossier>/<nom>.mp3
// (voir sons-et-musiques.md). Un fichier absent est simplement ignoré.
// Trois volumes séparés : effets, ambiances, musique.
// ===================================================================
(function () {
  "use strict";

  const SETTINGS_KEY = "bao-audio-v1";
  const settings = { muted: false, effets: 0.8, ambiances: 0.5, musique: 0.45 };
  try {
    Object.assign(settings, JSON.parse(localStorage.getItem(SETTINGS_KEY) || "{}"));
  } catch (e) {}

  const missing = new Set();
  const cache = {};
  let ambience = null; // { name, el }
  let music = null; // { name, el }
  let unlocked = false;

  function save() {
    try {
      localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
    } catch (e) {}
  }

  function src(path) {
    return "audio/" + path + ".mp3";
  }

  function make(path, loop) {
    if (missing.has(path)) return null;
    const el = new Audio(src(path));
    el.loop = !!loop;
    el.preload = "auto";
    el.addEventListener("error", () => missing.add(path));
    return el;
  }

  function vol(kind) {
    return settings.muted ? 0 : settings[kind];
  }

  function fade(el, to, ms, done) {
    if (!el) return;
    const from = el.volume;
    const steps = 12;
    let i = 0;
    const t = setInterval(() => {
      i++;
      el.volume = Math.max(0, Math.min(1, from + ((to - from) * i) / steps));
      if (i >= steps) {
        clearInterval(t);
        if (done) done();
      }
    }, ms / steps);
  }

  // Effet ponctuel. delay en ms pour enchaîner plusieurs sons.
  function play(path, delay) {
    if (settings.muted || !unlocked) return;
    const go = () => {
      if (missing.has(path)) return;
      let base = cache[path];
      if (!base) base = cache[path] = make(path, false);
      if (!base) return;
      const el = base.cloneNode();
      el.volume = vol("effets");
      el.addEventListener("error", () => missing.add(path));
      el.play().catch(() => {});
    };
    if (delay) setTimeout(go, delay);
    else go();
  }

  // Un son parmi plusieurs variantes (frappes de clavier...)
  let lastQuick = 0;
  function playQuick(paths, minGap) {
    const now = Date.now();
    if (now - lastQuick < (minGap || 45)) return;
    lastQuick = now;
    playOneOf(paths);
  }
  function playOneOf(paths, delay) {
    play(paths[Math.floor(Math.random() * paths.length)], delay);
  }

  function setAmbience(name) {
    if (ambience && ambience.name === name) return;
    const old = ambience;
    ambience = null;
    if (old) fade(old.el, 0, 700, () => old.el.pause());
    if (!name) return;
    const el = make("ambiances/" + name, true);
    if (!el) return;
    ambience = { name: name, el: el };
    el.volume = 0;
    if (unlocked) {
      el.play().catch(() => {});
      fade(el, vol("ambiances"), 900);
    }
  }

  // Météo : une boucle qui se superpose à l'ambiance du lieu (la pluie sur la vitre)
  let weather = null;
  function setWeather(name) {
    if (weather && weather.name === name) return;
    const old = weather;
    weather = null;
    if (old) fade(old.el, 0, 900, () => old.el.pause());
    if (!name) return;
    const el = make("ambiances/" + name, true);
    if (!el) return;
    weather = { name: name, el: el };
    el.volume = 0;
    if (unlocked) {
      el.play().catch(() => {});
      fade(el, vol("ambiances") * 0.6, 1500);
    }
  }

  // Coupe l'ambiance quelques instants (avant une révélation)
  function silence(ms) {
    if (!ambience) return;
    const a = ambience;
    fade(a.el, 0, 250);
    setTimeout(() => {
      if (ambience === a) fade(a.el, vol("ambiances"), 1500);
    }, ms);
  }

  function setMusic(name, loop) {
    if (music && music.name === name) return;
    const old = music;
    music = null;
    if (old) fade(old.el, 0, 900, () => old.el.pause());
    if (!name) return;
    const el = make("musiques/" + name, loop !== false);
    if (!el) return;
    music = { name: name, el: el };
    el.volume = 0;
    if (unlocked) {
      el.play().catch(() => {});
      fade(el, vol("musique"), 1200);
    }
  }

  // Les navigateurs n'autorisent le son qu'après un premier geste du joueur.
  function unlock() {
    if (unlocked) return;
    unlocked = true;
    [ambience, music, weather].forEach((x) => {
      if (x) {
        x.el.play().catch(() => {});
        fade(x.el, vol(x === music ? "musique" : "ambiances") * (x === weather ? 0.6 : 1), 900);
      }
    });
  }
  document.addEventListener("pointerdown", unlock, { once: true });
  document.addEventListener("keydown", unlock, { once: true });

  function applyVolumes() {
    if (ambience) ambience.el.volume = vol("ambiances");
    if (music) music.el.volume = vol("musique");
    if (weather) weather.el.volume = vol("ambiances") * 0.6;
  }

  function set(key, value) {
    settings[key] = value;
    save();
    applyVolumes();
  }

  window.BAOAudio = {
    play: play,
    playOneOf: playOneOf,
    playQuick: playQuick,
    setAmbience: setAmbience,
    setMusic: setMusic,
    setWeather: setWeather,
    silence: silence,
    settings: settings,
    set: set
  };
})();
