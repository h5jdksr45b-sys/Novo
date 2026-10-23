import { Composition, Still, staticFile } from "remotion";
import {
  CaptionedVideo,
  calculateCaptionedVideoMetadata,
  captionedVideoSchema,
} from "./CaptionedVideo";
import { ComparacaoLadoALado, comparacaoSchema } from "./ComparacaoLadoALado";
import { MitoApego } from "./MitoApego";
import { MitoRindo } from "./MitoRindo";
import {
  ReelNoir,
  calcularMetadados,
  propsPadrao,
  reelNoirSchema,
} from "./ReelNoir";
import { CapaReelNoir } from "./ReelNoir/Capa";

// Each <Composition> is an entry in the sidebar!

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="ReelNoir"
        component={ReelNoir}
        calculateMetadata={calcularMetadados}
        schema={reelNoirSchema}
        width={1080}
        height={1920}
        fps={30}
        durationInFrames={30 * 70}
        defaultProps={propsPadrao}
      />
      <Still
        id="CapaReelNoir"
        component={CapaReelNoir}
        width={1080}
        height={1920}
        defaultProps={{ corDestaque: "#c83c1e" }}
      />
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
    </>
  );
};
