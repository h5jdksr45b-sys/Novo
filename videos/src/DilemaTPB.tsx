import React from 'react';
import {AbsoluteFill, Audio, Easing, Sequence, interpolate, spring, staticFile, useCurrentFrame} from 'remotion';
import {FONT, RED, WHITE, clamp} from './Longe';

// O dilema do adolescente e a coerência interpessoal do TPB (Gunderson, 2014).
const FPS = 30;
const f = (sec: number) => Math.round(sec * FPS);
export const DILEMA_FRAMES = f(38);

const BG = '#141210';
const MUTED = 'rgba(244,241,234,0.55)';
const CALM = '#9fc5e8';
const WARN = '#f2a65a';

const fade = (fr: number, a: number, b: number) =>
  Math.min(interpolate(fr, [f(a), f(a) + 10], [0, 1], clamp), interpolate(fr, [f(b) - 10, f(b)], [1, 0], clamp));

const Caption: React.FC<{from: number; to: number; children: React.ReactNode; color?: string; top?: number}> = ({
  from,
  to,
  children,
  color = WHITE,
  top = 300,
}) => {
  const fr = useCurrentFrame();
  const y = interpolate(fr, [f(from), f(from) + 14], [24, 0], {...clamp, easing: Easing.out(Easing.cubic)});
  return (
    <div
      style={{
        position: 'absolute',
        top,
        left: 80,
        right: 80,
        opacity: fade(fr, from, to),
        transform: `translateY(${y}px)`,
        fontFamily: FONT,
        fontWeight: 800,
        fontSize: 60,
        lineHeight: 1.15,
        color,
      }}
    >
      {children}
    </div>
  );
};

// ---------- Parte 1: a ponte ----------
const BX0 = 230;
const BX1 = 850;
const BY = 1080;

const Node: React.FC<{x: number; label: string; sub: string}> = ({x, label, sub}) => (
  <g>
    <circle cx={x} cy={BY} r={92} fill="none" stroke={WHITE} strokeWidth={5} />
    <text x={x} y={BY + 12} textAnchor="middle" fill={WHITE} fontFamily={FONT} fontWeight={800} fontSize={36}>
      {label}
    </text>
    <text x={x} y={BY + 150} textAnchor="middle" fill={MUTED} fontFamily={FONT} fontWeight={600} fontSize={30}>
      {sub}
    </text>
  </g>
);

const Ponte: React.FC = () => {
  const fr = useCurrentFrame();
  const o = fade(fr, 2, 15.5);
  const draw = interpolate(fr, [f(2), f(3.5)], [0, 1], clamp);
  // posição do adolescente na ponte (0 = cuidadores, 1 = pares)
  let p = 0.0;
  if (fr >= f(4) && fr < f(8)) p = 0;
  if (fr >= f(8) && fr < f(10.5))
    p = interpolate(fr, [f(8), f(10)], [0, 1], {...clamp, easing: Easing.inOut(Easing.cubic)});
  if (fr >= f(10.5) && fr < f(11)) p = 1;
  if (fr >= f(11)) {
    const t = (fr - f(11)) / FPS;
    p = 0.5 + 0.32 * Math.sin(t * 3.2);
  }
  const tpb = fr >= f(11);
  const x = BX0 + 92 + p * (BX1 - BX0 - 184);
  const arch = (BX1 - BX0 - 184) / 2;
  const cx = BX0 + 92 + arch;
  const archY = (px: number) => BY - 120 * (1 - ((px - cx) / arch) ** 2);
  const dotY = archY(x);
  const tpbO = interpolate(fr, [f(11), f(11.6)], [0, 1], clamp);
  return (
    <svg width={1080} height={1920} style={{position: 'absolute', inset: 0, opacity: o}}>
      <path
        d={`M${BX0 + 92},${BY} Q${cx},${BY - 240} ${BX1 - 92},${BY}`}
        fill="none"
        stroke={MUTED}
        strokeWidth={6}
        strokeDasharray={`${1000 * draw} 1000`}
      />
      <line x1={BX0 + 92} y1={BY} x2={BX1 - 92} y2={BY} stroke={MUTED} strokeWidth={4} opacity={draw} />
      <Node x={BX0} label="Família" sub="cuidadores" />
      <Node x={BX1} label="Pares" sub="amigos, grupo" />
      {tpb ? (
        <g opacity={tpbO}>
          <line x1={BX0 + 140} y1={BY - 260} x2={BX1 - 140} y2={BY - 260} stroke={RED} strokeWidth={8} />
          <path d={`M${BX0 + 160},${BY - 278} L${BX0 + 136},${BY - 260} L${BX0 + 160},${BY - 242}`} fill="none" stroke={RED} strokeWidth={8} />
          <path d={`M${BX1 - 160},${BY - 278} L${BX1 - 136},${BY - 260} L${BX1 - 160},${BY - 242}`} fill="none" stroke={RED} strokeWidth={8} />
          <text x={540} y={BY - 290} textAnchor="middle" fill={RED} fontFamily={FONT} fontWeight={800} fontSize={40}>
            TPB
          </text>
        </g>
      ) : null}
      <circle cx={x} cy={dotY - 34} r={30} fill={tpb ? RED : CALM} opacity={fr >= f(4) ? 1 : 0} />
    </svg>
  );
};

