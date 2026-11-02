// Gera os contornos da frase manuscrita do Frame 4 a partir da fonte
// Permanent Marker (public/fonts/permanent-marker.ttf).
// Uso: node scripts/gerar-escrita-frame4.cjs
// Saída: src/Frame4/escrita.json (um item por letra, com caminho e comprimento).
const opentype = require("opentype.js");
const fs = require("fs");
const path = require("path");

const FONTE = path.join(__dirname, "../public/fonts/permanent-marker.ttf");
const SAIDA = path.join(__dirname, "../src/Frame4/escrita.json");
const LINHAS = ["NÃO SE IMPORTA", "COMIGO"];
const TAMANHO = 84;
const ENTRELINHA = 108;
const LARGURA_CAIXA = 860;

const fonte = opentype.loadSync(FONTE);

// Comprimento aproximado de um caminho: achata as curvas em segmentos.
const comprimento = (cmds) => {
  let total = 0;
  let x = 0, y = 0, sx = 0, sy = 0;
  const passos = 16;
  for (const c of cmds) {
    if (c.type === "M") { x = sx = c.x; y = sy = c.y; continue; }
    if (c.type === "L") { total += Math.hypot(c.x - x, c.y - y); x = c.x; y = c.y; continue; }
    if (c.type === "Z") { total += Math.hypot(sx - x, sy - y); x = sx; y = sy; continue; }
    let px = x, py = y;
    for (let i = 1; i <= passos; i++) {
      const t = i / passos, u = 1 - t;
      let nx, ny;
      if (c.type === "Q") {
        nx = u * u * x + 2 * u * t * c.x1 + t * t * c.x;
        ny = u * u * y + 2 * u * t * c.y1 + t * t * c.y;
      } else {
        nx = u * u * u * x + 3 * u * u * t * c.x1 + 3 * u * t * t * c.x2 + t * t * t * c.x;
        ny = u * u * u * y + 3 * u * u * t * c.y1 + 3 * u * t * t * c.y2 + t * t * t * c.y;
      }
      total += Math.hypot(nx - px, ny - py);
      px = nx; py = ny;
    }
    x = c.x; y = c.y;
  }
  return total;
};

const letras = [];
LINHAS.forEach((linha, li) => {
  const largura = fonte.getAdvanceWidth(linha, TAMANHO);
  let x = (LARGURA_CAIXA - largura) / 2;
  const y = TAMANHO + li * ENTRELINHA;
  const glifos = fonte.stringToGlyphs(linha);
  glifos.forEach((g, gi) => {
    const ch = linha[gi];
    if (ch !== " ") {
      const p = g.getPath(x, y, TAMANHO);
      letras.push({ ch, linha: li, d: p.toPathData(2), len: Math.round(comprimento(p.commands)) });
    } else {
      letras.push({ ch: " ", linha: li, d: "", len: 0 });
    }
    x += (g.advanceWidth / fonte.unitsPerEm) * TAMANHO;
  });
});

fs.writeFileSync(SAIDA, JSON.stringify({ largura: LARGURA_CAIXA, altura: TAMANHO + ENTRELINHA * (LINHAS.length - 1) + 30, letras }, null, 1));
console.log("ok", letras.length, "letras");
