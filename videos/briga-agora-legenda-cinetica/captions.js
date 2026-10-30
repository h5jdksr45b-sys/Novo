// Legendas cinéticas. Movimentos refeitos a partir do pacote Títulos Virais (DaVinci):
// por letra, deslocamento em 20 quadros e opacidade em 5 quadros, com atraso de 1 quadro por letra.
const FPS = 30;
const W = 1080, H = 1920;
const RED = "#E8392B";

// tomadas (cortes da gravação) e o movimento de cada uma
const SHOTS = [
  { t: 0.0,   move: "aparecer", y: 1120 },
  { t: 3.07,  move: "sobe",     y: 1150 },
  { t: 4.67,  move: "sobe",     y: 1150 },
  { t: 8.13,  move: "tremendo", y: 1360 },
  { t: 12.27, move: "direita",  y: 1110 },
  { t: 14.57, move: "esquerda", y: 1110 },
  { t: 18.03, move: "desce",    y: 1130 },
  { t: 20.73, move: "sobe",     y: 1130 },
  { t: 22.83, move: "wordbyword", y: 1130 },
  { t: 25.57, move: "sobe",     y: 1130 },
];

// w = [texto, início]; fx: red | errado | marcador | calor | treme
const GROUPS = [
  { w: [["Cansa", 3.08], ["de", 3.28], ["ouvir", 3.40]] },
  { w: [["que", 3.54], ["é", 3.64], ["teimosia?", 3.70, "errado"]], strikeAt: 3.86, end: 4.30 },
  { w: [["Enquanto", 4.30], ["não", 4.36], ["sabe", 4.54]] },
  { w: [["se", 4.84], ["a", 4.96], ["briga", 5.06]] },
  { w: [["passou,", 5.24]] },
  { w: [["o", 5.86], ["medo", 5.90, "red"]] },
  { w: [["de", 6.14], ["perder", 6.34], ["você", 6.52]] },
  { w: [["continua", 6.86], ["ligado,", 7.50]] },
  { w: [["captando", 8.04], ["tudo.", 8.48]] },
  { w: [["Resolver", 9.06], ["logo", 9.38]] },
  { w: [["é", 9.64], ["o", 9.80], ["jeito", 9.80]] },
  { w: [["mais", 9.94], ["rápido", 10.28]] },
  { w: [["de", 10.60], ["desligar", 10.88]] },
  { w: [["esse", 11.28], ["radar.", 11.40, "treme"]] },
  { w: [["Só", 11.84], ["que", 12.04], ["você", 12.18]], move: "direita" },
  { w: [["precisa", 12.40], ["de", 12.80]] },
  { w: [["um", 12.98], ["tempo", 13.08, "red"]] },
  { w: [["para", 13.56], ["isso", 13.88], ["baixar.", 14.06]] },
  { w: [["E", 14.60], ["forçar", 14.64]] },
  { w: [["a", 14.98], ["conversa", 15.06]] },
  { w: [["na", 15.50], ["hora", 15.60], ["errada", 15.78]] },
  { w: [["vira", 16.12], ["uma", 16.58]] },
  { w: [["segunda", 16.70, "calor"], ["briga.", 17.10, "calor"]], end: 17.72 },
  { w: [["A", 17.72], ["saída", 17.82], ["é", 18.14]], move: "desce" },
  { w: [["tirar", 18.26], ["dúvida", 18.50], ["logo,", 18.86]] },
  { w: [["antes", 19.40], ["de", 19.64], ["vocês", 19.74]] },
  { w: [["se", 19.92], ["afastarem.", 20.08]], end: 20.74 },
  { w: [["Uma", 20.74], ["frase", 20.84], ["basta:", 21.14]], end: 21.70 },
  // 21,74 a 22,85: título grande atrás da cabeça (camada de trás)
  { w: [["Eu", 22.88], ["continuo", 22.96], ["aqui,", 23.38]] },
  { w: [["mas", 23.94], ["o", 24.10], ["resto", 24.22]] },
  { w: [["a", 24.36], ["gente", 24.46], ["conversa", 24.56]] },
  { w: [["depois.", 25.04]] },
  { w: [["Assim,", 25.34]], move: "sobe" },
  { w: [["a", 26.14], ["briga", 26.20], ["espera,", 26.42]] },
  { w: [["o", 27.24], ["medo", 27.30, "red"], ["baixa", 27.64]] },
  { w: [["e", 28.36], ["a", 28.64], ["conversa", 28.72]] },
  { w: [["de", 29.24], ["depois", 29.34]] },
  { w: [["funciona.", 29.72, "marcador"]], end: 30.50 },
];
// fim de cada grupo = início do próximo, salvo indicado
GROUPS.forEach((g, i) => {
  if (g.end == null) g.end = i + 1 < GROUPS.length ? GROUPS[i + 1].w[0][1] : 30.5;
  g.start = Math.min(...g.w.map((w) => w[1]));
});

