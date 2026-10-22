import type { Caption } from "@remotion/captions";
import { ALL_FORMATS, Input, UrlSource } from "mediabunny";
import { zColor } from "@remotion/zod-types";
import React, { useEffect } from "react";
import {
  AbsoluteFill,
  CalculateMetadataFunction,
  Sequence,
  getStaticFiles,
  staticFile,
  useVideoConfig,
} from "remotion";
import { z } from "zod";
import { Assinatura } from "./Assinatura";
import { Esquema } from "./Esquema";
import { Enfase, VideoFala, caminhoVideo } from "./Fala";
import { Moldura, PalavraFundo } from "./Editorial";
import { Flash } from "./Flash";
import { carregarFontes } from "./fontes";
import { Grao } from "./Grao";
import { DESLIZE_FRAMES, KenBurns } from "./KenBurns";
import { Legenda } from "./Legenda";
import { CENAS, ETIQUETAS, type CenaFala } from "./roteiro";
import { Sfx } from "./Sfx";
import { Marca, Rotulo, TextoCinetico } from "./TextoCinetico";
import {
  alinharComLegendas,
  estimarTimeline,
  type CenaNoTempo,
  type Timeline,
} from "./timeline";

export const reelNoirSchema = z.object({
  // Take único do Fabio em câmera, em public/ (ex.: "reel-noir/fala.mp4"). null = placa de demonstração.
  videoFala: z.string().nullable(),
  // JSON de legendas gerado por `node sub.mjs public/reel-noir/fala.mp4`. null = tempos estimados.
  legendasJson: z.string().nullable(),
  corDestaque: zColor(),
  pretoEBranco: z.boolean(),
  sfx: z.boolean(),
  volumeSfx: z.number().min(0).max(1),
});

type Props = z.infer<typeof reelNoirSchema> & {
  timeline?: Timeline;
  videoDuracaoMs?: number;
};

const FPS = 30;

export const calcularMetadados: CalculateMetadataFunction<Props> = async ({
  props,
}) => {
  let timeline: Timeline = estimarTimeline(CENAS);
  if (props.legendasJson) {
    const existe = getStaticFiles().some((f) => f.name === props.legendasJson);
    if (existe) {
      const res = await fetch(staticFile(props.legendasJson));
      const captions = (await res.json()) as Caption[];
      if (Array.isArray(captions) && captions.length > 0) {
        timeline = alinharComLegendas(CENAS, captions);
      }
    }
  }
  let videoDuracaoMs: number | undefined;
  if (
    props.videoFala &&
    getStaticFiles().some((f) => f.name === props.videoFala)
  ) {
    // mediabunny lê o contêiner em JavaScript: não depende dos codecs do navegador.
    const entrada = new Input({
      formats: ALL_FORMATS,
      source: new UrlSource(staticFile(props.videoFala)),
    });
    videoDuracaoMs = (await entrada.computeDuration()) * 1000;
  }
  return {
    fps: FPS,
    durationInFrames: Math.ceil((timeline.duracaoMs / 1000) * FPS),
    props: { ...props, timeline, videoDuracaoMs },
  };
};

const paraFrames = (ms: number, fps: number) => Math.round((ms / 1000) * fps);

