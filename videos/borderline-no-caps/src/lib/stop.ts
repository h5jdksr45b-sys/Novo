import { createContext, useContext } from "react";
import { random, useCurrentFrame, useVideoConfig } from "remotion";

// Stop motion a 12 qps dentro de um video a 30 qps: cada pose dura 2,5 quadros.
export const STEP = 30 / 12;
export const stepIndex = (f: number) => Math.floor(f / STEP);
export const stepped = (f: number) => stepIndex(f) * STEP;

export const clamp01 = (v: number) => Math.min(1, Math.max(0, v));

/** Progresso 0..1 em degraus de 12 qps. */
export const progress = (frame: number, start: number, dur: number) =>
  clamp01((stepped(frame) - start) / dur);

/** Quando verdadeiro, tremor e grao param (segurar o final). */
export const FrozenCtx = createContext(false);

export const useJitter = (seed: string | number, amp = 1) => {
  const frame = useCurrentFrame();
  const frozen = useContext(FrozenCtx);
  const i = frozen ? 0 : stepIndex(frame);
  return {
    x: (random(`${seed}-x-${i}`) - 0.5) * 3.2 * amp,
    y: (random(`${seed}-y-${i}`) - 0.5) * 3.2 * amp,
    r: (random(`${seed}-r-${i}`) - 0.5) * 0.9 * amp,
  };
};

/** Tranco da cena inteira quando um carimbo ou recorte bate. */
export const useShake = (impacts: number[]) => {
  const frame = useCurrentFrame();
  const amps = [16, 9, 4];
  for (const imp of impacts) {
    const d = frame - imp;
    if (d >= 0 && d < STEP * amps.length) {
      const k = stepIndex(d);
      return {
        x: (random(`shx${imp}${k}`) - 0.5) * 2 * amps[k],
        y: (random(`shy${imp}${k}`) - 0.5) * 2 * amps[k],
      };
    }
  }
  return { x: 0, y: 0 };
};

export const useLayout = () => {
  const { width, height } = useVideoConfig();
  return { W: width, H: height, horiz: width > height };
};

export const cleanId = (id: string) => id.replace(/[^a-zA-Z0-9_-]/g, "");
