// Vérifie data.json puis régénère data.js.
// Usage, depuis le dossier du jeu :  node outils/verifier.js
//
// Contrôles :
//  - chaque balise {{p|l|d:id|texte}}, chaque note du carnet, chaque déblocage,
//    chaque puzzle et chaque entrée Minitel renvoie à quelque chose qui existe ;
//  - on simule une partie où le joueur lit tout ce qu'il peut (puzzles résolus,
//    Minitel consulté pour les noms connus) : tout doit finir par apparaître ;
//  - le chemin de référence (referencePath) est jouable dans l'ordre ;
//  - l'article à trous : chaque blanc a une réponse qui existe, que le chemin
//    de référence permet de trouver, avec au moins deux mots possibles ;
//  - les fins sont cohérentes.

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
    const actions = new Map((cs.actions || []).map((x) => [x.id, x]));
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
      if (c.follows && !clues.has(c.follows)) err(w, "suite d'une piste inconnue « " + c.follows + " »");
      if (c.follows && (!c.buttonAlone || !c.titleAlone)) err(w, "suite sans bouton ni titre pour le cas où le premier entretien n'a pas eu lieu");
      if (c.puzzle && !puzzles[c.puzzle]) err(w, "puzzle inconnu « " + c.puzzle + " »");
      (c.revealsActions || []).forEach((a) => actions.has(a) || err(w, "révèle un mot d'action inconnu « " + a + " »"));
      checkText(w, c.text);
      checkFacts(w, c.facts);
    });
    Object.entries(puzzles).forEach(([id, pz]) => {
      const w = "puzzle " + id;
      if (!pz.help) err(w, "sans aide : il pourrait bloquer l'enquête");
      if (pz.type === "fragments" && !(pz.pieces || []).length) err(w, "aucun morceau");
      if (pz.type === "line" && !(pz.lines || []).some((l) => !l.qui)) err(w, "aucune ligne gagnante");
      if (pz.type === "code" && String(pz.code).length !== (pz.digits || 4)) err(w, "le code n'a pas le bon nombre de chiffres");
      if (pz.type === "grille") {
        const tem = (pz.temoins || []).map((t) => t.id);
        const sol = pz.solution || {};
        if (!tem.includes(sol.menteur)) err(w, "le menteur n'est pas un des témoins");
        (pz.categories || []).forEach((cat) => {
          const vals = (cat.valeurs || []).map((v) => v.id);
          const pris = tem.map((t) => (sol[cat.id] || {})[t]);
          if (vals.length !== tem.length) err(w, "« " + cat.id + " » n'a pas autant de valeurs que de témoins");
          if (pris.some((v) => !vals.includes(v)) || new Set(pris).size !== tem.length) err(w, "la solution de « " + cat.id + " » n'attribue pas une valeur différente à chaque témoin");
        });
        if (!(pz.declarations || []).some((d) => d.qui === sol.menteur)) err(w, "le menteur ne dit rien");
        if (!(pz.questions || []).length) err(w, "Paul ne pose aucune question");
        (pz.questions || []).forEach((q) => {
          const choix =
            q.choix === "temoins" ? tem
            : Array.isArray(q.choix) ? q.choix.map((c) => c.id)
            : ((pz.categories || []).find((c) => c.id === q.choix) || { valeurs: [] }).valeurs.map((v) => v.id);
          if (!choix.includes(q.reponse)) err(w, "la réponse à « " + q.texte + " » ne fait pas partie des choix");
        });
      }
      checkText(w, pz.result);
      checkFacts(w, pz.facts);
    });
    (cs.minitel || []).forEach((e, i) =>
      (e.reveals || []).forEach((key) => exists(key[0], key.slice(2)) || err("Minitel " + (e.keys || [])[0], "révèle « " + key + " » inconnu"))
    );
    const blanks = [];
    (cs.article || []).forEach((par) => par.parts.forEach((x) => typeof x === "object" && blanks.push(Object.assign({ par: par.id }, x))));
    if (!blanks.length) err("article", "aucun blanc");
    const qs = new Set(blanks.map((b) => b.q));
    blanks.forEach((b) => {
      const ok = b.type === "a" ? actions.has(b.answer) : exists(b.type, b.answer);
      if (!ok) err("article, blanc " + b.id, "la réponse « " + b.type + ":" + b.answer + " » n'existe pas");
    });
    (cs.endings || []).forEach((e) => Object.keys(e.when || {}).forEach((q) => qs.has(q) || err("fin " + e.id, "question inconnue " + q)));
    Object.keys(cs.complements || {}).forEach((q) => qs.has(q) || err("complément " + q, "aucun blanc ne décide de cette question"));

    // 2. Simulation
    function knowledge(read, solved, minitel) {
      const k = { p: new Set(), l: new Set(), d: new Set(), a: new Set() };
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
        (c.revealsActions || []).forEach((x) => k.a.add(x));
        if (c.puzzle && solved.has(c.puzzle)) absorb(puzzles[c.puzzle].result);
      });
      minitel.forEach((i) => {
        const e = cs.minitel[i];
        if (e.about && !k[e.about[0]].has(e.about.slice(2))) return;
        (e.reveals || []).forEach((key) => k[key[0]].add(key.slice(2)));
      });
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
      !cs.clues.some((x) => x.follows === c.id && read.has(x.id)) &&
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
    (cs.minitel || []).forEach((e, i) => e.about && !chars.has(e.about.slice(2)) && err("minitel " + i, "rattaché à une personne inconnue « " + e.about + " »"));

    if (cs.referencePath) {
      const read = new Set(), solved = new Set(), minitel = new Set();
      cs.referencePath.forEach((id) => {
        const c = clues.get(id);
        if (!c) return err("chemin de référence", "piste inconnue " + id);
        let k = knowledge(read, solved, minitel);
        searchMinitel(k, minitel);
        k = knowledge(read, solved, minitel);
        if (!available(c, k, read)) err("chemin de référence", "« " + id + " » n'est pas encore accessible à ce moment");
        read.add(id);
        if (c.puzzle) solved.add(c.puzzle);
      });
      if (cs.referencePath.length >= cs.totalLeads) err("chemin de référence", "il consomme toutes les pistes accordées");
      // Au bout du chemin de référence, chaque blanc doit pouvoir être rempli juste,
      // et il doit y avoir au moins deux mots possibles (sinon le blanc est gratuit).
      let k = knowledge(read, solved, minitel);
      searchMinitel(k, minitel);
      k = knowledge(read, solved, minitel);
      blanks.forEach((b) => {
        if (!k[b.type].has(b.answer)) err("article, blanc " + b.id, "« " + b.answer + " » n'est pas trouvable par le chemin de référence");
        if (k[b.type].size < 2) warn("article, blanc " + b.id, "un seul mot possible : le blanc est gratuit");
      });
      console.log("  Chemin de référence : " + cs.referencePath.length + " pistes sur " + cs.totalLeads + " accordées.");
    }
    const start = knowledge(new Set(), new Set(), new Set());
    start.a.forEach((a) => warn("mot d'action " + a, "disponible dès le départ"));
    actions.forEach((a, id) => all.k.a.has(id) || err("mot d'action " + id, "jamais débloqué"));
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
