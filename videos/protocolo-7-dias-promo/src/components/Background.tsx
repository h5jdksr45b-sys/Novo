import {AbsoluteFill, Img, interpolate, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {COLORS} from '../theme';

type Props = {
  readonly src: string;
  readonly overlay: number; // 0.45 a 0.60
};

// Fundo de apoio: imagem com overlay preto e zoom lento de 1.00 para 1.06 durante a cena.
export const Background: React.FC<Props> = ({src, overlay}) => {
  const frame = useCurrentFrame();
  const {durationInFrames} = useVideoConfig();
  const scale = interpolate(frame, [0, durationInFrames], [1, 1.06], {extrapolateRight: 'clamp'});
  return (
    <AbsoluteFill style={{backgroundColor: COLORS.base, overflow: 'hidden'}}>
      <Img src={staticFile(src)} style={{width: '100%', height: '100%', objectFit: 'cover', transform: `scale(${scale})`}} />
      <AbsoluteFill style={{backgroundColor: `rgba(0,0,0,${overlay})`}} />
      <AbsoluteFill style={{background: 'radial-gradient(ellipse 90% 70% at 50% 45%, transparent 55%, rgba(0,0,0,0.45) 100%)'}} />
    </AbsoluteFill>
  );
};
