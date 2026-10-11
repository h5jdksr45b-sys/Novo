import React from "react";
import { C, SERIF } from "./theme";

const STROKE = { stroke: C.ink, strokeWidth: 7, strokeLinejoin: "round" as const, strokeLinecap: "round" as const };

// Médico caricato, fictício. mouth: 0 fechada, 1 gritando. diploma: 0 escondido, 1 erguido como escudo.
export const Doctor: React.FC<{ mouth?: number; diploma?: number; pointing?: number; smug?: number }> = ({
  mouth = 0,
  diploma = 0,
  pointing = 0,
  smug = 0,
}) => {
  const mouthRy = 6 + mouth * 34;
  const browTilt = 14 - smug * 10;
  return (
    <svg viewBox="0 0 500 760" width="100%" height="100%" style={{ overflow: "visible" }}>
      {/* jaleco */}
      <path d="M95 760 L120 470 Q250 420 380 470 L405 760 Z" fill="#FFFFFF" {...STROKE} />
      <path d="M250 455 L200 600 L250 640 L300 600 Z" fill="#E9E5DE" {...STROKE} />
      <path d="M190 470 L250 560 L310 470" fill="none" {...STROKE} />
      <circle cx="310" cy="640" r="7" fill={C.ink} />
      <circle cx="310" cy="690" r="7" fill={C.ink} />
      {/* braço apontando */}
      <g style={{ transformOrigin: "360px 500px", transform: `rotate(${-70 * pointing}deg)`, opacity: diploma > 0.05 ? 0 : 1 }}>
        <path d="M355 490 L470 560" stroke={C.ink} strokeWidth={60} strokeLinecap="round" />
        <path d="M355 490 L470 560" stroke="#FFFFFF" strokeWidth={46} strokeLinecap="round" />
        <circle cx="482" cy="566" r="22" fill={C.skin} {...STROKE} />
        <path d="M498 560 L540 548" stroke={C.ink} strokeWidth={14} strokeLinecap="round" />
      </g>
      {/* cabelo desgrenhado */}
      <path
        d="M128 230 L105 170 L150 185 L140 120 L190 150 L205 85 L245 135 L280 80 L300 140 L350 100 L345 160 L400 150 L370 205 L395 245 Z"
        fill={C.beard}
        {...STROKE}
      />
      {/* rosto */}
      <ellipse cx="250" cy="250" rx="118" ry="128" fill={C.skin} {...STROKE} />
      {/* sobrancelhas */}
      <path d={`M165 ${200 - browTilt} L230 ${200 + browTilt}`} stroke={C.ink} strokeWidth={16} strokeLinecap="round" />
      <path d={`M335 ${200 - browTilt} L270 ${200 + browTilt}`} stroke={C.ink} strokeWidth={16} strokeLinecap="round" />
      {/* olhos esbugalhados */}
      <circle cx="205" cy="238" r={26 - smug * 8} fill="#FFFFFF" {...STROKE} />
      <circle cx="295" cy="238" r={26 - smug * 8} fill="#FFFFFF" {...STROKE} />
      <circle cx={208 + smug * 6} cy="240" r="9" fill={C.ink} />
      <circle cx={298 + smug * 6} cy="240" r="9" fill={C.ink} />
      {/* barba cheia */}
      <path
        d="M135 270 Q130 420 250 470 Q370 420 365 270 Q340 300 320 300 Q250 330 180 300 Q160 300 135 270 Z"
        fill={C.beard}
        {...STROKE}
      />
      <path d="M200 380 Q210 420 230 440 M300 380 Q290 420 270 440 M250 400 L250 455" stroke="#77706A" strokeWidth={6} fill="none" />
      {/* boca */}
      <ellipse cx="250" cy={330 + mouth * 8} rx={34 + mouth * 10} ry={mouthRy} fill="#5A1F12" {...STROKE} />
      {mouth > 0.4 && <rect x="226" y={300 + mouth * 2} width="48" height="12" rx="4" fill="#FFFFFF" />}
      {/* nariz */}
      <path d="M250 250 Q236 285 252 292" fill="none" {...STROKE} />
      {/* diploma como escudo */}
      <g
        style={{
          transform: `translate(0px, ${(1 - diploma) * 520}px)`,
          opacity: diploma > 0.01 ? 1 : 0,
        }}
      >
        <rect x="70" y="250" width="360" height="300" rx="10" fill="#8B5A2B" {...STROKE} />
        <rect x="92" y="272" width="316" height="256" fill="#F7F1E3" stroke={C.ink} strokeWidth={4} />
        <text x="250" y="335" textAnchor="middle" fontFamily={SERIF} fontSize="34" fontStyle="italic" fill={C.ink}>
          Diploma
        </text>
        <path d="M140 380 H360 M150 410 H350 M170 440 H330" stroke="#B9B2A4" strokeWidth={6} strokeLinecap="round" />
        <circle cx="340" cy="480" r="30" fill="#B3262B" stroke={C.ink} strokeWidth={4} />
        <path d="M325 505 L318 540 L335 528 L345 545 L352 508" fill="#B3262B" stroke={C.ink} strokeWidth={3} />
        {/* mãos segurando */}
        <circle cx="70" cy="420" r="26" fill={C.skin} {...STROKE} />
        <circle cx="430" cy="420" r="26" fill={C.skin} {...STROKE} />
      </g>
    </svg>
  );
};

// Pessoa arremessando. throwT: 0 braço atrás, 1 braço à frente.
export const Thrower: React.FC<{ throwT?: number; frustration?: number }> = ({ throwT = 0, frustration = 0 }) => {
  const armAngle = -120 + throwT * 170;
  return (
    <svg viewBox="0 0 420 760" width="100%" height="100%" style={{ overflow: "visible" }}>
      <path d="M120 760 L135 470 Q210 430 285 470 L300 760 Z" fill={C.terracotta} {...STROKE} />
      <g style={{ transformOrigin: "270px 490px", transform: `rotate(${armAngle}deg)` }}>
        <path d="M270 490 L380 490" stroke={C.ink} strokeWidth={56} strokeLinecap="round" />
        <path d="M270 490 L380 490" stroke={C.terracotta} strokeWidth={42} strokeLinecap="round" />
        <circle cx="395" cy="490" r="24" fill={C.skin} {...STROKE} />
      </g>
      <path d="M150 490 L95 600" stroke={C.ink} strokeWidth={56} strokeLinecap="round" />
      <path d="M150 490 L95 600" stroke={C.terracotta} strokeWidth={42} strokeLinecap="round" />
      <circle cx="90" cy="612" r="24" fill={C.skin} {...STROKE} />
      <ellipse cx="210" cy="320" rx="100" ry="110" fill={C.skin} {...STROKE} />
      <path d="M110 300 Q115 190 210 195 Q305 190 310 300 Q290 240 210 240 Q130 240 110 300 Z" fill={C.ink} />
      <circle cx="180" cy="320" r="10" fill={C.ink} />
      <circle cx="245" cy="320" r="10" fill={C.ink} />
      <path d={`M160 ${292 + frustration * 8} L200 ${300 - frustration * 6}`} stroke={C.ink} strokeWidth={9} strokeLinecap="round" />
      <path d={`M265 ${292 + frustration * 8} L225 ${300 - frustration * 6}`} stroke={C.ink} strokeWidth={9} strokeLinecap="round" />
      <path d={`M185 ${375 + frustration * 4} Q212 ${370 - frustration * 14} 240 ${375 + frustration * 4}`} fill="none" {...STROKE} strokeWidth={8} />
    </svg>
  );
};
