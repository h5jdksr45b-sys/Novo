import { Composition } from "remotion";
import { Origem, TOTAL } from "./Origem";

export const Root = () => (
  <Composition id="Origem" component={Origem} durationInFrames={TOTAL} fps={30} width={1080} height={1920} />
);
