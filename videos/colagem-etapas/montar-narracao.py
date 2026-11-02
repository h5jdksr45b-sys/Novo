# Corta a narração de cada bloco em frases e monta a faixa guia
# sincronizada com a montagem (54,7 s).
import subprocess, os, wave, numpy as np
D = "/home/user/Novo/videos/colagem-etapas/narracao"
SR = 48000
os.makedirs(f"{D}/frases", exist_ok=True)
# bloco, início do bloco na montagem
BLOCOS = {1: 0.0, 2: 11.1, 3: 21.6, 4: 33.6, 5: 43.6, 6: 49.67}
# (bloco, nome, ini_raw, fim_raw, tempo, posição no bloco, texto)
FRASES = [
 (1,"01","0.45","2.26",1.0,1.00,"Você gritou por causa de um atraso."),
 (1,"02","3.63","5.78",1.0,3.20,"Quem estava do lado levou um susto."),
 (1,"03","6.55","7.32",1.0,5.70,"E você também."),
 (1,"04","8.38","9.25",1.0,6.90,"Não veio do nada."),
 (1,"05","10.63","12.60",1.0,8.30,"Esse grito começou bem antes."),
 (2,"01","0.00","0.60",1.0,1.30,"O grito."),
 (2,"02","0.93","1.24",1.0,2.15,"A briga."),
 (2,"03","2.22","3.85",1.0,2.90,"Isso já é a etapa quatro."),
 (2,"04","4.74","6.08",1.0,5.10,"Antes dela teve a três."),
 (2,"05","7.13","7.59",1.0,6.60,"A dois."),
 (2,"06","8.48","9.68",1.0,7.95,"E a primeira começa aqui."),
 (3,"01","0.25","0.83",1.0,0.45,"Etapa um."),
 (3,"02","2.29","3.07",1.0,1.10,"O primeiro aperto."),
 (3,"03","4.61","8.64",1.2,2.00,"A pessoa chega quarenta minutos atrasada e diz que pegou trânsito."),
 (3,"04","9.49","11.28",1.15,5.42,"Alguma coisa aperta por dentro."),
 (3,"05","12.56","13.47",1.0,7.05,"Ainda não tem raiva."),
 (3,"06","14.78","15.36",1.0,8.05,"Não tem briga."),
 (3,"07","16.84","19.38",1.08,9.35,"É um incômodo tão rápido que você nem dá nome."),
 (4,"01","0.34","1.42",1.15,0.00,"Se ninguém percebe,"),
 (4,"02","1.86","2.68",1.15,0.98,"etapa dois."),
 (4,"03","3.46","5.27",1.0,1.70,"A cabeça escolhe a pior versão:"),
 (4,"04","5.77","6.85",1.0,3.52,"não se importa comigo."),
 (4,"05","7.62","8.28",1.0,4.85,"Etapa três."),
 (4,"06","8.71","9.71",1.0,5.70,"O corpo acelera."),
 (4,"07","10.18","11.19",1.0,6.72,"Tem que resolver agora."),
 (4,"08","12.03","12.88",1.0,7.82,"E aí vem o grito."),
 (5,"01","0.46","1.97",1.0,0.30,"Dá pra agir nessa etiqueta em branco:"),
 (5,"02","2.61","4.34",1.0,2.20,"pôr nome no aperto enquanto ele ainda é pequeno."),
 (6,"01","0.26","2.85",1.0,0.33,"Manda pra quem só conhece a sua etapa quatro."),
]
PAD = 0.05
def ler(p):
    with wave.open(p) as w:
        return np.frombuffer(w.readframes(w.getnframes()), dtype=np.int16).astype(np.float32) / 32768
def gravar(p, x):
    x = np.clip(x, -1, 1)
    with wave.open(p, "wb") as w:
        w.setnchannels(1); w.setsampwidth(2); w.setframerate(SR)
        w.writeframes((x * 32767).astype(np.int16).tobytes())
total = 54.7
guia = np.zeros(int(total * SR) + SR, dtype=np.float32)
linhas = []
for b, nome, a, z, tempo, pos, txt in FRASES:
    ini = max(0, float(a) - PAD); fim = float(z) + PAD
    out = f"{D}/frases/bloco{b}-{nome}.wav"
    filtros = f"atrim={ini}:{fim},asetpts=PTS-STARTPTS"
    if tempo != 1.0: filtros += f",atempo={tempo}"
    filtros += ",afade=t=in:d=0.02,areverse,afade=t=in:d=0.04,areverse"
    subprocess.run(["ffmpeg","-v","error","-y","-i",f"{D}/originais/raw_{b}.wav","-af",filtros,"-ac","1","-ar",str(SR),out],check=True)
    x = ler(out)
    t0 = BLOCOS[b] + pos
    i0 = int(t0 * SR)
    guia[i0:i0+len(x)] += x
    linhas.append((b, nome, t0, t0 + len(x)/SR, pos, txt))
gravar(f"{D}/_guia_bruta.wav", guia[:int(total*SR)])
for l in linhas: print("bloco %d frase %s  %6.2f a %6.2f s (no bloco %5.2f)  %s" % (l[0], l[1], l[2], l[3], l[4], l[5]))
# sobreposições
ls = sorted(linhas, key=lambda l: l[2])
for p, q in zip(ls, ls[1:]):
    if q[2] < p[3]: print("SOBREPOE:", p[0], p[1], "e", q[0], q[1], round(p[3]-q[2], 2))
# Um arquivo por bloco, já no tempo do bloco (solte no início do bloco).
DUR = {1: 11.1, 2: 10.5, 3: 12.0, 4: 10.0, 5: 6.07, 6: 5.03}
NOMES = {1: "gancho-clone", 2: "frame2", 3: "frame3", 4: "frame4", 5: "clone-etiqueta", 6: "clone-cta"}
for b, ini in BLOCOS.items():
    seg = guia[int(ini*SR):int((ini+DUR[b])*SR)]
    gravar(f"{D}/_bloco{b}.wav", seg)
