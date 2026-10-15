import { useEffect } from "react";
import {
  AbsoluteFill,
  Easing,
  interpolate,
  Sequence,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { z } from "zod";
import { Inter, loadInter } from "../load-font";

// Reel técnico a partir do Esquema 1 do artigo
// Comorbidades Narcisistas e Psicopáticas no TPB.
// Médias do PCL-R por grupo, em homens. Os números vêm do artigo;
// a referência do estudo entra pela prop fonte.
// Conteúdo fica entre y 280 e y 1480 para não ficar sob a interface do Instagram.

export const pclrSchema = z.object({
  fonte: z.string(),
});

const C = {
  ink: "#1C2230",
  ink2: "#4A5263",
  muted: "#8A91A0",
  gray: "#C3C8D1",
  grid: "#E7E9EE",
  blue: "#2B5C9E",
  red: "#C6372B",
};

const GRUPOS = [
  { nome: ["Sem TPB", "nem TPA"], valor: 3.1, inicio: 0.2 },
  { nome: ["TPB", "sem TPA"], valor: 7.8, inicio: 2.0, destaque: true },
  { nome: ["TPA", ""], valor: 15.2, inicio: 3.8 },
  { nome: ["TPB", "com TPA"], valor: 23.1, inicio: 5.6 },
];

// Geometria do gráfico, em pixels do quadro 1080 x 1920.
const PLOT = { esq: 150, dir: 990, topo: 560, base: 1240, max: 40 };
const y = (v: number) => PLOT.base - (v * (PLOT.base - PLOT.topo)) / PLOT.max;
const SLOT = (PLOT.dir - PLOT.esq) / 4;
const BARRA = 150;
const cx = (i: number) => PLOT.esq + SLOT * (i + 0.5);

const ease = Easing.bezier(0.16, 1, 0.3, 1);
const clamp = {
  extrapolateLeft: "clamp",
  extrapolateRight: "clamp",
} as const;

const virgula = (v: number) => v.toFixed(1).replace(".", ",");

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
  return (
    <>
      <div
        style={{
          ...abs(420, { fontSize: 96, fontWeight: 800, lineHeight: 1.1 }),
          ...a(0.1, 4.1),
        }}
      >
        Quanto um homem com borderline pontua numa escala de psicopatia?
      </div>
    </>
  );
};

// Legenda de topo do gráfico. Cada uma tem sua janela de tempo.
const Legenda: React.FC<{
  inicio: number;
  fim: number;
  children: React.ReactNode;
}> = ({ inicio, fim, children }) => {
  const a = useAppear();
  return (
    <div
      style={{
        ...abs(290, { fontSize: 58, fontWeight: 800, lineHeight: 1.15 }),
        ...a(inicio, fim),
      }}
    >
      {children}
    </div>
  );
};

