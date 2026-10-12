import React from 'react';
import { AbsoluteFill, interpolate, useCurrentFrame } from 'remotion';
import { linearTiming, TransitionSeries } from '@remotion/transitions';
import { slide } from '@remotion/transitions/slide';
import { C, FONT } from './theme';
import { Hook } from './scenes/Hook';
import { Brain } from './scenes/Brain';
import { Table } from './scenes/Table';
import { Caveat } from './scenes/Caveat';

const T = 20; // frames de cada transição deslizante

// Narração: [início, fim, texto] em frames absolutos (30 fps).
export const NARRACAO: [number, number, string][] = [
  [0, 84, 'A emoção dispara rápido e demora a baixar.'],
  [88, 192, 'Na neuroimagem, o alarme reage mais. Amígdala e ínsula.'],
  [196, 292, 'O freio do pré-frontal ativa menos.'],
  [296, 392, 'E a conexão entre os dois é mais fraca.'],
  [396, 492, 'Em resumo, mais alarme e menos freio.'],
  [496, 600, 'São médias de grupo. E podem mudar com tratamento.'],
];

const Legenda: React.FC = () => {
  const f = useCurrentFrame();
  const cur = NARRACAO.find(([a, b]) => f >= a && f < b);
  if (!cur) return null;
  const [a, b, txt] = cur;
  const op = interpolate(f, [a, a + 5, b - 5, b], [0, 1, 1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  return (
    <div style={{ position: 'absolute', bottom: 150, left: 0, right: 0, display: 'flex', justifyContent: 'center', opacity: op }}>
      <div style={{ fontFamily: FONT, fontSize: 38, fontWeight: 600, color: C.ink, background: 'rgba(0,0,0,0.6)', padding: '12px 26px', borderRadius: 14, maxWidth: 900, textAlign: 'center' }}>
        {txt}
      </div>
    </div>
  );
};

export const TPBCerebro: React.FC = () => {
  const f = useCurrentFrame();
  const progress = f / 600;
  return (
    <AbsoluteFill style={{ background: C.bg }}>
      <TransitionSeries>
        <TransitionSeries.Sequence durationInFrames={100}>
          <Hook />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition presentation={slide({ direction: 'from-right' })} timing={linearTiming({ durationInFrames: T })} />
        <TransitionSeries.Sequence durationInFrames={330}>
          <Brain />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition presentation={slide({ direction: 'from-right' })} timing={linearTiming({ durationInFrames: T })} />
        <TransitionSeries.Sequence durationInFrames={120}>
          <Table />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition presentation={slide({ direction: 'from-right' })} timing={linearTiming({ durationInFrames: T })} />
        <TransitionSeries.Sequence durationInFrames={110}>
          <Caveat />
        </TransitionSeries.Sequence>
      </TransitionSeries>

      <div style={{ position: 'absolute', top: 70, left: 100, right: 100, height: 6, background: C.line, borderRadius: 3 }}>
        <div style={{ width: `${progress * 100}%`, height: '100%', background: C.gold, borderRadius: 3 }} />
      </div>
      <Legenda />
      <div style={{ position: 'absolute', bottom: 60, left: 0, right: 0, textAlign: 'center', fontFamily: FONT, fontSize: 24, color: C.muted, letterSpacing: 1 }}>
        Dr. Fabio Schmidt · Borderline Sem Estigma · conteúdo educativo
      </div>
    </AbsoluteFill>
  );
};
