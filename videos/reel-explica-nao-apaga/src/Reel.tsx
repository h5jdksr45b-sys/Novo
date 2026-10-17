import '@fontsource/anton/400.css';
import '@fontsource/inter/500.css';
import '@fontsource/inter/800.css';
import React from 'react';
import {AbsoluteFill, Img, Sequence, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {ArrowDown} from 'lucide-react';

export const DURACAO = 28 * 30;
const FUNDO = '#151311';
const PAPEL = '#EDE6D8';
const VERMELHO = '#D23A2C';
const TITULO = 'Anton, sans-serif';
const TEXTO = 'Inter, sans-serif';

const Sticker: React.FC<{nome: string; x: number; y: number; w: number; rot?: number; atraso?: number}> = ({nome, x, y, w, rot = 0, atraso = 0}) => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const s = spring({frame: f - atraso, fps, config: {damping: 11, stiffness: 160}});
  const escala = interpolate(s, [0, 1], [1.35, 1]);
  const balanco = Math.sin((f - atraso) / 18) * 1.2;
  return (
    <Img
      src={staticFile(`stickers/${nome}.png`)}
      style={{
        position: 'absolute', left: x, top: y, width: w,
        opacity: interpolate(f - atraso, [0, 4], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}),
        transform: `scale(${escala}) rotate(${rot + balanco}deg)`,
        filter: 'drop-shadow(6px 10px 0 rgba(0,0,0,0.45))',
      }}
    />
  );
};

