import { useEffect } from "react";
import {
  AbsoluteFill,
  Audio,
  Easing,
  Img,
  Sequence,
  continueRender,
  delayRender,
  interpolate,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

// Reel do cacto: ilustrações em papel creme, texto em serifa entrando
// palavra por palavra, e duas telas pretas para as viradas.
// Palavras entre *asteriscos* saem em itálico vermelho.
// Tempos em segundos. Sem narração: a fala vira texto na tela.

const VERMELHO = "#c83c1e";
const PAPEL = "#f3e9d9";
const TINTA = "#1b1714";

const SERIFA = "Bodoni Moda";
const ITALICO = "Instrument Serif";

let fontesCarregadas = false;
const carregarFontes = async () => {
  if (fontesCarregadas) {
    return;
  }
  fontesCarregadas = true;
  const espera = delayRender();
  const fontes = [
    new FontFace(
      SERIFA,
      `url('${staticFile("fonts/bodoni-moda-latin-400-normal.woff2")}')`,
      { weight: "400" },
    ),
    new FontFace(
      SERIFA,
      `url('${staticFile("fonts/bodoni-moda-latin-700-normal.woff2")}')`,
      { weight: "700" },
    ),
    new FontFace(
      ITALICO,
      `url('${staticFile("fonts/instrument-serif-italic.woff2")}')`,
      { style: "italic" },
    ),
  ];
  await Promise.all(fontes.map((f) => f.load()));
  fontes.forEach((f) => document.fonts.add(f));
  continueRender(espera);
};

type Linha = { texto: string; em: number; tamanho?: number; fina?: boolean };

type Cena = {
  dur: number;
  img?: string;
  escuro?: boolean;
  textoClaro?: boolean;
  topo?: number;
  zoom?: [number, number];
  origem?: string;
  deslize?: [number, number];
  desceY?: number;
  linhas: Linha[];
};

const CENAS: Cena[] = [
  {
    dur: 4.4,
    img: "01.jpg",
    topo: 170,
    desceY: 160,
    zoom: [1.0, 1.16],
    origem: "62% 29%",
    linhas: [
      { texto: "Chamar alguém de mau caráter por ser borderline", em: 0.2 },
      {
        texto: "é julgar o *espinho* sem nunca ter visto o *deserto.*",
        em: 1.9,
        fina: true,
      },
    ],
  },
  {
    dur: 3.4,
    img: "02.jpg",
    zoom: [1.12, 1.02],
    origem: "65% 50%",
    linhas: [
      { texto: "Você vê crise.", em: 0.1 },
      { texto: "Explosão. *Espinho.*", em: 1.1 },
    ],
  },
  {
    dur: 3.2,
    escuro: true,
    linhas: [
      { texto: "E chama de", em: 0.1, tamanho: 70 },
      { texto: "*drama.*", em: 0.8, tamanho: 130 },
      { texto: "*frescura.*", em: 1.4, tamanho: 130 },
      { texto: "gente tóxica.", em: 2.0, tamanho: 96 },
    ],
  },
  {
    dur: 3.6,
    img: "03.jpg",
    zoom: [1.0, 1.08],
    origem: "65% 55%",
    linhas: [
      { texto: "Só que isso é o *rótulo.*", em: 0.15 },
      { texto: "A história vem muito antes.", em: 1.5, fina: true },
    ],
  },
  {
    dur: 3.8,
    img: "04.jpg",
    zoom: [1.0, 1.1],
    origem: "50% 78%",
    linhas: [
      { texto: "Uma pessoa com TPB é como um cacto.", em: 0.15 },
      { texto: "Ela não *escolheu* ficar assim.", em: 1.7, fina: true },
    ],
  },
  {
    dur: 4.8,
    img: "05.jpg",
    zoom: [1.14, 1.0],
    origem: "50% 50%",
    linhas: [
      { texto: "Muitas vezes, cresceu num *deserto.*", em: 0.15 },
      {
        texto: "Sem segurança. Sem previsibilidade. Sem carinho confiável.",
        em: 1.6,
        fina: true,
      },
    ],
  },
  {
    dur: 4.4,
    img: "06.jpg",
    zoom: [1.0, 1.1],
    origem: "60% 60%",
    deslize: [-30, 10],
    linhas: [
      { texto: "Ali, ser dócil não protege.", em: 0.15 },
      {
        texto: "Ela aprende a se *defender* antes de ser ferida.",
        em: 1.6,
        fina: true,
      },
    ],
  },
  {
    dur: 3.8,
    img: "07.jpg",
    zoom: [1.06, 1.06],
    deslize: [-40, 40],
    linhas: [
      {
        texto: "Aqueles espinhos foram o jeito de continuar *existindo.*",
        em: 0.2,
      },
    ],
  },
  {
    dur: 4.8,
    img: "08.jpg",
    zoom: [1.12, 1.0],
    origem: "50% 55%",
    linhas: [
      { texto: "O mundo olha e diz: difícil de lidar.", em: 0.15 },
      {
        texto: "Ninguém pergunta que *deserto* exigiu esses espinhos.",
        em: 1.9,
        fina: true,
      },
    ],
  },
  {
    dur: 3.2,
    escuro: true,
    linhas: [
      { texto: "Ninguém acorda", em: 0.15, tamanho: 96 },
      { texto: "escolhendo", em: 0.7, tamanho: 96 },
      { texto: "*machucar.*", em: 1.25, tamanho: 150 },
    ],
  },
  {
    dur: 4.4,
    img: "09.jpg",
    textoClaro: true,
    zoom: [1.0, 1.08],
    origem: "40% 80%",
    linhas: [
      { texto: "Quem tem borderline está tentando *sobreviver*", em: 0.2 },
      {
        texto: "onde ser vulnerável sempre custou caro demais.",
        em: 1.8,
        fina: true,
      },
    ],
  },
  {
    dur: 4.2,
    img: "10.jpg",
    zoom: [1.0, 1.08],
    origem: "35% 60%",
    linhas: [
      {
        texto: "Quando encontra tratamento, previsibilidade, validação",
        em: 0.2,
      },
      { texto: "os espinhos continuam.", em: 2.0, fina: true },
    ],
  },
  {
    dur: 4.4,
    img: "11.jpg",
    topo: 170,
    zoom: [1.0, 1.1],
    origem: "50% 0%",
    linhas: [
      { texto: "Mas, pela primeira vez,", em: 0.3 },
      { texto: "tem espaço pra *flor.*", em: 1.3, tamanho: 104 },
    ],
  },
  {
    dur: 4.8,
    img: "12.jpg",
    zoom: [1.0, 1.14],
    origem: "56% 52%",
    linhas: [
      { texto: "Se você se reconhece nesse cacto,", em: 0.2 },
      {
        texto: "você sobreviveu a um *deserto* que ninguém viu.",
        em: 1.6,
        fina: true,
      },
    ],
  },
  {
    dur: 4.0,
    linhas: [
      {
        texto: "Manda pra quem ainda só enxerga *espinhos.*",
        em: 0.2,
        tamanho: 92,
      },
    ],
  },
];

export const CACTO_DURACAO_S = CENAS.reduce((s, c) => s + c.dur, 0);

const inicioCena = (i: number) =>
  CENAS.slice(0, i).reduce((s, c) => s + c.dur, 0);

// Cada palavra entra com leve subida e desfoque; *palavra* vira itálico vermelho.
const Palavras: React.FC<{
  linha: Linha;
  t: number;
  cor: string;
  centro: boolean;
}> = ({ linha, t, cor, centro }) => {
  const palavras = linha.texto.split(" ");
  const tamanho = linha.tamanho ?? (linha.fina ? 64 : 80);
  return (
    <div
      style={{
        display: "flex",
        flexWrap: "wrap",
        justifyContent: "center",
        columnGap: tamanho * 0.26,
        rowGap: 0,
        marginTop: linha.fina ? 34 : centro ? 6 : 0,
        lineHeight: 1.06,
      }}
    >
      {palavras.map((p, k) => {
        const destaque = p.startsWith("*");
        const limpa = p.replace(/\*/g, "");
        const inicio = linha.em + k * 0.07;
        const prog = interpolate(t, [inicio, inicio + 0.45], [0, 1], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
          easing: Easing.out(Easing.cubic),
        });
        return (
          <span
            key={`${p}-${k}`}
            style={{
              display: "inline-block",
              opacity: prog,
              transform: `translateY(${(1 - prog) * 22}px)`,
              filter: `blur(${(1 - prog) * 8}px)`,
              fontFamily: destaque ? ITALICO : SERIFA,
              fontStyle: destaque ? "italic" : "normal",
              fontWeight: destaque ? 400 : linha.fina ? 400 : 700,
              fontSize: destaque ? tamanho * 1.18 : tamanho,
              color: destaque ? VERMELHO : cor,
              letterSpacing: destaque ? 0 : -tamanho * 0.02,
            }}
          >
            {limpa}
          </span>
        );
      })}
    </div>
  );
};

