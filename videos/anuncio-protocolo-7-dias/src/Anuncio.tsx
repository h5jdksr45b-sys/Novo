import React from "react";
import {
  AbsoluteFill,
  Img,
  OffthreadVideo,
  Sequence,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

// Referência: edição rápida em P&B, flashes em negativo, palavras vermelhas em
// serifada aparecendo uma a uma e palavra gigante atrás da pessoa.

const VERMELHO = "#CC0000";
const FUNDO = "#0D0D0D";
const SANS = "Montserrat";
const SERIF = "Playfair";

const fontes = `
@font-face { font-family: ${SANS}; font-weight: 800; src: url(${staticFile("fonts/montserrat-latin-800-normal.woff2")}) format("woff2"); }
@font-face { font-family: ${SANS}; font-weight: 900; src: url(${staticFile("fonts/montserrat-latin-900-normal.woff2")}) format("woff2"); }
@font-face { font-family: ${SERIF}; font-style: italic; font-weight: 800; src: url(${staticFile("fonts/playfair-display-latin-800-italic.woff2")}) format("woff2"); }
@font-face { font-family: ${SERIF}; font-style: italic; font-weight: 900; src: url(${staticFile("fonts/playfair-display-latin-900-italic.woff2")}) format("woff2"); }
`;

// Tratamento das cenas: preto e branco quente, contraste alto.
const PB = "grayscale(1) sepia(0.18) contrast(1.18) brightness(0.88)";
const NEGATIVO = "grayscale(1) invert(1) contrast(1.3)";

// Margens: nada nos 20% de baixo nem colado na lateral direita.
const ESQ = 80;
const DIR = 150;

type Estilo = "sans" | "serif" | "pequeno";

const estiloTexto = (estilo: Estilo, tamanho: number, cor: string): React.CSSProperties => ({
  fontFamily: estilo === "serif" ? SERIF : SANS,
  fontStyle: estilo === "serif" ? "italic" : "normal",
  fontWeight: estilo === "pequeno" ? 800 : 900,
  fontSize: tamanho,
  lineHeight: estilo === "serif" ? 0.95 : 1.05,
  letterSpacing: estilo === "serif" ? -2 : estilo === "pequeno" ? 1 : -1,
  textTransform: estilo === "serif" ? "none" : "uppercase",
  color: cor,
  textShadow: "0 4px 24px rgba(0,0,0,0.55)",
});

// Entrada que desliza: sobe, ganha nitidez e opacidade.
const Texto: React.FC<{
  de: number;
  y: number;
  x?: number;
  estilo?: Estilo;
  tamanho?: number;
  cor?: string;
  alinhar?: "left" | "center";
  children: React.ReactNode;
}> = ({ de, y, x = ESQ, estilo = "sans", tamanho = 64, cor = "#fff", alinhar = "left", children }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = spring({ frame: frame - de, fps, config: { damping: 18, stiffness: 140 } });
  if (frame < de) return null;
  return (
    <div
      style={{
        position: "absolute",
        top: y,
        left: alinhar === "center" ? ESQ : x,
        right: DIR,
        textAlign: alinhar,
        opacity: p,
        transform: `translateY(${(1 - p) * 46}px)`,
        filter: `blur(${(1 - p) * 14}px)`,
        ...estiloTexto(estilo, tamanho, cor),
      }}
    >
      {children}
    </div>
  );
};

// Imagem parada com empurrão lento e um pequeno punch no corte.
const Cena: React.FC<{ src: string; dur: number; filtro?: string; origem?: string }> = ({
  src,
  dur,
  filtro = PB,
  origem = "50% 40%",
}) => {
  const frame = useCurrentFrame();
  const punch = interpolate(frame, [0, 5], [1.07, 1], { extrapolateRight: "clamp" });
  const empurra = interpolate(frame, [0, dur], [1.02, 1.1]);
  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      <Img
        src={staticFile(src)}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          transform: `scale(${punch * empurra})`,
          transformOrigin: origem,
          filter: filtro,
        }}
      />
    </AbsoluteFill>
  );
};

