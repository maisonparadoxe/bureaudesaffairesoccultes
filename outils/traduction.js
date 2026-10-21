// Traduction anglaise des données du jeu.
//
// Usage, depuis le dossier du jeu :
//   node outils/traduction.js            construit data-en.json et data-en.js
//   node outils/traduction.js manquants  écrit dans traduction/a-traduire.txt
//                                        les textes sans traduction ou dont le
//                                        français a changé depuis
//
// Les traductions sont dans traduction/en.txt, une entrée par texte :
//
//   === feu_ferreol/clues/archives/text #3f2a9c1b
//   Texte anglais…
//
// La clé suit la structure de data.json (les identifiants plutôt que les
// positions quand il y en a). Le code après # est l'empreinte du texte
// français au moment de la traduction : s'il ne correspond plus, le français
// a été modifié et la traduction est à revoir.
//
// Les balises {{p|l|d:id|texte}} doivent garder les mêmes identifiants, dans
// le même nombre ; seul le texte affiché se traduit.

const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

const root = path.join(__dirname, "..");
const data = JSON.parse(fs.readFileSync(path.join(root, "data.json"), "utf8"));
const enFile = path.join(root, "traduction", "en.txt");

// Champs qui ne contiennent que des identifiants ou des données techniques
const TECH = new Set([
  "id", "about", "struckBy", "locationId", "ambience", "follows", "mood", "puzzle", "requires", "requiresAny",
  "revealsActions", "revealsCharacters", "revealsLocations", "speaker", "type", "answer", "q", "music", "quartier",
  "reveals", "d", "shape", "keys", "status", "weather", "code", "numero", "referencePath", "portrait",
  "requiresPuzzle", "timeout", "reponse"
]);

const hash = (s) => crypto.createHash("sha1").update(s).digest("hex").slice(0, 8);
const TAG_RE = /\{\{(p|l|d):([^}|]+)(?:\|([^}]+))?\}\}/g;
const tagIds = (s) => (String(s).match(TAG_RE) || []).map((m) => m.replace(TAG_RE, (x, t, a, b) => t + ":" + (b === undefined ? "" : a.trim()))).sort().join(",");

// Parcourt data et appelle fn(clé, texte, remplacer) pour chaque texte à traduire
function walk(o, key, fn, parent, prop) {
  if (typeof o === "string") return fn(key, o, (v) => (parent[prop] = v));
  if (Array.isArray(o)) return o.forEach((v, i) => walk(v, key + "/" + (v && typeof v === "object" && v.id ? v.id : i), fn, o, i));
  if (o && typeof o === "object")
    Object.keys(o).forEach((k) => {
      const v = o[k];
      const objet = v && typeof v === "object" && !Array.isArray(v);
      // un champ technique ne se saute que s'il porte une valeur (puzzles.portrait est un objet à traduire)
      if (TECH.has(k) && !objet) return;
      if (k === "solution" && objet) return; // solutions de grille et de portrait : des identifiants
      if (k === "qui" && /^[a-z_0-9]+$/.test(v)) return; // déclarations de grille : l'identifiant du témoin
      walk(v, key ? key + "/" + k : k, fn, o, k);
    });
}
function walkData(d, fn) {
  walk(d.gameTitle, "gameTitle", fn, d, "gameTitle");
  walk(d.credits, "credits", fn, d, "credits");
  walk(d.prologue, "prologue", fn, d, "prologue");
  d.cities.forEach((city) => {
    walk(city.name, "villes/" + city.id, fn, city, "name");
    city.cases.forEach((cs) => walk(cs, cs.id, fn));
  });
}

function readTranslations() {
  const out = new Map();
  if (!fs.existsSync(enFile)) return out;
  const txt = fs.readFileSync(enFile, "utf8").replace(/\r/g, "");
  txt.split(/^=== /m).slice(1).forEach((block) => {
    const nl = block.indexOf("\n");
    const head = block.slice(0, nl).trim();
    const m = head.match(/^(\S+)(?:\s+#([0-9a-f]+))?$/);
    if (!m) return;
    out.set(m[1], { hash: m[2] || "", text: block.slice(nl + 1).replace(/\n+$/, "") });
  });
  return out;
}

const tr = readTranslations();
const mode = process.argv[2] || "construire";
const en = JSON.parse(JSON.stringify(data));
const missing = [];
const stale = [];
const errors = [];
const used = new Set();

walkData(en, (key, fr, set) => {
  const t = tr.get(key);
  // Nombres, heures, ponctuation : rien à traduire, sauf si en.txt en donne une version
  if (!t && !/[A-Za-zÀ-ÿ]/.test(fr)) return;
  if (!t) return missing.push({ key, fr });
  used.add(key);
  if (t.hash && t.hash !== hash(fr)) stale.push({ key, fr, en: t.text });
  if (tagIds(fr) !== tagIds(t.text)) errors.push(key + " : balises différentes du français (" + tagIds(fr) + " / " + tagIds(t.text) + ")");
  // Les espaces en début et en fin (morceaux de l'article à trous) suivent le français,
  // car un éditeur de texte les efface facilement en fin de ligne
  const lead = fr.match(/^\s*/)[0];
  const trail = /\S/.test(fr) ? fr.match(/\s*$/)[0] : "";
  set(/\S/.test(fr) && t.text.trim() ? lead + t.text.trim() + trail : t.text || " ");
});
const orphans = [...tr.keys()].filter((k) => !used.has(k));

console.log(tr.size + " traductions lues, " + missing.length + " manquantes, " + stale.length + " à revoir, " + orphans.length + " orphelines.");
errors.forEach((e) => console.log("  ERREUR " + e));
orphans.forEach((k) => console.log("  ORPHELINE " + k + " (le texte n'existe plus en français)"));

if (mode === "manquants") {
  const lines = [];
  missing.forEach((m) => lines.push("=== " + m.key + " #" + hash(m.fr), m.fr, ""));
  stale.forEach((m) => lines.push("=== " + m.key + " #" + hash(m.fr), "[FRANÇAIS MODIFIÉ, ancienne traduction : " + m.en + "]", m.fr, ""));
  fs.mkdirSync(path.dirname(enFile), { recursive: true });
  fs.writeFileSync(path.join(root, "traduction", "a-traduire.txt"), lines.join("\n"), "utf8");
  console.log("traduction/a-traduire.txt écrit : à traduire puis à recopier dans en.txt.");
  process.exit(0);
}

missing.forEach((m) => console.log("  MANQUANTE " + m.key));
stale.forEach((m) => console.log("  À REVOIR " + m.key + " (le français a changé)"));
if (errors.length) {
  console.log("data-en.json NON construit tant qu'il reste des erreurs.");
  process.exit(1);
}
fs.writeFileSync(path.join(root, "data-en.json"), JSON.stringify(en, null, 2) + "\n", "utf8");
fs.writeFileSync(
  path.join(root, "data-en.js"),
  "// Copie embarquée de data-en.json (version anglaise), pour un fonctionnement sans serveur.\n" +
    "// Ne pas modifier à la main : lancer  node outils/traduction.js  après chaque changement.\n" +
    "window.GAME_DATA_FALLBACK_EN = " + JSON.stringify(en, null, 2) + ";\n",
  "utf8"
);
console.log("data-en.json et data-en.js construits" + (missing.length ? " (les textes manquants restent en français)." : "."));
