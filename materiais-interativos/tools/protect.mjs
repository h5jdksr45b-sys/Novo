// Gera versões protegidas por senha (dist/protegido/): o HTML inteiro é criptografado com
// AES-GCM 256 e chave derivada da senha por PBKDF2-SHA256 (600 mil iterações).
// O arquivo publicado não contém o texto do guia; ele só existe depois da senha certa.
// Também gera os PDFs com a mesma senha de abertura (AES-256).
// Uso: GUIA_SENHA='sua senha' node tools/protect.mjs   (rodar depois de tools/standalone.mjs)
import { readFileSync, writeFileSync, mkdirSync, existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { webcrypto as crypto } from "node:crypto";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
// a senha não diferencia maiúsculas de minúsculas: é normalizada antes de derivar a chave
const PASS = (process.env.GUIA_SENHA || "").trim().toUpperCase();
if (!PASS || PASS.length < 8) { console.error("Defina GUIA_SENHA com pelo menos 8 caracteres."); process.exit(1); }
const ITER = 600000;
const VOLS = [
  { slug: "protocolo-da-crise", title: "Protocolo da Crise", vol: "Volume I" },
  { slug: "kit-de-regulacao", title: "Kit de Regulação", vol: "Volume II" },
];
const b64 = (u8) => Buffer.from(u8).toString("base64");
mkdirSync(join(ROOT, "dist", "protegido"), { recursive: true });

for (const v of VOLS) {
  const src = join(ROOT, "dist", "arquivo", `${v.slug}.html`);
  if (!existsSync(src)) continue;
  const plain = new TextEncoder().encode(readFileSync(src, "utf8"));
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const base = await crypto.subtle.importKey("raw", new TextEncoder().encode(PASS), "PBKDF2", false, ["deriveKey"]);
  const key = await crypto.subtle.deriveKey({ name: "PBKDF2", salt, iterations: ITER, hash: "SHA-256" }, base, { name: "AES-GCM", length: 256 }, false, ["encrypt"]);
  const data = new Uint8Array(await crypto.subtle.encrypt({ name: "AES-GCM", iv }, key, plain));
  const page = gate(v, { salt: b64(salt), iv: b64(iv), iter: ITER, data: b64(data) });
  writeFileSync(join(ROOT, "dist", "protegido", `${v.slug}.html`), page);
  console.log(`ok ${v.slug}: ${(page.length / 1048576).toFixed(2)} MB`);
}

function gate(v, p) {
  return `<!doctype html>
<html lang="pt-BR">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<meta name="robots" content="noindex, nofollow">
<title>${v.title}</title>
<style>
:root { --paper: #ede5d7; --ink: #1f1a16; --muted: #7b6f63; --line: #cbbda6; --red: #9e2a22; color-scheme: light; }
@media (prefers-color-scheme: dark) { :root { --paper: #171310; --ink: #efe6d6; --muted: #9a8b7a; --line: #3d332b; --red: #e06d5e; color-scheme: dark; } }
* { box-sizing: border-box; }
html, body { height: 100%; }
body { margin: 0; background: var(--paper); color: var(--ink); font-family: Georgia, "Iowan Old Style", serif;
  display: grid; place-items: center; padding: 24px max(16px, env(safe-area-inset-right)) 24px max(16px, env(safe-area-inset-left)); }
main { width: 100%; max-width: 25rem; display: grid; gap: 1.1rem; }
.fs { font-style: italic; font-size: 1.6rem; } .fs b { color: var(--red); font-weight: 400; }
.k { font: 500 .68rem/1 ui-monospace, Menlo, monospace; letter-spacing: .2em; text-transform: uppercase; color: var(--red); }
h1 { margin: 0; font-weight: 300; font-size: 2.6rem; line-height: 1; letter-spacing: -.02em; }
p { margin: 0; color: var(--muted); font-style: italic; line-height: 1.5; }
form { display: grid; gap: .7rem; margin-top: .6rem; }
label { font: .7rem ui-monospace, Menlo, monospace; letter-spacing: .16em; text-transform: uppercase; color: var(--muted); }
input[type=password] { width: 100%; font: inherit; font-size: 1.1rem; color: var(--ink); background: transparent; border: 1px solid var(--line); border-radius: 4px; padding: .75rem .8rem; }
input[type=password]:focus { outline: 2px solid var(--red); outline-offset: 1px; }
.row { display: flex; align-items: center; gap: .5rem; font-family: system-ui, sans-serif; font-size: .85rem; color: var(--muted); }
button { font: 500 1rem system-ui, sans-serif; color: var(--paper); background: var(--ink); border: 0; border-radius: 99px; padding: .8rem 1.2rem; cursor: pointer; }
button:disabled { opacity: .6; cursor: progress; }
.err { min-height: 1.3em; font-family: system-ui, sans-serif; font-size: .85rem; color: var(--red); font-style: normal; }
small { font: .62rem ui-monospace, Menlo, monospace; letter-spacing: .14em; text-transform: uppercase; color: var(--muted); border-top: 1px solid var(--line); padding-top: .8rem; }
</style>
</head>
<body>
<main>
  <div class="fs">F<b>.</b>S</div>
  <div class="k">${v.vol} · acesso restrito</div>
  <h1>${v.title}</h1>
  <p>Digite a senha que você recebeu para abrir o guia.</p>
  <form id="f" autocomplete="on">
    <label for="pw">Senha</label>
    <input type="password" id="pw" name="password" autocomplete="current-password" required autofocus>
    <label class="row"><input type="checkbox" id="lembrar"> Lembrar neste aparelho</label>
    <button id="go" type="submit">Abrir o guia</button>
    <div class="err" id="err" role="alert"></div>
  </form>
  <small>Dr. Fábio Schmidt · médico · CRM-SP 183549</small>
</main>
<script>
(function () {
  var P = ${JSON.stringify(p)}, KEY = "fs-acesso-${v.slug}";
  function u8(s) { var b = atob(s), a = new Uint8Array(b.length); for (var i = 0; i < b.length; i++) a[i] = b.charCodeAt(i); return a; }
  async function open(pass) {
    var enc = new TextEncoder();
    var base = await crypto.subtle.importKey("raw", enc.encode(pass), "PBKDF2", false, ["deriveKey"]);
    var key = await crypto.subtle.deriveKey({ name: "PBKDF2", salt: u8(P.salt), iterations: P.iter, hash: "SHA-256" }, base, { name: "AES-GCM", length: 256 }, false, ["decrypt"]);
    var out = await crypto.subtle.decrypt({ name: "AES-GCM", iv: u8(P.iv) }, key, u8(P.data));
    var html = new TextDecoder().decode(out);
    document.open(); document.write(html); document.close();
  }
  var f = document.getElementById("f"), pw = document.getElementById("pw"), go = document.getElementById("go"), err = document.getElementById("err");
  if (!window.crypto || !crypto.subtle) { err.textContent = "Este navegador não consegue abrir o guia. Use Chrome, Safari, Edge ou Firefox atualizados."; go.disabled = true; return; }
  var saved = null; try { saved = localStorage.getItem(KEY); } catch (e) {}
  if (saved) { go.disabled = true; go.textContent = "Abrindo…"; open(saved).catch(function () { try { localStorage.removeItem(KEY); } catch (e) {} go.disabled = false; go.textContent = "Abrir o guia"; }); }
  f.addEventListener("submit", function (e) {
    e.preventDefault(); err.textContent = ""; go.disabled = true; go.textContent = "Abrindo…";
    var pass = pw.value.trim().toUpperCase();
    var keep = document.getElementById("lembrar").checked;
    open(pass).then(function () { if (keep) { try { localStorage.setItem(KEY, pass); } catch (e) {} } }, function () {
      go.disabled = false; go.textContent = "Abrir o guia"; err.textContent = "Senha incorreta. Confira e tente de novo."; pw.select();
    });
  });
})();
</script>
</body>
</html>
`;
}

// PDFs com senha de abertura (o leitor de PDF diferencia maiúsculas: a senha fica em maiúsculas)
import { execFileSync } from "node:child_process";
for (const v of VOLS) {
  const pdf = join(ROOT, "dist", `${v.slug}.pdf`);
  if (!existsSync(pdf)) continue;
  execFileSync("python3", ["-c", `
import pymupdf, sys
d = pymupdf.open(sys.argv[1])
d.save(sys.argv[2], encryption=pymupdf.PDF_ENCRYPT_AES_256, user_pw=sys.argv[3], owner_pw=sys.argv[3] + "-FS",
       permissions=pymupdf.PDF_PERM_PRINT | pymupdf.PDF_PERM_FORM | pymupdf.PDF_PERM_ACCESSIBILITY | pymupdf.PDF_PERM_ANNOTATE | pymupdf.PDF_PERM_PRINT_HQ)
`, pdf, join(ROOT, "dist", "protegido", `${v.slug}.pdf`), PASS], { stdio: "inherit" });
  console.log(`ok ${v.slug}.pdf protegido`);
}
