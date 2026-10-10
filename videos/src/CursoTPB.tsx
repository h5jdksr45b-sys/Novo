import React from 'react';
import {
  AbsoluteFill,
  Audio,
  Easing,
  Sequence,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
} from 'remotion';
import {FONT, RED, WHITE, clamp} from './Longe';

// Curso dos traços de TPB ao longo da idade.
// Base: slides de aula (Johnson et al. 2000; Stepp et al. 2014; Haltigan et al. 2016).
const FPS = 30;
const f = (sec: number) => Math.round(sec * FPS);
export const CURSO_FRAMES = f(34);

const BG = '#141210';
const MUTED = 'rgba(244,241,234,0.55)';
const GRID = 'rgba(244,241,234,0.12)';
const CALM = '#9fc5e8';

// Área do gráfico
const X0 = 110;
const X1 = 990;
const Y0 = 1380; // eixo (traço baixo)
const Y1 = 760; // topo (traço alto)
const AGE_MIN = 6;
const AGE_MAX = 40;
const ax = (age: number) => X0 + ((age - AGE_MIN) / (AGE_MAX - AGE_MIN)) * (X1 - X0);
const ay = (v: number) => Y0 - (v / 120) * (Y0 - Y1);

const smooth = (t: number) => t * t * (3 - 2 * t);
const lerpSeg = (pts: Array<[number, number]>, age: number) => {
  if (age <= pts[0][0]) return pts[0][1];
  for (let i = 0; i < pts.length - 1; i++) {
    const [a0, v0] = pts[i];
    const [a1, v1] = pts[i + 1];
    if (age <= a1) return v0 + (v1 - v0) * smooth((age - a0) / (a1 - a0));
  }
  return pts[pts.length - 1][1];
};

// Curso esperado: pico aos 14, começa a cair aos 18, estabiliza dos 28 aos 38
const esperado = (age: number) =>
  lerpSeg([[9, 22], [14, 100], [18, 92], [28, 40], [38, 40]], age);

// Subgrupo: traços seguem altos e oscilam
const persistente = (age: number) =>
  lerpSeg([[9, 34], [14, 112], [26, 104], [38, 92]], age) +
  (age > 18 ? Math.sin((age - 18) * 1.1) * 3.5 : 0);

// Objetivo: aproximar do curso esperado
const objetivo = (age: number) => {
  const k = smooth(Math.min(1, Math.max(0, (age - 15) / 9)));
  return persistente(age) * (1 - k) + (esperado(age) + 10) * k;
};

const AGES = Array.from({length: 291}, (_, i) => 9 + i * 0.1);

const pathOf = (fn: (a: number) => number, upTo: number) => {
  const pts = AGES.filter((a) => a <= upTo);
  if (pts.length < 2) return '';
  return pts.map((a, i) => `${i ? 'L' : 'M'}${ax(a).toFixed(1)},${ay(fn(a)).toFixed(1)}`).join(' ');
};

const areaBetween = (upTo: number) => {
  const pts = AGES.filter((a) => a >= 14 && a <= upTo);
  if (pts.length < 2) return '';
  const top = pts.map((a) => `${ax(a).toFixed(1)},${ay(persistente(a)).toFixed(1)}`);
  const bot = [...pts].reverse().map((a) => `${ax(a).toFixed(1)},${ay(esperado(a)).toFixed(1)}`);
  return `M${top.join(' L')} L${bot.join(' L')} Z`;
};

// Legenda grande no alto da tela
const Caption: React.FC<{from: number; to: number; children: React.ReactNode; color?: string}> = ({
  from,
  to,
  children,
  color = WHITE,
}) => {
  const fr = useCurrentFrame();
  const o = Math.min(
    interpolate(fr, [f(from), f(from) + 10], [0, 1], clamp),
    interpolate(fr, [f(to) - 10, f(to)], [1, 0], clamp),
  );
  const y = interpolate(fr, [f(from), f(from) + 14], [24, 0], {...clamp, easing: Easing.out(Easing.cubic)});
  return (
    <div
      style={{
        position: 'absolute',
        top: 300,
        left: 80,
        right: 80,
        opacity: o,
        transform: `translateY(${y}px)`,
        fontFamily: FONT,
        fontWeight: 800,
        fontSize: 62,
        lineHeight: 1.15,
        color,
      }}
    >
      {children}
    </div>
  );
};

