import { Composition } from "remotion";
import { Esquema, TOTAL } from "./Esquema";

export const Root = () => (
  <Composition id="Esquema" component={Esquema} durationInFrames={TOTAL} fps={30} width={1080} height={1920} />
);
