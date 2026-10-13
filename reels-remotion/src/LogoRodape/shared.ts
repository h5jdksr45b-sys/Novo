import { Easing, interpolate } from "remotion";

export const VERMELHO = "#c83c1e";
export const CINZA = "#bdbdbd";
export const BRANCO = "#f4f4f4";
export const HANDLE = "@drfabioschmidt";

// Duração padrão do logo: 3,5 s a 30 fps. Sai com fade nos últimos 12 quadros.
export const DURACAO_LOGO = 105;

export const entrada = (
  frame: number,
  de: number,
  ate: number,
  from = 0,
  to = 1,
) =>
  interpolate(frame, [de, ate], [from, to], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

export const fadeFinal = (frame: number, total: number) =>
  interpolate(frame, [total - 12, total], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
