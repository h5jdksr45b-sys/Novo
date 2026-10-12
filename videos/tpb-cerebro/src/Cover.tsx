import React from 'react';
import { AbsoluteFill } from 'remotion';
import { Brain } from './scenes/Brain';
import { C, FONT, FONT_D } from './theme';

// Capa 1080x1920, renderizada no quadro 250 (fase da conexão). Texto dentro do recorte 4:5 do grid (y 285 a 1635).
export const Cover: React.FC = () => (
  <AbsoluteFill style={{ background: C.bg }}>
    <Brain cover />
    <div style={{ position: 'absolute', top: 340, left: 90, right: 90, fontFamily: FONT }}>
      <div style={{ fontSize: 30, fontWeight: 600, letterSpacing: 4, textTransform: 'uppercase', color: C.gold }}>Borderline e neuroimagem</div>
      <div style={{ height: 26 }} />
      <div style={{ fontFamily: FONT_D, fontWeight: 800, fontSize: 112, lineHeight: 1.0, letterSpacing: -3, color: C.ink }}>
        Mais <span style={{ color: C.gold }}>alarme</span>,<br />menos <span style={{ color: C.cool }}>freio</span>
      </div>
    </div>
    <div style={{ position: 'absolute', top: 1500, left: 90, right: 90, display: 'flex', gap: 40, fontFamily: FONT, fontSize: 34, color: C.ink }}>
      <span><b style={{ color: C.gold }}>↑</b> amígdala e ínsula</span>
      <span><b style={{ color: C.cool }}>↓</b> pré-frontal</span>
    </div>
    <div style={{ position: 'absolute', bottom: 120, left: 0, right: 0, textAlign: 'center', fontFamily: FONT, fontSize: 26, color: C.muted }}>
      Dr. Fabio Schmidt · Borderline Sem Estigma
    </div>
  </AbsoluteFill>
);
