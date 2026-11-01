import re, sys, csv

# Crivo automatico de ganchos de Reel falado. Le pool.psv (id|fonte|gancho) e imprime flags.
# Criterios automaticos, tirados de memoria/termometro.md (checklist 30/10) e memoria/reels-certeiros.md.

BANNED = r"\b(manipulad\w*|narcisis\w*|cura\b|transform\w*|mimad\w*|dram[aá]tic\w*|nervos\w*|psiquiatra|especialista|histeri\w*|louc\w*)"
SALES = r"\b(COMEÇAR|começar o protocolo|link na bio|\bbio\b|consulta|protocolo|curso|livro|ebook|mentoria)\b"
NEURO = r"\b(c[eé]rebro|am[ií]gdala|cortisol|dopamina|endorfina|neur[oô]n\w*|l[ií]mbic\w*|pr[eé]-frontal|serotonina|neurobiol\w*)"
TIME_SCENE = r"^(às?|as) \d|^(de madrugada|duas da manhã|três da manhã|de manhã|à noite|no carro|na cama|no jantar|no almoço|segunda|sexta|domingo|sábado|ontem|hoje de manhã)"
HEDGE = r"\b(pode|podem|costuma|costumam|às vezes|talvez|geralmente|muitas vezes)\b"
PRONOUN_START = r"^(ele|ela|eles|elas)\b"
CONTRAST = [
    r"\bnão é [^.,;]{1,40}[,.;] é\b",            # nao e X, e Y
    r"\bnão é [^.,;]{1,40}\. É\b",
    r"\bnão por [^.,;]{1,40}, por\b",
    r"\bnão (é|foi|era) [^.,;]{1,40}, (é|foi|era)\b",
    r"\bparece [^.,;]{1,40}[,.;] (é|mas é)\b",
    r"\b(na|no|em) [^.,;]{1,25}, [^.,;]{1,40}\. (na|no|em) [^.,;]{1,25}, ",  # na A, X. no B, Y
    r",\s*não [^.,;]{1,30}[.!?]$",                # X, nao Y
]
DOUBLE = r"\b(dá|dar|come|comer|pega|pegar|goza|gozar|mama|mamar|enche|encher|dura|duro)\b"
EMOJI_DASH = r"[—–]|[\U0001F300-\U0001FAFF]"
CRISIS_ASK = r"(comenta|nos comentários|conta aqui|me conta)"

def words(s):
    return len(re.findall(r"\w+(?:'\w+)?", s))

def check(g):
    flags = []
    gl = g.lower().strip()
    n = words(g)
    if n < 3 or n > 13: flags.append(f"tamanho:{n}")
    first4 = " ".join(gl.split()[:4])
    if "borderline" not in first4 and "border" not in first4 and not re.search(r"^(por que|quando|três|quatro|cinco|seis|sete|duas|dois) ", gl):
        flags.append("borderline-fora-do-começo")
    if "borderline" not in gl and "border" not in gl and "tpb" not in gl: flags.append("sem-borderline")
    if re.search(PRONOUN_START, gl): flags.append("começa-com-pronome")
    if re.search(HEDGE, gl): flags.append("hesitação")
    if re.search(BANNED, gl): flags.append("palavra-vetada")
    if re.search(SALES, g, re.I): flags.append("venda")
    if re.search(NEURO, gl): flags.append("neurobiologia")
    if re.search(TIME_SCENE, gl): flags.append("abre-com-hora-ou-cenário")
    for c in CONTRAST:
        if re.search(c, gl): flags.append("fórmula-de-contraste"); break
    if re.search(DOUBLE, gl): flags.append("duplo-sentido?")
    if re.search(EMOJI_DASH, g): flags.append("travessão/emoji")
    if re.search(CRISIS_ASK, gl): flags.append("pede-comentário")
    if gl.startswith("você ") or gl.startswith("vocês "): flags.append("abre-em-você")
    return flags

rows = []
with open(sys.argv[1], encoding="utf-8") as f:
    for line in f:
        line = line.rstrip("\n")
        if not line or line.startswith("#"): continue
        parts = line.split("|")
        if len(parts) < 3: continue
        rows.append(parts)

ok = 0
for p in rows:
    fl = check(p[2])
    status = "OK-auto" if not fl else "X"
    if not fl: ok += 1
    print(f"{p[0]}|{p[1]}|{p[2]}|{status}|{';'.join(fl)}")
print(f"# total {len(rows)}, passaram no crivo automático {ok}", file=sys.stderr)
