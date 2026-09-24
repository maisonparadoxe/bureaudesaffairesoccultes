# Construit l'affaire de Saint-Étienne pour le jeu, à partir de carte.py et
# textes.py, et la range dans ../data.json.
#   python3 construire.py      puis      node ../outils/verifier.js
import json, pathlib, runpy, io, contextlib, random

ICI = pathlib.Path(__file__).parent
RACINE = ICI.parent

src = (ICI / "carte.py").read_text(encoding="utf-8").split("# ------------------------------------------------------------------ contrôles")[0]
C = {"__file__": str(ICI / "carte.py")}
exec(src, C)
T = runpy.run_path(str(ICI / "textes.py"))

# ------------------------------------------------------------------ plan
RECTS = {
    "soleil": (330, 20, 260, 150),
    "montreynaud": (620, 20, 240, 130),
    "tarentaize": (40, 200, 230, 170),
    "centre": (300, 200, 300, 190),
    "chateaucreux": (630, 180, 230, 140),
    "zone_industrielle": (40, 400, 260, 170),
    "bellevue": (330, 420, 270, 150),
    "vallee_gier": (630, 350, 230, 220),
}
PINS = {
    "site_ferreol": (400, 105), "cheval_noir": (520, 115),
    "cite_mounier": (740, 95),
    "domicile_faure": (155, 295),
    "redaction": (360, 265), "mairie": (455, 255), "cabinet_vallenot": (550, 265),
    "commissariat": (400, 340), "cabinet_lacour": (510, 345),
    "consigne_gare": (745, 260),
    "siege_ferrand": (170, 495),
    "parking_relais": (465, 505),
    "casse_berthet": (700, 445), "decharge": (795, 520),
}
ADRESSES = {
    "redaction": "12 rue de la République",
    "mairie": "Place de l'Hôtel de Ville",
    "cabinet_vallenot": "3 avenue de la Libération",
    "commissariat": "Rue Charles de Gaulle",
    "cabinet_lacour": "Cours Fauriel",
    "consigne_gare": "Gare de Châteaucreux",
    "domicile_faure": "8 rue des Creuses",
    "site_ferreol": "Impasse des Fondeurs",
    "cheval_noir": "45 rue de la Montat",
    "siege_ferrand": "Zone de la Rivière",
    "cite_mounier": "Tour 9, cité de Montreynaud",
    "casse_berthet": "Chemin du Gier, Rive-de-Gier",
    "decharge": "Route de la Croix-de-l'Orme",
    "parking_relais": "Boulevard Thiers",
}
AMBIANCES = {
    "redaction": "redaction", "mairie": "mairie", "cabinet_vallenot": "cabinet-vallenot",
    "commissariat": "commissariat", "cabinet_lacour": "cabinet-lacour", "consigne_gare": "consigne-gare",
    "domicile_faure": "domicile-faure", "site_ferreol": "ferreol", "cheval_noir": "cheval-noir",
    "siege_ferrand": "ferrand", "cite_mounier": "cite-mounier", "casse_berthet": "casse-berthet",
    "decharge": "decharge", "parking_relais": "parking-relais",
}
ROLES = {
    "faure": "Chargé de mission à l'urbanisme (la victime)",
    "colette": "Veuve de Bernard Faure",
    "ferrand": "Gérant de Ferrand Frères BTP",
    "simone": "Épouse de Roger Ferrand, comptable de l'entreprise",
    "vallenot": "Promoteur, président du Groupe Vallenot",
    "roussillon": "Adjoint au maire, chargé de l'urbanisme",
    "bensaid": "Gardien du site Ferréol",
    "chaptal": "Ancien délégué CGT de la forge",
    "jeannot": "Patron du Cheval Noir",
    "mounier": "Chef d'équipe de nuit chez Ferrand Frères",
    "lacour": "Médecin, a constaté le décès",
    "berthet": "Ferrailleur à Rive-de-Gier",
    "igier": "Lieutenant de police",
    "roche": "Chef des faits divers du Stéphanois",
}
NOMS_ANNUAIRE = {  # « Nom Prénom », comme dans un annuaire
    "faure": "Faure Bernard", "colette": "Faure Colette", "ferrand": "Ferrand Roger", "simone": "Ferrand Simone",
    "vallenot": "Vallenot Hervé", "roussillon": "Roussillon Marcel", "bensaid": "Bensaïd Ahmed",
    "chaptal": "Chaptal Marcel", "jeannot": "Jeannot", "mounier": "Mounier Gérard", "lacour": "Lacour Pierre (Dr)",
    "berthet": "Berthet Lucien", "igier": "Igier Bernard (lieutenant)", "roche": "Roche Daniel",
}
MINITEL_PERSONNES = ["berthet", "mounier", "lacour"]   # leur adresse ne se trouve qu'au Minitel

