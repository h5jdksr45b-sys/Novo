import { useEffect } from "react";
import { AbsoluteFill, Easing, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { Anton, loadAnton } from "../load-font";
import { BRANCO, HANDLE, VERMELHO, clamp } from "./shared";

// Logo de rodapé, versão final. Só o mark e a palavra-marca.
// 1. O anel se desenha em tela, girando um pouco até assentar, e para antes de fechar.
// 2. O ponto vermelho cai na abertura com uma mola curta.
// 3. O @ é revelado da esquerda para a direita atrás de uma linha fina vermelha,
//    com o espaçamento entre letras apertando enquanto entra.
// 4. Saída: o anel se recolhe para o ponto, o ponto some, o @ é coberto de volta.
// Fundo transparente: renderizar em WebM com alpha ou ProRes 4444.

const R = 42;
const CIRC = 2 * Math.PI * R;
const ABERTURA = 0.86; // fração do anel que é desenhada
const ANG_PONTO = -60 + 360 * 0.93;
const DESENHO = Easing.bezier(0.65, 0, 0.25, 1);

export const LogoRodape: React.FC<{ margemInferior?: number }> = ({
  margemInferior = 300,
}) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  useEffect(() => {
    loadAnton();
  }, []);

  const fimEntrada = durationInFrames - 18;

  // Entrada
  const traco = interpolate(frame, [0, 28], [0, ABERTURA], { ...clamp, easing: DESENHO });
  const giro = interpolate(frame, [0, 34], [-28, 0], { ...clamp, easing: DESENHO });
  const ponto = spring({ frame: frame - 24, fps, config: { damping: 9, stiffness: 190, mass: 0.6 } });
  const revela = interpolate(frame, [18, 46], [0, 1], { ...clamp, easing: Easing.bezier(0.7, 0, 0.2, 1) });
  const tracking = interpolate(frame, [18, 60], [6, 1.5], { ...clamp, easing: Easing.out(Easing.cubic) });
  const brilho = interpolate(frame, [30, 48], [0, 1], clamp);

  // Saída
  const out = interpolate(frame, [fimEntrada, durationInFrames - 1], [0, 1], {
    ...clamp,
    easing: Easing.bezier(0.7, 0, 0.3, 1),
  });
  const tracoFinal = traco * (1 - out);
  const pontoFinal = interpolate(ponto, [0, 1], [0, 10], clamp) * (1 - interpolate(out, [0.6, 1], [0, 1], clamp));
  const revelaFinal = revela * (1 - out);
  const linhaOp = interpolate(revelaFinal, [0, 0.02, 0.98, 1], [0, 1, 1, 0], clamp);

  const LARGURA_TEXTO = 560;

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
          gap: 24,
        }}
      >
        <svg width={112} height={112} viewBox="0 0 112 112" style={{ overflow: "visible" }}>
          <g transform={`rotate(${giro} 56 56)`}>
            <circle
              cx={56}
              cy={56}
              r={R}
              fill="none"
              stroke={BRANCO}
              strokeWidth={7}
              strokeLinecap="round"
              strokeDasharray={CIRC}
              strokeDashoffset={CIRC * (1 - tracoFinal)}
              transform="rotate(-60 56 56)"
              style={{
                filter: `drop-shadow(0 0 ${interpolate(brilho, [0, 1], [10, 0])}px rgba(255,255,255,0.7)) drop-shadow(0 2px 6px rgba(0,0,0,0.5))`,
              }}
            />
            <circle
              cx={56 + Math.cos((ANG_PONTO * Math.PI) / 180) * R}
              cy={56 + Math.sin((ANG_PONTO * Math.PI) / 180) * R}
              r={pontoFinal}
              fill={VERMELHO}
              style={{
                filter: `drop-shadow(0 0 ${interpolate(ponto, [0, 1], [16, 3], clamp)}px ${VERMELHO})`,
              }}
            />
          </g>
        </svg>

        <div style={{ position: "relative", width: LARGURA_TEXTO, height: 80 }}>
          <div
            style={{
              position: "absolute",
              inset: 0,
              display: "flex",
              alignItems: "center",
              fontFamily: Anton,
              fontSize: 68,
              letterSpacing: tracking,
              color: BRANCO,
              whiteSpace: "pre",
              lineHeight: 1,
              textShadow: "0 2px 14px rgba(0,0,0,0.55)",
              clipPath: `inset(0 ${(1 - revelaFinal) * 100}% 0 0)`,
            }}
          >
            {HANDLE}
          </div>
          <div
            style={{
              position: "absolute",
              top: 8,
              bottom: 8,
              width: 3,
              left: revelaFinal * LARGURA_TEXTO,
              background: VERMELHO,
              opacity: linhaOp,
              boxShadow: `0 0 10px ${VERMELHO}`,
            }}
          />
        </div>
      </div>
    </AbsoluteFill>
  );
};