const Pop: React.FC<{at: number; x: number; y: number; color: string}> = ({at, x, y, color}) => {
  const fr = useCurrentFrame();
  const s = spring({frame: fr - f(at), fps: FPS, config: {damping: 11}});
  const ring = fr >= f(at) ? ((fr - f(at)) % 30) / 30 : 0;
  return (
    <g opacity={fr >= f(at) ? 1 : 0}>
      <circle cx={x} cy={y} r={12 + ring * 26} fill="none" stroke={color} strokeWidth={3} opacity={1 - ring} />
      <circle cx={x} cy={y} r={13 * s} fill={color} />
    </g>
  );
};

const Tag: React.FC<{at: number; until?: number; x: number; y: number; text: string; color?: string; anchor?: 'start' | 'middle' | 'end'; size?: number}> = ({
  at,
  until = 99,
  x,
  y,
  text,
  color = WHITE,
  anchor = 'middle',
  size = 34,
}) => {
  const fr = useCurrentFrame();
  const o = Math.min(
    interpolate(fr, [f(at), f(at) + 10], [0, 1], clamp),
    interpolate(fr, [f(until) - 10, f(until)], [1, 0], clamp),
  );
  return (
    <text x={x} y={y} fill={color} opacity={o} textAnchor={anchor} fontFamily={FONT} fontWeight={700} fontSize={size}>
      {text}
    </text>
  );
};

// Indicador da queda: seta do nível do pico até o platô
const Drop: React.FC<{at: number; until: number}> = ({at, until}) => {
  const fr = useCurrentFrame();
  const g = interpolate(fr, [f(at), f(at) + 20], [0, 1], {...clamp, easing: Easing.out(Easing.cubic)});
  const o = interpolate(fr, [f(until) - 10, f(until)], [1, 0], clamp);
  const x = ax(36);
  const yA = ay(100);
  const yB = ay(40);
  const yEnd = yA + (yB - yA) * g;
  return (
    <g opacity={o}>
      <line x1={x} y1={yA} x2={x} y2={yEnd} stroke={WHITE} strokeWidth={5} />
      <path d={`M${x - 14},${yEnd - 18} L${x},${yEnd} L${x + 14},${yEnd - 18}`} fill="none" stroke={WHITE} strokeWidth={5} opacity={g} />
      <text x={x - 24} y={(yA + yB) / 2 - 6} textAnchor="end" fill={WHITE} opacity={g} fontFamily={FONT} fontWeight={800} fontSize={40}>cerca de</text>
      <text x={x - 24} y={(yA + yB) / 2 + 40} textAnchor="end" fill={WHITE} opacity={g} fontFamily={FONT} fontWeight={800} fontSize={40}>60% a menos</text>
    </g>
  );
};

const Arrow: React.FC<{at: number; until: number; age: number; label: string; above?: boolean}> = ({at, until, age, label, above}) => {
  const fr = useCurrentFrame();
  const g = interpolate(fr, [f(at), f(at) + 18], [0, 1], {...clamp, easing: Easing.out(Easing.cubic)});
  const o = interpolate(fr, [f(until) - 10, f(until)], [1, 0], clamp);
  const x = ax(age);
  const yTop = ay(persistente(age));
  const yBot = ay(esperado(age));
  const mid = (yTop + yBot) / 2;
  const half = ((yBot - yTop) / 2) * g;
  return (
    <g opacity={o}>
      <line x1={x} y1={mid - half} x2={x} y2={mid + half} stroke={RED} strokeWidth={5} strokeDasharray="10 8" />
      <path d={`M${x - 12},${mid - half + 16} L${x},${mid - half} L${x + 12},${mid - half + 16}`} fill="none" stroke={RED} strokeWidth={5} opacity={g} />
      <path d={`M${x - 12},${mid + half - 16} L${x},${mid + half} L${x + 12},${mid + half - 16}`} fill="none" stroke={RED} strokeWidth={5} opacity={g} />
      <text x={above ? x : x + 22} y={above ? yTop - 30 : mid + 12} textAnchor={above ? 'middle' : 'start'} fill={RED} opacity={g} fontFamily={FONT} fontWeight={800} fontSize={34}>
        {label}
      </text>
    </g>
  );
};

