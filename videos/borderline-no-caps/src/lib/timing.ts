import { createContext, useContext } from "react";

export type Timing = {
  /** Inicio da cena 1. Maior que zero quando ha abertura formal (cena 0). */
  s1: number;
  sc0: { salutation: number; title: number; subtitle: number; signature: number; role: number; details: number };
  s2: number;
  s3: number;
  s4: number;
  total: number;
  sc1: { stamps: [number, number, number, number]; circle: number };
  sc2: { pathScale: number; thirdLine: number };
  sc3: { firstDrop: number; interval: number; fall: number };
  sc4: { stampAt: number; handleAt: number; freezeAt: number };
  /** Quadro em que a narracao comeca. */
  audioFrom: number;
};

/** Versao muda original: 25 s. */
export const SILENT: Timing = {
  s1: 0,
  sc0: { salutation: 0, title: 0, subtitle: 0, signature: 0, role: 0, details: 0 },
  s2: 180,
  s3: 360,
  s4: 600,
  total: 750,
  sc1: { stamps: [40, 72, 104, 136], circle: 152 },
  sc2: { pathScale: 1, thirdLine: 92 },
  sc3: { firstDrop: 30, interval: 13, fall: 12 },
  sc4: { stampAt: 40, handleAt: 62, freezeAt: 90 },
  audioFrom: 0,
};

/**
 * Versao narrada para a secretaria: abertura formal + as quatro cenas.
 * Tempos medidos na tomada unica (public/narracao.mp3, 28,9 s), deslocada 9 quadros.
 *   0,36 s Prezada secretaria | 1,58 Apresento o projeto | 2,92 um modelo operacional...
 *   8,34 Sou o doutor | 9,82 medico pos-graduado | 11,68 com dez anos | 13,52 A mesma paciente
 *   16,86 Acolhimento | 17,77 PS | 18,55 Retorno | 19,24 PS | 20,71 Na maioria das vezes
 *   23,17 Nao a paciente | 24,57 Cada um no nivel | 27,05 Borderline no CAPS
 *   28,07 Um modelo operacional | fim 28,94
 * Cenas 1 a 4 usam quadros locais (a partir do inicio de cada cena).
 */
export const NARRATED: Timing = {
  s1: 412,
  sc0: { salutation: 18, title: 54, subtitle: 95, signature: 257, role: 302, details: 357 },
  s2: 627,
  s3: 743,
  s4: 817,
  total: 947,
  sc1: { stamps: [98, 125, 149, 169], circle: 183 },
  sc2: { pathScale: 0.64, thirdLine: 75 },
  sc3: { firstDrop: 12, interval: 4, fall: 8 },
  sc4: { stampAt: 29, handleAt: 60, freezeAt: 70 },
  audioFrom: 9,
};

export const TimingCtx = createContext<Timing>(SILENT);
export const useTiming = () => useContext(TimingCtx);