MINITEL = [
    dict(keys=["berthet", "casse berthet"], lines=["BERTHET Lucien", "Récupération métaux", "Chemin du Gier · 42800 RIVE-DE-GIER", "77 75 02 41"], reveals=["l:casse_berthet"]),
    dict(keys=["mounier"], lines=["MOUNIER Gérard", "Tour 9 · Cité de Montreynaud", "42000 SAINT-ÉTIENNE", "77 74 18 90"], reveals=["l:cite_mounier"]),
    dict(keys=["lacour"], lines=["LACOUR Pierre", "Médecin généraliste", "Cours Fauriel · 42100 SAINT-ÉTIENNE", "77 57 30 12"], reveals=["l:cabinet_lacour"]),
    dict(keys=["ferrand", "ferrand freres"], lines=["FERRAND FRÈRES", "Bâtiment, travaux publics", "Zone de la Rivière · SAINT-ÉTIENNE", "77 25 60 13"], reveals=["l:siege_ferrand"]),
    dict(keys=["vallenot", "groupe vallenot"], lines=["GROUPE VALLENOT", "Promotion immobilière", "3 av. de la Libération · SAINT-ÉTIENNE", "77 32 44 00"], reveals=["l:cabinet_vallenot"]),
    dict(keys=["faure"], lines=["FAURE Bernard", "8 rue des Creuses", "42000 SAINT-ÉTIENNE", "77 33 08 27"], reveals=["l:domicile_faure"]),
    dict(keys=["chaptal"], lines=["CHAPTAL Marcel", "Abonné en liste rouge."], reveals=[]),
    dict(keys=["roussillon"], lines=["ROUSSILLON Marcel", "Abonné en liste rouge."], reveals=[]),
    dict(keys=["bensaid"], lines=["BENSAÏD Ahmed", "Rue de la Montat", "42000 SAINT-ÉTIENNE", "77 41 90 55"], reveals=[]),
    dict(keys=["delombre", "sci delombre"], lines=["SCI DELOMBRE", "Aucun abonné dans la Loire.", "Essayez le 3614 pour un autre département."], reveals=[]),
    dict(keys=["jeannot"], lines=["Précisez le nom de famille."], reveals=[]),
    dict(keys=["simone", "colette", "roger", "herve", "marcel", "bernard", "ahmed", "gerard", "lucien", "pierre", "daniel"], lines=["Recherche par prénom impossible.", "Tapez le nom de famille."], reveals=[]),
]

# ------------------------------------------------------------------ facture (puzzle)
def lignes_facture():
    random.seed(1993)
    numeros = [("77 48 12 00", "le standard de la mairie"), ("77 48 12 37", "le service urbanisme"),
               ("77 25 60 13", "Ferrand Frères"), ("77 41 90 55", "le domicile du gardien"),
               ("77 92 11 11", "l'horloge parlante")]
    lignes = []
    jours = [f"{j:02d}/10" for j in range(4, 30)] + [f"{j:02d}/11" for j in range(2, 17)]
    for _ in range(29):
        j = random.choice(jours)
        h = random.randint(8, 17)
        num, qui = random.choice(numeros)
        lignes.append(dict(date=j, heure=f"{h:02d} h {random.randint(0, 59):02d}", numero=num,
                           duree=f"{random.randint(0, 6)} min {random.randint(0, 59):02d} s", qui=qui))
    lignes.append(dict(date="16/11", heure="22 h 24", numero="07 42 18 63", duree="3 min 06 s", qui=None))
    lignes.sort(key=lambda l: (l["date"][3:], l["date"][:2], l["heure"]))
    return lignes

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

