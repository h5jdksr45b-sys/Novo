import React from "react";
import { AbsoluteFill, interpolate, random, useCurrentFrame } from "remotion";
import { COR, CirculoVermelho, Etiqueta, Fita, Fundo, Relogio, Seta } from "../Colagem/papel";
import {
  PASSO_PADRAO,
  POSE_ZERO,
  Peca,
  Pose,
  arrancar,
  colar,
  somaPoses,
  tranco,
  tremor,
  useAnton,
} from "../Colagem/movimento";
import {
  BOLA,
  Bolinha,
  ESCALA_TOPO,
  ETIQUETA_BRANCA,
  EtiquetaEmBranco,
  FaixaEtapa,
  Subtitulo,
  TOPO_FAIXA,
  TOPO_SUBTITULO,
  poseBolinhaFinalFrame3,
} from "../Colagem/layout";
import escrita from "./escrita.json";

// FRAME 4: ETAPA 2 e ETAPA 3, até o grito
// Narração:
// [Se ninguém percebe, vem a etapa dois.]
// [A cabeça explica o aperto com a pior versão: não se importa comigo.]
// [Etapa três. O corpo acelera, e tudo precisa ser resolvido agora.]
// [E aí vem o grito.]

// Tempos em segundos. Ajuste aqui para alinhar com a narração.
export const CONFIG_FRAME4 = {
  fps: 30,
  duracao: 10,
  cenas: {
    etapa2: { inicio: 0, fim: 1.6 },
    piorVersao: { inicio: 1.6, fim: 4.8 },
    etapa3: { inicio: 4.8, fim: 7.8 },
    grito: { inicio: 7.8, fim: 10.0 },
  },
  // Cena 1
  etapa1Arranca: 0.5,
  etapa2Cola: 1.05,
  // Cena 2
  escritaInicio: 2.2,
  escritaFim: 4.6, // termina junto com a palavra comigo
  bolinhaTrancos: [3.0, 3.9],
  bolinhaEscalas: [1, 1.28, 1.58],
  // Cena 3
  etapa2Arranca: 4.8,
  etapa3Cola: 5.0,
  recortes: {
    relogio: 5.25,
    seta1: 5.5,
    fita1: 5.65,
    seta2: 5.8,
    fita2: 5.95,
    seta3: 6.1,
    fita3: 6.3,
    fita4: 6.5,
  },
  agora: 7.3,
  // Cena 4
  limpa: 7.8,
  limpaQuadros: 4,
  circulo: 8.15,
  semTremorQuadrosFinais: 10,
  // Tremor de stop motion: troca de pose a cada N quadros
  passoNormal: PASSO_PADRAO,
  passoAcelerado: 1,
};

const C = CONFIG_FRAME4;
const q = (s: number) => Math.round(s * C.fps);
const TOTAL = C.fps * C.duracao;

const RELOGIO = { x: 235, y: 440, r: 125, rot: -9 };
const SETAS = [
  { id: "seta1", x: 850, y: 470, rot: -48, cor: COR.vermelho, comp: 220 },
  { id: "seta2", x: 205, y: 1010, rot: 145, cor: COR.preto, comp: 200 },
  { id: "seta3", x: 880, y: 1010, rot: 28, cor: COR.vermelho, comp: 210 },
] as const;
const FITAS = [
  { id: "fita1", x: 400, y: 640, w: 150, rot: 34 },
  { id: "fita2", x: 735, y: 1090, w: 170, rot: -22 },
  { id: "fita3", x: 330, y: 1085, w: 140, rot: 12 },
  { id: "fita4", x: 760, y: 650, w: 130, rot: -38 },
] as const;
const AGORA = { x: 540, y: 905, w: 780, h: 290, rot: -6 };
const CIRCULO = { x: 540, y: 860, r: 300 };

