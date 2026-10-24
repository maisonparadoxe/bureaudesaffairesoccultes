/* Le téléphone comme manette (côté jeu)
   Le jeu, ouvert sur l'ordinateur, affiche un QR code. Le téléphone ouvre
   manette.html sur le même site et se relie au jeu de navigateur à navigateur
   (WebRTC, via PeerJS). Le service PeerJS ne sert qu'à la mise en relation.
   Le jeu fait autorité : il envoie au téléphone ce qu'il doit afficher
   (BAOPhone.sync), le téléphone renvoie des gestes (BAOPhone.onGesture).
   Sans téléphone, rien ne change : le jeu reste entièrement jouable.

   Sécurité : l'identifiant du jeu et un jeton aléatoire sont dans le fragment
   de l'adresse du QR code (#…), jamais envoyés à un serveur web. Le jeton ne sert
   qu'une fois ; le téléphone reçoit ensuite une clé d'appareil pour se reconnecter.
   Un seul téléphone à la fois. */
(function () {
  "use strict";

  const PEERJS = "https://cdn.jsdelivr.net/npm/peerjs@1.5.4/dist/peerjs.min.js";
  const QRLIB = "https://cdn.jsdelivr.net/npm/qrcode-generator@1.4.4/qrcode.js";
  const PAIR_TTL = 10 * 60 * 1000; // un QR code vaut dix minutes

  const t = (window.BAOLang && window.BAOLang.t) || ((s, v) => (v ? s.replace(/\{(\w+)\}/g, (m, k) => v[k]) : s));
  const esc = (s) => String(s == null ? "" : s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);
  const rand = (n) => Array.from(crypto.getRandomValues(new Uint8Array(n)), (b) => b.toString(16).padStart(2, "0")).join("");

  let peer = null;
  let conn = null; // le téléphone relié
  let token = null;
  let tokenExpires = 0;
  let deviceKey = null;
  let lastState = null;
  let lastMode = null;
  let status = "aucun"; // aucun | attente | relie | perdu | erreur
  let error = "";
  let overlay = null;
  let inviteMode = false; // la fenêtre propose d'abord le téléphone, sans QR code
  let invited = false;
  let gestureHandler = () => {};
  let statusHandler = () => {};
  let renewTimer = null;

  const load = (src) =>
    new Promise((ok, ko) => {
      if (document.querySelector('script[src="' + src + '"]')) return ok();
      const s = document.createElement("script");
      s.src = src;
      s.onload = ok;
      s.onerror = () => ko(new Error("load"));
      document.head.appendChild(s);
    });

  const online = () => /^https?:$/.test(location.protocol);

  // Dans itch.io, le jeu tourne dans un cadre sur un autre domaine : le QR code
  // pointe alors vers la page de la manette sur le site du jeu, plus propre à ouvrir.
  const SITE = "https://maisonparadoxe.github.io/bureaudesaffairesoccultes/";
  function controllerURL() {
    const base = /(^|\.)itch\.(io|zone)$/.test(location.hostname) ? SITE : location.href;
    return new URL("manette.html", base).href.split("#")[0] + "#" + peer.id + "." + token;
  }

  function newToken() {
    token = rand(16);
    tokenExpires = Date.now() + PAIR_TTL;
    clearTimeout(renewTimer);
    renewTimer = setTimeout(() => {
      if (status !== "relie") newToken();
      drawOverlay();
    }, PAIR_TTL);
  }

  function setStatus(s, msg) {
    status = s;
    error = msg || "";
    statusHandler(status);
    drawOverlay();
  }

  async function start() {
    if (peer) return;
    if (!online()) return setStatus("erreur", "hors-ligne");
    setStatus("attente");
    try {
      await Promise.all([load(PEERJS), load(QRLIB)]);
    } catch (e) {
      return setStatus("erreur", "reseau");
    }
    let savedId = null;
    try { savedId = sessionStorage.getItem("bao-manette-jeu"); } catch (e) {}
    peer = new window.Peer(savedId || "bao-" + rand(8), window.BAO_PEER_OPTS || {}); // BAO_PEER_OPTS : serveur de mise en relation de test
    newToken();
    peer.on("open", (id) => {
      try { sessionStorage.setItem("bao-manette-jeu", id); } catch (e) {}
      drawOverlay();
    });
    peer.on("connection", accept);
    peer.on("disconnected", () => peer && !peer.destroyed && peer.reconnect());
    peer.on("error", (e) => {
      if (e.type === "unavailable-id") {
        // l'ancien identifiant est encore réservé : on en prend un neuf
        try { sessionStorage.removeItem("bao-manette-jeu"); } catch (err) {}
        peer.destroy();
        peer = null;
        start();
        return;
      }
      if (e.type === "network" || e.type === "server-error" || e.type === "socket-error") setStatus(conn ? status : "erreur", "reseau");
    });
  }

  function accept(c) {
    const meta = c.metadata || {};
    const byToken = meta.token && meta.token === token && Date.now() < tokenExpires;
    const byKey = meta.deviceKey && deviceKey && meta.deviceKey === deviceKey;
    c.on("open", () => {
      if (!byToken && !byKey) {
        c.send({ t: "refus", raison: meta.token ? "jeton" : "cle" });
        setTimeout(() => c.close(), 300);
        return;
      }
      if (conn && conn !== c) conn.close();
      conn = c;
      if (byToken) {
        deviceKey = rand(32);
        newToken(); // le jeton ne sert qu'une fois
      }
      c.send({ t: "bienvenue", deviceKey: deviceKey, lang: (window.BAOLang && window.BAOLang.lang) || "fr" });
      if (lastState) c.send({ t: "etat", etat: lastState });
      setStatus("relie");
      close();
      banner(t("Téléphone relié."));
    });
    c.on("data", (msg) => {
      if (c !== conn || !msg || typeof msg !== "object") return;
      if (msg.t === "geste") gestureHandler(msg);
    });
    c.on("close", () => {
      if (c !== conn) return;
      conn = null;
      setStatus("perdu");
    });
  }

  function forget() {
    if (conn) conn.close();
    conn = null;
    deviceKey = null;
    newToken();
    setStatus(peer ? "attente" : "aucun");
  }

  // ---------------- ce que le téléphone affiche ----------------
  const MODE_NAMES = {
    minitel: "le Minitel",
    poursuite: "le chronomètre"
  };

  function sync(etat) {
    lastState = etat;
    if (!conn || !conn.open) return;
    conn.send({ t: "etat", etat: etat });
    if (etat.mode !== lastMode) {
      if (MODE_NAMES[etat.mode]) banner(t("Votre téléphone devient : {quoi}", { quoi: t(MODE_NAMES[etat.mode]) }));
      lastMode = etat.mode;
    }
  }
  // un effet passager (lettres tapées, etc.), sans changer l'état
  function fx(data) {
    if (conn && conn.open) conn.send({ t: "fx", fx: data });
  }

  // ---------------- bandeau « Votre téléphone devient… » ----------------
  let bannerEl = null;
  let bannerTimer = null;
  function banner(text) {
    if (!bannerEl) {
      bannerEl = document.createElement("div");
      bannerEl.className = "manette-bandeau";
      bannerEl.setAttribute("role", "status");
      document.body.appendChild(bannerEl);
    }
    bannerEl.textContent = text;
    bannerEl.classList.add("visible");
    clearTimeout(bannerTimer);
    bannerTimer = setTimeout(() => bannerEl.classList.remove("visible"), 2600);
  }

  // ---------------- la fenêtre du QR code ----------------
  const NO = "bao-manette-non";
  const stored = () => { try { return localStorage.getItem(NO) === "1"; } catch (e) { return false; } };

  // Au début de la partie : le jeu propose le téléphone (une fois par session,
  // jamais sur un téléphone, jamais si on a dit « ne plus me le proposer »)
  function invite() {
    if (invited || conn || stored() || !online()) return;
    invited = true;
    if (window.matchMedia && (matchMedia("(pointer: coarse)").matches || innerWidth <= 760)) return;
    inviteMode = true;
    open();
  }

  function open() {
    if (!overlay) {
      overlay = document.createElement("div");
      overlay.className = "manette-overlay";
      overlay.addEventListener("click", (e) => e.target === overlay && close());
      document.body.appendChild(overlay);
    }
    overlay.hidden = false;
    if (!inviteMode) start();
    drawOverlay();
  }
  function close() {
    inviteMode = false;
    if (overlay) overlay.hidden = true;
  }

  function drawInvite() {
    overlay.innerHTML =
      '<div class="manette-fenetre manette-invitation" role="dialog" aria-modal="true" aria-label="' + esc(t("Jouer avec votre téléphone ?")) + '">' +
      '<p class="manette-titre">' + t("Jouer avec votre téléphone ?") + "</p>" +
      '<p class="manette-intro">' + t("Scannez un QR code : le téléphone affiche la carte, les pistes et les entretiens, devient le Minitel et sert de chronomètre pendant les poursuites. Vous pouvez aussi tout jouer à la souris.") + "</p>" +
      '<div class="manette-actions manette-actions-col">' +
      '<button type="button" class="manette-oui">' + t("Afficher le QR code") + "</button>" +
      '<button type="button" class="manette-fermer">' + t("Jouer à la souris") + "</button>" +
      '<button type="button" class="manette-jamais">' + t("Ne plus me le proposer") + "</button></div></div>";
    overlay.querySelector(".manette-oui").addEventListener("click", () => {
      inviteMode = false;
      start();
      drawOverlay();
    });
    overlay.querySelector(".manette-fermer").addEventListener("click", close);
    overlay.querySelector(".manette-jamais").addEventListener("click", () => {
      try { localStorage.setItem(NO, "1"); } catch (e) {}
      close();
    });
  }

  function drawOverlay() {
    if (!overlay || overlay.hidden) return;
    if (inviteMode) return drawInvite();
    let body = "";
    if (status === "erreur" && error === "hors-ligne") {
      body =
        "<p>" + t("Le téléphone ne peut pas ouvrir un jeu lancé depuis un fichier de l'ordinateur.") + "</p>" +
        "<p>" + t("Pour jouer avec la manette, ouvrez la version en ligne du jeu :") + ' <a href="https://maisonparadoxe.github.io/bureaudesaffairesoccultes/" target="_blank" rel="noopener">maisonparadoxe.github.io</a></p>';
    } else if (status === "erreur") {
      body = "<p>" + t("Impossible de joindre le service de mise en relation. Vérifiez la connexion à internet, puis réessayez.") + "</p>";
    } else if (status === "relie") {
      body = '<p class="manette-ok">' + t("Un téléphone est relié.") + "</p>";
    } else if (!peer || !peer.open || !window.qrcode) {
      body = '<p class="manette-attente">' + t("Préparation du QR code…") + "</p>";
    } else {
      const qr = window.qrcode(0, "M");
      qr.addData(controllerURL());
      qr.make();
      body =
        '<div class="manette-qr" data-lien="' + esc(controllerURL()) + '">' + qr.createSvgTag({ cellSize: 5, margin: 2, scalable: true }) + "</div>" +
        "<ol class=\"manette-etapes\"><li>" + t("Scannez ce code avec l'appareil photo du téléphone.") + "</li><li>" +
        t("Gardez la page ouverte sur le téléphone : il se transformera selon la scène.") + "</li></ol>" +
        (status === "perdu" ? '<p class="manette-perdu">' + t("Le téléphone s'est déconnecté. Il se reliera de nouveau tout seul, ou scannez le code.") + "</p>" : "") +
        '<p class="manette-note">' + t("Le téléphone et l'ordinateur se parlent directement. Un service gratuit (PeerJS) les met seulement en relation.") + "</p>";
    }
    overlay.innerHTML =
      '<div class="manette-fenetre" role="dialog" aria-modal="true" aria-label="' + esc(t("Relier un téléphone")) + '">' +
      '<p class="manette-titre">' + t("Relier un téléphone") + "</p>" +
      '<p class="manette-intro">' + t("Votre téléphone devient une manette : il se change en Minitel, en chronomètre pendant une poursuite… Le jeu reste jouable sans lui.") + "</p>" +
      body +
      '<div class="manette-actions">' +
      (status === "relie" ? '<button type="button" class="manette-oublier">' + t("Déconnecter le téléphone") + "</button>" : "") +
      '<button type="button" class="manette-fermer">' + t("Fermer") + "</button></div></div>";
    overlay.querySelector(".manette-fermer").addEventListener("click", close);
    const f = overlay.querySelector(".manette-oublier");
    if (f) f.addEventListener("click", forget);
  }

  window.BAOPhone = {
    open: function () { inviteMode = false; open(); },
    invite: invite,
    sync: sync,
    fx: fx,
    banner: banner,
    connected: () => !!(conn && conn.open),
    onGesture: (fn) => (gestureHandler = fn),
    onStatus: (fn) => (statusHandler = fn)
  };
})();
