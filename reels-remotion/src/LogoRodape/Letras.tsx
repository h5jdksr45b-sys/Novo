import { interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { Anton } from "../load-font";
import { BRANCO, clamp, letra } from "./shared";

// Texto que entra letra a letra: sobe, perde o desfoque e assenta.
export const Letras: React.FC<{
  texto: string;
  inicio: number;
  tamanho: number;
  cor?: string;
  espaco?: number;
  fonte?: string;
  peso?: number;
}> = ({ texto, inicio, tamanho, cor = BRANCO, espaco = 1, fonte = Anton, peso = 400 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return (
    <span
      style={{
        display: "inline-flex",
        fontFamily: fonte,
        fontWeight: peso,
        fontSize: tamanho,
        letterSpacing: espaco,
        color: cor,
        whiteSpace: "pre",
        lineHeight: 1,
      }}
    >
      {texto.split("").map((ch, i) => {
        const p = letra(frame, fps, i, inicio);
        return (
          <span
            key={i}
            style={{
              display: "inline-block",
              opacity: interpolate(p, [0, 0.6], [0, 1], clamp),
              translate: `0 ${interpolate(p, [0, 1], [tamanho * 0.45, 0])}px`,
              filter: `blur(${interpolate(p, [0, 1], [8, 0], clamp)}px)`,
            }}
          >
            {ch}
          </span>
        );
      })}
    </span>
  );
};
