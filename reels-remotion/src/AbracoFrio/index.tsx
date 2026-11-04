import React from "react";
import {
  AbsoluteFill,
  Easing,
  OffthreadVideo,
  continueRender,
  delayRender,
  interpolate,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { CAPTIONS, ENFASES, SEGMENTOS, GANCHO } from "./plano";

// Sistema visual da skill editor-profissional:
// Montserrat ExtraBold na legenda e no gancho, Fraunces itálica 900 na ênfase,
// branco com contorno fino e sombra macia, destaque vermelho #CC0000.
const SANS = "MontserratXB";
const SERIF = "FrauncesBI";
const VERMELHO = "#CC0000";
const SOMBRA =
  "0 0 2px rgba(0,0,0,.6), 0 0 1px rgba(0,0,0,.6), 0 4px 14px rgba(0,0,0,.45)";
const EASE_OUT = Easing.bezier(0.22, 1, 0.36, 1);

// Área útil: 7% de margem à esquerda, 12% livres à direita (botões do Instagram).
const ESQ = Math.round(1080 * 0.07);
const DIR = Math.round(1080 * 0.12);
const LARGURA = 1080 - ESQ - DIR;

let fontesCarregadas = false;
const carregarFontes = () => {
  if (fontesCarregadas) return;
  fontesCarregadas = true;
  const h = delayRender("fontes");
  Promise.all([
    new FontFace(SANS, `url('${staticFile("fonts/montserrat-latin-800-normal.woff2")}') format('woff2')`).load(),
    new FontFace(SERIF, `url('${staticFile("fonts/fraunces-latin-900-italic.woff2")}') format('woff2')`, {
      style: "italic",
    }).load(),
  ]).then((fs) => {
    fs.forEach((f) => document.fonts.add(f));
    continueRender(h);
  });
};

// Zoom contínuo (sine.inOut) por trecho entre cortes; punch já entra na escala alta.
const Base: React.FC<{ t: number }> = ({ t }) => {
  const seg = SEGMENTOS.find((s) => t >= s.ini && t < s.fim) ?? SEGMENTOS[SEGMENTOS.length - 1];
  const escala = interpolate(t, [seg.ini, seg.fim], [seg.de, seg.para], {
    easing: Easing.inOut(Easing.sin),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  return (
    <AbsoluteFill style={{ overflow: "hidden", backgroundColor: "#0D0D0D" }}>
      <OffthreadVideo
        src={staticFile("abraco-frio/base.mp4")}
        muted
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          transform: `scale(${escala})`,
          transformOrigin: "50% 38%",
          // clima escuro e quente, saturação levemente reduzida
          filter: "saturate(0.88) contrast(1.06) brightness(0.97) sepia(0.07)",
        }}
      />
      {/* vinheta leve para a legenda ler sobre qualquer fundo */}
      <AbsoluteFill
        style={{
          background:
            "radial-gradient(ellipse 120% 80% at 50% 45%, rgba(0,0,0,0) 55%, rgba(0,0,0,.32) 100%)",
        }}
      />
    </AbsoluteFill>
  );
};

const Gancho: React.FC<{ t: number }> = ({ t }) => {
  if (t >= GANCHO.fim) return null;
  // já visível no quadro 0; só assenta de 1,04 para 1 em 0,25 s
  const s = interpolate(t, [0, 0.25], [1.04, 1], { easing: EASE_OUT, extrapolateRight: "clamp" });
  return (
    <div
      style={{
        position: "absolute",
        top: 175,
        left: ESQ,
        width: LARGURA,
        textAlign: "center",
        transform: `scale(${s})`,
        fontFamily: SANS,
        fontSize: 86,
        whiteSpace: "nowrap",
        lineHeight: 1.04,
        color: "#fff",
        textShadow: SOMBRA,
        letterSpacing: -1,
      }}
    >
      {GANCHO.linhas.map((l, i) => (
        <div key={i} style={{ color: l.vermelho ? VERMELHO : "#fff" }}>
          {l.texto}
        </div>
      ))}
    </div>
  );
};

const Legenda: React.FC<{ t: number }> = ({ t }) => {
  const idx = CAPTIONS.findIndex((p, i) => {
    const fim = p.fim ?? CAPTIONS[i + 1]?.palavras[0].t ?? 99;
    return t >= p.palavras[0].t && t < fim;
  });
  if (idx < 0) return null;
  const p = CAPTIONS[idx];
  // uma linha só: reduz o corpo quando a fala é longa, em vez de quebrar
  const larguraEm = p.palavras.reduce((a, w) => a + w.w.length * 0.74 * (w.d ? 1.16 : 1), 0) + (p.palavras.length - 1) * 0.3;
  const corpo = Math.min(74, Math.floor(LARGURA / larguraEm));
  const fim = p.fim ?? CAPTIONS[idx + 1]?.palavras[0].t ?? 99;
  const saida = interpolate(t, [fim - 0.08, fim], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  return (
    <div
      style={{
        position: "absolute",
        top: 1236,
        left: ESQ,
        width: LARGURA,
        display: "flex",
        flexWrap: "nowrap",
        whiteSpace: "nowrap",
        justifyContent: "center",
        alignItems: "baseline",
        columnGap: 20,
        rowGap: 0,
        opacity: saida,
        fontFamily: SANS,
        fontSize: 74,
        lineHeight: 1.08,
        letterSpacing: -0.5,
        textTransform: "uppercase",
        textWrap: "balance",
      }}
    >
      {p.palavras.map((w, i) => {
        const k = interpolate(t, [w.t, w.t + 0.12], [0, 1], {
          easing: EASE_OUT,
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        });
        return (
          <span
            key={i}
            style={{
              display: "inline-block",
              opacity: k,
              transform: `translateY(${(1 - k) * 18}px)`,
              color: w.d ? VERMELHO : "#fff",
              fontSize: w.d ? Math.round(corpo * 1.16) : corpo,
              textShadow: SOMBRA,
            }}
          >
            {w.w}
          </span>
        );
      })}
    </div>
  );
};

const Enfase: React.FC<{ t: number }> = ({ t }) => {
  const e = ENFASES.find((x) => t >= x.ini && t < x.fim);
  if (!e) return null;
  const k = interpolate(t, [e.ini, e.ini + 0.22], [0, 1], {
    easing: EASE_OUT,
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const out = interpolate(t, [e.fim - 0.12, e.fim], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  // respiração mínima enquanto parado, para o texto não ficar morto
  const deriva = interpolate(t, [e.ini, e.fim], [1, 1.03], { extrapolateRight: "clamp" });
  const tamanho = Math.min(210, Math.floor(LARGURA / (e.grande.length * 0.66)));
  const kc = e.comp
    ? interpolate(t, [e.compT, e.compT + 0.16], [0, 1], {
        easing: EASE_OUT,
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      })
    : 0;
  return (
    <div
      style={{
        position: "absolute",
        top: e.centro ? 700 : 250,
        left: ESQ,
        width: LARGURA,
        textAlign: "center",
        opacity: k * out,
        transform: `scale(${(0.92 + 0.08 * k) * deriva})`,
        transformOrigin: "50% 50%",
      }}
    >
      <div
        style={{
          fontFamily: SERIF,
          fontStyle: "italic",
          fontSize: tamanho,
          lineHeight: 0.95,
          color: "#fff",
          textShadow: SOMBRA,
          letterSpacing: -2,
        }}
      >
        {e.grande}
      </div>
      {e.comp ? (
        <div
          style={{
            marginTop: 14,
            fontFamily: SANS,
            fontSize: 56,
            color: "#fff",
            textShadow: SOMBRA,
            opacity: kc,
            transform: `translateY(${(1 - kc) * 14}px)`,
          }}
        >
          {e.comp}
        </div>
      ) : null}
    </div>
  );
};

export const AbracoFrio: React.FC = () => {
  carregarFontes();
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const t = frame / fps;
  const dur = durationInFrames / fps;
  // flash branco de 0,1 s na saída do primeiro b-roll
  const flash = interpolate(t, [6.4667, 6.5, 6.5667], [0.85, 0.5, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const preto = interpolate(t, [dur - 0.1, dur - 1 / fps], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  return (
    <AbsoluteFill style={{ backgroundColor: "#0D0D0D" }}>
      <Base t={t} />
      <Gancho t={t} />
      <Enfase t={t} />
      <Legenda t={t} />
      {t >= 6.4667 && t < 6.5667 ? <AbsoluteFill style={{ backgroundColor: "#fff", opacity: flash }} /> : null}
      <AbsoluteFill style={{ backgroundColor: "#000", opacity: preto }} />
    </AbsoluteFill>
  );
};
