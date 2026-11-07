#!/usr/bin/env bash
# Extrai quadros de checagem: ./check-frames.sh Vertical 170 340 ...
set -e
c=$1; shift
for f in "$@"; do
  npx remotion still BorderlineNoCaps$c frames/$c-$f.png --frame=$f --log=error
done
