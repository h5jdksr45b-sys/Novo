#!/usr/bin/env bash
# Uso: ./vinheta.sh <nome> <check|snap|render> [tempos]
# Copia fontes/<nome>.html para index.html e roda o comando do HyperFrames.
set -euo pipefail
cd "$(dirname "$0")"
nome="$1"; acao="$2"
cp "fontes/$nome.html" index.html
HF="npx --yes hyperframes@0.8.159"
case "$acao" in
  check)  $HF check ;;
  snap)   $HF snapshot --at "${3:-1,3,5}" -o "snaps/$nome" ;;
  render) $HF render -o "renders/$nome.mp4" --fps 30 -q delivery ;;
esac
