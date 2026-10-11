#!/usr/bin/env python3
"""Gera os três PDFs do Dr. Fabio Schmidt (HTML -> PDF via Chromium)."""
import pathlib, subprocess, sys

HERE = pathlib.Path(__file__).parent
OUT = HERE.parent / "out"
CHROME = "/opt/pw-browsers/chromium-1194/chrome-linux/chrome"

SITE = "www.drfabioschmidt.net"
INSTA = "@drfabioschmidt"
PRE_CONSULTA = "https://consultadrfabio.base44.app/"
CURSO = "curso.drfabioschmidt.net"
ASSINATURA = "Dr. Fabio Schmidt · Médico · CRM-SP 183549"
LIVRO = "Quem Sofre Não Escolhe Como Gritar"

CSS = """
@page { size: A4; margin: 0 }
* { box-sizing: border-box; margin: 0; padding: 0 }
html { -webkit-print-color-adjust: exact; print-color-adjust: exact }
body { font-family: 'Inter', sans-serif; color: #1E1E1E; font-size: 11.6pt; line-height: 1.5 }
.serif { font-family: 'Bitstream Charter', 'Caladea', serif }
.page { width: 210mm; height: 297mm; position: relative; overflow: hidden; background: #F3EFE8; padding: 22mm 20mm 24mm; page-break-after: always }
.page:last-child { page-break-after: auto }
.foot { position: absolute; left: 20mm; right: 20mm; bottom: 10mm; display: flex; justify-content: space-between; font-size: 8pt; color: #8A847C }
.cover { background: #1F4E5A; color: #F4F1EC; padding: 28mm 22mm }
.cover .tag { font-size: 9pt; letter-spacing: .14em; text-transform: uppercase; color: #E0A43A; font-weight: 600 }
.cover h1 { font-family: 'Bitstream Charter', serif; font-size: 40pt; line-height: 1.05; letter-spacing: -.02em; margin: 90mm 0 10mm; font-weight: 700 }
.cover p { font-size: 13pt; line-height: 1.45; max-width: 140mm; color: #D8E3E6 }
.cover .by { position: absolute; left: 22mm; right: 22mm; bottom: 22mm; border-top: 1px solid rgba(244,241,236,.3); padding-top: 6mm; font-size: 10pt; color: #D8E3E6 }
.cover .dot { width: 14px; height: 14px; border-radius: 99px; background: #E0A43A; display: inline-block; margin-right: 8px }
.kicker { font-size: 9pt; letter-spacing: .12em; text-transform: uppercase; font-weight: 700; color: #B3603E; margin-bottom: 4mm }
.num { font-family: 'Bitstream Charter', serif; font-size: 54pt; color: #B3603E; line-height: 1; margin-bottom: 2mm }
h2 { font-family: 'Bitstream Charter', serif; font-size: 26pt; line-height: 1.08; letter-spacing: -.015em; margin-bottom: 6mm; color: #1F4E5A }
h3 { font-family: 'Bitstream Charter', serif; font-size: 14pt; line-height: 1.2; margin-bottom: 2mm; color: #1F4E5A }
p { margin-bottom: 4mm }
.lead { font-size: 13.5pt; line-height: 1.5; color: #1E1E1E }
.card { background: #FBFAF7; border-radius: 10px; padding: 6mm 7mm; box-shadow: 0 1px 0 rgba(0,0,0,.05) }
.grid2 { display: grid; grid-template-columns: 1fr 1fr; gap: 5mm }
.tight .card { padding: 4mm 5.5mm } .tight .card p { font-size: 10pt; line-height: 1.4 } .tight h3 { font-size: 12.5pt }
.grid3 { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 4mm }
.sky { background: #D3E3EA } .sage { background: #DCE6D2 } .blush { background: #F4DCCF } .sand { background: #F6E6C4 }
.safety { border: 2px solid #B3603E; background: #FBFAF7; border-radius: 10px; padding: 5mm 6mm; font-size: 10pt }
.safety b { color: #B3603E }
.big { font-family: 'Bitstream Charter', serif; font-size: 17pt; line-height: 1.25; color: #1F4E5A; font-weight: 700 }
.pair { display: grid; grid-template-columns: 1fr 1fr; gap: 3mm; margin-bottom: 3mm }
.pair div { border-radius: 8px; padding: 3.2mm 4.2mm; font-size: 10.6pt; line-height: 1.4 }
.pair .no { background: #F4DCCF } .pair .yes { background: #DCE6D2 }
.pair small { display: block; font-size: 7.4pt; letter-spacing: .1em; text-transform: uppercase; font-weight: 700; margin-bottom: 1mm }
.pair .no small { color: #B3603E } .pair .yes small { color: #3F6B45 }
.why { font-size: 9.4pt; color: #5E5850; margin: -1mm 0 4.5mm 1mm }
.sc { font-weight: 700; color: #1F4E5A; font-size: 11.6pt; margin: 0 0 1.5mm }
ul.clean { list-style: none } ul.clean li { padding-left: 6mm; position: relative; margin-bottom: 2.2mm }
ul.clean li::before { content: ''; position: absolute; left: 0; top: 2.4mm; width: 7px; height: 7px; border-radius: 99px; background: #B3603E }
.flow { display: grid; grid-template-columns: 1fr 9mm 1fr 9mm 1fr; align-items: stretch; margin: 6mm 0 }
.flow .arrow { display: flex; align-items: center; justify-content: center; color: #B3603E; font-size: 18pt }
.flow .card { font-size: 10.4pt } .flow h3 { font-size: 12pt }
.legal { font-size: 8pt; color: #6B655E; line-height: 1.4 }
.price { font-family: 'Bitstream Charter', serif; font-size: 24pt; font-weight: 700; color: #1F4E5A; line-height: 1.1 }
.btn { display: inline-block; background: #1F4E5A; color: #F4F1EC; font-weight: 700; font-size: 10pt; padding: 3mm 6mm; border-radius: 99px; text-decoration: none; margin: 1mm 2mm 1mm 0 }
.btn.alt { background: #B3603E }
a { color: inherit }
.steps { counter-reset: s } .steps .card { display: grid; grid-template-columns: 12mm 1fr; gap: 4mm; align-items: start; margin-bottom: 3.5mm; padding: 4.5mm 6mm }
.steps .card::before { counter-increment: s; content: counter(s); font-family: 'Bitstream Charter', serif; font-size: 24pt; color: #B3603E; line-height: 1 }
.steps h3 { margin-bottom: 1mm } .steps p { margin: 0; font-size: 10.6pt }
"""


