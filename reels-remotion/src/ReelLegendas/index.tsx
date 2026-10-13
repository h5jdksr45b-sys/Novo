import { Video } from "@remotion/media";
import {
  AbsoluteFill,
  CalculateMetadataFunction,
  useVideoConfig,
} from "remotion";
import { ALL_FORMATS, Input, UrlSource } from "mediabunny";
import { z } from "zod";
import { LegendaCinetica } from "./LegendaCinetica";

// Reel com legenda cinética. O vídeo fica em public/reel-legendas.webm.
// As legendas estão inline no nó <LegendaCinetica> para o editor de legendas
// do Studio conseguir escrever de volta no código.
//
// enfases: pares de ms (início, fim). Dentro dessas janelas a legenda vira
// texto grande. Fora delas, fica pequena abaixo do queixo.

export const reelLegendasSchema = z.object({
  src: z.string(),
});

export const calculateReelLegendasMetadata: CalculateMetadataFunction<
  z.infer<typeof reelLegendasSchema>
> = async ({ props }) => {
  const fps = 30;
  const input = new Input({
    formats: ALL_FORMATS,
    source: new UrlSource(props.src),
  });
  const durationInSeconds = await input.computeDuration();
  return {
    fps,
    durationInFrames: Math.floor(durationInSeconds * fps),
  };
};

