import {Composition} from 'remotion';
import {Reel, DURACAO} from './Reel';
export const Root = () => (
  <Composition id="Reel" component={Reel} durationInFrames={DURACAO} fps={30} width={1080} height={1920} />
);
