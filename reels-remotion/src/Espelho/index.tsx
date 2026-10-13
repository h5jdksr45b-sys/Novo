import { useEffect, useMemo, useState } from "react";
import {
  AbsoluteFill,
  OffthreadVideo,
  Sequence,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useDelayRender,
  useVideoConfig,
} from "remotion";
import { Anton, loadAnton } from "../load-font";
import legendas from "../../public/espelho/legendas.json";
import cortes from "../../public/espelho/cortes.json";
import telas from "../../public/espelho/telas.json";

type Palavra = { text: string; startMs: number; endMs: number };

const AMARELO = "#FFD23F";
const DESTAQUES = [
  "espelho",
  "louco",
  "despersonalização",
  "dissociação",
  "borderline",
  "estresse",
  "estranhamento",
  "emoção",
  "volume",
  "você.",
  "calma",
  "realidade",
  "sempre",
  "nome",
];

const limpa = (t: string) => t.trim().toLowerCase();
const ehDestaque = (t: string) =>
  DESTAQUES.some((d) => limpa(t).replace(/[.,?:]/g, "") === d.replace(/[.,?:]/g, ""));

// Agrupa em páginas de até 3 palavras, quebrando na pontuação.
const paginar = (ps: Palavra[]) => {
  const pages: Palavra[][] = [];
  let atual: Palavra[] = [];
  ps.forEach((p) => {
    atual.push(p);
    if (atual.length === 3 || /[.,?:]$/.test(p.text.trim())) {
      pages.push(atual);
      atual = [];
    }
  });
  if (atual.length) pages.push(atual);
  return pages;
};

const PalavraAnimada: React.FC<{ p: Palavra; inicioPagMs: number }> = ({
  p,
  inicioPagMs,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const tMs = (frame / fps) * 1000 + inicioPagMs;
  const entra = spring({
    frame: frame - ((p.startMs - inicioPagMs) / 1000) * fps,
    fps,
    config: { damping: 14, stiffness: 180 },
    durationInFrames: 8,
  });
  const ativa = tMs >= p.startMs && tMs < p.endMs;
  const destaque = ehDestaque(p.text);
  return (
    <span
      style={{
        display: "inline-block",
        marginRight: 22,
        opacity: entra,
        transform: `translateY(${interpolate(entra, [0, 1], [45, 0])}px) scale(${ativa ? 1.1 : 1})`,
        color: destaque || ativa ? AMARELO : "white",
      }}
    >
      {p.text.trim()}
    </span>
  );
};

const Legendas: React.FC = () => {
  const { fps } = useVideoConfig();
  const pages = useMemo(() => paginar(legendas as Palavra[]), []);
  return (
    <>
      {pages.map((pg, i) => {
        const de = pg[0].startMs;
        const ate = pages[i + 1] ? pages[i + 1][0].startMs : pg[pg.length - 1].endMs + 400;
        const dur = Math.max(1, Math.round(((ate - de) / 1000) * fps));
        return (
          <Sequence key={i} from={Math.round((de / 1000) * fps)} durationInFrames={dur} layout="none">
            <AbsoluteFill style={{ justifyContent: "flex-end", alignItems: "center", paddingBottom: 470 }}>
              <div
                style={{
                  fontFamily: Anton,
                  fontSize: 92,
                  lineHeight: 1.05,
                  textTransform: "uppercase",
                  textAlign: "center",
                  maxWidth: 940,
                  WebkitTextStroke: "14px black",
                  paintOrder: "stroke",
                  textShadow: "0 8px 24px rgba(0,0,0,0.55)",
                }}
              >
                {pg.map((p, j) => (
                  <PalavraAnimada key={j} p={p} inicioPagMs={de} />
                ))}
              </div>
            </AbsoluteFill>
          </Sequence>
        );
      })}
    </>
  );
};

const Tela: React.FC<{ texto: string; durFrames: number }> = ({ texto, durFrames }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const entra = spring({ frame, fps, config: { damping: 16, stiffness: 160 } });
  const sai = interpolate(frame, [durFrames - 6, durFrames], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  return (
    <AbsoluteFill style={{ alignItems: "center", paddingTop: 230 }}>
      <div
        style={{
          fontFamily: Anton,
          fontSize: 70,
          color: "white",
          background: "rgba(10,10,10,0.78)",
          padding: "18px 34px",
          borderRadius: 18,
          borderLeft: `10px solid ${AMARELO}`,
          maxWidth: 900,
          textAlign: "center",
          lineHeight: 1.1,
          opacity: sai,
          transform: `translateX(${interpolate(entra, [0, 1], [-900, 0])}px)`,
        }}
      >
        {texto}
      </div>
    </AbsoluteFill>
  );
};

const Video: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const tMs = (frame / fps) * 1000;
  // soco de zoom curto nas palavras-chave
  const soco = (telas.socos as number[]).reduce((acc, s) => {
    const d = tMs - s;
    if (d < 0 || d > 900) return acc;
    return Math.max(acc, interpolate(d, [0, 120, 900], [0, 0.1, 0.06]));
  }, 0);
  let acc = 0;
  return (
    <>
      {(cortes.keep as [number, number][]).map(([a, b], i) => {
        const from = Math.round(acc * fps);
        const dur = Math.round((b - a) * fps);
        acc += b - a;
        const base = i % 2 === 0 ? 1 : 1.09;
        return (
          <Sequence key={i} from={from} durationInFrames={dur}>
            <SegmentoVideo inicio={a} base={base} extra={soco} dur={dur} />
          </Sequence>
        );
      })}
    </>
  );
};

const SegmentoVideo: React.FC<{ inicio: number; base: number; extra: number; dur: number }> = ({
  inicio,
  base,
  extra,
  dur,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const deriva = interpolate(frame, [0, dur], [0, 0.025]);
  return (
    <AbsoluteFill style={{ overflow: "hidden", backgroundColor: "black" }}>
      <OffthreadVideo
        src={staticFile("espelho/bruto.mp4")}
        trimBefore={Math.round(inicio * fps)}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          transform: `scale(${base + deriva + extra})`,
          transformOrigin: "50% 35%",
        }}
      />
    </AbsoluteFill>
  );
};

export const Espelho: React.FC = () => {
  const { fps } = useVideoConfig();
  const { delayRender, continueRender } = useDelayRender();
  const [handle] = useState(() => delayRender());
  useEffect(() => {
    loadAnton().then(() => continueRender(handle));
  }, [continueRender, handle]);
  return (
    <AbsoluteFill style={{ backgroundColor: "black" }}>
      <Video />
      {(telas.telas as { texto: string; de: number; ate: number }[]).map((t, i) => {
        const from = Math.round((t.de / 1000) * fps);
        const dur = Math.max(1, Math.round(((t.ate - t.de) / 1000) * fps));
        return (
          <Sequence key={i} from={from} durationInFrames={dur} layout="none">
            <Tela texto={t.texto} durFrames={dur} />
          </Sequence>
        );
      })}
      <Legendas />
    </AbsoluteFill>
  );
};

export const espelhoDuracao = (fps: number) => Math.round((cortes.totalCut as number) * fps);
