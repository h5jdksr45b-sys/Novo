"""Deixa o vídeo mais explicativo sem mudar o áudio (26/10, v3).

Acrescenta a legenda da narração (até três palavras por vez, destaque maior em serifa) e uma
linha de explicação por cena, que entra depois da fala correspondente. O CTA final fica só
escrito, sem narração (narr/c8.wav não entra na mixagem).

Uso: python3 scripts/explica.py index.html
"""
import sys

p = sys.argv[1]
s = open(p, encoding='utf-8').read()

# legenda: [início, fim, cena, texto], tempos absolutos; vêm das palavras da narração (narr/timings2.json)
CAP = """const CAP = [[0.35,1.71,"s1","Todo borderline tem"],[1.71,3.31,"s1","seu lado psicopata."],[3.31,3.91,"s1","Você já deve"],[3.91,5.09,"s1","ter ouvido isso."],[5.09,5.45,"s1","Entenda"],[5.45,6.35,"s1","por que não."],
[7.05,8.25,"s2","Psicopatia,"],[8.25,9.55,"s2","em palavras simples."],[9.55,10.49,"s2","A pessoa machuca"],[10.49,11.07,"s2","e não sente"],[11.07,11.81,"s2","culpa."],[11.81,12.99,"s2","Engana e usa"],[12.99,13.43,"s2","os outros"],[13.43,14.19,"s2","com frieza."],[14.19,15.51,"s2","E raramente"],[15.51,16.95,"s2","pede ajuda."],
[17.95,19.11,"s3","Quanto isso aparece"],[19.11,20.51,"s3","na população?"],[20.51,22.21,"s3","As estimativas apontam"],[22.21,23.33,"s3","de uma"],[23.33,23.77,"s3","a seis"],[23.77,24.49,"s3","em cada"],[24.49,25.85,"s3","cem pessoas."],
[26.55,28.01,"s4","Já o borderline"],[28.01,29.25,"s4","sente tudo"],[29.25,30.43,"s4","muito forte."],[30.43,31.31,"s4","Tem pavor de"],[31.31,32.41,"s4","ser deixado."],[32.41,33.11,"s4","Explode"],[33.11,34.03,"s4","e depois"],[34.03,35.09,"s4","sofre com"],[35.09,35.85,"s4","o que fez."],
[36.55,37.23,"s5","Repare no que"],[37.23,38.19,"s5","vem depois"],[38.19,39.53,"s5","de machucar alguém."],[39.53,40.31,"s5","Culpa:"],[40.31,41.59,"s5","pouca ou nenhuma"],[41.59,42.87,"s5","na psicopatia,"],[42.87,44.49,"s5","muita no borderline."],[44.49,45.11,"s5","Pedir ajuda:"],[45.11,46.31,"s5","raro num,"],[46.31,48.21,"s5","frequente no outro."],[48.21,48.69,"s5","E o jeito"],[48.69,49.77,"s5","de machucar:"],[49.77,50.91,"s5","com cálculo,"],[50.91,52.05,"s5","ou no impulso."],
[52.75,53.91,"s6","Os dois podem"],[53.91,55.11,"s6","aparecer juntos?"],[55.11,56.13,"s6","Às vezes,"],[56.13,57.03,"s6","sim."],[57.03,57.71,"s6","Uma pessoa pode"],[57.71,58.89,"s6","ter os dois."],[58.89,60.11,"s6","Mas ter borderline"],[60.11,61.31,"s6","não torna ninguém"],[61.31,62.57,"s6","psicopata."],[62.57,63.83,"s6","Quem avalia é"],[63.83,64.65,"s6","um profissional."],
[65.35,66.07,"s7","Por trás da"],[66.07,67.01,"s7","explosão,"],[67.01,68.19,"s7","quase sempre tem"],[68.19,68.97,"s7","dor."],[68.97,70.33,"s7","Dor explica."],[70.33,72.15,"s7","Não autoriza machucar."]];
const HL = new Set(['borderline', 'psicopata', 'psicopatia', 'culpa', 'frieza', 'ajuda', 'pavor', 'explode', 'dor', 'cálculo', 'impulso', 'juntos', 'profissional', 'machuca', 'machucar', 'seis', 'cem', 'deixado', 'sofre', 'explosão']);
"""

CAPJS = """  // legenda da narração
  const cap = $('cap'); let cur = null;
  for (const c of CAP) if (t >= c[0] && t < c[1]) { cur = c; break; }
  if (cur) {
    const [a, , sid, txt] = cur;
    const creamBg = sid === 's2' || sid === 's5';
    cap.style.color = creamBg ? '#151211' : '#EDE3CD';
    cap.style.textShadow = creamBg ? 'none' : '0 3px 0 rgba(0,0,0,.25)';
    const hl = (creamBg || sid === 's4') ? '#E0482F' : '#151211';
    cap.innerHTML = txt.split(' ').map(w => HL.has(w.toLowerCase().replace(/[.,?!:]/g, '')) ? `<span class="cap-h" style="color:${hl}">${w}</span>` : w).join(' ');
    cap.style.opacity = 1;
    tf('cap', `scale(${lerp(.9, 1, P(t, a, .16, E.back))})`);
  } else { cap.innerHTML = ''; cap.style.opacity = 0; }
"""

