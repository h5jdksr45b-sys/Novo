import { useEffect } from "react";
import { AbsoluteFill, Easing, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { Anton, loadAnton } from "../load-font";
import { BRANCO, CINZA, HANDLE, VERMELHO, entrada, fadeFinal } from "./shared";

// Opção B: dois círculos (cinza e vermelho) entram separados, se encontram e
// formam o selo, que desliza para a esquerda enquanto o @ aparece letra a letra.
// Fundo transparente: renderizar em WebM com alpha ou ProRes 4444.

export const LogoCirculos: React.FC<{ margemInferior?: number }> = ({
  margemInferior = 330,
}) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  useEffect(() => {
    loadAnton();
  }, []);

  const aproxima = spring({ frame, fps, config: { damping: 16, stiffness: 120 } });
  const separacao = interpolate(aproxima, [0, 1], [120, 18]);
  const pop = spring({ frame: frame - 14, fps, config: { damping: 10, stiffness: 160 } });
  const pulso = interpolate(pop, [0, 1], [1.25, 1]);

  const desliza = interpolate(frame, [26, 44], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.7, 0, 0.2, 1),
  });
  const letras = Math.floor(
    interpolate(frame, [32, 62], [0, HANDLE.length], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    }),
  );
  const linha = entrada(frame, 58, 76);
  const opEntrada = entrada(frame, 0, 6);

  const deslocamento = interpolate(desliza, [0, 1], [0, -275]);

  return (
    <AbsoluteFill style={{ opacity: opEntrada * fadeFinal(frame, durationInFrames) }}>
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          bottom: margemInferior,
          height: 110,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            position: "absolute",
            left: 475,
            width: 130,
            height: 90,
            transform: `translateX(${deslocamento}px) scale(${pulso})`,
          }}
        >
          <div
            style={{
              position: "absolute",
              top: 5,
              left: 65 - 40 - separacao / 2,
              width: 80,
              height: 80,
              borderRadius: "50%",
              background: CINZA,
              mixBlendMode: "normal",
            }}
          />
          <div
            style={{
              position: "absolute",
              top: 5,
              left: 65 - 40 + separacao / 2,
              width: 80,
              height: 80,
              borderRadius: "50%",
              background: VERMELHO,
              opacity: 0.92,
            }}
          />
        </div>
        <div
          style={{
            position: "absolute",
            left: 350,
            fontFamily: Anton,
            fontSize: 72,
            letterSpacing: 2,
            color: BRANCO,
            whiteSpace: "pre",
            textShadow: "0 3px 14px rgba(0,0,0,0.55)",
          }}
        >
          {HANDLE.slice(0, letras)}
        </div>
        <div
          style={{
            position: "absolute",
            left: 350,
            top: 96,
            height: 4,
            width: 530 * linha,
            background: VERMELHO,
          }}
        />
      </div>
    </AbsoluteFill>
  );
};
