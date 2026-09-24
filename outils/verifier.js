// Vérifie data.json puis régénère data.js.
// Usage, depuis le dossier du jeu :  node outils/verifier.js
//
// Contrôles :
//  - chaque balise {{p|l|d:id|texte}}, chaque note du carnet, chaque déblocage,
//    chaque puzzle et chaque entrée Minitel renvoie à quelque chose qui existe ;
//  - on simule une partie où le joueur lit tout ce qu'il peut (puzzles résolus,
//    Minitel consulté pour les noms connus) : tout doit finir par apparaître ;
//  - la « solution de Mathilde » (referencePath) est jouable dans l'ordre ;
//  - le questionnaire et les fins sont cohérents.

const fs = require("fs");
const path = require("path");

const root = path.join(__dirname, "..");
const data = JSON.parse(fs.readFileSync(path.join(root, "data.json"), "utf8"));

const TAG_RE = /\{\{(p|l|d):([^}|]+)(?:\|([^}]+))?\}\}/g;
let errors = 0;
let warnings = 0;
const err = (w, m) => { errors++; console.log("  ERREUR    " + w + " : " + m); };
const warn = (w, m) => { warnings++; console.log("  ATTENTION " + w + " : " + m); };

function tagsOf(text) {
  const out = [];
  String(text || "").replace(TAG_RE, (m, type, a, b) => {
    out.push(b === undefined ? { type, id: null, label: a } : { type, id: a.trim(), label: b });
    return m;
  });
  return out;
}
const norm = (s) => String(s || "").toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-z ]/g, " ").replace(/\s+/g, " ").trim();

