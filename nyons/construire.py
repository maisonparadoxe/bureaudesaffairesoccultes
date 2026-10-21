# Construit l'affaire de Nyons pour le jeu, à partir de carte.py et textes.py,
# et la range dans le data.json du jeu.
#   python3 construire.py [dossier du jeu]      puis      node outils/verifier.js
# Par défaut, le dossier du jeu est le dossier parent (l'atelier est rangé à
# côté de saint-etienne/). Ne touche qu'à la ville de Nyons : la note de
# service et les crédits sont écrits par outils/commun.py.
import json, pathlib, runpy, re, sys

ICI = pathlib.Path(__file__).parent
RACINE = pathlib.Path(sys.argv[1]) if len(sys.argv) > 1 else ICI.parent

src = (ICI / "carte.py").read_text(encoding="utf-8").split("# ------------------------------------------------------------------ contrôles")[0]
C = {"__file__": str(ICI / "carte.py")}
exec(src, C)
T = runpy.run_path(str(ICI / "textes.py"))
A = T["AFFAIRE"]

ADRESSES = {
    "agence": "Avenue Henri-Rochier",
    "gendarmerie": "Promenade de la Digue",
    "arcades": "Place des Arcades",
    "cabinet_sauvan": "Rue de la Résistance",
    "pharmacie": "Place du Pont",
    "hotel": "Place des Arcades",
    "maison_garcin": "Rue des Grands-Forts",
    "pension": "Montée des Forts",
    "moulin": "Quartier du Pont roman",
    "canal": "Chemin du canal",
    "pont": "Pont roman sur l'Eygues",
    "boulodrome": "Promenade de la Digue",
    "camping_municipal": "Bord de l'Eygues",
    "ferme_tardieu": "Route des Pilles, Les Pilles",
    "camping_saules": "Bord de l'Ouvèze, en amont de Vaison",
    "memorial": "Près du pont romain, Vaison-la-Romaine",
}
AMBIANCES = {
    "agence": "agence-dromois", "gendarmerie": "gendarmerie-nyons", "arcades": "arcades", "cabinet_sauvan": "cabinet-sauvan",
    "pharmacie": "pharmacie", "hotel": "hotel-place", "maison_garcin": "maison-garcin", "pension": "pension-forts",
    "moulin": "moulin", "canal": "canal", "pont": "pont-roman", "boulodrome": "boulodrome", "camping_municipal": "camping-municipal",
    "ferme_tardieu": "ferme-tardieu", "camping_saules": "camping-saules", "memorial": "memorial",
}
ROLES = {
    "garcin": "Gérant du camping des Saules, disparu dans la crue de 1992",
    "royer": "Ouvrier agricole chez Tardieu, l'homme de la photo",
    "helene": "Veuve de Jacques Garcin",
    "chabert": "Meunier à Nyons (la victime)",
    "firmin": "Joueur de boules, à la pension des Forts",
    "sandrine": "Saisonnière aux cerises",
    "montagne": "Commandant de la brigade de gendarmerie",
    "sauvan": "Médecin, a constaté le décès",
    "gaston": "Cantonnier, secrétaire de la Boule nyonsaise",
    "fredo": "Serveur au café des Arcades",
    "josiane": "Femme de ménage du meunier",
    "isnard": "Aiguadier du canal du Moulin",
    "tardieu": "Arboriculteur aux Pilles",
    "gisele": "Correspondante du Drômois à Nyons",
    "vasseur": "Inspecteur de la Mutuelle rhodanienne",
    "rosa": "Veuve de la crue, à Vaison",
    "roux": "Pharmacienne, pharmacie du Pont",
}
NOMS_ANNUAIRE = {
    "garcin": "Garcin Jacques", "royer": "Royer Lucien", "helene": "Garcin Hélène", "chabert": "Chabert Aimé",
    "firmin": "Achard Firmin", "sandrine": "Mollet Sandrine", "montagne": "Montagne (adjudant-chef)", "sauvan": "Sauvan Anne (Dr)",
    "gaston": "Rey Gaston", "fredo": "Fredo", "josiane": "Pellegrin Josiane", "isnard": "Isnard Norbert",
    "tardieu": "Tardieu Raoul", "gisele": "Arnaud Gisèle", "vasseur": "Vasseur Jean-Claude", "rosa": "Bérenger Rosa", "roux": "Roux (pharmacienne)",
}
# Libellé court dans les listes (carnet, article). Par défaut, le nom avant la virgule.
LABELS = {"montagne": "L'adjudant-chef Montagne", "roux": "Mme Roux", "fredo": "Fredo", "gaston": "Gaston Rey", "isnard": "Norbert Isnard"}
MINITEL_PERSONNES = ["tardieu", "sauvan", "royer"]   # leur adresse ne se trouve qu'au Minitel (ou pas du tout)