const HOOK = { start: -1.0, end: 3.0, lines: ["POR QUE O BORDERLINE", "EXIGE RESOLVER", "A BRIGA AGORA?"] };
const HERO = { start: 21.74, end: 22.83, lines: ["A GENTE", "NÃO TERMINOU."], underlineAt: 22.28 };

const clamp = (x, a = 0, b = 1) => Math.max(a, Math.min(b, x));
const outCubic = (x) => 1 - Math.pow(1 - clamp(x), 3);
const outBack = (x) => { x = clamp(x); const c = 1.4; return 1 + (c + 1) * Math.pow(x - 1, 3) + c * Math.pow(x - 1, 2); };
const shotAt = (t) => { let s = SHOTS[0]; for (const x of SHOTS) if (t >= x.t - 1e-6) s = x; return s; };

// movimento por letra; k = índice da letra, f = quadros desde o início da palavra
function charStyle(move, f, k, seed) {
  const fl = f - k * 1.0;
  const op = clamp(fl / 5);
  const p = outCubic(fl / 20);
  const q = 1 - p;
  let tx = 0, ty = 0, sc = 1, rot = 0, blur = 0;
  switch (move) {
    case "sobe": ty = 46 * q; blur = 6 * q; break;
    case "desce": ty = -46 * q; blur = 6 * q; break;
    case "direita": tx = -60 * q; blur = 6 * q; break;
    case "esquerda": tx = 60 * q; blur = 6 * q; break;
    case "aparecer": sc = 0.33 + 0.67 * outBack(fl / 10); blur = 4 * (1 - clamp(fl / 10)); break;
    case "tremendo": {
      const a = 7 * (1 - clamp(fl / 14));
      tx = a * Math.sin(fl * 2.1 + seed * 1.7); ty = a * Math.cos(fl * 2.7 + seed);
      rot = a * 0.5 * Math.sin(fl * 1.3 + seed); blur = 3 * (1 - clamp(fl / 10)); break;
    }
    case "wordbyword": { const r = clamp(fl / 6); return { op: r, tf: `translateY(${10 * (1 - r)}px)`, blur: 0 }; }
  }
  return { op, tf: `translate(${tx.toFixed(2)}px,${ty.toFixed(2)}px) scale(${sc.toFixed(3)}) rotate(${rot.toFixed(2)}deg)`, blur };
}

function spanChars(text, move, f0, seed, extra = "") {
  return [...text].map((ch, k) => {
    const s = charStyle(move, f0, k, seed + k);
    const b = s.blur > 0.05 ? `filter:blur(${s.blur.toFixed(2)}px);` : "";
    return `<span class="ch" style="opacity:${s.op.toFixed(3)};transform:${s.tf};${b}${extra}">${ch === " " ? "&nbsp;" : ch}</span>`;
  }).join("");
}

