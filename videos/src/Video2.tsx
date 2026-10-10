import React from 'react';
import {AbsoluteFill, OffthreadVideo, Sequence, staticFile, useCurrentFrame} from 'remotion';
import {Appear, Card, Grain} from './Longe';

// Passada de acabamento, sem quadros de conteúdo (falta o texto falado).
// Cortes do vídeo original, em segundos.
const FPS = 24;
const CUTS = [0, 4.96, 8.38, 10.83, 13.46, 16.58, 18.5, 21.54, 24.29, 25.83, 27.63, 30.71, 35.54];
const BW = [8.38, 10.83]; // plano em preto e branco: mantém sem zoom
export const V2_FRAMES = Math.round(35.54 * FPS);

const f = (sec: number) => Math.round(sec * FPS);

// Alterna enquadramento entre planos: normal, aproximado, normal...
const zoomAt = (frame: number) => {
  const t = frame / FPS;
  for (let i = 0; i < CUTS.length - 1; i++) {
    if (t >= CUTS[i] && t < CUTS[i + 1]) {
      if (CUTS[i] === BW[0]) return 1;
      return i % 2 === 1 ? 1.08 : 1;
    }
  }
  return 1;
};

export const Video2: React.FC = () => {
  const frame = useCurrentFrame();
  const z = zoomAt(frame);
  const footerFrom = f(35.54 - 3);
  return (
    <AbsoluteFill style={{backgroundColor: '#000'}}>
      <AbsoluteFill style={{transform: `scale(${z})`, transformOrigin: '50% 28%'}}>
        <OffthreadVideo src={staticFile('video2.mp4')} style={{width: '100%', height: '100%', objectFit: 'cover'}} />
      </AbsoluteFill>
      <Sequence from={footerFrom} durationInFrames={V2_FRAMES - footerFrom}>
        <Appear dur={V2_FRAMES - footerFrom} top={1220}>
          <Card pad="22px 30px">
            <div style={{textAlign: 'center', fontSize: 30, opacity: 0.85, lineHeight: 1.4}}>
              Conteúdo educativo. CVV 188, 24 horas.
              <br />
              Dr. Fabio Schmidt, CRM-SP 183549
            </div>
          </Card>
        </Appear>
      </Sequence>
      <Grain />
    </AbsoluteFill>
  );
};
