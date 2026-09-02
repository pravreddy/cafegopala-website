# Cafe Gopala — how-to videos

Narrated screen recordings of **this website**, for customers: how to order and
collect, how to book a table, how to use a promo code or store credit.

## Why these live here and not in the POS repo

They are Cafe Gopala's marketing, not FastPOS's documentation. The POS is a
product sold to many restaurants; this is one restaurant's brand. Keeping the
branded voice, wording, title cards and published videos inside the brand's own
repository means the cafe owns its own material — which matters if the name is
ever trademarked, if the videos are used in promotion, or if the two things end
up with different owners. A shared repo would have quietly made every future
FastPOS tenant carry Cafe Gopala's advertising.

**The cost, stated plainly.** This folder needs Node, Playwright, ffmpeg, and a
POS to record against. And `narrate-clip.py` is a copy of the same file in the
POS repo — it is generic glue (video + captions → narrated MP4, no FastPOS or
Cafe Gopala knowledge in it), but it is now in two places and a fix to one is
not a fix to the other. That is the honest price of the separation. If it ever
starts drifting, it should become a small shared package rather than a third
copy.

**What is NOT duplicated:** nothing reads the POS source. This folder talks to a
POS over HTTP only — a URL and a login — exactly as the website itself does in
production. That is the real boundary, and it is the one worth protecting.

## Recording

You need a POS to record against, with the E2E test hooks on. The throwaway
stack from the POS repo is the easy one:

```bash
# in the POS repo, once:
docker compose -f docker-compose.e2e.yml up --build -d

# here:
cd video
npm install
npx playwright install chromium
./make-videos.sh
```

MP4s land in `video/out/`. Upload them wherever the cafe's videos live, and put
the links in the website's help section.

### Pointing at a different POS

```bash
POS_BASE_URL=https://staging.example.com \
POS_REGISTER=DEMO001 POS_USER=owner POS_PASSWORD=demo-pass-123 \
./make-videos.sh
```

**Never point this at the live POS.** The specs place orders, hold tables and
verify email addresses. They are written for a throwaway demo tenant and will
create real records anywhere else. `make-videos.sh` refuses to run against
`app.fastpos.in` for that reason.

### Voice

`narrate-clip.py` speaks each on-screen caption at the moment it appears. It
picks a voice automatically: Google Cloud TTS if `GOOGLE_TTS_KEY` is set, then
`edge-tts` (free, no key: `pip install edge-tts`), then macOS `say`. Set
`NARRATE=0` for a silent recording.

## Files

| file | what it is |
|---|---|
| `tests/*.spec.js` | the three walkthroughs — the script, effectively |
| `support/narration.js` | logs when each caption appeared, for the voiceover |
| `support/caption.js` | draws the on-screen caption bubble |
| `support/demo-pos.js` | serves this site locally and points it at the demo POS |
| `make-title-card.mjs` | the Cafe Gopala title card between chapters |
| `narrate-clip.py` | caption timings + video → narrated MP4 (copy; see above) |
| `make-videos.sh` | runs the specs and builds the MP4s |
