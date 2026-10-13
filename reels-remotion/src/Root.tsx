import { Composition, Folder, staticFile } from "remotion";
import { Reel7Dias } from "./Reel7Dias";
import { ReelPorta } from "./ReelPorta";
import {
  BuscaScene,
  OutroLadoScene,
  PortaBateScene,
  SeteDiasScene,
  TresCartoesScene,
} from "./ReelPorta/Scenes";
import {
  CaptionedVideo,
  calculateCaptionedVideoMetadata,
  captionedVideoSchema,
} from "./CaptionedVideo";

// Each <Composition> is an entry in the sidebar!

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="ReelPorta"
        component={ReelPorta}
        width={1080}
        height={1920}
        fps={30}
        durationInFrames={420}
      />
      <Folder name="ReelPorta-cenas">
        <Composition
          id="Cena1Busca"
          component={BuscaScene}
          width={1080}
          height={1920}
          fps={30}
          durationInFrames={75}
          defaultProps={{ text: "Você já leu tudo sobre borderline." }}
        />
        <Composition
          id="Cena2TresCartoes"
          component={TresCartoesScene}
          width={1080}
          height={1920}
          fps={30}
          durationInFrames={75}
          defaultProps={{
            text: "O diagnóstico. Os sintomas. O que ela sente.",
          }}
        />
        <Composition
          id="Cena3PortaBate"
          component={PortaBateScene}
          width={1080}
          height={1920}
          fps={30}
          durationInFrames={90}
          defaultProps={{
            text: "Nada dizia o que fazer quando a porta bate.",
          }}
        />
        <Composition
          id="Cena4OutroLado"
          component={OutroLadoScene}
          width={1080}
          height={1920}
          fps={30}
          durationInFrames={90}
          defaultProps={{
            text: "O Protocolo 7 Dias foi feito para quem fica do outro lado da porta.",
          }}
        />
        <Composition
          id="Cena5SeteDias"
          component={SeteDiasScene}
          width={1080}
          height={1920}
          fps={30}
          durationInFrames={90}
          defaultProps={{ text: "Um procedimento por dia." }}
        />
      </Folder>
      <Composition
        id="Reel7Dias"
        component={Reel7Dias}
        width={1080}
        height={1920}
        fps={30}
        durationInFrames={420}
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
    </>
  );
};
