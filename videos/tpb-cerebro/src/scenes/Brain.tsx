import React from 'react';
import { AbsoluteFill, interpolate, Sequence, useCurrentFrame } from 'remotion';
import { C, FONT } from '../theme';
import { Chip, KineticTitle, Tag } from '../ui';

// Vista sagital esquemática, frente à esquerda. Posições aproximadas, fora de escala.
const P = {
  cpfdl: { x: 255, y: 235 },
  cof: { x: 235, y: 410 },
  amig: { x: 425, y: 468 },
  hipo: { x: 515, y: 482 },
  insula: { x: 430, y: 365 },
};
const CONN = `M ${P.amig.x} ${P.amig.y} C 370 430 300 390 ${P.cpfdl.x + 10} ${P.cpfdl.y + 40}`;

const PHASE_ALARM = 0;
const PHASE_BRAKE = 115;
const PHASE_CONN = 215;

const clamp = { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' } as const;

export const Brain: React.FC<{ cover?: boolean }> = ({ cover = false }) => {
  const f = useCurrentFrame();
  const fade = (a: number, b: number) => interpolate(f, [a, a + 14, b, b + 10], [0, 1, 1, 0.35], clamp);
  const pulse = 0.75 + 0.25 * Math.sin(f / 4);

  const alarm = interpolate(f, [PHASE_ALARM + 14, PHASE_ALARM + 28], [0, 1], clamp);
  const brake = interpolate(f, [PHASE_BRAKE + 6, PHASE_BRAKE + 22], [0, 1], clamp);
  const conn = interpolate(f, [PHASE_CONN + 6, PHASE_CONN + 20], [0, 1], clamp);

  // Câmera: entra no cérebro, aproxima a frente na fase do freio.
  const zoom = interpolate(f, [0, 20, PHASE_BRAKE, PHASE_BRAKE + 25, PHASE_CONN, PHASE_CONN + 25], [0.9, 1, 1, 1.12, 1.12, 1.04], clamp);
  const panX = interpolate(f, [PHASE_BRAKE, PHASE_BRAKE + 25, PHASE_CONN, PHASE_CONN + 25], [0, 70, 70, 20], clamp);

  // Pulso lento do alarme ao freio, perdendo força no caminho.
  const tPulse = ((f - PHASE_CONN - 20) % 60) / 60;
  const pulseOn = f > PHASE_CONN + 20;
  const pathLen = 330;

  const dimDuringConn = interpolate(f, [PHASE_CONN, PHASE_CONN + 12], [1, 0.45], clamp);

  return (
    <AbsoluteFill style={{ background: C.bg }}>
      {!cover && (<div style={{ position: 'absolute', top: 150, left: 100, right: 100, height: 300 }}>
        <Sequence from={PHASE_ALARM} durationInFrames={PHASE_BRAKE} layout="none">
          <Tag>Sistema límbico</Tag>
          <div style={{ height: 22 }} />
          <KineticTitle text="Alarme mais sensível" size={104} color={C.gold} delay={6} out={PHASE_BRAKE - 10} />
        </Sequence>
        <Sequence from={PHASE_BRAKE} durationInFrames={PHASE_CONN - PHASE_BRAKE} layout="none">
          <Tag>Córtex pré-frontal e cingulado</Tag>
          <div style={{ height: 22 }} />
          <KineticTitle text="Freio mais fraco" size={104} color={C.cool} delay={2} out={PHASE_CONN - PHASE_BRAKE - 10} />
        </Sequence>
        <Sequence from={PHASE_CONN} layout="none">
          <Tag>Conectividade fronto-límbica</Tag>
          <div style={{ height: 22 }} />
          <KineticTitle text="Conexão mais fraca" size={104} delay={2} />
        </Sequence>
      </div>)}

      <div
        style={{
          position: 'absolute',
          top: cover ? 760 : 480,
          left: 40,
          width: 1000,
          height: 760,
          transform: `translateX(${panX}px) scale(${zoom})`,
          transformOrigin: '35% 55%',
        }}
      >
        <svg viewBox="80 60 900 680" width={1000} height={760}>
          <defs>
            <filter id="glow" x="-80%" y="-80%" width="260%" height="260%">
              <feGaussianBlur stdDeviation="14" result="b" />
              <feMerge>
                <feMergeNode in="b" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
            <path id="conn" d={CONN} />
          </defs>

          {/* Contorno do cérebro */}
          <path
            d="M 175 420 C 115 330 135 195 260 145 C 365 98 525 88 645 120 C 770 155 865 235 872 345 C 878 425 840 470 780 488 C 735 500 690 490 650 478 C 615 500 590 505 560 498 C 500 560 380 585 300 545 C 245 520 210 478 175 420 Z"
            fill="#15171C"
            stroke="rgba(242,237,227,0.35)"
            strokeWidth={3}
          />
          {/* Sulcos, só textura */}
          {[
            'M 300 160 C 330 200 320 240 350 270',
            'M 430 120 C 450 170 440 210 470 240',
            'M 560 115 C 570 160 590 200 580 240',
            'M 680 150 C 680 200 710 230 720 270',
            'M 780 230 C 760 270 790 310 800 350',
            'M 200 300 C 240 310 260 290 290 300',
            'M 620 300 C 660 320 700 310 740 330',
          ].map((d, i) => (
            <path key={i} d={d} stroke="rgba(242,237,227,0.09)" strokeWidth={3} fill="none" />
          ))}
          {/* Corpo caloso */}
          <path d="M 330 335 C 390 255 610 245 690 320 C 650 300 420 300 345 360 C 325 375 318 355 330 335 Z" fill="rgba(242,237,227,0.10)" />
          {/* Cerebelo e tronco */}
          <ellipse cx={720} cy={540} rx={105} ry={62} fill="#15171C" stroke="rgba(242,237,227,0.25)" strokeWidth={3} />
          <path d="M 565 490 C 580 560 585 620 600 700 L 650 700 C 640 620 630 560 615 495 Z" fill="#15171C" stroke="rgba(242,237,227,0.25)" strokeWidth={3} />

          {/* FREIO: CPFDL, COF, CCA */}
          <g opacity={brake * (f >= PHASE_CONN ? 0.7 : 1)}>
            <ellipse cx={P.cpfdl.x} cy={P.cpfdl.y} rx={72} ry={52} fill={C.coolSoft} stroke={C.cool} strokeWidth={4} strokeDasharray="10 8" />
            <ellipse cx={P.cof.x} cy={P.cof.y} rx={72} ry={32} fill={C.coolSoft} stroke={C.cool} strokeWidth={4} strokeDasharray="10 8" />
            <path d="M 312 392 C 268 330 300 262 392 250" stroke={C.cool} strokeWidth={16} fill="none" strokeLinecap="round" opacity={0.75} />
            <text x={P.cpfdl.x} y={P.cpfdl.y - 66} fill={C.ink} fontFamily={FONT} fontSize={30} fontWeight={700} textAnchor="middle">CPFDL</text>
            <text x={P.cof.x - 20} y={P.cof.y + 66} fill={C.ink} fontFamily={FONT} fontSize={30} fontWeight={700} textAnchor="middle">COF</text>
            <text x={402} y={238} fill={C.ink} fontFamily={FONT} fontSize={30} fontWeight={700}>CCA</text>
          </g>

          {/* ALARME: amígdala e ínsula */}
          <g opacity={alarm * (f >= PHASE_BRAKE && f < PHASE_CONN ? 0.5 : 1)}>
            <ellipse
              cx={P.insula.x}
              cy={P.insula.y}
              rx={62}
              ry={38}
              fill={C.goldSoft}
              stroke={C.gold}
              strokeWidth={3}
              strokeDasharray="8 8"
              opacity={pulse}
            />
            <text x={P.insula.x + 70} y={P.insula.y - 30} fill={C.ink} fontFamily={FONT} fontSize={28} fontWeight={700}>Ínsula</text>
            <text x={P.insula.x + 70} y={P.insula.y + 2} fill={C.muted} fontFamily={FONT} fontSize={22}>profunda, lateral</text>
            <ellipse cx={P.hipo.x} cy={P.hipo.y} rx={62} ry={18} transform={`rotate(-8 ${P.hipo.x} ${P.hipo.y})`} fill="rgba(242,237,227,0.12)" stroke="rgba(242,237,227,0.5)" strokeWidth={3} />
            <text x={P.hipo.x + 20} y={P.hipo.y + 52} fill={C.muted} fontFamily={FONT} fontSize={24}>hipocampo</text>
            <g filter="url(#glow)" opacity={pulse}>
              <ellipse cx={P.amig.x} cy={P.amig.y} rx={30} ry={22} fill={C.gold} />
            </g>
            <text x={P.amig.x - 40} y={P.amig.y + 62} fill={C.ink} fontFamily={FONT} fontSize={30} fontWeight={700} textAnchor="end">Amígdala</text>
          </g>

          {/* CONEXÃO */}
          <g opacity={conn}>
            <use href="#conn" stroke="rgba(242,237,227,0.25)" strokeWidth={10} fill="none" strokeDasharray="4 14" strokeLinecap="round" />
            <use
              href="#conn"
              stroke={C.gold}
              strokeWidth={10}
              fill="none"
              strokeLinecap="round"
              strokeDasharray={`40 ${pathLen}`}
              strokeDashoffset={pulseOn ? -tPulse * pathLen : 0}
              opacity={pulseOn ? 1 - tPulse * 0.85 : 0}
            />
          </g>
        </svg>
      </div>

      {!cover && (<><div style={{ position: 'absolute', top: 1235, left: 100, right: 100, display: 'flex', flexDirection: 'column', gap: 14 }}>
        <Sequence from={PHASE_ALARM} durationInFrames={PHASE_BRAKE} layout="none">
          <Chip tone="up" label="Amígdala" value="mais ativação a estímulos negativos" delay={26} out={PHASE_BRAKE - 10} />
          <Chip tone="up" label="Ínsula" value="mais ativação na emoção negativa" delay={36} out={PHASE_BRAKE - 10} />
        </Sequence>
        <Sequence from={PHASE_BRAKE} durationInFrames={PHASE_CONN - PHASE_BRAKE} layout="none">
          <Chip tone="down" label="CPFDL" value="menos ativação ao reavaliar" delay={14} out={PHASE_CONN - PHASE_BRAKE - 10} />
          <Chip tone="down" label="COF" value="menos substância cinzenta" delay={22} out={PHASE_CONN - PHASE_BRAKE - 10} />
          <Chip tone="down" label="CCA rostral" value="menos volume e ativação" delay={30} out={PHASE_CONN - PHASE_BRAKE - 10} />
        </Sequence>
        <Sequence from={PHASE_CONN} layout="none">
          <Chip tone="down" label="Amígdala e pré-frontal" value="acoplamento funcional reduzido" delay={14} />
          <Chip tone="neutral" label="O freio chega" value="mais fraco ou mais tarde" delay={24} />
        </Sequence>
      </div>
      <div style={{ position: 'absolute', top: 1198, left: 100, fontFamily: FONT, fontSize: 22, color: C.muted, opacity: dimDuringConn }}>
        Esquema simplificado, fora de escala
      </div></>)}
    </AbsoluteFill>
  );
};