// ---------- Parte 2: ciclo de coerência interpessoal ----------
type State = {x: number; y: number; title: string; lines: string[]; color: string};
const STATES: State[] = [
  {x: 540, y: 820, title: 'Com apoio', lines: ['conectada, colabora,', 'idealiza o outro'], color: CALM},
  {x: 850, y: 1230, title: 'Ameaça de perda', lines: ['raiva, desvaloriza,', 'autolesão como pedido'], color: WARN},
  {x: 230, y: 1230, title: 'Sozinha', lines: ['vazio, dissociação,', 'impulsividade, desespero'], color: RED},
];
// [de, para, rótulo, segundo em que aparece]
const EDGES: Array<[number, number, string[], number, number, number]> = [
  [0, 1, ['sensibilidade', 'à rejeição'], 19.5, 860, 960],
  [1, 2, ['perda de fato'], 22.5, 540, 1200],
  [2, 0, ['alguém volta', 'e cuida'], 25.5, 220, 960],
];

const Box: React.FC<{s: State; at: number; active: boolean}> = ({s, at, active}) => {
  const fr = useCurrentFrame();
  const k = spring({frame: fr - f(at), fps: FPS, config: {damping: 13}});
  const w = 340;
  const h = 170;
  return (
    <g opacity={fr >= f(at) ? 1 : 0} transform={`translate(${s.x} ${s.y}) scale(${0.85 + 0.15 * k}) translate(${-s.x} ${-s.y})`}>
      <rect x={s.x - w / 2} y={s.y - h / 2} width={w} height={h} rx={28} fill={active ? s.color : 'rgba(255,255,255,0.04)'} fillOpacity={active ? 0.18 : 1} stroke={s.color} strokeWidth={active ? 6 : 3} />
      <text x={s.x} y={s.y - 22} textAnchor="middle" fill={s.color} fontFamily={FONT} fontWeight={800} fontSize={35}>
        {s.title}
      </text>
      {s.lines.map((l, i) => (
        <text key={l} x={s.x} y={s.y + 24 + i * 36} textAnchor="middle" fill={WHITE} fontFamily={FONT} fontWeight={600} fontSize={25}>
          {l}
        </text>
      ))}
    </g>
  );
};

const Edge: React.FC<{a: State; b: State; label: string[]; at: number; color: string; lx: number; ly: number}> = ({a, b, label, at, color, lx, ly}) => {
  const fr = useCurrentFrame();
  const g = interpolate(fr, [f(at), f(at) + 18], [0, 1], {...clamp, easing: Easing.out(Easing.cubic)});
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  const len = Math.hypot(dx, dy);
  const ux = dx / len;
  const uy = dy / len;
  const sx = a.x + ux * 190;
  const sy = a.y + uy * 115;
  const ex = sx + (b.x - ux * 190 - sx) * g;
  const ey = sy + (b.y - uy * 115 - sy) * g;
  const nx = -uy;
  const ny = ux;
  return (
    <g opacity={fr >= f(at) ? 1 : 0}>
      <line x1={sx} y1={sy} x2={ex} y2={ey} stroke={color} strokeWidth={6} />
      <path
        d={`M${ex - ux * 26 + nx * 14},${ey - uy * 26 + ny * 14} L${ex},${ey} L${ex - ux * 26 - nx * 14},${ey - uy * 26 - ny * 14}`}
        fill="none"
        stroke={color}
        strokeWidth={6}
        opacity={g}
      />
      {label.map((l, i) => (
        <text key={l} x={lx} y={ly + i * 36} textAnchor="middle" fill={color} opacity={g} fontFamily={FONT} fontWeight={700} fontSize={30}>
          {l}
        </text>
      ))}
    </g>
  );
};