// Tempo de cada letra, proporcional ao tamanho do traço, com pausas nos
// espaços e na troca de linha.
type Letra = { ch: string; linha: number; d: string; len: number };
const letras = escrita.letras as Letra[];
const pesoMedio = letras.filter((l) => l.len > 0).reduce((a, l) => a + l.len, 0) / letras.filter((l) => l.len > 0).length;
const pesos = letras.map((l, i) => {
  if (l.ch === " ") return pesoMedio * 0.35;
  const trocaLinha = i > 0 && letras[i - 1].linha !== l.linha;
  return l.len + (trocaLinha ? pesoMedio * 0.5 : 0);
});
const pesoTotal = pesos.reduce((a, b) => a + b, 0);
const janelas = (() => {
  const ini = C.escritaInicio * C.fps;
  const dur = (C.escritaFim - C.escritaInicio) * C.fps;
  let acc = 0;
  return letras.map((l, i) => {
    const trocaLinha = i > 0 && letras[i - 1].linha !== l.linha;
    const atraso = trocaLinha ? pesoMedio * 0.5 : 0;
    const s = ini + ((acc + atraso) / pesoTotal) * dur;
    acc += pesos[i];
    const e = ini + (acc / pesoTotal) * dur;
    return [s, e] as const;
  });
})();

