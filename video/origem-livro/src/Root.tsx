import { Composition } from "remotion";
import { Origem, TOTAL } from "./Origem";
import { Trecho2, TOTAL_T2 } from "./Trecho2";

export const Root = () => (
  <>
    <Composition id="Origem" component={Origem} durationInFrames={TOTAL} fps={30} width={1080} height={1920} />
    <Composition id="Trecho2" component={Trecho2} durationInFrames={TOTAL_T2} fps={30} width={1080} height={1920} />
  </>
);
