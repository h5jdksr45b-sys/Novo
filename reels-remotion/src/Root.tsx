import { Composition, staticFile } from "remotion";
import {
  CaptionedVideo,
  calculateCaptionedVideoMetadata,
  captionedVideoSchema,
} from "./CaptionedVideo";
import { ComparacaoLadoALado, comparacaoSchema } from "./ComparacaoLadoALado";
import { MitoApego } from "./MitoApego";
import { MitoRindo } from "./MitoRindo";
import { FuncaoDoComportamento } from "./FuncaoDoComportamento";
import { PCLRDados, pclrSchema } from "./PCLRDados";

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
        id="FuncaoDoComportamento"
        component={FuncaoDoComportamento}
        durationInFrames={900}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="PCLRDados"
        component={PCLRDados}
        schema={pclrSchema}
        durationInFrames={1284}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={{
          fonte:
            "Fonte: Robitaille et al., 2017. Borderline Personality Disorder and Emotion Dysregulation, 4:25.",
        }}
      />
    </>
  );
};
