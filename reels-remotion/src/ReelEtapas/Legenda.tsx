import React, { useEffect, useState } from "react";
import { continueRender, delayRender, Easing, interpolate, staticFile, useCurrentFrame } from "remotion";
import { Pose, POSE_ZERO, somaPoses, tranco, tremor } from "../Colagem/movimento";
import { CONFIG_FRAME3 } from "../Frame3/config";
import { CONFIG_FRAME4 } from "../Frame4/config";
import dados from "./legenda.json";

// Legenda cinética: até três palavras por vez, cada palavra sobe e assenta
// no seu tempo, o grupo sai subindo quando o próximo entra. Mesmo movimento
// do começo ao fim. Destaque em vermelho com contorno creme, alternando
// serifa itálica e sem serifa. Nas cenas de colagem a legenda treme junto
// com o stop motion e leva os mesmos trancos dos carimbos.

type Palavra = { q: number; t: string; d: boolean; f: "serifa" | "sem" | null };
type Grupo = { ini: number; fim: number; palavras: Palavra[] };

const VERMELHO = "#CC0000";
const CREME = "#F2EADB";
const TAMANHO = 66;
const CENTRO_Y = 1490; // abaixo do queixo nos clones, acima dos botões do Instagram
const LARGURA_MAX = 900;
const AMP = { desloc: 1.6, giro: 0.35 };

let fontesProntas: Promise<void> | null = null;
export const useFontesLegenda = () => {
  const [h] = useState(() => delayRender("Fontes da legenda"));
  useEffect(() => {
    if (!fontesProntas) {
      const fontes = [
        new FontFace("Montserrat", `url('${staticFile("fonts/montserrat.ttf")}')`, { weight: "100 900" }),
        new FontFace("Fraunces", `url('${staticFile("fonts/fraunces-italic.ttf")}')`, {
          weight: "100 900",
          style: "italic",
        }),
      ];
      fontesProntas = Promise.all(fontes.map((f) => f.load())).then((carregadas) => {
        carregadas.forEach((f) => document.fonts.add(f));
      });
    }
    fontesProntas.then(() => continueRender(h)).catch(() => continueRender(h));
  }, [h]);
};

const q3 = (s: number) => Math.round(s * CONFIG_FRAME3.fps);
const q4 = (s: number) => Math.round(s * CONFIG_FRAME4.fps);
const B = dados.blocos as Record<string, number>;
const TOTAL4 = Math.round(CONFIG_FRAME4.fps * CONFIG_FRAME4.duracao);

// Tremor e trancos da legenda conforme a cena por baixo.
const movimentoDaCena = (f: number): Pose => {
  if (f >= B["2"] && f < B["3"]) {
    const l = f - B["2"];
    return somaPoses(tremor("legenda", l, 3, AMP), tranco(l, 99, 8, 5, "leg-quatro"));
  }
  if (f >= B["3"] && f < B["4"]) {
    const l = f - B["3"];
    return l >= q3(CONFIG_FRAME3.tudoPara) ? POSE_ZERO : tremor("legenda", l, 3, AMP);
  }
  if (f >= B["4"] && f < B["5"]) {
    const l = f - B["4"];
    const c = CONFIG_FRAME4;
    if (l >= TOTAL4 - c.semTremorQuadrosFinais) return POSE_ZERO;
    const passo = l >= q4(c.etapa2Arranca) && l < q4(c.limpa) ? 1 : 3;
    return somaPoses(
      tremor("legenda", l, passo, AMP),
      tranco(l, q4(c.agora), 12, 8, "leg-agora"),
      tranco(l, q4(c.circulo), 18, 10, "leg-grito"),
    );
  }
  return POSE_ZERO;
};

const larguraEstimada = (g: Grupo) =>
  g.palavras.reduce((a, p) => a + p.t.length * 0.74 * TAMANHO * (p.d ? 1.32 : 1), 0) +
  (g.palavras.length - 1) * TAMANHO * 0.3;

const PalavraAnimada: React.FC<{ p: Palavra; f: number; saida: number }> = ({ p, f, saida }) => {
  const k = f - p.q;
  const e = interpolate(k, [0, 6], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.back(1.7)),
  });
  const opacidade = interpolate(k, [0, 3], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * (1 - saida);
  const y = (1 - e) * 30 - saida * 20;
  const escala = p.d ? 1.28 - 0.28 * e : 0.9 + 0.1 * e;
  const giro = p.d ? (1 - e) * -4 : 0;
  const estilo: React.CSSProperties = p.d
    ? {
        color: VERMELHO,
        fontSize: TAMANHO * 1.32,
        fontFamily: p.f === "serifa" ? "Fraunces" : "Montserrat",
        fontStyle: p.f === "serifa" ? "italic" : "normal",
        fontVariationSettings: p.f === "serifa" ? '"WONK" 0, "SOFT" 0, "opsz" 72' : undefined,
        fontFeatureSettings: '"calt" 0, "liga" 0',
        fontWeight: 900,
        WebkitTextStroke: `8px ${CREME}`,
        paintOrder: "stroke fill",
        textShadow: "0 5px 12px rgba(0,0,0,0.55)",
        letterSpacing: p.f === "serifa" ? 0 : 0.5,
      }
    : {
        color: "#FFFFFF",
        fontSize: TAMANHO,
        fontFamily: "Montserrat",
        fontWeight: 800,
        textShadow: "0 4px 12px rgba(0,0,0,0.75), 0 0 3px rgba(0,0,0,0.9)",
        letterSpacing: 0.5,
      };
  return (
    <span
      style={{
        display: "inline-block",
        margin: `0 ${TAMANHO * 0.14}px`,
        opacity: opacidade,
        transform: `translateY(${y}px) scale(${escala}) rotate(${giro}deg)`,
        transformOrigin: "50% 70%",
        lineHeight: 1,
        ...estilo,
      }}
    >
      {p.t}
    </span>
  );
};

export const Legenda: React.FC = () => {
  useFontesLegenda();
  const f = useCurrentFrame();
  const g = (dados.grupos as Grupo[]).find((x) => f >= x.ini && f < x.fim);
  if (!g) return null;
  const dur = g.fim - g.ini;
  const lenSaida = Math.max(2, Math.min(4, Math.floor(dur / 3)));
  const saida = interpolate(f, [g.fim - lenSaida, g.fim], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.in(Easing.quad),
  });
  const escala = Math.min(1, LARGURA_MAX / larguraEstimada(g));
  const m = movimentoDaCena(f);
  return (
    <div
      style={{
        position: "absolute",
        left: 0,
        right: 0,
        top: CENTRO_Y - 80,
        height: 160,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        whiteSpace: "nowrap",
        textTransform: "uppercase",
        transform: `translate(${m.x}px, ${m.y}px) rotate(${m.r}deg) scale(${escala})`,
      }}
    >
      {g.palavras.map((p, i) => (
        <PalavraAnimada key={i} p={p} f={f} saida={saida} />
      ))}
    </div>
  );
};
