import { useAudioData, visualizeAudio } from "@remotion/media-utils";
import { useEffect } from "react";
import {
  AbsoluteFill,
  Audio,
  Easing,
  interpolate,
  random,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { Anton, loadAnton } from "../load-font";
import { ENFASES, LETRA } from "./letra";

// Clipe de 30 s sobre a música enviada (o vídeo original é tela preta).
// Cada verso ganha um elemento de interface que mostra o que a letra diz.
// Legenda pequena sempre visível; texto grande só nas ênfases de letra.ts.

export const MUSICA = staticFile("clipe-musica/musica.m4a");
export const DURACAO_SEGUNDOS = 30.1;

const VERMELHO = "#c83c1e";
const CINZA = "#8a8a8a";
const CARTAO = "#121212";
const BORDA = "#262626";
const UI = "Inter, sans-serif";

const useSegundos = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return frame / fps;
};

const faixa = (
  t: number,
  de: number,
  ate: number,
  saida: [number, number] = [0, 1],
  easing = Easing.out(Easing.cubic),
) =>
  interpolate(t, [de, ate], saida, {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing,
  });

// Opacidade de um bloco que entra em de e sai em ate.
const janela = (t: number, de: number, ate: number, fade = 0.2) =>
  Math.min(faixa(t, de, de + fade), faixa(t, ate - fade, ate, [1, 0]));

const useMola = (inicio: number, rigida = false) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return spring({
    frame: frame - inicio * fps,
    fps,
    config: rigida ? { damping: 12, stiffness: 180 } : { damping: 200 },
  });
};

const cartao: React.CSSProperties = {
  position: "absolute",
  left: 90,
  width: 900,
  backgroundColor: CARTAO,
  border: `2px solid ${BORDA}`,
  borderRadius: 40,
  padding: 44,
  boxSizing: "border-box",
  fontFamily: UI,
  color: "white",
};

const rotulo: React.CSSProperties = {
  fontFamily: UI,
  fontSize: 30,
  fontWeight: 600,
  color: CINZA,
  letterSpacing: 2,
  textTransform: "uppercase",
};

// 1. Áudio no grupo: mensagem de voz que vai sendo ouvida e depois cai.
const CenaGrupo: React.FC = () => {
  const t = useSegundos();
  const entra = useMola(0.2);
  const progresso = faixa(t, 1.6, 4.4, [0, 1], Easing.linear);
  const queda = faixa(t, 4.4, 5.3, [0, 1], Easing.in(Easing.quad));
  const barras = 30;

  return (
    <div
      style={{
        ...cartao,
        top: 520,
        opacity: janela(t, 0.2, 5.6),
        transform: `translateY(${(1 - entra) * 60 + queda * 420}px) rotate(${queda * -9}deg)`,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
        <div style={{ display: "flex" }}>
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              style={{
                width: 72,
                height: 72,
                borderRadius: "50%",
                backgroundColor: ["#3a3a3a", "#4a4a4a", "#5a5a5a"][i],
                border: `4px solid ${CARTAO}`,
                marginLeft: i === 0 ? 0 : -22,
              }}
            />
          ))}
        </div>
        <div>
          <div style={{ fontSize: 46, fontWeight: 700 }}>irmãos</div>
          <div style={{ fontSize: 30, color: CINZA }}>
            {t < 4.4 ? "ouvindo..." : "ninguém online"}
          </div>
        </div>
      </div>
      <div
        style={{
          marginTop: 44,
          display: "flex",
          alignItems: "center",
          gap: 26,
          backgroundColor: "#1d1d1d",
          borderRadius: 32,
          padding: "30px 34px",
        }}
      >
        <div
          style={{
            width: 0,
            height: 0,
            borderTop: "22px solid transparent",
            borderBottom: "22px solid transparent",
            borderLeft: "34px solid white",
          }}
        />
        <div style={{ display: "flex", alignItems: "center", gap: 8, flex: 1 }}>
          {new Array(barras).fill(0).map((_, i) => (
            <div
              key={i}
              style={{
                flex: 1,
                height: 16 + random(`onda-${i}`) * 70,
                borderRadius: 6,
                backgroundColor: i / barras < progresso ? "white" : "#4a4a4a",
              }}
            />
          ))}
        </div>
        <div style={{ fontSize: 30, color: CINZA, width: 70 }}>
          0:0{Math.floor(faixa(t, 1.6, 4.4, [0, 4]))}
        </div>
      </div>
    </div>
  );
};

