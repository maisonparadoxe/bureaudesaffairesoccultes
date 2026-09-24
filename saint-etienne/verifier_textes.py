# Vérifie les textes de l'affaire contre la carte des pistes, puis produit
# 5-textes.md (lecture) .   python3 verifier_textes.py
import re, sys, pathlib, runpy, io, contextlib

ICI = pathlib.Path(__file__).parent

with contextlib.redirect_stdout(io.StringIO()):
    try:
        carte = runpy.run_path(str(ICI / "carte.py"))
    except SystemExit:
        carte = None
if carte is None:  # carte.py termine par sys.exit : on la relit sans l'exécuter jusqu'au bout
    src = (ICI / "carte.py").read_text(encoding="utf-8").split("# ------------------------------------------------------------------ contrôles")[0]
    carte = {"__file__": str(ICI / "carte.py")}
    exec(src, carte)
T = runpy.run_path(str(ICI / "textes.py"))

LIEUX, PERSONNES, PISTES_C = carte["LIEUX"], carte["PERSONNES"], carte["PISTES"]
QUARTIERS = carte["QUARTIERS"]
P = {c["id"]: c for c in PISTES_C}
DOCS = T["DOCUMENTS"]
TEXTES, PUZZLES = T["PISTES"], T["PUZZLES"]
TAG = re.compile(r"\{\{(p|l|d):([^}|]+)\|([^}]+)\}\}")

erreurs, avertissements = [], []

def existe(t, i):
    return (t == "p" and i in PERSONNES) or (t == "l" and (i in LIEUX or i in QUARTIERS)) or (t == "d" and i in DOCS)

def tags(txt):
    return [(m.group(1), m.group(2)) for m in TAG.finditer(txt)]

def controle_texte(ou, txt):
    for t, i in tags(txt):
        if not existe(t, i):
            erreurs.append(f"{ou} : balise {{{{{t}:{i}}}}} inconnue")
    if "—" in txt:
        erreurs.append(f"{ou} : tiret cadratin")
    narration = re.sub(r"«[^»]*»", "", txt)
    if re.search(r"\bdonc\b", narration):
        avertissements.append(f"{ou} : « donc » dans la narration")

# 1. Chaque piste de la carte a son texte, et inversement
for pid in P:
    if pid not in TEXTES:
        erreurs.append(f"piste sans texte : {pid}")
for pid in TEXTES:
    if pid not in P:
        erreurs.append(f"texte sans piste dans la carte : {pid}")

# 2. Balises et notes
controle_texte("intro", T["INTRO"])
for pid, x in TEXTES.items():
    controle_texte(pid, x["texte"])
    for (about, lab, txt) in x["notes"]:
        t, i = about.split(":")
        if not existe(t, i):
            erreurs.append(f"{pid} : note sur une fiche inconnue {about}")
        controle_texte(pid + " (note)", txt)
    n = len(re.sub(r"\{\{[pld]:[^|]+\|([^}]+)\}\}", r"\1", x["texte"]).split())
    x["mots"] = n
    if n > 190:
        avertissements.append(f"{pid} : {n} mots")
for pid, pz in PUZZLES.items():
    if pid not in P:
        erreurs.append(f"puzzle sur une piste inconnue : {pid}")
    if not pz.get("aide"):
        erreurs.append(f"puzzle {pid} sans aide")

# 3. Ce que la carte dit révéler doit apparaître dans le texte (ou le puzzle)
for pid, c in P.items():
    if pid not in TEXTES:
        continue
    presents = {f"{t}:{i}" for t, i in tags(TEXTES[pid]["texte"])}
    if pid in PUZZLES:
        presents |= {f"{t}:{i}" for t, i in tags(PUZZLES[pid].get("resultat", ""))}
    lieux_des_personnes = {"l:" + PERSONNES[k[2:]][1] for k in presents if k.startswith("p:")}
    for key in c["revele"]:
        if key not in presents and key not in lieux_des_personnes:
            erreurs.append(f"{pid} : la carte révèle {key}, absent du texte")

# 4. Simulation avec les révélations réelles des textes
def connu(lues):
    k = {f"{t}:{i}" for t, i in tags(T["INTRO"])}
    k |= {f"l:{l}" for l in ["redaction"]}
    for pid in lues:
        k.add("l:" + P[pid]["lieu"])
        k |= {f"{t}:{i}" for t, i in tags(TEXTES[pid]["texte"])}
        if pid in PUZZLES:
            k |= {f"{t}:{i}" for t, i in tags(PUZZLES[pid].get("resultat", ""))}
    for key in list(k):
        if key.startswith("p:"):
            k.add("l:" + PERSONNES[key[2:]][1])
    return k

def accessible(pid, lues):
    c = P[pid]
    if "l:" + c["lieu"] not in connu(lues): return False
    if any(r not in lues for r in c.get("requiert", [])): return False
    if c.get("requiert_un") and not any(r in lues for r in c["requiert_un"]): return False
    return True

lues = []
change = True
while change:
    change = False
    for pid in P:
        if pid not in lues and accessible(pid, lues):
            lues.append(pid); change = True
for pid in P:
    if pid not in lues:
        erreurs.append(f"avec les textes réels, piste inaccessible : {pid}")
