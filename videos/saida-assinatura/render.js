// node render.js light|dark  -> frames em out/<tema>/ (120 fps, depois mesclados para 30 fps com motion blur)
const { chromium } = require('playwright');
const path = require('path'), fs = require('fs');
(async () => {
  const theme = process.argv[2] || 'light';
  const fps = +(process.argv[3] || 120);
  const dir = path.join(__dirname, 'out', theme);
  fs.mkdirSync(dir, { recursive: true });
  const b = await chromium.launch();
  const p = await b.newPage({ viewport: { width: 1080, height: 1920 } });
  await p.goto('file://' + path.join(__dirname, 'index.html') + '?theme=' + theme);
  await p.waitForFunction(() => window.ready);
  const dur = await p.evaluate(() => window.DUR);
  const n = Math.round(dur * fps);
  for (let i = 0; i < n; i++) {
    await p.evaluate(t => render(t), i / fps);
    await p.screenshot({ path: path.join(dir, String(i).padStart(5, '0') + '.png') });
  }
  await b.close();
})();
