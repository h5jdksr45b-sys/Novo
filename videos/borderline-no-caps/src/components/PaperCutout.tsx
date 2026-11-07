import React, { useId } from "react";
import { C } from "../lib/theme";
import { cleanId, useJitter } from "../lib/stop";

type Props = {
  x?: number;
  y?: number;
  width?: number;
  height?: number;
  color?: string;
  seed: number;
  /** Intensidade da borda irregular, em px. */
  rough?: number;
  rotate?: number;
  /** 0 = colado no papel, 1 = levantado (sombra maior). */
  lift?: number;
  /** Forma propria em coordenadas locais (exige width e height). */
  path?: string;
  padding?: number | string;
  jitter?: number;
  texture?: boolean;
  style?: React.CSSProperties;
  children?: React.ReactNode;
};

/** Recorte de papel: borda rasgada, fibra, pintas de fotocopia e sombra leve. */
export const PaperCutout: React.FC<Props> = ({
  x,
  y,
  width,
  height,
  color = C.cream,
  seed,
  rough = 7,
  rotate = 0,
  lift = 0,
  path,
  padding,
  jitter = 1,
  texture = true,
  style,
  children,
}) => {
  const id = cleanId(useId());
  const j = useJitter(seed, jitter);
  const positioned = x !== undefined && y !== undefined;
  const shadow = `drop-shadow(0px ${3 + lift * 26}px ${3 + lift * 22}px rgba(45, 28, 12, ${0.38 - lift * 0.1}))`;

  return (
    <div
      style={{
        position: positioned ? "absolute" : "relative",
        left: x,
        top: y,
        width,
        height,
        padding,
        display: positioned ? "block" : "inline-block",
        transform: `translate(${j.x}px, ${j.y}px) rotate(${rotate + j.r}deg)`,
        transformOrigin: "50% 50%",
        ...style,
      }}
    >
      <svg
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          width: "100%",
          height: "100%",
          overflow: "visible",
          filter: shadow,
        }}
      >
        <defs>
          <filter id={`e${id}`} x="-6%" y="-6%" width="112%" height="112%">
            <feTurbulence type="fractalNoise" baseFrequency="0.045" numOctaves="2" seed={seed} result="n" />
            <feDisplacementMap in="SourceGraphic" in2="n" scale={rough} xChannelSelector="R" yChannelSelector="G" result="shape" />
            {texture ? (
              <>
                <feTurbulence type="fractalNoise" baseFrequency="0.7" numOctaves="2" seed={seed + 7} result="g" />
                <feColorMatrix
                  in="g"
                  type="matrix"
                  values="0 0 0 0 0.16  0 0 0 0 0.11  0 0 0 0 0.06  2.6 0 0 0 -1.45"
                  result="specks"
                />
                <feComposite in="specks" in2="shape" operator="in" result="sp" />
                <feTurbulence type="fractalNoise" baseFrequency="0.006 0.02" numOctaves="2" seed={seed + 3} result="b" />
                <feColorMatrix
                  in="b"
                  type="matrix"
                  values="0 0 0 0 0.3  0 0 0 0 0.2  0 0 0 0 0.1  0.9 0 0 0 -0.38"
                  result="blot"
                />
                <feComposite in="blot" in2="shape" operator="in" result="bl" />
                <feMerge>
                  <feMergeNode in="shape" />
                  <feMergeNode in="bl" />
                  <feMergeNode in="sp" />
                </feMerge>
              </>
            ) : null}
          </filter>
        </defs>
        {path ? (
          <path d={path} fill={color} filter={`url(#e${id})`} />
        ) : (
          <rect x="0" y="0" width="100%" height="100%" fill={color} filter={`url(#e${id})`} />
        )}
      </svg>
      <div style={{ position: "relative", width: "100%", height: "100%" }}>{children}</div>
    </div>
  );
};