faites = []
for pid in carte["MATHILDE"]:
    if not accessible(pid, faites):
        erreurs.append(f"avec les textes réels, chemin de Mathilde bloqué à : {pid}")
    faites.append(pid)

# Ce que chaque piste fait apparaître trop tôt par rapport à la carte (pour relecture)
depart = connu([])
for key in sorted(depart):
    pass

# ------------------------------------------------------------------ document
def rendu(txt):
    def f(m):
        t, i, lab = m.groups()
        return {"p": f"**{lab}**", "l": f"⌖{lab}", "d": f"*{lab}*"}[t]
    return TAG.sub(f, txt)

md = ["# Le feu de Ferréol : les textes\n",
      "Saint-Étienne, novembre 1993. Tous les textes de l'affaire, dans l'ordre des lieux. Personnes en **gras**, pièces en *italique*, lieux précédés de ⌖. "
      "Généré depuis `textes.py` par `verifier_textes.py`, qui contrôle aussi les balises, les révélations et le chemin idéal.\n"]
md.append("## L'intro\n")
md.append(rendu(T["INTRO"]).replace("\n", "\n\n").replace("\n\n\n\n", "\n\n") + "\n")
def nom_fiche(a):
    t2, i = a.split(":")
    return PERSONNES[i][0] if t2 == "p" else LIEUX[i][0] if t2 == "l" else DOCS[i]
md.append("> **Carnet**")
for a, l, t in T["INTRO_NOTES"]:
    md.append(f"> - {nom_fiche(a)}{(' · ' + l) if l else ''} : {rendu(t)}")
md.append("")

for lid, (lnom, q) in LIEUX.items():
    md.append(f"## {lnom}\n")
    for c in [c for c in PISTES_C if c["lieu"] == lid]:
        x = TEXTES[c["id"]]
        cond = ""
        if c.get("requiert"): cond = " · après : " + ", ".join(P[r]["titre"] for r in c["requiert"])
        if c.get("requiert_un"): cond = " · après : " + " ou ".join(P[r]["titre"] for r in c["requiert_un"])
        md.append(f"### {c['titre']}\n")
        md.append(f"*Bouton : « {c['bouton']} » · {c['type']}{cond} · {x['mots']} mots*\n")
        md.append(rendu(x["texte"]) + "\n")
        if x["notes"]:
            md.append("> **Carnet**")
            for a, l, t in x["notes"]:
                t2, i = a.split(":")
                nomf = PERSONNES[i][0] if t2 == "p" else LIEUX[i][0] if t2 == "l" else DOCS[i]
                md.append(f"> - {nomf}{(' · ' + l) if l else ''} : {rendu(t)}")
            md.append("")
        if c["id"] in PUZZLES:
            pz = PUZZLES[c["id"]]
            md.append(f"> **Puzzle : {pz['titre']}**  ")
            md.append(f"> {pz['consigne']}  ")
            if pz.get("morceaux"): md.append(f"> Morceaux : {' / '.join(pz['morceaux'])}  ")
            if pz.get("solution"): md.append(f"> Solution : {pz['solution']}  ")
            if pz.get("indices"): md.append(f"> Indices : {pz['indices']}  ")
            if pz.get("resultat"): md.append(f"> Résultat : {rendu(pz['resultat'])}  ")
            md.append(f"> Aide (coûte une piste) : {pz['aide']}\n")

md.append("## Le questionnaire\n")
sc = T["SCORE"]
md.append(f"Score : points des bonnes réponses, moins {sc['penalite_par_piste_en_plus']} points par piste lue au-delà de {sc['pistes_de_reference']} (la solution de Mathilde). "
          "Rangs : " + ", ".join(f"{r} à partir de {s}" for s, r in sc["rangs"]) + ".\n")
for q in T["QUESTIONS"]:
    md.append(f"**{q['id']}. {q['texte']}** ({q['points']} points)  ")
    md.append("  ".join(("✔ " if ch == q["bonne"] else "○ ") + ch for ch in q["choix"]) + "\n")

md.append("## Les fins\n")
md.append("La fin dépend des trois questions principales. Un paragraphe s'ajoute ensuite pour chacune des questions 4 à 6, selon que la réponse est juste ou fausse, puis vient l'épilogue.\n")
for f in T["FINS"]:
    md.append(f"### {f['titre']} ({f['condition']})\n")
    md.append(f["texte"].strip() + "\n")
md.append("### Les compléments\n")
for q, (juste, faux) in T["FINS_COMPLEMENTS"].items():
    md.append(f"- **{q} juste :** {juste}")
    md.append(f"- **{q} fausse :** {faux}")
md.append("\n### Épilogue (commun à toutes les fins)\n")
md.append(T["EPILOGUE"].strip() + "\n")

(ICI / "5-textes.md").write_text("\n".join(md), encoding="utf-8")

tot = sum(x["mots"] for x in TEXTES.values())
print(f"{len(TEXTES)} pistes, {tot} mots (moyenne {tot // len(TEXTES)}), {len(PUZZLES)} puzzles, {len(T['QUESTIONS'])} questions, {len(T['FINS'])} fins.")
for a in avertissements: print("  ATTENTION", a)
print(("ERREURS :\n  " + "\n  ".join(erreurs)) if erreurs else "Aucune erreur.")
sys.exit(1 if erreurs else 0)
