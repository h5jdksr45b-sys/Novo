import React from "react";
import {
  AbsoluteFill,
  Audio,
  Img,
  Sequence,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import {
  CalendarCheck,
  Check,
  Clock,
  EyeOff,
  Handshake,
  HeartHandshake,
  Lightbulb,
  MessageCircle,
  MessageCircleHeart,
  MousePointerClick,
  Repeat,
  ShieldCheck,
  Timer,
  VolumeX,
  type LucideIcon,
} from "lucide-react";

// Referência: cortes a cada meio segundo, P&B, flashes em negativo, uma palavra
// gigante por corte, vermelho em serifada, palavra atrás da pessoa.

const VERMELHO = "#CC0000";
const FUNDO = "#0D0D0D";
const SANS = "Montserrat";
const SERIF = "Playfair";

const fontes = `
@font-face { font-family: ${SANS}; font-weight: 800; src: url(${staticFile("fonts/montserrat-latin-800-normal.woff2")}) format("woff2"); }
@font-face { font-family: ${SANS}; font-weight: 900; src: url(${staticFile("fonts/montserrat-latin-900-normal.woff2")}) format("woff2"); }
@font-face { font-family: ${SERIF}; font-style: italic; font-weight: 900; src: url(${staticFile("fonts/playfair-display-latin-900-italic.woff2")}) format("woff2"); }
`;

const pb = (luz = 1.1) => `grayscale(1) sepia(0.12) contrast(1.15) brightness(${luz})`;
const NEGATIVO = "grayscale(1) invert(1) contrast(1.4)";

// ---------- Imagem ----------

type Quadro = { src: string; zoom?: number; ox?: number; oy?: number; luz?: number; cor?: boolean };

// Um corte: enquadramento próprio, punch de entrada e tremida leve.
const Corte: React.FC<Quadro & { dur: number; tremida?: boolean }> = ({
  src,
  zoom = 1,
  ox = 50,
  oy = 50,
  luz = 1.1,
  cor = false,
  dur,
  tremida = true,
}) => {
  const frame = useCurrentFrame();
  const punch = interpolate(frame, [0, 4], [1.12, 1], { extrapolateRight: "clamp" });
  const deriva = interpolate(frame, [0, dur], [1, 1.06]);
  const tx = tremida ? Math.sin(frame * 1.7) * 3 : 0;
  const ty = tremida ? Math.cos(frame * 1.3) * 3 : 0;
  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      <Img
        src={staticFile(src)}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          transformOrigin: `${ox}% ${oy}%`,
          transform: `translate(${tx}px, ${ty}px) scale(${zoom * punch * deriva})`,
          filter: cor ? `sepia(0.1) contrast(1.05) brightness(${luz})` : pb(luz),
        }}
      />
    </AbsoluteFill>
  );
};

const Negativo: React.FC<{ src: string; zoom?: number; ox?: number; oy?: number }> = ({ src, zoom = 1.3, ox = 50, oy = 50 }) => (
  <AbsoluteFill style={{ overflow: "hidden", background: "#fff" }}>
    <Img
      src={staticFile(src)}
      style={{ width: "100%", height: "100%", objectFit: "cover", transformOrigin: `${ox}% ${oy}%`, transform: `scale(${zoom})`, filter: NEGATIVO }}
    />
  </AbsoluteFill>
);

// Vazamento de luz quente na entrada do corte.
const Luz: React.FC = () => {
  const frame = useCurrentFrame();
  const op = interpolate(frame, [0, 6], [0.55, 0], { extrapolateRight: "clamp" });
  return (
    <AbsoluteFill
      style={{
        opacity: op,
        mixBlendMode: "screen",
        background: "radial-gradient(circle at 15% 20%, rgba(255,140,60,0.9), rgba(204,0,0,0.35) 40%, transparent 70%)",
      }}
    />
  );
};

const Sombra: React.FC = () => (
  <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 45%, rgba(0,0,0,0) 35%, rgba(0,0,0,0.55) 100%)" }} />
);

const Grao: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ opacity: 0.18, mixBlendMode: "overlay", pointerEvents: "none" }}>
      <svg width="100%" height="100%">
        <filter id="g">
          <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves={2} seed={frame % 12} />
        </filter>
        <rect width="100%" height="100%" filter="url(#g)" />
      </svg>
    </AbsoluteFill>
  );
};