export const ReelNoir: React.FC<Props> = ({
  videoFala,
  corDestaque,
  pretoEBranco,
  sfx,
  volumeSfx,
  timeline,
  videoDuracaoMs,
}) => {
  const { fps } = useVideoConfig();
  useEffect(() => {
    carregarFontes();
  }, []);
  const tl = timeline ?? estimarTimeline(CENAS);
  const videoExiste = videoFala
    ? getStaticFiles().some((f) => f.name === videoFala)
    : false;
  const cenasFala = tl.cenas.filter((c) => c.tipo === "fala");

  return (
    <AbsoluteFill style={{ background: "#050505" }}>
      {/* Camada 0: o Fabio, take contínuo. O áudio da fala vem daqui e nunca é cortado. */}
      <Sequence
        durationInFrames={
          videoDuracaoMs ? Math.floor((videoDuracaoMs / 1000) * fps) : undefined
        }
        layout="none"
      >
        <VideoFala
          src={videoExiste ? caminhoVideo(videoFala) : null}
          pretoEBranco={pretoEBranco}
          cenas={tl.cenas}
        />
      </Sequence>

      {/* Camada 1: planos que cobrem o Fabio (B-roll, esquema, assinatura). Corte seco. */}
      {tl.cenas.map((cena, i) => {
        const de = paraFrames(cena.inicioMs, fps);
        const anterior = tl.cenas[i - 1];
        const proxima = tl.cenas[i + 1];
        // Entre dois planos de B-roll seguidos o novo entra empurrando o anterior (deslize curto).
        const entraDeslizando =
          cena.tipo === "broll" && anterior?.tipo === "broll";
        const saiEmpurrado = cena.tipo === "broll" && proxima?.tipo === "broll";
        const dur =
          Math.max(1, paraFrames(cena.fimMs, fps) - de) +
          (saiEmpurrado ? DESLIZE_FRAMES : 0);
        if (cena.tipo === "fala") return null;
        return (
          <Sequence
            key={cena.id}
            from={de}
            durationInFrames={dur}
            name={cena.id}
          >
            {cena.tipo === "broll" ? (
              <>
                <KenBurns
                  src={cena.imagem}
                  movimento={cena.movimento}
                  duracaoFrames={dur}
                  pretoEBranco={pretoEBranco}
                  escurecer={cena.posicaoTexto}
                  deslizeEntrada={entraDeslizando}
                  glitch={cena.flashNaEntrada}
                />
                {cena.fundo ? (
                  <PalavraFundo
                    texto={cena.fundo}
                    duracaoFrames={dur}
                    y={cena.posicaoTexto === "alto" ? 1180 : 760}
                  />
                ) : null}
                <TextoCinetico
                  palavras={cena.palavras}
                  inicioCenaMs={cena.inicioMs}
                  posicao={cena.posicaoTexto}
                  destaques={cena.destaques}
                  grandes={cena.grandes}
                  corDestaque={corDestaque}
                />
                {cena.rotulo ? (
                  <Rotulo
                    texto={cena.rotulo.texto}
                    x={cena.rotulo.x}
                    y={cena.rotulo.y}
                    setaPara={cena.rotulo.setaPara}
                    corDestaque={corDestaque}
                    atrasoFrames={Math.round(fps * 0.5)}
                  />
                ) : null}
                {cena.flashNaEntrada ? <Flash /> : null}
              </>
            ) : null}
            {cena.tipo === "esquema" ? (
              <>
                <Esquema
                  palavras={cena.palavras}
                  inicioCenaMs={cena.inicioMs}
                  fimCenaMs={cena.fimMs}
                  corDestaque={corDestaque}
                />
                {cena.fundo ? (
                  <PalavraFundo
                    texto={cena.fundo}
                    duracaoFrames={dur}
                    vazada
                    y={1500}
                  />
                ) : null}
              </>
            ) : null}
            {cena.tipo !== "assinatura" ? (
              <Moldura
                esquerda={ETIQUETAS.esquerda}
                direita={ETIQUETAS.direita}
                rodape={ETIQUETAS.rodape}
              />
            ) : null}
            {cena.tipo === "assinatura" ? <Assinatura /> : null}
          </Sequence>
        );
      })}

      {/* Camada 2: legenda pequena abaixo do queixo, só quando o Fabio está em quadro. */}
      {cenasFala.map((c) => (
        <Legenda
          key={`leg-${c.id}`}
          palavras={tl.palavras}
          ativaDeMs={c.inicioMs}
          ativaAteMs={c.fimMs}
        />
      ))}
      {cenasFala.map((c) => (
        <Enfase
          key={`enf-${c.id}`}
          cena={c as CenaNoTempo & CenaFala}
          corDestaque={corDestaque}
        />
      ))}

      {/* Camada 3: marca d'água, grão e vinheta sobre tudo, menos sobre a assinatura. */}
      <Sequence
        durationInFrames={paraFrames(
          tl.cenas[tl.cenas.length - 1].inicioMs,
          fps,
        )}
      >
        <Marca texto="@drfabioschmidt" />
        <Grao />
      </Sequence>

      {sfx ? (
        <Sfx cenas={tl.cenas} duracaoMs={tl.duracaoMs} volume={volumeSfx} />
      ) : null}
    </AbsoluteFill>
  );
};

export const propsPadrao: z.infer<typeof reelNoirSchema> = {
  videoFala: "reel-noir/fala.mp4",
  legendasJson: "reel-noir/fala.json",
  corDestaque: "#c83c1e",
  pretoEBranco: true,
  sfx: true,
  volumeSfx: 0.5,
};
