import { Composition, staticFile } from "remotion";
import {
  CaptionedVideo,
  calculateCaptionedVideoMetadata,
  captionedVideoSchema,
} from "./CaptionedVideo";
import { ComparacaoLadoALado, comparacaoSchema } from "./ComparacaoLadoALado";
import { MitoApego } from "./MitoApego";
import { MitoRindo } from "./MitoRindo";
import { VerdadeOuMito } from "./VerdadeOuMito";
import { Reacao, calculateReacaoMetadata, reacaoSchema } from "./Reacao";

// Each <Composition> is an entry in the sidebar!

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="CaptionedVideo"
        component={CaptionedVideo}
        calculateMetadata={calculateCaptionedVideoMetadata}
        schema={captionedVideoSchema}
        width={1080}
        height={1920}
        defaultProps={{
          src: staticFile("sample-video.mp4"),
        }}
      />
      <Composition
        id="ComparacaoLadoALado"
        component={ComparacaoLadoALado}
        schema={comparacaoSchema}
        durationInFrames={360}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={{
          rotuloEsquerda: "Lado A",
          rotuloDireita: "Lado B",
          corDestaque: "#c83c1e",
        }}
      />
      <Composition
        id="MitoRindo"
        component={MitoRindo}
        durationInFrames={450}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="MitoApego"
        component={MitoApego}
        durationInFrames={450}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="VerdadeOuMito"
        component={VerdadeOuMito}
        durationInFrames={1315}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="Reacao"
        component={Reacao}
        calculateMetadata={calculateReacaoMetadata}
        schema={reacaoSchema}
        width={1080}
        height={1920}
        fps={30}
        durationInFrames={210}
        defaultProps={{
          src: "reacao-gelo.mp4",
          duracaoMs: 6433,
          linhas: [
            {
              texto: "Você espera a raiva baixar para não ferir ninguém.",
              inicio: 0,
            },
            {
              texto: "E ouve que está dando gelo.",
              inicio: 2600,
              destaque: true,
            },
          ],
        }}
      />
    </>
  );
};
