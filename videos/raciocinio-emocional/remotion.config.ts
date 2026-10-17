import { Config } from "@remotion/cli/config";
import { existsSync } from "node:fs";

Config.setVideoImageFormat("jpeg");

// No ambiente na nuvem, usa o Chromium já instalado em vez de baixar outro.
const chromiumLocal =
  "/opt/pw-browsers/chromium_headless_shell-1194/chrome-linux/headless_shell";
if (existsSync(chromiumLocal)) {
  Config.setBrowserExecutable(chromiumLocal);
}
