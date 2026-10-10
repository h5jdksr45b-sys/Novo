import React from 'react';
import {AbsoluteFill, Audio, Easing, Sequence, interpolate, spring, staticFile, useCurrentFrame} from 'remotion';
import {FONT, WHITE, clamp} from './Longe';

// Algoritmo de cuidado escalonado no TPB (Gunderson Personality Disorders Institute).
const FPS = 30;
const f = (sec: number) => Math.round(sec * FPS);
const T0 = 3.5; // início do primeiro degrau
const STEP = 6; // segundos por degrau
export const ESCALONADO_FRAMES = f(T0 + STEP * 5 + 4);

const BG = '#141210';
const MUTED = 'rgba(244,241,234,0.55)';

type Degrau = {n: number; nome: string; cor: string; quando: string; sinais: string; fazer: string[]};
const DEGRAUS: Degrau[] = [
  {n: 1, nome: 'Pré-clínico', cor: '#e8a05c', quando: 'Traços abaixo do diagnóstico', sinais: 'Hipersensibilidade nas relações e desregulação emocional', fazer: ['Psicoeducação para a pessoa e a família', 'Resolução de problemas', 'Suporte e aconselhamento']},
  {n: 2, nome: 'Precoce e leve', cor: '#e57f45', quando: 'Primeiro episódio de TPB', sinais: 'Surgem autolesão e risco de suicídio', fazer: ['GPM, bom manejo psiquiátrico', 'Manejo de caso', 'Grupo de habilidades e intervenção familiar']},
  {n: 3, nome: 'Sustentado e moderado', cor: '#d9573b', quando: 'Critérios de TPB mantidos', sinais: 'Não responde ao tratamento básico', fazer: ['Ambulatório com GPM e medicação quando indicada', 'Terapia baseada em evidência', 'Habilidades e intervenção familiar']},
  {n: 4, nome: 'Severo', cor: '#c63a33', quando: 'Remissões e recaídas', sinais: 'Autolesão grave e tentativas potencialmente fatais', fazer: ['Aumento do nível de cuidado', 'Integrar ou trocar a terapia baseada em evidência', 'Habilidades e intervenção familiar']},
  {n: 5, nome: 'Crônico e persistente', cor: '#9e2a2b', quando: 'Não responde às etapas anteriores', sinais: 'Quadro persistente apesar do tratamento', fazer: ['Acompanhamento de baixa frequência', 'Terapia de suporte', 'Manejo de caso e rede pública']},
];

// Escada: degrau 1 embaixo, 5 em cima
const SX = 90;
const SW = 900;
const SBOT = 1700;
const SH = 92;

const Escada: React.FC = () => {
  const fr = useCurrentFrame();
  return (
    <svg width={1080} height={1920} style={{position: 'absolute', inset: 0}}>
      {DEGRAUS.map((d, i) => {
        const at = T0 + i * STEP;
        const g = interpolate(fr, [f(at) - 4, f(at) + 12], [0, 1], {...clamp, easing: Easing.out(Easing.cubic)});
        const active = fr >= f(at) && fr < f(at + STEP);
        const done = fr >= f(at + STEP);
        const x = SX + i * 70;
        const w = (SW - i * 70) * g;
        const y = SBOT - (i + 1) * SH;
        return (
          <g key={d.n} opacity={g > 0 ? 1 : 0}>
            <rect x={x} y={y} width={w} height={SH - 8} rx={14} fill={d.cor} opacity={active ? 1 : done ? 0.55 : 0.8} />
            <text x={x + 28} y={y + 57} fill={WHITE} fontFamily={FONT} fontWeight={800} fontSize={36} opacity={g}>
              {d.n}. {d.nome}
            </text>
            {active ? <rect x={x - 6} y={y - 6} width={w + 12} height={SH + 4} rx={18} fill="none" stroke={WHITE} strokeWidth={4} /> : null}
          </g>
        );
      })}
      <text x={SX + SW} y={SBOT + 56} textAnchor="end" fill={MUTED} fontFamily={FONT} fontWeight={600} fontSize={28}>
        quanto mais alto, maior a gravidade e o nível de cuidado
      </text>
    </svg>
  );
};