cas = dict(
    id="feu_ferreol",
    title=T["AFFAIRE"]["titre"],
    subtitle=T["AFFAIRE"]["sous_titre"],
    year=T["AFFAIRE"]["annee"],
    totalLeads=T["AFFAIRE"]["pistes_accordees"],
    referenceLeads=T["SCORE"]["pistes_de_reference"],
    penaltyPerExtraLead=T["SCORE"]["penalite_par_piste_en_plus"],
    referencePath=C["MATHILDE"],
    intro=T["INTRO"],
    introNotes=notes("intro", T["INTRO_NOTES"]),
    briefing=("Menez des entretiens et des investigations. Chaque piste lue pour la première fois coûte une heure avant le bouclage, "
              "et vous n'en avez que " + str(T["AFFAIRE"]["pistes_accordees"]) + " ; relire est gratuit. Un lieu n'apparaît sur le plan qu'une fois qu'on vous en a parlé. "
              "Certaines adresses se cherchent au Minitel. Certaines personnes ne parlent que si vous revenez avec la bonne pièce. "
              "Quand vous serez prêts, remplissez le questionnaire : votre article en dépend."),
    quartiers=[dict(id=q, name=C["QUARTIERS"][q], rect=dict(zip("xywh", RECTS[q]))) for q in C["QUARTIERS"]],
    locations=[],
    characters=[],
    documents=[dict(id=i, name=n) for i, n in T["DOCUMENTS"].items()],
    minitel=MINITEL,
    clues=[],
    puzzles={},
    questions=[dict(id=q["id"], points=q["points"], text=q["texte"], choices=q["choix"], answer=q["bonne"]) for q in T["QUESTIONS"]],
    ranks=[dict(min=m, label=l) for m, l in T["SCORE"]["rangs"]],
    endings=[],
    complements={q: dict(right=a, wrong=b) for q, (a, b) in T["FINS_COMPLEMENTS"].items()},
    epilogue=T["EPILOGUE"],
    weather="pluie",
    calendar=dict(days=["Vendredi 19 novembre", "Lundi 22 novembre", "Mardi 23 novembre", "Mercredi 24 novembre"],
                  slots=["9 h", "11 h", "14 h", "16 h"], deadline="Jeudi 25 novembre, 18 h : bouclage"),
    solution=T["SOLUTION"],
)

for lid, (nom, q) in C["LIEUX"].items():
    loc = dict(id=lid, name=nom, quartier=q, address=ADRESSES[lid], map=dict(x=PINS[lid][0], y=PINS[lid][1]), ambience=AMBIANCES[lid])
    if lid == "redaction": loc["alwaysRevealed"] = True
    cas["locations"].append(loc)

for pid, (nom, lieu) in C["PERSONNES"].items():
    ch = dict(id=pid, name=NOMS_ANNUAIRE[pid], role=ROLES[pid], locationId=lieu)
    if pid == "faure": ch["alwaysRevealed"] = True
    if pid in MINITEL_PERSONNES: ch["minitel"] = True
    cas["characters"].append(ch)

for c in C["PISTES"]:
    x = T["PISTES"][c["id"]]
    clue = dict(id=c["id"], locationId=c["lieu"], type=c["type"], button=c["bouton"], title=c["titre"],
                text=x["texte"], facts=notes(c["id"], x["notes"]))
    if c.get("requiert"): clue["requires"] = c["requiert"]
    if c.get("requiert_un"): clue["requiresAny"] = c["requiert_un"]
    if c["id"] in T["PUZZLES"]: clue["puzzle"] = c["id"]
    if c["id"] in T["SILENCE"]: clue["mood"] = "silence"; clue["ambience"] = "ferreol-nuit" if c["lieu"] == "site_ferreol" else None
    if clue.get("ambience") is None: clue.pop("ambience", None)
    if c["id"] in T["SALAMANDRE"]: clue["salamandre"] = True
    if c["id"] in T.get("FAX", {}): clue["fax"] = T["FAX"][c["id"]]
    cas["clues"].append(clue)

pz = T["PUZZLES"]
cas["puzzles"] = {
    "reperage": dict(type="fragments", title=pz["reperage"]["titre"], instructions=pz["reperage"]["consigne"],
                     pieces=pz["reperage"]["morceaux"], result=pz["reperage"]["resultat"], help=pz["reperage"]["aide"],
                     facts=notes("puzzle_reperage", pz["reperage"]["notes"])),
    "facture_tel": dict(type="line", title=pz["facture_tel"]["titre"], instructions=pz["facture_tel"]["consigne"],
                        lines=lignes_facture(), result=pz["facture_tel"]["resultat"], help=pz["facture_tel"]["aide"],
                        facts=notes("puzzle_facture", pz["facture_tel"]["notes"])),
    "coffre": dict(type="code", title=pz["coffre"]["titre"], instructions=pz["coffre"]["consigne"], digits=4,
                   code=pz["coffre"]["solution"], result=pz["coffre"]["resultat"], help=pz["coffre"]["aide"],
                   facts=notes("puzzle_coffre", pz["coffre"]["notes"])),
}

CONDITIONS = {"une": {"Q1": True, "Q2": True, "Q3": True}, "martyr": {"Q1": True, "Q3": True, "Q2": False},
              "promoteur": {"Q1": True, "Q3": False}, "dementi": {"Q1": False}}
MUSIQUES = {"une": "fin-une", "martyr": "fin-martyr", "promoteur": "fin-promoteur", "dementi": "fin-dementi"}
for f in T["FINS"]:
    cas["endings"].append(dict(id=f["id"], when=CONDITIONS[f["id"]], title=f["titre"], headline=T["MANCHETTES"][f["id"]],
                               text=f["texte"].strip(), music=MUSIQUES[f["id"]]))