const Grao: React.FC = () => (
  <AbsoluteFill
    style={{ mixBlendMode: "multiply", opacity: 0.18, pointerEvents: "none" }}
  >
    <svg width="100%" height="100%">
      <filter id="grao">
        <feTurbulence
          type="fractalNoise"
          baseFrequency="0.9"
          numOctaves={2}
          stitchTiles="stitch"
        />
        <feColorMatrix type="saturate" values="0" />
      </filter>
      <rect width="100%" height="100%" filter="url(#grao)" />
    </svg>
  </AbsoluteFill>
);

const CenaView: React.FC<{ cena: Cena; final: boolean }> = ({
  cena,
  final,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  const p = Math.min(1, t / cena.dur);
  const [z0, z1] = cena.zoom ?? [1, 1.06];
  const escala = interpolate(p, [0, 1], [z0, z1], {
    easing: Easing.inOut(Easing.sin),
  });
  const [d0, d1] = cena.deslize ?? [0, 0];
  const dx = interpolate(p, [0, 1], [d0, d1]);
  // Entrada curta a partir do papel e saída leve, para o corte não pesar.
  const entrada = interpolate(t, [0, 0.25], [0, 1], {
    extrapolateRight: "clamp",
  });
  const saida = final
    ? 1
    : interpolate(t, [cena.dur - 0.2, cena.dur], [1, 0.85], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      });

  const fundo = cena.escuro ? "#0b0a09" : PAPEL;
  const corTexto = cena.escuro || cena.textoClaro ? "#f3ede4" : TINTA;
  const centro = cena.escuro || !cena.img;

  return (
    <AbsoluteFill style={{ backgroundColor: fundo }}>
      {cena.img ? (
        <AbsoluteFill style={{ opacity: entrada * saida }}>
          <Img
            src={staticFile(`cacto/${cena.img}`)}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              transform: `translate(${dx}px, ${cena.desceY ?? 0}px) scale(${escala})`,
              transformOrigin: cena.origem ?? "50% 50%",
            }}
          />
        </AbsoluteFill>
      ) : null}
      {cena.img && !cena.textoClaro ? (
        <AbsoluteFill
          style={{
            background: `linear-gradient(to bottom, ${PAPEL}e6 0%, ${PAPEL}b3 22%, ${PAPEL}00 40%)`,
          }}
        />
      ) : null}
      {cena.textoClaro ? (
        <AbsoluteFill
          style={{
            background:
              "linear-gradient(to bottom, rgba(0,0,0,0.45) 0%, rgba(0,0,0,0) 40%)",
          }}
        />
      ) : null}
      <Grao />
      <div
        style={{
          position: "absolute",
          left: 90,
          right: 90,
          top: centro ? 0 : (cena.topo ?? 230),
          bottom: centro ? 0 : undefined,
          display: "flex",
          flexDirection: "column",
          justifyContent: centro ? "center" : "flex-start",
          textAlign: "center",
        }}
      >
        {cena.linhas.map((l) => (
          <Palavras
            key={l.texto}
            linha={l}
            t={t}
            cor={corTexto}
            centro={centro}
          />
        ))}
        {final ? (
          <div
            style={{
              marginTop: 70,
              fontFamily: "Inter, sans-serif",
              fontSize: 32,
              color: "#6b5f52",
              opacity: interpolate(t, [1.2, 1.8], [0, 1], {
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
              }),
            }}
          >
            Dr. Fabio Schmidt, médico, CRM-SP 183549
          </div>
        ) : null}
      </div>
    </AbsoluteFill>
  );
};

