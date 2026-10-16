import { staticFile } from "remotion";

export const C = {
  bg: "#101214",
  surface: "#181B1F",
  line: "#2A2F35",
  text: "#EDEAE4",
  muted: "#8C9198",
  accent: "#E2B451",
  accentSoft: "rgba(226,180,81,0.12)",
};

export const SAFE = { x: 90, top: 220, bottom: 380 };
export const FONT = "InterLocal, Inter, sans-serif";

export const fontCss = [400, 500, 600, 700]
  .map((w) => {
    const name = { 400: "Regular", 500: "Medium", 600: "SemiBold", 700: "Bold" }[w];
    return `@font-face{font-family:InterLocal;font-weight:${w};src:url(${staticFile(`fonts/Inter-${name}.otf`)}) format("opentype");}`;
  })
  .join("");
