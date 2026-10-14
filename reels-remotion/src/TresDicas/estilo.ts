import { loadFont } from "@remotion/fonts";
import { staticFile } from "remotion";

export const COR = {
  papel: "#ebe3d5",
  creme: "#f7f0e4",
  tinta: "#1e1a16",
  vermelho: "#b3261e",
  oliva: "#58633a",
  grafite: "#2f2b28",
  etiqueta: "#f8f3e9",
  etiquetaCinza: "#d6d0c5",
  cinzaTexto: "#6d655c",
} as const;

export const GROTESCA = "Inter Tight";
export const SERIFADA = "Libre Caslon Text";

loadFont({
  family: GROTESCA,
  url: staticFile("fonts/inter-tight-latin-800-normal.woff2"),
  weight: "800",
});
loadFont({
  family: GROTESCA,
  url: staticFile("fonts/inter-tight-latin-900-normal.woff2"),
  weight: "900",
});
loadFont({
  family: SERIFADA,
  url: staticFile("fonts/libre-caslon-text-latin-400-normal.woff2"),
  weight: "400",
});
loadFont({
  family: SERIFADA,
  url: staticFile("fonts/libre-caslon-text-latin-400-italic.woff2"),
  weight: "400",
  style: "italic",
});

export const titulo: React.CSSProperties = {
  fontFamily: GROTESCA,
  fontWeight: 900,
  textTransform: "uppercase",
  letterSpacing: -0.5,
  lineHeight: 1,
};
