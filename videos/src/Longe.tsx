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
  useVideoConfig,
} from 'remotion';

// Paleta e tipografia da marca
const RED = '#ff3b30';
const WHITE = '#f4f1ea';
const CARD = 'rgba(12,12,12,0.86)';
const FONT = 'Inter, Helvetica, Arial, sans-serif';

const FPS = 25;
const s = (sec: number) => Math.round(sec * FPS);

// Faixa dos quadros: entre o peito e a legenda do CapCut (que fica perto de 78% da altura)
const ZONE_TOP = 980;

const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;

// Entrada e saída suaves para qualquer quadro
const Appear: React.FC<{dur: number; children: React.ReactNode; top?: number}> = ({
  dur,
  children,
  top = ZONE_TOP,
}) => {
  const f = useCurrentFrame();
  const opacity = Math.min(
    interpolate(f, [0, 6], [0, 1], clamp),
    interpolate(f, [dur - 6, dur], [1, 0], clamp),
  );
  const y = interpolate(f, [0, 8], [30, 0], {...clamp, easing: Easing.out(Easing.cubic)});
  return (
    <div
      style={{
        position: 'absolute',
        top,
        left: 100,
        right: 100,
        opacity,
        transform: `translateY(${y}px)`,
        fontFamily: FONT,
        color: WHITE,
      }}
    >
      {children}
    </div>
  );
};

const Card: React.FC<{children: React.ReactNode; border?: string; pad?: string}> = ({
  children,
  border = 'rgba(244,241,234,0.35)',
  pad = '44px 52px',
}) => (
  <div
    style={{
      backgroundColor: CARD,
      border: `3px solid ${border}`,
      borderRadius: 40,
      padding: pad,
    }}
  >
    {children}
  </div>
);

// Mostra o filho a partir de um instante local (em segundos dentro da Sequence)
const At: React.FC<{t: number; children: React.ReactNode}> = ({t, children}) => {
  const f = useCurrentFrame();
  const o = interpolate(f, [s(t), s(t) + 5], [0, 1], clamp);
  const y = interpolate(f, [s(t), s(t) + 7], [16, 0], clamp);
  return <div style={{opacity: o, transform: `translateY(${y}px)`}}>{children}</div>;
};

// ---------- Quadros ----------

const Hook: React.FC = () => (
  <div style={{textAlign: 'center', fontWeight: 800, fontSize: 84, lineHeight: 1.1}}>
    <div style={{textShadow: '0 4px 24px rgba(0,0,0,0.6)'}}>ELA ESTÁ EM CRISE.</div>
    <At t={0.6}>
      <div style={{color: RED, textShadow: '0 4px 24px rgba(0,0,0,0.6)'}}>VOCÊ ESTÁ LONGE.</div>
    </At>
  </div>
);

const Pin: React.FC<{x: number; t: number; label: string; color: string; pulse?: boolean}> = ({
  x,
  t,
  label,
  color,
  pulse,
}) => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const sc = spring({frame: f - s(t), fps, config: {damping: 12}});
  const ring = pulse ? 30 + 18 * ((f % 25) / 25) : 0;
  const ringO = pulse ? 1 - (f % 25) / 25 : 0;
  return (
    <div style={{position: 'absolute', left: x - 60, top: 40, width: 120, textAlign: 'center'}}>
      <div style={{position: 'relative', height: 120}}>
        {pulse && f >= s(t) ? (
          <div
            style={{
              position: 'absolute',
              left: 60 - ring,
              top: 60 - ring,
              width: ring * 2,
              height: ring * 2,
              borderRadius: ring,
              border: `4px solid ${color}`,
              opacity: ringO,
            }}
          />
        ) : null}
        <div
          style={{
            position: 'absolute',
            left: 36,
            top: 36,
            width: 48,
            height: 48,
            borderRadius: 24,
            backgroundColor: color,
            transform: `scale(${sc})`,
          }}
        />
      </div>
      <div style={{fontSize: 40, fontWeight: 800, color, opacity: sc}}>{label}</div>
    </div>
  );
};

