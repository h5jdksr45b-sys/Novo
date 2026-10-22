import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";

// Grão de filme + vinheta + poeira leve. Fica por cima de tudo, exceto da assinatura.
export const Grao: React.FC<{ intensidade?: number }> = ({ intensidade = 0.16 }) => {
  const frame = useCurrentFrame();
  const seed = (frame * 7) % 97;
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <svg width="100%" height="100%" style={{ position: "absolute", inset: 0, mixBlendMode: "overlay", opacity: intensidade }}>
        <filter id={`grao-${seed}`}>
          <feTurbulence type="fractalNoise" baseFrequency="0.95" numOctaves={2} seed={seed} stitchTiles="stitch" />
          <feColorMatrix type="saturate" values="0" />
          <feComponentTransfer>
            <feFuncA type="linear" slope={1} />
          </feComponentTransfer>
        </filter>
        <rect width="100%" height="100%" filter={`url(#grao-${seed})`} />
      </svg>
      <AbsoluteFill
        style={{
          background:
            "radial-gradient(ellipse 70% 60% at 50% 48%, rgba(0,0,0,0) 45%, rgba(0,0,0,0.55) 100%)",
        }}
      />
      <AbsoluteFill
        style={{
          background: "linear-gradient(180deg, rgba(0,0,0,0.25) 0%, rgba(0,0,0,0) 22%, rgba(0,0,0,0) 78%, rgba(0,0,0,0.35) 100%)",
        }}
      />
    </AbsoluteFill>
  );
};
