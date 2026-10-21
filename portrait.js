/* Le portrait-robot (puzzle de type « portrait »)
   Deux témoins décrivent un visage, chacun se trompe sur un trait. Le joueur
   choisit chaque trait sur les calques d'Yves ; le visage se dessine à mesure.
   Seul compte le portrait montré aux témoins.

   Utilisé par script.js (type "portrait").
   BAOPortrait.build(area, pz, { id, play, say, onSolved })
   BAOPortrait.face(choix) rend le visage en SVG ({ cheveux: "gris", ... }). */
(function () {
  "use strict";

  const picks = {}; // les calques posés survivent aux re-rendus de l'écran
  const t = (window.BAOLang && window.BAOLang.t) || ((s, v) => (v ? s.replace(/\{(\w+)\}/g, (m, k) => v[k]) : s));
  const esc = (s) => String(s == null ? "" : s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);

  // ---------------- le dessin, trait par trait (cadre 200 × 250) ----------------
  const INK = 'fill="none" stroke="#2A2620" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"';
  const TETES = {
    carre: "M48,95 C48,55 70,35 100,35 C130,35 152,55 152,95 L152,150 C152,185 140,205 122,214 L78,214 C60,205 48,185 48,150 Z",
    fuyant: "M48,95 C48,55 70,35 100,35 C130,35 152,55 152,95 L150,150 C146,180 130,200 110,206 C100,208 88,204 78,196 C62,182 50,170 48,150 Z",
    pointu: "M48,95 C48,55 70,35 100,35 C130,35 152,55 152,95 L150,145 C146,175 120,212 100,220 C80,212 54,175 50,145 Z"
  };
  const LIGNE_FRONT = { haut: 60, bas: 88, lisse: 72 };
  const cheveux = (kind, y) => {
    const calotte = "M46,104 C40,58 66,26 100,24 C134,26 160,58 154,104 L150,100 C148," + (y + 10) + " 130," + y + " 100," + y + " C70," + y + " 52," + (y + 10) + " 50,100 Z";
    const hachures = (couleur) =>
      [62, 76, 90, 104, 118, 132].map((x) => '<path d="M' + x + "," + (y - 2) + " L" + (x - 6) + "," + (y - 18) + '" stroke="' + couleur + '" stroke-width="1.4"/>').join("");
    if (kind === "gris") return '<path d="' + calotte + '" fill="#8C877E" stroke="#2A2620" stroke-width="2"/>' + hachures("#5C574F");
    if (kind === "blancs") return '<path d="' + calotte + '" fill="#F1EDE4" stroke="#2A2620" stroke-width="2"/>' + hachures("#B9B3A6");
    if (kind === "degarnis")
      return '<path d="M47,108 C44,86 50,72 60,64 L64,92 C58,96 54,102 52,110 Z" fill="#8C877E" stroke="#2A2620" stroke-width="2"/>' +
        '<path d="M153,108 C156,86 150,72 140,64 L136,92 C142,96 146,102 148,110 Z" fill="#8C877E" stroke="#2A2620" stroke-width="2"/>';
    if (kind === "longs") return '<path d="' + calotte + '" fill="#8C877E" stroke="#2A2620" stroke-width="2"/>' + hachures("#5C574F");
    return "";
  };
  const ARRIERE_LONGS = '<path d="M44,100 C36,140 40,190 54,226 L146,226 C160,190 164,140 156,100 Z" fill="#7A756C" stroke="#2A2620" stroke-width="2"/>';
  const YEUX = {
    enfonces:
      '<path d="M64,106 Q79,97 93,105" stroke="#2A2620" stroke-width="4" fill="none" stroke-linecap="round"/><path d="M107,105 Q121,97 136,106" stroke="#2A2620" stroke-width="4" fill="none" stroke-linecap="round"/>' +
      '<path d="M68,110 Q79,105 90,110" ' + INK + ' opacity=".5"/><path d="M110,110 Q121,105 132,110" ' + INK + ' opacity=".5"/>' +
      '<ellipse cx="79" cy="114" rx="5" ry="2.6" fill="#2A2620"/><ellipse cx="121" cy="114" rx="5" ry="2.6" fill="#2A2620"/>',
    ronds:
      '<path d="M66,98 Q79,92 92,98" ' + INK + '/><path d="M108,98 Q121,92 134,98" ' + INK + '/>' +
      '<circle cx="79" cy="112" r="7" ' + INK + '/><circle cx="121" cy="112" r="7" ' + INK + '/><circle cx="79" cy="112" r="2.6" fill="#2A2620"/><circle cx="121" cy="112" r="2.6" fill="#2A2620"/>',
    tombants:
      '<path d="M66,100 Q79,95 92,101" ' + INK + '/><path d="M108,101 Q121,95 134,100" ' + INK + '/>' +
      '<path d="M70,111 Q80,105 90,110 Q86,117 70,118" ' + INK + '/><path d="M130,111 Q120,105 110,110 Q114,117 130,118" ' + INK + '/>' +
      '<circle cx="81" cy="112" r="2.4" fill="#2A2620"/><circle cx="119" cy="112" r="2.4" fill="#2A2620"/>'
  };
  const NEZ = {
    droit: '<path d="M100,118 L100,146 M91,150 Q100,155 109,150" ' + INK + "/>",
    casse: '<path d="M100,118 L96,130 L103,138 L98,146 M90,150 Q98,155 107,150" ' + INK + "/>",
    busque: '<path d="M99,118 Q112,132 103,146 M92,150 Q100,155 109,150" ' + INK + "/>"
  };
  const BOUCHE = {
    rasee: '<path d="M84,173 Q100,176 116,173" ' + INK + "/>",
    moustache: '<path d="M84,175 Q100,178 116,175" ' + INK + '/><path d="M78,168 Q89,158 100,164 Q111,158 122,168 Q111,171 100,168 Q89,171 78,168 Z" fill="#4A463F" stroke="#2A2620" stroke-width="1.5"/>',
    epaisse: '<path d="M82,171 Q100,163 118,171 Q100,184 82,171 Z" ' + INK + '/><path d="M84,171 L116,171" ' + INK + ' opacity=".6"/>'
  };

  function face(c) {
    c = c || {};
    const y = LIGNE_FRONT[c.front] || 74;
    let svg = '<svg viewBox="0 0 200 250" class="portrait-svg" role="img" aria-label="' + esc(t("Portrait-robot")) + '">';
    svg += '<rect x="0" y="0" width="200" height="250" fill="#F4F0E6"/>';
    if (c.cheveux === "longs") svg += ARRIERE_LONGS;
    svg += '<path d="M82,212 L80,250 M118,212 L120,250" ' + INK + "/>";
    svg += '<path d="' + (TETES[c.menton] || TETES.carre) + '" fill="#FBF8F1" stroke="#2A2620" stroke-width="2.4"' + (c.menton ? "" : ' stroke-dasharray="5 5"') + "/>";
    if (c.menton === "carre") svg += '<path d="M100,204 L100,212" ' + INK + "/>";
    svg += '<path d="M48,104 C40,104 38,128 48,134 M152,104 C160,104 162,128 152,134" ' + INK + "/>";
    svg += cheveux(c.cheveux, y);
    if (c.front === "haut") svg += [70, 77, 84].map((h) => '<path d="M80,' + (h + 6) + " Q100," + (h + 3) + " 120," + (h + 6) + '" ' + INK + ' stroke-width="1.3" opacity=".7"/>').join("");
    if (c.front === "lisse") svg += '<path d="M70,' + (y + 16) + " Q100," + (y + 4) + " 130," + (y + 16) + '" ' + INK + ' stroke-width="1" opacity=".35"/>';
    if (YEUX[c.yeux]) svg += YEUX[c.yeux];
    if (NEZ[c.nez]) svg += NEZ[c.nez];
    if (BOUCHE[c.bouche]) svg += BOUCHE[c.bouche];
    return svg + "</svg>";
  }

  // ---------------- l'écran ----------------
  function build(area, pz, opts) {
    const o = Object.assign({ id: "portrait", play() {}, say() {}, onSolved() {} }, opts);
    const choix = picks[o.id] || (picks[o.id] = {});

    const temoins = document.createElement("div");
    temoins.className = "portrait-temoins";
    temoins.innerHTML = pz.temoins
      .map((w) => '<div class="portrait-temoin"><p class="tab-temoin-nom">' + esc(w.qui) + '</p><p class="tab-quote">' + t("« {texte} »", { texte: esc(w.texte) }) + "</p></div>")
      .join("");
    area.appendChild(temoins);

    const atelier = document.createElement("div");
    atelier.className = "portrait-atelier";
    const visage = document.createElement("div");
    visage.className = "portrait-visage";
    const calques = document.createElement("div");
    calques.className = "portrait-calques";
    atelier.appendChild(visage);
    atelier.appendChild(calques);
    area.appendChild(atelier);

    const draw = () => {
      visage.innerHTML = face(choix);
      calques.innerHTML = "";
      pz.traits.forEach((tr) => {
        const row = document.createElement("div");
        row.className = "portrait-trait";
        row.innerHTML = '<p class="portrait-trait-nom">' + esc(tr.nom) + "</p>";
        const btns = document.createElement("div");
        btns.className = "tab-choice-row";
        tr.options.forEach((op) => {
          const b = document.createElement("button");
          const on = choix[tr.id] === op.id;
          b.className = "tab-choice" + (on ? " tab-choice-picked" : "");
          b.textContent = op.nom;
          b.setAttribute("aria-pressed", on ? "true" : "false");
          b.addEventListener("click", () => {
            if (on) delete choix[tr.id];
            else choix[tr.id] = op.id;
            o.play("interface/crayon-note");
            o.say("");
            draw();
          });
          btns.appendChild(b);
        });
        row.appendChild(btns);
        calques.appendChild(row);
      });
    };

    const submit = document.createElement("button");
    submit.className = "tab-submit";
    submit.textContent = t("Montrer le portrait aux témoins");
    submit.addEventListener("click", () => {
      const vides = pz.traits.filter((tr) => !choix[tr.id]);
      if (vides.length) {
        o.say(t("Il manque encore : {trait}.", { trait: vides.map((v) => v.nom.toLowerCase()).join(", ") }));
        return;
      }
      const faux = pz.traits.filter((tr) => choix[tr.id] !== pz.solution[tr.id]).length;
      if (!faux) {
        o.play("interface/tampon");
        delete picks[o.id];
        o.onSolved();
        return;
      }
      o.play("interface/rature");
      o.say(faux === 1 ? pz.wrongOne : pz.wrongMany.replace("{n}", faux));
    });
    area.appendChild(submit);
    draw();
  }

  window.BAOPortrait = { build, face };
})();
