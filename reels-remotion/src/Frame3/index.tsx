import React from "react";
import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";
import { Amassado, COR, DiscoAmbar, Etiqueta, Fundo, Relogio } from "../Colagem/papel";
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
  ESCALA_TOPO,
  ETIQUETA_BRANCA,
  EtiquetaEmBranco,
  FRAME2,
  FaixaEtapa,
  LinhaFrame2,
  Subtitulo,
  TOPO_FAIXA,
  TOPO_SUBTITULO,
  TREMOR_LEVE,
} from "../Colagem/layout";

// FRAME 3: ETAPA 1, O PRIMEIRO APERTO
// Narração:
// [Etapa um. O primeiro aperto.]
// [A pessoa chega quarenta minutos atrasada e diz que pegou trânsito.]
// [Alguma coisa aperta por dentro.]
// [Ainda não tem raiva. Não tem briga.]
// [É um incômodo tão rápido que você nem dá nome.]

export { CONFIG_FRAME3 } from "./config";
import { CONFIG_FRAME3 } from "./config";

const C = CONFIG_FRAME3;
const q = (s: number) => Math.round(s * C.fps);

// Folha em cada tranco do amassado: lisa, depois três trancos até a bolinha.
const ESTAGIOS = [
  { nivel: 0, w: 560, h: 720 },
  { nivel: 1, w: 430, h: 500 },
  { nivel: 2, w: 340, h: 350 },
  { nivel: 3, w: BOLA.r * 2, h: BOLA.r * 2 },
];

const RELOGIO = { x: 470, y: 880, r: 230 };
const MAIS40 = { x: 800, y: 1125, w: 330, h: 130, rot: 7 };
const RAIVA = { x: 540, y: 432, w: 380, h: 130, rot: -3 };
const BRIGA = { x: 540, y: 590, w: 380, h: 130, rot: 2.5 };

const Riscada: React.FC<{ w: number; h: number; progresso: number }> = ({ w, h, progresso }) => {
  const d = `M-24,${h * 0.56} C${w * 0.3},${h * 0.48} ${w * 0.6},${h * 0.62} ${w + 24},${h * 0.5}`;
  const comp = w + 80;
  return (
    <svg width={w} height={h} style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }}>
      <path
        d={d}
        fill="none"
        stroke={COR.preto}
        strokeWidth={24}
        strokeLinecap="round"
        strokeDasharray={`${comp} ${comp}`}
        strokeDashoffset={comp * (1 - progresso)}
      />
    </svg>
  );
};

