# Narração por bloco com intervalo fixo entre as falas.
# Frase com ponto final: 0,35 s até a próxima. Vírgula ou dois pontos: 0,15 s.
# Velocidade natural, sem aceleração. Uso: python3 montar-narracao.py
import subprocess, os, wave, numpy as np
D = os.path.join(os.path.dirname(os.path.abspath(__file__)), "narracao")
SR = 48000
PAUSA_PONTO, PAUSA_VIRGULA, ENTRE_BLOCOS = 0.35, 0.15, 0.35
NOMES = {1: "gancho-clone", 2: "frame2", 3: "frame3", 4: "frame4", 5: "clone-etiqueta", 6: "clone-cta"}
# (bloco, ini_raw, fim_raw, texto): trechos dos áudios originais do Higgsfield
FRASES = [
 (1,0.45,2.26,"Você gritou por causa de um atraso."),
 (1,3.63,5.78,"Quem estava do lado levou um susto."),
 (1,6.55,7.32,"E você também."),
 (1,8.38,9.25,"Não veio do nada."),
 (1,10.63,12.60,"Esse grito começou bem antes."),
 (2,0.00,0.60,"O grito."),
 (2,0.93,1.24,"A briga."),
 (2,2.22,3.85,"Isso já é a etapa quatro."),
 (2,4.74,6.08,"Antes dela teve a três."),
 (2,7.13,7.59,"A dois."),
 (2,8.48,9.68,"E a primeira começa aqui."),
 (3,0.25,0.83,"Etapa um."),
 (3,2.29,3.07,"O primeiro aperto."),
 (3,4.61,8.64,"A pessoa chega quarenta minutos atrasada e diz que pegou trânsito."),
 (3,9.49,11.28,"Alguma coisa aperta por dentro."),
 (3,12.56,13.47,"Ainda não tem raiva."),
 (3,14.78,15.36,"Não tem briga."),
 (3,16.84,19.38,"É um incômodo tão rápido que você nem dá nome."),
 (4,0.34,1.42,"Se ninguém percebe,"),
 (4,1.86,2.68,"etapa dois."),
 (4,3.46,5.27,"A cabeça escolhe a pior versão:"),
 (4,5.77,6.85,"não se importa comigo."),
 (4,7.62,8.28,"Etapa três."),
 (4,8.71,9.71,"O corpo acelera."),
 (4,10.18,11.19,"Tem que resolver agora."),
 (4,12.03,12.88,"E aí vem o grito."),
 (5,0.46,1.97,"Dá pra agir nessa etiqueta em branco:"),
 (5,2.61,4.34,"pôr nome no aperto enquanto ele ainda é pequeno."),
 (6,0.26,2.85,"Manda pra quem só conhece a sua etapa quatro."),
]
PAD = 0.03
os.makedirs(f"{D}/frases", exist_ok=True)

def cortar(b, a, z, out):
    f = f"atrim={max(0,a-PAD)}:{z+PAD},asetpts=PTS-STARTPTS,afade=t=in:d=0.015,areverse,afade=t=in:d=0.03,areverse"
    subprocess.run(["ffmpeg","-v","error","-y","-i",f"{D}/originais/raw_{b}.wav","-af",f,"-ac","1","-ar",str(SR),"-f","f32le","-"],check=True,stdout=open(out,"wb"))
    return np.fromfile(out, dtype=np.float32)

def gravar(p, x):
    tmp = p + ".f32"
    x.astype(np.float32).tofile(tmp)
    subprocess.run(["ffmpeg","-v","error","-y","-f","f32le","-ar",str(SR),"-ac","1","-i",tmp,"-af","loudnorm=I=-16:TP=-1.5:LRA=11","-ar",str(SR),"-c:a","pcm_s16le",p],check=True)
    os.remove(tmp)

blocos = {}
linhas = []
for b in sorted(NOMES):
    partes = []
    t = 0.0
    frases = [f for f in FRASES if f[0] == b]
    for i, (_, a, z, txt) in enumerate(frases):
        tmp = f"{D}/frases/_tmp.f32"
        x = cortar(b, a, z, tmp); os.remove(tmp)
        partes.append(x); linhas.append((b, i + 1, t, t + len(x)/SR, txt))
        t += len(x)/SR
        if i < len(frases) - 1:
            p = PAUSA_VIRGULA if txt.endswith((",", ":")) else PAUSA_PONTO
            partes.append(np.zeros(int(p*SR), dtype=np.float32)); t += p
        gravar(f"{D}/frases/bloco{b}-{i+1:02d}.wav", x)
    blocos[b] = np.concatenate(partes)
    gravar(f"{D}/bloco{b}-{NOMES[b]}.wav", blocos[b])

junta = []
for b in sorted(blocos):
    junta.append(blocos[b])
    if b != max(blocos): junta.append(np.zeros(int(ENTRE_BLOCOS*SR), dtype=np.float32))
gravar(f"{D}/narracao-completa-continua.wav", np.concatenate(junta))

with open(f"{D}/tempos.txt", "w") as fh:
    for b in sorted(blocos):
        fh.write(f"BLOCO {b} {NOMES[b]}: {len(blocos[b])/SR:.2f} s\n")
        for l in [l for l in linhas if l[0] == b]:
            fh.write(f"  {l[2]:5.2f} a {l[3]:5.2f}  {l[4]}\n")
print(open(f"{D}/tempos.txt").read())
