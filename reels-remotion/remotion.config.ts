// See all configuration options: https://remotion.dev/docs/config
// Each option also is available as a CLI flag: https://remotion.dev/docs/cli

// Note: When using the Node.JS APIs, the config file doesn't apply. Instead, pass options directly to the APIs

import { existsSync } from "node:fs";
import { Config } from "@remotion/cli/config";

Config.setRspack(true);
Config.setVideoImageFormat("jpeg");
Config.setOverwriteOutput(true);

// Nas sessões na nuvem a Remotion não consegue baixar o próprio navegador.
// Se o Chromium pré-instalado existir, usa ele. Na sua máquina nada muda.
const CHROMIUM_NUVEM =
  "/opt/pw-browsers/chromium_headless_shell-1194/chrome-linux/headless_shell";
if (existsSync(CHROMIUM_NUVEM)) {
  Config.setBrowserExecutable(CHROMIUM_NUVEM);
}
