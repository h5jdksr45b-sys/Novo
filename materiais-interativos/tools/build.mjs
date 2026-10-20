// Monta cada volume a partir de src/: um HTML completo (dist/) e um fragmento para Artifact (dist/artifact/).
// Uso: node tools/build.mjs
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const src = (f) => readFileSync(join(ROOT, "src", f), "utf8");

const FONTS = "https://fonts.googleapis.com/css2?family=Spectral:ital,wght@0,200;0,300;0,400;0,500;0,600;1,300;1,400;1,500&family=IBM+Plex+Mono:wght@400;500&family=IBM+Plex+Sans:wght@400;500;600&display=swap";
const THREE = "https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js";

const VOLUMES = [
  { id: "vol1", slug: "protocolo-da-crise", title: "Protocolo da Crise", store: "fs-protocolo-crise",
    desc: "Guia clínico interativo para parceiros e familiares de pessoas com Transtorno de Personalidade Borderline. Dr. Fábio Schmidt, médico, CRM-SP 183549." },
  { id: "vol2", slug: "kit-de-regulacao", title: "Kit de Regulação", store: "fs-kit-regulacao",
    desc: "Dez ferramentas DBT para pessoas com Transtorno de Personalidade Borderline usarem sozinhas, antes que a crise chegue. Dr. Fábio Schmidt, médico, CRM-SP 183549." },
];

mkdirSync(join(ROOT, "dist", "artifact"), { recursive: true });
const sharedCss = src("shared.css");
const sharedJs = src("shared.js");

for (const v of VOLUMES) {
  let body, css = "", js = "";
  try { body = src(`${v.id}.body.html`); } catch { console.log(`pulando ${v.id}: sem corpo`); continue; }
  try { css = src(`${v.id}.css`); } catch {}
  try { js = src(`${v.id}.js`); } catch {}
  const head = `<title>${v.title}</title>
<meta name="claude:viewport-fit-sides" content="cover">
<meta name="description" content="${v.desc}">
<meta name="author" content="Dr. Fábio Schmidt">
<meta name="fs-store" content="${v.store}">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="${FONTS}">
<style>
${sharedCss}
${css}
</style>`;
  const tail = `<script src="${THREE}"></script>
<script>
${sharedJs}
</script>
<script>
${js}
</script>`;
  const fragment = `${head}\n${body}\n${tail}\n`;
  const full = `<!doctype html>\n<html lang="pt-BR">\n<head>\n<meta charset="utf-8">\n<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">\n${head}\n</head>\n<body>\n${body}\n${tail}\n</body>\n</html>\n`;
  writeFileSync(join(ROOT, "dist", `${v.slug}.html`), full);
  writeFileSync(join(ROOT, "dist", "artifact", `${v.slug}.html`), fragment);
  console.log(`ok ${v.slug}: ${(full.length / 1024).toFixed(0)} KB`);
}
