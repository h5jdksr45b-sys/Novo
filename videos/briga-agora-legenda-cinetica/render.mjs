// node render.mjs <outdir> [frames...]  → front/f_%04d.png e back/f_%04d.png
import { createRequire } from "node:module";
import fs from "node:fs";
import path from "node:path";
const require = createRequire("/opt/node-tools/node_modules/");
const { chromium } = require("playwright");
const out = process.argv[2];
const only = process.argv.slice(3).map(Number);
const N = 916;
fs.mkdirSync(path.join(out, "front"), { recursive: true });
fs.mkdirSync(path.join(out, "back"), { recursive: true });
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1080, height: 1920 } });
await page.goto("file://" + path.resolve(path.dirname(new URL(import.meta.url).pathname), "index.html"));
await page.evaluate(() => document.fonts.ready);
const frames = only.length ? only : [...Array(N).keys()];
for (const i of frames) {
  const t = i / 30;
  const name = `f_${String(i + 1).padStart(4, "0")}.png`;
  await page.evaluate((t) => drawFront(t), t);
  await page.screenshot({ path: path.join(out, "front", name), omitBackground: true });
  await page.evaluate((t) => drawBack(t), t);
  await page.screenshot({ path: path.join(out, "back", name), omitBackground: true });
}
await browser.close();
