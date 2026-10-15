import { useEffect } from "react";
import {
  AbsoluteFill,
  Easing,
  interpolate,
  Sequence,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { Inter, loadInter } from "../load-font";

// Reel de alcance a partir do Esquema 3 do artigo
// Comorbidades Narcisistas e Psicopáticas no TPB.
// O mesmo comportamento, duas funções. Mesmo estilo visual dos esquemas:
// fundo branco, Inter, azul para o ramo do sofrimento, vermelho só na ênfase.
// Conteúdo fica entre y 280 e y 1480 para não ficar sob a interface do Instagram.

const C = {
  ink: "#1C2230",
  ink2: "#4A5263",
  muted: "#8A91A0",
  gray: "#C3C8D1",
  grid: "#E7E9EE",
  blue: "#2B5C9E",
  blueTint: "#EEF2F8",
  red: "#C6372B",
};

const ease = Easing.bezier(0.16, 1, 0.3, 1);
const clamp = {
  extrapolateLeft: "clamp",
  extrapolateRight: "clamp",
} as const;

// Entrada e saída em segundos, relativas ao início da cena.
const useAppear = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return (inicio: number, fim = Infinity, dist = 40): React.CSSProperties => {
    const entra = interpolate(
      frame,
      [inicio * fps, (inicio + 0.5) * fps],
      [0, 1],
      { ...clamp, easing: ease },
    );
    const sai =
      fim === Infinity
        ? 1
        : interpolate(frame, [fim * fps, (fim + 0.35) * fps], [1, 0], clamp);
    return {
      opacity: Math.min(entra, sai),
      translate: `0px ${(1 - entra) * dist}px`,
    };
  };
};

const abs = (top: number, extra: React.CSSProperties = {}) =>
  ({ position: "absolute", top, left: 90, right: 90, ...extra }) as const;

const Gancho: React.FC = () => {
  const a = useAppear();
  const palavra = { fontSize: 168, fontWeight: 800, lineHeight: 1.08 };
  return (
    <>
      <div style={{ ...abs(380), ...palavra, ...a(0.1, 5.6) }}>Gritou.</div>
      <div style={{ ...abs(565), ...palavra, ...a(0.6, 5.6) }}>Ameaçou.</div>
      <div style={{ ...abs(750), ...palavra, ...a(1.1, 5.6) }}>Mentiu.</div>
      <div
        style={{
          ...abs(1060, { fontSize: 58, color: C.ink2, fontWeight: 600 }),
          ...a(2.4, 5.6),
        }}
      >
        E alguém já disse:
      </div>
      <div
        style={{
          ...abs(1140, { fontSize: 92, fontWeight: 800, lineHeight: 1.1 }),
          ...a(3.0, 5.6),
        }}
      >
        isso é <span style={{ color: C.red }}>psicopatia</span>.
      </div>
    </>
  );
};

const Pergunta: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const a = useAppear();
  // A pílula aparece no meio e sobe para virar o topo do fluxograma.
  const sobe = interpolate(frame, [4.4 * fps, 5.1 * fps], [0, 1], {
    ...clamp,
    easing: ease,
  });
  const entra = interpolate(frame, [2.0 * fps, 2.6 * fps], [0, 1], {
    ...clamp,
    easing: Easing.bezier(0.34, 1.56, 0.64, 1),
  });
  return (
    <>
      <div
        style={{
          ...abs(360, { fontSize: 84, fontWeight: 800, lineHeight: 1.12 }),
          ...a(0.1, 4.2),
        }}
      >
        O comportamento pode ser o mesmo.
      </div>
      <div
        style={{
          ...abs(620, { fontSize: 56, fontWeight: 600, color: C.ink2 }),
          ...a(1.2, 4.2),
        }}
      >
        A pergunta que separa:
      </div>
      <div
        style={{
          position: "absolute",
          left: 90,
          right: 90,
          top: interpolate(sobe, [0, 1], [780, 300]),
          height: 150,
          borderRadius: 75,
          border: `6px solid ${C.ink}`,
          background: "white",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 66,
          fontWeight: 800,
          color: C.ink,
          opacity: entra,
          scale: interpolate(entra, [0, 1], [0.85, 1]),
        }}
      >
        Para que isso serviu?
      </div>
    </>
  );
};

