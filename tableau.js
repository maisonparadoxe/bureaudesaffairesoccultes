/* Le tableau de recoupement de Karim (puzzle de type « grille »)
   Plusieurs témoins, une grille par catégorie (lieu, objet, raison...).
   Un seul témoin ment. Le joueur coche les grilles, désigne le menteur,
   puis remet le tableau à Paul.

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
      marks[id] = { grids, menteur: null, message: "" };
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
          const m = g[t.id][v.id] || "";
          b.className = "tab-cell" + (m ? " tab-" + m : "");
          b.textContent = m === "oui" ? "●" : m === "non" ? "✕" : "";
          b.setAttribute("aria-label", nom(t) + ", " + (v.nom) + " : " + (m === "oui" ? "oui" : m === "non" ? "non" : "vide"));
          b.addEventListener("click", () => {
            const next = m === "" ? "non" : m === "non" ? "oui" : "";
            if (next) g[t.id][v.id] = next;
            else delete g[t.id][v.id];
            if (next === "oui") {
              // un rond barre le reste de sa ligne et de sa colonne
              cat.valeurs.forEach((w) => w.id !== v.id && !g[t.id][w.id] && (g[t.id][w.id] = "non"));
              pz.temoins.forEach((u) => u.id !== t.id && !g[u.id][v.id] && (g[u.id][v.id] = "non"));
            }
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

    // Le menteur
    const liar = document.createElement("div");
    liar.className = "tab-section tab-liar";
    area.appendChild(liar);

    const drawLiar = () => {
      liar.innerHTML = '<p class="tab-title">Qui ment ?</p>';
      const row = document.createElement("div");
      row.className = "tab-liar-row";
      pz.temoins.forEach((t) => {
        const b = document.createElement("button");
        b.className = "tab-liar-btn" + (st.menteur === t.id ? " tab-liar-picked" : "");
        b.textContent = nom(t);
        b.setAttribute("aria-pressed", st.menteur === t.id ? "true" : "false");
        b.addEventListener("click", () => {
          st.menteur = st.menteur === t.id ? null : t.id;
          o.play("interface/stylo");
          say("");
          drawLiar();
        });
        row.appendChild(b);
      });
      liar.appendChild(row);
    };

    const draw = () => {
      gridsBox.innerHTML = "";
      pz.categories.forEach((cat) => gridsBox.appendChild(drawGrid(cat)));
    };

    const actions = document.createElement("div");
    actions.className = "tab-actions";
    const reset = document.createElement("button");
    reset.className = "tab-reset";
    reset.textContent = "Tout effacer";
    reset.addEventListener("click", () => {
      Object.keys(st.grids).forEach((c) => Object.keys(st.grids[c]).forEach((t) => (st.grids[c][t] = {})));
      st.menteur = null;
      o.play("interface/rature");
      say("");
      draw();
      drawLiar();
    });
    const submit = document.createElement("button");
    submit.className = "tab-submit";
    submit.textContent = "Remettre le tableau à Paul";
    actions.appendChild(reset);
    actions.appendChild(submit);
    area.appendChild(actions);

    const feedback = document.createElement("p");
    feedback.className = "puzzle-feedback tab-feedback";
    area.appendChild(feedback);
    // le message reste affiché si l'écran est redessiné (piste perdue)
    const say = (msg) => (feedback.textContent = st.message = msg);
    say(st.message);

    submit.addEventListener("click", () => {
      const choice = {};
      let complete = !!st.menteur;
      pz.categories.forEach((cat) => {
        choice[cat.id] = {};
        pz.temoins.forEach((t) => {
          const yes = cat.valeurs.filter((v) => st.grids[cat.id][t.id][v.id] === "oui");
          if (yes.length !== 1) complete = false;
          else choice[cat.id][t.id] = yes[0].id;
        });
      });
      if (!complete) {
        say("Le tableau n'est pas fini : il faut un rond par ligne dans chaque grille, et désigner le menteur.");
        return;
      }
      const sol = pz.solution;
      const ok =
        st.menteur === sol.menteur &&
        pz.categories.every((cat) => pz.temoins.every((t) => choice[cat.id][t.id] === sol[cat.id][t.id]));
      if (ok) {
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
    drawLiar();
  }

  window.BAOTableau = { build };
})();
