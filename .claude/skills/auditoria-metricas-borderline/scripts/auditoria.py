#!/usr/bin/env python3
"""Auditoria descritiva das metricas de @drfabioschmidt.

Le o arquivo da skill historico-borderline-180d (references/posts-180d.psv).

Uso (a partir da pasta da skill):
    python3 -I scripts/auditoria.py                    # Reels: alcance semana a semana
    python3 -I scripts/auditoria.py --ranking 5        # 5 acima e 5 abaixo da mediana de alcance
    python3 -I scripts/auditoria.py --grupo eixo       # comparacao por eixo (ou cta)
    python3 -I scripts/auditoria.py --copias           # reenvios do mesmo conteudo
    python3 -I scripts/auditoria.py --post CODIGO      # um post contra a mediana do formato
Filtros: --fmt R|C|I (padrao R), --desde AAAA-MM-DD, --ate AAAA-MM-DD,
         --incluir-recentes (por padrao, os ultimos 7 dias do arquivo ficam fora).

Este script descreve o arquivo. Nao calcula nota, limiar, previsao nem causa.
"""
import argparse
import datetime as dt
import pathlib
import statistics
import sys

ARQ = (pathlib.Path(__file__).resolve().parents[2]
       / "historico-borderline-180d" / "references" / "posts-180d.psv")
COLS = ["data", "fmt", "codigo", "views", "alcance", "compart", "salvos",
        "curtidas", "coment", "ret_ms", "skip3s", "cta", "eixo", "flags", "tese"]
NUM = ["views", "alcance", "compart", "salvos", "curtidas", "coment"]
FMT = {"R": "Reels", "C": "Carrosseis", "I": "Imagens"}
AMOSTRA_MIN = 30


def carregar():
    if not ARQ.exists():
        sys.exit(f"Arquivo nao encontrado: {ARQ}")
    linhas, cab = [], False
    with ARQ.open(encoding="utf-8") as f:
        for n, bruta in enumerate(f, 1):
            bruta = bruta.rstrip("\n")
            if not bruta or bruta.startswith("#"):
                continue
            c = bruta.split("|")
            if not cab:
                if c != COLS:
                    sys.exit(f"linha {n}: cabecalho inesperado")
                cab = True
                continue
            if len(c) != len(COLS):
                sys.exit(f"linha {n}: {len(c)} campos, esperado {len(COLS)}")
            r = dict(zip(COLS, c))
            r["data"] = dt.date.fromisoformat(r["data"])
            for k in NUM:
                r[k] = int(r[k]) if r[k] else None
            r["ret_s"] = int(r["ret_ms"]) / 1000 if r["ret_ms"] else None
            r["fica3s"] = 1 - float(r["skip3s"]) if r["skip3s"] else None
            a = r["alcance"]
            r["compart_alc"] = r["compart"] / a if a and r["compart"] is not None else None
            r["salvos_alc"] = r["salvos"] / a if a and r["salvos"] is not None else None
            linhas.append(r)
    return linhas


def med(vals):
    v = [x for x in vals if x is not None]
    return statistics.median(v) if v else None


def pct(x, casas=2):
    return "-" if x is None else f"{x * 100:.{casas}f}%"


def seg(x):
    return "-" if x is None else f"{x:.1f}s"


def inteiro(x):
    return "-" if x is None else f"{x:,.0f}".replace(",", ".")


def linha_post(r, base):
    mult = r["alcance"] / base if base and r["alcance"] is not None else None
    return (f"  {'-' if mult is None else f'{mult:5.2f}x'}  {r['data']}  {r['codigo']:12} "
            f"alc {inteiro(r['alcance']):>7}  views {inteiro(r['views']):>7}  "
            f"comp/alc {pct(r['compart_alc']):>6}  salv/alc {pct(r['salvos_alc']):>6}  "
            f"fica3s {pct(r['fica3s'], 0):>4}  ret {seg(r['ret_s']):>6}  {r['eixo']}  "
            f"{r['tese'][:70]}")


def cabecalho(sel, fmt, fim_arq, recentes):
    print(f"{FMT[fmt]}: {len(sel)} publicacoes, de {sel[-1]['data']} a {sel[0]['data']}.")
    print(f"Ultima publicacao no arquivo: {fim_arq}. Hoje: {dt.date.today()} "
          f"({(dt.date.today() - fim_arq).days} dia(s) de defasagem).")
    if not recentes:
        print("Posts dos ultimos 7 dias do arquivo ficaram fora (ainda acumulam numeros).")
    print(f"Mediana de alcance: {inteiro(med(r['alcance'] for r in sel))}. "
          f"Mediana de views: {inteiro(med(r['views'] for r in sel))}.")
    if fmt == "R":
        print("ret = tempo medio assistido, absoluto. Sem a duracao do Reel, nao vira percentual.")
    print()


def semanal(sel):
    sem = {}
    for r in sel:
        ini = r["data"] - dt.timedelta(days=r["data"].weekday())
        sem.setdefault(ini, []).append(r)
    print("Semana (seg)  n  alcance med  views med  comp/alc med  salv/alc med  fica3s med")
    for ini in sorted(sem):
        g = sem[ini]
        print(f"  {ini}  {len(g):2}  {inteiro(med(r['alcance'] for r in g)):>11}  "
              f"{inteiro(med(r['views'] for r in g)):>9}  {pct(med(r['compart_alc'] for r in g)):>12}  "
              f"{pct(med(r['salvos_alc'] for r in g)):>12}  {pct(med(r['fica3s'] for r in g), 0):>10}")
    print("\nCada semana tem poucos posts. Leia a tendencia ao longo de varias semanas, "
          "nao a diferenca entre duas.")