// Caneta vermelha grossa: um traço largo corre pelo contorno de cada letra,
// recortado pela própria letra, com stroke-dashoffset.
const Escrita: React.FC<{ frame: number }> = ({ frame }) => (
  <svg
    width={escrita.largura}
    height={escrita.altura}
    style={{ position: "absolute", left: 0, top: 38, overflow: "visible" }}
  >
    <defs>
      {letras.map((l, i) => (l.d ? (
        <clipPath key={i} id={`letra-${i}`}>
          <path d={l.d} />
        </clipPath>
      ) : null))}
    </defs>
    {letras.map((l, i) => {
      if (!l.d) return null;
      const [s, e] = janelas[i];
      const p = interpolate(frame, [s, e], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
      if (p <= 0) return null;
      if (p >= 1) return <path key={i} d={l.d} fill={COR.tinta} />;
      const comp = l.len * 1.02;
      return (
        <path
          key={i}
          d={l.d}
          fill="none"
          stroke={COR.tinta}
          strokeWidth={34}
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeDasharray={`${comp} ${comp}`}
          strokeDashoffset={comp * (1 - p)}
          clipPath={`url(#letra-${i})`}
        />
      );
    })}
  </svg>
);

// Direção de saída de cada recorte na limpeza: para fora, a partir do centro.
const saida = (id: string, x: number, y: number) => {
  const dx = x - 540;
  const dy = y - 860;
  const d = Math.hypot(dx, dy) || 1;
  const ang = Math.atan2(dy, dx) + (random(`${id}-ang`) - 0.5) * 0.6;
  const forca = 1900 + random(`${id}-dist`) * 500;
  return {
    dir: [Math.cos(ang) * forca * (d > 40 ? 1 : 0.6), Math.sin(ang) * forca] as [number, number],
    giro: (random(`${id}-giro`) - 0.5) * 120,
  };
};

export const Frame4: React.FC = () => {
  useAnton();
  const f = useCurrentFrame();

  const congelado = f >= TOTAL - C.semTremorQuadrosFinais;
  const passo = congelado
    ? 0
    : f >= q(C.etapa2Arranca) && f < q(C.limpa)
      ? C.passoAcelerado
      : C.passoNormal;
  // O primeiro quadro repete o último do frame 3: só a bolinha tem pose.
  const pose = (id: string): Pose => (f === 0 ? POSE_ZERO : tremor(id, f, passo));
  const poseBola = f === 0 ? poseBolinhaFinalFrame3() : tremor("bolinha", f, passo);

  // Limpeza da cena 4: tudo sai em 4 quadros
  const limpa = (id: string, x: number, y: number) => {
    const s = saida(id, x, y);
    return arrancar(f, q(C.limpa), C.limpaQuadros, s.dir, s.giro);
  };

  // CENA 1: ETAPA 1 arrancada, ETAPA 2 colada
  const e1 = arrancar(f, q(C.etapa1Arranca), 8, [-520, -640], -28);
  const sub1 = arrancar(f, q(C.etapa1Arranca) + 1, 8, [620, -760], 22);
  const e2Cola = colar(f, q(C.etapa2Cola), 1.2);
  const e2Sai = arrancar(f, q(C.etapa2Arranca), 5, [560, -620], 30);
  const e3Cola = colar(f, q(C.etapa3Cola), 1.3);
  const e3Sai = limpa("faixa3", TOPO_FAIXA.x, TOPO_FAIXA.y);

  // CENA 2: bolinha cresce em dois trancos
  const trancosBola = C.bolinhaTrancos.map(q);
  let nivelBola = 0;
  trancosBola.forEach((t) => {
    if (f >= t) nivelBola++;
  });
  const kb = nivelBola > 0 ? f - trancosBola[nivelBola - 1] : 99;
  const sobra = [0.14, -0.05, 0.02, 0][Math.min(Math.max(kb, 0), 3)];
  const escalaBola = C.bolinhaEscalas[nivelBola] * (1 + (nivelBola > 0 ? sobra : 0));
  const bolaSai = limpa("bolinha", BOLA.x, BOLA.y - 1);
  const etqSai = limpa("etiqueta", ETIQUETA_BRANCA.x, ETIQUETA_BRANCA.y);

  // CENA 3: recortes em volta, AGORA carimbado
  const R = C.recortes;
  const relCola = colar(f, q(R.relogio), 1.2);
  const relSai = limpa("relogio", RELOGIO.x, RELOGIO.y);
  const anguloMinuto = (f - q(R.relogio)) * 41;
  const anguloHora = (f - q(R.relogio)) * 7;
  const agoraCola = colar(f, q(C.agora), 2.4);
  const agoraSai = limpa("agora", AGORA.x, AGORA.y + 30);

  // CENA 4: círculo vermelho com GRITO, o maior tranco
  const circCola = colar(f, q(C.circulo), 3.2);

  const camera = somaPoses(
    tranco(f, q(C.etapa2Cola), 7, 4, "t-e2"),
    ...trancosBola.map((t, i) => tranco(f, t, 10, 5, `t-bola-${i}`)),
    tranco(f, q(C.etapa3Cola), 8, 4, "t-e3"),
    tranco(f, q(C.agora), 24, 8, "t-agora"),
    tranco(f, q(C.circulo), 38, 10, "t-grito"),
  );

  const visivelAte = (sai: { fora: boolean }) => !sai.fora;

  return (
    <AbsoluteFill style={{ backgroundColor: COR.fundo, overflow: "hidden" }}>
      <Fundo />
      <AbsoluteFill
        style={{ transform: `translate(${camera.x}px, ${camera.y}px) rotate(${camera.r}deg)` }}
      >
        {/* Bolinha */}
        {visivelAte(bolaSai) ? (
          <Peca
            x={BOLA.x + bolaSai.x}
            y={BOLA.y + bolaSai.y}
            rot={bolaSai.r}
            escala={escalaBola * bolaSai.escala}
            pose={poseBola}
          >
            <Bolinha />
          </Peca>
        ) : null}

        {/* Etiqueta com a escrita */}
        {visivelAte(etqSai) ? (
          <Peca
            x={ETIQUETA_BRANCA.x + etqSai.x}
            y={ETIQUETA_BRANCA.y + etqSai.y}
            rot={ETIQUETA_BRANCA.rot + etqSai.r}
            pose={pose("etiqueta-branca")}
          >
            <EtiquetaEmBranco>
              <Escrita frame={f} />
            </EtiquetaEmBranco>
          </Peca>
        ) : null}

        {/* Recortes da etapa 3 */}
        {visivelAte(relSai) ? (
          <Peca
            x={RELOGIO.x + relSai.x}
            y={RELOGIO.y + relSai.y}
            rot={RELOGIO.rot + relSai.r}
            escala={relCola.escala}
            visivel={relCola.visivel}
            pose={pose("relogio")}
          >
            <Relogio r={RELOGIO.r} anguloHora={anguloHora} anguloMinuto={anguloMinuto} />
          </Peca>
        ) : null}
        {SETAS.map((s) => {
          const cola = colar(f, q(R[s.id]), 1.1);
          const sai = limpa(s.id, s.x, s.y);
          if (sai.fora) return null;
          return (
            <Peca
              key={s.id}
              x={s.x + sai.x}
              y={s.y + sai.y}
              rot={s.rot + sai.r}
              escala={cola.escala}
              visivel={cola.visivel}
              pose={pose(s.id)}
            >
              <Seta comprimento={s.comp} haste={34} pontaLargura={96} pontaComprimento={84} cor={s.cor} seed={s.id} />
            </Peca>
          );
        })}
        {FITAS.map((t) => {
          const cola = colar(f, q(R[t.id]), 0.8);
          const sai = limpa(t.id, t.x, t.y);
          if (sai.fora) return null;
          return (
            <Peca
              key={t.id}
              x={t.x + sai.x}
              y={t.y + sai.y}
              rot={t.rot + sai.r}
              escala={cola.escala}
              visivel={cola.visivel}
              pose={pose(t.id)}
            >
              <div style={{ position: "relative", width: t.w, height: 46 }}>
                <Fita w={t.w} h={46} seed={t.id} />
              </div>
            </Peca>
          );
        })}

        {/* Topo: ETAPA 1 sai, ETAPA 2 entra, ETAPA 3 entra */}
        {visivelAte(sub1) ? (
          <Peca
            x={TOPO_SUBTITULO.x + sub1.x}
            y={TOPO_SUBTITULO.y + sub1.y}
            rot={TOPO_SUBTITULO.rot + sub1.r}
            escala={ESCALA_TOPO}
            pose={pose("subtitulo")}
          >
            <Subtitulo texto="O PRIMEIRO APERTO" seed="subtitulo-etapa1" />
          </Peca>
        ) : null}
        {visivelAte(e1) ? (
          <Peca
            x={TOPO_FAIXA.x + e1.x}
            y={TOPO_FAIXA.y + e1.y}
            rot={TOPO_FAIXA.rot + e1.r}
            escala={ESCALA_TOPO * e1.escala}
            pose={pose("faixa")}
          >
            <FaixaEtapa texto="ETAPA 1" seed="faixa-etapa1" />
          </Peca>
        ) : null}
        {visivelAte(e2Sai) ? (
          <Peca
            x={TOPO_FAIXA.x + e2Sai.x}
            y={TOPO_FAIXA.y + e2Sai.y}
            rot={0.8 + e2Sai.r}
            escala={ESCALA_TOPO * e2Cola.escala}
            visivel={e2Cola.visivel}
            pose={pose("faixa2")}
          >
            <FaixaEtapa texto="ETAPA 2" seed="faixa-etapa2" />
          </Peca>
        ) : null}
        {visivelAte(e3Sai) ? (
          <Peca
            x={TOPO_FAIXA.x + e3Sai.x}
            y={TOPO_FAIXA.y + e3Sai.y}
            rot={-1.6 + e3Sai.r}
            escala={ESCALA_TOPO * e3Cola.escala}
            visivel={e3Cola.visivel}
            pose={pose("faixa3")}
          >
            <FaixaEtapa texto="ETAPA 3" seed="faixa-etapa3" />
          </Peca>
        ) : null}

        {/* AGORA carimbado por cima de tudo */}
        {visivelAte(agoraSai) ? (
          <Peca
            x={AGORA.x + agoraSai.x}
            y={AGORA.y + agoraSai.y}
            rot={AGORA.rot + agoraSai.r}
            escala={agoraCola.escala}
            visivel={agoraCola.visivel}
            pose={pose("agora")}
            z={5}
          >
            <Etiqueta w={AGORA.w} h={AGORA.h} seed="agora" cor={COR.vermelho} corTexto={COR.creme} texto="AGORA" tamanho={230} />
          </Peca>
        ) : null}

        {/* Círculo vermelho com GRITO */}
        <Peca
          x={CIRCULO.x}
          y={CIRCULO.y}
          escala={circCola.escala}
          visivel={circCola.visivel}
          pose={pose("circulo")}
          z={6}
        >
          <CirculoVermelho r={CIRCULO.r} seed="circulo-grito">
            <div style={{ position: "absolute", left: CIRCULO.r - 210, top: CIRCULO.r - 85, transform: "rotate(-3deg)" }}>
              <Etiqueta w={420} h={170} seed="grito" texto="GRITO" tamanho={136} />
            </div>
          </CirculoVermelho>
        </Peca>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

export const FRAME4_DURACAO = TOTAL;
