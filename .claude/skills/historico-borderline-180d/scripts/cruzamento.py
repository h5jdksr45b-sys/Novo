#!/usr/bin/env python3
"""Tabelas descritivas do historico: horario, dia da semana, mes, eixo e chamada.

Uso (a partir da pasta da skill):
    python3 -I scripts/cruzamento.py              # Reels
    python3 -I scripts/cruzamento.py --fmt C      # carrosseis

Mostra mediana e n de cada grupo, metrica por metrica. Nao calcula nota,
limiar nem previsao. Posts com menos de 7 dias ficam de fora.
"""
import argparse
import datetime as dt
import statistics as st
import sys
from collections import defaultdict

sys.path.insert(0, __import__("pathlib").Path(__file__).resolve().parent.as_posix())
from resumo import carregar  # noqa: E402

FAIXAS = [(0, 6, "00-06h"), (6, 12, "06-12h"), (12, 15, "12-15h"), (15, 18, "15-18h"),
          (18, 21, "18-21h"), (21, 24, "21-24h")]
DIAS = ["seg", "ter", "qua", "qui", "sex", "sab", "dom"]
METR = [("alcance", "alcance"), ("compart", "compart"), ("salvos", "salvos"),
        ("ret_ms", "ret s"), ("skip3s", "saida 3s")]


def faixa(h):
    for a, b, nome in FAIXAS:
        if a <= h < b:
            return nome


def num(v):
    return float(v) if v not in ("", None) else None


def tabela(titulo, grupos, ordem, fmt):
    cols = [m for m in METR if fmt == "R" or m[0] not in ("ret_ms", "skip3s")]
    print(f"\n{titulo}")
    print(f"  {'grupo':10} {'n':>4} " + " ".join(f"{c[1]:>9}" for c in cols))
    for g in ordem:
        rs = grupos.get(g)
        if not rs:
            continue
        cel = []
        for k, _ in cols:
            vals = [num(r[k]) for r in rs if num(r[k]) is not None]
            if not vals:
                cel.append(f"{'-':>9}")
                continue
            m = st.median(vals)
            if k == "ret_ms":
                cel.append(f"{m / 1000:>9.1f}")
            elif k == "skip3s":
                cel.append(f"{m * 100:>8.0f}%")
            else:
                cel.append(f"{m:>9.0f}")
        aviso = "  amostra pequena" if len(rs) < 10 else ""
        print(f"  {g:10} {len(rs):>4} " + " ".join(cel) + aviso)


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--fmt", default="R", choices=["R", "C"])
    a = ap.parse_args()
    corte = dt.date.today() - dt.timedelta(days=7)
    ps = [r for r in carregar() if r["fmt"] == a.fmt and r["data"] <= corte and r["hora"]]
    for r in ps:
        h, m = map(int, r["hora"].split(":"))
        d = r["data"]
        if h >= 21:  # data em UTC; hora em Brasilia
            d -= dt.timedelta(days=1)
        r["_faixa"], r["_dia"], r["_mes"] = faixa(h), DIAS[d.weekday()], d.strftime("%Y-%m")

    nome = "Reels" if a.fmt == "R" else "Carrosseis"
    print(f"{nome}: {len(ps)} posts ate {corte} (mediana por grupo; ret em segundos absolutos).")
    print("Descreve o que aconteceu. Grupos se confundem entre si (mes, tema, formato do video).")

    for chave, titulo, ordem in [
        ("_faixa", "Horario de Brasilia", [f[2] for f in FAIXAS]),
        ("_dia", "Dia da semana (Brasilia)", DIAS),
        ("_mes", "Mes", sorted({r["_mes"] for r in ps})),
        ("eixo", "Eixo", sorted({r["eixo"] for r in ps})),
        ("cta", "Chamada (C=COMECAR, P=oferta, N=outra)", ["C", "P", "N"]),
    ]:
        g = defaultdict(list)
        for r in ps:
            g[r[chave]].append(r)
        tabela(titulo, g, ordem, a.fmt)

    print("\nHorario dentro de cada mes (alcance mediano, n):")
    meses = sorted({r["_mes"] for r in ps})
    print(f"  {'faixa':8} " + " ".join(f"{m[2:]:>12}" for m in meses))
    for _, _, f in FAIXAS:
        cel = []
        for m in meses:
            v = [num(r["alcance"]) for r in ps if r["_faixa"] == f and r["_mes"] == m]
            cel.append(f"{st.median(v):>7.0f} ({len(v):>2})" if v else f"{'-':>12}")
        print(f"  {f:8} " + " ".join(cel))


if __name__ == "__main__":
    main()
