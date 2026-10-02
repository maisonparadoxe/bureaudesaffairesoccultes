/* Le tableau de recoupement de Karim (puzzle de type « grille »)
   Plusieurs témoins, une grille par catégorie (lieu, objet, raison...).
   Un seul témoin ment. Les grilles sont un brouillon libre, jamais
   vérifié : seules comptent les réponses aux questions de Paul.

   Utilisé par script.js (type "grille") et par outils/essai-tableau.html.
   BAOTableau.build(area, pz, { id, play, onSolved, onWrong }) */
(function () {
  "use strict";

  // Les coches survivent aux re-rendus de l'écran (pas à un rechargement)
  const marks = {};

  const esc = (s) =>
    String(s == null ? "" : s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);

  function stateFor(id, pz) {
    if (!marks[id]) {
      const grids = {};
      pz.categories.forEach((cat) => {
        grids[cat.id] = {};
        pz.temoins.forEach((t) => (grids[cat.id][t.id] = {}));
      });
      marks[id] = { grids, reponses: {}, message: "" };
    }
    return marks[id];
  }

  function build(area, pz, opts) {
    const o = Object.assign({ id: "grille", play() {}, onSolved() {}, onWrong() {} }, opts);
    const st = stateFor(o.id, pz);
    const nom = (t) => t.court || t.nom;

    // Déclarations
    const decl = document.createElement("div");
    decl.className = "tab-section";
    decl.innerHTML =
      '<p class="tab-title">Les déclarations</p>' +
      pz.temoins
        .map((t) => {
          const dits = pz.declarations.filter((d) => d.qui === t.id);
          return (
            '<div class="tab-temoin"><p class="tab-temoin-nom">' + esc(t.nom) + (t.role ? ' <span class="tab-role">' + esc(t.role) + "</span>" : "") + "</p>" +
            dits.map((d) => '<p class="tab-quote">« ' + esc(d.texte) + " »</p>").join("") +
            "</div>"
          );
        })
        .join("");
    area.appendChild(decl);

    // Indices matériels
    if ((pz.indices || []).length) {
      const ind = document.createElement("div");
      ind.className = "tab-section tab-indices";
      ind.innerHTML =
        '<p class="tab-title">Ce qui est sûr</p><ol>' +
        pz.indices.map((i) => "<li>" + (i.source ? "<strong>" + esc(i.source) + " :</strong> " : "") + esc(i.texte) + "</li>").join("") +
        "</ol>";
      area.appendChild(ind);
    }

    // Un rond barre le reste de sa ligne et de sa colonne
    const autoCroix = (cat, g) => {
      pz.temoins.forEach((t) => cat.valeurs.forEach((v) => g[t.id][v.id] === "auto" && delete g[t.id][v.id]));
      pz.temoins.forEach((t) =>
        cat.valeurs.forEach((v) => {
          if (g[t.id][v.id] !== "oui") return;
          cat.valeurs.forEach((w) => !g[t.id][w.id] && (g[t.id][w.id] = "auto"));
          pz.temoins.forEach((u) => !g[u.id][v.id] && (g[u.id][v.id] = "auto"));
        })
      );
    };

    // Grilles
    const gridsBox = document.createElement("div");
    gridsBox.className = "tab-grids";
    area.appendChild(gridsBox);

    const drawGrid = (cat) => {
      const g = st.grids[cat.id];
      const table = document.createElement("table");
      table.className = "tab-grid";
      let head = '<caption>' + esc(cat.nom) + '</caption><thead><tr><th></th>';
      cat.valeurs.forEach((v) => (head += '<th scope="col"><span>' + esc(v.court || v.nom) + "</span></th>"));
      table.innerHTML = head + "</tr></thead>";
      const body = document.createElement("tbody");
      pz.temoins.forEach((t) => {
        const tr = document.createElement("tr");
        tr.innerHTML = '<th scope="row">' + esc(nom(t)) + "</th>";
        cat.valeurs.forEach((v) => {
          const td = document.createElement("td");
          const b = document.createElement("button");
          // "auto" : croix posée par un rond, recalculée quand les ronds changent
          const m = g[t.id][v.id] || "";
          const croix = m === "non" || m === "auto";
          b.className = "tab-cell" + (m === "oui" ? " tab-oui" : croix ? " tab-non" : "");
          b.textContent = m === "oui" ? "●" : croix ? "✕" : "";
          b.setAttribute("aria-label", nom(t) + ", " + v.nom + " : " + (m === "oui" ? "oui" : croix ? "non" : "vide"));
          b.addEventListener("click", () => {
            const next = m === "" ? "non" : croix ? "oui" : "";
            if (next === "oui") {
              // un nouveau rond remplace un ancien rond de sa ligne ou de sa colonne
              cat.valeurs.forEach((w) => g[t.id][w.id] === "oui" && delete g[t.id][w.id]);
              pz.temoins.forEach((u) => g[u.id][v.id] === "oui" && delete g[u.id][v.id]);
            }
            if (next) g[t.id][v.id] = next;
            else delete g[t.id][v.id];
            autoCroix(cat, g);
            o.play(next === "non" ? "interface/rature" : "interface/crayon-note");
            say("");
            draw();
          });
          td.appendChild(b);
          tr.appendChild(td);
        });
        body.appendChild(tr);
      });
      table.appendChild(body);
      return table;
    };

    const draw = () => {
      gridsBox.innerHTML = "";
      pz.categories.forEach((cat) => gridsBox.appendChild(drawGrid(cat)));
    };

    const reset = document.createElement("button");
    reset.className = "tab-reset";
    reset.textContent = "Effacer le brouillon";
    reset.addEventListener("click", () => {
      Object.keys(st.grids).forEach((c) => Object.keys(st.grids[c]).forEach((t) => (st.grids[c][t] = {})));
      o.play("interface/rature");
      draw();
    });
    area.appendChild(reset);

    // Les questions de Paul : seules les réponses comptent, pas les grilles
    const choixDe = (q) =>
      q.choix === "temoins"
        ? pz.temoins.map((t) => ({ id: t.id, nom: nom(t) }))
        : Array.isArray(q.choix)
          ? q.choix
          : (pz.categories.find((c) => c.id === q.choix) || { valeurs: [] }).valeurs.map((v) => ({ id: v.id, nom: v.court || v.nom }));

    const questions = document.createElement("div");
    questions.className = "tab-section tab-questions";
    area.appendChild(questions);

    const drawQuestions = () => {
      questions.innerHTML = '<p class="tab-title">Les questions de Paul</p>';
      pz.questions.forEach((q) => {
        const p = document.createElement("p");
        p.className = "tab-question";
        p.textContent = q.texte;
        questions.appendChild(p);
        const row = document.createElement("div");
        row.className = "tab-choice-row";
        choixDe(q).forEach((c) => {
          const picked = st.reponses[q.id] === c.id;
          const b = document.createElement("button");
          b.className = "tab-choice" + (picked ? " tab-choice-picked" : "");
          b.textContent = c.nom;
          b.setAttribute("aria-pressed", picked ? "true" : "false");
          b.addEventListener("click", () => {
            st.reponses[q.id] = picked ? null : c.id;
            o.play("interface/stylo");
            say("");
            drawQuestions();
          });
          row.appendChild(b);
        });
        questions.appendChild(row);
      });
    };

    const submit = document.createElement("button");
    submit.className = "tab-submit";
    submit.textContent = "Répondre à Paul";
    area.appendChild(submit);

    const feedback = document.createElement("p");
    feedback.className = "puzzle-feedback tab-feedback";
    area.appendChild(feedback);
    // le message reste affiché si l'écran est redessiné (piste perdue)
    const say = (msg) => (feedback.textContent = st.message = msg);
    say(st.message);

    submit.addEventListener("click", () => {
      const vides = pz.questions.filter((q) => !st.reponses[q.id]);
      if (vides.length) {
        say(vides.length === pz.questions.length ? "Paul attend vos réponses." : "Paul attend une réponse à chaque question.");
        return;
      }
      if (pz.questions.every((q) => st.reponses[q.id] === q.reponse)) {
        o.play("interface/tampon");
        delete marks[o.id];
        o.onSolved();
      } else {
        o.play("interface/rature");
        say(pz.erreur || "« Admettons. » Paul n'est pas convaincu. Quelque chose ne tient pas.");
        o.onWrong();
      }
    });

    draw();
    drawQuestions();
  }

  window.BAOTableau = { build };
})();