def doc(title, pages, cover_html):
    n = len(pages) + 1
    body = [cover_html]
    for i, p in enumerate(pages, start=2):
        body.append(f'<section class="page">{p}<div class="foot"><span>{ASSINATURA}</span><span>{i} / {n}</span></div></section>')
    return f'<!doctype html><html lang="pt-BR"><head><meta charset="utf-8"><title>{title}</title><style>{CSS}</style></head><body>{"".join(body)}</body></html>'


def render(name, html):
    src = HERE / f"{name}.html"
    src.write_text(html, encoding="utf-8")
    pdf = OUT / f"{name}.pdf"
    subprocess.run([CHROME, "--headless=new", "--no-sandbox", "--disable-gpu", "--no-pdf-header-footer",
                    f"--print-to-pdf={pdf}", f"file://{src}"], check=True, stderr=subprocess.DEVNULL)
    print("ok", pdf)


def pair(no, yes, why=None):
    h = f'<div class="pair"><div class="no"><small>Evite</small>{no}</div><div class="yes"><small>Use</small>{yes}</div></div>'
    if why:
        h += f'<p class="why">{why}</p>'
    return h


# ------------------------------------------------------------------ PDF 1: famílias
def pdf_familia():
    cover = f'''<section class="page cover">
      <div class="tag"><span class="dot"></span>Material gratuito</div>
      <h1>Primeiros passos para quem convive com alguém com borderline</h1>
      <p>Entender o ciclo, atravessar a crise e cuidar de quem cuida. Um guia para consultar, não para ler de uma vez.</p>
      <div class="by"><b>Dr. Fabio Schmidt</b><br>Médico · CRM-SP 183549 · Edição 2026</div></section>'''
    pages = []
    pages.append(f'''
      <div class="kicker">Como usar</div><h2>Isto se consulta. Não se lê de uma vez.</h2>
      <p class="lead">Você não vai abrir este guia no meio da crise como quem lê um livro. Vai abrir como quem procura um mapa: descobre em que momento está, encontra o que fazer e age.</p>
      <p>Ele segue a vida real de quem convive. Primeiro, o que está acontecendo por dentro da pessoa. Depois, a crise em quatro tempos. Em seguida, o que falar nos momentos mais difíceis. E, por fim, você, porque cuidar sem se perder é a única forma de continuar cuidando.</p>
      <div class="card sky" style="margin:6mm 0"><div class="big">Uma regra atravessa o guia inteiro.</div><p style="margin:3mm 0 0">Na crise, quem tem razão fica para depois. Primeiro vem a segurança. Depois, a conversa. Discutir o mérito durante a desregulação faz você perder os dois.</p></div>
      <div class="grid2" style="margin-bottom:6mm">
        <div class="card"><h3>01 Entender antes de agir</h3><p style="margin:0;font-size:10.4pt">O ciclo e por que não é pessoal.</p></div>
        <div class="card"><h3>02 A crise em quatro tempos</h3><p style="margin:0;font-size:10.4pt">Antes, durante, no auge e depois.</p></div>
        <div class="card"><h3>03 O que falar</h3><p style="margin:0;font-size:10.4pt">Frases para os cenários mais difíceis.</p></div>
        <div class="card"><h3>04 Você também importa</h3><p style="margin:0;font-size:10.4pt">Sinais de esgotamento e limite com presença.</p></div>
      </div>
      <div class="safety"><b>Em risco imediato, não use este guia no lugar de ajuda.</b> Ligue para o CVV 188 (gratuito, 24 horas, ligação ou chat) ou para o SAMU 192, ou procure o pronto-socorro mais próximo. Este material é educativo e não substitui acompanhamento profissional.</div>''')
    pages.append(f'''
      <div class="num">01</div><h2>Entender antes de agir</h2>
      <p class="lead">Quase todo conflito começa com uma leitura errada do que está acontecendo. Entender o mecanismo tira você do lugar de quem acha que está fazendo tudo errado e o coloca no lugar de quem consegue agir antes da escalada.</p>
      <p>Tudo gira em torno de uma sensibilidade aumentada ao vínculo. Uma resposta curta, uma demora, uma mudança de tom. O que para você passou despercebido pode ter disparado um alarme real. Isso não é escolha. É a forma como o sistema emocional da pessoa reage a eventos de relação.</p>
      <div class="flow">
        <div class="card sky"><h3>Gatilho</h3>Um evento na relação. Rejeição, crítica ou abandono, reais ou percebidos. Às vezes é algo pequeno.</div><div class="arrow">→</div>
        <div class="card sand"><h3>Estado interno</h3>Emoção intensa, sensação de vazio, perda de chão. Tudo parece urgente.</div><div class="arrow">→</div>
        <div class="card blush"><h3>Resposta</h3>Explosão ou retraimento. Impulsividade, fuga, comportamento de risco.</div>
      </div>
      <p>Dar nome a esse ciclo é o primeiro movimento que ajuda. Quando a pessoa entende o próprio padrão, ela deixa de se sentir louca. E quando você entende o padrão, deixa de levar cada crise como ataque pessoal.</p>
      <div class="card" style="margin-top:6mm"><div class="big">Não é com você, mesmo quando parece.</div><p style="margin:3mm 0 0">O ciclo tem começo, meio e fim. Um padrão que se reconhece é um padrão sobre o qual dá para agir. A família não é espectadora do cuidado. É parte dele.</p></div>''')
    pages.append(f'''
      <div class="num">02</div><h2>A crise em quatro tempos</h2>
      <p>Cada tempo pede uma coisa diferente de você. Saber em qual está evita fazer no auge o que só funciona no depois.</p>
      <div class="grid2 tight" style="margin-bottom:3mm">
        <div class="card sky"><div class="kicker">Tempo 1</div><h3>Antes: você percebe primeiro</h3><p style="margin:0">A pessoa fica mais calada ou fala demais. Dorme mal. Responde curto. Parece longe mesmo estando perto. Não apresse a explicação. Pergunte de leve: você quer companhia ou espaço?</p></div>
        <div class="card sand"><div class="kicker">Tempo 2</div><h3>Durante: o que piora, o que acalma</h3><p style="margin:0">A pessoa não está te testando. Está tentando não afundar. Argumento escala. Frase curta de reconhecimento desacelera. Às vezes o melhor é não dizer nada e só ficar: o silêncio ao lado vale mais que a frase certa.</p></div>
        <div class="card blush"><div class="kicker">Tempo 3</div><h3>No auge: os primeiros 60 segundos</h3><p style="margin:0">Seu papel não é resolver nem argumentar. É conduzir com clareza e baixar a temperatura. Veja os quatro movimentos na próxima página.</p></div>
        <div class="card sage"><div class="kicker">Tempo 4</div><h3>Depois: reconectar, não cobrar</h3><p style="margin:0">A crise acaba antes da recuperação. Nas horas seguintes a pessoa ainda está frágil e, quase sempre, envergonhada. Um gesto simples de reaproximação vale mais que um discurso.</p></div>
      </div>
      <h3 style="margin-top:3mm">No Tempo 2, três trocas simples</h3>
      {pair("Calma, não é pra tanto.", "Estou aqui com você.")}
      {pair("Você está exagerando.", "Me conta o que está pesando.")}
      {pair("Já passou, esquece.", "A gente resolve quando você estiver melhor.")}
      ''')
    pages.append(f'''
      <div class="kicker">Tempo 3</div><h2>No auge, os primeiros 60 segundos decidem o resto</h2>
      <p class="lead">Na crise, a pessoa está em modo de sobrevivência. Tudo parece urgente, doloroso e sem volta. Estes quatro movimentos vêm antes de qualquer conversa.</p>
      <div class="grid2" style="margin:5mm 0">
        <div class="card sky"><h3>Pause</h3><p style="margin:0">Não responda no impulso. Dez segundos de silêncio seu já mudam o campo.</p></div>
        <div class="card sky"><h3>Baixe o tom antes das palavras</h3><p style="margin:0">A mesma frase em tom crítico vira combustível. A entonação faz mais estrago que o conteúdo.</p></div>
        <div class="card sky"><h3>Ofereça uma opção concreta</h3><p style="margin:0">Você quer água? Quer ar? Quer que eu fique ou que eu te dê espaço? Concreto, não abstrato.</p></div>
        <div class="card sky"><h3>Não discuta lógica</h3><p style="margin:0">Argumento nenhum regula uma crise. Qualquer prova de que a pessoa está errada vai escalar.</p></div>
      </div>
      <div class="safety"><b>Quando pedir ajuda.</b> Se a crise passar de 20 minutos sem reduzir, ou se houver qualquer sinal de risco à vida, não conduza sozinho. Acione a pessoa de confiança combinada, ligue para o CVV 188 ou para o SAMU 192, ou procure o pronto-socorro. Não espere piorar para pedir ajuda.</div>
      <h3 style="margin-top:8mm">Depois: as próximas 24 horas</h3>
      <ul class="clean">
        <li>Não traga o histórico nem o que a pessoa fez. A vergonha já está fazendo esse trabalho sozinha.</li>
        <li>A conversa sobre o que aconteceu e como evitar vem quando os dois estiverem calmos, não antes de 24 a 48 horas.</li>
        <li>Ao conversar, pergunte em vez de acusar: o que te ajudaria da próxima vez? Qual é o sinal de que está vindo?</li>
        <li>Combine o plano da próxima vez fora da crise: o sinal de alerta, o espaço seguro e como a pessoa quer que você aja.</li>
      </ul>''')
    pages.append(f'''
      <div class="num">03</div><h2>O que falar</h2>
      <p class="lead">Três regras sustentam todas as frases deste guia.</p>
      <div class="grid3" style="margin:5mm 0">
        <div class="card sky"><h3>Validação primeiro</h3><p style="margin:0;font-size:10.4pt">O sentimento vem antes do comportamento. Reconhecer que a pessoa está assustada vem antes de dizer que algo não funcionou.</p></div>
        <div class="card sky"><h3>Tom antes das palavras</h3><p style="margin:0;font-size:10.4pt">A mesma frase em tom crítico vira combustível. Confira a entonação antes de escolher a frase.</p></div>
        <div class="card sky"><h3>Limite com presença</h3><p style="margin:0;font-size:10.4pt">Limite sem consistência vira punição. Limite com presença vira estrutura. A pessoa precisa dos dois juntos.</p></div>
      </div>
      <div class="card" style="background:#1F4E5A;color:#F4F1EC;margin:6mm 0"><div class="kicker" style="color:#E0A43A">Frase mestra, para quando você não souber o que dizer</div><div class="serif" style="font-size:20pt;line-height:1.25;font-weight:700">Eu tô aqui. E eu não vou discutir no grito. Eu volto já.</div><p style="margin:4mm 0 0;font-size:10.4pt;color:#D8E3E6">Ela faz quatro coisas ao mesmo tempo: nomeia a emoção, separa o episódio da identidade, estrutura o próximo passo e marca presença com limite.</p></div>
      <h3>Antes de abrir a boca, seis perguntas</h3>
      <ul class="clean" style="columns:2;column-gap:8mm;font-size:10.6pt">
        <li>Estou validando a emoção ou só reagindo ao comportamento?</li><li>Meu tom está neutro ou caloroso, sem ironia?</li><li>Estou oferecendo estrutura, e não julgamento?</li><li>Estou separando o episódio da identidade da pessoa?</li><li>Meu limite vem com presença, não com abandono?</li><li>O que vou dizer reduz ou aumenta a escala?</li>
      </ul>
      <p class="why" style="margin-top:2mm">Se a resposta for não para duas ou mais, pause e recomece pela frase mestra.</p>''')
    cen = [
        ("Quando a pessoa lê um atraso como abandono", "Você tá paranoico de novo. Para com isso.", "Entendo que isso te deixou inseguro. Deixa eu esclarecer o que eu quis dizer.", "Invalida a experiência e transforma o medo em defeito. Se continuar escalando: a conversa ficou intensa, a gente pausa dez minutos e volta."),
        ("Quando você precisa corrigir algo", "O que você fez foi errado, e você sabe disso.", "Essa ação não funcionou. Vou explicar por quê e pensar alternativas com você.", "Chega como julgamento sem validação e ativa a vergonha. Evite sempre e nunca, listar o histórico e sermão."),
        ("Quando vem a raiva explosiva", "Para de falar assim ou eu vou embora.", "Eu vejo a raiva forte. Vou me afastar por segurança, não como punição.", "Ameaça de abandono em plena escalada aumenta raiva e pânico ao mesmo tempo. Não grite de volta nem ironize."),
        ("Quando o pedido de garantia não acaba", "Já respondi mil vezes. Você nunca acredita.", "Sua dúvida acalma um tempo e volta. Vamos construir uma certeza que vem de dentro.", "Tratar como falha de caráter aumenta a vergonha e a insistência. Se continuar: você quer que eu repita ou quer tentar outra ferramenta agora?"),
        ("Quando tudo parece ter voltado ao começo", "Você tava indo tão bem. Por que se sabotaria?", "Seu progresso não desapareceu. Isso é um episódio, não uma volta ao começo.", "Atribuir intenção à recaída piora a vergonha. Não use o progresso como arma nem como obrigação."),
        ("Quando você precisa sair ou se afastar", "Se você me amasse, entenderia que preciso de tempo longe.", "Vou sair por um tempo. Sei que isso ativa medo. Volto às tantas horas e te aviso quando estiver indo.", "Soa como ameaça. Avisar antes, combinar a volta e cumprir é o que protege o vínculo."),
    ]
    p1 = '<div class="kicker">03 · Cenários</div><h2>Frases para os momentos difíceis</h2>' + "".join(f'<div class="sc">{t}</div>{pair(a, b, c)}' for t, a, b, c in cen[:3])
    p2 = '<div class="kicker">03 · Cenários</div><h2>Mais três cenários</h2>' + "".join(f'<div class="sc">{t}</div>{pair(a, b, c)}' for t, a, b, c in cen[3:])
    pages += [p1, p2]
    pages.append(f'''
      <div class="kicker">Quando é risco</div><h2>Autolesão, desesperança e risco de vida</h2>
      <p class="lead">São os cenários mais delicados. Aqui a segurança vem antes de qualquer conversa e antes de qualquer regra deste guia.</p>
      <div class="sc" style="margin-top:4mm">Quando a pessoa fala em se machucar ou age por impulso</div>
      {pair("Você faz isso pra chamar atenção.", "Em crise o impulso busca alívio rápido. Vamos achar outra saída agora, junto.")}
      <p class="why">Se continuar escalando: vou tratar isso como risco real. Você está seguro agora? Vou buscar ajuda com você.</p>
      <div class="sc">Quando aparecem frases como não vale a pena, ninguém se importa, queria sumir</div>
      {pair("Pensa na sua família. Você tá sendo egoísta.", "Seu sofrimento é real. Vamos focar em segurança e em buscar ajuda agora.")}
      <p class="why">Se continuar escalando: vou acionar ajuda agora e fico com você até ela chegar. Não argumente, não negocie e não deixe a pessoa sozinha.</p>
      <div class="safety" style="margin-top:6mm"><b>Em risco imediato</b><br><span class="serif" style="font-size:16pt;font-weight:700;color:#1F4E5A">CVV 188</span> · gratuito, 24 horas, ligação ou chat<br><span class="serif" style="font-size:16pt;font-weight:700;color:#1F4E5A">SAMU 192</span> · emergência médica<br>Ou leve a pessoa ao pronto-socorro mais próximo. Não espere passar sozinho.</div>''')
    pages.append(f'''
      <div class="num">04</div><h2>Você também importa</h2>
      <p class="lead">Ajudar alguém não significa aguentar tudo calado. Você também sente, também cansa, também pode adoecer junto. Cuidar de você é o que mantém você capaz de ficar.</p>
      <p>Você pode fazer tudo certo e a crise ainda vir. Isso não é falha sua. Fique atento a estes sinais de que o cuidado está te consumindo:</p>
      <ul class="clean"><li>Você está exausto com os assuntos emocionais da pessoa de um jeito que já não cabe no seu papel.</li><li>Você evita conversar por medo de disparar uma crise.</li><li>Você sente raiva onde antes sentia cuidado.</li><li>Você se pega isolando ou punindo de leve, sem perceber.</li><li>Você abriu mão das suas coisas e nem lembra quando foi.</li></ul>
      <p class="why">Dois ou mais sinais não são fraqueza. São um aviso de que você também precisa de apoio.</p>
      <h3 style="margin-top:5mm">O que você não precisa carregar</h3>
      <div class="grid2">
        <div class="card sage" style="font-size:10.4pt"><b>Ser o terapeuta.</b> Encaminhar para o tratamento certo é o movimento certo.</div>
        <div class="card sage" style="font-size:10.4pt"><b>Absorver todas as crises.</b> Você pode ter limite de horário e de assunto.</div>
        <div class="card sage" style="font-size:10.4pt"><b>Prever cada crise.</b> Não se culpe quando uma passar pela sua guarda.</div>
        <div class="card sage" style="font-size:10.4pt"><b>Sacrificar seu bem-estar.</b> Se você está em risco, procurar ajuda para você vem primeiro.</div>
      </div>
      <div class="card" style="margin-top:5mm"><div class="big">O limite que você firma não é o fim do cuidado. É a condição dele.</div></div>''')
    pages.append(f'''
      <div class="kicker">Próximos passos</div><h2>Não falta amor. Falta método.</h2>
      <p class="lead">Se você chegou até aqui, já faz mais do que a maioria. Este guia é o mapa. Se quiser ir além, use o que fizer sentido para o seu momento.</p>
      <div class="steps" style="margin-top:6mm">
        <div class="card sky"><div><h3>Protocolo 7 Dias</h3><p>O passo a passo completo do que está aqui, em aulas, para famílias e cônjuges. No Instagram {INSTA}, envie a palavra COMEÇAR no direct. Ou acesse {CURSO}.</p></div></div>
        <div class="card sand"><div><h3>Consulta médica</h3><p>Para avaliação e condução do tratamento, com a abordagem descrita neste material. Veja valores e como agendar no guia de consulta, ou em {SITE}.</p></div></div>
        <div class="card sage"><div><h3>Conteúdo diário</h3><p>Psicoeducação sobre borderline, sem estigma, todos os dias. Instagram e TikTok: {INSTA}.</p></div></div>
      </div>
      <p class="legal" style="margin-top:10mm">Este material tem caráter exclusivamente educativo e complementar. Não substitui psicoterapia, acompanhamento médico ou intervenção profissional e não oferece diagnóstico individual. Em situação de risco imediato, ligue para o CVV 188 (gratuito, 24 horas) ou para o SAMU 192, ou procure o pronto-socorro mais próximo.<br><br>Dr. Fabio Schmidt · Médico · CRM-SP 183549 · Autor de {LIVRO} · Edição 2026.</p>''')
    return doc("Primeiros passos para quem convive com alguém com borderline", pages, cover)