// Mapa: dois pontos ligados por linha. Modo tracejado (distância) ou contínuo (ligação)
const MapCard: React.FC<{tYou: number; tHer: number; tLine: number; solid?: boolean}> = ({
  tYou,
  tHer,
  tLine,
  solid,
}) => {
  const f = useCurrentFrame();
  const p = interpolate(f, [s(tLine), s(tLine) + 22], [0, 1], {...clamp, easing: Easing.inOut(Easing.cubic)});
  const x0 = 210;
  const x1 = 650;
  const dashes = 14;
  return (
    <Card>
      <div style={{position: 'relative', height: 220}}>
        {/* tracejado */}
        {Array.from({length: dashes}).map((_, i) => {
          const pos = x0 + ((x1 - x0) / dashes) * i;
          const visible = solid ? 1 : (i + 1) / dashes <= p ? 1 : 0;
          return (
            <div
              key={i}
              style={{
                position: 'absolute',
                left: pos,
                top: 98,
                width: (x1 - x0) / dashes / 2,
                height: 6,
                borderRadius: 3,
                backgroundColor: WHITE,
                opacity: visible * 0.75,
              }}
            />
          );
        })}
        {/* linha contínua por cima, só no modo ligação */}
        {solid ? (
          <div
            style={{
              position: 'absolute',
              left: x0,
              top: 96,
              width: (x1 - x0) * p,
              height: 10,
              borderRadius: 5,
              backgroundColor: RED,
            }}
          />
        ) : null}
        <Pin x={130} t={tYou} label="VOCÊ" color={WHITE} />
        <Pin x={730} t={tHer} label="ELA" color={RED} pulse={!solid} />
      </div>
    </Card>
  );
};