data.cities.filter((c) => c.status === "available").forEach((city) => {
  city.cases.forEach((cs) => {
    console.log("\n" + city.name + " / " + cs.title);
    const chars = new Map(cs.characters.map((x) => [x.id, x]));
    const locs = new Map(cs.locations.map((x) => [x.id, x]));
    const docs = new Map((cs.documents || []).map((x) => [x.id, x]));
    const clues = new Map(cs.clues.map((x) => [x.id, x]));
    const quartiers = new Set(cs.quartiers.map((q) => q.id));
    const puzzles = cs.puzzles || {};
    const exists = (type, id) =>
      (type === "p" && chars.has(id)) || (type === "l" && (locs.has(id) || quartiers.has(id))) || (type === "d" && docs.has(id));

    const checkText = (where, text) =>
      tagsOf(text).forEach((t) => {
        if (!t.id) warn(where, "balise sans identifiant « " + t.label + " »");
        else if (!exists(t.type, t.id)) err(where, "{{" + t.type + ":" + t.id + "}} ne correspond à aucune fiche");
      });
    const checkFacts = (where, facts) =>
      (facts || []).forEach((f, i) => {
        const [t, id] = String(f.about || ":").split(":");
        if (!exists(t, id) || t === "l" && !locs.has(id)) err(where + ", note " + (i + 1), "fiche inconnue « " + f.about + " »");
        (f.struckBy || []).forEach((c) => clues.has(c) || err(where + ", note " + (i + 1), "barrée par une piste inconnue « " + c + " »"));
        checkText(where + ", note " + (i + 1), f.text);
      });

    // 1. Références
    cs.locations.forEach((l) => quartiers.has(l.quartier) || err("lieu " + l.id, "quartier inconnu"));
    cs.characters.forEach((ch) => !ch.locationId || locs.has(ch.locationId) || err("personnage " + ch.id, "lieu inconnu"));
    checkText("intro", cs.intro);
    checkFacts("intro", cs.introNotes);
    cs.clues.forEach((c) => {
      const w = "piste " + c.id;
      if (!locs.has(c.locationId)) err(w, "lieu inconnu");
      (c.requires || []).concat(c.requiresAny || []).forEach((r) => clues.has(r) || err(w, "débloquée par une piste inconnue « " + r + " »"));
      if (c.puzzle && !puzzles[c.puzzle]) err(w, "puzzle inconnu « " + c.puzzle + " »");
      checkText(w, c.text);
      checkFacts(w, c.facts);
    });
    Object.entries(puzzles).forEach(([id, pz]) => {
      const w = "puzzle " + id;
      if (!pz.help) err(w, "sans aide : il pourrait bloquer l'enquête");
      if (pz.type === "fragments" && !(pz.pieces || []).length) err(w, "aucun morceau");
      if (pz.type === "line" && !(pz.lines || []).some((l) => !l.qui)) err(w, "aucune ligne gagnante");
      if (pz.type === "code" && String(pz.code).length !== (pz.digits || 4)) err(w, "le code n'a pas le bon nombre de chiffres");
      checkText(w, pz.result);
      checkFacts(w, pz.facts);
    });
    (cs.minitel || []).forEach((e, i) =>
      (e.reveals || []).forEach((key) => exists(key[0], key.slice(2)) || err("Minitel " + (e.keys || [])[0], "révèle « " + key + " » inconnu"))
    );
    (cs.questions || []).forEach((q) => q.choices.includes(q.answer) || err("question " + q.id, "la bonne réponse n'est pas parmi les choix"));
    (cs.endings || []).forEach((e) =>
      Object.keys(e.when || {}).forEach((q) => (cs.questions || []).some((x) => x.id === q) || err("fin " + e.id, "question inconnue " + q))
    );

    // 2. Simulation
    function knowledge(read, solved, minitel) {
      const k = { p: new Set(), l: new Set(), d: new Set() };
      const absorb = (text) => tagsOf(text).forEach((t) => t.id && k[t.type].add(t.id));
      cs.characters.forEach((ch) => ch.alwaysRevealed && k.p.add(ch.id));
      cs.locations.forEach((l) => l.alwaysRevealed && k.l.add(l.id));
      absorb(cs.intro);
      read.forEach((id) => {
        const c = clues.get(id);
        k.l.add(c.locationId);
        absorb(c.text);
        (c.revealsCharacters || []).forEach((x) => k.p.add(x));
        (c.revealsLocations || []).forEach((x) => k.l.add(x));
        if (c.puzzle && solved.has(c.puzzle)) absorb(puzzles[c.puzzle].result);
      });
      minitel.forEach((i) => (cs.minitel[i].reveals || []).forEach((key) => k[key[0]].add(key.slice(2))));
      k.p.forEach((id) => {
        const ch = chars.get(id);
        if (ch && ch.locationId && !ch.minitel) k.l.add(ch.locationId);
      });
      k.l = new Set([...k.l].filter((id) => locs.has(id)));
      return k;
    }
    // Le joueur tape au Minitel le nom de famille des personnes qu'il connaît
    function searchMinitel(k, minitel) {
      (cs.minitel || []).forEach((e, i) => {
        if (minitel.has(i)) return;
        const known = [...k.p].some((id) => norm(chars.get(id).name).split(" ").some((w) => e.keys.includes(w)));
        if (known) minitel.add(i);
      });
    }
    const available = (c, k, read) =>
      k.l.has(c.locationId) &&
      (c.requires || []).every((r) => read.has(r)) &&
      (!c.requiresAny || c.requiresAny.some((r) => read.has(r)));

    function playAll() {
      const read = new Set(), solved = new Set(), minitel = new Set();
      let changed = true;
      while (changed) {
        changed = false;
        let k = knowledge(read, solved, minitel);
        const before = minitel.size;
        searchMinitel(k, minitel);
        if (minitel.size > before) { changed = true; k = knowledge(read, solved, minitel); }
        cs.clues.forEach((c) => {
          if (!read.has(c.id) && available(c, k, read)) { read.add(c.id); changed = true; }
          if (read.has(c.id) && c.puzzle && !solved.has(c.puzzle)) { solved.add(c.puzzle); changed = true; }
        });
      }
      return { read, k: knowledge(read, solved, minitel) };
    }
    const all = playAll();
    cs.locations.forEach((l) => all.k.l.has(l.id) || err("lieu " + l.id, "jamais révélé, impossible à atteindre"));
    cs.characters.forEach((ch) => all.k.p.has(ch.id) || warn("personnage " + ch.id, "jamais mentionné"));
    docs.forEach((d, id) => all.k.d.has(id) || warn("pièce " + id, "jamais trouvée"));
    cs.clues.forEach((c) => all.read.has(c.id) || err("piste " + c.id, "inaccessible"));

    if (cs.referencePath) {
      const read = new Set(), solved = new Set(), minitel = new Set();
      cs.referencePath.forEach((id) => {
        const c = clues.get(id);
        if (!c) return err("solution de Mathilde", "piste inconnue " + id);
        let k = knowledge(read, solved, minitel);
        searchMinitel(k, minitel);
        k = knowledge(read, solved, minitel);
        if (!available(c, k, read)) err("solution de Mathilde", "« " + id + " » n'est pas encore accessible à ce moment");
        read.add(id);
        if (c.puzzle) solved.add(c.puzzle);
      });
      if (cs.referencePath.length >= cs.totalLeads) err("solution de Mathilde", "elle consomme toutes les pistes accordées");
      console.log("  Solution de Mathilde : " + cs.referencePath.length + " pistes sur " + cs.totalLeads + " accordées.");
    }
    const start = knowledge(new Set(), new Set(), new Set());
    console.log("  " + start.l.size + " lieu(x) connu(s) au départ sur " + cs.locations.length + ", " + all.read.size + "/" + cs.clues.length + " pistes atteignables.");
  });
});

console.log("\n" + errors + " erreur(s), " + warnings + " avertissement(s).");
if (errors === 0) {
  const js =
    "// Copie embarquée de data.json, pour un fonctionnement sans serveur (ouverture directe du fichier).\n" +
    "// Ne pas modifier à la main : lancer  node outils/verifier.js  après chaque changement de data.json.\n" +
    "window.GAME_DATA_FALLBACK = " + JSON.stringify(data, null, 2) + ";\n";
  fs.writeFileSync(path.join(root, "data.js"), js, "utf8");
  console.log("data.js régénéré.");
} else {
  console.log("data.js NON régénéré tant qu'il reste des erreurs.");
  process.exitCode = 1;
}