const Card: React.FC<{
  x: number;
  y: number;
  w: number;
  h: number;
  style?: React.CSSProperties;
  children: React.ReactNode;
}> = ({ x, y, w, h, style, children }) => (
  <div
    style={{
      position: "absolute",
      left: x,
      top: y,
      width: w,
      height: h,
      boxSizing: "border-box",
      borderRadius: 24,
      background: "white",
      border: `3px solid ${C.gray}`,
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      padding: "0 36px",
      ...style,
    }}
  >
    {children}
  </div>
);

const Passo: React.FC<{
  n: number;
  y: number;
  style: React.CSSProperties;
  children: string;
}> = ({ n, y, style, children }) => (
  <Card
    x={70}
    y={y}
    w={455}
    h={92}
    style={{
      border: `3px solid ${C.blue}`,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "flex-start",
      gap: 22,
      padding: "0 24px",
      ...style,
    }}
  >
    <div
      style={{
        width: 52,
        height: 52,
        borderRadius: 26,
        background: C.blue,
        color: "white",
        fontSize: 30,
        fontWeight: 700,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0,
      }}
    >
      {n}
    </div>
    <div
      style={{ fontSize: 38, fontWeight: 700, color: C.ink, lineHeight: 1.1 }}
    >
      {children}
    </div>
  </Card>
);

const Ramos: React.FC = () => {
  const a = useAppear();
  const fim = 9.6;
  const linha = (inicio: number): React.CSSProperties => ({
    position: "absolute",
    opacity: a(inicio, fim).opacity,
  });
  return (
    <>
      {/* a pílula continua no topo, vinda da cena anterior */}
      <div
        style={{
          position: "absolute",
          left: 90,
          right: 90,
          top: 300,
          height: 150,
          borderRadius: 75,
          border: `6px solid ${C.ink}`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 66,
          fontWeight: 800,
          color: C.ink,
          ...a(-1, fim, 0),
        }}
      >
        Para que isso serviu?
      </div>

      {/* conectores */}
      <div
        style={{
          ...linha(0.1),
          left: 538,
          top: 450,
          width: 4,
          height: 50,
          background: C.ink2,
        }}
      />
      <div
        style={{
          ...linha(0.1),
          left: 296,
          top: 498,
          width: 488,
          height: 4,
          background: C.ink2,
        }}
      />
      <div
        style={{
          ...linha(0.1),
          left: 296,
          top: 498,
          width: 4,
          height: 62,
          background: C.blue,
        }}
      />
      <div
        style={{
          ...linha(0.1),
          left: 780,
          top: 498,
          width: 4,
          height: 62,
          background: C.ink2,
        }}
      />

      <Card
        x={70}
        y={560}
        w={455}
        h={330}
        style={{
          background: C.blueTint,
          border: `4px solid ${C.blue}`,
          ...a(0.3, fim),
        }}
      >
        <div
          style={{
            fontSize: 50,
            fontWeight: 800,
            color: C.ink,
            marginBottom: 14,
          }}
        >
          Sofrimento
        </div>
        <div
          style={{
            fontSize: 38,
            fontWeight: 500,
            color: C.ink2,
            lineHeight: 1.25,
          }}
        >
          aliviar uma dor insuportável ou segurar o vínculo
        </div>
      </Card>
      <Card
        x={555}
        y={560}
        w={455}
        h={330}
        style={{ border: `4px solid ${C.gray}`, ...a(1.4, fim) }}
      >
        <div
          style={{
            fontSize: 50,
            fontWeight: 800,
            color: C.ink,
            marginBottom: 14,
          }}
        >
          Cálculo
        </div>
        <div
          style={{
            fontSize: 38,
            fontWeight: 500,
            color: C.ink2,
            lineHeight: 1.25,
          }}
        >
          obter ganho com o afeto estável
        </div>
      </Card>

      <Passo n={1} y={930} style={a(3.0, fim)}>
        Validar
      </Passo>
      <Passo n={2} y={1040} style={a(3.6, fim)}>
        Regular
      </Passo>
      <Passo n={3} y={1150} style={a(4.2, fim)}>
        Só depois confrontar
      </Passo>

      <Card
        x={555}
        y={930}
        w={455}
        h={312}
        style={{
          border: `4px dashed ${C.ink2}`,
          alignItems: "center",
          textAlign: "center",
          ...a(5.4, fim),
        }}
      >
        <div
          style={{
            fontSize: 42,
            fontWeight: 700,
            color: C.ink,
            lineHeight: 1.2,
          }}
        >
          Avaliar outro padrão
        </div>
      </Card>

      <div
        style={{
          ...abs(1320, {
            fontSize: 52,
            fontWeight: 800,
            color: C.ink,
            textAlign: "center",
          }),
          ...a(6.8, fim),
        }}
      >
        Nos dois casos, o limite continua.
      </div>
    </>
  );
};

