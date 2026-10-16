import { useEffect } from "react";
import {
  AbsoluteFill,
  Audio,
  Easing,
  Sequence,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { Anton, loadAnton } from "../load-font";

// Reel: a mensagem de cancelamento. Só animação, ícones e efeitos sonoros.
// Funcao principal: alcance. Publico: quem vive a evitacao.

const VERMELHO = "#c83c1e";
const CINZA = "#8a8a8a";
const CINZA_CLARO = "#bdbdbd";
const FUNDO = "#050505";
const SANS = "Helvetica, Arial, sans-serif";
const MENSAGEM = "Desculpa, surgiu um imprevisto.";

// Duração de cada cena, em frames a 30 fps.
const CENAS = {
  mensagem: 95,
  medo: 150,
  alivio: 80,
  ciclo: 130,
  nome: 80,
  peso: 125,
  outroLado: 140,
  verdade: 80,
  borderline: 170,
  assinatura: 75,
};

export const IMPREVISTO_DURACAO = (
  Object.keys(CENAS) as (keyof typeof CENAS)[]
).reduce((total, chave) => total + CENAS[chave], 0);

const sfx = (nome: string) => staticFile(`sfx/${nome}.wav`);

const Som: React.FC<{ em: number; nome: string; volume?: number }> = ({
  em,
  nome,
  volume = 1,
}) => (
  <Sequence from={em} layout="none">
    <Audio src={sfx(nome)} volume={volume} />
  </Sequence>
);

const useEntrada = (atraso: number, rigidez = 140) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return spring({
    frame: frame - atraso,
    fps,
    config: { damping: 16, stiffness: rigidez, mass: 0.7 },
  });
};

const progresso = (frame: number, de: number, ate: number) =>
  interpolate(frame, [de, ate], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.65, 0, 0.35, 1),
  });

// Envolve cada cena: entra com leve zoom e sai com desfoque curto.
const Cena: React.FC<{ duracao: number; children: React.ReactNode }> = ({
  duracao,
  children,
}) => {
  const frame = useCurrentFrame();
  const entra = interpolate(frame, [0, 7], [0, 1], {
    extrapolateRight: "clamp",
  });
  const sai = interpolate(frame, [duracao - 7, duracao], [1, 0], {
    extrapolateLeft: "clamp",
  });
  const escala = interpolate(frame, [0, duracao], [1.03, 1]);
  return (
    <AbsoluteFill
      style={{
        opacity: Math.min(entra, sai),
        filter: `blur(${(1 - sai) * 14}px)`,
        transform: `scale(${escala})`,
      }}
    >
      {children}
    </AbsoluteFill>
  );
};

// Linha de texto que entra palavra por palavra.
const Palavras: React.FC<{
  texto: string;
  atraso: number;
  tamanho: number;
  top: number;
  cor?: string;
  destaque?: Record<string, string>;
}> = ({ texto, atraso, tamanho, top, cor = "white", destaque = {} }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return (
    <div
      style={{
        position: "absolute",
        top,
        left: 90,
        right: 90,
        textAlign: "center",
        fontFamily: Anton,
        textTransform: "uppercase",
        fontSize: tamanho,
        lineHeight: 1.08,
        color: cor,
      }}
    >
      {texto.split(" ").map((p, i) => {
        const s = spring({
          frame: frame - atraso - i * 2.2,
          fps,
          config: { damping: 15, stiffness: 170, mass: 0.6 },
        });
        const chave = p.replace(/[.,?:]/g, "").toLowerCase();
        return (
          <span
            key={i}
            style={{
              display: "inline-block",
              marginRight: tamanho * 0.22,
              opacity: s,
              transform: `translateY(${(1 - s) * tamanho * 0.5}px)`,
              filter: `blur(${(1 - s) * 8}px)`,
              color: destaque[chave] ?? cor,
            }}
          >
            {p}
          </span>
        );
      })}
    </div>
  );
};

// Traço SVG que se desenha.
const Traco: React.FC<
  React.SVGProps<SVGPathElement> & { p: number; cor?: string; espessura?: number }
> = ({ p, cor = "white", espessura = 10, ...rest }) => (
  <path
    {...rest}
    pathLength={1}
    fill="none"
    stroke={cor}
    strokeWidth={espessura}
    strokeLinecap="round"
    strokeLinejoin="round"
    strokeDasharray={1}
    strokeDashoffset={1 - p}
  />
);