const Flash: React.FC<{ src: string }> = ({ src }) => (
  <AbsoluteFill>
    <OffthreadVideo src={staticFile(src)} muted style={{ filter: NEGATIVO, width: "100%", height: "100%", objectFit: "cover" }} />
  </AbsoluteFill>
);

const FlashBranco: React.FC<{ dur?: number }> = ({ dur = 3 }) => {
  const frame = useCurrentFrame();
  return <AbsoluteFill style={{ background: "#fff", opacity: interpolate(frame, [0, dur], [0.9, 0], { extrapolateRight: "clamp" }) }} />;
};

// Grão de filme animado.
const Grao: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ opacity: 0.16, mixBlendMode: "overlay", pointerEvents: "none" }}>
      <svg width="100%" height="100%">
        <filter id="g">
          <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves={2} seed={frame % 12} />
        </filter>
        <rect width="100%" height="100%" filter="url(#g)" />
      </svg>
    </AbsoluteFill>
  );
};

// Vinheta para segurar a leitura do texto no terço de cima.
const Vinheta: React.FC = () => (
  <AbsoluteFill
    style={{
      background:
        "linear-gradient(180deg, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.1) 45%, rgba(0,0,0,0) 60%, rgba(0,0,0,0.35) 100%)",
    }}
  />
);

// Cozinha: palavra gigante entre o fundo e a pessoa recortada.
const Cozinha: React.FC<{ dur: number }> = ({ dur }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const empurra = interpolate(frame, [0, dur], [1.02, 1.08]);
  const camada: React.CSSProperties = {
    position: "absolute",
    inset: 0,
    width: "100%",
    height: "100%",
    objectFit: "cover",
    transform: `scale(${empurra})`,
    transformOrigin: "50% 70%",
    filter: PB,
  };
  const DE_BRIGA = 66;
  const p = spring({ frame: frame - DE_BRIGA, fps, config: { damping: 20, stiffness: 90 } });
  const palavras = ["conversou.", "explicou.", "cedeu.", "insistiu."];
  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      <Img src={staticFile("s3.png")} style={camada} />
      <Vinheta />
      {frame >= DE_BRIGA && (
        <div
          style={{
            position: "absolute",
            top: 820,
            left: -20,
            right: -20,
            textAlign: "center",
            opacity: p,
            transform: `translateY(${(1 - p) * 60}px) scale(${1.15 - p * 0.15})`,
            ...estiloTexto("serif", 330, VERMELHO),
            textShadow: "none",
          }}
        >
          briga
        </div>
      )}
      <Img src={staticFile("s3_cut.png")} style={camada} />
      <Texto de={2} y={300} estilo="pequeno" tamanho={44}>você</Texto>
      {palavras.map((w, i) => (
        <Texto key={w} de={10 + i * 13} y={370 + i * 92} x={ESQ + (i % 2) * 120} estilo={i % 2 ? "serif" : "sans"} tamanho={i % 2 ? 92 : 76} cor={i % 2 ? VERMELHO : "#fff"}>
          {w}
        </Texto>
      ))}
      <Texto de={DE_BRIGA - 6} y={760} estilo="pequeno" tamanho={48} alinhar="center">e volta a mesma</Texto>
    </AbsoluteFill>
  );
};

const CartaoFinal: React.FC = () => {
  const frame = useCurrentFrame();
  const linha = interpolate(frame, [14, 30], [0, 520], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <AbsoluteFill style={{ background: FUNDO }}>
      <Texto de={2} y={520} estilo="sans" tamanho={96} alinhar="center">Protocolo</Texto>
      <Texto de={8} y={620} estilo="serif" tamanho={210} cor={VERMELHO} alinhar="center">7 Dias</Texto>
      <div style={{ position: "absolute", top: 880, left: (1080 - linha) / 2 - 35, width: linha, height: 3, background: VERMELHO }} />
      <Texto de={16} y={920} estilo="pequeno" tamanho={38} alinhar="center">para quem mora<br />com alguém com borderline</Texto>
      <Texto de={26} y={1130} estilo="serif" tamanho={64} alinhar="center">Dr. Fabio Schmidt</Texto>
      <Texto de={30} y={1215} estilo="pequeno" tamanho={30} cor="#bdbdbd" alinhar="center">médico com foco em TPB</Texto>
      <Texto de={36} y={1320} estilo="pequeno" tamanho={42} alinhar="center">R$219 ou 12x de R$21,90</Texto>
    </AbsoluteFill>
  );
};

