import { loadFont } from "@remotion/fonts";
import { staticFile } from "remotion";

// Mesmas cores e fontes do site (novo/hub.html).
export const COLORS = {
  black: "#080808",
  cream: "#F5F0EB",
  creamDim: "#bdb7ad",
  red: "#c83c1e",
  gold: "#d4a853",
  line: "rgba(245, 240, 235, 0.14)",
  bubble: "rgba(245, 240, 235, 0.10)",
};

export const FONTS = {
  title: "Playfair Display",
  mono: "JetBrains Mono",
  sans: "DM Sans",
};

// Fontes variáveis do Google Fonts (licença OFL), salvas em public/fonts
// para a renderização não depender da internet.
loadFont({
  family: FONTS.title,
  url: staticFile("fonts/PlayfairDisplay-Italic.woff2"),
  style: "italic",
  weight: "400 900",
});
loadFont({
  family: FONTS.mono,
  url: staticFile("fonts/JetBrainsMono.woff2"),
  weight: "100 800",
});
loadFont({
  family: FONTS.sans,
  url: staticFile("fonts/DMSans.woff2"),
  weight: "100 1000",
});