// ---------- Texto ----------

type Estilo = "sans" | "serif";

// Palavra gigante centralizada, do tamanho da largura útil.
const Gigante: React.FC<{
  texto: string;
  estilo?: Estilo;
  cor?: string;
  y?: number;
  max?: number;
  de?: number;
  sombra?: boolean;
}> = ({ texto, estilo = "sans", cor = "#fff", y = 760, max = 300, de = 0, sombra = true }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = spring({ frame: frame - de, fps, config: { damping: 15, stiffness: 220 } });
  if (frame < de) return null;
  const largura = 900;
  const porLetra = estilo === "serif" ? 0.52 : 0.74;
  const tamanho = Math.min(max, largura / (texto.length * porLetra));
  return (
    <div
      style={{
        position: "absolute",
        top: y,
        left: 40,
        right: 40,
        textAlign: "center",
        whiteSpace: "nowrap",
        fontFamily: estilo === "serif" ? SERIF : SANS,
        fontStyle: estilo === "serif" ? "italic" : "normal",
        fontWeight: 900,
        textTransform: estilo === "serif" ? "none" : "uppercase",
        fontSize: tamanho,
        lineHeight: 1,
        letterSpacing: estilo === "serif" ? -3 : -2,
        color: cor,
        opacity: p,
        transform: `translateY(-50%) scale(${1.25 - p * 0.25})`,
        filter: `blur(${(1 - p) * 16}px)`,
        textShadow: sombra ? "0 6px 40px rgba(0,0,0,0.6)" : "none",
      }}
    >
      {texto}
    </div>
  );
};