type Som = { arquivo: string; em: number; volume: number; corteFim?: number };

// Poucos efeitos, só onde a cena muda de natureza.
const SONS: Som[] = [
  { arquivo: "whoosh_fino_a.wav", em: inicioCena(2) - 0.35, volume: 0.8 },
  { arquivo: "clique_a.wav", em: inicioCena(3) + 0.45, volume: 0.7 },
  { arquivo: "swipe_d.wav", em: inicioCena(6) + 0.05, volume: 0.6 },
  { arquivo: "whoosh_fino_a.wav", em: inicioCena(9) - 0.35, volume: 0.8 },
  {
    arquivo: "riser_longo_fino.wav",
    em: inicioCena(12) + 1.3 - 5.3,
    volume: 0.7,
    corteFim: 5.3,
  },
  { arquivo: "pop.wav", em: inicioCena(12) + 1.45, volume: 0.6 },
  { arquivo: "clique_a.wav", em: inicioCena(14) + 0.3, volume: 0.6 },
];

export const CactoDeserto: React.FC = () => {
  useEffect(() => {
    carregarFontes();
  }, []);
  const { fps } = useVideoConfig();

  return (
    <AbsoluteFill style={{ backgroundColor: PAPEL }}>
      {CENAS.map((c, i) => (
        <Sequence
          key={`cena-${i}`}
          from={Math.round(inicioCena(i) * fps)}
          durationInFrames={Math.round(c.dur * fps)}
        >
          <CenaView cena={c} final={i === CENAS.length - 1} />
        </Sequence>
      ))}
      {SONS.map((s) => (
        <Sequence
          key={`${s.arquivo}-${s.em}`}
          from={Math.round(Math.max(0, s.em) * fps)}
          durationInFrames={
            s.corteFim ? Math.round(s.corteFim * fps) : undefined
          }
          layout="none"
        >
          <Audio
            src={staticFile(`sfx-pack/${s.arquivo}`)}
            volume={(f) =>
              s.corteFim
                ? s.volume *
                  interpolate(
                    f,
                    [0, 10, s.corteFim * fps - 12, s.corteFim * fps],
                    [0, 1, 1, 0],
                    { extrapolateRight: "clamp" },
                  )
                : s.volume
            }
          />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};