const Fundo: React.FC = () => {
  const frame = useCurrentFrame();
  const x = 50 + Math.sin(frame / 90) * 12;
  const y = 42 + Math.cos(frame / 110) * 8;
  return (
    <AbsoluteFill
      style={{
        background: `radial-gradient(circle at ${x}% ${y}%, #1a1a1a 0%, ${FUNDO} 62%)`,
      }}
    />
  );
};

// Celular com uma conversa. lado define se a mensagem é enviada ou recebida.
const Celular: React.FC<{
  atraso: number;
  lado: "enviada" | "recebida";
  top: number;
}> = ({ atraso, lado, top }) => {
  const frame = useCurrentFrame();
  const corpo = progresso(frame, atraso, atraso + 18);
  const s = useEntrada(atraso, 120);
  const enviada = lado === "enviada";
  const digitando = enviada
    ? frame > atraso + 14 && frame < atraso + 40
    : false;
  const balao = useEntrada(enviada ? atraso + 40 : atraso + 16, 200);
  const subida = enviada ? progresso(frame, atraso + 58, atraso + 66) : 0;
  const checks = progresso(frame, atraso + 66, atraso + 74);
  const w = 600;
  const h = 1040;
  return (
    <div
      style={{
        position: "absolute",
        left: (1080 - w) / 2,
        top,
        width: w,
        height: h,
        transform: `translateY(${(1 - s) * 80}px)`,
        opacity: s,
      }}
    >
      <svg width={w} height={h} style={{ position: "absolute" }}>
        <Traco
          p={corpo}
          espessura={8}
          cor="#3a3a3a"
          d={`M 70 6 H ${w - 70} Q ${w - 6} 6 ${w - 6} 70 V ${h - 70} Q ${w - 6} ${h - 6} ${w - 70} ${h - 6} H 70 Q 6 ${h - 6} 6 ${h - 70} V 70 Q 6 6 70 6 Z`}
        />
        <Traco p={corpo} espessura={8} cor="#3a3a3a" d={`M ${w / 2 - 50} 40 H ${w / 2 + 50}`} />
      </svg>
      {enviada && digitando ? (
        <div
          style={{
            position: "absolute",
            right: 50,
            bottom: 140,
            display: "flex",
            gap: 14,
            padding: "28px 34px",
            borderRadius: 44,
            background: "#262626",
          }}
        >
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              style={{
                width: 20,
                height: 20,
                borderRadius: 10,
                background: CINZA_CLARO,
                opacity: 0.4 + 0.6 * Math.max(0, Math.sin((frame - i * 4) / 3)),
              }}
            />
          ))}
        </div>
      ) : null}
      <div
        style={{
          position: "absolute",
          [enviada ? "right" : "left"]: 40,
          bottom: 130 + subida * 520,
          maxWidth: 470,
          padding: "30px 38px",
          borderRadius: 40,
          [enviada ? "borderBottomRightRadius" : "borderBottomLeftRadius"]: 10,
          background: enviada ? VERMELHO : "#2a2a2a",
          color: "white",
          fontFamily: SANS,
          fontSize: 50,
          lineHeight: 1.2,
          fontWeight: 500,
          opacity: balao,
          transform: `scale(${0.6 + 0.4 * balao})`,
          transformOrigin: enviada ? "bottom right" : "bottom left",
        }}
      >
        {MENSAGEM}
      </div>
      {enviada ? (
        <svg
          width={70}
          height={40}
          style={{ position: "absolute", right: 46, bottom: 70 + subida * 520 }}
        >
          <Traco p={checks} espessura={6} cor={CINZA_CLARO} d="M 4 22 L 16 34 L 40 6" />
          <Traco p={checks} espessura={6} cor={CINZA_CLARO} d="M 26 30 L 30 34 L 56 6" />
        </svg>
      ) : null}
    </div>
  );
};

const CenaMensagem: React.FC = () => (
  <Cena duracao={CENAS.mensagem}>
    <Celular atraso={0} lado="enviada" top={360} />
    {[16, 20, 24, 28, 31, 35].map((f) => (
      <Som key={f} em={f} nome="tecla" volume={0.7} />
    ))}
    <Som em={40} nome="pop" />
    <Som em={56} nome="whoosh" volume={0.8} />
    <Som em={66} nome="tique" />
  </Cena>
);