// Linha do tempo em quadros (30 fps).
const T = {
  f1: [0, 8],
  olho: [8, 22],
  relogio: [22, 70],
  f2: [70, 76],
  porta: [76, 130],
  cozinha: [130, 252],
  f3: [252, 258],
  corredor: [258, 336],
  sofa: [336, 420],
  manha: [420, 474],
  final: [474, 564],
} as const;

export const DURACAO = T.final[1];

const Seq: React.FC<{ t: readonly [number, number]; children: React.ReactNode }> = ({ t, children }) => (
  <Sequence from={t[0]} durationInFrames={t[1] - t[0]}>
    {children}
  </Sequence>
);

const dur = (t: readonly [number, number]) => t[1] - t[0];

export const Anuncio: React.FC = () => {
  const frame = useCurrentFrame();
  const fadeFinal = interpolate(frame, [DURACAO - 4, DURACAO], [0, 1], { extrapolateLeft: "clamp" });
  return (
    <AbsoluteFill style={{ background: FUNDO }}>
      <style>{fontes}</style>

      <Seq t={T.f1}>
        <Flash src="f1.mp4" />
        <FlashBranco />
      </Seq>

      <Seq t={T.olho}>
        <Cena src="s0.png" dur={dur(T.olho)} origem="50% 50%" />
      </Seq>

      <Seq t={T.relogio}>
        <Cena src="s1.png" dur={dur(T.relogio)} />
        <Vinheta />
        <Texto de={4} y={330} estilo="pequeno" tamanho={52}>três da manhã</Texto>
        <Texto de={16} y={400} estilo="serif" tamanho={170} cor={VERMELHO}>outra vez</Texto>
      </Seq>

      <Seq t={T.f2}>
        <Flash src="f2.mp4" />
      </Seq>

      <Seq t={T.porta}>
        <Cena src="s2.png" dur={dur(T.porta)} origem="50% 60%" />
        <Vinheta />
        <Texto de={3} y={340} estilo="sans" tamanho={96}>a porta fechou</Texto>
        <Texto de={20} y={560} estilo="serif" tamanho={74} cor={VERMELHO}>e você do lado de fora</Texto>
      </Seq>

      <Seq t={T.cozinha}>
        <Cozinha dur={dur(T.cozinha)} />
      </Seq>

      <Seq t={T.f3}>
        <Flash src="f3.mp4" />
      </Seq>

      <Seq t={T.corredor}>
        <Cena src="s4.png" dur={dur(T.corredor)} />
        <Vinheta />
        <Texto de={4} y={320} estilo="pequeno" tamanho={52}>um passo por dia</Texto>
        <Texto de={16} y={380} estilo="serif" tamanho={260} cor={VERMELHO}>7 dias</Texto>
      </Seq>

      <Seq t={T.sofa}>
        <Cena src="s5.png" dur={dur(T.sofa)} filtro="grayscale(0.6) sepia(0.15) contrast(1.1) brightness(0.9)" />
        <Vinheta />
        <Texto de={4} y={300} estilo="pequeno" tamanho={46}>para você começar,</Texto>
        <Texto de={16} y={370} estilo="sans" tamanho={70}>a pessoa com borderline</Texto>
        <Texto de={30} y={560} estilo="sans" tamanho={70}>não precisa</Texto>
        <Texto de={40} y={632} estilo="serif" tamanho={150} cor={VERMELHO}>concordar</Texto>
      </Seq>

      <Seq t={T.manha}>
        <Cena src="s6.png" dur={dur(T.manha)} filtro="grayscale(0.35) contrast(1.05) brightness(0.95)" />
        <FlashBranco dur={5} />
      </Seq>

      <Seq t={T.final}>
        <CartaoFinal />
      </Seq>

      <Grao />
      <AbsoluteFill style={{ background: "#000", opacity: fadeFinal }} />
    </AbsoluteFill>
  );
};
