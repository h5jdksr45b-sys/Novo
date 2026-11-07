import { loadFont as loadLocal } from "@remotion/fonts";
import { loadFont as loadAnton } from "@remotion/google-fonts/Anton";
import { loadFont as loadSpecialElite } from "@remotion/google-fonts/SpecialElite";
import { staticFile } from "remotion";

// Padrao: os mesmos arquivos do Google Fonts, guardados em public/fonts (OFL),
// para o render nao depender de rede. Com REMOTION_FONTS=google, carrega direto
// pelo @remotion/google-fonts.
const useGoogle = process.env.REMOTION_FONTS === "google";

const local = (family: string, file: string) => {
  loadLocal({ family, url: staticFile(`fonts/${file}`), weight: "400", format: "woff2" });
  return family;
};

export const TITLE_FONT = useGoogle
  ? loadAnton("normal", { weights: ["400"], subsets: ["latin"] }).fontFamily
  : local("Anton", "Anton-latin.woff2");
export const TYPE_FONT = useGoogle
  ? loadSpecialElite("normal", { weights: ["400"], subsets: ["latin"] }).fontFamily
  : local("Special Elite", "SpecialElite-latin.woff2");

export const C = {
  kraft: "#b4875a",
  kraftDark: "#7c5532",
  kraftLight: "#d4b386",
  cream: "#efe5cf",
  creamDark: "#e2d2b0",
  ink: "#1d1a17",
  red: "#b3261e",
  tape: "rgba(228, 214, 172, 0.80)",
};

export const SAFE = 120;
