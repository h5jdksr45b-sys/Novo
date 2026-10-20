// Gera versões em arquivo único dos volumes (dist/arquivo/), que funcionam sem internet:
// three.js e as fontes (subconjuntos latin e latin-ext) vão embutidos no próprio HTML.
// Uso: node tools/standalone.mjs   (rodar depois de tools/build.mjs)
import { readFileSync, writeFileSync, mkdirSync, existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0 Safari/537.36";
const three = readFileSync(join(ROOT, "vendor", "three.min.js"), "utf8");
mkdirSync(join(ROOT, "dist", "arquivo"), { recursive: true });

const fontCache = new Map();
async function inlineFonts(href) {
  if (fontCache.has(href)) return fontCache.get(href);
  const css = await (await fetch(href, { headers: { "User-Agent": UA } })).text();
  const out = [];
  for (const m of css.matchAll(/\/\* ([\w-]+) \*\/\s*(@font-face\s*{[^}]*})/g)) {
    if (m[1] !== "latin" && m[1] !== "latin-ext") continue;
    let block = m[2];
    const url = block.match(/url\((https:[^)]+)\)/)[1];
    const buf = Buffer.from(await (await fetch(url)).arrayBuffer());
    block = block.replace(url, `data:font/woff2;base64,${buf.toString("base64")}`);
    out.push(block);
  }
  const res = out.join("\n");
  fontCache.set(href, res);
  return res;
}

for (const slug of ["protocolo-da-crise", "kit-de-regulacao"]) {
  const file = join(ROOT, "dist", `${slug}.html`);
  if (!existsSync(file)) continue;
  let html = readFileSync(file, "utf8");
  const href = html.match(/<link rel="stylesheet" href="(https:\/\/fonts\.googleapis\.com[^"]+)">/)[1];
  const faces = await inlineFonts(href.replace(/&amp;/g, "&"));
  html = html
    .replace(/<link rel="preconnect"[^>]*>\n?/g, "")
    .replace(/<link rel="stylesheet" href="https:\/\/fonts\.googleapis\.com[^"]+">/, () => `<style>\n${faces}\n</style>`)
    .replace(/<script src="https:\/\/cdnjs\.cloudflare\.com\/ajax\/libs\/three\.js\/[^"]+"><\/script>/, () => `<script>${three}</script>`);
  const out = join(ROOT, "dist", "arquivo", `${slug}.html`);
  writeFileSync(out, html);
  console.log(`ok ${slug}: ${(html.length / 1024 / 1024).toFixed(2)} MB`);
}
