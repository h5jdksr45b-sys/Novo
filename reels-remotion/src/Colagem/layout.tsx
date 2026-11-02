import React from "react";
import { COR, CirculoNumero, CirculoVermelho, DiscoAmbar, Etiqueta, Fita, LinhaPontilhada, QuatroPintado, Seta, Amassado } from "./papel";
import { PASSO_PADRAO, Pose, tremor } from "./movimento";

// Posições compartilhadas entre os frames. O último quadro de um frame e o
// primeiro do seguinte usam estas mesmas medidas, para o corte não pular.

export const W = 1080;
export const H = 1920;
export const MARGEM = 90;
export const RODAPE_LIVRE = 360; // nenhum texto abaixo de y = 1560

// Faixa de etapa no topo (preta, letra creme). Desenhada grande e reduzida
// por ESCALA_TOPO quando assenta no topo.
export const FAIXA = { w: 600, h: 144, fonte: 92 };
export const SUBTITULO = { w: 720, h: 110, fonte: 72 };
export const ESCALA_TOPO = 2 / 3;
export const TOPO_FAIXA = { x: 540, y: MARGEM + (FAIXA.h * ESCALA_TOPO) / 2, rot: -1.2 };
export const TOPO_SUBTITULO = {
  x: 540,
  y: TOPO_FAIXA.y + (FAIXA.h * ESCALA_TOPO) / 2 + 16 + (SUBTITULO.h * ESCALA_TOPO) / 2,
  rot: 1,
};

// Bolinha amassada e etiqueta em branco (fim do frame 3, começo do frame 4).
export const BOLA = { x: 540, y: 860, r: 150 };
export const ETIQUETA_BRANCA = { x: 540, y: 1250, w: 860, h: 300, rot: -1.5 };
export const LINHA_NOME = { x: 70, y: 252, largura: 720 };

export const FaixaEtapa: React.FC<{ texto: string; seed: string }> = ({ texto, seed }) => (
  <Etiqueta w={FAIXA.w} h={FAIXA.h} seed={seed} cor={COR.preto} corTexto={COR.creme} texto={texto} tamanho={FAIXA.fonte} />
);

export const Subtitulo: React.FC<{ texto: string; seed: string }> = ({ texto, seed }) => (
  <Etiqueta w={SUBTITULO.w} h={SUBTITULO.h} seed={seed} texto={texto} tamanho={SUBTITULO.fonte} fita={false} />
);

export const Bolinha: React.FC = () => <Amassado w={BOLA.r * 2} h={BOLA.r * 2} nivel={3} seed="folha" />;

export const EtiquetaEmBranco: React.FC<{ children?: React.ReactNode }> = ({ children }) => (
  <Etiqueta w={ETIQUETA_BRANCA.w} h={ETIQUETA_BRANCA.h} seed="etiqueta-branca">
    <LinhaPontilhada x={LINHA_NOME.x} y={LINHA_NOME.y} largura={LINHA_NOME.largura} />
    {children}
  </Etiqueta>
);

// Tremor leve da bolinha no fim do frame 3.
export const TREMOR_LEVE = { desloc: 1.6, giro: 0.45 };
export const poseBolinhaFinalFrame3 = (totalQuadrosFrame3: number): Pose =>
  tremor("bolinha", totalQuadrosFrame3 - 1, PASSO_PADRAO, TREMOR_LEVE);

// Último quadro do frame 2: linha com os círculos 1, 2, 3 e 4, ponto âmbar
// e seta AQUI. Medidas tiradas do vídeo colagem-etapas.
export const FRAME2 = {
  linha: { x1: 190, x2: 760, y: 862 },
  ambar: { x: 150, y: 862, r: 21 },
  fitaAmbar: { x: 148, y: 864, w: 118, h: 50, rot: -7 },
  c2: { x: 330, y: 862, r: 62 },
  c3: { x: 560, y: 862, r: 88 },
  c4: { x: 842, y: 866, r: 117 },
  etapa4: { x: 840, y: 708, w: 212, h: 58, fonte: 40 },
  quatro: { x: 842, y: 846, altura: 225 },
  aqui: { x: 440, y: 490, w: 300, h: 150, fonte: 112, rot: -2 },
  seta: { x1: 428, y1: 572, x2: 176, y2: 834 },
};

