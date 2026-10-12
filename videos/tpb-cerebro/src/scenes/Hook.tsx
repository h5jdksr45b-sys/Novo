import React from 'react';
import { AbsoluteFill, interpolate, useCurrentFrame } from 'remotion';
import { C, FONT } from '../theme';
import { KineticTitle, Tag, useIn } from '../ui';

// Curva esquemática: subida rápida e retorno lento à linha de base.
// Sem eixo numérico: é ilustração do correlato clínico, não dado.
const W = 880;
const H = 520;
const base = H - 80;
const curve = (x: number, peak: number, fall: number) => {
  const t0 = 160;
  if (x < t0) return base;
  const dx = x - t0;
  const rise = 1 - Math.exp(-dx / 22);
  const decay = Math.exp(-dx / fall);
  return base - peak * rise * decay * 1.35;
};
const pathFor = (peak: number, fall: number, upTo: number) => {
  let d = `M 0 ${base}`;
  for (let x = 4; x <= upTo; x += 4) d += ` L ${x} ${curve(x, peak, fall).toFixed(1)}`;
  return d;
};

export const Hook: React.FC = () => {
  const f = useCurrentFrame();
  const draw = interpolate(f, [12, 80], [0, W], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const chartIn = useIn(6);
  return (
    <AbsoluteFill style={{ background: C.bg, padding: '170px 100px 0' }}>
      <Tag>TPB e neuroimagem</Tag>
      <div style={{ height: 30 }} />
      <KineticTitle text="A emoção dispara rápido e demora a baixar." size={96} delay={2} />
      <div style={{ height: 90 }} />
      <div style={{ opacity: chartIn, transform: `translateY(${(1 - chartIn) * 60}px)` }}>
        <svg width={W} height={H}>
          <line x1={0} y1={base} x2={W} y2={base} stroke={C.line} strokeWidth={3} />
          <line x1={0} y1={20} x2={0} y2={base} stroke={C.line} strokeWidth={3} />
          <path d={pathFor(170, 120, draw)} stroke={C.muted} strokeWidth={5} fill="none" strokeDasharray="12 12" />
          <path d={pathFor(300, 420, draw)} stroke={C.gold} strokeWidth={9} fill="none" strokeLinecap="round" />
          <text x={8} y={base + 50} fill={C.muted} fontFamily={FONT} fontSize={28}>
            gatilho
          </text>
          <text x={W - 8} y={base + 50} fill={C.muted} fontFamily={FONT} fontSize={28} textAnchor="end">
            tempo
          </text>
          <text x={14} y={44} fill={C.muted} fontFamily={FONT} fontSize={28}>
            intensidade
          </text>
        </svg>
        <div style={{ display: 'flex', gap: 40, fontFamily: FONT, fontSize: 30, color: C.ink, marginTop: 18 }}>
          <span><span style={{ color: C.gold, fontWeight: 800 }}>━</span> reatividade intensa</span>
          <span><span style={{ color: C.muted, fontWeight: 800 }}>┅</span> referência</span>
        </div>
        <div style={{ fontFamily: FONT, fontSize: 24, color: C.muted, marginTop: 14 }}>Esquema ilustrativo, sem escala</div>
      </div>
    </AbsoluteFill>
  );
};
