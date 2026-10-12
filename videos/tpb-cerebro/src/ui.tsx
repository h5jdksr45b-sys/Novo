import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { C, FONT, FONT_D } from './theme';

export const useIn = (delay = 0, damping = 16) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  return spring({ frame: f - delay, fps, config: { damping, mass: 0.7 } });
};

// Texto grande de ênfase: palavras entram deslizando, uma a uma.
export const KineticTitle: React.FC<{
  text: string;
  delay?: number;
  size?: number;
  color?: string;
  out?: number;
}> = ({ text, delay = 0, size = 92, color = C.ink, out }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const words = text.split(' ');
  const exit = out === undefined ? 0 : interpolate(f, [out, out + 10], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  return (
    <div
      style={{
        fontFamily: FONT_D,
        fontWeight: 800,
        fontSize: size,
        lineHeight: 1.02,
        letterSpacing: -2,
        color,
        display: 'flex',
        flexWrap: 'wrap',
        gap: `0 ${size * 0.26}px`,
        opacity: 1 - exit,
        transform: `translateX(${-exit * 120}px)`,
      }}
    >
      {words.map((w, i) => {
        const s = spring({ frame: f - delay - i * 4, fps, config: { damping: 14, mass: 0.6 } });
        return (
          <span key={i} style={{ display: 'inline-block', opacity: s, transform: `translateX(${(1 - s) * 140}px)` }}>
            {w}
          </span>
        );
      })}
    </div>
  );
};

export const Chip: React.FC<{
  label: string;
  value: string;
  tone: 'up' | 'down' | 'neutral';
  delay: number;
  out?: number;
}> = ({ label, value, tone, delay, out }) => {
  const f = useCurrentFrame();
  const s = useIn(delay);
  const exit = out === undefined ? 0 : interpolate(f, [out, out + 10], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const col = tone === 'up' ? C.gold : tone === 'down' ? C.cool : C.ink;
  const arrow = tone === 'up' ? '↑' : tone === 'down' ? '↓' : '↔';
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 22,
        padding: '20px 28px',
        borderRadius: 22,
        background: C.bg2,
        border: `2px solid ${tone === 'up' ? 'rgba(212,175,90,0.5)' : tone === 'down' ? 'rgba(124,141,163,0.5)' : C.line}`,
        opacity: s * (1 - exit),
        transform: `translateX(${(1 - s) * 260 - exit * 200}px)`,
        fontFamily: FONT,
      }}
    >
      <div style={{ fontSize: 54, fontWeight: 800, color: col, width: 64, textAlign: 'center' }}>{arrow}</div>
      <div>
        <div style={{ fontSize: 40, fontWeight: 700, color: C.ink }}>{label}</div>
        <div style={{ fontSize: 30, color: C.muted, marginTop: 4 }}>{value}</div>
      </div>
    </div>
  );
};

export const Tag: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div
    style={{
      fontFamily: FONT,
      fontSize: 26,
      fontWeight: 600,
      letterSpacing: 3,
      textTransform: 'uppercase',
      color: C.gold,
    }}
  >
    {children}
  </div>
);
