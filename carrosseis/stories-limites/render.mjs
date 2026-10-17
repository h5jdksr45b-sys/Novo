// Gera os cinco stories sobre limites em PNG 1080x1920.
// Uso: node render.mjs  (precisa do playwright global e do Chromium em /opt/pw-browsers)
import { createRequire } from "node:module";
import { writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const require = createRequire("/opt/node22/lib/node_modules/");
const { chromium } = require("playwright");
const aqui = dirname(fileURLToPath(import.meta.url));

const COR = {
  fundo: "#F5F0E8",
  texto: "#1F2A44",
  suave: "#5B6475",
  terra: "#C8553D",
  verde: "#2F7F7A",
  linha: "#E2D9CB",
};

// Ícones de traço em grade 24x24, todos com a mesma espessura.
const ICONE = {
  megafone: '<path d="m3 11 18-5v12L3 14v-3z"/><path d="M11.6 16.8a3 3 0 1 1-5.8-1.6"/>',
  elo: '<path d="M9 17H7A5 5 0 0 1 7 7"/><path d="M15 7h2a5 5 0 0 1 4 8"/><path d="M8 12h3"/><path d="m2 2 20 20"/>',
  subida: '<polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/>',
  pessoas: '<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>',
  escudo: '<path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"/>',
  bateria: '<rect x="2" y="7" width="16" height="10" rx="2"/><path d="M22 11v2"/><path d="M6 11v2"/>',
  porta: '<path d="M13 4h3a2 2 0 0 1 2 2v14"/><path d="M2 20h3"/><path d="M13 20h9"/><path d="M10 12v.01"/><path d="M13 4.56v16.16a1 1 0 0 1-1.24.97L5 20V5.56a2 2 0 0 1 1.52-1.94l4-1A2 2 0 0 1 13 4.56Z"/>',
  coracao: '<path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/>',
  mao: '<path d="M18 11V6a2 2 0 0 0-4 0v5"/><path d="M14 10V4a2 2 0 0 0-4 0v6"/><path d="M10 10.5V6a2 2 0 0 0-4 0v8"/><path d="M18 8a2 2 0 1 1 4 0v6a8 8 0 0 1-8 8h-2c-2.8 0-4.5-.86-6-2.34l-3.6-3.6a2 2 0 0 1 2.83-2.82L7 15"/>',
  relogio: '<circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/>',
  balao: '<path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>',
  tempestade: '<path d="M6 16.33A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 .5 8.97"/><path d="m13 12-3 5h4l-3 5"/>',
  sol: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/>',
  alerta: '<path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"/><path d="M12 8v4"/><path d="M12 16h.01"/>',
  enviar: '<path d="M14.54 21.69a.5.5 0 0 0 .94-.03l6.5-19a.5.5 0 0 0-.64-.63l-19 6.5a.5.5 0 0 0-.02.93l7.93 3.18a2 2 0 0 1 1.11 1.11z"/><path d="m21.85 2.15-10.94 10.94"/>',
};

const icone = (nome, cor, tam = 132) =>
  `<svg width="${tam}" height="${tam}" viewBox="0 0 24 24" fill="none" stroke="${cor}" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">${ICONE[nome]}</svg>`;

const selo = (nome, cor, tam = 240) =>
  `<div class="selo" style="width:${tam}px;height:${tam}px;background:${cor}1A">${icone(nome, cor, tam * 0.55)}</div>`;

const bolha = (texto, cor) =>
  `<div class="bolha" style="border-left:12px solid ${cor}">${texto}</div>`;

const linha = (ic, cor, titulo, sub = "") =>
  `<div class="item">${selo(ic, cor, 150)}<div><div class="chave-p">${titulo}</div>${sub ? `<p class="mini">${sub}</p>` : ""}</div></div>`;

// Cinco stories independentes. Cada um: título, no máximo três blocos.
const SLIDES = [
  {
    tag: "Limite sem abandono",
    html: `<h1>O limite tem duas partes.</h1>
      <div class="lista">
        ${linha("pessoas", COR.terra, "Eu fico.", "O vínculo continua.")}
        ${linha("escudo", COR.verde, "É assim que eu consigo ficar.", "Do que você precisa para continuar.")}
      </div>
      ${bolha("Eu fico. Mas não consigo continuar com gritos. Volto em vinte minutos.", COR.terra)}`,
  },
  {
    tag: "Limite sem abandono",
    html: `${selo("coracao", COR.terra, 300)}
      <h1>Limite não é punição.</h1>
      <p class="corpo">É o que permite a relação continuar existindo.</p>
      <div class="lista">
        ${linha("pessoas", COR.terra, "Eu fico.")}
        ${linha("escudo", COR.verde, "É assim que eu consigo ficar.")}
      </div>`,
  },
  {
    tag: "Limite sem explosão",
    html: `<h1>Troque a ameaça pela pausa.</h1>
      <div class="lista">
        ${linha("subida", COR.terra, "Ameaça", "Se continuar gritando, vou embora.")}
        ${linha("relogio", COR.verde, "Pausa com volta", "Eu continuo aqui. Preciso de vinte minutos no quarto.")}
        ${linha("sol", COR.texto, "Combine no calmo", "No meio da crise, limite novo soa como rejeição.")}
      </div>`,
  },
  {
    tag: "Como falar na crise",
    html: `<h1>Três passos.</h1>
      <div class="lista">
        ${linha("coracao", COR.terra, "1. Reafirme a presença", "Eu te amo e não vou embora.")}
        ${linha("mao", COR.texto, "2. Diga o que precisa parar", "Não consigo conversar com gritos.")}
        ${linha("relogio", COR.verde, "3. Diga quando volta", "Vou para o outro cômodo e volto em vinte minutos.")}
      </div>
      <p class="nota">Se houver agressão ou risco, sua segurança vem primeiro.</p>`,
  },
  {
    tag: "O erro comum na crise",
    html: `<h1>A frase que piora a crise.</h1>
      ${bolha("Se continuar gritando, eu vou embora.", COR.terra)}
      <div class="lista">
        ${linha("elo", COR.terra, "Põe o vínculo em jogo", "Ficar passa a depender daquele minuto.")}
        ${linha("subida", COR.terra, "O medo sobe", "E os gritos sobem junto.")}
        ${linha("relogio", COR.verde, "Troque por pausa", "Com hora certa para voltar.")}
      </div>`,
  },
];

const css = `
*{margin:0;padding:0;box-sizing:border-box}
body{background:#ccc}
.slide{width:1080px;height:1920px;background:${COR.fundo};color:${COR.texto};font-family:Inter,sans-serif;position:relative;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:64px;padding:300px 80px 300px;text-align:center;overflow:hidden}
.cabeca{position:absolute;top:200px;left:80px;right:80px;display:flex;justify-content:space-between;font-size:26px;font-weight:600;letter-spacing:3px;color:${COR.suave};text-transform:uppercase}
.cabeca b{color:${COR.terra}}
.pe{position:absolute;bottom:200px;left:80px;right:80px;display:flex;justify-content:space-between;align-items:center;font-size:26px;color:${COR.suave}}
.barra{height:6px;border-radius:3px;background:${COR.linha};width:260px;overflow:hidden}
.barra i{display:block;height:100%;background:${COR.terra}}
.selo{border-radius:50%;display:flex;align-items:center;justify-content:center;flex-shrink:0}
h1{font-family:'Inter Display',Inter,sans-serif;font-weight:800;font-size:88px;line-height:1.08;letter-spacing:-1.5px;text-wrap:balance}
h1.topo{font-size:70px}
.corpo{font-size:42px;line-height:1.35;color:${COR.suave};text-wrap:balance;max-width:860px}
.nota{font-size:30px;color:${COR.suave};font-weight:600}
.fala{font-family:'Inter Display',Inter,sans-serif;font-weight:800;font-size:92px;line-height:1.05;letter-spacing:-2px;color:${COR.texto};text-wrap:balance}
.bolha{width:100%;background:#fff;border-radius:36px;padding:48px 56px;font-size:50px;line-height:1.3;font-weight:700;text-align:left;box-shadow:0 10px 0 ${COR.linha};text-wrap:pretty}
.dupla{display:flex;gap:36px;width:100%}
.cartao{flex:1;background:#fff;border-top:12px solid;border-radius:36px;padding:56px 34px;display:flex;flex-direction:column;align-items:center;gap:22px}
.rotulo{font-size:28px;font-weight:700;letter-spacing:3px;text-transform:uppercase}
.chave{font-family:'Inter Display',Inter,sans-serif;font-weight:800;font-size:54px;line-height:1.1;text-wrap:balance}
.mini{font-size:36px;line-height:1.3;color:${COR.suave};text-wrap:balance}
.lista{display:flex;flex-direction:column;gap:34px;width:100%}
.item{display:flex;align-items:center;gap:44px;background:#fff;border-radius:36px;padding:30px 44px;text-align:left}
.chave-p{font-family:'Inter Display',Inter,sans-serif;font-weight:800;font-size:50px;line-height:1.1}
.item .mini{margin-top:10px}
.par{display:flex;gap:60px}
.assina{font-size:44px;font-weight:800}
.assina span{font-size:32px;font-weight:500;color:${COR.suave}}
`;

const total = SLIDES.length;
const corpo = SLIDES.map((s, i) => `<section class="slide" id="s${i + 1}">
    <div class="cabeca"><span><b>${s.tag}</b></span><span>Borderline Sem Estigma</span></div>
    ${s.html}
    <div class="pe"><span>Dr. Fabio Schmidt, médico, CRM-SP 183549</span><span>@drfabioschmidt</span></div>
  </section>`).join("\n");

const html = `<!doctype html><html lang="pt-BR"><head><meta charset="utf-8"><style>${css}</style></head><body>${corpo}</body></html>`;
writeFileSync(join(aqui, "slides.html"), html);

const browser = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium-1194/chrome-linux/chrome" });
const page = await browser.newPage({ viewport: { width: 1080, height: 1920 } });
await page.goto("file://" + join(aqui, "slides.html"));
await page.evaluate(() => document.fonts.ready);
for (let i = 1; i <= total; i++) {
  await page.locator(`#s${i}`).screenshot({ path: join(aqui, `story-${i}.png`) });
}
await browser.close();
console.log("ok", total);
