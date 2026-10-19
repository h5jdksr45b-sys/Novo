import {AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {Background} from '../components/Background';
import {Icon} from '../components/Icon';
import {Kinetic, Rule, useShake} from '../components/Kinetic';
import {COLORS, SAFE_X, SAFE_Y, bodyFont, titleFont} from '../theme';

const Center: React.FC<{readonly children: React.ReactNode; readonly top?: number}> = ({children, top}) => (
  <AbsoluteFill
    style={{
      padding: `${SAFE_Y}px ${SAFE_X}px`,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: top === undefined ? 'center' : 'flex-start',
      paddingTop: top ?? SAFE_Y,
    }}
  >
    {children}
  </AbsoluteFill>
);

// Deriva lenta do bloco de texto para nada ficar parado.
const useDrift = (amount = 0.05) => {
  const frame = useCurrentFrame();
  const {durationInFrames} = useVideoConfig();
  return interpolate(frame, [0, durationInFrames], [1, 1 + amount], {extrapolateRight: 'clamp'});
};

const Pop: React.FC<{readonly delay: number; readonly children: React.ReactNode}> = ({delay, children}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const s = spring({frame: frame - delay, fps, config: {damping: 11, stiffness: 160, mass: 0.8}});
  return <div style={{transform: `scale(${0.55 + 0.45 * s}) rotate(${(1 - s) * -12}deg)`, opacity: Math.min(1, s * 2)}}>{children}</div>;
};

export const Cena1Crise: React.FC = () => {
  const d = useDrift();
  return (
    <AbsoluteFill>
      <Background src="fundos/01-corredor.png" overlay={0.48} zoom={[1.0, 1.18]} origin="50% 72%" />
      <Center top={330}>
        <div style={{transform: `scale(${d})`, display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
          <Kinetic text="A crise vem do mesmo jeito." size={112} delay={4} stagger={4} red={['mesmo', 'jeito.']} />
          <Rule delay={34} width={420} style={{marginTop: 40}} />
        </div>
      </Center>
    </AbsoluteFill>
  );
};

export const Cena2Plano: React.FC = () => {
  const d = useDrift();
  return (
    <AbsoluteFill>
      <Background src="fundos/03-textura.png" overlay={0.45} zoom={[1.12, 1.0]} panY={[-40, 20]} />
      <Center>
        <div style={{transform: `scale(${d})`, display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
          <Pop delay={2}>
            <Icon name="extra-dentro-de-casa" size={260} delay={4} />
          </Pop>
          <Kinetic text="Falta um plano." size={118} delay={22} stagger={5} red={['plano.']} style={{marginTop: 70}} />
        </div>
      </Center>
    </AbsoluteFill>
  );
};

export const Cena3SeteDias: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const slam = spring({frame: frame - 2, fps, config: {damping: 12, stiffness: 220, mass: 0.9}});
  const shake = useShake(8, 12, 18);
  const d = useDrift(0.04);
  return (
    <AbsoluteFill style={{transform: `translate(${shake.x}px, ${shake.y}px)`}}>
      <Background src="fundos/03-textura.png" overlay={0.45} zoom={[1.16, 1.02]} />
      <AbsoluteFill style={{alignItems: 'center', transform: `scale(${d})`}}>
        <div style={{position: 'absolute', top: 300, width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
          <div
            style={{
              fontFamily: titleFont,
              fontSize: 620,
              lineHeight: 0.86,
              color: COLORS.red,
              transform: `scale(${interpolate(slam, [0, 1], [2.4, 1])})`,
              opacity: Math.min(1, slam * 3),
              filter: `blur(${(1 - Math.min(1, slam)) * 20}px)`,
            }}
          >
            7
          </div>
          <Kinetic text="dias" size={156} delay={14} from={-1} style={{marginTop: 4}} />
        </div>
        <Kinetic text="Um procedimento por dia." size={54} variant="body" delay={30} stagger={3} style={{position: 'absolute', top: 1372, width: '100%'}} />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

export const Cena5Sinais: React.FC = () => {
  const d = useDrift(0.07);
  return (
    <AbsoluteFill>
      <Background src="fundos/03-textura.png" overlay={0.45} zoom={[1.0, 1.12]} panY={[30, -30]} />
      <Center>
        <div style={{transform: `scale(${d})`, display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
          <Kinetic text="Antes da crise abrir." size={124} delay={4} stagger={5} red={['abrir.']} />
          <Rule delay={34} width={360} style={{marginTop: 44}} />
        </div>
      </Center>
    </AbsoluteFill>
  );
};

export const Cena6Mensagem: React.FC = () => {
  return (
    <AbsoluteFill>
      <Background src="fundos/05-celular.png" overlay={0.48} zoom={[1.18, 1.02]} origin="50% 75%" panY={[60, 0]} />
      <Center top={260}>
        <div style={{width: '100%'}}>
          <Kinetic text="Por mensagem." size={92} delay={4} stagger={4} from={-1} />
        </div>
        <div style={{width: '100%', marginTop: 6}}>
          <Kinetic text="De outra cidade." size={92} delay={16} stagger={4} red={['cidade.']} />
        </div>
      </Center>
    </AbsoluteFill>
  );
};

export const Cena7Voce: React.FC = () => {
  const d = useDrift(0.07);
  return (
    <AbsoluteFill>
      <Background src="fundos/03-textura.png" overlay={0.45} zoom={[1.0, 1.14]} />
      <Center>
        <div style={{transform: `scale(${d})`, display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
          <Kinetic text="É sobre o que você faz." size={120} delay={4} stagger={5} red={['você', 'faz.']} />
          <Rule delay={40} width={360} style={{marginTop: 44}} />
        </div>
      </Center>
    </AbsoluteFill>
  );
};

export const Cena8Comecar: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const shake = useShake(14, 10, 10);
  const letters = 'COMEÇAR'.split('');
  const pulse = 1 + 0.025 * Math.sin(Math.max(0, frame - 40) / 9);
  const foot = spring({frame: frame - 34, fps, config: {damping: 200}});
  return (
    <AbsoluteFill style={{transform: `translate(${shake.x}px, ${shake.y}px)`}}>
      <Background src="fundos/06-fecho.png" overlay={0.45} zoom={[1.12, 1.0]} />
      <Center>
        <Kinetic text="Comente" size={104} delay={2} exit={false} from={-1} />
        <div style={{display: 'flex', marginTop: 6, transform: `scale(${pulse})`}}>
          {letters.map((l, i) => {
            const s = spring({frame: frame - 10 - i * 2, fps, config: {damping: 10, stiffness: 200, mass: 0.6}});
            return (
              <span
                key={i}
                style={{
                  display: 'inline-block',
                  fontFamily: titleFont,
                  fontSize: 150,
                  color: COLORS.red,
                  transform: `translateY(${(1 - s) * 140}px) scale(${0.4 + 0.6 * s})`,
                  opacity: Math.min(1, s * 2),
                  textShadow: '0 6px 30px rgba(0,0,0,0.5)',
                }}
              >
                {l}
              </span>
            );
          })}
        </div>
        <Rule delay={26} width={560} style={{marginTop: 26}} />
      </Center>
      <div
        style={{
          position: 'absolute',
          left: SAFE_X,
          right: SAFE_X,
          bottom: SAFE_Y,
          textAlign: 'center',
          fontFamily: bodyFont,
          fontSize: 27,
          lineHeight: 1.5,
          color: 'rgba(255,255,255,0.7)',
          whiteSpace: 'nowrap',
          opacity: foot,
          transform: `translateY(${(1 - foot) * 20}px)`,
        }}
      >
        <div>Conteúdo educativo. Não substitui avaliação nem tratamento.</div>
        <div style={{marginTop: 10}}>Dr. Fabio Schmidt · Médico · CRM-SP 183549</div>
      </div>
    </AbsoluteFill>
  );
};
