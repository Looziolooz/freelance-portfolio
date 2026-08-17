#!/usr/bin/env bash
# Captures real imagery from each live demo build for the brand manual
# (BrandDeck): the hero, then two scrolled views. Those three frames carry the
# site's own photography, its real logo in the nav, and its real UI — which is
# what stops the guidelines pages reading like a template.
#
# Output: public/brand-shots/<slug>/1.jpg, 2.jpg, 3.jpg (1440×900).
# Re-run after a demo is redesigned. Requires the gstack browse daemon.
#
#   bash scripts/brand-shots.sh [slug ...]     # all sites, or just the listed ones

set -u
B="${BROWSE_BIN:-$HOME/.claude/skills/gstack/browse/dist/browse}"
OUT="$(cd "$(dirname "$0")/.." && pwd)/public/brand-shots"

SITES="
aliva|https://pileggi-olio.vercel.app/
yoga|https://yoga-two-beryl.vercel.app/
sushi|https://sushi-lyart-ten.vercel.app/
brado|https://brado-vert.vercel.app/
gelateria|https://gelateria-theta.vercel.app/
ai-visibility|https://ai-visibility-rho.vercel.app/
vespa-heritage|https://vespa-heritage.vercel.app/
bella-calabria|https://bella-calabria.vercel.app/
brasilena|https://brasilena-website.vercel.app/
barberia|https://barberia-ashy-beta.vercel.app/en
fotografo|https://fotografo-five.vercel.app/en
aurelia|https://aurelia-seven-fawn.vercel.app/en
pizzeria-lorenzo|https://lorenzospizzaria.netlify.app/
weather-se|https://weather-se.netlify.app/
pizzeria-restaurant|https://pizzeria-restaurant.vercel.app/
nordbageriet|https://bakery-tan-two.vercel.app
buss-travel|https://buss-travel.vercel.app/
ferrari-f8-tributo|https://ferrari-delta-rose.vercel.app/
mirzz|https://energy-drink-mocha-ten.vercel.app/
"

WANTED="$*"
"$B" viewport 1440x900 </dev/null >/dev/null 2>&1

echo "$SITES" | while IFS='|' read -r slug url; do
  [ -z "$slug" ] && continue
  if [ -n "$WANTED" ] && ! echo " $WANTED " | grep -q " $slug "; then continue; fi

  mkdir -p "$OUT/$slug"
  # Re-asserted per site, not once before the loop: set only at the top it came
  # back 1280x720 for the last six sites of a run, and a 16:9 frame in a manual
  # styled for 16:10 gets its left and right edges cropped off by object-fit.
  "$B" viewport 1440x900 </dev/null >/dev/null 2>&1
  if ! "$B" goto "$url" </dev/null >/dev/null 2>&1; then
    echo "SKIP  $slug (unreachable)"
    continue
  fi
  sleep 5

  # Some demos open on an intro//splash that swallows the first paint; a scroll
  # nudge before the hero shot gets past it without losing the hero itself.
  "$B" </dev/null js "window.scrollTo(0,1); 1" >/dev/null 2>&1
  sleep 1
  "$B" </dev/null screenshot --viewport "$OUT/$slug/1.jpg" >/dev/null 2>&1

  "$B" </dev/null js "window.scrollTo(0, Math.round(innerHeight*1.15)); 1" >/dev/null 2>&1
  sleep 3
  "$B" </dev/null screenshot --viewport "$OUT/$slug/2.jpg" >/dev/null 2>&1

  "$B" </dev/null js "window.scrollTo(0, Math.round(innerHeight*2.4)); 1" >/dev/null 2>&1
  sleep 3
  "$B" </dev/null screenshot --viewport "$OUT/$slug/3.jpg" >/dev/null 2>&1

  echo "OK    $slug"
done
