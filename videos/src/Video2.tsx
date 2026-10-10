import React from 'react';
import {
  AbsoluteFill,
  Audio,
  Easing,
  OffthreadVideo,
  Sequence,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
} from 'remotion';
import {Appear, Card, FONT, Grain, RED, WHITE, clamp} from './Longe';

// Vídeo 2: dia perfeito, uma piadinha, a crise apaga as memórias boas.
// Tempos em segundos do vídeo original (24 fps).
const FPS = 24;
const CUTS = [0, 4.96, 8.38, 10.83, 13.46, 16.58, 18.5, 21.54, 24.29, 25.83, 27.63, 30.71, 35.54];
const BW = [8.38, 10.83]; // plano em preto e branco: mantém sem zoom
const END = 35.54;
export const V2_FRAMES = Math.round(END * FPS);

const f = (sec: number) => Math.round(sec * FPS);
const shadow = '0 4px 24px rgba(0,0,0,0.7)';

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

// Mostra o filho a partir de um instante local (segundos dentro da Sequence), em 24 fps
const At: React.FC<{t: number; children: React.ReactNode}> = ({t, children}) => {
  const fr = useCurrentFrame();
  const o = interpolate(fr, [f(t), f(t) + 5], [0, 1], clamp);
  const y = interpolate(fr, [f(t), f(t) + 7], [16, 0], clamp);
  return <div style={{opacity: o, transform: `translateY(${y}px)`}}>{children}</div>;
};

// Janela de um quadro no tempo global
const Win: React.FC<{from: number; to: number; top?: number; children: React.ReactNode}> = ({
  from,
  to,
  top,
  children,
}) => {
  const dur = f(to) - f(from);
  return (
    <Sequence from={f(from)} durationInFrames={dur}>
      <Appear dur={dur} top={top}>
        {children}
      </Appear>
    </Sequence>
  );
};

// ---------- Quadros ----------

const Hook: React.FC = () => (
  <div style={{textAlign: 'center', fontWeight: 800, fontSize: 84, lineHeight: 1.1}}>
    <div style={{display: 'inline-block', backgroundColor: 'rgba(12,12,12,0.78)', borderRadius: 28, padding: '18px 34px'}}>
      <div style={{textShadow: shadow}}>UM DIA PERFEITO.</div>
      <At t={1.1}>
        <div style={{color: RED, textShadow: shadow}}>E UMA PIADINHA.</div>
      </At>
    </div>
  </div>
);

const Check: React.FC<{t: number}> = ({t}) => {
  const fr = useCurrentFrame();
  const sc = spring({frame: fr - f(t), fps: FPS, config: {damping: 12}});
  return (
    <div
      style={{
        width: 46,
        height: 46,
        borderRadius: 23,
        backgroundColor: '#34c759',
        transform: `scale(${sc})`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
      }}
    >
      <div
        style={{
          width: 12,
          height: 22,
          borderRight: '5px solid #0c0c0c',
          borderBottom: '5px solid #0c0c0c',
          transform: 'rotate(45deg) translate(-2px,-2px)',
        }}
      />
    </div>
  );
};

const DIA: Array<[number, string]> = [
  [0.1, 'Rindo juntos'],
  [1.6, 'Sem briga'],
  [2.6, 'Sem cobrança'],
  [4.6, 'Nada fora do plano'],
];

// Global 3.4 s
const Dia: React.FC = () => (
  <Card pad="34px 48px">
    <div style={{fontSize: 32, fontWeight: 700, opacity: 0.7, marginBottom: 18}}>O DIA DE VOCÊS</div>
    {DIA.map(([t, txt]) => (
      <At key={txt} t={t}>
        <div style={{display: 'flex', alignItems: 'center', gap: 24, fontSize: 44, fontWeight: 700, margin: '10px 0'}}>
          <Check t={t} />
          {txt}
        </div>
      </At>
    ))}
  </Card>
);

// Global 10.9 s
const Chave: React.FC = () => (
  <Card border={RED} pad="38px 48px">
    <div style={{textAlign: 'center', fontWeight: 800, lineHeight: 1.15}}>
      <div style={{fontSize: 40, opacity: 0.75}}>UMA PIADINHA</div>
      <At t={0.7}>
        <div style={{fontSize: 70, color: RED}}>VIRA A CHAVE</div>
      </At>
      <At t={3.1}>
        <div style={{fontSize: 44, marginTop: 8}}>em questão de segundos</div>
      </At>
    </div>
  </Card>
);

const MEMORIAS = ['Risadas', 'Passeios', 'Cuidado', 'Planos'];

const Memoria: React.FC<{label: string; erase: number}> = ({label, erase}) => {
  const fr = useCurrentFrame();
  const p = interpolate(fr, [f(erase), f(erase) + 8], [0, 1], {...clamp, easing: Easing.inOut(Easing.cubic)});
  return (
    <div
      style={{
        position: 'relative',
        padding: '20px 0',
        width: '47%',
        textAlign: 'center',
        borderRadius: 24,
        backgroundColor: `rgba(52,199,89,${0.85 * (1 - p)})`,
        border: `3px solid rgba(244,241,234,${0.15 + 0.25 * p})`,
        color: p > 0.5 ? 'rgba(244,241,234,0.35)' : '#0c0c0c',
        fontSize: 40,
        fontWeight: 800,
        overflow: 'hidden',
      }}
    >
      {label}
      <div
        style={{
          position: 'absolute',
          left: '8%',
          top: '50%',
          height: 5,
          width: `${84 * p}%`,
          backgroundColor: RED,
        }}
      />
    </div>
  );
};

