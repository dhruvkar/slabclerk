#!/usr/bin/env bash
# Remotion writes ~1.4MB per demo. These are flat-color static UI, so they
# recompress to ~13% with no visible loss. Run after copying a render into
# assets/. Verifies frame count before replacing anything.
#
#   scripts/compress_videos.sh [file.mp4 ...]     (default: all of assets/*.mp4)
set -euo pipefail
cd "$(dirname "$0")/.."
files=("$@"); [ ${#files[@]} -eq 0 ] && files=(assets/*.mp4)
for f in "${files[@]}"; do
  before=$(stat -c%s "$f")
  # already compressed? skip anything under 400KB
  if [ "$before" -lt 409600 ]; then printf "%-28s skip (already %dKB)\n" "$f" $((before/1024)); continue; fi
  tmp="/tmp/cv_$(basename "$f")"
  ffmpeg -y -hide_banner -loglevel error -i "$f" \
    -c:v libx264 -preset veryslow -crf 30 -pix_fmt yuv420p -g 300 \
    -movflags +faststart -an "$tmp"
  fb=$(ffprobe -v error -select_streams v:0 -count_frames -show_entries stream=nb_read_frames -of csv=p=0 "$f" | tr -d ',')
  fa=$(ffprobe -v error -select_streams v:0 -count_frames -show_entries stream=nb_read_frames -of csv=p=0 "$tmp" | tr -d ',')
  after=$(stat -c%s "$tmp")
  if [ "$fb" = "$fa" ] && [ "$after" -gt 20000 ]; then
    mv "$tmp" "$f"
    printf "%-28s %5dKB -> %4dKB  (%d%%)\n" "$f" $((before/1024)) $((after/1024)) $((100*after/before))
  else
    rm -f "$tmp"
    printf "%-28s REJECTED (frames %s vs %s)\n" "$f" "$fb" "$fa" >&2
  fi
done
