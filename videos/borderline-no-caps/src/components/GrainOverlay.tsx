import React, { useContext } from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { FrozenCtx, stepIndex } from "../lib/stop";

/** Grao de fotocopia, pintas de toner e manchas, trocando a 12 qps. */
export const GrainOverlay: React.FC<{ frozenAt?: number }> = ({ frozenAt = Infinity }) => {
  const frame = useCurrentFrame();
  const frozenCtx = useContext(FrozenCtx);
  const f = Math.min(frame, frozenAt);
  const seed = frozenCtx ? 1 : stepIndex(f) % 24;
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <svg width="100%" height="100%" style={{ position: "absolute", inset: 0, mixBlendMode: "soft-light", opacity: 0.75 }}>
        <filter id="grain">
          <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed={seed} stitchTiles="stitch" />
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <rect width="100%" height="100%" filter="url(#grain)" />
      </svg>
      <svg width="100%" height="100%" style={{ position: "absolute", inset: 0, mixBlendMode: "multiply" }}>
        <filter id="toner">
          <feTurbulence type="fractalNoise" baseFrequency="0.75" numOctaves="1" seed={seed + 40} />
          <feColorMatrix type="matrix" values="0 0 0 0 0.1  0 0 0 0 0.08  0 0 0 0 0.06  11 0 0 0 -7.6" />
        </filter>
        <rect width="100%" height="100%" filter="url(#toner)" opacity={0.55} />
        <filter id="smudge">
          <feTurbulence type="fractalNoise" baseFrequency="0.004 0.012" numOctaves="3" seed={7 + (seed % 3)} />
          <feColorMatrix type="matrix" values="0 0 0 0 0.35  0 0 0 0 0.25  0 0 0 0 0.15  1.4 0 0 0 -0.62" />
        </filter>
        <rect width="100%" height="100%" filter="url(#smudge)" opacity={0.5} />
      </svg>
    </AbsoluteFill>
  );
};