// 2. Nível de ar caindo enquanto a água sobe. Depois, o rótulo que chega.
const CenaAgua: React.FC = () => {
  const t = useSegundos();
  const entra = useMola(5.6);
  const agua = faixa(t, 5.6, 8.2, [0.25, 0.9], Easing.inOut(Easing.quad));
  const ar = Math.round((1 - agua) * 100);
  const mao = useMola(6.8, true);
  const pedido = useMola(7.9, true);
  const toast = useMola(9.4, true);
  const onda = (x: number) =>
    Math.sin(x / 40 + t * 6) * 10 + Math.sin(x / 23 - t * 4) * 5;
  const largura = 300;
  const alturaTanque = 520;
  const topoAgua = alturaTanque * (1 - agua);
  const caminho =
    `M 0 ${topoAgua + onda(0)} ` +
    new Array(31)
      .fill(0)
      .map((_, i) => {
        const x = (i / 30) * largura;
        return `L ${x} ${topoAgua + onda(x)}`;
      })
      .join(" ") +
    ` L ${largura} ${alturaTanque} L 0 ${alturaTanque} Z`;

  return (
    <>
      <div
        style={{
          ...cartao,
          top: 470,
          height: 680,
          display: "flex",
          gap: 50,
          opacity: janela(t, 5.6, 10.3) * faixa(t, 9.4, 9.6, [1, 0.3]),
          transform: `translateY(${(1 - entra) * 60}px)`,
        }}
      >
        <div>
          <div style={rotulo}>ar</div>
          <svg
            width={largura}
            height={alturaTanque}
            style={{
              marginTop: 20,
              borderRadius: 30,
              border: `2px solid ${BORDA}`,
              backgroundColor: "#0b0b0b",
            }}
          >
            <path d={caminho} fill="#2f5d73" />
          </svg>
        </div>
        <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
          <div
            style={{
              fontFamily: Anton,
              fontSize: 190,
              lineHeight: 1,
              color: ar < 30 ? VERMELHO : "white",
            }}
          >
            {ar}%
          </div>
          <div style={{ fontSize: 34, color: CINZA, marginTop: 10 }}>
            se afogando
          </div>
          <div
            style={{
              marginTop: 60,
              opacity: mao,
              transform: `scale(${0.8 + mao * 0.2})`,
              transformOrigin: "left center",
            }}
          >
            <div
              style={{
                display: "inline-block",
                padding: "22px 34px",
                borderRadius: 999,
                border: `2px solid ${BORDA}`,
                fontSize: 34,
                fontWeight: 600,
              }}
            >
              uma mão
            </div>
            <div style={{ fontSize: 28, color: CINZA, marginTop: 12 }}>
              muito pouco
            </div>
          </div>
          <div
            style={{
              marginTop: 40,
              opacity: pedido,
              transform: `scale(${1 - faixa(t, 8.4, 8.55, [0, 0.06]) + faixa(t, 8.55, 8.75, [0, 0.06])})`,
              transformOrigin: "left center",
            }}
          >
            <div
              style={{
                display: "inline-block",
                padding: "22px 34px",
                borderRadius: 999,
                backgroundColor: "white",
                color: "black",
                fontSize: 34,
                fontWeight: 700,
              }}
            >
              pedir ajuda
            </div>
          </div>
        </div>
      </div>
      <div
        style={{
          ...cartao,
          top: 470,
          padding: 34,
          borderRadius: 32,
          display: "flex",
          alignItems: "center",
          gap: 28,
          backgroundColor: "#1a1a1a",
          opacity: janela(t, 9.4, 10.3, 0.1),
          transform: `translateY(${(1 - toast) * -140}px)`,
        }}
      >
        <div
          style={{
            width: 76,
            height: 76,
            borderRadius: "50%",
            backgroundColor: VERMELHO,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontFamily: Anton,
            fontSize: 48,
          }}
        >
          !
        </div>
        <div>
          <div style={{ fontSize: 30, color: CINZA }}>agora</div>
          <div style={{ fontSize: 40, fontWeight: 700 }}>
            Te chamaram de louco
          </div>
        </div>
      </div>
    </>
  );
};