// Global 15.0 s
const Varredura: React.FC = () => (
  <Card pad="34px 44px">
    <div style={{fontSize: 34, fontWeight: 700, opacity: 0.75, textAlign: 'center', marginBottom: 22}}>
      A MENTE VARRE O PASSADO
    </div>
    <div style={{display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', rowGap: 18}}>
      {MEMORIAS.map((m, i) => (
        <Memoria key={m} label={m} erase={2.0 + i * 0.35} />
      ))}
    </div>
    <At t={4.0}>
      <div style={{fontSize: 40, fontWeight: 800, textAlign: 'center', marginTop: 24, lineHeight: 1.2}}>
        e se convence de que <span style={{color: RED}}>o amor nunca existiu</span>
      </div>
    </At>
  </Card>
);

// Global 22.0 s
const Frase: React.FC = () => (
  <Card pad="38px 48px">
    <div style={{textAlign: 'center', fontWeight: 800, lineHeight: 1.15}}>
      <div style={{fontSize: 34, opacity: 0.7}}>QUEM OUVE</div>
      <At t={0.9}>
        <div style={{fontSize: 62, margin: '10px 0'}}>VOCÊ NUNCA SE IMPORTOU COMIGO</div>
      </At>
      <At t={3.0}>
        <div style={{fontSize: 46, color: RED}}>acha que viveu uma farsa</div>
      </At>
    </div>
  </Card>
);

// Global 26.2 s
const Bloqueio: React.FC = () => {
  const fr = useCurrentFrame();
  const bar = interpolate(fr, [f(1.8), f(1.8) + 8], [0, 1], {...clamp, easing: Easing.out(Easing.cubic)});
  return (
    <Card pad="38px 48px">
      <div style={{textAlign: 'center', fontWeight: 800, lineHeight: 1.15}}>
        <div style={{fontSize: 46}}>A DOR DA CRISE</div>
        <div style={{position: 'relative', height: 120, margin: '20px 0'}}>
          <div
            style={{
              position: 'absolute',
              inset: '0 60px',
              borderRadius: 24,
              border: '3px solid rgba(52,199,89,0.9)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 44,
              color: '#34c759',
              opacity: 1 - 0.3 * bar,
            }}
          >
            O AFETO DE VOCÊS
          </div>
          <div
            style={{
              position: 'absolute',
              left: 30,
              right: 30,
              top: 56,
              height: 8,
              borderRadius: 4,
              backgroundColor: RED,
              transform: `scaleX(${bar})`,
            }}
          />
        </div>
        <At t={1.8}>
          <div style={{fontSize: 52, color: RED}}>BLOQUEIA O ACESSO</div>
        </At>
      </div>
    </Card>
  );
};

// Global 30.85 s
const Cta: React.FC = () => (
  <Card pad="34px 44px">
    <div style={{textAlign: 'center', fontWeight: 800, lineHeight: 1.2}}>
      <div style={{fontSize: 52}}>MANDA PRA QUEM</div>
      <div style={{fontSize: 52, color: RED}}>NÃO ENTENDEU</div>
    </div>
  </Card>
);

// [segundo, efeito, volume]
const SFX: Array<[number, string, number]> = [
  [0.05, 'whoosh', 0.35],
  [1.1, 'pop', 0.4],
  [3.5, 'click', 0.35],
  [5.0, 'click', 0.35],
  [6.0, 'click', 0.35],
  [8.0, 'click', 0.35],
  [10.9, 'whoosh', 0.4],
  [11.6, 'tone', 0.18],
  [17.0, 'click', 0.25],
  [17.35, 'click', 0.25],
  [17.7, 'click', 0.25],
  [18.05, 'click', 0.25],
  [22.9, 'pop', 0.35],
  [28.0, 'whoosh', 0.3],
  [30.85, 'chime', 0.3],
];

export const Video2: React.FC = () => {
  const frame = useCurrentFrame();
  const z = zoomAt(frame);
  const footerFrom = f(32.6);
  return (
    <AbsoluteFill style={{backgroundColor: '#000', fontFamily: FONT, color: WHITE}}>
      <AbsoluteFill style={{transform: `scale(${z})`, transformOrigin: '50% 28%'}}>
        <OffthreadVideo src={staticFile('video2.mp4')} style={{width: '100%', height: '100%', objectFit: 'cover'}} />
      </AbsoluteFill>

      <Win from={0} to={3.0} top={190}>
        <Hook />
      </Win>
      <Win from={3.4} to={10.4}>
        <Dia />
      </Win>
      <Win from={10.9} to={14.9}>
        <Chave />
      </Win>
      <Win from={15.0} to={21.6}>
        <Varredura />
      </Win>
      <Win from={22.0} to={26.0}>
        <Frase />
      </Win>
      <Win from={26.2} to={30.6}>
        <Bloqueio />
      </Win>
      <Win from={30.85} to={32.5}>
        <Cta />
      </Win>
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

      {SFX.map(([t, name, vol]) => (
        <Sequence key={`${t}-${name}`} from={f(t)}>
          <Audio src={staticFile(`sfx/${name}.wav`)} volume={vol} />
        </Sequence>
      ))}
      <Grain />
    </AbsoluteFill>
  );
};