const Chart: React.FC = () => {
  const fr = useCurrentFrame();
  const appear = interpolate(fr, [f(2), f(3)], [0, 1], clamp);

  const ageEsp = interpolate(fr, [f(4), f(9)], [9, 38], {...clamp, easing: Easing.inOut(Easing.cubic)});
  const agePer = interpolate(fr, [f(14.5), f(19)], [9, 38], {...clamp, easing: Easing.inOut(Easing.cubic)});
  const ageGap = interpolate(fr, [f(19.5), f(23)], [14, 38], {...clamp, easing: Easing.inOut(Easing.cubic)});
  const gapFade = interpolate(fr, [f(24), f(25.5)], [1, 0.25], clamp);
  const ageObj = interpolate(fr, [f(25), f(29)], [9, 38], {...clamp, easing: Easing.inOut(Easing.cubic)});
  const perFade = interpolate(fr, [f(25), f(26)], [1, 0.35], clamp);
  const allOut = interpolate(fr, [f(30), f(31)], [1, 0], clamp);

  return (
    <svg width={1080} height={1920} style={{position: 'absolute', inset: 0, opacity: appear * allOut}}>
      {/* eixo e idades */}
      <line x1={X0} y1={Y0} x2={X1} y2={Y0} stroke={MUTED} strokeWidth={3} />
      {[9, 14, 18, 28, 38].map((a) => (
        <g key={a}>
          <line x1={ax(a)} y1={Y1 - 30} x2={ax(a)} y2={Y0} stroke={GRID} strokeWidth={2} />
          <text x={ax(a)} y={Y0 + 52} fill={MUTED} textAnchor="middle" fontFamily={FONT} fontWeight={700} fontSize={36}>
            {a}
          </text>
        </g>
      ))}
      <text x={X1} y={Y0 + 104} fill={MUTED} textAnchor="end" fontFamily={FONT} fontWeight={600} fontSize={30}>
        idade
      </text>
      <text x={X0 - 20} y={Y1 - 50} fill={MUTED} fontFamily={FONT} fontWeight={600} fontSize={30}>
        intensidade dos traços
      </text>

      {/* área da distância */}
      <path d={areaBetween(ageGap)} fill={RED} opacity={0.22 * (fr >= f(19.5) ? 1 : 0) * gapFade} />

      {/* curso esperado */}
      <path d={pathOf(esperado, ageEsp)} fill="none" stroke={CALM} strokeWidth={9} strokeLinecap="round" strokeLinejoin="round" />
      {/* subgrupo persistente */}
      <path d={pathOf(persistente, agePer)} fill="none" stroke={RED} strokeWidth={9} strokeLinecap="round" strokeLinejoin="round" opacity={perFade} />
      {/* objetivo do tratamento */}
      <path d={pathOf(objetivo, fr >= f(25) ? ageObj : 0)} fill="none" stroke={WHITE} strokeWidth={8} strokeDasharray="20 14" strokeLinecap="round" />

      {/* marcadores do curso esperado */}
      <Pop at={5.6} x={ax(14)} y={ay(esperado(14))} color={CALM} />
      <Tag at={5.7} until={14} x={ax(14)} y={ay(esperado(14)) - 36} text="pico aos 14" color={CALM} />
      <Pop at={6.6} x={ax(18)} y={ay(esperado(18))} color={CALM} />
      <Tag at={6.7} until={14} x={ax(18) + 26} y={ay(esperado(18)) - 26} text="começa a cair aos 18" color={CALM} anchor="start" />
      <Tag at={9.2} until={14} x={ax(33)} y={ay(40) + 58} text="estabiliza dos 28 aos 38" color={CALM} />

      {/* indicador de queda */}
      <Drop at={10} until={14} />

      {/* setas da distância */}
      <Arrow at={20} until={25} age={15} label="pequena" above />
      <Arrow at={21.6} until={25} age={27} label="grande" />

      {/* legenda das curvas */}
      <g opacity={interpolate(fr, [f(15), f(16)], [0, 1], clamp)}>
        <rect x={X0} y={Y0 + 150} width={44} height={10} rx={5} fill={CALM} />
        <text x={X0 + 60} y={Y0 + 164} fill={WHITE} fontFamily={FONT} fontWeight={600} fontSize={32}>
          curso esperado
        </text>
        <rect x={X0} y={Y0 + 210} width={44} height={10} rx={5} fill={RED} />
        <text x={X0 + 60} y={Y0 + 224} fill={WHITE} fontFamily={FONT} fontWeight={600} fontSize={32}>
          quando os traços não cedem
        </text>
      </g>
      <g opacity={interpolate(fr, [f(25.5), f(26.5)], [0, 1], clamp)}>
        <line x1={X0} y1={Y0 + 275} x2={X0 + 44} y2={Y0 + 275} stroke={WHITE} strokeWidth={8} strokeDasharray="12 8" />
        <text x={X0 + 60} y={Y0 + 286} fill={WHITE} fontFamily={FONT} fontWeight={600} fontSize={32}>
          objetivo do tratamento
        </text>
      </g>
    </svg>
  );
};