MINITEL = [
    dict(keys=["tardieu"], lines=["TARDIEU Raoul", "Arboriculteur", "Route des Pilles · 26110 LES PILLES", "75 27 41 08"], reveals=["l:ferme_tardieu"]),
    dict(keys=["sauvan"], lines=["SAUVAN Anne", "Médecin généraliste", "Rue de la Résistance · 26110 NYONS", "75 26 13 40"], reveals=["l:cabinet_sauvan"]),
    dict(keys=["royer"], lines=["ROYER", "Aucun abonné à ce nom", "dans la Drôme."], reveals=[]),
    dict(keys=["garcin"], lines=["GARCIN Hélène", "Rue des Grands-Forts", "26110 NYONS", "75 26 08 77"], reveals=["l:maison_garcin"]),
    dict(keys=["chabert"], lines=["CHABERT Aimé", "Moulin à huile", "Quartier du Pont roman · 26110 NYONS", "75 26 02 19"], reveals=["l:moulin"]),
    dict(keys=["achard"], lines=["ACHARD", "Aucun abonné à ce nom", "dans la Drôme."], reveals=[]),
    dict(keys=["mollet"], lines=["MOLLET", "Aucun abonné à ce nom dans la Drôme.", "14 abonnés dans la Loire : précisez la localité."], reveals=[]),
    dict(keys=["vasseur", "mutuelle"], lines=["MUTUELLE RHODANIENNE", "Agence d'Avignon", "84000 AVIGNON", "90 82 11 60"], reveals=[]),
    dict(keys=["berenger"], lines=["BÉRENGER Marius", "Route de Malaucène", "84110 VAISON-LA-ROMAINE", "90 36 04 51"], reveals=[]),
    dict(keys=["isnard"], lines=["ISNARD Norbert", "Chemin du canal", "26110 NYONS", "75 26 19 92"], reveals=["l:canal"]),
    dict(keys=["fredo", "gaston", "josiane", "gisele", "rosa", "sandrine", "lucien", "jacques", "helene", "aime", "firmin", "raoul", "norbert", "anne"],
         lines=["Recherche par prénom impossible.", "Tapez le nom de famille."], reveals=[]),
]

COURTS = dict(agence="Agence", maison_garcin="Maison Garcin", camping_municipal="Camping municipal", camping_saules="Camping des Saules",
              memorial="Mémorial", ferme_tardieu="Ferme Tardieu", boulodrome="Boulodrome", gendarmerie="Gendarmerie", pension="Pension",
              hotel="Hôtel", canal="Canal", pont="Pont roman", moulin="Moulin", pharmacie="Pharmacie", cabinet_sauvan="Dr Sauvan", arcades="Les Arcades")