const Grafico: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const a = useAppear();
  const s = (seg: number) => seg * fps;
  const FIM = 27.4;

  // Linha de corte desenhada da esquerda para a direita.
  const corte = interpolate(frame, [s(2.0), s(3.0)], [0, 1], {
    ...clamp,
    easing: ease,
  });
  // Fase de foco: primeiro no TPB sem TPA, depois na comorbidade.
  const focoTPB = interpolate(frame, [s(13.4), s(14)], [0, 1], clamp);
  const focoComorb = interpolate(frame, [s(19), s(19.6)], [0, 1], clamp);
  const opacidadeBarra = (i: number) => {
    const apagado = 0.28;
    if (focoComorb > 0) {
      const alvo = i === 1 || i === 3 ? 1 : apagado;
      return interpolate(focoComorb, [0, 1], [i === 1 ? 1 : apagado, alvo]);
    }
    return interpolate(focoTPB, [0, 1], [1, i === 1 ? 1 : apagado]);
  };
  const saida = interpolate(frame, [s(FIM), s(FIM + 0.4)], [1, 0], clamp);

  return (
    <AbsoluteFill style={{ opacity: saida }}>
      <Legenda inicio={0.1} fim={4.6}>
        PCL-R: escala de psicopatia, de 0 a 40.
      </Legenda>
      <Legenda inicio={5.0} fim={13.0}>
        Média por grupo. Homens de 33 anos.
      </Legenda>
      <Legenda inicio={13.4} fim={18.6}>
        TPB sem TPA fica a 4,7 pontos de quem não tem TPB nem TPA.
      </Legenda>
      <Legenda inicio={19.0} fim={23.2}>
        O que leva a pontuação para perto do corte é o TPA junto.
      </Legenda>
      <Legenda inicio={23.6} fim={FIM}>
        Acima de 30: nenhum do TPB sem TPA. Mais de 1 em 3 do TPB com TPA.
      </Legenda>

      {/* grade e eixo */}
      {[0, 10, 20, 30, 40].map((v) => (
        <div key={v} style={a(0.6, Infinity, 0)}>
          <div
            style={{
              position: "absolute",
              left: PLOT.esq,
              width: PLOT.dir - PLOT.esq,
              top: y(v),
              height: v === 0 ? 3 : 2,
              background: v === 0 ? C.gray : C.grid,
            }}
          />
          <div
            style={{
              position: "absolute",
              left: 40,
              width: 90,
              top: y(v) - 20,
              textAlign: "right",
              fontSize: 30,
              color: C.muted,
            }}
          >
            {v}
          </div>
        </div>
      ))}

      {/* linha de corte */}
      <div
        style={{
          position: "absolute",
          left: PLOT.esq,
          top: y(30) - 3,
          width: (PLOT.dir - PLOT.esq) * corte,
          height: 0,
          borderTop: `6px dashed ${C.red}`,
        }}
      />
      <div
        style={{
          position: "absolute",
          right: 1080 - PLOT.dir,
          top: y(30) - 58,
          fontSize: 36,
          fontWeight: 700,
          color: C.red,
          ...a(2.6, Infinity, 0),
        }}
      >
        Corte de psicopatia: 30
      </div>

      {/* barras */}
      {GRUPOS.map((g, i) => {
        const cresce = interpolate(
          frame,
          [s(5 + g.inicio), s(5 + g.inicio + 1.2)],
          [0, 1],
          { ...clamp, easing: ease },
        );
        const atual = g.valor * cresce;
        const visivel = cresce > 0 ? 1 : 0;
        return (
          <div
            key={g.nome.join(" ")}
            style={{ opacity: opacidadeBarra(i) * visivel }}
          >
            <div
              style={{
                position: "absolute",
                left: cx(i) - BARRA / 2,
                width: BARRA,
                top: y(atual),
                height: PLOT.base - y(atual),
                background: g.destaque ? C.blue : C.gray,
                borderRadius: "8px 8px 0 0",
              }}
            />
            <div
              style={{
                position: "absolute",
                left: cx(i) - 100,
                width: 200,
                top: y(atual) - 66,
                textAlign: "center",
                fontSize: g.destaque ? 52 : 46,
                fontWeight: 800,
                color: g.destaque ? C.ink : C.ink2,
              }}
            >
              {virgula(atual)}
            </div>
            <div
              style={{
                position: "absolute",
                left: cx(i) - 105,
                width: 210,
                top: PLOT.base + 22,
                textAlign: "center",
                fontSize: 32,
                lineHeight: 1.2,
                fontWeight: g.destaque ? 800 : 600,
                color: g.destaque ? C.ink : C.ink2,
              }}
            >
              {g.nome[0]}
              <br />
              {g.nome[1]}
            </div>
          </div>
        );
      })}

      {/* distância até o corte, só na fase de foco no TPB */}
      <div
        style={{
          position: "absolute",
          left: cx(1) - BARRA / 2 - 22,
          top: y(30) + 6,
          height: y(7.8) - y(30) - 12,
          width: 4,
          background: C.ink2,
          opacity: focoTPB * (1 - focoComorb),
        }}
      />
      <div
        style={{
          position: "absolute",
          right: 1080 - (cx(1) - BARRA / 2 - 40),
          textAlign: "right",
          top: y(25) - 42,
          fontSize: 34,
          fontWeight: 700,
          color: C.ink,
          lineHeight: 1.2,
          opacity: focoTPB * (1 - focoComorb),
        }}
      >
        22,2 pontos
        <br />
        <span style={{ fontWeight: 500, color: C.ink2 }}>abaixo do corte</span>
      </div>
    </AbsoluteFill>
  );
};

const Limites: React.FC = () => {
  const a = useAppear();
  const item = (top: number, inicio: number, texto: string) => (
    <div
      style={{
        ...abs(top, { fontSize: 54, fontWeight: 700, lineHeight: 1.2 }),
        ...a(inicio, 4.6),
      }}
    >
      {texto}
    </div>
  );
  return (
    <>
      <div
        style={{
          ...abs(380, { fontSize: 44, fontWeight: 700, color: C.red }),
          ...a(0.1, 4.6),
        }}
      >
        Leia com cuidado
      </div>
      {item(480, 0.4, "Amostra da comunidade, no Canadá. Só homens.")}
      {item(680, 1.0, "O grupo TPB sem TPA tem 12 pessoas.")}
      {item(880, 1.6, "Média de grupo não diagnostica ninguém.")}
    </>
  );
};

const Chamada: React.FC<{ fonte: string }> = ({ fonte }) => {
  const a = useAppear();
  return (
    <>
      <div
        style={{
          ...abs(520, { fontSize: 92, fontWeight: 800, lineHeight: 1.12 }),
          ...a(0.1),
        }}
      >
        Manda para quem estuda TPB com você.
      </div>
      <div
        style={{
          ...abs(1040, { fontSize: 30, fontWeight: 500, color: C.ink2 }),
          ...a(0.6),
        }}
      >
        {fonte}
      </div>
      <div
        style={{
          ...abs(1250, {
            fontSize: 34,
            fontWeight: 600,
            color: C.ink2,
            lineHeight: 1.35,
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
          ...abs(1380, { fontSize: 30, fontWeight: 400, color: C.muted }),
          ...a(0.8),
        }}
      >
        Conteúdo educativo. Não substitui avaliação individual.
      </div>
    </>
  );
};

export const PCLRDados: React.FC<z.infer<typeof pclrSchema>> = ({ fonte }) => {
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
        durationInFrames={Math.round(4.6 * fps)}
        premountFor={fps}
      >
        <Gancho />
      </Sequence>
      <Sequence
        name="Grafico"
        from={Math.round(4.6 * fps)}
        durationInFrames={Math.round(28 * fps)}
        premountFor={fps}
      >
        <Grafico />
      </Sequence>
      <Sequence
        name="Limites"
        from={Math.round(32.6 * fps)}
        durationInFrames={Math.round(5.2 * fps)}
        premountFor={fps}
      >
        <Limites />
      </Sequence>
      <Sequence
        name="Chamada"
        from={Math.round(37.8 * fps)}
        durationInFrames={Math.round(5 * fps)}
        premountFor={fps}
      >
        <Chamada fonte={fonte} />
      </Sequence>
    </AbsoluteFill>
  );
};
