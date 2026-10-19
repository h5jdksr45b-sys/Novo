import { useEffect } from "react";
import {
  AbsoluteFill,
  Audio,
  OffthreadVideo,
  Sequence,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { useAnimeTimeline } from "../anime/useAnimeTimeline";
import { Anton, loadAnton } from "../load-font";

// Reel gravado: verdade ou mito sobre borderline, quatro perguntas.
// O vídeo já vem cortado. Aqui entram pergunta no alto, carimbo de
// MITO ou VERDADE, legenda pequena abaixo do queixo e assinatura no fim.
// Tempos em milissegundos, na linha do tempo do vídeo cortado.

const VERMELHO = "#c83c1e";

const PERGUNTAS = [
  {
    inicio: 1500,
    fim: 9400,
    texto: "Todo mundo com borderline se machuca.",
    resposta: "MITO",
    carimbo: 3550,
  },
  {
    inicio: 9400,
    fim: 22450,
    texto: "Adolescente não pode receber diagnóstico de borderline.",
    resposta: "MITO",
    carimbo: 11450,
  },
  {
    inicio: 22450,
    fim: 29800,
    texto: "A família também pode fazer acompanhamento.",
    resposta: "VERDADE",
    carimbo: 24600,
  },
  {
    inicio: 29800,
    fim: 39850,
    texto:
      "Quem tem borderline não consegue ficar muito tempo num relacionamento.",
    resposta: "MITO",
    carimbo: 31850,
  },
];

const FALAS: [number, number, string][] = [
  [0, 1500, "Tenta acertar antes de mim."],
  [3500, 4150, "Mito."],
  [4150, 5050, "É comum."],
  [5050, 6750, "Mas não é obrigatório para o diagnóstico."],
  [6750, 9400, "Quem não se machuca também pode estar sofrendo muito."],
  [11400, 14250, "Mito. Pode, mas com cuidado."],
  [14250, 16300, "Esse padrão precisa durar um tempo."],
  [16300, 20150, "Aparecer em várias áreas da vida, prejudicar suas funções."],
  [20150, 22450, "Então não pode ser só uma fase."],
  [24550, 26800, "Verdade. E muitas vezes deve."],
  [26800, 29800, "Quem convive também tem que saber reagir e se cuidar."],
  [31800, 33000, "Mito."],
  [33000, 34600, "Muita gente consegue."],
  [
    34600,
    38500,
    "Claro, costuma pedir mais conversa, mais combinado, previsão.",
  ],
  [38500, 39850, "E muitas vezes o tratamento."],
  [39850, 42700, "E você, em qual dessas você ouvia como verdade?"],
  [42700, 43800, "Comenta aqui o número."],
];

// Quebra cada fala em blocos de até quatro palavras, com tempo
// proporcional ao número de letras. Palavra sozinha no fim junta com a anterior.
type Legenda = { inicio: number; fim: number; texto: string };

const LEGENDAS: Legenda[] = FALAS.reduce<Legenda[]>(
  (lista, [inicio, fim, frase]) => {
    const palavras = frase.split(" ");
    const blocos: string[] = [];
    while (palavras.length) {
      blocos.push(palavras.splice(0, 4).join(" "));
    }
    if (blocos.length > 1 && !blocos[blocos.length - 1].includes(" ")) {
      const ultima = blocos.pop();
      blocos[blocos.length - 1] += ` ${ultima}`;
    }
    const total = blocos.reduce((soma, b) => soma + b.length, 0);
    let cursor = inicio + 80;
    blocos.forEach((texto) => {
      const duracao = ((fim - inicio - 80) * texto.length) / total;
      lista.push({ inicio: cursor, fim: cursor + duracao, texto });
      cursor += duracao;
    });
    return lista;
  },
  [],
);

const texto: React.CSSProperties = {
  position: "absolute",
  left: 90,
  right: 90,
  textAlign: "center",
  opacity: 0,
};

export const VerdadeOuMito: React.FC = () => {
  useEffect(() => {
    loadAnton();
  }, []);

  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const agora = (frame / fps) * 1000;
  const legenda = LEGENDAS.find((l) => agora >= l.inicio && agora < l.fim);
  const atual = PERGUNTAS.findIndex((p) => agora >= p.inicio && agora < p.fim);

  const ref = useAnimeTimeline((tl, $) => {
    const entra = { opacity: [0, 1], y: [40, 0], duration: 450 };
    const sai = { opacity: 0, duration: 350 };

    tl.add($(".titulo"), entra, 100).add($(".titulo"), sai, 1150);
    PERGUNTAS.forEach((p, i) => {
      tl.add($(`.p${i}`), entra, p.inicio)
        .add(
          $(`.c${i}`),
          {
            opacity: [0, 1],
            scale: [2.2, 1],
            rotate: [-14, -8],
            duration: 420,
            ease: "outBack",
          },
          p.carimbo,
        )
        .add($(`.p${i}, .c${i}`), sai, p.fim - 350);
    });
    tl.add($(".progresso"), { opacity: [0, 1], duration: 300 }, 1500)
      .add($(".progresso"), sai, 39500)
      .add($(".cta, .assinatura"), entra, 39900);
  });

  return (
    <AbsoluteFill
      ref={ref}
      style={{
        backgroundColor: "#050505",
        color: "white",
        fontFamily: Anton,
        textTransform: "uppercase",
      }}
    >
      <OffthreadVideo
        src={staticFile("verdade-ou-mito.mp4")}
        style={{ width: "100%", height: "100%", objectFit: "cover" }}
      />
      {PERGUNTAS.map((p) => (
        <div key={`som-${p.texto}`}>
          <Sequence
            from={Math.round(((p.inicio - 120) / 1000) * fps)}
            layout="none"
          >
            <Audio src={staticFile("sfx/whoosh.wav")} volume={0.35} />
          </Sequence>
          <Sequence
            from={Math.round(((p.carimbo + 60) / 1000) * fps)}
            layout="none"
          >
            <Audio src={staticFile("sfx/carimbo.wav")} volume={0.6} />
          </Sequence>
        </div>
      ))}
      <AbsoluteFill
        style={{
          background:
            "linear-gradient(to bottom, rgba(5,5,5,0.88) 0%, rgba(5,5,5,0.7) 28%, rgba(5,5,5,0) 46%)",
        }}
      />

      <div
        className="progresso"
        style={{
          position: "absolute",
          top: 210,
          left: 0,
          right: 0,
          display: "flex",
          justifyContent: "center",
          gap: 14,
          opacity: 0,
        }}
      >
        {PERGUNTAS.map((p, i) => (
          <div
            key={p.texto}
            style={{
              width: 120,
              height: 8,
              borderRadius: 4,
              background:
                i === atual
                  ? VERMELHO
                  : i < atual
                    ? "white"
                    : "rgba(255,255,255,0.3)",
            }}
          />
        ))}
      </div>

      <div className="titulo" style={{ ...texto, top: 300, lineHeight: 1.05 }}>
        <div style={{ fontSize: 116 }}>Verdade ou mito</div>
        <div style={{ fontSize: 80, color: "#bdbdbd" }}>sobre borderline</div>
      </div>

      {PERGUNTAS.map((p, i) => (
        <div key={p.texto}>
          <div
            className={`p${i}`}
            style={{
              ...texto,
              top: 280,
              fontSize: p.texto.length > 55 ? 70 : 82,
              lineHeight: 1.05,
            }}
          >
            {p.texto}
          </div>
          <div
            className={`c${i}`}
            style={{
              ...texto,
              left: 0,
              right: 0,
              top: 600,
              display: "flex",
              justifyContent: "center",
            }}
          >
            <div
              style={{
                fontSize: 130,
                lineHeight: 1.1,
                letterSpacing: 6,
                padding: "4px 40px 0",
                color: p.resposta === "MITO" ? "white" : "#050505",
                background: p.resposta === "MITO" ? VERMELHO : "white",
                boxShadow: "0 10px 30px rgba(0,0,0,0.45)",
              }}
            >
              {p.resposta}
            </div>
          </div>
        </div>
      ))}

      <div className="cta" style={{ ...texto, top: 300, lineHeight: 1.05 }}>
        <div style={{ fontSize: 106 }}>Qual você ouvia como verdade?</div>
        <div style={{ fontSize: 80, color: VERMELHO, marginTop: 24 }}>
          Comenta o número
        </div>
      </div>
      <div
        className="assinatura"
        style={{
          ...texto,
          top: 650,
          fontSize: 36,
          color: "#bdbdbd",
          fontFamily: "sans-serif",
          textTransform: "none",
        }}
      >
        Dr. Fabio Schmidt, médico, CRM-SP 183549
      </div>

      {legenda ? (
        <div
          style={{
            position: "absolute",
            top: 1530,
            left: 80,
            right: 80,
            textAlign: "center",
            fontFamily: "Inter, sans-serif",
            fontWeight: 600,
            fontSize: 46,
            textTransform: "none",
            textShadow: "0 2px 8px rgba(0,0,0,0.9), 0 0 3px rgba(0,0,0,0.9)",
          }}
        >
          {legenda.texto}
        </div>
      ) : null}
    </AbsoluteFill>
  );
};