const Final: React.FC = () => {
  const fr = useCurrentFrame();
  const o = interpolate(fr, [f(30.5), f(31.3)], [0, 1], clamp);
  const s = spring({frame: fr - f(30.5), fps: FPS, config: {damping: 14}});
  return (
    <AbsoluteFill style={{justifyContent: 'center', alignItems: 'center', opacity: o, fontFamily: FONT}}>
      <div style={{transform: `scale(${0.92 + 0.08 * s})`, textAlign: 'center', padding: '0 90px'}}>
        <div style={{fontSize: 92, fontWeight: 800, color: WHITE, lineHeight: 1.1}}>
          Quanto antes,
          <br />
          <span style={{color: RED}}>menor a distância.</span>
        </div>
        <div style={{width: 160, height: 10, borderRadius: 5, background: RED, margin: '48px auto 0'}} />
      </div>
    </AbsoluteFill>
  );
};

const Footer: React.FC = () => (
  <div
    style={{
      position: 'absolute',
      bottom: 90,
      left: 80,
      right: 80,
      textAlign: 'center',
      fontFamily: FONT,
      fontSize: 23,
      lineHeight: 1.5,
      color: MUTED,
    }}
  >
    Fontes: Johnson et al. 2000; Stepp et al. 2014; Haltigan et al. 2016
    <br />
    Conteúdo educativo. Dr. Fabio Schmidt, CRM-SP 183549
  </div>
);

// [segundo, efeito, volume]
const SFX: Array<[number, string, number]> = [
  [0.1, 'whoosh', 0.3],
  [5.6, 'pop', 0.35],
  [6.6, 'pop', 0.35],
  [10, 'click', 0.3],
  [14.5, 'whoosh', 0.3],
  [20, 'tone', 0.15],
  [21.6, 'tone', 0.18],
  [25, 'whoosh', 0.3],
  [30.5, 'chime', 0.3],
];

export const CursoTPB: React.FC = () => (
  <AbsoluteFill style={{backgroundColor: BG}}>
    <div style={{position: 'absolute', top: 120, left: 80, fontFamily: FONT, fontSize: 26, letterSpacing: 10, color: MUTED, fontWeight: 700}}>
      B O R D E R L I N E
    </div>

    <Caption from={0} to={4}>Como os traços de borderline mudam com a idade</Caption>
    <Caption from={4} to={14}>Na maioria das pessoas, a intensidade sobe na adolescência e depois diminui.</Caption>
    <Caption from={14.5} to={19.5} color={RED}>Em parte das pessoas, os traços continuam altos depois da adolescência.</Caption>
    <Caption from={19.5} to={25}>Os colegas amadurecem. A distância em relação a eles aumenta.</Caption>
    <Caption from={25} to={30}>O objetivo do tratamento é diminuir essa distância.</Caption>

    <Chart />
    <Final />
    <Footer />

    {SFX.map(([t, name, vol]) => (
      <Sequence key={`${t}-${name}`} from={f(t)}>
        <Audio src={staticFile(`sfx/${name}.wav`)} volume={vol} />
      </Sequence>
    ))}
  </AbsoluteFill>
);
