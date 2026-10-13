import type { Caption } from "@remotion/captions";
import { createTikTokStyleCaptions } from "@remotion/captions";
import React, { useEffect, useMemo } from "react";
import {
  Interactive,
  spring,
  useCurrentFrame,
  useVideoConfig,
  type InteractivitySchema,
} from "remotion";
import { Anton, loadAnton } from "../load-font";

// Legenda cinética: as palavras entram uma a uma, no instante em que são
// faladas. A palavra falada ganha fundo colorido. Fora das ênfases a legenda
// é pequena e fica abaixo do queixo. Dentro de uma janela de ênfase a mesma
// legenda vira texto grande.

type Props = {
  readonly captions: Caption[];
  // Pares de milissegundos: início, fim, início, fim...
  readonly enfases: number[];
  readonly corDestaque: string;
  readonly topoPequena: number;
  readonly topoGrande: number;
};

const MAX_PALAVRAS_POR_PAGINA = 4;
const SILENCIO_QUE_QUEBRA_MS = 600;
const SEGURAR_ULTIMA_PAGINA_MS = 400;

const estaEmEnfase = (ms: number, enfases: number[]) => {
  for (let i = 0; i + 1 < enfases.length; i += 2) {
    if (ms >= enfases[i] && ms < enfases[i + 1]) {
      return true;
    }
  }
  return false;
};

const LegendaCineticaInner: React.FC<Props> = ({
  captions,
  enfases,
  corDestaque,
  topoPequena,
  topoGrande,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const tempoMs = (frame / fps) * 1000;

  useEffect(() => {
    loadAnton();
  }, []);

  const paginas = useMemo(() => {
    // Quebra de página: pontuação final, troca entre pequena e grande,
    // silêncio ou limite de palavras.
    let palavrasNaPagina = 0;
    const comQuebras: Caption[] = captions.map((c, i) => {
      palavrasNaPagina += 1;
      const proxima = captions[i + 1];
      const fimDeFrase = /[.!?]$/.test(c.text.trim());
      const trocaDeModo =
        proxima !== undefined &&
        estaEmEnfase(c.startMs, enfases) !==
          estaEmEnfase(proxima.startMs, enfases);
      const silencio =
        proxima !== undefined &&
        proxima.startMs - c.endMs > SILENCIO_QUE_QUEBRA_MS;
      const cheia = palavrasNaPagina >= MAX_PALAVRAS_POR_PAGINA;
      const quebra = fimDeFrase || trocaDeModo || silencio || cheia;
      if (quebra) {
        palavrasNaPagina = 0;
      }
      return { ...c, pageBreakAfter: quebra };
    });

    const { pages } = createTikTokStyleCaptions({
      captions: comQuebras,
      combineTokensWithinMilliseconds: 2500,
    });

    return pages.map((p, i) => {
      const ultimoToken = p.tokens[p.tokens.length - 1];
      const fimDasPalavras = ultimoToken ? ultimoToken.toMs : p.startMs;
      const proxima = pages[i + 1];
      const fimMs =
        proxima && proxima.startMs - fimDasPalavras < 1500
          ? proxima.startMs
          : fimDasPalavras + SEGURAR_ULTIMA_PAGINA_MS;
      return {
        ...p,
        fimMs,
        grande: estaEmEnfase(p.startMs, enfases),
      };
    });
  }, [captions, enfases]);

  const pagina = paginas.find((p) => tempoMs >= p.startMs && tempoMs < p.fimMs);

  if (!pagina) {
    return null;
  }

  const quadroDaPagina = Math.round((pagina.startMs / 1000) * fps);
  const entradaDaPagina = spring({
    frame: frame - quadroDaPagina + 1,
    fps,
    config: { damping: 18, stiffness: 180, mass: 0.7 },
    durationInFrames: 10,
  });

  const grande = pagina.grande;

  return (
    <div
      style={{
        position: "absolute",
        left: 70,
        right: 70,
        top: grande ? topoGrande : topoPequena,
        display: "flex",
        flexWrap: "wrap",
        justifyContent: "center",
        alignItems: "center",
        rowGap: grande ? 8 : 4,
        fontFamily: Anton,
        textTransform: "uppercase",
        fontSize: grande ? 108 : 54,
        lineHeight: 1,
        letterSpacing: grande ? 1 : 0.5,
        color: "white",
        textAlign: "center",
        opacity: entradaDaPagina,
        translate: `0px ${(1 - entradaDaPagina) * 18}px`,
      }}
    >
      {pagina.tokens.map((t, i) => {
        const proximo = pagina.tokens[i + 1];
        const fimDaAtividade = proximo ? proximo.fromMs : pagina.fimMs;
        const ativa = tempoMs >= t.fromMs && tempoMs < fimDaAtividade;
        const quadroDaPalavra = Math.round((t.fromMs / 1000) * fps);
        const local = frame - quadroDaPalavra;
        // A palavra só entra no layout quando é falada. Assim o bloco
        // fica sempre centralizado no que já foi dito.
        if (local < 0) {
          return null;
        }
        const entrada = spring({
          frame: local + 1,
          fps,
          config: { damping: 11, stiffness: 260, mass: 0.5 },
          durationInFrames: 9,
        });
        return (
          <span
            key={`${t.fromMs}-${i}`}
            style={{
              display: "inline-block",
              whiteSpace: "pre",
              padding: grande ? "6px 16px" : "4px 10px",
              borderRadius: grande ? 16 : 10,
              backgroundColor: ativa ? corDestaque : "transparent",
              scale: String(0.55 + 0.45 * entrada),
              WebkitTextStroke: ativa
                ? "0px transparent"
                : grande
                  ? "7px rgba(0,0,0,0.85)"
                  : "4px rgba(0,0,0,0.85)",
              paintOrder: "stroke fill",
              textShadow: ativa ? "none" : "0 3px 14px rgba(0,0,0,0.7)",
              boxShadow: ativa ? "0 6px 24px rgba(0,0,0,0.45)" : "none",
            }}
          >
            {t.text.trim().replace(/[,.;:]+$/, "")}
          </span>
        );
      })}
    </div>
  );
};

const legendaCineticaSchema = {
  ...Interactive.captionsSchema,
  enfases: {
    type: "array",
    item: { type: "number", min: 0, step: 10, integer: true },
    default: [],
    newItemDefault: 0,
    description: "Janelas de texto grande em ms (início, fim, início, fim...)",
  },
  corDestaque: {
    type: "color",
    default: "#c83c1e",
    description: "Cor da palavra falada",
  },
  topoPequena: {
    type: "number",
    default: 1260,
    min: 0,
    max: 1920,
    step: 10,
    description: "Topo da legenda pequena (px)",
    hiddenFromList: false,
  },
  topoGrande: {
    type: "number",
    default: 980,
    min: 0,
    max: 1920,
    step: 10,
    description: "Topo do texto grande (px)",
    hiddenFromList: false,
  },
} as const satisfies InteractivitySchema;

export const LegendaCinetica = Interactive.withSchema({
  Component: LegendaCineticaInner,
  componentName: "LegendaCinetica",
  schema: legendaCineticaSchema,
  wrapInSequence: true,
  layout: "absolute-fill",
});
