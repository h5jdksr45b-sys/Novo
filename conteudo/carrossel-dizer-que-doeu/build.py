from PIL import Image, ImageDraw, ImageFont
W,H=1080,1440
CREAM=(241,232,214); DARK=(46,45,37); INK=(30,28,23); CORAL=(210,96,63)
SB="/usr/share/fonts/truetype/liberation/LiberationSerif-Bold.ttf"
SS="/usr/share/fonts/truetype/liberation/LiberationSans-Regular.ttf"
SSB="/usr/share/fonts/truetype/liberation/LiberationSans-Bold.ttf"
def F(p,s): return ImageFont.truetype(p,s)
def wrap(d,text,font,maxw):
    lines=[];cur=""
    for w in text.split():
        t=(cur+" "+w).strip()
        if d.textlength(t,font=font)<=maxw: cur=t
        else: lines.append(cur);cur=w
    if cur: lines.append(cur)
    return lines
def spaced(d,xy,text,font,fill,sp=6):
    x,y=xy
    for ch in text:
        d.text((x,y),ch,font=font,fill=fill); x+=d.textlength(ch,font=font)+sp
def slide(n,total,label,title,body,dark,out,title_hl=None,extra=None):
    bg=DARK if dark else CREAM; fg=CREAM if dark else INK
    im=Image.new("RGB",(W,H),bg); d=ImageDraw.Draw(im)
    M=90; mw=W-2*M
    spaced(d,(M,100),label.upper(),F(SS,26),fg,6)
    y=260
    tf=F(SB,84)
    lines=wrap(d,title,tf,mw)
    while len(lines)>5:
        tf=F(SB,tf.size-6); lines=wrap(d,title,tf,mw)
    for i,l in enumerate(lines):
        col=CORAL if (title_hl and i>=len(lines)-title_hl) else fg
        d.text((M,y),l,font=tf,fill=col); y+=int(tf.size*1.12)
    y+=60
    bf=F(SS,42)
    for para in body:
        if isinstance(para,tuple): txt,col=para
        else: txt,col=para,fg
        for l in wrap(d,txt,bf,mw):
            d.text((M,y),l,font=bf,fill=col); y+=60
        y+=28
    if extra:
        for txt,col in extra:
            sf=F(SS,30)
            for l in wrap(d,txt,sf,mw):
                d.text((M,y),l,font=sf,fill=col); y+=44
    d.text((M,H-110),"Dr. Fabio Schmidt  ·  CRM-SP 183549",font=F(SS,28),fill=fg)
    num=f"{n:02d} / {total:02d}"
    d.text((W-M-d.textlength(num,font=F(SS,28)),H-110),num,font=F(SS,28),fill=CORAL if not dark else CREAM)
    im.save(out)
slide(3,7,"De onde vem","Para quem tem medo de perder, conversa difícil pode soar como despedida.",
 ["Esforço intenso para evitar abandono, real ou imaginado, é um dos nove critérios do diagnóstico de borderline. Daí o ensaio.",
  "Nem toda pessoa com borderline vive isso, e nem todo ensaio é borderline."],True,"slide-03.png")
slide(4,7,"O custo","O que não é dito não some.",
 ["Fica guardado, e a outra pessoa nem sabe que tinha algo pra consertar.",
  "A distância cresce sem briga nenhuma.",
  ("Justo o que o ensaio queria evitar.",CORAL)],False,"slide-04.png")
slide(6,7,"Como dizer","Dizer que doeu não é o mesmo que ir embora.",
 ["Cabe numa mensagem de quatro partes:",
  "1. O fato, sem adjetivo.","2. O que doeu, numa frase.","3. O pedido, uma coisa só.",
  "4. O vínculo: que você quer continuar."],True,"slide-06.png")
slide(7,7,"Pra mandar","Manda pra pessoa que você mais tem medo de perder.",
 [("Se você está do outro lado: manda pra essa pessoa e faz a pergunta do slide 5.",CORAL)],False,"slide-07.png",
 extra=[("Se esse sofrimento se repete, converse com um profissional de saúde mental. Conteúdo educativo; não substitui avaliação individual.",INK)])
