import React, { useEffect, useState } from "react";
import { continueRender, delayRender, random, staticFile } from "remotion";

// Regras de movimento comuns aos frames da série de colagem.
// Stop motion: cada recorte troca de pose a cada PASSO quadros.

export const PASSO_PADRAO = 3;
export const TREMOR_PADRAO = { desloc: 2.5, giro: 0.6 };

export type Pose = { x: number; y: number; r: number };

export const POSE_ZERO: Pose = { x: 0, y: 0, r: 0 };

// Pose de tremor de um recorte. passo 0 desliga o tremor.
export const tremor = (
  seed: string,
  frame: number,
  passo: number,
  amp = TREMOR_PADRAO,
): Pose => {
  if (passo <= 0) return POSE_ZERO;
  const k = Math.floor(frame / passo);
  return {
    x: (random(`${seed}-x-${k}`) - 0.5) * 2 * amp.desloc,
    y: (random(`${seed}-y-${k}`) - 0.5) * 2 * amp.desloc,
    r: (random(`${seed}-r-${k}`) - 0.5) * 2 * amp.giro,
  };
};

// Colar: o recorte bate na mesa e assenta em 4 quadros.
// forca aumenta o tranco.
export const colar = (frame: number, inicio: number, forca = 1) => {
  if (frame < inicio) return { visivel: false, escala: 1 };
  const k = frame - inicio;
  const curva = [1 + 0.32 * forca, 1 - 0.09 * forca, 1 + 0.035 * forca, 1];
  return { visivel: true, escala: curva[Math.min(k, curva.length - 1)] };
};

// Arrancar: o recorte é puxado para fora do quadro em `duracao` quadros.
export const arrancar = (
  frame: number,
  inicio: number,
  duracao: number,
  direcao: [number, number],
  giro: number,
) => {
  if (frame < inicio) return { fora: false, x: 0, y: 0, r: 0, escala: 1 };
  const p = (frame - inicio + 1) / duracao;
  if (p > 1) return { fora: true, x: 0, y: 0, r: 0, escala: 1 };
  const e = Math.pow(p, 1.4);
  return { fora: false, x: direcao[0] * e, y: direcao[1] * e, r: giro * e, escala: 1 + 0.06 * p };
};

// Tranco de câmera: o quadro inteiro chacoalha e o tremor some em `duracao`.
export const tranco = (
  frame: number,
  inicio: number,
  amplitude: number,
  duracao: number,
  seed: string,
): Pose => {
  const k = frame - inicio;
  if (k < 0 || k >= duracao) return POSE_ZERO;
  const queda = 1 - k / duracao;
  return {
    x: (random(`${seed}-cx-${k}`) - 0.5) * 2 * amplitude * queda,
    y: (random(`${seed}-cy-${k}`) - 0.5) * 2 * amplitude * queda,
    r: (random(`${seed}-cr-${k}`) - 0.5) * amplitude * 0.08 * queda,
  };
};

export const somaPoses = (...poses: Pose[]): Pose =>
  poses.reduce((a, b) => ({ x: a.x + b.x, y: a.y + b.y, r: a.r + b.r }), POSE_ZERO);

// Recorte posicionado pelo centro.
export const Peca: React.FC<{
  x: number;
  y: number;
  rot?: number;
  escala?: number;
  pose?: Pose;
  z?: number;
  visivel?: boolean;
  children: React.ReactNode;
}> = ({ x, y, rot = 0, escala = 1, pose = POSE_ZERO, z, visivel = true, children }) => {
  if (!visivel) return null;
  return (
    <div
      style={{
        position: "absolute",
        left: x + pose.x,
        top: y + pose.y,
        zIndex: z,
        transform: `translate(-50%, -50%) rotate(${rot + pose.r}deg) scale(${escala})`,
      }}
    >
      {children}
    </div>
  );
};

// Carrega Anton antes do primeiro quadro.
let antonPronta: Promise<void> | null = null;
export const useAnton = () => {
  const [handle] = useState(() => delayRender("Carregando Anton"));
  useEffect(() => {
    if (!antonPronta) {
      const fonte = new FontFace("Anton", `url('${staticFile("fonts/anton.woff2")}') format('woff2')`);
      antonPronta = fonte.load().then((f) => {
        document.fonts.add(f);
      });
    }
    antonPronta.then(() => continueRender(handle)).catch(() => continueRender(handle));
  }, [handle]);
};