const CallCard: React.FC = () => {
  const f = useCurrentFrame();
  const t = f / FPS; // local, começa em 7,0 s
  let label = 'CHAMANDO';
  let color = WHITE;
  if (t >= 1.0 && t < 1.6) label = 'CHAMADA ENCERRADA';
  if (t >= 1.6 && t < 2.1) label = 'CHAMANDO DE NOVO';
  if (t >= 2.1) {
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

const TwoCards: React.FC = () => {
  const f = useCurrentFrame();
  const both = f >= s(2.2); // 12,0 s global
  const box = (title: string, lines: React.ReactNode, accent: string) => (
    <div
      style={{
        flex: 1,
        backgroundColor: CARD,
        border: `3px solid ${both ? RED : 'rgba(244,241,234,0.35)'}`,
        borderRadius: 36,
        padding: '36px 32px',
        minHeight: 230,
      }}
    >
      <div style={{fontSize: 46, fontWeight: 800, color: accent, marginBottom: 14}}>{title}</div>
      <div style={{fontSize: 40, lineHeight: 1.3}}>{lines}</div>
    </div>
  );
  return (
    <div>
      <div style={{display: 'flex', gap: 28}}>
        {box('ELA', <div>em crise</div>, RED)}
        {box(
          'VOCÊ',
          <>
            <At t={0.2}>quer ajudar</At>
            <At t={1.2}>e está com medo</At>
          </>,
          WHITE,
        )}
      </div>
      <At t={2.2}>
        <div style={{display: 'flex', justifyContent: 'center', marginTop: 22}}>
          <div
            style={{
              backgroundColor: CARD,
              borderRadius: 999,
              padding: '14px 34px',
              fontSize: 42,
              fontWeight: 800,
              color: RED,
            }}
          >
            OS DOIS PRECISAM DE CUIDADO
          </div>
        </div>
      </At>
    </div>
  );
};

const MedoRisco: React.FC = () => {
  const f = useCurrentFrame();
  const h = interpolate(f, [s(0.35), s(0.35) + 10], [0, 200], {...clamp, easing: Easing.out(Easing.cubic)});
  return (
    <Card>
      <div style={{fontSize: 36, fontWeight: 700, opacity: 0.8, textAlign: 'center', marginBottom: 18}}>
        PRIMEIRO, SEPARE
      </div>
      <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', height: 200}}>
        <div style={{flex: 1, textAlign: 'center', fontSize: 72, fontWeight: 800}}>MEDO</div>
        <div style={{width: 6, height: h, backgroundColor: WHITE, borderRadius: 3}} />
        <div style={{flex: 1, textAlign: 'center', fontSize: 72, fontWeight: 800, color: RED}}>RISCO</div>
      </div>
    </Card>
  );
};

const ITEMS: Array<[number, string]> = [
  [1.0, 'Está segura agora?'],
  [3.0, 'Onde ela está?'],
  [3.6, 'Falou coisas mais pesadas?'],
  [5.0, 'Está ferida ou pode tomar alguma coisa?'],
];

const Checklist: React.FC<{allNow?: boolean}> = ({allNow}) => (
  <Card>
    <div style={{fontSize: 36, fontWeight: 700, opacity: 0.8, marginBottom: 22}}>
      SE CONSEGUIR FALAR COM ELA
    </div>
    {ITEMS.map(([t, text]) => {
      const row = (
        <div key={text} style={{display: 'flex', alignItems: 'center', gap: 24, marginBottom: 18}}>
          <div
            style={{
              width: 40,
              height: 40,
              flexShrink: 0,
              border: `4px solid ${WHITE}`,
              borderRadius: 8,
            }}
          />
          <div style={{fontSize: 42, lineHeight: 1.2}}>{text}</div>
        </div>
      );
      return allNow ? row : (
        <At key={text} t={t}>
          {row}
        </At>
      );
    })}
  </Card>
);

const Emergency: React.FC = () => (
  <Card border={RED}>
    <div style={{textAlign: 'center'}}>
      <div style={{fontSize: 70, fontWeight: 900, color: RED}}>EMERGÊNCIA</div>
      <At t={0.2}>
        <div style={{fontSize: 92, fontWeight: 900, marginTop: 6}}>SAMU 192</div>
      </At>
      <At t={1.2}>
        <div style={{fontSize: 42, marginTop: 14}}>Ligue para alguém perto dela</div>
      </At>
    </div>
  </Card>
);

const Sozinho: React.FC = () => (
  <div style={{textAlign: 'center', textShadow: '0 4px 24px rgba(0,0,0,0.6)'}}>
    <div style={{fontSize: 48, fontWeight: 800}}>NÃO FIQUE</div>
    <div style={{fontSize: 120, fontWeight: 900, color: RED, lineHeight: 1}}>SOZINHO</div>
    <div style={{fontSize: 48, fontWeight: 800}}>COM ISSO</div>
  </div>
);

const PauseIcon: React.FC = () => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const sc = spring({frame: f - s(0.3), fps, config: {damping: 10}});
  return (
    <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
      <div
        style={{
          width: 200,
          height: 200,
          borderRadius: 100,
          backgroundColor: CARD,
          border: `4px solid ${WHITE}`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 26,
          transform: `scale(${sc})`,
        }}
      >
        <div style={{width: 30, height: 90, backgroundColor: WHITE, borderRadius: 6}} />
        <div style={{width: 30, height: 90, backgroundColor: WHITE, borderRadius: 6}} />
      </div>
      <div style={{fontSize: 46, fontWeight: 800, marginTop: 16, opacity: sc}}>PAUSA</div>
    </div>
  );
};

const Clock: React.FC = () => {
  const f = useCurrentFrame();
  const rot = interpolate(f, [0, s(4)], [0, 300], clamp);
  return (
    <div style={{position: 'relative', width: 150, height: 150, borderRadius: 75, border: `6px solid ${WHITE}`}}>
      <div
        style={{
          position: 'absolute',
          left: 72,
          top: 30,
          width: 6,
          height: 45,
          backgroundColor: WHITE,
          borderRadius: 3,
          transformOrigin: '3px 45px',
          transform: `rotate(${rot}deg)`,
        }}
      />
      <div
        style={{
          position: 'absolute',
          left: 72,
          top: 45,
          width: 6,
          height: 30,
          backgroundColor: RED,
          borderRadius: 3,
          transformOrigin: '3px 30px',
          transform: `rotate(${rot / 12 + 90}deg)`,
        }}
      />
    </div>
  );
};

const Combinado: React.FC = () => (
  <Card>
    <div style={{display: 'flex', alignItems: 'center', gap: 44, justifyContent: 'center'}}>
      <At t={0.5}>
        <Clock />
      </At>
      <div>
        <div style={{fontSize: 70, fontWeight: 900}}>COMBINADO</div>
        <div style={{fontSize: 40, opacity: 0.85}}>é para cumprir</div>
      </div>
    </div>
  </Card>
);

const Plano: React.FC = () => {
  // começa em 39,56 s
  const col = (title: string, t: number) => (
    <At t={t}>
      <div
        style={{
          border: `3px solid ${title === 'PERTO' ? WHITE : RED}`,
          borderRadius: 28,
          padding: '28px 20px',
          textAlign: 'center',
          fontSize: 48,
          fontWeight: 800,
          color: title === 'PERTO' ? WHITE : RED,
        }}
      >
        {title}
      </div>
    </At>
  );
  return (
    <Card>
      <At t={0.4}>
        <div style={{textAlign: 'center', fontSize: 74, fontWeight: 900}}>PLANO</div>
        <div style={{textAlign: 'center', fontSize: 38, opacity: 0.85, marginBottom: 26}}>
          com o profissional que acompanha
        </div>
      </At>
      <div style={{display: 'flex', gap: 26}}>
        <div style={{flex: 1}}>{col('PERTO', 2.45)}</div>
        <div style={{flex: 1}}>{col('DE LONGE', 3.45)}</div>
      </div>
    </Card>
  );
};

const Cta: React.FC = () => (
  <Card>
    <div style={{textAlign: 'center'}}>
      <div style={{fontSize: 52, fontWeight: 800, lineHeight: 1.2}}>
        Manda para quem se preocupa com a <span style={{color: RED}}>distância</span>
      </div>
      <div style={{fontSize: 30, opacity: 0.75, marginTop: 26, lineHeight: 1.4}}>
        Conteúdo educativo. CVV 188, 24 horas.
        <br />
        Dr. Fabio Schmidt, CRM-SP 183549
      </div>
    </div>
  </Card>
);

// ---------- Efeitos no vídeo ----------

const zoomAt = (f: number) => {
  // gancho: aproximação lenta
  if (f < s(2.52)) return interpolate(f, [0, s(2.52)], [1, 1.06], clamp);
  // ênfase em "agora, o que você faz"
  if (f >= s(6.32) && f < s(7.0)) {
    return interpolate(f, [s(6.32), s(6.32) + 3], [1.0, 1.1], {...clamp, easing: Easing.out(Easing.cubic)});
  }
  return 1;
};

const Grain: React.FC = () => {
  const f = useCurrentFrame();
  const seed = Math.floor(f / 2);
  return (
    <AbsoluteFill style={{opacity: 0.07, mixBlendMode: 'overlay', pointerEvents: 'none'}}>
      <svg width="100%" height="100%">
        <filter id={`g${seed}`}>
          <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves={2} seed={seed} />
        </filter>
        <rect width="100%" height="100%" filter={`url(#g${seed})`} />
      </svg>
    </AbsoluteFill>
  );
};

// ---------- SFX ----------

const SFX: Array<[number, string, number]> = [
  [3.0, 'pop', 0.12],
  [4.2, 'pop', 0.12],
  [8.0, 'tone', 0.06],
  [12.0, 'click', 0.15],
  [12.75, 'whoosh', 0.15],
  // de 18,7 s a 31 s: sem som, trecho de risco
  [34.0, 'pop', 0.12],
  [39.9, 'whoosh', 0.12],
  [42.0, 'pop', 0.1],
  [43.0, 'pop', 0.1],
  [44.6, 'whoosh', 0.15],
  [45.5, 'chime', 0.1],
];

// ---------- Composição ----------

const Q = (a: number, b: number, el: React.ReactNode, top?: number) => (
  <Sequence from={s(a)} durationInFrames={s(b) - s(a)}>
    <Appear dur={s(b) - s(a)} top={top}>
      {el}
    </Appear>
  </Sequence>
);

export const Longe: React.FC = () => {
  const f = useCurrentFrame();
  const z = zoomAt(f);
  return (
    <AbsoluteFill style={{backgroundColor: '#000'}}>
      <AbsoluteFill style={{transform: `scale(${z})`, transformOrigin: '50% 28%'}}>
        <OffthreadVideo src={staticFile('longe.mp4')} style={{width: '100%', height: '100%', objectFit: 'cover'}} />
      </AbsoluteFill>

      {Q(0, 2.52, <Hook />)}
      {Q(2.52, 6.32, <MapCard tYou={0.45} tHer={1.65} tLine={0.65} />)}
      {Q(7.0, 9.8, <CallCard />)}
      {Q(9.8, 13.9, <TwoCards />)}
      {Q(14.0, 16.0, <MedoRisco />)}
      {Q(16.0, 23.3, <Checklist />, 900)}
      {Q(23.4, 27.16, <Emergency />)}
      {Q(27.16, 29.6, <Checklist allNow />, 900)}
      {Q(31.2, 33.68, <Sozinho />)}
      {Q(33.68, 35.52, <PauseIcon />)}
      {Q(35.52, 39.56, <Combinado />)}
      {Q(39.56, 44.6, <Plano />, 940)}
      {Q(44.6, 47.04, <MapCard tYou={0} tHer={0} tLine={0.7} solid />)}
      {Q(47.04, 49.68, <Cta />)}

      <Grain />

      {SFX.map(([t, name, vol]) => (
        <Sequence key={`${name}-${t}`} from={s(t)}>
          <Audio src={staticFile(`sfx/${name}.wav`)} volume={vol} />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};