// 3. Formulário: tudo marcado pra agradar, e um campo que não comporta.
const CenaFormulario: React.FC = () => {
  const t = useSegundos();
  const entra = useMola(10.3);
  const opcoes = ["concordo", "tudo bem", "pode deixar"];
  const digitado = "intenso demais pra este campo, intenso demais";
  const letras = Math.floor(
    faixa(t, 12.7, 14.2, [0, digitado.length], Easing.linear),
  );
  const erro = t > 13.6;

  return (
    <div
      style={{
        ...cartao,
        top: 470,
        opacity: janela(t, 10.3, 15.0),
        transform: `translateY(${(1 - entra) * 60}px)`,
      }}
    >
      <div style={rotulo}>me mostro certa</div>
      {opcoes.map((op, i) => {
        const marca = faixa(t, 10.7 + i * 0.55, 10.9 + i * 0.55);
        return (
          <div
            key={op}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 26,
              marginTop: 30,
              fontSize: 40,
              fontWeight: 600,
            }}
          >
            <div
              style={{
                width: 54,
                height: 54,
                borderRadius: 14,
                border: `3px solid ${marca > 0.5 ? "white" : "#4a4a4a"}`,
                backgroundColor: marca > 0.5 ? "white" : "transparent",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <svg width={34} height={34} viewBox="0 0 24 24">
                <path
                  d="M4 12.5 L10 18 L20 6"
                  fill="none"
                  stroke="black"
                  strokeWidth={3.5}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeDasharray={30}
                  strokeDashoffset={30 * (1 - marca)}
                />
              </svg>
            </div>
            {op}
          </div>
        );
      })}
      <div
        style={{
          marginTop: 56,
          opacity: faixa(t, 12.5, 12.8),
        }}
      >
        <div style={{ ...rotulo, fontSize: 26 }}>meu jeito de sentir</div>
        <div
          style={{
            marginTop: 16,
            height: 100,
            borderRadius: 22,
            border: `3px solid ${erro ? VERMELHO : "#4a4a4a"}`,
            padding: "0 28px",
            display: "flex",
            alignItems: "center",
            fontSize: 38,
            whiteSpace: "nowrap",
            overflow: "visible",
          }}
        >
          {digitado.slice(0, letras)}
          <span style={{ opacity: Math.floor(t * 3) % 2 ? 1 : 0 }}>|</span>
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginTop: 14,
            fontSize: 30,
            fontWeight: 600,
            color: VERMELHO,
            opacity: erro ? 1 : 0,
          }}
        >
          <span>não cabe no comum</span>
          <span>{letras}/24</span>
        </div>
      </div>
    </div>
  );
};

