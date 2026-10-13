import { useEffect } from "react";
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { Anton, loadAnton } from "../load-font";
import { Letras } from "./Letras";
import { CINZA, FIRME, HANDLE, SUBLINHA, VERMELHO, clamp, entrada, saida } from "./shared";

// Opção A, "Terço inferior": uma faixa de vidro escuro desliza da esquerda,
// a aresta vermelha cresce, o @ entra letra a letra e a linha de crédito
// aparece embaixo. Sai deslizando de volta.
// Fundo transparente: renderizar em WebM com alpha ou ProRes 4444.

export const LogoBarra: React.FC<{ margemInferior?: number }> = ({
  margemInferior = 300,
}) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  useEffect(() => {
    loadAnton();
  }, []);

  const out = saida(frame, durationInFrames);
  const faixa = entrada(frame, 0, 22);
  const aresta = entrada(frame, 4, 20);
  const credito = entrada(frame, 34, 50);
  const brilho = interpolate(frame, [26, 54], [-40, 140], { ...clamp, easing: FIRME });

  return (
    <AbsoluteFill>
      <div
        style={{
          position: "absolute",
          left: 72,
          bottom: margemInferior,
          height: 150,
          width: 700,
          overflow: "hidden",
          borderRadius: 6,
          opacity: 1 - out,
          translate: `${interpolate(faixa, [0, 1], [-60, 0]) - out * 60}px 0`,
          clipPath: `inset(0 ${(1 - faixa) * 100}% 0 0)`,
          background: "rgba(8, 8, 8, 0.55)",
          backdropFilter: "blur(14px)",
          WebkitBackdropFilter: "blur(14px)",
          boxShadow: "0 12px 40px rgba(0,0,0,0.35)",
        }}
      >
        <div
          style={{
            position: "absolute",
            left: 0,
            top: 0,
            width: 8,
            height: "100%",
            background: VERMELHO,
            transformOrigin: "top",
            scale: `1 ${aresta}`,
          }}
        />
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: `linear-gradient(105deg, transparent ${brilho - 14}%, rgba(255,255,255,0.14) ${brilho}%, transparent ${brilho + 14}%)`,
            pointerEvents: "none",
          }}
        />
        <div style={{ position: "absolute", left: 40, top: 26 }}>
          <Letras texto={HANDLE} inicio={10} tamanho={66} espaco={1.5} />
        </div>
        <div
          style={{
            position: "absolute",
            left: 42,
            top: 104,
            fontFamily: Anton,
            fontSize: 22,
            letterSpacing: 5,
            color: CINZA,
            opacity: credito,
            translate: `0 ${(1 - credito) * 10}px`,
          }}
        >
          {SUBLINHA}
        </div>
      </div>
    </AbsoluteFill>
  );
};