const Barra: React.FC<{
  rotulo: string;
  altura: number;
  cor: string;
  left: number;
  atraso: number;
}> = ({ rotulo, altura, cor, left, atraso }) => {
  const s = useEntrada(atraso);
  return (
    <>
      <div
        style={{
          position: "absolute",
          left,
          bottom: 520,
          width: 220,
          height: altura,
          background: cor,
          borderRadius: 18,
          opacity: s,
        }}
      />
      <div
        style={{
          position: "absolute",
          left: left - 40,
          width: 300,
          top: 1420,
          textAlign: "center",
          fontFamily: Anton,
          fontSize: 56,
          color: cor,
          opacity: s,
        }}
      >
        {rotulo}
      </div>
    </>
  );
};

const CenaMedo: React.FC = () => {
  const frame = useCurrentFrame();
  const vontade = interpolate(progresso(frame, 50, 75), [0, 1], [0, 380]);
  const medo = interpolate(progresso(frame, 70, 115), [0, 1], [0, 560]);
  const tremor = frame > 112 ? Math.sin(frame * 2.3) * 3 : 0;
  return (
    <Cena duracao={CENAS.medo}>
      <Palavras texto="Quantas vezes essa mensagem saiu porque o" atraso={2} tamanho={84} top={260} />
      <Palavras
        texto="medo do encontro ficou maior que a vontade de ir?"
        atraso={24}
        tamanho={84}
        top={470}
        destaque={{ medo: VERMELHO }}
      />
      <AbsoluteFill style={{ transform: `translateX(${tremor}px)` }}>
        <Barra rotulo="VONTADE" altura={vontade} cor={CINZA} left={250} atraso={44} />
        <Barra rotulo="MEDO" altura={medo} cor={VERMELHO} left={610} atraso={64} />
      </AbsoluteFill>
      <div
        style={{
          position: "absolute",
          left: 180,
          right: 180,
          top: 1400,
          height: 6,
          background: "#3a3a3a",
          borderRadius: 3,
        }}
      />
      <Som em={46} nome="pop" volume={0.6} />
      <Som em={68} nome="riser" volume={0.9} />
      <Som em={112} nome="peso" />
    </Cena>
  );
};

const CenaAlivio: React.FC = () => {
  const frame = useCurrentFrame();
  const arco = progresso(frame, 0, 14);
  const queda = progresso(frame, 22, 50);
  const angulo = interpolate(queda, [0, 1], [70, -70]);
  const cx = 540;
  const cy = 1260;
  const r = 280;
  return (
    <Cena duracao={CENAS.alivio}>
      <Palavras texto="Cancelar alivia na hora." atraso={0} tamanho={110} top={380} />
      <svg width={1080} height={1920} style={{ position: "absolute" }}>
        <Traco p={arco} espessura={22} cor="#2a2a2a" d={`M ${cx - r} ${cy} A ${r} ${r} 0 0 1 ${cx + r} ${cy}`} />
        <Traco
          p={arco * (1 - queda * 0.82)}
          espessura={22}
          cor={interpolate(queda, [0, 1], [0, 1]) > 0.5 ? CINZA_CLARO : VERMELHO}
          d={`M ${cx - r} ${cy} A ${r} ${r} 0 0 1 ${cx + r} ${cy}`}
        />
        <g transform={`rotate(${angulo} ${cx} ${cy})`} opacity={arco}>
          <line x1={cx} y1={cy} x2={cx} y2={cy - r + 50} stroke="white" strokeWidth={12} strokeLinecap="round" />
        </g>
        <circle cx={cx} cy={cy} r={26} fill="white" opacity={arco} />
      </svg>
      <div
        style={{
          position: "absolute",
          top: 1320,
          left: 0,
          right: 0,
          textAlign: "center",
          fontFamily: Anton,
          fontSize: 50,
          letterSpacing: 4,
          color: CINZA,
          opacity: arco,
        }}
      >
        TENSÃO
      </div>
      <Som em={22} nome="alivio" />
    </Cena>
  );
};