export const Frame3: React.FC = () => {
  useAnton();
  const f = useCurrentFrame();

  const congelado = f >= q(C.tudoPara);
  const passo = congelado ? 0 : PASSO_PADRAO;
  // O primeiro quadro repete o último do frame 2: sem tremor.
  const pose = (id: string): Pose => (f === 0 ? POSE_ZERO : tremor(id, f, passo));

  // CENA 1: mergulho no ponto âmbar
  const ambar = FRAME2.ambar;
  const pm = interpolate(f, [0, q(C.mergulhoFim)], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.inOut(Easing.cubic),
  });
  const escalaFinal = C.discoRaioFinal / ambar.r;
  const escalaCamera = Math.pow(escalaFinal, pm);
  const focoX = ambar.x + (C.discoCentro.x - ambar.x) * pm;
  const focoY = ambar.y + (C.discoCentro.y - ambar.y) * pm;
  const pulso = 1 + 0.12 * Math.sin((f / C.fps) * Math.PI * 2 * 1.6) * (1 - pm);
  const raioDisco = ambar.r * escalaCamera * pulso;
  const discoSai = arrancar(f, q(C.discoSai), 10, [0, 1500], 14);
  const linhaVisivel = pm < 1;

  // CENA 2: etiquetas sobem para o topo
  const ps = interpolate(f, [q(C.sobeTopo), q(C.sobeTopo + C.sobeTopoDuracao)], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.inOut(Easing.quad),
  });
  const faixaY0 = C.discoCentro.y - C.discoRaioFinal + 20;
  const subY0 = faixaY0 + 160;
  const escalaTopo = 1 + (ESCALA_TOPO - 1) * ps;
  const faixaCola = colar(f, q(C.faixaEtapa1));
  const subCola = colar(f, q(C.subtitulo));

  const relCola = colar(f, q(C.relogioCola), 1.1);
  const relSai = arrancar(f, q(C.relogioSai), 6, [-1300, -250], -32);
  const pr = interpolate(f, [q(C.relogioCola), q(C.ponteirosParam)], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const freio = Math.pow(1 - pr, 3);
  const minutoFinal = 240; // ponteiro no 40
  const horaFinal = 260;
  const anguloMinuto = minutoFinal - 360 * 9 * freio;
  const anguloHora = horaFinal - 360 * 1.2 * freio;
  const m40Cola = colar(f, q(C.mais40));
  const m40Sai = arrancar(f, q(C.relogioSai) + 1, 6, [1200, 350], 30);

  // CENA 3: folha amassada em três trancos
  const folhaCola = colar(f, q(C.folhaCola));
  const trancos = C.trancosAmassado.map(q);
  let estagio = 0;
  trancos.forEach((t) => {
    if (f >= t) estagio++;
  });
  const ultimoTranco = estagio > 0 ? trancos[estagio - 1] : -99;
  const k = f - ultimoTranco;
  const amassoX = [0.82, 1.07, 0.98, 1][Math.min(Math.max(k, 0), 3)];
  const amassoY = [1.12, 0.94, 1.01, 1][Math.min(Math.max(k, 0), 3)];
  const est = ESTAGIOS[estagio];
  const poseBola = congelado ? tremor("bolinha", f, PASSO_PADRAO, TREMOR_LEVE) : pose("bolinha");

  // CENA 4: RAIVA e BRIGA, riscadas na hora
  const raivaCola = colar(f, q(C.raiva));
  const brigaCola = colar(f, q(C.briga));
  const risco = (t: number) =>
    interpolate(f, [q(t + C.riscoAtraso), q(t + C.riscoAtraso + C.riscoDuracao)], [0, 1], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: Easing.out(Easing.quad),
    });
  const raivaSai = arrancar(f, q(C.raivaSai), 6, [-1300, -420], -40);
  const brigaSai = arrancar(f, q(C.brigaSai), 6, [1300, -320], 36);

  // CENA 5: etiqueta em branco
  const brancaCola = colar(f, q(C.etiquetaBranca));

  // Trancos de câmera
  const camera = somaPoses(
    tranco(f, q(C.faixaEtapa1), 6, 4, "t-faixa"),
    tranco(f, q(C.relogioCola), 7, 4, "t-relogio"),
    tranco(f, q(C.mais40), 5, 4, "t-40"),
    ...trancos.map((t, i) => tranco(f, t, 9, 5, `t-amasso-${i}`)),
    tranco(f, q(C.raiva), 6, 4, "t-raiva"),
    tranco(f, q(C.briga), 6, 4, "t-briga"),
    tranco(f, q(C.etiquetaBranca), 5, 4, "t-branca"),
  );

  return (
    <AbsoluteFill style={{ backgroundColor: COR.fundo, overflow: "hidden" }}>
      <Fundo />
      <AbsoluteFill
        style={{ transform: `translate(${camera.x}px, ${camera.y}px) rotate(${camera.r}deg)` }}
      >
        {linhaVisivel ? (
          <AbsoluteFill
            style={{
              transformOrigin: `${ambar.x}px ${ambar.y}px`,
              transform: `translate(${focoX - ambar.x}px, ${focoY - ambar.y}px) scale(${escalaCamera})`,
            }}
          >
            <LinhaFrame2 poses={pose} />
          </AbsoluteFill>
        ) : null}

        {!discoSai.fora ? (
          <Peca
            x={focoX + discoSai.x}
            y={focoY + discoSai.y}
            rot={discoSai.r}
            escala={raioDisco / C.discoRaioFinal}
            pose={pm >= 1 ? pose("disco") : POSE_ZERO}
          >
            <DiscoAmbar r={C.discoRaioFinal} />
          </Peca>
        ) : null}

        {/* Relógio e +40 MIN */}
        {!relSai.fora ? (
          <Peca
            x={RELOGIO.x + relSai.x}
            y={RELOGIO.y + relSai.y}
            rot={-4 + relSai.r}
            escala={relCola.escala}
            visivel={relCola.visivel}
            pose={pose("relogio")}
          >
            <Relogio r={RELOGIO.r} anguloHora={anguloHora} anguloMinuto={anguloMinuto} />
          </Peca>
        ) : null}
        {!m40Sai.fora ? (
          <Peca
            x={MAIS40.x + m40Sai.x}
            y={MAIS40.y + m40Sai.y}
            rot={MAIS40.rot + m40Sai.r}
            escala={m40Cola.escala}
            visivel={m40Cola.visivel}
            pose={pose("mais40")}
          >
            <Etiqueta w={MAIS40.w} h={MAIS40.h} seed="mais40" cor={COR.vermelho} corTexto={COR.creme} texto="+40 MIN" tamanho={84} />
          </Peca>
        ) : null}

        {/* Folha amassada */}
        <Peca
          x={BOLA.x}
          y={BOLA.y}
          escala={folhaCola.escala}
          visivel={folhaCola.visivel}
          pose={poseBola}
        >
          <div style={{ transform: `scale(${amassoX}, ${amassoY})` }}>
            <Amassado w={est.w} h={est.h} nivel={est.nivel} seed="folha" />
          </div>
        </Peca>

        {/* RAIVA e BRIGA */}
        {!raivaSai.fora ? (
          <Peca
            x={RAIVA.x + raivaSai.x}
            y={RAIVA.y + raivaSai.y}
            rot={RAIVA.rot + raivaSai.r}
            escala={raivaCola.escala}
            visivel={raivaCola.visivel}
            pose={pose("raiva")}
          >
            <Etiqueta w={RAIVA.w} h={RAIVA.h} seed="raiva" texto="RAIVA" tamanho={100}>
              <Riscada w={RAIVA.w} h={RAIVA.h} progresso={risco(C.raiva)} />
            </Etiqueta>
          </Peca>
        ) : null}
        {!brigaSai.fora ? (
          <Peca
            x={BRIGA.x + brigaSai.x}
            y={BRIGA.y + brigaSai.y}
            rot={BRIGA.rot + brigaSai.r}
            escala={brigaCola.escala}
            visivel={brigaCola.visivel}
            pose={pose("briga")}
          >
            <Etiqueta w={BRIGA.w} h={BRIGA.h} seed="briga" texto="BRIGA" tamanho={100}>
              <Riscada w={BRIGA.w} h={BRIGA.h} progresso={risco(C.briga)} />
            </Etiqueta>
          </Peca>
        ) : null}

        {/* Etiqueta em branco com linha pontilhada */}
        <Peca
          x={ETIQUETA_BRANCA.x}
          y={ETIQUETA_BRANCA.y}
          rot={ETIQUETA_BRANCA.rot}
          escala={brancaCola.escala}
          visivel={brancaCola.visivel}
          pose={pose("etiqueta-branca")}
        >
          <EtiquetaEmBranco />
        </Peca>

        {/* Faixa ETAPA 1 e subtítulo */}
        <Peca
          x={TOPO_FAIXA.x}
          y={faixaY0 + (TOPO_FAIXA.y - faixaY0) * ps}
          rot={TOPO_FAIXA.rot * ps - 2 * (1 - ps)}
          escala={escalaTopo * faixaCola.escala}
          visivel={faixaCola.visivel}
          pose={pose("faixa")}
        >
          <FaixaEtapa texto="ETAPA 1" seed="faixa-etapa1" />
        </Peca>
        <Peca
          x={TOPO_SUBTITULO.x}
          y={subY0 + (TOPO_SUBTITULO.y - subY0) * ps}
          rot={TOPO_SUBTITULO.rot}
          escala={escalaTopo * subCola.escala}
          visivel={subCola.visivel}
          pose={pose("subtitulo")}
        >
          <Subtitulo texto="O PRIMEIRO APERTO" seed="subtitulo-etapa1" />
        </Peca>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

export const FRAME3_DURACAO = Math.round(CONFIG_FRAME3.fps * CONFIG_FRAME3.duracao);
