import { Box, CrossedOff, Underline } from "@remotion/rough-notation";
import { AbsoluteFill } from "remotion";
import {
  Assinatura,
  CheckQuebrado,
  em,
  Etiqueta,
  Faixa,
  Grande,
  Palavras,
  useAgora,
} from "./pecas";
import { CENAS, FALAS, tempoDaPalavra } from "./roteiro";
import { COR, SERIFADA, titulo } from "./estilo";

const F = FALAS;

export const Abertura: React.FC = () => {
  const t = useAgora();
  const sai = em(t, F.intro.inicio - 0.25, F.intro.inicio + 0.1, [0, 1]);
  return (
    <AbsoluteFill>
      {/* O vermelho entra de uma vez na palavra briga. */}
      <AbsoluteFill
        style={{
          backgroundColor: COR.vermelho,
          opacity: em(t, F.gancho2.inicio, F.gancho2.inicio + 0.08, [0, 1]),
          scale: em(t, F.gancho2.inicio, F.gancho2.inicio + 0.35, [1.06, 1]),
        }}
      />
      <Etiqueta
        entra={F.gancho1.inicio - 0.1}
        sai={F.intro.inicio - 0.3}
        topo={560}
        giro={-3}
        ponta="esquerda"
        tamanho={78}
        semente="gancho"
      >
        <Palavras fala={F.gancho1} />
      </Etiqueta>
      <Grande topo={860} tamanho={176} cor={COR.creme} opacidade={1 - sai}>
        <Palavras fala={F.gancho2} />
      </Grande>

      <Grande topo={560} tamanho={132} cor={COR.creme}>
        <Palavras fala={F.intro} ate={3} />
      </Grande>
      <div
        style={{
          position: "absolute",
          top: 860,
          left: 110,
          right: 110,
          textAlign: "center",
          fontFamily: SERIFADA,
          fontSize: 66,
          lineHeight: 1.2,
          color: COR.creme,
        }}
      >
        <Palavras fala={F.intro} de={3} />
      </div>
      {/* As três faixas em miniatura antecipam a estrutura do vídeo. */}
      {[0, 1, 2].map((i) => {
        const ti = tempoDaPalavra(F.intro, 0) + i * 0.16;
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              top: 1230 + i * 70,
              left: 330,
              width: 420,
              height: 46,
              backgroundColor: [COR.creme, COR.oliva, COR.grafite][i],
              opacity: em(t, ti, ti + 0.1, [0, 1]),
              translate: `${em(t, ti, ti + 0.45, [i % 2 ? 300 : -300, 0])}px 0px`,
              rotate: `${(i - 1) * 1.2}deg`,
            }}
          />
        );
      })}
    </AbsoluteFill>
  );
};

export const Dica1: React.FC = () => {
  const t = useAgora();
  return (
    <AbsoluteFill>
      <Faixa
        cor={COR.vermelho}
        numero="1"
        fala={F.d1Titulo}
        entra={{ tipo: "encolher", em: CENAS.dica1 }}
      />
      <Etiqueta
        entra={F.d1a.inicio - 0.1}
        sai={F.d1c.inicio - 0.3}
        topo={880}
        giro={-2}
        ponta="esquerda"
        semente="d1"
      >
        <Palavras fala={F.d1a} /> <Palavras fala={F.d1b} />
      </Etiqueta>
      <Grande topo={900} tamanho={116}>
        <Palavras fala={F.d1c} />
      </Grande>
      <Grande topo={1220} tamanho={76} peso={800} maiuscula={false} cor={COR.vermelho}>
        <Underline
          color={COR.tinta}
          strokeWidth={6}
          progress={em(t, F.d1d.fim - 0.3, F.d1d.fim + 0.3, [0, 1])}
        >
          <Palavras fala={F.d1d} />
        </Underline>
      </Grande>
    </AbsoluteFill>
  );
};

export const Dica2: React.FC = () => {
  const t = useAgora();
  const quebra = tempoDaPalavra(F.d2b, 1) + 0.15;
  const saiA = F.d2c.inicio - 0.3;
  return (
    <AbsoluteFill>
      <Faixa
        cor={COR.vermelho}
        numero="1"
        fala={F.d1Titulo}
        sai={{ tipo: "esquerda", em: CENAS.dica2 }}
      />
      <Faixa
        cor={COR.oliva}
        numero="2"
        fala={F.d2Titulo}
        entra={{ tipo: "direita", em: CENAS.dica2 }}
      />
      <Etiqueta
        entra={F.d2a.inicio - 0.1}
        sai={saiA}
        topo={800}
        giro={2}
        ponta="direita"
        semente="d2"
      >
        <Palavras fala={F.d2a} />
      </Etiqueta>
      <CheckQuebrado
        topo={1080}
        caixa={F.d2b.inicio - 0.3}
        marca={tempoDaPalavra(F.d2b, 0)}
        quebra={quebra}
        sai={saiA}
      />
      <Grande
        topo={1320}
        tamanho={68}
        peso={800}
        maiuscula={false}
        opacidade={em(t, saiA, saiA + 0.3, [1, 0])}
      >
        <Palavras fala={F.d2b} />
      </Grande>

      <Grande topo={900} tamanho={100}>
        <Palavras fala={F.d2c} />
      </Grande>
      <Grande topo={1190} tamanho={100} cor={COR.vermelho}>
        <Box
          color={COR.tinta}
          strokeWidth={5}
          padding={{ top: 22, right: 22, bottom: 22, left: 22 }}
          progress={em(t, F.d2d.fim - 0.3, F.d2d.fim + 0.35, [0, 1])}
        >
          <Palavras fala={F.d2d} />
        </Box>
      </Grande>
    </AbsoluteFill>
  );
};