const Risco: React.FC = () => {
  const a = useAppear();
  return (
    <>
      <div
        style={{
          position: "absolute",
          left: 90,
          top: 560,
          width: 12,
          height: 520,
          borderRadius: 6,
          background: C.red,
          ...a(0.1, 4.2, 0),
        }}
      />
      <div
        style={{
          ...abs(560, {
            left: 140,
            fontSize: 104,
            fontWeight: 800,
            lineHeight: 1.1,
          }),
          ...a(0.3, 4.2),
        }}
      >
        Confundir sofrimento com cálculo é um risco ético.
      </div>
    </>
  );
};

const Chamada: React.FC = () => {
  const a = useAppear();
  return (
    <>
      <div
        style={{
          ...abs(560, { fontSize: 92, fontWeight: 800, lineHeight: 1.12 }),
          ...a(0.1),
        }}
      >
        Manda para quem já ouviu que isso é psicopatia.
      </div>
      <div
        style={{
          ...abs(1270, {
            fontSize: 34,
            lineHeight: 1.35,
            fontWeight: 600,
            color: C.ink2,
          }),
          ...a(0.8),
        }}
      >
        Dr. Fabio Schmidt
        <br />
        médico com foco em TPB, CRM-SP 183549
      </div>
      <div
        style={{
          ...abs(1400, { fontSize: 30, fontWeight: 400, color: C.muted }),
          ...a(0.8),
        }}
      >
        Conteúdo educativo. Não substitui avaliação individual.
      </div>
    </>
  );
};

export const FuncaoDoComportamento: React.FC = () => {
  const { fps } = useVideoConfig();
  useEffect(() => {
    loadInter();
  }, []);

  return (
    <AbsoluteFill
      style={{ backgroundColor: "white", color: C.ink, fontFamily: Inter }}
    >
      <Sequence
        name="Gancho"
        durationInFrames={Math.round(6 * fps)}
        premountFor={fps}
      >
        <Gancho />
      </Sequence>
      <Sequence
        name="Pergunta"
        from={Math.round(6 * fps)}
        durationInFrames={Math.round(5.2 * fps)}
        premountFor={fps}
      >
        <Pergunta />
      </Sequence>
      <Sequence
        name="Ramos"
        from={Math.round(11.2 * fps)}
        durationInFrames={Math.round(10 * fps)}
        premountFor={fps}
      >
        <Ramos />
      </Sequence>
      <Sequence
        name="Risco"
        from={Math.round(21.2 * fps)}
        durationInFrames={Math.round(4.6 * fps)}
        premountFor={fps}
      >
        <Risco />
      </Sequence>
      <Sequence
        name="Chamada"
        from={Math.round(25.8 * fps)}
        durationInFrames={Math.round(4.2 * fps)}
        premountFor={fps}
      >
        <Chamada />
      </Sequence>
    </AbsoluteFill>
  );
};
