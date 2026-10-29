// Renderiza index.html quadro a quadro com Chromium (Playwright). A base de vídeo entra como
// sequência de JPG (renders/base), então cada quadro é determinístico.
// Uso: node scripts/render.mjs            -> gera todos os quadros e monta o MP4
//      FROM=0 TO=600 node scripts/render.mjs   -> gera só esse intervalo (paralelizar)
//      node scripts/render.mjs 1.3,8.0,48.9    -> prévias JPG desses tempos
import { createRequire } from 'node:module';
const { chromium } = createRequire(import.meta.url)(process.env.PW || '/opt/node-tools/node_modules/playwright');
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const frames = path.join(root, 'renders', 'frames');
const only = process.argv[2];
const from = Number(process.env.FROM || 0), to = process.env.TO ? Number(process.env.TO) : null;
fs.mkdirSync(frames, { recursive: true });

const browser = await chromium.launch({ args: ['--allow-file-access-from-files'] });
const page = await browser.newPage({ viewport: { width: 1080, height: 1920 } });
page.on('pageerror', e => console.error('erro na página:', e.message));
await page.goto('file://' + path.join(root, 'index.html'));
await page.evaluate(() => window.__ready);
const { DUR, SFX } = await page.evaluate(() => ({ DUR: window.DUR, SFX: window.SFX }));
const FPS = 30;
const settle = async t => {
  await page.evaluate(async t => {
    window.seek(t);
    const b = document.getElementById('base');
    if (b.getAttribute('src') && !b.complete) await new Promise(r => { b.onload = r; b.onerror = r; });
    await new Promise(r => requestAnimationFrame(() => requestAnimationFrame(r)));
  }, t);
};

if (only) {
  for (const t of only.split(',').map(Number)) {
    await settle(t);
    await page.screenshot({ path: path.join(root, 'renders', `previa-${String(t).replace('.', '_')}.jpg`), type: 'jpeg', quality: 80 });
  }
  await browser.close();
  process.exit(0);
}

const total = Math.round(DUR * FPS);
const end = to ?? total;
for (let f = from; f < end; f++) {
  await settle(f / FPS);
  await page.screenshot({ path: path.join(frames, `f${String(f).padStart(5, '0')}.jpg`), type: 'jpeg', quality: 94 });
  if (f % 150 === 0) console.log('quadro', f, '/', total);
}
await browser.close();
if (process.env.TO && from < total) process.exit(0);

const R = p => path.join(root, 'renders', p);
fs.writeFileSync(R('sfx.json'), JSON.stringify(SFX));
execFileSync('python3', [path.join(root, 'scripts', 'sfx.py'), R('sfx.json'), String(DUR), R('sfx.wav')], { stdio: 'inherit' });
const mix = '[1:a]volume=0dB[v];[2:a]volume=-2dB[s];[v][s]amix=inputs=2:normalize=0:duration=first,loudnorm=I=-14:TP=-1.5:LRA=11[a]';
execFileSync('ffmpeg', ['-v', 'error', '-y', '-framerate', String(FPS), '-i', path.join(frames, 'f%05d.jpg'), '-i', R('voz.wav'), '-i', R('sfx.wav'),
  '-filter_complex', mix, '-map', '0:v', '-map', '[a]',
  '-c:v', 'libx264', '-preset', 'slow', '-crf', '17', '-pix_fmt', 'yuv420p', '-c:a', 'aac', '-b:a', '192k', '-shortest', '-movflags', '+faststart',
  R('parte2-cinco-coisas.mp4')], { stdio: 'inherit' });
console.log('mp4 ok');
