#!/usr/bin/env python3
"""Diagnostico descritivo do alcance, a partir do historico editorial.

Le ../historico-borderline-180d/references/posts-180d.psv.

Uso (a partir da pasta da skill):
    python3 -I scripts/diagnostico.py                # janela de 30 dias contra os 30 anteriores
    python3 -I scripts/diagnostico.py --janela 14    # janelas de 14 dias
    python3 -I scripts/diagnostico.py --fmt R        # so Reels (R), carrosseis (C) ou imagens (I)
    python3 -I scripts/diagnostico.py --checar       # so as checagens de consistencia
    python3 -I scripts/diagnostico.py --mensal       # medianas mes a mes, por formato

Descreve o que mudou entre dois periodos. Nao calcula nota, limiar, previsao
nem causa. Posts dos ultimos 7 dias do arquivo ficam fora da comparacao,
porque ainda acumulam numeros.
"""
import argparse
import datetime as dt
import pathlib
import statistics
import sys

ARQ = (pathlib.Path(__file__).resolve().parent.parent.parent
       / "historico-borderline-180d" / "references" / "posts-180d.psv")
COLS = ["data", "fmt", "codigo", "views", "alcance", "compart", "salvos",
        "curtidas", "coment", "ret_ms", "skip3s", "cta", "eixo", "flags", "tese"]
NUM = ["views", "alcance", "compart", "salvos", "curtidas", "coment", "ret_ms", "skip3s"]
FMT = {"R": "Reels", "C": "Carrosseis", "I": "Imagens"}
CARENCIA = 7


def carregar():
    if not ARQ.exists():
        sys.exit(f"historico nao encontrado: {ARQ}")
    linhas = []
    cabecalho_visto = False
    with ARQ.open(encoding="utf-8") as f:
        for n, bruta in enumerate(f, 1):
            bruta = bruta.rstrip("\n")
            if not bruta or bruta.startswith("#"):
                continue
            campos = bruta.split("|")
            if not cabecalho_visto:
                if campos != COLS:
                    sys.exit(f"linha {n}: cabecalho inesperado")
                cabecalho_visto = True
                continue
            if len(campos) != len(COLS):
                sys.exit(f"linha {n}: {len(campos)} campos, esperado {len(COLS)}")
            r = dict(zip(COLS, campos))
            r["data"] = dt.date.fromisoformat(r["data"])
            for c in NUM:
                r[c] = float(r[c]) if r[c] else None
            r["copias"] = [float(c.split(":")[1])
                           for f in r["flags"].split(",") if f.startswith("cop=")
                           for c in f[4:].split("&")]
            linhas.append(r)
    return linhas


def checar(posts):
    avisos = []
    for r in posts:
        if r["views"] is not None and r["alcance"] is not None and r["alcance"] > r["views"]:
            avisos.append(f"{r['data']} {r['codigo']}: alcance maior que views")
        for c in ("views", "alcance", "compart", "salvos"):
            if r[c] is None:
                avisos.append(f"{r['data']} {r['codigo']}: {c} ausente")
        if r["fmt"] == "R" and r["ret_ms"] is None:
            avisos.append(f"{r['data']} {r['codigo']}: Reel sem tempo medio assistido")
    return avisos


def mediana(valores):
    v = [x for x in valores if x is not None]
    return statistics.median(v) if v else None


def por_mil(posts, campo):
    return mediana([r[campo] / r["views"] * 1000 for r in posts
                    if r[campo] is not None and r["views"]])


def fmt_num(x, casas=0):
    if x is None:
        return "n/d"
    return f"{x:,.{casas}f}".replace(",", ".") if casas == 0 else f"{x:.{casas}f}"


def resumo(posts):
    reels = [r for r in posts if r["fmt"] == "R"]
    tent = [r["views"] for r in posts] + [c for r in posts for c in r["copias"]]
    return {
        "posts": len(posts),
        "repostagens": sum(len(r["copias"]) for r in posts),
        "views por tentativa (mediana)": fmt_num(mediana(tent)),
        "views (mediana)": fmt_num(mediana([r["views"] for r in posts])),
        "alcance (mediana)": fmt_num(mediana([r["alcance"] for r in posts])),
        "compart. por mil views": fmt_num(por_mil(posts, "compart"), 1),
        "salvos por mil views": fmt_num(por_mil(posts, "salvos"), 1),
        "tempo medio assistido, s (Reels)": fmt_num(
            (mediana([r["ret_ms"] for r in reels]) or 0) / 1000 if reels else None, 1),
        "saida em 3 s (Reels)": fmt_num(mediana([r["skip3s"] for r in reels]), 2),
    }


