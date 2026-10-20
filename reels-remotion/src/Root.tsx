import { Composition, Folder, Still, staticFile } from "remotion";
import {
  CaptionedVideo,
  calculateCaptionedVideoMetadata,
  captionedVideoSchema,
} from "./CaptionedVideo";
import {
  ComparacaoLadoALado,
  comparacaoSchema,
} from "./ComparacaoLadoALado";
import { MitoApego } from "./MitoApego";
import { MitoRindo } from "./MitoRindo";
import { DURACAO, FPS, GANCHO_A, IdentidadeReel } from "./IdentidadeReel";
import { CapaIdentidade } from "./IdentidadeReel/Capa";
import {
  DUR_ABERTURA,
  DUR_FECHAMENTO,
  StoryAbertura,
  StoryFechamento,
  StoryLonga,
  StoryQuadrada,
  StorySuspiro,
  duracao,
} from "./StoriesRespiracao";

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
        id="IdentidadeReel"
        component={IdentidadeReel}
        durationInFrames={DURACAO}
        fps={FPS}
        width={1080}
        height={1920}
      />
      <Composition
        id="IdentidadeReelGanchoA"
        component={IdentidadeReel}
        durationInFrames={DURACAO}
        fps={FPS}
        width={1080}
        height={1920}
        defaultProps={{ gancho: GANCHO_A }}
      />
      <Still id="IdentidadeCapa" component={CapaIdentidade} width={1080} height={1920} />
      <Folder name="StoriesRespiracao">
        <Composition
          id="Story1Abertura"
          component={StoryAbertura}
          durationInFrames={DUR_ABERTURA}
          fps={FPS}
          width={1080}
          height={1920}
        />
        <Composition
          id="Story2Suspiro"
          component={StorySuspiro}
          durationInFrames={duracao("suspiro")}
          fps={FPS}
          width={1080}
          height={1920}
        />
        <Composition
          id="Story3Quadrada"
          component={StoryQuadrada}
          durationInFrames={duracao("quadrada")}
          fps={FPS}
          width={1080}
          height={1920}
        />
        <Composition
          id="Story4Longa"
          component={StoryLonga}
          durationInFrames={duracao("longa")}
          fps={FPS}
          width={1080}
          height={1920}
        />
        <Composition
          id="Story5Fechamento"
          component={StoryFechamento}
          durationInFrames={DUR_FECHAMENTO}
          fps={FPS}
          width={1080}
          height={1920}
        />
      </Folder>
    </>
  );
};
