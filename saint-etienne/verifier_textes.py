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

# 3 bis. L'article à trous
TROU_C = re.compile(r"\[\[(p|l|d|a):([^|\]]+)\|([^\]]+)\]\]")
for par in T["ARTICLE"]:
    for t, i, q in TROU_C.findall(par["texte"]):
        if t == "a":
            if i not in T["ACTIONS"]: erreurs.append(f"article {par['id']} : action inconnue {i}")
        elif not existe(t, i):
            erreurs.append(f"article {par['id']} : trou {t}:{i} inconnu")
        if q not in T["POINTS"]: erreurs.append(f"article {par['id']} : question inconnue {q}")
    controle_texte("article " + par["id"], par["texte"])
for c, liste in T["DEBLOCAGE_ACTIONS"].items():
    if c not in P: erreurs.append(f"mot d'action débloqué par une piste inconnue : {c}")
    for a in liste:
        if a not in T["ACTIONS"]: erreurs.append(f"{c} débloque une action inconnue : {a}")
for a in T["ACTIONS"]:
    if not any(a in l for l in T["DEBLOCAGE_ACTIONS"].values()): erreurs.append(f"mot d'action jamais débloqué : {a}")

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
for pid in carte["REFERENCE"]:
    if not accessible(pid, faites):
        erreurs.append(f"avec les textes réels, chemin de référence bloqué à : {pid}")
    faites.append(pid)

# ------------------------------------------------------------------ document
def rendu(txt):
    def f(m):
        t, i, lab = m.groups()
        return {"p": f"**{lab}**", "l": f"⌖{lab}", "d": f"*{lab}*"}[t]
    return TAG.sub(f, txt)

md = ["# Le feu de Ferréol : les textes\n",
      "Saint-Étienne, novembre 1993. Tous les textes de l'affaire, dans l'ordre des lieux. Personnes en **gras**, pièces en *italique*, lieux précédés de ⌖. "
      "Généré depuis `textes.py` par `verifier_textes.py`, qui contrôle aussi les balises, les révélations et le chemin de référence.\n"]
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
                md.append(f"> - {nom_fiche(a)}{(' · ' + l) if l else ''} : {rendu(t)}")
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

md.append("## L'article à trous\n")
sc = T["SCORE"]
md.append(f"Le joueur remplit les trous avec les mots découverts (personnes, lieux, pièces, actions). Trois essais au plus : "
          f"{' / '.join(str(int(x * 100)) + ' %' for x in sc['essais'])} des points selon l'essai où l'article part. "
          f"Moins {sc['penalite_par_piste_en_plus']} points par piste lue au-delà de {sc['pistes_de_reference']} (le chemin de référence). "
          "Rangs : " + ", ".join(f"{r} à partir de {s}" for s, r in sc["rangs"]) + ".\n")
TROU = re.compile(r"\[\[(p|l|d|a):([^|\]]+)\|([^\]]+)\]\]")
def mot(t, i):
    return {"p": lambda: f"**{PERSONNES[i][0]}**", "l": lambda: f"⌖{T['LIEUX_ARTICLE'][i]}",
            "d": lambda: f"*{DOCS[i]}*", "a": lambda: f"__{T['ACTIONS'][i]}__"}[t]()
for par in T["ARTICLE"]:
    md.append(f"**{par['titre']}**{' (bonus)' if par.get('bonus') else ''}  ")
    md.append(TROU.sub(lambda m: f"[{mot(m.group(1), m.group(2))} · {m.group(3)}]", par["texte"]) + "\n")
md.append("**Mots d'action** (soulignés) et pistes qui les débloquent :\n")
for aid, lab in T["ACTIONS"].items():
    src = [P[c]["titre"] for c, l in T["DEBLOCAGE_ACTIONS"].items() if aid in l]
    md.append(f"- __{lab}__ : {', '.join(src)}")
md.append("")

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
print(f"{len(TEXTES)} pistes, {tot} mots (moyenne {tot // len(TEXTES)}), {len(PUZZLES)} puzzles, {len(T['ARTICLE'])} paragraphes d'article, {len(T['FINS'])} fins.")
for a in avertissements: print("  ATTENTION", a)
print(("ERREURS :\n  " + "\n  ".join(erreurs)) if erreurs else "Aucune erreur.")
sys.exit(1 if erreurs else 0)
