// Renderiza a legenda quadro a quadro com fundo transparente (Playwright) e sobrepõe ao vídeo.
// Uso: node scripts/render.mjs <video.mov>              -> quadros + MP4 final em renders/
//      node scripts/render.mjs <video.mov> 1.0,9.0,30.0 -> prévias JPG desses tempos
import { createRequire } from 'node:module';
const { chromium } = createRequire(import.meta.url)(process.env.PW || '/opt/node-tools/node_modules/playwright');
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const video = process.argv[2];
const only = process.argv[3];
const R = p => path.join(root, 'renders', p);
const frames = R('leg');
fs.mkdirSync(frames, { recursive: true });

const browser = await chromium.launch({ args: ['--allow-file-access-from-files'] });
const page = await browser.newPage({ viewport: { width: 1080, height: 1920 } });
page.on('pageerror', e => console.error('erro na página:', e.message));
await page.goto('file://' + path.join(root, 'index.html'));
await page.evaluate(() => window.__ready);
const DUR = await page.evaluate(() => window.DUR);
const FPS = 30;
const shot = async (t, file) => {
  await page.evaluate(t => { window.seek(t); return new Promise(r => requestAnimationFrame(() => requestAnimationFrame(r))); }, t);
  await page.screenshot({ path: file, omitBackground: true });
};
const base = '[0:v]scale=1080:1920:flags=lanczos,setsar=1[b];[b][1:v]overlay=0:0:format=auto';

if (only) {
  for (const t of only.split(',').map(Number)) {
    const png = R(`p-${t}.png`);
    await shot(t, png);
    execFileSync('ffmpeg', ['-v', 'error', '-y', '-ss', String(t), '-i', video, '-i', png, '-filter_complex', base, '-frames:v', '1', '-q:v', '3',
      R(`previa-${String(t).replace('.', '_')}.jpg`)]);
  }
  await browser.close();
  process.exit(0);
}

const total = Math.round(DUR * FPS);
for (let f = 0; f < total; f++) {
  await shot(f / FPS, path.join(frames, `f${String(f).padStart(5, '0')}.png`));
  if (f % 150 === 0) console.log('quadro', f, '/', total);
}
await browser.close();
execFileSync('ffmpeg', ['-v', 'error', '-y', '-i', video, '-framerate', String(FPS), '-i', path.join(frames, 'f%05d.png'),
  '-filter_complex', base + ':eof_action=pass,format=yuv420p[v]', '-map', '[v]', '-map', '0:a',
  '-c:v', 'libx264', '-preset', 'slow', '-crf', '17', '-c:a', 'copy', '-movflags', '+faststart',
  R('montanha-de-remedios-legendado.mp4')], { stdio: 'inherit' });
console.log('mp4 ok');
