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
    <Sticker nome="lua" x={790} y={222} w={190} rot={0} atraso={30} />
    <Sticker nome="mulher_cabeca" x={420} y={1010} w={470} rot={-3} atraso={20} />
    <Area style={{top: 430}}>
      <Entra atraso={4} style={{fontFamily: TITULO, fontSize: 132, lineHeight: 1.02, color: PAPEL, maxWidth: 900}}>
        NENHUM LUGAR ME DÁ A <span style={{color: VERMELHO}}>SENSAÇÃO DE CASA.</span>
      </Entra>
    </Area>
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
    <Sticker nome="selo_franca" x={130} y={980} w={180} rot={8} atraso={96} />
    <Sticker nome="selo_italia" x={330} y={1040} w={160} rot={-6} atraso={104} />
    <Sticker nome="carimbo_paris" x={760} y={300} w={180} rot={-12} atraso={10} />
    <Sticker nome="tenis" x={560} y={1120} w={380} rot={-4} atraso={112} />
    <Area style={{top: 300}}>
      <Passo atraso={6} texto="Cidade nova." />
      <Passo atraso={22} texto="Emprego novo." />
      <Passo atraso={38} texto="Gente nova." />
      <Seta atraso={62} />
      <Passo atraso={78} texto="O DESCONFORTO VAI JUNTO." destaque />
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
      <div style={{transform: 'rotate(-2deg)'}}><Card atraso={4} titulo="PARECE" texto="O lugar está errado." cor="#1a1714" /></div>
      <div style={{transform: 'rotate(2deg)'}}><Card atraso={34} titulo="PODE SER" texto="Você não se reconhece em lugar nenhum." cor={VERMELHO} /></div>
    </Area>
    <Sticker nome="espelho" x={580} y={930} w={320} rot={6} atraso={60} />
    <Sticker nome="olho_azul" x={130} y={1020} w={340} rot={-8} atraso={20} />
  </Saida>
);

const Cena4 = () => (
  <Saida dur={180}>
    <Sticker nome="mulher_pulo" x={600} y={250} w={340} rot={-6} atraso={4} />
    <Area style={{top: 760}}>
      <div style={{position: 'relative'}}>
        <Entra atraso={12} style={{position: 'relative', fontFamily: TITULO, fontSize: 104, color: VERMELHO, lineHeight: 1.02, padding: '6px 10px'}}>PERTURBAÇÃO DA IDENTIDADE</Entra>
      </div>
      <Entra atraso={50} style={{fontFamily: TEXTO, fontWeight: 800, fontSize: 66, color: PAPEL, lineHeight: 1.12, marginTop: 60, maxWidth: 880}}>
        Não se reconhecer de um lugar para outro.
      </Entra>
    </Area>
    <Entra atraso={80} style={{position: 'absolute', left: 90, right: 90, top: 1460, fontFamily: TEXTO, fontWeight: 500, fontSize: 28, color: '#b9b0a2', lineHeight: 1.35}}>
      Um dos critérios do TPB no DSM-5-TR. Sozinho, não fecha diagnóstico.
    </Entra>
  </Saida>
);

const Cena5 = () => (
  <AbsoluteFill>
    <Sticker nome="selo_50" x={150} y={1050} w={200} rot={-8} atraso={40} />
    <Sticker nome="lua" x={620} y={1030} w={300} rot={0} atraso={26} />
    <Area style={{top: 420}}>
      <Entra atraso={4} style={{fontFamily: TITULO, fontSize: 140, color: PAPEL, lineHeight: 1.02}}>
        CASA TAMBÉM É <span style={{color: VERMELHO}}>SE RECONHECER.</span>
      </Entra>
      <Entra atraso={36} style={{fontFamily: TEXTO, fontWeight: 800, fontSize: 60, color: PAPEL, lineHeight: 1.12, marginTop: 40, maxWidth: 860}}>
        Isso se trata. Não se resolve de mudança.
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
