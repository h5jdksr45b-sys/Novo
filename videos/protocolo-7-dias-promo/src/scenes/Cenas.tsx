import {AbsoluteFill} from 'remotion';
import {Background} from '../components/Background';
import {FadeUp} from '../components/FadeUp';
import {Icon} from '../components/Icon';
import {Safe, body, title} from '../components/Layout';
import {COLORS, SAFE_Y, bodyFont} from '../theme';

export const Cena1Crise: React.FC = () => (
  <AbsoluteFill>
    <Background src="fundos/01-corredor.png" overlay={0.5} />
    <Safe justify="flex-start">
      <FadeUp delay={8} style={{...title(104), marginTop: 170}}>
        A crise vem do mesmo jeito.
      </FadeUp>
    </Safe>
  </AbsoluteFill>
);

export const Cena2Plano: React.FC = () => (
  <AbsoluteFill>
    <Background src="fundos/03-textura.png" overlay={0.45} />
    <Safe>
      <Icon name="extra-dentro-de-casa" size={260} delay={6} />
      <FadeUp delay={30} style={{...title(104), marginTop: 70}}>
        Falta um plano.
      </FadeUp>
    </Safe>
  </AbsoluteFill>
);

export const Cena3SeteDias: React.FC = () => (
  <AbsoluteFill>
    <Background src="fundos/03-textura.png" overlay={0.45} />
    {/* 7 e dias apoiados acima da linha vermelha da textura; a frase fica logo abaixo dela */}
    <AbsoluteFill style={{alignItems: 'center'}}>
      <div style={{position: 'absolute', top: 330, width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
        <FadeUp delay={4} style={{...title(600), color: COLORS.red, lineHeight: 0.86}}>
          7
        </FadeUp>
        <FadeUp delay={14} style={{...title(150), marginTop: 6}}>
          dias
        </FadeUp>
      </div>
      <FadeUp delay={28} style={{...body(52), position: 'absolute', top: 1372, width: '100%', textAlign: 'center'}}>
        Um procedimento por dia.
      </FadeUp>
    </AbsoluteFill>
  </AbsoluteFill>
);

export const Cena5Sinais: React.FC = () => (
  <AbsoluteFill>
    <Background src="fundos/03-textura.png" overlay={0.45} />
    <Safe>
      <Icon name="extra-sinais-antes-da-crise" size={260} delay={6} />
      <FadeUp delay={30} style={{...title(96), marginTop: 70}}>
        Antes da crise abrir.
      </FadeUp>
    </Safe>
  </AbsoluteFill>
);

export const Cena6Mensagem: React.FC = () => (
  <AbsoluteFill>
    <Background src="fundos/05-celular.png" overlay={0.5} />
    <Safe justify="flex-start">
      <FadeUp delay={8} style={{...title(96), marginTop: 60}}>
        Por mensagem.
      </FadeUp>
      <FadeUp delay={22} style={{...title(96), marginTop: 12}}>
        De outra cidade.
      </FadeUp>
    </Safe>
  </AbsoluteFill>
);

export const Cena7Voce: React.FC = () => (
  <AbsoluteFill>
    <Background src="fundos/03-textura.png" overlay={0.45} />
    <Safe>
      <FadeUp delay={8} style={title(104)}>
        É sobre o que você faz.
      </FadeUp>
    </Safe>
  </AbsoluteFill>
);

export const Cena8Comecar: React.FC = () => (
  <AbsoluteFill>
    <Background src="fundos/06-fecho.png" overlay={0.45} />
    <Safe justify="space-between">
      <div />
      <FadeUp delay={6} style={title(120)}>
        Comente <span style={{color: COLORS.red}}>COMEÇAR</span>
      </FadeUp>
      <FadeUp
        delay={20}
        style={{fontFamily: bodyFont, fontSize: 27, lineHeight: 1.5, whiteSpace: 'nowrap', color: 'rgba(255,255,255,0.7)', fontWeight: 400, marginBottom: SAFE_Y * 0.25}}
      >
        <div>Conteúdo educativo. Não substitui avaliação nem tratamento.</div>
        <div style={{marginTop: 10}}>Dr. Fabio Schmidt · Médico · CRM-SP 183549</div>
      </FadeUp>
    </Safe>
  </AbsoluteFill>
);