# ---------------------------------------------------------------------------
# Le plan de Nyons. Cadre de 900 × 600. La vieille ville (les Forts) sur la
# colline au nord, le centre et ses arcades en dessous, l'Eygues au sud, qui
# descend des Pilles (au nord-est, hors plan) ; le pont roman à l'est, avec le
# canal et les moulins. Vaison-la-Romaine est à 15 km au sud-ouest.
# ---------------------------------------------------------------------------
PLAN = dict(
    titre="Plan de Nyons",
    sousTitre="Édition 1994 · échelle 1/8 000",
    zones=dict(
        vieille_ville=dict(d="M300,40 L430,30 L580,44 L600,110 L586,178 L450,190 L310,182 L296,110 Z", label=[520, 62]),
        centre=dict(d="M262,196 L440,206 L600,192 L612,280 L598,350 L440,362 L276,352 L252,280 Z", label=[540, 222]),
        pont_roman=dict(d="M624,150 L740,140 L768,250 L762,360 L736,470 L640,476 L618,380 L624,270 Z", label=[692, 168]),
        digue=dict(d="M150,370 L300,366 L470,374 L610,372 L620,470 L470,478 L300,474 L140,466 Z", label=[230, 392]),
        les_pilles=dict(d="M788,40 L870,36 L874,564 L792,568 L780,300 Z", label=[832, 300], angle=-90, dehors=True),
        vaison=dict(d="M40,500 L300,496 L560,504 L566,566 L300,572 L36,566 Z", label=[440, 540], dehors=True),
    ),
    lieux=dict(
        agence=[318, 236], gendarmerie=[300, 318], arcades=[440, 262], cabinet_sauvan=[540, 252], pharmacie=[560, 318], hotel=[420, 330],
        maison_garcin=[380, 112], pension=[500, 132],
        moulin=[668, 330], canal=[716, 262], pont=[690, 430],
        boulodrome=[460, 420], camping_municipal=[230, 430],
        ferme_tardieu=[832, 150],
        camping_saules=[120, 534], memorial=[300, 534],
    ),
    decor=[
        dict(type="river", d="M900,96 C860,180 800,300 760,380 C720,440 660,462 560,470 C440,480 320,486 180,484 C100,484 40,480 0,476", label="L'Eygues", at=[520, 494], angle=-2),
        dict(type="river", d="M780,250 C740,300 700,340 650,360 C590,382 520,386 440,388 C340,392 250,394 150,396", label="Canal du Moulin", at=[560, 380], angle=-6),
        dict(type="road", d="M0,284 C200,282 400,276 600,270 C700,268 780,240 900,190", label="Avenue Henri-Rochier", at=[160, 278], angle=-1),
        dict(type="road", d="M690,500 C690,470 690,440 690,410"),
        dict(type="road", d="M300,0 C320,80 360,140 440,200 C470,222 470,250 460,282"),
        dict(type="road", d="M260,330 C200,380 140,440 90,600", label="Route de Vaison", at=[150, 470], angle=-62),
        dict(type="note", label="Les Pilles, 8 km →", at=[860, 560], angle=-90),
        dict(type="note", label="↙ Vaison-la-Romaine, 15 km", at=[200, 590], angle=0),
    ],
)

# ------------------------------------------------------------------ construction
def notes(pid, liste):
    out = []
    for i, (about, lab, txt) in enumerate(liste):
        n = dict(about=about, text=txt)
        if lab: n["label"] = lab
        strike = T["CONTRADICTIONS"].get((pid, i))
        if strike: n["struckBy"] = strike
        out.append(n)
    return out

cal = dict(days=A["jours"], slots=A["creneaux"], deadline=A["bouclage"])
cas = dict(
    id="noye_ouveze",
    title=A["titre"],
    subtitle=A["sous_titre"],
    year=A["annee"],
    totalLeads=A["pistes_accordees"],
    referenceLeads=T["SCORE"]["pistes_de_reference"],
    penaltyPerExtraLead=T["SCORE"]["penalite_par_piste_en_plus"],
    referencePath=C["REFERENCE"],
    journal=A["journal"],
    dateUne=A["date_une"],
    priceUne=A["prix_une"],
    localite=A["localite"],
    intro=T["INTRO"],
    briefing=("Chaque piste lue pour la première fois coûte un quart de journée avant le bouclage de jeudi, et vous en avez 20 ; "
              "relire est gratuit. Le calendrier compte, cette fois : certaines pistes n'apparaissent qu'à partir d'un certain jour, "
              "d'autres disparaissent si vous tardez, car les gens partent et les choses se perdent. Certaines personnes ne parlent "
              "que si vous revenez avec la bonne pièce, ou avec la bonne tête. Quand vous serez prêts, écrivez votre article."),
    introNotes=notes("intro", T["INTRO_NOTES"]),
    quartiers=[dict(id=q, name=C["QUARTIERS"][q]) for q in C["QUARTIERS"]],
    locations=[],
    characters=[],
    documents=[dict(id=i, name=n) for i, n in T["DOCUMENTS"].items()],
    minitel=[dict(e, about="p:" + (e["keys"][0] if e["keys"][0] != "garcin" else "helene")) if e["reveals"] else e for e in MINITEL],
    clues=[],
    puzzles={},
    actions=[dict(id=i, name=n) for i, n in T["ACTIONS"].items()],
    article=None,
    attemptFactors=T["SCORE"]["essais"],
    review=T["RELECTURE"],
    ranks=[dict(min=m, label=l) for m, l in T["SCORE"]["rangs"]],
    endings=[],
    complements={q: dict(right=a, wrong=b) for q, (a, b) in T["FINS_COMPLEMENTS"].items()},
    choiceEndings={"poursuite": {"frapper": dict(title=T["FIN_BAGARRE"]["titre"], text=T["FIN_BAGARRE"]["texte"], penalty=T["FIN_BAGARRE"]["penalite"])}},
    epilogue=T["EPILOGUE"],
    weather=A["meteo"],
    calendar=cal,
    solution=T["SOLUTION"],
)