// 4. Silêncio, pensamento em loop, pico e a culpa que não termina.
const CenaSilencio: React.FC = () => {
  const t = useSegundos();
  const entra = useMola(15.0);
  const digitando = t > 15.15 && t < 15.75;
  const pensamentos = ["e se", "será que", "fiz alguma coisa", "e se"];
  const pico = faixa(t, 17.6, 18.0, [0, 1], Easing.out(Easing.exp));
  const pontos = new Array(40).fill(0).map((_, i) => {
    const x = (i / 39) * 812;
    const base = 230 - random(`linha-${i}`) * 26;
    const alto = i > 30 ? (i - 30) * 24 * pico : 0;
    return `${i === 0 ? "M" : "L"} ${x} ${Math.max(10, base - alto)}`;
  });

  return (
    <div
      style={{
        ...cartao,
        top: 470,
        height: 680,
        opacity: janela(t, 15.0, 19.8),
        transform: `translateY(${(1 - entra) * 60}px)`,
      }}
    >
      <div style={{ opacity: faixa(t, 15.9, 16.1, [1, 0.35]) }}>
        <div style={{ display: "flex", justifyContent: "flex-end" }}>
          <div
            style={{
              backgroundColor: "white",
              color: "black",
              fontSize: 38,
              fontWeight: 600,
              padding: "22px 32px",
              borderRadius: 30,
            }}
          >
            oi, tá aí?
          </div>
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginTop: 14,
            fontSize: 28,
            color: CINZA,
          }}
        >
          <span style={{ display: "flex", gap: 10 }}>
            {[0, 1, 2].map((i) => (
              <span
                key={i}
                style={{
                  width: 16,
                  height: 16,
                  borderRadius: "50%",
                  backgroundColor: CINZA,
                  opacity: digitando
                    ? 0.3 + 0.7 * Math.abs(Math.sin(t * 8 - i))
                    : 0,
                }}
              />
            ))}
          </span>
          <span>visto</span>
        </div>
      </div>

      <div
        style={{
          position: "absolute",
          left: 44,
          right: 44,
          top: 230,
          opacity: janela(t, 16.0, 17.6, 0.15),
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
          <div
            style={{
              width: 56,
              height: 56,
              borderRadius: "50%",
              border: `6px solid #3a3a3a`,
              borderTopColor: "white",
              transform: `rotate(${t * 540}deg)`,
            }}
          />
          <div style={{ ...rotulo, fontSize: 30 }}>pensando</div>
        </div>
        <div
          style={{ display: "flex", flexWrap: "wrap", gap: 18, marginTop: 34 }}
        >
          {pensamentos.map((p, i) => {
            const e = faixa(t, 16.15 + i * 0.3, 16.35 + i * 0.3);
            return (
              <div
                key={i}
                style={{
                  opacity: e,
                  transform: `translateY(${(1 - e) * 20}px)`,
                  padding: "18px 28px",
                  borderRadius: 999,
                  backgroundColor: "#1f1f1f",
                  fontSize: 34,
                }}
              >
                {p}
              </div>
            );
          })}
        </div>
      </div>

      <div
        style={{
          position: "absolute",
          left: 44,
          right: 44,
          top: 230,
          opacity: janela(t, 17.6, 18.6, 0.1),
        }}
      >
        <div style={{ ...rotulo, fontSize: 30 }}>intensidade</div>
        <svg width={812} height={260} style={{ marginTop: 20 }}>
          <line
            x1={0}
            y1={250}
            x2={812}
            y2={250}
            stroke={BORDA}
            strokeWidth={3}
          />
          <path
            d={pontos.join(" ")}
            fill="none"
            stroke={pico > 0.3 ? VERMELHO : "white"}
            strokeWidth={7}
            strokeLinejoin="round"
          />
        </svg>
      </div>

      <div
        style={{
          position: "absolute",
          left: 44,
          right: 44,
          top: 260,
          opacity: janela(t, 18.6, 19.8, 0.1),
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            ...rotulo,
            fontSize: 30,
          }}
        >
          <span>culpa</span>
          <span>carregando</span>
        </div>
        <div
          style={{
            marginTop: 26,
            height: 44,
            borderRadius: 999,
            backgroundColor: "#1f1f1f",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              height: "100%",
              width: `${faixa(t, 18.6, 19.0, [40, 100])}%`,
              backgroundColor: VERMELHO,
              opacity: 0.65 + 0.35 * Math.abs(Math.sin(t * 6)),
            }}
          />
        </div>
        <div style={{ fontSize: 30, color: CINZA, marginTop: 20 }}>
          100% e não termina
        </div>
      </div>
    </div>
  );
};

