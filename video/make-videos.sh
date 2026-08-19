#!/usr/bin/env bash
# ─────────────────────────────────────────────────────────────────────────────
# Cafe Gopala — build the customer how-to videos.
#
#   ./make-videos.sh                  record everything, then build the MP4s
#   ./make-videos.sh --only reserve   just the one that matches
#   ./make-videos.sh --build-only     skip recording, restitch what is there
#
# Needs: a demo POS to record against (POS_BASE_URL, default localhost:8010),
# node + Playwright chromium, and ffmpeg.
#
# This is deliberately simpler than the POS repo's equivalent: one test per
# file here, so there is none of the chapter-ordering machinery that one needs.
# ─────────────────────────────────────────────────────────────────────────────
set -euo pipefail
trap 'echo "✗ failed at line $LINENO: $BASH_COMMAND" >&2' ERR
cd "$(dirname "$0")"

SLOWMO="${SLOWMO:-650}"                       # unhurried; every tap visible
POS="${POS_BASE_URL:-http://localhost:8010}"
OUT_DIR="out"
SPECS=(tests/01-order-and-collect.spec.js
       tests/02-reserve-a-table.spec.js
       tests/03-promo-and-credit.spec.js)

nice_name() {
  case "$1" in
    01-order-and-collect) echo "Cafe Gopala - How to order online and collect";;
    02-reserve-a-table)   echo "Cafe Gopala - How to book a table and choose your dishes";;
    03-promo-and-credit)  echo "Cafe Gopala - How to use a promo code or your credit";;
    *)                    echo "Cafe Gopala - $1";;
  esac
}

# ── never against production ────────────────────────────────────────────────
# The specs place orders, hold tables and verify email addresses. Recording
# against the real POS would put demo rows in the cafe's own day.
case "$(echo "$POS" | tr '[:upper:]' '[:lower:]')" in
  *app.fastpos.in*|*pos.cafegopal*)
    echo "✗ POS_BASE_URL points at the LIVE POS ($POS)."
    echo "  These recordings place real orders. Point it at a demo server."
    exit 1;;
esac

command -v ffmpeg >/dev/null || { echo "✗ ffmpeg not found — brew install ffmpeg"; exit 1; }

BUILD_ONLY=0; ONLY=""
while [[ $# -gt 0 ]]; do
  case "$1" in
    --build-only) BUILD_ONLY=1 ;;
    --only) ONLY="${2:-}"; shift ;;
    *) echo "✗ unknown argument: $1 (use --build-only and/or --only <pattern>)"; exit 1 ;;
  esac
  shift
done

if [[ -n "$ONLY" ]]; then
  filtered=()
  for s in "${SPECS[@]}"; do [[ "$s" == *"$ONLY"* ]] && filtered+=("$s"); done
  [[ ${#filtered[@]} -gt 0 ]] || { echo "✗ --only '$ONLY' matches nothing"; exit 1; }
  SPECS=("${filtered[@]}")
  echo "▶ limited to: ${SPECS[*]}"
fi

if [[ "$BUILD_ONLY" == "0" ]]; then
  echo -n "▶ waiting for the demo POS at $POS "
  ok=0
  for _ in $(seq 1 45); do
    if curl -sf -o /dev/null "$POS"; then ok=1; break; fi
    echo -n "."; sleep 2
  done
  echo
  [[ $ok -eq 1 ]] || {
    echo "✗ nothing answering at $POS."
    echo "  Start the throwaway stack in the POS repo:"
    echo "    docker compose -f docker-compose.e2e.yml up --build -d"
    exit 1; }

  [[ -d node_modules ]] || { echo "▶ npm install…"; npm install; }
  echo "▶ ensuring Playwright chromium is installed…"
  npx playwright install chromium

  echo "▶ recording at SLOWMO=${SLOWMO}ms…"
  rm -rf test-results
  HOWTO=1 SLOWMO=$SLOWMO POS_BASE_URL="$POS" npx playwright test --retries=1 "${SPECS[@]}" || {
    echo
    echo "✗ something failed — only the PASSING recordings are built below."
    echo "  Detail:  npx playwright show-report"
  }
fi

mkdir -p "$OUT_DIR"

for spec in "${SPECS[@]}"; do
  base="$(basename "$spec" .spec.js)"
  name="$(nice_name "$base")"

  # One test per spec, so the recording is simply the newest result dir for it
  # that did not leave a failure screenshot behind.
  dir=""
  for d in $(ls -dt test-results/${base}-* 2>/dev/null || true); do
    compgen -G "$d/test-failed-*.png" >/dev/null && continue     # failed attempt
    [[ -f "$d/video.webm" ]] || continue
    dir="$d"; break
  done
  [[ -n "$dir" ]] || { echo "  ✗ no passing recording for $base — skipped"; continue; }

  echo "▶ building ${OUT_DIR}/${name}.mp4"
  title="$(echo "$name" | sed -E 's/^Cafe Gopala - //')"
  cardpng="$OUT_DIR/.card-$base.png"
  card="$OUT_DIR/.card-$base.mp4"
  clip="$OUT_DIR/.clip-$base.mp4"

  node make-title-card.mjs "$title" "$cardpng"
  # Silent audio on the card so it concatenates cleanly with the narrated clip.
  ffmpeg -y -loglevel error -loop 1 -t 2.8 -i "$cardpng" \
    -f lavfi -t 2.8 -i "anullsrc=r=44100:cl=stereo" \
    -r 25 -pix_fmt yuv420p -vf "scale=1280:800" -c:v libx264 -c:a aac "$card"

  caps="$dir/captions.json"; [[ -f "$caps" ]] || caps="NONE"
  python3 narrate-clip.py "$dir/video.webm" "$caps" "$clip"

  printf "file '%s'\nfile '%s'\n" "$(basename "$card")" "$(basename "$clip")" > "$OUT_DIR/.list-$base.txt"
  (cd "$OUT_DIR" && ffmpeg -y -loglevel error -f concat -safe 0 -i ".list-$base.txt" -c copy "$name.mp4")
  rm -f "$cardpng" "$card" "$clip" "$OUT_DIR/.list-$base.txt"
done

echo
echo "✓ done — MP4s in $(pwd)/$OUT_DIR"
ls -1sh "$OUT_DIR"/*.mp4 2>/dev/null || true
