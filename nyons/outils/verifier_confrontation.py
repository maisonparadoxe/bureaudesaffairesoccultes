# Confrontation du canal (Nyons) : verifie qu'il n'y a qu'une solution et un seul menteur.
# Trois grilles : lieu, objet, raison d'etre dehors. Le menteur dit tout faux, les autres tout vrai.
from itertools import permutations
P = ["Helene", "Royer", "Firmin", "Sandrine"]
L = ["canal", "pont", "digue", "arcades"]
O = ["lampe", "cles", "journal", "boule"]
R = ["s'expliquer", "attendre", "surveiller", "chercher"]
FEMMES = {"Helene", "Sandrine"}

def qui(d, v):
    return [p for p in P if d[p] == v][0]

# Indices materiels (toujours vrais)
M = [
    lambda l, o, r: qui(l, "digue") in FEMMES,          # 1. le cantonnier : une femme a la Digue
    lambda l, o, r: l[qui(o, "lampe")] == "canal",      # 2. les gendarmes : la lampe sur la berge du canal
    lambda l, o, r: r[qui(l, "arcades")] == "attendre", # 3. le serveur : la cliente des Arcades guettait la porte
    lambda l, o, r: r[qui(l, "canal")] == "s'expliquer",# 4. la femme de menage : le meunier devait s'expliquer avec quelqu'un au canal
]
# Declarations
S = {
    "Helene":   [lambda l, o, r: l["Helene"] == "arcades"],
    "Royer":    [lambda l, o, r: l["Royer"] != "canal",
                 lambda l, o, r: o["Royer"] == "boule",
                 lambda l, o, r: r["Royer"] == "chercher"],
    "Firmin":   [lambda l, o, r: o["Firmin"] != "lampe",
                 lambda l, o, r: l["Firmin"] not in ("canal", "digue"),
                 lambda l, o, r: r["Firmin"] not in ("chercher", "attendre")],
    "Sandrine": [lambda l, o, r: o["Sandrine"] == "boule",
                 lambda l, o, r: o["Helene"] != "journal"],
}

def solutions(M, S):
    sols = []
    for lp in permutations(L):
        l = dict(zip(P, lp))
        for op in permutations(O):
            o = dict(zip(P, op))
            for rp in permutations(R):
                r = dict(zip(P, rp))
                if not all(m(l, o, r) for m in M):
                    continue
                for menteur in P:
                    if all((not s(l, o, r)) if p == menteur else s(l, o, r)
                           for p in P for s in S[p]):
                        sols.append((menteur, l, o, r))
    return sols

if __name__ == "__main__":
    sols = solutions(M, S)
    print(len(sols), "solution(s)")
    for s in sols:
        print(s)
