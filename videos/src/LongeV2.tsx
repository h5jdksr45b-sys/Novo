import React from 'react';
import {AbsoluteFill, Audio, Easing, OffthreadVideo, Sequence, interpolate, staticFile, useCurrentFrame} from 'remotion';
import {
  Appear,
  Card,
  Checklist,
  Combinado,
  Cta,
  Emergency,
  Grain,
  Hook,
  MapCard,
  MedoRisco,
  PauseIcon,
  Plano,
  RED,
  Sozinho,
  TwoCards,
  WHITE,
  s,
} from './Longe';

// Versão 2: abre com a cena concreta (ela desliga, caixa postal) e tira a frase de conclusão do começo.
// Trechos do vídeo original, em segundos:
//   A = 7,0 a 9,8   (ela desliga, liga de novo, caixa postal)  -> 0,0 a 2,8
//   B = 2,52 a 7,0  (outra cidade, única que sabe, e agora)    -> 2,8 a 7,28
//   C = 9,8 ao fim  (resto do vídeo)                            -> 7,28 ao fim
const A0 = 7.0;
const A1 = 9.8;
const B0 = 2.52;
const B1 = 7.0;
const C0 = 9.8;
const END = 49.68;
const LEN_A = A1 - A0;
const LEN_B = B1 - B0;
const START_B = LEN_A;
const START_C = LEN_A + LEN_B;
export const V2_DURATION = s(START_C + (END - C0));

// converte tempo do original para o tempo novo
const mB = (src: number) => src - B0 + START_B;
const mC = (src: number) => src - C0 + START_C;

const Clip: React.FC<{from: number; to: number; at: number}> = ({from, to, at}) => (
  <Sequence from={s(at)} durationInFrames={s(at + (to - from)) - s(at)}>
    <OffthreadVideo
      src={staticFile('longe.mp4')}
      trimBefore={s(from)}
      trimAfter={s(to)}
      style={{width: '100%', height: '100%', objectFit: 'cover'}}
    />
  </Sequence>
);

const CallCardV2: React.FC = () => {
  const f = useCurrentFrame();
  const t = f / 25;
  let label = 'CHAMADA ENCERRADA';
  let color = WHITE;
  if (t >= 0.9 && t < 1.95) label = 'CHAMANDO DE NOVO';
  if (t >= 1.95) {
    label = 'CAIXA POSTAL';
    color = RED;
  }
  const dots = label.startsWith('CHAMANDO') ? '.'.repeat(1 + (Math.floor(f / 6) % 3)) : '';
  return (
    <Card border={color === RED ? RED : undefined}>
      <div style={{textAlign: 'center', fontSize: 64, fontWeight: 800, color}}>
        {label}
        <span style={{display: 'inline-block', width: 60, textAlign: 'left'}}>{dots}</span>
      </div>
    </Card>
  );
};

const EAgora: React.FC = () => (
  <div
    style={{
      textAlign: 'center',
      fontSize: 120,
      fontWeight: 900,
      color: WHITE,
      textShadow: '0 6px 30px rgba(0,0,0,0.7)',
    }}
  >
    E AGORA?
  </div>
);

const Q = (a: number, b: number, el: React.ReactNode, top?: number) => (
  <Sequence from={s(a)} durationInFrames={s(b) - s(a)}>
    <Appear dur={s(b) - s(a)} top={top}>
      {el}
    </Appear>
  </Sequence>
);

const zoomAt = (f: number) => {
  if (f < s(LEN_A)) return interpolate(f, [0, s(LEN_A)], [1, 1.06], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const z0 = s(mB(6.32));
  const z1 = s(START_C);
  if (f >= z0 && f < z1) {
    return interpolate(f, [z0, z0 + 3], [1.0, 1.1], {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
      easing: Easing.out(Easing.cubic),
    });
  }
  return 1;
};

const SFX: Array<[number, string, number]> = [
  [0.3, 'tone', 0.06],
  [mB(3.0), 'pop', 0.12],
  [mB(4.2), 'pop', 0.12],
  [mC(12.0), 'click', 0.15],
  [mC(12.75), 'whoosh', 0.15],
  // trecho de risco sem som
  [mC(34.0), 'pop', 0.12],
  [mC(39.9), 'whoosh', 0.12],
  [mC(42.0), 'pop', 0.1],
  [mC(43.0), 'pop', 0.1],
  [mC(44.6), 'whoosh', 0.15],
  [mC(45.5), 'chime', 0.1],
];

export const LongeV2: React.FC = () => {
  const f = useCurrentFrame();
  const z = zoomAt(f);
  return (
    <AbsoluteFill style={{backgroundColor: '#000'}}>
      <AbsoluteFill style={{transform: `scale(${z})`, transformOrigin: '50% 28%'}}>
        <Clip from={A0} to={A1} at={0} />
        <Clip from={B0} to={B1} at={START_B} />
        <Clip from={C0} to={END} at={START_C} />
      </AbsoluteFill>

      {/* abertura: cena do telefone + contexto no topo (b-roll, sem rosto) */}
      {Q(0, LEN_A, <Hook />, 330)}
      {Q(0, LEN_A, <CallCardV2 />)}

      {Q(mB(2.52), mB(6.32), <MapCard tYou={0.45} tHer={1.65} tLine={0.65} />)}
      {Q(mB(6.32), START_C, <EAgora />)}

      {Q(mC(9.8), mC(13.9), <TwoCards />)}
      {Q(mC(14.0), mC(16.0), <MedoRisco />)}
      {Q(mC(16.0), mC(23.3), <Checklist />, 900)}
      {Q(mC(23.4), mC(27.16), <Emergency />)}
      {Q(mC(27.16), mC(29.6), <Checklist allNow />, 900)}
      {Q(mC(31.2), mC(33.68), <Sozinho />)}
      {Q(mC(33.68), mC(35.52), <PauseIcon />)}
      {Q(mC(35.52), mC(39.56), <Combinado />)}
      {Q(mC(39.56), mC(44.6), <Plano />, 940)}
      {Q(mC(44.6), mC(47.04), <MapCard tYou={0} tHer={0} tLine={0.7} solid />)}
      {Q(mC(47.04), mC(END), <Cta />)}

      <Grain />

      {SFX.map(([t, name, vol]) => (
        <Sequence key={`${name}-${t}`} from={s(t)}>
          <Audio src={staticFile(`sfx/${name}.wav`)} volume={vol} />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};