// Linha pequena de apoio, centralizada.
const Apoio: React.FC<{ texto: string; y: number; de?: number; cor?: string; tamanho?: number }> = ({
  texto,
  y,
  de = 0,
  cor = "#fff",
  tamanho = 46,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = spring({ frame: frame - de, fps, config: { damping: 18, stiffness: 160 } });
  if (frame < de) return null;
  return (
    <div
      style={{
        position: "absolute",
        top: y,
        left: 60,
        right: 60,
        textAlign: "center",
        fontFamily: SANS,
        fontWeight: 800,
        fontSize: tamanho,
        letterSpacing: 2,
        textTransform: "uppercase",
        color: cor,
        opacity: p,
        transform: `translateY(${(1 - p) * 30}px)`,
        textShadow: "0 4px 24px rgba(0,0,0,0.7)",
      }}
    >
      {texto}
    </div>
  );
};

// Ícone grande em círculo, entra com mola.
const IconeGrande: React.FC<{ Icone: LucideIcon; y: number; tam?: number; de?: number; fundo?: string }> = ({
  Icone,
  y,
  tam = 170,
  de = 0,
  fundo = VERMELHO,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = spring({ frame: frame - de, fps, config: { damping: 11, stiffness: 200 } });
  if (frame < de) return null;
  return (
    <div
      style={{
        position: "absolute",
        top: y,
        left: (1080 - tam) / 2,
        width: tam,
        height: tam,
        borderRadius: tam,
        background: fundo,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        transform: `scale(${p}) rotate(${(1 - p) * -20}deg)`,
        boxShadow: "0 16px 50px rgba(0,0,0,0.45)",
      }}
    >
      <Icone size={tam * 0.52} color="#fff" strokeWidth={2.2} />
    </div>
  );
};

const Toque: React.FC<{ de: number; x: number; y: number }> = ({ de, x, y }) => {
  const frame = useCurrentFrame();
  const f = frame - de;
  if (f < 0 || f > 22) return null;
  const onda = interpolate(f, [4, 22], [60, 260], { extrapolateLeft: "clamp" });
  const op = interpolate(f, [4, 22], [0.8, 0], { extrapolateLeft: "clamp" });
  const dedo = interpolate(f, [0, 4, 10], [90, 66, 78], { extrapolateRight: "clamp" });
  return (
    <>
      <div style={{ position: "absolute", left: x - onda / 2, top: y - onda / 2, width: onda, height: onda, borderRadius: onda, border: "5px solid #fff", opacity: op }} />
      <div style={{ position: "absolute", left: x - dedo / 2, top: y - dedo / 2, width: dedo, height: dedo, borderRadius: dedo, background: "rgba(255,255,255,0.8)", opacity: f < 14 ? 1 : 0 }} />
    </>
  );
};

// ---------- Blocos ----------

// Os sete dias do Protocolo, um ícone por procedimento.
const DIAS: LucideIcon[] = [MessageCircleHeart, ShieldCheck, Timer, Clock, VolumeX, CalendarCheck, HeartHandshake];

const Semana: React.FC<{ de: number; y: number }> = ({ de, y }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const tam = 122;
  const gap = 12;
  const x0 = (1080 - (7 * tam + 6 * gap)) / 2;
  return (
    <>
      {DIAS.map((Icone, i) => {
        const p = spring({ frame: frame - de - i * 3, fps, config: { damping: 11, stiffness: 220 } });
        const marcado = frame >= de + 24 + i * 3;
        return (
          <div key={i} style={{ position: "absolute", left: x0 + i * (tam + gap), top: y, width: tam, textAlign: "center", opacity: frame >= de + i * 3 ? 1 : 0 }}>
            <div
              style={{
                width: tam,
                height: tam,
                borderRadius: 30,
                background: marcado ? VERMELHO : "rgba(15,15,15,0.7)",
                border: marcado ? "none" : "3px solid rgba(255,255,255,0.4)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                transform: `scale(${p})`,
              }}
            >
              <Icone size={62} color="#fff" strokeWidth={2.2} />
            </div>
            <div style={{ fontFamily: SANS, fontWeight: 800, fontSize: 28, color: "#fff", marginTop: 12, textTransform: "uppercase" }}>dia {i + 1}</div>
          </div>
        );
      })}
    </>
  );
};

// Palavra gigante entre a foto e a pessoa recortada.
const AtrasDaPessoa: React.FC<{ dur: number }> = ({ dur }) => {
  const frame = useCurrentFrame();
  const deriva = interpolate(frame, [0, dur], [1.04, 1.12]);
  const camada: React.CSSProperties = {
    position: "absolute",
    inset: 0,
    width: "100%",
    height: "100%",
    objectFit: "cover",
    transformOrigin: "50% 55%",
    transform: `scale(${deriva})`,
    filter: pb(1.15),
  };
  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      <Img src={staticFile("s3.png")} style={camada} />
      <Sombra />
      <Apoio texto="e volta a mesma" y={470} />
      <Gigante texto="briga" estilo="serif" cor={VERMELHO} y={740} max={360} de={3} sombra={false} />
      <Img src={staticFile("s3_cut.png")} style={camada} />
    </AbsoluteFill>
  );
};

const CartaoFinal: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const botao = spring({ frame: frame - 26, fps, config: { damping: 12, stiffness: 180 } });
  return (
    <AbsoluteFill style={{ background: FUNDO }}>
      <Apoio texto="protocolo" y={420} tamanho={84} />
      <Gigante texto="7 Dias" estilo="serif" cor={VERMELHO} y={640} max={300} de={4} />
      <Apoio texto="para quem mora" y={810} tamanho={38} de={10} />
      <Apoio texto="com alguém com borderline" y={862} tamanho={38} de={10} />
      <Apoio texto="R$219 ou 12x de R$21,90" y={1000} tamanho={48} de={16} />
      <Apoio texto="garantia de 7 dias" y={1070} tamanho={32} cor="#bdbdbd" de={18} />
      {frame >= 26 && (
        <div
          style={{
            position: "absolute",
            top: 1180,
            left: 290,
            width: 500,
            height: 110,
            borderRadius: 110,
            background: VERMELHO,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 20,
            transform: `scale(${botao})`,
            fontFamily: SANS,
            fontWeight: 900,
            fontSize: 44,
            color: "#fff",
            textTransform: "uppercase",
          }}
        >
          <MousePointerClick size={50} color="#fff" strokeWidth={2.4} />
          saiba mais
        </div>
      )}
      <Toque de={44} x={540} y={1235} />
      <Apoio texto="Dr. Fabio Schmidt · médico com foco em TPB" y={1340} tamanho={26} cor="#9a9a9a" de={20} />
    </AbsoluteFill>
  );
};

// ---------- Linha do tempo ----------

type Item = { dur: number; el: React.ReactNode };