def mensal(posts, corte, fmt):
    print(f"\nMedianas por mes de publicacao (posts ate {corte}).")
    for g in [fmt] if fmt else ["R", "C"]:
        print(f"\n{FMT[g]}")
        print(f"  {'mes':7}  {'posts':>5}  {'tentativas':>10}  {'views':>8}  {'views/tent.':>11}  "
              f"{'alcance':>8}  {'compart/mil':>11}  {'ret s':>5}")
        meses = sorted({r["data"].strftime("%Y-%m") for r in posts if r["fmt"] == g and r["data"] <= corte})
        for m in meses:
            sel = [r for r in posts if r["fmt"] == g and r["data"] <= corte
                   and r["data"].strftime("%Y-%m") == m]
            ret = mediana([r["ret_ms"] for r in sel])
            tent = [r["views"] for r in sel] + [c for r in sel for c in r["copias"]]
            print(f"  {m:7}  {len(sel):>5}  {len(tent):>10}  {fmt_num(mediana([r['views'] for r in sel])):>8}  "
                  f"{fmt_num(mediana(tent)):>11}  "
                  f"{fmt_num(mediana([r['alcance'] for r in sel])):>8}  "
                  f"{fmt_num(por_mil(sel, 'compart'), 1):>11}  "
                  f"{fmt_num(ret / 1000 if ret else None, 1):>5}")
    print("\nviews/tent.: mediana de views contando cada repostagem como uma tentativa. O historico")
    print("guarda so a copia de mais views na linha principal. Quando ha muitas repostagens, compare")
    print("por tentativa, nao pela linha principal.")
    print("Meses com poucos posts oscilam muito. O primeiro e o ultimo mes podem estar incompletos.")


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--janela", type=int, default=30)
    ap.add_argument("--fmt", choices=["R", "C", "I"])
    ap.add_argument("--checar", action="store_true")
    ap.add_argument("--mensal", action="store_true")
    a = ap.parse_args()

    posts = carregar()
    fim_arquivo = posts[0]["data"]
    hoje = dt.date.today()
    print(f"Historico: {len(posts)} publicacoes, de {posts[-1]['data']} a {fim_arquivo}.")
    print(f"Hoje: {hoje}. Ultima publicacao registrada ha {(hoje - fim_arquivo).days} dia(s).")
    if (hoje - fim_arquivo).days > 2:
        print("AVISO: historico desatualizado. Diga isso ao entregar qualquer leitura.")

    avisos = checar(posts)
    print(f"\nChecagens de consistencia: {len(avisos)} aviso(s).")
    for x in avisos[:20]:
        print(f"  {x}")
    if len(avisos) > 20:
        print(f"  ... e mais {len(avisos) - 20}")
    if a.checar:
        return

    corte = fim_arquivo - dt.timedelta(days=CARENCIA)
    if a.mensal:
        mensal(posts, corte, a.fmt)
        return

    atual_ini = corte - dt.timedelta(days=a.janela)
    ant_ini = atual_ini - dt.timedelta(days=a.janela)
    base = [r for r in posts if not a.fmt or r["fmt"] == a.fmt]
    atual = [r for r in base if atual_ini < r["data"] <= corte]
    anterior = [r for r in base if ant_ini < r["data"] <= atual_ini]

    print(f"\nPeriodo atual:    {atual_ini + dt.timedelta(days=1)} a {corte}")
    print(f"Periodo anterior: {ant_ini + dt.timedelta(days=1)} a {atual_ini}")
    print(f"Fora da comparacao: posts depois de {corte} (menos de {CARENCIA} dias no arquivo).")

    grupos = [a.fmt] if a.fmt else ["R", "C"]
    for g in grupos:
        at = [r for r in atual if r["fmt"] == g]
        an = [r for r in anterior if r["fmt"] == g]
        print(f"\n{FMT[g]}")
        ra, rn = resumo(an), resumo(at)
        largura = max(len(k) for k in ra)
        print(f"  {'':{largura}}  {'anterior':>10}  {'atual':>10}")
        for k in ra:
            print(f"  {k:{largura}}  {ra[k]:>10}  {rn[k]:>10}")
        if min(len(at), len(an)) < 30:
            print("  Amostra abaixo de 30 posts em pelo menos um periodo. Descreve, nao prova causa.")

    print("\nLeitura: mediana resiste a um post fora da curva. Alcance, views, compartilhamentos,")
    print("salvamentos e retencao sao metricas diferentes. Nenhum numero aqui diz por que mudou.")


if __name__ == "__main__":
    main()