const Entra: React.FC<{atraso?: number; children: React.ReactNode; style?: React.CSSProperties}> = ({atraso = 0, children, style}) => {
  const f = useCurrentFrame();
  const o = interpolate(f - atraso, [0, 8], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const y = interpolate(f - atraso, [0, 8], [30, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  return <div style={{opacity: o, transform: `translateY(${y}px)`, ...style}}>{children}</div>;
};

const Saida: React.FC<{dur: number; children: React.ReactNode}> = ({dur, children}) => {
  const f = useCurrentFrame();
  const o = interpolate(f, [dur - 6, dur], [1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  return <AbsoluteFill style={{opacity: o}}>{children}</AbsoluteFill>;
};

const Area: React.FC<{children: React.ReactNode; style?: React.CSSProperties}> = ({children, style}) => (
  <div style={{position: 'absolute', left: 90, right: 90, top: 220, bottom: 380, ...style}}>{children}</div>
);

const Cena1 = () => (
  <Saida dur={120}>
    <Sticker nome="rosto_rasgado" x={420} y={560} w={470} rot={-4} atraso={2} />
    <Sticker nome="exclamacao" x={880} y={1010} w={80} rot={12} atraso={50} />
    <Area>
      <Entra atraso={4} style={{fontFamily: TEXTO, fontWeight: 800, fontSize: 84, lineHeight: 1.08, color: PAPEL, maxWidth: 880}}>
        Ter borderline explica o que você fez.
      </Entra>
    </Area>
    <div style={{position: 'absolute', left: 90, top: 1210, width: 900}}>
      <Sticker nome="fita_preta" x={-10} y={-24} w={720} rot={-2} atraso={42} />
      <Entra atraso={46} style={{position: 'relative', fontFamily: TITULO, fontSize: 170, color: VERMELHO, lineHeight: 1, transform: 'rotate(-2deg)'}}>
        NÃO APAGA.
      </Entra>
    </div>
  </Saida>
);

const Seta: React.FC<{atraso: number}> = ({atraso}) => {
  const f = useCurrentFrame();
  const p = interpolate(f - atraso, [0, 10], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  return (
    <div style={{height: 110, display: 'flex', justifyContent: 'flex-start', paddingLeft: 30, overflow: 'hidden'}}>
      <div style={{clipPath: `inset(0 0 ${100 - p * 100}% 0)`}}>
        <ArrowDown size={100} color={VERMELHO} strokeWidth={2.4} />
      </div>
    </div>
  );
};

const Passo: React.FC<{atraso: number; texto: string; destaque?: boolean}> = ({atraso, texto, destaque}) => (
  <Entra atraso={atraso} style={{fontFamily: destaque ? TITULO : TEXTO, fontWeight: 800, fontSize: destaque ? 112 : 72, color: destaque ? VERMELHO : PAPEL, lineHeight: 1.05}}>
    {texto}
  </Entra>
);

const Cena2 = () => (
  <Saida dur={180}>
    <Sticker nome="olho" x={700} y={250} w={300} rot={6} atraso={6} />
    <Sticker nome="rabisco" x={130} y={1200} w={260} rot={-8} atraso={40} />
    <Sticker nome="mancha_vermelha" x={620} y={1120} w={300} rot={10} atraso={92} />
    <Area style={{top: 420}}>
      <Passo atraso={6} texto="A dor transborda." />
      <Seta atraso={30} />
      <Passo atraso={42} texto="A reação vem no impulso." />
      <Seta atraso={70} />
      <Passo atraso={84} texto="ALGUÉM SE MACHUCA." destaque />
    </Area>
  </Saida>
);

const Card: React.FC<{atraso: number; titulo: string; texto: string; cor: string; riscar?: boolean}> = ({atraso, titulo, texto, cor, riscar}) => (
  <Entra atraso={atraso} style={{background: PAPEL, padding: '40px 34px', width: 410, minHeight: 470, boxShadow: '8px 12px 0 rgba(0,0,0,0.5)'}}>
    <div style={{fontFamily: TITULO, fontSize: 92, color: cor, lineHeight: 1, textDecoration: riscar ? 'line-through' : 'none', textDecorationThickness: 12, textDecorationColor: '#1a1714'}}>{titulo}</div>
    <div style={{fontFamily: TEXTO, fontWeight: 800, fontSize: 52, color: '#1a1714', lineHeight: 1.12, marginTop: 30}}>{texto}</div>
  </Entra>
);

const Cena3 = () => (
  <Saida dur={180}>
    <Area style={{top: 300, display: 'flex', gap: 40}}>
      <div style={{transform: 'rotate(-2deg)'}}><Card atraso={4} titulo="EXPLICAR" texto="Entender por que aconteceu." cor="#1a1714" /></div>
      <div style={{transform: 'rotate(2deg)', position: 'relative'}}>
        <Card atraso={30} titulo="APAGAR" texto="Fingir que ninguém se machucou." cor={VERMELHO} riscar />
      </div>
    </Area>
    <Sticker nome="silencio" x={560} y={930} w={330} rot={5} atraso={56} />
    <Sticker nome="fita_vermelha" x={150} y={880} w={380} rot={-7} atraso={70} />
    <Sticker nome="mao_gravura" x={150} y={1010} w={200} rot={-10} atraso={20} />
  </Saida>
);

const Cena4 = () => (
  <Saida dur={180}>
    <Sticker nome="espelho" x={600} y={260} w={380} rot={6} atraso={4} />
    <Area style={{top: 840}}>
      <Entra atraso={10} style={{fontFamily: TITULO, fontSize: 150, color: PAPEL, lineHeight: 1}}>CULPA TRAVA.</Entra>
      <Entra atraso={50} style={{fontFamily: TEXTO, fontWeight: 800, fontSize: 70, color: PAPEL, lineHeight: 1.1, marginTop: 40, maxWidth: 860}}>
        Responsabilidade mostra <span style={{color: VERMELHO}}>o próximo passo.</span>
      </Entra>
    </Area>
  </Saida>
);

const Cena5 = () => (
  <AbsoluteFill>
    <Sticker nome="mao_ok" x={560} y={980} w={420} rot={-6} atraso={30} />
    <Sticker nome="x_vermelho" x={110} y={1080} w={300} rot={-8} atraso={44} />
    <Area style={{top: 420}}>
      <Entra atraso={4} style={{fontFamily: TITULO, fontSize: 150, color: PAPEL, lineHeight: 1.02}}>
        ENTENDER É O COMEÇO <span style={{color: VERMELHO}}>DO REPARO.</span>
      </Entra>
    </Area>
    <Entra atraso={60} style={{position: 'absolute', left: 90, right: 90, top: 1440, fontFamily: TEXTO, fontWeight: 500, fontSize: 30, color: '#b9b0a2', lineHeight: 1.35}}>
      Dr. Fabio Schmidt, médico, pós-graduado em psiquiatria. Conteúdo educativo.
    </Entra>
  </AbsoluteFill>
);

const Grao = () => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{pointerEvents: 'none', opacity: 0.08, backgroundImage: 'radial-gradient(rgba(255,255,255,0.9) 1px, transparent 1px)', backgroundSize: '5px 5px', backgroundPosition: `${(f * 7) % 5}px ${(f * 3) % 5}px`}} />
  );
};

export const Reel = () => (
  <AbsoluteFill style={{background: FUNDO}}>
    <Sequence durationInFrames={120}><Cena1 /></Sequence>
    <Sequence from={120} durationInFrames={180}><Cena2 /></Sequence>
    <Sequence from={300} durationInFrames={180}><Cena3 /></Sequence>
    <Sequence from={480} durationInFrames={180}><Cena4 /></Sequence>
    <Sequence from={660} durationInFrames={180}><Cena5 /></Sequence>
    <Grao />
  </AbsoluteFill>
);