const roteiro: Item[] = [
  // Narração 1: Três da manhã. De novo.
  { dur: 4, el: <Negativo src="s0.png" zoom={1.6} oy={45} /> },
  { dur: 23, el: (<><Corte src="s0.png" zoom={1.9} ox={52} oy={45} dur={23} /><Sombra /><Gigante texto="três da manhã" y={1350} max={110} de={2} /></>) },
  { dur: 6, el: (<><Corte src="s1.png" zoom={2.1} ox={60} oy={18} luz={1.6} dur={6} /><Luz /></>) },
  { dur: 20, el: (<><Corte src="s1.png" zoom={1.15} ox={55} oy={30} luz={1.5} dur={20} /><Sombra /><Gigante texto="outra vez" estilo="serif" cor={VERMELHO} y={900} max={260} /></>) },
  { dur: 3, el: <Negativo src="s2.png" /> },
  // Narração 2: A porta fechou. E você ficou do lado de fora.
  { dur: 13, el: (<><Corte src="s2.png" zoom={1.05} luz={1.35} dur={13} /><Sombra /><Gigante texto="a porta" y={520} max={210} /></>) },
  { dur: 16, el: (<><Corte src="s2.png" zoom={2.2} luz={1.4} dur={16} /><Sombra /><Gigante texto="fechou" estilo="serif" cor={VERMELHO} y={760} max={300} /></>) },
  { dur: 51, el: (<><Corte src="s4.png" zoom={1.35} ox={30} oy={45} luz={1.25} dur={51} /><Luz /><Sombra /><Apoio texto="e você" y={480} /><Gigante texto="do lado de fora" estilo="serif" cor={VERMELHO} y={640} max={150} de={6} /></>) },
  // Narração 3: Você conversou. Explicou. Cedeu. Insistiu.
  { dur: 36, el: (<><Corte src="s3.png" zoom={1.1} luz={1.2} dur={36} /><Luz /><Sombra /><IconeGrande Icone={MessageCircle} y={420} /><Gigante texto="conversou" y={720} /></>) },
  { dur: 24, el: (<><Corte src="s3.png" zoom={2.4} ox={15} oy={12} luz={1.2} dur={24} /><Sombra /><IconeGrande Icone={Lightbulb} y={420} fundo="#fff2" /><Gigante texto="explicou" estilo="serif" cor={VERMELHO} y={720} /></>) },
  { dur: 21, el: (<><Corte src="s3.png" zoom={2.6} ox={15} oy={72} luz={1.2} dur={21} /><Sombra /><IconeGrande Icone={Handshake} y={420} /><Gigante texto="cedeu" y={720} /></>) },
  { dur: 24, el: (<><Corte src="s3.png" zoom={1.8} ox={55} oy={55} luz={1.2} dur={24} /><Sombra /><IconeGrande Icone={Repeat} y={420} fundo="#fff2" /><Gigante texto="insistiu" estilo="serif" cor={VERMELHO} y={720} /></>) },
  { dur: 3, el: <Negativo src="s3.png" zoom={1.1} /> },
  // Narração 4: E volta a mesma briga.
  { dur: 52, el: <AtrasDaPessoa dur={52} /> },
  { dur: 4, el: <Negativo src="s4.png" /> },
  // Narração 5: O Protocolo Sete Dias é um passo por dia, feito por você.
  { dur: 57, el: (<><Corte src="s4.png" zoom={1.05} luz={1.2} dur={57} tremida={false} /><Sombra /><Gigante texto="7 dias" estilo="serif" cor={VERMELHO} y={500} max={330} /><Semana de={8} y={760} /></>) },
  { dur: 31, el: (<><Corte src="s4.png" zoom={2} ox={70} oy={88} luz={1.3} dur={31} /><Luz /><Sombra /><Gigante texto="um passo por dia" y={760} max={110} /></>) },
  { dur: 27, el: (<><Corte src="s4.png" zoom={1.5} ox={30} oy={40} luz={1.25} dur={27} /><Sombra /><Apoio texto="feito" y={560} /><Gigante texto="por você" estilo="serif" cor={VERMELHO} y={760} max={260} /></>) },
  // Narração 6: A pessoa com borderline não precisa concordar. Nem assistir.
  { dur: 42, el: (<><Corte src="s5.png" zoom={1.1} luz={1.05} cor dur={42} /><Sombra /><Gigante texto="a pessoa com borderline" y={620} max={70} /></>) },
  { dur: 17, el: (<><Corte src="s5.png" zoom={2} ox={85} oy={45} luz={1.05} cor dur={17} /><Sombra /><Gigante texto="não precisa" y={620} max={150} /></>) },
  { dur: 50, el: (<><Corte src="s5.png" zoom={1.6} ox={20} oy={45} luz={1.05} cor dur={50} /><Sombra /><Gigante texto="concordar" estilo="serif" cor={VERMELHO} y={620} max={300} /><Apoio texto="nem assistir" y={800} de={25} /><IconeGrande Icone={EyeOff} y={900} tam={120} de={25} /></>) },
  // Sem voz: dia 1 marcado e cartão final.
  { dur: 36, el: (<><Corte src="s6.png" zoom={1.05} cor dur={36} tremida={false} /><Luz /><Gigante texto="dia 1" estilo="serif" cor={VERMELHO} y={520} max={280} de={2} sombra={false} /><IconeGrande Icone={Check} y={720} de={16} /><Toque de={10} x={540} y={805} /></>) },
  { dur: 60, el: <CartaoFinal /> },
];

