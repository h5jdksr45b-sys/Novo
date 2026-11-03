const { chromium } = require('playwright');
const path = require('path'); const fs = require('fs');
(async () => {
  const [,, html, outDir, durS, fpsS, onlyS] = process.argv;
  const fps = +fpsS, n = Math.round(+durS * fps);
  fs.mkdirSync(outDir, { recursive: true });
  const b = await chromium.launch();
  const p = await b.newPage({ viewport: { width: 1080, height: 1920 }, deviceScaleFactor: 1 });
  await p.goto('file://' + path.resolve(html));
  await p.evaluate(() => window.ready);
  const frames = onlyS ? onlyS.split(',').map(Number) : [...Array(n).keys()];
  for (const f of frames) {
    await p.evaluate(t => window.setTime(t), f / fps);
    await p.screenshot({ path: path.join(outDir, String(f).padStart(4, '0') + '.png'), clip: { x: 0, y: 0, width: 1080, height: 1920 } });
  }
  await b.close();
  console.log('frames', frames.length);
})();