# ------------------------------------------------------------------ PDF 2: pessoa com borderline
def pdf_borderline():
    cover = f'''<section class="page cover">
      <div class="tag"><span class="dot"></span>Material gratuito</div>
      <h1>Por onde começar</h1>
      <p>Para quem sente tudo com muita intensidade e quer entender o que está acontecendo e como procurar cuidado.</p>
      <div class="by"><b>Dr. Fabio Schmidt</b><br>Médico · CRM-SP 183549 · Edição 2026</div></section>'''
    pages = []
    pages.append(f'''
      <div class="kicker">Antes de tudo</div><h2>Você não está exagerando</h2>
      <p class="lead">Se você sente que as emoções chegam mais fortes e mais rápido do que para os outros, e que isso estraga relações que você quer proteger, este material é para você.</p>
      <p>Aqui você vai encontrar o que costuma acontecer por dentro, o que ajuda no meio da crise e depois dela, como é um tratamento e como pedir ajuda. Não é para ler de uma vez. Volte nele quando precisar.</p>
      <div class="card sky" style="margin:6mm 0"><div class="big">Este material não faz diagnóstico.</div><p style="margin:3mm 0 0">Só uma avaliação médica pode dizer o que você tem. Se você se reconhece no que lê aqui, o próximo passo é conversar com um profissional.</p></div>
      <div class="safety"><b>Se você está em risco agora.</b> Se está pensando em se machucar ou em tirar a própria vida, não espere passar sozinho. Ligue para o CVV 188 (gratuito, 24 horas, ligação ou chat) ou para o SAMU 192, ou vá ao pronto-socorro mais próximo. Se puder, avise alguém de confiança e peça que fique com você.</div>''')
    pages.append(f'''
      <div class="num">01</div><h2>O que costuma acontecer</h2>
      <p class="lead">Quase tudo gira em torno de uma sensibilidade aumentada ao vínculo. Uma resposta curta, uma demora, uma mudança de tom podem disparar um alarme que, por dentro, é real.</p>
      <div class="flow">
        <div class="card sky"><h3>Gatilho</h3>Um evento na relação. Rejeição, crítica ou abandono, reais ou percebidos. Às vezes é algo pequeno.</div><div class="arrow">→</div>
        <div class="card sand"><h3>Estado interno</h3>Emoção intensa, sensação de vazio, perda de chão. Tudo parece urgente.</div><div class="arrow">→</div>
        <div class="card blush"><h3>Resposta</h3>Explosão ou retraimento. Impulsividade, fuga, comportamento de risco.</div>
      </div>
      <p>Dar nome a esse ciclo é o primeiro alívio. Quando você entende o próprio padrão, deixa de se sentir louca ou louco. O ciclo tem começo, meio e fim, e um padrão que dá para reconhecer é um padrão sobre o qual dá para agir.</p>
      <div class="card" style="margin-top:6mm"><div class="big">Quem sofre não escolhe como gritar.</div><p style="margin:3mm 0 0">Mas, com ajuda, pode aprender a escolher o que faz depois do grito. Esta frase é do livro <i>{LIVRO}</i> e resume este material.</p></div>''')
    pages.append(f'''
      <div class="num">02</div><h2>No auge e depois</h2>
      <div class="card blush" style="margin-bottom:5mm"><div class="kicker">No auge</div><h3>Tem coisas que você não alcança ali</h3><p>No pico da crise, algumas funções não estão disponíveis. Não é má vontade. Não se cobre isto naquele momento:</p><ul class="clean" style="margin:0"><li>Pensar com lógica ou resolver o problema na hora.</li><li>Garantir que amanhã vai estar bem.</li><li>Explicar direito o que sente enquanto sente.</li></ul><p style="margin:3mm 0 0">Essas conversas existem, mas depois, quando você voltar.</p></div>
      <div class="card sage"><div class="kicker">Depois</div><h3>A crise acaba antes da recuperação</h3><p>Quando passa, você volta frágil e, quase sempre, envergonhado. É nesse momento que o que as pessoas fazem decide se você sobe ou se afunda de novo. Para você, o depois é a hora de:</p><ul class="clean" style="margin:0"><li>Esperar a conversa sobre o que aconteceu até os dois estarem calmos, em geral 24 a 48 horas depois.</li><li>Procurar a pessoa e reparar, com um gesto simples ou uma frase curta.</li><li>Combinar o plano da próxima vez, fora da crise: qual é o seu sinal de alerta, onde é seu espaço seguro e como você quer que a pessoa aja.</li></ul></div>
      <div class="card sky" style="margin-top:5mm"><h3>Responsabilidade e sofrimento convivem</h3><p style="margin:0">Entender o que acontece com você não autoriza ferir quem está perto, e quem foi ferido tem direito de ter limites. Você é agente do próprio tratamento, não alguém que apenas sofre. Reparar faz parte, e dá para aprender a fazer.</p></div>''')
    pages.append(f'''
      <div class="num">03</div><h2>Como é um tratamento</h2>
      <p class="lead">O borderline tem tratamento. O cuidado que descrevo aqui segue o GPM-A, um modelo desenvolvido no McLean Hospital, vinculado a Harvard, pensado para ser realista e funcionar na vida que a pessoa tem.</p>
      <div class="grid2" style="margin-top:5mm">
        <div class="card sky"><h3>O diagnóstico é aberto</h3><p style="margin:0;font-size:10.6pt">Nomear não é rótulo, é o primeiro passo do alívio. O nome não é segredo e ajuda a dissipar mitos.</p></div>
        <div class="card sky"><h3>O foco é a vida real</h3><p style="margin:0;font-size:10.6pt">O que muda fora do consultório mede o progresso: escola, trabalho e relacionamentos.</p></div>
        <div class="card sky"><h3>A família participa</h3><p style="margin:0;font-size:10.6pt">Entra como rede de apoio, com limites claros e presença, e não como espectadora.</p></div>
        <div class="card sky"><h3>A medicação é combinada</h3><p style="margin:0;font-size:10.6pt">Quando indicada, é prescrita de forma colaborativa, com alvos definidos e por tempo determinado.</p></div>
      </div>
      <div class="card sand" style="margin-top:5mm"><h3>Nomear o que se sente</h3><p style="margin:0">Parte do trabalho é entender e dar nome ao que você sente, para compreender e ressignificar a sua vivência.</p></div>
      <p class="legal" style="margin-top:6mm">Cada pessoa tem um caminho. Não há promessa de resultado: o tratamento é construído a partir da sua história e da avaliação médica.</p>''')
    pages.append(f'''
      <div class="num">04</div><h2>Falar com quem convive</h2>
      <p class="lead">Na hora da crise, faltam palavras e sobra o que você não queria dizer. Por isso vale escrever antes.</p>
      <p>Existe um guia curto, escrito na primeira pessoa, para você mandar a quem convive com você: <b>O que eu preciso que vocês entendam</b>. Ele explica sem acusar o que piora, o que acalma e o que você precisa depois da crise, e pede que a pessoa também cuide de si. Peça no direct do Instagram {INSTA}.</p>
      <div class="card" style="margin:5mm 0"><div class="kicker">Para dizer antes, em um momento calmo</div><div class="serif" style="font-size:17pt;line-height:1.3;color:#1F4E5A;font-weight:700">Eu não consigo te explicar isto na hora em que mais preciso. Por isso resolvi escrever antes.</div></div>
      <p>Você também pode combinar com a pessoa uma frase curta para o auge, para ela saber o que fazer sem precisar discutir: pausar dez minutos, voltar e retomar a conversa depois.</p>
      <div class="card sage"><h3>Eu fico</h3><p style="margin:0">Uma boa regra para os dois lados: eu fico, e é assim que eu consigo ficar. A pessoa permanece presente e, ao mesmo tempo, diz o que consegue fazer. Quem sente medo de abandono precisa dos dois juntos.</p></div>''')
    pages.append(f'''
      <div class="kicker">Próximo passo</div><h2>Pedir ajuda é o começo do cuidado</h2>
      <p class="lead">Você não precisa chegar na consulta com tudo organizado. Precisa chegar.</p>
      <div class="steps" style="margin-top:6mm">
        <div class="card sky"><div><h3>Conte o que você sente à pessoa que confia</h3><p>Uma pessoa próxima já ajuda a quebrar o isolamento.</p></div></div>
        <div class="card sand"><div><h3>Marque uma avaliação médica</h3><p>É ela que responde se é borderline e o que fazer. Veja valores e como agendar no guia de consulta, ou em {SITE}.</p></div></div>
        <div class="card sage"><div><h3>Preencha a pré-consulta</h3><p>Um questionário de cerca de 2 minutos que ajuda a tornar a consulta mais assertiva: {PRE_CONSULTA}</p></div></div>
      </div>
      <div class="safety" style="margin-top:6mm"><b>Em risco imediato:</b> CVV 188 (gratuito, 24 horas), SAMU 192 ou o pronto-socorro mais próximo. Não espere passar sozinho.</div>
      <p class="legal" style="margin-top:8mm">Este material tem caráter exclusivamente educativo. Não faz diagnóstico, não prescreve e não substitui avaliação, psicoterapia ou acompanhamento médico. Dr. Fabio Schmidt · Médico · CRM-SP 183549 · Autor de {LIVRO} · Edição 2026.</p>''')
    return doc("Por onde começar: para quem vive com borderline", pages, cover)


