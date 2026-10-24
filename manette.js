/* La manette (côté téléphone)
   Ouverte par le QR code du jeu : manette.html#<identifiant du jeu>.<jeton>.
   Le téléphone n'est qu'une vue : il affiche ce que le jeu lui envoie et
   renvoie des gestes. Voir telephone.js pour l'autre côté. */
(function () {
  "use strict";

  const root = document.getElementById("m");
  const STORE = "bao-manette";
  const L = {
    fr: {
      connexion: "Connexion au jeu…",
      reconnexion: "Connexion perdue. Nouvelle tentative…",
      refus: "Ce QR code a déjà servi ou a expiré. Affichez-en un nouveau sur l'ordinateur (Relier un téléphone) et scannez-le.",
      sansCode: "Scannez le QR code affiché par le jeu sur l'ordinateur (Outils, Relier un téléphone).",
      reseau: "Impossible de joindre le jeu. Vérifiez que le téléphone a accès à internet.",
      relie: "Relié au jeu"
    },
    en: {
      connexion: "Connecting to the game…",
      reconnexion: "Connection lost. Trying again…",
      refus: "This QR code has already been used or has expired. Show a new one on the computer (Link a phone) and scan it.",
      sansCode: "Scan the QR code shown by the game on the computer (Tools, Link a phone).",
      reseau: "Can't reach the game. Check that the phone is online.",
      relie: "Linked to the game"
    }
  };
  let lang = (navigator.language || "fr").slice(0, 2) === "fr" ? "fr" : "en";
  const tr = (k) => (L[lang] || L.fr)[k];
  const esc = (s) => String(s == null ? "" : s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);
  const buzz = (p) => { try { navigator.vibrate && navigator.vibrate(p); } catch (e) {} };

  // ---------------- liaison ----------------
  const hash = location.hash.slice(1).split(".");
  const hostId = hash[0] || "";
  let pairToken = hash[1] || "";
  let saved = {};
  try { saved = JSON.parse(localStorage.getItem(STORE) || "{}"); } catch (e) {}
  let deviceKey = saved.hostId === hostId ? saved.deviceKey : null;

  let peer = null;
  let conn = null;
  let attempt = 0;
  let etat = null;
  let shownMode = null;
  let refused = false;

  function message(text, err) {
    shownMode = null;
    document.body.className = "";
    root.innerHTML =
      '<p class="m-entete"><span>Bureau des affaires occultes</span></p>' +
      '<p class="m-titre">' + (lang === "fr" ? "La manette" : "The controller") + "</p>" +
      '<p class="m-texte' + (err ? " err" : "") + '">' + esc(text) + "</p>";
  }

  function connect() {
    if (refused) return;
    if (!hostId) return message(tr("sansCode"));
    if (!pairToken && !deviceKey) return message(tr("refus"), true);
    if (!peer || peer.destroyed) {
      peer = new window.Peer(undefined, window.BAO_PEER_OPTS || {});
      peer.on("open", () => openConn());
      peer.on("error", (e) => {
        if (e.type === "peer-unavailable") retry();
        else if (e.type === "network" || e.type === "server-error" || e.type === "socket-error") { message(tr("reseau"), true); retry(); }
      });
      peer.on("disconnected", () => !peer.destroyed && peer.reconnect());
    } else if (peer.open) openConn();
  }

  let lastSeen = 0;
  let beat = null;
  function openConn() {
    const meta = deviceKey ? { deviceKey: deviceKey } : { token: pairToken };
    const c = peer.connect(hostId, { metadata: meta, serialization: "json", reliable: true });
    const lost = () => {
      if (c !== conn) return;
      conn = null;
      clearInterval(beat);
      try { c.close(); } catch (e) {}
      if (!refused) { message(tr("reconnexion")); retry(); }
    };
    c.on("open", () => {
      conn = c;
      attempt = 0;
      lastSeen = Date.now();
      clearInterval(beat);
      // Un lien peut mourir sans prévenir (veille, clavier, réseau) : on le sonde
      beat = setInterval(() => {
        if (c !== conn) return;
        if (Date.now() - lastSeen > 12000) return lost();
        try { c.send({ t: "ping" }); } catch (e) { lost(); }
      }, 4000);
    });
    c.on("data", (m) => { lastSeen = Date.now(); onData(m); });
    c.on("close", lost);
    c.on("error", lost);
  }

  function retry() {
    if (refused) return;
    attempt++;
    setTimeout(connect, Math.min(15000, 600 * Math.pow(2, attempt)));
  }
  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "visible" && !conn && !refused) { attempt = 0; connect(); }
  });

  function send(kind, extra) {
    if (conn && conn.open) conn.send(Object.assign({ t: "geste", kind: kind }, extra || {}));
  }

  function onData(msg) {
    if (!msg || typeof msg !== "object" || msg.t === "pong") return;
    if (msg.t === "refus") {
      // la clé ne vaut plus (jeu relancé, téléphone déconnecté) : il faut un nouveau QR code
      refused = true;
      try { localStorage.removeItem(STORE); } catch (e) {}
      return message(tr("refus"), true);
    }
    if (msg.t === "bienvenue") {
      deviceKey = msg.deviceKey;
      pairToken = "";
      lang = msg.lang || lang;
      try { localStorage.setItem(STORE, JSON.stringify({ hostId: hostId, deviceKey: deviceKey })); } catch (e) {}
      history.replaceState(null, "", location.pathname + location.search + "#" + hostId);
      buzz([40, 60, 40]);
      return;
    }
    if (msg.t === "etat") { etat = msg.etat; lang = etat.lang || lang; draw(); return; }
    if (msg.t === "fx" && msg.fx && msg.fx.kind === "minitel-resultat") buzz(msg.fx.trouve ? [30, 50, 120] : 40);
  }

  // ---------------- affichage ----------------
  function draw() {
    const mode = etat.mode;
    const changed = mode !== shownMode;
    if (changed && shownMode) buzz(60);
    if (mode === "minitel" && !changed) return drawMinitelLog();
    if (mode === "poursuite" && !changed && etat.poursuite && etat.poursuite.demarre === drawnChaseStarted) return;
    shownMode = mode;
    document.body.className = "mode-" + mode;
    root.classList.remove("m-transforme");
    void root.offsetWidth;
    if (changed) root.classList.add("m-transforme");
    if (mode === "minitel") drawMinitel();
    else if (mode === "poursuite") drawChase();
    else if (mode === "enquete") drawRemote();
    else drawWaiting();
  }

  const lab = (k) => (etat.labels && etat.labels[k]) || k;

  function drawWaiting() {
    root.innerHTML =
      '<p class="m-entete"><span>Bureau des affaires occultes</span><span>' + esc(tr("relie")) + "</span></p>" +
      '<p class="m-titre">' + esc(lab("attenteTitre")) + "</p>" +
      '<p class="m-texte">' + esc(lab("attenteTexte")) + "</p>";
  }

  function drawRemote() {
    const e = etat.enquete || {};
    const keep = window.scrollY;
    const r = e.resultat;
    const chip = (q) => '<button class="m-chip' + (q.actif ? " on" : "") + '" type="button" data-q="' + esc(q.id) + '">' + esc(q.nom) + (q.n ? " <i>" + q.n + "</i>" : "") + "</button>";
    const lieux = (e.lieux || []).length
      ? (e.lieux || []).map((l) => '<button class="m-lieu' + (l.actif ? " on" : "") + '" type="button" data-l="' + esc(l.id) + '">' + esc(l.nom) + "</button>").join("")
      : '<p class="m-texte m-vide">' + esc(lab("aucunLieu")) + "</p>";
    let pistes = "";
    if (e.lieu) {
      pistes = (e.liste || []).length
        ? e.liste.map((p) =>
            '<button class="m-piste m-' + p.genre + (p.lu ? " lu" : "") + (p.courant ? " courant" : "") + '" type="button" data-p="' + esc(p.id) + '">' +
            '<span class="m-genre">' + esc(lab(p.genre)) + (p.nouveau ? " · " + esc(lab("nouveau")) : "") + "</span>" +
            "<b>" + esc(p.label) + "</b>" +
            (p.qui ? '<span class="m-qui">' + esc(p.qui) + "</span>" : "") +
            (p.lu ? '<span class="m-note">' + esc(lab("lu")) + "</span>" : p.gratuit ? '<span class="m-note">' + esc(lab("gratuit")) + "</span>" : "") +
            "</button>").join("")
        : '<p class="m-texte m-vide">' + esc(lab("rienIci")) + "</p>";
    } else pistes = '<p class="m-texte m-vide">' + esc(lab("choisirLieu")) + "</p>";
    let res = "";
    if (r) {
      res =
        '<article class="m-resultat" id="m-resultat">' +
        (r.titre ? '<h2>' + esc(r.titre) + "</h2>" : "") +
        (r.qui ? '<p class="m-qui">' + esc(r.qui) + "</p>" : "") +
        (r.paragraphes || []).map((p) => "<p>" + esc(p) + "</p>").join("") +
        (r.surOrdi ? '<p class="m-surordi">' + esc(lab("surOrdi")) + "</p>" : "") +
        (r.decouvertes || []).map((d) => '<p class="m-decouverte"><span>' + esc(d.label) + "</span> " + esc(d.texte) + "</p>").join("") +
        "</article>";
    }
    root.innerHTML =
      '<p class="m-entete"><span>' + esc(e.affaire) + "</span><span>" + esc(e.horloge) + "</span></p>" +
      '<div class="m-pistes"><b>' + esc(e.pistes) + "</b><span>" + esc(lab("pistes")) + "</span></div>" +
      '<h3 class="m-sec">' + esc(lab("quartiers")) + '</h3><div class="m-chips">' + (e.quartiers || []).map(chip).join("") + "</div>" +
      '<h3 class="m-sec">' + esc(lab("lieux")) + '</h3><div class="m-lieux">' + lieux + "</div>" +
      '<div class="m-liste">' + pistes + "</div>" + res +
      '<div class="m-bas"><button class="m-btn" data-g="minitel-ouvrir" type="button">Minitel · 3611</button>' +
      '<p class="m-etat">' + esc(lab("telecommande")) + "</p></div>";
    root.querySelector("[data-g]").addEventListener("click", () => send("minitel-ouvrir"));
    root.querySelectorAll("[data-q]").forEach((b) => b.addEventListener("click", () => { buzz(15); send("quartier", { id: b.getAttribute("data-q") }); }));
    root.querySelectorAll("[data-l]").forEach((b) => b.addEventListener("click", () => { buzz(15); send("lieu", { id: b.getAttribute("data-l") }); }));
    root.querySelectorAll("[data-p]").forEach((b) => b.addEventListener("click", () => { buzz(30); send("piste", { id: b.getAttribute("data-p") }); }));
    // une nouvelle piste lue : on montre le résultat ; sinon on reste où l'on était
    const rid = r && r.clue;
    if (rid && rid !== shownResult) root.querySelector("#m-resultat").scrollIntoView({ block: "start" });
    else window.scrollTo(0, keep);
    shownResult = rid || null;
  }
  let shownResult = null;
  let typed = ""; // ce qui est tapé au Minitel, gardé si l'écran est redessiné

  function drawMinitel() {
    const mi = etat.minitel || {};
    root.innerHTML =
      '<p class="m-entete"><span>3611</span><span>' + esc(lab("annuaire")) + "</span></p>" +
      '<div class="m-minitel"><div class="m-minitel-haut"><span>3611</span><span>0,37 F/min</span></div>' +
      '<div class="m-minitel-log"></div>' +
      '<form class="m-minitel-saisie"><span>NOM ▸</span><input type="text" autocomplete="off" autocapitalize="characters" spellcheck="false" maxlength="30" enterkeyhint="send" aria-label="' + esc(lab("nom")) + '"><button class="m-minitel-envoi" type="submit">ENVOI</button></form></div>' +
      '<div class="m-bas"><button class="m-btn m-btn-clair" type="button">' + esc(lab("deconnexion")) + "</button></div>";
    const form = root.querySelector("form");
    const input = form.querySelector("input");
    input.value = typed;
    input.addEventListener("input", () => { typed = input.value; buzz(8); send("minitel-frappe", { texte: input.value }); });
    form.addEventListener("submit", (ev) => {
      ev.preventDefault();
      if (!input.value.trim()) return;
      send("minitel-envoi", { texte: input.value });
      input.value = typed = "";
    });
    root.querySelector(".m-btn-clair").addEventListener("click", () => send("minitel-fermer"));
    drawMinitelLog();
    void mi;
  }

  function drawMinitelLog() {
    const box = root.querySelector(".m-minitel-log");
    if (!box) return;
    const mi = etat.minitel || {};
    box.innerHTML = mi.lignes && mi.lignes.length
      ? '<div class="' + (mi.trouve ? "trouve" : "") + '">' + mi.lignes.map((l) => "<div>" + esc(l) + "</div>").join("") + "</div>"
      : "<div>NOM :</div><div>" + esc(lab("localite")) + "</div><div class=\"dim\">" + esc(lab("invite")) + "</div>";
  }

  let drawnChaseStarted = null;
  let chaseTimer = null;
  function drawChase() {
    const p = etat.poursuite || {};
    drawnChaseStarted = p.demarre;
    clearInterval(chaseTimer);
    let html = '<p class="m-entete"><span>' + esc(p.titre) + "</span></p>" + '<p class="m-texte">' + esc(p.consigne) + "</p>";
    if (!p.demarre) {
      html += '<button class="m-btn m-poursuite-depart" type="button">' + esc(p.depart) + "</button>";
      root.innerHTML = html;
      root.querySelector(".m-poursuite-depart").addEventListener("click", () => send("poursuite-depart"));
      return;
    }
    html += '<div class="m-temps"><span></span></div><div class="m-choix">' +
      p.options.map((o) => '<button class="m-btn" type="button" data-id="' + esc(o.id) + '">' + esc(o.label) + (o.cout ? '<span class="m-cout">' + esc(o.cout) + "</span>" : "") + "</button>").join("") +
      "</div>";
    root.innerHTML = html;
    root.querySelectorAll("[data-id]").forEach((b) => b.addEventListener("click", () => {
      buzz(80);
      root.querySelectorAll("[data-id]").forEach((x) => (x.disabled = true));
      send("poursuite-choix", { id: b.getAttribute("data-id") });
    }));
    const bar = root.querySelector(".m-temps span");
    const end = Date.now() + p.resteMs;
    let lastSec = Math.ceil(p.resteMs / 1000);
    buzz([200, 80, 60]);
    const tick = () => {
      const left = Math.max(0, end - Date.now());
      bar.style.transform = "scaleX(" + (left / p.totalMs) + ")";
      const sec = Math.ceil(left / 1000);
      if (sec !== lastSec) { lastSec = sec; buzz(sec <= 3 ? 70 : 25); }
      if (!left) clearInterval(chaseTimer);
    };
    tick();
    chaseTimer = setInterval(tick, 100);
  }

  message(tr("connexion"));
  if (!window.Peer) message(tr("reseau"), true);
  else connect();
})();
