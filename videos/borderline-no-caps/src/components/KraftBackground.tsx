import React from "react";
import { AbsoluteFill } from "remotion";
import { C } from "../lib/theme";

/** Papel kraft com fibras e manchas, sem gradiente. */
export const KraftBackground: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: C.kraft }}>
    <svg width="100%" height="100%" style={{ position: "absolute", inset: 0 }}>
      <filter id="fibers">
        <feTurbulence type="fractalNoise" baseFrequency="0.003 0.11" numOctaves="3" seed={4} />
        <feColorMatrix type="matrix" values="0 0 0 0 0.38  0 0 0 0 0.24  0 0 0 0 0.12  1.5 0 0 0 -0.55" />
      </filter>
      <rect width="100%" height="100%" filter="url(#fibers)" />
      <filter id="lightfibers">
        <feTurbulence type="fractalNoise" baseFrequency="0.09 0.004" numOctaves="2" seed={9} />
        <feColorMatrix type="matrix" values="0 0 0 0 0.86  0 0 0 0 0.72  0 0 0 0 0.52  1.6 0 0 0 -0.9" />
      </filter>
      <rect width="100%" height="100%" filter="url(#lightfibers)" opacity={0.6} />
      <filter id="blotch">
        <feTurbulence type="fractalNoise" baseFrequency="0.0025" numOctaves="3" seed={2} />
        <feColorMatrix type="matrix" values="0 0 0 0 0.4  0 0 0 0 0.26  0 0 0 0 0.12  1.2 0 0 0 -0.5" />
      </filter>
      <rect width="100%" height="100%" filter="url(#blotch)" />
    </svg>
  </AbsoluteFill>
);
