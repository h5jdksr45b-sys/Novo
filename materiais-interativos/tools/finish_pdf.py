"""Acabamento do PDF gerado pelo Chromium.

- converte as âncoras https://pdf-field.invalid/<id>?t=<tipo> em campos de formulário reais
  (texto, texto multilinha, caixa de seleção);
- carimba rodapé com título corrido e número de página (a capa fica limpa);
- grava metadados.

Uso: python3 finish_pdf.py entrada.pdf saida.pdf "Título" "TEXTO DO RODAPÉ"
"""
import os
import sys
from urllib.parse import urlparse, parse_qs, unquote

import pymupdf

src, dst, title, running = sys.argv[1:5]
heads_file = sys.argv[5] if len(sys.argv) > 5 and sys.argv[5] else None
footer_on_first = len(sys.argv) > 6 and sys.argv[6] == "all"
HERE = os.path.dirname(os.path.abspath(__file__))
MONO = os.path.join(HERE, "fonts", "PlexMono-Regular.ttf")
INK = (0.12, 0.10, 0.09)
MUTED = (0.48, 0.44, 0.39)
RED = (0.62, 0.16, 0.13)

PAPER = (0.929, 0.898, 0.843)

doc = pymupdf.open(src)
# papel em sangria total: o Chromium deixa as margens da página em branco
for page in doc:
    page.wrap_contents()
    page.draw_rect(page.rect, color=None, fill=PAPER, overlay=False)
fields = 0
seen = {}
for page in doc:
    for link in list(page.get_links()):
        uri = link.get("uri") or ""
        if not uri.startswith("https://pdf-field.invalid/"):
            continue
        u = urlparse(uri)
        name = unquote(u.path.strip("/"))
        q = parse_qs(u.query)
        kind = q.get("t", ["text"])[0]
        rect = pymupdf.Rect(link["from"])
        page.delete_link(link)
        if rect.is_empty or rect.width < 4:
            continue
        seen[name] = seen.get(name, 0) + 1
        fname = name if seen[name] == 1 else f"{name}_{seen[name]}"
        w = pymupdf.Widget()
        w.field_name = fname
        w.border_width = 0
        w.border_color = None
        w.fill_color = None
        w.text_color = INK
        w.text_font = "Helv"
        if kind in ("check", "radio"):
            w.field_type = pymupdf.PDF_WIDGET_TYPE_CHECKBOX
            w.field_value = False
            w.text_color = RED
            s = min(rect.width, rect.height)
            rect = pymupdf.Rect(rect.x0, rect.y0, rect.x0 + s, rect.y0 + s)
        else:
            w.field_type = pymupdf.PDF_WIDGET_TYPE_TEXT
            w.text_fontsize = 0 if kind == "text" else 9.5
            if kind == "area":
                w.field_flags = pymupdf.PDF_TX_FIELD_IS_MULTILINE
        w.rect = rect
        page.add_widget(w)
        fields += 1

# rodapé: título corrido à esquerda, número à direita; a capa (p. 1) fica sem rodapé
font = pymupdf.Font(fontfile=MONO)
n = len(doc)
for i, page in enumerate(doc):
    if i == 0 and not footer_on_first:
        continue
    r = page.rect
    y = r.height - 26
    tw = pymupdf.TextWriter(r)
    tw.append((42, y), running, font=font, fontsize=6.2)
    tw.write_text(page, color=MUTED)
    num = f"{i + 1:02d} / {n:02d}"
    w = font.text_length(num, fontsize=6.2)
    tw2 = pymupdf.TextWriter(r)
    tw2.append((r.width - 42 - w, y), num, font=font, fontsize=6.2)
    tw2.write_text(page, color=RED)
    page.draw_line((42, y - 9), (r.width - 42, y - 9), color=(0.80, 0.74, 0.65), width=0.4)

# o Chromium cola palavras separadas por <br> nos marcadores; restaura os títulos com espaço
if heads_file:
    import json
    proper = {}
    for h in json.load(open(heads_file, encoding="utf-8")):
        proper.setdefault("".join(h.split()), h)
    toc = doc.get_toc(simple=False)
    for item in toc:
        key = "".join(item[1].split())
        if key in proper:
            item[1] = proper[key]
    doc.set_toc(toc)

doc.set_metadata({
    "title": title,
    "author": "Dr. Fábio Schmidt · CRM-SP 183549",
    "subject": "Material psicoeducativo sobre Transtorno de Personalidade Borderline",
    "keywords": "borderline, TPB, DBT, regulação emocional, crise",
    "creator": "Borderline Sem Estigma",
})
doc.save(dst, garbage=3, deflate=True)
print(f"  {os.path.basename(dst)}: {n} páginas, {fields} campos preenchíveis")
