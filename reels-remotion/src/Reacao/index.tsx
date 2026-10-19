import { useEffect } from "react";
import {
  AbsoluteFill,
  Audio,
  CalculateMetadataFunction,
  OffthreadVideo,
  Sequence,
  staticFile,
  useVideoConfig,
} from "remotion";
import { z } from "zod";
import { useAnimeTimeline } from "../anime/useAnimeTimeline";
import { Anton, loadAnton } from "../load-font";

// Reel de reação em silêncio: o Dr. Fabio só olha e reage, o texto carrega
// a situação. Uma ou duas linhas entram em momentos marcados pelo gesto.
// Tempos em milissegundos. A duração vem do vídeo (duracaoMs).

export const reacaoSchema = z.object({
  src: z.string(),
  duracaoMs: z.number(),
  linhas: z
    .array(
      z.object({
        texto: z.string(),
        inicio: z.number(),
        destaque: z.boolean().optional(),
      }),
    )
    .min(1)
    .max(2),
});

type Props = z.infer<typeof reacaoSchema>;

export const calculateReacaoMetadata: CalculateMetadataFunction<Props> = ({
  props,
}) => ({
  durationInFrames: Math.round((props.duracaoMs / 1000) * 30),
  fps: 30,
  width: 1080,
  height: 1920,
});

const VERMELHO = "#c83c1e";

const texto: React.CSSProperties = {
  position: "absolute",
  left: 80,
  right: 80,
  textAlign: "center",
  opacity: 0,
  lineHeight: 1.05,
};

export const Reacao: React.FC<Props> = ({ src, linhas }) => {
  useEffect(() => {
    loadAnton();
  }, []);

  const { fps } = useVideoConfig();

  const ref = useAnimeTimeline((tl, $) => {
    const entra = { opacity: [0, 1], y: [40, 0], duration: 450 };
    linhas.forEach((l, i) => {
      tl.add($(`.l${i}`), entra, Math.max(0, l.inicio));
    });
    tl.add($(".assinatura"), { opacity: [0, 1], duration: 400 }, 300);
  });

  return (
    <AbsoluteFill
      ref={ref}
      style={{
        backgroundColor: "#050505",
        color: "white",
        fontFamily: Anton,
        textTransform: "uppercase",
      }}
    >
      <OffthreadVideo
        src={staticFile(src)}
        muted
        style={{ width: "100%", height: "100%", objectFit: "cover" }}
      />
      <AbsoluteFill
        style={{
          background:
            "linear-gradient(to bottom, rgba(5,5,5,0.88) 0%, rgba(5,5,5,0.72) 30%, rgba(5,5,5,0) 50%, rgba(5,5,5,0) 78%, rgba(5,5,5,0.55) 100%)",
        }}
      />

      {linhas.map((l) => (
        <Sequence
          key={l.texto}
          from={Math.round((Math.max(0, l.inicio - 120) / 1000) * fps)}
          layout="none"
        >
          <Audio src={staticFile("sfx/whoosh.wav")} volume={0.25} />
        </Sequence>
      ))}

      {linhas.map((l, i) => (
        <div
          key={l.texto}
          className={`l${i}`}
          style={{
            ...texto,
            top: i === 0 ? 260 : 620,
            fontSize: i === 0 ? (l.texto.length > 60 ? 74 : 86) : 66,
            display: l.destaque ? "flex" : "block",
            justifyContent: "center",
          }}
        >
          {l.destaque ? (
            <div
              style={{
                background: VERMELHO,
                color: "white",
                padding: "6px 34px 2px",
                transform: "rotate(-2deg)",
                boxShadow: "0 10px 30px rgba(0,0,0,0.45)",
                maxWidth: 900,
              }}
            >
              {l.texto}
            </div>
          ) : (
            l.texto
          )}
        </div>
      ))}

      <div
        className="assinatura"
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          bottom: 150,
          textAlign: "center",
          fontSize: 30,
          color: "rgba(255,255,255,0.6)",
          fontFamily: "sans-serif",
          textTransform: "none",
          textShadow: "0 1px 6px rgba(0,0,0,0.8)",
          opacity: 0,
        }}
      >
        Dr. Fabio Schmidt, médico, CRM-SP 183549
      </div>
    </AbsoluteFill>
  );
};