rep = [
(".btn{width:560px;height:124px;border-radius:62px;background:var(--ink);color:var(--cream);display:flex;align-items:center;justify-content:center;gap:24px;font-family:Mont;font-weight:800;font-size:46px;box-shadow:0 14px 0 rgba(0,0,0,.3)}",
 ".btn{width:560px;height:124px;border-radius:62px;background:var(--ink);color:var(--cream);display:flex;align-items:center;justify-content:center;gap:24px;font-family:Mont;font-weight:800;font-size:46px;box-shadow:0 14px 0 rgba(0,0,0,.3)}\n"
 "#cap{position:absolute;left:70px;width:940px;top:1470px;text-align:center;font-family:Mont;font-weight:800;font-size:42px;line-height:1.1;letter-spacing:-.3px;transform-origin:center}\n"
 ".cap-h{font-family:Play;font-style:italic;font-weight:900;font-size:56px}\n"
 ".expl{font-family:Mont;font-weight:600;font-size:30px;line-height:1.25;padding-left:22px;border-left:8px solid var(--red2)}"),
("</section>\n\n<!-- 3. Quanto aparece -->",
 "  <div class=\"abs expl\" id=\"exp2\" style=\"left:70px;top:1290px;width:380px;color:var(--ink);border-color:var(--red)\">O que define é a falta de culpa e de empatia. Não é a intensidade da emoção.</div>\n</section>\n\n<!-- 3. Quanto aparece -->"),
("<div class=\"abs\" id=\"s3note\" style=\"left:70px;width:940px;top:1440px;font-family:Mont;font-weight:600;font-size:28px;color:var(--cream)\">Estimativas para psicopatia e narcisismo na população geral.</div>",
 "<div class=\"abs expl\" id=\"s3note\" style=\"left:70px;width:940px;top:1360px;color:var(--cream);border-color:var(--ink)\">Estimativa para psicopatia e narcisismo. É raro: a maioria de quem explode não é psicopata.</div>"),
("</section>\n\n<!-- 5. Tabela",
 "  <div class=\"abs expl\" id=\"exp4\" style=\"left:70px;top:1330px;width:360px;color:var(--cream)\">Sente demais e reage rápido. É o oposto da frieza.</div>\n</section>\n\n<!-- 5. Tabela"),
("id=\"s5foot\" style=\"left:60px;top:1370px;", "id=\"s5foot\" style=\"left:60px;top:1140px;"),
("</section>\n\n<!-- 6. Podem aparecer juntos -->",
 "  <div class=\"abs expl\" id=\"exp5\" style=\"left:60px;top:1360px;width:940px;color:var(--ink);border-color:var(--red)\">A culpa depois é o sinal mais claro. Quem não sente nada é a exceção, não a regra.</div>\n</section>\n\n<!-- 6. Podem aparecer juntos -->"),
("</section>\n\n<!-- 7. Dor e responsabilidade -->",
 "  <div class=\"abs expl\" id=\"exp6\" style=\"left:70px;top:1370px;width:940px;color:var(--cream);border-color:var(--ink)\">Dois diagnósticos na mesma pessoa é a exceção, não a regra.</div>\n</section>\n\n<!-- 7. Dor e responsabilidade -->"),
("id=\"s7card\" style=\"left:60px;top:790px;width:720px;height:470px;padding:44px 48px\">\n    <div class=\"sans\" style=\"font-size:56px;font-weight:900;color:var(--ink)\">Por trás da explosão, quase sempre tem</div>\n    <div class=\"anton\" id=\"s7dor\" style=\"font-size:170px;",
 "id=\"s7card\" style=\"left:60px;top:790px;width:720px;height:420px;padding:40px 48px\">\n    <div class=\"sans\" style=\"font-size:50px;font-weight:900;color:var(--ink)\">Por trás da explosão, quase sempre tem</div>\n    <div class=\"anton\" id=\"s7dor\" style=\"font-size:150px;"),
("id=\"s7card2\" style=\"left:60px;top:1290px;", "id=\"s7card2\" style=\"left:60px;top:1230px;"),
("clip('s7card', 720, 470, 'tblr', 9, 22);", "clip('s7card', 720, 420, 'tblr', 9, 22);"),
("<div id=\"wipe\" class=\"paper ink\"></div>", "<div id=\"cap\" class=\"abs\"></div>\n<div id=\"wipe\" class=\"paper ink\"></div>"),
("const $ = id => document.getElementById(id);", CAP + "const $ = id => document.getElementById(id);"),
("  let wx = 2000;", CAPJS + "  let wx = 2000;"),
("checkItem('s2i1', t, 2.85); checkItem('s2i2', t, 5.1); checkItem('s2i3', t, 8.05);", "checkItem('s2i1', t, 2.85); checkItem('s2i2', t, 5.1); checkItem('s2i3', t, 8.05);\n    rise('exp2', t, 8.7, 30);"),
("checkItem('s4i1', t, 1.8); checkItem('s4i2', t, 4.2); checkItem('s4i3', t, 6.2);", "checkItem('s4i1', t, 1.8); checkItem('s4i2', t, 4.2); checkItem('s4i3', t, 6.2);\n    rise('exp4', t, 8.0, 30);"),
("rise('s5r1', t, 3.3, 30); rise('s5r2', t, 8.3, 30); rise('s5r3', t, 12.0, 30);", "rise('s5r1', t, 3.3, 30); rise('s5r2', t, 8.3, 30); rise('s5r3', t, 12.0, 30);\n    rise('exp5', t, 13.0, 30);"),
("$('s6hl').style.setProperty('--hl', P(t, 7.7, .45));", "$('s6hl').style.setProperty('--hl', P(t, 7.7, .45));\n    rise('exp6', t, 11.0, 30);"),
]
for a, b in rep:
    n = s.count(a)
    assert n == 1, f'{n}x: {a[:70]}'
    s = s.replace(a, b)
open(p, 'w', encoding='utf-8').write(s)
print('explica ok', len(rep), 'trocas')

# Ajustes feitos depois da primeira prévia (já aplicados em index.html): cavalo de xadrez
# menor e mais alto para não cobrir a legenda; destaque da legenda em vermelho também na cena 1.
