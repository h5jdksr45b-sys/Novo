import { Easing, interpolate, spring } from "remotion";

export const VERMELHO = "#c83c1e";
export const CINZA = "#bdbdbd";
export const BRANCO = "#f4f4f4";
export const HANDLE = "@drfabioschmidt";
export const SUBLINHA = "MÉDICO  ·  CRM-SP 183549";

// 4 s a 30 fps. Entrada nos primeiros 1,4 s, saída nos últimos 0,5 s.
export const DURACAO_LOGO = 120;
export const SAIDA = 16;

export const SUAVE = Easing.bezier(0.16, 1, 0.3, 1);
export const FIRME = Easing.bezier(0.7, 0, 0.2, 1);

export const clamp = {
  extrapolateLeft: "clamp" as const,
  extrapolateRight: "clamp" as const,
};

export const entrada = (
  frame: number,
  de: number,
  ate: number,
  from = 0,
  to = 1,
) => interpolate(frame, [de, ate], [from, to], { ...clamp, easing: SUAVE });

// Progresso de saída: 0 enquanto o logo está em cena, 1 no último quadro.
export const saida = (frame: number, total: number) =>
  interpolate(frame, [total - SAIDA, total - 1], [0, 1], {
    ...clamp,
    easing: FIRME,
  });

// Letras entrando em escada, cada uma com sua mola.
export const letra = (frame: number, fps: number, i: number, inicio: number) =>
  spring({
    frame: frame - inicio - i * 1.6,
    fps,
    config: { damping: 18, stiffness: 170, mass: 0.7 },
  });