export const Dica3: React.FC = () => {
  const t = useAgora();
  const saiA = F.d3b.inicio - 0.3;
  const risco = F.d3a.fim - 0.5;
  return (
    <AbsoluteFill>
      <Faixa
        cor={COR.oliva}
        numero="2"
        fala={F.d2Titulo}
        sai={{ tipo: "esquerda", em: CENAS.dica3 }}
      />
      <Faixa
        cor={COR.grafite}
        numero="3"
        fala={F.d3Titulo}
        entra={{ tipo: "direita", em: CENAS.dica3 }}
      />
      <Grande
        topo={800}
        tamanho={68}
        peso={800}
        maiuscula={false}
        opacidade={em(t, saiA, saiA + 0.3, [1, 0])}
      >
        <Palavras fala={F.d3a} />
      </Grande>
      {/* Exemplo de deboche, sem aspas: vai num balão e é riscado. */}
      <Etiqueta
        entra={tempoDaPalavra(F.d3a, 0) + 0.2}
        sai={saiA}
        topo={1120}
        giro={-2}
        ponta="esquerda"
        fundo={COR.etiquetaCinza}
        italico
        tamanho={60}
        semente="d3"
      >
        <CrossedOff
          color={COR.vermelho}
          strokeWidth={7}
          progress={em(t, risco, risco + 0.5, [0, 1])}
        >
          Tá, você tá super mal. Nossa, que péssimo.
        </CrossedOff>
      </Etiqueta>

      <Grande
        topo={850}
        tamanho={230}
        cor={COR.vermelho}
        opacidade={em(t, F.d3b.inicio - 0.02, F.d3b.inicio + 0.08, [0, 1])}
      >
        <span
          style={{
            display: "inline-block",
            scale: em(t, F.d3b.inicio, F.d3b.inicio + 0.45, [1.35, 1], undefined),
          }}
        >
          {F.d3b.texto}
        </span>
      </Grande>
      <Etiqueta
        entra={F.d3c.inicio - 0.1}
        topo={1180}
        giro={1.5}
        ponta="direita"
        semente="d3c"
      >
        <Palavras fala={F.d3c} />
      </Etiqueta>
    </AbsoluteFill>
  );
};

export const Fecho: React.FC = () => (
  <AbsoluteFill>
    <Faixa
      cor={COR.grafite}
      numero="3"
      fala={F.d3Titulo}
      sai={{ tipo: "cima", em: CENAS.fecho }}
    />
    <Etiqueta
      entra={F.fecho1.inicio - 0.1}
      topo={600}
      giro={-2}
      ponta="esquerda"
      semente="fecho"
    >
      <Palavras fala={F.fecho1} />
    </Etiqueta>
    <Grande topo={930} tamanho={98}>
      <Palavras fala={F.fecho2} destaque={{ de: 7, cor: COR.vermelho }} />
    </Grande>
  </AbsoluteFill>
);

const RESUMO = [
  { cor: COR.vermelho, n: "1", texto: "Não provoca pra testar" },
  { cor: COR.oliva, n: "2", texto: "Só promete o que cumpre" },
  { cor: COR.grafite, n: "3", texto: "Escuta sem deboche" },
] as const;

export const Resumo: React.FC = () => {
  const t = useAgora();
  return (
    <AbsoluteFill>
      {RESUMO.map((r, i) => {
        const ti = CENAS.resumo + 0.05 + i * 0.18;
        return (
          <div
            key={r.n}
            style={{
              position: "absolute",
              top: i * 434,
              left: 0,
              width: 1080,
              height: 434,
              backgroundColor: r.cor,
              translate: `${em(t, ti, ti + 0.55, [i % 2 ? 1080 : -1080, 0])}px 0px`,
              display: "flex",
              alignItems: "center",
              gap: 40,
              padding: "0 80px",
              boxSizing: "border-box",
              boxShadow: "0px 12px 30px rgba(30,20,10,0.22)",
            }}
          >
            <span
              style={{
                fontFamily: SERIFADA,
                fontStyle: "italic",
                fontSize: 170,
                lineHeight: 1,
                color: COR.creme,
                paddingTop: i === 0 ? 70 : 0,
              }}
            >
              {r.n}
            </span>
            <span
              style={{
                ...titulo,
                fontSize: 84,
                color: COR.creme,
                paddingTop: i === 0 ? 70 : 0,
              }}
            >
              {r.texto}
            </span>
          </div>
        );
      })}
      <Etiqueta
        entra={F.cta.inicio - 0.1}
        topo={1340}
        giro={-1.5}
        ponta="esquerda"
        tamanho={54}
        semente="cta"
      >
        <Palavras fala={F.cta} />
      </Etiqueta>
      <Assinatura entra={F.cta.fim} />
    </AbsoluteFill>
  );
};