// Tudo do frame 2 menos o ponto âmbar (que vira o disco do frame 3).
export const LinhaFrame2: React.FC<{ poses: (id: string) => Pose }> = ({ poses }) => {
  const f = FRAME2;
  const p = (id: string, x: number, y: number, rot = 0): React.CSSProperties => {
    const ps = poses(id);
    return {
      position: "absolute",
      left: x + ps.x,
      top: y + ps.y,
      transform: `translate(-50%, -50%) rotate(${rot + ps.r}deg)`,
    };
  };
  const dx = f.seta.x2 - f.seta.x1;
  const dy = f.seta.y2 - f.seta.y1;
  const comp = Math.hypot(dx, dy);
  const ang = (Math.atan2(dy, dx) * 180) / Math.PI;
  return (
    <>
      <div
        style={{
          position: "absolute",
          left: f.linha.x1,
          top: f.linha.y - 6,
          width: f.linha.x2 - f.linha.x1,
          height: 12,
          background: COR.preto,
          borderRadius: 3,
          boxShadow: "0 3px 3px rgba(0,0,0,0.5)",
        }}
      />
      <div style={p("fitaAmbar", f.fitaAmbar.x, f.fitaAmbar.y, f.fitaAmbar.rot)}>
        <div style={{ position: "relative", width: f.fitaAmbar.w, height: f.fitaAmbar.h }}>
          <Fita w={f.fitaAmbar.w} h={f.fitaAmbar.h} seed="fita-ambar" />
        </div>
      </div>
      <div style={p("c2", f.c2.x, f.c2.y)}>
        <CirculoNumero r={f.c2.r} numero="2" seed="c2" />
      </div>
      <div style={p("c3", f.c3.x, f.c3.y)}>
        <CirculoNumero r={f.c3.r} numero="3" seed="c3" />
      </div>
      <div style={p("c4", f.c4.x, f.c4.y)}>
        <CirculoVermelho r={f.c4.r} seed="c4">
          <div style={{ position: "absolute", left: f.c4.r - 72, top: f.c4.r - 70, transform: "rotate(-3deg)" }}>
            <Etiqueta w={144} h={44} seed="c4-grito" texto="GRITO" tamanho={30} fita={false} />
          </div>
          <div style={{ position: "absolute", left: f.c4.r - 70, top: f.c4.r + 28, transform: "rotate(2deg)" }}>
            <Etiqueta w={140} h={44} seed="c4-briga" texto="BRIGA" tamanho={30} fita={false} />
          </div>
        </CirculoVermelho>
      </div>
      <div style={p("quatro", f.quatro.x, f.quatro.y)}>
        <QuatroPintado altura={f.quatro.altura} />
      </div>
      <div style={p("etapa4", f.etapa4.x, f.etapa4.y, -1)}>
        <Etiqueta w={f.etapa4.w} h={f.etapa4.h} seed="etapa4" texto="ETAPA 4" tamanho={f.etapa4.fonte} />
      </div>
      <div style={p("seta", (f.seta.x1 + f.seta.x2) / 2, (f.seta.y1 + f.seta.y2) / 2, ang)}>
        <Seta comprimento={comp} seed="seta-aqui" />
      </div>
      <div style={p("aqui", f.aqui.x, f.aqui.y, f.aqui.rot)}>
        <Etiqueta w={f.aqui.w} h={f.aqui.h} seed="aqui" texto="AQUI" tamanho={f.aqui.fonte} />
      </div>
    </>
  );
};

export const DiscoAmbarFrame2 = DiscoAmbar;