function railHTML(t) {
  const g = GROUPS.find((g) => t >= g.start && t < g.end);
  if (!g) return "";
  const shot = shotAt(g.start);
  const move = g.move || shot.move;
  const y = shotAt(t).y;
  const exitF = (g.end - t) * FPS;
  const exitOp = clamp(exitF / 3);
  const small = move === "wordbyword";
  let html = "";
  g.w.forEach(([txt, ws, fx], i) => {
    const f = (t - ws) * FPS;
    if (f < 0) { html += `<span class="w ghost${fx ? " fx" : ""}">${txt}</span>`; return; }
    let cls = "w", extra = "", inner;
    let wordMove = move;
    if (fx === "treme") wordMove = "tremendo";
    if (fx) cls += " fx";
    if (fx === "red" || fx === "treme") cls += " red";
    if (fx === "calor") cls += " calor";
    inner = spanChars(txt, wordMove, f, i * 3.1, extra);
    if (fx === "treme") {
      // tremor contínuo leve enquanto a palavra fica na tela
      const a = 2.2;
      inner = `<span style="display:inline-block;transform:translate(${(a * Math.sin(f * 1.9)).toFixed(2)}px,${(a * Math.cos(f * 2.3)).toFixed(2)}px)">${inner}</span>`;
    }
    if (fx === "errado") {
      const w = outCubic((t - g.strikeAt) * FPS / 9) * 100;
      inner += `<span class="strike" style="width:${w.toFixed(1)}%"></span>`;
      cls += " red";
    }
    if (fx === "marcador") {
      const w = outCubic(f / 10) * 100;
      inner = `<span class="mark" style="width:${w.toFixed(1)}%"></span>` + inner;
      cls += " marcador";
    }
    html += `<span class="${cls}">${inner}</span>`;
  });
  return `<div class="rail${small ? " small" : ""}" style="top:${y}px;opacity:${exitOp.toFixed(3)}">${html}</div>`;
}

function hookHTML(t) {
  if (t >= HOOK.end) return "";
  const f = (t - HOOK.start) * FPS;
  const exitOp = clamp((HOOK.end - t) * FPS / 3);
  const lines = HOOK.lines.map((ln, i) => {
    let inner;
    if (i === 2) {
      const [a, b] = ["A BRIGA ", "AGORA?"];
      const mw = outCubic((t - 0.25) * FPS / 10) * 100;
      inner = spanChars(a, "aparecer", f, i * 5) +
        `<span class="w marcador hookmark"><span class="mark" style="width:${mw.toFixed(1)}%"></span>${spanChars(b, "aparecer", f - a.length, 9)}</span>`;
    } else inner = spanChars(ln, "aparecer", f, i * 5);
    return `<div class="hl">${inner}</div>`;
  }).join("");
  return `<div class="hook" style="opacity:${exitOp.toFixed(3)}">${lines}</div>`;
}

function heroHTML(t) {
  if (t < HERO.start || t >= HERO.end) return "";
  const f = (t - HERO.start) * FPS;
  const exitOp = clamp((HERO.end - t) * FPS / 3);
  const breathe = 1 + 0.015 * clamp(f / 25);
  const ul = outCubic((t - HERO.underlineAt) * FPS / 10) * 100;
  const lines = HERO.lines.map((ln, i) => {
    const inner = spanChars(ln, "sobe", f - i * 4, i * 7);
    const u = i === 1 ? `<span class="uline" style="width:${ul.toFixed(1)}%"></span>` : "";
    return `<div class="hero-l l${i}">${inner}${u}</div>`;
  }).join("");
  return `<div class="hero" style="opacity:${exitOp.toFixed(3)};transform:translateX(-50%) scale(${breathe.toFixed(4)})">${lines}</div>`;
}

window.CAP = { FPS, W, H, railHTML, hookHTML, heroHTML, HERO };

