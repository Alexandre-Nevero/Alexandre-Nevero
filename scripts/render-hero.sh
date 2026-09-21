#!/bin/sh
set -eu

root=$(CDPATH= cd -- "$(dirname "$0")/.." && pwd)
html="$root/assets/hero.html"
out="$root/assets/profile-hero.png"
chrome="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"

if [ ! -x "$chrome" ]; then
  printf 'Google Chrome is required to render the profile hero.\n' >&2
  exit 1
fi

"$chrome" \
  --headless=new \
  --disable-gpu \
  --hide-scrollbars \
  --force-device-scale-factor=1 \
  --window-size=2048,1276 \
  --default-background-color=111516 \
  --virtual-time-budget=12000 \
  --screenshot="$out" \
  "file://$html"

printf 'Wrote %s\n' "$out"
