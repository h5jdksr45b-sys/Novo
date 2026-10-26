// Renderiza index.html quadro a quadro com Chromium (Playwright) e monta o MP4 com ffmpeg.
import { chromium } from 'playwright';
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const frames = process.env.FRAMES_DIR || path.join(root, 'renders', 'frames');
const only = process.argv[2]; // "12.5,30" gera só esses tempos como JPG de prévia
const from = Number(process.env.FROM || 0), to = process.env.TO ? Number(process.env.TO) : null;
fs.mkdirSync(frames, { recursive: true });

const browser = await chromium.launch({ args: ['--allow-file-access-from-files'] });
const page = await browser.newPage({ viewport: { width: 1080, height: 1920 } });
await page.goto('file://' + path.join(root, 'index.html'));
await page.evaluate(() => window.__ready);
const { DUR, SFX, SC, NARR_IN } = await page.evaluate(() => ({ DUR: window.DUR, SFX: window.SFX, SC: window.SC, NARR_IN: window.NARR_IN }));
const FPS = 30;

if (only) {
  for (const t of only.split(',').map(Number)) {
    await page.evaluate(t => window.seek(t), t);
    await page.screenshot({ path: path.join(root, 'renders', `previa-${String(t).replace('.', '_')}.jpg`), type: 'jpeg', quality: 70 });
  }
  await browser.close();
  process.exit(0);
}

// FROM/TO permitem dividir os quadros entre vários processos; TO menor que o total só gera quadros
const total = Math.round(DUR * FPS);
const end = to ?? total;
for (let f = from; f < end; f++) {
  await page.evaluate(t => window.seek(t), f / FPS);
  await page.screenshot({ path: path.join(frames, `f${String(f).padStart(5, '0')}.jpg`), type: 'jpeg', quality: 95 });
  if (f % 150 === 0) console.log('quadro', f, '/', total);
}
await browser.close();
if (to && to < total) process.exit(0);

// áudio: efeitos sintetizados + narração (narr/c{n}.wav, uma por cena, se existir)
const R = p => path.join(root, 'renders', p);
fs.writeFileSync(R('sfx.json'), JSON.stringify(SFX));
execFileSync('python3', [path.join(root, 'scripts', 'sfx.py'), R('sfx.json'), String(DUR), R('sfx.wav')], { stdio: 'inherit' });
// entradas do ffmpeg: 0 = quadros, 1 = efeitos, 2.. = narração de cada cena
const audio = [R('sfx.wav')];
let pre = '', heads = '[1:a]';
SC.forEach(([, a], i) => {
  const wav = path.join(root, 'narr', `c${i + 1}.wav`);
  if (!fs.existsSync(wav)) return;
  const ms = Math.round((a + NARR_IN) * 1000);
  audio.push(wav);
  const k = audio.length; // índice da entrada no ffmpeg
  pre += `[${k}:a]adelay=${ms}|${ms},volume=-3dB[n${k}];`;
  heads += `[n${k}]`;
});
const narrado = audio.length > 1;
const mix = (narrado ? pre + heads + `amix=inputs=${audio.length}:normalize=0:duration=first,` : '[1:a]') + 'loudnorm=I=-14:TP=-1.5:LRA=11[a]';
fs.writeFileSync(R('mix.txt'), mix);
execFileSync('ffmpeg', ['-v', 'error', '-y', '-framerate', String(FPS), '-i', path.join(frames, 'f%05d.jpg'), ...audio.flatMap(f => ['-i', f]),
  '-filter_complex', mix, '-map', '0:v', '-map', '[a]',
  '-c:v', 'libx264', '-preset', 'slow', '-crf', '16', '-pix_fmt', 'yuv420p', '-c:a', 'aac', '-b:a', '192k', '-shortest', '-movflags', '+faststart',
  R(narrado ? 'borderline-nao-e-psicopata-narrado.mp4' : 'borderline-nao-e-psicopata.mp4')], { stdio: 'inherit' });
console.log('mp4 ok', narrado ? 'com narração' : 'sem narração');