const Ciclo: React.FC = () => {
  const fr = useCurrentFrame();
  const o = Math.min(interpolate(fr, [f(16), f(16.6)], [0, 1], clamp), interpolate(fr, [f(33.5), f(34.2)], [1, 0], clamp));
  const t = fr / FPS;
  // estado ativo: percorre o ciclo e depois gira mais rápido
  let active = 0;
  if (t >= 20.2) active = 1;
  if (t >= 23.2) active = 2;
  if (t >= 26.2) active = 0;
  if (t >= 28.5) active = Math.floor((t - 28.5) / 1.1) % 3;
  return (
    <svg width={1080} height={1920} style={{position: 'absolute', inset: 0, opacity: o}}>
      {EDGES.map(([a, b, label, at, lx, ly]) => (
        <Edge key={label[0]} a={STATES[a]} b={STATES[b]} label={label} at={at} color={STATES[b].color} lx={lx} ly={ly} />
      ))}
      {STATES.map((s, i) => (
        <Box key={s.title} s={s} at={16.5 + i * 0.4} active={active === i && t >= 17.5} />
      ))}
    </svg>
  );
};

const Final: React.FC = () => {
  const fr = useCurrentFrame();
  const o = interpolate(fr, [f(34.3), f(35)], [0, 1], clamp);
  return (
    <AbsoluteFill style={{justifyContent: 'center', alignItems: 'center', opacity: o, fontFamily: FONT}}>
      <div style={{textAlign: 'center', padding: '0 90px', fontSize: 80, fontWeight: 800, lineHeight: 1.12, color: WHITE}}>
        O comportamento muda
        <br />
        conforme o vínculo.
        <br />
        <span style={{color: RED}}>Não do nada.</span>
        <div style={{width: 160, height: 10, borderRadius: 5, background: RED, margin: '48px auto 0'}} />
      </div>
    </AbsoluteFill>
  );
};

const SFX: Array<[number, string, number]> = [
  [0.1, 'whoosh', 0.3],
  [4, 'pop', 0.3],
  [8, 'whoosh', 0.25],
  [11, 'tone', 0.15],
  [16, 'whoosh', 0.3],
  [19.5, 'click', 0.3],
  [22.5, 'click', 0.3],
  [25.5, 'click', 0.3],
  [34.3, 'chime', 0.3],
];

export const DilemaTPB: React.FC = () => (
  <AbsoluteFill style={{backgroundColor: BG}}>
    <div style={{position: 'absolute', top: 120, left: 80, fontFamily: FONT, fontSize: 26, letterSpacing: 10, color: MUTED, fontWeight: 700}}>
      B O R D E R L I N E
    </div>

    <Caption from={0} to={4}>O dilema do adolescente</Caption>
    <Caption from={4} to={8}>Na infância, a criança depende dos cuidadores.</Caption>
    <Caption from={8} to={11}>Na adolescência, atravessa a ponte em direção aos pares.</Caption>
    <Caption from={11} to={15.5} color={RED}>No TPB, a travessia trava. A pessoa oscila entre depender e se afastar.</Caption>

    <Caption from={16} to={19.5}>Por isso o estado muda conforme o vínculo.</Caption>
    <Caption from={19.5} to={22.5} color={WARN}>Quando sente que vai perder alguém, vem a raiva.</Caption>
    <Caption from={22.5} to={25.5} color={RED}>Quando a perda acontece, vem o vazio e o desespero.</Caption>
    <Caption from={25.5} to={28.5} color={CALM}>Quando alguém volta e cuida, ela se reorganiza.</Caption>
    <Caption from={28.5} to={34}>E o ciclo recomeça a cada ameaça de perda.</Caption>

    <Ponte />
    <Ciclo />
    <Final />

    <div style={{position: 'absolute', bottom: 90, left: 80, right: 80, textAlign: 'center', fontFamily: FONT, fontSize: 23, lineHeight: 1.5, color: MUTED}}>
      Modelo de coerência interpessoal: Gunderson, 2014
      <br />
      Conteúdo educativo. CVV 188, 24 horas. Dr. Fabio Schmidt, CRM-SP 183549
    </div>

    {SFX.map(([t, name, vol]) => (
      <Sequence key={`${t}-${name}`} from={f(t)}>
        <Audio src={staticFile(`sfx/${name}.wav`)} volume={vol} />
      </Sequence>
    ))}
  </AbsoluteFill>
);
