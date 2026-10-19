import {Easing, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {COLORS, bodyFont, titleFont} from '../theme';

const norm = (w: string) => w.toLowerCase().replace(/[.,]/g, '');

type Props = {
  readonly text: string;
  readonly size: number;
  readonly delay?: number;
  readonly stagger?: number;
  readonly red?: string[]; // palavras com tarja vermelha deslizando por trás
  readonly from?: 1 | -1; // 1 = entra pela direita, -1 = pela esquerda
  readonly exit?: boolean; // sai deslizando antes do corte
  readonly variant?: 'title' | 'body';
  readonly style?: React.CSSProperties;
};

const EXIT = 12;

// Tipografia que desliza: cada palavra entra de lado com inclinação, desfoque de velocidade
// e tracking se fechando; na saída, desliza para o lado oposto.
export const Kinetic: React.FC<Props> = ({text, size, delay = 0, stagger = 3, red = [], from = 1, exit = true, variant = 'title', style}) => {
  const frame = useCurrentFrame();
  const {fps, durationInFrames} = useVideoConfig();
  const reds = red.map(norm);
  const words = text.split(' ');
  const exitStart = durationInFrames - 14 - EXIT; // termina antes da transição
  return (
    <div
      style={{
        fontFamily: variant === 'title' ? titleFont : bodyFont,
        fontWeight: variant === 'title' ? 400 : 500,
        fontSize: size,
        lineHeight: variant === 'title' ? 1.12 : 1.3,
        color: COLORS.white,
        textAlign: 'center',
        textWrap: 'balance',
        textShadow: '0 4px 30px rgba(0,0,0,0.55)',
        ...style,
      }}
    >
      {words.map((w, i) => {
        const s = spring({frame: frame - delay - i * stagger, fps, config: {damping: 17, stiffness: 150, mass: 0.8}});
        const o = exit
          ? interpolate(frame, [exitStart + i * 1.5, exitStart + i * 1.5 + EXIT], [0, 1], {
              extrapolateLeft: 'clamp',
              extrapolateRight: 'clamp',
              easing: Easing.in(Easing.cubic),
            })
          : 0;
        const x = (1 - s) * 260 * from - o * 320 * from;
        const skew = (1 - s) * -16 * from + o * 18 * from;
        const blur = (1 - Math.min(1, s)) * 12 + o * 14;
        const isRed = reds.includes(norm(w));
        const hl = spring({frame: frame - delay - i * stagger - 8, fps, config: {damping: 20, stiffness: 160}});
        return (
          <span
            key={i}
            style={{
              display: 'inline-block',
              position: 'relative',
              margin: `0 ${i < words.length - 1 ? '0.24em' : '0'} 0 0`,
              transform: `translateX(${x}px) skewX(${skew}deg)`,
              filter: `blur(${blur}px)`,
              opacity: Math.min(1, s * 2.5) * (1 - o),
              letterSpacing: `${(1 - s) * 0.14 - 0.015}em`,
            }}
          >
            {isRed && (
              <span
                style={{
                  position: 'absolute',
                  left: '-0.1em',
                  right: '-0.1em',
                  top: '0.12em',
                  bottom: '0.02em',
                  backgroundColor: COLORS.red,
                  transform: `scaleX(${hl})`,
                  transformOrigin: from === 1 ? '0% 50%' : '100% 50%',
                }}
              />
            )}
            <span style={{position: 'relative'}}>{w}</span>
          </span>
        );
      })}
    </div>
  );
};

// Barra vermelha que corre da esquerda para a direita.
export const Rule: React.FC<{readonly delay: number; readonly width: number; readonly style?: React.CSSProperties}> = ({delay, width, style}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const s = spring({frame: frame - delay, fps, config: {damping: 20, stiffness: 120}});
  return <div style={{width: width * s, height: 8, backgroundColor: COLORS.red, borderRadius: 4, ...style}} />;
};

// Tremor curto e determinístico a partir de um frame.
export const useShake = (at: number, dur = 10, amp = 14) => {
  const frame = useCurrentFrame();
  const k = frame - at;
  if (k < 0 || k > dur) return {x: 0, y: 0};
  const decay = 1 - k / dur;
  return {x: Math.sin(k * 2.7) * amp * decay, y: Math.cos(k * 3.3) * amp * 0.7 * decay};
};