for q in cas["quartiers"]:
    z = PLAN["zones"][q["id"]]
    q["shape"] = z["d"]
    q["label"] = dict(x=z["label"][0], y=z["label"][1], angle=z.get("angle", 0))
    if z.get("dehors"): q["outside"] = True
cas["plan"] = dict(title=PLAN["titre"], subtitle=PLAN["sousTitre"], decor=PLAN["decor"])

for lid, (nom, q) in C["LIEUX"].items():
    loc = dict(id=lid, name=nom, quartier=q, address=ADRESSES[lid], map=dict(x=PLAN["lieux"][lid][0], y=PLAN["lieux"][lid][1]), ambience=AMBIANCES[lid])
    if lid == "agence": loc["alwaysRevealed"] = True
    if lid in COURTS: loc["short"] = COURTS[lid]
    loc["inArticle"] = T["LIEUX_ARTICLE"][lid]
    cas["locations"].append(loc)

for pid, (nom, lieu) in C["PERSONNES"].items():
    ch = dict(id=pid, name=NOMS_ANNUAIRE[pid], label=LABELS.get(pid, nom.split(",")[0]), role=ROLES[pid], locationId=lieu)
    if pid == "garcin": ch["alwaysRevealed"] = True
    if pid in MINITEL_PERSONNES: ch["minitel"] = True
    cas["characters"].append(ch)

for c in C["PISTES"]:
    x = T["PISTES"][c["id"]]
    clue = dict(id=c["id"], locationId=c["lieu"], type=c["type"], button=c["bouton"], title=c["titre"],
                text=x["texte"], facts=notes(c["id"], x["notes"]))
    if c.get("requiert"): clue["requires"] = c["requiert"]
    if c.get("requiert_un"): clue["requiresAny"] = c["requiert_un"]
    if c.get("requiert_puzzle"): clue["requiresPuzzle"] = c["requiert_puzzle"]
    if c.get("des_le") is not None: clue["fromLead"] = c["des_le"]
    if c.get("jusqu_a") is not None: clue["untilLead"] = c["jusqu_a"]
    if c.get("gratuit"): clue["free"] = True
    if c["type"] == "entretien":
        avant = next((k for k in cas["clues"] if k["id"] == c.get("suite")), None)
        premier = re.search(r"\{\{p:([^|}]+)", x["texte"])
        qui = avant.get("speaker") if avant else (premier.group(1) if premier else None)
        if c["id"] == "confrontation": qui = None
        if qui: clue["speaker"] = qui
    if c.get("suite"): clue.update(follows=c["suite"], buttonAlone=c["bouton_seul"], titleAlone=c["titre_seul"])
    if c["id"] in T["PUZZLES"]: clue["puzzle"] = c["id"]
    if c["id"] in T["SILENCE"]: clue["mood"] = "silence"
    if c["id"] in T["NUIT"]: clue["ambience"] = T["NUIT"][c["id"]]
    if c["id"] in T["SALAMANDRE"]: clue["salamandre"] = True
    if c["id"] in T.get("FAX", {}): clue["fax"] = T["FAX"][c["id"]]
    if c["id"] in T["DEBLOCAGE_ACTIONS"]: clue["revealsActions"] = T["DEBLOCAGE_ACTIONS"][c["id"]]
    cas["clues"].append(clue)

