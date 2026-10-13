import { useEffect } from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { Anton, loadAnton } from "../load-font";
import { Letras } from "./Letras";
import { BRANCO, CINZA, HANDLE, SUBLINHA, VERMELHO, clamp, entrada, saida } from "./shared";

// Opção B, "Selo": um anel se desenha em tela, deixa uma abertura, e um
// ponto vermelho ocupa a abertura. O @ entra letra a letra ao lado e a linha
// de crédito aparece embaixo. Sai encolhendo com leve desfoque.
// Fundo transparente: renderizar em WebM com alpha ou ProRes 4444.

const R = 44;
const CIRC = 2 * Math.PI * R;

export const LogoCirculos: React.FC<{ margemInferior?: number }> = ({
  margemInferior = 300,
}) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  useEffect(() => {
    loadAnton();
  }, []);

  const out = saida(frame, durationInFrames);
  const traco = entrada(frame, 0, 26, 0, 0.86);
  const ponto = spring({ frame: frame - 20, fps, config: { damping: 11, stiffness: 180 } });
  const pulso = spring({ frame: frame - 32, fps, config: { damping: 8, stiffness: 120 } });
  const credito = entrada(frame, 40, 56);
  const brilhoAnel = interpolate(frame, [22, 40, 58], [0, 1, 0], clamp);

  return (
    <AbsoluteFill>
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          bottom: margemInferior,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          gap: 26,
          opacity: 1 - out,
          scale: `${1 - out * 0.08}`,
          filter: `blur(${out * 6}px)`,
        }}
      >
        <svg width={120} height={120} viewBox="0 0 120 120" style={{ overflow: "visible" }}>
          <circle
            cx={60}
            cy={60}
            r={R}
            fill="none"
            stroke={BRANCO}
            strokeWidth={7}
            strokeLinecap="round"
            strokeDasharray={CIRC}
            strokeDashoffset={CIRC * (1 - traco)}
            transform="rotate(-60 60 60)"
            style={{ filter: `drop-shadow(0 0 ${brilhoAnel * 10}px rgba(255,255,255,0.6))` }}
          />
          <circle
            cx={60 + Math.cos(((-60 + 360 * 0.93) * Math.PI) / 180) * R}
            cy={60 + Math.sin(((-60 + 360 * 0.93) * Math.PI) / 180) * R}
            r={interpolate(ponto, [0, 1], [0, 11], clamp) * interpolate(pulso, [0, 1], [1.2, 1], clamp)}
            fill={VERMELHO}
            style={{ filter: `drop-shadow(0 0 ${interpolate(pulso, [0, 1], [14, 4])}px ${VERMELHO})` }}
          />
        </svg>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          <Letras texto={HANDLE} inicio={14} tamanho={70} espaco={1.5} />
          <div
            style={{
              fontFamily: Anton,
              fontSize: 22,
              letterSpacing: 5,
              color: CINZA,
              opacity: credito,
              translate: `0 ${(1 - credito) * 10}px`,
              textShadow: "0 2px 10px rgba(0,0,0,0.6)",
            }}
          >
            {SUBLINHA}
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};