const CenaCiclo: React.FC = () => {
  const frame = useCurrentFrame();
  const anel = progresso(frame, 40, 70);
  const giro = interpolate(frame, [60, CENAS.ciclo], [0, 160], {
    extrapolateLeft: "clamp",
  });
  const cx = 540;
  const cy = 1220;
  const r = 250;
  const nos = ["CONVITE", "CANCELA", "ALÍVIO"];
  return (
    <Cena duracao={CENAS.ciclo}>
      <Palavras texto="E é por isso que fica difícil parar:" atraso={0} tamanho={80} top={250} cor={CINZA_CLARO} />
      <Palavras
        texto="o alívio ensina que fugir resolve."
        atraso={22}
        tamanho={100}
        top={470}
        destaque={{ fugir: VERMELHO }}
      />
      <svg width={1080} height={1920} style={{ position: "absolute" }}>
        <defs>
          <marker id="seta" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="4" markerHeight="4" orient="auto">
            <path d="M 0 0 L 10 5 L 0 10 z" fill={VERMELHO} />
          </marker>
        </defs>
        <g transform={`rotate(${giro} ${cx} ${cy})`}>
          {[0, 1, 2].map((i) => {
            const a0 = (-90 + i * 120 + 22) * (Math.PI / 180);
            const a1 = (-90 + i * 120 + 98) * (Math.PI / 180);
            return (
              <Traco
                key={i}
                p={anel}
                espessura={12}
                cor={VERMELHO}
                markerEnd={anel > 0.95 ? "url(#seta)" : undefined}
                d={`M ${cx + r * Math.cos(a0)} ${cy + r * Math.sin(a0)} A ${r} ${r} 0 0 1 ${cx + r * Math.cos(a1)} ${cy + r * Math.sin(a1)}`}
              />
            );
          })}
        </g>
      </svg>
      {nos.map((n, i) => {
        const a = (-90 + i * 120 + giro) * (Math.PI / 180);
        const s = entradaLocal(frame, 44 + i * 8);
        return (
          <div
            key={n}
            style={{
              position: "absolute",
              left: cx + r * Math.cos(a) - 140,
              top: cy + r * Math.sin(a) - 42,
              width: 280,
              height: 84,
              borderRadius: 42,
              background: "#161616",
              border: "4px solid #3a3a3a",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontFamily: Anton,
              fontSize: 44,
              letterSpacing: 2,
              color: "white",
              opacity: s,
              transform: `scale(${0.5 + 0.5 * s})`,
            }}
          >
            {n}
          </div>
        );
      })}
      <Som em={44} nome="pop" volume={0.5} />
      <Som em={52} nome="pop" volume={0.5} />
      <Som em={60} nome="pop" volume={0.5} />
      <Som em={66} nome="laco" />
    </Cena>
  );
};

// Variante de entrada sem hook, para uso dentro de map.
const entradaLocal = (frame: number, atraso: number) =>
  spring({
    frame: frame - atraso,
    fps: 30,
    config: { damping: 14, stiffness: 180, mass: 0.6 },
  });

