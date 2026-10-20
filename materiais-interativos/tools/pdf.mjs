// Gera o PDF de impressão de cada volume com o Chromium do Playwright e depois
// chama tools/finish_pdf.py para criar campos preenchíveis, rodapé e metadados.
// Uso: node tools/pdf.mjs [slug]
import { createRequire } from "node:module";
import { execFileSync } from "node:child_process";
import { existsSync, readFileSync, writeFileSync, unlinkSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const require = createRequire(import.meta.url);
let pw;
try { pw = require("playwright"); } catch { pw = require("/opt/node22/lib/node_modules/playwright"); }

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const THREE_LOCAL = join(ROOT, "vendor", "three.min.js");
const only = process.argv[2];
const VOLS = [
  { slug: "protocolo-da-crise", title: "Protocolo da Crise", run: "PROTOCOLO DA CRISE · DR. FÁBIO SCHMIDT" },
  { slug: "kit-de-regulacao", title: "Kit de Regulação", run: "KIT DE REGULAÇÃO · DR. FÁBIO SCHMIDT" },
].filter((v) => !only || v.slug === only);

const browser = await pw.chromium.launch();
for (const v of VOLS) {
  const html = join(ROOT, "dist", `${v.slug}.html`);
  if (!existsSync(html)) { console.log(`sem ${html}`); continue; }
  const page = await browser.newPage({ viewport: { width: 1100, height: 1400 } });
  await page.route("**/three.min.js", (r) => r.fulfill({ body: readFileSync(THREE_LOCAL), contentType: "application/javascript" }));
  page.on("pageerror", (e) => console.log("  erro na página:", e.message));
  await page.emulateMedia({ media: "print" });
  await page.goto(pathToFileURL(html).href + "?print", { waitUntil: "networkidle" });
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(400);
  const heads = await page.evaluate(() => [...document.querySelectorAll("h1,h2,h3,h4,h5,h6")]
    .map((h) => (h.getAttribute("data-outline") || h.innerText).replace(/\s+/g, " ").trim()));
  const headsFile = join(ROOT, "dist", `${v.slug}.heads.json`);
  writeFileSync(headsFile, JSON.stringify(heads));
  const raw = join(ROOT, "dist", `${v.slug}.raw.pdf`);
  await page.pdf({ path: raw, format: "A4", printBackground: true, preferCSSPageSize: true, outline: true, tagged: true });
  await page.close();
  const out = join(ROOT, "dist", `${v.slug}.pdf`);
  execFileSync("python3", [join(ROOT, "tools", "finish_pdf.py"), raw, out, v.title, v.run, headsFile], { stdio: "inherit" });
  unlinkSync(raw); unlinkSync(headsFile);
}
await browser.close();