pz = T["PUZZLES"]
g = pz["confrontation"]
cas["puzzles"]["confrontation"] = dict(
    type="grille", title=g["titre"], instructions=g["consigne"],
    temoins=g["temoins"],
    declarations=[dict(qui=q, texte=t) for q, t in g["declarations"]],
    indices=[dict(source=s, texte=t) for s, t in g["indices"]],
    categories=[dict(id=k["id"], nom=k["nom"], valeurs=[dict(id=i, nom=n, court=c) for i, n, c in k["valeurs"]]) for k in g["categories"]],
    questions=g["questions"], solution=g["solution"], erreur=g["erreur"],
    help=g["aide"], result=g["resultat"], facts=notes("puzzle_confrontation", g["notes"]),
)
p = pz["portrait"]
cas["puzzles"]["portrait"] = dict(
    type="portrait", title=p["titre"], instructions=p["consigne"],
    temoins=[dict(qui=q, texte=t) for q, t in p["temoins"]],
    traits=[dict(id=t["id"], nom=t["nom"], options=[dict(id=i, nom=n) for i, n in t["options"]]) for t in p["traits"]],
    solution=p["solution"], wrongOne=p["erreur_un"], wrongMany=p["erreur_plusieurs"],
    help=p["aide"], result=p["resultat"], facts=notes("puzzle_portrait", p["notes"]),
)
r = pz["poursuite"]
cas["puzzles"]["poursuite"] = dict(
    type="poursuite", title=r["titre"], instructions=r["consigne"], seconds=r["secondes"], timeout=r["defaut"],
    result=r["commun"], facts=notes("puzzle_poursuite", r["notes"]), help=r["aide"],
    options=[dict(id=o["id"], label=o["bouton"], text=o["texte"], facts=notes("poursuite_" + o["id"], o["notes"]),
                  **({"cost": o["cout"]} if o.get("cout") else {}), **({"revealsActions": o["actions"]} if o.get("actions") else {}))
             for o in r["options"]],
)

# ------------------------------------------------------------------ l'article à trous
TROU = re.compile(r"\[\[(p|l|d|a):([^|\]]+)\|([^\]]+)\]\]")
nb_trous = {}
for par in T["ARTICLE"]:
    for m in TROU.finditer(par["texte"]):
        nb_trous[m.group(3)] = nb_trous.get(m.group(3), 0) + 1
article = []
for par in T["ARTICLE"]:
    parts, pos, n = [], 0, 0
    for m in TROU.finditer(par["texte"]):
        if m.start() > pos: parts.append(par["texte"][pos:m.start()])
        n += 1
        q = m.group(3)
        parts.append(dict(id=f"{par['id']}-{n}", type=m.group(1), answer=m.group(2), q=q,
                          points=round(T["POINTS"][q] / nb_trous[q], 3)))
        pos = m.end()
    if pos < len(par["texte"]): parts.append(par["texte"][pos:])
    p = dict(id=par["id"], title=par["titre"], parts=parts)
    if par.get("bonus"): p["bonus"] = True
    article.append(p)
cas["article"] = article
cas["maxPoints"] = sum(T["POINTS"].values())

# Les fins, dans l'ordre où on les essaie. Une condition vaut true (question juste),
# false (fausse), ou une liste de mots : l'un des blancs de la question contient l'un d'eux.
CONDITIONS = {
    "une": {"Q1": True, "Q2": True, "Q3": True},
    "sans_mobile": {"Q1": True, "Q3": True},
    "legende": {"Q1": True},
    "revenant": {"Q1": ["p:royer", "p:garcin"]},
    "dementi": {},
}
MUSIQUES = {"une": "fin-une", "sans_mobile": "fin-martyr", "legende": "fin-promoteur", "revenant": "fin-dementi", "dementi": "fin-dementi"}
for f in T["FINS"]:
    cas["endings"].append(dict(id=f["id"], when=CONDITIONS[f["id"]], title=f["titre"], headline=T["MANCHETTES"][f["id"]],
                               text=f["texte"].strip(), music=MUSIQUES[f["id"]]))

# ------------------------------------------------------------------ data.json
data_path = RACINE / "data.json"
data = json.loads(data_path.read_text(encoding="utf-8"))
for city in data["cities"]:
    if city["id"] == "nyons":
        city["status"] = "available"
        city["cases"] = [cas]
data_path.write_text(json.dumps(data, ensure_ascii=False, indent=2), encoding="utf-8")
print(f"Affaire construite : {len(cas['clues'])} pistes, {len(cas['locations'])} lieux, {len(cas['characters'])} personnages, "
      f"{len(cas['documents'])} pièces, {len(cas['puzzles'])} puzzles, {len(cas['article'])} paragraphes d'article, {len(cas['endings'])} fins.")