// 5. Passou do ponto, a mão que não viu, a vergonha e tudo no chão.
const CenaPonto: React.FC = () => {
  const t = useSegundos();
  const entra = useMola(19.8);
  const valor = faixa(t, 20.0, 21.0, [0.2, 0.96], Easing.out(Easing.back(1.4)));
  const ponto = 0.58;
  const queda = faixa(t, 23.8, 24.9, [0, 1], Easing.in(Easing.quad));
  const trilha = 812;

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        opacity: janela(t, 19.8, 25.4),
      }}
    >
      <div
        style={{
          ...cartao,
          top: 470,
          opacity: 1 - queda * 0.85,
          transform: `translateY(${(1 - entra) * 60 + queda * 520}px) rotate(${queda * 7}deg)`,
        }}
      >
        <div style={rotulo}>limite</div>
        <div style={{ position: "relative", height: 150, marginTop: 30 }}>
          <div
            style={{
              position: "absolute",
              top: 60,
              width: trilha,
              height: 22,
              borderRadius: 999,
              backgroundColor: "#262626",
            }}
          />
          <div
            style={{
              position: "absolute",
              top: 60,
              width: trilha * Math.min(valor, ponto),
              height: 22,
              borderRadius: 999,
              backgroundColor: "white",
            }}
          />
          {valor > ponto ? (
            <div
              style={{
                position: "absolute",
                top: 60,
                left: trilha * ponto,
                width: trilha * (valor - ponto),
                height: 22,
                borderRadius: 999,
                backgroundColor: VERMELHO,
              }}
            />
          ) : null}
          <div
            style={{
              position: "absolute",
              top: 30,
              left: trilha * ponto - 3,
              width: 6,
              height: 82,
              backgroundColor: CINZA,
            }}
          />
          <div
            style={{
              position: "absolute",
              top: 120,
              left: trilha * ponto - 60,
              width: 120,
              textAlign: "center",
              fontSize: 28,
              color: CINZA,
            }}
          >
            ponto
          </div>
          <div
            style={{
              position: "absolute",
              top: 41,
              left: trilha * valor - 30,
              width: 60,
              height: 60,
              borderRadius: "50%",
              backgroundColor: valor > ponto ? VERMELHO : "white",
              border: "6px solid #121212",
              boxSizing: "border-box",
            }}
          />
        </div>
      </div>

      <div
        style={{
          ...cartao,
          top: 780,
          padding: 34,
          borderRadius: 32,
          display: "flex",
          alignItems: "center",
          gap: 26,
          opacity:
            faixa(t, 21.2, 21.5) *
            faixa(t, 22.0, 22.6, [1, 0.35]) *
            (1 - queda),
          transform: `translateY(${queda * 420}px) rotate(${queda * -6}deg)`,
        }}
      >
        <div
          style={{
            width: 20,
            height: 20,
            borderRadius: "50%",
            backgroundColor: "#5aa9c8",
          }}
        />
        <div>
          <div style={{ fontSize: 40, fontWeight: 700 }}>1 mão estendida</div>
          <div style={{ fontSize: 30, color: CINZA }}>não vista</div>
        </div>
      </div>
    </div>
  );
};

