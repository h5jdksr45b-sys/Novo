import React from 'react';
import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring } from 'remotion';
import { C, FONT } from '../theme';
import { KineticTitle, Tag } from '../ui';

const ROWS: [string, 'up' | 'down', string, string][] = [
  ['Amígdala', 'up', 'ativação diante de emoção negativa', 'fMRI'],
  ['Ínsula', 'up', 'ativação na rejeição', 'fMRI'],
  ['Hipocampo', 'down', 'volume nos dois lados', 'RM'],
  ['COF', 'down', 'substância cinzenta', 'RM, PET'],
  ['CPFDL', 'down', 'ativação ao reavaliar', 'fMRI'],
  ['CCA rostral', 'down', 'volume e ativação', 'RM, fMRI'],
];

export const Table: React.FC = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  return (
    <AbsoluteFill style={{ background: C.bg, padding: '170px 80px 0' }}>
      <Tag>Resumo dos achados</Tag>
      <div style={{ height: 22 }} />
      <KineticTitle text="Mais alarme, menos freio" size={92} delay={4} />
      <div style={{ height: 60 }} />
      <div style={{ fontFamily: FONT, display: 'flex', fontSize: 26, color: C.muted, padding: '0 24px 14px', borderBottom: `2px solid ${C.line}` }}>
        <div style={{ width: 290 }}>Região</div>
        <div style={{ flex: 1 }}>Achado médio</div>
        <div style={{ width: 150, textAlign: 'right' }}>Método</div>
      </div>
      {ROWS.map(([reg, tone, achado, met], i) => {
        const s = spring({ frame: f - 14 - i * 6, fps, config: { damping: 15, mass: 0.6 } });
        const col = tone === 'up' ? C.gold : C.cool;
        return (
          <div
            key={reg}
            style={{
              fontFamily: FONT,
              display: 'flex',
              alignItems: 'center',
              padding: '30px 24px',
              borderBottom: `2px solid ${C.line}`,
              opacity: s,
              transform: `translateX(${(1 - s) * 300}px)`,
              background: i % 2 ? 'transparent' : 'rgba(242,237,227,0.03)',
            }}
          >
            <div style={{ width: 290, fontSize: 38, fontWeight: 700, color: C.ink }}>{reg}</div>
            <div style={{ flex: 1, fontSize: 32, color: C.ink, display: 'flex', alignItems: 'center', gap: 16 }}>
              <span style={{ fontSize: 44, fontWeight: 800, color: col }}>{tone === 'up' ? '↑' : '↓'}</span>
              {achado}
            </div>
            <div style={{ width: 150, textAlign: 'right', fontSize: 26, color: C.muted }}>{met}</div>
          </div>
        );
      })}
      <div style={{ fontFamily: FONT, fontSize: 22, color: C.muted, marginTop: 26, lineHeight: 1.4 }}>
        Schulze e col., 2016. Ruocco e col., 2012. Chanen e col., 2008.
        <br />
        Médias de grupo. Resultados variam entre estudos.
      </div>
    </AbsoluteFill>
  );
};