const CenaNome: React.FC = () => {
  const frame = useCurrentFrame();
  const carimbo = entradaLocal(frame, 22);
  const tremor = frame >= 22 && frame < 34 ? Math.sin(frame * 3.1) * (34 - frame) * 1.6 : 0;
  const brilho = interpolate(frame, [22, 60], [0.55, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  return (
    <Cena duracao={CENAS.nome}>
      <AbsoluteFill
        style={{
          background: `radial-gradient(circle at 50% 50%, rgba(200,60,30,${brilho}) 0%, transparent 60%)`,
        }}
      />
      <AbsoluteFill style={{ transform: `translate(${tremor}px, ${tremor * 0.6}px)` }}>
        <Palavras texto="Isso tem nome." atraso={0} tamanho={80} top={620} cor={CINZA_CLARO} />
        <div
          style={{
            position: "absolute",
            top: 780,
            left: 0,
            right: 0,
            textAlign: "center",
            fontFamily: Anton,
            fontSize: 210,
            letterSpacing: 4,
            color: VERMELHO,
            opacity: carimbo,
            transform: `scale(${interpolate(carimbo, [0, 1], [2.4, 1])}) rotate(-4deg)`,
          }}
        >
          EVITAÇÃO
        </div>
      </AbsoluteFill>
      <Som em={4} nome="riser" volume={0.7} />
      <Som em={22} nome="impacto" />
    </Cena>
  );
};

const Envelope: React.FC<{ escala: number; queda: number; x: number; baseY: number }> = ({
  escala,
  queda,
  x,
  baseY,
}) => {
  const w = 220 * escala;
  const h = 150 * escala;
  const y = interpolate(queda, [0, 1], [-400, baseY - h]);
  return (
    <svg
      width={w + 20}
      height={h + 20}
      style={{ position: "absolute", left: x - w / 2, top: y, opacity: queda > 0 ? 1 : 0 }}
      viewBox={`-10 -10 ${w + 20} ${h + 20}`}
    >
      <rect x={0} y={0} width={w} height={h} rx={14} fill="#161616" stroke="white" strokeWidth={8} />
      <path d={`M 6 8 L ${w / 2} ${h * 0.58} L ${w - 6} 8`} fill="none" stroke="white" strokeWidth={8} strokeLinejoin="round" />
    </svg>
  );
};

const CenaPeso: React.FC = () => {
  const frame = useCurrentFrame();
  const quedas = [36, 58, 80];
  const escalas = [0.7, 1, 1.4];
  const xs = [220, 470, 770];
  const baseY = 1400;
  const qs = quedas.map((q) =>
    interpolate(frame, [q, q + 9], [0, 1], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: Easing.in(Easing.quad),
    }),
  );
  // A prateleira cede um pouco a cada envelope.
  const cede = qs.reduce((acc, q, i) => acc + q * (i + 1) * 6, 0);
  const balanco = quedas.reduce(
    (acc, q) =>
      acc + (frame > q + 9 ? Math.sin((frame - q - 9) * 0.9) * Math.exp(-(frame - q - 9) / 6) * 10 : 0),
    0,
  );
  return (
    <Cena duracao={CENAS.peso}>
      <Palavras texto="Cada vez que funciona," atraso={0} tamanho={88} top={300} cor={CINZA_CLARO} />
      <Palavras
        texto="o próximo convite pesa mais."
        atraso={14}
        tamanho={104}
        top={430}
        destaque={{ pesa: VERMELHO, mais: VERMELHO }}
      />
      <AbsoluteFill style={{ transform: `translateY(${cede + balanco}px)` }}>
        {qs.map((q, i) => (
          <Envelope key={i} escala={escalas[i]} queda={q} x={xs[i]} baseY={baseY} />
        ))}
        <div
          style={{
            position: "absolute",
            top: baseY + 14,
            left: 110,
            right: 110,
            height: 14,
            borderRadius: 7,
            background: CINZA,
          }}
        />
      </AbsoluteFill>
      {quedas.map((q, i) => (
        <Som key={q} em={q + 9} nome="peso" volume={0.6 + i * 0.2} />
      ))}
    </Cena>
  );
};

const CenaOutroLado: React.FC = () => {
  const frame = useCurrentFrame();
  const interrog = entradaLocal(frame, 70);
  const flutua = Math.sin(frame / 8) * 10;
  return (
    <Cena duracao={CENAS.outroLado}>
      <Palavras texto="Do outro lado, alguém recebeu a mensagem" atraso={0} tamanho={76} top={200} />
      <div style={{ position: "absolute", inset: 0, transform: "scale(0.7)", transformOrigin: "50% 60%" }}>
        <Celular atraso={10} lado="recebida" top={520} />
      </div>
      <div
        style={{
          position: "absolute",
          top: 760 + flutua,
          left: 0,
          right: 0,
          textAlign: "center",
          fontFamily: Anton,
          fontSize: 300,
          color: VERMELHO,
          opacity: interrog,
          transform: `scale(${0.4 + 0.6 * interrog})`,
        }}
      >
        ?
      </div>
      <Palavras texto="e ficou sem saber o motivo." atraso={80} tamanho={76} top={1480} cor={CINZA_CLARO} />
      <Som em={0} nome="whoosh" volume={0.6} />
      <Som em={26} nome="notificacao" />
      <Som em={70} nome="pop" />
    </Cena>
  );
};

const CenaVerdade: React.FC = () => {
  const frame = useCurrentFrame();
  const sublinhado = progresso(frame, 26, 44);
  return (
    <Cena duracao={CENAS.verdade}>
      <Palavras texto="Essa pessoa também merece" atraso={0} tamanho={100} top={640} />
      <Palavras texto="a verdade." atraso={14} tamanho={170} top={880} destaque={{ verdade: VERMELHO }} />
      <svg width={1080} height={1920} style={{ position: "absolute" }}>
        <Traco p={sublinhado} espessura={14} cor={VERMELHO} d="M 300 1110 Q 560 1090 800 1112" />
      </svg>
      <Som em={26} nome="tique" volume={0.8} />
    </Cena>
  );
};

const CenaBorderline: React.FC = () => {
  const frame = useCurrentFrame();
  const a = entradaLocal(frame, 10);
  const juntos = progresso(frame, 70, 100);
  const r = 230;
  const distancia = interpolate(juntos, [0, 1], [380, 230]);
  const cx = 540;
  const cy = 1210;
  return (
    <Cena duracao={CENAS.borderline}>
      <Palavras
        texto="Evitação não é exclusiva do borderline."
        atraso={0}
        tamanho={84}
        top={220}
        destaque={{ evitação: VERMELHO }}
      />
      <Palavras
        texto="No borderline, costuma vir junto do medo de ser rejeitado no encontro."
        atraso={56}
        tamanho={66}
        top={460}
        cor={CINZA_CLARO}
      />
      <svg width={1080} height={1920} style={{ position: "absolute" }}>
        <circle
          cx={cx - distancia / 2}
          cy={cy}
          r={r * a}
          fill="rgba(200,60,30,0.22)"
          stroke={VERMELHO}
          strokeWidth={8}
        />
        <circle
          cx={cx + distancia / 2}
          cy={cy}
          r={r * entradaLocal(frame, 64)}
          fill="rgba(189,189,189,0.12)"
          stroke={CINZA_CLARO}
          strokeWidth={8}
          opacity={frame >= 66 ? 1 : 0}
        />
      </svg>
      <div
        style={{
          position: "absolute",
          left: cx - distancia / 2 - r,
          width: r * 2 - distancia * 0.35,
          top: cy - 30,
          textAlign: "center",
          fontFamily: Anton,
          fontSize: 44,
          color: "white",
          opacity: a,
        }}
      >
        EVITAÇÃO
      </div>
      <div
        style={{
          position: "absolute",
          left: cx + distancia / 2 - r + distancia * 0.35,
          width: r * 2 - distancia * 0.35,
          top: cy - 56,
          textAlign: "center",
          fontFamily: Anton,
          fontSize: 44,
          lineHeight: 1.1,
          color: "white",
          opacity: entradaLocal(frame, 70),
        }}
      >
        MEDO DE
        <br />
        REJEIÇÃO
      </div>
      <Som em={10} nome="pop" volume={0.6} />
      <Som em={64} nome="pop" volume={0.6} />
      <Som em={74} nome="whoosh" volume={0.5} />
      <Som em={98} nome="peso" volume={0.6} />
    </Cena>
  );
};

const CenaAssinatura: React.FC = () => {
  const frame = useCurrentFrame();
  const linha = progresso(frame, 6, 26);
  return (
    <Cena duracao={CENAS.assinatura}>
      <Palavras texto="Borderline" atraso={0} tamanho={110} top={700} />
      <Palavras texto="Sem Estigma" atraso={6} tamanho={110} top={830} cor={VERMELHO} />
      <svg width={1080} height={1920} style={{ position: "absolute" }}>
        <Traco p={linha} espessura={8} cor={CINZA} d="M 340 1000 H 740" />
      </svg>
      <div
        style={{
          position: "absolute",
          top: 1040,
          left: 0,
          right: 0,
          textAlign: "center",
          fontFamily: SANS,
          fontSize: 38,
          color: CINZA,
          opacity: linha,
        }}
      >
        Dr. Fabio Schmidt, médico, CRM-SP 183549
      </div>
      <Som em={6} nome="tique" volume={0.6} />
    </Cena>
  );
};

const ORDEM: [keyof typeof CENAS, React.FC][] = [
  ["mensagem", CenaMensagem],
  ["medo", CenaMedo],
  ["alivio", CenaAlivio],
  ["ciclo", CenaCiclo],
  ["nome", CenaNome],
  ["peso", CenaPeso],
  ["outroLado", CenaOutroLado],
  ["verdade", CenaVerdade],
  ["borderline", CenaBorderline],
  ["assinatura", CenaAssinatura],
];

const BarraProgresso: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <div
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        height: 8,
        width: `${(frame / IMPREVISTO_DURACAO) * 100}%`,
        background: VERMELHO,
      }}
    />
  );
};

export const Imprevisto: React.FC = () => {
  useEffect(() => {
    loadAnton();
  }, []);

  let inicio = 0;
  return (
    <AbsoluteFill style={{ backgroundColor: FUNDO, color: "white" }}>
      <Fundo />
      {ORDEM.map(([chave, Componente]) => {
        const de = inicio;
        inicio += CENAS[chave];
        return (
          <Sequence key={chave} from={de} durationInFrames={CENAS[chave]} name={chave}>
            <Componente />
          </Sequence>
        );
      })}
      <BarraProgresso />
    </AbsoluteFill>
  );
};