# ------------------------------------------------------------------ PDF 3: consulta
def pdf_consulta():
    cover = f'''<section class="page cover">
      <div class="tag"><span class="dot"></span>Consulta médica</div>
      <h1>Consulta com Dr. Fabio Schmidt</h1>
      <p>Cuidado médico dedicado ao transtorno de personalidade borderline, em adolescentes e adultos, com a família como parte do tratamento.</p>
      <div class="by"><b>Dr. Fabio Schmidt</b><br>Médico · CRM-SP 183549 · Consultório em Mogi das Cruzes, SP</div></section>'''
    pages = []
    pages.append(f'''
      <div style="display:grid;grid-template-columns:58mm 1fr;gap:8mm;align-items:start">
        <img src="foto-000.png" style="width:58mm;border-radius:10px;display:block">
        <div><div class="kicker">Quem atende</div><h2 style="font-size:22pt">Dr. Fabio Schmidt</h2>
        <p>Médico, pós-graduado em psiquiatria, com foco no transtorno de personalidade borderline. Dez anos de atuação em CAPS e consultório próprio em Mogi das Cruzes, SP. Atendimento individual e de casal. CRM-SP 183549.</p>
        <p>Autor de <i>{LIVRO}</i> e criador do Protocolo 7 Dias. Produz conteúdo educativo diário em {INSTA}.</p></div></div>
      <div class="card sky" style="margin-top:8mm"><div class="big">O transtorno de personalidade borderline tem tratamento.</div><p style="margin:3mm 0 0">Meu trabalho parte dessa convicção, com um cuidado realista e humano.</p></div>
      <h3 style="margin-top:8mm">Como eu trabalho</h3>
      <p>Adoto o GPM-A (Good Psychiatric Management for Adolescents), modelo desenvolvido no McLean Hospital, vinculado a Harvard. Na prática:</p>
      <ul class="clean"><li>O diagnóstico é comunicado de forma aberta, clara e acolhedora, dissipando mitos.</li><li>O foco está na vida real fora do consultório: escola, trabalho e relacionamentos.</li><li>A família participa ativamente do tratamento, como rede de apoio e não como espectadora.</li><li>A medicação é prescrita de forma colaborativa, com alvos definidos e por tempo determinado.</li><li>Ajudo a entender e a nomear o que se sente, para ressignificar a vivência.</li></ul>''')
    pages.append(f'''
      <div class="kicker">Consultas e pacotes</div><h2>Valores</h2>
      <div class="grid2">
        <div class="card sky"><div class="kicker">Primeira consulta</div><div class="price">R$ 700</div><p style="margin:2mm 0 0;font-size:10.6pt">Avaliação inicial completa e anamnese detalhada.</p></div>
        <div class="card sky"><div class="kicker">Consulta de retorno</div><div class="price">R$ 650</div><p style="margin:2mm 0 0;font-size:10.6pt">Acompanhamento contínuo da evolução clínica.</p></div>
        <div class="card sand"><div class="kicker">Pacote simples</div><div class="price">R$ 2.200</div><p style="margin:2mm 0 0;font-size:10.6pt">4 consultas, a R$ 550 cada. Parcelamento em até 3x no cartão.</p></div>
        <div class="card sage"><div class="kicker">Plano suporte</div><div class="price">R$ 2.900</div><p style="margin:2mm 0 0;font-size:10.6pt">4 consultas com prioridade na agenda, suporte combinado via WhatsApp e materiais de apoio e orientações exclusivas.</p></div>
      </div>
      <p class="why" style="margin-top:4mm">O agendamento é confirmado após a confirmação do pagamento via Asaas.</p>
      <div class="safety" style="margin-top:6mm"><b>Os pacotes não substituem atendimento de crise.</b> Em crise grave, procure o pronto-socorro mais próximo, ligue para o SAMU 192 ou para o CVV 188 (gratuito, 24 horas).</div>''')
    pages.append(f'''
      <div class="kicker">Como agendar</div><h2>Em quatro passos</h2>
      <div class="steps">
        <div class="card sky"><div><h3>Escolha a modalidade</h3><p>Primeira consulta, retorno ou um dos pacotes, conforme a página de valores.</p></div></div>
        <div class="card sand"><div><h3>Fale com a equipe</h3><p>Pelo site {SITE} ou por mensagem direta no Instagram {INSTA}, para combinar dia e horário.</p></div></div>
        <div class="card sage"><div><h3>Confirme o pagamento</h3><p>O horário é confirmado após o pagamento via Asaas.</p></div></div>
        <div class="card sky"><div><h3>Preencha a pré-consulta</h3><p>Um questionário de cerca de 2 minutos que ajuda a tornar a consulta mais assertiva. Anote também queixas, medicamentos em uso e dúvidas.</p></div></div>
      </div>
      <p style="margin-top:6mm"><a class="btn alt" href="{PRE_CONSULTA}">Preencher a pré-consulta</a><a class="btn" href="https://{SITE}">Agendar pelo site</a><a class="btn" href="https://instagram.com/drfabioschmidt">Mensagem no Instagram</a></p>
      <p class="legal" style="margin-top:6mm">Dúvidas sobre agenda e horários: mensagem direta em {INSTA} ou {SITE}.</p>''')
    pages.append(f'''
      <div class="kicker">Antes de vir</div><h2>O que levar e o que esperar</h2>
      <div class="grid2">
        <div class="card sky"><h3>Leve</h3><ul class="clean" style="margin:0;font-size:10.6pt"><li>Pré-consulta preenchida.</li><li>Lista dos medicamentos em uso.</li><li>Exames e relatórios anteriores, se houver.</li><li>Uma pessoa de confiança, se quiser. A família faz parte do cuidado.</li></ul></div>
        <div class="card sage"><h3>Espere</h3><ul class="clean" style="margin:0;font-size:10.6pt"><li>Uma avaliação inicial completa, com história detalhada.</li><li>Conversa clara sobre o que está acontecendo, sem rótulo vazio.</li><li>Um plano combinado, com foco na sua vida real.</li></ul></div>
      </div>
      <div class="card" style="margin:6mm 0"><div class="big">Pedir ajuda é o começo do cuidado.</div></div>
      <div class="safety"><b>Esta consulta não é atendimento de emergência.</b> Em risco imediato, ligue para o CVV 188 (gratuito, 24 horas), para o SAMU 192, ou procure o pronto-socorro mais próximo.</div>
      <p class="legal" style="margin-top:10mm">Informações de caráter educativo e de divulgação do serviço médico. Não substituem avaliação individual e não oferecem diagnóstico, prescrição ou promessa de resultado. Dr. Fabio Schmidt · Médico · CRM-SP 183549 · {SITE} · {INSTA}</p>''')
    return doc("Consulta com Dr. Fabio Schmidt", pages, cover)


if __name__ == "__main__":
    OUT.mkdir(exist_ok=True)
    render("1-guia-familias", pdf_familia())
    render("2-por-onde-comecar", pdf_borderline())
    render("3-consulta", pdf_consulta())