// Esquemas visuais (lado esquerdo, fora da área dos botões)
function pop(f) { return { op: clamp(f / 5), sc: 0.6 + 0.4 * outBack(f / 12) }; }
function radarSVG(t, t0, off) {
  const f = (t - t0) * FPS;
  const ang = (t * 240) % 360;
  const dead = off == null ? 0 : clamp((t - off) * FPS / 12);
  const col = dead > 0.5 ? "#9a9a9a" : "#E8392B";
  const blip = (ph) => 0.4 + 0.6 * Math.abs(Math.sin(t * 5 + ph));
  return `<svg width="260" height="260" viewBox="-130 -130 260 260">
    <circle r="118" fill="rgba(10,10,12,.62)" stroke="${col}" stroke-width="5"/>
    <circle r="78" fill="none" stroke="${col}" stroke-opacity=".55" stroke-width="3"/>
    <circle r="38" fill="none" stroke="${col}" stroke-opacity=".55" stroke-width="3"/>
    <g transform="rotate(${ang.toFixed(1)})" opacity="${(1 - dead).toFixed(2)}">
      <path d="M0 0 L118 0 A118 118 0 0 0 ${(118 * Math.cos(-0.7)).toFixed(1)} ${(118 * Math.sin(-0.7)).toFixed(1)} Z" fill="${col}" fill-opacity=".35"/>
      <line x1="0" y1="0" x2="118" y2="0" stroke="${col}" stroke-width="5"/></g>
    <circle cx="-48" cy="-40" r="10" fill="#fff" opacity="${((1 - dead) * blip(0)).toFixed(2)}"/>
    <circle cx="36" cy="58" r="8" fill="#fff" opacity="${((1 - dead) * blip(2)).toFixed(2)}"/>
    <circle r="7" fill="${col}"/></svg>`;
}
function schemaHTML(t) {
  let h = "";
  // radar ligado: continua ligado, captando tudo
  if (t >= 6.80 && t < 8.13) {
    const p = pop((t - 6.80) * FPS), ex = clamp((8.13 - t) * FPS / 3);
    h += `<div class="sch" style="left:16px;top:150px;opacity:${(p.op * ex).toFixed(3)};transform:scale(${p.sc.toFixed(3)})">${radarSVG(t, 6.8)}<div class="tag">MEDO LIGADO</div></div>`;
  }
  // radar desligando: de desligar esse radar
  if (t >= 10.60 && t < 11.84) {
    const p = pop((t - 10.60) * FPS), ex = clamp((11.84 - t) * FPS / 4);
    const off = t >= 11.40;
    h += `<div class="sch" style="left:16px;top:1000px;opacity:${(p.op * ex).toFixed(3)};transform:scale(${p.sc.toFixed(3)})">${radarSVG(t, 10.6, 11.40)}<div class="tag${off ? " grey" : ""}">${off ? "DESLIGADO" : "LIGADO"}</div></div>`;
  }
  // contador de brigas
  if (t >= 14.60 && t < 17.72) {
    const p = pop((t - 14.60) * FPS), ex = clamp((17.72 - t) * FPS / 3);
    const two = t >= 16.70, f2 = (t - 16.70) * FPS;
    const sh = two ? 9 * (1 - clamp(f2 / 10)) * Math.sin(f2 * 2.4) : 0;
    h += `<div class="sch pill${two ? " hot" : ""}" style="left:40px;top:300px;opacity:${(p.op * ex).toFixed(3)};transform:translateX(${sh.toFixed(1)}px) scale(${p.sc.toFixed(3)})">${two ? "BRIGA Nº 2" : "BRIGA Nº 1"}</div>`;
  }
  // medidor do medo baixando
  if (t >= 26.10 && t < 30.50) {
    const p = pop((t - 26.10) * FPS), ex = clamp((30.5 - t) * FPS / 3);
    const lvl = 1 - 0.78 * outCubic((t - 27.30) * FPS / 22);
    const col = lvl > 0.5 ? "#E8392B" : "#F2A541";
    h += `<div class="sch meter" style="left:56px;top:600px;opacity:${(p.op * ex).toFixed(3)};transform:scale(${p.sc.toFixed(3)})">
      <div class="bar"><div class="fill" style="height:${(lvl * 100).toFixed(1)}%;background:${col}"></div></div><div class="tag">MEDO</div></div>`;
  }
  return h;
}
window.CAP.schemaHTML = schemaHTML;
