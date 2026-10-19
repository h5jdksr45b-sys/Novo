import {loadFont} from '@remotion/fonts';
import {staticFile} from 'remotion';

// Fontes embutidas em public/fonts (Archivo Black e Poppins, subset latin), sem depender de rede no render.
export const titleFont = 'Archivo Black';
export const bodyFont = 'Poppins';

loadFont({family: titleFont, url: staticFile('fonts/archivo-black-latin-400-normal.woff2'), weight: '400'});
for (const w of ['400', '500', '600']) {
  loadFont({family: bodyFont, url: staticFile(`fonts/poppins-latin-${w}-normal.woff2`), weight: w});
}

export const COLORS = {
  base: '#0D0D0D',
  red: '#CC0000',
  white: '#FFFFFF',
};

export const W = 1080;
export const H = 1920;
// 8% safe margin on every edge
export const SAFE_X = Math.round(W * 0.08);
export const SAFE_Y = Math.round(H * 0.08);
export const FADE = 10;
