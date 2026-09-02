# Cafe Gopala — launch TODO (parked 19 Aug 2026, pooja day at the new place)

No hurry: place settles ~1 week, live data expected within a month. Revisit then.

## When the real-world data exists

- [ ] **Hours + phone** in the Visit section of index.html (search "EDIT" — both
      are still bracketed placeholders, tel: is 0000000000). THE priority once known.
- [ ] **WhatsApp click-to-chat button** — same commit as the phone number
      (link: https://wa.me/91XXXXXXXXXX).
- [ ] **Google Business Profile** — claim the Maps pin (currently still "SRS Boys
      PG and Guest House"). Start early: Google posts a verification postcard.
      This is the biggest "vegetarian restaurant near me" discoverability lever.
- [ ] Real photos of the cafe/dishes into pics/ as service starts.

## YouTube / help videos

- [ ] Re-record videos 2 & 3 (`./make-videos.sh --only reserve` / `--only promo`)
      to regenerate captions, then `captions-to-srt.py` for their .srt files.
- [ ] Upload all 3 + subtitles to @cafeGopala (yt-studio-uploader project
      "cafegopala" is configured; create playlist "Cafe Gopala — How to" first).
- [ ] Add the video links to the website (order/reserve/footer) — paste URLs to
      Claude and it wires them.

## Ten-second checks after next deploy

- [ ] Tap each homepage category pill → should land on the matching section of
      the live menu. A miss = POS category name doesn't contain the pill's hint
      word (chaat/starter/main/sweet) — tell Claude the real name to fix.
- [ ] Send hello@cafegopala.in → Gmail → Show original → SPF/DKIM/DMARC all PASS.

## Nice to have (no deadline)

- [ ] Hero video: poster-first / lazy load on mobile data.
- [ ] DMARC p=none → p=quarantine after a few clean reports arrive.
- [ ] Delivery, when it comes: fork at CHECKOUT not homepage — flip the hero
      "Coming soon" card, the menu-cta hint, the order.html banner, and add
      Collect/Deliver at checkout (or Swiggy links). Decision recorded in the
      Guhya project notes.

## Housekeeping

- [ ] Commit video/qa-screens.mjs, video/captions-to-srt.py, video/.gitignore.