def ranking(sel, n):
    base = med(r["alcance"] for r in sel)
    orden = sorted((r for r in sel if r["alcance"] is not None),
                   key=lambda r: r["alcance"], reverse=True)
    print(f"Multiplo = alcance do post / mediana de alcance do periodo ({inteiro(base)}).\n")
    print(f"{n} ACIMA")
    for r in orden[:n]:
        print(linha_post(r, base))
    print(f"\n{n} ABAIXO")
    for r in orden[-n:]:
        print(linha_post(r, base))
    print("\nOs extremos mostram onde olhar. Nao dizem por que um post alcancou mais.")


def grupos(sel, campo):
    g = {}
    for r in sel:
        g.setdefault(r[campo], []).append(r)
    print(f"Por {campo}. Medianas. '*' = menos de {AMOSTRA_MIN} posts, amostra pequena.\n")
    print("grupo   n   alcance med  comp/alc med  salv/alc med  fica3s med  ret med")
    for k, rs in sorted(g.items(), key=lambda kv: -len(kv[1])):
        aviso = "*" if len(rs) < AMOSTRA_MIN else " "
        print(f"  {k:3}{aviso} {len(rs):3}  {inteiro(med(r['alcance'] for r in rs)):>11}  "
              f"{pct(med(r['compart_alc'] for r in rs)):>12}  {pct(med(r['salvos_alc'] for r in rs)):>12}  "
              f"{pct(med(r['fica3s'] for r in rs), 0):>10}  {seg(med(r['ret_s'] for r in rs)):>7}")
    print("\nDiferenca entre grupos e descricao. Tema, data, formato e gancho variam juntos.")


def copias(sel):
    achou = False
    for r in sel:
        cops = [c for c in r["flags"].split(",") if c.startswith("cop=")]
        if not cops:
            continue
        achou = True
        outros = []
        for item in cops[0][4:].split("&"):
            cod, _, v = item.partition(":")
            outros.append(f"{cod} {inteiro(int(v)) if v.isdigit() else v} views")
        print(f"  {r['data']} {r['codigo']} {inteiro(r['views'])} views | reenvios: "
              f"{'; '.join(outros)}  {r['tese'][:60]}")
    if not achou:
        print("Nenhum reenvio no recorte.")
    else:
        print("\nOs dados nao dizem por que reenvios do mesmo conteudo alcancam diferente.")


def post(todos, codigo, fmt):
    r = next((x for x in todos if x["codigo"] == codigo), None)
    if not r:
        sys.exit(f"Codigo {codigo} nao encontrado.")
    mesmos = [x for x in todos if x["fmt"] == r["fmt"]]
    base = med(x["alcance"] for x in mesmos)
    print(f"{r['codigo']} ({FMT[r['fmt']]}, {r['data']}, eixo {r['eixo']}, cta {r['cta']})")
    print(f"  tese: {r['tese']}")
    if r["flags"]:
        print(f"  flags: {r['flags']}")
    print(f"\n  {'metrica':16} {'post':>10} {'mediana do formato':>20}")
    for nome, k, f in [("alcance", "alcance", inteiro), ("views", "views", inteiro),
                       ("compart", "compart", inteiro), ("salvos", "salvos", inteiro),
                       ("comp/alcance", "compart_alc", pct), ("salv/alcance", "salvos_alc", pct),
                       ("fica 3s", "fica3s", pct), ("tempo assistido", "ret_s", seg)]:
        print(f"  {nome:16} {f(r[k]):>10} {f(med(x[k] for x in mesmos)):>20}")
    if base and r["alcance"] is not None:
        print(f"\n  Multiplo de alcance: {r['alcance'] / base:.2f}x a mediana de {len(mesmos)} "
              f"{FMT[r['fmt']].lower()} em 180 dias.")
    if (todos[0]["data"] - r["data"]).days < 7:
        print("  Post dos ultimos 7 dias do arquivo: os numeros ainda podem subir.")


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--fmt", default="R", choices=list(FMT))
    ap.add_argument("--desde", type=dt.date.fromisoformat)
    ap.add_argument("--ate", type=dt.date.fromisoformat)
    ap.add_argument("--incluir-recentes", action="store_true")
    ap.add_argument("--ranking", type=int)
    ap.add_argument("--grupo", choices=["eixo", "cta"])
    ap.add_argument("--copias", action="store_true")
    ap.add_argument("--post")
    a = ap.parse_args()

    todos = carregar()
    if a.post:
        return post(todos, a.post, a.fmt)
    fim = todos[0]["data"]
    sel = [r for r in todos if r["fmt"] == a.fmt]
    if not a.incluir_recentes:
        sel = [r for r in sel if (fim - r["data"]).days >= 7]
    if a.desde:
        sel = [r for r in sel if r["data"] >= a.desde]
    if a.ate:
        sel = [r for r in sel if r["data"] <= a.ate]
    if not sel:
        sys.exit("Nenhuma publicacao no recorte.")

    cabecalho(sel, a.fmt, fim, a.incluir_recentes)
    if a.ranking:
        ranking(sel, a.ranking)
    elif a.grupo:
        grupos(sel, a.grupo)
    elif a.copias:
        copias(sel)
    else:
        semanal(sel)


if __name__ == "__main__":
    main()
