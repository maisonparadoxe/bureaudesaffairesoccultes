// ===================================================================
// SEUIL : prototype jouable.
// Un labyrinthe de portes, dans l'esprit de Blue Prince : chaque porte
// est scellée par une énigme ; si on la résout, on choisit une salle
// parmi trois et on avance. Les pas sont comptés. Une porte ratée reste
// condamnée. Tout est dans ce fichier : aucune dépendance, pas de serveur.
// ===================================================================
(function () {
  "use strict";

  // ------------------------------------------------------------------
  // Constantes et petits outils
  // ------------------------------------------------------------------
  const ROWS = 9;
  const COLS = 5;
  const START = { r: 8, c: 2 };
  const GOAL = { r: 0, c: 2 };
  const START_STEPS = 45;
  const DIRS = [
    { dr: -1, dc: 0, nom: "nord", fleche: "↑" },
    { dr: 0, dc: 1, nom: "est", fleche: "→" },
    { dr: 1, dc: 0, nom: "sud", fleche: "↓" },
    { dr: 0, dc: -1, nom: "ouest", fleche: "←" },
  ];
  const opp = (d) => (d + 2) % 4;
  const inGrid = (r, c) => r >= 0 && r < ROWS && c >= 0 && c < COLS;
  const rnd = (a, b) => a + Math.floor(Math.random() * (b - a + 1));
  const pick = (a) => a[Math.floor(Math.random() * a.length)];
  const shuffle = (a) => {
    const t = a.slice();
    for (let i = t.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [t[i], t[j]] = [t[j], t[i]];
    }
    return t;
  };
  const esc = (s) =>
    String(s).replace(/[&<>"]/g, (ch) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[ch]);

  // ------------------------------------------------------------------
  // Sons : on réutilise ceux du Bureau. Un fichier absent est ignoré.
  // ------------------------------------------------------------------
  let muet = false;
  try {
    muet = localStorage.getItem("seuil-muet") === "1";
  } catch (e) {}
  const sonsCache = {};
  function son(nom) {
    if (muet) return;
    try {
      let a = sonsCache[nom];
      if (a === null) return;
      if (!a) {
        a = new Audio("../audio/interface/" + nom + ".mp3");
        a.addEventListener("error", () => (sonsCache[nom] = null));
        sonsCache[nom] = a;
      }
      a.currentTime = 0;
      a.volume = 0.7;
      const p = a.play();
      if (p && p.catch) p.catch(() => {});
    } catch (e) {}
  }

  // ------------------------------------------------------------------
  // Les salles
  // Les portes sont données par rapport au sens de l'entrée :
  // F = en face, L = à gauche, R = à droite. La porte d'entrée existe toujours.
  // kind : pass (passage), bonus, trap (piège). max : nombre maximal par partie.
  // ------------------------------------------------------------------
  const SALLES = [
    { id: "galerie", nom: "Galerie", court: "Galerie", doors: ["F"], w: 12, kind: "pass", desc: "Un long couloir de pierre, usé par des siècles de pas." },
    { id: "coude", nom: "Coude", court: "Coude", doors: ["L"], mirror: true, w: 12, kind: "pass", desc: "Le couloir tourne brusquement." },
    { id: "fourche", nom: "Fourche", court: "Fourche", doors: ["F", "L"], mirror: true, w: 9, kind: "pass", desc: "Le chemin se sépare en deux." },
    { id: "te", nom: "Salle en T", court: "Salle en T", doors: ["L", "R"], w: 8, kind: "pass", desc: "Deux issues, à gauche et à droite." },
    { id: "croisee", nom: "Croisée", court: "Croisée", doors: ["F", "L", "R"], w: 6, kind: "pass", desc: "Un carrefour à quatre portes." },
    { id: "cellier", nom: "Cellier", court: "Cellier", doors: [], w: 5, max: 2, kind: "bonus", fx: { steps: 8 }, desc: "Des vivres laissés là par quelqu'un. Un cul-de-sac." },
    { id: "refectoire", nom: "Réfectoire", court: "Réfectoire", doors: ["L", "R"], w: 5, max: 2, kind: "bonus", fx: { steps: 5 }, desc: "Une longue table. Le pain est encore mangeable." },
    { id: "reliquaire", nom: "Reliquaire", court: "Reliquaire", doors: [], w: 4, max: 2, kind: "bonus", fx: { seals: 1 }, desc: "Un sceau des Gardiens, sous une cloche de verre. Un cul-de-sac." },
    { id: "forge", nom: "Forge froide", court: "Forge", doors: ["L"], mirror: true, w: 4, max: 2, kind: "bonus", fx: { dice: 1 }, desc: "Un établi, des moules, un dé de fondeur oublié." },
    { id: "sablier", nom: "Salle du sablier", court: "Sablier", doors: ["F"], w: 3, max: 2, kind: "bonus", fx: { time: 6 }, desc: "Un sablier géant. Le temps semble s'y écouler plus lentement." },
    { id: "puits", nom: "Puits aux salamandres", court: "Puits", doors: ["F"], w: 2, max: 1, kind: "bonus", fx: { steps: 3, dice: 1 }, desc: "L'eau y est claire. Des salamandres gravées tapissent la margelle." },
    { id: "sanctuaire", nom: "Sanctuaire", court: "Sanctuaire", doors: ["F", "L", "R"], w: 2, max: 1, kind: "bonus", fx: { steps: 4, seals: 1 }, desc: "Une salle calme, éclairée par une flamme qui ne vacille pas." },
    { id: "archives", nom: "Archives", court: "Archives", doors: ["F", "R"], mirror: true, w: 4, max: 3, kind: "bonus", fx: { fragment: 1 }, desc: "Des rayonnages de dossiers. Certains portent le nom de Valcourt." },
    { id: "fresque", nom: "Fresque des Gardiens", court: "Fresque", doors: ["L", "R"], w: 3, max: 2, kind: "bonus", fx: { fragment: 1 }, desc: "Des silhouettes en capuche gardent une porte. L'une d'elles tient une salamandre." },
    { id: "cabinet", nom: "Cabinet du serrurier", court: "Cabinet", doors: ["F"], w: 2, max: 1, kind: "bonus", fx: { fragment: 1, steps: 3 }, desc: "Un bureau encombré de pênes et de ressorts. Quelqu'un a travaillé ici." },
    { id: "lames", nom: "Salle des lames", court: "Lames", doors: ["F", "L"], mirror: true, w: 3, max: 2, kind: "trap", fx: { steps: -5 }, desc: "Des lames sortent du mur au moindre pas. Vous vous en tirez, mais pas gratuitement." },
    { id: "eboulis", nom: "Éboulement", court: "Éboulis", doors: ["F"], w: 3, max: 2, kind: "trap", fx: { steps: -3 }, desc: "La voûte a cédé. Il faut contourner les gravats." },
  ];
  const HALL = { id: "hall", nom: "Vestibule", court: "Vestibule", kind: "start", desc: "Un vestibule glacé. Sur le linteau, une salamandre et ces mots : NUTRISCO ET EXTINGUO." };
  const CHAMBRE = { id: "chambre", nom: "Chambre des Gardiens", court: "Chambre", kind: "goal", desc: "Le cœur du labyrinthe." };

  const FRAGMENTS = [
    "Une carte de visite : « A. Valcourt, serrurier-inventeur. Sécurité sur mesure. » Au dos, une salamandre à l'encre.",
    "Un carnet de commandes : douze portes « sans clé, sans force, avec la tête », pour un client qui ne signe jamais.",
    "Une note de Valcourt : « Le client veut que ne passe que celui qui sait compter, lire ou attendre. »",
    "Gravé dans la pierre, à hauteur d'homme : NUTRISCO ET EXTINGUO. Quelqu'un l'a souligné au crayon.",
    "Un plan déchiré : les salles changent de place quand personne ne les regarde. Valcourt l'avait déjà remarqué.",
    "Le dernier mot de Valcourt, au crayon : « Je ne suis pas perdu. Je suis gardé. »",
  ];

  // ------------------------------------------------------------------
  // Énigmes : simples pour le prototype, à enrichir plus tard.
  // ------------------------------------------------------------------
  const MOTS = [
    // [niveau, bonne orthographe, fautes possibles]
    [1, "rythme", ["rithme", "rytme"]],
    [1, "mystère", ["mistère", "mysthère"]],
    [1, "ennemi", ["énemi", "ennémi"]],
    [1, "labyrinthe", ["labyrinte", "labirynthe"]],
    [1, "souterrain", ["soutterrain", "souterin"]],
    [1, "sanctuaire", ["sanctuère", "santuaire"]],
    [1, "grimoire", ["grimoir", "grimoîre"]],
    [2, "phénomène", ["fénomène", "phénomêne"]],
    [2, "connaissance", ["connaisance", "conaissance"]],
    [2, "apparence", ["aparence", "apparance"]],
    [2, "nécessaire", ["nécéssaire", "necéssaire"]],
    [2, "cérémonie", ["cérémonnie", "cèrémonie"]],
    [2, "incantation", ["incantacion", "encantation"]],
    [2, "sarcophage", ["sarcofage", "sarcophague"]],
    [2, "occurrence", ["occurence", "ocurrence"]],
    [2, "asthme", ["asme", "astme"]],
    [3, "exhaustif", ["exaustif", "exhausthif"]],
    [3, "hiéroglyphe", ["hiéroglife", "hiéroglyffe"]],
    [3, "ésotérique", ["ésotérrique", "ésoterique"]],
    [3, "acquérir", ["aquérir", "acquérrir"]],
    [3, "développement", ["dévelopement", "développment"]],
    [3, "parallèle", ["paralèle", "parallelle"]],
    [3, "rhinocéros", ["rinocéros", "rhinocérosse"]],
    [3, "oxygène", ["oxigène", "oxygéne"]],
  ];

  function suiteTexte(termes) {
    return termes.join(", ") + ", ?";
  }

  const GEN = {
    add(l) {
      const [lo, hi] = [[10, 60], [100, 500], [200, 900]][l - 1];
      const a = rnd(lo, hi), b = rnd(lo, hi);
      return { kind: "num", label: "Addition", text: `${a} + ${b}`, answer: a + b };
    },
    sub(l) {
      const [lo, hi] = [[30, 99], [200, 900], [500, 1500]][l - 1];
      const a = rnd(lo, hi);
      const b = rnd(Math.floor(a / 4), a - 1);
      return { kind: "num", label: "Soustraction", text: `${a} − ${b}`, answer: a - b };
    },
    mul(l) {
      let a, b;
      if (l === 1) { a = rnd(3, 9); b = rnd(3, 9); }
      else if (l === 2) { a = rnd(12, 25); b = rnd(3, 9); }
      else { a = rnd(12, 19); b = rnd(11, 19); }
      return { kind: "num", label: "Multiplication", text: `${a} × ${b}`, answer: a * b };
    },
    suite(l) {
      let t = [];
      if (l === 1) {
        const s = rnd(1, 20), k = rnd(2, 9);
        for (let i = 0; i < 6; i++) t.push(s + k * i);
      } else if (l === 2) {
        if (Math.random() < 0.5) {
          const s = rnd(1, 5), q = pick([2, 3]);
          for (let i = 0; i < 6; i++) t.push(s * Math.pow(q, i));
        } else {
          const s = rnd(1, 10), a = rnd(2, 5), b = rnd(6, 9);
          t.push(s);
          for (let i = 1; i < 6; i++) t.push(t[i - 1] + (i % 2 ? a : b));
        }
      } else {
        const type = pick(["carres", "fib", "double"]);
        if (type === "carres") {
          const n = rnd(2, 6);
          for (let i = 0; i < 6; i++) t.push((n + i) * (n + i));
        } else if (type === "fib") {
          t = [rnd(1, 4), rnd(2, 6)];
          for (let i = 2; i < 6; i++) t.push(t[i - 1] + t[i - 2]);
        } else {
          t = [rnd(1, 3)];
          for (let i = 1; i < 6; i++) t.push(t[i - 1] * 2 + 1);
        }
      }
      const answer = t[5];
      return { kind: "num", label: "Suite logique", text: suiteTexte(t.slice(0, 5)), answer };
    },
    ortho(l) {
      const liste = MOTS.filter((m) => m[0] === l);
      const m = pick(liste);
      const options = shuffle([m[1], ...m[2]]);
      return { kind: "mcq", label: "Orthographe", text: "Une seule de ces graphies est correcte.", options, answer: m[1] };
    },
  };

  function makePuzzle(level) {
    const type = pick(["add", "sub", "mul", "suite", "ortho", "ortho"]);
    const p = GEN[type](level);
    p.level = level;
    return p;
  }

  const TEMPS_BASE = { 1: 40, 2: 35, 3: 30 };

  // ------------------------------------------------------------------
  // État de la partie
  // ------------------------------------------------------------------
  let G = null; // la partie en cours ; null tant qu'on est au menu
  let timer = null;
  let pz = null; // énigme en cours { puzzle, restant, total, fini }

  function stats() {
    try {
      return JSON.parse(localStorage.getItem("seuil-stats") || "{}");
    } catch (e) {
      return {};
    }
  }
  function saveStats(s) {
    try {
      localStorage.setItem("seuil-stats", JSON.stringify(s));
    } catch (e) {}
  }

  function nouvellePartie() {
    G = {
      steps: START_STEPS,
      dice: 1,
      seals: 1,
      timeBonus: 0,
      grid: Array.from({ length: ROWS }, () => Array(COLS).fill(null)),
      pos: { r: START.r, c: START.c },
      doors: {},
      count: {},
      fragments: 0,
      log: [],
      moves: 0,
      rooms: 1,
      solved: 0,
      failed: 0,
      over: null,
      pending: null,
      draft: null,
    };
    G.grid[START.r][START.c] = { tpl: HALL, doors: [0, 1, 3], visited: true };
    G.grid[GOAL.r][GOAL.c] = { tpl: CHAMBRE, doors: [2], visited: false, goal: true };
    log("Vous entrez dans le vestibule. Quarante-cinq pas, pas un de plus.");
    const s = stats();
    s.runs = (s.runs || 0) + 1;
    saveStats(s);
  }

  function log(msg) {
    G.log.unshift(msg);
    if (G.log.length > 40) G.log.pop();
  }

  // ------------------------------------------------------------------
  // Portes
  // ------------------------------------------------------------------
  function edgeKey(r, c, d) {
    const r2 = r + DIRS[d].dr, c2 = c + DIRS[d].dc;
    const a = r + "," + c, b = r2 + "," + c2;
    return a < b ? a + "|" + b : b + "|" + a;
  }

  function doorFor(r, c, d) {
    const k = edgeKey(r, c, d);
    if (!G.doors[k]) {
      const r2 = r + DIRS[d].dr, c2 = c + DIRS[d].dc;
      const isGoal = (r === GOAL.r && c === GOAL.c) || (r2 === GOAL.r && c2 === GOAL.c);
      let level, status = "locked";
      if (isGoal) level = 3;
      else {
        const row = Math.min(r, r2);
        level = row >= 6 ? 1 : row >= 3 ? 2 : 3;
        const x = Math.random();
        if (x < 0.2 && level > 1) level -= 1;
        else if (x > 0.85 && level < 3) level += 1;
        if (Math.random() < 0.18) { status = "ajar"; level = 0; }
      }
      G.doors[k] = { level, status };
    }
    return G.doors[k];
  }

  // État d'une porte vue depuis la salle (r,c), côté d.
  // s : wall | open | locked | ajar | blocked
  function edge(r, c, d) {
    const room = G.grid[r][c];
    if (!room || !room.doors.includes(d)) return { s: "wall" };
    const r2 = r + DIRS[d].dr, c2 = c + DIRS[d].dc;
    if (!inGrid(r2, c2)) return { s: "wall" };
    const n = G.grid[r2][c2];
    if (n) {
      if (!n.doors.includes(opp(d))) return { s: "wall" };
      if (n.goal || room.goal) {
        const D = doorFor(r, c, d);
        return { s: D.status, level: D.level };
      }
      return { s: "open" };
    }
    const D = doorFor(r, c, d);
    return { s: D.status, level: D.level };
  }

  // ------------------------------------------------------------------
  // Tirage de trois salles
  // ------------------------------------------------------------------
  function candidat(tpl, d, tr, tc) {
    const miroir = tpl.mirror && Math.random() < 0.5;
    const abs = [opp(d)];
    (tpl.doors || []).forEach((x) => {
      let rel = x;
      if (miroir) rel = x === "L" ? "R" : x === "R" ? "L" : "F";
      const dd = rel === "F" ? d : rel === "R" ? (d + 1) % 4 : (d + 3) % 4;
      const nr = tr + DIRS[dd].dr, nc = tc + DIRS[dd].dc;
      if (!inGrid(nr, nc)) return; // pas de porte sur le vide
      const voisin = G.grid[nr][nc];
      if (voisin && !voisin.doors.includes(opp(dd))) return; // mur en face
      abs.push(dd);
    });
    return { tpl, doors: abs, sorties: abs.length - 1 };
  }

  function poids(tpl) {
    if ((G.count[tpl.id] || 0) >= (tpl.max || 99)) return 0;
    if (tpl.fx && tpl.fx.fragment && G.fragments >= FRAGMENTS.length) return 0;
    return tpl.w;
  }

  function tirage(d, tr, tc) {
    for (let essai = 0; essai < 60; essai++) {
      const pool = SALLES.map((t) => ({ t, w: poids(t) })).filter((x) => x.w > 0);
      const choisies = [];
      while (choisies.length < 3 && pool.length) {
        const total = pool.reduce((s, x) => s + x.w, 0);
        let x = Math.random() * total, i = 0;
        for (; i < pool.length - 1; i++) {
          x -= pool[i].w;
          if (x <= 0) break;
        }
        choisies.push(pool[i].t);
        pool.splice(i, 1);
      }
      const cands = choisies.map((t) => candidat(t, d, tr, tc));
      const pieges = cands.filter((x) => x.tpl.kind === "trap").length;
      const avecSortie = cands.filter((x) => x.sorties > 0).length;
      if (cands.length === 3 && pieges <= 1 && avecSortie >= 2) return cands;
    }
    return [candidat(SALLES[0], d, tr, tc), candidat(SALLES[1], d, tr, tc), candidat(SALLES[3], d, tr, tc)];
  }

  // ------------------------------------------------------------------
  // Actions du joueur
  // ------------------------------------------------------------------
  function modalOpen() {
    return !document.getElementById("modal").hidden;
  }

  function tenter(d) {
    if (!G || G.over || modalOpen()) return;
    const { r, c } = G.pos;
    const e = edge(r, c, d);
    if (e.s === "wall") return;
    if (e.s === "open") return deplacer(d);
    if (e.s === "blocked") {
      log("Cette porte est condamnée : la serrure ne répond plus.");
      son("rature");
      return render();
    }
    if (e.s === "ajar") {
      log("La porte est entrouverte : personne ne l'a verrouillée.");
      return ouvrirTirage(d);
    }
    G.pending = { r, c, d, level: e.level };
    modalePorte();
  }

  function deplacer(d) {
    const r2 = G.pos.r + DIRS[d].dr, c2 = G.pos.c + DIRS[d].dc;
    const room = G.grid[r2][c2];
    G.steps -= 1;
    G.moves += 1;
    G.pos = { r: r2, c: c2 };
    son("page");
    if (!room.visited) {
      room.visited = true;
      appliquer(room);
    }
    if (room.goal) return finir("win");
    if (G.steps <= 0) return finir("steps");
    if (impasse()) return finir("stuck");
    render();
  }

  function appliquer(room) {
    const fx = room.tpl.fx;
    if (!fx) return;
    const morceaux = [];
    if (fx.steps) {
      G.steps = Math.max(0, G.steps + fx.steps);
      morceaux.push((fx.steps > 0 ? "+" : "−") + Math.abs(fx.steps) + " pas");
    }
    if (fx.dice) { G.dice += fx.dice; morceaux.push("+" + fx.dice + " dé"); }
    if (fx.seals) { G.seals += fx.seals; morceaux.push("+" + fx.seals + " sceau"); }
    if (fx.time) { G.timeBonus += fx.time; morceaux.push("+" + fx.time + " s par énigme"); }
    if (fx.fragment && G.fragments < FRAGMENTS.length) {
      G.fragments += 1;
      morceaux.push("un fragment du carnet de Valcourt");
    }
    log(room.tpl.nom + " : " + morceaux.join(", ") + ".");
    son(fx.steps < 0 ? "rature" : "crayon-note");
  }

  function ouvrirTirage(d) {
    const { r, c } = G.pos;
    const tr = r + DIRS[d].dr, tc = c + DIRS[d].dc;
    G.draft = { d, tr, tc, cands: tirage(d, tr, tc) };
    modaleTirage();
  }

  function choisir(i) {
    const D = G.draft;
    const cand = D.cands[i];
    G.grid[D.tr][D.tc] = { tpl: cand.tpl, doors: cand.doors, visited: false };
    G.count[cand.tpl.id] = (G.count[cand.tpl.id] || 0) + 1;
    G.rooms += 1;
    doorFor(G.pos.r, G.pos.c, D.d).status = "open";
    log("Porte " + (D.d === 0 || D.d === 2 ? "du " : "de l'") + DIRS[D.d].nom + " : vous choisissez « " + cand.tpl.nom + " ».");
    son("punaise");
    const d = D.d;
    G.draft = null;
    fermerModale();
    deplacer(d);
  }

  function relancer() {
    if (G.dice < 1) return;
    G.dice -= 1;
    const D = G.draft;
    D.cands = tirage(D.d, D.tr, D.tc);
    log("Vous jouez un dé : trois nouvelles salles.");
    son("clic");
    modaleTirage();
    render();
  }

  // Est-il encore possible d'aller quelque part ? Sinon, impasse.
  function impasse() {
    const vus = new Set();
    const file = [[G.pos.r, G.pos.c]];
    vus.add(G.pos.r + "," + G.pos.c);
    while (file.length) {
      const [r, c] = file.shift();
      for (let d = 0; d < 4; d++) {
        const e = edge(r, c, d);
        if (e.s === "locked" || e.s === "ajar") return false;
        if (e.s === "open") {
          const r2 = r + DIRS[d].dr, c2 = c + DIRS[d].dc;
          const k = r2 + "," + c2;
          if (!vus.has(k)) { vus.add(k); file.push([r2, c2]); }
        }
      }
    }
    return true;
  }

  function finir(raison) {
    G.over = raison;
    fermerModale();
    const s = stats();
    if (raison === "win") {
      s.wins = (s.wins || 0) + 1;
      if (G.steps > (s.best || 0)) s.best = G.steps;
      son("tampon");
    } else {
      son("rature");
    }
    saveStats(s);
    render();
    modaleFin();
  }

  // ------------------------------------------------------------------
  // Énigmes
  // ------------------------------------------------------------------
  function demarrerEnigme() {
    const P = G.pending;
    const p = makePuzzle(P.level);
    const total = (TEMPS_BASE[P.level] || 35) + G.timeBonus;
    pz = { puzzle: p, restant: total, total, fini: false };
    modaleEnigme();
    arreterChrono();
    timer = setInterval(() => {
      if (!pz || pz.fini) return arreterChrono();
      pz.restant -= 0.1;
      majChrono();
      if (pz.restant <= 0) resoudre(false, "Le temps est écoulé.");
    }, 100);
  }

  function arreterChrono() {
    if (timer) clearInterval(timer);
    timer = null;
  }

  function repondre(valeur) {
    if (!pz || pz.fini) return;
    const p = pz.puzzle;
    let ok;
    if (p.kind === "num") {
      const n = parseInt(String(valeur).replace(/\s+/g, ""), 10);
      ok = n === p.answer;
    } else ok = valeur === p.answer;
    resoudre(ok, ok ? "Le mécanisme cède." : "Mauvaise réponse.");
  }

  function resoudre(ok, message) {
    if (!pz || pz.fini) return;
    pz.fini = true;
    arreterChrono();
    const P = G.pending;
    const D = doorFor(P.r, P.c, P.d);
    const p = pz.puzzle;
    if (ok) {
      G.solved += 1;
      D.status = "open";
      log("Énigme résolue (" + p.label.toLowerCase() + ").");
      son("deblocage");
    } else {
      G.failed += 1;
      D.status = "blocked";
      log("Énigme ratée (" + p.label.toLowerCase() + ") : la porte est condamnée pour cette partie.");
      son("rature");
    }
    modaleResultat(ok, message);
    render();
  }

  function utiliserSceau() {
    if (G.seals < 1) return;
    G.seals -= 1;
    const P = G.pending;
    doorFor(P.r, P.c, P.d).status = "open";
    log("Vous posez un sceau sur la serrure : la porte s'ouvre d'elle-même.");
    son("deblocage");
    suiteApresPorte();
  }

  function suiteApresPorte() {
    const P = G.pending;
    const r2 = P.r + DIRS[P.d].dr, c2 = P.c + DIRS[P.d].dc;
    const d = P.d;
    G.pending = null;
    fermerModale();
    if (G.grid[r2][c2]) return deplacer(d); // la porte du fond : la chambre
    ouvrirTirage(d);
  }

  // ------------------------------------------------------------------
  // Dessin des salles (SVG)
  // ------------------------------------------------------------------
  const FOND = { pass: "#D9CDAE", bonus: "#C9D0B8", trap: "#DDB9AC", start: "#E4D8B4", goal: "#E3C77A" };
  const COTES = [
    { full: "M0 4H100", a: "M0 4H34", b: "M66 4H100", porte: [34, 0, 32, 8], h: true },
    { full: "M96 0V100", a: "M96 0V34", b: "M96 66V100", porte: [92, 34, 8, 32], h: false },
    { full: "M0 96H100", a: "M0 96H34", b: "M66 96H100", porte: [34, 92, 32, 8], h: true },
    { full: "M4 0V100", a: "M4 0V34", b: "M4 66V100", porte: [0, 34, 8, 32], h: false },
  ];

  function iconeDe(tpl) {
    if (tpl.kind === "start") return "🚪";
    if (tpl.kind === "goal") return "🦎";
    const fx = tpl.fx || {};
    const parts = [];
    if (fx.steps) parts.push((fx.steps > 0 ? "+" : "−") + Math.abs(fx.steps));
    if (fx.dice) parts.push("🎲");
    if (fx.seals) parts.push("🗝");
    if (fx.time) parts.push("⏳");
    if (fx.fragment) parts.push("📜");
    return parts.slice(0, 2).join(" ");
  }

  // cotes : tableau de 4 objets { s, level } (s = wall | gap | locked | ajar | blocked)
  function salleSVG(tpl, cotes, opts) {
    opts = opts || {};
    const fond = FOND[tpl.kind] || FOND.pass;
    let s = `<svg viewBox="0 0 100 100" class="room-svg" aria-hidden="true">`;
    s += `<rect width="100" height="100" fill="${fond}"/>`;
    s += `<rect x="12" y="12" width="76" height="76" fill="none" stroke="rgba(42,38,32,.13)" stroke-width="1.2"/>`;
    for (let d = 0; d < 4; d++) {
      const c = COTES[d], st = cotes[d] || { s: "wall" };
      const ouvert = st.s !== "wall";
      s += `<path d="${ouvert ? c.a + " " + c.b : c.full}" stroke="#2A2620" stroke-width="8" fill="none"/>`;
      if (!ouvert) continue;
      const [x, y, w, h] = c.porte;
      if (st.s === "locked") {
        s += `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="#7A5A34" stroke="#2A2620" stroke-width="1.5"/>`;
        for (let i = 0; i < st.level; i++) {
          const off = (i - (st.level - 1) / 2) * 8;
          const cx = c.h ? 50 + off : x + w / 2, cy = c.h ? y + h / 2 : 50 + off;
          s += `<circle cx="${cx}" cy="${cy}" r="2.4" fill="#E3C77A"/>`;
        }
      } else if (st.s === "ajar") {
        s += `<rect x="${x + (c.h ? 4 : 0)}" y="${y + (c.h ? 0 : 4)}" width="${c.h ? w - 8 : w}" height="${c.h ? h : h - 8}" fill="#B98B2A" stroke="#2A2620" stroke-width="1.2" opacity=".85"/>`;
      } else if (st.s === "blocked") {
        s += `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="#6E655A" stroke="#2A2620" stroke-width="1.5"/>`;
        s += `<path d="M${x + 2} ${y + 1}L${x + w - 2} ${y + h - 1}M${x + w - 2} ${y + 1}L${x + 2} ${y + h - 1}" stroke="#9A2B25" stroke-width="2.4"/>`;
      }
    }
    if (opts.entree !== undefined) {
      const f = [
        "M50 9L43 20H57Z", // entrée au nord : flèche vers le bas → on dessine un repère
        "M91 50L80 43V57Z",
        "M50 91L43 80H57Z",
        "M9 50L20 43V57Z",
      ][opts.entree];
      s += `<path d="${f}" fill="#9A2B25"/>`;
    }
    const icone = opts.icone !== undefined ? opts.icone : iconeDe(tpl);
    if (icone) {
      s += `<text x="50" y="48" text-anchor="middle" dominant-baseline="middle" font-size="${icone.length > 3 ? 20 : 25}" font-family="IBM Plex Mono, monospace" font-weight="600" fill="${tpl.kind === "trap" ? "#9A2B25" : "#2A2620"}">${icone}</text>`;
    }
    if (opts.nom) {
      s += `<text x="50" y="76" text-anchor="middle" font-size="10.5" font-family="IBM Plex Mono, monospace" fill="#524A3E">${esc(opts.nom)}</text>`;
    }
    return s + `</svg>`;
  }

  function coteEtat(r, c, d) {
    const e = edge(r, c, d);
    if (e.s === "open") return { s: "gap" };
    return e;
  }

  // ------------------------------------------------------------------
  // Affichage du plateau et de l'interface
  // ------------------------------------------------------------------
  function effetTexte(fx) {
    if (!fx) return "Aucun effet.";
    const p = [];
    if (fx.steps) p.push((fx.steps > 0 ? "+" : "−") + Math.abs(fx.steps) + " pas");
    if (fx.dice) p.push("+" + fx.dice + " dé");
    if (fx.seals) p.push("+" + fx.seals + " sceau");
    if (fx.time) p.push("+" + fx.time + " s par énigme");
    if (fx.fragment) p.push("un fragment du carnet de Valcourt");
    return p.join(", ") + ".";
  }

  function plateauHTML() {
    let h = `<div class="board" role="grid" aria-label="Plan du labyrinthe">`;
    for (let r = 0; r < ROWS; r++) {
      for (let c = 0; c < COLS; c++) {
        const room = G.grid[r][c];
        const cur = G.pos.r === r && G.pos.c === c;
        let cls = "cell";
        let contenu = "";
        let action = "";
        // Voisinage de la salle actuelle
        let d = -1;
        for (let k = 0; k < 4; k++) if (G.pos.r + DIRS[k].dr === r && G.pos.c + DIRS[k].dc === c) d = k;
        if (d >= 0 && !G.over) {
          const e = edge(G.pos.r, G.pos.c, d);
          if (e.s === "open") cls += " can-go";
          else if (e.s === "locked" || e.s === "ajar") cls += " can-open";
          if (e.s !== "wall") action = ` data-act="go" data-d="${d}"`;
        }
        if (room) {
          const cotes = [0, 1, 2, 3].map((k) => coteEtat(r, c, k));
          contenu = salleSVG(room.tpl, cotes, { nom: room.tpl.court });
          cls += " placed" + (room.visited ? "" : " unseen") + (room.goal ? " goal" : "");
          if (cur) {
            cls += " current";
            contenu += `<img class="pion" src="../img/salamandre.png" alt="Vous" onerror="this.outerHTML='<span class=&quot;pion-point&quot;></span>'">`;
          }
        } else cls += " empty";
        h += `<div class="${cls}" role="gridcell"${action}>${contenu}</div>`;
      }
    }
    return h + `</div>`;
  }

  function panneauHTML() {
    const room = G.grid[G.pos.r][G.pos.c];
    const pct = Math.max(0, Math.min(100, (G.steps / START_STEPS) * 100));
    const bas = G.steps <= 10;
    let h = `<div class="hud">
      <div class="hud-steps${bas ? " bas" : ""}">
        <span class="hud-label">Pas restants</span>
        <span class="hud-big">${G.steps}</span>
        <span class="bar"><span style="width:${pct}%"></span></span>
      </div>
      <div class="hud-items">
        <span class="chip" title="Dés : relancer un tirage de trois salles">🎲 <b>${G.dice}</b> <em>dé${G.dice > 1 ? "s" : ""}</em></span>
        <span class="chip" title="Sceaux : ouvrent une porte sans énigme">🗝 <b>${G.seals}</b> <em>sceau${G.seals > 1 ? "x" : ""}</em></span>
        <span class="chip" title="Temps bonus sur chaque énigme">⏳ <b>+${G.timeBonus}</b> <em>s</em></span>
      </div>
    </div>
    <section class="carte">
      <h3>Vous êtes ici</h3>
      <p class="salle-nom">${esc(room.tpl.nom)}</p>
      <p class="salle-desc">${esc(room.tpl.desc)}</p>
    </section>
    <section class="carte">
      <h3>Carnet de Valcourt <span class="compte">${G.fragments}/${FRAGMENTS.length}</span></h3>`;
    if (G.fragments === 0) h += `<p class="vide">Aucun fragment trouvé. Cherchez les archives, les fresques, le cabinet.</p>`;
    else {
      h += `<ol class="fragments">`;
      for (let i = G.fragments - 1; i >= 0; i--) h += `<li>${esc(FRAGMENTS[i])}</li>`;
      h += `</ol>`;
    }
    h += `</section>
    <section class="carte">
      <h3>Journal</h3>
      <ul class="journal" aria-live="polite">${G.log.slice(0, 6).map((l) => `<li>${esc(l)}</li>`).join("")}</ul>
    </section>`;
    return h;
  }

  function render() {
    const app = document.getElementById("app");
    document.body.classList.toggle("menu-mode", !G);
    if (!G) return (app.innerHTML = menuHTML());
    app.innerHTML = `
      <header class="entete">
        <div class="titre-mini"><span class="marque">Bureau des affaires occultes</span><h1>SEUIL</h1></div>
        <div class="entete-btns">
          <button class="petit" data-act="rules" title="Règles">?</button>
          <button class="petit" data-act="sound" title="Son">${muet ? "🔇" : "🔊"}</button>
          <button class="petit texte" data-act="menu">Menu</button>
        </div>
      </header>
      <main class="game">
        <div class="col-plateau">
          <div class="hud-mobile">${hudMobile()}</div>
          <div class="plateau-cadre">
            <div class="etiquette haut">Chambre des Gardiens</div>
            ${plateauHTML()}
            <div class="etiquette bas">Vestibule</div>
          </div>
          <p class="aide">Touchez une salle voisine, ou utilisez les flèches / ZQSD.</p>
        </div>
        <aside class="col-panneau">${panneauHTML()}</aside>
      </main>`;
  }

  function hudMobile() {
    const bas = G.steps <= 10;
    return `<span class="hm-steps${bas ? " bas" : ""}"><b>${G.steps}</b> pas</span>
      <span class="chip">🎲 <b>${G.dice}</b></span><span class="chip">🗝 <b>${G.seals}</b></span><span class="chip">⏳ <b>+${G.timeBonus}</b></span>
      <span class="chip">📜 <b>${G.fragments}/${FRAGMENTS.length}</b></span>`;
  }

  function menuHTML() {
    const s = stats();
    const rec = s.wins ? `Meilleur résultat : sortie avec ${s.best} pas restants · ${s.wins} victoire${s.wins > 1 ? "s" : ""} sur ${s.runs || s.wins} expédition${(s.runs || 0) > 1 ? "s" : ""}.` : s.runs ? `${s.runs} expédition${s.runs > 1 ? "s" : ""}, aucune sortie pour l'instant.` : "";
    return `<div class="menu">
      <div class="menu-fond"><img src="../img/menu-fond.jpg" alt="" onerror="this.remove()"></div>
      <div class="menu-inner">
        <p class="menu-marque">Bureau des affaires occultes</p>
        <img class="menu-sal" src="../img/salamandre.png" alt="" onerror="this.remove()">
        <h1 class="menu-titre">SEUIL</h1>
        <p class="menu-tag">Le labyrinthe des Gardiens. Chaque porte est une question. Chaque réponse ouvre un chemin, et le chemin se paie en pas.</p>
        <div class="menu-liste">
          <button class="menu-item" data-act="new"><span class="menu-label">Nouvelle expédition</span><span class="menu-sub">45 pas, un dé, un sceau, et un serrurier à retrouver</span></button>
          <button class="menu-item" data-act="rules"><span class="menu-label">Comment jouer</span><span class="menu-sub">Deux minutes de lecture</span></button>
        </div>
        <p class="menu-foot">${esc(rec)}</p>
        <p class="menu-foot">Prototype · Maison Paradoxe</p>
      </div>
    </div>`;
  }

  // ------------------------------------------------------------------
  // Fenêtres modales
  // ------------------------------------------------------------------
  function afficherModale(html, cls) {
    const m = document.getElementById("modal");
    m.className = "modal " + (cls || "");
    m.innerHTML = `<div class="modal-boite" role="dialog" aria-modal="true">${html}</div>`;
    m.hidden = false;
  }

  function fermerModale() {
    arreterChrono();
    const m = document.getElementById("modal");
    m.hidden = true;
    m.innerHTML = "";
  }

  function modalePorte() {
    const P = G.pending;
    const d = DIRS[P.d];
    const temps = (TEMPS_BASE[P.level] || 35) + G.timeBonus;
    const pips = "●".repeat(P.level) + "○".repeat(3 - P.level);
    afficherModale(`
      <p class="modal-sur">Porte du ${d.nom} ${d.fleche}</p>
      <h2>Une serrure sans clé</h2>
      <p class="niveau">Difficulté <span class="pips">${pips}</span></p>
      <p>Une seule tentative, ${temps} secondes. Si vous échouez, la porte est condamnée pour toute la partie.</p>
      <div class="boutons">
        <button class="btn principal" data-act="try">Tenter l'énigme</button>
        ${G.seals > 0 ? `<button class="btn" data-act="seal">Utiliser un sceau (${G.seals})</button>` : ""}
        <button class="btn lien" data-act="back">Revenir</button>
      </div>`);
  }

  function majChrono() {
    const f = document.getElementById("chrono-barre");
    const t = document.getElementById("chrono-texte");
    if (!f || !pz) return;
    const pct = Math.max(0, (pz.restant / pz.total) * 100);
    f.style.width = pct + "%";
    f.parentNode.classList.toggle("urgent", pz.restant <= 8);
    if (t) t.textContent = Math.max(0, Math.ceil(pz.restant)) + " s";
  }

  function modaleEnigme() {
    const p = pz.puzzle;
    let corps;
    if (p.kind === "num") {
      corps = `<p class="enonce${p.label === "Suite logique" ? " suite" : ""}">${esc(p.text)}</p>
        <form class="reponse" data-form="num" autocomplete="off">
          <input id="champ" type="text" inputmode="numeric" pattern="-?[0-9]*" autocomplete="off" aria-label="Votre réponse" placeholder="?">
          <button class="btn principal" type="submit">Valider</button>
        </form>`;
    } else {
      corps = `<p class="consigne">${esc(p.text)}</p>
        <div class="choix">${p.options.map((o, i) => `<button class="btn choix-btn" data-act="mcq" data-v="${esc(o)}"><kbd>${i + 1}</kbd> ${esc(o)}</button>`).join("")}</div>`;
    }
    afficherModale(`
      <p class="modal-sur">${esc(p.label)} · difficulté ${"●".repeat(p.level)}${"○".repeat(3 - p.level)}</p>
      <div class="chrono"><span id="chrono-barre"></span><span id="chrono-texte" class="chrono-texte"></span></div>
      ${corps}`, "enigme");
    majChrono();
    const champ = document.getElementById("champ");
    if (champ) champ.focus();
  }

  function modaleResultat(ok, message) {
    const p = pz.puzzle;
    const bonne = p.kind === "num" ? String(p.answer) : p.answer;
    const cible = G.grid[G.pending.r + DIRS[G.pending.d].dr][G.pending.c + DIRS[G.pending.d].dc];
    afficherModale(`
      <p class="modal-sur">${ok ? "Réussi" : "Raté"}</p>
      <h2 class="${ok ? "ok" : "ko"}">${esc(message)}</h2>
      ${ok ? "" : `<p>La bonne réponse était : <b>${esc(bonne)}</b>.</p><p>La porte est condamnée pour cette partie.</p>`}
      <div class="boutons"><button class="btn principal" data-act="after">${ok ? (cible ? "Franchir la porte" : "Choisir une salle") : "Continuer"}</button></div>`, ok ? "reussi" : "rate");
    const b = document.querySelector('[data-act="after"]');
    if (b) b.focus();
  }

  function modaleTirage() {
    const D = G.draft;
    const cartes = D.cands
      .map((cd, i) => {
        const cotes = [0, 1, 2, 3].map((k) => (cd.doors.includes(k) ? { s: "gap" } : { s: "wall" }));
        const fx = cd.tpl.fx;
        return `<button class="carte-salle ${cd.tpl.kind}" data-act="pick" data-i="${i}">
          <span class="mini">${salleSVG(cd.tpl, cotes, { entree: opp(D.d) })}</span>
          <span class="cs-nom">${esc(cd.tpl.nom)}</span>
          <span class="cs-desc">${esc(cd.tpl.desc)}</span>
          <span class="cs-fx">${esc(effetTexte(fx))}</span>
          <span class="cs-portes">${cd.sorties === 0 ? "Cul-de-sac" : cd.sorties + " sortie" + (cd.sorties > 1 ? "s" : "")}</span>
        </button>`;
      })
      .join("");
    afficherModale(
      `<p class="modal-sur">La porte du ${DIRS[D.d].nom} s'ouvre ${DIRS[D.d].fleche}</p>
       <h2>Choisissez la salle</h2>
       <div class="tirage">${cartes}</div>
       <div class="boutons">
         <button class="btn" data-act="reroll"${G.dice < 1 ? " disabled" : ""}>🎲 Relancer (${G.dice})</button>
       </div>
       <p class="note">Le haut de chaque plan est le nord. Le triangle rouge marque l'entrée ; les autres ouvertures sont les sorties possibles.</p>`,
      "tirage-modal"
    );
  }

  function modaleFin() {
    const win = G.over === "win";
    const titre = win ? "Vous êtes sorti vivant… et arrivé." : G.over === "steps" ? "Plus un pas." : "Il n'y a plus de porte.";
    const texte = win
      ? "Vous atteignez la chambre des Gardiens. Sur la table, le carnet de Valcourt, ouvert. La dernière page a été arrachée. Une tasse est encore tiède."
      : G.over === "steps"
      ? "Vos pas sont comptés, et ils sont finis. Les Gardiens referment le seuil. Le labyrinthe se recompose : la prochaine fois, ses portes seront ailleurs."
      : "Toutes les portes ouvertes ne mènent nulle part, et toutes les autres sont condamnées. Le labyrinthe vous garde.";
    afficherModale(`
      <p class="modal-sur">${win ? "Fin de l'expédition" : "Expédition terminée"}</p>
      <h2 class="${win ? "ok" : "ko"}">${titre}</h2>
      <p>${texte}</p>
      <ul class="bilan">
        <li><b>${G.steps}</b> pas restants</li>
        <li><b>${G.rooms}</b> salles ouvertes</li>
        <li><b>${G.solved}</b> énigmes résolues, <b>${G.failed}</b> ratées</li>
        <li><b>${G.fragments}/${FRAGMENTS.length}</b> fragments du carnet</li>
      </ul>
      <div class="boutons">
        <button class="btn principal" data-act="new">Rejouer</button>
        <button class="btn lien" data-act="menu">Menu</button>
      </div>`, win ? "reussi" : "rate");
  }

  function modaleRegles() {
    afficherModale(`
      <p class="modal-sur">Comment jouer</p>
      <h2>Règles de l'expédition</h2>
      <ol class="regles">
        <li><b>Objectif :</b> atteindre la <b>Chambre des Gardiens</b>, tout en haut du plan, en partant du vestibule tout en bas.</li>
        <li><b>Chaque pas coûte 1.</b> Traverser une porte, même pour revenir en arrière, consomme un pas. À zéro, l'expédition s'arrête.</li>
        <li><b>Les portes sont scellées.</b> Une porte verrouillée pose une énigme chronométrée : calcul, suite logique, orthographe. Trois niveaux de difficulté, de plus en plus durs en montant.</li>
        <li><b>Une seule chance.</b> Rater ou laisser filer le temps condamne la porte pour toute la partie. Si vous résolvez l'énigme, vous choisissez <b>une salle parmi trois</b>.</li>
        <li><b>Le plan se construit.</b> La salle choisie est posée derrière la porte, avec ses propres portes. Certaines rapportent des pas, des dés, des sceaux, du temps, des fragments du carnet de Valcourt. D'autres coûtent cher.</li>
        <li><b>Dés et sceaux.</b> Un dé relance le tirage de trois salles. Un sceau ouvre une porte sans énigme.</li>
        <li><b>Impasse :</b> si plus aucune porte n'est accessible, l'expédition est perdue.</li>
      </ol>
      <div class="boutons"><button class="btn principal" data-act="close">Compris</button></div>`, "regles");
  }

  // ------------------------------------------------------------------
  // Événements
  // ------------------------------------------------------------------
  document.addEventListener("click", (ev) => {
    const el = ev.target.closest("[data-act]");
    if (!el) return;
    const act = el.getAttribute("data-act");
    switch (act) {
      case "new":
        fermerModale();
        nouvellePartie();
        son("page-journal");
        render();
        break;
      case "menu":
        fermerModale();
        G = null;
        render();
        break;
      case "rules":
        modaleRegles();
        break;
      case "close":
        fermerModale();
        break;
      case "sound":
        muet = !muet;
        try {
          localStorage.setItem("seuil-muet", muet ? "1" : "0");
        } catch (e) {}
        render();
        break;
      case "go":
        tenter(parseInt(el.getAttribute("data-d"), 10));
        break;
      case "try":
        demarrerEnigme();
        break;
      case "seal":
        utiliserSceau();
        break;
      case "back":
        G.pending = null;
        fermerModale();
        break;
      case "mcq":
        repondre(el.getAttribute("data-v"));
        break;
      case "after":
        if (pz && pz.fini) {
          const ok = G.doors[edgeKey(G.pending.r, G.pending.c, G.pending.d)].status === "open";
          pz = null;
          if (ok) suiteApresPorte();
          else {
            G.pending = null;
            fermerModale();
            if (G.steps <= 0) finir("steps");
            else if (impasse()) finir("stuck");
          }
        }
        break;
      case "pick":
        choisir(parseInt(el.getAttribute("data-i"), 10));
        break;
      case "reroll":
        relancer();
        break;
    }
  });

  document.addEventListener("submit", (ev) => {
    if (ev.target.getAttribute("data-form") === "num") {
      ev.preventDefault();
      const v = document.getElementById("champ").value.trim();
      if (v !== "") repondre(v);
    }
  });

  document.addEventListener("keydown", (ev) => {
    const ouverte = modalOpen();
    if (ouverte) {
      const enCours = pz && !pz.fini;
      if (ev.key === "Escape" && !enCours && !(G && G.draft) && !(G && G.over)) {
        if (G) G.pending = null;
        fermerModale();
      } else if (pz && !pz.fini && pz.puzzle.kind === "mcq" && /^[1-3]$/.test(ev.key)) repondre(pz.puzzle.options[parseInt(ev.key, 10) - 1]);
      else if (G && G.draft && /^[1-3]$/.test(ev.key)) choisir(parseInt(ev.key, 10) - 1);
      return;
    }
    if (!G || G.over) return;
    const map = { ArrowUp: 0, w: 0, z: 0, ArrowRight: 1, d: 1, ArrowDown: 2, s: 2, ArrowLeft: 3, a: 3, q: 3 };
    if (ev.key in map) {
      ev.preventDefault();
      tenter(map[ev.key]);
    }
  });

  render();

  // Petit accès pour les essais dans la console du navigateur
  window.SEUIL = { get partie() { return G; }, get enigme() { return pz && pz.puzzle; } };
})();