// Início de cada cena, para posicionar narração e efeitos.
const inicios = roteiro.reduce<number[]>((acc, item, i) => [...acc, i === 0 ? 0 : acc[i - 1] + roteiro[i - 1].dur], []);

// Narração: arquivo e quadro de entrada.
const NARRACAO: [string, number][] = [
  ["narracao/a1.wav", 6],
  ["narracao/a2.wav", 54],
  ["narracao/a3.wav", 136],
  ["narracao/a4.wav", 243],
  ["narracao/a5.wav", 299],
  ["narracao/a6.wav", 415],
];

// Efeitos baixos da biblioteca: arquivo, quadro, volume.
const VOLUME = { whoosh: 0.056, clique: 0.09, chime: 0.18, riser: 0.06 };
const trocas = [1, 5, 7, 8, 13, 15, 18, 21, 22];
const EFEITOS: [string, number, number][] = [
  ...trocas.map((i): [string, number, number] => ["sfx/whoosh-short.mp3", Math.max(0, inicios[i] - 3), VOLUME.whoosh]),
  ...[8, 9, 10, 11].map((i): [string, number, number] => ["sfx/click-soft.mp3", inicios[i] + 1, VOLUME.clique]),
  ...[0, 1, 2, 3, 4, 5, 6].map((d): [string, number, number] => ["sfx/click-soft.mp3", inicios[15] + 32 + d * 3, VOLUME.clique * 0.6]),
  ["sfx/click.mp3", inicios[21] + 10, VOLUME.clique],
  ["sfx/chime.mp3", inicios[21] + 16, VOLUME.chime],
  ["sfx/click.mp3", inicios[22] + 44, VOLUME.clique],
];

export const DURACAO = roteiro.reduce((s, i) => s + i.dur, 0);

export const Anuncio: React.FC = () => {
  const frame = useCurrentFrame();
  const fadeFinal = interpolate(frame, [DURACAO - 4, DURACAO], [0, 1], { extrapolateLeft: "clamp" });
  let inicio = 0;
  return (
    <AbsoluteFill style={{ background: FUNDO }}>
      <style>{fontes}</style>
      {roteiro.map((item, i) => {
        const de = inicio;
        inicio += item.dur;
        return (
          <Sequence key={i} from={de} durationInFrames={item.dur}>
            {item.el}
          </Sequence>
        );
      })}
      <Grao />
      <AbsoluteFill style={{ background: "#000", opacity: fadeFinal }} />
      <Audio src={staticFile("trilha.wav")} volume={0.07} />
      {NARRACAO.map(([src, de]) => (
        <Sequence key={src} from={de}>
          <Audio src={staticFile(src)} volume={1} />
        </Sequence>
      ))}
      {EFEITOS.map(([src, de, vol], i) => (
        <Sequence key={i} from={de}>
          <Audio src={staticFile(src)} volume={vol} />
        </Sequence>
      ))}
      <Sequence from={inicios[15] - 30} durationInFrames={30}>
        <Audio src={staticFile("sfx/riser.mp3")} startFrom={270} volume={VOLUME.riser} />
      </Sequence>
    </AbsoluteFill>
  );
};
