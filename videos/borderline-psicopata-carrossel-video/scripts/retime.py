"""Ajusta a linha do tempo de index.html às falas tratadas (narr/c*.wav, 26/10 v2).

Uso: python3 scripts/retime.py index.html
Cada par (antes, depois) precisa aparecer uma única vez no arquivo; se não aparecer, o script para.
"""
import sys

p = sys.argv[1]
s = open(p, encoding='utf-8').read()
rep = [
("const SC = [['s1', 0, 5.9], ['s2', 5.9, 15.2], ['s3', 15.2, 23.4], ['s4', 23.4, 31.6], ['s5', 31.6, 45.8], ['s6', 45.8, 56.6], ['s7', 56.6, 62.8], ['s8', 62.8, 67.6]];",
 "const SC = [['s1', 0, 6.7], ['s2', 6.7, 17.6], ['s3', 17.6, 26.2], ['s4', 26.2, 36.2], ['s5', 36.2, 52.4], ['s6', 52.4, 65.0], ['s7', 65.0, 72.5], ['s8', 72.5, 77.3]];"),
("const DUR = 67.6, NARR_IN = .35;", "const DUR = 77.3, NARR_IN = .35;"),
("s1: [[.1, 'click'], [.3, 'click'], [.5, 'tap'], [2.6, 'ping']],", "s1: [[.1, 'click'], [.3, 'click'], [.5, 'tap'], [3.3, 'ping']],"),
("s2: [[.3, 'tap'], [2.37, 'pop'], [4.37, 'pop'], [6.87, 'pop']],", "s2: [[.3, 'tap'], [2.85, 'pop'], [5.1, 'pop'], [8.05, 'pop']],"),
("s3: [[.5, 'swipe'], [4.6, 'tick'], [4.71, 'tick'], [4.82, 'tick'], [4.93, 'tick'], [5.04, 'tick'], [5.15, 'tick'], [5.3, 'pop']],",
 "s3: [[.5, 'swipe'], [5.1, 'tick'], [5.225, 'tick'], [5.35, 'tick'], [5.475, 'tick'], [5.6, 'tick'], [5.725, 'tick'], [5.9, 'pop']],"),
("s4: [[1.2, 'pop'], [3.45, 'pop'], [4.9, 'pop']],", "s4: [[1.8, 'pop'], [4.2, 'pop'], [6.2, 'pop']],"),
("s5: [[.5, 'swipe'], [.8, 'click'], [1.4, 'flame'], [3.0, 'tap'], [7.2, 'tap'], [10.2, 'tap']],", "s5: [[.5, 'swipe'], [.8, 'click'], [1.4, 'flame'], [3.3, 'tap'], [8.3, 'tap'], [12.0, 'tap']],"),
("s6: [[.7, 'rise'], [1.9, 'pop'], [6.05, 'swipe']],", "s6: [[.7, 'rise'], [2.6, 'pop'], [7.7, 'swipe']],"),
("s7: [[.25, 'crash'], [.9, 'tap'], [2.7, 'click'], [3.9, 'tap']],", "s7: [[.25, 'crash'], [.9, 'tap'], [3.2, 'click'], [3.95, 'tap']],"),
("const n = P(t, 2.6, .5, E.back);\n    op('s1notif', clamp((t - 2.6) / .1));", "const n = P(t, 3.3, .5, E.back);\n    op('s1notif', clamp((t - 3.3) / .1));"),
("checkItem('s2i1', t, 2.37); checkItem('s2i2', t, 4.37); checkItem('s2i3', t, 6.87);", "checkItem('s2i1', t, 2.85); checkItem('s2i2', t, 5.1); checkItem('s2i3', t, 8.05);"),
("tf('s3crowdimg', `scale(${lerp(1.06, 1.14, t / 8.2)}) translateX(${lerp(0, -30, t / 8.2)}px)`);", "tf('s3crowdimg', `scale(${lerp(1.06, 1.14, t / 8.6)}) translateX(${lerp(0, -30, t / 8.6)}px)`);"),
("const on = P(t, 4.6 + i * .11, .14);", "const on = P(t, 5.1 + i * .125, .14);"),
("const k = P(t, 4.6, .3, E.back);\n    op('s3num', clamp((t - 4.6) / .1));", "const k = P(t, 5.1, .3, E.back);\n    op('s3num', clamp((t - 5.1) / .1));"),
("$('s3num').textContent = t < 5.3 ? String(1 + Math.min(5, Math.floor(Math.max(0, t - 4.6) / .11))) : '1 a 6';", "$('s3num').textContent = t < 5.9 ? String(1 + Math.min(5, Math.floor(Math.max(0, t - 5.1) / .125))) : '1 a 6';"),
("rise('s3sub', t, 5.63, 30); rise('s3note', t, 6.3, 20);", "rise('s3sub', t, 6.17, 30); rise('s3note', t, 7.0, 20);"),
("scale(${lerp(1, 1.05, t / 8.2)})`);", "scale(${lerp(1, 1.05, t / 9.95)})`);"),
("checkItem('s4i1', t, 1.2); checkItem('s4i2', t, 3.45); checkItem('s4i3', t, 4.9);", "checkItem('s4i1', t, 1.8); checkItem('s4i2', t, 4.2); checkItem('s4i3', t, 6.2);"),
("rise('s5r1', t, 3.0, 30); rise('s5r2', t, 7.2, 30); rise('s5r3', t, 10.2, 30);", "rise('s5r1', t, 3.3, 30); rise('s5r2', t, 8.3, 30); rise('s5r3', t, 12.0, 30);"),
("$('vX').style.opacity = P(t, 1.9, .3);\n    rise('s6a1', t, 1.8, 30); rise('s6a2', t, 4.9, 30); rise('s6a3', t, 8.2, 20);\n    $('s6hl').style.setProperty('--hl', P(t, 6.05, .45));",
 "$('vX').style.opacity = P(t, 2.6, .3);\n    rise('s6a1', t, 2.7, 30); rise('s6a2', t, 6.5, 30); rise('s6a3', t, 10.15, 20);\n    $('s6hl').style.setProperty('--hl', P(t, 7.7, .45));"),
("rise('s7card', t, .9, 60);\n    slam('s7dor', t, 2.7, 1.6);\n    rise('s7card2', t, 3.9, 40);", "rise('s7card', t, .9, 60);\n    slam('s7dor', t, 3.2, 1.6);\n    rise('s7card2', t, 3.95, 40);"),
]
for a, b in rep:
    n = s.count(a)
    assert n == 1, f'{n}x: {a[:70]}'
    s = s.replace(a, b)
open(p, 'w', encoding='utf-8').write(s)
print('retime ok', len(rep), 'trocas')
