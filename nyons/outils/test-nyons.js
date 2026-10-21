// Joue l'affaire de Nyons par l'interface, comme un joueur.
// node nyons.js <dossier du jeu> <dossier des captures> <scenario>
//   ref     : chemin de référence, poursuite laissée au temps, article juste
//   frapper : Karim saute sur l'homme (−4 pistes), on lit des pistes en plus, firmin perdu
//   faux    : article qui accuse Royer
const { chromium } = require("playwright-core");
const path = require("path");
const fs = require("fs");

const [dir, out, scenario = "ref", lang = "fr"] = process.argv.slice(2);
fs.mkdirSync(out, { recursive: true });
const url = "file://" + path.resolve(dir, "index.html");
const data = JSON.parse(fs.readFileSync(path.join(dir, lang === "en" ? "data-en.json" : "data.json"), "utf8"));
const city = data.cities.find((c) => c.id === "nyons");
const cs = city.cases[0];
const clue = (id) => cs.clues.find((c) => c.id === id);
const errors = [];
const done = new Set();
const loc = (id) => cs.locations.find((l) => l.id === id);

(async () => {
  const browser = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium_headless_shell-1194/chrome-linux/headless_shell" });
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  
  page.on("pageerror", (e) => errors.push("pageerror: " + e.message));
  page.on("console", (m) => m.type() === "error" && !/Failed to load resource|net::ERR/.test(m.text()) && errors.push("console: " + m.text()));
  page.on("dialog", (d) => d.accept());
  await page.addInitScript((l) => {
    localStorage.setItem("bao-langue", l);
    localStorage.setItem("bao-visuel-v1", JSON.stringify({ anim: false }));
  }, lang);
  let n = 0;
  const shot = async (name) => page.screenshot({ path: path.join(out, String(++n).padStart(2, "0") + "-" + name + ".png"), fullPage: true });
  const click = async (sel, text) => {
    const l = text ? page.locator(sel, { hasText: text }).first() : page.locator(sel).first();
    await l.click();
    await page.waitForTimeout(120);
  };
  const leads = async () => page.evaluate(() => (document.querySelector(".leads-count, .pistes-restantes, .hud-leads") || {}).textContent || "");
  const goTo = async (locId) => {
    const l = loc(locId);
    const q = cs.quartiers.find((x) => x.id === l.quartier);
    await click(".nav-item:not(.tag-lieu-nav)", q.name);
    if (!(await page.locator(".nav-item.tag-lieu-nav", { hasText: l.name }).count())) {
      const e = (cs.minitel || []).find((x) => (x.reveals || []).includes("l:" + locId));
      if (e) {
        await click(".minitel-btn");
        await page.fill(".minitel-form input", e.keys[0]);
        await page.press(".minitel-form input", "Enter");
        await page.waitForTimeout(200);
        await shot("minitel-" + e.keys[0]);
        await click(".nav-item:not(.tag-lieu-nav)", q.name);
      }
    }
    await click(".nav-item.tag-lieu-nav", l.name);
  };
  const read = async (id, tag) => {
    const c = clue(id);
    await goTo(c.locationId);
    const lab = c.follows && c.buttonAlone && !done.has(c.follows) ? c.buttonAlone : c.button || c.title;
    const btn = page.locator(".lead-btn", { hasText: lab }).first();
    if (!(await btn.count())) throw new Error("piste « " + id + " » absente à " + c.locationId);
    await btn.click();
    done.add(id);
    await page.waitForTimeout(150);
    if (tag) await shot(tag);
    if (c.puzzle) await solve(c.puzzle, tag);
  };
  const solve = async (pid, tag) => {
    const pz = cs.puzzles[pid];
    if (pz.type === "grille") {
      // d'abord une mauvaise réponse
      for (const q of pz.questions) {
        const choix = q.choix === "temoins" ? pz.temoins.map((t) => ({ id: t.id, nom: t.court || t.nom || (cs.characters.find((c) => c.id === t.id) || {}).name }))
          : Array.isArray(q.choix) ? q.choix : pz.categories.find((c) => c.id === q.choix).valeurs.map((v) => ({ id: v.id, nom: v.court || v.nom }));
        const rows = page.locator(".tab-questions .tab-choice-row");
        const idx = pz.questions.indexOf(q);
        const good = choix.find((c) => c.id === q.reponse);
        await rows.nth(idx).locator(".tab-choice", { hasText: good.nom }).first().click();
      }
      await shot("grille-reponses");
      await click(".tab-submit");
    } else if (pz.type === "portrait") {
      const rows = page.locator(".portrait-trait");
      // un trait faux d'abord
      for (let i = 0; i < pz.traits.length; i++) {
        const tr = pz.traits[i];
        const want = i === 0 ? tr.options.find((o) => o.id !== pz.solution[tr.id]) : tr.options.find((o) => o.id === pz.solution[tr.id]);
        await rows.nth(i).locator(".tab-choice", { hasText: want.nom }).first().click();
      }
      await click(".portrait-atelier ~ .tab-submit, .puzzle-portrait .tab-submit");
      await shot("portrait-faux");
      const tr = pz.traits[0];
      await rows.nth(0).locator(".tab-choice", { hasText: tr.options.find((o) => o.id === pz.solution[tr.id]).nom }).first().click();
      await click(".puzzle-portrait .tab-submit");
    } else if (pz.type === "poursuite") {
      await click(".poursuite-depart");
      await shot("poursuite-choix");
      if (scenario === "frapper") await click(".poursuite-btn", pz.options.find((o) => o.id === "frapper").label);
      else await page.waitForTimeout(pz.seconds * 2000 + 800);
    }
    await page.waitForTimeout(200);
    const solved = await page.locator(".puzzle-result").count();
    if (!solved) throw new Error("puzzle " + pid + " non résolu");
    await shot((tag || pid) + "-resolu");
  };

  await page.goto(url);
  await page.waitForSelector(".menu-item");
  await click(".menu-item", lang === "en" ? "New game" : "Nouvelle partie");
  await click(".start-btn");
  await shot("villes");
  await click(".city-card", "Nyons");
  await click(".case-card");
  await shot("intro");
  await click(".start-btn");
  await shot("plan");

  let path_ = cs.referencePath.slice();
  if (scenario === "frapper") {
    // firmin avant qu'il parte, puis l'agression ; la chambre, le labo ensuite
    path_ = ["dossier", "firmin", "confrontation", "tardieu", "poursuite", "portrait", "royer2", "royer3", "isnard", "sauvan", "helene", "lettre_chabert", "maison", "odile", "sandrine2", "chambre_firmin", "labo"];
  }
  for (const id of path_) {
    const before = await leads();
    try {
      await read(id, id);
    } catch (e) {
      errors.push("parcours: " + e.message + " (pistes : " + before.trim() + ")");
      await shot("bloque-" + id);
      break;
    }
  }
  // Une piste perdue ?
  const lost = await page.locator(".disc-perdu").count();
  console.log("pistes perdues signalées à l'écran (dernière lecture) : " + lost);
  await shot("apres-parcours");

  // L'article
  await click(".nav-item, .annuaire-btn, button", "article");
  await page.waitForSelector(".copie", { timeout: 3000 }).catch(() => {});
  if (!(await page.locator(".copie").count())) {
    await click("button", "Rédiger");
    await page.waitForSelector(".copie");
  }
  await shot("article-vide");
  const blanks = [];
  cs.article.forEach((par) => par.parts.forEach((x) => typeof x === "object" && blanks.push(x)));
  const label = (type, id) => {
    if (type === "p") { const c = cs.characters.find((x) => x.id === id); return c.label || c.name; }
    if (type === "l") return loc(id).name;
    if (type === "d") return cs.documents.find((x) => x.id === id).name;
    return cs.actions.find((x) => x.id === id).name;
  };
  for (const b of blanks) {
    let ans = b.answer;
    if (scenario === "faux" && b.q === "Q1" && b.type === "p") ans = "royer";
    await click('[data-blank="' + b.id + '"]');
    const mot = page.locator(".mot", { hasText: label(b.type, ans) }).first();
    if (!(await mot.count())) { errors.push("article: mot « " + label(b.type, ans) + " » absent pour " + b.id); continue; }
    await mot.click();
    await page.waitForTimeout(80);
  }
  await shot("article-rempli");
  await click(".confirm-btn");
  await page.waitForTimeout(200);
  for (let i = 0; i < 3 && !(await page.locator(".une").count()); i++) {
    await shot("relecture");
    await click(".confirm-btn");
    await page.waitForTimeout(200);
  }
  await page.waitForSelector(".une", { timeout: 4000 }).catch(() => errors.push("pas de une"));
  await shot("fin");
  const une = await page.evaluate(() => (document.querySelector(".une") || {}).innerText || "");
  console.log(une.slice(0, 900));
  console.log(errors.length ? errors.join("\n") : "aucune erreur");
  await browser.close();
})().catch((e) => {
  console.error(String(e).slice(0, 300));
  console.error(errors.join("\n"));
  process.exit(1);
});
