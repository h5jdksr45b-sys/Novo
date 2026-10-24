import { Composition } from "remotion";
import { Anuncio, DURACAO } from "./Anuncio";

export const Root = () => (
  <Composition
    id="Anuncio"
    component={Anuncio}
    durationInFrames={DURACAO}
    fps={30}
    width={1080}
    height={1920}
  />
);