const Card: React.FC<{d: Degrau; at: number}> = ({d, at}) => {
  const fr = useCurrentFrame();
  const o = Math.min(interpolate(fr, [f(at), f(at) + 10], [0, 1], clamp), interpolate(fr, [f(at + STEP) - 8, f(at + STEP)], [1, 0], clamp));
  const y = interpolate(fr, [f(at), f(at) + 14], [30, 0], {...clamp, easing: Easing.out(Easing.cubic)});
  const item = (k: number) => {
    const s = spring({frame: fr - f(at + 1.2 + k * 0.5), fps: FPS, config: {damping: 14}});
    return {opacity: s, transform: `translateX(${(1 - s) * 30}px)`};
  };
  return (
    <div style={{position: 'absolute', top: 210, left: 70, right: 70, opacity: o, transform: `translateY(${y}px)`, fontFamily: FONT, color: WHITE}}>
      <div style={{display: 'flex', alignItems: 'center', gap: 24}}>
        <div style={{width: 96, height: 96, borderRadius: 48, background: d.cor, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 54, fontWeight: 800}}>
          {d.n}
        </div>
        <div style={{fontSize: 62, fontWeight: 800, lineHeight: 1.05}}>{d.nome}</div>
      </div>
      <div style={{marginTop: 40, fontSize: 30, fontWeight: 700, color: MUTED, letterSpacing: 2}}>QUANDO</div>
      <div style={{fontSize: 42, fontWeight: 700, marginTop: 8}}>{d.quando}</div>
      <div style={{fontSize: 34, fontWeight: 500, marginTop: 10, color: 'rgba(244,241,234,0.85)', lineHeight: 1.3}}>{d.sinais}</div>
      <div style={{marginTop: 36, fontSize: 30, fontWeight: 700, color: MUTED, letterSpacing: 2}}>O QUE FAZER</div>
      {d.fazer.map((t, k) => (
        <div key={t} style={{display: 'flex', alignItems: 'center', gap: 20, marginTop: 16, fontSize: 38, fontWeight: 700, ...item(k)}}>
          <div style={{width: 18, height: 18, borderRadius: 9, background: d.cor, flexShrink: 0}} />
          {t}
        </div>
      ))}
    </div>
  );
};

const Abertura: React.FC = () => {
  const fr = useCurrentFrame();
  const o = Math.min(interpolate(fr, [0, 10], [0, 1], clamp), interpolate(fr, [f(T0) - 10, f(T0)], [1, 0], clamp));
  return (
    <div style={{position: 'absolute', top: 300, left: 80, right: 80, opacity: o, fontFamily: FONT, color: WHITE}}>
      <div style={{fontSize: 76, fontWeight: 800, lineHeight: 1.1}}>Cuidado escalonado no borderline</div>
      <div style={{fontSize: 40, fontWeight: 600, marginTop: 28, color: MUTED, lineHeight: 1.3}}>
        O tratamento acompanha a gravidade. Cinco degraus.
      </div>
    </div>
  );
};

const Final: React.FC = () => {
  const fr = useCurrentFrame();
  const at = T0 + STEP * 5;
  const o = interpolate(fr, [f(at), f(at) + 15], [0, 1], clamp);
  return (
    <div style={{position: 'absolute', top: 300, left: 80, right: 80, opacity: o, fontFamily: FONT, color: WHITE}}>
      <div style={{fontSize: 70, fontWeight: 800, lineHeight: 1.12}}>
        Cada degrau tem um tratamento possível.
        <br />
        <span style={{color: '#ff3b30'}}>Começar cedo evita subir a escada.</span>
      </div>
      <div style={{fontSize: 30, fontWeight: 600, marginTop: 30, color: MUTED, lineHeight: 1.4}}>
        GPM: bom manejo psiquiátrico. Terapia baseada em evidência: por exemplo, DBT.
      </div>
    </div>
  );
};

const SFX: Array<[number, string, number]> = [
  [0.1, 'whoosh', 0.3],
  ...DEGRAUS.map((_, i) => [T0 + i * STEP, 'pop', 0.3] as [number, string, number]),
  [T0 + STEP * 5, 'chime', 0.3],
];

export const EscalonadoTPB: React.FC = () => (
  <AbsoluteFill style={{backgroundColor: BG}}>
    <div style={{position: 'absolute', top: 120, left: 80, fontFamily: FONT, fontSize: 26, letterSpacing: 10, color: MUTED, fontWeight: 700}}>
      B O R D E R L I N E
    </div>
    <Abertura />
    {DEGRAUS.map((d, i) => (
      <Card key={d.n} d={d} at={T0 + i * STEP} />
    ))}
    <Final />
    <Escada />
    <div style={{position: 'absolute', bottom: 70, left: 80, right: 80, textAlign: 'center', fontFamily: FONT, fontSize: 23, lineHeight: 1.5, color: MUTED}}>
      Fonte: Gunderson Personality Disorders Institute
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