export const ReelLegendas: React.FC<z.infer<typeof reelLegendasSchema>> = ({
  src,
}) => {
  const { fps } = useVideoConfig();

  return (
    <AbsoluteFill style={{ backgroundColor: "black" }}>
      <Video
        name="Vídeo"
        src={src}
        premountFor={fps}
        objectFit="cover"
        style={{ width: "100%", height: "100%" }}
      />
      <LegendaCinetica
        name="Legenda cinética"
        premountFor={fps}
        corDestaque="#c83c1e"
        topoPequena={1260}
        topoGrande={980}
        enfases={[15760, 18080, 18480, 19520, 21520, 24600]}
        captions={[
            {
              text: " Meninos",
              startMs: 480,
              endMs: 1280,
              timestampMs: 880,
              confidence: null,
            },
            {
              text: " venham",
              startMs: 1280,
              endMs: 1760,
              timestampMs: 1520,
              confidence: null,
            },
            {
              text: " aqui!",
              startMs: 1760,
              endMs: 2670,
              timestampMs: 2215,
              confidence: null,
            },
            {
              text: " Filho,",
              startMs: 7920,
              endMs: 8720,
              timestampMs: 8320,
              confidence: null,
            },
            {
              text: " fala",
              startMs: 8720,
              endMs: 9200,
              timestampMs: 8960,
              confidence: null,
            },
            {
              text: " se",
              startMs: 9200,
              endMs: 9360,
              timestampMs: 9280,
              confidence: null,
            },
            {
              text: " eu",
              startMs: 9360,
              endMs: 9440,
              timestampMs: 9400,
              confidence: null,
            },
            {
              text: " não",
              startMs: 9440,
              endMs: 9520,
              timestampMs: 9480,
              confidence: null,
            },
            {
              text: " tenho",
              startMs: 9520,
              endMs: 9760,
              timestampMs: 9640,
              confidence: null,
            },
            {
              text: " razão.",
              startMs: 9760,
              endMs: 10160,
              timestampMs: 9960,
              confidence: null,
            },
            {
              text: " Peraí,",
              startMs: 10160,
              endMs: 10640,
              timestampMs: 10400,
              confidence: null,
            },
            {
              text: " mas",
              startMs: 10640,
              endMs: 10880,
              timestampMs: 10760,
              confidence: null,
            },
            {
              text: " eu",
              startMs: 10880,
              endMs: 11040,
              timestampMs: 10960,
              confidence: null,
            },
            {
              text: " também",
              startMs: 11040,
              endMs: 11360,
              timestampMs: 11200,
              confidence: null,
            },
            {
              text: " tenho.",
              startMs: 11360,
              endMs: 12670,
              timestampMs: 12015,
              confidence: null,
            },
            {
              text: " Vocês",
              startMs: 13280,
              endMs: 13680,
              timestampMs: 13480,
              confidence: null,
            },
            {
              text: " percebem",
              startMs: 13680,
              endMs: 14160,
              timestampMs: 13920,
              confidence: null,
            },
            {
              text: " o",
              startMs: 14160,
              endMs: 14240,
              timestampMs: 14200,
              confidence: null,
            },
            {
              text: " que",
              startMs: 14240,
              endMs: 14400,
              timestampMs: 14320,
              confidence: null,
            },
            {
              text: " estão",
              startMs: 14400,
              endMs: 14560,
              timestampMs: 14480,
              confidence: null,
            },
            {
              text: " fazendo?",
              startMs: 14560,
              endMs: 15280,
              timestampMs: 14920,
              confidence: null,
            },
            {
              text: " Vocês",
              startMs: 15280,
              endMs: 15600,
              timestampMs: 15440,
              confidence: null,
            },
            {
              text: " são",
              startMs: 15600,
              endMs: 15760,
              timestampMs: 15680,
              confidence: null,
            },
            {
              text: " os",
              startMs: 15760,
              endMs: 15840,
              timestampMs: 15800,
              confidence: null,
            },
            {
              text: " dois",
              startMs: 15840,
              endMs: 16080,
              timestampMs: 15960,
              confidence: null,
            },
            {
              text: " maiores",
              startMs: 16080,
              endMs: 16400,
              timestampMs: 16240,
              confidence: null,
            },
            {
              text: " exemplos",
              startMs: 16400,
              endMs: 16720,
              timestampMs: 16560,
              confidence: null,
            },
            {
              text: " de",
              startMs: 16720,
              endMs: 16800,
              timestampMs: 16760,
              confidence: null,
            },
            {
              text: " amor",
              startMs: 16800,
              endMs: 17120,
              timestampMs: 16960,
              confidence: null,
            },
            {
              text: " que",
              startMs: 17120,
              endMs: 17200,
              timestampMs: 17160,
              confidence: null,
            },
            {
              text: " a",
              startMs: 17200,
              endMs: 17280,
              timestampMs: 17240,
              confidence: null,
            },
            {
              text: " gente",
              startMs: 17280,
              endMs: 17440,
              timestampMs: 17360,
              confidence: null,
            },
            {
              text: " tem.",
              startMs: 17440,
              endMs: 18080,
              timestampMs: 17760,
              confidence: null,
            },
            {
              text: " Estão",
              startMs: 18080,
              endMs: 18480,
              timestampMs: 18280,
              confidence: null,
            },
            {
              text: " um",
              startMs: 18480,
              endMs: 18720,
              timestampMs: 18600,
              confidence: null,
            },
            {
              text: " contra",
              startMs: 18720,
              endMs: 18960,
              timestampMs: 18840,
              confidence: null,
            },
            {
              text: " o",
              startMs: 18960,
              endMs: 19040,
              timestampMs: 19000,
              confidence: null,
            },
            {
              text: " outro,",
              startMs: 19040,
              endMs: 19520,
              timestampMs: 19280,
              confidence: null,
            },
            {
              text: " apontando",
              startMs: 19520,
              endMs: 20160,
              timestampMs: 19840,
              confidence: null,
            },
            {
              text: " e",
              startMs: 20160,
              endMs: 20240,
              timestampMs: 20200,
              confidence: null,
            },
            {
              text: " pedindo",
              startMs: 20240,
              endMs: 20640,
              timestampMs: 20440,
              confidence: null,
            },
            {
              text: " a",
              startMs: 20640,
              endMs: 20720,
              timestampMs: 20680,
              confidence: null,
            },
            {
              text: " nossa",
              startMs: 20720,
              endMs: 20960,
              timestampMs: 20840,
              confidence: null,
            },
            {
              text: " opinião.",
              startMs: 20960,
              endMs: 21520,
              timestampMs: 21240,
              confidence: null,
            },
            {
              text: " A",
              startMs: 21520,
              endMs: 21680,
              timestampMs: 21600,
              confidence: null,
            },
            {
              text: " gente",
              startMs: 21680,
              endMs: 21920,
              timestampMs: 21800,
              confidence: null,
            },
            {
              text: " não",
              startMs: 21920,
              endMs: 22000,
              timestampMs: 21960,
              confidence: null,
            },
            {
              text: " sabe",
              startMs: 22000,
              endMs: 22320,
              timestampMs: 22160,
              confidence: null,
            },
            {
              text: " o",
              startMs: 22320,
              endMs: 22400,
              timestampMs: 22360,
              confidence: null,
            },
            {
              text: " que",
              startMs: 22400,
              endMs: 22640,
              timestampMs: 22520,
              confidence: null,
            },
            {
              text: " dizer.",
              startMs: 22640,
              endMs: 23780,
              timestampMs: 23210,
              confidence: null,
            },
        ]}
      />
    </AbsoluteFill>
  );
};
