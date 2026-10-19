import {Composition} from 'remotion';
import {Promo} from './Promo';

export const RemotionRoot: React.FC = () => {
  return (
    <Composition id="Protocolo7Dias" component={Promo} durationInFrames={1065} fps={30} width={1080} height={1920} />
  );
};