# ------------------------------------------------------------------ data.json
data_path = RACINE / "data.json"
data = json.loads(data_path.read_text(encoding="utf-8"))
archives = RACINE / "archives"
archives.mkdir(exist_ok=True)
for city in data["cities"]:
    if city["id"] == "saint_etienne":
        anciens = [c for c in city["cases"] if c["id"] != "feu_ferreol"]
        if anciens:
            (archives / "saint-etienne-ancienne-version.json").write_text(json.dumps(anciens, ensure_ascii=False, indent=2), encoding="utf-8")
        city["cases"] = [cas]
    if city["id"] == "nyons" and city["cases"]:
        (archives / "nyons-ancienne-version.json").write_text(json.dumps(city["cases"], ensure_ascii=False, indent=2), encoding="utf-8")
        city["cases"] = []
        city["status"] = "coming_soon"
# Note de service d'introduction (affichée à la première nouvelle partie)
data["prologue"] = {
    "entete": "Groupe Sarrazin · Direction générale · 14, cours Lafayette · Lyon",
    "date": "Lyon, le 4 octobre 1993",
    "de": "Jean-Loup Sarrazin, président-directeur général",
    "a": "Mathilde Vernet",
    "copie": "Yves Barral, Karim Haddou, Odile Perrichon",
    "objet": "Création de la rubrique « Les Affaires occultes »",
    "corps": [
        "Mathilde,",
        "Nos études sont formelles : le lecteur du samedi veut du mystère. À compter du 6 novembre, nos quatorze quotidiens publieront chaque samedi une page commune, « Les Affaires occultes » : maisons hantées, guérisseurs, phénomènes inexpliqués. Le concept est simple, la cible est large.",
        "Vous en aurez la responsabilité. Vous disposerez de l'ancienne salle des archives, au quatrième étage, d'Yves Barral pour les photos, et de Karim Haddou, stagiaire, qui s'est porté volontaire. Odile Perrichon, aux archives, reste à votre disposition.",
        "Chaque semaine, vous partirez là où nos lecteurs signalent quelque chose d'étrange. Vous serez hébergés par la rédaction locale. Le bouclage est le jeudi à 18 heures. Les notes de frais seront examinées une par une.",
        "Je compte sur vous pour me faire du fantôme, pas de la politique. On est d'accord ?"
    ],
    "signature": "J.-L. S.",
    "annotation": "Admettons. M. V.",
    "equipe": [
        {"id": "mathilde", "nom": "Mathilde Vernet", "role": "Cheffe du Bureau", "texte": "Dix ans au service police-justice. Mise au placard en 1991, après un article que le groupe a dû démentir. Elle n'a jamais cru à ce démenti."},
        {"id": "yves", "nom": "Yves Barral", "role": "Photographe", "texte": "Vingt-cinq ans dans les agences parisiennes. Ne croit qu'à ses négatifs, et remarque les visages qui reviennent."},
        {"id": "karim", "nom": "Karim Haddou", "role": "Stagiaire", "texte": "Sorti de l'école de journalisme de Lille. Lit tout sur les phénomènes inexpliqués, et y croit un peu."},
        {"id": "odile", "nom": "Odile Perrichon", "role": "Documentaliste", "texte": "Aux archives du groupe depuis 1964. Se souvient de tout, et de qui on a fait taire."}
    ],
    "vous": "Vous êtes l'équipe. Vous choisissez où aller, qui interroger, et ce qui sera publié."
}

# Crédits : créés une seule fois, puis modifiables à la main dans data.json
data.setdefault("credits", [
    {"title": "Conception et écriture", "lines": ["À compléter : votre nom"]},
    {"title": "Illustrations", "lines": ["À compléter"]},
    {"title": "Sons et musiques", "lines": ["À compléter : auteurs, sources et licences de chaque son"]},
    {"title": "Programmation", "lines": ["Avec l'aide de Claude (Anthropic)"]},
    {"title": "Polices de caractères", "lines": ["Special Elite, par Astigmatic", "Lora, par Cyreal", "IBM Plex Mono, par IBM", "Sous licences libres (SIL Open Font License, Apache 2.0), via Google Fonts"]},
    {"title": "Remerciements", "lines": ["Aux testeuses et testeurs."]},
])
data_path.write_text(json.dumps(data, ensure_ascii=False, indent=2), encoding="utf-8")
print(f"Affaire construite : {len(cas['clues'])} pistes, {len(cas['locations'])} lieux, {len(cas['characters'])} personnages, "
      f"{len(cas['documents'])} pièces, {len(cas['puzzles'])} puzzles, {len(cas['questions'])} questions, {len(cas['endings'])} fins.")
