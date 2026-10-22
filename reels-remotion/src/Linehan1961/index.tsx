import type { Caption } from "@remotion/captions";
import { zColor } from "@remotion/zod-types";
import React, { useEffect } from "react";
import { AbsoluteFill, CalculateMetadataFunction, Sequence, getStaticFiles, staticFile, useVideoConfig } from "remotion";
import { z } from "zod";
import { Assinatura } from "./Assinatura";
import { Esquema } from "./Esquema";
import { VideoFala, caminhoVideo } from "./Fala";
import { Flash } from "./Flash";
import { carregarFontes } from "./fontes";
import { Grao } from "./Grao";
import { KenBurns } from "./KenBurns";
import { Legenda } from "./Legenda";
import { CENAS } from "./roteiro";
import { Sfx } from "./Sfx";
import { Rotulo, TextoCinetico } from "./TextoCinetico";
import { alinharComLegendas, estimarTimeline, type Timeline } from "./timeline";

export const reelLinehanSchema = z.object({
  // Take único do Fabio em câmera, em public/ (ex.: "linehan/fala.mp4"). null = placa de demonstração.
  videoFala: z.string().nullable(),
  // JSON de legendas gerado por `node sub.mjs public/linehan/fala.mp4`. null = tempos estimados.
  legendasJson: z.string().nullable(),
  corDestaque: zColor(),
  pretoEBranco: z.boolean(),
  sfx: z.boolean(),
  volumeSfx: z.number().min(0).max(1),
});

type Props = z.infer<typeof reelLinehanSchema> & { timeline?: Timeline };

const FPS = 30;

export const calcularMetadados: CalculateMetadataFunction<Props> = async ({ props }) => {
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
  return {
    fps: FPS,
    durationInFrames: Math.ceil((timeline.duracaoMs / 1000) * FPS),
    props: { ...props, timeline },
  };
};

const paraFrames = (ms: number, fps: number) => Math.round((ms / 1000) * fps);

export const ReelLinehan: React.FC<Props> = ({ videoFala, corDestaque, pretoEBranco, sfx, volumeSfx, timeline }) => {
  const { fps } = useVideoConfig();
  useEffect(() => {
    carregarFontes();
  }, []);
  const tl = timeline ?? estimarTimeline(CENAS);
  const videoExiste = videoFala ? getStaticFiles().some((f) => f.name === videoFala) : false;
  const cenasFala = tl.cenas.filter((c) => c.tipo === "fala");

  return (
    <AbsoluteFill style={{ background: "#050505" }}>
      {/* Camada 0: o Fabio, take contínuo. O áudio da fala vem daqui e nunca é cortado. */}
      <VideoFala src={videoExiste ? caminhoVideo(videoFala) : null} pretoEBranco={pretoEBranco} cenas={tl.cenas} />

      {/* Camada 1: planos que cobrem o Fabio (B-roll, esquema, assinatura). Corte seco. */}
      {tl.cenas.map((cena) => {
        const de = paraFrames(cena.inicioMs, fps);
        const dur = Math.max(1, paraFrames(cena.fimMs, fps) - de);
        if (cena.tipo === "fala") return null;
        return (
          <Sequence key={cena.id} from={de} durationInFrames={dur} name={cena.id}>
            {cena.tipo === "broll" ? (
              <>
                <KenBurns
                  src={cena.imagem}
                  movimento={cena.movimento}
                  duracaoFrames={dur}
                  pretoEBranco={pretoEBranco}
                  escurecer={cena.posicaoTexto}
                />
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
              <Esquema palavras={cena.palavras} inicioCenaMs={cena.inicioMs} fimCenaMs={cena.fimMs} corDestaque={corDestaque} />
            ) : null}
            {cena.tipo === "assinatura" ? <Assinatura /> : null}
          </Sequence>
        );
      })}

      {/* Camada 2: legenda pequena abaixo do queixo, só quando o Fabio está em quadro. */}
      {cenasFala.map((c) => (
        <Legenda key={`leg-${c.id}`} palavras={tl.palavras} ativaDeMs={c.inicioMs} ativaAteMs={c.fimMs} />
      ))}

      {/* Camada 3: grão e vinheta sobre tudo, menos sobre a assinatura. */}
      <Sequence durationInFrames={paraFrames(tl.cenas[tl.cenas.length - 1].inicioMs, fps)}>
        <Grao />
      </Sequence>

      {sfx ? <Sfx cenas={tl.cenas} duracaoMs={tl.duracaoMs} volume={volumeSfx} /> : null}
    </AbsoluteFill>
  );
};

export const propsPadrao: z.infer<typeof reelLinehanSchema> = {
  videoFala: "linehan/fala.mp4",
  legendasJson: "linehan/fala.json",
  corDestaque: "#c83c1e",
  pretoEBranco: true,
  sfx: true,
  volumeSfx: 0.5,
};
