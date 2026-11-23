#!/bin/bash
# Uso: scripts/sheet.sh salida.png frame1 frame2 ...  (une previews en una hoja)
out=$1; shift
args=(); n=0
for f in "$@"; do args+=(-i "out/preview/frame-$f.png"); n=$((n+1)); done
ffmpeg -y -loglevel error "${args[@]}" -filter_complex "hstack=inputs=$n" "$out"