// 6. Sem sermão, sem conselho. Só o campo aberto pra resposta.
const CenaFinal: React.FC = () => {
  const t = useSegundos();
  const entra = useMola(25.4);
  const frase = "só me diz então...";
  const letras = Math.floor(
    faixa(t, 27.9, 29.0, [0, frase.length], Easing.linear),
  );
  const chips = [
    { nome: "sermão", corte: 25.6 },
    { nome: "conselho", corte: 26.9 },
  ];

  return (
    <div
      style={{
        ...cartao,
        top: 470,
        opacity: janela(t, 25.4, 30.1, 0.3),
        transform: `translateY(${(1 - entra) * 60}px)`,
      }}
    >
      <div style={rotulo}>o que eu preciso</div>
      <div style={{ display: "flex", gap: 22, marginTop: 30 }}>
        {chips.map((c) => {
          const off = faixa(t, c.corte, c.corte + 0.3);
          return (
            <div
              key={c.nome}
              style={{
                position: "relative",
                padding: "22px 34px",
                borderRadius: 999,
                border: `2px solid ${BORDA}`,
                fontSize: 38,
                fontWeight: 600,
                color: off > 0.5 ? "#5a5a5a" : "white",
              }}
            >
              {c.nome}
              <div
                style={{
                  position: "absolute",
                  left: 26,
                  top: "50%",
                  height: 5,
                  width: `calc((100% - 52px) * ${off})`,
                  backgroundColor: VERMELHO,
                }}
              />
            </div>
          );
        })}
      </div>
      <div
        style={{
          marginTop: 60,
          display: "flex",
          alignItems: "center",
          gap: 20,
          opacity: faixa(t, 27.7, 27.95),
        }}
      >
        <div
          style={{
            flex: 1,
            height: 104,
            borderRadius: 999,
            backgroundColor: "#1f1f1f",
            display: "flex",
            alignItems: "center",
            padding: "0 36px",
            fontSize: 40,
          }}
        >
          {frase.slice(0, letras)}
          <span style={{ opacity: Math.floor(t * 3) % 2 ? 1 : 0 }}>|</span>
        </div>
        <div
          style={{
            width: 104,
            height: 104,
            borderRadius: "50%",
            backgroundColor: letras === frase.length ? "white" : "#2a2a2a",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <svg width={44} height={44} viewBox="0 0 24 24">
            <path
              d="M12 19 V5 M5 12 L12 5 L19 12"
              fill="none"
              stroke={letras === frase.length ? "black" : CINZA}
              strokeWidth={3}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      </div>
    </div>
  );
};

const Enfase: React.FC = () => {
  const t = useSegundos();
  const { fps } = useVideoConfig();
  const frame = useCurrentFrame();
  const atual = ENFASES.find((e) => t >= e.inicio && t < e.fim);
  if (!atual) {
    return null;
  }
  const mola = spring({
    frame: frame - atual.inicio * fps,
    fps,
    config: { damping: 12, stiffness: 200 },
  });
  return (
    <div
      style={{
        position: "absolute",
        top: 250,
        left: 40,
        right: 40,
        textAlign: "center",
        fontFamily: Anton,
        fontSize: 150,
        lineHeight: 1,
        textTransform: "uppercase",
        color: atual.texto === "largado no chão" ? "white" : VERMELHO,
        opacity: janela(t, atual.inicio, atual.fim, 0.08),
        transform: `scale(${0.7 + mola * 0.3})`,
      }}
    >
      {atual.texto}
    </div>
  );
};

// Legenda pequena, palavra a palavra. Os tempos das palavras são
// distribuídos pelo tamanho de cada uma dentro do verso.
const Legenda: React.FC = () => {
  const t = useSegundos();
  const verso = LETRA.find((v) => t >= v.inicio && t < v.fim);
  if (!verso) {
    return null;
  }
  const palavras = verso.texto.split(" ");
  const pesos = palavras.map((p) => p.length + 2);
  const total = pesos.reduce((a, b) => a + b, 0);
  let acumulado = 0;

  return (
    <div
      style={{
        position: "absolute",
        top: 1210,
        left: 110,
        right: 110,
        textAlign: "center",
        fontFamily: UI,
        fontSize: 46,
        fontWeight: 700,
        lineHeight: 1.3,
        opacity: janela(t, verso.inicio, verso.fim, 0.08),
      }}
    >
      {palavras.map((p, i) => {
        const inicio =
          verso.inicio + (acumulado / total) * (verso.fim - verso.inicio);
        acumulado += pesos[i];
        return (
          <span key={i} style={{ color: t >= inicio ? "white" : "#5f5f5f" }}>
            {p}{" "}
          </span>
        );
      })}
    </div>
  );
};

// Player fixo embaixo: barras reagem ao áudio e a linha mostra o tempo.
const Player: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const dados = useAudioData(MUSICA);
  const barras = 48;
  const valores = dados
    ? visualizeAudio({
        fps,
        frame,
        audioData: dados,
        numberOfSamples: 64,
        optimizeFor: "speed",
      }).slice(0, barras)
    : new Array(barras).fill(0);
  const progresso = frame / durationInFrames;
  const tempo = (s: number) =>
    `0:${Math.floor(s) < 10 ? "0" : ""}${Math.floor(s)}`;

  return (
    <div
      style={{
        position: "absolute",
        top: 1360,
        left: 90,
        width: 900,
        fontFamily: UI,
      }}
    >
      <div
        style={{
          height: 90,
          display: "flex",
          alignItems: "center",
          gap: 6,
        }}
      >
        {valores.map((v, i) => (
          <div
            key={i}
            style={{
              flex: 1,
              height: 6 + Math.min(1, Math.sqrt(v) * (1.4 + i / 20)) * 84,
              borderRadius: 4,
              backgroundColor: i / barras < progresso ? "white" : "#3a3a3a",
            }}
          />
        ))}
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginTop: 14,
          fontSize: 26,
          color: CINZA,
        }}
      >
        <span>{tempo(frame / fps)}</span>
        <span>{tempo(durationInFrames / fps)}</span>
      </div>
    </div>
  );
};

export const ClipeMusica: React.FC = () => {
  useEffect(() => {
    loadAnton();
  }, []);

  return (
    <AbsoluteFill style={{ backgroundColor: "#050505", color: "white" }}>
      <Audio src={MUSICA} />
      <div
        style={{
          position: "absolute",
          top: 170,
          width: "100%",
          textAlign: "center",
          ...rotulo,
          fontSize: 26,
          letterSpacing: 6,
        }}
      >
        Borderline Sem Estigma
      </div>
      <CenaGrupo />
      <CenaAgua />
      <CenaFormulario />
      <CenaSilencio />
      <CenaPonto />
      <CenaFinal />
      <Enfase />
      <Legenda />
      <Player />
    </AbsoluteFill>
  );
};
