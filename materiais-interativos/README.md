# Materiais interativos · Borderline Sem Estigma

Edições interativas dos guias clínicos do Dr. Fábio Schmidt, publicadas **com senha**.

| Volume | Página interativa (com senha) | PDF (com senha) |
|---|---|---|
| I · Protocolo da Crise | `dist/protegido/protocolo-da-crise.html` | `dist/protegido/protocolo-da-crise.pdf` |
| II · Kit de Regulação | `dist/protegido/kit-de-regulacao.html` | `dist/protegido/kit-de-regulacao.pdf` |

O repositório é público, então o texto aberto dos guias não fica aqui. As páginas protegidas são
criptografadas (AES-GCM 256, chave derivada da senha por PBKDF2, 600 mil iterações) e só abrem com a senha.
Na página, a senha não diferencia maiúsculas de minúsculas; no PDF, digite em maiúsculas.

## Originais

`originais.tgz.enc` guarda as fontes dos volumes e as versões abertas (HTML, PDF), criptografados com a mesma senha:

```
openssl enc -d -aes-256-cbc -pbkdf2 -iter 600000 -in originais.tgz.enc | tar xzf -
```

## Como gerar de novo

```
node tools/build.mjs                         # monta os HTML a partir de src/
node tools/pdf.mjs                           # PDFs A4 preenchíveis (Chromium do Playwright + PyMuPDF)
node tools/standalone.mjs                    # arquivo único, funciona sem internet
GUIA_SENHA='...' node tools/protect.mjs      # versões com senha em dist/protegido/
```

Para trocar a senha, rode só o último passo com a senha nova e recriptografe `originais.tgz.enc`.
Quem já tem a senha antiga deixa de conseguir abrir as novas versões.
